/**
 * CendiaOracle™ - Predictive Decision Intelligence
 * "What If" Time Machine for Strategic Decisions
 * 
 * The most visually spectacular feature in the platform
 */

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '../../lib/utils';

// =============================================================================
// TYPES
// =============================================================================

interface Universe {
  id: string;
  name: string;
  description: string;
  decision: string;
  color: string;
  icon: string;
  probability: number;
  timeline: TimelineEvent[];
  outcomes: UniverseOutcome;
  riskProfile: RiskProfile;
  reversibilityScore: number;
  pointOfNoReturn?: TimelineEvent;
}

interface TimelineEvent {
  id: string;
  timestamp: string;
  dayOffset: number;
  title: string;
  description: string;
  type: 'milestone' | 'risk' | 'opportunity' | 'pivot' | 'cascade' | 'external' | 'checkpoint';
  impact: 'positive' | 'negative' | 'neutral' | 'critical';
  confidence: number;
  cascadeEffects?: CascadeEffect[];
  agentInsights?: AgentInsight[];
}

interface CascadeEffect {
  id: string;
  domain: string;
  effect: string;
  magnitude: 'minor' | 'moderate' | 'major' | 'transformative';
  delay: number;
}

interface AgentInsight {
  agentCode: string;
  agentName: string;
  agentAvatar: string;
  perspective: string;
  sentiment: 'bullish' | 'bearish' | 'cautious' | 'neutral';
}

interface UniverseOutcome {
  revenue: OutcomeMetric;
  marketShare: OutcomeMetric;
  teamMorale: OutcomeMetric;
  customerSatisfaction: OutcomeMetric;
  competitivePosition: OutcomeMetric;
  riskExposure: OutcomeMetric;
  innovationCapacity: OutcomeMetric;
  overallScore: number;
}

interface OutcomeMetric {
  current: number;
  projected: number;
  change: number;
  confidence: number;
  trend: 'up' | 'down' | 'stable';
}

interface RiskProfile {
  overall: 'low' | 'moderate' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
}

interface RiskFactor {
  name: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number;
  mitigation?: string;
}

interface HistoricalEcho {
  id: string;
  company: string;
  year: number;
  situation: string;
  decision: string;
  outcome: string;
  similarity: number;
  lessonsLearned: string[];
}

interface OracleSimulation {
  id: string;
  question: string;
  status: 'initializing' | 'simulating' | 'complete' | 'failed';
  universes: Universe[];
  historicalEchoes: HistoricalEcho[];
  recommendation: {
    primaryChoice: string;
    universeId: string;
    confidence: number;
    reasoning: string;
    keyFactors: string[];
    warnings: string[];
  };
}

// =============================================================================
// DEMO DATA
// =============================================================================

