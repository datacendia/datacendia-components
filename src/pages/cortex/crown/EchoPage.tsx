// =============================================================================
// CENDIA ECHO™ - Decision Outcome Engine
// "Every decision echoes through time. We measure the echo."
// =============================================================================

import { useState, useEffect, useCallback } from 'react';
import { 
  Activity, TrendingUp, TrendingDown, DollarSign, Target, Award,
  ChevronRight, Calendar, Users, Brain, FileText, RefreshCw,
  ArrowUpRight, ArrowDownRight, BarChart3, Zap, Check, X
} from 'lucide-react';
import { echoApi } from '../../../lib/api';

interface DecisionOutcome {
  id: string;
  decisionTitle: string;
  decisionDate: string;
  dollarImpact: number;
  roi: number;
  status: 'positive' | 'negative' | 'neutral';
  rank: number;
  councilMode: string;
  leadAgent: string;
}

interface AccuracyReport {
  overallAccuracy: number;
  byCategory: Record<string, number>;
  byAgent: Record<string, number>;
  byMode: Record<string, number>;
  trend: Array<{ date: string; accuracy: number }>;
  recommendations: string[];
}

interface DashboardData {
  summary: {
    totalDecisionsTracked: number;
    overallAccuracy: number;
    totalPositiveImpact: number;
    totalNegativeImpact: number;
    netImpact: number;
  };
  topDecisions: DecisionOutcome[];
  accuracyTrend: Array<{ date: string; accuracy: number }>;
  recommendations: string[];
}

const EchoPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [leaderboard, setLeaderboard] = useState<DecisionOutcome[]>([]);
  const [accuracy, setAccuracy] = useState<AccuracyReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('quarter');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [dashboardRes, leaderboardRes, accuracyRes] = await Promise.all([
        echoApi.getDashboard(),
        echoApi.getLeaderboard({ period, limit: 20 }),
        echoApi.getAccuracyReport(),
      ]);

      if (dashboardRes.success) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (leaderboardRes.success) {
        setLeaderboard(leaderboardRes.data as DecisionOutcome[]);
      }
      if (accuracyRes.success) {
        setAccuracy(accuracyRes.data as AccuracyReport);
      }
    } catch (error) {
      console.error('Failed to fetch Echo data:', error);
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (absValue >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    }
    if (absValue >= 1000) {
      return `$${(value / 1000).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };

  const formatPercent = (value: number) => `${value.toFixed(1)}%`;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Decision Outcomes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">CendiaEcho™</h1>
            <p className="text-neutral-400">Decision Outcome Engine</p>
          </div>
        </div>
        <p className="text-neutral-500 mt-2 max-w-2xl">
          Every decision echoes through time. We measure the echo and make the next decision better.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Decisions Tracked</span>
            <BarChart3 className="w-5 h-5 text-neutral-500" />
          </div>
          <p className="text-3xl font-bold">{dashboard?.summary.totalDecisionsTracked || 0}</p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Prediction Accuracy</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {formatPercent(dashboard?.summary.overallAccuracy || 0)}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Positive Impact</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(dashboard?.summary.totalPositiveImpact || 0)}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Negative Impact</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-400">
            {formatCurrency(dashboard?.summary.totalNegativeImpact || 0)}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Net Impact</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <p className={`text-3xl font-bold ${(dashboard?.summary.netImpact || 0) >= 0 ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(dashboard?.summary.netImpact || 0)}
          </p>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision ROI Leaderboard */}
        <div className="lg:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800">
          <div className="p-5 border-b border-neutral-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Award className="w-5 h-5 text-amber-500" />
                <h2 className="text-lg font-semibold">Decision ROI Leaderboard</h2>
              </div>
              <div className="flex items-center gap-2">
                {(['week', 'month', 'quarter', 'year'] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPeriod(p)}
                    className={`px-3 py-1 text-sm rounded-lg transition ${
                      period === p 
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'
                    }`}
                  >
                    {p.charAt(0).toUpperCase() + p.slice(1)}
                  </button>
                ))}
                <button 
                  onClick={fetchData}
                  className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition"
                >
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-800 max-h-[500px] overflow-y-auto">
            {leaderboard.map((decision, idx) => (
              <div 
                key={decision.id}
                onClick={() => setSelectedDecision(decision.id)}
                className="p-4 hover:bg-neutral-800/50 cursor-pointer transition"
              >
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                    idx < 3 ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'
                  }`}>
                    {idx + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{decision.decisionTitle}</p>
                    <div className="flex items-center gap-3 mt-1 text-sm text-neutral-500">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(decision.decisionDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Brain className="w-3 h-3" />
                        {decision.councilMode}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {decision.leadAgent}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <p className={`text-lg font-bold ${
                      decision.dollarImpact > 0 ? 'text-green-400' : 
                      decision.dollarImpact < 0 ? 'text-red-400' : 'text-neutral-400'
                    }`}>
                      {decision.dollarImpact > 0 ? '+' : ''}{formatCurrency(decision.dollarImpact)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      ROI: {formatPercent(decision.roi * 100)}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    decision.status === 'positive' ? 'bg-green-500/20' :
                    decision.status === 'negative' ? 'bg-red-500/20' : 'bg-neutral-800'
                  }`}>
                    {decision.status === 'positive' ? (
                      <ArrowUpRight className="w-4 h-4 text-green-400" />
                    ) : decision.status === 'negative' ? (
                      <ArrowDownRight className="w-4 h-4 text-red-400" />
                    ) : (
                      <ChevronRight className="w-4 h-4 text-neutral-400" />
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {leaderboard.length === 0 && (
              <div className="p-8 text-center text-neutral-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No decision outcomes tracked yet</p>
                <p className="text-sm mt-1">Link decisions to their outcomes to see the ROI leaderboard</p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Accuracy by Agent */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-5 h-5 text-purple-500" />
              <h2 className="text-lg font-semibold">Agent Accuracy</h2>
            </div>
            
            <div className="space-y-3">
              {Object.entries(accuracy?.byAgent || {}).slice(0, 6).map(([agent, acc]) => (
                <div key={agent}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">{agent}</span>
                    <span className={acc >= 80 ? 'text-green-400' : acc >= 60 ? 'text-amber-400' : 'text-red-400'}>
                      {formatPercent(acc)}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${
                        acc >= 80 ? 'bg-green-500' : acc >= 60 ? 'bg-amber-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${acc}%` }}
                    />
                  </div>
                </div>
              ))}
              
              {Object.keys(accuracy?.byAgent || {}).length === 0 && (
                <p className="text-neutral-500 text-sm text-center py-4">
                  No agent accuracy data available yet
                </p>
              )}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Recommendations</h2>
            </div>
            
            <div className="space-y-3">
              {(accuracy?.recommendations || dashboard?.recommendations || []).map((rec, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-400">{idx + 1}</span>
                  </div>
                  <p className="text-sm text-neutral-300">{rec}</p>
                </div>
              ))}
              
              {(accuracy?.recommendations || []).length === 0 && (
                <p className="text-neutral-500 text-sm text-center py-4">
                  All metrics are within acceptable ranges
                </p>
              )}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-5 h-5 text-blue-500" />
              <h2 className="text-lg font-semibold">Quick Actions</h2>
            </div>
            
            <div className="space-y-2">
              <button className="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition">
                <span className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-green-400" />
                  Link Decision Outcome
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition">
                <span className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-400" />
                  Generate Compliance Report
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
              
              <button className="w-full flex items-center justify-between p-3 bg-neutral-800 rounded-lg hover:bg-neutral-700 transition">
                <span className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400" />
                  Review Failed Predictions
                </span>
                <ChevronRight className="w-4 h-4 text-neutral-500" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EchoPage;
