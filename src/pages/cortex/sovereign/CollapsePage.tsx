/**
 * Policy Collapse Mode - Adversarial Policy Stress-Testing
 * 
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 * 
 * Features:
 * - Dual-track deliberation (Consensus vs Collapse)
 * - Trust Delta calculation and visualization
 * - Failure envelope display
 * - Minority harm heatmap
 * - Narrative attack simulator
 * - Legitimacy erosion timeline
 * - Replay and verification
 */

import React, { useState, useEffect } from 'react';
import {
  AlertTriangle,
  Shield,
  Users,
  TrendingDown,
  FileWarning,
  Download,
  Play,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertOctagon,
  Zap,
  Clock,
  MessageSquare,
  Eye,
  BarChart3,
  Target,
  Scale,
} from 'lucide-react';

const API_BASE = '/api/v1/collapse';

interface TrustDelta {
  consensusConfidence: number;
  collapseRisk: number;
  trustDelta: number;
  deploymentRecommendation: string;
  riskFactors: string[];
  mitigationSuggestions: string[];
}

interface FailureCondition {
  id: string;
  agent: string;
  category: string;
  severity: number;
  probability: number;
  failureEvent: { type: string; description: string };
  affectedGroups: { name: string; vulnerabilityScore: number }[];
  timeToManifestation: string;
}

interface FailureEnvelope {
  id: string;
  decisionId: string;
  generatedAt: string;
  seed: number;
  summary: {
    totalFailureConditions: number;
    criticalCount: number;
    highCount: number;
    mediumCount: number;
    lowCount: number;
    affectedGroupsCount: number;
    ethicalViolationsCount: number;
  };
  failureConditions: FailureCondition[];
  trustDelta: TrustDelta;
  legitimacyCurve: { time: number; legitimacy: number }[];
  minorityHarmMatrix: { group: string; severity: number; visibility: string }[];
  narrativeAttacks: { headline: string; virality: number; emotionalTrigger: string }[];
  merkleRoot: string;
  replayCommand: string;
}

interface Deliberation {
  id: string;
  decisionId: string;
  decisionText: string;
  consensusTrack: { confidence: number };
  collapseTrack: { totalRisk: number; criticalFindings: string[]; failureEnvelope: FailureEnvelope };
  trustDelta: TrustDelta;
  seed: number;
  merkleRoot: string;
  completedAt: string;
}

interface AgentDescription {
  type: string;
  description: string;
  questions: string[];
}

