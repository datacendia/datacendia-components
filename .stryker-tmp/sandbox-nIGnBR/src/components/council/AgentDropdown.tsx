// @ts-nocheck
// =============================================================================
// AI AGENTS DROPDOWN SELECTOR
// Detailed dropdown list for selecting AI agents on the Council page
// Enterprise Platinum Ready
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
import { ChevronDown, Check, Search, Users, Zap, Shield, Brain, TrendingUp, Database, Scale, Target } from 'lucide-react';
import { cn } from '../../../lib/utils';

// Agent category definitions
const AGENT_CATEGORIES = {
  'Executive': {
    icon: Users,
    color: '#6366F1',
    description: 'C-Suite strategic advisors'
  },
  'Financial': {
    icon: TrendingUp,
    color: '#10B981',
    description: 'Financial analysis & planning'
  },
  'Operations': {
    icon: Target,
    color: '#F59E0B',
    description: 'Operational excellence'
  },
  'Technology': {
    icon: Database,
    color: '#3B82F6',
    description: 'Technical strategy & security'
  },
  'Risk & Compliance': {
    icon: Shield,
    color: '#EF4444',
    description: 'Risk management & governance'
  },
  'Custom': {
    icon: Brain,
    color: '#8B5CF6',
    description: 'Your custom agents'
  }
} as const;

// Agent interface
interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatar: string;
  color: string;
  status: 'online' | 'offline' | 'busy';
  capabilities?: string[];
  premium?: boolean;
  premiumPrice?: string;
  isCustom?: boolean;
  category?: keyof typeof AGENT_CATEGORIES;
}
interface AgentDropdownProps {
  agents: Agent[];
  selectedAgents: string[];
  onSelectionChange: (agentIds: string[]) => void;
  onSelectAll?: () => void;
  onClearSelection?: () => void;
  className?: string;
  compact?: boolean;
}

