# Government End-to-End Walkthrough

**From acquisition requirement to protest-proof decision packet in 75 seconds.**

This walkthrough follows a realistic federal procurement scenario through the Datacendia Government vertical: a Source Selection Council evaluating three competing proposals for a $47M IT modernization contract. The Council deliberates across FAR compliance, technical merit, cost analysis, and past performance — surfacing evaluation flaws that would survive a GAO protest.

---

## The Scenario

Three companies bid on a $47 million contract. The losing bidder will protest to the GAO. Your evaluation has to be bulletproof — and your team has 72 hours to finalize the source selection decision document.

You are the Source Selection Authority at a **mid-size federal agency** running an IT modernization program. The agency's legacy case management system (20 years old, COBOL-based) must be replaced. After a full and open competition under FAR Part 15, three offerors submitted proposals.

**Key facts:**
- Contract type: Firm Fixed Price, 5-year period of performance (1 base + 4 options)
- Total evaluated price range: $41M - $53M across offerors
- Evaluation factors (descending order of importance): Technical Approach, Past Performance, Management Approach, Price
- Technical is "significantly more important" than Price per the solicitation
- FISMA High baseline required (NIST 800-53 Rev 5)
- FedRAMP authorization required for cloud components
- Incumbent contractor (Offeror B) submitted a proposal
- 500+ users, 12 field offices, classified enclave integration required

**The three offerors:**

| | Offeror A (Apex Federal) | Offeror B (ByteGov — Incumbent) | Offeror C (CloudFirst Solutions) |
|---|---|---|---|
| **Total Price** | $47.2M | $41.8M | $52.9M |
| **Technical Rating** | Outstanding | Good | Outstanding |
| **Past Performance** | Satisfactory | Substantial Confidence | Substantial Confidence |
| **Management** | Outstanding | Satisfactory | Good |
| **FedRAMP Status** | In process (expected 4 months) | N/A (on-prem proposed) | Authorized (IL5) |
| **Transition Risk** | Moderate (new to agency) | Low (incumbent) | Moderate (cloud migration) |

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
    "question": "Which offeror should be selected for the $47M IT modernization contract? Three proposals received under FAR Part 15 best value. Technical is significantly more important than Price. Incumbent (Offeror B) is lowest price but rated Good on Technical. Offeror A is Outstanding/Outstanding but $5.4M higher. Offeror C is Outstanding but highest price with FedRAMP IL5 already authorized.",
    "context": {
      "vertical": "government",
      "councilMode": "source-selection-council"
    },
    "config": {
      "maxRounds": 10,
      "enableCrossExamination": true,
      "requireConsensus": false
    }
  }'
