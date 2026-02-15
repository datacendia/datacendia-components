# Advanced Intelligence Services Workflows

> **Directory:** `backend/src/services/` (top-level)
> **Purpose:** Platform-wide intelligence capabilities — outcome tracking, timeline analysis, stakeholder voice, institutional memory, horizon planning, cascade analysis, and self-improvement.

## Advanced Intelligence Suite Overview

```mermaid
flowchart TB
    subgraph "Decision Feedback Loop"
        EC["CendiaEcho™<br/>Decision Outcome Engine"]
        AP["CendiaApotheosis™<br/>Self-Improvement Engine"]
        PM["PantheonMemory™<br/>Institutional Memory"]
    end

    subgraph "Predictive Intelligence"
        HZ["CendiaHorizon™<br/>Multi-Universe Simulation"]
        CA["CendiaCascade™<br/>Butterfly Effect (→ merged into Horizon)"]
        OR["CendiaOrbit™<br/>Graph Traversal Engine"]
        CH["ChronosAI™<br/>Timeline Intelligence"]
    end

    subgraph "Stakeholder & Ethics"
        VX["CendiaVox™<br/>Stakeholder Voice Assembly"]
        RS["CendiaResponsibility™<br/>Ethics Engine"]
        SY["CendiaSymbiont™<br/>Human-AI Partnership"]
    end

    subgraph "Knowledge & Communication"
        NR["CendiaNarratives™<br/>Story Intelligence"]
        OT["CendiaOmniTranslate™<br/>100+ Languages"]
        ET["CendiaEternal™<br/>Knowledge Preservation"]
    end

    EC -->|"Outcome data"| AP
    AP -->|"Weight adjustments"| PM
    PM -->|"Historical context"| HZ
    HZ -->|"Uses"| OR
    CA -.->|"Merged into"| HZ
    VX -->|"Stakeholder votes"| EC

    style EC fill:#10b981,color:#fff
    style HZ fill:#6366f1,color:#fff
    style VX fill:#f59e0b,color:#fff
    style OT fill:#3b82f6,color:#fff
```

---

## CendiaEcho™ — Decision Outcome Engine

```mermaid
flowchart TD
    A["Decision Made by Council"] --> B["Schedule Outcome Collection"]
    B --> C["outcomeDate: 30d / 60d / 90d / custom"]

    C --> D["Collect Actual Results"]
    D --> E["Compare Predictions vs Actuals"]
    E --> F["revenue, profit, headcount, risk,<br/>customerSatisfaction, marketShare"]
    F --> G["Calculate variance + accuracy per metric"]

    G --> H["dollarImpact Attribution"]
    H --> I["ROI Calculation"]
    I --> J{Status?}
    J -->|success| K["Positive Impact"]
    J -->|partial| L["Mixed Results"]
    J -->|failure| M["Negative Impact"]

    K & L & M --> N["Extract Pattern Insights"]
    N --> O["successRate per pattern, confidence, factors"]
    O --> P["Generate AgentWeightAdjustments"]
    P --> Q["Increase weight for accurate agents<br/>Decrease weight for inaccurate agents"]
    Q --> R["Feed back into Council for next decision"]

    S["generateAccuracyReport()"] --> T["Overall accuracy + by category/agent/mode"]
    T --> U["Trend line over time"]

    style A fill:#6366f1,color:#fff
    style H fill:#10b981,color:#fff
    style P fill:#f59e0b,color:#fff
```

## CendiaApotheosis™ — Self-Improvement Engine

```mermaid
flowchart TD
    A["Nightly Adversarial Run"] --> B["Generate Scenarios"]
    B --> C["Categories: black_swan > regulatory ><br/>competitive > financial > operational ><br/>technical > human"]

    C --> D["For Each Scenario"]
    D --> E["LLM Adjudication (qwen2.5:7b)"]
    E --> F["temperature: 0.1 (maximum determinism)"]
    F --> G["Parse JSON Verdict"]
    G --> H{Schema Valid?}
    H -->|Yes| I["Record: survived, mitigated_damage, reason"]
    H -->|No| J["Retry (max 3)"]
    J --> K{Still Invalid?}
    K -->|Yes| L["Fail Closed → survived (conservative)"]
    K -->|No| I

    I --> M["Create AdjudicationAuditRecord"]
    M --> N["Hash: systemPromptHash + scenarioPromptHash"]

    O{Scenario Failed?}
    O -->|Critical| P["ESCALATION → Alert human operators"]
    O -->|Recoverable| Q["AUTO-PATCH → Apply safe fix"]
    O -->|Pattern| R["BAN PATTERN → Prevent recurrence"]
    O -->|Knowledge Gap| S["UPSKILL → Assign learning path"]

    style A fill:#6366f1,color:#fff
    style E fill:#3b82f6,color:#fff
    style P fill:#ef4444,color:#fff
    style L fill:#f59e0b,color:#fff
```

