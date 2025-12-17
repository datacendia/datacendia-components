// @ts-nocheck
// =============================================================================
// PERSONALITY TRAITS PANEL
// UI for toggling AI agent personality traits
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
import React, { useState, useMemo } from 'react';
import { Settings, ChevronDown, ChevronRight, AlertCircle, Check, X, Info, Zap, RefreshCw } from 'lucide-react';
import { PersonalityTrait, TraitCategory, getAvailableTraits, getTraitCategories, getTraitsByCategory, validateTraitCombination, getTrait } from '../../lib/agents/personality';
interface PersonalityTraitsPanelProps {
  agentId: string;
  agentName: string;
  enabledTraits: string[];
  onTraitsChange: (enabledTraits: string[]) => void;
  compact?: boolean;
}
export const PersonalityTraitsPanel: React.FC<PersonalityTraitsPanelProps> = ({
  agentId,
  agentName,
  enabledTraits,
  onTraitsChange,
  compact = stryMutAct_9fa48("195") ? true : (stryCov_9fa48("195"), false)
}) => {
  const [expandedCategories, setExpandedCategories] = useState<Set<TraitCategory>>(new Set());
  const [showConflicts, setShowConflicts] = useState(stryMutAct_9fa48("197") ? true : (stryCov_9fa48("197"), false));
  const categories = getTraitCategories();
  const allTraits = getAvailableTraits();
  const validation = useMemo(() => {
    return validateTraitCombination(enabledTraits);
  }, stryMutAct_9fa48("199") ? [] : (stryCov_9fa48("199"), [enabledTraits]));
  const toggleCategory = (category: TraitCategory) => {
    const newExpanded = new Set(expandedCategories);
    if (stryMutAct_9fa48("202") ? false : stryMutAct_9fa48("201") ? true : (stryCov_9fa48("201", "202"), newExpanded.has(category))) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };
  const toggleTrait = (traitId: string) => {
    const newTraits = enabledTraits.includes(traitId) ? stryMutAct_9fa48("206") ? enabledTraits : (stryCov_9fa48("206"), enabledTraits.filter(stryMutAct_9fa48("207") ? () => undefined : (stryCov_9fa48("207"), id => stryMutAct_9fa48("210") ? id === traitId : stryMutAct_9fa48("209") ? false : stryMutAct_9fa48("208") ? true : (stryCov_9fa48("208", "209", "210"), id !== traitId)))) : stryMutAct_9fa48("211") ? [] : (stryCov_9fa48("211"), [...enabledTraits, traitId]);
    onTraitsChange(newTraits);
  };
  const clearAllTraits = () => {
    onTraitsChange(stryMutAct_9fa48("213") ? ["Stryker was here"] : (stryCov_9fa48("213"), []));
  };
  const isTraitConflicting = (traitId: string): boolean => {
    if (stryMutAct_9fa48("217") ? false : stryMutAct_9fa48("216") ? true : stryMutAct_9fa48("215") ? enabledTraits.includes(traitId) : (stryCov_9fa48("215", "216", "217"), !enabledTraits.includes(traitId))) {
      return stryMutAct_9fa48("219") ? true : (stryCov_9fa48("219"), false);
    }
    return stryMutAct_9fa48("220") ? validation.conflicts.every(([t1, t2]) => t1 === traitId || t2 === traitId) : (stryCov_9fa48("220"), validation.conflicts.some(stryMutAct_9fa48("221") ? () => undefined : (stryCov_9fa48("221"), ([t1, t2]) => stryMutAct_9fa48("224") ? t1 === traitId && t2 === traitId : stryMutAct_9fa48("223") ? false : stryMutAct_9fa48("222") ? true : (stryCov_9fa48("222", "223", "224"), (stryMutAct_9fa48("226") ? t1 !== traitId : stryMutAct_9fa48("225") ? false : (stryCov_9fa48("225", "226"), t1 === traitId)) || (stryMutAct_9fa48("228") ? t2 !== traitId : stryMutAct_9fa48("227") ? false : (stryCov_9fa48("227", "228"), t2 === traitId))))));
  };
  const wouldConflict = (traitId: string): string[] => {
    const trait = getTrait(traitId);
    if (stryMutAct_9fa48("232") ? !trait && enabledTraits.includes(traitId) : stryMutAct_9fa48("231") ? false : stryMutAct_9fa48("230") ? true : (stryCov_9fa48("230", "231", "232"), (stryMutAct_9fa48("233") ? trait : (stryCov_9fa48("233"), !trait)) || enabledTraits.includes(traitId))) {
      return stryMutAct_9fa48("235") ? ["Stryker was here"] : (stryCov_9fa48("235"), []);
    }
    return stryMutAct_9fa48("236") ? enabledTraits : (stryCov_9fa48("236"), enabledTraits.filter(stryMutAct_9fa48("237") ? () => undefined : (stryCov_9fa48("237"), enabledId => stryMutAct_9fa48("240") ? trait.conflictsWith?.includes(enabledId) && getTrait(enabledId)?.conflictsWith?.includes(traitId) : stryMutAct_9fa48("239") ? false : stryMutAct_9fa48("238") ? true : (stryCov_9fa48("238", "239", "240"), (stryMutAct_9fa48("241") ? trait.conflictsWith.includes(enabledId) : (stryCov_9fa48("241"), trait.conflictsWith?.includes(enabledId))) || (stryMutAct_9fa48("243") ? getTrait(enabledId).conflictsWith?.includes(traitId) : stryMutAct_9fa48("242") ? getTrait(enabledId)?.conflictsWith.includes(traitId) : (stryCov_9fa48("242", "243"), getTrait(enabledId)?.conflictsWith?.includes(traitId)))))));
  };
  const getIntensityColor = (intensity: string): string => {
    switch (intensity) {
      case 'subtle':
        if (stryMutAct_9fa48("245")) {} else {
          stryCov_9fa48("245");
          return 'bg-blue-500/20 text-blue-400';
        }
      case 'moderate':
        if (stryMutAct_9fa48("248")) {} else {
          stryCov_9fa48("248");
          return 'bg-amber-500/20 text-amber-400';
        }
      case 'strong':
        if (stryMutAct_9fa48("251")) {} else {
          stryCov_9fa48("251");
          return 'bg-red-500/20 text-red-400';
        }
      default:
        if (stryMutAct_9fa48("254")) {} else {
          stryCov_9fa48("254");
          return 'bg-slate-500/20 text-slate-400';
        }
    }
  };
  if (stryMutAct_9fa48("257") ? false : stryMutAct_9fa48("256") ? true : (stryCov_9fa48("256", "257"), compact)) {
    return <div className="bg-slate-800/50 rounded-lg p-4 border border-slate-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Settings size={16} className="text-indigo-400" />
            <span className="text-sm font-medium text-white">Personality Traits</span>
          </div>
          <span className="text-xs text-slate-400">
            {enabledTraits.length} active
          </span>
        </div>
        
        {(stryMutAct_9fa48("261") ? enabledTraits.length !== 0 : stryMutAct_9fa48("260") ? false : stryMutAct_9fa48("259") ? true : (stryCov_9fa48("259", "260", "261"), enabledTraits.length === 0)) ? <p className="text-xs text-slate-500">All traits disabled (default behavior)</p> : <div className="flex flex-wrap gap-1.5">
            {enabledTraits.map(traitId => {
          const trait = getTrait(traitId);
          if (stryMutAct_9fa48("265") ? false : stryMutAct_9fa48("264") ? true : stryMutAct_9fa48("263") ? trait : (stryCov_9fa48("263", "264", "265"), !trait)) {
            return null;
          }
          return <button key={traitId} onClick={stryMutAct_9fa48("267") ? () => undefined : (stryCov_9fa48("267"), () => toggleTrait(traitId))} className={`
                    px-2 py-1 rounded text-xs flex items-center gap-1
                    ${isTraitConflicting(traitId) ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30'}
                    hover:bg-opacity-30 transition-colors
                  `}>
                  <span>{trait.icon}</span>
                  <span>{trait.name}</span>
                  <X size={12} />
                </button>;
        })}
          </div>}
        
        {stryMutAct_9fa48("273") ? !validation.valid || <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle size={12} />
            <span>Conflicting traits detected</span>
          </div> : stryMutAct_9fa48("272") ? false : stryMutAct_9fa48("271") ? true : (stryCov_9fa48("271", "272", "273"), (stryMutAct_9fa48("274") ? validation.valid : (stryCov_9fa48("274"), !validation.valid)) && <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
            <AlertCircle size={12} />
            <span>Conflicting traits detected</span>
          </div>)}
      </div>;
  }
  return <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Settings size={20} className="text-indigo-400" />
              Personality Traits
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Customize {agentName}'s personality and communication style
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <span className={`
              px-3 py-1.5 rounded-full text-sm font-medium
              ${(stryMutAct_9fa48("278") ? enabledTraits.length !== 0 : stryMutAct_9fa48("277") ? false : stryMutAct_9fa48("276") ? true : (stryCov_9fa48("276", "277", "278"), enabledTraits.length === 0)) ? 'bg-slate-700 text-slate-300' : 'bg-indigo-500/20 text-indigo-400'}
            `}>
              {enabledTraits.length} / {allTraits.length} active
            </span>
            
            {stryMutAct_9fa48("283") ? enabledTraits.length > 0 || <button onClick={clearAllTraits} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm">
                <RefreshCw size={14} />
                Reset All
              </button> : stryMutAct_9fa48("282") ? false : stryMutAct_9fa48("281") ? true : (stryCov_9fa48("281", "282", "283"), (stryMutAct_9fa48("286") ? enabledTraits.length <= 0 : stryMutAct_9fa48("285") ? enabledTraits.length >= 0 : stryMutAct_9fa48("284") ? true : (stryCov_9fa48("284", "285", "286"), enabledTraits.length > 0)) && <button onClick={clearAllTraits} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700 text-slate-300 hover:bg-slate-600 transition-colors text-sm">
                <RefreshCw size={14} />
                Reset All
              </button>)}
          </div>
        </div>
        
        {/* Conflict Warning */}
        {stryMutAct_9fa48("289") ? !validation.valid || <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Conflicting Traits Detected</p>
              <p className="text-xs text-red-300/70 mt-1">
                {validation.conflicts.map(([t1, t2]) => `${getTrait(t1)?.name} ↔ ${getTrait(t2)?.name}`).join(', ')}
              </p>
            </div>
          </div> : stryMutAct_9fa48("288") ? false : stryMutAct_9fa48("287") ? true : (stryCov_9fa48("287", "288", "289"), (stryMutAct_9fa48("290") ? validation.valid : (stryCov_9fa48("290"), !validation.valid)) && <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 flex items-start gap-3">
            <AlertCircle size={20} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-400">Conflicting Traits Detected</p>
              <p className="text-xs text-red-300/70 mt-1">
                {validation.conflicts.map(stryMutAct_9fa48("291") ? () => undefined : (stryCov_9fa48("291"), ([t1, t2]) => `${stryMutAct_9fa48("293") ? getTrait(t1).name : (stryCov_9fa48("293"), getTrait(t1)?.name)} ↔ ${stryMutAct_9fa48("294") ? getTrait(t2).name : (stryCov_9fa48("294"), getTrait(t2)?.name)}`)).join(', ')}
              </p>
            </div>
          </div>)}
        
        {/* Info Box */}
        <div className="mt-4 p-3 rounded-lg bg-indigo-500/10 border border-indigo-500/30 flex items-start gap-3">
          <Info size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <div className="text-xs text-indigo-300/80">
            <p className="font-medium text-indigo-300">How Personality Traits Work</p>
            <p className="mt-1">
              Traits modify how the AI agent communicates and reasons. All traits are <strong>OFF by default</strong> for 
              standard professional behavior. Enable traits to customize agent personality for specific use cases 
              like devil's advocate analysis, creative brainstorming, or risk assessment.
            </p>
          </div>
        </div>
      </div>
      
      {/* Categories */}
      <div className="divide-y divide-slate-700/50">
        {categories.map(category => {
        const categoryTraits = getTraitsByCategory(category.id);
        const enabledCount = stryMutAct_9fa48("297") ? categoryTraits.length : (stryCov_9fa48("297"), categoryTraits.filter(stryMutAct_9fa48("298") ? () => undefined : (stryCov_9fa48("298"), t => enabledTraits.includes(t.id))).length);
        const isExpanded = expandedCategories.has(category.id);
        return <div key={category.id}>
              {/* Category Header */}
              <button onClick={stryMutAct_9fa48("299") ? () => undefined : (stryCov_9fa48("299"), () => toggleCategory(category.id))} className="w-full px-6 py-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                <div className="flex items-center gap-3">
                  {isExpanded ? <ChevronDown size={20} className="text-slate-400" /> : <ChevronRight size={20} className="text-slate-400" />}
                  <div className="text-left">
                    <h4 className="font-medium text-white">{category.name}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{category.description}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-xs text-slate-500">
                    {categoryTraits.length} traits
                  </span>
                  {stryMutAct_9fa48("302") ? enabledCount > 0 || <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                      {enabledCount} active
                    </span> : stryMutAct_9fa48("301") ? false : stryMutAct_9fa48("300") ? true : (stryCov_9fa48("300", "301", "302"), (stryMutAct_9fa48("305") ? enabledCount <= 0 : stryMutAct_9fa48("304") ? enabledCount >= 0 : stryMutAct_9fa48("303") ? true : (stryCov_9fa48("303", "304", "305"), enabledCount > 0)) && <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-400 text-xs font-medium">
                      {enabledCount} active
                    </span>)}
                </div>
              </button>
              
              {/* Traits Grid */}
              {stryMutAct_9fa48("308") ? isExpanded || <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryTraits.map(trait => {
              const isEnabled = enabledTraits.includes(trait.id);
              const conflicting = isTraitConflicting(trait.id);
              const potentialConflicts = wouldConflict(trait.id);
              return <div key={trait.id} className={`
                          relative p-4 rounded-lg border transition-all cursor-pointer
                          ${isEnabled ? conflicting ? 'bg-red-500/10 border-red-500/30' : 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'}
                        `} onClick={() => toggleTrait(trait.id)}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{trait.icon}</span>
                            <div>
                              <h5 className="font-medium text-white">{trait.name}</h5>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getIntensityColor(trait.intensity)}`}>
                                {trait.intensity}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${isEnabled ? conflicting ? 'bg-red-500' : 'bg-indigo-500' : 'bg-slate-700'}
                          `}>
                            {isEnabled ? <Check size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-400 mt-2">
                          {trait.description}
                        </p>
                        
                        {/* Show potential conflicts for disabled traits */}
                        {!isEnabled && potentialConflicts.length > 0 && <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                            <AlertCircle size={12} />
                            <span>
                              Would conflict with: {potentialConflicts.map(id => getTrait(id)?.name).join(', ')}
                            </span>
                          </div>}
                        
                        {/* Conflicts indicator for enabled traits */}
                        {isEnabled && conflicting && <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                            <AlertCircle size={12} />
                            <span>Conflicts with other enabled traits</span>
                          </div>}
                      </div>;
            })}
                </div> : stryMutAct_9fa48("307") ? false : stryMutAct_9fa48("306") ? true : (stryCov_9fa48("306", "307", "308"), isExpanded && <div className="px-6 pb-4 grid grid-cols-1 md:grid-cols-2 gap-3">
                  {categoryTraits.map(trait => {
              const isEnabled = enabledTraits.includes(trait.id);
              const conflicting = isTraitConflicting(trait.id);
              const potentialConflicts = wouldConflict(trait.id);
              return <div key={trait.id} className={`
                          relative p-4 rounded-lg border transition-all cursor-pointer
                          ${isEnabled ? conflicting ? 'bg-red-500/10 border-red-500/30' : 'bg-indigo-500/10 border-indigo-500/30' : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50'}
                        `} onClick={stryMutAct_9fa48("314") ? () => undefined : (stryCov_9fa48("314"), () => toggleTrait(trait.id))}>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-xl">{trait.icon}</span>
                            <div>
                              <h5 className="font-medium text-white">{trait.name}</h5>
                              <span className={`text-xs px-1.5 py-0.5 rounded ${getIntensityColor(trait.intensity)}`}>
                                {trait.intensity}
                              </span>
                            </div>
                          </div>
                          
                          <div className={`
                            w-6 h-6 rounded-full flex items-center justify-center
                            ${isEnabled ? conflicting ? 'bg-red-500' : 'bg-indigo-500' : 'bg-slate-700'}
                          `}>
                            {isEnabled ? <Check size={14} className="text-white" /> : <div className="w-2 h-2 rounded-full bg-slate-500" />}
                          </div>
                        </div>
                        
                        <p className="text-xs text-slate-400 mt-2">
                          {trait.description}
                        </p>
                        
                        {/* Show potential conflicts for disabled traits */}
                        {stryMutAct_9fa48("322") ? !isEnabled && potentialConflicts.length > 0 || <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                            <AlertCircle size={12} />
                            <span>
                              Would conflict with: {potentialConflicts.map(id => getTrait(id)?.name).join(', ')}
                            </span>
                          </div> : stryMutAct_9fa48("321") ? false : stryMutAct_9fa48("320") ? true : (stryCov_9fa48("320", "321", "322"), (stryMutAct_9fa48("324") ? !isEnabled || potentialConflicts.length > 0 : stryMutAct_9fa48("323") ? true : (stryCov_9fa48("323", "324"), (stryMutAct_9fa48("325") ? isEnabled : (stryCov_9fa48("325"), !isEnabled)) && (stryMutAct_9fa48("328") ? potentialConflicts.length <= 0 : stryMutAct_9fa48("327") ? potentialConflicts.length >= 0 : stryMutAct_9fa48("326") ? true : (stryCov_9fa48("326", "327", "328"), potentialConflicts.length > 0)))) && <div className="mt-2 flex items-center gap-1.5 text-xs text-amber-400">
                            <AlertCircle size={12} />
                            <span>
                              Would conflict with: {potentialConflicts.map(stryMutAct_9fa48("329") ? () => undefined : (stryCov_9fa48("329"), id => stryMutAct_9fa48("330") ? getTrait(id).name : (stryCov_9fa48("330"), getTrait(id)?.name))).join(', ')}
                            </span>
                          </div>)}
                        
                        {/* Conflicts indicator for enabled traits */}
                        {stryMutAct_9fa48("334") ? isEnabled && conflicting || <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                            <AlertCircle size={12} />
                            <span>Conflicts with other enabled traits</span>
                          </div> : stryMutAct_9fa48("333") ? false : stryMutAct_9fa48("332") ? true : (stryCov_9fa48("332", "333", "334"), (stryMutAct_9fa48("336") ? isEnabled || conflicting : stryMutAct_9fa48("335") ? true : (stryCov_9fa48("335", "336"), isEnabled && conflicting)) && <div className="mt-2 flex items-center gap-1.5 text-xs text-red-400">
                            <AlertCircle size={12} />
                            <span>Conflicts with other enabled traits</span>
                          </div>)}
                      </div>;
            })}
                </div>)}
            </div>;
      })}
      </div>
      
      {/* Footer with Active Traits Summary */}
      {stryMutAct_9fa48("339") ? enabledTraits.length > 0 || <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700/50">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            Active Personality Profile
          </h4>
          <div className="flex flex-wrap gap-2">
            {enabledTraits.map(traitId => {
          const trait = getTrait(traitId);
          if (!trait) {
            return null;
          }
          return <span key={traitId} className={`
                    px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                    ${isTraitConflicting(traitId) ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}
                  `}>
                  {trait.icon} {trait.name}
                </span>;
        })}
          </div>
        </div> : stryMutAct_9fa48("338") ? false : stryMutAct_9fa48("337") ? true : (stryCov_9fa48("337", "338", "339"), (stryMutAct_9fa48("342") ? enabledTraits.length <= 0 : stryMutAct_9fa48("341") ? enabledTraits.length >= 0 : stryMutAct_9fa48("340") ? true : (stryCov_9fa48("340", "341", "342"), enabledTraits.length > 0)) && <div className="px-6 py-4 bg-slate-800/30 border-t border-slate-700/50">
          <h4 className="text-sm font-medium text-white mb-2 flex items-center gap-2">
            <Zap size={14} className="text-amber-400" />
            Active Personality Profile
          </h4>
          <div className="flex flex-wrap gap-2">
            {enabledTraits.map(traitId => {
          const trait = getTrait(traitId);
          if (stryMutAct_9fa48("346") ? false : stryMutAct_9fa48("345") ? true : stryMutAct_9fa48("344") ? trait : (stryCov_9fa48("344", "345", "346"), !trait)) {
            return null;
          }
          return <span key={traitId} className={`
                    px-2.5 py-1 rounded-full text-xs font-medium flex items-center gap-1.5
                    ${isTraitConflicting(traitId) ? 'bg-red-500/20 text-red-400' : 'bg-indigo-500/20 text-indigo-400'}
                  `}>
                  {trait.icon} {trait.name}
                </span>;
        })}
          </div>
        </div>)}
    </div>;
};

