# ✅ AUDIT ACTION ITEMS - IMPLEMENTATION CHECKLIST

**Date Created:** February 6, 2026  
**Audit Report:** COMPREHENSIVE_REPOSITORY_AUDIT_2026.md  
**Last Updated:** February 6, 2026

---

## 🔴 CRITICAL - FIX WITHIN 24 HOURS

### 1. SQL Injection Vulnerabilities in Druid Routes

**File:** `backend/src/routes/druid.ts`  
**Owner:** Backend Team Lead  
**Estimated Effort:** 4-8 hours  
**Due:** February 7, 2026

#### Tasks:
- [ ] **Lines 88-100:** Refactor `chronos/timeline` endpoint
  ```typescript
  // Replace string interpolation with parameterized query
  const sql = `
    SELECT TIME_FLOOR(__time, $1) as time_bucket,
      COUNT(*) as decision_count,
      ...
    WHERE organization_id = $2
    AND __time >= $3
    AND __time <= $4
  `;
  const result = await pool.query(sql, [timeFloor, orgId, startDate, endDate]);
  ```

- [ ] **Lines 31-78:** Refactor `chronos/decisions` endpoint
  - Use parameterized queries
  - Remove hardcoded fallback

- [ ] **Lines 119-164:** Refactor `witness/metrics` endpoint
  - Use parameterized queries
  - Remove hardcoded fallback

- [ ] **Lines 166-201:** Refactor `pulse/alerts` endpoint
  - Use parameterized queries
  - Remove hardcoded fallback

- [ ] **Lines 327-346:** Secure or remove raw SQL query endpoint
  - Either: Remove entirely (recommended)
  - Or: Add admin role requirement + strict query validation
  - Or: Replace with stored procedures

- [ ] **All endpoints:** Remove unsafe fallback
  ```typescript
  // ❌ Remove this pattern everywhere
  const orgId = (req as any).organizationId || 'org_demo_001';
  
  // ✅ Replace with secure pattern
  const orgId = req.organizationId;
  if (!orgId) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  ```

#### Testing:
- [ ] Test each endpoint with valid data
- [ ] Test with SQL injection attempts: `'; DROP TABLE users; --`
- [ ] Test with UNION SELECT attempts
- [ ] Verify hardcoded fallback is removed
- [ ] Run automated security scan

#### Verification:
- [ ] Code review by security team
- [ ] Penetration testing
- [ ] Deploy to staging
- [ ] Verify in production

---

### 2. Add Authentication to Druid Routes

**File:** `backend/src/routes/domains/data.domain.ts`  
**Owner:** Security Team  
**Estimated Effort:** 2-4 hours  
**Due:** February 7, 2026

#### Tasks:
- [ ] **Line 28:** Add authentication middleware
  ```typescript
  import { authenticate } from '../../middleware/auth';
  
  // Before
  router.use('/druid', druidRoutes);
  
  // After
  router.use('/druid', authenticate, druidRoutes);
  ```

- [ ] Add authorization checks
  ```typescript
  // In each druid route handler
  const userOrgId = req.user?.organizationId;
  const requestedOrgId = req.query.orgId || req.params.orgId;
  
  if (userOrgId !== requestedOrgId) {
    return res.status(403).json({ error: 'Forbidden' });
  }
  ```

- [ ] Add rate limiting
  ```typescript
  import rateLimit from 'express-rate-limit';
  
  const druidLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
  });
  
  router.use('/druid', authenticate, druidLimiter, druidRoutes);
  ```

#### Testing:
- [ ] Test with valid authentication token
- [ ] Test without authentication token (should fail)
- [ ] Test with expired token (should fail)
- [ ] Test accessing other org's data (should fail)
- [ ] Test rate limiting

#### Verification:
- [ ] Code review
- [ ] Security scan
- [ ] Deploy to staging
- [ ] Verify in production

---

## 🟠 HIGH PRIORITY - FIX WITHIN 1 WEEK

### 3. Update Vulnerable Dependencies

**Owner:** DevOps Team  
**Estimated Effort:** 4-6 hours (including testing)  
**Due:** February 13, 2026

#### Frontend Dependencies:
- [ ] Update @apollo/server
  ```bash
  cd /home/runner/work/datacendia-components/datacendia-components
  npm install @apollo/server@^5.4.0
  ```

- [ ] Update AWS SDK packages
  ```bash
  npm install @aws-sdk/client-s3@latest
  npm install @aws-sdk/client-redshift@latest
  npm install @aws-sdk/client-sts@latest
  ```

- [ ] Update lodash
  ```bash
  npm install lodash@latest
  ```

- [ ] Run audit fix
  ```bash
  npm audit fix
  # If needed:
  npm audit fix --force
  ```

#### Backend Dependencies:
- [ ] Update @apollo/server
  ```bash
  cd backend
  npm install @apollo/server@^5.4.0
  ```

