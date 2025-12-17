// @ts-nocheck
// =============================================================================
// DATACENDIA - SHOWCASES PAGE
// Customer Success Stories, Use Cases & Platform Demonstrations
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
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface CaseStudy {
  id: string;
  company: string;
  industry: string;
  logo: string;
  challenge: string;
  solution: string;
  results: {
    metric: string;
    value: string;
    improvement: string;
  }[];
  quote: string;
  quotePerson: string;
  quoteRole: string;
  tags: string[];
  featured: boolean;
}
interface UseCase {
  id: string;
  title: string;
  industry: string;
  icon: string;
  description: string;
  capabilities: string[];
  outcomes: string[];
}
interface Demo {
  id: string;
  title: string;
  description: string;
  duration: string;
  thumbnail: string;
  category: string;
}

// =============================================================================
// DATA
// =============================================================================

const caseStudies: CaseStudy[] = stryMutAct_9fa48("55905") ? [] : (stryCov_9fa48("55905"), [stryMutAct_9fa48("55906") ? {} : (stryCov_9fa48("55906"), {
  id: 'fortune-500-bank',
  company: 'Fortune 500 Global Bank',
  industry: 'Financial Services',
  logo: '🏦',
  challenge: 'Siloed data across 47 legacy systems with no unified view of customer risk profiles. Compliance reporting required 200+ manual hours monthly.',
  solution: 'Deployed Datacendia with Knowledge Graph integration across all data sources. Implemented AI-powered risk scoring and automated compliance workflows.',
  results: stryMutAct_9fa48("55913") ? [] : (stryCov_9fa48("55913"), [stryMutAct_9fa48("55914") ? {} : (stryCov_9fa48("55914"), {
    metric: 'Time to Insight',
    value: '< 30 sec',
    improvement: '97% faster'
  }), stryMutAct_9fa48("55918") ? {} : (stryCov_9fa48("55918"), {
    metric: 'Compliance Hours',
    value: '12 hrs/mo',
    improvement: '94% reduction'
  }), stryMutAct_9fa48("55922") ? {} : (stryCov_9fa48("55922"), {
    metric: 'Risk Detection',
    value: '99.7%',
    improvement: '34% improvement'
  }), stryMutAct_9fa48("55926") ? {} : (stryCov_9fa48("55926"), {
    metric: 'Annual Savings',
    value: '$4.2M',
    improvement: 'ROI in 6 months'
  })]),
  quote: 'Datacendia transformed our data infrastructure from a liability into our greatest competitive advantage. The ROI was evident within the first quarter.',
  quotePerson: 'Sarah Chen',
  quoteRole: 'Chief Data Officer',
  tags: stryMutAct_9fa48("55933") ? [] : (stryCov_9fa48("55933"), ['Finance', 'Risk Management', 'Compliance', 'Knowledge Graph']),
  featured: stryMutAct_9fa48("55938") ? false : (stryCov_9fa48("55938"), true)
}), stryMutAct_9fa48("55939") ? {} : (stryCov_9fa48("55939"), {
  id: 'healthcare-network',
  company: 'Regional Healthcare Network',
  industry: 'Healthcare',
  logo: '🏥',
  challenge: 'Patient data scattered across 12 hospital systems and 200+ clinics. Care coordination delays impacting patient outcomes.',
  solution: 'Implemented HIPAA-compliant Datacendia deployment with real-time patient data unification and predictive health monitoring.',
  results: stryMutAct_9fa48("55946") ? [] : (stryCov_9fa48("55946"), [stryMutAct_9fa48("55947") ? {} : (stryCov_9fa48("55947"), {
    metric: 'Care Coordination',
    value: '< 4 hrs',
    improvement: '89% faster'
  }), stryMutAct_9fa48("55951") ? {} : (stryCov_9fa48("55951"), {
    metric: 'Readmission Rate',
    value: '8.2%',
    improvement: '41% reduction'
  }), stryMutAct_9fa48("55955") ? {} : (stryCov_9fa48("55955"), {
    metric: 'Data Accessibility',
    value: '99.9%',
    improvement: '100% coverage'
  }), stryMutAct_9fa48("55959") ? {} : (stryCov_9fa48("55959"), {
    metric: 'Staff Efficiency',
    value: '+35%',
    improvement: 'Productivity gain'
  })]),
  quote: 'Our clinicians now have instant access to complete patient histories. This has directly improved patient outcomes and saved lives.',
  quotePerson: 'Dr. Michael Torres',
  quoteRole: 'Chief Medical Information Officer',
  tags: stryMutAct_9fa48("55966") ? [] : (stryCov_9fa48("55966"), ['Healthcare', 'HIPAA', 'Patient Care', 'Real-time Analytics']),
  featured: stryMutAct_9fa48("55971") ? false : (stryCov_9fa48("55971"), true)
}), stryMutAct_9fa48("55972") ? {} : (stryCov_9fa48("55972"), {
  id: 'global-manufacturer',
  company: 'Global Manufacturing Corp',
  industry: 'Manufacturing',
  logo: '🏭',
  challenge: 'Supply chain visibility limited to 48-hour lag. Quality issues detected too late, resulting in $50M+ annual waste.',
  solution: 'Deployed Datacendia IoT integration with predictive quality analytics and real-time supply chain monitoring across 23 facilities.',
  results: stryMutAct_9fa48("55979") ? [] : (stryCov_9fa48("55979"), [stryMutAct_9fa48("55980") ? {} : (stryCov_9fa48("55980"), {
    metric: 'Supply Chain Visibility',
    value: 'Real-time',
    improvement: '48hr → instant'
  }), stryMutAct_9fa48("55984") ? {} : (stryCov_9fa48("55984"), {
    metric: 'Quality Defects',
    value: '-67%',
    improvement: 'Reduction'
  }), stryMutAct_9fa48("55988") ? {} : (stryCov_9fa48("55988"), {
    metric: 'Waste Reduction',
    value: '$38M',
    improvement: 'Annual savings'
  }), stryMutAct_9fa48("55992") ? {} : (stryCov_9fa48("55992"), {
    metric: 'Downtime',
    value: '-82%',
    improvement: 'Unplanned stops'
  })]),
  quote: 'The predictive capabilities have fundamentally changed how we operate. We prevent problems before they happen.',
  quotePerson: 'James Morrison',
  quoteRole: 'VP of Operations',
  tags: stryMutAct_9fa48("55999") ? [] : (stryCov_9fa48("55999"), ['Manufacturing', 'IoT', 'Supply Chain', 'Predictive Analytics']),
  featured: stryMutAct_9fa48("56004") ? true : (stryCov_9fa48("56004"), false)
}), stryMutAct_9fa48("56005") ? {} : (stryCov_9fa48("56005"), {
  id: 'ecommerce-leader',
  company: 'E-Commerce Market Leader',
  industry: 'Retail',
  logo: '🛍️',
  challenge: 'Customer data fragmented across 15 platforms. Personalization limited, cart abandonment at 78%.',
  solution: 'Unified customer data platform with Datacendia, enabling real-time personalization and AI-powered recommendations.',
  results: stryMutAct_9fa48("56012") ? [] : (stryCov_9fa48("56012"), [stryMutAct_9fa48("56013") ? {} : (stryCov_9fa48("56013"), {
    metric: 'Cart Abandonment',
    value: '52%',
    improvement: '33% reduction'
  }), stryMutAct_9fa48("56017") ? {} : (stryCov_9fa48("56017"), {
    metric: 'Conversion Rate',
    value: '+28%',
    improvement: 'Increase'
  }), stryMutAct_9fa48("56021") ? {} : (stryCov_9fa48("56021"), {
    metric: 'Customer LTV',
    value: '+45%',
    improvement: 'Improvement'
  }), stryMutAct_9fa48("56025") ? {} : (stryCov_9fa48("56025"), {
    metric: 'Revenue Impact',
    value: '+$127M',
    improvement: 'Annual'
  })]),
  quote: 'The unified customer view enabled personalization we never thought possible. Our conversion rates speak for themselves.',
  quotePerson: 'Amanda Rodriguez',
  quoteRole: 'Chief Marketing Officer',
  tags: stryMutAct_9fa48("56032") ? [] : (stryCov_9fa48("56032"), ['Retail', 'E-commerce', 'Personalization', 'Customer 360']),
  featured: stryMutAct_9fa48("56037") ? true : (stryCov_9fa48("56037"), false)
}), stryMutAct_9fa48("56038") ? {} : (stryCov_9fa48("56038"), {
  id: 'energy-utility',
  company: 'National Energy Provider',
  industry: 'Energy & Utilities',
  logo: '⚡',
  challenge: 'Grid monitoring data from 2M+ sensors with 6-hour analysis lag. Outage response times averaging 4.5 hours.',
  solution: 'Real-time grid analytics with Datacendia streaming architecture, predictive maintenance, and automated response orchestration.',
  results: stryMutAct_9fa48("56045") ? [] : (stryCov_9fa48("56045"), [stryMutAct_9fa48("56046") ? {} : (stryCov_9fa48("56046"), {
    metric: 'Outage Response',
    value: '< 45 min',
    improvement: '83% faster'
  }), stryMutAct_9fa48("56050") ? {} : (stryCov_9fa48("56050"), {
    metric: 'Predictive Accuracy',
    value: '94%',
    improvement: 'Equipment failure'
  }), stryMutAct_9fa48("56054") ? {} : (stryCov_9fa48("56054"), {
    metric: 'Customer Downtime',
    value: '-71%',
    improvement: 'Reduction'
  }), stryMutAct_9fa48("56058") ? {} : (stryCov_9fa48("56058"), {
    metric: 'Operational Costs',
    value: '-$23M',
    improvement: 'Annual'
  })]),
  quote: 'Datacendia gave us the ability to see problems coming before they affect customers. Grid reliability has never been higher.',
  quotePerson: 'Robert Kim',
  quoteRole: 'Director of Grid Operations',
  tags: stryMutAct_9fa48("56065") ? [] : (stryCov_9fa48("56065"), ['Energy', 'IoT', 'Predictive Maintenance', 'Real-time']),
  featured: stryMutAct_9fa48("56070") ? true : (stryCov_9fa48("56070"), false)
})]);
const useCases: UseCase[] = stryMutAct_9fa48("56071") ? [] : (stryCov_9fa48("56071"), [stryMutAct_9fa48("56072") ? {} : (stryCov_9fa48("56072"), {
  id: 'customer-360',
  title: 'Customer 360 Intelligence',
  industry: 'Cross-Industry',
  icon: '👤',
  description: 'Unify customer data from every touchpoint to create a comprehensive, real-time view of customer behavior, preferences, and lifetime value.',
  capabilities: stryMutAct_9fa48("56078") ? [] : (stryCov_9fa48("56078"), ['Real-time data unification from CRM, marketing, support, transactions', 'AI-powered segmentation and propensity scoring', 'Predictive churn modeling and retention triggers', 'Personalization engine integration']),
  outcomes: stryMutAct_9fa48("56083") ? [] : (stryCov_9fa48("56083"), ['360° customer view in < 100ms', '25-40% improvement in retention', '20-35% increase in cross-sell', '50%+ reduction in data silos'])
}), stryMutAct_9fa48("56088") ? {} : (stryCov_9fa48("56088"), {
  id: 'risk-compliance',
  title: 'Risk & Compliance Automation',
  industry: 'Financial Services',
  icon: '🛡️',
  description: 'Automate regulatory compliance monitoring, risk assessment, and reporting with real-time data integration and AI-powered analysis.',
  capabilities: stryMutAct_9fa48("56094") ? [] : (stryCov_9fa48("56094"), ['Automated regulatory reporting (SOX, Basel III, GDPR)', 'Real-time fraud detection and AML monitoring', 'Credit risk scoring with explainable AI', 'Audit trail and data lineage tracking']),
  outcomes: stryMutAct_9fa48("56099") ? [] : (stryCov_9fa48("56099"), ['90%+ reduction in compliance effort', 'Real-time risk visibility', '99.9% audit accuracy', '$2-5M annual savings typical'])
}), stryMutAct_9fa48("56104") ? {} : (stryCov_9fa48("56104"), {
  id: 'supply-chain',
  title: 'Supply Chain Optimization',
  industry: 'Manufacturing & Retail',
  icon: '📦',
  description: 'End-to-end supply chain visibility with predictive analytics, demand forecasting, and intelligent inventory optimization.',
  capabilities: stryMutAct_9fa48("56110") ? [] : (stryCov_9fa48("56110"), ['Real-time supplier and logistics tracking', 'Demand forecasting with ML models', 'Inventory optimization algorithms', 'Supplier risk monitoring']),
  outcomes: stryMutAct_9fa48("56115") ? [] : (stryCov_9fa48("56115"), ['30-50% inventory reduction', '95%+ forecast accuracy', '40% faster response to disruptions', '15-25% logistics cost savings'])
}), stryMutAct_9fa48("56120") ? {} : (stryCov_9fa48("56120"), {
  id: 'operational-excellence',
  title: 'Operational Excellence',
  industry: 'Cross-Industry',
  icon: '⚙️',
  description: 'Transform operations with real-time monitoring, predictive maintenance, and intelligent process automation.',
  capabilities: stryMutAct_9fa48("56126") ? [] : (stryCov_9fa48("56126"), ['Real-time operational dashboards', 'Predictive maintenance with IoT integration', 'Process mining and optimization', 'Automated anomaly detection']),
  outcomes: stryMutAct_9fa48("56131") ? [] : (stryCov_9fa48("56131"), ['80%+ reduction in unplanned downtime', '30-40% maintenance cost savings', '25% improvement in efficiency', 'Real-time decision enablement'])
}), stryMutAct_9fa48("56136") ? {} : (stryCov_9fa48("56136"), {
  id: 'clinical-intelligence',
  title: 'Clinical Intelligence',
  industry: 'Healthcare',
  icon: '🏥',
  description: 'HIPAA-compliant patient data unification for improved care coordination, clinical decision support, and population health management.',
  capabilities: stryMutAct_9fa48("56142") ? [] : (stryCov_9fa48("56142"), ['Unified patient health records', 'Clinical decision support systems', 'Population health analytics', 'Care coordination workflows']),
  outcomes: stryMutAct_9fa48("56147") ? [] : (stryCov_9fa48("56147"), ['40%+ reduction in readmissions', 'Real-time clinical insights', '90% improvement in care coordination', 'Better patient outcomes'])
}), stryMutAct_9fa48("56152") ? {} : (stryCov_9fa48("56152"), {
  id: 'revenue-intelligence',
  title: 'Revenue Intelligence',
  industry: 'Cross-Industry',
  icon: '💰',
  description: 'Unify sales, marketing, and customer data to optimize revenue operations, improve forecasting, and accelerate deal cycles.',
  capabilities: stryMutAct_9fa48("56158") ? [] : (stryCov_9fa48("56158"), ['Pipeline analytics and forecasting', 'Deal scoring and prioritization', 'Revenue attribution modeling', 'Sales performance optimization']),
  outcomes: stryMutAct_9fa48("56163") ? [] : (stryCov_9fa48("56163"), ['20-30% improvement in forecast accuracy', '15% faster deal cycles', '25% increase in win rates', 'Full revenue visibility'])
})]);
const demos: Demo[] = stryMutAct_9fa48("56168") ? [] : (stryCov_9fa48("56168"), [stryMutAct_9fa48("56169") ? {} : (stryCov_9fa48("56169"), {
  id: 'platform-tour',
  title: 'Platform Overview Tour',
  description: 'A comprehensive walkthrough of the Datacendia platform, covering all major features and capabilities.',
  duration: '15 min',
  thumbnail: '🎬',
  category: 'Overview'
}), stryMutAct_9fa48("56176") ? {} : (stryCov_9fa48("56176"), {
  id: 'knowledge-graph',
  title: 'Knowledge Graph in Action',
  description: 'See how the Knowledge Graph automatically connects and enriches your data for instant insights.',
  duration: '8 min',
  thumbnail: '🕸️',
  category: 'Features'
}), stryMutAct_9fa48("56183") ? {} : (stryCov_9fa48("56183"), {
  id: 'ai-agents',
  title: 'AI Agents & Natural Language',
  description: 'Interact with your data using natural language queries powered by our AI advisory system.',
  duration: '10 min',
  thumbnail: '🤖',
  category: 'Features'
}), stryMutAct_9fa48("56190") ? {} : (stryCov_9fa48("56190"), {
  id: 'workflow-automation',
  title: 'Workflow Automation Builder',
  description: 'Build sophisticated data workflows with our visual drag-and-drop automation designer.',
  duration: '12 min',
  thumbnail: '⚡',
  category: 'Features'
}), stryMutAct_9fa48("56197") ? {} : (stryCov_9fa48("56197"), {
  id: 'integration-setup',
  title: 'Connector Setup & Data Integration',
  description: 'Connect your data sources in minutes with our pre-built connectors and integration framework.',
  duration: '6 min',
  thumbnail: '🔗',
  category: 'Getting Started'
}), stryMutAct_9fa48("56204") ? {} : (stryCov_9fa48("56204"), {
  id: 'security-compliance',
  title: 'Security & Compliance Features',
  description: 'Deep dive into enterprise security, access controls, audit logging, and compliance capabilities.',
  duration: '10 min',
  thumbnail: '🔒',
  category: 'Enterprise'
})]);

