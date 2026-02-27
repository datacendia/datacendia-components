# Datacendia

[![CI](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml/badge.svg)](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![NVIDIA Inception](https://img.shields.io/badge/NVIDIA-Inception%20Member-76b900.svg)](https://www.nvidia.com/en-us/startups/)
[![License](https://img.shields.io/badge/License-See%20LICENSE-lightgrey.svg)](#license)

**AI-powered multi-agent deliberation for enterprise decisions.**

Datacendia is a decision intelligence platform where multiple AI agents *deliberate* — argue, dissent, and challenge each other — before a recommendation is made. Every decision produces a cryptographically signed, immutable audit trail that's court-admissible and regulator-ready.

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
- **Immutable audit trail** — Every decision is Merkle-signed with full reasoning chains. Export court-admissible evidence packets.
- **Sovereign by default** — Runs entirely on your infrastructure. Air-gapped deployable. No data leaves your network.
- **Compliance-native** — Architecture aligned to SOC 2, HIPAA, GDPR, NIST 800-53, Basel III, EU AI Act. Controls implemented, formal certifications available on enterprise contract.
- **9 enterprise infrastructure integrations** — Kafka, Temporal, OPA, OpenBao, NeMo Guardrails, RAPIDS, Flink CEP, Triton, Confidential Computing. All opt-in with embedded fallbacks.

## Community vs Enterprise

| Capability | Community (Open Source) | Enterprise |
|-----------|----------------------|-----------|
| **Council Engine** (multi-agent deliberation) | ✅ | ✅ |
| **Decision Ledger** (immutable, Merkle-signed) | ✅ | ✅ |
| **Deliberation API** | ✅ | ✅ |
| **Basic Trust Layer** (RBAC, audit, signing) | ✅ | ✅ |
| **Financial Services agents** (basic) | ✅ | ✅ Full (SR 11-7, FRTB, BCBS 239) |
| **Docker Compose local deployment** | ✅ | ✅ |
| **29 industry verticals** | Lite | Full (12+ agents per vertical) |
| **Sovereign Services** (Collapse, Sanctuary, ShadowOps) | — | ✅ |
| **Post-Quantum KMS** (Dilithium, SPHINCS+) | — | ✅ |
| **Zero-Knowledge Proofs** | — | ✅ |
| **CendiaInsure™** (per-decision liability coverage) | — | ✅ |
| **Ghost Board™** (AI board simulation) | — | ✅ |
| **Enterprise SSO** (Keycloak) | — | ✅ |
| **Managed cloud hosting** | — | ✅ |
| **White-label licensing** | — | ✅ |

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or later
- **Docker** & Docker Compose
- **PostgreSQL** 16+
- **Redis** 7+
- **Neo4j** 5+ (for knowledge graph)
- **Ollama** (for local AI/LLM — or Triton/NIM via `INFERENCE_PROVIDER`)
- **NVIDIA GPU** (optional — required for RAPIDS, Triton, Confidential Computing)

### Development Setup

```bash
# Clone the repository
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components

# Copy environment files
cp .env.example .env
cp backend/.env.example backend/.env

# Install all dependencies
npm install

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
│   │   ├── routes/         # API endpoints (140+ route files)
│   │   ├── services/       # Business logic (373+ service files)
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
│   └── prisma/             # Database schema & migrations (260 models)
├── tests/                  # Test suites (Vitest + Playwright)
├── infrastructure/         # PostgreSQL HA scripts
├── grafana/                # Dashboard & datasource provisioning
├── docs/                   # Technical documentation (40+ files)
└── docker/                 # Docker configurations
```

## 🧪 Testing

**Current status:** 198 test files, 204,751+ tests, **99.99% passing** (4 pre-existing env-dependent failures)

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
| Backend service files | **373** (306 implementation) |
| Backend service directories | **41** |
| Backend route files | **140** (125 + 15 domain routers) |
| Backend test files | **165** |
| Backend middleware | **10** |
| Backend connectors | **22** across 16 domains |
| Backend adapters | **12** (6 sovereign) |
| Frontend pages | **196** |
| Frontend components | **79** |
| Prisma models | **260** |
| Prisma enums | **141** |
| Passing tests | **204,751** |
| Industry verticals | **29** (84 service files) |
| Collapse agents | **19** specialized |
| Docker Compose files | **10** |
| Compliance frameworks | **10** |
| Supported jurisdictions | **17** |
| AI agent presets | **50+** |
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

### Trust Layer (The "Shield")

| Product | Description |
|---------|-------------|
| **CendiaOversight™** | Real-time Regulatory Radar — FDA, GDPR, DORA frameworks with policy gates |
| **CendiaNotary™** | Cryptographic Signing Authority — customer-owned keys |
| **CendiaVault™** | Unified Evidence Storage — decision packets, audit ledger, evidence bundles |
| **CendiaProvenance™** | Full decision lineage & evidence export — court-admissible |
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

### Technical

| Document | Description |
|----------|-------------|
| [Platform Audit (Feb 18)](PLATFORM_AUDIT_2026_02_18.md) | Comprehensive platform audit — every service verified |
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
