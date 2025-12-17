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


import React, { useState, useEffect } from 'react';
import {
  Activity,
  AlertTriangle,
  ArrowRight,
  BarChart3,
  Bug,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock,
  FileText,
  GitBranch,
  Layers,
  Network,
  Play,
  Plus,
  RefreshCw,
  Shield,
  Target,
  TrendingUp,
  XCircle,
  Zap,
} from 'lucide-react';

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

const SeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const colors: Record<string, string> = {
    critical: 'bg-red-500/20 text-red-400 border-red-500/30',
    high: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
    moderate: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
    low: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    minimal: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
  };

  return (
    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${colors[severity] || colors.minimal}`}>
      {severity.toUpperCase()}
    </span>
  );
};

const RecommendationBadge: React.FC<{ recommendation: string }> = ({ recommendation }) => {
  const config: Record<string, { color: string; icon: React.ReactNode }> = {
    proceed: { color: 'bg-green-500/20 text-green-400', icon: <CheckCircle2 className="w-4 h-4" /> },
    proceed_with_caution: { color: 'bg-yellow-500/20 text-yellow-400', icon: <AlertTriangle className="w-4 h-4" /> },
    reconsider: { color: 'bg-orange-500/20 text-orange-400', icon: <RefreshCw className="w-4 h-4" /> },
    reject: { color: 'bg-red-500/20 text-red-400', icon: <XCircle className="w-4 h-4" /> },
  };

  const { color, icon } = config[recommendation] || config.proceed;

  return (
    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center gap-2 ${color}`}>
      {icon}
      {recommendation.replace(/_/g, ' ').toUpperCase()}
    </span>
  );
};

