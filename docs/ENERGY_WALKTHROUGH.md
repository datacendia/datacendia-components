# Energy & Utilities End-to-End Walkthrough

**From grid alarm to safety-reviewed load shed decision in 45 seconds.**

This walkthrough follows a realistic grid emergency scenario through the Datacendia Energy vertical: a Grid Emergency Council responding to a cascading failure during a summer heat wave. Four agents deliberate across grid operations, renewable integration, asset health, and demand response — producing a load shedding plan that balances reliability, safety, and regulatory compliance under extreme time pressure.

---

## The Scenario

It's 4:47 PM on the hottest day in a decade. Two generators just tripped offline simultaneously. Load is climbing. Frequency is dropping. You have about 8 minutes before automatic under-frequency load shedding kicks in — cutting power to hospitals, water treatment plants, and 200,000 homes without warning. Or you can shed load deliberately, protecting critical infrastructure, and explain your decisions to the state PUC tomorrow.

You are the **System Operator** at **Heartland Power**, a regional utility serving 1.2 million customers across three states. A heat wave has driven demand to record levels. At 4:47 PM, a transmission line fault triggered protective relays that tripped two 450MW natural gas combined-cycle units simultaneously. System frequency is dropping.

**Key facts:**
- System demand: 14,200 MW (record peak; previous record: 13,800 MW)
- Available generation: 12,800 MW (after loss of 900 MW from tripped units)
- Generation deficit: **1,400 MW**
- System frequency: 59.92 Hz and declining (nominal: 60.00 Hz; UFLS threshold: 59.50 Hz)
- Time to UFLS: estimated 7-8 minutes at current decline rate
- Renewable generation: Solar 2,100 MW (declining — sunset in 90 minutes), Wind 680 MW (stable)
- Battery storage: 340 MW / 1,360 MWh available (4 hours at full discharge)
- Demand response: 620 MW enrolled, 480 MW available within 10 minutes
- Spinning reserves: 200 MW (already deployed, insufficient)
- Interconnection imports: 300 MW available via emergency energy purchase (15-minute activation)
- Temperature: 108°F, heat advisory, no relief forecast until midnight
- Critical loads: 14 hospitals, 8 water treatment plants, 3 data centers, 2 military installations

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
    "question": "Two 450MW generators tripped simultaneously during record peak demand (14,200MW). Generation deficit is 1,400MW. Frequency at 59.92Hz and declining. UFLS in approximately 8 minutes. What load shedding and resource dispatch actions should be taken immediately?",
    "context": {
      "vertical": "energy",
      "councilMode": "grid-emergency-council"
    },
    "config": {
      "maxRounds": 4,
      "enableCrossExamination": true,
      "requireConsensus": false
      // 4 rounds — time-critical emergency mode, minutes matter
    }
  }'
