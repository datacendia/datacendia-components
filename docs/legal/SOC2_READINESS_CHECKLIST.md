# Datacendia SOC 2 Type II Readiness Checklist

**Effective Date:** March 2026  
**Last Updated:** March 2026  
**Version:** 1.0  
**Target Audit Date:** TBD

---

## Overview

This document maps Datacendia's existing controls to the SOC 2 Trust Services Criteria (TSC). It is intended to identify readiness gaps before engaging a formal SOC 2 Type II auditor.

**SOC 2 Trust Services Categories:**
1. Security (Common Criteria — required)
2. Availability
3. Processing Integrity
4. Confidentiality
5. Privacy

---

## 1. Security (Common Criteria)

### CC1 — Control Environment

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC1.1 | Management demonstrates commitment to integrity and ethics | 🟡 Partial | Code of conduct not yet formalized |
| CC1.2 | Board exercises oversight | 🟡 Partial | Single founder; advisory board pending |
| CC1.3 | Management establishes structure, authority, responsibility | ✅ Done | RBAC system with OWNER/ADMIN/USER/VIEWER roles |
| CC1.4 | Commitment to competence | ✅ Done | Engineering team credentials documented |
| CC1.5 | Accountability for internal controls | 🟡 Partial | Audit logging exists; formal control owner assignment pending |

### CC2 — Communication and Information

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC2.1 | Internal communication of objectives | 🟡 Partial | ROADMAP.md, product bible; formal policy manual pending |
| CC2.2 | Internal communication of control responsibilities | ❌ Missing | Need formal security policy document |
| CC2.3 | External communication with third parties | ✅ Done | Privacy Policy, ToS, DPA, Subprocessor list |

### CC3 — Risk Assessment

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC3.1 | Specifies objectives with clarity | ✅ Done | SLA with uptime targets, support SLOs |
| CC3.2 | Identifies and analyzes risks | 🟡 Partial | IMPLEMENTATION_GAP_ANALYSIS.md exists; formal risk register pending |
| CC3.3 | Considers potential for fraud | 🟡 Partial | Honeypot endpoints, abuse detection; formal fraud risk assessment pending |
| CC3.4 | Identifies and assesses significant changes | ✅ Done | CHANGELOG.md, git history, CI/CD pipeline |

### CC4 — Monitoring Activities

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC4.1 | Selects and develops monitoring activities | ✅ Done | SystemHealthService, Prometheus metrics, Grafana dashboards |
| CC4.2 | Evaluates and communicates deficiencies | ✅ Done | Public status page (`/status`), alert system, incident logging |

### CC5 — Control Activities

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC5.1 | Selects and develops control activities | ✅ Done | requireLicense middleware, FeatureControlService, OPA policies |
| CC5.2 | Selects and develops technology controls | ✅ Done | CendiaGateway PII detection, NeMo Guardrails, rate limiting |
| CC5.3 | Deploys through policies and procedures | 🟡 Partial | Controls are implemented in code; written policy docs pending |

### CC6 — Logical and Physical Access

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC6.1 | Logical access security over infrastructure | ✅ Done | Cloud provider IAM, SSH key-only access |
| CC6.2 | User access provisioning | ✅ Done | TenantService, invitation system, role assignment |
| CC6.3 | User access removal | ✅ Done | Account suspension, tenant deactivation |
| CC6.4 | User access review | 🟡 Partial | Admin dashboard shows users; periodic access review process pending |
| CC6.5 | Physical access restrictions | N/A | Cloud-hosted; physical security delegated to cloud provider |
| CC6.6 | System account management | ✅ Done | API keys, OAuth tokens, scoped service credentials |
| CC6.7 | Data access restrictions | ✅ Done | Organization-scoped data isolation, RBAC, CendiaGateway scoping |
| CC6.8 | Protection against unauthorized access | ✅ Done | Helmet, CORS, CSRF, rate limiting, MFA, JWT auth |

### CC7 — System Operations

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC7.1 | Detects and monitors configuration changes | ✅ Done | Git version control, CI/CD, Prisma migration tracking |
| CC7.2 | Monitors system components for anomalies | ✅ Done | Flink CEP rules, SystemHealthService, Prometheus alerts |
| CC7.3 | Evaluates security events | ✅ Done | Audit logging, Flink CEP escalation, immutable audit ledger |
| CC7.4 | Responds to identified security incidents | 🟡 Partial | Incident response documented in SLA; formal IRP being created |
| CC7.5 | Identifies and develops recovery activities | ✅ Done | BACKUP_RECOVERY.md, RPO 1hr/RTO 4hr targets, Docker Compose HA |

### CC8 — Change Management

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC8.1 | Manages changes to infrastructure and software | ✅ Done | CI/CD pipeline (11 jobs), PR reviews, automated testing |

### CC9 — Risk Mitigation

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| CC9.1 | Identifies and assesses vendor risk | 🟡 Partial | Subprocessor list exists; formal vendor risk assessments pending |
| CC9.2 | Assesses vendor compliance | 🟡 Partial | DPAs with AI providers; SOC 2 reports not yet collected from vendors |

---