const DEMO_SIMULATION: OracleSimulation = {
  id: 'demo-sim-1',
  question: 'Should we acquire CompetitorCo for $50M to accelerate market expansion?',
  status: 'complete',
  universes: [
    {
      id: 'universe-1',
      name: 'Bold Acquisition',
      description: 'Maximum velocity execution with high risk/reward profile',
      decision: 'Proceed with full commitment and accelerated timeline',
      color: '#10B981',
      icon: '🚀',
      probability: 35,
      reversibilityScore: 35,
      riskProfile: { overall: 'high', score: 75, factors: [] },
      outcomes: {
        revenue: { current: 100, projected: 145, change: 45, confidence: 72, trend: 'up' },
        marketShare: { current: 100, projected: 138, change: 38, confidence: 68, trend: 'up' },
        teamMorale: { current: 100, projected: 82, change: -18, confidence: 65, trend: 'down' },
        customerSatisfaction: { current: 100, projected: 95, change: -5, confidence: 70, trend: 'down' },
        competitivePosition: { current: 100, projected: 155, change: 55, confidence: 75, trend: 'up' },
        riskExposure: { current: 100, projected: 165, change: 65, confidence: 80, trend: 'up' },
        innovationCapacity: { current: 100, projected: 125, change: 25, confidence: 60, trend: 'up' },
        overallScore: 78,
      },
      timeline: [
        { id: 'e1', timestamp: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 7, title: 'Acquisition Announced', description: 'Public announcement and stakeholder communication', type: 'milestone', impact: 'neutral', confidence: 95 },
        { id: 'e2', timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 30, title: 'Integration Team Formed', description: 'Cross-functional team begins planning', type: 'milestone', impact: 'positive', confidence: 90 },
        { id: 'e3', timestamp: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 45, title: 'Competitor Response', description: 'Market players react aggressively', type: 'external', impact: 'negative', confidence: 75 },
        { id: 'e4', timestamp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 60, title: 'Culture Clash Emerges', description: 'Integration challenges surface', type: 'risk', impact: 'critical', confidence: 70 },
        { id: 'e5', timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 90, title: 'First Synergies Realized', description: 'Cost savings begin materializing', type: 'opportunity', impact: 'positive', confidence: 65 },
        { id: 'e6', timestamp: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 120, title: 'Market Share Gains', description: 'Combined entity captures new accounts', type: 'milestone', impact: 'positive', confidence: 55 },
        { id: 'e7', timestamp: new Date(Date.now() + 150 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 150, title: 'Talent Retention Crisis', description: 'Key employees consider leaving', type: 'risk', impact: 'negative', confidence: 50 },
        { id: 'e8', timestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 180, title: 'Integration Complete', description: 'Full operational merger achieved', type: 'milestone', impact: 'positive', confidence: 45 },
      ],
    },
    {
      id: 'universe-2',
      name: 'Status Quo',
      description: 'Preserve stability while competitors may advance',
      decision: 'Maintain current course with minimal changes',
      color: '#6B7280',
      icon: '⏸️',
      probability: 25,
      reversibilityScore: 95,
      riskProfile: { overall: 'low', score: 25, factors: [] },
      outcomes: {
        revenue: { current: 100, projected: 108, change: 8, confidence: 85, trend: 'up' },
        marketShare: { current: 100, projected: 92, change: -8, confidence: 80, trend: 'down' },
        teamMorale: { current: 100, projected: 105, change: 5, confidence: 90, trend: 'up' },
        customerSatisfaction: { current: 100, projected: 102, change: 2, confidence: 88, trend: 'stable' },
        competitivePosition: { current: 100, projected: 85, change: -15, confidence: 75, trend: 'down' },
        riskExposure: { current: 100, projected: 90, change: -10, confidence: 85, trend: 'down' },
        innovationCapacity: { current: 100, projected: 95, change: -5, confidence: 80, trend: 'down' },
        overallScore: 62,
      },
      timeline: [
        { id: 'e1', timestamp: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 30, title: 'Business as Usual', description: 'Operations continue without disruption', type: 'milestone', impact: 'neutral', confidence: 95 },
        { id: 'e2', timestamp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 60, title: 'Competitor Acquires Target', description: 'Another player makes the move', type: 'external', impact: 'negative', confidence: 60 },
        { id: 'e3', timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 90, title: 'Market Share Erosion', description: 'Gradual loss to strengthened competitor', type: 'risk', impact: 'negative', confidence: 55 },
        { id: 'e4', timestamp: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 120, title: 'Cost Optimization', description: 'Internal efficiency gains', type: 'opportunity', impact: 'positive', confidence: 70 },
        { id: 'e5', timestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 180, title: 'Strategic Review', description: 'Board questions missed opportunity', type: 'pivot', impact: 'neutral', confidence: 50 },
      ],
    },
    {
      id: 'universe-3',
      name: 'Strategic Partnership',
      description: 'Optimize for sustainable growth with manageable risk',
      decision: 'Pursue partnership instead of acquisition',
      color: '#3B82F6',
      icon: '🤝',
      probability: 30,
      reversibilityScore: 75,
      riskProfile: { overall: 'moderate', score: 45, factors: [] },
      outcomes: {
        revenue: { current: 100, projected: 125, change: 25, confidence: 78, trend: 'up' },
        marketShare: { current: 100, projected: 118, change: 18, confidence: 72, trend: 'up' },
        teamMorale: { current: 100, projected: 110, change: 10, confidence: 80, trend: 'up' },
        customerSatisfaction: { current: 100, projected: 108, change: 8, confidence: 75, trend: 'up' },
        competitivePosition: { current: 100, projected: 130, change: 30, confidence: 70, trend: 'up' },
        riskExposure: { current: 100, projected: 115, change: 15, confidence: 75, trend: 'up' },
        innovationCapacity: { current: 100, projected: 135, change: 35, confidence: 72, trend: 'up' },
        overallScore: 85,
      },
      timeline: [
        { id: 'e1', timestamp: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 14, title: 'Partnership Proposal', description: 'Initial terms presented to target', type: 'milestone', impact: 'neutral', confidence: 90 },
        { id: 'e2', timestamp: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 45, title: 'Terms Negotiated', description: 'Mutually beneficial agreement reached', type: 'milestone', impact: 'positive', confidence: 75 },
        { id: 'e3', timestamp: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 60, title: 'Joint Product Launch', description: 'Combined offering enters market', type: 'opportunity', impact: 'positive', confidence: 70 },
        { id: 'e4', timestamp: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 90, title: 'Customer Adoption', description: 'Market responds positively', type: 'milestone', impact: 'positive', confidence: 65 },
        { id: 'e5', timestamp: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 120, title: 'Expansion Discussion', description: 'Option to deepen relationship', type: 'pivot', impact: 'positive', confidence: 55 },
        { id: 'e6', timestamp: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), dayOffset: 180, title: 'Full Integration Option', description: 'Acquisition becomes viable at better terms', type: 'opportunity', impact: 'positive', confidence: 45 },
      ],
    },
  ],
  historicalEchoes: [
    {
      id: 'echo-1',
      company: 'Microsoft',
      year: 2014,
      situation: 'Considering major acquisition to enter mobile/enterprise',
      decision: 'Acquired Nokia for $7.2B',
      outcome: 'Wrote off $7.6B, laid off 18,000 employees',
      similarity: 72,
      lessonsLearned: ['Culture integration is harder than technology integration', 'Acquisition cannot fix fundamental strategic misalignment'],
    },
    {
      id: 'echo-2',
      company: 'Salesforce',
      year: 2020,
      situation: 'Considering major acquisition during uncertainty',
      decision: 'Acquired Slack for $27.7B',
      outcome: 'Mixed results, but strategic positioning improved',
      similarity: 68,
      lessonsLearned: ['Platform plays require patience', 'Integration planning is as important as deal terms'],
    },
  ],
  recommendation: {
    primaryChoice: 'Strategic Partnership',
    universeId: 'universe-3',
    confidence: 78,
    reasoning: 'Based on comprehensive analysis, the Strategic Partnership approach offers the optimal balance of risk and reward with +25% revenue impact and moderate risk exposure.',
    keyFactors: ['Revenue projection: +25%', 'Risk level: moderate', 'Reversibility: 75%', 'Team impact: positive'],
    warnings: ['Partnership terms may limit future options', 'Competitor may still acquire target'],
  },
};