```

The Grid Emergency Council activates 4 agents with **maximum deliberation rounds capped at 4** — this is a time-critical mode:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Grid Controller** | Grid Operations Authority | Grid reliability and stability | deepseek-r1:32b (temp 0.3) |
| **Renewable Optimizer** | Clean Energy Integration | Maximize renewable output, storage dispatch | qwen3:32b (temp 0.4) |
| **Asset Guardian** | Infrastructure Management | Asset health, failure prevention | qwen3:32b (temp 0.4) |
| **Demand Response Manager** | Load Management | DR dispatch, customer programs | llama3.2:3b (temp 0.5) |

Regulatory frameworks enforced: **NERC EOP Standards, FERC Order 888, State Emergency Protocols.**
Safety gate: **REQUIRED — human operator makes final decision.**

---

### Phase 1: Initial Analysis

---

**Grid Controller** (confidence: 0.78)

> **GRID EMERGENCY — IMMEDIATE ACTION REQUIRED**
>
> **Situation:** 1,400 MW deficit. Frequency 59.92 Hz, declining ~0.01 Hz per minute. UFLS at 59.50 Hz — approximately 7 minutes.
>
> **Immediate resource stack (order of dispatch):**
>
> | Action | MW | Activation Time | Status |
> |--------|---:|:-:|--------|
> | 1. Battery storage — full discharge | 340 MW | **Immediate** | Ready |
> | 2. Demand response — emergency dispatch | 480 MW | **10 min** | Ready |
> | 3. Emergency interconnection import | 300 MW | **15 min** | Requesting |
> | **Subtotal (fast resources)** | **1,120 MW** | | |
> | **Remaining deficit** | **280 MW** | | **Must be shed** |
>
> Fast resources close 1,120 MW of the 1,400 MW gap. The remaining **280 MW must be shed through controlled load shedding** to arrest frequency decline before UFLS triggers.
>
> **Proposed load shed priority (least-impact first):**
>
> | Priority | Load Category | MW Available | Shed |
> |:---:|------------|---:|---:|
> | 1 | Industrial interruptible contracts | 180 MW | 180 MW |
> | 2 | Commercial large-power (voluntary) | 220 MW | 100 MW |
> | **Total controlled shed** | | | **280 MW** |
>
> **Critical loads PROTECTED — not in any shed rotation:**
> - All 14 hospitals
> - All 8 water treatment plants
> - Military installations
> - 911/emergency services
> - Data centers with contractual priority
>
> **HUMAN DECISION REQUIRED: Authorize controlled load shed of 280 MW to industrial and commercial interruptible loads.**

---

**Renewable Optimizer** (confidence: 0.72)

> **Renewable and Storage Assessment**
>
> **Battery storage — 340 MW dispatch is correct but has a time limit:**
>
> | Parameter | Value |
> |-----------|-------|
> | Available capacity | 340 MW / 1,360 MWh |
> | Discharge duration at full rate | 4.0 hours |
> | Sunset (solar decline begins) | 90 minutes |
> | Post-sunset solar loss | -2,100 MW over 90 minutes |
>
> **⚠️ CRITICAL WARNING:** The battery dispatch solves the immediate crisis, but we face a **second, larger crisis at sunset.** In 90 minutes, solar generation drops from 2,100 MW to 0 MW. If the tripped generators are not restored and demand hasn't decreased, the post-sunset deficit will be:
>
> ```
> Current deficit:        1,400 MW
> Solar loss (sunset):   +2,100 MW
> Battery depletion:      +340 MW (used now, not available at sunset)
> Evening demand decrease: -800 MW (estimated)
> ───────────────────────────────
> Sunset deficit:        2,840 MW ← CATASTROPHIC
> ```
>
> **If we discharge batteries now, we cannot use them at sunset.** I recommend:
> - Discharge batteries at **200 MW, not 340 MW** — preserving 140 MW / 560 MWh for the sunset transition
> - This means we need to shed **420 MW instead of 280 MW** in the immediate term
> - But it prevents a catastrophic 2,840 MW deficit at sunset that would require rolling blackouts across the entire service territory
>
> **Preliminary position: ACCEPT larger immediate shed to preserve battery capacity for sunset.**

---

**Asset Guardian** (confidence: 0.65)

> **Asset Health Assessment — ROOT CAUSE MATTERS**
>
> Two 450 MW units tripped simultaneously on a transmission line fault. This is not random — simultaneous trips suggest a common-mode failure:
>
> | Possible Root Cause | Probability | Restoration Time | Implication |
> |-------------------|:-:|:-:|------------|
> | Transmission line fault (cleared) | 45% | 30-45 min | Units can restart once line is restored |
> | Protective relay misoperation | 30% | 1-2 hours | Relay settings need review before restart |
> | Generator damage (overheating) | 15% | 8-24 hours | Extended outage, changes all planning |
> | Substation equipment failure | 10% | 4-12 hours | Affects restart and grid topology |
>
> **Critical question: Can these units restart?**
>
> If the root cause is a cleared transmission fault (45% probability), both units can begin restart procedures in 30-45 minutes. Gas turbine hot restart takes approximately 20 minutes from authorization to synchronization. **Best case: 900 MW restored in ~60-65 minutes — before sunset.**
>
> If it's relay misoperation or equipment failure, restoration extends well past sunset, and the Renewable Optimizer's sunset crisis scenario becomes the planning case.
>
> **Recommendation:** Dispatch field crew to the tripped units and transmission line IMMEDIATELY to determine root cause. The root cause determines whether this is a 60-minute event or a 12-hour event. All load shedding and battery decisions should be made assuming the worst case (no quick restart) but preparing for the best case (quick restart available).
>
> **I also flag:** The remaining online generators are operating at 96% capacity in 108°F heat. Derating risk is significant — we may lose another 200-400 MW from thermal derating over the next 2 hours if temperatures hold. Plan for this.

---

**Demand Response Manager** (confidence: 0.81)

> **Demand Response Dispatch — READY TO EXECUTE**
>
> | DR Program | Enrolled | Available (10 min) | Activation Method |
> |-----------|--------:|-------------------:|-------------------|
> | Industrial interruptible | 320 MW | 280 MW | Automatic signal |
> | Commercial curtailment | 180 MW | 120 MW | Automated + phone |
> | Residential AC cycling | 420 MW | 80 MW | Smart thermostat signal |
> | **Total** | **920 MW** | **480 MW (10 min)** | |
>
> The Grid Controller's 480 MW figure is correct for 10-minute activation. However, **I can deliver an additional 340 MW within 30 minutes** by activating the residential AC cycling program. At 108°F, this is controversial — but cycling AC (15 min on / 15 min off) in participating homes reduces load without complete service loss.
>
> At 30 minutes, total DR delivers **820 MW** — covering more of the deficit and potentially allowing lower battery discharge rates as the Renewable Optimizer recommends.
>
> **I support the Renewable Optimizer's position:** Accept a larger immediate shed from industrial interruptible contracts, bring DR online aggressively, and preserve battery for sunset. The residential AC cycling program is our bridge to sunset.
>
> **Equity note:** Residential AC cycling disproportionately affects lower-income customers who are less likely to have backup cooling. Under state PUC equity guidelines, cycling should be applied to opted-in customers only and accompanied by wellness check dispatches to vulnerable populations. This matters for the regulatory filing tomorrow.

---

### Phase 2: Cross-Examination

---

**Grid Controller → Renewable Optimizer:**

> **Challenge:** Your sunset scenario is the most important analysis in this deliberation, but your math assumes demand stays at 14,200 MW. At sunset, temperatures begin declining — historical data shows summer evening ramp-down of 800 MW between 6 PM and 9 PM. Does that change your battery recommendation?

**Renewable Optimizer (Response):**

> Yes — I included the 800 MW evening decrease in my calculation. The updated sunset math:
>
> ```
> Current deficit:         1,400 MW
> Solar loss (sunset):    +2,100 MW
> Evening demand decrease:  -800 MW
> DR sustained (820 MW):   -820 MW
> Interconnection import:  -300 MW
> ─────────────────────────
> Sunset net deficit:      1,580 MW
> ```
>
> If we've burned through all 340 MW of battery, we have no fast-response resource to cover 1,580 MW. That's rolling blackouts.
>
> If we've preserved 140 MW of battery + the tripped units restart (Asset Guardian's 45% best case), the sunset picture is:
>
> ```
> Sunset deficit:          1,580 MW
> Battery (preserved):      -140 MW
> Tripped units restored:   -900 MW (if restarted)
> ─────────────────────────
> Remaining gap:             540 MW ← manageable with additional DR + interruptible
> ```
>
> **The battery preservation isn't about the 140 MW itself — it's about having any fast-response resource available during the sunset transition.** Without batteries, the sunset ramp has zero fast-response backup. With batteries, we have an 8-minute bridge to bring additional resources online.
>
> **I maintain my recommendation: 200 MW battery discharge, not 340 MW.**

---

**Asset Guardian → Grid Controller:**

> **Critical update: Field crew reports transmission line fault has been cleared. Both units are undamaged. Hot restart procedures authorized.** Estimated time to first unit synchronization: 25 minutes. Second unit: 40 minutes.
>
> This changes everything. With 900 MW returning in 40 minutes:
>
> ```
> Current deficit:     1,400 MW
> Battery (200 MW):     -200 MW
> DR (480 MW @ 10 min): -480 MW
> Import (300 MW):      -300 MW
> ─────────────────────
> Remaining gap:         420 MW ← covered by controlled shed
>
> T+25 min: First unit (450 MW) online → deficit eliminated, begin shedding restoration
> T+40 min: Second unit online → full system restoration, preserve battery for sunset
> ```
>
> **Revised recommendation:** The 420 MW controlled shed is needed for only 25 minutes. Industrial interruptible contracts cover this entirely. No commercial or residential load shedding needed.

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_eng_7e8f9a0b-1c2d-3e4f-5a6b-7c8d9e0f1a2b",
  "status": "completed",
  "durationMs": 38921,
  "confidenceScore": 0.82,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "Execute 4-step recovery sequence. Human operator authorization required.",
    "summary": "Grid emergency manageable without rolling blackouts. Root cause identified: transmission line fault, now cleared. Both tripped units restarting — first unit in 25 min, second in 40 min. The Renewable Optimizer's sunset analysis was critical: preserving battery storage for the solar ramp-down prevents a second, larger crisis at sunset.",

    "immediateActions": [
      "1. BATTERY: Dispatch 200 MW (not 340 MW) — preserve 140 MW for sunset transition",
      "2. DEMAND RESPONSE: Emergency dispatch 480 MW (industrial interruptible + commercial) — 10 min activation",
      "3. INTERCONNECTION: Request 300 MW emergency import — 15 min activation",
      "4. CONTROLLED SHED: 420 MW from industrial interruptible contracts — needed for 25 minutes only",
      "5. GENERATOR RESTART: Both units hot-restarting — first at T+25, second at T+40"
    ],

    "restorationSequence": [
      "T+0: Battery + DR + shed dispatched (1,100 MW covered)",
      "T+10: DR fully activated (1,580 MW covered — deficit reduced to near zero with import pending)",
      "T+15: Import online (surplus begins)",
      "T+25: First unit synchronized — begin restoring shed loads",
      "T+40: Second unit synchronized — full restoration, shed loads restored",
      "T+90: Solar begins declining — battery reserve + restored generators cover sunset ramp"
    ],

    "keyInsights": [
      "The Renewable Optimizer identified the sunset crisis before anyone else — discharging all battery capacity now creates a 2,840 MW deficit at sunset",
      "Battery preservation (200 MW vs 340 MW) costs 140 MW now but prevents rolling blackouts 90 minutes later",
      "Root cause was transmission fault (cleared) — hot restart in 25/40 min eliminates need for extended shed",
      "Residential AC cycling not needed — industrial interruptible contracts cover the gap",
      "Thermal derating risk remains — monitor remaining generators for capacity loss in 108°F heat"
    ]
  },

  "dissent": [],

  "regulatoryCompliance": {
    "frameworksCited": ["NERC EOP-011", "NERC EOP-001", "FERC Order 888", "State Emergency Protocols"],
    "filingRequired": ["State PUC emergency event report within 24 hours", "NERC event report within 24 hours if UFLS was triggered (it was not)"],
    "safetyGate": "ACTIVE — human operator must authorize all load shedding actions"
  },

  "agentVotes": {
    "grid-controller": { "vote": "approve_recovery_plan", "confidence": 0.82 },
    "renewable-optimizer": { "vote": "approve_recovery_plan", "confidence": 0.78 },
    "asset-guardian": { "vote": "approve_recovery_plan", "confidence": 0.85 },
    "demand-response": { "vote": "approve_recovery_plan", "confidence": 0.81 }
  }
}
```

