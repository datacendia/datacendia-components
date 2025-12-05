/**
 * CendiaCrucible™ - Synthetic Multiverse Simulation Engine
 * 
 * "Synthetic Reality. Infinite Stress Testing. Failure Before It Happens."
 */

import React, { useState, useEffect } from 'react';
import {
  Flame,
  Play,
  Target,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  Shield,
  Users,
  DollarSign,
  Cpu,
  Globe,
  Zap,
  GitBranch,
  Network,
  BarChart3,
  Brain,
  ChevronRight,
  CheckCircle,
  XCircle,
  Clock,
  Sparkles,
} from 'lucide-react';
import apiClient from '../../lib/api/client';

// Types
interface SimulationTemplate {
  type: string;
  name: string;
  description: string;
  shockCount: number;
  shocks: Array<{
    target: string;
    type: string;
    value: number;
    timing: string;
    duration?: number;
  }>;
}

// Scenario explanations for guided view
const scenarioExplanations: Record<string, { title: string; whatHappens: string; whoAffected: string; realWorldExample: string }> = {
  FINANCIAL_STRESS: {
    title: 'Financial Stress Test',
    whatHappens: 'Simulates a sudden 30% revenue decline over 90 days combined with 15% operating cost increases. The system models how your cash flow, runway, and financial KPIs cascade through the organization.',
    whoAffected: 'Finance team, all departments with budgets, investors, creditors',
    realWorldExample: '2008 financial crisis, COVID-19 revenue collapse, major customer loss',
  },
  OPERATIONAL_SHOCK: {
    title: 'Operational Disruption',
    whatHappens: 'Models a 50% throughput reduction with 2.5x longer cycle times. Shows how operational bottlenecks propagate through your supply chain, delivery timelines, and customer satisfaction.',
    whoAffected: 'Operations, logistics, customer service, sales teams',
    realWorldExample: 'Factory shutdown, key system outage, major process failure',
  },
  CYBER_ATTACK: {
    title: 'Cybersecurity Incident',
    whatHappens: 'Simulates complete system unavailability, 80% security score drop, and 40% reputation damage over 6 months. Models incident response, recovery costs, and long-term trust impact.',
    whoAffected: 'IT, security, legal, PR, all employees, customers',
    realWorldExample: 'Colonial Pipeline ransomware, SolarWinds breach, Equifax data breach',
  },
  REGULATORY_CHANGE: {
    title: 'Regulatory Shock',
    whatHappens: 'Models 100% compliance cost increase over a year with 30% reduction in operational flexibility. Shows how new regulations affect product development, market access, and competitive positioning.',
    whoAffected: 'Legal, compliance, product teams, international operations',
    realWorldExample: 'GDPR implementation, AI Act compliance, SOX requirements',
  },
  CULTURAL_SHIFT: {
    title: 'Cultural Disruption',
    whatHappens: 'Simulates 40% drop in employee engagement over 60 days and 3x turnover rate increase. Models institutional knowledge loss, productivity decline, and recruitment costs.',
    whoAffected: 'HR, all managers, entire workforce',
    realWorldExample: 'Mass layoffs aftermath, toxic leadership exposure, remote work backlash',
  },
  ESG_EVENT: {
    title: 'ESG Crisis',
    whatHappens: 'Models 60% ESG score collapse and 35% investor confidence decline over 4 months. Shows impact on fundraising, partnerships, and brand value.',
    whoAffected: 'Executive team, investor relations, sustainability, PR',
    realWorldExample: 'Environmental scandal, labor violations exposed, governance failures',
  },
  MA_SCENARIO: {
    title: 'M&A Event',
    whatHappens: 'Simulates $5M integration costs and 25% productivity decline over 6 months. Models culture clash, system integration challenges, and talent retention during transition.',
    whoAffected: 'All employees, IT, HR, finance, operations',
    realWorldExample: 'Major acquisition, merger integration, spin-off transition',
  },
  MARKET_DISRUPTION: {
    title: 'Market Disruption',
    whatHappens: 'Models 20% market share loss over a year with 15% pricing power reduction. Shows competitive response options and long-term strategic positioning impacts.',
    whoAffected: 'Sales, marketing, product, strategy, executive team',
    realWorldExample: 'New competitor entry, technology disruption, demand shift',
  },
  SUPPLY_CHAIN: {
    title: 'Supply Chain Breakdown',
    whatHappens: 'Simulates 70% supply availability drop with 4x lead time increase. Models inventory depletion, customer impact, and alternative sourcing costs.',
    whoAffected: 'Procurement, operations, logistics, sales, customers',
    realWorldExample: 'Suez Canal blockage, chip shortage, pandemic supply disruption',
  },
  TALENT_EXODUS: {
    title: 'Talent Crisis',
    whatHappens: 'Models 50% key talent loss and 40% institutional knowledge decline over 90 days. Shows recruitment costs, productivity gaps, and competitive vulnerability.',
    whoAffected: 'All departments, HR, executive leadership',
    realWorldExample: 'Executive departures, team poaching, great resignation wave',
  },
  TECHNOLOGY_FAILURE: {
    title: 'Technology Failure',
    whatHappens: 'Simulates complete core system outage with 72-hour recovery time. Models business continuity, customer impact, and recovery procedures.',
    whoAffected: 'IT, all digital operations, customers, partners',
    realWorldExample: 'AWS outage, database corruption, critical software failure',
  },
  BLACK_SWAN: {
    title: 'Black Swan Event',
    whatHappens: 'Models 80% operational collapse with 60% external environment degradation. Stress tests your organization against extreme, unpredictable events.',
    whoAffected: 'Entire organization, all stakeholders',
    realWorldExample: 'Global pandemic, natural disaster, unprecedented market crash',
  },
  CUSTOM: {
    title: 'Custom Scenario',
    whatHappens: 'Define your own shocks and parameters to test specific hypotheses about your organization\'s resilience.',
    whoAffected: 'Depends on your configuration',
    realWorldExample: 'Your unique business risks and concerns',
  },
};

