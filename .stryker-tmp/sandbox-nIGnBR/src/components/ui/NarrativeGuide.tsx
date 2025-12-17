// @ts-nocheck
// =============================================================================
// DATACENDIA - NARRATIVE GUIDE COMPONENT
// Enterprise Platinum: Interactive storyboard/user journey guides
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
import { useTranslation } from '../../lib/i18n';
import { Play, Pause, SkipForward, SkipBack, X, CheckCircle2, Circle, Clock, User, ArrowRight, ChevronDown, ChevronUp, Compass, Map, Route } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface NarrativeStep {
  title: string;
  description: string;
  action?: string;
  pillar?: string;
  space?: string;
  sovereign?: string;
  keyActions?: string[];
}
interface Narrative {
  title: string;
  subtitle: string;
  persona?: string;
  duration?: string;
  steps: NarrativeStep[];
}
type NarrativeId = 'welcome' | 'executive' | 'dataEngineer' | 'complianceOfficer' | 'strategist' | 'quickStart';
interface NarrativeGuideProps {
  narrativeId: NarrativeId;
  variant?: 'modal' | 'sidebar' | 'inline' | 'floating';
  onComplete?: () => void;
  onStepChange?: (step: number) => void;
  autoPlay?: boolean;
  autoPlayDelay?: number;
  className?: string;
}

// =============================================================================
// NARRATIVE SELECTOR
// =============================================================================

