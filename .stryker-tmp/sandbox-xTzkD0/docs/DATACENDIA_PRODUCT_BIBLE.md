# DATACENDIA PRODUCT BIBLE
## Enterprise AI Intelligence Platform
### Complete Technology & Product Reference

---

# EXECUTIVE SUMMARY

**Datacendia** is an enterprise-grade AI intelligence platform that provides organizations with a unified nervous system for decision-making. Built on a foundation of 30 specialized AI agents, 8 foundational pillars, and 37+ backend services, Datacendia transforms how enterprises understand, predict, and act on their data.

**Platform Vision:** "The Thinking Enterprise" - An organization that learns, adapts, and decides with intelligence at every level.

---

# TABLE OF CONTENTS

1. [Platform Architecture](#platform-architecture)
2. [AI Agent System](#ai-agent-system)
3. [Personality Traits System](#personality-traits-system)
4. [Model Switching System](#model-switching-system)
5. [The Eight Pillars](#the-eight-pillars)
6. [Enterprise Features](#enterprise-features)
7. [Technology Stack](#technology-stack)
8. [Service Catalog](#service-catalog)
9. [API Reference](#api-reference)
10. [Security & Compliance](#security--compliance)
11. [Internationalization](#internationalization)
12. [Pricing & Packaging](#pricing--packaging)

---

# PLATFORM ARCHITECTURE

## Core Components

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | React 18, TypeScript, TailwindCSS | Enterprise UI |
| **Backend** | Node.js, Express, TypeScript | API Services |
| **Database** | PostgreSQL, Prisma ORM | Persistent Storage |
| **Cache** | Redis | Session, Real-time, Caching |
| **Graph DB** | Neo4j | Knowledge Graph, Lineage |
| **AI Engine** | Ollama (Local LLM) | AI Agent Intelligence |
| **Real-time** | Socket.IO, Redis Adapter | WebSocket Events |

## System Requirements

| Environment | Specification |
|-------------|---------------|
| **Minimum** | 8 CPU cores, 32GB RAM, 100GB SSD |
| **Recommended** | 16 CPU cores, 64GB RAM, 500GB NVMe |
| **Enterprise** | 32+ CPU cores, 128GB+ RAM, GPU (NVIDIA RTX 4090 or better) |

---

# AI AGENT SYSTEM

## Overview

Datacendia features **30 specialized AI agents** across 4 tiers:
- **14 Core Agents** (Included in all plans)
- **16 Premium Agents** (Industry packs)

## Core Agents (14)

| # | Code | Name | Role | Default Model |
|---|------|------|------|---------------|
| 1 | `chief` | Chief Strategy Agent | Strategic Oversight & Synthesis | llama3.3:70b |
| 2 | `cfo` | Financial Intelligence Agent | Financial Analysis & Risk | llama3.3:70b |
| 3 | `coo` | Operations Intelligence Agent | Operational Efficiency | llama3.2:3b |
| 4 | `ciso` | Security & Compliance Agent | Security & Risk Management | qwq:32b |
| 5 | `cmo` | Market Intelligence Agent | Marketing & Customer Insights | llama3.3:70b |
| 6 | `cro` | Revenue Intelligence Agent | Revenue & Growth | llama3.3:70b |
| 7 | `cdo` | Data Quality Agent | Data Governance & Quality | qwen2.5-coder:32b |
| 8 | `risk` | Risk Assessment Agent | Enterprise Risk Analysis | qwq:32b |
| 9 | `clo` | Legal Intelligence Agent | Legal & Compliance Analysis | qwq:32b |
| 10 | `cpo` | Product Strategy Agent | Product Innovation & Roadmap | llama3.3:70b |
| 11 | `caio` | AI Strategy Agent | AI/ML Governance & Innovation | qwq:32b |
| 12 | `cso` | Sustainability Agent | ESG & Environmental Impact | llama3.3:70b |
| 13 | `cio` | Investment Intelligence Agent | Investment Analysis | llama3.3:70b |
| 14 | `cco` | Communications Agent | Corporate Communications | llama3.2:3b |

## Premium Agent Packs

### 🔍 Audit Pack ($299/mo)
| Code | Name | Role |
|------|------|------|
| `ext-auditor` | External Auditor | Independent financial audit |
| `int-auditor` | Internal Auditor | Internal controls review |

### 🏥 Healthcare Pack ($399/mo)
| Code | Name | Role |
|------|------|------|
| `cmio` | Chief Medical Information Officer | Clinical data strategy |
| `pso` | Patient Safety Officer | Patient safety analysis |
| `hco` | Healthcare Compliance Officer | HIPAA/regulatory compliance |
| `cod` | Clinical Operations Director | Clinical workflow optimization |

### 💰 Finance Pack ($399/mo)
| Code | Name | Role |
|------|------|------|
| `quant` | Quantitative Analyst | Algorithmic trading analysis |
| `pm` | Portfolio Manager | Investment portfolio strategy |
| `cro-finance` | Credit Risk Officer | Credit risk assessment |
| `treasury` | Treasury Analyst | Cash flow & liquidity |

### ⚖️ Legal Pack ($399/mo)
| Code | Name | Role |
|------|------|------|
| `contracts` | Contract Specialist | Contract review & negotiation |
| `ip` | Intellectual Property Counsel | Patent & trademark analysis |
| `litigation` | Litigation Expert | Legal dispute strategy |
| `regulatory` | Regulatory Affairs Counsel | Regulatory compliance |

---

# PERSONALITY TRAITS SYSTEM

## Overview

Each AI agent can have **60 personality traits** toggled on/off to customize behavior. All traits are **OFF by default** for standard professional behavior.

## Trait Categories (10)

| Category | Traits | Examples |
|----------|--------|----------|
| **Communication Style** | 10 | Assertive, Passive, Aggressive, Diplomatic, Blunt, Verbose, Concise |
| **Disposition** | 10 | Optimistic, Pessimistic, Cynical, Trusting, Suspicious, Curious |
| **Decision Making** | 8 | Decisive, Indecisive, Analytical, Intuitive, Methodical |
| **Conflict Approach** | 6 | Argumentative, Agreeable, Contrarian, Mediating |
| **Risk Attitude** | 6 | Risk-Seeking, Risk-Averse, Cautious, Bold, Paranoid |
| **Work Style** | 6 | Perfectionist, Pragmatist, Idealist, Collaborative |
| **Emotional Expression** | 4 | Stoic, Expressive, Sarcastic, Sincere |
| **Social Dynamics** | 4 | Dominant, Submissive, Competitive, Cooperative |
| **Cognitive Style** | 4 | Big-Picture, Detail-Oriented, Innovative, Conservative |
| **Leadership Style** | 2 | Mentor, Challenger |

## Trait Intensity Levels

| Level | Description | Example |
|-------|-------------|---------|
| **Subtle** | Light influence on behavior | Formal, Curious |
| **Moderate** | Noticeable behavioral shift | Assertive, Analytical |
| **Strong** | Significant personality change | Aggressive, Paranoid |

## Quick Presets (10)

| Preset | Description | Traits |
|--------|-------------|--------|
| 😈 Devil's Advocate | Challenge assumptions | Contrarian, Argumentative, Suspicious |
| 📣 Cheerleader | Optimistic support | Optimistic, Passionate, Sincere |
| 🎖️ Drill Sergeant | Tough standards | Aggressive, Perfectionist, Blunt |
| 🧙 Wise Mentor | Teaching approach | Mentor, Empathetic, Diplomatic |
| 🦅 Risk Hawk | Focus on risks | Paranoid, Pessimistic, Suspicious |
| 💥 Disruptor | Challenge status quo | Innovative, Bold, Contrarian |
| 🕊️ Diplomat | Build consensus | Diplomatic, Agreeable, Mediating |
| ⚔️ Executioner | Ruthlessly practical | Decisive, Pragmatist, Blunt |
| 💎 Perfectionist | Excellence only | Perfectionist, Detail-Oriented |
| 🎨 Creative Visionary | Blue-sky thinking | Innovative, Optimistic, Big-Picture |

---

# MODEL SWITCHING SYSTEM

## Overview

All AI agents support **easy model switching** with 35+ Ollama models available. Users can change models at:
- **Global level** (system default)
- **Agent level** (per-agent override)
- **Query level** (single request)

## Available Models (35+)

### 🏆 Flagship Models
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| llama3.3:70b | 70B | Slow | Strategic analysis, complex reasoning |
| qwen2.5:72b | 72B | Slow | Multilingual, general flagship |
| deepseek-r1:70b | 70B | Slow | Deep reasoning, mathematical proofs |
| mistral-large:123b | 123B | Slow | Enterprise applications |
| command-r-plus:104b | 104B | Slow | Enterprise RAG, documents |

### 🧠 Reasoning Specialists
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| qwq:32b | 32B | Medium | Risk analysis, legal, security |
| deepseek-r1:32b | 32B | Medium | Complex problem solving |
| phi3:14b | 14B | Medium | Educational, reasoning |
| gemma2:27b | 27B | Medium | Research applications |

### 💻 Coding Models
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| qwen2.5-coder:32b | 32B | Medium | Code generation, data ops |
| codestral:22b | 22B | Medium | Code review, refactoring |
| starcoder2:15b | 15B | Medium | Multi-language coding |
| deepseek-coder-v2:236b | 236B | Slow | Enterprise code generation |

### ⚡ Fast Models
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| llama3.2:3b | 3B | Fast | Quick responses, high volume |
| qwen2.5:7b | 7B | Fast | Real-time chat |
| mistral:7b | 7B | Fast | General chat |
| gemma2:9b | 9B | Fast | Moderate tasks |

### 📱 Edge/Embedded
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| llama3.2:1b | 1B | Fast | Edge deployment |
| gemma2:2b | 2B | Fast | Mobile applications |

### 👁️ Vision Models
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| llama3.2-vision:11b | 11B | Medium | Image analysis, OCR |

### 🔍 Embedding Models
| Model | Size | Speed | Use Case |
|-------|------|-------|----------|
| nomic-embed-text | 137M | Fast | Semantic search, RAG |
| mxbai-embed-large | 335M | Fast | Document similarity |

## Model Recommendations by Agent

| Agent Type | Recommended Models |
|------------|-------------------|
| **Strategic/Executive** | llama3.3:70b, qwen2.5:72b |
| **Financial** | llama3.3:70b, qwq:32b, deepseek-r1:70b |
| **Security/Legal/Risk** | qwq:32b, deepseek-r1:32b |
| **Operations** | llama3.2:3b, qwen2.5:7b |
| **Data/Technical** | qwen2.5-coder:32b, codestral:22b |
| **Marketing/Sales** | llama3.3:70b, qwen2.5:32b |

---

# THE EIGHT PILLARS

## Foundational Data Layers

| # | Pillar | Purpose | Key Features |
|---|--------|---------|--------------|
| 1 | **CendiaHelm™** | Command & Control Interface | Natural language queries, voice input |
| 2 | **CendiaLineage™** | Data Memory & Truth | Knowledge graph, data lineage |
| 3 | **CendiaPredict™** | Forecasting & Imagination | ML models, scenario planning |
| 4 | **CendiaFlow™** | Automation & Action | Workflow orchestration, approvals |
| 5 | **CendiaHealth™** | System Monitoring | Alerts, metrics, dashboards |
| 6 | **CendiaGuard™** | Security & Protection | Threat detection, compliance |
| 7 | **CendiaEthics™** | AI Governance & Bias | Audit logs, fairness checks |
| 8 | **CendiaAgents™** | AI Agent Orchestration | Council, deliberation, synthesis |

---

# ENTERPRISE FEATURES

## Decision Intelligence Suite

| Feature | Description |
|---------|-------------|
| **Pre-Mortem Analysis** | Anticipate failures before they happen |
| **Ghost Board** | Simulate board/stakeholder reactions |
| **Decision Debt** | Track unmade decisions and their cost |
| **Regulatory Absorb** | Ingest and interpret new regulations |
| **Decision DNA** | Pattern analysis of past decisions |
| **Chronos** | Time-based decision intelligence |

## Enterprise Suite

| Feature | Description |
|---------|-------------|
| **Sovereign Cloud** | Private deployment option |
| **Persona Forge** | Custom AI persona builder |
| **Mesh** | Multi-tenant data fabric |
| **Govern** | Policy enforcement engine |
| **Voice** | Natural language interface |
| **Autopilot** | Autonomous operations mode |
| **Genomics** | Data lineage at the field level |
| **Defense Stack** | Enterprise security hardening |
| **OmniTranslate** | Real-time translation (20+ languages) |
| **Veto** | Decision override controls |
| **Union** | Cross-org collaboration |
| **Ledger** | Immutable audit trail |

## Sovereign Tier

| Feature | Description |
|---------|-------------|
| **Crucible** | Advanced model training |
| **Panopticon** | Enterprise-wide visibility |
| **Aegis** | Advanced threat protection |
| **Eternal** | Long-term data preservation |
| **Symbiont** | Human-AI collaboration |
| **Vox** | Enterprise voice assistant |

---

# TECHNOLOGY STACK

## Frontend

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 18.2+ | UI Framework |
| TypeScript | 5.2+ | Type Safety |
| TailwindCSS | 3.3+ | Styling |
| React Router | 6.20+ | Navigation |
| Lucide React | 0.294+ | Icons |
| Socket.IO Client | 4.8+ | Real-time |
| Cytoscape.js | 3.33+ | Graph Visualization |

## Backend

| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express | 4.18+ | Web Framework |
| TypeScript | 5.2+ | Type Safety |
| Prisma | 5.0+ | ORM |
| Socket.IO | 4.6+ | WebSocket |
| Redis | 7.0+ | Cache/Sessions |

## Database

| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 15+ | Primary Database |
| Redis | 7.0+ | Cache, Sessions, Pub/Sub |
| Neo4j | 5.0+ | Graph Database |

## AI/ML

| Technology | Version | Purpose |
|------------|---------|---------|
| Ollama | Latest | Local LLM Hosting |
| 35+ Models | Various | AI Inference |

## DevOps

| Technology | Purpose |
|------------|---------|
| Docker | Containerization |
| Docker Compose | Local Development |
| Kubernetes | Production Orchestration |
| GitHub Actions | CI/CD |

---

# SERVICE CATALOG

## Core Services (37+)

### Authentication & Identity
- AuthService
- SessionService
- TokenService
- SSOService

### AI & Agents
- CouncilService
- DeliberationService
- DecisionService
- OllamaService
- EnhancedLLMService

### Data & Analytics
- HelmService
- LineageService
- PredictService
- HealthService
- MetricsService

### Security & Compliance
- GuardService
- EthicsService
- ComplianceService
- AuditService
- ThreatDetectionService

### Enterprise
- TenantService
- FeatureControlService
- LicenseService
- BillingService

### Integration
- WorkflowService
- DataSourceService
- WebhookService
- NotificationService

---

# API REFERENCE

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
```http
POST /auth/login
POST /auth/register
POST /auth/logout
POST /auth/refresh
GET  /auth/me
```

## Council (AI Agents)
```http
GET  /council/agents
POST /council/query
POST /council/deliberate
GET  /council/modes
GET  /council/deliberation/:id
```

## Metrics & Alerts
```http
GET  /metrics
POST /metrics
GET  /alerts
POST /alerts/:id/acknowledge
```

## Graph
```http
GET  /graph/nodes
GET  /graph/edges
POST /graph/query
GET  /graph/lineage/:entityId
```

## Pillars
```http
GET  /pillars/helm/metrics
GET  /pillars/lineage/entities
GET  /pillars/predict/models
GET  /pillars/guard/threats
GET  /pillars/ethics/assessments
GET  /pillars/health/status
```

---

# SECURITY & COMPLIANCE

## Security Features

| Feature | Description |
|---------|-------------|
| **JWT Authentication** | Token-based auth with refresh |
| **RBAC** | Role-based access control |
| **MFA** | Multi-factor authentication |
| **Rate Limiting** | API request throttling |
| **CORS** | Cross-origin protection |
| **Helmet** | Security headers |
| **Audit Logging** | Complete activity trail |
| **Encryption** | TLS 1.3, AES-256 at rest |

## Compliance Ready

- SOC 2 Type II
- GDPR
- HIPAA
- CCPA
- ISO 27001

---

# INTERNATIONALIZATION

## Supported Languages (20+)

| Code | Language | Status |
|------|----------|--------|
| en | English | ✅ Complete |
| es | Spanish | ✅ Complete |
| fr | French | ✅ Complete |
| de | German | ✅ Complete |
| ja | Japanese | ✅ Complete |
| zh | Chinese (Simplified) | ✅ Complete |
| zh-TW | Chinese (Traditional) | ✅ Complete |
| ko | Korean | ✅ Complete |
| pt | Portuguese | ✅ Complete |
| it | Italian | ✅ Complete |
| nl | Dutch | ✅ Complete |
| ru | Russian | ✅ Complete |
| ar | Arabic (RTL) | ✅ Complete |
| hi | Hindi | ✅ Complete |
| bn | Bengali | ✅ Complete |
| vi | Vietnamese | ✅ Complete |
| th | Thai | ✅ Complete |
| id | Indonesian | ✅ Complete |
| ms | Malay | ✅ Complete |
| tr | Turkish | ✅ Complete |

---

# PRICING & PACKAGING

## Subscription Tiers

| Tier | Price | Agents | Features |
|------|-------|--------|----------|
| **Starter** | $299/mo | 5 Core | Basic dashboards, 10 users |
| **Growth** | $799/mo | 10 Core | Advanced analytics, 50 users |
| **Business** | $1,999/mo | 14 Core | All pillars, 200 users |
| **Enterprise** | Custom | All 30 | Full platform, unlimited |

## Add-On Packs

| Pack | Price | Agents |
|------|-------|--------|
| Audit Pack | $299/mo | 2 |
| Healthcare Pack | $399/mo | 4 |
| Finance Pack | $399/mo | 4 |
| Legal Pack | $399/mo | 4 |
| Agent Builder | $199/mo | Custom |

## Regional Pricing

| Region | Multiplier |
|--------|------------|
| United States | 1.0x |
| Europe | 0.9x |
| Latin America | 0.4x |
| Asia | 0.6x |

---

# APPENDIX

## Quick Stats

| Metric | Count |
|--------|-------|
| Total AI Agents | 30 |
| Personality Traits | 60 |
| Available Models | 35+ |
| Backend Services | 37+ |
| API Endpoints | 100+ |
| Frontend Routes | 100+ |
| Supported Languages | 20+ |
| Database Tables | 50+ |

## File Structure

```
datacendia-components/
├── src/
│   ├── components/          # React Components
│   ├── pages/               # Page Components
│   ├── lib/
│   │   ├── agents/          # Agent Configuration
│   │   ├── i18n/            # Internationalization
│   │   └── ollama/          # AI Integration
│   ├── layouts/             # Layout Components
│   └── routes.tsx           # Route Definitions
├── backend/
│   ├── src/
│   │   ├── routes/          # API Routes
│   │   ├── services/        # Business Logic
│   │   ├── middleware/      # Express Middleware
│   │   └── config/          # Configuration
│   └── prisma/              # Database Schema
├── tests/                   # Test Suite
└── docs/                    # Documentation
```

---

**Document Version:** 2.0  
**Last Updated:** December 2024  
**Classification:** Internal / Confidential

---

*© 2024 Datacendia. All Rights Reserved.*
