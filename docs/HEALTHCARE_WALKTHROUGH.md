# Healthcare End-to-End Walkthrough

**From clinical question to FDA-defensible decision packet in 60 seconds.**

This walkthrough follows a realistic scenario through the Datacendia Healthcare vertical: a hospital system evaluating whether to deploy a clinical AI tool as Software as a Medical Device (SaMD). The SaMD Approval Council deliberates across FDA classification, clinical validation, patient safety, and HIPAA — surfacing risks that no single analysis would catch.

---

## The Scenario

A patient dies in a way that might have been preventable. Now you have to decide whether the tool that could have helped is safe to deploy — and whether the FDA will agree.

You are the Chief Medical Information Officer at **Lakewood Health System**, a 4-hospital network with 1,200 beds. Your clinical AI team has developed **SepsisSense**, a machine learning model that predicts sepsis onset 4-6 hours earlier than standard SIRS/qSOFA criteria by analyzing real-time vitals, labs, and nursing notes from the EHR.

The model shows strong performance in retrospective validation (AUROC 0.91, sensitivity 87%, specificity 82%). The clinical team wants to deploy it in the ICU and ED. But deployment means this becomes Software as a Medical Device under FDA oversight — and the regulatory, safety, and operational implications are significant.

**Key facts:**
- Model performance: AUROC 0.91, sensitivity 87%, specificity 82% (retrospective)
- No prospective validation yet
- Intended deployment: ICU and ED (420 beds across 4 hospitals)
- Alert mechanism: Real-time push notification to nursing staff via EHR
- Integration: Epic EHR via FHIR R4 APIs
- Training data: 3 years of de-identified EHR data (~48,000 sepsis encounters)
- Known limitation: Performance degrades for pediatric patients (AUROC drops to 0.78)
- Estimated impact: 12-15% reduction in sepsis mortality if deployed

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
    "question": "Should Lakewood Health System deploy SepsisSense as a clinical decision support tool in the ICU and ED? The ML model predicts sepsis onset 4-6 hours early with AUROC 0.91. No prospective validation has been completed. Pediatric performance is degraded (AUROC 0.78). Deployment requires FDA SaMD classification.",
    "context": {
      "vertical": "healthcare",
      "councilMode": "samd-approval-council",
      "data": {
        "organization": "Lakewood Health System",
        "beds": 1200,
        "hospitals": 4,
        "modelName": "SepsisSense",
        "auroc": 0.91,
        "sensitivity": 0.87,
        "specificity": 0.82,
        "pediatricAuroc": 0.78,
        "trainingEncounters": 48000,
        "prospectiveValidation": false,
        "ehrIntegration": "Epic FHIR R4",
        "targetUnits": ["ICU", "ED"]
      }
    },
    "config": {
      "maxRounds": 12,
      "enableCrossExamination": true,
      "requireConsensus": false,
      "minConfidenceThreshold": 0.7
      // 12 rounds — FDA SaMD classification requires deep clinical/regulatory cross-examination
    }
  }'
