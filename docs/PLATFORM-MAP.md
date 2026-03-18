# Datacendia Components — Platform Map

> **Full Platform (Proprietary)**
> Last updated: March 2026

This document lists every routable page in `datacendia-components`. This is the complete platform containing Foundation, Enterprise, and Strategic tiers — all features are fully accessible.

---

## Public Pages (no auth required)

| Route | Page | Notes |
|-------|------|-------|
| `/` | SovereignLandingPage | Primary marketing homepage |
| `/home` | SovereignLandingPage | Alias |
| `/old-home` | LandingPage | Legacy marketing page |
| `/legacy-home` | HomePage | Legacy light-theme homepage |
| `/pricing` | PricingPage | Tier pricing |
| `/demo` | DemoRequestPage | Demo request form |
| `/product` | ProductPage | Product overview |
| `/about` | AboutPage | Company info |
| `/contact` | ContactPage | Contact form |
| `/manifesto` | ManifestoHomePage | "Why we built this" |
| `/downloads` | DownloadsPage | Desktop/mobile downloads |
| `/license` | LicensePage | Licensing info |
| `/services` | ServicesPage | Professional services |
| `/packages` | PackagesPage | Solution packages |
| `/sovereign` | SovereignEnterpriseIntelligencePage | SEI category page |
| `/honesty` | HonestyMatricesPage | Transparency matrices |
| `/showcases` | ShowcasesPage | Customer showcases |
| `/privacy` | PrivacyPolicyPage | Privacy policy |
| `/terms` | TermsPage | Terms of service |
| `/security` | SecurityPage | Security overview (public) |
| `/cookies` | CookiePolicyPage | Cookie policy |
| `/docs` | DocsPage | Documentation |
| `/blog` | BlogPage | Blog |
| `/changelog` | ChangelogPage | Release notes |
| `/support` | SupportPage | Support portal |
| `/integrations` | IntegrationsPage | Integration catalog |
| `/verify` | VerifyPage | CendiaVerify public portal |
| `/pitch` | PitchDeck | Investor pitch deck |

## Public Demos (no auth)

| Route | Page |
|-------|------|
| `/cortex/trust/regulators-receipt` | RegulatorsReceiptPage |
| `/cortex/workflows/legal` | LegalWorkflowPage |

## Apex Package (public)

| Route | Page |
|-------|------|
| `/apex/forecast` | CendiaForecastPage |
| `/apex/sentry` | CendiaSentryPage |

---

## Auth Pages

| Route | Page |
|-------|------|
| `/login` | LoginPage |
| `/register` | RegisterPage |
| `/forgot-password` | ForgotPasswordPage |
| `/reset-password` | ResetPasswordPage |
| `/verify-email` | VerifyEmailPage |
| `/find-account` | FindAccountPage |
| `/onboarding` | OnboardingWizard |

---

## Cortex Application (`/cortex/...`)

### Dashboard
| Route | Page |
|-------|------|
| `/cortex` | DashboardPage |
| `/cortex/dashboard` | DashboardPage |

### Council (13 pages)
| Route | Page |
|-------|------|
| `/cortex/council` | CouncilPage |
| `/cortex/council/deliberation/:id` | DeliberationViewPage |
| `/cortex/council/agent/:id` | AgentProfilePage |
| `/cortex/decisions` | DecisionsPage |
| `/cortex/council/visualization` | DeliberationVisualizationPage |
| `/cortex/council/replay-theater` | DecisionReplayTheaterPage |
| `/cortex/council/modes` | CouncilModesPage |
| `/cortex/council/post-deliberation/:id?` | PostDeliberationPanel |
| `/cortex/council/intervene/:id?` | UserInterventionPanel |
| `/cortex/council/executive-summary` | ExecutiveSummaryPage |
| `/cortex/council/history` | CouncilHistoryPage |
| `/cortex/council/analytics` | CouncilAnalyticsPage |

