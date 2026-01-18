# DATACENDIA
## Complete Platform Specification (Part 2)

---

# Part 3: API Specifications

## 3.1 API Overview

### Base URL
```
Production:  https://api.datacendia.com/v1
Staging:     https://api.staging.datacendia.com/v1
Development: http://localhost:3000/api/v1
```

### Authentication

All API requests require authentication via Bearer token:

```http
Authorization: Bearer <access_token>
```

### Token Types
1. **User Access Token** - Short-lived (1 hour), obtained via login
2. **Refresh Token** - Long-lived (30 days), used to get new access tokens
3. **API Key** - For programmatic access, never expires but can be revoked

### Response Format

All responses follow this structure:

```typescript
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}
```

### Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `AUTH_REQUIRED` | 401 | No valid authentication |
| `AUTH_EXPIRED` | 401 | Token has expired |
| `FORBIDDEN` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `RATE_LIMITED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Server error |

---

## 3.2 Authentication API

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@company.com",
  "password": "secret123"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIs...",
    "refreshToken": "dGhpcyBpcyBhIHJlZnJl...",
    "expiresIn": 3600,
    "user": {
      "id": "usr_abc123",
      "email": "user@company.com",
      "name": "John Smith",
      "role": "admin",
      "organizationId": "org_xyz789"
    }
  }
}
```

### Refresh Token

```http
POST /api/v1/auth/refresh
Content-Type: application/json

{
  "refreshToken": "dGhpcyBpcyBhIHJlZnJl..."
}
```

### OAuth Login

```http
POST /api/v1/auth/oauth/google
Content-Type: application/json

{
  "idToken": "google_id_token_here"
}
```

### SAML SSO Init

```http
POST /api/v1/auth/saml/init
Content-Type: application/json

{
  "email": "user@enterprise.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "redirectUrl": "https://idp.enterprise.com/saml/sso?SAMLRequest=..."
  }
}
```

### Logout

```http
POST /api/v1/auth/logout
Authorization: Bearer <token>
```

---

## 3.3 Graph API

### List Entities

```http
GET /api/v1/graph/entities
Authorization: Bearer <token>

Query Parameters:
  - type: string (optional) - Filter by entity type
  - search: string (optional) - Search term
  - page: number (default: 1)
  - pageSize: number (default: 50, max: 100)
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "ent_abc123",
      "type": "metric",
      "name": "Revenue",
      "properties": {
        "formula": "SUM(sales.amount)",
        "unit": "USD",
        "owner": "finance_team"
      },
      "createdAt": "2025-01-15T10:30:00Z",
      "updatedAt": "2025-01-20T14:22:00Z"
    }
  ],
  "meta": {
    "page": 1,
    "pageSize": 50,
    "total": 1247,
    "totalPages": 25
  }
}
```

### Get Entity

```http
GET /api/v1/graph/entities/{id}
Authorization: Bearer <token>
```

### Create Entity

```http
POST /api/v1/graph/entities
Authorization: Bearer <token>
Content-Type: application/json

{
  "type": "metric",
  "name": "Customer Lifetime Value",
  "properties": {
    "formula": "AVG(customer_revenue) / churn_rate",
    "unit": "USD",
    "owner": "analytics_team"
  }
}
```

### Update Entity

```http
PUT /api/v1/graph/entities/{id}
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "CLV (Updated)",
  "properties": {
    "formula": "AVG(customer_revenue) * avg_lifetime",
    "unit": "USD"
  }
}
```

### Delete Entity

```http
DELETE /api/v1/graph/entities/{id}
Authorization: Bearer <token>
```

### Get Entity Neighbors

```http
GET /api/v1/graph/entities/{id}/neighbors
Authorization: Bearer <token>

Query Parameters:
  - direction: "incoming" | "outgoing" | "both" (default: "both")
  - relationshipType: string (optional)
  - depth: number (default: 1, max: 3)
```

### Create Relationship

```http
POST /api/v1/graph/relationships
Authorization: Bearer <token>
Content-Type: application/json

{
  "sourceId": "ent_abc123",
  "targetId": "ent_def456",
  "type": "derives_from",
  "properties": {
    "transformation": "SUM aggregation"
  }
}
```

### Execute Graph Query

```http
POST /api/v1/graph/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "MATCH (m:Metric)-[:DERIVES_FROM*1..3]->(d:Dataset) WHERE m.name = $name RETURN m, d",
  "parameters": {
    "name": "Revenue"
  }
}
```

---

## 3.4 Lineage API

### Get Lineage

```http
GET /api/v1/lineage/{entityId}
Authorization: Bearer <token>

Query Parameters:
  - direction: "upstream" | "downstream" | "both" (default: "upstream")
  - depth: number (default: 3, max: 10)
```

**Response:**
```json
{
  "success": true,
  "data": {
    "root": {
      "id": "ent_abc123",
      "type": "metric",
      "name": "Revenue"
    },
    "nodes": [
      {
        "id": "ent_def456",
        "type": "dataset",
        "name": "Sales Mart",
        "level": 1
      },
      {
        "id": "ent_ghi789",
        "type": "dataset",
        "name": "CRM Export",
        "level": 2
      }
    ],
    "edges": [
      {
        "source": "ent_abc123",
        "target": "ent_def456",
        "type": "derives_from",
        "properties": {
          "transformation": "SUM(amount)"
        }
      }
    ],
    "metadata": {
      "totalDepth": 3,
      "totalNodes": 8,
      "dataFreshness": "2025-01-20T12:00:00Z"
    }
  }
}
```

### Get Impact Analysis

```http
GET /api/v1/lineage/{entityId}/impact
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "affectedEntities": [
      {
        "id": "ent_xyz",
        "name": "Executive Dashboard",
        "type": "dashboard",
        "impactLevel": "high"
      },
      {
        "id": "ent_uvw",
        "name": "Monthly Report",
        "type": "report",
        "impactLevel": "medium"
      }
    ],
    "affectedWorkflows": [
      {
        "id": "wf_123",
        "name": "Monthly Close",
        "impactLevel": "high"
      }
    ],
    "summary": {
      "totalAffected": 12,
      "highImpact": 3,
      "mediumImpact": 5,
      "lowImpact": 4
    }
  }
}
```

---

## 3.5 Council API (AI Agents)

### List Agents

```http
GET /api/v1/agents
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "agent_cfo",
      "name": "CendiaCFO",
      "role": "Chief Financial Officer",
      "description": "Financial analysis, forecasting, and resource allocation",
      "status": "online",
      "avatar": "https://cdn.datacendia.com/agents/cfo.png",
      "capabilities": [
        "financial_analysis",
        "forecasting",
        "budget_review"
      ]
    }
  ]
}
```

### Simple Query

```http
POST /api/v1/council/query
Authorization: Bearer <token>
Content-Type: application/json

{
  "query": "Why did our revenue decrease last quarter?",
  "agents": ["agent_cfo", "agent_cro"],  // Optional, defaults to auto-select
  "context": {
    "timeframe": "Q4 2024"
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "query_abc123",
    "status": "completed",
    "query": "Why did our revenue decrease last quarter?",
    "response": {
      "summary": "Revenue decreased by 8% in Q4 2024 primarily due to...",
      "confidence": 0.87,
      "agents": [
        {
          "agentId": "agent_cfo",
          "analysis": "From a financial perspective...",
          "sources": [
            {
              "entityId": "ent_123",
              "name": "Q4 Revenue Report",
              "relevance": 0.95
            }
          ]
        }
      ],
      "sources": [...],
      "followUpQuestions": [
        "What specific product lines were most affected?",
        "How does this compare to industry trends?"
      ]
    },
    "processingTime": 4523
  }
}
```

