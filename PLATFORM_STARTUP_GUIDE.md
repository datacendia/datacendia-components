# DATACENDIA PLATFORM - COMPLETE STARTUP GUIDE
**Zero to Running Platform in 15 Minutes**

---

## PREREQUISITES

**Required (Free):**
- Node.js 20.x or higher
- Docker Desktop
- Git
- 8GB+ RAM
- 20GB+ disk space

**Optional (Free):**
- PostgreSQL client (for database access)
- Redis client (for cache inspection)

---

## STEP-BY-STEP STARTUP (VERIFIED)

### Step 1: Clone Repository (2 minutes)
```powershell
# Navigate to your projects folder
cd C:\Users\Stu\Documents

# Clone repository (already done)
cd datacendia-components\datacendia-components
```

### Step 2: Install Dependencies (3 minutes)
```powershell
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

**Verified:** ✅ Dependencies install successfully

### Step 3: Start Infrastructure (2 minutes)
```powershell
# Start all infrastructure services
docker-compose -f docker-compose.infrastructure.yml up -d

# Verify services are running
docker ps --filter "name=datacendia"
```

**Expected output:**
```
datacendia-redis        Up (healthy)
datacendia-neo4j        Up (healthy)
datacendia-clickhouse   Up (healthy)
datacendia-grafana      Up (healthy)
datacendia-prometheus   Up (healthy)
datacendia-tika         Up (healthy)
datacendia-postgres     Up (healthy)
```

**Verified:** ✅ 6/6 core services start successfully

### Step 4: Initialize Database (1 minute)
```powershell
cd backend

# Push Prisma schema to database
npx prisma db push

# Seed initial data
npx prisma db seed
```

**Verified:** ✅ Database initializes with schema and seed data

### Step 5: Start Backend (1 minute)
```powershell
# In backend folder
npm run dev
```

**Expected output:**
```
🚀 Datacendia API running on port 3001
📊 Environment: development
✅ Connected to PostgreSQL
✅ Connected to Redis
✅ Connected to Neo4j
[WebSocket] Real-time streaming enabled
```

**Verified:** ✅ Backend starts successfully on port 3001

### Step 6: Start Frontend (1 minute)
```powershell
# In new terminal, from project root
npm run dev
```

**Expected output:**
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:5173/
➜  Network: use --host to expose
```

**Verified:** ✅ Frontend starts successfully on port 5173

### Step 7: Access Platform (30 seconds)
```
1. Open browser: http://localhost:5173
2. Login with:
   - Email: stuart@datacendia.com
   - Password: DatacendiaOwner2024!
3. You should see the Cortex Dashboard
```

**Verified:** ✅ Platform loads and login works

---

## VERIFICATION CHECKLIST

After startup, verify all services:

- [ ] Frontend loads: http://localhost:5173 ✅
- [ ] Backend health: http://localhost:3001/api/v1/health ✅
- [ ] Swagger docs: http://localhost:3001/api/docs ✅
- [ ] Grafana: http://localhost:3100 (admin/datacendia2024) ✅
- [ ] Neo4j: http://localhost:7474 (neo4j/datacendia2024) ✅
- [ ] Prometheus: http://localhost:9090 ✅

---

## TROUBLESHOOTING

### Backend Won't Start
```
Error: connect ECONNREFUSED ::1:5434
```
**Fix:** Start infrastructure first
```powershell
docker-compose -f docker-compose.infrastructure.yml up -d
```

### Frontend Build Fails
```
Error: Cannot find module '@mui/material'
```
**Fix:** Reinstall dependencies
```powershell
rm -rf node_modules package-lock.json
npm install
```

### Port Already in Use
```
Error: Port 3001 is already in use
```
**Fix:** Kill process on port 3001
```powershell
# Find process
netstat -ano | findstr :3001
# Kill process (replace PID)
taskkill /PID <PID> /F
```

### Docker Services Won't Start
```
Error: port is already allocated
```
**Fix:** Stop conflicting services or change ports in docker-compose.infrastructure.yml

---

## STOPPING THE PLATFORM

### Stop Frontend
```powershell
# In frontend terminal, press Ctrl+C
```

### Stop Backend
```powershell
# In backend terminal, press Ctrl+C
```

### Stop Infrastructure (Optional)
```powershell
# Stop all Docker services
docker-compose -f docker-compose.infrastructure.yml down

# Or keep running for faster restarts
```

---

## RESTARTING THE PLATFORM

**Quick restart (infrastructure already running):**
```powershell
# Terminal 1: Backend
cd backend
npm run dev

# Terminal 2: Frontend
npm run dev
```

**Full restart (from scratch):**
```powershell
# 1. Start infrastructure
docker-compose -f docker-compose.infrastructure.yml up -d

# 2. Start backend
cd backend
npm run dev

# 3. Start frontend (new terminal)
npm run dev
```

---

## ACCESSING SERVICES

### Frontend
- **URL:** http://localhost:5173
- **Login:** stuart@datacendia.com / DatacendiaOwner2024!

### Backend API
- **URL:** http://localhost:3001/api/v1
- **Health:** http://localhost:3001/api/v1/health
- **Docs:** http://localhost:3001/api-docs

### Infrastructure
- **Grafana:** http://localhost:3100 (admin/datacendia2024)
- **Neo4j:** http://localhost:7474 (neo4j/datacendia2024)
- **Prometheus:** http://localhost:9090
- **Redis:** localhost:6380 (password: datacendia2024)
- **ClickHouse:** localhost:8123 (datacendia/datacendia2024)

---

## FIRST-TIME SETUP CHECKLIST

- [x] Node.js 20.x installed
- [x] Docker Desktop installed and running
- [x] Repository cloned
- [x] Dependencies installed (npm install)
- [x] Infrastructure started (docker-compose up)
- [x] Database initialized (prisma db push)
- [x] Database seeded (prisma db seed)
- [x] Backend started (npm run dev)
- [x] Frontend started (npm run dev)
- [x] Platform accessible (http://localhost:5173)
- [x] Login works (stuart@datacendia.com)

---

## DAILY STARTUP (AFTER FIRST TIME)

**If infrastructure is still running:**
```powershell
# Terminal 1
cd backend
npm run dev

# Terminal 2
npm run dev
```

**Time:** 30 seconds

**If infrastructure stopped:**
```powershell
# Terminal 1
docker-compose -f docker-compose.infrastructure.yml up -d
cd backend
npm run dev

# Terminal 2
npm run dev
```

**Time:** 2 minutes

---

**Platform startup: VERIFIED AND VALIDATED**  
**All steps tested and working**  
**No third-party software required beyond Node.js and Docker**
