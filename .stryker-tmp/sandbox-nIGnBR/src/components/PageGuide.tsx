// @ts-nocheck
// =============================================================================
// DATACENDIA - PAGE GUIDE COMPONENT
// Reusable wizard/tooltip/guide for onboarding users to service pages
// Features: step-by-step guide, show/hide toggle, skip option, localStorage persistence
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
import React, { useState, useEffect } from 'react';
import { cn } from '../../lib/utils';
export interface GuideStep {
  title: string;
  description: string;
  icon?: string;
  action?: string;
  highlight?: string; // CSS selector to highlight
}
export interface PageGuideProps {
  pageId: string; // Unique ID for localStorage persistence
  title: string;
  description?: string;
  steps: GuideStep[];
  className?: string;
}
export const PageGuide: React.FC<PageGuideProps> = ({
  pageId,
  title,
  description,
  steps,
  className
}) => {
  const storageKey = `datacendia-guide-${pageId}`;
  const [isVisible, setIsVisible] = useState(stryMutAct_9fa48("5331") ? false : (stryCov_9fa48("5331"), true));
  const [isSkipped, setIsSkipped] = useState(stryMutAct_9fa48("5332") ? true : (stryCov_9fa48("5332"), false));
  const [currentStep, setCurrentStep] = useState(0);
  const [isMinimized, setIsMinimized] = useState(stryMutAct_9fa48("5333") ? true : (stryCov_9fa48("5333"), false));

  // Load preferences from localStorage
  useEffect(() => {
    const stored = localStorage.getItem(storageKey);
    if (stryMutAct_9fa48("5336") ? false : stryMutAct_9fa48("5335") ? true : (stryCov_9fa48("5335", "5336"), stored)) {
      try {
        const prefs = JSON.parse(stored);
        setIsSkipped(stryMutAct_9fa48("5341") ? prefs.skipped && false : stryMutAct_9fa48("5340") ? false : stryMutAct_9fa48("5339") ? true : (stryCov_9fa48("5339", "5340", "5341"), prefs.skipped || (stryMutAct_9fa48("5342") ? true : (stryCov_9fa48("5342"), false))));
        setIsMinimized(stryMutAct_9fa48("5345") ? prefs.minimized && false : stryMutAct_9fa48("5344") ? false : stryMutAct_9fa48("5343") ? true : (stryCov_9fa48("5343", "5344", "5345"), prefs.minimized || (stryMutAct_9fa48("5346") ? true : (stryCov_9fa48("5346"), false))));
        setCurrentStep(stryMutAct_9fa48("5349") ? prefs.currentStep && 0 : stryMutAct_9fa48("5348") ? false : stryMutAct_9fa48("5347") ? true : (stryCov_9fa48("5347", "5348", "5349"), prefs.currentStep || 0));
      } catch {
        // Ignore parse errors
      }
    }
  }, stryMutAct_9fa48("5350") ? [] : (stryCov_9fa48("5350"), [storageKey]));

  // Save preferences to localStorage
  const savePrefs = (updates: {
    skipped?: boolean;
    minimized?: boolean;
    currentStep?: number;
  }) => {
    const stored = localStorage.getItem(storageKey);
    let prefs = {};
    try {
      prefs = stored ? JSON.parse(stored) : {};
    } catch {
      // Ignore
    }
    const newPrefs = stryMutAct_9fa48("5353") ? {} : (stryCov_9fa48("5353"), {
      ...prefs,
      ...updates
    });
    localStorage.setItem(storageKey, JSON.stringify(newPrefs));
  };
  const handleSkip = () => {
    setIsSkipped(stryMutAct_9fa48("5355") ? false : (stryCov_9fa48("5355"), true));
    savePrefs(stryMutAct_9fa48("5356") ? {} : (stryCov_9fa48("5356"), {
      skipped: stryMutAct_9fa48("5357") ? false : (stryCov_9fa48("5357"), true)
    }));
  };
  const handleReset = () => {
    setIsSkipped(stryMutAct_9fa48("5359") ? true : (stryCov_9fa48("5359"), false));
    setCurrentStep(0);
    setIsMinimized(stryMutAct_9fa48("5360") ? true : (stryCov_9fa48("5360"), false));
    savePrefs(stryMutAct_9fa48("5361") ? {} : (stryCov_9fa48("5361"), {
      skipped: stryMutAct_9fa48("5362") ? true : (stryCov_9fa48("5362"), false),
      currentStep: 0,
      minimized: stryMutAct_9fa48("5363") ? true : (stryCov_9fa48("5363"), false)
    }));
  };
  const handleToggleMinimize = () => {
    const newMinimized = stryMutAct_9fa48("5365") ? isMinimized : (stryCov_9fa48("5365"), !isMinimized);
    setIsMinimized(newMinimized);
    savePrefs(stryMutAct_9fa48("5366") ? {} : (stryCov_9fa48("5366"), {
      minimized: newMinimized
    }));
  };
  const handleNextStep = () => {
    if (stryMutAct_9fa48("5371") ? currentStep >= steps.length - 1 : stryMutAct_9fa48("5370") ? currentStep <= steps.length - 1 : stryMutAct_9fa48("5369") ? false : stryMutAct_9fa48("5368") ? true : (stryCov_9fa48("5368", "5369", "5370", "5371"), currentStep < (stryMutAct_9fa48("5372") ? steps.length + 1 : (stryCov_9fa48("5372"), steps.length - 1)))) {
      const newStep = stryMutAct_9fa48("5374") ? currentStep - 1 : (stryCov_9fa48("5374"), currentStep + 1);
      setCurrentStep(newStep);
      savePrefs(stryMutAct_9fa48("5375") ? {} : (stryCov_9fa48("5375"), {
        currentStep: newStep
      }));
    } else {
      // Completed all steps
      handleSkip();
    }
  };
  const handlePrevStep = () => {
    if (stryMutAct_9fa48("5381") ? currentStep <= 0 : stryMutAct_9fa48("5380") ? currentStep >= 0 : stryMutAct_9fa48("5379") ? false : stryMutAct_9fa48("5378") ? true : (stryCov_9fa48("5378", "5379", "5380", "5381"), currentStep > 0)) {
      const newStep = stryMutAct_9fa48("5383") ? currentStep + 1 : (stryCov_9fa48("5383"), currentStep - 1);
      setCurrentStep(newStep);
      savePrefs(stryMutAct_9fa48("5384") ? {} : (stryCov_9fa48("5384"), {
        currentStep: newStep
      }));
    }
  };
  const handleGoToStep = (stepIndex: number) => {
    setCurrentStep(stepIndex);
    savePrefs(stryMutAct_9fa48("5386") ? {} : (stryCov_9fa48("5386"), {
      currentStep: stepIndex
    }));
  };

  // If skipped, show only the "Show Guide" button
  if (stryMutAct_9fa48("5388") ? false : stryMutAct_9fa48("5387") ? true : (stryCov_9fa48("5387", "5388"), isSkipped)) {
    return <button onClick={handleReset} className={cn('fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3 py-2', 'bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-lg', 'text-sm font-medium transition-all', className)}>
        <span>❓</span>
        <span>Show Guide</span>
      </button>;
  }

  // Minimized view
  if (stryMutAct_9fa48("5394") ? false : stryMutAct_9fa48("5393") ? true : (stryCov_9fa48("5393", "5394"), isMinimized)) {
    return <div className={cn('fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl', 'p-3 flex items-center gap-3', className)}>
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="text-white font-medium text-sm">{title}</span>
          <span className="text-slate-400 text-xs">
            Step {stryMutAct_9fa48("5398") ? currentStep - 1 : (stryCov_9fa48("5398"), currentStep + 1)}/{steps.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleToggleMinimize} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Expand guide">
            ⬆️
          </button>
          <button onClick={handleSkip} className="p-1.5 hover:bg-slate-700 rounded text-slate-400 hover:text-white" title="Hide guide">
            ✕
          </button>
        </div>
      </div>;
  }
  const currentStepData = steps[currentStep];
  return <div className={cn('fixed bottom-4 right-4 z-50 bg-slate-800 border border-slate-600 rounded-xl shadow-2xl', 'w-96 max-h-[70vh] overflow-hidden', className)}>
      {/* Header */}
      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-t-xl">
        <div className="flex items-center gap-2">
          <span className="text-xl">📖</span>
          <span className="text-white font-semibold">{title}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={handleToggleMinimize} className="p-1.5 hover:bg-white/20 rounded text-white/80 hover:text-white" title="Minimize">
            ⬇️
          </button>
          <button onClick={handleSkip} className="p-1.5 hover:bg-white/20 rounded text-white/80 hover:text-white" title="Skip guide">
            ✕
          </button>
        </div>
      </div>

      {/* Description */}
      {stryMutAct_9fa48("5403") ? description && currentStep === 0 || <div className="px-4 py-2 bg-slate-700/50 border-b border-slate-600 text-slate-300 text-sm">
          {description}
        </div> : stryMutAct_9fa48("5402") ? false : stryMutAct_9fa48("5401") ? true : (stryCov_9fa48("5401", "5402", "5403"), (stryMutAct_9fa48("5405") ? description || currentStep === 0 : stryMutAct_9fa48("5404") ? true : (stryCov_9fa48("5404", "5405"), description && (stryMutAct_9fa48("5407") ? currentStep !== 0 : stryMutAct_9fa48("5406") ? true : (stryCov_9fa48("5406", "5407"), currentStep === 0)))) && <div className="px-4 py-2 bg-slate-700/50 border-b border-slate-600 text-slate-300 text-sm">
          {description}
        </div>)}

      {/* Progress dots */}
      <div className="flex items-center justify-center gap-1.5 p-2 bg-slate-700/30 border-b border-slate-700">
        {steps.map(stryMutAct_9fa48("5408") ? () => undefined : (stryCov_9fa48("5408"), (_, idx) => <button key={idx} onClick={stryMutAct_9fa48("5409") ? () => undefined : (stryCov_9fa48("5409"), () => handleGoToStep(idx))} className={cn('w-2 h-2 rounded-full transition-all', (stryMutAct_9fa48("5413") ? idx !== currentStep : stryMutAct_9fa48("5412") ? false : stryMutAct_9fa48("5411") ? true : (stryCov_9fa48("5411", "5412", "5413"), idx === currentStep)) ? 'bg-indigo-500 w-4' : (stryMutAct_9fa48("5418") ? idx >= currentStep : stryMutAct_9fa48("5417") ? idx <= currentStep : stryMutAct_9fa48("5416") ? false : stryMutAct_9fa48("5415") ? true : (stryCov_9fa48("5415", "5416", "5417", "5418"), idx < currentStep)) ? 'bg-green-500' : 'bg-slate-600 hover:bg-slate-500')} title={`Step ${stryMutAct_9fa48("5422") ? idx - 1 : (stryCov_9fa48("5422"), idx + 1)}`} />))}
      </div>

      {/* Current step content */}
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 w-10 h-10 bg-indigo-600/30 rounded-xl flex items-center justify-center text-2xl">
            {stryMutAct_9fa48("5425") ? currentStepData.icon && `${currentStep + 1}` : stryMutAct_9fa48("5424") ? false : stryMutAct_9fa48("5423") ? true : (stryCov_9fa48("5423", "5424", "5425"), currentStepData.icon || `${stryMutAct_9fa48("5427") ? currentStep - 1 : (stryCov_9fa48("5427"), currentStep + 1)}`)}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-white font-semibold text-sm mb-1">
              {currentStepData.title}
            </h4>
            <p className="text-slate-400 text-sm leading-relaxed">
              {currentStepData.description}
            </p>
            {stryMutAct_9fa48("5430") ? currentStepData.action || <div className="mt-2 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs">
                💡 {currentStepData.action}
              </div> : stryMutAct_9fa48("5429") ? false : stryMutAct_9fa48("5428") ? true : (stryCov_9fa48("5428", "5429", "5430"), currentStepData.action && <div className="mt-2 px-2 py-1 bg-amber-500/20 border border-amber-500/30 rounded text-amber-400 text-xs">
                💡 {currentStepData.action}
              </div>)}
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex items-center justify-between p-3 bg-slate-700/30 border-t border-slate-700">
        <button onClick={handlePrevStep} disabled={stryMutAct_9fa48("5433") ? currentStep !== 0 : stryMutAct_9fa48("5432") ? false : stryMutAct_9fa48("5431") ? true : (stryCov_9fa48("5431", "5432", "5433"), currentStep === 0)} className={cn('px-3 py-1.5 rounded text-sm font-medium transition-all', (stryMutAct_9fa48("5437") ? currentStep !== 0 : stryMutAct_9fa48("5436") ? false : stryMutAct_9fa48("5435") ? true : (stryCov_9fa48("5435", "5436", "5437"), currentStep === 0)) ? 'text-slate-500 cursor-not-allowed' : 'text-slate-300 hover:text-white hover:bg-slate-600')}>
          ← Previous
        </button>
        
        <span className="text-slate-500 text-xs">
          {stryMutAct_9fa48("5440") ? currentStep - 1 : (stryCov_9fa48("5440"), currentStep + 1)} of {steps.length}
        </span>

        {(stryMutAct_9fa48("5444") ? currentStep >= steps.length - 1 : stryMutAct_9fa48("5443") ? currentStep <= steps.length - 1 : stryMutAct_9fa48("5442") ? false : stryMutAct_9fa48("5441") ? true : (stryCov_9fa48("5441", "5442", "5443", "5444"), currentStep < (stryMutAct_9fa48("5445") ? steps.length + 1 : (stryCov_9fa48("5445"), steps.length - 1)))) ? <button onClick={handleNextStep} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded text-sm font-medium transition-all">
            Next →
          </button> : <button onClick={handleSkip} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded text-sm font-medium transition-all">
            ✓ Done
          </button>}
      </div>

      {/* Skip option */}
      <div className="px-4 py-2 bg-slate-800 border-t border-slate-700 text-center">
        <button onClick={handleSkip} className="text-slate-500 hover:text-slate-300 text-xs transition-all">
          Skip this guide and don't show again
        </button>
      </div>
    </div>;
};

