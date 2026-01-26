# VERIFIED URLS AND ENDPOINTS
**Every URL tested and confirmed working - NO LIES**

---

## BACKEND ENDPOINTS (VERIFIED)

**Base URL:** http://localhost:3001

### ✅ Working Endpoints (Tested)

| Endpoint | Purpose | Status | Response |
|----------|---------|--------|----------|
| `/api/v1/health` | Health check | ✅ 200 | `{"success":true,"data":{"status":"healthy"}}` |
| `/health` | Liveness probe | ✅ 200 | `{"status":"healthy"}` |
| `/api/docs` | Swagger UI | ✅ 200 | HTML page with API docs |
| `/api/docs.json` | OpenAPI spec | ✅ 200 | JSON spec |
| `/metrics` | Prometheus metrics | ✅ 200 | Prometheus format |

### ❌ Non-Existent Endpoints (Tested)

| Endpoint | Status | Error |
|----------|--------|-------|
| `/api-docs` | ❌ 404 | `{"success":false,"error":{"code":"NOT_FOUND"}}` |

**Correction:** Swagger docs are at `/api/docs` NOT `/api-docs`

---

## INFRASTRUCTURE SERVICES (VERIFIED)

### ✅ Running Services

| Service | URL | Status | Credentials |
|---------|-----|--------|-------------|
| **Grafana** | http://localhost:3100 | ✅ Running | admin / datacendia2024 |
| **Neo4j Browser** | http://localhost:7474 | ✅ Running | neo4j / datacendia2024 |
| **Prometheus** | http://localhost:9090 | ✅ Running | No auth |
| **Redis** | localhost:6380 | ✅ Running | Password: datacendia2024 |
| **ClickHouse** | localhost:8123 | ✅ Running | datacendia / datacendia2024 |
| **Tika** | http://localhost:9998 | ✅ Running | No auth |
| **PostgreSQL** | localhost:5434 | ✅ Running | cendia / cendia_sovereign_2025 |

---

## FRONTEND (NOT YET VERIFIED)

**Expected URL:** http://localhost:5173  
**Status:** Not running (requires `npm run dev`)  
**Login:** stuart@datacendia.com / DatacendiaOwner2024!

---

## CORRECTED DOCUMENTATION

**Files updated with correct URLs:**
1. `PLATFORM_STARTUP_GUIDE.md` - Changed `/api-docs` → `/api/docs`
2. `docs/API_DOCUMENTATION.md` - Changed `/api-docs` → `/api/docs`
3. `docs/USER_GUIDE.md` - Changed `/api-docs` → `/api/docs`
4. `FINAL_TEST_EXECUTION_REPORT.md` - Changed `/api-docs` → `/api/docs`
5. `ZERO_COST_ROADMAP.md` - Changed `/api-docs` → `/api/docs`

---

## VERIFICATION COMMANDS

### Test Backend Health
```powershell
curl http://localhost:3001/api/v1/health -UseBasicParsing
# Should return: {"success":true,"data":{"status":"healthy"}}
```

### Test Swagger Docs
```powershell
curl http://localhost:3001/api/docs -UseBasicParsing
# Should return: 200 OK with HTML page
```

### Test Grafana
```powershell
curl http://localhost:3100 -UseBasicParsing
# Should return: 200 OK with Grafana login page
```

### Test Neo4j
```powershell
curl http://localhost:7474 -UseBasicParsing
# Should return: 200 OK with Neo4j browser
```

### Test Prometheus
```powershell
curl http://localhost:9090 -UseBasicParsing
# Should return: 200 OK with Prometheus UI
```

---

**All URLs verified by actual testing. No more lies about endpoints.**
