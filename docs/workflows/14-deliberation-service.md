# Deliberation Service (Persistence Layer) Workflow

> **Service:** `DeliberationService` (`backend/src/services/DeliberationService.ts`)
> **Purpose:** Persistent storage, executive summaries, and formal minutes for Council deliberations — the persistence and post-processing layer that sits behind CouncilService.

## Save Deliberation Pipeline

```mermaid
flowchart TD
    A["saveDeliberation(deliberation)"] --> B["Generate ID: delib-{timestamp}-{random}"]
    B --> C{"Prisma Available?"}

    C -->|Yes| D["prisma.deliberations.create()"]
    D --> E["Store: question, mode, status,<br/>confidence, decision, context JSON"]
    E --> F["context includes: agentResponses,<br/>crossExaminations, userId, tags"]

    C -->|No| G["Log warning: DB unavailable"]

    D & G --> H["Cache in Memory Map"]
    H --> I["Index by organizationId"]
    I --> J["Keep max 100 per org in cache"]

    J --> K["DruidEventStream.logDecision()"]
    K --> L["Stream analytics: agents, consensus,<br/>confidence, riskLevel, department"]

    L --> M["recordChronosEvent()"]
    M --> N["Timeline: deliberation_completed"]
    N --> O["Metadata: councilMode, confidence,<br/>agentCount, consensusReached"]

    O --> P["Increment deliberations_saved counter"]
    P --> Q["Return Saved Deliberation"]

    style A fill:#6366f1,color:#fff
    style D fill:#3b82f6,color:#fff
    style K fill:#f59e0b,color:#fff
    style M fill:#8b5cf6,color:#fff
    style Q fill:#10b981,color:#fff
```

## Retrieval Strategy

```mermaid
flowchart TD
    A["getDeliberation(id)"] --> B["prisma.deliberations.findUnique()"]
    B --> C["Include: deliberation_messages + agents"]

    C --> D{context.agentResponses exists?}
    D -->|Yes| E["Use Rich Context Data"]
    E --> F["Map: agentId, agentName, agentRole,<br/>agentAvatar, agentColor, content, duration"]
    D -->|No| G["Fallback: deliberation_messages"]
    G --> H["Map: agent_id → agents.name/code"]

    F & H --> I{context.crossExaminations exists?}
    I -->|Yes| J["Use Context Cross-Exams"]
    I -->|No| K["Filter messages WHERE phase = cross_examination"]

    J & K --> L["Find Synthesis"]
    L --> M{synthesis message exists?}
    M -->|Yes| N["Use synthesis message content"]
    M -->|No| O["Fallback: decision field or concat responses"]

    N & O --> P["Return Complete Deliberation Object"]

    style A fill:#6366f1,color:#fff
    style E fill:#10b981,color:#fff
    style G fill:#f59e0b,color:#fff
    style P fill:#10b981,color:#fff
```

## Executive Summary Generation

```mermaid
flowchart TD
    A["generateExecutiveSummary(deliberationId)"] --> B["getDeliberation()"]
    B --> C["Build LLM Prompt"]
    C --> D["Ollama: llama3.2:3b"]
    D --> E["temperature: 0.3, format: json"]

    E --> F{Parse JSON Response?}
    F -->|Success| G["Extract: title, recommendation,<br/>keyFindings, riskFactors, nextSteps, dissent"]
    F -->|Fail| H["Fallback: extractFromSynthesis()"]

    H --> I["Split synthesis into sentences"]
    I --> J["Classify by keywords:"]
    J --> J1["risk/concern/threat → riskFactors"]
    J --> J2["should/must/recommend → nextSteps"]
    J --> J3["Other substantive → keyFindings"]

    G & J1 & J2 & J3 --> K["Build ExecutiveSummary"]
    K --> L["approvalStatus: pending"]
    L --> M["Return ExecutiveSummary"]

    style A fill:#6366f1,color:#fff
    style D fill:#3b82f6,color:#fff
    style H fill:#f59e0b,color:#fff
    style M fill:#10b981,color:#fff
```

## Minutes Generation

```mermaid
flowchart TD
    A["generateMinutes(deliberationId)"] --> B["getDeliberation()"]
    B --> C["Build Proceedings Timeline"]

    C --> D["Entry 1: Chair opens session"]
    D --> E["Loop: Agent Responses"]
    E --> F["Entry per agent: +1 minute interval<br/>type: statement"]
    F --> G["Loop: Cross-Examinations"]
    G --> H["Challenge entry: +30s interval<br/>type: challenge"]
    H --> I["Rebuttal entry: +30s interval<br/>type: response"]
    I --> J["Final Entry: Synthesis<br/>type: resolution"]

    J --> K["Build Attendees List from Agents"]
    K --> L["Generate Action Items from Synthesis"]
    L --> M["Extract sentences with action keywords"]
    M --> N["Create ActionItem per sentence<br/>status: pending"]

    N --> O["Build Resolutions from Synthesis"]
    O --> P["Return DeliberationMinutes"]

    style A fill:#6366f1,color:#fff
    style E fill:#3b82f6,color:#fff
    style G fill:#f59e0b,color:#fff
    style P fill:#10b981,color:#fff
```

## Integration Points

```mermaid
sequenceDiagram
    participant Council as CouncilService
    participant Delib as DeliberationService
    participant Prisma as PostgreSQL
    participant Druid as DruidEventStream
    participant Chronos as ChronosEventBus
    participant LLM as Ollama

    Council->>Delib: saveDeliberation(result)
    Delib->>Prisma: deliberations.create()
    Delib->>Delib: Cache in memory map
    Delib->>Druid: logDecision(analytics)
    Delib->>Chronos: recordChronosEvent(timeline)

    Note over Delib: Later, on demand:
    Delib->>Delib: generateExecutiveSummary()
    Delib->>LLM: Generate summary JSON (llama3.2:3b)
    LLM-->>Delib: {title, recommendation, keyFindings, riskFactors, nextSteps}

    Delib->>Delib: generateMinutes()
    Note over Delib: Built from stored data,<br/>no LLM needed for minutes
```

## Key Code References

- **Save:** `saveDeliberation()` — DB + cache + Druid analytics + Chronos timeline
- **Get:** `getDeliberation()` — DB-first with dual fallback (context JSON vs messages)
- **List:** `getDeliberations()` — Prisma query with status/org filters + pagination
- **Executive Summary:** `generateExecutiveSummary()` — LLM-generated with sentence extraction fallback
- **Minutes:** `generateMinutes()` — structured proceedings from agent responses and cross-examinations
- **Analytics:** `DruidEventStream.logDecision()` — streams to Druid for CendiaChronos
- **Timeline:** `recordChronosEvent()` — records on universal timeline
- **DB Tables:** `deliberations`, `deliberation_messages`, `agents`
- **Cache:** In-memory Map with max 100 entries per org
- **LLM Model:** `llama3.2:3b` for executive summaries (fast, lightweight)