### Start Deliberation

```http
POST /api/v1/council/deliberations
Authorization: Bearer <token>
Content-Type: application/json

{
  "question": "Should we expand into the European market?",
  "agents": ["agent_cfo", "agent_coo", "agent_ciso", "agent_cro"],
  "config": {
    "maxDuration": 300,  // seconds
    "requireConsensus": false,
    "humanApprovalRequired": true
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "delib_xyz789",
    "status": "in_progress",
    "phase": "initial_analysis",
    "websocketUrl": "wss://api.datacendia.com/v1/council/deliberations/delib_xyz789/stream"
  }
}
```

### Get Deliberation

```http
GET /api/v1/council/deliberations/{id}
Authorization: Bearer <token>
```

### Get Deliberation Transcript

```http
GET /api/v1/council/deliberations/{id}/transcript
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "deliberationId": "delib_xyz789",
    "phases": [
      {
        "phase": "initial_analysis",
        "startedAt": "2025-01-20T10:00:00Z",
        "completedAt": "2025-01-20T10:02:30Z",
        "messages": [
          {
            "id": "msg_001",
            "agentId": "agent_cfo",
            "timestamp": "2025-01-20T10:00:15Z",
            "content": "European expansion would require €5M initial investment...",
            "sources": [...],
            "confidence": 0.87
          }
        ]
      },
      {
        "phase": "cross_examination",
        "startedAt": "2025-01-20T10:02:30Z",
        "messages": [...]
      }
    ]
  }
}
```

### Control Deliberation

```http
POST /api/v1/council/deliberations/{id}/control
Authorization: Bearer <token>
Content-Type: application/json

{
  "action": "pause" | "resume" | "skip_to_synthesis" | "cancel"
}
```

### WebSocket: Deliberation Stream

```javascript
// Connect to deliberation stream
const ws = new WebSocket('wss://api.datacendia.com/v1/council/deliberations/{id}/stream');

// Message types received:
{
  "type": "phase_change",
  "data": {
    "phase": "cross_examination",
    "progress": 45
  }
}

{
  "type": "agent_message",
  "data": {
    "agentId": "agent_cfo",
    "content": "...",
    "sources": [...]
  }
}

{
  "type": "deliberation_complete",
  "data": {
    "decision": {...},
    "confidence": 0.82
  }
}
```

---

## 3.6 Metrics API

### List Metrics

```http
GET /api/v1/metrics
Authorization: Bearer <token>

Query Parameters:
  - category: string
  - search: string
  - page: number
  - pageSize: number
```

### Get Metric

```http
GET /api/v1/metrics/{id}
Authorization: Bearer <token>
```

### Create Metric Definition

```http
POST /api/v1/metrics
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Customer Acquisition Cost",
  "code": "CAC",
  "description": "Total cost to acquire a new customer",
  "formula": {
    "type": "expression",
    "expression": "(marketing_spend + sales_spend) / new_customers"
  },
  "unit": "USD",
  "category": "sales",
  "thresholds": {
    "warning": 500,
    "critical": 1000
  },
  "owner": "team_sales",
  "refreshSchedule": "0 0 * * *"  // Daily at midnight
}
```

### Calculate Metric

```http
GET /api/v1/metrics/{id}/calculate
Authorization: Bearer <token>

Query Parameters:
  - startDate: ISO date
  - endDate: ISO date
  - granularity: "hour" | "day" | "week" | "month"
  - dimensions: string[] (e.g., "region,product")
```

**Response:**
```json
{
  "success": true,
  "data": {
    "metricId": "metric_cac",
    "metricName": "Customer Acquisition Cost",
    "timeRange": {
      "start": "2025-01-01",
      "end": "2025-01-31"
    },
    "values": [
      {
        "timestamp": "2025-01-01",
        "value": 245.50,
        "dimensions": {
          "region": "North America",
          "product": "Enterprise"
        }
      }
    ],
    "summary": {
      "current": 245.50,
      "previous": 312.00,
      "change": -21.3,
      "trend": "improving"
    },
    "calculatedAt": "2025-01-20T15:30:00Z"
  }
}
```

### Get Metric History

```http
GET /api/v1/metrics/{id}/history
Authorization: Bearer <token>

Query Parameters:
  - startDate: ISO date
  - endDate: ISO date
  - granularity: "hour" | "day" | "week" | "month"
```

---

## 3.7 Predict API (Forecasting)

### Create Forecast

```http
POST /api/v1/predict/forecasts
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Q1 2026 Revenue Forecast",
  "targetMetric": "metric_revenue",
  "horizon": {
    "value": 90,
    "unit": "days"
  },
  "model": "auto",  // or "arima", "prophet", "lstm"
  "features": ["marketing_spend", "headcount", "market_index"],
  "confidence_intervals": [0.80, 0.95]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "forecast_abc123",
    "status": "completed",
    "predictions": [
      {
        "timestamp": "2026-01-01",
        "value": 15200000,
        "confidence_intervals": {
          "80": { "lower": 14500000, "upper": 15900000 },
          "95": { "lower": 14000000, "upper": 16400000 }
        }
      }
    ],
    "accuracy": {
      "mape": 4.2,
      "rmse": 450000
    },
    "featureImportance": [
      { "feature": "marketing_spend", "importance": 0.45 },
      { "feature": "headcount", "importance": 0.32 },
      { "feature": "market_index", "importance": 0.23 }
    ]
  }
}
```

### Create Scenario

```http
POST /api/v1/predict/scenarios
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Product Launch Delay Scenario",
  "baselineId": "forecast_abc123",
  "assumptions": [
    {
      "variable": "launch_date",
      "baseValue": "2026-01-15",
      "scenarioValue": "2026-04-15"
    },
    {
      "variable": "competitor_entry",
      "baseValue": false,
      "scenarioValue": true
    }
  ],
  "metrics_to_project": ["revenue", "market_share", "cash_position"]
}
```

### Compare Scenarios

```http
POST /api/v1/predict/scenarios/compare
Authorization: Bearer <token>
Content-Type: application/json

{
  "scenarioIds": ["scenario_base", "scenario_delay", "scenario_aggressive"],
  "metrics": ["revenue", "market_share"],
  "timeRange": {
    "start": "2026-01-01",
    "end": "2026-12-31"
  }
}
```

---

## 3.8 Workflow API

### List Workflows

```http
GET /api/v1/workflows
Authorization: Bearer <token>

Query Parameters:
  - status: "active" | "draft" | "paused" | "archived"
  - category: string
  - search: string
```

### Create Workflow

```http
POST /api/v1/workflows
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Monthly Close Process",
  "description": "Automated month-end financial close",
  "category": "finance",
  "trigger": {
    "type": "schedule",
    "schedule": "0 0 1 * *"  // First of every month
  },
  "definition": {
    "nodes": [
      {
        "id": "node_1",
        "type": "query",
        "config": {
          "source": "sales_mart",
          "query": "SELECT * FROM sales WHERE date >= $start_date"
        },
        "outputs": ["sales_data"]
      },
      {
        "id": "node_2",
        "type": "transform",
        "inputs": ["sales_data"],
        "config": {
          "operation": "aggregate",
          "groupBy": ["account_id"],
          "aggregations": [
            { "field": "amount", "function": "SUM", "alias": "total" }
          ]
        },
        "outputs": ["aggregated_data"]
      },
      {
        "id": "node_3",
        "type": "condition",
        "inputs": ["aggregated_data"],
        "config": {
          "expression": "variance > 0.1"
        },
        "outputs": {
          "true": "node_4",
          "false": "node_5"
        }
      },
      {
        "id": "node_4",
        "type": "approval",
        "config": {
          "approvers": ["role:cfo"],
          "message": "Variance exceeds 10%. Please review.",
          "timeout": 86400
        }
      },
      {
        "id": "node_5",
        "type": "action",
        "config": {
          "action": "update_ledger",
          "data": "{{aggregated_data}}"
        }
      }
    ],
    "edges": [
      { "from": "node_1", "to": "node_2" },
      { "from": "node_2", "to": "node_3" },
      { "from": "node_3", "to": "node_4", "condition": "true" },
      { "from": "node_3", "to": "node_5", "condition": "false" },
      { "from": "node_4", "to": "node_5", "on": "approved" }
    ]
  }
}
```