### DCII — Decision Crisis Immunization Infrastructure (7 pages)
| Route | Page |
|-------|------|
| `/cortex/dcii/truth` | TruthPage |
| `/cortex/dcii/notary` | NotaryPage |
| `/cortex/dcii/witness` | WitnessPage |
| `/cortex/dcii/timestamp` | TimestampPage |
| `/cortex/dcii/similarity` | SimilarityPage |
| `/cortex/dcii/memory` | MemoryPage |
| `/cortex/dcii/statement-of-facts` | StatementOfFactsPage |

### DECIDE — Intelligence (15 pages, all accessible)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/intelligence/pre-mortem` | PreMortemPage | Foundation |
| `/cortex/intelligence/ghost-board` | GhostBoardPage | Foundation |
| `/cortex/intelligence/decision-debt` | DecisionDebtPage | Foundation |
| `/cortex/intelligence/chronos` | ChronosPage | Foundation |
| `/cortex/intelligence/live-demo` | LiveDemoPage | Foundation |
| `/cortex/intelligence/regulatory` | RegulatoryAbsorbPage | Enterprise |
| `/cortex/intelligence/decision-dna` | DecisionDNAPage | Enterprise |
| `/cortex/intelligence/lens` | CendiaLensPage | Enterprise |
| `/cortex/intelligence/orbit` | OrbitPage | Enterprise |
| `/cortex/intelligence/consensus` | ConsensusBuilderPage | Enterprise |
| `/cortex/intelligence/what-if` | WhatIfScenariosPage | Enterprise |
| `/cortex/intelligence/synthesis` | SynthesisEnginePage | Enterprise |
| `/cortex/intelligence/rdp` | RDPServicePage | Enterprise |
| `/cortex/intelligence/audit-provenance` | AuditProvenancePage | Enterprise |

### CendiaGateway™
| Route | Page |
|-------|------|
| `/cortex/enterprise/gateway` | GatewayDashboardPage |

### Graph (3 pages)
| Route | Page |
|-------|------|
| `/cortex/graph` | GraphExplorerPage |
| `/cortex/graph/lineage/:entityId?` | LineageViewPage |
| `/cortex/graph/entity/:entityId` | EntityDetailsPage |

### Pulse (3 pages)
| Route | Page |
|-------|------|
| `/cortex/pulse` | PulsePage |
| `/cortex/pulse/alerts` | AlertsPage |
| `/cortex/pulse/metrics` | MetricsPage |

### Bridge (4 pages)
| Route | Page |
|-------|------|
| `/cortex/bridge` | BridgePage |
| `/cortex/bridge/workflows` | WorkflowsListPage |
| `/cortex/bridge/workflows/:id` | WorkflowBuilderPage |
| `/cortex/bridge/approvals` | ApprovalsPage |
| `/cortex/bridge/integrations` | IntegrationsPage |

### Pillars (8 pages)
| Route | Page |
|-------|------|
| `/cortex/pillars/helm` | HelmPage (The Helm) |
| `/cortex/pillars/lineage` | LineagePage |
| `/cortex/pillars/predict` | PredictPage |
| `/cortex/pillars/flow` | FlowPage |
| `/cortex/pillars/health` | HealthPage |
| `/cortex/pillars/guard` | GuardPage |
| `/cortex/pillars/ethics` | EthicsPage |
| `/cortex/pillars/agents` | AgentsPage |

### Data (4 pages)
| Route | Page |
|-------|------|
| `/cortex/data/sources` | DataSourcesPage |
| `/cortex/data/catalog` | DataCatalogPage |
| `/cortex/data/quality` | DataQualityPage |
| `/cortex/data/import-export` | DataImportExportPage |

### Compliance (7 pages)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/compliance` | ComplianceDashboard (Five Rings) | Enterprise |
| `/cortex/compliance/readiness` | ComplianceReadinessPage | Foundation |
| `/cortex/compliance/continuous-monitor` | ContinuousComplianceMonitorPage | Enterprise |
| `/cortex/compliance/gap-scanner` | GapScannerPage | Enterprise |
| `/cortex/compliance/cross-jurisdiction` | CrossJurisdictionPage | Enterprise |
| `/cortex/compliance/regulatory-sandbox` | RegulatorySandboxPage | Enterprise |
| `/cortex/compliance/regulators-receipt` | RegulatorsReceiptGeneratorPage | Enterprise |

