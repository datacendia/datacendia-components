/**
 * CrossModuleActions Component
 * 
 * Displays cross-module integration pathways and actions.
 * Makes the "moat" of module integration visible to users.
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
import React from 'react';
interface CrossModuleAction {
  id: string;
  fromModule: string;
  toModule: string;
  action: string;
  description: string;
  icon: string;
  color: string;
  onClick?: () => void;
}
interface CrossModuleActionsProps {
  currentModule: string;
  context?: {
    decisionId?: string;
    simulationId?: string;
    artifactId?: string;
    assessmentId?: string;
  };
  variant?: 'inline' | 'panel' | 'floating';
  onAction?: (action: CrossModuleAction) => void;
}

// Define all cross-module integration pathways
const MODULE_INTEGRATIONS: Record<string, CrossModuleAction[]> = stryMutAct_9fa48("799") ? {} : (stryCov_9fa48("799"), {
  council: stryMutAct_9fa48("800") ? [] : (stryCov_9fa48("800"), [stryMutAct_9fa48("801") ? {} : (stryCov_9fa48("801"), {
    id: 'council-to-dna',
    fromModule: 'council',
    toModule: 'decision-dna',
    action: 'Log to Decision DNA',
    description: 'Track this deliberation in your decision history',
    icon: '🧬',
    color: 'emerald'
  }), stryMutAct_9fa48("809") ? {} : (stryCov_9fa48("809"), {
    id: 'council-to-crucible',
    fromModule: 'council',
    toModule: 'crucible',
    action: 'Stress Test Decision',
    description: 'Run simulations on this recommendation',
    icon: '🔥',
    color: 'orange'
  }), stryMutAct_9fa48("817") ? {} : (stryCov_9fa48("817"), {
    id: 'council-to-vox',
    fromModule: 'council',
    toModule: 'vox',
    action: 'Run Stakeholder Assembly',
    description: 'Get stakeholder perspectives on this decision',
    icon: '🗣️',
    color: 'cyan'
  }), stryMutAct_9fa48("825") ? {} : (stryCov_9fa48("825"), {
    id: 'council-to-eternal',
    fromModule: 'council',
    toModule: 'eternal',
    action: 'Archive for Posterity',
    description: 'Preserve this decision for future reference',
    icon: '📜',
    color: 'amber'
  })]),
  'decision-dna': stryMutAct_9fa48("833") ? [] : (stryCov_9fa48("833"), [stryMutAct_9fa48("834") ? {} : (stryCov_9fa48("834"), {
    id: 'dna-to-council',
    fromModule: 'decision-dna',
    toModule: 'council',
    action: 'Re-deliberate',
    description: 'Open a new Council session on this decision',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("842") ? {} : (stryCov_9fa48("842"), {
    id: 'dna-to-chronos',
    fromModule: 'decision-dna',
    toModule: 'chronos',
    action: 'View in Timeline',
    description: 'See this decision in historical context',
    icon: '⏰',
    color: 'blue'
  }), stryMutAct_9fa48("850") ? {} : (stryCov_9fa48("850"), {
    id: 'dna-to-crucible',
    fromModule: 'decision-dna',
    toModule: 'crucible',
    action: 'What-If Analysis',
    description: 'Simulate alternative outcomes',
    icon: '🔥',
    color: 'orange'
  })]),
  crucible: stryMutAct_9fa48("858") ? [] : (stryCov_9fa48("858"), [stryMutAct_9fa48("859") ? {} : (stryCov_9fa48("859"), {
    id: 'crucible-to-council',
    fromModule: 'crucible',
    toModule: 'council',
    action: 'Create Council Briefing',
    description: 'Deliberate on simulation findings',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("867") ? {} : (stryCov_9fa48("867"), {
    id: 'crucible-to-dna',
    fromModule: 'crucible',
    toModule: 'decision-dna',
    action: 'Log Scenario Results',
    description: 'Record simulation outcomes',
    icon: '🧬',
    color: 'emerald'
  }), stryMutAct_9fa48("875") ? {} : (stryCov_9fa48("875"), {
    id: 'crucible-to-vox',
    fromModule: 'crucible',
    toModule: 'vox',
    action: 'Stakeholder Impact',
    description: 'Assess stakeholder impact of scenario',
    icon: '🗣️',
    color: 'cyan'
  })]),
  panopticon: stryMutAct_9fa48("883") ? [] : (stryCov_9fa48("883"), [stryMutAct_9fa48("884") ? {} : (stryCov_9fa48("884"), {
    id: 'panopticon-to-council',
    fromModule: 'panopticon',
    toModule: 'council',
    action: 'Create Council Briefing',
    description: 'Deliberate on regulatory findings',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("892") ? {} : (stryCov_9fa48("892"), {
    id: 'panopticon-to-crucible',
    fromModule: 'panopticon',
    toModule: 'crucible',
    action: 'Launch Stress Test',
    description: 'Simulate regulatory impact',
    icon: '🔥',
    color: 'orange'
  }), stryMutAct_9fa48("900") ? {} : (stryCov_9fa48("900"), {
    id: 'panopticon-to-dna',
    fromModule: 'panopticon',
    toModule: 'decision-dna',
    action: 'Log Assessment',
    description: 'Record regulatory assessment',
    icon: '🧬',
    color: 'emerald'
  })]),
  vox: stryMutAct_9fa48("908") ? [] : (stryCov_9fa48("908"), [stryMutAct_9fa48("909") ? {} : (stryCov_9fa48("909"), {
    id: 'vox-to-council',
    fromModule: 'vox',
    toModule: 'council',
    action: 'Stakeholder Council',
    description: 'Run Council with stakeholder voices',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("917") ? {} : (stryCov_9fa48("917"), {
    id: 'vox-to-dna',
    fromModule: 'vox',
    toModule: 'decision-dna',
    action: 'Log Veto Event',
    description: 'Record stakeholder veto in DNA',
    icon: '🧬',
    color: 'emerald'
  })]),
  chronos: stryMutAct_9fa48("925") ? [] : (stryCov_9fa48("925"), [stryMutAct_9fa48("926") ? {} : (stryCov_9fa48("926"), {
    id: 'chronos-to-council',
    fromModule: 'chronos',
    toModule: 'council',
    action: 'Replay Deliberation',
    description: 'View original Council session',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("934") ? {} : (stryCov_9fa48("934"), {
    id: 'chronos-to-crucible',
    fromModule: 'chronos',
    toModule: 'crucible',
    action: 'What-If from Point',
    description: 'Branch simulation from this moment',
    icon: '🔥',
    color: 'orange'
  })]),
  eternal: stryMutAct_9fa48("942") ? [] : (stryCov_9fa48("942"), [stryMutAct_9fa48("943") ? {} : (stryCov_9fa48("943"), {
    id: 'eternal-to-council',
    fromModule: 'eternal',
    toModule: 'council',
    action: 'Deliberate on Artifact',
    description: 'Discuss archived wisdom',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("951") ? {} : (stryCov_9fa48("951"), {
    id: 'eternal-to-chronos',
    fromModule: 'eternal',
    toModule: 'chronos',
    action: 'View in Timeline',
    description: 'See artifact in historical context',
    icon: '⏰',
    color: 'blue'
  })]),
  symbiont: stryMutAct_9fa48("959") ? [] : (stryCov_9fa48("959"), [stryMutAct_9fa48("960") ? {} : (stryCov_9fa48("960"), {
    id: 'symbiont-to-council',
    fromModule: 'symbiont',
    toModule: 'council',
    action: 'Partner Deliberation',
    description: 'Deliberate on partnership decision',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("968") ? {} : (stryCov_9fa48("968"), {
    id: 'symbiont-to-crucible',
    fromModule: 'symbiont',
    toModule: 'crucible',
    action: 'Stress Test Partnership',
    description: 'Simulate partnership scenarios',
    icon: '🔥',
    color: 'orange'
  })]),
  aegis: stryMutAct_9fa48("976") ? [] : (stryCov_9fa48("976"), [stryMutAct_9fa48("977") ? {} : (stryCov_9fa48("977"), {
    id: 'aegis-to-council',
    fromModule: 'aegis',
    toModule: 'council',
    action: 'Threat Briefing',
    description: 'Deliberate on security threat',
    icon: '⚖️',
    color: 'purple'
  }), stryMutAct_9fa48("985") ? {} : (stryCov_9fa48("985"), {
    id: 'aegis-to-crucible',
    fromModule: 'aegis',
    toModule: 'crucible',
    action: 'Attack Simulation',
    description: 'Simulate threat impact',
    icon: '🔥',
    color: 'orange'
  })])
});
const colorClasses: Record<string, {
  bg: string;
  border: string;
  text: string;
  hover: string;
}> = stryMutAct_9fa48("993") ? {} : (stryCov_9fa48("993"), {
  purple: stryMutAct_9fa48("994") ? {} : (stryCov_9fa48("994"), {
    bg: 'bg-purple-500/10',
    border: 'border-purple-500/30',
    text: 'text-purple-400',
    hover: 'hover:bg-purple-500/20'
  }),
  emerald: stryMutAct_9fa48("999") ? {} : (stryCov_9fa48("999"), {
    bg: 'bg-emerald-500/10',
    border: 'border-emerald-500/30',
    text: 'text-emerald-400',
    hover: 'hover:bg-emerald-500/20'
  }),
  orange: stryMutAct_9fa48("1004") ? {} : (stryCov_9fa48("1004"), {
    bg: 'bg-orange-500/10',
    border: 'border-orange-500/30',
    text: 'text-orange-400',
    hover: 'hover:bg-orange-500/20'
  }),
  cyan: stryMutAct_9fa48("1009") ? {} : (stryCov_9fa48("1009"), {
    bg: 'bg-cyan-500/10',
    border: 'border-cyan-500/30',
    text: 'text-cyan-400',
    hover: 'hover:bg-cyan-500/20'
  }),
  amber: stryMutAct_9fa48("1014") ? {} : (stryCov_9fa48("1014"), {
    bg: 'bg-amber-500/10',
    border: 'border-amber-500/30',
    text: 'text-amber-400',
    hover: 'hover:bg-amber-500/20'
  }),
  blue: stryMutAct_9fa48("1019") ? {} : (stryCov_9fa48("1019"), {
    bg: 'bg-blue-500/10',
    border: 'border-blue-500/30',
    text: 'text-blue-400',
    hover: 'hover:bg-blue-500/20'
  })
});
export const CrossModuleActions: React.FC<CrossModuleActionsProps> = ({
  currentModule,
  context,
  variant = 'inline',
  onAction
}) => {
  const actions = stryMutAct_9fa48("1028") ? MODULE_INTEGRATIONS[currentModule] && [] : stryMutAct_9fa48("1027") ? false : stryMutAct_9fa48("1026") ? true : (stryCov_9fa48("1026", "1027", "1028"), MODULE_INTEGRATIONS[currentModule] || (stryMutAct_9fa48("1029") ? ["Stryker was here"] : (stryCov_9fa48("1029"), [])));
  if (stryMutAct_9fa48("1032") ? actions.length !== 0 : stryMutAct_9fa48("1031") ? false : stryMutAct_9fa48("1030") ? true : (stryCov_9fa48("1030", "1031", "1032"), actions.length === 0)) return null;
  const handleAction = (action: CrossModuleAction) => {
    if (stryMutAct_9fa48("1035") ? false : stryMutAct_9fa48("1034") ? true : (stryCov_9fa48("1034", "1035"), onAction)) {
      onAction(action);
    } else if (stryMutAct_9fa48("1038") ? false : stryMutAct_9fa48("1037") ? true : (stryCov_9fa48("1037", "1038"), action.onClick)) {
      action.onClick();
    }
  };

  // Inline variant - horizontal button strip
  if (stryMutAct_9fa48("1042") ? variant !== 'inline' : stryMutAct_9fa48("1041") ? false : stryMutAct_9fa48("1040") ? true : (stryCov_9fa48("1040", "1041", "1042"), variant === 'inline')) {
    return <div className="flex flex-wrap gap-2">
        {actions.map(action => {
        const colors = stryMutAct_9fa48("1048") ? colorClasses[action.color] && colorClasses.purple : stryMutAct_9fa48("1047") ? false : stryMutAct_9fa48("1046") ? true : (stryCov_9fa48("1046", "1047", "1048"), colorClasses[action.color] || colorClasses.purple);
        return <button key={action.id} onClick={stryMutAct_9fa48("1049") ? () => undefined : (stryCov_9fa48("1049"), () => handleAction(action))} className={`px-3 py-2 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-2 group`} title={action.description}>
              <span>{action.icon}</span>
              <span className={`text-sm font-medium ${colors.text}`}>{action.action}</span>
              <span className="text-xs text-slate-500 opacity-0 group-hover:opacity-100 transition-opacity">→</span>
            </button>;
      })}
      </div>;
  }

  // Panel variant - vertical list with descriptions
  if (stryMutAct_9fa48("1054") ? variant !== 'panel' : stryMutAct_9fa48("1053") ? false : stryMutAct_9fa48("1052") ? true : (stryCov_9fa48("1052", "1053", "1054"), variant === 'panel')) {
    return <div className="bg-slate-800/50 rounded-xl border border-slate-700 p-4">
        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">🔗</span>
          <h3 className="font-semibold text-white">Cross-Module Actions</h3>
        </div>
        <div className="space-y-2">
          {actions.map(action => {
          const colors = stryMutAct_9fa48("1060") ? colorClasses[action.color] && colorClasses.purple : stryMutAct_9fa48("1059") ? false : stryMutAct_9fa48("1058") ? true : (stryCov_9fa48("1058", "1059", "1060"), colorClasses[action.color] || colorClasses.purple);
          return <button key={action.id} onClick={stryMutAct_9fa48("1061") ? () => undefined : (stryCov_9fa48("1061"), () => handleAction(action))} className={`w-full px-4 py-3 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-3 text-left`}>
                <span className="text-xl">{action.icon}</span>
                <div className="flex-1">
                  <div className={`font-medium ${colors.text}`}>{action.action}</div>
                  <div className="text-xs text-slate-400">{action.description}</div>
                </div>
                <span className="text-slate-500">→</span>
              </button>;
        })}
        </div>
      </div>;
  }

  // Floating variant - compact floating bar
  if (stryMutAct_9fa48("1066") ? variant !== 'floating' : stryMutAct_9fa48("1065") ? false : stryMutAct_9fa48("1064") ? true : (stryCov_9fa48("1064", "1065", "1066"), variant === 'floating')) {
    return <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-slate-900/95 backdrop-blur-xl rounded-2xl border border-slate-700 shadow-2xl px-4 py-3 flex items-center gap-3">
          <span className="text-sm text-slate-400">Actions:</span>
          {stryMutAct_9fa48("1069") ? actions.map(action => {
          const colors = colorClasses[action.color] || colorClasses.purple;
          return <button key={action.id} onClick={() => handleAction(action)} className={`px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-2`} title={action.description}>
                <span>{action.icon}</span>
                <span className={`text-sm ${colors.text}`}>{action.action}</span>
              </button>;
        }) : (stryCov_9fa48("1069"), actions.slice(0, 4).map(action => {
          const colors = stryMutAct_9fa48("1073") ? colorClasses[action.color] && colorClasses.purple : stryMutAct_9fa48("1072") ? false : stryMutAct_9fa48("1071") ? true : (stryCov_9fa48("1071", "1072", "1073"), colorClasses[action.color] || colorClasses.purple);
          return <button key={action.id} onClick={stryMutAct_9fa48("1074") ? () => undefined : (stryCov_9fa48("1074"), () => handleAction(action))} className={`px-3 py-1.5 rounded-lg border ${colors.bg} ${colors.border} ${colors.hover} transition-all flex items-center gap-2`} title={action.description}>
                <span>{action.icon}</span>
                <span className={`text-sm ${colors.text}`}>{action.action}</span>
              </button>;
        }))}
        </div>
      </div>;
  }
  return null;
};

// Compact version for embedding in results/cards
export const CrossModuleQuickActions: React.FC<{
  currentModule: string;
  maxActions?: number;
  onAction?: (action: CrossModuleAction) => void;
}> = ({
  currentModule,
  maxActions = 3,
  onAction
}) => {
  const actions = stryMutAct_9fa48("1078") ? MODULE_INTEGRATIONS[currentModule] || [] : (stryCov_9fa48("1078"), (stryMutAct_9fa48("1081") ? MODULE_INTEGRATIONS[currentModule] && [] : stryMutAct_9fa48("1080") ? false : stryMutAct_9fa48("1079") ? true : (stryCov_9fa48("1079", "1080", "1081"), MODULE_INTEGRATIONS[currentModule] || (stryMutAct_9fa48("1082") ? ["Stryker was here"] : (stryCov_9fa48("1082"), [])))).slice(0, maxActions));
  if (stryMutAct_9fa48("1085") ? actions.length !== 0 : stryMutAct_9fa48("1084") ? false : stryMutAct_9fa48("1083") ? true : (stryCov_9fa48("1083", "1084", "1085"), actions.length === 0)) return null;
  return <div className="flex items-center gap-2 pt-3 border-t border-slate-700/50">
      <span className="text-xs text-slate-500">Next:</span>
      {actions.map(action => {
      const colors = stryMutAct_9fa48("1089") ? colorClasses[action.color] && colorClasses.purple : stryMutAct_9fa48("1088") ? false : stryMutAct_9fa48("1087") ? true : (stryCov_9fa48("1087", "1088", "1089"), colorClasses[action.color] || colorClasses.purple);
      return <button key={action.id} onClick={stryMutAct_9fa48("1090") ? () => undefined : (stryCov_9fa48("1090"), () => stryMutAct_9fa48("1091") ? onAction(action) : (stryCov_9fa48("1091"), onAction?.(action)))} className={`px-2 py-1 rounded text-xs ${colors.bg} ${colors.text} ${colors.hover} transition-all flex items-center gap-1`} title={action.description}>
            <span>{action.icon}</span>
            <span>{action.action}</span>
          </button>;
    })}
    </div>;
};

// Integration workflow indicator
export const IntegrationWorkflowBadge: React.FC<{
  workflow: string[];
  currentStep: number;
}> = ({
  workflow,
  currentStep
}) => {
  const moduleIcons: Record<string, string> = stryMutAct_9fa48("1094") ? {} : (stryCov_9fa48("1094"), {
    council: '⚖️',
    'decision-dna': '🧬',
    crucible: '🔥',
    vox: '🗣️',
    chronos: '⏰',
    eternal: '📜',
    panopticon: '👁️',
    symbiont: '🤝',
    aegis: '🛡️'
  });
  return <div className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 rounded-lg border border-slate-700">
      <span className="text-xs text-slate-500 mr-1">Workflow:</span>
      {workflow.map(stryMutAct_9fa48("1104") ? () => undefined : (stryCov_9fa48("1104"), (mod, idx) => <React.Fragment key={mod}>
          <span className={`text-sm ${(stryMutAct_9fa48("1109") ? idx > currentStep : stryMutAct_9fa48("1108") ? idx < currentStep : stryMutAct_9fa48("1107") ? false : stryMutAct_9fa48("1106") ? true : (stryCov_9fa48("1106", "1107", "1108", "1109"), idx <= currentStep)) ? 'opacity-100' : 'opacity-40'}`} title={mod}>
            {stryMutAct_9fa48("1114") ? moduleIcons[mod] && '📦' : stryMutAct_9fa48("1113") ? false : stryMutAct_9fa48("1112") ? true : (stryCov_9fa48("1112", "1113", "1114"), moduleIcons[mod] || '📦')}
          </span>
          {stryMutAct_9fa48("1118") ? idx < workflow.length - 1 || <span className={`text-xs ${idx < currentStep ? 'text-emerald-400' : 'text-slate-600'}`}>→</span> : stryMutAct_9fa48("1117") ? false : stryMutAct_9fa48("1116") ? true : (stryCov_9fa48("1116", "1117", "1118"), (stryMutAct_9fa48("1121") ? idx >= workflow.length - 1 : stryMutAct_9fa48("1120") ? idx <= workflow.length - 1 : stryMutAct_9fa48("1119") ? true : (stryCov_9fa48("1119", "1120", "1121"), idx < (stryMutAct_9fa48("1122") ? workflow.length + 1 : (stryCov_9fa48("1122"), workflow.length - 1)))) && <span className={`text-xs ${(stryMutAct_9fa48("1127") ? idx >= currentStep : stryMutAct_9fa48("1126") ? idx <= currentStep : stryMutAct_9fa48("1125") ? false : stryMutAct_9fa48("1124") ? true : (stryCov_9fa48("1124", "1125", "1126", "1127"), idx < currentStep)) ? 'text-emerald-400' : 'text-slate-600'}`}>→</span>)}
        </React.Fragment>))}
    </div>;
};
export default CrossModuleActions;