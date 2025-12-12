/**
 * CendiaVox™ - Stakeholder Voice Assembly
 * "Who speaks for those not in the room?"
 */

import React, { useState, useEffect } from 'react';
import apiClient from '../../lib/api/client';
import { Users, MessageSquare, Vote, AlertTriangle, Scale, Heart, Leaf, Clock, X, TrendingUp, TrendingDown, Minus, Play, ExternalLink, Edit2, Check } from 'lucide-react';

interface Stakeholder {
  id: string;
  stakeholderType: string;
  name: string;
  description: string;
  voiceWeight: number;
  vetoRights: string[];
  isActive: boolean;
}

interface Dashboard {
  activeStakeholders: number;
  signalsLast7Days: number;
  sentimentBreakdown: Record<string, number>;
  vetoesLast30Days: number;
  totalAssemblies: number;
}

interface Signal {
  id: string;
  timestamp: Date;
  stakeholder: string;
  type: 'survey' | 'hr_data' | 'nps' | 'incident' | 'regulatory' | 'social';
  severity: 'low' | 'medium' | 'high' | 'critical';
  summary: string;
  source: string;
}

interface VetoRecord {
  id: string;
  timestamp: Date;
  decisionId: string;
  decisionTitle: string;
  stakeholder: string;
  vetoType: string;
  outcome: 'blocked' | 'escalated' | 'overridden';
}

interface WeightChange {
  timestamp: Date;
  oldWeight: number;
  newWeight: number;
  changedBy: string;
}

// Mock data for signals
const MOCK_SIGNALS: Signal[] = [
  { id: 's1', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), stakeholder: 'EMPLOYEES', type: 'survey', severity: 'medium', summary: 'Q4 engagement survey shows 12% drop in remote work satisfaction', source: 'Workday Survey' },
  { id: 's2', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), stakeholder: 'CUSTOMERS', type: 'nps', severity: 'low', summary: 'NPS increased from 42 to 47 in enterprise segment', source: 'Delighted' },
  { id: 's3', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), stakeholder: 'ENVIRONMENT', type: 'regulatory', severity: 'high', summary: 'New EU carbon reporting requirements effective Q2 2026', source: 'Regulatory Watch' },
  { id: 's4', timestamp: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000), stakeholder: 'COMMUNITY', type: 'social', severity: 'medium', summary: 'Local council raised concerns about expanded facility traffic', source: 'Community Relations' },
  { id: 's5', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), stakeholder: 'EMPLOYEES', type: 'hr_data', severity: 'high', summary: 'Engineering attrition rate increased to 18% (threshold: 15%)', source: 'HR Analytics' },
  { id: 's6', timestamp: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000), stakeholder: 'CUSTOMERS', type: 'incident', severity: 'critical', summary: 'Major outage affected 2,400 enterprise customers for 47 minutes', source: 'PagerDuty' },
];

// Mock data for vetoes
const MOCK_VETOES: VetoRecord[] = [
  { id: 'v1', timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), decisionId: 'dec-001', decisionTitle: 'Facility Expansion Phase 2', stakeholder: 'ENVIRONMENT', vetoType: 'IRREVERSIBLE_ENVIRONMENTAL_DAMAGE', outcome: 'escalated' },
  { id: 'v2', timestamp: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000), decisionId: 'dec-002', decisionTitle: 'Workforce Reduction Plan', stakeholder: 'EMPLOYEES', vetoType: 'MASS_LAYOFFS', outcome: 'blocked' },
];

