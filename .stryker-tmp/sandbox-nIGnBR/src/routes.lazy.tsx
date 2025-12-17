// @ts-nocheck
// =============================================================================
// DATACENDIA - APPLICATION ROUTES WITH LAZY LOADING
// Performance optimized - code splitting for all heavy components
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
import React, { Suspense, lazy } from 'react';
import { createBrowserRouter, Navigate, useLocation } from 'react-router-dom';
import { PageLoader } from './components/ui/PageLoader';

// Helper for lazy loading with suspense
const lazyLoad = (importFn: () => Promise<{
  default: React.ComponentType<any>;
}>) => {
  const LazyComponent = lazy(importFn);
  return <Suspense fallback={<PageLoader />}>
      <LazyComponent />
    </Suspense>;
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
const SettingsLayout = lazy(stryMutAct_9fa48("64624") ? () => undefined : (stryCov_9fa48("64624"), () => import('./pages/settings').then(stryMutAct_9fa48("64626") ? () => undefined : (stryCov_9fa48("64626"), m => stryMutAct_9fa48("64627") ? {} : (stryCov_9fa48("64627"), {
  default: m.SettingsLayout
})))));
const AdminLayout = lazy(stryMutAct_9fa48("64628") ? () => undefined : (stryCov_9fa48("64628"), () => import('./pages/admin').then(stryMutAct_9fa48("64630") ? () => undefined : (stryCov_9fa48("64630"), m => stryMutAct_9fa48("64631") ? {} : (stryCov_9fa48("64631"), {
  default: m.AdminLayout
})))));

// =============================================================================
// LAZY LOADED PAGES
// =============================================================================

// Public Pages
const SovereignLandingPage = lazy(stryMutAct_9fa48("64632") ? () => undefined : (stryCov_9fa48("64632"), () => import('./pages/marketing/SovereignLandingPage')));
const ManifestoHomePage = lazy(stryMutAct_9fa48("64634") ? () => undefined : (stryCov_9fa48("64634"), () => import('./pages/marketing/ManifestoHomePage')));
const LandingPage = lazy(stryMutAct_9fa48("64636") ? () => undefined : (stryCov_9fa48("64636"), () => import('./pages/marketing').then(stryMutAct_9fa48("64638") ? () => undefined : (stryCov_9fa48("64638"), m => stryMutAct_9fa48("64639") ? {} : (stryCov_9fa48("64639"), {
  default: m.LandingPage
})))));
const HomePage = lazy(stryMutAct_9fa48("64640") ? () => undefined : (stryCov_9fa48("64640"), () => import('./pages/public').then(stryMutAct_9fa48("64642") ? () => undefined : (stryCov_9fa48("64642"), m => stryMutAct_9fa48("64643") ? {} : (stryCov_9fa48("64643"), {
  default: m.HomePage
})))));
const ProductPage = lazy(stryMutAct_9fa48("64644") ? () => undefined : (stryCov_9fa48("64644"), () => import('./pages/public').then(stryMutAct_9fa48("64646") ? () => undefined : (stryCov_9fa48("64646"), m => stryMutAct_9fa48("64647") ? {} : (stryCov_9fa48("64647"), {
  default: m.ProductPage
})))));
const AboutPage = lazy(stryMutAct_9fa48("64648") ? () => undefined : (stryCov_9fa48("64648"), () => import('./pages/public').then(stryMutAct_9fa48("64650") ? () => undefined : (stryCov_9fa48("64650"), m => stryMutAct_9fa48("64651") ? {} : (stryCov_9fa48("64651"), {
  default: m.AboutPage
})))));
const ContactPage = lazy(stryMutAct_9fa48("64652") ? () => undefined : (stryCov_9fa48("64652"), () => import('./pages/public').then(stryMutAct_9fa48("64654") ? () => undefined : (stryCov_9fa48("64654"), m => stryMutAct_9fa48("64655") ? {} : (stryCov_9fa48("64655"), {
  default: m.ContactPage
})))));
const ManifestoPage = lazy(stryMutAct_9fa48("64656") ? () => undefined : (stryCov_9fa48("64656"), () => import('./pages/public').then(stryMutAct_9fa48("64658") ? () => undefined : (stryCov_9fa48("64658"), m => stryMutAct_9fa48("64659") ? {} : (stryCov_9fa48("64659"), {
  default: m.ManifestoPage
})))));
const DownloadsPage = lazy(stryMutAct_9fa48("64660") ? () => undefined : (stryCov_9fa48("64660"), () => import('./pages/public').then(stryMutAct_9fa48("64662") ? () => undefined : (stryCov_9fa48("64662"), m => stryMutAct_9fa48("64663") ? {} : (stryCov_9fa48("64663"), {
  default: m.DownloadsPage
})))));
const LicensePage = lazy(stryMutAct_9fa48("64664") ? () => undefined : (stryCov_9fa48("64664"), () => import('./pages/public').then(stryMutAct_9fa48("64666") ? () => undefined : (stryCov_9fa48("64666"), m => stryMutAct_9fa48("64667") ? {} : (stryCov_9fa48("64667"), {
  default: m.LicensePage
})))));
const SecurityPage = lazy(stryMutAct_9fa48("64668") ? () => undefined : (stryCov_9fa48("64668"), () => import('./pages/public').then(stryMutAct_9fa48("64670") ? () => undefined : (stryCov_9fa48("64670"), m => stryMutAct_9fa48("64671") ? {} : (stryCov_9fa48("64671"), {
  default: m.SecurityPage
})))));
const CookiePolicyPage = lazy(stryMutAct_9fa48("64672") ? () => undefined : (stryCov_9fa48("64672"), () => import('./pages/public').then(stryMutAct_9fa48("64674") ? () => undefined : (stryCov_9fa48("64674"), m => stryMutAct_9fa48("64675") ? {} : (stryCov_9fa48("64675"), {
  default: m.CookiePolicyPage
})))));
const DocsPage = lazy(stryMutAct_9fa48("64676") ? () => undefined : (stryCov_9fa48("64676"), () => import('./pages/public').then(stryMutAct_9fa48("64678") ? () => undefined : (stryCov_9fa48("64678"), m => stryMutAct_9fa48("64679") ? {} : (stryCov_9fa48("64679"), {
  default: m.DocsPage
})))));
const BlogPage = lazy(stryMutAct_9fa48("64680") ? () => undefined : (stryCov_9fa48("64680"), () => import('./pages/public').then(stryMutAct_9fa48("64682") ? () => undefined : (stryCov_9fa48("64682"), m => stryMutAct_9fa48("64683") ? {} : (stryCov_9fa48("64683"), {
  default: m.BlogPage
})))));
const ChangelogPage = lazy(stryMutAct_9fa48("64684") ? () => undefined : (stryCov_9fa48("64684"), () => import('./pages/public').then(stryMutAct_9fa48("64686") ? () => undefined : (stryCov_9fa48("64686"), m => stryMutAct_9fa48("64687") ? {} : (stryCov_9fa48("64687"), {
  default: m.ChangelogPage
})))));
const SupportPage = lazy(stryMutAct_9fa48("64688") ? () => undefined : (stryCov_9fa48("64688"), () => import('./pages/public').then(stryMutAct_9fa48("64690") ? () => undefined : (stryCov_9fa48("64690"), m => stryMutAct_9fa48("64691") ? {} : (stryCov_9fa48("64691"), {
  default: m.SupportPage
})))));
const IntegrationsPage = lazy(stryMutAct_9fa48("64692") ? () => undefined : (stryCov_9fa48("64692"), () => import('./pages/public').then(stryMutAct_9fa48("64694") ? () => undefined : (stryCov_9fa48("64694"), m => stryMutAct_9fa48("64695") ? {} : (stryCov_9fa48("64695"), {
  default: m.IntegrationsPage
})))));
const DemoRequestPage = lazy(stryMutAct_9fa48("64696") ? () => undefined : (stryCov_9fa48("64696"), () => import('./pages/public').then(stryMutAct_9fa48("64698") ? () => undefined : (stryCov_9fa48("64698"), m => stryMutAct_9fa48("64699") ? {} : (stryCov_9fa48("64699"), {
  default: m.DemoRequestPage
})))));
const ShowcasesPage = lazy(stryMutAct_9fa48("64700") ? () => undefined : (stryCov_9fa48("64700"), () => import('./pages/public/ShowcasesPage')));
const ServicesPage = lazy(stryMutAct_9fa48("64702") ? () => undefined : (stryCov_9fa48("64702"), () => import('./pages/public/services-packages').then(stryMutAct_9fa48("64704") ? () => undefined : (stryCov_9fa48("64704"), m => stryMutAct_9fa48("64705") ? {} : (stryCov_9fa48("64705"), {
  default: m.ServicesPage
})))));
const PackagesPage = lazy(stryMutAct_9fa48("64706") ? () => undefined : (stryCov_9fa48("64706"), () => import('./pages/public/services-packages').then(stryMutAct_9fa48("64708") ? () => undefined : (stryCov_9fa48("64708"), m => stryMutAct_9fa48("64709") ? {} : (stryCov_9fa48("64709"), {
  default: m.PackagesPage
})))));
const HonestyMatricesPage = lazy(stryMutAct_9fa48("64710") ? () => undefined : (stryCov_9fa48("64710"), () => import('./pages/public/HonestyMatricesPage')));
const SovereignEnterpriseIntelligencePage = lazy(stryMutAct_9fa48("64712") ? () => undefined : (stryCov_9fa48("64712"), () => import('./pages/public/SovereignEnterpriseIntelligencePage')));

// Legal
const PrivacyPolicyPage = lazy(stryMutAct_9fa48("64714") ? () => undefined : (stryCov_9fa48("64714"), () => import('./pages/legal').then(stryMutAct_9fa48("64716") ? () => undefined : (stryCov_9fa48("64716"), m => stryMutAct_9fa48("64717") ? {} : (stryCov_9fa48("64717"), {
  default: m.PrivacyPolicyPage
})))));
const TermsPage = lazy(stryMutAct_9fa48("64718") ? () => undefined : (stryCov_9fa48("64718"), () => import('./pages/legal').then(stryMutAct_9fa48("64720") ? () => undefined : (stryCov_9fa48("64720"), m => stryMutAct_9fa48("64721") ? {} : (stryCov_9fa48("64721"), {
  default: m.TermsPage
})))));

// Pricing
const PricingPage = lazy(stryMutAct_9fa48("64722") ? () => undefined : (stryCov_9fa48("64722"), () => import('./pages/pricing').then(stryMutAct_9fa48("64724") ? () => undefined : (stryCov_9fa48("64724"), m => stryMutAct_9fa48("64725") ? {} : (stryCov_9fa48("64725"), {
  default: m.PricingPage
})))));

// Auth Pages
const LoginPage = lazy(stryMutAct_9fa48("64726") ? () => undefined : (stryCov_9fa48("64726"), () => import('./pages/auth/LoginPage').then(stryMutAct_9fa48("64728") ? () => undefined : (stryCov_9fa48("64728"), m => stryMutAct_9fa48("64729") ? {} : (stryCov_9fa48("64729"), {
  default: m.LoginPage
})))));
const RegisterPage = lazy(stryMutAct_9fa48("64730") ? () => undefined : (stryCov_9fa48("64730"), () => import('./pages/auth/RegisterPage').then(stryMutAct_9fa48("64732") ? () => undefined : (stryCov_9fa48("64732"), m => stryMutAct_9fa48("64733") ? {} : (stryCov_9fa48("64733"), {
  default: m.RegisterPage
})))));
const ForgotPasswordPage = lazy(stryMutAct_9fa48("64734") ? () => undefined : (stryCov_9fa48("64734"), () => import('./pages/auth/ForgotPasswordPage').then(stryMutAct_9fa48("64736") ? () => undefined : (stryCov_9fa48("64736"), m => stryMutAct_9fa48("64737") ? {} : (stryCov_9fa48("64737"), {
  default: m.ForgotPasswordPage
})))));
const ResetPasswordPage = lazy(stryMutAct_9fa48("64738") ? () => undefined : (stryCov_9fa48("64738"), () => import('./pages/auth/ResetPasswordPage').then(stryMutAct_9fa48("64740") ? () => undefined : (stryCov_9fa48("64740"), m => stryMutAct_9fa48("64741") ? {} : (stryCov_9fa48("64741"), {
  default: m.ResetPasswordPage
})))));
const VerifyEmailPage = lazy(stryMutAct_9fa48("64742") ? () => undefined : (stryCov_9fa48("64742"), () => import('./pages/auth/VerifyEmailPage').then(stryMutAct_9fa48("64744") ? () => undefined : (stryCov_9fa48("64744"), m => stryMutAct_9fa48("64745") ? {} : (stryCov_9fa48("64745"), {
  default: m.VerifyEmailPage
})))));

// Cortex Main Pages
const DashboardPage = lazy(stryMutAct_9fa48("64746") ? () => undefined : (stryCov_9fa48("64746"), () => import('./pages/cortex/DashboardPage').then(stryMutAct_9fa48("64748") ? () => undefined : (stryCov_9fa48("64748"), m => stryMutAct_9fa48("64749") ? {} : (stryCov_9fa48("64749"), {
  default: m.DashboardPage
})))));
const GraphExplorerPage = lazy(stryMutAct_9fa48("64750") ? () => undefined : (stryCov_9fa48("64750"), () => import('./pages/cortex/graph/GraphExplorerPage').then(stryMutAct_9fa48("64752") ? () => undefined : (stryCov_9fa48("64752"), m => stryMutAct_9fa48("64753") ? {} : (stryCov_9fa48("64753"), {
  default: m.GraphExplorerPage
})))));
const CouncilPage = lazy(stryMutAct_9fa48("64754") ? () => undefined : (stryCov_9fa48("64754"), () => import('./pages/cortex/council/CouncilPage').then(stryMutAct_9fa48("64756") ? () => undefined : (stryCov_9fa48("64756"), m => stryMutAct_9fa48("64757") ? {} : (stryCov_9fa48("64757"), {
  default: m.CouncilPage
})))));
const PulsePage = lazy(stryMutAct_9fa48("64758") ? () => undefined : (stryCov_9fa48("64758"), () => import('./pages/cortex/pulse/PulsePage').then(stryMutAct_9fa48("64760") ? () => undefined : (stryCov_9fa48("64760"), m => stryMutAct_9fa48("64761") ? {} : (stryCov_9fa48("64761"), {
  default: m.PulsePage
})))));
const LensPage = lazy(stryMutAct_9fa48("64762") ? () => undefined : (stryCov_9fa48("64762"), () => import('./pages/cortex/lens/LensPage').then(stryMutAct_9fa48("64764") ? () => undefined : (stryCov_9fa48("64764"), m => stryMutAct_9fa48("64765") ? {} : (stryCov_9fa48("64765"), {
  default: m.LensPage
})))));
const BridgePage = lazy(stryMutAct_9fa48("64766") ? () => undefined : (stryCov_9fa48("64766"), () => import('./pages/cortex/bridge/BridgePage').then(stryMutAct_9fa48("64768") ? () => undefined : (stryCov_9fa48("64768"), m => stryMutAct_9fa48("64769") ? {} : (stryCov_9fa48("64769"), {
  default: m.BridgePage
})))));

// Cortex Sub-Pages
const LineageViewPage = lazy(stryMutAct_9fa48("64770") ? () => undefined : (stryCov_9fa48("64770"), () => import('./pages/cortex/graph/subpages').then(stryMutAct_9fa48("64772") ? () => undefined : (stryCov_9fa48("64772"), m => stryMutAct_9fa48("64773") ? {} : (stryCov_9fa48("64773"), {
  default: m.LineageViewPage
})))));
const EntityDetailsPage = lazy(stryMutAct_9fa48("64774") ? () => undefined : (stryCov_9fa48("64774"), () => import('./pages/cortex/graph/subpages').then(stryMutAct_9fa48("64776") ? () => undefined : (stryCov_9fa48("64776"), m => stryMutAct_9fa48("64777") ? {} : (stryCov_9fa48("64777"), {
  default: m.EntityDetailsPage
})))));
const DeliberationViewPage = lazy(stryMutAct_9fa48("64778") ? () => undefined : (stryCov_9fa48("64778"), () => import('./pages/cortex/council/subpages').then(stryMutAct_9fa48("64780") ? () => undefined : (stryCov_9fa48("64780"), m => stryMutAct_9fa48("64781") ? {} : (stryCov_9fa48("64781"), {
  default: m.DeliberationViewPage
})))));
const AgentProfilePage = lazy(stryMutAct_9fa48("64782") ? () => undefined : (stryCov_9fa48("64782"), () => import('./pages/cortex/council/subpages').then(stryMutAct_9fa48("64784") ? () => undefined : (stryCov_9fa48("64784"), m => stryMutAct_9fa48("64785") ? {} : (stryCov_9fa48("64785"), {
  default: m.AgentProfilePage
})))));
const AlertsPage = lazy(stryMutAct_9fa48("64786") ? () => undefined : (stryCov_9fa48("64786"), () => import('./pages/cortex/pulse/subpages').then(stryMutAct_9fa48("64788") ? () => undefined : (stryCov_9fa48("64788"), m => stryMutAct_9fa48("64789") ? {} : (stryCov_9fa48("64789"), {
  default: m.AlertsPage
})))));
const MetricsPage = lazy(stryMutAct_9fa48("64790") ? () => undefined : (stryCov_9fa48("64790"), () => import('./pages/cortex/pulse/subpages').then(stryMutAct_9fa48("64792") ? () => undefined : (stryCov_9fa48("64792"), m => stryMutAct_9fa48("64793") ? {} : (stryCov_9fa48("64793"), {
  default: m.MetricsPage
})))));
const ForecastDetailsPage = lazy(stryMutAct_9fa48("64794") ? () => undefined : (stryCov_9fa48("64794"), () => import('./pages/cortex/lens/subpages').then(stryMutAct_9fa48("64796") ? () => undefined : (stryCov_9fa48("64796"), m => stryMutAct_9fa48("64797") ? {} : (stryCov_9fa48("64797"), {
  default: m.ForecastDetailsPage
})))));
const ScenarioDetailsPage = lazy(stryMutAct_9fa48("64798") ? () => undefined : (stryCov_9fa48("64798"), () => import('./pages/cortex/lens/subpages').then(stryMutAct_9fa48("64800") ? () => undefined : (stryCov_9fa48("64800"), m => stryMutAct_9fa48("64801") ? {} : (stryCov_9fa48("64801"), {
  default: m.ScenarioDetailsPage
})))));
const ScenarioBuilderPage = lazy(stryMutAct_9fa48("64802") ? () => undefined : (stryCov_9fa48("64802"), () => import('./pages/cortex/lens/subpages').then(stryMutAct_9fa48("64804") ? () => undefined : (stryCov_9fa48("64804"), m => stryMutAct_9fa48("64805") ? {} : (stryCov_9fa48("64805"), {
  default: m.ScenarioBuilderPage
})))));
const WorkflowsListPage = lazy(stryMutAct_9fa48("64806") ? () => undefined : (stryCov_9fa48("64806"), () => import('./pages/cortex/bridge/subpages').then(stryMutAct_9fa48("64808") ? () => undefined : (stryCov_9fa48("64808"), m => stryMutAct_9fa48("64809") ? {} : (stryCov_9fa48("64809"), {
  default: m.WorkflowsListPage
})))));
const WorkflowBuilderPage = lazy(stryMutAct_9fa48("64810") ? () => undefined : (stryCov_9fa48("64810"), () => import('./pages/cortex/bridge/subpages').then(stryMutAct_9fa48("64812") ? () => undefined : (stryCov_9fa48("64812"), m => stryMutAct_9fa48("64813") ? {} : (stryCov_9fa48("64813"), {
  default: m.WorkflowBuilderPage
})))));
const ApprovalsPage = lazy(stryMutAct_9fa48("64814") ? () => undefined : (stryCov_9fa48("64814"), () => import('./pages/cortex/bridge/subpages').then(stryMutAct_9fa48("64816") ? () => undefined : (stryCov_9fa48("64816"), m => stryMutAct_9fa48("64817") ? {} : (stryCov_9fa48("64817"), {
  default: m.ApprovalsPage
})))));
const BridgeIntegrationsPage = lazy(stryMutAct_9fa48("64818") ? () => undefined : (stryCov_9fa48("64818"), () => import('./pages/cortex/bridge/subpages').then(stryMutAct_9fa48("64820") ? () => undefined : (stryCov_9fa48("64820"), m => stryMutAct_9fa48("64821") ? {} : (stryCov_9fa48("64821"), {
  default: m.BridgeIntegrationsPage
})))));

// Pillar Pages
const HelmPage = lazy(stryMutAct_9fa48("64822") ? () => undefined : (stryCov_9fa48("64822"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64824") ? () => undefined : (stryCov_9fa48("64824"), m => stryMutAct_9fa48("64825") ? {} : (stryCov_9fa48("64825"), {
  default: m.HelmPage
})))));
const LineagePage = lazy(stryMutAct_9fa48("64826") ? () => undefined : (stryCov_9fa48("64826"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64828") ? () => undefined : (stryCov_9fa48("64828"), m => stryMutAct_9fa48("64829") ? {} : (stryCov_9fa48("64829"), {
  default: m.LineagePage
})))));
const PredictPage = lazy(stryMutAct_9fa48("64830") ? () => undefined : (stryCov_9fa48("64830"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64832") ? () => undefined : (stryCov_9fa48("64832"), m => stryMutAct_9fa48("64833") ? {} : (stryCov_9fa48("64833"), {
  default: m.PredictPage
})))));
const FlowPage = lazy(stryMutAct_9fa48("64834") ? () => undefined : (stryCov_9fa48("64834"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64836") ? () => undefined : (stryCov_9fa48("64836"), m => stryMutAct_9fa48("64837") ? {} : (stryCov_9fa48("64837"), {
  default: m.FlowPage
})))));
const HealthPage = lazy(stryMutAct_9fa48("64838") ? () => undefined : (stryCov_9fa48("64838"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64840") ? () => undefined : (stryCov_9fa48("64840"), m => stryMutAct_9fa48("64841") ? {} : (stryCov_9fa48("64841"), {
  default: m.HealthPage
})))));
const GuardPage = lazy(stryMutAct_9fa48("64842") ? () => undefined : (stryCov_9fa48("64842"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64844") ? () => undefined : (stryCov_9fa48("64844"), m => stryMutAct_9fa48("64845") ? {} : (stryCov_9fa48("64845"), {
  default: m.GuardPage
})))));
const EthicsPage = lazy(stryMutAct_9fa48("64846") ? () => undefined : (stryCov_9fa48("64846"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64848") ? () => undefined : (stryCov_9fa48("64848"), m => stryMutAct_9fa48("64849") ? {} : (stryCov_9fa48("64849"), {
  default: m.EthicsPage
})))));
const AgentsPage = lazy(stryMutAct_9fa48("64850") ? () => undefined : (stryCov_9fa48("64850"), () => import('./pages/cortex/pillars').then(stryMutAct_9fa48("64852") ? () => undefined : (stryCov_9fa48("64852"), m => stryMutAct_9fa48("64853") ? {} : (stryCov_9fa48("64853"), {
  default: m.AgentsPage
})))));

