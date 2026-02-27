# Manufacturing End-to-End Walkthrough

**From line-down alarm to root-cause-verified recovery plan in 60 seconds.**

This walkthrough follows a realistic production crisis through the Datacendia Manufacturing vertical: a Quality Review Board investigating a customer-reported defect that has halted shipments, triggered a potential IATF 16949 containment action, and put a $38M annual automotive contract at risk. Four agents deliberate across quality engineering, production operations, maintenance, and supply chain — producing an 8D report with verified root cause, containment actions, and corrective measures.

---

## The Scenario

Your biggest customer just called. They found defective parts in production. They've stopped their assembly line and they're charging you $42,000 per hour in downtime penalties. Your quality manager is on vacation. The plant manager needs answers — not in a week, not tomorrow, now.

You are the **VP of Operations** at **Precision Components Inc.**, a Tier 1 automotive supplier with 800 employees across two plants. Your largest customer, **Atlas Motors**, has reported a critical dimensional defect in brake caliper housings — a safety-critical component.

**Key facts:**
- Part: Brake caliper housing (P/N: BCH-4420-A, safety-critical)
- Customer: Atlas Motors — $38M annual contract (42% of Precision's revenue)
- Defect: Bore diameter out of spec — 42.08mm measured vs. 42.00 ±0.02mm tolerance
- Defect rate: 23 defective parts found in a lot of 2,400 (0.96% — far exceeds 0 PPM target)
- Customer action: **Shipments halted, containment wall erected, $42K/hour line-down penalty active**
- Affected lots: Last 3 shipments (7,200 parts) — all under quarantine at customer
- Production line: CNC machining cell #7 (3 Mazak HCN-5000 horizontal machining centers)
- Last SPC data: Cpk was 1.67 (well above 1.33 minimum) as of last week's audit
- Last tool change: 72 hours ago (standard interval)
- Raw material: Lot #AL-2025-0847 (A356-T6 aluminum, new supplier qualified 4 months ago)
- Temperature: Plant HVAC system reported intermittent alarms for 3 days
- IATF 16949 certification audit: Scheduled in 6 weeks

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
    "question": "Atlas Motors reports 23 defective brake caliper housings (bore diameter 42.08mm vs 42.00±0.02mm spec) in lot of 2,400. Safety-critical part. Customer line down at $42K/hour penalty. Last 3 lots (7,200 parts) quarantined. Cpk was 1.67 last week. What is the root cause and what containment/corrective actions are required?",
    "context": {
      "vertical": "manufacturing",
      "councilMode": "quality-review-board"
    },
    "config": {
      "maxRounds": 8,
      "enableCrossExamination": true,
      "requireConsensus": false
      // 8 rounds — quality crisis needs rapid root cause but cross-functional validation is essential
    }
  }'