```

The Source Selection Council activates 4 agents:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Procurement Officer** | Federal Acquisition | FAR/DFARS compliance, fair competition | deepseek-r1:32b (temp 0.3) |
| **Legal Counsel** | Government Legal Advisory | Legally sound, protest-defensible decisions | qwen3:32b (temp 0.4) |
| **Program Manager** | Federal Program Execution | On-time, on-budget delivery | qwen3:32b (temp 0.4) |
| **Budget Analyst** | Federal Budget & Finance | Responsible stewardship of public funds | qwen3:32b (temp 0.4) |

Regulatory frameworks enforced: **FAR Part 15, DFARS, Competition in Contracting Act.**

---

### Phase 1: Initial Analysis

---

**Procurement Officer** (confidence: 0.68)

> **Evaluation Analysis: OFFEROR A IS BEST VALUE — WITH DOCUMENTATION GAPS**
>
> Applying FAR 15.308 source selection principles:
>
> The solicitation states Technical is "significantly more important" than Price. Under established GAO case law (e.g., *Lockheed Martin Corp.*, B-418766), when technical is significantly more important, the agency may properly select a higher-priced, higher-rated offeror — but must document *why* the technical superiority is worth the price premium.
>
> Comparative analysis:
>
> | Factor | Offeror A (Apex) | Offeror B (ByteGov) | Offeror C (CloudFirst) |
> |--------|:---:|:---:|:---:|
> | **Technical** | Outstanding | Good | Outstanding |
> | **Past Performance** | Satisfactory | Substantial Confidence | Substantial Confidence |
> | **Management** | Outstanding | Satisfactory | Good |
> | **Price** | $47.2M | $41.8M | $52.9M |
> | **Best Value Assessment** | **Recommended** | Not recommended | Not recommended |
>
> **Offeror A vs. Offeror B:** The $5.4M price premium (12.9%) is justified by the two-adjectival-rating advantage on Technical (Outstanding vs. Good) and Management (Outstanding vs. Satisfactory). Under FAR 15.101-1, this is a textbook best value tradeoff — but the Source Selection Decision Document (SSDD) must articulate *specific technical discriminators* that justify the premium. Generic statements like "Offeror A demonstrated a superior approach" will not survive a protest.
>
> **Offeror A vs. Offeror C:** Both are Outstanding on Technical, but Offeror A is $5.7M lower and rated Outstanding on Management vs. Good. Offeror C's FedRAMP IL5 authorization is a significant strength, but not enough to overcome the price and management differential.
>
> **Critical gap I need to flag:** Offeror A's FedRAMP authorization is "in process (expected 4 months)." If the system requires FedRAMP at contract start, this is a definitive weakness. If FedRAMP can be achieved during the transition period, it's a risk to be documented. The solicitation requirements need to be checked against L/M instructions.
>
> **Preliminary position: SELECT OFFEROR A** with robust SSDD documenting technical discriminators and FedRAMP risk mitigation.

---

**Legal Counsel** (confidence: 0.55)

> **Protest Risk Analysis: MODERATE — THREE VULNERABILITIES**
>
> If Offeror B (incumbent, lowest price) protests to the GAO, they will likely argue:
>
> 1. **The tradeoff rationale is conclusory.** GAO sustains protests when agencies pay a price premium for technical superiority but don't explain *what specific advantages* justify the cost. (*DynCorp Int'l LLC*, B-411465: "The agency must explain why the technical advantages are worth the additional cost.") The SSDD must contain specific discriminators, not adjectival summaries.
>
> 2. **Disparate treatment on past performance.** Offeror A is rated "Satisfactory" on Past Performance while Offeror B is "Substantial Confidence." In a best value tradeoff, the agency must explain why it discounted Offeror B's superior past performance rating. If the evaluators didn't document this reasoning, it's a GAO vulnerability.
>
> 3. **FedRAMP risk not adequately evaluated.** If FedRAMP authorization was a stated requirement and Offeror A doesn't have it, the agency must explain why it accepted this risk. If the evaluation record doesn't show the evaluators considered this, Offeror B will argue the evaluation was unreasonable.
>
> **Offeror C protest risk:** Low. Offeror C is highest price with no clear technical superiority over Offeror A. Unlikely to protest.
>
> **Recommended actions before signing SSDD:**
> - [ ] Document 3-5 specific technical discriminators from Offeror A's proposal
> - [ ] Address past performance differential in tradeoff narrative
> - [ ] Document FedRAMP risk assessment and mitigation plan
> - [ ] Verify evaluation record shows all factors were considered per the solicitation
>
> **Preliminary position: SUPPORT OFFEROR A** if documentation gaps are closed. **WARN against signing** the SSDD in its current form.

---

**Program Manager** (confidence: 0.61)

> **Execution Risk Assessment**
>
> From a program delivery perspective:
>
> | Risk Factor | Offeror A | Offeror B | Offeror C |
> |------------|:---:|:---:|:---:|
> | Transition Risk | ⚠️ Moderate — new to agency | ✅ Low — incumbent | ⚠️ Moderate — cloud migration |
> | Technical Risk | ✅ Low — Outstanding approach | ⚠️ Moderate — Good approach | ✅ Low — Outstanding approach |
> | Schedule Risk | ⚠️ FedRAMP 4-month dependency | ✅ Low — in place | ✅ Low — FedRAMP authorized |
> | Cost Risk | ✅ Firm fixed price | ✅ Firm fixed price | ⚠️ Highest price, FFP |
> | Key Personnel | ✅ Named, available | ⚠️ Retention risk (2 of 5 key staff have LinkedIn activity suggesting job searching) | ✅ Named, available |
> | FISMA High Compliance | ⚠️ In process | ✅ Currently compliant | ✅ IL5 — exceeds requirement |
>
> **The overlooked risk with Offeror B:** The incumbent advantage is real for transition, but ByteGov proposed maintaining the existing COBOL-based architecture with a modernization layer. Their Technical rating of "Good" likely reflects this incremental approach. After 5 years, the agency would still have COBOL dependencies. Offeror A's "Outstanding" Technical rating presumably reflects a clean-break modernization. The *lifecycle cost* of keeping COBOL for another 5 years — including maintenance staff scarcity, security patching difficulty, and inability to integrate with modern APIs — likely exceeds the $5.4M price premium.
>
> **Preliminary position: SUPPORT OFFEROR A** — the short-term price premium is offset by long-term technical debt avoidance.

---

**Budget Analyst** (confidence: 0.64)

> **Fiscal Analysis**
>
> | | Offeror A | Offeror B | Offeror C |
> |---|:---:|:---:|:---:|
> | **Total Evaluated Price** | $47.2M | $41.8M | $52.9M |
> | **Price per User** | $94,400 | $83,600 | $105,800 |
> | **Annual Cost** | $9.44M | $8.36M | $10.58M |
> | **Premium over Lowest** | +$5.4M (+12.9%) | Baseline | +$11.1M (+26.6%) |
>
> The $5.4M premium for Offeror A is within the range agencies typically pay for superior technical ratings. GAO precedent generally supports premiums of 10-20% when technical is significantly more important than price.
>
> **Budget availability:** The program's enacted appropriation is $52M over 5 years. All three offerors are within budget. However, selecting Offeror A leaves $4.8M in management reserve, while Offeror B leaves $10.2M. The management reserve difference is significant — it provides 2× more contingency for scope changes, option exercises, and unforeseen requirements.
>
> **However:** If the Program Manager's COBOL lifecycle cost estimate is correct, Offeror B's apparent savings of $5.4M would be consumed by legacy maintenance costs within 2-3 years post-period-of-performance. The true total cost of ownership favors Offeror A.
>
> **Preliminary position: SUPPORT OFFEROR A** — price premium justified by technical superiority and TCO analysis.

---

### Phase 2: Cross-Examination

---

**Legal Counsel → Procurement Officer:**

> **Challenge:** You recommend Offeror A but haven't addressed the past performance disparity. Offeror A is "Satisfactory" while Offeror B is "Substantial Confidence." Under FAR 15.305(a)(2), past performance is a mandatory evaluation factor. If the SSDD doesn't explain why the agency is accepting lower past performance confidence for the selected offeror, GAO will sustain a protest. How do you address this?

**Procurement Officer (Response):**

> The Legal Counsel raises a valid vulnerability. Under *Booz Allen Hamilton*, B-417418, GAO held that agencies must account for all evaluation factors in the tradeoff decision, including past performance.
>
> The resolution: "Satisfactory" past performance with relevant contracts is not a weakness — it means Offeror A performed adequately on previous contracts. "Substantial Confidence" means the agency has high confidence Offeror B will perform based on their track record. The SSDD should state:
>
> *"While Offeror B's past performance record provides Substantial Confidence, this advantage is outweighed by Offeror A's significantly superior Technical and Management approaches. Both offerors have acceptable past performance records; the past performance differential is less discriminating than the Technical differential in this evaluation."*
>
> This explicitly acknowledges the differential, explains the weight given to it, and documents why the technical factors are more discriminating. This is the language pattern that survives GAO review.

---

**Program Manager → Legal Counsel:**

> **Challenge:** You identified the FedRAMP risk but didn't propose a contractual solution. Can we mitigate this through a CLIN structure that ties FedRAMP authorization to a payment milestone? That way the agency has contractual recourse if Offeror A fails to achieve FedRAMP on schedule.

**Legal Counsel (Response):**

> Yes — and this is the correct approach. The contract should include:
>
> 1. **CLIN structure:** Separate CLIN for the cloud migration phase, with payment contingent on FedRAMP authorization. No payment for cloud services until ATO is granted.
> 2. **Section H Special Clause:** "The contractor shall achieve FedRAMP authorization within 120 calendar days of contract award. Failure to achieve authorization constitutes grounds for termination for default under FAR 52.249-8."
> 3. **Risk mitigation in SSDD:** Document that the agency evaluated the FedRAMP risk, found it acceptable based on Offeror A's FedRAMP-in-process status and the contractual mitigation above.
>
> This addresses Offeror B's likely protest argument *and* protects the agency if Offeror A can't deliver. **I upgrade my confidence that the SSDD can be made protest-proof.**

---

**Budget Analyst → Program Manager:**

> **Point of agreement:** Your COBOL lifecycle cost analysis is the most important point no one else made. Can you estimate the specific dollar value? If we can quantify "keeping COBOL costs $X over 10 years vs. modernizing," that strengthens both the SSDD tradeoff narrative and the budget justification to OMB.

**Program Manager (Response):**

> Estimated COBOL maintenance lifecycle cost (years 6-10, post-contract):
>
> | Cost Category | Offeror A (Modern) | Offeror B (COBOL+Layer) |
> |---------------|:---:|:---:|
> | Annual maintenance | $1.2M | $3.8M |
> | COBOL developer staffing (scarce) | $0 | $1.4M |
> | Security patching (legacy) | $0.2M | $0.9M |
> | Integration costs (new systems) | $0.3M | $1.1M |
> | **5-Year Post-Contract TCO** | **$8.5M** | **$36.0M** |
> | **10-Year Total (contract + post)** | **$55.7M** | **$77.8M** |
>
> Offeror B saves $5.4M upfront but costs **$22.1M more** over 10 years. The SSDD should reference this as a Total Cost of Ownership consideration — GAO supports TCO analysis when documented in the evaluation record.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_gov_2b3c4d5e-6f7a-8b9c-0d1e-2f3a4b5c6d7e",
  "status": "completed",
  "durationMs": 61247,
  "confidenceScore": 0.74,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "SELECT OFFEROR A (Apex Federal) at $47.2M. Close three documentation gaps before signing SSDD.",
    "summary": "The Council unanimously recommends Offeror A as best value. The $5.4M premium over the incumbent is justified by Outstanding vs. Good on Technical and Outstanding vs. Satisfactory on Management — a two-factor, two-rating advantage where Technical is significantly more important than Price. Total cost of ownership analysis shows Offeror A saves $22.1M over 10 years by eliminating COBOL dependencies. Three documentation gaps must be closed before signing the SSDD to make the decision protest-proof.",

    "requiredActions": [
      "1. Document 3-5 specific technical discriminators from Offeror A's proposal in the SSDD",
      "2. Address past performance differential: explicitly state why Technical superiority outweighs Offeror B's higher confidence rating",
      "3. Document FedRAMP risk assessment and include contractual mitigation (CLIN milestone + Special Clause H)",
      "4. Include TCO analysis in evaluation record showing 10-year cost advantage",
      "5. Have Legal Counsel review final SSDD for protest vulnerability before SSA signature"
    ],

    "keyInsights": [
      "The $5.4M 'premium' becomes a $22.1M savings when COBOL lifecycle costs are included over 10 years",
      "FedRAMP risk is real but contractually mitigatable — CLIN milestone + termination clause",
      "Past performance differential must be explicitly addressed in SSDD or Offeror B wins at GAO",
      "Offeror B's COBOL maintenance layer approach creates 5+ years of additional technical debt"
    ]
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["FAR Part 15", "FAR 15.101-1", "FAR 15.305(a)(2)", "FAR 15.308", "FAR 52.249-8", "Competition in Contracting Act", "FISMA"],
    "blockingIssues": [],
    "warnings": [
      "SSDD documentation gaps create GAO protest vulnerability if not addressed",
      "FedRAMP in-process status requires contractual mitigation",
      "Past performance differential must be explicitly documented in tradeoff narrative"
    ]
  },

  "agentVotes": {
    "procurement-officer": { "vote": "approve_offeror_a", "confidence": 0.72 },
    "legal-counsel": { "vote": "approve_offeror_a", "confidence": 0.68 },
    "program-manager": { "vote": "approve_offeror_a", "confidence": 0.75 },
    "budget-analyst": { "vote": "approve_offeror_a", "confidence": 0.70 }
  }
}
```

