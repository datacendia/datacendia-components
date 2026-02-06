# Datacendia Disaster Recovery Plan (DRP)

**Version:** 1.0  
**Effective Date:** January 30, 2026  
**Last Updated:** January 30, 2026  
**Classification:** Internal Confidential

---

## 1. Executive Summary

This document outlines the disaster recovery procedures for the Datacendia platform. It defines recovery objectives, team responsibilities, and step-by-step procedures for restoring services following a disaster event.

### 1.1 Recovery Objectives

| Metric | Target | Definition |
|--------|--------|------------|
| **RTO (Recovery Time Objective)** | 4 hours | Maximum time to restore service |
| **RPO (Recovery Point Objective)** | 1 hour | Maximum data loss window |
| **MTTR (Mean Time to Recovery)** | 2 hours | Average recovery time |

### 1.2 Scope

This plan covers:
- Core platform services (API, UI, Database)
- Supporting infrastructure (Redis, MinIO, Prometheus)
- Critical integrations (Ollama, SSO)
- Audit and compliance data

---

## 2. Disaster Classification

### 2.1 Severity Levels

| Level | Description | Examples | Response Time |
|-------|-------------|----------|---------------|
| **Level 1 - Critical** | Complete service outage | Data center loss, ransomware | Immediate |
| **Level 2 - Major** | Partial service degradation | Database corruption, network failure | 15 minutes |
| **Level 3 - Minor** | Single component failure | Redis down, replica failure | 30 minutes |
| **Level 4 - Warning** | Potential issue detected | Disk 80% full, high latency | 1 hour |

### 2.2 Disaster Types

| Type | Examples | Primary Recovery Strategy |
|------|----------|--------------------------|
| **Infrastructure** | Server failure, power outage | Failover to standby |
| **Data** | Corruption, accidental deletion | Restore from backup |
| **Security** | Breach, ransomware | Isolate, restore clean backup |
| **Natural** | Flood, fire, earthquake | Failover to DR site |
| **Vendor** | Cloud provider outage | Multi-region failover |

---

## 3. Disaster Recovery Team

### 3.1 Core Team

| Role | Primary | Backup | Contact |
|------|---------|--------|---------|
| **DR Coordinator** | [CTO Name] | [VP Eng Name] | +1-XXX-XXX-XXXX |
| **Infrastructure Lead** | [DevOps Lead] | [SRE Engineer] | +1-XXX-XXX-XXXX |
| **Database Lead** | [DBA Name] | [Backend Lead] | +1-XXX-XXX-XXXX |
| **Security Lead** | [CISO Name] | [Security Engineer] | +1-XXX-XXX-XXXX |
| **Communications Lead** | [VP Ops Name] | [Support Lead] | +1-XXX-XXX-XXXX |

### 3.2 Escalation Path

```
Level 4 → On-call Engineer → Infrastructure Lead → DR Coordinator
Level 3 → Infrastructure Lead → DR Coordinator
Level 2 → DR Coordinator → Executive Team
Level 1 → DR Coordinator → Executive Team → Board Notification
```

---

## 4. Backup Strategy

### 4.1 Backup Schedule

| Component | Method | Frequency | Retention | Location |
|-----------|--------|-----------|-----------|----------|
| **PostgreSQL** | pg_dump + WAL | Hourly + continuous | 30 days | S3 + DR site |
| **Redis** | RDB + AOF | Every 15 min | 7 days | Local + S3 |
| **MinIO Objects** | Cross-region replication | Real-time | 90 days | DR region |
| **Audit Logs** | Immutable append | Real-time | 10 years | S3 Glacier |
| **Decision Packets** | Hash-verified copy | Real-time | Indefinite | Multi-region |
| **Configuration** | Git + encrypted backup | On change | Indefinite | GitHub + S3 |

### 4.2 Backup Verification

| Test | Frequency | Success Criteria |
|------|-----------|-----------------|
| **Backup completion** | Daily (automated) | No errors, size within 10% |
| **Restore test (sample)** | Weekly | Data matches hash |
| **Full restore drill** | Monthly | Complete restore < RTO |
| **DR failover drill** | Quarterly | Full service < RTO |

