// =============================================================================
// DATACENDIA - PRODUCT PAGE
// =============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Logo } from '../../components/brand';

// =============================================================================
// PRODUCT FEATURES DATA
// =============================================================================

const products = [
  {
    id: 'council',
    name: 'The Council',
    tagline: 'AI-Powered Strategic Advisory',
    description: 'Consult with a pantheon of specialized AI agents who reason across your entire organization. Get strategic insights from CendiaChief, CendiaCFO, CendiaCOO, and more.',
    icon: '🧠',
    color: '#6366F1',
    features: [
      'Multi-agent deliberation with consensus building',
      'Domain-specific AI experts (Finance, Operations, Security, etc.)',
      'Real-time streaming responses with citations',
      'Confidence scoring and dissent tracking',
      'Full audit trail of all decisions',
    ],
    useCases: [
      'Strategic planning and scenario analysis',
      'Cross-functional decision support',
      'Risk assessment and mitigation',
      'Resource allocation optimization',
    ],
    screenshot: '/screenshots/council.png',
  },
  {
    id: 'pulse',
    name: 'The Pulse',
    tagline: 'Organization Health at a Glance',
    description: 'Real-time visibility into your organization\'s vital signs. Monitor data health, operations, security, and people metrics with instant alerts.',
    icon: '💓',
    color: '#EF4444',
    features: [
      'Unified health score across 4 dimensions',
      'Real-time alert management and escalation',
      'Trend analysis and anomaly detection',
      'System status monitoring',
      'Custom threshold configuration',
    ],
    useCases: [
      'Executive dashboards and reporting',
      'Operational monitoring',
      'Compliance tracking',
      'Incident response coordination',
    ],
    screenshot: '/screenshots/pulse.png',
  },
  {
    id: 'lens',
    name: 'The Lens',
    tagline: 'See Possible Futures',
    description: 'AI-powered forecasting and what-if analysis. Model different scenarios and understand the impact of decisions before you make them.',
    icon: '🔮',
    color: '#8B5CF6',
    features: [
      'ML-powered forecasting with confidence intervals',
      'What-if scenario modeling',
      'Sensitivity analysis',
      'Automated forecast accuracy tracking',
      'Multi-variable projections',
    ],
    useCases: [
      'Revenue and cash flow forecasting',
      'Demand planning',
      'Budget scenario modeling',
      'Risk quantification',
    ],
    screenshot: '/screenshots/lens.png',
  },
  {
    id: 'bridge',
    name: 'The Bridge',
    tagline: 'Automate Everything',
    description: 'Visual workflow builder that connects your systems, automates processes, and ensures nothing falls through the cracks.',
    icon: '🌉',
    color: '#10B981',
    features: [
      'Drag-and-drop workflow builder',
      'Pre-built integration connectors',
      'Human-in-the-loop approvals',
      'Real-time execution monitoring',
      'Error handling and retry logic',
    ],
    useCases: [
      'Month-end close automation',
      'Vendor onboarding workflows',
      'Approval routing',
      'Data pipeline orchestration',
    ],
    screenshot: '/screenshots/bridge.png',
  },
  {
    id: 'graph',
    name: 'Graph Explorer',
    tagline: 'Your Data Universe, Visualized',
    description: 'Interactive knowledge graph that maps every entity, relationship, and data flow in your organization. Understand lineage, impact, and dependencies instantly.',
    icon: '🕸️',
    color: '#06B6D4',
    features: [
      'Interactive graph visualization',
      'Data lineage tracking',
      'Impact analysis',
      'Entity relationship mapping',
      'Search and filter capabilities',
    ],
    useCases: [
      'Data governance and cataloging',
      'Change impact assessment',
      'Compliance documentation',
      'Data discovery',
    ],
    screenshot: '/screenshots/graph.png',
  },
];

