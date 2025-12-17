// @ts-nocheck
// =============================================================================
// MODEL SWITCHER COMPONENT
// Easy UI for switching AI models for agents and services
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
import { Cpu, ChevronDown, Check, Zap, Brain, Code, Image, Search, AlertCircle, Info, Settings, RefreshCw } from 'lucide-react';
import { OllamaModel, ModelCategory, getAvailableModels, getModel, getModelCategories, getRecommendedModels, getDefaultModel, TOTAL_MODEL_COUNT } from '../../lib/agents/modelSwitching';

// =============================================================================
// MODEL SWITCHER PANEL (Full)
// =============================================================================

interface ModelSwitcherProps {
  agentCode: string;
  agentName: string;
  currentModel: string;
  onModelChange: (modelId: string) => void;
}
export const ModelSwitcher: React.FC<ModelSwitcherProps> = ({
  agentCode,
  agentName,
  currentModel,
  onModelChange
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const categories = getModelCategories();
  const allModels = getAvailableModels();
  const recommendedModels = useMemo(stryMutAct_9fa48("3") ? () => undefined : (stryCov_9fa48("3"), () => getRecommendedModels(agentCode)), stryMutAct_9fa48("4") ? [] : (stryCov_9fa48("4"), [agentCode]));
  const currentModelData = getModel(currentModel);
  const filteredModels = useMemo(() => {
    let models = allModels;
    if (stryMutAct_9fa48("7") ? false : stryMutAct_9fa48("6") ? true : (stryCov_9fa48("6", "7"), selectedCategory)) {
      const category = categories.find(stryMutAct_9fa48("9") ? () => undefined : (stryCov_9fa48("9"), c => stryMutAct_9fa48("12") ? c.id !== selectedCategory : stryMutAct_9fa48("11") ? false : stryMutAct_9fa48("10") ? true : (stryCov_9fa48("10", "11", "12"), c.id === selectedCategory)));
      if (stryMutAct_9fa48("14") ? false : stryMutAct_9fa48("13") ? true : (stryCov_9fa48("13", "14"), category)) {
        models = stryMutAct_9fa48("16") ? models : (stryCov_9fa48("16"), models.filter(stryMutAct_9fa48("17") ? () => undefined : (stryCov_9fa48("17"), m => category.models.includes(m.id))));
      }
    }
    if (stryMutAct_9fa48("19") ? false : stryMutAct_9fa48("18") ? true : (stryCov_9fa48("18", "19"), searchQuery)) {
      const query = stryMutAct_9fa48("21") ? searchQuery.toUpperCase() : (stryCov_9fa48("21"), searchQuery.toLowerCase());
      models = stryMutAct_9fa48("22") ? models : (stryCov_9fa48("22"), models.filter(stryMutAct_9fa48("23") ? () => undefined : (stryCov_9fa48("23"), m => stryMutAct_9fa48("26") ? (m.name.toLowerCase().includes(query) || m.description.toLowerCase().includes(query)) && m.capabilities.some(c => c.includes(query)) : stryMutAct_9fa48("25") ? false : stryMutAct_9fa48("24") ? true : (stryCov_9fa48("24", "25", "26"), (stryMutAct_9fa48("28") ? m.name.toLowerCase().includes(query) && m.description.toLowerCase().includes(query) : stryMutAct_9fa48("27") ? false : (stryCov_9fa48("27", "28"), (stryMutAct_9fa48("29") ? m.name.toUpperCase().includes(query) : (stryCov_9fa48("29"), m.name.toLowerCase().includes(query))) || (stryMutAct_9fa48("30") ? m.description.toUpperCase().includes(query) : (stryCov_9fa48("30"), m.description.toLowerCase().includes(query))))) || (stryMutAct_9fa48("31") ? m.capabilities.every(c => c.includes(query)) : (stryCov_9fa48("31"), m.capabilities.some(stryMutAct_9fa48("32") ? () => undefined : (stryCov_9fa48("32"), c => c.includes(query)))))))));
    }
    return models;
  }, stryMutAct_9fa48("33") ? [] : (stryCov_9fa48("33"), [allModels, selectedCategory, searchQuery, categories]));
  const getSpeedIcon = (speed: string) => {
    switch (speed) {
      case 'fast':
        if (stryMutAct_9fa48("35")) {} else {
          stryCov_9fa48("35");
          return <Zap size={14} className="text-green-400" />;
        }
      case 'medium':
        if (stryMutAct_9fa48("37")) {} else {
          stryCov_9fa48("37");
          return <Zap size={14} className="text-amber-400" />;
        }
      case 'slow':
        if (stryMutAct_9fa48("39")) {} else {
          stryCov_9fa48("39");
          return <Zap size={14} className="text-red-400" />;
        }
      default:
        if (stryMutAct_9fa48("41")) {} else {
          stryCov_9fa48("41");
          return null;
        }
    }
  };
  const getQualityBadge = (quality: string) => {
    const colors: Record<string, string> = stryMutAct_9fa48("43") ? {} : (stryCov_9fa48("43"), {
      basic: 'bg-slate-500/20 text-slate-400',
      good: 'bg-blue-500/20 text-blue-400',
      excellent: 'bg-purple-500/20 text-purple-400',
      flagship: 'bg-amber-500/20 text-amber-400'
    });
    return stryMutAct_9fa48("50") ? colors[quality] && colors.good : stryMutAct_9fa48("49") ? false : stryMutAct_9fa48("48") ? true : (stryCov_9fa48("48", "49", "50"), colors[quality] || colors.good);
  };
  const getCapabilityIcon = (capability: string) => {
    switch (capability) {
      case 'reasoning':
        if (stryMutAct_9fa48("52")) {} else {
          stryCov_9fa48("52");
          return <Brain size={12} />;
        }
      case 'coding':
        if (stryMutAct_9fa48("54")) {} else {
          stryCov_9fa48("54");
          return <Code size={12} />;
        }
      case 'vision':
        if (stryMutAct_9fa48("56")) {} else {
          stryCov_9fa48("56");
          return <Image size={12} />;
        }
      default:
        if (stryMutAct_9fa48("58")) {} else {
          stryCov_9fa48("58");
          return null;
        }
    }
  };
  return <div className="bg-slate-900/50 rounded-xl border border-slate-700/50 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 bg-slate-800/50 border-b border-slate-700/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Cpu size={20} className="text-cyan-400" />
              Model Selection
            </h3>
            <p className="text-sm text-slate-400 mt-1">
              Choose the AI model for {agentName}
            </p>
          </div>
          
          <div className="text-right">
            <span className="text-xs text-slate-500">
              {TOTAL_MODEL_COUNT} models available
            </span>
          </div>
        </div>
        
        {/* Current Model Display */}
        {stryMutAct_9fa48("61") ? currentModelData || <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Cpu size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{currentModelData.name}</p>
                  <p className="text-xs text-slate-400">{currentModelData.size} • {currentModelData.contextLength.toLocaleString()} context</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSpeedIcon(currentModelData.speed)}
                <span className={`text-xs px-2 py-0.5 rounded ${getQualityBadge(currentModelData.quality)}`}>
                  {currentModelData.quality}
                </span>
              </div>
            </div>
          </div> : stryMutAct_9fa48("60") ? false : stryMutAct_9fa48("59") ? true : (stryCov_9fa48("59", "60", "61"), currentModelData && <div className="mt-4 p-3 rounded-lg bg-cyan-500/10 border border-cyan-500/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <Cpu size={20} className="text-cyan-400" />
                </div>
                <div>
                  <p className="font-medium text-white">{currentModelData.name}</p>
                  <p className="text-xs text-slate-400">{currentModelData.size} • {currentModelData.contextLength.toLocaleString()} context</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getSpeedIcon(currentModelData.speed)}
                <span className={`text-xs px-2 py-0.5 rounded ${getQualityBadge(currentModelData.quality)}`}>
                  {currentModelData.quality}
                </span>
              </div>
            </div>
          </div>)}
        
        {/* Search */}
        <div className="mt-4 relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search models..." value={searchQuery} onChange={stryMutAct_9fa48("63") ? () => undefined : (stryCov_9fa48("63"), e => setSearchQuery(e.target.value))} className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500" />
        </div>
      </div>
      
      {/* Recommended Models */}
      {stryMutAct_9fa48("66") ? recommendedModels.length > 0 || <div className="px-6 py-4 border-b border-slate-700/50">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <span className="text-amber-400">★</span>
            Recommended for {agentName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendedModels.map(model => <button key={model.id} onClick={() => onModelChange(model.id)} className={`
                  px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all
                  ${currentModel === model.id ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700'}
                `}>
                {currentModel === model.id && <Check size={14} />}
                {model.name}
              </button>)}
          </div>
        </div> : stryMutAct_9fa48("65") ? false : stryMutAct_9fa48("64") ? true : (stryCov_9fa48("64", "65", "66"), (stryMutAct_9fa48("69") ? recommendedModels.length <= 0 : stryMutAct_9fa48("68") ? recommendedModels.length >= 0 : stryMutAct_9fa48("67") ? true : (stryCov_9fa48("67", "68", "69"), recommendedModels.length > 0)) && <div className="px-6 py-4 border-b border-slate-700/50">
          <h4 className="text-sm font-medium text-white mb-3 flex items-center gap-2">
            <span className="text-amber-400">★</span>
            Recommended for {agentName}
          </h4>
          <div className="flex flex-wrap gap-2">
            {recommendedModels.map(stryMutAct_9fa48("70") ? () => undefined : (stryCov_9fa48("70"), model => <button key={model.id} onClick={stryMutAct_9fa48("71") ? () => undefined : (stryCov_9fa48("71"), () => onModelChange(model.id))} className={`
                  px-3 py-1.5 rounded-lg text-sm flex items-center gap-2 transition-all
                  ${(stryMutAct_9fa48("75") ? currentModel !== model.id : stryMutAct_9fa48("74") ? false : stryMutAct_9fa48("73") ? true : (stryCov_9fa48("73", "74", "75"), currentModel === model.id)) ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/30' : 'bg-slate-700/50 text-slate-300 border border-slate-600/50 hover:bg-slate-700'}
                `}>
                {stryMutAct_9fa48("80") ? currentModel === model.id || <Check size={14} /> : stryMutAct_9fa48("79") ? false : stryMutAct_9fa48("78") ? true : (stryCov_9fa48("78", "79", "80"), (stryMutAct_9fa48("82") ? currentModel !== model.id : stryMutAct_9fa48("81") ? true : (stryCov_9fa48("81", "82"), currentModel === model.id)) && <Check size={14} />)}
                {model.name}
              </button>))}
          </div>
        </div>)}
      
      {/* Category Tabs */}
      <div className="px-6 py-3 border-b border-slate-700/50 overflow-x-auto">
        <div className="flex gap-2">
          <button onClick={stryMutAct_9fa48("83") ? () => undefined : (stryCov_9fa48("83"), () => setSelectedCategory(null))} className={`
              px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all
              ${(stryMutAct_9fa48("87") ? selectedCategory !== null : stryMutAct_9fa48("86") ? false : stryMutAct_9fa48("85") ? true : (stryCov_9fa48("85", "86", "87"), selectedCategory === null)) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'}
            `}>
            All Models
          </button>
          {categories.map(stryMutAct_9fa48("90") ? () => undefined : (stryCov_9fa48("90"), category => <button key={category.id} onClick={stryMutAct_9fa48("91") ? () => undefined : (stryCov_9fa48("91"), () => setSelectedCategory(category.id))} className={`
                px-3 py-1.5 rounded-lg text-sm whitespace-nowrap transition-all
                ${(stryMutAct_9fa48("95") ? selectedCategory !== category.id : stryMutAct_9fa48("94") ? false : stryMutAct_9fa48("93") ? true : (stryCov_9fa48("93", "94", "95"), selectedCategory === category.id)) ? 'bg-cyan-500/20 text-cyan-400' : 'bg-slate-700/50 text-slate-400 hover:text-white'}
              `}>
              {category.name}
            </button>))}
        </div>
      </div>
      
      {/* Model List */}
      <div className="max-h-96 overflow-y-auto divide-y divide-slate-700/50">
        {filteredModels.map(stryMutAct_9fa48("98") ? () => undefined : (stryCov_9fa48("98"), model => <button key={model.id} onClick={stryMutAct_9fa48("99") ? () => undefined : (stryCov_9fa48("99"), () => onModelChange(model.id))} className={`
              w-full px-6 py-4 text-left transition-all
              ${(stryMutAct_9fa48("103") ? currentModel !== model.id : stryMutAct_9fa48("102") ? false : stryMutAct_9fa48("101") ? true : (stryCov_9fa48("101", "102", "103"), currentModel === model.id)) ? 'bg-cyan-500/10' : 'hover:bg-slate-800/50'}
            `}>
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-white">{model.name}</span>
                  <span className="text-xs text-slate-500">{model.size}</span>
                  {stryMutAct_9fa48("108") ? currentModel === model.id || <Check size={16} className="text-cyan-400" /> : stryMutAct_9fa48("107") ? false : stryMutAct_9fa48("106") ? true : (stryCov_9fa48("106", "107", "108"), (stryMutAct_9fa48("110") ? currentModel !== model.id : stryMutAct_9fa48("109") ? true : (stryCov_9fa48("109", "110"), currentModel === model.id)) && <Check size={16} className="text-cyan-400" />)}
                </div>
                <p className="text-sm text-slate-400 mt-1">{model.description}</p>
                
                {/* Capabilities */}
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {stryMutAct_9fa48("111") ? model.capabilities.map(cap => <span key={cap} className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-400 flex items-center gap-1">
                      {getCapabilityIcon(cap)}
                      {cap}
                    </span>) : (stryCov_9fa48("111"), model.capabilities.slice(0, 4).map(stryMutAct_9fa48("112") ? () => undefined : (stryCov_9fa48("112"), cap => <span key={cap} className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-400 flex items-center gap-1">
                      {getCapabilityIcon(cap)}
                      {cap}
                    </span>)))}
                  {stryMutAct_9fa48("115") ? model.capabilities.length > 4 || <span className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-500">
                      +{model.capabilities.length - 4} more
                    </span> : stryMutAct_9fa48("114") ? false : stryMutAct_9fa48("113") ? true : (stryCov_9fa48("113", "114", "115"), (stryMutAct_9fa48("118") ? model.capabilities.length <= 4 : stryMutAct_9fa48("117") ? model.capabilities.length >= 4 : stryMutAct_9fa48("116") ? true : (stryCov_9fa48("116", "117", "118"), model.capabilities.length > 4)) && <span className="px-2 py-0.5 rounded bg-slate-700/50 text-xs text-slate-500">
                      +{stryMutAct_9fa48("119") ? model.capabilities.length + 4 : (stryCov_9fa48("119"), model.capabilities.length - 4)} more
                    </span>)}
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-1 ml-4">
                <div className="flex items-center gap-2">
                  {getSpeedIcon(model.speed)}
                  <span className={`text-xs px-2 py-0.5 rounded ${getQualityBadge(model.quality)}`}>
                    {model.quality}
                  </span>
                </div>
                <span className="text-xs text-slate-500">{model.contextLength.toLocaleString()} ctx</span>
                <span className="text-xs text-slate-500">{model.memoryRequired}</span>
              </div>
            </div>
          </button>))}
        
        {stryMutAct_9fa48("123") ? filteredModels.length === 0 || <div className="px-6 py-8 text-center text-slate-400">
            No models found matching your criteria
          </div> : stryMutAct_9fa48("122") ? false : stryMutAct_9fa48("121") ? true : (stryCov_9fa48("121", "122", "123"), (stryMutAct_9fa48("125") ? filteredModels.length !== 0 : stryMutAct_9fa48("124") ? true : (stryCov_9fa48("124", "125"), filteredModels.length === 0)) && <div className="px-6 py-8 text-center text-slate-400">
            No models found matching your criteria
          </div>)}
      </div>
    </div>;
};

