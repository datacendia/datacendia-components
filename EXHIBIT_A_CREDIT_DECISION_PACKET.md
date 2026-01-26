# EXHIBIT A — REGULATOR-GRADE CREDIT DECISION PACKET

**Classification:** REDACTED SAMPLE  
**Purpose:** Demonstration of Datacendia decision verification output  
**Framework Compliance:** Basel III, SR 11-7

---

## DECISION SUMMARY

| Field | Value |
|-------|-------|
| **Decision ID** | `DEC-2026-01-26-CR-7842` |
| **Decision Type** | Commercial Credit Approval |
| **Timestamp** | 2026-01-26T14:32:17.847Z |
| **Status** | APPROVED WITH CONDITIONS |
| **Replay Hash** | `a3f8c2d1e9b7...4f6a` |

---

## APPLICANT PROFILE (REDACTED)

| Field | Value |
|-------|-------|
| **Applicant ID** | `[REDACTED-A7842]` |
| **Entity Type** | Corporate |
| **Requested Amount** | `$[REDACTED]` |
| **Purpose** | Working Capital Facility |
| **Industry** | Manufacturing |
| **Relationship Tenure** | 7 years |

---

## RISK INPUTS AT TIME OF DECISION

| Metric | Value | Source | Timestamp |
|--------|-------|--------|-----------|
| **Internal Credit Score** | 742 | Core Risk Engine v3.2 | 2026-01-26T14:30:01Z |
| **PD (Probability of Default)** | 1.8% | Model ID: PD-CORP-2024-Q4 | 2026-01-26T14:30:02Z |
| **LGD (Loss Given Default)** | 35% | Model ID: LGD-SECURED-2024 | 2026-01-26T14:30:02Z |
| **Debt Service Coverage** | 1.42x | Financial Statements FY2025 | 2026-01-26T14:30:03Z |
| **Leverage Ratio** | 2.8x | Financial Statements FY2025 | 2026-01-26T14:30:03Z |
| **Collateral Coverage** | 125% | Appraisal dated 2025-12-15 | 2026-01-26T14:30:04Z |

**Model Governance Note:** All models validated under SR 11-7. Last validation: 2025-Q3.

---

## POLICY CONSTRAINTS EVALUATED

| Policy | Requirement | Actual | Status |
|--------|-------------|--------|--------|
| Maximum Single Exposure | ≤ 5% of Tier 1 Capital | 2.3% | ✓ COMPLIANT |
| Minimum DSCR | ≥ 1.25x | 1.42x | ✓ COMPLIANT |
| Maximum Leverage | ≤ 4.0x | 2.8x | ✓ COMPLIANT |
| Collateral Coverage | ≥ 100% | 125% | ✓ COMPLIANT |
| Industry Concentration | ≤ 15% of Portfolio | 11.2% | ✓ COMPLIANT |
| PD Threshold | ≤ 3.0% | 1.8% | ✓ COMPLIANT |

---

## DELIBERATION RECORD

### Participating Agents

| Agent | Role | Perspective |
|-------|------|-------------|
| **Risk Sentinel** | Lead | Quantitative risk assessment |
| **Compliance Guardian** | Review | Regulatory alignment |
| **Credit Analyst** | Analysis | 5 Cs evaluation |
| **Adversarial Reviewer** | Challenge | Stress testing assumptions |

### Deliberation Summary

**Round 1 — Initial Assessment**

> **Risk Sentinel:** "PD of 1.8% and DSCR of 1.42x indicate acceptable credit quality. Collateral coverage provides adequate downside protection. Recommend approval within standard terms."

> **Credit Analyst:** "5 Cs analysis supports approval. Character: 7-year relationship with no payment issues. Capacity: DSCR above threshold. Capital: Adequate equity cushion. Collateral: Secured with 125% coverage. Conditions: Manufacturing sector stable."

**Round 2 — Adversarial Challenge**

> **Adversarial Reviewer:** "Stress test: If revenue declines 20%, DSCR falls to 1.14x, below policy minimum. Recommend covenant requiring quarterly financial reporting and DSCR maintenance at 1.25x."

> **Risk Sentinel:** "Accepted. Adding financial covenant addresses downside scenario. Adjusted recommendation: Approve with quarterly reporting covenant."

