# Data Processing Agreement (DPA)

**Between Datacendia, Inc. ("Processor") and Customer ("Controller")**

**Effective Date**: [Insert Date]

---

## 1. Definitions

**"Personal Data"** means any information relating to an identified or identifiable natural person.

**"Processing"** means any operation performed on Personal Data, including collection, storage, use, disclosure, or deletion.

**"Data Subject"** means the individual to whom Personal Data relates.

**"Sub-processor"** means any third party engaged by Processor to process Personal Data on behalf of Controller.

**"Applicable Data Protection Laws"** means all laws and regulations applicable to the processing of Personal Data, including GDPR, CCPA, and other relevant privacy laws.

---

## 2. Scope and Purpose

### 2.1 Subject Matter

This DPA governs the processing of Personal Data by Processor on behalf of Controller in connection with the Datacendia platform services.

### 2.2 Nature and Purpose of Processing

Processor will process Personal Data solely to provide the Datacendia platform services, including:

- User authentication and access management
- Decision intelligence and deliberation services
- Audit logging and compliance reporting
- Analytics and reporting as requested by Controller

### 2.3 Categories of Data Subjects

- Controller's employees and contractors
- Controller's customers (if uploaded by Controller)
- Other individuals whose data Controller uploads to the platform

### 2.4 Types of Personal Data

- Contact information (name, email, phone)
- Professional information (title, department, organization)
- Authentication data (hashed passwords, MFA tokens)
- Usage data (actions taken, timestamps, IP addresses)
- Content data (as uploaded by Controller)

---

## 3. Processor Obligations

### 3.1 Processing Instructions

Processor shall:

- Process Personal Data only on documented instructions from Controller
- Inform Controller if any instruction violates Applicable Data Protection Laws
- Not process Personal Data for any purpose other than providing the services

### 3.2 Confidentiality

Processor shall:

- Ensure all personnel processing Personal Data are bound by confidentiality obligations
- Limit access to Personal Data to personnel who need access to perform services

### 3.3 Security Measures

Processor shall implement appropriate technical and organizational measures, including:

| Category | Measures |
|----------|----------|
| **Encryption** | AES-256 at rest, TLS 1.3 in transit |
| **Access Control** | Role-based access, MFA, session management |
| **Audit Logging** | Immutable audit trails, tamper detection |
| **Data Isolation** | Logical separation per customer |
| **Backup** | Encrypted backups, tested recovery |
| **Incident Response** | Documented procedures, 24/7 monitoring |

See [Security Whitepaper](./SECURITY_WHITEPAPER.md) for detailed security controls.

### 3.4 Sub-processors

Processor shall:

- Not engage Sub-processors without Controller's prior written consent
- Maintain a list of approved Sub-processors (Annex B)
- Ensure Sub-processors are bound by equivalent data protection obligations
- Notify Controller of any intended changes to Sub-processors

**Current Sub-processors**: See Annex B

### 3.5 Data Subject Rights

Processor shall assist Controller in responding to Data Subject requests, including:

- Access requests
- Rectification requests
- Erasure requests ("right to be forgotten")
- Data portability requests
- Objection to processing

Processor will respond to Controller's assistance requests within 5 business days.

### 3.6 Data Breach Notification

Processor shall:

- Notify Controller of any Personal Data breach without undue delay (within 72 hours)
- Provide information necessary for Controller to meet breach notification obligations
- Cooperate with Controller's investigation and remediation efforts

Notification will include:
- Nature of the breach
- Categories and approximate number of Data Subjects affected
- Likely consequences
- Measures taken or proposed to address the breach

### 3.7 Data Protection Impact Assessments

Processor shall assist Controller with data protection impact assessments (DPIAs) where required, providing:

- Information about processing operations
- Technical and organizational measures
- Risk assessments

### 3.8 Audits

Controller may:

- Request documentation of Processor's compliance with this DPA
- Conduct audits (with reasonable notice) or appoint an independent auditor
- Review third-party audit reports (SOC 2, ISO 27001 when available)

Processor will make available all information necessary to demonstrate compliance.

---

## 4. Controller Obligations

Controller shall:

