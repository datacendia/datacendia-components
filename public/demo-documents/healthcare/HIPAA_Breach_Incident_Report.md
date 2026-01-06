# HIPAA BREACH INCIDENT REPORT

## Protected Health Information Security Incident

**Report ID**: SEC-2025-0892
**Classification**: CONFIDENTIAL - HIPAA SENSITIVE
**Date of Discovery**: January 2, 2026
**Date of Report**: January 3, 2026
**Reporting Entity**: Midwest Regional Health System

---

## 1. INCIDENT SUMMARY

| Field | Details |
|-------|---------|
| **Incident Type** | Unauthorized Access to PHI |
| **Discovery Date** | January 2, 2026, 14:32 EST |
| **Incident Date** | December 28, 2025 - January 2, 2026 |
| **Affected Systems** | Electronic Health Record (Epic), Patient Portal |
| **Records Potentially Affected** | 47,832 patients |
| **Data Elements Exposed** | Names, DOB, SSN, Medical Records, Insurance |
| **Breach Determination** | Confirmed HIPAA Breach |

---

## 2. INCIDENT DESCRIPTION

### 2.1 Timeline of Events

| Date/Time | Event |
|-----------|-------|
| Dec 28, 2025 08:15 | Phishing email received by radiology department |
| Dec 28, 2025 08:47 | Employee clicked malicious link, credentials compromised |
| Dec 28, 2025 09:12 | Attacker accessed VPN using stolen credentials |
| Dec 28, 2025 - Jan 2, 2026 | Attacker accessed EHR system intermittently |
| Jan 2, 2026 14:32 | SOC detected anomalous access patterns |
| Jan 2, 2026 14:45 | Compromised account disabled |
| Jan 2, 2026 15:00 | Incident response team activated |
| Jan 2, 2026 18:00 | Forensic investigation initiated |
| Jan 3, 2026 09:00 | Breach confirmed, notification process initiated |

### 2.2 Attack Vector

The incident originated from a sophisticated phishing campaign targeting healthcare workers. The email appeared to be from the hospital's IT department requesting password verification for a "security upgrade."

**Indicators of Compromise:**
- Sender domain: `it-support-mrhs[.]com` (typosquat)
- Malicious URL: `hxxps://mrhs-portal[.]net/verify`
- Attacker IP: 185.220.101.xxx (Tor exit node)

### 2.3 Compromised Account

| Attribute | Value |
|-----------|-------|
| Username | jsmith_rad |
| Department | Radiology |
| Access Level | Clinical Staff |
| EHR Access | Full patient records (department) |
| Last Password Change | 45 days prior |
| MFA Status | **NOT ENABLED** |

---

## 3. AFFECTED POPULATION

### 3.1 Patient Demographics

| Category | Count | Percentage |
|----------|-------|------------|
| Total Patients Affected | 47,832 | 100% |
| Adults (18+) | 38,266 | 80% |
| Minors (<18) | 9,566 | 20% |
| Medicare Beneficiaries | 14,350 | 30% |
| Medicaid Beneficiaries | 7,175 | 15% |

### 3.2 Data Elements Potentially Accessed

| Data Element | Affected | Risk Level |
|--------------|----------|------------|
| Full Name | 47,832 | Medium |
| Date of Birth | 47,832 | Medium |
| Social Security Number | 31,247 | **Critical** |
| Medical Record Number | 47,832 | Low |
| Diagnosis Codes (ICD-10) | 47,832 | High |
| Procedure Codes (CPT) | 42,156 | Medium |
| Lab Results | 38,445 | High |
| Radiology Images | 12,847 | Medium |
| Prescription History | 41,233 | High |
| Insurance Information | 45,612 | High |
| Payment Card Data | 0 | N/A |

### 3.3 High-Risk Subpopulations

| Population | Count | Special Considerations |
|------------|-------|----------------------|
| HIV/AIDS Patients | 847 | 42 CFR Part 2 implications |
| Mental Health Patients | 3,245 | State mental health laws |
| Substance Abuse Treatment | 1,123 | 42 CFR Part 2 implications |
| Minors | 9,566 | Parental notification required |
| VIP/Celebrity Patients | 12 | Enhanced privacy protocols |

---

## 4. RISK ASSESSMENT

### 4.1 Probability of Harm

| Factor | Assessment | Score |
|--------|------------|-------|
| Data Sensitivity | PHI including SSN, diagnoses | High (4/5) |
| Data Volume | 47,832 records | High (4/5) |
| Attacker Sophistication | Advanced persistent threat | High (4/5) |
| Evidence of Exfiltration | Inconclusive | Medium (3/5) |
| Mitigation Effectiveness | Partial | Medium (3/5) |
| **Overall Risk Score** | | **High (3.6/5)** |

### 4.2 Potential Harms

1. **Identity Theft**: SSN exposure creates significant risk
2. **Medical Identity Theft**: Insurance fraud, false claims
3. **Discrimination**: Sensitive diagnoses could lead to discrimination
4. **Reputational Harm**: Stigmatizing conditions exposed
5. **Financial Harm**: Fraudulent accounts, credit damage

---

## 5. NOTIFICATION REQUIREMENTS

### 5.1 Regulatory Notifications

