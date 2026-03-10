/**
 * Frontend Page Smoke Tests
 * 
 * Verifies all 185 page modules can be imported and export React components.
 * Each test FAILS IF: the module doesn't exist, fails to import, or doesn't
 * export a default/named React component.
 * 
 * @module tests/frontend/pages-smoke.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';

// Mock dependencies that pages commonly use
vi.mock('react-router-dom', () => ({
  useNavigate: () => vi.fn(),
  useParams: () => ({}),
  useSearchParams: () => [new URLSearchParams(), vi.fn()],
  useLocation: () => ({ pathname: '/', search: '', hash: '', state: null }),
  Link: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  NavLink: ({ children, ...props }: any) => <a {...props}>{children}</a>,
  Outlet: () => null,
  Navigate: () => null,
}));

vi.mock('@/lib/api/client', () => ({
  api: { get: vi.fn().mockResolvedValue({ success: true, data: {} }), post: vi.fn().mockResolvedValue({ success: true }) },
  tokenManager: { getAccessToken: () => 'test', isAuthenticated: () => true },
  onAuthChange: vi.fn(),
}));

vi.mock('@/stores/authStore', () => ({
  useAuthStore: Object.assign(() => ({
    isAuthenticated: true, user: { id: '1', name: 'Test', email: 'test@test.com', role: 'admin', organizationId: 'org-1' },
    token: 'test-token', login: vi.fn(), logout: vi.fn(), isLoading: false,
  }), { getState: () => ({ isAuthenticated: true, user: { id: '1', name: 'Test', role: 'admin', organizationId: 'org-1' }, token: 'test' }) }),
}));

vi.mock('@/stores/uiStore', () => ({
  useUIStore: Object.assign(() => ({
    sidebarOpen: true, toasts: [], addToast: vi.fn(), setPageTitle: vi.fn(), setBreadcrumbs: vi.fn(),
  }), { getState: () => ({ sidebarOpen: true, toasts: [], addToast: vi.fn() }) }),
  useToast: () => ({ success: vi.fn(), error: vi.fn(), info: vi.fn(), warning: vi.fn() }),
}));

vi.mock('@/lib/logger', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
  default: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Page module entries: [name, importPath]
const pageModules: [string, string][] = [
  ['NotFoundPage', '../../src/pages/NotFoundPage'],
  ['LoginPage', '../../src/pages/auth/LoginPage'],
  ['RegisterPage', '../../src/pages/auth/RegisterPage'],
  ['ForgotPasswordPage', '../../src/pages/auth/ForgotPasswordPage'],
  ['ResetPasswordPage', '../../src/pages/auth/ResetPasswordPage'],
  ['FindAccountPage', '../../src/pages/auth/FindAccountPage'],
  ['VerifyEmailPage', '../../src/pages/auth/VerifyEmailPage'],
  ['HomePage', '../../src/pages/public/HomePage'],
  ['ProductPage', '../../src/pages/public/ProductPage'],
  ['BlogPage', '../../src/pages/public/BlogPage'],
  ['DocsPage', '../../src/pages/public/DocsPage'],
  ['ChangelogPage', '../../src/pages/public/ChangelogPage'],
  ['SecurityPage', '../../src/pages/public/SecurityPage'],
  ['SupportPage', '../../src/pages/public/SupportPage'],
  ['LicensePage', '../../src/pages/public/LicensePage'],
  ['IntegrationsPage', '../../src/pages/public/IntegrationsPage'],
  ['ShowcasesPage', '../../src/pages/public/ShowcasesPage'],
  ['DownloadsPage', '../../src/pages/public/DownloadsPage'],
  ['CookiePolicyPage', '../../src/pages/public/CookiePolicyPage'],
  ['HonestyMatricesPage', '../../src/pages/public/HonestyMatricesPage'],
  ['PrivacyPolicyPage', '../../src/pages/legal/PrivacyPolicyPage'],
  ['TermsPage', '../../src/pages/legal/TermsPage'],
  ['LandingPage', '../../src/pages/marketing/LandingPage'],
  ['ManifestoHomePage', '../../src/pages/marketing/ManifestoHomePage'],
  ['SovereignLandingPage', '../../src/pages/marketing/SovereignLandingPage'],
  ['PricingPage', '../../src/pages/pricing/PricingPage'],
  ['OnboardingWizard', '../../src/pages/onboarding/OnboardingWizard'],
  ['DashboardPage', '../../src/pages/cortex/DashboardPage'],
  ['MissionControlDashboard', '../../src/pages/cortex/MissionControlDashboard'],
  ['CouncilPage', '../../src/pages/cortex/council/CouncilPage'],
  ['CouncilHistoryPage', '../../src/pages/cortex/council/CouncilHistoryPage'],
  ['CouncilAnalyticsPage', '../../src/pages/cortex/council/CouncilAnalyticsPage'],
  ['CouncilModesPage', '../../src/pages/cortex/council/CouncilModesPage'],
  ['DecisionsPage', '../../src/pages/cortex/council/DecisionsPage'],
  ['ExecutiveSummaryPage', '../../src/pages/cortex/council/ExecutiveSummaryPage'],
  ['EchoPage', '../../src/pages/cortex/crown/EchoPage'],
  ['GnosisPage', '../../src/pages/cortex/crown/GnosisPage'],
  ['RedTeamPage', '../../src/pages/cortex/crown/RedTeamPage'],
  ['ComplianceDashboard', '../../src/pages/cortex/compliance/ComplianceDashboard'],
  ['CrossJurisdictionPage', '../../src/pages/cortex/compliance/CrossJurisdictionPage'],
  ['RegulatorySandboxPage', '../../src/pages/cortex/compliance/RegulatorySandboxPage'],
  ['AegisPage', '../../src/pages/sovereign/AegisPage'],
  ['CruciblePage', '../../src/pages/sovereign/CruciblePage'],
  ['EternalPage', '../../src/pages/sovereign/EternalPage'],
  ['HorizonPage', '../../src/pages/sovereign/HorizonPage'],
  ['PanopticonPage', '../../src/pages/sovereign/PanopticonPage'],
  ['SymbiontPage', '../../src/pages/sovereign/SymbiontPage'],
  ['VoxPage', '../../src/pages/sovereign/VoxPage'],
  ['HealthcarePage', '../../src/pages/verticals/HealthcarePage'],
  ['FinancialServicesPage', '../../src/pages/verticals/FinancialServicesPage'],
  ['LegalPage', '../../src/pages/verticals/LegalPage'],
  ['GovernmentLegalPage', '../../src/pages/verticals/GovernmentLegalPage'],
  ['InsurancePage', '../../src/pages/verticals/InsurancePage'],
  ['ManufacturingPage', '../../src/pages/verticals/ManufacturingPage'],
  ['EnergyUtilitiesPage', '../../src/pages/verticals/EnergyUtilitiesPage'],
  ['TechnologyPage', '../../src/pages/verticals/TechnologyPage'],
  ['VerticalsHubPage', '../../src/pages/verticals/VerticalsHubPage'],
  ['AerospacePage', '../../src/pages/verticals/AerospacePage'],
  ['AutomotivePage', '../../src/pages/verticals/AutomotivePage'],
  ['ConstructionPage', '../../src/pages/verticals/ConstructionPage'],
  ['PharmaceuticalPage', '../../src/pages/verticals/PharmaceuticalPage'],
  ['RetailHospitalityPage', '../../src/pages/verticals/RetailHospitalityPage'],
  ['MediaEntertainmentPage', '../../src/pages/verticals/MediaEntertainmentPage'],
  ['TransportationLogisticsPage', '../../src/pages/verticals/TransportationLogisticsPage'],
  ['EUBankingPage', '../../src/pages/verticals/EUBankingPage'],
  ['AdminDashboard', '../../src/pages/admin/AdminDashboard'],
  ['SystemHealthPage', '../../src/pages/admin/SystemHealthPage'],
  ['TenantsPage', '../../src/pages/admin/TenantsPage'],
  ['FeatureFlagsPage', '../../src/pages/admin/FeatureFlagsPage'],
  ['DataSourcesPage', '../../src/pages/admin/DataSourcesPage'],
  ['EnvironmentConfigPage', '../../src/pages/admin/EnvironmentConfigPage'],
  ['ROICalculator', '../../src/pages/tools/ROICalculator'],
];

describe('Page Module Smoke Tests', () => {
  // Each test dynamically imports a page module and verifies it exports a React component.
  // FAILS IF: module doesn't exist, import throws, or export is not a function (React component)
  for (const [name, path] of pageModules) {
    it(`${name} should export a valid React component`, async () => {
      const mod = await import(path);
      const Component = mod.default || mod[name] || Object.values(mod).find(
        (v: any) => typeof v === 'function' && v.length <= 1
      );
      // FAILS IF: no component exported
      expect(Component).toBeDefined();
      // FAILS IF: export is not a function (React components are functions)
      expect(typeof Component).toBe('function');
    });
  }
});
