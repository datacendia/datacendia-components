# Datacendia Platform — Authentication & Authorization Flow

> **Source:** `backend/src/middleware/auth.ts`, `backend/src/routes/auth.ts`, `backend/src/websocket/index.ts`
> **Tech:** JWT (jose), bcrypt, Redis token blacklist, Zod validation
> **Roles:** OWNER → SUPER_ADMIN → ADMIN → ANALYST → VIEWER

## Complete Authentication Pipeline

```mermaid
flowchart TD
    A["User submits email + password"] --> B["Zod validates input<br/>(email format, password min 8)"]
    B --> C["prisma.users.findUnique({email})"]
    C --> D{User exists?}
    D -->|No| E["401: Invalid email or password"]
    D -->|Yes| F{Status ACTIVE?}
    F -->|No| G["401: Account not active"]
    F -->|Yes| H{Not deleted?}
    H -->|No| I["401: Account deleted"]
    H -->|Yes| J["bcrypt.compare(password, hash)"]
    J --> K{Valid?}
    K -->|No| L["Log failed attempt + 401"]
    K -->|Yes| M["Generate Access Token (1h)"]
    M --> N["Generate Refresh Token (30d)"]
    N --> O["Hash refresh token → sessions table"]
    O --> P["Update last_login_at"]
    P --> Q["Create audit_log: user.login"]
    Q --> R["Return tokens + user data"]

    style M fill:#6366f1,color:#fff
    style E fill:#ef4444,color:#fff
    style R fill:#10b981,color:#fff
```

## Token Lifecycle

```mermaid
stateDiagram-v2
    [*] --> AccessToken: Login/Register
    AccessToken --> Valid: Within 1 hour
    Valid --> Expired: After 1 hour
    Expired --> Refreshed: POST /auth/refresh
    Refreshed --> AccessToken: New access token
    Expired --> LoggedOut: No refresh

    AccessToken --> Blacklisted: POST /auth/logout
    Blacklisted --> [*]: Token in Redis blacklist

    state RefreshToken {
        [*] --> Active: Created at login
        Active --> SessionValid: Within 30 days
        SessionValid --> Used: bcrypt compare passes
        Used --> NewAccess: Generate fresh token
        Active --> SessionExpired: After 30 days
    }
```

## Registration Flow

```mermaid
flowchart TD
    A["POST /auth/register"] --> B["Zod: email, password, name, orgName"]
    B --> C["Check email uniqueness"]
    C --> D{Email taken?}
    D -->|Yes| E["409: Email already registered"]
    D -->|No| F["$transaction starts"]

    F --> G["Create organization<br/>(slug = name-kebab + timestamp)"]
    G --> H["bcrypt.hash(password, 12)"]
    H --> I["Create user (role: ADMIN)"]
    I --> J["Generate verification token<br/>(crypto.randomBytes(32))"]
    J --> K["Create email_verifications record"]
    K --> L["Send verification email"]

    L --> M["Generate access + refresh tokens"]
    M --> N["Create session"]
    N --> O["Return tokens + user + org"]

    style F fill:#6366f1,color:#fff
    style O fill:#10b981,color:#fff
```

## Role-Based Access Control (RBAC)

```mermaid
flowchart TB
    subgraph "Role Hierarchy"
        OWNER["OWNER<br/>Full platform control<br/>Bypasses all filters"]
        SA["SUPER_ADMIN<br/>All admin capabilities<br/>Cross-org access"]
        ADMIN["ADMIN<br/>Organization management<br/>User CRUD, settings"]
        ANALYST["ANALYST<br/>Read + write data<br/>Run deliberations"]
        VIEWER["VIEWER<br/>Read-only access<br/>View dashboards"]
    end

    OWNER --> SA --> ADMIN --> ANALYST --> VIEWER

    subgraph "Permission Matrix"
        P1["Council Queries: ANALYST+"]
        P2["Create Deliberations: ANALYST+"]
        P3["Manage Users: ADMIN+"]
        P4["System Settings: ADMIN+"]
        P5["Feature Toggles: OWNER"]
        P6["License Management: OWNER"]
        P7["View Dashboards: VIEWER+"]
    end

    style OWNER fill:#ef4444,color:#fff
    style SA fill:#f59e0b,color:#fff
    style ADMIN fill:#6366f1,color:#fff
    style ANALYST fill:#3b82f6,color:#fff
    style VIEWER fill:#10b981,color:#fff
```