### Phase 4: Ethics & Safety Gate

```json
{
  "ethicsCheck": {
    "passed": true,
    "equityAssessment": "REVIEWED",
    "safetyGate": "HOLD_FOR_HUMAN",
    "notes": [
      "Load shedding targets industrial interruptible contracts first — no residential impact",
      "Residential AC cycling NOT activated — avoids disproportionate impact on low-income customers without backup cooling",
      "Critical loads protected: all 14 hospitals, 8 water treatment plants, military installations, 911 services",
      "Demand Response equity note: if residential cycling is activated in future, wellness checks required for vulnerable populations per state PUC equity guidelines"
    ]
  },
  "safetyGate": {
    "status": "HOLD_FOR_HUMAN",
    "message": "Load shedding actions require human operator authorization per NERC EOP standards.",
    "criticalDecisions": [
      "Authorize 420 MW controlled shed to industrial interruptible customers",
      "Authorize battery dispatch at 200 MW (reduced rate per Renewable Optimizer recommendation)",
      "Authorize emergency interconnection import request (300 MW)"
    ],
    "operatorActions": "Operator must confirm each action via control room interface. Council provides recommendation — operator decides."
  }
}
```

The ethics and safety gates are both mandatory for energy operations. The ethics check verifies that load shedding decisions don't disproportionately impact vulnerable populations — a concern that state PUCs and FERC increasingly scrutinize. The safety gate ensures human authorization for all load shedding per NERC EOP standards. The Council provides the analysis, the resource stack, and the restoration timeline — but the system operator pushes the button.

