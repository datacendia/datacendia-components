# Datacendia Platform — Service Dependency Graph

> **Purpose:** How backend services depend on each other, infrastructure, and external systems.

## Core Infrastructure Dependencies

```mermaid
flowchart TB
    subgraph "Infrastructure Layer"
        PG["PostgreSQL 16 + pgvector<br/>Port 5433"]
        RD["Redis 7<br/>Port 6380"]
        OL["Ollama LLM<br/>Port 11434"]
        N4["Neo4j 5<br/>Port 7687"]
        MN["MinIO S3<br/>Port 9000"]
        TK["Apache Tika<br/>Port 9998"]
        CH["ClickHouse<br/>Port 8123"]
        DR["Apache Druid<br/>Port 8081-8888"]
        ZK["Zookeeper<br/>Port 2181"]
    end

    subgraph "Core Services (depend on PG + Redis)"
        AUTH["AuthService"]
        COUNCIL["CouncilService"]
        LLM["EnhancedLLMService"]
        RAG["RAGService"]
        AUDIT["CendiaAudit"]
    end

    AUTH --> PG & RD
    COUNCIL --> PG & RD & OL
    LLM --> PG & RD & OL
    RAG --> PG & OL
    AUDIT --> PG & CH

    DR --> ZK

    style PG fill:#3b82f6,color:#fff
    style RD fill:#ef4444,color:#fff
    style OL fill:#10b981,color:#fff
```

## Service-to-Service Dependency Map

```mermaid
flowchart TD
    subgraph "Entry Points"
        API["Express API (3001)"]
        WS["Socket.IO WebSocket"]
    end

    subgraph "Council Ecosystem"
        CS["CouncilService"]
        DP["CouncilDecisionPacketService"]
        SENTRY["CendiaSentryService (8 guardrails)"]
        ECHO["EchoService (outcome tracking)"]
        DISSENT["DissentService"]
        VOX["VoxService (stakeholder voice)"]
        VETO["ApprovalGateService"]
    end

    subgraph "Intelligence Layer"
        ELLM["EnhancedLLMService"]
        RAG["RAGService"]
        GNOSIS["GnosisService (document intel)"]
        CHRONOS["ChronosAIService (timeline)"]
        HORIZON["HorizonService (multi-universe)"]
        ORBIT["OrbitService (influence graph)"]
        CASCADE["CascadeService (butterfly effect)"]
    end

    subgraph "Data Layer"
        CORTEX["CortexCoreService (gateway)"]
        PILLARS["8 Pillar Services"]
        LINEAGE["LineageService"]
        FORECAST["TimeSeriesForecaster"]
    end

    subgraph "Security Layer"
        KMS["KeyManagementService"]
        CRUCIBLE["CrucibleService"]
        AEGIS["AegisService"]
        PQ["PostQuantumService"]
    end

    subgraph "Evidence Layer"
        VAULT["EvidenceVaultService"]
        SIGNED["SignedTestReportService"]
        PDF["PDFGeneratorService"]
        RECEIPT["RegulatorsReceiptService"]
    end

    subgraph "Compliance Layer"
        COMPLY["ComplianceService"]
        MONITOR["ContinuousComplianceMonitor"]
        CROSS["CrossJurisdictionEngine"]
        PANOP["PanopticonService"]
    end

    subgraph "Governance Simulation"
        COLLAPSE["CollapseOrchestrator"]
        SCGE["SCGEOrchestrator"]
        SGAS["SGASOrchestrator"]
        COURT["AIConstitutionalCourt"]
    end

    %% Entry point flows
    API --> CS & CORTEX & COMPLY & VAULT
    WS --> CS

    %% Council dependencies
    CS --> ELLM & SENTRY & RAG
    CS --> DP
    CS --> ECHO & VOX
    DP --> KMS & VAULT

    %% Intelligence dependencies
    ELLM --> RAG
    HORIZON --> ORBIT
    CASCADE --> ORBIT
    CHRONOS --> ELLM
    GNOSIS --> ELLM & RAG

    %% Data dependencies
    CORTEX --> PILLARS
    FORECAST --> ELLM

    %% Evidence dependencies
    SIGNED --> PDF & KMS
    VAULT --> KMS
    RECEIPT --> VAULT & KMS

    %% Compliance dependencies
    MONITOR --> COMPLY
    CROSS --> COMPLY & PANOP
    COMPLY --> ELLM

    %% Governance dependencies
    COLLAPSE --> ELLM & SENTRY
    SCGE --> ELLM
    SGAS --> ELLM
    COURT --> ELLM

    %% Security dependencies
    CRUCIBLE --> ELLM
    AEGIS --> ELLM

    style CS fill:#6366f1,color:#fff
    style ELLM fill:#10b981,color:#fff
    style KMS fill:#8b5cf6,color:#fff
    style CORTEX fill:#3b82f6,color:#fff
```

