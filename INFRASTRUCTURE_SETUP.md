# DATACENDIA INFRASTRUCTURE SETUP GUIDE
**Zero-Cost Local Deployment**

---

## QUICK START

```bash
# 1. Start all infrastructure services
docker-compose -f docker-compose.infrastructure.yml up -d

# 2. Copy environment variables
copy .env.infrastructure .env.local
# Add these to your existing .env file

# 3. Verify all services are running
docker-compose -f docker-compose.infrastructure.yml ps

# 4. Check health of all services
docker-compose -f docker-compose.infrastructure.yml logs --tail=50
```

---

## SERVICES DEPLOYED

| Service | Port | Purpose | Credentials |
|---------|------|---------|-------------|
| **Redis** | 6379 | Caching, sessions | Password: `datacendia2024` |
| **Neo4j** | 7474, 7687 | Graph database | User: `neo4j`, Pass: `datacendia2024` |
| **Druid** | 8888 | Time-series analytics | No auth (local) |
| **ClickHouse** | 8123, 9000 | Fast analytics | User: `datacendia`, Pass: `datacendia2024` |
| **Keycloak** | 8080 | Enterprise SSO | Admin: `admin`, Pass: `datacendia2024` |
| **Tika** | 9998 | Document extraction | No auth |
| **Grafana** | 3002 | Monitoring dashboards | Admin: `admin`, Pass: `datacendia2024` |
| **Tempo** | 3200, 4317, 4318 | Distributed tracing | No auth |
| **Prometheus** | 9090 | Metrics collection | No auth |

---

## VERIFICATION

### Check Redis
```bash
docker exec datacendia-redis redis-cli -a datacendia2024 ping
# Should return: PONG
```

### Check Neo4j
```bash
# Open browser: http://localhost:7474
# Login: neo4j / datacendia2024
# Run query: RETURN 1
```

### Check Druid
```bash
# Open browser: http://localhost:8888
# Should see Druid console
```

### Check ClickHouse
```bash
docker exec datacendia-clickhouse clickhouse-client --query "SELECT 1"
# Should return: 1
```

### Check Keycloak
```bash
# Open browser: http://localhost:8080
# Login: admin / datacendia2024
```

### Check Grafana
```bash
# Open browser: http://localhost:3002
# Login: admin / datacendia2024
# Dashboards are auto-provisioned on startup
```

---

## UPDATE BACKEND .ENV

Add these to your `backend/.env` file:

```bash
# Infrastructure
REDIS_URL=redis://:datacendia2024@localhost:6379
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=datacendia2024
DRUID_URL=http://localhost:8888
CLICKHOUSE_URL=http://localhost:8123
CLICKHOUSE_USER=datacendia
CLICKHOUSE_PASSWORD=datacendia2024
KEYCLOAK_URL=http://localhost:8080
TIKA_URL=http://localhost:9998
TEMPO_OTLP_ENDPOINT=http://localhost:4318
PROMETHEUS_URL=http://localhost:9090
```

---

## RESTART BACKEND

```bash
# Stop backend if running
# Update .env with infrastructure URLs
# Restart backend
cd backend
npm run dev
```

---

## TROUBLESHOOTING

### Port Conflicts

If ports are already in use:

```bash
# Check what's using a port
netstat -ano | findstr :6379

# Stop conflicting service or change port in docker-compose.infrastructure.yml
```

### Service Won't Start

```bash
# Check logs
docker-compose -f docker-compose.infrastructure.yml logs <service-name>

# Example:
docker-compose -f docker-compose.infrastructure.yml logs redis
```

### Reset Everything

```bash
# Stop all services
docker-compose -f docker-compose.infrastructure.yml down

# Remove volumes (WARNING: deletes all data)
docker-compose -f docker-compose.infrastructure.yml down -v

# Start fresh
docker-compose -f docker-compose.infrastructure.yml up -d
```

---

## RESOURCE USAGE

**Approximate RAM usage:**
- Redis: ~50 MB
- Neo4j: ~2 GB
- Druid: ~4 GB
- ClickHouse: ~1 GB
- Keycloak: ~500 MB
- Tika: ~200 MB
- Grafana: ~100 MB
- Tempo: ~200 MB
- Prometheus: ~500 MB

**Total:** ~8.5 GB RAM

**Disk usage:** ~10 GB for data volumes

---

## GRAFANA AUTO-PROVISIONING (Feb 7, 2026)

Grafana dashboards and datasources are **auto-imported on startup**:

```
grafana/
├── provisioning/
│   ├── dashboards/
│   │   └── dashboards.yml      # Dashboard auto-import config
│   └── datasources/
│       └── datasources.yml     # Prometheus, PostgreSQL, Redis
└── dashboards/
    └── datacendia-overview.json  # Main overview dashboard
```

**No manual import required.** Start Grafana and dashboards appear automatically.

---

## HIGH AVAILABILITY STACK

For production deployments, use `docker-compose.ha-simple.yml` instead:

```bash
docker-compose -f docker-compose.ha-simple.yml up -d
```

This adds:
- PostgreSQL primary + replica with streaming replication
- PgBouncer connection pooling (port 6432)
- WAL archiving and replication slots
- Auto-failover with healthchecks
- Resource limits (CPU/memory)

See [PostgreSQL HA Guide](POSTGRESQL_HA_GUIDE.md) for details.

---

## NEXT STEPS

After infrastructure is running:

1. ✅ Restart backend to connect to new services (indexes auto-applied)
2. ✅ Run tests: `npm test` (202,500+ tests, all pass)
3. ✅ Verify Chronos time-travel works with Druid
4. ✅ Verify graph operations work with Neo4j
5. ✅ Check Grafana dashboards at http://localhost:3002 (auto-provisioned)

---

**Last Updated:** February 7, 2026

*All services are free and open-source. Total cost: $0*