### Execute Workflow

```http
POST /api/v1/workflows/{id}/execute
Authorization: Bearer <token>
Content-Type: application/json

{
  "parameters": {
    "start_date": "2025-01-01"
  },
  "async": true
}
```

### Get Execution Status

```http
GET /api/v1/workflows/executions/{executionId}
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "exec_abc123",
    "workflowId": "wf_monthly_close",
    "status": "running",
    "startedAt": "2025-01-20T10:00:00Z",
    "currentNode": "node_3",
    "progress": 60,
    "nodeStatuses": [
      { "nodeId": "node_1", "status": "completed", "duration": 2340 },
      { "nodeId": "node_2", "status": "completed", "duration": 1200 },
      { "nodeId": "node_3", "status": "running", "startedAt": "..." }
    ],
    "outputs": {
      "sales_data": { "rows": 15234 },
      "aggregated_data": { "rows": 234 }
    }
  }
}
```

---

## 3.9 Health & Alerts API

### Get Health Score

```http
GET /api/v1/health/score
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "overall": 82,
    "dimensions": {
      "data": { "score": 94, "trend": "up", "change": 2 },
      "operations": { "score": 78, "trend": "down", "change": -5 },
      "security": { "score": 85, "trend": "up", "change": 1 },
      "people": { "score": 71, "trend": "stable", "change": 0 }
    },
    "calculatedAt": "2025-01-20T15:00:00Z"
  }
}
```

### List Alerts

```http
GET /api/v1/alerts
Authorization: Bearer <token>

Query Parameters:
  - severity: "critical" | "warning" | "info"
  - status: "active" | "acknowledged" | "resolved"
  - source: string
```

### Acknowledge Alert

```http
POST /api/v1/alerts/{id}/acknowledge
Authorization: Bearer <token>
Content-Type: application/json

{
  "note": "Investigating with ops team"
}
```

### Resolve Alert

```http
POST /api/v1/alerts/{id}/resolve
Authorization: Bearer <token>
Content-Type: application/json

{
  "resolution": "Scaled up database instance",
  "rootCause": "Traffic spike from marketing campaign"
}
```

---

## 3.10 User & Organization API

### Get Current User

```http
GET /api/v1/users/me
Authorization: Bearer <token>
```

### Update Current User

```http
PUT /api/v1/users/me
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "John Smith",
  "preferences": {
    "timezone": "America/New_York",
    "language": "en",
    "theme": "dark"
  }
}
```

### List Organization Users

```http
GET /api/v1/users
Authorization: Bearer <token>
```

### Invite User

```http
POST /api/v1/users/invite
Authorization: Bearer <token>
Content-Type: application/json

{
  "email": "newuser@company.com",
  "role": "analyst",
  "teams": ["team_finance"],
  "message": "Welcome to Datacendia!"
}
```

### Get Organization

```http
GET /api/v1/organizations/current
Authorization: Bearer <token>
```

### Update Organization

```http
PUT /api/v1/organizations/current
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Acme Corporation",
  "settings": {
    "timezone": "America/New_York",
    "dateFormat": "MM/DD/YYYY",
    "currency": "USD"
  }
}
```

---

## 3.11 Integration API

### List Integrations

```http
GET /api/v1/integrations
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "available": [
      {
        "id": "salesforce",
        "name": "Salesforce",
        "category": "crm",
        "status": "available",
        "authType": "oauth2"
      }
    ],
    "connected": [
      {
        "id": "conn_sf_123",
        "integrationId": "salesforce",
        "name": "Production Salesforce",
        "status": "active",
        "lastSync": "2025-01-20T14:00:00Z"
      }
    ]
  }
}
```

### Connect Integration

```http
POST /api/v1/integrations/{integrationId}/connect
Authorization: Bearer <token>
Content-Type: application/json

{
  "name": "Production Salesforce",
  "config": {
    "instanceUrl": "https://acme.salesforce.com",
    "syncSchedule": "0 */6 * * *"
  }
}
```

**Response (OAuth):**
```json
{
  "success": true,
  "data": {
    "authUrl": "https://login.salesforce.com/services/oauth2/authorize?..."
  }
}
```

### Trigger Sync

```http
POST /api/v1/integrations/connections/{connectionId}/sync
Authorization: Bearer <token>
```

---

# Part 4: Database Schemas

## 4.1 PostgreSQL Schema

### Core Tables

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Organizations
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) UNIQUE NOT NULL,
    industry VARCHAR(100),
    company_size VARCHAR(50),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Users
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    name VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500),
    role VARCHAR(50) NOT NULL DEFAULT 'viewer',
    status VARCHAR(20) DEFAULT 'active',
    preferences JSONB DEFAULT '{}',
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    
    CONSTRAINT valid_status CHECK (status IN ('active', 'invited', 'disabled'))
);

CREATE INDEX idx_users_org ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);

-- Teams
CREATE TABLE teams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE team_members (
    team_id UUID REFERENCES teams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) DEFAULT 'member',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    PRIMARY KEY (team_id, user_id)
);

-- API Keys
CREATE TABLE api_keys (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    user_id UUID REFERENCES users(id),
    name VARCHAR(255) NOT NULL,
    key_hash VARCHAR(255) NOT NULL,
    key_prefix VARCHAR(10) NOT NULL,  -- For identification (e.g., "dc_live_")
    scopes JSONB DEFAULT '[]',
    last_used_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    revoked_at TIMESTAMPTZ
);

-- Sessions (for refresh tokens)
CREATE TABLE sessions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    refresh_token_hash VARCHAR(255) NOT NULL,
    user_agent TEXT,
    ip_address INET,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_sessions_user ON sessions(user_id);
CREATE INDEX idx_sessions_expires ON sessions(expires_at);
```

### Event Sourcing Tables

```sql
-- Events (append-only log)
CREATE TABLE events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    aggregate_type VARCHAR(100) NOT NULL,
    aggregate_id UUID NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_data JSONB NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Prevent out-of-order events
    sequence_number BIGSERIAL
);

CREATE INDEX idx_events_aggregate ON events(aggregate_type, aggregate_id);
CREATE INDEX idx_events_type ON events(event_type);
CREATE INDEX idx_events_org_time ON events(organization_id, created_at DESC);

-- Event types for reference
COMMENT ON TABLE events IS 'Valid event types include:
  entity.created, entity.updated, entity.deleted,
  relationship.created, relationship.deleted,
  metric.calculated, metric.threshold_breached,
  workflow.started, workflow.completed, workflow.failed,
  deliberation.started, deliberation.completed,
  user.login, user.logout, user.permission_changed';
```

### Metrics Tables

```sql
-- Metric Definitions
CREATE TABLE metric_definitions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50) NOT NULL,
    description TEXT,
    formula JSONB NOT NULL,
    unit VARCHAR(50),
    category VARCHAR(100),
    thresholds JSONB DEFAULT '{}',
    owner_id UUID REFERENCES users(id),
    owner_team_id UUID REFERENCES teams(id),
    refresh_schedule VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(organization_id, code)
);

