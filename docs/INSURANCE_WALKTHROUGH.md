# Insurance End-to-End Walkthrough

**From claim submission to fraud-reviewed adjudication decision in 55 seconds.**

This walkthrough follows a realistic workers' compensation scenario through the Datacendia Insurance vertical: a Claims Review Board adjudicating a $1.4M workers' comp claim where the fraud detection system has flagged anomalies — but the claimant may be a legitimately injured worker whose claim patterns happen to match fraud indicators. Four agents deliberate across claims handling, fraud investigation, actuarial analysis, and compliance — producing a decision that's both defensible against bad faith claims and protective of genuine claimants.

The pivotal tension: **the fraud indicators are real, but so is the injury.** The question isn't whether to pay or deny — it's whether the fraud signals are artifacts of a complex legitimate claim or evidence of actual fraud. Getting it wrong in either direction is catastrophic.

---

## The Scenario

A warehouse foreman says he fell off a loading dock and can't work. His MRI confirms a herniated disc. His surgeon recommends fusion surgery at $187,000. His employer's safety camera was "under maintenance" that day. His attorney filed before he even saw a doctor. And your SIU database shows his attorney has filed 47 workers' comp claims in the last 18 months — all at the same three medical providers.

But here's the thing: herniated discs are real. Loading docks are dangerous. And if you deny a legitimate claim because the attorney is suspicious, you're looking at a bad faith lawsuit that costs 10× the claim.

You are the **VP of Claims** at **Keystone Mutual Insurance**, a regional workers' compensation carrier writing $620M in premium across 8 states. A claim has been flagged by both the automated fraud scoring system and a field adjuster's instincts.

**Key facts:**
- Claimant: Robert Vasquez, 48, warehouse foreman, 12 years with employer
- Employer: Pacific Distribution Services (1,200 employees, good loss history)
- Injury: L4-L5 herniated disc, claimed from fall off loading dock (4-foot drop)
- Date of injury: January 14, 2025 — reported January 17 (3-day delay)
- Medical: MRI confirms L4-L5 herniation; surgeon recommends fusion ($187,000)
- Lost wages claim: $2,840/week × estimated 26 weeks = $73,840
- Total reserve: $1.4M (including surgery, rehab, potential permanent disability)
- Fraud score: 74/100 (threshold for SIU referral: 70)
- Fraud indicators flagged:
  - Attorney representation before first medical visit
  - 3-day reporting delay
  - Surveillance camera "under maintenance" on date of loss
  - Attorney (Ramos & Associates) linked to 47 WC claims in 18 months
  - 3 of the same medical providers used across 31 of those 47 claims
  - Claimant has prior WC claim (2019, shoulder, different employer, settled $42K)
- Counter-indicators:
  - 12 years employment, no disciplinary issues
  - MRI objectively confirms herniation
  - Employer confirms Vasquez was scheduled to work loading dock that day
  - Co-worker witness statement corroborates fall (but didn't see it directly)
  - Prior 2019 claim was legitimate (employer confirmed)

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
    "question": "Should Keystone Mutual approve, deny, or investigate the Vasquez workers comp claim? MRI-confirmed L4-L5 herniation, $1.4M reserve, fraud score 74/100. Attorney linked to 47 claims at same 3 providers. But claimant has 12 years tenure, objective medical findings, and a corroborating witness. Is this fraud or a legitimate claim with coincidental fraud indicators?",
    "context": {
      "vertical": "insurance",
      "councilMode": "claims-review-board"
    },
    "config": {
      "maxRounds": 10,
      "enableCrossExamination": true,
      "requireConsensus": false
      // 10 rounds — fraud vs. legitimate claim requires adversarial testing of both hypotheses
    }
  }'