// Decision Intelligence Pages
const PreMortemPage = lazy(stryMutAct_9fa48("64854") ? () => undefined : (stryCov_9fa48("64854"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64856") ? () => undefined : (stryCov_9fa48("64856"), m => stryMutAct_9fa48("64857") ? {} : (stryCov_9fa48("64857"), {
  default: m.PreMortemPage
})))));
const GhostBoardPage = lazy(stryMutAct_9fa48("64858") ? () => undefined : (stryCov_9fa48("64858"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64860") ? () => undefined : (stryCov_9fa48("64860"), m => stryMutAct_9fa48("64861") ? {} : (stryCov_9fa48("64861"), {
  default: m.GhostBoardPage
})))));
const DecisionDebtPage = lazy(stryMutAct_9fa48("64862") ? () => undefined : (stryCov_9fa48("64862"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64864") ? () => undefined : (stryCov_9fa48("64864"), m => stryMutAct_9fa48("64865") ? {} : (stryCov_9fa48("64865"), {
  default: m.DecisionDebtPage
})))));
const LiveDemoPage = lazy(stryMutAct_9fa48("64866") ? () => undefined : (stryCov_9fa48("64866"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64868") ? () => undefined : (stryCov_9fa48("64868"), m => stryMutAct_9fa48("64869") ? {} : (stryCov_9fa48("64869"), {
  default: m.LiveDemoPage
})))));
const RegulatoryAbsorbPage = lazy(stryMutAct_9fa48("64870") ? () => undefined : (stryCov_9fa48("64870"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64872") ? () => undefined : (stryCov_9fa48("64872"), m => stryMutAct_9fa48("64873") ? {} : (stryCov_9fa48("64873"), {
  default: m.RegulatoryAbsorbPage
})))));
const DecisionDNAPage = lazy(stryMutAct_9fa48("64874") ? () => undefined : (stryCov_9fa48("64874"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64876") ? () => undefined : (stryCov_9fa48("64876"), m => stryMutAct_9fa48("64877") ? {} : (stryCov_9fa48("64877"), {
  default: m.DecisionDNAPage
})))));
const ChronosPage = lazy(stryMutAct_9fa48("64878") ? () => undefined : (stryCov_9fa48("64878"), () => import('./pages/cortex/intelligence').then(stryMutAct_9fa48("64880") ? () => undefined : (stryCov_9fa48("64880"), m => stryMutAct_9fa48("64881") ? {} : (stryCov_9fa48("64881"), {
  default: m.ChronosPage
})))));

