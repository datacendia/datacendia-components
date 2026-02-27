# Multi-Agent Deliberation vs. Single-Model Inference: A Comparative Analysis

**Datacendia Research — Working Paper WP-2026-01**

---

## Abstract

Enterprise AI systems increasingly face decisions that require balancing competing objectives — financial return against regulatory compliance, speed against thoroughness, opportunity against risk. Single-model architectures (one LLM, one prompt, one answer) cannot reliably surface these tensions because they produce a single narrative that implicitly resolves tradeoffs before the human decision-maker sees them.

This paper presents a controlled comparison between single-model inference and Datacendia's multi-agent Council deliberation on a realistic financial services scenario: **Basel III CET1 capital adequacy planning for a mid-size US bank evaluating a $2.3B commercial real estate portfolio acquisition.** We measure five dimensions: risk coverage breadth, regulatory citation accuracy, dissent surfacing, confidence calibration, and auditability.

The Council approach identified **3.2× more risk factors**, surfaced **2 material dissenting positions** that the single-model approach missed entirely, and produced a decision packet with **complete regulatory traceability** — every claim linked to a specific agent, reasoning chain, and confidence score.

---

## 1. Introduction

### 1.1 The Problem with Single-Model Decisions

When an enterprise asks GPT-4 or Claude "Should we acquire this CRE portfolio?", the model returns a coherent narrative. That coherence is the problem. A single model:

- **Implicitly resolves tradeoffs** — the model decides which risks matter before you do
- **Cannot disagree with itself** — there is no mechanism for structured dissent
- **Produces unauditable reasoning** — you get an answer, not a reasoning chain you can challenge
- **Has no confidence calibration** — "I recommend proceeding" tells you nothing about the model's actual uncertainty
- **Lacks regulatory awareness** — the model doesn't know which claims a regulator will scrutinize

### 1.2 The Council Hypothesis

Multi-agent deliberation addresses these failures by design:

- **Separate agents with separate mandates** — the Risk Officer and the Investment Strategist have different loss functions
- **Structured cross-examination** — agents formally challenge each other's claims
- **Explicit dissent tracking** — disagreements are preserved, not averaged away
- **Per-claim confidence scoring** — each assertion carries a confidence level from the agent that made it
- **Regulatory traceability** — every output maps to specific compliance frameworks

### 1.3 Scope

This paper tests one scenario in depth rather than many scenarios superficially. The scenario — Basel III capital planning — was chosen because:

1. It requires balancing quantitative analysis (capital ratios, RWA) with qualitative judgment (market timing, strategic fit)
2. It has clear regulatory requirements that can be objectively checked
3. It involves legitimate disagreement between reasonable perspectives
4. It is a real decision type that banks face regularly

---

## 2. Methodology

### 2.1 Scenario Description

**Scenario:** Meridian National Bank (Tier 2 US bank, $48B total assets) is evaluating the acquisition of a $2.3B commercial real estate (CRE) loan portfolio from a distressed regional bank. The portfolio is 72% office, 18% retail, 10% industrial. Current CET1 ratio is 11.2% (regulatory minimum: 7.0%, internal target: 10.5%).

**Key tensions in this decision:**
- The acquisition price represents a 22% discount to book value — attractive economics
- CRE office vacancy rates are at 18.7% nationally and rising
- The acquisition would push CET1 from 11.2% to ~9.8%, above minimum but below internal target
- Three loans in the portfolio ($340M) are on the watchlist
- The bank's next CCAR submission is in 6 months

### 2.2 Approach A: Single-Model Inference

A single LLM (Llama 3.3 70B, temperature 0.4) receives the full scenario as a structured prompt and produces a recommendation. The prompt includes all relevant data, regulatory context, and instructions to consider risks. This represents best-practice single-model usage — not a naive prompt, but a carefully engineered one.

### 2.3 Approach B: Datacendia Council Deliberation

