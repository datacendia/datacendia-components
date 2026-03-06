# Enterprise Deployment & Operations Runbook

**Version:** 1.0  
**Last Updated:** March 2026  
**Audience:** Enterprise customers, DevOps, platform engineers

---

## 1. Deployment Modes

| Mode | Compose File | Use Case |
|------|-------------|----------|
| **Development** | `docker-compose.dev.yml` | Local development with hot-reload |
| **Demo** | `docker-compose.demo.yml` | Sales demos, POCs |
| **Production (single-node)** | `docker-compose.production.yml` | Single-server enterprise deployment |
| **HA (simple)** | `deploy/docker/docker-compose.ha-simple.yml` | Basic high-availability |
| **HA (full)** | `deploy/docker/docker-compose.ha.yml` | Full high-availability with replicas |
| **Sovereign** | `infrastructure/docker-compose.sovereign.yml` | Air-gapped / sovereign deployments |
| **Monitoring** | `infrastructure/docker-compose.monitoring.yaml` | Observability stack add-on |

## 2. Service Architecture

### Core Services (Required)

| Service | Image | Port | Purpose | Resources |
|---------|-------|------|---------|-----------|
| **Frontend** | `datacendia/frontend` | 80, 443 | Nginx + React SPA | 512M RAM |
| **Backend** | `datacendia/backend` | 3001 | Express API server | 2-8G RAM |
| **PostgreSQL 16** | `postgres:16-alpine` | 5432 | Primary database | 4-16G RAM |
| **Redis 7** | `redis:7-alpine` | 6379 | Cache, sessions, pub/sub | 1-4G RAM |
| **Neo4j 5** | `neo4j:5-enterprise` | 7474, 7687 | Knowledge graph | 4-16G RAM |
| **Ollama** | `ollama/ollama` | 11434 | Local LLM inference | 64G+ RAM, GPU |

### Optional Services

| Service | Image | Port | Purpose | Enable With |
|---------|-------|------|---------|-------------|
| **Qdrant** | `qdrant/qdrant` | 6333 | Vector search | Always included |
| **Vault** | `hashicorp/vault` | 8200 | Secrets management | `VAULT_TOKEN` |
| **OTel Collector** | `otel/opentelemetry-collector-contrib` | 4317, 4318 | Telemetry | `TRACING_ENABLED=true` |
| **Prometheus** | `prom/prometheus` | 9090 | Metrics | Monitoring stack |
| **Grafana** | `grafana/grafana` | 3000 | Dashboards | Monitoring stack |
| **Jaeger** | `jaegertracing/all-in-one` | 16686 | Distributed tracing | Monitoring stack |
| **Kafka** | Apache Kafka | 9092 | Event streaming | `KAFKA_ENABLED=true` |
| **Temporal** | Temporal.io | 7233 | Workflow orchestration | `TEMPORAL_ENABLED=true` |
| **OPA** | Open Policy Agent | 8181 | Policy engine | `OPA_ENABLED=true` |
| **NeMo Guardrails** | NVIDIA NeMo | 8080 | AI guardrails | `NEMO_GUARDRAILS_ENABLED=true` |

## 3. Pre-Deployment Checklist

### Secrets (MUST change before production)

```bash
# Generate all secrets
openssl rand -base64 64  # JWT_SECRET
openssl rand -base64 64  # JWT_REFRESH_SECRET
openssl rand -base64 32  # ENCRYPTION_KEY
openssl rand -hex 32     # AUDIT_SIGNING_KEY
openssl rand -base64 32  # MFA_ENCRYPTION_KEY
openssl rand -base64 32  # SESSION_SECRET
```

| Secret | Default Value | Action Required |
|--------|--------------|-----------------|
| `DB_PASSWORD` / `POSTGRES_PASSWORD` | `CHANGE_ME...` | Generate strong password |
| `REDIS_PASSWORD` | `CHANGE_ME...` | Generate strong password |
| `NEO4J_PASSWORD` | `CHANGE_ME...` | Generate strong password |
| `JWT_SECRET` | `CHANGE_ME...` | `openssl rand -base64 64` |
| `JWT_REFRESH_SECRET` | `CHANGE_ME...` | `openssl rand -base64 64` |
| `ENCRYPTION_KEY` | `CHANGE_ME...` | `openssl rand -base64 32` |
| `AUDIT_SIGNING_KEY` | `CHANGE_ME...` | `openssl rand -hex 32` |
| `GRAFANA_PASSWORD` | none | Set admin password |
| `VAULT_TOKEN` | none | Initialize Vault properly |

### Environment

```bash
# Copy and configure
cp .env.example .env
# Edit .env with production values — NEVER commit .env

# Required production settings
NODE_ENV=production
REQUIRE_AUTH=true       # Server refuses to start without this
DEMO_MODE=false
DISABLE_CSRF=false
```