// Enterprise Suite Pages
const SovereignPage = lazy(stryMutAct_9fa48("64882") ? () => undefined : (stryCov_9fa48("64882"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64884") ? () => undefined : (stryCov_9fa48("64884"), m => stryMutAct_9fa48("64885") ? {} : (stryCov_9fa48("64885"), {
  default: m.SovereignPage
})))));
const PersonaForgePage = lazy(stryMutAct_9fa48("64886") ? () => undefined : (stryCov_9fa48("64886"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64888") ? () => undefined : (stryCov_9fa48("64888"), m => stryMutAct_9fa48("64889") ? {} : (stryCov_9fa48("64889"), {
  default: m.PersonaForgePage
})))));
const MeshPage = lazy(stryMutAct_9fa48("64890") ? () => undefined : (stryCov_9fa48("64890"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64892") ? () => undefined : (stryCov_9fa48("64892"), m => stryMutAct_9fa48("64893") ? {} : (stryCov_9fa48("64893"), {
  default: m.MeshPage
})))));
const GovernPage = lazy(stryMutAct_9fa48("64894") ? () => undefined : (stryCov_9fa48("64894"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64896") ? () => undefined : (stryCov_9fa48("64896"), m => stryMutAct_9fa48("64897") ? {} : (stryCov_9fa48("64897"), {
  default: m.GovernPage
})))));
const VoicePage = lazy(stryMutAct_9fa48("64898") ? () => undefined : (stryCov_9fa48("64898"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64900") ? () => undefined : (stryCov_9fa48("64900"), m => stryMutAct_9fa48("64901") ? {} : (stryCov_9fa48("64901"), {
  default: m.VoicePage
})))));
const AutopilotPage = lazy(stryMutAct_9fa48("64902") ? () => undefined : (stryCov_9fa48("64902"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64904") ? () => undefined : (stryCov_9fa48("64904"), m => stryMutAct_9fa48("64905") ? {} : (stryCov_9fa48("64905"), {
  default: m.AutopilotPage
})))));
const GenomicsPage = lazy(stryMutAct_9fa48("64906") ? () => undefined : (stryCov_9fa48("64906"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64908") ? () => undefined : (stryCov_9fa48("64908"), m => stryMutAct_9fa48("64909") ? {} : (stryCov_9fa48("64909"), {
  default: m.GenomicsPage
})))));
const DefenseStackPage = lazy(stryMutAct_9fa48("64910") ? () => undefined : (stryCov_9fa48("64910"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64912") ? () => undefined : (stryCov_9fa48("64912"), m => stryMutAct_9fa48("64913") ? {} : (stryCov_9fa48("64913"), {
  default: m.DefenseStackPage
})))));
const OmniTranslatePage = lazy(stryMutAct_9fa48("64914") ? () => undefined : (stryCov_9fa48("64914"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64916") ? () => undefined : (stryCov_9fa48("64916"), m => stryMutAct_9fa48("64917") ? {} : (stryCov_9fa48("64917"), {
  default: m.OmniTranslatePage
})))));
const VetoPage = lazy(stryMutAct_9fa48("64918") ? () => undefined : (stryCov_9fa48("64918"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64920") ? () => undefined : (stryCov_9fa48("64920"), m => stryMutAct_9fa48("64921") ? {} : (stryCov_9fa48("64921"), {
  default: m.VetoPage
})))));
const UnionPage = lazy(stryMutAct_9fa48("64922") ? () => undefined : (stryCov_9fa48("64922"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64924") ? () => undefined : (stryCov_9fa48("64924"), m => stryMutAct_9fa48("64925") ? {} : (stryCov_9fa48("64925"), {
  default: m.UnionPage
})))));
const LedgerPage = lazy(stryMutAct_9fa48("64926") ? () => undefined : (stryCov_9fa48("64926"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64928") ? () => undefined : (stryCov_9fa48("64928"), m => stryMutAct_9fa48("64929") ? {} : (stryCov_9fa48("64929"), {
  default: m.LedgerPage
})))));
const ApotheosisPage = lazy(stryMutAct_9fa48("64930") ? () => undefined : (stryCov_9fa48("64930"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64932") ? () => undefined : (stryCov_9fa48("64932"), m => stryMutAct_9fa48("64933") ? {} : (stryCov_9fa48("64933"), {
  default: m.ApotheosisPage
})))));
const DissentPage = lazy(stryMutAct_9fa48("64934") ? () => undefined : (stryCov_9fa48("64934"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64936") ? () => undefined : (stryCov_9fa48("64936"), m => stryMutAct_9fa48("64937") ? {} : (stryCov_9fa48("64937"), {
  default: m.DissentPage
})))));
const CrisisManagementPage = lazy(stryMutAct_9fa48("64938") ? () => undefined : (stryCov_9fa48("64938"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64940") ? () => undefined : (stryCov_9fa48("64940"), m => stryMutAct_9fa48("64941") ? {} : (stryCov_9fa48("64941"), {
  default: m.CrisisManagementPage
})))));
const AuditWorkflowPage = lazy(stryMutAct_9fa48("64942") ? () => undefined : (stryCov_9fa48("64942"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64944") ? () => undefined : (stryCov_9fa48("64944"), m => stryMutAct_9fa48("64945") ? {} : (stryCov_9fa48("64945"), {
  default: m.AuditWorkflowPage
})))));
const TrainingPage = lazy(stryMutAct_9fa48("64946") ? () => undefined : (stryCov_9fa48("64946"), () => import('./pages/cortex/enterprise').then(stryMutAct_9fa48("64948") ? () => undefined : (stryCov_9fa48("64948"), m => stryMutAct_9fa48("64949") ? {} : (stryCov_9fa48("64949"), {
  default: m.TrainingPage
})))));

// Sovereign Tier Pages
const CruciblePage = lazy(stryMutAct_9fa48("64950") ? () => undefined : (stryCov_9fa48("64950"), () => import('./pages/sovereign/CruciblePage').then(stryMutAct_9fa48("64952") ? () => undefined : (stryCov_9fa48("64952"), m => stryMutAct_9fa48("64953") ? {} : (stryCov_9fa48("64953"), {
  default: m.CruciblePage
})))));
const PanopticonPage = lazy(stryMutAct_9fa48("64954") ? () => undefined : (stryCov_9fa48("64954"), () => import('./pages/sovereign/PanopticonPage').then(stryMutAct_9fa48("64956") ? () => undefined : (stryCov_9fa48("64956"), m => stryMutAct_9fa48("64957") ? {} : (stryCov_9fa48("64957"), {
  default: m.PanopticonPage
})))));
const AegisPage = lazy(stryMutAct_9fa48("64958") ? () => undefined : (stryCov_9fa48("64958"), () => import('./pages/sovereign/AegisPage').then(stryMutAct_9fa48("64960") ? () => undefined : (stryCov_9fa48("64960"), m => stryMutAct_9fa48("64961") ? {} : (stryCov_9fa48("64961"), {
  default: m.AegisPage
})))));
const EternalPage = lazy(stryMutAct_9fa48("64962") ? () => undefined : (stryCov_9fa48("64962"), () => import('./pages/sovereign/EternalPage').then(stryMutAct_9fa48("64964") ? () => undefined : (stryCov_9fa48("64964"), m => stryMutAct_9fa48("64965") ? {} : (stryCov_9fa48("64965"), {
  default: m.EternalPage
})))));
const SymbiontPage = lazy(stryMutAct_9fa48("64966") ? () => undefined : (stryCov_9fa48("64966"), () => import('./pages/sovereign/SymbiontPage').then(stryMutAct_9fa48("64968") ? () => undefined : (stryCov_9fa48("64968"), m => stryMutAct_9fa48("64969") ? {} : (stryCov_9fa48("64969"), {
  default: m.SymbiontPage
})))));
const VoxPage = lazy(stryMutAct_9fa48("64970") ? () => undefined : (stryCov_9fa48("64970"), () => import('./pages/sovereign/VoxPage').then(stryMutAct_9fa48("64972") ? () => undefined : (stryCov_9fa48("64972"), m => stryMutAct_9fa48("64973") ? {} : (stryCov_9fa48("64973"), {
  default: m.VoxPage
})))));