### Crypto
| Route | Page | Tier |
|-------|------|------|
| `/cortex/crypto/escrow` | EscrowManagementPage | Enterprise |

### Governance (2 pages)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/governance/decision-packets` | DecisionPacketsPage | Enterprise |
| `/cortex/governance/constitutional-court` | ConstitutionalCourtPage | Enterprise |

### Security (5 pages)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/security` | SecurityOverviewPage | Foundation |
| `/cortex/security/access` | AccessControlPage | Foundation |
| `/cortex/security/audit` | AuditLogPage | Foundation |
| `/cortex/security/policies` | SecurityPoliciesPage | Foundation |
| `/cortex/security/zkp` | ZKPPage | Enterprise |

### Crown Jewels (3 pages)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/crown/echo` | EchoPage (CendiaEcho™) | Enterprise |
| `/cortex/crown/redteam` | RedTeamPage (CendiaRedTeam™) | Enterprise |
| `/cortex/crown/gnosis` | GnosisPage (CendiaGnosis™) | Enterprise |

### Enterprise Suite (27 pages)
| Route | Page |
|-------|------|
| `/cortex/enterprise/sovereign` | SovereignPage |
| `/cortex/enterprise/persona-forge` | PersonaForgePage |
| `/cortex/enterprise/mesh` | MeshPage |
| `/cortex/enterprise/govern` | GovernPage |
| `/cortex/enterprise/voice` | VoicePage |
| `/cortex/enterprise/autopilot` | AutopilotPage |
| `/cortex/enterprise/genomics` | GenomicsPage |
| `/cortex/enterprise/defense-stack` | DefenseStackPage |
| `/cortex/enterprise/financial` | FinancialPage |
| `/cortex/enterprise/omni-translate` | OmniTranslatePage |
| `/cortex/enterprise/veto` | VetoPage |
| `/cortex/enterprise/union` | UnionPage |
| `/cortex/enterprise/ledger` | LedgerPage |
| `/cortex/enterprise/evidence-vault` | EvidenceVaultPage |
| `/cortex/enterprise/apotheosis` | ApotheosisPage |
| `/cortex/enterprise/dissent` | DissentPage |
| `/cortex/enterprise/responsibility` | ResponsibilityPage |
| `/cortex/enterprise/roi-metrics` | ROIMetricsPage |
| `/cortex/enterprise/cascade` | CascadePage |
| `/cortex/enterprise/crisis` | CrisisManagementPage |
| `/cortex/enterprise/audit-workflow` | AuditWorkflowPage |
| `/cortex/enterprise/training` | TrainingPage |
| `/cortex/enterprise/adversarial-redteam` | AdversarialRedTeamPage |
| `/cortex/enterprise/command` | CommandPage |
| `/cortex/enterprise/ai-insurance` | AIInsurancePage |
| `/cortex/enterprise/post-quantum-kms` | PostQuantumKMSPage |
| `/cortex/enterprise/carbon-aware` | CarbonAwareSchedulerPage |
| `/cortex/enterprise/dcii` | DCIIDashboardPage |
| `/cortex/enterprise/gateway` | GatewayDashboardPage |

### Sovereign Tier (17 pages)
| Route | Page |
|-------|------|
| `/cortex/sovereign/crucible` | CruciblePage |
| `/cortex/sovereign/panopticon` | PanopticonPage |
| `/cortex/sovereign/aegis` | AegisPage |
| `/cortex/sovereign/eternal` | EternalPage |
| `/cortex/sovereign/shadow-ops` | ShadowOpsPage |
| `/cortex/sovereign/succession` | SuccessionPage |
| `/cortex/sovereign/sanctuary` | SanctuaryPage |
| `/cortex/sovereign/notary` | NotaryPage (CendiaNotary™) |
| `/cortex/sovereign/vault` | VaultPage (CendiaVault™) |
| `/cortex/sovereign/symbiont` | SymbiontPage |
| `/cortex/sovereign/vox` | VoxPage |
| `/cortex/sovereign/horizon` | HorizonPage |
| `/cortex/sovereign/defense` | DefenseVerticalPage |
| `/cortex/sovereign/sgas` | SGASPage |
| `/cortex/sovereign/scge` | SCGEPage |
| `/cortex/sovereign/collapse` | CollapsePage |

