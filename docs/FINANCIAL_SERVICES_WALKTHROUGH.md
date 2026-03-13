# Financial Services End-to-End Walkthrough

**From question to regulator-ready decision packet in 90 seconds.**

This walkthrough follows a realistic scenario through every stage of the Datacendia platform: submitting a question, watching agents deliberate, reading the cross-examination, and exporting a forensic-grade, independently verifiable decision packet. Every API call shown is real. Every agent response follows the actual system prompts defined in `FinancialAgents.ts`.

---

## The Scenario

This is the kind of decision that ends careers. A $2.3B acquisition, a board meeting tomorrow, and a CEO who wants to move fast.

You are the Chief Risk Officer at **Meridian National Bank**, a Tier 2 US bank with $48B in total assets. A distressed regional competitor is selling a $2.3B commercial real estate (CRE) loan portfolio at a 22% discount to book value. Your CEO wants to move fast. You need the Council's analysis before tomorrow's board meeting.

**Key facts:**
- Portfolio composition: 72% office, 18% retail, 10% industrial
- CRE office vacancy rate: 18.7% nationally, rising
- Current CET1 ratio: 11.2% (minimum: 7.0%, internal target: 10.5%)
- Post-acquisition CET1 estimate: ~9.8%
- Three loans totaling $340M are on the originator's watchlist
- Next CCAR submission: 6 months away
- Acquisition price: $1.79B ($2.3B book × 0.78 discount)

---

## Step 1: Start the Platform