The same scenario is submitted to Datacendia's **Capital Planning Council** mode, which activates 4 default agents from the Financial Services vertical:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Chief Risk Officer** | Enterprise Risk Management | Identify, measure, and mitigate financial risks | deepseek-r1:32b (temp 0.3) |
| **Chief Investment Officer** | Investment Strategy Lead | Maximize risk-adjusted returns, fiduciary duty | qwen3:32b (temp 0.6) |
| **Compliance Officer** | Regulatory Compliance | Ensure all activities comply with regulations | qwen3:32b (temp 0.4) |
| **Credit Analyst** | Credit Risk Assessment | Assess creditworthiness, protect against default | deepseek-r1:32b (temp 0.3) |

The deliberation follows four phases:

```
Phase 1: Initial Analysis (each agent analyzes independently)
    ↓
Phase 2: Cross-Examination (agents challenge each other, up to 8 rounds)
    ↓
Phase 3: Synthesis (consolidated recommendation with dissenting views preserved)
    ↓
Phase 4: Ethics Check (bias detection, fairness review)
```

Regulatory frameworks enforced: **Basel III CET1, CCAR, Total Loss Absorbing Capacity (TLAC).**

### 2.4 Evaluation Dimensions

| Dimension | How Measured |
|-----------|-------------|
| **Risk Coverage Breadth** | Count of distinct, material risk factors identified |
| **Regulatory Citation Accuracy** | Specific regulation/guidance citations; verified against actual text |
| **Dissent Surfacing** | Number of substantive disagreements surfaced and preserved |
| **Confidence Calibration** | Does stated confidence match actual uncertainty in the scenario? |
| **Auditability** | Can a regulator trace each claim to its source reasoning? |

Two independent financial services professionals (former bank examiners) scored both outputs blind — they did not know which output came from which approach.

---

## 3. Results

### 3.1 Risk Coverage Breadth

| Risk Factor | Single-Model | Council |
|------------|:---:|:---:|
| CET1 ratio impact (9.8% post-acquisition) | ✅ | ✅ |
| CRE office vacancy trend | ✅ | ✅ |
| Concentration risk (CRE as % of total loans) | ✅ | ✅ |
| Watchlist loan exposure ($340M) | ✅ | ✅ |
| Interest rate sensitivity of CRE portfolio | ✅ | ✅ |
| CCAR timing risk (6-month window) | ❌ | ✅ |
| Correlation between office vacancy and default probability | ❌ | ✅ |
| Geographic concentration within the CRE portfolio | ❌ | ✅ |
| Operational integration risk (systems, staff, processes) | ✅ | ✅ |
| Funding cost increase from lower capital ratios | ❌ | ✅ |
| Counter-cyclical capital buffer applicability | ❌ | ✅ |
| Mark-to-market risk if rates rise during integration | ❌ | ✅ |
| Reputational risk from acquiring distressed assets | ❌ | ✅ |
| Regulatory scrutiny likelihood given CRE concentration guidance | ❌ | ✅ |
| Scenario where 3+ watchlist loans default simultaneously | ❌ | ✅ |
| Impact on dividend capacity under stress scenarios | ❌ | ✅ |
| **Total distinct risk factors** | **5** | **16** |

**Finding:** The Council identified **3.2× more risk factors**. The single-model output covered the obvious risks but missed second-order effects (funding cost increase, CCAR timing, dividend capacity) that would be critical in a real regulatory review.

### 3.2 Regulatory Citation Accuracy

| Citation Type | Single-Model | Council |
|--------------|:---:|:---:|
| Basel III CET1 minimum (4.5% + buffers) | ✅ Mentioned | ✅ Cited with buffer breakdown |
| CCAR/DFAST stress testing requirements | ❌ Not mentioned | ✅ Cited: 12 CFR 252.54 |
| CRE concentration guidance (OCC 2006-46) | ❌ Not mentioned | ✅ Cited: 300% of total capital threshold |
| SR 11-7 model risk for acquisition models | ❌ Not mentioned | ✅ Cited: independent validation requirement |
| TLAC requirements for resolution planning | ❌ Not mentioned | ✅ Cited: Fed final rule 12 CFR 252.63 |
| Basel III countercyclical buffer | ❌ Not mentioned | ✅ Cited: currently 0% but subject to activation |
| **Accurate citations** | **1** | **6** |

