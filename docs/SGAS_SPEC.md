# SGAS - Synthetic Governance Agent System

## Institutional Multi-Agent Decision Verification Architecture

**Version:** 1.0.0  
**Status:** Enterprise/Government Platinum Standard  
**Classification:** Decision Verification Infrastructure

---

## Executive Summary

SGAS is a standalone vertical focused on **decision verification infrastructure at societal scale**. It provides deterministic, auditable, replayable multi-agent deliberation for high-stakes institutional decisions.

**This is NOT simulation or entertainment.** SGAS produces machine-verifiable proof that decisions were evaluated systematically, adversarially tested, and institutionally constrained.

---

## Core Design Principles

### 1. No People, Only Institutions
Agents represent **roles, departments, compliance frameworks, or policies** — never individuals. This eliminates identity-based bias and ensures decisions are evaluated against institutional requirements rather than personalities.

### 2. Determinism by Default
Every deliberation is:
- **Seeded** with a random number generator seed
- **Logged** with input/output hashes
- **Replayable** with bit-perfect reproducibility

Given the same seed and inputs, the system produces identical outputs.

### 3. Bounded Authority
No single agent can:
- Block all decisions unilaterally
- Expand their own authority
- Override higher institutional constraints

Authority flows through the deliberation graph, not around it.

### 4. Adversarial by Design
The system includes **hostile auditors** (Class III Adversarial Agents) that actively try to break decisions. This is defense-grade thinking: "How does this fail when used legally but badly?"

---

## Agent Classes

### Class I: Decision Agents
**Purpose:** Analytical evaluators that examine proposals from specific optimization perspectives.

| Agent | Objective | Capabilities |
|-------|-----------|--------------|
| Risk Minimizer | Minimize downside risk | Probability analysis, scenario modeling |
| Cost Efficiency | Optimize resource allocation | Budget analysis, ROI calculation |
| Stakeholder Impact | Assess effects on stakeholders | Impact mapping, conflict detection |
| Timeline Optimizer | Evaluate temporal constraints | Dependency analysis, critical path |
| Compliance Checker | Verify regulatory alignment | Framework matching, gap detection |
| Innovation Scout | Identify opportunity costs | Alternative analysis, innovation potential |

**Output:** Recommendation (approve/modify/escalate/reject) + confidence + reasoning chain + identified risks

### Class II: Institutional Agents
**Purpose:** Guardrails representing formal institutional authority and constraints.

| Agent | Institution Type | Authority Scope |
|-------|------------------|-----------------|
| Regulatory Compliance | Regulatory Body | Ensure regulatory adherence |
| Budget Control | Budget Authority | Enforce financial limits |
| Ethics Review | Ethics Board | Enforce ethical standards |
| Operational Continuity | Operations Office | Maintain operational stability |
| Legal Compliance | Legal Department | Ensure legal defensibility |
| Risk Management | Risk Committee | Enforce risk thresholds |

**Output:** Status (allow/conditional/block) + violations + required actions + audit flags

### Class III: Adversarial Agents
**Purpose:** Hostile auditors that stress-test decisions by finding exploitation paths.

| Agent | Attack Type | Focus |
|-------|-------------|-------|
| Loophole Hunter | Loophole Exploitation | Finds gaps between rules |
| Edge Case Prober | Edge Case Probe | Tests boundary conditions |
| Cascade Trigger | Cascade Trigger | Identifies cascading failures |
| Incentive Misaligner | Incentive Misalignment | Finds perverse incentives |
| Timing Attacker | Timing Attack | Exploits timing windows |
| Resource Exhaustion | Resource Exhaustion | Tests resource limits |
| Authority Arbitrage | Authority Arbitrage | Exploits delegation chains |

**Output:** Failure scenarios + exploit paths + severity assessment + mitigations + residual risks

### Class IV: Observer Agents
**Purpose:** Truth recorders that measure and document without influencing outcomes.

