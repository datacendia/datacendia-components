# Pharmaceutical End-to-End Walkthrough

**From interim analysis to DSMB-reviewed trial decision in 70 seconds.**

This walkthrough follows a realistic clinical trial scenario through the Datacendia Pharmaceutical vertical: a Data Safety Monitoring Board deliberation on whether to continue, pause, or terminate a Phase III trial for a novel cardiovascular drug after an interim analysis reveals an unexpected safety signal — elevated liver enzymes in 4.2% of the treatment arm — while the primary efficacy endpoint shows statistically significant benefit. Four agents deliberate across clinical science, biostatistics, pharmacovigilance, and regulatory strategy — producing a recommendation that balances patient safety against the possibility that stopping the trial condemns thousands of future patients to inferior treatment.

The pivotal tension: **the drug works, but it may be hurting livers.** Stopping the trial protects the 2,400 enrolled patients. Continuing the trial — if the signal is manageable — could save 180,000 lives per year. The DSMB has to decide with incomplete data.

---

## The Scenario

Your drug works. The interim analysis shows a 23% reduction in major adverse cardiac events — the kind of result that gets standing ovations at ACC. But 4.2% of patients on the drug have ALT elevations above 3× the upper limit of normal. Two have been hospitalized with suspected drug-induced liver injury. The FDA is watching. The stock price moved 12% on a leaked rumor about the interim. And you have 72 hours before the DSMB meets.

You are the **Chief Medical Officer** at **Helix Therapeutics**, a mid-cap biopharmaceutical company. Your lead asset, **HLX-4270** (a novel PCSK9 inhibitor with a unique hepatic clearance pathway), is in a pivotal Phase III trial.

**Key facts:**
- Drug: HLX-4270, oral PCSK9 inhibitor (novel mechanism — hepatic clearance, not renal)
- Indication: Secondary prevention of major adverse cardiovascular events (MACE)
- Trial: CARDINAL-3, Phase III, randomized, double-blind, placebo-controlled
- Enrollment: 2,400 patients randomized (1,200 treatment, 1,200 placebo)
- Primary endpoint: Time to first MACE (MI, stroke, CV death)
- Pre-specified interim analysis: At 50% of target events (385 of 770)
- **Efficacy result:** Hazard ratio 0.77 (23% MACE reduction), p = 0.0038, crosses O'Brien-Fleming boundary
- **Safety signal:** ALT > 3× ULN in 4.2% of treatment arm vs. 0.8% in placebo (p < 0.001)
- Serious hepatic events: 2 cases of suspected DILI in treatment arm, 0 in placebo
- Both DILI cases resolved after drug discontinuation (Hy's Law criteria NOT met)
- Background rate of ALT elevation on statins (comparator class): 1-3%
- Mechanism hypothesis: HLX-4270's hepatic clearance pathway may cause dose-dependent hepatotoxicity
- DSMB meeting: 72 hours
- FDA: Has requested the interim safety data under the SPA agreement
- Competitor: AstraZeneca's PCSK9 antibody (injectable, approved) — HLX-4270's advantage is oral dosing
- Investment: $1.8B spent to date; Phase III alone: $340M
- Market projection: $4.2B peak annual sales if approved

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
    "question": "Should the CARDINAL-3 Phase III trial of HLX-4270 continue, pause, or terminate? Interim analysis shows HR 0.77 for MACE (p=0.0038, crosses O-Brien-Fleming boundary) but ALT >3x ULN in 4.2% treatment vs 0.8% placebo. Two suspected DILI cases (both resolved, Hy Law not met). FDA has requested interim safety data. DSMB meets in 72 hours.",
    "context": {
      "vertical": "pharmaceutical",
      "decisionType": "clinical-trial"
    },
    "config": {
      "maxRounds": 12,
      "enableCrossExamination": true,
      "requireConsensus": false
      // 12 rounds — patient safety decision requires exhaustive analysis; ICH E6 GCP mandates thorough DSMB review
    }
  }'
