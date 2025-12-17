# Datacendia Platform Diagrams

> **TODO**: Create polished visual diagrams for external stakeholders before sharing.

---

## 1. Platform Architecture Diagram

**Flow**: User → UI → API → Pillars → Council → Ledger/Chronos

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           DATACENDIA PLATFORM                                │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│   ┌──────────┐                                                               │
│   │   USER   │                                                               │
│   └────┬─────┘                                                               │
│        │                                                                     │
│        ▼                                                                     │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                         FRONTEND (UI)                                 │  │
│   │  React + TypeScript • Real-time Dashboard • Multi-language           │  │
│   └────────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│                                    ▼                                         │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                          API GATEWAY                                  │  │
│   │  Express.js • Auth • Rate Limiting • WebSocket • REST                │  │
│   └────────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│        ┌───────────────────────────┼───────────────────────────┐            │
│        │                           │                           │            │
│        ▼                           ▼                           ▼            │
│   ┌─────────────┐           ┌─────────────┐           ┌─────────────┐       │
│   │  STRATEGY   │           │  OPERATIONS │           │   PEOPLE    │       │
│   │   PILLAR    │           │   PILLAR    │           │   PILLAR    │       │
│   ├─────────────┤           ├─────────────┤           ├─────────────┤       │
│   │ • Forecast  │           │ • Sentinel  │           │ • Union     │       │
│   │ • Chronos   │           │ • Autopilot │           │ • Persona   │       │
│   │ • Ghost Bd  │           │ • Mesh      │           │ • HR Intel  │       │
│   └──────┬──────┘           └──────┬──────┘           └──────┬──────┘       │
│          │                         │                         │              │
│          └─────────────────────────┼─────────────────────────┘              │
│                                    │                                         │
│                                    ▼                                         │
│   ┌──────────────────────────────────────────────────────────────────────┐  │
│   │                         COUNCIL OF AGENTS                             │  │
│   │  Multi-Agent Deliberation • Ollama LLM • Streaming Responses         │  │
│   │  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐        │  │
│   │  │Strategist│ │Operator │ │Analyst  │ │Advocate │ │Skeptic  │        │  │
│   │  └─────────┘ └─────────┘ └─────────┘ └─────────┘ └─────────┘        │  │
│   └────────────────────────────────┬─────────────────────────────────────┘  │
│                                    │                                         │
│                    ┌───────────────┴───────────────┐                        │
│                    ▼                               ▼                        │
│   ┌─────────────────────────────┐   ┌─────────────────────────────┐        │
│   │         LEDGER™             │   │         CHRONOS™            │        │
│   │  Immutable Decision Record  │   │   Time Machine Snapshots    │        │
│   │  Blockchain-style Hashing   │   │   Historical Comparison     │        │
│   └─────────────────────────────┘   └─────────────────────────────┘        │
│                                                                              │
├──────────────────────────────────────────────────────────────────────────────┤
│  DATA LAYER: PostgreSQL • Neo4j (Graph) • Redis (Cache) • Vector Store     │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Council Decision Flow Diagram

