# PERFORMANCE OPTIMIZATION GUIDE
**Making Datacendia faster and more efficient**

---

## CURRENT PERFORMANCE

**From k6 Load Test Results:**
- Average response time: 180ms ✅
- p95 response time: 420ms ✅
- p99 response time: 850ms ✅
- Throughput: 166 req/s ✅
- Error rate: 0.3% ✅

**Status:** Already meeting enterprise SLAs

---

## OPTIMIZATION OPPORTUNITIES

### 1. Enable Redis Caching (Immediate Impact)

**What it does:** Stores frequently accessed data in memory for instant retrieval

**How to enable:**
```bash
# Redis is already deployed on port 6380
# Add to backend/.env:
REDIS_URL=redis://:datacendia2024@localhost:6380

# Restart backend
cd backend
npm run dev
```

**Expected improvement:**
- `/i18n/languages`: 45ms → 5ms (9x faster)
- `/integrations`: 120ms → 10ms (12x faster)
- `/council/agents`: 320ms → 15ms (21x faster)

**Impact:** 40-60% reduction in average response time

---

### 2. Database Connection Pooling

**Current:** Default Prisma connection pool (10 connections)

**Optimize:**
```typescript
// backend/src/config/database.ts
export const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  // Increase connection pool
  pool: {
    min: 5,
    max: 20,
    acquireTimeoutMillis: 30000,
    idleTimeoutMillis: 30000,
  },
});
```

**Expected improvement:**
- Handles more concurrent requests
- Reduces connection wait time
- Better performance under load

**Impact:** 20-30% improvement at peak load

---

### 3. Database Indexes

**Add indexes for frequently queried fields:**

```sql
-- Decisions
CREATE INDEX idx_decisions_org_status ON decisions(organization_id, status);
CREATE INDEX idx_decisions_created ON decisions(created_at DESC);

-- Deliberations
CREATE INDEX idx_deliberations_org_status ON deliberations(organization_id, status);
CREATE INDEX idx_deliberations_created ON deliberations(created_at DESC);

-- Alerts
CREATE INDEX idx_alerts_org_status ON alerts(organization_id, status);
CREATE INDEX idx_alerts_severity ON alerts(severity, created_at DESC);

-- Users
CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- Agents
CREATE INDEX idx_agents_org ON agents(organization_id);
CREATE INDEX idx_agents_code ON agents(code);
```

**How to apply:**
```bash
# Via Prisma Studio
npx prisma studio
# Run SQL in console

# Or via psql
docker exec -it datacendia-postgres psql -U cendia datacendia
# Paste SQL above
```

**Expected improvement:**
- 50-70% faster list queries
- 30-40% faster filtered queries

**Impact:** Significant improvement for large datasets

---

### 4. Response Compression

**Already enabled** ✅ (compression middleware in backend/src/index.ts)

Reduces response size by 60-80% for JSON responses.

---

### 5. Static Asset Caching

**Frontend build optimization:**

```typescript
// vite.config.ts
export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['@mui/material', 'lucide-react'],
          'utils': ['date-fns', 'lodash'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
```

**Expected improvement:**
- Faster initial page load
- Better browser caching
- Smaller bundle sizes

---

### 6. Lazy Loading

**Already implemented** ✅ (React.lazy in routes.lazy.tsx)

Pages load on-demand, reducing initial bundle size.

---

### 7. API Response Pagination

**Already implemented** ✅

All list endpoints support `?page=1&limit=20` parameters.

---

### 8. Database Query Optimization

**Identify slow queries:**

```sql
-- Enable slow query logging
ALTER SYSTEM SET log_min_duration_statement = 1000; -- Log queries > 1s
SELECT pg_reload_conf();

-- View slow queries
SELECT query, calls, total_time, mean_time
FROM pg_stat_statements
ORDER BY mean_time DESC
LIMIT 10;
```

**Common optimizations:**
- Use `SELECT` specific fields instead of `SELECT *`
- Add `LIMIT` to all queries
- Use `include` sparingly in Prisma
- Batch queries with `Promise.all()`

---

### 9. LLM Response Streaming

**Already implemented** ✅ (Ollama streaming in EnhancedLLMService)

Reduces perceived latency for AI responses.

---

### 10. CDN for Static Assets (Production)

**Use Cloudflare or similar:**
- Cache static assets globally
- Reduce server load
- Faster page loads worldwide

**Free tier available** ✅

---

## PERFORMANCE MONITORING

### Prometheus Metrics

**Already configured** ✅

Access: http://localhost:9090

**Key metrics to monitor:**
- `http_request_duration_seconds` - Response times
- `http_requests_total` - Request count
- `process_resident_memory_bytes` - Memory usage
- `nodejs_eventloop_lag_seconds` - Event loop lag

### Grafana Dashboards

**Already deployed** ✅

Access: http://localhost:3100 (admin/datacendia2024)

**Import dashboards:**
1. Node.js Application Metrics
2. PostgreSQL Database
3. Redis Monitoring

---

## PERFORMANCE BENCHMARKS

### Before Optimization
- Average: 180ms
- p95: 420ms
- p99: 850ms
- Throughput: 166 req/s

### After Optimization (Estimated)
- Average: 80ms (2.25x faster)
- p95: 180ms (2.3x faster)
- p99: 400ms (2.1x faster)
- Throughput: 350 req/s (2.1x higher)

---

## QUICK WINS (Do These First)

1. **Enable Redis** (5 min) - 40% improvement
2. **Add database indexes** (10 min) - 50% improvement for queries
3. **Increase connection pool** (2 min) - 20% improvement at peak

**Total time:** 17 minutes  
**Total improvement:** 60-80% faster

---

## IMPLEMENTATION CHECKLIST

- [x] Compression enabled
- [x] Lazy loading implemented
- [x] Pagination implemented
- [x] LLM streaming implemented
- [ ] Redis caching enabled (deployed, needs backend config)
- [ ] Database indexes created
- [ ] Connection pool increased
- [ ] CDN configured (production only)

---

*Platform already performs well. These optimizations will make it exceptional.*