### Sports / Governance Verticals (cortex-level)
| Route | Page | Tier |
|-------|------|------|
| `/cortex/verticals/sports` | SportsPage | Strategic |
| `/cortex/verticals/sports/uefa-walkthrough` | UEFAWalkthroughPage | Strategic |
| `/cortex/verticals/sports/fifa-scenarios` | FIFAGovernanceScenariosPage | Strategic |

### Settings (9 pages)
| Route | Page |
|-------|------|
| `/cortex/settings/organization` | Organization |
| `/cortex/settings/users` | Users |
| `/cortex/settings/teams` | Teams |
| `/cortex/settings/roles` | Roles & Permissions |
| `/cortex/settings/billing` | Billing |
| `/cortex/settings/api-keys` | API Keys |
| `/cortex/settings/integrations` | Integrations |
| `/cortex/settings/preferences` | Preferences |
| `/cortex/settings/security` | Security |

### Other Cortex Pages
| Route | Page |
|-------|------|
| `/cortex/walkthroughs` | WalkthroughsPage |
| `/cortex/workflows/builder` | ServiceWorkflowBuilderPage |
| `/cortex/showcase` | ShowcaseDashboard |
| `/cortex/demo` | DemoLauncherPage |
| `/cortex/demo/legal` | LegalDemoShowcasePage |
| `/cortex/admin/vertical-config` | VerticalConfigPage |
| `/cortex/profile` | UserProfilePage |
| `/cortex/help` | GettingStartedPage |

---

## Admin Pages (`/admin/...`)

| Route | Page |
|-------|------|
| `/admin` | AdminDashboardPage |
| `/admin/dashboard` | AdminDashboardPage |
| `/admin/tenants` | TenantsPage |
| `/admin/licenses` | LicensesPage |
| `/admin/usage` | UsageAnalyticsPage |
| `/admin/health` | SystemHealthPage |
| `/admin/features` | FeatureFlagsPage |
| `/admin/data-sources` | DataSourcesPage |
| `/admin/mode-analytics` | ModeAnalytics |
| `/admin/rd-lab` | RDLabPage |
| `/admin/core` | CorePage |
| `/admin/control-center` | ControlCenterPage |
| `/admin/ai` | AdminAIPage |
| `/admin/sovereign-stack` | SovereignStackPage |
| `/admin/marketing` | MarketingCMSPage |
| `/admin/env-config` | EnvironmentConfigPage |
| `/admin/marketing-studio` | MarketingStudioPage |

---

## Tools

| Route | Page |
|-------|------|
| `/tools/roi-calculator` | ROICalculator |

---

## Verticals (26 individual pages — all accessible)

| Route | Page |
|-------|------|
| `/verticals` | VerticalsHubPage |
| `/verticals/healthcare` | HealthcarePage |
| `/verticals/financial-services` | FinancialServicesPage |
| `/verticals/government-legal` | GovernmentLegalPage |
| `/verticals/legal` | LegalPage |
| `/verticals/insurance` | InsurancePage |
| `/verticals/pharmaceutical` | PharmaceuticalPage |
| `/verticals/manufacturing` | ManufacturingPage |
| `/verticals/energy-utilities` | EnergyUtilitiesPage |
| `/verticals/technology` | TechnologyPage |
| `/verticals/retail-hospitality` | RetailHospitalityPage |
| `/verticals/real-estate` | RealEstateConstructionPage |
| `/verticals/transportation` | TransportationLogisticsPage |
| `/verticals/media-entertainment` | MediaEntertainmentPage |
| `/verticals/professional-services` | ProfessionalServicesPage |
| `/verticals/higher-education` | HigherEducationPage |
| `/verticals/sports` | SportsPage |
| `/verticals/telecommunications` | TelecommunicationsPage |
| `/verticals/aerospace` | AerospacePage |
| `/verticals/agriculture` | AgriculturePage |
| `/verticals/automotive` | AutomotivePage |
| `/verticals/construction` | ConstructionPage |
| `/verticals/hospitality` | HospitalityPage |
| `/verticals/nonprofit` | NonProfitPage |
| `/verticals/industrial-services` | IndustrialServicesPage |
| `/verticals/smart-city` | SmartCityPage (CendiaCity™) |
| `/verticals/eu-banking` | EUBankingPage |

