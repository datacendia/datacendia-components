// =============================================================================
// DATACENDIA - APPLICATION ROUTES WITH LAZY LOADING
// Performance optimized - code splitting for all heavy components
// =============================================================================

import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { PageLoader } from './components/ui/PageLoader';

// Helper for lazy loading with suspense
const lazyLoad = (importFn: () => Promise<{ default: React.ComponentType<any> }>) => {
  const LazyComponent = lazy(importFn);
  return (
    <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>
  );
};

const RedirectToCouncilWithQuery: React.FC = () => {
  const location = useLocation();
  return <Navigate to={`/cortex/council${location.search}`} replace />;
};

// =============================================================================
// LAYOUTS - Load immediately (critical for shell)
// =============================================================================
import { CortexLayout } from './layouts/CortexLayout';
import { PublicLayout } from './layouts/PublicLayout';

// Lazy load layout children
const SettingsLayout = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.SettingsLayout }))
);
const AdminLayout = lazy(() => import('./pages/admin').then((m) => ({ default: m.AdminLayout })));

// =============================================================================
// LAZY LOADED PAGES
// =============================================================================

// Public Pages
const SovereignLandingPage = lazy(() => import('./pages/marketing/SovereignLandingPage'));
const ManifestoHomePage = lazy(() => import('./pages/marketing/ManifestoHomePage'));
const LandingPage = lazy(() =>
  import('./pages/marketing').then((m) => ({ default: m.LandingPage }))
);
const HomePage = lazy(() => import('./pages/public').then((m) => ({ default: m.HomePage })));
const ProductPage = lazy(() => import('./pages/public').then((m) => ({ default: m.ProductPage })));
const AboutPage = lazy(() => import('./pages/public').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('./pages/public').then((m) => ({ default: m.ContactPage })));
const ManifestoPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.ManifestoPage }))
);
const DownloadsPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.DownloadsPage }))
);
const LicensePage = lazy(() => import('./pages/public').then((m) => ({ default: m.LicensePage })));
const SecurityPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.SecurityPage }))
);
const CookiePolicyPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.CookiePolicyPage }))
);
const DocsPage = lazy(() => import('./pages/public').then((m) => ({ default: m.DocsPage })));
const BlogPage = lazy(() => import('./pages/public').then((m) => ({ default: m.BlogPage })));
const ChangelogPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.ChangelogPage }))
);
const SupportPage = lazy(() => import('./pages/public').then((m) => ({ default: m.SupportPage })));
const IntegrationsPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.IntegrationsPage }))
);
const DemoRequestPage = lazy(() =>
  import('./pages/public').then((m) => ({ default: m.DemoRequestPage }))
);
const ShowcasesPage = lazy(() => import('./pages/public/ShowcasesPage'));
const ServicesPage = lazy(() =>
  import('./pages/public/services-packages').then((m) => ({ default: m.ServicesPage }))
);
const PackagesPage = lazy(() =>
  import('./pages/public/services-packages').then((m) => ({ default: m.PackagesPage }))
);
const HonestyMatricesPage = lazy(() => import('./pages/public/HonestyMatricesPage'));
const SovereignEnterpriseIntelligencePage = lazy(
  () => import('./pages/public/SovereignEnterpriseIntelligencePage')
);

// Demos
const RegulatorsReceiptPage = lazy(() => import('./pages/demos/RegulatorsReceiptPage'));
const DemoLauncherPage = lazy(() => import('./pages/cortex/demo/DemoLauncherPage'));

// Legal
const PrivacyPolicyPage = lazy(() =>
  import('./pages/legal').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() => import('./pages/legal').then((m) => ({ default: m.TermsPage })));

// Pricing
const PricingPage = lazy(() => import('./pages/pricing').then((m) => ({ default: m.PricingPage })));

// Auth Pages
const LoginPage = lazy(() =>
  import('./pages/auth/LoginPage').then((m) => ({ default: m.LoginPage }))
);
const RegisterPage = lazy(() =>
  import('./pages/auth/RegisterPage').then((m) => ({ default: m.RegisterPage }))
);
const ForgotPasswordPage = lazy(() =>
  import('./pages/auth/ForgotPasswordPage').then((m) => ({ default: m.ForgotPasswordPage }))
);
const ResetPasswordPage = lazy(() =>
  import('./pages/auth/ResetPasswordPage').then((m) => ({ default: m.ResetPasswordPage }))
);
const VerifyEmailPage = lazy(() =>
  import('./pages/auth/VerifyEmailPage').then((m) => ({ default: m.VerifyEmailPage }))
);

// Cortex Main Pages
const DashboardPage = lazy(() =>
  import('./pages/cortex/DashboardPage').then((m) => ({ default: m.DashboardPage }))
);
const GraphExplorerPage = lazy(() =>
  import('./pages/cortex/graph/GraphExplorerPage').then((m) => ({ default: m.GraphExplorerPage }))
);
const CouncilPage = lazy(() =>
  import('./pages/cortex/council/CouncilPage').then((m) => ({ default: m.CouncilPage }))
);
const PulsePage = lazy(() =>
  import('./pages/cortex/pulse/PulsePage').then((m) => ({ default: m.PulsePage }))
);
const LensPage = lazy(() =>
  import('./pages/cortex/lens/LensPage').then((m) => ({ default: m.LensPage }))
);
const BridgePage = lazy(() =>
  import('./pages/cortex/bridge/BridgePage').then((m) => ({ default: m.BridgePage }))
);

