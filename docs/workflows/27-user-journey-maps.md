# Datacendia Platform — User Journey Maps

> **Purpose:** End-to-end user workflows for key personas — executives, legal teams, compliance officers, IT administrators, and analysts.

## Journey 1: Executive Decision-Making

```mermaid
journey
    title CEO Makes a Strategic Decision
    section Login & Context
      Login via Keycloak SSO: 5: CEO
      Dashboard loads with KPIs (Helm pillar): 5: CEO
      Review recent Chronos timeline: 4: CEO
    section Ask The Council
      Type question in natural language: 5: CEO
      Select Council Mode (War Room): 4: CEO
      Council agents deliberate in real-time: 5: System
      View streaming responses via WebSocket: 5: CEO
    section Review & Challenge
      Read agent positions + citations: 4: CEO
      View CendiaDissent (any dissents?): 4: CEO
      Check CendiaSentry guardrail results: 3: System
      Run CendiaHorizon simulation (3 futures): 5: CEO
    section Decide & Sign
      Accept recommendation: 5: CEO
      Decision packet generated with Merkle tree: 5: System
      KMS signs packet cryptographically: 5: System
      Stakeholders notified (CendiaVox): 4: System
    section Track Outcomes
      CendiaEcho schedules outcome collection: 4: System
      At T+90d: compare predictions vs actuals: 4: System
      Agent weights adjusted automatically: 5: System
```

## Journey 2: Legal Team — Matter Analysis

```mermaid
journey
    title General Counsel Analyzes a Legal Matter
    section Setup
      Login with attorney-client privilege role: 5: GC
      Open Legal Vertical dashboard: 5: GC
    section Research
      Search case law via LegalResearch (CourtListener): 5: GC
      Import documents via CendiaBridge (iManage): 4: GC
      RAG retrieves relevant precedents: 5: System
    section Council Deliberation
      Select Legal Strategy council mode: 5: GC
      5 legal agents deliberate: 5: System
      CendiaGovern checks ABA + GDPR compliance: 4: System
    section Privilege & Approval
      CendiaVeto gate: privilege review required: 3: GC
      Supervising partner approves export: 4: Partner
      Break-glass export if emergency: 2: GC
    section Evidence Package
      Generate signed evidence packet: 5: System
      Regulators receipt with Merkle proof: 5: System
      Store in Evidence Vault (locked): 5: System
```

## Journey 3: Compliance Officer — Audit Preparation

```mermaid
flowchart TD
    A["Compliance Officer Logs In"] --> B["Navigate to Compliance Dashboard"]
    B --> C["View Active Frameworks (35+)"]
    C --> D["Select Framework: SOC2 Type II"]

    D --> E["Run Automated Assessment"]
    E --> F["ComplianceService evaluates controls"]
    F --> G["Score: 87/100 — 3 findings"]

    G --> H["Review Findings"]
    H --> I["Critical: Access logging gap"]
    H --> J["Medium: Documentation outdated"]
    H --> K["Low: Minor config issue"]

    I --> L["Auto-Remediation Available?"]
    L -->|Yes| M["Apply fix + re-assess"]
    L -->|No| N["Assign to team with due date"]

    O["Generate Compliance Bundle"] --> P["Formats: JSON, PDF, CSV, XLSX"]
    P --> Q["Merkle root + bundle hash"]
    Q --> R["Send to auditor"]

    S["ContinuousComplianceMonitor"] --> T["24/7 drift detection"]
    T --> U{Score Dropped?}
    U -->|Yes| V["ALERT: Compliance drift detected"]
    U -->|No| W["All clear"]

    style E fill:#6366f1,color:#fff
    style V fill:#ef4444,color:#fff
    style R fill:#10b981,color:#fff
```

## Journey 4: IT Administrator — Platform Management

```mermaid
flowchart TD
    A["Admin Logs In (OWNER role)"] --> B["AdminAI Chat Interface"]
    B --> C["'Show me system health'"]
    C --> D["SystemHealthService checks all services"]
    D --> E["PostgreSQL: Healthy ✓<br/>Redis: Healthy ✓<br/>Ollama: Healthy ✓<br/>ClickHouse: Degraded ⚠"]

    E --> F["'Enable the new Insurance vertical'"]
    F --> G["FeatureControlService.toggleFeature()"]
    G --> H["Insurance vertical: ENABLED"]

    H --> I["'Issue a trial license for Acme Corp'"]
    I --> J["LicenseService.createLicense()"]
    J --> K["Type: trial, 30 days, 10 seats"]

    L["Crucible Security Assessment"] --> M["Schedule nightly red team run"]
    M --> N["OWASP + AI Adversarial + Chaos"]
    N --> O["Report with compliance mapping"]

    P["SBOM Generation"] --> Q["Syft scan + Grype vulnerabilities"]
    Q --> R["Cosign container signing"]

    style B fill:#6366f1,color:#fff
    style E fill:#f59e0b,color:#fff
    style K fill:#10b981,color:#fff
```

