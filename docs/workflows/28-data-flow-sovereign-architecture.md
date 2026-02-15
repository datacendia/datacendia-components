# Datacendia Platform — Data Flow & Sovereign Architecture Diagrams

> **Purpose:** End-to-end data pipelines, sovereign deployment patterns, and integration topology.

## End-to-End Data Flow Pipeline

```mermaid
flowchart TD
    subgraph "1. Data Ingestion"
        A1["User Upload<br/>(PDF, DOCX, CSV)"]
        A2["CendiaBridge<br/>(13 DMS connectors)"]
        A3["Client DB Adapters<br/>(PG, MySQL, MSSQL, Oracle, Mongo)"]
        A4["DataDiode<br/>(Sovereign unidirectional)"]
        A5["API Connectors<br/>(ServiceNow, Jira, Slack)"]
        A6["FRED API<br/>(Economic data)"]
    end

    subgraph "2. Processing Layer"
        B1["Apache Tika<br/>(Text extraction)"]
        B2["CendiaIngest<br/>(Chunk: 1000 chars, 200 overlap)"]
        B3["nomic-embed-text<br/>(Vector embeddings)"]
        B4["Entity/Relationship Extraction<br/>(LLM-powered)"]
        B5["CendiaGnosis<br/>(Document intelligence)"]
    end

    subgraph "3. Storage Layer"
        C1["PostgreSQL + pgvector<br/>OLTP + Vectors"]
        C2["Neo4j<br/>Knowledge Graph"]
        C3["MinIO<br/>Documents + PDFs"]
        C4["ClickHouse / Druid<br/>Analytics + Time-Series"]
        C5["Redis<br/>Cache + Sessions"]
    end

    subgraph "4. Intelligence Layer"
        D1["Cortex Gateway<br/>(8 Pillars → Aggregator)"]
        D2["EnhancedLLMService<br/>(RAG + Cache + Routing)"]
        D3["CouncilService<br/>(Multi-agent deliberation)"]
        D4["CendiaSentry<br/>(8 Guardrails)"]
    end

    subgraph "5. Output Layer"
        E1["Decision Packets<br/>(Merkle tree + KMS signed)"]
        E2["Compliance Bundles<br/>(35+ frameworks)"]
        E3["Evidence Vault<br/>(Locked, exportable)"]
        E4["Real-time Dashboard<br/>(WebSocket streaming)"]
        E5["Regulator Receipts<br/>(Proof of submission)"]
    end

    A1 --> B1 --> B2
    A2 --> B2
    A3 --> D1
    A4 --> B2
    A5 --> B2
    A6 --> C4

    B2 --> B3 --> C1
    B2 --> B4 --> C2
    B2 --> C3
    B5 --> B1

    C1 --> D1
    C2 --> D1
    C4 --> D1
    C5 --> D2

    D1 --> D2 --> D3
    D3 --> D4

    D4 --> E1
    D4 --> E4
    E1 --> E2
    E1 --> E3
    E3 --> E5

    style D3 fill:#6366f1,color:#fff
    style E1 fill:#10b981,color:#fff
    style D4 fill:#ef4444,color:#fff
```

## RAG (Retrieval-Augmented Generation) Pipeline

```mermaid
flowchart TD
    A["User Query"] --> B["QueryRouter<br/>(Route to optimal pipeline)"]

    B --> C["RAGService: Retrieve Context"]
    C --> D["pgvector: Cosine Similarity Search"]
    D --> E["Top-K relevant chunks (k=5-20)"]

    E --> F["Check LLMCache (Redis)"]
    F --> G{Cache Hit?}
    G -->|Yes| H["Return cached response (< 1ms)"]
    G -->|No| I["Build Prompt with Context"]

    I --> J["Select Model"]
    J --> K["qwen2.5:7b (fast, Tier 1)"]
    J --> L["qwq:32b (reasoning, complex)"]
    J --> M["qwen2.5-coder:32b (code tasks)"]

    K & L & M --> N["Ollama LLM Inference"]
    N --> O["CendiaSentry: Apply 8 Guardrails"]
    O --> P["PII Redaction + Bias Check +<br/>Hallucination Detection + Toxicity Filter"]

    P --> Q["Cache Response in Redis"]
    Q --> R["Stream to User via WebSocket"]

    style A fill:#6366f1,color:#fff
    style D fill:#3b82f6,color:#fff
    style N fill:#10b981,color:#fff
    style O fill:#ef4444,color:#fff
```

