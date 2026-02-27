# DATACENDIA SECURITY QUESTIONNAIRE
## Pre-Filled Responses for Enterprise Procurement

**Document Version:** 1.0
**Last Updated:** 2024
**Classification:** Customer Confidential

---

## SECTION 1: COMPANY INFORMATION

| Question | Response |
|----------|----------|
| Legal company name | Datacendia, Inc. |
| Year founded | 2023 |
| Headquarters location | [Your Location] |
| Number of employees | [Your Count] |
| Primary contact for security inquiries | security@datacendia.com |

---

## SECTION 2: CERTIFICATIONS & COMPLIANCE

| Question | Response |
|----------|----------|
| Do you maintain SOC 2 Type II certification? | In Progress — Architecture designed to SOC 2 Type II Trust Services Criteria. Formal audit planned; timing available on request. |
| Do you maintain ISO 27001 certification? | Roadmap - Planned for [Year]. Architecture designed to ISO 27001 controls. |
| Are you GDPR compliant? | Yes - Full GDPR compliance including Data Processing Agreement (DPA) available. |
| Are you HIPAA compliant? | Yes - HIPAA-compliant deployment option available. Business Associate Agreement (BAA) available. |
| Do you support PCI-DSS compliance? | Yes - Platform does not process payment card data directly. Can be deployed in PCI-compliant infrastructure. |
| Do you support FedRAMP? | Roadmap - FedRAMP Moderate planned for [Year]. Air-gapped deployment available for government clients now. |
| Do you conduct regular third-party security audits? | Yes - Annual penetration testing and security assessment by [Firm Name]. Results available upon NDA. |

---

## SECTION 3: DATA SECURITY

### 3.1 Data Encryption

| Question | Response |
|----------|----------|
| Is data encrypted at rest? | Yes - AES-256 encryption for all data at rest. |
| Is data encrypted in transit? | Yes - TLS 1.3 for all data in transit. |
| Do you support customer-managed encryption keys (CMEK)? | Yes - Sovereign deployment supports customer-managed keys. |
| Where are encryption keys stored? | Cloud deployment: Managed key service (AWS KMS / Azure Key Vault). Sovereign deployment: Customer-managed HSM or key store. |

### 3.2 Data Residency & Sovereignty

| Question | Response |
|----------|----------|
| Where is customer data stored? | Customer choice: US, EU, or customer's own data center (sovereign deployment). |
| Can data be restricted to specific geographic regions? | Yes - Full data residency controls available. |
| Does customer data ever leave the designated region? | No - Data remains in designated region. Sovereign deployment ensures data never leaves customer infrastructure. |
| Do you offer air-gapped deployment? | Yes - Full air-gapped deployment with zero external network dependencies. |

### 3.3 Data Handling

| Question | Response |
|----------|----------|
| How long is customer data retained? | Customer-configurable. Default: Active data retained while subscription active. 90-day deletion upon contract termination. |
| Can customers request data deletion? | Yes - Data deletion available upon request. Sovereign deployments: customer controls all data directly. |
| Is customer data used to train AI models? | No - Customer data is never used to train base AI models. Customer-specific fine-tuning available with explicit consent. |
| Is customer data shared with third parties? | No - Customer data is never shared with third parties without explicit consent. |
| Do AI queries go to external LLM providers? | Configurable - Cloud deployment can use OpenAI/Anthropic APIs (customer choice). Sovereign deployment uses local models only - no external calls. |

---

## SECTION 4: ACCESS CONTROL

| Question | Response |
|----------|----------|
| Do you support Single Sign-On (SSO)? | Yes - SAML 2.0, OpenID Connect, OAuth 2.0. |
| Do you support Multi-Factor Authentication (MFA)? | Yes - MFA required for all administrative access. Configurable for end users. |
| What SSO providers are supported? | Okta, Azure AD, Google Workspace, OneLogin, Ping Identity, custom SAML/OIDC. |
| Do you support Role-Based Access Control (RBAC)? | Yes - Granular RBAC with attribute-based access control (ABAC) available. |
| Can customers define custom roles? | Yes - Custom role creation and permission assignment supported. |
| Do you maintain audit logs of access? | Yes - Complete audit logging of all authentication, authorization, and data access events. |
| How long are access logs retained? | Minimum 1 year. Customer-configurable up to 7 years. |
| Can customers export audit logs? | Yes - Real-time export to customer SIEM (Splunk, Sentinel, etc.) supported. |

---

## SECTION 5: INFRASTRUCTURE SECURITY

### 5.1 Cloud Deployment

| Question | Response |
|----------|----------|
| What cloud providers do you use? | AWS and Azure (customer choice). |
| What regions are available? | US East, US West, EU West, EU North, Asia Pacific (expanding). |
| Is infrastructure isolated per customer? | Yes - Logical isolation at minimum. Dedicated infrastructure available for Enterprise tier. |
| Do you use container orchestration? | Yes - Kubernetes (EKS/AKS) with hardened configurations. |
| Are systems patched regularly? | Yes - Critical patches within 24 hours. Regular patches within 7 days. |

### 5.2 Sovereign Deployment

