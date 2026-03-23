# Datacendia Incident Response Plan (IRP)

**Effective Date:** March 2026  
**Last Updated:** March 2026  
**Version:** 1.0  
**Classification:** Internal — Share with SOC 2 auditors on request

---

## 1. Purpose

This Incident Response Plan defines how Datacendia detects, responds to, contains, and recovers from security incidents. It ensures compliance with:

- SLA breach notification commitments (§6.3: <1 hour response, <24 hour notification)
- GDPR Article 33 (72-hour breach notification to supervisory authority)
- CCPA/CPRA breach notification requirements
- SOC 2 CC7.3/CC7.4 (security event evaluation and response)

---

## 2. Definitions

| Term | Definition |
|------|-----------|
| **Security Event** | Any observable occurrence relevant to security (log entry, alert, anomaly) |
| **Security Incident** | A security event that actually or potentially compromises confidentiality, integrity, or availability of Customer Data or the Services |
| **Data Breach** | A confirmed incident involving unauthorized access to or disclosure of Customer Data |
| **Incident Commander (IC)** | The person responsible for coordinating the response to a specific incident |
| **Affected Parties** | Customers, users, regulators, or partners impacted by the incident |

---

## 3. Severity Classification

| Severity | Definition | Examples | Response Time | Escalation |
|----------|-----------|---------|---------------|------------|
| **SEV-1 (Critical)** | Active data breach or complete service outage | Unauthorized data access, full platform down, ransomware | Immediate (< 15 min) | CEO + all engineering |
| **SEV-2 (High)** | Major feature impaired or confirmed vulnerability under active exploitation | Auth system compromised, database degraded, critical CVE exploited | < 1 hour | Engineering lead |
| **SEV-3 (Medium)** | Partial service degradation or suspicious activity requiring investigation | Single component down, unusual access patterns, failed intrusion attempt | < 4 hours | On-call engineer |
| **SEV-4 (Low)** | Minor issue with no immediate security impact | Informational alert, policy violation by internal user, scanner false positive | < 24 hours | Next business day |

---

## 4. Detection Sources

Datacendia monitors the following sources for security events:

### Automated Detection
| Source | What It Detects | Alert Mechanism |
|--------|----------------|-----------------|
| **SystemHealthService** | Component health degradation, service outages | Status page + internal alerts |
| **Flink CEP Engine** | Compliance drift bursts, security escalation patterns, data exfiltration attempts | Real-time alerts via configured actions |
| **CendiaGateway** | PII leakage, policy violations, abnormal AI usage patterns | Gateway dashboard + Kafka events |
| **NeMo Guardrails** | Jailbreak attempts, harmful intent, topic boundary violations | Guardrails audit log |
| **Rate Limiting** | Brute force, credential stuffing, API abuse | Automatic blocking + log entry |
| **Honeypot Endpoints** | Unauthorized probing, reconnaissance | Immediate alert |
| **Dependency Scanning** | Known CVEs in dependencies | CI/CD pipeline + Dependabot alerts |
| **CodeQL SAST** | Code-level security vulnerabilities | GitHub Security tab |

### Manual Detection
- Customer support reports
- Internal employee reports
- External security researcher reports (see Vulnerability Disclosure Policy)
- Third-party notifications

---

## 5. Response Procedures

### Phase 1: Identification (Target: < 15 minutes for SEV-1)

1. **Triage the alert** — Determine if it is a real incident or false positive
2. **Classify severity** — Assign SEV-1 through SEV-4 based on Section 3
3. **Assign Incident Commander** — IC takes ownership and opens incident channel
4. **Create incident record** — Log in incident tracking system with:
   - Timestamp of detection
   - Detection source
   - Initial severity classification
   - Assigned IC
   - Affected systems/customers (if known)

### Phase 2: Containment (Target: < 1 hour for SEV-1)

**Immediate containment (stop the bleeding):**

| Scenario | Containment Action |
|----------|-------------------|
| Unauthorized access | Revoke compromised credentials, rotate API keys, kill active sessions |
| Data exfiltration | Block egress from affected system, isolate network segment |
| Service compromise | Take affected service offline, fail over to healthy replica |
| Malware/ransomware | Isolate affected hosts, block C2 domains |
| DDoS | Enable cloud provider DDoS protection, activate WAF rules |
| Vulnerable dependency | Deploy hotfix or disable affected feature |

**Preserve evidence:**
- Snapshot affected systems before making changes
- Capture relevant logs (application, access, network)
- Record timeline of events and actions taken
- Do NOT destroy or modify potential evidence

