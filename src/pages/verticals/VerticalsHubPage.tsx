// =============================================================================
// DATACENDIA VERTICALS HUB - INDUSTRY SOLUTIONS OVERVIEW
// Landing page for all vertical-specific solutions
// =============================================================================

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

const verticals: Vertical[] = [
  // Tier 1: Priority
  {
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
    agents: ['CMIO', 'Patient Safety Officer', 'Healthcare Compliance', 'Clinical Ops Director'],
    compliance: ['HIPAA', 'HITECH', 'Joint Commission', 'CMS CoPs'],
    status: 'ga',
  },
  {
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
    agents: [
      'Quantitative Analyst',
      'Portfolio Manager',
      'Credit Risk Officer',
      'Treasury Analyst',
    ],
    compliance: ['SOX', 'Basel III/IV', 'GDPR', 'AML/BSA', 'CFPB'],
    status: 'ga',
  },
  {
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
    agents: ['Policy Analyst', 'Procurement Officer', 'Legal Counsel', 'Ethics Officer'],
    compliance: ['FedRAMP', 'FISMA', 'EU AI Act', 'FOIA'],
    status: 'ga',
  },
  {
    id: 'insurance',
    name: 'Insurance',
    icon: '🛡️',
    tier: 'priority',
    roi: '29%',
    sovereignty: 92,
    description: 'Underwriting optimization and claims intelligence across 50+ jurisdictions',
    keyMetric: '29% loss ratio improvement',
    route: '/verticals/insurance',
    agents: ['Chief Actuary', 'Underwriting Manager', 'Claims Director', 'Risk Manager'],
    compliance: ['State Insurance Laws', 'NAIC', 'Solvency II', 'GDPR'],
    status: 'ga',
  },
  {
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
    agents: [
      'Chief Scientific Officer',
      'Regulatory Affairs',
      'Clinical Operations',
      'Medical Affairs',
    ],
    compliance: ['21 CFR Part 11', 'FDA AI Guidance', 'GxP', 'ICH Guidelines'],
    status: 'ga',
  },
  // Tier 2: Growth
  {
    id: 'manufacturing',
    name: 'Manufacturing',
    icon: '🏭',
    tier: 'growth',
    roi: '23%',
    sovereignty: 88,
    description: 'Supply chain resilience and operational intelligence',
    keyMetric: '23% inventory reduction',
    route: '/verticals/manufacturing',
    agents: ['VP Operations', 'Supply Chain Director', 'Quality Manager', 'Plant Manager'],
    compliance: ['ISO 9001', 'IATF 16949', 'AS9100', 'OSHA'],
    status: 'ga',
  },
  {
    id: 'energy',
    name: 'Energy & Utilities',
    icon: '⚡',
    tier: 'growth',
    roi: '32%',
    sovereignty: 100,
    description: 'Grid intelligence and regulatory compliance for energy transition',
    keyMetric: '45% faster rate case prep',
    route: '/verticals/energy-utilities',
    agents: ['Grid Operations', 'Regulatory Manager', 'Asset Manager', 'Trading Analyst'],
    compliance: ['NERC CIP', 'FERC', 'EPA', 'State PUC'],
    status: 'ga',
  },
  {
    id: 'technology',
    name: 'Technology / SaaS',
    icon: '💻',
    tier: 'growth',
    roi: '41%',
    sovereignty: 82,
    description: 'Product decision velocity and AI governance for tech companies',
    keyMetric: '41% faster releases',
    route: '/verticals/technology',
    agents: ['Product Director', 'Engineering Lead', 'Security Architect', 'Growth Strategist'],
    compliance: ['SOC 2', 'ISO 27001', 'GDPR', 'CCPA'],
    status: 'ga',
  },
  {
    id: 'retail',
    name: 'Retail & Hospitality',
    icon: '🛒',
    tier: 'growth',
    roi: '19%',
    sovereignty: 85,
    description: 'Pricing optimization and revenue management intelligence',
    keyMetric: '19% margin improvement',
    route: '/verticals/retail-hospitality',
    agents: [
      'Merchandising Director',
      'Revenue Manager',
      'Store Operations',
      'Customer Experience',
    ],
    compliance: ['PCI-DSS', 'GDPR', 'CCPA', 'ADA'],
    status: 'ga',
  },
  {
    id: 'real-estate',
    name: 'Real Estate / Construction',
    icon: '🏗️',
    tier: 'growth',
    roi: '24%',
    sovereignty: 85,
    description: 'Development decisions, project intelligence, and property analytics',
    keyMetric: '22% project cost savings',
    route: '/verticals/real-estate',
    agents: [
      'Development Director',
      'Construction Manager',
      'Investment Analyst',
      'Property Manager',
    ],
    compliance: ['Zoning Laws', 'Building Codes', 'Environmental', 'ADA'],
    status: 'ga',
  },
  {
    id: 'transportation',
    name: 'Transportation / Logistics',
    icon: '🚚',
    tier: 'growth',
    roi: '26%',
    sovereignty: 88,
    description: 'Fleet optimization, route intelligence, and supply chain decisions',
    keyMetric: '18% fuel cost reduction',
    route: '/verticals/transportation',
    agents: ['Fleet Director', 'Routing Manager', 'Logistics Analyst', 'Compliance Officer'],
    compliance: ['DOT/FMCSA', 'Hours of Service', 'HAZMAT', 'Customs'],
    status: 'ga',
  },
  {
    id: 'media',
    name: 'Media / Entertainment',
    icon: '🎬',
    tier: 'growth',
    roi: '29%',
    sovereignty: 80,
    description: 'Content strategy, audience intelligence, and rights management',
    keyMetric: '35% better content ROI',
    route: '/verticals/media-entertainment',
    agents: ['Content Strategist', 'Audience Analyst', 'Rights Manager', 'Ad Operations'],
    compliance: ['FCC', 'COPPA', 'Advertising Standards', 'Content Ratings'],
    status: 'ga',
  },
  {
    id: 'professional-services',
    name: 'Professional Services',
    icon: '💼',
    tier: 'growth',
    roi: '28%',
    sovereignty: 92,
    description: 'Consulting, accounting, and advisory firm intelligence',
    keyMetric: '31% utilization improvement',
    route: '/verticals/professional-services',
    agents: ['Managing Partner', 'Engagement Manager', 'Business Development', 'Quality & Risk'],
    compliance: ['AICPA Standards', 'SEC Independence', 'PCAOB', 'State Bar Rules'],
    status: 'ga',
  },
  {
    id: 'higher-education',
    name: 'Higher Education',
    icon: '🎓',
    tier: 'growth',
    roi: '21%',
    sovereignty: 95,
    description: 'Enrollment, research, and institutional intelligence',
    keyMetric: '23% yield improvement',
    route: '/verticals/higher-education',
    agents: ['Enrollment Director', 'Academic Affairs', 'Research Director', 'CFO/Finance'],
    compliance: ['FERPA', 'Title IX', 'ADA', 'Accreditation Standards'],
    status: 'ga',
  },
  {
    id: 'sports',
    name: 'Sports / Athletics',
    icon: '🏟️',
    tier: 'growth',
    roi: '32%',
    sovereignty: 90,
    description: 'Team performance, player analytics, and sports business intelligence',
    keyMetric: '28% better draft picks',
    route: '/verticals/sports',
    agents: ['Performance Director', 'Scouting Director', 'Sports Medicine', 'Revenue Director'],
    compliance: ['Salary Cap Rules', 'League Regulations', 'Player Union', 'Anti-Doping'],
    status: 'ga',
  },
  // Tier 3: Coming Soon
  {
    id: 'telecom',
    name: 'Telecommunications',
    icon: '📡',
    tier: 'coming-soon',
    roi: '28%',
    sovereignty: 95,
    description: 'Network optimization and churn prediction',
    keyMetric: 'Coming Q2 2026',
    route: '/verticals/telecommunications',
    agents: [
      'Network Operations',
      'Customer Intelligence',
      'Spectrum Manager',
      'Revenue Assurance',
    ],
    compliance: ['FCC', 'CPNI', 'E911', 'Net Neutrality'],
    status: 'coming-soon',
  },
  {
    id: 'agriculture',
    name: 'Agriculture & Food',
    icon: '🌾',
    tier: 'coming-soon',
    roi: '22%',
    sovereignty: 88,
    description: 'Supply chain and commodity decision intelligence',
    keyMetric: 'Coming Q2 2026',
    route: '/verticals/agriculture',
    agents: ['Supply Chain Director', 'Commodity Trader', 'Quality Assurance', 'Sustainability'],
    compliance: ['FDA FSMA', 'USDA', 'EU Farm to Fork'],
    status: 'coming-soon',
  },
  {
    id: 'fintech',
    name: 'Consumer Fintech',
    icon: '💳',
    tier: 'coming-soon',
    roi: '35%',
    sovereignty: 85,
    description: 'Lending, payments, and consumer risk intelligence',
    keyMetric: 'Coming Q2 2026',
    route: '/verticals/consumer-fintech',
    agents: ['Lending Director', 'Payments Operations', 'Risk Analyst', 'Product Manager'],
    compliance: ['CFPB', 'State Lending Laws', 'PCI-DSS', 'GDPR'],
    status: 'coming-soon',
  },
];

