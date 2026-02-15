# CendiaPanopticon Compliance Workflow

> **Service:** `CendiaPanopticonService` (`backend/src/services/CendiaPanopticonService.ts`)
> **Purpose:** Global regulation engine — parse, map, align, detect violations, and forecast regulatory changes across 200+ frameworks and 50+ jurisdictions.

## Regulation Ingestion Pipeline

```mermaid
flowchart TD
    A["ingestRegulation(orgId, frameworkCode)"] --> B{Framework Known?}
    B -->|No| C[Throw Error: Unknown Framework]
    B -->|Yes| D{Already Ingested?}
    D -->|Yes| E[Return Existing Record]
    D -->|No| F["parseRegulationContent via LLM"]

    F --> G["LLM: Analyze Framework"]
    G --> H["Extract: complianceAreas, criticalRequirements,<br/>challenges, integrations"]
    H --> I[Save to panopticon_regulations Table]

    I --> J["generateObligations(regulationId, framework)"]
    J --> K["LLM: Generate Key Compliance Obligations"]
    K --> L["For Each Obligation:"]
    L --> M["Save to panopticon_obligations Table"]
    M --> N["Fields: code, title, description,<br/>requirementType, priority, controls, evidenceRequired"]

    N --> O[Regulation Fully Ingested]

    style A fill:#6366f1,color:#fff
    style F fill:#3b82f6,color:#fff
    style J fill:#f59e0b,color:#fff
    style O fill:#10b981,color:#fff
```

## Compliance Alignment & Gap Analysis

```mermaid
flowchart TD
    A["mapObligation(obligationId, entityType, entityId)"] --> B[Load Obligation from DB]
    B --> C["assessAlignment via LLM"]
    C --> D["LLM: Rate alignment 0-100"]
    D --> E["Extract: score, gaps[], remediation[]"]
    E --> F[Save to panopticon_alignments Table]

    G["getComplianceGaps(orgId)"] --> H["SELECT alignments WHERE score < 70"]
    H --> I["Return ComplianceGap[]"]
    I --> J["Each: obligationTitle, entityName,<br/>alignmentScore, gaps, remediationSteps"]

    style A fill:#6366f1,color:#fff
    style C fill:#3b82f6,color:#fff
    style G fill:#f59e0b,color:#fff
```

## Violation Detection Flow

```mermaid
flowchart TD
    A["detectViolations(orgId, processData)"] --> B[Load All Active Regulations]
    B --> C["For Each Regulation"]
    C --> D["For Each Obligation"]
    D --> E["checkForViolation via LLM"]
    E --> F["LLM: Does process violate obligation?"]

    F --> G{Violated?}
    G -->|Yes| H["Save to panopticon_violations Table"]
    H --> I["Fields: violation_type, severity,<br/>affected_entities, evidence"]
    I --> J["Status: OPEN"]
    G -->|No| K[Next Obligation]

    J --> L["Return ViolationAlert[]"]

    M["resolveViolation(id, resolution)"] --> N["Update Status → RESOLVED"]
    N --> O["Set resolved_at, resolved_by"]

    subgraph "Violation Types"
        V1[PROCESS_VIOLATION]
        V2[DATA_VIOLATION]
        V3[DOCUMENTATION_GAP]
        V4[TIMELINE_BREACH]
        V5[CONTROL_FAILURE]
    end

    style A fill:#ef4444,color:#fff
    style H fill:#f59e0b,color:#fff
    style N fill:#10b981,color:#fff
```

## Regulatory Forecasting

```mermaid
sequenceDiagram
    participant User
    participant Panopticon as CendiaPanopticonService
    participant LLM as Ollama LLM
    participant DB as PostgreSQL

    User->>Panopticon: generateForecasts(orgId)
    Panopticon->>DB: Load active regulation frameworks
    Panopticon->>LLM: Forecast upcoming changes for [frameworks]
    Note over LLM: Generate 3-5 forecasts:<br/>NEW_REGULATION, AMENDMENT,<br/>ENFORCEMENT_ACTION, INDUSTRY_TREND
    LLM-->>Panopticon: [{title, probability, impactScore, horizonDays, recommendedActions}]
    
    loop For Each Forecast
        Panopticon->>DB: INSERT INTO panopticon_forecasts
    end
    
    Panopticon-->>User: RegulatoryForecast[]

    User->>Panopticon: getRegulatoryRadar(orgId)
    Panopticon->>DB: Load regulations, forecasts, violations
    Panopticon->>LLM: Generate radar analysis with org context
    LLM-->>Panopticon: {events, summary, actions}
    Panopticon-->>User: Radar with timeline events + AI recommendations
```

## Framework Coverage

```mermaid
graph TD
    subgraph "200+ Frameworks Across Categories"
        P["Privacy: GDPR, CCPA, CPRA, HIPAA, PIPEDA, LGPD, PDPA, POPIA"]
        F["Financial: SOX, Basel III/IV, DORA, MiFID II, PSD2, GLBA, Dodd-Frank"]
        C["Cybersecurity: NIST CSF, 800-53, ISO 27001/27701, SOC 2, NIS2, CIS"]
        AI["AI: EU AI Act, NIST AI RMF, NYC Local 144, Colorado AI Act"]
        I["Industry: PCI DSS, NERC CIP, FDA 21 CFR 11, FERPA, FISMA, FedRAMP"]
        E["ESG: CSRD, SFDR, TCFD, SEC Climate"]
        AML["AML: 5AMLD, 6AMLD, BSA, FATF"]
    end
```

## Key Code References

- **Ingestion:** `ingestRegulation()` → `parseRegulationContent()` → `generateObligations()`
- **Alignment:** `mapObligation()` → `assessAlignment()` via LLM — score 0-100 with gaps
- **Gap Analysis:** `getComplianceGaps()` — all alignments scoring below 70
- **Violation Detection:** `detectViolations()` → `checkForViolation()` per obligation via LLM
- **Resolution:** `resolveViolation()` — tracks resolver and timestamp
- **Forecasting:** `generateForecasts()` — LLM-powered regulatory trend prediction
- **Radar:** `getRegulatoryRadar()` — timeline events with AI summary and recommended actions
- **DB Tables:** `panopticon_regulations`, `panopticon_obligations`, `panopticon_alignments`, `panopticon_violations`, `panopticon_forecasts`
- **Frameworks:** 200+ in `REGULATORY_FRAMEWORKS` constant (40+ explicitly defined)
