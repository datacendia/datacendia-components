// @ts-nocheck
// =============================================================================
// DATACENDIA - APPLICATION ROUTES
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { CortexLayout } from './layouts/CortexLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { SettingsLayout } from './pages/settings';
import { AdminLayout } from './pages/admin';

// Public Pages
import { HomePage, DemoRequestPage, ProductPage, AboutPage, ContactPage, ManifestoPage, DownloadsPage, LicensePage } from './pages/public';

// Marketing Landing Page
import { LandingPage } from './pages/marketing';

// Error Pages
import { NotFoundPage } from './pages/NotFoundPage';

// New Regional Pricing Page (replaces old pricing)
import { PricingPage } from './pages/pricing';
import { ShowcasesPage } from './pages/public/ShowcasesPage';
import { ServicesPage, PackagesPage } from './pages/public/services-packages';
import { PrivacyPolicyPage, TermsPage } from './pages/legal';

// Auth Pages
import { LoginPage, RegisterPage, ForgotPasswordPage, ResetPasswordPage, VerifyEmailPage } from './pages/auth';

// Settings Pages
import { OrganizationSettingsPage, UsersSettingsPage, TeamsSettingsPage, RolesSettingsPage, BillingSettingsPage, ApiKeysSettingsPage, IntegrationSettingsPage, PreferencesSettingsPage, SecuritySettingsPage as SettingsSecurityPage } from './pages/settings';

// Admin Pages
import { AdminDashboardPage, TenantsPage, LicensesPage, UsageAnalyticsPage, SystemHealthPage, FeatureFlagsPage, DataSourcesPage as AdminDataSourcesPage } from './pages/admin';
import ModeAnalytics from './pages/admin/ModeAnalytics';
import { RDLabPage } from './pages/admin/RDLabPage';
import CorePage from './pages/admin/CorePage';
import { ControlCenterPage } from './pages/admin/ControlCenterPage';
import { AdminAIPage } from './pages/admin/AdminAIPage';

// Tools Pages
import { ROICalculator } from './pages/tools';

// Cortex Main Pages
import { DashboardPage } from './pages/cortex/DashboardPage';
import { GraphExplorerPage } from './pages/cortex/graph/GraphExplorerPage';
import { CouncilPage } from './pages/cortex/council/CouncilPage';
import { PulsePage } from './pages/cortex/pulse/PulsePage';
import { LensPage } from './pages/cortex/lens/LensPage';
import { BridgePage } from './pages/cortex/bridge/BridgePage';

// Cortex Sub-Pages
import { LineageViewPage, EntityDetailsPage } from './pages/cortex/graph/subpages';
import { DeliberationViewPage, AgentProfilePage } from './pages/cortex/council/subpages';
import { AlertsPage, MetricsPage } from './pages/cortex/pulse/subpages';
import { ForecastDetailsPage, ScenarioDetailsPage, ScenarioBuilderPage } from './pages/cortex/lens/subpages';
import { WorkflowsListPage, WorkflowBuilderPage, ApprovalsPage, BridgeIntegrationsPage } from './pages/cortex/bridge/subpages';

// Pillar Pages (8 Foundational Layers)
import { HelmPage, LineagePage, PredictPage, FlowPage, HealthPage, GuardPage, EthicsPage, AgentsPage } from './pages/cortex/pillars';

// Decision Intelligence Pages (Premium Features)
import { PreMortemPage, GhostBoardPage, DecisionDebtPage, LiveDemoPage, RegulatoryAbsorbPage, DecisionDNAPage, ChronosPage } from './pages/cortex/intelligence';

// Enterprise Suite Pages (High-Value Features)
import { SovereignPage, PersonaForgePage, MeshPage, GovernPage, VoicePage, AutopilotPage, GenomicsPage, DefenseStackPage, OmniTranslatePage, VetoPage, UnionPage, LedgerPage } from './pages/cortex/enterprise';

// Decision Consequence Engineering
import CascadePage from './pages/cortex/enterprise/CascadePage';

// Sovereign Tier Pages
import { CruciblePage } from './pages/sovereign/CruciblePage';
import { PanopticonPage } from './pages/sovereign/PanopticonPage';
import { AegisPage } from './pages/sovereign/AegisPage';
import { EternalPage } from './pages/sovereign/EternalPage';
import { SymbiontPage } from './pages/sovereign/SymbiontPage';
import { VoxPage } from './pages/sovereign/VoxPage';

