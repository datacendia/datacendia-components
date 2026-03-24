# DATACENDIA DEMO ENVIRONMENT SPECIFICATION
### Interactive Demo for Prospects, Investors, and Partners

---

## Demo Scenarios (Pre-Built)

### Scenario 1: Financial Services — $2.3B CRE Acquisition
- **Duration:** 5 minutes
- **Agents:** Credit Analyst, Risk Officer, Compliance (SR 11-7), CFO, Legal Counsel
- **What happens:** Council deliberation reveals 2.2% discount (not 22%), SR 11-7 blocking issue, $180M CET1 impact
- **Output:** Merkle-signed decision packet + Basel III capital adequacy report + regulator evidence export

### Scenario 2: Healthcare — Sepsis Prediction Tool Evaluation
- **Duration:** 5 minutes
- **Agents:** Clinical AI, Patient Safety Officer, FDA Regulatory, Ethics, Billing
- **What happens:** Patient Safety calculates 54.8% effective sensitivity (worse than manual). FDA flags SaMD Class II.
- **Output:** FDA-ready SaMD classification + clinical decision packet + consent ledger entry

### Scenario 3: Defense — HA/DR Mission Planning (UNCLASSIFIED)
- **Duration:** 5 minutes
- **Agents:** 8 JOPP agents (Mission Commander, Intel, Ops, Log, Comms, Legal, Threat, OPSEC)
- **What happens:** OPSEC Officer overturns "safer" COA. Legal flags LOAC concern. Intel downgrades confidence.
- **Output:** Mission decision packet + LOAC compliance evidence

### Scenario 4: Sports — €47M Player Transfer
- **Duration:** 3 minutes
- **Agents:** CMO (risk-adjusted pricing), Financial (FFP impact), Medical (injury history), Governance
- **What happens:** €9.2M added to effective cost. FFP breach warning at 72% wage ratio.
- **Output:** Transfer decision packet + FFP compliance report

### Scenario 5: EU Banking — Basel III Capital Adequacy
- **Duration:** 3 minutes
- **Interactive:** Input CET1 components → see real-time capital ratios, breach detection, stress test results
- **Output:** Full Basel III report with CRR article citations + MDA calculation

---

## Technical Requirements

### Minimum Demo Environment
| Component | Requirement |
|-----------|------------|
| RAM | 8GB (core profile) |
| CPU | 4 cores |
| Storage | 20GB |
| Docker | Docker Compose v2+ |
| AI Model | Ollama with llama3.2:3b (fast model for demos) |

### Demo Launch
```bash
# Clone and start demo
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components
docker compose -f docker-compose.demo.yml up

# Open http://localhost:5173
# Login: sarah.chen@acme.demo (dev auth bypass)
```

### Pre-Seeded Data
- **Acme Corporation** — 5 users, 6 Council agents
- **5 deliberations** (completed + in-progress)
- **8 decisions** with full audit trails
- **12 months of metrics** (governance dashboard)
- **Demo walkthroughs** for each scenario

---

## Demo Flow Guide (For Sales)

### 3-Minute Executive Demo
1. **0:00-0:30** — Show dashboard (decisions, compliance score, agent activity)
2. **0:30-1:30** — Run Scenario 1 or 4 (financial or sports — most visual)
3. **1:30-2:30** — Show decision packet (Merkle signature, timestamps, dissent)
4. **2:30-3:00** — Export regulator evidence packet (one-click)

### 15-Minute Technical Demo
1. **0:00-2:00** — Dashboard overview + platform scale (456 services, 205K tests)
2. **2:00-5:00** — Run financial scenario with full deliberation
3. **5:00-8:00** — Show decision packet internals (Merkle tree, signatures, reasoning chains)
4. **8:00-10:00** — Show compliance engine (Basel III ratios, EU AI Act classification)
5. **10:00-13:00** — Run defense scenario (air-gapped architecture discussion)
6. **13:00-15:00** — Q&A, discuss vertical-specific deployment

### 30-Minute Deep Dive
- Full technical walkthrough with customer's specific vertical
- Configure agents for their decision type
- Run deliberation with their domain data (if provided)
- Architecture discussion (deployment, integration, security)
- ROI discussion with calculator

---

## Screenshot Guide (For Marketing Materials)

### Key Screens to Capture
1. **Council Deliberation** — agents arguing, dissent highlighted
2. **Decision Packet** — Merkle signature, timestamps, approval chain
3. **Compliance Dashboard** — Basel III ratios, EU AI Act status
4. **Evidence Export** — regulator packet, court bundle
5. **Vertical Selection** — 30 verticals displayed
6. **Agent Activity** — real-time agent deliberation visualization
7. **DCII Score** — 9 primitives radar chart
8. **CendiaGateway** — AI governance proxy dashboard

---

**Contact for demo access:** Stuart Rainey — stuart.rainey@datacendia.com