**Round 3 — Compliance Verification**

> **Compliance Guardian:** "Basel III capital requirements satisfied. SR 11-7 model governance confirmed. No concentration limit breach. Recommend approval with documented covenants."

### Consensus Reached

**Final Recommendation:** APPROVE WITH CONDITIONS  
**Confidence Level:** 94%  
**Dissent:** None recorded

---

## APPROVAL CHAIN

| Approver | Role | Action | Timestamp | Signature Hash |
|----------|------|--------|-----------|----------------|
| `[REDACTED]` | Credit Officer | APPROVED | 2026-01-26T14:45:22Z | `7d2f...a1c3` |
| `[REDACTED]` | Risk Manager | APPROVED | 2026-01-26T15:02:11Z | `9e4b...f8d2` |
| `[REDACTED]` | Credit Committee Chair | APPROVED | 2026-01-26T15:18:47Z | `3c1a...b7e9` |

**Approval Authority:** Within delegated limits. No escalation required.

---

## CONDITIONS OF APPROVAL

1. Quarterly financial statement submission within 45 days of quarter-end
2. DSCR maintenance covenant at minimum 1.25x, tested quarterly
3. Collateral reappraisal required if market value declines >15%
4. Annual review required prior to facility renewal

---

## COMPLIANCE MAPPING

### Basel III

| Control | Requirement | Evidence |
|---------|-------------|----------|
| Capital Adequacy | Exposure within risk-weighted limits | RWA calculation documented |
| Large Exposure | Single exposure ≤ 25% of capital | 2.3% of Tier 1 confirmed |
| Credit Risk | PD/LGD models validated | SR 11-7 validation current |

### SR 11-7 (Model Risk Management)

| Requirement | Status | Evidence |
|-------------|--------|----------|
| Model Development | ✓ | PD model documentation on file |
| Model Validation | ✓ | Independent validation Q3 2025 |
| Model Governance | ✓ | Model inventory current |
| Ongoing Monitoring | ✓ | Backtesting within tolerance |

---

## DISSENT RECORD

**No dissenting opinions recorded for this decision.**

If dissent had been recorded, it would appear here with:
- Dissenting agent/approver identification
- Basis for dissent
- Management response
- Resolution or escalation path

---

## DETERMINISTIC REPLAY CAPABILITY

This decision can be re-executed identically using the following:

| Component | Hash |
|-----------|------|
| **Input State** | `b4e7c9f2a1d8...3e5f` |
| **Policy Version** | `POL-CREDIT-2026-01-v2.3` |
| **Model Versions** | `PD-CORP-2024-Q4`, `LGD-SECURED-2024` |
| **Agent Configuration** | `COUNCIL-CREDIT-v1.4` |
| **Replay Key** | `a3f8c2d1e9b7...4f6a` |

**Replay Guarantee:** Given identical inputs and configuration, this decision will produce identical outputs, deliberation, and recommendations.

**Verification Command:**
```
datacendia replay --decision-id DEC-2026-01-26-CR-7842 --verify
```

---

## AUDIT TRAIL INTEGRITY

| Field | Value |
|-------|-------|
| **Merkle Root** | `f9a2b7c4d1e8...6f3a` |
| **Block Height** | 847,293 |
| **Timestamp Attestation** | RFC 3161 compliant |
| **Tamper Evidence** | None detected |

This record has not been modified since creation.

---

## ARTIFACT METADATA

| Field | Value |
|-------|-------|
| **Generated By** | Datacendia Platform v2.4.1 |
| **Export Format** | Regulator Packet |
| **Classification** | Internal / Regulator Use |
| **Retention Period** | 7 years (per Basel requirements) |

---

## CERTIFICATION

This decision artifact was produced by the Datacendia decision verification platform at the time of decision. All inputs, deliberations, approvals, and compliance mappings are contemporaneous records, not post-hoc reconstructions.

The artifact is suitable for:
- Regulatory examination
- Internal audit review
- Legal discovery
- Model validation evidence

---

**END OF EXHIBIT A**

---

*This is a redacted sample for demonstration purposes. Actual decision packets contain institution-specific data, models, and policies.*
