# Datacendia Platform — API Route Map

> **Source:** `backend/src/index.ts` + `backend/src/routes/domains/`
> **Base URL:** `/api/v1/`
> **Architecture:** 14 Domain Routers consolidating ~110 route modules

## Domain Router Architecture

```mermaid
flowchart TB
    subgraph "Express App (Port 3001)"
        MW["Middleware Stack:<br/>Helmet, CORS, Rate Limit,<br/>Body Parse, CSRF, Security"]
    end

    MW --> D1["authDomain"]
    MW --> D2["councilDomain"]
    MW --> D3["dataDomain"]
    MW --> D4["governanceDomain"]
    MW --> D5["securityDomain"]
    MW --> D6["sovereignDomain"]
    MW --> D7["enterpriseDomain"]
    MW --> D8["legalDomain"]
    MW --> D9["verticalsDomain"]
    MW --> D10["platformDomain"]
    MW --> D11["simulationDomain"]
    MW --> D12["workflowsDomain"]
    MW --> D13["intelligenceDomain"]
    MW --> D14["demoDomain"]

    style MW fill:#6366f1,color:#fff
```

## Complete API Route Map by Domain

```mermaid
flowchart LR
    subgraph "1. authDomain"
        A1["/auth/login — POST"]
        A2["/auth/register — POST"]
        A3["/auth/refresh — POST"]
        A4["/auth/logout — POST"]
        A5["/auth/me — GET"]
        A6["/auth/forgot-password — POST"]
        A7["/auth/reset-password — POST"]
        A8["/auth/verify-email — POST"]
        A9["/users/* — CRUD"]
        A10["/organizations/* — CRUD"]
    end

    subgraph "2. councilDomain"
        B1["/council/query — POST (Deliberation)"]
        B2["/council/stream — WS (Real-time)"]
        B3["/deliberations/* — CRUD"]
        B4["/decisions/* — CRUD"]
        B5["/veto/* — Approval gates"]
        B6["/union/* — Agent union"]
        B7["/dissent/* — Protected dissent"]
        B8["/vox/* — Stakeholder voice"]
        B9["/echo/* — Outcome tracking"]
        B10["/council-packets/* — Decision packets"]
    end

    subgraph "3. dataDomain"
        C1["/metrics/* — KPIs"]
        C2["/alerts/* — Alert management"]
        C3["/forecasts/* — FRED predictions"]
        C4["/data-sources/* — Client DBs"]
        C5["/lineage/* — Data provenance"]
        C6["/druid/* — Analytics queries"]
        C7["/rag/* — Vector retrieval"]
        C8["/graph/* — Knowledge graph"]
        C9["/horizon/* — Multi-universe sim"]
    end

    subgraph "4. governanceDomain"
        D1g["/compliance/* — Assessment + bundles"]
        D2g["/govern/* — Policy enforcement"]
        D3g["/panopticon/* — 200+ regulations"]
        D4g["/pillars/* — 8 data pillars"]
        D5g["/responsibility/* — Ethics engine"]
        D6g["/constitutional-court/* — Dispute resolution"]
    end
```

