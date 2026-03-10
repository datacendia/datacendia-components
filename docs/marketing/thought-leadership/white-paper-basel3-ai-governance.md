# WHITE PAPER: Basel III AI Governance
### How AI Decision Governance Strengthens Capital Adequacy and Regulatory Compliance

**Author:** Stuart Rainey, Founder & CEO, Datacendia  
**Date:** March 2026 | **Version:** 1.0

---

## Executive Summary

Banks deploying AI for credit decisions, trading, AML, and portfolio management face a governance gap: regulators expect model risk documentation (SR 11-7), capital adequacy proof (Basel III/CRR), and bias-free outcomes (fair lending laws) — but most AI governance is manual, fragmented, and reactive. This paper shows how Decision Crisis Immunization Infrastructure closes that gap with machine-enforced compliance.

---

## 1. The Regulatory Landscape for AI in Banking

| Regulation | AI Governance Requirement |
|-----------|--------------------------|
| **Basel III / CRR** (Art. 92) | Capital ratios based on RWA — AI models that influence credit decisions affect RWA calculations |
| **SR 11-7** (Fed Model Risk) | Model validation, documentation, performance monitoring for every AI model |
| **EU AI Act** (Annex III 5(b)) | Credit scoring AI = high-risk — full governance required by Aug 2026 |
| **BCBS 239** | Risk data aggregation and reporting — AI outputs must be traceable |
| **Fair Lending** (ECOA/HMDA) | AI credit decisions must be free of disparate impact |
| **FRTB** (CRR Art. 325+) | Trading book AI models require specific risk governance |

## 2. Datacendia's Basel III Engine — Real Formulas, Not Approximations

### Capital Calculations (CRR Art. 26-71)

| Component | Regulation | Datacendia Implementation |
|-----------|-----------|--------------------------|
| CET1 Capital | Art. 26-35 | 6 gross components + 9 deduction categories, floor at zero |
| AT1 Capital | Art. 51-61 | Perpetual instruments + premium - 3 deduction categories |
| Tier 2 Capital | Art. 62-71 | Subordinated debt + adjustments - amortisation - deductions |

### Risk-Weighted Assets

| RWA Type | Method | Implementation |
|----------|--------|---------------|
| Credit RWA | Standardised (Art. 111-134) | 14 exposure classes with CRR risk weights, CRM with collateral haircuts |
| Market RWA | Standardised (Art. 325-377) | 5 asset classes, specific + general risk charges × 12.5 |
| Operational RWA | BIA (Art. 315) / TSA (Art. 317) | 15% alpha factor, 8 business line betas |

### Ratios and Buffers

| Ratio | Minimum | Datacendia Breach Detection |
|-------|---------|---------------------------|
| CET1 | 4.5% | Critical breach → remediation guidance with article citation |
| Tier 1 | 6.0% | Critical breach → AT1 issuance recommendation |
| Total Capital | 8.0% | Critical breach → Tier 2 debt recommendation |
| Leverage | 3.0% | Critical breach → exposure reduction recommendation |
| Combined Buffer | CCB 2.5% + CCyB + SRB | Warning → MDA restriction calculation (quartile approach, Art. 141) |

### Liquidity (Delegated Reg 2015/61, CRR2 Art. 428a-az)

| Metric | Minimum | Components |
|--------|---------|------------|
| LCR | 100% | HQLA (Level 1/2a/2b with haircuts + composition caps) / Net 30-day outflows (11 run-off categories, inflows capped at 75%) |
| NSFR | 100% | ASF (7 funding categories × ASF factors) / RSF (11 asset categories × RSF factors) |

### Large Exposures (Art. 395) and Stress Testing (EBA Methodology)

- Single counterparty limit: ≤25% of Tier 1 (≤15% for G-SII interbank)
- Stress test: GDP shock → credit losses → market losses → RWA inflation → stressed CET1 vs. 5.5% hurdle

## 3. How AI Governance Improves Capital Outcomes

### Credit Decision Governance → Better RWA

When AI credit decisions are governed by multi-agent deliberation:
- **Risk assessment quality improves** (3.2× more risk factors identified vs. single model)
- **Model risk documentation is automatic** (SR 11-7 satisfied by architecture)
- **Bias is detected before deployment** (fair lending compliance by design)
- **Every decision is traceable** (BCBS 239 risk data aggregation satisfied)

### Trading Decision Governance → Better FRTB Compliance

- Every AI-assisted trading decision: documented, with full reasoning chain
- Risk metrics (concentration, VAR) automatically validated
- Position limits machine-enforced (not advisory)

### AML Governance → Better SAR Quality

- Confirmed sanction match → automatic block (machine-enforced, not discretionary)
- Every escalation decision: documented with risk indicators and rationale
- SAR filing decisions: multi-agent deliberation with audit trail

## 4. Supervisory Exam Transformation

| Exam Aspect | Without Datacendia | With Datacendia |
|-------------|-------------------|-----------------|
| Model inventory | Spreadsheet, manually maintained | Auto-discovered, real-time |
| Model documentation | Narratives, inconsistent format | Structured, Merkle-signed |
| Validation evidence | Scattered across teams | One-click evidence packet export |
| Capital adequacy proof | Quarterly calculation, manual | Real-time monitoring, automated |
| Fair lending evidence | Statistical sampling | 100% decision-level fairness audit |

## 5. Conclusion

Basel III compliance and AI governance are converging. Banks that treat them as separate problems will face compounding regulatory burden. Banks that implement Decision Crisis Immunization — where every AI decision is automatically documented, validated against capital requirements, and exportable as court-admissible evidence — will turn compliance from cost center to competitive advantage.

---

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com | NVIDIA Inception Member
