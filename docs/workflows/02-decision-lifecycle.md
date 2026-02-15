# Decision Lifecycle Workflow

> **Service:** `DecisionService` (`backend/src/services/DecisionService.ts`)
> **Purpose:** Full lifecycle tracking, replay, and audit trail for all decisions — the "Black Box Flight Recorder" for enterprise decisions.

## Decision State Machine

```mermaid
stateDiagram-v2
    [*] --> draft: createDecision()
    draft --> analyzing: recordPreMortem()
    analyzing --> deliberating: recordCouncilSession()
    deliberating --> deliberating: recordGhostBoard()
    deliberating --> decided: recordFinalDecision()
    decided --> implemented: updateDecision(status)
    implemented --> closed: recordOutcome()
    decided --> closed: recordOutcome()
    
    draft --> draft: updateDecision()
    analyzing --> analyzing: recordPreMortem() [additional runs]
    deliberating --> deliberating: recordCouncilSession() [additional sessions]
```

## Full Decision Flow

```mermaid
flowchart TD
    A[User Creates Decision] --> B[createDecision]
    B --> C[Generate ID + Timeline Event: 'created']
    C --> D[Store in Memory Map + Org Index]
    D --> E[Decision in DRAFT Status]

    E --> F{User Runs Analysis?}
    
    F -->|Pre-Mortem| G[recordPreMortem]
    G --> H[Capture PreMortemSnapshot]
    H --> I["Store: riskScore, failureModes, totalExposure"]
    I --> J[Add Timeline Event: 'premortem_run']
    J --> K[Status → ANALYZING]

    F -->|Council Session| L[recordCouncilSession]
    L --> M[Capture CouncilSnapshot]
    M --> N["Store: agentResponses, synthesis, consensusLevel"]
    N --> O[Add Timeline Event: 'council_session']
    O --> P[Status → DELIBERATING]

    F -->|Ghost Board| Q[recordGhostBoard]
    Q --> R[Capture GhostBoardSnapshot]
    R --> S["Store: questions, preparednessScore, criticalGaps"]
    S --> T[Add Timeline Event: 'ghost_board']

    K --> F
    P --> F
    T --> F

    F -->|Make Decision| U[recordFinalDecision]
    U --> V[Set finalDecision + decisionMadeAt]
    V --> W[Add Timeline Event: 'decision_made']
    W --> X[Generate Audit Hash - SHA256]
    X --> Y[Status → DECIDED]

    Y --> Z{Record Outcome?}
    Z -->|Yes| AA[recordOutcome]
    AA --> AB["Store: actualResult, lessonsLearned"]
    AB --> AC[Add Timeline Event: 'outcome_recorded']
    AC --> AD[Update Audit Hash]
    AD --> AE[Status → CLOSED]

    Z -->|Export| AF[exportForAudit]
    AF --> AG[Generate Current Hash]
    AG --> AH{Hash Match?}
    AH -->|Yes| AI[Export with hashValid: true]
    AH -->|No| AJ[Export with hashValid: false ⚠️ Tamper Detected]

    Z -->|Replay| AK[getFullReplay]
    AK --> AL[Return Ordered Timeline Steps]

    style A fill:#6366f1,color:#fff
    style E fill:#94a3b8,color:#fff
    style K fill:#f59e0b,color:#fff
    style P fill:#3b82f6,color:#fff
    style Y fill:#10b981,color:#fff
    style AE fill:#6b7280,color:#fff
    style AJ fill:#ef4444,color:#fff
```

## Data Persistence Strategy

```mermaid
flowchart LR
    subgraph "Read Path (getDecision)"
        A[Query] --> B{Prisma DB Available?}
        B -->|Yes| C[SELECT from decisions + decision_activities]
        B -->|No| D[Fallback to In-Memory Map]
        C --> E[Map DB format → Decision Interface]
        D --> E
    end

    subgraph "Write Path (createDecision)"
        F[New Decision] --> G[Store in Memory Map]
        G --> H[Update Org Index]
        H --> I[Increment Counter]
    end

    subgraph "Analytics (getDecisionStats)"
        J[Org ID] --> K[Aggregate by Status]
        K --> L[Aggregate by Priority]
        L --> M[Calculate Avg Risk Score]
        M --> N[Calculate Outcome Accuracy]
        N --> O["predictedHigh == actualFailure?"]
    end
```

## Key Code References

- **CRUD:** `createDecision()`, `getDecision()`, `getDecisions()`, `updateDecision()`
- **Analysis Recording:** `recordPreMortem()`, `recordCouncilSession()`, `recordGhostBoard()`
- **Finalization:** `recordFinalDecision()` — generates tamper-detection audit hash
- **Outcome:** `recordOutcome()` — closes the loop with actual results + lessons learned
- **Replay:** `getFullReplay()` — returns every event in chronological order
- **Audit Export:** `exportForAudit()` — validates hash integrity for tamper detection
- **DB Tables:** `decisions`, `decision_activities` (Prisma)
