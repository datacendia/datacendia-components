# Legal End-to-End Walkthrough

**From settlement demand to privilege-protected decision memo in 60 seconds.**

This walkthrough follows a realistic litigation scenario through the Datacendia Legal vertical: a corporate legal team evaluating a $28M settlement demand in a multi-plaintiff employment class action. The platform's privilege-preserving AI council deliberates across litigation strategy, settlement economics, discovery risk, and professional ethics — and surfaces a question the client doesn't want to hear but the lawyers are ethically required to ask.

The Legal vertical's killer feature: **"No source, no claim" + attorney-client privilege gates.** Every assertion is citation-enforced. Every output is privilege-tagged and protected from inadvertent disclosure.

---

## The Scenario

The CEO of your biggest client just told you, on the phone, that he will "fight this to the last dollar." He's wrong — and you know it, because you've seen the internal Slack messages that his own VP sent. If you tell the CEO what he wants to hear, you keep the client. If you tell him the truth, you might lose the relationship — but you're ethically required to do it anyway. The board meets Friday. The settlement deadline is in 10 days. And the remaining discovery production will make everything worse.

You are the **Managing Partner** at a midsize litigation firm. Your client, **Veridian Labs** (a 4,000-employee SaaS company headquartered in San Jose), is defending against a class action alleging systematic misclassification of 340 software engineers as exempt from overtime under the FLSA and California Labor Code.

**Key facts:**
- Plaintiff class: 340 current and former software engineers (2021-2025)
- Claims: FLSA overtime violations + California Labor Code §510, §1194 + waiting time penalties
- Case stage: Discovery (Rule 26(f) conference completed, document production 60% complete)
- Settlement demand: $28M (inclusive of attorney fees, received 3 days ago, 10-day deadline)
- Estimated trial cost: $4.2M (through verdict, not including appeal)
- Insurance coverage: EPLI policy with $5M limit, $500K retention
- Key evidence: Internal Slack messages from VP of Engineering describing engineers as "basically hourly workers who we pay salary to avoid overtime"
- Judge: Hon. Patricia Chen, N.D. Cal. — known for large class certifications and wage/hour expertise
- Opposing counsel: Linden & Associates — plaintiff's firm with 78% win rate in FLSA class actions
- Win probability (internal assessment): 35%
- Prior settlement authority from board: $12M

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
    "question": "Should Veridian Labs accept, counter, or reject the $28M settlement demand in Chen v. Veridian Labs (FLSA class action, 340 plaintiff class, N.D. Cal.)? Current board authority is $12M. Win probability assessed at 35%. Key evidence includes damaging internal Slack messages. 10-day deadline. CEO insists on fighting. What is our Rule 2.1 obligation?",
    "context": {
      "vertical": "legal",
      "decisionType": "settlement-approval",
      "matter": {
        "matterId": "LIT-2025-0847",
        "matterType": "litigation",
        "practiceArea": "employment",
        "privilegeLevel": "attorney-client",
        "conflictsCleared": true
      }
    },
    "config": {
      "maxRounds": 10,
      "enableCrossExamination": true,
      "requireConsensus": false,
      "privilegeEnforced": true
      // 10 rounds — settlement economics require cross-examination; privilege enforcement adds overhead
    }
  }'
