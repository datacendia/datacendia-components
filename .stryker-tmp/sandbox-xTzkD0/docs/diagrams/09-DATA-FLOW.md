# DATA FLOW ARCHITECTURE

## Complete Data Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        DATA SOURCES                                  │
├─────────────────────────────────────────────────────────────────────┤
│  External APIs │ Internal DBs │ File Uploads │ Real-time Streams   │
└────────┬────────────────┬────────────────┬────────────────┬─────────┘
         │                │                │                │
         └────────────────┴────────────────┴────────────────┘
                                  │
                                  ▼
┌─────────────────────────────────────────────────────────────────────┐
│                     CENDIAMESH™ INTEGRATION                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐            │
│  │Salesforce│  │   SAP    │  │  AWS S3  │  │  Azure   │            │
│  │Connector │  │Connector │  │Connector │  │Connector │            │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘            │
│                                                                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
                                 ▼
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA PROCESSING                                 │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────────┐        │
│  │   VALIDATION   │─►│ TRANSFORMATION │─►│   ENRICHMENT   │        │
│  │  (Zod Schema)  │  │  (Normalize)   │  │  (AI Augment)  │        │
│  └────────────────┘  └────────────────┘  └────────────────┘        │
│                                                                      │
└────────────────────────────────┬────────────────────────────────────┘
                                 │
        ┌────────────────────────┼────────────────────────┐
        │                        │                        │
        ▼                        ▼                        ▼
┌───────────────┐       ┌───────────────┐       ┌───────────────┐
│  PostgreSQL   │       │    Redis      │       │   MongoDB     │
│   (Primary)   │       │   (Cache)     │       │  (Documents)  │
├───────────────┤       ├───────────────┤       ├───────────────┤
│ • Users       │       │ • Sessions    │       │ • Decisions   │
│ • Orgs        │       │ • API Cache   │       │ • Narratives  │
│ • Decisions   │       │ • Rate Limits │       │ • Reports     │
│ • Audit Logs  │       │ • Tokens      │       │ • Templates   │
└───────────────┘       └───────────────┘       └───────────────┘
```

## Request/Response Flow

```
                              ┌─────────────┐
                              │   CLIENT    │
                              │  (Browser)  │
                              └──────┬──────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │         LOAD BALANCER          │
                    │           (Nginx)              │
                    └────────────────┬───────────────┘
                                     │
                                     ▼
                    ┌────────────────────────────────┐
                    │         API GATEWAY            │
                    │         (Express.js)           │
                    ├────────────────────────────────┤
                    │ ┌──────┐ ┌──────┐ ┌──────┐    │
                    │ │ Auth │ │ Rate │ │Helmet│    │
                    │ │(JWT) │ │Limit │ │(Sec) │    │
                    │ └──────┘ └──────┘ └──────┘    │
                    └────────────────┬───────────────┘
                                     │
       ┌─────────────────────────────┼─────────────────────────────┐
       │                             │                             │
       ▼                             ▼                             ▼
┌─────────────┐             ┌─────────────┐             ┌─────────────┐
│    REST     │             │  WebSocket  │             │   GraphQL   │
│  Endpoints  │             │  (Socket.io)│             │ (Optional)  │
└──────┬──────┘             └──────┬──────┘             └──────┬──────┘
       │                           │                           │
       └───────────────────────────┼───────────────────────────┘
                                   │
                                   ▼
                    ┌────────────────────────────────┐
                    │       SERVICE ROUTER           │
                    └────────────────┬───────────────┘
                                     │
    ┌────────────────────────────────┼────────────────────────────────┐
    │                                │                                │
    ▼                                ▼                                ▼
┌─────────────┐             ┌─────────────┐             ┌─────────────┐
│ Deliberation│             │   Decision  │             │    Audit    │
│   Service   │             │   Service   │             │   Service   │
└──────┬──────┘             └──────┬──────┘             └─────────────┘
       │                           │
       ▼                           ▼
┌─────────────┐             ┌─────────────┐
│   Ollama    │             │  Database   │
│   (LLM)     │             │  (Prisma)   │
└─────────────┘             └─────────────┘
```

## Real-time Data Flow (WebSocket)

```
┌─────────────┐                              ┌─────────────┐
│   CLIENT    │                              │   SERVER    │
│  (Browser)  │                              │  (Node.js)  │
└──────┬──────┘                              └──────┬──────┘
       │                                            │
       │  1. Connect WebSocket                      │
       │ ─────────────────────────────────────────► │
       │                                            │
       │  2. Authenticate (JWT)                     │
       │ ─────────────────────────────────────────► │
       │                                            │
       │  3. Subscribe to channels                  │
       │ ─────────────────────────────────────────► │
       │                                            │
       │           4. Real-time updates             │
       │ ◄───────────────────────────────────────── │
       │  • Agent responses (streaming)             │
       │  • Decision updates                        │
       │  • Alert notifications                     │
       │  • Metrics refresh                         │
       │                                            │
       │  5. User actions                           │
       │ ─────────────────────────────────────────► │
       │  • Submit query                            │
       │  • Approve decision                        │
       │  • Update settings                         │
       │                                            │
```

## AI Processing Pipeline

```
                         ┌─────────────────┐
                         │   USER QUERY    │
                         └────────┬────────┘
                                  │
                                  ▼
                    ┌─────────────────────────┐
                    │    PANTHEON MEMORY      │
                    │    Context Retrieval    │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │      OLLAMA LLM         │
                    │   Generate Response     │
                    ├─────────────────────────┤
                    │  Model Selection:       │
                    │  • llama3.2 (fast)      │
                    │  • llama3:8b (balanced) │
                    │  • llama3:70b (complex) │
                    │  • qwq:32b (reasoning)  │
                    └────────────┬────────────┘
                                 │
                                 ▼
                    ┌─────────────────────────┐
                    │    CENDIASENTRY™        │
                    │   Guardrail Check       │
                    ├─────────────────────────┤
                    │  • Content filter       │
                    │  • PII detection        │
                    │  • Bias check           │
                    │  • Compliance verify    │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
                    ▼                         ▼
            ┌─────────────┐           ┌─────────────┐
            │   PASSED    │           │   BLOCKED   │
            │   Deliver   │           │   Handle    │
            └──────┬──────┘           └─────────────┘
                   │
                   ▼
          ┌────────────────┐
          │  CENDIAAUDIT™  │
          │  Log Event     │
          └────────────────┘
```

## Caching Strategy

```
┌─────────────────────────────────────────────────────────────────────┐
│                      CACHING LAYERS                                  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                      │
│  Layer 1: Browser Cache (Client)                                    │
│  ├─ Static assets: 1 year                                           │
│  ├─ API responses: 5 minutes                                        │
│  └─ User preferences: Session                                       │
│                                                                      │
│  Layer 2: CDN Cache (Edge)                                          │
│  ├─ Static files: 1 year                                            │
│  └─ API (GET): 1 minute                                             │
│                                                                      │
│  Layer 3: Redis Cache (Server)                                      │
│  ├─ Session data: 24 hours                                          │
│  ├─ API responses: 5 minutes                                        │
│  ├─ User context: 1 hour                                            │
│  └─ Rate limit counters: 15 minutes                                 │
│                                                                      │
│  Layer 4: Query Cache (Database)                                    │
│  ├─ Prepared statements: Connection lifetime                        │
│  └─ Query results: Connection pool                                  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```
