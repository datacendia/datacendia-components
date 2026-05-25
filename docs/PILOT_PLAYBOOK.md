# Datacendia — 30-Day Pilot Playbook

> For: Pilot tier customers ($50K/yr)  
> Updated: May 2026  
> Questions: support@datacendia.com

---

## Welcome to Your Pilot

Thank you for choosing Datacendia. This playbook walks you through your first 30 days — from environment setup to your first Council deliberation with real data, compliance report generation, and the Week 4 review that determines whether we continue to a full Foundation/Enterprise contract.

The 90-day money-back guarantee gives you time to run a genuine evaluation. This playbook is designed to get you to a clear pass/fail signal by Day 30, so you have 60 days of buffer for any course corrections.

---

## What "Success" Looks Like (Quantitative)

By the end of Day 30, a successful Pilot meets all of the following:

| Metric | Target |
|---|---|
| Time to first deliberation (from `docker compose up`) | < 2 hours |
| Deliberations completed with real data | ≥ 3 |
| Decisions governed through the platform | ≥ 5 |
| Evidence packets exported | ≥ 1 (compliant, verifiable) |
| Compliance report generated | ≥ 1 |
| Audit ledger entries created | ≥ 10 |
| Users onboarded to the platform | ≥ 2 (yourself + one stakeholder) |

If you reach these targets, you have enough signal to make a go/no-go decision on a Foundation contract.

---

## Pre-Pilot Checklist

Before Day 1, confirm the following with your Datacendia account manager:

- [ ] Docker and Docker Compose installed on a machine with ≥ 6GB RAM
- [ ] `.env` file received from Datacendia (pre-configured for Pilot tier)
- [ ] Access to support@datacendia.com confirmed
- [ ] At least one real decision scenario identified for Week 2 (see below)
- [ ] Stakeholder for Week 4 review identified

---

## Week 1: Environment Setup

### Day 1 — Zero-Config Demo

The fastest path to seeing the platform:

```bash
# Clone and launch — no .env required for demo mode
git clone https://github.com/datacendia/datacendia-components.git
cd datacendia-components
docker compose -f docker-compose.demo.yml up
```

Open **http://localhost:5173** — log in as `sarah.chen@acme.demo` (no password in demo mode).

You will see:
- Acme Corporation pre-seeded with 5 users, 6 Council agents, 5 deliberations (completed + in-progress)
- 8 decisions with full reasoning chains
- 12 months of decision metrics
- A complete audit trail you can inspect, export, and verify

**Target: Day 1 complete by EOD.** If you can't get the demo running, contact support@datacendia.com with `[Pilot Day 1]` in the subject.

---

### Day 2–3 — Production Configuration

Switch from demo mode to a production-like configuration:

```bash
# Copy and edit the production environment file
cp .env.example .env
# Edit .env: set strong passwords, your organisation name, your SMTP settings

# Start production stack (PostgreSQL, Redis, Neo4j, Ollama)
docker compose -f docker-compose.production.yml up -d

# Run database migrations
cd backend && npx prisma migrate deploy && cd ..

# Seed with your organisation (replaces demo data)
npm run db:seed
```

Verify the platform is healthy:

```bash
curl http://localhost:3001/api/v1/health
curl http://localhost:3001/api/v1/health/sovereign
```

Both should return `200 OK` with a JSON health object. The sovereign health endpoint confirms all core services are running and no external dependencies are required.

---

### Day 4–5 — Configure Your First Council

A "Council" is a named group of AI agents with defined roles and mandates. The platform ships with pre-built Council configurations for 10 industries (see `docs/FINANCIAL_SERVICES_WALKTHROUGH.md` for an example).

1. Log in as an admin user
2. Navigate to **Council → New Council**
3. Select the agent preset closest to your use case (Financial, Healthcare, Government, Legal, etc.)
4. Review and adjust agent mandates — each agent has a defined role (e.g., Risk Officer, Compliance Officer, Ethics Counsel)
5. Set your deliberation parameters: consensus threshold, dissent capture, evidence retention

**Day 5 target:** A configured Council with at least 3 agents, ready for a real deliberation.

---

### Day 6–7 — Verify Audit Infrastructure

Before using the platform for real decisions, verify the audit trail is working:

1. Run a test deliberation with sample data
2. Navigate to **Audit → Ledger** — you should see Merkle-signed entries for every agent response
3. Export one evidence packet: **Evidence → Export** → download the JSON bundle
4. Verify the cryptographic signature: the bundle includes a verification script (`verify.sh`) that runs locally with no external dependencies

