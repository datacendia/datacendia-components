# Datacendia Platform — Agent Personas & Council Composition

> **Source:** `backend/src/services/council/`, `backend/src/services/VerticalAgentsService.ts`
> **Purpose:** How AI agents are configured, assigned to council modes, and how deliberation composition works.

## Council Mode Composition

```mermaid
flowchart TB
    Q["User Query + Mode Selection"] --> M{Council Mode}

    M -->|"Standard"| S["3 Agents<br/>Balanced, fast response"]
    M -->|"Deep Dive"| D["5 Agents<br/>Comprehensive analysis"]
    M -->|"War Room"| W["7 Agents<br/>Maximum coverage, adversarial"]
    M -->|"Legal Strategy"| L["5 Agents<br/>Legal-specific personas"]
    M -->|"Financial"| F["5 Agents<br/>Financial-specific personas"]
    M -->|"Sports"| SP["5 Agents<br/>Sports governance personas"]

    S --> A1["Strategist"] & A2["Analyst"] & A5["Synthesizer"]
    D --> A1 & A2 & A3["Devil's Advocate"] & A4["Ethics Counsel"] & A5
    W --> A1 & A2 & A3 & A4 & A5 & A6["Technical Expert"] & A7["Risk Assessor"]

    style S fill:#10b981,color:#fff
    style D fill:#3b82f6,color:#fff
    style W fill:#ef4444,color:#fff
```

## Core Agent Personas

```mermaid
flowchart LR
    subgraph "Strategist"
        S1["Role: Strategic thinking + long-term planning"]
        S2["Model: qwq:32b"]
        S3["Prompt: Evaluate strategic implications,<br/>competitive landscape, opportunity cost"]
        S4["Speaks: First in deliberation"]
    end

    subgraph "Analyst"
        AN1["Role: Data-driven analysis + evidence review"]
        AN2["Model: qwq:32b"]
        AN3["Prompt: Analyze data, cite sources,<br/>quantify impact, identify gaps"]
        AN4["Speaks: Second, builds on Strategist"]
    end

    subgraph "Devil's Advocate"
        DA1["Role: Challenge assumptions + find weaknesses"]
        DA2["Model: qwq:32b"]
        DA3["Prompt: Identify failure modes, attack<br/>weak arguments, stress-test logic"]
        DA4["Speaks: Third, adversarial by design"]
    end

    subgraph "Ethics Counsel"
        E1["Role: Ethical implications + stakeholder impact"]
        E2["Model: qwq:32b"]
        E3["Prompt: Assess fairness, bias, harm potential,<br/>long-term societal impact"]
        E4["Speaks: Fourth, moral compass"]
    end

    subgraph "Synthesizer"
        SY1["Role: Merge perspectives + build consensus"]
        SY2["Model: qwen2.5:7b (fast)"]
        SY3["Prompt: Summarize positions, find common<br/>ground, draft recommendation"]
        SY4["Speaks: Last, produces final output"]
    end
```

## Agent Deliberation Flow

```mermaid
sequenceDiagram
    participant User
    participant Council as CouncilService
    participant S as Strategist
    participant A as Analyst
    participant DA as Devil's Advocate
    participant E as Ethics Counsel
    participant SY as Synthesizer
    participant Sentry as CendiaSentry

    User->>Council: Submit query (War Room mode)

    Note over Council: Round 1 - Initial Positions
    Council->>S: Generate strategic position
    S-->>Council: Position + citations
    Council->>Sentry: Guardrail check
    Sentry-->>Council: Pass ✓

    Council->>A: Analyze with data (sees Strategist's position)
    A-->>Council: Analysis + evidence
    Council->>Sentry: Guardrail check
    Sentry-->>Council: Pass ✓

    Council->>DA: Challenge both positions
    DA-->>Council: Counterarguments + failure modes
    Council->>Sentry: Guardrail check
    Sentry-->>Council: Pass ✓

    Council->>E: Ethical assessment
    E-->>Council: Ethics score + concerns
    Council->>Sentry: Guardrail check
    Sentry-->>Council: Pass ✓

    Note over Council: Round 2 - Rebuttal (if Deep Dive / War Room)
    Council->>S: Respond to Devil's Advocate challenges
    S-->>Council: Updated position
    Council->>DA: Counter-rebuttal
    DA-->>Council: Final challenges

    Note over Council: Synthesis
    Council->>SY: Merge all positions into recommendation
    SY-->>Council: Consensus recommendation + confidence score

    Council-->>User: Final recommendation streamed
```

## Legal Vertical Agent Presets

```mermaid
flowchart TD
    subgraph "Legal Strategy Mode"
        L1["Legal Strategist<br/>Case strategy, precedent analysis,<br/>litigation risk assessment"]
        L2["Contract Analyst<br/>Clause analysis, risk identification,<br/>obligation tracking"]
        L3["Compliance Auditor<br/>ABA, SRA, EU AI Act, GDPR<br/>framework assessment"]
        L4["Research Associate<br/>Case law search, statutory analysis,<br/>CourtListener + eCFR integration"]
        L5["Ethics Counsel<br/>Attorney-client privilege,<br/>conflicts of interest, duty assessment"]
    end

    L1 --> |"Each agent has"| CONFIG["System prompt<br/>RAG context scope<br/>Citation requirements<br/>Compliance frameworks<br/>Model assignment"]

    style L1 fill:#6366f1,color:#fff
```

## Financial Vertical Agent Presets

