# CendiaCrucible Simulation Workflow

> **Service:** `CendiaCrucibleService` (`backend/src/services/CendiaCrucibleService.ts`)
> **Purpose:** Synthetic multiverse simulation engine — high-fidelity mathematical twin of the enterprise for stress testing, Monte Carlo prediction, and failure cascade mapping.

## Simulation Execution Pipeline

```mermaid
flowchart TD
    A[User Creates Simulation] --> B[createSimulation]
    B --> C["captureDigitalTwin(orgId)"]
    C --> D["Prisma: Parallel Fetch All Org Data"]

    subgraph "Digital Twin Capture (Real Data)"
        D --> D1[organizations]
        D --> D2[metric_definitions + metric_values]
        D --> D3[data_sources]
        D --> D4[health_scores]
        D --> D5[users]
        D --> D6[workflows]
        D --> D7["alerts (ACTIVE)"]
    end

    D1 & D2 & D3 & D4 & D5 & D6 & D7 --> E[Build Digital Twin Snapshot]
    E --> F[extractFinancialMetrics from real metrics]
    E --> G[extractEmployeeMetrics from real users]
    E --> H[buildDepartmentsFromData — infer from roles]
    E --> I[buildRelationshipsFromData — data + workflow deps]

    F & G & H & I --> J[Save to crucible_simulations Table]
    J --> K["Status: DRAFT"]

    K --> L[runSimulation]
    L --> M["Status → RUNNING"]

    M --> N[runMonteCarloSimulation]
    N --> O["Loop: Generate N Universes (max 12)"]

    subgraph "Per Universe Generation"
        O --> P[Apply Scenario Shocks to KPIs]
        P --> Q["Add Monte Carlo Randomness<br/>(Gaussian: mean=1, stdDev=0.15)"]
        Q --> R[Calculate Category Risk Scores]
        R --> S[Determine Outcome Sentiment]
        S --> T[Generate Summary from Template]
        T --> U[Save to crucible_universes Table]
        U --> V{Negative/Catastrophic?}
        V -->|Yes| W[generateFailureCascades]
        V -->|No| X[Skip Cascades]
    end

    W & X --> Y[Sort Universes by Probability]
    Y --> Z[calculateImpacts Across 8 Categories]

    subgraph "Impact Categories"
        Z --> Z1[FINANCIAL]
        Z --> Z2[OPERATIONAL]
        Z --> Z3[SECURITY]
        Z --> Z4[COMPLIANCE]
        Z --> Z5[CULTURAL]
        Z --> Z6[REPUTATIONAL]
        Z --> Z7[STRATEGIC]
        Z --> Z8[TECHNOLOGICAL]
    end

    Z1 & Z2 & Z3 & Z4 & Z5 & Z6 & Z7 & Z8 --> AA[Save to crucible_impacts Table]
    AA --> AB[generateCouncilDeliberations]
    AB --> AC["LLM: Agent Responses to Scenario"]
    AC --> AD[Analyze Consensus]
    AD --> AE[Save to crucible_council_deliberations]
    AE --> AF[generateResultSummary]
    AF --> AG["Identify: bestCase, worstCase, mostLikely"]
    AG --> AH["Status → COMPLETED"]
    AH --> AI["Return SimulationResult"]

    style A fill:#6366f1,color:#fff
    style C fill:#3b82f6,color:#fff
    style N fill:#f59e0b,color:#fff
    style AB fill:#8b5cf6,color:#fff
    style AH fill:#10b981,color:#fff
```

## Simulation State Machine

```mermaid
stateDiagram-v2
    [*] --> DRAFT: createSimulation()
    DRAFT --> CONFIGURING: User edits config
    CONFIGURING --> RUNNING: runSimulation()
    RUNNING --> COMPLETED: All phases succeed
    RUNNING --> FAILED: Error during execution
    DRAFT --> CANCELLED: User cancels
    CONFIGURING --> CANCELLED: User cancels
```

## Shock Application Logic

```mermaid
flowchart LR
    subgraph "Shock Types"
        A["absolute: Set exact value"]
        B["percentage: Multiply by (1 + value/100)"]
        C["multiplier: Multiply by value"]
    end

    subgraph "Timing"
        D["immediate: Full effect now"]
        E["gradual: Linear ramp over duration"]
        F["delayed: No effect until trigger"]
    end

    subgraph "12 Scenario Templates"
        G[FINANCIAL_STRESS: -30% revenue]
        H[CYBER_ATTACK: 0 availability]
        I[BLACK_SWAN: -80% all operations]
        J[TALENT_EXODUS: -50% key talent]
        K[SUPPLY_CHAIN: -70% supply]
        L[REGULATORY_CHANGE: +100% compliance costs]
    end
```

## Key Code References

- **Creation:** `createSimulation()` — captures real digital twin from all DB tables
- **Digital Twin:** `captureDigitalTwin()` — 7 parallel Prisma queries for real org data
- **Monte Carlo:** `runMonteCarloSimulation()` → `generateUniverse()` per iteration
- **Shock Math:** `applyShock()` — absolute/percentage/multiplier with Gaussian noise
- **Cascades:** `generateFailureCascades()` — for negative/catastrophic outcomes
- **Impacts:** `calculateImpacts()` — across 8 enterprise impact categories
- **Council AI:** `generateCouncilDeliberations()` — LLM-powered agent analysis of scenario
- **Summary:** `generateResultSummary()` — bestCase, worstCase, mostLikely identification
- **Templates:** 12 pre-built scenario templates (FINANCIAL_STRESS through CUSTOM)
- **DB Tables:** `crucible_simulations`, `crucible_universes`, `crucible_impacts`, `crucible_council_deliberations`
