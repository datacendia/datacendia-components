# LogicGate Parallel Processing Workflow

> **Service:** `LogicGateService` (`backend/src/services/strategic/LogicGateService.ts`)
> **Purpose:** Parallel processing architecture for concurrent agent execution and burst compute — manages task queues with configurable concurrency, timeouts, and retry logic.

## Parallel Execution Flow

```mermaid
flowchart TD
    A["executeParallel(name, tasks, config)"] --> B[Create ParallelExecution Record]
    B --> C["Status: running"]
    C --> D["Set maxConcurrency (default: 5)"]
    D --> E["Set timeoutMs (default: 30000)"]
    E --> F["Set maxRetries (default: 2)"]

    F --> G["Initialize Task Queue"]
    G --> H["For Each Task: Create TaskEntry"]
    H --> I["TaskEntry: id, fn, status=pending,<br/>retryCount=0"]

    I --> J["processTaskQueue()"]

    subgraph "Concurrent Worker Pool"
        J --> K{Queue Has Pending Tasks<br/>AND running < maxConcurrency?}
        K -->|Yes| L["Dequeue Next Task"]
        L --> M["Task Status → running"]
        M --> N["runTask(task) with Timeout"]

        N --> O{Task Completes?}
        O -->|Success| P["Status → completed"]
        P --> Q["Store Result"]

        O -->|Error| R{retryCount < maxRetries?}
        R -->|Yes| S["retryCount++"]
        S --> T["Status → pending (re-queue)"]
        T --> K

        R -->|No| U["Status → failed"]
        U --> V["Store Error"]

        O -->|Timeout| W{"Retry?"}
        W -->|Yes| S
        W -->|No| X["Status → failed (timeout)"]

        Q & V & X --> Y{More Tasks?}
        Y -->|Yes| K
        Y -->|No| Z["All Tasks Settled"]
    end

    K -->|No: All Done| Z

    Z --> AA["Calculate Results"]
    AA --> AB["totalTasks, completed, failed"]
    AB --> AC["durationMs = endTime - startTime"]
    AC --> AD["Execution Status → completed"]
    AD --> AE["Return ParallelResult"]

    style A fill:#6366f1,color:#fff
    style J fill:#3b82f6,color:#fff
    style P fill:#10b981,color:#fff
    style U fill:#ef4444,color:#fff
    style AE fill:#6366f1,color:#fff
```

## Concurrency Model

```mermaid
sequenceDiagram
    participant Client
    participant LogicGate as LogicGateService
    participant Worker1 as Worker 1
    participant Worker2 as Worker 2
    participant Worker3 as Worker 3

    Client->>LogicGate: executeParallel(tasks[6], maxConcurrency=3)
    
    par Batch 1 (3 concurrent)
        LogicGate->>Worker1: Task 1
        LogicGate->>Worker2: Task 2
        LogicGate->>Worker3: Task 3
    end

    Worker1-->>LogicGate: Task 1 ✓ (800ms)
    LogicGate->>Worker1: Task 4 (backfill slot)
    Worker2-->>LogicGate: Task 2 ✓ (1200ms)
    LogicGate->>Worker2: Task 5 (backfill slot)
    Worker3-->>LogicGate: Task 3 ✗ (retry 1/2)
    LogicGate->>Worker3: Task 3 retry
    Worker1-->>LogicGate: Task 4 ✓
    LogicGate->>Worker1: Task 6 (backfill slot)
    Worker3-->>LogicGate: Task 3 ✓ (retry succeeded)
    Worker2-->>LogicGate: Task 5 ✓
    Worker1-->>LogicGate: Task 6 ✓
    
    LogicGate-->>Client: ParallelResult{completed: 6, failed: 0}
```

## Timeout & Retry Strategy

```mermaid
flowchart LR
    subgraph "Retry Logic"
        A["Task Fails"] --> B{retryCount < maxRetries?}
        B -->|Yes| C["Increment retryCount"]
        C --> D["Re-enqueue as pending"]
        D --> E["Worker picks up again"]
        B -->|No| F["Mark as FAILED"]
        F --> G["Store error in TaskResult"]
    end

    subgraph "Timeout Logic"
        H["Task Started"] --> I["Set setTimeout(timeoutMs)"]
        I --> J{Completes Before Timeout?}
        J -->|Yes| K["Normal completion"]
        J -->|No| L["Promise.race — Timeout Wins"]
        L --> M["Treated as Error → Retry Logic"]
    end

    subgraph "Config Defaults"
        N["maxConcurrency: 5"]
        O["timeoutMs: 30000 (30s)"]
        P["maxRetries: 2"]
        Q["retryDelayMs: 1000"]
    end
```

## Burst Compute Use Cases

```mermaid
graph TD
    subgraph "Council Deliberation"
        A["6 AI Agents → 6 Parallel LLM Calls"]
    end

    subgraph "Crucible Simulation"
        B["12 Universes → 12 Parallel Monte Carlo Runs"]
    end

    subgraph "Aegis Threat Analysis"
        C["N Signals → N Parallel Assessments"]
    end

    subgraph "Ingest Pipeline"
        D["N Documents → N Parallel Extractions"]
    end

    A & B & C & D --> E["LogicGateService.executeParallel()"]
    E --> F["Managed Concurrency Pool"]

    style E fill:#6366f1,color:#fff
```

## Key Code References

- **Entry Point:** `executeParallel()` — creates execution and processes queue
- **Queue Processing:** `processTaskQueue()` — backfill-on-completion concurrency model
- **Task Execution:** `runTask()` — runs function with timeout via `Promise.race`
- **Retry:** Automatic re-queue on failure until `maxRetries` exhausted
- **Tracking:** `getExecution()`, `getActiveExecutions()` — inspect running/completed jobs
- **Metrics:** `totalTasks`, `completed`, `failed`, `durationMs` per execution
- **Config Defaults:** `maxConcurrency=5`, `timeoutMs=30000`, `maxRetries=2`
