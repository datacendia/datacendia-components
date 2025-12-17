// @ts-nocheck
// =============================================================================
// CENDIA APOTHEOSIS™ — ORGANIZATIONAL SUPERINTELLIGENCE ENGINE
// "We don't just make your company smarter today. We make it literally 
// impossible for you to stay stupid tomorrow."
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
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { apotheosisService, ApotheosisScore, ApotheosisRun, Escalation, PatternBan, UpskillAssignment } from '../../../services/ApotheosisService';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatCurrency = (amount: number): string => {
  if (stryMutAct_9fa48("26069") ? amount < 1000000 : stryMutAct_9fa48("26068") ? amount > 1000000 : stryMutAct_9fa48("26067") ? false : stryMutAct_9fa48("26066") ? true : (stryCov_9fa48("26066", "26067", "26068", "26069"), amount >= 1000000)) return `$${(stryMutAct_9fa48("26071") ? amount * 1000000 : (stryCov_9fa48("26071"), amount / 1000000)).toFixed(1)}M`;
  if (stryMutAct_9fa48("26075") ? amount < 1000 : stryMutAct_9fa48("26074") ? amount > 1000 : stryMutAct_9fa48("26073") ? false : stryMutAct_9fa48("26072") ? true : (stryCov_9fa48("26072", "26073", "26074", "26075"), amount >= 1000)) return `$${(stryMutAct_9fa48("26077") ? amount * 1000 : (stryCov_9fa48("26077"), amount / 1000)).toFixed(0)}K`;
  return `$${amount.toFixed(0)}`;
};
const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', stryMutAct_9fa48("26081") ? {} : (stryCov_9fa48("26081"), {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }));
};
const formatTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', stryMutAct_9fa48("26087") ? {} : (stryCov_9fa48("26087"), {
    hour: '2-digit',
    minute: '2-digit'
  }));
};
const getTimeRemaining = (deadline: Date | string): string => {
  const now = new Date();
  const target = new Date(deadline);
  const diff = stryMutAct_9fa48("26091") ? target.getTime() + now.getTime() : (stryCov_9fa48("26091"), target.getTime() - now.getTime());
  const hours = Math.floor(stryMutAct_9fa48("26092") ? diff * (1000 * 60 * 60) : (stryCov_9fa48("26092"), diff / (stryMutAct_9fa48("26093") ? 1000 * 60 / 60 : (stryCov_9fa48("26093"), (stryMutAct_9fa48("26094") ? 1000 / 60 : (stryCov_9fa48("26094"), 1000 * 60)) * 60))));
  const days = Math.floor(stryMutAct_9fa48("26095") ? hours * 24 : (stryCov_9fa48("26095"), hours / 24));
  if (stryMutAct_9fa48("26099") ? days <= 0 : stryMutAct_9fa48("26098") ? days >= 0 : stryMutAct_9fa48("26097") ? false : stryMutAct_9fa48("26096") ? true : (stryCov_9fa48("26096", "26097", "26098", "26099"), days > 0)) return `${days} days remaining`;
  if (stryMutAct_9fa48("26104") ? hours <= 0 : stryMutAct_9fa48("26103") ? hours >= 0 : stryMutAct_9fa48("26102") ? false : stryMutAct_9fa48("26101") ? true : (stryCov_9fa48("26101", "26102", "26103", "26104"), hours > 0)) return `${hours} hours remaining`;
  return 'Overdue';
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const ApotheosisPage: React.FC = () => {
  const navigate = useNavigate();
  const [score, setScore] = useState<ApotheosisScore | null>(null);
  const [latestRun, setLatestRun] = useState<ApotheosisRun | null>(null);
  const [escalations, setEscalations] = useState<Escalation[]>(stryMutAct_9fa48("26108") ? ["Stryker was here"] : (stryCov_9fa48("26108"), []));
  const [bannedPatterns, setBannedPatterns] = useState<PatternBan[]>(stryMutAct_9fa48("26109") ? ["Stryker was here"] : (stryCov_9fa48("26109"), []));
  const [upskillAssignments, setUpskillAssignments] = useState<UpskillAssignment[]>(stryMutAct_9fa48("26110") ? ["Stryker was here"] : (stryCov_9fa48("26110"), []));
  const [activeTab, setActiveTab] = useState<'dashboard' | 'escalations' | 'patterns' | 'upskill' | 'history'>('dashboard');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("26112") ? false : (stryCov_9fa48("26112"), true));
  const loadData = useCallback(async () => {
    setIsLoading(stryMutAct_9fa48("26114") ? false : (stryCov_9fa48("26114"), true));
    try {
      const [scoreData, runData, escData, patternData, upskillData] = await Promise.all(stryMutAct_9fa48("26116") ? [] : (stryCov_9fa48("26116"), [apotheosisService.getScore(), apotheosisService.getLatestRun(), apotheosisService.getEscalations(), apotheosisService.getBannedPatterns(), apotheosisService.getUpskillAssignments()]));
      setScore(scoreData);
      setLatestRun(runData);
      setEscalations(escData);
      setBannedPatterns(patternData);
      setUpskillAssignments(upskillData);
    } catch (error) {
      console.error('Error loading Apotheosis data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("26120") ? true : (stryCov_9fa48("26120"), false));
    }
  }, stryMutAct_9fa48("26121") ? ["Stryker was here"] : (stryCov_9fa48("26121"), []));
  useEffect(() => {
    loadData();
  }, stryMutAct_9fa48("26123") ? [] : (stryCov_9fa48("26123"), [loadData]));
  const handleEscalationResponse = async (id: string, response: 'approved' | 'rejected' | 'deferred') => {
    const reason = prompt(`Enter reason for ${response}:`);
    if (stryMutAct_9fa48("26127") ? false : stryMutAct_9fa48("26126") ? true : (stryCov_9fa48("26126", "26127"), reason)) {
      await apotheosisService.respondToEscalation(id, response, reason);
      loadData();
    }
  };
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-purple-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("26129") ? () => undefined : (stryCov_9fa48("26129"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-xl">
                  ⚡
                </div>
                <div>
                  <h1 className="text-xl font-bold">CendiaApotheosis™</h1>
                  <p className="text-sm text-white/60">Organizational Superintelligence Engine</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={stryMutAct_9fa48("26131") ? () => undefined : (stryCov_9fa48("26131"), () => apotheosisService.triggerManualRun())} className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
                Trigger Manual Run
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-purple-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("26132") ? [] : (stryCov_9fa48("26132"), [stryMutAct_9fa48("26133") ? {} : (stryCov_9fa48("26133"), {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊'
          }), stryMutAct_9fa48("26137") ? {} : (stryCov_9fa48("26137"), {
            id: 'escalations',
            label: 'Escalations',
            icon: '⚠️',
            count: escalations.length
          }), stryMutAct_9fa48("26141") ? {} : (stryCov_9fa48("26141"), {
            id: 'patterns',
            label: 'Banned Patterns',
            icon: '🚫',
            count: bannedPatterns.length
          }), stryMutAct_9fa48("26145") ? {} : (stryCov_9fa48("26145"), {
            id: 'upskill',
            label: 'Upskilling',
            icon: '📚',
            count: upskillAssignments.length
          }), stryMutAct_9fa48("26149") ? {} : (stryCov_9fa48("26149"), {
            id: 'history',
            label: 'Run History',
            icon: '📜'
          })])).map(stryMutAct_9fa48("26153") ? () => undefined : (stryCov_9fa48("26153"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("26154") ? () => undefined : (stryCov_9fa48("26154"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("26158") ? activeTab !== tab.id : stryMutAct_9fa48("26157") ? false : stryMutAct_9fa48("26156") ? true : (stryCov_9fa48("26156", "26157", "26158"), activeTab === tab.id)) ? 'border-purple-500 text-white bg-purple-500/10' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                <span>{tab.icon}</span>
                {tab.label}
                {stryMutAct_9fa48("26163") ? tab.count !== undefined && tab.count > 0 || <span className="px-1.5 py-0.5 text-xs bg-purple-500/30 rounded-full">
                    {tab.count}
                  </span> : stryMutAct_9fa48("26162") ? false : stryMutAct_9fa48("26161") ? true : (stryCov_9fa48("26161", "26162", "26163"), (stryMutAct_9fa48("26165") ? tab.count !== undefined || tab.count > 0 : stryMutAct_9fa48("26164") ? true : (stryCov_9fa48("26164", "26165"), (stryMutAct_9fa48("26167") ? tab.count === undefined : stryMutAct_9fa48("26166") ? true : (stryCov_9fa48("26166", "26167"), tab.count !== undefined)) && (stryMutAct_9fa48("26170") ? tab.count <= 0 : stryMutAct_9fa48("26169") ? tab.count >= 0 : stryMutAct_9fa48("26168") ? true : (stryCov_9fa48("26168", "26169", "26170"), tab.count > 0)))) && <span className="px-1.5 py-0.5 text-xs bg-purple-500/30 rounded-full">
                    {tab.count}
                  </span>)}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
          </div> : <>
            {stryMutAct_9fa48("26173") ? activeTab === 'dashboard' && score && latestRun || <DashboardView score={score} latestRun={latestRun} escalations={escalations} upskillAssignments={upskillAssignments} bannedPatterns={bannedPatterns} onEscalationResponse={handleEscalationResponse} /> : stryMutAct_9fa48("26172") ? false : stryMutAct_9fa48("26171") ? true : (stryCov_9fa48("26171", "26172", "26173"), (stryMutAct_9fa48("26175") ? activeTab === 'dashboard' && score || latestRun : stryMutAct_9fa48("26174") ? true : (stryCov_9fa48("26174", "26175"), (stryMutAct_9fa48("26177") ? activeTab === 'dashboard' || score : stryMutAct_9fa48("26176") ? true : (stryCov_9fa48("26176", "26177"), (stryMutAct_9fa48("26179") ? activeTab !== 'dashboard' : stryMutAct_9fa48("26178") ? true : (stryCov_9fa48("26178", "26179"), activeTab === 'dashboard')) && score)) && latestRun)) && <DashboardView score={score} latestRun={latestRun} escalations={escalations} upskillAssignments={upskillAssignments} bannedPatterns={bannedPatterns} onEscalationResponse={handleEscalationResponse} />)}
            
            {stryMutAct_9fa48("26183") ? activeTab === 'escalations' || <EscalationsView escalations={escalations} onResponse={handleEscalationResponse} /> : stryMutAct_9fa48("26182") ? false : stryMutAct_9fa48("26181") ? true : (stryCov_9fa48("26181", "26182", "26183"), (stryMutAct_9fa48("26185") ? activeTab !== 'escalations' : stryMutAct_9fa48("26184") ? true : (stryCov_9fa48("26184", "26185"), activeTab === 'escalations')) && <EscalationsView escalations={escalations} onResponse={handleEscalationResponse} />)}
            
            {stryMutAct_9fa48("26189") ? activeTab === 'patterns' || <BannedPatternsView patterns={bannedPatterns} /> : stryMutAct_9fa48("26188") ? false : stryMutAct_9fa48("26187") ? true : (stryCov_9fa48("26187", "26188", "26189"), (stryMutAct_9fa48("26191") ? activeTab !== 'patterns' : stryMutAct_9fa48("26190") ? true : (stryCov_9fa48("26190", "26191"), activeTab === 'patterns')) && <BannedPatternsView patterns={bannedPatterns} />)}
            
            {stryMutAct_9fa48("26195") ? activeTab === 'upskill' || <UpskillView assignments={upskillAssignments} /> : stryMutAct_9fa48("26194") ? false : stryMutAct_9fa48("26193") ? true : (stryCov_9fa48("26193", "26194", "26195"), (stryMutAct_9fa48("26197") ? activeTab !== 'upskill' : stryMutAct_9fa48("26196") ? true : (stryCov_9fa48("26196", "26197"), activeTab === 'upskill')) && <UpskillView assignments={upskillAssignments} />)}
            
            {stryMutAct_9fa48("26201") ? activeTab === 'history' || <HistoryView /> : stryMutAct_9fa48("26200") ? false : stryMutAct_9fa48("26199") ? true : (stryCov_9fa48("26199", "26200", "26201"), (stryMutAct_9fa48("26203") ? activeTab !== 'history' : stryMutAct_9fa48("26202") ? true : (stryCov_9fa48("26202", "26203"), activeTab === 'history')) && <HistoryView />)}
          </>}
      </main>
    </div>;
};

// =============================================================================
// DASHBOARD VIEW
// =============================================================================

interface DashboardViewProps {
  score: ApotheosisScore;
  latestRun: ApotheosisRun;
  escalations: Escalation[];
  upskillAssignments: UpskillAssignment[];
  bannedPatterns: PatternBan[];
  onEscalationResponse: (id: string, response: 'approved' | 'rejected' | 'deferred') => void;
}
const DashboardView: React.FC<DashboardViewProps> = ({
  score,
  latestRun,
  escalations,
  upskillAssignments,
  bannedPatterns,
  onEscalationResponse
}) => {
  return <div className="space-y-8">
      {/* Apotheosis Score */}
      <div className="bg-gradient-to-br from-purple-900/50 to-violet-900/50 rounded-2xl border border-purple-500/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg text-white/60 mb-2">APOTHEOSIS SCORE</h2>
          <div className="text-7xl font-bold bg-gradient-to-r from-purple-400 to-violet-400 bg-clip-text text-transparent">
            {score.overall}%
          </div>
          <div className="mt-3 flex items-center justify-center gap-2">
            <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-purple-500 to-violet-500 rounded-full transition-all duration-1000" style={stryMutAct_9fa48("26206") ? {} : (stryCov_9fa48("26206"), {
              width: `${score.overall}%`
            })} />
            </div>
          </div>
          <p className="mt-4 text-white/60">
            "{score.overall}% immune to self-inflicted destruction"
          </p>
          <p className="mt-2 text-purple-400">
            ↑ {score.improvementPoints} points in {score.improvementPeriod}
          </p>
        </div>

        {/* Score Components */}
        <div className="grid grid-cols-5 gap-4">
          {Object.entries(score.components).map(stryMutAct_9fa48("26208") ? () => undefined : (stryCov_9fa48("26208"), ([key, comp]) => <div key={key} className="text-center">
              <div className="text-2xl font-bold text-white">{comp.value}%</div>
              <div className="h-2 bg-white/10 rounded-full mt-2 overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={stryMutAct_9fa48("26209") ? {} : (stryCov_9fa48("26209"), {
              width: `${comp.value}%`
            })} />
              </div>
              <div className="text-xs text-white/50 mt-2 capitalize">
                {stryMutAct_9fa48("26211") ? key.replace(/([A-Z])/g, ' $1') : (stryCov_9fa48("26211"), key.replace(stryMutAct_9fa48("26212") ? /([^A-Z])/g : (stryCov_9fa48("26212"), /([A-Z])/g), ' $1').trim())}
              </div>
              <div className="text-xs text-white/30">({(stryMutAct_9fa48("26214") ? comp.weight / 100 : (stryCov_9fa48("26214"), comp.weight * 100)).toFixed(0)}% weight)</div>
            </div>))}
        </div>
      </div>

      {/* Last Night's Run */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold">Last Night's Run</h3>
          <span className="text-white/50 text-sm">
            {formatDate(latestRun.startedAt)} {formatTime(latestRun.startedAt)}
          </span>
        </div>
        
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{latestRun.scenariosTested.toLocaleString()}</div>
            <div className="text-sm text-white/50 mt-1">Scenarios Tested</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-amber-400">
              {stryMutAct_9fa48("26215") ? latestRun.criticalCount + latestRun.highCount + latestRun.mediumCount - latestRun.lowCount : (stryCov_9fa48("26215"), (stryMutAct_9fa48("26216") ? latestRun.criticalCount + latestRun.highCount - latestRun.mediumCount : (stryCov_9fa48("26216"), (stryMutAct_9fa48("26217") ? latestRun.criticalCount - latestRun.highCount : (stryCov_9fa48("26217"), latestRun.criticalCount + latestRun.highCount)) + latestRun.mediumCount)) + latestRun.lowCount)}
            </div>
            <div className="text-sm text-white/50 mt-1">Weaknesses Found</div>
            <div className="text-xs text-white/30 mt-1">
              {latestRun.criticalCount} critical · {latestRun.highCount} high
            </div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">44</div>
            <div className="text-sm text-white/50 mt-1">Auto-Patched</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{escalations.length}</div>
            <div className="text-sm text-white/50 mt-1">Escalated to Humans</div>
          </div>
        </div>
      </div>

      {/* Pending Human Decisions */}
      {stryMutAct_9fa48("26220") ? escalations.length > 0 || <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Human Decisions</h3>
          <div className="space-y-4">
            {escalations.slice(0, 3).map(esc => <div key={esc.id} className={`rounded-xl p-4 border ${esc.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{esc.severity === 'critical' ? '⚠️' : '🟡'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${esc.severity === 'critical' ? 'bg-red-500/30' : 'bg-amber-500/30'}`}>
                          {esc.severity.toUpperCase()}
                        </span>
                        <h4 className="font-semibold">{esc.title}</h4>
                      </div>
                      <p className="text-sm text-white/60 mt-1">{esc.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-white/50">
                        <span>Cost to fix: {formatCurrency(esc.estimatedCostToFix)}</span>
                        <span>Risk if not fixed: {formatCurrency(esc.riskIfNotFixed)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onEscalationResponse(esc.id, 'approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                      Approve Fix
                    </button>
                    <button onClick={() => onEscalationResponse(esc.id, 'rejected')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      Reject
                    </button>
                    <button onClick={() => onEscalationResponse(esc.id, 'deferred')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      Defer 30 Days
                    </button>
                  </div>
                </div>
              </div>)}
          </div>
        </div> : stryMutAct_9fa48("26219") ? false : stryMutAct_9fa48("26218") ? true : (stryCov_9fa48("26218", "26219", "26220"), (stryMutAct_9fa48("26223") ? escalations.length <= 0 : stryMutAct_9fa48("26222") ? escalations.length >= 0 : stryMutAct_9fa48("26221") ? true : (stryCov_9fa48("26221", "26222", "26223"), escalations.length > 0)) && <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Pending Human Decisions</h3>
          <div className="space-y-4">
            {stryMutAct_9fa48("26224") ? escalations.map(esc => <div key={esc.id} className={`rounded-xl p-4 border ${esc.severity === 'critical' ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{esc.severity === 'critical' ? '⚠️' : '🟡'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${esc.severity === 'critical' ? 'bg-red-500/30' : 'bg-amber-500/30'}`}>
                          {esc.severity.toUpperCase()}
                        </span>
                        <h4 className="font-semibold">{esc.title}</h4>
                      </div>
                      <p className="text-sm text-white/60 mt-1">{esc.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-white/50">
                        <span>Cost to fix: {formatCurrency(esc.estimatedCostToFix)}</span>
                        <span>Risk if not fixed: {formatCurrency(esc.riskIfNotFixed)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => onEscalationResponse(esc.id, 'approved')} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                      Approve Fix
                    </button>
                    <button onClick={() => onEscalationResponse(esc.id, 'rejected')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      Reject
                    </button>
                    <button onClick={() => onEscalationResponse(esc.id, 'deferred')} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      Defer 30 Days
                    </button>
                  </div>
                </div>
              </div>) : (stryCov_9fa48("26224"), escalations.slice(0, 3).map(stryMutAct_9fa48("26225") ? () => undefined : (stryCov_9fa48("26225"), esc => <div key={esc.id} className={`rounded-xl p-4 border ${(stryMutAct_9fa48("26229") ? esc.severity !== 'critical' : stryMutAct_9fa48("26228") ? false : stryMutAct_9fa48("26227") ? true : (stryCov_9fa48("26227", "26228", "26229"), esc.severity === 'critical')) ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{(stryMutAct_9fa48("26235") ? esc.severity !== 'critical' : stryMutAct_9fa48("26234") ? false : stryMutAct_9fa48("26233") ? true : (stryCov_9fa48("26233", "26234", "26235"), esc.severity === 'critical')) ? '⚠️' : '🟡'}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-0.5 rounded-full ${(stryMutAct_9fa48("26242") ? esc.severity !== 'critical' : stryMutAct_9fa48("26241") ? false : stryMutAct_9fa48("26240") ? true : (stryCov_9fa48("26240", "26241", "26242"), esc.severity === 'critical')) ? 'bg-red-500/30' : 'bg-amber-500/30'}`}>
                          {stryMutAct_9fa48("26246") ? esc.severity.toLowerCase() : (stryCov_9fa48("26246"), esc.severity.toUpperCase())}
                        </span>
                        <h4 className="font-semibold">{esc.title}</h4>
                      </div>
                      <p className="text-sm text-white/60 mt-1">{esc.description}</p>
                      <div className="flex gap-4 mt-3 text-xs text-white/50">
                        <span>Cost to fix: {formatCurrency(esc.estimatedCostToFix)}</span>
                        <span>Risk if not fixed: {formatCurrency(esc.riskIfNotFixed)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={stryMutAct_9fa48("26247") ? () => undefined : (stryCov_9fa48("26247"), () => onEscalationResponse(esc.id, 'approved'))} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition-colors">
                      Approve Fix
                    </button>
                    <button onClick={stryMutAct_9fa48("26249") ? () => undefined : (stryCov_9fa48("26249"), () => onEscalationResponse(esc.id, 'rejected'))} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      Reject
                    </button>
                    <button onClick={stryMutAct_9fa48("26251") ? () => undefined : (stryCov_9fa48("26251"), () => onEscalationResponse(esc.id, 'deferred'))} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors">
                      Defer 30 Days
                    </button>
                  </div>
                </div>
              </div>)))}
          </div>
        </div>)}

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* Humans Requiring Upskill */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Humans Requiring Upskill</h3>
          <div className="space-y-3">
            {upskillAssignments.map(stryMutAct_9fa48("26253") ? () => undefined : (stryCov_9fa48("26253"), assignment => <div key={assignment.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="font-medium">{assignment.userName}</div>
                  <div className="text-sm text-white/50">{assignment.gapIdentified}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm">{assignment.trainingDuration} min</div>
                  <div className="text-xs text-white/50">{getTimeRemaining(assignment.deadline)}</div>
                </div>
              </div>))}
          </div>
        </div>

        {/* Banned Patterns */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Banned Patterns</h3>
          <div className="space-y-3">
            {bannedPatterns.map(stryMutAct_9fa48("26254") ? () => undefined : (stryCov_9fa48("26254"), pattern => <div key={pattern.id} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div>
                  <div className="font-medium">{pattern.pattern}</div>
                  <div className="text-sm text-white/50">Banned {formatDate(pattern.bannedAt)}</div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-red-400">{pattern.failureRate}% failure</div>
                  <div className="text-xs text-white/50">{pattern.instances.length} instances</div>
                </div>
              </div>))}
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// ESCALATIONS VIEW
// =============================================================================

interface EscalationsViewProps {
  escalations: Escalation[];
  onResponse: (id: string, response: 'approved' | 'rejected' | 'deferred') => void;
}
const EscalationsView: React.FC<EscalationsViewProps> = ({
  escalations,
  onResponse
}) => {
  return <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Pending Escalations</h2>
        <span className="text-white/50">{escalations.length} items requiring human decision</span>
      </div>
      
      {(stryMutAct_9fa48("26258") ? escalations.length !== 0 : stryMutAct_9fa48("26257") ? false : stryMutAct_9fa48("26256") ? true : (stryCov_9fa48("26256", "26257", "26258"), escalations.length === 0)) ? <div className="text-center py-12 text-white/50">
          <span className="text-4xl mb-4 block">✓</span>
          No pending escalations. All clear!
        </div> : escalations.map(stryMutAct_9fa48("26259") ? () => undefined : (stryCov_9fa48("26259"), esc => <div key={esc.id} className={`rounded-xl p-6 border ${(stryMutAct_9fa48("26263") ? esc.severity !== 'critical' : stryMutAct_9fa48("26262") ? false : stryMutAct_9fa48("26261") ? true : (stryCov_9fa48("26261", "26262", "26263"), esc.severity === 'critical')) ? 'bg-red-500/10 border-red-500/30' : 'bg-amber-500/10 border-amber-500/30'}`}>
            <div className="flex items-start gap-4">
              <span className="text-2xl">{(stryMutAct_9fa48("26269") ? esc.severity !== 'critical' : stryMutAct_9fa48("26268") ? false : stryMutAct_9fa48("26267") ? true : (stryCov_9fa48("26267", "26268", "26269"), esc.severity === 'critical')) ? '⚠️' : '🟡'}</span>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className={`text-xs px-2 py-0.5 rounded-full ${(stryMutAct_9fa48("26276") ? esc.severity !== 'critical' : stryMutAct_9fa48("26275") ? false : stryMutAct_9fa48("26274") ? true : (stryCov_9fa48("26274", "26275", "26276"), esc.severity === 'critical')) ? 'bg-red-500/30' : 'bg-amber-500/30'}`}>
                    {stryMutAct_9fa48("26280") ? esc.severity.toLowerCase() : (stryCov_9fa48("26280"), esc.severity.toUpperCase())}
                  </span>
                  <h3 className="text-lg font-semibold">{esc.title}</h3>
                </div>
                
                <p className="text-white/70 mb-4">{esc.description}</p>
                
                <div className="grid grid-cols-3 gap-4 mb-4 text-sm">
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-white/50">Reason for escalation</div>
                    <div className="font-medium">{esc.reason}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-white/50">Estimated cost to fix</div>
                    <div className="font-medium text-green-400">{formatCurrency(esc.estimatedCostToFix)}</div>
                  </div>
                  <div className="bg-black/20 rounded-lg p-3">
                    <div className="text-white/50">Risk if not fixed</div>
                    <div className="font-medium text-red-400">{formatCurrency(esc.riskIfNotFixed)}</div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/50">
                    Deadline: {getTimeRemaining(esc.deadline)}
                  </span>
                  <div className="flex gap-2">
                    <button onClick={stryMutAct_9fa48("26281") ? () => undefined : (stryCov_9fa48("26281"), () => onResponse(esc.id, 'approved'))} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors">
                      Approve Fix
                    </button>
                    <button onClick={stryMutAct_9fa48("26283") ? () => undefined : (stryCov_9fa48("26283"), () => onResponse(esc.id, 'rejected'))} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                      Reject with Reason
                    </button>
                    <button onClick={stryMutAct_9fa48("26285") ? () => undefined : (stryCov_9fa48("26285"), () => onResponse(esc.id, 'deferred'))} className="px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
                      Defer 30 Days
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>))}
    </div>;
};

// =============================================================================
// BANNED PATTERNS VIEW
// =============================================================================

interface BannedPatternsViewProps {
  patterns: PatternBan[];
}
const BannedPatternsView: React.FC<BannedPatternsViewProps> = ({
  patterns
}) => {
  return <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Banned Decision Patterns</h2>
        <span className="text-white/50">{patterns.length} patterns banned</span>
      </div>
      
      {patterns.map(stryMutAct_9fa48("26288") ? () => undefined : (stryCov_9fa48("26288"), pattern => <div key={pattern.id} className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <span className="text-red-400">🚫</span>
                {pattern.pattern}
              </h3>
              <p className="text-white/60 mt-1">{pattern.description}</p>
            </div>
            <div className="text-right">
              <div className="text-red-400 font-bold">{pattern.failureRate}% failure rate</div>
              <div className="text-sm text-white/50">Total cost: {formatCurrency(pattern.totalCost)}</div>
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <h4 className="text-sm font-medium text-white/50 mb-3">Instances that led to this ban:</h4>
            <div className="space-y-2">
              {pattern.instances.map(stryMutAct_9fa48("26289") ? () => undefined : (stryCov_9fa48("26289"), (instance, i) => <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className={(stryMutAct_9fa48("26292") ? instance.outcome !== 'failure' : stryMutAct_9fa48("26291") ? false : stryMutAct_9fa48("26290") ? true : (stryCov_9fa48("26290", "26291", "26292"), instance.outcome === 'failure')) ? 'text-red-400' : 'text-green-400'}>
                      {(stryMutAct_9fa48("26298") ? instance.outcome !== 'failure' : stryMutAct_9fa48("26297") ? false : stryMutAct_9fa48("26296") ? true : (stryCov_9fa48("26296", "26297", "26298"), instance.outcome === 'failure')) ? '❌' : '✓'}
                    </span>
                    <span>{instance.decisionTitle}</span>
                  </div>
                  <div className="flex items-center gap-4 text-white/50">
                    <span>{formatDate(instance.date)}</span>
                    {stryMutAct_9fa48("26304") ? instance.cost || <span className="text-red-400">{formatCurrency(instance.cost)}</span> : stryMutAct_9fa48("26303") ? false : stryMutAct_9fa48("26302") ? true : (stryCov_9fa48("26302", "26303", "26304"), instance.cost && <span className="text-red-400">{formatCurrency(instance.cost)}</span>)}
                  </div>
                </div>))}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="text-white/50">
              Banned: {formatDate(pattern.bannedAt)} by {pattern.bannedBy}
            </div>
            <div className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-lg">
              Override requires: {pattern.overrideRequires}
            </div>
          </div>
        </div>))}
    </div>;
};

// =============================================================================
// UPSKILL VIEW
// =============================================================================

interface UpskillViewProps {
  assignments: UpskillAssignment[];
}
const UpskillView: React.FC<UpskillViewProps> = ({
  assignments
}) => {
  const getStatusColor = (status: UpskillAssignment['status']) => {
    switch (status) {
      case 'completed':
        if (stryMutAct_9fa48("26307")) {} else {
          stryCov_9fa48("26307");
          return 'text-green-400 bg-green-500/20';
        }
      case 'in_progress':
        if (stryMutAct_9fa48("26310")) {} else {
          stryCov_9fa48("26310");
          return 'text-blue-400 bg-blue-500/20';
        }
      case 'overdue':
        if (stryMutAct_9fa48("26313")) {} else {
          stryCov_9fa48("26313");
          return 'text-red-400 bg-red-500/20';
        }
      default:
        if (stryMutAct_9fa48("26316")) {} else {
          stryCov_9fa48("26316");
          return 'text-amber-400 bg-amber-500/20';
        }
    }
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Human Upskill Assignments</h2>
        <span className="text-white/50">{assignments.length} active assignments</span>
      </div>
      
      {assignments.map(stryMutAct_9fa48("26318") ? () => undefined : (stryCov_9fa48("26318"), assignment => <div key={assignment.id} className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-purple-500/20 flex items-center justify-center text-lg">
                  👤
                </div>
                <div>
                  <h3 className="font-semibold">{assignment.userName}</h3>
                  <p className="text-sm text-white/50">Gap: {assignment.gapIdentified}</p>
                </div>
              </div>
            </div>
            <div className="text-right">
              <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                {stryMutAct_9fa48("26320") ? assignment.status.replace('_', ' ').toLowerCase() : (stryCov_9fa48("26320"), assignment.status.replace('_', ' ').toUpperCase())}
              </span>
              {stryMutAct_9fa48("26325") ? assignment.blockingActions || <div className="mt-2 text-xs text-red-400">⚠️ Blocking actions</div> : stryMutAct_9fa48("26324") ? false : stryMutAct_9fa48("26323") ? true : (stryCov_9fa48("26323", "26324", "26325"), assignment.blockingActions && <div className="mt-2 text-xs text-red-400">⚠️ Blocking actions</div>)}
            </div>
          </div>
          
          <div className="bg-black/20 rounded-lg p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">{assignment.trainingTopic}</h4>
              <span className="text-sm text-white/50">{assignment.trainingDuration} min total</span>
            </div>
            <div className="space-y-2">
              {assignment.modules.map(stryMutAct_9fa48("26326") ? () => undefined : (stryCov_9fa48("26326"), (module, i) => <div key={i} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span>
                      {(stryMutAct_9fa48("26329") ? module.type !== 'video' : stryMutAct_9fa48("26328") ? false : stryMutAct_9fa48("26327") ? true : (stryCov_9fa48("26327", "26328", "26329"), module.type === 'video')) ? '🎥' : (stryMutAct_9fa48("26334") ? module.type !== 'quiz' : stryMutAct_9fa48("26333") ? false : stryMutAct_9fa48("26332") ? true : (stryCov_9fa48("26332", "26333", "26334"), module.type === 'quiz')) ? '📝' : '📖'}
                    </span>
                    <span>{module.title}</span>
                  </div>
                  <span className="text-white/50">{module.duration} min</span>
                </div>))}
            </div>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <span className="text-white/50">Deadline: {getTimeRemaining(assignment.deadline)}</span>
            <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg font-medium transition-colors">
              Start Training
            </button>
          </div>
        </div>))}
    </div>;
};

// =============================================================================
// HISTORY VIEW
// =============================================================================

const HistoryView: React.FC = () => {
  const [runs, setRuns] = useState<ApotheosisRun[]>(stryMutAct_9fa48("26339") ? ["Stryker was here"] : (stryCov_9fa48("26339"), []));
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("26340") ? false : (stryCov_9fa48("26340"), true));
  useEffect(() => {
    const loadRuns = async () => {
      const data = await apotheosisService.getRunHistory(14);
      setRuns(data);
      setIsLoading(stryMutAct_9fa48("26343") ? true : (stryCov_9fa48("26343"), false));
    };
    loadRuns();
  }, stryMutAct_9fa48("26344") ? ["Stryker was here"] : (stryCov_9fa48("26344"), []));
  if (stryMutAct_9fa48("26346") ? false : stryMutAct_9fa48("26345") ? true : (stryCov_9fa48("26345", "26346"), isLoading)) {
    return <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500" />
      </div>;
  }
  return <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Run History</h2>
        <span className="text-white/50">Last 14 days</span>
      </div>
      
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <table className="w-full">
          <thead className="bg-black/20">
            <tr className="text-left text-sm text-white/50">
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Duration</th>
              <th className="px-4 py-3">Scenarios</th>
              <th className="px-4 py-3">Survival</th>
              <th className="px-4 py-3">Weaknesses</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Change</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {runs.map(stryMutAct_9fa48("26348") ? () => undefined : (stryCov_9fa48("26348"), run => <tr key={run.id} className="hover:bg-white/5">
                <td className="px-4 py-3">
                  <div>{formatDate(run.startedAt)}</div>
                  <div className="text-xs text-white/50">{formatTime(run.startedAt)}</div>
                </td>
                <td className="px-4 py-3 text-white/70">{run.duration} min</td>
                <td className="px-4 py-3">{run.scenariosTested.toLocaleString()}</td>
                <td className="px-4 py-3">
                  <span className={(stryMutAct_9fa48("26352") ? run.survivalRate < 90 : stryMutAct_9fa48("26351") ? run.survivalRate > 90 : stryMutAct_9fa48("26350") ? false : stryMutAct_9fa48("26349") ? true : (stryCov_9fa48("26349", "26350", "26351", "26352"), run.survivalRate >= 90)) ? 'text-green-400' : 'text-amber-400'}>
                    {run.survivalRate.toFixed(1)}%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className="text-red-400">{run.criticalCount}</span> /
                  <span className="text-amber-400"> {run.highCount}</span> /
                  <span className="text-white/50"> {stryMutAct_9fa48("26355") ? run.mediumCount - run.lowCount : (stryCov_9fa48("26355"), run.mediumCount + run.lowCount)}</span>
                </td>
                <td className="px-4 py-3 font-medium">{run.apotheosisScore.toFixed(1)}%</td>
                <td className="px-4 py-3">
                  <span className={(stryMutAct_9fa48("26359") ? run.scoreDelta < 0 : stryMutAct_9fa48("26358") ? run.scoreDelta > 0 : stryMutAct_9fa48("26357") ? false : stryMutAct_9fa48("26356") ? true : (stryCov_9fa48("26356", "26357", "26358", "26359"), run.scoreDelta >= 0)) ? 'text-green-400' : 'text-red-400'}>
                    {(stryMutAct_9fa48("26365") ? run.scoreDelta < 0 : stryMutAct_9fa48("26364") ? run.scoreDelta > 0 : stryMutAct_9fa48("26363") ? false : stryMutAct_9fa48("26362") ? true : (stryCov_9fa48("26362", "26363", "26364", "26365"), run.scoreDelta >= 0)) ? '+' : ''}{run.scoreDelta.toFixed(1)}
                  </span>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>;
};
export default ApotheosisPage;