# DATACENDIA OUTCOME TRACKING
## CendiaEcho™ - Decision Outcome Engine

**Version:** 1.0.0  
**Generated:** January 9, 2026  
**Service:** EchoService (`backend/src/services/echoService.ts`)

---

# OVERVIEW

CendiaEcho™ is **fully implemented** and tracks the real-world outcomes of every Council decision. It measures predictions vs actuals, calculates ROI, and automatically adjusts agent weights based on performance.

**Philosophy:** *"Every decision echoes through time. We measure the echo and make the next decision better."*

---

# CORE CAPABILITIES

| Feature | Status | Description |
|---------|--------|-------------|
| **Outcome Linking** | ✅ Implemented | Link decisions to measured outcomes |
| **Prediction Tracking** | ✅ Implemented | Compare predicted vs actual metrics |
| **Dollar Attribution** | ✅ Implemented | Calculate financial impact of decisions |
| **ROI Calculation** | ✅ Implemented | Return on investment per decision |
| **Agent Weight Adjustment** | ✅ Implemented | Auto-tune agent influence based on accuracy |
| **Pattern Identification** | ✅ Implemented | Identify success/failure patterns |
| **Accuracy Reporting** | ✅ Implemented | Track prediction accuracy over time |

---

# API ENDPOINTS

## Link Decision to Outcome
```http
POST /api/v1/echo/outcomes
Content-Type: application/json

{
  "deliberationId": "del-uuid",
  "organizationId": "org-123",
  "actualRevenue": 1500000,
  "actualProfit": 250000,
  "actualHeadcount": 12,
  "actualRisk": 15,
  "actualSatisfaction": 87,
  "notes": "Q4 results exceeded expectations"
}
```

**Response:**
```json
{
  "id": "outcome-uuid",
  "deliberationId": "del-uuid",
  "decisionTitle": "Q4 Market Expansion Strategy",
  "decisionDate": "2025-10-01T00:00:00Z",
  "outcomeDate": "2026-01-09T00:00:00Z",
  "predictions": {
    "revenue": {
      "predicted": 1200000,
      "actual": 1500000,
      "variance": 300000,
      "accuracy": 125
    },
    "profit": {
      "predicted": 200000,
      "actual": 250000,
      "variance": 50000,
      "accuracy": 125
    }
  },
  "dollarImpact": 300000,
  "roi": 2.5,
  "status": "success",
  "confidenceScore": 92,
  "councilMode": "strategic",
  "participatingAgents": ["chief", "cfo", "cmo", "risk"],
  "votingPattern": {
    "chief": "approve",
    "cfo": "approve",
    "cmo": "approve",
    "risk": "abstain"
  },
  "patterns": [...],
  "weightAdjustments": [...]
}
```

## Get ROI Leaderboard
```http
GET /api/v1/echo/leaderboard?organizationId=org-123&period=quarter&limit=50
```

## Get Accuracy Report
```http
GET /api/v1/echo/accuracy?organizationId=org-123
```

## Get Agent Performance
```http
GET /api/v1/echo/agents?organizationId=org-123
```

---

# OUTCOME STATUS CLASSIFICATION

| Status | Criteria | Description |
|--------|----------|-------------|
| **Success** | Actuals ≥ 90% of predictions | Decision achieved or exceeded goals |
| **Partial** | Actuals 50-89% of predictions | Some goals met, others missed |
| **Failure** | Actuals < 50% of predictions | Decision did not achieve goals |
| **Pending** | No outcome data yet | Awaiting real-world results |
| **Inconclusive** | Insufficient data | Cannot determine success/failure |

---

# METRICS TRACKED

## Financial Metrics
- **Revenue** - Predicted vs actual revenue
- **Profit** - Predicted vs actual profit
- **ROI** - Return on investment
- **Dollar Impact** - Net financial effect

## Operational Metrics
- **Headcount** - Staffing predictions
- **Risk Score** - Risk materialization
- **Customer Satisfaction** - NPS/CSAT
- **Market Share** - Competitive position