```mermaid
flowchart LR
    subgraph "5. securityDomain"
        E1["/crucible/* — Monte Carlo sim"]
        E2["/crucible-enterprise/* — Red team + SBOM"]
        E3["/aegis/* — Threat intelligence"]
        E4["/kms/* — Key management"]
        E5["/post-quantum/* — PQ crypto"]
        E6["/zkp/* — Zero-knowledge proofs"]
        E7["/adversarial-redteam/* — AI attacks"]
    end

    subgraph "6. sovereignDomain"
        F1["/sovereign-arch/diode/* — Data diode"]
        F2["/sovereign-arch/rlhf/* — Local fine-tuning"]
        F3["/sovereign-arch/dna/* — Decision DNA"]
        F4["/sovereign-arch/shadow/* — Shadow council"]
        F5["/sovereign-arch/replay/* — Deterministic replay"]
        F6["/sovereign-arch/qr/* — Air-gap bridge"]
        F7["/sovereign-arch/canary/* — Tripwires"]
        F8["/sovereign-arch/tpm/* — TPM attestation"]
        F9["/sovereign-arch/timelock/* — Time-lock"]
        F10["/sovereign-arch/mesh/* — Federated mesh"]
        F11["/sovereign-arch/portable/* — USB deploy"]
        F12["/vault/* — Evidence vault"]
        F13["/evidence/* — Evidence export"]
        F14["/eternal/* — Knowledge preservation"]
    end

    subgraph "7. enterpriseDomain"
        G1["/enterprise/* — 15 enterprise modules"]
        G2["/ledger/* — Financial ledger"]
        G3["/audit-packages/* — Audit bundles"]
        G4["/ai-insurance/* — Per-decision coverage"]
        G5["/cascade/* — Butterfly effect"]
        G6["/connectors/* — Data connectors"]
        G7["/hr/* — HR integration"]
    end

    subgraph "8. legalDomain"
        H1["/legal/* — Legal vertical"]
        H2["/legal-research/* — 5 live APIs"]
        H3["/legal-services/* — Bridge + Govern + Veto"]
    end
```

```mermaid
flowchart LR
    subgraph "9. verticalsDomain"
        I1["/financial/* — Financial vertical"]
        I2["/healthcare/* — Healthcare vertical"]
        I3["/insurance/* — Insurance vertical"]
        I4["/energy/* — Energy vertical"]
        I5["/defense/* — Defense vertical"]
        I6["/sports/* — Sports vertical"]
        I7["/vertical-agents/* — Vertical AI agents"]
    end

    subgraph "10. platformDomain"
        J1["/platform/* — Platform services"]
        J2["/core/* — Core platform"]
        J3["/cortex/* — Data gateway"]
        J4["/admin/* — Admin AI + settings"]
        J5["/settings/* — User/org settings"]
        J6["/health/* — System health"]
        J7["/i18n/* — Internationalization"]
        J8["/notifications/* — Notification center"]
        J9["/upload/* — File uploads"]
        J10["/omnitranslate/* — 100+ languages"]
    end

    subgraph "11. simulationDomain"
        K1["/sgas/* — Agent deliberation graph"]
        K2["/scge/* — Civic governance sim"]
        K3["/collapse/* — Dual-track deliberation"]
    end

    subgraph "12. workflowsDomain"
        L1["/workflows/* — Workflow engine"]
        L2["/integrations/* — External integrations"]
        L3["/scheduler/* — Job scheduling"]
    end

    subgraph "13. intelligenceDomain"
        M1["/persona/* — Agent personas"]
        M2["/autopilot/* — AI autopilot"]
        M3["/decision-intel/* — Chronos + timeline"]
        M4["/gnosis/* — Document intelligence"]
        M5["/apotheosis/* — Self-improvement"]
        M6["/visualization/* — Replay theater"]
    end

    subgraph "14. demoDomain"
        N1["/leads/* — Lead management"]
        N2["/premium/* — Premium features"]
        N3["/demo/* — Demo mode"]
        N4["/consolidated/* — Unified demo"]
    end
```

## Special Routes (Outside Domain Routers)

```mermaid
flowchart TD
    subgraph "Pre-Middleware Routes"
        A["/health — GET (Liveness probe)"]
        B["/liveness — GET (K8s liveness)"]
        C["/readiness — GET (K8s readiness)"]
        D["/metrics — GET (Prometheus scrape)"]
    end

    subgraph "Documentation"
        E["/api/docs — Swagger UI (dev only)"]
        F["/api/docs.json — OpenAPI spec"]
    end

    subgraph "Security"
        G["/api/v1/csrf-token — GET"]
    end

    subgraph "WebSocket"
        H["Socket.IO — Real-time Council streaming"]
    end

    style A fill:#10b981,color:#fff
    style H fill:#6366f1,color:#fff
```

