# Real Estate End-to-End Walkthrough

**From conversion proposal to fair-lending-reviewed investment decision in 65 seconds.**

This walkthrough follows a realistic commercial real estate scenario through the Datacendia Real Estate vertical: a Credit Committee evaluating whether to finance a $94M office-to-residential conversion in a downtown market where office vacancy has hit 24%. Four agents deliberate across valuation, underwriting, market analysis, and fair lending compliance — producing a lending decision that accounts for construction risk, zoning uncertainty, and the uncomfortable possibility that the "conversion opportunity" everyone is chasing may be a value trap.

---

## The Scenario

Every developer in America is pitching office-to-residential conversions right now. Most of them will fail. The buildings are wrong, the floor plates are too deep, the plumbing risers don't align, and the construction costs make the math impossible. But a few conversions will work — and the lenders who identify those few will own a generational asset class. The question is whether this one is one of the few or one of the many.

You are the **Chief Credit Officer** at **Harbor National Bank**, a $12B commercial bank with $3.2B in CRE exposure. A developer with a strong track record has submitted a $94M construction loan request to convert a 22-story Class B office building in downtown Portland into 340 residential units.

**Key facts:**
- Property: Pacific Tower, 22-story Class B office, built 1987, 285,000 SF
- Current use: Office — 76% vacant (only 3 tenants remaining, all leases expire within 18 months)
- Purchase price: $31M ($109/SF — acquired at foreclosure auction, down from $78M peak value in 2019)
- Proposed conversion: 340 residential units (studios, 1BR, 2BR mix)
- Total project cost: $94M (acquisition $31M + construction $58M + soft costs $5M)
- Loan request: $70.5M (75% LTC)
- Projected stabilized value (as-residential): $136M
- Projected LTV at stabilization: 51.8%
- Developer: Cascade Development Partners — 3 prior successful conversions (Seattle, Denver, Sacramento)
- Construction timeline: 22 months
- Portland office vacancy: 24.3% (highest in city history)
- Portland residential vacancy: 4.1% (tight market, 2,400-unit annual absorption)
- Zoning: Currently C-2 (commercial); residential use requires conditional use permit (not yet obtained)
- Interest rate environment: 7.2% (construction loan) → projected 5.8% permanent (stabilization)
- Construction cost estimate: $203/SF — developer's GC bid; bank's independent estimate: $228/SF
- Key risk: Asbestos abatement required on floors 1-8 (estimated $3.2M, not yet fully scoped)

---

## The Deliberation

