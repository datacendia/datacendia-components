# OWASP ZAP SECURITY AUDIT GUIDE
**Free security testing for your platform**

---

## WHAT IS OWASP ZAP?

**Simple Explanation:**
OWASP ZAP is a free tool that finds security vulnerabilities in your platform.

**What it does:**
- Tests for SQL injection
- Tests for XSS (cross-site scripting)
- Tests for broken authentication
- Tests for security misconfigurations
- Generates security report

**Why it matters:**
- Finds security holes before hackers do
- Required for enterprise compliance
- Free alternative to expensive penetration testing

---

## INSTALLATION

### Step 1: Download
1. Go to: https://www.zaproxy.org/download/
2. Click "Download Now"
3. Choose "Windows Installer"
4. Download `ZAP_2.XX.X_windows.exe`

### Step 2: Install
1. Run the downloaded `.exe` file
2. Click "Next" through installer
3. Accept license
4. Choose installation folder
5. Click "Install"
6. Click "Finish"

### Step 3: Launch
1. Find "OWASP ZAP" in Start Menu
2. Click to launch
3. Choose "No, I do not want to persist this session"
4. Click "Start"

**Done!** ZAP is installed.

---

## HOW TO RUN SECURITY AUDIT

### Step 1: Start Your Platform
```powershell
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

### Step 2: Configure ZAP

1. Open OWASP ZAP
2. Click "Automated Scan" tab
3. Enter URL: `http://localhost:5173`
4. Click "Attack"

### Step 3: Wait for Scan
- Scan takes 10-30 minutes
- ZAP will:
  - Spider your website (find all pages)
  - Test each page for vulnerabilities
  - Generate report

### Step 4: Review Results

**Alerts Panel shows:**
- 🔴 **High** - Critical vulnerabilities (fix immediately)
- 🟠 **Medium** - Important issues (fix soon)
- 🟡 **Low** - Minor issues (fix when possible)
- 🔵 **Informational** - Best practices

### Step 5: Export Report

1. Click "Report" menu
2. Click "Generate HTML Report"
3. Save as: `security-audit-YYYYMMDD.html`
4. Review with your team

---

## COMMON VULNERABILITIES & FIXES

### SQL Injection
**What it is:** Attacker can manipulate database queries

**How ZAP tests:** Sends `' OR '1'='1` in form fields

**Fix:** Use Prisma ORM (already implemented ✅)

### XSS (Cross-Site Scripting)
**What it is:** Attacker can inject malicious JavaScript

**How ZAP tests:** Sends `<script>alert('xss')</script>` in inputs

**Fix:** Sanitize user input (already implemented ✅)

### Broken Authentication
**What it is:** Weak password requirements, session issues

**How ZAP tests:** Tries weak passwords, session hijacking

**Fix:** 
- Strong password requirements ✅
- JWT tokens ✅
- Secure session management ✅

### Security Misconfiguration
**What it is:** Missing security headers, exposed debug info

**How ZAP tests:** Checks HTTP headers

**Fix:** Add security headers (already implemented ✅)

---

## INTERPRETING RESULTS

### Example Alert:
```
🔴 HIGH: SQL Injection
URL: http://localhost:5173/api/v1/users?search=test
Parameter: search
Evidence: Error message reveals database structure
```

**What to do:**
1. Note the URL and parameter
2. Check backend code for that endpoint
3. Verify Prisma is used (prevents SQL injection)
4. Add input validation if needed
5. Re-run scan to verify fix

---

## AUTOMATED SCANNING

### Create Scan Script

Create `scripts/security-scan.sh`:

```bash
#!/bin/bash
# Automated ZAP security scan

# Start ZAP in daemon mode
zap.sh -daemon -port 8090 -config api.disablekey=true &
sleep 30

# Run spider
curl "http://localhost:8090/JSON/spider/action/scan/?url=http://localhost:5173"
sleep 60

# Run active scan
curl "http://localhost:8090/JSON/ascan/action/scan/?url=http://localhost:5173"
sleep 300

# Generate report
curl "http://localhost:8090/OTHER/core/other/htmlreport/" > security-report.html

# Shutdown ZAP
curl "http://localhost:8090/JSON/core/action/shutdown/"
```

### Run Automated Scan
```powershell
bash scripts/security-scan.sh
```

---

## SECURITY CHECKLIST

After running ZAP, verify:

- [ ] No SQL injection vulnerabilities
- [ ] No XSS vulnerabilities
- [ ] No broken authentication
- [ ] Security headers present
- [ ] No sensitive data exposure
- [ ] HTTPS enforced (in production)
- [ ] CORS configured correctly
- [ ] Rate limiting enabled
- [ ] Input validation on all endpoints
- [ ] Error messages don't reveal system details

---

## EXPECTED RESULTS

**Your platform should pass:**
- ✅ SQL Injection tests (Prisma ORM prevents this)
- ✅ XSS tests (Input sanitization implemented)
- ✅ Authentication tests (JWT tokens secure)
- ✅ Security headers (Helmet middleware configured)

**Possible findings:**
- ⚠️ Missing HTTPS (expected in development)
- ⚠️ Some informational alerts (low priority)

---

## NEXT STEPS AFTER AUDIT

1. ✅ Run OWASP ZAP scan
2. ⏭️ Review all HIGH and MEDIUM alerts
3. ⏭️ Fix identified vulnerabilities
4. ⏭️ Re-run scan to verify fixes
5. ⏭️ Document security posture
6. ⏭️ Schedule quarterly scans

---

**OWASP ZAP is free and open-source. No license required.**  
**Recommended: Run security scan before every major release.**