// Crown Jewels - Premium Enterprise Services
import { EchoPage, RedTeamPage, GnosisPage } from './pages/cortex/crown';

// Data Pages
import { DataSourcesPage, DataCatalogPage, DataQualityPage, DataImportExportPage } from './pages/cortex/data';

// Onboarding
import { OnboardingWizard } from './pages/onboarding';

// Apex Package Pages
import { ApexLandingPage, CendiaForecastPage, CendiaSentryPage } from './pages/apex';

// Pitch Deck
import { PitchDeck } from './pages/pitch';

// Security Pages
import { SecurityOverviewPage, AccessControlPage, AuditLogPage, SecurityPoliciesPage } from './pages/cortex/security';

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

export const router = createBrowserRouter(stryMutAct_9fa48("65641") ? [] : (stryCov_9fa48("65641"), [// -------------------------------------------------------------------------
// PUBLIC ROUTES
// -------------------------------------------------------------------------
stryMutAct_9fa48("65642") ? {} : (stryCov_9fa48("65642"), {
  path: '/',
  element: <LandingPage />
}), stryMutAct_9fa48("65644") ? {} : (stryCov_9fa48("65644"), {
  path: '/home',
  element: <LandingPage />
}), stryMutAct_9fa48("65646") ? {} : (stryCov_9fa48("65646"), {
  path: '/old-home',
  element: <HomePage />
}), stryMutAct_9fa48("65648") ? {} : (stryCov_9fa48("65648"), {
  path: '/pricing',
  element: <PricingPage />
}), stryMutAct_9fa48("65650") ? {} : (stryCov_9fa48("65650"), {
  path: '/demo',
  element: <DemoRequestPage />
}), stryMutAct_9fa48("65652") ? {} : (stryCov_9fa48("65652"), {
  path: '/product',
  element: <ProductPage />
}), stryMutAct_9fa48("65654") ? {} : (stryCov_9fa48("65654"), {
  path: '/about',
  element: <AboutPage />
}), stryMutAct_9fa48("65656") ? {} : (stryCov_9fa48("65656"), {
  path: '/contact',
  element: <ContactPage />
}), stryMutAct_9fa48("65658") ? {} : (stryCov_9fa48("65658"), {
  path: '/contact-us',
  element: <ContactPage />
}), stryMutAct_9fa48("65660") ? {} : (stryCov_9fa48("65660"), {
  path: '/manifesto',
  element: <ManifestoPage />
}), stryMutAct_9fa48("65662") ? {} : (stryCov_9fa48("65662"), {
  path: '/downloads',
  element: <DownloadsPage />
}), stryMutAct_9fa48("65664") ? {} : (stryCov_9fa48("65664"), {
  path: '/license',
  element: <LicensePage />
}), stryMutAct_9fa48("65666") ? {} : (stryCov_9fa48("65666"), {
  path: '/licenses',
  element: <LicensePage />
}), stryMutAct_9fa48("65668") ? {} : (stryCov_9fa48("65668"), {
  path: '/services',
  element: <ServicesPage />
}), stryMutAct_9fa48("65670") ? {} : (stryCov_9fa48("65670"), {
  path: '/packages',
  element: <PackagesPage />
}), stryMutAct_9fa48("65672") ? {} : (stryCov_9fa48("65672"), {
  path: '/showcases',
  element: <ShowcasesPage />
}), stryMutAct_9fa48("65674") ? {} : (stryCov_9fa48("65674"), {
  path: '/case-studies',
  element: <ShowcasesPage />
}), stryMutAct_9fa48("65676") ? {} : (stryCov_9fa48("65676"), {
  path: '/customers',
  element: <ShowcasesPage />
}), stryMutAct_9fa48("65678") ? {} : (stryCov_9fa48("65678"), {
  path: '/privacy',
  element: <PrivacyPolicyPage />
}), stryMutAct_9fa48("65680") ? {} : (stryCov_9fa48("65680"), {
  path: '/terms',
  element: <TermsPage />
}), stryMutAct_9fa48("65682") ? {} : (stryCov_9fa48("65682"), {
  path: '/terms-of-service',
  element: <TermsPage />
}), // -------------------------------------------------------------------------
// AUTH ROUTES
// -------------------------------------------------------------------------
stryMutAct_9fa48("65684") ? {} : (stryCov_9fa48("65684"), {
  path: '/login',
  element: <LoginPage />
}), stryMutAct_9fa48("65686") ? {} : (stryCov_9fa48("65686"), {
  path: '/register',
  element: <RegisterPage />
}), stryMutAct_9fa48("65688") ? {} : (stryCov_9fa48("65688"), {
  path: '/forgot-password',
  element: <ForgotPasswordPage />
}), stryMutAct_9fa48("65690") ? {} : (stryCov_9fa48("65690"), {
  path: '/reset-password',
  element: <ResetPasswordPage />
}), stryMutAct_9fa48("65692") ? {} : (stryCov_9fa48("65692"), {
  path: '/verify-email',
  element: <VerifyEmailPage />
}), // Auth routes with /auth prefix
stryMutAct_9fa48("65694") ? {} : (stryCov_9fa48("65694"), {
  path: '/auth/login',
  element: <LoginPage />
}), stryMutAct_9fa48("65696") ? {} : (stryCov_9fa48("65696"), {
  path: '/auth/register',
  element: <RegisterPage />
}), stryMutAct_9fa48("65698") ? {} : (stryCov_9fa48("65698"), {
  path: '/auth/forgot-password',
  element: <ForgotPasswordPage />
}), stryMutAct_9fa48("65700") ? {} : (stryCov_9fa48("65700"), {
  path: '/auth/reset-password',
  element: <ResetPasswordPage />
}), stryMutAct_9fa48("65702") ? {} : (stryCov_9fa48("65702"), {
  path: '/auth/verify-email',
  element: <VerifyEmailPage />
}), // -------------------------------------------------------------------------
// ONBOARDING
// -------------------------------------------------------------------------
stryMutAct_9fa48("65704") ? {} : (stryCov_9fa48("65704"), {
  path: '/onboarding',
  element: <OnboardingWizard />
}), stryMutAct_9fa48("65706") ? {} : (stryCov_9fa48("65706"), {
  path: '/welcome',
  element: <OnboardingWizard />
}), stryMutAct_9fa48("65708") ? {} : (stryCov_9fa48("65708"), {
  path: '/get-started',
  element: <OnboardingWizard />
}), // -------------------------------------------------------------------------
// APEX PACKAGE PAGES
// -------------------------------------------------------------------------
stryMutAct_9fa48("65710") ? {} : (stryCov_9fa48("65710"), {
  path: '/apex',
  element: <ApexLandingPage />
}), stryMutAct_9fa48("65712") ? {} : (stryCov_9fa48("65712"), {
  path: '/apex/forecast',
  element: <CendiaForecastPage />
}), stryMutAct_9fa48("65714") ? {} : (stryCov_9fa48("65714"), {
  path: '/apex/sentry',
  element: <CendiaSentryPage />
}), stryMutAct_9fa48("65716") ? {} : (stryCov_9fa48("65716"), {
  path: '/products/cendia-forecast',
  element: <CendiaForecastPage />
}), stryMutAct_9fa48("65718") ? {} : (stryCov_9fa48("65718"), {
  path: '/products/cendia-sentry',
  element: <CendiaSentryPage />
}), // -------------------------------------------------------------------------
// PITCH DECK
// -------------------------------------------------------------------------
stryMutAct_9fa48("65720") ? {} : (stryCov_9fa48("65720"), {
  path: '/pitch',
  element: <PitchDeck />
}), stryMutAct_9fa48("65722") ? {} : (stryCov_9fa48("65722"), {
  path: '/investors',
  element: <PitchDeck />
}), stryMutAct_9fa48("65724") ? {} : (stryCov_9fa48("65724"), {
  path: '/deck',
  element: <PitchDeck />
}), // -------------------------------------------------------------------------
// CORTEX APPLICATION ROUTES
// -------------------------------------------------------------------------
stryMutAct_9fa48("65726") ? {} : (stryCov_9fa48("65726"), {
  path: '/cortex',
  element: <CortexLayout />,
  children: stryMutAct_9fa48("65728") ? [] : (stryCov_9fa48("65728"), [// Dashboard
  stryMutAct_9fa48("65729") ? {} : (stryCov_9fa48("65729"), {
    index: stryMutAct_9fa48("65730") ? false : (stryCov_9fa48("65730"), true),
    element: <DashboardPage />
  }), stryMutAct_9fa48("65731") ? {} : (stryCov_9fa48("65731"), {
    path: 'dashboard',
    element: <DashboardPage />
  }), // Graph Explorer
  stryMutAct_9fa48("65733") ? {} : (stryCov_9fa48("65733"), {
    path: 'graph',
    element: <GraphExplorerPage />
  }), stryMutAct_9fa48("65735") ? {} : (stryCov_9fa48("65735"), {
    path: 'graph/lineage/:entityId?',
    element: <LineageViewPage />
  }), stryMutAct_9fa48("65737") ? {} : (stryCov_9fa48("65737"), {
    path: 'graph/entity/:entityId',
    element: <EntityDetailsPage />
  }), // Council
  stryMutAct_9fa48("65739") ? {} : (stryCov_9fa48("65739"), {
    path: 'council',
    element: <CouncilPage />
  }), stryMutAct_9fa48("65741") ? {} : (stryCov_9fa48("65741"), {
    path: 'council/deliberation/:deliberationId',
    element: <DeliberationViewPage />
  }), stryMutAct_9fa48("65743") ? {} : (stryCov_9fa48("65743"), {
    path: 'council/agent/:agentId',
    element: <AgentProfilePage />
  }), // Pulse
  stryMutAct_9fa48("65745") ? {} : (stryCov_9fa48("65745"), {
    path: 'pulse',
    element: <PulsePage />
  }), stryMutAct_9fa48("65747") ? {} : (stryCov_9fa48("65747"), {
    path: 'pulse/alerts',
    element: <AlertsPage />
  }), stryMutAct_9fa48("65749") ? {} : (stryCov_9fa48("65749"), {
    path: 'pulse/metrics',
    element: <MetricsPage />
  }), // Lens
  stryMutAct_9fa48("65751") ? {} : (stryCov_9fa48("65751"), {
    path: 'lens',
    element: <LensPage />
  }), stryMutAct_9fa48("65753") ? {} : (stryCov_9fa48("65753"), {
    path: 'lens/forecast/:forecastId',
    element: <ForecastDetailsPage />
  }), stryMutAct_9fa48("65755") ? {} : (stryCov_9fa48("65755"), {
    path: 'lens/scenarios/:scenarioId',
    element: <ScenarioDetailsPage />
  }), stryMutAct_9fa48("65757") ? {} : (stryCov_9fa48("65757"), {
    path: 'lens/scenarios/:scenarioId/edit',
    element: <ScenarioBuilderPage />
  }), stryMutAct_9fa48("65759") ? {} : (stryCov_9fa48("65759"), {
    path: 'lens/scenarios/new',
    element: <ScenarioBuilderPage />
  }), // Bridge
  stryMutAct_9fa48("65761") ? {} : (stryCov_9fa48("65761"), {
    path: 'bridge',
    element: <BridgePage />
  }), stryMutAct_9fa48("65763") ? {} : (stryCov_9fa48("65763"), {
    path: 'bridge/workflows',
    element: <WorkflowsListPage />
  }), stryMutAct_9fa48("65765") ? {} : (stryCov_9fa48("65765"), {
    path: 'bridge/workflows/:workflowId',
    element: <WorkflowBuilderPage />
  }), stryMutAct_9fa48("65767") ? {} : (stryCov_9fa48("65767"), {
    path: 'bridge/workflows/new',
    element: <WorkflowBuilderPage />
  }), stryMutAct_9fa48("65769") ? {} : (stryCov_9fa48("65769"), {
    path: 'bridge/approvals',
    element: <ApprovalsPage />
  }), stryMutAct_9fa48("65771") ? {} : (stryCov_9fa48("65771"), {
    path: 'bridge/integrations',
    element: <BridgeIntegrationsPage />
  }), // Decision Intelligence (Premium Features)
  stryMutAct_9fa48("65773") ? {} : (stryCov_9fa48("65773"), {
    path: 'intelligence',
    element: <Navigate to="/cortex/intelligence/pre-mortem" replace />
  }), stryMutAct_9fa48("65775") ? {} : (stryCov_9fa48("65775"), {
    path: 'intelligence/pre-mortem',
    element: <PreMortemPage />
  }), stryMutAct_9fa48("65777") ? {} : (stryCov_9fa48("65777"), {
    path: 'intelligence/ghost-board',
    element: <GhostBoardPage />
  }), stryMutAct_9fa48("65779") ? {} : (stryCov_9fa48("65779"), {
    path: 'intelligence/decision-debt',
    element: <DecisionDebtPage />
  }), stryMutAct_9fa48("65781") ? {} : (stryCov_9fa48("65781"), {
    path: 'intelligence/live-demo',
    element: <LiveDemoPage />
  }), stryMutAct_9fa48("65783") ? {} : (stryCov_9fa48("65783"), {
    path: 'intelligence/regulatory',
    element: <RegulatoryAbsorbPage />
  }), stryMutAct_9fa48("65785") ? {} : (stryCov_9fa48("65785"), {
    path: 'intelligence/decision-dna',
    element: <DecisionDNAPage />
  }), stryMutAct_9fa48("65787") ? {} : (stryCov_9fa48("65787"), {
    path: 'intelligence/chronos',
    element: <ChronosPage />
  }), // Enterprise Suite (High-Value Features)
  stryMutAct_9fa48("65789") ? {} : (stryCov_9fa48("65789"), {
    path: 'enterprise/sovereign',
    element: <SovereignPage />
  }), stryMutAct_9fa48("65791") ? {} : (stryCov_9fa48("65791"), {
    path: 'enterprise/persona-forge',
    element: <PersonaForgePage />
  }), stryMutAct_9fa48("65793") ? {} : (stryCov_9fa48("65793"), {
    path: 'enterprise/mesh',
    element: <MeshPage />
  }), stryMutAct_9fa48("65795") ? {} : (stryCov_9fa48("65795"), {
    path: 'enterprise/govern',
    element: <GovernPage />
  }), stryMutAct_9fa48("65797") ? {} : (stryCov_9fa48("65797"), {
    path: 'enterprise/voice',
    element: <VoicePage />
  }), stryMutAct_9fa48("65799") ? {} : (stryCov_9fa48("65799"), {
    path: 'enterprise/autopilot',
    element: <AutopilotPage />
  }), stryMutAct_9fa48("65801") ? {} : (stryCov_9fa48("65801"), {
    path: 'enterprise/genomics',
    element: <GenomicsPage />
  }), stryMutAct_9fa48("65803") ? {} : (stryCov_9fa48("65803"), {
    path: 'enterprise/defense-stack',
    element: <DefenseStackPage />
  }), stryMutAct_9fa48("65805") ? {} : (stryCov_9fa48("65805"), {
    path: 'enterprise/omni-translate',
    element: <OmniTranslatePage />
  }), stryMutAct_9fa48("65807") ? {} : (stryCov_9fa48("65807"), {
    path: 'enterprise/veto',
    element: <VetoPage />
  }), stryMutAct_9fa48("65809") ? {} : (stryCov_9fa48("65809"), {
    path: 'enterprise/union',
    element: <UnionPage />
  }), stryMutAct_9fa48("65811") ? {} : (stryCov_9fa48("65811"), {
    path: 'enterprise/ledger',
    element: <LedgerPage />
  }), // Decision Consequence Engineering
  stryMutAct_9fa48("65813") ? {} : (stryCov_9fa48("65813"), {
    path: 'enterprise/cascade',
    element: <CascadePage />
  }), // Sovereign Tier (Premium Enterprise)
  stryMutAct_9fa48("65815") ? {} : (stryCov_9fa48("65815"), {
    path: 'sovereign/crucible',
    element: <CruciblePage />
  }), stryMutAct_9fa48("65817") ? {} : (stryCov_9fa48("65817"), {
    path: 'sovereign/panopticon',
    element: <PanopticonPage />
  }), stryMutAct_9fa48("65819") ? {} : (stryCov_9fa48("65819"), {
    path: 'sovereign/aegis',
    element: <AegisPage />
  }), stryMutAct_9fa48("65821") ? {} : (stryCov_9fa48("65821"), {
    path: 'sovereign/eternal',
    element: <EternalPage />
  }), stryMutAct_9fa48("65823") ? {} : (stryCov_9fa48("65823"), {
    path: 'sovereign/symbiont',
    element: <SymbiontPage />
  }), stryMutAct_9fa48("65825") ? {} : (stryCov_9fa48("65825"), {
    path: 'sovereign/vox',
    element: <VoxPage />
  }), // Crown Jewels - Premium Enterprise Services ($5M-$150M tier)
  stryMutAct_9fa48("65827") ? {} : (stryCov_9fa48("65827"), {
    path: 'crown/echo',
    element: <EchoPage />
  }), stryMutAct_9fa48("65829") ? {} : (stryCov_9fa48("65829"), {
    path: 'crown/redteam',
    element: <RedTeamPage />
  }), stryMutAct_9fa48("65831") ? {} : (stryCov_9fa48("65831"), {
    path: 'crown/gnosis',
    element: <GnosisPage />
  }), // 8 Pillars (Foundational Data Layers)
  stryMutAct_9fa48("65833") ? {} : (stryCov_9fa48("65833"), {
    path: 'pillars',
    element: <Navigate to="/cortex/pillars/helm" replace />
  }), stryMutAct_9fa48("65835") ? {} : (stryCov_9fa48("65835"), {
    path: 'pillars/helm',
    element: <HelmPage />
  }), stryMutAct_9fa48("65837") ? {} : (stryCov_9fa48("65837"), {
    path: 'pillars/lineage',
    element: <LineagePage />
  }), stryMutAct_9fa48("65839") ? {} : (stryCov_9fa48("65839"), {
    path: 'pillars/predict',
    element: <PredictPage />
  }), stryMutAct_9fa48("65841") ? {} : (stryCov_9fa48("65841"), {
    path: 'pillars/flow',
    element: <FlowPage />
  }), stryMutAct_9fa48("65843") ? {} : (stryCov_9fa48("65843"), {
    path: 'pillars/health',
    element: <HealthPage />
  }), stryMutAct_9fa48("65845") ? {} : (stryCov_9fa48("65845"), {
    path: 'pillars/guard',
    element: <GuardPage />
  }), stryMutAct_9fa48("65847") ? {} : (stryCov_9fa48("65847"), {
    path: 'pillars/ethics',
    element: <EthicsPage />
  }), stryMutAct_9fa48("65849") ? {} : (stryCov_9fa48("65849"), {
    path: 'pillars/agents',
    element: <AgentsPage />
  }), // Data Management
  stryMutAct_9fa48("65851") ? {} : (stryCov_9fa48("65851"), {
    path: 'data',
    element: <Navigate to="/cortex/data/sources" replace />
  }), stryMutAct_9fa48("65853") ? {} : (stryCov_9fa48("65853"), {
    path: 'data/sources',
    element: <DataSourcesPage />
  }), stryMutAct_9fa48("65855") ? {} : (stryCov_9fa48("65855"), {
    path: 'data/catalog',
    element: <DataCatalogPage />
  }), stryMutAct_9fa48("65857") ? {} : (stryCov_9fa48("65857"), {
    path: 'data/quality',
    element: <DataQualityPage />
  }), stryMutAct_9fa48("65859") ? {} : (stryCov_9fa48("65859"), {
    path: 'data/import-export',
    element: <DataImportExportPage />
  }), // Security
  stryMutAct_9fa48("65861") ? {} : (stryCov_9fa48("65861"), {
    path: 'security',
    element: <SecurityOverviewPage />
  }), stryMutAct_9fa48("65863") ? {} : (stryCov_9fa48("65863"), {
    path: 'security/access',
    element: <AccessControlPage />
  }), stryMutAct_9fa48("65865") ? {} : (stryCov_9fa48("65865"), {
    path: 'security/audit',
    element: <AuditLogPage />
  }), stryMutAct_9fa48("65867") ? {} : (stryCov_9fa48("65867"), {
    path: 'security/policies',
    element: <SecurityPoliciesPage />
  }), // Settings (nested under Cortex)
  stryMutAct_9fa48("65869") ? {} : (stryCov_9fa48("65869"), {
    path: 'settings',
    element: <SettingsLayout />,
    children: stryMutAct_9fa48("65871") ? [] : (stryCov_9fa48("65871"), [stryMutAct_9fa48("65872") ? {} : (stryCov_9fa48("65872"), {
      index: stryMutAct_9fa48("65873") ? false : (stryCov_9fa48("65873"), true),
      element: <Navigate to="/cortex/settings/organization" replace />
    }), stryMutAct_9fa48("65874") ? {} : (stryCov_9fa48("65874"), {
      path: 'organization',
      element: <OrganizationSettingsPage />
    }), stryMutAct_9fa48("65876") ? {} : (stryCov_9fa48("65876"), {
      path: 'users',
      element: <UsersSettingsPage />
    }), stryMutAct_9fa48("65878") ? {} : (stryCov_9fa48("65878"), {
      path: 'teams',
      element: <TeamsSettingsPage />
    }), stryMutAct_9fa48("65880") ? {} : (stryCov_9fa48("65880"), {
      path: 'roles',
      element: <RolesSettingsPage />
    }), stryMutAct_9fa48("65882") ? {} : (stryCov_9fa48("65882"), {
      path: 'billing',
      element: <BillingSettingsPage />
    }), stryMutAct_9fa48("65884") ? {} : (stryCov_9fa48("65884"), {
      path: 'api-keys',
      element: <ApiKeysSettingsPage />
    }), stryMutAct_9fa48("65886") ? {} : (stryCov_9fa48("65886"), {
      path: 'integrations',
      element: <IntegrationSettingsPage />
    }), stryMutAct_9fa48("65888") ? {} : (stryCov_9fa48("65888"), {
      path: 'preferences',
      element: <PreferencesSettingsPage />
    }), stryMutAct_9fa48("65890") ? {} : (stryCov_9fa48("65890"), {
      path: 'security',
      element: <SettingsSecurityPage />
    })])
  })])
}), // -------------------------------------------------------------------------
// ADMIN CONSOLE ROUTES
// -------------------------------------------------------------------------
stryMutAct_9fa48("65892") ? {} : (stryCov_9fa48("65892"), {
  path: '/admin',
  element: <AdminLayout />,
  children: stryMutAct_9fa48("65894") ? [] : (stryCov_9fa48("65894"), [stryMutAct_9fa48("65895") ? {} : (stryCov_9fa48("65895"), {
    index: stryMutAct_9fa48("65896") ? false : (stryCov_9fa48("65896"), true),
    element: <AdminDashboardPage />
  }), stryMutAct_9fa48("65897") ? {} : (stryCov_9fa48("65897"), {
    path: 'dashboard',
    element: <AdminDashboardPage />
  }), stryMutAct_9fa48("65899") ? {} : (stryCov_9fa48("65899"), {
    path: 'tenants',
    element: <TenantsPage />
  }), stryMutAct_9fa48("65901") ? {} : (stryCov_9fa48("65901"), {
    path: 'licenses',
    element: <LicensesPage />
  }), stryMutAct_9fa48("65903") ? {} : (stryCov_9fa48("65903"), {
    path: 'usage',
    element: <UsageAnalyticsPage />
  }), stryMutAct_9fa48("65905") ? {} : (stryCov_9fa48("65905"), {
    path: 'health',
    element: <SystemHealthPage />
  }), stryMutAct_9fa48("65907") ? {} : (stryCov_9fa48("65907"), {
    path: 'features',
    element: <FeatureFlagsPage />
  }), stryMutAct_9fa48("65909") ? {} : (stryCov_9fa48("65909"), {
    path: 'data-sources',
    element: <AdminDataSourcesPage />
  }), stryMutAct_9fa48("65911") ? {} : (stryCov_9fa48("65911"), {
    path: 'mode-analytics',
    element: <ModeAnalytics />
  }), stryMutAct_9fa48("65913") ? {} : (stryCov_9fa48("65913"), {
    path: 'rd-lab',
    element: <RDLabPage />
  }), stryMutAct_9fa48("65915") ? {} : (stryCov_9fa48("65915"), {
    path: 'core',
    element: <CorePage />
  }), stryMutAct_9fa48("65917") ? {} : (stryCov_9fa48("65917"), {
    path: 'control-center',
    element: <ControlCenterPage />
  }), stryMutAct_9fa48("65919") ? {} : (stryCov_9fa48("65919"), {
    path: 'ai',
    element: <AdminAIPage />
  })])
}), // -------------------------------------------------------------------------
// TOOLS
// -------------------------------------------------------------------------
stryMutAct_9fa48("65921") ? {} : (stryCov_9fa48("65921"), {
  path: '/tools',
  element: <CortexLayout />,
  children: stryMutAct_9fa48("65923") ? [] : (stryCov_9fa48("65923"), [stryMutAct_9fa48("65924") ? {} : (stryCov_9fa48("65924"), {
    path: 'roi-calculator',
    element: <ROICalculator />
  })])
}), // -------------------------------------------------------------------------
// FALLBACK / 404
// -------------------------------------------------------------------------
stryMutAct_9fa48("65926") ? {} : (stryCov_9fa48("65926"), {
  path: '*',
  element: <NotFoundPage />
})]));

