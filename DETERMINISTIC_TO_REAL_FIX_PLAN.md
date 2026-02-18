# DETERMINISTIC → REAL: Service Fix Plan
**Date:** February 18, 2026  
**Scope:** Replace 245 `deterministic*()` fake-data calls with real DB queries / real computation  
**Goal:** 100% real services — no fake data in any production code path

---

## EXECUTIVE SUMMARY

| Metric | Current | Target |
|--------|---------|--------|
| `deterministic*()` calls with hardcoded seeds | 245 | 0 (in non-simulation services) |
| Services with fake metrics | 30+ | 0 |
| In-memory Maps replacing DB | ~15 services | 0 |
| Prisma models available | 225 | Already sufficient |

**Key finding:** Most services already have matching Prisma models — they just aren't using them.

---

## PRIORITY 1: CORE PIPELINE (6 services, ~75 fake calls)

These are the highest-value services that customers interact with directly.

### 1.1 CendiaHorizonService.ts (20 fake calls)
**File:** `backend/src/services/CendiaHorizonService.ts` (73.4K)  
**Prisma models available:** `predictions`, `forecasts`, `forecast_models`, `chronos_events`, `chronos_snapshots`

| Fake Call | What It Does | Real Replacement |
|-----------|-------------|-----------------|
| `deterministicFloat('cascade-chance', eventType)` | Fake 40% cascade probability | Query `predictions` table for historical cascade rates by event type |
| `deterministicInt(8, 14, 'event-count', bias, question)` | Fake event count | Count from `chronos_events` WHERE type matches, or use LLM to estimate based on question context |
| `deterministicInt(0, 13, 'day-offset', bias, i)` | Fake day spacing | Compute from `chronos_snapshots` historical intervals |
| `deterministicFloat('confidence', bias, i)` | Fake confidence decay | Real confidence = f(time_horizon, data_freshness, model_accuracy from `forecast_models`) |
| `deterministicPick(domains, 'cascade-domain')` | Random domain selection | LLM analysis: "Given event X, which domain is most likely affected?" |
| `deterministicPick(['minor','moderate','major'], ...)` | Random magnitude | LLM analysis based on event severity + historical `predictions.actual_outcome` data |
| `deterministicInt(7, 28, 'cascade-delay')` | Fake cascade delay | Historical average from `chronos_events` where `event_type = 'cascade'` |
| `deterministicPick(AGENT_PERSPECTIVES, ...)` | Random agent selection | Select agents whose `domain` matches the event type from `agents` table |
| `deterministicPick(options, 'perspective')` | Random perspective | LLM-generated perspective based on agent persona + event context |
| `deterministicPick(options, 'sentiment')` | Random sentiment | LLM sentiment analysis of the event's impact description |
| `deterministicFloat('outcome-variance')` | Fake outcome variance | Compute from `predictions` historical variance: `STDDEV(predicted - actual)` |
| `deterministicFloat('outcome-conf')` | Fake outcome confidence | Real model confidence from `forecast_models.accuracy_score` |
| `deterministicInt(60, 89, 'criticality')` | Fake criticality score | `computeRiskScore()` from real decision parameters (this function already exists in deterministic.ts!) |
| `deterministicInt(65, 85, 'rec-confidence')` | Fake recommendation confidence | Weighted average of agent confidence scores from deliberation |
| `deterministicFloat('accuracy', sim.id)` | Fake prediction accuracy | Query `echo_patterns` for actual prediction accuracy by decision type |

**Approach:** Replace seed-based calls with:
1. Prisma queries against `predictions`, `chronos_events`, `forecast_models`
2. LLM calls via `EnhancedLLMService` for qualitative judgments (domain, perspective, sentiment)
3. Statistical computation from historical data

---

### 1.2 CendiaApotheosisService.ts (13 fake calls)
**File:** `backend/src/services/CendiaApotheosisService.ts` (72.1K)  
**Prisma models available:** `apotheosis_runs`, `apotheosis_scores`, `apotheosis_weaknesses`, `apotheosis_auto_patches`, `apotheosis_escalations`, `apotheosis_pattern_bans`, `apotheosis_upskill_assignments`, `apotheosis_configs`

