# Datacendia Data Source Audit

## Summary
Audit of all pages to identify mock/static data vs real API data.

**Goal**: All data must come from PostgreSQL via API endpoints.

---

## ✅ PAGES WITH REAL API DATA

These pages fetch data from backend APIs connected to PostgreSQL:

| Page | API Endpoint | Database Table |
|------|--------------|----------------|
| Dashboard | `/health/score`, `/alerts` | `health_scores`, `alerts` |
| Council | `/council/deliberations` | `deliberations`, `council_agents` |
| Graph Explorer | `/graph/entities` | Neo4j (synced) |
| Pulse | `/health/*` | `health_scores`, `metric_values` |
| Lens (Forecasts) | `/predict/forecasts` | `forecasts`, `scenarios` |
| Pillars/Helm | `/metrics` | `metrics`, `metric_definitions` |
| Pillars/Flow | `/workflows` | `workflows` |
| Pillars/Guard | `/alerts` | `alerts` |
| Pillars/Ethics | `/vox/stakeholders` | `vox_stakeholders` |
| Sovereign/Panopticon | `/panopticon/frameworks` | `panopticon_frameworks` |
| Sovereign/Aegis | `/aegis/threats` | `aegis_threats` |
| Sovereign/Eternal | `/eternal/artifacts` | `eternal_artifacts` |
| Sovereign/Symbiont | `/symbiont/entities` | `symbiont_entities` |
| Sovereign/Vox | `/vox/stakeholders` | `vox_stakeholders` |
| Sovereign/Crucible | `/crucible/*` | `crucible_*` |

---

## ❌ PAGES WITH MOCK/STATIC DATA (NEEDS FIX)

### Priority 1: Enterprise Features (High Business Value)

| Page | Current State | Needs |
|------|---------------|-------|
| **CendiaMesh™** | Hardcoded stats, alerts, benchmarks | API + DB tables for network data |
| **PersonaForge™** | Static personas | API + DB for digital twins |
| **CendiaGovern™** | Static policies | API + DB for governance policies |
| **CendiaVoice™** | Mock conversations | API + DB for voice sessions |
| **CendiaAutopilot™** | Static automation rules | API + DB for autopilot config |
| **CendiaLedger™** | Mock blockchain entries | API + DB for decision ledger |
| **CendiaVeto™** | Static veto rules | API + DB for adversarial governance |
| **CendiaUnion™** | Mock employee data | API + DB for workforce analytics |

### Priority 2: Decision Intelligence Suite

| Page | Current State | Needs |
|------|---------------|-------|
| **Chronos** | Static timeline | API + DB for time machine data |
| **Decision DNA** | Mock decision history | API + DB for decision tracking |
| **Ghost Board** | Static board simulation | API + DB for rehearsal data |
| **Pre-Mortem** | Mock analysis | API + real calculation engine |
| **Decision Debt** | Static debt tracker | API + DB for decision debt |
| **Live Demo** | Hardcoded demo data | Real data connections |
| **Regulatory Absorb** | Static regulations | API + DB for regulation data |

### Priority 3: Other Pages

| Page | Current State | Needs |
|------|---------------|-------|
| Settings | Partially static | API for user preferences |
| Security | Static | API for security policies |
| Bridge subpages | Static | API for integration data |
| Lens subpages | Static | API for scenario data |

### Priority 4: Marketing/Public (Lower Priority)

| Page | Current State | Notes |
|------|---------------|-------|
| Landing Page | Static | Acceptable for marketing |
| Pricing | Static | Acceptable for marketing |
| Pitch Deck | Static | Acceptable for sales |
| Downloads | Static | Acceptable |

---

## 🗄️ REQUIRED DATABASE TABLES

### For CendiaMesh™
```sql
mesh_network_stats      -- Network-wide statistics
mesh_participants       -- Anonymous participant records
mesh_benchmarks         -- Industry benchmark data
mesh_risk_signals       -- Cross-company risk alerts
mesh_pricing_intel      -- Anonymized pricing data
mesh_supply_chain       -- Supply chain signals
```

### For PersonaForge™
```sql
persona_twins           -- Digital twin configurations
persona_training_data   -- Training datasets
persona_conversations   -- Twin conversation logs
```

### For CendiaGovern™
```sql
govern_policies         -- Policy definitions
govern_rules            -- Business rules
govern_audits           -- Compliance audits
```

### For Decision Intelligence
```sql
decision_dna            -- Decision lifecycle tracking
decision_debt           -- Stuck decision tracking
ghost_board_sessions    -- Board rehearsal data
pre_mortem_analyses     -- Failure mode analyses
chronos_snapshots       -- Time machine snapshots
```

---

## 📋 IMPLEMENTATION PLAN

### Phase 1: Create Missing Prisma Models (1-2 hours)
- Add all required tables to `schema.prisma`
- Run `prisma migrate dev`

### Phase 2: Create API Routes (2-3 hours)
- Create route files for each domain
- Standard CRUD + specialized endpoints

### Phase 3: Seed Initial Data (1 hour)
- Create realistic seed data
- Run seed script

### Phase 4: Connect Frontends (2-3 hours)
- Update each page to use API
- Remove mock data generators

### Phase 5: Verify (1 hour)
- Test all pages
- Confirm data persistence

---

## 🎯 RECOMMENDED ORDER

1. **CendiaMesh™** - Flagship enterprise feature
2. **Decision Intelligence Suite** - High-value differentiation
3. **Enterprise Suite** - Revenue drivers
4. **Other pages** - Polish

**Estimated Total Effort**: 8-12 hours for complete real data integration
