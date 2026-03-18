# SBS Peru — AI Governance Compliance Analysis

**Mapping Datacendia Capabilities to SBS Supervisory Requirements**

**Last Updated:** March 2026

---

## Regulatory Landscape for AI in Peruvian Financial Institutions

Peruvian financial institutions under SBS (Superintendencia de Banca, Seguros y AFP) supervision face a converging set of AI governance obligations from three regulatory layers:

### Layer 1: AI-Specific Regulation

| Regulation | Status | Key Requirements |
|---|---|---|
| **DS N° 115-2025-PCM** | Enforceable | Adopts ISO/IEC 42001:2023 as mandatory AI governance standard for all organizations deploying AI in Peru |
| **Ley 31814** (AI Regulatory Framework) | Enforceable (2023) | Classifies AI systems by risk level. **Credit scoring, AML detection, and automated financial decisions = high-risk** (Art. 8). Requires transparency, explainability, human oversight, non-discrimination |

### Layer 2: Financial Sector Regulation (SBS)

| SBS Framework | Applicability | Key Requirements |
|---|---|---|
| **Corporate Governance** | All SBS-supervised entities | Board-level accountability for risk management, including technology and operational risk |
| **Comprehensive Risk Management** | All SBS-supervised entities | AI systems fall within operational risk perimeter. Requires identification, measurement, control, and monitoring of all operational risks |
| **Operational Risk Management** | All SBS-supervised entities | Technology risk as a subset of operational risk. AI systems must have documented controls, incident management, and business continuity provisions |
| **Cybersecurity Framework** | All SBS-supervised entities | Information security controls, access management, cryptographic protections, audit trails for all critical systems |
| **AML/CFT Obligations** | All SBS-supervised entities (FATF member) | AI systems used in suspicious transaction detection must have auditable decision trails. UIF (Financial Intelligence Unit) may request evidence of AI-assisted AML decisions |

### Layer 3: Data Protection

| Regulation | Status | Key Requirements |
|---|---|---|
| **Ley 29733** (Data Protection) | Enforceable | Personal data protection, consent requirements, data subject rights (access, rectification, cancellation, opposition). ANPD (National Data Protection Authority) oversight |
| **DS N° 003-2013-JUS** | Enforceable | Implementing regulation for Ley 29733. Security measures for personal data processing |

---

## Requirement-by-Requirement Mapping to Datacendia

### DS N° 115-2025-PCM (ISO/IEC 42001:2023 Adoption)

| ISO 42001 Clause | Requirement | Datacendia Capability | Implementation |
|---|---|---|---|
| **4.1** Context of the organization | Understand internal/external context of AI systems | CendiaGateway organizational configuration | Registers all AI systems, policies, and applicable regulatory frameworks per organization |
| **4.2** Interested parties | Identify stakeholders and their requirements | Multi-stakeholder governance model | Council of Agents represents regulatory, ethical, operational, and financial perspectives |
| **5.1** Leadership | Management commitment to AI management system | Approval workflows + digital chain of custody | Every AI governance decision traced to responsible human with identity verification |
| **5.2** AI policy | Establish AI governance policies | Configurable policy engine in CendiaGateway | Policies set per organization: PII handling, content blocking, redaction rules, escalation triggers |
| **6.1** Risk management | Risk assessment for AI systems | Multi-agent risk deliberation | 4-12 AI agents deliberate on risk from diverse perspectives; dissent captured and preserved |
| **6.2** AI objectives | Measurable governance objectives | Dashboard metrics and KPIs | Real-time monitoring: PII detections, policy violations, audit completeness, response times |
| **7.5** Documentation | Controlled documentation of AI management system | AI Manifest™ per interaction | Cryptographically signed (SHA-256) record of every AI interaction — immutable, timestamped, verifiable |
| **8.1** Operational control | Controls for AI system operation | Reverse-proxy interception | CendiaGateway intercepts all AI traffic, applies policies before execution, logs everything |
| **9.1** Monitoring | Performance monitoring of AI management system | Operational dashboard | Real-time metrics: usage volume, PII detected, policies applied, compliance percentage |
| **9.2** Internal audit | Audit program for AI governance | Exportable evidence package | One-click generation of DS 115-2025-PCM evidence package — clause-by-clause compliance mapping |
| **10.1** Improvement | Continuous improvement of AI management system | Versioned policy history | Complete change log of policy modifications, governance decisions, and system updates |
| **Annex B.2** | AI policies | Configurable governance policies | Per-organization policy sets with inheritance and override capabilities |
| **Annex B.3** | AI risk management | Automated risk detection | PII scanning (10 types), content classification, anomaly detection |
| **Annex B.5** | Documentation and records | AI Manifest™ + ImmutableAuditLedger | Cryptographic proof chain for every interaction and governance decision |
| **Annex B.6** | Monitoring and review | Real-time dashboard | Operational and compliance metrics with alerting |
| **Annex B.8** | Data management | Sovereign deployment + PII controls | Data never leaves institutional perimeter; PII detected and handled per policy before processing |

### Ley 31814 — AI Regulatory Framework

