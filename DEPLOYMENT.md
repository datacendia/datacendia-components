# 🚀 Datacendia Platform - Deployment Guide

## Quick Reference

| Environment | Command |
|-------------|---------|
| **Development** | `docker compose up` |
| **Production** | `docker compose -f docker-compose.prod.yml up -d` |

---

## 📋 Prerequisites

- **Docker** 24.0+ with Docker Compose v2
- **Node.js** 20+ (for local development)
- **8GB RAM minimum** (16GB recommended for Ollama)
- **50GB disk space** (for models and data)

---

## 🏃 Quick Start (Development)

### Option 1: Docker (Recommended)

```bash
# 1. Clone and enter directory
cd datacendia-components

# 2. Copy environment template
cp .env.example .env

# 3. Start everything
docker compose up

# 4. Access the platform
# Frontend: http://localhost:5173
# API: http://localhost:3001
# Neo4j: http://localhost:7474
```

### Option 2: Local Development

```bash
# 1. Start infrastructure only
docker compose up postgres redis neo4j ollama -d

# 2. Wait for services to be healthy
docker compose ps

# 3. Setup backend
cd backend
npm install
npx prisma migrate dev
npm run dev

# 4. Setup frontend (new terminal)
cd ..
npm install
npm run dev
```

---

## 🏭 Production Deployment

### Step 1: Configure Environment

```bash
# Copy and edit environment file
cp .env.example .env
nano .env
```

**Critical settings to change:**
- `POSTGRES_PASSWORD` - Strong database password
- `REDIS_PASSWORD` - Strong cache password
- `NEO4J_PASSWORD` - Strong graph database password
- `JWT_SECRET` - Generate with `openssl rand -base64 64`
- `JWT_REFRESH_SECRET` - Generate another secret
- `ENCRYPTION_KEY` - Generate with `openssl rand -base64 32`
- `CORS_ORIGIN` - Your frontend domain

### Step 2: SSL Certificates

```bash
# Using Let's Encrypt (recommended)
certbot certonly --standalone -d app.datacendia.com -d api.datacendia.com

# Copy certificates
mkdir -p deploy/ssl
cp /etc/letsencrypt/live/datacendia.com/fullchain.pem deploy/ssl/
cp /etc/letsencrypt/live/datacendia.com/privkey.pem deploy/ssl/
```

### Step 3: Deploy

```bash
# Build and start production
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Run migrations
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy

# Check status
docker compose -f docker-compose.prod.yml ps
```

### Step 4: Verify

```bash
# Check health
curl https://api.datacendia.com/health

# Check logs
docker compose -f docker-compose.prod.yml logs -f api
```

---

## 🌐 Cloud Deployment Options

### Railway (Easiest)

1. Connect GitHub repo to Railway
2. Add PostgreSQL and Redis services
3. Set environment variables
4. Deploy

### AWS (Most Flexible)

| Service | Use For |
|---------|---------|
| ECS/Fargate | Container hosting |
| RDS PostgreSQL | Database |
| ElastiCache Redis | Caching |
| Neptune or Neo4j Aura | Graph database |
| ALB | Load balancing |
| Route 53 | DNS |
| ACM | SSL certificates |

### DigitalOcean (Good Balance)

1. Create Kubernetes cluster or Droplet
2. Use Managed PostgreSQL
3. Use Managed Redis
4. Deploy with docker-compose or k8s

---

## 📊 Resource Requirements

| Environment | CPU | RAM | Disk |
|-------------|-----|-----|------|
| **Development** | 4 cores | 8GB | 50GB |
| **Staging** | 4 cores | 16GB | 100GB |
| **Production** | 8+ cores | 32GB+ | 500GB+ |

### Per-Service Recommendations

| Service | CPU | RAM |
|---------|-----|-----|
| API (per replica) | 1 core | 1GB |
| Frontend (per replica) | 0.5 core | 256MB |
| PostgreSQL | 2 cores | 4GB |
| Redis | 1 core | 1GB |
| Neo4j | 2 cores | 4GB |
| Ollama | 4 cores | 8GB |

---

## 🔒 Security Checklist

- [ ] All passwords changed from defaults
- [ ] SSL certificates installed
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Firewall rules configured
- [ ] Database not exposed publicly
- [ ] Secrets in environment variables (not code)
- [ ] Regular backups configured

---

## 🔄 Maintenance

### Backups

```bash
# PostgreSQL backup
docker compose exec postgres pg_dump -U datacendia datacendia > backup.sql

# Neo4j backup
docker compose exec neo4j neo4j-admin database dump --database=neo4j --to-path=/backups

# Redis backup (automatic with AOF enabled)
```

### Updates

```bash
# Pull latest changes
git pull

# Rebuild and redeploy
docker compose -f docker-compose.prod.yml build
docker compose -f docker-compose.prod.yml up -d

# Run new migrations
docker compose -f docker-compose.prod.yml exec api npx prisma migrate deploy
```

### Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api

# Last 100 lines
docker compose logs --tail=100 api
```

---

## 🐛 Troubleshooting

### Container won't start

```bash
# Check logs
docker compose logs [service_name]

# Check resource usage
docker stats
```

### Database connection issues

```bash
# Test connection
docker compose exec postgres psql -U datacendia -d datacendia -c "SELECT 1"

# Check if port is in use
lsof -i :5432
```

### API 500 errors

```bash
# Check API logs
docker compose logs -f api

# Verify environment variables
docker compose exec api env | grep DATABASE
```

---

## 📞 Support

- **Documentation**: https://docs.datacendia.com
- **Issues**: https://github.com/datacendia/platform/issues
- **Email**: support@datacendia.com
