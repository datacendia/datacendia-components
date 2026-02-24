# SOP-028: SOC 2 Type II Compliance

**Category:** Compliance
**Priority:** Critical
**Owner:** Compliance Lead / CISO
**Last Verified:** 2026-02-22 (against `COMPLIANCE_DOCUMENTATION.md`)

---

## 1. Purpose

Define procedures for maintaining SOC 2 Type II compliance across the Datacendia platform, mapping Trust Services Criteria to platform controls, and preparing for audits.

---

## 2. SOC 2 Readiness Status

**Current Coverage: 95%**

---

## 3. Trust Services Criteria Mapping

### CC1: Control Environment
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Code of conduct | `docs/DATACENDIA_REFUSAL_PRINCIPLES.md` | Documented |
| Org structure | Role hierarchy in RBAC | Admin settings |
| Roles & responsibilities | Permission matrix | `backend/src/middleware/auth.ts` |
| Competency requirements | Agent configuration | `backend/src/config/models.ts` |

### CC2: Communication & Information
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Internal communication | Notification system | `src/components/notifications/` |
| External communication | Contact forms, API docs | `backend/src/routes/contact.ts` |
| Quality information | Data quality scoring (CDO agent) | DCII dashboard |

### CC3: Risk Assessment
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Risk identification | CendiaCollapse™, CendiaPreMortem™ | Collapse analyses |
| Risk analysis | Trust Delta calculation, IISS | DCII scores |
| Risk response | Mitigation suggestions, override process | Deliberation records |

### CC4: Monitoring Activities
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Ongoing monitoring | Prometheus, Grafana | `infrastructure/docker-compose.monitoring.yaml` |
| Separate evaluations | CendiaLedger™ audit logs | Ledger exports |
| Deficiency communication | AI Tech Team, notifications | Auto-heal alerts |

### CC5: Control Activities
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Control selection | Security middleware stack | Backend middleware |
| Technology controls | JWT, encryption, rate limiting | Config validation |
| Policy deployment | CendiaGovern™ | Policy management |

### CC6: Logical & Physical Access Controls
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Authentication | JWT tokens (see SOP-006) | Token issuance logs |
| Authorization | RBAC with Casbin | Role assignment records |
| Audit logging | CendiaLedger™ (see SOP-025) | Comprehensive audit trail |
| Encryption | AES-256 at rest, TLS 1.3 in transit | Config settings |

### CC7: System Operations
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Change management | Git version control (see SOP-011) | Commit history |
| Capacity planning | Docker scaling, monitoring | Infrastructure metrics |
| Backup & recovery | Automated backups (see SOP-035) | Backup logs |

### CC8: Change Management
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Version control | Git branches (see SOP-011) | Repository history |
| Code review | PR process | GitHub PR records |
| Testing before deploy | CI/CD pipeline (see SOP-012) | Test results |
| Rollback procedures | Git revert, Docker rollback | Documented in SOP-011 |

### CC9: Risk Mitigation
| Requirement | Platform Control | Evidence |
|-------------|-----------------|----------|
| Vulnerability management | `npm audit`, dependency scanning | Audit reports |
| Incident response | SOP-008 | Incident records |
| Business continuity | SOP-035 | DR drill results |

---

## 4. Audit Preparation Procedure

### 4.1 Pre-Audit (30 days before)
1. Run full compliance report:
   ```bash
   curl http://localhost:3001/api/v1/compliance/soc2/report \
     -H "Authorization: Bearer <admin_token>"
   ```
2. Review all SOPs are current (quarterly review cycle)
3. Verify all controls are operational
4. Collect evidence artifacts:
   - CendiaLedger™ exports (6-month window)
   - Test coverage reports
   - IISS score history
   - Incident response records
   - Change management logs (Git)
5. Identify and remediate any gaps

### 4.2 During Audit
1. Provide auditor with read-only access to:
   - CendiaLedger™ audit trail
   - Compliance dashboard
   - Test reports
   - Infrastructure monitoring (Grafana)
2. Demonstrate controls live:
   - Authentication flow
   - RBAC enforcement
   - Audit log generation
   - Backup verification
3. Answer auditor queries within 24 hours

### 4.3 Post-Audit
1. Review auditor findings
2. Create remediation plan for any gaps
3. Implement fixes within agreed timeline
4. Document lessons learned
5. Update SOPs as needed

---

## 5. Continuous Compliance

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Control effectiveness review | Monthly | Compliance Lead |
| Access control review | Quarterly | Security Lead |
| SOP review and update | Quarterly | All SOP owners |
| Penetration testing | Annually | External firm |
| DR drill | Semi-annually | DevOps Lead |
| IISS assessment | Quarterly | DCII Operations |
| Full SOC 2 audit | Annually | External auditor |

---

## 6. Evidence Collection Tools

| Evidence | Collection Method |
|----------|-------------------|
| Audit logs | CendiaLedger™ export |
| Access records | Auth service logs |
| Change history | Git log + PR history |
| Test results | `npm test` output, CI/CD reports |
| Monitoring data | Grafana dashboard exports |
| Incident records | Incident response logs |
| Policy documents | `docs/` directory, SOPs |

---

## 7. Verified Against

- `COMPLIANCE_DOCUMENTATION.md`: Full CC1–CC9 mapping, 95% readiness
- Platform controls: JWT auth, RBAC, CendiaLedger™, monitoring stack
- `infrastructure/docker-compose.monitoring.yaml`: Prometheus + Grafana
- `backend/src/middleware/`: Auth, rate limiting, CORS middleware
- All referenced SOPs: 006, 008, 011, 012, 025, 035

---

*Datacendia, LLC — Proprietary and Confidential*
