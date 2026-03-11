# DEEP-DIVE AUDIT: datacendia-core
### Community Edition (Open-Source) Repository

**Repo:** github.com/datacendia/datacendia-core  
**Visibility:** Public  
**License:** Apache 2.0  
**Language:** TypeScript 95.8%, HTML 3.6%, JavaScript 0.4%, PLpgSQL 0.2%  
**Auditor:** Cascade AI Pair Programmer  
**Date:** March 10, 2026

---

## 1. PURPOSE & SCOPE

datacendia-core is the **Community Edition** — the open-source subset of the Datacendia platform. It provides the foundational council engine, decision ledger, and basic trust layer that the commercial enterprise edition (datacendia-components) builds upon.

**Open-core boundary:** Core deliberation + basic governance = free. Enterprise features (30 verticals, sovereign services, DCII, post-quantum, Basel III, etc.) = commercial.

---

## 2. REPOSITORY STRUCTURE

```
datacendia-core/
├── src/                    # React frontend (Vite + TypeScript + Tailwind)
│   ├── components/         # Reusable UI components
│   ├── pages/              # Page components
│   └── services/           # Frontend API clients
├── backend/                # Node.js backend (Express + Prisma)
│   ├── src/
│   │   ├── services/
│   │   │   ├── council/    # Council deliberation engine
│   │   │   ├── inference/  # LLM provider abstraction (Ollama/Triton/NIM)
│   │   │   ├── guardrails/ # NeMo Guardrails engine
│   │   │   ├── kafka/      # Apache Kafka event streaming
│   │   │   ├── temporal/   # Temporal.io workflow orchestration
│   │   │   ├── opa/        # Open Policy Agent
│   │   │   ├── vault/      # OpenBao/Vault secrets management
│   │   │   ├── gpu/        # RAPIDS analytics + Confidential Computing
│   │   │   ├── streaming/  # Flink CEP real-time processing
│   │   │   └── verticals/  # Industry vertical modules
│   │   ├── routes/         # API route files (domain-grouped)
│   │   ├── security/       # Casbin RBAC, Keycloak SSO
│   │   └── middleware/     # Auth, rate limiting, security
│   └── prisma/             # Database schema and models
├── docker-compose.yml      # Development infrastructure
├── vitest.critical.config.ts
├── package.json
├── CONTRIBUTING.md
├── COMMUNITY.md            # Open-source boundary definition
├── CODE_OF_CONDUCT.md
├── SECURITY.md
└── LICENSE                 # Apache 2.0
```

---

## 3. WHAT'S INCLUDED (Community Edition)

| Capability | Status | Notes |
|-----------|--------|-------|
| Council Engine (multi-agent deliberation) | ✅ | Core value proposition — open |
| Decision Ledger (immutable, Merkle-signed) | ✅ | Foundation of trust layer |
| Deliberation API | ✅ | REST endpoints for council operations |
| Basic Trust Layer (RBAC, audit, signing) | ✅ | Casbin RBAC, basic audit logging |
| Financial Services agents (basic) | ✅ | Lite version — no SR 11-7, FRTB |
| Docker Compose local deployment | ✅ | Single development compose file |
| 30 industry vertical definitions | ✅ Lite | Definitions only — not full 6-layer implementation |
| 9 infrastructure integrations | ✅ | Kafka, Temporal, OPA, OpenBao, NeMo, RAPIDS, CC, Flink, Triton |

## 4. WHAT'S NOT INCLUDED (Enterprise Only)

| Capability | Enterprise Repo |
|-----------|----------------|
| Full 30 verticals (6-layer, deep-tested) | datacendia-components |
| Sovereign Services (11 services) | datacendia-components |
| Post-Quantum KMS (ML-DSA, SLH-DSA) | datacendia-components |
| Zero-Knowledge Proofs | datacendia-components |
| Basel III Engine (real CRR formulas) | datacendia-components |
| EU AI Act Classification Engine | datacendia-components |
| DCII (9 Decision Primitives) | datacendia-components |
| CendiaGateway (AI governance proxy) | datacendia-components |
| Ghost Board, CendiaCollapse (19 agents) | datacendia-components |
| White-label licensing | datacendia-components |
| Air-gapped deployment tooling | datacendia-components |
| 205,755 test suite | datacendia-components |

---

## 5. AUDIT FINDINGS

### Health

| Dimension | Assessment | Notes |
|-----------|-----------|-------|
| README quality | ✅ Good | Clear architecture, getting started, prerequisites |
| License | ✅ Apache 2.0 | Correct for open-core community edition |
| CONTRIBUTING.md | ✅ Present | Conventional Commits, PR guidelines |
| CODE_OF_CONDUCT.md | ✅ Present | Standard code of conduct |
| SECURITY.md | ✅ Present | Vulnerability reporting process |
| COMMUNITY.md | ✅ Present | Open-source boundary definition |
| CI/CD | ✅ | GitHub Actions (ci.yml, security.yml, dependabot.yml) |
| Releases | ✅ 2 releases | Published on GitHub |

### Issues & Recommendations

| # | Finding | Priority | Recommendation |
|---|---------|----------|---------------|
| C1 | **Vertical definitions are "lite"** — not full 6-layer implementations | Info | Expected — this is the community/enterprise boundary |
| C2 | **No test results published** in README | Medium | Add test badge and basic test count to README |
| C3 | **Infrastructure integrations reference enterprise features** | Low | Clarify which integrations are community vs enterprise in README |
| C4 | **README says "30 industry vertical definitions"** but these are definitions only | Medium | Clarify: "30 vertical definitions (full implementation in Enterprise Edition)" |
| C5 | **No npm audit results visible** | Medium | Run `npm audit` and address any critical/high vulnerabilities |
| C6 | **Branch is `master`** not `main` | Low | Consider renaming to `main` for convention alignment |

### Alignment with Enterprise Repo

| Check | Status |
|-------|--------|
| Community README references Enterprise correctly | ✅ |
| No enterprise-only code leaked to community repo | ✅ (based on repo structure review) |
| License boundary is clear (Apache 2.0 vs Commercial) | ✅ |
| COMMUNITY.md defines open-source boundary | ✅ |

---

## 6. SCORE

| Dimension | Score/10 |
|-----------|---------|
| Documentation | 8.0 |
| License/Legal | 10.0 |
| CI/CD | 8.0 |
| Open-Core Boundary Clarity | 8.0 |
| Community Readiness | 7.0 |
| **Overall** | **8.2/10** |

---

*Audit completed March 10, 2026 by Cascade AI Pair Programmer*