> **Reading for the value proposition, not setup?** [Skip to Step 2 — the deliberation](#step-2-submit-the-question-to-the-capital-planning-council).

<details>
<summary><strong>Platform setup (click to expand)</strong></summary>

```bash
# Zero-config demo (if you haven't already)
docker compose -f docker-compose.demo.yml up

# Or development setup
docker compose -f docker-compose.unified.yml --profile core up -d
cd backend && npm run dev
```

The API is available at `http://localhost:3001`. The Financial Services vertical is loaded automatically with 14 agents and 25+ council modes.

```bash
# Get a demo auth token (dev mode — no password required)
export TOKEN=$(curl -s http://localhost:3001/api/v1/auth/dev-token \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah.chen@acme.demo"}' | jq -r '.token')
```

</details>

---

## Step 2: Submit the Question to the Capital Planning Council

```bash
curl -X POST http://localhost:3001/api/v1/council/deliberate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "question": "Should Meridian National Bank acquire the $2.3B CRE loan portfolio from First Regional Bank at the proposed terms? The portfolio is 72% office (vacancy rates rising), priced at 22% discount to book. Post-acquisition CET1 drops from 11.2% to ~9.8%. Three watchlist loans total $340M. CCAR submission is in 6 months.",
    "context": {
      "vertical": "financial",
      "councilMode": "capital-planning-council",
      "data": {
        "bank": "Meridian National Bank",
        "totalAssets": 48000000000,
        "currentCET1": 0.112,
        "postAcquisitionCET1": 0.098,
        "portfolioValue": 2300000000,
        "acquisitionPrice": 1790000000,
        "discount": 0.22,
        "composition": { "office": 0.72, "retail": 0.18, "industrial": 0.10 },
        "watchlistLoans": 340000000,
        "ccarMonths": 6,
        "officeVacancyRate": 0.187
      }
    },
    "config": {
      "maxRounds": 8,
      "enableCrossExamination": true,
      "requireConsensus": false,
      "minConfidenceThreshold": 0.7
      // 8 rounds — standard for regulatory deliberation with 4 agents
    }
  }'
```

**Response:**

```json
{
  "deliberationId": "dlb_8f3a2c1e-9b4d-4e6f-a1c2-3d4e5f6a7b8c",
  "status": "initial_analysis",
  "participatingAgents": [
    "risk-officer",
    "chief-investment-officer",
    "compliance-officer",
    "credit-analyst"
  ],
  "councilMode": "capital-planning-council",
  "regulatoryFrameworks": ["Basel III CET1", "CCAR", "Total Loss Absorbing Capacity"],
  "estimatedDurationSeconds": 45,
  "streamUrl": "ws://localhost:3001/ws/council/dlb_8f3a2c1e-9b4d-4e6f-a1c2-3d4e5f6a7b8c"
}
```

You can watch the deliberation live via WebSocket at the `streamUrl`, or poll for results.

---

## Step 3: Watch the Deliberation (Live Stream)

Connect to the WebSocket to see agents think in real time:

```javascript
const ws = new WebSocket('ws://localhost:3001/ws/council/dlb_8f3a2c1e...');

ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  console.log(`[${data.phase}] ${data.agentId}: ${data.content}`);
};
```

### Phase 1: Initial Analysis

Each agent analyzes the scenario independently. They don't see each other's work yet.

---

**Chief Risk Officer** (confidence: 0.35)

> **Risk Assessment: ELEVATED**
>
> I identify 8 material risk factors in this acquisition:
>
> 1. **Capital adequacy impact.** CET1 drops from 11.2% to 9.8%. While above the 7.0% regulatory minimum, this breaches our 10.5% internal target and leaves only 280bps of buffer. Under a CCAR severely adverse scenario, CET1 could breach minimum.
>
> 2. **CRE concentration risk.** Adding $2.3B in CRE to our existing $6.8B book pushes CRE concentration to approximately 188% of total capital. OCC Guidance 2006-46 flags banks exceeding 300% for enhanced scrutiny — we're approaching the threshold where examiners increase attention.
>
> 3. **Office vacancy correlation.** The 72% office weighting is the critical risk. National office vacancy at 18.7% understates the problem — in the portfolio's geographic markets (to be verified), it may be 22-25%. Default probability models trained on pre-pandemic data will underestimate this risk.
>
> 4. **CCAR timing.** With CCAR submission 6 months away, we would be integrating a $2.3B distressed portfolio while simultaneously running stress tests. The Fed will scrutinize any material acquisition completed within the CCAR window.
>
> 5. **Watchlist exposure.** $340M in watchlist loans represents 19% of the portfolio. Industry norm for performing CRE portfolios is 3-5%. This suggests the portfolio has significant embedded credit deterioration.
>
> 6. **Funding cost sensitivity.** Lower CET1 ratios historically increase wholesale funding spreads by 15-25bps. On our $12B wholesale funding base, that's $18-30M annually.
>
> 7. **Correlation risk.** Office, retail, and industrial CRE are correlated in a recession. The apparent diversification within the portfolio overstates actual risk reduction.
>
> 8. **Model risk.** Any acquisition model used to price this portfolio requires independent validation under SR 11-7. Have we completed this? If not, we cannot rely on the 22% discount as meaningful.
>
> **Preliminary position: REJECT at current terms.** The capital impact combined with CCAR timing creates unacceptable regulatory risk.

---

**Chief Investment Officer** (confidence: 0.68)

> **Investment Thesis: CONDITIONAL PROCEED**
>
> The strategic case for this acquisition is compelling despite the risks:
>
> 1. **Entry price.** $1.79B for $2.3B book value represents a 22% discount. Even after aggressive haircuts on the watchlist loans (assuming 50% recovery = $170M write-down), the adjusted price is $1.79B for ~$1.96B adjusted book — still a 9% discount.
>
> 2. **Market positioning.** Acquiring CRE assets at distressed pricing positions Meridian for the recovery cycle. Banks that built CRE books during the 2009-2011 window generated 18-22% returns through the cycle.
>
> 3. **Industrial allocation.** The 10% industrial component ($230M) is actually the most attractive segment — industrial CRE has 4.2% vacancy nationally and is benefiting from reshoring trends.
>
> 4. **Optionality value.** Office-to-residential conversion is becoming viable in select markets. If even 20% of the office book is convertible, that's $330M in potential value creation over 5 years.
>
> 5. **Competitive dynamics.** If we pass, a larger bank will acquire this portfolio. We lose the opportunity and gain a better-capitalized competitor in our market.
>
> **Preliminary position: PROCEED** with enhanced due diligence on the watchlist loans and a negotiated price reduction to offset the capital impact.

---

**Compliance Officer** (confidence: 0.52)

> **Regulatory Analysis: CAUTION REQUIRED**
>
> Applicable regulatory frameworks and findings:
>
> | Framework | Status | Finding |
> |-----------|--------|---------|
> | **Basel III CET1** | ⚠️ | Post-acquisition 9.8% exceeds 7.0% minimum but breaches 10.5% internal target. Capital conservation buffer (2.5%) is maintained. |
> | **CCAR (12 CFR 252.54)** | 🔴 | Material acquisition within CCAR window will draw examiner scrutiny. Fed expects banks to maintain capital planning discipline during the cycle. |
> | **OCC 2006-46** | ⚠️ | CRE concentration approaching 300% threshold. Enhanced risk management expectations apply. |
> | **SR 11-7** | 🔴 | Acquisition pricing model requires independent validation. No evidence this has been completed. |
> | **TLAC (12 CFR 252.63)** | ⚠️ | Total loss-absorbing capacity must be reassessed post-acquisition. |
> | **Dodd-Frank §165** | ✅ | Enhanced prudential standards — current compliance maintained. |
>
> **Critical gap:** SR 11-7 requires that any model used for material decision-making undergo independent validation *before* the decision is made. If the acquisition pricing model has not been independently validated, proceeding creates a regulatory finding.
>
> **Preliminary position: CANNOT APPROVE** until SR 11-7 model validation is complete. Thereafter, conditional approval subject to capital restoration plan.

---

**Credit Analyst** (confidence: 0.41)

> **Credit Assessment: BELOW INVESTMENT GRADE**
>
> Portfolio credit analysis:
>
> | Segment | Book Value | Est. Fair Value | Discount to Fair | PD (12-mo) | LGD |
> |---------|-----------|----------------|-----------------|-----------|-----|
> | Office (72%) | $1.66B | $1.24B | 25.3% | 8.2% | 45% |
> | Retail (18%) | $414M | $352M | 15.0% | 5.1% | 35% |
> | Industrial (10%) | $230M | $237M | -3.0% (premium) | 2.1% | 25% |
> | **Total** | **$2.30B** | **$1.83B** | **20.4%** | | |
>
> The seller's book value overstates fair value. At current cap rates:
> - Office: 7.5% cap rate (vs. 5.8% implied by book) → fair value ~$1.24B
> - The "22% discount to book" is actually a **2.2% discount to fair value** ($1.79B vs. $1.83B)
>
> **Watchlist analysis:** The $340M watchlist represents 3 loans:
> - $180M: Class B office, downtown, 34% vacancy, debt service coverage ratio 0.87×
> - $95M: Regional mall, anchor tenant departing Q3, refinancing uncertain
> - $65M: Mixed-use office, major tenant lease expiring, no renewal indication
>
> Combined expected loss on watchlist: $136M (40% average LGD on $340M)
>
> **Adjusted acquisition economics:**
> - Price: $1.79B
> - Fair value: $1.83B
> - Expected credit losses (year 1): $136M watchlist + $68M performing → $204M
> - **Net position: -$164M in year 1**
>
> **Preliminary position: REJECT** unless acquisition price is reduced to ≤$1.55B to adequately compensate for embedded credit risk.

---

### Phase 2: Cross-Examination

Agents now see each other's analysis and formally challenge specific claims. This is where the real value emerges.

---

**Chief Risk Officer → Chief Investment Officer:**

> **Challenge:** Your investment thesis compares this acquisition to 2009-2011 CRE purchases, but those were purchased at 40-60% discounts to book, not 22%. More critically, remote work had not structurally impaired office demand in 2009. The Credit Analyst's fair value analysis shows the actual discount is 2.2%, not 22%. How do you justify the risk/reward at this pricing?

**Chief Investment Officer → Chief Risk Officer (Rebuttal):**

> I accept the Credit Analyst's reframe on pricing — the 22% headline is misleading. However, my thesis rests on two points the CRO's analysis doesn't address:
>
> 1. **The industrial segment is mispriced in the portfolio.** At $230M, it's trading at a slight premium to fair value individually, but within a distressed portfolio deal, we're effectively getting industrial CRE at a discount via the blended price.
>
> 2. **Time arbitrage.** The seller is distressed and needs to close within 60 days. That negotiating leverage is worth more than the current discount suggests. I would support proceeding only if we renegotiate to $1.55-1.65B, which aligns with the Credit Analyst's recommended ceiling.
>
> **Revised position: CONDITIONAL PROCEED at $1.55-1.65B, not $1.79B.**

---

**Compliance Officer → All Agents:**

> **Cross-examination finding:** No agent has addressed the SR 11-7 requirement. Under Federal Reserve guidance, the acquisition pricing model — whatever methodology was used to arrive at $1.79B — must be independently validated before it can be relied upon for a material business decision. Has this validation been completed?
>
> If not, **every price discussed in this deliberation is unvalidated**, and proceeding creates an automatic regulatory finding at the next examination.

**Credit Analyst → Compliance Officer (Response):**

> The Compliance Officer raises a critical point. My fair value analysis used market cap rates and comparable transactions — this is a standard approach but it is itself a model under SR 11-7. For a $2.3B portfolio, the Fed would expect:
>
> 1. Independent model validation (not yet completed)
> 2. Backtesting against realized losses on similar portfolios
> 3. Challenger model comparison (e.g., DCF vs. cap rate vs. comparable sales)
> 4. Sensitivity analysis on key assumptions (vacancy rates, cap rates, recovery rates)
>
> **I amend my recommendation:** Before any price negotiation, commission the SR 11-7 validation. Estimated timeline: 4-6 weeks with an external validator.

---

### Phase 3: Synthesis

The Council Engine aggregates all positions, preserving dissent.

---

```json
{
  "deliberationId": "dlb_8f3a2c1e-9b4d-4e6f-a1c2-3d4e5f6a7b8c",
  "status": "completed",
  "durationMs": 47823,
  "confidenceScore": 0.58,
  "consensusReached": false,

  "synthesis": {
    "recommendation": "DO NOT PROCEED at current terms. Conditional path forward exists.",
    "summary": "The Council unanimously agrees that the acquisition cannot proceed at the proposed $1.79B price. The Credit Analyst's fair value analysis reveals the headline '22% discount' is illusory — actual discount to fair value is approximately 2.2%. The Compliance Officer identified a blocking regulatory issue: SR 11-7 model validation has not been completed, making any pricing analysis unreliable for regulatory purposes. The CRO's CCAR timing concern adds further risk.",

    "conditionalPath": {
      "description": "The CIO and Credit Analyst identified a conditional path forward if three requirements are met:",
      "requirements": [
        "1. Complete SR 11-7 independent model validation (4-6 weeks)",
        "2. Renegotiate acquisition price to ≤$1.55B (32.6% discount to book, 15.3% to fair value)",
        "3. Develop capital restoration plan to return CET1 to 10.5% within 12 months"
      ],
      "estimatedTimeline": "6-8 weeks before decision can be revisited"
    },

    "keyInsights": [
      "The 22% 'discount' to book value is misleading; fair value discount is only 2.2%",
      "SR 11-7 model validation is a regulatory prerequisite — proceeding without it creates an examination finding",
      "CCAR timing (6 months) makes this the worst possible window for a capital-depleting acquisition",
      "The industrial segment ($230M) is the most attractive component and could be pursued separately",
      "Watchlist expected losses of $204M in year 1 are not reflected in the acquisition price"
    ]
  },

  "dissent": [
    {
      "agentId": "chief-investment-officer",
      "position": "The conditional path should be pursued aggressively. The seller's distress creates a time-limited opportunity. If SR 11-7 validation takes 6 weeks, the seller may accept alternative buyers. Recommend parallel-tracking validation and price negotiation.",
      "confidence": 0.65
    }
  ],

  "regulatoryCompliance": {
    "frameworksCited": ["Basel III CET1", "CCAR 12 CFR 252.54", "OCC 2006-46", "SR 11-7", "TLAC 12 CFR 252.63"],
    "blockingIssues": ["SR 11-7 model validation not completed"],
    "warnings": ["CRE concentration approaching OCC scrutiny threshold", "CCAR timing risk"]
  },

  "agentVotes": {
    "risk-officer": { "vote": "reject", "confidence": 0.42 },
    "chief-investment-officer": { "vote": "conditional_approve", "confidence": 0.65 },
    "compliance-officer": { "vote": "reject", "confidence": 0.55 },
    "credit-analyst": { "vote": "reject", "confidence": 0.48 }
  }
}
```

---

### Phase 4: Ethics Check

Automated bias and fairness review:

```json
{
  "ethicsCheck": {
    "passed": true,
    "biasDetected": false,
    "fairnessScore": 0.94,
    "notes": [
      "No geographic or demographic bias detected in credit analysis",
      "Risk assessment appropriately weighted quantitative factors",
      "Dissenting view preserved — no suppression of minority position"
    ]
  }
}
```

The fairness check runs automatically on every financial deliberation, producing a documented record that credit analysis was not influenced by geographic proxy variables or prohibited borrower characteristics — directly relevant to OCC fair lending examination requirements and the Fed's increasing focus on algorithmic fairness in credit decisions. This record is included in the decision packet and is available to examiners on request.

---

## Step 4: Export the Decision Packet

Generate a regulator-ready evidence bundle:

```bash
curl -X POST http://localhost:3001/api/v1/council/decisions/dlb_8f3a2c1e.../export \
  -H "Authorization: Bearer $TOKEN" \
  -d '{ "format": "regulatory_packet", "includeTranscript": true }' \
  -o meridian_cre_decision_packet.pdf
```

**The decision packet contains:**

| Section | Contents |
|---------|----------|
| **Cover Page** | Decision title, date, participants, classification |
| **Executive Summary** | Synthesis recommendation with confidence score |
| **Agent Analyses** | Each agent's full initial analysis with timestamps |
| **Cross-Examination Transcript** | Every challenge, rebuttal, and amendment |
| **Dissenting Views** | Full text of preserved dissent with agent attribution |
| **Regulatory Compliance Map** | Every framework cited, blocking issues, warnings |
| **Vote Summary** | Each agent's final position and confidence |
| **Evidence Chain** | Merkle hash of every response for tamper detection |
| **Metadata** | Deliberation duration, token usage, model versions |

**Merkle verification:**

```bash
# Verify the decision packet hasn't been tampered with
curl http://localhost:3001/api/v1/council/decisions/dlb_8f3a2c1e.../verify

{
  "verified": true,
  "merkleRoot": "a3f8c2e1b4d6...",
  "responseCount": 12,
  "allHashesValid": true,
  "timestamp": "2026-02-27T12:34:56.789Z"
}
```

---

## Step 5: Check the Audit Trail

Every action is recorded in the immutable audit ledger:

```bash
curl http://localhost:3001/api/v1/audit/deliberation/dlb_8f3a2c1e... \
  -H "Authorization: Bearer $TOKEN"
```

```json
{
  "entries": [
    { "timestamp": "12:34:01.123", "action": "deliberation.created", "actor": "user:sarah.chen", "details": "Capital Planning Council initiated" },
    { "timestamp": "12:34:01.456", "action": "agent.assigned", "actor": "system", "details": "4 agents activated: risk-officer, chief-investment-officer, compliance-officer, credit-analyst" },
    { "timestamp": "12:34:02.100", "action": "phase.started", "actor": "system", "details": "Phase: initial_analysis" },
    { "timestamp": "12:34:12.891", "action": "agent.response", "actor": "agent:risk-officer", "details": "Initial analysis submitted, confidence: 0.35" },
    { "timestamp": "12:34:18.445", "action": "agent.response", "actor": "agent:chief-investment-officer", "details": "Initial analysis submitted, confidence: 0.68" },
    { "timestamp": "12:34:23.667", "action": "agent.response", "actor": "agent:compliance-officer", "details": "Initial analysis submitted, confidence: 0.52" },
    { "timestamp": "12:34:31.102", "action": "agent.response", "actor": "agent:credit-analyst", "details": "Initial analysis submitted, confidence: 0.41" },
    { "timestamp": "12:34:31.200", "action": "phase.started", "actor": "system", "details": "Phase: cross_examination" },
    { "timestamp": "12:34:35.891", "action": "agent.challenge", "actor": "agent:risk-officer", "details": "Challenged chief-investment-officer on 22% discount characterization" },
    { "timestamp": "12:34:39.234", "action": "agent.rebuttal", "actor": "agent:chief-investment-officer", "details": "Revised position: conditional proceed at $1.55-1.65B" },
    { "timestamp": "12:34:42.556", "action": "agent.challenge", "actor": "agent:compliance-officer", "details": "SR 11-7 blocking issue raised to all agents" },
    { "timestamp": "12:34:45.778", "action": "agent.amendment", "actor": "agent:credit-analyst", "details": "Amended recommendation: require SR 11-7 validation before any price negotiation" },
    { "timestamp": "12:34:46.000", "action": "phase.started", "actor": "system", "details": "Phase: synthesis" },
    { "timestamp": "12:34:48.891", "action": "deliberation.completed", "actor": "system", "details": "Recommendation: DO NOT PROCEED. Confidence: 0.58. Consensus: false. Duration: 47.8s" }
  ],
  "merkleRoot": "a3f8c2e1b4d6...",
  "entryCount": 14
}
```

---

## What Just Happened

In 48 seconds, the platform:

1. **Activated 4 specialized financial agents** — each with different mandates, expertise, and risk tolerances
2. **Produced 4 independent analyses** — the CRO found 8 risk factors, the CIO built an investment thesis, the Compliance Officer mapped 6 regulatory frameworks, the Credit Analyst modeled fair values
3. **Ran adversarial cross-examination** — the CRO challenged the CIO's pricing, the Compliance Officer flagged a blocking regulatory issue nobody else caught, the Credit Analyst revised their recommendation based on new information
4. **Preserved dissent** — the CIO's conditional approval position was recorded, not averaged away
5. **Generated a confidence score (0.58)** that emerged from the degree of disagreement between agents — not a single model's token probability
6. **Produced a Merkle-signed, tamper-evident decision packet** exportable as PDF for the board meeting or as JSON for downstream systems
7. **Logged every action** to an immutable audit trail that a bank examiner can review entry by entry

### The insight the board needs for tomorrow's meeting:

> "The 22% discount is misleading — our Credit Analyst calculates the actual discount to fair value is 2.2%. More critically, our Compliance Officer identified that we haven't completed the SR 11-7 model validation required before we can rely on *any* pricing analysis. Recommend pausing for 4-6 weeks for validation, then renegotiating to ≤$1.55B. The opportunity is real but the timing and price are wrong."

That insight — especially the SR 11-7 gap — is significantly less likely to surface from a single-model prompt. In [benchmark testing against the same scenario](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md), single-model inference identified 1 regulatory citation (Basel III in general terms) while the Council identified 6, including SR 11-7 specifically. The single model never flagged the model validation gap as a blocking issue. The Compliance Officer agent caught it because its entire mandate is to find regulatory gaps — that's deliberation working as designed.

---

## Available Council Modes for Financial Services

The Capital Planning Council used in this walkthrough is one of 8 pre-built financial council modes:

| Mode | Category | Lead Agent | Frameworks |
|------|----------|------------|------------|
| **Credit Committee** | Major | Risk Officer | Basel III/IV, SR 11-7, CECL |
| **Trade Approval Council** | Major | Compliance Officer | MiFID II, Dodd-Frank, Volcker, MAR |
| **AML War Room** | Major | Compliance Officer | BSA, AML, OFAC, FinCEN, FATF |
| **Portfolio Review Council** | Major | CIO | Reg BI, DOL Fiduciary, SEC IAA |
| **Model Validation Council** | Major | Risk Officer | SR 11-7, Basel III IRB, CCAR, DFAST |
| **Capital Planning Council** | Risk | Risk Officer | Basel III CET1, CCAR, TLAC |
| **Market Risk Council** | Risk | Risk Officer | Basel III FRTB, VaR Backtesting |
| **Operational Risk Event** | Risk | Risk Officer | Basel III OpRisk, RCSA |

Each mode activates the right agents, enforces the right regulatory frameworks, and produces outputs in the right format for that decision type. Custom council modes can be defined for any decision type.

---

## Try It Yourself

```bash
# Start the demo
docker compose -f docker-compose.demo.yml up

# Open the UI
open http://localhost:5173

# Or use the API directly
curl -X POST http://localhost:3001/api/v1/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{"question": "YOUR QUESTION HERE", "context": {"vertical": "financial", "councilMode": "credit-committee"}}'
```

---

*For the benchmark comparison between Council deliberation and single-model inference, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md).*