```

The Legal Council activates 4 agents:

| Agent | Role | Mandate |
|-------|------|---------|
| **Litigation Strategist** | Trial Counsel | Case strategy, trial probability, motion practice |
| **Settlement Analyst** | Economic Analysis | Settlement economics, expected value, insurance |
| **Discovery Specialist** | E-Discovery & Production | Document risk, privilege review, production strategy |
| **Ethics & Compliance Counsel** | Professional Responsibility | ABA Model Rules, conflict checks, privilege protection |

Compliance frameworks enforced: **ABA Model Rules, FRCP, FRE, California Rules of Professional Conduct.**
Privilege gate: **ALL outputs tagged attorney-client privileged work product.**

---

### Phase 1: Initial Analysis

---

**Litigation Strategist** (confidence: 0.42)

> **PRIVILEGED AND CONFIDENTIAL — ATTORNEY-CLIENT COMMUNICATION**
>
> **Case Assessment: WEAK DEFENSE, STRONG PLAINTIFF**
>
> Win probability analysis by claim:
>
> | Claim | Defense Strength | Plaintiff Strength | Win Probability |
> |-------|:---:|:---:|:---:|
> | FLSA Overtime | Weak | Strong | 25% |
> | CA Labor Code §510 | Weak | Strong | 20% |
> | CA §1194 (Unpaid Wages) | Moderate | Strong | 30% |
> | Waiting Time Penalties | Moderate | Moderate | 45% |
> | **Blended** | | | **~30%** |
>
> The internal assessment of 35% win probability is optimistic. Here's why:
>
> 1. **The Slack message is devastating.** A VP of Engineering describing engineers as "basically hourly workers who we pay salary to avoid overtime" is a near-perfect plaintiff's exhibit. Under *Brinker Restaurant Corp. v. Superior Court*, 53 Cal. 4th 1004 (2012), this goes directly to employer knowledge and intent. Motion in limine to exclude will likely fail — it's a party admission under FRE 801(d)(2).
>
> 2. **Judge Chen's track record.** In the last 5 years, Judge Chen has certified 14 of 16 wage/hour class actions and granted class certification in *every* FLSA collective action before her. The probability of decertification is below 10%.
>
> 3. **The exemption analysis is fact-intensive.** The computer employee exemption (29 CFR §541.400) requires "application of systems analysis techniques and procedures." If these engineers were doing production support, bug fixes, and routine coding — which the job descriptions suggest — the exemption defense is weak.
>
> 4. **California makes it worse.** California's Labor Code exemption requirements are *more restrictive* than FLSA. Even if we win on federal claims, we likely lose on state claims. And California's §203 waiting time penalties add 30 days of wages per class member — an additional $4.1M exposure.
>
> **Motion practice options:**
> - Summary judgment: ~15% probability of full grant, ~30% partial
> - Motion to decertify class: <10% with this judge
> - Daubert challenge on damages expert: 25% — worth pursuing to reduce damages model
>
> **Preliminary position: SETTLE.** The question is at what number.

---

**Settlement Analyst** (confidence: 0.71)

> **PRIVILEGED AND CONFIDENTIAL — ATTORNEY WORK PRODUCT**
>
> **Settlement Economics:**
>
> ```
> Expected value of going to trial:
>
> Scenario 1: Defense verdict (30% probability)
>   Cost: $4.2M (trial costs) + $0 (verdict)
>   Expected: $1.26M
>
> Scenario 2: Plaintiff verdict — low (40% probability)
>   Cost: $4.2M + $18M verdict + $5.4M fees
>   Expected: $11.04M
>
> Scenario 3: Plaintiff verdict — high (25% probability)
>   Cost: $4.2M + $31M verdict + $9.3M fees + $4.1M penalties
>   Expected: $12.15M
>
> Scenario 4: Catastrophic verdict (5% probability)
>   Cost: $4.2M + $42M verdict + $12.6M fees + $4.1M penalties
>   Expected: $3.15M
>
> ═══════════════════════════════
> Expected total cost of trial: $27.6M
> Settlement demand:            $28M
>   Demand premium over EV:     $0.4M (1.4%)
> ═══════════════════════════════
> ```
>
> **The demand is remarkably close to expected trial value.** Opposing counsel has done their math. The $28M demand is not a starting position — it's their realistic assessment plus a thin margin.
>
> **Insurance analysis:**
> - EPLI limit: $5M (after $500K retention)
> - Insurance contribution to settlement: ~$4.5M (assuming carrier agrees)
> - Client out-of-pocket at $28M: $23.5M
> - Client out-of-pocket at trial (expected): $23.1M
>
> Insurance barely moves the needle. The EPLI policy is undersized for a 4,000-employee tech company with $5M in coverage.
>
> **Counter-offer modeling:**
>
> | Counter Amount | Acceptance Probability | Risk-Adjusted Cost |
> |:-:|:-:|:-:|
> | $28M (accept) | 100% | $23.5M (net of insurance) |
> | $22M | 60% | $22.2M |
> | $18M | 25% | $24.1M |
> | $15M | 10% | $25.8M |
> | $12M (current authority) | <5% | $26.7M |
>
> **Preliminary position: COUNTER at $20-22M.** Below $20M, the probability of acceptance drops too low and we risk losing the settlement window entirely. The current board authority of $12M is unrealistic — it would almost certainly be rejected, wasting the settlement window and increasing total cost.

---

**Discovery Specialist** (confidence: 0.55)

> **PRIVILEGED AND CONFIDENTIAL — ATTORNEY WORK PRODUCT**
>
> **Discovery Risk Assessment:**
>
> Document production is 60% complete. My analysis of the remaining 40%:
>
> | Risk Category | Documents Estimated | Impact |
> |--------------|:---:|--------|
> | Additional damaging Slack/email | 200-400 messages | **HIGH** — we've seen the VP's message; there are likely similar statements from managers |
> | Timekeeping records showing >40hr weeks | 2,000+ records | **HIGH** — direct evidence of overtime hours worked |
> | Job descriptions inconsistent with exemption | 12-15 versions | **MODERATE** — common in fast-growing tech companies |
> | Performance reviews referencing "routine" work | 80+ reviews | **MODERATE** — undermines "creative professional" exemption defense |
> | Privilege log vulnerabilities | 50+ entries | **MODERATE** — some "business purpose" emails may lose privilege under *In re Grand Jury* |
>
> **Critical finding: The remaining 40% of production will likely make the case worse, not better.** In my experience, wage/hour discovery almost exclusively favors plaintiffs. Every additional document produced is ammunition for the damages model.
>
> **Additionally:** Opposing counsel has filed a motion to compel production of the entire Slack workspace. If granted — and Judge Chen grants 80%+ of discovery motions — the search will surface every message where any manager discussed hours, overtime, or compensation. The potential for additional damaging statements is substantial.
>
> **Timing implication:** If we settle now, we avoid producing the remaining 40%. If we reject the demand and continue to trial, the full production will make the case significantly harder to defend and may increase the eventual settlement range to $30-35M.
>
> **Preliminary position: SETTLE BEFORE FULL PRODUCTION.** The discovery trajectory overwhelmingly favors settlement now rather than later.

---

**Ethics & Compliance Counsel** (confidence: 0.88)

> **PRIVILEGED AND CONFIDENTIAL**
>
> **Professional Responsibility Analysis:**
>
> | Rule | Status | Notes |
> |------|--------|-------|
> | **Rule 1.1 (Competence)** | ✅ | Team has employment class action expertise |
> | **Rule 1.4 (Communication)** | ⚠️ | Client must be informed of settlement demand *and* our realistic assessment of win probability |
> | **Rule 1.7 (Conflicts)** | ✅ | No conflicts — checked against all firm clients |
> | **Rule 1.6 (Confidentiality)** | ✅ | All outputs privilege-tagged |
> | **Rule 2.1 (Advisor)** | ⚠️ | **Critical — see below** |
>
> **Rule 2.1 issue:** The CEO "wants to fight" and the board's current authority is $12M. Under ABA Model Rule 2.1, we have a duty to render candid advice, including advice the client may not want to hear.
>
> Our analysis shows a 30% win probability, an expected trial cost of $27.6M, and a discovery trajectory that gets worse over time. **We have an ethical obligation to advise the board that $12M authority is unrealistic and that rejecting the demand carries significant financial risk.** If we allow the client to reject a reasonable settlement based on optimistic assessments, we have failed our duty as counselors.
>
> This does not mean we override client autonomy — the decision is the board's. But our recommendation letter must be frank about the risks, even if it's not what the CEO wants to hear. *See Restatement (Third) of the Law Governing Lawyers §94*.
>
> **Privilege protection assessment:**
> - All Council outputs are tagged `attorney-client` privilege
> - Settlement analysis is attorney work product under FRCP 26(b)(3)
> - No third-party disclosure that would waive privilege
> - Recommend: mark all settlement communications "CONFIDENTIAL — SETTLEMENT COMMUNICATION" for FRE 408 protection
>
> **Preliminary position: SUPPORT SETTLEMENT with candid advice to the board on the $12M authority gap.**

---

### Phase 2: Cross-Examination

---

**Litigation Strategist → Settlement Analyst:**

> **Challenge:** Your expected value analysis assumes static probabilities. But if we pursue a Daubert challenge on plaintiff's damages expert and succeed, the damages model shrinks significantly. Shouldn't the counter-offer strategy account for this optionality?

**Settlement Analyst (Response):**

> Fair point. If the Daubert challenge succeeds (25% probability per the Litigation Strategist), plaintiff's damages model drops by approximately 30% based on typical reductions when expert methodology is narrowed. Revised expected values:
>
> ```
> Without Daubert success (75%): EV = $27.6M (unchanged)
> With Daubert success (25%):    EV = $19.3M
> Blended EV with Daubert:       $25.5M
> ```
>
> This reduces the risk-adjusted trial cost by ~$2.1M. However, the Daubert motion takes 60-90 days to brief and decide. During that time:
> - Full discovery production completes (exposing additional damaging documents)
> - Defense costs accumulate (~$800K in additional legal fees)
> - The settlement window may close
>
> **Net effect:** Daubert optionality reduces EV by $2.1M but adds $800K in fees and risks losing the settlement window. The risk-adjusted benefit is ~$1.3M — meaningful, but not enough to change the recommendation from "settle" to "fight."
>
> **I revise my counter recommendation to $19-21M** to account for Daubert optionality as negotiating leverage. We can reference the pending Daubert challenge in settlement discussions without revealing specifics.

---

**Ethics & Compliance Counsel → Litigation Strategist:**

> **Point of emphasis:** You assessed win probability at 30%, below the client's internal assessment of 35%. Under Rule 1.4, we must communicate this gap clearly. Can you provide a one-paragraph assessment suitable for inclusion in a client letter that explains the difference without being condescending?

**Litigation Strategist (Response):**

> *"Based on our analysis of Judge Chen's class certification record, the strength of plaintiff's documentary evidence (particularly the internal communications regarding compensation philosophy), and the heightened requirements of California's exemption analysis, we assess the probability of a defense verdict at approximately 30%. This is below the internal estimate of 35% because our analysis incorporates the judge-specific certification rate (88%) and the likely impact of the Slack evidence on the trier of fact. We emphasize that both assessments — 30% and 35% — indicate a case where the defense is more likely to lose than win."*
>
> This is candid, explains the methodology, and frames both numbers honestly.

---

**Discovery Specialist → Settlement Analyst:**

> **Critical input for negotiation strategy:** The 10-day deadline is artificial. Opposing counsel set it to create urgency, but they have no incentive to walk away from a settlement — trial is expensive for plaintiff's firms too. We should respond within the deadline but with a counter-offer, not an acceptance. This signals seriousness without conceding the full amount.

**Settlement Analyst (Response):**

> Agree. The negotiation sequence should be:
>
> 1. **Day 7:** Respond with counter at $20M, supported by our damages analysis (without revealing full work product)
> 2. **Day 10-14:** Expect counter-counter in $24-26M range
> 3. **Day 14-21:** Likely resolution at $21-23M
>
> This pattern gives us approximately 3 weeks of negotiation with a landing zone of **$21-23M** — well below the $28M demand and close to the Daubert-adjusted EV.
>
> **The board needs authority at $23M, not $12M.** This is the number we need to present Friday.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_leg_9a0b1c2d-3e4f-5a6b-7c8d-9e0f1a2b3c4d",
  "status": "completed",
  "durationMs": 47832,
  "confidenceScore": 0.68,
  "consensusReached": true,
  "privilegeLevel": "attorney-client",

  "synthesis": {
    "recommendation": "COUNTER at $20M. Request board authority increase to $23M. Target resolution: $21-23M within 21 days.",
    "summary": "All four agents recommend settlement over trial. The expected trial cost ($27.6M) is nearly equal to the demand ($28M), and discovery trajectory will worsen the defense position. The current board authority of $12M is unrealistic and must be addressed under our Rule 2.1 duty of candid advice. A counter at $20M with authority to close at $23M gives the best risk-adjusted outcome.",

    "keyInsights": [
      "Expected trial cost ($27.6M) nearly equals the demand ($28M) — opposing counsel has done accurate math",
      "The VP's Slack message is a party admission under FRE 801(d)(2) — motion in limine will almost certainly fail",
      "Remaining 40% of discovery production will likely make the case worse, not better",
      "Board authority of $12M is unrealistic — we have a Rule 2.1 duty to advise candidly",
      "Daubert challenge on damages expert has 25% success probability — provides negotiating leverage but not a case strategy",
      "10-day deadline is artificial — counter-offer within deadline signals seriousness without capitulation"
    ],

    "boardPresentationPoints": [
      "Win probability: 30% (our assessment) vs 35% (internal). Both indicate defense is more likely to lose.",
      "Expected trial cost: $27.6M (all-in including verdict, fees, penalties, trial costs)",
      "Settlement target: $21-23M (saves $5-7M vs expected trial outcome)",
      "Insurance recovers ~$4.5M regardless of path",
      "Time value: settling now avoids 12-18 months of discovery, motions, and trial prep",
      "Reputation: confidential settlement avoids public verdict and potential press coverage"
    ],

    "privilegeProtection": {
      "allOutputsPrivileged": true,
      "workProductDoctrine": true,
      "fre408Protection": "recommended for all settlement communications",
      "noThirdPartyDisclosure": true
    }
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["ABA Model Rules 1.1, 1.4, 2.1", "FRCP 26(b)(3)", "FRE 408", "FRE 801(d)(2)", "California Labor Code §510, §1194, §203"],
    "ethicsFlags": [
      "Rule 2.1 duty: Must advise board candidly that $12M authority is unrealistic",
      "Rule 1.4 duty: Must communicate realistic win probability and settlement analysis"
    ]
  },

  "agentVotes": {
    "litigation-strategist": { "vote": "settle", "confidence": 0.42 },
    "settlement-analyst": { "vote": "counter_20m", "confidence": 0.71 },
    "discovery-specialist": { "vote": "settle_before_full_production", "confidence": 0.55 },
    "ethics-counsel": { "vote": "settle_with_candid_advice", "confidence": 0.88 }
  }
}
```