// Cortex Sub-Pages
const LineageViewPage = lazy(() =>
  import('./pages/cortex/graph/subpages').then((m) => ({ default: m.LineageViewPage }))
);
const EntityDetailsPage = lazy(() =>
  import('./pages/cortex/graph/subpages').then((m) => ({ default: m.EntityDetailsPage }))
);
const DeliberationViewPage = lazy(() =>
  import('./pages/cortex/council/subpages').then((m) => ({ default: m.DeliberationViewPage }))
);
const DecisionsPage = lazy(() =>
  import('./pages/cortex/council/DecisionsPage').then((m) => ({ default: m.DecisionsPage }))
);
const AgentProfilePage = lazy(() =>
  import('./pages/cortex/council/subpages').then((m) => ({ default: m.AgentProfilePage }))
);
const AlertsPage = lazy(() =>
  import('./pages/cortex/pulse/subpages').then((m) => ({ default: m.AlertsPage }))
);
const MetricsPage = lazy(() =>
  import('./pages/cortex/pulse/subpages').then((m) => ({ default: m.MetricsPage }))
);
const ForecastDetailsPage = lazy(() =>
  import('./pages/cortex/lens/subpages').then((m) => ({ default: m.ForecastDetailsPage }))
);
const ScenarioDetailsPage = lazy(() =>
  import('./pages/cortex/lens/subpages').then((m) => ({ default: m.ScenarioDetailsPage }))
);
const ScenarioBuilderPage = lazy(() =>
  import('./pages/cortex/lens/subpages').then((m) => ({ default: m.ScenarioBuilderPage }))
);
const WorkflowsListPage = lazy(() =>
  import('./pages/cortex/bridge/subpages').then((m) => ({ default: m.WorkflowsListPage }))
);
const WorkflowBuilderPage = lazy(() =>
  import('./pages/cortex/bridge/subpages').then((m) => ({ default: m.WorkflowBuilderPage }))
);
const ApprovalsPage = lazy(() =>
  import('./pages/cortex/bridge/subpages').then((m) => ({ default: m.ApprovalsPage }))
);
const BridgeIntegrationsPage = lazy(() =>
  import('./pages/cortex/bridge/subpages').then((m) => ({ default: m.BridgeIntegrationsPage }))
);

// Pillar Pages
const HelmPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.HelmPage }))
);
const LineagePage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.LineagePage }))
);
const PredictPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.PredictPage }))
);
const FlowPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.FlowPage }))
);
const HealthPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.HealthPage }))
);
const GuardPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.GuardPage }))
);
const EthicsPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.EthicsPage }))
);
const AgentsPage = lazy(() =>
  import('./pages/cortex/pillars').then((m) => ({ default: m.AgentsPage }))
);

// Decision Intelligence Pages
const PreMortemPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.PreMortemPage }))
);
const GhostBoardPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.GhostBoardPage }))
);
const DecisionDebtPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.DecisionDebtPage }))
);
const LiveDemoPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.LiveDemoPage }))
);
const RegulatoryAbsorbPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.RegulatoryAbsorbPage }))
);
const DecisionDNAPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.DecisionDNAPage }))
);
const ChronosPage = lazy(() =>
  import('./pages/cortex/intelligence').then((m) => ({ default: m.ChronosPage }))
);

// Enterprise Suite Pages
const SovereignPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.SovereignPage }))
);
const PersonaForgePage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.PersonaForgePage }))
);
const MeshPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.MeshPage }))
);
const GovernPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.GovernPage }))
);
const DecisionPacketsPage = lazy(() =>
  import('./pages/cortex/governance/DecisionPacketsPage').then((m) => ({ default: m.DecisionPacketsPage }))
);
const VoicePage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.VoicePage }))
);
const AutopilotPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.AutopilotPage }))
);
const GenomicsPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.GenomicsPage }))
);
const DefenseStackPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.DefenseStackPage }))
);
const OmniTranslatePage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.OmniTranslatePage }))
);
const VetoPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.VetoPage }))
);
const UnionPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.UnionPage }))
);
const LedgerPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.LedgerPage }))
);
const EvidenceVaultPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.EvidenceVaultPage }))
);
const ApotheosisPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.ApotheosisPage }))
);
const DissentPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.DissentPage }))
);
const ROIMetricsPage = lazy(() =>
  import('./pages/cortex/enterprise/ROIMetricsPage').then((m) => ({ default: m.ROIMetricsPage }))
);
const CascadePage = lazy(() =>
  import('./pages/cortex/enterprise/CascadePage').then((m) => ({ default: m.default }))
);
const CrisisManagementPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.CrisisManagementPage }))
);
const AuditWorkflowPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.AuditWorkflowPage }))
);
const TrainingPage = lazy(() =>
  import('./pages/cortex/enterprise').then((m) => ({ default: m.TrainingPage }))
);

