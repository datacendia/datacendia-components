# DATACENDIA API DOCUMENTATION
**Version:** 4.5  
**Base URL:** `http://localhost:3001/api/v1`  
**Last Updated:** February 4, 2026

---

## WHAT THIS IS

This document explains how to use the Datacendia API. The API lets you:
- Create AI-powered deliberations
- Manage decisions and workflows
- Access enterprise connectors
- Monitor platform health

**Authentication:** Most endpoints require a JWT token obtained from `/auth/login`

---

## QUICK START

### 1. Login
```bash
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "your-email@company.com",
  "password": "your-password"
}

Response:
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGc...",
    "refreshToken": "eyJhbGc...",
    "user": { "id": "...", "email": "..." }
  }
}
```

### 2. Use Token in Requests
```bash
GET /api/v1/auth/me
Authorization: Bearer eyJhbGc...
```

---

## CORE ENDPOINTS

### Authentication

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/auth/login` | Login with email/password | No |
| POST | `/auth/refresh` | Refresh access token | No |
| GET | `/auth/me` | Get current user | Yes |
| POST | `/auth/logout` | Logout | Yes |

### Council & Deliberations

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/council/agents` | List all AI agents | Yes |
| POST | `/council/deliberate` | Start new deliberation | Yes |
| GET | `/deliberations` | List deliberations | Yes |
| GET | `/deliberations/:id` | Get specific deliberation | Yes |
| POST | `/deliberations/:id/start` | Start pending deliberation | Yes |

### Decisions

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/decisions` | List all decisions | Yes |
| POST | `/decisions` | Create new decision | Yes |
| GET | `/decisions/:id` | Get specific decision | Yes |
| PUT | `/decisions/:id` | Update decision | Yes |
| POST | `/decisions/:id/sign` | Sign decision | Yes |

### Enterprise Connectors

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/enterprise-connectors/list` | List available connectors | Yes |
| GET | `/enterprise-connectors/:id` | Get connector details | Yes |
| POST | `/enterprise-connectors/:id/oauth/authorize` | Get OAuth URL | Yes |
| POST | `/enterprise-connectors/:id/oauth/callback` | Handle OAuth callback | Yes |
| POST | `/enterprise-connectors/:id/connect` | Connect to service | Yes |
| POST | `/enterprise-connectors/:id/fetch` | Fetch data | Yes |

### Health & Monitoring

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/health` | System health status | No |
| GET | `/metrics` | Prometheus metrics | No |
| GET | `/i18n/languages` | List supported languages | No |
| GET | `/integrations` | List available integrations | No |

---

## ENTERPRISE PLATINUM ENDPOINTS (New - February 2026)

### AI Constitutional Court (`/constitutional-court`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/constitutional-court/health` | Service health | No |
| GET | `/constitutional-court/principles` | List constitutional principles | Yes |
| POST | `/constitutional-court/disputes` | File a new dispute | Yes |
| GET | `/constitutional-court/disputes/:id` | Get dispute details | Yes |
| POST | `/constitutional-court/disputes/:id/schedule-hearing` | Schedule hearing | Yes |
| POST | `/constitutional-court/disputes/:id/deliberate` | Run deliberation | Yes |
| POST | `/constitutional-court/disputes/:id/opinion` | Draft opinion | Yes |
| POST | `/constitutional-court/disputes/:id/resolve` | Resolve dispute | Yes |
| POST | `/constitutional-court/disputes/:id/appeal` | File appeal | Yes |
| GET | `/constitutional-court/precedents/search` | Search precedent database | Yes |

### Regulatory Sandbox (`/regulatory-sandbox`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/regulatory-sandbox/health` | Service health | No |
| GET | `/regulatory-sandbox/regulations` | List proposed regulations | Yes |
| GET | `/regulatory-sandbox/regulations/:id` | Get regulation details | Yes |
| POST | `/regulatory-sandbox/tests` | Create compliance test | Yes |
| POST | `/regulatory-sandbox/tests/:id/run` | Run test against system | Yes |
| GET | `/regulatory-sandbox/timeline` | Get regulatory timeline | Yes |

### Zero-Knowledge Proofs (`/zkp`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/zkp/health` | Service health | No |
| GET | `/zkp/proof-types` | List available proof types | Yes |
| POST | `/zkp/proofs/request` | Request new proof | Yes |
| POST | `/zkp/proofs/:id/generate` | Generate proof | Yes |
| POST | `/zkp/proofs/:id/verify` | Verify proof | Yes |
| POST | `/zkp/proofs/:id/revoke` | Revoke proof | Yes |
| GET | `/zkp/certificates` | List certificates | Yes |

### AI Insurance (`/ai-insurance`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/ai-insurance/health` | Service health | No |
| GET | `/ai-insurance/coverage-types` | List coverage types | Yes |
| POST | `/ai-insurance/quotes` | Request insurance quote | Yes |
| POST | `/ai-insurance/policies` | Bind new policy | Yes |
| GET | `/ai-insurance/policies/:id` | Get policy details | Yes |
| POST | `/ai-insurance/policies/:id/cover-decision` | Cover specific decision | Yes |
| POST | `/ai-insurance/claims` | File claim | Yes |
| GET | `/ai-insurance/claims/:id` | Get claim status | Yes |
| GET | `/ai-insurance/certificates/:id/verify` | Verify coverage certificate | Yes |

