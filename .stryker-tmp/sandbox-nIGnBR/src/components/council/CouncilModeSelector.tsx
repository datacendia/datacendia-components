// @ts-nocheck
// =============================================================================
// COUNCIL MODE SELECTOR - Enterprise Mode Selection Component
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
import { ChevronDown, Check, Zap, Search, Shield, Target } from 'lucide-react';
import { COUNCIL_MODES, MODE_CATEGORIES, type CouncilMode } from '../../data/councilModes';
import { cn } from '../../../lib/utils';
interface CouncilModeSelectorProps {
  selectedMode: string;
  onModeChange: (modeId: string) => void;
  compact?: boolean;
  className?: string;
}

// Compact dropdown selector
export function CouncilModeSelector({
  selectedMode,
  onModeChange,
  compact = stryMutAct_9fa48("3059") ? true : (stryCov_9fa48("3059"), false),
  className
}: CouncilModeSelectorProps) {
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("3061") ? true : (stryCov_9fa48("3061"), false));
  const dropdownRef = useRef<HTMLDivElement>(null);
  const mode = stryMutAct_9fa48("3064") ? COUNCIL_MODES[selectedMode] && COUNCIL_MODES['war-room'] : stryMutAct_9fa48("3063") ? false : stryMutAct_9fa48("3062") ? true : (stryCov_9fa48("3062", "3063", "3064"), COUNCIL_MODES[selectedMode] || COUNCIL_MODES['war-room']);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stryMutAct_9fa48("3070") ? dropdownRef.current || !dropdownRef.current.contains(event.target as Node) : stryMutAct_9fa48("3069") ? false : stryMutAct_9fa48("3068") ? true : (stryCov_9fa48("3068", "3069", "3070"), dropdownRef.current && (stryMutAct_9fa48("3071") ? dropdownRef.current.contains(event.target as Node) : (stryCov_9fa48("3071"), !dropdownRef.current.contains(event.target as Node))))) {
        setIsOpen(stryMutAct_9fa48("3073") ? true : (stryCov_9fa48("3073"), false));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return stryMutAct_9fa48("3075") ? () => undefined : (stryCov_9fa48("3075"), () => document.removeEventListener('mousedown', handleClickOutside));
  }, stryMutAct_9fa48("3077") ? ["Stryker was here"] : (stryCov_9fa48("3077"), []));
  if (stryMutAct_9fa48("3079") ? false : stryMutAct_9fa48("3078") ? true : (stryCov_9fa48("3078", "3079"), compact)) {
    return <div className={cn("relative", className)} ref={dropdownRef}>
        <button onClick={stryMutAct_9fa48("3082") ? () => undefined : (stryCov_9fa48("3082"), () => setIsOpen(stryMutAct_9fa48("3083") ? isOpen : (stryCov_9fa48("3083"), !isOpen)))} className="flex items-center gap-2 px-3 py-2 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors">
          <span className="text-lg">{mode.emoji}</span>
          <span className="text-white font-medium">{mode.name}</span>
          <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform", stryMutAct_9fa48("3087") ? isOpen || "rotate-180" : stryMutAct_9fa48("3086") ? false : stryMutAct_9fa48("3085") ? true : (stryCov_9fa48("3085", "3086", "3087"), isOpen && "rotate-180"))} />
        </button>
        
        {stryMutAct_9fa48("3091") ? isOpen || <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 max-h-96 overflow-y-auto">
            {Object.entries(MODE_CATEGORIES).map(([category, modeIds]) => <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                  {category}
                </div>
                {modeIds.map(modeId => {
            const m = COUNCIL_MODES[modeId];
            if (!m) {
              return null;
            }
            return <button key={modeId} onClick={() => {
              onModeChange(modeId);
              setIsOpen(false);
            }} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 transition-colors", selectedMode === modeId && "bg-slate-700")}>
                      <span className="text-lg">{m.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.shortDesc}</div>
                      </div>
                      {selectedMode === modeId && <Check className="w-4 h-4 text-emerald-500" />}
                    </button>;
          })}
              </div>)}
          </div> : stryMutAct_9fa48("3090") ? false : stryMutAct_9fa48("3089") ? true : (stryCov_9fa48("3089", "3090", "3091"), isOpen && <div className="absolute top-full left-0 mt-2 w-72 bg-slate-800 rounded-lg border border-slate-700 shadow-xl z-50 max-h-96 overflow-y-auto">
            {Object.entries(MODE_CATEGORIES).map(stryMutAct_9fa48("3092") ? () => undefined : (stryCov_9fa48("3092"), ([category, modeIds]) => <div key={category}>
                <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-wider bg-slate-900/50">
                  {category}
                </div>
                {modeIds.map(modeId => {
            const m = COUNCIL_MODES[modeId];
            if (stryMutAct_9fa48("3096") ? false : stryMutAct_9fa48("3095") ? true : stryMutAct_9fa48("3094") ? m : (stryCov_9fa48("3094", "3095", "3096"), !m)) {
              return null;
            }
            return <button key={modeId} onClick={() => {
              onModeChange(modeId);
              setIsOpen(stryMutAct_9fa48("3099") ? true : (stryCov_9fa48("3099"), false));
            }} className={cn("w-full flex items-center gap-3 px-3 py-2 hover:bg-slate-700/50 transition-colors", stryMutAct_9fa48("3103") ? selectedMode === modeId || "bg-slate-700" : stryMutAct_9fa48("3102") ? false : stryMutAct_9fa48("3101") ? true : (stryCov_9fa48("3101", "3102", "3103"), (stryMutAct_9fa48("3105") ? selectedMode !== modeId : stryMutAct_9fa48("3104") ? true : (stryCov_9fa48("3104", "3105"), selectedMode === modeId)) && "bg-slate-700"))}>
                      <span className="text-lg">{m.emoji}</span>
                      <div className="text-left flex-1">
                        <div className="text-white font-medium">{m.name}</div>
                        <div className="text-xs text-slate-400">{m.shortDesc}</div>
                      </div>
                      {stryMutAct_9fa48("3109") ? selectedMode === modeId || <Check className="w-4 h-4 text-emerald-500" /> : stryMutAct_9fa48("3108") ? false : stryMutAct_9fa48("3107") ? true : (stryCov_9fa48("3107", "3108", "3109"), (stryMutAct_9fa48("3111") ? selectedMode !== modeId : stryMutAct_9fa48("3110") ? true : (stryCov_9fa48("3110", "3111"), selectedMode === modeId)) && <Check className="w-4 h-4 text-emerald-500" />)}
                    </button>;
          })}
              </div>))}
          </div>)}
      </div>;
  }

  // Full grid view
  return <div className={cn("grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3", className)}>
      {Object.values(COUNCIL_MODES).map(stryMutAct_9fa48("3113") ? () => undefined : (stryCov_9fa48("3113"), m => <button key={m.id} onClick={stryMutAct_9fa48("3114") ? () => undefined : (stryCov_9fa48("3114"), () => onModeChange(m.id))} className={cn("p-4 rounded-lg border-2 transition-all text-left", (stryMutAct_9fa48("3118") ? selectedMode !== m.id : stryMutAct_9fa48("3117") ? false : stryMutAct_9fa48("3116") ? true : (stryCov_9fa48("3116", "3117", "3118"), selectedMode === m.id)) ? "border-blue-500 bg-blue-500/10" : "border-slate-700 bg-slate-800/50 hover:border-slate-600")}>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-2xl">{m.emoji}</span>
            <span className="font-semibold text-white">{m.name}</span>
          </div>
          <p className="text-xs text-slate-400 italic">"{m.primeDirective}"</p>
          <p className="text-xs text-slate-500 mt-1">{m.shortDesc}</p>
        </button>))}
    </div>;
}