This is the core audit capability. If you're evaluating Datacendia for compliance purposes, this is what your auditors will inspect.

**Day 7 target:** At least one exported evidence packet you've verified locally.

---

## Week 2: First Deliberation with Real Data

### Day 8–9 — Prepare Your Decision Scenario

Choose one real, current decision from your organisation. Good candidates:

- A vendor selection or procurement decision above your normal threshold
- A policy change that requires documented justification
- A risk assessment where you want multiple perspectives challenged
- A compliance question that needs a documented answer trail

**What you need:**
- A clear decision statement (1-2 sentences: "Should we proceed with X?")
- Relevant background documents (upload as evidence to the platform)
- Any compliance constraints (the platform has a library for SOC 2, HIPAA, Basel III, EU AI Act, GDPR, and others)

---

### Day 10–12 — Run Your First Live Deliberation

1. Navigate to **Council → New Deliberation**
2. Enter your decision statement
3. Upload your background documents (the platform's ingestion service handles PDF, Word, and plain text)
4. Select applicable compliance frameworks from the dropdown
5. Click **Deliberate**

Watch what happens:
- Each agent analyses the decision from its mandate's perspective
- Agents challenge each other — look for **Dissent events** in the real-time feed
- The platform identifies the pivotal moments where cross-examination changed the analysis

**After the deliberation:**
- Review the **Synthesis** — the Council's final recommendation with confidence scores
- Check the **Dissent log** — captured minority perspectives that didn't form consensus
- Review **Regulatory flags** — any compliance blocking issues surfaced

**Day 12 target:** One completed deliberation with real data. At least one agent raised a finding that you hadn't considered going into the deliberation.

---

### Day 13–14 — Iterate and Compare

Run a second deliberation on the same decision, or a variant of it. Compare the outcomes:

- Did the Council surface different risks when you framed the question differently?
- Can you replay the deliberation from Day 12 with different assumptions? (Use **CendiaReplay™** under the deliberation detail view)
- What would the outcome have been 6 months ago? (Use **CendiaChronos™** for scenario replay)

**Day 14 target:** 3+ deliberations completed. You have a sense of how the Council behaves with your data.

---

## Week 3: Compliance Report + Evidence Export

### Day 15–17 — Generate Your First Compliance Report

The platform generates compliance reports mapped to specific frameworks. For your first report:

1. Navigate to **Compliance → Reports → New Report**
2. Select the framework most relevant to your context (SOC 2, HIPAA, GDPR, Basel III, EU AI Act)
3. Set the date range (use the last 2 weeks of deliberations)
4. Click **Generate**

The report maps every deliberation and decision to the framework's requirements. For SOC 2, this means each deliberation produces evidence mapped to CC6 (access), CC7 (monitoring), CC8 (change management), and CC9 (risk mitigation) criteria.

**What you get:**
- A structured compliance report in PDF/HTML format
- A machine-readable JSON export for your GRC tool
- An evidence bundle with cryptographic signatures verifiable by your auditor

---

### Day 18–19 — Evidence Export and Verification

Export a full evidence bundle for your Week 2 deliberations:

1. Navigate to **Evidence → Export**
2. Select the deliberations from Week 2
3. Choose export format: **Full Bundle** (includes reasoning chains, agent mandates, compliance mappings, Merkle proof)
4. Download and verify: run the included `verify.sh` script — it confirms the Merkle tree integrity without any external dependencies

**What your auditor sees in the bundle:**
- Every agent prompt and response (cryptographically signed)
- The Merkle root and proof chain (independently verifiable)
- Timestamps (RFC 3161 format — planned: live TSA integration in Q3 2026)
- Compliance framework mapping
- Dissent records (minority opinions that didn't form consensus)

---

### Day 20–21 — Integrate with Your Existing Tools

The platform exposes a full REST API at `/api/v1/`. Common integrations for Pilot customers:

- **Slack/Teams notifications** — configure webhook via `NOTIFICATIONS_WEBHOOK_URL` in `.env`
- **JIRA/Linear** — use the Evidence Export API (`POST /api/v1/evidence/export`) to push evidence bundles to your ticketing system
- **Your GRC tool** — the JSON compliance report format is designed for import into common GRC platforms

See `docs/API_DOCUMENTATION.md` for the full API reference.

**Day 21 target:** At least one integration active (even a simple webhook notification proves the API works for your stack).

---

## Week 4: Review Meeting + Success Criteria

### Day 22–25 — Prepare for the Review

Gather the following for your Week 4 review meeting:

**Quantitative evidence:**
- Number of deliberations completed (target: ≥ 3)
- Number of decisions governed (target: ≥ 5)
- Evidence packets exported and verified (target: ≥ 1)
- Compliance reports generated (target: ≥ 1)
- Time from `docker compose up` to first deliberation (target: < 2 hours)

**Qualitative evidence (prepare to answer):**
- Did the Council surface a risk or consideration you hadn't thought of going in?
- Was the audit trail sufficient for your compliance team's purposes?
- Would you trust a Council deliberation as input to a board-level or regulatory filing?
- What would need to be true for you to expand to Foundation tier?

---

### Day 26–28 — Week 4 Review Meeting Checklist

Your review meeting with your Datacendia account manager should cover:

- [ ] **Demo the audit trail** — show an evidence bundle and walk through verification
- [ ] **Show the compliance report** — confirm the framework mapping makes sense for your context
- [ ] **Review the Council's finding** from your Week 2 deliberation — did it change how you'd make that decision?
- [ ] **Discuss blockers** — anything that didn't work as expected?
- [ ] **Confirm infra requirements** for a Foundation/Enterprise contract if proceeding
- [ ] **Agree next steps** — proceed, extend Pilot, or close with money-back guarantee

---

### Day 29–30 — Go/No-Go Decision

By Day 30, make your go/no-go call:

**Proceed to Foundation/Enterprise:** Contact your account manager with your preferred tier and any customisation requirements. We'll scope the contract within 5 business days.

**Extend the Pilot:** If you need more time (up to Day 60), contact support@datacendia.com. Extensions are granted at discretion for Pilot customers making genuine progress.

**Invoke the money-back guarantee:** If the platform hasn't delivered value, contact support@datacendia.com with `[Money-Back Guarantee]` in the subject within 90 days of your Pilot start date. We will process a full refund within 10 business days. No questions asked.

---

## What the 90-Day Money-Back Guarantee Covers

The guarantee covers the full $50K Pilot fee, refundable within 90 days of the contract start date if:

- The platform failed to run in your environment after good-faith troubleshooting with our support team, **or**
- The Council failed to complete a deliberation with your real data, **or**
- You evaluated the platform in good faith and determined it does not meet your governance requirements

**Not covered:** issues caused by customer infrastructure failure, unsupported OS/hardware configurations, or deliberate misuse.

---

## Escalating Issues

| Severity | Definition | How to Escalate | Response Time |
|---|---|---|---|
| **P1 — Platform down** | Cannot complete any deliberation | Email support@datacendia.com with `[P1]` in subject | 24 hours (business days) |
| **P2 — Feature broken** | Specific feature not working | Email support@datacendia.com with feature name | 48 hours (business days) |
| **P3 — Question / How-to** | Configuration or usage question | Email support@datacendia.com | 72 hours (business days) |

Pilot tier support operates on business days. If you need 24/7 coverage, that's included in Enterprise and Strategic tiers.

---

## Reference: Key Platform Endpoints

Once running, bookmark these:

| URL | Purpose |
|---|---|
| `http://localhost:5173` | Frontend UI |
| `http://localhost:3001/api/v1/health` | Platform health check |
| `http://localhost:3001/api/v1/health/sovereign` | Sovereign mode status |
| `http://localhost:3002` | Grafana dashboards (metrics) |
| `http://localhost:8180` | Keycloak (user management) |

---

## Reference: Useful Commands

```bash
# Check platform health
curl http://localhost:3001/api/v1/health | jq .

# Check sovereign mode (confirm no external deps required)
curl http://localhost:3001/api/v1/health/sovereign | jq .

# View backend logs
docker compose logs --tail=100 api

# View all logs
docker compose logs --tail=50

# Restart a single service
docker compose restart api

# Run database migrations (after update)
cd backend && npx prisma migrate deploy && cd ..

# Export evidence bundle via API
curl -X POST http://localhost:3001/api/v1/evidence/export \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"deliberationIds": ["..."], "format": "full"}' \
  --output evidence-bundle.json
```

---

*Support: support@datacendia.com*  
*Security issues: security@datacendia.com (see SECURITY.md)*  
*Account management: sales@datacendia.com*
