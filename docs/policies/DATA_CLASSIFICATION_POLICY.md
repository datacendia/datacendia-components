# Data Classification Policy

**Datacendia, LLC**
**Version:** 1.0
**Effective Date:** April 15, 2026
**Owner:** CISO
**Classification:** Internal

---

## 1. Purpose

This policy defines data classification levels and handling requirements to ensure appropriate protection of information based on its sensitivity and regulatory requirements.

## 2. Classification Levels

### Level 4 — Restricted
**Description:** Highest sensitivity. Data subject to specific regulatory protection.

**Examples:**
- Protected Health Information (PHI)
- Personally Identifiable Information (PII): SSN, financial account numbers, biometric data
- Encryption keys and secrets
- Authentication credentials
- Customer database connection strings

**Controls:**
- AES-256 encryption at rest and in transit (mandatory)
- Access limited to authorized personnel with documented business need
- All access logged and auditable
- PII detection and blocking via CendiaGateway
- Data masking in non-production environments
- Retention per regulatory requirements (HIPAA: 6 years, GDPR: per purpose)

### Level 3 — Confidential
**Description:** Business-sensitive data that could cause harm if disclosed.

**Examples:**
- Decision records and deliberation transcripts
- Audit logs and compliance reports
- Customer configuration data
- Financial data and pricing
- Internal security assessments

**Controls:**
- Encryption at rest and in transit
- RBAC access enforcement
- Audit logging of access
- No sharing outside organization without authorization
- Clean desk policy for printed materials

### Level 2 — Internal
**Description:** Information intended for internal use only.

**Examples:**
- Architecture documentation
- Source code
- Development configurations
- Internal communications
- Training materials

**Controls:**
- Authentication required for access
- Not to be shared externally without approval
- Standard access controls

### Level 1 — Public
**Description:** Information approved for public distribution.

**Examples:**
- Marketing materials
- Public documentation
- Published privacy policy
- Open-source components

**Controls:**
- No special handling required
- Review before publication

## 3. PII Categories

Per CendiaGateway PIIDetector, the following PII types are automatically detected and classified as Restricted:

| PII Type | Detection Method | Default Action |
|----------|-----------------|----------------|
| Social Security Number | Pattern matching (XXX-XX-XXXX) | Block |
| Credit Card Number | Luhn validation + pattern | Block |
| Medical Record Number | Pattern matching | Block |
| Bank Account Number | Pattern matching | Block |
| Passport Number | Pattern matching | Block |
| Driver's License | Pattern matching | Block |
| Email Address | RFC 5322 pattern | Redact |
| Phone Number | International pattern | Redact |
| IP Address | IPv4/IPv6 pattern | Redact |
| Date of Birth | Date pattern matching | Redact |

## 4. Data Handling Matrix

| Action | Restricted | Confidential | Internal | Public |
|--------|-----------|--------------|----------|--------|
| **Store** | Encrypted (AES-256) | Encrypted | Standard | Standard |
| **Transmit** | TLS 1.3 required | TLS 1.3 required | TLS recommended | Any |
| **Print** | Prohibited | Approval required | Standard | Standard |
| **Copy** | Prohibited | Logged | Standard | Standard |
| **Share externally** | Prohibited | NDA + approval | Approval | Standard |
| **Dispose** | Cryptographic erasure | Secure deletion | Standard deletion | Standard |

## 5. Labeling

- Restricted data must be labeled in metadata and storage
- PII detected by CendiaGateway is automatically classified
- Document headers should include classification level
- Database columns containing sensitive data must be documented

## 6. Compliance Mapping

| Framework | Requirement | This Policy Section |
|-----------|-------------|-------------------|
| GDPR Art 5(1)(f) | Integrity and confidentiality | Sections 2-4 |
| HIPAA §164.312(a) | Access control | Section 2 (Restricted) |
| SOC 2 C1.1 | Confidential information identification | Section 2 |
| ISO 27001 A.5.12 | Classification of information | Section 2 |
| NIST 800-53 RA-2 | Security categorization | Section 2 |
| PCI DSS 3.4 | Render PAN unreadable | Section 2 (Restricted) |

---

**Approved by:** Stuart Rainey, CEO/Owner
**Date:** April 15, 2026