---

## What the Control Room Sees

> **EVENT:** Two 450 MW units tripped on transmission line fault (cleared). Deficit: 1,400 MW. Frequency: 59.92 Hz.
>
> **RECOMMENDATION:** Execute 4-step recovery. Battery at 200 MW (preserve for sunset), DR 480 MW, import 300 MW, controlled shed 420 MW from industrial interruptible. Units restarting — first online in 25 min. Shed needed for 25 minutes only. No residential impact.
>
> **CRITICAL INSIGHT:** Do NOT discharge full battery. Sunset in 90 minutes will create a 2,840 MW deficit if batteries are depleted. Preserve 140 MW for the transition.
>
> **AUTHORIZE: [YES] [MODIFY] [REJECT]**

The Renewable Optimizer's sunset analysis is the pivotal insight. Every instinct in a grid emergency says "throw everything at the problem now." The Renewable Optimizer's mandate is to think about renewable intermittency — and that mandate forced it to model what happens when the sun goes down. Without that analysis, the operator would discharge full battery, solve the immediate crisis, and face a catastrophic deficit 90 minutes later with no fast-response resources.

That's the value of multi-agent deliberation in safety-critical systems: agents with different time horizons catching what the immediate-crisis response would miss.

---

## Available Energy Council Modes

| Mode | Category | Lead Agent | Frameworks |
|------|----------|------------|------------|
| **Grid Emergency Council** | Major | Grid Controller | NERC EOP, FERC Order 888 |
| **NERC CIP Council** | Major | Asset Guardian | NERC CIP-002 through CIP-014 |
| **Safety Review Board** | Major | Asset Guardian | OSHA 1910, NESC |
| **Outage Coordination Council** | Major | Grid Controller | NERC FAC Standards |
| **Rate Case Council** | Major | Demand Response Mgr | State PUC, FERC Rate Standards |
| **Load Forecast Review** | Grid | Grid Controller | NERC TPL Standards |
| **Renewable Integration Council** | Grid | Renewable Optimizer | State RPS, FERC Order 2222 |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md), [HEALTHCARE_WALKTHROUGH.md](HEALTHCARE_WALKTHROUGH.md), [GOVERNMENT_WALKTHROUGH.md](GOVERNMENT_WALKTHROUGH.md), and [DEFENSE_WALKTHROUGH.md](DEFENSE_WALKTHROUGH.md).*