```

The DSMB Deliberation Council activates 4 agents:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Clinical Scientist** | Medical & Scientific | Patient safety, benefit-risk assessment | deepseek-r1:32b (temp 0.3) |
| **Biostatistician** | Statistical Analysis | Data integrity, endpoint analysis, stopping rules | qwen3:32b (temp 0.4) |
| **Pharmacovigilance Lead** | Drug Safety | Signal detection, causality assessment, reporting | qwen3:32b (temp 0.4) |
| **Regulatory Strategist** | FDA/EMA Strategy | Regulatory path, submission strategy, agency communication | qwen3:32b (temp 0.4) |

Compliance frameworks enforced: **FDA 21 CFR (GCP), ICH E6 (GCP), ICH E2E (Pharmacovigilance), FDA Data Integrity (ALCOA+).**
Safety gate: **REQUIRED — patient safety decision.**

---

### Phase 1: Initial Analysis

---

**Clinical Scientist** (confidence: 0.48)

> **Benefit-Risk Assessment: EFFICACY IS STRONG, HEPATOTOXICITY IS REAL BUT POTENTIALLY MANAGEABLE**
>
> Let me separate the efficacy picture from the safety picture, then integrate.
>
> **Efficacy:**
> - HR 0.77 for MACE is clinically meaningful — a 23% reduction in heart attacks, strokes, and CV death
> - p = 0.0038 crosses the O'Brien-Fleming stopping boundary for efficacy
> - For context: the landmark FOURIER trial (evolocumab) showed HR 0.80 (20% MACE reduction). HLX-4270 is *numerically superior*
> - At this effect size, completing enrollment would prevent an estimated **42 additional MACE events** in the trial population alone
> - If approved, at the target patient population of 800,000 per year, the drug would prevent approximately **180,000 MACE events annually**
>
> **Safety:**
> - ALT > 3× ULN in 4.2% vs. 0.8% = excess hepatotoxicity of 3.4%
> - 2 suspected DILI cases — both resolved after discontinuation. This is important: *reversibility* suggests the injury is hepatocellular adaptation, not irreversible damage
> - **Hy's Law criteria NOT met** — no concurrent ALT elevation + bilirubin elevation. Hy's Law is the strongest predictor of fatal DILI. Not meeting it is meaningfully reassuring
> - The hepatic clearance mechanism provides a plausible pharmacological explanation — this is likely dose-dependent and predictable, not idiosyncratic
>
> **The clinical question is not "is the liver signal real?" — it is.** The question is: can we manage it?
>
> | Management Strategy | Feasibility | Precedent |
> |-------------------|:-:|:-:|
> | Routine LFT monitoring (monthly) | High | Standard for statins, methotrexate, biologics |
> | Dose reduction protocol for ALT > 2× ULN | Moderate | Would require protocol amendment |
> | Hepatic risk stratification at enrollment | High | Pre-existing liver disease exclusion already in protocol |
> | REMS with LFT monitoring requirement | High | FDA has accepted REMS for hepatotoxic drugs (Ocaliva, Aubagio) |
>
> **Preliminary position: CONTINUE WITH PROTOCOL AMENDMENT.** Add mandatory LFT monitoring and dose reduction algorithm. Do not stop a trial that prevents 180,000 MACE events per year because of a manageable, reversible, monitorable liver signal.

---

**Biostatistician** (confidence: 0.71)

> **Statistical Assessment: EFFICACY IS REAL, BUT THE SAFETY ANALYSIS IS UNDERPOWERED**
>
> **Efficacy analysis:**
> - HR 0.77, 95% CI [0.65, 0.91], p = 0.0038
> - The O'Brien-Fleming boundary at this interim (50% information fraction) requires p < 0.0054
> - **The efficacy result crosses the stopping boundary.** The trial has met its primary endpoint at interim
> - The conditional power to confirm at final analysis (given current trend): 97%
>
> **This means the trial could be stopped for efficacy right now under the pre-specified statistical analysis plan.** However...
>
> **Safety analysis — this is where I need to raise the alarm:**
>
> | Parameter | Treatment (n=1,200) | Placebo (n=1,200) | Difference | 95% CI |
> |-----------|:---:|:---:|:---:|:---:|
> | ALT > 3× ULN | 4.2% (50 patients) | 0.8% (10 patients) | 3.4% | [1.9%, 4.9%] |
> | Suspected DILI | 0.17% (2 patients) | 0% (0 patients) | 0.17% | [0.02%, 0.60%] |
>
> **50 patients with ALT elevation is enough to establish the signal is real (p < 0.001). But 2 DILI cases is not enough to characterize the serious end of the hepatotoxicity spectrum.** The 95% confidence interval for DILI incidence is [0.02%, 0.60%] — a 30× range. At the lower bound, DILI is extremely rare and manageable. At the upper bound, 1 in 167 patients gets drug-induced liver injury.
>
> **To narrow this CI to a range the FDA will accept for labeling, we need approximately 150 more patient-years of exposure.** Continuing the trial for 6-8 additional months would provide this data.
>
> **This is the statistical argument for continuing:** The trial has proven efficacy. What it hasn't proven is whether the serious hepatotoxicity rate is 0.02% (acceptable with monitoring) or 0.6% (potentially unacceptable). Only continued enrollment generates the safety data needed for a defensible NDA submission.
>
> **Preliminary position: CONTINUE.** The efficacy question is answered. The safety question requires more data. Stopping now answers neither question satisfactorily for the FDA.

---

**Pharmacovigilance Lead** (confidence: 0.57)

> **Safety Signal Assessment: SIGNAL IS CONFIRMED — CAUSALITY PROBABLE**
>
> **Causality assessment (WHO-UMC criteria):**
>
> | Criterion | Assessment |
> |-----------|-----------|
> | Temporal relationship | ✅ ALT elevations began 4-12 weeks after treatment initiation |
> | Dose-response | ✅ Higher ALT elevations correlated with higher plasma drug levels |
> | Dechallenge | ✅ Both DILI cases resolved after drug discontinuation |
> | Rechallenge | ❓ Not performed (patients withdrawn per protocol) |
> | Alternative causes | ✅ Ruled out — no concurrent hepatotoxic medications, no viral hepatitis |
> | Mechanism plausibility | ✅ Hepatic clearance pathway provides pharmacological explanation |
>
> **Causality: PROBABLE.** The hepatotoxicity is drug-related. This is not a statistical artifact.
>
> **Comparison to approved hepatotoxic drugs:**
>
> | Drug | Indication | ALT > 3× ULN Rate | DILI Rate | FDA Action |
> |------|-----------|:---:|:---:|----------|
> | **HLX-4270** | **MACE prevention** | **4.2%** | **0.17%** | **Under review** |
> | Atorvastatin | CV prevention | 1.2% | 0.01% | Approved — LFT monitoring initially, later removed |
> | Bosentan | Pulmonary HTN | 11% | 0.5% | Approved with REMS (monthly LFTs) |
> | Teriflunomide | Multiple sclerosis | 14% | 0.4% | Approved with REMS (monthly LFTs) |
> | Obeticholic acid | PBC | 5.2% | 0.3% | Approved with REMS — later market withdrawal |
>
> **HLX-4270's hepatotoxicity profile is better than several currently approved drugs.** The ALT elevation rate (4.2%) is below bosentan (11%) and teriflunomide (14%). The DILI rate (0.17%) is below both. All of these drugs were approved with REMS programs requiring LFT monitoring.
>
> **However: obeticholic acid was later withdrawn.** The pattern to watch is whether the DILI rate increases with longer exposure (cumulative hepatotoxicity) or stabilizes (dose-dependent adaptation). We do not yet have the data to distinguish these.
>
> **Preliminary position: CONTINUE with enhanced hepatic monitoring.** The signal is real but within the range of drugs the FDA has approved with risk management. The critical unknown is time-dependent DILI trajectory — only continued exposure will answer this.

---

**Regulatory Strategist** (confidence: 0.64)

> **Regulatory Assessment: FDA WILL DEMAND HEPATIC RISK MANAGEMENT — THE QUESTION IS WHETHER WE DESIGN IT OR THEY DO**
>
> **Current FDA posture:**
> - FDA requested the interim safety data under the SPA agreement — this is standard but signals active monitoring
> - Under 21 CFR 312.32, the 2 DILI cases require IND Safety Reports within 15 calendar days
> - If we haven't filed them already, we're in violation — **check immediately**
>
> **Regulatory path analysis:**
>
> | Scenario | Trial Decision | FDA Likely Response | NDA Path |
> |----------|:---:|:---:|:---:|
> | A: Continue with enhanced monitoring | Continue + protocol amendment | Acceptable if monitoring data is compelling | NDA with REMS — LFT monitoring |
> | B: Pause, add monitoring, resume | 3-6 month pause | May request additional Phase IIb dose-finding | Delayed 12-18 months |
> | C: Stop for efficacy (pre-specified) | Stop | Will reject NDA without adequate safety database | Dead — insufficient safety data |
> | D: Terminate for safety | Terminate | Acknowledges caution but drug is lost | No NDA |
>
> **Scenario C is the trap.** The statistical analysis plan allows stopping for efficacy because HR 0.77 crosses the O'Brien-Fleming boundary. But stopping a trial with 2,400 patients when the FDA has an active hepatotoxicity concern would be regulatory suicide. The FDA will say: "You proved it works. You didn't prove it's safe enough. Come back with more safety data." And you can't re-enroll a stopped trial.
>
> **Scenario A is the only path that leads to an approvable NDA.** The FDA has approved drugs with worse hepatotoxicity profiles (bosentan, teriflunomide). But they did so because the safety database was large enough to characterize the risk. At 2,400 patients and 2 DILI cases, our database is too small.
>
> **The protocol amendment should include:**
> 1. Mandatory LFTs at baseline, monthly for 6 months, then quarterly
> 2. Dose reduction algorithm for ALT > 2× ULN
> 3. Mandatory discontinuation for ALT > 5× ULN or any Hy's Law case
> 4. Independent hepatology adjudication committee for all ALT > 3× ULN cases
> 5. Pre-specified stopping rule: terminate if DILI rate exceeds 1% or any Hy's Law case confirmed
>
> **Preliminary position: CONTINUE with protocol amendment. File the IND Safety Reports immediately if not already done. Submit the protocol amendment to FDA within 30 days.**

---

### Phase 2: Cross-Examination

---

**Pharmacovigilance Lead → Clinical Scientist:**

> **Challenge:** You compare HLX-4270 to bosentan and teriflunomide, both approved with REMS. But both of those drugs treat serious diseases with limited alternatives. MACE prevention has multiple approved therapies (statins, ezetimibe, PCSK9 antibodies). The FDA will apply a stricter benefit-risk standard because alternatives exist. Does the 23% MACE reduction justify a REMS when existing PCSK9 antibodies achieve 20% without hepatotoxicity?

**Clinical Scientist (Response):**

> The comparison to injectable PCSK9 antibodies is exactly right — and it's our strongest argument. Here's why:
>
> **Adherence is the hidden variable.**
>
> | PCSK9 Therapy | Route | Adherence at 12 months | Effective MACE Reduction (adherence-adjusted) |
> |--------------|:---:|:---:|:---:|
> | Evolocumab (Repatha) | Injection, 2x/month | 55% | ~11% |
> | Alirocumab (Praluent) | Injection, 2x/month | 52% | ~10% |
> | **HLX-4270** | **Oral, daily** | **est. 78%** | **~18%** |
>
> Injectable PCSK9 antibodies achieve 20% MACE reduction in clinical trials, but **real-world adherence is 52-55%** because patients don't like injecting themselves twice a month. An oral daily pill has estimated adherence of 78% (based on statin adherence data).
>
> **The adherence-adjusted MACE reduction for HLX-4270 is approximately 18% — nearly double the real-world effectiveness of injectable alternatives.** That's the clinical argument: a drug that patients actually take prevents more heart attacks than a drug they stop taking after 6 months.
>
> **The FDA understands this.** The 2023 FDA guidance on "Patient-Relevant Endpoints in Cardiovascular Trials" specifically calls out adherence as a factor in benefit-risk assessment. An oral PCSK9 inhibitor with manageable hepatotoxicity serves patients better than an injectable PCSK9 antibody that 45% of patients abandon.
>
> **Revised benefit-risk calculation:**
>
> ```
> Annual MACE events prevented (HLX-4270, adherence-adjusted): ~144,000
> Annual MACE events prevented (injectable PCSK9, adherence-adjusted): ~80,000
> Incremental benefit of HLX-4270: 64,000 fewer heart attacks/strokes/CV deaths per year
>
> Annual hepatotoxicity risk (at 4.2% ALT elevation, 0.17% DILI):
>   In target population of 800,000: ~1,360 DILI cases (all reversible to date)
>
> Lives saved per DILI case: 64,000 / 1,360 = 47 MACE events prevented per DILI case
> ```
>
> **47 heart attacks prevented for every liver injury case — and the liver injuries are reversible.** This is a compelling benefit-risk ratio, and it's the number we should present to the FDA.

---

**Biostatistician → Regulatory Strategist:**

> **Critical question:** You said Scenario C (stopping for efficacy) is a trap. But the pre-specified statistical analysis plan — which FDA agreed to in the SPA — includes stopping for efficacy at this boundary. If we *don't* stop when the pre-specified boundary is crossed, are we deviating from the SPA?

**Regulatory Strategist (Response):**

> This is the most important regulatory question in this deliberation. The answer is nuanced:
>
> The SPA agreement specifies that the trial *may* be stopped for efficacy if the O'Brien-Fleming boundary is crossed. The word is "may," not "shall." The DSMB has discretion to recommend continuation even when the boundary is crossed, particularly when safety data requires further characterization.
>
> **There is precedent for this.** In the SPRINT trial (intensive blood pressure control), the DSMB recommended early stopping for efficacy — but several advisory committees later criticized this decision because the safety database was insufficient to characterize serious adverse events. The HLX-4270 situation is the inverse: we should *not* stop because the safety database needs to grow.
>
> **What we must do:**
> 1. Document in the DSMB minutes that the efficacy boundary was crossed
> 2. Document that the DSMB elected to continue *specifically to characterize the hepatotoxicity signal*
> 3. Communicate this rationale to FDA proactively (not wait for them to ask)
> 4. Amend the SAP to add the hepatic stopping rule (DILI > 1% or Hy's Law)
>
> **This is not a deviation from the SPA. It's a safety-motivated decision to continue data collection.** FDA will view this favorably if we communicate it properly. They will view it unfavorably if they learn about it from a leaked interim analysis or a stock price movement.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_phm_7a8b9c0d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
  "status": "completed",
  "durationMs": 62471,
  "confidenceScore": 0.66,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "CONTINUE TRIAL with protocol amendment. Enhanced hepatic monitoring. Proactive FDA communication.",
    "summary": "All four agents recommend continuation. The efficacy result (HR 0.77, p=0.0038) crosses the stopping boundary for efficacy, but stopping now would leave the safety database too small to support an NDA — the FDA would reject the filing for inadequate hepatotoxicity characterization. The hepatotoxicity signal is real (causality: probable) but within the range of approved drugs with REMS. The key unknown — whether DILI rate is 0.02% (acceptable) or 0.6% (potentially unacceptable) — requires 6-8 more months of exposure to resolve.",

    "dsmbRecommendation": {
      "decision": "CONTINUE",
      "protocolAmendments": [
        "Mandatory LFTs at baseline, monthly × 6 months, then quarterly",
        "Dose reduction algorithm for ALT > 2× ULN",
        "Mandatory discontinuation for ALT > 5× ULN or Hy's Law",
        "Independent hepatology adjudication committee for all ALT > 3× ULN",
        "Pre-specified stopping rule: terminate if DILI rate > 1% or any confirmed Hy's Law case"
      ],
      "fdaCommunication": "Proactive Type C meeting request within 30 days to discuss interim results and protocol amendment",
      "indSafetyReports": "File within 15 days for both DILI cases — verify compliance immediately"
    },

    "keyInsights": [
      "Stopping for efficacy is a regulatory trap — the SPA says 'may' not 'shall,' and the safety database is too small for an approvable NDA",
      "Adherence-adjusted effectiveness: HLX-4270 prevents ~144,000 MACE events/year vs ~80,000 for injectable alternatives — the oral route IS the clinical advantage",
      "47 heart attacks prevented per DILI case, and all DILI cases to date are reversible — benefit-risk is compelling but requires monitoring",
      "The DILI confidence interval is [0.02%, 0.60%] — a 30× range that only narrows with more exposure data",
      "Bosentan, teriflunomide approved with worse hepatotoxicity profiles — but obeticholic acid was later withdrawn; time-dependent trajectory is unknown"
    ]
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["FDA 21 CFR 312.32 (IND Safety Reports)", "ICH E6 R2 (GCP)", "ICH E2E (Pharmacovigilance)", "FDA SPA Guidance", "21 CFR Part 11"],
    "mandatoryFilings": [
      "IND Safety Reports for 2 DILI cases — 15-day deadline",
      "Protocol amendment to IRB/FDA within 30 days",
      "Annual IND Safety Report update with hepatotoxicity analysis"
    ],
    "dataIntegrity": "ALCOA+ principles applied to all interim analysis data. Audit trail maintained per 21 CFR Part 11."
  },

  "agentVotes": {
    "clinical-scientist": { "vote": "continue_with_amendment", "confidence": 0.68 },
    "biostatistician": { "vote": "continue_for_safety_data", "confidence": 0.71 },
    "pharmacovigilance": { "vote": "continue_with_monitoring", "confidence": 0.57 },
    "regulatory-strategist": { "vote": "continue_proactive_fda", "confidence": 0.64 }
  }
}
```