// =============================================================================
// COMPONENTS
// =============================================================================

const OraclePage: React.FC = () => {
  const [question, setQuestion] = useState('');
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulation, setSimulation] = useState<OracleSimulation | null>(null);
  const [selectedUniverse, setSelectedUniverse] = useState<Universe | null>(null);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [viewMode, setViewMode] = useState<'overview' | 'timeline' | 'comparison'>('overview');
  const [timeHorizon, setTimeHorizon] = useState<'90d' | '180d' | '1y'>('180d');
  const timelineRef = useRef<HTMLDivElement>(null);

  const runSimulation = async () => {
    if (!question.trim()) return;
    
    setIsSimulating(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2500));
    
    // Use demo data with the user's question
    setSimulation({
      ...DEMO_SIMULATION,
      question: question,
    });
    setSelectedUniverse(DEMO_SIMULATION.universes[0] || null);
    setIsSimulating(false);
  };

  const loadDemoScenario = () => {
    setQuestion('Should we acquire CompetitorCo for $50M to accelerate market expansion?');
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'positive': return 'text-emerald-400 bg-emerald-500/20 border-emerald-500/40';
      case 'negative': return 'text-red-400 bg-red-500/20 border-red-500/40';
      case 'critical': return 'text-orange-400 bg-orange-500/20 border-orange-500/40';
      default: return 'text-neutral-400 bg-neutral-500/20 border-neutral-500/40';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'milestone': return '🎯';
      case 'risk': return '⚠️';
      case 'opportunity': return '💎';
      case 'pivot': return '🔄';
      case 'cascade': return '🦋';
      case 'external': return '🌍';
      default: return '📍';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-emerald-400';
      case 'moderate': return 'text-yellow-400';
      case 'high': return 'text-orange-400';
      case 'critical': return 'text-red-400';
      default: return 'text-neutral-400';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-950 via-indigo-950/30 to-neutral-950">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }} />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-gradient-to-r from-indigo-500/20 to-purple-500/20 border border-indigo-500/30 rounded-full mb-6">
            <span className="text-2xl">🔮</span>
            <span className="text-indigo-300 font-medium">CendiaOracle™</span>
            <span className="px-2 py-0.5 bg-indigo-500/30 text-indigo-200 text-xs rounded-full">BETA</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white via-indigo-200 to-purple-200 bg-clip-text text-transparent mb-4">
            Predictive Decision Intelligence
          </h1>
          <p className="text-xl text-neutral-400 max-w-2xl mx-auto">
            See the future before you commit. Explore alternate timelines and make decisions with confidence.
          </p>
        </motion.div>

        {/* Query Input */}
        {!simulation && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl" />
              <div className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6">
                <label className="block text-sm font-medium text-neutral-300 mb-3">
                  What strategic decision are you considering?
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="e.g., Should we acquire CompetitorCo for $50M to accelerate market expansion?"
                  rows={3}
                  className="w-full px-4 py-3 bg-neutral-800/50 border border-neutral-600/50 rounded-xl text-white placeholder:text-neutral-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none"
                />
                
                <div className="flex items-center justify-between mt-4">
                  <div className="flex items-center gap-4">
                    <label className="text-sm text-neutral-400">Time Horizon:</label>
                    <div className="flex gap-2">
                      {(['90d', '180d', '1y'] as const).map((h) => (
                        <button
                          key={h}
                          onClick={() => setTimeHorizon(h)}
                          className={cn(
                            'px-3 py-1.5 rounded-lg text-sm transition-all',
                            timeHorizon === h
                              ? 'bg-indigo-500 text-white'
                              : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                          )}
                        >
                          {h === '90d' ? '90 Days' : h === '180d' ? '6 Months' : '1 Year'}
                        </button>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <button
                      onClick={loadDemoScenario}
                      className="px-4 py-2 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Load Demo
                    </button>
                    <button
                      onClick={runSimulation}
                      disabled={!question.trim() || isSimulating}
                      className={cn(
                        'px-6 py-2.5 rounded-xl font-medium transition-all flex items-center gap-2',
                        question.trim() && !isSimulating
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white hover:from-indigo-600 hover:to-purple-600 shadow-lg shadow-indigo-500/25'
                          : 'bg-neutral-700 text-neutral-400 cursor-not-allowed'
                      )}
                    >
                      {isSimulating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Simulating Futures...
                        </>
                      ) : (
                        <>
                          <span>🔮</span>
                          Simulate Futures
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Simulation Loading */}
        <AnimatePresence>
          {isSimulating && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-neutral-950/90 backdrop-blur-sm"
            >
              <div className="text-center">
                <div className="relative w-32 h-32 mx-auto mb-8">
                  <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full animate-ping" />
                  <div className="absolute inset-2 border-4 border-purple-500/30 rounded-full animate-ping" style={{ animationDelay: '0.2s' }} />
                  <div className="absolute inset-4 border-4 border-pink-500/30 rounded-full animate-ping" style={{ animationDelay: '0.4s' }} />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-5xl animate-pulse">🔮</span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Simulating Alternate Futures</h3>
                <p className="text-neutral-400">Analyzing decision branches and cascading effects...</p>
                <div className="mt-6 flex justify-center gap-2">
                  {['Consulting Agents', 'Mapping Timelines', 'Finding Echoes'].map((step, i) => (
                    <motion.div
                      key={step}
                      initial={{ opacity: 0.3 }}
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
                      className="px-3 py-1 bg-neutral-800 rounded-full text-sm text-neutral-300"
                    >
                      {step}
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Simulation Results */}
        {simulation && !isSimulating && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-8"
          >
            {/* Question Banner */}
            <div className="bg-gradient-to-r from-indigo-900/50 to-purple-900/50 border border-indigo-500/30 rounded-2xl p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-indigo-300 mb-2">Strategic Question</div>
                  <h2 className="text-xl font-semibold text-white">{simulation.question}</h2>
                </div>
                <button
                  onClick={() => { setSimulation(null); setSelectedUniverse(null); }}
                  className="px-4 py-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-sm transition-colors"
                >
                  New Simulation
                </button>
              </div>
            </div>

            {/* View Mode Tabs */}
            <div className="flex items-center gap-2 bg-neutral-900/50 p-1 rounded-xl w-fit">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'timeline', label: 'Timeline', icon: '📅' },
                { id: 'comparison', label: 'Compare', icon: '⚖️' },
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setViewMode(tab.id as typeof viewMode)}
                  className={cn(
                    'px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                    viewMode === tab.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-neutral-400 hover:text-white hover:bg-neutral-800'
                  )}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Universe Cards */}
            {viewMode === 'overview' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {simulation.universes.map((universe, index) => (
                  <motion.div
                    key={universe.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setSelectedUniverse(universe)}
                    className={cn(
                      'relative cursor-pointer group',
                      selectedUniverse?.id === universe.id && 'ring-2 ring-offset-2 ring-offset-neutral-950',
                    )}
                    style={{ 
                      ['--ring-color' as string]: universe.color,
                    }}
                  >
                    {/* Recommended Badge */}
                    {simulation.recommendation.universeId === universe.id && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
                        <div className="px-3 py-1 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold rounded-full shadow-lg">
                          ⭐ RECOMMENDED
                        </div>
                      </div>
                    )}
                    
                    <div 
                      className="relative bg-neutral-900/80 backdrop-blur-xl border border-neutral-700/50 rounded-2xl p-6 transition-all group-hover:border-neutral-600"
                      style={{ borderColor: selectedUniverse?.id === universe.id ? universe.color : undefined }}
                    >
                      {/* Header */}
                      <div className="flex items-center gap-3 mb-4">
                        <div 
                          className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                          style={{ backgroundColor: `${universe.color}20` }}
                        >
                          {universe.icon}
                        </div>
                        <div>
                          <h3 className="font-semibold text-white">{universe.name}</h3>
                          <div className="text-sm text-neutral-400">{universe.probability}% likely chosen</div>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-neutral-400 mb-4">{universe.description}</p>

                      {/* Key Metrics */}
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">Revenue Impact</span>
                          <span className={cn(
                            'text-sm font-medium',
                            universe.outcomes.revenue.change > 0 ? 'text-emerald-400' : 'text-red-400'
                          )}>
                            {universe.outcomes.revenue.change > 0 ? '+' : ''}{universe.outcomes.revenue.change}%
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">Risk Level</span>
                          <span className={getRiskColor(universe.riskProfile.overall)}>
                            {universe.riskProfile.overall.charAt(0).toUpperCase() + universe.riskProfile.overall.slice(1)}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-500">Reversibility</span>
                          <span className="text-sm text-neutral-300">{universe.reversibilityScore}%</span>
                        </div>
                      </div>

                      {/* Overall Score */}
                      <div className="pt-4 border-t border-neutral-700/50">
                        <div className="flex items-center justify-between">
                          <span className="text-sm text-neutral-400">Overall Score</span>
                          <div className="flex items-center gap-2">
                            <div className="w-24 h-2 bg-neutral-800 rounded-full overflow-hidden">
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${universe.outcomes.overallScore}%` }}
                                transition={{ duration: 1, delay: 0.5 }}
                                className="h-full rounded-full"
                                style={{ backgroundColor: universe.color }}
                              />
                            </div>
                            <span className="text-sm font-bold text-white">{universe.outcomes.overallScore}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}

            {/* Timeline View */}
            {viewMode === 'timeline' && selectedUniverse && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-10 h-10 rounded-xl flex items-center justify-center text-xl"
                      style={{ backgroundColor: `${selectedUniverse.color}20` }}
                    >
                      {selectedUniverse.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-white">{selectedUniverse.name} Timeline</h3>
                      <p className="text-sm text-neutral-400">{selectedUniverse.timeline.length} events over {timeHorizon}</p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    {simulation.universes.map((u) => (
                      <button
                        key={u.id}
                        onClick={() => setSelectedUniverse(u)}
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center text-sm transition-all',
                          selectedUniverse.id === u.id
                            ? 'ring-2 ring-offset-2 ring-offset-neutral-900'
                            : 'opacity-50 hover:opacity-100'
                        )}
                        style={{ 
                          backgroundColor: `${u.color}20`,
                          ['--tw-ring-color' as string]: u.color,
                        }}
                      >
                        {u.icon}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Timeline */}
                <div ref={timelineRef} className="relative">
                  {/* Timeline Line */}
                  <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gradient-to-b from-indigo-500 via-purple-500 to-pink-500" />
                  
                  {/* Events */}
                  <div className="space-y-6">
                    {selectedUniverse.timeline.map((event, index) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={() => setSelectedEvent(selectedEvent?.id === event.id ? null : event)}
                        className="relative pl-16 cursor-pointer group"
                      >
                        {/* Event Node */}
                        <div 
                          className={cn(
                            'absolute left-3 w-6 h-6 rounded-full flex items-center justify-center text-sm border-2 transition-all',
                            selectedEvent?.id === event.id ? 'scale-125' : 'group-hover:scale-110',
                            getImpactColor(event.impact)
                          )}
                        >
                          {getTypeIcon(event.type)}
                        </div>

                        {/* Event Card */}
                        <div className={cn(
                          'bg-neutral-800/50 border rounded-xl p-4 transition-all',
                          selectedEvent?.id === event.id 
                            ? 'border-indigo-500/50 bg-neutral-800' 
                            : 'border-neutral-700/50 group-hover:border-neutral-600'
                        )}>
                          <div className="flex items-start justify-between mb-2">
                            <div>
                              <h4 className="font-medium text-white">{event.title}</h4>
                              <p className="text-sm text-neutral-400">{event.description}</p>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-medium text-neutral-300">Day {event.dayOffset}</div>
                              <div className="text-xs text-neutral-500">{event.confidence}% confidence</div>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          <AnimatePresence>
                            {selectedEvent?.id === event.id && event.agentInsights && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="pt-4 mt-4 border-t border-neutral-700/50">
                                  <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Agent Insights</div>
                                  <div className="space-y-2">
                                    {event.agentInsights.map((insight, i) => (
                                      <div key={i} className="flex items-start gap-2">
                                        <span className="text-lg">{insight.agentAvatar}</span>
                                        <div>
                                          <div className="text-sm text-neutral-300">{insight.agentName}</div>
                                          <div className="text-xs text-neutral-500">{insight.perspective}</div>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Comparison View */}
            {viewMode === 'comparison' && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6">
                <h3 className="text-lg font-semibold text-white mb-6">Outcome Comparison</h3>
                
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-neutral-700/50">
                        <th className="text-left py-3 px-4 text-sm font-medium text-neutral-400">Metric</th>
                        {simulation.universes.map((u) => (
                          <th key={u.id} className="text-center py-3 px-4">
                            <div className="flex items-center justify-center gap-2">
                              <span>{u.icon}</span>
                              <span className="text-sm font-medium text-white">{u.name}</span>
                            </div>
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { key: 'revenue', label: 'Revenue' },
                        { key: 'marketShare', label: 'Market Share' },
                        { key: 'teamMorale', label: 'Team Morale' },
                        { key: 'competitivePosition', label: 'Competitive Position' },
                        { key: 'riskExposure', label: 'Risk Exposure' },
                        { key: 'innovationCapacity', label: 'Innovation' },
                      ].map((metric) => (
                        <tr key={metric.key} className="border-b border-neutral-800/50">
                          <td className="py-3 px-4 text-sm text-neutral-300">{metric.label}</td>
                          {simulation.universes.map((u) => {
                            const value = u.outcomes[metric.key as keyof UniverseOutcome] as OutcomeMetric;
                            return (
                              <td key={u.id} className="text-center py-3 px-4">
                                <span className={cn(
                                  'text-sm font-medium',
                                  value.change > 0 ? 'text-emerald-400' : value.change < 0 ? 'text-red-400' : 'text-neutral-400'
                                )}>
                                  {value.change > 0 ? '+' : ''}{value.change}%
                                </span>
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      <tr className="bg-neutral-800/30">
                        <td className="py-3 px-4 text-sm font-medium text-white">Overall Score</td>
                        {simulation.universes.map((u) => (
                          <td key={u.id} className="text-center py-3 px-4">
                            <span className="text-lg font-bold text-white">{u.outcomes.overallScore}</span>
                          </td>
                        ))}
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Historical Echoes */}
            {simulation.historicalEchoes.length > 0 && (
              <div className="bg-neutral-900/50 border border-neutral-700/50 rounded-2xl p-6">
                <div className="flex items-center gap-3 mb-6">
                  <span className="text-2xl">📜</span>
                  <div>
                    <h3 className="text-lg font-semibold text-white">Historical Echoes</h3>
                    <p className="text-sm text-neutral-400">Similar decisions from the past</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {simulation.historicalEchoes.map((echo) => (
                    <div key={echo.id} className="bg-neutral-800/50 border border-neutral-700/50 rounded-xl p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h4 className="font-medium text-white">{echo.company} ({echo.year})</h4>
                          <div className="text-sm text-neutral-400">{echo.situation}</div>
                        </div>
                        <div className="px-2 py-1 bg-indigo-500/20 text-indigo-300 text-xs rounded-full">
                          {echo.similarity}% similar
                        </div>
                      </div>
                      <div className="text-sm text-neutral-300 mb-3">
                        <span className="text-neutral-500">Decision:</span> {echo.decision}
                      </div>
                      <div className="text-sm text-neutral-300 mb-3">
                        <span className="text-neutral-500">Outcome:</span> {echo.outcome}
                      </div>
                      <div className="pt-3 border-t border-neutral-700/50">
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Lessons Learned</div>
                        <ul className="space-y-1">
                          {echo.lessonsLearned.map((lesson, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                              <span className="text-amber-400">•</span>
                              {lesson}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendation */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 border border-amber-500/30 rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl flex items-center justify-center text-2xl shadow-lg shadow-amber-500/25">
                  ⭐
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-white">Oracle Recommendation</h3>
                    <span className="px-2 py-1 bg-amber-500/20 text-amber-300 text-sm rounded-full">
                      {simulation.recommendation.confidence}% confidence
                    </span>
                  </div>
                  <p className="text-lg text-amber-100 mb-4">
                    Pursue the <strong>{simulation.recommendation.primaryChoice}</strong> approach
                  </p>
                  <p className="text-neutral-300 mb-4">{simulation.recommendation.reasoning}</p>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Key Factors</div>
                      <ul className="space-y-1">
                        {simulation.recommendation.keyFactors.map((factor, i) => (
                          <li key={i} className="text-sm text-neutral-300 flex items-center gap-2">
                            <span className="text-emerald-400">✓</span>
                            {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                    {simulation.recommendation.warnings.length > 0 && (
                      <div>
                        <div className="text-xs text-neutral-500 uppercase tracking-wider mb-2">Warnings</div>
                        <ul className="space-y-1">
                          {simulation.recommendation.warnings.map((warning, i) => (
                            <li key={i} className="text-sm text-neutral-300 flex items-center gap-2">
                              <span className="text-amber-400">⚠</span>
                              {warning}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default OraclePage;
