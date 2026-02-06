# Datacendia Operational Runbooks

Quick reference for on-call engineers and operations team.

## Critical Alerts

| Alert | Runbook | First Action |
|-------|---------|--------------|
| APIDown | [API_DOWN.md](./API_DOWN.md) | Check process, restart if needed |
| DatabaseDisconnected | [DATABASE_DOWN.md](./DATABASE_DOWN.md) | Check PostgreSQL, restart |
| HighMemoryUsage | [API_DOWN.md](./API_DOWN.md) | Check for memory leaks |

## Procedures

| Procedure | Document | When to Use |
|-----------|----------|-------------|
| Backup & Restore | [BACKUP_RESTORE.md](./BACKUP_RESTORE.md) | Data recovery, DR testing |
| Deployment | [../PRODUCTION_CHECKLIST.md](../PRODUCTION_CHECKLIST.md) | New releases |

## Quick Commands

```bash
# Check all services
docker ps --format "table {{.Names}}\t{{.Status}}"

# Check API health
curl -s http://localhost:3000/api/v1/health | jq .

# Check metrics
curl -s http://localhost:3000/metrics | head -50

# View API logs
docker logs datacendia-api --tail 100 -f

# Restart API
docker restart datacendia-api
```

## Escalation Path

1. **0-15 min**: On-call engineer attempts resolution
2. **15-30 min**: Page team lead if unresolved
3. **30-60 min**: Engage infrastructure/database specialist
4. **60+ min**: Executive notification for major incidents

## Monitoring Links

- Grafana: http://localhost:3001
- Prometheus: http://localhost:9090
- Jaeger: http://localhost:16686
- Alertmanager: http://localhost:9093