### Infrastructure Requirements

| Deployment | CPU | RAM | Storage | GPU |
|-----------|-----|-----|---------|-----|
| **Minimum** (demo) | 4 cores | 16 GB | 50 GB SSD | Optional |
| **Recommended** (production) | 16 cores | 64 GB | 500 GB NVMe | 1x NVIDIA (24GB+ VRAM) |
| **Enterprise** (HA) | 32+ cores | 128 GB | 1 TB NVMe | 2x NVIDIA A100/H100 |

## 4. Deployment Steps

### Single-Node Production

```bash
# 1. Clone and configure
git clone <enterprise-repo-url>
cd datacendia-components
cp .env.example .env
# Edit .env with production secrets

# 2. Build
docker compose -f docker-compose.production.yml build

# 3. Start infrastructure first
docker compose -f docker-compose.production.yml up -d postgres redis neo4j ollama qdrant

# 4. Wait for healthy databases
docker compose -f docker-compose.production.yml ps  # Check health status

# 5. Run database migrations
docker compose -f docker-compose.production.yml exec backend npx prisma migrate deploy

# 6. Start application
docker compose -f docker-compose.production.yml up -d

# 7. Verify
curl http://localhost:3001/health
curl http://localhost/health
```

### Air-Gapped / Sovereign

```bash
# 1. On internet-connected build machine:
docker compose -f docker-compose.production.yml build
docker save datacendia/frontend datacendia/backend > datacendia-images.tar

# 2. Transfer to air-gapped host via approved media

# 3. On air-gapped host:
docker load < datacendia-images.tar

# 4. Pull LLM models on connected machine, transfer:
ollama pull qwen3:32b
# Copy ~/.ollama/models to USB/approved media

# 5. Configure .env with OLLAMA_BASE_URL=http://ollama:11434
# 6. Start with sovereign compose
docker compose -f infrastructure/docker-compose.sovereign.yml up -d
```

## 5. Authentication & SSO

### Auth Modes

| Mode | Config | Use Case |
|------|--------|----------|
| **JWT (built-in)** | `REQUIRE_AUTH=true` | Default for all deployments |
| **Keycloak SSO** | `KEYCLOAK_URL`, `KEYCLOAK_REALM`, etc. | Enterprise SSO (OIDC/SAML) |
| **SAML** | `SAML_ENTITY_ID`, `SAML_ACS_URL` | Legacy SSO integration |
| **GitHub OAuth** | `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | Developer-facing deployments |

### Keycloak Setup

1. Deploy Keycloak (customer-managed or included)
2. Create realm `datacendia` (or custom)
3. Create client `cendia-api` with bearer-only mode
4. Map roles: `admin`, `analyst`, `operator`, `auditor`, `council-member`, `veto-authority`, `viewer`
5. Set environment variables:
   ```
   KEYCLOAK_URL=https://keycloak.customer.com
   KEYCLOAK_REALM=datacendia
   KEYCLOAK_CLIENT_ID=cendia-api
   KEYCLOAK_CLIENT_SECRET=<client-secret>
   ```

## 6. Key Management (KMS)

| Provider | Config | Use Case |
|----------|--------|----------|
| **Local file** | `KMS_PROVIDER=local`, `LOCAL_KEY_PATH=./keys` | Development, air-gapped |
| **AWS KMS** | `AWS_KMS_KEY_ID`, `AWS_REGION` | AWS cloud deployments |
| **Azure Key Vault** | `AZURE_KEYVAULT_URL`, `AZURE_TENANT_ID` | Azure deployments |
| **HashiCorp Vault** | `VAULT_ADDR`, `VAULT_TOKEN` | Multi-cloud, on-prem |
| **OpenBao** | `OPENBAO_ADDR`, `OPENBAO_ENABLED=true` | Open-source Vault alternative |

## 7. Backup & Disaster Recovery

### Configuration

```env
BACKUP_ENABLED=true
BACKUP_SCHEDULE_CRON=0 2 * * *      # Daily at 2 AM
BACKUP_RETENTION_DAYS=30
BACKUP_ENCRYPTION_KEY=<generated>
BACKUP_S3_BUCKET=datacendia-backups  # Optional: S3-compatible storage
```

### What Gets Backed Up

| Component | Method | Schedule |
|-----------|--------|----------|
| PostgreSQL | `pg_dump` (full + WAL) | Daily full, continuous WAL |
| Redis | RDB snapshot + AOF | Continuous (appendonly yes) |
| Neo4j | `neo4j-admin dump` | Daily |
| Evidence ledger | File copy from `EVIDENCE_LEDGER_PATH` | Daily |
| Configuration | `.env` backup (encrypted) | On change |

### Recovery

```bash
# PostgreSQL restore
docker compose exec postgres pg_restore -U datacendia -d datacendia /backup/latest.dump