## Request Authentication Middleware

```mermaid
flowchart TD
    A["Incoming API Request"] --> B["Extract Authorization header"]
    B --> C{Header present?}
    C -->|No| D["401: Authentication required"]
    C -->|Yes| E["Strip 'Bearer ' prefix"]
    E --> F["Check Redis blacklist"]
    F --> G{Blacklisted?}
    G -->|Yes| H["401: Token revoked"]
    G -->|No| I["jose.jwtVerify(token, secret)"]
    I --> J{Valid signature + not expired?}
    J -->|No| K["401: Invalid token"]
    J -->|Yes| L["Extract: id, email, orgId, role"]
    L --> M["Fetch user from DB (cached)"]
    M --> N{User still active?}
    N -->|No| O["401: Account disabled"]
    N -->|Yes| P["Attach req.user"]
    P --> Q["Continue to route handler ✓"]

    style I fill:#6366f1,color:#fff
    style D fill:#ef4444,color:#fff
    style Q fill:#10b981,color:#fff
```

## MFA (Multi-Factor Authentication) Flow

```mermaid
flowchart TD
    A["User enables MFA"] --> B["Generate TOTP secret"]
    B --> C["Encrypt secret → users.mfa_secret"]
    C --> D["Generate backup codes (encrypted)"]
    D --> E["Show QR code to user"]
    E --> F["User scans with authenticator app"]

    G["Login with MFA enabled"] --> H["Verify email + password"]
    H --> I{MFA enabled?}
    I -->|No| J["Return tokens directly"]
    I -->|Yes| K["Return partial auth + MFA challenge"]
    K --> L["User enters 6-digit TOTP code"]
    L --> M["Verify TOTP against secret"]
    M --> N{Valid?}
    N -->|Yes| O["Return full tokens"]
    N -->|No| P{Backup code?}
    P -->|Yes| Q["Verify backup code (one-time)"]
    P -->|No| R["401: Invalid MFA code"]

    style E fill:#6366f1,color:#fff
    style O fill:#10b981,color:#fff
    style R fill:#ef4444,color:#fff
```

## CSRF Protection Pipeline

```mermaid
flowchart TD
    A["GET /api/v1/csrf-token"] --> B["Generate double-submit token"]
    B --> C["Set as HttpOnly cookie + return in body"]

    D["Subsequent POST/PUT/DELETE"] --> E["ensureCsrfToken middleware"]
    E --> F{Token in cookie?}
    F -->|No| G["Reject: No CSRF token"]
    F -->|Yes| H{Production mode?}
    H -->|No| I["Skip validation (dev mode)"]
    H -->|Yes| J["csrfProtection middleware"]
    J --> K{Cookie matches header?}
    K -->|Yes| L["Request allowed ✓"]
    K -->|No| M["403: CSRF validation failed"]

    style C fill:#6366f1,color:#fff
    style L fill:#10b981,color:#fff
    style M fill:#ef4444,color:#fff
```

## Password Reset Flow

```mermaid
flowchart TD
    A["POST /auth/forgot-password"] --> B["Find user by email"]
    B --> C{User exists?}
    C -->|No| D["Return success anyway<br/>(prevent email enumeration)"]
    C -->|Yes| E["Generate reset token<br/>(crypto.randomBytes(32))"]
    E --> F["Delete existing reset tokens"]
    F --> G["Create password_resets record<br/>(expires: 1 hour)"]
    G --> H["Send reset email"]
    H --> D

    I["POST /auth/reset-password"] --> J["Find token in DB"]
    J --> K{Token valid + not expired + not used?}
    K -->|No| L["400: Invalid/expired token"]
    K -->|Yes| M["bcrypt.hash(newPassword, 12)"]
    M --> N["$transaction:"]
    N --> O["1. Update password_hash"]
    N --> P["2. Mark token as used"]
    N --> Q["3. Delete all sessions (force re-login)"]
    O & P & Q --> R["200: Password reset ✓"]

    style E fill:#6366f1,color:#fff
    style R fill:#10b981,color:#fff
```