// =============================================================================
// COMPONENT
// =============================================================================

export const VerticalsHubPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTier, setSelectedTier] = useState<VerticalTier | 'all'>('all');
  const [hoveredVertical, setHoveredVertical] = useState<string | null>(null);

  const filteredVerticals =
    selectedTier === 'all' ? verticals : verticals.filter((v) => v.tier === selectedTier);

  const tierColors = {
    priority: 'border-primary-500 bg-primary-500/10',
    growth: 'border-green-500 bg-green-500/10',
    'coming-soon': 'border-neutral-500 bg-neutral-500/10',
  };

  const tierLabels = {
    priority: { label: 'Priority', color: 'text-primary-400', badge: '⭐ Wave 1' },
    growth: { label: 'Growth', color: 'text-green-400', badge: '📈 GA Now' },
    'coming-soon': { label: 'Coming Soon', color: 'text-neutral-400', badge: '🔜 Q2 2026' },
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900/20 via-neutral-900 to-neutral-900"></div>
        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">
              Industry <span className="text-primary-400">Verticals</span>
            </h1>
            <p className="text-xl text-neutral-400 max-w-3xl mx-auto">
              Purpose-built AI decision intelligence for regulated industries. Each vertical
              includes specialized agents, compliance frameworks, and industry-specific overlays.
            </p>
          </div>

          {/* Market Stats */}
          <div className="grid grid-cols-4 gap-6 mb-12">
            {[
              { label: 'Vertical AI Market', value: '$3.5B', subtext: '2025 estimated' },
              { label: 'Healthcare Share', value: '43%', subtext: 'Largest vertical' },
              { label: 'Average ROI', value: '27%', subtext: '18-month benchmark' },
              { label: 'Time to Value', value: '2-4 wks', subtext: 'vs 6-18mo consulting' },
            ].map((stat) => (
              <div
                key={stat.label}
                className="bg-neutral-800/50 rounded-xl p-6 border border-neutral-700 text-center"
              >
                <p className="text-3xl font-bold text-primary-400">{stat.value}</p>
                <p className="font-medium mt-1">{stat.label}</p>
                <p className="text-sm text-neutral-500">{stat.subtext}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        {/* Tier Filter */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-2">
            {[
              { id: 'all', label: 'All Verticals', count: verticals.length },
              {
                id: 'priority',
                label: '⭐ Priority',
                count: verticals.filter((v) => v.tier === 'priority').length,
              },
              {
                id: 'growth',
                label: '📈 Growth',
                count: verticals.filter((v) => v.tier === 'growth').length,
              },
              {
                id: 'coming-soon',
                label: '🔜 Coming Soon',
                count: verticals.filter((v) => v.tier === 'coming-soon').length,
              },
            ].map((filter) => (
              <button
                key={filter.id}
                onClick={() => setSelectedTier(filter.id as typeof selectedTier)}
                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                  selectedTier === filter.id
                    ? 'bg-primary-600 text-white'
                    : 'bg-neutral-800 text-neutral-400 hover:text-white hover:bg-neutral-700'
                }`}
              >
                {filter.label} <span className="ml-1 opacity-60">({filter.count})</span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 text-sm text-neutral-400">
            <span>
              Showing {filteredVerticals.length} of {verticals.length}
            </span>
          </div>
        </div>

        {/* Vertical Grid */}
        <div className="grid grid-cols-3 gap-6">
          {filteredVerticals.map((vertical) => (
            <div
              key={vertical.id}
              onClick={() => vertical.status !== 'coming-soon' && navigate(vertical.route)}
              onMouseEnter={() => setHoveredVertical(vertical.id)}
              onMouseLeave={() => setHoveredVertical(null)}
              className={`relative rounded-2xl border-2 p-6 transition-all duration-300 ${
                tierColors[vertical.tier]
              } ${vertical.status !== 'coming-soon' ? 'cursor-pointer hover:scale-[1.02] hover:shadow-xl' : 'opacity-75'}`}
            >
              {/* Tier Badge */}
              <div className="absolute top-4 right-4">
                <span
                  className={`px-2 py-1 rounded text-xs font-medium ${
                    vertical.tier === 'priority'
                      ? 'bg-primary-500/20 text-primary-400'
                      : vertical.tier === 'growth'
                        ? 'bg-green-500/20 text-green-400'
                        : 'bg-neutral-500/20 text-neutral-400'
                  }`}
                >
                  {tierLabels[vertical.tier].badge}
                </span>
              </div>

              {/* Icon & Name */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-4xl">{vertical.icon}</span>
                <div>
                  <h3 className="text-xl font-bold">{vertical.name}</h3>
                  {vertical.marketShare && (
                    <p className="text-sm text-neutral-400">
                      {vertical.marketShare} of vertical AI market
                    </p>
                  )}
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
                  {vertical.agents.slice(0, 3).map((agent) => (
                    <span key={agent} className="px-2 py-0.5 bg-neutral-800 rounded text-xs">
                      {agent}
                    </span>
                  ))}
                  {vertical.agents.length > 3 && (
                    <span className="px-2 py-0.5 bg-neutral-800 rounded text-xs text-neutral-400">
                      +{vertical.agents.length - 3} more
                    </span>
                  )}
                </div>
              </div>

              {/* Compliance Preview */}
              <div>
                <p className="text-xs text-neutral-400 mb-2">Compliance Frameworks</p>
                <div className="flex flex-wrap gap-1">
                  {vertical.compliance.slice(0, 4).map((c) => (
                    <span
                      key={c}
                      className="px-2 py-0.5 bg-neutral-700/50 rounded text-xs text-neutral-300"
                    >
                      {c}
                    </span>
                  ))}
                  {vertical.compliance.length > 4 && (
                    <span className="px-2 py-0.5 text-xs text-neutral-500">
                      +{vertical.compliance.length - 4}
                    </span>
                  )}
                </div>
              </div>

              {/* Hover CTA */}
              {hoveredVertical === vertical.id && vertical.status !== 'coming-soon' && (
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-neutral-900 to-transparent p-6 pt-12 rounded-b-2xl">
                  <button className="w-full py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                    Explore {vertical.name} →
                  </button>
                </div>
              )}

              {/* Coming Soon Overlay */}
              {vertical.status === 'coming-soon' && (
                <div className="mt-4 p-3 bg-neutral-800 rounded-lg text-center">
                  <p className="text-sm text-neutral-400">Join the design partner program</p>
                  <button className="mt-2 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg text-sm hover:bg-neutral-700 transition-colors">
                    Request Early Access
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 bg-gradient-to-r from-primary-900/30 to-primary-800/30 rounded-2xl p-8 text-center border border-primary-500/30">
          <h2 className="text-2xl font-bold mb-2">Not Sure Which Vertical Fits?</h2>
          <p className="text-neutral-400 mb-6">
            Our platform works across industries. Many customers use multiple vertical packs.
          </p>
          <div className="flex justify-center gap-4">
            <button
              onClick={() => navigate('/demo')}
              className="px-6 py-3 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors"
            >
              Request Demo
            </button>
            <button
              onClick={() => navigate('/pricing')}
              className="px-6 py-3 border border-neutral-600 text-white rounded-lg font-medium hover:bg-neutral-800 transition-colors"
            >
              View Pricing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerticalsHubPage;
