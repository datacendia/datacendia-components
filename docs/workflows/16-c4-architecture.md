# Datacendia Platform — C4 Architecture Diagrams

> **Purpose:** System architecture at three levels of abstraction — Context, Container, and Component — for client and engineering audiences.

## Level 1: System Context

```mermaid
C4Context
    title Datacendia Platform - System Context

    Person(user, "Enterprise User", "Executives, analysts, legal, compliance officers")
    Person(admin, "Platform Admin", "System administrators, IT ops")

    System(datacendia, "Datacendia Platform", "AI-powered enterprise decision intelligence with Council deliberation, compliance, threat detection, and knowledge management")

    System_Ext(ollama, "Ollama LLM Server", "Local AI inference: qwen2.5, qwq, llama3.2, nomic-embed-text")
    System_Ext(keycloak, "Keycloak SSO", "Enterprise identity provider with OIDC/SAML")
    System_Ext(tika, "Apache Tika", "Document text extraction (PDF, DOCX, XLSX, PPTX)")
    System_Ext(clientdb, "Client Databases", "PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, DB2")
    System_Ext(saas, "SaaS Integrations", "ServiceNow, Teams, Slack, SharePoint, Confluence, Jira")
    System_Ext(fred, "FRED API", "Federal Reserve economic data for forecasting")

    Rel(user, datacendia, "Uses", "HTTPS + WebSocket")
    Rel(admin, datacendia, "Manages", "HTTPS")
    Rel(datacendia, ollama, "LLM inference", "HTTP REST")
    Rel(datacendia, keycloak, "Authenticates", "OIDC")
    Rel(datacendia, tika, "Extracts text", "HTTP")
    Rel(datacendia, clientdb, "Zero-copy queries", "Native drivers")
    Rel(datacendia, saas, "Syncs data", "REST/OAuth2")
    Rel(datacendia, fred, "Economic data", "HTTPS")
```

## Level 2: Container Diagram

```mermaid
flowchart TB
    subgraph "Client Layer"
        FE["React Frontend<br/>(Vite + TanStack Router)<br/>Port 5173"]
        WS["WebSocket Client<br/>(Real-time Council streaming)"]
    end

    subgraph "API Layer"
        BE["Express.js Backend<br/>(TypeScript)<br/>Port 3001"]
        WSS["WebSocket Server<br/>(Council real-time events)"]
    end

    subgraph "AI / ML Layer"
        OL["Ollama LLM Server<br/>Port 11434<br/>qwen2.5:7b, qwq:32b,<br/>qwen2.5-coder:32b,<br/>llama3.2:3b,<br/>nomic-embed-text"]
    end

    subgraph "Data Layer"
        PG["PostgreSQL + pgvector<br/>Port 5433<br/>Primary OLTP + Vector Search"]
        RE["Redis<br/>Port 6380<br/>Cache + Sessions"]
        CH["ClickHouse<br/>Port 8123<br/>Fast SQL Analytics"]
        DR["Apache Druid<br/>Ports 8081-8888<br/>Time-Series Analytics"]
        MN["MinIO<br/>Ports 9000-9001<br/>S3 Object Storage"]
        N4["Neo4j<br/>Port 7687<br/>Graph Database"]
    end

    subgraph "Security Layer"
        KC["Keycloak SSO<br/>OIDC/SAML Provider"]
        CB["Casbin Policy Engine<br/>RBAC + ABAC"]
        FA["Falco<br/>Port 8765<br/>Runtime Security"]
        SC["step-ca<br/>Port 9001<br/>Internal PKI / mTLS"]
    end

    subgraph "Observability"
        TM["Grafana Tempo<br/>Ports 3200, 4317-4318<br/>Distributed Tracing"]
        OT["OpenTelemetry<br/>Instrumentation"]
    end

    subgraph "Document Processing"
        TK["Apache Tika<br/>Port 9998<br/>Text Extraction"]
    end

    FE -->|"REST API"| BE
    WS -->|"WebSocket"| WSS
    BE --> OL
    BE --> PG
    BE --> RE
    BE --> CH
    BE --> DR
    BE --> MN
    BE --> N4
    BE --> KC
    BE --> CB
    BE --> TK
    BE --> OT
    OT --> TM
    FA -.->|"Monitors"| BE

    style FE fill:#6366f1,color:#fff
    style BE fill:#3b82f6,color:#fff
    style OL fill:#10b981,color:#fff
    style PG fill:#f59e0b,color:#fff
    style RE fill:#ef4444,color:#fff
    style CH fill:#f59e0b,color:#fff
    style DR fill:#f59e0b,color:#fff
    style MN fill:#8b5cf6,color:#fff
    style KC fill:#ef4444,color:#fff
```

## Level 3: Component Diagram — Backend Services

