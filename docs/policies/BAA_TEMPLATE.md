# Business Associate Agreement (BAA) Template

**Datacendia, LLC**
**Version:** 1.0
**Classification:** Confidential

---

> **Note:** This is a template. Actual BAAs must be reviewed by legal counsel before execution.

## BUSINESS ASSOCIATE AGREEMENT

This Business Associate Agreement ("BAA") is entered into as of [DATE] ("Effective Date") by and between:

**Covered Entity:** [CUSTOMER NAME] ("Covered Entity")
**Business Associate:** Datacendia, LLC ("Business Associate")

### 1. DEFINITIONS

Terms used in this BAA shall have the same meaning as defined in the HIPAA Privacy Rule (45 CFR Part 160 and Part 164, Subparts A and E), the HIPAA Security Rule (45 CFR Part 160 and Part 164, Subparts A and C), and the HITECH Act (42 USC §17921 et seq.).

### 2. OBLIGATIONS OF BUSINESS ASSOCIATE

Business Associate agrees to:

**(a)** Not use or disclose Protected Health Information (PHI) other than as permitted or required by this BAA or as required by law.

**(b)** Use appropriate administrative, physical, and technical safeguards to prevent unauthorized use or disclosure of PHI, including:
- AES-256 encryption at rest for all PHI
- TLS 1.3 encryption in transit
- Role-Based Access Control (RBAC) via Casbin
- Immutable audit logging with SHA-256 hash chain
- PII detection and blocking via CendiaGateway

**(c)** Report to Covered Entity any use or disclosure of PHI not provided for by this BAA of which it becomes aware, including any Security Incident or Breach of Unsecured PHI, within **48 hours** of discovery.

**(d)** Ensure that any subcontractors or agents that create, receive, maintain, or transmit PHI on behalf of Business Associate agree to the same restrictions and conditions.

**(e)** Make PHI available to satisfy Covered Entity's obligations under 45 CFR §164.524 (Individual's Right of Access) within **15 business days** of request.

**(f)** Make PHI available for amendment and incorporate amendments as required by 45 CFR §164.526.

**(g)** Maintain an accounting of disclosures as required by 45 CFR §164.528.

**(h)** Make internal practices, books, and records available to the Secretary of HHS for determining compliance.

**(i)** Retain PHI-related audit logs for a minimum of **6 years** from the date of creation or last effective date, whichever is later, per 45 CFR §164.530(j).

### 3. PERMITTED USES AND DISCLOSURES

Business Associate may use and disclose PHI only for:

**(a)** Performance of services under the underlying Service Agreement between the parties, including:
- Decision governance and audit trail recording
- Compliance monitoring and enforcement
- Evidence generation for regulatory defense

**(b)** Business Associate's proper management and administration, provided disclosures are required by law or Business Associate obtains reasonable assurances that the information will be held confidentially.

**(c)** Data aggregation services for the healthcare operations of Covered Entity.

### 4. OBLIGATIONS OF COVERED ENTITY

Covered Entity shall:

**(a)** Notify Business Associate of any restrictions on use or disclosure of PHI that Covered Entity has agreed to.

**(b)** Notify Business Associate of any changes in or revocation of authorization to use or disclose PHI.

**(c)** Not request Business Associate to use or disclose PHI in any manner that would violate HIPAA.

### 5. TERM AND TERMINATION

**(a)** This BAA is effective as of the Effective Date and terminates upon termination of the Service Agreement or when either party terminates for cause.

**(b)** Upon termination, Business Associate shall return or destroy all PHI. If return or destruction is not feasible, protections of this BAA extend to retained PHI.

**(c)** Either party may terminate if the other materially breaches this BAA and fails to cure within **30 days** of notice.

### 6. SOVEREIGN DEPLOYMENT PROVISIONS

The Datacendia DCII platform deploys on Covered Entity's own infrastructure:

**(a)** PHI remains within Covered Entity's controlled environment at all times.

**(b)** AI inference is performed locally — no PHI is transmitted to external services.

**(c)** Business Associate's access to PHI is limited to support and maintenance activities authorized by Covered Entity.

**(d)** Covered Entity maintains physical security controls for the hosting environment.

### 7. BREACH NOTIFICATION

**(a)** Business Associate shall notify Covered Entity within **48 hours** of discovery of a Breach of Unsecured PHI.

**(b)** Notification shall include: nature of the breach, PHI involved, individuals affected, actions taken, and mitigation steps.

**(c)** Business Associate shall cooperate with Covered Entity's investigation and notification obligations.

### 8. MISCELLANEOUS

This BAA shall be governed by the laws of the State of [STATE]. Any ambiguity shall be resolved in favor of a meaning that complies with HIPAA.

---

**IN WITNESS WHEREOF**, the parties have executed this BAA as of the Effective Date.

| | Covered Entity | Business Associate |
|---|---|---|
| **Signature** | _________________ | _________________ |
| **Name** | [NAME] | Stuart Rainey |
| **Title** | [TITLE] | CEO/Owner |
| **Date** | [DATE] | [DATE] |
