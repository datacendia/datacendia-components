# Datacendia Infrastructure Upgrade Plan

**Version**: 1.0
**Date**: February 26, 2026
**Author**: Platform Engineering Review
**Classification**: Internal — Strategic Planning

---

## Executive Summary

This document outlines a phased infrastructure upgrade plan for the Datacendia platform. Each upgrade is **sovereign-compatible** (self-hosted, air-gapped capable, open-source or permissive license) and targets a specific gap identified through codebase analysis.

The upgrades are organized into three phases based on impact, effort, and dependency order.

---

## Current Infrastructure Audit

| Layer | Current Technology | Files | Status |
|-------|-------------------|-------|--------|
| LLM Inference | Ollama (singleton `OllamaService`) | 48 consumers, 1 service | ✅ Working |
| Model Routing | `AIModelSelector` (7 slots, 3 tiers) | `aiModels.ts` | ✅ Working |
| Guardrails | `CendiaSentryService` (11 types) | 1,380 lines | ✅ Working |
| Vector DB | Qdrant (`CendiaVector™`) | 758 lines | ✅ Working |
| Graph DB | Neo4j | 22 files, 101 refs | ✅ Working |
| Relational DB | PostgreSQL + Prisma | Platform-wide | ✅ Working |
| Cache/PubSub | Redis (ioredis) | `redis.ts` | ✅ Working |
| Event Bus | `ChronosEventBus` (Node EventEmitter) | 918 lines, 8 consumers | ⚠️ In-memory only |
| Event Stream | `DruidEventStream` (batch → Druid) | 339 lines | ⚠️ Lossy on failure |
| Analytics | ClickHouse + Apache Druid | `AnalyticsRouter`, `ClickHouseService`, `DruidService` | ✅ Working |
| Object Storage | MinIO (S3-compatible) | `MinioService` | ✅ Working |
| Identity | Keycloak (SSO/OIDC/SAML) | `KeycloakAuth.ts`, `SSOService.ts` | ✅ Working |
| Observability | OpenTelemetry → Tempo/Jaeger/Grafana | `tracing.ts`, `telemetry.ts` | ✅ Working |
| HSM | PKCS#11 (SoftHSM2, Thales, AWS CloudHSM) | `HSMAdapter.ts` | ✅ Working |
| Key Management | Custom KMS + Post-Quantum KMS | `KeyManagementService.ts` | ✅ Working |
| SBOM | `SBOMGenerator` + supply chain | 2 services | ✅ Working |
| Policy Engine | Custom `PolicyEngine` | `PolicyEngine.ts` | ✅ Working |
| Audit Ledger | `ImmutableAuditLedger` + Merkle trees | Multiple services | ✅ Working |
| Orchestration | Custom (Collapse, SGAS, SCGE) | 3 orchestrators | ⚠️ No crash recovery |
| Confidential Computing | Not present | — | ❌ Gap |
| Durable Event Log | Not present (Redis PubSub is fire-and-forget) | — | ❌ Gap |

---

## Phase 1: NVIDIA Stack (Weeks 1–6)

### 1.1 TensorRT-LLM + Triton Inference Server

**Priority**: 🔴 Critical
**Effort**: 1–2 weeks
**License**: Apache 2.0 (open source)
**Sovereign**: ✅ Fully self-hosted, air-gapped capable

#### Problem
`OllamaService` provides ~10–30 tokens/sec on consumer hardware. Council deliberations take 60–90 seconds. Not enterprise-grade.

#### Solution
Create an `InferenceProvider` interface that both Ollama and Triton implement. Swap via environment configuration.

#### Integration Points

**File to modify**: `backend/src/services/ollama.ts`

Current singleton pattern:
```typescript
class OllamaService {
  async generate(prompt: string, options: Partial<OllamaGenerateRequest>): Promise<string>
  async chat(messages: OllamaChatMessage[], options: Partial<OllamaChatRequest>): Promise<OllamaChatMessage>
  async embed(text: string, model?: string): Promise<number[]>
  async *streamChat(messages: OllamaChatMessage[], options: Partial<OllamaChatRequest>): AsyncGenerator<string>
}
```