```mermaid
flowchart TB
    subgraph "Core Decision Engine"
        CS["CouncilService<br/>AI Deliberation"]
        DS["DecisionService<br/>Decision Lifecycle"]
        DL["DeliberationService<br/>Persistence Layer"]
        PD["PostDeliberationService<br/>Executive Summaries"]
        ES["ExecutiveSummaryService"]
        SF["StatementOfFactsService"]
    end

    subgraph "AI & LLM"
        LLM["EnhancedLLMService<br/>RAG + Caching + Routing"]
        RAG["RAGService<br/>Vector Retrieval"]
        COT["ChainOfThought"]
        QR["QueryRouter"]
        LC["LLMCache"]
    end

    subgraph "Security & Compliance"
        AE["CendiaAegis<br/>Threat Intelligence"]
        SE["CendiaSentry<br/>AI Guardrails"]
        PA["CendiaPanopticon<br/>Regulation Engine"]
        AU["CendiaAudit<br/>Tamper-Proof Logging"]
        DI["CendiaDissent<br/>Protected Disagreement"]
    end

    subgraph "Simulation & Testing"
        CR["CendiaCrucible<br/>Monte Carlo Simulation"]
        RT["EnterpriseRedTeam<br/>OWASP + AI Adversarial"]
        RS["RuntimeSecurity<br/>Intrusion Detection"]
        SB["SBOMService<br/>Supply Chain"]
    end

    subgraph "Knowledge & Data"
        IG["CendiaIngest<br/>Vectorization Pipeline"]
        GR["CendiaGraph<br/>Knowledge Graph"]
        GN["CendiaGnosis<br/>Document Intelligence"]
        DD["DataDiode<br/>Sovereign Ingest"]
        LG["LogicGate<br/>Parallel Processing"]
    end

    subgraph "Enterprise Intelligence (15 modules)"
        EN1["Rainmaker — Sales"]
        EN2["Guardian — Customer Success"]
        EN3["Factory — Manufacturing"]
        EN4["Nerve — IT Ops"]
        EN5["Academy — L&D"]
        EN6["Scout — Talent"]
        EN7["Regent — CEO Cabinet"]
        EN8["Mesh — M&A Integration"]
        EN9["Procure — Procurement"]
        EN10["Equity — Investor Relations"]
        EN11["Habitat — Facilities"]
        EN12["Transit — Travel Security"]
        EN13["Resonance — Communications"]
        EN14["Docket — Legal Ops"]
        EN15["Inventum — R&D / IP"]
    end

    subgraph "Advanced Capabilities"
        AP["CendiaApotheosis<br/>Self-Improvement"]
        EC["EchoService<br/>Outcome Tracking"]
        CH2["ChronosAI<br/>Timeline Intelligence"]
        VX["CendiaVox<br/>Voice Interface"]
        OT2["CendiaOmniTranslate<br/>100+ Languages"]
        PM["PantheonMemory<br/>Institutional Memory"]
        NR["CendiaNarratives<br/>Story Intelligence"]
        HZ["CendiaHorizon<br/>Futures Planning"]
        SY["CendiaSymbiont<br/>Human-AI Partnership"]
        CA["CendiaCascade<br/>Failure Cascade Mapping"]
        OR["CendiaOrbit<br/>Stakeholder Management"]
        ET["CendiaEternal<br/>Knowledge Preservation"]
        RE2["CendiaResponsibility<br/>Ethics Engine"]
    end

    subgraph "Sovereign Architecture (11 patterns)"
        S1["DataDiode — Unidirectional Ingest"]
        S2["LocalRLHF — Zero-Cloud Fine-Tuning"]
        S3["DecisionDNA — Audit Artifact Export"]
        S4["ShadowCouncil — Sandbox Deliberation"]
        S5["DeterministicReplay — Bit-Perfect Replay"]
        S6["QRAirGapBridge — Air-Gap Transfer"]
        S7["CanaryTripwire — Exfiltration Detection"]
        S8["TPMAttestation — Hardware Signing"]
        S9["TimeLock — Embargoed Decisions"]
        S10["FederatedMesh — Multi-Site Learning"]
        S11["PortableInstance — USB Deployment"]
    end

    subgraph "Governance & Ethics"
        CC["AIConstitutionalCourt<br/>Governance"]
        CO["CollapseOrchestrator<br/>+ 18 Collapse Agents"]
        SG["SGASOrchestrator<br/>+ 5 Agent Types"]
        SCG["SCGEOrchestrator<br/>Stress Testing"]
    end

    subgraph "Verticals"
        VL["Legal Vertical (100%)"]
        VF["Financial Vertical (100%)"]
        VG["Government (80%)"]
        VH["Healthcare (75%)"]
        VI["Insurance (75%)"]
        VE["Energy (75%)"]
        VS["Sports Vertical"]
    end

    subgraph "Admin"
        AA["AdminAIService"]
        AS["AdminSettingsService"]
        FC["FeatureControlService"]
        LS["LicenseService"]
        TN["TenantService"]
        SH["SystemHealthService"]
        UM["UserManagementService"]
    end

    %% Core dependencies
    CS --> LLM
    CS --> RAG
    CS --> SE
    CS --> DL
    DL --> DS
    DI --> DS
    LLM --> RAG
    AE --> LLM
    PA --> LLM
    CR --> LLM
    IG --> GR
```