```

The Claims Review Board activates 4 agents:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Claims Director** | Claims Authority | Fair and efficient claims handling | deepseek-r1:32b (temp 0.3) |
| **Chief Actuary** | Reserving & Analysis | Actuarial soundness, loss development | qwen3:32b (temp 0.4) |
| **Fraud Investigator** | SIU Analysis | Fraud detection, evidence preservation | qwen3:32b (temp 0.4) |
| **Compliance Officer** | Regulatory | Unfair claims practices compliance, bad faith avoidance | qwen3:32b (temp 0.4) |

Regulatory frameworks enforced: **State Unfair Claims Practices Act, NAIC Model Laws, State Fraud Reporting Requirements.**
Fairness test: **REQUIRED.**

---

### Phase 1: Initial Analysis

---

**Claims Director** (confidence: 0.55)

> **Claims Assessment: LEGITIMATE INJURY WITH SUSPICIOUS SURROUNDING CIRCUMSTANCES**
>
> Let me separate what we know from what we suspect:
>
> **What is objectively established:**
> - MRI confirms L4-L5 herniation — this is a real injury, not manufactured
> - Vasquez was scheduled on the loading dock that day — employer confirms
> - A co-worker corroborates a fall, though didn't witness the moment of impact
> - 12 years of employment with no disciplinary issues — this is not a serial claimant
> - Prior 2019 claim was legitimate per the previous employer
>
> **What is suspicious but not dispositive:**
> - Attorney retained before first medical visit — unusual, but some workers know attorneys from prior claims
> - 3-day reporting delay — within the typical range; many workers try to tough it out before reporting
> - Camera "under maintenance" — concerning, but Keystone has no evidence of tampering
> - Attorney's claim volume and provider concentration — this is about the *attorney*, not the *claimant*
>
> **My core concern:** The fraud indicators all point to the attorney and the provider network, not to Vasquez himself. If Ramos & Associates is running a medical provider mill, Vasquez may be a legitimate claimant who was recruited into a fraud scheme *after* his real injury. This changes the investigation target from the claimant to the attorney-provider ring.
>
> **Preliminary position: APPROVE THE CLAIM with conditions.** Authorize medical treatment and indemnity payments. Simultaneously open an SIU investigation of the attorney-provider network — not the claimant. Denying a legitimate MRI-confirmed herniation because the attorney is suspicious is textbook bad faith.

---

**Fraud Investigator** (confidence: 0.68)

> **SIU Assessment: ATTORNEY-PROVIDER RING — HIGH PROBABILITY**
>
> The fraud score of 74 is driven almost entirely by the attorney-provider pattern, not the claimant's behavior. Let me decompose it:
>
> | Indicator | Weight | Fraud Signal | Alternative Explanation |
> |-----------|:---:|:---:|:---:|
> | Attorney before medical | 12 pts | Pre-arranged representation | Prior relationship from 2019 claim |
> | 3-day reporting delay | 8 pts | Coordinating story | Worker trying to avoid claim |
> | Camera unavailable | 15 pts | Evidence suppression | Coincidental maintenance |
> | Attorney volume (47 claims) | 22 pts | **Claim mill** | High-volume practice (unlikely at this rate) |
> | Provider concentration (31/47) | 17 pts | **Kickback arrangement** | Convenient location (unlikely for 3 providers) |
> | Prior claim | — | Pattern claimant | Legitimate prior injury |
>
> **The 39 points from attorney volume + provider concentration are the real signal.** Everything else has plausible alternative explanations. Here's what 47 claims in 18 months at the same 3 providers actually looks like:
>
> - That's 2.6 claims per month, all workers' comp
> - 66% of those claims used the same 3 providers
> - Industry average for a single-attorney WC practice: 8-12 claims per month, across 15-20 providers
> - The provider concentration is **5× higher than normal** — this is a statistical outlier that screams organized referral
>
> **But here's what I need to flag clearly:** The attorney-provider ring may be real AND Vasquez's injury may be real. These are not mutually exclusive. In fact, the most common pattern in medical provider mills is that they recruit legitimately injured workers, then inflate the treatment. The injury gets them in the door; the mill inflates the bills.
>
> **Specific concerns about the treatment plan:**
> - Fusion surgery at $187,000 for a single-level herniation is at the **95th percentile** of cost. The median for L4-L5 fusion in this state is $112,000.
> - The surgeon (Dr. Patel, Pacific Spine Associates) is one of the 3 concentrated providers — 14 of the 31 concentrated claims went to Dr. Patel
> - Has conservative treatment been exhausted? Physical therapy, epidural injections, and pain management typically precede fusion by 6-12 months
>
> **Preliminary position: DO NOT APPROVE FUSION SURGERY at this provider.** Approve the claim for indemnity and conservative treatment. Request an Independent Medical Examination (IME) for the surgical recommendation. Simultaneously refer the attorney-provider pattern to the state fraud bureau.

---

**Chief Actuary** (confidence: 0.72)

> **Actuarial Assessment: RESERVE IS INFLATED IF TREATMENT IS REDIRECTED**
>
> The $1.4M reserve assumes the full treatment plan as proposed (fusion surgery at Dr. Patel). If the treatment path changes, the reserve picture changes dramatically:
>
> | Scenario | Medical | Indemnity | Total Reserve | Probability |
> |----------|:---:|:---:|:---:|:---:|
> | A: Fusion at Dr. Patel ($187K) | $287K | $204K | **$491K** | 20% |
> | B: Fusion at independent surgeon ($112K) | $212K | $204K | **$416K** | 30% |
> | C: Conservative treatment succeeds | $45K | $98K | **$143K** | 35% |
> | D: Fraud confirmed, claim denied | $12K | $0 | **$12K** | 15% |
> | **Expected value** | | | **$276K** | |
>
> **The $1.4M reserve is overstated by $1.1M.** That's because the initial reserve assumed worst-case (full surgery + permanent disability + future medical). Once we separate the legitimate injury from the inflated treatment plan, the expected value drops to $276K.
>
> **Key actuarial finding:** Even if we accept the injury as 100% legitimate and fund appropriate treatment, the cost is $416K (Scenario B), not $1.4M. The difference — **$984K** — is the actuarial cost of the inflated treatment plan. That $984K is what the provider mill is extracting.
>
> **Across the 47 claims:** If the attorney-provider ring is inflating treatment by a similar margin on each claim, the total overpayment across the book is estimated at:
>
> ```
> 47 claims × average inflation of ~$600K per claim = ~$28.2M in total ring exposure
> ```
>
> **This is not a single-claim problem. It's a $28M portfolio exposure.**
>
> **Preliminary position: REDUCE RESERVE to $416K (Scenario B). Approve claim with independent surgeon. Escalate the ring-level exposure to executive leadership.**

---

**Compliance Officer** (confidence: 0.81)

> **Regulatory Assessment: BAD FAITH RISK IS THE PRIMARY LEGAL EXPOSURE**
>
> | Compliance Area | Status | Risk |
> |----------------|--------|------|
> | **Unfair Claims Practices Act** | ⚠️ | Denying an MRI-confirmed claim based on attorney suspicion = unfair claims practice |
> | **State Fraud Reporting** | ⚠️ | We are required to report suspected fraud to the state fraud bureau — have we? |
> | **Prompt Payment** | ⚠️ | Indemnity payments must begin within 14 days of accepted claim in this state |
> | **Bad Faith Liability** | 🔴 | **If we deny this claim and Vasquez sues, the bad faith damages could be 3-5× the claim value** |
> | **NAIC Model Laws** | ✅ | IME request is within our rights under the policy |
>
> **The math on bad faith is simple and terrifying:**
> - Claim value (legitimate): ~$416K
> - Bad faith multiplier in this jurisdiction: 3-5×
> - Bad faith exposure if we wrongly deny: **$1.2M - $2.1M**
> - Cost of approving + IME + fraud bureau referral: **~$420K**
>
> **We save $416K by denying. We risk $2.1M in bad faith if we're wrong.** The expected value of denial is *negative* even if there's a 60% chance the claim is fraudulent — which our analysis does not support.
>
> **Critical compliance finding:** We are **required by state law** to report the attorney-provider pattern to the state fraud bureau regardless of what we do with this claim. If we have evidence of a fraud ring and fail to report it, we face regulatory sanctions. This reporting obligation exists independently of the Vasquez claim decision.
>
> **Preliminary position: APPROVE CLAIM. Report attorney-provider ring. Request IME for surgical recommendation.** This is the only position that satisfies all regulatory requirements simultaneously.

---

### Phase 2: Cross-Examination

---

**Fraud Investigator → Claims Director:**

> **Challenge:** You recommend approving the claim with an SIU investigation of the attorney-provider network. But if we approve the claim while investigating, and the investigation later reveals Vasquez *was* complicit, we've paid out on a fraudulent claim and set a precedent. How do we protect the company?

**Claims Director (Response):**

> We protect the company by controlling the *treatment path*, not the claim itself.
>
> 1. **Accept the claim** — the injury is objectively real (MRI-confirmed). We can't deny an objective injury.
> 2. **Approve indemnity** — lost wages are based on his actual salary, not inflated by the provider.
> 3. **Redirect treatment** — request an IME with an independent orthopedic surgeon. If the IME agrees fusion is needed, authorize it at a non-ring provider. If the IME recommends conservative treatment first, follow that protocol.
> 4. **Preserve fraud recovery rights** — if the SIU investigation later proves ring complicity, we recover via subrogation against the providers and attorney under the state fraud statute. We don't need to deny the claim upfront to preserve this right.
>
> **This approach pays for the legitimate injury (~$416K) while blocking the inflated treatment (~$984K) and preserving legal recovery rights against the ring.** The company's exposure is limited to the legitimate claim cost — which we'd pay regardless of fraud.

---

**Chief Actuary → Fraud Investigator:**

> **Point of escalation:** Your analysis shows the ring has 47 claims. If the average inflation per claim is ~$600K, and we've already paid some of those claims, what's our total incurred loss from this ring — and what's recoverable?

**Fraud Investigator (Response):**

> Preliminary analysis of the 47 claims in Keystone's book:
>
> | Status | Claims | Avg Paid | Est. Legitimate Value | Est. Inflation |
> |--------|:---:|:---:|:---:|:---:|
> | Closed/Paid | 28 | $684K | ~$280K | ~$404K |
> | Open/Reserved | 12 | $1.1M reserved | ~$380K | ~$720K |
> | New (incl. Vasquez) | 7 | $1.3M reserved | ~$350K | ~$950K |
> | **Total** | **47** | | | **~$22.8M inflation** |
>
> Of the $22.8M, approximately **$11.3M has already been paid** on closed claims. Recovery depends on whether we can prove the providers billed for unnecessary procedures. Under the state insurance fraud statute, we can pursue treble damages — meaning potential recovery of **$33.9M** if fraud is proven.
>
> **This changes the financial calculation entirely.** The Vasquez claim isn't a $416K decision — it's a gateway to a $33.9M recovery action. Every decision we make on this claim will be scrutinized in the fraud prosecution. We need to handle it impeccably.

---

**Compliance Officer → Fraud Investigator:**

> **Critical question:** Have we filed the mandatory fraud report with the state bureau yet? If the fraud indicators were flagged at intake (fraud score 74), how many days has it been? Most states require reporting within 60 days of detection.

**Fraud Investigator (Response):**

> The automated fraud score was generated at claim intake — 18 days ago. The mandatory reporting window in this state is 60 days from when "reasonable suspicion" is established. We have 42 days remaining.
>
> **However:** If we have been receiving claims from this attorney-provider ring for 18 months and the pattern was detectable in our data, a regulator could argue we should have identified the pattern earlier. This is a systemic detection failure, not just a single-claim issue.
>
> **I recommend filing the fraud bureau report within 5 business days, not 42.** Early voluntary reporting demonstrates good faith and strengthens our position if the regulator asks why we didn't catch the pattern sooner.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_ins_8f9a0b1c-2d3e-4f5a-6b7c-8d9e0f1a2b3c",
  "status": "completed",
  "durationMs": 49823,
  "confidenceScore": 0.74,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "APPROVE CLAIM. Redirect treatment. File fraud bureau report. Escalate ring-level exposure ($22.8M) to executive leadership.",
    "summary": "The Council unanimously agrees: the injury is real but the treatment plan is inflated. Approve the claim for indemnity and conservative treatment, request an IME for the surgical recommendation, redirect any surgery to an independent provider, and file the attorney-provider ring with the state fraud bureau within 5 days. The Vasquez claim is not a $1.4M decision — it's a gateway to identifying a $22.8M fraud ring with $33.9M in potential treble damage recovery.",

    "immediateActions": [
      "1. Accept the claim — authorize indemnity payments within the 14-day prompt payment window",
      "2. Approve conservative treatment (PT, pain management) at a non-ring provider",
      "3. Request Independent Medical Examination for the fusion surgery recommendation",
      "4. Reduce reserve from $1.4M to $416K (Scenario B — fusion at independent surgeon)",
      "5. File attorney-provider fraud ring report with state fraud bureau within 5 business days",
      "6. Escalate ring-level exposure ($22.8M inflation, $33.9M potential recovery) to CEO/General Counsel"
    ],

    "keyInsights": [
      "The fraud indicators point to the attorney-provider ring, not the claimant — Vasquez's injury is MRI-confirmed and objectively real",
      "The $1.4M reserve is overstated by $984K — the inflation IS the fraud, not the claim itself",
      "Bad faith exposure from wrongful denial ($1.2-2.1M) exceeds the claim value ($416K) — denial is economically irrational",
      "This is not a single-claim problem: 47 claims, $22.8M estimated inflation, $33.9M potential treble recovery",
      "The fraud bureau report must be filed regardless of the claim decision — it's a statutory obligation",
      "Handling this claim impeccably strengthens the eventual fraud prosecution — every action will be scrutinized"
    ]
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["State Unfair Claims Practices Act", "NAIC Model Laws", "State Fraud Reporting Statute", "Prompt Payment Requirements"],
    "filingRequired": ["State fraud bureau report within 5 business days (mandatory)", "NICB referral for attorney-provider ring"],
    "badFaithProtection": "Claim acceptance + IME + independent provider redirect provides full bad faith defense"
  },

  "agentVotes": {
    "claims-director": { "vote": "approve_with_redirect", "confidence": 0.72 },
    "fraud-investigator": { "vote": "approve_investigate_ring", "confidence": 0.68 },
    "chief-actuary": { "vote": "approve_reduce_reserve", "confidence": 0.78 },
    "compliance-officer": { "vote": "approve_report_ring", "confidence": 0.81 }
  }
}
```

