// @ts-nocheck
// =============================================================================
// POST-DELIBERATION PANEL - Game-changing post-decision workflow
// Displays Statement of Facts and allows multiple action selection
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
import { cn } from '../../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

type ClaimStatus = 'verified' | 'partially_verified' | 'unverified' | 'disputed' | 'assumption' | 'requires_human';
type ActionCategory = 'immediate' | 'analyze' | 'iterate' | 'govern' | 'communicate' | 'monitor' | 'automate';
type ActionPriority = 'critical' | 'high' | 'medium' | 'low';
interface Claim {
  id: string;
  agentId: string;
  agentName: string;
  statement: string;
  claimType: string;
  extractedValue?: string | number;
  status: ClaimStatus;
  confidence: number;
  evidence: Evidence[];
}
interface Evidence {
  id: string;
  type: string;
  description: string;
  source: {
    type: string;
    name: string;
    url?: string;
  };
  calculation?: {
    formula: string;
    inputs: Record<string, number | string>;
    steps: string[];
    result: number | string;
  };
  strength: 'strong' | 'moderate' | 'weak' | 'circumstantial';
}
interface StatementOfFacts {
  totalClaims: number;
  verifiedClaims: number;
  partiallyVerified: number;
  unverifiedClaims: number;
  overallConfidence: number;
  verificationScore: number;
  claims: Claim[];
  keyAssumptions: string[];
  claimsByAgent: Record<string, {
    agentName: string;
    totalClaims: number;
    verified: number;
    confidence: number;
  }>;
}
interface PostDeliberationAction {
  id: string;
  name: string;
  description: string;
  category: ActionCategory;
  icon: string;
  integratedTool?: string;
  toolSuite?: string;
  requiresConfirmation: boolean;
  estimatedDuration?: string;
  requiredPlan: string;
  status: string;
  priority?: ActionPriority;
}
interface ExecutiveSummary {
  title: string;
  recommendation: string;
  keyFindings: string[];
  riskFactors: string[];
  nextSteps: string[];
  confidence: number;
}
interface PostDeliberationSession {
  id: string;
  deliberationId: string;
  executiveSummary: ExecutiveSummary;
  statementOfFacts: StatementOfFacts;
  availableActions: PostDeliberationAction[];
  selectedActions: {
    selectedActions: string[];
    priority: Record<string, ActionPriority>;
  };
  status: string;
}

// =============================================================================
// COMPONENT PROPS
// =============================================================================

interface PostDeliberationPanelProps {
  deliberationId: string;
  onClose?: () => void;
  onActionComplete?: (outputs: unknown[]) => void;
}

// =============================================================================
// STATUS ICONS & COLORS
// =============================================================================

