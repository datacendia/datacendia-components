# SOP-005: Docker Deployment

**Category:** DevOps
**Priority:** High
**Owner:** DevOps Lead
**Last Verified:** 2026-02-22 (against Docker Compose files in project root and `infrastructure/`)

---

## 1. Purpose

Define procedures for deploying and managing Datacendia platform services using Docker containers across all environments.

---

## 2. Docker Compose Files

| File | Purpose | Environment |
|------|---------|-------------|
| `docker-compose.dev.yml` | Development infrastructure (PostgreSQL, Redis, Neo4j) | Development |
| `docker-compose.yml` | Standard application deployment | Staging |
| `docker-compose.production.yml` | Production deployment | Production |
| `docker-compose.prod.yml` | Production (alternative) | Production |
| `docker-compose.prod.local.yml` | Local production testing | Testing |
| `docker-compose.prod.ports-8080-8443.yml` | Production with custom ports | Production |
| `docker-compose.ha.yml` | High Availability deployment | Production HA |
| `docker-compose.ha-simple.yml` | Simplified HA deployment | Production HA |
| `docker-compose.unified.yml` | All-in-one deployment | Demo/Pilot |
| `docker-compose.infrastructure.yml` | Infrastructure only | All |
| `infrastructure/docker-compose.sovereign.yml` | Sovereign stack (air-gapped) | Sovereign |
| `infrastructure/docker-compose.monitoring.yaml` | Monitoring (Prometheus/Grafana) | Production |
| `deploy/docker-compose.smb.yml` | SMB/NAS deployment | Edge |

---

## 3. Development Deployment

### 3.1 Start Infrastructure
```bash
docker-compose -f docker-compose.dev.yml up -d
```

### 3.2 Verify Services
```bash
docker-compose -f docker-compose.dev.yml ps
```

Expected services:
| Service | Port | Health Check |
|---------|------|-------------|
| PostgreSQL | 5432 | `pg_isready -h localhost -p 5432` |
| Redis | 6380 | `redis-cli -p 6380 -a datacendia_redis_2024 ping` |
| Neo4j | 7687 (bolt), 7474 (web) | http://localhost:7474 |

### 3.3 Stop Infrastructure
```bash
docker-compose -f docker-compose.dev.yml down
```

### 3.4 Reset (Remove Volumes)
```bash
docker-compose -f docker-compose.dev.yml down -v
```
**WARNING:** This destroys all database data.

---

## 4. Production Deployment

### 4.1 Pre-Deployment Checklist
- [ ] All secrets generated (`openssl rand -base64 64`)
- [ ] `.env.production` configured and copied to `.env`
- [ ] SSL certificates obtained and configured
- [ ] Keycloak realm created (if SSO enabled)
- [ ] Backup procedures verified
- [ ] Monitoring stack deployed

### 4.2 Deploy Sovereign Stack
```bash
# Start infrastructure (PostgreSQL, Redis, Neo4j, MinIO)
docker compose -f infrastructure/docker-compose.sovereign.yml up -d

# Start application
docker compose -f docker-compose.production.yml up -d
```

### 4.3 Deploy with Monitoring
```bash
# Start monitoring stack
docker compose -f infrastructure/docker-compose.monitoring.yaml up -d

# Grafana: http://localhost:3000
# Prometheus: http://localhost:9090
```

### 4.4 Deploy High Availability
```bash
docker compose -f docker-compose.ha.yml up -d
```

---

## 5. Container Management

### 5.1 View Logs
```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f backend

# Last 100 lines
docker compose logs --tail=100 backend
```

### 5.2 Scale Services
```bash
docker compose -f docker-compose.ha.yml up -d --scale backend=3
```

### 5.3 Restart Service
```bash
docker compose restart backend
```

### 5.4 Update Images
```bash
docker compose pull
docker compose up -d --force-recreate
```

---

## 6. Health Verification

```bash
# Backend health
curl http://localhost:3001/api/v1/health

# PostgreSQL
docker exec datacendia-postgres pg_isready

# Redis
docker exec datacendia-redis redis-cli ping

# Neo4j
curl http://localhost:7474/db/neo4j/tx
```

---

## 7. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Container won't start | Port conflict | Check `docker ps` for port conflicts |
| Database connection refused | Container not ready | Wait for health check or restart |
| Volume permission errors | Docker file ownership | Run `chown -R 1000:1000 ./data` |
| Out of disk space | Large images/volumes | `docker system prune -a` |
| Network unreachable | Docker network issue | `docker network prune` then recreate |

---

## 8. Verified Against

- 13 Docker Compose files in project root and `infrastructure/`
- `docker-compose.dev.yml`: PostgreSQL (5432), Redis (6380), Neo4j (7687/7474)
- `infrastructure/docker-compose.sovereign.yml`: Sovereign deployment stack
- `infrastructure/docker-compose.monitoring.yaml`: Prometheus + Grafana
- `DEPLOYMENT_GUIDE.md`: Production deployment procedures

---

*Datacendia, LLC — Proprietary and Confidential*
