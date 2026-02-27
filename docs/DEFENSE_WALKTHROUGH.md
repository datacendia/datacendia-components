# Defense & National Security End-to-End Walkthrough

**From mission requirement to OPSEC-reviewed decision brief in 90 seconds.**

This walkthrough follows a realistic defense planning scenario through the Datacendia Defense vertical: a Mission Planning Council conducting Joint Operation Planning Process (JOPP) deliberation for a humanitarian assistance / disaster response (HA/DR) operation. Eight agents deliberate across operational planning, threat assessment, logistics, OPSEC, cyber, legal, force protection, and acquisition — producing a commander's decision brief with courses of action, risk assessment, and compliance documentation.

---

## The Scenario

A Category 5 typhoon has devastated a Pacific island nation that hosts a US military installation. The base is partially operational. Civilian infrastructure is destroyed. 200,000 people need immediate assistance. Two near-peer adversaries are positioning naval assets in the region under the guise of "humanitarian support." The clock is running.

You are the **J3 (Operations Director)** at a Joint Task Force headquarters. The Combatant Commander needs a decision brief in 6 hours with courses of action for **Operation Pacific Relief** — a combined HA/DR and freedom-of-navigation operation.

**Key facts:**
- Typhoon Mara: Category 5, 180mph sustained winds, 14-foot storm surge
- Affected nation: Republic of Palua (fictional), population 280,000
- US military installation: Naval Support Activity Palua — runway operational, port damaged
- Civilian casualties: estimated 400+, 200,000 displaced
- Infrastructure: 70% of power grid destroyed, 3 of 5 hospitals non-functional
- Adversary Activity: PRC carrier group repositioning 200nm south; Russian destroyer group 350nm east
- Both adversaries have offered "humanitarian assistance" — potential intelligence collection cover
- US assets available: Carrier Strike Group 7 (48hr transit), III MEF (Okinawa, 18hr airlift), USNS Mercy (5-day transit)
- Host Nation Agreement: existing SOFA permits US military operations for HA/DR
- Congressional notification: required within 48 hours per 10 USC §127

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
    "question": "Develop courses of action for Operation Pacific Relief: combined HA/DR and freedom-of-navigation operation following Typhoon Mara. 200,000 displaced, US base partially operational, PRC and Russian naval assets repositioning in the AO. Commander needs decision brief in 6 hours.",
    "context": {
      "vertical": "defense",
      "councilMode": "mission-planning-council"
    },
    "config": {
      "maxRounds": 15,
      "enableCrossExamination": true,
      "requireConsensus": false
    }
  }'