- [ ] Update AWS SDK packages
  ```bash
  npm install @aws-sdk/client-s3@latest
  npm install @aws-sdk/client-redshift@latest
  npm install @aws-sdk/client-sts@latest
  ```

- [ ] Update lodash
  ```bash
  npm install lodash@latest
  ```

- [ ] Run audit fix
  ```bash
  npm audit fix
  # If needed:
  npm audit fix --force
  ```

#### Testing:
- [ ] Run frontend tests: `npm run test`
- [ ] Run backend tests: `cd backend && npm run test`
- [ ] Run E2E tests: `npm run test:e2e`
- [ ] Build frontend: `npm run build`
- [ ] Build backend: `cd backend && npm run build`
- [ ] Test integration locally
- [ ] Deploy to staging
- [ ] Smoke tests in staging

#### Verification:
- [ ] Run `npm audit` (should show 0 high vulnerabilities)
- [ ] All tests passing
- [ ] No breaking changes in production features

---

### 4. Remove Hardcoded Fallback Values Throughout Codebase

**Owner:** Backend Team  
**Estimated Effort:** 3-4 hours  
**Due:** February 13, 2026

#### Files to Update:
Search for pattern: `|| 'org_demo_001'` or similar fallbacks

- [ ] `backend/src/routes/druid.ts` (multiple locations)
- [ ] Search entire codebase:
  ```bash
  grep -r "|| 'org_" backend/src/
  grep -r "|| \"org_" backend/src/
  ```

#### Task:
For each occurrence:
```typescript
// ❌ Before
const orgId = (req as any).organizationId || 'org_demo_001';

// ✅ After
const orgId = req.organizationId;
if (!orgId) {
  return res.status(401).json({ 
    error: 'Unauthorized',
    message: 'Organization ID is required'
  });
}
```

#### Testing:
- [ ] Test each modified endpoint
- [ ] Verify error handling works
- [ ] Check logs for proper error messages

---

## 🟡 MEDIUM PRIORITY - FIX WITHIN 1 MONTH

### 5. Reduce `any` Type Usage

**Owner:** Full Development Team (Ongoing)  
**Estimated Effort:** 20-40 hours over time  
**Target:** Reduce from 1,256 to <600 instances  
**Due:** March 6, 2026

#### Approach:
1. **Phase 1: Add Type Definitions (Week 1-2)**
   - [ ] Create `types/request.d.ts` for Express Request extensions
   ```typescript
   // types/request.d.ts
   declare namespace Express {
     interface Request {
       organizationId?: string;
       userId?: string;
       user?: {
         id: string;
         organizationId: string;
         role: string;
       };
     }
   }
   ```
   
   - [ ] Create `types/api.d.ts` for API response types
   - [ ] Create `types/services.d.ts` for service interfaces

2. **Phase 2: Refactor High-Impact Files (Week 2-3)**
   - [ ] Identify files with most `any` usage
   ```bash
   grep -c "any" backend/src/**/*.ts | sort -t: -k2 -nr | head -20
   ```
   - [ ] Refactor top 10 files

3. **Phase 3: Enable Stricter Rules (Week 3-4)**
   - [ ] Enable `noImplicitAny` in tsconfig.json
   - [ ] Fix all new errors
   - [ ] Enable `strictNullChecks`

#### Progress Tracking:
- [ ] Week 1: Baseline measurement
- [ ] Week 2: 25% reduction
- [ ] Week 3: 50% reduction
- [ ] Week 4: Verify and document

---

### 6. Implement Enhanced Security Middleware

**Owner:** Security Team  
**Estimated Effort:** 8-16 hours  
**Due:** March 6, 2026

#### Tasks:
- [ ] Add Helmet.js for security headers
  ```typescript
  import helmet from 'helmet';
  app.use(helmet());
  ```

- [ ] Implement CSRF protection
  ```typescript
  import csrf from 'csurf';
  app.use(csrf({ cookie: true }));
  ```

- [ ] Add rate limiting globally
  ```typescript
  import rateLimit from 'express-rate-limit';
  
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
  });
  app.use('/api/', limiter);
  ```

- [ ] Configure CORS properly
  ```typescript
  import cors from 'cors';
  
  app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(','),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  }));
  ```

- [ ] Add request logging
  ```typescript
  app.use((req, res, next) => {
    logger.info({
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user?.id,
      orgId: req.organizationId,
    });
    next();
  });
  ```

#### Testing:
- [ ] Test CORS with different origins
- [ ] Test rate limiting
- [ ] Test CSRF protection
- [ ] Verify security headers in responses

---

### 7. Add Performance Monitoring

**Owner:** DevOps Team  
**Estimated Effort:** 8-16 hours  
**Due:** March 6, 2026

#### Options:
1. **Open Source:** Prometheus + Grafana (already in docker-compose)
2. **Commercial:** New Relic, Datadog, or AppDynamics

