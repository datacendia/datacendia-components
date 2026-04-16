# Vendor Management Policy

**Datacendia, LLC**
**Version:** 1.0
**Effective Date:** April 15, 2026
**Owner:** CISO
**Classification:** Internal

---

## 1. Purpose

This policy establishes requirements for assessing, selecting, and monitoring third-party vendors to ensure they meet Datacendia's security, privacy, and compliance standards.

## 2. Vendor Risk Tiers

| Tier | Criteria | Assessment Frequency | Requirements |
|------|----------|---------------------|--------------|
| **Critical** | Processes Restricted data; system access | Annual + continuous monitoring | SOC 2 report; BAA/DPA; SLA; right to audit |
| **High** | Processes Confidential data; limited access | Annual | Security questionnaire; DPA; SLA |
| **Medium** | Internal tools; no sensitive data | Biennial | Security questionnaire |
| **Low** | Commodity services; public data only | At onboarding | Standard T&Cs review |

## 3. Sovereign Architecture Advantage

Datacendia's sovereign-first architecture minimizes vendor dependencies:
- **AI Inference:** Local via Ollama — no cloud AI vendor dependency
- **Database:** Customer-owned PostgreSQL — no DBaaS dependency
- **Hosting:** Customer-managed — no cloud hosting lock-in
- **Vector Search:** Customer-owned Qdrant — no SaaS dependency

This architecture reduces vendor risk exposure by design.

## 4. Assessment Requirements

### 4.1 Pre-Engagement
- Complete vendor risk assessment questionnaire
- Review SOC 2 Type II report (for Critical/High tier)
- Verify insurance coverage (cyber liability, E&O)
- Legal review of contract terms

### 4.2 Contractual Requirements
- **Data Processing Agreement (DPA):** Required for all vendors processing personal data
- **Business Associate Agreement (BAA):** Required for vendors with PHI access
- **Standard Contractual Clauses (SCCs):** Required for international data transfers
- **Right to Audit:** Included in Critical tier vendor contracts
- **Breach Notification:** Maximum 48 hours for Critical/High; 72 hours for others
- **Data Return/Deletion:** Procedures upon contract termination

### 4.3 Ongoing Monitoring
- Annual reassessment for Critical/High tier vendors
- SOC 2 report review upon renewal
- Incident notification tracking
- Compliance drift monitoring

## 5. Subprocessor Management

Per GDPR Article 28:
- Maintain list of all subprocessors
- Notify customers before adding/changing subprocessors
- Ensure subprocessor contracts include equivalent data protection obligations
- Subprocessor list available at customer request

## 6. Vendor Inventory

Maintain a current inventory of all vendors including:
- Vendor name and contact information
- Services provided
- Data categories processed
- Risk tier
- Contract expiration date
- Last assessment date
- Compliance certifications held

## 7. Termination Procedures

Upon vendor relationship termination:
1. Revoke all access credentials immediately
2. Confirm data return or certified deletion
3. Obtain written confirmation of data destruction
4. Update vendor inventory
5. Archive vendor records per retention policy

---

**Approved by:** Stuart Rainey, CEO/Owner
**Date:** April 15, 2026