# Full platform recovery
docker compose down
# Restore volumes from backup
docker compose up -d
docker compose exec backend npx prisma migrate deploy
```

## 8. Monitoring & Observability

### Health Endpoints

| Endpoint | Purpose | Expected Response |
|----------|---------|-------------------|
| `GET /health` | Liveness probe | `{"status":"healthy"}` |
| `GET /liveness` | K8s liveness | `OK` (200) |
| `GET /readiness` | K8s readiness | `OK` (200) |
| `GET /metrics` | Prometheus metrics | Prometheus text format |

### Monitoring Stack

```bash
# Add monitoring to existing deployment
docker compose -f infrastructure/docker-compose.monitoring.yaml up -d

# Access:
# Grafana: http://localhost:3000 (admin / $GRAFANA_PASSWORD)
# Prometheus: http://localhost:9090
# Jaeger: http://localhost:16686
```

### Key Metrics to Monitor

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| API latency p99 | > 2s | Scale backend, check DB |
| Error rate | > 1% | Check logs, recent deploys |
| DB connections | > 80% pool | Increase pool or scale |
| Redis memory | > 80% max | Increase maxmemory |
| Ollama response time | > 30s | Check model size, GPU |
| Disk usage | > 80% | Expand storage, prune logs |

## 9. Tenant Management

### Creating Tenants

Tenants are created via the Admin API or Admin UI at `/admin/tenants`.

### Tenant Isolation

- **Auth layer**: JWT contains `organizationId`; verified on every request
- **Data layer**: All queries scoped by `organization_id`
- **Cache layer**: Keys prefixed with `org:{id}:`
- **Middleware**: `tenantIsolation.ts` provides `requireOrgScope`, `verifyOrgOwnership`, `orgWhere`

### Subscription Tiers

| Tier | Config Key | Features |
|------|-----------|----------|
| Trial | `trial` | Core Council, limited agents |
| Foundation | `foundation` | Full Council, DCII, evidence |
| Enterprise | `enterprise` | + sovereign, SSO, enterprise services |
| Strategic | `strategic` | + all modules, custom SLA |

Set per tenant: `DATACENDIA_LICENSE_TIER=enterprise`

## 10. Security Hardening

### Production Checklist

- [ ] `REQUIRE_AUTH=true` (server won't start without it)
- [ ] `DEMO_MODE=false`
- [ ] `DISABLE_CSRF=false`
- [ ] All `CHANGE_ME` secrets replaced
- [ ] SSL certificates configured in `deploy/ssl/`
- [ ] `CORS_ORIGINS` restricted to actual frontend domain
- [ ] Database ports not exposed to public network
- [ ] Vault/OpenBao initialized with production tokens
- [ ] Backup encryption key set and stored securely off-host
- [ ] Monitoring alerts configured

### Network Security

```
Internet → Nginx (443) → Backend (3001, internal only)
                        → PostgreSQL (5432, internal only)
                        → Redis (6379, internal only)
                        → Neo4j (7687, internal only)
                        → Ollama (11434, internal only)
```

Only ports 80/443 should be exposed to the internet. All database and service ports should be on the internal Docker network only.

## 11. Troubleshooting

| Issue | Check | Fix |
|-------|-------|-----|
| Server won't start | `REQUIRE_AUTH` not set | Set `REQUIRE_AUTH=true` |
| 401 on all requests | JWT_SECRET mismatch | Ensure same secret across restarts |
| Database connection failed | PostgreSQL health | `docker compose ps`, check logs |
| Ollama not responding | Model not pulled | `docker compose exec ollama ollama pull qwen3:32b` |
| High memory usage | Ollama model too large | Use smaller model or add GPU |
| CSRF errors | Frontend/backend domain mismatch | Check `CORS_ORIGINS` |
| Slow Council responses | LLM inference bottleneck | Add GPU, use faster model |

## 12. Support Boundaries

| Area | Datacendia Responsibility | Customer Responsibility |
|------|--------------------------|------------------------|
| Application code | Bug fixes, security patches | Applying updates |
| Infrastructure | Compose files, Dockerfiles | Hosting, networking |
| Databases | Schema migrations | Backups, recovery, scaling |
| Identity (SSO) | Keycloak integration | IdP configuration, user provisioning |
| Secrets | Vault/OpenBao integration | Key generation, rotation |
| LLM models | Inference provider abstraction | Model selection, GPU provisioning |
| Monitoring | Metrics export, health checks | Alert configuration, dashboards |
