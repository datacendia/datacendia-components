# SOP-033: License Tier Management

**Category:** Commercial
**Priority:** Medium
**Owner:** CEO / Sales Lead
**Last Verified:** 2026-02-22 (against `backend/src/config/aiModels.ts`, `COMPLETE_SERVICE_MATRIX.md`)

---

## 1. Purpose

Define procedures for managing license tiers, feature gating, tier upgrades/downgrades, and entitlement enforcement across the Datacendia platform.

---

## 2. License Tier Structure

| Tier | Annual Price | Model Slots | Agents | Key Features |
|------|-------------|-------------|--------|-------------|
| **Pilot** | $50,000 | 2 (Fast + Default) | 14 core | Core platform, 8 pillars, basic DCII |
| **Foundation** | Custom | 3 (+ Large) | 14 + 1 pack | + Decision Intel suite |
| **Enterprise** | Custom | 5 (+ Reasoning + Coder) | All agents | + Enterprise suite, Sovereign |
| **Platinum** | Custom | 8 (all slots) | All + custom | + PersonaForge, full Sovereign, DCII complete |

---

## 3. Feature Gating Architecture

### 3.1 Backend Implementation
License tier gating is implemented in `backend/src/config/aiModels.ts`:

```typescript
// aiModelSelector resolves the correct model based on license tier
const model = aiModelSelector.getModel(agentCode, licenseTier);
```

### 3.2 Gating Layers
| Layer | What It Controls | Implementation |
|-------|-----------------|----------------|
| **Model access** | Which AI models are available | `aiModels.ts` LICENSE_TIERS |
| **Agent access** | Which agents can be used | Agent config per tier |
| **Feature flags** | Which services are enabled | Environment variables |
| **UI visibility** | Which menu items appear | Frontend conditional rendering |
| **API enforcement** | Which endpoints return data | Backend middleware |

### 3.3 Automatic Downgrade Behavior
When a feature is requested that exceeds the tier:
- **Models:** Silently downgraded to best available in tier
- **Agents:** Premium agents return "upgrade required" message
- **Services:** API returns 403 with upgrade prompt
- **UI:** Feature shows lock icon with tier requirement

---

## 4. Tier Assignment Procedure

### 4.1 Set Organization Tier
```bash
curl -X PUT http://localhost:3001/api/v1/admin/organizations/<org_id>/tier \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{
    "tier": "enterprise",
    "addOns": ["collapse", "ghost-board", "healthcare-pack"],
    "expiryDate": "2027-02-22"
  }'
```

### 4.2 Verify Tier Entitlements
```bash
curl http://localhost:3001/api/v1/admin/organizations/<org_id>/entitlements \
  -H "Authorization: Bearer <admin_token>"
```

Returns available models, agents, services, and feature flags for the tier.

---

## 5. Pricing & Packages

### 5.1 Bundle Discounts
| Bundle | Individual Value | Bundle Price | Savings |
|--------|------------------|--------------|---------|
| Starter | $248/mo | $199/mo | 20% |
| Creator | $378/mo | $299/mo | 21% |
| Professional | $1,196/mo | $699/mo | 42% |
| Industry Expert | $1,197/mo | $899/mo | 25% |
| Enterprise Complete | $5,188/mo | $2,499/mo | 52% |

### 5.2 Add-On Services
Individual services can be added to any tier at listed prices:
- Decision Intelligence: $79–$299/mo each
- Enterprise Suite: $149–$499/mo each
- Premium Agent Packs: $299–$399/mo each
- Industry Packages: $999–$1,499/mo each

---

## 6. Tier Upgrade Procedure

1. Client requests upgrade (via sales or self-service)
2. Verify payment/contract update
3. Update organization tier in database
4. Enable new feature flags
5. Restart backend to reload configuration (or hot-reload if supported)
6. Verify new features are accessible
7. Notify client of activation
8. Log tier change in CendiaLedger™

---

## 7. Tier Downgrade Procedure

1. Client requests downgrade or contract expires
2. Notify client of features that will be lost (30-day notice)
3. Export any data from features being removed
4. Update organization tier
5. Disable feature flags
6. Verify restricted features return "upgrade required"
7. Log tier change in CendiaLedger™

---

## 8. Trial / Evaluation Management

| Trial Type | Duration | Features | Conversion Goal |
|-----------|----------|----------|----------------|
| Demo access | 1 session | All (read-only) | Pilot purchase |
| Pilot | 90 days | Per agreement | Foundation/Enterprise |
| Free evaluation | 14 days | Core only | Pilot purchase |

---

## 9. Verified Against

- `backend/src/config/aiModels.ts`: `LICENSE_TIERS`, `aiModelSelector`, tier-to-model mapping
- `COMPLETE_SERVICE_MATRIX.md`: Full pricing, bundle discounts, tier structure
- `docs/INVESTOR_OVERVIEW.md`: $50K pilot pricing
- `src/data/premiumFeatures.ts`: Feature gating data
- `src/pages/pricing/PricingPage.tsx`: Public pricing display

---

*Datacendia, LLC — Proprietary and Confidential*