| Entity | Deadline | Status |
|--------|----------|--------|
| HHS Office for Civil Rights | 60 days (Mar 3, 2026) | **Pending** |
| State Attorney General (IL) | 45 days (Feb 17, 2026) | **Pending** |
| State Attorney General (IN) | 45 days (Feb 17, 2026) | **Pending** |
| CMS (Medicare) | 60 days | **Pending** |
| FBI Cyber Division | Immediate | **Completed** |

### 5.2 Individual Notifications

| Method | Timeline | Status |
|--------|----------|--------|
| First Class Mail | Within 60 days | Drafting |
| Substitute Notice (Website) | Immediate | **Posted** |
| Media Notice (>500 in state) | Within 60 days | Drafting |
| Email (where authorized) | Within 60 days | Drafting |

### 5.3 Notification Content Requirements

Per 45 CFR § 164.404(c), notifications must include:
- [ ] Description of incident
- [ ] Types of PHI involved
- [ ] Steps individuals should take
- [ ] Steps entity is taking
- [ ] Contact information for questions

---

## 6. REMEDIATION ACTIONS

### 6.1 Immediate Actions (Completed)

| Action | Status | Date |
|--------|--------|------|
| Disabled compromised account | ✅ Complete | Jan 2 |
| Reset all radiology department passwords | ✅ Complete | Jan 2 |
| Blocked attacker IP ranges | ✅ Complete | Jan 2 |
| Engaged forensic investigators | ✅ Complete | Jan 2 |
| Activated incident response team | ✅ Complete | Jan 2 |
| Preserved system logs | ✅ Complete | Jan 2 |

### 6.2 Short-Term Actions (In Progress)

| Action | Owner | Deadline | Status |
|--------|-------|----------|--------|
| Complete forensic analysis | CISO | Jan 10 | 🟡 In Progress |
| Mandatory MFA enrollment | IT | Jan 15 | 🟡 In Progress |
| Phishing awareness training | HR | Jan 20 | 🔵 Scheduled |
| Patient notification mailing | Compliance | Feb 15 | 🔵 Scheduled |
| Credit monitoring enrollment | Vendor | Feb 1 | 🔵 Scheduled |

### 6.3 Long-Term Actions (Planned)

| Action | Owner | Timeline |
|--------|-------|----------|
| Zero-trust architecture implementation | IT | Q2 2026 |
| Enhanced DLP controls | Security | Q1 2026 |
| Privileged access management | IT | Q1 2026 |
| Security awareness program overhaul | HR | Q1 2026 |
| Third-party security assessment | CISO | Q2 2026 |

---

## 7. FINANCIAL IMPACT

### 7.1 Direct Costs

| Category | Estimated Cost |
|----------|----------------|
| Forensic Investigation | $250,000 |
| Legal Counsel | $500,000 |
| Notification Costs (mailing) | $150,000 |
| Credit Monitoring (2 years) | $1,200,000 |
| Call Center Support | $300,000 |
| Regulatory Fines (estimated) | $1,500,000 |
| **Total Direct Costs** | **$3,900,000** |

### 7.2 Indirect Costs

| Category | Estimated Impact |
|----------|------------------|
| Reputational Damage | $2,000,000 |
| Patient Attrition | $1,500,000 |
| Staff Overtime | $200,000 |
| Insurance Premium Increase | $400,000/year |
| **Total Indirect Costs** | **$4,100,000** |

### 7.3 Insurance Coverage

| Coverage | Limit | Deductible |
|----------|-------|------------|
| Cyber Liability | $5,000,000 | $100,000 |
| E&O | $10,000,000 | $250,000 |
| D&O | $5,000,000 | $150,000 |

---

## 8. LESSONS LEARNED

### 8.1 Control Failures

| Control | Expected State | Actual State | Gap |
|---------|----------------|--------------|-----|
| MFA for VPN | Required | Optional | **Critical** |
| Phishing Protection | Advanced | Basic | High |
| User Behavior Analytics | Enabled | Disabled | High |
| Privileged Access Mgmt | Implemented | Partial | Medium |
| Security Training | Quarterly | Annual | Medium |

### 8.2 Recommendations

1. **Immediate**: Mandate MFA for all remote access
2. **30 Days**: Deploy advanced email security (DMARC, sandboxing)
3. **60 Days**: Implement user behavior analytics
4. **90 Days**: Complete privileged access management rollout
5. **Ongoing**: Monthly phishing simulations and training

---

## 9. APPROVALS

| Role | Name | Signature | Date |
|------|------|-----------|------|
| Privacy Officer | Maria Rodriguez | _____________ | _______ |
| CISO | James Chen | _____________ | _______ |
| General Counsel | Patricia Williams | _____________ | _______ |
| CEO | Robert Thompson | _____________ | _______ |

---

## ATTACHMENTS

- Attachment A: Forensic Investigation Report (Preliminary)
- Attachment B: Affected Patient List (Encrypted)
- Attachment C: Sample Notification Letter
- Attachment D: Credit Monitoring Vendor Agreement
- Attachment E: Regulatory Filing Drafts

---

*CONFIDENTIAL - HIPAA SENSITIVE - FOR AUTHORIZED PERSONNEL ONLY*
*Unauthorized disclosure may result in civil and criminal penalties*

---

*For CendiaGenomics™ / CendiaOversight™ Demo Purposes*
