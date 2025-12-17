/**
 * Onboarding Wizard Component
 * 
 * Guided first-run experience:
 * 1. Connect data source
 * 2. Configure agents
 * 3. Run first deliberation
 */
// @ts-nocheck
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
import { cn } from '../../../lib/utils';
interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  icon: string;
}
interface DataSource {
  id: string;
  name: string;
  icon: string;
  category: string;
  description: string;
  popular?: boolean;
}
const STEPS: OnboardingStep[] = stryMutAct_9fa48("4769") ? [] : (stryCov_9fa48("4769"), [stryMutAct_9fa48("4770") ? {} : (stryCov_9fa48("4770"), {
  id: 'welcome',
  title: 'Welcome',
  description: 'Get started with Datacendia',
  icon: '👋'
}), stryMutAct_9fa48("4775") ? {} : (stryCov_9fa48("4775"), {
  id: 'data',
  title: 'Connect Data',
  description: 'Link your first data source',
  icon: '🔗'
}), stryMutAct_9fa48("4780") ? {} : (stryCov_9fa48("4780"), {
  id: 'agents',
  title: 'Configure Agents',
  description: 'Set up your AI Council',
  icon: '🧠'
}), stryMutAct_9fa48("4785") ? {} : (stryCov_9fa48("4785"), {
  id: 'deliberation',
  title: 'First Deliberation',
  description: 'Ask your first question',
  icon: '⚖️'
}), stryMutAct_9fa48("4790") ? {} : (stryCov_9fa48("4790"), {
  id: 'activation',
  title: 'Activate Modules',
  description: 'Choose your activation path',
  icon: '🚀'
}), stryMutAct_9fa48("4795") ? {} : (stryCov_9fa48("4795"), {
  id: 'complete',
  title: 'Complete',
  description: 'You\'re ready to go!',
  icon: '🎉'
})]);

