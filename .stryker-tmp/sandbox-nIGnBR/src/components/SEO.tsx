// @ts-nocheck
// =============================================================================
// DATACENDIA - SEO COMPONENT
// Dynamic page titles, meta tags, Open Graph, and structured data
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
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string[];
  image?: string;
  type?: 'website' | 'article' | 'product';
  noIndex?: boolean;
  structuredData?: Record<string, unknown>;
}
interface PageSEOConfig {
  title: string;
  description: string;
  keywords: string[];
}

// =============================================================================
// DEFAULT SEO CONFIG
// =============================================================================

const SITE_NAME = 'Datacendia';
const DEFAULT_DESCRIPTION = 'Enterprise Intelligence Platform - Transform your organization with AI-powered decision intelligence, predictive analytics, and automated workflows.';
const DEFAULT_IMAGE = '/og-image.svg';
const SITE_URL = (stryMutAct_9fa48("5936") ? typeof window === 'undefined' : stryMutAct_9fa48("5935") ? false : stryMutAct_9fa48("5934") ? true : (stryCov_9fa48("5934", "5935", "5936"), typeof window !== 'undefined')) ? window.location.origin : 'https://datacendia.com';

// Page-specific SEO configurations
const PAGE_SEO: Record<string, PageSEOConfig> = stryMutAct_9fa48("5939") ? {} : (stryCov_9fa48("5939"), {
  '/': stryMutAct_9fa48("5940") ? {} : (stryCov_9fa48("5940"), {
    title: 'Datacendia - Enterprise Intelligence Platform',
    description: 'Transform your organization with AI-powered decision intelligence. Real-time analytics, predictive insights, and automated workflows for modern enterprises.',
    keywords: stryMutAct_9fa48("5943") ? [] : (stryCov_9fa48("5943"), ['enterprise intelligence', 'AI analytics', 'business intelligence', 'decision support', 'predictive analytics'])
  }),
  '/cortex/dashboard': stryMutAct_9fa48("5949") ? {} : (stryCov_9fa48("5949"), {
    title: 'Dashboard | Datacendia',
    description: 'Your organization\'s health at a glance. Real-time metrics, alerts, and KPIs powered by AI intelligence.',
    keywords: stryMutAct_9fa48("5952") ? [] : (stryCov_9fa48("5952"), ['dashboard', 'analytics dashboard', 'KPIs', 'business metrics', 'real-time monitoring'])
  }),
  '/cortex/council': stryMutAct_9fa48("5958") ? {} : (stryCov_9fa48("5958"), {
    title: 'The Council - AI Decision Intelligence | Datacendia',
    description: 'Consult our AI Council of expert agents for strategic decisions. Get multi-perspective analysis from specialized AI personas.',
    keywords: stryMutAct_9fa48("5961") ? [] : (stryCov_9fa48("5961"), ['AI council', 'decision intelligence', 'AI agents', 'strategic planning', 'executive AI'])
  }),
  '/cortex/graph': stryMutAct_9fa48("5967") ? {} : (stryCov_9fa48("5967"), {
    title: 'Knowledge Graph Explorer | Datacendia',
    description: 'Visualize and explore your organization\'s knowledge graph. Discover relationships, lineage, and data dependencies.',
    keywords: stryMutAct_9fa48("5970") ? [] : (stryCov_9fa48("5970"), ['knowledge graph', 'data lineage', 'entity relationships', 'data visualization', 'graph analytics'])
  }),
  '/cortex/pulse': stryMutAct_9fa48("5976") ? {} : (stryCov_9fa48("5976"), {
    title: 'The Pulse - Real-Time Monitoring | Datacendia',
    description: 'Real-time organizational health monitoring. Track anomalies, system status, and performance metrics.',
    keywords: stryMutAct_9fa48("5979") ? [] : (stryCov_9fa48("5979"), ['real-time monitoring', 'health monitoring', 'anomaly detection', 'system status', 'alerts'])
  }),
  '/cortex/lens': stryMutAct_9fa48("5985") ? {} : (stryCov_9fa48("5985"), {
    title: 'The Lens - Predictive Analytics | Datacendia',
    description: 'Scenario simulation and predictive analytics. Forecast outcomes and explore what-if scenarios.',
    keywords: stryMutAct_9fa48("5988") ? [] : (stryCov_9fa48("5988"), ['predictive analytics', 'scenario planning', 'forecasting', 'what-if analysis', 'simulation'])
  }),
  '/cortex/bridge': stryMutAct_9fa48("5994") ? {} : (stryCov_9fa48("5994"), {
    title: 'The Bridge - Workflow Automation | Datacendia',
    description: 'Automate workflows with AI-powered orchestration. Connect systems, manage approvals, and streamline operations.',
    keywords: stryMutAct_9fa48("5997") ? [] : (stryCov_9fa48("5997"), ['workflow automation', 'process automation', 'integrations', 'orchestration', 'business automation'])
  }),
  '/login': stryMutAct_9fa48("6003") ? {} : (stryCov_9fa48("6003"), {
    title: 'Sign In | Datacendia',
    description: 'Sign in to your Datacendia account to access enterprise intelligence tools and analytics.',
    keywords: stryMutAct_9fa48("6006") ? [] : (stryCov_9fa48("6006"), ['login', 'sign in', 'enterprise analytics'])
  }),
  '/pricing': stryMutAct_9fa48("6010") ? {} : (stryCov_9fa48("6010"), {
    title: 'Pricing | Datacendia',
    description: 'Flexible pricing plans for teams of all sizes. Start free and scale as you grow.',
    keywords: stryMutAct_9fa48("6013") ? [] : (stryCov_9fa48("6013"), ['pricing', 'enterprise pricing', 'AI platform pricing', 'business intelligence cost'])
  })
});

