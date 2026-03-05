# Railway Deployment — Seed Instructions

## Environment Variables (Railway Dashboard)

Set these in your Railway service settings:

```env
NODE_ENV=production
PORT=3001
DATACENDIA_LICENSE_TIER=sovereign
INFERENCE_PROVIDER=openai
OPENAI_API_KEY=sk-... (your key)

# Database — Railway provisions this automatically if using Railway Postgres
DATABASE_URL=postgresql://... (Railway provides this)

# Redis — Railway provisions this automatically if using Railway Redis
REDIS_URL=redis://... (Railway provides this)

# JWT
JWT_SECRET=<generate a 64-char random string>
JWT_REFRESH_SECRET=<generate a different 64-char random string>

# CORS — add your Railway app URL
CORS_ORIGINS=https://your-app.up.railway.app,http://localhost:5173

# Demo mode
DEMO_MODE=true
REQUIRE_AUTH=false

# Logging
LOG_LEVEL=info
```

## Step 1: Deploy to Railway

```bash
# Push to Railway (assumes Railway CLI installed and linked)
railway up
```

Or connect the GitHub repo in the Railway dashboard and deploy from the `main` branch.

## Step 2: Push Database Schema

```bash
railway run npx prisma db push
```

Or via the Railway shell:
```bash
npx prisma db push
```

## Step 3: Generate Prisma Client

```bash
railway run npx prisma generate
```

## Step 4: Run FEPCMAC Demo Seed

```bash
railway run npx tsx prisma/seed-fepcmac-demo.ts
```

Expected output:
```
Creando organización...
  ✓ Organización creada: CMAC Cusco S.A.
Creando usuarios...
  ✓ 6 usuarios creados
Creando agentes del Consejo...
  ✓ 6 agentes creados
...
✓ FEPCMAC DEMO CREADO CON ÉXITO
```

## Step 5: Verify Login

Test with curl or browser:

```bash
curl -X POST https://your-app.up.railway.app/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"jorge.mendoza@cmac-cusco.demo","password":"demo-password-2024"}'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJ...",
    "user": {
      "id": "user-cumplimiento-jorge",
      "email": "jorge.mendoza@cmac-cusco.demo",
      "name": "Jorge Mendoza Vargas",
      "role": "ADMIN",
      "organizationId": "demo-fepcmac",
      "organization": {
        "name": "CMAC Cusco S.A."
      }
    }
  }
}
```

## Demo Users

| User | Email | Role |
|---|---|---|
| Carlos Quispe Huamán | carlos.quispe@cmac-cusco.demo | Gerente General |
| María Flores Chávez | maria.flores@cmac-cusco.demo | Jefa de Riesgos |
| **Jorge Mendoza Vargas** | **jorge.mendoza@cmac-cusco.demo** | **Oficial de Cumplimiento** |
| Rosa Huamán Paredes | rosa.huaman@cmac-cusco.demo | Jefa de Créditos |
| Luis Chávez Rojas | luis.chavez@cmac-cusco.demo | Jefe de Tecnología |
| Patricia Ramos Condori | patricia.ramos@cmac-cusco.demo | Analista |

**Password (all users):** `demo-password-2024`

## Troubleshooting

- **"Invalid environment variables"** → Check DATABASE_URL and JWT_SECRET are set in Railway
- **Login returns 401** → Re-run the seed script (Step 4)
- **Empty deliberations** → Seed didn't run — check Step 4 output for errors
- **CORS errors in browser** → Add your Railway URL to CORS_ORIGINS
