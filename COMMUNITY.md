# Datacendia Community Edition — Open Source Boundary

This document defines which parts of the Datacendia codebase are **Community Edition** (open source) and which are **Enterprise Edition** (commercial license required).

If you're contributing, please read this first. Building features on top of enterprise-only code creates licensing conflicts that are painful to untangle later.

---

## Community Edition (Open Source)

The following components are available under the open-source license. Contributions welcome.

### Core Engine

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/council/` | **Council Engine** — multi-agent deliberation loop, the heart of the platform |
| `backend/src/services/core/` | Core platform services (event bus, decision lifecycle) |
| `backend/src/services/DecisionService.ts` | Decision CRUD and lifecycle management |
| `backend/src/services/DeliberationService.ts` | Deliberation orchestration |
| `backend/src/services/PostDeliberationService.ts` | Post-deliberation processing and summaries |
| `backend/src/services/EnhancedLLMService.ts` | LLM abstraction layer |
| `backend/src/services/NotificationService.ts` | Notification delivery |
| `backend/src/services/SampleDataService.ts` | Demo data generation |

### Inference Layer

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/inference/` | InferenceProvider abstraction (Ollama, Triton, NIM) |
| `backend/src/services/ollama.ts` | Ollama provider (backward-compatible shim) |
| `backend/src/services/llm/` | LLM utilities and prompt management |

### Trust Layer (Basic)

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/CendiaAuditService.ts` | Immutable audit trail with Merkle signing |
| `backend/src/services/CendiaDissentService.ts` | Dissent tracking — agents can formally disagree |
| `backend/src/services/CendiaResponsibilityService.ts` | Responsibility assignment and tracking |
| `backend/src/services/evidence/` | Evidence collection and packaging |
| `backend/src/services/governance/` | Basic governance framework |
| `backend/src/services/compliance/` | Compliance framework definitions |
| `backend/src/middleware/` | Auth, logging, rate limiting, security middleware |
| `backend/src/security/` | PolicyEngine, RBAC (Casbin) |

### Data Layer

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/pillars/` | 8 Pillars data ingestion framework |
| `backend/src/services/metrics/` | Metric definitions and tracking |
| `backend/src/services/cache/` | Cache service (Redis) |
| `backend/src/services/queue/` | Job queue service |
| `backend/src/services/storage/` | File storage abstraction |
| `backend/src/services/vectordb/` | Vector database integration |
| `backend/src/services/graphIngestion.ts` | Knowledge graph ingestion |
| `backend/prisma/` | Database schema and migrations |

### Infrastructure (Opt-In)

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/kafka/` | Apache Kafka event streaming |
| `backend/src/services/temporal/` | Temporal.io workflow orchestration |
| `backend/src/services/opa/` | Open Policy Agent integration |
| `backend/src/services/vault/` | OpenBao/Vault secrets management |
| `backend/src/services/guardrails/` | NeMo Guardrails engine |
| `backend/src/services/gpu/` | RAPIDS analytics + Confidential Computing |
| `backend/src/services/streaming/` | Flink CEP real-time processing |

### Frontend (All Community)

| Directory | Description |
|-----------|-------------|
| `src/components/` | All React UI components |
| `src/pages/` | All page components |
| `src/lib/` | Utilities, API clients, hooks |
| `src/services/` | Frontend service layer |

### Verticals (Lite)

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/verticals/` | All 29 vertical definitions and basic agents |
| `backend/src/services/sports/` | Sports vertical (flagship, full implementation) |
| `backend/src/services/VerticalAgentsService.ts` | Vertical agent orchestration |

Community Edition includes the vertical *framework* and basic agent definitions. Full vertical packs with 12+ specialized agents per industry are Enterprise.

---

## Enterprise Edition (Commercial License)

The following components require a commercial license. **Do not submit PRs that extend these modules** without discussing with maintainers first — they will be rejected to avoid licensing confusion.

### Sovereign Services

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/sovereign/` | **All 22 sovereign architecture patterns** — Data Diode, Shadow Council, QR Air-Gap Bridge, TPM Attestation, Federated Mesh, Time Lock, etc. |

### Enterprise Services

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/enterprise/` | **All 18 enterprise services** — SSO, Procure, Guardian, Factory, Habitat, Nexus, Regent, Rainmaker, Scout, Transit, Resonance, etc. |

### Premium Products

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/CendiaCascadeService.ts` | Second/third-order consequence engine |
| `backend/src/services/CendiaCrucibleService.ts` | Adversarial stress testing (full version) |
| `backend/src/services/CendiaHorizonService.ts` | Strategic horizon scanning |
| `backend/src/services/CendiaPanopticonService.ts` | Enterprise monitoring suite |
| `backend/src/services/CendiaAegisService.ts` | Advanced threat protection |
| `backend/src/services/CendiaEternalService.ts` | Long-term decision preservation |
| `backend/src/services/CendiaSymbiontService.ts` | Cross-organization decision sharing |
| `backend/src/services/CendiaPredictService.ts` | Predictive risk scoring (full version) |
| `backend/src/services/CendiaRewindService.ts` | Counterfactual replay (full version) |
| `backend/src/services/CendiaApotheosisService.ts` | Advanced AI orchestration |
| `backend/src/services/CendiaOrbitService.ts` | Satellite decision tracking |
| `backend/src/services/CendiaVoxService.ts` | Voice-driven deliberation |
| `backend/src/services/CendiaOmniTranslateService.ts` | Enterprise translation (100+ languages) |
| `backend/src/services/insurance/` | Per-decision liability coverage |
| `backend/src/services/licensing.service.ts` | License management |

### Advanced Modules

| Directory / File | Description |
|-----------------|-------------|
| `backend/src/services/collapse/` | Adversarial policy stress-testing (19 agents) |
| `backend/src/services/sgas/` | Synthetic Governance Agent System |
| `backend/src/services/dcii/` | Decision Crisis Immunization Infrastructure |
| `backend/src/services/scge/` | Societal-scale governance engine |
| `backend/src/services/cortex/` | Advanced AI cortex |
| `backend/src/services/legal/` | Legal vertical (full pack) |
| `backend/src/services/strategic/` | Strategic planning suite |
| `backend/src/services/forecasting/` | Advanced forecasting models |

---

## How to Tell

If you're unsure whether something is Community or Enterprise:

1. **Council Engine, Decision Ledger, basic Trust Layer, inference** → Community
2. **`sovereign/` or `enterprise/` directory** → Enterprise
3. **Named `Cendia[Product]Service.ts`** in the root services dir → likely Enterprise (exceptions: AuditService, DissentService, ResponsibilityService, RecallService, SentryService are Community)
4. **Verticals framework** → Community; **full vertical packs** → Enterprise
5. **Infrastructure integrations** (Kafka, Temporal, OPA, etc.) → Community

When in doubt, open an issue or ask in Discussions before starting work.

---

## For Contributors

- PRs to Community code are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md)
- If your PR touches Enterprise code, it will be flagged during review
- If you want to build something that *depends on* Enterprise code, consider building it as a plugin or extension instead
- Enterprise features that could benefit the community may be moved to Community Edition over time — suggest candidates via Issues

---

*This boundary is enforced by code review, not technical gates. We trust contributors to respect it.*
