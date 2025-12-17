// @ts-nocheck
// =============================================================================
// CENDIA REDTEAM™ - Adversarial Security Engine
// "We hired the smartest attacker and gave them your keys — on purpose."
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
import { Shield, AlertTriangle, Skull, Target, Zap, Play, Eye, Lock, Unlock, CheckCircle, XCircle, RefreshCw, ChevronRight, TrendingUp, TrendingDown, Activity, AlertCircle, Crosshair } from 'lucide-react';
import { redteamApi } from '../../../lib/api';
interface ExploitPath {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  probabilityOfSuccess: number;
  potentialDamage: number;
}
interface DashboardData {
  score: number;
  breakdown: {
    policyStrength: number;
    ethicsResilience: number;
    accessControl: number;
    dataProtection: number;
    auditTrailIntegrity: number;
    humanOverrideEffectiveness: number;
  };
  vulnerabilities: {
    total: number;
    bySeverity: Record<string, number>;
    totalPotentialDamage: number;
  };
  trend: 'improving' | 'stable' | 'degrading';
  topWeaknesses: Array<{
    id: string;
    rank: number;
    title: string;
    category: string;
    exploitability: number;
    fixComplexity: string;
    autoFixAvailable: boolean;
  }>;
  immediateActions: Array<{
    id: string;
    description: string;
    patchType: string;
    reversible: boolean;
  }>;
  recommendations: string[];
  lastSimulation: string;
}
interface EvilTwinData {
  evilTwinStatus: string;
  objectivesInverted: boolean;
  attackVectorsExplored: number;
  exploitPathsFound: number;
  byAttackVector: Record<string, number>;
  mostVulnerableSystems: Array<{
    system: string;
    vulnerabilityCount: number;
  }>;
  topExploits: ExploitPath[];
}
const RedTeamPage = () => {
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [evilTwin, setEvilTwin] = useState<EvilTwinData | null>(null);
  const [loading, setLoading] = useState(stryMutAct_9fa48("24876") ? false : (stryCov_9fa48("24876"), true));
  const [simulating, setSimulating] = useState(stryMutAct_9fa48("24877") ? true : (stryCov_9fa48("24877"), false));
  const [view, setView] = useState<'dashboard' | 'evil-twin'>('dashboard');
  const fetchData = useCallback(async () => {
    setLoading(stryMutAct_9fa48("24880") ? false : (stryCov_9fa48("24880"), true));
    try {
      const [dashboardRes, evilTwinRes] = await Promise.all(stryMutAct_9fa48("24882") ? [] : (stryCov_9fa48("24882"), [redteamApi.getDashboard(), redteamApi.getEvilTwin()]));
      if (stryMutAct_9fa48("24884") ? false : stryMutAct_9fa48("24883") ? true : (stryCov_9fa48("24883", "24884"), dashboardRes.success)) {
        setDashboard(dashboardRes.data as DashboardData);
      }
      if (stryMutAct_9fa48("24887") ? false : stryMutAct_9fa48("24886") ? true : (stryCov_9fa48("24886", "24887"), evilTwinRes.success)) {
        setEvilTwin(evilTwinRes.data as EvilTwinData);
      }
    } catch (error) {
      console.error('Failed to fetch RedTeam data:', error);
    } finally {
      setLoading(stryMutAct_9fa48("24892") ? true : (stryCov_9fa48("24892"), false));
    }
  }, stryMutAct_9fa48("24893") ? ["Stryker was here"] : (stryCov_9fa48("24893"), []));
  useEffect(() => {
    fetchData();
  }, stryMutAct_9fa48("24895") ? [] : (stryCov_9fa48("24895"), [fetchData]));
  const runSimulation = async () => {
    setSimulating(stryMutAct_9fa48("24897") ? false : (stryCov_9fa48("24897"), true));
    try {
      await redteamApi.runSimulation(stryMutAct_9fa48("24899") ? {} : (stryCov_9fa48("24899"), {
        adversaryProfile: 'insider_threat',
        maxIterations: 1000
      }));
      await fetchData();
    } catch (error) {
      console.error('Simulation failed:', error);
    } finally {
      setSimulating(stryMutAct_9fa48("24904") ? true : (stryCov_9fa48("24904"), false));
    }
  };
  const applyPatch = async (patchId: string) => {
    try {
      await redteamApi.applyPatch(patchId);
      await fetchData();
    } catch (error) {
      console.error('Failed to apply patch:', error);
    }
  };
  const getScoreColor = (score: number) => {
    if (stryMutAct_9fa48("24913") ? score < 90 : stryMutAct_9fa48("24912") ? score > 90 : stryMutAct_9fa48("24911") ? false : stryMutAct_9fa48("24910") ? true : (stryCov_9fa48("24910", "24911", "24912", "24913"), score >= 90)) {
      return 'text-green-400';
    }
    if (stryMutAct_9fa48("24919") ? score < 70 : stryMutAct_9fa48("24918") ? score > 70 : stryMutAct_9fa48("24917") ? false : stryMutAct_9fa48("24916") ? true : (stryCov_9fa48("24916", "24917", "24918", "24919"), score >= 70)) {
      return 'text-amber-400';
    }
    if (stryMutAct_9fa48("24925") ? score < 50 : stryMutAct_9fa48("24924") ? score > 50 : stryMutAct_9fa48("24923") ? false : stryMutAct_9fa48("24922") ? true : (stryCov_9fa48("24922", "24923", "24924", "24925"), score >= 50)) {
      return 'text-orange-400';
    }
    return 'text-red-400';
  };
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        if (stryMutAct_9fa48("24930")) {} else {
          stryCov_9fa48("24930");
          return 'bg-red-500/20 text-red-400 border-red-500/30';
        }
      case 'high':
        if (stryMutAct_9fa48("24933")) {} else {
          stryCov_9fa48("24933");
          return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
        }
      case 'medium':
        if (stryMutAct_9fa48("24936")) {} else {
          stryCov_9fa48("24936");
          return 'bg-amber-500/20 text-amber-400 border-amber-500/30';
        }
      default:
        if (stryMutAct_9fa48("24939")) {} else {
          stryCov_9fa48("24939");
          return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
        }
    }
  };
  if (stryMutAct_9fa48("24942") ? false : stryMutAct_9fa48("24941") ? true : (stryCov_9fa48("24941", "24942"), loading)) {
    return <div className="flex items-center justify-center h-screen bg-neutral-950">
        <div className="text-center">
          <Shield className="w-12 h-12 text-red-500 animate-pulse mx-auto mb-4" />
          <p className="text-neutral-400">Loading Security Analysis...</p>
        </div>
      </div>;
  }
  return <div className={`min-h-screen text-white p-6 ${(stryMutAct_9fa48("24947") ? view !== 'evil-twin' : stryMutAct_9fa48("24946") ? false : stryMutAct_9fa48("24945") ? true : (stryCov_9fa48("24945", "24946", "24947"), view === 'evil-twin')) ? 'bg-black' : 'bg-neutral-950'}`}>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${(stryMutAct_9fa48("24954") ? view !== 'evil-twin' : stryMutAct_9fa48("24953") ? false : stryMutAct_9fa48("24952") ? true : (stryCov_9fa48("24952", "24953", "24954"), view === 'evil-twin')) ? 'bg-gradient-to-br from-red-600 to-black' : 'bg-gradient-to-br from-red-500 to-orange-600'}`}>
              {(stryMutAct_9fa48("24960") ? view !== 'evil-twin' : stryMutAct_9fa48("24959") ? false : stryMutAct_9fa48("24958") ? true : (stryCov_9fa48("24958", "24959", "24960"), view === 'evil-twin')) ? <Skull className="w-6 h-6" /> : <Shield className="w-6 h-6" />}
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                {(stryMutAct_9fa48("24964") ? view !== 'evil-twin' : stryMutAct_9fa48("24963") ? false : stryMutAct_9fa48("24962") ? true : (stryCov_9fa48("24962", "24963", "24964"), view === 'evil-twin')) ? 'Evil Twin Instance' : 'CendiaRedTeam™'}
              </h1>
              <p className="text-neutral-400">
                {(stryMutAct_9fa48("24970") ? view !== 'evil-twin' : stryMutAct_9fa48("24969") ? false : stryMutAct_9fa48("24968") ? true : (stryCov_9fa48("24968", "24969", "24970"), view === 'evil-twin')) ? 'Adversarial clone with inverted objectives' : 'Adversarial Security Engine'}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button onClick={stryMutAct_9fa48("24974") ? () => undefined : (stryCov_9fa48("24974"), () => setView((stryMutAct_9fa48("24977") ? view !== 'dashboard' : stryMutAct_9fa48("24976") ? false : stryMutAct_9fa48("24975") ? true : (stryCov_9fa48("24975", "24976", "24977"), view === 'dashboard')) ? 'evil-twin' : 'dashboard'))} className={`px-4 py-2 rounded-lg flex items-center gap-2 transition ${(stryMutAct_9fa48("24984") ? view !== 'evil-twin' : stryMutAct_9fa48("24983") ? false : stryMutAct_9fa48("24982") ? true : (stryCov_9fa48("24982", "24983", "24984"), view === 'evil-twin')) ? 'bg-red-500/20 text-red-400 border border-red-500/30 hover:bg-red-500/30' : 'bg-neutral-800 text-neutral-400 hover:bg-neutral-700'}`}>
              {(stryMutAct_9fa48("24990") ? view !== 'evil-twin' : stryMutAct_9fa48("24989") ? false : stryMutAct_9fa48("24988") ? true : (stryCov_9fa48("24988", "24989", "24990"), view === 'evil-twin')) ? <Shield className="w-4 h-4" /> : <Skull className="w-4 h-4" />}
              {(stryMutAct_9fa48("24994") ? view !== 'evil-twin' : stryMutAct_9fa48("24993") ? false : stryMutAct_9fa48("24992") ? true : (stryCov_9fa48("24992", "24993", "24994"), view === 'evil-twin')) ? 'Exit Evil Twin' : 'Enter Evil Twin'}
            </button>
            
            <button onClick={runSimulation} disabled={simulating} className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg flex items-center gap-2 hover:bg-red-500/30 transition disabled:opacity-50">
              {simulating ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
              {simulating ? 'Simulating...' : 'Run Attack Simulation'}
            </button>
          </div>
        </div>
        
        {stryMutAct_9fa48("25002") ? view === 'evil-twin' || <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">
              <strong>WARNING:</strong> You are viewing the adversarial clone. 
              This instance actively attempts to bypass your security controls.
            </p>
          </div> : stryMutAct_9fa48("25001") ? false : stryMutAct_9fa48("25000") ? true : (stryCov_9fa48("25000", "25001", "25002"), (stryMutAct_9fa48("25004") ? view !== 'evil-twin' : stryMutAct_9fa48("25003") ? true : (stryCov_9fa48("25003", "25004"), view === 'evil-twin')) && <div className="mt-4 p-4 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            <p className="text-red-400">
              <strong>WARNING:</strong> You are viewing the adversarial clone. 
              This instance actively attempts to bypass your security controls.
            </p>
          </div>)}
      </div>

      {(stryMutAct_9fa48("25008") ? view !== 'dashboard' : stryMutAct_9fa48("25007") ? false : stryMutAct_9fa48("25006") ? true : (stryCov_9fa48("25006", "25007", "25008"), view === 'dashboard')) ? (/* Normal Dashboard View */
    <>
          {/* Score Card */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-1 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-neutral-400">RedTeam Score</span>
                <Target className="w-5 h-5 text-neutral-500" />
              </div>
              
              <div className="relative w-32 h-32 mx-auto mb-4">
                <svg className="w-full h-full -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="40" fill="none" stroke="#262626" strokeWidth="8" />
                  <circle cx="50" cy="50" r="40" fill="none" stroke={(stryMutAct_9fa48("25012") ? dashboard?.score || dashboard.score >= 70 : stryMutAct_9fa48("25011") ? false : stryMutAct_9fa48("25010") ? true : (stryCov_9fa48("25010", "25011", "25012"), (stryMutAct_9fa48("25013") ? dashboard.score : (stryCov_9fa48("25013"), dashboard?.score)) && (stryMutAct_9fa48("25016") ? dashboard.score < 70 : stryMutAct_9fa48("25015") ? dashboard.score > 70 : stryMutAct_9fa48("25014") ? true : (stryCov_9fa48("25014", "25015", "25016"), dashboard.score >= 70)))) ? '#10b981' : (stryMutAct_9fa48("25020") ? dashboard?.score || dashboard.score >= 50 : stryMutAct_9fa48("25019") ? false : stryMutAct_9fa48("25018") ? true : (stryCov_9fa48("25018", "25019", "25020"), (stryMutAct_9fa48("25021") ? dashboard.score : (stryCov_9fa48("25021"), dashboard?.score)) && (stryMutAct_9fa48("25024") ? dashboard.score < 50 : stryMutAct_9fa48("25023") ? dashboard.score > 50 : stryMutAct_9fa48("25022") ? true : (stryCov_9fa48("25022", "25023", "25024"), dashboard.score >= 50)))) ? '#f59e0b' : '#ef4444'} strokeWidth="8" strokeLinecap="round" strokeDasharray={`${stryMutAct_9fa48("25028") ? (dashboard?.score || 0) / 2.51 : (stryCov_9fa48("25028"), (stryMutAct_9fa48("25031") ? dashboard?.score && 0 : stryMutAct_9fa48("25030") ? false : stryMutAct_9fa48("25029") ? true : (stryCov_9fa48("25029", "25030", "25031"), (stryMutAct_9fa48("25032") ? dashboard.score : (stryCov_9fa48("25032"), dashboard?.score)) || 0)) * 2.51)} 251`} />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className={`text-4xl font-bold ${getScoreColor(stryMutAct_9fa48("25036") ? dashboard?.score && 0 : stryMutAct_9fa48("25035") ? false : stryMutAct_9fa48("25034") ? true : (stryCov_9fa48("25034", "25035", "25036"), (stryMutAct_9fa48("25037") ? dashboard.score : (stryCov_9fa48("25037"), dashboard?.score)) || 0))}`}>
                    {stryMutAct_9fa48("25040") ? dashboard?.score && 0 : stryMutAct_9fa48("25039") ? false : stryMutAct_9fa48("25038") ? true : (stryCov_9fa48("25038", "25039", "25040"), (stryMutAct_9fa48("25041") ? dashboard.score : (stryCov_9fa48("25041"), dashboard?.score)) || 0)}
                  </span>
                </div>
              </div>
              
              <p className="text-center text-sm text-neutral-500">
                {(stryMutAct_9fa48("25044") ? dashboard?.score || dashboard.score >= 90 : stryMutAct_9fa48("25043") ? false : stryMutAct_9fa48("25042") ? true : (stryCov_9fa48("25042", "25043", "25044"), (stryMutAct_9fa48("25045") ? dashboard.score : (stryCov_9fa48("25045"), dashboard?.score)) && (stryMutAct_9fa48("25048") ? dashboard.score < 90 : stryMutAct_9fa48("25047") ? dashboard.score > 90 : stryMutAct_9fa48("25046") ? true : (stryCov_9fa48("25046", "25047", "25048"), dashboard.score >= 90)))) ? 'Excellent Security Posture' : (stryMutAct_9fa48("25052") ? dashboard?.score || dashboard.score >= 70 : stryMutAct_9fa48("25051") ? false : stryMutAct_9fa48("25050") ? true : (stryCov_9fa48("25050", "25051", "25052"), (stryMutAct_9fa48("25053") ? dashboard.score : (stryCov_9fa48("25053"), dashboard?.score)) && (stryMutAct_9fa48("25056") ? dashboard.score < 70 : stryMutAct_9fa48("25055") ? dashboard.score > 70 : stryMutAct_9fa48("25054") ? true : (stryCov_9fa48("25054", "25055", "25056"), dashboard.score >= 70)))) ? 'Good Security Posture' : (stryMutAct_9fa48("25060") ? dashboard?.score || dashboard.score >= 50 : stryMutAct_9fa48("25059") ? false : stryMutAct_9fa48("25058") ? true : (stryCov_9fa48("25058", "25059", "25060"), (stryMutAct_9fa48("25061") ? dashboard.score : (stryCov_9fa48("25061"), dashboard?.score)) && (stryMutAct_9fa48("25064") ? dashboard.score < 50 : stryMutAct_9fa48("25063") ? dashboard.score > 50 : stryMutAct_9fa48("25062") ? true : (stryCov_9fa48("25062", "25063", "25064"), dashboard.score >= 50)))) ? 'Needs Improvement' : 'Critical Vulnerabilities Detected'}
              </p>
              
              <div className={`mt-4 flex items-center justify-center gap-2 px-3 py-2 rounded-lg ${(stryMutAct_9fa48("25070") ? dashboard?.trend !== 'improving' : stryMutAct_9fa48("25069") ? false : stryMutAct_9fa48("25068") ? true : (stryCov_9fa48("25068", "25069", "25070"), (stryMutAct_9fa48("25071") ? dashboard.trend : (stryCov_9fa48("25071"), dashboard?.trend)) === 'improving')) ? 'bg-green-500/10 text-green-400' : (stryMutAct_9fa48("25076") ? dashboard?.trend !== 'degrading' : stryMutAct_9fa48("25075") ? false : stryMutAct_9fa48("25074") ? true : (stryCov_9fa48("25074", "25075", "25076"), (stryMutAct_9fa48("25077") ? dashboard.trend : (stryCov_9fa48("25077"), dashboard?.trend)) === 'degrading')) ? 'bg-red-500/10 text-red-400' : 'bg-neutral-800 text-neutral-400'}`}>
                {(stryMutAct_9fa48("25083") ? dashboard?.trend !== 'improving' : stryMutAct_9fa48("25082") ? false : stryMutAct_9fa48("25081") ? true : (stryCov_9fa48("25081", "25082", "25083"), (stryMutAct_9fa48("25084") ? dashboard.trend : (stryCov_9fa48("25084"), dashboard?.trend)) === 'improving')) ? <TrendingUp className="w-4 h-4" /> : (stryMutAct_9fa48("25088") ? dashboard?.trend !== 'degrading' : stryMutAct_9fa48("25087") ? false : stryMutAct_9fa48("25086") ? true : (stryCov_9fa48("25086", "25087", "25088"), (stryMutAct_9fa48("25089") ? dashboard.trend : (stryCov_9fa48("25089"), dashboard?.trend)) === 'degrading')) ? <TrendingDown className="w-4 h-4" /> : <Activity className="w-4 h-4" />}
                <span className="text-sm capitalize">{stryMutAct_9fa48("25093") ? dashboard?.trend && 'stable' : stryMutAct_9fa48("25092") ? false : stryMutAct_9fa48("25091") ? true : (stryCov_9fa48("25091", "25092", "25093"), (stryMutAct_9fa48("25094") ? dashboard.trend : (stryCov_9fa48("25094"), dashboard?.trend)) || 'stable')}</span>
              </div>
            </div>

            {/* Security Breakdown */}
            <div className="lg:col-span-3 bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Lock className="w-5 h-5 text-blue-500" />
                Security Breakdown
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {Object.entries(stryMutAct_9fa48("25098") ? dashboard?.breakdown && {} : stryMutAct_9fa48("25097") ? false : stryMutAct_9fa48("25096") ? true : (stryCov_9fa48("25096", "25097", "25098"), (stryMutAct_9fa48("25099") ? dashboard.breakdown : (stryCov_9fa48("25099"), dashboard?.breakdown)) || {})).map(stryMutAct_9fa48("25100") ? () => undefined : (stryCov_9fa48("25100"), ([key, value]) => <div key={key} className="p-4 bg-neutral-800/50 rounded-lg">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-neutral-400 capitalize">
                        {stryMutAct_9fa48("25101") ? key.replace(/([A-Z])/g, ' $1') : (stryCov_9fa48("25101"), key.replace(stryMutAct_9fa48("25102") ? /([^A-Z])/g : (stryCov_9fa48("25102"), /([A-Z])/g), ' $1').trim())}
                      </span>
                      <span className={`text-sm font-bold ${getScoreColor(value)}`}>
                        {value}%
                      </span>
                    </div>
                    <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full ${(stryMutAct_9fa48("25109") ? value < 80 : stryMutAct_9fa48("25108") ? value > 80 : stryMutAct_9fa48("25107") ? false : stryMutAct_9fa48("25106") ? true : (stryCov_9fa48("25106", "25107", "25108", "25109"), value >= 80)) ? 'bg-green-500' : (stryMutAct_9fa48("25114") ? value < 60 : stryMutAct_9fa48("25113") ? value > 60 : stryMutAct_9fa48("25112") ? false : stryMutAct_9fa48("25111") ? true : (stryCov_9fa48("25111", "25112", "25113", "25114"), value >= 60)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("25117") ? {} : (stryCov_9fa48("25117"), {
                  width: `${value}%`
                })} />
                    </div>
                  </div>))}
              </div>
            </div>
          </div>

          {/* Vulnerabilities Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {/* Vulnerability Summary */}
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                Vulnerability Summary
              </h2>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center p-3 bg-red-500/10 rounded-lg border border-red-500/20">
                  <span className="text-red-400">Critical</span>
                  <span className="text-2xl font-bold text-red-400">
                    {stryMutAct_9fa48("25121") ? dashboard?.vulnerabilities.bySeverity?.critical && 0 : stryMutAct_9fa48("25120") ? false : stryMutAct_9fa48("25119") ? true : (stryCov_9fa48("25119", "25120", "25121"), (stryMutAct_9fa48("25123") ? dashboard.vulnerabilities.bySeverity?.critical : stryMutAct_9fa48("25122") ? dashboard?.vulnerabilities.bySeverity.critical : (stryCov_9fa48("25122", "25123"), dashboard?.vulnerabilities.bySeverity?.critical)) || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-orange-500/10 rounded-lg border border-orange-500/20">
                  <span className="text-orange-400">High</span>
                  <span className="text-2xl font-bold text-orange-400">
                    {stryMutAct_9fa48("25126") ? dashboard?.vulnerabilities.bySeverity?.high && 0 : stryMutAct_9fa48("25125") ? false : stryMutAct_9fa48("25124") ? true : (stryCov_9fa48("25124", "25125", "25126"), (stryMutAct_9fa48("25128") ? dashboard.vulnerabilities.bySeverity?.high : stryMutAct_9fa48("25127") ? dashboard?.vulnerabilities.bySeverity.high : (stryCov_9fa48("25127", "25128"), dashboard?.vulnerabilities.bySeverity?.high)) || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-amber-500/10 rounded-lg border border-amber-500/20">
                  <span className="text-amber-400">Medium</span>
                  <span className="text-2xl font-bold text-amber-400">
                    {stryMutAct_9fa48("25131") ? dashboard?.vulnerabilities.bySeverity?.medium && 0 : stryMutAct_9fa48("25130") ? false : stryMutAct_9fa48("25129") ? true : (stryCov_9fa48("25129", "25130", "25131"), (stryMutAct_9fa48("25133") ? dashboard.vulnerabilities.bySeverity?.medium : stryMutAct_9fa48("25132") ? dashboard?.vulnerabilities.bySeverity.medium : (stryCov_9fa48("25132", "25133"), dashboard?.vulnerabilities.bySeverity?.medium)) || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <span className="text-blue-400">Low</span>
                  <span className="text-2xl font-bold text-blue-400">
                    {stryMutAct_9fa48("25136") ? dashboard?.vulnerabilities.bySeverity?.low && 0 : stryMutAct_9fa48("25135") ? false : stryMutAct_9fa48("25134") ? true : (stryCov_9fa48("25134", "25135", "25136"), (stryMutAct_9fa48("25138") ? dashboard.vulnerabilities.bySeverity?.low : stryMutAct_9fa48("25137") ? dashboard?.vulnerabilities.bySeverity.low : (stryCov_9fa48("25137", "25138"), dashboard?.vulnerabilities.bySeverity?.low)) || 0)}
                  </span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-neutral-800">
                <p className="text-sm text-neutral-500">Total Potential Damage</p>
                <p className="text-2xl font-bold text-red-400">
                  ${(stryMutAct_9fa48("25139") ? (dashboard?.vulnerabilities.totalPotentialDamage || 0) * 1000000 : (stryCov_9fa48("25139"), (stryMutAct_9fa48("25142") ? dashboard?.vulnerabilities.totalPotentialDamage && 0 : stryMutAct_9fa48("25141") ? false : stryMutAct_9fa48("25140") ? true : (stryCov_9fa48("25140", "25141", "25142"), (stryMutAct_9fa48("25143") ? dashboard.vulnerabilities.totalPotentialDamage : (stryCov_9fa48("25143"), dashboard?.vulnerabilities.totalPotentialDamage)) || 0)) / 1000000)).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Top Weaknesses */}
            <div className="lg:col-span-2 bg-neutral-900 rounded-xl border border-neutral-800">
              <div className="p-5 border-b border-neutral-800">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <Crosshair className="w-5 h-5 text-red-500" />
                  Top 5 Exploitable Weaknesses
                </h2>
              </div>
              
              <div className="divide-y divide-neutral-800">
                {(stryMutAct_9fa48("25146") ? dashboard?.topWeaknesses && [] : stryMutAct_9fa48("25145") ? false : stryMutAct_9fa48("25144") ? true : (stryCov_9fa48("25144", "25145", "25146"), (stryMutAct_9fa48("25147") ? dashboard.topWeaknesses : (stryCov_9fa48("25147"), dashboard?.topWeaknesses)) || (stryMutAct_9fa48("25148") ? ["Stryker was here"] : (stryCov_9fa48("25148"), [])))).map(stryMutAct_9fa48("25149") ? () => undefined : (stryCov_9fa48("25149"), weakness => <div key={weakness.id} className="p-4 hover:bg-neutral-800/50 transition">
                    <div className="flex items-start gap-4">
                      <div className="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                        <span className="text-sm font-bold text-red-400">#{weakness.rank}</span>
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">{weakness.title}</p>
                        <div className="flex items-center gap-3 mt-1 text-sm">
                          <span className="text-neutral-500">{weakness.category}</span>
                          <span className="text-neutral-600">•</span>
                          <span className="text-neutral-500">
                            Exploitability: {weakness.exploitability}%
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-lg ${(stryMutAct_9fa48("25153") ? weakness.fixComplexity === 'trivial' && weakness.fixComplexity === 'easy' : stryMutAct_9fa48("25152") ? false : stryMutAct_9fa48("25151") ? true : (stryCov_9fa48("25151", "25152", "25153"), (stryMutAct_9fa48("25155") ? weakness.fixComplexity !== 'trivial' : stryMutAct_9fa48("25154") ? false : (stryCov_9fa48("25154", "25155"), weakness.fixComplexity === 'trivial')) || (stryMutAct_9fa48("25158") ? weakness.fixComplexity !== 'easy' : stryMutAct_9fa48("25157") ? false : (stryCov_9fa48("25157", "25158"), weakness.fixComplexity === 'easy')))) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("25163") ? weakness.fixComplexity !== 'moderate' : stryMutAct_9fa48("25162") ? false : stryMutAct_9fa48("25161") ? true : (stryCov_9fa48("25161", "25162", "25163"), weakness.fixComplexity === 'moderate')) ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                          {weakness.fixComplexity}
                        </span>
                        
                        {stryMutAct_9fa48("25169") ? weakness.autoFixAvailable || <button className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Auto-Fix
                          </button> : stryMutAct_9fa48("25168") ? false : stryMutAct_9fa48("25167") ? true : (stryCov_9fa48("25167", "25168", "25169"), weakness.autoFixAvailable && <button className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition flex items-center gap-1">
                            <Zap className="w-3 h-3" />
                            Auto-Fix
                          </button>)}
                      </div>
                    </div>
                  </div>))}
                
                {stryMutAct_9fa48("25172") ? (dashboard?.topWeaknesses || []).length === 0 || <div className="p-8 text-center text-neutral-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                    <p>No critical weaknesses detected</p>
                    <p className="text-sm mt-1">Run a simulation to discover potential vulnerabilities</p>
                  </div> : stryMutAct_9fa48("25171") ? false : stryMutAct_9fa48("25170") ? true : (stryCov_9fa48("25170", "25171", "25172"), (stryMutAct_9fa48("25174") ? (dashboard?.topWeaknesses || []).length !== 0 : stryMutAct_9fa48("25173") ? true : (stryCov_9fa48("25173", "25174"), (stryMutAct_9fa48("25177") ? dashboard?.topWeaknesses && [] : stryMutAct_9fa48("25176") ? false : stryMutAct_9fa48("25175") ? true : (stryCov_9fa48("25175", "25176", "25177"), (stryMutAct_9fa48("25178") ? dashboard.topWeaknesses : (stryCov_9fa48("25178"), dashboard?.topWeaknesses)) || (stryMutAct_9fa48("25179") ? ["Stryker was here"] : (stryCov_9fa48("25179"), [])))).length === 0)) && <div className="p-8 text-center text-neutral-500">
                    <CheckCircle className="w-12 h-12 mx-auto mb-3 text-green-500 opacity-50" />
                    <p>No critical weaknesses detected</p>
                    <p className="text-sm mt-1">Run a simulation to discover potential vulnerabilities</p>
                  </div>)}
              </div>
            </div>
          </div>

          {/* Recommendations & Actions */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                Security Recommendations
              </h2>
              
              <div className="space-y-3">
                {(stryMutAct_9fa48("25182") ? dashboard?.recommendations && [] : stryMutAct_9fa48("25181") ? false : stryMutAct_9fa48("25180") ? true : (stryCov_9fa48("25180", "25181", "25182"), (stryMutAct_9fa48("25183") ? dashboard.recommendations : (stryCov_9fa48("25183"), dashboard?.recommendations)) || (stryMutAct_9fa48("25184") ? ["Stryker was here"] : (stryCov_9fa48("25184"), [])))).map(stryMutAct_9fa48("25185") ? () => undefined : (stryCov_9fa48("25185"), (rec, idx) => <div key={idx} className="flex gap-3 p-3 bg-neutral-800/50 rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                      <span className="text-xs font-bold text-amber-400">{stryMutAct_9fa48("25186") ? idx - 1 : (stryCov_9fa48("25186"), idx + 1)}</span>
                    </div>
                    <p className="text-sm text-neutral-300">{rec}</p>
                  </div>))}
              </div>
            </div>

            <div className="bg-neutral-900 rounded-xl border border-neutral-800 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Zap className="w-5 h-5 text-green-500" />
                Immediate Actions Available
              </h2>
              
              <div className="space-y-3">
                {(stryMutAct_9fa48("25189") ? dashboard?.immediateActions && [] : stryMutAct_9fa48("25188") ? false : stryMutAct_9fa48("25187") ? true : (stryCov_9fa48("25187", "25188", "25189"), (stryMutAct_9fa48("25190") ? dashboard.immediateActions : (stryCov_9fa48("25190"), dashboard?.immediateActions)) || (stryMutAct_9fa48("25191") ? ["Stryker was here"] : (stryCov_9fa48("25191"), [])))).map(stryMutAct_9fa48("25192") ? () => undefined : (stryCov_9fa48("25192"), action => <div key={action.id} className="flex items-center justify-between p-3 bg-neutral-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                        {action.reversible ? <Unlock className="w-4 h-4 text-green-400" /> : <Lock className="w-4 h-4 text-amber-400" />}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{action.description}</p>
                        <p className="text-xs text-neutral-500">{action.patchType}</p>
                      </div>
                    </div>
                    
                    <button onClick={stryMutAct_9fa48("25193") ? () => undefined : (stryCov_9fa48("25193"), () => applyPatch(action.id))} className="px-3 py-1 bg-green-500/20 text-green-400 text-sm rounded-lg hover:bg-green-500/30 transition">
                      Apply
                    </button>
                  </div>))}
                
                {stryMutAct_9fa48("25196") ? (dashboard?.immediateActions || []).length === 0 || <p className="text-neutral-500 text-sm text-center py-4">
                    No immediate actions available
                  </p> : stryMutAct_9fa48("25195") ? false : stryMutAct_9fa48("25194") ? true : (stryCov_9fa48("25194", "25195", "25196"), (stryMutAct_9fa48("25198") ? (dashboard?.immediateActions || []).length !== 0 : stryMutAct_9fa48("25197") ? true : (stryCov_9fa48("25197", "25198"), (stryMutAct_9fa48("25201") ? dashboard?.immediateActions && [] : stryMutAct_9fa48("25200") ? false : stryMutAct_9fa48("25199") ? true : (stryCov_9fa48("25199", "25200", "25201"), (stryMutAct_9fa48("25202") ? dashboard.immediateActions : (stryCov_9fa48("25202"), dashboard?.immediateActions)) || (stryMutAct_9fa48("25203") ? ["Stryker was here"] : (stryCov_9fa48("25203"), [])))).length === 0)) && <p className="text-neutral-500 text-sm text-center py-4">
                    No immediate actions available
                  </p>)}
              </div>
            </div>
          </div>
        </>) : (/* Evil Twin View */
    <div className="space-y-6">
          {/* Evil Twin Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Status</span>
                <Activity className="w-5 h-5 text-red-500 animate-pulse" />
              </div>
              <p className="text-2xl font-bold text-red-400">{stryMutAct_9fa48("25204") ? evilTwin.evilTwinStatus : (stryCov_9fa48("25204"), evilTwin?.evilTwinStatus)}</p>
            </div>
            
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Attack Vectors</span>
                <Crosshair className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-400">{stryMutAct_9fa48("25205") ? evilTwin.attackVectorsExplored : (stryCov_9fa48("25205"), evilTwin?.attackVectorsExplored)}</p>
            </div>
            
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Exploit Paths</span>
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-400">{stryMutAct_9fa48("25206") ? evilTwin.exploitPathsFound : (stryCov_9fa48("25206"), evilTwin?.exploitPathsFound)}</p>
            </div>
            
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-red-400/70 text-sm">Objectives</span>
                <Skull className="w-5 h-5 text-red-500" />
              </div>
              <p className="text-2xl font-bold text-red-400">
                {(stryMutAct_9fa48("25207") ? evilTwin.objectivesInverted : (stryCov_9fa48("25207"), evilTwin?.objectivesInverted)) ? 'INVERTED' : 'NORMAL'}
              </p>
            </div>
          </div>

          {/* Exploit Paths Visualization */}
          <div className="bg-black/50 rounded-xl border border-red-900/50 p-6">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
              <Eye className="w-5 h-5" />
              Live Exploit Path Visualization
            </h2>
            
            <div className="space-y-4">
              {(stryMutAct_9fa48("25212") ? evilTwin?.topExploits && [] : stryMutAct_9fa48("25211") ? false : stryMutAct_9fa48("25210") ? true : (stryCov_9fa48("25210", "25211", "25212"), (stryMutAct_9fa48("25213") ? evilTwin.topExploits : (stryCov_9fa48("25213"), evilTwin?.topExploits)) || (stryMutAct_9fa48("25214") ? ["Stryker was here"] : (stryCov_9fa48("25214"), [])))).map(stryMutAct_9fa48("25215") ? () => undefined : (stryCov_9fa48("25215"), (exploit, idx) => <div key={exploit.id} className="p-4 bg-black/30 border border-red-900/30 rounded-lg">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4">
                      <div className={`px-2 py-1 text-xs rounded border ${getSeverityColor(exploit.severity)}`}>
                        {stryMutAct_9fa48("25217") ? exploit.severity.toLowerCase() : (stryCov_9fa48("25217"), exploit.severity.toUpperCase())}
                      </div>
                      <div>
                        <p className="font-medium text-red-100">{exploit.title}</p>
                        <p className="text-sm text-red-400/70 mt-1">{exploit.description}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-red-400/70">Success Rate</p>
                      <p className="text-xl font-bold text-red-400">{exploit.probabilityOfSuccess}%</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-red-900/30 flex items-center justify-between">
                    <span className="text-sm text-red-400/70">
                      Potential Damage: ${(stryMutAct_9fa48("25218") ? exploit.potentialDamage * 1000 : (stryCov_9fa48("25218"), exploit.potentialDamage / 1000)).toFixed(0)}K
                    </span>
                    <button className="px-3 py-1 bg-red-500/20 text-red-400 text-sm rounded-lg hover:bg-red-500/30 transition flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      View Details
                    </button>
                  </div>
                </div>))}
              
              {stryMutAct_9fa48("25221") ? (evilTwin?.topExploits || []).length === 0 || <div className="p-8 text-center text-red-400/50">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No exploit paths discovered yet</p>
                  <p className="text-sm mt-1">Run an attack simulation to discover vulnerabilities</p>
                </div> : stryMutAct_9fa48("25220") ? false : stryMutAct_9fa48("25219") ? true : (stryCov_9fa48("25219", "25220", "25221"), (stryMutAct_9fa48("25223") ? (evilTwin?.topExploits || []).length !== 0 : stryMutAct_9fa48("25222") ? true : (stryCov_9fa48("25222", "25223"), (stryMutAct_9fa48("25226") ? evilTwin?.topExploits && [] : stryMutAct_9fa48("25225") ? false : stryMutAct_9fa48("25224") ? true : (stryCov_9fa48("25224", "25225", "25226"), (stryMutAct_9fa48("25227") ? evilTwin.topExploits : (stryCov_9fa48("25227"), evilTwin?.topExploits)) || (stryMutAct_9fa48("25228") ? ["Stryker was here"] : (stryCov_9fa48("25228"), [])))).length === 0)) && <div className="p-8 text-center text-red-400/50">
                  <Shield className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No exploit paths discovered yet</p>
                  <p className="text-sm mt-1">Run an attack simulation to discover vulnerabilities</p>
                </div>)}
            </div>
          </div>

          {/* Most Vulnerable Systems */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-black/50 rounded-xl border border-red-900/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                <Target className="w-5 h-5" />
                Most Vulnerable Systems
              </h2>
              
              <div className="space-y-3">
                {(stryMutAct_9fa48("25231") ? evilTwin?.mostVulnerableSystems && [] : stryMutAct_9fa48("25230") ? false : stryMutAct_9fa48("25229") ? true : (stryCov_9fa48("25229", "25230", "25231"), (stryMutAct_9fa48("25232") ? evilTwin.mostVulnerableSystems : (stryCov_9fa48("25232"), evilTwin?.mostVulnerableSystems)) || (stryMutAct_9fa48("25233") ? ["Stryker was here"] : (stryCov_9fa48("25233"), [])))).map(stryMutAct_9fa48("25234") ? () => undefined : (stryCov_9fa48("25234"), (system, idx) => <div key={system.system} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <span className="text-red-100">{system.system}</span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
                      {system.vulnerabilityCount} vulns
                    </span>
                  </div>))}
              </div>
            </div>

            <div className="bg-black/50 rounded-xl border border-red-900/50 p-6">
              <h2 className="text-lg font-semibold mb-4 flex items-center gap-2 text-red-400">
                <Crosshair className="w-5 h-5" />
                Attack Vectors Explored
              </h2>
              
              <div className="space-y-3">
                {Object.entries(stryMutAct_9fa48("25237") ? evilTwin?.byAttackVector && {} : stryMutAct_9fa48("25236") ? false : stryMutAct_9fa48("25235") ? true : (stryCov_9fa48("25235", "25236", "25237"), (stryMutAct_9fa48("25238") ? evilTwin.byAttackVector : (stryCov_9fa48("25238"), evilTwin?.byAttackVector)) || {})).map(stryMutAct_9fa48("25239") ? () => undefined : (stryCov_9fa48("25239"), ([vector, count]) => <div key={vector} className="flex items-center justify-between p-3 bg-black/30 rounded-lg">
                    <span className="text-red-100 capitalize">
                      {vector.replace(/_/g, ' ')}
                    </span>
                    <span className="px-2 py-1 bg-red-500/20 text-red-400 text-sm rounded">
                      {count} paths
                    </span>
                  </div>))}
              </div>
            </div>
          </div>
        </div>)}
    </div>;
};
export default RedTeamPage;