-- Metric Values (TimescaleDB hypertable)
CREATE TABLE metric_values (
    time TIMESTAMPTZ NOT NULL,
    organization_id UUID NOT NULL,
    metric_id UUID NOT NULL REFERENCES metric_definitions(id),
    value DOUBLE PRECISION NOT NULL,
    dimensions JSONB DEFAULT '{}',
    confidence REAL,
    source VARCHAR(100)
);

-- Convert to TimescaleDB hypertable
SELECT create_hypertable('metric_values', 'time');

CREATE INDEX idx_metric_values_metric ON metric_values(metric_id, time DESC);
CREATE INDEX idx_metric_values_org ON metric_values(organization_id, time DESC);
```

### Workflow Tables

```sql
-- Workflow Definitions
CREATE TABLE workflows (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    status VARCHAR(20) DEFAULT 'draft',
    trigger_type VARCHAR(50) NOT NULL,
    trigger_config JSONB NOT NULL,
    definition JSONB NOT NULL,
    version INTEGER DEFAULT 1,
    created_by UUID REFERENCES users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_status CHECK (status IN ('draft', 'active', 'paused', 'archived'))
);

-- Workflow Executions
CREATE TABLE workflow_executions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workflow_id UUID REFERENCES workflows(id),
    organization_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    trigger_type VARCHAR(50),
    triggered_by UUID REFERENCES users(id),
    parameters JSONB DEFAULT '{}',
    current_node VARCHAR(100),
    node_states JSONB DEFAULT '{}',
    outputs JSONB DEFAULT '{}',
    error JSONB,
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_exec_status CHECK (status IN ('pending', 'running', 'completed', 'failed', 'cancelled'))
);

CREATE INDEX idx_workflow_exec_workflow ON workflow_executions(workflow_id);
CREATE INDEX idx_workflow_exec_org ON workflow_executions(organization_id, started_at DESC);

-- Pending Approvals
CREATE TABLE workflow_approvals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    execution_id UUID REFERENCES workflow_executions(id),
    node_id VARCHAR(100) NOT NULL,
    approver_type VARCHAR(20) NOT NULL,  -- 'user', 'role', 'team'
    approver_id UUID NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    response JSONB,
    responded_by UUID REFERENCES users(id),
    responded_at TIMESTAMPTZ,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_approvals_pending ON workflow_approvals(approver_id, status) WHERE status = 'pending';
```

### Deliberation Tables

```sql
-- Deliberations
CREATE TABLE deliberations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    question TEXT NOT NULL,
    status VARCHAR(20) NOT NULL,
    phase VARCHAR(50),
    agents JSONB NOT NULL,  -- Array of agent IDs
    config JSONB DEFAULT '{}',
    result JSONB,
    started_by UUID REFERENCES users(id),
    started_at TIMESTAMPTZ DEFAULT NOW(),
    completed_at TIMESTAMPTZ,
    
    CONSTRAINT valid_delib_status CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled'))
);

-- Deliberation Messages
CREATE TABLE deliberation_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    deliberation_id UUID REFERENCES deliberations(id),
    phase VARCHAR(50) NOT NULL,
    agent_id VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    sources JSONB DEFAULT '[]',
    confidence REAL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_delib_messages ON deliberation_messages(deliberation_id, created_at);
```

### Alert Tables

```sql
-- Alerts
CREATE TABLE alerts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id),
    severity VARCHAR(20) NOT NULL,
    status VARCHAR(20) DEFAULT 'active',
    source VARCHAR(100) NOT NULL,
    source_id UUID,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    metadata JSONB DEFAULT '{}',
    acknowledged_by UUID REFERENCES users(id),
    acknowledged_at TIMESTAMPTZ,
    acknowledged_note TEXT,
    resolved_by UUID REFERENCES users(id),
    resolved_at TIMESTAMPTZ,
    resolution TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    
    CONSTRAINT valid_severity CHECK (severity IN ('critical', 'warning', 'info')),
    CONSTRAINT valid_alert_status CHECK (status IN ('active', 'acknowledged', 'resolved'))
);

CREATE INDEX idx_alerts_org_active ON alerts(organization_id, status, created_at DESC) 
    WHERE status = 'active';
```

### Audit Log

```sql
-- Audit Log (for compliance)
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL,
    user_id UUID,
    action VARCHAR(100) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_audit_org_time ON audit_log(organization_id, created_at DESC);
CREATE INDEX idx_audit_user ON audit_log(user_id, created_at DESC);

-- Partition by month for large deployments
-- CREATE TABLE audit_log_2025_01 PARTITION OF audit_log
--     FOR VALUES FROM ('2025-01-01') TO ('2025-02-01');
```

---

## 4.2 Neo4j Schema (Knowledge Graph)

### Node Types

```cypher
// Entity base constraints
CREATE CONSTRAINT entity_id IF NOT EXISTS
FOR (e:Entity) REQUIRE e.id IS UNIQUE;

// Organization nodes
CREATE CONSTRAINT org_id IF NOT EXISTS
FOR (o:Organization) REQUIRE o.id IS UNIQUE;

// Dataset nodes
CREATE CONSTRAINT dataset_id IF NOT EXISTS
FOR (d:Dataset) REQUIRE d.id IS UNIQUE;

// Metric nodes
CREATE CONSTRAINT metric_id IF NOT EXISTS
FOR (m:Metric) REQUIRE m.id IS UNIQUE;

// Process nodes
CREATE CONSTRAINT process_id IF NOT EXISTS
FOR (p:Process) REQUIRE p.id IS UNIQUE;

// Agent nodes
CREATE CONSTRAINT agent_id IF NOT EXISTS
FOR (a:Agent) REQUIRE a.id IS UNIQUE;
```

### Example Node Structures

```cypher
// Dataset node
CREATE (d:Dataset:Entity {
  id: 'ds_abc123',
  organizationId: 'org_xyz',
  name: 'Sales Transactions',
  description: 'Raw sales transaction data from CRM',
  source: 'salesforce',
  schema: '{"columns": [...]}',
  owner: 'team_data',
  classification: 'confidential',
  refreshFrequency: 'hourly',
  createdAt: datetime(),
  updatedAt: datetime()
})

// Metric node
CREATE (m:Metric:Entity {
  id: 'metric_revenue',
  organizationId: 'org_xyz',
  name: 'Total Revenue',
  code: 'REVENUE',
  formula: 'SUM(sales.amount)',
  unit: 'USD',
  category: 'financial',
  owner: 'team_finance',
  createdAt: datetime(),
  updatedAt: datetime()
})

// Process node
CREATE (p:Process:Entity {
  id: 'proc_monthly_close',
  organizationId: 'org_xyz',
  name: 'Monthly Close Process',
  type: 'workflow',
  status: 'active',
  owner: 'team_finance',
  createdAt: datetime()
})
```

### Relationship Types

```cypher
// Data lineage relationships
// Dataset derives from another Dataset
CREATE (target:Dataset)-[:DERIVES_FROM {
  transformation: 'ETL pipeline',
  transformationType: 'aggregation',
  schedule: 'daily',
  createdAt: datetime()
}]->(source:Dataset)

// Metric calculated from Dataset
CREATE (m:Metric)-[:CALCULATED_FROM {
  formula: 'SUM(amount)',
  aggregation: 'sum',
  createdAt: datetime()
}]->(d:Dataset)