// Mode Badge (inline display)
export function CouncilModeBadge({
  modeId
}: {
  modeId: string;
}) {
  const mode = stryMutAct_9fa48("3124") ? COUNCIL_MODES[modeId] && COUNCIL_MODES['war-room'] : stryMutAct_9fa48("3123") ? false : stryMutAct_9fa48("3122") ? true : (stryCov_9fa48("3122", "3123", "3124"), COUNCIL_MODES[modeId] || COUNCIL_MODES['war-room']);
  return <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium" style={stryMutAct_9fa48("3126") ? {} : (stryCov_9fa48("3126"), {
    backgroundColor: `${mode.color}20`,
    color: mode.color
  })}>
      <span>{mode.emoji}</span>
      <span>{mode.name}</span>
    </span>;
}

// Mode Info Card (expanded details)
export function CouncilModeCard({
  modeId
}: {
  modeId: string;
}) {
  const mode = stryMutAct_9fa48("3131") ? COUNCIL_MODES[modeId] && COUNCIL_MODES['war-room'] : stryMutAct_9fa48("3130") ? false : stryMutAct_9fa48("3129") ? true : (stryCov_9fa48("3129", "3130", "3131"), COUNCIL_MODES[modeId] || COUNCIL_MODES['war-room']);
  return <div className="p-4 rounded-lg border" style={stryMutAct_9fa48("3133") ? {} : (stryCov_9fa48("3133"), {
    borderColor: `${mode.color}40`,
    backgroundColor: `${mode.color}10`
  })}>
      <div className="flex items-center gap-3 mb-3">
        <span className="text-3xl">{mode.emoji}</span>
        <div>
          <h3 className="font-bold text-lg text-white">{mode.name} Mode</h3>
          <p className="text-sm italic" style={stryMutAct_9fa48("3136") ? {} : (stryCov_9fa48("3136"), {
          color: mode.color
        })}>"{mode.primeDirective}"</p>
        </div>
      </div>
      <p className="text-sm text-slate-300 mb-3">{mode.description}</p>
      <div className="flex flex-wrap gap-2">
        {stryMutAct_9fa48("3137") ? mode.useCases.map((useCase, i) => <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
            {useCase}
          </span>) : (stryCov_9fa48("3137"), mode.useCases.slice(0, 4).map(stryMutAct_9fa48("3138") ? () => undefined : (stryCov_9fa48("3138"), (useCase, i) => <span key={i} className="px-2 py-1 bg-slate-800 rounded text-xs text-slate-400">
            {useCase}
          </span>)))}
      </div>
    </div>;
}

