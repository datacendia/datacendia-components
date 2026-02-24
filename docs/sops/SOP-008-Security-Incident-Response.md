# SOP-008: Security Incident Response

**Category:** Security
**Priority:** Critical
**Owner:** CISO / Security Lead
**Last Verified:** 2026-02-22 (against `COMPLIANCE_DOCUMENTATION.md`, `backend/src/services/admin/SystemHealthService.ts`)

---

## 1. Purpose

Define the incident response lifecycle for security events affecting the Datacendia platform, including detection, containment, eradication, recovery, and post-incident review.

---

## 2. Incident Severity Classification

| Level | Name | Description | Response Time | Escalation |
|-------|------|-------------|---------------|------------|
| P1 | **Critical** | Data breach, system compromise, active exploit | 15 minutes | CEO + Legal + All Engineering |
| P2 | **High** | Unauthorized access attempt, credential leak | 1 hour | Security Lead + Engineering Lead |
| P3 | **Medium** | Suspicious activity, failed brute-force | 4 hours | Security Lead |
| P4 | **Low** | Policy violation, misconfiguration detected | 24 hours | Engineering on-call |

---

## 3. Detection Sources

| Source | Monitoring | Alert Mechanism |
|--------|-----------|-----------------|
| CendiaDefenseStack™ | Threat dashboard, vulnerability scanning | Real-time alerts |
| CendiaSentry™ (46.8K service) | Runtime guardrails, anomaly detection | SIEM/SOC dispatch |
| Audit Logs | All API requests, auth events | CendiaLedger™ immutable records |
| SystemHealthService | Backend health checks | `/api/v1/health` endpoint |
| Prometheus/Grafana | Infrastructure metrics | Alert rules |
| AI Tech Team | Error pattern detection | Auto-heal panel notifications |

---

## 4. Incident Response Phases

### Phase 1: Detection & Triage (0–15 min)
1. Identify the alert source and initial severity
2. Assign incident commander (IC)
3. Create incident channel (Slack/Teams)
4. Log incident in CendiaLedger™ with timestamp
5. Classify: Is this a **data breach**, **unauthorized access**, **system failure**, or **policy violation**?

### Phase 2: Containment (15 min–1 hr)
1. **Isolate affected systems** — disable compromised accounts, revoke tokens
2. **Preserve evidence** — snapshot logs, database state, network captures
3. **Block attack vector** — update firewall rules, rate limits, WAF rules
4. **Communicate** — notify stakeholders per severity level

**Immediate containment actions:**
```bash
# Revoke all JWT tokens (rotate secret)
# Update JWT_SECRET in .env and restart
docker compose restart backend

# Block IP address (if applicable)
iptables -A INPUT -s <attacker_ip> -j DROP

# Disable compromised user account
curl -X PUT http://localhost:3001/api/v1/admin/users/<user_id>/disable \
  -H "Authorization: Bearer <admin_token>"
```

### Phase 3: Eradication (1–4 hrs)
1. Identify root cause (vulnerability, misconfiguration, insider)
2. Patch the vulnerability
3. Remove any malware, backdoors, or unauthorized changes
4. Verify fix through testing
5. Update security controls to prevent recurrence

### Phase 4: Recovery (4–24 hrs)
1. Restore systems from verified clean backups (see SOP-035)
2. Re-enable affected services incrementally
3. Monitor for recurrence
4. Verify all data integrity using CendiaLedger™ Merkle proofs
5. Rotate all potentially compromised secrets (see SOP-007)

### Phase 5: Post-Incident Review (24–72 hrs)
1. Conduct blameless post-mortem
2. Document timeline, impact, and resolution
3. Update threat model and security controls
4. Create action items for prevention
5. File compliance notifications if required (GDPR: 72 hrs, HIPAA: 60 days)

---

## 5. Communication Templates

### 5.1 Internal Notification (P1/P2)
```
SECURITY INCIDENT — [SEVERITY LEVEL]
Time Detected: [timestamp]
Incident Commander: [name]
Affected Systems: [list]
Current Status: [Detected/Contained/Eradicated/Recovered]
Next Update: [time]
```

### 5.2 Client Notification (if data affected)
```
Subject: Security Notice — Datacendia Platform

We are writing to inform you of a security incident that may have 
affected your data. [Description]. We have [containment actions taken]. 
[What you need to do]. For questions, contact security@datacendia.com.
```

### 5.3 Regulatory Notification (GDPR Article 33)
Must be filed within **72 hours** of discovery to the supervisory authority if personal data is affected.

---

## 6. Evidence Preservation

| Evidence Type | Collection Method | Storage |
|---------------|-------------------|---------|
| Application logs | Export from backend logger | Encrypted archive |
| Database snapshots | `pg_dump` of affected tables | Encrypted backup |
| Audit trail | CendiaLedger™ export | Immutable, Merkle-verified |
| Network logs | Firewall/WAF export | SIEM archive |
| Memory dumps | If malware suspected | Forensic workstation |

---

## 7. Compliance Reporting Requirements

| Framework | Notification Deadline | Authority |
|-----------|----------------------|-----------|
| GDPR | 72 hours | Supervisory authority + affected individuals |
| HIPAA | 60 days | HHS + affected individuals |
| SOC 2 | Next audit cycle | Auditor |
| PCI-DSS | Immediately | Card brands + acquiring bank |
| EU AI Act | Per incident type | National AI authority |

---

## 8. Verified Against

- `COMPLIANCE_DOCUMENTATION.md`: SOC 2 CC7 (System Operations), CC9 (Risk Mitigation)
- `backend/src/services/admin/SystemHealthService.ts`: Health monitoring
- `docs/BACKUP_RECOVERY.md`: Evidence preservation, backup procedures
- Platform audit trail: CendiaLedger™ immutable logging
- CendiaSentry™ runtime guardrails and SIEM dispatch

---

*Datacendia, LLC — Proprietary and Confidential*