interface NarrativeSelectorProps {
  onSelect: (narrativeId: NarrativeId) => void;
  className?: string;
}
export const NarrativeSelector: React.FC<NarrativeSelectorProps> = ({
  onSelect,
  className = ''
}) => {
  const {
    t
  } = useTranslation();
  const narratives: {
    id: NarrativeId;
    icon: React.ReactNode;
    color: string;
  }[] = stryMutAct_9fa48("6208") ? [] : (stryCov_9fa48("6208"), [stryMutAct_9fa48("6209") ? {} : (stryCov_9fa48("6209"), {
    id: 'quickStart',
    icon: <Play className="w-5 h-5" />,
    color: 'bg-green-500'
  }), stryMutAct_9fa48("6212") ? {} : (stryCov_9fa48("6212"), {
    id: 'welcome',
    icon: <Compass className="w-5 h-5" />,
    color: 'bg-primary-500'
  }), stryMutAct_9fa48("6215") ? {} : (stryCov_9fa48("6215"), {
    id: 'executive',
    icon: <User className="w-5 h-5" />,
    color: 'bg-purple-500'
  }), stryMutAct_9fa48("6218") ? {} : (stryCov_9fa48("6218"), {
    id: 'dataEngineer',
    icon: <Route className="w-5 h-5" />,
    color: 'bg-blue-500'
  }), stryMutAct_9fa48("6221") ? {} : (stryCov_9fa48("6221"), {
    id: 'complianceOfficer',
    icon: <CheckCircle2 className="w-5 h-5" />,
    color: 'bg-amber-500'
  }), stryMutAct_9fa48("6224") ? {} : (stryCov_9fa48("6224"), {
    id: 'strategist',
    icon: <Map className="w-5 h-5" />,
    color: 'bg-rose-500'
  })]);
  return <div className={`space-y-3 ${className}`}>
      <h3 className="text-sm font-semibold text-neutral-900">
        {t('common.select')} a Journey
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {narratives.map(({
        id,
        icon,
        color
      }) => {
        const title = t(`narratives.${id}.title`);
        const subtitle = t(`narratives.${id}.subtitle`);
        const duration = t(`narratives.${id}.duration`);
        const persona = t(`narratives.${id}.persona`);
        return <button key={id} onClick={stryMutAct_9fa48("6234") ? () => undefined : (stryCov_9fa48("6234"), () => onSelect(id))} className="flex items-start gap-3 p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-300 hover:shadow-md transition-all text-left group">
              <div className={`${color} text-white p-2 rounded-lg group-hover:scale-110 transition-transform`}>
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-neutral-900 truncate">
                  {title}
                </h4>
                <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5">
                  {subtitle}
                </p>
                <div className="flex items-center gap-3 mt-2 text-xs text-neutral-400">
                  {stryMutAct_9fa48("6238") ? duration && !duration.includes('.duration') || <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {duration}
                    </span> : stryMutAct_9fa48("6237") ? false : stryMutAct_9fa48("6236") ? true : (stryCov_9fa48("6236", "6237", "6238"), (stryMutAct_9fa48("6240") ? duration || !duration.includes('.duration') : stryMutAct_9fa48("6239") ? true : (stryCov_9fa48("6239", "6240"), duration && (stryMutAct_9fa48("6241") ? duration.includes('.duration') : (stryCov_9fa48("6241"), !duration.includes('.duration'))))) && <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {duration}
                    </span>)}
                  {stryMutAct_9fa48("6245") ? persona && !persona.includes('.persona') || <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {persona}
                    </span> : stryMutAct_9fa48("6244") ? false : stryMutAct_9fa48("6243") ? true : (stryCov_9fa48("6243", "6244", "6245"), (stryMutAct_9fa48("6247") ? persona || !persona.includes('.persona') : stryMutAct_9fa48("6246") ? true : (stryCov_9fa48("6246", "6247"), persona && (stryMutAct_9fa48("6248") ? persona.includes('.persona') : (stryCov_9fa48("6248"), !persona.includes('.persona'))))) && <span className="flex items-center gap-1">
                      <User className="w-3 h-3" /> {persona}
                    </span>)}
                </div>
              </div>
            </button>;
      })}
      </div>
    </div>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const NarrativeGuide: React.FC<NarrativeGuideProps> = ({
  narrativeId,
  variant = 'sidebar',
  onComplete,
  onStepChange,
  autoPlay = stryMutAct_9fa48("6251") ? true : (stryCov_9fa48("6251"), false),
  autoPlayDelay = 5000,
  className = ''
}) => {
  const {
    t
  } = useTranslation();
  const [currentStep, setCurrentStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [isExpanded, setIsExpanded] = useState(stryMutAct_9fa48("6254") ? false : (stryCov_9fa48("6254"), true));
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  // Parse narrative from translations
  const narrativeKey = `narratives.${narrativeId}`;
  const narrative: Narrative = stryMutAct_9fa48("6256") ? {} : (stryCov_9fa48("6256"), {
    title: t(`${narrativeKey}.title`),
    subtitle: t(`${narrativeKey}.subtitle`),
    persona: t(`${narrativeKey}.persona`),
    duration: t(`${narrativeKey}.duration`),
    steps: stryMutAct_9fa48("6261") ? ["Stryker was here"] : (stryCov_9fa48("6261"), [])
  });

  // Parse steps
  for (let i = 0; stryMutAct_9fa48("6264") ? i >= 20 : stryMutAct_9fa48("6263") ? i <= 20 : stryMutAct_9fa48("6262") ? false : (stryCov_9fa48("6262", "6263", "6264"), i < 20); stryMutAct_9fa48("6265") ? i-- : (stryCov_9fa48("6265"), i++)) {
    const stepTitle = t(`${narrativeKey}.steps.${i}.title`);
    if (stryMutAct_9fa48("6270") ? stepTitle || !stepTitle.includes('.steps.') : stryMutAct_9fa48("6269") ? false : stryMutAct_9fa48("6268") ? true : (stryCov_9fa48("6268", "6269", "6270"), stepTitle && (stryMutAct_9fa48("6271") ? stepTitle.includes('.steps.') : (stryCov_9fa48("6271"), !stepTitle.includes('.steps.'))))) {
      const step: NarrativeStep = stryMutAct_9fa48("6274") ? {} : (stryCov_9fa48("6274"), {
        title: stepTitle,
        description: t(`${narrativeKey}.steps.${i}.description`),
        action: t(`${narrativeKey}.steps.${i}.action`),
        pillar: t(`${narrativeKey}.steps.${i}.pillar`),
        space: t(`${narrativeKey}.steps.${i}.space`),
        sovereign: t(`${narrativeKey}.steps.${i}.sovereign`),
        keyActions: stryMutAct_9fa48("6280") ? ["Stryker was here"] : (stryCov_9fa48("6280"), [])
      });

      // Parse key actions
      for (let j = 0; stryMutAct_9fa48("6283") ? j >= 10 : stryMutAct_9fa48("6282") ? j <= 10 : stryMutAct_9fa48("6281") ? false : (stryCov_9fa48("6281", "6282", "6283"), j < 10); stryMutAct_9fa48("6284") ? j-- : (stryCov_9fa48("6284"), j++)) {
        const keyAction = t(`${narrativeKey}.steps.${i}.keyActions.${j}`);
        if (stryMutAct_9fa48("6289") ? keyAction || !keyAction.includes('.keyActions.') : stryMutAct_9fa48("6288") ? false : stryMutAct_9fa48("6287") ? true : (stryCov_9fa48("6287", "6288", "6289"), keyAction && (stryMutAct_9fa48("6290") ? keyAction.includes('.keyActions.') : (stryCov_9fa48("6290"), !keyAction.includes('.keyActions.'))))) {
          stryMutAct_9fa48("6293") ? step.keyActions.push(keyAction) : (stryCov_9fa48("6293"), step.keyActions?.push(keyAction));
        }
      }
      narrative.steps.push(step);
    }
  }

  // Auto-play functionality
  useEffect(() => {
    if (stryMutAct_9fa48("6297") ? isPlaying || currentStep < narrative.steps.length - 1 : stryMutAct_9fa48("6296") ? false : stryMutAct_9fa48("6295") ? true : (stryCov_9fa48("6295", "6296", "6297"), isPlaying && (stryMutAct_9fa48("6300") ? currentStep >= narrative.steps.length - 1 : stryMutAct_9fa48("6299") ? currentStep <= narrative.steps.length - 1 : stryMutAct_9fa48("6298") ? true : (stryCov_9fa48("6298", "6299", "6300"), currentStep < (stryMutAct_9fa48("6301") ? narrative.steps.length + 1 : (stryCov_9fa48("6301"), narrative.steps.length - 1)))))) {
      const timer = setTimeout(() => {
        goToNext();
      }, autoPlayDelay);
      return stryMutAct_9fa48("6304") ? () => undefined : (stryCov_9fa48("6304"), () => clearTimeout(timer));
    } else if (stryMutAct_9fa48("6307") ? isPlaying || currentStep === narrative.steps.length - 1 : stryMutAct_9fa48("6306") ? false : stryMutAct_9fa48("6305") ? true : (stryCov_9fa48("6305", "6306", "6307"), isPlaying && (stryMutAct_9fa48("6309") ? currentStep !== narrative.steps.length - 1 : stryMutAct_9fa48("6308") ? true : (stryCov_9fa48("6308", "6309"), currentStep === (stryMutAct_9fa48("6310") ? narrative.steps.length + 1 : (stryCov_9fa48("6310"), narrative.steps.length - 1)))))) {
      setIsPlaying(stryMutAct_9fa48("6312") ? true : (stryCov_9fa48("6312"), false));
    }
  }, stryMutAct_9fa48("6313") ? [] : (stryCov_9fa48("6313"), [isPlaying, currentStep, narrative.steps.length, autoPlayDelay]));

  // Notify parent of step changes
  useEffect(() => {
    stryMutAct_9fa48("6315") ? onStepChange(currentStep) : (stryCov_9fa48("6315"), onStepChange?.(currentStep));
  }, stryMutAct_9fa48("6316") ? [] : (stryCov_9fa48("6316"), [currentStep, onStepChange]));
  const goToNext = () => {
    if (stryMutAct_9fa48("6321") ? currentStep >= narrative.steps.length - 1 : stryMutAct_9fa48("6320") ? currentStep <= narrative.steps.length - 1 : stryMutAct_9fa48("6319") ? false : stryMutAct_9fa48("6318") ? true : (stryCov_9fa48("6318", "6319", "6320", "6321"), currentStep < (stryMutAct_9fa48("6322") ? narrative.steps.length + 1 : (stryCov_9fa48("6322"), narrative.steps.length - 1)))) {
      setCompletedSteps(stryMutAct_9fa48("6324") ? () => undefined : (stryCov_9fa48("6324"), prev => new Set(stryMutAct_9fa48("6325") ? [] : (stryCov_9fa48("6325"), [...prev, currentStep]))));
      setCurrentStep(stryMutAct_9fa48("6326") ? currentStep - 1 : (stryCov_9fa48("6326"), currentStep + 1));
    } else {
      setCompletedSteps(stryMutAct_9fa48("6328") ? () => undefined : (stryCov_9fa48("6328"), prev => new Set(stryMutAct_9fa48("6329") ? [] : (stryCov_9fa48("6329"), [...prev, currentStep]))));
      stryMutAct_9fa48("6330") ? onComplete() : (stryCov_9fa48("6330"), onComplete?.());
    }
  };
  const goToPrev = () => {
    if (stryMutAct_9fa48("6335") ? currentStep <= 0 : stryMutAct_9fa48("6334") ? currentStep >= 0 : stryMutAct_9fa48("6333") ? false : stryMutAct_9fa48("6332") ? true : (stryCov_9fa48("6332", "6333", "6334", "6335"), currentStep > 0)) {
      setCurrentStep(stryMutAct_9fa48("6337") ? currentStep + 1 : (stryCov_9fa48("6337"), currentStep - 1));
    }
  };
  const goToStep = (step: number) => {
    setCurrentStep(step);
  };
  const togglePlay = () => {
    setIsPlaying(stryMutAct_9fa48("6340") ? isPlaying : (stryCov_9fa48("6340"), !isPlaying));
  };
  const currentStepData = narrative.steps[currentStep];
  const progress = stryMutAct_9fa48("6341") ? (currentStep + 1) / narrative.steps.length / 100 : (stryCov_9fa48("6341"), (stryMutAct_9fa48("6342") ? (currentStep + 1) * narrative.steps.length : (stryCov_9fa48("6342"), (stryMutAct_9fa48("6343") ? currentStep - 1 : (stryCov_9fa48("6343"), currentStep + 1)) / narrative.steps.length)) * 100);

  // Floating variant
  if (stryMutAct_9fa48("6346") ? variant !== 'floating' : stryMutAct_9fa48("6345") ? false : stryMutAct_9fa48("6344") ? true : (stryCov_9fa48("6344", "6345", "6346"), variant === 'floating')) {
    return <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
        <div className="bg-white rounded-2xl shadow-2xl border border-neutral-200 overflow-hidden w-80">
          {/* Header */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3 cursor-pointer" onClick={stryMutAct_9fa48("6350") ? () => undefined : (stryCov_9fa48("6350"), () => setIsExpanded(stryMutAct_9fa48("6351") ? isExpanded : (stryCov_9fa48("6351"), !isExpanded)))}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Compass className="w-5 h-5 text-white" />
                <span className="text-white font-semibold text-sm">{narrative.title}</span>
              </div>
              {isExpanded ? <ChevronDown className="w-4 h-4 text-white" /> : <ChevronUp className="w-4 h-4 text-white" />}
            </div>
            {/* Progress bar */}
            <div className="mt-2 h-1 bg-white/30 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-300" style={stryMutAct_9fa48("6352") ? {} : (stryCov_9fa48("6352"), {
              width: `${progress}%`
            })} />
            </div>
          </div>

          {stryMutAct_9fa48("6356") ? isExpanded && currentStepData || <>
              {/* Step content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    Step {currentStep + 1} of {narrative.steps.length}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                  {currentStepData.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Key actions */}
                {currentStepData.keyActions && currentStepData.keyActions.length > 0 && <div className="mt-3 space-y-1">
                    {currentStepData.keyActions.map((action, idx) => <div key={idx} className="flex items-center gap-2 text-xs text-neutral-500">
                        <ArrowRight className="w-3 h-3" />
                        <span>{action}</span>
                      </div>)}
                  </div>}

                {/* Action button */}
                {currentStepData.action && !currentStepData.action.includes('.action') && <button className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                    {currentStepData.action}
                  </button>}
              </div>

              {/* Controls */}
              <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                <button onClick={goToPrev} disabled={currentStep === 0} className="p-2 text-neutral-400 hover:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={togglePlay} className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={goToNext} className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </> : stryMutAct_9fa48("6355") ? false : stryMutAct_9fa48("6354") ? true : (stryCov_9fa48("6354", "6355", "6356"), (stryMutAct_9fa48("6358") ? isExpanded || currentStepData : stryMutAct_9fa48("6357") ? true : (stryCov_9fa48("6357", "6358"), isExpanded && currentStepData)) && <>
              {/* Step content */}
              <div className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-medium text-primary-600 bg-primary-50 px-2 py-0.5 rounded">
                    Step {stryMutAct_9fa48("6359") ? currentStep - 1 : (stryCov_9fa48("6359"), currentStep + 1)} of {narrative.steps.length}
                  </span>
                </div>
                <h4 className="text-sm font-semibold text-neutral-900 mb-2">
                  {currentStepData.title}
                </h4>
                <p className="text-xs text-neutral-600 leading-relaxed">
                  {currentStepData.description}
                </p>

                {/* Key actions */}
                {stryMutAct_9fa48("6362") ? currentStepData.keyActions && currentStepData.keyActions.length > 0 || <div className="mt-3 space-y-1">
                    {currentStepData.keyActions.map((action, idx) => <div key={idx} className="flex items-center gap-2 text-xs text-neutral-500">
                        <ArrowRight className="w-3 h-3" />
                        <span>{action}</span>
                      </div>)}
                  </div> : stryMutAct_9fa48("6361") ? false : stryMutAct_9fa48("6360") ? true : (stryCov_9fa48("6360", "6361", "6362"), (stryMutAct_9fa48("6364") ? currentStepData.keyActions || currentStepData.keyActions.length > 0 : stryMutAct_9fa48("6363") ? true : (stryCov_9fa48("6363", "6364"), currentStepData.keyActions && (stryMutAct_9fa48("6367") ? currentStepData.keyActions.length <= 0 : stryMutAct_9fa48("6366") ? currentStepData.keyActions.length >= 0 : stryMutAct_9fa48("6365") ? true : (stryCov_9fa48("6365", "6366", "6367"), currentStepData.keyActions.length > 0)))) && <div className="mt-3 space-y-1">
                    {currentStepData.keyActions.map(stryMutAct_9fa48("6368") ? () => undefined : (stryCov_9fa48("6368"), (action, idx) => <div key={idx} className="flex items-center gap-2 text-xs text-neutral-500">
                        <ArrowRight className="w-3 h-3" />
                        <span>{action}</span>
                      </div>))}
                  </div>)}

                {/* Action button */}
                {stryMutAct_9fa48("6371") ? currentStepData.action && !currentStepData.action.includes('.action') || <button className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                    {currentStepData.action}
                  </button> : stryMutAct_9fa48("6370") ? false : stryMutAct_9fa48("6369") ? true : (stryCov_9fa48("6369", "6370", "6371"), (stryMutAct_9fa48("6373") ? currentStepData.action || !currentStepData.action.includes('.action') : stryMutAct_9fa48("6372") ? true : (stryCov_9fa48("6372", "6373"), currentStepData.action && (stryMutAct_9fa48("6374") ? currentStepData.action.includes('.action') : (stryCov_9fa48("6374"), !currentStepData.action.includes('.action'))))) && <button className="mt-4 w-full py-2 bg-primary-600 hover:bg-primary-700 text-white text-sm font-medium rounded-lg transition-colors">
                    {currentStepData.action}
                  </button>)}
              </div>

              {/* Controls */}
              <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
                <button onClick={goToPrev} disabled={stryMutAct_9fa48("6378") ? currentStep !== 0 : stryMutAct_9fa48("6377") ? false : stryMutAct_9fa48("6376") ? true : (stryCov_9fa48("6376", "6377", "6378"), currentStep === 0)} className="p-2 text-neutral-400 hover:text-neutral-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
                  <SkipBack className="w-4 h-4" />
                </button>
                <button onClick={togglePlay} className="p-2 bg-primary-100 text-primary-600 rounded-full hover:bg-primary-200 transition-colors">
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <button onClick={goToNext} className="p-2 text-neutral-400 hover:text-neutral-600 transition-colors">
                  <SkipForward className="w-4 h-4" />
                </button>
              </div>
            </>)}
        </div>
      </div>;
  }

  // Sidebar variant (default)
  if (stryMutAct_9fa48("6381") ? variant !== 'sidebar' : stryMutAct_9fa48("6380") ? false : stryMutAct_9fa48("6379") ? true : (stryCov_9fa48("6379", "6380", "6381"), variant === 'sidebar')) {
    return <div className={`bg-white rounded-xl border border-neutral-200 overflow-hidden ${className}`}>
        {/* Header */}
        <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-4">
          <h3 className="text-white font-semibold">{narrative.title}</h3>
          <p className="text-primary-100 text-sm mt-1">{narrative.subtitle}</p>
          {stryMutAct_9fa48("6387") ? narrative.duration && !narrative.duration.includes('.duration') || <div className="flex items-center gap-1 mt-2 text-primary-200 text-xs">
              <Clock className="w-3 h-3" />
              <span>{narrative.duration}</span>
            </div> : stryMutAct_9fa48("6386") ? false : stryMutAct_9fa48("6385") ? true : (stryCov_9fa48("6385", "6386", "6387"), (stryMutAct_9fa48("6389") ? narrative.duration || !narrative.duration.includes('.duration') : stryMutAct_9fa48("6388") ? true : (stryCov_9fa48("6388", "6389"), narrative.duration && (stryMutAct_9fa48("6390") ? narrative.duration.includes('.duration') : (stryCov_9fa48("6390"), !narrative.duration.includes('.duration'))))) && <div className="flex items-center gap-1 mt-2 text-primary-200 text-xs">
              <Clock className="w-3 h-3" />
              <span>{narrative.duration}</span>
            </div>)}
          {/* Progress bar */}
          <div className="mt-3 h-1.5 bg-white/30 rounded-full overflow-hidden">
            <div className="h-full bg-white rounded-full transition-all duration-300" style={stryMutAct_9fa48("6392") ? {} : (stryCov_9fa48("6392"), {
            width: `${progress}%`
          })} />
          </div>
        </div>

        {/* Steps */}
        <div className="p-4 space-y-3">
          {narrative.steps.map((step, index) => {
          const isActive = stryMutAct_9fa48("6397") ? index !== currentStep : stryMutAct_9fa48("6396") ? false : stryMutAct_9fa48("6395") ? true : (stryCov_9fa48("6395", "6396", "6397"), index === currentStep);
          const isCompleted = completedSteps.has(index);
          return <button key={index} onClick={stryMutAct_9fa48("6398") ? () => undefined : (stryCov_9fa48("6398"), () => goToStep(index))} className={`w-full flex items-start gap-3 p-3 rounded-lg transition-all text-left ${isActive ? 'bg-primary-50 border border-primary-200' : isCompleted ? 'bg-green-50 border border-green-200' : 'hover:bg-neutral-50 border border-transparent'}`}>
                <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center ${isCompleted ? 'bg-green-500 text-white' : isActive ? 'bg-primary-500 text-white' : 'bg-neutral-200 text-neutral-500'}`}>
                  {isCompleted ? <CheckCircle2 className="w-4 h-4" /> : <span className="text-xs font-medium">{stryMutAct_9fa48("6407") ? index - 1 : (stryCov_9fa48("6407"), index + 1)}</span>}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-medium ${isActive ? 'text-primary-700' : isCompleted ? 'text-green-700' : 'text-neutral-700'}`}>
                    {step.title}
                  </h4>
                  {stryMutAct_9fa48("6414") ? isActive || <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {step.description}
                    </p> : stryMutAct_9fa48("6413") ? false : stryMutAct_9fa48("6412") ? true : (stryCov_9fa48("6412", "6413", "6414"), isActive && <p className="text-xs text-neutral-500 mt-1 line-clamp-2">
                      {step.description}
                    </p>)}
                </div>
              </button>;
        })}
        </div>

        {/* Controls */}
        <div className="px-4 py-3 bg-neutral-50 border-t border-neutral-200 flex items-center justify-between">
          <button onClick={goToPrev} disabled={stryMutAct_9fa48("6417") ? currentStep !== 0 : stryMutAct_9fa48("6416") ? false : stryMutAct_9fa48("6415") ? true : (stryCov_9fa48("6415", "6416", "6417"), currentStep === 0)} className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            <SkipBack className="w-4 h-4" />
            Previous
          </button>
          <button onClick={goToNext} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors">
            {(stryMutAct_9fa48("6420") ? currentStep !== narrative.steps.length - 1 : stryMutAct_9fa48("6419") ? false : stryMutAct_9fa48("6418") ? true : (stryCov_9fa48("6418", "6419", "6420"), currentStep === (stryMutAct_9fa48("6421") ? narrative.steps.length + 1 : (stryCov_9fa48("6421"), narrative.steps.length - 1)))) ? 'Complete' : 'Next'}
            <SkipForward className="w-4 h-4" />
          </button>
        </div>
      </div>;
  }

  // Inline variant
  return <div className={`bg-white rounded-xl border border-neutral-200 p-6 ${className}`}>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-neutral-900">{narrative.title}</h3>
          <p className="text-sm text-neutral-500">{narrative.subtitle}</p>
        </div>
        <div className="text-right">
          <span className="text-sm font-medium text-primary-600">
            Step {stryMutAct_9fa48("6425") ? currentStep - 1 : (stryCov_9fa48("6425"), currentStep + 1)} / {narrative.steps.length}
          </span>
          {/* Progress bar */}
          <div className="mt-1 w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-300" style={stryMutAct_9fa48("6426") ? {} : (stryCov_9fa48("6426"), {
            width: `${progress}%`
          })} />
          </div>
        </div>
      </div>

      {stryMutAct_9fa48("6430") ? currentStepData || <div className="bg-neutral-50 rounded-lg p-4 mb-4">
          <h4 className="text-base font-semibold text-neutral-900 mb-2">
            {currentStepData.title}
          </h4>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Key actions */}
          {currentStepData.keyActions && currentStepData.keyActions.length > 0 && <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentStepData.keyActions.map((action, idx) => <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600 bg-white px-3 py-2 rounded-lg">
                  <Circle className="w-3 h-3 text-primary-500" />
                  <span>{action}</span>
                </div>)}
            </div>}
        </div> : stryMutAct_9fa48("6429") ? false : stryMutAct_9fa48("6428") ? true : (stryCov_9fa48("6428", "6429", "6430"), currentStepData && <div className="bg-neutral-50 rounded-lg p-4 mb-4">
          <h4 className="text-base font-semibold text-neutral-900 mb-2">
            {currentStepData.title}
          </h4>
          <p className="text-sm text-neutral-600 leading-relaxed">
            {currentStepData.description}
          </p>

          {/* Key actions */}
          {stryMutAct_9fa48("6433") ? currentStepData.keyActions && currentStepData.keyActions.length > 0 || <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentStepData.keyActions.map((action, idx) => <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600 bg-white px-3 py-2 rounded-lg">
                  <Circle className="w-3 h-3 text-primary-500" />
                  <span>{action}</span>
                </div>)}
            </div> : stryMutAct_9fa48("6432") ? false : stryMutAct_9fa48("6431") ? true : (stryCov_9fa48("6431", "6432", "6433"), (stryMutAct_9fa48("6435") ? currentStepData.keyActions || currentStepData.keyActions.length > 0 : stryMutAct_9fa48("6434") ? true : (stryCov_9fa48("6434", "6435"), currentStepData.keyActions && (stryMutAct_9fa48("6438") ? currentStepData.keyActions.length <= 0 : stryMutAct_9fa48("6437") ? currentStepData.keyActions.length >= 0 : stryMutAct_9fa48("6436") ? true : (stryCov_9fa48("6436", "6437", "6438"), currentStepData.keyActions.length > 0)))) && <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-2">
              {currentStepData.keyActions.map(stryMutAct_9fa48("6439") ? () => undefined : (stryCov_9fa48("6439"), (action, idx) => <div key={idx} className="flex items-center gap-2 text-sm text-neutral-600 bg-white px-3 py-2 rounded-lg">
                  <Circle className="w-3 h-3 text-primary-500" />
                  <span>{action}</span>
                </div>))}
            </div>)}
        </div>)}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button onClick={goToPrev} disabled={stryMutAct_9fa48("6442") ? currentStep !== 0 : stryMutAct_9fa48("6441") ? false : stryMutAct_9fa48("6440") ? true : (stryCov_9fa48("6440", "6441", "6442"), currentStep === 0)} className="px-4 py-2 text-sm text-neutral-600 hover:text-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
          Previous Step
        </button>
        <div className="flex items-center gap-2">
          {narrative.steps.map(stryMutAct_9fa48("6443") ? () => undefined : (stryCov_9fa48("6443"), (_, index) => <button key={index} onClick={stryMutAct_9fa48("6444") ? () => undefined : (stryCov_9fa48("6444"), () => goToStep(index))} className={`w-2 h-2 rounded-full transition-all ${(stryMutAct_9fa48("6448") ? index !== currentStep : stryMutAct_9fa48("6447") ? false : stryMutAct_9fa48("6446") ? true : (stryCov_9fa48("6446", "6447", "6448"), index === currentStep)) ? 'w-6 bg-primary-500' : completedSteps.has(index) ? 'bg-green-500' : 'bg-neutral-300 hover:bg-neutral-400'}`} />))}
        </div>
        <button onClick={goToNext} className="px-4 py-2 text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 rounded-lg transition-colors">
          {(stryMutAct_9fa48("6454") ? currentStep !== narrative.steps.length - 1 : stryMutAct_9fa48("6453") ? false : stryMutAct_9fa48("6452") ? true : (stryCov_9fa48("6452", "6453", "6454"), currentStep === (stryMutAct_9fa48("6455") ? narrative.steps.length + 1 : (stryCov_9fa48("6455"), narrative.steps.length - 1)))) ? 'Complete Journey' : 'Next Step'}
        </button>
      </div>
    </div>;
};
export default NarrativeGuide;