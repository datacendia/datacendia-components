# Cortex Core API Specification

**Version:** 1.0  
**Status:** Draft  
**Date:** 2025-12-21

---

## Purpose

The Cortex Core API is the **single gateway** through which all Services access organizational data and intelligence. It enforces the architectural principle:

```
Sources → Pillars → Cortex Core API → Services
```

No Service should ever bypass Cortex to access Pillars or Sources directly.

---

## Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                              SERVICES LAYER                                  │
│  Sovereign │ Enterprise │ Decision Intelligence │ Apex │ Premium            │
└─────────────────────────────────┬───────────────────────────────────────────┘
                                  │ (ONLY via Cortex Core API)
                                  ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                           CORTEX CORE API                                    │
│  /api/v1/cortex/*                                                           │
│                                                                              │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐            │
│  │   Query     │ │  Analyze    │ │  Simulate   │ │   Govern    │            │
│  │   Engine    │ │   Engine    │ │   Engine    │ │   Engine    │            │
│  └──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘            │
│         │               │               │               │                    │
│         └───────────────┴───────────────┴───────────────┘                    │
│                                  │                                           │
│                    ┌─────────────┴─────────────┐                             │
│                    │      Pillar Aggregator    │                             │
│                    └─────────────┬─────────────┘                             │
└──────────────────────────────────┼──────────────────────────────────────────┘
                                   │
┌──────────────────────────────────┴──────────────────────────────────────────┐
│                              PILLARS LAYER                                   │
│  Helm │ Lineage │ Predict │ Flow │ Health │ Guard │ Ethics │ Agents         │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Core API Endpoints

### 1. Query Engine (`/api/v1/cortex/query`)

Universal query interface for any organizational data.

```typescript
POST /api/v1/cortex/query
{
  "intent": "natural_language" | "structured",
  "query": string,           // NL: "Show me all at-risk metrics" 
                             // Structured: { entity: "metrics", filter: { status: "at_risk" } }
  "pillars": string[],       // Optional: limit to specific pillars ["helm", "guard"]
  "context": {
    "organizationId": string,
    "userId": string,
    "timeRange"?: { start: string, end: string }
  }
}

Response:
{
  "success": boolean,
  "data": any,               // Unified response
  "sources": [               // Audit trail - which pillars contributed
    { "pillar": "helm", "entities": 12 },
    { "pillar": "guard", "entities": 3 }
  ],
  "confidence": number,      // For NL queries
  "executionMs": number
}
```

**Use Cases:**
- ChronosPage getting metrics → `POST /cortex/query { intent: "structured", pillars: ["helm"] }`
- Any NL question → `POST /cortex/query { intent: "natural_language", query: "..." }`

---

### 2. Analyze Engine (`/api/v1/cortex/analyze`)

Request AI-powered analysis on organizational data.

```typescript
POST /api/v1/cortex/analyze
{
  "type": "impact" | "risk" | "trend" | "anomaly" | "premortem" | "cascade",
  "subject": {
    "entityType": string,    // "decision", "metric", "workflow", etc.
    "entityId": string
  },
  "parameters": {
    "depth"?: number,        // For cascade/impact analysis
    "horizon"?: string,      // For trend analysis: "7d", "30d", "quarter"
    "scenarios"?: object[]   // For premortem/what-if
  },
  "context": {
    "organizationId": string,
    "userId": string
  }
}

Response:
{
  "success": boolean,
  "analysis": {
    "summary": string,
    "findings": Finding[],
    "recommendations": Recommendation[],
    "visualizationData"?: any
  },
  "pillarsConsulted": string[],
  "modelUsed": string,
  "executionMs": number
}
```

**Use Cases:**
- CascadePage analyze → `POST /cortex/analyze { type: "cascade", ... }`
- DecisionDNA premortem → `POST /cortex/analyze { type: "premortem", ... }`
- ChronosPage trends → `POST /cortex/analyze { type: "trend", ... }`

---

### 3. Simulate Engine (`/api/v1/cortex/simulate`)

Run simulations and forecasts.

```typescript
POST /api/v1/cortex/simulate
{
  "type": "forecast" | "scenario" | "monte_carlo" | "stress_test",
  "baseline": {
    "entityType": string,
    "entityId"?: string,
    "currentState"?: object
  },
  "changes": [
    {
      "variable": string,
      "newValue": any,
      "confidence"?: number
    }
  ],
  "horizon": string,         // "7d", "30d", "90d", "1y"
  "iterations"?: number,     // For Monte Carlo
  "context": {
    "organizationId": string,
    "userId": string
  }
}

Response:
{
  "success": boolean,
  "simulation": {
    "outcomes": Outcome[],
    "probabilityDistribution"?: Distribution,
    "sensitivityAnalysis"?: Sensitivity[],
    "confidence": number
  },
  "pillarsConsulted": string[],
  "executionMs": number
}
```

**Use Cases:**
- HorizonPage simulation → `POST /cortex/simulate { type: "scenario", ... }`
- LensPage forecasts → `POST /cortex/simulate { type: "forecast", ... }`
- RiskPage stress tests → `POST /cortex/simulate { type: "stress_test", ... }`

---

### 4. Govern Engine (`/api/v1/cortex/govern`)

Governance, compliance, and ethics checks.

```typescript
POST /api/v1/cortex/govern
{
  "action": "check" | "approve" | "reject" | "escalate" | "audit",
  "subject": {
    "entityType": string,
    "entityId": string
  },
  "governanceType": "compliance" | "ethics" | "policy" | "access",
  "parameters": {
    "frameworks"?: string[], // ["SOC2", "GDPR", "HIPAA"]
    "policies"?: string[],
    "approvers"?: string[]
  },
  "context": {
    "organizationId": string,
    "userId": string,
    "reason"?: string
  }
}

Response:
{
  "success": boolean,
  "result": {
    "status": "approved" | "rejected" | "pending" | "escalated",
    "violations": Violation[],
    "requiredActions": Action[],
    "auditTrail": AuditEntry[]
  },
  "pillarsConsulted": ["guard", "ethics"],
  "executionMs": number
}
```

**Use Cases:**
- ComplianceDashboard checks → `POST /cortex/govern { action: "check", governanceType: "compliance" }`
- EthicsPage reviews → `POST /cortex/govern { action: "check", governanceType: "ethics" }`
- Policy enforcement → `POST /cortex/govern { action: "check", governanceType: "policy" }`

---

### 5. Context Engine (`/api/v1/cortex/context`)

Get unified organizational context for any entity.

```typescript
GET /api/v1/cortex/context/{entityType}/{entityId}
Query params:
  - depth: number (default 1)
  - include: string[] (pillars to include)
  - exclude: string[] (pillars to exclude)

Response:
{
  "success": boolean,
  "entity": {
    "id": string,
    "type": string,
    "name": string,
    "attributes": object
  },
  "context": {
    "helm": { metrics: Metric[], health: number },
    "lineage": { upstream: Entity[], downstream: Entity[] },
    "guard": { riskScore: number, compliance: ComplianceStatus },
    "ethics": { lastReview: EthicsReview, score: number },
    // ... other pillars
  },
  "relationships": Relationship[],
  "timeline": TimelineEvent[]
}
```

**Use Cases:**
- Any entity detail view → `GET /cortex/context/decision/abc123`
- Graph Explorer enrichment → `GET /cortex/context/metric/xyz789?depth=2`

---

## Pillar Aggregator (Internal)

The Pillar Aggregator is an internal component that:

1. **Routes queries** to appropriate pillars based on intent
2. **Merges responses** from multiple pillars
3. **Caches** frequently accessed data
4. **Enforces access control** based on user permissions
5. **Logs audit trail** of all pillar access

```typescript
// Internal interface - not exposed to Services
interface PillarAggregator {
  query(pillars: string[], query: Query): Promise<AggregatedResult>;
  getEntity(pillar: string, entityId: string): Promise<Entity>;
  subscribe(pillars: string[], filter: Filter): Observable<Event>;
}
```

---

## Migration Path

### Phase 1: Create Cortex Core API
1. Create `backend/src/routes/cortex-core.ts`
2. Implement Query Engine with basic structured queries
3. Implement Pillar Aggregator
4. Create frontend `CortexAPI` client

### Phase 2: Migrate High-Priority Violations
5. Refactor `CascadePage` to use `/cortex/analyze`
6. Refactor `ChronosPage` to use `/cortex/query`
7. Refactor `ComplianceDashboard` to use `/cortex/govern`

### Phase 3: Add Intelligence Features
8. Implement NL query support in Query Engine
9. Implement Simulate Engine
10. Implement full Govern Engine

### Phase 4: Deprecate Direct Pillar Access
11. Add deprecation warnings to direct pillar API calls
12. Update all remaining services
13. Remove direct pillar routes from service access

---

## Benefits

| Benefit | Description |
|---------|-------------|
| **Single Gateway** | All service access goes through one point |
| **Audit Trail** | Every query logged with pillar sources |
| **Caching** | Shared cache layer reduces pillar load |
| **Access Control** | Unified permission enforcement |
| **Intelligence** | NL queries, cross-pillar correlation |
| **Versioning** | API versioning without pillar changes |

---

## TypeScript Client

```typescript
// src/lib/api/cortex.ts

export const cortexApi = {
  query: (params: QueryParams) => 
    api.post<QueryResponse>('/cortex/query', params),
  
  analyze: (params: AnalyzeParams) => 
    api.post<AnalyzeResponse>('/cortex/analyze', params),
  
  simulate: (params: SimulateParams) => 
    api.post<SimulateResponse>('/cortex/simulate', params),
  
  govern: (params: GovernParams) => 
    api.post<GovernResponse>('/cortex/govern', params),
  
  getContext: (entityType: string, entityId: string, options?: ContextOptions) =>
    api.get<ContextResponse>(`/cortex/context/${entityType}/${entityId}`, options),
};
```

---

## Example: Before vs After

### Before (Violation)
```typescript
// ChronosPage.tsx - calls Pillar directly
const metrics = await metricsApi.getMetrics();
const alerts = await alertsApi.getAlerts();
const decisions = await councilApi.getRecentDecisions(50);
```

### After (Correct)
```typescript
// ChronosPage.tsx - goes through Cortex
const { data } = await cortexApi.query({
  intent: 'structured',
  query: {
    entities: ['metrics', 'alerts', 'decisions'],
    filters: { decisions: { limit: 50 } }
  },
  pillars: ['helm', 'health', 'agents'],
  context: { organizationId }
});
```

---

## Open Questions

1. **Caching Strategy** - How long to cache pillar data?
2. **Real-time Updates** - WebSocket through Cortex or direct?
3. **Batch Operations** - Support batch queries in single request?
4. **Rate Limiting** - Per-service or per-user limits?