## Council Deliberation Data Flow

```mermaid
sequenceDiagram
    participant User
    participant WS as WebSocket
    participant Council as CouncilService
    participant LLM as EnhancedLLMService
    participant Sentry as CendiaSentry
    participant RAG as RAGService
    participant DB as PostgreSQL
    participant Audit as CendiaAudit

    User->>WS: Submit question + mode
    WS->>Council: startDeliberation()

    loop For each agent (3-7 agents)
        Council->>RAG: Retrieve relevant context
        RAG-->>Council: Top-K chunks with citations
        Council->>LLM: Generate agent response
        LLM-->>Council: Token stream
        Council->>Sentry: Check guardrails
        Sentry-->>Council: Pass/Fail + redactions
        Council->>WS: Stream tokens to user
        Council->>Audit: Log agent statement
    end

    Council->>Council: Build consensus
    Council->>DB: Save deliberation
    Council->>DB: Generate decision packet
    Council->>WS: Final recommendation
    
    Note over Council,DB: Post-Deliberation
    Council->>DB: CendiaEcho schedules outcome tracking
    Council->>Audit: Hash-chained audit entry
```

## Sovereign Architecture — 11 Air-Gap Patterns

```mermaid
flowchart TB
    subgraph "Data Boundary (Ingest)"
        S1["DataDiode<br/>Unidirectional: data IN only<br/>Quarantine → Scan → Verify"]
    end

    subgraph "AI Boundary (Local Only)"
        S2["LocalRLHF<br/>Zero-cloud fine-tuning<br/>Feedback → Dataset → LoRA"]
        S10["FederatedMesh<br/>Multi-site learning via sneakernet<br/>Differential privacy"]
    end

    subgraph "Decision Integrity"
        S3["DecisionDNA<br/>One-click audit artifact export<br/>PDF + JSON + Merkle tree"]
        S5["DeterministicReplay<br/>Bit-perfect reproducibility<br/>Pinned seeds + state capture"]
        S8["TPMAttestation<br/>Hardware-signed decisions<br/>(Software fallback)"]
    end

    subgraph "Time & Secrecy"
        S9["TimeLock<br/>RSA time-lock puzzles<br/>Embargoed until T+N"]
        S4["ShadowCouncil<br/>Sandbox deliberation<br/>Radical ideas without ledger"]
    end

    subgraph "Transfer Boundary (Export)"
        S6["QRAirGapBridge<br/>Animated QR sequences<br/>Zero-media transfer"]
        S11["PortableInstance<br/>Bootable USB deployment<br/>Full platform on a stick"]
    end

    subgraph "Defense (Detection)"
        S7["CanaryTripwire<br/>Honeypot records<br/>Exfiltration detection"]
    end

    S1 -->|"Safe data"| S2
    S2 -->|"Local AI"| S3
    S3 -->|"Signed artifacts"| S8
    S8 -->|"Export needed"| S6
    S10 -->|"USB model updates"| S11
    S7 -.->|"Monitors all zones"| S1 & S3 & S6

    style S1 fill:#6366f1,color:#fff
    style S8 fill:#8b5cf6,color:#fff
    style S7 fill:#ef4444,color:#fff
    style S6 fill:#f59e0b,color:#fff
```

## Integration Map — External Systems

