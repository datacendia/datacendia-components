# SOP-012: Testing Procedures

**Category:** Quality
**Priority:** High
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against test files, `COMPREHENSIVE_TEST_REPORT.md`)

---

## 1. Purpose

Define testing standards, procedures, and coverage requirements for the Datacendia platform including unit, integration, property-based, and end-to-end testing.

---

## 2. Test Architecture

| Layer | Framework | Location | Count |
|-------|-----------|----------|-------|
| Unit & Integration | Vitest / Jest | `backend/src/__tests__/` | 3,500+ |
| Property-Based Fuzzing | Custom | Verification scripts | 201,750+ steps |
| DCII Service Tests | Vitest | `backend/src/__tests__/` | 52 (100% passing) |
| Collapse Mode Scenarios | Vitest | `backend/src/__tests__/` | 73 (100% passing) |
| Council Flow Tests | Vitest | `backend/src/__tests__/` | 44 (100% passing) |
| Frontend Type Safety | TypeScript (`tsc --noEmit`) | Entire `src/` | 0 errors required |
| Backend Type Safety | TypeScript (`tsc --noEmit`) | Entire `backend/src/` | 0 errors required |

---

## 3. Running Tests

### 3.1 Full Test Suite
```bash
# Backend tests
cd backend && npm test

# Frontend type check
npx tsc --noEmit

# Backend type check
cd backend && npx tsc --noEmit
```

### 3.2 Specific Test Files
```bash
cd backend && npx vitest run src/__tests__/dcii/
cd backend && npx vitest run src/__tests__/integration/ollama.integration.test.ts
```

### 3.3 Watch Mode (Development)
```bash
cd backend && npx vitest --watch
```

### 3.4 Coverage Report
```bash
cd backend && npx vitest run --coverage
```

---

## 4. Test Categories

### 4.1 DCII Service Tests (52 tests)
| Service | Test File | Tests | Status |
|---------|-----------|-------|--------|
| CendiaIISS™ | `dcii/iiss.test.ts` | 15 | ✅ 100% |
| CendiaMediaAuth™ | `dcii/media-auth.test.ts` | 10 | ✅ 100% |
| CendiaJurisdiction™ | `dcii/jurisdiction.test.ts` | 10 | ✅ 100% |
| CendiaTimestamp™ | `dcii/timestamp.test.ts` | 10 | ✅ 100% |
| CendiaSimilarity™ | `dcii/similarity.test.ts` | 7 | ✅ 100% |

### 4.2 Collapse Mode Tests (73 tests)
Tests 18 adversarial agents across 7 failure domains, Trust Delta calculations, and Failure Envelope generation.

### 4.3 Council Flow Tests (44 tests)
Tests deliberation lifecycle, agent voting, consensus calculation, and decision packet generation.

### 4.4 Sovereign Service Tests
| Service | Tests |
|---------|-------|
| CendiaBlackBox™ | 14 |
| CendiaMirage™ | 17 |

---

## 5. Test Writing Standards

### 5.1 Test File Naming
```
<service-name>.test.ts           # Unit tests
<service-name>.integration.test.ts  # Integration tests
```

### 5.2 Test Structure
```typescript
describe('ServiceName', () => {
  describe('methodName', () => {
    it('should handle normal case', () => { ... });
    it('should handle edge case', () => { ... });
    it('should throw on invalid input', () => { ... });
  });
});
```

### 5.3 Required Coverage for New Code
| Area | Minimum Coverage |
|------|-----------------|
| DCII services | 100% |
| API routes | 90% |
| Business logic | 85% |
| Utility functions | 80% |
| UI components | 70% (type safety) |

---

## 6. Pre-Merge Testing Checklist

- [ ] `npx tsc --noEmit` passes (frontend) — 0 errors
- [ ] `cd backend && npx tsc --noEmit` passes — 0 errors
- [ ] `cd backend && npm test` passes — all tests green
- [ ] No skipped tests without documented reason
- [ ] New features have corresponding test coverage
- [ ] No regression in existing test counts

---

## 7. Property-Based Fuzzing

The platform uses property-based fuzzing to stress-test edge cases:
- **201,750+ verification steps** per build
- Tests security boundaries, input validation, and failure modes
- Generates randomized scenarios to find edge cases
- Runs as part of CI/CD pipeline

---

## 8. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Tests hang | Database connection timeout | Ensure Docker services running |
| Snapshot mismatch | UI change not updated | Run `npx vitest --update` |
| Flaky tests | Race conditions or timing | Add proper async/await, increase timeouts |
| Import errors | Missing dependency | Run `npm install` |
| Env-dependent test fails | Missing env var | Check test setup for required env vars |

---

## 9. Verified Against

- `COMPREHENSIVE_TEST_REPORT.md`: Test counts and categories
- `COMPLETE_SERVICE_MATRIX.md`: DCII 52/52 tests, Collapse 73/73, Council 44/44
- Backend test directory: `backend/src/__tests__/`
- `package.json`: test scripts configuration

---

*Datacendia, LLC — Proprietary and Confidential*
