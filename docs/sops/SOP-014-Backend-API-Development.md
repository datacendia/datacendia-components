# SOP-014: Backend API Development Standards

**Category:** Development
**Priority:** Medium
**Owner:** Backend Lead
**Last Verified:** 2026-02-22 (against `backend/src/routes/`, `backend/src/config/index.ts`)

---

## 1. Purpose

Define backend API development standards, route conventions, error handling, and middleware usage for the Datacendia Express backend.

---

## 2. Technology Stack

| Technology | Purpose |
|-----------|---------|
| Express.js | HTTP server framework |
| TypeScript | Type safety |
| Prisma | PostgreSQL ORM |
| Zod | Request validation |
| Winston/custom logger | Structured logging |
| JWT (jsonwebtoken) | Authentication tokens |
| Socket.IO | Real-time WebSocket |
| Neo4j Driver | Graph database access |

---

## 3. Project Structure

```
backend/src/
├── config/           # Configuration (index.ts, aiModels.ts, models.ts)
├── core/             # Core services (PlatformServices.ts)
├── features/         # Feature modules (holy-shit/, etc.)
├── middleware/        # Express middleware (auth, rate-limit, etc.)
├── prisma/           # Prisma schema and migrations
├── routes/           # API route handlers
│   ├── domains/      # Domain routers (platform.domain.ts, etc.)
│   ├── admin.ts
│   ├── auth.ts
│   ├── auto-heal.ts
│   ├── collapse.ts
│   ├── contact.ts
│   ├── council.ts
│   ├── marketing-leads.ts
│   ├── models.ts
│   └── ...
├── services/         # Business logic services
│   ├── dcii/         # DCII services (IISSService, MediaAuth, etc.)
│   ├── sovereign/    # Sovereign services
│   ├── llm/          # LLM/embedding services
│   ├── admin/        # Admin services
│   └── ollama.ts     # Ollama client singleton
├── utils/            # Utilities (logger.ts, errors.ts)
└── __tests__/        # Test files
```

---

## 4. Route Development Standards

### 4.1 Route File Template
```typescript
import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { logger } from '../utils/logger.js';

const router = Router();

// Zod schema for request validation
const createSchema = z.object({
  name: z.string().min(1),
  type: z.enum(['typeA', 'typeB']),
});

// POST /api/v1/<domain>
router.post('/', async (req: Request, res: Response) => {
  try {
    const validated = createSchema.parse(req.body);
    // Business logic...
    return res.json({ success: true, data: result });
  } catch (error: any) {
    logger.error('[RouteName] Error:', error.message);
    return res.status(500).json({
      success: false,
      error: { code: 'INTERNAL_ERROR', message: error.message },
    });
  }
});

export default router;
```

### 4.2 Response Format (Standard)
```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 100,
    "totalPages": 5
  }
}
```

### 4.3 Error Response Format
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable message",
    "details": {}
  }
}
```

### 4.4 HTTP Status Codes
| Code | Usage |
|------|-------|
| 200 | Successful GET, PUT |
| 201 | Successful POST (created) |
| 400 | Validation error, bad request |
| 401 | Unauthenticated |
| 403 | Unauthorized (insufficient role) |
| 404 | Resource not found |
| 429 | Rate limit exceeded |
| 500 | Internal server error |
| 502 | Upstream service error (Ollama, external API) |

---

## 5. Route Registration

Routes are registered in domain routers under `backend/src/routes/domains/`:

```typescript
// backend/src/routes/domains/platform.domain.ts
import newRoutes from '../new-route.js';
router.use('/new-route', newRoutes);
```

**Important:** Use `.js` extension in imports (ESM module resolution).

---

## 6. Middleware

### 6.1 Authentication
- `devAuth` middleware: Bypasses auth in development, enforces JWT in production
- Applied to all `/api/v1/` routes (except public endpoints)

### 6.2 Validation
- Use Zod schemas for all request body validation
- Validate at the route handler level
- Return 400 with specific field errors

### 6.3 Error Handling
- Catch all errors in route handlers
- Log with structured logger
- Never expose stack traces to clients in production
- Use `getErrorMessage()` utility for safe error extraction

---

## 7. Database Access

### 7.1 Prisma Usage
```typescript
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Query
const result = await prisma.organization.findUnique({
  where: { id: orgId },
  include: { users: true },
});
```

### 7.2 DCII Write-Through Cache Pattern
All 5 DCII services use:
1. In-memory Map for fast reads
2. Prisma write-through to PostgreSQL
3. Graceful fallback to demo data if DB unavailable

---

## 8. Logging

```typescript
import { logger } from '../utils/logger.js';

logger.info('[ServiceName] Operation completed', { key: 'value' });
logger.warn('[ServiceName] Warning condition', { detail });
logger.error('[ServiceName] Error occurred:', error.message);
```

### 8.1 Log Levels
| Level | Usage |
|-------|-------|
| `error` | Failures requiring attention |
| `warn` | Degraded operation, recoverable issues |
| `info` | Normal operations, state changes |
| `http` | HTTP request/response logging |
| `debug` | Detailed debugging (development only) |

---

## 9. Pre-Commit Checklist

- [ ] `cd backend && npx tsc --noEmit` — 0 TypeScript errors
- [ ] `cd backend && npm test` — all tests pass
- [ ] Route registered in appropriate domain router
- [ ] Request validation with Zod schemas
- [ ] Error handling with proper status codes
- [ ] Structured logging for all operations
- [ ] API documented (endpoint, method, request/response)

---

## 10. Verified Against

- `backend/src/routes/domains/platform.domain.ts`: 20+ route registrations
- `backend/src/config/index.ts`: Zod config validation pattern
- `backend/src/routes/auto-heal.ts`: Recent route following standards
- `backend/src/routes/marketing-leads.ts`: Recent route following standards
- `backend/src/services/ollama.ts`: Service singleton pattern

---

*Datacendia, LLC — Proprietary and Confidential*