```

The Mission Planning Council activates all 8 default defense agents:

| Agent | Role | Mandate |
|-------|------|---------|
| **Mission Commander** | Planning Authority | Mission success, risk to force balance |
| **Threat Analyst** | Intelligence & Threat | Accurate threat assessment, confidence levels |
| **OPSEC Officer** | Operations Security | Protect critical information, deny adversary advantage |
| **Logistics Coordinator** | Sustainment | Ensure forces are supplied and sustained |
| **Cyber Warfare Specialist** | Cyber Operations | Cyber defense, information warfare |
| **Legal Advisor (UCMJ)** | Legal Review | Law of armed conflict, SOFA, authorities |
| **Force Protection Officer** | Force Protection | Protect personnel and assets |
| **Acquisition Specialist** | Defense Acquisition | Rapid procurement, contract support |

Compliance frameworks: **JP 5-0, MDMP, JOPP, FedRAMP High, NIST 800-171.**

---

### Phase 1: Initial Analysis

---

**Mission Commander** (confidence: 0.71)

> **BLUF:** Two viable COAs. Both accomplish the HA/DR mission; they differ in force posture toward adversary naval activity. Recommend COA 2 (HA/DR with visible freedom-of-navigation).
>
> **Commander's Intent:**
> - **Purpose:** Provide immediate humanitarian relief to the Republic of Palua while maintaining regional maritime security.
> - **Key Tasks:** (1) Establish logistics hub at NSA Palua; (2) Deploy medical and engineering capabilities; (3) Maintain freedom of navigation in international waters; (4) Deter adversary intelligence collection against US operations.
> - **End State:** Paluan civilian population stabilized, US installation fully operational, regional maritime norms maintained, adversary activity deterred without escalation.
>
> **COA 1 — HA/DR Focus (Minimal Naval Posture):**
> - Deploy III MEF advance element via airlift (18hr) for immediate relief
> - USNS Mercy for medical surge (5 days)
> - CSG-7 remains in current AO; no freedom-of-navigation assertion
> - Risk: Low escalation risk. High intelligence collection risk from adversary "humanitarian" vessels operating near US forces.
>
> **COA 2 — HA/DR with Freedom of Navigation (Recommended):**
> - Same HA/DR deployment as COA 1
> - CSG-7 transits to Palua operating area (48hr), conducts scheduled freedom-of-navigation operation en route
> - Establishes maritime exclusion zone around port facility during relief operations (per SOFA authority)
> - Risk: Moderate escalation risk (manageable with clear communication). Low intelligence collection risk.
>
> **Risk Assessment:**
>
> | Risk | COA 1 | COA 2 |
> |------|:---:|:---:|
> | Escalation with PRC/Russia | Low | Moderate |
> | Adversary intel collection | **High** | Low |
> | HA/DR mission accomplishment | High | High |
> | Congressional/media scrutiny | Low | Moderate |
> | Long-term deterrence value | Low | **High** |

---

**Threat Analyst** (confidence: 0.62)

> **Threat Assessment — MODERATE/HIGH**
>
> **Adversary Courses of Action (TCOAs):**
>
> **TCOA 1 — Legitimate humanitarian assistance (40% probability):**
> Both adversary naval groups provide genuine HA/DR support, positioning for diplomatic influence gain. Collection activity is incidental, not primary mission.
>
> **TCOA 2 — Humanitarian cover for intelligence collection (45% probability — MOST LIKELY):**
> Adversary vessels position near US forces under HA/DR pretext. Primary mission: SIGINT/ELINT collection against CSG-7 communications, radar emissions, and logistics patterns. Secondary: establish port access precedent for future operations.
>
> **TCOA 3 — Assertive positioning (15% probability — MOST DANGEROUS):**
> PRC carrier group conducts flight operations within Paluan EEZ, establishing "routine presence" precedent. Could include shadowing US vessels or contesting maritime exclusion zone.
>
> **Intelligence gaps:**
> - PRC carrier group composition (assessed: 1 CV, 2 DDG, 1 FFG, 2 AOR — confidence: MODERATE)
> - Russian destroyer group mission orders (collected: MODERATE confidence they are repositioning, LOW confidence on intent)
> - Adversary SIGINT capabilities specific to this AO (gap — request NSOC support)
>
> **Key judgment:** The HA/DR scenario creates a permissive environment for adversary collection that would not normally exist. Both adversaries will exploit this regardless of their primary intent. The question is not whether collection will occur, but how much access we give them.

---

**OPSEC Officer** (confidence: 0.58)

> **OPSEC ASSESSMENT — CRITICAL INFORMATION AT RISK**
>
> ⚠️ **This deliberation itself contains OPSEC-sensitive information.** Force movement timelines, CSG-7 transit schedules, and logistics capacity data must be compartmentalized.
>
> **Critical Information List (CIL) for Operation Pacific Relief:**
> 1. CSG-7 transit timeline and route
> 2. III MEF deployment composition and schedule
> 3. Communications architecture and frequencies
> 4. NSA Palua infrastructure status (damage assessment reveals capabilities)
> 5. Medical evacuation capacity and patient movement plans
> 6. Rules of engagement for maritime exclusion zone
>
> **Vulnerability analysis:**
>
> | Indicator | Adversary Collection Method | Risk |
> |-----------|---------------------------|------|
> | Airlift traffic to Palua | SIGINT, ADS-B tracking | HIGH — adversary will track C-17 movements |
> | CSG-7 emissions during transit | ELINT collection ships | HIGH under COA 2 |
> | Port logistics activity | Visual observation from "humanitarian" vessels | **CRITICAL** under COA 1 |
> | Encrypted communications volume | Traffic analysis | MODERATE |
>
> **Key finding:** COA 1 is actually *worse* for OPSEC than COA 2. Without a maritime exclusion zone, adversary vessels can position within visual and electronic range of port operations. COA 2's exclusion zone physically separates adversary collection platforms from critical logistics activity.
>
> **Recommendation:** COA 2 with emissions control (EMCON) plan for CSG-7 transit.

---

**Logistics Coordinator** (confidence: 0.74)

> **Sustainment Assessment — FEASIBLE WITH CONSTRAINTS**
>
> | Capability | Requirement | Available | Gap |
> |-----------|------------|-----------|-----|
> | Airlift (C-17 equiv.) | 12 sorties/day | 8 sorties/day (1 runway) | -4 sorties |
> | Medical (bed capacity) | 800 trauma beds | 200 (USNS Mercy, 5 days) + 120 (III MEF) | -480 beds (days 1-5) |
> | Potable water | 400,000 gal/day | 180,000 gal/day (RO units) | -220,000 gal |
> | Fuel (JP-8) | 250,000 gal/day | 120,000 gal (NSA Palua reserves) | Resupply needed day 3 |
> | Engineering (route clearance) | 40 km/day | 15 km/day (III MEF organic) | -25 km/day |
>
> **Critical path:** Water is the binding constraint. 200,000 displaced persons need 2 gallons/person/day minimum. Our RO units cover 45% of demand. Without host nation water infrastructure restoration or additional ROWPU deployment, we face a humanitarian crisis within the humanitarian response.
>
> **Sustainment recommendation:** Request 3× additional ROWPU from PACOM reserve. Pre-position fuel barge from Guam (72-hour transit). Accept the airlift gap — prioritize medical and water over general cargo for days 1-3.

---

**Legal Advisor** (confidence: 0.77)

> **Legal Analysis — AUTHORITIES SUFFICIENT, NOTIFICATIONS REQUIRED**
>
> | Authority | Status | Action Required |
> |-----------|--------|----------------|
> | **SOFA (HA/DR)** | ✅ Permits US military HA/DR operations | None — self-executing for natural disaster |
> | **10 USC §127** | ⚠️ Congressional notification required within 48 hours | Draft notification — clock starts at deployment order |
> | **Maritime exclusion zone** | ✅ Lawful under SOFA + host nation request | Requires formal host nation request (coordinate with embassy) |
> | **Freedom of navigation** | ✅ Customary international law, UNCLOS | Document as routine scheduled operation |
> | **Rules of engagement** | ⚠️ Current standing ROE covers self-defense; supplemental ROE needed for exclusion zone enforcement | Draft supplemental ROE for CCDR approval |
> | **Posse Comitatus** | ✅ Not applicable — operations on foreign soil | None |
> | **War Powers Resolution** | ⚠️ Monitor — if adversary interaction leads to hostilities | Prepare WPR notification template |
>
> **Critical legal finding for COA 2:** The maritime exclusion zone is lawful *only if the host nation formally requests it*. Without that request, establishing an exclusion zone in another nation's territorial waters is an act of sovereignty violation. **The embassy must obtain this request before CSG-7 arrives.** This is on the critical path — 48 hours.

---

**Cyber Warfare Specialist** (confidence: 0.65)

> **Cyber Assessment — ELEVATED THREAT**
>
> The disaster creates three cyber vulnerabilities:
>
> 1. **Degraded network infrastructure.** NSA Palua's fiber network is damaged. Forces will rely on SATCOM, which is bandwidth-limited and more susceptible to jamming.
> 2. **Emergency communications.** HA/DR operations require coordination with civilian agencies (USAID, host nation, NGOs) over unclassified networks — expanding the attack surface.
> 3. **Social engineering.** Adversary cyber actors will exploit the humanitarian context for phishing and influence operations targeting deployed personnel.
>
> **Recommendation:** Deploy Cyber Protection Team with the advance element. Establish air-gapped tactical network for classified operations. Coordinate with NSA for SIGINT support on adversary collection activities.

---

**Force Protection Officer** (confidence: 0.69)

> **Force Protection Assessment — CONDITION CHARLIE**
>
> Threat to deployed forces: MODERATE (natural disaster environment + adversary presence).
>
> **Primary force protection concerns:**
> - Structural collapse during relief operations (aftershock risk)
> - Adversary ISR drones over US operating areas
> - Force health (contaminated water, vector-borne disease in tropical environment)
> - Crowd control at aid distribution points
>
> **Recommendation:** Deploy CBRN detection capability, establish medical prophylaxis protocols, integrate host nation police for crowd management at distribution sites.

---

**Acquisition Specialist** (confidence: 0.72)

> **Rapid Acquisition Assessment**
>
> The water gap identified by Logistics requires immediate commercial augmentation:
>
> | Capability | Contract Vehicle | Timeline | Est. Cost |
> |-----------|-----------------|----------|-----------|
> | Commercial water purification | GSA Schedule, FAR 13.5 | 48-72 hours | $2.8M |
> | Fuel barge charter | Existing TRANSCOM contract | 24 hours | $1.2M |
> | Commercial satellite bandwidth | Existing DISA BPA | 12 hours | $340K/month |
> | Local construction equipment | Simplified acquisition (FAR 13) | 24-48 hours | $890K |
>
> **Total rapid acquisition requirement: ~$5.2M.** All within existing authorities — no Congressional notification required for individual actions under $10M threshold.

---

### Phase 2: Cross-Examination (Selected Exchanges)

---

**OPSEC Officer → Mission Commander:**

> **Challenge:** COA 2 puts CSG-7 on a known transit route for 48 hours. The Threat Analyst assessed HIGH ELINT collection risk during transit. Have we considered an EMCON transit with deceptive emissions — broadcasting from a different location to mask the actual transit route?

**Mission Commander (Response):**

> Good OPSEC thinking, but the transit will be visible via commercial satellite imagery regardless. A deceptive emissions plan adds complexity without meaningful concealment. However, I accept the EMCON recommendation for radar emissions during transit. CSG-7 should operate in EMCON Alpha until entering the Paluan EEZ, then shift to full emissions for the freedom-of-navigation demonstration. **The transition from EMCON to full emissions becomes the deterrence signal.**

---

**Legal Advisor → Mission Commander:**

> **Critical path alert:** COA 2 requires the host nation to formally request the maritime exclusion zone. The embassy needs 48 hours to coordinate this. CSG-7 arrives in 48 hours. If the diplomatic request isn't obtained before CSG-7 arrives, COA 2 degrades to COA 1 by default — the carrier group arrives but cannot establish the exclusion zone. **Recommend issuing the embassy request immediately, in parallel with this deliberation, not after.**

**Mission Commander (Response):**

> Concur. This is now a **time-critical action item**, not a planning consideration. Issue FLASH message to embassy requesting formal host nation HA/DR and maritime exclusion zone request. This must happen before this deliberation concludes. **J5 to execute immediately.**

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_def_5c6d7e8f-9a0b-1c2d-3e4f-5a6b7c8d9e0f",
  "status": "completed",
  "durationMs": 78432,
  "confidenceScore": 0.71,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "COA 2 — HA/DR with Freedom of Navigation. Two time-critical actions required immediately.",
    "summary": "All 8 agents recommend COA 2. The OPSEC Officer's analysis was decisive — COA 1, despite appearing lower risk, actually creates worse security conditions by allowing adversary collection platforms to operate at close range. COA 2's maritime exclusion zone provides both operational security and deterrence. The Legal Advisor identified a critical path dependency: the host nation exclusion zone request must be obtained within 48 hours or COA 2 reverts to COA 1.",

    "timeCriticalActions": [
      "IMMEDIATE: FLASH message to embassy — request formal host nation maritime exclusion zone authorization",
      "IMMEDIATE: Request 3× ROWPU from PACOM reserve — water is the binding logistics constraint"
    ],

    "keyInsights": [
      "COA 1 (minimal posture) is worse for OPSEC than COA 2 — no exclusion zone means adversary vessels at close range",
      "Water is the binding constraint: current capacity covers 45% of demand for 200,000 displaced persons",
      "Host nation exclusion zone request is on the 48-hour critical path — parallel execution required",
      "Total rapid acquisition: $5.2M, all within existing authorities",
      "EMCON-to-full-emissions transition during CSG-7 arrival becomes the deterrence signal"
    ]
  },

  "dissent": [],

  "complianceFrameworks": {
    "cited": ["JP 5-0", "JOPP", "10 USC §127", "SOFA", "UNCLOS", "FedRAMP High", "NIST 800-171"],
    "notifications": ["Congressional notification required within 48 hours of deployment order", "War Powers Resolution template prepared as precaution"],
    "authorities": ["SOFA HA/DR self-executing", "Maritime exclusion zone requires host nation request", "Supplemental ROE required for exclusion zone enforcement"]
  }
}
```

