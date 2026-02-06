# Runbook: API Down

**Alert:** `APIDown`  
**Severity:** Critical  
**Team:** Platform

## Symptoms
- Health check endpoint `/api/v1/health` not responding
- Grafana shows `datacendia_service_up{service="api"} == 0`
- Users report "Service Unavailable" errors

## Immediate Actions

### 1. Verify the Issue (30 seconds)
```bash
curl -s http://localhost:3000/api/v1/health | jq .
# Expected: {"success": true, "data": {...}}
```

### 2. Check Process Status
```bash
# Docker
docker ps | grep datacendia
docker logs datacendia-api --tail 100

# PM2
pm2 status
pm2 logs datacendia-api --lines 100

# systemd
systemctl status datacendia-api
journalctl -u datacendia-api -n 100
```

### 3. Check Resource Usage
```bash
# Memory
free -h
docker stats --no-stream

# Disk
df -h

# CPU
top -bn1 | head -20
```

### 4. Restart the Service
```bash
# Docker
docker restart datacendia-api

# PM2
pm2 restart datacendia-api

# systemd
systemctl restart datacendia-api
```

### 5. Verify Recovery
```bash
# Wait 30 seconds, then:
curl -s http://localhost:3000/api/v1/health | jq .
```

## Root Cause Investigation

### Common Causes

| Cause | Check | Fix |
|-------|-------|-----|
| Out of Memory | `docker logs` shows OOM | Increase container memory limit |
| Database Down | Check PostgreSQL | See `DATABASE_DOWN.md` runbook |
| Port Conflict | `netstat -tlnp | grep 3000` | Kill conflicting process |
| Config Error | Check `.env` file | Fix environment variables |
| Dependency Crash | Check Redis, Ollama | Restart dependent services |

### Log Analysis
```bash
# Look for errors in last hour
docker logs datacendia-api --since 1h 2>&1 | grep -i error

# Check for OOM
dmesg | grep -i "out of memory"
```

## Escalation

If issue persists after 15 minutes:
1. Page on-call engineer
2. Check recent deployments for rollback
3. Consider failover to backup instance

## Post-Incident

1. Document timeline in incident report
2. Identify root cause
3. Create ticket for permanent fix
4. Update this runbook if needed
