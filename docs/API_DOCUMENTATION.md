# DATACENDIA API DOCUMENTATION
**Version:** 4.4  
**Base URL:** `http://localhost:3001/api/v1`

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