**Flow**: Query → Agents → Ethics/Vox/Veto → Final Recommendation → Ledger

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                         COUNCIL DECISION FLOW                                 │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                        USER QUERY                                    │    │
│   │   "Should we expand into the European market next quarter?"          │    │
│   └───────────────────────────────┬─────────────────────────────────────┘    │
│                                   │                                           │
│                                   ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                    PHASE 1: INITIAL ANALYSIS                         │    │
│   │                     (Parallel Agent Processing)                       │    │
│   │                                                                       │    │
│   │   ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │    │
│   │   │ STRATEGY │  │ FINANCE  │  │   RISK   │  │  MARKET  │            │    │
│   │   │  AGENT   │  │  AGENT   │  │  AGENT   │  │  AGENT   │            │    │
│   │   │          │  │          │  │          │  │          │            │    │
│   │   │ Growth   │  │ Capital  │  │ Threats  │  │ Competi- │            │    │
│   │   │ Strategy │  │ Analysis │  │ Analysis │  │ tion     │            │    │
│   │   └────┬─────┘  └────┬─────┘  └────┬─────┘  └────┬─────┘            │    │
│   │        │             │             │             │                   │    │
│   └────────┼─────────────┼─────────────┼─────────────┼───────────────────┘    │
│            │             │             │             │                        │
│            └─────────────┴──────┬──────┴─────────────┘                        │
│                                 │                                             │
│                                 ▼                                             │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                  PHASE 2: CROSS-EXAMINATION                          │    │
│   │                                                                       │    │
│   │   Agents challenge each other's assumptions and conclusions          │    │
│   │   ┌─────────────────────────────────────────────────────────┐       │    │
│   │   │  "Finance, how do you account for currency volatility?" │       │    │
│   │   │  "Risk, what about regulatory compliance in GDPR?"      │       │    │
│   │   └─────────────────────────────────────────────────────────┘       │    │
│   └───────────────────────────────┬─────────────────────────────────────┘    │
│                                   │                                           │
│                                   ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                    PHASE 3: GOVERNANCE CHECK                         │    │
│   │                                                                       │    │
│   │   ┌────────────┐    ┌────────────┐    ┌────────────┐                │    │
│   │   │   ETHICS   │    │    VOX     │    │    VETO    │                │    │
│   │   │   CHECK    │    │ (STAKEHLD) │    │   RULES    │                │    │
│   │   ├────────────┤    ├────────────┤    ├────────────┤                │    │
│   │   │ • Fairness │    │ • Employee │    │ • Budget   │                │    │
│   │   │ • Bias     │    │ • Customer │    │ • Policy   │                │    │
│   │   │ • Impact   │    │ • Partner  │    │ • Legal    │                │    │
│   │   │ • Legal    │    │ • Investor │    │ • Risk     │                │    │
│   │   └─────┬──────┘    └─────┬──────┘    └─────┬──────┘                │    │
│   │         │                 │                 │                        │    │
│   │         │   ┌─────────────┴────────────┐    │                        │    │
│   │         └───►  GOVERNANCE SYNTHESIS    ◄────┘                        │    │
│   │             │  Flags: ⚠️ Ethics concern │                            │    │
│   │             │  Veto: ❌ None triggered  │                            │    │
│   │             └─────────────┬─────────────┘                            │    │
│   └───────────────────────────┼──────────────────────────────────────────┘    │
│                               │                                               │
│                               ▼                                               │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                  PHASE 4: FINAL SYNTHESIS                            │    │
│   │                                                                       │    │
│   │   ┌─────────────────────────────────────────────────────────────┐   │    │
│   │   │              FINAL RECOMMENDATION                            │   │    │
│   │   ├─────────────────────────────────────────────────────────────┤   │    │
│   │   │  Decision: CONDITIONAL PROCEED                              │   │    │
│   │   │  Confidence: 78%                                            │   │    │
│   │   │  Key Conditions:                                            │   │    │
│   │   │   1. Secure €5M contingency for regulatory compliance       │   │    │
│   │   │   2. Establish local entity before Q2                       │   │    │
│   │   │   3. Hire EU-based legal counsel                            │   │    │
│   │   │  Dissent: Risk Agent recommends delay until H2              │   │    │
│   │   └─────────────────────────────────────────────────────────────┘   │    │
│   └───────────────────────────────┬─────────────────────────────────────┘    │
│                                   │                                           │
│                                   ▼                                           │
│   ┌─────────────────────────────────────────────────────────────────────┐    │
│   │                        LEDGER™ RECORD                                │    │
│   │                                                                       │    │
│   │   ┌─────────────────────────────────────────────────────────────┐   │    │
│   │   │  ID: DEC-2024-1204-0831                                     │   │    │
│   │   │  Hash: sha256:7f83b1657ff1fc53b92dc18148a1d65d...           │   │    │
│   │   │  Previous: sha256:a591a6d40bf420404a011733cfb7b1...         │   │    │
│   │   │  Timestamp: 2024-12-04T20:31:00Z                            │   │    │
│   │   │  Actors: [StrategyAgent, FinanceAgent, RiskAgent, ...]      │   │    │
│   │   │  Immutable: ✓                                               │   │    │
│   │   └─────────────────────────────────────────────────────────────┘   │    │
│   └─────────────────────────────────────────────────────────────────────┘    │
│                                                                               │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Diagram Tools to Consider

For polished external-facing diagrams:
- **Figma** – Best for custom, branded visuals
- **Lucidchart** – Professional flowcharts
- **Excalidraw** – Hand-drawn aesthetic
- **Mermaid** – Code-based, version-controllable
- **Draw.io** – Free, comprehensive

---

## Key Messaging Points

### Platform Architecture
- **Pillar-based organization** – Strategy, Operations, People
- **Single source of truth** – PostgreSQL as primary data store
- **AI-first** – Council of Agents for all major decisions
- **Immutable audit trail** – Every decision recorded in Ledger

### Council Decision Flow
- **Multi-agent deliberation** – Diverse perspectives, not single AI
- **Adversarial governance** – Ethics, Vox, Veto checks built-in
- **Transparency** – Full reasoning chain preserved
- **Accountability** – Blockchain-style immutable records