---

## 5. Recovery Procedures

### 5.1 Database Recovery (PostgreSQL)

#### Point-in-Time Recovery (PITR)

```bash
# 1. Stop application servers
kubectl scale deployment datacendia-api --replicas=0

# 2. Create recovery configuration
cat > /var/lib/postgresql/recovery.conf << EOF
restore_command = 'aws s3 cp s3://datacendia-backups/wal/%f %p'
recovery_target_time = '2026-01-30 09:00:00'
EOF

# 3. Restore base backup
pg_restore -d datacendia /backups/latest.dump

# 4. Apply WAL logs
pg_ctl start -D /var/lib/postgresql/data

# 5. Verify data integrity
psql -c "SELECT COUNT(*) FROM decision_packets;"

# 6. Restart application
kubectl scale deployment datacendia-api --replicas=3
```

#### Full Restore from Backup

```bash
# 1. Create fresh database
createdb datacendia_restore

# 2. Restore from latest backup
pg_restore -d datacendia_restore s3://datacendia-backups/daily/latest.dump

# 3. Verify record counts match backup manifest
./scripts/verify-restore.sh datacendia_restore

# 4. Rename databases
psql -c "ALTER DATABASE datacendia RENAME TO datacendia_corrupted;"
psql -c "ALTER DATABASE datacendia_restore RENAME TO datacendia;"

# 5. Restart services
systemctl restart datacendia-api
```

### 5.2 Full Platform Recovery

#### From Complete Outage

```bash
# Phase 1: Infrastructure (Target: 30 minutes)
terraform apply -auto-approve infrastructure/terraform/dr/

# Phase 2: Database (Target: 60 minutes)
./scripts/restore-database.sh --source=s3://datacendia-backups/latest

# Phase 3: Application (Target: 30 minutes)
kubectl apply -f kubernetes/production/
kubectl rollout status deployment/datacendia-api

# Phase 4: Verification (Target: 30 minutes)
./scripts/smoke-test.sh --environment=production
./scripts/verify-audit-integrity.sh

# Phase 5: DNS Cutover (Target: 15 minutes)
aws route53 change-resource-record-sets --hosted-zone-id $ZONE_ID \
  --change-batch file://dns-failover.json
```

### 5.3 Security Incident Recovery

#### Ransomware/Breach Response

```bash
# 1. IMMEDIATE: Isolate affected systems
aws ec2 modify-instance-attribute --instance-id $INSTANCE \
  --groups sg-isolated-only

# 2. Preserve evidence
aws ec2 create-snapshot --volume-id $VOLUME --description "Incident evidence"

# 3. Identify clean restore point
./scripts/find-clean-backup.sh --before="2026-01-29T12:00:00Z"

# 4. Provision fresh infrastructure
terraform apply -var="environment=recovery" infrastructure/terraform/clean/

# 5. Restore from clean backup
./scripts/restore-database.sh --source=$CLEAN_BACKUP --target=recovery

# 6. Rotate all credentials
./scripts/rotate-all-secrets.sh --environment=recovery

# 7. Verify no compromise
./scripts/security-scan.sh --environment=recovery

# 8. Cutover to recovery environment
./scripts/dns-cutover.sh --from=production --to=recovery
```

---

## 6. Communication Plan

### 6.1 Internal Communication

| Audience | Channel | Timing | Content |
|----------|---------|--------|---------|
| **DR Team** | Slack #incident | Immediate | Status, actions needed |
| **Engineering** | Slack #engineering | 15 min | Impact, estimated RTO |
| **Executive** | Phone + Email | 30 min | Business impact, ETA |
| **All Hands** | Email | 1 hour | Summary, customer impact |

### 6.2 External Communication

