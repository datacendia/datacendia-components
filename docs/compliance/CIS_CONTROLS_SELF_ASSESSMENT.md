# CIS Controls v8 Self-Assessment

**Organization**: Datacendia, Inc.  
**Assessment Date**: January 2026  
**Framework**: CIS Critical Security Controls Version 8

---

## Executive Summary

This self-assessment evaluates Datacendia's implementation of CIS Controls v8. The CIS Controls provide a prioritized set of actions to protect organizations from cyber attacks.

**Implementation Group**: IG2 (Mid-sized enterprise)

**Overall Score**: **82%** of applicable controls implemented

| Control Group | Status | Implementation |
|---------------|--------|----------------|
| Basic Controls (1-6) | ✅ 90% | Strong foundation |
| Foundational Controls (7-16) | ✅ 85% | Well implemented |
| Organizational Controls (17-18) | ✅ 70% | In progress |

---

## Control Assessment

### Control 1: Inventory and Control of Enterprise Assets

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 1.1 Establish Asset Inventory | IG1 | ✅ | Cloud asset inventory via AWS/Azure APIs |
| 1.2 Address Unauthorized Assets | IG1 | ✅ | Automated detection, alerting |
| 1.3 Utilize DHCP Logging | IG2 | ✅ | VPC flow logs capture all traffic |
| 1.4 Use Dynamic Host Configuration Protocol | IG2 | ✅ | DHCP managed by cloud provider |
| 1.5 Use Passive Asset Discovery | IG3 | ⚠️ | Partial - network scanning in place |

**Score: 90%**

### Control 2: Inventory and Control of Software Assets

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 2.1 Establish Software Inventory | IG1 | ✅ | Package.json, container manifests |
| 2.2 Ensure Authorized Software | IG1 | ✅ | Approved software list |
| 2.3 Address Unauthorized Software | IG1 | ✅ | Container image allowlisting |
| 2.4 Utilize Automated Software Inventory | IG2 | ✅ | Dependabot, Snyk scanning |
| 2.5 Allowlist Authorized Software | IG2 | ✅ | Container registry policies |
| 2.6 Allowlist Authorized Libraries | IG2 | ✅ | Dependency scanning |
| 2.7 Allowlist Authorized Scripts | IG3 | ⚠️ | Partial implementation |

**Score: 85%**

### Control 3: Data Protection

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 3.1 Establish Data Management Process | IG1 | ✅ | Data classification policy |
| 3.2 Establish Data Inventory | IG1 | ✅ | Data flow documentation |
| 3.3 Configure Data Access Control Lists | IG1 | ✅ | RBAC, database permissions |
| 3.4 Enforce Data Retention | IG1 | ✅ | Configurable retention policies |
| 3.5 Securely Dispose of Data | IG1 | ✅ | Secure deletion procedures |
| 3.6 Encrypt Data on End-User Devices | IG1 | ✅ | Full disk encryption required |
| 3.7 Establish Data Classification Scheme | IG2 | ✅ | 4-tier classification |
| 3.8 Document Data Flows | IG2 | ✅ | Data flow diagrams |
| 3.9 Encrypt Data on Removable Media | IG2 | ✅ | Policy enforced |
| 3.10 Encrypt Sensitive Data in Transit | IG2 | ✅ | TLS 1.3 everywhere |
| 3.11 Encrypt Sensitive Data at Rest | IG2 | ✅ | AES-256 encryption |
| 3.12 Segment Data Processing | IG2 | ✅ | Customer data isolation |
| 3.13 Deploy DLP Solution | IG3 | ⚠️ | Basic PII detection |
| 3.14 Log Sensitive Data Access | IG3 | ✅ | Comprehensive audit logging |

**Score: 90%**

### Control 4: Secure Configuration of Enterprise Assets and Software

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 4.1 Establish Secure Configuration Process | IG1 | ✅ | Infrastructure as Code |
| 4.2 Establish Secure Configuration for Network Infrastructure | IG1 | ✅ | Terraform, security groups |
| 4.3 Configure Automatic Session Locking | IG1 | ✅ | 15-minute timeout |
| 4.4 Implement and Manage Firewall | IG1 | ✅ | WAF, security groups |
| 4.5 Implement and Manage Anti-Malware | IG1 | ✅ | Container scanning |
| 4.6 Securely Manage Enterprise Assets and Software | IG1 | ✅ | Patch management |
| 4.7 Manage Default Accounts | IG1 | ✅ | Default accounts disabled |
| 4.8 Uninstall or Disable Unnecessary Services | IG2 | ✅ | Minimal container images |
| 4.9 Configure Trusted DNS Servers | IG2 | ✅ | Cloud DNS |
| 4.10 Enforce Automatic Device Lockout | IG2 | ✅ | Account lockout policy |
| 4.11 Enforce Remote Wipe Capability | IG2 | ⚠️ | MDM for company devices |
| 4.12 Separate Enterprise Workspaces | IG3 | ✅ | Container isolation |