### Phase 4: Ethics & Fairness Gate

```json
{
  "ethicsCheck": {
    "passed": true,
    "fairnessScore": 0.87,
    "biasDetected": false,
    "notes": [
      "Claim decision based on objective medical evidence, not claimant demographics or attorney association",
      "Prior claim history (2019 shoulder) not used as a negative factor — prior claim was confirmed legitimate",
      "Treatment redirect based on cost outlier analysis and provider concentration, not claimant characteristics",
      "IME request is a standard claims handling tool, not a punitive measure"
    ]
  }
}
```

---

## What the VP of Claims Tells the Board

> "Vasquez has a real injury — MRI-confirmed herniated disc. We're approving the claim and paying indemnity. But the treatment plan is inflated by approximately $984K, driven by an attorney-provider ring that has submitted 47 claims through the same 3 medical providers in 18 months.
>
> We're redirecting treatment to an independent surgeon, requesting an IME, and filing a fraud bureau report within 5 days. The Vasquez claim itself costs us ~$416K. The ring has an estimated $22.8M in inflated claims, with $33.9M in potential treble damage recovery if fraud is proven.
>
> The Actuary's finding was decisive: the $1.4M reserve was overstated by $984K because it assumed the inflated treatment plan was legitimate. Once you separate the real injury from the ring inflation, the reserve drops to $416K. That $984K difference — multiplied across 47 claims — is the fraud. Not the injury. The injury is real."

