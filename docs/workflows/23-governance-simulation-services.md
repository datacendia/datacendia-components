# Governance Simulation Services Workflows

> **Directories:** `backend/src/services/collapse/`, `backend/src/services/scge/`, `backend/src/services/sgas/`, `backend/src/services/governance/`
> **Purpose:** Dual-track deliberation (Collapse), synthetic civic governance simulation (SCGE), directed agent deliberation graphs (SGAS), and AI constitutional court for dispute resolution.

## Governance Simulation Overview

```mermaid
flowchart TB
    subgraph "Dual-Track Deliberation"
        CO["CollapseOrchestrator<br/>18 Collapse Agents"]
    end

    subgraph "Synthetic Civic Governance"
        SCGE["SCGEOrchestrator<br/>Population + Policy + Events"]
        SP["SyntheticPopulation"]
        PI["PolicyInjection"]
        EI["EventInjection"]
        SL["StressorLibrary"]
    end

    subgraph "Agent Deliberation Graph"
        SGAS["SGASOrchestrator<br/>5 Agent Classes"]
        DA["Decision Agents (Class I)"]
        IA["Institutional Agents (Class II)"]
        AA["Adversarial Agents (Class III)"]
        OA["Observer Agents (Class IV)"]
        MG["Meta-Governance (Class V)"]
    end

    subgraph "AI Judiciary"
        ACC["AIConstitutionalCourt<br/>Dispute Resolution + Precedent"]
    end

    SCGE --> SGAS
    CO --> SGAS
    SGAS --> ACC

    style CO fill:#ef4444,color:#fff
    style SCGE fill:#6366f1,color:#fff
    style SGAS fill:#3b82f6,color:#fff
    style ACC fill:#f59e0b,color:#fff
```

---

## CollapseOrchestrator — Dual-Track Deliberation

```mermaid
flowchart TD
    A["Policy/Decision Proposed"] --> B["DUAL TRACK SPLIT"]

    B --> C["Consensus Track<br/>Optimize for approval"]
    B --> D["Collapse Track<br/>MUST find failure modes"]

    subgraph "18 Collapse Agents (7 Categories)"
        direction TB
        E1["A. Legitimacy & Trust<br/>LegitimacyCollapse, DemocraticErosion, ProceduralJustice"]
        E2["B. Civil Liberties (NON-OVERRIDABLE)<br/>FreeSpeechChilling, DueProcessViolation, FreedomOfAssociation"]
        E3["C. Minority & Equity<br/>MinorityHarm, CulturalErasure, DisabilityImpact"]
        E4["D. Political & Narrative<br/>PoliticalBacklash, NarrativeWeaponization, ForeignInfluence"]
        E5["E. Economic & Systemic<br/>EconomicInstability, MarketDistortion, SystemicRisk"]
        E6["F. Temporal & Environmental<br/>TemporalDecay, EnvironmentalExternality"]
        E7["G. Abuse<br/>AdversarialAbuse"]
    end

    D --> E1 & E2 & E3 & E4 & E5 & E6 & E7

    E1 & E2 & E3 & E4 & E5 & E6 & E7 --> F["FailureEnvelope"]
    F --> G["Aggregate: FailureConditions,<br/>SystemicRisks, EthicalRedLines,<br/>NarrativeAttacks, ExploitPaths"]

    G --> H["calculateCollapseRisk()"]
    H --> I["calculateTrustDelta()"]

    C & I --> J["DualTrackDeliberation"]
    J --> K{Civil Liberties Violation?}
    K -->|Yes| L["HARD BLOCK — Cannot override"]
    K -->|No| M["Proceed with risk-aware decision"]

    style D fill:#ef4444,color:#fff
    style E2 fill:#ef4444,color:#fff
    style L fill:#ef4444,color:#fff
    style M fill:#10b981,color:#fff
```

## SCGEOrchestrator — Synthetic Civic Governance Environment

```mermaid
flowchart TD
    A["Create Simulation Config"] --> B["Phase 1: INITIALIZATION"]
    B --> C["Phase 2: POPULATION_GENERATION"]
    C --> D["SyntheticPopulation: demographics,<br/>segments, economic profiles"]

    D --> E["Phase 3: POLICY_INJECTION"]
    E --> F["Activate policies from template library"]

    F --> G["Phase 4: STRESSOR_APPLICATION"]
    G --> H["Apply stressors: economic shocks,<br/>natural disasters, political events"]

    H --> I["Phase 5: EVENT_PROCESSING"]
    I --> J["For each timestep"]
    J --> K["Inject events"]
    K --> L["SGAS deliberates on response"]
    L --> M["Record decisions + outcomes"]
    M --> N{More timesteps?}
    N -->|Yes| J
    N -->|No| O["Phase 6: OUTCOME_ANALYSIS"]

    O --> P["Calculate OutcomeMetrics"]
    P --> Q["Detect BiasIndicators"]
    Q --> R["Generate AuditPacket"]
    R --> S["Merkle root + state hashes"]
    S --> T["ReplayBundle for deterministic replay"]

    subgraph "Seeded RNG"
        U["Deterministic: same seed = same results"]
    end

    style A fill:#6366f1,color:#fff
    style L fill:#3b82f6,color:#fff
    style T fill:#10b981,color:#fff
```