// =============================================================================
// ROUTE HELPERS
// =============================================================================

export const routes = stryMutAct_9fa48("65928") ? {} : (stryCov_9fa48("65928"), {
  // Public
  home: '/',
  pricing: '/pricing',
  demo: '/demo',
  product: '/product',
  about: '/about',
  manifesto: '/manifesto',
  downloads: '/downloads',
  services: '/services',
  packages: '/packages',
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  // Cortex
  cortex: '/cortex',
  dashboard: '/cortex/dashboard',
  // Graph
  graph: '/cortex/graph',
  lineage: stryMutAct_9fa48("65946") ? () => undefined : (stryCov_9fa48("65946"), (entityId?: string) => entityId ? `/cortex/graph/lineage/${entityId}` : '/cortex/graph/lineage'),
  entity: stryMutAct_9fa48("65949") ? () => undefined : (stryCov_9fa48("65949"), (entityId: string) => `/cortex/graph/entity/${entityId}`),
  // Council
  council: '/cortex/council',
  deliberation: stryMutAct_9fa48("65952") ? () => undefined : (stryCov_9fa48("65952"), (id: string) => `/cortex/council/deliberation/${id}`),
  agent: stryMutAct_9fa48("65954") ? () => undefined : (stryCov_9fa48("65954"), (id: string) => `/cortex/council/agent/${id}`),
  // Pulse
  pulse: '/cortex/pulse',
  alerts: '/cortex/pulse/alerts',
  metrics: '/cortex/pulse/metrics',
  // Lens
  lens: '/cortex/lens',
  forecast: stryMutAct_9fa48("65960") ? () => undefined : (stryCov_9fa48("65960"), (id: string) => `/cortex/lens/forecast/${id}`),
  scenario: stryMutAct_9fa48("65962") ? () => undefined : (stryCov_9fa48("65962"), (id: string) => `/cortex/lens/scenarios/${id}`),
  scenarioEdit: stryMutAct_9fa48("65964") ? () => undefined : (stryCov_9fa48("65964"), (id: string) => `/cortex/lens/scenarios/${id}/edit`),
  newScenario: '/cortex/lens/scenarios/new',
  // Bridge
  bridge: '/cortex/bridge',
  workflows: '/cortex/bridge/workflows',
  workflow: stryMutAct_9fa48("65969") ? () => undefined : (stryCov_9fa48("65969"), (id: string) => `/cortex/bridge/workflows/${id}`),
  newWorkflow: '/cortex/bridge/workflows/new',
  approvals: '/cortex/bridge/approvals',
  bridgeIntegrations: '/cortex/bridge/integrations',
  // Data
  data: '/cortex/data',
  dataSources: '/cortex/data/sources',
  dataCatalog: '/cortex/data/catalog',
  dataQuality: '/cortex/data/quality',
  dataImportExport: '/cortex/data/import-export',
  // Security
  security: '/cortex/security',
  accessControl: '/cortex/security/access',
  auditLog: '/cortex/security/audit',
  securityPolicies: '/cortex/security/policies',
  // Settings
  settings: '/cortex/settings',
  settingsOrganization: '/cortex/settings/organization',
  settingsUsers: '/cortex/settings/users',
  settingsTeams: '/cortex/settings/teams',
  settingsRoles: '/cortex/settings/roles',
  settingsBilling: '/cortex/settings/billing',
  settingsApiKeys: '/cortex/settings/api-keys',
  settingsIntegrations: '/cortex/settings/integrations',
  settingsPreferences: '/cortex/settings/preferences',
  settingsSecurity: '/cortex/settings/security',
  // Admin
  admin: '/admin',
  adminDashboard: '/admin/dashboard',
  adminTenants: '/admin/tenants',
  adminLicenses: '/admin/licenses',
  adminUsage: '/admin/usage',
  adminHealth: '/admin/health',
  adminFeatures: '/admin/features',
  adminRDLab: '/admin/rd-lab'
});
export default router;