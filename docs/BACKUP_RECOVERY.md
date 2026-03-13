# Backup & Disaster Recovery Procedures

## Overview

This document outlines backup mechanisms, failover procedures, and disaster recovery drills for Datacendia's sovereign data handling infrastructure.

---

## 1. Backup Architecture

### 1.1 Data Classification

| Data Tier | Description | Backup Frequency | Retention |
|-----------|-------------|------------------|-----------|
| **Critical** | Decisions, Deliberations, Ledger | Real-time + Hourly | 7 years |
| **Important** | User data, Configurations | Every 6 hours | 1 year |
| **Standard** | Logs, Metrics, Cache | Daily | 90 days |
| **Ephemeral** | Session data, Temp files | None | N/A |

### 1.2 Backup Destinations

```
┌─────────────────────────────────────────────────────────────────┐
│                      PRIMARY DATACENTER                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐              │
│  │ PostgreSQL  │  │   MinIO     │  │   Redis     │              │
│  │  Primary    │  │  Primary    │  │  Primary    │              │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘              │
│         │                │                │                      │
├─────────┼────────────────┼────────────────┼──────────────────────┤
│         ▼                ▼                ▼                      │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │              LOCAL BACKUP STORAGE                        │    │
│  │  - Encrypted snapshots                                   │    │
│  │  - Point-in-time recovery (PITR)                        │    │
│  │  - Transaction log shipping                              │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   OFFSITE BACKUP (CendiaVault)                   │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - Geo-redundant storage (3+ regions)                   │    │
│  │  - AES-256 encryption at rest                           │    │
│  │  - Immutable backup copies (WORM)                       │    │
│  │  - Air-gapped cold storage option                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   LONG-TERM ARCHIVE (CendiaEternal)              │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  - 7+ year retention for compliance                     │    │
│  │  - forensic-grade, independently verifiable export capability                   │    │
│  │  - Blockchain-anchored integrity proofs                 │    │
│  │  - Quarterly archive verification                       │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Backup Procedures

### 2.1 PostgreSQL Database Backup

```bash
#!/bin/bash
# Daily PostgreSQL backup script

set -euo pipefail

BACKUP_DIR="/var/backups/postgresql"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
DB_NAME="${POSTGRES_DB:-datacendia}"

# Create encrypted backup
pg_dump -Fc "$DB_NAME" | \
  openssl enc -aes-256-cbc -salt -pbkdf2 \
    -pass file:/etc/datacendia/backup.key \
    -out "${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump.enc"

# Verify backup integrity
openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -in "${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump.enc" | \
  pg_restore --list > /dev/null

# Upload to offsite storage
aws s3 cp "${BACKUP_DIR}/${DB_NAME}_${TIMESTAMP}.dump.enc" \
  "s3://datacendia-backups/${DB_NAME}/" \
  --sse aws:kms --sse-kms-key-id alias/datacendia-backup

# Cleanup old backups (keep 30 days locally)
find "${BACKUP_DIR}" -name "*.dump.enc" -mtime +30 -delete

echo "Backup completed: ${DB_NAME}_${TIMESTAMP}"
```

### 2.2 MinIO Object Storage Backup

```bash
#!/bin/bash
# CendiaVault (MinIO) backup with versioning

set -euo pipefail

SOURCE_BUCKET="cendiavault"
BACKUP_BUCKET="cendiavault-backup"
TIMESTAMP=$(date +%Y%m%d)

# Sync with versioning
mc mirror --preserve --watch \
  "primary/${SOURCE_BUCKET}" \
  "backup/${BACKUP_BUCKET}/${TIMESTAMP}/"

# Create immutable snapshot
mc retention set --default GOVERNANCE 365d \
  "backup/${BACKUP_BUCKET}/${TIMESTAMP}/"
```

### 2.3 Ledger™ Backup (Immutable Decision Records)

```bash
#!/bin/bash
# Ledger backup with integrity verification

set -euo pipefail

LEDGER_DIR="/var/lib/datacendia/ledger"
BACKUP_DIR="/var/backups/ledger"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Export ledger with hash chain verification
datacendia-cli ledger export \
  --verify-chain \
  --format forensic-grade, independently verifiable \
  --output "${BACKUP_DIR}/ledger_${TIMESTAMP}.tar.gz.gpg"

# Anchor to blockchain (optional)
datacendia-cli ledger anchor \
  --file "${BACKUP_DIR}/ledger_${TIMESTAMP}.tar.gz.gpg" \
  --chain ethereum-mainnet
```

---

## 3. Recovery Procedures

### 3.1 Recovery Time Objectives (RTO) & Recovery Point Objectives (RPO)

| Scenario | RTO Target | RPO Target | Procedure |
|----------|------------|------------|-----------|
| Single node failure | 5 minutes | 0 (real-time) | Auto-failover |
| Database corruption | 30 minutes | 1 hour | PITR restore |
| Datacenter outage | 4 hours | 6 hours | DR site activation |
| Complete disaster | 24 hours | 24 hours | Cold storage restore |

### 3.2 PostgreSQL Recovery

```bash
#!/bin/bash
# PostgreSQL point-in-time recovery

