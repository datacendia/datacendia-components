// =============================================================================
// DATACENDIA - THE HONESTY MATRICES
// Radical transparency. No exceptions.
// =============================================================================

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../../lib/utils';
import { Logo } from '../../components/brand';

// =============================================================================
// MATRIX DATA
// =============================================================================

type MatrixCell = {
  value: string;
  status: 'good' | 'bad' | 'partial' | 'neutral';
};

type MatrixRow = {
  label: string;
  cells: MatrixCell[];
};

type Matrix = {
  id: string;
  title: string;
  question: string;
  description: string;
  icon: string;
  color: string;
  columns: string[];
  rows: MatrixRow[];
  admission: string;
  services: string[];
};

const matrices: Matrix[] = [
  {
    id: 'sovereignty',
    title: 'Sovereignty Matrix',
    question: 'How much control do I actually have?',
    description: 'Choose your deployment model based on your sovereignty requirements.',
    icon: '🏛️',
    color: '#6366F1',
    columns: ['Cloud', 'Private Cloud', 'Self-Managed', 'Air-Gapped'],
    rows: [
      { label: 'We can see your data', cells: [
        { value: 'Yes', status: 'bad' },
        { value: 'Limited', status: 'partial' },
        { value: 'Never', status: 'good' },
        { value: 'Impossible', status: 'good' },
      ]},
      { label: 'We can access your system', cells: [
        { value: 'Yes', status: 'bad' },
        { value: 'Yes', status: 'bad' },
        { value: 'No', status: 'good' },
        { value: 'No', status: 'good' },
      ]},
      { label: 'Third parties can be compelled', cells: [
        { value: 'Yes', status: 'bad' },
        { value: 'No', status: 'good' },
        { value: 'No', status: 'good' },
        { value: 'No', status: 'good' },
      ]},
      { label: 'CLOUD Act applies', cells: [
        { value: 'Yes', status: 'bad' },
        { value: 'Partial', status: 'partial' },
        { value: 'No', status: 'good' },
        { value: 'No', status: 'good' },
      ]},
      { label: 'GDPR data residency compliant', cells: [
        { value: 'Partial', status: 'partial' },
        { value: 'Yes', status: 'good' },
        { value: 'Yes', status: 'good' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Fully sovereign', cells: [
        { value: 'No', status: 'bad' },
        { value: 'No', status: 'bad' },
        { value: 'Yes', status: 'good' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Works offline', cells: [
        { value: 'No', status: 'bad' },
        { value: 'No', status: 'bad' },
        { value: 'Partial', status: 'partial' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Works offline forever', cells: [
        { value: 'No', status: 'bad' },
        { value: 'No', status: 'bad' },
        { value: 'No', status: 'bad' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'You own the deployment', cells: [
        { value: 'No', status: 'bad' },
        { value: 'Partial', status: 'partial' },
        { value: 'Yes', status: 'good' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Exit cost', cells: [
        { value: 'Medium', status: 'partial' },
        { value: 'Low', status: 'good' },
        { value: 'Very Low', status: 'good' },
        { value: 'Very Low', status: 'good' },
      ]},
      { label: 'Best for', cells: [
        { value: 'Startups, SMBs', status: 'neutral' },
        { value: 'Enterprise, Regulated', status: 'neutral' },
        { value: 'Banks, Gov', status: 'neutral' },
        { value: 'Defense, Intel', status: 'neutral' },
      ]},
    ],
    admission: 'Cloud tier means we have access. We\'re honest about it.',
    services: ['CendiaSovereign™'],
  },
  {
    id: 'ai-governance',
    title: 'AI Governance Reality Check',
    question: 'Who\'s actually responsible when AI goes wrong?',
    description: 'Accountability matters most when things break.',
    icon: '🤖',
    color: '#EF4444',
    columns: ['Traditional Vendor', 'In-House ML Team', 'Datacendia'],
    rows: [
      { label: 'Model makes biased decision', cells: [
        { value: '"Not our fault, your data"', status: 'bad' },
        { value: 'Blame the data scientist who left', status: 'bad' },
        { value: 'CendiaEthics™ flags bias pre-deployment', status: 'good' },
      ]},
      { label: 'Can\'t explain decision to regulator', cells: [
        { value: 'Vendor provides generic docs', status: 'bad' },
        { value: 'Hope someone documented it', status: 'bad' },
        { value: 'CendiaWitness™ + CendiaGlass™ = audit-ready', status: 'good' },
      ]},
      { label: 'Model drifts in production', cells: [
        { value: 'You notice when customers complain', status: 'bad' },
        { value: 'If you built monitoring', status: 'partial' },
        { value: 'CendiaBlackBox™ tracks drift; alerts before impact', status: 'good' },
      ]},
      { label: 'Need to roll back', cells: [
        { value: 'Submit support ticket', status: 'bad' },
        { value: 'Hope you versioned it', status: 'bad' },
        { value: 'One-click rollback with lineage intact', status: 'good' },
      ]},
      { label: 'Auditor asks "how did it decide?"', cells: [
        { value: 'Awkward silence', status: 'bad' },
        { value: '"It\'s a neural network..."', status: 'bad' },
        { value: 'Factor contribution + counterfactual analysis', status: 'good' },
      ]},
      { label: 'AI recommends something unethical', cells: [
        { value: '"Algorithm is neutral"', status: 'bad' },
        { value: 'Debate in Slack', status: 'bad' },
        { value: 'CendiaVeto™ blocks automatically', status: 'good' },
      ]},
      { label: 'Competing AI recommendations', cells: [
        { value: 'Pick one, hope it\'s right', status: 'bad' },
        { value: 'Loudest voice wins', status: 'bad' },
        { value: 'The Council: multi-agent deliberation', status: 'good' },
      ]},
    ],
    admission: 'Most AI vendors avoid accountability. We build it in.',
    services: ['CendiaEthics™', 'CendiaGlass™', 'CendiaWitness™', 'CendiaBlackBox™', 'CendiaVeto™', 'CendiaMirror™', 'The Council™'],
  },
  {
    id: 'integration',
    title: 'Integration Honesty Matrix',
    question: 'How hard is it really to connect things?',
    description: 'Every vendor says "easy integration." Here\'s the truth.',
    icon: '🔌',
    color: '#10B981',
    columns: ['Vendor Promise', 'Actual Reality', 'Datacendia Reality'],
    rows: [
      { label: 'Modern REST API', cells: [
        { value: '"5 minutes!"', status: 'neutral' },
        { value: '2-4 hours with auth, pagination, rate limits', status: 'partial' },
        { value: '1-2 hours; CendiaBridge™ handles auth patterns', status: 'good' },
      ]},
      { label: 'Legacy SOAP/XML', cells: [
        { value: '"We support it"', status: 'neutral' },
        { value: 'Find the one engineer who knows SOAP', status: 'bad' },
        { value: 'CendiaBridge™ transforms protocols', status: 'good' },
      ]},
      { label: 'Mainframe/AS400', cells: [
        { value: '"Enterprise ready"', status: 'neutral' },
        { value: '6-month professional services', status: 'bad' },
        { value: 'Honest: this is hard. Budget 4-6 weeks.', status: 'partial' },
      ]},
      { label: 'Real-time streaming', cells: [
        { value: '"Kafka connector"', status: 'neutral' },
        { value: 'Pray the offsets align', status: 'bad' },
        { value: 'CendiaMesh™ manages consumer groups', status: 'good' },
      ]},
      { label: 'Proprietary ERP systems', cells: [
        { value: '"Certified!"', status: 'neutral' },
        { value: 'Expensive connectors + consultants', status: 'bad' },
        { value: 'We connect; licensing is between you and vendor', status: 'partial' },
      ]},
      { label: 'Shadow IT spreadsheets', cells: [
        { value: 'Not mentioned', status: 'bad' },
        { value: '40% of real business logic lives here', status: 'bad' },
        { value: 'CendiaFlow™ can ingest; exposes the chaos', status: 'good' },
      ]},
      { label: 'Cloud data warehouses', cells: [
        { value: '"Native integration"', status: 'neutral' },
        { value: 'Query optimization is your problem', status: 'partial' },
        { value: 'Native connectors; CendiaLineage™ tracks transforms', status: 'good' },
      ]},
    ],
    admission: 'Mainframes are hard. Shadow IT is real. We won\'t pretend otherwise.',
    services: ['CendiaBridge™', 'CendiaMesh™', 'CendiaFlow™', 'CendiaLineage™', 'CendiaKey™'],
  },
  {
    id: '3am',
    title: 'What Breaks at 3 AM',
    question: 'When things go wrong, what actually happens?',
    description: 'Things break. The question is how fast you can understand and recover.',
    icon: '🚨',
    color: '#F59E0B',
    columns: ['Typical Response', 'Datacendia Response'],
    rows: [
      { label: 'Data pipeline fails', cells: [
        { value: 'PagerDuty → engineer → SSH → logs → guess', status: 'bad' },
        { value: 'Alert with root cause; upstream/downstream impact shown', status: 'good' },
      ]},
      { label: 'Dashboard shows wrong number', cells: [
        { value: 'Blame the data team', status: 'bad' },
        { value: 'Trace number to source; find exactly where it diverged', status: 'good' },
      ]},
      { label: '"The AI said something crazy"', cells: [
        { value: 'Disable and apologize', status: 'bad' },
        { value: 'See exactly what inputs caused output; evidence preserved', status: 'good' },
      ]},
      { label: 'Integration stops syncing', cells: [
        { value: 'Check both sides, restart, hope', status: 'bad' },
        { value: 'Centralized integration health; automatic retry with alerting', status: 'good' },
      ]},
      { label: 'Key person quits mid-incident', cells: [
        { value: 'Panic', status: 'bad' },
        { value: 'Documented runbooks; CendiaOracle™ answers "how did we fix this?"', status: 'good' },
      ]},
      { label: 'Auditor shows up unannounced', cells: [
        { value: 'Scramble for 3 days', status: 'bad' },
        { value: 'Export audit package in minutes', status: 'good' },
      ]},
      { label: 'Security breach detected', cells: [
        { value: 'War room, finger pointing', status: 'bad' },
        { value: 'Immediate scope assessment; affected data identified', status: 'good' },
      ]},
      { label: 'Decision pattern keeps failing', cells: [
        { value: 'Repeat same mistakes', status: 'bad' },
        { value: 'Pattern identified and banned after 3 failures', status: 'good' },
      ]},
    ],
    admission: 'Things break. The question is how fast you can understand and recover.',
    services: ['CendiaPulse™', 'CendiaLineage™', 'CendiaGlass™', 'CendiaWitness™', 'CendiaMesh™', 'CendiaLegacy™', 'CendiaOracle™', 'CendiaApotheosis™'],
  },
  {
    id: 'platform-comparison',
    title: 'Platform Category Comparison',
    question: 'How do different platform types compare?',
    description: 'Understand the tradeoffs between different categories of enterprise platforms.',
    icon: '⚖️',
    color: '#8B5CF6',
    columns: ['Enterprise BI', 'Cloud Data Platform', 'CRM Platform', 'ERP Suite', 'AI API', 'Datacendia'],
    rows: [
      { label: 'Can run air-gapped', cells: [
        { value: 'Sometimes', status: 'partial' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Sometimes', status: 'partial' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Can run on-prem', cells: [
        { value: 'Often', status: 'good' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Often', status: 'good' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Data portability', cells: [
        { value: 'Varies', status: 'partial' },
        { value: 'Varies', status: 'partial' },
        { value: 'Check terms', status: 'partial' },
        { value: 'Varies', status: 'partial' },
        { value: 'Check terms', status: 'partial' },
        { value: 'Full export', status: 'good' },
      ]},
      { label: 'You own the models', cells: [
        { value: 'Rarely', status: 'bad' },
        { value: 'N/A', status: 'neutral' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Yes', status: 'good' },
      ]},
      { label: 'Exit complexity', cells: [
        { value: 'High', status: 'bad' },
        { value: 'Medium', status: 'partial' },
        { value: 'High', status: 'bad' },
        { value: 'High', status: 'bad' },
        { value: 'Low', status: 'good' },
        { value: 'Low', status: 'good' },
      ]},
      { label: 'AI decision explainability', cells: [
        { value: 'Sometimes', status: 'partial' },
        { value: 'N/A', status: 'neutral' },
        { value: 'Limited', status: 'partial' },
        { value: 'Limited', status: 'partial' },
        { value: 'Limited', status: 'partial' },
        { value: 'Full', status: 'good' },
      ]},
      { label: 'Immutable audit trail', cells: [
        { value: 'Sometimes', status: 'partial' },
        { value: 'Sometimes', status: 'partial' },
        { value: 'Sometimes', status: 'partial' },
        { value: 'Sometimes', status: 'partial' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Built-in', status: 'good' },
      ]},
      { label: 'Self-improving AI', cells: [
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'CendiaApotheosis™', status: 'good' },
      ]},
      { label: 'Formal dissent tracking', cells: [
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'CendiaDissent™', status: 'good' },
      ]},
      { label: 'Multi-agent deliberation', cells: [
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Rarely', status: 'bad' },
        { value: 'Emerging', status: 'partial' },
        { value: 'The Council™', status: 'good' },
      ]},
    ],
    admission: 'Different platform categories have different strengths. Know what you\'re trading off.',
    services: ['CendiaGlass™', 'CendiaLedger™', 'CendiaVeto™', 'CendiaApotheosis™', 'CendiaDissent™', 'The Council™', 'CendiaChronos™'],
  },
  {
    id: 'limitations',
    title: 'What We Can\'t Do',
    question: 'What are your actual limitations?',
    description: 'Every platform has limits. Knowing them prevents disappointment.',
    icon: '🚫',
    color: '#DC2626',
    columns: ['Can We Do It?', 'Honest Answer'],
    rows: [
      { label: 'Replace your data warehouse', cells: [
        { value: 'No', status: 'bad' },
        { value: 'We sit on top of it; we don\'t replace it', status: 'neutral' },
      ]},
      { label: 'Magically fix bad data', cells: [
        { value: 'No', status: 'bad' },
        { value: 'We expose bad data; you have to fix it', status: 'neutral' },
      ]},
      { label: 'Guarantee AI is never wrong', cells: [
        { value: 'No', status: 'bad' },
        { value: 'We guarantee you\'ll know when it is, and why', status: 'neutral' },
      ]},
      { label: 'Integrate in 5 minutes', cells: [
        { value: 'Rarely', status: 'partial' },
        { value: 'Simple REST APIs: hours. Legacy systems: weeks.', status: 'neutral' },
      ]},
      { label: 'Work without your engineers', cells: [
        { value: 'No', status: 'bad' },
        { value: 'We reduce work by 60-80%; we don\'t eliminate it', status: 'neutral' },
      ]},
      { label: 'Replace human judgment', cells: [
        { value: 'No', status: 'bad' },
        { value: 'We augment and track human judgment; we don\'t replace it', status: 'neutral' },
      ]},
      { label: 'Prevent all security breaches', cells: [
        { value: 'No', status: 'bad' },
        { value: 'We detect faster and scope immediately; prevention is layered', status: 'neutral' },
      ]},
      { label: 'Work with zero training', cells: [
        { value: 'No', status: 'bad' },
        { value: 'Basic usage: 2 hours. Power usage: 2 weeks.', status: 'neutral' },
      ]},
      { label: 'Scale infinitely', cells: [
        { value: 'No', status: 'bad' },
        { value: 'Practical limit: ~10M decisions/month per instance', status: 'neutral' },
      ]},
    ],
    admission: 'Every platform has limits. Knowing them prevents disappointment.',
    services: [],
  },
];

// =============================================================================
// COMPONENTS
// =============================================================================

const MatrixCard: React.FC<{ matrix: Matrix; onClick: () => void }> = ({ matrix, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="group bg-white rounded-2xl border-2 border-neutral-200 p-6 text-left hover:border-primary-500 hover:shadow-xl transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        <span className="text-4xl">{matrix.icon}</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-neutral-900 group-hover:text-primary-600 transition-colors">
            {matrix.title}
          </h3>
          <p className="text-primary-600 font-medium mt-1">
            {matrix.question}
          </p>
          <p className="text-neutral-600 text-sm mt-2">
            {matrix.description}
          </p>
        </div>
        <span className="text-neutral-400 group-hover:text-primary-600 transition-colors">
          →
        </span>
      </div>
    </button>
  );
};

const MatrixModal: React.FC<{ matrix: Matrix; onClose: () => void }> = ({ matrix, onClose }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-4xl">{matrix.icon}</span>
              <div>
                <h2 className="text-2xl font-bold">{matrix.title}</h2>
                <p className="text-white/80">{matrix.question}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>
        </div>

        {/* Matrix Table */}
        <div className="p-6 overflow-auto max-h-[60vh]">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="text-left p-3 bg-neutral-100 font-semibold text-neutral-700 border-b-2 border-neutral-200">
                  Capability
                </th>
                {matrix.columns.map((col, idx) => (
                  <th key={idx} className="text-center p-3 bg-neutral-100 font-semibold text-neutral-700 border-b-2 border-neutral-200 min-w-[120px]">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {matrix.rows.map((row, rowIdx) => (
                <tr key={rowIdx} className="border-b border-neutral-100 hover:bg-neutral-50">
                  <td className="p-3 font-medium text-neutral-900">
                    {row.label}
                  </td>
                  {row.cells.map((cell, cellIdx) => (
                    <td key={cellIdx} className="p-3 text-center">
                      <span className={cn(
                        'inline-block px-3 py-1 rounded-full text-sm font-medium',
                        cell.status === 'good' && 'bg-green-100 text-green-800',
                        cell.status === 'bad' && 'bg-red-100 text-red-800',
                        cell.status === 'partial' && 'bg-yellow-100 text-yellow-800',
                        cell.status === 'neutral' && 'bg-neutral-100 text-neutral-700',
                      )}>
                        {cell.value}
                      </span>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="bg-neutral-50 p-6 border-t border-neutral-200">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <p className="text-neutral-600 italic">
                "What we're admitting: {matrix.admission}"
              </p>
              {matrix.services.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {matrix.services.map((service, idx) => (
                    <span key={idx} className="px-2 py-1 bg-primary-100 text-primary-700 text-xs font-medium rounded">
                      {service}
                    </span>
                  ))}
                </div>
              )}
            </div>
            <Link
              to="/demo"
              className="px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-500 transition-colors"
            >
              Request Demo →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// MAIN PAGE
// =============================================================================

export const HonestyMatricesPage: React.FC = () => {
  const [selectedMatrix, setSelectedMatrix] = useState<Matrix | null>(null);

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Navigation */}
      <nav className="bg-white/95 backdrop-blur-xl border-b border-neutral-200/50 sticky top-0 z-40 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-18 py-3">
            <Link to="/" className="hover:opacity-90 transition-opacity">
              <Logo size="md" />
            </Link>
            
            <div className="hidden md:flex items-center gap-1">
              <Link to="/product" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Product
              </Link>
              <Link to="/honesty" className="px-4 py-2 text-sm font-medium text-primary-600 bg-primary-50 rounded-lg">
                Honesty Matrices
              </Link>
              <Link to="/pricing" className="px-4 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all">
                Pricing
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
      <section className="bg-gradient-to-br from-neutral-900 to-neutral-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            The Honesty Matrices
          </h1>
          <p className="text-xl text-white/60 mb-4">
            Most vendors hide this. We lead with it.
          </p>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Radical transparency. No exceptions. Every matrix shows what we can do, 
            what we can't do, and exactly where we stand against alternatives.
          </p>
        </div>
      </section>

      {/* Matrices Grid */}
      <section className="py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {matrices.map(matrix => (
              <MatrixCard 
                key={matrix.id} 
                matrix={matrix} 
                onClick={() => setSelectedMatrix(matrix)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Tagline */}
      <section className="py-12 bg-white border-t border-neutral-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-2xl font-semibold text-neutral-900">
            "If we can't be honest before you buy, why trust us after?"
          </p>
          <div className="mt-8">
            <Link
              to="/demo"
              className="inline-flex px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-lg font-semibold rounded-lg hover:from-purple-500 hover:to-indigo-500 shadow-xl shadow-purple-500/25 hover:shadow-purple-500/40 active:scale-95 transition-all duration-200"
            >
              Request Access →
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 bg-neutral-900 text-white/60 text-center text-sm">
        <p>The first enterprise platform built on honesty.</p>
        <p className="mt-2">© {new Date().getFullYear()} Datacendia™. All rights reserved.</p>
      </footer>

      {/* Matrix Modal */}
      {selectedMatrix && (
        <MatrixModal matrix={selectedMatrix} onClose={() => setSelectedMatrix(null)} />
      )}
    </div>
  );
};

export default HonestyMatricesPage;