**Score: 90%**

### Control 5: Account Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 5.1 Establish Account Inventory | IG1 | ✅ | User database, audit logs |
| 5.2 Use Unique Passwords | IG1 | ✅ | Password policy enforced |
| 5.3 Disable Dormant Accounts | IG1 | ✅ | 90-day inactivity disable |
| 5.4 Restrict Administrator Privileges | IG1 | ✅ | Least privilege |
| 5.5 Establish Account Management Process | IG2 | ✅ | Onboarding/offboarding |
| 5.6 Centralize Account Management | IG2 | ✅ | SSO integration |

**Score: 100%**

### Control 6: Access Control Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 6.1 Establish Access Granting Process | IG1 | ✅ | Ticketed access requests |
| 6.2 Establish Access Revoking Process | IG1 | ✅ | Immediate revocation |
| 6.3 Require MFA for Externally-Exposed Applications | IG1 | ✅ | MFA required |
| 6.4 Require MFA for Remote Network Access | IG1 | ✅ | VPN + MFA |
| 6.5 Require MFA for Administrative Access | IG1 | ✅ | MFA required |
| 6.6 Establish Access Review Process | IG2 | ✅ | Quarterly reviews |
| 6.7 Centralize Access Control | IG2 | ✅ | RBAC system |
| 6.8 Define and Maintain Role-Based Access Control | IG3 | ✅ | 7 defined roles |

**Score: 100%**

### Control 7: Continuous Vulnerability Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 7.1 Establish Vulnerability Management Process | IG1 | ✅ | Documented process |
| 7.2 Establish Remediation Process | IG1 | ✅ | SLA-based remediation |
| 7.3 Perform Automated OS Vulnerability Scans | IG2 | ✅ | Weekly scans |
| 7.4 Perform Automated Application Vulnerability Scans | IG2 | ✅ | CI/CD integration |
| 7.5 Perform Automated Vulnerability Scans of Internal Assets | IG2 | ✅ | Container scanning |
| 7.6 Perform Automated Vulnerability Scans of Externally-Exposed Assets | IG2 | ✅ | External scanning |
| 7.7 Remediate Detected Vulnerabilities | IG2 | ✅ | Tracked remediation |

**Score: 100%**

### Control 8: Audit Log Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 8.1 Establish Audit Log Management Process | IG1 | ✅ | Centralized logging |
| 8.2 Collect Audit Logs | IG1 | ✅ | Comprehensive collection |
| 8.3 Ensure Adequate Audit Log Storage | IG1 | ✅ | 7-year retention |
| 8.4 Standardize Time Synchronization | IG2 | ✅ | NTP synchronization |
| 8.5 Collect Detailed Audit Logs | IG2 | ✅ | Full event details |
| 8.6 Collect DNS Query Audit Logs | IG2 | ✅ | DNS logging enabled |
| 8.7 Collect URL Request Audit Logs | IG2 | ✅ | Request logging |
| 8.8 Collect Command-Line Audit Logs | IG2 | ✅ | Shell command logging |
| 8.9 Centralize Audit Logs | IG2 | ✅ | SIEM integration |
| 8.10 Retain Audit Logs | IG2 | ✅ | 7-year retention |
| 8.11 Conduct Audit Log Reviews | IG2 | ✅ | Automated + manual review |
| 8.12 Collect Service Provider Logs | IG3 | ✅ | Cloud provider logs |

**Score: 100%**

### Control 9: Email and Web Browser Protections

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 9.1 Ensure Use of Only Fully Supported Browsers and Email Clients | IG1 | ✅ | Policy enforced |
| 9.2 Use DNS Filtering Services | IG1 | ✅ | DNS filtering |
| 9.3 Maintain and Enforce Network-Based URL Filters | IG2 | ✅ | URL filtering |
| 9.4 Restrict Unnecessary or Unauthorized Browser and Email Client Extensions | IG2 | ✅ | Extension policy |
| 9.5 Implement DMARC | IG2 | ✅ | DMARC configured |
| 9.6 Block Unnecessary File Types | IG2 | ✅ | Attachment filtering |
| 9.7 Deploy and Maintain Email Server Anti-Malware Protections | IG3 | ✅ | Email scanning |

**Score: 100%**