const integrations = [
  { name: 'Salesforce', icon: '☁️', category: 'CRM' },
  { name: 'Snowflake', icon: '❄️', category: 'Data Warehouse' },
  { name: 'Slack', icon: '💬', category: 'Communication' },
  { name: 'SAP', icon: '📊', category: 'ERP' },
  { name: 'AWS', icon: '☁️', category: 'Cloud' },
  { name: 'BigQuery', icon: '🔍', category: 'Analytics' },
  { name: 'Tableau', icon: '📈', category: 'BI' },
  { name: 'Jira', icon: '📋', category: 'Project Management' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const ProductCard: React.FC<{
  product: typeof products[0];
  isExpanded: boolean;
  onToggle: () => void;
}> = ({ product, isExpanded, onToggle }) => {
  return (
    <div
      className={cn(
        'bg-white rounded-2xl border-2 transition-all duration-300',
        isExpanded ? 'border-primary-500 shadow-xl' : 'border-neutral-200 hover:border-neutral-300'
      )}
    >
      {/* Header */}
      <div
        className="p-6 cursor-pointer"
        onClick={onToggle}
      >
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
              style={{ backgroundColor: `${product.color}20` }}
            >
              {product.icon}
            </div>
            <div>
              <h3 className="text-xl font-bold text-neutral-900">{product.name}</h3>
              <p className="text-sm text-neutral-500">{product.tagline}</p>
            </div>
          </div>
          <button
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center transition-transform',
              isExpanded && 'rotate-180'
            )}
            style={{ backgroundColor: `${product.color}20`, color: product.color }}
          >
            ▼
          </button>
        </div>
        <p className="mt-4 text-neutral-600">{product.description}</p>
      </div>

      {/* Expanded Content */}
      {isExpanded && (
        <div className="px-6 pb-6 border-t border-neutral-100">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-6">
            {/* Features */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Key Features
              </h4>
              <ul className="space-y-3">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span
                      className="mt-1 w-5 h-5 rounded-full flex items-center justify-center text-xs text-white flex-shrink-0"
                      style={{ backgroundColor: product.color }}
                    >
                      ✓
                    </span>
                    <span className="text-neutral-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Use Cases */}
            <div>
              <h4 className="text-sm font-semibold text-neutral-900 uppercase tracking-wider mb-4">
                Use Cases
              </h4>
              <ul className="space-y-3">
                {product.useCases.map((useCase, idx) => (
                  <li key={idx} className="flex items-start gap-3">
                    <span className="text-neutral-400">→</span>
                    <span className="text-neutral-700">{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="mt-6 pt-6 border-t border-neutral-100 flex items-center justify-between">
            <Link
              to="/demo"
              className="text-sm font-medium hover:underline"
              style={{ color: product.color }}
            >
              See {product.name} in action →
            </Link>
            <Link
              to={`/cortex/${product.id === 'graph' ? 'graph' : product.id === 'council' ? 'council' : product.id === 'pulse' ? 'pulse' : product.id === 'lens' ? 'lens' : 'bridge'}`}
              className="px-4 py-2 rounded-lg text-sm font-medium text-white transition-colors"
              style={{ backgroundColor: product.color }}
            >
              Try It Now
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ProductPage: React.FC = () => {
  const [expandedProduct, setExpandedProduct] = useState<string | null>('council');

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link to="/product" className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg">
                Product
              </Link>
              <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Pricing
              </Link>
              <Link to="/apex/forecast" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Solutions
              </Link>
              <Link to="/about" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                About
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Link to="/login" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
                Sign In
              </Link>
              <Link
                to="/demo"
                className="px-5 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-sm font-semibold rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all duration-200"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Intelligence Platform for Modern Organizations
          </h1>
          <p className="text-xl text-white/80 max-w-3xl mx-auto mb-8">
            Datacendia unifies your data, empowers your teams with AI advisors, and automates 
            your workflows—all while keeping your intelligence sovereign and secure.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/demo"
              className="px-6 py-3 bg-white text-primary-600 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Request Demo
            </Link>
            <Link
              to="/login"
              className="px-6 py-3 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              Start Free Trial
            </Link>
          </div>
        </div>
      </section>

      {/* Products */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Five Modules. One Unified Platform.
            </h2>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto">
              Each module is powerful on its own. Together, they create an intelligence 
              system that transforms how your organization operates.
            </p>
          </div>

          <div className="space-y-4">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                isExpanded={expandedProduct === product.id}
                onToggle={() => setExpandedProduct(
                  expandedProduct === product.id ? null : product.id
                )}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Integrations */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Connect Everything
            </h2>
            <p className="text-lg text-neutral-600">
              Native integrations with the tools you already use
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {integrations.map((integration, idx) => (
              <div
                key={idx}
                className="p-4 bg-neutral-50 rounded-xl text-center hover:shadow-md transition-shadow"
              >
                <span className="text-3xl mb-2 block">{integration.icon}</span>
                <p className="font-medium text-neutral-900">{integration.name}</p>
                <p className="text-xs text-neutral-500">{integration.category}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-neutral-500 mt-8">
            + 50 more integrations available
          </p>
        </div>
      </section>

      {/* Security */}
      <section className="py-20 bg-neutral-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold mb-6">
                Enterprise-Grade Security
              </h2>
              <p className="text-neutral-400 mb-8">
                Your data never leaves your control. Datacendia is built with security 
                and compliance at its core.
              </p>
              <ul className="space-y-4">
                {[
                  { icon: '🔒', text: 'SOC 2 Type II Certified' },
                  { icon: '🏠', text: 'Self-hosted or private cloud deployment' },
                  { icon: '🔐', text: 'End-to-end encryption at rest and in transit' },
                  { icon: '📋', text: 'GDPR, HIPAA, and CCPA compliant' },
                  { icon: '🕵️', text: 'Complete audit logging' },
                ].map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span>{item.text}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-neutral-800 rounded-2xl p-8 text-center">
              <div className="text-6xl mb-4">🛡️</div>
              <p className="text-xl font-semibold mb-2">Data Sovereignty</p>
              <p className="text-neutral-400">
                Your AI models run locally. Your data stays in your infrastructure. 
                No data is ever shared with third parties.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-primary-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
            Join the companies using Datacendia to make better decisions, faster.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link
              to="/demo"
              className="px-8 py-4 bg-white text-primary-600 font-medium rounded-lg hover:bg-neutral-100 transition-colors"
            >
              Request a Demo
            </Link>
            <Link
              to="/pricing"
              className="px-8 py-4 bg-white/10 text-white font-medium rounded-lg hover:bg-white/20 transition-colors"
            >
              View Pricing
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-neutral-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div>
              <h4 className="font-semibold mb-4">Product</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link to="/product" className="hover:text-white">Features</Link></li>
                <li><Link to="/pricing" className="hover:text-white">Pricing</Link></li>
                <li><Link to="/integrations" className="hover:text-white">Integrations</Link></li>
                <li><Link to="/security" className="hover:text-white">Security</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link to="/docs" className="hover:text-white">Documentation</Link></li>
                <li><Link to="/api" className="hover:text-white">API Reference</Link></li>
                <li><Link to="/blog" className="hover:text-white">Blog</Link></li>
                <li><Link to="/changelog" className="hover:text-white">Changelog</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link to="/about" className="hover:text-white">About</Link></li>
                <li><Link to="/careers" className="hover:text-white">Careers</Link></li>
                <li><Link to="/contact" className="hover:text-white">Contact</Link></li>
                <li><Link to="/partners" className="hover:text-white">Partners</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Legal</h4>
              <ul className="space-y-2 text-neutral-400 text-sm">
                <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-white">Terms of Service</Link></li>
                <li><Link to="/cookies" className="hover:text-white">Cookie Policy</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-neutral-800 mt-8 pt-8 text-center text-neutral-500 text-sm">
            © 2025 Datacendia. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default ProductPage;