The Chief Actuary's reserve decomposition — showing that the $1.4M reserve is $984K of ring inflation layered on top of a $416K legitimate claim — is the insight that reframes the entire decision. Without it, the claim looks like a binary choice: pay $1.4M or deny and risk bad faith. With it, the choice becomes: pay $416K for the legitimate injury, block $984K in fraud, and pursue $33.9M in recovery. That's a fundamentally different decision, and it only emerges when an actuarial agent models the scenarios separately rather than accepting the reserve at face value.

---

## Available Insurance Council Modes

| Mode | Category | Lead Agent | Frameworks |
|------|----------|------------|------------|
| **Underwriting Committee** | Major | Chief Underwriter | State Rating Laws, NAIC |
| **Claims Review Board** | Major | Claims Director | Unfair Claims Practices, Bad Faith Laws |
| **Fraud Investigation Council** | Major | Fraud Investigator | State Fraud Reporting, NICB |
| **Catastrophe Response Council** | Major | Claims Director | State CAT Requirements, DOI Orders |
| **Reinsurance Placement Council** | Major | Chief Actuary | NAIC Credit for Reinsurance |
| **Risk Selection** | Underwriting | Chief Underwriter | State Rating Laws, Unfair Discrimination |
| **Pricing Review** | Underwriting | Chief Actuary | Rate Filing Requirements |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md) and [HEALTHCARE_WALKTHROUGH.md](HEALTHCARE_WALKTHROUGH.md).*
