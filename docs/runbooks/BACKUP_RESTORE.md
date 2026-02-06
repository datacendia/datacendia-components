# Backup and Restore Procedures

## Backup Strategy

### Automated Backups

| Component | Frequency | Retention | Location |
|-----------|-----------|-----------|----------|
| PostgreSQL | Daily at 2am UTC | 30 days | `/backups/postgres/` |
| MinIO/Evidence Vault | Daily at 3am UTC | 90 days | `/backups/minio/` |
| Redis (optional) | Hourly RDB | 7 days | `/backups/redis/` |
| Configuration | On deploy | 10 versions | Git repository |

### Backup Script

Create `/scripts/backup.sh`:
```bash
#!/bin/bash
set -e

BACKUP_DIR="/backups"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# PostgreSQL Backup
echo "[$(date)] Starting PostgreSQL backup..."
docker exec datacendia-postgres pg_dump -U datacendia datacendia | gzip > "$BACKUP_DIR/postgres/datacendia_$DATE.sql.gz"
echo "[$(date)] PostgreSQL backup complete."

# MinIO Backup (Evidence Vault)
echo "[$(date)] Starting MinIO backup..."
docker exec datacendia-minio mc mirror /data "$BACKUP_DIR/minio/$DATE/" --overwrite
echo "[$(date)] MinIO backup complete."

# Cleanup old backups
echo "[$(date)] Cleaning up old backups..."
find "$BACKUP_DIR/postgres" -name "*.sql.gz" -mtime +$RETENTION_DAYS -delete
find "$BACKUP_DIR/minio" -maxdepth 1 -type d -mtime +90 -exec rm -rf {} \;

echo "[$(date)] Backup complete."
```

### Cron Schedule
```cron
# Daily PostgreSQL backup at 2am UTC
0 2 * * * /scripts/backup.sh >> /var/log/backup.log 2>&1
```

---

## Restore Procedures

### PostgreSQL Restore

#### Full Database Restore
```bash
# 1. Stop the API to prevent writes
docker stop datacendia-api

# 2. List available backups
ls -la /backups/postgres/

# 3. Restore from backup
gunzip -c /backups/postgres/datacendia_YYYYMMDD_HHMMSS.sql.gz | \
  docker exec -i datacendia-postgres psql -U datacendia -d datacendia

# 4. Restart API
docker start datacendia-api

# 5. Verify
curl http://localhost:3000/api/v1/health
```

#### Point-in-Time Recovery (if WAL archiving enabled)
```bash
# 1. Stop PostgreSQL
docker stop datacendia-postgres

# 2. Restore base backup
tar -xzf /backups/postgres/base_backup.tar.gz -C /var/lib/postgresql/data

# 3. Create recovery.conf
cat > /var/lib/postgresql/data/recovery.conf <<EOF
restore_command = 'cp /backups/postgres/wal/%f %p'
recovery_target_time = '2026-01-17 22:00:00'
EOF

# 4. Start PostgreSQL (will recover to target time)
docker start datacendia-postgres
```

### MinIO/Evidence Vault Restore
```bash
# 1. List available backups
ls -la /backups/minio/

# 2. Restore specific backup
docker exec datacendia-minio mc mirror /backups/minio/YYYYMMDD_HHMMSS/ /data --overwrite

# 3. Verify
curl http://localhost:9000/minio/health/live
```

---

## Disaster Recovery

### RTO/RPO Targets

| Scenario | RTO (Recovery Time) | RPO (Data Loss) |
|----------|---------------------|-----------------|
| Single service failure | 5 minutes | 0 |
| Database corruption | 30 minutes | 24 hours (last backup) |
| Full infrastructure loss | 2 hours | 24 hours |

### DR Checklist

- [ ] Verify backup exists and is recent
- [ ] Test restore to staging environment monthly
- [ ] Document infrastructure dependencies
- [ ] Keep offsite backup copy (S3, Azure Blob, etc.)
- [ ] Maintain runbooks for all critical services

### Emergency Contacts

| Role | Contact | Escalation |
|------|---------|------------|
| On-Call Engineer | PagerDuty | Auto-escalate after 15 min |
| Database Admin | [Configure] | After 30 min |
| Infrastructure Lead | [Configure] | After 1 hour |

---

## Testing Backups

### Monthly Backup Test
```bash
# 1. Restore to test database
docker run -d --name test-postgres -e POSTGRES_PASSWORD=test postgres:15
gunzip -c /backups/postgres/latest.sql.gz | docker exec -i test-postgres psql -U postgres

# 2. Run verification queries
docker exec test-postgres psql -U postgres -c "SELECT COUNT(*) FROM users;"
docker exec test-postgres psql -U postgres -c "SELECT COUNT(*) FROM deliberations;"

# 3. Cleanup
docker stop test-postgres && docker rm test-postgres
```

### Document Test Results
```
Date: YYYY-MM-DD
Backup File: datacendia_YYYYMMDD_HHMMSS.sql.gz
Size: XX MB
Restore Time: X minutes
Tables Verified: users, organizations, deliberations, decisions
Result: PASS/FAIL
Tester: [Name]
```
