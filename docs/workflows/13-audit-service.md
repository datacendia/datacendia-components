# CendiaAudit Compliance Logging Workflow

> **Service:** `CendiaAuditService` (`backend/src/services/CendiaAuditService.ts`)
> **Purpose:** Enterprise compliance, decision trails, and regulatory audit logging with GDPR/SOX/HIPAA compliant tamper-proof hash chains.

## Event Logging Pipeline

```mermaid
flowchart TD
    A["logEvent(params)"] --> B["Generate Event ID"]
    B --> C["Build Event Data Object"]
    C --> D["Calculate SHA-256 Hash"]
    D --> E["Include previousHash in hash input"]
    E --> F["Sign Hash with HMAC-SHA256"]
    F --> G["Create AuditEvent Record"]

    G --> H["Store in auditEvents Map"]
    H --> I["Update lastHash = current hash"]
    I --> J["Index by Organization"]
    J --> K{"Severity?"}
    K -->|critical/compliance| L["Logger: WARN with event details"]
    K -->|info/warning| M["Silent store"]
    L & M --> N["Increment audit_events_logged counter"]
    N --> O["Return AuditEvent"]

    style A fill:#6366f1,color:#fff
    style D fill:#f59e0b,color:#fff
    style F fill:#ef4444,color:#fff
    style O fill:#10b981,color:#fff
```

## Hash Chain Integrity

```mermaid
flowchart LR
    subgraph "Tamper-Proof Chain"
        E1["Event 1<br/>hash: abc123<br/>prevHash: ''"]
        E2["Event 2<br/>hash: def456<br/>prevHash: abc123"]
        E3["Event 3<br/>hash: ghi789<br/>prevHash: def456"]
        E4["Event N<br/>hash: xyz...<br/>prevHash: ghi789"]
    end

    E1 -->|"prevHash links"| E2
    E2 -->|"prevHash links"| E3
    E3 -->|"..."| E4

    subgraph "Verification"
        V1["verifyChainIntegrity()"]
        V2["Walk all events chronologically"]
        V3["For each: prevHash == previous event hash?"]
        V4["For each: recalculate hash == stored hash?"]
        V5{"All Valid?"}
        V6["✓ Chain Intact"]
        V7["✗ Tamper Detected"]
    end

    V1 --> V2 --> V3 --> V4 --> V5
    V5 -->|Yes| V6
    V5 -->|No| V7

    style V6 fill:#10b981,color:#fff
    style V7 fill:#ef4444,color:#fff
```

## Specialized Event Loggers

```mermaid
flowchart TD
    subgraph "Convenience Methods (all call logEvent internally)"
        A["logDecision()"] --> A1["eventType: decision.*<br/>frameworks: SOX, internal<br/>severity: compliance if finalized"]
        B["logAnalysis()"] --> B1["eventType: analysis.*<br/>frameworks: internal<br/>captures: agents, model, risk"]
        C["logDataAccess()"] --> C1["eventType: data.*<br/>frameworks: GDPR, CCPA if PII<br/>captures: recordCount, fields"]
        D["logGuardrail()"] --> D1["eventType: guardrail.*<br/>frameworks: internal, ethics<br/>severity: critical if overridden"]
    end

    subgraph "20 Event Types"
        E1[decision.created / updated / finalized / outcome_recorded]
        E2[analysis.premortem / ghostboard / council / scenario]
        E3[data.accessed / exported / imported / deleted]
        E4[user.login / logout / permission_changed]
        E5[system.config_changed / model_changed]
        E6[compliance.check_passed / check_failed]
        E7[guardrail.triggered / guardrail.override]
    end

    style A fill:#3b82f6,color:#fff
    style B fill:#8b5cf6,color:#fff
    style C fill:#10b981,color:#fff
    style D fill:#ef4444,color:#fff
```

## Compliance Status Check