## Pillar Service Dependencies

```mermaid
flowchart TD
    CORTEX["CortexCoreService<br/>(Single Data Gateway)"] --> H["HelmPillar<br/>(KPIs & Strategy)"]
    CORTEX --> L["LineagePillar<br/>(Data Provenance)"]
    CORTEX --> P["PredictPillar<br/>(Forecasting)"]
    CORTEX --> F["FlowPillar<br/>(Operations)"]
    CORTEX --> HE["HealthPillar<br/>(Org Health)"]
    CORTEX --> G["GuardPillar<br/>(Security Posture)"]
    CORTEX --> E["EthicsPillar<br/>(Ethical Scoring)"]
    CORTEX --> A["AgentsPillar<br/>(AI Agent Status)"]

    H & L & P & F & HE & G & E & A --> PG["PostgreSQL"]
    CORTEX --> LLM["EnhancedLLMService<br/>(NL query → pillar routing)"]

    style CORTEX fill:#6366f1,color:#fff
```

## Sovereign Service Dependencies

```mermaid
flowchart TD
    subgraph "Sovereign Services (Air-Gap Safe)"
        DIODE["DataDiodeService"] --> TIKA["Apache Tika"]
        RLHF["LocalRLHFService"] --> OL["Ollama (local)"]
        DNA["DecisionDNAService"] --> PDF["PDFGeneratorService"]
        DNA --> KMS["KeyManagementService"]
        SHADOW["ShadowCouncilService"] --> CS["CouncilService"]
        REPLAY["DeterministicReplayService"] --> PG["PostgreSQL"]
        QR["QRAirGapBridgeService"]
        CANARY["CanaryTripwireService"] --> PG
        TPM["TPMAttestationService"] --> KMS
        TIMELOCK["TimeLockService"]
        MESH["FederatedMeshService"]
        PORTABLE["PortableInstanceService"]
    end

    style DIODE fill:#6366f1,color:#fff
    style TPM fill:#8b5cf6,color:#fff
```

## External System Dependencies

```mermaid
flowchart LR
    subgraph "Legal Research (5 APIs)"
        CR["CourtListener"]
        ECFR["eCFR"]
        OS["Open States"]
        FR["Federal Register"]
        SEC["SEC EDGAR"]
    end

    subgraph "Document Management (13 connectors)"
        IM["iManage"]
        ND["NetDocuments"]
        SP["SharePoint"]
        CL["Clio"]
        PP["PracticePanther"]
        RE["Relativity"]
        NX["Nuix"]
        IC["Ironclad"]
        DS["DocuSign CLM"]
    end

    subgraph "PKI & Timestamps"
        TSA["RFC 3161 TSA Servers"]
        KMSP["AWS KMS / Vault / Azure KV"]
    end

    subgraph "Economic Data"
        FRED["FRED API"]
    end

    LR["LegalResearchService"] --> CR & ECFR & OS & FR & SEC
    BR["CendiaBridgeService"] --> IM & ND & SP & CL & PP & RE & NX & IC & DS
    TS["TimestampAuthorityService"] --> TSA
    KMS2["KeyManagementService"] --> KMSP
    FC["TimeSeriesForecaster"] --> FRED

    style LR fill:#6366f1,color:#fff
    style BR fill:#3b82f6,color:#fff
```

## Startup Initialization Order

```mermaid
flowchart TD
    A["1. OpenTelemetry tracing init"] --> B["2. Express app created"]
    B --> C["3. HTTP server + Socket.IO"]
    C --> D["4. Security middleware stack"]
    D --> E["5. Body parsing + compression"]
    E --> F["6. CendiaCrucible security middleware"]
    F --> G["7. CSRF protection"]
    G --> H["8. Redis API cache"]
    H --> I["9. Mount 14 domain routers"]
    I --> J["10. WebSocket handlers"]
    J --> K["11. Platform services registration"]
    K --> L["12. Performance indexes applied"]
    L --> M["13. Error handler (last middleware)"]
    M --> N["14. Server.listen(PORT)"]

    style A fill:#f59e0b,color:#fff
    style I fill:#6366f1,color:#fff
    style N fill:#10b981,color:#fff
```