## 2. Availability

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| A1.1 | Processing capacity meets demand | ✅ Done | Auto-scaling config, rate limiting, usage tracking |
| A1.2 | Environmental protections | N/A | Cloud-hosted; delegated to cloud provider |
| A1.3 | Recovery objectives defined | ✅ Done | SLA: RPO 1hr, RTO 4hr, 99.9% uptime (Enterprise) |

---

## 3. Processing Integrity

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| PI1.1 | Completeness and accuracy of processing | ✅ Done | DCII hash chains, Merkle tree evidence, Regulator's Receipt |
| PI1.2 | System inputs validated | ✅ Done | Input sanitization middleware, Zod schema validation |
| PI1.3 | Processing performed as authorized | ✅ Done | CendiaGateway policy enforcement, OPA authorization |
| PI1.4 | System outputs reviewed | ✅ Done | NeMo Guardrails, PII detection on outputs, AI Manifest |
| PI1.5 | System inputs stored completely and accurately | ✅ Done | Prisma ORM with transactions, WAL archiving |

---

## 4. Confidentiality

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| C1.1 | Confidential information identified | ✅ Done | Data classification via OPA policies (ISO 27001 levels) |
| C1.2 | Confidential information disposed of | 🟡 Partial | Data retention policy defined; automated purge jobs pending |

---

## 5. Privacy

| Control | Requirement | Status | Evidence |
|---------|-------------|--------|----------|
| P1.1 | Privacy notice provided | ✅ Done | Privacy Policy (docs/legal/PRIVACY_POLICY.md) |
| P2.1 | Consent obtained | ✅ Done | Cookie consent banner, ToS acceptance |
| P3.1 | Personal information collected for identified purposes | ✅ Done | Privacy Policy §4 documents all purposes |
| P4.1 | Use limited to identified purposes | ✅ Done | No data selling, no ad targeting, no AI training on content |
| P5.1 | Data retention policies | ✅ Done | Retention schedule in Privacy Policy §7 |
| P6.1 | Access provided to data subjects | ✅ Done | Settings > Data Export, GDPR rights documented |
| P7.1 | Correction mechanisms | ✅ Done | Account settings, privacy@datacendia.com for requests |
| P8.1 | Complaints and disputes | ✅ Done | Privacy Policy §12, DPA dispute resolution |

---

## Summary Scorecard

| Category | Total Controls | ✅ Done | 🟡 Partial | ❌ Missing | N/A |
|----------|---------------|---------|-----------|-----------|-----|
| **CC1 — Control Environment** | 5 | 2 | 3 | 0 | 0 |
| **CC2 — Communication** | 3 | 1 | 1 | 1 | 0 |
| **CC3 — Risk Assessment** | 4 | 2 | 2 | 0 | 0 |
| **CC4 — Monitoring** | 2 | 2 | 0 | 0 | 0 |
| **CC5 — Control Activities** | 3 | 2 | 1 | 0 | 0 |
| **CC6 — Access Controls** | 8 | 6 | 1 | 0 | 1 |
| **CC7 — Operations** | 5 | 4 | 1 | 0 | 0 |
| **CC8 — Change Management** | 1 | 1 | 0 | 0 | 0 |
| **CC9 — Risk Mitigation** | 2 | 0 | 2 | 0 | 0 |
| **Availability** | 3 | 2 | 0 | 0 | 1 |
| **Processing Integrity** | 5 | 5 | 0 | 0 | 0 |
| **Confidentiality** | 2 | 1 | 1 | 0 | 0 |
| **Privacy** | 8 | 8 | 0 | 0 | 0 |
| **TOTAL** | **51** | **36 (71%)** | **12 (23%)** | **1 (2%)** | **2 (4%)** |

---

## Remediation Priorities

### Must-Fix Before Audit

| Gap | Effort | Owner |
|-----|--------|-------|
| CC2.2 — Formal security policy document | 2 days | Legal / Engineering |
| CC1.1 — Code of conduct | 1 day | Legal |
| CC7.4 — Formal Incident Response Plan | 1 day | Engineering (see INCIDENT_RESPONSE_PLAN.md) |
| CC9.1/CC9.2 — Vendor risk assessments | 1 week | Legal / Procurement |
| CC6.4 — Periodic access review process | 2 days | Engineering |
| C1.2 — Automated data purge jobs | 3 days | Engineering |

### Nice-to-Have

| Gap | Effort | Owner |
|-----|--------|-------|
| CC1.2 — Advisory board formalization | Ongoing | CEO |
| CC3.2 — Formal risk register | 2 days | Engineering |
| CC5.3 — Written security policies | 1 week | Legal / Engineering |

---

## Recommended Audit Firms

- **Vanta** — Automated SOC 2 compliance platform (recommended for startups)
- **Drata** — Continuous compliance automation
- **Laika** — SOC 2 + ISO 27001 combined
- **Schellman** — Traditional audit firm (enterprise preference)

---

**⚠️ IMPORTANT DISCLAIMER:**  
This self-assessment should be validated by a qualified SOC 2 auditor. Control mappings are based on the 2022 Trust Services Criteria. Your auditor may interpret criteria differently.