const CollapsePage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [agents, setAgents] = useState<AgentDescription[]>([]);
  const [deliberation, setDeliberation] = useState<Deliberation | null>(null);
  const [history, setHistory] = useState<Deliberation[]>([]);
  const [activeTab, setActiveTab] = useState<'analysis' | 'timeline' | 'heatmap' | 'narrative' | 'agents'>('analysis');
  
  // Form state
  const [decisionId, setDecisionId] = useState('');
  const [decisionText, setDecisionText] = useState('');
  const [policyDomain, setPolicyDomain] = useState('Housing');
  const [targetPopulation, setTargetPopulation] = useState(100000);
  const [consensusConfidence, setConsensusConfidence] = useState(0.85);
  const [seed, setSeed] = useState<number | undefined>(undefined);

  useEffect(() => {
    fetchAgents();
    fetchHistory();
  }, []);

  const fetchAgents = async () => {
    try {
      const res = await fetch(`${API_BASE}/agents`);
      const data = await res.json();
      if (data.success) {
        setAgents(data.agents);
      }
    } catch (error) {
      console.error('Failed to fetch agents:', error);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch(`${API_BASE}/deliberations`);
      const data = await res.json();
      if (data.success) {
        setHistory(data.deliberations);
      }
    } catch (error) {
      console.error('Failed to fetch history:', error);
    }
  };

  const runDeliberation = async () => {
    if (!decisionText.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deliberation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          decisionId: decisionId || `DEC-${Date.now()}`,
          decisionText,
          context: {
            policyDomain,
            targetPopulation,
            geographicScope: 'Municipal',
            budgetImpact: 1000000,
            timelineMonths: 24,
            stakeholders: ['Citizens', 'Business', 'Government'],
          },
          consensusConfidence,
          seed,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setDeliberation(data.deliberation);
        fetchHistory();
      }
    } catch (error) {
      console.error('Deliberation failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const downloadEnvelope = async () => {
    if (!deliberation) return;
    const envelopeId = deliberation.collapseTrack.failureEnvelope.id;
    window.open(`${API_BASE}/envelope/${envelopeId}/export`, '_blank');
  };

  const replayDeliberation = async (id: string) => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/deliberation/${id}/replay`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch (error) {
      console.error('Replay failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTrustDeltaColor = (delta: number) => {
    if (delta > 0.3) return 'text-green-500';
    if (delta > 0.1) return 'text-yellow-500';
    if (delta > 0) return 'text-orange-500';
    return 'text-red-500';
  };

  const getRecommendationBadge = (rec: string) => {
    const badges: Record<string, { bg: string; text: string; icon: React.ReactNode }> = {
      SAFE_TO_DEPLOY: { bg: 'bg-green-500/20', text: 'text-green-400', icon: <CheckCircle className="w-4 h-4" /> },
      DEPLOY_WITH_GUARDRAILS: { bg: 'bg-yellow-500/20', text: 'text-yellow-400', icon: <AlertTriangle className="w-4 h-4" /> },
      HIGH_RISK: { bg: 'bg-orange-500/20', text: 'text-orange-400', icon: <AlertOctagon className="w-4 h-4" /> },
      DO_NOT_DEPLOY: { bg: 'bg-red-500/20', text: 'text-red-400', icon: <XCircle className="w-4 h-4" /> },
    };
    const badge = badges[rec] || badges.HIGH_RISK;
    return (
      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full ${badge.bg} ${badge.text} text-sm font-medium`}>
        {badge.icon}
        {rec.replace(/_/g, ' ')}
      </span>
    );
  };

  const getSeverityColor = (severity: number) => {
    if (severity >= 0.8) return 'bg-red-500';
    if (severity >= 0.6) return 'bg-orange-500';
    if (severity >= 0.4) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-500/20 rounded-lg">
              <AlertTriangle className="w-8 h-8 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Policy Collapse Mode</h1>
              <p className="text-gray-400">Adversarial Policy Stress-Testing System</p>
            </div>
          </div>
          <p className="text-gray-500 italic mt-2">
            "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Panel - Configuration */}
          <div className="lg:col-span-1 space-y-6">
            {/* Input Form */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Target className="w-5 h-5 text-blue-400" />
                Policy Configuration
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-1">Decision ID</label>
                  <input
                    type="text"
                    value={decisionId}
                    onChange={(e) => setDecisionId(e.target.value)}
                    placeholder="DEC-2026-001"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Policy Decision Text</label>
                  <textarea
                    value={decisionText}
                    onChange={(e) => setDecisionText(e.target.value)}
                    placeholder="Describe the policy decision to analyze..."
                    rows={4}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white resize-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Domain</label>
                    <select
                      value={policyDomain}
                      onChange={(e) => setPolicyDomain(e.target.value)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    >
                      <option>Housing</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                      <option>Transportation</option>
                      <option>Environment</option>
                      <option>Finance</option>
                      <option>Public Safety</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-400 mb-1">Population</label>
                    <input
                      type="number"
                      value={targetPopulation}
                      onChange={(e) => setTargetPopulation(parseInt(e.target.value) || 0)}
                      className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">
                    Consensus Confidence: {(consensusConfidence * 100).toFixed(0)}%
                  </label>
                  <input
                    type="range"
                    min="0.5"
                    max="0.99"
                    step="0.01"
                    value={consensusConfidence}
                    onChange={(e) => setConsensusConfidence(parseFloat(e.target.value))}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-400 mb-1">Seed (optional)</label>
                  <input
                    type="number"
                    value={seed || ''}
                    onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : undefined)}
                    placeholder="Random"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-3 py-2 text-white"
                  />
                </div>

                <button
                  onClick={runDeliberation}
                  disabled={loading || !decisionText.trim()}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white font-medium py-3 rounded-lg flex items-center justify-center gap-2 transition-colors"
                >
                  {loading ? (
                    <RefreshCw className="w-5 h-5 animate-spin" />
                  ) : (
                    <Zap className="w-5 h-5" />
                  )}
                  Run Collapse Analysis
                </button>
              </div>
            </div>

            {/* History */}
            {history.length > 0 && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Clock className="w-5 h-5 text-purple-400" />
                  Recent Analyses
                </h2>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {history.slice(0, 5).map((d) => (
                    <div
                      key={d.id}
                      onClick={() => setDeliberation(d)}
                      className="p-3 bg-gray-700/50 rounded-lg cursor-pointer hover:bg-gray-700 transition-colors"
                    >
                      <div className="text-sm font-medium truncate">{d.decisionText.slice(0, 50)}...</div>
                      <div className="text-xs text-gray-400 mt-1 flex items-center justify-between">
                        <span>Trust Δ: {d.trustDelta.trustDelta.toFixed(2)}</span>
                        <span>{new Date(d.completedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Panel - Results */}
          <div className="lg:col-span-2 space-y-6">
            {deliberation ? (
              <>
                {/* Trust Delta Banner */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold flex items-center gap-2">
                      <Scale className="w-5 h-5 text-blue-400" />
                      Trust Delta Analysis
                    </h2>
                    <div className="flex gap-2">
                      <button
                        onClick={downloadEnvelope}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Download Failure Envelope"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => replayDeliberation(deliberation.id)}
                        className="p-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                        title="Replay Deliberation"
                      >
                        <Play className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 mb-4">
                    <div className="text-center p-4 bg-green-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-green-400">
                        {(deliberation.trustDelta.consensusConfidence * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Consensus</div>
                    </div>
                    <div className="text-center p-4 bg-red-500/10 rounded-lg">
                      <div className="text-3xl font-bold text-red-400">
                        {(deliberation.trustDelta.collapseRisk * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Collapse Risk</div>
                    </div>
                    <div className={`text-center p-4 rounded-lg ${deliberation.trustDelta.trustDelta > 0 ? 'bg-blue-500/10' : 'bg-red-500/10'}`}>
                      <div className={`text-3xl font-bold ${getTrustDeltaColor(deliberation.trustDelta.trustDelta)}`}>
                        {deliberation.trustDelta.trustDelta > 0 ? '+' : ''}{(deliberation.trustDelta.trustDelta * 100).toFixed(0)}%
                      </div>
                      <div className="text-sm text-gray-400">Trust Delta</div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    {getRecommendationBadge(deliberation.trustDelta.deploymentRecommendation)}
                    <div className="text-xs text-gray-500">
                      Seed: {deliberation.seed} | Merkle: {deliberation.merkleRoot.slice(0, 12)}...
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 border-b border-gray-700 pb-2">
                  {[
                    { id: 'analysis', label: 'Failure Analysis', icon: FileWarning },
                    { id: 'timeline', label: 'Legitimacy Timeline', icon: TrendingDown },
                    { id: 'heatmap', label: 'Harm Heatmap', icon: Users },
                    { id: 'narrative', label: 'Narrative Attacks', icon: MessageSquare },
                    { id: 'agents', label: 'Agents', icon: Eye },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as typeof activeTab)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        activeTab === tab.id
                          ? 'bg-gray-700 text-white'
                          : 'text-gray-400 hover:text-white hover:bg-gray-800'
                      }`}
                    >
                      <tab.icon className="w-4 h-4" />
                      {tab.label}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                  {activeTab === 'analysis' && (
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-semibold">Failure Conditions</h3>
                        <div className="flex gap-2 text-sm">
                          <span className="px-2 py-1 bg-red-500/20 text-red-400 rounded">
                            Critical: {deliberation.collapseTrack.failureEnvelope.summary.criticalCount}
                          </span>
                          <span className="px-2 py-1 bg-orange-500/20 text-orange-400 rounded">
                            High: {deliberation.collapseTrack.failureEnvelope.summary.highCount}
                          </span>
                          <span className="px-2 py-1 bg-yellow-500/20 text-yellow-400 rounded">
                            Medium: {deliberation.collapseTrack.failureEnvelope.summary.mediumCount}
                          </span>
                        </div>
                      </div>

                      <div className="space-y-3 max-h-96 overflow-y-auto">
                        {deliberation.collapseTrack.failureEnvelope.failureConditions.map((fc) => (
                          <div key={fc.id} className="p-4 bg-gray-700/50 rounded-lg">
                            <div className="flex items-start justify-between">
                              <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`w-2 h-2 rounded-full ${getSeverityColor(fc.severity)}`} />
                                  <span className="text-sm font-medium">{fc.agent.replace(/_/g, ' ')}</span>
                                  <span className="text-xs text-gray-500">• {fc.category.replace(/_/g, ' ')}</span>
                                </div>
                                <p className="text-sm text-gray-300">{fc.failureEvent.description}</p>
                                <div className="mt-2 flex flex-wrap gap-1">
                                  {fc.affectedGroups.map((g) => (
                                    <span key={g.name} className="text-xs px-2 py-0.5 bg-gray-600 rounded-full">
                                      {g.name}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              <div className="text-right ml-4">
                                <div className="text-lg font-bold text-red-400">{(fc.severity * 100).toFixed(0)}%</div>
                                <div className="text-xs text-gray-500">Severity</div>
                                <div className="text-xs text-gray-400 mt-1">{fc.timeToManifestation}</div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'timeline' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Legitimacy Erosion Curve</h3>
                      <div className="h-64 flex items-end gap-1">
                        {deliberation.collapseTrack.failureEnvelope.legitimacyCurve.map((point, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center">
                            <div
                              className={`w-full rounded-t ${point.legitimacy > 0.5 ? 'bg-green-500' : point.legitimacy > 0.3 ? 'bg-yellow-500' : 'bg-red-500'}`}
                              style={{ height: `${point.legitimacy * 100}%` }}
                            />
                            <div className="text-xs text-gray-500 mt-1">M{point.time}</div>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 text-sm text-gray-400">
                        Initial legitimacy erodes over time as trigger events accumulate. Below 30% = recovery unlikely.
                      </div>
                    </div>
                  )}

                  {activeTab === 'heatmap' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Minority Harm Matrix</h3>
                      <div className="space-y-2">
                        {deliberation.collapseTrack.failureEnvelope.minorityHarmMatrix.map((item, i) => (
                          <div key={i} className="flex items-center gap-3">
                            <div className="w-40 text-sm truncate">{item.group}</div>
                            <div className="flex-1 bg-gray-700 rounded-full h-4 overflow-hidden">
                              <div
                                className={`h-full ${getSeverityColor(item.severity)}`}
                                style={{ width: `${item.severity * 100}%` }}
                              />
                            </div>
                            <div className="w-16 text-sm text-right">{(item.severity * 100).toFixed(0)}%</div>
                            <div className="w-20 text-xs text-gray-500">{item.visibility}</div>
                          </div>
                        ))}
                      </div>
                      {deliberation.collapseTrack.failureEnvelope.minorityHarmMatrix.length === 0 && (
                        <div className="text-center text-gray-500 py-8">
                          No disproportionate minority harm detected
                        </div>
                      )}
                    </div>
                  )}

                  {activeTab === 'narrative' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Narrative Attack Simulator</h3>
                      <p className="text-sm text-gray-400 mb-4">
                        How would this policy be framed to destroy public trust?
                      </p>
                      <div className="space-y-3">
                        {deliberation.collapseTrack.failureEnvelope.narrativeAttacks.map((attack, i) => (
                          <div key={i} className="p-4 bg-gray-700/50 rounded-lg border-l-4 border-red-500">
                            <div className="font-medium text-lg">"{attack.headline}"</div>
                            <div className="mt-2 flex items-center gap-4 text-sm text-gray-400">
                              <span>Trigger: {attack.emotionalTrigger}</span>
                              <span>Virality: {(attack.virality * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {activeTab === 'agents' && (
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Collapse Agents</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {agents.map((agent) => (
                          <div key={agent.type} className="p-4 bg-gray-700/50 rounded-lg">
                            <div className="font-medium text-sm">{agent.type.replace(/_/g, ' ')}</div>
                            <p className="text-xs text-gray-400 mt-1">{agent.description}</p>
                            <div className="mt-2">
                              {agent.questions.slice(0, 2).map((q, i) => (
                                <div key={i} className="text-xs text-gray-500">• {q}</div>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Critical Findings */}
                {deliberation.collapseTrack.criticalFindings.length > 0 && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-red-400 flex items-center gap-2 mb-3">
                      <AlertOctagon className="w-5 h-5" />
                      Critical Findings
                    </h3>
                    <ul className="space-y-2">
                      {deliberation.collapseTrack.criticalFindings.map((finding, i) => (
                        <li key={i} className="text-sm text-red-300 flex items-start gap-2">
                          <span className="text-red-500 mt-1">•</span>
                          {finding}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </>
            ) : (
              <div className="bg-gray-800 rounded-xl p-12 border border-gray-700 text-center">
                <div className="inline-flex p-4 bg-gray-700 rounded-full mb-4">
                  <Shield className="w-12 h-12 text-gray-500" />
                </div>
                <h3 className="text-xl font-semibold mb-2">No Analysis Yet</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Configure a policy decision and run the collapse analysis to discover failure modes,
                  minority harm risks, and legitimacy collapse scenarios.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CollapsePage;