// Sovereign Tier Pages
const CruciblePage = lazy(() =>
  import('./pages/sovereign/CruciblePage').then((m) => ({ default: m.CruciblePage }))
);
const PanopticonPage = lazy(() =>
  import('./pages/sovereign/PanopticonPage').then((m) => ({ default: m.PanopticonPage }))
);
const AegisPage = lazy(() =>
  import('./pages/sovereign/AegisPage').then((m) => ({ default: m.AegisPage }))
);
const EternalPage = lazy(() =>
  import('./pages/sovereign/EternalPage').then((m) => ({ default: m.EternalPage }))
);
const SymbiontPage = lazy(() =>
  import('./pages/sovereign/SymbiontPage').then((m) => ({ default: m.SymbiontPage }))
);
const VoxPage = lazy(() =>
  import('./pages/sovereign/VoxPage').then((m) => ({ default: m.VoxPage }))
);
const HorizonPage = lazy(() => import('./pages/sovereign/HorizonPage'));

// Crown Jewels - Premium Enterprise Services
const EchoPage = lazy(() => import('./pages/cortex/crown').then((m) => ({ default: m.EchoPage })));
const RedTeamPage = lazy(() =>
  import('./pages/cortex/crown').then((m) => ({ default: m.RedTeamPage }))
);
const GnosisPage = lazy(() =>
  import('./pages/cortex/crown').then((m) => ({ default: m.GnosisPage }))
);

// Data Pages
const DataSourcesPage = lazy(() =>
  import('./pages/cortex/data').then((m) => ({ default: m.DataSourcesPage }))
);
const DataCatalogPage = lazy(() =>
  import('./pages/cortex/data').then((m) => ({ default: m.DataCatalogPage }))
);
const DataQualityPage = lazy(() =>
  import('./pages/cortex/data').then((m) => ({ default: m.DataQualityPage }))
);
const DataImportExportPage = lazy(() =>
  import('./pages/cortex/data').then((m) => ({ default: m.DataImportExportPage }))
);

// Compliance Pages
const ComplianceDashboard = lazy(() =>
  import('./pages/cortex/compliance/ComplianceDashboard').then((m) => ({ default: m.default }))
);

// Walkthroughs
const WalkthroughsPage = lazy(() => import('./pages/cortex/walkthroughs/WalkthroughsPage'));

// Security Pages
const SecurityOverviewPage = lazy(() =>
  import('./pages/cortex/security').then((m) => ({ default: m.SecurityOverviewPage }))
);
const AccessControlPage = lazy(() =>
  import('./pages/cortex/security').then((m) => ({ default: m.AccessControlPage }))
);
const AuditLogPage = lazy(() =>
  import('./pages/cortex/security').then((m) => ({ default: m.AuditLogPage }))
);
const SecurityPoliciesPage = lazy(() =>
  import('./pages/cortex/security').then((m) => ({ default: m.SecurityPoliciesPage }))
);

// Settings Pages
const OrganizationSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.OrganizationSettingsPage }))
);
const UsersSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.UsersSettingsPage }))
);
const TeamsSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.TeamsSettingsPage }))
);
const RolesSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.RolesSettingsPage }))
);
const BillingSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.BillingSettingsPage }))
);
const ApiKeysSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.ApiKeysSettingsPage }))
);
const IntegrationSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.IntegrationSettingsPage }))
);
const PreferencesSettingsPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.PreferencesSettingsPage }))
);
const SettingsSecurityPage = lazy(() =>
  import('./pages/settings').then((m) => ({ default: m.SecuritySettingsPage }))
);

// Admin Pages
const AdminDashboardPage = lazy(() =>
  import('./pages/admin').then((m) => ({ default: m.AdminDashboardPage }))
);
const TenantsPage = lazy(() => import('./pages/admin').then((m) => ({ default: m.TenantsPage })));
const LicensesPage = lazy(() => import('./pages/admin').then((m) => ({ default: m.LicensesPage })));
const UsageAnalyticsPage = lazy(() =>
  import('./pages/admin').then((m) => ({ default: m.UsageAnalyticsPage }))
);
const SystemHealthPage = lazy(() =>
  import('./pages/admin').then((m) => ({ default: m.SystemHealthPage }))
);
const FeatureFlagsPage = lazy(() =>
  import('./pages/admin').then((m) => ({ default: m.FeatureFlagsPage }))
);
const AdminDataSourcesPage = lazy(() =>
  import('./pages/admin').then((m) => ({ default: m.DataSourcesPage }))
);
const ModeAnalytics = lazy(() => import('./pages/admin/ModeAnalytics'));
const RDLabPage = lazy(() =>
  import('./pages/admin/RDLabPage').then((m) => ({ default: m.RDLabPage }))
);
const CorePage = lazy(() => import('./pages/admin/CorePage'));
const ControlCenterPage = lazy(() =>
  import('./pages/admin/ControlCenterPage').then((m) => ({ default: m.ControlCenterPage }))
);
const AdminAIPage = lazy(() =>
  import('./pages/admin/AdminAIPage').then((m) => ({ default: m.AdminAIPage }))
);
const SovereignStackPage = lazy(() => import('./pages/admin/SovereignStackPage'));
const VerticalConfigPage = lazy(() =>
  import('./pages/cortex/admin').then((m) => ({ default: m.VerticalConfigPage }))
);

// Tools
const ROICalculator = lazy(() =>
  import('./pages/tools').then((m) => ({ default: m.ROICalculator }))
);

// Onboarding
const OnboardingWizard = lazy(() =>
  import('./pages/onboarding').then((m) => ({ default: m.OnboardingWizard }))
);