const TimelineWave: React.FC<{
  label: string;
  effects: any[];
  color: string;
  expanded: boolean;
  onToggle: () => void;
}> = ({ label, effects, color, expanded, onToggle }) => (
  <div className="border border-gray-700 rounded-lg overflow-hidden">
    <button
      onClick={onToggle}
      className="w-full px-4 py-3 flex items-center justify-between bg-gray-800/50 hover:bg-gray-800 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className={`w-3 h-3 rounded-full`} style={{ backgroundColor: color }} />
        <span className="font-medium">{label}</span>
        <span className="text-gray-400 text-sm">({effects.length} effects)</span>
      </div>
      {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
    </button>
    {expanded && effects.length > 0 && (
      <div className="px-4 py-3 space-y-2 bg-gray-900/50">
        {effects.map((effect, idx) => (
          <div key={idx} className="flex items-center justify-between text-sm">
            <span>{typeof effect === 'string' ? effect : effect.name || effect.nodeName}</span>
            {effect.severity && <SeverityBadge severity={effect.severity} />}
          </div>
        ))}
      </div>
    )}
  </div>
);

// =============================================================================
// MAIN PAGE
// =============================================================================

const CascadePage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'analyze' | 'reports' | 'graph'>('analyze');
  const [reports, setReports] = useState<CascadeReport[]>([]);
  const [selectedReport, setSelectedReport] = useState<CascadeReport | null>(null);
  const [graphStats, setGraphStats] = useState<GraphStats | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [expandedWaves, setExpandedWaves] = useState<Set<string>>(new Set(['T+0']));

  // Form state
  const [changeForm, setChangeForm] = useState<ChangeSpec>({
    type: 'policy',
    title: '',
    description: '',
    affectedAssets: [],
    expectedBenefit: '',
    constraints: {
      noGoLines: [],
    },
  });

  const [assetInput, setAssetInput] = useState('');

  // Load initial data
  useEffect(() => {
    loadReports();
    loadGraphStats();
  }, []);

  const loadReports = async () => {
    try {
      const res = await fetch('/api/v1/cascade/reports');
      if (res.ok) {
        const data = await res.json();
        setReports(data.reports || []);
      }
    } catch (error) {
      console.error('Failed to load reports:', error);
    }
  };

  const loadGraphStats = async () => {
    try {
      const res = await fetch('/api/v1/cascade/graph/stats');
      if (res.ok) {
        const data = await res.json();
        setGraphStats(data);
      }
    } catch (error) {
      console.error('Failed to load graph stats:', error);
    }
  };

  const loadSampleGraph = async () => {
    try {
      const res = await fetch('/api/v1/cascade/demo/load-sample', { method: 'POST' });
      if (res.ok) {
        await loadGraphStats();
        alert('Sample organization graph loaded!');
      }
    } catch (error) {
      console.error('Failed to load sample graph:', error);
    }
  };

  const analyzeChange = async () => {
    if (!changeForm.title || !changeForm.description || changeForm.affectedAssets.length === 0) {
      alert('Please fill in all required fields');
      return;
    }

    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/v1/cascade/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(changeForm),
      });

      if (res.ok) {
        const data = await res.json();
        setSelectedReport(data.report);
        await loadReports();
        setActiveTab('reports');
      } else {
        const error = await res.json();
        alert(`Analysis failed: ${error.message || error.error}`);
      }
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Analysis failed. Check console for details.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const addAsset = () => {
    if (assetInput.trim()) {
      setChangeForm({
        ...changeForm,
        affectedAssets: [...changeForm.affectedAssets, assetInput.trim()],
      });
      setAssetInput('');
    }
  };

  const removeAsset = (index: number) => {
    setChangeForm({
      ...changeForm,
      affectedAssets: changeForm.affectedAssets.filter((_, i) => i !== index),
    });
  };

  const toggleWave = (label: string) => {
    const newExpanded = new Set(expandedWaves);
    if (newExpanded.has(label)) {
      newExpanded.delete(label);
    } else {
      newExpanded.add(label);
    }
    setExpandedWaves(newExpanded);
  };

  return (
    <div className="min-h-screen bg-gray-950 text-white">
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
              {graphStats && (
                <div className="text-sm text-gray-400">
                  Graph: {graphStats.nodeCount} nodes, {graphStats.edgeCount} edges
                </div>
              )}
              <button
                onClick={loadSampleGraph}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                Load Sample Graph
              </button>
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mt-6">
            {[
              { id: 'analyze', label: 'Analyze Change', icon: <Zap className="w-4 h-4" /> },
              { id: 'reports', label: 'Reports', icon: <FileText className="w-4 h-4" /> },
              { id: 'graph', label: 'Organization Graph', icon: <Network className="w-4 h-4" /> },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-4 py-2 rounded-t-lg flex items-center gap-2 transition-colors ${
                  activeTab === tab.id
                    ? 'bg-gray-800 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Analyze Tab */}
        {activeTab === 'analyze' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
                    <select
                      value={changeForm.type}
                      onChange={(e) => setChangeForm({ ...changeForm, type: e.target.value })}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
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
                    <input
                      type="text"
                      value={changeForm.title}
                      onChange={(e) => setChangeForm({ ...changeForm, title: e.target.value })}
                      placeholder="e.g., Reduce engineering headcount by 10%"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Description *</label>
                    <textarea
                      value={changeForm.description}
                      onChange={(e) => setChangeForm({ ...changeForm, description: e.target.value })}
                      placeholder="Describe the proposed change in detail..."
                      rows={3}
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Affected Assets */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Affected Assets *</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={assetInput}
                        onChange={(e) => setAssetInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && addAsset()}
                        placeholder="Enter node ID (e.g., eng-team)"
                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                      />
                      <button
                        onClick={addAsset}
                        className="px-3 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg transition-colors"
                      >
                        <Plus className="w-5 h-5" />
                      </button>
                    </div>
                    {changeForm.affectedAssets.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {changeForm.affectedAssets.map((asset, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-1 bg-gray-800 rounded text-sm flex items-center gap-1"
                          >
                            {asset}
                            <button
                              onClick={() => removeAsset(idx)}
                              className="text-gray-400 hover:text-white"
                            >
                              <XCircle className="w-3 h-3" />
                            </button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Expected Benefit */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1">Expected Benefit</label>
                    <input
                      type="text"
                      value={changeForm.expectedBenefit}
                      onChange={(e) => setChangeForm({ ...changeForm, expectedBenefit: e.target.value })}
                      placeholder="e.g., Reduce operating costs by $2M annually"
                      className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  {/* Analyze Button */}
                  <button
                    onClick={analyzeChange}
                    disabled={isAnalyzing}
                    className="w-full py-3 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
                  >
                    {isAnalyzing ? (
                      <>
                        <RefreshCw className="w-5 h-5 animate-spin" />
                        Analyzing Consequences...
                      </>
                    ) : (
                      <>
                        <Play className="w-5 h-5" />
                        Analyze Butterfly Effect
                      </>
                    )}
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
          </div>
        )}

        {/* Reports Tab */}
        {activeTab === 'reports' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Report List */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-400" />
                Cascade Reports ({reports.length})
              </h2>
              {reports.length === 0 ? (
                <div className="text-gray-500 text-center py-8">
                  No reports yet. Analyze a change to get started.
                </div>
              ) : (
                <div className="space-y-2">
                  {reports.map((report) => (
                    <button
                      key={report.id}
                      onClick={() => setSelectedReport(report as any)}
                      className={`w-full text-left p-4 rounded-lg border transition-colors ${
                        selectedReport?.id === report.id
                          ? 'bg-purple-900/30 border-purple-700'
                          : 'bg-gray-900 border-gray-800 hover:border-gray-700'
                      }`}
                    >
                      <div className="font-medium">{report.title}</div>
                      <div className="text-sm text-gray-400 mt-1">
                        {report.consequenceCount} consequences • Risk: {report.totalRiskScore}
                      </div>
                      <div className="mt-2">
                        <RecommendationBadge recommendation={report.recommendation} />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Report Detail */}
            <div className="lg:col-span-2">
              {selectedReport ? (
                <div className="space-y-6">
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
                  {selectedReport.butterflyEffect && (
                    <div className="bg-gradient-to-r from-purple-900/40 to-pink-900/40 border border-purple-700/50 rounded-xl p-6">
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
                    </div>
                  )}

                  {/* Consequences by Order */}
                  <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                    <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                      <GitBranch className="w-5 h-5 text-blue-400" />
                      Cascade Timeline
                    </h3>
                    <div className="space-y-3">
                      <TimelineWave
                        label="T+0: Direct Impacts (1st Order)"
                        effects={selectedReport.consequences.filter(c => c.order === 1)}
                        color="#3b82f6"
                        expanded={expandedWaves.has('T+0')}
                        onToggle={() => toggleWave('T+0')}
                      />
                      <TimelineWave
                        label="T+30: Ripple Effects (2nd Order)"
                        effects={selectedReport.consequences.filter(c => c.order === 2)}
                        color="#f59e0b"
                        expanded={expandedWaves.has('T+30')}
                        onToggle={() => toggleWave('T+30')}
                      />
                      <TimelineWave
                        label="T+90+: Butterfly Effects (3rd+ Order)"
                        effects={selectedReport.consequences.filter(c => c.order >= 3)}
                        color="#8b5cf6"
                        expanded={expandedWaves.has('T+90')}
                        onToggle={() => toggleWave('T+90')}
                      />
                    </div>
                  </div>

                  {/* Mitigations */}
                  {selectedReport.mitigations.length > 0 && (
                    <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
                      <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                        <Shield className="w-5 h-5 text-green-400" />
                        Recommended Mitigations ({selectedReport.mitigations.length})
                      </h3>
                      <div className="space-y-3">
                        {selectedReport.mitigations.slice(0, 5).map((m, idx) => (
                          <div key={idx} className="p-3 bg-gray-800/50 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <span className={`px-2 py-0.5 rounded text-xs ${
                                m.type === 'prevent' ? 'bg-green-500/20 text-green-400' :
                                m.type === 'detect' ? 'bg-blue-500/20 text-blue-400' :
                                m.type === 'respond' ? 'bg-orange-500/20 text-orange-400' :
                                'bg-gray-500/20 text-gray-400'
                              }`}>
                                {m.type.toUpperCase()}
                              </span>
                              <span className="font-medium">{m.description}</span>
                            </div>
                            <p className="text-sm text-gray-400">{m.implementation}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex items-center justify-center h-64 text-gray-500">
                  Select a report to view details
                </div>
              )}
            </div>
          </div>
        )}

        {/* Graph Tab */}
        {activeTab === 'graph' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Network className="w-5 h-5 text-blue-400" />
                Organization Graph
              </h2>
              {graphStats ? (
                <div className="space-y-4">
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
                      {Object.entries(graphStats.nodeTypeDistribution).map(([type, count]) => (
                        <div key={type} className="flex items-center justify-between text-sm">
                          <span className="text-gray-400">{type}</span>
                          <span className="font-medium">{count}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="text-sm text-gray-400">
                    Average Degree: {graphStats.avgDegree.toFixed(2)}
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Network className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No graph loaded</p>
                  <button
                    onClick={loadSampleGraph}
                    className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-500 rounded-lg text-sm transition-colors"
                  >
                    Load Sample Graph
                  </button>
                </div>
              )}
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
          </div>
        )}
      </div>
    </div>
  );
};

export default CascadePage;