interface Simulation {
  id: string;
  name: string;
  simulation_type: string;
  status: string;
  created_at: string;
  results_summary?: ResultSummary;
  universes?: Universe[];
  impacts?: Impact[];
  council_deliberations?: CouncilDeliberation[];
}

interface Universe {
  id: string;
  universe_number: number;
  probability: number;
  outcome_sentiment: string;
  outcome_summary?: string;
}

interface Impact {
  id: string;
  impact_category: string;
  entity_name: string;
  change_percent?: number;
  severity: string;
}

interface CouncilDeliberation {
  id: string;
  agent_responses: AgentResponse[];
  consensus_reached: boolean;
  final_recommendation?: string;
  confidence_score?: number;
}

interface AgentResponse {
  agentRole: string;
  analysis: string;
  confidenceLevel: number;
}

interface ResultSummary {
  totalUniverses: number;
  bestCase: { probability: number; sentiment: string; summary: string };
  worstCase: { probability: number; sentiment: string; summary: string };
  mostLikely: { probability: number; sentiment: string; summary: string };
  keyRisks: string[];
  keyOpportunities: string[];
  overallConfidence: number;
}

// Scenario icons
const scenarioIcons: Record<string, React.ReactNode> = {
  FINANCIAL_STRESS: <DollarSign className="w-5 h-5" />,
  OPERATIONAL_SHOCK: <Cpu className="w-5 h-5" />,
  CYBER_ATTACK: <Shield className="w-5 h-5" />,
  REGULATORY_CHANGE: <Globe className="w-5 h-5" />,
  CULTURAL_SHIFT: <Users className="w-5 h-5" />,
  MARKET_DISRUPTION: <TrendingDown className="w-5 h-5" />,
  SUPPLY_CHAIN: <Network className="w-5 h-5" />,
  TECHNOLOGY_FAILURE: <Zap className="w-5 h-5" />,
  BLACK_SWAN: <AlertTriangle className="w-5 h-5" />,
};