### Phase 3: Eradication (Target: < 24 hours for SEV-1)

1. **Identify root cause** — Determine how the incident occurred
2. **Remove the threat** — Patch vulnerability, remove malware, close attack vector
3. **Verify eradication** — Confirm the threat is fully removed
4. **Harden defenses** — Apply additional controls to prevent recurrence

### Phase 4: Recovery (Target: aligned with SLA RTO)

1. **Restore services** — Bring affected systems back online
2. **Verify integrity** — Confirm data integrity using checksums, audit logs
3. **Monitor closely** — Increase monitoring sensitivity for 72 hours post-recovery
4. **Update status page** — Communicate resolution to affected customers

### Phase 5: Post-Incident (Target: < 5 business days)

1. **Conduct post-mortem** — Document what happened, why, and how it was resolved
2. **Identify lessons learned** — What worked, what didn't, what to improve
3. **Update controls** — Implement preventive measures
4. **Update this IRP** — If the incident revealed gaps in the plan
5. **File post-mortem report** — Share with affected customers upon request (per SLA §7.2)

---

## 6. Notification Requirements

### Internal Notifications

| Severity | Who to Notify | When |
|----------|--------------|------|
| SEV-1 | CEO, all engineering, legal | Immediately |
| SEV-2 | Engineering lead, CEO | Within 1 hour |
| SEV-3 | Engineering lead | Within 4 hours |
| SEV-4 | On-call engineer | Next business day |

### External Notifications — Customers

| Event | Notification Timeline | Channel |
|-------|----------------------|---------|
| Service degradation | Within 1 hour | Status page (app.datacendia.com/status) |
| Confirmed data breach | Within 24 hours | Email to affected account admins |
| Service restored | Upon recovery | Status page + email |
| Post-mortem available | Within 5 business days | Email to affected account admins |

### External Notifications — Regulators

| Regulation | Requirement | Timeline |
|-----------|-------------|----------|
| GDPR Article 33 | Notify supervisory authority of personal data breach | Within 72 hours |
| GDPR Article 34 | Notify affected data subjects if high risk | Without undue delay |
| CCPA §1798.82 | Notify affected California residents | In the most expedient time possible |
| State breach notification laws | Varies by state | Per applicable state law |

### Notification Template

```
Subject: [Datacendia Security Notice] — [Brief Description]

Dear [Customer Name],

We are writing to inform you of a security incident affecting the 
Datacendia platform.

WHAT HAPPENED:
[Brief, factual description of the incident]

WHEN IT HAPPENED:
[Date/time of incident and detection]

WHAT DATA WAS AFFECTED:
[Types of data involved, or confirmation that no Customer Data was affected]

WHAT WE ARE DOING:
[Actions taken to contain, investigate, and prevent recurrence]

WHAT YOU CAN DO:
[Recommended actions for the customer, if any]

We take the security of your data extremely seriously. If you have 
questions, please contact security@datacendia.com.

Sincerely,
Datacendia Security Team
```

---

## 7. Roles and Responsibilities

| Role | Responsibilities |
|------|-----------------|
| **Incident Commander** | Coordinates response, makes decisions, communicates status |
| **Engineering Lead** | Technical investigation, containment, eradication, recovery |
| **CEO** | Executive decisions, external communications, regulatory liaison |
| **Legal** | Regulatory notification compliance, customer communication review |
| **Support** | Customer communication, ticket management |

---

## 8. Evidence Preservation

For all SEV-1 and SEV-2 incidents, preserve:

- Application logs (30-day retention minimum)
- Access logs (IP addresses, timestamps, request details)
- Database audit logs
- Network flow logs (if available)
- System snapshots at time of detection
- All communications related to the incident
- Incident timeline with all actions taken

Evidence must be preserved for a minimum of **12 months** after incident closure, or longer if required by regulation or ongoing investigation.

---

## 9. Testing and Training

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Review and update this IRP | Annually or after any SEV-1 incident | Engineering Lead |
| Tabletop exercise (simulated incident) | Semi-annually | Engineering Team |
| Test notification procedures | Annually | Engineering Lead |
| Review detection rule effectiveness | Quarterly | Engineering Team |

---

## 10. Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | March 2026 | Initial Incident Response Plan |

---

**⚠️ IMPORTANT DISCLAIMER:**  
This document should be reviewed by your legal and security teams. Notification requirements vary by jurisdiction and may change. Consult legal counsel for compliance with specific breach notification laws.