## CendiaHorizon™ — Multi-Universe Decision Simulation

```mermaid
flowchart TD
    A["Strategic Question + Time Horizon"] --> B["Create OracleQuery"]
    B --> C["branchCount: N possible futures"]

    C --> D["For Each Universe"]
    D --> E["Generate Timeline of Events"]
    E --> F["T+0, T+30d, T+90d, T+1Y, T+3Y"]
    F --> G["Calculate Outcomes per Universe"]
    G --> H["revenue, costs, marketShare,<br/>employeeSatisfaction, riskScore"]

    H --> I["Compute Risk Profile"]
    I --> J["upside + downside + bestCase + worstCase"]
    J --> K["reversibilityScore: 0-100"]
    K --> L["pointOfNoReturn: when you can't go back"]

    M["Find Historical Echoes"] --> N["Past decisions with similar patterns"]
    N --> O["Outcome-aware: what happened last time?"]

    P["Identify Pivotal Moments"] --> Q["Inflection points where paths diverge"]

    D & M & P --> R["OracleRecommendation"]
    R --> S["preferredUniverse + reasoning +<br/>keyRisks + alternativeActions"]

    subgraph "CendiaOrbit (Engine)"
        T["Graph Traversal"]
        U["14 Node Types × 10 Edge Types"]
        V["Influence Propagation"]
        W["Probability Decay Modeling"]
    end

    style A fill:#6366f1,color:#fff
    style K fill:#f59e0b,color:#fff
    style R fill:#10b981,color:#fff
```

## CendiaVox™ — Stakeholder Voice Assembly

```mermaid
flowchart TD
    A["Decision Proposed"] --> B["Convene Stakeholder Assembly"]

    subgraph "9 Stakeholder Types"
        S1["EMPLOYEES"]
        S2["CUSTOMERS"]
        S3["SHAREHOLDERS"]
        S4["COMMUNITY"]
        S5["ENVIRONMENT"]
        S6["FUTURE_GENERATIONS"]
        S7["SUPPLIERS"]
        S8["REGULATORS"]
        S9["CIVIL_SOCIETY"]
    end

    B --> C["For Each Stakeholder Group"]
    C --> D["Ingest Signals"]
    D --> E["Sources: surveys, social media,<br/>ESG feeds, complaints, news, regulatory"]
    E --> F["AI: Assess Impact on This Group"]
    F --> G["impactType: financial, health_safety,<br/>environmental, social, psychological"]

    G --> H["Generate Stakeholder Vote"]
    H --> I{Vote?}
    I -->|APPROVE| J["Support"]
    I -->|APPROVE_WITH_CONDITIONS| K["Conditional Support"]
    I -->|OPPOSE| L["Opposition"]
    I -->|VETO| M["BLOCKED — Harmful Externality"]

    M --> N["Decision Cannot Proceed<br/>Until Veto Resolved"]

    J & K & L --> O["Assembly Report"]
    O --> P["Weighted consensus + dissent record"]

    style M fill:#ef4444,color:#fff
    style B fill:#6366f1,color:#fff
    style O fill:#10b981,color:#fff
```

## PantheonMemory™ — Institutional Memory

```mermaid
flowchart TD
    A["Event Occurs (decision, correction, outcome)"] --> B["Create Memory"]
    B --> C["Type: decision / preference / context /<br/>insight / outcome / correction / entity / relationship"]
    C --> D["Importance: low → critical"]
    D --> E["Generate Embedding (Ollama)"]
    E --> F["Store with metadata: tags, entities, sentiment"]

    G["Agent Needs Context"] --> H["queryMemories(org, agent, query)"]
    H --> I["Vector Similarity Search"]
    I --> J["Filter by type, importance, tags"]
    J --> K["Return MemorySearchResult[]"]
    K --> L["relevance score + matchedTerms"]

    M["buildAgentContext(agentId)"] --> N["Gather: recentMemories + relevantDecisions +<br/>userPreferences + entityContext"]
    N --> O["LLM: Synthesize into coherent context string"]
    O --> P["Agent is now 'smarter' for this session"]

    Q["Learning Event"] --> R["Agent corrected or outcome recorded"]
    R --> S["Store as correction/outcome memory"]
    S --> T["Agent learns from mistakes over time"]

    style A fill:#6366f1,color:#fff
    style P fill:#10b981,color:#fff
    style T fill:#f59e0b,color:#fff
```