---

## Error Pages

| Route | Page |
|-------|------|
| `*` | NotFoundPage (404) |

---

## Components (`src/components/`)

Reusable components, panels, widgets, and views embedded within pages. **91 .tsx files total.** (Same component library as core.)

### Dashboard Widgets (`components/dashboard/widgets/`) — 15 files
- AgricultureDashboard, CivicSimulation, FleetTrackingMap, HospitalFloorMap
- HospitalityDashboard, InsuranceClaimsDashboard, LegalCaseManagement, MarketPulse
- PowerGridVisualization, ProductionLineStatus, PropertyPortfolio, RetailStoreDashboard
- StudentSuccessDashboard, SystemHealthMatrix, TelecomNetworkDashboard

### Dashboard (`components/dashboard/`) — 2 files
- VerticalDashboard, LayoutMapRenderer

### Council (`components/council/`) — 12 files
- AgentCard, AgentDropdown, CouncilModeSelector, CouncilVideoSimulation
- DeliberationView, ExecutiveSummary, LoadOptimizationDashboard
- PostDeliberationPanel, RealTimePolicyEnforcement, RedTeamReportPanel
- SimilarDecisionsPanel, UserInterventionPanel, WorkflowPicker

### Reports (`components/reports/`) — 5 files
- DrillDownReportKit, ExportCompareKit, HeatmapTimelineKit, InteractionKit, TrendSparklineKit

### Showcase — ShowcaseDashboard (routed as `/cortex/showcase`)
### Demo — DemoModeToggle, DemoOverlay, GuidedWalkthrough, RegulatorsReceiptDemo
### Agents — ModelSwitcher, PersonalityTraitsPanel
### AI Assistant — PlatformAssistant
### Compliance — ComplianceEnforcerDemo
### Crypto — CendiaStampSeal, EvidencePackageDownload
### Graph — GraphCanvas
### Workflow — WorkflowBuilder
### Navigation — Breadcrumbs, HealthCheck, NavigationLoader
### UI Primitives — 22 files (badge, button, card, checkbox, dialog, EnterpriseGate, input, label, Modal, NarrativeGuide, PageLoader, progress, RedactedText, select, ServiceInfoDropdown, ServiceTooltip, tabs, textarea, ThemeToggle, Toast, UpgradeNudge)
### Other — AskCouncilButton, CommandPalette, ErrorBoundary, PageGuide, SEO, ProtectedRoute, Logo, CrossModuleActions, DecisionLifecycle, KeyboardShortcuts, StatusPage, TechTeamPanel, LanguageSwitcher, PageHeader, ModeSelector, NotificationBell, OnboardingWizard, PremiumFeaturesModal

---

## Layouts (`src/layouts/`) — 3 files
- CortexLayout, MarketingLayout, PublicLayout

## Contexts (`src/contexts/`) — 8 files
- AuthContext, CouncilQueryContext, DataSourceContext, DemoModeContext
- HealthContext, LanguageContext, ThemeContext, VerticalConfigContext

## Route Configs (`src/routes/`) — 10 files
- routes.lazy.tsx, utils.tsx
- public.routes, auth.routes, admin.routes, verticals.routes
- cortex/core.routes, cortex/intelligence.routes, cortex/enterprise.routes
- cortex/platform.routes, cortex/sovereign.routes

---

## Summary

> **203 .tsx page files** containing **~242 page components** (many `index.tsx` and `subpages.tsx` files export multiple components).

