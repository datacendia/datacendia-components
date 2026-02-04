# Docker Configuration Guide

> Complete documentation for Datacendia's Docker-based deployment.

**Last Updated:** January 28, 2026

---

## Table of Contents

- [Overview](#overview)
- [Quick Start](#quick-start)
- [Architecture](#architecture)
- [Docker Compose Files](#docker-compose-files)
- [Development](#development)
- [Production](#production)
- [Air-Gapped Deployment](#air-gapped-deployment)
- [Services Reference](#services-reference)
- [Troubleshooting](#troubleshooting)

---

## Overview

Datacendia uses Docker for consistent deployment across all environments.

### Docker Compose Files

| File | Use Case | Services |
|------|----------|----------|
| `docker-compose.unified.yml` | **Recommended for development** | All services with profiles |
| `docker-compose.yml` | Basic development | Core only (postgres, redis, neo4j, ollama) |
| `docker-compose.production.yml` | Production deployment | Full stack optimized |
| `infrastructure/docker-compose.sovereign.yml` | Sovereign/air-gapped | Enterprise infrastructure |

### ⚠️ Important: Use Unified Compose

The project has multiple docker-compose files that can conflict. **Use `docker-compose.unified.yml`** for development to avoid:
- Port conflicts (multiple Redis on 6380)
- Network isolation issues (services can't see each other)
- Missing databases (Keycloak/Unleash need their DBs created)

---

## Quick Start

### Core Services Only (Minimal)

```bash
# Start just postgres, redis, neo4j, ollama
docker-compose -f docker-compose.unified.yml --profile core up -d

# Run frontend/backend locally
npm run dev              # Frontend at http://localhost:5173
cd backend && npm run dev # Backend at http://localhost:3001
```

### Full Sovereign Stack

```bash
# Start everything (requires 64GB+ RAM)
docker-compose -f docker-compose.unified.yml up -d

# Or use profiles for selective startup
docker-compose -f docker-compose.unified.yml --profile core --profile sovereign up -d
docker-compose -f docker-compose.unified.yml --profile observability up -d
docker-compose -f docker-compose.unified.yml --profile security up -d
```

### Verify Services

```bash
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
```

---

## Architecture

### Unified Network: `datacendia-unified`

All services run on a single Docker network for proper service discovery.

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        DATACENDIA UNIFIED STACK                              │
├─────────────────────────────────────────────────────────────────────────────┤
│  APPLICATION LAYER                                                           │
│  ┌──────────────┐  ┌──────────────┐                                         │
│  │   Frontend   │  │   Backend    │                                         │
│  │  Port 5173   │  │  Port 3001   │                                         │
│  └──────────────┘  └──────────────┘                                         │
├─────────────────────────────────────────────────────────────────────────────┤
│  CORE SERVICES (profile: core)                                               │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  PostgreSQL  │ │    Redis     │ │    Neo4j     │ │    Ollama    │        │
│  │  Port 5433   │ │  Port 6380   │ │  Port 7474   │ │  Port 11434  │        │
│  │  + pgvector  │ │  + BullMQ    │ │  Port 7687   │ │  Local LLM   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────────────────────┤
│  SOVEREIGN SERVICES (profile: sovereign)                                     │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │ Apache Druid │ │  ClickHouse  │ │    MinIO     │ │ Meilisearch  │        │
│  │  Port 8888   │ │  Port 8123   │ │  Port 9000   │ │  Port 7700   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   Keycloak   │ │   Unleash    │ │     n8n      │ │    Tika      │        │
│  │  Port 8180   │ │  Port 4242   │ │  Port 5678   │ │  Port 9998   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────────────────────┤
│  OBSERVABILITY (profile: observability)                                      │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │  Prometheus  │ │    Loki      │ │   Grafana    │ │    Tempo     │        │
│  │  Port 9090   │ │  Port 3100   │ │  Port 3002   │ │  Port 3200   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
├─────────────────────────────────────────────────────────────────────────────┤
│  SECURITY (profile: security)                                                │
│  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐        │
│  │   Wazuh      │ │  Infisical   │ │   Step-CA    │ │ Vaultwarden  │        │
│  │  Port 55000  │ │  Port 8090   │ │  Port 9002   │ │  Port 8005   │        │
│  └──────────────┘ └──────────────┘ └──────────────┘ └──────────────┘        │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Docker Files

### `Dockerfile` (Frontend Production)

Multi-stage build that:
1. Installs dependencies
2. Builds the React app with Vite
3. Serves static files via Nginx

```dockerfile
# Stage 1: Build
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2: Serve
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY docker/nginx.conf /etc/nginx/nginx.conf
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]
```

### `docker/nginx.conf`

Nginx configuration for:
- SPA routing (fallback to index.html)
- Gzip compression
- Security headers
- API proxy (if needed)

### `backend/Dockerfile`

Node.js backend with:
- Production dependencies only
- Prisma client generation
- Health check endpoint

---

## Development

### Start Development Environment

```bash
# Start all services
docker compose up

# Start only infrastructure (DB, Redis, etc.)
docker compose up postgres redis neo4j ollama -d

# Run frontend locally (hot reload)
npm run dev

# Run backend locally (hot reload)
cd backend && npm run dev
```

### Development URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:3001 |
| Neo4j Browser | http://localhost:7474 |
| Ollama API | http://localhost:11434 |

### View Logs

```bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f api

# Last 100 lines
docker compose logs --tail=100 postgres
```

---

## Production

### Build Production Images

```bash
# Frontend
docker build -t datacendia/frontend:1.0.0 .

# Backend
docker build -t datacendia/backend:1.0.0 ./backend
```

### Deploy Production Stack

```bash
# Configure environment
cp .env.example .env
# Edit .env with production values

# Start all services
docker compose -f docker-compose.production.yml up -d

# Run migrations
docker compose -f docker-compose.production.yml exec backend npx prisma migrate deploy

# Check status
docker compose -f docker-compose.production.yml ps
```

### SSL/TLS Configuration

1. Place certificates in `nginx/ssl/`:
   - `cert.pem` - Certificate chain
   - `key.pem` - Private key

2. Update `nginx/nginx.conf` for HTTPS

3. Restart frontend:
   ```bash
   docker compose -f docker-compose.production.yml restart frontend
   ```

---

## Air-Gapped Deployment

For networks with no internet access. See [AIRGAPPED_DEPLOYMENT.md](AIRGAPPED_DEPLOYMENT.md).

### Quick Summary

**1. Build Package (on internet-connected machine):**

```powershell
.\scripts\build-airgapped-package.ps1 -Version "1.0.0" -IncludeModels
```

**2. Transfer to Target:**
- USB drive, secure file transfer, or physical media
- Package size: 5-25GB depending on included models

**3. Install on Target:**

```bash
# Load images
./scripts/install.sh

# Configure
cp config/.env.template config/.env
nano config/.env

# Start
docker compose -f config/docker-compose.yml up -d
```

---

## Services Reference

### PostgreSQL

| Property | Value |
|----------|-------|
| Image | `postgres:16-alpine` |
| Port | 5432 |
| User | `datacendia` |
| Database | `datacendia` |
| Volume | `postgres_data` |

```bash
# Connect to database
docker compose exec postgres psql -U datacendia -d datacendia

# Backup
docker compose exec postgres pg_dump -U datacendia datacendia > backup.sql

# Restore
docker compose exec -T postgres psql -U datacendia datacendia < backup.sql
```

### Redis

| Property | Value |
|----------|-------|
| Image | `redis:7-alpine` |
| Port | 6379 |
| Persistence | AOF enabled |
| Volume | `redis_data` |

```bash
# Connect to Redis CLI
docker compose exec redis redis-cli

# Check memory usage
docker compose exec redis redis-cli INFO memory
```

### Neo4j

| Property | Value |
|----------|-------|
| Image | `neo4j:5-community` |
| HTTP Port | 7474 |
| Bolt Port | 7687 |
| User | `neo4j` |
| Volume | `neo4j_data` |

```bash
# Access browser: http://localhost:7474

# Backup
docker compose exec neo4j neo4j-admin database dump --database=neo4j --to-path=/backups
```

### Ollama (Local LLM)

| Property | Value |
|----------|-------|
| Image | `ollama/ollama:latest` |
| Port | 11434 |
| Volume | `ollama_data` |
| GPU | NVIDIA (optional) |

```bash
# Pull a model
docker compose exec ollama ollama pull llama3.1:8b

# List models
docker compose exec ollama ollama list

# Test model
docker compose exec ollama ollama run llama3.1:8b "Hello, world"
```

---

## Resource Requirements

### Minimum (Development)

| Resource | Requirement |
|----------|-------------|
| CPU | 4 cores |
| RAM | 8 GB |
| Disk | 50 GB |
| GPU | Not required |

### Recommended (Production)

| Resource | Requirement |
|----------|-------------|
| CPU | 16+ cores |
| RAM | 64 GB |
| Disk | 500 GB NVMe |
| GPU | NVIDIA RTX 3090+ or A100 |

### Per-Service Limits

Defined in `docker-compose.production.yml`:

| Service | CPU Limit | Memory Limit |
|---------|-----------|--------------|
| Frontend | 1 core | 512 MB |
| Backend | 4 cores | 8 GB |
| PostgreSQL | 4 cores | 16 GB |
| Redis | 2 cores | 4 GB |
| Neo4j | 4 cores | 16 GB |
| Ollama | unlimited | 64 GB |

---

## Troubleshooting

### Container Won't Start

```bash
# Check logs
docker compose logs [service_name]

# Check if port is in use
netstat -tulpn | grep [port]

# Check disk space
df -h
```

### Database Connection Failed

```bash
# Test PostgreSQL connection
docker compose exec postgres pg_isready -U datacendia

# Check environment variables
docker compose exec backend env | grep DATABASE
```

### Out of Memory

```bash
# Check container stats
docker stats

# Increase memory limits in docker-compose.yml
# Or reduce Ollama model size
```

### GPU Not Detected (Ollama)

```bash
# Check NVIDIA driver
nvidia-smi

# Check Docker GPU support
docker run --rm --gpus all nvidia/cuda:12.0-base nvidia-smi

# If no GPU, comment out the deploy section in docker-compose.yml
```

### Slow Performance

1. Check if volumes are on SSD
2. Increase PostgreSQL shared_buffers
3. Increase Redis maxmemory
4. Use smaller LLM model

---

## Networking

Default network: `datacendia-network` (bridge mode)

### Internal Service Discovery

Services communicate via container names:
- `postgres:5432`
- `redis:6379`
- `neo4j:7687`
- `ollama:11434`

### Exposing Only Necessary Ports

For production, only expose:
- Port 80/443 (frontend/nginx)
- Port 3001 (API, if needed externally)

All database ports should be internal only.

---

## Security Hardening

### Production Checklist

- [ ] Change all default passwords
- [ ] Use secrets management (Vault)
- [ ] Enable TLS/SSL
- [ ] Restrict exposed ports
- [ ] Enable rate limiting
- [ ] Configure firewall rules
- [ ] Set up log aggregation
- [ ] Enable container security scanning

### Non-Root Containers

All production containers run as non-root users:
- Frontend: `datacendia` (UID 1001)
- Backend: `node` (UID 1000)

---

## Maintenance

### Updates

```bash
# Pull latest images
docker compose pull

# Rebuild custom images
docker compose build --no-cache

# Restart with new images
docker compose up -d

# Clean up old images
docker image prune -f
```

### Backups

```bash
# Full backup script
./scripts/backup.sh

# Backup PostgreSQL
docker compose exec postgres pg_dump -U datacendia datacendia | gzip > backup-$(date +%Y%m%d).sql.gz

# Backup volumes
docker run --rm -v datacendia_postgres_data:/data -v $(pwd):/backup alpine tar czf /backup/postgres-data.tar.gz -C /data .
```

---

## Related Documentation

- [DEPLOYMENT.md](../DEPLOYMENT.md) - General deployment guide
- [AIRGAPPED_DEPLOYMENT.md](AIRGAPPED_DEPLOYMENT.md) - Offline deployment
- [SECURITY-AUDIT.md](SECURITY-AUDIT.md) - Security review