```mermaid
flowchart TD
    A["checkComplianceStatus(orgId, framework)"] --> B["Query Last 30 Days of Events"]

    B --> C{Framework?}
    C -->|GDPR| D["Check PII Access"]
    C -->|SOX| E["Check Financial Decisions"]
    C -->|Any| F["Check Guardrail Overrides"]

    D --> D1{"PII events without consent?"}
    D1 -->|Yes| D2["Issue: HIGH severity<br/>Score -= 20"]
    D1 -->|No| D3["GDPR: OK"]

    D --> D4{"PII exports without legal basis?"}
    D4 -->|Yes| D5["Issue: MEDIUM severity<br/>Score -= 10"]

    E --> E1{"Financial decisions without before/after state?"}
    E1 -->|Yes| E2["Issue: HIGH severity<br/>Score -= 15"]
    E1 -->|No| E3["SOX: OK"]

    F --> F1{"> 5 guardrail overrides?"}
    F1 -->|Yes| F2["Issue: MEDIUM severity<br/>Score -= 5"]
    F1 -->|No| F3["Overrides: OK"]

    D2 & D3 & D5 & E2 & E3 & F2 & F3 --> G["Calculate Final Score (starts at 100)"]
    G --> H{"Score >= 90?"}
    H -->|Yes| I["Status: COMPLIANT"]
    H -->|No| J{"Score >= 70?"}
    J -->|Yes| K["Status: PARTIAL"]
    J -->|No| L["Status: NON_COMPLIANT"]

    style A fill:#6366f1,color:#fff
    style I fill:#10b981,color:#fff
    style K fill:#f59e0b,color:#fff
    style L fill:#ef4444,color:#fff
```

## Regulatory Export

```mermaid
sequenceDiagram
    participant Regulator
    participant Audit as CendiaAuditService

    Regulator->>Audit: exportForRegulator(orgId, framework, dates, format)
    Audit->>Audit: generateComplianceReport()
    Audit->>Audit: Query events for period
    Audit->>Audit: Filter by framework relevance
    Audit->>Audit: Build summary (byType, bySeverity, byUser)
    Audit->>Audit: Hash the report

    alt CSV Format
        Audit->>Audit: Convert to CSV with headers
        Note over Audit: Timestamp, EventType, Severity,<br/>User, Action, Resource, Summary
    else JSON Format
        Audit->>Audit: JSON.stringify(report)
    end

    Audit->>Audit: Hash the export data
    Audit->>Audit: logEvent(data.exported) — self-audit the export
    Audit-->>Regulator: {data, filename, hash}
```

## Retention Periods

```mermaid
graph LR
    subgraph "Framework-Based Retention"
        A["SOX Events → 7 years (2555 days)"]
        B["GDPR Events → 3 years (1095 days)"]
        C["Decision Events → 5 years (1825 days)"]
        D["Default → 2 years (730 days)"]
    end

    subgraph "Severity Inference"
        E["*deleted* or *override* → critical"]
        F["*compliance* or *finalized* → compliance"]
        G["*failed* or *triggered* → warning"]
        H["Everything else → info"]
    end
```

## Key Code References

- **Core Logging:** `logEvent()` — hash chain with HMAC signature
- **Specialized:** `logDecision()`, `logAnalysis()`, `logDataAccess()`, `logGuardrail()`
- **Querying:** `queryEvents()` — 10 filter dimensions, paginated
- **Reports:** `generateComplianceReport()` — aggregated compliance analysis
- **Compliance Check:** `checkComplianceStatus()` — framework-specific scoring (GDPR, SOX)
- **Verification:** `verifyChainIntegrity()` — walks full chain, `verifyEvent()` — single event
- **Export:** `exportForRegulator()` — JSON or CSV with self-audited export logging
- **Hash:** SHA-256 (truncated to 16 hex chars)
- **Signature:** HMAC-SHA256 with `AUDIT_SIGNING_KEY` (truncated to 32 hex chars)
- **Retention:** SOX=7yr, GDPR=3yr, decisions=5yr, default=2yr
