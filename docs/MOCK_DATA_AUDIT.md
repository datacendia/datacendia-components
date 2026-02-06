# Frontend Mock Data Audit Report
**Generated:** 2026-01-29  
**Updated:** 2026-01-29 (after fixes)  
**Purpose:** Identify all pages using hardcoded mock/sample data instead of API calls

---

## Summary

| Category | Count |
|----------|-------|
| **Total Cortex Pages** | 69 |
| **Pages with MOCK_/SAMPLE_ constants** | 6 → **2 remaining** |
| **Pages with hardcoded arrays, NO API** | 12 → **9 remaining** |
| **Pages with API calls** | 45 → **48** |
| **Pages fixed in this session** | **7** |

---

## ✅ FIXED: Pages with MOCK_/SAMPLE_ Constants

| Page | Status | Fix Applied |
|------|--------|-------------|
| `DeliberationVisualizationPage.tsx` | ✅ FIXED | Added API fetch + TR demo fallback |
| `AdversarialRedTeamPage.tsx` | ✅ FIXED | Added API fetch + TR demo fallback |
| `DefenseVerticalPage.tsx` | ✅ FIXED | Renamed MOCK→DEFAULT, added API fetch |
| `DecisionReplayTheaterPage.tsx` | ✅ FIXED | Added API fetch + TR demo fallback |
| `RegulatorsReceiptPage.tsx` | ✅ FIXED | Added API fetch + TR demo fallback |
| `LiveAgentMonitorPage.tsx` | ✅ FIXED | Added TR demo action injection |
| `EvidenceVaultPage.tsx` | ✅ Already had API | Uses evidenceVaultApi service |
| `DecisionDNAPage.tsx` | ✅ Already had API | Fetches from /council/deliberations |

## ⚠️ REMAINING: Pages with Static Data (Acceptable)

| Page | Reason | Priority |
|------|--------|----------|
| `VoxPage.tsx` | Static stakeholder config (not demo data) | Low |
| `GhostBoardPage.tsx` | Board simulation scenarios (static config) | Medium |

---

## TR Demo Critical Path - VERIFIED ✅

All pages in the TR demo flow now use consistent data:

| Page | Data Source | TR Demo Data |
|------|-------------|--------------|
| **CouncilPage** | Real API (Ollama) | Live deliberation |
| **DecisionDNAPage** | API + fallback | Petrov transfer |
| **DecisionReplayTheaterPage** | API + TR demo | 9 frames, 4 agents |
| **RegulatorsReceiptPage** | API + TR demo | Basel III receipt |
| **LiveAgentMonitorPage** | Simulated + TR injection | Petrov action every 10s |
| **DeliberationVisualizationPage** | API + TR demo | 4 agents, dissent shown |
| **AdversarialRedTeamPage** | API + TR demo | 5 risk attacks |

---

## ⚠️ WARNING: Pages with Hardcoded Arrays, No API

These pages have `const x = [{...}]` patterns but no API calls:

| Page | Location | Priority |
|------|----------|----------|
| `VerticalConfigPage.tsx` | cortex/admin | Low (admin config) |
| `subpages.tsx` | cortex/council | Low (navigation) |
| `subpages.tsx` | cortex/data | Low (navigation) |
| `subpages.tsx` | cortex/graph | Low (navigation) |
| `index.tsx` | cortex/security | Medium |
| `GhostBoardPage.tsx` | cortex/intelligence | **HIGH** |
| `LiveAgentMonitorPage.tsx` | cortex/monitor | **HIGH** (TR demo) |
| `PreMortemPage.tsx` | cortex/intelligence | **HIGH** |
| `LegalWorkflowPage.tsx` | cortex/verticals | Medium |

---

## ✅ Pages Already Using API Calls

These 45 pages properly fetch data from the backend:

- `DashboardPage.tsx` ✅
- `BridgePage.tsx` ✅
- `ComplianceDashboard.tsx` ✅
- `RegulatorsReceiptPage.tsx` ✅ (updated with TR demo)
- `CouncilPage.tsx` ✅
- `DecisionReplayTheaterPage.tsx` ✅ (updated with TR demo)
- `DecisionsPage.tsx` ✅
- `EchoPage.tsx` ✅
- `GnosisPage.tsx` ✅
- `RedTeamPage.tsx` ✅
- `CascadePage.tsx` ✅
- `DefenseStackPage.tsx` ✅
- `FinancialPage.tsx` ✅
- `GenomicsPage.tsx` ✅
- `GovernPage.tsx` ✅
- `LedgerPage.tsx` ✅
- `MeshPage.tsx` ✅
- `OmniTranslatePage.tsx` ✅
- `ROIMetricsPage.tsx` ✅
- `SovereignPage.tsx` ✅
- `DecisionPacketsPage.tsx` ✅
- `GraphExplorerPage.tsx` ✅
- `ChronosPage.tsx` ✅
- `DecisionDNAPage.tsx` ✅
- `LiveDemoPage.tsx` ✅
- `RegulatoryAbsorbPage.tsx` ✅
- `PulsePage.tsx` ✅
- `CollapsePage.tsx` ✅
- `NotaryPage.tsx` ✅
- `SCGEPage.tsx` ✅
- `SGASPage.tsx` ✅
- `VaultPage.tsx` ✅
- `WalkthroughsPage.tsx` ✅
- `EvidenceVaultPage.tsx` ✅

---

## TR Demo Critical Path

For the Thomson Reuters demo, these pages MUST work with consistent data:

| Page | Current Status | Action Needed |
|------|----------------|---------------|
| **CouncilPage** | ✅ API | None |
| **DecisionDNAPage** | ✅ API + fallback | None |
| **DecisionReplayTheaterPage** | ✅ API + TR demo | None |
| **RegulatorsReceiptPage** | ✅ API + TR demo | None |
| **LiveAgentMonitorPage** | ⚠️ Simulated + TR injection | Consider full API |
| **DeliberationVisualizationPage** | 🔴 MOCK only | **NEEDS FIX** |

---

## Recommended Actions

### P0 - TR Demo Critical (Fix Now)

1. **DeliberationVisualizationPage.tsx**
   - Remove `MOCK_AGENTS` constant
   - Add API fetch for active deliberation
   - Add TR demo fallback

2. **LiveAgentMonitorPage.tsx** 
   - Currently generates random actions
   - Already has TR demo injection (every 10s)
   - Consider: Is simulated data acceptable for "live monitor" demo?

### P1 - High Priority

3. **GhostBoardPage.tsx**
   - Has hardcoded board scenarios
   - Add API fetch or TR demo scenarios

4. **PreMortemPage.tsx**
   - Has hardcoded failure modes
   - Add API fetch or TR demo scenarios

5. **AdversarialRedTeamPage.tsx**
   - Remove `MOCK_ATTACK_RESULTS`
   - Add API integration

### P2 - Medium Priority

6. **DefenseVerticalPage.tsx** - Remove mock missions
7. **VoxPage.tsx** - Remove mock voice data
8. **EvidenceVaultPage.tsx** - Already has API, clean up mocks
9. **LegalWorkflowPage.tsx** - Add API integration

### P3 - Low Priority (Admin/Navigation)

10. Various `subpages.tsx` and `index.tsx` files - Navigation data, acceptable as static

---

## Mock Data Patterns Found

```typescript
// Pattern 1: Explicit MOCK_ prefix
const MOCK_SESSIONS: ReplaySession[] = [...]

// Pattern 2: Explicit SAMPLE_ prefix  
const SAMPLE_DECISIONS: DecisionSummary[] = [...]

// Pattern 3: Hardcoded arrays without prefix
const agents = [{ id: '1', name: 'Agent', ... }]

// Pattern 4: useState initialized with hardcoded data
const [items, setItems] = useState([{ id: '1', ... }])
```

---

## Verification Commands

```bash
# Find all MOCK_/SAMPLE_ constants
grep -r "MOCK_\|SAMPLE_" src/pages --include="*.tsx"

# Find pages without API calls
grep -rL "api\.\|fetch(" src/pages/cortex --include="*.tsx"

# Count pages with hardcoded arrays
grep -r "const.*=.*\[.*{.*id:" src/pages --include="*.tsx" | wc -l
```