// Quick Mode Switcher (horizontal pills)
export function CouncilModeQuickSwitch({
  selectedMode,
  onModeChange,
  showAll = stryMutAct_9fa48("3139") ? true : (stryCov_9fa48("3139"), false)
}: {
  selectedMode: string;
  onModeChange: (id: string) => void;
  showAll?: boolean;
}) {
  const quickModes = showAll ? Object.values(COUNCIL_MODES) : stryMutAct_9fa48("3141") ? [] : (stryCov_9fa48("3141"), [COUNCIL_MODES['war-room'], COUNCIL_MODES['rapid'], COUNCIL_MODES['execution'], COUNCIL_MODES['compliance']]);
  return <div className="flex flex-wrap gap-2">
      {quickModes.map(stryMutAct_9fa48("3146") ? () => undefined : (stryCov_9fa48("3146"), mode => <button key={mode.id} onClick={stryMutAct_9fa48("3147") ? () => undefined : (stryCov_9fa48("3147"), () => onModeChange(mode.id))} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm transition-all", (stryMutAct_9fa48("3151") ? selectedMode !== mode.id : stryMutAct_9fa48("3150") ? false : stryMutAct_9fa48("3149") ? true : (stryCov_9fa48("3149", "3150", "3151"), selectedMode === mode.id)) ? "bg-white/10 text-white border border-white/20" : "bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700")}>
          <span>{mode.emoji}</span>
          <span>{mode.name}</span>
        </button>))}
    </div>;
}
export default CouncilModeSelector;