New architecture:
```typescript
// backend/src/services/inference/InferenceProvider.ts
interface InferenceProvider {
  generate(prompt: string, options: GenerateOptions): Promise<string>;
  chat(messages: ChatMessage[], options: ChatOptions): Promise<ChatMessage>;
  embed(text: string, model?: string): Promise<number[]>;
  streamChat(messages: ChatMessage[], options: ChatOptions): AsyncGenerator<string>;
  isAvailable(): Promise<boolean>;
  resolveModel(requested?: string): Promise<string>;
}

// backend/src/services/inference/OllamaProvider.ts   — wraps existing OllamaService
// backend/src/services/inference/TritonProvider.ts    — new Triton gRPC client
// backend/src/services/inference/NIMProvider.ts       — new NIM self-hosted client
// backend/src/services/inference/index.ts             — factory, resolves via config
```

**Files affected**: 
- `backend/src/services/ollama.ts` — Refactor to implement `InferenceProvider`
- `backend/src/config/index.ts` — Add `INFERENCE_PROVIDER` env var
- **Zero changes** to the 48 consuming services (they import from `ollama.ts` which re-exports)

#### Environment Variables
```bash
INFERENCE_PROVIDER=ollama|triton|nim    # Default: ollama
TRITON_URL=localhost:8001               # Triton gRPC endpoint
TRITON_HTTP_URL=localhost:8000          # Triton HTTP endpoint
NIM_URL=localhost:8000                  # NIM self-hosted endpoint
```

#### Docker Compose Addition
```yaml
triton:
  image: nvcr.io/nvidia/tritoninferenceserver:24.12-py3
  ports:
    - "8000:8000"   # HTTP
    - "8001:8001"   # gRPC
    - "8002:8002"   # Metrics
  volumes:
    - ./models:/models
  deploy:
    resources:
      reservations:
        devices:
          - capabilities: [gpu]
```

#### Expected Performance
| Metric | Ollama | Triton/TensorRT-LLM |
|--------|--------|---------------------|
| Tokens/sec (32B model) | 10–30 | 100–300 |
| Council deliberation | 60–90s | 10–15s |
| Embedding generation | 200ms | 20ms |
| Concurrent requests | 1–2 | 10–50 |

#### Hardware Requirements
- NVIDIA GPU with ≥24GB VRAM (RTX 4090, A100, H100)
- NVIDIA Driver ≥535
- NVIDIA Container Toolkit

---

### 1.2 NeMo Guardrails Enhancement

**Priority**: 🟡 High
**Effort**: 2–4 weeks
**License**: Apache 2.0
**Sovereign**: ✅ Runs locally, no external calls

#### Problem
`CendiaSentryService` has 11 guardrail types but detection is rule-based (pattern matching, keyword lists). This produces false positives and misses nuanced violations.

#### Solution
Add NeMo Guardrails as an optional ML-powered backend for `CendiaSentryService`. Keep rule-based as default fallback.

#### Integration Points

**File to modify**: `backend/src/services/CendiaSentryService.ts`

```typescript
// New: backend/src/services/guardrails/NeMoGuardrailsEngine.ts
class NeMoGuardrailsEngine {
  // Wraps NeMo Guardrails Python service via HTTP
  async checkContent(input: string, guardrails: GuardrailConfig[]): Promise<GuardrailResult[]>;
  async checkBias(input: string, context: BiasContext): Promise<GuardrailResult>;
  async checkHallucination(input: string, sources: string[]): Promise<GuardrailResult>;
}
```