---

# AGENT WEIGHT ADJUSTMENT

When outcomes are recorded, Echo automatically adjusts agent weights:

```typescript
interface AgentWeightAdjustment {
  agentId: string;
  agentRole: string;
  previousWeight: number;  // e.g., 1.0
  newWeight: number;       // e.g., 1.15
  adjustment: number;      // e.g., +0.15
  reason: string;          // "Accurate revenue prediction"
  deliberationId: string;
}
```

**Adjustment Rules:**
- Agents who voted correctly on successful decisions: +5-15% weight
- Agents who voted incorrectly on failures: -5-10% weight
- Agents who abstained: No change
- Maximum weight: 2.0x, Minimum: 0.5x

---

# PATTERN IDENTIFICATION

Echo identifies patterns across decisions:

```typescript
interface PatternInsight {
  pattern: string;           // "CFO approval correlates with success"
  successRate: number;       // 87%
  sampleSize: number;        // 42 decisions
  confidence: number;        // 0.92
  factors: string[];         // ["market timing", "budget alignment"]
}
```

**Example Patterns:**
- "Decisions with unanimous approval have 94% success rate"
- "Risk Officer dissent correlates with 23% higher failure rate"
- "Q4 strategic decisions outperform Q1 by 18%"

---

# DATABASE SCHEMA

```sql
-- Prisma model: decision_outcomes
CREATE TABLE decision_outcomes (
  id UUID PRIMARY KEY,
  organization_id TEXT NOT NULL,
  deliberation_id UUID REFERENCES deliberations(id),
  decision_title TEXT NOT NULL,
  decision_date TIMESTAMP NOT NULL,
  outcome_date TIMESTAMP NOT NULL,
  predictions JSONB,
  dollar_impact DECIMAL,
  roi DECIMAL,
  status TEXT,  -- success, partial, failure, pending, inconclusive
  confidence_score INTEGER,
  council_mode TEXT,
  participating_agents TEXT[],
  voting_pattern JSONB,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# INTEGRATION POINTS

## 1. Council Deliberation
Every deliberation can include predictions:
```typescript
await council.deliberate({
  question: "Should we expand to APAC?",
  context: {
    predictedRevenue: 5000000,
    predictedProfit: 800000,
    predictedRisk: 25,
    estimatedCost: 1200000
  }
});
```

## 2. Scheduled Outcome Collection
Set up reminders to collect outcomes:
```typescript
await echo.scheduleOutcomeCollection(deliberationId, {
  collectAfter: '90 days',
  reminderEmails: ['cfo@company.com']
});
```

## 3. Dashboard Integration
Echo data powers the ROI dashboard in Cortex.

---

# FILES

- **Backend Service:** `backend/src/services/echoService.ts`
- **API Routes:** `backend/src/routes/echo.ts`
- **Frontend Page:** `src/pages/cortex/crown/EchoPage.tsx`
- **Database:** `decision_outcomes` table

---

# ACCURACY METRICS

Echo tracks prediction accuracy over time:

```json
{
  "overallAccuracy": 78,
  "byCategory": {
    "revenue": 82,
    "profit": 75,
    "headcount": 91,
    "risk": 68
  },
  "byAgent": {
    "cfo": 85,
    "chief": 79,
    "risk": 72,
    "cmo": 81
  },
  "byMode": {
    "strategic": 81,
    "operational": 76,
    "crisis": 69
  },
  "trend": [
    { "date": "2025-Q1", "accuracy": 72 },
    { "date": "2025-Q2", "accuracy": 75 },
    { "date": "2025-Q3", "accuracy": 78 },
    { "date": "2025-Q4", "accuracy": 81 }
  ],
  "recommendations": [
    "Risk predictions need calibration - consistently underestimating",
    "CFO agent performing well - consider increasing weight",
    "Crisis mode decisions need more conservative estimates"
  ]
}
```

---

*Datacendia™ — Decisions That Learn*
