# SOP-037: System Health Monitoring

**Category:** Operations
**Priority:** High
**Owner:** DevOps Lead
**Last Verified:** 2026-02-22 (against `backend/src/services/admin/SystemHealthService.ts`, `infrastructure/docker-compose.monitoring.yaml`)

---

## 1. Purpose

Define procedures for monitoring the health, performance, and availability of all Datacendia platform components, including alert configuration and escalation procedures.

---

## 2. Monitoring Stack

| Component | Technology | Access |
|-----------|-----------|--------|
| Metrics collection | Prometheus | http://localhost:9090 |
| Dashboards | Grafana | http://localhost:3000 |
| Application health | Custom `/api/v1/health` | http://localhost:3001/api/v1/health |
| Log aggregation | Winston logger | Backend stdout / file |
| AI system monitoring | AI Tech Team (AutoHeal) | Cortex UI sidebar |
| Infrastructure | Docker health checks | `docker compose ps` |

---

## 3. Health Check Endpoints

### 3.1 Backend Health
```bash
curl http://localhost:3001/api/v1/health
```

Returns:
```json
{
  "status": "healthy",
  "uptime": 86400,
  "services": {
    "database": "connected",
    "redis": "connected",
    "neo4j": "connected",
    "ollama": "available"
  },
  "version": "4.7.0"
}
```

### 3.2 Component-Specific Checks
```bash
# PostgreSQL
docker exec datacendia-postgres pg_isready
# or: psql $DATABASE_URL -c "SELECT 1"

# Redis
redis-cli -p 6380 -a datacendia_redis_2024 ping

# Neo4j
curl http://localhost:7474

# Ollama
curl http://localhost:11434/api/tags

# Auto-heal status
curl http://localhost:3001/api/v1/auto-heal/status
```

---

## 4. Key Metrics to Monitor

### 4.1 Infrastructure Metrics
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| CPU usage | < 70% | > 80% | > 95% |
| Memory usage | < 75% | > 85% | > 95% |
| Disk usage | < 70% | > 80% | > 90% |
| Network latency (internal) | < 5ms | > 20ms | > 100ms |

### 4.2 Application Metrics
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| API response time (p95) | < 500ms | > 1s | > 5s |
| API error rate | < 1% | > 2% | > 5% |
| Active WebSocket connections | Per capacity | > 80% capacity | > 95% capacity |
| Request throughput | Per SLA | < 50% baseline | < 25% baseline |

### 4.3 Database Metrics
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Query time (p95) | < 100ms | > 500ms | > 2s |
| Connection pool usage | < 70% | > 85% | > 95% |
| Replication lag | < 1s | > 5s | > 30s |
| Dead tuples ratio | < 10% | > 20% | > 40% |

### 4.4 AI/Ollama Metrics
| Metric | Target | Warning | Critical |
|--------|--------|---------|----------|
| Ollama availability | 100% | Any downtime | Extended downtime |
| Model load time | < 10s | > 30s | > 60s |
| Generation time (fast) | < 5s | > 15s | > 30s |
| Generation time (large) | < 60s | > 120s | > 300s |
| Model error rate | < 1% | > 5% | > 10% |

---

## 5. Alerting Configuration

### 5.1 Alert Severity Levels
| Level | Response Time | Notification Channel |
|-------|-------------|---------------------|
| **P1 Critical** | 15 minutes | SMS + Phone + Email + Slack |
| **P2 High** | 1 hour | Email + Slack |
| **P3 Medium** | 4 hours | Slack |
| **P4 Low** | Next business day | Email digest |

### 5.2 Alert Rules (Prometheus)
```yaml
# Example Prometheus alert rules
groups:
  - name: datacendia-alerts
    rules:
      - alert: HighAPIErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) > 0.05
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "API error rate above 5%"
          
      - alert: DatabaseConnectionFailed
        expr: pg_up == 0
        for: 30s
        labels:
          severity: critical
          
      - alert: OllamaUnavailable
        expr: ollama_available == 0
        for: 5m
        labels:
          severity: high
          
      - alert: DiskSpaceLow
        expr: node_filesystem_avail_bytes / node_filesystem_size_bytes < 0.1
        for: 5m
        labels:
          severity: high
```

---

## 6. Grafana Dashboards

### 6.1 Recommended Dashboards
| Dashboard | Contents |
|-----------|----------|
| **Platform Overview** | All services health, uptime, key metrics |
| **API Performance** | Request rates, latencies, error rates by endpoint |
| **Database Health** | Query performance, connections, replication |
| **AI/Ollama** | Model availability, generation times, error rates |
| **Infrastructure** | CPU, memory, disk, network per container |
| **Business Metrics** | Deliberations/day, active users, IISS scores |

### 6.2 Access
```
URL: http://localhost:3000 (or monitoring.your-domain.com)
Default credentials: admin / admin (change immediately)
```

---

## 7. Daily Health Check Procedure

### 7.1 Morning Check (9 AM)
1. Review overnight alerts
2. Check Grafana dashboards for anomalies
3. Verify all Docker containers running:
   ```bash
   docker compose ps
   ```
4. Check backend health endpoint
5. Review error logs (last 12 hours):
   ```bash
   docker compose logs --since 12h backend | grep -i error
   ```
6. Verify backup completion (see SOP-035)

### 7.2 Weekly Review
1. Review week's alerts and incidents
2. Check disk space trends
3. Review database performance (slow queries)
4. Check AI model response time trends
5. Review security logs for anomalies
6. Update monitoring rules if needed

---

## 8. Incident Escalation

| Condition | Escalation Path |
|-----------|----------------|
| Single service degraded | On-call engineer |
| Multiple services affected | Engineering Lead + On-call |
| Data integrity concern | Engineering Lead + Security Lead |
| Full platform outage | CEO + Engineering Lead + All engineers |
| Security incident | See SOP-008 |

---

## 9. Troubleshooting Quick Reference

| Symptom | Likely Cause | Quick Fix |
|---------|-------------|-----------|
| 502 Bad Gateway | Backend crashed | `docker compose restart backend` |
| Slow API responses | Database connection exhaustion | Check pool; restart if needed |
| Ollama timeout | Model loading / GPU memory | Wait or switch to lighter model |
| Redis connection refused | Redis container down | `docker compose restart redis` |
| High memory usage | Memory leak or large query | Restart affected service; investigate |
| Disk full | Logs or backups accumulating | Rotate logs; clean old backups |

---

## 10. Verified Against

- `backend/src/services/admin/SystemHealthService.ts`: Health check implementation
- `infrastructure/docker-compose.monitoring.yaml`: Prometheus + Grafana stack
- `backend/src/routes/health.ts`: `/api/v1/health` endpoint
- `backend/src/config/index.ts`: Service connection configuration
- `DEPLOYMENT_GUIDE.md`: Monitoring setup instructions
- `src/services/AutoHealService.ts`: AI Tech Team monitoring

---

*Datacendia, LLC — Proprietary and Confidential*
