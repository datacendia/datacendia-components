# Compliance Services Suite Workflows

> **Directory:** `backend/src/services/compliance/`
> **Purpose:** Automated compliance assessment, continuous monitoring, cross-jurisdiction conflict resolution, regulatory sandbox testing, and bundle generation for 35+ regulatory frameworks.

## Compliance Suite Overview

```mermaid
flowchart TB
    subgraph "Compliance Engine"
        CS["ComplianceService<br/>Assessment & Bundle Generation"]
        CE["ComplianceEnforcer<br/>Real-Time Policy Enforcement"]
        CCM["ContinuousComplianceMonitor<br/>24/7 Drift Detection"]
        CJE["CrossJurisdictionEngine<br/>Multi-Regulatory Conflict Resolution"]
        RSB["RegulatorySandboxService<br/>Safe Testing Environment"]
    end

    subgraph "Frameworks (frameworks.ts)"
        FW["35+ Regulatory Frameworks<br/>Organized by Domain + Pillar"]
    end

    FW --> CS --> CE
    CS --> CCM
    CJE --> CS
    RSB --> CS

    style CS fill:#6366f1,color:#fff
    style CE fill:#ef4444,color:#fff
    style CCM fill:#3b82f6,color:#fff
```

## ComplianceService — Assessment & Bundle Generation

```mermaid
flowchart TD
    A["runAssessment(orgId, framework, pillar)"] --> B["Load Framework Definition"]
    B --> C["For Each Control in Framework"]
    C --> D["Evaluate Control"]
    D --> E{Control Status?}
    E -->|compliant| F["Score: full points"]
    E -->|partial| G["Score: partial points + gaps identified"]
    E -->|non_compliant| H["Score: 0 + finding created"]
    E -->|not_applicable| I["Skip control"]

    F & G & H & I --> J["Aggregate overallScore"]
    J --> K["Generate findings + recommendations"]
    K --> L["Set nextAssessmentDate"]
    L --> M["Return ComplianceAssessment"]

    N["generateBundle(orgId, frameworks)"] --> O["Collect All Assessments"]
    O --> P["Generate Files per Framework"]
    P --> Q["Formats: JSON, PDF, CSV, XLSX, YAML"]
    Q --> R["Compute Merkle Root of All Files"]
    R --> S["Hash Entire Bundle"]
    S --> T["Set Expiration Date"]
    T --> U["Return ComplianceBundle"]

    style A fill:#6366f1,color:#fff
    style N fill:#3b82f6,color:#fff
    style U fill:#10b981,color:#fff
```

## ContinuousComplianceMonitor — 24/7 Drift Detection

```mermaid
flowchart TD
    A["Monitor Loop (configurable interval)"] --> B["Scan Active Assessments"]
    B --> C["For Each Assessment"]
    C --> D["Re-Run Automated Control Checks"]
    D --> E{Score Changed?}
    E -->|Degraded| F["COMPLIANCE DRIFT ALERT"]
    F --> G["Severity based on score drop"]
    G --> H["Notify: compliance officer + stakeholders"]
    H --> I["Auto-Trigger Re-Assessment if critical"]
    E -->|Improved| J["Log improvement"]
    E -->|Stable| K["Continue monitoring"]

    L["Expiring Assessment Detected"] --> M["WARNING: Assessment expires in N days"]
    M --> N["Auto-Schedule Re-Assessment"]

    style F fill:#ef4444,color:#fff
    style J fill:#10b981,color:#fff
```

## CrossJurisdictionEngine — Multi-Regulatory Conflict Resolution

```mermaid
flowchart TD
    A["Organization Operates in Multiple Jurisdictions"] --> B["Load Active Frameworks per Jurisdiction"]
    B --> C["Cross-Reference Requirements"]
    C --> D{Conflicts Found?}

    D -->|Yes| E["For Each Conflict"]
    E --> F["Classify: data_transfer / consent /<br/>retention / deletion / breach_reporting"]
    F --> G["Severity: irreconcilable → theoretical"]
    G --> H["Propose Resolution Strategy"]

    subgraph "Resolution Strategies"
        S1["highest_standard — Apply strictest"]
        S2["jurisdiction_priority — Rank by enforcement risk"]
        S3["data_localization — Keep data local"]
        S4["consent_overlay — Additional consent layer"]
        S5["good_faith_maximum — Document best effort"]
        S6["regulatory_sandbox — Test in sandbox"]
    end

    H --> S1 & S2 & S3 & S4 & S5 & S6
    S1 & S2 & S3 & S4 & S5 & S6 --> I["Generate Jurisdiction-Specific Documentation"]

    D -->|No| J["All frameworks compatible"]

    style D fill:#f59e0b,color:#fff
    style S5 fill:#8b5cf6,color:#fff
```

## RegulatorySandboxService — Safe Compliance Testing

```mermaid
flowchart TD
    A["Create Sandbox Environment"] --> B["Clone Current Compliance State"]
    B --> C["Apply Proposed Changes"]
    C --> D["Run Full Assessment in Sandbox"]
    D --> E{Impact?}
    E -->|Score Improved| F["✓ Safe to Deploy"]
    E -->|Score Unchanged| G["Neutral Impact"]
    E -->|Score Degraded| H["⚠ Risk: Compliance regression"]
    H --> I["Show: which controls affected,<br/>which frameworks impacted"]

    J["Test New Regulation"] --> K["Model Regulation in Sandbox"]
    K --> L["Assess Current Org Against New Requirements"]
    L --> M["Gap Analysis: what needs to change"]
    M --> N["Timeline + Cost Estimate for Compliance"]

    style F fill:#10b981,color:#fff
    style H fill:#ef4444,color:#fff
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **ComplianceService** | `ComplianceService.ts` | Assessment engine, bundle generation, Merkle-rooted exports |
| **ComplianceEnforcer** | `ComplianceEnforcer.ts` | Real-time policy enforcement, auto-block non-compliant actions |
| **ContinuousComplianceMonitor** | `ContinuousComplianceMonitorService.ts` | 24/7 drift detection, auto re-assessment |
| **CrossJurisdictionEngine** | `CrossJurisdictionEngineService.ts` | Multi-regulatory conflict detection + 6 resolution strategies |
| **RegulatorySandbox** | `RegulatorySandboxService.ts` | Safe testing, gap analysis, impact prediction |
| **Frameworks** | `frameworks.ts` | 35+ framework definitions, pillar mappings, domain organization |
