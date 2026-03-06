# Railway Deployment Guide — Datacendia Platform

Deploy the full Datacendia platform (frontend + backend) on Railway.

## Architecture

Railway runs a **single container** that serves both:
- **Frontend** — React SPA served via `express.static` at `/`
- **Backend** — Express API at `/api/v1/*`, health at `/health`

External managed services:
- **PostgreSQL** — Railway-managed (primary database, 190 Prisma models)
- **Redis** — Railway-managed (caching, sessions, rate limiting)
- **AI Inference** — Cloud LLM provider (OpenAI or Anthropic) since Railway has no GPU

## Prerequisites

- Railway account ([railway.app](https://railway.app)) — Pro plan ($20/mo) for always-on
- OpenAI or Anthropic API key (for AI features)
- `datacendia-components` repo accessible to Railway

## Step 1: Create Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub Repo"**
3. Select `datacendia/datacendia-components`
4. Railway detects `railway.json` → uses `Dockerfile.railway`

## Step 2: Add Database Services

In your Railway project dashboard, click **"+ New"**:

### PostgreSQL
- Click **"Database"** → **PostgreSQL**
- Railway auto-provisions and sets `DATABASE_URL`

### Redis
- Click **"Database"** → **Redis**
- Railway auto-provisions and sets `REDIS_URL`

**Link both services** to your main deploy so the env vars are shared automatically.

## Step 3: Set Environment Variables

In your main service → **Variables**:

```env
# ─── Required ───────────────────────────────────────────────
NODE_ENV=production
PORT=3001

# Database (auto-populated when PostgreSQL service is linked)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Redis (auto-populated when Redis service is linked)
REDIS_URL=${{Redis.REDIS_URL}}

# Authentication (generate with: node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
JWT_SECRET=<64-char-hex-string>
JWT_REFRESH_SECRET=<64-char-hex-string>
AUDIT_SIGNING_KEY=<64-char-hex-string>
GATEWAY_SIGNING_KEY=<64-char-hex-string>

# ─── AI Inference (pick ONE) ────────────────────────────────
# Option A: OpenAI
INFERENCE_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_DEFAULT_MODEL=gpt-4o

# Option B: Anthropic
# INFERENCE_PROVIDER=anthropic
# ANTHROPIC_API_KEY=sk-ant-...
# ANTHROPIC_DEFAULT_MODEL=claude-3-5-sonnet-20241022

# ─── Optional ──────────────────────────────────────────────
CORS_ORIGINS=https://app.datacendia.com,https://datacendia.com
```

## Step 4: Run Database Migrations

After first deploy, open the Railway service shell:

```bash
cd backend
npx prisma db push
```

Or via Railway CLI:
```bash
railway run --service datacendia -- npx prisma db push --schema backend/prisma/schema
```

## Step 5: Seed Demo Data (Optional)

```bash
cd backend
npx tsx prisma/seed-fepcmac-demo.ts
```

## Step 6: Custom Domain

1. Service → **Settings** → **Networking**
2. Click **"Generate Domain"** (gives `*.up.railway.app`)
3. Or **"Custom Domain"** → add `app.datacendia.com`
4. DNS: CNAME `app` → `<service>.up.railway.app`

## Step 7: Verify

```bash
# Health check
curl https://app.datacendia.com/health

# API health
curl https://app.datacendia.com/api/v1/gateway/health

# Frontend loads
curl -s https://app.datacendia.com/ | head -1
# Should return: <!DOCTYPE html>
```

## Cost Estimate

| Service | Estimated Monthly Cost |
|---------|----------------------|
| App container (always-on, 1GB RAM) | ~$10-15 |
| PostgreSQL (1GB) | ~$5 |
| Redis (256MB) | ~$5 |
| OpenAI API (demo usage) | ~$5-20 |
| **Total** | **~$25-45/mo** |

## Inference Provider Options

| Provider | Env Var | Best For | Cost |
|----------|---------|----------|------|
| **OpenAI** | `INFERENCE_PROVIDER=openai` | Highest quality, fastest setup | ~$0.01/request |
| **Anthropic** | `INFERENCE_PROVIDER=anthropic` | Best reasoning, Claude 3.5 | ~$0.01/request |
| **Ollama** (self-hosted) | `INFERENCE_PROVIDER=ollama` | Sovereign/air-gapped, zero API cost | Requires GPU VPS |

For sovereign deployments, run Ollama on a separate GPU VPS and set:
```env
INFERENCE_PROVIDER=ollama
OLLAMA_BASE_URL=http://<your-gpu-vps>:11434
```

## Alternative: Self-Hosted (Docker Compose)

```bash
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components

# Dev stack (PostgreSQL + Redis + Ollama + MinIO + ClamAV + ClickHouse)
docker compose -f docker-compose.dev.yml up -d

# Full sovereign stack (20+ services, 128GB RAM recommended)
docker compose -f infrastructure/docker-compose.sovereign.yml up -d
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `railway.json` points to `Dockerfile.railway` |
| DB connection fails | Verify PostgreSQL service is **linked** (not just added) |
| Health check fails | Ensure `PORT` env var matches (default: 3001) |
| CORS errors | Add your domain to `CORS_ORIGINS` env var |
| AI returns empty | Check `INFERENCE_PROVIDER` and API key are set |
| Frontend 404 | Frontend dist must be built in Docker stage — check build logs |
| Prisma errors | Run `npx prisma db push` in the Railway shell after first deploy |