---

## What the Managing Partner Presents to the Board

> **PRIVILEGED AND CONFIDENTIAL — ATTORNEY-CLIENT COMMUNICATION**
>
> "We recommend countering at $20M with authority to close at $23M. Here's why:
>
> The expected cost of trial is $27.6M — the demand of $28M is not a bluff; it reflects accurate plaintiff's math. Our win probability is 30%. The internal Slack messages are admissible as party admissions and are devastating to our exemption defense. Judge Chen certifies wage/hour classes at an 88% rate.
>
> More importantly, we are 60% through document production, and the remaining 40% will almost certainly make our position worse. Settling now avoids producing the full Slack archive, which is the subject of a pending motion to compel.
>
> The current authority of $12M has less than a 5% chance of being accepted. We have an ethical obligation under our Rules of Professional Conduct to advise you that pursuing trial with a 30% win probability and $27.6M expected cost, when a $21-23M settlement is achievable, exposes the company to significant unnecessary financial risk.
>
> The recommendation: counter at $20M this week, expect to close at $21-23M within three weeks, and avoid the discovery and trial costs that make the problem worse every month."

The Ethics Counsel's Rule 2.1 finding is the pivotal insight — not because "settle before full discovery" is surprising (it's standard litigation strategy), but because the platform forced the ethical question into the deliberation as a first-class concern. The CEO wants to fight. The board's authority is $12M. Both positions are emotionally understandable and financially disastrous. An AI tool that only analyzes settlement economics would produce the counter-offer recommendation and stop. The Ethics Counsel agent goes further: it identifies that the lawyers have a *professional obligation* to tell the board their authority is unrealistic, even if that conversation costs the client relationship. That's the tension no single-model prompt would surface — the conflict between client retention and professional duty.

The Discovery Specialist's timing analysis reinforces this: the remaining 40% of production will worsen the defense position, making every day of delay more expensive. Settling *before* full production preserves negotiating leverage that disappears once the Slack archive is produced.

---

## Legal Vertical Decision Types

| Decision Type | Description | Key Frameworks |
|---------------|-------------|---------------|
| **Contract Review** | Risk assessment, redlines, deal-breakers | UCC, jurisdiction-specific |
| **Litigation Strategy** | Case assessment, motions, trial themes | FRCP, FRE, state procedural rules |
| **Settlement Approval** | Economics, counter-offers, board authority | FRE 408, Rule 2.1 |
| **Privilege Determination** | Document-level privilege classification | FRE 501/502, state privilege rules |
| **E-Discovery Production** | Production strategy, privilege review | FRCP 26/34, ESI protocols |
| **Regulatory Response** | Government investigation, subpoena response | Agency-specific regulations |
| **M&A Due Diligence** | Transaction risk, liability assessment | SEC, Hart-Scott-Rodino |
| **Conflict Check** | Client/matter conflict analysis | ABA Rules 1.7, 1.9, 1.10 |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md).*