| Fake Call | Real Replacement |
|-----------|-----------------|
| `deterministicInt(1200, 1300, 'scenarios-tested', orgId, i)` | `SELECT COUNT(*) FROM crucible_simulations WHERE organization_id = $orgId AND run_id = $runId` |
| `deterministicInt(1100, 1200, 'scenarios-survived', orgId, i)` | `SELECT COUNT(*) FROM crucible_simulations WHERE ... AND status = 'PASSED'` |
| `deterministicPercentage(94, 4, 'survival-rate', orgId, i)` | `survived / tested * 100` — computed from the two real counts above |
| `deterministicInt(0, 4, 'critical-count', orgId, i)` | `SELECT COUNT(*) FROM apotheosis_weaknesses WHERE severity = 'CRITICAL' AND run_id = $runId` |
| `deterministicInt(8, 15, 'high-count', orgId, i)` | Same query with `severity = 'HIGH'` |
| `deterministicInt(15, 24, 'medium-count', orgId, i)` | Same with `severity = 'MEDIUM'` |
| `deterministicInt(10, 19, 'low-count', orgId, i)` | Same with `severity = 'LOW'` |
| `deterministicPercentage(92, 4, 'apoth-score', orgId, i)` | `SELECT score FROM apotheosis_scores WHERE run_id = $runId ORDER BY created_at DESC LIMIT 1` |
| `deterministicPercentage(91, 4, 'prev-score', orgId, i)` | `SELECT score FROM apotheosis_scores WHERE ... OFFSET 1 LIMIT 1` |
| `deterministicFloat('score-delta', orgId, i)` | `current_score - previous_score` |
| `deterministicInt(700, 900, 'compute-hours', orgId, i)` | `SELECT EXTRACT(EPOCH FROM (completed_at - started_at))/3600 FROM apotheosis_runs` |
| `deterministicInt(150, 190, 'duration', orgId, i)` | Same — real duration from `apotheosis_runs.completed_at - started_at` in minutes |
| `deterministicFloat('scenario-survival', ...)` | Real Crucible simulation result from `crucible_simulations.outcome` |

**Approach:** All 13 calls map directly to existing Prisma models. Pure DB queries.

---

### 1.3 PredictService.ts (10 fake calls)
**File:** `backend/src/services/pillars/PredictService.ts`  
**Prisma models:** `predictions`, `forecasts`, `forecast_models`, `feature_importance`

| Pattern | Real Replacement |
|---------|-----------------|
| Fake prediction scores | Query `predictions` table, compute from `forecast_models.accuracy_score` |
| Fake confidence intervals | Statistical computation from `predictions` historical accuracy |
| Fake feature importance | Query `feature_importance` table for the relevant model |
| Fake trend data | Aggregate `metric_values` over time windows |

---

### 1.4 redteamService.ts (8 fake calls)
**File:** `backend/src/services/redteamService.ts` (25.3K)  
**Prisma models:** `redteam_simulations`, `redteam_vulnerabilities`, `redteam_patches`, `redteam_scores`

| Pattern | Real Replacement |
|---------|-----------------|
| Fake vulnerability scores | `SELECT severity_score FROM redteam_vulnerabilities WHERE simulation_id = $id` |
| Fake attack success rates | `SELECT COUNT(*) FILTER (WHERE status = 'EXPLOITED') / COUNT(*) FROM redteam_vulnerabilities` |
| Fake patch effectiveness | Query `redteam_patches` for real patch status and re-test results |

**Note:** The 8 adversarial perspectives are real LLM calls via Ollama — that part is genuinely functional. Only the scoring/metrics are fake.

---

### 1.5 CendiaDissentService.ts (5 fake calls)
**File:** `backend/src/services/CendiaDissentService.ts` (46.3K)  
**Prisma models:** `dissents`, `dissent_responses`, `dissent_metrics`, `dissenter_profiles`

| Fake Call | Real Replacement |
|-----------|-----------------|
| `deterministicFloat('dissent-4') > 0.5 ? 'up' : 'stable'` | Compare `COUNT(dissents) WHERE created_at > NOW() - 30d` vs previous 30d |
| `deterministicFloat('dissent-5') * 24` | `SELECT AVG(EXTRACT(EPOCH FROM (responded_at - created_at))/3600) FROM dissent_responses` |
| `deterministicInt(5, 14, 'dissent-1')` | `SELECT COUNT(*) FROM dissents WHERE organization_id = $orgId` |
| `deterministicInt(55, 74, 'dissent-2')` | Compute from `dissents` where `outcome_validated = true` / total |
| `deterministicInt(100000, 499999, 'dissent-3')` | Sum of `decisions.financial_impact` for decisions where dissent was filed and later validated |

---

### 1.6 CendiaRecallService.ts (9 fake calls)
**File:** `backend/src/services/CendiaRecallService.ts` (24.7K)  
**Prisma models:** `decision_outcomes`, `decisions`, `echo_patterns`

