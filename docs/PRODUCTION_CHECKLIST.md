# Production Readiness Checklist

> Quick-reference tracking document. Check off as you complete.

## 🔴 BLOCKERS (Must Have Before First Customer)

### Testing Basics
- [ ] Install test framework: `npm install -D vitest @testing-library/react msw`
- [ ] Unit tests for `CouncilService` (agent routing, deliberation)
- [ ] Unit tests for `RAGService` (embedding, retrieval)
- [ ] Unit tests for `ChronosService` (ledger, snapshots)
- [ ] Integration test: Document → Embedding → RAG query works

### Reliability
- [ ] Health check endpoint: `GET /health`
- [ ] Health check endpoint: `GET /health/ready` (all components)
- [ ] Circuit breaker for Neo4j (graceful degradation)
- [ ] Circuit breaker for Ollama (queue + retry)
- [ ] Circuit breaker for Redis (in-memory fallback)
- [ ] UI states for degraded mode ("Service temporarily limited")

### Security Basics
- [ ] Move secrets from `.env` to environment/vault
- [ ] Rate limiting on API endpoints
- [ ] Input validation on all user inputs
- [ ] Prompt injection basic protections

### Documentation
- [ ] Single-node install guide (README or INSTALL.md)
- [ ] Log locations documented
- [ ] Basic troubleshooting guide

---

## 🟡 IMPORTANT (Before Scaling to Multiple Teams)

### Testing Complete
- [ ] Load test: Council deliberation at 10/50/100 concurrent
- [ ] Load test: Monte Carlo at various concurrency
- [ ] Load test: RAG queries at various concurrency
- [ ] Breaking point documented for each operation
- [ ] Integration tests for all critical paths

### Multi-Tenant Security
- [ ] Row-Level Security enabled on PostgreSQL
- [ ] Tenant isolation test: Org A can't access Org B
- [ ] Vector search scoped to organization
- [ ] Neo4j queries scoped to organization
- [ ] Chronos timelines scoped to organization

### Background Processing
- [ ] Queue system (BullMQ/Redis) set up
- [ ] Monte Carlo runs in background worker
- [ ] Large document ingestion in background
- [ ] Heavy RAG queries in background
- [ ] Job status tracking in UI

### Secrets Management
- [ ] HashiCorp Vault OR AWS Secrets Manager OR Azure Key Vault
- [ ] Secret rotation policy (90-day)
- [ ] No secrets in logs

---

## 🟢 ENTERPRISE (Before Fortune 500)

### Compliance
- [ ] GDPR: Right to Access (export user data)
- [ ] GDPR: Right to Erasure (delete user data)
- [ ] GDPR: Data portability export
- [ ] Audit logs in WORM storage (S3 Object Lock or equivalent)
- [ ] Retention policies implemented

### Security Hardening
- [ ] Formal threat model document
- [ ] Penetration test completed
- [ ] Security findings remediated
- [ ] SOC 2 Type 1 (or equivalent) started

### Legal
- [ ] Software Bill of Materials (SBOM) generated
- [ ] Third-party license audit complete
- [ ] LLM model licensing documented
- [ ] "Licenses & Third-Party Notices" page in product

### Operations
- [ ] Zero-downtime upgrade procedure documented
- [ ] Runbook for common incidents
- [ ] On-call rotation (even if just you)
- [ ] Monitoring & alerting (PagerDuty, etc.)

---

## Progress Tracker

| Category | Done | Total | % |
|----------|------|-------|---|
| Testing Basics | 0 | 5 | 0% |
| Reliability | 0 | 6 | 0% |
| Security Basics | 0 | 4 | 0% |
| Documentation | 0 | 3 | 0% |
| **BLOCKER TOTAL** | **0** | **18** | **0%** |

---

## Quick Wins (Do Today)

1. **Install vitest** - 5 min
2. **Add `/health` endpoint** - 30 min
3. **Document log locations** - 15 min
4. **Add rate limiting middleware** - 30 min

## This Week

1. **First unit test for CouncilService** - 2 hours
2. **Circuit breaker for Ollama** - 2 hours
3. **Basic troubleshooting doc** - 1 hour

---

*Last Updated: [DATE]*