// =============================================================================
// SEO COMPONENT
// =============================================================================

export function SEO({
  title,
  description,
  keywords = stryMutAct_9fa48("6018") ? ["Stryker was here"] : (stryCov_9fa48("6018"), []),
  image = DEFAULT_IMAGE,
  type = 'website',
  noIndex = stryMutAct_9fa48("6020") ? true : (stryCov_9fa48("6020"), false),
  structuredData
}: SEOProps) {
  const location = useLocation();
  const pathname = location.pathname;

  // Get page-specific config or use defaults
  const pageConfig = stryMutAct_9fa48("6024") ? PAGE_SEO[pathname] && {
    title: title || `${SITE_NAME} - Enterprise Intelligence`,
    description: description || DEFAULT_DESCRIPTION,
    keywords: keywords
  } : stryMutAct_9fa48("6023") ? false : stryMutAct_9fa48("6022") ? true : (stryCov_9fa48("6022", "6023", "6024"), PAGE_SEO[pathname] || (stryMutAct_9fa48("6025") ? {} : (stryCov_9fa48("6025"), {
    title: stryMutAct_9fa48("6028") ? title && `${SITE_NAME} - Enterprise Intelligence` : stryMutAct_9fa48("6027") ? false : stryMutAct_9fa48("6026") ? true : (stryCov_9fa48("6026", "6027", "6028"), title || `${SITE_NAME} - Enterprise Intelligence`),
    description: stryMutAct_9fa48("6032") ? description && DEFAULT_DESCRIPTION : stryMutAct_9fa48("6031") ? false : stryMutAct_9fa48("6030") ? true : (stryCov_9fa48("6030", "6031", "6032"), description || DEFAULT_DESCRIPTION),
    keywords: keywords
  })));
  const finalTitle = stryMutAct_9fa48("6035") ? title && pageConfig.title : stryMutAct_9fa48("6034") ? false : stryMutAct_9fa48("6033") ? true : (stryCov_9fa48("6033", "6034", "6035"), title || pageConfig.title);
  const finalDescription = stryMutAct_9fa48("6038") ? description && pageConfig.description : stryMutAct_9fa48("6037") ? false : stryMutAct_9fa48("6036") ? true : (stryCov_9fa48("6036", "6037", "6038"), description || pageConfig.description);
  const finalKeywords = stryMutAct_9fa48("6039") ? [] : (stryCov_9fa48("6039"), [...pageConfig.keywords, ...keywords]);
  const canonicalUrl = `${SITE_URL}${pathname}`;
  useEffect(() => {
    // Update document title
    document.title = finalTitle;

    // Helper to set meta tag
    const setMeta = (name: string, content: string, property = stryMutAct_9fa48("6042") ? true : (stryCov_9fa48("6042"), false)) => {
      const attr = property ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement;
      if (stryMutAct_9fa48("6048") ? false : stryMutAct_9fa48("6047") ? true : stryMutAct_9fa48("6046") ? meta : (stryCov_9fa48("6046", "6047", "6048"), !meta)) {
        meta = document.createElement('meta');
        meta.setAttribute(attr, name);
        document.head.appendChild(meta);
      }
      meta.content = content;
    };

    // Basic meta tags
    setMeta('description', finalDescription);
    setMeta('keywords', finalKeywords.join(', '));

    // Robots
    setMeta('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Open Graph
    setMeta('og:title', finalTitle, stryMutAct_9fa48("6058") ? false : (stryCov_9fa48("6058"), true));
    setMeta('og:description', finalDescription, stryMutAct_9fa48("6060") ? false : (stryCov_9fa48("6060"), true));
    setMeta('og:type', type, stryMutAct_9fa48("6062") ? false : (stryCov_9fa48("6062"), true));
    setMeta('og:url', canonicalUrl, stryMutAct_9fa48("6064") ? false : (stryCov_9fa48("6064"), true));
    setMeta('og:image', (stryMutAct_9fa48("6066") ? image.endsWith('http') : (stryCov_9fa48("6066"), image.startsWith('http'))) ? image : `${SITE_URL}${image}`, stryMutAct_9fa48("6069") ? false : (stryCov_9fa48("6069"), true));
    setMeta('og:site_name', SITE_NAME, stryMutAct_9fa48("6071") ? false : (stryCov_9fa48("6071"), true));
    setMeta('og:locale', 'en_US', stryMutAct_9fa48("6074") ? false : (stryCov_9fa48("6074"), true));

    // Twitter Card
    setMeta('twitter:card', 'summary_large_image');
    setMeta('twitter:title', finalTitle);
    setMeta('twitter:description', finalDescription);
    setMeta('twitter:image', (stryMutAct_9fa48("6080") ? image.endsWith('http') : (stryCov_9fa48("6080"), image.startsWith('http'))) ? image : `${SITE_URL}${image}`);

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]') as HTMLLinkElement;
    if (stryMutAct_9fa48("6085") ? false : stryMutAct_9fa48("6084") ? true : stryMutAct_9fa48("6083") ? canonical : (stryCov_9fa48("6083", "6084", "6085"), !canonical)) {
      canonical = document.createElement('link');
      canonical.rel = 'canonical';
      document.head.appendChild(canonical);
    }
    canonical.href = canonicalUrl;

    // Structured Data (JSON-LD)
    const defaultStructuredData = stryMutAct_9fa48("6089") ? {} : (stryCov_9fa48("6089"), {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: SITE_NAME,
      description: finalDescription,
      url: SITE_URL,
      applicationCategory: 'BusinessApplication',
      operatingSystem: 'Web Browser',
      offers: stryMutAct_9fa48("6094") ? {} : (stryCov_9fa48("6094"), {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD'
      }),
      creator: stryMutAct_9fa48("6098") ? {} : (stryCov_9fa48("6098"), {
        '@type': 'Organization',
        name: SITE_NAME,
        url: SITE_URL
      })
    });
    let scriptTag = document.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
    if (stryMutAct_9fa48("6102") ? false : stryMutAct_9fa48("6101") ? true : stryMutAct_9fa48("6100") ? scriptTag : (stryCov_9fa48("6100", "6101", "6102"), !scriptTag)) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(stryMutAct_9fa48("6108") ? structuredData && defaultStructuredData : stryMutAct_9fa48("6107") ? false : stryMutAct_9fa48("6106") ? true : (stryCov_9fa48("6106", "6107", "6108"), structuredData || defaultStructuredData));

    // Cleanup on unmount
    return () => {
      // Reset to default on page change (optional)
    };
  }, stryMutAct_9fa48("6109") ? [] : (stryCov_9fa48("6109"), [finalTitle, finalDescription, finalKeywords, canonicalUrl, image, type, noIndex, structuredData]));
  return null; // This component doesn't render anything
}