```mermaid
flowchart TD
    subgraph "Financial Strategy Mode"
        F1["Risk Analyst<br/>Market risk, credit risk,<br/>operational risk quantification"]
        F2["Compliance Officer<br/>SOX, Dodd-Frank, GLBA,<br/>Basel III, MiFID II"]
        F3["Portfolio Manager<br/>Asset allocation, rebalancing,<br/>performance attribution"]
        F4["Regulatory Specialist<br/>SEC filings, FINRA rules,<br/>cross-border regulations"]
    end

    style F1 fill:#3b82f6,color:#fff
```

## Sports Vertical Agent Presets

```mermaid
flowchart TD
    subgraph "Sports Governance Mode"
        SP1["Financial Agent<br/>Transfer fee analysis,<br/>budget impact, FFP compliance"]
        SP2["Scout Agent<br/>Player performance data,<br/>statistical analysis"]
        SP3["Compliance Agent<br/>FIFA TMS, UEFA FFP,<br/>domestic league rules"]
        SP4["Risk Agent<br/>Injury history, market volatility,<br/>contract risk assessment"]
        SP5["Strategy Agent<br/>Squad balance, long-term planning,<br/>competitive positioning"]
    end

    style SP3 fill:#10b981,color:#fff
```

## Collapse Orchestrator — 18 Adversarial Agents

```mermaid
flowchart TB
    subgraph "7 Agent Categories (18 total)"
        C1["Economic Collapse (3)<br/>Market crash, supply chain,<br/>currency crisis agents"]
        C2["Social Collapse (3)<br/>Public trust, workforce revolt,<br/>demographic shift agents"]
        C3["Technical Collapse (3)<br/>System failure, cyber attack,<br/>data corruption agents"]
        C4["Regulatory Collapse (2)<br/>Law change, sanctions agents"]
        C5["Environmental Collapse (2)<br/>Climate event, resource<br/>depletion agents"]
        C6["Political Collapse (3)<br/>Regime change, war,<br/>trade war agents"]
        C7["Systemic Collapse (2)<br/>Cascade failure,<br/>black swan agents"]
    end

    ALL["All 18 agents test decision<br/>against failure scenarios"] --> DUAL["Dual-Track Deliberation"]
    DUAL --> CONSENSUS["Consensus Track<br/>(Standard agents agree)"]
    DUAL --> COLLAPSE["Collapse Track<br/>(Adversarial agents find failures)"]
    CONSENSUS & COLLAPSE --> MERGE["Merge: Hard block if<br/>civil liberties violations found"]

    style C1 fill:#ef4444,color:#fff
    style C7 fill:#8b5cf6,color:#fff
    style MERGE fill:#6366f1,color:#fff
```

## SGAS — 5 Agent Classes

```mermaid
flowchart TD
    subgraph "Agent Class Hierarchy"
        D["Decision Agents<br/>Make proposals and vote"]
        I["Institutional Agents<br/>Enforce rules and procedures"]
        A["Adversarial Agents<br/>Challenge and stress-test"]
        O["Observer Agents<br/>Monitor and report"]
        M["Meta-Governance Agents<br/>Oversee the governance process itself"]
    end

    D --> DG["Deliberation Graph"]
    I --> DG
    A --> DG
    O --> DG
    M --> DG

    DG --> R["Ordered, logged, replayable<br/>execution with final summary"]

    style D fill:#10b981,color:#fff
    style A fill:#ef4444,color:#fff
    style M fill:#8b5cf6,color:#fff
```

## Vertical Agent Service — Universal Agent Factory

```mermaid
flowchart TD
    A["VerticalAgentsService"] --> B{Which Vertical?}

    B --> V1["Legal (5 agents)"]
    B --> V2["Financial (4 agents)"]
    B --> V3["Healthcare (4 agents)"]
    B --> V4["Government (4 agents)"]
    B --> V5["Insurance (4 agents)"]
    B --> V6["Energy (4 agents)"]
    B --> V7["Defense (4 agents)"]
    B --> V8["Sports (5 agents)"]
    B --> V9["Manufacturing (3 agents)"]
    B --> V10["Education (3 agents)"]
    B --> V11["Real Estate (3 agents)"]
    B --> V12["Agriculture (3 agents)"]
    B --> V13["Transportation (3 agents)"]
    B --> V14["Telecom (3 agents)"]
    B --> V15["Retail (3 agents)"]

    V1 & V2 & V3 & V4 & V5 & V6 & V7 & V8 --> FULL["Full agent presets<br/>with compliance frameworks"]
    V9 & V10 & V11 & V12 & V13 & V14 & V15 --> TEMPLATE["Template agents<br/>(20-30% complete)"]

    style A fill:#6366f1,color:#fff
    style FULL fill:#10b981,color:#fff
    style TEMPLATE fill:#f59e0b,color:#fff
```

## Agent Memory (PantheonMemoryService)

```mermaid
flowchart TD
    A["Agent completes deliberation"] --> B["Extract learnings"]
    B --> C["Classify memory type"]
    C --> D["EPISODIC: Specific events"]
    C --> E["SEMANTIC: General knowledge"]
    C --> F["PROCEDURAL: How-to patterns"]
    C --> G["EMOTIONAL: Sentiment/tone"]

    D & E & F & G --> H["Assign importance (0-100)"]
    H --> I["Generate vector embedding"]
    I --> J["Store in PantheonMemory"]

    K["Next deliberation starts"] --> L["Query agent context"]
    L --> M["Vector search: relevant memories"]
    M --> N["Inject into system prompt"]
    N --> O["Agent is smarter over time"]

    style J fill:#6366f1,color:#fff
    style O fill:#10b981,color:#fff
```