- Ensure lawful basis for processing Personal Data
- Provide clear instructions to Processor
- Ensure accuracy of Personal Data provided
- Respond to Data Subject requests in a timely manner
- Notify Processor of any changes affecting processing

---

## 5. International Transfers

### 5.1 Transfer Mechanisms

For transfers of Personal Data outside the EEA, Processor relies on:

- **Standard Contractual Clauses (SCCs)**: EU-approved clauses (Annex C)
- **Data Residency Options**: EU-only processing available
- **Sovereign Deployment**: On-premise deployment eliminates transfers

### 5.2 Transfer Impact Assessment

Processor has conducted transfer impact assessments and implemented supplementary measures where necessary.

---

## 6. Data Retention and Deletion

### 6.1 Retention

Processor will retain Personal Data only for as long as necessary to provide services, unless:

- Longer retention is required by law
- Controller requests extended retention in writing

### 6.2 Deletion

Upon termination of services or Controller's request:

- Processor will delete or return all Personal Data within 30 days
- Processor will provide written certification of deletion
- Backups will be purged according to retention schedule (maximum 90 days)

Controller may request data export in standard formats (JSON, CSV) before deletion.

---

## 7. Liability

### 7.1 Processor Liability

Processor is liable for damages caused by processing that:

- Violates Applicable Data Protection Laws
- Violates this DPA
- Is outside or contrary to Controller's lawful instructions

### 7.2 Limitation

Liability under this DPA is subject to the limitations in the main services agreement.

---

## 8. Term and Termination

### 8.1 Term

This DPA remains in effect for the duration of the services agreement.

### 8.2 Survival

Sections 3.6 (Breach Notification), 6 (Retention and Deletion), and 7 (Liability) survive termination.

---

## 9. Governing Law

This DPA is governed by the laws specified in the main services agreement, except where Applicable Data Protection Laws require otherwise.

---

## 10. Amendments

This DPA may be amended:

- By mutual written agreement
- By Processor to reflect changes in Applicable Data Protection Laws (with 30 days notice)

---

## Signatures

**Datacendia, Inc. (Processor)**

Name: _______________________

Title: _______________________

Date: _______________________

Signature: _______________________

---

**Customer (Controller)**

Company: _______________________

Name: _______________________

Title: _______________________

Date: _______________________

Signature: _______________________

---

## Annex A: Processing Details

| Element | Description |
|---------|-------------|
| **Subject Matter** | Datacendia platform services |
| **Duration** | Term of services agreement |
| **Nature of Processing** | Storage, analysis, display of decision data |
| **Purpose** | Providing decision intelligence services |
| **Data Categories** | Contact info, professional info, usage data, content |
| **Data Subject Categories** | Employees, contractors, customers |

---

## Annex B: Approved Sub-processors

| Sub-processor | Purpose | Location |
|---------------|---------|----------|
| *None for Sovereign deployments* | — | — |
| Amazon Web Services | Cloud infrastructure (Cloud tier only) | US/EU (customer choice) |
| Cloudflare | CDN, DDoS protection (Cloud tier only) | Global |

**Note**: Sovereign and Private Cloud deployments have no sub-processors. All processing occurs on customer infrastructure.

---

## Annex C: Standard Contractual Clauses

For transfers of Personal Data from the EEA to third countries, the parties agree to the EU Standard Contractual Clauses (Commission Implementing Decision 2021/914).

The SCCs are incorporated by reference and available at:
https://datacendia.com/legal/sccs

---

## Annex D: Technical and Organizational Measures

See [Security Whitepaper](./SECURITY_WHITEPAPER.md) for comprehensive security measures.

**Summary**:

| Category | Measures |
|----------|----------|
| **Access Control** | RBAC, MFA, SSO, session management |
| **Encryption** | AES-256 at rest, TLS 1.3 in transit |
| **Audit** | Immutable logs, hash chains, SIEM integration |
| **Availability** | Redundancy, backups, disaster recovery |
| **Incident Response** | 24/7 monitoring, documented procedures |
| **Data Minimization** | Purpose limitation, retention policies |

---

*© 2026 Datacendia, Inc. All rights reserved.*

*This template is provided for informational purposes. Consult legal counsel before execution.*
