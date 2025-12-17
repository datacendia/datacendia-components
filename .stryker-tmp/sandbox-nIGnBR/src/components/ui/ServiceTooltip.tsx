// @ts-nocheck
// =============================================================================
// DATACENDIA - SERVICE TOOLTIP COMPONENT
// Enterprise Platinum: Rich, informative tooltips for all services
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
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from '../../lib/i18n';
import { Info, Lightbulb, Target, CheckCircle2, ChevronRight, X } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

type ServiceCategory = 'pillars' | 'spaces' | 'sovereign';
interface TooltipData {
  title: string;
  summary: string;
  features: string[];
  useCases?: string[];
  guidance: string;
}
interface ServiceTooltipProps {
  service: string;
  category: ServiceCategory;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  variant?: 'hover' | 'click' | 'persistent';
  showIcon?: boolean;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export const ServiceTooltip: React.FC<ServiceTooltipProps> = ({
  service,
  category,
  children,
  position = 'top',
  variant = 'hover',
  showIcon = stryMutAct_9fa48("6462") ? false : (stryCov_9fa48("6462"), true),
  className = ''
}) => {
  const {
    t
  } = useTranslation();
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("6465") ? true : (stryCov_9fa48("6465"), false));
  const [activeTab, setActiveTab] = useState<'overview' | 'features' | 'useCases'>('overview');
  const tooltipRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);

  // Get tooltip data from translations
  const tooltipKey = `tooltips.${category}.${service}`;
  const tooltipData: TooltipData = stryMutAct_9fa48("6468") ? {} : (stryCov_9fa48("6468"), {
    title: t(`${tooltipKey}.title`),
    summary: t(`${tooltipKey}.summary`),
    features: stryMutAct_9fa48("6471") ? ["Stryker was here"] : (stryCov_9fa48("6471"), []),
    useCases: stryMutAct_9fa48("6472") ? ["Stryker was here"] : (stryCov_9fa48("6472"), []),
    guidance: t(`${tooltipKey}.guidance`)
  });

  // Parse features array
  for (let i = 0; stryMutAct_9fa48("6476") ? i >= 10 : stryMutAct_9fa48("6475") ? i <= 10 : stryMutAct_9fa48("6474") ? false : (stryCov_9fa48("6474", "6475", "6476"), i < 10); stryMutAct_9fa48("6477") ? i-- : (stryCov_9fa48("6477"), i++)) {
    const feature = t(`${tooltipKey}.features.${i}`);
    if (stryMutAct_9fa48("6482") ? feature || !feature.includes('.features.') : stryMutAct_9fa48("6481") ? false : stryMutAct_9fa48("6480") ? true : (stryCov_9fa48("6480", "6481", "6482"), feature && (stryMutAct_9fa48("6483") ? feature.includes('.features.') : (stryCov_9fa48("6483"), !feature.includes('.features.'))))) {
      tooltipData.features.push(feature);
    }
  }

  // Parse use cases array
  for (let i = 0; stryMutAct_9fa48("6488") ? i >= 10 : stryMutAct_9fa48("6487") ? i <= 10 : stryMutAct_9fa48("6486") ? false : (stryCov_9fa48("6486", "6487", "6488"), i < 10); stryMutAct_9fa48("6489") ? i-- : (stryCov_9fa48("6489"), i++)) {
    const useCase = t(`${tooltipKey}.useCases.${i}`);
    if (stryMutAct_9fa48("6494") ? useCase || !useCase.includes('.useCases.') : stryMutAct_9fa48("6493") ? false : stryMutAct_9fa48("6492") ? true : (stryCov_9fa48("6492", "6493", "6494"), useCase && (stryMutAct_9fa48("6495") ? useCase.includes('.useCases.') : (stryCov_9fa48("6495"), !useCase.includes('.useCases.'))))) {
      stryMutAct_9fa48("6498") ? tooltipData.useCases.push(useCase) : (stryCov_9fa48("6498"), tooltipData.useCases?.push(useCase));
    }
  }

  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stryMutAct_9fa48("6503") ? tooltipRef.current && !tooltipRef.current.contains(event.target as Node) && triggerRef.current || !triggerRef.current.contains(event.target as Node) : stryMutAct_9fa48("6502") ? false : stryMutAct_9fa48("6501") ? true : (stryCov_9fa48("6501", "6502", "6503"), (stryMutAct_9fa48("6505") ? tooltipRef.current && !tooltipRef.current.contains(event.target as Node) || triggerRef.current : stryMutAct_9fa48("6504") ? true : (stryCov_9fa48("6504", "6505"), (stryMutAct_9fa48("6507") ? tooltipRef.current || !tooltipRef.current.contains(event.target as Node) : stryMutAct_9fa48("6506") ? true : (stryCov_9fa48("6506", "6507"), tooltipRef.current && (stryMutAct_9fa48("6508") ? tooltipRef.current.contains(event.target as Node) : (stryCov_9fa48("6508"), !tooltipRef.current.contains(event.target as Node))))) && triggerRef.current)) && (stryMutAct_9fa48("6509") ? triggerRef.current.contains(event.target as Node) : (stryCov_9fa48("6509"), !triggerRef.current.contains(event.target as Node))))) {
        setIsOpen(stryMutAct_9fa48("6511") ? true : (stryCov_9fa48("6511"), false));
      }
    };
    if (stryMutAct_9fa48("6514") ? isOpen || variant !== 'hover' : stryMutAct_9fa48("6513") ? false : stryMutAct_9fa48("6512") ? true : (stryCov_9fa48("6512", "6513", "6514"), isOpen && (stryMutAct_9fa48("6516") ? variant === 'hover' : stryMutAct_9fa48("6515") ? true : (stryCov_9fa48("6515", "6516"), variant !== 'hover')))) {
      document.addEventListener('mousedown', handleClickOutside);
      return stryMutAct_9fa48("6520") ? () => undefined : (stryCov_9fa48("6520"), () => document.removeEventListener('mousedown', handleClickOutside));
    }
  }, stryMutAct_9fa48("6522") ? [] : (stryCov_9fa48("6522"), [isOpen, variant]));

  // Position classes
  const positionClasses = stryMutAct_9fa48("6523") ? {} : (stryCov_9fa48("6523"), {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  });

  // Arrow classes
  const arrowClasses = stryMutAct_9fa48("6528") ? {} : (stryCov_9fa48("6528"), {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-white border-l-transparent border-r-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-white border-l-transparent border-r-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-white border-t-transparent border-b-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-white border-t-transparent border-b-transparent border-l-transparent'
  });
  const handleMouseEnter = () => {
    if (stryMutAct_9fa48("6536") ? variant !== 'hover' : stryMutAct_9fa48("6535") ? false : stryMutAct_9fa48("6534") ? true : (stryCov_9fa48("6534", "6535", "6536"), variant === 'hover')) {
      setIsOpen(stryMutAct_9fa48("6539") ? false : (stryCov_9fa48("6539"), true));
    }
  };
  const handleMouseLeave = () => {
    if (stryMutAct_9fa48("6543") ? variant !== 'hover' : stryMutAct_9fa48("6542") ? false : stryMutAct_9fa48("6541") ? true : (stryCov_9fa48("6541", "6542", "6543"), variant === 'hover')) {
      setIsOpen(stryMutAct_9fa48("6546") ? true : (stryCov_9fa48("6546"), false));
    }
  };
  const handleClick = () => {
    if (stryMutAct_9fa48("6550") ? variant !== 'click' : stryMutAct_9fa48("6549") ? false : stryMutAct_9fa48("6548") ? true : (stryCov_9fa48("6548", "6549", "6550"), variant === 'click')) {
      setIsOpen(stryMutAct_9fa48("6553") ? isOpen : (stryCov_9fa48("6553"), !isOpen));
    }
  };
  return <div className={`relative inline-flex items-center ${className}`}>
      <div ref={triggerRef} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} onClick={handleClick} className="cursor-pointer">
        {children}
        {stryMutAct_9fa48("6557") ? showIcon || <Info className="w-4 h-4 ml-1 text-neutral-400 hover:text-primary-500 transition-colors" /> : stryMutAct_9fa48("6556") ? false : stryMutAct_9fa48("6555") ? true : (stryCov_9fa48("6555", "6556", "6557"), showIcon && <Info className="w-4 h-4 ml-1 text-neutral-400 hover:text-primary-500 transition-colors" />)}
      </div>

      {stryMutAct_9fa48("6560") ? isOpen || variant === 'persistent' || <div ref={tooltipRef} className={`absolute z-50 ${positionClasses[position]}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`} />

          {/* Tooltip Content */}
          <div className="w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3">
              <div className="flex items-start justify-between">
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {tooltipData.title}
                </h3>
                {variant === 'click' && <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>}
              </div>
              <p className="text-primary-100 text-xs mt-1 leading-relaxed">
                {tooltipData.summary}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
              <button onClick={() => setActiveTab('overview')} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'overview' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                Overview
              </button>
              <button onClick={() => setActiveTab('features')} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'features' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                Features
              </button>
              {tooltipData.useCases && tooltipData.useCases.length > 0 && <button onClick={() => setActiveTab('useCases')} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'useCases' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                  Use Cases
                </button>}
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-64 overflow-y-auto">
              {activeTab === 'overview' && <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-700 mb-1">
                        Getting Started
                      </p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {tooltipData.guidance}
                      </p>
                    </div>
                  </div>
                </div>}

              {activeTab === 'features' && <ul className="space-y-2">
                  {tooltipData.features.map((feature, index) => <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{feature}</span>
                    </li>)}
                </ul>}

              {activeTab === 'useCases' && tooltipData.useCases && <ul className="space-y-2">
                  {tooltipData.useCases.map((useCase, index) => <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{useCase}</span>
                    </li>)}
                </ul>}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
              <button className="w-full flex items-center justify-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Learn More <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("6559") ? false : stryMutAct_9fa48("6558") ? true : (stryCov_9fa48("6558", "6559", "6560"), (stryMutAct_9fa48("6562") ? isOpen && variant === 'persistent' : stryMutAct_9fa48("6561") ? true : (stryCov_9fa48("6561", "6562"), isOpen || (stryMutAct_9fa48("6564") ? variant !== 'persistent' : stryMutAct_9fa48("6563") ? false : (stryCov_9fa48("6563", "6564"), variant === 'persistent')))) && <div ref={tooltipRef} className={`absolute z-50 ${positionClasses[position]}`} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
          {/* Arrow */}
          <div className={`absolute w-0 h-0 border-8 ${arrowClasses[position]}`} />

          {/* Tooltip Content */}
          <div className="w-80 bg-white rounded-xl shadow-2xl border border-neutral-200 overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-primary-600 to-primary-500 px-4 py-3">
              <div className="flex items-start justify-between">
                <h3 className="text-white font-semibold text-sm leading-tight">
                  {tooltipData.title}
                </h3>
                {stryMutAct_9fa48("6570") ? variant === 'click' || <button onClick={() => setIsOpen(false)} className="text-white/80 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button> : stryMutAct_9fa48("6569") ? false : stryMutAct_9fa48("6568") ? true : (stryCov_9fa48("6568", "6569", "6570"), (stryMutAct_9fa48("6572") ? variant !== 'click' : stryMutAct_9fa48("6571") ? true : (stryCov_9fa48("6571", "6572"), variant === 'click')) && <button onClick={stryMutAct_9fa48("6574") ? () => undefined : (stryCov_9fa48("6574"), () => setIsOpen(stryMutAct_9fa48("6575") ? true : (stryCov_9fa48("6575"), false)))} className="text-white/80 hover:text-white transition-colors">
                    <X className="w-4 h-4" />
                  </button>)}
              </div>
              <p className="text-primary-100 text-xs mt-1 leading-relaxed">
                {tooltipData.summary}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200">
              <button onClick={stryMutAct_9fa48("6576") ? () => undefined : (stryCov_9fa48("6576"), () => setActiveTab('overview'))} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${(stryMutAct_9fa48("6581") ? activeTab !== 'overview' : stryMutAct_9fa48("6580") ? false : stryMutAct_9fa48("6579") ? true : (stryCov_9fa48("6579", "6580", "6581"), activeTab === 'overview')) ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                Overview
              </button>
              <button onClick={stryMutAct_9fa48("6585") ? () => undefined : (stryCov_9fa48("6585"), () => setActiveTab('features'))} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${(stryMutAct_9fa48("6590") ? activeTab !== 'features' : stryMutAct_9fa48("6589") ? false : stryMutAct_9fa48("6588") ? true : (stryCov_9fa48("6588", "6589", "6590"), activeTab === 'features')) ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                Features
              </button>
              {stryMutAct_9fa48("6596") ? tooltipData.useCases && tooltipData.useCases.length > 0 || <button onClick={() => setActiveTab('useCases')} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${activeTab === 'useCases' ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                  Use Cases
                </button> : stryMutAct_9fa48("6595") ? false : stryMutAct_9fa48("6594") ? true : (stryCov_9fa48("6594", "6595", "6596"), (stryMutAct_9fa48("6598") ? tooltipData.useCases || tooltipData.useCases.length > 0 : stryMutAct_9fa48("6597") ? true : (stryCov_9fa48("6597", "6598"), tooltipData.useCases && (stryMutAct_9fa48("6601") ? tooltipData.useCases.length <= 0 : stryMutAct_9fa48("6600") ? tooltipData.useCases.length >= 0 : stryMutAct_9fa48("6599") ? true : (stryCov_9fa48("6599", "6600", "6601"), tooltipData.useCases.length > 0)))) && <button onClick={stryMutAct_9fa48("6602") ? () => undefined : (stryCov_9fa48("6602"), () => setActiveTab('useCases'))} className={`flex-1 px-3 py-2 text-xs font-medium transition-colors ${(stryMutAct_9fa48("6607") ? activeTab !== 'useCases' : stryMutAct_9fa48("6606") ? false : stryMutAct_9fa48("6605") ? true : (stryCov_9fa48("6605", "6606", "6607"), activeTab === 'useCases')) ? 'text-primary-600 border-b-2 border-primary-600' : 'text-neutral-500 hover:text-neutral-700'}`}>
                  Use Cases
                </button>)}
            </div>

            {/* Tab Content */}
            <div className="p-4 max-h-64 overflow-y-auto">
              {stryMutAct_9fa48("6613") ? activeTab === 'overview' || <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-700 mb-1">
                        Getting Started
                      </p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {tooltipData.guidance}
                      </p>
                    </div>
                  </div>
                </div> : stryMutAct_9fa48("6612") ? false : stryMutAct_9fa48("6611") ? true : (stryCov_9fa48("6611", "6612", "6613"), (stryMutAct_9fa48("6615") ? activeTab !== 'overview' : stryMutAct_9fa48("6614") ? true : (stryCov_9fa48("6614", "6615"), activeTab === 'overview')) && <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Lightbulb className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <div>
                      <p className="text-xs font-medium text-neutral-700 mb-1">
                        Getting Started
                      </p>
                      <p className="text-xs text-neutral-600 leading-relaxed">
                        {tooltipData.guidance}
                      </p>
                    </div>
                  </div>
                </div>)}

              {stryMutAct_9fa48("6619") ? activeTab === 'features' || <ul className="space-y-2">
                  {tooltipData.features.map((feature, index) => <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{feature}</span>
                    </li>)}
                </ul> : stryMutAct_9fa48("6618") ? false : stryMutAct_9fa48("6617") ? true : (stryCov_9fa48("6617", "6618", "6619"), (stryMutAct_9fa48("6621") ? activeTab !== 'features' : stryMutAct_9fa48("6620") ? true : (stryCov_9fa48("6620", "6621"), activeTab === 'features')) && <ul className="space-y-2">
                  {tooltipData.features.map(stryMutAct_9fa48("6623") ? () => undefined : (stryCov_9fa48("6623"), (feature, index) => <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{feature}</span>
                    </li>))}
                </ul>)}

              {stryMutAct_9fa48("6626") ? activeTab === 'useCases' && tooltipData.useCases || <ul className="space-y-2">
                  {tooltipData.useCases.map((useCase, index) => <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{useCase}</span>
                    </li>)}
                </ul> : stryMutAct_9fa48("6625") ? false : stryMutAct_9fa48("6624") ? true : (stryCov_9fa48("6624", "6625", "6626"), (stryMutAct_9fa48("6628") ? activeTab === 'useCases' || tooltipData.useCases : stryMutAct_9fa48("6627") ? true : (stryCov_9fa48("6627", "6628"), (stryMutAct_9fa48("6630") ? activeTab !== 'useCases' : stryMutAct_9fa48("6629") ? true : (stryCov_9fa48("6629", "6630"), activeTab === 'useCases')) && tooltipData.useCases)) && <ul className="space-y-2">
                  {tooltipData.useCases.map(stryMutAct_9fa48("6632") ? () => undefined : (stryCov_9fa48("6632"), (useCase, index) => <li key={index} className="flex items-start gap-2">
                      <Target className="w-4 h-4 text-primary-500 mt-0.5 flex-shrink-0" />
                      <span className="text-xs text-neutral-700">{useCase}</span>
                    </li>))}
                </ul>)}
            </div>

            {/* Footer */}
            <div className="px-4 py-2 bg-neutral-50 border-t border-neutral-200">
              <button className="w-full flex items-center justify-center gap-1 text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors">
                Learn More <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// SIMPLE TOOLTIP VARIANT
// =============================================================================

interface SimpleTooltipProps {
  content: string;
  children: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right';
  className?: string;
}
export const SimpleTooltip: React.FC<SimpleTooltipProps> = ({
  content,
  children,
  position = 'top',
  className = ''
}) => {
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("6636") ? true : (stryCov_9fa48("6636"), false));
  const positionClasses = stryMutAct_9fa48("6637") ? {} : (stryCov_9fa48("6637"), {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-2',
    left: 'right-full top-1/2 -translate-y-1/2 mr-2',
    right: 'left-full top-1/2 -translate-y-1/2 ml-2'
  });
  return <div className={`relative inline-block ${className}`}>
      <div onMouseEnter={stryMutAct_9fa48("6643") ? () => undefined : (stryCov_9fa48("6643"), () => setIsOpen(stryMutAct_9fa48("6644") ? false : (stryCov_9fa48("6644"), true)))} onMouseLeave={stryMutAct_9fa48("6645") ? () => undefined : (stryCov_9fa48("6645"), () => setIsOpen(stryMutAct_9fa48("6646") ? true : (stryCov_9fa48("6646"), false)))}>
        {children}
      </div>

      {stryMutAct_9fa48("6649") ? isOpen || <div className={`absolute z-50 px-3 py-2 text-xs text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}>
          {content}
        </div> : stryMutAct_9fa48("6648") ? false : stryMutAct_9fa48("6647") ? true : (stryCov_9fa48("6647", "6648", "6649"), isOpen && <div className={`absolute z-50 px-3 py-2 text-xs text-white bg-neutral-900 rounded-lg shadow-lg whitespace-nowrap ${positionClasses[position]}`}>
          {content}
        </div>)}
    </div>;
};
export default ServiceTooltip;