# Information Security Policy

**Datacendia, LLC**
**Version:** 1.0
**Effective Date:** April 15, 2026
**Last Reviewed:** April 15, 2026
**Owner:** CISO
**Classification:** Internal

---

## 1. Purpose

This policy establishes the information security requirements for the Datacendia Decision Crisis Immunization Infrastructure (DCII) platform and all supporting operations. It defines the security objectives, roles, responsibilities, and controls necessary to protect information assets.

## 2. Scope

This policy applies to:
- All Datacendia employees, contractors, and third parties with access to Datacendia systems
- All information assets, including data, software, hardware, and documentation
- All environments: development, staging, and production
- Customer-deployed instances of the DCII platform

## 3. Information Security Objectives

1. **Confidentiality:** Protect sensitive information from unauthorized disclosure
2. **Integrity:** Ensure accuracy and completeness of information and processing methods
3. **Availability:** Ensure authorized users have access to information when needed
4. **Accountability:** Maintain audit trails for all actions affecting security

## 4. Roles and Responsibilities

| Role | Responsibilities |
|------|-----------------|
| **CEO/Owner** | Overall accountability for information security; resource allocation |
| **CISO** | ISMS operation; risk management; incident response; compliance monitoring |
| **CTO** | Technical controls; secure development lifecycle; architecture security |
| **DPO** | Privacy compliance; GDPR/HIPAA oversight; data subject rights |
| **All Staff** | Comply with this policy; report security incidents; complete security training |

## 5. Access Control

- **Authentication:** All access requires JWT-based authentication with configurable session duration
- **Authorization:** Role-Based Access Control (RBAC) enforced via Casbin policy engine
- **Least Privilege:** Users receive minimum access necessary for their role
- **Access Reviews:** Quarterly review of user access rights
- **Account Lifecycle:** Formal provisioning and deprovisioning procedures

### 5.1 Password Requirements
- Minimum 12 characters
- Combination of uppercase, lowercase, numbers, and special characters
- No reuse of last 12 passwords
- Maximum age of 90 days

### 5.2 Multi-Factor Authentication
- MFA required for administrative access
- MFA recommended for all users
- Hardware tokens preferred; TOTP acceptable

## 6. Data Classification

| Level | Description | Examples | Controls |
|-------|-------------|----------|----------|
| **Restricted** | Highest sensitivity; regulatory protected | PHI, PII, credentials, encryption keys | Encryption required; access logged; need-to-know basis |
| **Confidential** | Business sensitive | Decision records, audit logs, financial data | Encryption at rest; RBAC enforced |
| **Internal** | For internal use | Architecture docs, code, configurations | Authentication required |
| **Public** | No restrictions | Marketing materials, public documentation | None required |

## 7. Encryption Standards

- **At Rest:** AES-256 for all sensitive data
- **In Transit:** TLS 1.3 for all communications; HSTS enforced
- **Key Management:** Via KMS service (AWS KMS, HashiCorp Vault, Azure Key Vault, or local)
- **Hashing:** SHA-256 for integrity verification; bcrypt for password storage
- **Post-Quantum:** ML-DSA and SLH-DSA algorithms available for future-proofing

## 8. Incident Response

Security incidents must be reported immediately to the CISO. See the Incident Response Plan for detailed procedures including:
- Detection and analysis
- Containment and eradication
- Recovery and post-incident review
- Regulatory notification requirements (GDPR: 72 hours, HIPAA: 60 days, NIS2: 24 hours)

## 9. Change Management

- All changes to production systems require pull request review
- Security-impacting changes require CISO approval
- Emergency changes must be documented within 24 hours
- Rollback procedures must be documented for all changes

## 10. Business Continuity

- BCP/DR plan maintained and tested annually
- Recovery Time Objective (RTO): 4 hours
- Recovery Point Objective (RPO): 1 hour
- Database backups per customer configuration

## 11. Vendor Management

- Vendors with access to sensitive data require BAA or DPA
- Annual vendor risk assessments
- Sovereign architecture minimizes vendor dependencies
- Subprocessor list maintained and communicated to customers

## 12. Compliance

This policy supports compliance with:
- SOC 2 Type II (Trust Services Criteria)
- ISO 27001:2022 (Annex A controls)
- GDPR (Articles 5, 25, 32)
- HIPAA (Administrative Safeguards §164.308)
- NIST 800-53 Rev 5
- FedRAMP (when applicable)

## 13. Training

- Security awareness training required within 30 days of onboarding
- Annual security refresher training
- Role-specific training for administrators and developers
- Phishing simulation exercises quarterly

## 14. Monitoring and Audit

- All security events logged to immutable audit ledger
- Continuous compliance monitoring via ContinuousComplianceMonitorService
- Log retention: minimum 6 years (HIPAA requirement)
- Annual internal security audit

## 15. Policy Review

This policy is reviewed annually or upon significant changes to:
- The threat landscape
- Regulatory requirements
- Business operations
- Technology infrastructure

## 16. Enforcement

Violations of this policy may result in disciplinary action up to and including termination. Violations that constitute criminal activity will be reported to appropriate authorities.

---

**Approved by:** Stuart Rainey, CEO/Owner
**Date:** April 15, 2026
