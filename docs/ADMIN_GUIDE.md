# DATACENDIA ADMIN GUIDE
**System Administration and Configuration**

---

## WHAT ADMINS DO

As a Datacendia administrator, you:
- Deploy and configure the platform
- Manage users and permissions
- Monitor system health
- Connect to enterprise systems
- Backup and maintain the database

---

## INSTALLATION

### Prerequisites
- Node.js 20.x or higher
- PostgreSQL 15 or higher
- Docker (for infrastructure)
- 8GB+ RAM
- 20GB+ disk space

### Step 1: Clone Repository
```bash
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components
```

### Step 2: Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
```

### Step 3: Setup Database
```bash
# Start PostgreSQL (if using Docker)
docker-compose up -d postgres

# Run database migrations
cd backend
npx prisma db push

# Seed initial data
npx prisma db seed
```

### Step 4: Configure Environment
```bash
# Copy environment template
cp .env.example .env

# Edit .env with your settings:
# - DATABASE_URL
# - JWT_SECRET
# - OLLAMA_HOST
# etc.
```

### Step 5: Start Services
```bash
# Start backend (terminal 1)
cd backend
npm run dev

# Start frontend (terminal 2)
npm run dev
```

**Platform will be available at:** http://localhost:5173

---

## INFRASTRUCTURE DEPLOYMENT

### Deploy All Infrastructure Services
```bash
# Start Redis, Neo4j, Druid, ClickHouse, Keycloak, Tika, Grafana, Tempo, Prometheus
docker-compose -f docker-compose.infrastructure.yml up -d

# Verify all services running
docker-compose -f docker-compose.infrastructure.yml ps

# Check logs
docker-compose -f docker-compose.infrastructure.yml logs --tail=50
```

### Update .env with Infrastructure URLs
```bash
# Add to backend/.env:
REDIS_URL=redis://:datacendia2024@localhost:6379
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=datacendia2024
DRUID_URL=http://localhost:8888
CLICKHOUSE_URL=http://localhost:8123
KEYCLOAK_URL=http://localhost:8080
TIKA_URL=http://localhost:9998
```

### Access Infrastructure Services
- **Neo4j Browser:** http://localhost:7474 (neo4j / datacendia2024)
- **Grafana:** http://localhost:3000 (admin / datacendia2024)
- **Keycloak:** http://localhost:8080 (admin / datacendia2024)
- **Druid Console:** http://localhost:8888
- **Prometheus:** http://localhost:9090

---

## USER MANAGEMENT

### Create New User
```bash
# Via Prisma Studio
npx prisma studio

# Or via API
POST /api/v1/admin/users
{
  "email": "user@company.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "ANALYST"
}
```

### User Roles
- **OWNER** - Full access (Stuart Rainey)
- **SUPER_ADMIN** - Platform administration
- **ADMIN** - Organization administration
- **ANALYST** - Create deliberations, view decisions
- **OPERATOR** - Execute workflows
- **VIEWER** - Read-only access

### Reset User Password
```bash
# Via Prisma Studio
npx prisma studio
# Navigate to users table
# Update password_hash field (use bcrypt)
```

---

## ENTERPRISE CONNECTOR SETUP

### Salesforce
1. Create Connected App in Salesforce
2. Get Client ID and Client Secret
3. Add to .env:
```bash
SALESFORCE_CLIENT_ID=your_client_id
SALESFORCE_CLIENT_SECRET=your_client_secret
SALESFORCE_REDIRECT_URI=http://localhost:3001/api/v1/enterprise-connectors/salesforce/oauth/callback
```

### Slack
1. Create Slack App at api.slack.com
2. Enable OAuth & Permissions
3. Add to .env:
```bash
SLACK_CLIENT_ID=your_client_id
SLACK_CLIENT_SECRET=your_client_secret
SLACK_REDIRECT_URI=http://localhost:3001/api/v1/enterprise-connectors/slack/oauth/callback
```

### Jira
1. Create OAuth 2.0 app in Atlassian Developer Console
2. Add to .env:
```bash
JIRA_CLIENT_ID=your_client_id
JIRA_CLIENT_SECRET=your_client_secret
JIRA_REDIRECT_URI=http://localhost:3001/api/v1/enterprise-connectors/jira/oauth/callback
```

**Repeat for:** GitHub, MS Teams, ServiceNow, HubSpot, SAP, Oracle, Workday

---

## MONITORING

### Health Checks
```bash
# System health
curl http://localhost:3001/api/v1/health

# Prometheus metrics
curl http://localhost:3001/metrics
```

### Grafana Dashboards
1. Open http://localhost:3000
2. Login: admin / datacendia2024
3. Import dashboards from `infrastructure/grafana/dashboards/`

### View Logs
```bash
# Backend logs
cd backend
npm run dev
# Logs appear in console