// Module activation path - progressive unlocking
interface ModuleActivation {
  id: string;
  name: string;
  icon: string;
  description: string;
  unlocks: string[];
  recommended: boolean;
  tier: 'core' | 'advanced' | 'sovereign';
}
const MODULE_ACTIVATION_PATH: ModuleActivation[] = stryMutAct_9fa48("4800") ? [] : (stryCov_9fa48("4800"), [stryMutAct_9fa48("4801") ? {} : (stryCov_9fa48("4801"), {
  id: 'council',
  name: 'AI Council',
  icon: '⚖️',
  description: 'Multi-agent deliberation on strategic questions',
  unlocks: stryMutAct_9fa48("4806") ? [] : (stryCov_9fa48("4806"), ['decision-dna']),
  recommended: stryMutAct_9fa48("4808") ? false : (stryCov_9fa48("4808"), true),
  tier: 'core'
}), stryMutAct_9fa48("4810") ? {} : (stryCov_9fa48("4810"), {
  id: 'decision-dna',
  name: 'Decision DNA',
  icon: '🧬',
  description: 'Track and analyze all decisions',
  unlocks: stryMutAct_9fa48("4815") ? [] : (stryCov_9fa48("4815"), ['chronos', 'crucible']),
  recommended: stryMutAct_9fa48("4818") ? false : (stryCov_9fa48("4818"), true),
  tier: 'core'
}), stryMutAct_9fa48("4820") ? {} : (stryCov_9fa48("4820"), {
  id: 'chronos',
  name: 'Chronos',
  icon: '⏰',
  description: 'Time-travel through your decision history',
  unlocks: stryMutAct_9fa48("4825") ? ["Stryker was here"] : (stryCov_9fa48("4825"), []),
  recommended: stryMutAct_9fa48("4826") ? true : (stryCov_9fa48("4826"), false),
  tier: 'core'
}), stryMutAct_9fa48("4828") ? {} : (stryCov_9fa48("4828"), {
  id: 'crucible',
  name: 'Crucible',
  icon: '🔥',
  description: 'Stress-test decisions with simulations',
  unlocks: stryMutAct_9fa48("4833") ? [] : (stryCov_9fa48("4833"), ['vox']),
  recommended: stryMutAct_9fa48("4835") ? false : (stryCov_9fa48("4835"), true),
  tier: 'advanced'
}), stryMutAct_9fa48("4837") ? {} : (stryCov_9fa48("4837"), {
  id: 'vox',
  name: 'Vox',
  icon: '🗣️',
  description: 'Stakeholder voice assembly',
  unlocks: stryMutAct_9fa48("4842") ? [] : (stryCov_9fa48("4842"), ['eternal']),
  recommended: stryMutAct_9fa48("4844") ? true : (stryCov_9fa48("4844"), false),
  tier: 'advanced'
}), stryMutAct_9fa48("4846") ? {} : (stryCov_9fa48("4846"), {
  id: 'panopticon',
  name: 'Panopticon',
  icon: '👁️',
  description: 'Regulatory intelligence monitoring',
  unlocks: stryMutAct_9fa48("4851") ? ["Stryker was here"] : (stryCov_9fa48("4851"), []),
  recommended: stryMutAct_9fa48("4852") ? true : (stryCov_9fa48("4852"), false),
  tier: 'advanced'
}), stryMutAct_9fa48("4854") ? {} : (stryCov_9fa48("4854"), {
  id: 'symbiont',
  name: 'Symbiont',
  icon: '🤝',
  description: 'Partnership ecosystem management',
  unlocks: stryMutAct_9fa48("4859") ? ["Stryker was here"] : (stryCov_9fa48("4859"), []),
  recommended: stryMutAct_9fa48("4860") ? true : (stryCov_9fa48("4860"), false),
  tier: 'advanced'
}), stryMutAct_9fa48("4862") ? {} : (stryCov_9fa48("4862"), {
  id: 'aegis',
  name: 'Aegis',
  icon: '🛡️',
  description: 'Threat detection and security intel',
  unlocks: stryMutAct_9fa48("4867") ? ["Stryker was here"] : (stryCov_9fa48("4867"), []),
  recommended: stryMutAct_9fa48("4868") ? true : (stryCov_9fa48("4868"), false),
  tier: 'sovereign'
}), stryMutAct_9fa48("4870") ? {} : (stryCov_9fa48("4870"), {
  id: 'eternal',
  name: 'Eternal',
  icon: '📜',
  description: '100-year institutional memory',
  unlocks: stryMutAct_9fa48("4875") ? ["Stryker was here"] : (stryCov_9fa48("4875"), []),
  recommended: stryMutAct_9fa48("4876") ? true : (stryCov_9fa48("4876"), false),
  tier: 'sovereign'
})]);
const ACTIVATION_PATHS = stryMutAct_9fa48("4878") ? [] : (stryCov_9fa48("4878"), [stryMutAct_9fa48("4879") ? {} : (stryCov_9fa48("4879"), {
  id: 'quick',
  name: 'Quick Start',
  description: 'Council + Decision DNA only',
  modules: stryMutAct_9fa48("4883") ? [] : (stryCov_9fa48("4883"), ['council', 'decision-dna']),
  time: '5 min'
}), stryMutAct_9fa48("4887") ? {} : (stryCov_9fa48("4887"), {
  id: 'recommended',
  name: 'Recommended',
  description: 'Core + Crucible for stress testing',
  modules: stryMutAct_9fa48("4891") ? [] : (stryCov_9fa48("4891"), ['council', 'decision-dna', 'crucible']),
  time: '10 min'
}), stryMutAct_9fa48("4896") ? {} : (stryCov_9fa48("4896"), {
  id: 'complete',
  name: 'Full Platform',
  description: 'All modules activated',
  modules: MODULE_ACTIVATION_PATH.map(stryMutAct_9fa48("4900") ? () => undefined : (stryCov_9fa48("4900"), m => m.id)),
  time: '20 min'
})]);
const DATA_SOURCES: DataSource[] = stryMutAct_9fa48("4902") ? [] : (stryCov_9fa48("4902"), [stryMutAct_9fa48("4903") ? {} : (stryCov_9fa48("4903"), {
  id: 'salesforce',
  name: 'Salesforce',
  icon: '☁️',
  category: 'CRM',
  description: 'Connect your Salesforce instance',
  popular: stryMutAct_9fa48("4909") ? false : (stryCov_9fa48("4909"), true)
}), stryMutAct_9fa48("4910") ? {} : (stryCov_9fa48("4910"), {
  id: 'hubspot',
  name: 'HubSpot',
  icon: '🧡',
  category: 'CRM',
  description: 'Sync HubSpot contacts and deals',
  popular: stryMutAct_9fa48("4916") ? false : (stryCov_9fa48("4916"), true)
}), stryMutAct_9fa48("4917") ? {} : (stryCov_9fa48("4917"), {
  id: 'snowflake',
  name: 'Snowflake',
  icon: '❄️',
  category: 'Data Warehouse',
  description: 'Query your Snowflake data',
  popular: stryMutAct_9fa48("4923") ? false : (stryCov_9fa48("4923"), true)
}), stryMutAct_9fa48("4924") ? {} : (stryCov_9fa48("4924"), {
  id: 'bigquery',
  name: 'BigQuery',
  icon: '📊',
  category: 'Data Warehouse',
  description: 'Connect Google BigQuery'
}), stryMutAct_9fa48("4930") ? {} : (stryCov_9fa48("4930"), {
  id: 'postgres',
  name: 'PostgreSQL',
  icon: '🐘',
  category: 'Database',
  description: 'Direct PostgreSQL connection'
}), stryMutAct_9fa48("4936") ? {} : (stryCov_9fa48("4936"), {
  id: 'mysql',
  name: 'MySQL',
  icon: '🐬',
  category: 'Database',
  description: 'Connect MySQL database'
}), stryMutAct_9fa48("4942") ? {} : (stryCov_9fa48("4942"), {
  id: 'mongodb',
  name: 'MongoDB',
  icon: '🍃',
  category: 'Database',
  description: 'NoSQL MongoDB connection'
}), stryMutAct_9fa48("4948") ? {} : (stryCov_9fa48("4948"), {
  id: 'sap',
  name: 'SAP',
  icon: '🔷',
  category: 'ERP',
  description: 'SAP S/4HANA integration',
  popular: stryMutAct_9fa48("4954") ? false : (stryCov_9fa48("4954"), true)
}), stryMutAct_9fa48("4955") ? {} : (stryCov_9fa48("4955"), {
  id: 'netsuite',
  name: 'NetSuite',
  icon: '📦',
  category: 'ERP',
  description: 'Oracle NetSuite connection'
}), stryMutAct_9fa48("4961") ? {} : (stryCov_9fa48("4961"), {
  id: 'quickbooks',
  name: 'QuickBooks',
  icon: '💚',
  category: 'Finance',
  description: 'Intuit QuickBooks sync'
}), stryMutAct_9fa48("4967") ? {} : (stryCov_9fa48("4967"), {
  id: 'xero',
  name: 'Xero',
  icon: '💙',
  category: 'Finance',
  description: 'Xero accounting data'
}), stryMutAct_9fa48("4973") ? {} : (stryCov_9fa48("4973"), {
  id: 'stripe',
  name: 'Stripe',
  icon: '💳',
  category: 'Payments',
  description: 'Stripe payments and subscriptions'
}), stryMutAct_9fa48("4979") ? {} : (stryCov_9fa48("4979"), {
  id: 'slack',
  name: 'Slack',
  icon: '💬',
  category: 'Communication',
  description: 'Slack workspace integration'
}), stryMutAct_9fa48("4985") ? {} : (stryCov_9fa48("4985"), {
  id: 'jira',
  name: 'Jira',
  icon: '📋',
  category: 'Project Management',
  description: 'Atlassian Jira projects'
}), stryMutAct_9fa48("4991") ? {} : (stryCov_9fa48("4991"), {
  id: 'github',
  name: 'GitHub',
  icon: '🐙',
  category: 'Development',
  description: 'GitHub repositories and issues'
}), stryMutAct_9fa48("4997") ? {} : (stryCov_9fa48("4997"), {
  id: 'csv',
  name: 'CSV Upload',
  icon: '📄',
  category: 'File',
  description: 'Upload CSV or Excel files'
}), stryMutAct_9fa48("5003") ? {} : (stryCov_9fa48("5003"), {
  id: 'api',
  name: 'REST API',
  icon: '🔌',
  category: 'Custom',
  description: 'Custom API integration'
})]);
const AGENT_PRESETS = stryMutAct_9fa48("5009") ? [] : (stryCov_9fa48("5009"), [stryMutAct_9fa48("5010") ? {} : (stryCov_9fa48("5010"), {
  id: 'balanced',
  name: 'Balanced Council',
  description: 'CFO, COO, CISO, CMO - Good for general decisions',
  agents: stryMutAct_9fa48("5014") ? [] : (stryCov_9fa48("5014"), ['cfo', 'coo', 'ciso', 'cmo'])
}), stryMutAct_9fa48("5019") ? {} : (stryCov_9fa48("5019"), {
  id: 'financial',
  name: 'Financial Focus',
  description: 'CFO, Risk, CDO - Best for financial decisions',
  agents: stryMutAct_9fa48("5023") ? [] : (stryCov_9fa48("5023"), ['cfo', 'risk', 'cdo'])
}), stryMutAct_9fa48("5027") ? {} : (stryCov_9fa48("5027"), {
  id: 'operations',
  name: 'Operations Focus',
  description: 'COO, Risk, CDO - Ideal for operational planning',
  agents: stryMutAct_9fa48("5031") ? [] : (stryCov_9fa48("5031"), ['coo', 'risk', 'cdo'])
}), stryMutAct_9fa48("5035") ? {} : (stryCov_9fa48("5035"), {
  id: 'security',
  name: 'Security Focus',
  description: 'CISO, Risk, Ethics - For security and compliance',
  agents: stryMutAct_9fa48("5039") ? [] : (stryCov_9fa48("5039"), ['ciso', 'risk', 'ethics'])
}), stryMutAct_9fa48("5043") ? {} : (stryCov_9fa48("5043"), {
  id: 'growth',
  name: 'Growth Focus',
  description: 'CMO, CRO, CDO - For growth and market decisions',
  agents: stryMutAct_9fa48("5047") ? [] : (stryCov_9fa48("5047"), ['cmo', 'cro', 'cdo'])
}), stryMutAct_9fa48("5051") ? {} : (stryCov_9fa48("5051"), {
  id: 'all',
  name: 'Full Council',
  description: 'All 8 agents - Maximum perspectives',
  agents: stryMutAct_9fa48("5055") ? [] : (stryCov_9fa48("5055"), ['chief', 'cfo', 'coo', 'ciso', 'cmo', 'cro', 'cdo', 'risk'])
})]);
const SAMPLE_QUESTIONS = stryMutAct_9fa48("5064") ? [] : (stryCov_9fa48("5064"), ["What are the key risks in our Q1 growth strategy?", "Should we expand into the European market this year?", "How can we reduce our operational costs by 15%?", "What's the best approach to our upcoming product launch?", "Analyze the competitive landscape in our industry"]);
interface OnboardingWizardProps {
  onComplete: () => void;
  onSkip: () => void;
}
const OnboardingWizard: React.FC<OnboardingWizardProps> = ({
  onComplete,
  onSkip
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [selectedDataSource, setSelectedDataSource] = useState<string | null>(null);
  const [selectedAgentPreset, setSelectedAgentPreset] = useState<string>('balanced');
  const [firstQuestion, setFirstQuestion] = useState('');
  const [isConnecting, setIsConnecting] = useState(stryMutAct_9fa48("5073") ? true : (stryCov_9fa48("5073"), false));
  const [connectionSuccess, setConnectionSuccess] = useState(stryMutAct_9fa48("5074") ? true : (stryCov_9fa48("5074"), false));
  const [selectedActivationPath, setSelectedActivationPath] = useState<string>('recommended');
  const [activatedModules, setActivatedModules] = useState<string[]>(stryMutAct_9fa48("5076") ? [] : (stryCov_9fa48("5076"), ['council']));
  const step = STEPS[currentStep];
  const handleNext = () => {
    if (stryMutAct_9fa48("5082") ? currentStep >= STEPS.length - 1 : stryMutAct_9fa48("5081") ? currentStep <= STEPS.length - 1 : stryMutAct_9fa48("5080") ? false : stryMutAct_9fa48("5079") ? true : (stryCov_9fa48("5079", "5080", "5081", "5082"), currentStep < (stryMutAct_9fa48("5083") ? STEPS.length + 1 : (stryCov_9fa48("5083"), STEPS.length - 1)))) {
      setCurrentStep(stryMutAct_9fa48("5085") ? () => undefined : (stryCov_9fa48("5085"), prev => stryMutAct_9fa48("5086") ? prev - 1 : (stryCov_9fa48("5086"), prev + 1)));
    } else {
      onComplete();
    }
  };
  const handleBack = () => {
    if (stryMutAct_9fa48("5092") ? currentStep <= 0 : stryMutAct_9fa48("5091") ? currentStep >= 0 : stryMutAct_9fa48("5090") ? false : stryMutAct_9fa48("5089") ? true : (stryCov_9fa48("5089", "5090", "5091", "5092"), currentStep > 0)) {
      setCurrentStep(stryMutAct_9fa48("5094") ? () => undefined : (stryCov_9fa48("5094"), prev => stryMutAct_9fa48("5095") ? prev + 1 : (stryCov_9fa48("5095"), prev - 1)));
    }
  };
  const handleConnectDataSource = async () => {
    if (stryMutAct_9fa48("5099") ? false : stryMutAct_9fa48("5098") ? true : stryMutAct_9fa48("5097") ? selectedDataSource : (stryCov_9fa48("5097", "5098", "5099"), !selectedDataSource)) return;
    setIsConnecting(stryMutAct_9fa48("5100") ? false : (stryCov_9fa48("5100"), true));
    // Simulate connection
    await new Promise(stryMutAct_9fa48("5101") ? () => undefined : (stryCov_9fa48("5101"), resolve => setTimeout(resolve, 2000)));
    setConnectionSuccess(stryMutAct_9fa48("5102") ? false : (stryCov_9fa48("5102"), true));
    setIsConnecting(stryMutAct_9fa48("5103") ? true : (stryCov_9fa48("5103"), false));
    setTimeout(() => {
      handleNext();
    }, 1000);
  };
  const handleStartDeliberation = () => {
    if (stryMutAct_9fa48("5108") ? firstQuestion : stryMutAct_9fa48("5107") ? false : stryMutAct_9fa48("5106") ? true : (stryCov_9fa48("5106", "5107", "5108"), firstQuestion.trim())) {
      // Would trigger actual deliberation
      handleNext();
    }
  };
  return <div className="fixed inset-0 z-50 bg-gradient-to-br from-primary-900 via-neutral-900 to-neutral-900 flex items-center justify-center">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-4xl mx-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            {STEPS.map(stryMutAct_9fa48("5110") ? () => undefined : (stryCov_9fa48("5110"), (s, idx) => <div key={s.id} className={cn("flex items-center gap-2", (stryMutAct_9fa48("5115") ? idx > currentStep : stryMutAct_9fa48("5114") ? idx < currentStep : stryMutAct_9fa48("5113") ? false : stryMutAct_9fa48("5112") ? true : (stryCov_9fa48("5112", "5113", "5114", "5115"), idx <= currentStep)) ? "text-white" : "text-neutral-500")}>
                <div className={cn("w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all", (stryMutAct_9fa48("5122") ? idx >= currentStep : stryMutAct_9fa48("5121") ? idx <= currentStep : stryMutAct_9fa48("5120") ? false : stryMutAct_9fa48("5119") ? true : (stryCov_9fa48("5119", "5120", "5121", "5122"), idx < currentStep)) ? "bg-green-500 text-white" : (stryMutAct_9fa48("5126") ? idx !== currentStep : stryMutAct_9fa48("5125") ? false : stryMutAct_9fa48("5124") ? true : (stryCov_9fa48("5124", "5125", "5126"), idx === currentStep)) ? "bg-primary-500 text-white ring-4 ring-primary-500/30" : "bg-neutral-700 text-neutral-400")}>
                  {(stryMutAct_9fa48("5132") ? idx >= currentStep : stryMutAct_9fa48("5131") ? idx <= currentStep : stryMutAct_9fa48("5130") ? false : stryMutAct_9fa48("5129") ? true : (stryCov_9fa48("5129", "5130", "5131", "5132"), idx < currentStep)) ? '✓' : s.icon}
                </div>
                <span className="hidden md:block text-sm font-medium">{s.title}</span>
              </div>))}
          </div>
          <div className="h-1 bg-neutral-700 rounded-full">
            <div className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500" style={stryMutAct_9fa48("5134") ? {} : (stryCov_9fa48("5134"), {
            width: `${stryMutAct_9fa48("5136") ? currentStep / (STEPS.length - 1) / 100 : (stryCov_9fa48("5136"), (stryMutAct_9fa48("5137") ? currentStep * (STEPS.length - 1) : (stryCov_9fa48("5137"), currentStep / (stryMutAct_9fa48("5138") ? STEPS.length + 1 : (stryCov_9fa48("5138"), STEPS.length - 1)))) * 100)}%`
          })} />
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-neutral-800/80 backdrop-blur-xl rounded-2xl border border-neutral-700 p-8 min-h-[500px]">
          {/* Welcome Step */}
          {stryMutAct_9fa48("5141") ? step.id === 'welcome' || <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to Datacendia</h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                The AI-powered decision intelligence platform. Let's get you set up in just a few minutes.
              </p>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="text-sm text-neutral-300">Connect your data</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm text-neutral-300">Configure AI agents</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="text-sm text-neutral-300">Start deliberating</div>
                </div>
              </div>
            </div> : stryMutAct_9fa48("5140") ? false : stryMutAct_9fa48("5139") ? true : (stryCov_9fa48("5139", "5140", "5141"), (stryMutAct_9fa48("5143") ? step.id !== 'welcome' : stryMutAct_9fa48("5142") ? true : (stryCov_9fa48("5142", "5143"), step.id === 'welcome')) && <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h1 className="text-3xl font-bold text-white mb-4">Welcome to Datacendia</h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                The AI-powered decision intelligence platform. Let's get you set up in just a few minutes.
              </p>
              <div className="grid grid-cols-3 gap-6 max-w-2xl mx-auto mb-8">
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">🔗</div>
                  <div className="text-sm text-neutral-300">Connect your data</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">🧠</div>
                  <div className="text-sm text-neutral-300">Configure AI agents</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-2xl mb-2">⚖️</div>
                  <div className="text-sm text-neutral-300">Start deliberating</div>
                </div>
              </div>
            </div>)}

          {/* Data Source Step */}
          {stryMutAct_9fa48("5147") ? step.id === 'data' || <div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your First Data Source</h2>
              <p className="text-neutral-400 mb-6">Select a data source to power your Council's insights</p>
              
              {!connectionSuccess ? <>
                  <div className="mb-4">
                    <span className="text-sm text-neutral-400">Popular integrations</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {DATA_SOURCES.filter(ds => ds.popular).map(ds => <button key={ds.id} onClick={() => setSelectedDataSource(ds.id)} className={cn("p-4 rounded-xl border transition-all text-left", selectedDataSource === ds.id ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                        <div className="text-2xl mb-2">{ds.icon}</div>
                        <div className="font-medium text-white">{ds.name}</div>
                        <div className="text-xs text-neutral-400">{ds.category}</div>
                      </button>)}
                  </div>
                  
                  <details className="mb-6">
                    <summary className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                      Show all integrations ({DATA_SOURCES.length})
                    </summary>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {DATA_SOURCES.filter(ds => !ds.popular).map(ds => <button key={ds.id} onClick={() => setSelectedDataSource(ds.id)} className={cn("p-3 rounded-xl border transition-all text-left", selectedDataSource === ds.id ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ds.icon}</span>
                            <div>
                              <div className="font-medium text-white text-sm">{ds.name}</div>
                              <div className="text-xs text-neutral-400">{ds.category}</div>
                            </div>
                          </div>
                        </button>)}
                    </div>
                  </details>

                  {selectedDataSource && <button onClick={handleConnectDataSource} disabled={isConnecting} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                      {isConnecting ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting...
                        </span> : `Connect ${DATA_SOURCES.find(ds => ds.id === selectedDataSource)?.name}`}
                    </button>}
                </> : <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">Connected Successfully!</h3>
                  <p className="text-neutral-400">
                    {DATA_SOURCES.find(ds => ds.id === selectedDataSource)?.name} is now linked to your Council
                  </p>
                </div>}
            </div> : stryMutAct_9fa48("5146") ? false : stryMutAct_9fa48("5145") ? true : (stryCov_9fa48("5145", "5146", "5147"), (stryMutAct_9fa48("5149") ? step.id !== 'data' : stryMutAct_9fa48("5148") ? true : (stryCov_9fa48("5148", "5149"), step.id === 'data')) && <div>
              <h2 className="text-2xl font-bold text-white mb-2">Connect Your First Data Source</h2>
              <p className="text-neutral-400 mb-6">Select a data source to power your Council's insights</p>
              
              {(stryMutAct_9fa48("5151") ? connectionSuccess : (stryCov_9fa48("5151"), !connectionSuccess)) ? <>
                  <div className="mb-4">
                    <span className="text-sm text-neutral-400">Popular integrations</span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
                    {stryMutAct_9fa48("5152") ? DATA_SOURCES.map(ds => <button key={ds.id} onClick={() => setSelectedDataSource(ds.id)} className={cn("p-4 rounded-xl border transition-all text-left", selectedDataSource === ds.id ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                        <div className="text-2xl mb-2">{ds.icon}</div>
                        <div className="font-medium text-white">{ds.name}</div>
                        <div className="text-xs text-neutral-400">{ds.category}</div>
                      </button>) : (stryCov_9fa48("5152"), DATA_SOURCES.filter(stryMutAct_9fa48("5153") ? () => undefined : (stryCov_9fa48("5153"), ds => ds.popular)).map(stryMutAct_9fa48("5154") ? () => undefined : (stryCov_9fa48("5154"), ds => <button key={ds.id} onClick={stryMutAct_9fa48("5155") ? () => undefined : (stryCov_9fa48("5155"), () => setSelectedDataSource(ds.id))} className={cn("p-4 rounded-xl border transition-all text-left", (stryMutAct_9fa48("5159") ? selectedDataSource !== ds.id : stryMutAct_9fa48("5158") ? false : stryMutAct_9fa48("5157") ? true : (stryCov_9fa48("5157", "5158", "5159"), selectedDataSource === ds.id)) ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                        <div className="text-2xl mb-2">{ds.icon}</div>
                        <div className="font-medium text-white">{ds.name}</div>
                        <div className="text-xs text-neutral-400">{ds.category}</div>
                      </button>)))}
                  </div>
                  
                  <details className="mb-6">
                    <summary className="text-sm text-neutral-400 cursor-pointer hover:text-neutral-300">
                      Show all integrations ({DATA_SOURCES.length})
                    </summary>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
                      {stryMutAct_9fa48("5162") ? DATA_SOURCES.map(ds => <button key={ds.id} onClick={() => setSelectedDataSource(ds.id)} className={cn("p-3 rounded-xl border transition-all text-left", selectedDataSource === ds.id ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ds.icon}</span>
                            <div>
                              <div className="font-medium text-white text-sm">{ds.name}</div>
                              <div className="text-xs text-neutral-400">{ds.category}</div>
                            </div>
                          </div>
                        </button>) : (stryCov_9fa48("5162"), DATA_SOURCES.filter(stryMutAct_9fa48("5163") ? () => undefined : (stryCov_9fa48("5163"), ds => stryMutAct_9fa48("5164") ? ds.popular : (stryCov_9fa48("5164"), !ds.popular))).map(stryMutAct_9fa48("5165") ? () => undefined : (stryCov_9fa48("5165"), ds => <button key={ds.id} onClick={stryMutAct_9fa48("5166") ? () => undefined : (stryCov_9fa48("5166"), () => setSelectedDataSource(ds.id))} className={cn("p-3 rounded-xl border transition-all text-left", (stryMutAct_9fa48("5170") ? selectedDataSource !== ds.id : stryMutAct_9fa48("5169") ? false : stryMutAct_9fa48("5168") ? true : (stryCov_9fa48("5168", "5169", "5170"), selectedDataSource === ds.id)) ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{ds.icon}</span>
                            <div>
                              <div className="font-medium text-white text-sm">{ds.name}</div>
                              <div className="text-xs text-neutral-400">{ds.category}</div>
                            </div>
                          </div>
                        </button>)))}
                    </div>
                  </details>

                  {stryMutAct_9fa48("5175") ? selectedDataSource || <button onClick={handleConnectDataSource} disabled={isConnecting} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                      {isConnecting ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting...
                        </span> : `Connect ${DATA_SOURCES.find(ds => ds.id === selectedDataSource)?.name}`}
                    </button> : stryMutAct_9fa48("5174") ? false : stryMutAct_9fa48("5173") ? true : (stryCov_9fa48("5173", "5174", "5175"), selectedDataSource && <button onClick={handleConnectDataSource} disabled={isConnecting} className="w-full py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50">
                      {isConnecting ? <span className="flex items-center justify-center gap-2">
                          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Connecting...
                        </span> : `Connect ${stryMutAct_9fa48("5177") ? DATA_SOURCES.find(ds => ds.id === selectedDataSource).name : (stryCov_9fa48("5177"), DATA_SOURCES.find(stryMutAct_9fa48("5178") ? () => undefined : (stryCov_9fa48("5178"), ds => stryMutAct_9fa48("5181") ? ds.id !== selectedDataSource : stryMutAct_9fa48("5180") ? false : stryMutAct_9fa48("5179") ? true : (stryCov_9fa48("5179", "5180", "5181"), ds.id === selectedDataSource)))?.name)}`}
                    </button>)}
                </> : <div className="text-center py-12">
                  <div className="text-6xl mb-4">✅</div>
                  <h3 className="text-xl font-bold text-white mb-2">Connected Successfully!</h3>
                  <p className="text-neutral-400">
                    {stryMutAct_9fa48("5182") ? DATA_SOURCES.find(ds => ds.id === selectedDataSource).name : (stryCov_9fa48("5182"), DATA_SOURCES.find(stryMutAct_9fa48("5183") ? () => undefined : (stryCov_9fa48("5183"), ds => stryMutAct_9fa48("5186") ? ds.id !== selectedDataSource : stryMutAct_9fa48("5185") ? false : stryMutAct_9fa48("5184") ? true : (stryCov_9fa48("5184", "5185", "5186"), ds.id === selectedDataSource)))?.name)} is now linked to your Council
                  </p>
                </div>}
            </div>)}

          {/* Agents Step */}
          {stryMutAct_9fa48("5189") ? step.id === 'agents' || <div>
              <h2 className="text-2xl font-bold text-white mb-2">Configure Your AI Council</h2>
              <p className="text-neutral-400 mb-6">Choose a preset or customize which agents will advise you</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AGENT_PRESETS.map(preset => <button key={preset.id} onClick={() => setSelectedAgentPreset(preset.id)} className={cn("p-4 rounded-xl border transition-all text-left", selectedAgentPreset === preset.id ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{preset.name}</span>
                      {selectedAgentPreset === preset.id && <span className="text-primary-400">✓</span>}
                    </div>
                    <p className="text-sm text-neutral-400 mb-3">{preset.description}</p>
                    <div className="flex gap-1">
                      {preset.agents.map(a => <span key={a} className="px-2 py-0.5 bg-neutral-600 rounded text-xs text-neutral-300 uppercase">
                          {a}
                        </span>)}
                    </div>
                  </button>)}
              </div>
            </div> : stryMutAct_9fa48("5188") ? false : stryMutAct_9fa48("5187") ? true : (stryCov_9fa48("5187", "5188", "5189"), (stryMutAct_9fa48("5191") ? step.id !== 'agents' : stryMutAct_9fa48("5190") ? true : (stryCov_9fa48("5190", "5191"), step.id === 'agents')) && <div>
              <h2 className="text-2xl font-bold text-white mb-2">Configure Your AI Council</h2>
              <p className="text-neutral-400 mb-6">Choose a preset or customize which agents will advise you</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {AGENT_PRESETS.map(stryMutAct_9fa48("5193") ? () => undefined : (stryCov_9fa48("5193"), preset => <button key={preset.id} onClick={stryMutAct_9fa48("5194") ? () => undefined : (stryCov_9fa48("5194"), () => setSelectedAgentPreset(preset.id))} className={cn("p-4 rounded-xl border transition-all text-left", (stryMutAct_9fa48("5198") ? selectedAgentPreset !== preset.id : stryMutAct_9fa48("5197") ? false : stryMutAct_9fa48("5196") ? true : (stryCov_9fa48("5196", "5197", "5198"), selectedAgentPreset === preset.id)) ? "bg-primary-900/50 border-primary-500" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-white">{preset.name}</span>
                      {stryMutAct_9fa48("5203") ? selectedAgentPreset === preset.id || <span className="text-primary-400">✓</span> : stryMutAct_9fa48("5202") ? false : stryMutAct_9fa48("5201") ? true : (stryCov_9fa48("5201", "5202", "5203"), (stryMutAct_9fa48("5205") ? selectedAgentPreset !== preset.id : stryMutAct_9fa48("5204") ? true : (stryCov_9fa48("5204", "5205"), selectedAgentPreset === preset.id)) && <span className="text-primary-400">✓</span>)}
                    </div>
                    <p className="text-sm text-neutral-400 mb-3">{preset.description}</p>
                    <div className="flex gap-1">
                      {preset.agents.map(stryMutAct_9fa48("5206") ? () => undefined : (stryCov_9fa48("5206"), a => <span key={a} className="px-2 py-0.5 bg-neutral-600 rounded text-xs text-neutral-300 uppercase">
                          {a}
                        </span>))}
                    </div>
                  </button>))}
              </div>
            </div>)}

          {/* First Deliberation Step */}
          {stryMutAct_9fa48("5209") ? step.id === 'deliberation' || <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ask Your First Question</h2>
              <p className="text-neutral-400 mb-6">Let your AI Council analyze a strategic question</p>
              
              <textarea value={firstQuestion} onChange={e => setFirstQuestion(e.target.value)} placeholder="e.g., What are the key risks in our Q1 growth strategy?" className="w-full h-32 p-4 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none mb-4" />
              
              <div className="mb-6">
                <span className="text-sm text-neutral-400">Or try a sample question:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SAMPLE_QUESTIONS.map((q, i) => <button key={i} onClick={() => setFirstQuestion(q)} className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-neutral-300 transition-colors">
                      {q.slice(0, 40)}...
                    </button>)}
                </div>
              </div>
            </div> : stryMutAct_9fa48("5208") ? false : stryMutAct_9fa48("5207") ? true : (stryCov_9fa48("5207", "5208", "5209"), (stryMutAct_9fa48("5211") ? step.id !== 'deliberation' : stryMutAct_9fa48("5210") ? true : (stryCov_9fa48("5210", "5211"), step.id === 'deliberation')) && <div>
              <h2 className="text-2xl font-bold text-white mb-2">Ask Your First Question</h2>
              <p className="text-neutral-400 mb-6">Let your AI Council analyze a strategic question</p>
              
              <textarea value={firstQuestion} onChange={stryMutAct_9fa48("5213") ? () => undefined : (stryCov_9fa48("5213"), e => setFirstQuestion(e.target.value))} placeholder="e.g., What are the key risks in our Q1 growth strategy?" className="w-full h-32 p-4 bg-neutral-700 border border-neutral-600 rounded-xl text-white placeholder-neutral-500 focus:border-primary-500 focus:ring-1 focus:ring-primary-500 resize-none mb-4" />
              
              <div className="mb-6">
                <span className="text-sm text-neutral-400">Or try a sample question:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {SAMPLE_QUESTIONS.map(stryMutAct_9fa48("5214") ? () => undefined : (stryCov_9fa48("5214"), (q, i) => <button key={i} onClick={stryMutAct_9fa48("5215") ? () => undefined : (stryCov_9fa48("5215"), () => setFirstQuestion(q))} className="px-3 py-1.5 bg-neutral-700 hover:bg-neutral-600 rounded-lg text-sm text-neutral-300 transition-colors">
                      {stryMutAct_9fa48("5216") ? q : (stryCov_9fa48("5216"), q.slice(0, 40))}...
                    </button>))}
                </div>
              </div>
            </div>)}

          {/* Module Activation Step */}
          {stryMutAct_9fa48("5219") ? step.id === 'activation' || <div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Activation Path</h2>
              <p className="text-neutral-400 mb-6">Start simple and unlock more as you go, or activate everything now</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {ACTIVATION_PATHS.map(path => <button key={path.id} onClick={() => {
              setSelectedActivationPath(path.id);
              setActivatedModules(path.modules);
            }} className={cn("p-5 rounded-xl border transition-all text-left relative", selectedActivationPath === path.id ? "bg-primary-900/50 border-primary-500 ring-2 ring-primary-500/30" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                    {path.id === 'recommended' && <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        Recommended
                      </span>}
                    <div className="font-medium text-white mb-1">{path.name}</div>
                    <p className="text-sm text-neutral-400 mb-3">{path.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {path.modules.slice(0, 4).map(m => <span key={m} className="text-lg">
                            {MODULE_ACTIVATION_PATH.find(mod => mod.id === m)?.icon}
                          </span>)}
                        {path.modules.length > 4 && <span className="text-xs text-neutral-400">+{path.modules.length - 4}</span>}
                      </div>
                      <span className="text-xs text-neutral-500">~{path.time}</span>
                    </div>
                  </button>)}
              </div>

              {/* Module Flow Visualization */}
              <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-700">
                <div className="text-sm text-neutral-400 mb-4">Your activation path:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {activatedModules.map((modId, idx) => {
                const mod = MODULE_ACTIVATION_PATH.find(m => m.id === modId);
                return <React.Fragment key={modId}>
                        <div className={cn("px-3 py-2 rounded-lg flex items-center gap-2", mod?.tier === 'core' ? 'bg-blue-500/20 border border-blue-500/30' : mod?.tier === 'advanced' ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-amber-500/20 border border-amber-500/30')}>
                          <span>{mod?.icon}</span>
                          <span className="text-sm text-white">{mod?.name}</span>
                        </div>
                        {idx < activatedModules.length - 1 && <span className="text-neutral-500">→</span>}
                      </React.Fragment>;
              })}
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  💡 Tip: You can always activate more modules later from Settings → Modules
                </p>
              </div>
            </div> : stryMutAct_9fa48("5218") ? false : stryMutAct_9fa48("5217") ? true : (stryCov_9fa48("5217", "5218", "5219"), (stryMutAct_9fa48("5221") ? step.id !== 'activation' : stryMutAct_9fa48("5220") ? true : (stryCov_9fa48("5220", "5221"), step.id === 'activation')) && <div>
              <h2 className="text-2xl font-bold text-white mb-2">Choose Your Activation Path</h2>
              <p className="text-neutral-400 mb-6">Start simple and unlock more as you go, or activate everything now</p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                {ACTIVATION_PATHS.map(stryMutAct_9fa48("5223") ? () => undefined : (stryCov_9fa48("5223"), path => <button key={path.id} onClick={() => {
              setSelectedActivationPath(path.id);
              setActivatedModules(path.modules);
            }} className={cn("p-5 rounded-xl border transition-all text-left relative", (stryMutAct_9fa48("5228") ? selectedActivationPath !== path.id : stryMutAct_9fa48("5227") ? false : stryMutAct_9fa48("5226") ? true : (stryCov_9fa48("5226", "5227", "5228"), selectedActivationPath === path.id)) ? "bg-primary-900/50 border-primary-500 ring-2 ring-primary-500/30" : "bg-neutral-700/50 border-neutral-600 hover:border-neutral-500")}>
                    {stryMutAct_9fa48("5233") ? path.id === 'recommended' || <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        Recommended
                      </span> : stryMutAct_9fa48("5232") ? false : stryMutAct_9fa48("5231") ? true : (stryCov_9fa48("5231", "5232", "5233"), (stryMutAct_9fa48("5235") ? path.id !== 'recommended' : stryMutAct_9fa48("5234") ? true : (stryCov_9fa48("5234", "5235"), path.id === 'recommended')) && <span className="absolute -top-2 -right-2 px-2 py-0.5 bg-emerald-500 text-white text-xs font-medium rounded-full">
                        Recommended
                      </span>)}
                    <div className="font-medium text-white mb-1">{path.name}</div>
                    <p className="text-sm text-neutral-400 mb-3">{path.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex gap-1">
                        {stryMutAct_9fa48("5237") ? path.modules.map(m => <span key={m} className="text-lg">
                            {MODULE_ACTIVATION_PATH.find(mod => mod.id === m)?.icon}
                          </span>) : (stryCov_9fa48("5237"), path.modules.slice(0, 4).map(stryMutAct_9fa48("5238") ? () => undefined : (stryCov_9fa48("5238"), m => <span key={m} className="text-lg">
                            {stryMutAct_9fa48("5239") ? MODULE_ACTIVATION_PATH.find(mod => mod.id === m).icon : (stryCov_9fa48("5239"), MODULE_ACTIVATION_PATH.find(stryMutAct_9fa48("5240") ? () => undefined : (stryCov_9fa48("5240"), mod => stryMutAct_9fa48("5243") ? mod.id !== m : stryMutAct_9fa48("5242") ? false : stryMutAct_9fa48("5241") ? true : (stryCov_9fa48("5241", "5242", "5243"), mod.id === m)))?.icon)}
                          </span>)))}
                        {stryMutAct_9fa48("5246") ? path.modules.length > 4 || <span className="text-xs text-neutral-400">+{path.modules.length - 4}</span> : stryMutAct_9fa48("5245") ? false : stryMutAct_9fa48("5244") ? true : (stryCov_9fa48("5244", "5245", "5246"), (stryMutAct_9fa48("5249") ? path.modules.length <= 4 : stryMutAct_9fa48("5248") ? path.modules.length >= 4 : stryMutAct_9fa48("5247") ? true : (stryCov_9fa48("5247", "5248", "5249"), path.modules.length > 4)) && <span className="text-xs text-neutral-400">+{stryMutAct_9fa48("5250") ? path.modules.length + 4 : (stryCov_9fa48("5250"), path.modules.length - 4)}</span>)}
                      </div>
                      <span className="text-xs text-neutral-500">~{path.time}</span>
                    </div>
                  </button>))}
              </div>

              {/* Module Flow Visualization */}
              <div className="p-4 bg-neutral-900/50 rounded-xl border border-neutral-700">
                <div className="text-sm text-neutral-400 mb-4">Your activation path:</div>
                <div className="flex flex-wrap items-center gap-2">
                  {activatedModules.map((modId, idx) => {
                const mod = MODULE_ACTIVATION_PATH.find(stryMutAct_9fa48("5252") ? () => undefined : (stryCov_9fa48("5252"), m => stryMutAct_9fa48("5255") ? m.id !== modId : stryMutAct_9fa48("5254") ? false : stryMutAct_9fa48("5253") ? true : (stryCov_9fa48("5253", "5254", "5255"), m.id === modId)));
                return <React.Fragment key={modId}>
                        <div className={cn("px-3 py-2 rounded-lg flex items-center gap-2", (stryMutAct_9fa48("5259") ? mod?.tier !== 'core' : stryMutAct_9fa48("5258") ? false : stryMutAct_9fa48("5257") ? true : (stryCov_9fa48("5257", "5258", "5259"), (stryMutAct_9fa48("5260") ? mod.tier : (stryCov_9fa48("5260"), mod?.tier)) === 'core')) ? 'bg-blue-500/20 border border-blue-500/30' : (stryMutAct_9fa48("5265") ? mod?.tier !== 'advanced' : stryMutAct_9fa48("5264") ? false : stryMutAct_9fa48("5263") ? true : (stryCov_9fa48("5263", "5264", "5265"), (stryMutAct_9fa48("5266") ? mod.tier : (stryCov_9fa48("5266"), mod?.tier)) === 'advanced')) ? 'bg-purple-500/20 border border-purple-500/30' : 'bg-amber-500/20 border border-amber-500/30')}>
                          <span>{stryMutAct_9fa48("5270") ? mod.icon : (stryCov_9fa48("5270"), mod?.icon)}</span>
                          <span className="text-sm text-white">{stryMutAct_9fa48("5271") ? mod.name : (stryCov_9fa48("5271"), mod?.name)}</span>
                        </div>
                        {stryMutAct_9fa48("5274") ? idx < activatedModules.length - 1 || <span className="text-neutral-500">→</span> : stryMutAct_9fa48("5273") ? false : stryMutAct_9fa48("5272") ? true : (stryCov_9fa48("5272", "5273", "5274"), (stryMutAct_9fa48("5277") ? idx >= activatedModules.length - 1 : stryMutAct_9fa48("5276") ? idx <= activatedModules.length - 1 : stryMutAct_9fa48("5275") ? true : (stryCov_9fa48("5275", "5276", "5277"), idx < (stryMutAct_9fa48("5278") ? activatedModules.length + 1 : (stryCov_9fa48("5278"), activatedModules.length - 1)))) && <span className="text-neutral-500">→</span>)}
                      </React.Fragment>;
              })}
                </div>
                <p className="text-xs text-neutral-500 mt-3">
                  💡 Tip: You can always activate more modules later from Settings → Modules
                </p>
              </div>
            </div>)}

          {/* Complete Step */}
          {stryMutAct_9fa48("5281") ? step.id === 'complete' || <div className="text-center py-8">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-4">You're All Set!</h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                Your Datacendia platform is configured. Start with the Council and explore from there.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Data Connected</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Agents Ready</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">{activatedModules.length} Modules</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Ready to Go</div>
                </div>
              </div>
              <div className="p-4 bg-primary-900/30 border border-primary-500/30 rounded-xl max-w-md mx-auto">
                <div className="text-sm text-primary-300 mb-2">Recommended first action:</div>
                <div className="text-white font-medium">⚖️ Ask your first question in the Council</div>
              </div>
            </div> : stryMutAct_9fa48("5280") ? false : stryMutAct_9fa48("5279") ? true : (stryCov_9fa48("5279", "5280", "5281"), (stryMutAct_9fa48("5283") ? step.id !== 'complete' : stryMutAct_9fa48("5282") ? true : (stryCov_9fa48("5282", "5283"), step.id === 'complete')) && <div className="text-center py-8">
              <div className="text-6xl mb-6">🎉</div>
              <h1 className="text-3xl font-bold text-white mb-4">You're All Set!</h1>
              <p className="text-lg text-neutral-300 mb-8 max-w-2xl mx-auto">
                Your Datacendia platform is configured. Start with the Council and explore from there.
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto mb-6">
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Data Connected</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Agents Ready</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">{activatedModules.length} Modules</div>
                </div>
                <div className="p-4 bg-neutral-700/50 rounded-xl">
                  <div className="text-green-400 text-2xl mb-2">✓</div>
                  <div className="text-sm text-neutral-300">Ready to Go</div>
                </div>
              </div>
              <div className="p-4 bg-primary-900/30 border border-primary-500/30 rounded-xl max-w-md mx-auto">
                <div className="text-sm text-primary-300 mb-2">Recommended first action:</div>
                <div className="text-white font-medium">⚖️ Ask your first question in the Council</div>
              </div>
            </div>)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6">
          <div>
            {stryMutAct_9fa48("5287") ? currentStep > 0 && currentStep < STEPS.length - 1 || <button onClick={handleBack} className="px-6 py-2 text-neutral-400 hover:text-white transition-colors">
                ← Back
              </button> : stryMutAct_9fa48("5286") ? false : stryMutAct_9fa48("5285") ? true : (stryCov_9fa48("5285", "5286", "5287"), (stryMutAct_9fa48("5289") ? currentStep > 0 || currentStep < STEPS.length - 1 : stryMutAct_9fa48("5288") ? true : (stryCov_9fa48("5288", "5289"), (stryMutAct_9fa48("5292") ? currentStep <= 0 : stryMutAct_9fa48("5291") ? currentStep >= 0 : stryMutAct_9fa48("5290") ? true : (stryCov_9fa48("5290", "5291", "5292"), currentStep > 0)) && (stryMutAct_9fa48("5295") ? currentStep >= STEPS.length - 1 : stryMutAct_9fa48("5294") ? currentStep <= STEPS.length - 1 : stryMutAct_9fa48("5293") ? true : (stryCov_9fa48("5293", "5294", "5295"), currentStep < (stryMutAct_9fa48("5296") ? STEPS.length + 1 : (stryCov_9fa48("5296"), STEPS.length - 1)))))) && <button onClick={handleBack} className="px-6 py-2 text-neutral-400 hover:text-white transition-colors">
                ← Back
              </button>)}
          </div>
          <div className="flex items-center gap-4">
            {stryMutAct_9fa48("5299") ? currentStep < STEPS.length - 1 || <button onClick={onSkip} className="px-6 py-2 text-neutral-400 hover:text-white transition-colors">
                Skip Setup
              </button> : stryMutAct_9fa48("5298") ? false : stryMutAct_9fa48("5297") ? true : (stryCov_9fa48("5297", "5298", "5299"), (stryMutAct_9fa48("5302") ? currentStep >= STEPS.length - 1 : stryMutAct_9fa48("5301") ? currentStep <= STEPS.length - 1 : stryMutAct_9fa48("5300") ? true : (stryCov_9fa48("5300", "5301", "5302"), currentStep < (stryMutAct_9fa48("5303") ? STEPS.length + 1 : (stryCov_9fa48("5303"), STEPS.length - 1)))) && <button onClick={onSkip} className="px-6 py-2 text-neutral-400 hover:text-white transition-colors">
                Skip Setup
              </button>)}
            <button onClick={(stryMutAct_9fa48("5306") ? step.id !== 'deliberation' : stryMutAct_9fa48("5305") ? false : stryMutAct_9fa48("5304") ? true : (stryCov_9fa48("5304", "5305", "5306"), step.id === 'deliberation')) ? handleStartDeliberation : handleNext} disabled={stryMutAct_9fa48("5310") ? step.id === 'data' && !connectionSuccess || !selectedDataSource : stryMutAct_9fa48("5309") ? false : stryMutAct_9fa48("5308") ? true : (stryCov_9fa48("5308", "5309", "5310"), (stryMutAct_9fa48("5312") ? step.id === 'data' || !connectionSuccess : stryMutAct_9fa48("5311") ? true : (stryCov_9fa48("5311", "5312"), (stryMutAct_9fa48("5314") ? step.id !== 'data' : stryMutAct_9fa48("5313") ? true : (stryCov_9fa48("5313", "5314"), step.id === 'data')) && (stryMutAct_9fa48("5316") ? connectionSuccess : (stryCov_9fa48("5316"), !connectionSuccess)))) && (stryMutAct_9fa48("5317") ? selectedDataSource : (stryCov_9fa48("5317"), !selectedDataSource)))} className="px-8 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed">
              {(stryMutAct_9fa48("5320") ? step.id !== 'complete' : stryMutAct_9fa48("5319") ? false : stryMutAct_9fa48("5318") ? true : (stryCov_9fa48("5318", "5319", "5320"), step.id === 'complete')) ? 'Enter Dashboard' : (stryMutAct_9fa48("5325") ? step.id !== 'deliberation' : stryMutAct_9fa48("5324") ? false : stryMutAct_9fa48("5323") ? true : (stryCov_9fa48("5323", "5324", "5325"), step.id === 'deliberation')) ? 'Start Deliberation' : 'Continue →'}
            </button>
          </div>
        </div>
      </div>
    </div>;
};
export default OnboardingWizard;