## ChronosAI™ — Timeline Intelligence

```mermaid
flowchart TD
    A["Organization Events Stream"] --> B["detectPivotalMoments()"]
    B --> C["LLM: Analyze events for inflection points"]
    C --> D["Rank by significance + aiConfidence"]
    D --> E["Return PivotalMoment[]"]

    F["analyzeCausalChains()"] --> G["LLM: Find cause-effect relationships"]
    G --> H["For each pair: relationship + strength"]
    H --> I["Return CausalLink[]"]

    J["predictFutureScenarios()"] --> K["LLM: Generate possible futures"]
    K --> L["Per scenario: probability, keyEvents, metrics"]

    M["generateTimelineInsight(period)"] --> N["LLM: Summarize period"]
    N --> O["keyTrends, risks, opportunities, recommendation"]

    style B fill:#6366f1,color:#fff
    style F fill:#3b82f6,color:#fff
    style J fill:#8b5cf6,color:#fff
    style M fill:#10b981,color:#fff
```

## CendiaOmniTranslate™ — 100+ Language Translation

```mermaid
flowchart TD
    A["Translation Request"] --> B{Language Tier?}

    B -->|Tier 1: en, es, fr, de, etc.| C["Fast Model: qwen2.5:7b"]
    B -->|Tier 2: pl, uk, th, vi, etc.| D["Primary Model: qwen2.5:32b"]
    B -->|Tier 3: Low-resource| E["Primary + Enhanced Prompting"]

    C & D & E --> F["Check Translation Memory Cache"]
    F --> G{Cache Hit?}
    G -->|Yes| H["Return cached translation"]
    G -->|No| I["Generate via Ollama"]
    I --> J["Apply Enterprise Glossary Terms"]
    J --> K["Store in Translation Memory"]
    K --> L["Return Translation"]

    M["RTL Support"] --> N["Arabic, Hebrew, Urdu, Persian, etc."]
    O["Batch Translation"] --> P["Process multiple texts efficiently"]
    Q["Document Translation"] --> R["Decisions, summaries, reports"]

    style C fill:#10b981,color:#fff
    style D fill:#3b82f6,color:#fff
    style E fill:#8b5cf6,color:#fff
```

## Key Code References

| Service | File | Key Capabilities |
|---------|------|-----------------|
| **Echo** | `echoService.ts` | Outcome collection, predictions vs actuals, dollar attribution, agent weight adjustment |
| **Apotheosis** | `CendiaApotheosisService.ts` | Nightly adversarial runs, LLM adjudication, auto-patch, escalation, pattern banning |
| **Horizon** | `CendiaHorizonService.ts` | Multi-universe simulation, reversibility scoring, historical echoes, CendiaCascade merged |
| **Cascade** | `CendiaCascadeService.ts` | **Deprecated** — merged into Horizon. Butterfly effect consequence engine |
| **Orbit** | `CendiaOrbitService.ts` | Graph traversal engine (14 node types, 10 edge types), influence propagation |
| **Vox** | `CendiaVoxService.ts` | 9 stakeholder types, signal integration, veto rights, impact assessment |
| **PantheonMemory** | `PantheonMemoryService.ts` | 8 memory types, vector similarity, agent context synthesis |
| **ChronosAI** | `ChronosAIService.ts` | Pivotal moments, causal chains, future scenarios, timeline insights |
| **OmniTranslate** | `CendiaOmniTranslateService.ts` | 100+ languages, 3-tier model selection, glossary, memory, RTL support |
| **Responsibility** | `CendiaResponsibilityService.ts` | Ethics engine for decision evaluation |
| **Symbiont** | `CendiaSymbiontService.ts` | Human-AI partnership measurement |
| **Narratives** | `CendiaNarrativesService.ts` | Story intelligence and narrative generation |
| **Eternal** | `CendiaEternalService.ts` | Knowledge preservation across leadership transitions |
