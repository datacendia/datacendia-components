# Datacendia Enterprise Platinum Deployment Guide

## Environment Overview

| Branch | Purpose | Auth Mode | Features |
|--------|---------|-----------|----------|
| `main` | Development | devAuth bypass | All features, no login required |
| `demo` | Client demos | Real JWT login | All features, demo credentials |
| `pilot` | Pilot customers | Real JWT login | Limited features, expiry date |
| `production` | Full deployment | Real JWT + Keycloak SSO | All features, full security |

---

## Quick Start

### Development (main branch)
```bash
git checkout main
npm install
npm run start:dev  # Starts Docker, backend, and frontend
```
- No login required (devAuth bypass active)
- Access at: http://localhost:5173

### Demo Environment
```bash
git checkout demo
cp .env.demo backend/.env
npm run start:dev
```
- **Login required**
- Demo credentials: `admin@datacendia.com` / `DatacendiaAdmin2024!`
- Access at: http://localhost:5173/auth/login

---

## Demo Environment Setup

### Prerequisites
- Docker Desktop running
- Node.js 18+
- PostgreSQL seeded with demo data

### Configuration
1. Switch to demo branch:
   ```bash
   git checkout demo
   ```

2. Copy environment config:
   ```bash
   cp .env.demo backend/.env
   ```

3. Start services:
   ```bash
   npm run start:dev
   ```

4. Access login page:
   - URL: http://localhost:5173/auth/login
   - Email: `admin@datacendia.com`
   - Password: `DatacendiaAdmin2024!`

### Demo Features
- ✅ Real authentication required
- ✅ 8 pre-configured data sources
- ✅ All Cortex features enabled
- ✅ Sample compliance data
- ❌ Data deletion disabled
- ❌ User creation disabled

---

## Pilot Environment Setup

### Prerequisites
- Client infrastructure access
- Database credentials from client
- Pilot agreement with feature scope

### Configuration
1. Switch to pilot branch:
   ```bash
   git checkout pilot
   ```

2. Generate secrets:
   ```bash
   # JWT secrets
   openssl rand -base64 64  # Use for JWT_SECRET
   openssl rand -base64 64  # Use for JWT_REFRESH_SECRET
   ```

3. Update `.env.pilot` with client credentials:
   ```env
   DATABASE_URL=postgresql://client_user:password@client-db:5432/datacendia
   PILOT_ORGANIZATION_ID=<client-org-id>
   PILOT_ORGANIZATION_NAME=<Client Company Name>
   PILOT_EXPIRY_DATE=2025-06-30
   ```

4. Copy to backend:
   ```bash
   cp .env.pilot backend/.env
   ```

5. Run database migrations:
   ```bash
   cd backend
   npx prisma migrate deploy
   npx prisma db seed
   ```

### Pilot Limits
- Max 25 users
- Max 10 data sources
- Expiry date enforcement
- Feature flags per agreement

---

## Production Deployment

### Security Checklist
- [ ] Generate all secrets using `openssl rand -base64 64`
- [ ] Configure SSL/TLS certificates
- [ ] Set up Keycloak realm and clients
- [ ] Configure backup and disaster recovery
- [ ] Enable audit logging
- [ ] Set up monitoring alerts
- [ ] Configure firewall rules
- [ ] Enable rate limiting
- [ ] Set up intrusion detection

### Infrastructure Requirements
| Service | Minimum Specs | Recommended |
|---------|---------------|-------------|
| PostgreSQL | 4 vCPU, 16GB RAM | 8 vCPU, 32GB RAM |
| Redis | 2 vCPU, 4GB RAM | 4 vCPU, 8GB RAM |
| Neo4j | 4 vCPU, 16GB RAM | 8 vCPU, 32GB RAM |
| Backend API | 2 vCPU, 4GB RAM | 4 vCPU, 8GB RAM |
| Frontend | Static hosting | CDN recommended |

### SSL/TLS Configuration
1. Obtain certificates (Let's Encrypt or enterprise CA):
   ```bash
   certbot certonly --standalone -d api.your-domain.com
   ```

2. Configure in `.env.production`:
   ```env
   ENABLE_HTTPS=true
   FORCE_HTTPS=true
   SSL_CERT_PATH=/etc/ssl/certs/datacendia.crt
   SSL_KEY_PATH=/etc/ssl/private/datacendia.key
   ```

### Keycloak SSO Setup
1. Create Keycloak realm `datacendia`
2. Create client `datacendia-app`
3. Configure client settings:
   - Access Type: confidential
   - Valid Redirect URIs: https://your-domain.com/*
   - Web Origins: https://your-domain.com

4. Update `.env.production`:
   ```env
   KEYCLOAK_ENABLED=true
   KEYCLOAK_URL=https://auth.your-domain.com
   KEYCLOAK_REALM=datacendia
   KEYCLOAK_CLIENT_ID=datacendia-app
   KEYCLOAK_CLIENT_SECRET=<from-keycloak>
   ```

### Docker Compose Deployment
```bash
git checkout production
cp .env.production .env

# Generate secrets
./scripts/generate-secrets.sh

# Start sovereign stack
docker compose -f infrastructure/docker-compose.sovereign.yml up -d

# Start application
docker compose up -d
```

### Monitoring Setup
- Grafana: https://monitoring.your-domain.com
- Prometheus metrics: /metrics endpoint
- Health check: /health endpoint

---

## Troubleshooting

### Authentication Issues
```bash
# Check if REQUIRE_AUTH is set
grep REQUIRE_AUTH backend/.env

# Verify JWT secrets are set
grep JWT_SECRET backend/.env
```

### Database Connection
```bash
# Test PostgreSQL connection
psql $DATABASE_URL -c "SELECT 1"

# Check Prisma connection
cd backend && npx prisma db pull
```

### CORS Errors
Ensure `CORS_ORIGINS` includes your frontend domain:
```env
CORS_ORIGINS=https://your-domain.com,https://app.your-domain.com
```

---

## Support

For enterprise support, contact: support@datacendia.com