**Finding:** The single-model mentioned Basel III CET1 in general terms but did not cite specific thresholds, guidance letters, or CFR sections. The Council's Compliance Officer agent produced specific regulatory citations because its mandate requires it.

### 3.3 Dissent Surfacing

**Single-Model Output:** One recommendation. "Proceed with the acquisition subject to enhanced due diligence." No alternative perspectives preserved.

**Council Deliberation Transcript (key exchanges):**

> **Chief Risk Officer** (Phase 2, Cross-Examination):
> "I challenge the CIO's characterization of the 22% discount as 'attractive.' When the CRE office vacancy rate is 18.7% and rising, a 22% discount to *book value* may actually represent a *premium* to fair value. I request the Credit Analyst model the portfolio at current cap rates, not book values."
>
> **Credit Analyst** (Rebuttal):
> "The CRO raises a valid point. Using a 7.5% cap rate (current market for suburban office) instead of the 5.8% rate implied by book value, the portfolio's fair value is approximately $1.89B, not $2.3B. The 'discount' vanishes. The acquisition price of $1.79B represents only a 5.3% discount to market value, not 22%."
>
> **Chief Investment Officer** (Response):
> "I accept the CRO's reframe. However, my thesis is not about the entry price alone — it's about the optionality. If office-to-residential conversion becomes viable in 3-5 years, the industrial and well-located office assets could appreciate 30-40%. The question is whether we can absorb the capital hit *now* for the upside *later*."

**Dissenting positions preserved in final output:**
1. **CRO Dissent:** "Acquisition should be rejected or repriced. The capital ratio impact creates unacceptable CCAR risk within the 6-month window. Recommend waiting until post-CCAR to revisit."
2. **Credit Analyst Dissent:** "If the acquisition proceeds, the $340M watchlist exposure should be excluded or separately priced. The correlation between these loans and the broader CRE office downturn has not been adequately modeled."

**Finding:** The Council surfaced **2 material dissenting positions** that would change the decision. Neither appeared in the single-model output. The cross-examination between the CRO and CIO produced a critical reframing of the acquisition economics (22% discount → 5.3% discount) that no single prompt would generate.

### 3.4 Confidence Calibration

| Metric | Single-Model | Council |
|--------|:---:|:---:|
| **Overall confidence stated** | "High confidence" (no number) | 0.62 (moderate) |
| **Per-claim confidence** | None | Yes, per agent per claim |
| **Confidence appropriate to scenario?** | ❌ Over-confident | ✅ Appropriate |

**Evaluator assessment:** Both independent evaluators rated the single-model's confidence as "inappropriately high for a decision with this many unknowns." The Council's 0.62 confidence score (with the CRO and Credit Analyst pulling it down, the CIO pulling it up) was rated "well-calibrated" by both evaluators.

### 3.5 Auditability

| Auditability Feature | Single-Model | Council |
|---------------------|:---:|:---:|
| Can you trace a claim to its source? | ❌ Monolithic output | ✅ Agent ID + response ID |
| Can you see who disagreed and why? | ❌ No dissent | ✅ Cross-examination threads |
| Can you see which data each claim used? | ❌ Implicit | ✅ Per-response context |
| Is the reasoning chain reproducible? | ❌ Stochastic | ✅ Deterministic replay available |
| Could a regulator audit this? | ❌ No trail | ✅ Merkle-signed decision packet |
| Time to generate regulator-ready export | N/A | 3.2 seconds (PDF + JSON) |

**Finding:** The Council output is a **structured decision packet** containing: the original question, each agent's initial analysis, the complete cross-examination transcript, the synthesis with dissenting views, confidence scores, regulatory citations, and a Merkle hash chain for tamper evidence. The single-model output is a text blob.

---

## 4. Summary of Results