---

## What the Commander's Decision Brief Contains

> **BLUF:** Recommend COA 2 — combined HA/DR with freedom-of-navigation. CSG-7 transits under EMCON, establishes maritime exclusion zone upon arrival, III MEF advance element deploys immediately via airlift.
>
> **Why COA 2 over COA 1:** The OPSEC Officer's analysis shows COA 1 is counterintuitively *less* secure — without an exclusion zone, adversary "humanitarian" vessels operate at close range to our logistics operations. COA 2's exclusion zone solves both the collection problem and the deterrence problem.
>
> **Critical path:** Embassy must obtain host nation exclusion zone request within 48 hours or COA 2 degrades to COA 1. FLASH message issued.
>
> **Binding constraint:** Water. Current capacity: 45% of demand. Three additional ROWPU units requested from PACOM reserve.

The OPSEC Officer's counterintuitive finding — that the "lower risk" COA actually creates worse security conditions — is the kind of insight that only emerges when a dedicated security agent examines each option through its own lens. A single planning tool would default to "COA 1 is lower risk" without modeling the second-order OPSEC effects. The Legal Advisor's critical path identification — catching the 48-hour diplomatic dependency before it became a planning failure — demonstrates why legal review must be integrated into the deliberation, not bolted on afterward.

---

## Available Defense Council Modes

| Mode | Category | Lead Agent | Frameworks |
|------|----------|------------|------------|
| **Mission Planning Council** | Major | Mission Commander | JP 5-0, MDMP, JOPP |
| **Threat Assessment War Room** | Major | Threat Analyst | JP 2-0, IPOE, NIST 800-171 |
| **Acquisition Review Board** | Major | Acquisition Specialist | FAR, DFARS, DoD 5000, CMMC |
| **OPSEC Review Council** | Major | OPSEC Officer | OPSEC Program, NIST 800-171 |
| **After Action Review** | Major | Mission Commander | AAR Process, Lessons Learned |
| **Rules of Engagement Analysis** | Operations | Legal Advisor | LOAC, Standing ROE, SROE |
| **Cyber Operations Council** | Cyber | Cyber Warfare Specialist | NIST 800-171, CMMC, FedRAMP High |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md), [HEALTHCARE_WALKTHROUGH.md](HEALTHCARE_WALKTHROUGH.md), and [GOVERNMENT_WALKTHROUGH.md](GOVERNMENT_WALKTHROUGH.md).*