### Control 10: Malware Defenses

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 10.1 Deploy and Maintain Anti-Malware Software | IG1 | ✅ | Endpoint protection |
| 10.2 Configure Automatic Anti-Malware Signature Updates | IG1 | ✅ | Auto-updates |
| 10.3 Disable Autorun and Autoplay | IG1 | ✅ | Policy enforced |
| 10.4 Configure Automatic Anti-Malware Scanning | IG2 | ✅ | Real-time scanning |
| 10.5 Enable Anti-Exploitation Features | IG2 | ✅ | DEP, ASLR |
| 10.6 Centrally Manage Anti-Malware Software | IG2 | ✅ | Central management |
| 10.7 Use Behavior-Based Anti-Malware Software | IG2 | ✅ | EDR solution |

**Score: 100%**

### Control 11: Data Recovery

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 11.1 Establish Data Recovery Process | IG1 | ✅ | Documented procedures |
| 11.2 Perform Automated Backups | IG1 | ✅ | Daily automated backups |
| 11.3 Protect Recovery Data | IG1 | ✅ | Encrypted backups |
| 11.4 Establish Isolated Recovery Environment | IG2 | ✅ | Separate recovery infra |
| 11.5 Test Data Recovery | IG2 | ✅ | Quarterly testing |

**Score: 100%**

### Control 12: Network Infrastructure Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 12.1 Ensure Network Infrastructure is Up-to-Date | IG1 | ✅ | Managed by cloud provider |
| 12.2 Establish Secure Network Architecture | IG2 | ✅ | VPC, segmentation |
| 12.3 Securely Manage Network Infrastructure | IG2 | ✅ | IaC, change control |
| 12.4 Establish Private Wireless Network | IG2 | N/A | Cloud-based |
| 12.5 Centralize Network Authentication | IG2 | ✅ | SSO, LDAP |
| 12.6 Use Secure Network Management | IG2 | ✅ | Encrypted management |
| 12.7 Ensure Remote Devices Use VPN | IG2 | ✅ | VPN required |
| 12.8 Establish Computing Resource Segmentation | IG3 | ✅ | Network segmentation |

**Score: 95%**

### Control 13: Network Monitoring and Defense

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 13.1 Centralize Security Event Alerting | IG2 | ✅ | SIEM alerting |
| 13.2 Deploy Host-Based IDS | IG2 | ✅ | Host-based detection |
| 13.3 Deploy Network-Based IDS | IG2 | ✅ | VPC flow analysis |
| 13.4 Perform Traffic Filtering | IG2 | ✅ | WAF, security groups |
| 13.5 Manage Access Control for Remote Assets | IG2 | ✅ | VPN, MFA |
| 13.6 Collect Network Traffic Flow Logs | IG2 | ✅ | VPC flow logs |
| 13.7 Deploy Host-Based IPS | IG3 | ⚠️ | Partial |
| 13.8 Deploy Network-Based IPS | IG3 | ⚠️ | WAF rules |
| 13.9 Deploy Port-Level Access Control | IG3 | ✅ | Security groups |
| 13.10 Perform Application Layer Filtering | IG3 | ✅ | WAF |
| 13.11 Tune Security Event Alerting Thresholds | IG3 | ✅ | Tuned alerts |

**Score: 85%**

### Control 14: Security Awareness and Skills Training

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 14.1 Establish Security Awareness Program | IG1 | ✅ | Annual training |
| 14.2 Train Workforce on Authentication | IG1 | ✅ | MFA training |
| 14.3 Train Workforce on Data Handling | IG1 | ✅ | Data handling training |
| 14.4 Train Workforce on Causes of Unintentional Data Exposure | IG1 | ✅ | Phishing awareness |
| 14.5 Train Workforce on Social Engineering | IG1 | ✅ | Social engineering training |
| 14.6 Train Workforce on Recognizing Attacks | IG2 | ✅ | Attack recognition |
| 14.7 Train Workforce on Reporting Incidents | IG2 | ✅ | Incident reporting |
| 14.8 Train Workforce on Data Handling Best Practices | IG2 | ✅ | Best practices |
| 14.9 Conduct Role-Specific Security Training | IG3 | ✅ | Developer security training |

**Score: 100%**

### Control 15: Service Provider Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 15.1 Establish Service Provider Management Process | IG1 | ✅ | Vendor management |
| 15.2 Establish Service Provider Security Assessment Process | IG2 | ✅ | Vendor assessments |
| 15.3 Classify Service Providers | IG2 | ✅ | Risk-based classification |
| 15.4 Ensure Service Provider Contracts Include Security Requirements | IG2 | ✅ | Security clauses |
| 15.5 Assess Service Providers | IG2 | ✅ | Annual assessments |
| 15.6 Monitor Service Providers | IG3 | ✅ | Ongoing monitoring |
| 15.7 Securely Decommission Service Providers | IG3 | ✅ | Offboarding process |