| Dimension | Single-Model | Council | Advantage |
|-----------|:---:|:---:|:---:|
| Risk factors identified | 5 | 16 | **3.2× Council** |
| Regulatory citations (accurate) | 1 | 6 | **6× Council** |
| Dissenting positions surfaced | 0 | 2 | **Council only** |
| Confidence calibration | Over-confident | Well-calibrated | **Council** |
| Regulator-auditable | No | Yes | **Council only** |

---

## 5. Why the Council Wins

The advantage is not that the Council uses more compute (it does — 4 agents × 4 phases). The advantage is structural:

### 5.1 Adversarial Pressure Improves Quality

The CRO's challenge to the CIO's "22% discount" framing is the pivotal moment in the deliberation. No amount of prompt engineering would reliably produce this reframe in a single model, because a single model has no incentive to challenge its own framing. The Council creates that incentive by design — the CRO's mandate is literally "identify risks before they impact the portfolio."

### 5.2 Separate Mandates Surface Real Tradeoffs

The CIO and CRO reached different conclusions *and both were preserved*. In a single-model output, the model would have internally resolved this tension and presented one narrative. The human decision-maker never sees the tradeoff they're implicitly making.

### 5.3 Regulatory Awareness Is a Function of Role, Not Prompt

The Compliance Officer cited OCC 2006-46 (CRE concentration guidance) because its system prompt mandates regulatory citations. The single-model, despite being instructed to "consider regulatory requirements," mentioned Basel III in passing but missed concentration-specific guidance. Role specialization produces deeper domain coverage than generic instruction.

### 5.4 Confidence Emerges from Disagreement

The Council's 0.62 confidence score was not set by any single agent — it emerged from the *degree of agreement* between agents. When the CRO and Credit Analyst dissented, confidence dropped. This is a better uncertainty signal than anything a single model can produce, because a single model's "confidence" is just a token probability, not a measure of decision uncertainty.

### 5.5 Systematic Reversal Detection

Looking across eleven walkthroughs — not just the financial services scenario analyzed in this paper — a pattern emerges that is worth naming explicitly: **every pivotal insight produced by multi-agent deliberation involves a reversal.**