// =============================================================================
// COMPONENTS
// =============================================================================

const PageHeader: React.FC = () => {
  const navigate = useNavigate();
  return <header className="bg-white border-b border-neutral-200 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">D</span>
          </div>
          <span className="text-xl font-bold text-neutral-900">Datacendia</span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link to="/product" className="text-neutral-600 hover:text-neutral-900">Product</Link>
          <Link to="/pricing" className="text-neutral-600 hover:text-neutral-900">Pricing</Link>
          <Link to="/showcases" className="text-primary-600 font-medium">Showcases</Link>
          <Link to="/services" className="text-neutral-600 hover:text-neutral-900">Services</Link>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={stryMutAct_9fa48("56212") ? () => undefined : (stryCov_9fa48("56212"), () => navigate('/login'))} className="text-neutral-600 hover:text-neutral-900 font-medium">
            Sign In
          </button>
          <button onClick={stryMutAct_9fa48("56214") ? () => undefined : (stryCov_9fa48("56214"), () => navigate('/demo'))} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Request Demo
          </button>
        </div>
      </div>
    </header>;
};
const PageFooter: React.FC = stryMutAct_9fa48("56216") ? () => undefined : (stryCov_9fa48("56216"), (() => {
  const PageFooter: React.FC = () => <footer className="bg-neutral-900 text-white py-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid md:grid-cols-4 gap-8 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="font-bold">Datacendia</span>
          </div>
          <p className="text-neutral-400 text-sm">Sovereign Enterprise Intelligence</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Product</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><Link to="/product" className="hover:text-white">Features</Link></li>
            <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
            <li><Link to="/downloads" className="hover:text-white">Downloads</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Resources</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><Link to="/showcases" className="hover:text-white">Customer Stories</Link></li>
            <li><Link to="/services" className="hover:text-white">Professional Services</Link></li>
            <li><Link to="/demo" className="hover:text-white">Request Demo</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3">Legal</h4>
          <ul className="space-y-2 text-neutral-400 text-sm">
            <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
            <li><Link to="/license" className="hover:text-white">License</Link></li>
          </ul>
        </div>
      </div>
      <div className="pt-8 border-t border-neutral-800 text-center text-neutral-400 text-sm">
        © {new Date().getFullYear()} Datacendia. All rights reserved.
      </div>
    </div>
  </footer>;
  return PageFooter;
})());