// Crown Jewels - Premium Enterprise Services
const EchoPage = lazy(stryMutAct_9fa48("64974") ? () => undefined : (stryCov_9fa48("64974"), () => import('./pages/cortex/crown').then(stryMutAct_9fa48("64976") ? () => undefined : (stryCov_9fa48("64976"), m => stryMutAct_9fa48("64977") ? {} : (stryCov_9fa48("64977"), {
  default: m.EchoPage
})))));
const RedTeamPage = lazy(stryMutAct_9fa48("64978") ? () => undefined : (stryCov_9fa48("64978"), () => import('./pages/cortex/crown').then(stryMutAct_9fa48("64980") ? () => undefined : (stryCov_9fa48("64980"), m => stryMutAct_9fa48("64981") ? {} : (stryCov_9fa48("64981"), {
  default: m.RedTeamPage
})))));
const GnosisPage = lazy(stryMutAct_9fa48("64982") ? () => undefined : (stryCov_9fa48("64982"), () => import('./pages/cortex/crown').then(stryMutAct_9fa48("64984") ? () => undefined : (stryCov_9fa48("64984"), m => stryMutAct_9fa48("64985") ? {} : (stryCov_9fa48("64985"), {
  default: m.GnosisPage
})))));

// Data Pages
const DataSourcesPage = lazy(stryMutAct_9fa48("64986") ? () => undefined : (stryCov_9fa48("64986"), () => import('./pages/cortex/data').then(stryMutAct_9fa48("64988") ? () => undefined : (stryCov_9fa48("64988"), m => stryMutAct_9fa48("64989") ? {} : (stryCov_9fa48("64989"), {
  default: m.DataSourcesPage
})))));
const DataCatalogPage = lazy(stryMutAct_9fa48("64990") ? () => undefined : (stryCov_9fa48("64990"), () => import('./pages/cortex/data').then(stryMutAct_9fa48("64992") ? () => undefined : (stryCov_9fa48("64992"), m => stryMutAct_9fa48("64993") ? {} : (stryCov_9fa48("64993"), {
  default: m.DataCatalogPage
})))));
const DataQualityPage = lazy(stryMutAct_9fa48("64994") ? () => undefined : (stryCov_9fa48("64994"), () => import('./pages/cortex/data').then(stryMutAct_9fa48("64996") ? () => undefined : (stryCov_9fa48("64996"), m => stryMutAct_9fa48("64997") ? {} : (stryCov_9fa48("64997"), {
  default: m.DataQualityPage
})))));
const DataImportExportPage = lazy(stryMutAct_9fa48("64998") ? () => undefined : (stryCov_9fa48("64998"), () => import('./pages/cortex/data').then(stryMutAct_9fa48("65000") ? () => undefined : (stryCov_9fa48("65000"), m => stryMutAct_9fa48("65001") ? {} : (stryCov_9fa48("65001"), {
  default: m.DataImportExportPage
})))));

// Security Pages
const SecurityOverviewPage = lazy(stryMutAct_9fa48("65002") ? () => undefined : (stryCov_9fa48("65002"), () => import('./pages/cortex/security').then(stryMutAct_9fa48("65004") ? () => undefined : (stryCov_9fa48("65004"), m => stryMutAct_9fa48("65005") ? {} : (stryCov_9fa48("65005"), {
  default: m.SecurityOverviewPage
})))));
const AccessControlPage = lazy(stryMutAct_9fa48("65006") ? () => undefined : (stryCov_9fa48("65006"), () => import('./pages/cortex/security').then(stryMutAct_9fa48("65008") ? () => undefined : (stryCov_9fa48("65008"), m => stryMutAct_9fa48("65009") ? {} : (stryCov_9fa48("65009"), {
  default: m.AccessControlPage
})))));
const AuditLogPage = lazy(stryMutAct_9fa48("65010") ? () => undefined : (stryCov_9fa48("65010"), () => import('./pages/cortex/security').then(stryMutAct_9fa48("65012") ? () => undefined : (stryCov_9fa48("65012"), m => stryMutAct_9fa48("65013") ? {} : (stryCov_9fa48("65013"), {
  default: m.AuditLogPage
})))));
const SecurityPoliciesPage = lazy(stryMutAct_9fa48("65014") ? () => undefined : (stryCov_9fa48("65014"), () => import('./pages/cortex/security').then(stryMutAct_9fa48("65016") ? () => undefined : (stryCov_9fa48("65016"), m => stryMutAct_9fa48("65017") ? {} : (stryCov_9fa48("65017"), {
  default: m.SecurityPoliciesPage
})))));

// Settings Pages
const OrganizationSettingsPage = lazy(stryMutAct_9fa48("65018") ? () => undefined : (stryCov_9fa48("65018"), () => import('./pages/settings').then(stryMutAct_9fa48("65020") ? () => undefined : (stryCov_9fa48("65020"), m => stryMutAct_9fa48("65021") ? {} : (stryCov_9fa48("65021"), {
  default: m.OrganizationSettingsPage
})))));
const UsersSettingsPage = lazy(stryMutAct_9fa48("65022") ? () => undefined : (stryCov_9fa48("65022"), () => import('./pages/settings').then(stryMutAct_9fa48("65024") ? () => undefined : (stryCov_9fa48("65024"), m => stryMutAct_9fa48("65025") ? {} : (stryCov_9fa48("65025"), {
  default: m.UsersSettingsPage
})))));
const TeamsSettingsPage = lazy(stryMutAct_9fa48("65026") ? () => undefined : (stryCov_9fa48("65026"), () => import('./pages/settings').then(stryMutAct_9fa48("65028") ? () => undefined : (stryCov_9fa48("65028"), m => stryMutAct_9fa48("65029") ? {} : (stryCov_9fa48("65029"), {
  default: m.TeamsSettingsPage
})))));
const RolesSettingsPage = lazy(stryMutAct_9fa48("65030") ? () => undefined : (stryCov_9fa48("65030"), () => import('./pages/settings').then(stryMutAct_9fa48("65032") ? () => undefined : (stryCov_9fa48("65032"), m => stryMutAct_9fa48("65033") ? {} : (stryCov_9fa48("65033"), {
  default: m.RolesSettingsPage
})))));
const BillingSettingsPage = lazy(stryMutAct_9fa48("65034") ? () => undefined : (stryCov_9fa48("65034"), () => import('./pages/settings').then(stryMutAct_9fa48("65036") ? () => undefined : (stryCov_9fa48("65036"), m => stryMutAct_9fa48("65037") ? {} : (stryCov_9fa48("65037"), {
  default: m.BillingSettingsPage
})))));
const ApiKeysSettingsPage = lazy(stryMutAct_9fa48("65038") ? () => undefined : (stryCov_9fa48("65038"), () => import('./pages/settings').then(stryMutAct_9fa48("65040") ? () => undefined : (stryCov_9fa48("65040"), m => stryMutAct_9fa48("65041") ? {} : (stryCov_9fa48("65041"), {
  default: m.ApiKeysSettingsPage
})))));
const IntegrationSettingsPage = lazy(stryMutAct_9fa48("65042") ? () => undefined : (stryCov_9fa48("65042"), () => import('./pages/settings').then(stryMutAct_9fa48("65044") ? () => undefined : (stryCov_9fa48("65044"), m => stryMutAct_9fa48("65045") ? {} : (stryCov_9fa48("65045"), {
  default: m.IntegrationSettingsPage
})))));
const PreferencesSettingsPage = lazy(stryMutAct_9fa48("65046") ? () => undefined : (stryCov_9fa48("65046"), () => import('./pages/settings').then(stryMutAct_9fa48("65048") ? () => undefined : (stryCov_9fa48("65048"), m => stryMutAct_9fa48("65049") ? {} : (stryCov_9fa48("65049"), {
  default: m.PreferencesSettingsPage
})))));
const SettingsSecurityPage = lazy(stryMutAct_9fa48("65050") ? () => undefined : (stryCov_9fa48("65050"), () => import('./pages/settings').then(stryMutAct_9fa48("65052") ? () => undefined : (stryCov_9fa48("65052"), m => stryMutAct_9fa48("65053") ? {} : (stryCov_9fa48("65053"), {
  default: m.SecuritySettingsPage
})))));

// Admin Pages
const AdminDashboardPage = lazy(stryMutAct_9fa48("65054") ? () => undefined : (stryCov_9fa48("65054"), () => import('./pages/admin').then(stryMutAct_9fa48("65056") ? () => undefined : (stryCov_9fa48("65056"), m => stryMutAct_9fa48("65057") ? {} : (stryCov_9fa48("65057"), {
  default: m.AdminDashboardPage
})))));
const TenantsPage = lazy(stryMutAct_9fa48("65058") ? () => undefined : (stryCov_9fa48("65058"), () => import('./pages/admin').then(stryMutAct_9fa48("65060") ? () => undefined : (stryCov_9fa48("65060"), m => stryMutAct_9fa48("65061") ? {} : (stryCov_9fa48("65061"), {
  default: m.TenantsPage
})))));
const LicensesPage = lazy(stryMutAct_9fa48("65062") ? () => undefined : (stryCov_9fa48("65062"), () => import('./pages/admin').then(stryMutAct_9fa48("65064") ? () => undefined : (stryCov_9fa48("65064"), m => stryMutAct_9fa48("65065") ? {} : (stryCov_9fa48("65065"), {
  default: m.LicensesPage
})))));
const UsageAnalyticsPage = lazy(stryMutAct_9fa48("65066") ? () => undefined : (stryCov_9fa48("65066"), () => import('./pages/admin').then(stryMutAct_9fa48("65068") ? () => undefined : (stryCov_9fa48("65068"), m => stryMutAct_9fa48("65069") ? {} : (stryCov_9fa48("65069"), {
  default: m.UsageAnalyticsPage
})))));
const SystemHealthPage = lazy(stryMutAct_9fa48("65070") ? () => undefined : (stryCov_9fa48("65070"), () => import('./pages/admin').then(stryMutAct_9fa48("65072") ? () => undefined : (stryCov_9fa48("65072"), m => stryMutAct_9fa48("65073") ? {} : (stryCov_9fa48("65073"), {
  default: m.SystemHealthPage
})))));
const FeatureFlagsPage = lazy(stryMutAct_9fa48("65074") ? () => undefined : (stryCov_9fa48("65074"), () => import('./pages/admin').then(stryMutAct_9fa48("65076") ? () => undefined : (stryCov_9fa48("65076"), m => stryMutAct_9fa48("65077") ? {} : (stryCov_9fa48("65077"), {
  default: m.FeatureFlagsPage
})))));
const AdminDataSourcesPage = lazy(stryMutAct_9fa48("65078") ? () => undefined : (stryCov_9fa48("65078"), () => import('./pages/admin').then(stryMutAct_9fa48("65080") ? () => undefined : (stryCov_9fa48("65080"), m => stryMutAct_9fa48("65081") ? {} : (stryCov_9fa48("65081"), {
  default: m.DataSourcesPage
})))));
const ModeAnalytics = lazy(stryMutAct_9fa48("65082") ? () => undefined : (stryCov_9fa48("65082"), () => import('./pages/admin/ModeAnalytics')));
const RDLabPage = lazy(stryMutAct_9fa48("65084") ? () => undefined : (stryCov_9fa48("65084"), () => import('./pages/admin/RDLabPage').then(stryMutAct_9fa48("65086") ? () => undefined : (stryCov_9fa48("65086"), m => stryMutAct_9fa48("65087") ? {} : (stryCov_9fa48("65087"), {
  default: m.RDLabPage
})))));
const CorePage = lazy(stryMutAct_9fa48("65088") ? () => undefined : (stryCov_9fa48("65088"), () => import('./pages/admin/CorePage')));
const ControlCenterPage = lazy(stryMutAct_9fa48("65090") ? () => undefined : (stryCov_9fa48("65090"), () => import('./pages/admin/ControlCenterPage').then(stryMutAct_9fa48("65092") ? () => undefined : (stryCov_9fa48("65092"), m => stryMutAct_9fa48("65093") ? {} : (stryCov_9fa48("65093"), {
  default: m.ControlCenterPage
})))));
const AdminAIPage = lazy(stryMutAct_9fa48("65094") ? () => undefined : (stryCov_9fa48("65094"), () => import('./pages/admin/AdminAIPage').then(stryMutAct_9fa48("65096") ? () => undefined : (stryCov_9fa48("65096"), m => stryMutAct_9fa48("65097") ? {} : (stryCov_9fa48("65097"), {
  default: m.AdminAIPage
})))));
const SovereignStackPage = lazy(stryMutAct_9fa48("65098") ? () => undefined : (stryCov_9fa48("65098"), () => import('./pages/admin/SovereignStackPage')));

