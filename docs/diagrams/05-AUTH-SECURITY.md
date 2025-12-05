# AUTHENTICATION & SECURITY FLOW

## Authentication Flow

```
                         ┌─────────────┐
                         │    USER     │
                         └──────┬──────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │     LOGIN PAGE        │
                    │   Email + Password    │
                    └───────────┬───────────┘
                                │
                                ▼
                    ┌───────────────────────┐
                    │   VALIDATE CREDS      │
                    │   bcrypt.compare()    │
                    └───────────┬───────────┘
                                │
               ┌────────────────┴────────────────┐
               │                                 │
               ▼                                 ▼
      ┌───────────────┐                 ┌───────────────┐
      │   INVALID     │                 │    VALID      │
      │   ❌ Error    │                 │   ✅ Continue │
      └───────────────┘                 └───────┬───────┘
                                                │
                                                ▼
                              ┌─────────────────────────┐
                              │    GENERATE JWT         │
                              │    (Jose library)       │
                              ├─────────────────────────┤
                              │  Payload:               │
                              │  • userId               │
                              │  • orgId                │
                              │  • roles[]              │
                              │  • permissions[]        │
                              │  • exp (24h)            │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │   SET COOKIES           │
                              │   • accessToken         │
                              │   • refreshToken        │
                              │   (HttpOnly, Secure)    │
                              └────────────┬────────────┘
                                           │
                                           ▼
                              ┌─────────────────────────┐
                              │   REDIRECT TO           │
                              │   /cortex/dashboard     │
                              └─────────────────────────┘
```

## RBAC Authorization Model

```
┌─────────────────────────────────────────────────────────┐
│                    USER                                  │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                    ROLES                                 │
├─────────────────────────────────────────────────────────┤
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐       │
│  │  Admin  │ │ Analyst │ │ Viewer  │ │Operator │       │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘       │
└────────────────────────┬────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────┐
│                  PERMISSIONS                             │
├─────────────────────────────────────────────────────────┤
│  council:read    │ council:write   │ decisions:create   │
│  decisions:approve│ agents:manage  │ audit:view         │
│  settings:modify │ users:manage   │ reports:export     │
└─────────────────────────────────────────────────────────┘
```

## Request Authorization Pipeline

```
┌──────────┐    ┌──────────┐    ┌──────────┐    ┌──────────┐
│  Client  │───►│   Auth   │───►│   RBAC   │───►│ Resource │
│  Request │    │Middleware│    │  Check   │    │ Handler  │
└──────────┘    └────┬─────┘    └────┬─────┘    └──────────┘
                     │               │
                     ▼               ▼
              ┌───────────┐   ┌───────────┐
              │ JWT Valid?│   │Permission │
              │           │   │ Granted?  │
              └─────┬─────┘   └─────┬─────┘
                    │               │
               Yes ─┴─ No      Yes ─┴─ No
                │     │         │     │
                │     ▼         │     ▼
                │  ┌──────┐     │  ┌──────┐
                │  │ 401  │     │  │ 403  │
                │  │Unauth│     │  │Forbid│
                │  └──────┘     │  └──────┘
                │               │
                └───────────────┘
                        │
                        ▼
                   ┌─────────┐
                   │   200   │
                   │ Success │
                   └─────────┘
```

## Security Headers (Helmet.js)

```
┌─────────────────────────────────────────────────────────┐
│               SECURITY HEADERS                           │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  X-Content-Type-Options: nosniff                        │
│  X-Frame-Options: DENY                                  │
│  X-XSS-Protection: 1; mode=block                        │
│  Strict-Transport-Security: max-age=31536000           │
│  Content-Security-Policy: default-src 'self'           │
│  Referrer-Policy: strict-origin-when-cross-origin      │
│                                                          │
└─────────────────────────────────────────────────────────┘
```

## Rate Limiting

```
┌─────────────────────────────────────────────────────────┐
│                 RATE LIMITER                             │
├─────────────────────────────────────────────────────────┤
│                                                          │
│  API Endpoints:                                          │
│  ├─ Standard: 100 requests / 15 min                     │
│  ├─ Auth: 5 requests / 15 min (per IP)                  │
│  ├─ AI Generation: 20 requests / min                    │
│  └─ Export: 10 requests / hour                          │
│                                                          │
│  Response when exceeded:                                 │
│  ┌─────────────────────────────────────────┐            │
│  │ 429 Too Many Requests                   │            │
│  │ Retry-After: 60                         │            │
│  └─────────────────────────────────────────┘            │
│                                                          │
└─────────────────────────────────────────────────────────┘
```
