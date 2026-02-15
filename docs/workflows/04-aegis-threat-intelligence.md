# CendiaAegis Threat Intelligence Workflow

> **Service:** `CendiaAegisService` (`backend/src/services/CendiaAegisService.ts`)
> **Purpose:** Real-time threat detection, containment, and resilience modeling — strategic defense intelligence.

## Signal-to-Briefing Pipeline

```mermaid
flowchart TD
    A["Threat Signal Received"] --> B[ingestSignal]
    B --> C["analyzeSignal via LLM"]
    C --> D["Extract: severity, confidence, entities, tags"]
    D --> E[Save to aegis_signals Table]
    E --> F{"severity != INFORMATIONAL<br/>AND confidence > 0.6?"}

    F -->|Yes| G[assessThreatFromSignal]
    G --> H["LLM: Is this a credible threat?"]
    H --> I{isThreat?}
    I -->|Yes| J["Create aegis_threats Record"]
    J --> K["Status: ACTIVE"]
    I -->|No| L[Signal Logged Only]

    F -->|No| L

    K --> M{User Action}
    M -->|Generate Scenarios| N[generateScenarios]
    M -->|Generate Countermeasures| O[generateCountermeasures]
    M -->|Generate Briefing| P[generateBriefing]
    M -->|Update Status| Q[updateThreatStatus]

    N --> R["LLM: Generate 3 Cascade Failure Scenarios"]
    R --> S["Save to aegis_scenarios Table"]
    S --> T["Each: triggerConditions, cascadeEffects,<br/>financialImpact, recoveryTimeHours"]

    O --> U["LLM: Recommend 5 Countermeasures"]
    U --> V["Save to aegis_countermeasures Table"]
    V --> W["Each: type (PREVENTIVE/DETECTIVE/CORRECTIVE),<br/>effectiveness, costEstimate, timeToImplement"]
    W --> X{Implement?}
    X -->|Yes| Y["implementCountermeasure → Status: IMPLEMENTED"]

    P --> Z["LLM: Generate Executive Briefing"]
    Z --> AA["Save to aegis_briefings Table"]
    AA --> AB["Output: executiveSummary, detailedAnalysis, recommendations"]

    Q --> AC{"New Status"}
    AC -->|MONITORING| AD[Continue Tracking]
    AC -->|CONTAINED| AE[Containment Confirmed]
    AC -->|MITIGATED| AF["Set mitigated_at Timestamp"]
    AC -->|RESOLVED| AG["Set mitigated_at Timestamp"]

    style A fill:#ef4444,color:#fff
    style K fill:#f59e0b,color:#fff
    style N fill:#3b82f6,color:#fff
    style O fill:#10b981,color:#fff
    style P fill:#8b5cf6,color:#fff
    style Y fill:#10b981,color:#fff
    style AG fill:#6b7280,color:#fff
```

## Threat Assessment Sequence

```mermaid
sequenceDiagram
    participant Source as Threat Feed
    participant Aegis as CendiaAegisService
    participant LLM as Ollama LLM
    participant DB as PostgreSQL (Prisma)

    Source->>Aegis: ingestSignal(orgId, signalData)
    Aegis->>LLM: Analyze signal content (JSON format)
    LLM-->>Aegis: {severity, confidence, entities, tags, threatIndicators}
    Aegis->>DB: INSERT INTO aegis_signals
    
    alt High Severity + High Confidence
        Aegis->>LLM: Assess if credible threat
        LLM-->>Aegis: {isThreat: true, threatType, probability, impactScore}
        Aegis->>DB: INSERT INTO aegis_threats (status: ACTIVE)
    end

    Note over Aegis: User requests scenario analysis
    Aegis->>LLM: Generate 3 cascade failure scenarios
    LLM-->>Aegis: [{scenarioName, cascadeEffects, financialImpact, probability}]
    Aegis->>DB: INSERT INTO aegis_scenarios (for each)

    Note over Aegis: User requests countermeasures
    Aegis->>LLM: Recommend 5 countermeasures
    LLM-->>Aegis: [{title, type, effectiveness, costEstimate, timeToImplement}]
    Aegis->>DB: INSERT INTO aegis_countermeasures (for each)

    Note over Aegis: Executive briefing
    Aegis->>LLM: Generate executive briefing
    LLM-->>Aegis: {title, executiveSummary, detailedAnalysis, recommendations}
    Aegis->>DB: INSERT INTO aegis_briefings
```

## Dashboard Data Flow

```mermaid
flowchart LR
    subgraph "getDashboard (Promise.all)"
        A[COUNT aegis_threats WHERE ACTIVE] --> E[activeThreats]
        B["COUNT aegis_signals WHERE last 24h"] --> F[signalsLast24h]
        C["SELECT aegis_threats WHERE CRITICAL/HIGH"] --> G[topThreats]
        D["COUNT aegis_countermeasures WHERE PROPOSED"] --> H[pendingCountermeasures]
    end

    E & F & G & H --> I["Dashboard Response"]

    style I fill:#6366f1,color:#fff
```

## Key Code References

- **Signal Ingestion:** `ingestSignal()` — LLM-analyzed signal processing with auto-threat detection
- **Threat Assessment:** `assessThreatFromSignal()` — automatic credibility evaluation
- **Cascade Scenarios:** `generateScenarios()` — LLM-generated failure chain analysis
- **Countermeasures:** `generateCountermeasures()` — 5 typed countermeasures (PREVENTIVE/DETECTIVE/CORRECTIVE/DETERRENT/RECOVERY)
- **Briefings:** `generateBriefing()` — executive-ready intelligence reports
- **DB Tables:** `aegis_signals`, `aegis_threats`, `aegis_scenarios`, `aegis_countermeasures`, `aegis_briefings`
- **Threat Feeds:** 7 simulated sources (CISA, Reuters, Supply Chain Monitor, etc.)
