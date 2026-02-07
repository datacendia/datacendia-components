# Datacendia Platform

[![CI/CD Pipeline](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml/badge.svg)](https://github.com/datacendia/datacendia-components/actions/workflows/ci.yml)
[![License: Proprietary](https://img.shields.io/badge/License-Proprietary-red.svg)](#license)

> **The Enterprise AI Decision Intelligence Platform**
> 
> Transform complex business decisions with AI-powered councils, multi-agent deliberation, and comprehensive audit trails.

## ✨ What's New (February 7, 2026)

### Enterprise Platinum (Feb 7)
- **Auto-Apply Database Indexes** — Performance indexes applied automatically on server startup (idempotent)
- **Universal Redis Caching** — All API routes cached via Redis with automatic invalidation on mutations
- **PostgreSQL HA Production-Ready** — Primary/replica with PgBouncer, WAL archiving, auto-failover, healthchecks
- **Grafana Auto-Provisioning** — Dashboards and datasources auto-imported on startup
- **202,500+ Tests Passing** — 184 test files (161 backend + 23 integration/AI), 0 failures with graceful fallback
- **CendiaCascade™** — Second/third-order consequence engine ("Butterfly Effect" analysis)
- **CendiaLens™** — AI interpretability with attention visualization, circuit tracing, symbolic residue
- **11 Sovereign Architecture Patterns** — Data Diode, Shadow Council, QR Air-Gap Bridge, TPM Attestation, and more

### Platform v4.5 (Jan 28)
- **Unified Docker Compose** — Single `docker-compose.unified.yml` with profiles for all services
- **Defense & National Security Vertical** — DIU-ready with 24 agents, 35 council modes, FedRAMP High/CMMC/ITAR compliance
- **Real-Time Deliberation Visualization** — Watch AI agents deliberate live with animated avatars
- **Decision Replay Theater** — Watch past deliberations unfold like a movie
- **Adversarial Red Team Mode** — "100 Ways This Could Fail" with 8 attack perspectives
- **Regulator's Receipt Generator** — One-click court-admissible PDF with Merkle tree evidence
- **CendiaPostQuantumKMS™** — Quantum-resistant cryptography (Dilithium, SPHINCS+, Falcon)
- **CendiaCarbonAware™** — Carbon-aware AI scheduling with multi-region optimization
- **CendiaContinuousCompliance™** — Real-time compliance monitoring (10 frameworks)
- **CendiaCrossJurisdiction™** — Multi-jurisdiction compliance engine (17 jurisdictions)
- **Sports/Football Vertical** — Transfer governance with UEFA FFP, FIFA Agent Regs, Premier League PSR

## 🚀 Quick Start

### Prerequisites

- **Node.js** 20.x or later
- **Docker** & Docker Compose
- **PostgreSQL** 16+
- **Redis** 7+
- **Neo4j** 5+ (for knowledge graph)
- **Ollama** (for local AI/LLM)

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
| `full` | Everything | 64GB+ |

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
│   │   ├── routes/         # API endpoints
│   │   ├── services/       # Business logic
│   │   ├── middleware/     # Auth, logging, security
│   │   └── config/         # Database, Redis, Neo4j config
│   └── prisma/             # Database schema & migrations
├── tests/                  # Test suites (Vitest + Playwright)
│   ├── ai-validation/      # LLM brain tests, bias/ethics, air-gap
│   ├── enterprise/         # Schema, security, performance, i18n
│   ├── integration/        # Full platform + edge case tests
│   ├── backend/            # API, agents, services tests
│   └── frontend/           # Auth, routes, components tests
├── infrastructure/         # PostgreSQL HA scripts
├── grafana/                # Dashboard & datasource provisioning
├── docs/                   # Technical documentation (40+ files)
└── docker/                 # Docker configurations
```

## 🧪 Testing

**Current status:** 184 test files, 202,500+ tests, **100% passing**

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
| Backend unit | 161 | Services, routes, middleware |
| Integration | 2 | Full platform + edge cases |
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

## � Platform Scale

| Metric | Count |
|--------|-------|
| Backend route files | 135 |
| Backend service files | 294 |
| Frontend pages | 169 |
| Frontend components | 78 |
| Test files | 184 |
| Passing tests | 202,500+ |
| API endpoint groups | 40+ |
| Industry verticals | 18+ |
| Compliance frameworks | 10 |
| Supported jurisdictions | 17 |
| AI agent presets | 50+ |
| i18n locales | 12 |

## �📚 Documentation

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
| [Enterprise Readiness](docs/ENTERPRISE_READINESS.md) | Production audit & compliance |
| [API Documentation](docs/API_DOCUMENTATION.md) | Backend API reference |
| [Architecture Diagrams](docs/ARCHITECTURE_DIAGRAMS.md) | System architecture |
| [Security Audit](SECURITY_AUDIT_RESULTS.md) | Security review and compliance |
| [Product Bible](docs/DATACENDIA_BIBLE.md) | Product vision and features |
| [Real-World Value](docs/REAL_WORLD_VALUE.md) | Detailed use case examples |
| [Performance Guide](PERFORMANCE_OPTIMIZATION_GUIDE.md) | Performance tuning |
| [Production Checklist](PRODUCTION_CHECKLIST.md) | Deployment readiness checklist |

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

# AI/LLM
OLLAMA_BASE_URL=http://localhost:11434

# Auth
JWT_SECRET=your-secret-key
```

## 🛡️ Security

- See [SECURITY.md](SECURITY.md) for security policy and vulnerability reporting
- All secrets must be stored in environment variables
- Never commit `.env` files or API keys

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📄 License

**Proprietary** - Copyright © 2024-2026 Datacendia, Inc. All rights reserved.

This software is proprietary and confidential. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

---

Built with ❤️ by the Datacendia team