// Ownership relationships
CREATE (e:Entity)-[:OWNED_BY]->(t:Team)
CREATE (e:Entity)-[:OWNED_BY]->(u:User)

// Impact relationships
CREATE (d:Dataset)-[:IMPACTS]->(m:Metric)
CREATE (m:Metric)-[:DISPLAYED_IN]->(r:Report)

// Process relationships
CREATE (p:Process)-[:USES]->(d:Dataset)
CREATE (p:Process)-[:PRODUCES]->(d:Dataset)
CREATE (p:Process)-[:TRIGGERS]->(p2:Process)
```

### Sample Queries

```cypher
// Get full lineage for a metric
MATCH path = (m:Metric {id: $metricId})-[:CALCULATED_FROM|DERIVES_FROM*1..5]->(source)
RETURN path

// Find impact of changing a dataset
MATCH (d:Dataset {id: $datasetId})<-[:DERIVES_FROM|CALCULATED_FROM*1..5]-(impacted)
RETURN impacted

// Get all entities owned by a team
MATCH (t:Team {id: $teamId})<-[:OWNED_BY]-(e:Entity)
RETURN e

// Find metrics without recent calculations
MATCH (m:Metric)
WHERE m.lastCalculatedAt < datetime() - duration('P1D')
RETURN m
```

---

## 4.3 Redis Schema

### Key Patterns

```
# Session tokens
session:{userId}:{sessionId} -> JSON (user session data)
TTL: 30 days

# API rate limiting
ratelimit:{orgId}:{endpoint}:{minute} -> COUNT
TTL: 2 minutes

# Cache - API responses
cache:api:{orgId}:{hash} -> JSON
TTL: varies (5 min - 1 hour)

# Cache - Metric values
cache:metric:{metricId}:{date} -> JSON
TTL: 1 hour

# Cache - Graph queries
cache:graph:{orgId}:{queryHash} -> JSON
TTL: 5 minutes

# Real-time - Health scores
health:{orgId}:score -> JSON
TTL: none (updated continuously)

# Real-time - Active users
active_users:{orgId} -> SET of userIds
TTL: none (members expire individually)

# Pub/Sub channels
channel:deliberation:{deliberationId} -> messages
channel:alerts:{orgId} -> alert notifications
channel:workflow:{executionId} -> execution updates

# Queue - Background jobs
queue:default -> LIST of job JSONs
queue:priority -> LIST of job JSONs
queue:scheduled -> ZSET (score = timestamp)

# Locks - Distributed locks
lock:{resource}:{resourceId} -> ownerId
TTL: 30 seconds (with refresh)
```

### Example Redis Commands

```redis
# Store session
SETEX session:usr_123:sess_456 2592000 '{"userId":"usr_123","orgId":"org_789"}'

# Rate limiting
INCR ratelimit:org_789:/api/v1/graph/query:202501201530
EXPIRE ratelimit:org_789:/api/v1/graph/query:202501201530 120

# Cache metric
SET cache:metric:metric_revenue:2025-01-20 '{"value":12500000}' EX 3600

# Pub/Sub for deliberation
PUBLISH channel:deliberation:delib_123 '{"type":"agent_message","data":{...}}'

# Queue job
LPUSH queue:default '{"type":"calculate_metric","metricId":"metric_123"}'

# Distributed lock
SET lock:workflow:wf_123 "worker_456" NX EX 30
```

---

# Part 5: Connectors

## 5.1 Connector Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        CONNECTOR FRAMEWORK                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │                    CONNECTOR INTERFACE                        │ │
│  │                                                               │ │
│  │  - authenticate()     - testConnection()                      │ │
│  │  - discover()         - sync()                                │ │
│  │  - query()            - write()                               │ │
│  │  - getSchema()        - watchChanges()                        │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                              │                                      │
│     ┌────────────────────────┼────────────────────────┐            │
│     │                        │                        │            │
│     ▼                        ▼                        ▼            │
│  ┌──────────┐          ┌──────────┐          ┌──────────┐         │
│  │  CRM     │          │   ERP    │          │   Data   │         │
│  │Connectors│          │Connectors│          │Warehouse │         │
│  └──────────┘          └──────────┘          └──────────┘         │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

## 5.2 Available Connectors

### CRM Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| Salesforce | OAuth 2.0 | Full CRUD, Real-time sync, Custom objects |
| HubSpot | OAuth 2.0 / API Key | Contacts, Deals, Companies, Activities |
| Microsoft Dynamics | OAuth 2.0 | Full CRUD, Custom entities |
| Pipedrive | API Key | Deals, Contacts, Activities |
| Zoho CRM | OAuth 2.0 | Full CRUD |

### ERP Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| SAP S/4HANA | OAuth 2.0 / Certificate | Read-only by default, configurable write |
| Oracle NetSuite | Token-based | Full CRUD |
| Microsoft Dynamics 365 | OAuth 2.0 | Finance, Operations |
| Workday | OAuth 2.0 | HCM, Financials |
| Sage Intacct | Web Services | General Ledger, AP/AR |

### Data Warehouse Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| Snowflake | OAuth 2.0 / Key Pair | Full SQL, Schema discovery |
| Databricks | Token | SQL, Delta tables, Unity Catalog |
| Google BigQuery | Service Account | Full SQL, Streaming |
| Amazon Redshift | IAM / Password | Full SQL |
| Azure Synapse | OAuth 2.0 / Key | Full SQL |

### Database Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| PostgreSQL | Password / SSL | Full SQL, Change data capture |
| MySQL | Password / SSL | Full SQL |
| MongoDB | Connection String | Collections, Aggregation |
| Microsoft SQL Server | Password / AD | Full SQL |
| Oracle Database | Password / Wallet | Full SQL |

### Communication Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| Slack | OAuth 2.0 | Send messages, Create channels |
| Microsoft Teams | OAuth 2.0 | Messages, Channels, Presence |
| Email (SMTP) | Password / OAuth | Send, Receive (IMAP) |
| Twilio | API Key | SMS, Voice |

### File/Storage Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| Amazon S3 | IAM | Read/Write, Events |
| Google Cloud Storage | Service Account | Read/Write |
| Azure Blob Storage | SAS / Key | Read/Write |
| Dropbox | OAuth 2.0 | Read/Write |
| Google Drive | OAuth 2.0 | Read/Write |
| SharePoint | OAuth 2.0 | Read/Write, Lists |

### API/Webhook Connectors

| Connector | Auth Type | Features |
|-----------|-----------|----------|
| Generic REST API | Various | Configurable endpoints |
| GraphQL | Various | Query/Mutation |
| Webhook (Inbound) | Secret | Receive events |
| Webhook (Outbound) | Configurable | Send events |

---

## 5.3 Connector Implementation Example

```typescript
// connectors/salesforce/index.ts

import { Connector, ConnectorConfig, ConnectionStatus } from '../types';

interface SalesforceConfig extends ConnectorConfig {
  instanceUrl: string;
  apiVersion: string;
  sandbox: boolean;
}

export class SalesforceConnector implements Connector {
  private config: SalesforceConfig;
  private accessToken: string | null = null;

  constructor(config: SalesforceConfig) {
    this.config = config;
  }