```

The SaMD Approval Council activates 4 agents:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Clinical Advisor** | Chief Medical Officer | Patient safety and evidence-based care | deepseek-r1:32b (temp 0.3) |
| **Healthcare Compliance Officer** | HIPAA & Regulatory | Ensure regulatory compliance | qwen3:32b (temp 0.4) |
| **Patient Safety Officer** | Quality & Safety | Prevent patient harm | qwen3:32b (temp 0.4) |
| **Health Informatics Specialist** | Clinical Data & EHR | Data accuracy and interoperability | qwen3:32b (temp 0.4) |

Regulatory frameworks enforced: **FDA 21 CFR 820, 21 CFR Part 11, IEC 62304, ISO 14971, EU MDR.**

---

### Phase 1: Initial Analysis

---

**Clinical Advisor** (confidence: 0.72)

> **Clinical Assessment: STRONG POTENTIAL, PREMATURE FOR DEPLOYMENT**
>
> The clinical case for SepsisSense is compelling. Sepsis is the leading cause of in-hospital mortality, and early detection is the single most impactful intervention — every hour of delayed treatment increases mortality by 7.6% (Kumar et al., Crit Care Med 2006).
>
> Performance analysis:
>
> | Metric | SepsisSense | Published Benchmarks | Assessment |
> |--------|-------------|---------------------|------------|
> | AUROC | 0.91 | 0.75-0.85 (typical CDS) | **Above benchmark** |
> | Sensitivity | 87% | 80-85% (target) | **Acceptable** |
> | Specificity | 82% | 85-90% (target) | **Below target — alert fatigue risk** |
> | PPV (est.) | ~38% | >50% preferred | **Concerning** |
>
> The 82% specificity is my primary clinical concern. At sepsis prevalence of ~6% in ICU/ED populations, an 82% specificity yields an estimated PPV of approximately 38%. This means **62% of alerts will be false positives**. In an ICU with 30 patients, nursing staff would receive approximately 3-4 false alerts per shift. Alert fatigue is a documented patient safety hazard (Joint Commission Sentinel Event Alert 50).
>
> The pediatric AUROC degradation to 0.78 is a hard stop. Pediatric sepsis has different pathophysiology (compensated shock, different vital sign ranges), and a tool that performs at 0.78 in this population could miss critical cases. SepsisSense should be **excluded from pediatric patients entirely** until a pediatric-specific model is validated.
>
> **Preliminary position: DO NOT DEPLOY** without (1) prospective validation, (2) specificity improvement to ≥88%, and (3) explicit pediatric exclusion.

---

**Healthcare Compliance Officer** (confidence: 0.45)

> **Regulatory Analysis: MULTIPLE BLOCKING ISSUES**
>
> SepsisSense falls under FDA regulation as Software as a Medical Device (SaMD). Classification analysis:
>
> | Factor | Assessment |
> |--------|-----------|
> | **SaMD Category** | Diagnosis (informs clinical management) |
> | **State of Healthcare** | Critical (sepsis — life-threatening) |
> | **Significance of Information** | Drives clinical action (alerts trigger intervention) |
> | **IMDRF Risk Category** | **Category III** (high significance, critical condition) |
> | **FDA Classification** | **Class II — requires 510(k) or De Novo** |
> | **Predicate Device** | No clear predicate — likely De Novo pathway |
>
> **Blocking issues:**
>
> 1. **No 510(k) or De Novo clearance.** Deploying a Class II SaMD without FDA clearance violates 21 USC §360(k). This is not optional — it's federal law.
>
> 2. **21 CFR Part 11 compliance.** The ML model's training data, validation results, and alert logs must meet electronic records requirements. Has the data pipeline been validated? Are audit trails in place?
>
> 3. **IEC 62304 software lifecycle.** Has SepsisSense been developed under a quality management system compliant with IEC 62304? Classification as Class C software (life-supporting/life-sustaining) requires full software development lifecycle documentation.
>
> 4. **ISO 14971 risk management.** A formal risk management file is required. Has a hazard analysis been conducted? What happens when the model fails? What's the failure mode — does it fail safe (no alert) or fail dangerous (false alert leading to unnecessary intervention)?
>
> 5. **HIPAA/HITECH.** The model processes PHI. Has a HIPAA security risk assessment been completed for the ML pipeline? Is the training data de-identification compliant with Safe Harbor or Expert Determination?
>
> **Preliminary position: CANNOT APPROVE.** FDA clearance is a legal prerequisite. Recommend engaging a regulatory affairs consultant and targeting De Novo classification with the FDA's Pre-Submission program.

---

**Patient Safety Officer** (confidence: 0.51)

> **Safety Assessment: HIGH-RISK DEPLOYMENT**
>
> I identify 7 patient safety concerns:
>
> 1. **Alert fatigue.** At 62% false positive rate, nursing staff will begin ignoring or dismissing SepsisSense alerts within 2-4 weeks. This is well-documented in the literature (Ancker et al., JAMIA 2017). Alert fatigue doesn't just reduce the effectiveness of SepsisSense — it degrades response to *all* clinical alerts in the EHR.
>
> 2. **Automation bias.** Clinicians may over-rely on SepsisSense and reduce their own clinical vigilance for sepsis signs. When the model misses a case (13% false negative rate), the missed patient may receive *worse* care than they would without the tool.
>
> 3. **Pediatric harm risk.** An AUROC of 0.78 in pediatric patients is below the threshold for clinical utility. A sepsis prediction tool that gives clinicians false confidence about pediatric patients is actively dangerous.
>
> 4. **Workflow disruption.** Real-time push notifications in ICU and ED interrupt clinical workflow. The Joint Commission's National Patient Safety Goals require that alarm management be integrated into clinical workflow, not layered on top.
>
> 5. **No prospective validation.** Retrospective AUROC does not predict real-world performance. Model performance typically degrades 5-15% from retrospective to prospective validation due to temporal drift, population shift, and workflow effects.
>
> 6. **Training data recency.** 3 years of historical data may not reflect current antibiotic resistance patterns, sepsis protocols, or patient demographics — all of which affect model relevance.
>
> 7. **No off-switch protocol.** What happens when the model needs to be taken offline for updates or issues? Is there a documented fallback to standard clinical protocols?
>
> **Preliminary position: REJECT** until prospective validation demonstrates real-world safety and a comprehensive alarm management plan is in place.

---

**Health Informatics Specialist** (confidence: 0.63)

> **Technical Assessment: ARCHITECTURE SOUND, GAPS IN VALIDATION PIPELINE**
>
> The FHIR R4 integration with Epic is technically appropriate. Assessment:
>
> | Component | Status | Notes |
> |-----------|--------|-------|
> | EHR Integration (FHIR R4) | ✅ | Standard API, well-supported by Epic |
> | Real-time data pipeline | ⚠️ | Vitals latency must be <60 seconds for 4-6 hour prediction to be clinically useful |
> | Model serving infrastructure | ⚠️ | Needs redundancy — model unavailability must not block clinical workflow |
> | De-identification pipeline | ⚠️ | Safe Harbor method used — needs Expert Determination for training data expansion |
> | Audit trail / 21 CFR Part 11 | 🔴 | Not yet implemented for ML model decisions |
> | Data drift monitoring | 🔴 | No automated monitoring for input distribution shift |
> | A/B testing infrastructure | 🔴 | Required for prospective validation — not built |
>
> **Critical finding:** There is no data drift monitoring. ML models degrade silently as patient populations change, new EHR templates are deployed, or clinical protocols evolve. Without automated drift detection, SepsisSense could be producing inaccurate predictions for weeks or months before anyone notices. This is a patient safety issue, not just a technical issue.
>
> **Preliminary position: CONDITIONAL SUPPORT** if data drift monitoring, 21 CFR Part 11 audit trails, and A/B testing infrastructure are implemented before any deployment.

---

### Phase 2: Cross-Examination

---

**Patient Safety Officer → Clinical Advisor:**

> **Challenge:** You cite a 38% estimated PPV. Can you model the actual alert volume? In a 30-bed ICU with 6% sepsis prevalence, how many alerts per shift would nursing staff receive, and what's the expected cognitive load?

**Clinical Advisor (Response):**

> Modeling the alert volume:
>
> - 30-bed ICU, 6% sepsis prevalence = ~1.8 true sepsis patients per shift
> - Sensitivity 87%: ~1.6 true positives (detected sepsis cases)
> - Specificity 82%: ~5.1 false positives per shift (28.2 non-sepsis patients × 18% FP rate)
> - **Total alerts per 12-hour shift: ~6.7, of which 5.1 are false**
>
> Each alert requires a nurse to assess the patient, review labs, and make a clinical judgment — approximately 8-12 minutes per alert. That's **51-61 minutes per shift spent on false alerts alone**. In an understaffed ICU — which is most ICUs — this is clinically unacceptable.
>
> **I strengthen my recommendation: specificity must reach ≥90% before deployment.** At 90% specificity, false alerts drop to ~2.8 per shift — still imperfect but within manageable range.

---

**Healthcare Compliance Officer → Health Informatics Specialist:**

> **Challenge:** You note 21 CFR Part 11 audit trails are "not yet implemented." This is not a gap — it's a regulatory violation if we deploy. Can you confirm: are *any* of the model's decisions currently logged in a way that meets electronic records requirements? Timestamped, attributable, unalterable?

**Health Informatics Specialist (Response):**

> No. Current logging captures model predictions in application logs, but these are:
> - Not timestamped with validated system clocks (21 CFR Part 11 §11.10(e))
> - Not protected from alteration (logs are append-only but not cryptographically signed)
> - Not attributable to a specific model version (no model versioning in production)
>
> **I amend my assessment:** 21 CFR Part 11 compliance is not a "gap to close" — it's a prerequisite that requires 4-8 weeks of engineering work before any validated deployment can begin. This aligns with the Compliance Officer's blocking assessment.

---

**Clinical Advisor → Patient Safety Officer:**

> **Challenge:** Your concern about automation bias is valid, but the counterfactual matters. Without SepsisSense, Lakewood's current sepsis detection relies on manual screening with SIRS criteria, which has documented sensitivity of only 68%. Isn't a tool with 87% sensitivity *still safer than the status quo*, even with automation bias risk?

**Patient Safety Officer (Response):**

> This is the right question, and I want to answer it carefully.
>
> Yes, 87% sensitivity > 68% sensitivity — in a vacuum. But the comparison isn't "SepsisSense vs. nothing." It's "SepsisSense deployed prematurely vs. SepsisSense deployed after proper validation." The 12-15% mortality reduction estimate comes from the retrospective analysis. If real-world performance degrades by even 10% (which is typical), and alert fatigue causes nurses to ignore 30% of alerts (which is documented), the *effective* sensitivity could be:
>
> - 87% × 0.90 (performance degradation) × 0.70 (alert fatigue compliance) = **54.8% effective sensitivity**
>
> That's *worse* than the current manual screening at 68%.
>
> **This is why prospective validation matters.** Not because the model is bad — it's promising. But deploying a promising model without prospective validation and alert management could make outcomes *worse* than doing nothing.
>
> **I maintain my position but acknowledge the Clinical Advisor's point:** the urgency to deploy is real. Every month of delay means patients who might have been saved. The ethical obligation is to validate *quickly*, not to validate *eventually*.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_hc_4a7b8c9d-1e2f-3a4b-5c6d-7e8f9a0b1c2d",
  "status": "completed",
  "durationMs": 52341,
  "confidenceScore": 0.54,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "DO NOT DEPLOY. Initiate 90-day rapid validation pathway.",
    "summary": "The Council unanimously agrees that SepsisSense cannot be deployed in its current state. Three blocking issues prevent deployment: (1) no FDA clearance — SepsisSense is Class II SaMD requiring 510(k) or De Novo; (2) no prospective validation — retrospective AUROC does not predict real-world safety; (3) no 21 CFR Part 11 compliance — model decisions are not logged to regulatory standards. However, the clinical case is strong and delay has real patient cost.",

    "ninetDayPlan": {
      "description": "The Council recommends a 90-day rapid validation pathway that parallelizes regulatory, clinical, and technical workstreams:",
      "workstreams": [
        "Weeks 1-2: FDA Pre-Submission meeting to confirm De Novo pathway and data requirements",
        "Weeks 1-4: Build 21 CFR Part 11 compliant audit trail and data drift monitoring",
        "Weeks 2-10: Prospective silent-mode validation in 2 ICUs (model runs but alerts are not shown to clinicians — predictions logged and compared to outcomes)",
        "Weeks 4-8: Improve specificity to ≥90% through model retraining with alert fatigue optimization objective",
        "Week 8: Pediatric exclusion formally documented with clinical justification",
        "Weeks 8-12: Prepare De Novo submission package with prospective data",
        "Week 12: Council reconvenes with prospective results for go/no-go decision"
      ]
    },

    "keyInsights": [
      "The '22% discount' equivalent: 87% sensitivity sounds strong, but 82% specificity yields 62% false positive rate at 6% prevalence — creating 5+ false alerts per ICU shift",
      "Alert fatigue could reduce effective sensitivity to 54.8% — worse than current manual screening (68%)",
      "Pediatric AUROC of 0.78 is a hard exclusion — deploying with degraded pediatric performance is actively dangerous",
      "21 CFR Part 11 compliance requires 4-8 weeks of engineering work — this is not optional for SaMD",
      "Silent-mode prospective validation lets Lakewood collect real-world performance data without patient risk"
    ]
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["FDA 21 CFR 820", "21 CFR Part 11", "IEC 62304", "ISO 14971", "HIPAA", "Joint Commission NPSG"],
    "blockingIssues": [
      "No FDA 510(k) or De Novo clearance",
      "No 21 CFR Part 11 compliant audit trail",
      "No prospective clinical validation"
    ],
    "warnings": [
      "Pediatric performance below clinical utility threshold",
      "Alert fatigue risk at current specificity",
      "No data drift monitoring"
    ]
  },

  "agentVotes": {
    "clinical-advisor": { "vote": "reject", "confidence": 0.72 },
    "compliance-officer": { "vote": "reject", "confidence": 0.45 },
    "patient-safety-officer": { "vote": "reject", "confidence": 0.51 },
    "health-informatics": { "vote": "conditional_approve", "confidence": 0.63 }
  }
}
```

