# SOP-002: Environment Configuration

**Category:** Operations
**Priority:** Critical
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/index.ts`)

---

## 1. Purpose

Define the standard procedure for configuring environment variables across all Datacendia platform environments.

---

## 2. Required Environment Variables

### 2.1 Core Configuration (All Environments)

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `NODE_ENV` | Environment mode | `development` | Yes |
| `PORT` | Backend API port | `3001` | No |
| `REQUIRE_AUTH` | Enable JWT authentication | `false` | Yes (prod) |
| `DEMO_MODE` | Enable demo mode restrictions | `false` | No |

### 2.2 Database

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/datacendia` | Yes |

### 2.3 Redis

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `REDIS_URL` | Full Redis URL | Auto-constructed | No |
| `REDIS_HOST` | Redis hostname | `localhost` | No |
| `REDIS_PORT` | Redis port | `6380` | No |
| `REDIS_PASSWORD` | Redis password | `datacendia_redis_2024` | No |

**Note:** If `REDIS_URL` is not set, it is auto-constructed as: `redis://:${REDIS_PASSWORD}@${REDIS_HOST}:${REDIS_PORT}`

### 2.4 Neo4j

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `NEO4J_URI` | Neo4j bolt URI | `bolt://localhost:7687` | Yes |
| `NEO4J_USER` | Neo4j username | `neo4j` | Yes |
| `NEO4J_PASSWORD` | Neo4j password | (secret) | Yes |

### 2.5 Ollama (AI Models)

| Variable | Description | Default |
|----------|-------------|---------|
| `OLLAMA_BASE_URL` | Ollama API endpoint | `http://127.0.0.1:11434` |
| `OLLAMA_MODEL` | Default model | `qwen3:32b` |
| `OLLAMA_MODEL_FLAGSHIP` | Large reasoning model | `llama3.3:70b` |
| `OLLAMA_MODEL_FAST` | Fast inference model | `llama3.2:3b` |

**8-Slot Model Architecture (hardcoded defaults in config):**
| Slot | Purpose | Default Model |
|------|---------|---------------|
| Default | General purpose | `qwen3:32b` |
| Large | Complex reasoning | `llama3.3:70b` |
| Reasoning | Deep analysis | `deepseek-r1:32b` |
| Coder | Code generation | `qwen3-coder:30b` |
| Fast | Quick responses | `llama3.2:3b` |
| Vision | Image analysis | `qwen3-vl:30b` |

### 2.6 JWT Authentication

| Variable | Description | Default | Required |
|----------|-------------|---------|----------|
| `JWT_SECRET` | Access token signing key | — | Yes (min 32 chars) |
| `JWT_REFRESH_SECRET` | Refresh token signing key | — | Yes (min 32 chars) |
| `JWT_EXPIRES_IN` | Access token expiry | `1h` | No |
| `JWT_REFRESH_EXPIRES_IN` | Refresh token expiry | `30d` | No |

### 2.7 CORS & Logging

| Variable | Description | Default |
|----------|-------------|---------|
| `CORS_ORIGINS` | Comma-separated allowed origins | `http://localhost:5173,http://localhost:3000` |
| `LOG_LEVEL` | Logging verbosity | `info` |

---

## 3. Environment Setup by Deployment Type

### 3.1 Development (No `.env` needed — uses defaults)
```bash
# Most defaults work out of the box
# Just ensure Docker services are running for PostgreSQL, Redis, Neo4j
docker-compose -f docker-compose.dev.yml up -d
```

### 3.2 Demo
```bash
cp .env.demo backend/.env
# Key differences:
# REQUIRE_AUTH=true
# DEMO_MODE=true
```

### 3.3 Pilot
```bash
cp .env.pilot backend/.env
# Key differences:
# REQUIRE_AUTH=true
# PILOT_ORGANIZATION_ID=<client-org-id>
# PILOT_EXPIRY_DATE=<date>
```

### 3.4 Production
```bash
cp .env.production backend/.env
# Key differences:
# REQUIRE_AUTH=true
# KEYCLOAK_ENABLED=true
# All secrets generated via: openssl rand -base64 64
```

---

## 4. Secret Generation

```bash
# Generate JWT secrets
openssl rand -base64 64  # → JWT_SECRET
openssl rand -base64 64  # → JWT_REFRESH_SECRET

# Generate Redis password
openssl rand -base64 32  # → REDIS_PASSWORD

# Generate Neo4j password
openssl rand -base64 32  # → NEO4J_PASSWORD
```

---

## 5. Validation

The backend validates all environment variables at startup using Zod schemas (`backend/src/config/index.ts`). If any required variable is missing or invalid, the server will fail to start with a clear error message.

```bash
# Verify config loads correctly
cd backend && npx tsx src/config/index.ts
```

---

## 6. Verified Against

- `backend/src/config/index.ts`: Zod schema with all variables, defaults, and types
- `docker-compose.dev.yml`: Docker service ports and credentials
- `DEPLOYMENT_GUIDE.md`: Environment-specific configurations

---

*Datacendia, LLC — Proprietary and Confidential*
