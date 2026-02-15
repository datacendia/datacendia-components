# Datacendia Platform — Caching Strategy & Multi-Tenancy Isolation

> **Source:** `backend/src/middleware/cacheMiddleware.ts`, `backend/src/config/redis.ts`, `backend/src/services/EnhancedLLMService.ts`

## 4-Layer Caching Architecture

```mermaid
flowchart TD
    REQ["Incoming GET Request"] --> L1["Layer 1: Redis API Cache"]
    L1 --> H1{Hit?}
    H1 -->|Yes| R1["Return cached (< 1ms)"]
    H1 -->|No| L2["Layer 2: LLM Response Cache"]
    L2 --> H2{Hit?}
    H2 -->|Yes| R2["Return cached (< 5ms)"]
    H2 -->|No| L3["Layer 3: Translation Memory"]
    L3 --> H3{Hit?}
    H3 -->|Yes| R3["Return cached translation"]
    H3 -->|No| L4["Layer 4: Embedding Cache"]
    L4 --> H4{Hit?}
    H4 -->|Yes| R4["Return cached embedding"]
    H4 -->|No| COMPUTE["Full computation / LLM inference"]
    COMPUTE --> STORE["Store in all applicable caches"]

    style L1 fill:#10b981,color:#fff
    style L2 fill:#3b82f6,color:#fff
    style L3 fill:#6366f1,color:#fff
    style L4 fill:#8b5cf6,color:#fff
    style COMPUTE fill:#ef4444,color:#fff
```

## Layer 1: Redis API Cache (Universal)

```mermaid
flowchart TD
    A["GET /api/v1/* request"] --> B{Excluded path?}
    B -->|"Yes: /auth/, /csrf-token,<br/>/upload, /ws, /stream,<br/>/council/query,<br/>/marketing-studio,<br/>/platform-assistant"| C["Skip cache"]
    B -->|No| D["Generate cache key"]
    D --> E["Key = path + query + orgId"]
    E --> F{Redis GET}
    F -->|Hit| G["Return 200 + cached body<br/>Header: X-Cache: HIT"]
    F -->|Miss| H["Execute route handler"]
    H --> I["Intercept response"]
    I --> J["Redis SET with TTL"]
    J --> K["Return response<br/>Header: X-Cache: MISS"]

    L["POST/PUT/DELETE mutation"] --> M["Auto-invalidate related cache keys"]

    subgraph "TTL Configuration"
        T1["DECISIONS: 60s"]
        T2["METRICS: 30s"]
        T3["COMPLIANCE: 300s"]
        T4["HEALTH: 10s"]
        T5["STATIC: 3600s"]
    end

    style G fill:#10b981,color:#fff
    style M fill:#ef4444,color:#fff
```

## Layer 2: LLM Response Cache

```mermaid
flowchart TD
    A["LLM query received"] --> B["Compute query_hash<br/>(SHA-256 of prompt + model + temperature)"]
    B --> C["SELECT FROM llm_cache<br/>WHERE query_hash = ?<br/>AND expires_at > now()"]
    C --> D{Row exists?}
    D -->|Yes| E["Update hit_count++<br/>Update last_accessed_at"]
    E --> F["Return cached response"]
    D -->|No| G["Call Ollama API"]
    G --> H["INSERT INTO llm_cache"]
    H --> I["Fields: query_hash, model, prompt,<br/>response, tokens_in, tokens_out,<br/>latency_ms, temperature, expires_at"]

    style F fill:#10b981,color:#fff
    style G fill:#6366f1,color:#fff
```

## Layer 3: Translation Memory (OmniTranslate)

```mermaid
flowchart TD
    A["Translation request<br/>(source_text, source_lang, target_lang)"] --> B["Query omnitranslate_memory"]
    B --> C["Match: source_text + source_lang + target_lang"]
    C --> D{Match found?}
    D -->|Yes| E["Check quality score (0-1)"]
    E --> F{Quality >= 0.8?}
    F -->|Yes| G["Return cached + usage_count++"]
    F -->|No| H["Re-translate with LLM"]
    D -->|No| H
    H --> I["Store in omnitranslate_memory"]

    J["Glossary Override"] --> K["omnitranslate_glossary terms<br/>always applied post-translation"]

    style G fill:#10b981,color:#fff
    style H fill:#6366f1,color:#fff
```

## Cache Invalidation Strategy

```mermaid
flowchart TD
    A["Mutation Event<br/>(POST, PUT, DELETE)"] --> B["Identify affected cache scope"]

    B --> C["Path-based invalidation<br/>DELETE keys matching /api/v1/{resource}/*"]
    B --> D["Org-scoped invalidation<br/>DELETE keys for org:{orgId}"]
    B --> E["LLM cache: TTL expiry only<br/>(no manual invalidation)"]

    F["Redis Memory Pressure"] --> G["maxmemory-policy: allkeys-lru<br/>2GB limit"]
    G --> H["Least Recently Used eviction"]

    style A fill:#ef4444,color:#fff
    style G fill:#f59e0b,color:#fff
```