### Phase 4: Ethics & Patient Safety Gate

```json
{
  "ethicsCheck": {
    "passed": true,
    "patientSafetyGate": "CONDITIONAL CONTINUE",
    "informedConsentUpdate": "REQUIRED",
    "notes": [
      "Enrolled patients must be re-consented with updated hepatotoxicity risk information",
      "New enrollees receive updated informed consent with hepatotoxicity disclosure",
      "Patients with pre-existing liver disease (ALT > 1.5× ULN at baseline) excluded from further enrollment",
      "Independent DSMB maintains authority to terminate at any future meeting if stopping rules are met",
      "The 47:1 ratio of MACE events prevented to DILI cases supports continuation under ICH E6 benefit-risk principles",
      "Obeticholic acid precedent acknowledged — trial includes pre-specified stopping rules to prevent similar outcome"
    ]
  }
}
```

---

## What the CMO Presents to the DSMB

> "The drug works — HR 0.77, p = 0.0038, crosses the O'Brien-Fleming boundary. But we are not recommending you stop the trial for efficacy. Here's why:
>
> The hepatotoxicity signal is real. 4.2% ALT elevation, 2 DILI cases, causality probable. But the DILI confidence interval ranges from 0.02% to 0.60% — we don't yet know if this is a 1-in-5,000 risk or a 1-in-167 risk. Stopping now answers the efficacy question (it works) but leaves the safety question unanswered (how much liver risk?). The FDA will not approve an NDA with 2 DILI cases and a 30× confidence interval.
>
> Continuing with enhanced monitoring — monthly LFTs, dose reduction algorithm, independent hepatology adjudication — generates the safety data we need. The pre-specified stopping rule (terminate if DILI > 1% or any Hy's Law case) protects patients.
>
> The adherence argument is our strongest clinical case: because HLX-4270 is oral and alternatives are injectable, real-world adherence is 78% vs. 52-55%. That translates to 64,000 additional MACE events prevented per year — 47 heart attacks for every liver injury, and the liver injuries are reversible.
>
> We recommend: continue, amend the protocol, file the IND Safety Reports, and request a proactive Type C meeting with FDA within 30 days."

The Biostatistician's insight — that the DILI confidence interval is [0.02%, 0.60%], a 30× range that makes the safety profile essentially uncharacterized — is the finding that prevents the regulatory trap. Without it, a reasonable DSMB might look at "2 DILI cases, both resolved" and stop for efficacy, thinking the safety signal is minor. The Biostatistician forces the committee to confront the uncertainty: 2 cases in 1,200 patients could mean anything from "extremely rare" to "1 in 167." Only more exposure data narrows that interval. The Clinical Scientist's adherence-adjusted analysis then provides the ethical justification for continuing: 47 heart attacks prevented per liver injury, with reversibility, makes the benefit-risk ratio defensible — but only if you can prove the denominator.

---

## Pharmaceutical Decision Types

| Decision Type | Description | Key Frameworks |
|---------------|-------------|---------------|
| **Clinical Trial** | Continue/pause/terminate/advance decisions | FDA 21 CFR 312, ICH E6 GCP |
| **Drug Safety** | Signal assessment, label updates, REMS, recall | ICH E2E, FDA pharmacovigilance |
| **Regulatory Submission** | IND/NDA/BLA timing and strategy | FDA 21 CFR, EMA regulations |
| **Manufacturing** | Batch release, deviation, cGMP compliance | 21 CFR 210/211, ICH Q7 |
| **Quality Event** | Deviation, OOS, CAPA, change control | ICH Q10, FDA data integrity |
| **Pricing & Access** | Launch price, payer strategy, patient programs | Sunshine Act, HTA requirements |
| **Supply Chain** | Supplier qualification, inventory, serialization | DSCSA, DEA CSA |
| **Intellectual Property** | Patent strategy, Paragraph IV, lifecycle | Hatch-Waxman, Orange Book |
| **Pharmacovigilance** | Case processing, signal detection, expedited reporting | ICH E2E, EMA GVP |
| **Real-World Evidence** | Post-market studies, RWD quality, regulatory use | FDA RWE framework |
| **Clinical Operations** | Site performance, enrollment, vendor oversight | ICH E6, GCP |
| **Medical Affairs** | Investigator-initiated studies, KOL engagement | Sunshine Act, compliance |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [HEALTHCARE_WALKTHROUGH.md](HEALTHCARE_WALKTHROUGH.md) and [INSURANCE_WALKTHROUGH.md](INSURANCE_WALKTHROUGH.md).*
