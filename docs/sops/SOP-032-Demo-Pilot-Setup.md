# SOP-032: Demo & Pilot Environment Setup

**Category:** Client Operations
**Priority:** High
**Owner:** Engineering Lead / Sales Engineering
**Last Verified:** 2026-02-22 (against `DEPLOYMENT_GUIDE.md`, `DEMO_DATA_GUIDE.md`)

---

## 1. Purpose

Define procedures for setting up and managing demo and pilot environments used for client presentations, proof-of-concept engagements, and trial deployments.

---

## 2. Environment Comparison

| Feature | Demo | Pilot |
|---------|------|-------|
| Branch | `demo` | `pilot` |
| Authentication | Real JWT login | Real JWT login |
| Data | Pre-loaded demo data | Client data (limited) |
| User creation | Disabled | Limited (max 25) |
| Data deletion | Disabled | Controlled |
| Data sources | 8 pre-configured | Max 10 client sources |
| Expiry | None (always available) | Date-based expiry |
| Feature scope | All features enabled | Per agreement |

---

## 3. Demo Environment Setup

### 3.1 Quick Setup
```bash
# Switch to demo branch
git checkout demo

# Copy demo environment config
cp .env.demo backend/.env

# Install dependencies (if needed)
npm install

# Start all services
npm run start:dev
```

### 3.2 Demo Credentials
| Field | Value |
|-------|-------|
| URL | http://localhost:5173/auth/login |
| Email | `admin@datacendia.com` |
| Password | `DatacendiaAdmin2024!` |
| Role | ADMIN |

### 3.3 Demo Features
- ✅ Real authentication required (demonstrates login flow)
- ✅ 8 pre-configured data sources
- ✅ All Cortex features enabled
- ✅ Sample compliance data
- ✅ DCII with demo scores
- ✅ AI Council with all 14 agents
- ❌ Data deletion disabled (protect demo data)
- ❌ User creation disabled (prevent clutter)

### 3.4 Demo Data Reset
If demo data gets corrupted:
```bash
cd backend
npx prisma migrate reset  # WARNING: drops all data
npx prisma db seed         # Re-seeds demo data
```

---

## 4. Pilot Environment Setup

### 4.1 Prerequisites
- Signed pilot agreement with feature scope
- Client infrastructure access (or Datacendia-hosted)
- Client database credentials
- Feature flags defined per agreement

### 4.2 Setup Steps

#### Step 1: Branch and Configure
```bash
git checkout pilot
```

#### Step 2: Generate Secrets
```bash
# JWT secrets
openssl rand -base64 64  # → JWT_SECRET
openssl rand -base64 64  # → JWT_REFRESH_SECRET
```

#### Step 3: Configure Pilot Environment
Create/update `.env.pilot`:
```env
NODE_ENV=production
REQUIRE_AUTH=true

# Client database
DATABASE_URL=postgresql://client_user:password@client-db:5432/datacendia

# Pilot configuration
PILOT_ORGANIZATION_ID=<client-org-id>
PILOT_ORGANIZATION_NAME=<Client Company Name>
PILOT_EXPIRY_DATE=2026-06-30

# Feature flags (per agreement)
FEATURE_COUNCIL=true
FEATURE_COLLAPSE=false
FEATURE_DCII=true
FEATURE_GHOST_BOARD=false

# Generated secrets
JWT_SECRET=<generated>
JWT_REFRESH_SECRET=<generated>
```

#### Step 4: Deploy
```bash
cp .env.pilot backend/.env
cd backend
npx prisma migrate deploy
npx prisma db seed
```

#### Step 5: Start
```bash
npm run start:dev
```

### 4.3 Pilot Limits
| Limit | Value | Enforcement |
|-------|-------|-------------|
| Max users | 25 | Registration blocked at limit |
| Max data sources | 10 | Connection blocked at limit |
| Expiry date | Per agreement | Platform shows expiry warning, then locks |
| Feature scope | Per agreement | Feature flags disable unavailable features |

---

## 5. Presentation Best Practices

### 5.1 Pre-Demo Checklist
- [ ] All Docker services running
- [ ] Backend health check passing
- [ ] Demo login works
- [ ] Ollama models loaded (at minimum `llama3.2:3b` for fast responses)
- [ ] Browser cache cleared
- [ ] Screen resolution set for presentation
- [ ] Demo data is fresh (reset if needed)

### 5.2 Demo Flow (Recommended)
1. **Landing page** — Show marketing/product pages
2. **Login** — Demonstrate real authentication
3. **Dashboard (Helm)** — KPIs, real-time data
4. **AI Council** — Run a quick deliberation
5. **DCII Dashboard** — IISS score, jurisdiction check
6. **Collapse Mode** — Red-team a sample policy
7. **Regulator's Receipt** — Generate court-ready PDF
8. **Admin** — Show configuration, user management

### 5.3 Backup Plan
If Ollama is slow or unavailable during demo:
- DCII dashboard falls back to demo data automatically
- Council shows demo deliberation results
- Focus on static features (dashboards, compliance docs, architecture)

---

## 6. Pilot-to-Production Transition

When a pilot converts to a paying customer:
1. Preserve pilot data (if client agrees)
2. Upgrade license tier and feature flags
3. Remove pilot limits (users, data sources)
4. Remove expiry date
5. Transition to production branch and deployment (SOP-005)
6. Full client onboarding (SOP-031)

---

## 7. Environment Teardown

### 7.1 Demo Reset
```bash
cd backend && npx prisma migrate reset && npx prisma db seed
```

### 7.2 Pilot Decommission (After Expiry)
1. Notify client 30 days before expiry
2. Offer data export
3. After expiry + 30 day grace period:
   - Back up pilot database
   - Remove pilot environment
   - Archive configuration
4. Log decommission in CendiaLedger™

---

## 8. Verified Against

- `DEPLOYMENT_GUIDE.md`: Demo setup (lines 25–72), Pilot setup (lines 75–119)
- Demo credentials: `admin@datacendia.com` / `DatacendiaAdmin2024!`
- Pilot limits: 25 users, 10 data sources, date-based expiry
- `docs/DEMO_DATA_GUIDE.md`: Demo data seeding procedures
- Branch strategy: `demo`, `pilot` branches

---

*Datacendia, LLC — Proprietary and Confidential*