## Journey 5: Analyst — Data Investigation

```mermaid
flowchart TD
    A["Analyst Logs In"] --> B["CendiaCommand Bar"]
    B --> C["Type: 'Compare Q3 revenue across regions'"]
    C --> D["CommandIntent parsed:<br/>action: compare, subject: revenue"]

    D --> E["CortexCore routes to Helm + Predict pillars"]
    E --> F["PillarAggregator queries across pillars"]
    F --> G["Results displayed with charts"]

    G --> H["'What caused the drop in EMEA?'"]
    H --> I["CendiaCascade (Butterfly Effect)"]
    I --> J["Graph traversal via CendiaOrbit"]
    J --> K["Root cause: vendor change T-60d<br/>→ supply delay T-30d<br/>→ revenue drop T+0"]

    K --> L["'Show similar past decisions'"]
    L --> M["DecisionSimilarity vector search"]
    M --> N["Match: 2022 Q1 — similar vendor switch,<br/>outcome: 6-month recovery"]

    N --> O["'Run a forecast for next quarter'"]
    O --> P["TimeSeriesForecaster (Holt-Winters on FRED)"]
    P --> Q["Prediction with confidence intervals"]

    style C fill:#6366f1,color:#fff
    style K fill:#ef4444,color:#fff
    style Q fill:#10b981,color:#fff
```

## Journey 6: Sports Club — Transfer Governance

```mermaid
flowchart TD
    A["Sporting Director opens Sports Vertical"] --> B["Create Transfer Decision"]
    B --> C["Player: striker, 24yo, £15M fee"]
    C --> D["Template: Player Acquisition"]

    D --> E["Council Deliberation with Sports Agents"]
    E --> F["Financial Agent: budget impact analysis"]
    E --> G["Scout Agent: player performance data"]
    E --> H["Compliance Agent: FIFA TMS + FFP check"]
    E --> I["Risk Agent: injury history + market volatility"]

    F & G & H & I --> J["Council Recommendation"]
    J --> K{Approved?}
    K -->|Yes| L["Generate Decision Packet"]
    L --> M["DCII Primitives Applied"]
    M --> N["Discovery-Time Proof (RFC 3161 timestamp)"]
    M --> O["Deliberation Capture (full transcript)"]
    M --> P["Override Accountability (if any vetoes)"]
    K -->|No| Q["Document rejection with rationale"]

    N & O & P --> R["IISS Score Updated"]
    R --> S["Club governance rating improves"]

    style E fill:#6366f1,color:#fff
    style R fill:#10b981,color:#fff
```

## Journey 7: Sovereign Deployment — Air-Gapped Environment

```mermaid
flowchart TD
    A["Defense Client Requests Sovereign Deploy"] --> B["PortableInstance generates USB config"]
    B --> C["Boot Datacendia from USB"]
    C --> D["All AI inference: local Ollama (no internet)"]

    E["Data Ingest via DataDiode"] --> F["Unidirectional: data flows IN only"]
    F --> G["Quarantine → Virus Scan → Signature Verify"]
    G --> H["Safe data enters platform"]

    I["Decision Made"] --> J["TPM Attestation signs decision"]
    J --> K["Hardware-backed cryptographic proof"]

    L["Export Needed?"] --> M["QR Air-Gap Bridge"]
    M --> N["Animated QR code sequence"]
    N --> O["Scan with phone: zero-media transfer"]

    P["Multi-Site Learning"] --> Q["FederatedMesh via sneakernet"]
    Q --> R["Differential privacy applied"]
    R --> S["USB carries encrypted model updates"]

    T["Embargoed Decision"] --> U["TimeLock with RSA puzzle"]
    U --> V["Decision unreadable until T+30d"]

    style D fill:#10b981,color:#fff
    style F fill:#6366f1,color:#fff
    style K fill:#8b5cf6,color:#fff
    style O fill:#f59e0b,color:#fff
```