// Verticals
const VerticalsHubPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.VerticalsHubPage }))
);
const HealthcarePage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.HealthcarePage }))
);
const FinancialServicesPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.FinancialServicesPage }))
);
const GovernmentLegalPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.GovernmentLegalPage }))
);
const InsurancePage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.InsurancePage }))
);
const PharmaceuticalPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.PharmaceuticalPage }))
);
const ManufacturingPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.ManufacturingPage }))
);
const EnergyUtilitiesPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.EnergyUtilitiesPage }))
);
const TechnologyVerticalPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.TechnologyPage }))
);
const RetailHospitalityPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.RetailHospitalityPage }))
);
const RealEstateConstructionPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.RealEstateConstructionPage }))
);
const TransportationLogisticsPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.TransportationLogisticsPage }))
);
const MediaEntertainmentPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.MediaEntertainmentPage }))
);
const ProfessionalServicesPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.ProfessionalServicesPage }))
);
const HigherEducationPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.HigherEducationPage }))
);
const SportsPage = lazy(() => import('./pages/verticals').then((m) => ({ default: m.SportsPage })));
const TelecommunicationsPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.TelecommunicationsPage }))
);
const AerospacePage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.AerospacePage }))
);
const AgriculturePage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.AgriculturePage }))
);
const AutomotivePage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.AutomotivePage }))
);
const ConstructionPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.ConstructionPage }))
);
const HospitalityPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.HospitalityPage }))
);
const NonProfitPage = lazy(() =>
  import('./pages/verticals').then((m) => ({ default: m.NonProfitPage }))
);

// Apex Package
const CendiaForecastPage = lazy(() =>
  import('./pages/apex').then((m) => ({ default: m.CendiaForecastPage }))
);
const CendiaSentryPage = lazy(() =>
  import('./pages/apex').then((m) => ({ default: m.CendiaSentryPage }))
);

// Pitch
const PitchDeck = lazy(() => import('./pages/pitch').then((m) => ({ default: m.PitchDeck })));

// Error Pages (keep non-lazy for fast 404)
import { NotFoundPage } from './pages/NotFoundPage';

// =============================================================================
// SUSPENSE WRAPPER COMPONENT
// =============================================================================
const SuspenseWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Suspense fallback={<PageLoader />}>{children}</Suspense>
);

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

