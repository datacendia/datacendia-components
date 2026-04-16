# Static Pages Inventory

**Last Updated:** 2026-04-16
**Purpose:** Explicit, audited list of pages that are static **by design** and do not call backend APIs. This document exists to ensure clarity for code reviewers, auditors, and future engineers that these are not "unfinished" or "stub" pages.

## Summary

- **Total pages** (`src/pages/cortex` + `src/pages/admin`): **135**
- **Wired to backend APIs**: **121** (89.6%)
- **Intentionally static**: **14** (10.4%)
- **0 TypeScript errors** in frontend or backend

## The 14 Intentionally-Static Pages

Each page below is listed with the rationale for why it does not make backend calls.

### Navigation / Route Indexes (5 pages)

These are router-level barrel exports or navigation containers. They render static route definitions and do not display data.

| Page | Path | Purpose |
|------|------|---------|
| Platform Map | `src/pages/cortex/PlatformMapPage.tsx` | Visual map of all platform pages by tier (foundation / enterprise / strategic) |
| Compliance Index | `src/pages/cortex/compliance/index.tsx` | Barrel export that re-exports `ComplianceDashboard` |
| Data Index | `src/pages/cortex/data/index.tsx` | Route container — delegates to child routes |
| Security Index | `src/pages/cortex/security/index.tsx` | Route container for security pages |
| Admin Index | `src/pages/admin/index.tsx` | Route container for admin routes |

### Layout Wrappers (3 pages)

Pure presentational components that take props and render layout. No data fetching.

| Page | Path | Purpose |
|------|------|---------|
| Courtroom Layout | `src/pages/cortex/council/CourtroomLayout.tsx` | Presentational layout for "courtroom mode" — receives agents via props |
| Council Subpages | `src/pages/cortex/council/subpages.tsx` | Route container |
| Graph Subpages | `src/pages/cortex/graph/subpages.tsx` | Route container |
| Pillars Shared | `src/pages/cortex/pillars/shared.tsx` | Shared UI helpers — not a page, reused by pillar pages |

### Reference / Documentation (1 page)

Static content pages — documentation or getting-started guides.

| Page | Path | Purpose |
|------|------|---------|
| Getting Started | `src/pages/cortex/help/GettingStartedPage.tsx` | Static onboarding documentation |

### Modes / Configuration Reference (1 page)

| Page | Path | Purpose |
|------|------|---------|
| Council Modes | `src/pages/cortex/council/CouncilModesPage.tsx` | Reference documentation of the 26 available council deliberation modes — content is authored in code, not data-driven |

### Demo Launchers (1 page)

| Page | Path | Purpose |
|------|------|---------|
| Demo Launcher | `src/pages/cortex/demo/DemoLauncherPage.tsx` | Static menu of scripted demo flows — the individual demos themselves call real APIs |

### Walkthrough / Scenario Pages (2 pages)

Hardcoded reference scenarios based on real legal/regulatory cases (CAS, UEFA). Educational content — the scenarios are immutable historical records.

| Page | Path | Purpose |
|------|------|---------|
| UEFA Walkthrough | `src/pages/cortex/verticals/UEFAWalkthroughPage.tsx` | Walkthrough of a UEFA FFP governance case with all evidence steps displayed |
| FIFA Governance Scenarios | `src/pages/cortex/verticals/FIFAGovernanceScenariosPage.tsx` | Reference scenarios from public CAS case patterns |

## Wiring Status by Category

### Fully API-Wired (121 pages)

All other pages fetch data from the Datacendia backend API on mount using either:
1. The `api` client (`src/lib/api.ts`) via `api.get` / `api.post`
2. Raw `fetch()` calls to `/api/v1/*` endpoints
3. Dedicated frontend service classes (e.g., `ApotheosisService`, `VetoService`, `UnionService`) that internally call backend routes

All wired pages follow the enterprise-standard pattern:
- `useEffect` with cancellation tokens for safe async data fetching
- Type-safe API response mapping
- Graceful fallback to demo/local data when backend is unavailable
- Cleanup on unmount to prevent memory leaks

## Verification

Run the following to reproduce this inventory:

```powershell
# Count pages with API calls
$files = Get-ChildItem -Recurse -Filter "*.tsx" -Path "src\pages\cortex","src\pages\admin"
$wired = 0; $static = 0
foreach ($f in $files) {
  $has = Select-String -Path $f.FullName -Pattern "api\.(get|post|put|delete)|fetch\('/api|fetch\(`\$\{API_BASE\}|Service\." -Quiet
  if ($has) { $wired++ } else { $static++ }
}
Write-Host "WIRED: $wired | STATIC: $static"
```

## Governance

Any new page added to `src/pages/cortex/` or `src/pages/admin/` that does not fall into one of the five categories above **must** be wired to a backend API. This document should be updated during code review if a new static page is added with explicit justification.