set -euo pipefail

BACKUP_FILE="$1"
RECOVERY_TARGET="${2:-$(date -Iseconds)}"

# Stop the database
systemctl stop postgresql

# Decrypt and restore
openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -in "${BACKUP_FILE}" | \
  pg_restore -d datacendia --clean --if-exists

# Apply WAL logs up to target time
cat > /var/lib/postgresql/data/recovery.signal << EOF
recovery_target_time = '${RECOVERY_TARGET}'
recovery_target_action = 'promote'
EOF

# Start database in recovery mode
systemctl start postgresql

# Monitor recovery
tail -f /var/log/postgresql/postgresql-*.log | grep -i recovery
```

### 3.3 MinIO Recovery

```bash
#!/bin/bash
# Restore MinIO bucket from backup

set -euo pipefail

BACKUP_DATE="$1"
TARGET_BUCKET="${2:-cendiavault}"

# Restore from backup
mc mirror --overwrite \
  "backup/cendiavault-backup/${BACKUP_DATE}/" \
  "primary/${TARGET_BUCKET}/"

# Verify object count and checksums
mc ls --recursive "primary/${TARGET_BUCKET}" | wc -l
mc stat "primary/${TARGET_BUCKET}" --json | jq '.totalSize'
```

---

## 4. Disaster Recovery Drills

### 4.1 Quarterly DR Drill Checklist

```markdown
## DR Drill: Q[X] [YEAR]

### Pre-Drill Preparation
- [ ] Schedule maintenance window (4 hours)
- [ ] Notify stakeholders
- [ ] Prepare rollback plan
- [ ] Verify backup integrity
- [ ] Document current state

### Drill Execution

#### Phase 1: Backup Verification (30 min)
- [ ] Verify latest backup exists
- [ ] Check backup encryption
- [ ] Validate backup checksums
- [ ] Test backup decryption

#### Phase 2: Failover Test (1 hour)
- [ ] Initiate failover to DR site
- [ ] Verify DNS propagation
- [ ] Test application connectivity
- [ ] Validate data consistency
- [ ] Run smoke tests

#### Phase 3: Recovery Test (1 hour)
- [ ] Restore from backup to test environment
- [ ] Verify data integrity
- [ ] Run application tests
- [ ] Validate Ledger hash chain
- [ ] Test decision retrieval

#### Phase 4: Failback (30 min)
- [ ] Initiate failback to primary
- [ ] Verify service restoration
- [ ] Confirm data sync
- [ ] Close maintenance window

### Post-Drill Review
- [ ] Document findings
- [ ] Update runbooks
- [ ] File incident report (if issues found)
- [ ] Schedule remediation tasks
```

### 4.2 DR Drill Automation Script

```bash
#!/bin/bash
# Automated DR drill script

set -euo pipefail

DRILL_ID=$(date +%Y%m%d_%H%M%S)
LOG_FILE="/var/log/datacendia/dr-drill-${DRILL_ID}.log"

log() {
  echo "[$(date -Iseconds)] $1" | tee -a "$LOG_FILE"
}

# Phase 1: Backup Verification
log "=== Phase 1: Backup Verification ==="