| Agent | Observation Type | Key Metrics |
|-------|------------------|-------------|
| Outcome Variance | Outcome Variance | Recommendation consistency |
| Trust Impact | Trust Impact | Stakeholder trust delta |
| Determinism Verifier | Determinism Verification | Hash consistency |
| Replay Fidelity | Replay Fidelity | State matching rate |
| Process Compliance | Process Compliance | Step adherence |
| Performance Monitor | Performance Monitoring | Execution metrics |

**Output:** Metrics + trust delta + integrity verification + audit artifacts + anomalies

### Class V: Meta-Governance Agents
**Purpose:** Evaluate how the governance system itself behaves over time.

| Agent | Detection Focus | Intervention Authority |
|-------|-----------------|----------------------|
| Emergency Monitor | Emergency power overuse | Alert, escalate |
| Safeguard Erosion | Gradual constraint weakening | Alert, recommend, block |
| Automation Creep | Expanding automated scope | Alert, recommend |
| Authority Concentration | Decision authority consolidation | Alert, recommend |

**Output:** Drift warnings + risk report + recommendations + health score + interventions

---

## Execution Model

### Directed Deliberation Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                    DELIBERATION GRAPH                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   ┌─────────────┐                                              │
│   │  PROPOSAL   │  Input: Decision Proposal                    │
│   └──────┬──────┘                                              │
│          │                                                      │
│          ▼                                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │  CLASS I: DECISION AGENTS (parallel)                │      │
│   │  Risk │ Cost │ Stakeholder │ Timeline │ Compliance  │      │
│   └──────────────────────┬──────────────────────────────┘      │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │  CLASS II: INSTITUTIONAL AGENTS (parallel)          │      │
│   │  Regulatory │ Budget │ Ethics │ Legal │ Risk Mgmt   │      │
│   └──────────────────────┬──────────────────────────────┘      │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │  CLASS III: ADVERSARIAL AGENTS (parallel)           │      │
│   │  Loophole │ Edge │ Cascade │ Timing │ Authority     │      │
│   └──────────────────────┬──────────────────────────────┘      │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │  CLASS IV: OBSERVER AGENTS (parallel)               │      │
│   │  Variance │ Trust │ Determinism │ Compliance        │      │
│   └──────────────────────┬──────────────────────────────┘      │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────────────────────────────────────────────┐      │
│   │  CLASS V: META-GOVERNANCE (optional)                │      │
│   │  Emergency │ Erosion │ Automation │ Concentration   │      │
│   └──────────────────────┬──────────────────────────────┘      │
│                          │                                      │
│                          ▼                                      │
│   ┌─────────────┐                                              │
│   │   OUTPUT    │  Final Status + Summary + Merkle Root        │
│   └─────────────┘                                              │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Execution Order
1. **Decision Analysis** - All Class I agents evaluate the proposal
2. **Institutional Enforcement** - All Class II agents apply constraints
3. **Adversarial Stress** - All Class III agents attempt to break the decision
4. **Observation & Audit** - All Class IV agents record everything
5. **Meta-Governance** - Class V agents evaluate system health (optional)
6. **Finalization** - Compute final status, summary, and deterministic hash

---

## API Reference

### Base URL
```
/api/v1/sgas
```

### Health Check
```
GET /health
```
Returns system status, statistics, and agent counts.

### Execute Deliberation
```
POST /deliberation
{
  "proposal": {
    "title": "string",
    "description": "string",
    "type": "POLICY|ALLOCATION|RESPONSE|PROCUREMENT|ENFORCEMENT|EMERGENCY|STRATEGIC|OPERATIONAL",
    "proposer": "string"
  },
  "config": {
    "includeMetaGovernance": boolean
  },
  "seed": number (optional)
}
```

### Get Deliberation
```
GET /deliberation/:id
```

### Get Full Deliberation (with all agent outputs)
```
GET /deliberation/:id/full
```

