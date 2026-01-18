# DATACENDIA BIAS TESTING FRAMEWORK
## AI Ethics, Fairness, and Bias Detection

**Version:** 1.0.0  
**Generated:** January 9, 2026  
**Service:** EthicsService (`backend/src/services/pillars/EthicsService.ts`)

---

# OVERVIEW

Datacendia implements a comprehensive bias testing framework through the **EthicsService**. This is **real functionality**, not simulated - all bias checks are stored in PostgreSQL and tracked over time.

---

# BIAS TYPES TESTED

| Bias Type | Description | Detection Method |
|-----------|-------------|------------------|
| **Demographic** | Unfair treatment based on protected characteristics | Pattern analysis across demographic groups |
| **Selection** | Biased data sampling affecting model training | Training data distribution analysis |
| **Confirmation** | Favoring information that confirms existing beliefs | Reasoning chain analysis |
| **Automation** | Over-reliance on automated recommendations | Human override frequency tracking |
| **Historical** | Perpetuating past discriminatory patterns | Historical outcome comparison |

---

# API ENDPOINTS

## Perform Bias Check
```http
POST /api/v1/ethics/bias-check
Content-Type: application/json

{
  "organizationId": "org-123",
  "modelId": "qwq:32b",
  "modelName": "QwQ Reasoning Model"
}
```

**Response:**
```json
{
  "id": "bc-uuid",
  "organizationId": "org-123",
  "modelId": "qwq:32b",
  "modelName": "QwQ Reasoning Model",
  "checkedAt": "2026-01-09T01:30:00Z",
  "overallScore": 95,
  "biasTypes": [
    { "type": "demographic", "detected": false, "severity": "none", "description": "No demographic bias detected" },
    { "type": "selection", "detected": false, "severity": "none", "description": "Training data appears balanced" },
    { "type": "confirmation", "detected": true, "severity": "low", "description": "Minor confirmation bias in legal reasoning" },
    { "type": "automation", "detected": false, "severity": "none", "description": "Appropriate human oversight maintained" },
    { "type": "historical", "detected": false, "severity": "none", "description": "No historical bias patterns found" }
  ],
  "recommendations": [
    "Consider adding adversarial examples for legal edge cases",
    "Monitor confirmation bias in future deliberations"
  ]
}
```

## Get Bias Check History
```http
GET /api/v1/ethics/bias-checks?organizationId=org-123
```

## Get Ethics Statistics
```http
GET /api/v1/ethics/stats?organizationId=org-123
```

---

# DATABASE SCHEMA

```sql
-- Prisma model: bias_checks
CREATE TABLE bias_checks (
  id UUID PRIMARY KEY,
  organization_id TEXT NOT NULL,
  model_id TEXT NOT NULL,
  model_name TEXT NOT NULL,
  checked_at TIMESTAMP DEFAULT NOW(),
  overall_score INTEGER,
  dimensions JSONB,  -- BiasDetail[]
  recommendations TEXT[],
  created_at TIMESTAMP DEFAULT NOW()
);
```

---

# ETHICS REVIEW WORKFLOW

1. **Request Review** - Any decision can be flagged for ethics review
2. **Principle Check** - Decision is checked against active ethical principles
3. **Bias Analysis** - Automated bias detection runs
4. **Human Review** - Ethics officer reviews flagged items
5. **Decision** - Approved, Flagged (conditional), or Rejected

---

# ETHICAL PRINCIPLES

Organizations can define custom ethical principles:

| Category | Example Principles |
|----------|-------------------|
| **Fairness** | Equal treatment regardless of demographics |
| **Accountability** | Clear decision ownership and audit trail |
| **Transparency** | Explainable AI reasoning |
| **Safety** | Human-in-the-loop for high-stakes decisions |
| **Privacy** | Data minimization and consent |

---

# INTEGRATION WITH COUNCIL

Every Council deliberation can trigger:
1. **Pre-deliberation bias check** - Ensure agents aren't biased
2. **Post-deliberation ethics review** - Flag concerning patterns
3. **Outcome tracking** - Monitor for biased outcomes over time

---

# SEVERITY LEVELS

| Level | Score Range | Action |
|-------|-------------|--------|
| **None** | 90-100 | No action needed |
| **Low** | 70-89 | Monitor, add to report |
| **Medium** | 50-69 | Require human review |
| **High** | 0-49 | Block decision, escalate |

---

# FILES

- **Backend Service:** `backend/src/services/pillars/EthicsService.ts`
- **API Routes:** `backend/src/routes/pillars.ts`
- **Database:** `bias_checks`, `ethics_principles`, `ethics_reviews` tables

---

*Datacendia™ — Ethical AI by Design*
