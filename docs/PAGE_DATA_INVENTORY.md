# Page Data Inventory

**Purpose:** Track which pages use real API integration vs. hardcoded sample/demo data.  
**Last Updated:** January 29, 2026  
**Action Required:** Replace sample data with proper empty states or real API calls.

---

## Legend

| Status | Meaning |
|--------|---------|
| ✅ **Real API** | Page fetches data from backend APIs |
| ⚠️ **Mixed** | Has API calls but also fallback sample data |
| ❌ **Sample Only** | Uses hardcoded SAMPLE_/MOCK_ constants |
| 🔄 **Hybrid** | Real API with sample data for demos |

---

## Pages with Sample/Demo Data (Need Attention)

These pages have hardcoded `SAMPLE_` or `MOCK_` constants that should be replaced:

| Page | File | Sample Data Type | Priority | Notes |
|------|------|------------------|----------|-------|
| **Vox Page** | `src/pages/sovereign/VoxPage.tsx` | 7 sample constants | High | Voice interface demo data |
| **Admin Dashboard** | `src/pages/admin/AdminDashboard.tsx` | 4 sample constants | High | Main admin view |
| **Training Page** | `src/pages/cortex/enterprise/TrainingPage.tsx` | 4 sample constants | Medium | Training modules |
| **Evidence Vault** | `src/pages/cortex/enterprise/EvidenceVaultPage.tsx` | 3 sample constants | High | Evidence records |
| **Crisis Management** | `src/pages/cortex/enterprise/CrisisManagementPage.tsx` | 2 sample constants | Medium | Crisis scenarios |
| **Decision Packets** | `src/pages/cortex/governance/DecisionPacketsPage.tsx` | 2 sample constants | High | Core feature |
| **Decision DNA** | `src/pages/cortex/intelligence/DecisionDNAPage.tsx` | 2 sample constants | High | Core feature - TR Demo |
| **Audit Workflow** | `src/pages/cortex/enterprise/AuditWorkflowPage.tsx` | 1 sample constant | Medium | Audit trails |
| **OmniTranslate** | `src/pages/cortex/enterprise/OmniTranslatePage.tsx` | 1 sample constant | Low | Translation demo |
| **Regulatory Absorb** | `src/pages/cortex/intelligence/RegulatoryAbsorbPage.tsx` | 1 sample constant | Low | Regulatory content |

---

## Pages with Real API Integration (Good)

These pages properly fetch data from backend APIs:

### Admin Pages
| Page | File | API Endpoints Used |
|------|------|--------------------|
| Control Center | `src/pages/admin/ControlCenterPage.tsx` | Multiple admin APIs |
| Data Sources | `src/pages/admin/DataSourcesPage.tsx` | `/api/v1/data-sources` |
| Tenants | `src/pages/admin/TenantsPage.tsx` | `/api/v1/organizations` |
| Licenses | `src/pages/admin/LicensesPage.tsx` | `/api/v1/admin/licenses` |
| Feature Flags | `src/pages/admin/FeatureFlagsPage.tsx` | `/api/v1/admin/feature-flags` |
| System Health | `src/pages/admin/SystemHealthPage.tsx` | `/api/v1/health` |
| Usage Analytics | `src/pages/admin/UsageAnalyticsPage.tsx` | `/api/v1/metrics` |
| Schema Mapping | `src/pages/admin/SchemaMappingPage.tsx` | `/api/v1/schema` |

### Cortex Core Pages
| Page | File | API Endpoints Used |
|------|------|--------------------|
| Council | `src/pages/cortex/council/CouncilPage.tsx` | `/api/v1/council`, Ollama |
| Dashboard | `src/pages/cortex/DashboardPage.tsx` | Multiple metrics APIs |
| Chronos | `src/pages/cortex/intelligence/ChronosPage.tsx` | `/api/v1/decisions` |
| Pulse | `src/pages/cortex/pulse/PulsePage.tsx` | `/api/v1/metrics` |
| Compliance | `src/pages/cortex/compliance/ComplianceDashboard.tsx` | `/api/v1/compliance` |
| Graph Explorer | `src/pages/cortex/graph/GraphExplorerPage.tsx` | `/api/v1/graph` |

