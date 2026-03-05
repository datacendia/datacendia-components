# File Decomposition Plan

> **Created:** 2026-03-05
> **Purpose:** Track decomposition of files exceeding 50KB into maintainable sub-modules.
> **Rule:** No file should exceed 50KB (~1,200 lines). Services should be split by responsibility.

## Priority Tiers

### Tier 1 — Core Services (Split Immediately)
| File | Size | Proposed Split |
|------|------|---------------|
| `CendiaCrucibleService.ts` | 103KB | → `crucible/SecurityTestRunner.ts`, `crucible/VulnerabilityScanner.ts`, `crucible/ReportGenerator.ts` |
| `council.ts` (route) | 78KB | → `council/deliberation-routes.ts`, `council/agent-routes.ts`, `council/query-routes.ts`, `council/admin-routes.ts` |
| `CendiaApotheosisService.ts` | 76KB | → `apotheosis/RedTeamEngine.ts`, `apotheosis/PatchingService.ts`, `apotheosis/UpskillEngine.ts` |
| `CendiaHorizonService.ts` | 72KB | → `horizon/ForecastEngine.ts`, `horizon/ScenarioBuilder.ts`, `horizon/TrendAnalyzer.ts` |
| `CendiaPanopticonService.ts` | 60KB | → `panopticon/ComplianceScanner.ts`, `panopticon/AlertEngine.ts`, `panopticon/ReportBuilder.ts` |
| `CendiaAegisService.ts` | 60KB | → `aegis/ThreatDetector.ts`, `aegis/IncidentManager.ts`, `aegis/ResponseOrchestrator.ts` |

### Tier 2 — Config & Data Files (Refactor Pattern)
| File | Size | Proposed Split |
|------|------|---------------|
| `modelZoo.ts` | 93KB | → `models/definitions.ts`, `models/agent-mappings.ts`, `models/capabilities.ts` |
| `compliance/frameworks.ts` | 53KB | → Split by domain: `frameworks/privacy.ts`, `frameworks/financial.ts`, etc. |
| `PDFGeneratorService.ts` | 62KB | → `pdf/templates.ts`, `pdf/renderer.ts`, `pdf/styles.ts` |

### Tier 3 — Vertical Templates (Pattern Change)
These 20+ verticals follow a template. Rather than splitting each one:
1. Extract shared vertical logic into `verticals/core/VerticalBase.ts`
2. Each vertical should only contain industry-specific overrides
3. Move compliance configs, decision schemas, and agent presets into separate files per vertical (already partially done for some)

## Decomposition Pattern

```typescript
// BEFORE: monolith.ts (100KB)
export class BigService {
  methodA() { ... }
  methodB() { ... }
  methodC() { ... }
}

// AFTER: Split by responsibility
// service/engine.ts
export class Engine { methodA() { ... } }

// service/processor.ts
export class Processor { methodB() { ... } }

// service/reporter.ts
export class Reporter { methodC() { ... } }

// service/index.ts (barrel export)
export { Engine } from './engine.js';
export { Processor } from './processor.js';
export { Reporter } from './reporter.js';
```

## Progress Tracker

- [ ] CendiaCrucibleService.ts (103KB)
- [ ] council.ts route (78KB)
- [ ] CendiaApotheosisService.ts (76KB)
- [ ] CendiaHorizonService.ts (72KB)
- [ ] CendiaPanopticonService.ts (60KB)
- [ ] CendiaAegisService.ts (60KB)
- [ ] modelZoo.ts (93KB)
- [ ] PDFGeneratorService.ts (62KB)