// Categorize agents
function categorizeAgents(agents: Agent[]): Record<string, Agent[]> {
  const categories: Record<string, Agent[]> = {};
  for (const agent of agents) {
    // Determine category based on agent code/role
    let category: string;
    if (stryMutAct_9fa48("2794") ? false : stryMutAct_9fa48("2793") ? true : (stryCov_9fa48("2793", "2794"), agent.isCustom)) {
      category = 'Custom';
    } else if (stryMutAct_9fa48("2798") ? false : stryMutAct_9fa48("2797") ? true : (stryCov_9fa48("2797", "2798"), (stryMutAct_9fa48("2799") ? [] : (stryCov_9fa48("2799"), ['chief', 'ceo'])).includes(stryMutAct_9fa48("2802") ? agent.code.toUpperCase() : (stryCov_9fa48("2802"), agent.code.toLowerCase())))) {
      category = 'Executive';
    } else if (stryMutAct_9fa48("2806") ? false : stryMutAct_9fa48("2805") ? true : (stryCov_9fa48("2805", "2806"), (stryMutAct_9fa48("2807") ? [] : (stryCov_9fa48("2807"), ['cfo', 'treasurer', 'finance'])).includes(stryMutAct_9fa48("2811") ? agent.code.toUpperCase() : (stryCov_9fa48("2811"), agent.code.toLowerCase())))) {
      category = 'Financial';
    } else if (stryMutAct_9fa48("2815") ? false : stryMutAct_9fa48("2814") ? true : (stryCov_9fa48("2814", "2815"), (stryMutAct_9fa48("2816") ? [] : (stryCov_9fa48("2816"), ['coo', 'operations', 'supply'])).includes(stryMutAct_9fa48("2820") ? agent.code.toUpperCase() : (stryCov_9fa48("2820"), agent.code.toLowerCase())))) {
      category = 'Operations';
    } else if (stryMutAct_9fa48("2824") ? false : stryMutAct_9fa48("2823") ? true : (stryCov_9fa48("2823", "2824"), (stryMutAct_9fa48("2825") ? [] : (stryCov_9fa48("2825"), ['cto', 'cio', 'ciso', 'tech', 'data'])).includes(stryMutAct_9fa48("2831") ? agent.code.toUpperCase() : (stryCov_9fa48("2831"), agent.code.toLowerCase())))) {
      category = 'Technology';
    } else if (stryMutAct_9fa48("2835") ? false : stryMutAct_9fa48("2834") ? true : (stryCov_9fa48("2834", "2835"), (stryMutAct_9fa48("2836") ? [] : (stryCov_9fa48("2836"), ['risk', 'compliance', 'legal', 'clo'])).includes(stryMutAct_9fa48("2841") ? agent.code.toUpperCase() : (stryCov_9fa48("2841"), agent.code.toLowerCase())))) {
      category = 'Risk & Compliance';
    } else {
      category = 'Executive';
    }
    if (stryMutAct_9fa48("2848") ? false : stryMutAct_9fa48("2847") ? true : stryMutAct_9fa48("2846") ? categories[category] : (stryCov_9fa48("2846", "2847", "2848"), !categories[category])) {
      categories[category] = stryMutAct_9fa48("2850") ? ["Stryker was here"] : (stryCov_9fa48("2850"), []);
    }
    categories[category].push(agent);
  }
  return categories;
}
export function AgentDropdown({
  agents,
  selectedAgents,
  onSelectionChange,
  onSelectAll,
  onClearSelection,
  className,
  compact = stryMutAct_9fa48("2851") ? true : (stryCov_9fa48("2851"), false)
}: AgentDropdownProps) {
  const [isOpen, setIsOpen] = useState(stryMutAct_9fa48("2853") ? true : (stryCov_9fa48("2853"), false));
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(Object.keys(AGENT_CATEGORIES)));
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (stryMutAct_9fa48("2859") ? dropdownRef.current || !dropdownRef.current.contains(event.target as Node) : stryMutAct_9fa48("2858") ? false : stryMutAct_9fa48("2857") ? true : (stryCov_9fa48("2857", "2858", "2859"), dropdownRef.current && (stryMutAct_9fa48("2860") ? dropdownRef.current.contains(event.target as Node) : (stryCov_9fa48("2860"), !dropdownRef.current.contains(event.target as Node))))) {
        setIsOpen(stryMutAct_9fa48("2862") ? true : (stryCov_9fa48("2862"), false));
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return stryMutAct_9fa48("2864") ? () => undefined : (stryCov_9fa48("2864"), () => document.removeEventListener('mousedown', handleClickOutside));
  }, stryMutAct_9fa48("2866") ? ["Stryker was here"] : (stryCov_9fa48("2866"), []));

  // Filter agents by search
  const filteredAgents = stryMutAct_9fa48("2867") ? agents : (stryCov_9fa48("2867"), agents.filter(stryMutAct_9fa48("2868") ? () => undefined : (stryCov_9fa48("2868"), agent => stryMutAct_9fa48("2871") ? (agent.name.toLowerCase().includes(searchQuery.toLowerCase()) || agent.role.toLowerCase().includes(searchQuery.toLowerCase())) && agent.description.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("2870") ? false : stryMutAct_9fa48("2869") ? true : (stryCov_9fa48("2869", "2870", "2871"), (stryMutAct_9fa48("2873") ? agent.name.toLowerCase().includes(searchQuery.toLowerCase()) && agent.role.toLowerCase().includes(searchQuery.toLowerCase()) : stryMutAct_9fa48("2872") ? false : (stryCov_9fa48("2872", "2873"), (stryMutAct_9fa48("2874") ? agent.name.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("2874"), agent.name.toLowerCase().includes(stryMutAct_9fa48("2875") ? searchQuery.toUpperCase() : (stryCov_9fa48("2875"), searchQuery.toLowerCase())))) || (stryMutAct_9fa48("2876") ? agent.role.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("2876"), agent.role.toLowerCase().includes(stryMutAct_9fa48("2877") ? searchQuery.toUpperCase() : (stryCov_9fa48("2877"), searchQuery.toLowerCase())))))) || (stryMutAct_9fa48("2878") ? agent.description.toUpperCase().includes(searchQuery.toLowerCase()) : (stryCov_9fa48("2878"), agent.description.toLowerCase().includes(stryMutAct_9fa48("2879") ? searchQuery.toUpperCase() : (stryCov_9fa48("2879"), searchQuery.toLowerCase()))))))));

  // Categorize filtered agents
  const categorizedAgents = categorizeAgents(filteredAgents);

  // Toggle agent selection
  const toggleAgent = (agentId: string) => {
    if (stryMutAct_9fa48("2882") ? false : stryMutAct_9fa48("2881") ? true : (stryCov_9fa48("2881", "2882"), selectedAgents.includes(agentId))) {
      onSelectionChange(stryMutAct_9fa48("2884") ? selectedAgents : (stryCov_9fa48("2884"), selectedAgents.filter(stryMutAct_9fa48("2885") ? () => undefined : (stryCov_9fa48("2885"), id => stryMutAct_9fa48("2888") ? id === agentId : stryMutAct_9fa48("2887") ? false : stryMutAct_9fa48("2886") ? true : (stryCov_9fa48("2886", "2887", "2888"), id !== agentId)))));
    } else {
      onSelectionChange(stryMutAct_9fa48("2890") ? [] : (stryCov_9fa48("2890"), [...selectedAgents, agentId]));
    }
  };

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    const newExpanded = new Set(expandedCategories);
    if (stryMutAct_9fa48("2893") ? false : stryMutAct_9fa48("2892") ? true : (stryCov_9fa48("2892", "2893"), newExpanded.has(category))) {
      newExpanded.delete(category);
    } else {
      newExpanded.add(category);
    }
    setExpandedCategories(newExpanded);
  };

  // Select all agents in category
  const selectCategory = (category: string) => {
    const categoryAgentIds = stryMutAct_9fa48("2899") ? categorizedAgents[category]?.filter(a => a.status === 'online').map(a => a.id) && [] : stryMutAct_9fa48("2898") ? false : stryMutAct_9fa48("2897") ? true : (stryCov_9fa48("2897", "2898", "2899"), (stryMutAct_9fa48("2901") ? categorizedAgents[category].filter(a => a.status === 'online').map(a => a.id) : stryMutAct_9fa48("2900") ? categorizedAgents[category].map(a => a.id) : (stryCov_9fa48("2900", "2901"), categorizedAgents[category]?.filter(stryMutAct_9fa48("2902") ? () => undefined : (stryCov_9fa48("2902"), a => stryMutAct_9fa48("2905") ? a.status !== 'online' : stryMutAct_9fa48("2904") ? false : stryMutAct_9fa48("2903") ? true : (stryCov_9fa48("2903", "2904", "2905"), a.status === 'online'))).map(stryMutAct_9fa48("2907") ? () => undefined : (stryCov_9fa48("2907"), a => a.id)))) || (stryMutAct_9fa48("2908") ? ["Stryker was here"] : (stryCov_9fa48("2908"), [])));
    const newSelection = new Set(stryMutAct_9fa48("2909") ? [] : (stryCov_9fa48("2909"), [...selectedAgents, ...categoryAgentIds]));
    onSelectionChange(Array.from(newSelection));
  };

  // Get selected agents display
  const selectedAgentsList = stryMutAct_9fa48("2910") ? agents : (stryCov_9fa48("2910"), agents.filter(stryMutAct_9fa48("2911") ? () => undefined : (stryCov_9fa48("2911"), a => selectedAgents.includes(a.id))));
  const onlineCount = stryMutAct_9fa48("2912") ? agents.length : (stryCov_9fa48("2912"), agents.filter(stryMutAct_9fa48("2913") ? () => undefined : (stryCov_9fa48("2913"), a => stryMutAct_9fa48("2916") ? a.status !== 'online' : stryMutAct_9fa48("2915") ? false : stryMutAct_9fa48("2914") ? true : (stryCov_9fa48("2914", "2915", "2916"), a.status === 'online'))).length);
  return <div className={cn("relative", className)} ref={dropdownRef}>
      {/* Trigger Button */}
      <button onClick={stryMutAct_9fa48("2919") ? () => undefined : (stryCov_9fa48("2919"), () => setIsOpen(stryMutAct_9fa48("2920") ? isOpen : (stryCov_9fa48("2920"), !isOpen)))} className={cn("flex items-center gap-2 px-4 py-2 rounded-lg border transition-all", isOpen ? "bg-white border-primary-300 ring-2 ring-primary-100" : "bg-white border-neutral-200 hover:border-neutral-300", stryMutAct_9fa48("2926") ? compact || "px-3 py-1.5" : stryMutAct_9fa48("2925") ? false : stryMutAct_9fa48("2924") ? true : (stryCov_9fa48("2924", "2925", "2926"), compact && "px-3 py-1.5"))}>
        {/* Selected agents avatars */}
        {(stryMutAct_9fa48("2931") ? selectedAgentsList.length <= 0 : stryMutAct_9fa48("2930") ? selectedAgentsList.length >= 0 : stryMutAct_9fa48("2929") ? false : stryMutAct_9fa48("2928") ? true : (stryCov_9fa48("2928", "2929", "2930", "2931"), selectedAgentsList.length > 0)) ? <div className="flex -space-x-1.5">
            {stryMutAct_9fa48("2932") ? selectedAgentsList.map(agent => <div key={agent.id} className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white" style={{
          backgroundColor: agent.color
        }} title={agent.name}>
                {agent.avatar}
              </div>) : (stryCov_9fa48("2932"), selectedAgentsList.slice(0, 4).map(stryMutAct_9fa48("2933") ? () => undefined : (stryCov_9fa48("2933"), agent => <div key={agent.id} className="w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 border-white" style={stryMutAct_9fa48("2934") ? {} : (stryCov_9fa48("2934"), {
          backgroundColor: agent.color
        })} title={agent.name}>
                {agent.avatar}
              </div>)))}
            {stryMutAct_9fa48("2937") ? selectedAgentsList.length > 4 || <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs border-2 border-white text-neutral-600">
                +{selectedAgentsList.length - 4}
              </div> : stryMutAct_9fa48("2936") ? false : stryMutAct_9fa48("2935") ? true : (stryCov_9fa48("2935", "2936", "2937"), (stryMutAct_9fa48("2940") ? selectedAgentsList.length <= 4 : stryMutAct_9fa48("2939") ? selectedAgentsList.length >= 4 : stryMutAct_9fa48("2938") ? true : (stryCov_9fa48("2938", "2939", "2940"), selectedAgentsList.length > 4)) && <div className="w-6 h-6 rounded-full bg-neutral-200 flex items-center justify-center text-xs border-2 border-white text-neutral-600">
                +{stryMutAct_9fa48("2941") ? selectedAgentsList.length + 4 : (stryCov_9fa48("2941"), selectedAgentsList.length - 4)}
              </div>)}
          </div> : <Users className="w-4 h-4 text-neutral-400" />}
        
        <span className={cn("font-medium text-neutral-700", stryMutAct_9fa48("2945") ? compact || "text-sm" : stryMutAct_9fa48("2944") ? false : stryMutAct_9fa48("2943") ? true : (stryCov_9fa48("2943", "2944", "2945"), compact && "text-sm"))}>
          {(stryMutAct_9fa48("2949") ? selectedAgents.length !== 0 : stryMutAct_9fa48("2948") ? false : stryMutAct_9fa48("2947") ? true : (stryCov_9fa48("2947", "2948", "2949"), selectedAgents.length === 0)) ? 'All Agents' : `${selectedAgents.length} Agent${(stryMutAct_9fa48("2954") ? selectedAgents.length === 1 : stryMutAct_9fa48("2953") ? false : stryMutAct_9fa48("2952") ? true : (stryCov_9fa48("2952", "2953", "2954"), selectedAgents.length !== 1)) ? 's' : ''}`}
        </span>
        
        <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", stryMutAct_9fa48("2960") ? isOpen || "rotate-180" : stryMutAct_9fa48("2959") ? false : stryMutAct_9fa48("2958") ? true : (stryCov_9fa48("2958", "2959", "2960"), isOpen && "rotate-180"))} />
      </button>

      {/* Dropdown Menu */}
      {stryMutAct_9fa48("2964") ? isOpen || <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl border border-neutral-200 shadow-xl z-50 max-h-[480px] overflow-hidden flex flex-col">
          {/* Search Header */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Search agents..." className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300" />
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => {
            const onlineIds = agents.filter(a => a.status === 'online').map(a => a.id);
            onSelectionChange(onlineIds);
          }} className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded hover:bg-primary-100 transition-colors">
                Select All Online ({onlineCount})
              </button>
              <button onClick={() => onSelectionChange([])} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200 transition-colors">
                Clear Selection
              </button>
            </div>
          </div>

          {/* Agent Categories */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(AGENT_CATEGORIES).map(([categoryName, categoryInfo]) => {
          const categoryAgents = categorizedAgents[categoryName] || [];
          if (categoryAgents.length === 0) {
            return null;
          }
          const Icon = categoryInfo.icon;
          const isExpanded = expandedCategories.has(categoryName);
          const selectedInCategory = categoryAgents.filter(a => selectedAgents.includes(a.id)).length;
          const onlineInCategory = categoryAgents.filter(a => a.status === 'online').length;
          return <div key={categoryName} className="border-b border-neutral-100 last:border-b-0">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors" onClick={() => toggleCategory(categoryName)}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{
                  backgroundColor: `${categoryInfo.color}15`
                }}>
                        <Icon className="w-4 h-4" style={{
                    color: categoryInfo.color
                  }} />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">{categoryName}</div>
                        <div className="text-xs text-neutral-500">{categoryInfo.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-white rounded-full text-neutral-600 border border-neutral-200">
                        {selectedInCategory}/{categoryAgents.length}
                      </span>
                      <button onClick={e => {
                  e.stopPropagation();
                  selectCategory(categoryName);
                }} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded hover:bg-primary-100">
                        All
                      </button>
                      <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", isExpanded && "rotate-180")} />
                    </div>
                  </div>

                  {/* Category Agents */}
                  {isExpanded && <div className="p-2 space-y-1">
                      {categoryAgents.map(agent => {
                const isSelected = selectedAgents.includes(agent.id);
                const isOnline = agent.status === 'online';
                return <div key={agent.id} onClick={() => isOnline && toggleAgent(agent.id)} className={cn("flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all", isSelected ? "bg-primary-50 border border-primary-200" : "hover:bg-neutral-50 border border-transparent", !isOnline && "opacity-50 cursor-not-allowed")}>
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{
                      backgroundColor: `${agent.color}20`
                    }}>
                                {agent.avatar}
                              </div>
                              <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white", isOnline ? "bg-green-500" : "bg-neutral-300")} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-800 text-sm truncate">
                                  {agent.name}
                                </span>
                                {agent.premium && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                    PRO
                                  </span>}
                              </div>
                              <div className="text-xs text-neutral-500 truncate">{agent.role}</div>
                              {agent.capabilities && agent.capabilities.length > 0 && <div className="flex flex-wrap gap-1 mt-1">
                                  {agent.capabilities.slice(0, 2).map((cap, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                                      {cap.replace(/_/g, ' ')}
                                    </span>)}
                                  {agent.capabilities.length > 2 && <span className="text-[10px] text-neutral-400">
                                      +{agent.capabilities.length - 2}
                                    </span>}
                                </div>}
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isSelected ? "bg-primary-500 border-primary-500" : "border-neutral-300")}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>;
              })}
                    </div>}
                </div>;
        })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-100 bg-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">
                {selectedAgents.length} of {agents.length} agents selected
              </span>
              <button onClick={() => setIsOpen(false)} className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                Done
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("2963") ? false : stryMutAct_9fa48("2962") ? true : (stryCov_9fa48("2962", "2963", "2964"), isOpen && <div className="absolute top-full left-0 mt-2 w-96 bg-white rounded-xl border border-neutral-200 shadow-xl z-50 max-h-[480px] overflow-hidden flex flex-col">
          {/* Search Header */}
          <div className="p-3 border-b border-neutral-100 bg-neutral-50">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
              <input type="text" value={searchQuery} onChange={stryMutAct_9fa48("2965") ? () => undefined : (stryCov_9fa48("2965"), e => setSearchQuery(e.target.value))} placeholder="Search agents..." className="w-full pl-9 pr-4 py-2 text-sm border border-neutral-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-100 focus:border-primary-300" />
            </div>
            
            {/* Quick Actions */}
            <div className="flex items-center gap-2 mt-2">
              <button onClick={() => {
            const onlineIds = stryMutAct_9fa48("2967") ? agents.map(a => a.id) : (stryCov_9fa48("2967"), agents.filter(stryMutAct_9fa48("2968") ? () => undefined : (stryCov_9fa48("2968"), a => stryMutAct_9fa48("2971") ? a.status !== 'online' : stryMutAct_9fa48("2970") ? false : stryMutAct_9fa48("2969") ? true : (stryCov_9fa48("2969", "2970", "2971"), a.status === 'online'))).map(stryMutAct_9fa48("2973") ? () => undefined : (stryCov_9fa48("2973"), a => a.id)));
            onSelectionChange(onlineIds);
          }} className="text-xs px-2 py-1 bg-primary-50 text-primary-600 rounded hover:bg-primary-100 transition-colors">
                Select All Online ({onlineCount})
              </button>
              <button onClick={stryMutAct_9fa48("2974") ? () => undefined : (stryCov_9fa48("2974"), () => onSelectionChange(stryMutAct_9fa48("2975") ? ["Stryker was here"] : (stryCov_9fa48("2975"), [])))} className="text-xs px-2 py-1 bg-neutral-100 text-neutral-600 rounded hover:bg-neutral-200 transition-colors">
                Clear Selection
              </button>
            </div>
          </div>

          {/* Agent Categories */}
          <div className="flex-1 overflow-y-auto">
            {Object.entries(AGENT_CATEGORIES).map(([categoryName, categoryInfo]) => {
          const categoryAgents = stryMutAct_9fa48("2979") ? categorizedAgents[categoryName] && [] : stryMutAct_9fa48("2978") ? false : stryMutAct_9fa48("2977") ? true : (stryCov_9fa48("2977", "2978", "2979"), categorizedAgents[categoryName] || (stryMutAct_9fa48("2980") ? ["Stryker was here"] : (stryCov_9fa48("2980"), [])));
          if (stryMutAct_9fa48("2983") ? categoryAgents.length !== 0 : stryMutAct_9fa48("2982") ? false : stryMutAct_9fa48("2981") ? true : (stryCov_9fa48("2981", "2982", "2983"), categoryAgents.length === 0)) {
            return null;
          }
          const Icon = categoryInfo.icon;
          const isExpanded = expandedCategories.has(categoryName);
          const selectedInCategory = stryMutAct_9fa48("2985") ? categoryAgents.length : (stryCov_9fa48("2985"), categoryAgents.filter(stryMutAct_9fa48("2986") ? () => undefined : (stryCov_9fa48("2986"), a => selectedAgents.includes(a.id))).length);
          const onlineInCategory = stryMutAct_9fa48("2987") ? categoryAgents.length : (stryCov_9fa48("2987"), categoryAgents.filter(stryMutAct_9fa48("2988") ? () => undefined : (stryCov_9fa48("2988"), a => stryMutAct_9fa48("2991") ? a.status !== 'online' : stryMutAct_9fa48("2990") ? false : stryMutAct_9fa48("2989") ? true : (stryCov_9fa48("2989", "2990", "2991"), a.status === 'online'))).length);
          return <div key={categoryName} className="border-b border-neutral-100 last:border-b-0">
                  {/* Category Header */}
                  <div className="flex items-center justify-between px-4 py-3 bg-neutral-50 cursor-pointer hover:bg-neutral-100 transition-colors" onClick={stryMutAct_9fa48("2993") ? () => undefined : (stryCov_9fa48("2993"), () => toggleCategory(categoryName))}>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={stryMutAct_9fa48("2994") ? {} : (stryCov_9fa48("2994"), {
                  backgroundColor: `${categoryInfo.color}15`
                })}>
                        <Icon className="w-4 h-4" style={stryMutAct_9fa48("2996") ? {} : (stryCov_9fa48("2996"), {
                    color: categoryInfo.color
                  })} />
                      </div>
                      <div>
                        <div className="font-semibold text-neutral-800 text-sm">{categoryName}</div>
                        <div className="text-xs text-neutral-500">{categoryInfo.description}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs px-2 py-0.5 bg-white rounded-full text-neutral-600 border border-neutral-200">
                        {selectedInCategory}/{categoryAgents.length}
                      </span>
                      <button onClick={e => {
                  e.stopPropagation();
                  selectCategory(categoryName);
                }} className="text-xs px-2 py-0.5 bg-primary-50 text-primary-600 rounded hover:bg-primary-100">
                        All
                      </button>
                      <ChevronDown className={cn("w-4 h-4 text-neutral-400 transition-transform", stryMutAct_9fa48("3001") ? isExpanded || "rotate-180" : stryMutAct_9fa48("3000") ? false : stryMutAct_9fa48("2999") ? true : (stryCov_9fa48("2999", "3000", "3001"), isExpanded && "rotate-180"))} />
                    </div>
                  </div>

                  {/* Category Agents */}
                  {stryMutAct_9fa48("3005") ? isExpanded || <div className="p-2 space-y-1">
                      {categoryAgents.map(agent => {
                const isSelected = selectedAgents.includes(agent.id);
                const isOnline = agent.status === 'online';
                return <div key={agent.id} onClick={() => isOnline && toggleAgent(agent.id)} className={cn("flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all", isSelected ? "bg-primary-50 border border-primary-200" : "hover:bg-neutral-50 border border-transparent", !isOnline && "opacity-50 cursor-not-allowed")}>
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={{
                      backgroundColor: `${agent.color}20`
                    }}>
                                {agent.avatar}
                              </div>
                              <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white", isOnline ? "bg-green-500" : "bg-neutral-300")} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-800 text-sm truncate">
                                  {agent.name}
                                </span>
                                {agent.premium && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                    PRO
                                  </span>}
                              </div>
                              <div className="text-xs text-neutral-500 truncate">{agent.role}</div>
                              {agent.capabilities && agent.capabilities.length > 0 && <div className="flex flex-wrap gap-1 mt-1">
                                  {agent.capabilities.slice(0, 2).map((cap, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                                      {cap.replace(/_/g, ' ')}
                                    </span>)}
                                  {agent.capabilities.length > 2 && <span className="text-[10px] text-neutral-400">
                                      +{agent.capabilities.length - 2}
                                    </span>}
                                </div>}
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isSelected ? "bg-primary-500 border-primary-500" : "border-neutral-300")}>
                              {isSelected && <Check className="w-3 h-3 text-white" />}
                            </div>
                          </div>;
              })}
                    </div> : stryMutAct_9fa48("3004") ? false : stryMutAct_9fa48("3003") ? true : (stryCov_9fa48("3003", "3004", "3005"), isExpanded && <div className="p-2 space-y-1">
                      {categoryAgents.map(agent => {
                const isSelected = selectedAgents.includes(agent.id);
                const isOnline = stryMutAct_9fa48("3009") ? agent.status !== 'online' : stryMutAct_9fa48("3008") ? false : stryMutAct_9fa48("3007") ? true : (stryCov_9fa48("3007", "3008", "3009"), agent.status === 'online');
                return <div key={agent.id} onClick={stryMutAct_9fa48("3011") ? () => undefined : (stryCov_9fa48("3011"), () => stryMutAct_9fa48("3014") ? isOnline || toggleAgent(agent.id) : stryMutAct_9fa48("3013") ? false : stryMutAct_9fa48("3012") ? true : (stryCov_9fa48("3012", "3013", "3014"), isOnline && toggleAgent(agent.id)))} className={cn("flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all", isSelected ? "bg-primary-50 border border-primary-200" : "hover:bg-neutral-50 border border-transparent", stryMutAct_9fa48("3020") ? !isOnline || "opacity-50 cursor-not-allowed" : stryMutAct_9fa48("3019") ? false : stryMutAct_9fa48("3018") ? true : (stryCov_9fa48("3018", "3019", "3020"), (stryMutAct_9fa48("3021") ? isOnline : (stryCov_9fa48("3021"), !isOnline)) && "opacity-50 cursor-not-allowed"))}>
                            {/* Avatar */}
                            <div className="relative">
                              <div className="w-10 h-10 rounded-full flex items-center justify-center text-lg" style={stryMutAct_9fa48("3023") ? {} : (stryCov_9fa48("3023"), {
                      backgroundColor: `${agent.color}20`
                    })}>
                                {agent.avatar}
                              </div>
                              <span className={cn("absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white", isOnline ? "bg-green-500" : "bg-neutral-300")} />
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <span className="font-medium text-neutral-800 text-sm truncate">
                                  {agent.name}
                                </span>
                                {stryMutAct_9fa48("3030") ? agent.premium || <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                    PRO
                                  </span> : stryMutAct_9fa48("3029") ? false : stryMutAct_9fa48("3028") ? true : (stryCov_9fa48("3028", "3029", "3030"), agent.premium && <span className="text-[10px] px-1.5 py-0.5 bg-amber-100 text-amber-700 rounded font-medium">
                                    PRO
                                  </span>)}
                              </div>
                              <div className="text-xs text-neutral-500 truncate">{agent.role}</div>
                              {stryMutAct_9fa48("3033") ? agent.capabilities && agent.capabilities.length > 0 || <div className="flex flex-wrap gap-1 mt-1">
                                  {agent.capabilities.slice(0, 2).map((cap, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                                      {cap.replace(/_/g, ' ')}
                                    </span>)}
                                  {agent.capabilities.length > 2 && <span className="text-[10px] text-neutral-400">
                                      +{agent.capabilities.length - 2}
                                    </span>}
                                </div> : stryMutAct_9fa48("3032") ? false : stryMutAct_9fa48("3031") ? true : (stryCov_9fa48("3031", "3032", "3033"), (stryMutAct_9fa48("3035") ? agent.capabilities || agent.capabilities.length > 0 : stryMutAct_9fa48("3034") ? true : (stryCov_9fa48("3034", "3035"), agent.capabilities && (stryMutAct_9fa48("3038") ? agent.capabilities.length <= 0 : stryMutAct_9fa48("3037") ? agent.capabilities.length >= 0 : stryMutAct_9fa48("3036") ? true : (stryCov_9fa48("3036", "3037", "3038"), agent.capabilities.length > 0)))) && <div className="flex flex-wrap gap-1 mt-1">
                                  {stryMutAct_9fa48("3039") ? agent.capabilities.map((cap, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                                      {cap.replace(/_/g, ' ')}
                                    </span>) : (stryCov_9fa48("3039"), agent.capabilities.slice(0, 2).map(stryMutAct_9fa48("3040") ? () => undefined : (stryCov_9fa48("3040"), (cap, i) => <span key={i} className="text-[10px] px-1.5 py-0.5 bg-neutral-100 text-neutral-500 rounded">
                                      {cap.replace(/_/g, ' ')}
                                    </span>)))}
                                  {stryMutAct_9fa48("3044") ? agent.capabilities.length > 2 || <span className="text-[10px] text-neutral-400">
                                      +{agent.capabilities.length - 2}
                                    </span> : stryMutAct_9fa48("3043") ? false : stryMutAct_9fa48("3042") ? true : (stryCov_9fa48("3042", "3043", "3044"), (stryMutAct_9fa48("3047") ? agent.capabilities.length <= 2 : stryMutAct_9fa48("3046") ? agent.capabilities.length >= 2 : stryMutAct_9fa48("3045") ? true : (stryCov_9fa48("3045", "3046", "3047"), agent.capabilities.length > 2)) && <span className="text-[10px] text-neutral-400">
                                      +{stryMutAct_9fa48("3048") ? agent.capabilities.length + 2 : (stryCov_9fa48("3048"), agent.capabilities.length - 2)}
                                    </span>)}
                                </div>)}
                            </div>

                            {/* Selection Indicator */}
                            <div className={cn("w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all", isSelected ? "bg-primary-500 border-primary-500" : "border-neutral-300")}>
                              {stryMutAct_9fa48("3054") ? isSelected || <Check className="w-3 h-3 text-white" /> : stryMutAct_9fa48("3053") ? false : stryMutAct_9fa48("3052") ? true : (stryCov_9fa48("3052", "3053", "3054"), isSelected && <Check className="w-3 h-3 text-white" />)}
                            </div>
                          </div>;
              })}
                    </div>)}
                </div>;
        })}
          </div>

          {/* Footer */}
          <div className="p-3 border-t border-neutral-100 bg-neutral-50">
            <div className="flex items-center justify-between text-sm">
              <span className="text-neutral-500">
                {selectedAgents.length} of {agents.length} agents selected
              </span>
              <button onClick={stryMutAct_9fa48("3055") ? () => undefined : (stryCov_9fa48("3055"), () => setIsOpen(stryMutAct_9fa48("3056") ? true : (stryCov_9fa48("3056"), false)))} className="px-3 py-1.5 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors font-medium">
                Done
              </button>
            </div>
          </div>
        </div>)}
    </div>;
}

// Compact version for inline use
export function AgentDropdownCompact({
  agents,
  selectedAgents,
  onSelectionChange
}: Omit<AgentDropdownProps, 'compact'>) {
  return <AgentDropdown agents={agents} selectedAgents={selectedAgents} onSelectionChange={onSelectionChange} compact={stryMutAct_9fa48("3058") ? false : (stryCov_9fa48("3058"), true)} />;
}
export default AgentDropdown;