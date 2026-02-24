# SOP-007: API Key & Secret Management

**Category:** Security
**Priority:** Critical
**Owner:** Security Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/index.ts`, `DEPLOYMENT_GUIDE.md`)

---

## 1. Purpose

Define procedures for generating, storing, rotating, and revoking all secrets and API keys used by the Datacendia platform.

---

## 2. Secret Inventory

| Secret | Purpose | Storage | Rotation Frequency |
|--------|---------|---------|-------------------|
| `JWT_SECRET` | Access token signing | `.env` file | 90 days |
| `JWT_REFRESH_SECRET` | Refresh token signing | `.env` file | 90 days |
| `DATABASE_URL` (password) | PostgreSQL access | `.env` file | 90 days |
| `REDIS_PASSWORD` | Redis authentication | `.env` file | 90 days |
| `NEO4J_PASSWORD` | Neo4j access | `.env` file | 90 days |
| `KEYCLOAK_CLIENT_SECRET` | SSO client auth | `.env` file | Per Keycloak policy |
| SSL private key | HTTPS termination | `/etc/ssl/private/` | On certificate renewal |

---

## 3. Secret Generation

### 3.1 Generate Cryptographic Secrets
```bash
# JWT secrets (64-byte base64-encoded)
openssl rand -base64 64

# Database/Redis passwords (32-byte base64-encoded)
openssl rand -base64 32

# API keys (URL-safe)
openssl rand -hex 32
```

### 3.2 Minimum Requirements
| Secret Type | Min Length | Format |
|-------------|-----------|--------|
| JWT secrets | 32 characters | Base64 string |
| Database passwords | 16 characters | Alphanumeric + special |
| Redis password | 16 characters | Alphanumeric |
| API keys | 32 characters | Hex string |

---

## 4. Secret Storage

### 4.1 Development
- Secrets stored in `backend/.env` (gitignored)
- Never commit `.env` files to version control
- Use `.env.example` as a template (no real values)

### 4.2 Production
- Use environment variables injected by orchestrator (Docker secrets, Kubernetes secrets, or cloud KMS)
- Never store production secrets in files on disk
- Use hardware security modules (HSM) where available

### 4.3 Prohibited Practices
- ❌ Hardcoding secrets in source code
- ❌ Committing `.env` files to Git
- ❌ Sharing secrets via email, Slack, or chat
- ❌ Using the same secret across environments
- ❌ Using default/example secrets in production

---

## 5. Secret Rotation Procedure

### 5.1 JWT Secret Rotation
1. Generate new secret: `openssl rand -base64 64`
2. Update `JWT_SECRET` in production `.env`
3. Restart backend services: `docker compose restart backend`
4. **Impact:** All existing access tokens invalidated; users must re-login
5. Refresh tokens signed with `JWT_REFRESH_SECRET` are unaffected unless that is also rotated

### 5.2 Database Password Rotation
1. Generate new password: `openssl rand -base64 32`
2. Update PostgreSQL user password:
   ```sql
   ALTER USER datacendia WITH PASSWORD 'new_password';
   ```
3. Update `DATABASE_URL` in `.env`
4. Restart backend: `docker compose restart backend`
5. Verify connection: check backend logs for Prisma queries

### 5.3 Redis Password Rotation
1. Generate new password
2. Update Redis configuration:
   ```bash
   redis-cli CONFIG SET requirepass new_password
   ```
3. Update `REDIS_PASSWORD` or `REDIS_URL` in `.env`
4. Restart backend

---

## 6. API Key Management (Client-Facing)

### 6.1 Issue API Key
```bash
# Via admin API
curl -X POST http://localhost:3001/api/v1/settings/api-keys \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Client Integration","scopes":["read","write"]}'
```

### 6.2 Revoke API Key
```bash
curl -X DELETE http://localhost:3001/api/v1/settings/api-keys/<key_id> \
  -H "Authorization: Bearer <admin_token>"
```

### 6.3 Key Scopes
| Scope | Access Level |
|-------|-------------|
| `read` | GET endpoints only |
| `write` | GET + POST + PUT |
| `admin` | Full access including DELETE |
| `council` | AI Council deliberation endpoints |
| `dcii` | DCII scoring and assessment endpoints |

---

## 7. Audit Trail

All secret-related operations must be logged:
- Secret creation timestamp
- Secret rotation timestamp
- Accessor identity
- API key usage (rate, endpoints accessed)

The CendiaLedger™ provides immutable audit records for all authentication events.

---

## 8. Emergency Procedures

### 8.1 Suspected Secret Compromise
1. **Immediately** rotate the compromised secret
2. Revoke all associated tokens/sessions
3. Review audit logs for unauthorized access
4. Notify security team and document incident (see SOP-008)
5. Issue new credentials to affected users

### 8.2 Lost Secrets
1. Generate new secrets using procedures in Section 3
2. Update all environments
3. Restart affected services
4. Re-issue API keys to clients if needed

---

## 9. Verified Against

- `backend/src/config/index.ts`: Zod validation enforces `jwtSecret.min(32)`, `jwtRefreshSecret.min(32)`
- `DEPLOYMENT_GUIDE.md`: Secret generation procedures, production security checklist
- `backend/.gitignore`: `.env` files excluded from version control
- `src/lib/api/client.ts`: Token storage in localStorage (`dc_access_token`, `dc_refresh_token`)

---

*Datacendia, LLC — Proprietary and Confidential*
