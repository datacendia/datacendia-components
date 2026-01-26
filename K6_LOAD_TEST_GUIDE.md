# K6 LOAD TESTING GUIDE
**What it is:** k6 is a free, open-source tool that tests how your platform performs under heavy user load.

---

## WHAT LOAD TESTING DOES

**Simple Explanation:**
- Simulates 100-500 people using your platform at the same time
- Measures how fast the API responds
- Finds performance bottlenecks
- Ensures the platform won't crash under heavy use

**Why it matters:**
- Proves your platform can handle real-world traffic
- Identifies slow endpoints before customers complain
- Documents performance SLAs (Service Level Agreements)

---

## INSTALLATION

### Option 1: Download k6 (Easiest)
1. Go to: https://k6.io/docs/get-started/installation/
2. Download Windows installer
3. Run installer
4. Verify: Open PowerShell and run `k6 version`

### Option 2: Use Chocolatey (if you have it)
```powershell
choco install k6 -y
```

### Option 3: Use winget (Windows Package Manager)
```powershell
winget install k6 --source winget
```

### Option 4: Download Binary Manually
1. Download from: https://github.com/grafana/k6/releases
2. Extract k6.exe
3. Add to PATH or run from download folder

---

## HOW TO RUN LOAD TESTS

### Step 1: Start Your Backend
```powershell
cd backend
npm run dev
```

### Step 2: Run k6 Load Test
```powershell
# In a new terminal
k6 run tests/load/k6-api-load-test.js
```

### What You'll See:
```
     ✓ health check status 200
     ✓ languages status 200
     ✓ auth/me status 200

     checks.........................: 95.00% ✓ 9500  ✗ 500
     data_received..................: 15 MB  250 kB/s
     data_sent......................: 2.5 MB 42 kB/s
     http_req_duration..............: avg=180ms min=50ms med=150ms max=2s p(95)=450ms p(99)=800ms
     http_reqs......................: 10000  166/s
     iterations.....................: 2000   33/s
```

### What the Results Mean:
- **http_req_duration p(95)=450ms** - 95% of requests completed in under 450ms ✅
- **http_req_failed rate<0.01** - Less than 1% errors ✅
- **http_reqs: 166/s** - Platform handled 166 requests per second ✅

---

## LOAD TEST SCENARIOS

The test simulates this traffic pattern:

| Time | Users | What's Happening |
|------|-------|------------------|
| 0-1 min | 0→50 | Gradual ramp up |
| 1-4 min | 50 | Sustained load |
| 4-5 min | 50→100 | Increase load |
| 5-8 min | 100 | Sustained higher load |
| 8-9 min | 100→200 | Spike test |
| 9-11 min | 200 | Peak load |
| 11-12 min | 200→0 | Ramp down |

**Total Duration:** 12 minutes

---

## WHAT GETS TESTED

1. **Health Check** - `/api/v1/health`
2. **Languages API** - `/api/v1/i18n/languages`
3. **Integrations API** - `/api/v1/integrations`
4. **User Profile** - `/api/v1/auth/me` (authenticated)
5. **Council Agents** - `/api/v1/council/agents` (authenticated)

---

## PERFORMANCE TARGETS

| Metric | Target | Meaning |
|--------|--------|---------|
| **p95 Response Time** | < 500ms | 95% of requests complete in under 500ms |
| **p99 Response Time** | < 1000ms | 99% of requests complete in under 1 second |
| **Error Rate** | < 1% | Less than 1% of requests fail |
| **Throughput** | > 100 req/s | Handle at least 100 requests per second |

---

## TROUBLESHOOTING

### k6 Not Found
```powershell
# Check if k6 is installed
k6 version

# If not found, download from https://k6.io/docs/get-started/installation/
```

### Backend Not Running
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```
**Fix:** Start backend first: `cd backend && npm run dev`

### High Error Rates
```
http_req_failed: rate>0.01
```
**Fix:** 
- Check backend logs for errors
- Ensure database is running
- Reduce concurrent users in test

### Slow Response Times
```
http_req_duration p(95)>1000ms
```
**Fix:**
- Check database query performance
- Enable Redis caching
- Optimize slow endpoints

---

## NEXT STEPS AFTER LOAD TESTING

1. **Document Results** - Save k6 output to `LOAD_TEST_RESULTS.md`
2. **Identify Bottlenecks** - Look for slow endpoints
3. **Optimize** - Add caching, optimize queries
4. **Re-test** - Verify improvements
5. **Set SLAs** - Document guaranteed performance levels

---

*k6 is free and open-source. No cost to run load tests.*
