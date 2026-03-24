# Datacendia — Enterprise Edition

> **⚠️ Private Repository** — This is the enterprise monorepo containing all commercial features. The open-source Community Edition is at [datacendia-core](https://github.com/datacendia/datacendia-core) (Apache 2.0).

[![CI](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml/badge.svg)](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml)
[![Security](https://github.com/datacendia/datacendia-components/actions/workflows/security.yml/badge.svg)](https://github.com/datacendia/datacendia-components/actions/workflows/security.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![NVIDIA Inception](https://img.shields.io/badge/NVIDIA-Inception%20Member-76b900.svg)](https://www.nvidia.com/en-us/startups/)
[![License](https://img.shields.io/badge/License-Commercial-lightgrey.svg)](#license)

**The Defensible AI Platform — every decision, defensible.**

Datacendia is the only AI platform where every decision is auditable, explainable, and forensic-grade, independently verifiable. Multiple AI agents *deliberate* — argue, dissent, and challenge each other — then every decision is recorded in a cryptographically signed, immutable evidence packet. Open-core. Sovereign-first. Self-hosted or cloud. Your data, your keys, your proof.

### Repository Landscape

| Repo | Purpose | License | Visibility |
|------|---------|---------|:----------:|
| **datacendia-components** (this repo) | Enterprise monorepo — full platform (frontend + backend) | Commercial | Private |
| [datacendia-core](https://github.com/datacendia/datacendia-core) | Community Edition — open-source core engine | Apache 2.0 | Public |
| [datacendia-marketing](https://github.com/datacendia/datacendia-marketing) | Marketing website (datacendia.com) | Proprietary | Private |
| [decision-governance-infrastructure](https://github.com/datacendia/decision-governance-infrastructure) | DDGI framework specification | CC BY 4.0 | Public |

```
┌─────────────────────────────────────────────────────────────┐
│                    DATACENDIA PLATFORM                       │
│                                                              │
│   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│   │ Strategy │  │  Risk    │  │Compliance│  │ Dissent  │   │
│   │  Agent   │──│  Agent   │──│  Agent   │──│  Agent   │   │
│   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘   │
│        │             │             │             │           │
│        └─────────────┴──────┬──────┴─────────────┘           │
│                             │                                │
│                    ┌────────▼────────┐                       │
│                    │ Council Engine  │  ← Multi-agent        │
│                    │  (Deliberation) │    deliberation        │
│                    └────────┬────────┘                       │
│                             │                                │
│                    ┌────────▼────────┐                       │
│                    │ Decision Ledger │  ← Immutable,         │
│                    │  (Merkle-signed)│    cryptographic       │
│                    └─────────────────┘                       │
└─────────────────────────────────────────────────────────────┘
```

## Why Datacendia?

- **Deliberation over dictation** — Multiple AI perspectives challenge each other before any recommendation. No single-model black box.
- **Immutable audit trail** — Every decision is Merkle-signed with full reasoning chains. Export forensic-grade, independently verifiable evidence packets.
- **Sovereign by default** — Runs entirely on your infrastructure. Air-gapped deployable. No data leaves your network.
- **Compliance-native** — Architecture aligned to SOC 2, HIPAA, GDPR, NIST 800-53, Basel III, EU AI Act. Controls implemented, formal certifications available on enterprise contract.
- **9 enterprise infrastructure integrations** — Kafka, Temporal, OPA, OpenBao, NeMo Guardrails, RAPIDS, Flink CEP, Triton, Confidential Computing. All opt-in with embedded fallbacks.

## What the Council Found

We ran the platform against eleven real decision types across eleven industries. In each case, the pivotal insight emerged from cross-examination between agents with different mandates — not from any single agent's analysis.

| Walkthrough | Scenario | What the Council Found |
|-------------|----------|----------------------|
| [**Financial Services**](docs/FINANCIAL_SERVICES_WALKTHROUGH.md) | $2.3B CRE acquisition, Basel III capital planning | Credit Analyst reframes "22% discount" as 2.2% discount to fair value; Compliance Officer catches SR 11-7 model risk blocking issue that would halt the deal |
| [**Healthcare**](docs/HEALTHCARE_WALKTHROUGH.md) | Sepsis prediction AI tool, FDA SaMD classification | Patient Safety Officer calculates alert fatigue reduces effective sensitivity to 54.8% — *worse* than current manual screening at 68% |
| [**Government**](docs/GOVERNMENT_WALKTHROUGH.md) | $47M IT modernization, FAR Part 15 source selection | Program Manager shows "cheaper" incumbent costs $22.1M more over 10 years due to COBOL lifecycle debt; Legal Counsel identifies 3 GAO protest vulnerabilities |
| [**Defense**](docs/DEFENSE_WALKTHROUGH.md) | HA/DR + freedom-of-navigation, 8-agent JOPP | OPSEC Officer reveals "lower risk" COA is actually *worse* for security — no exclusion zone lets adversary collection platforms operate at close range |
| [**Energy**](docs/ENERGY_WALKTHROUGH.md) | 1,400 MW grid deficit, 8 minutes to cascading blackout | Renewable Optimizer identifies that discharging full battery now creates a catastrophic 2,840 MW deficit at sunset 90 minutes later |
| [**Legal**](docs/LEGAL_WALKTHROUGH.md) | $28M FLSA class action, 10-day settlement deadline | Ethics Counsel surfaces Rule 2.1 duty: lawyers must tell the board their $12M authority is unrealistic, even if candor costs the client relationship |
| [**Sports**](docs/SPORTS_WALKTHROUGH.md) | €47M player transfer, UEFA FFP compliance | CMO's risk-adjusted pricing adds €9.2M to effective cost (ACL history); Governance agent turns potential FFP sanction into voluntary agreement |
| [**Manufacturing**](docs/MANUFACTURING_WALKTHROUGH.md) | Brake caliper defect, $42K/hour line-down penalty | Maintenance Engineer identifies multi-factor root cause where every individual parameter was "within limits" but the combination exceeded tolerance |
| [**Insurance**](docs/INSURANCE_WALKTHROUGH.md) | $1.4M workers' comp claim, fraud score 74/100 | Chief Actuary decomposes reserve: $984K is provider-ring inflation on top of $416K legitimate claim — reframes from single-claim to $28M ring exposure |
| [**Real Estate**](docs/REAL_ESTATE_WALKTHROUGH.md) | $94M office-to-residential conversion, 76% vacancy | Chief Appraiser cuts $30M from developer's valuation; Market Analyst shows conversion pipeline is 80% of annual absorption — market window is closing |
| [**Pharmaceutical**](docs/PHARMACEUTICAL_WALKTHROUGH.md) | Phase III cardiovascular trial, interim safety signal | Biostatistician shows DILI confidence interval is 30× wide — stopping for efficacy is a regulatory trap because safety database is too small for NDA |

### How Pivotal Insights Emerge

Every finding above came from one of three agent interaction patterns:

1. **A specialist reframes a number.** The Credit Analyst turns 22% into 2.2%. The Patient Safety Officer turns 87% sensitivity into 54.8% effective sensitivity. The CMO turns €47M into €56.2M risk-adjusted. These reframings change the decision because they reveal the number the decision-maker *should* be looking at, not the one that was presented.

2. **A compliance agent catches a blocking prerequisite.** The SR 11-7 model risk finding. The 21 CFR Part 11 audit trail requirement. The host nation exclusion zone request. These are binary — they don't change the recommendation, they gate it. A single-model prompt rarely surfaces prerequisites because it's optimizing for the answer, not the preconditions.

3. **Cross-examination reveals second-order effects.** The OPSEC Officer inverts the risk assessment. The Renewable Optimizer models the sunset crisis. The Discovery Specialist shows the remaining 40% of production makes the case worse. These emerge specifically because one agent challenges another's framing and forces a deeper analysis that the original agent's mandate wouldn't have produced.

This structure — not the technology, but the *pattern of how insights emerge* from multi-agent deliberation — is why a council of specialized agents produces different results than a single model with a longer prompt. The single model has all the knowledge. It lacks the adversarial structure that forces knowledge to be applied from competing perspectives.

## Pricing & Tiers

This repository (**datacendia-components**) contains all paid tiers. The free Community tier is [datacendia-core](https://github.com/datacendia/datacendia-core) (Apache 2.0).

| Tier | Price | What You're Actually Buying |
|------|-------|----------------------------|
| **Community** | Free | A working AI governance platform you can try. Self-hosted. No SLA. No support. Regex PII. Basic Council. Enough to demo to your CISO. |
| **Pilot** | $50K/yr | **We run it for you.** Managed deployment, 99.5% SLA, priority support, full deliberation engine, 90-day money-back guarantee. |
| **Foundation** | $150K–$500K/yr | **Production compliance.** Full compliance engines (Basel III, EU AI Act, cross-jurisdiction), ML-based PII (Presidio), Echo/Gnosis evidence, OmniTranslate (26 languages), expanded verticals. |
| **Enterprise** | $500K–$1.5M/yr | **Advanced risk.** COLLAPSE stress testing, 12 adversarial agents, Shadow Council, sovereign LLM providers, SSO/MFA, SIEM, ZK proofs, multi-tenant. |
| **Strategic** | $1.5M+/yr | **Nation-scale.** Air-gapped, data diode, TPM attestation, federated mesh, post-quantum crypto, defense-grade, portable instances. |

### Feature Comparison

| Capability | Community | Pilot | Foundation | Enterprise | Strategic |
|-----------|:---------:|:-----:|:----------:|:----------:|:---------:|
| Council Engine (multi-agent deliberation) | ✅ | ✅ | ✅ | ✅ | ✅ |
| Immutable Audit Ledger (Merkle-signed) | ✅ | ✅ | ✅ | ✅ | ✅ |
| CendiaGateway (AI governance proxy) | ✅ | ✅ | ✅ | ✅ | ✅ |
| CendiaReplay (decision playback) | ✅ | ✅ | ✅ | ✅ | ✅ |
| DCII Services (Truth, Notary, Witness) | ✅ | ✅ | ✅ | ✅ | ✅ |
| PII Detection | Regex | Regex | ML (Presidio) | ML + Custom | ML + Custom |
| Industry Verticals | 18 basic | 18 basic | 30 expanded | 30 full | 30 full + custom |
| Managed Platform & SLA | — | ✅ 99.5% | ✅ 99.9% | ✅ 99.95% | ✅ Custom |
| Compliance Engines (Basel III, EU AI Act) | — | — | ✅ | ✅ | ✅ |
| Echo/Gnosis Evidence & Audit Replay | — | — | ✅ | ✅ | ✅ |
| OmniTranslate (26 languages) | — | — | ✅ | ✅ | ✅ |
| COLLAPSE Stress Testing | — | — | — | ✅ | ✅ |
| Shadow Council & Red Team | — | — | — | ✅ | ✅ |
| SSO/MFA (Keycloak) | — | — | — | ✅ | ✅ |
| SIEM Integration (Splunk, Sentinel) | — | — | — | ✅ | ✅ |
| Sovereign LLM Providers (offline) | — | — | — | ✅ | ✅ |
| Sovereign Online Toggle | — | — | — | ✅ | ✅ |
| Zero-Knowledge Proofs | — | — | — | ✅ | ✅ |
| Air-Gapped Deployment | — | — | — | — | ✅ |
| Data Diode & TPM Attestation | — | — | — | — | ✅ |
| Federated Mesh (multi-org) | — | — | — | — | ✅ |
| Post-Quantum Cryptography | — | — | — | — | ✅ |

### Sovereign Online Toggle (Enterprise+)

Enterprise and Strategic tiers support fully sovereign/air-gapped deployments. A single environment variable disables all external cloud services:

```bash
DATACENDIA_ONLINE_MODE=false     # Master toggle — disables all cloud AI + external services
DATACENDIA_CLOUD_AI_FALLBACK=error  # 'error' (auditor-safe default) or 'local' (silent Ollama fallback)
```

When offline: cloud AI → hard 503 or local fallback, external data → cached datasets, notifications → internal event bus only. System validates at startup that local LLM providers are configured — the passing validation is an audit artifact.

See `GET /api/v1/health/sovereign` for real-time sovereign mode status.

## 🚀 Quick Start

### Try it now (zero config)

```bash
# Clone and launch — no .env, no setup, pre-seeded demo data
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components
docker compose -f docker-compose.demo.yml up
```

Open **http://localhost:5173** → log in as `sarah.chen@acme.demo` (dev auth bypass, no password).

You'll see a pre-seeded Acme Corporation with 5 users, 6 Council agents, 5 deliberations (completed + in-progress), 8 decisions, 12 months of metrics, and a full audit trail. ~6GB RAM required.

### Development Setup

#### Prerequisites

- **Node.js** 20.x or later
- **Docker** & Docker Compose
- **PostgreSQL** 16+
- **Redis** 7+
- **Neo4j** 5+ (for knowledge graph)
- **Ollama** (for local AI/LLM — or Triton/NIM via `INFERENCE_PROVIDER`)
- **NVIDIA GPU** (optional — required for RAPIDS, Triton, Confidential Computing)

```bash
# Clone the repository
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Install all dependencies (Prisma client auto-generates via postinstall)
npm install
cd backend && npm install && cd ..

# Start infrastructure with unified compose (RECOMMENDED)
docker-compose -f docker-compose.unified.yml --profile core up -d

# Run database migrations
cd backend && npx prisma migrate deploy && cd ..

# Seed demo data (optional)
npm run db:seed

# Start frontend and backend locally
npm run dev              # Frontend - http://localhost:5173
cd backend && npm run dev # Backend - http://localhost:3001
```

### Docker Compose Profiles

| Profile | Services | RAM Required |
|---------|----------|-------------|
| `core` | PostgreSQL, Redis, Neo4j, Ollama | 8GB |
| `sovereign` | + Druid, ClickHouse, MinIO, Keycloak, etc. | 32GB |
| `observability` | + Prometheus, Grafana, Loki, Tempo | 48GB |
| `security` | + Wazuh, Infisical, Step-CA | 64GB |
| `nvidia` | + Triton, NeMo Guardrails, RAPIDS | 32GB + GPU |
| `events` | + Kafka, Temporal, Temporal UI | 16GB |
| `policy` | + OPA, OpenBao, Flink | 8GB |
| `full` | Everything | 96GB+ |

```bash
# Core only (minimal for development)
docker-compose -f docker-compose.unified.yml --profile core up -d

# Core + Sovereign services
docker-compose -f docker-compose.unified.yml --profile core --profile sovereign up -d

# Full stack
docker-compose -f docker-compose.unified.yml up -d
```

### Service URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:5173 | See `.env` |
| Backend API | http://localhost:3001 | - |
| Neo4j Browser | http://localhost:7474 | See `.env` (`NEO4J_USER` / `NEO4J_PASSWORD`) |
| MinIO Console | http://localhost:9001 | See `.env` (`MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD`) |
| Grafana | http://localhost:3002 | See `.env` (`GRAFANA_USER` / `GRAFANA_PASSWORD`) |
| Keycloak | http://localhost:8180 | See `.env` (`KEYCLOAK_ADMIN` / `KEYCLOAK_ADMIN_PASSWORD`) |
| Triton Inference | http://localhost:8000 (HTTP), :8001 (gRPC) | - |
| Kafka | localhost:9092 | - |
| Temporal UI | http://localhost:8088 | - |
| OpenBao/Vault | http://localhost:8200 | `OPENBAO_TOKEN` |
| OPA | http://localhost:8181 | - |
| Flink Dashboard | http://localhost:8081 | - |

> **Security:** Copy `.env.example` to `.env` and set strong, unique passwords before running. Never commit `.env` to version control.

## 📁 Project Structure

```
datacendia-components/
├── src/                    # React frontend (Vite + TypeScript + Tailwind)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components (routes)
│   ├── lib/                # Utilities, API clients, hooks
│   └── services/           # Frontend services
├── backend/                # Node.js backend (Express + Prisma)
│   ├── src/
│   │   ├── routes/         # API endpoints (160 route files)
│   │   ├── services/       # Business logic (456 service files)
│   │   │   ├── inference/  # InferenceProvider (Ollama, Triton, NIM)
│   │   │   ├── guardrails/ # NeMo Guardrails engine
│   │   │   ├── kafka/      # Kafka producer, consumer, event bridge
│   │   │   ├── temporal/   # Temporal.io workflow orchestration
│   │   │   ├── opa/        # Open Policy Agent engine
│   │   │   ├── vault/      # OpenBao/Vault secrets management
│   │   │   ├── gpu/        # RAPIDS analytics + Confidential Computing
│   │   │   ├── streaming/  # Flink CEP real-time processing
│   │   │   ├── verticals/  # 29 industry vertical implementations
│   │   │   └── sovereign/  # 11 sovereign architecture patterns
│   │   ├── middleware/     # Auth, logging, security
│   │   ├── security/       # PolicyEngine, KeycloakAuth, KMS, HSM
│   │   └── config/         # Database, Redis, Neo4j, inference config
│   └── prisma/             # Database schema & migrations (194 models)
├── tests/                  # Test suites (Vitest + Playwright)
├── infrastructure/         # PostgreSQL HA scripts
├── grafana/                # Dashboard & datasource provisioning
├── docs/                   # Technical documentation (70+ files)
└── docker/                 # Docker configurations
```

## 🧪 Testing

**Current status:** 262 test files, 205,754+ tests, **99.99% passing** (2 pre-existing env-dependent failures)

```bash
# All tests (frontend + backend + integration)
npm test

# Frontend unit tests
npm run test

# Backend tests
npm run test:backend

# Tests with coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e

# Type checking (all)
npm run typecheck:all

# Linting (all)
npm run lint:all
```

### Test Categories

| Category | Files | Description |
|----------|-------|-------------|
| Backend unit | 165 | Services, routes, middleware |
| Integration/E2E | 33 | Full platform, edge cases, Playwright |
| AI Validation | 5 | LLM quality, bias/ethics, load, air-gap |
| Enterprise | 6 | Schema, security, performance, i18n |
| Frontend | 4 | Auth, routing, components, i18n |
| Contract | 1 | Consumer pact tests |

> Tests gracefully skip when optional services (Ollama, backend, frontend) are offline.

## 🏗️ Building

```bash
# Build frontend
npm run build

# Build backend
cd backend && npm run build

# Build Docker images
docker build -t datacendia/frontend:latest .
docker build -t datacendia/backend:latest ./backend
```

## 🚀 Deployment

### Cloud/Standard Deployment

```bash
# Production deployment with Docker Compose
docker compose -f docker-compose.production.yml up -d
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

### Air-Gapped / On-Premise Deployment

For sovereign deployments on isolated networks:

```powershell
# Build deployment package (on machine with internet)
.\scripts\build-airgapped-package.ps1 -Version "1.0.0"

# With LLM models included (~15-25GB)
.\scripts\build-airgapped-package.ps1 -Version "1.0.0" -IncludeModels
```

This creates a self-contained package with:
- All Docker images as `.tar.gz` files
- Configuration templates
- Installation scripts for Linux/Windows
- LLM models (optional)

See [Air-Gapped Deployment Guide](docs/AIRGAPPED_DEPLOYMENT.md) for complete instructions.

## 📊 Platform Scale

| Metric | Count |
|--------|-------|
| Backend service files | **456** (implementation, excl. index/types) |
| Backend source files (total) | **1,024** |
| Backend route files | **160** |
| Backend test files | **262** |
| Backend middleware | **17** |
| Frontend pages | **209** |
| Frontend components | **92** |
| Frontend source files | **504** (325 TSX + 179 TS) |
| Prisma models | **194** |
| Prisma enums | **141** |
| Prisma schema files | **13** |
| Passing tests | **205,755** |
| Industry verticals | **30** |
| Collapse agents | **19** specialized |
| Docker Compose files | **4** (dev, demo, production, nvidia) |
| Compliance frameworks | **10** |
| Supported jurisdictions | **17** |
| AI agent presets | **50+** |
| Documentation files | **359** |
| TypeScript errors | **0** |

## 🏛️ Cendia™ Product Catalog

### Core Suite (The "Brain")

| Product | Description |
|---------|-------------|
| **CendiaChronos™** | Enterprise Time Machine — replay past decisions, simulate future crisis scenarios |
| **Ghost Board™** | Rehearse high-stakes board meetings against AI avatars |
| **CendiaPreMortem™** | AI analyzes why your decision will fail before you execute it |
| **CendiaPredict™** | **NEW** — Forward-looking quantitative risk scoring: "73% chance of regulatory challenge in 9 months" with evidence |
| **CendiaRewind™** | **NEW** — Counterfactual decision replay: "If we'd chosen Option B, we'd be 15% better off" |
| **CendiaRecall™** | Decision Outcome Tracker — predicted vs actual, bias detection, lessons learned |
| **Decision Debt™** | Real-time dashboard of stuck decisions and financial cost of delay |
| **CendiaLive™** | Watch AI agents deliberate in real-time with animated avatars |
| **CendiaReplay™** | Watch past deliberations unfold like a movie |
| **CendiaEcho™** | Decision Outcome Engine — track what actually happened after each decision |
| **CendiaLens™** | AI Interpretability — token confidence, reasoning chains, bias detection |
| **CendiaCollapse™** | Adversarial Policy Stress-Testing — 19 specialized agents stress-test decisions |
| **CendiaPulse™** | Mission control — real-time agent activity, compliance, risk scoring |
| **CendiaCrisis™** | Incident Response Center — detection to resolution with complete audit trail |
| **CendiaROI™** | Prove the ROI of governance with real deliberation throughput and quality metrics |
| **CendiaDCII™** | Decision Crisis Immunization Infrastructure — IISS, 9 primitives, media auth, timestamps |
| **CendiaGateway™** | AI Governance Gateway — reverse proxy for all AI traffic with PII detection, policy enforcement, DCII signing |
| **The Governance Receipt™** | Printable, cryptographically verified artifact proving every AI interaction was governed — for regulators and auditors |
| **CendiaOrchestrate™** | Service Orchestration Workflow Builder — visual drag-and-drop of 60+ platform services into reusable workflows with persistent save/load and run simulation |

### Trust Layer (The "Shield")

| Product | Description |
|---------|-------------|
| **CendiaOversight™** | Real-time Regulatory Radar — FDA, GDPR, DORA frameworks with policy gates |
| **CendiaNotary™** | Cryptographic Signing Authority — customer-owned keys |
| **CendiaVault™** | Unified Evidence Storage — decision packets, audit ledger, evidence bundles |
| **CendiaProvenance™** | Full decision lineage & evidence export — forensic-grade, independently verifiable |
| **CendiaCrucible™** | Adversarial Stress Testing — attack decisions with simulated threats |
| **CendiaRedTeam™** | Every agent becomes a devil's advocate |
| **SGAS™** | Synthetic Governance Agent System — 5 agent classes at societal scale |
| **CendiaCourt™** | Formal AI dispute resolution with precedent tracking |
| **CendiaSandbox™** | Test against proposed regulations before they become law |
| **CendiaZKP™** | Prove compliance without revealing proprietary logic or data |
| **CendiaInsure™** | Direct liability coverage per AI decision with real-time risk scoring |
| **CendiaQuantumKMS™** | Quantum-resistant cryptographic signatures (Dilithium, SPHINCS+, Falcon) |
| **CendiaCarbon™** | Reduce AI carbon footprint with intelligent workload scheduling |
| **CendiaJurisdiction™** | 17-jurisdiction compliance engine for cross-border data transfers |
| **CendiaCompliance™** | Real-time monitoring for 10 compliance frameworks |

## 📚 Documentation

### Deployment

| Document | Description |
|----------|-------------|
| [Quick Reference](docs/QUICK_REFERENCE.md) | Copy-paste commands cheat sheet |
| [Deployment Guide](DEPLOYMENT.md) | Standard deployment instructions |
| [Docker Guide](docs/DOCKER.md) | Complete Docker configuration reference |
| [Air-Gapped Deployment](docs/AIRGAPPED_DEPLOYMENT.md) | Offline/on-premise deployment |
| [PostgreSQL HA Guide](POSTGRESQL_HA_GUIDE.md) | Database high availability setup |
| [Infrastructure Setup](INFRASTRUCTURE_SETUP.md) | Local infrastructure services |

### Use Cases & Research

> **See [What the Council Found](#what-the-council-found)** for the full pivotal insights table with all eight walkthroughs.

| Document | Description |
|----------|-------------|
| [**Benchmark: Council vs. Single-Model**](docs/BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md) | Worked comparison — 3.2× more risk factors, 6× regulatory citations, dissent surfacing |
| [Community vs Enterprise](COMMUNITY.md) | Open-core boundary — what's free, what's commercial |

### Technical

| Document | Description |
|----------|-------------|
| [Platform Audit (Mar 2)](docs/PLATFORM_AUDIT_2026-03-02.md) | Cross-repo audit — 33 findings, 14 remediated, CI/security/deps |
| [Platform Audit (Feb 18)](PLATFORM_AUDIT_2026_02_18.md) | Service verification audit |
| [Enterprise Readiness](docs/ENTERPRISE_READINESS.md) | Production audit & compliance |
| [API Documentation](docs/API_DOCUMENTATION.md) | Backend API reference |
| [Architecture Diagrams](docs/ARCHITECTURE_DIAGRAMS.md) | System architecture |
| [Product Bible](docs/DATACENDIA_BIBLE.md) | Product vision and features |
| [Real-World Value](docs/REAL_WORLD_VALUE.md) | Detailed use case examples |
| [Complete Service Matrix](docs/COMPLETE_SERVICE_MATRIX.md) | Full service catalog with pricing |
| [Verticals](docs/VERTICALS.md) | 29 industry verticals deep dive |

## 🔐 Environment Variables

See `.env.example` for required environment variables:

```env
# Database
DATABASE_URL=postgresql://user:pass@localhost:5432/datacendia

# Redis
REDIS_URL=redis://localhost:6379

# Neo4j
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=password

# AI/LLM Inference (choose one provider)
INFERENCE_PROVIDER=ollama              # ollama | triton | nim
OLLAMA_BASE_URL=http://localhost:11434
TRITON_URL=localhost:8001              # Triton gRPC
TRITON_HTTP_URL=http://localhost:8000  # Triton HTTP
NIM_URL=http://localhost:8000          # NVIDIA NIM

# Auth
JWT_SECRET=your-secret-key

# ── Optional Infrastructure (all disabled by default) ──

# NeMo Guardrails
NEMO_GUARDRAILS_ENABLED=false          # true to activate
NEMO_GUARDRAILS_MODE=hybrid            # server | embedded | hybrid
NEMO_GUARDRAILS_URL=http://localhost:8080

# Apache Kafka
KAFKA_ENABLED=false
KAFKA_BROKERS=localhost:9092

# Temporal.io
TEMPORAL_ENABLED=false
TEMPORAL_ADDRESS=localhost:7233
TEMPORAL_NAMESPACE=datacendia

# OpenBao/Vault
OPENBAO_ENABLED=false
OPENBAO_ADDR=http://127.0.0.1:8200
OPENBAO_TOKEN=

# Open Policy Agent
OPA_ENABLED=false
OPA_MODE=embedded                      # server | embedded
OPA_URL=http://localhost:8181

# NVIDIA RAPIDS
RAPIDS_ENABLED=false
RAPIDS_URL=http://localhost:8787

# Confidential Computing
CC_ENABLED=false
CC_ATTESTATION_URL=http://localhost:8443

# Apache Flink CEP
FLINK_ENABLED=false
FLINK_MODE=embedded                    # cluster | embedded
FLINK_URL=http://localhost:8081
```

## 🛡️ Security

- See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting
- All secrets must be stored in environment variables
- Never commit `.env` files or API keys

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

Copyright © 2024-2026 Datacendia, Inc. See [LICENSE](LICENSE) for details.

Community Edition components are available under open-source terms. Enterprise features require a commercial license — contact sales@datacendia.com.

---

<details>
<summary><strong>📋 Changelog (click to expand)</strong></summary>

### March 2, 2026 — Platform Audit Remediation

- **Cross-repo audit** — 33 findings across all 4 repos, 14 remediated same-day
- **datacendia-core CI overhaul** — Rewrote `ci.yml` (concurrency, Prisma generate, community build, status gate), added `security.yml` (CodeQL, TruffleHog, dependency audit), added `dependabot.yml`
- **Dependency vulns reduced 31→6** — `fast-xml-parser` override → 5.4.1, `multer` → 2.1.0, added `@aws-sdk/xml-builder` override
- **Removed 2.5GB caselaw data** from git tracking (91,725 files)
- **Marketing HTTPS enabled** — Uncommented Force HTTPS redirect in `.htaccess`
- **CI hardened** — Lint now blocks merges (removed `continue-on-error`), security audit blocks on critical vulns
- **Housekeeping** — Fixed `SECURITY.md` versions, moved `@types/*` to devDependencies, deleted empty `fix-ds.ts`

### March 2, 2026 — The Governance Receipt™ & CendiaGateway Housekeeping

- **The Governance Receipt™** — Named artifact: the printable, cryptographically verified document a CISO hands to a regulator. Replaces "AI Manifest" branding. Export as HTML (PDF), CSV, JSON via `POST /governance-receipt/export`
- **Prisma generate automated** — `postinstall` hook in `backend/package.json` runs `prisma generate` automatically after `npm install`. Also added to `build` script and both enterprise setup scripts (`.ps1` / `.sh`)
- **Browser extension icon tooling** — `generate-icons.html` renders the gold shield SVG onto canvas at 16/48/128px and provides PNG download buttons. README updated with prominent warning that Chrome requires real PNGs
- **`GovernanceReceipt` type alias** — exported alongside legacy `AIManifest` for backwards compatibility
- **CendiaGateway™** and **The Governance Receipt™** added to product catalog

### February 26, 2026 — Infrastructure Upgrade (9 Enterprise Components)

**NVIDIA Inception Program Member** 🟢

- **InferenceProvider Abstraction** — Unified `IInferenceProvider` interface with Ollama, Triton, and NVIDIA NIM backends
- **NeMo Guardrails** — 9 default rails (jailbreak, hallucination, bias, PII, topic enforcement)
- **NVIDIA RAPIDS / cuGraph** — GPU-accelerated bias analysis, graph analytics, anomaly detection (CPU fallback)
- **Confidential Computing** — GPU attestation, session management, CC evidence generation
- **Apache Kafka** — 7 topic categories, in-memory fallback, EventBridge integration
- **Temporal.io** — 6 built-in workflows, embedded execution fallback
- **OpenBao/Vault** — KV v2, transit encryption, PKI, dynamic DB credentials
- **Open Policy Agent** — 8 embedded policies, EU AI Act, HIPAA minimum necessary
- **Apache Flink CEP** — Sliding-window engine, 6 default rules

All 9 components are opt-in (disabled by default) with embedded fallbacks.

### March 16, 2026 — Service Orchestration Workflow Builder

- **CendiaOrchestrate™** — Visual drag-and-drop workflow builder with 60+ services across Foundation, Enterprise, and Strategic tiers
- **ServiceRegistry** — Full platform service catalog with inputs, outputs, and configuration schemas for every registered service
- **WorkflowPersistenceService** — localStorage CRUD for workflows (create, read, update, delete, duplicate, export/import, run logging)
- **Shared workflow types** — `Workflow`, `WorkflowStep`, `WorkflowConnection`, `ServiceDefinition`, `ConfigField`, `PortDefinition`
- **Infrastructure audit** — Full cross-repo sync verified: pages, routes, nav, components, contexts, APIs, schemas all aligned
- **4 shared components synced** — `RedTeamReportPanel`, `SimilarDecisionsPanel`, `CendiaStampSeal`, `EvidencePackageDownload`
- **Sidebar nav** — Workflows entry added to enterprise navigation group

### March 10, 2026 — Complete Vertical Deep Testing
- **All 30 verticals deep-tested** — 647 domain-specific tests across 9 test files
- **Basel III Engine** — CET1/AT1/Tier2 capital, credit/market/operational RWA, LCR, NSFR, large exposures, stress tests
- **Defense vertical** — 24 agents, 26 council modes, 5 compliance frameworks (FedRAMP/CMMC/ITAR/NIST/LOAC)
- **Industrial Services** — 10 expanded schemas with SUNAFIL/OSHA/ASME regulatory rules
- **205,754 tests passing** across 262 test files

### February 18, 2026 — Predictive Intelligence
- **CendiaPredict™** — Forward-looking quantitative risk scoring
- **CendiaRewind™** — Counterfactual decision replay
- **204,751 tests passing** — 0 TypeScript errors

### February 17, 2026 — Platform Integrity Audit
- **CendiaRecall™** — Decision outcome tracking with bias detection
- **666 Math.random() calls eliminated** — Replaced with deterministic, reproducible computations
- **311/311 backend services rated 10/10** — Zero placeholder code

### February 12, 2026 — DCII Framework
- **CendiaIISS™** — Institutional Immune System Score (0–1000 scale)
- **CendiaMediaAuth™** — Synthetic media authentication (C2PA signing)
- **CendiaTimestamp™** — RFC 3161 external timestamp authority

### February 7, 2026 — Enterprise Platinum
- **PostgreSQL HA** — Primary/replica with PgBouncer, WAL archiving, auto-failover
- **Grafana auto-provisioning** — Dashboards and datasources on startup
- **202,500+ tests passing**

### January 28, 2026 — Platform v4.5
- **Unified Docker Compose** — Single file with profiles for all services
- **Defense & National Security Vertical** — 24 agents, 35 council modes
- **CendiaQuantumKMS™** — Post-quantum cryptography (Dilithium, SPHINCS+, Falcon)
- **Sports/Football Vertical** — Transfer governance with UEFA FFP, FIFA Agent Regs

</details>

---

Built with ❤️ by the Datacendia team
