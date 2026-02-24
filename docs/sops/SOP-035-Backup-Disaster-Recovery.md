# SOP-035: Backup & Disaster Recovery

**Category:** Operations
**Priority:** Critical
**Owner:** DevOps Lead
**Last Verified:** 2026-02-22 (against `docs/BACKUP_RECOVERY.md`, `docker-compose` infrastructure)

---

## 1. Purpose

Define procedures for data backup, disaster recovery, and business continuity for all Datacendia platform components.

---

## 2. Data Classification & Backup Schedule

| Tier | Data Types | Backup Frequency | Retention |
|------|-----------|------------------|-----------|
| **Critical** | Decisions, Deliberations, Ledger, DCII scores | Real-time replication + Hourly | 7 years |
| **Important** | User data, Configurations, Agent settings | Every 6 hours | 1 year |
| **Standard** | Logs, Metrics, Cache state | Daily | 90 days |
| **Ephemeral** | Session data, Temp files | None | N/A |

---

## 3. Backup Architecture

```
PRIMARY DATACENTER
├── PostgreSQL (Primary) ──→ Local Backup Storage (encrypted snapshots, PITR)
├── Redis (Primary)      ──→ RDB snapshots
├── Neo4j (Primary)      ──→ Neo4j backup
└── MinIO (Object Store) ──→ Replicated storage

    ↓ Encrypted transfer

OFFSITE BACKUP (CendiaVault)
├── Geo-redundant storage (3+ regions)
├── AES-256 encryption at rest
├── Immutable copies (WORM)
└── Air-gapped cold storage option

    ↓ Quarterly archive

LONG-TERM ARCHIVE (CendiaEternal)
├── 7+ year retention for compliance
├── Court-admissible export capability
├── Blockchain-anchored integrity proofs
└── Quarterly archive verification
```

---

## 4. PostgreSQL Backup Procedures

### 4.1 Automated Daily Backup
```bash
#!/bin/bash
set -euo pipefail

BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${POSTGRES_DB:-datacendia}"

# Create encrypted backup
pg_dump -Fc "$DB_NAME" | \
  openssl enc -aes-256-cbc -salt -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -out "${BACKUP_DIR}/datacendia_${TIMESTAMP}.dump.enc"

# Verify backup integrity
openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -in "${BACKUP_DIR}/datacendia_${TIMESTAMP}.dump.enc" | \
  pg_restore --list > /dev/null 2>&1

echo "[$(date)] Backup completed: datacendia_${TIMESTAMP}.dump.enc"
```

### 4.2 Point-in-Time Recovery (PITR)
Requires WAL archiving enabled in PostgreSQL:
```
wal_level = replica
archive_mode = on
archive_command = 'cp %p /var/backups/wal/%f'
```

Restore to specific time:
```bash
pg_restore -d datacendia --target-time="2026-02-22 15:30:00" backup.dump
```

### 4.3 Manual Backup
```bash
# Unencrypted (development only)
pg_dump -Fc datacendia > backup_$(date +%Y%m%d).dump

# Restore
pg_restore -d datacendia backup_YYYYMMDD.dump
```

---

## 5. Redis Backup

### 5.1 RDB Snapshot
```bash
# Trigger manual snapshot
redis-cli -p 6380 -a datacendia_redis_2024 BGSAVE

# Snapshot file location (in Docker)
# /data/dump.rdb
```

### 5.2 Restore
1. Stop Redis
2. Replace `/data/dump.rdb` with backup copy
3. Start Redis

**Note:** Redis data is primarily cache; PostgreSQL is the source of truth. Redis loss is recoverable by restarting services (cache rebuilds from DB).

---

## 6. Neo4j Backup

### 6.1 Online Backup
```bash
neo4j-admin database dump neo4j --to-path=/var/backups/neo4j/
```

### 6.2 Restore
```bash
neo4j-admin database load neo4j --from-path=/var/backups/neo4j/ --overwrite-destination
```

---

## 7. Disaster Recovery Procedures

### 7.1 Recovery Time Objectives (RTO/RPO)

| Scenario | RTO | RPO |
|----------|-----|-----|
| Single service failure | 5 minutes | 0 (real-time replication) |
| Full server failure | 1 hour | 1 hour (hourly backups) |
| Datacenter failure | 4 hours | 6 hours (offsite backup) |
| Catastrophic loss | 24 hours | 24 hours (cold storage) |

### 7.2 Recovery Procedure

#### Step 1: Assess Damage
```bash
# Check all services
docker compose ps
curl http://localhost:3001/api/v1/health
```

#### Step 2: Restore Infrastructure
```bash
# Restart Docker services
docker compose -f infrastructure/docker-compose.sovereign.yml up -d

# Wait for health checks
sleep 30
```

#### Step 3: Restore Database
```bash
# From latest backup
openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -in /var/backups/postgresql/latest.dump.enc | \
  pg_restore -d datacendia

# Apply any WAL logs for PITR
```

#### Step 4: Restore Redis Cache
```bash
# Redis rebuilds from PostgreSQL automatically
# Or restore RDB if available
docker compose restart redis
```

#### Step 5: Verify Integrity
```bash
# Backend health
curl http://localhost:3001/api/v1/health

# Database connectivity
cd backend && npx prisma db pull

# CendiaLedger integrity
curl http://localhost:3001/api/v1/ledger/verify?start=2025-01-01
```

#### Step 6: Restore Application
```bash
docker compose up -d
```

---

## 8. DR Drill Procedure

Conduct DR drills **semi-annually**:

1. Schedule maintenance window
2. Document pre-drill state (service health, data checksums)
3. Simulate failure scenario:
   - Database corruption → restore from backup
   - Container failure → rebuild from images
   - Full environment loss → rebuild from scratch
4. Execute recovery procedure
5. Verify all services operational
6. Verify data integrity (compare checksums)
7. Document results and time-to-recovery
8. Create action items for improvement
9. Log drill in CendiaLedger™

---

## 9. Backup Monitoring

| Check | Frequency | Alert On |
|-------|-----------|----------|
| Backup completion | After each backup | Failure |
| Backup size trend | Daily | Unexpected change (>20%) |
| Backup age | Hourly | Newest backup > 2× expected interval |
| Restore test | Monthly | Restore failure |
| Offsite replication | Daily | Replication lag > 1 hour |

---

## 10. Verified Against

- `docs/BACKUP_RECOVERY.md`: Full backup architecture, PostgreSQL scripts, retention policies
- `infrastructure/docker-compose.sovereign.yml`: Sovereign stack with MinIO object storage
- `backend/src/config/index.ts`: Database connection configuration
- `COMPLIANCE_DOCUMENTATION.md`: SOC 2 CC7 (backup and recovery)
- Data classification: Critical (7yr), Important (1yr), Standard (90d)

---

*Datacendia, LLC — Proprietary and Confidential*