// Tools
const ROICalculator = lazy(stryMutAct_9fa48("65100") ? () => undefined : (stryCov_9fa48("65100"), () => import('./pages/tools').then(stryMutAct_9fa48("65102") ? () => undefined : (stryCov_9fa48("65102"), m => stryMutAct_9fa48("65103") ? {} : (stryCov_9fa48("65103"), {
  default: m.ROICalculator
})))));

// Onboarding
const OnboardingWizard = lazy(stryMutAct_9fa48("65104") ? () => undefined : (stryCov_9fa48("65104"), () => import('./pages/onboarding').then(stryMutAct_9fa48("65106") ? () => undefined : (stryCov_9fa48("65106"), m => stryMutAct_9fa48("65107") ? {} : (stryCov_9fa48("65107"), {
  default: m.OnboardingWizard
})))));

// Verticals
const VerticalsHubPage = lazy(stryMutAct_9fa48("65108") ? () => undefined : (stryCov_9fa48("65108"), () => import('./pages/verticals').then(stryMutAct_9fa48("65110") ? () => undefined : (stryCov_9fa48("65110"), m => stryMutAct_9fa48("65111") ? {} : (stryCov_9fa48("65111"), {
  default: m.VerticalsHubPage
})))));
const HealthcarePage = lazy(stryMutAct_9fa48("65112") ? () => undefined : (stryCov_9fa48("65112"), () => import('./pages/verticals').then(stryMutAct_9fa48("65114") ? () => undefined : (stryCov_9fa48("65114"), m => stryMutAct_9fa48("65115") ? {} : (stryCov_9fa48("65115"), {
  default: m.HealthcarePage
})))));
const FinancialServicesPage = lazy(stryMutAct_9fa48("65116") ? () => undefined : (stryCov_9fa48("65116"), () => import('./pages/verticals').then(stryMutAct_9fa48("65118") ? () => undefined : (stryCov_9fa48("65118"), m => stryMutAct_9fa48("65119") ? {} : (stryCov_9fa48("65119"), {
  default: m.FinancialServicesPage
})))));
const GovernmentLegalPage = lazy(stryMutAct_9fa48("65120") ? () => undefined : (stryCov_9fa48("65120"), () => import('./pages/verticals').then(stryMutAct_9fa48("65122") ? () => undefined : (stryCov_9fa48("65122"), m => stryMutAct_9fa48("65123") ? {} : (stryCov_9fa48("65123"), {
  default: m.GovernmentLegalPage
})))));
const InsurancePage = lazy(stryMutAct_9fa48("65124") ? () => undefined : (stryCov_9fa48("65124"), () => import('./pages/verticals').then(stryMutAct_9fa48("65126") ? () => undefined : (stryCov_9fa48("65126"), m => stryMutAct_9fa48("65127") ? {} : (stryCov_9fa48("65127"), {
  default: m.InsurancePage
})))));
const PharmaceuticalPage = lazy(stryMutAct_9fa48("65128") ? () => undefined : (stryCov_9fa48("65128"), () => import('./pages/verticals').then(stryMutAct_9fa48("65130") ? () => undefined : (stryCov_9fa48("65130"), m => stryMutAct_9fa48("65131") ? {} : (stryCov_9fa48("65131"), {
  default: m.PharmaceuticalPage
})))));
const ManufacturingPage = lazy(stryMutAct_9fa48("65132") ? () => undefined : (stryCov_9fa48("65132"), () => import('./pages/verticals').then(stryMutAct_9fa48("65134") ? () => undefined : (stryCov_9fa48("65134"), m => stryMutAct_9fa48("65135") ? {} : (stryCov_9fa48("65135"), {
  default: m.ManufacturingPage
})))));
const EnergyUtilitiesPage = lazy(stryMutAct_9fa48("65136") ? () => undefined : (stryCov_9fa48("65136"), () => import('./pages/verticals').then(stryMutAct_9fa48("65138") ? () => undefined : (stryCov_9fa48("65138"), m => stryMutAct_9fa48("65139") ? {} : (stryCov_9fa48("65139"), {
  default: m.EnergyUtilitiesPage
})))));
const TechnologyVerticalPage = lazy(stryMutAct_9fa48("65140") ? () => undefined : (stryCov_9fa48("65140"), () => import('./pages/verticals').then(stryMutAct_9fa48("65142") ? () => undefined : (stryCov_9fa48("65142"), m => stryMutAct_9fa48("65143") ? {} : (stryCov_9fa48("65143"), {
  default: m.TechnologyPage
})))));
const RetailHospitalityPage = lazy(stryMutAct_9fa48("65144") ? () => undefined : (stryCov_9fa48("65144"), () => import('./pages/verticals').then(stryMutAct_9fa48("65146") ? () => undefined : (stryCov_9fa48("65146"), m => stryMutAct_9fa48("65147") ? {} : (stryCov_9fa48("65147"), {
  default: m.RetailHospitalityPage
})))));
const RealEstateConstructionPage = lazy(stryMutAct_9fa48("65148") ? () => undefined : (stryCov_9fa48("65148"), () => import('./pages/verticals').then(stryMutAct_9fa48("65150") ? () => undefined : (stryCov_9fa48("65150"), m => stryMutAct_9fa48("65151") ? {} : (stryCov_9fa48("65151"), {
  default: m.RealEstateConstructionPage
})))));
const TransportationLogisticsPage = lazy(stryMutAct_9fa48("65152") ? () => undefined : (stryCov_9fa48("65152"), () => import('./pages/verticals').then(stryMutAct_9fa48("65154") ? () => undefined : (stryCov_9fa48("65154"), m => stryMutAct_9fa48("65155") ? {} : (stryCov_9fa48("65155"), {
  default: m.TransportationLogisticsPage
})))));
const MediaEntertainmentPage = lazy(stryMutAct_9fa48("65156") ? () => undefined : (stryCov_9fa48("65156"), () => import('./pages/verticals').then(stryMutAct_9fa48("65158") ? () => undefined : (stryCov_9fa48("65158"), m => stryMutAct_9fa48("65159") ? {} : (stryCov_9fa48("65159"), {
  default: m.MediaEntertainmentPage
})))));
const ProfessionalServicesPage = lazy(stryMutAct_9fa48("65160") ? () => undefined : (stryCov_9fa48("65160"), () => import('./pages/verticals').then(stryMutAct_9fa48("65162") ? () => undefined : (stryCov_9fa48("65162"), m => stryMutAct_9fa48("65163") ? {} : (stryCov_9fa48("65163"), {
  default: m.ProfessionalServicesPage
})))));
const HigherEducationPage = lazy(stryMutAct_9fa48("65164") ? () => undefined : (stryCov_9fa48("65164"), () => import('./pages/verticals').then(stryMutAct_9fa48("65166") ? () => undefined : (stryCov_9fa48("65166"), m => stryMutAct_9fa48("65167") ? {} : (stryCov_9fa48("65167"), {
  default: m.HigherEducationPage
})))));
const SportsPage = lazy(stryMutAct_9fa48("65168") ? () => undefined : (stryCov_9fa48("65168"), () => import('./pages/verticals').then(stryMutAct_9fa48("65170") ? () => undefined : (stryCov_9fa48("65170"), m => stryMutAct_9fa48("65171") ? {} : (stryCov_9fa48("65171"), {
  default: m.SportsPage
})))));
const TelecommunicationsPage = lazy(stryMutAct_9fa48("65172") ? () => undefined : (stryCov_9fa48("65172"), () => import('./pages/verticals').then(stryMutAct_9fa48("65174") ? () => undefined : (stryCov_9fa48("65174"), m => stryMutAct_9fa48("65175") ? {} : (stryCov_9fa48("65175"), {
  default: m.TelecommunicationsPage
})))));

// Apex Package
const CendiaForecastPage = lazy(stryMutAct_9fa48("65176") ? () => undefined : (stryCov_9fa48("65176"), () => import('./pages/apex').then(stryMutAct_9fa48("65178") ? () => undefined : (stryCov_9fa48("65178"), m => stryMutAct_9fa48("65179") ? {} : (stryCov_9fa48("65179"), {
  default: m.CendiaForecastPage
})))));
const CendiaSentryPage = lazy(stryMutAct_9fa48("65180") ? () => undefined : (stryCov_9fa48("65180"), () => import('./pages/apex').then(stryMutAct_9fa48("65182") ? () => undefined : (stryCov_9fa48("65182"), m => stryMutAct_9fa48("65183") ? {} : (stryCov_9fa48("65183"), {
  default: m.CendiaSentryPage
})))));

// Pitch
const PitchDeck = lazy(stryMutAct_9fa48("65184") ? () => undefined : (stryCov_9fa48("65184"), () => import('./pages/pitch').then(stryMutAct_9fa48("65186") ? () => undefined : (stryCov_9fa48("65186"), m => stryMutAct_9fa48("65187") ? {} : (stryCov_9fa48("65187"), {
  default: m.PitchDeck
})))));