| Fake Call | Real Replacement |
|-----------|-----------------|
| `deterministicPercentage(72, 10, 'recall-accuracy', orgId)` | `SELECT AVG(CASE WHEN predicted_outcome ~= actual_outcome THEN 100 ELSE 0 END) FROM decision_outcomes` |
| `deterministicPercentage(68-88, *, 'cat-*', orgId)` (4 calls) | Same query grouped by `decision_type` (strategic/financial/operational/compliance) |
| `deterministicPercentage(70+, 5, 'trend', orgId, i)` | Window function over `decision_outcomes` by month |
| `deterministicInt(45, 120, 'total-decisions', orgId)` | `SELECT COUNT(*) FROM decisions WHERE organization_id = $orgId` |
| `deterministicInt(20, 60, 'measured-decisions', orgId)` | `SELECT COUNT(*) FROM decision_outcomes WHERE organization_id = $orgId AND actual_outcome IS NOT NULL` |

**Note:** The service already has Prisma queries for some paths (`allOutcomes.length ||` fallback). The fake data is the fallback when no real data exists. Fix: return honest zeros/nulls instead of fake numbers.

---

## PRIORITY 2: SOVEREIGN SERVICES (5 services, ~25 fake calls)

### 2.1 CanaryTripwireService.ts (10 fake calls)
**Prisma models:** `canary_systems`, `canary_alerts`

| Pattern | Real Replacement |
|---------|-----------------|
| Fake alert counts | `SELECT COUNT(*) FROM canary_alerts WHERE system_id = $id AND severity = $level` |
| Fake detection rates | `COUNT(detected) / COUNT(total)` from `canary_alerts` |
| Fake response times | `AVG(response_time_ms) FROM canary_alerts` |

### 2.2 ShadowCouncilService.ts (7 fake calls)
**Prisma models:** `deliberations`, `deliberation_messages`

| Pattern | Real Replacement |
|---------|-----------------|
| Fake shadow deliberation scores | Run actual parallel deliberation via `DeliberationService` with shadow parameters, compare outputs |
| Fake divergence metrics | `diff(main_deliberation.outcome, shadow_deliberation.outcome)` |

### 2.3 CendiaBlackBoxService.ts (2 fake calls)
**Prisma models:** `blackbox_units`, `stored_records`

| Fake Call | Real Replacement |
|-----------|-----------------|
| `deterministicInt(0, 999999999, 'blackbox-1')` | Real `fs.stat(filePath).size` or `Buffer.byteLength(encryptedData)` |
| `deterministicFloat('blackbox-2') > 0.01` | Real hash verification: `computeHash(data) === storedHash` |

### 2.4 CendiaMirrorService.ts (2 fake calls)
**Prisma models:** `digital_twins`, `twin_snapshots`

### 2.5 FederatedMeshService.ts (2 fake calls)
**Prisma models:** `mesh_nodes`, `mesh_connections`, `mesh_network_stats`

---

## PRIORITY 3: ENTERPRISE SERVICES (4 services, ~30 fake calls)

### 3.1 CendiaEquityService.ts (10 fake calls)
**Prisma models:** `enterprise_skill_profiles`, `enterprise_learning_paths`, `enterprise_culture_profiles`

All HR metrics should come from real Prisma queries or real BambooHR API integration.

### 3.2 SystemHealthService.ts (6 fake calls)
**Prisma models:** `health_checks`, `health_incidents`, `health_scores`

Replace with real system metrics: `process.memoryUsage()`, `process.uptime()`, Redis `INFO`, PostgreSQL `pg_stat_activity`.

### 3.3 ComplianceService.ts (2 fake calls)
**Prisma models:** `panopticon_regulations`, `panopticon_violations`, `regulatory_constraints`

### 3.4 RDPService.ts (5 fake calls)
Replace deployment metrics with real Docker/K8s API calls or process monitoring.

---

## PRIORITY 4: AGENT & VERTICAL SERVICES (~30 fake calls)

### 4.1 InsuranceVertical.ts (5 fake calls)
**Prisma models:** `enterprise_contracts` + insurance-specific schemas

### 4.2 MetaGovernanceAgentsService.ts (4 fake calls)
**Prisma models:** `agents`, `deliberation_messages`, `deliberation_votes`

### 4.3 LegalAgents.ts (3 fake calls)
**Prisma models:** `enterprise_legal_matters` + legal vertical schemas

### 4.4 VerticalAgentsService.ts (3 fake calls)
Replace with real Ollama LLM calls for agent analysis.

### 4.5 SyntheticMediaAuthService.ts (5 fake calls)
Replace with real media hash verification and C2PA metadata parsing.

---

## PRIORITY 5: SIMULATION ENGINES (KEEP — but improve inputs)

These services are **legitimately simulation engines** — their purpose IS to simulate. But they should use real statistical distributions seeded from real data, not `deterministicFloat('hardcoded-seed')`.

### 5.1 CendiaCrucibleService.ts (3 fake calls)
- Replace `deterministicFloat('crucible-1')` with proper Box-Muller normal distribution
- Feed real organizational data into Monte Carlo inputs