export const router = createBrowserRouter([
  // PUBLIC ROUTES
  {
    path: '/',
    element: (
      <SuspenseWrapper>
        <SovereignLandingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/home',
    element: (
      <SuspenseWrapper>
        <SovereignLandingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/old-home',
    element: (
      <SuspenseWrapper>
        <LandingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/legacy-home',
    element: (
      <SuspenseWrapper>
        <HomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/pricing',
    element: (
      <SuspenseWrapper>
        <PricingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/demo',
    element: (
      <SuspenseWrapper>
        <DemoRequestPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/product',
    element: (
      <SuspenseWrapper>
        <ProductPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/products',
    element: <Navigate to="/product" replace />,
  },
  {
    path: '/about',
    element: (
      <SuspenseWrapper>
        <AboutPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/contact',
    element: (
      <SuspenseWrapper>
        <ContactPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/contact-us',
    element: (
      <SuspenseWrapper>
        <ContactPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/manifesto',
    element: (
      <SuspenseWrapper>
        <ManifestoHomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/believe',
    element: (
      <SuspenseWrapper>
        <ManifestoHomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/why',
    element: (
      <SuspenseWrapper>
        <ManifestoHomePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/downloads',
    element: (
      <SuspenseWrapper>
        <DownloadsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/license',
    element: (
      <SuspenseWrapper>
        <LicensePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/licenses',
    element: (
      <SuspenseWrapper>
        <LicensePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/services',
    element: (
      <SuspenseWrapper>
        <ServicesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/packages',
    element: (
      <SuspenseWrapper>
        <PackagesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/sovereign',
    element: (
      <SuspenseWrapper>
        <SovereignEnterpriseIntelligencePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/sovereign-enterprise-intelligence',
    element: (
      <SuspenseWrapper>
        <SovereignEnterpriseIntelligencePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/sei',
    element: (
      <SuspenseWrapper>
        <SovereignEnterpriseIntelligencePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/category',
    element: (
      <SuspenseWrapper>
        <SovereignEnterpriseIntelligencePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/honesty',
    element: (
      <SuspenseWrapper>
        <HonestyMatricesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/honesty-matrices',
    element: (
      <SuspenseWrapper>
        <HonestyMatricesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/transparency',
    element: (
      <SuspenseWrapper>
        <HonestyMatricesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/showcases',
    element: (
      <SuspenseWrapper>
        <ShowcasesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/demos/regulators-receipt',
    element: (
      <SuspenseWrapper>
        <RegulatorsReceiptPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/case-studies',
    element: (
      <SuspenseWrapper>
        <ShowcasesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/customers',
    element: (
      <SuspenseWrapper>
        <ShowcasesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/privacy',
    element: (
      <SuspenseWrapper>
        <PrivacyPolicyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/terms',
    element: (
      <SuspenseWrapper>
        <TermsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/terms-of-service',
    element: (
      <SuspenseWrapper>
        <TermsPage />
      </SuspenseWrapper>
    ),
  },

  // ADDITIONAL PUBLIC PAGES
  {
    path: '/security',
    element: (
      <SuspenseWrapper>
        <SecurityPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/cookies',
    element: (
      <SuspenseWrapper>
        <CookiePolicyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/cookie-policy',
    element: (
      <SuspenseWrapper>
        <CookiePolicyPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/docs',
    element: (
      <SuspenseWrapper>
        <DocsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/documentation',
    element: (
      <SuspenseWrapper>
        <DocsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/api',
    element: (
      <SuspenseWrapper>
        <DocsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/blog',
    element: (
      <SuspenseWrapper>
        <BlogPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/changelog',
    element: (
      <SuspenseWrapper>
        <ChangelogPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/releases',
    element: (
      <SuspenseWrapper>
        <ChangelogPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/support',
    element: (
      <SuspenseWrapper>
        <SupportPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/help',
    element: (
      <SuspenseWrapper>
        <SupportPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/integrations',
    element: (
      <SuspenseWrapper>
        <IntegrationsPage />
      </SuspenseWrapper>
    ),
  },

  // AUTH ROUTES
  {
    path: '/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/register',
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/forgot-password',
    element: (
      <SuspenseWrapper>
        <ForgotPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/reset-password',
    element: (
      <SuspenseWrapper>
        <ResetPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verify-email',
    element: (
      <SuspenseWrapper>
        <VerifyEmailPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/login',
    element: (
      <SuspenseWrapper>
        <LoginPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/register',
    element: (
      <SuspenseWrapper>
        <RegisterPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/forgot-password',
    element: (
      <SuspenseWrapper>
        <ForgotPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/reset-password',
    element: (
      <SuspenseWrapper>
        <ResetPasswordPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/auth/verify-email',
    element: (
      <SuspenseWrapper>
        <VerifyEmailPage />
      </SuspenseWrapper>
    ),
  },

  // ONBOARDING
  {
    path: '/onboarding',
    element: (
      <SuspenseWrapper>
        <OnboardingWizard />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/welcome',
    element: (
      <SuspenseWrapper>
        <OnboardingWizard />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/get-started',
    element: (
      <SuspenseWrapper>
        <OnboardingWizard />
      </SuspenseWrapper>
    ),
  },

  // VERTICALS
  {
    path: '/verticals',
    element: (
      <SuspenseWrapper>
        <VerticalsHubPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/healthcare',
    element: (
      <SuspenseWrapper>
        <HealthcarePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/financial-services',
    element: (
      <SuspenseWrapper>
        <FinancialServicesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/government-legal',
    element: (
      <SuspenseWrapper>
        <GovernmentLegalPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/insurance',
    element: (
      <SuspenseWrapper>
        <InsurancePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/pharmaceutical',
    element: (
      <SuspenseWrapper>
        <PharmaceuticalPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/manufacturing',
    element: (
      <SuspenseWrapper>
        <ManufacturingPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/energy-utilities',
    element: (
      <SuspenseWrapper>
        <EnergyUtilitiesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/technology',
    element: (
      <SuspenseWrapper>
        <TechnologyVerticalPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/retail-hospitality',
    element: (
      <SuspenseWrapper>
        <RetailHospitalityPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/real-estate',
    element: (
      <SuspenseWrapper>
        <RealEstateConstructionPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/transportation',
    element: (
      <SuspenseWrapper>
        <TransportationLogisticsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/media-entertainment',
    element: (
      <SuspenseWrapper>
        <MediaEntertainmentPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/professional-services',
    element: (
      <SuspenseWrapper>
        <ProfessionalServicesPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/higher-education',
    element: (
      <SuspenseWrapper>
        <HigherEducationPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/sports',
    element: (
      <SuspenseWrapper>
        <SportsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/telecommunications',
    element: (
      <SuspenseWrapper>
        <TelecommunicationsPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/aerospace',
    element: (
      <SuspenseWrapper>
        <AerospacePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/agriculture',
    element: (
      <SuspenseWrapper>
        <AgriculturePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/automotive',
    element: (
      <SuspenseWrapper>
        <AutomotivePage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/construction',
    element: (
      <SuspenseWrapper>
        <ConstructionPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/hospitality',
    element: (
      <SuspenseWrapper>
        <HospitalityPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/verticals/nonprofit',
    element: (
      <SuspenseWrapper>
        <NonProfitPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/industries',
    element: (
      <SuspenseWrapper>
        <VerticalsHubPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/solutions',
    element: (
      <SuspenseWrapper>
        <VerticalsHubPage />
      </SuspenseWrapper>
    ),
  },

  // APEX PACKAGE
  {
    path: '/apex/forecast',
    element: (
      <SuspenseWrapper>
        <CendiaForecastPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/apex/sentry',
    element: (
      <SuspenseWrapper>
        <CendiaSentryPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/products/cendia-forecast',
    element: (
      <SuspenseWrapper>
        <CendiaForecastPage />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/products/cendia-sentry',
    element: (
      <SuspenseWrapper>
        <CendiaSentryPage />
      </SuspenseWrapper>
    ),
  },

  // PITCH
  {
    path: '/pitch',
    element: (
      <SuspenseWrapper>
        <PitchDeck />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/investors',
    element: (
      <SuspenseWrapper>
        <PitchDeck />
      </SuspenseWrapper>
    ),
  },
  {
    path: '/deck',
    element: (
      <SuspenseWrapper>
        <PitchDeck />
      </SuspenseWrapper>
    ),
  },

  // CORTEX APPLICATION
  {
    path: '/cortex',
    element: <CortexLayout />,
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <DashboardPage />
          </SuspenseWrapper>
        ),
      },

      // Graph
      {
        path: 'graph',
        element: (
          <SuspenseWrapper>
            <GraphExplorerPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'graph/lineage/:entityId?',
        element: (
          <SuspenseWrapper>
            <LineageViewPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'graph/entity/:entityId',
        element: (
          <SuspenseWrapper>
            <EntityDetailsPage />
          </SuspenseWrapper>
        ),
      },

      // Council
      {
        path: 'council',
        element: (
          <SuspenseWrapper>
            <CouncilPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'council/deliberation/:deliberationId',
        element: (
          <SuspenseWrapper>
            <DeliberationViewPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'council/agent/:agentId',
        element: (
          <SuspenseWrapper>
            <AgentProfilePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'decisions',
        element: (
          <SuspenseWrapper>
            <DecisionsPage />
          </SuspenseWrapper>
        ),
      },

      // Pulse
      {
        path: 'pulse',
        element: (
          <SuspenseWrapper>
            <PulsePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pulse/alerts',
        element: (
          <SuspenseWrapper>
            <AlertsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pulse/metrics',
        element: (
          <SuspenseWrapper>
            <MetricsPage />
          </SuspenseWrapper>
        ),
      },

      // Lens
      {
        path: 'lens',
        element: (
          <SuspenseWrapper>
            <LensPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'lens/forecast/:forecastId',
        element: (
          <SuspenseWrapper>
            <ForecastDetailsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'lens/scenarios/:scenarioId',
        element: (
          <SuspenseWrapper>
            <ScenarioDetailsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'lens/scenarios/:scenarioId/edit',
        element: (
          <SuspenseWrapper>
            <ScenarioBuilderPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'lens/scenarios/new',
        element: (
          <SuspenseWrapper>
            <ScenarioBuilderPage />
          </SuspenseWrapper>
        ),
      },

      // Bridge
      {
        path: 'bridge',
        element: (
          <SuspenseWrapper>
            <BridgePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bridge/workflows',
        element: (
          <SuspenseWrapper>
            <WorkflowsListPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bridge/workflows/:workflowId',
        element: (
          <SuspenseWrapper>
            <WorkflowBuilderPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bridge/workflows/new',
        element: (
          <SuspenseWrapper>
            <WorkflowBuilderPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bridge/approvals',
        element: (
          <SuspenseWrapper>
            <ApprovalsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'bridge/integrations',
        element: (
          <SuspenseWrapper>
            <BridgeIntegrationsPage />
          </SuspenseWrapper>
        ),
      },

      // Intelligence
      { path: 'intelligence', element: <Navigate to="/cortex/intelligence/pre-mortem" replace /> },
      { path: 'intelligence/council', element: <RedirectToCouncilWithQuery /> },
      {
        path: 'intelligence/pre-mortem',
        element: (
          <SuspenseWrapper>
            <PreMortemPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'intelligence/ghost-board',
        element: (
          <SuspenseWrapper>
            <GhostBoardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'intelligence/decision-debt',
        element: (
          <SuspenseWrapper>
            <DecisionDebtPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'intelligence/live-demo',
        element: (
          <SuspenseWrapper>
            <LiveDemoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'intelligence/regulatory',
        element: (
          <SuspenseWrapper>
            <RegulatoryAbsorbPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'intelligence/decision-dna',
        element: (
          <SuspenseWrapper>
            <DecisionDNAPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'intelligence/chronos',
        element: (
          <SuspenseWrapper>
            <ChronosPage />
          </SuspenseWrapper>
        ),
      },

      // Enterprise
      {
        path: 'enterprise/sovereign',
        element: (
          <SuspenseWrapper>
            <SovereignPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/persona-forge',
        element: (
          <SuspenseWrapper>
            <PersonaForgePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/mesh',
        element: (
          <SuspenseWrapper>
            <MeshPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/govern',
        element: (
          <SuspenseWrapper>
            <GovernPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'governance/decision-packets',
        element: (
          <SuspenseWrapper>
            <DecisionPacketsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/voice',
        element: (
          <SuspenseWrapper>
            <VoicePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/autopilot',
        element: (
          <SuspenseWrapper>
            <AutopilotPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/genomics',
        element: (
          <SuspenseWrapper>
            <GenomicsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/defense-stack',
        element: (
          <SuspenseWrapper>
            <DefenseStackPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/omni-translate',
        element: (
          <SuspenseWrapper>
            <OmniTranslatePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/veto',
        element: (
          <SuspenseWrapper>
            <VetoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/union',
        element: (
          <SuspenseWrapper>
            <UnionPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/ledger',
        element: (
          <SuspenseWrapper>
            <LedgerPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/evidence-vault',
        element: (
          <SuspenseWrapper>
            <EvidenceVaultPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/apotheosis',
        element: (
          <SuspenseWrapper>
            <ApotheosisPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/dissent',
        element: (
          <SuspenseWrapper>
            <DissentPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/roi-metrics',
        element: (
          <SuspenseWrapper>
            <ROIMetricsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/cascade',
        element: (
          <SuspenseWrapper>
            <CascadePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/crisis',
        element: (
          <SuspenseWrapper>
            <CrisisManagementPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/audit-workflow',
        element: (
          <SuspenseWrapper>
            <AuditWorkflowPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'enterprise/training',
        element: (
          <SuspenseWrapper>
            <TrainingPage />
          </SuspenseWrapper>
        ),
      },

      // Sovereign
      {
        path: 'sovereign/crucible',
        element: (
          <SuspenseWrapper>
            <CruciblePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sovereign/panopticon',
        element: (
          <SuspenseWrapper>
            <PanopticonPage />
          </SuspenseWrapper>
        ),
      },
      // Alias: Oversight → Panopticon (renamed in UI)
      { path: 'sovereign/oversight', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
      {
        path: 'sovereign/aegis',
        element: (
          <SuspenseWrapper>
            <AegisPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sovereign/eternal',
        element: (
          <SuspenseWrapper>
            <EternalPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sovereign/symbiont',
        element: (
          <SuspenseWrapper>
            <SymbiontPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sovereign/vox',
        element: (
          <SuspenseWrapper>
            <VoxPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sovereign/horizon',
        element: (
          <SuspenseWrapper>
            <HorizonPage />
          </SuspenseWrapper>
        ),
      },

      // =============================================================================
      // ROUTE ALIASES - Merged services redirect to consolidated pages
      // =============================================================================
      
      // MERGED INTO CHRONOS: Horizon, Cascade, Crisis, Lens
      { path: 'core/chronos', element: <Navigate to="/cortex/intelligence/chronos" replace /> },
      // Cascade and Crisis now redirect to Chronos (merged)
      // Keep original routes working but they could show Chronos with different tabs/modes
      
      // MERGED INTO COUNCIL: Autopilot, Voice, Union, Veto, Dissent, Vox
      { path: 'core/council', element: <Navigate to="/cortex/council" replace /> },
      
      // MERGED INTO OVERSIGHT (Panopticon): Govern, Audit, Regulatory Absorb
      { path: 'trust/oversight', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
      { path: 'enterprise/audit', element: <Navigate to="/cortex/sovereign/panopticon" replace /> },
      
      // MERGED INTO DECISION DNA: Ledger, Evidence Vault
      { path: 'trust/decision-dna', element: <Navigate to="/cortex/intelligence/decision-dna" replace /> },
      
      // MERGED INTO CRUCIBLE: RedTeam, Echo, Apotheosis
      { path: 'trust/crucible', element: <Navigate to="/cortex/sovereign/crucible" replace /> },

      // Admin Pages
      {
        path: 'admin/vertical-config',
        element: (
          <SuspenseWrapper>
            <VerticalConfigPage />
          </SuspenseWrapper>
        ),
      },

      // Demo Studio
      {
        path: 'demo',
        element: (
          <SuspenseWrapper>
            <DemoLauncherPage />
          </SuspenseWrapper>
        ),
      },

      // Crown Jewels - Premium Enterprise Services ($5M-$150M tier)
      {
        path: 'crown/echo',
        element: (
          <SuspenseWrapper>
            <EchoPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'crown/redteam',
        element: (
          <SuspenseWrapper>
            <RedTeamPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'crown/gnosis',
        element: (
          <SuspenseWrapper>
            <GnosisPage />
          </SuspenseWrapper>
        ),
      },

      // Pillars
      { path: 'pillars', element: <Navigate to="/cortex/pillars/helm" replace /> },
      {
        path: 'pillars/helm',
        element: (
          <SuspenseWrapper>
            <HelmPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/lineage',
        element: (
          <SuspenseWrapper>
            <LineagePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/predict',
        element: (
          <SuspenseWrapper>
            <PredictPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/flow',
        element: (
          <SuspenseWrapper>
            <FlowPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/health',
        element: (
          <SuspenseWrapper>
            <HealthPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/guard',
        element: (
          <SuspenseWrapper>
            <GuardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/ethics',
        element: (
          <SuspenseWrapper>
            <EthicsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'pillars/agents',
        element: (
          <SuspenseWrapper>
            <AgentsPage />
          </SuspenseWrapper>
        ),
      },

      // Data
      { path: 'data', element: <Navigate to="/cortex/data/sources" replace /> },
      {
        path: 'data/sources',
        element: (
          <SuspenseWrapper>
            <DataSourcesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'data/catalog',
        element: (
          <SuspenseWrapper>
            <DataCatalogPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'data/quality',
        element: (
          <SuspenseWrapper>
            <DataQualityPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'data/import-export',
        element: (
          <SuspenseWrapper>
            <DataImportExportPage />
          </SuspenseWrapper>
        ),
      },

      // Compliance
      {
        path: 'compliance',
        element: (
          <SuspenseWrapper>
            <ComplianceDashboard />
          </SuspenseWrapper>
        ),
      },

      // Walkthroughs
      {
        path: 'walkthroughs',
        element: (
          <SuspenseWrapper>
            <WalkthroughsPage />
          </SuspenseWrapper>
        ),
      },

      // Security
      {
        path: 'security',
        element: (
          <SuspenseWrapper>
            <SecurityOverviewPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'security/access',
        element: (
          <SuspenseWrapper>
            <AccessControlPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'security/audit',
        element: (
          <SuspenseWrapper>
            <AuditLogPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'security/policies',
        element: (
          <SuspenseWrapper>
            <SecurityPoliciesPage />
          </SuspenseWrapper>
        ),
      },

      // Settings
      {
        path: 'settings',
        element: (
          <SuspenseWrapper>
            <SettingsLayout />
          </SuspenseWrapper>
        ),
        children: [
          { index: true, element: <Navigate to="/cortex/settings/organization" replace /> },
          {
            path: 'organization',
            element: (
              <SuspenseWrapper>
                <OrganizationSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'users',
            element: (
              <SuspenseWrapper>
                <UsersSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'teams',
            element: (
              <SuspenseWrapper>
                <TeamsSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'roles',
            element: (
              <SuspenseWrapper>
                <RolesSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'billing',
            element: (
              <SuspenseWrapper>
                <BillingSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'api-keys',
            element: (
              <SuspenseWrapper>
                <ApiKeysSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'integrations',
            element: (
              <SuspenseWrapper>
                <IntegrationSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'preferences',
            element: (
              <SuspenseWrapper>
                <PreferencesSettingsPage />
              </SuspenseWrapper>
            ),
          },
          {
            path: 'security',
            element: (
              <SuspenseWrapper>
                <SettingsSecurityPage />
              </SuspenseWrapper>
            ),
          },
        ],
      },
    ],
  },

  // ADMIN
  {
    path: '/admin',
    element: (
      <SuspenseWrapper>
        <AdminLayout />
      </SuspenseWrapper>
    ),
    children: [
      {
        index: true,
        element: (
          <SuspenseWrapper>
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'dashboard',
        element: (
          <SuspenseWrapper>
            <AdminDashboardPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'tenants',
        element: (
          <SuspenseWrapper>
            <TenantsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'licenses',
        element: (
          <SuspenseWrapper>
            <LicensesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'usage',
        element: (
          <SuspenseWrapper>
            <UsageAnalyticsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'health',
        element: (
          <SuspenseWrapper>
            <SystemHealthPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'features',
        element: (
          <SuspenseWrapper>
            <FeatureFlagsPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'data-sources',
        element: (
          <SuspenseWrapper>
            <AdminDataSourcesPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'mode-analytics',
        element: (
          <SuspenseWrapper>
            <ModeAnalytics />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'rd-lab',
        element: (
          <SuspenseWrapper>
            <RDLabPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'core',
        element: (
          <SuspenseWrapper>
            <CorePage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'control-center',
        element: (
          <SuspenseWrapper>
            <ControlCenterPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'ai',
        element: (
          <SuspenseWrapper>
            <AdminAIPage />
          </SuspenseWrapper>
        ),
      },
      {
        path: 'sovereign-stack',
        element: (
          <SuspenseWrapper>
            <SovereignStackPage />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // TOOLS
  {
    path: '/tools',
    element: <CortexLayout />,
    children: [
      {
        path: 'roi-calculator',
        element: (
          <SuspenseWrapper>
            <ROICalculator />
          </SuspenseWrapper>
        ),
      },
    ],
  },

  // 404
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

// Route helpers (same as before)
export const routes = {
  home: '/',
  pricing: '/pricing',
  demo: '/demo',
  product: '/product',
  about: '/about',
  manifesto: '/manifesto',
  downloads: '/downloads',
  services: '/services',
  packages: '/packages',
  login: '/auth/login',
  register: '/auth/register',
  forgotPassword: '/auth/forgot-password',
  resetPassword: '/auth/reset-password',
  verifyEmail: '/auth/verify-email',
  cortex: '/cortex',
  dashboard: '/cortex/dashboard',
  graph: '/cortex/graph',
  lineage: (entityId?: string) =>
    entityId ? `/cortex/graph/lineage/${entityId}` : '/cortex/graph/lineage',
  entity: (entityId: string) => `/cortex/graph/entity/${entityId}`,
  council: '/cortex/council',
  deliberation: (id: string) => `/cortex/council/deliberation/${id}`,
  agent: (id: string) => `/cortex/council/agent/${id}`,
  pulse: '/cortex/pulse',
  alerts: '/cortex/pulse/alerts',
  metrics: '/cortex/pulse/metrics',
  lens: '/cortex/lens',
  forecast: (id: string) => `/cortex/lens/forecast/${id}`,
  scenario: (id: string) => `/cortex/lens/scenarios/${id}`,
  scenarioEdit: (id: string) => `/cortex/lens/scenarios/${id}/edit`,
  newScenario: '/cortex/lens/scenarios/new',
  bridge: '/cortex/bridge',
  workflows: '/cortex/bridge/workflows',
  workflow: (id: string) => `/cortex/bridge/workflows/${id}`,
  newWorkflow: '/cortex/bridge/workflows/new',
  approvals: '/cortex/bridge/approvals',
  bridgeIntegrations: '/cortex/bridge/integrations',
  data: '/cortex/data',
  dataSources: '/cortex/data/sources',
  dataCatalog: '/cortex/data/catalog',
  dataQuality: '/cortex/data/quality',
  dataImportExport: '/cortex/data/import-export',
  security: '/cortex/security',
  accessControl: '/cortex/security/access',
  auditLog: '/cortex/security/audit',
  securityPolicies: '/cortex/security/policies',
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
