# ISO/IEC 42001:2023 — Formal Self-Assessment

**Organization:** Datacendia, LLC  
**Product:** CendiaGateway™ / DDGI Platform  
**Document Version:** 2.0  
**Date:** March 2026  
**Classification:** Confidential — Shared Under NDA  
**Assessor:** Stuart Rainey, CEO  

---

## 1. Scope of Assessment

This self-assessment evaluates Datacendia's **CendiaGateway™** and the broader **DDGI (Datacendia Decision Governance Infrastructure)** platform against ISO/IEC 42001:2023 — the international standard for Artificial Intelligence Management Systems (AIMS).

**Systems in scope:**

- CendiaGateway™ — AI governance reverse proxy generating cryptographic audit trails
- The Council™ — Multi-agent deliberation engine with dissent capture
- Decision DNA™ — Immutable evidence chain with SHA-256 signing and Merkle tree verification
- CendiaOversight™ — Regulatory compliance monitoring across 60+ frameworks
- AI Manifest™ — Per-interaction compliance artifact

**Deployment model assessed:** Sovereign on-premise deployment (customer-controlled infrastructure, customer-controlled cryptographic keys, zero data egress to Datacendia)

**Jurisdictions in scope:** Peru (DS N° 115-2025-PCM), EU (EU AI Act 2024/1689), UK, US

---

## 2. Clause-by-Clause Assessment

### ISO/IEC 42001 Core Requirements

| Clause | Requirement | Status | Evidence |
|---|---|---|---|
| **4.1** Context of the organization | Understand internal/external issues relevant to AI | ✅ Conformant | Organization-scoped multi-tenant architecture; jurisdiction-aware processing; 60+ regulatory frameworks mapped in `compliance/frameworks.ts` and `panopticon/frameworks.ts` |
| **4.2** Needs and expectations of interested parties | Identify stakeholders and their requirements | ✅ Conformant | Role-based access (admin, analyst, auditor, compliance officer); SBS-specific agent personas; regulator-facing evidence exports |
| **4.3** Scope of the AIMS | Define boundaries and applicability | ✅ Conformant | Scope is all AI interactions routed through CendiaGateway; clear boundary at the proxy layer |
| **4.4** AI management system | Establish, implement, maintain, improve | ✅ Conformant | Platform architecture is the AIMS implementation — policies, controls, monitoring, evidence generation |
| **5.1** Leadership and commitment | Top management commitment | ✅ Conformant | CEO-signed compliance statements; governance-first product design philosophy |
| **5.2** AI policy | Establish AI policy appropriate to purpose | ✅ Conformant | Configurable policy engine per organization — PII detection rules, content blocking, audit requirements |
| **5.3** Organizational roles | Assign responsibilities and authorities | ✅ Conformant | RBAC with Keycloak SSO; roles include veto-authority, auditor, council-member; override accountability chain |
| **6.1** Actions to address risks and opportunities | Risk assessment for AI systems | ✅ Conformant | Pre-execution risk surfacing via Council deliberation; adversarial stress-testing (CendiaCrucible); PII auto-detection |
| **6.2** AI objectives and planning | Set measurable AI objectives | ⚠️ Partial | Metrics infrastructure operational (dashboard KPIs); formal objective-setting cadence to be established per-customer during deployment |
| **6.3** Planning of changes | Manage changes to AIMS | ✅ Conformant | Versioned policy history; AI Manifest includes policy version applied; prompt versioning service with audit trail |
| **7.1** Resources | Determine and provide resources | ✅ Conformant | Self-contained deployment — all required infrastructure bundled (PostgreSQL, Redis, application server) |
| **7.2** Competence | Ensure competence of personnel | ⚠️ Partial | Agent capability profiles documented; customer training included in POC scope; formal competency assessment framework planned |
| **7.3** Awareness | Ensure awareness of AI policy | ✅ Conformant | Dashboard surfaces active policies and compliance status; alert system for policy violations |
| **7.4** Communication | Internal and external communication | ✅ Conformant | Regulatory evidence package serves as external communication to regulators; audit logs serve internal communication |
| **7.5** Documented information | Create and control documentation | ✅ Conformant | AI Manifest™ per interaction; cryptographic signatures; immutable audit ledger; export in multiple formats |
| **8.1** Operational planning and control | Plan and control AI operations | ✅ Conformant | CendiaGateway reverse proxy enforces policy before AI execution; real-time monitoring dashboard |
| **8.2** AI risk assessment | Assess AI risks | ✅ Conformant | Multi-agent deliberation surfaces risks from multiple perspectives (credit risk, ethics, compliance, legal); PII detection pre-processing |
| **8.3** AI risk treatment | Treat identified AI risks | ✅ Conformant | Configurable policy actions: block, redact, warn, log; automated PII protection; escalation paths |
| **8.4** AI system impact assessment | Assess impact of AI systems | ⚠️ Partial | Council deliberation includes impact analysis; formal DPIA template created; automated impact scoring in roadmap |
| **9.1** Monitoring, measurement, analysis | Monitor and measure AIMS performance | ✅ Conformant | Real-time dashboard; interaction volume, PII detection rates, policy application metrics; compliance scoring |
| **9.2** Internal audit | Conduct internal audits | ✅ Conformant | Cryptographic audit trails with Merkle tree verification; independent offline verification tooling; evidence package export |
| **9.3** Management review | Review AIMS at planned intervals | ⚠️ Partial | Infrastructure supports review (metrics, dashboards, export); formal review cadence to be established per-customer |
| **10.1** Nonconformity and corrective action | Address nonconformities | ⚠️ Partial | Alert system for policy violations; corrective action tracking in roadmap (Q3 2026) |
| **10.2** Continual improvement | Improve AIMS suitability and effectiveness | ⚠️ Partial | Versioned policies enable iteration; formal improvement cycle to be established post-pilot |