LATEST_BACKUP=$(ls -t /var/backups/postgresql/*.dump.enc | head -1)
log "Latest backup: ${LATEST_BACKUP}"

# Verify backup can be decrypted
if openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -in "${LATEST_BACKUP}" | pg_restore --list > /dev/null 2>&1; then
  log "✓ Backup verification: PASSED"
else
  log "✗ Backup verification: FAILED"
  exit 1
fi

# Phase 2: Test Restore
log "=== Phase 2: Test Restore ==="

TEST_DB="datacendia_dr_test_${DRILL_ID}"
createdb "${TEST_DB}"

openssl enc -d -aes-256-cbc -pbkdf2 \
  -pass file:/etc/datacendia/backup.key \
  -in "${LATEST_BACKUP}" | \
  pg_restore -d "${TEST_DB}" --no-owner

# Verify data
DECISION_COUNT=$(psql -tAc "SELECT COUNT(*) FROM decisions" "${TEST_DB}")
LEDGER_COUNT=$(psql -tAc "SELECT COUNT(*) FROM ledger_entries" "${TEST_DB}")

log "Restored decisions: ${DECISION_COUNT}"
log "Restored ledger entries: ${LEDGER_COUNT}"

# Verify Ledger integrity
log "=== Phase 3: Ledger Integrity Check ==="
CHAIN_VALID=$(psql -tAc "
  SELECT CASE 
    WHEN COUNT(*) = 0 THEN true
    ELSE false
  END
  FROM (
    SELECT id, hash, 
      lag(hash) OVER (ORDER BY created_at) as prev_hash,
      previous_hash
    FROM ledger_entries
  ) t
  WHERE prev_hash IS NOT NULL AND prev_hash != previous_hash
" "${TEST_DB}")

if [ "${CHAIN_VALID}" = "t" ]; then
  log "✓ Ledger hash chain: VALID"
else
  log "✗ Ledger hash chain: BROKEN"
fi

# Cleanup
dropdb "${TEST_DB}"

log "=== DR Drill Complete ==="
log "Results saved to: ${LOG_FILE}"
```

---

## 5. CendiaEternal™ Long-Term Archival

### 5.1 Archive Strategy

For regulatory compliance (SOX, HIPAA, GDPR), Datacendia maintains **7+ year** archives of:

- All council deliberations
- Decision audit trails
- Ledger entries with hash proofs
- Compliance reports
- User consent records

### 5.2 Archive Format

```json
{
  "archive": {
    "version": "1.0",
    "created": "2024-01-15T00:00:00Z",
    "tenant": "acme-corp",
    "period": {
      "start": "2023-01-01",
      "end": "2023-12-31"
    }
  },
  "contents": {
    "decisions": {
      "count": 1523,
      "checksum": "sha256:abc123..."
    },
    "deliberations": {
      "count": 4892,
      "checksum": "sha256:def456..."
    },
    "ledger": {
      "entries": 15234,
      "chain_root": "sha256:789xyz...",
      "blockchain_anchor": "0x..."
    }
  },
  "encryption": {
    "algorithm": "AES-256-GCM",
    "key_id": "arn:aws:kms:...",
    "key_escrow": "datacendia-escrow-2024"
  },
  "legal": {
    "court_admissible": true,
    "notarized": true,
    "notary_id": "NOT-2024-001234"
  }
}
```

### 5.3 Archive Retrieval

```bash
#!/bin/bash
# Retrieve archived data for legal/compliance

set -euo pipefail

TENANT="$1"
YEAR="$2"
OUTPUT_DIR="${3:-./archive-export}"

# Download from cold storage
aws s3 cp \
  "s3://datacendia-eternal/${TENANT}/${YEAR}/archive.tar.gz.gpg" \
  "${OUTPUT_DIR}/" \
  --request-payer requester

# Decrypt with escrow key
gpg --decrypt \
  --recipient datacendia-legal@datacendia.com \
  --output "${OUTPUT_DIR}/archive.tar.gz" \
  "${OUTPUT_DIR}/archive.tar.gz.gpg"

# Extract and verify
cd "${OUTPUT_DIR}"
tar -xzf archive.tar.gz
sha256sum -c checksums.sha256

echo "Archive extracted to: ${OUTPUT_DIR}"
echo "Verify integrity with: datacendia-cli ledger verify-chain"
```

---

## 6. Monitoring & Alerting

### 6.1 Backup Health Checks

```yaml
# Prometheus alerts for backup monitoring
groups:
  - name: backup_alerts
    rules:
      - alert: BackupMissing
        expr: time() - backup_last_success_timestamp > 86400
        for: 1h
        labels:
          severity: critical
        annotations:
          summary: "Backup missing for {{ $labels.instance }}"
          
      - alert: BackupVerificationFailed
        expr: backup_verification_status == 0
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: "Backup verification failed"
          
      - alert: LedgerChainBroken
        expr: ledger_chain_valid == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "Ledger hash chain integrity compromised"
```

### 6.2 DR Readiness Dashboard

Key metrics to monitor:

- **Backup Age**: Time since last successful backup
- **Backup Size Trend**: Detect anomalies in backup growth
- **Restore Test Success Rate**: Track quarterly drill results
- **RPO Compliance**: Actual vs target recovery points
- **Ledger Chain Status**: Continuous integrity verification

---

## 7. Contact & Escalation

| Role | Contact | Escalation Time |
|------|---------|-----------------|
| On-Call Engineer | PagerDuty | Immediate |
| Database Admin | dba@datacendia.com | 15 min |
| Security Team | security@datacendia.com | 30 min |
| Legal/Compliance | legal@datacendia.com | 1 hour |
| Executive Sponsor | CTO | 2 hours |

---

## Appendix A: Backup Verification Test Script

```typescript
// tests/integration/backup-verification.test.ts
import { describe, it, expect } from 'vitest';

describe('Backup Verification', () => {
  it('should have recent database backup', async () => {
    const lastBackup = await getLastBackupTimestamp('postgresql');
    const hoursSinceBackup = (Date.now() - lastBackup) / (1000 * 60 * 60);
    expect(hoursSinceBackup).toBeLessThan(24);
  });

  it('should have valid backup encryption', async () => {
    const backup = await getLatestBackup('postgresql');
    const isEncrypted = await verifyEncryption(backup);
    expect(isEncrypted).toBe(true);
  });

  it('should maintain ledger chain integrity', async () => {
    const chainValid = await verifyLedgerChain();
    expect(chainValid).toBe(true);
  });

  it('should have offsite backup within RPO', async () => {
    const offsiteBackup = await getLastOffsiteBackup();
    const hoursSinceOffsite = (Date.now() - offsiteBackup) / (1000 * 60 * 60);
    expect(hoursSinceOffsite).toBeLessThan(6);
  });
});
```

---

*Last Updated: December 2024*
*Document Owner: Platform Engineering*
*Review Cycle: Quarterly*