// =============================================================================
// PAGE-SPECIFIC SEO HOOKS
// =============================================================================

export function useSEO(config: SEOProps) {
  const location = useLocation();
  useEffect(() => {
    const pageConfig = PAGE_SEO[location.pathname];
    const title = stryMutAct_9fa48("6114") ? (config.title || pageConfig?.title) && `Datacendia` : stryMutAct_9fa48("6113") ? false : stryMutAct_9fa48("6112") ? true : (stryCov_9fa48("6112", "6113", "6114"), (stryMutAct_9fa48("6116") ? config.title && pageConfig?.title : stryMutAct_9fa48("6115") ? false : (stryCov_9fa48("6115", "6116"), config.title || (stryMutAct_9fa48("6117") ? pageConfig.title : (stryCov_9fa48("6117"), pageConfig?.title)))) || `Datacendia`);
    const description = stryMutAct_9fa48("6121") ? (config.description || pageConfig?.description) && DEFAULT_DESCRIPTION : stryMutAct_9fa48("6120") ? false : stryMutAct_9fa48("6119") ? true : (stryCov_9fa48("6119", "6120", "6121"), (stryMutAct_9fa48("6123") ? config.description && pageConfig?.description : stryMutAct_9fa48("6122") ? false : (stryCov_9fa48("6122", "6123"), config.description || (stryMutAct_9fa48("6124") ? pageConfig.description : (stryCov_9fa48("6124"), pageConfig?.description)))) || DEFAULT_DESCRIPTION);
    document.title = title;

    // Update meta description
    let metaDesc = document.querySelector('meta[name="description"]') as HTMLMetaElement;
    if (stryMutAct_9fa48("6127") ? false : stryMutAct_9fa48("6126") ? true : stryMutAct_9fa48("6125") ? metaDesc : (stryCov_9fa48("6125", "6126", "6127"), !metaDesc)) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;
  }, stryMutAct_9fa48("6131") ? [] : (stryCov_9fa48("6131"), [location.pathname, config]));
}