export const VoxPage: React.FC = () => {
  const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]);
  const [dashboard, setDashboard] = useState<Dashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isInitializing, setIsInitializing] = useState(false);
  
  // Panel states
  const [showSignalsPanel, setShowSignalsPanel] = useState(false);
  const [showVetoesPanel, setShowVetoesPanel] = useState(false);
  const [showSentimentBreakdown, setShowSentimentBreakdown] = useState(false);
  const [showAssemblyModal, setShowAssemblyModal] = useState(false);
  const [editingWeightFor, setEditingWeightFor] = useState<string | null>(null);
  const [newWeight, setNewWeight] = useState<number>(1.0);
  
  // Sentiment trends (mock)
  const sentimentTrend = { direction: 'up' as const, vsLastMonth: '+8%' };
  const stakeholderSentiment: Record<string, number> = {
    'EMPLOYEES': -2,
    'CUSTOMERS': 5,
    'COMMUNITY': 1,
    'ENVIRONMENT': 0,
    'FUTURE_GENERATIONS': 0,
    'SHAREHOLDERS': 3,
  };

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    try {
      const [stkRes, dashRes] = await Promise.all([
        apiClient.api.get<{ data: Stakeholder[] }>('/vox/stakeholders'),
        apiClient.api.get<{ data: Dashboard }>('/vox/dashboard'),
      ]);
      if (stkRes.success) {setStakeholders((stkRes.data as any)?.data || stkRes.data || []);}
      if (dashRes.success) {setDashboard((dashRes.data as any)?.data || dashRes.data || null);}
    } catch (error) {
      console.error('Failed to load Vox data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const initializeStakeholders = async () => {
    setIsInitializing(true);
    try {
      await apiClient.api.post('/vox/stakeholders/initialize');
      await loadData();
    } catch (error) {
      console.error('Initialize failed:', error);
    } finally {
      setIsInitializing(false);
    }
  };

  const getStakeholderIcon = (type: string) => {
    switch (type) {
      case 'EMPLOYEES': return <Users className="w-5 h-5 text-blue-400" />;
      case 'CUSTOMERS': return <Heart className="w-5 h-5 text-pink-400" />;
      case 'COMMUNITY': return <Users className="w-5 h-5 text-amber-400" />;
      case 'ENVIRONMENT': return <Leaf className="w-5 h-5 text-emerald-400" />;
      case 'FUTURE_GENERATIONS': return <Clock className="w-5 h-5 text-purple-400" />;
      case 'SHAREHOLDERS': return <Scale className="w-5 h-5 text-cyan-400" />;
      default: return <Users className="w-5 h-5 text-slate-400" />;
    }
  };

  const getStakeholderColor = (type: string) => {
    switch (type) {
      case 'EMPLOYEES': return 'border-blue-500/50 bg-blue-500/10';
      case 'CUSTOMERS': return 'border-pink-500/50 bg-pink-500/10';
      case 'COMMUNITY': return 'border-amber-500/50 bg-amber-500/10';
      case 'ENVIRONMENT': return 'border-emerald-500/50 bg-emerald-500/10';
      case 'FUTURE_GENERATIONS': return 'border-purple-500/50 bg-purple-500/10';
      case 'SHAREHOLDERS': return 'border-cyan-500/50 bg-cyan-500/10';
      default: return 'border-slate-500/50 bg-slate-500/10';
    }
  };

  if (isLoading) {
    return <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white">Loading Vox...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-900 text-white p-6">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <MessageSquare className="w-10 h-10 text-cyan-400" />
          <div>
            <h1 className="text-3xl font-bold">CendiaVox™</h1>
            <p className="text-slate-400">Stakeholder Voice Assembly - "Who speaks for those not in the room?"</p>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAssemblyModal(true)}
            className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium flex items-center gap-2 transition-colors"
          >
            <Play className="w-4 h-4" />
            Run Stakeholder Assembly on a Decision
          </button>
        </div>
        <div className="text-xs text-slate-500">
          Linked to: <span className="text-cyan-400">Council</span> • <span className="text-purple-400">Decision DNA</span> • <span className="text-blue-400">Chronos</span>
        </div>
      </div>

      {/* Dashboard Stats */}
      {dashboard && (
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Users className="w-4 h-4" /> Stakeholders</div>
            <div className="text-3xl font-bold">{dashboard.activeStakeholders}</div>
          </div>
          <button 
            onClick={() => setShowSignalsPanel(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-cyan-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm"><MessageSquare className="w-4 h-4" /> Signals (7d)</div>
            <div className="text-3xl font-bold text-cyan-400">{dashboard.signalsLast7Days || MOCK_SIGNALS.length}</div>
            <div className="text-xs text-cyan-400/60 mt-1">Click to view stream →</div>
          </button>
          <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
            <div className="flex items-center gap-2 text-slate-400 text-sm"><Vote className="w-4 h-4" /> Assemblies</div>
            <div className="text-3xl font-bold">{dashboard.totalAssemblies}</div>
          </div>
          <button 
            onClick={() => setShowVetoesPanel(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-red-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="flex items-center gap-2 text-slate-400 text-sm"><AlertTriangle className="w-4 h-4" /> Vetoes (30d)</div>
            <div className="text-3xl font-bold text-red-400">{dashboard.vetoesLast30Days || MOCK_VETOES.length}</div>
            <div className="text-xs text-red-400/60 mt-1">Click to view history →</div>
          </button>
          <button 
            onClick={() => setShowSentimentBreakdown(true)}
            className="bg-slate-800 rounded-lg p-4 border border-slate-700 hover:border-emerald-500/50 hover:bg-slate-700/50 transition-all text-left"
          >
            <div className="text-slate-400 text-sm mb-1 flex items-center justify-between">
              <span>Sentiment</span>
              <span className="flex items-center gap-1 text-emerald-400">
                {sentimentTrend.direction === 'up' ? <TrendingUp className="w-3 h-3" /> : sentimentTrend.direction === 'down' ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                <span className="text-xs">{sentimentTrend.vsLastMonth}</span>
              </span>
            </div>
            <div className="flex gap-1 flex-wrap">
              {Object.entries(dashboard.sentimentBreakdown || {}).slice(0, 3).map(([k, v]) => (
                <span key={k} className="text-xs px-1.5 py-0.5 bg-slate-700 rounded">{k.substring(0, 3)}: {v}</span>
              ))}
            </div>
            <div className="text-xs text-emerald-400/60 mt-1">Improving vs last month →</div>
          </button>
        </div>
      )}

      {/* Initialize Button */}
      {stakeholders.length === 0 && (
        <div className="text-center py-12 bg-slate-800 rounded-lg border border-slate-700 mb-8">
          <MessageSquare className="w-16 h-16 mx-auto mb-4 text-cyan-400 opacity-50" />
          <h3 className="text-xl font-semibold mb-2">No Stakeholders Configured</h3>
          <p className="text-slate-400 mb-6">Initialize default stakeholder voices including employees, customers, community, environment, and future generations.</p>
          <button onClick={initializeStakeholders} disabled={isInitializing} className="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium disabled:opacity-50">
            {isInitializing ? 'Initializing...' : 'Initialize Stakeholder Voices'}
          </button>
        </div>
      )}

      {/* Stakeholder Cards */}
      {stakeholders.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {stakeholders.map(s => {
            const stakeholderSignals = MOCK_SIGNALS.filter(sig => sig.stakeholder === s.stakeholderType).length;
            const stakeholderVetoes = MOCK_VETOES.filter(v => v.stakeholder === s.stakeholderType).length;
            
            return (
              <div key={s.id} className={`rounded-lg p-6 border ${getStakeholderColor(s.stakeholderType)}`}>
                <div className="flex items-center gap-3 mb-4">
                  {getStakeholderIcon(s.stakeholderType)}
                  <div className="flex-1">
                    <div className="font-semibold">{s.name}</div>
                    <div className="text-xs text-slate-400">{s.stakeholderType.replace(/_/g, ' ')}</div>
                  </div>
                  {/* Signals & Vetoes mini badges */}
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setShowSignalsPanel(true)}
                      className={`text-xs px-2 py-1 rounded ${stakeholderSignals > 0 ? 'bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30' : 'bg-slate-700 text-slate-500'}`}
                      title={`${stakeholderSignals} signals in last 7 days`}
                    >
                      📡 {stakeholderSignals}
                    </button>
                    <button 
                      onClick={() => setShowVetoesPanel(true)}
                      className={`text-xs px-2 py-1 rounded ${stakeholderVetoes > 0 ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-slate-700 text-slate-500'}`}
                      title={`${stakeholderVetoes} vetoes in last 30 days`}
                    >
                      🛑 {stakeholderVetoes}
                    </button>
                  </div>
                </div>
                <p className="text-sm text-slate-300 mb-4">{s.description}</p>
                <div className="space-y-3 text-sm">
                  {/* Editable Voice Weight */}
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1 group relative">
                      Voice Weight
                      <span className="text-slate-600 text-xs cursor-help">ⓘ</span>
                      <span className="absolute bottom-full left-0 mb-2 px-3 py-2 bg-slate-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none w-64 z-10 border border-slate-700">
                        Voice Weight determines how strongly this stakeholder's interests are weighted in Council deliberations and risk scoring.
                      </span>
                    </span>
                    {editingWeightFor === s.id ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={newWeight}
                          onChange={(e) => setNewWeight(parseFloat(e.target.value) || 1.0)}
                          step="0.1"
                          min="0.1"
                          max="2.0"
                          className="w-16 px-2 py-1 bg-slate-700 border border-slate-600 rounded text-sm"
                        />
                        <button 
                          onClick={() => {
                            // Would save to backend here
                            setEditingWeightFor(null);
                          }}
                          className="text-emerald-400 hover:text-emerald-300"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <button 
                        onClick={() => { setEditingWeightFor(s.id); setNewWeight(s.voiceWeight); }}
                        className="font-medium flex items-center gap-1 hover:text-cyan-400 transition-colors group"
                      >
                        {s.voiceWeight.toFixed(1)}x
                        <Edit2 className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </button>
                    )}
                  </div>
                  {/* Weight audit trail hint */}
                  <div className="text-[10px] text-slate-500">
                    Last changed: 2025-11-10 by Governance Admin
                  </div>
                  <div>
                    <span className="text-slate-400">Veto Rights:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.vetoRights.map((right, i) => (
                        <span key={i} className="text-xs px-2 py-0.5 bg-red-500/20 text-red-300 rounded">
                          {right.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Philosophy Banner - Sharpened */}
      <div className="mt-8 bg-gradient-to-r from-cyan-900/50 to-purple-900/50 rounded-lg p-6 border border-cyan-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Scale className="w-6 h-6 text-cyan-400" />
          <h3 className="text-lg font-semibold">Stakeholder Capitalism Philosophy</h3>
        </div>
        <p className="text-slate-300">
          <strong className="text-white">CendiaVox™ enforces stakeholder capitalism in decision-making.</strong> Every major decision 
          is tested against the interests of employees, customers, communities, environment, and future generations. 
          All proxies represent voices that cannot speak for themselves.
        </p>
        <div className="mt-4 flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
            <span>Environment has veto on irreversible harm</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-purple-400"></div>
            <span>Future generations have veto on generational debt</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-400"></div>
            <span>Employees have veto on unsafe conditions</span>
          </div>
        </div>
      </div>

      {/* Signals Stream Panel */}
      {showSignalsPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setShowSignalsPanel(false)}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">📡 Signals Stream</h2>
                <p className="text-sm text-slate-400">Live sensing from all stakeholder channels</p>
              </div>
              <button onClick={() => setShowSignalsPanel(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_SIGNALS.map(signal => (
                <div key={signal.id} className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      signal.severity === 'critical' ? 'bg-red-500/20 text-red-300' :
                      signal.severity === 'high' ? 'bg-orange-500/20 text-orange-300' :
                      signal.severity === 'medium' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-green-500/20 text-green-300'
                    }`}>
                      {signal.severity.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{signal.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm mb-2">{signal.summary}</div>
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span>{signal.stakeholder.replace(/_/g, ' ')}</span>
                    <span className="flex items-center gap-1">
                      {signal.source}
                      <ExternalLink className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Vetoes History Panel */}
      {showVetoesPanel && (
        <div className="fixed inset-0 bg-black/50 flex items-start justify-end z-50" onClick={() => setShowVetoesPanel(false)}>
          <div className="w-[500px] h-full bg-slate-900 border-l border-slate-700 overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between sticky top-0 bg-slate-900">
              <div>
                <h2 className="text-xl font-bold">🛑 Veto History</h2>
                <p className="text-sm text-slate-400">Decisions where stakeholder vetoes were triggered</p>
              </div>
              <button onClick={() => setShowVetoesPanel(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {MOCK_VETOES.map(veto => (
                <div key={veto.id} className="p-4 bg-slate-800 rounded-lg border border-red-500/30">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-xs px-2 py-0.5 rounded ${
                      veto.outcome === 'blocked' ? 'bg-red-500/20 text-red-300' :
                      veto.outcome === 'escalated' ? 'bg-amber-500/20 text-amber-300' :
                      'bg-slate-500/20 text-slate-300'
                    }`}>
                      {veto.outcome.toUpperCase()}
                    </span>
                    <span className="text-xs text-slate-500">{veto.timestamp.toLocaleDateString()}</span>
                  </div>
                  <div className="text-sm font-medium mb-1">{veto.decisionTitle}</div>
                  <div className="text-xs text-slate-400 mb-2">{veto.vetoType.replace(/_/g, ' ')}</div>
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Triggered by: {veto.stakeholder.replace(/_/g, ' ')}</span>
                    <button 
                      onClick={() => window.open(`/cortex/intelligence/decision-dna?id=${veto.decisionId}`, '_blank')}
                      className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1"
                    >
                      View in DNA <ExternalLink className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              ))}
              {MOCK_VETOES.length === 0 && (
                <div className="text-center py-8 text-slate-500">No vetoes in last 30 days</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Sentiment Breakdown Modal */}
      {showSentimentBreakdown && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowSentimentBreakdown(false)}>
          <div className="bg-slate-900 rounded-xl border border-slate-700 w-[500px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold">📊 Sentiment Breakdown</h2>
                <p className="text-sm text-slate-400">ESG pulse by stakeholder group</p>
              </div>
              <button onClick={() => setShowSentimentBreakdown(false)} className="text-slate-400 hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                <span className="text-slate-300">Overall Trend</span>
                <span className="flex items-center gap-2 text-emerald-400">
                  <TrendingUp className="w-4 h-4" />
                  {sentimentTrend.vsLastMonth} vs last month
                </span>
              </div>
              {Object.entries(stakeholderSentiment).map(([stakeholder, value]) => (
                <div key={stakeholder} className="flex items-center justify-between p-3 bg-slate-800 rounded-lg">
                  <span className="text-slate-300">{stakeholder.replace(/_/g, ' ')}</span>
                  <span className={`font-medium ${value > 0 ? 'text-emerald-400' : value < 0 ? 'text-red-400' : 'text-slate-400'}`}>
                    {value > 0 ? '+' : ''}{value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Run Assembly Modal */}
      {showAssemblyModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAssemblyModal(false)}>
          <div className="bg-slate-900 rounded-xl border border-cyan-500/30 w-[600px] max-h-[80vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
            <div className="p-6 border-b border-slate-700">
              <h2 className="text-xl font-bold mb-1">🗣️ Run Stakeholder Assembly</h2>
              <p className="text-sm text-slate-400">Convene stakeholder voices to deliberate on a decision</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Select Decision</label>
                <select className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white">
                  <option value="">Choose from recent Decision DNA items...</option>
                  <option value="dec-001">DEC-001: Facility Expansion Phase 2</option>
                  <option value="dec-002">DEC-002: Workforce Reduction Plan</option>
                  <option value="dec-003">DEC-003: AI Infrastructure Investment</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Or enter Decision ID</label>
                <input 
                  type="text" 
                  placeholder="e.g., DEC-2025-0042"
                  className="w-full px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-white placeholder:text-slate-500"
                />
              </div>
              <div className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30">
                <h4 className="font-medium text-cyan-300 mb-2">What happens next:</h4>
                <ul className="text-sm text-slate-300 space-y-1">
                  <li>• A Council session will be spawned with {stakeholders.length || 6} stakeholder voices</li>
                  <li>• Each voice is represented by a configured AI persona</li>
                  <li>• The assembly will be logged to Decision DNA as: <strong>Stakeholder Assembly: Yes</strong></li>
                  <li>• Results link back to this CendiaVox configuration</li>
                </ul>
              </div>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowAssemblyModal(false)}
                  className="px-4 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowAssemblyModal(false);
                    window.open('/cortex/intelligence/council?assembly=true', '_blank');
                  }}
                  className="px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded-lg font-medium"
                >
                  Start Assembly →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VoxPage;
