# Railway Deployment Guide — Datacendia Hosted Demo

Deploy `app.datacendia.com` on Railway in under 15 minutes.

## Prerequisites

- Railway account ([railway.app](https://railway.app)) — sign in with GitHub
- Railway Pro plan ($20/mo) — required for always-on services
- `datacendia-components` repo accessible to Railway

## Step 1: Create Project

1. Go to [railway.app/new](https://railway.app/new)
2. Click **"Deploy from GitHub Repo"**
3. Select `datacendia/datacendia-components`
4. Railway will detect the `railway.json` config automatically

## Step 2: Add Database Services

In your Railway project dashboard, click **"+ New"** and add:

### PostgreSQL
- Click **"Database"** → **PostgreSQL**
- Railway provisions it automatically
- Copy the `DATABASE_URL` from the service variables

### Redis
- Click **"Database"** → **Redis**
- Copy the `REDIS_URL` from the service variables

## Step 3: Set Environment Variables

In your main service (the GitHub deploy), go to **Variables** and add:

```env
# Database (auto-populated if you link the PostgreSQL service)
DATABASE_URL=postgresql://...

# Redis (auto-populated if you link the Redis service)
REDIS_URL=redis://...

# Authentication
JWT_SECRET=<generate-a-64-char-random-string>
JWT_REFRESH_SECRET=<generate-another-64-char-random-string>

# Server
NODE_ENV=production
PORT=3001

# Optional — Ollama (if running local LLM)
OLLAMA_URL=http://localhost:11434

# Optional — Gateway signing key
GATEWAY_SIGNING_KEY=<generate-a-64-char-random-string>
AUDIT_SIGNING_KEY=<generate-a-64-char-random-string>
```

**Generate secrets with:**
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

## Step 4: Run Database Migrations

In the Railway service shell (or via `railway run`):

```bash
cd backend
npx prisma db push
```

## Step 5: Custom Domain

1. In Railway, go to your service → **Settings** → **Networking**
2. Click **"Generate Domain"** (gives you `*.up.railway.app`)
3. Or click **"Custom Domain"** and add `app.datacendia.com`
4. In Namecheap DNS, add a CNAME record:
   - Host: `app`
   - Value: `<your-service>.up.railway.app`
   - TTL: Automatic

## Step 6: Verify

```bash
# Health check
curl https://app.datacendia.com/health

# API status
curl https://app.datacendia.com/api/v1/gateway/health
```

## Cost Estimate

| Service | Estimated Monthly Cost |
|---------|----------------------|
| API (always-on) | ~$10-15 |
| PostgreSQL | ~$5 |
| Redis | ~$5 |
| **Total** | **~$20-25/mo** |

## Alternative: Docker Compose (Self-Hosted)

If you prefer self-hosting instead of Railway:

```bash
# Clone and start
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components
docker compose -f docker-compose.production.yml up -d

# Run migrations
docker compose exec api npx prisma db push
```

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Build fails | Check `railway.json` points to correct Dockerfile |
| DB connection fails | Verify `DATABASE_URL` is set and PostgreSQL service is linked |
| Health check fails | Ensure `PORT` env var matches the exposed port |
| CORS errors | Add your domain to `CORS_ORIGINS` env var |