---

## What the Source Selection Authority Sees

> "All four Council agents recommend Offeror A (Apex Federal) at $47.2M. The $5.4M premium over the incumbent is justified by two-factor technical superiority and a $22.1M total cost of ownership advantage over 10 years — the incumbent's COBOL maintenance approach costs more in years 6-10 than the modernization premium costs now.
>
> Before I sign the SSDD, Legal Counsel identified three documentation gaps that would create GAO protest vulnerability: the tradeoff narrative needs specific technical discriminators, the past performance differential needs explicit treatment, and the FedRAMP risk needs contractual mitigation language. Estimated time to close: 48 hours."

The Program Manager's COBOL lifecycle cost analysis — showing the "cheaper" incumbent actually costs $22.1M more over 10 years — is the insight that transforms this from a close call into a clear decision. It also provides the quantitative ammunition the SSDD needs to survive a protest. That analysis came from an agent whose mandate is program delivery, not acquisition compliance — which is exactly why a multi-agent deliberation caught it and a single evaluation wouldn't.

---

## Available Government Council Modes

| Mode | Category | Lead Agent | Frameworks |
|------|----------|------------|------------|
| **Source Selection Council** | Major | Procurement Officer | FAR Part 15, DFARS, CICA |
| **Budget Review Council** | Major | Budget Analyst | OMB A-11, GPRA, Budget Control Act |
| **Policy Development Council** | Major | Policy Analyst | APA, EO 12866, Regulatory Flexibility Act |
| **Cybersecurity War Room** | Major | IT Security Officer | FISMA, FedRAMP, NIST 800-53 |
| **IG Audit Response Council** | Major | Compliance Officer | IG Act, GPRA, FMFIA, DATA Act |
| **Acquisition Planning** | Procurement | Procurement Officer | FAR Part 7, FAR Part 10 |
| **Protest Response Council** | Procurement | Legal Counsel | GAO Bid Protest Regs, CICA, FAR Part 33 |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md) and [HEALTHCARE_WALKTHROUGH.md](HEALTHCARE_WALKTHROUGH.md).*
