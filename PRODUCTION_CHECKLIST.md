# Datacendia Production Deployment Checklist

## Pre-Deployment

### Infrastructure
- [x] PostgreSQL database provisioned and configured
- [x] Redis instance connected (CacheService with automatic fallback to in-memory)
- [ ] MinIO/S3 storage configured for file uploads
- [ ] Ollama instance running with required models
- [ ] SSL certificates configured
- [ ] DNS records configured
- [ ] Load balancer configured (if applicable)

### High Availability (Optional)
- [x] PostgreSQL HA with primary/replica (`docker-compose.ha-simple.yml`)
- [x] PgBouncer connection pooling configured
- [x] WAL archiving and replication slots enabled
- [x] Auto-failover with healthchecks
- [x] Resource limits and restart policies set

### Environment Variables
```bash
# Required
DATABASE_URL=postgresql://user:pass@host:5432/datacendia
NODE_ENV=production
JWT_SECRET=<secure-random-string>
ENCRYPTION_KEY=<32-byte-hex-key>

# Ollama
OLLAMA_URL=http://ollama:11434
OLLAMA_MODEL=llama3.1:70b

# Optional Services
REDIS_URL=redis://redis:6379
MINIO_ENDPOINT=minio:9000
MINIO_ACCESS_KEY=<key>
MINIO_SECRET_KEY=<secret>

# KMS (choose provider)
KMS_PROVIDER=local|aws-kms|hashicorp-vault|azure-keyvault
```

### Security
- [ ] All secrets stored in secure vault (not in code)
- [ ] API rate limiting configured
- [ ] CORS origins restricted to production domains
- [ ] Security headers enabled (helmet.js)
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] XSS prevention enabled

### Database
- [ ] Run `npx prisma migrate deploy`
- [ ] Verify all tables created
- [x] Performance indexes auto-applied on startup (`backend/src/startup/applyIndexes.ts`)
- [ ] Seed initial data if needed
- [ ] Create database backups schedule
- [x] Connection pooling via PgBouncer (HA stack)

## Deployment Steps

### 1. Build
```bash
# Frontend
npm ci
npm run build

# Backend
cd backend
npm ci
npm run build
```

### 2. Database Migration
```bash
cd backend
npx prisma migrate deploy
npx prisma generate
```

### 3. Start Services
```bash
# Using Docker Compose
docker-compose -f docker-compose.prod.yml up -d

# Or using PM2
pm2 start ecosystem.config.js --env production
```

### 4. Verify Health
```bash
# Check all status endpoints
curl http://localhost:3000/api/v1/health
curl http://localhost:3000/api/v1/council/status
curl http://localhost:3000/api/v1/crucible/status
curl http://localhost:3000/api/v1/panopticon/status
curl http://localhost:3000/api/v1/scheduler/status
curl http://localhost:3000/metrics
```

## Post-Deployment

### Monitoring
- [x] Prometheus scraping `/metrics` endpoint
- [x] Grafana dashboards auto-provisioned on startup
- [x] Datasources auto-configured (Prometheus, PostgreSQL, Redis)
- [ ] Alert rules configured for:
  - [ ] High error rate (>1%)
  - [ ] High latency (p95 > 2s)
  - [ ] Low success rate (<99%)
  - [ ] Database connection failures
  - [ ] Memory usage >80%

### Logging
- [ ] Structured JSON logging enabled
- [ ] Log aggregation configured (ELK/Loki)
- [ ] Log retention policy set
- [ ] Sensitive data redaction verified

### Backup & Recovery
- [ ] Database backup schedule (daily minimum)
- [ ] Backup retention policy (30 days minimum)
- [ ] Recovery procedure documented
- [ ] Recovery tested within last 30 days

## Service Status Endpoints

| Service | Endpoint | Purpose |
|---------|----------|---------|
| Health | `/api/v1/health` | Overall API health |
| Council | `/api/v1/council/status` | AI Deliberation Engine |
| Crucible | `/api/v1/crucible/status` | Simulation Engine |
| Panopticon | `/api/v1/panopticon/status` | Regulation Engine |
| Aegis | `/api/v1/aegis/status` | Defense Intelligence |
| Eternal | `/api/v1/eternal/status` | Long Horizon Archive |
| Symbiont | `/api/v1/symbiont/status` | Ecosystem Engine |
| Vox | `/api/v1/vox/status` | Stakeholder Voice |
| Decision Intel | `/api/v1/decision-intel/status` | Decision Intelligence |
| Scheduler | `/api/v1/scheduler/status` | Job Scheduler |
| Lens | `/api/v1/lens/status` | AI Interpretability |
| Apotheosis | `/api/v1/apotheosis/status` | Red-Teaming |
| Dissent | `/api/v1/dissent/status` | Protected Disagreement |
| KMS | `/api/v1/kms/status` | Key Management |
| Evidence | `/api/v1/evidence/status` | Evidence Vault |
| Echo | `/api/v1/echo/status` | Decision Tracking |
| Gnosis | `/api/v1/gnosis/status` | Knowledge Extraction |
| OmniTranslate | `/api/v1/omnitranslate/status` | Translation Service |
| Horizon | `/api/v1/horizon/status` | Strategic Forecasting |
| Prometheus | `/metrics` | System Metrics |

## Rollback Procedure

1. Stop new deployments
2. Restore previous Docker image/build
3. If database migration needed:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```
4. Restart services
5. Verify health endpoints
6. Notify stakeholders

## Emergency Contacts

- **On-Call Engineer**: [Configure in PagerDuty/Opsgenie]
- **Database Admin**: [Contact]
- **Security Team**: [Contact]

## Compliance

- [ ] GDPR data handling verified
- [ ] SOC2 controls in place
- [ ] Audit logging enabled
- [ ] Data retention policies configured
- [ ] Right to deletion implemented

---

**Last Updated**: February 7, 2026
**Version**: 4.6.0
