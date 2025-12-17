// @ts-nocheck
// =============================================================================
// DATACENDIA VERTICALS HUB - INDUSTRY SOLUTIONS OVERVIEW
// Landing page for all vertical-specific solutions
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
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type VerticalTier = 'priority' | 'growth' | 'coming-soon';
interface Vertical {
  id: string;
  name: string;
  icon: string;
  tier: VerticalTier;
  marketShare?: string;
  roi: string;
  sovereignty: number;
  description: string;
  keyMetric: string;
  route: string;
  agents: string[];
  compliance: string[];
  status: 'ga' | 'beta' | 'coming-soon';
}

// =============================================================================
// DATA
// =============================================================================

const verticals: Vertical[] = stryMutAct_9fa48("64101") ? [] : (stryCov_9fa48("64101"), [// Tier 1: Priority
stryMutAct_9fa48("64102") ? {} : (stryCov_9fa48("64102"), {
  id: 'healthcare',
  name: 'Healthcare',
  icon: '🏥',
  tier: 'priority',
  marketShare: '43%',
  roi: '27%',
  sovereignty: 100,
  description: 'HIPAA-compliant clinical decision intelligence with full data sovereignty',
  keyMetric: '34% faster discharge decisions',
  route: '/verticals/healthcare',
  agents: stryMutAct_9fa48("64112") ? [] : (stryCov_9fa48("64112"), ['CMIO', 'Patient Safety Officer', 'Healthcare Compliance', 'Clinical Ops Director']),
  compliance: stryMutAct_9fa48("64117") ? [] : (stryCov_9fa48("64117"), ['HIPAA', 'HITECH', 'Joint Commission', 'CMS CoPs']),
  status: 'ga'
}), stryMutAct_9fa48("64123") ? {} : (stryCov_9fa48("64123"), {
  id: 'financial',
  name: 'Financial Services',
  icon: '💰',
  tier: 'priority',
  marketShare: '16%',
  roi: '34%',
  sovereignty: 98,
  description: 'Fraud detection, regulatory intelligence, and credit decisioning',
  keyMetric: '40% fraud reduction',
  route: '/verticals/financial-services',
  agents: stryMutAct_9fa48("64133") ? [] : (stryCov_9fa48("64133"), ['Quantitative Analyst', 'Portfolio Manager', 'Credit Risk Officer', 'Treasury Analyst']),
  compliance: stryMutAct_9fa48("64138") ? [] : (stryCov_9fa48("64138"), ['SOX', 'Basel III/IV', 'GDPR', 'AML/BSA', 'CFPB']),
  status: 'ga'
}), stryMutAct_9fa48("64145") ? {} : (stryCov_9fa48("64145"), {
  id: 'government',
  name: 'Government & Legal',
  icon: '🏛️',
  tier: 'priority',
  marketShare: '19%',
  roi: '38%',
  sovereignty: 100,
  description: 'Sovereign AI for policy, procurement, and contract intelligence',
  keyMetric: '60% faster contract review',
  route: '/verticals/government-legal',
  agents: stryMutAct_9fa48("64155") ? [] : (stryCov_9fa48("64155"), ['Policy Analyst', 'Procurement Officer', 'Legal Counsel', 'Ethics Officer']),
  compliance: stryMutAct_9fa48("64160") ? [] : (stryCov_9fa48("64160"), ['FedRAMP', 'FISMA', 'EU AI Act', 'FOIA']),
  status: 'ga'
}), stryMutAct_9fa48("64166") ? {} : (stryCov_9fa48("64166"), {
  id: 'insurance',
  name: 'Insurance',
  icon: '🛡️',
  tier: 'priority',
  roi: '29%',
  sovereignty: 92,
  description: 'Underwriting optimization and claims intelligence across 50+ jurisdictions',
  keyMetric: '29% loss ratio improvement',
  route: '/verticals/insurance',
  agents: stryMutAct_9fa48("64175") ? [] : (stryCov_9fa48("64175"), ['Chief Actuary', 'Underwriting Manager', 'Claims Director', 'Risk Manager']),
  compliance: stryMutAct_9fa48("64180") ? [] : (stryCov_9fa48("64180"), ['State Insurance Laws', 'NAIC', 'Solvency II', 'GDPR']),
  status: 'ga'
}), stryMutAct_9fa48("64186") ? {} : (stryCov_9fa48("64186"), {
  id: 'pharmaceutical',
  name: 'Pharmaceutical',
  icon: '💊',
  tier: 'priority',
  marketShare: '12%',
  roi: '31%',
  sovereignty: 95,
  description: 'Pipeline decisions and regulatory acceleration for life sciences',
  keyMetric: '31% faster Phase II decisions',
  route: '/verticals/pharmaceutical',
  agents: stryMutAct_9fa48("64196") ? [] : (stryCov_9fa48("64196"), ['Chief Scientific Officer', 'Regulatory Affairs', 'Clinical Operations', 'Medical Affairs']),
  compliance: stryMutAct_9fa48("64201") ? [] : (stryCov_9fa48("64201"), ['21 CFR Part 11', 'FDA AI Guidance', 'GxP', 'ICH Guidelines']),
  status: 'ga'
}), // Tier 2: Growth
stryMutAct_9fa48("64207") ? {} : (stryCov_9fa48("64207"), {
  id: 'manufacturing',
  name: 'Manufacturing',
  icon: '🏭',
  tier: 'growth',
  roi: '23%',
  sovereignty: 88,
  description: 'Supply chain resilience and operational intelligence',
  keyMetric: '23% inventory reduction',
  route: '/verticals/manufacturing',
  agents: stryMutAct_9fa48("64216") ? [] : (stryCov_9fa48("64216"), ['VP Operations', 'Supply Chain Director', 'Quality Manager', 'Plant Manager']),
  compliance: stryMutAct_9fa48("64221") ? [] : (stryCov_9fa48("64221"), ['ISO 9001', 'IATF 16949', 'AS9100', 'OSHA']),
  status: 'ga'
}), stryMutAct_9fa48("64227") ? {} : (stryCov_9fa48("64227"), {
  id: 'energy',
  name: 'Energy & Utilities',
  icon: '⚡',
  tier: 'growth',
  roi: '32%',
  sovereignty: 100,
  description: 'Grid intelligence and regulatory compliance for energy transition',
  keyMetric: '45% faster rate case prep',
  route: '/verticals/energy-utilities',
  agents: stryMutAct_9fa48("64236") ? [] : (stryCov_9fa48("64236"), ['Grid Operations', 'Regulatory Manager', 'Asset Manager', 'Trading Analyst']),
  compliance: stryMutAct_9fa48("64241") ? [] : (stryCov_9fa48("64241"), ['NERC CIP', 'FERC', 'EPA', 'State PUC']),
  status: 'ga'
}), stryMutAct_9fa48("64247") ? {} : (stryCov_9fa48("64247"), {
  id: 'technology',
  name: 'Technology / SaaS',
  icon: '💻',
  tier: 'growth',
  roi: '41%',
  sovereignty: 82,
  description: 'Product decision velocity and AI governance for tech companies',
  keyMetric: '41% faster releases',
  route: '/verticals/technology',
  agents: stryMutAct_9fa48("64256") ? [] : (stryCov_9fa48("64256"), ['Product Director', 'Engineering Lead', 'Security Architect', 'Growth Strategist']),
  compliance: stryMutAct_9fa48("64261") ? [] : (stryCov_9fa48("64261"), ['SOC 2', 'ISO 27001', 'GDPR', 'CCPA']),
  status: 'ga'
}), stryMutAct_9fa48("64267") ? {} : (stryCov_9fa48("64267"), {
  id: 'retail',
  name: 'Retail & Hospitality',
  icon: '🛒',
  tier: 'growth',
  roi: '19%',
  sovereignty: 85,
  description: 'Pricing optimization and revenue management intelligence',
  keyMetric: '19% margin improvement',
  route: '/verticals/retail-hospitality',
  agents: stryMutAct_9fa48("64276") ? [] : (stryCov_9fa48("64276"), ['Merchandising Director', 'Revenue Manager', 'Store Operations', 'Customer Experience']),
  compliance: stryMutAct_9fa48("64281") ? [] : (stryCov_9fa48("64281"), ['PCI-DSS', 'GDPR', 'CCPA', 'ADA']),
  status: 'ga'
}), stryMutAct_9fa48("64287") ? {} : (stryCov_9fa48("64287"), {
  id: 'real-estate',
  name: 'Real Estate / Construction',
  icon: '🏗️',
  tier: 'growth',
  roi: '24%',
  sovereignty: 85,
  description: 'Development decisions, project intelligence, and property analytics',
  keyMetric: '22% project cost savings',
  route: '/verticals/real-estate',
  agents: stryMutAct_9fa48("64296") ? [] : (stryCov_9fa48("64296"), ['Development Director', 'Construction Manager', 'Investment Analyst', 'Property Manager']),
  compliance: stryMutAct_9fa48("64301") ? [] : (stryCov_9fa48("64301"), ['Zoning Laws', 'Building Codes', 'Environmental', 'ADA']),
  status: 'ga'
}), stryMutAct_9fa48("64307") ? {} : (stryCov_9fa48("64307"), {
  id: 'transportation',
  name: 'Transportation / Logistics',
  icon: '🚚',
  tier: 'growth',
  roi: '26%',
  sovereignty: 88,
  description: 'Fleet optimization, route intelligence, and supply chain decisions',
  keyMetric: '18% fuel cost reduction',
  route: '/verticals/transportation',
  agents: stryMutAct_9fa48("64316") ? [] : (stryCov_9fa48("64316"), ['Fleet Director', 'Routing Manager', 'Logistics Analyst', 'Compliance Officer']),
  compliance: stryMutAct_9fa48("64321") ? [] : (stryCov_9fa48("64321"), ['DOT/FMCSA', 'Hours of Service', 'HAZMAT', 'Customs']),
  status: 'ga'
}), stryMutAct_9fa48("64327") ? {} : (stryCov_9fa48("64327"), {
  id: 'media',
  name: 'Media / Entertainment',
  icon: '🎬',
  tier: 'growth',
  roi: '29%',
  sovereignty: 80,
  description: 'Content strategy, audience intelligence, and rights management',
  keyMetric: '35% better content ROI',
  route: '/verticals/media-entertainment',
  agents: stryMutAct_9fa48("64336") ? [] : (stryCov_9fa48("64336"), ['Content Strategist', 'Audience Analyst', 'Rights Manager', 'Ad Operations']),
  compliance: stryMutAct_9fa48("64341") ? [] : (stryCov_9fa48("64341"), ['FCC', 'COPPA', 'Advertising Standards', 'Content Ratings']),
  status: 'ga'
}), stryMutAct_9fa48("64347") ? {} : (stryCov_9fa48("64347"), {
  id: 'professional-services',
  name: 'Professional Services',
  icon: '💼',
  tier: 'growth',
  roi: '28%',
  sovereignty: 92,
  description: 'Consulting, accounting, and advisory firm intelligence',
  keyMetric: '31% utilization improvement',
  route: '/verticals/professional-services',
  agents: stryMutAct_9fa48("64356") ? [] : (stryCov_9fa48("64356"), ['Managing Partner', 'Engagement Manager', 'Business Development', 'Quality & Risk']),
  compliance: stryMutAct_9fa48("64361") ? [] : (stryCov_9fa48("64361"), ['AICPA Standards', 'SEC Independence', 'PCAOB', 'State Bar Rules']),
  status: 'ga'
}), stryMutAct_9fa48("64367") ? {} : (stryCov_9fa48("64367"), {
  id: 'higher-education',
  name: 'Higher Education',
  icon: '🎓',
  tier: 'growth',
  roi: '21%',
  sovereignty: 95,
  description: 'Enrollment, research, and institutional intelligence',
  keyMetric: '23% yield improvement',
  route: '/verticals/higher-education',
  agents: stryMutAct_9fa48("64376") ? [] : (stryCov_9fa48("64376"), ['Enrollment Director', 'Academic Affairs', 'Research Director', 'CFO/Finance']),
  compliance: stryMutAct_9fa48("64381") ? [] : (stryCov_9fa48("64381"), ['FERPA', 'Title IX', 'ADA', 'Accreditation Standards']),
  status: 'ga'
}), stryMutAct_9fa48("64387") ? {} : (stryCov_9fa48("64387"), {
  id: 'sports',
  name: 'Sports / Athletics',
  icon: '🏟️',
  tier: 'growth',
  roi: '32%',
  sovereignty: 90,
  description: 'Team performance, player analytics, and sports business intelligence',
  keyMetric: '28% better draft picks',
  route: '/verticals/sports',
  agents: stryMutAct_9fa48("64396") ? [] : (stryCov_9fa48("64396"), ['Performance Director', 'Scouting Director', 'Sports Medicine', 'Revenue Director']),
  compliance: stryMutAct_9fa48("64401") ? [] : (stryCov_9fa48("64401"), ['Salary Cap Rules', 'League Regulations', 'Player Union', 'Anti-Doping']),
  status: 'ga'
}), // Tier 3: Coming Soon
stryMutAct_9fa48("64407") ? {} : (stryCov_9fa48("64407"), {
  id: 'telecom',
  name: 'Telecommunications',
  icon: '📡',
  tier: 'coming-soon',
  roi: '28%',
  sovereignty: 95,
  description: 'Network optimization and churn prediction',
  keyMetric: 'Coming Q2 2026',
  route: '/verticals/telecommunications',
  agents: stryMutAct_9fa48("64416") ? [] : (stryCov_9fa48("64416"), ['Network Operations', 'Customer Intelligence', 'Spectrum Manager', 'Revenue Assurance']),
  compliance: stryMutAct_9fa48("64421") ? [] : (stryCov_9fa48("64421"), ['FCC', 'CPNI', 'E911', 'Net Neutrality']),
  status: 'coming-soon'
}), stryMutAct_9fa48("64427") ? {} : (stryCov_9fa48("64427"), {
  id: 'agriculture',
  name: 'Agriculture & Food',
  icon: '🌾',
  tier: 'coming-soon',
  roi: '22%',
  sovereignty: 88,
  description: 'Supply chain and commodity decision intelligence',
  keyMetric: 'Coming Q2 2026',
  route: '/verticals/agriculture',
  agents: stryMutAct_9fa48("64436") ? [] : (stryCov_9fa48("64436"), ['Supply Chain Director', 'Commodity Trader', 'Quality Assurance', 'Sustainability']),
  compliance: stryMutAct_9fa48("64441") ? [] : (stryCov_9fa48("64441"), ['FDA FSMA', 'USDA', 'EU Farm to Fork']),
  status: 'coming-soon'
}), stryMutAct_9fa48("64446") ? {} : (stryCov_9fa48("64446"), {
  id: 'fintech',
  name: 'Consumer Fintech',
  icon: '💳',
  tier: 'coming-soon',
  roi: '35%',
  sovereignty: 85,
  description: 'Lending, payments, and consumer risk intelligence',
  keyMetric: 'Coming Q2 2026',
  route: '/verticals/consumer-fintech',
  agents: stryMutAct_9fa48("64455") ? [] : (stryCov_9fa48("64455"), ['Lending Director', 'Payments Operations', 'Risk Analyst', 'Product Manager']),
  compliance: stryMutAct_9fa48("64460") ? [] : (stryCov_9fa48("64460"), ['CFPB', 'State Lending Laws', 'PCI-DSS', 'GDPR']),
  status: 'coming-soon'
})]);