| Category | Pages |
|----------|-------|
| Public / Marketing (sovereign landing, landing, home, pricing, demo, product, about, contact, manifesto, downloads, license, services, packages, sovereign-SEI, honesty, showcases, privacy, terms, security, cookies, docs, blog, changelog, support, integrations, verify, pitch, regulators-receipt demo, legal-workflow demo, apex×2) | 33 |
| Auth (login, register, forgot, reset, verify, find, onboarding) | 7 |
| Cortex — Council (council, deliberation, agent, decisions, visualization, replay, modes, post-delib, intervene, exec-summary, history, analytics) | 12 |
| Cortex — DCII (truth, notary, witness, timestamp, similarity, memory, statement-of-facts) | 7 |
| Cortex — DECIDE Intelligence (pre-mortem, ghost-board, decision-debt, chronos, live-demo, regulatory, decision-dna, lens, orbit, consensus, what-if, synthesis, rdp, audit-provenance) | 14 |
| Cortex — Gateway (gateway-page, gateway-dashboard) | 2 |
| Cortex — Graph (explorer, lineage, entity-details) | 3 |
| Cortex — Pulse (pulse, alerts, metrics) | 3 |
| Cortex — Bridge (bridge, workflows, workflow-builder, approvals, integrations) | 5 |
| Cortex — Pillars (helm, lineage, predict, flow, health, guard, ethics, agents) | 8 |
| Cortex — Data (sources, catalog, quality, import-export) | 4 |
| Cortex — Compliance (dashboard/five-rings, readiness, continuous-monitor, gap-scanner, cross-jurisdiction, regulatory-sandbox, regulators-receipt) | 7 |
| Cortex — Crypto (escrow) | 1 |
| Cortex — Governance (decision-packets, constitutional-court) | 2 |
| Cortex — Security (overview, access, audit, policies, ZKP) | 5 |
| Cortex — Crown Jewels (echo, redteam, gnosis) | 3 |
| Cortex — Enterprise Suite (sovereign, persona-forge, mesh, govern, voice, autopilot, genomics, defense-stack, financial, omni-translate, veto, union, ledger, evidence-vault, apotheosis, dissent, responsibility, roi-metrics, cascade, crisis, audit-workflow, training, adversarial-redteam, command, ai-insurance, post-quantum-kms, carbon-aware, dcii-dashboard, gateway-dashboard) | 29 |
| Cortex — Sovereign (crucible, panopticon, aegis, eternal, shadow-ops, succession, sanctuary, notary, vault, symbiont, vox, horizon, defense, sgas, scge, collapse) | 16 |
| Cortex — Monitor (live-agent-monitor) | 1 |
| Cortex — Walkthroughs, Workflows, Demo, Showcase | 6 |
| Cortex — Settings (org, users, teams, roles, billing, api-keys, integrations, preferences, security + layout) | 10 |
| Cortex — Other (profile, help, vertical-config, mission-control, upgrade) | 5 |
| Cortex — Verticals (sports, fifa-scenarios, uefa-walkthrough) | 3 |
| Admin (dashboard×2, tenants, licenses, usage, health, features, data-sources, mode-analytics, rd-lab, core, control-center, ai, sovereign-stack, marketing, env-config, marketing-studio, schema-mapping) | 18 |
| Services (catalog, request, my-requests, management) | 4 |
| Tools (ROI calculator) | 1 |
| Verticals (hub + 26 individual industry pages) | 27 |
| Legal (privacy, terms) | 2 |
| Pitch | 1 |
| Error (404) | 1 |
| **TOTAL page components** | **~242** |

### Full Source Tree (.tsx files)
| Directory | Files |
|-----------|-------|
| `src/pages/` (203 files → ~242 components) | 203 |
| `src/components/` (UI, panels, widgets, views) | 91 |
| `src/layouts/` | 3 |
| `src/contexts/` | 8 |
| `src/routes/` | 10 |
| `src/` root (App, main, routes.lazy) | 3 |
| **Total .tsx files in src/** | **318** |

### Tier Breakdown
- **Foundation** (shared with core): ~141 pages
- **Enterprise** (paid): ~65 pages
- **Strategic** (premium): ~36 pages
