# Runbook: Database Down

**Alert:** `DatabaseDisconnected`  
**Severity:** Critical  
**Team:** Platform

## Symptoms
- API returns 500 errors on database operations
- Grafana shows `datacendia_database_connected == 0`
- Logs show "ECONNREFUSED" or "Connection terminated"

## Immediate Actions

### 1. Check PostgreSQL Status
```bash
# Docker
docker ps | grep postgres
docker logs datacendia-postgres --tail 50

# Native
systemctl status postgresql
pg_isready -h localhost -p 5432
```

### 2. Test Connection
```bash
# From API container
docker exec datacendia-api npx prisma db execute --stdin <<< "SELECT 1"

# Direct connection
psql -h localhost -U datacendia -d datacendia -c "SELECT 1"
```

### 3. Restart PostgreSQL
```bash
# Docker
docker restart datacendia-postgres

# Native
systemctl restart postgresql
```

### 4. Verify Recovery
```bash
# Wait 30 seconds
curl -s http://localhost:3000/metrics | grep datacendia_database_connected
# Should show: datacendia_database_connected 1
```

## Root Cause Investigation

### Common Causes

| Cause | Check | Fix |
|-------|-------|-----|
| Container crashed | `docker ps -a` | Restart container |
| Out of disk | `df -h /var/lib/postgresql` | Free disk space |
| Too many connections | Check `max_connections` | Increase limit or fix connection leaks |
| Corrupted data | Check PostgreSQL logs | Restore from backup |
| Wrong credentials | Check `.env` DATABASE_URL | Fix credentials |

### Connection Pool Issues
```bash
# Check active connections
psql -c "SELECT count(*) FROM pg_stat_activity WHERE datname = 'datacendia';"

# Kill idle connections
psql -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'datacendia' AND state = 'idle' AND query_start < now() - interval '1 hour';"
```

## Escalation

If database is corrupted or data loss suspected:
1. **STOP** - Do not restart blindly
2. Page database admin
3. Preserve logs: `docker logs datacendia-postgres > postgres-crash.log 2>&1`
4. Check last backup timestamp

## Recovery from Backup

See `BACKUP_RESTORE.md` for full procedure.

Quick restore:
```bash
# Stop API to prevent writes
docker stop datacendia-api

# Restore from latest backup
pg_restore -h localhost -U datacendia -d datacendia -c backup.dump

# Restart API
docker start datacendia-api
```
