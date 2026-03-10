# DATACENDIA REGULATORY MAPPING MATRIX
### How the Platform Maps to Every Major Regulation

---

## Master Mapping: 9 Primitives → Regulations

| Primitive | EU AI Act | Basel III/CRR | SEC Rules | FDA SaMD | HIPAA | NIST AI RMF | FedRAMP | OSHA |
|-----------|----------|--------------|----------|---------|-------|------------|---------|------|
| 1. Discovery-Time Proof | Art. 12 (Record-keeping) | BCBS 239 (Data aggregation) | Cyber 4-day rule | 21 CFR 11 (Audit trail) | § 164.312 (Audit controls) | Govern 1.1 | AC-2, AU-2 | 29 CFR 1904 (Recording) |
| 2. Deliberation Capture | Art. 13 (Transparency) | SR 11-7 (Model documentation) | Reg BI (Best Interest) | SaMD (Clinical evaluation) | — | Map 3.1 | — | — |
| 3. Override Accountability | Art. 14 (Human oversight) | — | SOX 302/906 | — | — | Govern 1.3 | AC-6 | — |
| 4. Continuity Memory | — | — | — | PCCP (Change control) | § 164.310 (Contingency) | — | CP-2 | — |
| 5. Drift Detection | Art. 9 (Risk management) | Pillar 2 (SREP) | — | Post-market surveillance | — | Manage 4.1 | CA-7 | — |
| 6. Cognitive Bias Mitigation | Art. 10 (Data governance) | Fair lending (ECOA) | — | Art. 10 (Bias) | — | Measure 2.6 | — | — |
| 7. Quantum-Resistant Integrity | Art. 15 (Cybersecurity) | — | — | — | § 164.312 (Encryption) | — | SC-13 | — |
| 8. Synthetic Media Auth | Art. 50 (Transparency for deepfakes) | — | — | — | — | — | — | — |
| 9. Cross-Jurisdiction | Art. 2 (Scope) | CRR Art. 395 (Exposures) | Reg S-K (Foreign ops) | — | — | Govern 1.1 | — | — |

---

## Detailed Mappings by Regulation

### EU AI Act (Regulation 2024/1689)

| Article | Requirement | Datacendia Service | Status |
|---------|-------------|-------------------|--------|
| Art. 5 | Prohibited AI practices detection | EU AI Act Engine classification | ✅ Built |
| Art. 6 | Risk classification (Annex III) | Automatic high-risk identification | ✅ Built |
| Art. 8 | Compliance for high-risk AI | Full platform architecture | ✅ Built |
| Art. 9 | Risk management system | Multi-agent deliberation + ContinuousComplianceMonitor | ✅ Built |
| Art. 10 | Data governance | DataConnector layer + provenance enforcement | ✅ Built |
| Art. 11 | Technical documentation | Auto-generated decision documentation | ✅ Built |
| Art. 12 | Record-keeping / logging | ImmutableAuditLedger + EvidenceVaultService | ✅ Built |
| Art. 13 | Transparency to deployers | Complete reasoning chains + dissent capture | ✅ Built |
| Art. 14 | Human oversight | CendiaVetoService + approval workflows | ✅ Built |
| Art. 15 | Accuracy, robustness, cybersecurity | BiasDetection + CendiaCrucible + PostQuantumKMS | ✅ Built |
| Art. 27 | Fundamental Rights Impact Assessment | FRIA automation in EU AI Act Engine | ✅ Built |
| Art. 43 | Conformity assessment | Self-assessment + third-party routing | ✅ Built |
| Art. 49 | EU database registration | Registration data structure | ✅ Built |
| Art. 50 | Transparency (deepfakes) | SyntheticMediaAuthService (C2PA) | ✅ Built |

### Basel III / CRR (Regulation 575/2013)