```mermaid
flowchart TB
    subgraph "AI / ML"
        OL["Ollama LLM Server<br/>5 models: qwen2.5:7b, qwq:32b,<br/>qwen2.5-coder:32b, llama3.2:3b,<br/>nomic-embed-text"]
    end

    subgraph "Identity & Auth"
        KC["Keycloak SSO<br/>OIDC / SAML 2.0"]
    end

    subgraph "Legal Research APIs"
        LR1["CourtListener"]
        LR2["eCFR"]
        LR3["Open States"]
        LR4["Federal Register"]
        LR5["SEC EDGAR"]
        LR6["Westlaw (premium)"]
    end

    subgraph "Document Management"
        DM1["iManage"]
        DM2["NetDocuments"]
        DM3["SharePoint"]
    end

    subgraph "Practice Management"
        PM1["Clio"]
        PM2["PracticePanther"]
    end

    subgraph "eDiscovery"
        ED1["Relativity"]
        ED2["Nuix"]
    end

    subgraph "Contract Lifecycle"
        CL1["Ironclad"]
        CL2["DocuSign CLM"]
    end

    subgraph "Economic Data"
        FRED["FRED API<br/>Federal Reserve data"]
    end

    subgraph "Security / PKI"
        TSA["DigiCert / Comodo / FreeTSA<br/>(RFC 3161 timestamps)"]
        KMS2["AWS KMS / Vault / Azure KV"]
        BC["Bitcoin / Ethereum / Polygon<br/>(Blockchain anchoring)"]
        FALCO["Falco Runtime Security"]
        STEP["step-ca Internal PKI"]
    end

    subgraph "Client Databases"
        CDB1["PostgreSQL"]
        CDB2["MySQL"]
        CDB3["SQL Server"]
        CDB4["Oracle"]
        CDB5["MongoDB"]
        CDB6["IBM DB2"]
    end

    subgraph "Observability"
        TEMPO["Grafana Tempo<br/>(Distributed tracing)"]
        OTEL["OpenTelemetry"]
        PROM["Prometheus Metrics"]
    end

    CORE["Datacendia Platform"] --> OL
    CORE --> KC
    CORE --> LR1 & LR2 & LR3 & LR4 & LR5 & LR6
    CORE --> DM1 & DM2 & DM3
    CORE --> PM1 & PM2
    CORE --> ED1 & ED2
    CORE --> CL1 & CL2
    CORE --> FRED
    CORE --> TSA & KMS2 & BC
    CORE --> CDB1 & CDB2 & CDB3 & CDB4 & CDB5 & CDB6
    CORE --> FALCO & STEP
    CORE --> OTEL --> TEMPO
    CORE --> PROM

    style CORE fill:#6366f1,color:#fff
```

## Deployment Architecture

```mermaid
flowchart TB
    subgraph "Standard Deployment (Docker Compose)"
        DC1["docker-compose.unified.yml"]
        DC2["Profile: core (minimal)"]
        DC3["Profile: analytics (+ Druid/ClickHouse)"]
        DC4["Profile: full (everything)"]
    end

    subgraph "Container Services"
        CS1["datacendia-backend:3001"]
        CS2["datacendia-frontend:5173"]
        CS3["postgres:5433 (+ pgvector)"]
        CS4["redis:6380"]
        CS5["minio:9000-9001"]
        CS6["ollama:11434"]
        CS7["neo4j:7687"]
        CS8["clickhouse:8123"]
        CS9["druid:8081-8888"]
        CS10["tika:9998"]
        CS11["keycloak"]
        CS12["step-ca:9001"]
        CS13["falco:8765"]
        CS14["tempo:3200,4317-4318"]
    end

    subgraph "Sovereign Deployment"
        SD1["PortableInstance<br/>(Bootable USB)"]
        SD2["Air-gapped network"]
        SD3["No internet required"]
        SD4["Local Ollama only"]
    end

    subgraph "Cloud Deployment (Future)"
        CD1["Kubernetes"]
        CD2["Horizontal scaling"]
        CD3["Redis Cluster adapter for Socket.IO"]
    end

    DC1 --> CS1 & CS2 & CS3 & CS4 & CS5 & CS6 & CS7 & CS8 & CS9 & CS10 & CS11 & CS12 & CS13 & CS14

    style DC1 fill:#6366f1,color:#fff
    style SD1 fill:#8b5cf6,color:#fff
```

## Audit Trail Data Flow (Tamper-Proof)

```mermaid
flowchart TD
    A["Any Platform Event"] --> B["CendiaAudit.logEvent()"]
    B --> C["Generate event hash (SHA-256)"]
    C --> D["Chain: hash includes previousHash"]
    D --> E["HMAC signature with AUDIT_SIGNING_KEY"]
    E --> F["Store to PostgreSQL audit_events"]

    F --> G["Parallel: Store to Druid/ClickHouse<br/>(analytics queries)"]
    F --> H["Parallel: Record to Chronos<br/>(timeline intelligence)"]

    I["Verify Chain Integrity"] --> J["Walk chain from genesis"]
    J --> K["For each event: recompute hash"]
    K --> L{Hash matches stored?}
    L -->|Yes| M["Chain intact ✓"]
    L -->|No| N["TAMPERING DETECTED ✗"]

    O["Export for Regulator"] --> P["Generate Compliance Report"]
    P --> Q["Framework-specific formatting"]
    Q --> R["Merkle tree of all events"]
    R --> S["KMS sign the export"]
    S --> T["Regulator Receipt generated"]

    style B fill:#6366f1,color:#fff
    style N fill:#ef4444,color:#fff
    style T fill:#10b981,color:#fff
```
