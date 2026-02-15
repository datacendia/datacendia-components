# Specialized Services Workflows

> **Directories:** `backend/src/services/sports/`, `visualization/`, `forecasting/`, `insurance/`, `command/`
> **Purpose:** Industry-specific, visualization, forecasting, insurance, and command interface services.

## Sports Vertical — Transfer Decision Governance

```mermaid
flowchart TD
    A["Transfer Window Opens"] --> B["Create TransferDecision"]
    B --> C["templateId from SPORTS_DECISION_TEMPLATES"]
    C --> D["transactionType: inbound / outbound / loan"]

    D --> E["Player Details"]
    E --> F["Financial Structure"]
    F --> G["transferFee + addOns + agentFee +<br/>wages + sellOnClause"]

    G --> H["Compliance Check"]
    H --> I["SPORTS_COMPLIANCE_FRAMEWORKS"]
    I --> J["FIFA TMS / UEFA FFP /<br/>League-specific rules"]

    J --> K["Council Deliberation"]
    K --> L["Sports-specific agents analyze:<br/>financial impact, squad balance,<br/>regulatory compliance, risk"]

    L --> M{Approved?}
    M -->|Yes| N["Status → APPROVED"]
    M -->|No| O["Status → REJECTED"]

    N --> P["Audit: cendiaAuditService.logEvent()"]
    P --> Q["Complete DCII primitives:<br/>Discovery-Time Proof,<br/>Deliberation Capture,<br/>Override Accountability"]

    style A fill:#6366f1,color:#fff
    style J fill:#f59e0b,color:#fff
    style Q fill:#10b981,color:#fff
```

## Decision Replay Theater — Visual Deliberation Playback

```mermaid
flowchart TD
    A["Select Past Deliberation"] --> B["buildReplaySession()"]
    B --> C["Load deliberation messages from DB"]
    C --> D["Build ReplayFrame[] timeline"]
    D --> E["Frame types: agent_statement, citation,<br/>dissent, vote, consensus, round_change"]

    E --> F["ReplaySession with metadata"]
    F --> G["agents, outcome, councilMode,<br/>totalRounds, duration"]

    G --> H{Playback Mode}
    H -->|Live| I["Play frames in sequence"]
    I --> J["Adjustable speed: 0.5x → 4x"]
    H -->|Scrub| K["Jump to any frame"]
    H -->|Export| L["Format: JSON / PDF / HTML / video_script"]

    style A fill:#6366f1,color:#fff
    style J fill:#3b82f6,color:#fff
    style L fill:#10b981,color:#fff
```

## Time Series Forecasting — Real ML on FRED Data

```mermaid
flowchart TD
    A["forecast(seriesId, periodsAhead)"] --> B["Fetch Real FRED Economic Data"]
    B --> C["GDP, Unemployment, CPI, Fed Rate,<br/>Housing, Retail, Industrial, Trade"]

    C --> D["Validate: ≥24 observations required"]
    D --> E["Split: 80% train / 20% test"]
    E --> F["Fit Holt-Winters Exponential Smoothing"]
    F --> G["Generate test predictions"]
    G --> H["Calculate Accuracy Metrics"]
    H --> I["MAPE, RMSE, MAE, R²"]

    I --> J["Generate Future Predictions"]
    J --> K["Per period: predicted + lowerBound +<br/>upperBound + confidence"]
    K --> L["Return ForecastResult"]

    style A fill:#6366f1,color:#fff
    style F fill:#3b82f6,color:#fff
    style L fill:#10b981,color:#fff
```

## AI Insurance — Per-Decision Liability Coverage

```mermaid
flowchart TD
    A["AI Decision Made"] --> B["calculateRisk(decision)"]
    B --> C["riskScore based on: decision value,<br/>vertical, compliance frameworks,<br/>IISS score, agent consensus"]

    C --> D{Risk Tier?}
    D -->|low| E["Premium: base rate"]
    D -->|medium| F["Premium: 1.5x base"]
    D -->|high| G["Premium: 3x base"]
    D -->|critical| H["Premium: 5x base or decline"]

    E & F & G & H --> I["Generate InsurancePolicy"]
    I --> J["Coverage: E&O, cyber liability,<br/>product liability, professional,<br/>D&O, general"]

    K["Decision Goes Wrong"] --> L["File Claim"]
    L --> M["ClaimAssessment"]
    M --> N["Assess: coverage applicable?<br/>Within limits? Deductible met?"]
    N --> O["Settlement or Denial"]

    P["generateCertificate()"] --> Q["Proof of coverage for regulator/client"]

    style A fill:#6366f1,color:#fff
    style H fill:#ef4444,color:#fff
    style Q fill:#10b981,color:#fff
```

## CendiaCommand — Vertical-Specific Command Interface

```mermaid
flowchart TD
    A["User Types Natural Language Command"] --> B["parseCommand(input, context)"]
    B --> C["Determine VerticalId"]
    C --> D["15 Verticals: financial, legal, healthcare,<br/>government, defense, energy, insurance,<br/>manufacturing, retail, telecom, aerospace,<br/>pharma, education, realestate, media"]

    D --> E["Extract CommandIntent"]
    E --> F["action: query / analyze / review /<br/>generate / compare / validate / export / monitor"]
    F --> G["Identify suggestedAgents + relevantFrameworks"]

    G --> H["getQuickActions(verticalId)"]
    H --> I["Pre-built actions per vertical"]
    I --> J["Each with: icon, command, agentsInvolved,<br/>complianceFrameworks, estimatedTime"]

    F --> K["executeCommand()"]
    K --> L{Route?}
    L -->|Simple Query| M["Direct data retrieval"]
    L -->|Complex Analysis| N["Route to Council deliberation"]
    N --> O["councilDeliberationId returned"]

    style A fill:#6366f1,color:#fff
    style D fill:#3b82f6,color:#fff
    style N fill:#f59e0b,color:#fff
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **SportsDecision** | `sports/SportsDecisionService.ts` | Transfer governance, FIFA/UEFA compliance, player/club/agent tracking |
| **SportsAgents** | `sports/SportsAgents.ts` | Sport-specific AI agent personas |
| **SportsKnowledgeBase** | `sports/SportsKnowledgeBase.ts` | Sport-specific RAG data |
| **DecisionReplayTheater** | `visualization/DecisionReplayTheaterService.ts` | Frame-by-frame deliberation playback, export to JSON/PDF/HTML |
| **DeliberationViz** | `visualization/DeliberationVisualizationService.ts` | Visual graph rendering of deliberations |
| **TimeSeriesForecaster** | `forecasting/TimeSeriesForecaster.ts` | Holt-Winters on real FRED data, accuracy metrics |
| **FREDDataService** | `forecasting/FREDDataService.ts` | Federal Reserve economic data API client |
| **AIInsurance** | `insurance/AIInsuranceService.ts` | Per-decision liability coverage, claims, certificates |
| **CendiaCommand** | `command/CendiaCommandService.ts` | NL command interface, 15 verticals, 8 action types |
| **CendiaCommandPlatinum** | `command/CendiaCommandPlatinumService.ts` | Enterprise platinum command features |