// =============================================================================
// SHOWCASES PAGE
// =============================================================================

export const ShowcasesPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'stories' | 'usecases' | 'demos'>('stories');
  const [industryFilter, setIndustryFilter] = useState<string>('all');
  const industries = stryMutAct_9fa48("56220") ? [] : (stryCov_9fa48("56220"), ['all', 'Financial Services', 'Healthcare', 'Manufacturing', 'Retail', 'Energy & Utilities']);
  const filteredCaseStudies = (stryMutAct_9fa48("56229") ? industryFilter !== 'all' : stryMutAct_9fa48("56228") ? false : stryMutAct_9fa48("56227") ? true : (stryCov_9fa48("56227", "56228", "56229"), industryFilter === 'all')) ? caseStudies : stryMutAct_9fa48("56231") ? caseStudies : (stryCov_9fa48("56231"), caseStudies.filter(stryMutAct_9fa48("56232") ? () => undefined : (stryCov_9fa48("56232"), cs => stryMutAct_9fa48("56235") ? cs.industry !== industryFilter : stryMutAct_9fa48("56234") ? false : stryMutAct_9fa48("56233") ? true : (stryCov_9fa48("56233", "56234", "56235"), cs.industry === industryFilter))));
  return <div className="min-h-screen bg-neutral-50">
      <PageHeader />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Customer Showcases</h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Discover how leading organizations transform their data into competitive advantage with Datacendia
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={stryMutAct_9fa48("56236") ? () => undefined : (stryCov_9fa48("56236"), () => navigate('/demo'))} className="px-6 py-3 bg-white text-primary-600 font-semibold rounded-lg hover:bg-white/90">
              Request Your Demo
            </button>
            <button onClick={stryMutAct_9fa48("56238") ? () => undefined : (stryCov_9fa48("56238"), () => setActiveTab('demos'))} className="px-6 py-3 border border-white/30 text-white font-semibold rounded-lg hover:bg-white/10">
              Watch Platform Demos
            </button>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="bg-white border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-8">
            {(stryMutAct_9fa48("56240") ? [] : (stryCov_9fa48("56240"), [stryMutAct_9fa48("56241") ? {} : (stryCov_9fa48("56241"), {
            id: 'stories',
            label: 'Customer Stories',
            icon: '📊'
          }), stryMutAct_9fa48("56245") ? {} : (stryCov_9fa48("56245"), {
            id: 'usecases',
            label: 'Use Cases',
            icon: '🎯'
          }), stryMutAct_9fa48("56249") ? {} : (stryCov_9fa48("56249"), {
            id: 'demos',
            label: 'Platform Demos',
            icon: '🎬'
          })])).map(stryMutAct_9fa48("56253") ? () => undefined : (stryCov_9fa48("56253"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("56254") ? () => undefined : (stryCov_9fa48("56254"), () => setActiveTab(tab.id as any))} className={cn('py-4 border-b-2 font-medium transition-colors', (stryMutAct_9fa48("56258") ? activeTab !== tab.id : stryMutAct_9fa48("56257") ? false : stryMutAct_9fa48("56256") ? true : (stryCov_9fa48("56256", "56257", "56258"), activeTab === tab.id)) ? 'border-primary-600 text-primary-600' : 'border-transparent text-neutral-500 hover:text-neutral-900')}>
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>))}
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Customer Stories Tab */}
          {stryMutAct_9fa48("56263") ? activeTab === 'stories' || <>
              {/* Industry Filter */}
              <div className="mb-8 flex flex-wrap gap-2">
                {industries.map(industry => <button key={industry} onClick={() => setIndustryFilter(industry)} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-colors', industryFilter === industry ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300')}>
                    {industry === 'all' ? 'All Industries' : industry}
                  </button>)}
              </div>

              {/* Featured Case Studies */}
              <div className="space-y-8">
                {filteredCaseStudies.filter(cs => cs.featured).map(study => <div key={study.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">{study.logo}</span>
                          <div>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                              Featured
                            </span>
                            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{study.company}</h3>
                            <p className="text-neutral-500">{study.industry}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">The Challenge</h4>
                          <p className="text-neutral-600">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">The Solution</h4>
                          <p className="text-neutral-600">{study.solution}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {study.results.map(result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-primary-600">{result.value}</p>
                            <p className="text-sm text-neutral-600">{result.metric}</p>
                            <p className="text-xs text-success-600 font-medium mt-1">{result.improvement}</p>
                          </div>)}
                      </div>

                      <blockquote className="border-l-4 border-primary-600 pl-4 italic text-neutral-600">
                        "{study.quote}"
                        <footer className="mt-2 not-italic">
                          <strong className="text-neutral-900">{study.quotePerson}</strong>
                          <span className="text-neutral-500"> — {study.quoteRole}</span>
                        </footer>
                      </blockquote>

                      <div className="flex flex-wrap gap-2 mt-6">
                        {study.tags.map(tag => <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            {tag}
                          </span>)}
                      </div>
                    </div>
                  </div>)}
              </div>

              {/* Regular Case Studies Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {filteredCaseStudies.filter(cs => !cs.featured).map(study => <div key={study.id} className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{study.logo}</span>
                      <div>
                        <h3 className="font-bold text-neutral-900">{study.company}</h3>
                        <p className="text-sm text-neutral-500">{study.industry}</p>
                      </div>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4">{study.challenge}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {study.results.slice(0, 2).map(result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-primary-600">{result.value}</p>
                          <p className="text-xs text-neutral-500">{result.metric}</p>
                        </div>)}
                    </div>

                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Read Full Story →
                    </button>
                  </div>)}
              </div>
            </> : stryMutAct_9fa48("56262") ? false : stryMutAct_9fa48("56261") ? true : (stryCov_9fa48("56261", "56262", "56263"), (stryMutAct_9fa48("56265") ? activeTab !== 'stories' : stryMutAct_9fa48("56264") ? true : (stryCov_9fa48("56264", "56265"), activeTab === 'stories')) && <>
              {/* Industry Filter */}
              <div className="mb-8 flex flex-wrap gap-2">
                {industries.map(stryMutAct_9fa48("56267") ? () => undefined : (stryCov_9fa48("56267"), industry => <button key={industry} onClick={stryMutAct_9fa48("56268") ? () => undefined : (stryCov_9fa48("56268"), () => setIndustryFilter(industry))} className={cn('px-4 py-2 rounded-full text-sm font-medium transition-colors', (stryMutAct_9fa48("56272") ? industryFilter !== industry : stryMutAct_9fa48("56271") ? false : stryMutAct_9fa48("56270") ? true : (stryCov_9fa48("56270", "56271", "56272"), industryFilter === industry)) ? 'bg-primary-600 text-white' : 'bg-white text-neutral-600 border border-neutral-200 hover:border-primary-300')}>
                    {(stryMutAct_9fa48("56277") ? industry !== 'all' : stryMutAct_9fa48("56276") ? false : stryMutAct_9fa48("56275") ? true : (stryCov_9fa48("56275", "56276", "56277"), industry === 'all')) ? 'All Industries' : industry}
                  </button>))}
              </div>

              {/* Featured Case Studies */}
              <div className="space-y-8">
                {stryMutAct_9fa48("56280") ? filteredCaseStudies.map(study => <div key={study.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">{study.logo}</span>
                          <div>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                              Featured
                            </span>
                            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{study.company}</h3>
                            <p className="text-neutral-500">{study.industry}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">The Challenge</h4>
                          <p className="text-neutral-600">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">The Solution</h4>
                          <p className="text-neutral-600">{study.solution}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {study.results.map(result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-primary-600">{result.value}</p>
                            <p className="text-sm text-neutral-600">{result.metric}</p>
                            <p className="text-xs text-success-600 font-medium mt-1">{result.improvement}</p>
                          </div>)}
                      </div>

                      <blockquote className="border-l-4 border-primary-600 pl-4 italic text-neutral-600">
                        "{study.quote}"
                        <footer className="mt-2 not-italic">
                          <strong className="text-neutral-900">{study.quotePerson}</strong>
                          <span className="text-neutral-500"> — {study.quoteRole}</span>
                        </footer>
                      </blockquote>

                      <div className="flex flex-wrap gap-2 mt-6">
                        {study.tags.map(tag => <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            {tag}
                          </span>)}
                      </div>
                    </div>
                  </div>) : (stryCov_9fa48("56280"), filteredCaseStudies.filter(stryMutAct_9fa48("56281") ? () => undefined : (stryCov_9fa48("56281"), cs => cs.featured)).map(stryMutAct_9fa48("56282") ? () => undefined : (stryCov_9fa48("56282"), study => <div key={study.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden">
                    <div className="p-8">
                      <div className="flex items-start justify-between mb-6">
                        <div className="flex items-center gap-4">
                          <span className="text-5xl">{study.logo}</span>
                          <div>
                            <span className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                              Featured
                            </span>
                            <h3 className="text-2xl font-bold text-neutral-900 mt-1">{study.company}</h3>
                            <p className="text-neutral-500">{study.industry}</p>
                          </div>
                        </div>
                      </div>

                      <div className="grid md:grid-cols-2 gap-8 mb-8">
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">The Challenge</h4>
                          <p className="text-neutral-600">{study.challenge}</p>
                        </div>
                        <div>
                          <h4 className="font-semibold text-neutral-900 mb-2">The Solution</h4>
                          <p className="text-neutral-600">{study.solution}</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                        {study.results.map(stryMutAct_9fa48("56283") ? () => undefined : (stryCov_9fa48("56283"), result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-4 text-center">
                            <p className="text-2xl font-bold text-primary-600">{result.value}</p>
                            <p className="text-sm text-neutral-600">{result.metric}</p>
                            <p className="text-xs text-success-600 font-medium mt-1">{result.improvement}</p>
                          </div>))}
                      </div>

                      <blockquote className="border-l-4 border-primary-600 pl-4 italic text-neutral-600">
                        "{study.quote}"
                        <footer className="mt-2 not-italic">
                          <strong className="text-neutral-900">{study.quotePerson}</strong>
                          <span className="text-neutral-500"> — {study.quoteRole}</span>
                        </footer>
                      </blockquote>

                      <div className="flex flex-wrap gap-2 mt-6">
                        {study.tags.map(stryMutAct_9fa48("56284") ? () => undefined : (stryCov_9fa48("56284"), tag => <span key={tag} className="px-2 py-1 bg-neutral-100 text-neutral-600 text-xs rounded">
                            {tag}
                          </span>))}
                      </div>
                    </div>
                  </div>)))}
              </div>

              {/* Regular Case Studies Grid */}
              <div className="grid md:grid-cols-2 gap-6 mt-8">
                {stryMutAct_9fa48("56285") ? filteredCaseStudies.map(study => <div key={study.id} className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{study.logo}</span>
                      <div>
                        <h3 className="font-bold text-neutral-900">{study.company}</h3>
                        <p className="text-sm text-neutral-500">{study.industry}</p>
                      </div>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4">{study.challenge}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {study.results.slice(0, 2).map(result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-primary-600">{result.value}</p>
                          <p className="text-xs text-neutral-500">{result.metric}</p>
                        </div>)}
                    </div>

                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Read Full Story →
                    </button>
                  </div>) : (stryCov_9fa48("56285"), filteredCaseStudies.filter(stryMutAct_9fa48("56286") ? () => undefined : (stryCov_9fa48("56286"), cs => stryMutAct_9fa48("56287") ? cs.featured : (stryCov_9fa48("56287"), !cs.featured))).map(stryMutAct_9fa48("56288") ? () => undefined : (stryCov_9fa48("56288"), study => <div key={study.id} className="bg-white rounded-xl border border-neutral-200 p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl">{study.logo}</span>
                      <div>
                        <h3 className="font-bold text-neutral-900">{study.company}</h3>
                        <p className="text-sm text-neutral-500">{study.industry}</p>
                      </div>
                    </div>

                    <p className="text-neutral-600 text-sm mb-4">{study.challenge}</p>

                    <div className="grid grid-cols-2 gap-3 mb-4">
                      {stryMutAct_9fa48("56289") ? study.results.map(result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-primary-600">{result.value}</p>
                          <p className="text-xs text-neutral-500">{result.metric}</p>
                        </div>) : (stryCov_9fa48("56289"), study.results.slice(0, 2).map(stryMutAct_9fa48("56290") ? () => undefined : (stryCov_9fa48("56290"), result => <div key={result.metric} className="bg-neutral-50 rounded-lg p-3 text-center">
                          <p className="text-xl font-bold text-primary-600">{result.value}</p>
                          <p className="text-xs text-neutral-500">{result.metric}</p>
                        </div>)))}
                    </div>

                    <button className="text-primary-600 hover:text-primary-700 text-sm font-medium">
                      Read Full Story →
                    </button>
                  </div>)))}
              </div>
            </>)}

          {/* Use Cases Tab */}
          {stryMutAct_9fa48("56293") ? activeTab === 'usecases' || <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map(useCase => <div key={useCase.id} className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{useCase.icon}</span>
                    <div>
                      <h3 className="font-bold text-neutral-900">{useCase.title}</h3>
                      <p className="text-sm text-neutral-500">{useCase.industry}</p>
                    </div>
                  </div>

                  <p className="text-neutral-600 text-sm mb-4">{useCase.description}</p>

                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Key Capabilities</h4>
                    <ul className="space-y-1">
                      {useCase.capabilities.slice(0, 3).map(cap => <li key={cap} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span className="text-primary-600 mt-0.5">•</span>
                          {cap}
                        </li>)}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Expected Outcomes</h4>
                    <div className="flex flex-wrap gap-2">
                      {useCase.outcomes.slice(0, 2).map(outcome => <span key={outcome} className="px-2 py-1 bg-success-50 text-success-700 text-xs rounded">
                          {outcome}
                        </span>)}
                    </div>
                  </div>

                  <button onClick={() => navigate('/demo')} className="w-full mt-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-sm font-medium">
                    Learn More
                  </button>
                </div>)}
            </div> : stryMutAct_9fa48("56292") ? false : stryMutAct_9fa48("56291") ? true : (stryCov_9fa48("56291", "56292", "56293"), (stryMutAct_9fa48("56295") ? activeTab !== 'usecases' : stryMutAct_9fa48("56294") ? true : (stryCov_9fa48("56294", "56295"), activeTab === 'usecases')) && <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {useCases.map(stryMutAct_9fa48("56297") ? () => undefined : (stryCov_9fa48("56297"), useCase => <div key={useCase.id} className="bg-white rounded-xl border border-neutral-200 p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-4xl">{useCase.icon}</span>
                    <div>
                      <h3 className="font-bold text-neutral-900">{useCase.title}</h3>
                      <p className="text-sm text-neutral-500">{useCase.industry}</p>
                    </div>
                  </div>

                  <p className="text-neutral-600 text-sm mb-4">{useCase.description}</p>

                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Key Capabilities</h4>
                    <ul className="space-y-1">
                      {stryMutAct_9fa48("56298") ? useCase.capabilities.map(cap => <li key={cap} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span className="text-primary-600 mt-0.5">•</span>
                          {cap}
                        </li>) : (stryCov_9fa48("56298"), useCase.capabilities.slice(0, 3).map(stryMutAct_9fa48("56299") ? () => undefined : (stryCov_9fa48("56299"), cap => <li key={cap} className="flex items-start gap-2 text-sm text-neutral-600">
                          <span className="text-primary-600 mt-0.5">•</span>
                          {cap}
                        </li>)))}
                    </ul>
                  </div>

                  <div className="pt-4 border-t border-neutral-100">
                    <h4 className="text-xs font-semibold text-neutral-500 uppercase mb-2">Expected Outcomes</h4>
                    <div className="flex flex-wrap gap-2">
                      {stryMutAct_9fa48("56300") ? useCase.outcomes.map(outcome => <span key={outcome} className="px-2 py-1 bg-success-50 text-success-700 text-xs rounded">
                          {outcome}
                        </span>) : (stryCov_9fa48("56300"), useCase.outcomes.slice(0, 2).map(stryMutAct_9fa48("56301") ? () => undefined : (stryCov_9fa48("56301"), outcome => <span key={outcome} className="px-2 py-1 bg-success-50 text-success-700 text-xs rounded">
                          {outcome}
                        </span>)))}
                    </div>
                  </div>

                  <button onClick={stryMutAct_9fa48("56302") ? () => undefined : (stryCov_9fa48("56302"), () => navigate('/demo'))} className="w-full mt-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 text-sm font-medium">
                    Learn More
                  </button>
                </div>))}
            </div>)}

          {/* Demos Tab */}
          {stryMutAct_9fa48("56306") ? activeTab === 'demos' || <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map(demo => <div key={demo.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                      <span className="text-6xl">{demo.thumbnail}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                        {demo.duration}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary-600 font-medium">{demo.category}</span>
                      <h3 className="font-bold text-neutral-900 mt-1">{demo.title}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{demo.description}</p>
                    </div>
                  </div>)}
              </div>

              <div className="mt-12 bg-primary-50 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Want a Personalized Demo?</h3>
                <p className="text-neutral-600 mb-6">
                  Get a tailored walkthrough focused on your specific use cases and requirements
                </p>
                <button onClick={() => navigate('/demo')} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700">
                  Schedule Your Demo
                </button>
              </div>
            </> : stryMutAct_9fa48("56305") ? false : stryMutAct_9fa48("56304") ? true : (stryCov_9fa48("56304", "56305", "56306"), (stryMutAct_9fa48("56308") ? activeTab !== 'demos' : stryMutAct_9fa48("56307") ? true : (stryCov_9fa48("56307", "56308"), activeTab === 'demos')) && <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {demos.map(stryMutAct_9fa48("56310") ? () => undefined : (stryCov_9fa48("56310"), demo => <div key={demo.id} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-lg transition-shadow group cursor-pointer">
                    <div className="aspect-video bg-gradient-to-br from-primary-100 to-primary-200 flex items-center justify-center relative">
                      <span className="text-6xl">{demo.thumbnail}</span>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                        <div className="w-16 h-16 rounded-full bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <svg className="w-8 h-8 text-primary-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M8 5v14l11-7z" />
                          </svg>
                        </div>
                      </div>
                      <span className="absolute top-2 right-2 px-2 py-1 bg-black/60 text-white text-xs rounded">
                        {demo.duration}
                      </span>
                    </div>
                    <div className="p-4">
                      <span className="text-xs text-primary-600 font-medium">{demo.category}</span>
                      <h3 className="font-bold text-neutral-900 mt-1">{demo.title}</h3>
                      <p className="text-sm text-neutral-500 mt-1">{demo.description}</p>
                    </div>
                  </div>))}
              </div>

              <div className="mt-12 bg-primary-50 rounded-xl p-8 text-center">
                <h3 className="text-2xl font-bold text-neutral-900 mb-2">Want a Personalized Demo?</h3>
                <p className="text-neutral-600 mb-6">
                  Get a tailored walkthrough focused on your specific use cases and requirements
                </p>
                <button onClick={stryMutAct_9fa48("56311") ? () => undefined : (stryCov_9fa48("56311"), () => navigate('/demo'))} className="px-8 py-3 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700">
                  Schedule Your Demo
                </button>
              </div>
            </>)}
        </div>
      </section>

      {/* Stats Banner */}
      <section className="bg-neutral-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <p className="text-4xl font-bold text-primary-400">500+</p>
              <p className="text-neutral-400 mt-1">Enterprise Customers</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-400">$2.1B+</p>
              <p className="text-neutral-400 mt-1">Customer Value Created</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-400">99.9%</p>
              <p className="text-neutral-400 mt-1">Platform Uptime</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary-400">45+</p>
              <p className="text-neutral-400 mt-1">Countries Served</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-neutral-900 mb-4">Ready to Transform Your Data?</h2>
          <p className="text-xl text-neutral-600 mb-8">
            Join hundreds of leading enterprises that trust Datacendia for their data intelligence
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={stryMutAct_9fa48("56313") ? () => undefined : (stryCov_9fa48("56313"), () => navigate('/demo'))} className="px-8 py-4 bg-primary-600 text-white font-semibold rounded-lg hover:bg-primary-700">
              Start Your Journey
            </button>
            <button onClick={stryMutAct_9fa48("56315") ? () => undefined : (stryCov_9fa48("56315"), () => navigate('/pricing'))} className="px-8 py-4 border border-neutral-300 text-neutral-700 font-semibold rounded-lg hover:bg-neutral-50">
              View Pricing
            </button>
          </div>
        </div>
      </section>

      <PageFooter />
    </div>;
};
export default ShowcasesPage;