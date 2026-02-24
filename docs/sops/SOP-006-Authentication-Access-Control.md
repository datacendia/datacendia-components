# SOP-006: User Authentication & Access Control

**Category:** Security
**Priority:** Critical
**Owner:** Security Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/index.ts`, `src/contexts/AuthContext.tsx`, `src/components/auth/ProtectedRoute.tsx`)

---

## 1. Purpose

Define procedures for user authentication, authorization, role-based access control (RBAC), and session management across the Datacendia platform.

---

## 2. Authentication Modes

| Mode | Branch | `REQUIRE_AUTH` | Behavior |
|------|--------|----------------|----------|
| **devAuth Bypass** | `main` | `false` | No login required; auto-assigned dev user |
| **JWT Authentication** | `demo`, `pilot` | `true` | Email/password login with JWT tokens |
| **Keycloak SSO** | `production` | `true` + `KEYCLOAK_ENABLED=true` | Enterprise SSO with SAML/OIDC |

---

## 3. JWT Token Architecture

### 3.1 Token Types
| Token | Storage | Expiry | Purpose |
|-------|---------|--------|---------|
| Access Token | `localStorage` (`dc_access_token`) | 1 hour | API authentication |
| Refresh Token | `localStorage` (`dc_refresh_token`) | 30 days | Access token renewal |

### 3.2 Token Flow
1. User submits credentials to `/api/v1/auth/login`
2. Backend validates and returns `accessToken` + `refreshToken`
3. Frontend stores tokens via `TokenManager`
4. All API requests include `Authorization: Bearer <accessToken>`
5. On 401, `TokenManager.refreshAccessToken()` attempts renewal
6. On refresh failure, user is redirected to `/login`

### 3.3 Token Refresh
The API client (`src/lib/api/client.ts`) automatically:
- Detects 401 responses
- Calls refresh endpoint
- Retries the original request with new token
- Redirects to `/login` if refresh fails

---

## 4. Role-Based Access Control (RBAC)

### 4.1 Roles
| Role | Access Level | Description |
|------|-------------|-------------|
| `VIEWER` | Read-only | View dashboards, reports |
| `ANALYST` | Read + Execute | Run deliberations, generate reports |
| `ADMIN` | Full org access | Manage users, settings, configurations |
| `SUPER_ADMIN` | Platform-wide | Cross-organization access |
| `OWNER` | Owner privileges | Bypasses all service filtering |

### 4.2 ProtectedRoute Component
Frontend routes use `ProtectedRoute` wrapper:
```tsx
<ProtectedRoute requiredRoles={['ADMIN', 'SUPER_ADMIN']}>
  <AdminPage />
</ProtectedRoute>
```

Checks:
1. `isAuthenticated` — redirects to `/auth/login` if false
2. `hasRole(requiredRoles)` — shows "Access Denied" if role insufficient
3. `hasPermission(requiredPermissions)` — granular permission check

### 4.3 Route Protection Architecture
| Route Path | Protection | Layout |
|------------|-----------|--------|
| `/`, `/pricing`, `/product`, etc. | Public (no auth) | `MarketingLayout` |
| `/auth/*` | Public | None |
| `/cortex/*` | Authenticated (CortexLayout) | `CortexLayout` |
| `/admin/*` | Admin role required | `CortexLayout` |

---

## 5. User Management Procedures

### 5.1 Create User (Development)
```bash
# Via Prisma seed
cd backend && npx prisma db seed
```

### 5.2 Create User (Demo)
Demo environment uses pre-configured credentials:
- Email: `admin@datacendia.com`
- Password: `DatacendiaAdmin2024!`
- Role: ADMIN

### 5.3 Create User (Production)
```bash
# Via API (requires ADMIN role)
curl -X POST http://localhost:3001/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"email":"user@company.com","password":"...","name":"User Name","role":"ANALYST"}'
```

### 5.4 Password Requirements
- Minimum 8 characters
- Validated server-side

---

## 6. Session Management

### 6.1 Session Lifecycle
1. **Login** → Tokens stored in localStorage
2. **Active** → Access token auto-refreshed before expiry
3. **Idle** → Token expiry after 1 hour (configurable)
4. **Logout** → Tokens cleared, redirected to `/login`
5. **Cross-tab** → Auth changes propagated via `onAuthChange` listener

### 6.2 Logout Procedure
```typescript
// Frontend: src/contexts/AuthContext.tsx
await logout(); // Clears tokens + state
navigate('/login');
```

---

## 7. Security Controls

| Control | Implementation | Location |
|---------|---------------|----------|
| Password hashing | bcrypt (12 rounds) | Backend auth service |
| Token signing | HMAC SHA-256 | `JWT_SECRET` env var |
| Rate limiting | Express rate-limit | Backend middleware |
| CORS | Allowed origins list | `CORS_ORIGINS` env var |
| HTTPS enforcement | `FORCE_HTTPS` flag | Production only |
| MFA | TOTP + backup codes | Fully implemented |

---

## 8. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Redirect loop at `/login` | Token expired, refresh failed | Clear `dc_access_token` and `dc_refresh_token` from localStorage |
| "Access Denied" page | Insufficient role | Check user role in database; upgrade if needed |
| CORS error on login | Wrong `CORS_ORIGINS` | Add frontend origin to `CORS_ORIGINS` env var |
| `REQUIRE_AUTH` ignored | Wrong `.env` loaded | Verify `backend/.env` has `REQUIRE_AUTH=true` |

---

## 9. Verified Against

- `backend/src/config/index.ts`: `requireAuth`, `jwtSecret`, `jwtRefreshSecret` config
- `src/contexts/AuthContext.tsx`: AuthProvider, login/logout/refresh logic
- `src/lib/api/client.ts`: TokenManager, 401 interceptor, auto-redirect
- `src/components/auth/ProtectedRoute.tsx`: Role and permission checks
- `src/routes.lazy.tsx`: Route protection architecture
- `DEPLOYMENT_GUIDE.md`: Environment-specific auth modes

---

*Datacendia, LLC — Proprietary and Confidential*