**Score: 100%**

### Control 16: Application Software Security

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 16.1 Establish Secure Application Development Process | IG2 | ✅ | SDLC documentation |
| 16.2 Establish Process for Accepting Third-Party Software | IG2 | ✅ | Dependency review |
| 16.3 Perform Root Cause Analysis on Security Vulnerabilities | IG2 | ✅ | Post-incident analysis |
| 16.4 Establish Secure Coding Practices | IG2 | ✅ | Coding standards |
| 16.5 Use Up-to-Date and Trusted Third-Party Software | IG2 | ✅ | Dependency updates |
| 16.6 Establish Dedicated Development Environment | IG2 | ✅ | Separate environments |
| 16.7 Use Standard Hardening Configuration Templates | IG2 | ✅ | Container hardening |
| 16.8 Separate Production and Non-Production Systems | IG2 | ✅ | Environment isolation |
| 16.9 Train Developers in Application Security | IG2 | ✅ | Security training |
| 16.10 Apply Secure Design Principles | IG2 | ✅ | Security architecture |
| 16.11 Leverage Vetted Modules or Services | IG3 | ✅ | Approved libraries |
| 16.12 Implement Code-Level Security Checks | IG3 | ✅ | SAST, linting |
| 16.13 Conduct Application Penetration Testing | IG3 | ⚠️ | Planned Q1 2026 |
| 16.14 Conduct Threat Modeling | IG3 | ✅ | Threat models |

**Score: 90%**

### Control 17: Incident Response Management

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 17.1 Designate Personnel to Manage Incident Handling | IG1 | ✅ | IR team designated |
| 17.2 Establish Process for Reporting Incidents | IG1 | ✅ | Reporting process |
| 17.3 Establish Incident Response Process | IG2 | ✅ | IR plan documented |
| 17.4 Establish Incident Response Roles | IG2 | ✅ | Roles defined |
| 17.5 Assign Key Roles for Incident Response | IG2 | ✅ | Personnel assigned |
| 17.6 Define Mechanisms for Communicating During Incident | IG2 | ✅ | Communication plan |
| 17.7 Conduct Routine Incident Response Exercises | IG2 | ⚠️ | Annual tabletop |
| 17.8 Conduct Post-Incident Reviews | IG2 | ✅ | Post-mortems |
| 17.9 Establish Security Incident Thresholds | IG3 | ✅ | Severity definitions |

**Score: 90%**

### Control 18: Penetration Testing

| Safeguard | IG | Status | Implementation |
|-----------|-----|--------|----------------|
| 18.1 Establish Penetration Testing Program | IG2 | ⚠️ | Planned Q1 2026 |
| 18.2 Perform Periodic External Penetration Tests | IG2 | ⚠️ | Planned Q1 2026 |
| 18.3 Remediate Penetration Test Findings | IG2 | ✅ | Process defined |
| 18.4 Validate Security Measures | IG3 | ⚠️ | Planned |
| 18.5 Perform Periodic Internal Penetration Tests | IG3 | ⚠️ | Planned |

**Score: 40%**

---

## Summary by Implementation Group

### IG1 (Basic Cyber Hygiene) — 56 Safeguards

**Status**: ✅ **98% Implemented**

All IG1 safeguards are implemented or in progress.

### IG2 (Mid-sized Enterprise) — 74 Additional Safeguards

**Status**: ✅ **85% Implemented**

Key gaps:
- Penetration testing program (planned Q1 2026)
- Some IPS capabilities

### IG3 (Large Enterprise) — 23 Additional Safeguards

**Status**: ⚠️ **70% Implemented**

Partial implementation appropriate for current scale.

---

## Gap Remediation Plan

| Gap | Priority | Target | Owner |
|-----|----------|--------|-------|
| External penetration test | High | Q1 2026 | Security |
| Internal penetration test | Medium | Q2 2026 | Security |
| Enhanced IPS | Low | Q3 2026 | Infrastructure |
| Tabletop exercises (quarterly) | Medium | Q1 2026 | Security |

---

## Attestation

This self-assessment was prepared in good faith based on current controls and practices.

**Prepared By**: Security Team  
**Date**: January 2026

---

*This is a self-assessment based on CIS Controls v8. It is not a formal audit or certification.*

*© 2026 Datacendia, Inc.*