| Article | Requirement | Datacendia Service | Status |
|---------|-------------|-------------------|--------|
| Art. 26-35 | CET1 capital calculation | Basel3Engine.calculateCET1() | ✅ Built |
| Art. 51-61 | AT1 capital | Basel3Engine.calculateAT1() | ✅ Built |
| Art. 62-71 | Tier 2 capital | Basel3Engine.calculateTier2() | ✅ Built |
| Art. 92(1) | Capital ratios (CET1 ≥4.5%, T1 ≥6%, TC ≥8%) | Basel3Engine.calculateCapitalAdequacy() | ✅ Built |
| Art. 92(1)(d) | Leverage ratio ≥3% | Integrated in capital adequacy | ✅ Built |
| Art. 111-134 | Credit RWA (Standardised) | 14 exposure classes with CRM | ✅ Built |
| Art. 325-377 | Market RWA | 5 asset classes × 12.5 | ✅ Built |
| Art. 312-324 | Operational RWA (BIA/TSA) | 15% alpha, 8 betas | ✅ Built |
| Art. 395 | Large exposure limits | 25% T1 (15% G-SII) | ✅ Built |
| Art. 412 | LCR ≥100% | HQLA/net outflows with haircuts | ✅ Built |
| Art. 428b | NSFR ≥100% | ASF/RSF with factors | ✅ Built |
| CRD IV Art. 129-133 | Capital buffers | CCB + CCyB + SRB | ✅ Built |
| CRD IV Art. 141 | MDA restrictions | Quartile approach | ✅ Built |

### HIPAA (45 CFR Parts 160, 164)

| Section | Requirement | Datacendia Service |
|---------|-------------|-------------------|
| § 164.312(b) | Audit controls | ImmutableAuditLedger |
| § 164.312(a) | Access controls | RBAC + Keycloak SSO + MFA |
| § 164.312(c) | Integrity controls | HMAC-SHA256 tamper detection |
| § 164.312(e) | Transmission security | TLS 1.3 + encryption |
| § 164.312(d) | Authentication | JWT + MFA + Keycloak |
| § 164.530(j) | Record retention (6 years) | Immutable storage + post-quantum signatures |
| § 164.308(a)(1) | Risk analysis | Multi-agent risk assessment |
| § 164.502(b) | Minimum necessary | OPA policy enforcement |

### NIST AI RMF (AI 100-1)

| Function | Datacendia Mapping |
|---------|-------------------|
| **GOVERN 1.1** | Cross-jurisdiction compliance engine (17 jurisdictions) |
| **GOVERN 1.3** | CendiaResponsibilityService (accountability chains) |
| **GOVERN 1.5** | ContinuousComplianceMonitorService (ongoing monitoring) |
| **MAP 1.1** | 30 vertical-specific risk profiles |
| **MAP 3.1** | Multi-agent deliberation (risk prioritization from 4-12 perspectives) |
| **MEASURE 2.6** | NLPBiasDetectionService + CognitiveBiasMitigationService |
| **MEASURE 2.7** | CendiaCrucibleService (adversarial testing) |
| **MANAGE 1.1** | CendiaSentryService (real-time threat detection) |
| **MANAGE 4.1** | ContinuousComplianceMonitorService (drift detection) |

---

## Standards Body Engagement Plan

| Organization | Standard | Datacendia Alignment | Engagement Path |
|-------------|---------|---------------------|----------------|
| **NIST** | AI RMF (AI 100-1) | Reference implementation of all 4 functions | Comment period + research partnership |
| **ISO** | ISO/IEC 42001 (AI Management) | Governance infrastructure implementation | Standards committee participation |
| **IEEE** | IEEE 7000 (Ethical AI) | 19 Collapse agents + SGAS for ethical analysis | Research paper submission |
| **OECD** | AI Principles | Aligns with all 5 principles | Policy consultation |
| **EU AI Office** | EU AI Act implementing regulations | EU AI Act Engine as reference implementation | Technical consultation |
| **BCBS** | Basel Committee AI guidance | Basel III Engine implementation | Industry consultation |

---

## Comment Letter Templates

### Template: EU AI Act Implementing Regulation

**To:** European Commission, DG CONNECT  
**Re:** Implementing Regulation on [specific topic]  
**From:** Datacendia, LLC (Enterprise AI Governance Infrastructure Provider)

We write to provide technical input on [specific implementing regulation] based on our experience implementing AI governance infrastructure across 30 industry verticals.

**Key Points:**
1. [Technical implementation consideration]
2. [Practical compliance challenge]
3. [Recommendation for standards-based approach]

**Our Qualification:** Datacendia has built and tested EU AI Act compliance infrastructure including automatic classification (Annex III), conformity assessment routing, FRIA automation, and ongoing monitoring. Our Basel III engine implements real CRR/CRD IV formulas. 205,754 automated tests validate compliance logic.

---

### Template: NIST AI RMF Public Comment

**To:** NIST AI RMF Team  
**Re:** AI RMF Profile for [specific domain]  
**From:** Datacendia, LLC

We provide implementation experience from deploying AI governance across regulated industries...

[Similar structure, adapted for NIST context]

---

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com