## Middleware Pipeline

```mermaid
flowchart TD
    A["Incoming Request"] --> B["Liveness Probes (/health, /liveness, /readiness)"]
    B --> C["Prometheus Metrics (/metrics)"]
    C --> D["Helmet (Security Headers)"]
    D --> E["CORS (Whitelist + Dev localhost)"]
    E --> F["Rate Limiting (100/min prod, 1000/min dev)"]
    F --> G["Body Parsing (10MB limit)"]
    G --> H["Cookie Parser"]
    H --> I["Compression"]
    I --> J["Request Logging"]
    J --> K["CendiaCrucible Security"]
    K --> K1["Path Traversal Defense"]
    K --> K2["SQL Injection Defense"]
    K --> K3["Prompt Injection Defense (Council routes)"]
    K1 & K2 & K3 --> L["Custom Security Headers"]
    L --> M["Honeypot Middleware"]
    M --> N{Production?}
    N -->|Yes| O["Master Security + Replay Attack +<br/>Data Exfiltration + Threat Detection"]
    N -->|No| P["Skip advanced security"]
    O & P --> Q["CSRF Protection"]
    Q --> R["Redis API Cache (40-60% faster)"]
    R --> S["14 Domain Routers"]

    style A fill:#6366f1,color:#fff
    style K fill:#ef4444,color:#fff
    style R fill:#10b981,color:#fff
```

## Key References

| Domain | Route Files | Approximate Endpoints |
|--------|------------|----------------------|
| **authDomain** | `auth.ts`, `users.ts`, `organizations.ts` | ~20 |
| **councilDomain** | `council.ts`, `deliberations.ts`, `decisions.ts`, `veto.ts`, `dissent.ts`, `vox.ts`, `echo.ts`, `council-packets.ts` | ~35 |
| **dataDomain** | `metrics.ts`, `alerts.ts`, `forecasts.ts`, `data-sources.ts`, `lineage.ts`, `druid.ts`, `rag.ts`, `graph.ts`, `horizon.ts` | ~30 |
| **governanceDomain** | `compliance.ts`, `govern.ts`, `panopticon.ts`, `pillars.ts`, `responsibility.ts`, `constitutional-court.ts` | ~25 |
| **securityDomain** | `crucible.ts`, `crucible-enterprise.ts`, `aegis.ts`, `kms.ts`, `post-quantum.ts`, `zkp.ts` | ~25 |
| **sovereignDomain** | `sovereign-arch.ts`, `vault.ts`, `evidence.ts`, `eternal.ts` | ~40 |
| **enterpriseDomain** | `enterprise.ts`, `ledger.ts`, `audit-packages.ts`, `ai-insurance.ts`, `cascade.ts` | ~30 |
| **legalDomain** | `legal.ts`, `legal-research.ts`, `legal-services.ts` | ~20 |
| **verticalsDomain** | `financial.ts`, `healthcare.ts`, `insurance.ts`, `energy.ts`, `defense.ts`, `sports.ts` | ~25 |
| **platformDomain** | `platform.ts`, `core.ts`, `cortex.ts`, `admin.ts`, `health.ts`, `i18n.ts`, `omnitranslate.ts` | ~30 |
| **simulationDomain** | `sgas.ts`, `scge.ts`, `collapse.ts` | ~15 |
| **workflowsDomain** | `workflows.ts`, `integrations.ts`, `scheduler.ts` | ~10 |
| **intelligenceDomain** | `persona.ts`, `autopilot.ts`, `decision-intel.ts`, `gnosis.ts`, `apotheosis.ts`, `visualization.ts` | ~20 |
| **demoDomain** | `leads.ts`, `premium.ts`, `demo.ts` | ~10 |
| **TOTAL** | **~110 route modules** | **~335+ endpoints** |