// Error Pages (keep non-lazy for fast 404)
import { NotFoundPage } from './pages/NotFoundPage';

// =============================================================================
// SUSPENSE WRAPPER COMPONENT
// =============================================================================
const SuspenseWrapper: React.FC<{
  children: React.ReactNode;
}> = stryMutAct_9fa48("65188") ? () => undefined : (stryCov_9fa48("65188"), (() => {
  const SuspenseWrapper: React.FC<{
    children: React.ReactNode;
  }> = ({
    children
  }) => <Suspense fallback={<PageLoader />}>{children}</Suspense>;
  return SuspenseWrapper;
})());

// =============================================================================
// ROUTE CONFIGURATION
// =============================================================================

export const router = createBrowserRouter(stryMutAct_9fa48("65189") ? [] : (stryCov_9fa48("65189"), [// PUBLIC ROUTES
stryMutAct_9fa48("65190") ? {} : (stryCov_9fa48("65190"), {
  path: '/',
  element: <SuspenseWrapper><SovereignLandingPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65192") ? {} : (stryCov_9fa48("65192"), {
  path: '/home',
  element: <SuspenseWrapper><SovereignLandingPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65194") ? {} : (stryCov_9fa48("65194"), {
  path: '/old-home',
  element: <SuspenseWrapper><LandingPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65196") ? {} : (stryCov_9fa48("65196"), {
  path: '/legacy-home',
  element: <SuspenseWrapper><HomePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65198") ? {} : (stryCov_9fa48("65198"), {
  path: '/pricing',
  element: <SuspenseWrapper><PricingPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65200") ? {} : (stryCov_9fa48("65200"), {
  path: '/demo',
  element: <SuspenseWrapper><DemoRequestPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65202") ? {} : (stryCov_9fa48("65202"), {
  path: '/product',
  element: <SuspenseWrapper><ProductPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65204") ? {} : (stryCov_9fa48("65204"), {
  path: '/products',
  element: <Navigate to="/product" replace />
}), stryMutAct_9fa48("65206") ? {} : (stryCov_9fa48("65206"), {
  path: '/about',
  element: <SuspenseWrapper><AboutPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65208") ? {} : (stryCov_9fa48("65208"), {
  path: '/contact',
  element: <SuspenseWrapper><ContactPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65210") ? {} : (stryCov_9fa48("65210"), {
  path: '/contact-us',
  element: <SuspenseWrapper><ContactPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65212") ? {} : (stryCov_9fa48("65212"), {
  path: '/manifesto',
  element: <SuspenseWrapper><ManifestoHomePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65214") ? {} : (stryCov_9fa48("65214"), {
  path: '/believe',
  element: <SuspenseWrapper><ManifestoHomePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65216") ? {} : (stryCov_9fa48("65216"), {
  path: '/why',
  element: <SuspenseWrapper><ManifestoHomePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65218") ? {} : (stryCov_9fa48("65218"), {
  path: '/downloads',
  element: <SuspenseWrapper><DownloadsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65220") ? {} : (stryCov_9fa48("65220"), {
  path: '/license',
  element: <SuspenseWrapper><LicensePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65222") ? {} : (stryCov_9fa48("65222"), {
  path: '/licenses',
  element: <SuspenseWrapper><LicensePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65224") ? {} : (stryCov_9fa48("65224"), {
  path: '/services',
  element: <SuspenseWrapper><ServicesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65226") ? {} : (stryCov_9fa48("65226"), {
  path: '/packages',
  element: <SuspenseWrapper><PackagesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65228") ? {} : (stryCov_9fa48("65228"), {
  path: '/sovereign-enterprise-intelligence',
  element: <SuspenseWrapper><SovereignEnterpriseIntelligencePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65230") ? {} : (stryCov_9fa48("65230"), {
  path: '/sei',
  element: <SuspenseWrapper><SovereignEnterpriseIntelligencePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65232") ? {} : (stryCov_9fa48("65232"), {
  path: '/category',
  element: <SuspenseWrapper><SovereignEnterpriseIntelligencePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65234") ? {} : (stryCov_9fa48("65234"), {
  path: '/honesty',
  element: <SuspenseWrapper><HonestyMatricesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65236") ? {} : (stryCov_9fa48("65236"), {
  path: '/honesty-matrices',
  element: <SuspenseWrapper><HonestyMatricesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65238") ? {} : (stryCov_9fa48("65238"), {
  path: '/transparency',
  element: <SuspenseWrapper><HonestyMatricesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65240") ? {} : (stryCov_9fa48("65240"), {
  path: '/showcases',
  element: <SuspenseWrapper><ShowcasesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65242") ? {} : (stryCov_9fa48("65242"), {
  path: '/case-studies',
  element: <SuspenseWrapper><ShowcasesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65244") ? {} : (stryCov_9fa48("65244"), {
  path: '/customers',
  element: <SuspenseWrapper><ShowcasesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65246") ? {} : (stryCov_9fa48("65246"), {
  path: '/privacy',
  element: <SuspenseWrapper><PrivacyPolicyPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65248") ? {} : (stryCov_9fa48("65248"), {
  path: '/terms',
  element: <SuspenseWrapper><TermsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65250") ? {} : (stryCov_9fa48("65250"), {
  path: '/terms-of-service',
  element: <SuspenseWrapper><TermsPage /></SuspenseWrapper>
}), // ADDITIONAL PUBLIC PAGES
stryMutAct_9fa48("65252") ? {} : (stryCov_9fa48("65252"), {
  path: '/security',
  element: <SuspenseWrapper><SecurityPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65254") ? {} : (stryCov_9fa48("65254"), {
  path: '/cookies',
  element: <SuspenseWrapper><CookiePolicyPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65256") ? {} : (stryCov_9fa48("65256"), {
  path: '/cookie-policy',
  element: <SuspenseWrapper><CookiePolicyPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65258") ? {} : (stryCov_9fa48("65258"), {
  path: '/docs',
  element: <SuspenseWrapper><DocsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65260") ? {} : (stryCov_9fa48("65260"), {
  path: '/documentation',
  element: <SuspenseWrapper><DocsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65262") ? {} : (stryCov_9fa48("65262"), {
  path: '/api',
  element: <SuspenseWrapper><DocsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65264") ? {} : (stryCov_9fa48("65264"), {
  path: '/blog',
  element: <SuspenseWrapper><BlogPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65266") ? {} : (stryCov_9fa48("65266"), {
  path: '/changelog',
  element: <SuspenseWrapper><ChangelogPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65268") ? {} : (stryCov_9fa48("65268"), {
  path: '/releases',
  element: <SuspenseWrapper><ChangelogPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65270") ? {} : (stryCov_9fa48("65270"), {
  path: '/support',
  element: <SuspenseWrapper><SupportPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65272") ? {} : (stryCov_9fa48("65272"), {
  path: '/help',
  element: <SuspenseWrapper><SupportPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65274") ? {} : (stryCov_9fa48("65274"), {
  path: '/integrations',
  element: <SuspenseWrapper><IntegrationsPage /></SuspenseWrapper>
}), // AUTH ROUTES
stryMutAct_9fa48("65276") ? {} : (stryCov_9fa48("65276"), {
  path: '/login',
  element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65278") ? {} : (stryCov_9fa48("65278"), {
  path: '/register',
  element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65280") ? {} : (stryCov_9fa48("65280"), {
  path: '/forgot-password',
  element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65282") ? {} : (stryCov_9fa48("65282"), {
  path: '/reset-password',
  element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65284") ? {} : (stryCov_9fa48("65284"), {
  path: '/verify-email',
  element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65286") ? {} : (stryCov_9fa48("65286"), {
  path: '/auth/login',
  element: <SuspenseWrapper><LoginPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65288") ? {} : (stryCov_9fa48("65288"), {
  path: '/auth/register',
  element: <SuspenseWrapper><RegisterPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65290") ? {} : (stryCov_9fa48("65290"), {
  path: '/auth/forgot-password',
  element: <SuspenseWrapper><ForgotPasswordPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65292") ? {} : (stryCov_9fa48("65292"), {
  path: '/auth/reset-password',
  element: <SuspenseWrapper><ResetPasswordPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65294") ? {} : (stryCov_9fa48("65294"), {
  path: '/auth/verify-email',
  element: <SuspenseWrapper><VerifyEmailPage /></SuspenseWrapper>
}), // ONBOARDING
stryMutAct_9fa48("65296") ? {} : (stryCov_9fa48("65296"), {
  path: '/onboarding',
  element: <SuspenseWrapper><OnboardingWizard /></SuspenseWrapper>
}), stryMutAct_9fa48("65298") ? {} : (stryCov_9fa48("65298"), {
  path: '/welcome',
  element: <SuspenseWrapper><OnboardingWizard /></SuspenseWrapper>
}), stryMutAct_9fa48("65300") ? {} : (stryCov_9fa48("65300"), {
  path: '/get-started',
  element: <SuspenseWrapper><OnboardingWizard /></SuspenseWrapper>
}), // VERTICALS
stryMutAct_9fa48("65302") ? {} : (stryCov_9fa48("65302"), {
  path: '/verticals',
  element: <SuspenseWrapper><VerticalsHubPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65304") ? {} : (stryCov_9fa48("65304"), {
  path: '/verticals/healthcare',
  element: <SuspenseWrapper><HealthcarePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65306") ? {} : (stryCov_9fa48("65306"), {
  path: '/verticals/financial-services',
  element: <SuspenseWrapper><FinancialServicesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65308") ? {} : (stryCov_9fa48("65308"), {
  path: '/verticals/government-legal',
  element: <SuspenseWrapper><GovernmentLegalPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65310") ? {} : (stryCov_9fa48("65310"), {
  path: '/verticals/insurance',
  element: <SuspenseWrapper><InsurancePage /></SuspenseWrapper>
}), stryMutAct_9fa48("65312") ? {} : (stryCov_9fa48("65312"), {
  path: '/verticals/pharmaceutical',
  element: <SuspenseWrapper><PharmaceuticalPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65314") ? {} : (stryCov_9fa48("65314"), {
  path: '/verticals/manufacturing',
  element: <SuspenseWrapper><ManufacturingPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65316") ? {} : (stryCov_9fa48("65316"), {
  path: '/verticals/energy-utilities',
  element: <SuspenseWrapper><EnergyUtilitiesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65318") ? {} : (stryCov_9fa48("65318"), {
  path: '/verticals/technology',
  element: <SuspenseWrapper><TechnologyVerticalPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65320") ? {} : (stryCov_9fa48("65320"), {
  path: '/verticals/retail-hospitality',
  element: <SuspenseWrapper><RetailHospitalityPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65322") ? {} : (stryCov_9fa48("65322"), {
  path: '/verticals/real-estate',
  element: <SuspenseWrapper><RealEstateConstructionPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65324") ? {} : (stryCov_9fa48("65324"), {
  path: '/verticals/transportation',
  element: <SuspenseWrapper><TransportationLogisticsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65326") ? {} : (stryCov_9fa48("65326"), {
  path: '/verticals/media-entertainment',
  element: <SuspenseWrapper><MediaEntertainmentPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65328") ? {} : (stryCov_9fa48("65328"), {
  path: '/verticals/professional-services',
  element: <SuspenseWrapper><ProfessionalServicesPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65330") ? {} : (stryCov_9fa48("65330"), {
  path: '/verticals/higher-education',
  element: <SuspenseWrapper><HigherEducationPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65332") ? {} : (stryCov_9fa48("65332"), {
  path: '/verticals/sports',
  element: <SuspenseWrapper><SportsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65334") ? {} : (stryCov_9fa48("65334"), {
  path: '/verticals/telecommunications',
  element: <SuspenseWrapper><TelecommunicationsPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65336") ? {} : (stryCov_9fa48("65336"), {
  path: '/industries',
  element: <SuspenseWrapper><VerticalsHubPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65338") ? {} : (stryCov_9fa48("65338"), {
  path: '/solutions',
  element: <SuspenseWrapper><VerticalsHubPage /></SuspenseWrapper>
}), // APEX PACKAGE
stryMutAct_9fa48("65340") ? {} : (stryCov_9fa48("65340"), {
  path: '/apex/forecast',
  element: <SuspenseWrapper><CendiaForecastPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65342") ? {} : (stryCov_9fa48("65342"), {
  path: '/apex/sentry',
  element: <SuspenseWrapper><CendiaSentryPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65344") ? {} : (stryCov_9fa48("65344"), {
  path: '/products/cendia-forecast',
  element: <SuspenseWrapper><CendiaForecastPage /></SuspenseWrapper>
}), stryMutAct_9fa48("65346") ? {} : (stryCov_9fa48("65346"), {
  path: '/products/cendia-sentry',
  element: <SuspenseWrapper><CendiaSentryPage /></SuspenseWrapper>
}), // PITCH
stryMutAct_9fa48("65348") ? {} : (stryCov_9fa48("65348"), {
  path: '/pitch',
  element: <SuspenseWrapper><PitchDeck /></SuspenseWrapper>
}), stryMutAct_9fa48("65350") ? {} : (stryCov_9fa48("65350"), {
  path: '/investors',
  element: <SuspenseWrapper><PitchDeck /></SuspenseWrapper>
}), stryMutAct_9fa48("65352") ? {} : (stryCov_9fa48("65352"), {
  path: '/deck',
  element: <SuspenseWrapper><PitchDeck /></SuspenseWrapper>
}), // CORTEX APPLICATION
stryMutAct_9fa48("65354") ? {} : (stryCov_9fa48("65354"), {
  path: '/cortex',
  element: <CortexLayout />,
  children: stryMutAct_9fa48("65356") ? [] : (stryCov_9fa48("65356"), [stryMutAct_9fa48("65357") ? {} : (stryCov_9fa48("65357"), {
    index: stryMutAct_9fa48("65358") ? false : (stryCov_9fa48("65358"), true),
    element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65359") ? {} : (stryCov_9fa48("65359"), {
    path: 'dashboard',
    element: <SuspenseWrapper><DashboardPage /></SuspenseWrapper>
  }), // Graph
  stryMutAct_9fa48("65361") ? {} : (stryCov_9fa48("65361"), {
    path: 'graph',
    element: <SuspenseWrapper><GraphExplorerPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65363") ? {} : (stryCov_9fa48("65363"), {
    path: 'graph/lineage/:entityId?',
    element: <SuspenseWrapper><LineageViewPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65365") ? {} : (stryCov_9fa48("65365"), {
    path: 'graph/entity/:entityId',
    element: <SuspenseWrapper><EntityDetailsPage /></SuspenseWrapper>
  }), // Council
  stryMutAct_9fa48("65367") ? {} : (stryCov_9fa48("65367"), {
    path: 'council',
    element: <SuspenseWrapper><CouncilPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65369") ? {} : (stryCov_9fa48("65369"), {
    path: 'council/deliberation/:deliberationId',
    element: <SuspenseWrapper><DeliberationViewPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65371") ? {} : (stryCov_9fa48("65371"), {
    path: 'council/agent/:agentId',
    element: <SuspenseWrapper><AgentProfilePage /></SuspenseWrapper>
  }), // Pulse
  stryMutAct_9fa48("65373") ? {} : (stryCov_9fa48("65373"), {
    path: 'pulse',
    element: <SuspenseWrapper><PulsePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65375") ? {} : (stryCov_9fa48("65375"), {
    path: 'pulse/alerts',
    element: <SuspenseWrapper><AlertsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65377") ? {} : (stryCov_9fa48("65377"), {
    path: 'pulse/metrics',
    element: <SuspenseWrapper><MetricsPage /></SuspenseWrapper>
  }), // Lens
  stryMutAct_9fa48("65379") ? {} : (stryCov_9fa48("65379"), {
    path: 'lens',
    element: <SuspenseWrapper><LensPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65381") ? {} : (stryCov_9fa48("65381"), {
    path: 'lens/forecast/:forecastId',
    element: <SuspenseWrapper><ForecastDetailsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65383") ? {} : (stryCov_9fa48("65383"), {
    path: 'lens/scenarios/:scenarioId',
    element: <SuspenseWrapper><ScenarioDetailsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65385") ? {} : (stryCov_9fa48("65385"), {
    path: 'lens/scenarios/:scenarioId/edit',
    element: <SuspenseWrapper><ScenarioBuilderPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65387") ? {} : (stryCov_9fa48("65387"), {
    path: 'lens/scenarios/new',
    element: <SuspenseWrapper><ScenarioBuilderPage /></SuspenseWrapper>
  }), // Bridge
  stryMutAct_9fa48("65389") ? {} : (stryCov_9fa48("65389"), {
    path: 'bridge',
    element: <SuspenseWrapper><BridgePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65391") ? {} : (stryCov_9fa48("65391"), {
    path: 'bridge/workflows',
    element: <SuspenseWrapper><WorkflowsListPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65393") ? {} : (stryCov_9fa48("65393"), {
    path: 'bridge/workflows/:workflowId',
    element: <SuspenseWrapper><WorkflowBuilderPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65395") ? {} : (stryCov_9fa48("65395"), {
    path: 'bridge/workflows/new',
    element: <SuspenseWrapper><WorkflowBuilderPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65397") ? {} : (stryCov_9fa48("65397"), {
    path: 'bridge/approvals',
    element: <SuspenseWrapper><ApprovalsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65399") ? {} : (stryCov_9fa48("65399"), {
    path: 'bridge/integrations',
    element: <SuspenseWrapper><BridgeIntegrationsPage /></SuspenseWrapper>
  }), // Intelligence
  stryMutAct_9fa48("65401") ? {} : (stryCov_9fa48("65401"), {
    path: 'intelligence',
    element: <Navigate to="/cortex/intelligence/pre-mortem" replace />
  }), stryMutAct_9fa48("65403") ? {} : (stryCov_9fa48("65403"), {
    path: 'intelligence/council',
    element: <RedirectToCouncilWithQuery />
  }), stryMutAct_9fa48("65405") ? {} : (stryCov_9fa48("65405"), {
    path: 'intelligence/pre-mortem',
    element: <SuspenseWrapper><PreMortemPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65407") ? {} : (stryCov_9fa48("65407"), {
    path: 'intelligence/ghost-board',
    element: <SuspenseWrapper><GhostBoardPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65409") ? {} : (stryCov_9fa48("65409"), {
    path: 'intelligence/decision-debt',
    element: <SuspenseWrapper><DecisionDebtPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65411") ? {} : (stryCov_9fa48("65411"), {
    path: 'intelligence/live-demo',
    element: <SuspenseWrapper><LiveDemoPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65413") ? {} : (stryCov_9fa48("65413"), {
    path: 'intelligence/regulatory',
    element: <SuspenseWrapper><RegulatoryAbsorbPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65415") ? {} : (stryCov_9fa48("65415"), {
    path: 'intelligence/decision-dna',
    element: <SuspenseWrapper><DecisionDNAPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65417") ? {} : (stryCov_9fa48("65417"), {
    path: 'intelligence/chronos',
    element: <SuspenseWrapper><ChronosPage /></SuspenseWrapper>
  }), // Enterprise
  stryMutAct_9fa48("65419") ? {} : (stryCov_9fa48("65419"), {
    path: 'enterprise/sovereign',
    element: <SuspenseWrapper><SovereignPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65421") ? {} : (stryCov_9fa48("65421"), {
    path: 'enterprise/persona-forge',
    element: <SuspenseWrapper><PersonaForgePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65423") ? {} : (stryCov_9fa48("65423"), {
    path: 'enterprise/mesh',
    element: <SuspenseWrapper><MeshPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65425") ? {} : (stryCov_9fa48("65425"), {
    path: 'enterprise/govern',
    element: <SuspenseWrapper><GovernPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65427") ? {} : (stryCov_9fa48("65427"), {
    path: 'enterprise/voice',
    element: <SuspenseWrapper><VoicePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65429") ? {} : (stryCov_9fa48("65429"), {
    path: 'enterprise/autopilot',
    element: <SuspenseWrapper><AutopilotPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65431") ? {} : (stryCov_9fa48("65431"), {
    path: 'enterprise/genomics',
    element: <SuspenseWrapper><GenomicsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65433") ? {} : (stryCov_9fa48("65433"), {
    path: 'enterprise/defense-stack',
    element: <SuspenseWrapper><DefenseStackPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65435") ? {} : (stryCov_9fa48("65435"), {
    path: 'enterprise/omni-translate',
    element: <SuspenseWrapper><OmniTranslatePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65437") ? {} : (stryCov_9fa48("65437"), {
    path: 'enterprise/veto',
    element: <SuspenseWrapper><VetoPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65439") ? {} : (stryCov_9fa48("65439"), {
    path: 'enterprise/union',
    element: <SuspenseWrapper><UnionPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65441") ? {} : (stryCov_9fa48("65441"), {
    path: 'enterprise/ledger',
    element: <SuspenseWrapper><LedgerPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65443") ? {} : (stryCov_9fa48("65443"), {
    path: 'enterprise/apotheosis',
    element: <SuspenseWrapper><ApotheosisPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65445") ? {} : (stryCov_9fa48("65445"), {
    path: 'enterprise/dissent',
    element: <SuspenseWrapper><DissentPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65447") ? {} : (stryCov_9fa48("65447"), {
    path: 'enterprise/crisis',
    element: <SuspenseWrapper><CrisisManagementPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65449") ? {} : (stryCov_9fa48("65449"), {
    path: 'enterprise/audit-workflow',
    element: <SuspenseWrapper><AuditWorkflowPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65451") ? {} : (stryCov_9fa48("65451"), {
    path: 'enterprise/training',
    element: <SuspenseWrapper><TrainingPage /></SuspenseWrapper>
  }), // Sovereign
  stryMutAct_9fa48("65453") ? {} : (stryCov_9fa48("65453"), {
    path: 'sovereign/crucible',
    element: <SuspenseWrapper><CruciblePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65455") ? {} : (stryCov_9fa48("65455"), {
    path: 'sovereign/panopticon',
    element: <SuspenseWrapper><PanopticonPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65457") ? {} : (stryCov_9fa48("65457"), {
    path: 'sovereign/aegis',
    element: <SuspenseWrapper><AegisPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65459") ? {} : (stryCov_9fa48("65459"), {
    path: 'sovereign/eternal',
    element: <SuspenseWrapper><EternalPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65461") ? {} : (stryCov_9fa48("65461"), {
    path: 'sovereign/symbiont',
    element: <SuspenseWrapper><SymbiontPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65463") ? {} : (stryCov_9fa48("65463"), {
    path: 'sovereign/vox',
    element: <SuspenseWrapper><VoxPage /></SuspenseWrapper>
  }), // Crown Jewels - Premium Enterprise Services ($5M-$150M tier)
  stryMutAct_9fa48("65465") ? {} : (stryCov_9fa48("65465"), {
    path: 'crown/echo',
    element: <SuspenseWrapper><EchoPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65467") ? {} : (stryCov_9fa48("65467"), {
    path: 'crown/redteam',
    element: <SuspenseWrapper><RedTeamPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65469") ? {} : (stryCov_9fa48("65469"), {
    path: 'crown/gnosis',
    element: <SuspenseWrapper><GnosisPage /></SuspenseWrapper>
  }), // Pillars
  stryMutAct_9fa48("65471") ? {} : (stryCov_9fa48("65471"), {
    path: 'pillars',
    element: <Navigate to="/cortex/pillars/helm" replace />
  }), stryMutAct_9fa48("65473") ? {} : (stryCov_9fa48("65473"), {
    path: 'pillars/helm',
    element: <SuspenseWrapper><HelmPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65475") ? {} : (stryCov_9fa48("65475"), {
    path: 'pillars/lineage',
    element: <SuspenseWrapper><LineagePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65477") ? {} : (stryCov_9fa48("65477"), {
    path: 'pillars/predict',
    element: <SuspenseWrapper><PredictPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65479") ? {} : (stryCov_9fa48("65479"), {
    path: 'pillars/flow',
    element: <SuspenseWrapper><FlowPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65481") ? {} : (stryCov_9fa48("65481"), {
    path: 'pillars/health',
    element: <SuspenseWrapper><HealthPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65483") ? {} : (stryCov_9fa48("65483"), {
    path: 'pillars/guard',
    element: <SuspenseWrapper><GuardPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65485") ? {} : (stryCov_9fa48("65485"), {
    path: 'pillars/ethics',
    element: <SuspenseWrapper><EthicsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65487") ? {} : (stryCov_9fa48("65487"), {
    path: 'pillars/agents',
    element: <SuspenseWrapper><AgentsPage /></SuspenseWrapper>
  }), // Data
  stryMutAct_9fa48("65489") ? {} : (stryCov_9fa48("65489"), {
    path: 'data',
    element: <Navigate to="/cortex/data/sources" replace />
  }), stryMutAct_9fa48("65491") ? {} : (stryCov_9fa48("65491"), {
    path: 'data/sources',
    element: <SuspenseWrapper><DataSourcesPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65493") ? {} : (stryCov_9fa48("65493"), {
    path: 'data/catalog',
    element: <SuspenseWrapper><DataCatalogPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65495") ? {} : (stryCov_9fa48("65495"), {
    path: 'data/quality',
    element: <SuspenseWrapper><DataQualityPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65497") ? {} : (stryCov_9fa48("65497"), {
    path: 'data/import-export',
    element: <SuspenseWrapper><DataImportExportPage /></SuspenseWrapper>
  }), // Security
  stryMutAct_9fa48("65499") ? {} : (stryCov_9fa48("65499"), {
    path: 'security',
    element: <SuspenseWrapper><SecurityOverviewPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65501") ? {} : (stryCov_9fa48("65501"), {
    path: 'security/access',
    element: <SuspenseWrapper><AccessControlPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65503") ? {} : (stryCov_9fa48("65503"), {
    path: 'security/audit',
    element: <SuspenseWrapper><AuditLogPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65505") ? {} : (stryCov_9fa48("65505"), {
    path: 'security/policies',
    element: <SuspenseWrapper><SecurityPoliciesPage /></SuspenseWrapper>
  }), // Settings
  stryMutAct_9fa48("65507") ? {} : (stryCov_9fa48("65507"), {
    path: 'settings',
    element: <SuspenseWrapper><SettingsLayout /></SuspenseWrapper>,
    children: stryMutAct_9fa48("65509") ? [] : (stryCov_9fa48("65509"), [stryMutAct_9fa48("65510") ? {} : (stryCov_9fa48("65510"), {
      index: stryMutAct_9fa48("65511") ? false : (stryCov_9fa48("65511"), true),
      element: <Navigate to="/cortex/settings/organization" replace />
    }), stryMutAct_9fa48("65512") ? {} : (stryCov_9fa48("65512"), {
      path: 'organization',
      element: <SuspenseWrapper><OrganizationSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65514") ? {} : (stryCov_9fa48("65514"), {
      path: 'users',
      element: <SuspenseWrapper><UsersSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65516") ? {} : (stryCov_9fa48("65516"), {
      path: 'teams',
      element: <SuspenseWrapper><TeamsSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65518") ? {} : (stryCov_9fa48("65518"), {
      path: 'roles',
      element: <SuspenseWrapper><RolesSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65520") ? {} : (stryCov_9fa48("65520"), {
      path: 'billing',
      element: <SuspenseWrapper><BillingSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65522") ? {} : (stryCov_9fa48("65522"), {
      path: 'api-keys',
      element: <SuspenseWrapper><ApiKeysSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65524") ? {} : (stryCov_9fa48("65524"), {
      path: 'integrations',
      element: <SuspenseWrapper><IntegrationSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65526") ? {} : (stryCov_9fa48("65526"), {
      path: 'preferences',
      element: <SuspenseWrapper><PreferencesSettingsPage /></SuspenseWrapper>
    }), stryMutAct_9fa48("65528") ? {} : (stryCov_9fa48("65528"), {
      path: 'security',
      element: <SuspenseWrapper><SettingsSecurityPage /></SuspenseWrapper>
    })])
  })])
}), // ADMIN
stryMutAct_9fa48("65530") ? {} : (stryCov_9fa48("65530"), {
  path: '/admin',
  element: <SuspenseWrapper><AdminLayout /></SuspenseWrapper>,
  children: stryMutAct_9fa48("65532") ? [] : (stryCov_9fa48("65532"), [stryMutAct_9fa48("65533") ? {} : (stryCov_9fa48("65533"), {
    index: stryMutAct_9fa48("65534") ? false : (stryCov_9fa48("65534"), true),
    element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65535") ? {} : (stryCov_9fa48("65535"), {
    path: 'dashboard',
    element: <SuspenseWrapper><AdminDashboardPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65537") ? {} : (stryCov_9fa48("65537"), {
    path: 'tenants',
    element: <SuspenseWrapper><TenantsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65539") ? {} : (stryCov_9fa48("65539"), {
    path: 'licenses',
    element: <SuspenseWrapper><LicensesPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65541") ? {} : (stryCov_9fa48("65541"), {
    path: 'usage',
    element: <SuspenseWrapper><UsageAnalyticsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65543") ? {} : (stryCov_9fa48("65543"), {
    path: 'health',
    element: <SuspenseWrapper><SystemHealthPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65545") ? {} : (stryCov_9fa48("65545"), {
    path: 'features',
    element: <SuspenseWrapper><FeatureFlagsPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65547") ? {} : (stryCov_9fa48("65547"), {
    path: 'data-sources',
    element: <SuspenseWrapper><AdminDataSourcesPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65549") ? {} : (stryCov_9fa48("65549"), {
    path: 'mode-analytics',
    element: <SuspenseWrapper><ModeAnalytics /></SuspenseWrapper>
  }), stryMutAct_9fa48("65551") ? {} : (stryCov_9fa48("65551"), {
    path: 'rd-lab',
    element: <SuspenseWrapper><RDLabPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65553") ? {} : (stryCov_9fa48("65553"), {
    path: 'core',
    element: <SuspenseWrapper><CorePage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65555") ? {} : (stryCov_9fa48("65555"), {
    path: 'control-center',
    element: <SuspenseWrapper><ControlCenterPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65557") ? {} : (stryCov_9fa48("65557"), {
    path: 'ai',
    element: <SuspenseWrapper><AdminAIPage /></SuspenseWrapper>
  }), stryMutAct_9fa48("65559") ? {} : (stryCov_9fa48("65559"), {
    path: 'sovereign-stack',
    element: <SuspenseWrapper><SovereignStackPage /></SuspenseWrapper>
  })])
}), // TOOLS
stryMutAct_9fa48("65561") ? {} : (stryCov_9fa48("65561"), {
  path: '/tools',
  element: <CortexLayout />,
  children: stryMutAct_9fa48("65563") ? [] : (stryCov_9fa48("65563"), [stryMutAct_9fa48("65564") ? {} : (stryCov_9fa48("65564"), {
    path: 'roi-calculator',
    element: <SuspenseWrapper><ROICalculator /></SuspenseWrapper>
  })])
}), // 404
stryMutAct_9fa48("65566") ? {} : (stryCov_9fa48("65566"), {
  path: '*',
  element: <NotFoundPage />
})]));

