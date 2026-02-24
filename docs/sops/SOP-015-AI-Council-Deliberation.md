# SOP-015: AI Council Deliberation Process

**Category:** AI Operations
**Priority:** High
**Owner:** AI/ML Lead
**Last Verified:** 2026-02-22 (against `COMPLETE_SERVICE_MATRIX.md`, `backend/src/routes/council.ts`)

---

## 1. Purpose

Define the standard operating procedure for initiating, managing, and reviewing AI Council deliberations within the Datacendia Cortex platform.

---

## 2. AI Council Architecture

### 2.1 Core Council (14 Agents — Included)
| Agent | Code | Model | Primary Function |
|-------|------|-------|-----------------|
| Chief Strategy | `chief` | llama3.3:70b | Strategic synthesis, orchestration |
| CFO | `cfo` | llama3.3:70b | Financial analysis, ROI |
| COO | `coo` | llama3.2:3b | Operations, process efficiency |
| CISO | `ciso` | qwq:32b | Security, compliance |
| CMO | `cmo` | llama3.3:70b | Market analysis |
| CRO | `cro` | llama3.3:70b | Revenue optimization |
| CDO | `cdo` | qwen2.5-coder:32b | Data governance |
| Risk | `risk` | qwq:32b | Enterprise risk |
| CLO | `clo` | qwq:32b | Legal intelligence |
| CPO | `cpo` | llama3.3:70b | Product strategy |
| CAIO | `caio` | qwq:32b | AI governance |
| CSO | `cso` | llama3.3:70b | Sustainability |
| CIO | `cio` | llama3.3:70b | Investment intelligence |
| CCO | `cco` | llama3.2:3b | Communications |

### 2.2 Premium Agent Packs
| Pack | Agents | Industries |
|------|--------|------------|
| Audit Excellence | External Auditor, Internal Auditor | All |
| Healthcare | CMIO, Patient Safety, Compliance, Clinical Ops | Healthcare |
| Finance | Quant Analyst, Portfolio Mgr, Credit Risk, Treasury | Finance |
| Legal | Contract Specialist, IP Counsel, Litigation, Regulatory | Legal |

---

## 3. Deliberation Lifecycle

### 3.1 Phase 1: Decision Submission
1. User submits decision question via Cortex UI (`/cortex/council`)
2. Decision is assigned a unique ID: `DEC-<timestamp>`
3. Context is collected: domain, stakeholders, budget, timeline
4. Decision is routed to the appropriate agent subset

### 3.2 Phase 2: Agent Analysis
1. Each assigned agent receives the decision context + their system prompt
2. Agents analyze independently using their specialized model
3. Each agent produces:
   - Analysis summary
   - Confidence score (0–1)
   - Risk assessment
   - Recommendation (approve / defer / reject)
   - Supporting evidence

### 3.3 Phase 3: Deliberation
1. Agent responses are collected and compared
2. Consensus calculation:
   - Weighted average of confidence scores
   - Dissent detection (agents who disagree with majority)
   - Risk factor aggregation
3. Trust Delta calculated (consensus confidence vs. collapse risk)

### 3.4 Phase 4: Decision Packet Generation
1. Full deliberation record created:
   - All agent analyses
   - Consensus/dissent summary
   - Trust Delta score
   - Risk factors and mitigations
   - Merkle root for integrity verification
2. Decision packet stored in CendiaLedger™
3. Optional: Regulator's Receipt generated (see SOP-019)

### 3.5 Phase 5: Human Review
1. Decision packet presented to human decision-maker
2. Human can: **Accept**, **Override** (with justification), or **Defer**
3. Override triggers CendiaResponsibility™ accountability chain (see SOP-026)
4. Final decision recorded with non-repudiable timestamp

---

## 4. Initiating a Deliberation

### 4.1 Via UI
1. Navigate to `/cortex/council`
2. Enter decision question and context
3. Select participating agents (or use default: all core agents)
4. Click "Begin Deliberation"
5. Monitor real-time progress

### 4.2 Via API
```bash
curl -X POST http://localhost:3001/api/v1/council/deliberation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "decisionId": "DEC-20260222-001",
    "question": "Should we expand into the APAC market in Q3?",
    "context": {
      "domain": "Strategic",
      "budget": 5000000,
      "timeline": "6 months",
      "stakeholders": ["Board", "Sales", "Legal"]
    },
    "agents": ["chief", "cfo", "clo", "cro", "risk"]
  }'
```

---

## 5. Council Modes

| Mode | Description | Use Case |
|------|-------------|----------|
| **Standard** | All agents deliberate | General decisions |
| **Collapse** | Adversarial red-team (18 agents) | Policy stress-testing (see SOP-022) |
| **Ghost Board** | Virtual board meeting simulation | Board preparation |
| **Pre-Mortem** | Failure analysis before deciding | Risk assessment |
| **Consensus Builder** | Multi-stakeholder alignment | Conflict resolution |

---

## 6. Quality Assurance

### 6.1 Deliberation Integrity
- Every deliberation generates a **Merkle root** hash
- Deliberations are **replayable** using the seed value
- All agent responses are captured verbatim
- Timestamps are RFC 3161 compliant (see SOP-020)

### 6.2 Monitoring
- Deliberation history: `/cortex/council` → Recent Deliberations
- Agent performance: response times, confidence accuracy
- Dissenter accuracy tracking (CendiaSimilarity™)

---

## 7. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Deliberation hangs | Ollama model loading slowly | Wait or switch to faster model |
| Agent returns empty | Model not pulled | `ollama pull <model>` |
| Low confidence scores | Insufficient context | Provide more decision context |
| All agents agree | Possible groupthink | Enable Collapse mode for adversarial testing |
| Timeout error | Large model, complex prompt | Increase timeout or use fast model slot |

---

## 8. Verified Against

- `COMPLETE_SERVICE_MATRIX.md`: 14 core agents, 6 premium packs
- `backend/src/routes/council.ts`: Deliberation API endpoints
- `backend/src/config/aiModels.ts`: Agent-to-model mapping
- `src/pages/cortex/council/CouncilPage.tsx`: UI deliberation interface
- `src/routes/cortex/core.routes.tsx`: Council route definition
- 44 Council Flow Tests: 100% passing

---

*Datacendia, LLC — Proprietary and Confidential*