| Audience | Channel | Timing | Content |
|----------|---------|--------|---------|
| **Status Page** | status.datacendia.com | Immediate | Incident acknowledged |
| **Enterprise Customers** | Direct email | 30 min | Personal update |
| **All Customers** | Email + Status | 1 hour | Detailed update |
| **Post-Incident** | Blog + Email | 48 hours | Root cause, prevention |

### 6.3 Communication Templates

#### Initial Notification
```
Subject: [Datacendia] Service Disruption - Investigation in Progress

We are currently investigating a service disruption affecting [COMPONENT].
Our team is actively working to restore service.

Current Status: Investigating
Estimated Resolution: [TIME]

Updates will be posted to status.datacendia.com
```

#### Resolution Notification
```
Subject: [Datacendia] Service Restored

The service disruption affecting [COMPONENT] has been resolved.

Duration: [DURATION]
Root Cause: [BRIEF CAUSE]
Data Impact: [NONE/DETAILS]

A detailed post-mortem will be published within 48 hours.
```

---

## 7. DR Site Configuration

### 7.1 Architecture

```
Primary Site (us-east-1)          DR Site (us-west-2)
┌─────────────────────┐           ┌─────────────────────┐
│  Load Balancer      │           │  Load Balancer      │
│  ├── API (3x)       │◄─────────►│  ├── API (3x)       │
│  ├── Worker (2x)    │  Sync     │  ├── Worker (2x)    │
│  └── UI (CDN)       │           │  └── UI (CDN)       │
├─────────────────────┤           ├─────────────────────┤
│  PostgreSQL Primary │──────────►│  PostgreSQL Replica │
│  Redis Primary      │──────────►│  Redis Replica      │
│  MinIO Primary      │──────────►│  MinIO Replica      │
└─────────────────────┘           └─────────────────────┘
```

### 7.2 Failover Triggers

| Trigger | Automatic | Manual Approval |
|---------|-----------|-----------------|
| Primary API unresponsive > 5 min | ✅ | ❌ |
| Database replication lag > 1 hour | ❌ | ✅ |
| Primary region declared down | ✅ | ❌ |
| Security incident | ❌ | ✅ |

---

## 8. Testing Schedule

### 8.1 Regular Tests

| Test Type | Frequency | Duration | Participants |
|-----------|-----------|----------|--------------|
| **Backup verification** | Daily | Automated | None |
| **Component failover** | Weekly | 1 hour | On-call |
| **Database restore** | Monthly | 2 hours | DBA + DevOps |
| **Full DR drill** | Quarterly | 4 hours | Full DR team |
| **Tabletop exercise** | Annually | 2 hours | Executives + DR team |

### 8.2 Test Documentation

Each test must document:
1. Date and time
2. Participants
3. Scenario tested
4. Actual vs. expected results
5. Issues encountered
6. Remediation actions

---

## 9. Post-Incident Procedures

### 9.1 Post-Mortem Timeline

| Action | Deadline |
|--------|----------|
| Incident log complete | +24 hours |
| Root cause identified | +48 hours |
| Post-mortem document | +72 hours |
| Prevention actions | +1 week |
| Customer communication | +48 hours |

### 9.2 Post-Mortem Template

```markdown
## Incident Summary
- Date/Time: 
- Duration: 
- Severity: 
- Impact: 

## Timeline
- [TIME] - First alert
- [TIME] - Investigation started
- [TIME] - Root cause identified
- [TIME] - Mitigation applied
- [TIME] - Service restored

## Root Cause
[Detailed technical explanation]

## Contributing Factors
1. 
2. 

## Action Items
| Action | Owner | Due Date | Status |
|--------|-------|----------|--------|

## Lessons Learned
1. What went well:
2. What could be improved:
```

---

## 10. Document Maintenance

| Activity | Frequency | Owner |
|----------|-----------|-------|
| Review and update | Quarterly | DR Coordinator |
| Contact verification | Monthly | Operations |
| Procedure validation | After each drill | Infrastructure Lead |
| Compliance review | Annually | Security Team |

---

*Document Owner: CTO*  
*Review Cycle: Quarterly*  
*Next Review: April 30, 2026*