### Phase 4: Ethics & Patient Safety Gate

```json
{
  "ethicsCheck": {
    "passed": true,
    "biasDetected": true,
    "fairnessScore": 0.81,
    "patientSafetyGate": "HOLD",
    "notes": [
      "Age-based performance disparity detected: pediatric AUROC 0.78 vs adult 0.91 — flagged for clinical review",
      "Training data demographic analysis recommended before deployment to assess racial/ethnic performance disparities",
      "No evidence of socioeconomic bias in current analysis, but prospective validation should stratify by insurance status"
    ]
  }
}
```

The ethics check identified a critical fairness issue: the age-based performance disparity is not just a technical limitation — it's an equity concern. If SepsisSense is deployed for adults but not children, pediatric patients receive a lower standard of AI-assisted care. This must be documented in the clinical justification and disclosed to the IRB.

---

## What the Board Sees

> "SepsisSense shows strong potential — 91% AUROC, 87% sensitivity — but three issues block immediate deployment. First, it's a Class II medical device under FDA rules and we don't have clearance. Second, the 82% specificity would generate 5+ false alerts per ICU shift, risking alert fatigue that could make outcomes *worse* than our current manual screening. Third, our logging infrastructure doesn't meet federal electronic records requirements.
>
> We recommend a 90-day rapid validation pathway: silent-mode prospective validation in two ICUs, specificity improvement, and parallel FDA Pre-Submission. Council reconvenes at Day 90 with real-world data for a go/no-go decision. The clinical urgency is real — every month of delay has patient cost — but premature deployment carries both regulatory and safety risk."