### Enterprise Pages
| Page | File | API Endpoints Used |
|------|------|--------------------|
| Ledger | `src/pages/cortex/enterprise/LedgerPage.tsx` | `/api/v1/ledger` |
| Veto | `src/pages/cortex/enterprise/VetoPage.tsx` | `/api/v1/veto` |
| Union | `src/pages/cortex/enterprise/UnionPage.tsx` | `/api/v1/union` |
| Autopilot | `src/pages/cortex/enterprise/AutopilotPage.tsx` | `/api/v1/autopilot` |
| Cascade | `src/pages/cortex/enterprise/CascadePage.tsx` | `/api/v1/cascade` |
| Dissent | `src/pages/cortex/enterprise/DissentPage.tsx` | `/api/v1/dissent` |
| Apotheosis | `src/pages/cortex/enterprise/ApotheosisPage.tsx` | `/api/v1/apotheosis` |
| Mesh | `src/pages/cortex/enterprise/MeshPage.tsx` | `/api/v1/mesh` |
| CendiaROI | `src/pages/cortex/enterprise/ROIMetricsPage.tsx` | `/api/v1/roi-metrics` |

### Sovereign Pages
| Page | File | API Endpoints Used |
|------|------|--------------------|
| Crucible | `src/pages/sovereign/CruciblePage.tsx` | `/api/v1/crucible` |
| Aegis | `src/pages/sovereign/AegisPage.tsx` | `/api/v1/aegis` |
| Eternal | `src/pages/sovereign/EternalPage.tsx` | `/api/v1/eternal` |
| Panopticon | `src/pages/sovereign/PanopticonPage.tsx` | `/api/v1/panopticon` |
| Symbiont | `src/pages/sovereign/SymbiontPage.tsx` | `/api/v1/symbiont` |
| SGAS | `src/pages/cortex/sovereign/SGASPage.tsx` | `/api/v1/sgas` |
| SCGE | `src/pages/cortex/sovereign/SCGEPage.tsx` | `/api/v1/scge` |
| Collapse | `src/pages/cortex/sovereign/CollapsePage.tsx` | `/api/v1/collapse` |
| Notary | `src/pages/cortex/sovereign/NotaryPage.tsx` | `/api/v1/vault` |

### Crown Pages
| Page | File | API Endpoints Used |
|------|------|--------------------|
| Echo | `src/pages/cortex/crown/EchoPage.tsx` | `/api/v1/echo` |
| Gnosis | `src/pages/cortex/crown/GnosisPage.tsx` | `/api/v1/gnosis` |
| Red Team | `src/pages/cortex/crown/RedTeamPage.tsx` | `/api/v1/redteam` |

---

## Recommended Actions

### High Priority (Before Enterprise Sales)

1. **Decision DNA Page** - Remove `SAMPLE_DECISIONS_DETAIL` constant, use only API data
2. **Decision Packets Page** - Remove sample packets, fetch from `/api/v1/council-packets`
3. **Evidence Vault Page** - Remove sample evidence, fetch from `/api/v1/evidence`
4. **Admin Dashboard** - Remove sample metrics, fetch from real APIs

### Medium Priority

5. **Training Page** - Add proper empty state when no training data
6. **Crisis Management** - Fetch crisis scenarios from API or show empty state
7. **Audit Workflow** - Connect to real audit trail API

### Low Priority (Demo-Specific)

8. **OmniTranslate** - Sample translations acceptable for demo
9. **Regulatory Absorb** - Sample regulations acceptable for demo
10. **Vox Page** - Voice samples acceptable for demo

---

## Pattern for Replacing Sample Data

### Before (Bad)
```typescript
const SAMPLE_DATA = [
  { id: '1', name: 'Sample Item', ... },
  { id: '2', name: 'Another Sample', ... },
];

export function MyPage() {
  const [data, setData] = useState(SAMPLE_DATA);
  // ...
}
```

### After (Good)
```typescript
export function MyPage() {
  const [data, setData] = useState<DataType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadData() {
      try {
        const response = await api.get('/my-endpoint');
        setData(response.data);
      } catch (err) {
        setError('Failed to load data');
      } finally {
        setIsLoading(false);
      }
    }
    loadData();
  }, []);

  if (isLoading) return <LoadingSpinner />;
  if (error) return <ErrorState message={error} />;
  if (data.length === 0) return <EmptyState message="No data yet" />;
  
  return <DataList data={data} />;
}
```

---

## Test Files (Keep Mock Data)

Mock data in `__tests__/` folders is **correct and should be kept**:

- `src/lib/__tests__/errorTracking.test.ts` - 70 mock matches ✅
- `src/hooks/__tests__/usePremiumFeatures.test.ts` - 20 mock matches ✅
- `src/lib/__tests__/featureFlags.test.ts` - 17 mock matches ✅
- `src/stores/__tests__/authStore.test.ts` - 9 mock matches ✅
- `src/lib/api/client.test.ts` - 7 mock matches ✅

These are test fixtures and should remain.

---

## Summary Statistics

| Category | Count |
|----------|-------|
| Pages with sample data (need attention) | 10 |
| Pages with real API integration | 50+ |
| Test files with mock data (keep) | 5+ |
| Total sample/mock matches in `src/pages/` | 27 |
| Total sample/mock matches in `src/` (all) | 559 |
