# CendiaDissent Service Workflow

> **Service:** `CendiaDissentService` (`backend/src/services/CendiaDissentService.ts`)
> **Purpose:** The right to formally, safely, and immutably disagree — ensures no one can ever say "nobody objected" when someone did. Provides protected, ledger-hashed dissent recording with retaliation detection.

## Dissent Lifecycle

```mermaid
stateDiagram-v2
    [*] --> pending: registerDissent()
    pending --> acknowledged: respondToDissent(type: acknowledge_proceed)
    pending --> accepted: respondToDissent(type: accept)
    pending --> clarification_requested: respondToDissent(type: request_clarification)
    pending --> escalated: respondToDissent(type: escalate_together)
    clarification_requested --> pending: Dissenter provides clarification
    acknowledged --> overruled: Decision proceeds despite dissent
    
    Note right of pending: responseDeadline enforced

    accepted --> [*]: Decision modified
    overruled --> [*]: Outcome tracked by Echo
    escalated --> [*]: Escalated to higher authority
```

## Dissent Registration Flow

```mermaid
flowchart TD
    A["Stakeholder Disagrees with Decision"] --> B{Anonymous?}
    B -->|Yes| C["Encrypt dissenterId"]
    C --> D["dissenterName = 'Anonymous Stakeholder'"]
    B -->|No| E["Use Real Identity"]

    D & E --> F["registerDissent()"]
    F --> G["Generate Ledger Hash (SHA-256)"]
    G --> H["Hash = SHA-256(decisionId + statement + timestamp + salt)"]
    H --> I["Set responseDeadline (48h default)"]
    I --> J["Save to dissents Table via Prisma"]
    J --> K["Record ChronosEvent: 'dissent_registered'"]
    K --> L["Status: pending"]

    L --> M{Decision Owner Responds?}
    M -->|accept| N["Decision Modified Based on Dissent"]
    M -->|partial_accept| O["Mitigating Actions Added"]
    M -->|acknowledge_proceed| P["Proceed with Documented Disagreement"]
    M -->|request_clarification| Q["Ask Dissenter for More Detail"]
    M -->|escalate_together| R["Both Parties Escalate to Authority"]

    N & O & P & Q & R --> S["Generate Response Ledger Hash"]
    S --> T["Save DissentResponse"]
    T --> U["Record ChronosEvent: 'dissent_responded'"]

    style A fill:#ef4444,color:#fff
    style F fill:#6366f1,color:#fff
    style G fill:#f59e0b,color:#fff
    style L fill:#3b82f6,color:#fff
    style N fill:#10b981,color:#fff
```

## Outcome Verification (Echo Integration)

```mermaid
flowchart TD
    A["Decision Outcome Recorded"] --> B["Check: Was There a Dissent?"]
    B -->|Yes| C["Compare Predicted Risks vs Actual Outcome"]
    C --> D{Dissenter Was Right?}
    D -->|Yes| E["dissenterWasRight = true"]
    D -->|No| F["dissenterWasRight = false"]
    D -->|Partial| G["Partial accuracy recorded"]

    E & F & G --> H["Update Dissent Record"]
    H --> I["Update DissenterProfile Accuracy"]
    I --> J{"accuracy >= 60% AND dissents >= 3?"}
    J -->|Yes| K["isHighAccuracy = true"]
    J -->|No| L["Normal Dissenter"]

    K --> M["High-Accuracy Dissenter:<br/>Future dissents weighted higher"]
```

## Retaliation Detection

```mermaid
flowchart TD
    A["Monitor Post-Dissent Events"] --> B{Within 90 Days of Dissent?}
    B -->|Yes| C["Check for Adverse Actions"]
    C --> D["Performance review downgrade?"]
    C --> E["Role change or demotion?"]
    C --> F["Exclusion from meetings?"]
    C --> G["Compensation change?"]

    D & E & F & G --> H{Pattern Detected?}
    H -->|Yes| I["Create RetaliationFlag"]
    I --> J["Auto-escalate to Compliance"]
    I --> K["Record in Audit Trail"]
    H -->|No| L["No Action Needed"]

    style I fill:#ef4444,color:#fff
    style J fill:#f59e0b,color:#fff
```

## Organization Dissent Health Metrics

```mermaid
flowchart LR
    subgraph "getOrganizationMetrics()"
        A[totalDissents] --> H[Health Dashboard]
        B[responseRate: % within deadline] --> H
        C[avgResponseTime: hours] --> H
        D[acceptanceRate: % that changed decisions] --> H
        E[overallAccuracy: % proven right] --> H
        F[retaliationFlags: count] --> H
        G["healthStatus: healthy|warning|critical"] --> H
    end

    subgraph "Health Status Rules"
        I["healthy: responseRate > 90%, no retaliation"]
        J["warning: responseRate 70-90% OR flags > 0"]
        K["critical: responseRate < 70% OR flags > 2"]
    end

    style K fill:#ef4444,color:#fff
    style J fill:#f59e0b,color:#fff
    style I fill:#10b981,color:#fff
```

## Key Code References

- **Registration:** `registerDissent()` — creates ledger-hashed immutable dissent record
- **Response:** `respondToDissent()` — 5 response types with their own ledger hash
- **Immutability:** SHA-256 hash chain — `decisionId + statement + timestamp + salt`
- **Anonymity:** Encrypted `dissenterId` when `isAnonymous = true`
- **Outcome Tracking:** Echo integration verifies if dissenter was right
- **Accuracy Profiles:** `DissenterProfile` tracks accuracy across all dissents
- **High-Accuracy Flag:** 60%+ accuracy with 3+ dissents = elevated weight
- **Retaliation Detection:** Monitors adverse actions within 90 days of dissent
- **Chronos Integration:** All events recorded on universal timeline
- **DB Tables:** `dissents`, `dissent_responses` (Prisma)
- **Dissent Types:** `factual`, `risk`, `ethical`, `process`, `strategic`, `resource`, `other`
- **Severities:** `advisory`, `formal_objection`, `blocking`