// =============================================================================
// COMPACT MODEL SWITCHER (Inline/Dropdown)
// =============================================================================

interface CompactModelSwitcherProps {
  currentModel: string;
  onModelChange: (modelId: string) => void;
  agentCode?: string;
}
export const CompactModelSwitcher: React.FC<CompactModelSwitcherProps> = ({
  currentModel,
  onModelChange,
  agentCode
}) => {
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("127") ? true : (stryCov_9fa48("127"), false));
  const currentModelData = getModel(currentModel);
  const models = agentCode ? getRecommendedModels(agentCode) : stryMutAct_9fa48("128") ? getAvailableModels() : (stryCov_9fa48("128"), getAvailableModels().slice(0, 10));
  return <div className="relative">
      <button onClick={stryMutAct_9fa48("129") ? () => undefined : (stryCov_9fa48("129"), () => setIsOpen(stryMutAct_9fa48("130") ? isOpen : (stryCov_9fa48("130"), !isOpen)))} className="flex items-center gap-2 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 hover:bg-slate-700 transition-colors">
        <Cpu size={16} className="text-cyan-400" />
        <span className="text-sm text-white">{stryMutAct_9fa48("133") ? currentModelData?.name && currentModel : stryMutAct_9fa48("132") ? false : stryMutAct_9fa48("131") ? true : (stryCov_9fa48("131", "132", "133"), (stryMutAct_9fa48("134") ? currentModelData.name : (stryCov_9fa48("134"), currentModelData?.name)) || currentModel)}</span>
        <ChevronDown size={14} className={`text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>
      
      {stryMutAct_9fa48("140") ? isOpen || <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {models.map(model => <button key={model.id} onClick={() => {
            onModelChange(model.id);
            setIsOpen(false);
          }} className={`
                    w-full px-4 py-2 text-left flex items-center justify-between
                    ${currentModel === model.id ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-slate-700'}
                  `}>
                  <div>
                    <span className="text-sm font-medium">{model.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{model.size}</span>
                  </div>
                  {currentModel === model.id && <Check size={14} />}
                </button>)}
            </div>
          </div>
        </> : stryMutAct_9fa48("139") ? false : stryMutAct_9fa48("138") ? true : (stryCov_9fa48("138", "139", "140"), isOpen && <>
          <div className="fixed inset-0 z-40" onClick={stryMutAct_9fa48("141") ? () => undefined : (stryCov_9fa48("141"), () => setIsOpen(stryMutAct_9fa48("142") ? true : (stryCov_9fa48("142"), false)))} />
          <div className="absolute top-full left-0 mt-1 w-64 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
            <div className="max-h-64 overflow-y-auto">
              {models.map(stryMutAct_9fa48("143") ? () => undefined : (stryCov_9fa48("143"), model => <button key={model.id} onClick={() => {
            onModelChange(model.id);
            setIsOpen(stryMutAct_9fa48("145") ? true : (stryCov_9fa48("145"), false));
          }} className={`
                    w-full px-4 py-2 text-left flex items-center justify-between
                    ${(stryMutAct_9fa48("149") ? currentModel !== model.id : stryMutAct_9fa48("148") ? false : stryMutAct_9fa48("147") ? true : (stryCov_9fa48("147", "148", "149"), currentModel === model.id)) ? 'bg-cyan-500/10 text-cyan-400' : 'text-slate-300 hover:bg-slate-700'}
                  `}>
                  <div>
                    <span className="text-sm font-medium">{model.name}</span>
                    <span className="text-xs text-slate-500 ml-2">{model.size}</span>
                  </div>
                  {stryMutAct_9fa48("154") ? currentModel === model.id || <Check size={14} /> : stryMutAct_9fa48("153") ? false : stryMutAct_9fa48("152") ? true : (stryCov_9fa48("152", "153", "154"), (stryMutAct_9fa48("156") ? currentModel !== model.id : stryMutAct_9fa48("155") ? true : (stryCov_9fa48("155", "156"), currentModel === model.id)) && <Check size={14} />)}
                </button>))}
            </div>
          </div>
        </>)}
    </div>;
};

// =============================================================================
// GLOBAL MODEL SETTINGS PANEL
// For system-wide model configuration
// =============================================================================

interface GlobalModelSettingsProps {
  defaultModel: string;
  onDefaultChange: (modelId: string) => void;
  agentModels: Record<string, string>;
  onAgentModelChange: (agentCode: string, modelId: string) => void;
}
export const GlobalModelSettings: React.FC<GlobalModelSettingsProps> = ({
  defaultModel,
  onDefaultChange,
  agentModels,
  onAgentModelChange
}) => {
  const [activeTab, setActiveTab] = useState<'default' | 'agents'>('default');
  const defaultModelData = getModel(defaultModel);
  const allModels = getAvailableModels();
  return <div className="bg-slate-900/50 rounded-xl border border-slate-700/50">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-700/50">
        <h3 className="text-lg font-semibold text-white flex items-center gap-2">
          <Settings size={20} className="text-cyan-400" />
          Global Model Settings
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Configure AI models for the entire platform
        </p>
      </div>
      
      {/* Tabs */}
      <div className="px-6 py-3 border-b border-slate-700/50 flex gap-4">
        <button onClick={stryMutAct_9fa48("159") ? () => undefined : (stryCov_9fa48("159"), () => setActiveTab('default'))} className={`text-sm font-medium ${(stryMutAct_9fa48("164") ? activeTab !== 'default' : stryMutAct_9fa48("163") ? false : stryMutAct_9fa48("162") ? true : (stryCov_9fa48("162", "163", "164"), activeTab === 'default')) ? 'text-cyan-400' : 'text-slate-400'}`}>
          Default Model
        </button>
        <button onClick={stryMutAct_9fa48("168") ? () => undefined : (stryCov_9fa48("168"), () => setActiveTab('agents'))} className={`text-sm font-medium ${(stryMutAct_9fa48("173") ? activeTab !== 'agents' : stryMutAct_9fa48("172") ? false : stryMutAct_9fa48("171") ? true : (stryCov_9fa48("171", "172", "173"), activeTab === 'agents')) ? 'text-cyan-400' : 'text-slate-400'}`}>
          Agent Models
        </button>
      </div>
      
      {/* Content */}
      <div className="p-6">
        {stryMutAct_9fa48("179") ? activeTab === 'default' || <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">System Default</p>
                  <p className="text-sm text-slate-400">{defaultModelData?.name || defaultModel}</p>
                </div>
                <CompactModelSwitcher currentModel={defaultModel} onModelChange={onDefaultChange} />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Info size={16} className="text-amber-400 mt-0.5" />
              <p className="text-sm text-amber-300/80">
                The default model is used when no specific model is assigned to an agent or service.
              </p>
            </div>
          </div> : stryMutAct_9fa48("178") ? false : stryMutAct_9fa48("177") ? true : (stryCov_9fa48("177", "178", "179"), (stryMutAct_9fa48("181") ? activeTab !== 'default' : stryMutAct_9fa48("180") ? true : (stryCov_9fa48("180", "181"), activeTab === 'default')) && <div className="space-y-4">
            <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-white">System Default</p>
                  <p className="text-sm text-slate-400">{stryMutAct_9fa48("185") ? defaultModelData?.name && defaultModel : stryMutAct_9fa48("184") ? false : stryMutAct_9fa48("183") ? true : (stryCov_9fa48("183", "184", "185"), (stryMutAct_9fa48("186") ? defaultModelData.name : (stryCov_9fa48("186"), defaultModelData?.name)) || defaultModel)}</p>
                </div>
                <CompactModelSwitcher currentModel={defaultModel} onModelChange={onDefaultChange} />
              </div>
            </div>
            
            <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Info size={16} className="text-amber-400 mt-0.5" />
              <p className="text-sm text-amber-300/80">
                The default model is used when no specific model is assigned to an agent or service.
              </p>
            </div>
          </div>)}
        
        {stryMutAct_9fa48("189") ? activeTab === 'agents' || <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(agentModels).map(([agentCode, modelId]) => <div key={agentCode} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="text-sm font-medium text-white capitalize">{agentCode}</span>
                <CompactModelSwitcher currentModel={modelId} onModelChange={newModel => onAgentModelChange(agentCode, newModel)} agentCode={agentCode} />
              </div>)}
          </div> : stryMutAct_9fa48("188") ? false : stryMutAct_9fa48("187") ? true : (stryCov_9fa48("187", "188", "189"), (stryMutAct_9fa48("191") ? activeTab !== 'agents' : stryMutAct_9fa48("190") ? true : (stryCov_9fa48("190", "191"), activeTab === 'agents')) && <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(agentModels).map(stryMutAct_9fa48("193") ? () => undefined : (stryCov_9fa48("193"), ([agentCode, modelId]) => <div key={agentCode} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50 border border-slate-700/50">
                <span className="text-sm font-medium text-white capitalize">{agentCode}</span>
                <CompactModelSwitcher currentModel={modelId} onModelChange={stryMutAct_9fa48("194") ? () => undefined : (stryCov_9fa48("194"), newModel => onAgentModelChange(agentCode, newModel))} agentCode={agentCode} />
              </div>))}
          </div>)}
      </div>
    </div>;
};
export default ModelSwitcher;