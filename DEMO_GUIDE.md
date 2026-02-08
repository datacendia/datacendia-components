# Datacendia Demo Guide

## Quick Start

### 1. Prerequisites (already running)
```bash
# Backend (port 3001)
cd backend && npm run dev

# Frontend (port 5173)
npm run dev

# Ollama (port 11434) - for live Council deliberations
ollama serve
```

### 2. Login
- **URL:** http://localhost:5173
- **Email:** `stuart.rainey@datacendia.com`
- **Password:** `DatacendiaOwner2024!`

### 3. Seed Demo Data (one-time)
```bash
# Full company data (Acme Corporation)
cd backend && npx ts-node prisma/seed-full-demo.ts

# TR Scenario (Meridian Capital PEP Transfer)
curl -X POST http://localhost:3001/api/v1/demo/seed/tr
```

### 4. Launch Demo Studio
Navigate to: **http://localhost:5173/cortex/demo**

---

## Available Demos

### 🎯 Executive Overview (5 min)
**Best for:** Investors, VCs, board members
**Flow:** Dashboard → Council → Evidence Vault → Pricing
**Key talking points:**
- "Traditional AI gives predictions without proof"
- "14 AI agents debate decisions with full audit trail"
- "Runs on YOUR infrastructure — sovereign by design"

### 🏛️ The Council in Action (15 min)
**Best for:** Decision-makers, strategy teams
**Flow:** Council page → Live deliberation → Dissent → Export
**Key talking points:**
- Watch agents analyze from CFO, Legal, Risk, Red Team perspectives
- Show dissent recording (audit-proof disagreement)
- Export decision packet with one click

### 📋 Audit & Compliance (10 min)
**Best for:** CISO, legal, compliance officers
**Flow:** Evidence Vault → Ledger → Decision Lineage → Compliance Mapping
**Key talking points:**
- Cryptographically signed evidence packets
- Tamper-evident immutable ledger
- SOC 2, ISO 27001, NIST 800-53 control mapping

### 🏢 Industry Verticals (10 min)
**Best for:** Domain experts, industry buyers
**Flow:** Vertical Config → Financial Services → Healthcare → Defense
**Key talking points:**
- 24 industry configurations
- Different industries enable different services
- Compliance frameworks pre-configured per vertical

### ⚙️ Technical Deep-Dive (20 min)
**Best for:** IT architects, DevOps, security teams
**Flow:** Architecture → Docker → Adapters → KMS → Monitoring → API
**Key talking points:**
- Containerized, Docker Compose deployment
- 16 connector suites on 6 universal adapters
- KMS/HSM integration, post-quantum cryptography

---

## Demo Controls

### Keyboard Shortcuts (during active demo)
| Key | Action |
|-----|--------|
| `→` (Right Arrow) | Next step |
| `←` (Left Arrow) | Previous step |
| `Space` | Play / Pause auto-advance |
| `Escape` | Exit demo |
| `S` | Toggle script teleprompter |

### Overlay Controls (top-right)
- **📝 Script** — Toggle teleprompter visibility
- **🖥️ Clean Mode** — Hide debug UI elements
- **👁️ Hide Overlay** — Hide the entire demo overlay
- **❌ Exit** — Stop the demo

---

## Live Council Deliberation (The WOW Moment)

For investors, the most impressive demo is a **live Council deliberation**:

1. Navigate to `/cortex/council`
2. Type a question like:
   > "Should we acquire TechStart Inc for $200M? They have strong IP but 70% revenue concentration in 3 customers."
3. Select agents (CFO, Legal, Risk, Red Team, Arbiter)
4. Click **Deliberate**
5. Watch agents respond in real-time via Ollama

**Recommended model for demos:** `deepseek-r1:32b` (quality) or `llama3.2:3b` (speed)

**Pre-warm models** (faster first response):
```bash
ollama run deepseek-r1:32b "test" --verbose
```

---

## Pre-Seeded Demo Scenarios

### Acme Corporation (General)
- **Org:** Acme Corporation (Technology, 2500 employees)
- **Users:** 5 (CEO, CFO, CTO, COO, Analyst)
- **Data:** 7 decisions, 5 deliberations, 7 alerts, 8 metrics (12mo history), 6 data sources, 5 teams, 5 workflows, 50 audit logs

### Meridian Capital (Financial Services)
- **Org:** Meridian Capital Partners (Financial Services, 5000-10000)
- **Scenario:** $2.5M PEP transfer to Viktor Petrov through Cyprus holding company
- **Agents:** CFO Advisor, Risk Analyzer, Legal Counsel, Compliance Bot
- **Features:** 6 deliberation messages, formal dissent, Basel III compliance, decision packet with Merkle tree
- **Regulatory:** SEC, FINRA, Basel III frameworks

---

## Key Pages to Show

| Page | URL | What It Shows |
|------|-----|---------------|
| Dashboard | `/cortex/dashboard` | KPIs, health score, alerts, verticals |
| The Council | `/cortex/council` | Live AI deliberation (needs Ollama) |
| Deliberation Viz | `/cortex/council/visualization` | Animated agent debate (has built-in demo data) |
| Replay Theater | `/cortex/council/replay-theater` | Replay past deliberations |
| Decisions | `/cortex/decisions` | Decision tracking & management |
| Evidence Vault | `/cortex/evidence-vault` | Audit evidence packets |
| Ledger | `/cortex/ledger` | Immutable decision ledger |
| Vertical Config | `/cortex/admin/vertical-config` | 24 industry configurations |
| Chronos | `/cortex/intelligence/chronos` | Pivotal moment detection |
| Cascade | `/cortex/enterprise/cascade` | Butterfly effect analysis |
| Demo Studio | `/cortex/demo` | Launch guided demos |

---

## Recording Tips

1. **Use 1920x1080 resolution** for professional recordings
2. **Start with Clean Mode ON** (hides debug elements)
3. **Use the teleprompter** — read the script naturally, don't memorize
4. **Pause between steps** — let the audience absorb each feature
5. **For live demos:** Pre-load the Council page and have a question ready
6. **For recordings:** Use the auto-advance feature (Space to play)

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| "Ollama not running" on Council page | Run `ollama serve` |
| Empty dashboard | Run `npx ts-node prisma/seed-full-demo.ts` in backend/ |
| Login fails | Run `npx tsx prisma/seed.ts` in backend/ to create users |
| Slow first Council response | Pre-warm with `ollama run deepseek-r1:32b "test"` |
| Demo overlay not showing | Press `H` or check if overlay is hidden |

---

## Demo API Endpoints

```bash
# List available scenarios
curl http://localhost:3001/api/v1/demo/scenarios

# Check demo data status
curl http://localhost:3001/api/v1/demo/status

# Seed TR scenario
curl -X POST http://localhost:3001/api/v1/demo/seed/tr

# Seed all demo data
curl -X POST http://localhost:3001/api/v1/demo/seed

# Clear demo data
curl -X DELETE http://localhost:3001/api/v1/demo/clear
curl -X DELETE http://localhost:3001/api/v1/demo/clear/tr
```