| Question | Response |
|----------|----------|
| Can the platform run on customer infrastructure? | Yes - Full sovereign deployment on customer VMs, Kubernetes, or bare metal. |
| What are the infrastructure requirements? | Minimum: 8 vCPU, 32GB RAM, 500GB storage. Production: Kubernetes cluster or 3+ VMs. |
| Does sovereign deployment require internet access? | No - Air-gapped deployment available with local LLM models (Ollama). |
| Who manages the sovereign deployment? | Customer manages infrastructure. Datacendia provides installation, updates, and support. |
| How are updates delivered for sovereign deployments? | Secure package delivery (offline-capable). Customer controls update schedule. |

---

## SECTION 6: APPLICATION SECURITY

| Question | Response |
|----------|----------|
| Do you follow secure development practices (SDLC)? | Yes - Security integrated into all phases of development. Code review required for all changes. |
| Do you perform static code analysis? | Yes - Automated SAST on every commit. |
| Do you perform dynamic application security testing? | Yes - Regular DAST scans and penetration testing. |
| How do you manage dependencies? | Automated dependency scanning (Snyk/Dependabot). No known critical vulnerabilities in production. |
| Do you have a vulnerability disclosure program? | Yes - Responsible disclosure policy at security@datacendia.com. |
| What is your SLA for critical vulnerabilities? | Critical: 24-hour mitigation. High: 7-day remediation. |

---

## SECTION 7: INCIDENT RESPONSE

| Question | Response |
|----------|----------|
| Do you have a documented incident response plan? | Yes - Documented and tested annually. |
| How quickly are customers notified of security incidents? | Critical incidents affecting customer data: within 24 hours. |
| Do you provide post-incident reports? | Yes - Root cause analysis and remediation report provided for any incident affecting customer. |
| Have you experienced any data breaches? | No - No data breaches to date. |
| Do you maintain cyber insurance? | Yes - Cyber liability insurance maintained. Details available upon NDA. |

---

## SECTION 8: BUSINESS CONTINUITY

| Question | Response |
|----------|----------|
| Do you have a disaster recovery plan? | Yes - Documented DR plan with annual testing. |
| What is your Recovery Time Objective (RTO)? | Cloud: 4 hours. Sovereign: Customer-defined. |
| What is your Recovery Point Objective (RPO)? | Cloud: 1 hour (continuous backup). Sovereign: Customer-defined. |
| Are backups encrypted? | Yes - All backups encrypted with AES-256. |
| Where are backups stored? | Cloud: Separate region from primary. Sovereign: Customer-controlled. |
| What is your uptime SLA? | Enterprise tier: 99.9% uptime SLA. |

---

## SECTION 9: VENDOR MANAGEMENT

| Question | Response |
|----------|----------|
| Do you use subprocessors? | Yes - List of subprocessors available in DPA. Customer notified of changes. |
| Key subprocessors | Cloud hosting: AWS/Azure. LLM (optional): OpenAI/Anthropic. Monitoring: Datadog. |
| Can customers opt out of specific subprocessors? | Yes - Sovereign deployment eliminates all third-party subprocessors. |
| Do you assess subprocessor security? | Yes - Annual security assessment of all critical subprocessors. |

---

## SECTION 10: AI-SPECIFIC SECURITY

| Question | Response |
|----------|----------|
| What LLM providers do you use? | Configurable: OpenAI, Anthropic (cloud). Ollama/local models (sovereign). |
| Does customer data train LLM base models? | No - Never. Base models are pre-trained. Customer data is only used for customer-specific context. |
| How is prompt injection prevented? | Input sanitization, output filtering, and sandboxed execution environment. |
| Are AI outputs filtered for sensitive data? | Yes - Configurable PII/sensitive data filtering on all outputs. |
| Can customers audit AI decision-making? | Yes - Full audit trail of all queries, agent responses, reasoning, and sources cited. |
| Do you implement AI ethics controls? | Yes - CendiaEthics™ pillar provides built-in bias detection and governance flags. |

---

## SECTION 11: CONTRACTUAL

| Question | Response |
|----------|----------|
| Do you provide a Data Processing Agreement (DPA)? | Yes - GDPR-compliant DPA included in all contracts. |
| Do you sign Business Associate Agreements (BAA)? | Yes - BAA available for healthcare customers. |
| Do you accept customer security addenda? | Yes - Standard enterprise security addenda accepted. Custom terms negotiable. |
| What is your liability cap for security incidents? | Per contract negotiation. Cyber insurance backstop available. |
| Can customers conduct their own security assessment? | Yes - Customer security assessments and audits permitted with reasonable notice. |

---

## ATTACHMENTS AVAILABLE UPON REQUEST

1. SOC 2 Readiness Assessment Summary (under NDA)
2. Penetration Test Executive Summary (under NDA)
3. Architecture Security Whitepaper
4. Data Processing Agreement (DPA)
5. Business Associate Agreement (BAA)
6. Subprocessor List
7. Incident Response Plan Summary
8. Business Continuity Plan Summary

---

## CONTACT

For security inquiries:
- **Email:** security@datacendia.com
- **Response SLA:** 2 business days

For procurement/contracts:
- **Email:** legal@datacendia.com

---

*This document represents Datacendia's security posture as of the date listed. Security practices are continuously improved.*