#### Implementation (Prometheus):
- [ ] Install prom-client (already installed)
- [ ] Add metrics endpoint
  ```typescript
  import promClient from 'prom-client';
  
  const register = new promClient.Registry();
  promClient.collectDefaultMetrics({ register });
  
  app.get('/metrics', async (req, res) => {
    res.set('Content-Type', register.contentType);
    res.end(await register.metrics());
  });
  ```

- [ ] Add custom metrics
  ```typescript
  const httpRequestDuration = new promClient.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'status_code'],
  });
  ```

- [ ] Configure Grafana dashboards
- [ ] Set up alerts

#### Testing:
- [ ] Verify metrics endpoint
- [ ] Check Grafana dashboards
- [ ] Test alerts

---

## 🟢 LOW PRIORITY - CONTINUOUS IMPROVEMENT

### 8. Improve TypeScript Configuration

**Owner:** Full Development Team  
**Effort:** Ongoing  
**Target:** Continuous improvement

#### Changes:
- [ ] Enable `noUnusedLocals` in tsconfig.json
- [ ] Enable `noUnusedParameters` in tsconfig.json
- [ ] Enable `noUncheckedIndexedAccess`
- [ ] Enable `exactOptionalPropertyTypes`

#### Process:
1. Enable one option at a time
2. Fix all errors
3. Test thoroughly
4. Move to next option

---

### 9. Bundle Size Analysis

**Owner:** Frontend Team  
**Estimated Effort:** 4-6 hours  
**Target:** Completed by March 13, 2026

#### Tasks:
- [ ] Install bundle analyzer
  ```bash
  npm install --save-dev rollup-plugin-visualizer
  ```

- [ ] Configure in vite.config.ts
  ```typescript
  import { visualizer } from 'rollup-plugin-visualizer';
  
  export default defineConfig({
    plugins: [
      react(),
      visualizer({ open: true })
    ]
  });
  ```

- [ ] Build and analyze
  ```bash
  npm run build
  # Opens stats.html automatically
  ```

- [ ] Set size budgets
  - Main bundle: < 500KB
  - Vendor bundle: < 300KB
  - Total: < 1MB

- [ ] Identify optimization opportunities
  - Code splitting
  - Lazy loading
  - Tree shaking
  - Compression

---

### 10. Documentation Updates

**Owner:** Technical Writers / Full Team  
**Effort:** Ongoing  
**Target:** Monthly updates

#### Tasks:
- [ ] Review and update README.md
- [ ] Update API documentation
  - [ ] Add OpenAPI/Swagger spec generation
  - [ ] Document all endpoints
  - [ ] Add request/response examples

- [ ] Update deployment guides
  - [ ] Verify instructions are current
  - [ ] Add troubleshooting section
  - [ ] Update screenshots

- [ ] Update architecture documentation
  - [ ] Add architecture diagrams
  - [ ] Document major components
  - [ ] Explain design decisions

- [ ] Keep audit reports up to date
  - [ ] Run monthly audits
  - [ ] Track progress on issues
  - [ ] Update compliance status

---

## 📊 PROGRESS TRACKING

### Critical Issues Status
```
┌────────────────────────────────────────────┐
│ Issue                    Status   Due Date │
├────────────────────────────────────────────┤
│ 1. SQL Injection         [ ]  Feb 7, 2026  │
│ 2. Missing Auth          [ ]  Feb 7, 2026  │
└────────────────────────────────────────────┘
```

### High Priority Status
```
┌────────────────────────────────────────────┐
│ Issue                    Status   Due Date │
├────────────────────────────────────────────┤
│ 3. Dependencies          [ ]  Feb 13, 2026 │
│ 4. Hardcoded Fallbacks   [ ]  Feb 13, 2026 │
└────────────────────────────────────────────┘
```

### Medium Priority Status
```
┌────────────────────────────────────────────┐
│ Issue                    Status   Due Date │
├────────────────────────────────────────────┤
│ 5. Type Safety           [ ]  Mar 6, 2026  │
│ 6. Security Middleware   [ ]  Mar 6, 2026  │
│ 7. Performance Monitor   [ ]  Mar 6, 2026  │
└────────────────────────────────────────────┘
```

---

## 🔔 NOTIFICATIONS

**When to Update This Document:**
- ✅ When a task is completed
- ✅ When priorities change
- ✅ When new issues are discovered
- ✅ After each sprint/milestone

**Who to Notify:**
- Security Team (for critical issues)
- Team Leads (for all issues)
- Product Manager (for timeline changes)
- Stakeholders (for major milestones)

---

## 📞 ESCALATION

**If Critical Issues Are Not Fixed by Due Date:**
1. Notify CTO immediately
2. Block production deployments
3. Schedule emergency meeting
4. Re-assess priorities and resources

**Contact:**
- **Security Issues:** security-team@company.com
- **Technical Issues:** tech-leads@company.com
- **Management:** cto@company.com

---

**Document Created:** February 6, 2026  
**Last Updated:** February 6, 2026  
**Next Review:** February 7, 2026 (after critical fixes)