```

The Quality Review Board activates 4 agents:

| Agent | Role | Mandate | Model |
|-------|------|---------|-------|
| **Quality Engineer** | Quality Assurance | Root cause, SPC, corrective action | deepseek-r1:32b (temp 0.3) |
| **Plant Manager** | Operations Leadership | Production recovery, customer communication | qwen3:32b (temp 0.4) |
| **Maintenance Engineer** | Equipment Reliability | Equipment health, failure analysis | qwen3:32b (temp 0.4) |
| **Supply Chain Manager** | Materials & Suppliers | Material traceability, supplier quality | qwen3:32b (temp 0.5) |

Standards enforced: **ISO 9001, IATF 16949, AS9100, Customer Requirements.**
Safety gate: **REQUIRED — safety-critical component.**

---

### Phase 1: Initial Analysis

---

**Quality Engineer** (confidence: 0.61)

> **8D REPORT — INITIATED**
>
> **D1 (Team):** Quality Review Board convened. Cross-functional team assembled.
>
> **D2 (Problem Description — IS/IS NOT):**
>
> | Factor | IS | IS NOT |
> |--------|---|--------|
> | **What** | Bore diameter oversized (42.08mm) | Surface finish, thread, or other dimensions |
> | **Where** | CNC cell #7, all 3 Mazak HCN-5000s | Other machining cells, other part numbers |
> | **When** | Last 72 hours (since last tool change) | Before 72 hours ago (Cpk was 1.67) |
> | **How many** | 23 of 2,400 (0.96%) — intermittent, not 100% | Not every part — pattern suggests progressive |
>
> **Key observation:** The defect is 0.06mm oversized (42.08 vs 42.02 max). This is not a catastrophic shift — it's a gradual drift. The Cpk of 1.67 from last week's audit means the process was well-centered and capable. Something changed in the last 72 hours that caused a progressive drift.
>
> **Probable cause tree:**
>
> | Cause Category | Specific Hypothesis | Probability |
> |---------------|-------------------|:-:|
> | **Tool wear** | Bore tool worn beyond compensation range | 30% |
> | **Material** | New supplier aluminum has different machinability | 25% |
> | **Thermal** | Plant HVAC alarms → thermal expansion of workpiece/fixture | 25% |
> | **Machine** | Spindle bearing degradation affecting bore precision | 15% |
> | **Fixture** | Fixture locating pin worn or shifted | 5% |
>
> **D3 (Interim Containment):**
> 1. **IMMEDIATE:** 100% inspection of all quarantined parts at customer (7,200 parts) using CMM
> 2. **IMMEDIATE:** Sort current WIP at Precision — quarantine all BCH-4420-A from last 72 hours
> 3. **IMMEDIATE:** Resume production on cell #7 ONLY after root cause confirmed and corrected
> 4. Ship sorted good parts to Atlas Motors within 24 hours to support their line restart
>
> **Preliminary position: ROOT CAUSE NOT YET CONFIRMED.** Need data from Maintenance and Supply Chain before I can close D4.

---

**Plant Manager** (confidence: 0.58)

> **Operations Assessment — CUSTOMER RISK CRITICAL**
>
> **Financial exposure:**
>
> | Component | Cost | Timeline |
> |-----------|:---:|:---:|
> | Atlas line-down penalty | $42K/hour | **Active now** |
> | 100% sort at customer (7,200 parts) | $18K | 24-36 hours |
> | Lost production (cell #7 down) | $85K/day | Until root cause resolved |
> | Potential IATF 16949 finding | $0-$200K | Audit in 6 weeks |
> | **Risk of contract loss** | **$38M/year** | If confidence not restored |
>
> **The real risk is not the penalty — it's the relationship.** Atlas Motors is 42% of our revenue. If they lose confidence in our quality system, they will dual-source or re-source entirely. We've seen this happen at other suppliers — it starts with a containment, escalates to a Controlled Shipping Level 2, and ends with the business moving to a competitor.
>
> **Customer communication plan:**
> 1. **Now:** Call Atlas Quality Director. Acknowledge the defect. Confirm containment actions. Do not speculate on root cause.
> 2. **+4 hours:** Send preliminary 8D (D1-D3) with containment evidence
> 3. **+24 hours:** Send updated 8D (D1-D5) with root cause and corrective actions
> 4. **+72 hours:** Send full 8D (D1-D8) with verification data
>
> **Preliminary position: PRIORITIZE SORT AND SHIP.** Get good parts to Atlas within 24 hours to stop the line-down penalty. Root cause work continues in parallel.

---

**Maintenance Engineer** (confidence: 0.69)

> **Equipment Assessment — THERMAL DRIFT IDENTIFIED**
>
> I pulled the last 72 hours of machine data from all three Mazak HCN-5000s in cell #7:
>
> | Parameter | Normal Range | Last 72 Hours | Status |
> |-----------|:---:|:---:|:---:|
> | Spindle temperature | 28-32°C | 29-34°C | ⚠️ Elevated |
> | Ambient temperature (cell #7) | 21-23°C | 21-28°C | 🔴 **Intermittent spikes** |
> | Coolant temperature | 18-20°C | 18-24°C | ⚠️ Elevated |
> | Spindle vibration | <2.5 mm/s | 2.1-2.8 mm/s | ⚠️ Borderline |
> | Tool wear (bore tool) | 0-85% | 78% | ✅ Within limits |
> | Fixture clamping pressure | 180-200 bar | 185-195 bar | ✅ Normal |
>
> **The smoking gun is ambient temperature.** The plant HVAC system has been throwing intermittent alarms for 3 days — exactly matching the defect window. Cell #7 is in the southeast corner of the plant, which receives direct afternoon sun. When the HVAC system hiccups, that corner heats up first.
>
> **Thermal expansion calculation:**
>
> ```
> A356-T6 aluminum CTE: 21.4 µm/m·°C
> Bore diameter: 42.00mm
> Temperature rise: 5°C (23°C → 28°C)
>
> Expansion: 42.00mm × 21.4e-6 × 5°C = 0.0045mm
> ```
>
> **Wait — 0.0045mm expansion from thermal only accounts for a fraction of the 0.06mm shift.** Thermal expansion alone doesn't explain the full defect. But thermal expansion *combined with* tool wear at 78% could create a compounding effect — the tool is cutting slightly larger *and* the workpiece is expanding from heat.
>
> **Additional finding:** The Mazak's thermal compensation system relies on a temperature probe in the spindle housing. If the ambient temperature rises faster than the spindle (which happens with HVAC failure), the compensation algorithm under-corrects. The machine *thinks* it's compensating for thermal growth, but it's using spindle temperature while the real driver is workpiece temperature.
>
> **Root cause hypothesis (refined): HVAC failure → ambient temperature rise → workpiece thermal expansion (0.0045mm) + thermal compensation error (estimated 0.02mm) + tool wear at 78% contributing remaining 0.035mm = total shift of ~0.06mm.**
>
> **Preliminary position: ROOT CAUSE IS MULTI-FACTOR** — thermal environment + tool wear + compensation algorithm limitation. All three must be addressed.

---

**Supply Chain Manager** (confidence: 0.72)

> **Material Assessment — NEW SUPPLIER CLEARED, BUT WITH A CAVEAT**
>
> Material lot #AL-2025-0847 (A356-T6 aluminum) is from Apex Metals, qualified 4 months ago.
>
> | Property | Specification | Apex Metals Cert | Independent Test |
> |----------|:---:|:---:|:---:|
> | Tensile strength | ≥310 MPa | 318 MPa | 315 MPa ✅ |
> | Yield strength | ≥275 MPa | 282 MPa | 279 MPa ✅ |
> | Hardness (Brinell) | 80-90 HB | 85 HB | 84 HB ✅ |
> | Si content | 6.5-7.5% | 7.1% | 7.2% ✅ |
> | Mg content | 0.25-0.45% | 0.38% | 0.36% ✅ |
>
> Material meets specification. However:
>
> **The previous supplier's aluminum had Si content averaging 6.8%. Apex's averages 7.1%.** Higher silicon content slightly increases abrasion resistance, which means the bore tool wears marginally faster in Apex material. Over a full tool life, this could shift the wear curve left by 5-8%, meaning the tool reaches its compensation limit sooner.
>
> **This doesn't cause the defect on its own.** But it contributes to the tool wear factor in the Maintenance Engineer's multi-factor root cause. The tool at 78% wear in Apex material may be performing like 83-86% wear in the previous supplier's material.
>
> **Recommendation:** Reduce tool change interval from 72 hours to 60 hours for Apex material until we validate the revised wear curve. This is a $1,200/year cost increase for tooling — negligible compared to the defect cost.
>
> **Preliminary position: MATERIAL IS NOT THE PRIMARY CAUSE** but contributes to accelerated tool wear. Adjust tool change interval.

---

### Phase 2: Cross-Examination

---

**Quality Engineer → Maintenance Engineer:**

> **Challenge:** Your multi-factor root cause is compelling, but can you prove it? If I run a DOE (Design of Experiments) with temperature as the primary factor and tool wear as the secondary factor, what's the fastest way to validate?

**Maintenance Engineer (Response):**

> We don't need a full DOE — we can validate in 2 hours with a controlled test:
>
> 1. **Test 1:** New tool + normal temperature (HVAC fixed) → machine 5 parts, measure bore. This should produce nominal dimensions (42.00 ±0.01mm).
>
> 2. **Test 2:** Same new tool + elevated temperature (disable HVAC for cell #7, let it reach 28°C) → machine 5 parts, measure. This isolates the thermal factor.
>
> 3. **Test 3:** 78% worn tool + normal temperature → machine 5 parts, measure. This isolates the tool wear factor.
>
> If Test 1 is nominal, Test 2 shows ~0.02-0.03mm shift, and Test 3 shows ~0.02-0.03mm shift, then the combination explains the full 0.06mm. If any single test shows the full shift, the root cause is simpler than we think.
>
> **I can run this in parallel with the sort operation.** Results in 2 hours.

---

**Plant Manager → Quality Engineer:**

> **Urgency challenge:** We have $42K/hour in penalties accumulating. Can we restart production before the full root cause validation, using 100% inspection as a containment measure?

**Quality Engineer (Response):**

> **No.** Here's why:
>
> This is a safety-critical component — brake caliper housing. Under IATF 16949 Section 8.7.1, nonconforming output for safety-critical parts requires that the root cause is identified and corrected *before* production resumes. 100% inspection is an interim containment measure for parts already produced, not a substitute for corrective action.
>
> If we restart production with 100% inspection and the root cause is thermal, we'll produce more defective parts during the afternoon heat cycle and sort them out at $7.50 per inspection. That's not containment — that's producing scrap deliberately.
>
> **Faster path:** Fix the HVAC, change the tools, run the Maintenance Engineer's 2-hour validation test, and restart production with verified process capability. Total downtime: 4-5 hours from now, not 24-72 hours.
>
> **The $42K/hour penalty is painful, but restarting production without root cause correction and then shipping another defective lot would end the relationship entirely.**

---

### Phase 3: Synthesis

```json
{
  "deliberationId": "dlb_mfg_4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
  "status": "completed",
  "durationMs": 43567,
  "confidenceScore": 0.78,
  "consensusReached": true,

  "synthesis": {
    "recommendation": "Execute 3-phase recovery: immediate containment, 2-hour root cause validation, corrective action and restart.",
    "summary": "Root cause is multi-factor: HVAC failure caused ambient temperature rise in cell #7, creating workpiece thermal expansion AND thermal compensation algorithm error, compounded by tool wear at 78% (accelerated by new supplier's higher-silicon aluminum). All three factors combined to produce the 0.06mm bore shift. The fix requires all three: HVAC repair, tool change, and revised tool change interval for new material.",

    "rootCause": {
      "primary": "Plant HVAC intermittent failure → 5°C ambient temperature rise in cell #7",
      "contributing1": "Mazak thermal compensation algorithm uses spindle temp, not workpiece temp — under-corrects for ambient rise",
      "contributing2": "Tool wear at 78% + accelerated wear from higher-Si content in new supplier aluminum",
      "combined_effect": "Thermal expansion (0.0045mm) + compensation error (0.02mm) + tool wear (0.035mm) = 0.06mm total shift"
    },

    "immediateActions": [
      "1. NOW: Call Atlas Quality Director — acknowledge, confirm containment, share preliminary 8D",
      "2. NOW: Begin 100% CMM sort of quarantined 7,200 parts at customer (deploy 2 inspectors)",
      "3. NOW: Repair HVAC system — emergency service call placed",
      "4. NOW: Change bore tools on all 3 Mazak machines in cell #7",
      "5. T+1hr: Run Maintenance Engineer's 3-test validation (2 hours)",
      "6. T+3hr: Verify Cpk ≥1.67 on first 25 parts",
      "7. T+4hr: Restart production with validated process",
      "8. T+24hr: Ship sorted good parts to Atlas — stop penalty clock"
    ],

    "correctiveActions": [
      "Reduce tool change interval from 72hrs to 60hrs for Apex Metals aluminum",
      "Install ambient temperature sensor in cell #7 with alarm at 25°C",
      "Update Mazak thermal compensation to include ambient probe input (vendor service request)",
      "Add thermal stability check to pre-shift startup procedure",
      "Revise supplier qualification procedure to include machinability impact assessment"
    ],

    "keyInsights": [
      "Cpk of 1.67 last week was real — the process WAS capable. The defect is environmental, not fundamental",
      "The Maintenance Engineer's multi-factor root cause explains why no single check caught it: tool wear was 'within limits,' temperature was 'intermittent,' material was 'in spec' — but the combination exceeded tolerance",
      "Restarting production before root cause correction would violate IATF 16949 for safety-critical parts",
      "New supplier material is within spec but has different machinability — qualification procedures should include tool life impact testing"
    ]
  },

  "regulatoryCompliance": {
    "standardsCited": ["IATF 16949 Section 8.7.1", "ISO 9001:2015 Section 8.7", "Customer-specific requirements"],
    "auditPreparation": "Full 8D with validation data will be ready for IATF auditor review within 72 hours",
    "customerNotifications": ["Preliminary 8D within 4 hours", "Root cause 8D within 24 hours", "Full 8D with effectiveness verification within 72 hours"]
  },

  "agentVotes": {
    "quality-engineer": { "vote": "fix_then_restart", "confidence": 0.78 },
    "plant-manager": { "vote": "parallel_sort_and_fix", "confidence": 0.72 },
    "maintenance-engineer": { "vote": "multi_factor_correction", "confidence": 0.82 },
    "supply-chain-manager": { "vote": "adjust_tool_interval", "confidence": 0.72 }
  }
}
```

---

## What the VP of Operations Tells Atlas Motors

> "We've identified the root cause: an HVAC failure created a temperature excursion in the machining cell that, combined with tool wear and a thermal compensation limitation, caused a progressive bore drift. The process was in control as of last week's Cpk 1.67 audit — this is an environmental upset, not a systemic quality failure.
>
> We've repaired the HVAC, changed all tools, and validated the process with a controlled test — Cpk is back to 1.72 on the first 25 parts. Two inspectors are sorting the quarantined 7,200 parts — good parts ship to you within 24 hours.
>
> We've also identified a contributing factor: our new aluminum supplier's material has slightly higher silicon content that accelerates tool wear. We're adjusting our tool change interval and updating our supplier qualification to include machinability testing. Full 8D with effectiveness verification will be in your hands within 72 hours."

The Maintenance Engineer's multi-factor root cause is the insight that makes this work. Every individual parameter was "within limits" — tool wear at 78%, temperature "intermittent," material "in spec." A single-factor investigation would have found one contributing cause, applied one fix, and watched the defect recur when the other factors aligned again. The Supply Chain Manager's observation about silicon content affecting machinability connects a seemingly unrelated supplier change to the defect — the kind of cross-functional insight that only emerges when a supply chain agent examines production data through its own lens.

---

## Available Manufacturing Council Modes

| Mode | Category | Lead Agent | Standards |
|------|----------|------------|-----------|
| **Production Crisis Council** | Major | Plant Manager | ISO 9001, Customer Req |
| **Quality Review Board** | Major | Quality Engineer | ISO 9001, IATF 16949 |
| **Safety Incident Council** | Major | Safety Officer | OSHA, ISO 45001 |
| **New Product Launch Council** | Major | NPI Engineer | APQP, PPAP, IATF 16949 |
| **Root Cause Analysis** | Quality | Quality Engineer | 8D, A3, DMAIC |
| **Process Capability Review** | Quality | Quality Engineer | SPC, MSA |
| **Supplier Quality Council** | Quality | Quality Engineer | ISO 9001, IATF 16949 |

---

*For the benchmark comparison, see [BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md](BENCHMARK_COUNCIL_VS_SINGLE_MODEL.md). For other vertical walkthroughs, see [FINANCIAL_SERVICES_WALKTHROUGH.md](FINANCIAL_SERVICES_WALKTHROUGH.md), [HEALTHCARE_WALKTHROUGH.md](HEALTHCARE_WALKTHROUGH.md), and [SPORTS_WALKTHROUGH.md](SPORTS_WALKTHROUGH.md).*