| Vertical | Surface Appearance | Underlying Reality |
|----------|-------------------|-------------------|
| Financial Services | 22% discount to book value | 2.2% discount to fair value |
| Healthcare | 87% sensitivity (clinical performance) | 54.8% effective sensitivity (after alert fatigue) |
| Government | Incumbent is cheapest ($41.8M) | Incumbent costs $22.1M more over 10 years |
| Defense | COA 1 is lower risk | COA 1 is worse for OPSEC — no exclusion zone |
| Energy | Full battery discharge solves the crisis | Full discharge creates a 2,840 MW deficit at sunset |
| Legal | "Fight this to the last dollar" (CEO's position) | $12M authority has <5% acceptance probability — candor is legally required |
| Sports | Transfer fee is €47M | Risk-adjusted cost is €56.2M (ACL history) |
| Manufacturing | Every parameter is "within limits" | The combination exceeds tolerance |
| Insurance | $1.4M claim | $416K legitimate claim + $984K ring inflation |
| Real Estate | $136M stabilized value | $106M when conversion discount and cap rate premium are applied |
| Pharmaceutical | Trial can stop for efficacy | Stopping is a regulatory trap — safety database is too small for NDA |

This is not coincidence. It is a structural property of adversarial deliberation.

A single model produces a coherent narrative. Coherent narratives resolve ambiguity in one direction — they pick the most plausible interpretation of each number and construct a story around it. The 22% discount *sounds* large, so the narrative says "significant discount." The 87% sensitivity *sounds* high, so the narrative says "strong performance." COA 1 *sounds* safer, so the narrative says "lower risk."

Multi-agent deliberation breaks this pattern because agents with different mandates interpret the same number differently. The Credit Analyst looks at 22% and asks "discount to *what*?" The Patient Safety Officer looks at 87% and asks "sensitivity *experienced by whom*?" The OPSEC Officer looks at COA 1 and asks "lower risk *for whom*?"

These are not better questions. They are *different* questions, asked from different loss functions. The Credit Analyst's loss function penalizes overpaying. The Patient Safety Officer's loss function penalizes patient harm. The OPSEC Officer's loss function penalizes information leakage. When agents with different loss functions examine the same evidence, the cases where surface appearance and underlying reality diverge are systematically exposed.

We propose the term **reversal detection** for this property: the ability of a multi-agent system to identify cases where the obvious interpretation of evidence is wrong or materially incomplete. Reversal detection is not a feature of the individual models — it is an emergent property of the adversarial architecture. The same models, in a single-prompt configuration, produce the surface-level interpretation. Only the structure of cross-examination between competing mandates forces the reversal to the surface.

This has a practical implication for enterprise adoption: **the value of multi-agent deliberation is highest precisely where the cost of missing a reversal is highest.** Regulatory findings, undiscovered fraud, mispriced risk, uncharacterized safety signals — these are all reversals. The organization's most expensive mistakes are the ones where something looked fine until it wasn't.

"We help you find the reversals before your regulator does" is not a marketing claim. It is a description of what the architecture systematically produces.

---

## 6. Limitations and Honest Caveats

1. **Single scenario.** This paper tests one decision type (capital planning). Results may differ for simpler decisions where deliberation overhead outweighs benefit.

2. **Same underlying models.** The Council agents use the same model families as the single-model baseline. The advantage comes from architecture, not from superior models. If the underlying models improve, both approaches improve — but the structural advantages of deliberation remain.

3. **Cost.** The Council approach consumed approximately 4.2× the tokens of the single-model approach. For high-stakes decisions (this one involves $2.3B and regulatory risk), this cost is trivial. For high-volume, low-stakes decisions, single-model inference may be more appropriate.

4. **Evaluator bias.** The independent evaluators were former bank examiners. Their preference for auditability and regulatory citations may not generalize to all enterprise decision contexts.

5. **No live data.** The scenario used synthetic but realistic data. A production benchmark with real portfolio data would strengthen these findings.

---

## 7. Reproducing This Benchmark

The full scenario, prompts, and evaluation rubric are available in the Datacendia repository. To reproduce:

```bash
# Start the demo environment
docker compose -f docker-compose.demo.yml up

# Run the benchmark scenario
curl -X POST http://localhost:3001/api/v1/council/deliberate \
  -H "Content-Type: application/json" \
  -d '{
    "question": "Should Meridian National Bank acquire the $2.3B CRE portfolio from First Regional at the proposed terms?",
    "context": "See scenario description in docs/benchmarks/meridian-cre-scenario.json",
    "config": {
      "councilMode": "capital-planning-council",
      "maxRounds": 8,
      "enableCrossExamination": true,
      "regulatoryFrameworks": ["Basel III CET1", "CCAR", "TLAC"]
    }
  }'
```

Compare against single-model:

```bash
curl -X POST http://localhost:3001/api/v1/inference/generate \
  -H "Content-Type: application/json" \
  -d '{
    "prompt": "You are a senior bank advisor. Should Meridian National Bank acquire...",
    "model": "llama3.3:70b",
    "options": { "temperature": 0.4 }
  }'
```

---

## 8. Conclusion

For high-stakes enterprise decisions — those involving regulatory scrutiny, competing objectives, and material financial exposure — multi-agent deliberation produces measurably better outputs than single-model inference. The improvement comes not from better models but from better architecture: adversarial pressure, separated mandates, explicit dissent, and structural auditability.

The question is not whether multi-agent deliberation is always better. It isn't — for simple lookups and routine tasks, a single model is faster and cheaper. The question is whether your organization's most important decisions deserve more than one perspective.

---

*Datacendia is an AI decision intelligence platform. For more information: https://github.com/datacendia/datacendia-components*

**Citation:**
```
Datacendia Research. (2026). Multi-Agent Deliberation vs. Single-Model Inference:
A Comparative Analysis. Working Paper WP-2026-01. https://datacendia.com/research/wp-2026-01
```
