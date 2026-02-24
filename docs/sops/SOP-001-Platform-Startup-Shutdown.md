# SOP-001: Platform Startup & Shutdown

**Category:** Operations
**Priority:** Critical
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against codebase)

---

## 1. Purpose

Define the standard procedure for starting and stopping the Datacendia Cortex platform in development, demo, pilot, and production environments.

---

## 2. Scope

Applies to all environments: Development (`main`), Demo (`demo`), Pilot (`pilot`), Production (`production`).

---

## 3. Prerequisites

| Requirement | Version | Verification Command |
|-------------|---------|---------------------|
| Node.js | 18+ | `node --version` |
| Docker Desktop | Latest | `docker --version` |
| PostgreSQL | 15+ | Via Docker or `psql --version` |
| Redis | 7+ | Via Docker or `redis-cli --version` |
| Neo4j | 5+ | Via Docker |
| Ollama | Latest | `ollama --version` |

---

## 4. Development Startup

### 4.1 Full Stack (Recommended)
```bash
# From project root: c:\Users\Stu\Documents\datacendia-components\datacendia-components
npm run dev:all
```
This runs `concurrently "npm run dev" "npm run dev:backend"`:
- **Frontend (Vite):** http://localhost:5173
- **Backend (Express):** http://localhost:3001

### 4.2 Infrastructure Services First
```bash
# Start PostgreSQL, Redis, Neo4j via Docker
docker-compose -f docker-compose.dev.yml up -d

# Then start application
npm run dev:all
```

### 4.3 Full Stack with Docker Infrastructure
```bash
npm run start:all
# Runs: docker-compose up postgres redis + npm run dev:all
```

### 4.4 Individual Components
```bash
# Frontend only
npm run dev

# Backend only
npm run dev:backend

# Ollama (separate terminal)
ollama serve
```

### 4.5 Startup Verification Checklist
- [ ] Frontend loads at http://localhost:5173
- [ ] Backend health check: `curl http://localhost:3001/api/v1/health`
- [ ] PostgreSQL connected (check backend logs for Prisma queries)
- [ ] Redis connected (check backend logs)
- [ ] Neo4j connected (check backend logs for "Connected to Neo4j")
- [ ] Ollama available: `curl http://localhost:11434/api/tags`

---

## 5. Platform Shutdown

### 5.1 Development
```bash
# If running via npm run dev:all — press Ctrl+C in terminal

# Kill any orphaned node processes (Windows PowerShell)
Get-Process -Name "node" -ErrorAction SilentlyContinue | Stop-Process -Force

# Stop Docker infrastructure
docker-compose -f docker-compose.dev.yml down
```

### 5.2 Production
```bash
# Graceful shutdown
docker compose down

# With infrastructure
docker compose -f infrastructure/docker-compose.sovereign.yml down
```

---

## 6. Environment-Specific Notes

| Environment | Branch | Auth Mode | Start Command |
|-------------|--------|-----------|---------------|
| Development | `main` | devAuth bypass (no login) | `npm run dev:all` |
| Demo | `demo` | Real JWT login | `npm run start:dev` with `.env.demo` |
| Pilot | `pilot` | Real JWT login | `npm run start:dev` with `.env.pilot` |
| Production | `production` | JWT + Keycloak SSO | `docker compose up -d` |

---

## 7. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Port 5173 in use | Another Vite instance | `npx kill-port 5173` |
| Port 3001 in use | Another backend instance | `npx kill-port 3001` |
| Prisma connection failed | PostgreSQL not running | Start Docker: `docker-compose -f docker-compose.dev.yml up -d` |
| Redis connection refused | Redis not running or wrong port | Check port 6380 (not default 6379) |
| Neo4j connection failed | Neo4j not running | Check Docker container status |

---

## 8. Verified Against

- `package.json` scripts: `dev`, `dev:backend`, `dev:all`, `start:dev`, `start:all`
- `vite.config.ts`: proxy `/api` → `http://127.0.0.1:3001`
- `backend/src/config/index.ts`: port 3001, Redis port 6380
- `docker-compose.dev.yml`: infrastructure services

---

*Datacendia, LLC — Proprietary and Confidential*