## SGASOrchestrator — Directed Agent Deliberation Graph

```mermaid
flowchart TD
    A["Decision Proposal Submitted"] --> B["Create DeliberationGraph"]

    B --> C["Phase 1: Decision Agents (Class I)"]
    C --> D["Analyze proposal, generate options,<br/>score alternatives, recommend"]

    D --> E["Phase 2: Institutional Agents (Class II)"]
    E --> F["Check: budget, legal, policy,<br/>precedent, mandate compliance"]

    F --> G["Phase 3: Adversarial Agents (Class III)"]
    G --> H["Attack proposal: find exploits,<br/>unintended consequences, blind spots"]

    H --> I["Phase 4: Observer Agents (Class IV)"]
    I --> J["Detect anomalies, measure fairness,<br/>track process integrity"]

    J --> K{metaGovernanceEnabled?}
    K -->|Yes| L["Phase 5: Meta-Governance (Class V)"]
    L --> M["Assess overall deliberation quality,<br/>check for meta-level failures"]
    K -->|No| N["Skip Meta-Governance"]

    M & N --> O["Generate DeliberationSummary"]
    O --> P["consensusRecommendation"]
    O --> Q["trustDelta"]
    O --> R["merkleRoot + deterministicHash"]

    P --> S{Blocked?}
    S -->|Yes| T["escalationRequired: true"]
    S -->|No| U["approved: true"]

    style C fill:#3b82f6,color:#fff
    style E fill:#6366f1,color:#fff
    style G fill:#ef4444,color:#fff
    style I fill:#f59e0b,color:#fff
    style L fill:#8b5cf6,color:#fff
```

## AIConstitutionalCourt — Dispute Resolution

```mermaid
flowchart TD
    A["Agents Disagree"] --> B["File Dispute"]
    B --> C["Category: confidence_conflict /<br/>methodology / data_interpretation /<br/>ethical / compliance / risk / recommendation"]

    C --> D["Assign Case Number"]
    D --> E["Search Precedent Database"]
    E --> F{Applicable Precedent?}
    F -->|binding| G["Apply directly"]
    F -->|persuasive| H["Consider but not mandatory"]
    F -->|distinguishable| I["Note differences"]
    F -->|none| J["Novel case — establish new precedent"]

    G & H & I & J --> K["Deliberation Phase"]
    K --> L["Apply Constitutional Principles"]
    L --> M["6 Categories: safety, fairness,<br/>transparency, accountability, privacy, accuracy"]
    M --> N["Weight principles (1-10 scale)"]

    N --> O["Draft CourtOpinion"]
    O --> P["ruling + rationale + principlesApplied"]
    P --> Q["Status → RESOLVED"]

    R{Appeal Filed?}
    R -->|Yes| S["Appeal Review"]
    S --> T["Re-examine with expanded analysis"]
    T --> U["Appeal Opinion → APPEAL_RESOLVED"]
    R -->|No| V["Case Closed"]

    Q --> W["Store as Precedent"]
    W --> X["Future disputes reference this case"]

    style A fill:#6366f1,color:#fff
    style L fill:#f59e0b,color:#fff
    style W fill:#10b981,color:#fff
```

## Key Code References

| Service | File | Purpose |
|---------|------|---------|
| **CollapseOrchestrator** | `collapse/CollapseOrchestrator.ts` | 18 agents across 7 categories, dual-track deliberation, hard blocks on civil liberties |
| **BaseCollapseAgent** | `collapse/agents/BaseCollapseAgent.ts` | Abstract base for all collapse agents |
| **SCGEOrchestrator** | `scge/SCGEOrchestrator.ts` | Seeded simulation, 6 phases, audit packets with Merkle roots |
| **SyntheticPopulation** | `scge/SyntheticPopulationService.ts` | Demographic generation for simulation |
| **PolicyInjection** | `scge/PolicyInjectionService.ts` | Policy templates and activation |
| **EventInjection** | `scge/EventInjectionService.ts` | Event triggers during simulation |
| **StressorLibrary** | `scge/StressorLibraryService.ts` | Predefined stress scenarios |
| **SGASOrchestrator** | `sgas/SGASOrchestrator.ts` | 5-class agent execution, directed graph, deterministic hashing |
| **DecisionAgents** | `sgas/DecisionAgentsService.ts` | Class I: Analysis and recommendation |
| **InstitutionalAgents** | `sgas/InstitutionalAgentsService.ts` | Class II: Compliance and mandate checks |
| **AdversarialAgents** | `sgas/AdversarialAgentsService.ts` | Class III: Attack and exploit finding |
| **ObserverAgents** | `sgas/ObserverAgentsService.ts` | Class IV: Anomaly and fairness detection |
| **MetaGovernanceAgents** | `sgas/MetaGovernanceAgentsService.ts` | Class V: Meta-level quality assessment |
| **AIConstitutionalCourt** | `governance/AIConstitutionalCourtService.ts` | Dispute filing, precedent DB, binding opinions, appeals |
