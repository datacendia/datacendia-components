# Business Continuity and Disaster Recovery Plan

**Datacendia, LLC**
**Version:** 1.0
**Effective Date:** April 15, 2026
**Owner:** CTO
**Classification:** Confidential

---

## 1. Purpose

This plan establishes procedures for maintaining business operations and recovering from disruptions affecting the Datacendia DCII platform.

## 2. Recovery Objectives

| Metric | Target | Justification |
|--------|--------|---------------|
| **RTO** (Recovery Time Objective) | 4 hours | Maximum acceptable downtime |
| **RPO** (Recovery Point Objective) | 1 hour | Maximum acceptable data loss |
| **MTPD** (Maximum Tolerable Period of Disruption) | 24 hours | Beyond this, business impact is severe |

## 3. Critical Systems

| System | Priority | RTO | RPO | Recovery Method |
|--------|----------|-----|-----|-----------------|
| PostgreSQL Database | P1 | 2h | 1h | Point-in-time recovery from WAL |
| Backend API | P1 | 1h | N/A | Container restart / redeployment |
| Frontend Application | P2 | 2h | N/A | CDN cache / redeployment |
| Redis Cache | P3 | 30m | N/A | Ephemeral — rebuilt from DB |
| Qdrant Vector DB | P3 | 4h | 24h | Rebuild from source documents |
| Ollama AI Inference | P3 | 2h | N/A | Model re-pull / local cache |

## 4. Backup Strategy

### 4.1 Database Backups
- **Full backup:** Daily at 02:00 UTC
- **Incremental (WAL):** Continuous streaming
- **Retention:** 30 days for daily backups; 1 year for monthly
- **Testing:** Monthly restore verification

### 4.2 Application Backups
- Docker images stored in private registry
- Git repository serves as configuration backup
- Environment variables documented in secure vault

### 4.3 Audit Log Backups
- Immutable audit logs backed up separately
- 6-year retention per HIPAA requirements
- SHA-256 hash chain integrity verification on restore

## 5. Disaster Recovery Procedures

### 5.1 Database Failure
1. Assess failure scope (corruption vs hardware)
2. Attempt primary recovery with PostgreSQL repair tools
3. If unsuccessful, restore from most recent backup + WAL replay
4. Verify data integrity via row counts and hash checks
5. Resume application services

### 5.2 Application Server Failure
1. Container orchestrator automatically restarts failed containers
2. If node failure, failover to standby node
3. Health check endpoints verify recovery
4. Monitor for 1 hour post-recovery

### 5.3 Complete Site Failure
1. Activate disaster recovery site (if configured)
2. Restore database from offsite backup
3. Deploy application containers from registry
4. Update DNS if necessary
5. Verify full functionality
6. Notify affected customers

### 5.4 Decision Recovery
- DeterministicReplayService enables bit-perfect decision reconstruction
- Pinned random seeds and captured state allow replay
- Audit log hash chain verifies integrity of recovered decisions

## 6. Sovereign Deployment Considerations

Since DCII deploys on customer-owned infrastructure:
- Customers are responsible for infrastructure-level DR
- Datacendia provides: application recovery procedures, backup scripts, and documentation
- Portable Instance service can generate bootable USB for emergency deployment
- Data Diode service enables secure data recovery in air-gapped environments

## 7. Communication Plan

| Audience | Method | Timing | Responsible |
|----------|--------|--------|-------------|
| Internal team | Slack/email | Immediately | Incident Commander |
| Affected customers | Email + dashboard | Within 2 hours | Customer Success |
| All customers | Status page | Within 4 hours | Communications |
| Regulators | Per notification requirements | Per framework | Legal |

## 8. Testing Schedule

| Test Type | Frequency | Scope |
|-----------|-----------|-------|
| Backup restore verification | Monthly | Database + audit logs |
| Failover test | Quarterly | Application server |
| Full DR simulation | Annually | Complete site recovery |
| Tabletop exercise | Biannually | Decision-making and communication |

## 9. Plan Review

Reviewed annually or after:
- Any actual disaster/disruption
- Significant infrastructure changes
- DR test failures
- Changes in recovery objectives

---

**Approved by:** Stuart Rainey, CEO/Owner
**Date:** April 15, 2026
