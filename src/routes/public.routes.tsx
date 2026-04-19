/**
 * Route Config — Public Routes
 *
 * React Router route definitions and lazy-loaded imports.
 *
 * @exports publicRoutes
 * @module routes/public.routes
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// PUBLIC ROUTES - Marketing, Landing Pages, Legal, Docs
// =============================================================================

import React, { lazy } from 'react';
import { RouteObject, Navigate } from 'react-router-dom';
import { SuspenseWrapper } from './utils';

// Public Pages
const SovereignLandingPage = lazy(() => import('../pages/marketing/SovereignLandingPage'));
const ManifestoHomePage = lazy(() => import('../pages/marketing/ManifestoHomePage'));
const LandingPage = lazy(() =>
  import('../pages/marketing').then((m) => ({ default: m.LandingPage }))
);
const HomePage = lazy(() => import('../pages/public').then((m) => ({ default: m.HomePage })));
const ProductPage = lazy(() => import('../pages/public').then((m) => ({ default: m.ProductPage })));
const AboutPage = lazy(() => import('../pages/public').then((m) => ({ default: m.AboutPage })));
const ContactPage = lazy(() => import('../pages/public').then((m) => ({ default: m.ContactPage })));
const ManifestoPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.ManifestoPage }))
);
const DownloadsPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.DownloadsPage }))
);
const LicensePage = lazy(() => import('../pages/public').then((m) => ({ default: m.LicensePage })));
const SecurityPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.SecurityPage }))
);
const CookiePolicyPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.CookiePolicyPage }))
);
const DocsPage = lazy(() => import('../pages/public').then((m) => ({ default: m.DocsPage })));
const BlogPage = lazy(() => import('../pages/public').then((m) => ({ default: m.BlogPage })));
const ChangelogPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.ChangelogPage }))
);
const SupportPage = lazy(() => import('../pages/public').then((m) => ({ default: m.SupportPage })));
const IntegrationsPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.IntegrationsPage }))
);
const DemoRequestPage = lazy(() =>
  import('../pages/public').then((m) => ({ default: m.DemoRequestPage }))
);
const ShowcasesPage = lazy(() => import('../pages/public/ShowcasesPage'));
const ServicesPage = lazy(() =>
  import('../pages/public/services-packages').then((m) => ({ default: m.ServicesPage }))
);
const PackagesPage = lazy(() =>
  import('../pages/public/services-packages').then((m) => ({ default: m.PackagesPage }))
);
const HonestyMatricesPage = lazy(() => import('../pages/public/HonestyMatricesPage'));
const SovereignEnterpriseIntelligencePage = lazy(
  () => import('../pages/public/SovereignEnterpriseIntelligencePage')
);
const StatusPage = lazy(() => import('../pages/public/StatusPage'));

// Ops Agents (Enterprise)
const OpsAgentsPage = lazy(() =>
  import('../pages/cortex/ops').then((m) => ({ default: m.OpsAgentsPage }))
);

// Legal
const PrivacyPolicyPage = lazy(() =>
  import('../pages/legal').then((m) => ({ default: m.PrivacyPolicyPage }))
);
const TermsPage = lazy(() => import('../pages/legal').then((m) => ({ default: m.TermsPage })));
const SubprocessorsPage = lazy(() =>
  import('../pages/legal').then((m) => ({ default: m.SubprocessorsPage }))
);
const FAQPage = lazy(() => import('../pages/legal').then((m) => ({ default: m.FAQPage })));
const AIDisclosurePage = lazy(() =>
  import('../pages/legal').then((m) => ({ default: m.AIDisclosurePage }))
);

// Pricing
const PricingPage = lazy(() => import('../pages/pricing').then((m) => ({ default: m.PricingPage })));

// Demos
const RegulatorsReceiptPage = lazy(() => import('../pages/cortex/trust/RegulatorsReceiptPage'));
const LegalWorkflowPage = lazy(() => import('../pages/cortex/workflows/LegalWorkflowPage'));

// Apex Package
const CendiaForecastPage = lazy(() =>
  import('../pages/apex').then((m) => ({ default: m.CendiaForecastPage }))
);
const CendiaSentryPage = lazy(() =>
  import('../pages/apex').then((m) => ({ default: m.CendiaSentryPage }))
);

// Wedge Products — Enterprise Platinum lead-gen pages
const ShadowAIScannerPage = lazy(() =>
  import('../pages/cortex/wedge').then((m) => ({ default: m.ShadowAIScannerPage }))
);
const GovernanceReportPage = lazy(() =>
  import('../pages/cortex/wedge').then((m) => ({ default: m.GovernanceReportPage }))
);
const IncidentForensicsPage = lazy(() =>
  import('../pages/cortex/wedge').then((m) => ({ default: m.IncidentForensicsPage }))
);

// Pitch
const PitchDeck = lazy(() => import('../pages/pitch').then((m) => ({ default: m.PitchDeck })));

const w = (Component: React.ComponentType) => (
  <SuspenseWrapper><Component /></SuspenseWrapper>
);

export const publicRoutes: RouteObject[] = [
  { path: '/', element: w(SovereignLandingPage) },
  { path: '/home', element: w(SovereignLandingPage) },
  { path: '/old-home', element: w(LandingPage) },
  { path: '/legacy-home', element: w(HomePage) },
    { path: '/pricing', element: w(PricingPage) },

  // Wedge Products — Free tools that drive client acquisition
  { path: '/shadow-scan', element: w(ShadowAIScannerPage) },
  { path: '/shadow-ai', element: w(ShadowAIScannerPage) },
  { path: '/governance-report', element: w(GovernanceReportPage) },
  { path: '/ai-governance-report', element: w(GovernanceReportPage) },
  { path: '/incident-forensics', element: w(IncidentForensicsPage) },
  { path: '/ai-forensics', element: w(IncidentForensicsPage) },
  { path: '/demo', element: w(DemoRequestPage) },
  { path: '/product', element: w(ProductPage) },
  { path: '/products', element: <Navigate to="/product" replace /> },
  { path: '/about', element: w(AboutPage) },
  { path: '/contact', element: w(ContactPage) },
  { path: '/contact-us', element: w(ContactPage) },
  { path: '/manifesto', element: w(ManifestoHomePage) },
  { path: '/believe', element: w(ManifestoHomePage) },
  { path: '/why', element: w(ManifestoHomePage) },
  { path: '/downloads', element: w(DownloadsPage) },
  { path: '/license', element: w(LicensePage) },
  { path: '/licenses', element: w(LicensePage) },
  { path: '/services', element: w(ServicesPage) },
  { path: '/packages', element: w(PackagesPage) },
  { path: '/sovereign', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/sovereign-enterprise-intelligence', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/sei', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/category', element: w(SovereignEnterpriseIntelligencePage) },
  { path: '/honesty', element: w(HonestyMatricesPage) },
  { path: '/honesty-matrices', element: w(HonestyMatricesPage) },
  { path: '/transparency', element: w(HonestyMatricesPage) },
  { path: '/showcases', element: w(ShowcasesPage) },
  { path: '/cortex/trust/regulators-receipt', element: w(RegulatorsReceiptPage) },
  { path: '/cortex/workflows/legal', element: w(LegalWorkflowPage) },
  { path: '/case-studies', element: w(ShowcasesPage) },
  { path: '/customers', element: w(ShowcasesPage) },
  { path: '/privacy', element: w(PrivacyPolicyPage) },
  { path: '/terms', element: w(TermsPage) },
  { path: '/terms-of-service', element: w(TermsPage) },
  { path: '/security', element: w(SecurityPage) },
  { path: '/status', element: w(StatusPage) },
  { path: '/cookies', element: w(CookiePolicyPage) },
  { path: '/cookie-policy', element: w(CookiePolicyPage) },
  { path: '/subprocessors', element: w(SubprocessorsPage) },
  { path: '/faq', element: w(FAQPage) },
  { path: '/ai-disclosure', element: w(AIDisclosurePage) },
  { path: '/docs', element: w(DocsPage) },
  { path: '/documentation', element: w(DocsPage) },
  { path: '/api', element: w(DocsPage) },
  { path: '/blog', element: w(BlogPage) },
  { path: '/changelog', element: w(ChangelogPage) },
  { path: '/releases', element: w(ChangelogPage) },
  { path: '/support', element: w(SupportPage) },
  { path: '/help', element: w(SupportPage) },
  { path: '/integrations', element: w(IntegrationsPage) },

  // Apex Package
  { path: '/apex/forecast', element: w(CendiaForecastPage) },
  { path: '/apex/sentry', element: w(CendiaSentryPage) },
  { path: '/products/cendia-forecast', element: w(CendiaForecastPage) },
  { path: '/products/cendia-sentry', element: w(CendiaSentryPage) },

  // Ops Agents — Enterprise AI task agents
  { path: '/ops-agents', element: w(OpsAgentsPage) },
  { path: '/ops', element: w(OpsAgentsPage) },
  { path: '/agents/ops', element: w(OpsAgentsPage) },

  // Pitch
  { path: '/pitch', element: w(PitchDeck) },
  { path: '/investors', element: w(PitchDeck) },
  { path: '/deck', element: w(PitchDeck) },
];