| Ley 31814 Requirement | Article | Datacendia Capability |
|---|---|---|
| **Risk classification** | Art. 8 | Credit scoring automatically classified as high-risk. CendiaGateway applies high-risk governance policies to these workflows |
| **Transparency** | Art. 9 | Complete input/output record of every AI interaction. Reasoning chains preserved in audit ledger |
| **Explainability** | Art. 9 | Council deliberation captures the "why" behind AI-assisted decisions from multiple perspectives |
| **Human oversight** | Art. 10 | CendiaVetoService enables human override of AI recommendations. Chain of custody identifies responsible human |
| **Non-discrimination** | Art. 11 | PII detection identifies sensitive attributes (ethnicity, gender, age) before AI processing. BiasDetection service monitors for algorithmic discrimination |
| **Accountability** | Art. 12 | Every decision traced to responsible human via digital chain of custody with cryptographic signatures |

### SBS Risk Management Framework

| SBS Requirement | Datacendia Capability |
|---|---|
| **Operational risk identification** | CendiaGateway maps all AI systems within operational risk perimeter. Each system registered with risk classification |
| **Control framework** | Configurable policies: PII blocking, content redaction, escalation rules, approval workflows |
| **Incident management** | Anomaly detection with alerting. Policy violation records with full context for investigation |
| **Audit trail for supervisor** | Exportable evidence package in format compatible with SBS information requests. Cryptographic verification of integrity |
| **Board-level accountability** | Governance decisions traced to senior management through approval workflows and chain of custody |
| **AML/CFT evidence** | AI-assisted suspicious transaction decisions fully audited — input data, model output, human override (if any), final decision, timestamp, responsible officer |
| **Business continuity** | CendiaGateway operates as infrastructure layer — failure mode is passthrough (AI systems continue operating, governance logging degrades gracefully) |

### Ley 29733 — Data Protection

| Ley 29733 Requirement | Article | Datacendia Capability |
|---|---|---|
| **Consent** | Art. 5 | Consent records tracked per data subject. AI interactions link to consent basis |
| **Purpose limitation** | Art. 6 | Policy engine enforces data usage boundaries per declared purpose |
| **Data minimization** | Art. 4 | PII detection identifies unnecessary personal data before AI processing |
| **Data subject rights** | Art. 18-27 | GDPR/LGPD-compatible DSR endpoints: access, rectification, cancellation, opposition (portability, erasure) |
| **Security measures** | Art. 16 | Encryption (TLS 1.3 in transit, AES-256 at rest), RBAC access controls, cryptographic audit trail |
| **ANPD registration** | Art. 34 | Metadata and processing records structured for ANPD registration requirements |
| **Breach notification** | Art. 28 | Incident detection and evidence preservation for 72-hour notification requirement |

---

## Deployment Architecture for SBS-Supervised Institutions

```
┌─────────────────────────────────────────────────┐
│           INSTITUTIONAL PERIMETER               │
│                                                 │
│   ┌──────────┐    ┌───────────────┐    ┌─────┐ │
│   │ Users    │───▶│ CendiaGateway │───▶│ AI  │ │
│   │ (Credit  │    │               │    │Syst.│ │
│   │ Officers,│◀───│ • Intercepts  │◀───│     │ │
│   │ Analysts)│    │ • Audits      │    └─────┘ │
│   └──────────┘    │ • Signs       │            │
│                   │ • Generates   │            │
│                   │   evidence    │            │
│                   └───────┬───────┘            │
│                           │                    │
│                   ┌───────▼───────┐            │
│                   │ Evidence      │            │
│                   │ Store         │            │
│                   │ (On-premises) │            │
│                   └───────────────┘            │
│                                                 │
│   NO DATA LEAVES THE INSTITUTIONAL PERIMETER    │
└─────────────────────────────────────────────────┘
         │
         ▼ (evidence package only, on request)
   ┌───────────┐
   │ SBS       │
   │ Auditor   │
   │ KPMG      │
   └───────────┘
```

---

## Value at Risk for Non-Compliance

| Risk Category | Potential Consequence |
|---|---|
| **SBS sanction** | Operational restrictions, fines, board-level accountability actions |
| **ANPD sanction** | Data protection fines under Ley 29733, mandatory corrective measures |
| **Reputational** | Public disclosure of regulatory findings. Impact on depositor confidence (critical for CMACs) |
| **Operational** | Forced suspension or modification of AI-assisted credit scoring during remediation period |
| **Competitive** | Institutions with ISO 42001 certification gain regulatory advantage and public trust |

---

## Recommended Engagement Path

| Phase | Activity | Duration | Outcome |
|---|---|---|---|
| **1. Gap Assessment** | Map current AI usage against DS 115-2025-PCM / Ley 31814 requirements | 2-3 weeks | Compliance gap report with prioritized remediation plan |
| **2. POC Deployment** | Deploy CendiaGateway on highest-risk AI workflow (credit scoring) | 60 days | Working evidence generation for SBS presentation |
| **3. Evidence Package** | Generate DS 115-2025-PCM compliance evidence package | Included in POC | Clause-by-clause ISO 42001 mapping with cryptographic proof |
| **4. Federation Rollout** | Extend to all AI workflows and federated institutions | 3-6 months | Full AIMS (AI Management System) operational |
| **5. Certification** | ISO/IEC 42001 certification via INACAL | 6-12 months | Certified compliance — competitive and regulatory advantage |

---

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com