# Infrastructure logs
docker-compose -f docker-compose.infrastructure.yml logs -f
```

---

## BACKUP & RESTORE

### Backup Database
```bash
# PostgreSQL backup
docker exec datacendia-postgres pg_dump -U cendia datacendia > backup_$(date +%Y%m%d).sql

# Or if running locally
pg_dump -U cendia datacendia > backup_$(date +%Y%m%d).sql
```

### Restore Database
```bash
# Stop backend first
docker exec -i datacendia-postgres psql -U cendia datacendia < backup_20260125.sql
```

### Backup MinIO (Evidence Vault)
```bash
# MinIO data is in Docker volume
docker run --rm -v datacendia_minio-data:/data -v $(pwd):/backup alpine tar czf /backup/minio_backup.tar.gz /data
```

---

## PERFORMANCE TUNING

### Enable Redis Caching
```bash
# Ensure Redis is running
docker-compose -f docker-compose.infrastructure.yml up -d redis

# Add to .env
REDIS_URL=redis://:datacendia2024@localhost:6379

# Restart backend
```

### Database Optimization
```bash
# Create indexes for common queries
cd backend
npx prisma studio
# Run SQL:
CREATE INDEX idx_decisions_org ON decisions(organization_id);
CREATE INDEX idx_deliberations_status ON deliberations(status);
CREATE INDEX idx_alerts_org_status ON alerts(organization_id, status);
```

### Enable Neo4j for Graph Features
```bash
# Ensure Neo4j is running
docker-compose -f docker-compose.infrastructure.yml up -d neo4j

# Add to .env
NEO4J_URI=bolt://localhost:7687
NEO4J_USER=neo4j
NEO4J_PASSWORD=datacendia2024

# Restart backend
```

---

## SECURITY

### Change Default Passwords
```bash
# Update in .env:
JWT_SECRET=your-very-long-random-secret-key-here
DATABASE_PASSWORD=your-secure-password

# Update in docker-compose.infrastructure.yml:
# - Redis password
# - Neo4j password
# - ClickHouse password
# - Grafana password
# - Keycloak password
```

### Enable HTTPS
```bash
# Use reverse proxy (Nginx or Caddy)
# Example Nginx config:
server {
    listen 443 ssl;
    server_name datacendia.yourcompany.com;
    
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
    
    location / {
        proxy_pass http://localhost:5173;
    }
    
    location /api {
        proxy_pass http://localhost:3001;
    }
}
```

### Rate Limiting
```bash
# Edit backend/src/index.ts
# Change rate limit values:
max: 100  // requests per minute
```

---

## TROUBLESHOOTING

### Backend Won't Start
```
Error: connect ECONNREFUSED ::1:5434
```
**Fix:** Start PostgreSQL first
```bash
docker-compose up -d postgres
```

### Frontend Build Fails
```
Error: Cannot find module '@mui/material'
```
**Fix:** Reinstall dependencies
```bash
rm -rf node_modules package-lock.json
npm install
```

### Tests Failing
```
207 tests failed
```
**Fix:** Tests require running backend
```bash
# Start backend in one terminal
cd backend && npm run dev

# Run tests in another terminal
cd backend && npm test
```

### High Memory Usage
**Fix:** Limit Ollama models
```bash
# In .env:
OLLAMA_MODELS=llama3.2:3b,qwen2.5:7b
# Remove larger models
```

---

## MAINTENANCE

### Weekly Tasks
- [ ] Check system health: `curl http://localhost:3001/api/v1/health`
- [ ] Review error logs
- [ ] Backup database
- [ ] Check disk space

### Monthly Tasks
- [ ] Update dependencies: `npm update`
- [ ] Review security advisories: `npm audit`
- [ ] Archive old decisions
- [ ] Review user access

### Quarterly Tasks
- [ ] Load testing with k6
- [ ] Security scan
- [ ] Performance optimization
- [ ] Documentation updates

---

## SCALING

### For 100+ Users
1. Deploy Redis for caching
2. Enable database connection pooling
3. Use load balancer (HAProxy/Nginx)
4. Scale backend horizontally

### For 1000+ Users
1. Deploy PostgreSQL cluster (Patroni)
2. Use Kubernetes for auto-scaling
3. Deploy multi-region
4. Use CDN for static assets

---

## SUPPORT

**Documentation:** 
- User Guide: `docs/USER_GUIDE.md`
- API Documentation: `docs/API_DOCUMENTATION.md`
- Infrastructure Setup: `INFRASTRUCTURE_SETUP.md`

**Health Checks:**
- Backend: http://localhost:3001/health
- Frontend: http://localhost:5173

**Logs:**
- Backend: Console output
- Database: `docker-compose logs postgres`
- Infrastructure: `docker-compose -f docker-compose.infrastructure.yml logs`

---

*For technical details, see INFRASTRUCTURE_SETUP.md and ZERO_COST_ROADMAP.md*
