# HIPAA Security Rule Self-Assessment

**Organization**: Datacendia, Inc.  
**Assessment Date**: January 2026  
**Prepared By**: Security Team

---

## Executive Summary

This self-assessment evaluates Datacendia's alignment with HIPAA Security Rule requirements for customers who process Protected Health Information (PHI).

**Overall Readiness**: **Architecture Aligned** — Technical safeguards implemented. BAA available upon request.

| Safeguard Category | Status | Score |
|--------------------|--------|-------|
| Administrative Safeguards | ✅ Implemented | 85% |
| Physical Safeguards | ✅ Implemented | 90% |
| Technical Safeguards | ✅ Implemented | 95% |

---

## Important Notes

1. **Datacendia as Business Associate**: When processing PHI, Datacendia acts as a Business Associate under HIPAA.
2. **BAA Required**: A Business Associate Agreement must be executed before processing PHI.
3. **Sovereign Deployment Recommended**: For maximum PHI protection, Sovereign (on-premise) deployment is recommended.

---

## Administrative Safeguards (§164.308)

### (a)(1) Security Management Process

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Risk Analysis | ✅ | Annual risk assessments conducted |
| Risk Management | ✅ | Risk register maintained, mitigation tracked |
| Sanction Policy | ✅ | Employee handbook includes security violations |
| Information System Activity Review | ✅ | Audit logs reviewed, anomaly detection |

### (a)(2) Assigned Security Responsibility

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Security Official | ✅ | Security team lead designated |

### (a)(3) Workforce Security

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Authorization/Supervision | ✅ | Role-based access, manager approval |
| Workforce Clearance | ✅ | Background checks for employees |
| Termination Procedures | ✅ | Immediate access revocation on termination |

### (a)(4) Information Access Management

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Access Authorization | ✅ | Documented approval process |
| Access Establishment/Modification | ✅ | Ticketed access requests |

### (a)(5) Security Awareness and Training

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Security Reminders | ✅ | Monthly security tips |
| Protection from Malware | ✅ | Endpoint protection, training |
| Log-in Monitoring | ✅ | Failed login alerts |
| Password Management | ✅ | Password policy, complexity requirements |

### (a)(6) Security Incident Procedures

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Response and Reporting | ✅ | Incident response plan, 72-hour notification |

### (a)(7) Contingency Plan

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Data Backup Plan | ✅ | Daily encrypted backups |
| Disaster Recovery Plan | ✅ | DR procedures documented |
| Emergency Mode Operation | ✅ | Degraded mode procedures |
| Testing and Revision | ✅ | Annual DR testing |
| Applications and Data Criticality | ✅ | Criticality assessment completed |

### (a)(8) Evaluation

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Periodic Evaluation | ✅ | Annual security assessments |

### (b)(1) Business Associate Contracts

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Written Contract | ✅ | BAA template available |

---

## Physical Safeguards (§164.310)

### (a)(1) Facility Access Controls

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Contingency Operations | ✅ | Alternate site procedures |
| Facility Security Plan | ✅ | Cloud provider SOC 2 compliance |
| Access Control/Validation | ✅ | Badge access, visitor logs |
| Maintenance Records | ✅ | Maintenance documentation |

### (b) Workstation Use

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Workstation Use Policy | ✅ | Acceptable use policy |

### (c) Workstation Security

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Physical Safeguards | ✅ | Encrypted laptops, screen locks |

### (d)(1) Device and Media Controls

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Disposal | ✅ | Secure disposal procedures |
| Media Re-use | ✅ | Secure wiping before re-use |
| Accountability | ✅ | Asset inventory |
| Data Backup and Storage | ✅ | Encrypted backup storage |

---

## Technical Safeguards (§164.312)

### (a)(1) Access Control

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Unique User Identification | ✅ | Unique user IDs, no shared accounts |
| Emergency Access Procedure | ✅ | Break-glass procedures documented |
| Automatic Logoff | ✅ | 15-minute session timeout |
| Encryption and Decryption | ✅ | AES-256 encryption at rest |

### (b) Audit Controls

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Audit Controls | ✅ | Comprehensive audit logging |
| | | Immutable hash-chain audit trail |
| | | 7-year log retention |

### (c)(1) Integrity

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Mechanism to Authenticate ePHI | ✅ | SHA-256 checksums, Merkle trees |

### (c)(2) Person or Entity Authentication

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Authentication | ✅ | MFA required, SSO supported |

### (d)(1) Transmission Security

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Integrity Controls | ✅ | TLS 1.3, certificate validation |
| Encryption | ✅ | All data encrypted in transit |

---

## Organizational Requirements (§164.314)

### Business Associate Contracts

Datacendia provides a standard Business Associate Agreement (BAA) that includes:

- Permitted uses and disclosures of PHI
- Safeguards requirements
- Reporting obligations for breaches
- Subcontractor requirements
- Return/destruction of PHI on termination

**BAA available upon request**: compliance@datacendia.com

---

## Policies and Procedures (§164.316)

| Requirement | Status | Implementation |
|-------------|--------|----------------|
| Policies and Procedures | ✅ | Documented security policies |
| Documentation | ✅ | 6-year retention of policies |
| Updates | ✅ | Annual policy review |

---

## Gap Analysis

### Current Gaps

| Gap | Severity | Remediation | Target |
|-----|----------|-------------|--------|
| Third-party HIPAA audit | Low | Available on enterprise contract | On demand |
| Formal BAA execution | N/A | Executed per customer | Per contract |

### Recommendations for Healthcare Customers

1. **Execute BAA** before processing any PHI
2. **Use Sovereign Deployment** for maximum control
3. **Enable Enhanced Audit Logging** for PHI access
4. **Configure Retention Policies** per HIPAA requirements (6 years)
5. **Restrict Access** to minimum necessary workforce

---

## Technical Controls Summary

| Control | Implementation | HIPAA Reference |
|---------|----------------|-----------------|
| Encryption at Rest | AES-256 | §164.312(a)(2)(iv) |
| Encryption in Transit | TLS 1.3 | §164.312(e)(2)(ii) |
| Access Control | RBAC + MFA | §164.312(a)(1) |
| Audit Logging | Immutable logs | §164.312(b) |
| Integrity | Hash chains | §164.312(c)(1) |
| Authentication | MFA, SSO | §164.312(d) |
| Automatic Logoff | 15-min timeout | §164.312(a)(2)(iii) |
| Unique User ID | Per-user accounts | §164.312(a)(2)(i) |

---

## Business Associate Agreement (BAA) Template

A standard BAA template is available that covers:

1. **Definitions** — PHI, Security Incident, Breach
2. **Obligations** — Safeguards, use limitations, subcontractors
3. **Permitted Uses** — Treatment, payment, operations
4. **Individual Rights** — Access, amendment, accounting
5. **Breach Notification** — 60-day notification requirement
6. **Termination** — Return/destruction of PHI
7. **Liability** — Indemnification provisions

**Request BAA**: compliance@datacendia.com

---

## Attestation

This self-assessment was prepared in good faith based on current controls and practices.

**Prepared By**: Security Team  
**Reviewed By**: Engineering Leadership  
**Date**: January 2026

---

*This is a self-assessment, not a formal HIPAA audit. Datacendia does not provide legal advice. Customers should consult their own legal counsel regarding HIPAA compliance.*

*© 2026 Datacendia, Inc.*
