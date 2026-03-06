# Tier-to-Feature Matrix

> **Auto-generated** on 2026-03-06 from `backend/src/core/subscriptions/SubscriptionTiers.ts`
> Do not edit manually — regenerate with `node scripts/generate-tier-matrix.cjs`

## Pricing

| Tier | Pricing |
|------|---------|
| **Pilot** | $50,000 — 90 days, 1 business unit |
| **Foundation** | $150,000–$500,000/year — Council + DECIDE + DCII |
| **Enterprise** | $500,000–$1,500,000/year — Foundation + StressTest, Comply, Govern, Sovereign, Operate |
| **Strategic** | $2M–$100M+/year — Enterprise + Resilience, Model, Dominate, Nation |

## Foundation Pillars

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `theCouncil` | ✓ | ✓ | ✓ | ✓ |
| `decide` | ✓ | ✓ | ✓ | ✓ |
| `dcii` | ✓ | ✓ | ✓ | ✓ |

## Foundation Services

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `preMortem` | ✓ | ✓ | ✓ | ✓ |
| `ghostBoard` | ✓ | ✓ | ✓ | ✓ |
| `decisionDebt` | ✓ | ✓ | ✓ | ✓ |
| `chronos` | ✓ | ✓ | ✓ | ✓ |
| `ninePrivimitives` | ✓ | ✓ | ✓ | ✓ |
| `evidenceVault` | ✓ | ✓ | ✓ | ✓ |
| `regulatorsReceipt` | ✓ | ✓ | ✓ | ✓ |
| `iissScoring` | ✓ | ✓ | ✓ | ✓ |
| `biasMitigation` | ✓ | ✓ | ✓ | ✓ |

## Enterprise Pillars

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `stressTest` | — | — | ✓ | ✓ |
| `comply` | — | — | ✓ | ✓ |
| `govern` | — | — | ✓ | ✓ |
| `sovereign` | — | — | ✓ | ✓ |
| `operate` | — | — | ✓ | ✓ |

## Enterprise Services

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `crucible` | — | — | ✓ | ✓ |
| `redTeam` | — | — | ✓ | ✓ |
| `warGames` | — | — | ✓ | ✓ |
| `complianceMonitor` | — | — | ✓ | ✓ |
| `regulatoryAbsorb` | — | — | ✓ | ✓ |
| `complianceGuard` | — | — | ✓ | ✓ |
| `policyEngine` | — | — | ✓ | ✓ |
| `dissent` | — | — | ✓ | ✓ |
| `autopilot` | — | — | ✓ | ✓ |
| `sovereignDeploy` | — | — | ✓ | ✓ |
| `postQuantumKMS` | — | — | ✓ | ✓ |
| `departmentCopilots` | — | — | ✓ | ✓ |
| `omniTranslate` | — | — | ✓ | ✓ |
| `apotheosis` | — | — | ✓ | ✓ |

## Strategic Pillars

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `collapse` | — | — | — | ✓ |
| `sgas` | — | — | — | ✓ |
| `verticals` | — | — | — | ✓ |
| `frontier` | — | — | — | ✓ |

## Strategic Services

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `collapseAgents` | — | — | — | ✓ |
| `sgasSimulation` | — | — | — | ✓ |
| `deepVerticals` | — | — | — | ✓ |
| `nationScale` | — | — | — | ✓ |

## Integration

| Feature | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|---------|--- | --- | --- | --- |
| `customConnectors` | — | ✓ | ✓ | ✓ |
| `apiAccess` | ✓ | ✓ | ✓ | ✓ |
| `webhooks` | ✓ | ✓ | ✓ | ✓ |
| `ssoIntegration` | — | ✓ | ✓ | ✓ |
| `auditLogs` | ✓ | ✓ | ✓ | ✓ |
| `customBranding` | — | — | ✓ | ✓ |
| `whiteLabeling` | — | — | — | ✓ |
| `airGapDeploy` | — | — | ✓ | ✓ |

## Usage Limits

| Limit | **Pilot** | **Foundation** | **Enterprise** | **Strategic** |
|-------|--- | --- | --- | --- |
| `users` | 10 | 50 | 500 | Unlimited |
| `councilDeliberationsPerMonth` | 100 | 1,000 | Unlimited | Unlimited |
| `preMortemAnalysesPerMonth` | 20 | 100 | Unlimited | Unlimited |
| `ghostBoardSessionsPerMonth` | 10 | 50 | Unlimited | Unlimited |
| `regulatoryDocumentsPerMonth` | 5 | 20 | Unlimited | Unlimited |
| `dataSources` | 5 | 25 | Unlimited | Unlimited |
| `storageGB` | 50 | 500 | 5,000 | Unlimited |
| `apiCallsPerMonth` | 50,000 | 500,000 | Unlimited | Unlimited |
| `retentionDays` | 90 | 365 | Unlimited | Unlimited |
| `maxCouncilAgents` | 15 | 15 | Unlimited | Unlimited |
| `departmentCopilots` | 0 | 0 | 19 | Unlimited |
| `jurisdictions` | 3 | 5 | 17 | Unlimited |
| `complianceFrameworks` | 3 | 5 | 10 | Unlimited |

---

*This matrix is the source of truth for pricing pages and marketing materials. If a feature is listed as `—` for a tier, it must not be marketed as available at that tier.*
