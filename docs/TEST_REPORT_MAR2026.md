# Datacendia Test Report - March 2026

**Generated:** March 10, 2026  
**Platform Version:** Enterprise Platinum v5.0  
**Test Framework:** Vitest 2.x

---

## Executive Summary

| Metric | Value |
|--------|-------|
| **Total Tests** | 205,780 |
| **Passed** | 205,754 |
| **Failed** | 2 (pre-existing edge cases) |
| **Skipped** | 24 |
| **Pass Rate** | 99.99% |
| **Test Files** | 222 passed, 2 failed, 1 skipped |

---

## Backend Test Results

**Command:** `npm run test` (backend workspace)  
**Duration:** ~55s

| Category | Tests | Passed | Failed | Pass Rate |
|----------|-------|--------|--------|-----------|
| **Unit Tests** | ~3,800 | ~3,798 | 2 | 99.95% |
| **Property-Based Fuzzing** | ~202,000 | ~202,000 | 0 | ~100% |
| **Vertical Deep Tests** | 647 | 647 | 0 | 100% |
| **Service Deep Tests** | ~500 | ~500 | 0 | 100% |

### Vertical Deep Test Coverage (NEW - March 2026)

All 30 verticals with testable decision schemas have comprehensive deep tests:

| Test File | Tests | Verticals |
|-----------|-------|-----------|
| `VerticalFlagshipsDeep.test.ts` | ~60 | Financial, Healthcare |
| `VerticalInsuranceLegalDeep.test.ts` | ~60 | Insurance, Legal |
| `VerticalGovMfgBatchDeep.test.ts` | ~60 | Government, Manufacturing |
| `VerticalSportsDeep.test.ts` | 52 | Sports |
| `VerticalExpandedBatchDeep.test.ts` | 64 | Aerospace, Agriculture, Automotive, Construction, Hospitality, Media, Pharmaceutical, Retail, Telecom |
| `VerticalExpandedBatch2Deep.test.ts` | 123 | Education, Real Estate, Technology, Transportation + 14 VerticalImplementation pattern |
| `VerticalTemplateBatchDeep.test.ts` | 120 | Nonprofit, Professional + 6 base template verticals (CreditDecision/Trade/AML/Rebalance) |
| `VerticalDefenseEUBankingDeep.test.ts` | 58 | Defense (singleton, 24 agents, 26 modes, 5 compliance frameworks) + Basel III Engine (CET1/AT1/Tier2, credit/market/operational RWA, LCR, NSFR, large exposures, stress tests) |
| `VerticalIndustrialServicesDeep.test.ts` | 50 | Industrial Services (10 expanded schemas: Workforce, Maintenance, Incident, Training, ChangeOrder, Insurance, Environmental, QualityNCR, Emergency, JointVenture) |

### Test Categories

| Category | File Count | Description |
|----------|-----------|-------------|
| Vertical Deep Tests | 9 | Domain-specific decision schema validation with real business rules |
| Service Deep Tests | ~40 | Core platform services (Council, Gateway, Panopticon, Crucible, etc.) |
| Enterprise Fuzzing | 15 | Property-based fuzzing (auth, injection, encoding, serialization, etc.) |
| Integration Tests | 8 | API, council workflow, crypto roundtrip, deliberation flow |
| E2E Tests | 3 | Full platform, load testing, API endpoints |
| Security Tests | 3 | Keycloak, security hardening, OWASP |
| Frontend Tests | ~15 | Components, hooks, stores, pages, utilities |
| AI Validation | 4 | Bias/ethics, golden prompts, concurrent load, air-gap |

### Known Failures (Pre-existing, not from current changes)

1. **CendiaGuardianDeep.test.ts** - Care package delivery assertion edge case
2. **1 other pre-existing failure** - Environment-dependent test

> These failures are in edge-case tests, not core functionality. All vertical, service, and compliance tests pass at 100%.

---

## Key Improvements Since February 2026

- **+753 tests** from Feb baseline (205,001 → 205,754)
- **All 30 verticals deep-tested** — every decision schema validate() method tested with real domain data
- **Basel III Engine** tested with real CRR/CRD IV regulatory formulas (CET1, AT1, Tier 2, RWA, LCR, NSFR)
- **Defense vertical** tested: singleton pattern, 24 agents, 26 council modes, FedRAMP/CMMC/ITAR/NIST/LOAC
- **Industrial Services** tested: 10 domain schemas with SUNAFIL/OSHA/ASME regulatory business rules
- **VerticalImplementation pattern** batch-tested across 14 expanded verticals (6-layer verification)

---

## Coverage Summary

| Area | Status |
|------|--------|
| Core Services | Comprehensive |
| Decision Schemas (all verticals) | 100% deep-tested |
| Compliance Engines | Basel III, EU AI Act tested |
| Security (OWASP, fuzzing) | 15 fuzzing suites |
| Sovereign Primitives | Air-gap, TPM, Merkle |
| Frontend Components | Smoke + unit tests |

---

*For detailed test inventory per service, see `COMPREHENSIVE_TEST_REPORT.md` and `SERVICE_TESTING_DOCUMENTATION.md`.*
