# Datacendia Quick Reference

> Copy-paste commands for common operations.

---

## 🚀 Starting Services

```bash
# Development (full stack with Docker)
docker compose up

# Development (infrastructure only, run app locally)
docker compose up postgres redis neo4j ollama -d
npm run dev        # Frontend
npm run dev:backend # Backend

# Production
docker compose -f docker-compose.production.yml up -d
```

---

## 🛠️ Building

```bash
# Frontend only
npm run build

# Docker images
docker build -t datacendia/frontend:latest .
docker build -t datacendia/backend:latest ./backend

# Air-gapped package (Windows PowerShell)
.\scripts\build-airgapped-package.ps1 -Version "1.0.0"
.\scripts\build-airgapped-package.ps1 -Version "1.0.0" -IncludeModels  # With LLMs
```

---

## 🗄️ Database

```bash
# Connect to PostgreSQL
docker compose exec postgres psql -U datacendia -d datacendia

# Run migrations
npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

# Backup database
docker compose exec postgres pg_dump -U datacendia datacendia > backup.sql

# Restore database
docker compose exec -T postgres psql -U datacendia datacendia < backup.sql
```

---

## 🧠 Ollama (Local LLM)

```bash
# Pull a model
docker compose exec ollama ollama pull llama3.1:8b

# List models
docker compose exec ollama ollama list

# Run model interactively
docker compose exec ollama ollama run llama3.1:8b

# Check API
curl http://localhost:11434/api/tags
```

---

## 📊 Monitoring

```bash
# Container stats (CPU, memory)
docker stats

# View logs (all services)
docker compose logs -f

# View logs (specific service)
docker compose logs -f api

# Health check
curl http://localhost:3001/health
```

---

## 🧪 Testing

```bash
# All tests
npm run test:all

# Frontend tests
npm run test

# Backend tests
npm run test:backend

# E2E tests
npm run test:e2e

# Type check
npm run typecheck:all

# Lint
npm run lint:all
```

---

## 🔄 Updates & Maintenance

```bash
# Update dependencies
npm update

# Rebuild Docker images
docker compose build --no-cache

# Restart services
docker compose restart

# Clean up unused Docker resources
docker system prune -f
docker image prune -f
docker volume prune -f  # ⚠️ Deletes unused volumes!
```

---

## 🔒 Security

```bash
# Generate secrets
openssl rand -base64 64  # JWT_SECRET
openssl rand -base64 32  # ENCRYPTION_KEY

# Check for vulnerabilities
npm audit
docker scout cves datacendia/frontend:latest
```

---

## 📁 Key Files

| File | Purpose |
|------|---------|
| `docker-compose.yml` | Development stack |
| `docker-compose.production.yml` | Production stack |
| `Dockerfile` | Frontend production build |
| `backend/Dockerfile` | Backend production build |
| `docker/nginx.conf` | Nginx configuration |
| `.env.example` | Environment template |
| `prisma/schema.prisma` | Database schema |

---

## 🌐 Default URLs

| Service | Development | Production |
|---------|-------------|------------|
| Frontend | http://localhost:5173 | https://your-domain.com |
| API | http://localhost:3001 | https://your-domain.com/api |
| Neo4j Browser | http://localhost:7474 | Internal only |
| Grafana | http://localhost:3000 | Internal only |
| Prometheus | http://localhost:9090 | Internal only |

---

## 🆘 Troubleshooting

```bash
# Container won't start - check logs
docker compose logs [service-name]

# Port already in use
lsof -i :[port]  # Linux/Mac
netstat -ano | findstr :[port]  # Windows

# Database connection issues
docker compose exec postgres pg_isready -U datacendia

# Reset everything (⚠️ destroys data)
docker compose down -v
docker compose up -d
```
