# SOP-031: Client Onboarding

**Category:** Client Operations
**Priority:** High
**Owner:** Customer Success Lead / CEO
**Last Verified:** 2026-02-22 (against `DEPLOYMENT_GUIDE.md`, `COMPLETE_SERVICE_MATRIX.md`, pricing structure)

---

## 1. Purpose

Define the end-to-end process for onboarding new clients to the Datacendia Cortex platform, from initial agreement through production deployment and ongoing support.

---

## 2. Onboarding Phases

| Phase | Duration | Owner |
|-------|----------|-------|
| 1. Agreement & Licensing | 1–5 days | Sales / CEO |
| 2. Environment Provisioning | 1–2 days | Engineering |
| 3. Data Integration | 3–10 days | Engineering + Client IT |
| 4. Configuration & Customization | 2–5 days | Product + Engineering |
| 5. Training & Handoff | 2–3 days | Customer Success |
| 6. Go-Live & Monitoring | Ongoing | Customer Success + Engineering |

---

## 3. Phase 1: Agreement & Licensing

### 3.1 License Tier Selection
| Tier | Annual Price | Includes |
|------|-------------|----------|
| **Pilot** | $50,000 | Core platform + 14 agents + 2 model slots |
| **Foundation** | Custom | + Large model slot + 1 premium pack |
| **Enterprise** | Custom | + Reasoning + Coder slots + all packs |
| **Platinum** | Custom | All 8 model slots + PersonaForge + Sovereign |

### 3.2 Package Add-Ons
Select from service matrix (see `COMPLETE_SERVICE_MATRIX.md`):
- Decision Intelligence Suite ($79–$299/mo per service)
- Enterprise Suite ($149–$499/mo per service)
- Premium Agent Packs ($299–$399/mo per pack)
- Industry Packages ($999–$1,499/mo)

### 3.3 Deliverables
- [ ] Signed license agreement
- [ ] Selected tier and add-ons documented
- [ ] Payment terms established
- [ ] SLA terms agreed
- [ ] Primary contacts identified (client side)

---

## 4. Phase 2: Environment Provisioning

### 4.1 Determine Deployment Model
| Model | When | Procedure |
|-------|------|-----------|
| **Cloud (Datacendia-hosted)** | Standard clients | Provision cloud instance |
| **On-Premise** | Data sovereignty requirements | Ship deployment bundle (see SOP-021) |
| **Hybrid** | Partial sovereignty | Cloud + on-prem sovereign components |
| **Air-Gapped** | Government/defense | Full sovereign deployment (SOP-021) |

### 4.2 Provision Steps
1. Create client organization in database
2. Generate unique `ORGANIZATION_ID`
3. Configure license tier and feature flags
4. Generate JWT secrets for the environment (see SOP-007)
5. Deploy infrastructure (see SOP-005)
6. Run database migrations and seed
7. Configure authentication (see SOP-006)

### 4.3 Deliverables
- [ ] Environment running and accessible
- [ ] Admin account created
- [ ] Health check passing
- [ ] License tier enforced

---

## 5. Phase 3: Data Integration

### 5.1 Data Source Connection
1. Inventory client's data sources (ERP, CRM, databases, APIs)
2. Configure CendiaMesh™ integrations:
   - Salesforce, SAP, Oracle, Workday connectors (CendiaNexus™)
   - Custom API endpoints
   - Database connections
3. Map data fields to Datacendia schema
4. Run initial data import
5. Verify data quality with CDO agent

### 5.2 AI Model Setup
1. Ensure Ollama models are available (see SOP-004)
2. Configure model assignments per client's tier
3. Test AI Council deliberation with client data
4. Verify response quality

### 5.3 Deliverables
- [ ] Data sources connected and verified
- [ ] Initial data import complete
- [ ] AI models responding correctly
- [ ] Data quality baseline established

---

## 6. Phase 4: Configuration & Customization

### 6.1 Platform Configuration
1. Configure dashboards for client's industry vertical
2. Set up compliance frameworks relevant to client
3. Configure notification preferences
4. Set up RBAC roles and permissions
5. Configure retention policies

### 6.2 AI Customization
1. Create custom personas via PersonaForge™ (if Platinum tier)
2. Tune agent system prompts for client's domain
3. Configure agent model preferences
4. Set up industry-specific agent packs

### 6.3 Compliance Setup
1. Run initial IISS assessment (see SOP-018)
2. Configure CendiaJurisdiction™ for client's operating regions
3. Set up CendiaRegulatoryAbsorb™ for applicable frameworks
4. Baseline compliance score

### 6.4 Deliverables
- [ ] Platform configured for client's industry
- [ ] Custom personas created (if applicable)
- [ ] Compliance frameworks configured
- [ ] Initial IISS score established

---

## 7. Phase 5: Training & Handoff

### 7.1 Training Sessions
| Session | Audience | Duration |
|---------|----------|----------|
| Executive Overview | C-suite | 1 hour |
| Platform Tour | All users | 2 hours |
| AI Council Deep Dive | Analysts | 2 hours |
| Admin Training | IT/Admin staff | 2 hours |
| DCII / Compliance | Compliance team | 2 hours |

### 7.2 Training Materials
- Platform user guide
- SOPs relevant to client's usage
- Video walkthroughs
- API documentation (`docs/API_DOCUMENTATION.md`)

### 7.3 Deliverables
- [ ] All training sessions completed
- [ ] Training materials delivered
- [ ] Support escalation path documented
- [ ] Client team can operate independently

---

## 8. Phase 6: Go-Live & Monitoring

### 8.1 Go-Live Checklist
- [ ] All phases 1–5 complete
- [ ] Production health check passing
- [ ] Monitoring configured (see SOP-037)
- [ ] Backup procedures active (see SOP-035)
- [ ] Support contact established

### 8.2 Post-Launch Support
| Period | Support Level |
|--------|-------------|
| Week 1 | Daily check-in, priority response |
| Weeks 2–4 | Bi-weekly check-in |
| Month 2+ | Monthly review, standard SLA |

### 8.3 Success Metrics (30/60/90 Day)
| Metric | 30 Day | 60 Day | 90 Day |
|--------|--------|--------|--------|
| Platform uptime | > 99% | > 99.5% | > 99.9% |
| Deliberations run | > 5 | > 20 | > 50 |
| Active users | > 3 | > 10 | > 20 |
| IISS score improvement | Baseline | +50 | +100 |

---

## 9. Verified Against

- `DEPLOYMENT_GUIDE.md`: Environment setup for demo, pilot, production
- `COMPLETE_SERVICE_MATRIX.md`: Full service catalog, pricing, tier structure
- `backend/src/config/aiModels.ts`: License tier gating
- `docs/INVESTOR_OVERVIEW.md`: $50K pilot pricing
- SOPs referenced: 004, 005, 006, 007, 018, 021, 035, 037

---

*Datacendia, LLC — Proprietary and Confidential*