  async authenticate(credentials: OAuthCredentials): Promise<void> {
    const response = await fetch(`${this.config.instanceUrl}/services/oauth2/token`, {
      method: 'POST',
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: credentials.code,
        client_id: process.env.SALESFORCE_CLIENT_ID,
        client_secret: process.env.SALESFORCE_CLIENT_SECRET,
        redirect_uri: credentials.redirectUri,
      }),
    });

    const data = await response.json();
    this.accessToken = data.access_token;
    
    // Store refresh token securely
    await this.storeRefreshToken(data.refresh_token);
  }

  async testConnection(): Promise<ConnectionStatus> {
    try {
      const response = await this.query('SELECT Id FROM Organization LIMIT 1');
      return { connected: true, message: 'Connected successfully' };
    } catch (error) {
      return { connected: false, message: error.message };
    }
  }

  async discover(): Promise<DiscoveryResult> {
    const response = await fetch(
      `${this.config.instanceUrl}/services/data/v${this.config.apiVersion}/sobjects`,
      { headers: this.getHeaders() }
    );
    
    const data = await response.json();
    
    return {
      objects: data.sobjects.map(obj => ({
        name: obj.name,
        label: obj.label,
        queryable: obj.queryable,
        createable: obj.createable,
        updateable: obj.updateable,
      })),
    };
  }

  async getSchema(objectName: string): Promise<ObjectSchema> {
    const response = await fetch(
      `${this.config.instanceUrl}/services/data/v${this.config.apiVersion}/sobjects/${objectName}/describe`,
      { headers: this.getHeaders() }
    );
    
    const data = await response.json();
    
    return {
      name: data.name,
      fields: data.fields.map(field => ({
        name: field.name,
        type: this.mapFieldType(field.type),
        nullable: field.nillable,
        label: field.label,
      })),
      relationships: data.childRelationships,
    };
  }

  async query(soql: string): Promise<QueryResult> {
    const response = await fetch(
      `${this.config.instanceUrl}/services/data/v${this.config.apiVersion}/query?q=${encodeURIComponent(soql)}`,
      { headers: this.getHeaders() }
    );
    
    const data = await response.json();
    
    return {
      records: data.records,
      totalSize: data.totalSize,
      done: data.done,
      nextRecordsUrl: data.nextRecordsUrl,
    };
  }

  async sync(objectName: string, options: SyncOptions): Promise<SyncResult> {
    // Implementation for full or incremental sync
    const lastSyncTime = options.incremental ? options.lastSyncTime : null;
    
    let soql = `SELECT ${options.fields.join(', ')} FROM ${objectName}`;
    if (lastSyncTime) {
      soql += ` WHERE SystemModstamp > ${lastSyncTime.toISOString()}`;
    }
    
    const results = await this.queryAll(soql);
    
    return {
      recordsProcessed: results.length,
      recordsCreated: 0,  // Calculated based on merge
      recordsUpdated: 0,
      recordsDeleted: 0,
      syncedAt: new Date(),
    };
  }

  private getHeaders(): Record<string, string> {
    return {
      'Authorization': `Bearer ${this.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private mapFieldType(sfType: string): string {
    const typeMap = {
      'string': 'string',
      'textarea': 'string',
      'boolean': 'boolean',
      'int': 'integer',
      'double': 'number',
      'currency': 'number',
      'date': 'date',
      'datetime': 'datetime',
      'id': 'string',
      'reference': 'string',
    };
    return typeMap[sfType] || 'string';
  }
}
```

---

# Part 6: Internationalization (i18n)

## 6.1 Supported Languages

### Tier 1 (Full Support)
- English (en) - Default
- Spanish (es)
- French (fr)
- German (de)
- Portuguese (pt)
- Japanese (ja)
- Chinese Simplified (zh-CN)

### Tier 2 (UI Only)
- Italian (it)
- Dutch (nl)
- Korean (ko)
- Russian (ru)
- Arabic (ar) - RTL support

## 6.2 Implementation

### i18n Configuration

```typescript
// lib/i18n/config.ts

export const i18nConfig = {
  defaultLocale: 'en',
  locales: ['en', 'es', 'fr', 'de', 'pt', 'ja', 'zh-CN'],
  
  // Locale detection order
  detection: {
    order: ['querystring', 'cookie', 'header', 'navigator'],
    caches: ['cookie'],
  },
  
  // Namespaces for code splitting
  namespaces: [
    'common',      // Shared UI elements
    'auth',        // Login, signup
    'dashboard',   // Dashboard
    'graph',       // Knowledge graph
    'council',     // AI Council
    'pulse',       // Health monitoring
    'lens',        // Forecasting
    'bridge',      // Workflows
    'settings',    // Settings pages
    'errors',      // Error messages
  ],
  
  // Default namespace
  defaultNS: 'common',
};
```

### Translation File Structure

```
locales/
├── en/
│   ├── common.json
│   ├── auth.json
│   ├── dashboard.json
│   ├── graph.json
│   ├── council.json
│   ├── pulse.json
│   ├── lens.json
│   ├── bridge.json
│   ├── settings.json
│   └── errors.json
├── es/
│   ├── common.json
│   └── ...
├── fr/
│   └── ...
└── ...
```

### Sample Translation Files

```json
// locales/en/common.json
{
  "app": {
    "name": "Datacendia",
    "tagline": "Your organization's intelligence, sovereign and whole."
  },
  "nav": {
    "dashboard": "Dashboard",
    "graph": "The Graph",
    "council": "The Council",
    "pulse": "The Pulse",
    "lens": "The Lens",
    "bridge": "The Bridge",
    "data": "Data",
    "security": "Security",
    "settings": "Settings",
    "help": "Help"
  },
  "actions": {
    "save": "Save",
    "cancel": "Cancel",
    "delete": "Delete",
    "edit": "Edit",
    "create": "Create",
    "search": "Search",
    "filter": "Filter",
    "export": "Export",
    "import": "Import",
    "refresh": "Refresh"
  },
  "status": {
    "active": "Active",
    "inactive": "Inactive",
    "pending": "Pending",
    "completed": "Completed",
    "failed": "Failed",
    "online": "Online",
    "offline": "Offline"
  },
  "time": {
    "now": "Just now",
    "minutesAgo": "{{count}} minute ago",
    "minutesAgo_plural": "{{count}} minutes ago",
    "hoursAgo": "{{count}} hour ago",
    "hoursAgo_plural": "{{count}} hours ago",
    "daysAgo": "{{count}} day ago",
    "daysAgo_plural": "{{count}} days ago"
  },
  "errors": {
    "generic": "Something went wrong. Please try again.",
    "notFound": "Not found",
    "unauthorized": "You don't have permission to access this",
    "networkError": "Unable to connect. Please check your connection."
  }
}
```

```json
// locales/en/council.json
{
  "title": "The Council",
  "agents": {
    "cfo": {
      "name": "CendiaCFO",
      "role": "Chief Financial Officer",
      "description": "Financial analysis, forecasting, and resource allocation"
    },
    "coo": {
      "name": "CendiaCOO",
      "role": "Chief Operating Officer",
      "description": "Operational efficiency and process optimization"
    },
    "ciso": {
      "name": "CendiaCISO",
      "role": "Chief Information Security Officer",
      "description": "Security posture and compliance"
    }
  },
  "deliberation": {
    "phases": {
      "initial": "Initial Analysis",
      "crossExam": "Cross-Examination",
      "synthesis": "Synthesis",
      "ethics": "Ethics Check"
    },
    "status": {
      "inProgress": "Deliberation in progress",
      "completed": "Deliberation completed",
      "cancelled": "Deliberation cancelled"
    },
    "confidence": "Confidence: {{value}}%",
    "sources": "Sources",
    "viewTranscript": "View full transcript"
  },
  "query": {
    "placeholder": "What would you like to know?",
    "selectAgents": "Select agents to consult",
    "askQuestion": "Ask Question",
    "startDeliberation": "Start Deliberation"
  }
}
```

```json
// locales/es/common.json
{
  "app": {
    "name": "Datacendia",
    "tagline": "La inteligencia de tu organización, soberana y completa."
  },
  "nav": {
    "dashboard": "Panel",
    "graph": "El Grafo",
    "council": "El Consejo",
    "pulse": "El Pulso",
    "lens": "La Lente",
    "bridge": "El Puente",
    "data": "Datos",
    "security": "Seguridad",
    "settings": "Configuración",
    "help": "Ayuda"
  },
  "actions": {
    "save": "Guardar",
    "cancel": "Cancelar",
    "delete": "Eliminar",
    "edit": "Editar",
    "create": "Crear",
    "search": "Buscar",
    "filter": "Filtrar",
    "export": "Exportar",
    "import": "Importar",
    "refresh": "Actualizar"
  }
}
```

### React i18n Hook Usage

```typescript
// components/Council/AgentCard.tsx

import { useTranslation } from 'react-i18next';

export function AgentCard({ agent }: { agent: Agent }) {
  const { t } = useTranslation('council');
  
  return (
    <div className="agent-card">
      <img src={agent.avatar} alt={agent.name} />
      <h3>{t(`agents.${agent.id}.name`)}</h3>
      <p className="role">{t(`agents.${agent.id}.role`)}</p>
      <p className="description">{t(`agents.${agent.id}.description`)}</p>
      <span className={`status ${agent.status}`}>
        {t(`common:status.${agent.status}`)}
      </span>
    </div>
  );
}
```

### Language Switcher Component

```typescript
// components/LanguageSwitcher.tsx

import { useTranslation } from 'react-i18next';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' },
  { code: 'pt', name: 'Português', flag: '🇧🇷' },
  { code: 'ja', name: '日本語', flag: '🇯🇵' },
  { code: 'zh-CN', name: '中文', flag: '🇨🇳' },
];

export function LanguageSwitcher() {
  const { i18n } = useTranslation();
  
  const handleChange = (code: string) => {
    i18n.changeLanguage(code);
    // Also update user preferences via API
    updateUserPreferences({ language: code });
  };
  
  return (
    <select 
      value={i18n.language} 
      onChange={(e) => handleChange(e.target.value)}
      className="language-switcher"
    >
      {languages.map((lang) => (
        <option key={lang.code} value={lang.code}>
          {lang.flag} {lang.name}
        </option>
      ))}
    </select>
  );
}
```

---

# Part 7: Platform Downloads

## 7.1 Available Downloads

### Desktop Application (Electron)

| Platform | Architecture | Download |
|----------|--------------|----------|
| Windows | x64 | Datacendia-Setup-1.0.0-x64.exe |
| Windows | ARM64 | Datacendia-Setup-1.0.0-arm64.exe |
| macOS | Universal | Datacendia-1.0.0-universal.dmg |
| macOS | Intel | Datacendia-1.0.0-x64.dmg |
| macOS | Apple Silicon | Datacendia-1.0.0-arm64.dmg |
| Linux | x64 (AppImage) | Datacendia-1.0.0-x86_64.AppImage |
| Linux | x64 (deb) | datacendia_1.0.0_amd64.deb |
| Linux | x64 (rpm) | datacendia-1.0.0.x86_64.rpm |

### Self-Hosted (Docker)

```bash
# Docker Compose (recommended)
curl -fsSL https://downloads.datacendia.com/docker/docker-compose.yml -o docker-compose.yml
docker-compose up -d

# Docker Hub
docker pull datacendia/datacendia:latest
docker pull datacendia/datacendia:1.0.0
```

### Kubernetes (Helm)

```bash
# Add Helm repository
helm repo add datacendia https://charts.datacendia.com
helm repo update

# Install
helm install datacendia datacendia/datacendia \
  --namespace datacendia \
  --create-namespace \
  --values values.yaml
```

### CLI Tool

| Platform | Download |
|----------|----------|
| Windows | datacendia-cli-windows-amd64.zip |
| macOS (Universal) | datacendia-cli-darwin-universal.tar.gz |
| Linux | datacendia-cli-linux-amd64.tar.gz |

```bash
# Install via npm
npm install -g @datacendia/cli

# Install via homebrew (macOS/Linux)
brew install datacendia/tap/datacendia-cli

# Install via curl
curl -fsSL https://downloads.datacendia.com/cli/install.sh | sh
```

## 7.2 Download Page Design

```
┌─────────────────────────────────────────────────────────────────────┐
│  HEADER                                                             │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│                         DOWNLOADS                                   │
│                                                                     │
│  Get Datacendia for your platform                                   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │                    RECOMMENDED FOR YOU                       │   │
│  │                                                              │   │
│  │    🖥️  Datacendia Desktop for macOS                         │   │
│  │                                                              │   │
│  │    Version 1.0.0 • 125 MB • Universal (Intel + Apple Silicon)│   │
│  │                                                              │   │
│  │    [Download .dmg]                                           │   │
│  │                                                              │   │
│  │    [Other macOS options ▼]                                   │   │
│  └─────────────────────────────────────────────────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ALL PLATFORMS                                                      │
│                                                                     │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐   │
│  │     WINDOWS      │ │      MACOS       │ │      LINUX       │   │
│  │                  │ │                  │ │                  │   │
│  │  🪟              │ │  🍎              │ │  🐧              │   │
│  │                  │ │                  │ │                  │   │
│  │  64-bit (x64)    │ │  Universal       │ │  AppImage        │   │
│  │  [Download]      │ │  [Download]      │ │  [Download]      │   │
│  │                  │ │                  │ │                  │   │
│  │  ARM64           │ │  Intel (x64)     │ │  .deb (Ubuntu)   │   │
│  │  [Download]      │ │  [Download]      │ │  [Download]      │   │
│  │                  │ │                  │ │                  │   │
│  │                  │ │  Apple Silicon   │ │  .rpm (Fedora)   │   │
│  │                  │ │  [Download]      │ │  [Download]      │   │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  SELF-HOSTED                                                        │
│                                                                     │
│  ┌──────────────────┐ ┌──────────────────┐ ┌──────────────────┐   │
│  │     DOCKER       │ │   KUBERNETES     │ │    AIR-GAPPED    │   │
│  │                  │ │                  │ │                  │   │
│  │  🐳              │ │  ☸️              │ │  🔒              │   │
│  │                  │ │                  │ │                  │   │
│  │  docker-compose  │ │  Helm Chart      │ │  Offline Bundle  │   │
│  │  [View Guide]    │ │  [View Guide]    │ │  [Contact Sales] │   │
│  │                  │ │                  │ │                  │   │
│  └──────────────────┘ └──────────────────┘ └──────────────────┘   │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  DEVELOPER TOOLS                                                    │
│                                                                     │
│  ┌──────────────────┐ ┌──────────────────┐                         │
│  │      CLI         │ │       SDK        │                         │
│  │                  │ │                  │                         │
│  │  ⌨️              │ │  📦              │                         │
│  │                  │ │                  │                         │
│  │  npm install -g  │ │  TypeScript      │                         │
│  │  @datacendia/cli │ │  Python          │                         │
│  │                  │ │                  │                         │
│  │  [Installation   │ │  [View Docs]     │                         │
│  │   Guide]         │ │                  │                         │
│  └──────────────────┘ └──────────────────┘                         │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  RELEASE NOTES                                                      │
│                                                                     │
│  Version 1.0.0 (January 20, 2025)                                  │
│  • Initial release                                                  │
│  • All 8 Pillars fully operational                                  │
│  • Pantheon multi-agent deliberation                               │
│  • 18 connectors available                                          │
│                                                                     │
│  [View All Release Notes →]                                        │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  FOOTER                                                             │
└─────────────────────────────────────────────────────────────────────┘
```

---

# Part 8: Licensing System

## 8.1 License Types

### Package Licenses

| License Type | Code | Features |
|--------------|------|----------|
| Foundation | `foundation` | Lineage, Metrics, Basic Helm |
| Intelligence | `intelligence` | Foundation + Predict, Health, Full Helm |
| Governance | `governance` | Intelligence + Guard, Ethics |
| Sovereign | `sovereign` | All Pillars + Flow, Agents |
| Enterprise | `enterprise` | Sovereign + Custom limits |

### Add-on Licenses

| Add-on | Code | Description |
|--------|------|-------------|
| Additional Agent | `addon_agent` | +1 Domain AI Agent |
| Reference Implementation | `addon_refimpl` | Industry-specific config |
| Premium Support | `addon_support` | 24/7 + Dedicated CSM |
| Air-Gapped | `addon_airgap` | Offline operation |
| API Access | `addon_api` | External API access |

## 8.2 License Schema

```typescript
// types/license.ts

interface License {
  id: string;
  organizationId: string;
  
  // License identification
  type: LicenseType;
  plan: 'foundation' | 'intelligence' | 'governance' | 'sovereign' | 'enterprise';
  
  // Validity
  status: 'active' | 'trial' | 'expired' | 'suspended';
  issuedAt: Date;
  expiresAt: Date;
  trialEndsAt?: Date;
  
  // Limits
  limits: {
    users: number;           // Max users
    agents: number;          // Max AI agents
    scenarios: number;       // Max saved scenarios
    workflows: number;       // Max workflows
    integrations: number;    // Max connected integrations
    apiCalls: number;        // API calls per month
    storage: number;         // Storage in GB
    auditRetention: number;  // Audit log retention in days
  };
  
  // Features
  features: {
    pillars: string[];       // Enabled pillars
    services: string[];      // Enabled services
    addons: string[];        // Active add-ons
  };
  
  // Billing
  billing: {
    interval: 'monthly' | 'annual';
    amount: number;
    currency: string;
    nextBillingDate: Date;
  };
  
  // Cryptographic signature
  signature: string;
}
```

## 8.3 License Validation

```typescript
// lib/license/validator.ts

import { createVerify } from 'crypto';

export class LicenseValidator {
  private publicKey: string;
  
  constructor(publicKey: string) {
    this.publicKey = publicKey;
  }
  
  validate(license: License): ValidationResult {
    const errors: string[] = [];
    
    // 1. Verify signature
    if (!this.verifySignature(license)) {
      return { valid: false, errors: ['Invalid license signature'] };
    }
    
    // 2. Check expiration
    if (new Date() > new Date(license.expiresAt)) {
      errors.push('License has expired');
    }
    
    // 3. Check trial status
    if (license.status === 'trial' && license.trialEndsAt) {
      if (new Date() > new Date(license.trialEndsAt)) {
        errors.push('Trial period has ended');
      }
    }
    
    // 4. Check status
    if (license.status === 'suspended') {
      errors.push('License is suspended');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      license,
    };
  }
  
  private verifySignature(license: License): boolean {
    const { signature, ...licenseData } = license;
    const data = JSON.stringify(licenseData, Object.keys(licenseData).sort());
    
    const verify = createVerify('RSA-SHA256');
    verify.update(data);
    
    return verify.verify(this.publicKey, signature, 'base64');
  }
  
  checkFeature(license: License, feature: string): boolean {
    return license.features.pillars.includes(feature) ||
           license.features.services.includes(feature) ||
           license.features.addons.includes(feature);
  }
  
  checkLimit(license: License, limit: keyof License['limits'], current: number): boolean {
    return current < license.limits[limit];
  }
}
```

## 8.4 License Enforcement Middleware

```typescript
// middleware/license.ts

import { LicenseValidator } from '../lib/license/validator';

export function requireLicense(requiredFeature?: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const org = req.organization;
    const license = await getLicense(org.id);
    
    if (!license) {
      return res.status(402).json({
        success: false,
        error: {
          code: 'NO_LICENSE',
          message: 'No valid license found',
        },
      });
    }
    
    const validator = new LicenseValidator(process.env.LICENSE_PUBLIC_KEY);
    const result = validator.validate(license);
    
    if (!result.valid) {
      return res.status(402).json({
        success: false,
        error: {
          code: 'INVALID_LICENSE',
          message: result.errors[0],
        },
      });
    }
    
    // Check specific feature if required
    if (requiredFeature && !validator.checkFeature(license, requiredFeature)) {
      return res.status(403).json({
        success: false,
        error: {
          code: 'FEATURE_NOT_LICENSED',
          message: `Your license does not include ${requiredFeature}`,
          upgrade: getUpgradePath(license.plan, requiredFeature),
        },
      });
    }
    
    req.license = license;
    next();
  };
}

// Usage
router.get('/api/v1/predict/scenarios', 
  requireLicense('predict'),  // Requires Predict pillar
  scenariosController.list
);
```

## 8.5 License Management UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  SETTINGS > BILLING & LICENSE                                       │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  CURRENT PLAN                                                 │ │
│  │                                                               │ │
│  │  ⭐ SOVEREIGN                                                 │ │
│  │                                                               │ │
│  │  $25,000/month • Billed annually                             │ │
│  │  Next billing: February 20, 2025                             │ │
│  │                                                               │ │
│  │  [Change Plan]  [View Invoice History]                       │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  USAGE THIS MONTH                                             │ │
│  │                                                               │ │
│  │  Users              32 / 50         ████████████░░░ 64%      │ │
│  │  AI Agents           3 / 3          ████████████████ 100%    │ │
│  │  Workflows          47 / ∞          N/A                      │ │
│  │  API Calls       45.2K / 100K       ██████████░░░░░ 45%      │ │
│  │  Storage          12GB / 50GB       █████░░░░░░░░░░ 24%      │ │
│  │                                                               │ │
│  │  [View Detailed Usage →]                                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  ACTIVE ADD-ONS                                               │ │
│  │                                                               │ │
│  │  ✓ Additional AI Agent (CendiaRisk)      $3,000/mo           │ │
│  │  ✓ Financial Services Reference Impl     $5,000/mo           │ │
│  │  ✓ Premium Support                       $4,000/mo           │ │
│  │                                                               │ │
│  │  [Manage Add-ons]                                            │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  LICENSE KEY                                                  │ │
│  │                                                               │ │
│  │  dc_lic_7f8a9b2c3d4e5f6g7h8i9j0k...                         │ │
│  │                                                               │ │
│  │  [Copy]  [Download License File]                             │ │
│  │                                                               │ │
│  │  For air-gapped deployments, download the license file       │ │
│  │  and place it in your installation directory.                │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐ │
│  │  PAYMENT METHOD                                               │ │
│  │                                                               │ │
│  │  💳 •••• •••• •••• 4242    Expires 12/26                    │ │
│  │                                                               │ │
│  │  [Update Payment Method]                                     │ │
│  └───────────────────────────────────────────────────────────────┘ │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

This concludes Parts 3-8 of the specification. The document covers:

1. ✅ Information Architecture (Part 1)
2. ✅ Page Specifications with wireframes (Part 2)
3. ✅ API Specifications (Part 3)
4. ✅ Database Schemas (Part 4)
5. ✅ Connectors (Part 5)
6. ✅ Internationalization (Part 6)
7. ✅ Platform Downloads (Part 7)
8. ✅ Licensing System (Part 8)

Part 9 (Component Library) would detail the reusable UI components. Let me know if you'd like that section as well.