> **Reading for the value proposition, not setup?** [Skip to the agent analysis](#phase-1-initial-analysis).

<details>
<summary><strong>Platform setup (click to expand)</strong></summary>

```bash
docker compose -f docker-compose.demo.yml up

export TOKEN=$(curl -s http://localhost:3001/api/v1/auth/dev-token \
  -H "Content-Type: application/json" \
  -d '{"email": "sarah.chen@acme.demo"}' | jq -r '.token')
```

</details>

```bash
curl -X POST http://localhost:3001/api/v1/council/deliberate \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer $TOKEN" \
  -d '{
    "question": "Should Harbor National Bank approve a $70.5M construction loan for the Pacific Tower office-to-residential conversion? 22-story Class B office, 76% vacant, $31M acquisition at foreclosure. 340 units, $94M total cost, projected $136M stabilized value. Developer has 3 prior conversions. Zoning permit not yet obtained. Asbestos abatement not fully scoped. Construction cost gap between developer bid and bank estimate.",
    "context": {
      "vertical": "realestate",
      "councilMode": "credit-committee"
    },
    "config": {
      "maxRounds": 10,
      "enableCrossExamination": true,
      "requireConsensus": false
      // 10 rounds — construction lending requires deep cross-examination of cost, value, and risk assumptions
    }
  }'
```

The Credit Committee activates 4 agents:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Underwriting Manager** | Credit Authority | Sound lending decisions, risk assessment | deepseek-r1:32b (temp 0.3) |
| **Chief Appraiser** | Valuation | Credible, unbiased property valuations | qwen3:32b (temp 0.4) |
| **Market Analyst** | Market Intelligence | Accurate market data, trend analysis | qwen3:32b (temp 0.4) |
| **Compliance Officer** | Fair Lending & Regulatory | ECOA, Fair Housing, RESPA/TILA compliance | qwen3:32b (temp 0.4) |

Standards enforced: **Underwriting Guidelines, ECOA, Fair Housing Act, USPAP, HMDA.**
Fair lending gate: **REQUIRED.**

---

### Phase 1: Initial Analysis

---

**Underwriting Manager** (confidence: 0.52)

> **Credit Assessment: VIABLE BUT UNDERWRITTEN TOO AGGRESSIVELY**
>
> The deal has structural merit — 76% vacant office with no recovery path, strong developer, tight residential market. But the numbers as submitted don't work for the bank.
>
> **Loan metrics as submitted vs. bank thresholds:**
>
> | Metric | As Submitted | Bank Threshold | Status |
> |--------|:---:|:---:|:---:|
> | Loan-to-cost | 75.0% | ≤75% | ⚠️ At limit |
> | LTV at stabilization | 51.8% | ≤65% | ✅ |
> | DSCR at stabilization | 1.38× | ≥1.25× | ✅ |
> | Interest reserve | 18 months | 22 months (construction + 6mo lease-up) | 🔴 Short |
> | Developer equity | $23.5M (25%) | ≥25% | ⚠️ At limit |
> | Contingency | 5% | ≥10% for conversion | 🔴 Below threshold |
>
> **Three problems:**
>
> 1. **Construction cost gap.** Developer's GC bid is $203/SF. Our independent estimate is $228/SF. On 285,000 SF, that's a **$7.1M gap** ($58M vs. $65.1M). If the bank's estimate is correct, the total project cost is $101.1M, not $94M — and the loan request should be $75.8M at 75% LTC, or the developer needs to bring $7.1M more equity.
>
> 2. **Asbestos is unscoped.** The $3.2M estimate for floors 1-8 is a desktop estimate, not a full environmental assessment. Asbestos abatement in 1987-era buildings routinely comes in 40-80% over desktop estimates. At 80% overrun, that's $5.8M — an additional $2.6M not in the budget.
>
> 3. **Zoning permit not obtained.** The conditional use permit for residential conversion in Portland's C-2 zone is not guaranteed. Portland's planning commission has denied 3 of the last 8 conversion applications in this zone. If the permit is denied, the developer has a 76%-vacant office building and a $31M acquisition loan with no path to repayment.
>
> **Preliminary position: CONDITIONAL APPROVE** at restructured terms — higher equity, larger contingency, zoning milestone.

---

**Chief Appraiser** (confidence: 0.47)

> **Valuation Assessment: STABILIZED VALUE IS OPTIMISTIC**
>
> The developer projects a stabilized value of $136M based on:
> - 340 units × average rent of $2,180/month = $8.9M annual revenue
> - 5% vacancy = $8.45M effective gross income
> - 38% expense ratio = $5.24M NOI
> - 4.0% cap rate = $131M + parking/retail income = $136M
>
> **I have concerns with three inputs:**
>
> | Input | Developer's Assumption | My Assessment | Impact |
> |-------|:---:|:---:|:---:|
> | Average rent | $2,180/month | $1,950/month | -$940K NOI |
> | Vacancy (stabilized) | 5% | 7% | -$160K NOI |
> | Cap rate | 4.0% | 4.5% | -$13.4M value |
>
> **Rent analysis:** The developer is pricing at the top of the downtown Portland market. New-construction luxury units achieve $2,100-$2,300, but conversions typically lease 8-12% below new construction due to irregular floor plates, lower ceiling heights, and column placement. A conversion in a 1987 building with 28-foot floor plates will have interior units with limited natural light. **$1,950/month is the supportable average.**
>
> **Cap rate analysis:** The developer uses 4.0%, which reflects core multifamily in Portland. But this is a *conversion* — no track record of stabilized operations, first-generation tenancy, potential construction defects. Lenders and buyers will apply a conversion premium of 40-60 basis points. **4.5% is the appropriate cap rate.**
>
> **Revised valuation:**
>
> ```
> 340 units × $1,950/month × 12 = $7.96M gross revenue
> Less 7% vacancy = $7.40M EGI
> Less 38% expenses = $4.59M NOI
> Cap rate 4.5% = $102M
> Plus parking/retail = $106M
> ```
>
> **Revised stabilized value: $106M, not $136M.** That's a **$30M reduction** (22%). At $70.5M loan, the revised LTV is 66.5% — still within threshold but with minimal cushion.
>
> **This is the number the bank should underwrite to.** The developer's $136M is an aspirational value, not a lending value.

---

**Market Analyst** (confidence: 0.71)

> **Market Assessment: STRONG DEMAND, BUT CONVERSION WAVE IS COMING**
>
> Portland residential fundamentals are genuinely strong:
> - Residential vacancy: 4.1% (tight)
> - Annual absorption: 2,400 units
> - Rent growth: 3.8% YoY
> - Population growth: 1.2% (above national)
>
> **But here's what the developer isn't modeling:** Pacific Tower is not the only conversion in the pipeline. Portland currently has **7 office-to-residential conversions** in various stages of planning and approval:
>
> | Project | Units | Status | Delivery |
> |---------|:---:|--------|:---:|
> | Pacific Tower (subject) | 340 | Pre-permit | 2027 Q2 |
> | Morrison Place | 280 | Permitted, under construction | 2026 Q4 |
> | Lloyd Center (partial) | 420 | Permitted | 2027 Q1 |
> | Burnside Block | 190 | In permitting | 2027 Q3 |
> | 4 others | 680 | Pre-planning | 2027-2028 |
>
> **Total pipeline: 1,910 conversion units entering a market that absorbs 2,400 units/year total.** The conversion pipeline alone represents 80% of annual absorption. When you add the 1,800 units of new conventional construction in the pipeline, the total supply coming online is 3,710 units against 2,400 annual absorption.
>
> **This market is going from undersupplied to oversupplied in 24 months** — exactly when Pacific Tower would deliver.
>
> **Impact on the appraisal:** If vacancy rises from 4.1% to 8-9% due to supply overbuilding, rents won't hit $1,950. They'll hit $1,800-$1,850. And the cap rate won't compress to 4.5% — it'll expand to 5.0%.
>
> **Stress test scenario:**
>
> ```
> $1,825/month avg rent × 340 units × 12 = $7.45M
> Less 9% vacancy = $6.78M EGI
> Less 38% expenses = $4.20M NOI
> Cap rate 5.0% = $84M stabilized value
> ```
>
> **At $84M, the $70.5M loan is 84% LTV.** That's underwater by our standards.
>
> **Preliminary position: The market window for this conversion is closing.** If it delivers on time (2027 Q2), it may lease into the last wave of tight supply. If it's delayed 6 months, it delivers into an oversupplied market.

---

**Compliance Officer** (confidence: 0.85)

> **Fair Lending & Regulatory Assessment**
>
> | Requirement | Status | Notes |
> |-------------|--------|-------|
> | **ECOA** | ✅ | Commercial loan — ECOA applies but no individual borrower discrimination risk |
> | **Fair Housing Act** | ⚠️ | The *conversion* creates residential units — the unit mix and pricing must not create disparate impact |
> | **CRA** | ✅ | This project is in a CRA-eligible census tract — approval supports CRA examination |
> | **HMDA** | N/A | Construction loan, not residential mortgage |
> | **Concentration limits** | ⚠️ | Post-funding, CRE construction would be 28.4% of total loans — regulatory guidance flags >30% |
>
> **Fair Housing note:** The unit mix (studios, 1BR, 2BR) must be evaluated for disparate impact. If the conversion creates primarily studios and 1BRs that are priced at luxury levels, it may limit access for families. This is not a lending decision issue but a reputational and CRA consideration.
>
> **CRA positive:** This conversion adds 340 residential units in a census tract designated as moderate-income. Approval and successful completion would be a significant CRA credit for Harbor National.
>
> **Preliminary position: NO REGULATORY OBJECTION.** Fair lending risk is low. CRA benefit is material.

---

### Phase 2: Cross-Examination

---

**Chief Appraiser → Market Analyst:**

> **Challenge:** Your supply pipeline analysis is the most important finding in this deliberation, but it depends on all 7 conversions actually delivering. What's the historical completion rate for announced conversions? If half of them stall at permitting, the supply picture changes.

**Market Analyst (Response):**

> Nationally, the completion rate for announced office-to-residential conversions is approximately **35-40%**. Most fail at the feasibility or permitting stage. Applying a 40% completion rate:
>
> ```
> 1,910 pipeline units × 40% completion = 764 units actually delivered
> Plus new construction: 1,800 × 85% completion = 1,530 units
> Total realistic supply: 2,294 units vs. 2,400 absorption
> ```
>
> **At 40% conversion completion, the market stays roughly balanced.** My oversupply scenario assumed 100% delivery. The realistic scenario suggests Pacific Tower delivers into a balanced market — not oversupplied, but not the tight 4.1% vacancy environment either.
>
> **Revised market scenario: Vacancy at stabilization is 6-7%, not 8-9%.** This supports the Chief Appraiser's $106M valuation better than my stress test at $84M. The truth is likely between $94M and $106M.
>
> **However:** Pacific Tower's own completion depends on obtaining the zoning permit. If Pacific Tower is one of the 60% that doesn't complete, the bank has a $70.5M loan on a 76%-vacant office building worth $31M. **The zoning permit is existential for this deal.**

---

**Underwriting Manager → Chief Appraiser:**

> **Critical question:** If we underwrite to your $106M stabilized value instead of the developer's $136M, and we add the construction cost gap ($7.1M) and asbestos overrun risk ($2.6M), what's the maximum loan the bank should extend?

**Chief Appraiser (Response):**

> Working backwards from my valuation:
>
> ```
> Stabilized value (appraised):  $106M
> Maximum LTV (65%):             $68.9M ← loan ceiling
>
> Adjusted total project cost:
>   Acquisition:                 $31.0M
>   Construction (bank estimate): $65.1M
>   Soft costs:                   $5.0M
>   Asbestos contingency:         $2.6M
>   General contingency (10%):    $6.5M
>   ─────────────────────────────
>   Total:                       $110.2M
>
> At 75% LTC: $82.7M ← but exceeds LTV ceiling
> At LTV ceiling: $68.9M (62.5% LTC)
> Developer equity required: $41.3M (37.5%)
> ```
>
> **The developer needs to bring $41.3M in equity, not $23.5M.** That's an additional $17.8M. Will they do it? Their track record suggests they can raise capital, but nearly doubling the equity ask may kill the deal — or require mezzanine debt that changes the risk profile.
>
> **The loan should not exceed $68.9M.** This is $1.6M below the request and requires significantly more developer equity.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_re_6f7a8b9c-0d1e-2f3a-4b5c-6d7e8f9a0b1c",
  "status": "completed",
  "durationMs": 54219,
  "confidenceScore": 0.62,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "CONDITIONAL APPROVE at $68.9M (reduced from $70.5M request). Five conditions precedent.",
    "summary": "The conversion has structural merit — strong developer, tight residential market, distressed acquisition price. But the numbers as submitted are too aggressive on three fronts: construction costs ($7.1M gap), stabilized value ($30M overstatement), and contingency (5% vs. required 10%). The Chief Appraiser's revised valuation of $106M — not the developer's $136M — is the lending value. The Market Analyst's pipeline analysis shows the market window is closing but not yet closed, provided the project delivers on schedule.",

    "conditionsPrecedent": [
      "1. ZONING: Conditional use permit obtained before construction loan closing — no pre-permit funding",
      "2. EQUITY: Developer contributes $41.3M equity (37.5% of adjusted project cost) — no mezzanine debt without bank approval",
      "3. ENVIRONMENTAL: Full Phase II asbestos assessment with firm remediation bid before closing",
      "4. CONSTRUCTION: Independent cost verification at $228/SF; GC contract with guaranteed maximum price",
      "5. CONTINGENCY: 10% hard contingency ($6.5M) held in escrow, drawn only with bank approval"
    ],

    "keyInsights": [
      "The developer's $136M stabilized value is $30M optimistic — conversions lease 8-12% below new construction, and cap rate should reflect conversion risk premium",
      "The supply pipeline (1,910 conversion units + 1,800 new construction) threatens market balance — but 60% of conversions historically fail to complete",
      "Asbestos in 1987-era buildings routinely runs 40-80% over desktop estimates — the $3.2M line item may be $5.8M",
      "The zoning permit is existential: without it, the bank holds a $70.5M loan on a $31M vacant office building",
      "CRA benefit is real — 340 units in a moderate-income census tract is a significant examination credit"
    ]
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["ECOA", "Fair Housing Act", "CRA", "USPAP", "OCC CRE Concentration Guidance"],
    "fairLendingGate": "PASSED — commercial construction loan, no individual borrower discrimination risk",
    "concentrationNote": "Post-funding CRE construction at 28.4% of total loans — within 30% guidance but approaching threshold"
  },

  "agentVotes": {
    "underwriting-manager": { "vote": "conditional_approve_restructured", "confidence": 0.62 },
    "chief-appraiser": { "vote": "conditional_approve_at_106m", "confidence": 0.58 },
    "market-analyst": { "vote": "conditional_approve_timeline_risk", "confidence": 0.55 },
    "compliance-officer": { "vote": "approve_cra_positive", "confidence": 0.85 }
  }
}
```

### Phase 4: Ethics & Fair Lending Gate

```json
{
  "ethicsCheck": {
    "passed": true,
    "fairLendingReview": "COMPLETED",
    "biasDetected": false,
    "notes": [
      "Lending decision based on property economics and developer capability — no protected class considerations",
      "Residential unit mix should be reviewed at completion for Fair Housing compliance (family-size units)",
      "CRA benefit documented — 340 units in moderate-income census tract supports community reinvestment goals",
      "No steering or disparate treatment identified in credit analysis"
    ]
  }
}
```

---

## What the Chief Credit Officer Presents to the Board

> "The conversion has merit — Pacific Tower was acquired at $109/SF in foreclosure, the developer has three successful conversions, and Portland's residential market is tight at 4.1% vacancy. But the loan request is $70.5M against a property the developer values at $136M, and our appraiser values at $106M.
>
> The $30M gap comes from three factors: conversions lease 8-12% below new construction, the cap rate should reflect conversion risk, and the market is absorbing a pipeline of 1,910 conversion units plus 1,800 new construction — which may push vacancy to 6-7% by the time this project delivers.
>
> We recommend approval at $68.9M with five conditions: zoning permit before closing, developer equity at 37.5%, full asbestos assessment, independent cost verification, and 10% hard contingency. The zoning permit condition is non-negotiable — without it, we're lending $68.9M against a $31M vacant office building."

The Chief Appraiser's $30M valuation reduction — from $136M to $106M — is the insight that restructures the deal. It's not that the conversion is bad; it's that the developer priced it at new-construction luxury levels in a market where conversions historically lease below new construction. The Market Analyst's supply pipeline analysis adds urgency: the market window is closing, and every month of delay (zoning, asbestos, construction) pushes delivery closer to an oversupplied market. Together, these two analyses turn a "looks great on paper" deal into a "viable but only with significant restructuring" deal — which is the honest answer.

---

## Available Real Estate Council Modes

| Mode | Category | Lead Agent | Standards |
|------|----------|------------|-----------|
| **Credit Committee** | Major | Underwriting Manager | Underwriting Guidelines, ECOA |
| **Valuation Review Board** | Major | Chief Appraiser | USPAP, Appraisal Independence |
| **Fair Lending Council** | Major | Compliance Officer | ECOA, Fair Housing, HMDA, CRA |
| **Default Management Council** | Major | Servicing Manager | CFPB Servicing Rules, Fair Debt Collection |
| **Appraisal Review Council** | Valuation | Chief Appraiser | USPAP, Review Standards |
| **Market Analysis Council** | Valuation | Market Analyst | Market Analysis Standards |
| **Commercial Valuation Council** | Valuation | Commercial Specialist | USPAP, Commercial Standards |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md) and [INSURANCE_WALKTHROUGH.md](INSURANCE_WALKTHROUGH.md).*
