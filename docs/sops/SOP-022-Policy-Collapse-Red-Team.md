# SOP-022: Policy Collapse Mode (Red-Team)

**Category:** Enterprise
**Priority:** High
**Owner:** Governance Lead
**Last Verified:** 2026-02-22 (against `src/pages/cortex/sovereign/CollapsePage.tsx`, `backend/src/routes/collapse.ts`)

---

## 1. Purpose

Define procedures for conducting adversarial policy stress-testing using CendiaCollapse™ — the platform's red-team mode that answers: "Under what conditions would this decision fail, harm people, or collapse legitimacy?"

---

## 2. Collapse Mode Architecture

### 2.1 18 Adversarial Agents Across 7 Failure Domains

| Domain | Agents | What They Attack |
|--------|--------|-----------------|
| **Constitutional Rights** | FREE_SPEECH_AGENT, RELIGIOUS_LIBERTY_AGENT | Civil liberties violations |
| **Minority Harm** | MINORITY_HARM_AGENT, DISABILITY_RIGHTS_AGENT | Disproportionate impact on vulnerable groups |
| **Economic** | ECONOMIC_DISPLACEMENT_AGENT, SMALL_BUSINESS_AGENT | Financial harm, market distortion |
| **Environmental** | ENVIRONMENTAL_JUSTICE_AGENT | Ecological and environmental justice |
| **Institutional** | INSTITUTIONAL_TRUST_AGENT, MEDIA_NARRATIVE_AGENT | Public trust erosion, media backlash |
| **Legal** | LEGAL_CHALLENGE_AGENT, INTERNATIONAL_LAW_AGENT | Legal vulnerability, cross-jurisdiction issues |
| **Operational** | IMPLEMENTATION_FAILURE_AGENT, UNINTENDED_CONSEQUENCES_AGENT | Execution risks, second-order effects |

### 2.2 Non-Overridable Agents
`FREE_SPEECH_AGENT` and `MINORITY_HARM_AGENT` are **non-overridable** — their findings cannot be dismissed without explicit documentation and executive sign-off.

---

## 3. Running a Collapse Analysis

### 3.1 Via UI
1. Navigate to `/cortex/sovereign/collapse` (CendiaCollapse™)
2. Enter the decision to stress-test:
   - Decision ID (or auto-generated)
   - Decision text (the policy/action being evaluated)
   - Policy domain (Housing, Healthcare, Education, etc.)
   - Target population size
   - Consensus confidence (from standard deliberation)
   - Optional: deterministic seed for reproducibility
3. Click "Run Collapse Analysis"
4. Review results across 5 tabs:
   - **Failure Analysis** — Failure conditions by severity
   - **Legitimacy Timeline** — Erosion curve over time
   - **Harm Heatmap** — Minority group impact matrix
   - **Narrative Attack** — Media vulnerability simulation
   - **Agents** — Individual agent findings

### 3.2 Via API
```bash
curl -X POST http://localhost:3001/api/v1/collapse/deliberation \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "decisionId": "DEC-20260222-001",
    "decisionText": "Implement mandatory AI screening for all benefit applications",
    "context": {
      "policyDomain": "Social Services",
      "targetPopulation": 500000,
      "geographicScope": "Municipal",
      "budgetImpact": 5000000,
      "timelineMonths": 12,
      "stakeholders": ["Citizens", "Government", "Advocacy Groups"]
    },
    "consensusConfidence": 0.85,
    "seed": 42
  }'
```

---

## 4. Output: Failure Envelope

Each analysis produces a **Failure Envelope** containing:

| Component | Description |
|-----------|-------------|
| **Failure Conditions** | Specific scenarios where the decision fails |
| **Trust Delta** | `Consensus Confidence − Collapse Risk` |
| **Legitimacy Curve** | Projected trust erosion over time |
| **Minority Harm Matrix** | Impact severity per affected group |
| **Narrative Attacks** | Simulated hostile media headlines with virality scores |
| **Merkle Root** | Cryptographic integrity proof |
| **Replay Command** | Command to reproduce the exact analysis |

### 4.1 Trust Delta Interpretation
| Trust Delta | Recommendation |
|-------------|---------------|
| > +0.3 | ✅ **Deploy** — Robust against adversarial challenges |
| +0.1 to +0.3 | ⚠️ **Deploy with Monitoring** — Some vulnerability |
| -0.1 to +0.1 | 🔶 **Defer** — Significant concerns require resolution |
| < -0.1 | ❌ **Block** — Critical failure modes identified |

---

## 5. Post-Analysis Actions

### 5.1 Export Audit Bundle
```bash
# Download full deliberation bundle (JSON)
curl http://localhost:3001/api/v1/collapse/deliberation/<id>/bundle \
  -H "Authorization: Bearer <token>" \
  -o collapse-bundle.json
```

### 5.2 Verify Bundle Integrity
Upload bundle for in-browser verification — checks:
- Bundle format validity
- Packet integrity
- Failure envelope presence
- Checksum verification
- Merkle tree validation

### 5.3 Human Override
If deploying despite negative Trust Delta:
1. Click "Override Decision" in UI
2. Fill in Human Authority details (name, title, department)
3. Document justification for override
4. Acknowledge accepted risks (checkbox each)
5. Sign risk acknowledgment
6. Override is recorded in CendiaResponsibility™ (see SOP-026)

---

## 6. Reproducibility

Every Collapse analysis is deterministically reproducible:
- **Seed value** ensures identical agent outputs given same inputs
- **Merkle root** verifies no data was altered
- **Replay command** regenerates the exact same analysis

```bash
# Replay a previous analysis
curl -X POST http://localhost:3001/api/v1/collapse/replay \
  -d '{"deliberationId": "delib_123", "seed": 42}'
```

---

## 7. Monitoring

| Metric | Description |
|--------|-------------|
| Analyses per month | Volume of collapse analyses run |
| Average Trust Delta | Trend of policy robustness |
| Override rate | % of negative analyses overridden |
| Failure pattern frequency | Most common failure domains |

---

## 8. Verified Against

- `src/pages/cortex/sovereign/CollapsePage.tsx`: Full UI (1246 lines), 5 tabs, override modal
- `backend/src/routes/collapse.ts`: API endpoints for deliberation, agents, replay, bundle
- `COMPLETE_SERVICE_MATRIX.md`: 18 agents, 7 domains, 73 scenario tests (100% passing)
- `src/routes/cortex/enterprise.routes.tsx`: Route registered as `sovereign/collapse`
- Interfaces: `TrustDelta`, `FailureCondition`, `FailureEnvelope`, `Deliberation`, `OverrideRecord`, `VerificationResult`

---

*Datacendia, LLC — Proprietary and Confidential*