// =============================================================================
// COMPONENT
// =============================================================================

export const VerticalsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<VerticalTier | 'all'>('all');
  const [hoveredVertical, setHoveredVertical] = useState<string | null>(null);
  const filteredVerticals = (stryMutAct_9fa48("64470") ? selectedTier !== 'all' : stryMutAct_9fa48("64469") ? false : stryMutAct_9fa48("64468") ? true : (stryCov_9fa48("64468", "64469", "64470"), selectedTier === 'all')) ? verticals : stryMutAct_9fa48("64472") ? verticals : (stryCov_9fa48("64472"), verticals.filter(stryMutAct_9fa48("64473") ? () => undefined : (stryCov_9fa48("64473"), v => stryMutAct_9fa48("64476") ? v.tier !== selectedTier : stryMutAct_9fa48("64475") ? false : stryMutAct_9fa48("64474") ? true : (stryCov_9fa48("64474", "64475", "64476"), v.tier === selectedTier))));
  const tierColors = stryMutAct_9fa48("64477") ? {} : (stryCov_9fa48("64477"), {
    priority: 'border-primary-500 bg-primary-500/10',
    growth: 'border-green-500 bg-green-500/10',
    'coming-soon': 'border-neutral-500 bg-neutral-500/10'
  });
  const tierLabels = stryMutAct_9fa48("64481") ? {} : (stryCov_9fa48("64481"), {
    priority: stryMutAct_9fa48("64482") ? {} : (stryCov_9fa48("64482"), {
      label: 'Priority',
      color: 'text-primary-400',
      badge: '⭐ Wave 1'
    }),
    growth: stryMutAct_9fa48("64486") ? {} : (stryCov_9fa48("64486"), {
      label: 'Growth',
      color: 'text-green-400',
      badge: '📈 GA Now'
    }),
    'coming-soon': stryMutAct_9fa48("64490") ? {} : (stryCov_9fa48("64490"), {
      label: 'Coming Soon',
      color: 'text-neutral-400',
      badge: '🔜 Q2 2026'
    })
  });
  return <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Industry <span className="text-primary-400">Verticals</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Purpose-built AI decision intelligence for regulated industries. 
              Each vertical includes specialized agents, compliance frameworks, and industry-specific overlays.
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {(stryMutAct_9fa48("64494") ? [] : (stryCov_9fa48("64494"), [stryMutAct_9fa48("64495") ? {} : (stryCov_9fa48("64495"), {
            label: 'Vertical AI Market',
            value: '$3.5B',
            subtext: '2025 estimated'
          }), stryMutAct_9fa48("64499") ? {} : (stryCov_9fa48("64499"), {
            label: 'Healthcare Share',
            value: '43%',
            subtext: 'Largest vertical'
          }), stryMutAct_9fa48("64503") ? {} : (stryCov_9fa48("64503"), {
            label: 'Average ROI',
            value: '27%',
            subtext: '18-month benchmark'
          }), stryMutAct_9fa48("64507") ? {} : (stryCov_9fa48("64507"), {
            label: 'Time to Value',
            value: '2-4 wks',
            subtext: 'vs 6-18mo consulting'
          })])).map(stryMutAct_9fa48("64511") ? () => undefined : (stryCov_9fa48("64511"), stat => <div key={stat.label} className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center">
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="font-medium mt-1">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Tier Filter */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {(stryMutAct_9fa48("64512") ? [] : (stryCov_9fa48("64512"), [stryMutAct_9fa48("64513") ? {} : (stryCov_9fa48("64513"), {
            id: 'all',
            label: 'All Verticals',
            count: verticals.length
          }), stryMutAct_9fa48("64516") ? {} : (stryCov_9fa48("64516"), {
            id: 'priority',
            label: '⭐ Priority',
            count: stryMutAct_9fa48("64519") ? verticals.length : (stryCov_9fa48("64519"), verticals.filter(stryMutAct_9fa48("64520") ? () => undefined : (stryCov_9fa48("64520"), v => stryMutAct_9fa48("64523") ? v.tier !== 'priority' : stryMutAct_9fa48("64522") ? false : stryMutAct_9fa48("64521") ? true : (stryCov_9fa48("64521", "64522", "64523"), v.tier === 'priority'))).length)
          }), stryMutAct_9fa48("64525") ? {} : (stryCov_9fa48("64525"), {
            id: 'growth',
            label: '📈 Growth',
            count: stryMutAct_9fa48("64528") ? verticals.length : (stryCov_9fa48("64528"), verticals.filter(stryMutAct_9fa48("64529") ? () => undefined : (stryCov_9fa48("64529"), v => stryMutAct_9fa48("64532") ? v.tier !== 'growth' : stryMutAct_9fa48("64531") ? false : stryMutAct_9fa48("64530") ? true : (stryCov_9fa48("64530", "64531", "64532"), v.tier === 'growth'))).length)
          }), stryMutAct_9fa48("64534") ? {} : (stryCov_9fa48("64534"), {
            id: 'coming-soon',
            label: '🔜 Coming Soon',
            count: stryMutAct_9fa48("64537") ? verticals.length : (stryCov_9fa48("64537"), verticals.filter(stryMutAct_9fa48("64538") ? () => undefined : (stryCov_9fa48("64538"), v => stryMutAct_9fa48("64541") ? v.tier !== 'coming-soon' : stryMutAct_9fa48("64540") ? false : stryMutAct_9fa48("64539") ? true : (stryCov_9fa48("64539", "64540", "64541"), v.tier === 'coming-soon'))).length)
          })])).map(stryMutAct_9fa48("64543") ? () => undefined : (stryCov_9fa48("64543"), filter => <button key={filter.id} onClick={stryMutAct_9fa48("64544") ? () => undefined : (stryCov_9fa48("64544"), () => setSelectedTier(filter.id as typeof selectedTier))} className={`px-4 py-2 rounded-lg font-medium transition-all ${(stryMutAct_9fa48("64548") ? selectedTier !== filter.id : stryMutAct_9fa48("64547") ? false : stryMutAct_9fa48("64546") ? true : (stryCov_9fa48("64546", "64547", "64548"), selectedTier === filter.id)) ? 'bg-primary-600 text-white' : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'}`}>
                {filter.label} <span className="ml-1 opacity-60">({filter.count})</span>
              </button>))}
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>Showing {filteredVerticals.length} of {verticals.length}</span>
          </div>
        </div>

        {/* Vertical Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredVerticals.map(stryMutAct_9fa48("64551") ? () => undefined : (stryCov_9fa48("64551"), vertical => <div key={vertical.id} onClick={stryMutAct_9fa48("64552") ? () => undefined : (stryCov_9fa48("64552"), () => stryMutAct_9fa48("64555") ? vertical.status !== 'coming-soon' || navigate(vertical.route) : stryMutAct_9fa48("64554") ? false : stryMutAct_9fa48("64553") ? true : (stryCov_9fa48("64553", "64554", "64555"), (stryMutAct_9fa48("64557") ? vertical.status === 'coming-soon' : stryMutAct_9fa48("64556") ? true : (stryCov_9fa48("64556", "64557"), vertical.status !== 'coming-soon')) && navigate(vertical.route)))} onMouseEnter={stryMutAct_9fa48("64559") ? () => undefined : (stryCov_9fa48("64559"), () => setHoveredVertical(vertical.id))} onMouseLeave={stryMutAct_9fa48("64560") ? () => undefined : (stryCov_9fa48("64560"), () => setHoveredVertical(null))} className={`relative rounded-2xl border-2 p-6 transition-all duration-300 ${tierColors[vertical.tier]} ${(stryMutAct_9fa48("64564") ? vertical.status === 'coming-soon' : stryMutAct_9fa48("64563") ? false : stryMutAct_9fa48("64562") ? true : (stryCov_9fa48("64562", "64563", "64564"), vertical.status !== 'coming-soon')) ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl' : 'opacity-75'}`}>
              {/* Tier Badge */}
              <div className="absolute top-4 right-4">
                <span className={`px-2 py-1 rounded text-xs font-medium ${(stryMutAct_9fa48("64571") ? vertical.tier !== 'priority' : stryMutAct_9fa48("64570") ? false : stryMutAct_9fa48("64569") ? true : (stryCov_9fa48("64569", "64570", "64571"), vertical.tier === 'priority')) ? 'bg-primary-500/20 text-primary-400' : (stryMutAct_9fa48("64576") ? vertical.tier !== 'growth' : stryMutAct_9fa48("64575") ? false : stryMutAct_9fa48("64574") ? true : (stryCov_9fa48("64574", "64575", "64576"), vertical.tier === 'growth')) ? 'bg-green-500/20 text-green-400' : 'bg-neutral-500/20 text-neutral-400'}`}>
                  {tierLabels[vertical.tier].badge}
                </span>
              </div>

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{vertical.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{vertical.name}</h3>
                  {stryMutAct_9fa48("64582") ? vertical.marketShare || <p className="text-sm text-neutral-400">{vertical.marketShare} of vertical AI market</p> : stryMutAct_9fa48("64581") ? false : stryMutAct_9fa48("64580") ? true : (stryCov_9fa48("64580", "64581", "64582"), vertical.marketShare && <p className="text-sm text-neutral-400">{vertical.marketShare} of vertical AI market</p>)}
                </div>
              </div>

              {/* Description */}
              <p className="text-neutral-300 mb-4">{vertical.description}</p>

              {/* Key Metric */}
              <div className="bg-neutral-900/50 rounded-lg p-3 mb-4">
                <p className="text-sm text-neutral-400">Key Result</p>
                <p className="font-semibold text-lg">{vertical.keyMetric}</p>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <p className="text-sm text-neutral-400">18mo ROI</p>
                  <p className="text-2xl font-bold text-green-400">{vertical.roi}</p>
                </div>
                <div>
                  <p className="text-sm text-neutral-400">Sovereignty</p>
                  <p className="text-2xl font-bold">{vertical.sovereignty}%</p>
                </div>
              </div>

              {/* Agents Preview */}
              <div className="mb-4">
                <p className="text-xs text-neutral-400 mb-2">Specialized Agents</p>
                <div className="flex flex-wrap gap-1">
                  {stryMutAct_9fa48("64583") ? vertical.agents.map(agent => <span key={agent} className="px-2 py-0.5 bg-neutral-800 rounded text-xs">
                      {agent}
                    </span>) : (stryCov_9fa48("64583"), vertical.agents.slice(0, 3).map(stryMutAct_9fa48("64584") ? () => undefined : (stryCov_9fa48("64584"), agent => <span key={agent} className="px-2 py-0.5 bg-neutral-800 rounded text-xs">
                      {agent}
                    </span>)))}
                  {stryMutAct_9fa48("64587") ? vertical.agents.length > 3 || <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
                      +{vertical.agents.length - 3} more
                    </span> : stryMutAct_9fa48("64586") ? false : stryMutAct_9fa48("64585") ? true : (stryCov_9fa48("64585", "64586", "64587"), (stryMutAct_9fa48("64590") ? vertical.agents.length <= 3 : stryMutAct_9fa48("64589") ? vertical.agents.length >= 3 : stryMutAct_9fa48("64588") ? true : (stryCov_9fa48("64588", "64589", "64590"), vertical.agents.length > 3)) && <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
                      +{stryMutAct_9fa48("64591") ? vertical.agents.length + 3 : (stryCov_9fa48("64591"), vertical.agents.length - 3)} more
                    </span>)}
                </div>
              </div>

              {/* Compliance Preview */}
              <div>
                <p className="text-xs text-neutral-400 mb-2">Compliance Frameworks</p>
                <div className="flex flex-wrap gap-1">
                  {stryMutAct_9fa48("64592") ? vertical.compliance.map(c => <span key={c} className="px-2 py-0.5 bg-neutral-700/50 rounded text-xs text-neutral-300">
                      {c}
                    </span>) : (stryCov_9fa48("64592"), vertical.compliance.slice(0, 4).map(stryMutAct_9fa48("64593") ? () => undefined : (stryCov_9fa48("64593"), c => <span key={c} className="px-2 py-0.5 bg-neutral-700/50 rounded text-xs text-neutral-300">
                      {c}
                    </span>)))}
                  {stryMutAct_9fa48("64596") ? vertical.compliance.length > 4 || <span className="px-2 py-0.5 text-xs text-neutral-500">
                      +{vertical.compliance.length - 4}
                    </span> : stryMutAct_9fa48("64595") ? false : stryMutAct_9fa48("64594") ? true : (stryCov_9fa48("64594", "64595", "64596"), (stryMutAct_9fa48("64599") ? vertical.compliance.length <= 4 : stryMutAct_9fa48("64598") ? vertical.compliance.length >= 4 : stryMutAct_9fa48("64597") ? true : (stryCov_9fa48("64597", "64598", "64599"), vertical.compliance.length > 4)) && <span className="px-2 py-0.5 text-xs text-neutral-500">
                      +{stryMutAct_9fa48("64600") ? vertical.compliance.length + 4 : (stryCov_9fa48("64600"), vertical.compliance.length - 4)}
                    </span>)}
                </div>
              </div>

              {/* Hover CTA */}
              {stryMutAct_9fa48("64603") ? hoveredVertical === vertical.id && vertical.status !== 'coming-soon' || <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-900 to-transparent p-6 pt-12 rounded-b-2xl">
                  <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Explore {vertical.name} →
                  </button>
                </div> : stryMutAct_9fa48("64602") ? false : stryMutAct_9fa48("64601") ? true : (stryCov_9fa48("64601", "64602", "64603"), (stryMutAct_9fa48("64605") ? hoveredVertical === vertical.id || vertical.status !== 'coming-soon' : stryMutAct_9fa48("64604") ? true : (stryCov_9fa48("64604", "64605"), (stryMutAct_9fa48("64607") ? hoveredVertical !== vertical.id : stryMutAct_9fa48("64606") ? true : (stryCov_9fa48("64606", "64607"), hoveredVertical === vertical.id)) && (stryMutAct_9fa48("64609") ? vertical.status === 'coming-soon' : stryMutAct_9fa48("64608") ? true : (stryCov_9fa48("64608", "64609"), vertical.status !== 'coming-soon')))) && <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-900 to-transparent p-6 pt-12 rounded-b-2xl">
                  <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Explore {vertical.name} →
                  </button>
                </div>)}

              {/* Coming Soon Overlay */}
              {stryMutAct_9fa48("64613") ? vertical.status === 'coming-soon' || <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-center">
                  <p className="text-sm text-neutral-400">Join the design partner program</p>
                  <button className="mt-2 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                    Request Early Access
                  </button>
                </div> : stryMutAct_9fa48("64612") ? false : stryMutAct_9fa48("64611") ? true : (stryCov_9fa48("64611", "64612", "64613"), (stryMutAct_9fa48("64615") ? vertical.status !== 'coming-soon' : stryMutAct_9fa48("64614") ? true : (stryCov_9fa48("64614", "64615"), vertical.status === 'coming-soon')) && <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-center">
                  <p className="text-sm text-neutral-400">Join the design partner program</p>
                  <button className="mt-2 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                    Request Early Access
                  </button>
                </div>)}
            </div>))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-900/30 to-primary-800/30 rounded-2xl p-8 text-center border border-primary-500/30">
          <h2 className="text-2xl font-bold mb-2">Not Sure Which Vertical Fits?</h2>
          <p className="text-neutral-400 mb-6">
            Our platform works across industries. Many customers use multiple vertical packs.
          </p>
          <div className="flex justify-center gap-4">
            <button onClick={stryMutAct_9fa48("64617") ? () => undefined : (stryCov_9fa48("64617"), () => navigate('/demo'))} className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              Request Demo
            </button>
            <button onClick={stryMutAct_9fa48("64619") ? () => undefined : (stryCov_9fa48("64619"), () => navigate('/pricing'))} className="px-6 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors">
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default VerticalsHubPage;