// @ts-nocheck
// =============================================================================
// CENDIA ECHO™ - Decision Outcome Engine
// "Every decision echoes through time. We measure the echo."
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
import { useState, useEffect, useCallback } from 'react';
import { Activity, TrendingUp, TrendingDown, DollarSign, Target, Award, ChevronRight, Calendar, Users, Brain, FileText, RefreshCw, ArrowUpRight, ArrowDownRight, BarChart3, Zap, Check, X } from 'lucide-react';
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
  trend: Array<{
    date: string;
    accuracy: number;
  }>;
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
  accuracyTrend: Array<{
    date: string;
    accuracy: number;
  }>;
  recommendations: string[];
}
const EchoPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [leaderboard, setLeaderboard] = useState<DecisionOutcome[]>(stryMutAct_9fa48("23375") ? ["Stryker was here"] : (stryCov_9fa48("23375"), []));
  const [accuracy, setAccuracy] = useState<AccuracyReport | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("23376") ? false : (stryCov_9fa48("23376"), true));
  const [period, setPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('quarter');
  const [selectedDecision, setSelectedDecision] = useState<string | null>(null);
  const fetchData = useCallback(async () => {
    setLoading(stryMutAct_9fa48("23379") ? false : (stryCov_9fa48("23379"), true));
    try {
      const [dashboardRes, leaderboardRes, accuracyRes] = await Promise.all(stryMutAct_9fa48("23381") ? [] : (stryCov_9fa48("23381"), [echoApi.getDashboard(), echoApi.getLeaderboard(stryMutAct_9fa48("23382") ? {} : (stryCov_9fa48("23382"), {
        period,
        limit: 20
      })), echoApi.getAccuracyReport()]));
      if (stryMutAct_9fa48("23384") ? false : stryMutAct_9fa48("23383") ? true : (stryCov_9fa48("23383", "23384"), dashboardRes.success)) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (stryMutAct_9fa48("23387") ? false : stryMutAct_9fa48("23386") ? true : (stryCov_9fa48("23386", "23387"), leaderboardRes.success)) {
        setLeaderboard(leaderboardRes.data as DecisionOutcome[]);
      }
      if (stryMutAct_9fa48("23390") ? false : stryMutAct_9fa48("23389") ? true : (stryCov_9fa48("23389", "23390"), accuracyRes.success)) {
        setAccuracy(accuracyRes.data as AccuracyReport);
      }
    } catch (error) {
      console.error('Failed to fetch Echo data:', error);
    } finally {
      setLoading(stryMutAct_9fa48("23395") ? true : (stryCov_9fa48("23395"), false));
    }
  }, stryMutAct_9fa48("23396") ? [] : (stryCov_9fa48("23396"), [period]));
  useEffect(() => {
    fetchData();
  }, stryMutAct_9fa48("23398") ? [] : (stryCov_9fa48("23398"), [fetchData]));
  const formatCurrency = (value: number) => {
    const absValue = Math.abs(value);
    if (stryMutAct_9fa48("23403") ? absValue < 1000000 : stryMutAct_9fa48("23402") ? absValue > 1000000 : stryMutAct_9fa48("23401") ? false : stryMutAct_9fa48("23400") ? true : (stryCov_9fa48("23400", "23401", "23402", "23403"), absValue >= 1000000)) {
      return `$${(stryMutAct_9fa48("23406") ? value * 1000000 : (stryCov_9fa48("23406"), value / 1000000)).toFixed(1)}M`;
    }
    if (stryMutAct_9fa48("23410") ? absValue < 1000 : stryMutAct_9fa48("23409") ? absValue > 1000 : stryMutAct_9fa48("23408") ? false : stryMutAct_9fa48("23407") ? true : (stryCov_9fa48("23407", "23408", "23409", "23410"), absValue >= 1000)) {
      return `$${(stryMutAct_9fa48("23413") ? value * 1000 : (stryCov_9fa48("23413"), value / 1000)).toFixed(0)}K`;
    }
    return `$${value.toFixed(0)}`;
  };
  const formatPercent = stryMutAct_9fa48("23415") ? () => undefined : (stryCov_9fa48("23415"), (() => {
    const formatPercent = (value: number) => `${value.toFixed(1)}%`;
    return formatPercent;
  })());
  if (stryMutAct_9fa48("23418") ? false : stryMutAct_9fa48("23417") ? true : (stryCov_9fa48("23417", "23418"), loading)) {
    return <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <Activity className="w-12 h-12 text-emerald-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Decision Outcomes...</p>
        </div>
      </div>;
  }
  return <div className="min-h-screen bg-neutral-950 text-white p-6">
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
          <p className="text-3xl font-bold">{stryMutAct_9fa48("23422") ? dashboard?.summary.totalDecisionsTracked && 0 : stryMutAct_9fa48("23421") ? false : stryMutAct_9fa48("23420") ? true : (stryCov_9fa48("23420", "23421", "23422"), (stryMutAct_9fa48("23423") ? dashboard.summary.totalDecisionsTracked : (stryCov_9fa48("23423"), dashboard?.summary.totalDecisionsTracked)) || 0)}</p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Prediction Accuracy</span>
            <Target className="w-5 h-5 text-emerald-500" />
          </div>
          <p className="text-3xl font-bold text-emerald-400">
            {formatPercent(stryMutAct_9fa48("23426") ? dashboard?.summary.overallAccuracy && 0 : stryMutAct_9fa48("23425") ? false : stryMutAct_9fa48("23424") ? true : (stryCov_9fa48("23424", "23425", "23426"), (stryMutAct_9fa48("23427") ? dashboard.summary.overallAccuracy : (stryCov_9fa48("23427"), dashboard?.summary.overallAccuracy)) || 0))}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Positive Impact</span>
            <TrendingUp className="w-5 h-5 text-green-500" />
          </div>
          <p className="text-3xl font-bold text-green-400">
            {formatCurrency(stryMutAct_9fa48("23430") ? dashboard?.summary.totalPositiveImpact && 0 : stryMutAct_9fa48("23429") ? false : stryMutAct_9fa48("23428") ? true : (stryCov_9fa48("23428", "23429", "23430"), (stryMutAct_9fa48("23431") ? dashboard.summary.totalPositiveImpact : (stryCov_9fa48("23431"), dashboard?.summary.totalPositiveImpact)) || 0))}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Negative Impact</span>
            <TrendingDown className="w-5 h-5 text-red-500" />
          </div>
          <p className="text-3xl font-bold text-red-400">
            {formatCurrency(stryMutAct_9fa48("23434") ? dashboard?.summary.totalNegativeImpact && 0 : stryMutAct_9fa48("23433") ? false : stryMutAct_9fa48("23432") ? true : (stryCov_9fa48("23432", "23433", "23434"), (stryMutAct_9fa48("23435") ? dashboard.summary.totalNegativeImpact : (stryCov_9fa48("23435"), dashboard?.summary.totalNegativeImpact)) || 0))}
          </p>
        </div>

        <div className="bg-neutral-900 rounded-xl p-5 border border-neutral-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-neutral-400 text-sm">Net Impact</span>
            <DollarSign className="w-5 h-5 text-amber-500" />
          </div>
          <p className={`text-3xl font-bold ${(stryMutAct_9fa48("23440") ? (dashboard?.summary.netImpact || 0) < 0 : stryMutAct_9fa48("23439") ? (dashboard?.summary.netImpact || 0) > 0 : stryMutAct_9fa48("23438") ? false : stryMutAct_9fa48("23437") ? true : (stryCov_9fa48("23437", "23438", "23439", "23440"), (stryMutAct_9fa48("23443") ? dashboard?.summary.netImpact && 0 : stryMutAct_9fa48("23442") ? false : stryMutAct_9fa48("23441") ? true : (stryCov_9fa48("23441", "23442", "23443"), (stryMutAct_9fa48("23444") ? dashboard.summary.netImpact : (stryCov_9fa48("23444"), dashboard?.summary.netImpact)) || 0)) >= 0)) ? 'text-green-400' : 'text-red-400'}`}>
            {formatCurrency(stryMutAct_9fa48("23449") ? dashboard?.summary.netImpact && 0 : stryMutAct_9fa48("23448") ? false : stryMutAct_9fa48("23447") ? true : (stryCov_9fa48("23447", "23448", "23449"), (stryMutAct_9fa48("23450") ? dashboard.summary.netImpact : (stryCov_9fa48("23450"), dashboard?.summary.netImpact)) || 0))}
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
                {(['week', 'month', 'quarter', 'year'] as const).map(stryMutAct_9fa48("23451") ? () => undefined : (stryCov_9fa48("23451"), p => <button key={p} onClick={stryMutAct_9fa48("23452") ? () => undefined : (stryCov_9fa48("23452"), () => setPeriod(p))} className={`px-3 py-1 text-sm rounded-lg transition ${(stryMutAct_9fa48("23456") ? period !== p : stryMutAct_9fa48("23455") ? false : stryMutAct_9fa48("23454") ? true : (stryCov_9fa48("23454", "23455", "23456"), period === p)) ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>
                    {stryMutAct_9fa48("23459") ? p.charAt(0).toUpperCase() - p.slice(1) : (stryCov_9fa48("23459"), (stryMutAct_9fa48("23461") ? p.toUpperCase() : stryMutAct_9fa48("23460") ? p.charAt(0).toLowerCase() : (stryCov_9fa48("23460", "23461"), p.charAt(0).toUpperCase())) + (stryMutAct_9fa48("23462") ? p : (stryCov_9fa48("23462"), p.slice(1))))}
                  </button>))}
                <button onClick={fetchData} className="p-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 transition">
                  <RefreshCw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="divide-y divide-neutral-800 max-h-[500px] overflow-y-auto">
            {leaderboard.map(stryMutAct_9fa48("23463") ? () => undefined : (stryCov_9fa48("23463"), (decision, idx) => <div key={decision.id} onClick={stryMutAct_9fa48("23464") ? () => undefined : (stryCov_9fa48("23464"), () => setSelectedDecision(decision.id))} className="p-4 hover:bg-neutral-800/50 cursor-pointer transition">
                <div className="flex items-center gap-4">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${(stryMutAct_9fa48("23469") ? idx >= 3 : stryMutAct_9fa48("23468") ? idx <= 3 : stryMutAct_9fa48("23467") ? false : stryMutAct_9fa48("23466") ? true : (stryCov_9fa48("23466", "23467", "23468", "23469"), idx < 3)) ? 'bg-amber-500/20 text-amber-400' : 'bg-neutral-800 text-neutral-400'}`}>
                    {stryMutAct_9fa48("23472") ? idx - 1 : (stryCov_9fa48("23472"), idx + 1)}
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
                    <p className={`text-lg font-bold ${(stryMutAct_9fa48("23477") ? decision.dollarImpact <= 0 : stryMutAct_9fa48("23476") ? decision.dollarImpact >= 0 : stryMutAct_9fa48("23475") ? false : stryMutAct_9fa48("23474") ? true : (stryCov_9fa48("23474", "23475", "23476", "23477"), decision.dollarImpact > 0)) ? 'text-green-400' : (stryMutAct_9fa48("23482") ? decision.dollarImpact >= 0 : stryMutAct_9fa48("23481") ? decision.dollarImpact <= 0 : stryMutAct_9fa48("23480") ? false : stryMutAct_9fa48("23479") ? true : (stryCov_9fa48("23479", "23480", "23481", "23482"), decision.dollarImpact < 0)) ? 'text-red-400' : 'text-neutral-400'}`}>
                      {(stryMutAct_9fa48("23488") ? decision.dollarImpact <= 0 : stryMutAct_9fa48("23487") ? decision.dollarImpact >= 0 : stryMutAct_9fa48("23486") ? false : stryMutAct_9fa48("23485") ? true : (stryCov_9fa48("23485", "23486", "23487", "23488"), decision.dollarImpact > 0)) ? '+' : ''}{formatCurrency(decision.dollarImpact)}
                    </p>
                    <p className="text-sm text-neutral-500">
                      ROI: {formatPercent(stryMutAct_9fa48("23491") ? decision.roi / 100 : (stryCov_9fa48("23491"), decision.roi * 100))}
                    </p>
                  </div>
                  
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${(stryMutAct_9fa48("23495") ? decision.status !== 'positive' : stryMutAct_9fa48("23494") ? false : stryMutAct_9fa48("23493") ? true : (stryCov_9fa48("23493", "23494", "23495"), decision.status === 'positive')) ? 'bg-green-500/20' : (stryMutAct_9fa48("23500") ? decision.status !== 'negative' : stryMutAct_9fa48("23499") ? false : stryMutAct_9fa48("23498") ? true : (stryCov_9fa48("23498", "23499", "23500"), decision.status === 'negative')) ? 'bg-red-500/20' : 'bg-neutral-800'}`}>
                    {(stryMutAct_9fa48("23506") ? decision.status !== 'positive' : stryMutAct_9fa48("23505") ? false : stryMutAct_9fa48("23504") ? true : (stryCov_9fa48("23504", "23505", "23506"), decision.status === 'positive')) ? <ArrowUpRight className="w-4 h-4 text-green-400" /> : (stryMutAct_9fa48("23510") ? decision.status !== 'negative' : stryMutAct_9fa48("23509") ? false : stryMutAct_9fa48("23508") ? true : (stryCov_9fa48("23508", "23509", "23510"), decision.status === 'negative')) ? <ArrowDownRight className="w-4 h-4 text-red-400" /> : <ChevronRight className="w-4 h-4 text-neutral-400" />}
                  </div>
                </div>
              </div>))}
            
            {stryMutAct_9fa48("23514") ? leaderboard.length === 0 || <div className="p-8 text-center text-neutral-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No decision outcomes tracked yet</p>
                <p className="text-sm mt-1">Link decisions to their outcomes to see the ROI leaderboard</p>
              </div> : stryMutAct_9fa48("23513") ? false : stryMutAct_9fa48("23512") ? true : (stryCov_9fa48("23512", "23513", "23514"), (stryMutAct_9fa48("23516") ? leaderboard.length !== 0 : stryMutAct_9fa48("23515") ? true : (stryCov_9fa48("23515", "23516"), leaderboard.length === 0)) && <div className="p-8 text-center text-neutral-500">
                <Activity className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No decision outcomes tracked yet</p>
                <p className="text-sm mt-1">Link decisions to their outcomes to see the ROI leaderboard</p>
              </div>)}
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
              {stryMutAct_9fa48("23517") ? Object.entries(accuracy?.byAgent || {}).map(([agent, acc]) => <div key={agent}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">{agent}</span>
                    <span className={acc >= 80 ? 'text-green-400' : acc >= 60 ? 'text-amber-400' : 'text-red-400'}>
                      {formatPercent(acc)}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${acc >= 80 ? 'bg-green-500' : acc >= 60 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                  width: `${acc}%`
                }} />
                  </div>
                </div>) : (stryCov_9fa48("23517"), Object.entries(stryMutAct_9fa48("23520") ? accuracy?.byAgent && {} : stryMutAct_9fa48("23519") ? false : stryMutAct_9fa48("23518") ? true : (stryCov_9fa48("23518", "23519", "23520"), (stryMutAct_9fa48("23521") ? accuracy.byAgent : (stryCov_9fa48("23521"), accuracy?.byAgent)) || {})).slice(0, 6).map(stryMutAct_9fa48("23522") ? () => undefined : (stryCov_9fa48("23522"), ([agent, acc]) => <div key={agent}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-neutral-400">{agent}</span>
                    <span className={(stryMutAct_9fa48("23526") ? acc < 80 : stryMutAct_9fa48("23525") ? acc > 80 : stryMutAct_9fa48("23524") ? false : stryMutAct_9fa48("23523") ? true : (stryCov_9fa48("23523", "23524", "23525", "23526"), acc >= 80)) ? 'text-green-400' : (stryMutAct_9fa48("23531") ? acc < 60 : stryMutAct_9fa48("23530") ? acc > 60 : stryMutAct_9fa48("23529") ? false : stryMutAct_9fa48("23528") ? true : (stryCov_9fa48("23528", "23529", "23530", "23531"), acc >= 60)) ? 'text-amber-400' : 'text-red-400'}>
                      {formatPercent(acc)}
                    </span>
                  </div>
                  <div className="h-2 bg-neutral-800 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${(stryMutAct_9fa48("23538") ? acc < 80 : stryMutAct_9fa48("23537") ? acc > 80 : stryMutAct_9fa48("23536") ? false : stryMutAct_9fa48("23535") ? true : (stryCov_9fa48("23535", "23536", "23537", "23538"), acc >= 80)) ? 'bg-green-500' : (stryMutAct_9fa48("23543") ? acc < 60 : stryMutAct_9fa48("23542") ? acc > 60 : stryMutAct_9fa48("23541") ? false : stryMutAct_9fa48("23540") ? true : (stryCov_9fa48("23540", "23541", "23542", "23543"), acc >= 60)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("23546") ? {} : (stryCov_9fa48("23546"), {
                  width: `${acc}%`
                })} />
                  </div>
                </div>)))}
              
              {stryMutAct_9fa48("23550") ? Object.keys(accuracy?.byAgent || {}).length === 0 || <p className="text-neutral-500 text-sm text-center py-4">
                  No agent accuracy data available yet
                </p> : stryMutAct_9fa48("23549") ? false : stryMutAct_9fa48("23548") ? true : (stryCov_9fa48("23548", "23549", "23550"), (stryMutAct_9fa48("23552") ? Object.keys(accuracy?.byAgent || {}).length !== 0 : stryMutAct_9fa48("23551") ? true : (stryCov_9fa48("23551", "23552"), Object.keys(stryMutAct_9fa48("23555") ? accuracy?.byAgent && {} : stryMutAct_9fa48("23554") ? false : stryMutAct_9fa48("23553") ? true : (stryCov_9fa48("23553", "23554", "23555"), (stryMutAct_9fa48("23556") ? accuracy.byAgent : (stryCov_9fa48("23556"), accuracy?.byAgent)) || {})).length === 0)) && <p className="text-neutral-500 text-sm text-center py-4">
                  No agent accuracy data available yet
                </p>)}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-5">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="w-5 h-5 text-amber-500" />
              <h2 className="text-lg font-semibold">Recommendations</h2>
            </div>
            
            <div className="space-y-3">
              {(stryMutAct_9fa48("23559") ? (accuracy?.recommendations || dashboard?.recommendations) && [] : stryMutAct_9fa48("23558") ? false : stryMutAct_9fa48("23557") ? true : (stryCov_9fa48("23557", "23558", "23559"), (stryMutAct_9fa48("23561") ? accuracy?.recommendations && dashboard?.recommendations : stryMutAct_9fa48("23560") ? false : (stryCov_9fa48("23560", "23561"), (stryMutAct_9fa48("23562") ? accuracy.recommendations : (stryCov_9fa48("23562"), accuracy?.recommendations)) || (stryMutAct_9fa48("23563") ? dashboard.recommendations : (stryCov_9fa48("23563"), dashboard?.recommendations)))) || (stryMutAct_9fa48("23564") ? ["Stryker was here"] : (stryCov_9fa48("23564"), [])))).map(stryMutAct_9fa48("23565") ? () => undefined : (stryCov_9fa48("23565"), (rec, idx) => <div key={idx} className="flex gap-3 p-3 bg-neutral-800/50 rounded-lg">
                  <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-amber-400">{stryMutAct_9fa48("23566") ? idx - 1 : (stryCov_9fa48("23566"), idx + 1)}</span>
                  </div>
                  <p className="text-sm text-neutral-300">{rec}</p>
                </div>))}
              
              {stryMutAct_9fa48("23569") ? (accuracy?.recommendations || []).length === 0 || <p className="text-neutral-500 text-sm text-center py-4">
                  All metrics are within acceptable ranges
                </p> : stryMutAct_9fa48("23568") ? false : stryMutAct_9fa48("23567") ? true : (stryCov_9fa48("23567", "23568", "23569"), (stryMutAct_9fa48("23571") ? (accuracy?.recommendations || []).length !== 0 : stryMutAct_9fa48("23570") ? true : (stryCov_9fa48("23570", "23571"), (stryMutAct_9fa48("23574") ? accuracy?.recommendations && [] : stryMutAct_9fa48("23573") ? false : stryMutAct_9fa48("23572") ? true : (stryCov_9fa48("23572", "23573", "23574"), (stryMutAct_9fa48("23575") ? accuracy.recommendations : (stryCov_9fa48("23575"), accuracy?.recommendations)) || (stryMutAct_9fa48("23576") ? ["Stryker was here"] : (stryCov_9fa48("23576"), [])))).length === 0)) && <p className="text-neutral-500 text-sm text-center py-4">
                  All metrics are within acceptable ranges
                </p>)}
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
    </div>;
};
export default EchoPage;