## Infrastructure Port Map

```mermaid
graph LR
    subgraph "External Ports"
        P5173["5173 — React Frontend"]
        P3001["3001 — Express Backend"]
    end

    subgraph "Database Ports"
        P5433["5433 — PostgreSQL + pgvector"]
        P6380["6380 — Redis"]
        P8123["8123 — ClickHouse"]
        P8888["8888 — Druid Router"]
        P8081["8081 — Druid Coordinator"]
        P8082["8082 — Druid Broker"]
        P9000["9000 — MinIO API"]
        P9001M["9001 — MinIO Console"]
        P7687["7687 — Neo4j Bolt"]
    end

    subgraph "AI & Processing"
        P11434["11434 — Ollama LLM"]
        P9998["9998 — Apache Tika"]
    end

    subgraph "Security & Observability"
        P8765["8765 — Falco Runtime"]
        P9001S["9001 — step-ca PKI"]
        P3200["3200 — Grafana Tempo"]
        P4317["4317 — OTLP gRPC"]
        P4318["4318 — OTLP HTTP"]
    end
```

## Data Storage Strategy

```mermaid
flowchart LR
    subgraph "Write Path"
        A["Transactional Data"] -->|"Prisma ORM"| PG["PostgreSQL<br/>Users, Orgs, Decisions,<br/>Deliberations, Threats,<br/>Regulations, Simulations"]
        B["Vector Embeddings"] -->|"pgvector"| PG
        C["Object Files"] -->|"S3 API"| MN["MinIO<br/>Documents, PDFs,<br/>Models, Backups, Exports"]
        D["Analytics Events"] -->|"HTTP Ingest"| DR["Druid / ClickHouse<br/>Audit logs, Metrics,<br/>Time-series, Telemetry"]
        E["Cache + Sessions"] -->|"ioredis"| RE["Redis<br/>LLM cache, Sessions,<br/>Rate limits"]
        F["Graph Data"] -->|"Bolt Protocol"| N4["Neo4j<br/>Entities, Relationships,<br/>Knowledge Graph"]
    end

    subgraph "Read Path"
        PG -->|"OLTP Queries"| G["API Responses"]
        PG -->|"Cosine Similarity"| H["RAG Context Retrieval"]
        MN -->|"Streaming"| I["Document Download"]
        DR -->|"Sub-second"| J["Chronos / Witness Dashboards"]
        RE -->|"< 1ms"| K["Cached LLM Responses"]
        N4 -->|"Graph Traversal"| L["Risk Discovery / Insights"]
    end
```

## Client Database Integration (Zero-Copy)

```mermaid
flowchart TD
    subgraph "Storage Modes"
        A["datacendia-hosted<br/>Data on Datacendia infra"]
        B["client-hosted<br/>Zero-copy: data stays on client DB"]
        C["hybrid-sync<br/>Bidirectional sync"]
        D["hybrid-cache<br/>Client = source of truth"]
    end

    subgraph "Supported Client Databases"
        PG2["PostgreSQL"]
        MY["MySQL"]
        MS["SQL Server"]
        OR["Oracle"]
        MG["MongoDB"]
        DB2["IBM DB2"]
    end

    subgraph "Adapter Layer"
        AM["AdapterManager<br/>Routes to correct adapter"]
        CHA["ClientHostedAdapter<br/>Direct DB connections"]
        DA["DataAdapter Interface<br/>Unified query API"]
    end

    A & B & C & D --> AM
    AM --> CHA
    CHA --> PG2 & MY & MS & OR & MG & DB2
    AM --> DA

    style B fill:#10b981,color:#fff
```

## Key References

- **Config:** `backend/src/config/index.ts` — all connection strings and env vars
- **Database:** `backend/src/config/database.ts` — Prisma client
- **Redis:** `backend/src/config/redis.ts` — ioredis with retry
- **Cache:** `backend/src/services/cache.service.ts` — Redis with in-memory fallback
- **Storage:** `backend/src/services/storage/` — ClickHouse, Druid, MinIO, Vector services
- **Security:** `backend/src/security/KeycloakAuth.ts`, `PolicyEngine.ts` (Casbin)
- **Telemetry:** `backend/src/telemetry/tracing.ts` — OpenTelemetry → Tempo
- **Adapters:** `backend/src/adapters/` — ClientHostedAdapter, AdapterManager
- **Sovereign:** `backend/src/services/sovereign/` — 11 air-gap patterns
- **Verticals:** `backend/src/services/verticals/` — Legal, Financial, Healthcare, Insurance, Energy, Sports