// =============================================================================
// QUICK TRAIT TOGGLE COMPONENT
// For inline use in agent cards
// =============================================================================

interface QuickTraitToggleProps {
  traitId: string;
  isEnabled: boolean;
  onToggle: () => void;
  size?: 'sm' | 'md';
}
export const QuickTraitToggle: React.FC<QuickTraitToggleProps> = ({
  traitId,
  isEnabled,
  onToggle,
  size = 'md'
}) => {
  const trait = getTrait(traitId);
  if (stryMutAct_9fa48("355") ? false : stryMutAct_9fa48("354") ? true : stryMutAct_9fa48("353") ? trait : (stryCov_9fa48("353", "354", "355"), !trait)) {
    return null;
  }
  const sizeClasses = (stryMutAct_9fa48("359") ? size !== 'sm' : stryMutAct_9fa48("358") ? false : stryMutAct_9fa48("357") ? true : (stryCov_9fa48("357", "358", "359"), size === 'sm')) ? 'px-2 py-1 text-xs gap-1' : 'px-3 py-1.5 text-sm gap-1.5';
  return <button onClick={onToggle} className={`
        rounded-lg flex items-center transition-all
        ${sizeClasses}
        ${isEnabled ? 'bg-indigo-500/20 text-indigo-400 border border-indigo-500/30' : 'bg-slate-700/50 text-slate-400 border border-slate-600/50 hover:bg-slate-700'}
      `} title={trait.description}>
      <span>{trait.icon}</span>
      <span>{trait.name}</span>
      <span className={`w-3 h-3 rounded-full ${isEnabled ? 'bg-indigo-500' : 'bg-slate-600'}`} />
    </button>;
};
export default PersonalityTraitsPanel;