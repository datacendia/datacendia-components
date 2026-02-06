# TypeScript Strictness Remediation Plan

**Version:** 1.0  
**Created:** January 30, 2026  
**Priority:** Medium  
**Status:** In Progress

---

## 1. Current State

| Location | `any` Count | Files | Priority |
|----------|-------------|-------|----------|
| **Backend** | 1,037 | 169 | High |
| **Frontend** | 173 | 44 | Medium |
| **Total** | 1,210 | 213 | - |

### 1.1 Top Offenders (Backend)

| File | Count | Primary Issue |
|------|-------|---------------|
| `routes/pillars.ts` | 53 | `catch (error: any)`, type casts |
| `routes/strategic.ts` | 45 | `catch (error: any)`, type casts |
| `routes/sovereign-security.ts` | 40 | `catch (error: any)`, type casts |
| `routes/sovereign.ts` | 38 | `catch (error: any)`, type casts |
| `__tests__/security/DefenseInDepth.test.ts` | 31 | Test mocks |
| `routes/sovereign-organs.ts` | 30 | `catch (error: any)`, type casts |

---

## 2. Issue Categories

### 2.1 Error Handling (80% of issues)

**Problem:**
```typescript
// BAD: Using any for error
catch (error: any) {
  res.status(500).json({ error: error.message });
}
```

**Solution:**
```typescript
// GOOD: Type-safe error handling
catch (error: unknown) {
  const message = error instanceof Error ? error.message : 'Unknown error';
  res.status(500).json({ error: message });
}

// OR: Use utility function
import { getErrorMessage } from '../utils/errors';

catch (error) {
  res.status(500).json({ error: getErrorMessage(error) });
}
```

### 2.2 Type Casts (15% of issues)

**Problem:**
```typescript
// BAD: Casting to any
const data = req.body as any;
const category = getQueryString(req, 'category') as any;
```

**Solution:**
```typescript
// GOOD: Define proper types
interface CreateMetricRequest {
  name: string;
  value: number;
  category: MetricCategory;
}

const data = req.body as CreateMetricRequest;
```

### 2.3 Dynamic Object Access (5% of issues)

**Problem:**
```typescript
// BAD: Dynamic property access
const value = obj[key as any];
```

**Solution:**
```typescript
// GOOD: Type-safe access
const value = (obj as Record<string, unknown>)[key];

// OR: Use type guard
function hasProperty<K extends string>(obj: unknown, key: K): obj is { [P in K]: unknown } {
  return typeof obj === 'object' && obj !== null && key in obj;
}
```

---

## 3. Utility Functions

Create `backend/src/utils/errors.ts`:

```typescript
/**
 * Safely extract error message from unknown error
 */
export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An unknown error occurred';
}

/**
 * Safely extract error stack from unknown error
 */
export function getErrorStack(error: unknown): string | undefined {
  if (error instanceof Error) {
    return error.stack;
  }
  return undefined;
}

/**
 * Type guard for checking if error is an Error instance
 */
export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

/**
 * Wrap unknown error in Error instance
 */
export function ensureError(error: unknown): Error {
  if (error instanceof Error) {
    return error;
  }
  return new Error(getErrorMessage(error));
}
```

---

## 4. Remediation Strategy

### 4.1 Phase 1: Create Infrastructure (Week 1)

- [x] Create `utils/errors.ts` with helper functions
- [ ] Create shared request/response types
- [ ] Add ESLint rule to prevent new `any` usage

### 4.2 Phase 2: Fix Routes (Week 2-3)

Priority order:
1. `routes/pillars.ts` (53)
2. `routes/strategic.ts` (45)
3. `routes/sovereign-security.ts` (40)
4. `routes/sovereign.ts` (38)
5. `routes/sovereign-organs.ts` (30)

### 4.3 Phase 3: Fix Services (Week 4-5)

1. `services/CendiaCrucibleService.ts` (23)
2. `services/cortex/types.ts` (22)
3. `services/crucible/EnterpriseRedTeamService.ts` (21)
4. Remaining services

### 4.4 Phase 4: Fix Tests (Week 6)

Tests can use `any` more liberally for mocking, but reduce where practical.

---

## 5. ESLint Configuration

Add to `.eslintrc.js`:

```javascript
module.exports = {
  rules: {
    '@typescript-eslint/no-explicit-any': 'warn', // Start with warn
    '@typescript-eslint/no-unsafe-assignment': 'warn',
    '@typescript-eslint/no-unsafe-member-access': 'warn',
    '@typescript-eslint/no-unsafe-call': 'warn',
    '@typescript-eslint/no-unsafe-return': 'warn',
  },
};
```

---

## 6. Automated Fix Script

Create `scripts/fix-any-types.ts`:

```typescript
#!/usr/bin/env ts-node

import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const ERROR_ANY_PATTERN = /catch\s*\(\s*(\w+)\s*:\s*any\s*\)/g;

function fixErrorAny(content: string): string {
  // Replace catch (error: any) with catch (error: unknown)
  let fixed = content.replace(ERROR_ANY_PATTERN, 'catch ($1: unknown)');
  
  // Add error message extraction where error.message is used
  fixed = fixed.replace(
    /(\w+)\.message(?!\s*\?)/g,
    (match, varName) => {
      // Only replace if this looks like an error variable
      if (['error', 'err', 'e'].includes(varName)) {
        return `(${varName} instanceof Error ? ${varName}.message : 'Unknown error')`;
      }
      return match;
    }
  );
  
  return fixed;
}

async function main() {
  const files = glob.sync('backend/src/**/*.ts', {
    ignore: ['**/node_modules/**', '**/*.d.ts'],
  });
  
  let totalFixed = 0;
  
  for (const file of files) {
    const content = fs.readFileSync(file, 'utf-8');
    const fixed = fixErrorAny(content);
    
    if (content !== fixed) {
      fs.writeFileSync(file, fixed);
      console.log(`Fixed: ${file}`);
      totalFixed++;
    }
  }
  
  console.log(`\nTotal files fixed: ${totalFixed}`);
}

main().catch(console.error);
```

---

## 7. Progress Tracking

| File | Status | Date | Notes |
|------|--------|------|-------|
| `utils/errors.ts` | ✅ Created | Jan 30 | Helper functions |
| `routes/pillars.ts` | 🔄 In Progress | - | - |
| `routes/strategic.ts` | ⏳ Pending | - | - |
| ... | | | |

---

## 8. Success Metrics

| Metric | Current | Target | Timeline |
|--------|---------|--------|----------|
| Backend `any` count | 1,037 | < 100 | 6 weeks |
| Frontend `any` count | 173 | < 50 | 4 weeks |
| New `any` additions | N/A | 0 | Ongoing |

---

*Document Owner: Engineering Team*  
*Review Cycle: Weekly during remediation*
