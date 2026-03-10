# WHITE PAPER: FDA SaMD Governance
### AI Decision Governance for Software as a Medical Device

**Author:** Stuart Rainey, Founder & CEO, Datacendia | **Date:** March 2026

---

## Executive Summary

600+ AI/ML-enabled medical devices authorized by FDA. SaMD governance — classification, validation, PCCP monitoring — is the #1 challenge. Datacendia provides the infrastructure.

## 1. SaMD Classification (IMDRF Framework)

| Category | Significance | Healthcare Situation | FDA Pathway |
|----------|-------------|---------------------|-------------|
| IV | Treat/diagnose | Critical | PMA |
| III | Treat/diagnose | Serious | 510(k)/De Novo |
| II | Drive management | Critical/Serious | 510(k) |
| I | Inform management | Non-serious | Exempt/510(k) |

## 2. PCCP (Predetermined Change Control Plan)

FDA allows planned AI modifications without new 510(k) — but requires: change description, validation protocol, impact assessment, and ongoing monitoring. **Datacendia is the natural PCCP implementation platform.**

## 3. Datacendia's SaMD Implementation

- **SaMD Classification Engine** — automatic IMDRF categorization + pathway determination
- **12 Healthcare Decision Schemas** — Clinical, SaMD Class, Drug Interaction, Consent, IRB, Incident Report, etc.
- **21 CFR Part 11** — implemented as architecture (audit trails, e-signatures, access controls, 30+ year retention)
- **PCCP Monitoring** — ContinuousComplianceMonitorService tracks drift from approved specifications
- **Multi-agent deliberation** — Clinical + Safety + Regulatory + Bias agents cross-examine before any recommendation
- **Deaths reported → DSMB review mandate** (machine-enforced in ClinicalTrialSchema)
- **Market withdrawal → board approval required** (machine-enforced in DrugSafetySchema)

## 4. Alert Fatigue Analysis

Datacendia tracks **effective sensitivity** per AI tool — accounting for clinician override rates. A tool with 87% technical sensitivity but 40% override rate has 54.8% effective sensitivity — potentially worse than manual screening.

## 5. ROI for Health Systems

| Metric | Impact |
|--------|--------|
| AI tool deployment | 18 months → 6 months (pre-documented) |
| FDA audit prep | 3 months → 1 week |
| Post-market surveillance | Manual → automated real-time |
| Clinical decision documentation | Auto-generated, Merkle-signed |

## 6. Conclusion

SaMD governance is mandatory, complex, and accelerating. Datacendia turns it from manual burden into automated infrastructure — every clinical AI decision auditable, explainable, and FDA-ready.

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com | NVIDIA Inception Member