### Post-Quantum Cryptography (`/post-quantum`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/post-quantum/health` | Service health | No |
| GET | `/post-quantum/algorithms` | List supported algorithms | Yes |
| GET | `/post-quantum/recommend/:useCase` | Get algorithm recommendation | Yes |
| POST | `/post-quantum/keys` | Generate key pair | Yes |
| GET | `/post-quantum/keys` | List keys | Yes |
| POST | `/post-quantum/keys/:id/rotate` | Rotate key | Yes |
| POST | `/post-quantum/sign` | Sign data | Yes |
| POST | `/post-quantum/verify` | Verify signature | Yes |

### Carbon-Aware Scheduling (`/carbon-aware`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/carbon-aware/health` | Service health | No |
| GET | `/carbon-aware/intensity` | Get all region intensities | Yes |
| GET | `/carbon-aware/intensity/:region` | Get region intensity | Yes |
| POST | `/carbon-aware/workloads` | Submit workload | Yes |
| POST | `/carbon-aware/workloads/:id/schedule` | Schedule with optimization | Yes |
| POST | `/carbon-aware/workloads/:id/execute` | Execute workload | Yes |
| GET | `/carbon-aware/budget/:orgId` | Get carbon budget | Yes |
| GET | `/carbon-aware/report/:orgId` | Generate carbon report | Yes |

### Continuous Compliance Monitor (`/compliance-monitor`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/compliance-monitor/health` | Service health | No |
| GET | `/compliance-monitor/frameworks` | List supported frameworks | Yes |
| POST | `/compliance-monitor/initialize` | Initialize framework controls | Yes |
| POST | `/compliance-monitor/scan` | Run compliance scan | Yes |
| GET | `/compliance-monitor/controls/:orgId/:framework` | Get controls | Yes |
| GET | `/compliance-monitor/drifts` | Get recent drifts | Yes |
| GET | `/compliance-monitor/alerts/:orgId` | Get alerts | Yes |
| POST | `/compliance-monitor/alerts/:id/acknowledge` | Acknowledge alert | Yes |
| POST | `/compliance-monitor/alerts/:id/resolve` | Resolve alert | Yes |

### Cross-Jurisdiction Engine (`/cross-jurisdiction`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/cross-jurisdiction/health` | Service health | No |
| GET | `/cross-jurisdiction/jurisdictions` | List all jurisdictions | Yes |
| GET | `/cross-jurisdiction/jurisdictions/:id` | Get jurisdiction profile | Yes |
| POST | `/cross-jurisdiction/assess-transfer` | Assess cross-border transfer | Yes |
| POST | `/cross-jurisdiction/compliance-matrix` | Generate compliance matrix | Yes |
| POST | `/cross-jurisdiction/detect-conflicts` | Detect regulatory conflicts | Yes |
| POST | `/cross-jurisdiction/data-residency` | Get data residency rules | Yes |

---

## EXAMPLE: CREATE A DELIBERATION

```javascript
// 1. Login
const loginRes = await fetch('http://localhost:3001/api/v1/auth/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email: 'admin@datacendia.com',
    password: 'DatacendiaAdmin2024!'
  })
});
const { accessToken } = (await loginRes.json()).data;

// 2. Create deliberation
const deliberationRes = await fetch('http://localhost:3001/api/v1/council/deliberate', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${accessToken}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    question: 'Should we expand to the European market?',
    agents: ['cfo', 'coo', 'risk', 'cmo'],
    mode: 'war-room'
  })
});

const deliberation = await deliberationRes.json();
console.log('Deliberation created:', deliberation.data.id);
```

---

## RESPONSE FORMAT

All API responses follow this standard format:

### Success Response
```json
{
  "success": true,
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "Human-readable error message"
  }
}
```

---

## ERROR CODES

| Code | HTTP Status | Meaning |
|------|-------------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid auth token |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## RATE LIMITS

- **Development:** 1,000 requests per minute
- **Production:** 100 requests per minute

Rate limit headers:
- `X-RateLimit-Limit` - Total requests allowed
- `X-RateLimit-Remaining` - Requests remaining
- `X-RateLimit-Reset` - When limit resets

---

## PAGINATION

Endpoints that return lists support pagination:

```bash
GET /api/v1/decisions?page=1&limit=20

Response:
{
  "success": true,
  "data": [...],
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

---

## WEBSOCKET REAL-TIME UPDATES

Connect to WebSocket for real-time updates:

```javascript
import { io } from 'socket.io-client';

const socket = io('http://localhost:3001');

// Join deliberation room
socket.emit('join-deliberation', deliberationId);

// Listen for updates
socket.on('deliberation-update', (update) => {
  console.log('Agent response:', update.message);
});

// Listen for completion
socket.on('deliberation-complete', (summary) => {
  console.log('Deliberation complete:', summary);
});
```

---

## FULL API REFERENCE

For complete API documentation with all endpoints, request/response schemas, and examples:

**Swagger UI:** http://localhost:3001/api/docs (when backend is running)

---

*This is a simplified guide. For full technical details, see the Swagger documentation.*