The Patient Safety Officer's calculation — that alert fatigue could reduce effective sensitivity to 54.8%, *below* current manual screening — is the kind of insight that changes decisions. No single-model prompt would reliably model the interaction between false positive rate, nurse compliance, and effective sensitivity. It came from an agent whose mandate is to think about how tools fail in practice, not just how they perform in validation.

---

## Available Healthcare Council Modes

| Mode | Category | Lead Agent | Frameworks |
|------|----------|------------|------------|
| **Clinical Review Board** | Major | Clinical Advisor | HIPAA, CMS CoP, Joint Commission |
| **SaMD Approval Council** | Major | Patient Safety Officer | FDA 21 CFR 820, IEC 62304, ISO 14971 |
| **Patient Safety Council** | Major | Patient Safety Officer | Joint Commission, CMS, AHRQ |
| **Care Coordination Council** | Major | Care Coordinator | CMS Care Transitions, BPCI, ACO |
| **Ethics Consultation Council** | Major | Clinical Advisor | AMA Ethics, Advance Directives, HIPAA |
| **Diagnosis Support** | Clinical | Clinical Advisor | FDA CDS Guidance, HIPAA |
| **Medication Review** | Clinical | Clinical Advisor | FDA Drug Safety, CMS MTM |

---

*For the benchmark comparison between Council deliberation and single-model inference, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For the Financial Services walkthrough, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md).*