// =============================================================================
// BREADCRUMB STRUCTURED DATA
// =============================================================================

export function BreadcrumbStructuredData({
  items
}: {
  items: {
    name: string;
    url: string;
  }[];
}) {
  useEffect(() => {
    const breadcrumbData = stryMutAct_9fa48("6134") ? {} : (stryCov_9fa48("6134"), {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map(stryMutAct_9fa48("6137") ? () => undefined : (stryCov_9fa48("6137"), (item, index) => stryMutAct_9fa48("6138") ? {} : (stryCov_9fa48("6138"), {
        '@type': 'ListItem',
        position: stryMutAct_9fa48("6140") ? index - 1 : (stryCov_9fa48("6140"), index + 1),
        name: item.name,
        item: item.url
      })))
    });
    let scriptTag = document.querySelector('script[data-type="breadcrumb"]') as HTMLScriptElement;
    if (stryMutAct_9fa48("6143") ? false : stryMutAct_9fa48("6142") ? true : stryMutAct_9fa48("6141") ? scriptTag : (stryCov_9fa48("6141", "6142", "6143"), !scriptTag)) {
      scriptTag = document.createElement('script');
      scriptTag.type = 'application/ld+json';
      scriptTag.setAttribute('data-type', 'breadcrumb');
      document.head.appendChild(scriptTag);
    }
    scriptTag.textContent = JSON.stringify(breadcrumbData);
    return () => {
      stryMutAct_9fa48("6150") ? scriptTag.remove() : (stryCov_9fa48("6150"), scriptTag?.remove());
    };
  }, stryMutAct_9fa48("6151") ? [] : (stryCov_9fa48("6151"), [items]));
  return null;
}
export default SEO;