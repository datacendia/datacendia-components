// @ts-nocheck
// =============================================================================
// DATACENDIA - APPLICATION ROUTES
// =============================================================================

import React from 'react';
import { createBrowserRouter, Navigate } from 'react-router-dom';

// Layouts
import { CortexLayout } from './layouts/CortexLayout';
import { PublicLayout } from './layouts/PublicLayout';
import { SettingsLayout } from './pages/settings';
import { AdminLayout } from './pages/admin';

// Public Pages
import {
  HomePage,
  DemoRequestPage,
  ProductPage,
  AboutPage,
  ContactPage,
  ManifestoPage,
  DownloadsPage,
  LicensePage,
} from './pages/public';

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
import {
  LoginPage,
  RegisterPage,
  ForgotPasswordPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from './pages/auth';

// Settings Pages
import {
  OrganizationSettingsPage,
  UsersSettingsPage,
  TeamsSettingsPage,
  RolesSettingsPage,
  BillingSettingsPage,
  ApiKeysSettingsPage,
  IntegrationSettingsPage,
  PreferencesSettingsPage,
  SecuritySettingsPage as SettingsSecurityPage,
} from './pages/settings';

// Admin Pages
import {
  AdminDashboardPage,
  TenantsPage,
  LicensesPage,
  UsageAnalyticsPage,
  SystemHealthPage,
  FeatureFlagsPage,
  DataSourcesPage as AdminDataSourcesPage,
} from './pages/admin';
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
import {
  HelmPage,
  LineagePage,
  PredictPage,
  FlowPage,
  HealthPage,
  GuardPage,
  EthicsPage,
  AgentsPage,
} from './pages/cortex/pillars';

// Decision Intelligence Pages (Premium Features)
import {
  PreMortemPage,
  GhostBoardPage,
  DecisionDebtPage,
  LiveDemoPage,
  RegulatoryAbsorbPage,
  DecisionDNAPage,
  ChronosPage,
} from './pages/cortex/intelligence';

// Enterprise Suite Pages (High-Value Features)
import {
  SovereignPage,
  PersonaForgePage,
  MeshPage,
  GovernPage,
  VoicePage,
  AutopilotPage,
  GenomicsPage,
  DefenseStackPage,
  OmniTranslatePage,
  VetoPage,
  UnionPage,
  LedgerPage,
} from './pages/cortex/enterprise';

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
import {
  DataSourcesPage,
  DataCatalogPage,
  DataQualityPage,
  DataImportExportPage,
} from './pages/cortex/data';

// Onboarding
import { OnboardingWizard } from './pages/onboarding';

// Apex Package Pages
import { ApexLandingPage, CendiaForecastPage, CendiaSentryPage } from './pages/apex';

// Pitch Deck
import { PitchDeck } from './pages/pitch';

// Security Pages
import {
  SecurityOverviewPage,
  AccessControlPage,
  AuditLogPage,
  SecurityPoliciesPage,
} from './pages/cortex/security';

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

export const router = createBrowserRouter([
  // -------------------------------------------------------------------------
  // PUBLIC ROUTES
  // -------------------------------------------------------------------------
  {
    path: '/',
    element: <LandingPage />,
  },
  {
    path: '/home',
    element: <LandingPage />,
  },
  {
    path: '/old-home',
    element: <HomePage />,
  },
  {
    path: '/pricing',
    element: <PricingPage />,
  },
  {
    path: '/demo',
    element: <DemoRequestPage />,
  },
  {
    path: '/product',
    element: <ProductPage />,
  },
  {
    path: '/about',
    element: <AboutPage />,
  },
  {
    path: '/contact',
    element: <ContactPage />,
  },
  {
    path: '/contact-us',
    element: <ContactPage />,
  },
  {
    path: '/manifesto',
    element: <ManifestoPage />,
  },
  {
    path: '/downloads',
    element: <DownloadsPage />,
  },
  {
    path: '/license',
    element: <LicensePage />,
  },
  {
    path: '/licenses',
    element: <LicensePage />,
  },
  {
    path: '/services',
    element: <ServicesPage />,
  },
  {
    path: '/packages',
    element: <PackagesPage />,
  },
  {
    path: '/showcases',
    element: <ShowcasesPage />,
  },
  {
    path: '/case-studies',
    element: <ShowcasesPage />,
  },
  {
    path: '/customers',
    element: <ShowcasesPage />,
  },
  {
    path: '/privacy',
    element: <PrivacyPolicyPage />,
  },
  {
    path: '/terms',
    element: <TermsPage />,
  },
  {
    path: '/terms-of-service',
    element: <TermsPage />,
  },

  // -------------------------------------------------------------------------
  // AUTH ROUTES
  // -------------------------------------------------------------------------
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/register',
    element: <RegisterPage />,
  },
  {
    path: '/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  // Auth routes with /auth prefix
  {
    path: '/auth/login',
    element: <LoginPage />,
  },
  {
    path: '/auth/register',
    element: <RegisterPage />,
  },
  {
    path: '/auth/forgot-password',
    element: <ForgotPasswordPage />,
  },
  {
    path: '/auth/reset-password',
    element: <ResetPasswordPage />,
  },
  {
    path: '/auth/verify-email',
    element: <VerifyEmailPage />,
  },

  // -------------------------------------------------------------------------
  // ONBOARDING
  // -------------------------------------------------------------------------
  {
    path: '/onboarding',
    element: <OnboardingWizard />,
  },
  {
    path: '/welcome',
    element: <OnboardingWizard />,
  },
  {
    path: '/get-started',
    element: <OnboardingWizard />,
  },

  // -------------------------------------------------------------------------
  // APEX PACKAGE PAGES
  // -------------------------------------------------------------------------
  {
    path: '/apex',
    element: <ApexLandingPage />,
  },
  {
    path: '/apex/forecast',
    element: <CendiaForecastPage />,
  },
  {
    path: '/apex/sentry',
    element: <CendiaSentryPage />,
  },
  {
    path: '/products/cendia-forecast',
    element: <CendiaForecastPage />,
  },
  {
    path: '/products/cendia-sentry',
    element: <CendiaSentryPage />,
  },

  // -------------------------------------------------------------------------
  // PITCH DECK
  // -------------------------------------------------------------------------
  {
    path: '/pitch',
    element: <PitchDeck />,
  },
  {
    path: '/investors',
    element: <PitchDeck />,
  },
  {
    path: '/deck',
    element: <PitchDeck />,
  },

  // -------------------------------------------------------------------------
  // CORTEX APPLICATION ROUTES
  // -------------------------------------------------------------------------
  {
    path: '/cortex',
    element: <CortexLayout />,
    children: [
      // Dashboard
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'dashboard',
        element: <DashboardPage />,
      },

      // Graph Explorer
      {
        path: 'graph',
        element: <GraphExplorerPage />,
      },
      {
        path: 'graph/lineage/:entityId?',
        element: <LineageViewPage />,
      },
      {
        path: 'graph/entity/:entityId',
        element: <EntityDetailsPage />,
      },

      // Council
      {
        path: 'council',
        element: <CouncilPage />,
      },
      {
        path: 'council/deliberation/:deliberationId',
        element: <DeliberationViewPage />,
      },
      {
        path: 'council/agent/:agentId',
        element: <AgentProfilePage />,
      },

      // Pulse
      {
        path: 'pulse',
        element: <PulsePage />,
      },
      {
        path: 'pulse/alerts',
        element: <AlertsPage />,
      },
      {
        path: 'pulse/metrics',
        element: <MetricsPage />,
      },

      // Lens
      {
        path: 'lens',
        element: <LensPage />,
      },
      {
        path: 'lens/forecast/:forecastId',
        element: <ForecastDetailsPage />,
      },
      {
        path: 'lens/scenarios/:scenarioId',
        element: <ScenarioDetailsPage />,
      },
      {
        path: 'lens/scenarios/:scenarioId/edit',
        element: <ScenarioBuilderPage />,
      },
      {
        path: 'lens/scenarios/new',
        element: <ScenarioBuilderPage />,
      },

      // Bridge
      {
        path: 'bridge',
        element: <BridgePage />,
      },
      {
        path: 'bridge/workflows',
        element: <WorkflowsListPage />,
      },
      {
        path: 'bridge/workflows/:workflowId',
        element: <WorkflowBuilderPage />,
      },
      {
        path: 'bridge/workflows/new',
        element: <WorkflowBuilderPage />,
      },
      {
        path: 'bridge/approvals',
        element: <ApprovalsPage />,
      },
      {
        path: 'bridge/integrations',
        element: <BridgeIntegrationsPage />,
      },

      // Decision Intelligence (Premium Features)
      {
        path: 'intelligence',
        element: <Navigate to="/cortex/intelligence/pre-mortem" replace />,
      },
      {
        path: 'intelligence/pre-mortem',
        element: <PreMortemPage />,
      },
      {
        path: 'intelligence/ghost-board',
        element: <GhostBoardPage />,
      },
      {
        path: 'intelligence/decision-debt',
        element: <DecisionDebtPage />,
      },
      {
        path: 'intelligence/live-demo',
        element: <LiveDemoPage />,
      },
      {
        path: 'intelligence/regulatory',
        element: <RegulatoryAbsorbPage />,
      },
      {
        path: 'intelligence/decision-dna',
        element: <DecisionDNAPage />,
      },
      {
        path: 'intelligence/chronos',
        element: <ChronosPage />,
      },

      // Enterprise Suite (High-Value Features)
      {
        path: 'enterprise/sovereign',
        element: <SovereignPage />,
      },
      {
        path: 'enterprise/persona-forge',
        element: <PersonaForgePage />,
      },
      {
        path: 'enterprise/mesh',
        element: <MeshPage />,
      },
      {
        path: 'enterprise/govern',
        element: <GovernPage />,
      },
      {
        path: 'enterprise/voice',
        element: <VoicePage />,
      },
      {
        path: 'enterprise/autopilot',
        element: <AutopilotPage />,
      },
      {
        path: 'enterprise/genomics',
        element: <GenomicsPage />,
      },
      {
        path: 'enterprise/defense-stack',
        element: <DefenseStackPage />,
      },
      {
        path: 'enterprise/omni-translate',
        element: <OmniTranslatePage />,
      },
      {
        path: 'enterprise/veto',
        element: <VetoPage />,
      },
      {
        path: 'enterprise/union',
        element: <UnionPage />,
      },
      {
        path: 'enterprise/ledger',
        element: <LedgerPage />,
      },

      // Decision Consequence Engineering
      {
        path: 'enterprise/cascade',
        element: <CascadePage />,
      },

      // Sovereign Tier (Premium Enterprise)
      {
        path: 'sovereign/crucible',
        element: <CruciblePage />,
      },
      {
        path: 'sovereign/panopticon',
        element: <PanopticonPage />,
      },
      {
        path: 'sovereign/aegis',
        element: <AegisPage />,
      },
      {
        path: 'sovereign/eternal',
        element: <EternalPage />,
      },
      {
        path: 'sovereign/symbiont',
        element: <SymbiontPage />,
      },
      {
        path: 'sovereign/vox',
        element: <VoxPage />,
      },

      // Crown Jewels - Premium Enterprise Services ($5M-$150M tier)
      {
        path: 'crown/echo',
        element: <EchoPage />,
      },
      {
        path: 'crown/redteam',
        element: <RedTeamPage />,
      },
      {
        path: 'crown/gnosis',
        element: <GnosisPage />,
      },

      // 8 Pillars (Foundational Data Layers)
      {
        path: 'pillars',
        element: <Navigate to="/cortex/pillars/helm" replace />,
      },
      {
        path: 'pillars/helm',
        element: <HelmPage />,
      },
      {
        path: 'pillars/lineage',
        element: <LineagePage />,
      },
      {
        path: 'pillars/predict',
        element: <PredictPage />,
      },
      {
        path: 'pillars/flow',
        element: <FlowPage />,
      },
      {
        path: 'pillars/health',
        element: <HealthPage />,
      },
      {
        path: 'pillars/guard',
        element: <GuardPage />,
      },
      {
        path: 'pillars/ethics',
        element: <EthicsPage />,
      },
      {
        path: 'pillars/agents',
        element: <AgentsPage />,
      },

      // Data Management
      {
        path: 'data',
        element: <Navigate to="/cortex/data/sources" replace />,
      },
      {
        path: 'data/sources',
        element: <DataSourcesPage />,
      },
      {
        path: 'data/catalog',
        element: <DataCatalogPage />,
      },
      {
        path: 'data/quality',
        element: <DataQualityPage />,
      },
      {
        path: 'data/import-export',
        element: <DataImportExportPage />,
      },

      // Security
      {
        path: 'security',
        element: <SecurityOverviewPage />,
      },
      {
        path: 'security/access',
        element: <AccessControlPage />,
      },
      {
        path: 'security/audit',
        element: <AuditLogPage />,
      },
      {
        path: 'security/policies',
        element: <SecurityPoliciesPage />,
      },

      // Settings (nested under Cortex)
      {
        path: 'settings',
        element: <SettingsLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/cortex/settings/organization" replace />,
          },
          {
            path: 'organization',
            element: <OrganizationSettingsPage />,
          },
          {
            path: 'users',
            element: <UsersSettingsPage />,
          },
          {
            path: 'teams',
            element: <TeamsSettingsPage />,
          },
          {
            path: 'roles',
            element: <RolesSettingsPage />,
          },
          {
            path: 'billing',
            element: <BillingSettingsPage />,
          },
          {
            path: 'api-keys',
            element: <ApiKeysSettingsPage />,
          },
          {
            path: 'integrations',
            element: <IntegrationSettingsPage />,
          },
          {
            path: 'preferences',
            element: <PreferencesSettingsPage />,
          },
          {
            path: 'security',
            element: <SettingsSecurityPage />,
          },
        ],
      },
    ],
  },

  // -------------------------------------------------------------------------
  // ADMIN CONSOLE ROUTES
  // -------------------------------------------------------------------------
  {
    path: '/admin',
    element: <AdminLayout />,
    children: [
      {
        index: true,
        element: <AdminDashboardPage />,
      },
      {
        path: 'dashboard',
        element: <AdminDashboardPage />,
      },
      {
        path: 'tenants',
        element: <TenantsPage />,
      },
      {
        path: 'licenses',
        element: <LicensesPage />,
      },
      {
        path: 'usage',
        element: <UsageAnalyticsPage />,
      },
      {
        path: 'health',
        element: <SystemHealthPage />,
      },
      {
        path: 'features',
        element: <FeatureFlagsPage />,
      },
      {
        path: 'data-sources',
        element: <AdminDataSourcesPage />,
      },
      {
        path: 'mode-analytics',
        element: <ModeAnalytics />,
      },
      {
        path: 'rd-lab',
        element: <RDLabPage />,
      },
      {
        path: 'core',
        element: <CorePage />,
      },
      {
        path: 'control-center',
        element: <ControlCenterPage />,
      },
      {
        path: 'ai',
        element: <AdminAIPage />,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // TOOLS
  // -------------------------------------------------------------------------
  {
    path: '/tools',
    element: <CortexLayout />,
    children: [
      {
        path: 'roi-calculator',
        element: <ROICalculator />,
      },
    ],
  },

  // -------------------------------------------------------------------------
  // FALLBACK / 404
  // -------------------------------------------------------------------------
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// =============================================================================
// ROUTE HELPERS
// =============================================================================

export const routes = {
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
  lineage: (entityId?: string) => entityId ? `/cortex/graph/lineage/${entityId}` : '/cortex/graph/lineage',
  entity: (entityId: string) => `/cortex/graph/entity/${entityId}`,
  
  // Council
  council: '/cortex/council',
  deliberation: (id: string) => `/cortex/council/deliberation/${id}`,
  agent: (id: string) => `/cortex/council/agent/${id}`,
  
  // Pulse
  pulse: '/cortex/pulse',
  alerts: '/cortex/pulse/alerts',
  metrics: '/cortex/pulse/metrics',
  
  // Lens
  lens: '/cortex/lens',
  forecast: (id: string) => `/cortex/lens/forecast/${id}`,
  scenario: (id: string) => `/cortex/lens/scenarios/${id}`,
  scenarioEdit: (id: string) => `/cortex/lens/scenarios/${id}/edit`,
  newScenario: '/cortex/lens/scenarios/new',
  
  // Bridge
  bridge: '/cortex/bridge',
  workflows: '/cortex/bridge/workflows',
  workflow: (id: string) => `/cortex/bridge/workflows/${id}`,
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
  adminRDLab: '/admin/rd-lab',
};

export default router;