### 5.2 CollapseOrchestrator.ts (2 fake calls)
- Replace deterministic picks with weighted selection from real organizational risk profiles

### 5.3 FlowService.ts (2 fake calls)
- Replace with real workflow execution metrics from `workflow_executions`

### 5.4 AdversarialRedTeamService.ts (2 fake calls)
- Scoring should come from real LLM evaluation of attack results

### 5.5 DeterministicReplayService.ts (2 fake calls)
- This service IS about deterministic replay — the calls may be legitimate here

---

## PRIORITY 6: UTILITY / OK AS-IS

### 6.1 SampleDataService.ts (9 fake calls)
**Status:** KEEP — This service explicitly generates demo/seed data. Its entire purpose is to create sample data for demos and testing.

### 6.2 types.ts (3 fake calls)
**Status:** These are type definitions with default values — not runtime data.

---

## IMPLEMENTATION APPROACH

### For each service, the fix pattern is:

```typescript
// BEFORE (fake):
const accuracy = deterministicPercentage(72, 10, 'recall-accuracy', organizationId);

// AFTER (real):
const outcomes = await prisma.decision_outcomes.findMany({
  where: { organization_id: organizationId, actual_outcome: { not: null } },
});
const correct = outcomes.filter(o => 
  Math.abs(o.predicted_score - o.actual_score) < o.threshold
).length;
const accuracy = outcomes.length > 0 
  ? (correct / outcomes.length) * 100 
  : null; // Return null, not fake data, when no real data exists
```

### Key principle: **Return null/empty when no real data exists**
Don't generate fake numbers to fill gaps. Let the frontend show "No data yet" or "Awaiting first run." That's honest.

### For simulation engines:
```typescript
// BEFORE (hardcoded seed):
const probability = deterministicFloat('cascade-chance', eventType);

// AFTER (real statistical distribution with real seed):
import { createHash } from 'crypto';
function normalRandom(mean: number, stddev: number, seed: string): number {
  // Box-Muller transform with crypto-seeded PRNG
  const hash = createHash('sha256').update(seed).digest();
  const u1 = hash.readUInt32BE(0) / 0xFFFFFFFF;
  const u2 = hash.readUInt32BE(4) / 0xFFFFFFFF;
  const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
  return mean + z * stddev;
}

// Use real historical data as the distribution parameters:
const historicalCascadeRate = await prisma.chronos_events.aggregate({
  where: { event_type: eventType, type: 'cascade' },
  _avg: { probability: true },
});
const probability = normalRandom(
  historicalCascadeRate._avg.probability ?? 0.3,
  0.1,
  `${eventType}-${Date.now()}`  // Time-varying seed, not hardcoded
);
```

---

## ESTIMATED EFFORT

| Priority | Services | Fake Calls | Effort | Impact |
|----------|----------|-----------|--------|--------|
| P1: Core Pipeline | 6 | ~75 | 3-4 days | 🔴 Highest — customer-facing |
| P2: Sovereign | 5 | ~25 | 2 days | 🔴 High — security claims |
| P3: Enterprise | 4 | ~30 | 2 days | 🟡 Medium — operational |
| P4: Agents/Verticals | 5 | ~20 | 1-2 days | 🟡 Medium — industry-specific |
| P5: Simulation (improve) | 5 | ~10 | 1 day | 🟢 Low — already legitimate |
| P6: Keep as-is | 2 | ~12 | 0 | ⬜ N/A — demo/types |
| **Total** | **27** | **~245** | **~10-12 days** | |

---

## IN-MEMORY MAP MIGRATION (Separate Track)

These services use `new Map()` for data that should be in the database:

| Service | Maps | Target Table |
|---------|------|-------------|
| Evidence Vault | packets, approvals | `stored_records`, `approvals` |
| War Games | scenarios, simulations | `scenarios`, `simulations` |
| Dissent (some) | assessments | `dissents`, `dissent_metrics` |
| RDP | instances | `execution_nodes` |
| Synthesis Engine | activeSyntheses | New model or `workflow_executions` |

**Note:** Vertical `decisionSchemas` and `agentPresets` Maps are **OK as-is** — they're configuration registries, not data storage.

---

## VERIFICATION CHECKLIST

After each service is fixed:
- [ ] 0 `deterministic*()` calls with hardcoded seeds (simulation engines excepted)
- [ ] All metrics come from Prisma queries or real computation
- [ ] Returns `null`/empty when no data exists (not fake numbers)
- [ ] Existing API contract unchanged (same response shape)
- [ ] Unit test passes with empty DB (returns nulls, not errors)
- [ ] Unit test passes with seeded DB (returns real computed values)

---

*This plan covers all 245 `deterministic*()` calls across the platform. Estimated total effort: 10-12 engineering days. The architecture, types, routes, and API contracts are all correct — only the data computation needs to change.*