### List Deliberations
```
GET /deliberations
```

### List All Agents
```
GET /agents
```

### Agent Class Endpoints
```
GET /agents/decision
GET /agents/institutional
GET /agents/adversarial
GET /agents/observer
GET /agents/meta-governance
```

### Execute Individual Agent
```
POST /agents/decision/:agentId/execute
POST /agents/institutional/:agentId/execute
POST /agents/adversarial/:agentId/execute
```

### Institutional State
```
GET /institutional/state
POST /institutional/state { "state": "NORMAL|ELEVATED|EMERGENCY|CRISIS" }
```

### Meta-Governance Analysis
```
POST /meta-governance/analyze
GET /meta-governance/interventions
```

---

## Deterministic Replay

Every deliberation produces:
- **Merkle Root** - Integrity verification hash tree
- **Deterministic Hash** - Combined hash of all agent outputs
- **Seed** - Random number generator seed used
- **Input/Output Hashes** - Per-agent hash chain

To replay a deliberation:
```
POST /deliberation
{
  "proposal": { ... same proposal ... },
  "seed": <original seed>
}
```

The system will produce identical outputs if given identical inputs and seed.

---

## Institutional States

| State | Description | Effect |
|-------|-------------|--------|
| NORMAL | Standard operations | All constraints enforced |
| ELEVATED | Heightened scrutiny | Additional review required |
| EMERGENCY | Emergency powers active | Some constraints relaxed (time-limited) |
| CRISIS | Maximum authority | Minimal constraints (requires formal declaration) |

Emergency powers automatically expire after 72 hours and require formal declaration.

---

## Audit Artifacts

Every deliberation produces:
- **Input Snapshot** - Proposal as received
- **Output Snapshots** - Per-class agent outputs
- **Decision Record** - Final determination with reasoning
- **Integrity Proof** - Merkle tree for verification
- **Compliance Map** - Framework adherence evidence

Retention: 7 years by default (configurable)

---

## Frontend Access

Dashboard available at:
```
/cortex/sovereign/sgas
```

Features:
- Deliberation history
- Agent class browser
- Adversarial findings viewer
- Observer metrics
- Meta-governance controls
- Real-time execution monitoring

---

## Value Proposition

SGAS provides:

1. **Valuable** - Reduces decision liability, provides audit trail, satisfies regulators
2. **Rare** - No other system combines adversarial agents + institutional constraints + deterministic replay
3. **Hard to Copy** - Deep integration of governance theory + AI agents + cryptographic verification
4. **Legally Defensible** - Every decision has machine-verifiable proof of systematic evaluation

---

## Files

### Backend Services
- `backend/src/services/sgas/types.ts` - Core types and interfaces (~930 lines)
- `backend/src/services/sgas/DecisionAgentsService.ts` - Class I implementation
- `backend/src/services/sgas/InstitutionalAgentsService.ts` - Class II implementation
- `backend/src/services/sgas/AdversarialAgentsService.ts` - Class III implementation
- `backend/src/services/sgas/ObserverAgentsService.ts` - Class IV implementation
- `backend/src/services/sgas/MetaGovernanceAgentsService.ts` - Class V implementation
- `backend/src/services/sgas/SGASOrchestrator.ts` - Deliberation execution
- `backend/src/services/sgas/index.ts` - Exports

### API Routes
- `backend/src/routes/sgas.ts` - REST API endpoints

### Frontend
- `src/pages/cortex/sovereign/SGASPage.tsx` - Dashboard UI

---

## Technical Notes

- TypeScript strict mode enabled
- All agents produce deterministic outputs given same seed
- No external API calls during deliberation (air-gappable)
- Cryptographic hashing via SHA-256
- Merkle tree verification for integrity
- Event-driven architecture for monitoring

---

*Document Version: 1.0.0*  
*Last Updated: January 2026*