**Colang rules** (NeMo's policy language) mapped to DDGI primitives:
```colang
# P6: Cognitive Bias Mitigation
define flow check_cognitive_bias
  $bias_result = execute check_for_cognitive_biases(text=$last_bot_message)
  if $bias_result.detected
    bot inform bias detected
    bot provide debiased alternative

# P1: Discovery-Time Proof
define flow enforce_evidence_citation
  $citation_result = execute verify_evidence_citations(text=$last_bot_message)
  if not $citation_result.all_cited
    bot request evidence sources
```

#### Docker Compose Addition
```yaml
nemo-guardrails:
  image: datacendia/nemo-guardrails:latest
  build:
    context: ./guardrails
    dockerfile: Dockerfile
  ports:
    - "8090:8090"
  environment:
    - GUARDRAILS_CONFIG=/config
  volumes:
    - ./guardrails/config:/config
```

---

### 1.3 NVIDIA RAPIDS / cuGraph

**Priority**: 🟢 Medium
**Effort**: 4–6 weeks
**License**: Apache 2.0
**Sovereign**: ✅ Local GPU libraries

#### Problem
`BiasFairnessEngine` and graph analytics run on CPU. Fine for small datasets, won't scale to enterprise volumes.

#### Solution
Add GPU-accelerated computation paths as optional backends. CPU remains default.

#### Integration Points
- `backend/src/services/verticals/insurance/InsuranceVertical.ts` — `BiasFairnessEngine`
- `backend/src/services/pillars/EthicsService.ts` — Bias checks
- Neo4j graph queries — Supplement with cuGraph for batch analytics

---

### 1.4 NVIDIA Confidential Computing

**Priority**: 🔴 Critical
**Effort**: 2–4 weeks
**License**: NVIDIA proprietary (hardware feature)
**Sovereign**: ✅ On-premise GPU hardware

#### Problem
Data is protected at rest (PostgreSQL encryption, MinIO encryption) and in transit (TLS). But during GPU inference, model inputs and outputs exist in GPU memory **unencrypted**. For sovereign/defense customers, this is a gap.

#### Solution
Enable NVIDIA Confidential Computing on H100/H200 GPUs. Data is encrypted even while being processed by the GPU.

#### Integration Points

**File to modify**: `backend/src/services/security/HSMAdapter.ts`

Add GPU attestation verification:
```typescript
// New: backend/src/services/security/ConfidentialComputeService.ts
class ConfidentialComputeService {
  // Verify GPU is in CC mode via NVIDIA attestation service (local)
  async verifyGPUAttestation(): Promise<AttestationResult>;
  // Ensure inference runs only on attested GPUs
  async enforceConfidentialInference(provider: InferenceProvider): Promise<void>;
  // Generate CC compliance evidence for DCII P7
  async generateCCEvidence(): Promise<CCEvidencePacket>;
}
```

**DCII Alignment**: Directly supports P7 (Quantum-Resistant Integrity) and P4 (Continuity Memory) by ensuring evidence cannot be extracted from GPU memory.

#### Hardware Requirements
- NVIDIA H100 or H200 GPU with Confidential Computing capability
- NVIDIA Driver ≥550 with CC mode enabled
- Verified firmware via NVIDIA Local Attestation

---

## Phase 2: Event Infrastructure (Weeks 4–10)

### 2.1 Apache Kafka (Durable Event Streaming)

**Priority**: 🔴 Critical
**Effort**: 3–5 weeks
**License**: Apache 2.0
**Sovereign**: ✅ Fully self-hosted

#### Problem
Three separate event systems, none durable:

1. **Redis PubSub** (`redis.ts` lines 77–126) — Fire-and-forget. If a consumer is down, events are **permanently lost**. Used by Council, workflows, alerts, WebSocket emitters (6 files, 31 call sites).

2. **ChronosEventBus** (`ChronosEventBus.ts`, 918 lines) — Node.js `EventEmitter`. In-memory only. If the process crashes, all buffered events are **permanently lost**. Used by deliberation, echo, dissent, DCII, and 8 other services.

3. **DruidEventStream** (`DruidEventStream.ts`, 339 lines) — Batches events in memory, flushes to Druid every 5 seconds. If process crashes between flushes, events are **permanently lost**. Re-queues on Druid failure but caps at 5x batch size, then silently drops.

**For a platform built on DDGI decision provenance and DCII P1 (Discovery-Time Proof), losing events is architecturally contradictory.**

#### Solution
Apache Kafka as the durable event backbone. All three systems feed through Kafka. Consumers replay from any offset.

#### Architecture

```
BEFORE (Lossy):
┌──────────┐    fire-and-forget    ┌──────────┐
│ Services ├──────────────────────►│Redis Pub │ → lost if consumer down
└──────────┘                       └──────────┘
┌──────────┐    in-memory          ┌──────────┐
│ Services ├──────────────────────►│Chronos   │ → lost on crash
└──────────┘                       │EventBus  │
                                   └──────────┘
┌──────────┐    5s batch           ┌──────────┐
│ Services ├──────────────────────►│DruidEvent│ → lost between flushes
└──────────┘                       │Stream    │
                                   └──────────┘

AFTER (Durable):
┌──────────┐                       ┌──────────┐    ┌──────────┐
│ Services ├──────────────────────►│  Apache  ├───►│Redis Pub │ (real-time UI)
└──────────┘    all events         │  Kafka   ├───►│Chronos DB│ (timeline)
               durable, ordered,   │          ├───►│Druid     │ (analytics)
               replayable          │          ├───►│ClickHouse│ (OLAP)
                                   │          ├───►│Audit Log │ (compliance)
                                   └──────────┘
                                   Retained for
                                   configurable
                                   duration (days/
                                   months/forever)
```

#### Kafka Topics

| Topic | Source | Consumers | Retention |
|-------|--------|-----------|-----------|
| `cendia.decisions` | Council, deliberation | Druid, Chronos, Audit | 1 year |
| `cendia.audit` | All services | Druid, ImmutableAuditLedger, Compliance | Forever |
| `cendia.agents` | Agent framework | Druid, Metrics, Pulse | 90 days |
| `cendia.alerts` | Sentry, Compliance, Watch | Redis PubSub (for UI), Alert service | 1 year |
| `cendia.compliance` | ComplianceMonitor | Audit, Drift detection | Forever |
| `cendia.security` | SIEM, Sentry, Honeypot | SecurityOps, Audit | Forever |
| `cendia.websocket` | Kafka consumer | Redis PubSub → WebSocket | 24 hours |

#### Integration Points

**New files**:
```
backend/src/config/kafka.ts                    — Kafka client configuration
backend/src/services/events/KafkaProducer.ts   — Unified event producer
backend/src/services/events/KafkaConsumer.ts   — Consumer group management
backend/src/services/events/EventBus.ts        — Drop-in replacement for ChronosEventBus
```

**Files to modify**:
- `backend/src/config/redis.ts` — Keep Redis for cache + real-time WebSocket relay. Remove PubSub for durable events
- `backend/src/services/ChronosEventBus.ts` — Replace `EventEmitter` with Kafka producer
- `backend/src/services/DruidEventStream.ts` — Replace batch queue with Kafka consumer → Druid
- `backend/src/websocket/emitters.ts` — Consume from Kafka `cendia.websocket` topic → Redis PubSub → WebSocket
- `backend/src/routes/council.ts` — Replace `pubsub.publish` with Kafka producer
- `backend/src/routes/workflows.ts` — Replace `pubsub.publish` with Kafka producer
- `backend/src/routes/alerts.ts` — Replace `pubsub.publish` with Kafka producer

#### Environment Variables
```bash
KAFKA_BROKERS=localhost:9092
KAFKA_CLIENT_ID=cendia-backend
KAFKA_GROUP_ID=cendia-consumer-group
KAFKA_SSL_ENABLED=true
KAFKA_SASL_MECHANISM=SCRAM-SHA-512
KAFKA_RETENTION_MS=31536000000    # 1 year default
```

#### Docker Compose Addition
```yaml
kafka:
  image: bitnami/kafka:3.7
  ports:
    - "9092:9092"
  environment:
    - KAFKA_CFG_NODE_ID=0
    - KAFKA_CFG_PROCESS_ROLES=controller,broker
    - KAFKA_CFG_LISTENERS=PLAINTEXT://:9092,CONTROLLER://:9093
    - KAFKA_CFG_CONTROLLER_QUORUM_VOTERS=0@kafka:9093
    - KAFKA_CFG_CONTROLLER_LISTENER_NAMES=CONTROLLER
    - KAFKA_CFG_LOG_RETENTION_HOURS=8760   # 1 year
    - KAFKA_CFG_AUTO_CREATE_TOPICS_ENABLE=false
  volumes:
    - kafka-data:/bitnami/kafka
```

#### DCII Alignment
- **P1 (Discovery-Time Proof)**: Kafka's immutable, timestamped log **is** discovery-time proof at the infrastructure level. Every event has a provable timestamp and offset.
- **P4 (Continuity Memory)**: Events survive process crashes, server reboots, and partial failures. Knowledge is never lost.
- **P5 (Drift Detection)**: Kafka consumers can replay the full event history to detect when drift began.

---

### 2.2 Temporal.io (Durable Workflow Orchestration)

**Priority**: 🟡 High
**Effort**: 4–8 weeks
**License**: MIT
**Sovereign**: ✅ Fully self-hosted

#### Problem
Three custom orchestrators exist:
- `CollapseOrchestrator` (621 lines) — Dual-track deliberation
- `SGASOrchestrator` — Institutional agent governance
- `SCGEOrchestrator` — Governance execution

All use in-memory state (`Map<string, ...>`). If the process crashes mid-workflow:
- Partial deliberation results are lost
- No way to resume from the last completed step
- No built-in retry logic for failed steps
- No workflow versioning or migration

#### Solution
Temporal.io provides durable execution — workflows survive crashes, can be replayed, and have full audit trails built in.

#### Architecture

```
BEFORE:
┌─────────────────┐    in-memory Maps    ┌─────────────┐
│ Council Request  ├────────────────────►│ Collapse    │
│                  │                      │ Orchestrator│ → lost on crash
└─────────────────┘                      └─────────────┘

AFTER:
┌─────────────────┐    Temporal Client   ┌─────────────┐    ┌──────────┐
│ Council Request  ├────────────────────►│ Temporal    ├───►│ Worker   │
│                  │                      │ Server      │    │ (Node.js)│
└─────────────────┘                      │ (durable    │    │          │
                                         │  state)     │    │ Collapse │
                                         │             │◄───┤ SGAS     │
                                         │             │    │ SCGE     │
                                         └─────────────┘    └──────────┘
                                         Survives crashes.
                                         Full replay. Audit trail.
                                         Workflow versioning.
```

#### DCII Decision Lifecycle Mapping

| DCII Lifecycle Phase | Temporal Concept |
|---------------------|-----------------|
| Initiation | Workflow start signal |
| Deliberation | Activity sequence (parallel agent calls) |
| Resolution | Workflow completion with result |
| Preservation | Temporal's event history (durable) |
| Reconstruction | Workflow replay from event history |

#### Integration Points

**New files**:
```
backend/src/temporal/client.ts              — Temporal client configuration
backend/src/temporal/workers.ts             — Worker registration
backend/src/temporal/workflows/
  deliberation.workflow.ts                  — Council deliberation workflow
  collapse.workflow.ts                      — Dual-track collapse analysis
  sgas.workflow.ts                          — SGAS governance workflow
  scge.workflow.ts                          — SCGE execution workflow
  compliance-review.workflow.ts             — Compliance review workflow
backend/src/temporal/activities/
  agent.activities.ts                       — LLM agent call activities
  evidence.activities.ts                    — Evidence vault activities
  notification.activities.ts                — Alert/notification activities
```

**Files to modify**:
- `backend/src/services/collapse/CollapseOrchestrator.ts` — Extract logic into Temporal activities
- `backend/src/services/sgas/SGASOrchestrator.ts` — Extract logic into Temporal activities
- `backend/src/services/scge/SCGEOrchestrator.ts` — Extract logic into Temporal activities
- `backend/src/routes/council.ts` — Start Temporal workflow instead of direct orchestrator call

#### Docker Compose Addition
```yaml
temporal:
  image: temporalio/auto-setup:1.24
  ports:
    - "7233:7233"    # gRPC
  environment:
    - DB=postgresql
    - DB_PORT=5432
    - POSTGRES_USER=${POSTGRES_USER}
    - POSTGRES_PWD=${POSTGRES_PASSWORD}
    - POSTGRES_SEEDS=postgres
  depends_on:
    - postgres

temporal-ui:
  image: temporalio/ui:2.30
  ports:
    - "8088:8080"
  environment:
    - TEMPORAL_ADDRESS=temporal:7233
```

---

## Phase 3: Security & Policy Hardening (Weeks 8–14)

### 3.1 OpenBao (Secrets Management)

**Priority**: 🟡 High
**Effort**: 3–4 weeks
**License**: MPL 2.0 (OpenBao, community fork of Vault)
**Sovereign**: ✅ Fully self-hosted

#### Problem
`KeyManagementService.ts` (153 references across the codebase) is custom-built. While functional, it lacks:
- Dynamic secret rotation with automatic lease management
- Industry-standard audit logging that auditors recognize
- Encryption-as-a-service with centralized key management
- PKI certificate authority for mTLS between services

#### Solution
OpenBao (community fork of HashiCorp Vault, MPL 2.0 license) provides all of the above.

#### Integration Points

**New file**: `backend/src/services/security/OpenBaoAdapter.ts`

```typescript
class OpenBaoAdapter {
  // Secrets engine — replaces manual key storage
  async getSecret(path: string): Promise<Record<string, string>>;
  async putSecret(path: string, data: Record<string, string>): Promise<void>;
  
  // Transit engine — encryption-as-a-service
  async encrypt(keyName: string, plaintext: string): Promise<string>;
  async decrypt(keyName: string, ciphertext: string): Promise<string>;
  
  // PKI — certificate authority for service-to-service mTLS
  async issueCertificate(commonName: string, ttl: string): Promise<Certificate>;
  
  // Dynamic secrets — database credentials with auto-rotation
  async getDatabaseCredentials(role: string): Promise<DatabaseCreds>;
}
```

**Files to modify**:
- `backend/src/services/security/KeyManagementService.ts` — Add OpenBao as backend option
- `backend/src/config/database.ts` — Use dynamic database credentials from OpenBao
- `backend/src/config/redis.ts` — Use dynamic Redis credentials from OpenBao

#### Docker Compose Addition
```yaml
openbao:
  image: quay.io/openbao/openbao:2.1
  ports:
    - "8200:8200"
  environment:
    - BAO_DEV_ROOT_TOKEN_ID=dev-token
    - BAO_DEV_LISTEN_ADDRESS=0.0.0.0:8200
  volumes:
    - openbao-data:/openbao/data
  cap_add:
    - IPC_LOCK
```

---

### 3.2 Open Policy Agent (OPA)

**Priority**: 🟢 Medium
**Effort**: 2–3 weeks
**License**: Apache 2.0
**Sovereign**: ✅ Runs as sidecar or embedded library

#### Problem
`PolicyEngine.ts` is custom-built. Policies are defined in TypeScript code, meaning:
- Compliance teams can't write or audit policies without developer involvement
- Policy changes require code deployments
- No standard policy language for external auditors to review

#### Solution
OPA with Rego policies. Policies become auditable text files that compliance teams can read and modify.

#### Integration Points

**New files**:
```
backend/src/services/policy/OPAClient.ts           — OPA REST/gRPC client
backend/src/services/policy/OPAPolicySync.ts        — Sync Rego policies from config
policies/
  ddgi/context-capture.rego                         — P1 enforcement
  ddgi/deliberation-traceability.rego               — P2 enforcement
  ddgi/override-accountability.rego                 — P3 enforcement
  compliance/gdpr-data-residency.rego               — GDPR enforcement
  compliance/hipaa-phi-access.rego                  — HIPAA enforcement
  vertical/financial-trading-limits.rego            — Financial vertical
  vertical/healthcare-consent-required.rego         — Healthcare vertical
```

**Example Rego policy (DDGI P3 — Override Accountability)**:
```rego
package ddgi.override_accountability

default allow = false

# Every decision override must have:
# 1. An identified human overrider
# 2. A documented justification
# 3. A timestamp
allow {
    input.override.actor_id != ""
    input.override.actor_type == "human"
    input.override.justification != ""
    count(input.override.justification) > 20
    input.override.timestamp != ""
}

# Violations produce audit events
violations[msg] {
    input.override.actor_type != "human"
    msg := "Override by non-human actor violates DDGI Primitive C"
}

violations[msg] {
    input.override.justification == ""
    msg := "Override without justification violates DDGI Primitive C"
}
```

#### Docker Compose Addition
```yaml
opa:
  image: openpolicyagent/opa:0.69.0
  ports:
    - "8181:8181"
  command: ["run", "--server", "--addr", "0.0.0.0:8181", "/policies"]
  volumes:
    - ./policies:/policies
```

---

### 3.3 Apache Flink (Real-Time Stream Processing)

**Priority**: 🟢 Medium
**Effort**: 4–6 weeks
**License**: Apache 2.0
**Sovereign**: ✅ Fully self-hosted

#### Problem
Compliance drift detection (`ContinuousComplianceMonitorService`) runs on intervals. Early warning systems across verticals check on scheduled triggers. This means:
- Drift can go undetected for minutes between checks
- Pattern detection across multiple event streams requires custom code
- Complex event processing (e.g., "3 compliance violations within 10 minutes across 2 departments") is difficult

#### Solution
Apache Flink consumes from Kafka topics and applies real-time Complex Event Processing (CEP).

#### Use Cases

1. **Compliance drift in real-time**: Process `cendia.compliance` topic, detect status changes instantly
2. **Cross-stream pattern detection**: Correlate `cendia.security` + `cendia.audit` + `cendia.compliance` for compound threats
3. **IISS™ real-time scoring**: Continuously update IISS score as events flow through
4. **Anomaly detection**: Statistical anomaly detection on agent metrics and decision patterns

#### Integration
- Reads from: Kafka topics (Phase 2.1)
- Writes to: Kafka alert topics, ClickHouse (analytics), PostgreSQL (state)
- Integrates with: `ContinuousComplianceMonitorService`, IISS scoring, Alert system

---

## Phase Summary

### Phase 1: NVIDIA Stack (Weeks 1–6)

| Component | Effort | Impact | DCII Alignment |
|-----------|:------:|:------:|:---------------|
| TensorRT-LLM/Triton | 1–2 weeks | 5–10x inference speed | All primitives (faster processing) |
| NeMo Guardrails | 2–4 weeks | ML-powered guardrails | P6 (Cognitive Bias Mitigation) |
| RAPIDS/cuGraph | 4–6 weeks | Enterprise-scale analytics | P6 (Bias analysis at scale) |
| Confidential Computing | 2–4 weeks | Data-in-use protection | P7 (Quantum-Resistant Integrity) |

### Phase 2: Event Infrastructure (Weeks 4–10)

| Component | Effort | Impact | DCII Alignment |
|-----------|:------:|:------:|:---------------|
| Apache Kafka | 3–5 weeks | Durable event log, zero data loss | P1, P4, P5 |
| Temporal.io | 4–8 weeks | Crash-proof workflows, replay | Full lifecycle |

### Phase 3: Security & Policy (Weeks 8–14)

| Component | Effort | Impact | DCII Alignment |
|-----------|:------:|:------:|:---------------|
| OpenBao | 3–4 weeks | Industry-standard secrets | P7 (Evidence Integrity) |
| OPA | 2–3 weeks | Auditable policy-as-code | P3 (Override Accountability) |
| Apache Flink | 4–6 weeks | Real-time CEP | P5 (Drift Detection) |

---

## Docker Compose — Complete Addition

```yaml
# ============================================================
# INFRASTRUCTURE UPGRADES
# ============================================================

services:
  # --- NVIDIA ---
  triton:
    image: nvcr.io/nvidia/tritoninferenceserver:24.12-py3
    ports: ["8000:8000", "8001:8001", "8002:8002"]
    volumes: ["./models:/models"]
    deploy:
      resources:
        reservations:
          devices:
            - capabilities: [gpu]
    profiles: ["nvidia"]

  nemo-guardrails:
    image: datacendia/nemo-guardrails:latest
    ports: ["8090:8090"]
    volumes: ["./guardrails/config:/config"]
    profiles: ["nvidia"]

  # --- EVENT INFRASTRUCTURE ---
  kafka:
    image: bitnami/kafka:3.7
    ports: ["9092:9092"]
    environment:
      KAFKA_CFG_NODE_ID: 0
      KAFKA_CFG_PROCESS_ROLES: controller,broker
      KAFKA_CFG_LISTENERS: PLAINTEXT://:9092,CONTROLLER://:9093
      KAFKA_CFG_CONTROLLER_QUORUM_VOTERS: 0@kafka:9093
      KAFKA_CFG_CONTROLLER_LISTENER_NAMES: CONTROLLER
      KAFKA_CFG_LOG_RETENTION_HOURS: 8760
    volumes: ["kafka-data:/bitnami/kafka"]

  temporal:
    image: temporalio/auto-setup:1.24
    ports: ["7233:7233"]
    environment:
      DB: postgresql
      POSTGRES_SEEDS: postgres
    depends_on: [postgres]

  temporal-ui:
    image: temporalio/ui:2.30
    ports: ["8088:8080"]
    environment:
      TEMPORAL_ADDRESS: temporal:7233

  # --- SECURITY & POLICY ---
  openbao:
    image: quay.io/openbao/openbao:2.1
    ports: ["8200:8200"]
    volumes: ["openbao-data:/openbao/data"]
    cap_add: [IPC_LOCK]

  opa:
    image: openpolicyagent/opa:0.69.0
    ports: ["8181:8181"]
    command: ["run", "--server", "--addr", "0.0.0.0:8181", "/policies"]
    volumes: ["./policies:/policies"]

volumes:
  kafka-data:
  openbao-data:
```

---

## Dependency Map

```
Phase 1 (NVIDIA)          Phase 2 (Events)         Phase 3 (Security)
────────────────          ────────────────         ──────────────────
Triton ──────────────┐
                     ├──► Kafka ─────────────┬──► Flink (reads Kafka)
NeMo Guardrails ─────┘                      │
                                             ├──► Temporal
RAPIDS ──────────────────────────────────────┘
                                                  OpenBao
Confidential Computing                            OPA
```

- **Triton has no dependencies** — can start immediately
- **Kafka has no dependencies** — can start immediately
- **Flink depends on Kafka** — must wait for Phase 2.1
- **Temporal has no dependencies** — can start in parallel with Kafka
- **OpenBao and OPA have no dependencies** — can start anytime

---

## Total Investment Summary

| Category | Components | Effort | Hardware Cost |
|----------|-----------|:------:|:-------------|
| NVIDIA | Triton, NeMo, RAPIDS, CC | 9–16 weeks | $5K–$40K (GPU) |
| Events | Kafka, Temporal | 7–13 weeks | $0 (software only) |
| Security | OpenBao, OPA, Flink | 9–13 weeks | $0 (software only) |
| **Total** | **9 components** | **~14–20 weeks** (parallel) | **$5K–$40K** |

**All software is open source. The only hardware cost is NVIDIA GPUs for Phase 1.**

Phases overlap — total elapsed time with parallel execution: **~14–20 weeks** (not 25–42 weeks sequential).

---

## Platform Rating Impact

| Category | Current | After Phase 1 | After Phase 2 | After Phase 3 |
|----------|:-------:|:-------------:|:-------------:|:-------------:|
| Architecture | 8.5 | 9.0 | 9.5 | 9.5 |
| AI Capabilities | 7.0 | 8.5 | 8.5 | 9.0 |
| Compliance | 9.0 | 9.0 | 9.5 | 10.0 |
| Crisis Management | 6.0 | 7.0 | 8.0 | 8.5 |
| Enterprise Readiness | 7.5 | 8.5 | 9.0 | 9.5 |
| Security | 8.5 | 9.0 | 9.0 | 9.5 |
| **Overall** | **7.5** | **8.5** | **8.9** | **9.3** |

---

*This document should be reviewed and updated as implementation progresses. Each phase should include integration tests and performance benchmarks before moving to the next phase.*
