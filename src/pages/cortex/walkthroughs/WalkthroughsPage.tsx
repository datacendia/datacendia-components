/**
 * WalkthroughsPage - Step-by-Step Workflow Guides
 * Interactive walkthroughs that guide users through enterprise decision workflows
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  BookOpen,
  Play,
  CheckCircle,
  Clock,
  Target,
  Users,
  Zap,
  Shield,
  TrendingUp,
  FileText,
  Search,
  Filter,
  Lightbulb,
  MessageSquare,
} from 'lucide-react';

// Types
interface WorkflowStep {
  order: number;
  action: string;
  service: string;
  output: string;
}

interface WorkflowScenario {
  id: string;
  name: string;
  category: string;
  councilMode: string;
  services: string[];
  steps: WorkflowStep[];
  councilQuestion: string;
  expectedOutcome: string;
  priority: string;
  estimatedDuration: string;
  tags: string[];
}

// Category icons and colors
const CATEGORY_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  'Procurement': { icon: <FileText className="w-5 h-5" />, color: 'text-blue-400', bg: 'bg-blue-500/20' },
  'Customer Success': { icon: <Users className="w-5 h-5" />, color: 'text-green-400', bg: 'bg-green-500/20' },
  'Manufacturing': { icon: <Zap className="w-5 h-5" />, color: 'text-amber-400', bg: 'bg-amber-500/20' },
  'Mergers & Acquisitions': { icon: <TrendingUp className="w-5 h-5" />, color: 'text-purple-400', bg: 'bg-purple-500/20' },
  'Security': { icon: <Shield className="w-5 h-5" />, color: 'text-red-400', bg: 'bg-red-500/20' },
  'Intellectual Property': { icon: <Lightbulb className="w-5 h-5" />, color: 'text-cyan-400', bg: 'bg-cyan-500/20' },
  'Investor Relations': { icon: <TrendingUp className="w-5 h-5" />, color: 'text-emerald-400', bg: 'bg-emerald-500/20' },
  'Facilities': { icon: <Target className="w-5 h-5" />, color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'Executive': { icon: <Users className="w-5 h-5" />, color: 'text-indigo-400', bg: 'bg-indigo-500/20' },
  'IT Operations': { icon: <Zap className="w-5 h-5" />, color: 'text-rose-400', bg: 'bg-rose-500/20' },
  'Legal': { icon: <FileText className="w-5 h-5" />, color: 'text-slate-400', bg: 'bg-slate-500/20' },
};

// Priority badges
const PRIORITY_CONFIG: Record<string, { color: string; bg: string }> = {
  'critical': { color: 'text-red-400', bg: 'bg-red-500/20' },
  'high': { color: 'text-orange-400', bg: 'bg-orange-500/20' },
  'medium': { color: 'text-amber-400', bg: 'bg-amber-500/20' },
  'low': { color: 'text-green-400', bg: 'bg-green-500/20' },
};

// Service descriptions for tooltips
const SERVICE_DESCRIPTIONS: Record<string, string> = {
  'CendiaProcure': 'Procurement intelligence and vendor management',
  'CendiaChronos': 'Temporal analytics and historical pattern analysis',
  'CendiaEquity': 'Investor relations and equity management',
  'CendiaGuardian': 'Customer health monitoring and success management',
  'CendiaResonance': 'Communications and stakeholder engagement',
  'CendiaFactory': 'Manufacturing operations and predictive maintenance',
  'CendiaNerve': 'IT infrastructure monitoring and incident response',
  'CendiaNetMesh': 'Organizational network and culture analysis',
  'CendiaAcademy': 'Learning and development platform',
  'CendiaTransit': 'Travel security and logistics management',
  'CendiaAegis': 'Threat intelligence and security operations',
  'CendiaInventum': 'Innovation and intellectual property management',
  'CendiaDocket': 'Legal document management and compliance',
  'CendiaHabitat': 'Workplace optimization and facilities management',
  'CendiaRegent': 'Executive advisory and shadow cabinet',
  'CendiaEternal': 'Succession planning and institutional memory',
  'CendiaCouncil': 'Multi-agent decision synthesis and governance',
};

// Demo scenarios (subset for initial load)
const DEMO_SCENARIOS: WorkflowScenario[] = [
  {
    id: 'WF-001',
    name: 'Quarterly Vendor Contract Renegotiation',
    category: 'Procurement',
    councilMode: 'investment',
    services: ['CendiaProcure', 'CendiaChronos', 'CendiaEquity'],
    steps: [
      { order: 1, action: 'Identify expiring contracts in next 90 days', service: 'CendiaProcure', output: 'contract_list' },
      { order: 2, action: 'Analyze historical spending patterns', service: 'CendiaChronos', output: 'spending_trends' },
      { order: 3, action: 'Calculate potential savings opportunities', service: 'CendiaProcure', output: 'savings_analysis' },
      { order: 4, action: 'Generate negotiation leverage points', service: 'CendiaProcure', output: 'leverage_points' },
      { order: 5, action: 'Present to council for approval', service: 'CendiaCouncil', output: 'decision' },
    ],
    councilQuestion: 'We have 12 vendor contracts expiring in Q2 with a combined annual value of $4.2M. Our analysis shows potential savings of $380K through renegotiation. Should we proceed with aggressive renegotiation tactics, or maintain relationships with moderate asks?',
    expectedOutcome: 'Approved negotiation strategy with prioritized vendor list',
    priority: 'high',
    estimatedDuration: '2 weeks',
    tags: ['procurement', 'cost-savings', 'vendor-management'],
  },
  {
    id: 'WF-002',
    name: 'Customer Churn Risk Intervention',
    category: 'Customer Success',
    councilMode: 'crisis',
    services: ['CendiaGuardian', 'CendiaChronos', 'CendiaResonance'],
    steps: [
      { order: 1, action: 'Identify at-risk customers with health score < 50', service: 'CendiaGuardian', output: 'at_risk_list' },
      { order: 2, action: 'Analyze engagement decline patterns', service: 'CendiaChronos', output: 'decline_analysis' },
      { order: 3, action: 'Generate personalized care packages', service: 'CendiaGuardian', output: 'care_packages' },
      { order: 4, action: 'Draft intervention communications', service: 'CendiaResonance', output: 'communications' },
      { order: 5, action: 'Council approval for executive escalation', service: 'CendiaCouncil', output: 'decision' },
    ],
    councilQuestion: 'We have identified 8 enterprise customers representing $2.1M ARR with rapidly declining health scores. Three have already initiated RFPs with competitors. What level of intervention and executive involvement should we authorize?',
    expectedOutcome: 'Approved intervention plan with executive sponsor assignments',
    priority: 'critical',
    estimatedDuration: '48 hours',
    tags: ['customer-success', 'churn-prevention', 'retention'],
  },
  {
    id: 'WF-003',
    name: 'Production Line Failure Prevention',
    category: 'Manufacturing',
    councilMode: 'execution',
    services: ['CendiaFactory', 'CendiaNerve', 'CendiaChronos'],
    steps: [
      { order: 1, action: 'Run predictive failure analysis on all lines', service: 'CendiaFactory', output: 'failure_predictions' },
      { order: 2, action: 'Cross-reference with IT infrastructure health', service: 'CendiaNerve', output: 'infra_health' },
      { order: 3, action: 'Analyze historical failure patterns', service: 'CendiaChronos', output: 'pattern_analysis' },
      { order: 4, action: 'Schedule preventive maintenance windows', service: 'CendiaFactory', output: 'maintenance_schedule' },
      { order: 5, action: 'Council approval for production impact', service: 'CendiaCouncil', output: 'decision' },
    ],
    councilQuestion: 'Predictive analysis indicates 3 production lines have >70% probability of critical failure within 30 days. Preventive maintenance requires 48-hour shutdown per line. How should we sequence the maintenance to minimize production impact during peak season?',
    expectedOutcome: 'Approved maintenance schedule with contingency plans',
    priority: 'high',
    estimatedDuration: '1 week',
    tags: ['manufacturing', 'predictive-maintenance', 'operations'],
  },
  {
    id: 'WF-004',
    name: 'M&A Culture Integration Assessment',
    category: 'Mergers & Acquisitions',
    councilMode: 'due-diligence',
    services: ['CendiaNetMesh', 'CendiaAcademy', 'CendiaResonance'],
    steps: [
      { order: 1, action: 'Assess target company culture profile', service: 'CendiaNetMesh', output: 'culture_profile' },
      { order: 2, action: 'Compare with acquirer culture dimensions', service: 'CendiaNetMesh', output: 'culture_comparison' },
      { order: 3, action: 'Identify skill gaps in combined workforce', service: 'CendiaAcademy', output: 'skill_gaps' },
      { order: 4, action: 'Develop integration communication strategy', service: 'CendiaResonance', output: 'comm_strategy' },
      { order: 5, action: 'Council review of integration roadmap', service: 'CendiaCouncil', output: 'decision' },
    ],
    councilQuestion: 'Our culture compatibility analysis shows a 62% alignment score with the acquisition target. Key friction points include decision-making speed (they\'re consensus-driven, we\'re top-down) and work-life balance expectations. Should we proceed with the acquisition given these cultural risks?',
    expectedOutcome: 'Go/No-Go decision with integration risk mitigation plan',
    priority: 'critical',
    estimatedDuration: '2 weeks',
    tags: ['m&a', 'culture', 'integration'],
  },
  {
    id: 'WF-005',
    name: 'Executive Travel Security Assessment',
    category: 'Security',
    councilMode: 'compliance',
    services: ['CendiaTransit', 'CendiaAegis', 'CendiaNerve'],
    steps: [
      { order: 1, action: 'Assess destination risk profile', service: 'CendiaTransit', output: 'risk_assessment' },
      { order: 2, action: 'Check for active threats in region', service: 'CendiaAegis', output: 'threat_intel' },
      { order: 3, action: 'Verify secure communication channels', service: 'CendiaNerve', output: 'comm_security' },
      { order: 4, action: 'Generate security plan with extraction options', service: 'CendiaTransit', output: 'security_plan' },
      { order: 5, action: 'Council approval for high-risk travel', service: 'CendiaCouncil', output: 'decision' },
    ],
    councilQuestion: 'The CEO has requested travel to a region with elevated security risk (Level 3) for a critical partnership meeting. Our security assessment recommends enhanced protection measures costing $45K. Should we approve the travel with full security protocol, suggest virtual meeting, or postpone?',
    expectedOutcome: 'Travel decision with approved security measures',
    priority: 'high',
    estimatedDuration: '24 hours',
    tags: ['security', 'executive-protection', 'travel'],
  },
  {
    id: 'WF-010',
    name: 'IT Incident Response Activation',
    category: 'IT Operations',
    councilMode: 'crisis',
    services: ['CendiaNerve', 'CendiaAegis', 'CendiaResonance'],
    steps: [
      { order: 1, action: 'Detect and classify incident severity', service: 'CendiaNerve', output: 'incident_classification' },
      { order: 2, action: 'Assess security threat indicators', service: 'CendiaAegis', output: 'threat_assessment' },
      { order: 3, action: 'Activate Lazarus Protocol if needed', service: 'CendiaNerve', output: 'recovery_protocol' },
      { order: 4, action: 'Prepare stakeholder communications', service: 'CendiaResonance', output: 'communications' },
      { order: 5, action: 'Council authorization for escalation', service: 'CendiaCouncil', output: 'decision' },
    ],
    councilQuestion: 'We have detected a P1 incident affecting our payment processing system. Initial analysis suggests potential data exfiltration. Customer impact is growing. Should we activate full Lazarus Protocol (2-hour recovery, $50K cost) or attempt targeted remediation (4-6 hours, lower cost but higher risk)?',
    expectedOutcome: 'Authorized incident response with communication plan',
    priority: 'critical',
    estimatedDuration: '2 hours',
    tags: ['incident-response', 'security', 'operations'],
  },
];

// Walkthrough Step Component
const WalkthroughStep: React.FC<{
  step: WorkflowStep;
  isActive: boolean;
  isCompleted: boolean;
  onActivate: () => void;
}> = ({ step, isActive, isCompleted, onActivate }) => {
  const serviceDesc = SERVICE_DESCRIPTIONS[step.service] || step.service;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: step.order * 0.1 }}
      className={`relative pl-8 pb-6 border-l-2 ${
        isCompleted ? 'border-green-500' : isActive ? 'border-cyan-500' : 'border-slate-600'
      }`}
    >
      {/* Step indicator */}
      <div
        className={`absolute -left-3 w-6 h-6 rounded-full flex items-center justify-center cursor-pointer transition-all ${
          isCompleted
            ? 'bg-green-500 text-white'
            : isActive
            ? 'bg-cyan-500 text-white ring-4 ring-cyan-500/30'
            : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
        }`}
        onClick={onActivate}
      >
        {isCompleted ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          <span className="text-xs font-bold">{step.order}</span>
        )}
      </div>

      {/* Step content */}
      <div className={`ml-4 ${isActive ? 'opacity-100' : 'opacity-70'}`}>
        <div className="flex items-start justify-between">
          <div>
            <h4 className={`font-semibold ${isActive ? 'text-white' : 'text-gray-300'}`}>
              {step.action}
            </h4>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs px-2 py-0.5 bg-slate-700 rounded text-cyan-400">
                {step.service}
              </span>
              <span className="text-xs text-gray-500">→ {step.output}</span>
            </div>
          </div>
        </div>
        
        {isActive && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700"
          >
            <p className="text-sm text-gray-400">{serviceDesc}</p>
            <div className="mt-2 flex items-center gap-2">
              <button className="px-3 py-1.5 bg-cyan-600 hover:bg-cyan-500 rounded text-sm text-white font-medium flex items-center gap-1">
                <Play className="w-3 h-3" />
                Execute Step
              </button>
              <button className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 rounded text-sm text-gray-300">
                View Details
              </button>
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

// Walkthrough Card Component
const WalkthroughCard: React.FC<{
  scenario: WorkflowScenario;
  onStart: () => void;
}> = ({ scenario, onStart }) => {
  const categoryConfig = CATEGORY_CONFIG[scenario.category] || { icon: <FileText className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/20' };
  const priorityConfig = PRIORITY_CONFIG[scenario.priority] ?? { color: 'text-amber-400', bg: 'bg-amber-500/20' };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-slate-800/50 rounded-xl border border-slate-700 p-5 hover:border-cyan-500/50 transition-colors cursor-pointer"
      onClick={onStart}
    >
      <div className="flex items-start justify-between mb-3">
        <div className={`p-2 rounded-lg ${categoryConfig.bg}`}>
          <span className={categoryConfig.color}>{categoryConfig.icon}</span>
        </div>
        <span className={`text-xs px-2 py-1 rounded ${priorityConfig.bg} ${priorityConfig.color} uppercase font-medium`}>
          {scenario.priority}
        </span>
      </div>

      <h3 className="font-semibold text-white mb-1">{scenario.name}</h3>
      <p className="text-sm text-gray-400 mb-3">{scenario.category}</p>

      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
        <span className="flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {scenario.estimatedDuration}
        </span>
        <span className="flex items-center gap-1">
          <Target className="w-3 h-3" />
          {scenario.steps.length} steps
        </span>
      </div>

      <div className="flex flex-wrap gap-1">
        {scenario.tags.slice(0, 3).map(tag => (
          <span key={tag} className="text-xs px-2 py-0.5 bg-slate-700 rounded text-gray-400">
            {tag}
          </span>
        ))}
      </div>

      <button className="mt-4 w-full py-2 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg text-cyan-400 font-medium flex items-center justify-center gap-2">
        <Play className="w-4 h-4" />
        Start Walkthrough
      </button>
    </motion.div>
  );
};

// Active Walkthrough View
const ActiveWalkthrough: React.FC<{
  scenario: WorkflowScenario;
  onClose: () => void;
}> = ({ scenario, onClose }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const categoryConfig = CATEGORY_CONFIG[scenario.category] || { icon: <FileText className="w-5 h-5" />, color: 'text-gray-400', bg: 'bg-gray-500/20' };

  const handleCompleteStep = (stepOrder: number) => {
    if (!completedSteps.includes(stepOrder)) {
      setCompletedSteps([...completedSteps, stepOrder]);
      if (stepOrder < scenario.steps.length) {
        setActiveStep(stepOrder);
      }
    }
  };

  const progress = (completedSteps.length / scenario.steps.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-sm flex items-center gap-1 mb-2"
          >
            ← Back to Walkthroughs
          </button>
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-xl ${categoryConfig.bg}`}>
              <span className={categoryConfig.color}>{categoryConfig.icon}</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white">{scenario.name}</h1>
              <p className="text-gray-400">{scenario.category} • {scenario.estimatedDuration}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-cyan-400">{Math.round(progress)}%</div>
          <div className="text-sm text-gray-500">Complete</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Steps */}
        <div className="lg:col-span-2 bg-slate-800/30 rounded-xl border border-slate-700 p-6">
          <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-cyan-400" />
            Step-by-Step Guide
          </h2>

          <div className="space-y-2">
            {scenario.steps.map((step, idx) => (
              <WalkthroughStep
                key={step.order}
                step={step}
                isActive={activeStep === idx}
                isCompleted={completedSteps.includes(step.order)}
                onActivate={() => setActiveStep(idx)}
              />
            ))}
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-between mt-6 pt-6 border-t border-slate-700">
            <button
              onClick={() => setActiveStep(Math.max(0, activeStep - 1))}
              disabled={activeStep === 0}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2"
            >
              ← Previous
            </button>
            <button
              onClick={() => {
                const currentStep = scenario.steps[activeStep];
                if (currentStep) {
                  handleCompleteStep(currentStep.order);
                }
              }}
              className="px-6 py-2 bg-green-600 hover:bg-green-500 rounded-lg text-white font-medium flex items-center gap-2"
            >
              <CheckCircle className="w-4 h-4" />
              Mark Complete
            </button>
            <button
              onClick={() => setActiveStep(Math.min(scenario.steps.length - 1, activeStep + 1))}
              disabled={activeStep === scenario.steps.length - 1}
              className="px-4 py-2 bg-slate-700 hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-white flex items-center gap-2"
            >
              Next →
            </button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Council Question */}
          <div className="bg-gradient-to-br from-purple-900/30 to-slate-900 rounded-xl border border-purple-500/30 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-purple-400" />
              Council Question
            </h3>
            <p className="text-sm text-gray-300 leading-relaxed">
              {scenario.councilQuestion}
            </p>
            <button className="mt-4 w-full py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-white font-medium flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Ask the Council
            </button>
          </div>

          {/* Expected Outcome */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-green-400" />
              Expected Outcome
            </h3>
            <p className="text-sm text-gray-400">
              {scenario.expectedOutcome}
            </p>
          </div>

          {/* Services Used */}
          <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-5">
            <h3 className="font-semibold text-white mb-3 flex items-center gap-2">
              <Zap className="w-5 h-5 text-amber-400" />
              Services Used
            </h3>
            <div className="space-y-2">
              {scenario.services.map(service => (
                <div key={service} className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 rounded-full bg-cyan-400" />
                  <span className="text-gray-300">{service}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Main Page Component
const WalkthroughsPage: React.FC = () => {
  const [scenarios, setScenarios] = useState<WorkflowScenario[]>(DEMO_SCENARIOS);
  const [activeScenario, setActiveScenario] = useState<WorkflowScenario | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Load scenarios from backend
  useEffect(() => {
    const loadScenarios = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/v1/workflows/scenarios');
        if (response.ok) {
          const result = await response.json();
          if (result.success && Array.isArray(result.data)) {
            setScenarios(result.data);
          }
        }
      } catch (err) {
        console.log('Using demo scenarios');
      }
      setLoading(false);
    };
    loadScenarios();
  }, []);

  // Get unique categories
  const categories = [...new Set(scenarios.map(s => s.category))];

  // Filter scenarios
  const filteredScenarios = scenarios.filter(s => {
    const matchesSearch = searchQuery === '' || 
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || s.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (activeScenario) {
    return (
      <div className="p-6 max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          <ActiveWalkthrough
            scenario={activeScenario}
            onClose={() => setActiveScenario(null)}
          />
        </AnimatePresence>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-cyan-400" />
            Workflow Walkthroughs
          </h1>
          <p className="text-gray-400 mt-1">
            Step-by-step guides for enterprise decision workflows
          </p>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-white">{scenarios.length}</div>
          <div className="text-sm text-gray-500">Available Workflows</div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center gap-4 flex-wrap">
        <div className="relative flex-1 min-w-[300px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
          <input
            type="text"
            placeholder="Search workflows..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="w-5 h-5 text-gray-500" />
          <button
            onClick={() => setSelectedCategory(null)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              !selectedCategory ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
            }`}
          >
            All
          </button>
          {categories.slice(0, 5).map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                selectedCategory === cat ? 'bg-cyan-600 text-white' : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scenarios Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="animate-spin w-8 h-8 border-2 border-cyan-500 border-t-transparent rounded-full mx-auto mb-4" />
          <p className="text-gray-400">Loading workflows...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredScenarios.map(scenario => (
            <WalkthroughCard
              key={scenario.id}
              scenario={scenario}
              onStart={() => setActiveScenario(scenario)}
            />
          ))}
        </div>
      )}

      {filteredScenarios.length === 0 && !loading && (
        <div className="text-center py-12">
          <BookOpen className="w-12 h-12 text-gray-600 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">No Workflows Found</h3>
          <p className="text-gray-400">Try adjusting your search or filter criteria.</p>
        </div>
      )}
    </div>
  );
};

export default WalkthroughsPage;