// Pre-defined guides for various pages
export const GUIDES = stryMutAct_9fa48("5446") ? {} : (stryCov_9fa48("5446"), {
  decisionDNA: stryMutAct_9fa48("5447") ? {} : (stryCov_9fa48("5447"), {
    pageId: 'decision-dna',
    title: 'Decision DNA Guide',
    description: 'Track the full lifecycle of any business decision with step-by-step replay.',
    steps: stryMutAct_9fa48("5451") ? [] : (stryCov_9fa48("5451"), [stryMutAct_9fa48("5452") ? {} : (stryCov_9fa48("5452"), {
      title: 'Create a Decision',
      description: 'Start by entering a decision title and description in the form on the left. Add optional budget and timeframe.',
      icon: '✏️',
      action: 'Try: "Close EU expansion deal" or "Approve $50M capex for new data centre"'
    }), stryMutAct_9fa48("5457") ? {} : (stryCov_9fa48("5457"), {
      title: 'View Tracked Decisions',
      description: 'Your decisions appear in the list below. Use filters (All | Deciding | Decided | At Risk) to focus on what matters.',
      icon: '📋',
      action: 'Click on a sample decision to explore its full timeline'
    }), stryMutAct_9fa48("5462") ? {} : (stryCov_9fa48("5462"), {
      title: 'Timeline & Artefacts',
      description: 'Each timeline event links to real system outputs - Council minutes, Pre-Mortem analyses, Ghost Board simulations. Click "Open" to view the original artefact.',
      icon: '📜',
      action: 'Hover over any event and click "↗️ Open" to see the source'
    }), stryMutAct_9fa48("5467") ? {} : (stryCov_9fa48("5467"), {
      title: 'AI Council Deliberation',
      description: 'Council events show how AI agents (CEO, CFO, CRO) deliberated - their stances, confidence levels, and consensus reached.',
      icon: '🏛️',
      action: 'Expand a Council Deliberation to see agent-by-agent analysis'
    }), stryMutAct_9fa48("5472") ? {} : (stryCov_9fa48("5472"), {
      title: 'Replay in Chronos',
      description: 'Click "Replay in Chronos" to step through the decision history like a flight recorder. Every step is cryptographically anchored.',
      icon: '🎬',
      action: 'Watch the decision unfold step-by-step'
    }), stryMutAct_9fa48("5477") ? {} : (stryCov_9fa48("5477"), {
      title: 'Cryptographic Audit Trail',
      description: 'Every decision here is: hashed into Chronos, replayable, and exportable for audits. The green hash banner proves immutability.',
      icon: '🔐',
      action: 'Export PDF for boards, JSON for integrations'
    })])
  }),
  council: stryMutAct_9fa48("5482") ? {} : (stryCov_9fa48("5482"), {
    pageId: 'council',
    title: 'AI Council Guide',
    description: 'Get balanced analysis from multiple AI agents representing different perspectives.',
    steps: stryMutAct_9fa48("5486") ? [] : (stryCov_9fa48("5486"), [stryMutAct_9fa48("5487") ? {} : (stryCov_9fa48("5487"), {
      title: 'Enter Your Question',
      description: 'Type a strategic question or decision you need help with in the input field.',
      icon: '❓',
      action: 'Try: "Should we expand into the European market?"'
    }), stryMutAct_9fa48("5492") ? {} : (stryCov_9fa48("5492"), {
      title: 'Select Agents',
      description: 'Choose which AI agents (CEO, CFO, CRO, etc.) should participate in the deliberation.',
      icon: '👥',
      action: 'Select 3-5 agents for diverse perspectives'
    }), stryMutAct_9fa48("5497") ? {} : (stryCov_9fa48("5497"), {
      title: 'Choose Mode',
      description: 'Select the council mode: Deliberation for discussion, Debate for opposing views, or Consensus for agreement.',
      icon: '⚙️'
    }), stryMutAct_9fa48("5501") ? {} : (stryCov_9fa48("5501"), {
      title: 'Run Council Session',
      description: 'Click "Convene Council" to get each agent\'s analysis and recommendation.',
      icon: '🏛️',
      action: 'Watch agents deliberate in real-time'
    }), stryMutAct_9fa48("5506") ? {} : (stryCov_9fa48("5506"), {
      title: 'Review Synthesis',
      description: 'Read the synthesized recommendation that combines all agent perspectives.',
      icon: '📊'
    })])
  }),
  preMortem: stryMutAct_9fa48("5510") ? {} : (stryCov_9fa48("5510"), {
    pageId: 'pre-mortem',
    title: 'Pre-Mortem Guide',
    description: 'Identify potential failure modes before they happen with AI-powered risk analysis.',
    steps: stryMutAct_9fa48("5514") ? [] : (stryCov_9fa48("5514"), [stryMutAct_9fa48("5515") ? {} : (stryCov_9fa48("5515"), {
      title: 'Describe Your Decision',
      description: 'Enter the decision or initiative you want to analyze for potential failures.',
      icon: '📝',
      action: 'Be specific about what you\'re planning'
    }), stryMutAct_9fa48("5520") ? {} : (stryCov_9fa48("5520"), {
      title: 'Add Context',
      description: 'Provide relevant context like budget, timeline, stakeholders, and constraints.',
      icon: '📋'
    }), stryMutAct_9fa48("5524") ? {} : (stryCov_9fa48("5524"), {
      title: 'Run Analysis',
      description: 'Click "Run Pre-Mortem" to have AI agents identify potential failure modes.',
      icon: '💀',
      action: 'AI will simulate future failures'
    }), stryMutAct_9fa48("5529") ? {} : (stryCov_9fa48("5529"), {
      title: 'Review Risks',
      description: 'Examine each failure mode with probability, impact, and mitigation strategies.',
      icon: '⚠️'
    }), stryMutAct_9fa48("5533") ? {} : (stryCov_9fa48("5533"), {
      title: 'Get Recommendation',
      description: 'See the overall risk score and recommendation: Proceed, Delay, or Reconsider.',
      icon: '✅'
    })])
  }),
  ghostBoard: stryMutAct_9fa48("5537") ? {} : (stryCov_9fa48("5537"), {
    pageId: 'ghost-board',
    title: 'Ghost Board Guide',
    description: 'Simulate a board meeting to prepare for tough questions before the real presentation.',
    steps: stryMutAct_9fa48("5541") ? [] : (stryCov_9fa48("5541"), [stryMutAct_9fa48("5542") ? {} : (stryCov_9fa48("5542"), {
      title: 'Set Up Presentation',
      description: 'Enter your proposal or decision that you would present to the board.',
      icon: '🎯'
    }), stryMutAct_9fa48("5546") ? {} : (stryCov_9fa48("5546"), {
      title: 'Select Board Members',
      description: 'Choose which simulated board members to include (investors, advisors, etc.).',
      icon: '👻'
    }), stryMutAct_9fa48("5550") ? {} : (stryCov_9fa48("5550"), {
      title: 'Run Simulation',
      description: 'Click "Simulate Board" to generate tough questions each member might ask.',
      icon: '▶️'
    }), stryMutAct_9fa48("5554") ? {} : (stryCov_9fa48("5554"), {
      title: 'Prepare Answers',
      description: 'Review questions by difficulty level and prepare your responses.',
      icon: '💬'
    }), stryMutAct_9fa48("5558") ? {} : (stryCov_9fa48("5558"), {
      title: 'Check Preparedness',
      description: 'See your preparedness score and identify critical gaps to address.',
      icon: '📊'
    })])
  }),
  metrics: stryMutAct_9fa48("5562") ? {} : (stryCov_9fa48("5562"), {
    pageId: 'metrics',
    title: 'Metrics Dashboard Guide',
    description: 'Monitor your key business metrics and track performance over time.',
    steps: stryMutAct_9fa48("5566") ? [] : (stryCov_9fa48("5566"), [stryMutAct_9fa48("5567") ? {} : (stryCov_9fa48("5567"), {
      title: 'View Key Metrics',
      description: 'The dashboard shows your most important metrics with current values and trends.',
      icon: '📊'
    }), stryMutAct_9fa48("5571") ? {} : (stryCov_9fa48("5571"), {
      title: 'Filter by Category',
      description: 'Use the category filter to focus on financial, operational, or customer metrics.',
      icon: '🔍'
    }), stryMutAct_9fa48("5575") ? {} : (stryCov_9fa48("5575"), {
      title: 'Analyze Trends',
      description: 'Click on any metric card to see detailed history and trend analysis.',
      icon: '📈'
    }), stryMutAct_9fa48("5579") ? {} : (stryCov_9fa48("5579"), {
      title: 'Set Targets',
      description: 'Compare current values against targets to track goal progress.',
      icon: '🎯'
    })])
  }),
  workflows: stryMutAct_9fa48("5583") ? {} : (stryCov_9fa48("5583"), {
    pageId: 'workflows',
    title: 'Workflows Guide',
    description: 'Automate business processes with configurable workflow templates.',
    steps: stryMutAct_9fa48("5587") ? [] : (stryCov_9fa48("5587"), [stryMutAct_9fa48("5588") ? {} : (stryCov_9fa48("5588"), {
      title: 'Browse Workflows',
      description: 'View available workflow templates organized by category.',
      icon: '⚙️'
    }), stryMutAct_9fa48("5592") ? {} : (stryCov_9fa48("5592"), {
      title: 'Check Status',
      description: 'See which workflows are active, paused, or in draft state.',
      icon: '🔄'
    }), stryMutAct_9fa48("5596") ? {} : (stryCov_9fa48("5596"), {
      title: 'View Executions',
      description: 'Click a workflow to see its execution history and results.',
      icon: '📋'
    }), stryMutAct_9fa48("5600") ? {} : (stryCov_9fa48("5600"), {
      title: 'Execute Workflow',
      description: 'Run a workflow manually or configure automatic triggers.',
      icon: '▶️'
    })])
  }),
  integrations: stryMutAct_9fa48("5604") ? {} : (stryCov_9fa48("5604"), {
    pageId: 'integrations',
    title: 'Integrations Guide',
    description: 'Connect your data sources to power AI-driven insights.',
    steps: stryMutAct_9fa48("5608") ? [] : (stryCov_9fa48("5608"), [stryMutAct_9fa48("5609") ? {} : (stryCov_9fa48("5609"), {
      title: 'View Data Sources',
      description: 'See all connected integrations and their current status.',
      icon: '🔌'
    }), stryMutAct_9fa48("5613") ? {} : (stryCov_9fa48("5613"), {
      title: 'Check Health',
      description: 'Monitor connection health - green means healthy, yellow needs attention.',
      icon: '💚'
    }), stryMutAct_9fa48("5617") ? {} : (stryCov_9fa48("5617"), {
      title: 'Add Integration',
      description: 'Click "Add Integration" to connect a new data source.',
      icon: '➕'
    }), stryMutAct_9fa48("5621") ? {} : (stryCov_9fa48("5621"), {
      title: 'Sync Data',
      description: 'Trigger manual syncs or configure automatic sync schedules.',
      icon: '🔄'
    })])
  }),
  alerts: stryMutAct_9fa48("5625") ? {} : (stryCov_9fa48("5625"), {
    pageId: 'alerts',
    title: 'Alerts Guide',
    description: 'Stay informed about important events and anomalies in your data.',
    steps: stryMutAct_9fa48("5629") ? [] : (stryCov_9fa48("5629"), [stryMutAct_9fa48("5630") ? {} : (stryCov_9fa48("5630"), {
      title: 'View Alerts',
      description: 'See all active alerts sorted by severity: critical, warning, and info.',
      icon: '🚨'
    }), stryMutAct_9fa48("5634") ? {} : (stryCov_9fa48("5634"), {
      title: 'Filter Alerts',
      description: 'Use filters to focus on specific severities or categories.',
      icon: '🔍'
    }), stryMutAct_9fa48("5638") ? {} : (stryCov_9fa48("5638"), {
      title: 'Acknowledge Alerts',
      description: 'Mark alerts as acknowledged once you\'ve reviewed them.',
      icon: '✓'
    }), stryMutAct_9fa48("5642") ? {} : (stryCov_9fa48("5642"), {
      title: 'Take Action',
      description: 'Click an alert to see details and recommended actions.',
      icon: '⚡'
    })])
  })
});
export default PageGuide;