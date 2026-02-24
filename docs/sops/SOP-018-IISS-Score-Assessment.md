# SOP-018: IISS Score Assessment

**Category:** DCII
**Priority:** High
**Owner:** DCII Operations Lead
**Last Verified:** 2026-02-22 (against `backend/src/services/dcii/IISSService.ts`, `DCII_FRAMEWORK_WHITE_PAPER.md`)

---

## 1. Purpose

Define the procedure for conducting, interpreting, and maintaining Institutional Immune System Score (IISS) assessments — the flagship scoring metric of the DCII framework.

---

## 2. IISS Overview

The IISS is a **0–1000 scale** measuring an organization's crisis resilience across 5 dimensions. It is the quantitative backbone of the Decision Crisis Immunization Infrastructure (DCII).

### 2.1 Score Bands
| Band | Score Range | Meaning |
|------|-----------|---------|
| **Exceptional** | 800–1000 | Best-in-class crisis resilience |
| **Strong** | 600–799 | Robust governance with minor gaps |
| **Adequate** | 400–599 | Functional but vulnerable under pressure |
| **Vulnerable** | 200–399 | Significant governance gaps |
| **Critical** | 0–199 | Immediate remediation required |

### 2.2 Five Assessment Dimensions
| Dimension | Weight | What It Measures |
|-----------|--------|-----------------|
| **Decision Traceability** | 25% | Can decisions be reconstructed end-to-end? |
| **Override Accountability** | 20% | Are AI recommendation overrides tracked and justified? |
| **Continuity Memory** | 20% | Does institutional knowledge survive personnel changes? |
| **Compliance Readiness** | 20% | Cross-jurisdiction regulatory preparedness |
| **Crisis Response** | 15% | Speed and quality of crisis decision-making |

---

## 3. Assessment Procedure

### 3.1 Initiate Assessment
1. Navigate to `/cortex/enterprise/dcii` (DCII Dashboard)
2. Select the **IISS** tab
3. Click "New Assessment" or use API:

```bash
curl -X POST http://localhost:3001/api/v1/dcii/iiss/assess \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "organizationId": "org_123",
    "assessmentType": "full",
    "assessor": "Stuart Rainey"
  }'
```

### 3.2 Evidence Collection
For each dimension, the system collects:
- Automated metrics (decision audit trail completeness, override counts)
- System configuration checks (logging enabled, encryption active)
- Process evidence (documented procedures, review cadence)
- Test results (disaster recovery drills, compliance audits)

### 3.3 Scoring
Each dimension is scored 0–200, then weighted:
```
IISS = (Traceability × 0.25) + (Accountability × 0.20) + 
       (Continuity × 0.20) + (Compliance × 0.20) + (Crisis × 0.15)
```

### 3.4 Review & Certification
1. Score calculated and band assigned
2. Dimension breakdown displayed
3. Recommendations generated for improvement
4. Score persisted to database with timestamp
5. Score history tracked for trend analysis

---

## 4. DCII Dashboard

The DCII Dashboard at `/cortex/enterprise/dcii` provides 6 tabs:

| Tab | Purpose |
|-----|---------|
| **IISS** | Score overview, band, dimension breakdown |
| **Media Auth** | Synthetic media authentication (C2PA) |
| **Jurisdiction** | Cross-jurisdiction compliance checks |
| **Timestamps** | RFC 3161 timestamp authority |
| **Similarity** | Decision similarity engine |
| **Cognitive Bias** | Bias detection and mitigation |

---

## 5. Score Persistence

### 5.1 Database Models
- `dcii_iiss_scores`: Current score per organization
- `dcii_iiss_assessments`: Individual dimension assessments
- `dcii_iiss_history`: Score change history with event types

### 5.2 Cache Pattern
- **Write-through cache:** In-memory Map for fast reads + PostgreSQL via Prisma
- Scores loaded at service startup
- Every write updates both cache and database
- Graceful fallback to demo data if DB unavailable

---

## 6. Score Interpretation & Actions

| Score Range | Action Required |
|-------------|----------------|
| 800+ | Maintain current practices; pursue certification |
| 600–799 | Address identified gaps; schedule quarterly reviews |
| 400–599 | Implement remediation plan within 90 days |
| 200–399 | Urgent: Engage DCII consultant; 30-day remediation |
| 0–199 | Critical: Immediate executive review; halt high-risk decisions |

---

## 7. Projected Benefits

| Stakeholder | Benefit |
|-------------|---------|
| Insurance carriers | 20–40% premium reduction for scores >800 (projected) |
| ESG funds | Scores >700 as governance quality indicator (projected) |
| Regulators | Demonstrates proactive compliance posture |
| Board | Quantifiable governance metric for reporting |

**Note:** Insurance and ESG benefits are projected/aspirational targets, not verified by insurers or funds.

---

## 8. Verified Against

- `backend/src/services/dcii/IISSService.ts`: Score calculation, 5 dimensions, 0–1000 scale, band assignments
- `DCII_FRAMEWORK_WHITE_PAPER.md`: Framework specification
- `COMPLETE_SERVICE_MATRIX.md`: IISSService — 15/15 tests passing, DB + Cache status
- `backend/prisma/schema/dcii.prisma`: `dcii_iiss_scores`, `dcii_iiss_assessments`, `dcii_iiss_history` models
- `src/pages/cortex/enterprise/DCIIDashboardPage.tsx`: 6-tab dashboard UI
- `docs/MARKETING_VS_PLATFORM_AUDIT.md`: Insurance/ESG claims marked as aspirational

---

*Datacendia, LLC — Proprietary and Confidential*