// Route helpers (same as before)
export const routes = stryMutAct_9fa48("65568") ? {} : (stryCov_9fa48("65568"), {
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
  lineage: stryMutAct_9fa48("65586") ? () => undefined : (stryCov_9fa48("65586"), (entityId?: string) => entityId ? `/cortex/graph/lineage/${entityId}` : '/cortex/graph/lineage'),
  entity: stryMutAct_9fa48("65589") ? () => undefined : (stryCov_9fa48("65589"), (entityId: string) => `/cortex/graph/entity/${entityId}`),
  council: '/cortex/council',
  deliberation: stryMutAct_9fa48("65592") ? () => undefined : (stryCov_9fa48("65592"), (id: string) => `/cortex/council/deliberation/${id}`),
  agent: stryMutAct_9fa48("65594") ? () => undefined : (stryCov_9fa48("65594"), (id: string) => `/cortex/council/agent/${id}`),
  pulse: '/cortex/pulse',
  alerts: '/cortex/pulse/alerts',
  metrics: '/cortex/pulse/metrics',
  lens: '/cortex/lens',
  forecast: stryMutAct_9fa48("65600") ? () => undefined : (stryCov_9fa48("65600"), (id: string) => `/cortex/lens/forecast/${id}`),
  scenario: stryMutAct_9fa48("65602") ? () => undefined : (stryCov_9fa48("65602"), (id: string) => `/cortex/lens/scenarios/${id}`),
  scenarioEdit: stryMutAct_9fa48("65604") ? () => undefined : (stryCov_9fa48("65604"), (id: string) => `/cortex/lens/scenarios/${id}/edit`),
  newScenario: '/cortex/lens/scenarios/new',
  bridge: '/cortex/bridge',
  workflows: '/cortex/bridge/workflows',
  workflow: stryMutAct_9fa48("65609") ? () => undefined : (stryCov_9fa48("65609"), (id: string) => `/cortex/bridge/workflows/${id}`),
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
  adminRDLab: '/admin/rd-lab'
});
export default router;