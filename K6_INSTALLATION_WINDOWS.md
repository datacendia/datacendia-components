# K6 INSTALLATION FOR WINDOWS
**Simple step-by-step guide to install k6 load testing tool**

---

## OPTION 1: Download Installer (Easiest)

### Step 1: Download
1. Go to: https://github.com/grafana/k6/releases/latest
2. Scroll down to "Assets"
3. Download: `k6-v0.XX.X-windows-amd64.msi`

### Step 2: Install
1. Double-click the downloaded `.msi` file
2. Click "Next" through the installer
3. Accept defaults
4. Click "Install"
5. Click "Finish"

### Step 3: Verify
```powershell
# Open PowerShell and run:
k6 version

# Should show:
# k6 v0.XX.X (go1.XX.X, windows/amd64)
```

**Done!** k6 is installed.

---

## OPTION 2: Download ZIP (Manual)

### Step 1: Download
1. Go to: https://github.com/grafana/k6/releases/latest
2. Download: `k6-v0.XX.X-windows-amd64.zip`

### Step 2: Extract
1. Right-click the ZIP file
2. Click "Extract All"
3. Choose location (e.g., `C:\k6`)
4. Click "Extract"

### Step 3: Add to PATH
1. Press `Windows + R`
2. Type: `sysdm.cpl` and press Enter
3. Click "Advanced" tab
4. Click "Environment Variables"
5. Under "System variables", find "Path"
6. Click "Edit"
7. Click "New"
8. Add: `C:\k6` (or wherever you extracted)
9. Click "OK" on all windows

### Step 4: Verify
```powershell
# Open NEW PowerShell window and run:
k6 version
```

**Done!** k6 is installed.

---

## OPTION 3: Winget (Windows Package Manager)

```powershell
# If you have winget installed:
winget install k6 --source winget

# Verify:
k6 version
```

---

## OPTION 4: Chocolatey

```powershell
# If you have Chocolatey installed:
choco install k6 -y

# Verify:
k6 version
```

---

## RUN YOUR FIRST LOAD TEST

### Step 1: Navigate to Project
```powershell
cd C:\Users\Stu\Documents\datacendia-components\datacendia-components
```

### Step 2: Start Backend
```powershell
# Open terminal 1
cd backend
npm run dev
```

### Step 3: Run k6 Test
```powershell
# Open terminal 2
k6 run tests/load/k6-api-load-test.js
```

### What You'll See:
```
running (12m00s), 000/200 VUs, 10000 complete and 0 interrupted iterations

     ✓ health check status 200
     ✓ languages status 200
     ✓ auth/me status 200

     checks.........................: 95.00% ✓ 9500  ✗ 500
     http_req_duration..............: avg=180ms p(95)=450ms p(99)=800ms
     http_reqs......................: 10000  166/s
```

**Interpretation:**
- ✅ 95% of checks passed
- ✅ Average response time: 180ms
- ✅ 95% of requests under 450ms
- ✅ Platform handled 166 requests/second

---

## TROUBLESHOOTING

### "k6: command not found"
**Fix:** 
1. Close and reopen PowerShell
2. Verify PATH was updated correctly
3. Try running: `C:\k6\k6.exe version` (full path)

### "Backend not running" Error
```
Error: connect ECONNREFUSED 127.0.0.1:3001
```
**Fix:** Start backend first: `cd backend && npm run dev`

### Download Blocked by Antivirus
**Fix:**
1. Temporarily disable antivirus
2. Download k6
3. Re-enable antivirus
4. Add k6.exe to antivirus exceptions

---

## WHAT k6 DOES (SIMPLE EXPLANATION)

**k6 simulates many users using your platform at once.**

Think of it like:
- 1 user = You clicking around the website
- 100 users = 100 people clicking at the same time
- k6 simulates this to see if your platform can handle it

**Why it matters:**
- Proves your platform won't crash under heavy use
- Finds slow parts of your API
- Documents performance guarantees
- Required for enterprise sales

---

## NEXT STEPS AFTER INSTALLATION

1. ✅ k6 installed
2. ⏭️ Run load test: `k6 run tests/load/k6-api-load-test.js`
3. ⏭️ Review results
4. ⏭️ Document performance SLAs
5. ⏭️ Optimize slow endpoints if needed

---

*k6 is free and open-source. No license required.*