const claimStatusConfig: Record<ClaimStatus, {
  icon: string;
  color: string;
  label: string;
}> = stryMutAct_9fa48("3546") ? {} : (stryCov_9fa48("3546"), {
  verified: stryMutAct_9fa48("3547") ? {} : (stryCov_9fa48("3547"), {
    icon: '✅',
    color: 'text-green-400',
    label: 'Verified'
  }),
  partially_verified: stryMutAct_9fa48("3551") ? {} : (stryCov_9fa48("3551"), {
    icon: '🟡',
    color: 'text-yellow-400',
    label: 'Partially Verified'
  }),
  unverified: stryMutAct_9fa48("3555") ? {} : (stryCov_9fa48("3555"), {
    icon: '⚪',
    color: 'text-neutral-400',
    label: 'Unverified'
  }),
  disputed: stryMutAct_9fa48("3559") ? {} : (stryCov_9fa48("3559"), {
    icon: '❌',
    color: 'text-red-400',
    label: 'Disputed'
  }),
  assumption: stryMutAct_9fa48("3563") ? {} : (stryCov_9fa48("3563"), {
    icon: '💭',
    color: 'text-purple-400',
    label: 'Assumption'
  }),
  requires_human: stryMutAct_9fa48("3567") ? {} : (stryCov_9fa48("3567"), {
    icon: '👤',
    color: 'text-blue-400',
    label: 'Needs Review'
  })
});
const categoryConfig: Record<ActionCategory, {
  icon: string;
  color: string;
  label: string;
}> = stryMutAct_9fa48("3571") ? {} : (stryCov_9fa48("3571"), {
  immediate: stryMutAct_9fa48("3572") ? {} : (stryCov_9fa48("3572"), {
    icon: '⚡',
    color: 'bg-green-500/20 border-green-500/30',
    label: 'Immediate Actions'
  }),
  analyze: stryMutAct_9fa48("3576") ? {} : (stryCov_9fa48("3576"), {
    icon: '🔬',
    color: 'bg-blue-500/20 border-blue-500/30',
    label: 'Analyze Further'
  }),
  iterate: stryMutAct_9fa48("3580") ? {} : (stryCov_9fa48("3580"), {
    icon: '🔄',
    color: 'bg-purple-500/20 border-purple-500/30',
    label: 'Iterate & Refine'
  }),
  govern: stryMutAct_9fa48("3584") ? {} : (stryCov_9fa48("3584"), {
    icon: '⚖️',
    color: 'bg-orange-500/20 border-orange-500/30',
    label: 'Govern & Comply'
  }),
  communicate: stryMutAct_9fa48("3588") ? {} : (stryCov_9fa48("3588"), {
    icon: '📢',
    color: 'bg-cyan-500/20 border-cyan-500/30',
    label: 'Communicate & Share'
  }),
  monitor: stryMutAct_9fa48("3592") ? {} : (stryCov_9fa48("3592"), {
    icon: '📊',
    color: 'bg-indigo-500/20 border-indigo-500/30',
    label: 'Monitor & Track'
  }),
  automate: stryMutAct_9fa48("3596") ? {} : (stryCov_9fa48("3596"), {
    icon: '🤖',
    color: 'bg-pink-500/20 border-pink-500/30',
    label: 'Automate'
  })
});
const priorityConfig: Record<ActionPriority, {
  color: string;
  label: string;
}> = stryMutAct_9fa48("3600") ? {} : (stryCov_9fa48("3600"), {
  critical: stryMutAct_9fa48("3601") ? {} : (stryCov_9fa48("3601"), {
    color: 'bg-red-500',
    label: 'Critical'
  }),
  high: stryMutAct_9fa48("3604") ? {} : (stryCov_9fa48("3604"), {
    color: 'bg-orange-500',
    label: 'High'
  }),
  medium: stryMutAct_9fa48("3607") ? {} : (stryCov_9fa48("3607"), {
    color: 'bg-yellow-500',
    label: 'Medium'
  }),
  low: stryMutAct_9fa48("3610") ? {} : (stryCov_9fa48("3610"), {
    color: 'bg-blue-500',
    label: 'Low'
  })
});

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const PostDeliberationPanel: React.FC<PostDeliberationPanelProps> = ({
  deliberationId,
  onClose,
  onActionComplete
}) => {
  // State
  const [session, setSession] = useState<PostDeliberationSession | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("3614") ? false : (stryCov_9fa48("3614"), true));
  const [executing, setExecuting] = useState(stryMutAct_9fa48("3615") ? true : (stryCov_9fa48("3615"), false));
  const [activeTab, setActiveTab] = useState<'summary' | 'facts' | 'actions' | 'outputs'>('summary');
  const [selectedActions, setSelectedActions] = useState<Set<string>>(new Set());
  const [priorities, setPriorities] = useState<Record<string, ActionPriority>>({});
  const [expandedClaim, setExpandedClaim] = useState<string | null>(null);
  const [outputs, setOutputs] = useState<unknown[]>(stryMutAct_9fa48("3617") ? ["Stryker was here"] : (stryCov_9fa48("3617"), []));

  // Load session
  useEffect(() => {
    loadSession();
  }, stryMutAct_9fa48("3619") ? [] : (stryCov_9fa48("3619"), [deliberationId]));
  const loadSession = async () => {
    try {
      setLoading(stryMutAct_9fa48("3622") ? false : (stryCov_9fa48("3622"), true));
      // Create session
      const res = await fetch('/api/v1/deliberation/post-deliberation/session', stryMutAct_9fa48("3624") ? {} : (stryCov_9fa48("3624"), {
        method: 'POST',
        headers: stryMutAct_9fa48("3626") ? {} : (stryCov_9fa48("3626"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("3628") ? {} : (stryCov_9fa48("3628"), {
          deliberationId
        }))
      }));
      if (stryMutAct_9fa48("3631") ? false : stryMutAct_9fa48("3630") ? true : stryMutAct_9fa48("3629") ? res.ok : (stryCov_9fa48("3629", "3630", "3631"), !res.ok)) {
        throw new Error('Failed to create session');
      }
      const data = await res.json();
      setSession(data);
    } catch (err) {
      console.error('Failed to load session:', err);
    } finally {
      setLoading(stryMutAct_9fa48("3637") ? true : (stryCov_9fa48("3637"), false));
    }
  };
  const toggleAction = (actionId: string) => {
    setSelectedActions(prev => {
      const next = new Set(prev);
      if (stryMutAct_9fa48("3641") ? false : stryMutAct_9fa48("3640") ? true : (stryCov_9fa48("3640", "3641"), next.has(actionId))) {
        next.delete(actionId);
      } else {
        next.add(actionId);
      }
      return next;
    });
  };
  const setPriority = (actionId: string, priority: ActionPriority) => {
    setPriorities(stryMutAct_9fa48("3645") ? () => undefined : (stryCov_9fa48("3645"), prev => stryMutAct_9fa48("3646") ? {} : (stryCov_9fa48("3646"), {
      ...prev,
      [actionId]: priority
    })));
  };
  const executeActions = async () => {
    if (stryMutAct_9fa48("3650") ? !session && selectedActions.size === 0 : stryMutAct_9fa48("3649") ? false : stryMutAct_9fa48("3648") ? true : (stryCov_9fa48("3648", "3649", "3650"), (stryMutAct_9fa48("3651") ? session : (stryCov_9fa48("3651"), !session)) || (stryMutAct_9fa48("3653") ? selectedActions.size !== 0 : stryMutAct_9fa48("3652") ? false : (stryCov_9fa48("3652", "3653"), selectedActions.size === 0)))) {
      return;
    }
    try {
      setExecuting(stryMutAct_9fa48("3656") ? false : (stryCov_9fa48("3656"), true));
      const res = await fetch('/api/v1/deliberation/post-deliberation/execute', stryMutAct_9fa48("3658") ? {} : (stryCov_9fa48("3658"), {
        method: 'POST',
        headers: stryMutAct_9fa48("3660") ? {} : (stryCov_9fa48("3660"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("3662") ? {} : (stryCov_9fa48("3662"), {
          sessionId: session.id,
          actionIds: Array.from(selectedActions),
          priorities
        }))
      }));
      if (stryMutAct_9fa48("3665") ? false : stryMutAct_9fa48("3664") ? true : stryMutAct_9fa48("3663") ? res.ok : (stryCov_9fa48("3663", "3664", "3665"), !res.ok)) {
        throw new Error('Failed to execute actions');
      }
      const result = await res.json();
      setSession(result);
      setOutputs(stryMutAct_9fa48("3670") ? result.generatedOutputs && [] : stryMutAct_9fa48("3669") ? false : stryMutAct_9fa48("3668") ? true : (stryCov_9fa48("3668", "3669", "3670"), result.generatedOutputs || (stryMutAct_9fa48("3671") ? ["Stryker was here"] : (stryCov_9fa48("3671"), []))));
      setActiveTab('outputs');
      if (stryMutAct_9fa48("3674") ? false : stryMutAct_9fa48("3673") ? true : (stryCov_9fa48("3673", "3674"), onActionComplete)) {
        onActionComplete(stryMutAct_9fa48("3678") ? result.generatedOutputs && [] : stryMutAct_9fa48("3677") ? false : stryMutAct_9fa48("3676") ? true : (stryCov_9fa48("3676", "3677", "3678"), result.generatedOutputs || (stryMutAct_9fa48("3679") ? ["Stryker was here"] : (stryCov_9fa48("3679"), []))));
      }
    } catch (err) {
      console.error('Failed to execute actions:', err);
    } finally {
      setExecuting(stryMutAct_9fa48("3683") ? true : (stryCov_9fa48("3683"), false));
    }
  };

  // Loading state
  if (stryMutAct_9fa48("3685") ? false : stryMutAct_9fa48("3684") ? true : (stryCov_9fa48("3684", "3685"), loading)) {
    return <div className="bg-neutral-900 rounded-2xl border border-neutral-700 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500 mx-auto mb-4" />
            <p className="text-neutral-400">Generating Statement of Facts...</p>
            <p className="text-sm text-neutral-500 mt-2">Validating all agent claims...</p>
          </div>
        </div>
      </div>;
  }
  if (stryMutAct_9fa48("3689") ? false : stryMutAct_9fa48("3688") ? true : stryMutAct_9fa48("3687") ? session : (stryCov_9fa48("3687", "3688", "3689"), !session)) {
    return <div className="bg-neutral-900 rounded-2xl border border-neutral-700 p-8">
        <p className="text-red-400 text-center">Failed to load post-deliberation session</p>
      </div>;
  }
  const {
    executiveSummary,
    statementOfFacts,
    availableActions
  } = session;
  return <div className="bg-neutral-900 rounded-2xl border border-neutral-700 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-600 to-purple-600 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">{executiveSummary.title}</h2>
            <p className="text-white/80 mt-1">What would you like to do next?</p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-white/60 text-sm">Confidence</p>
              <p className="text-2xl font-bold text-white">{executiveSummary.confidence}%</p>
            </div>
            <div className="text-right">
              <p className="text-white/60 text-sm">Verification</p>
              <p className="text-2xl font-bold text-white">{statementOfFacts.verificationScore}%</p>
            </div>
            {stryMutAct_9fa48("3693") ? onClose || <button onClick={onClose} className="text-white/60 hover:text-white ml-4">
                ✕
              </button> : stryMutAct_9fa48("3692") ? false : stryMutAct_9fa48("3691") ? true : (stryCov_9fa48("3691", "3692", "3693"), onClose && <button onClick={onClose} className="text-white/60 hover:text-white ml-4">
                ✕
              </button>)}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-neutral-700">
        {(['summary', 'facts', 'actions', 'outputs'] as const).map(stryMutAct_9fa48("3694") ? () => undefined : (stryCov_9fa48("3694"), tab => <button key={tab} onClick={stryMutAct_9fa48("3695") ? () => undefined : (stryCov_9fa48("3695"), () => setActiveTab(tab))} className={cn('flex-1 px-6 py-4 font-medium transition-colors capitalize', (stryMutAct_9fa48("3699") ? activeTab !== tab : stryMutAct_9fa48("3698") ? false : stryMutAct_9fa48("3697") ? true : (stryCov_9fa48("3697", "3698", "3699"), activeTab === tab)) ? 'text-white border-b-2 border-primary-500 bg-neutral-800/50' : 'text-neutral-400 hover:text-white hover:bg-neutral-800/30')}>
            {(stryMutAct_9fa48("3704") ? tab !== 'facts' : stryMutAct_9fa48("3703") ? false : stryMutAct_9fa48("3702") ? true : (stryCov_9fa48("3702", "3703", "3704"), tab === 'facts')) ? 'Statement of Facts' : tab}
            {stryMutAct_9fa48("3709") ? tab === 'actions' && selectedActions.size > 0 || <span className="ml-2 px-2 py-0.5 bg-primary-500 rounded-full text-xs">
                {selectedActions.size}
              </span> : stryMutAct_9fa48("3708") ? false : stryMutAct_9fa48("3707") ? true : (stryCov_9fa48("3707", "3708", "3709"), (stryMutAct_9fa48("3711") ? tab === 'actions' || selectedActions.size > 0 : stryMutAct_9fa48("3710") ? true : (stryCov_9fa48("3710", "3711"), (stryMutAct_9fa48("3713") ? tab !== 'actions' : stryMutAct_9fa48("3712") ? true : (stryCov_9fa48("3712", "3713"), tab === 'actions')) && (stryMutAct_9fa48("3717") ? selectedActions.size <= 0 : stryMutAct_9fa48("3716") ? selectedActions.size >= 0 : stryMutAct_9fa48("3715") ? true : (stryCov_9fa48("3715", "3716", "3717"), selectedActions.size > 0)))) && <span className="ml-2 px-2 py-0.5 bg-primary-500 rounded-full text-xs">
                {selectedActions.size}
              </span>)}
            {stryMutAct_9fa48("3720") ? tab === 'outputs' && outputs.length > 0 || <span className="ml-2 px-2 py-0.5 bg-green-500 rounded-full text-xs">
                {outputs.length}
              </span> : stryMutAct_9fa48("3719") ? false : stryMutAct_9fa48("3718") ? true : (stryCov_9fa48("3718", "3719", "3720"), (stryMutAct_9fa48("3722") ? tab === 'outputs' || outputs.length > 0 : stryMutAct_9fa48("3721") ? true : (stryCov_9fa48("3721", "3722"), (stryMutAct_9fa48("3724") ? tab !== 'outputs' : stryMutAct_9fa48("3723") ? true : (stryCov_9fa48("3723", "3724"), tab === 'outputs')) && (stryMutAct_9fa48("3728") ? outputs.length <= 0 : stryMutAct_9fa48("3727") ? outputs.length >= 0 : stryMutAct_9fa48("3726") ? true : (stryCov_9fa48("3726", "3727", "3728"), outputs.length > 0)))) && <span className="ml-2 px-2 py-0.5 bg-green-500 rounded-full text-xs">
                {outputs.length}
              </span>)}
          </button>))}
      </div>

      {/* Content */}
      <div className="p-6 max-h-[70vh] overflow-y-auto">
        {/* Summary Tab */}
        {stryMutAct_9fa48("3731") ? activeTab === 'summary' || <div className="space-y-6">
            {/* Recommendation */}
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendation</h3>
              <p className="text-neutral-300 leading-relaxed">{executiveSummary.recommendation}</p>
            </div>

            {/* Key Findings, Risks, Next Steps */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">🔍</span> Key Findings
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.keyFindings.map((finding, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-primary-400">•</span>
                      {finding}
                    </li>)}
                </ul>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Risk Factors
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.riskFactors.map((risk, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-orange-400">•</span>
                      {risk}
                    </li>)}
                </ul>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span> Next Steps
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.nextSteps.map((step, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-green-400">•</span>
                      {step}
                    </li>)}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={() => setActiveTab('facts')} className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors">
                📋 Review Statement of Facts
              </button>
              <button onClick={() => setActiveTab('actions')} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                ⚡ Choose Actions
              </button>
            </div>
          </div> : stryMutAct_9fa48("3730") ? false : stryMutAct_9fa48("3729") ? true : (stryCov_9fa48("3729", "3730", "3731"), (stryMutAct_9fa48("3733") ? activeTab !== 'summary' : stryMutAct_9fa48("3732") ? true : (stryCov_9fa48("3732", "3733"), activeTab === 'summary')) && <div className="space-y-6">
            {/* Recommendation */}
            <div className="bg-neutral-800 rounded-xl p-6 border border-neutral-700">
              <h3 className="text-lg font-semibold text-white mb-3">💡 Recommendation</h3>
              <p className="text-neutral-300 leading-relaxed">{executiveSummary.recommendation}</p>
            </div>

            {/* Key Findings, Risks, Next Steps */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">🔍</span> Key Findings
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.keyFindings.map(stryMutAct_9fa48("3735") ? () => undefined : (stryCov_9fa48("3735"), (finding, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-primary-400">•</span>
                      {finding}
                    </li>))}
                </ul>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">⚠️</span> Risk Factors
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.riskFactors.map(stryMutAct_9fa48("3736") ? () => undefined : (stryCov_9fa48("3736"), (risk, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-orange-400">•</span>
                      {risk}
                    </li>))}
                </ul>
              </div>

              <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span className="text-lg">📋</span> Next Steps
                </h4>
                <ul className="space-y-2">
                  {executiveSummary.nextSteps.map(stryMutAct_9fa48("3737") ? () => undefined : (stryCov_9fa48("3737"), (step, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-green-400">•</span>
                      {step}
                    </li>))}
                </ul>
              </div>
            </div>

            {/* CTA */}
            <div className="flex justify-center gap-4 pt-4">
              <button onClick={stryMutAct_9fa48("3738") ? () => undefined : (stryCov_9fa48("3738"), () => setActiveTab('facts'))} className="px-6 py-3 bg-neutral-700 hover:bg-neutral-600 text-white rounded-lg font-medium transition-colors">
                📋 Review Statement of Facts
              </button>
              <button onClick={stryMutAct_9fa48("3740") ? () => undefined : (stryCov_9fa48("3740"), () => setActiveTab('actions'))} className="px-6 py-3 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors">
                ⚡ Choose Actions
              </button>
            </div>
          </div>)}

        {/* Statement of Facts Tab */}
        {stryMutAct_9fa48("3744") ? activeTab === 'facts' || <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-6 gap-3">
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-2xl font-bold text-white">{statementOfFacts.totalClaims}</p>
                <p className="text-xs text-neutral-400">Total Claims</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 text-center">
                <p className="text-2xl font-bold text-green-400">{statementOfFacts.verifiedClaims}</p>
                <p className="text-xs text-neutral-400">Verified</p>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30 text-center">
                <p className="text-2xl font-bold text-yellow-400">{statementOfFacts.partiallyVerified}</p>
                <p className="text-xs text-neutral-400">Partial</p>
              </div>
              <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600 text-center">
                <p className="text-2xl font-bold text-neutral-400">{statementOfFacts.unverifiedClaims}</p>
                <p className="text-xs text-neutral-400">Unverified</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-2xl font-bold text-white">{statementOfFacts.overallConfidence}%</p>
                <p className="text-xs text-neutral-400">Confidence</p>
              </div>
              <div className="bg-primary-500/10 rounded-lg p-4 border border-primary-500/30 text-center">
                <p className="text-2xl font-bold text-primary-400">{statementOfFacts.verificationScore}%</p>
                <p className="text-xs text-neutral-400">Verified %</p>
              </div>
            </div>

            {/* Claims by Agent */}
            <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
              <h4 className="font-semibold text-white mb-3">Claims by Agent</h4>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(statementOfFacts.claimsByAgent).map(([agentId, data]) => <div key={agentId} className="bg-neutral-700/50 rounded-lg p-3">
                    <p className="font-medium text-white text-sm">{data.agentName}</p>
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>{data.totalClaims} claims</span>
                      <span className="text-green-400">{data.verified} verified</span>
                    </div>
                    <div className="w-full bg-neutral-600 rounded-full h-1.5 mt-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={{
                  width: `${data.confidence}%`
                }} />
                    </div>
                  </div>)}
              </div>
            </div>

            {/* Key Assumptions */}
            {statementOfFacts.keyAssumptions.length > 0 && <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>💭</span> Key Assumptions
                </h4>
                <ul className="space-y-2">
                  {statementOfFacts.keyAssumptions.map((assumption, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-purple-400">•</span>
                      {assumption}
                    </li>)}
                </ul>
              </div>}

            {/* All Claims */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">All Claims ({statementOfFacts.claims.length})</h4>
              {statementOfFacts.claims.map(claim => {
            const statusCfg = claimStatusConfig[claim.status];
            const isExpanded = expandedClaim === claim.id;
            return <div key={claim.id} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                    <button onClick={() => setExpandedClaim(isExpanded ? null : claim.id)} className="w-full p-4 flex items-start gap-4 text-left hover:bg-neutral-700/30 transition-colors">
                      <span className="text-xl">{statusCfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-neutral-200 text-sm">{claim.statement}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="text-neutral-500">{claim.agentName}</span>
                          <span className={statusCfg.color}>{statusCfg.label}</span>
                          <span className="text-neutral-500">{claim.claimType}</span>
                          {claim.extractedValue && <span className="text-primary-400">Value: {claim.extractedValue}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium text-white">{claim.confidence}%</span>
                        </div>
                        <span className="text-neutral-400">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </button>

                    {/* Evidence (expanded) */}
                    {isExpanded && claim.evidence.length > 0 && <div className="border-t border-neutral-700 p-4 bg-neutral-900/50">
                        <p className="text-xs font-medium text-neutral-400 mb-3">Evidence Chain:</p>
                        {claim.evidence.map(ev => <div key={ev.id} className="mb-3 last:mb-0">
                            <div className="flex items-start gap-3">
                              <span className={cn('px-2 py-0.5 rounded text-xs font-medium', ev.strength === 'strong' ? 'bg-green-500/20 text-green-400' : ev.strength === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-500/20 text-neutral-400')}>
                                {ev.strength}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-neutral-300">{ev.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  Source: {ev.source.name}
                                </p>
                                {ev.calculation && <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-xs font-mono">
                                    <p className="text-primary-400 mb-1">Formula: {ev.calculation.formula}</p>
                                    <p className="text-neutral-400">
                                      Inputs: {JSON.stringify(ev.calculation.inputs)}
                                    </p>
                                    <p className="text-green-400 mt-1">
                                      Result: {ev.calculation.result}
                                    </p>
                                  </div>}
                              </div>
                            </div>
                          </div>)}
                      </div>}
                  </div>;
          })}
            </div>
          </div> : stryMutAct_9fa48("3743") ? false : stryMutAct_9fa48("3742") ? true : (stryCov_9fa48("3742", "3743", "3744"), (stryMutAct_9fa48("3746") ? activeTab !== 'facts' : stryMutAct_9fa48("3745") ? true : (stryCov_9fa48("3745", "3746"), activeTab === 'facts')) && <div className="space-y-6">
            {/* Summary Stats */}
            <div className="grid grid-cols-6 gap-3">
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-2xl font-bold text-white">{statementOfFacts.totalClaims}</p>
                <p className="text-xs text-neutral-400">Total Claims</p>
              </div>
              <div className="bg-green-500/10 rounded-lg p-4 border border-green-500/30 text-center">
                <p className="text-2xl font-bold text-green-400">{statementOfFacts.verifiedClaims}</p>
                <p className="text-xs text-neutral-400">Verified</p>
              </div>
              <div className="bg-yellow-500/10 rounded-lg p-4 border border-yellow-500/30 text-center">
                <p className="text-2xl font-bold text-yellow-400">{statementOfFacts.partiallyVerified}</p>
                <p className="text-xs text-neutral-400">Partial</p>
              </div>
              <div className="bg-neutral-700/50 rounded-lg p-4 border border-neutral-600 text-center">
                <p className="text-2xl font-bold text-neutral-400">{statementOfFacts.unverifiedClaims}</p>
                <p className="text-xs text-neutral-400">Unverified</p>
              </div>
              <div className="bg-neutral-800 rounded-lg p-4 border border-neutral-700 text-center">
                <p className="text-2xl font-bold text-white">{statementOfFacts.overallConfidence}%</p>
                <p className="text-xs text-neutral-400">Confidence</p>
              </div>
              <div className="bg-primary-500/10 rounded-lg p-4 border border-primary-500/30 text-center">
                <p className="text-2xl font-bold text-primary-400">{statementOfFacts.verificationScore}%</p>
                <p className="text-xs text-neutral-400">Verified %</p>
              </div>
            </div>

            {/* Claims by Agent */}
            <div className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
              <h4 className="font-semibold text-white mb-3">Claims by Agent</h4>
              <div className="grid grid-cols-4 gap-3">
                {Object.entries(statementOfFacts.claimsByAgent).map(stryMutAct_9fa48("3748") ? () => undefined : (stryCov_9fa48("3748"), ([agentId, data]) => <div key={agentId} className="bg-neutral-700/50 rounded-lg p-3">
                    <p className="font-medium text-white text-sm">{data.agentName}</p>
                    <div className="flex justify-between text-xs text-neutral-400 mt-1">
                      <span>{data.totalClaims} claims</span>
                      <span className="text-green-400">{data.verified} verified</span>
                    </div>
                    <div className="w-full bg-neutral-600 rounded-full h-1.5 mt-2">
                      <div className="bg-green-500 h-1.5 rounded-full" style={stryMutAct_9fa48("3749") ? {} : (stryCov_9fa48("3749"), {
                  width: `${data.confidence}%`
                })} />
                    </div>
                  </div>))}
              </div>
            </div>

            {/* Key Assumptions */}
            {stryMutAct_9fa48("3753") ? statementOfFacts.keyAssumptions.length > 0 || <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>💭</span> Key Assumptions
                </h4>
                <ul className="space-y-2">
                  {statementOfFacts.keyAssumptions.map((assumption, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-purple-400">•</span>
                      {assumption}
                    </li>)}
                </ul>
              </div> : stryMutAct_9fa48("3752") ? false : stryMutAct_9fa48("3751") ? true : (stryCov_9fa48("3751", "3752", "3753"), (stryMutAct_9fa48("3756") ? statementOfFacts.keyAssumptions.length <= 0 : stryMutAct_9fa48("3755") ? statementOfFacts.keyAssumptions.length >= 0 : stryMutAct_9fa48("3754") ? true : (stryCov_9fa48("3754", "3755", "3756"), statementOfFacts.keyAssumptions.length > 0)) && <div className="bg-purple-500/10 rounded-xl p-4 border border-purple-500/30">
                <h4 className="font-semibold text-white mb-3 flex items-center gap-2">
                  <span>💭</span> Key Assumptions
                </h4>
                <ul className="space-y-2">
                  {statementOfFacts.keyAssumptions.map(stryMutAct_9fa48("3757") ? () => undefined : (stryCov_9fa48("3757"), (assumption, i) => <li key={i} className="text-sm text-neutral-300 flex gap-2">
                      <span className="text-purple-400">•</span>
                      {assumption}
                    </li>))}
                </ul>
              </div>)}

            {/* All Claims */}
            <div className="space-y-3">
              <h4 className="font-semibold text-white">All Claims ({statementOfFacts.claims.length})</h4>
              {statementOfFacts.claims.map(claim => {
            const statusCfg = claimStatusConfig[claim.status];
            const isExpanded = stryMutAct_9fa48("3761") ? expandedClaim !== claim.id : stryMutAct_9fa48("3760") ? false : stryMutAct_9fa48("3759") ? true : (stryCov_9fa48("3759", "3760", "3761"), expandedClaim === claim.id);
            return <div key={claim.id} className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
                    <button onClick={stryMutAct_9fa48("3762") ? () => undefined : (stryCov_9fa48("3762"), () => setExpandedClaim(isExpanded ? null : claim.id))} className="w-full p-4 flex items-start gap-4 text-left hover:bg-neutral-700/30 transition-colors">
                      <span className="text-xl">{statusCfg.icon}</span>
                      <div className="flex-1 min-w-0">
                        <p className="text-neutral-200 text-sm">{claim.statement}</p>
                        <div className="flex gap-3 mt-2 text-xs">
                          <span className="text-neutral-500">{claim.agentName}</span>
                          <span className={statusCfg.color}>{statusCfg.label}</span>
                          <span className="text-neutral-500">{claim.claimType}</span>
                          {stryMutAct_9fa48("3765") ? claim.extractedValue || <span className="text-primary-400">Value: {claim.extractedValue}</span> : stryMutAct_9fa48("3764") ? false : stryMutAct_9fa48("3763") ? true : (stryCov_9fa48("3763", "3764", "3765"), claim.extractedValue && <span className="text-primary-400">Value: {claim.extractedValue}</span>)}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-16 text-right">
                          <span className="text-sm font-medium text-white">{claim.confidence}%</span>
                        </div>
                        <span className="text-neutral-400">{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </button>

                    {/* Evidence (expanded) */}
                    {stryMutAct_9fa48("3770") ? isExpanded && claim.evidence.length > 0 || <div className="border-t border-neutral-700 p-4 bg-neutral-900/50">
                        <p className="text-xs font-medium text-neutral-400 mb-3">Evidence Chain:</p>
                        {claim.evidence.map(ev => <div key={ev.id} className="mb-3 last:mb-0">
                            <div className="flex items-start gap-3">
                              <span className={cn('px-2 py-0.5 rounded text-xs font-medium', ev.strength === 'strong' ? 'bg-green-500/20 text-green-400' : ev.strength === 'moderate' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-500/20 text-neutral-400')}>
                                {ev.strength}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-neutral-300">{ev.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  Source: {ev.source.name}
                                </p>
                                {ev.calculation && <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-xs font-mono">
                                    <p className="text-primary-400 mb-1">Formula: {ev.calculation.formula}</p>
                                    <p className="text-neutral-400">
                                      Inputs: {JSON.stringify(ev.calculation.inputs)}
                                    </p>
                                    <p className="text-green-400 mt-1">
                                      Result: {ev.calculation.result}
                                    </p>
                                  </div>}
                              </div>
                            </div>
                          </div>)}
                      </div> : stryMutAct_9fa48("3769") ? false : stryMutAct_9fa48("3768") ? true : (stryCov_9fa48("3768", "3769", "3770"), (stryMutAct_9fa48("3772") ? isExpanded || claim.evidence.length > 0 : stryMutAct_9fa48("3771") ? true : (stryCov_9fa48("3771", "3772"), isExpanded && (stryMutAct_9fa48("3775") ? claim.evidence.length <= 0 : stryMutAct_9fa48("3774") ? claim.evidence.length >= 0 : stryMutAct_9fa48("3773") ? true : (stryCov_9fa48("3773", "3774", "3775"), claim.evidence.length > 0)))) && <div className="border-t border-neutral-700 p-4 bg-neutral-900/50">
                        <p className="text-xs font-medium text-neutral-400 mb-3">Evidence Chain:</p>
                        {claim.evidence.map(stryMutAct_9fa48("3776") ? () => undefined : (stryCov_9fa48("3776"), ev => <div key={ev.id} className="mb-3 last:mb-0">
                            <div className="flex items-start gap-3">
                              <span className={cn('px-2 py-0.5 rounded text-xs font-medium', (stryMutAct_9fa48("3780") ? ev.strength !== 'strong' : stryMutAct_9fa48("3779") ? false : stryMutAct_9fa48("3778") ? true : (stryCov_9fa48("3778", "3779", "3780"), ev.strength === 'strong')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("3785") ? ev.strength !== 'moderate' : stryMutAct_9fa48("3784") ? false : stryMutAct_9fa48("3783") ? true : (stryCov_9fa48("3783", "3784", "3785"), ev.strength === 'moderate')) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-500/20 text-neutral-400')}>
                                {ev.strength}
                              </span>
                              <div className="flex-1">
                                <p className="text-sm text-neutral-300">{ev.description}</p>
                                <p className="text-xs text-neutral-500 mt-1">
                                  Source: {ev.source.name}
                                </p>
                                {stryMutAct_9fa48("3791") ? ev.calculation || <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-xs font-mono">
                                    <p className="text-primary-400 mb-1">Formula: {ev.calculation.formula}</p>
                                    <p className="text-neutral-400">
                                      Inputs: {JSON.stringify(ev.calculation.inputs)}
                                    </p>
                                    <p className="text-green-400 mt-1">
                                      Result: {ev.calculation.result}
                                    </p>
                                  </div> : stryMutAct_9fa48("3790") ? false : stryMutAct_9fa48("3789") ? true : (stryCov_9fa48("3789", "3790", "3791"), ev.calculation && <div className="mt-2 p-3 bg-neutral-800 rounded-lg text-xs font-mono">
                                    <p className="text-primary-400 mb-1">Formula: {ev.calculation.formula}</p>
                                    <p className="text-neutral-400">
                                      Inputs: {JSON.stringify(ev.calculation.inputs)}
                                    </p>
                                    <p className="text-green-400 mt-1">
                                      Result: {ev.calculation.result}
                                    </p>
                                  </div>)}
                              </div>
                            </div>
                          </div>))}
                      </div>)}
                  </div>;
          })}
            </div>
          </div>)}

        {/* Actions Tab */}
        {stryMutAct_9fa48("3794") ? activeTab === 'actions' || <div className="space-y-6">
            {/* Selected Count */}
            {selectedActions.size > 0 && <div className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {selectedActions.size} action{selectedActions.size > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-neutral-400">
                    You can select multiple actions to execute together
                  </p>
                </div>
                <button onClick={executeActions} disabled={executing} className={cn('px-6 py-3 rounded-lg font-medium transition-colors', executing ? 'bg-neutral-600 text-neutral-400 cursor-wait' : 'bg-primary-600 hover:bg-primary-700 text-white')}>
                  {executing ? 'Executing...' : `Execute ${selectedActions.size} Action${selectedActions.size > 1 ? 's' : ''}`}
                </button>
              </div>}

            {/* Actions by Category */}
            {(Object.keys(categoryConfig) as ActionCategory[]).map(category => {
          const categoryActions = availableActions.filter(a => a.category === category);
          if (categoryActions.length === 0) {
            return null;
          }
          const cfg = categoryConfig[category];
          return <div key={category} className={cn('rounded-xl border p-4', cfg.color)}>
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">{cfg.icon}</span>
                    {cfg.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryActions.map(action => {
                const isSelected = selectedActions.has(action.id);
                const isUpgradeRequired = action.status === 'requires_upgrade';
                return <div key={action.id} className={cn('bg-neutral-800/80 rounded-lg p-4 border transition-all cursor-pointer', isUpgradeRequired && 'opacity-50 cursor-not-allowed', isSelected ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-neutral-700 hover:border-neutral-500')} onClick={() => !isUpgradeRequired && toggleAction(action.id)}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white">{action.name}</p>
                                {isSelected && <span className="text-primary-400">✓</span>}
                              </div>
                              <p className="text-sm text-neutral-400 mt-1">{action.description}</p>
                              <div className="flex gap-2 mt-2">
                                {action.integratedTool && <span className="text-xs px-2 py-0.5 bg-neutral-700 rounded text-neutral-300">
                                    {action.integratedTool}
                                  </span>}
                                {action.estimatedDuration && <span className="text-xs text-neutral-500">
                                    ~{action.estimatedDuration}
                                  </span>}
                                {isUpgradeRequired && <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                                    Upgrade Required
                                  </span>}
                              </div>
                              {/* Priority selector (when selected) */}
                              {isSelected && <div className="flex gap-1 mt-3" onClick={e => e.stopPropagation()}>
                                  {(['critical', 'high', 'medium', 'low'] as ActionPriority[]).map(p => <button key={p} onClick={() => setPriority(action.id, p)} className={cn('px-2 py-1 text-xs rounded transition-colors', priorities[action.id] === p ? `${priorityConfig[p].color} text-white` : 'bg-neutral-700 text-neutral-400 hover:text-white')}>
                                      {priorityConfig[p].label}
                                    </button>)}
                                </div>}
                            </div>
                          </div>
                        </div>;
              })}
                  </div>
                </div>;
        })}
          </div> : stryMutAct_9fa48("3793") ? false : stryMutAct_9fa48("3792") ? true : (stryCov_9fa48("3792", "3793", "3794"), (stryMutAct_9fa48("3796") ? activeTab !== 'actions' : stryMutAct_9fa48("3795") ? true : (stryCov_9fa48("3795", "3796"), activeTab === 'actions')) && <div className="space-y-6">
            {/* Selected Count */}
            {stryMutAct_9fa48("3800") ? selectedActions.size > 0 || <div className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {selectedActions.size} action{selectedActions.size > 1 ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-neutral-400">
                    You can select multiple actions to execute together
                  </p>
                </div>
                <button onClick={executeActions} disabled={executing} className={cn('px-6 py-3 rounded-lg font-medium transition-colors', executing ? 'bg-neutral-600 text-neutral-400 cursor-wait' : 'bg-primary-600 hover:bg-primary-700 text-white')}>
                  {executing ? 'Executing...' : `Execute ${selectedActions.size} Action${selectedActions.size > 1 ? 's' : ''}`}
                </button>
              </div> : stryMutAct_9fa48("3799") ? false : stryMutAct_9fa48("3798") ? true : (stryCov_9fa48("3798", "3799", "3800"), (stryMutAct_9fa48("3803") ? selectedActions.size <= 0 : stryMutAct_9fa48("3802") ? selectedActions.size >= 0 : stryMutAct_9fa48("3801") ? true : (stryCov_9fa48("3801", "3802", "3803"), selectedActions.size > 0)) && <div className="bg-primary-500/10 rounded-xl p-4 border border-primary-500/30 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">
                    {selectedActions.size} action{(stryMutAct_9fa48("3807") ? selectedActions.size <= 1 : stryMutAct_9fa48("3806") ? selectedActions.size >= 1 : stryMutAct_9fa48("3805") ? false : stryMutAct_9fa48("3804") ? true : (stryCov_9fa48("3804", "3805", "3806", "3807"), selectedActions.size > 1)) ? 's' : ''} selected
                  </p>
                  <p className="text-sm text-neutral-400">
                    You can select multiple actions to execute together
                  </p>
                </div>
                <button onClick={executeActions} disabled={executing} className={cn('px-6 py-3 rounded-lg font-medium transition-colors', executing ? 'bg-neutral-600 text-neutral-400 cursor-wait' : 'bg-primary-600 hover:bg-primary-700 text-white')}>
                  {executing ? 'Executing...' : `Execute ${selectedActions.size} Action${(stryMutAct_9fa48("3818") ? selectedActions.size <= 1 : stryMutAct_9fa48("3817") ? selectedActions.size >= 1 : stryMutAct_9fa48("3816") ? false : stryMutAct_9fa48("3815") ? true : (stryCov_9fa48("3815", "3816", "3817", "3818"), selectedActions.size > 1)) ? 's' : ''}`}
                </button>
              </div>)}

            {/* Actions by Category */}
            {(Object.keys(categoryConfig) as ActionCategory[]).map(category => {
          const categoryActions = stryMutAct_9fa48("3822") ? availableActions : (stryCov_9fa48("3822"), availableActions.filter(stryMutAct_9fa48("3823") ? () => undefined : (stryCov_9fa48("3823"), a => stryMutAct_9fa48("3826") ? a.category !== category : stryMutAct_9fa48("3825") ? false : stryMutAct_9fa48("3824") ? true : (stryCov_9fa48("3824", "3825", "3826"), a.category === category))));
          if (stryMutAct_9fa48("3829") ? categoryActions.length !== 0 : stryMutAct_9fa48("3828") ? false : stryMutAct_9fa48("3827") ? true : (stryCov_9fa48("3827", "3828", "3829"), categoryActions.length === 0)) {
            return null;
          }
          const cfg = categoryConfig[category];
          return <div key={category} className={cn('rounded-xl border p-4', cfg.color)}>
                  <h4 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <span className="text-xl">{cfg.icon}</span>
                    {cfg.label}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {categoryActions.map(action => {
                const isSelected = selectedActions.has(action.id);
                const isUpgradeRequired = stryMutAct_9fa48("3835") ? action.status !== 'requires_upgrade' : stryMutAct_9fa48("3834") ? false : stryMutAct_9fa48("3833") ? true : (stryCov_9fa48("3833", "3834", "3835"), action.status === 'requires_upgrade');
                return <div key={action.id} className={cn('bg-neutral-800/80 rounded-lg p-4 border transition-all cursor-pointer', stryMutAct_9fa48("3840") ? isUpgradeRequired || 'opacity-50 cursor-not-allowed' : stryMutAct_9fa48("3839") ? false : stryMutAct_9fa48("3838") ? true : (stryCov_9fa48("3838", "3839", "3840"), isUpgradeRequired && 'opacity-50 cursor-not-allowed'), isSelected ? 'border-primary-500 ring-2 ring-primary-500/30' : 'border-neutral-700 hover:border-neutral-500')} onClick={stryMutAct_9fa48("3844") ? () => undefined : (stryCov_9fa48("3844"), () => stryMutAct_9fa48("3847") ? !isUpgradeRequired || toggleAction(action.id) : stryMutAct_9fa48("3846") ? false : stryMutAct_9fa48("3845") ? true : (stryCov_9fa48("3845", "3846", "3847"), (stryMutAct_9fa48("3848") ? isUpgradeRequired : (stryCov_9fa48("3848"), !isUpgradeRequired)) && toggleAction(action.id)))}>
                          <div className="flex items-start gap-3">
                            <span className="text-2xl">{action.icon}</span>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2">
                                <p className="font-medium text-white">{action.name}</p>
                                {stryMutAct_9fa48("3851") ? isSelected || <span className="text-primary-400">✓</span> : stryMutAct_9fa48("3850") ? false : stryMutAct_9fa48("3849") ? true : (stryCov_9fa48("3849", "3850", "3851"), isSelected && <span className="text-primary-400">✓</span>)}
                              </div>
                              <p className="text-sm text-neutral-400 mt-1">{action.description}</p>
                              <div className="flex gap-2 mt-2">
                                {stryMutAct_9fa48("3854") ? action.integratedTool || <span className="text-xs px-2 py-0.5 bg-neutral-700 rounded text-neutral-300">
                                    {action.integratedTool}
                                  </span> : stryMutAct_9fa48("3853") ? false : stryMutAct_9fa48("3852") ? true : (stryCov_9fa48("3852", "3853", "3854"), action.integratedTool && <span className="text-xs px-2 py-0.5 bg-neutral-700 rounded text-neutral-300">
                                    {action.integratedTool}
                                  </span>)}
                                {stryMutAct_9fa48("3857") ? action.estimatedDuration || <span className="text-xs text-neutral-500">
                                    ~{action.estimatedDuration}
                                  </span> : stryMutAct_9fa48("3856") ? false : stryMutAct_9fa48("3855") ? true : (stryCov_9fa48("3855", "3856", "3857"), action.estimatedDuration && <span className="text-xs text-neutral-500">
                                    ~{action.estimatedDuration}
                                  </span>)}
                                {stryMutAct_9fa48("3860") ? isUpgradeRequired || <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                                    Upgrade Required
                                  </span> : stryMutAct_9fa48("3859") ? false : stryMutAct_9fa48("3858") ? true : (stryCov_9fa48("3858", "3859", "3860"), isUpgradeRequired && <span className="text-xs px-2 py-0.5 bg-orange-500/20 text-orange-400 rounded">
                                    Upgrade Required
                                  </span>)}
                              </div>
                              {/* Priority selector (when selected) */}
                              {stryMutAct_9fa48("3863") ? isSelected || <div className="flex gap-1 mt-3" onClick={e => e.stopPropagation()}>
                                  {(['critical', 'high', 'medium', 'low'] as ActionPriority[]).map(p => <button key={p} onClick={() => setPriority(action.id, p)} className={cn('px-2 py-1 text-xs rounded transition-colors', priorities[action.id] === p ? `${priorityConfig[p].color} text-white` : 'bg-neutral-700 text-neutral-400 hover:text-white')}>
                                      {priorityConfig[p].label}
                                    </button>)}
                                </div> : stryMutAct_9fa48("3862") ? false : stryMutAct_9fa48("3861") ? true : (stryCov_9fa48("3861", "3862", "3863"), isSelected && <div className="flex gap-1 mt-3" onClick={stryMutAct_9fa48("3864") ? () => undefined : (stryCov_9fa48("3864"), e => e.stopPropagation())}>
                                  {(['critical', 'high', 'medium', 'low'] as ActionPriority[]).map(stryMutAct_9fa48("3865") ? () => undefined : (stryCov_9fa48("3865"), p => <button key={p} onClick={stryMutAct_9fa48("3866") ? () => undefined : (stryCov_9fa48("3866"), () => setPriority(action.id, p))} className={cn('px-2 py-1 text-xs rounded transition-colors', (stryMutAct_9fa48("3870") ? priorities[action.id] !== p : stryMutAct_9fa48("3869") ? false : stryMutAct_9fa48("3868") ? true : (stryCov_9fa48("3868", "3869", "3870"), priorities[action.id] === p)) ? `${priorityConfig[p].color} text-white` : 'bg-neutral-700 text-neutral-400 hover:text-white')}>
                                      {priorityConfig[p].label}
                                    </button>))}
                                </div>)}
                            </div>
                          </div>
                        </div>;
              })}
                  </div>
                </div>;
        })}
          </div>)}

        {/* Outputs Tab */}
        {stryMutAct_9fa48("3875") ? activeTab === 'outputs' || <div className="space-y-4">
            {outputs.length === 0 ? <div className="text-center py-12">
                <span className="text-4xl">📭</span>
                <p className="text-neutral-400 mt-4">No outputs yet</p>
                <p className="text-sm text-neutral-500">Execute actions to generate outputs</p>
              </div> : outputs.map((output: any, i) => <div key={i} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">
                      {output.type === 'report' ? '📄' : output.type === 'simulation' ? '🔬' : output.type === 'task' ? '📋' : output.type === 'alert' ? '🔔' : output.type === 'data' ? '📊' : '📦'}
                    </span>
                    <div>
                      <p className="font-medium text-white">{output.name}</p>
                      <p className="text-sm text-neutral-400">{output.description}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">
                      {new Date(output.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {output.data && <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <pre>{typeof output.data === 'string' ? output.data.substring(0, 500) : JSON.stringify(output.data, null, 2)}</pre>
                    </div>}
                </div>)}
          </div> : stryMutAct_9fa48("3874") ? false : stryMutAct_9fa48("3873") ? true : (stryCov_9fa48("3873", "3874", "3875"), (stryMutAct_9fa48("3877") ? activeTab !== 'outputs' : stryMutAct_9fa48("3876") ? true : (stryCov_9fa48("3876", "3877"), activeTab === 'outputs')) && <div className="space-y-4">
            {(stryMutAct_9fa48("3881") ? outputs.length !== 0 : stryMutAct_9fa48("3880") ? false : stryMutAct_9fa48("3879") ? true : (stryCov_9fa48("3879", "3880", "3881"), outputs.length === 0)) ? <div className="text-center py-12">
                <span className="text-4xl">📭</span>
                <p className="text-neutral-400 mt-4">No outputs yet</p>
                <p className="text-sm text-neutral-500">Execute actions to generate outputs</p>
              </div> : outputs.map(stryMutAct_9fa48("3882") ? () => undefined : (stryCov_9fa48("3882"), (output: any, i) => <div key={i} className="bg-neutral-800 rounded-xl p-4 border border-neutral-700">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xl">
                      {(stryMutAct_9fa48("3885") ? output.type !== 'report' : stryMutAct_9fa48("3884") ? false : stryMutAct_9fa48("3883") ? true : (stryCov_9fa48("3883", "3884", "3885"), output.type === 'report')) ? '📄' : (stryMutAct_9fa48("3890") ? output.type !== 'simulation' : stryMutAct_9fa48("3889") ? false : stryMutAct_9fa48("3888") ? true : (stryCov_9fa48("3888", "3889", "3890"), output.type === 'simulation')) ? '🔬' : (stryMutAct_9fa48("3895") ? output.type !== 'task' : stryMutAct_9fa48("3894") ? false : stryMutAct_9fa48("3893") ? true : (stryCov_9fa48("3893", "3894", "3895"), output.type === 'task')) ? '📋' : (stryMutAct_9fa48("3900") ? output.type !== 'alert' : stryMutAct_9fa48("3899") ? false : stryMutAct_9fa48("3898") ? true : (stryCov_9fa48("3898", "3899", "3900"), output.type === 'alert')) ? '🔔' : (stryMutAct_9fa48("3905") ? output.type !== 'data' : stryMutAct_9fa48("3904") ? false : stryMutAct_9fa48("3903") ? true : (stryCov_9fa48("3903", "3904", "3905"), output.type === 'data')) ? '📊' : '📦'}
                    </span>
                    <div>
                      <p className="font-medium text-white">{output.name}</p>
                      <p className="text-sm text-neutral-400">{output.description}</p>
                    </div>
                    <span className="ml-auto text-xs text-neutral-500">
                      {new Date(output.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                  {stryMutAct_9fa48("3911") ? output.data || <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <pre>{typeof output.data === 'string' ? output.data.substring(0, 500) : JSON.stringify(output.data, null, 2)}</pre>
                    </div> : stryMutAct_9fa48("3910") ? false : stryMutAct_9fa48("3909") ? true : (stryCov_9fa48("3909", "3910", "3911"), output.data && <div className="bg-neutral-900 rounded-lg p-3 text-sm font-mono text-neutral-300 overflow-x-auto">
                      <pre>{(stryMutAct_9fa48("3914") ? typeof output.data !== 'string' : stryMutAct_9fa48("3913") ? false : stryMutAct_9fa48("3912") ? true : (stryCov_9fa48("3912", "3913", "3914"), typeof output.data === 'string')) ? stryMutAct_9fa48("3916") ? output.data : (stryCov_9fa48("3916"), output.data.substring(0, 500)) : JSON.stringify(output.data, null, 2)}</pre>
                    </div>)}
                </div>))}
          </div>)}
      </div>

      {/* Footer */}
      <div className="border-t border-neutral-700 p-4 bg-neutral-800/50 flex justify-between items-center">
        <p className="text-sm text-neutral-400">
          Session: {stryMutAct_9fa48("3917") ? session.id : (stryCov_9fa48("3917"), session.id.substring(0, 12))}...
        </p>
        <div className="flex gap-3">
          {stryMutAct_9fa48("3920") ? activeTab !== 'actions' || <button onClick={() => setActiveTab('actions')} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              Choose Actions
            </button> : stryMutAct_9fa48("3919") ? false : stryMutAct_9fa48("3918") ? true : (stryCov_9fa48("3918", "3919", "3920"), (stryMutAct_9fa48("3922") ? activeTab === 'actions' : stryMutAct_9fa48("3921") ? true : (stryCov_9fa48("3921", "3922"), activeTab !== 'actions')) && <button onClick={stryMutAct_9fa48("3924") ? () => undefined : (stryCov_9fa48("3924"), () => setActiveTab('actions'))} className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg text-sm font-medium transition-colors">
              Choose Actions
            </button>)}
          {stryMutAct_9fa48("3928") ? selectedActions.size > 0 && activeTab === 'actions' || <button onClick={executeActions} disabled={executing} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
              {executing ? 'Executing...' : 'Execute Now'}
            </button> : stryMutAct_9fa48("3927") ? false : stryMutAct_9fa48("3926") ? true : (stryCov_9fa48("3926", "3927", "3928"), (stryMutAct_9fa48("3930") ? selectedActions.size > 0 || activeTab === 'actions' : stryMutAct_9fa48("3929") ? true : (stryCov_9fa48("3929", "3930"), (stryMutAct_9fa48("3933") ? selectedActions.size <= 0 : stryMutAct_9fa48("3932") ? selectedActions.size >= 0 : stryMutAct_9fa48("3931") ? true : (stryCov_9fa48("3931", "3932", "3933"), selectedActions.size > 0)) && (stryMutAct_9fa48("3935") ? activeTab !== 'actions' : stryMutAct_9fa48("3934") ? true : (stryCov_9fa48("3934", "3935"), activeTab === 'actions')))) && <button onClick={executeActions} disabled={executing} className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-colors">
              {executing ? 'Executing...' : 'Execute Now'}
            </button>)}
        </div>
      </div>
    </div>;
};
export default PostDeliberationPanel;