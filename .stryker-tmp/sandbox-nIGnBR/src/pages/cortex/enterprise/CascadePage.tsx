/**
 * =============================================================================
 * CENDIA CASCADE PAGE (THE BUTTERFLY EFFECT)
 * =============================================================================
 * Second/Third-Order Consequence Analysis Dashboard
 * 
 * "Predict the unintended consequences of decisions before they become 
 * incidents—then generate the mitigations, approvals, and evidence to 
 * execute safely."
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
import React, { useState, useEffect } from 'react';
import { Activity, AlertTriangle, ArrowRight, BarChart3, Bug, CheckCircle2, ChevronDown, ChevronRight, Clock, FileText, GitBranch, Layers, Network, Play, Plus, RefreshCw, Shield, Target, TrendingUp, XCircle, Zap } from 'lucide-react';

// =============================================================================
// TYPES
// =============================================================================

interface ChangeSpec {
  type: string;
  title: string;
  description: string;
  affectedAssets: string[];
  expectedBenefit: string;
  constraints?: {
    budgetCeiling?: number;
    timelineDays?: number;
    noGoLines?: string[];
  };
}
interface Consequence {
  nodeId: string;
  nodeName: string;
  nodeType: string;
  category: string;
  description: string;
  severity: string;
  likelihood: string;
  riskScore: number;
  latencyDays: number;
  order: number;
  confidence: number;
  evidenceBasis: string;
  pathDescription: string;
}
interface CascadeReport {
  id: string;
  changeSpec: ChangeSpec;
  timestamp: string;
  status: string;
  consequences: Consequence[];
  totalRiskScore: number;
  recommendation: string;
  rationale: string;
  butterflyEffect?: Consequence;
  mitigations: any[];
  guardrails: any[];
}
interface GraphStats {
  nodeCount: number;
  edgeCount: number;
  avgDegree: number;
  nodeTypeDistribution: Record<string, number>;
}

// =============================================================================
// COMPONENTS
// =============================================================================

const SeverityBadge: React.FC<{
  severity: string;
}> = ({
  severity
}) => {
  const colors: Record<string, string> = stryMutAct_9fa48("27818") ? {} : (stryCov_9fa48("27818"), {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
  });
  return <span className={`px-2 py-0.5 rounded text-xs font-medium border ${stryMutAct_9fa48("27827") ? colors[severity] && colors.minimal : stryMutAct_9fa48("27826") ? false : stryMutAct_9fa48("27825") ? true : (stryCov_9fa48("27825", "27826", "27827"), colors[severity] || colors.minimal)}`}>
      {stryMutAct_9fa48("27828") ? severity.toLowerCase() : (stryCov_9fa48("27828"), severity.toUpperCase())}
    </span>;
};
const RecommendationBadge: React.FC<{
  recommendation: string;
}> = ({
  recommendation
}) => {
  const config: Record<string, {
    color: string;
    icon: React.ReactNode;
  }> = stryMutAct_9fa48("27830") ? {} : (stryCov_9fa48("27830"), {
    proceed: stryMutAct_9fa48("27831") ? {} : (stryCov_9fa48("27831"), {
      color: 'bg-green-500/20 text-green-400',
      icon: <CheckCircle2 className="w-4 h-4" />
    }),
    proceed_with_caution: stryMutAct_9fa48("27833") ? {} : (stryCov_9fa48("27833"), {
      color: 'bg-yellow-500/20 text-yellow-400',
      icon: <AlertTriangle className="w-4 h-4" />
    }),
    reconsider: stryMutAct_9fa48("27835") ? {} : (stryCov_9fa48("27835"), {
      color: 'bg-orange-500/20 text-orange-400',
      icon: <RefreshCw className="w-4 h-4" />
    }),
    reject: stryMutAct_9fa48("27837") ? {} : (stryCov_9fa48("27837"), {
      color: 'bg-red-500/20 text-red-400',
      icon: <XCircle className="w-4 h-4" />
    })
  });
  const {
    color,
    icon
  } = stryMutAct_9fa48("27841") ? config[recommendation] && config.proceed : stryMutAct_9fa48("27840") ? false : stryMutAct_9fa48("27839") ? true : (stryCov_9fa48("27839", "27840", "27841"), config[recommendation] || config.proceed);
  return <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${color}`}>
      {icon}
      {stryMutAct_9fa48("27843") ? recommendation.replace(/_/g, ' ').toLowerCase() : (stryCov_9fa48("27843"), recommendation.replace(/_/g, ' ').toUpperCase())}
    </span>;
};
const TimelineWave: React.FC<{
  label: string;
  effects: any[];
  color: string;
  expanded: boolean;
  onToggle: () => void;
}> = stryMutAct_9fa48("27845") ? () => undefined : (stryCov_9fa48("27845"), (() => {
  const TimelineWave: React.FC<{
    label: string;
    effects: any[];
    color: string;
    expanded: boolean;
    onToggle: () => void;
  }> = ({
    label,
    effects,
    color,
    expanded,
    onToggle
  }) => <div className="border border-gray-700 rounded-lg overflow-hidden">
    <button onClick={onToggle} className="w-full px-4 py-3 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 transition-colors">
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full`} style={stryMutAct_9fa48("27847") ? {} : (stryCov_9fa48("27847"), {
          backgroundColor: color
        })} />
        <span className="font-medium">{label}</span>
        <span className="text-gray-400 text-sm">({effects.length} effects)</span>
      </div>
      {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
    {stryMutAct_9fa48("27850") ? expanded && effects.length > 0 || <div className="px-4 py-3 space-y-2 bg-gray-900/50">
        {effects.map((effect, idx) => <div key={idx} className="flex items-center justify-between text-sm">
            <span>{typeof effect === 'string' ? effect : effect.name || effect.nodeName}</span>
            {effect.severity && <SeverityBadge severity={effect.severity} />}
          </div>)}
      </div> : stryMutAct_9fa48("27849") ? false : stryMutAct_9fa48("27848") ? true : (stryCov_9fa48("27848", "27849", "27850"), (stryMutAct_9fa48("27852") ? expanded || effects.length > 0 : stryMutAct_9fa48("27851") ? true : (stryCov_9fa48("27851", "27852"), expanded && (stryMutAct_9fa48("27855") ? effects.length <= 0 : stryMutAct_9fa48("27854") ? effects.length >= 0 : stryMutAct_9fa48("27853") ? true : (stryCov_9fa48("27853", "27854", "27855"), effects.length > 0)))) && <div className="px-4 py-3 space-y-2 bg-gray-900/50">
        {effects.map(stryMutAct_9fa48("27856") ? () => undefined : (stryCov_9fa48("27856"), (effect, idx) => <div key={idx} className="flex items-center justify-between text-sm">
            <span>{(stryMutAct_9fa48("27859") ? typeof effect !== 'string' : stryMutAct_9fa48("27858") ? false : stryMutAct_9fa48("27857") ? true : (stryCov_9fa48("27857", "27858", "27859"), typeof effect === 'string')) ? effect : stryMutAct_9fa48("27863") ? effect.name && effect.nodeName : stryMutAct_9fa48("27862") ? false : stryMutAct_9fa48("27861") ? true : (stryCov_9fa48("27861", "27862", "27863"), effect.name || effect.nodeName)}</span>
            {stryMutAct_9fa48("27866") ? effect.severity || <SeverityBadge severity={effect.severity} /> : stryMutAct_9fa48("27865") ? false : stryMutAct_9fa48("27864") ? true : (stryCov_9fa48("27864", "27865", "27866"), effect.severity && <SeverityBadge severity={effect.severity} />)}
          </div>))}
      </div>)}
  </div>;
  return TimelineWave;
})());

// =============================================================================
// MAIN PAGE
// =============================================================================

const CascadePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'reports' | 'graph'>('analyze');
  const [reports, setReports] = useState<CascadeReport[]>(stryMutAct_9fa48("27869") ? ["Stryker was here"] : (stryCov_9fa48("27869"), []));
  const [selectedReport, setSelectedReport] = useState<CascadeReport | null>(null);
  const [graphStats, setGraphStats] = useState<GraphStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(stryMutAct_9fa48("27870") ? true : (stryCov_9fa48("27870"), false));
  const [expandedWaves, setExpandedWaves] = useState<Set<string>>(new Set(stryMutAct_9fa48("27871") ? [] : (stryCov_9fa48("27871"), ['T+0'])));

  // Form state
  const [changeForm, setChangeForm] = useState<ChangeSpec>(stryMutAct_9fa48("27873") ? {} : (stryCov_9fa48("27873"), {
    type: 'policy',
    title: '',
    description: '',
    affectedAssets: stryMutAct_9fa48("27877") ? ["Stryker was here"] : (stryCov_9fa48("27877"), []),
    expectedBenefit: '',
    constraints: stryMutAct_9fa48("27879") ? {} : (stryCov_9fa48("27879"), {
      noGoLines: stryMutAct_9fa48("27880") ? ["Stryker was here"] : (stryCov_9fa48("27880"), [])
    })
  }));
  const [assetInput, setAssetInput] = useState('');

  // Load initial data
  useEffect(() => {
    loadReports();
    loadGraphStats();
  }, stryMutAct_9fa48("27883") ? ["Stryker was here"] : (stryCov_9fa48("27883"), []));
  const loadReports = async () => {
    try {
      const res = await fetch('/api/v1/cascade/reports');
      if (stryMutAct_9fa48("27888") ? false : stryMutAct_9fa48("27887") ? true : (stryCov_9fa48("27887", "27888"), res.ok)) {
        const data = await res.json();
        setReports(stryMutAct_9fa48("27892") ? data.reports && [] : stryMutAct_9fa48("27891") ? false : stryMutAct_9fa48("27890") ? true : (stryCov_9fa48("27890", "27891", "27892"), data.reports || (stryMutAct_9fa48("27893") ? ["Stryker was here"] : (stryCov_9fa48("27893"), []))));
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };
  const loadGraphStats = async () => {
    try {
      const res = await fetch('/api/v1/cascade/graph/stats');
      if (stryMutAct_9fa48("27900") ? false : stryMutAct_9fa48("27899") ? true : (stryCov_9fa48("27899", "27900"), res.ok)) {
        const data = await res.json();
        setGraphStats(data);
      }
    } catch (error) {
      console.error('Failed to load graph stats:', error);
    }
  };
  const loadSampleGraph = async () => {
    try {
      const res = await fetch('/api/v1/cascade/demo/load-sample', stryMutAct_9fa48("27907") ? {} : (stryCov_9fa48("27907"), {
        method: 'POST'
      }));
      if (stryMutAct_9fa48("27910") ? false : stryMutAct_9fa48("27909") ? true : (stryCov_9fa48("27909", "27910"), res.ok)) {
        await loadGraphStats();
        alert('Sample organization graph loaded!');
      }
    } catch (error) {
      console.error('Failed to load sample graph:', error);
    }
  };
  const analyzeChange = async () => {
    if (stryMutAct_9fa48("27918") ? (!changeForm.title || !changeForm.description) && changeForm.affectedAssets.length === 0 : stryMutAct_9fa48("27917") ? false : stryMutAct_9fa48("27916") ? true : (stryCov_9fa48("27916", "27917", "27918"), (stryMutAct_9fa48("27920") ? !changeForm.title && !changeForm.description : stryMutAct_9fa48("27919") ? false : (stryCov_9fa48("27919", "27920"), (stryMutAct_9fa48("27921") ? changeForm.title : (stryCov_9fa48("27921"), !changeForm.title)) || (stryMutAct_9fa48("27922") ? changeForm.description : (stryCov_9fa48("27922"), !changeForm.description)))) || (stryMutAct_9fa48("27924") ? changeForm.affectedAssets.length !== 0 : stryMutAct_9fa48("27923") ? false : (stryCov_9fa48("27923", "27924"), changeForm.affectedAssets.length === 0)))) {
      alert('Please fill in all required fields');
      return;
    }
    setIsAnalyzing(stryMutAct_9fa48("27927") ? false : (stryCov_9fa48("27927"), true));
    try {
      const res = await fetch('/api/v1/cascade/analyze', stryMutAct_9fa48("27930") ? {} : (stryCov_9fa48("27930"), {
        method: 'POST',
        headers: stryMutAct_9fa48("27932") ? {} : (stryCov_9fa48("27932"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(changeForm)
      }));
      if (stryMutAct_9fa48("27935") ? false : stryMutAct_9fa48("27934") ? true : (stryCov_9fa48("27934", "27935"), res.ok)) {
        const data = await res.json();
        setSelectedReport(data.report);
        await loadReports();
        setActiveTab('reports');
      } else {
        const error = await res.json();
        alert(`Analysis failed: ${stryMutAct_9fa48("27942") ? error.message && error.error : stryMutAct_9fa48("27941") ? false : stryMutAct_9fa48("27940") ? true : (stryCov_9fa48("27940", "27941", "27942"), error.message || error.error)}`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Check console for details.');
    } finally {
      setIsAnalyzing(stryMutAct_9fa48("27947") ? true : (stryCov_9fa48("27947"), false));
    }
  };
  const addAsset = () => {
    if (stryMutAct_9fa48("27951") ? assetInput : stryMutAct_9fa48("27950") ? false : stryMutAct_9fa48("27949") ? true : (stryCov_9fa48("27949", "27950", "27951"), assetInput.trim())) {
      setChangeForm(stryMutAct_9fa48("27953") ? {} : (stryCov_9fa48("27953"), {
        ...changeForm,
        affectedAssets: stryMutAct_9fa48("27954") ? [] : (stryCov_9fa48("27954"), [...changeForm.affectedAssets, stryMutAct_9fa48("27955") ? assetInput : (stryCov_9fa48("27955"), assetInput.trim())])
      }));
      setAssetInput('');
    }
  };
  const removeAsset = (index: number) => {
    setChangeForm(stryMutAct_9fa48("27958") ? {} : (stryCov_9fa48("27958"), {
      ...changeForm,
      affectedAssets: stryMutAct_9fa48("27959") ? changeForm.affectedAssets : (stryCov_9fa48("27959"), changeForm.affectedAssets.filter(stryMutAct_9fa48("27960") ? () => undefined : (stryCov_9fa48("27960"), (_, i) => stryMutAct_9fa48("27963") ? i === index : stryMutAct_9fa48("27962") ? false : stryMutAct_9fa48("27961") ? true : (stryCov_9fa48("27961", "27962", "27963"), i !== index))))
    }));
  };
  const toggleWave = (label: string) => {
    const newExpanded = new Set(expandedWaves);
    if (stryMutAct_9fa48("27966") ? false : stryMutAct_9fa48("27965") ? true : (stryCov_9fa48("27965", "27966"), newExpanded.has(label))) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedWaves(newExpanded);
  };
  return <div className="min-h-screen bg-gray-950 text-white">
      {/* Header */}
      <div className="border-b border-gray-800 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-3">
                <div className="p-2 bg-purple-500/20 rounded-lg">
                  <Bug className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold">CendiaCascade™</h1>
                  <p className="text-gray-400 text-sm">The Butterfly Effect — Second/Third-Order Consequence Analysis</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {stryMutAct_9fa48("27971") ? graphStats || <div className="text-sm text-gray-400">
                  Graph: {graphStats.nodeCount} nodes, {graphStats.edgeCount} edges
                </div> : stryMutAct_9fa48("27970") ? false : stryMutAct_9fa48("27969") ? true : (stryCov_9fa48("27969", "27970", "27971"), graphStats && <div className="text-sm text-gray-400">
                  Graph: {graphStats.nodeCount} nodes, {graphStats.edgeCount} edges
                </div>)}
              <button onClick={loadSampleGraph} className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors">
                Load Sample Graph
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {(stryMutAct_9fa48("27972") ? [] : (stryCov_9fa48("27972"), [stryMutAct_9fa48("27973") ? {} : (stryCov_9fa48("27973"), {
            id: 'analyze',
            label: 'Analyze Change',
            icon: <Zap className="w-4 h-4" />
          }), stryMutAct_9fa48("27976") ? {} : (stryCov_9fa48("27976"), {
            id: 'reports',
            label: 'Reports',
            icon: <FileText className="w-4 h-4" />
          }), stryMutAct_9fa48("27979") ? {} : (stryCov_9fa48("27979"), {
            id: 'graph',
            label: 'Organization Graph',
            icon: <Network className="w-4 h-4" />
          })])).map(stryMutAct_9fa48("27982") ? () => undefined : (stryCov_9fa48("27982"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("27983") ? () => undefined : (stryCov_9fa48("27983"), () => setActiveTab(tab.id as any))} className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${(stryMutAct_9fa48("27987") ? activeTab !== tab.id : stryMutAct_9fa48("27986") ? false : stryMutAct_9fa48("27985") ? true : (stryCov_9fa48("27985", "27986", "27987"), activeTab === tab.id)) ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'}`}>
                {tab.icon}
                {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analyze Tab */}
        {stryMutAct_9fa48("27992") ? activeTab === 'analyze' || <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Change Specification Form */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Propose a Change
                </h2>

                <div className="space-y-4">
                  {/* Change Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Change Type</label>
                    <select value={changeForm.type} onChange={e => setChangeForm({
                  ...changeForm,
                  type: e.target.value
                })} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="policy">Policy</option>
                      <option value="pricing">Pricing</option>
                      <option value="staffing">Staffing</option>
                      <option value="vendor">Vendor</option>
                      <option value="technology">Technology</option>
                      <option value="process">Process</option>
                      <option value="product">Product</option>
                      <option value="market">Market</option>
                      <option value="regulatory">Regulatory</option>
                      <option value="security">Security</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                    <input type="text" value={changeForm.title} onChange={e => setChangeForm({
                  ...changeForm,
                  title: e.target.value
                })} placeholder="e.g., Reduce engineering headcount by 10%" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                    <textarea value={changeForm.description} onChange={e => setChangeForm({
                  ...changeForm,
                  description: e.target.value
                })} placeholder="Describe the proposed change in detail..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  {/* Affected Assets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Affected Assets *</label>
                    <div className="flex gap-2">
                      <input type="text" value={assetInput} onChange={e => setAssetInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && addAsset()} placeholder="Enter node ID (e.g., eng-team)" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      <button onClick={addAsset} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {changeForm.affectedAssets.length > 0 && <div className="flex flex-wrap gap-2 mt-2">
                        {changeForm.affectedAssets.map((asset, idx) => <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-sm flex items-center gap-1">
                            {asset}
                            <button onClick={() => removeAsset(idx)} className="text-gray-400 hover:text-white">
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>)}
                      </div>}
                  </div>

                  {/* Expected Benefit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expected Benefit</label>
                    <input type="text" value={changeForm.expectedBenefit} onChange={e => setChangeForm({
                  ...changeForm,
                  expectedBenefit: e.target.value
                })} placeholder="e.g., Reduce operating costs by $2M annually" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  {/* Analyze Button */}
                  <button onClick={analyzeChange} disabled={isAnalyzing} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    {isAnalyzing ? <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing Consequences...
                      </> : <>
                        <Play className="w-5 h-5" />
                        Analyze Butterfly Effect
                      </>}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-purple-400" />
                  What is the Butterfly Effect?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Most executives are good at <strong>first-order thinking</strong> ("If we fire 10% of staff, 
                  costs go down"). They're terrible at <strong>second and third-order thinking</strong> 
                  ("...which causes morale to drop, which causes our best engineer to quit, which causes 
                  the server to crash, which loses our biggest client").
                </p>
                <p className="text-gray-400 text-sm">
                  CendiaCascade™ traces your decisions through the Knowledge Graph to find the 
                  <strong className="text-purple-400"> Invisible Consequences</strong>.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  How It Works
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">1</div>
                    <div>
                      <strong>Node Identification</strong>
                      <p className="text-gray-400">You propose a change to Node A (e.g., "Engineering Team")</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">2</div>
                    <div>
                      <strong>Graph Traversal</strong>
                      <p className="text-gray-400">System finds all connected nodes (Products, Revenue, Customers)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">3</div>
                    <div>
                      <strong>Recursive Simulation</strong>
                      <p className="text-gray-400">Impact propagates through the graph until probability drops</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">4</div>
                    <div>
                      <strong>Butterfly Detection</strong>
                      <p className="text-gray-400">Find the unexpected 3rd-order consequence you didn't see coming</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("27991") ? false : stryMutAct_9fa48("27990") ? true : (stryCov_9fa48("27990", "27991", "27992"), (stryMutAct_9fa48("27994") ? activeTab !== 'analyze' : stryMutAct_9fa48("27993") ? true : (stryCov_9fa48("27993", "27994"), activeTab === 'analyze')) && <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Change Specification Form */}
            <div className="space-y-6">
              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-purple-400" />
                  Propose a Change
                </h2>

                <div className="space-y-4">
                  {/* Change Type */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Change Type</label>
                    <select value={changeForm.type} onChange={stryMutAct_9fa48("27996") ? () => undefined : (stryCov_9fa48("27996"), e => setChangeForm(stryMutAct_9fa48("27997") ? {} : (stryCov_9fa48("27997"), {
                  ...changeForm,
                  type: e.target.value
                })))} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="policy">Policy</option>
                      <option value="pricing">Pricing</option>
                      <option value="staffing">Staffing</option>
                      <option value="vendor">Vendor</option>
                      <option value="technology">Technology</option>
                      <option value="process">Process</option>
                      <option value="product">Product</option>
                      <option value="market">Market</option>
                      <option value="regulatory">Regulatory</option>
                      <option value="security">Security</option>
                    </select>
                  </div>

                  {/* Title */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Title *</label>
                    <input type="text" value={changeForm.title} onChange={stryMutAct_9fa48("27998") ? () => undefined : (stryCov_9fa48("27998"), e => setChangeForm(stryMutAct_9fa48("27999") ? {} : (stryCov_9fa48("27999"), {
                  ...changeForm,
                  title: e.target.value
                })))} placeholder="e.g., Reduce engineering headcount by 10%" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                    <textarea value={changeForm.description} onChange={stryMutAct_9fa48("28000") ? () => undefined : (stryCov_9fa48("28000"), e => setChangeForm(stryMutAct_9fa48("28001") ? {} : (stryCov_9fa48("28001"), {
                  ...changeForm,
                  description: e.target.value
                })))} placeholder="Describe the proposed change in detail..." rows={3} className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  {/* Affected Assets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Affected Assets *</label>
                    <div className="flex gap-2">
                      <input type="text" value={assetInput} onChange={stryMutAct_9fa48("28002") ? () => undefined : (stryCov_9fa48("28002"), e => setAssetInput(e.target.value))} onKeyPress={stryMutAct_9fa48("28003") ? () => undefined : (stryCov_9fa48("28003"), e => stryMutAct_9fa48("28006") ? e.key === 'Enter' || addAsset() : stryMutAct_9fa48("28005") ? false : stryMutAct_9fa48("28004") ? true : (stryCov_9fa48("28004", "28005", "28006"), (stryMutAct_9fa48("28008") ? e.key !== 'Enter' : stryMutAct_9fa48("28007") ? true : (stryCov_9fa48("28007", "28008"), e.key === 'Enter')) && addAsset()))} placeholder="Enter node ID (e.g., eng-team)" className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                      <button onClick={addAsset} className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors">
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {stryMutAct_9fa48("28012") ? changeForm.affectedAssets.length > 0 || <div className="flex flex-wrap gap-2 mt-2">
                        {changeForm.affectedAssets.map((asset, idx) => <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-sm flex items-center gap-1">
                            {asset}
                            <button onClick={() => removeAsset(idx)} className="text-gray-400 hover:text-white">
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>)}
                      </div> : stryMutAct_9fa48("28011") ? false : stryMutAct_9fa48("28010") ? true : (stryCov_9fa48("28010", "28011", "28012"), (stryMutAct_9fa48("28015") ? changeForm.affectedAssets.length <= 0 : stryMutAct_9fa48("28014") ? changeForm.affectedAssets.length >= 0 : stryMutAct_9fa48("28013") ? true : (stryCov_9fa48("28013", "28014", "28015"), changeForm.affectedAssets.length > 0)) && <div className="flex flex-wrap gap-2 mt-2">
                        {changeForm.affectedAssets.map(stryMutAct_9fa48("28016") ? () => undefined : (stryCov_9fa48("28016"), (asset, idx) => <span key={idx} className="px-2 py-1 bg-gray-800 rounded text-sm flex items-center gap-1">
                            {asset}
                            <button onClick={stryMutAct_9fa48("28017") ? () => undefined : (stryCov_9fa48("28017"), () => removeAsset(idx))} className="text-gray-400 hover:text-white">
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>))}
                      </div>)}
                  </div>

                  {/* Expected Benefit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expected Benefit</label>
                    <input type="text" value={changeForm.expectedBenefit} onChange={stryMutAct_9fa48("28018") ? () => undefined : (stryCov_9fa48("28018"), e => setChangeForm(stryMutAct_9fa48("28019") ? {} : (stryCov_9fa48("28019"), {
                  ...changeForm,
                  expectedBenefit: e.target.value
                })))} placeholder="e.g., Reduce operating costs by $2M annually" className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>

                  {/* Analyze Button */}
                  <button onClick={analyzeChange} disabled={isAnalyzing} className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-colors">
                    {isAnalyzing ? <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing Consequences...
                      </> : <>
                        <Play className="w-5 h-5" />
                        Analyze Butterfly Effect
                      </>}
                  </button>
                </div>
              </div>
            </div>

            {/* Info Panel */}
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-purple-900/30 to-gray-900 border border-purple-800/30 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Bug className="w-5 h-5 text-purple-400" />
                  What is the Butterfly Effect?
                </h3>
                <p className="text-gray-300 text-sm mb-4">
                  Most executives are good at <strong>first-order thinking</strong> ("If we fire 10% of staff, 
                  costs go down"). They're terrible at <strong>second and third-order thinking</strong> 
                  ("...which causes morale to drop, which causes our best engineer to quit, which causes 
                  the server to crash, which loses our biggest client").
                </p>
                <p className="text-gray-400 text-sm">
                  CendiaCascade™ traces your decisions through the Knowledge Graph to find the 
                  <strong className="text-purple-400"> Invisible Consequences</strong>.
                </p>
              </div>

              <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-blue-400" />
                  How It Works
                </h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">1</div>
                    <div>
                      <strong>Node Identification</strong>
                      <p className="text-gray-400">You propose a change to Node A (e.g., "Engineering Team")</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">2</div>
                    <div>
                      <strong>Graph Traversal</strong>
                      <p className="text-gray-400">System finds all connected nodes (Products, Revenue, Customers)</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400 flex-shrink-0">3</div>
                    <div>
                      <strong>Recursive Simulation</strong>
                      <p className="text-gray-400">Impact propagates through the graph until probability drops</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center text-purple-400 flex-shrink-0">4</div>
                    <div>
                      <strong>Butterfly Detection</strong>
                      <p className="text-gray-400">Find the unexpected 3rd-order consequence you didn't see coming</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>)}

        {/* Reports Tab */}
        {stryMutAct_9fa48("28022") ? activeTab === 'reports' || <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Cascade Reports ({reports.length})
              </h2>
              {reports.length === 0 ? <div className="text-gray-500 text-center py-8">
                  No reports yet. Analyze a change to get started.
                </div> : <div className="space-y-2">
                  {reports.map(report => <button key={report.id} onClick={() => setSelectedReport(report as any)} className={`w-full text-left p-4 rounded-lg border transition-colors ${selectedReport?.id === report.id ? 'bg-purple-900/30 border-purple-700' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {report.consequenceCount} consequences • Risk: {report.totalRiskScore}
                      </div>
                      <div className="mt-2">
                        <RecommendationBadge recommendation={report.recommendation} />
                      </div>
                    </button>)}
                </div>}
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2">
              {selectedReport ? <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedReport.changeSpec.title}</h2>
                        <p className="text-gray-400 mt-1">{selectedReport.changeSpec.description}</p>
                      </div>
                      <RecommendationBadge recommendation={selectedReport.recommendation} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold">{selectedReport.consequences.length}</div>
                        <div className="text-sm text-gray-400">Total Consequences</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-400">{selectedReport.totalRiskScore}</div>
                        <div className="text-sm text-gray-400">Risk Score</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">
                          {selectedReport.consequences.filter(c => c.order >= 3).length}
                        </div>
                        <div className="text-sm text-gray-400">Butterfly Effects</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-4 p-3 bg-gray-800/30 rounded-lg">
                      <strong>Rationale:</strong> {selectedReport.rationale}
                    </p>
                  </div>

                  {/* Butterfly Effect Highlight */}
                  {selectedReport.butterflyEffect && <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <Bug className="w-5 h-5 text-purple-400" />
                        🦋 The Butterfly Effect Detected
                      </h3>
                      <div className="text-lg font-medium text-purple-300">
                        {selectedReport.butterflyEffect.nodeName}
                      </div>
                      <p className="text-gray-300 mt-2">{selectedReport.butterflyEffect.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          T+{selectedReport.butterflyEffect.latencyDays} days
                        </span>
                        <SeverityBadge severity={selectedReport.butterflyEffect.severity} />
                        <span className="text-gray-400">Order: {selectedReport.butterflyEffect.order}</span>
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <strong>Path:</strong> {selectedReport.butterflyEffect.pathDescription}
                      </div>
                    </div>}

                  {/* Consequences by Order */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                      Cascade Timeline
                    </h3>
                    <div className="space-y-3">
                      <TimelineWave label="T+0: Direct Impacts (1st Order)" effects={selectedReport.consequences.filter(c => c.order === 1)} color="#3b82f6" expanded={expandedWaves.has('T+0')} onToggle={() => toggleWave('T+0')} />
                      <TimelineWave label="T+30: Ripple Effects (2nd Order)" effects={selectedReport.consequences.filter(c => c.order === 2)} color="#f59e0b" expanded={expandedWaves.has('T+30')} onToggle={() => toggleWave('T+30')} />
                      <TimelineWave label="T+90+: Butterfly Effects (3rd+ Order)" effects={selectedReport.consequences.filter(c => c.order >= 3)} color="#8b5cf6" expanded={expandedWaves.has('T+90')} onToggle={() => toggleWave('T+90')} />
                    </div>
                  </div>

                  {/* Mitigations */}
                  {selectedReport.mitigations.length > 0 && <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Recommended Mitigations ({selectedReport.mitigations.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedReport.mitigations.slice(0, 5).map((m, idx) => <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${m.type === 'prevent' ? 'bg-green-500/20 text-green-400' : m.type === 'detect' ? 'bg-blue-500/20 text-blue-400' : m.type === 'respond' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {m.type.toUpperCase()}
                              </span>
                              <span className="font-medium">{m.description}</span>
                            </div>
                            <p className="text-sm text-gray-400">{m.implementation}</p>
                          </div>)}
                      </div>
                    </div>}
                </div> : <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a report to view details
                </div>}
            </div>
          </div> : stryMutAct_9fa48("28021") ? false : stryMutAct_9fa48("28020") ? true : (stryCov_9fa48("28020", "28021", "28022"), (stryMutAct_9fa48("28024") ? activeTab !== 'reports' : stryMutAct_9fa48("28023") ? true : (stryCov_9fa48("28023", "28024"), activeTab === 'reports')) && <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Cascade Reports ({reports.length})
              </h2>
              {(stryMutAct_9fa48("28028") ? reports.length !== 0 : stryMutAct_9fa48("28027") ? false : stryMutAct_9fa48("28026") ? true : (stryCov_9fa48("28026", "28027", "28028"), reports.length === 0)) ? <div className="text-gray-500 text-center py-8">
                  No reports yet. Analyze a change to get started.
                </div> : <div className="space-y-2">
                  {reports.map(stryMutAct_9fa48("28029") ? () => undefined : (stryCov_9fa48("28029"), report => <button key={report.id} onClick={stryMutAct_9fa48("28030") ? () => undefined : (stryCov_9fa48("28030"), () => setSelectedReport(report as any))} className={`w-full text-left p-4 rounded-lg border transition-colors ${(stryMutAct_9fa48("28034") ? selectedReport?.id !== report.id : stryMutAct_9fa48("28033") ? false : stryMutAct_9fa48("28032") ? true : (stryCov_9fa48("28032", "28033", "28034"), (stryMutAct_9fa48("28035") ? selectedReport.id : (stryCov_9fa48("28035"), selectedReport?.id)) === report.id)) ? 'bg-purple-900/30 border-purple-700' : 'bg-gray-900 border-gray-800 hover:border-gray-700'}`}>
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {report.consequenceCount} consequences • Risk: {report.totalRiskScore}
                      </div>
                      <div className="mt-2">
                        <RecommendationBadge recommendation={report.recommendation} />
                      </div>
                    </button>))}
                </div>}
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2">
              {selectedReport ? <div className="space-y-6">
                  {/* Header */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h2 className="text-xl font-semibold">{selectedReport.changeSpec.title}</h2>
                        <p className="text-gray-400 mt-1">{selectedReport.changeSpec.description}</p>
                      </div>
                      <RecommendationBadge recommendation={selectedReport.recommendation} />
                    </div>
                    <div className="grid grid-cols-3 gap-4 mt-4">
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold">{selectedReport.consequences.length}</div>
                        <div className="text-sm text-gray-400">Total Consequences</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-red-400">{selectedReport.totalRiskScore}</div>
                        <div className="text-sm text-gray-400">Risk Score</div>
                      </div>
                      <div className="bg-gray-800/50 rounded-lg p-3">
                        <div className="text-2xl font-bold text-purple-400">
                          {stryMutAct_9fa48("28038") ? selectedReport.consequences.length : (stryCov_9fa48("28038"), selectedReport.consequences.filter(stryMutAct_9fa48("28039") ? () => undefined : (stryCov_9fa48("28039"), c => stryMutAct_9fa48("28043") ? c.order < 3 : stryMutAct_9fa48("28042") ? c.order > 3 : stryMutAct_9fa48("28041") ? false : stryMutAct_9fa48("28040") ? true : (stryCov_9fa48("28040", "28041", "28042", "28043"), c.order >= 3))).length)}
                        </div>
                        <div className="text-sm text-gray-400">Butterfly Effects</div>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 mt-4 p-3 bg-gray-800/30 rounded-lg">
                      <strong>Rationale:</strong> {selectedReport.rationale}
                    </p>
                  </div>

                  {/* Butterfly Effect Highlight */}
                  {stryMutAct_9fa48("28046") ? selectedReport.butterflyEffect || <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <Bug className="w-5 h-5 text-purple-400" />
                        🦋 The Butterfly Effect Detected
                      </h3>
                      <div className="text-lg font-medium text-purple-300">
                        {selectedReport.butterflyEffect.nodeName}
                      </div>
                      <p className="text-gray-300 mt-2">{selectedReport.butterflyEffect.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          T+{selectedReport.butterflyEffect.latencyDays} days
                        </span>
                        <SeverityBadge severity={selectedReport.butterflyEffect.severity} />
                        <span className="text-gray-400">Order: {selectedReport.butterflyEffect.order}</span>
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <strong>Path:</strong> {selectedReport.butterflyEffect.pathDescription}
                      </div>
                    </div> : stryMutAct_9fa48("28045") ? false : stryMutAct_9fa48("28044") ? true : (stryCov_9fa48("28044", "28045", "28046"), selectedReport.butterflyEffect && <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6">
                      <h3 className="text-lg font-semibold flex items-center gap-2 mb-3">
                        <Bug className="w-5 h-5 text-purple-400" />
                        🦋 The Butterfly Effect Detected
                      </h3>
                      <div className="text-lg font-medium text-purple-300">
                        {selectedReport.butterflyEffect.nodeName}
                      </div>
                      <p className="text-gray-300 mt-2">{selectedReport.butterflyEffect.description}</p>
                      <div className="flex items-center gap-4 mt-3 text-sm">
                        <span className="text-gray-400">
                          <Clock className="w-4 h-4 inline mr-1" />
                          T+{selectedReport.butterflyEffect.latencyDays} days
                        </span>
                        <SeverityBadge severity={selectedReport.butterflyEffect.severity} />
                        <span className="text-gray-400">Order: {selectedReport.butterflyEffect.order}</span>
                      </div>
                      <div className="mt-3 text-sm text-gray-400">
                        <strong>Path:</strong> {selectedReport.butterflyEffect.pathDescription}
                      </div>
                    </div>)}

                  {/* Consequences by Order */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                      Cascade Timeline
                    </h3>
                    <div className="space-y-3">
                      <TimelineWave label="T+0: Direct Impacts (1st Order)" effects={stryMutAct_9fa48("28047") ? selectedReport.consequences : (stryCov_9fa48("28047"), selectedReport.consequences.filter(stryMutAct_9fa48("28048") ? () => undefined : (stryCov_9fa48("28048"), c => stryMutAct_9fa48("28051") ? c.order !== 1 : stryMutAct_9fa48("28050") ? false : stryMutAct_9fa48("28049") ? true : (stryCov_9fa48("28049", "28050", "28051"), c.order === 1))))} color="#3b82f6" expanded={expandedWaves.has('T+0')} onToggle={stryMutAct_9fa48("28053") ? () => undefined : (stryCov_9fa48("28053"), () => toggleWave('T+0'))} />
                      <TimelineWave label="T+30: Ripple Effects (2nd Order)" effects={stryMutAct_9fa48("28055") ? selectedReport.consequences : (stryCov_9fa48("28055"), selectedReport.consequences.filter(stryMutAct_9fa48("28056") ? () => undefined : (stryCov_9fa48("28056"), c => stryMutAct_9fa48("28059") ? c.order !== 2 : stryMutAct_9fa48("28058") ? false : stryMutAct_9fa48("28057") ? true : (stryCov_9fa48("28057", "28058", "28059"), c.order === 2))))} color="#f59e0b" expanded={expandedWaves.has('T+30')} onToggle={stryMutAct_9fa48("28061") ? () => undefined : (stryCov_9fa48("28061"), () => toggleWave('T+30'))} />
                      <TimelineWave label="T+90+: Butterfly Effects (3rd+ Order)" effects={stryMutAct_9fa48("28063") ? selectedReport.consequences : (stryCov_9fa48("28063"), selectedReport.consequences.filter(stryMutAct_9fa48("28064") ? () => undefined : (stryCov_9fa48("28064"), c => stryMutAct_9fa48("28068") ? c.order < 3 : stryMutAct_9fa48("28067") ? c.order > 3 : stryMutAct_9fa48("28066") ? false : stryMutAct_9fa48("28065") ? true : (stryCov_9fa48("28065", "28066", "28067", "28068"), c.order >= 3))))} color="#8b5cf6" expanded={expandedWaves.has('T+90')} onToggle={stryMutAct_9fa48("28070") ? () => undefined : (stryCov_9fa48("28070"), () => toggleWave('T+90'))} />
                    </div>
                  </div>

                  {/* Mitigations */}
                  {stryMutAct_9fa48("28074") ? selectedReport.mitigations.length > 0 || <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Recommended Mitigations ({selectedReport.mitigations.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedReport.mitigations.slice(0, 5).map((m, idx) => <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${m.type === 'prevent' ? 'bg-green-500/20 text-green-400' : m.type === 'detect' ? 'bg-blue-500/20 text-blue-400' : m.type === 'respond' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {m.type.toUpperCase()}
                              </span>
                              <span className="font-medium">{m.description}</span>
                            </div>
                            <p className="text-sm text-gray-400">{m.implementation}</p>
                          </div>)}
                      </div>
                    </div> : stryMutAct_9fa48("28073") ? false : stryMutAct_9fa48("28072") ? true : (stryCov_9fa48("28072", "28073", "28074"), (stryMutAct_9fa48("28077") ? selectedReport.mitigations.length <= 0 : stryMutAct_9fa48("28076") ? selectedReport.mitigations.length >= 0 : stryMutAct_9fa48("28075") ? true : (stryCov_9fa48("28075", "28076", "28077"), selectedReport.mitigations.length > 0)) && <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Recommended Mitigations ({selectedReport.mitigations.length})
                      </h3>
                      <div className="space-y-3">
                        {stryMutAct_9fa48("28078") ? selectedReport.mitigations.map((m, idx) => <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${m.type === 'prevent' ? 'bg-green-500/20 text-green-400' : m.type === 'detect' ? 'bg-blue-500/20 text-blue-400' : m.type === 'respond' ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {m.type.toUpperCase()}
                              </span>
                              <span className="font-medium">{m.description}</span>
                            </div>
                            <p className="text-sm text-gray-400">{m.implementation}</p>
                          </div>) : (stryCov_9fa48("28078"), selectedReport.mitigations.slice(0, 5).map(stryMutAct_9fa48("28079") ? () => undefined : (stryCov_9fa48("28079"), (m, idx) => <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("28083") ? m.type !== 'prevent' : stryMutAct_9fa48("28082") ? false : stryMutAct_9fa48("28081") ? true : (stryCov_9fa48("28081", "28082", "28083"), m.type === 'prevent')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("28088") ? m.type !== 'detect' : stryMutAct_9fa48("28087") ? false : stryMutAct_9fa48("28086") ? true : (stryCov_9fa48("28086", "28087", "28088"), m.type === 'detect')) ? 'bg-blue-500/20 text-blue-400' : (stryMutAct_9fa48("28093") ? m.type !== 'respond' : stryMutAct_9fa48("28092") ? false : stryMutAct_9fa48("28091") ? true : (stryCov_9fa48("28091", "28092", "28093"), m.type === 'respond')) ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-500/20 text-gray-400'}`}>
                                {stryMutAct_9fa48("28097") ? m.type.toLowerCase() : (stryCov_9fa48("28097"), m.type.toUpperCase())}
                              </span>
                              <span className="font-medium">{m.description}</span>
                            </div>
                            <p className="text-sm text-gray-400">{m.implementation}</p>
                          </div>)))}
                      </div>
                    </div>)}
                </div> : <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a report to view details
                </div>}
            </div>
          </div>)}

        {/* Graph Tab */}
        {stryMutAct_9fa48("28100") ? activeTab === 'graph' || <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Organization Graph
              </h2>
              {graphStats ? <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-3xl font-bold">{graphStats.nodeCount}</div>
                      <div className="text-sm text-gray-400">Nodes</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-3xl font-bold">{graphStats.edgeCount}</div>
                      <div className="text-sm text-gray-400">Edges</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Node Types</div>
                    <div className="space-y-2">
                      {Object.entries(graphStats.nodeTypeDistribution).map(([type, count]) => <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>)}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Average Degree: {graphStats.avgDegree.toFixed(2)}
                  </div>
                </div> : <div className="text-center py-8 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No graph loaded</p>
                  <button onClick={loadSampleGraph} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors">
                    Load Sample Graph
                  </button>
                </div>}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                About the Graph
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                The Organization Graph represents your company's structure, systems, processes, 
                and relationships. CendiaCascade uses this graph to trace how changes propagate.
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-blue-400">Nodes</strong>: Departments, Teams, People, 
                  Systems, Processes, Policies, Metrics, Vendors, Customers, Products
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-green-400">Edges</strong>: depends_on, manages, produces, 
                  consumes, influences, reports_to, funds, constrains, triggers, mitigates
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-purple-400">Attributes</strong>: weight (importance), 
                  sensitivity (reactivity), inertia (resistance), strength, latencyDays
                </div>
              </div>
            </div>
          </div> : stryMutAct_9fa48("28099") ? false : stryMutAct_9fa48("28098") ? true : (stryCov_9fa48("28098", "28099", "28100"), (stryMutAct_9fa48("28102") ? activeTab !== 'graph' : stryMutAct_9fa48("28101") ? true : (stryCov_9fa48("28101", "28102"), activeTab === 'graph')) && <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Organization Graph
              </h2>
              {graphStats ? <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-3xl font-bold">{graphStats.nodeCount}</div>
                      <div className="text-sm text-gray-400">Nodes</div>
                    </div>
                    <div className="bg-gray-800/50 rounded-lg p-4">
                      <div className="text-3xl font-bold">{graphStats.edgeCount}</div>
                      <div className="text-sm text-gray-400">Edges</div>
                    </div>
                  </div>
                  <div className="bg-gray-800/50 rounded-lg p-4">
                    <div className="text-sm font-medium text-gray-300 mb-2">Node Types</div>
                    <div className="space-y-2">
                      {Object.entries(graphStats.nodeTypeDistribution).map(stryMutAct_9fa48("28104") ? () => undefined : (stryCov_9fa48("28104"), ([type, count]) => <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Average Degree: {graphStats.avgDegree.toFixed(2)}
                  </div>
                </div> : <div className="text-center py-8 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No graph loaded</p>
                  <button onClick={loadSampleGraph} className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors">
                    Load Sample Graph
                  </button>
                </div>}
            </div>

            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-yellow-400" />
                About the Graph
              </h3>
              <p className="text-gray-300 text-sm mb-4">
                The Organization Graph represents your company's structure, systems, processes, 
                and relationships. CendiaCascade uses this graph to trace how changes propagate.
              </p>
              <div className="space-y-3 text-sm">
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-blue-400">Nodes</strong>: Departments, Teams, People, 
                  Systems, Processes, Policies, Metrics, Vendors, Customers, Products
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-green-400">Edges</strong>: depends_on, manages, produces, 
                  consumes, influences, reports_to, funds, constrains, triggers, mitigates
                </div>
                <div className="p-3 bg-gray-800/50 rounded-lg">
                  <strong className="text-purple-400">Attributes</strong>: weight (importance), 
                  sensitivity (reactivity), inertia (resistance), strength, latencyDays
                </div>
              </div>
            </div>
          </div>)}
      </div>
    </div>;
};
export default CascadePage;