# Architecture Violations Report

**Intended Flow:** `Sources → Pillars → Cortex → Services`

**Generated:** 2025-12-21

---

## Summary

| Violation Type | Count | Severity |
|----------------|-------|----------|
| Services → Pillars (bypassing Cortex) | 8 | Medium |
| Services → Sources (bypassing both) | 3 | High |
| Cross-Service direct calls | 12 | Low |

---

## Detailed Violations

### 1. SERVICES CALLING PILLARS DIRECTLY (Should go through Cortex)

| Service | Pillar Called | API Endpoint | Fix Required |
|---------|---------------|--------------|--------------|
| `ComplianceDashboard.tsx` | Guard | `/compliance/pillars/{id}/mapping` | Route through Cortex Compliance API |
| `ChronosPage.tsx` | Helm (metrics) | `metricsApi.getMetrics()` | Route through Cortex Intelligence API |
| `ChronosPage.tsx` | Agents | `councilApi.getAllDeliberations()` | OK (Council IS Cortex) |
| `DecisionDNAPage.tsx` | Multiple | `/decisions`, `/council/deliberations` | Partially OK - decisions are Cortex |
| `LensPage.tsx` | Predict | `forecastsApi.getForecasts()` | Route through Cortex Lens API |
| `GraphExplorerPage.tsx` | Lineage | `lineageApi.getLineage()` | Route through Cortex Graph API |

### 2. SERVICES CALLING OTHER SERVICES DIRECTLY (Should go through Cortex)

| Service | Calls Service | API Endpoint | Fix Required |
|---------|---------------|--------------|--------------|
| `OmniTranslatePage.tsx` | Decision Intel | `decisionIntelApi.getChronosSnapshots()` | Should be Cortex unified API |
| `SovereignPage.tsx` | Decision Intel | `decisionIntelApi.getChronosSnapshots()` | Should be Cortex unified API |
| `DefenseStackPage.tsx` | Decision Intel | `decisionIntelApi.getPreMortemAnalyses()` | Should be Cortex unified API |
| `GenomicsPage.tsx` | Decision Intel | `decisionIntelApi.getRegulatoryItems()` | Should be Cortex unified API |
| `MeshPage.tsx` | Mesh Service | Direct mesh API calls | OK (self-service) |

### 3. SERVICES CALLING SOURCES DIRECTLY (Worst violation)

| Service | Source Called | API Endpoint | Fix Required |
|---------|---------------|--------------|--------------|
| `CascadePage.tsx` | Raw cascade data | `/api/v1/cascade/*` | Needs Cortex wrapper |
| `LiveDemoPage.tsx` | Premium endpoints | `/api/v1/premium/live-demo/*` | Needs Cortex wrapper |
| `RegulatoryAbsorbPage.tsx` | Premium endpoints | `/api/v1/premium/regulatory/absorb` | Needs Cortex wrapper |

### 4. PILLARS PAGES (Acceptable - they ARE the pillar layer)

These are correctly placed - Pillar pages calling Pillar APIs:
- `HelmPage` → `/pillars/helm/*`
- `LineagePage` → `/pillars/lineage/*`
- `PredictPage` → `/pillars/predict/*`
- `FlowPage` → `/pillars/flow/*`
- `HealthPage` → `/pillars/health/*`
- `GuardPage` → `/pillars/guard/*`
- `EthicsPage` → `/pillars/ethics/*`
- `AgentsPage` → `/pillars/agents/*`

---

## Correctly Architected Components

These follow the intended flow:

| Component | Flow | Status |
|-----------|------|--------|
| Dashboard | Uses typed API clients | ✅ Good |
| Bridge | Uses workflowsApi | ✅ Good |
| Council pages | Uses councilApi (IS Cortex) | ✅ Good |
| Echo | Uses echoApi service | ✅ Good |
| Gnosis | Uses gnosisApi service | ✅ Good |
| RedTeam | Uses redteamApi service | ✅ Good |

---

## Recommended Fix Priority

### Phase 1 (High Priority)
1. Create `CortexCoreAPI` - unified gateway
2. Wrap `CascadePage` calls through Cortex
3. Wrap `LiveDemoPage` calls through Cortex

### Phase 2 (Medium Priority)
4. Route `ChronosPage` metrics through Cortex
5. Route `ComplianceDashboard` pillar access through Cortex
6. Route `LensPage` forecasts through Cortex

### Phase 3 (Low Priority)
7. Consolidate cross-service calls (OmniTranslate, Sovereign, etc.)
8. Create Cortex facade for Decision Intel APIs

---

## Root Cause

The architecture evolved organically without a formal Cortex Core API layer. Services were built with direct API access for speed, but this created coupling that bypasses the intended abstraction.

