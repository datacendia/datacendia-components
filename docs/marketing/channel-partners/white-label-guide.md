# DATACENDIA WHITE-LABEL DEPLOYMENT GUIDE
### How Partners Deploy Datacendia Under Their Brand

---

## Overview

White-label partners deploy Datacendia as "[Partner Name] AI Governance" — fully rebranded, partner-supported, with Datacendia as invisible infrastructure. This guide covers branding, deployment, support, and commercial models.

---

## Branding Customization

| Element | Customizable | How |
|---------|-------------|-----|
| Product name | ✅ | Environment variable: `BRAND_NAME` |
| Logo / favicon | ✅ | Replace assets in `/src/assets/brand/` |
| Color scheme | ✅ | Tailwind theme override in `tailwind.config.ts` |
| Domain | ✅ | Partner deploys on their own domain |
| Email sender | ✅ | Partner's email infrastructure |
| Login page | ✅ | Custom component in `/src/pages/auth/` |
| Report headers/footers | ✅ | `PDFGeneratorService` template configuration |
| Evidence packet branding | ✅ | `RegulatorsReceiptService` template |
| "Powered by" attribution | Required | Small footer text: "AI Governance Infrastructure by Datacendia" |

## Deployment Models

### Model A: Partner-Hosted (Recommended)
- Partner deploys on their infrastructure (AWS/Azure/GCP/on-prem)
- Partner manages operations, Tier 1 support
- Datacendia provides Tier 2/3 support, updates, patches
- **Best for:** Big 4, large SIs with existing cloud infrastructure

### Model B: Datacendia-Hosted, Partner-Branded
- Datacendia hosts on dedicated infrastructure per partner
- Partner handles customer relationship and Tier 1
- Datacendia manages infrastructure and all support tiers
- **Best for:** Smaller partners without infrastructure capability

### Model C: Customer-Hosted (Sovereign)
- Partner delivers to customer's own infrastructure
- Air-gapped / on-prem deployment
- Partner provides implementation services
- Datacendia provides deployment package + support
- **Best for:** Defense, government, banking customers requiring sovereignty

## Technical Integration

### Partner Admin Portal
Partners get a dedicated admin portal to:
- Manage customer tenants
- Configure vertical packs per customer
- Monitor usage and compliance metrics
- Access Tier 2 escalation

### API Integration
Partners can integrate Datacendia via API into their existing platforms:
- REST API (159 routes) — full documentation provided
- WebSocket for real-time deliberation streaming
- Webhook notifications for decision events
- SSO integration (OIDC/SAML via Keycloak)

## Commercial Models

| Model | Structure | Example |
|-------|----------|---------|
| **Markup** | Partner buys at discount, sells at list | Buy at $175K, sell at $250K (30% margin) |
| **Revenue share** | Partner sells at list, splits revenue | 70% partner / 30% Datacendia |
| **Bundled** | Datacendia included in partner's service fee | Partner charges $500K for "AI Governance Transformation" including $250K Datacendia license |
| **Per-user/per-decision** | Usage-based pricing through partner platform | $X per governed decision |

## Support Model

| Tier | Responsibility | SLA |
|------|---------------|-----|
| Tier 1 | Partner | 4hr response (business hours) |
| Tier 2 | Datacendia | 8hr response (business hours) |
| Tier 3 | Datacendia Engineering | 24hr response |
| Emergency | Joint | 1hr response (24/7) |

## Getting Started

1. Sign Strategic Partnership Agreement
2. Complete technical certification (2 days)
3. Receive white-label deployment package
4. Configure branding and deploy to staging
5. Complete UAT with partner team
6. Launch first customer pilot

**Contact:** Stuart Rainey — stuart.rainey@datacendia.com