---

## Multi-Tenancy & Organization Isolation

```mermaid
flowchart TB
    subgraph "Tenant Hierarchy"
        T["Tenants (billing entity)"]
        O["Organizations (data scope)"]
        U["Users (actors)"]
    end

    T -->|"1:many"| L["Licenses"]
    T -->|"1:many"| TU["Tenant Usage"]
    T -->|"1:many"| TF["Tenant Feature Flags"]

    O -->|"1:many"| U
    O -->|"1:many"| D["Deliberations"]
    O -->|"1:many"| DS["Data Sources"]
    O -->|"1:many"| AL["Audit Logs"]
    O -->|"1:many"| ALL["All domain data"]

    style T fill:#6366f1,color:#fff
    style O fill:#3b82f6,color:#fff
```

## Data Isolation Architecture

```mermaid
flowchart TD
    A["API Request"] --> B["Auth Middleware:<br/>Extract organizationId from JWT"]
    B --> C["Attach req.user.organizationId"]
    C --> D["Route Handler"]
    D --> E["Prisma Query:<br/>WHERE organization_id = req.user.organizationId"]

    E --> F["PostgreSQL Row-Level Filtering"]

    G["WebSocket Room Isolation"] --> H["Auto-join org:{organizationId}"]
    H --> I["Events only broadcast to org room"]

    J["Redis Cache Isolation"] --> K["Cache key includes orgId:<br/>cache:{orgId}:{path}:{query}"]

    L["Audit Log Isolation"] --> M["Every action logged with<br/>organization_id + user_id"]

    style E fill:#6366f1,color:#fff
    style I fill:#10b981,color:#fff
```

## Tenant Plan Feature Matrix

```mermaid
flowchart LR
    subgraph "PILOT"
        P1["5 users<br/>3 deliberations/day<br/>Basic compliance<br/>Email support"]
    end

    subgraph "FOUNDATION"
        F1["25 users<br/>Unlimited deliberations<br/>5 compliance frameworks<br/>Priority support"]
    end

    subgraph "ENTERPRISE"
        E1["Unlimited users<br/>All compliance frameworks<br/>Custom agents<br/>SSO/SAML<br/>Dedicated support"]
    end

    subgraph "STRATEGIC"
        S1["Everything in Enterprise<br/>Sovereign deployment<br/>Air-gap support<br/>Custom SLA<br/>On-site training"]
    end

    P1 -->|"Upgrade"| F1 -->|"Upgrade"| E1 -->|"Upgrade"| S1

    style P1 fill:#10b981,color:#fff
    style E1 fill:#6366f1,color:#fff
    style S1 fill:#8b5cf6,color:#fff
```

## Feature Flag Isolation per Tenant

```mermaid
flowchart TD
    A["Feature check: isEnabled('sovereign-arch')"] --> B["Check tenant_feature_flags"]
    B --> C{Tenant override exists?}
    C -->|Yes| D["Use tenant-specific value"]
    C -->|No| E["Check global feature_flags"]
    E --> F{Flag type?}
    F -->|BOOLEAN| G["enabled: true/false"]
    F -->|PERCENTAGE| H["rollout_percentage: 0-100%<br/>Hash(tenantId) % 100 < percentage"]
    F -->|TENANT_LIST| I["Check if tenant in list"]
    F -->|USER_LIST| J["Check if user in list"]

    D & G & H & I & J --> K{Enabled?}
    K -->|Yes| L["Feature available ✓"]
    K -->|No| M["Feature hidden ✗"]

    style A fill:#6366f1,color:#fff
    style L fill:#10b981,color:#fff
    style M fill:#ef4444,color:#fff
```

## Usage Metering per Tenant

```mermaid
flowchart TD
    A["API call / Deliberation / Agent invocation"] --> B["Increment tenant_usage counters"]
    B --> C["Period: YYYY-MM format"]
    C --> D["Tracked metrics:"]
    D --> E["api_calls: total API requests"]
    D --> F["deliberations: council queries"]
    D --> G["active_users: unique logins"]
    D --> H["storage_used_mb: file storage"]
    D --> I["agent_invocations: LLM calls"]

    J["Billing cycle check"] --> K{Usage within plan limits?}
    K -->|Yes| L["Continue operating"]
    K -->|No| M["Rate limit / upgrade prompt"]

    style B fill:#6366f1,color:#fff
    style M fill:#f59e0b,color:#fff
```