### Annex B — AI-Specific Controls

| Control | Status | Implementation |
|---|---|---|
| **B.2** AI policy documentation | ✅ Conformant | Per-organization configurable policy engine; policies stored and versioned in database |
| **B.3** AI risk management process | ✅ Conformant | Multi-agent risk analysis; PII detection; content policy enforcement; adversarial testing |
| **B.4** Responsible AI principles | ✅ Conformant | Ethics Guardian agent in Council; dissent capture (cannot be silently removed); bias detection |
| **B.5** AI system documentation | ✅ Conformant | AI Manifest™ per interaction with SHA-256 signature; model identification; input/output record |
| **B.6** Monitoring and review of AI systems | ✅ Conformant | Real-time dashboard; anomaly alerts; compliance scoring; historical trend analysis |
| **B.7** AI system transparency | ✅ Conformant | Full deliberation transcripts; reasoning chains preserved; evidence citations; explainability features |
| **B.8** Data governance for AI | ⚠️ Partial | PII detection and protection operational; data quality monitoring planned; formal data governance cadence post-pilot |
| **B.9** Third-party AI management | ⚠️ Partial | Gateway architecture audits all AI providers uniformly; formal vendor risk assessment framework planned |
| **B.10** AI incident management | ⚠️ Partial | Alert system operational; formal incident response procedures to be documented per-customer |

---

## 3. Gap Analysis Summary

### Fully Conformant (20 of 28 areas)
Core AIMS implementation, policy management, risk assessment, documentation, monitoring, audit trails, transparency, human oversight, and operational controls.

### Partially Conformant (8 of 28 areas)
These gaps are **process gaps, not technology gaps**. The platform provides the technical capability; formal organizational processes need to be established per-customer during deployment:

| Gap | Nature | Remediation |
|---|---|---|
| AI objectives planning (6.2) | Needs per-customer objective-setting cadence | Established during POC onboarding |
| Competence assessment (7.2) | Needs formal competency framework | Training program included in POC; framework in Q2 2026 |
| AI system impact assessment (8.4) | DPIA template created; automated scoring planned | DPIA template available now; automation in Q3 2026 |
| Management review cadence (9.3) | Needs scheduled review process | Established during POC; recommended quarterly |
| Corrective action tracking (10.1) | Needs formal tracking workflow | Planned for Q3 2026 |
| Continual improvement cycle (10.2) | Needs formal improvement process | Established post-pilot based on metrics baseline |
| Data governance cadence (B.8) | Needs formal data quality process | Planned for Q2 2026 |
| Third-party AI management (B.9) | Needs vendor risk assessment framework | Planned for Q3 2026 |
| AI incident management (B.10) | Needs documented incident response | Per-customer documentation during deployment |

### Non-Conformant
None. All areas have at minimum a partial implementation.

---

## 4. Roadmap to INACAL Certification

| Milestone | Status | Target Date |
|---|---|---|
| Self-assessment v2.0 (this document) | ✅ Complete | March 2026 |
| DPIA template for Ley 29733 | ✅ Complete | March 2026 |
| DS N° 115-2025-PCM compliance statement | ✅ Complete | March 2026 |
| First regulated pilot deployment (FEPCMAC POC) | 🔄 In progress | Q2 2026 |
| Close process gaps during POC (6.2, 7.2, 9.3, 10.2) | 📋 Planned | Q2 2026 |
| Formal data governance cadence (B.8) | 📋 Planned | Q2 2026 |
| Incident management documentation (B.10) | 📋 Planned | Q2 2026 |
| Third-party management framework (B.9) | 📋 Planned | Q3 2026 |
| Corrective action tracking (10.1) | 📋 Planned | Q3 2026 |
| Pre-certification readiness review | 📋 Planned | Q3 2026 |
| INACAL certification application | 📋 Planned | Q3 2026 |
| INACAL certification audit | 📋 Planned | Q4 2026 |

---

## 5. Declaration

This self-assessment was conducted by Datacendia's CEO against the published text of ISO/IEC 42001:2023. It reflects the honest current state of the platform and its organizational processes as of the date above.

The assessment identifies 8 partial conformance areas, all of which are process gaps — not technology gaps — that will be closed during the first regulated pilot deployment. No areas are non-conformant.

Datacendia is pursuing formal INACAL certification against ISO/IEC 42001:2023 as adopted by DS N° 115-2025-PCM.

---

**Stuart Rainey**  
Chief Executive Officer  
Datacendia, LLC  
March 2026