export const CruciblePage: React.FC = () => {
  const [templates, setTemplates] = useState<SimulationTemplate[]>([]);
  const [simulations, setSimulations] = useState<Simulation[]>([]);
  const [activeSimulation, setActiveSimulation] = useState<Simulation | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRunning, setIsRunning] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [view, setView] = useState<'templates' | 'history' | 'results'>('templates');
  const [showDetailModal, setShowDetailModal] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [templatesRes, simulationsRes] = await Promise.all([
          apiClient.api.get<{ data: SimulationTemplate[] }>('/crucible/templates'),
          apiClient.api.get<{ data: Simulation[] }>('/crucible/simulations'),
        ]);

        console.log('templatesRes:', templatesRes);
        if (templatesRes.success && templatesRes.data) {
          const data = (templatesRes.data as any).data || templatesRes.data;
          console.log('templates data:', data);
          setTemplates(Array.isArray(data) ? data : []);
        }
        if (simulationsRes.success && simulationsRes.data) {
          const data = (simulationsRes.data as any).data || simulationsRes.data;
          setSimulations(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error('Failed to load Crucible data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const runSimulation = async (templateType: string) => {
    setIsRunning(true);
    try {
      const createRes = await apiClient.api.post<any>('/crucible/simulations', {
        name: `${templateType.replace(/_/g, ' ')} - ${new Date().toLocaleDateString()}`,
        simulationType: templateType,
      });

      if (createRes.success && createRes.data) {
        const simulation = (createRes.data as any).data || createRes.data as Simulation;
        const runRes = await apiClient.api.post<{ data: any }>(`/crucible/simulations/${simulation.id}/run`);
        
        if (runRes.success) {
          const detailRes = await apiClient.api.get<any>(`/crucible/simulations/${simulation.id}`);
          if (detailRes.success && detailRes.data) {
            setActiveSimulation((detailRes.data as any).data || detailRes.data as Simulation);
            setView('results');
            const refreshRes = await apiClient.api.get<any>('/crucible/simulations');
            if (refreshRes.success && refreshRes.data) {
              setSimulations((refreshRes.data as any).data || refreshRes.data as Simulation[]);
            }
          }
        }
      }
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const loadSimulationDetails = async (id: string) => {
    const res = await apiClient.api.get<any>(`/crucible/simulations/${id}`);
    if (res.success && res.data) {
      setActiveSimulation((res.data as any).data || res.data as Simulation);
      setView('results');
    }
  };

  // Get the currently selected template details for modal
  const modalTemplate = showDetailModal ? templates.find(t => t.type === showDetailModal) : null;
  const modalExplanation = showDetailModal ? scenarioExplanations[showDetailModal] : null;

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Scenario Detail Modal */}
      {showDetailModal && modalTemplate && modalExplanation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-700">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${
                    showDetailModal === 'BLACK_SWAN' ? 'bg-red-500/20 text-red-400' :
                    showDetailModal === 'CYBER_ATTACK' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-purple-500/20 text-purple-400'
                  }`}>
                    {scenarioIcons[showDetailModal] || <Target className="w-6 h-6" />}
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-white">{modalExplanation.title}</h2>
                    <p className="text-gray-400 text-sm">{modalTemplate.shockCount} stress factors applied</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailModal(null)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                >
                  <XCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6">
              {/* What Happens */}
              <div>
                <h3 className="text-sm font-semibold text-purple-400 uppercase tracking-wide mb-2">
                  What Happens In This Simulation
                </h3>
                <p className="text-gray-300 leading-relaxed">{modalExplanation.whatHappens}</p>
              </div>

              {/* Shocks Applied */}
              <div>
                <h3 className="text-sm font-semibold text-orange-400 uppercase tracking-wide mb-3">
                  Stress Factors Applied
                </h3>
                <div className="space-y-2">
                  {modalTemplate.shocks?.map((shock, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-slate-800/50 rounded-lg border border-slate-700">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      <div className="flex-1">
                        <span className="text-white font-medium capitalize">{shock.target.replace(/_/g, ' ')}</span>
                        <span className="text-gray-400 mx-2">→</span>
                        <span className={shock.value < 0 ? 'text-red-400' : 'text-yellow-400'}>
                          {shock.type === 'percentage' ? `${shock.value > 0 ? '+' : ''}${shock.value}%` :
                           shock.type === 'multiplier' ? `${shock.value}x` :
                           shock.value}
                        </span>
                        <span className="text-gray-500 text-sm ml-2">({shock.timing}{shock.duration ? `, ${shock.duration} days` : ''})</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Who Is Affected */}
              <div>
                <h3 className="text-sm font-semibold text-blue-400 uppercase tracking-wide mb-2">
                  Who Is Affected
                </h3>
                <p className="text-gray-300">{modalExplanation.whoAffected}</p>
              </div>

              {/* Real World Examples */}
              <div>
                <h3 className="text-sm font-semibold text-green-400 uppercase tracking-wide mb-2">
                  Real World Examples
                </h3>
                <p className="text-gray-300 italic">"{modalExplanation.realWorldExample}"</p>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 border-t border-slate-700 flex gap-3">
              <button
                onClick={() => {
                  setSelectedTemplate(showDetailModal);
                  setShowDetailModal(null);
                }}
                className="flex-1 px-4 py-3 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-xl transition-colors"
              >
                Select This Scenario
              </button>
              <button
                onClick={() => setShowDetailModal(null)}
                className="px-4 py-3 bg-slate-800 hover:bg-slate-700 text-gray-300 font-medium rounded-xl transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="border-b border-purple-500/20 bg-black/40 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl shadow-lg shadow-orange-500/20">
                <Flame className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                  CendiaCrucible™
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                    SOVEREIGN
                  </span>
                </h1>
                <p className="text-purple-300/80 text-sm">
                  Synthetic Reality. Infinite Stress Testing. Failure Before It Happens.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg">
              {['templates', 'history', 'results'].map((v) => (
                <button
                  key={v}
                  onClick={() => setView(v as any)}
                  disabled={v === 'results' && !activeSimulation}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                    view === v ? 'bg-purple-500 text-white' : 'text-gray-400 hover:text-white disabled:opacity-50'
                  }`}
                >
                  {v === 'templates' && <Target className="w-4 h-4 inline mr-2" />}
                  {v === 'history' && <Clock className="w-4 h-4 inline mr-2" />}
                  {v === 'results' && <BarChart3 className="w-4 h-4 inline mr-2" />}
                  {v.charAt(0).toUpperCase() + v.slice(1)}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4" />
              <p className="text-purple-300">Initializing Crucible Engine...</p>
            </div>
          </div>
        ) : view === 'templates' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Simulation Scenarios</h2>
              <p className="text-gray-400">Select a scenario to stress test your organization's resilience</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {templates.map((template) => (
                <div
                  key={template.type}
                  className={`p-6 rounded-xl border transition-all ${
                    selectedTemplate === template.type
                      ? 'bg-purple-900/40 border-purple-500 ring-2 ring-purple-500/50'
                      : 'bg-slate-900/80 border-slate-700 hover:border-purple-500/50'
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-lg ${
                      template.type === 'BLACK_SWAN' ? 'bg-red-500/20 text-red-400' :
                      template.type === 'CYBER_ATTACK' ? 'bg-orange-500/20 text-orange-400' :
                      'bg-purple-500/20 text-purple-400'
                    }`}>
                      {scenarioIcons[template.type] || <Target className="w-5 h-5" />}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-white mb-1">{template.name}</h3>
                      <p className="text-sm text-gray-400 mb-3">{template.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-2 py-1 bg-slate-800 text-gray-300 rounded">
                          {template.shockCount} shocks
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4 pt-4 border-t border-slate-700/50">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowDetailModal(template.type);
                      }}
                      className="flex-1 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700 text-gray-300 rounded-lg transition-colors flex items-center justify-center gap-2"
                    >
                      <Brain className="w-4 h-4" />
                      Learn More
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedTemplate(template.type);
                      }}
                      className={`flex-1 px-3 py-2 text-sm rounded-lg transition-colors flex items-center justify-center gap-2 ${
                        selectedTemplate === template.type
                          ? 'bg-purple-600 text-white'
                          : 'bg-purple-600/20 hover:bg-purple-600/40 text-purple-300'
                      }`}
                    >
                      <Target className="w-4 h-4" />
                      {selectedTemplate === template.type ? 'Selected' : 'Select'}
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {selectedTemplate && (
              <div className="mt-8 flex justify-center">
                <button
                  onClick={() => runSimulation(selectedTemplate)}
                  disabled={isRunning}
                  className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-400 hover:to-red-500 text-white shadow-lg shadow-orange-500/30 flex items-center gap-3 ${
                    isRunning ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {isRunning ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Running Multiverse Simulation...
                    </>
                  ) : (
                    <>
                      <Play className="w-5 h-5" />
                      Launch Simulation
                      <Sparkles className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        ) : view === 'history' ? (
          <div>
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-white mb-2">Simulation History</h2>
              <p className="text-gray-400">View past simulations and their results</p>
            </div>

            {simulations.length === 0 ? (
              <div className="text-center py-16 bg-white/5 rounded-xl border border-white/10">
                <Flame className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-50" />
                <p className="text-gray-400">No simulations yet</p>
                <button onClick={() => setView('templates')} className="mt-4 text-purple-400 hover:text-purple-300">
                  Create your first simulation →
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {simulations.map((sim) => (
                  <div
                    key={sim.id}
                    onClick={() => loadSimulationDetails(sim.id)}
                    className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-purple-500/50 cursor-pointer transition-all hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="p-2 bg-purple-500/20 rounded-lg text-purple-400">
                          {scenarioIcons[sim.simulation_type] || <Target className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-medium text-white">{sim.name}</h3>
                          <p className="text-sm text-gray-400">
                            {new Date(sim.created_at).toLocaleDateString()} • {sim.simulation_type.replace(/_/g, ' ')}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          sim.status === 'COMPLETED' ? 'bg-green-500/20 text-green-400' :
                          sim.status === 'RUNNING' ? 'bg-blue-500/20 text-blue-400' :
                          sim.status === 'FAILED' ? 'bg-red-500/20 text-red-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {sim.status}
                        </span>
                        <ChevronRight className="w-5 h-5 text-gray-400" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : view === 'results' && activeSimulation ? (
          <div>
            {/* Results Header */}
            <div className="mb-8 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold text-white mb-1">{activeSimulation.name}</h2>
                <p className="text-gray-400">
                  {activeSimulation.simulation_type.replace(/_/g, ' ')} • {activeSimulation.universes?.length || 0} parallel universes
                </p>
              </div>
              {activeSimulation.status === 'COMPLETED' && (
                <span className="flex items-center gap-2 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm">
                  <CheckCircle className="w-4 h-4" /> Completed
                </span>
              )}
            </div>

            {/* Summary Cards */}
            {activeSimulation.results_summary && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <div className="p-6 bg-green-500/10 border border-green-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-green-400 mb-3">
                    <TrendingUp className="w-5 h-5" />
                    <span className="font-medium">Best Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.bestCase.probability * 100).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.bestCase.summary}</p>
                </div>

                <div className="p-6 bg-purple-500/10 border border-purple-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-purple-400 mb-3">
                    <Target className="w-5 h-5" />
                    <span className="font-medium">Most Likely</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.mostLikely.probability * 100).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.mostLikely.summary}</p>
                </div>

                <div className="p-6 bg-red-500/10 border border-red-500/30 rounded-xl">
                  <div className="flex items-center gap-2 text-red-400 mb-3">
                    <TrendingDown className="w-5 h-5" />
                    <span className="font-medium">Worst Case</span>
                  </div>
                  <p className="text-white text-lg font-semibold mb-2">
                    {(activeSimulation.results_summary.worstCase.probability * 100).toFixed(1)}% probability
                  </p>
                  <p className="text-gray-300 text-sm">{activeSimulation.results_summary.worstCase.summary}</p>
                </div>
              </div>
            )}

            {/* Key Risks & Opportunities */}
            {activeSimulation.results_summary && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-orange-400" />
                    Key Risks
                  </h3>
                  <ul className="space-y-2">
                    {activeSimulation.results_summary.keyRisks.map((risk, i) => (
                      <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                        <XCircle className="w-4 h-4 text-red-400 mt-0.5 flex-shrink-0" />
                        {risk}
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-6 bg-white/5 border border-white/10 rounded-xl">
                  <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-green-400" />
                    Opportunities
                  </h3>
                  <ul className="space-y-2">
                    {activeSimulation.results_summary.keyOpportunities.length > 0 ? (
                      activeSimulation.results_summary.keyOpportunities.map((opp, i) => (
                        <li key={i} className="flex items-start gap-2 text-gray-300 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                          {opp}
                        </li>
                      ))
                    ) : (
                      <li className="text-gray-400 text-sm">No significant opportunities in this scenario</li>
                    )}
                  </ul>
                </div>
              </div>
            )}

            {/* Council Deliberation */}
            {activeSimulation.council_deliberations && activeSimulation.council_deliberations.length > 0 && (
              <div className="mb-8">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-400" />
                  Council AI Deliberation
                </h3>
                {activeSimulation.council_deliberations.map((delib) => (
                  <div key={delib.id} className="p-6 bg-white/5 border border-white/10 rounded-xl">
                    <div className="flex items-center justify-between mb-6">
                      <span className={`flex items-center gap-2 ${delib.consensus_reached ? 'text-green-400' : 'text-orange-400'}`}>
                        {delib.consensus_reached ? <CheckCircle className="w-5 h-5" /> : <AlertTriangle className="w-5 h-5" />}
                        {delib.consensus_reached ? 'Consensus Reached' : 'Deliberation Ongoing'}
                      </span>
                      {delib.confidence_score !== undefined && (
                        <span className="text-sm text-gray-400">Confidence: {delib.confidence_score.toFixed(0)}%</span>
                      )}
                    </div>

                    {delib.final_recommendation && (
                      <div className="p-4 bg-purple-500/10 border border-purple-500/30 rounded-lg mb-6">
                        <h4 className="font-medium text-purple-300 mb-2">Final Recommendation</h4>
                        <p className="text-white">{delib.final_recommendation}</p>
                      </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {delib.agent_responses.map((agent, i) => (
                        <div key={i} className="p-4 bg-black/30 rounded-lg">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                              {agent.agentRole.slice(0, 2)}
                            </div>
                            <span className="font-medium text-white text-sm">{agent.agentRole}</span>
                          </div>
                          <p className="text-gray-300 text-xs mb-2 line-clamp-3">{agent.analysis}</p>
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">Confidence</span>
                            <span className="text-xs text-purple-400">{agent.confidenceLevel}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Parallel Universes */}
            {activeSimulation.universes && activeSimulation.universes.length > 0 && (
              <div>
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-blue-400" />
                  Parallel Universe Outcomes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {activeSimulation.universes.slice(0, 8).map((universe) => (
                    <div
                      key={universe.id}
                      className={`p-4 rounded-xl border ${
                        universe.outcome_sentiment === 'CATASTROPHIC' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                        universe.outcome_sentiment === 'NEGATIVE' ? 'bg-orange-500/10 border-orange-500/30 text-orange-400' :
                        universe.outcome_sentiment === 'POSITIVE' ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                        universe.outcome_sentiment === 'OPTIMAL' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' :
                        'bg-gray-500/10 border-gray-500/30 text-gray-400'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium">Universe #{universe.universe_number}</span>
                        <span className="text-xs px-2 py-0.5 rounded bg-white/10">
                          {(universe.probability * 100).toFixed(1)}%
                        </span>
                      </div>
                      <p className="font-medium text-sm mb-2">{universe.outcome_sentiment}</p>
                      {universe.outcome_summary && (
                        <p className="text-xs text-gray-300 line-clamp-2">{universe.outcome_summary}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default CruciblePage;
