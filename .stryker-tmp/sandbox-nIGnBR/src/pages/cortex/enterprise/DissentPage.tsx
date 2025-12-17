// @ts-nocheck
// =============================================================================
// CENDIA DISSENT™ — THE RIGHT TO FORMALLY, SAFELY, IMMUTABLY DISAGREE
// "Every decision includes the right to disagree — on the record, forever."
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
import { dissentService, Dissent, DissenterProfile, OrganizationDissentMetrics, DissentType, DissentSeverity, ResponseType } from '../../../services/DissentService';

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString('en-US', stryMutAct_9fa48("29238") ? {} : (stryCov_9fa48("29238"), {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }));
};
const getTimeRemaining = (deadline: Date | string): string => {
  const now = new Date();
  const target = new Date(deadline);
  const diff = stryMutAct_9fa48("29243") ? target.getTime() + now.getTime() : (stryCov_9fa48("29243"), target.getTime() - now.getTime());
  const hours = Math.floor(stryMutAct_9fa48("29244") ? diff * (1000 * 60 * 60) : (stryCov_9fa48("29244"), diff / (stryMutAct_9fa48("29245") ? 1000 * 60 / 60 : (stryCov_9fa48("29245"), (stryMutAct_9fa48("29246") ? 1000 / 60 : (stryCov_9fa48("29246"), 1000 * 60)) * 60))));
  const days = Math.floor(stryMutAct_9fa48("29247") ? hours * 24 : (stryCov_9fa48("29247"), hours / 24));
  if (stryMutAct_9fa48("29251") ? diff >= 0 : stryMutAct_9fa48("29250") ? diff <= 0 : stryMutAct_9fa48("29249") ? false : stryMutAct_9fa48("29248") ? true : (stryCov_9fa48("29248", "29249", "29250", "29251"), diff < 0)) return 'Overdue';
  if (stryMutAct_9fa48("29256") ? days <= 0 : stryMutAct_9fa48("29255") ? days >= 0 : stryMutAct_9fa48("29254") ? false : stryMutAct_9fa48("29253") ? true : (stryCov_9fa48("29253", "29254", "29255", "29256"), days > 0)) return `${days} days remaining`;
  if (stryMutAct_9fa48("29261") ? hours <= 0 : stryMutAct_9fa48("29260") ? hours >= 0 : stryMutAct_9fa48("29259") ? false : stryMutAct_9fa48("29258") ? true : (stryCov_9fa48("29258", "29259", "29260", "29261"), hours > 0)) return `${hours} hours remaining`;
  return 'Due soon';
};
const getStatusColor = (status: Dissent['status']): string => {
  switch (status) {
    case 'pending':
      if (stryMutAct_9fa48("29265")) {} else {
        stryCov_9fa48("29265");
        return 'bg-amber-500/20 text-amber-400';
      }
    case 'acknowledged':
      if (stryMutAct_9fa48("29268")) {} else {
        stryCov_9fa48("29268");
        return 'bg-blue-500/20 text-blue-400';
      }
    case 'accepted':
      if (stryMutAct_9fa48("29271")) {} else {
        stryCov_9fa48("29271");
        return 'bg-green-500/20 text-green-400';
      }
    case 'overruled':
      if (stryMutAct_9fa48("29274")) {} else {
        stryCov_9fa48("29274");
        return 'bg-red-500/20 text-red-400';
      }
    case 'clarification_requested':
      if (stryMutAct_9fa48("29277")) {} else {
        stryCov_9fa48("29277");
        return 'bg-purple-500/20 text-purple-400';
      }
    case 'escalated':
      if (stryMutAct_9fa48("29280")) {} else {
        stryCov_9fa48("29280");
        return 'bg-orange-500/20 text-orange-400';
      }
    default:
      if (stryMutAct_9fa48("29283")) {} else {
        stryCov_9fa48("29283");
        return 'bg-white/20 text-white';
      }
  }
};
const getDissentTypeLabel = (type: DissentType): string => {
  const labels: Record<DissentType, string> = stryMutAct_9fa48("29286") ? {} : (stryCov_9fa48("29286"), {
    factual: 'Factual Concern',
    risk: 'Risk Concern',
    ethical: 'Ethical Concern',
    process: 'Process Concern',
    strategic: 'Strategic Concern',
    resource: 'Resource Concern',
    other: 'Other'
  });
  return labels[type];
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DissentPage: React.FC = () => {
  const navigate = useNavigate();
  const [dissents, setDissents] = useState<Dissent[]>(stryMutAct_9fa48("29295") ? ["Stryker was here"] : (stryCov_9fa48("29295"), []));
  const [metrics, setMetrics] = useState<OrganizationDissentMetrics | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'file' | 'my-dissents' | 'respond' | 'analytics'>('dashboard');
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("29297") ? false : (stryCov_9fa48("29297"), true));
  const [showFileModal, setShowFileModal] = useState(stryMutAct_9fa48("29298") ? true : (stryCov_9fa48("29298"), false));
  const loadData = useCallback(async () => {
    setIsLoading(stryMutAct_9fa48("29300") ? false : (stryCov_9fa48("29300"), true));
    try {
      const [dissentsData, metricsData] = await Promise.all(stryMutAct_9fa48("29302") ? [] : (stryCov_9fa48("29302"), [dissentService.getDissents(), dissentService.getOrganizationMetrics()]));
      setDissents(dissentsData);
      setMetrics(metricsData);
    } catch (error) {
      console.error('Error loading Dissent data:', error);
    } finally {
      setIsLoading(stryMutAct_9fa48("29306") ? true : (stryCov_9fa48("29306"), false));
    }
  }, stryMutAct_9fa48("29307") ? ["Stryker was here"] : (stryCov_9fa48("29307"), []));
  useEffect(() => {
    loadData();
    // Initialize demo data
    dissentService.initializeDemoData().catch(() => {});
  }, stryMutAct_9fa48("29309") ? [] : (stryCov_9fa48("29309"), [loadData]));
  const activeDissents = stryMutAct_9fa48("29310") ? dissents : (stryCov_9fa48("29310"), dissents.filter(stryMutAct_9fa48("29311") ? () => undefined : (stryCov_9fa48("29311"), d => stryMutAct_9fa48("29314") ? d.status !== 'pending' : stryMutAct_9fa48("29313") ? false : stryMutAct_9fa48("29312") ? true : (stryCov_9fa48("29312", "29313", "29314"), d.status === 'pending'))));
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-red-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-red-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("29316") ? () => undefined : (stryCov_9fa48("29316"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-500 to-rose-600 flex items-center justify-center text-xl">
                  🛑
                </div>
                <div>
                  <h1 className="text-xl font-bold">CendiaDissent™</h1>
                  <p className="text-sm text-white/60">Formalized, Protected, Immutable Disagreement</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={stryMutAct_9fa48("29318") ? () => undefined : (stryCov_9fa48("29318"), () => setShowFileModal(stryMutAct_9fa48("29319") ? false : (stryCov_9fa48("29319"), true)))} className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg font-medium transition-colors">
                File New Dissent
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-red-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("29320") ? [] : (stryCov_9fa48("29320"), [stryMutAct_9fa48("29321") ? {} : (stryCov_9fa48("29321"), {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊'
          }), stryMutAct_9fa48("29325") ? {} : (stryCov_9fa48("29325"), {
            id: 'respond',
            label: 'Pending Response',
            icon: '⏳',
            count: activeDissents.length
          }), stryMutAct_9fa48("29329") ? {} : (stryCov_9fa48("29329"), {
            id: 'my-dissents',
            label: 'My Dissents',
            icon: '📝'
          }), stryMutAct_9fa48("29333") ? {} : (stryCov_9fa48("29333"), {
            id: 'analytics',
            label: 'Organization Health',
            icon: '📈'
          })])).map(stryMutAct_9fa48("29337") ? () => undefined : (stryCov_9fa48("29337"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("29338") ? () => undefined : (stryCov_9fa48("29338"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 flex items-center gap-2 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("29342") ? activeTab !== tab.id : stryMutAct_9fa48("29341") ? false : stryMutAct_9fa48("29340") ? true : (stryCov_9fa48("29340", "29341", "29342"), activeTab === tab.id)) ? 'border-red-500 text-white bg-red-500/10' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                <span>{tab.icon}</span>
                {tab.label}
                {stryMutAct_9fa48("29347") ? tab.count !== undefined && tab.count > 0 || <span className="px-1.5 py-0.5 text-xs bg-red-500/30 rounded-full">
                    {tab.count}
                  </span> : stryMutAct_9fa48("29346") ? false : stryMutAct_9fa48("29345") ? true : (stryCov_9fa48("29345", "29346", "29347"), (stryMutAct_9fa48("29349") ? tab.count !== undefined || tab.count > 0 : stryMutAct_9fa48("29348") ? true : (stryCov_9fa48("29348", "29349"), (stryMutAct_9fa48("29351") ? tab.count === undefined : stryMutAct_9fa48("29350") ? true : (stryCov_9fa48("29350", "29351"), tab.count !== undefined)) && (stryMutAct_9fa48("29354") ? tab.count <= 0 : stryMutAct_9fa48("29353") ? tab.count >= 0 : stryMutAct_9fa48("29352") ? true : (stryCov_9fa48("29352", "29353", "29354"), tab.count > 0)))) && <span className="px-1.5 py-0.5 text-xs bg-red-500/30 rounded-full">
                    {tab.count}
                  </span>)}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {isLoading ? <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500" />
          </div> : <>
            {stryMutAct_9fa48("29357") ? activeTab === 'dashboard' && metrics || <DashboardView metrics={metrics} activeDissents={activeDissents} recentDissents={dissents.slice(0, 5)} /> : stryMutAct_9fa48("29356") ? false : stryMutAct_9fa48("29355") ? true : (stryCov_9fa48("29355", "29356", "29357"), (stryMutAct_9fa48("29359") ? activeTab === 'dashboard' || metrics : stryMutAct_9fa48("29358") ? true : (stryCov_9fa48("29358", "29359"), (stryMutAct_9fa48("29361") ? activeTab !== 'dashboard' : stryMutAct_9fa48("29360") ? true : (stryCov_9fa48("29360", "29361"), activeTab === 'dashboard')) && metrics)) && <DashboardView metrics={metrics} activeDissents={activeDissents} recentDissents={stryMutAct_9fa48("29363") ? dissents : (stryCov_9fa48("29363"), dissents.slice(0, 5))} />)}
            
            {stryMutAct_9fa48("29366") ? activeTab === 'respond' || <RespondView dissents={activeDissents} onRespond={loadData} /> : stryMutAct_9fa48("29365") ? false : stryMutAct_9fa48("29364") ? true : (stryCov_9fa48("29364", "29365", "29366"), (stryMutAct_9fa48("29368") ? activeTab !== 'respond' : stryMutAct_9fa48("29367") ? true : (stryCov_9fa48("29367", "29368"), activeTab === 'respond')) && <RespondView dissents={activeDissents} onRespond={loadData} />)}
            
            {stryMutAct_9fa48("29372") ? activeTab === 'my-dissents' || <MyDissentsView dissents={dissents} /> : stryMutAct_9fa48("29371") ? false : stryMutAct_9fa48("29370") ? true : (stryCov_9fa48("29370", "29371", "29372"), (stryMutAct_9fa48("29374") ? activeTab !== 'my-dissents' : stryMutAct_9fa48("29373") ? true : (stryCov_9fa48("29373", "29374"), activeTab === 'my-dissents')) && <MyDissentsView dissents={dissents} />)}
            
            {stryMutAct_9fa48("29378") ? activeTab === 'analytics' && metrics || <AnalyticsView metrics={metrics} /> : stryMutAct_9fa48("29377") ? false : stryMutAct_9fa48("29376") ? true : (stryCov_9fa48("29376", "29377", "29378"), (stryMutAct_9fa48("29380") ? activeTab === 'analytics' || metrics : stryMutAct_9fa48("29379") ? true : (stryCov_9fa48("29379", "29380"), (stryMutAct_9fa48("29382") ? activeTab !== 'analytics' : stryMutAct_9fa48("29381") ? true : (stryCov_9fa48("29381", "29382"), activeTab === 'analytics')) && metrics)) && <AnalyticsView metrics={metrics} />)}
          </>}
      </main>

      {/* File Dissent Modal */}
      {stryMutAct_9fa48("29386") ? showFileModal || <FileDissentModal onClose={() => setShowFileModal(false)} onSubmit={async data => {
      await dissentService.fileDissent(data);
      setShowFileModal(false);
      loadData();
    }} /> : stryMutAct_9fa48("29385") ? false : stryMutAct_9fa48("29384") ? true : (stryCov_9fa48("29384", "29385", "29386"), showFileModal && <FileDissentModal onClose={stryMutAct_9fa48("29387") ? () => undefined : (stryCov_9fa48("29387"), () => setShowFileModal(stryMutAct_9fa48("29388") ? true : (stryCov_9fa48("29388"), false)))} onSubmit={async data => {
      await dissentService.fileDissent(data);
      setShowFileModal(stryMutAct_9fa48("29390") ? true : (stryCov_9fa48("29390"), false));
      loadData();
    }} />)}
    </div>;
};

// =============================================================================
// DASHBOARD VIEW
// =============================================================================

interface DashboardViewProps {
  metrics: OrganizationDissentMetrics;
  activeDissents: Dissent[];
  recentDissents: Dissent[];
}
const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  activeDissents,
  recentDissents
}) => {
  return <div className="space-y-8">
      {/* Dissent Index */}
      <div className="bg-gradient-to-br from-red-900/50 to-rose-900/50 rounded-2xl border border-red-500/30 p-8">
        <div className="text-center mb-8">
          <h2 className="text-lg text-white/60 mb-2">DISSENT INDEX</h2>
          <div className={`text-5xl font-bold ${(stryMutAct_9fa48("29395") ? metrics.healthStatus !== 'healthy' : stryMutAct_9fa48("29394") ? false : stryMutAct_9fa48("29393") ? true : (stryCov_9fa48("29393", "29394", "29395"), metrics.healthStatus === 'healthy')) ? 'text-green-400' : (stryMutAct_9fa48("29400") ? metrics.healthStatus !== 'warning' : stryMutAct_9fa48("29399") ? false : stryMutAct_9fa48("29398") ? true : (stryCov_9fa48("29398", "29399", "29400"), metrics.healthStatus === 'warning')) ? 'text-amber-400' : 'text-red-400'}`}>
            {stryMutAct_9fa48("29404") ? metrics.healthStatus.toLowerCase() : (stryCov_9fa48("29404"), metrics.healthStatus.toUpperCase())}
          </div>
          <p className="mt-4 text-white/60 max-w-lg mx-auto">
            {(stryMutAct_9fa48("29407") ? metrics.healthStatus !== 'healthy' : stryMutAct_9fa48("29406") ? false : stryMutAct_9fa48("29405") ? true : (stryCov_9fa48("29405", "29406", "29407"), metrics.healthStatus === 'healthy')) ? "Your organization has healthy dissent patterns. People feel safe to disagree, and dissent is acknowledged and tracked." : "There are concerns about your organization's dissent patterns."}
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-white">{metrics.activeDissents}</div>
            <div className="text-sm text-white/50 mt-1">Active Dissents</div>
            <div className="text-xs text-white/30">awaiting response</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{metrics.responseRate}%</div>
            <div className="text-sm text-white/50 mt-1">Response Rate</div>
            <div className="text-xs text-white/30">all acknowledged</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-purple-400">{metrics.overallAccuracy}%</div>
            <div className="text-sm text-white/50 mt-1">Dissent Accuracy</div>
            <div className="text-xs text-white/30">dissenters proven right</div>
          </div>
          <div className="bg-black/20 rounded-xl p-4 text-center">
            <div className="text-3xl font-bold text-green-400">{metrics.retaliationFlags}</div>
            <div className="text-sm text-white/50 mt-1">Retaliation Flags</div>
            <div className="text-xs text-white/30">no incidents</div>
          </div>
        </div>
      </div>

      {/* Active Dissents Requiring Response */}
      {stryMutAct_9fa48("29413") ? activeDissents.length > 0 || <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Dissents Requiring Response</h3>
          <div className="space-y-4">
            {activeDissents.map(dissent => <DissentCard key={dissent.id} dissent={dissent} showResponseButton />)}
          </div>
        </div> : stryMutAct_9fa48("29412") ? false : stryMutAct_9fa48("29411") ? true : (stryCov_9fa48("29411", "29412", "29413"), (stryMutAct_9fa48("29416") ? activeDissents.length <= 0 : stryMutAct_9fa48("29415") ? activeDissents.length >= 0 : stryMutAct_9fa48("29414") ? true : (stryCov_9fa48("29414", "29415", "29416"), activeDissents.length > 0)) && <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Dissents Requiring Response</h3>
          <div className="space-y-4">
            {activeDissents.map(stryMutAct_9fa48("29417") ? () => undefined : (stryCov_9fa48("29417"), dissent => <DissentCard key={dissent.id} dissent={dissent} showResponseButton />))}
          </div>
        </div>)}

      {/* Bottom Row */}
      <div className="grid grid-cols-2 gap-6">
        {/* High Accuracy Dissenters */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span>⭐</span> High-Accuracy Dissenters
          </h3>
          <p className="text-sm text-white/50 mb-4">
            These people's dissents should receive priority review.
          </p>
          <div className="space-y-3">
            {metrics.highAccuracyDissenters.map(stryMutAct_9fa48("29418") ? () => undefined : (stryCov_9fa48("29418"), profile => <div key={profile.userId} className="flex items-center justify-between p-3 bg-black/20 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-yellow-500/20 flex items-center justify-center">
                    ⭐
                  </div>
                  <div>
                    <div className="font-medium">{profile.userName}</div>
                    <div className="text-xs text-white/50">{profile.totalDissents} dissents</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-400">{profile.dissentAccuracy}%</div>
                  <div className="text-xs text-white/50">accuracy</div>
                </div>
              </div>))}
          </div>
        </div>

        {/* By Department */}
        <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <h3 className="text-lg font-semibold mb-4">Dissent by Department</h3>
          <div className="space-y-3">
            {metrics.byDepartment.map(stryMutAct_9fa48("29419") ? () => undefined : (stryCov_9fa48("29419"), dept => <div key={dept.department} className="p-3 bg-black/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">{dept.department}</span>
                  <div className="flex items-center gap-4 text-sm">
                    <span>{dept.totalDissents} dissents</span>
                    <span className={(stryMutAct_9fa48("29423") ? dept.accuracy < 70 : stryMutAct_9fa48("29422") ? dept.accuracy > 70 : stryMutAct_9fa48("29421") ? false : stryMutAct_9fa48("29420") ? true : (stryCov_9fa48("29420", "29421", "29422", "29423"), dept.accuracy >= 70)) ? 'text-green-400' : 'text-white/50'}>
                      {dept.accuracy}% accuracy
                    </span>
                    <span>
                      {(stryMutAct_9fa48("29428") ? dept.trend !== 'up' : stryMutAct_9fa48("29427") ? false : stryMutAct_9fa48("29426") ? true : (stryCov_9fa48("29426", "29427", "29428"), dept.trend === 'up')) ? '↑' : (stryMutAct_9fa48("29433") ? dept.trend !== 'down' : stryMutAct_9fa48("29432") ? false : stryMutAct_9fa48("29431") ? true : (stryCov_9fa48("29431", "29432", "29433"), dept.trend === 'down')) ? '↓' : '→'}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1">
                  <div className="h-1.5 bg-green-500 rounded-full" style={stryMutAct_9fa48("29437") ? {} : (stryCov_9fa48("29437"), {
                width: `${dept.acceptedRate}%`
              })} />
                  <div className="h-1.5 bg-red-500/50 rounded-full" style={stryMutAct_9fa48("29439") ? {} : (stryCov_9fa48("29439"), {
                width: `${stryMutAct_9fa48("29441") ? 100 + dept.acceptedRate : (stryCov_9fa48("29441"), 100 - dept.acceptedRate)}%`
              })} />
                </div>
                <div className="text-xs text-white/40 mt-1">{dept.acceptedRate}% accepted</div>
              </div>))}
          </div>
        </div>
      </div>
    </div>;
};

// =============================================================================
// DISSENT CARD COMPONENT
// =============================================================================

interface DissentCardProps {
  dissent: Dissent;
  showResponseButton?: boolean;
}
const DissentCard: React.FC<DissentCardProps> = ({
  dissent,
  showResponseButton
}) => {
  return <div className="bg-black/20 rounded-xl p-4 border border-white/10">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center">
          {dissent.isAnonymous ? '🔒' : '👤'}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs px-2 py-0.5 rounded-full ${getStatusColor(dissent.status)}`}>
              {stryMutAct_9fa48("29446") ? dissent.status.replace('_', ' ').toLowerCase() : (stryCov_9fa48("29446"), dissent.status.replace('_', ' ').toUpperCase())}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {getDissentTypeLabel(dissent.dissentType)}
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-white/10">
              {dissent.severity.replace('_', ' ')}
            </span>
          </div>
          
          <h4 className="font-semibold">{dissent.decisionTitle}</h4>
          <p className="text-sm text-white/60 mt-1 line-clamp-2">{dissent.statement}</p>
          
          <div className="flex items-center gap-4 mt-3 text-xs text-white/50">
            <span>From: {dissent.dissenterName}</span>
            <span>Filed: {formatDate(dissent.createdAt)}</span>
            <span className={(stryMutAct_9fa48("29454") ? new Date(dissent.responseDeadline) >= new Date() : stryMutAct_9fa48("29453") ? new Date(dissent.responseDeadline) <= new Date() : stryMutAct_9fa48("29452") ? false : stryMutAct_9fa48("29451") ? true : (stryCov_9fa48("29451", "29452", "29453", "29454"), new Date(dissent.responseDeadline) < new Date())) ? 'text-red-400' : ''}>
              {getTimeRemaining(dissent.responseDeadline)}
            </span>
          </div>
          
          {stryMutAct_9fa48("29459") ? dissent.response || <div className="mt-3 p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-white/50 mb-1">Response from {dissent.response.responderName}:</div>
              <p className="text-sm">{dissent.response.reasoning}</p>
            </div> : stryMutAct_9fa48("29458") ? false : stryMutAct_9fa48("29457") ? true : (stryCov_9fa48("29457", "29458", "29459"), dissent.response && <div className="mt-3 p-3 bg-white/5 rounded-lg">
              <div className="text-xs text-white/50 mb-1">Response from {dissent.response.responderName}:</div>
              <p className="text-sm">{dissent.response.reasoning}</p>
            </div>)}
          
          {stryMutAct_9fa48("29462") ? dissent.outcomeVerified || <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${dissent.dissenterWasRight ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
              {dissent.dissenterWasRight ? '✓ Dissenter was RIGHT' : 'Outcome verified: dissenter was wrong'}
            </div> : stryMutAct_9fa48("29461") ? false : stryMutAct_9fa48("29460") ? true : (stryCov_9fa48("29460", "29461", "29462"), dissent.outcomeVerified && <div className={`mt-3 px-3 py-2 rounded-lg text-sm ${dissent.dissenterWasRight ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-white/60'}`}>
              {dissent.dissenterWasRight ? '✓ Dissenter was RIGHT' : 'Outcome verified: dissenter was wrong'}
            </div>)}
        </div>
        
        {stryMutAct_9fa48("29470") ? showResponseButton && dissent.status === 'pending' || <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            Respond
          </button> : stryMutAct_9fa48("29469") ? false : stryMutAct_9fa48("29468") ? true : (stryCov_9fa48("29468", "29469", "29470"), (stryMutAct_9fa48("29472") ? showResponseButton || dissent.status === 'pending' : stryMutAct_9fa48("29471") ? true : (stryCov_9fa48("29471", "29472"), showResponseButton && (stryMutAct_9fa48("29474") ? dissent.status !== 'pending' : stryMutAct_9fa48("29473") ? true : (stryCov_9fa48("29473", "29474"), dissent.status === 'pending')))) && <button className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg text-sm font-medium transition-colors">
            Respond
          </button>)}
      </div>
    </div>;
};

// =============================================================================
// RESPOND VIEW
// =============================================================================

interface RespondViewProps {
  dissents: Dissent[];
  onRespond: () => void;
}
const RespondView: React.FC<RespondViewProps> = ({
  dissents,
  onRespond
}) => {
  const [selectedDissent, setSelectedDissent] = useState<Dissent | null>(null);
  const [responseType, setResponseType] = useState<ResponseType>('acknowledge_proceed');
  const [reasoning, setReasoning] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("29479") ? true : (stryCov_9fa48("29479"), false));
  const handleSubmit = async () => {
    if (stryMutAct_9fa48("29483") ? !selectedDissent && !reasoning.trim() : stryMutAct_9fa48("29482") ? false : stryMutAct_9fa48("29481") ? true : (stryCov_9fa48("29481", "29482", "29483"), (stryMutAct_9fa48("29484") ? selectedDissent : (stryCov_9fa48("29484"), !selectedDissent)) || (stryMutAct_9fa48("29485") ? reasoning.trim() : (stryCov_9fa48("29485"), !(stryMutAct_9fa48("29486") ? reasoning : (stryCov_9fa48("29486"), reasoning.trim())))))) return;
    setIsSubmitting(stryMutAct_9fa48("29487") ? false : (stryCov_9fa48("29487"), true));
    try {
      await dissentService.respondToDissent(selectedDissent.id, stryMutAct_9fa48("29489") ? {} : (stryCov_9fa48("29489"), {
        responderId: 'current-user',
        responderName: 'Current User',
        responderRole: 'Decision Owner',
        responseType,
        reasoning
      }));
      setSelectedDissent(null);
      setReasoning('');
      onRespond();
    } finally {
      setIsSubmitting(stryMutAct_9fa48("29495") ? true : (stryCov_9fa48("29495"), false));
    }
  };
  return <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold">Dissents Requiring Your Response</h2>
        <span className="text-white/50">{dissents.length} pending</span>
      </div>
      
      {(stryMutAct_9fa48("29498") ? dissents.length !== 0 : stryMutAct_9fa48("29497") ? false : stryMutAct_9fa48("29496") ? true : (stryCov_9fa48("29496", "29497", "29498"), dissents.length === 0)) ? <div className="text-center py-12 text-white/50">
          <span className="text-4xl mb-4 block">✓</span>
          No pending dissents. All clear!
        </div> : <div className="grid grid-cols-2 gap-6">
          {/* Dissent List */}
          <div className="space-y-4">
            {dissents.map(stryMutAct_9fa48("29499") ? () => undefined : (stryCov_9fa48("29499"), dissent => <div key={dissent.id} onClick={stryMutAct_9fa48("29500") ? () => undefined : (stryCov_9fa48("29500"), () => setSelectedDissent(dissent))} className={`cursor-pointer transition-all ${(stryMutAct_9fa48("29504") ? selectedDissent?.id !== dissent.id : stryMutAct_9fa48("29503") ? false : stryMutAct_9fa48("29502") ? true : (stryCov_9fa48("29502", "29503", "29504"), (stryMutAct_9fa48("29505") ? selectedDissent.id : (stryCov_9fa48("29505"), selectedDissent?.id)) === dissent.id)) ? 'ring-2 ring-red-500' : 'hover:bg-white/5'}`}>
                <DissentCard dissent={dissent} />
              </div>))}
          </div>
          
          {/* Response Form */}
          <div className="bg-white/5 rounded-xl border border-white/10 p-6 sticky top-24">
            {selectedDissent ? <>
                <h3 className="text-lg font-semibold mb-4">Respond to Dissent</h3>
                
                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2">Response Type</label>
                  <div className="space-y-2">
                    {(stryMutAct_9fa48("29508") ? [] : (stryCov_9fa48("29508"), [stryMutAct_9fa48("29509") ? {} : (stryCov_9fa48("29509"), {
                value: 'accept',
                label: 'Accept dissent (change the decision)'
              }), stryMutAct_9fa48("29512") ? {} : (stryCov_9fa48("29512"), {
                value: 'partial_accept',
                label: 'Partial accept (modify the decision)'
              }), stryMutAct_9fa48("29515") ? {} : (stryCov_9fa48("29515"), {
                value: 'acknowledge_proceed',
                label: 'Acknowledge but proceed (explain why overruling)'
              }), stryMutAct_9fa48("29518") ? {} : (stryCov_9fa48("29518"), {
                value: 'request_clarification',
                label: 'Request clarification'
              }), stryMutAct_9fa48("29521") ? {} : (stryCov_9fa48("29521"), {
                value: 'escalate_together',
                label: 'Escalate jointly to board'
              })])).map(stryMutAct_9fa48("29524") ? () => undefined : (stryCov_9fa48("29524"), option => <label key={option.value} className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name="responseType" value={option.value} checked={stryMutAct_9fa48("29527") ? responseType !== option.value : stryMutAct_9fa48("29526") ? false : stryMutAct_9fa48("29525") ? true : (stryCov_9fa48("29525", "29526", "29527"), responseType === option.value)} onChange={stryMutAct_9fa48("29528") ? () => undefined : (stryCov_9fa48("29528"), () => setResponseType(option.value as ResponseType))} className="text-red-500" />
                        <span className="text-sm">{option.label}</span>
                      </label>))}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label className="block text-sm text-white/60 mb-2">Your Reasoning (required)</label>
                  <textarea value={reasoning} onChange={stryMutAct_9fa48("29529") ? () => undefined : (stryCov_9fa48("29529"), e => setReasoning(e.target.value))} rows={6} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Explain your response..." />
                </div>
                
                <div className="text-xs text-white/40 mb-4">
                  ⚠️ This response will be permanently recorded in CendiaLedger™
                </div>
                
                <button onClick={handleSubmit} disabled={stryMutAct_9fa48("29532") ? !reasoning.trim() && isSubmitting : stryMutAct_9fa48("29531") ? false : stryMutAct_9fa48("29530") ? true : (stryCov_9fa48("29530", "29531", "29532"), (stryMutAct_9fa48("29533") ? reasoning.trim() : (stryCov_9fa48("29533"), !(stryMutAct_9fa48("29534") ? reasoning : (stryCov_9fa48("29534"), reasoning.trim())))) || isSubmitting)} className="w-full px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg font-medium transition-colors">
                  {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
              </> : <div className="text-center py-12 text-white/50">
                Select a dissent to respond
              </div>}
          </div>
        </div>}
    </div>;
};

// =============================================================================
// MY DISSENTS VIEW
// =============================================================================

interface MyDissentsViewProps {
  dissents: Dissent[];
}
const MyDissentsView: React.FC<MyDissentsViewProps> = ({
  dissents
}) => {
  const [profile, setProfile] = useState<DissenterProfile | null>(null);
  useEffect(() => {
    dissentService.getDissenterProfile('user-sarah').then(setProfile);
  }, stryMutAct_9fa48("29540") ? ["Stryker was here"] : (stryCov_9fa48("29540"), []));
  return <div className="space-y-6">
      {/* Profile Summary */}
      {stryMutAct_9fa48("29543") ? profile || <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
              {profile.isHighAccuracy ? '⭐' : '👤'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{profile.userName}</h3>
              {profile.isHighAccuracy && <div className="text-sm text-yellow-400">⭐ High-Accuracy Dissenter</div>}
              <p className="text-sm text-white/50 mt-1">Your dissents receive priority review.</p>
            </div>
            <div className="grid grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold">{profile.totalDissents}</div>
                <div className="text-xs text-white/50">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{profile.acceptedDissents}</div>
                <div className="text-xs text-white/50">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{profile.overruledDissents}</div>
                <div className="text-xs text-white/50">Overruled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{profile.dissentAccuracy}%</div>
                <div className="text-xs text-white/50">Accuracy</div>
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("29542") ? false : stryMutAct_9fa48("29541") ? true : (stryCov_9fa48("29541", "29542", "29543"), profile && <div className="bg-white/5 rounded-xl border border-white/10 p-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-2xl">
              {profile.isHighAccuracy ? '⭐' : '👤'}
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold">{profile.userName}</h3>
              {stryMutAct_9fa48("29548") ? profile.isHighAccuracy || <div className="text-sm text-yellow-400">⭐ High-Accuracy Dissenter</div> : stryMutAct_9fa48("29547") ? false : stryMutAct_9fa48("29546") ? true : (stryCov_9fa48("29546", "29547", "29548"), profile.isHighAccuracy && <div className="text-sm text-yellow-400">⭐ High-Accuracy Dissenter</div>)}
              <p className="text-sm text-white/50 mt-1">Your dissents receive priority review.</p>
            </div>
            <div className="grid grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-2xl font-bold">{profile.totalDissents}</div>
                <div className="text-xs text-white/50">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400">{profile.acceptedDissents}</div>
                <div className="text-xs text-white/50">Accepted</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400">{profile.overruledDissents}</div>
                <div className="text-xs text-white/50">Overruled</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-400">{profile.dissentAccuracy}%</div>
                <div className="text-xs text-white/50">Accuracy</div>
              </div>
            </div>
          </div>
        </div>)}

      {/* Dissent History */}
      <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
        <div className="px-6 py-4 border-b border-white/10">
          <h3 className="font-semibold">My Dissent History</h3>
        </div>
        <div className="divide-y divide-white/5">
          {dissents.map(stryMutAct_9fa48("29549") ? () => undefined : (stryCov_9fa48("29549"), dissent => <div key={dissent.id} className="p-4">
              <DissentCard dissent={dissent} />
            </div>))}
        </div>
      </div>
    </div>;
};

// =============================================================================
// ANALYTICS VIEW
// =============================================================================

interface AnalyticsViewProps {
  metrics: OrganizationDissentMetrics;
}
const AnalyticsView: React.FC<AnalyticsViewProps> = ({
  metrics
}) => {
  return <div className="space-y-6">
      <h2 className="text-xl font-bold">Organization Dissent Health</h2>
      
      {/* Key Metrics Grid */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-white">{metrics.totalDissents}</div>
          <div className="text-sm text-white/50 mt-2">Total Dissents</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-green-400">{metrics.responseRate}%</div>
          <div className="text-sm text-white/50 mt-2">Response Rate</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-purple-400">{metrics.acceptanceRate}%</div>
          <div className="text-sm text-white/50 mt-2">Acceptance Rate</div>
        </div>
        <div className="bg-white/5 rounded-xl border border-white/10 p-6 text-center">
          <div className="text-4xl font-bold text-amber-400">{metrics.overallAccuracy}%</div>
          <div className="text-sm text-white/50 mt-2">Dissent Accuracy</div>
        </div>
      </div>

      {/* Attention Required */}
      {stryMutAct_9fa48("29553") ? metrics.byDepartment.some(d => d.accuracy >= 75) || <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold">Attention Required</h4>
              <p className="text-sm text-white/70 mt-1">
                {metrics.byDepartment.find(d => d.accuracy >= 75)?.department} dissents have {metrics.byDepartment.find(d => d.accuracy >= 75)?.accuracy}% accuracy — 
                significantly higher than organization average. Consider elevating {metrics.byDepartment.find(d => d.accuracy >= 75)?.department} concerns in Council weighting.
              </p>
            </div>
          </div>
        </div> : stryMutAct_9fa48("29552") ? false : stryMutAct_9fa48("29551") ? true : (stryCov_9fa48("29551", "29552", "29553"), (stryMutAct_9fa48("29554") ? metrics.byDepartment.every(d => d.accuracy >= 75) : (stryCov_9fa48("29554"), metrics.byDepartment.some(stryMutAct_9fa48("29555") ? () => undefined : (stryCov_9fa48("29555"), d => stryMutAct_9fa48("29559") ? d.accuracy < 75 : stryMutAct_9fa48("29558") ? d.accuracy > 75 : stryMutAct_9fa48("29557") ? false : stryMutAct_9fa48("29556") ? true : (stryCov_9fa48("29556", "29557", "29558", "29559"), d.accuracy >= 75))))) && <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4">
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <h4 className="font-semibold">Attention Required</h4>
              <p className="text-sm text-white/70 mt-1">
                {stryMutAct_9fa48("29560") ? metrics.byDepartment.find(d => d.accuracy >= 75).department : (stryCov_9fa48("29560"), metrics.byDepartment.find(stryMutAct_9fa48("29561") ? () => undefined : (stryCov_9fa48("29561"), d => stryMutAct_9fa48("29565") ? d.accuracy < 75 : stryMutAct_9fa48("29564") ? d.accuracy > 75 : stryMutAct_9fa48("29563") ? false : stryMutAct_9fa48("29562") ? true : (stryCov_9fa48("29562", "29563", "29564", "29565"), d.accuracy >= 75)))?.department)} dissents have {stryMutAct_9fa48("29566") ? metrics.byDepartment.find(d => d.accuracy >= 75).accuracy : (stryCov_9fa48("29566"), metrics.byDepartment.find(stryMutAct_9fa48("29567") ? () => undefined : (stryCov_9fa48("29567"), d => stryMutAct_9fa48("29571") ? d.accuracy < 75 : stryMutAct_9fa48("29570") ? d.accuracy > 75 : stryMutAct_9fa48("29569") ? false : stryMutAct_9fa48("29568") ? true : (stryCov_9fa48("29568", "29569", "29570", "29571"), d.accuracy >= 75)))?.accuracy)}% accuracy — 
                significantly higher than organization average. Consider elevating {stryMutAct_9fa48("29572") ? metrics.byDepartment.find(d => d.accuracy >= 75).department : (stryCov_9fa48("29572"), metrics.byDepartment.find(stryMutAct_9fa48("29573") ? () => undefined : (stryCov_9fa48("29573"), d => stryMutAct_9fa48("29577") ? d.accuracy < 75 : stryMutAct_9fa48("29576") ? d.accuracy > 75 : stryMutAct_9fa48("29575") ? false : stryMutAct_9fa48("29574") ? true : (stryCov_9fa48("29574", "29575", "29576", "29577"), d.accuracy >= 75)))?.department)} concerns in Council weighting.
              </p>
            </div>
          </div>
        </div>)}

      {/* Trend Chart */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="font-semibold mb-4">Dissent Trend</h3>
        <div className="h-48 flex items-end gap-2">
          {metrics.trend.map(stryMutAct_9fa48("29578") ? () => undefined : (stryCov_9fa48("29578"), (point, i) => <div key={i} className="flex-1 flex flex-col items-center gap-2">
              <div className="text-xs text-white/50">{point.accuracy}%</div>
              <div className="w-full bg-red-500/50 rounded-t" style={stryMutAct_9fa48("29579") ? {} : (stryCov_9fa48("29579"), {
            height: `${stryMutAct_9fa48("29581") ? point.count / 8 : (stryCov_9fa48("29581"), point.count * 8)}px`
          })} />
              <div className="text-xs text-white/40">{stryMutAct_9fa48("29582") ? point.date : (stryCov_9fa48("29582"), point.date.slice(5))}</div>
            </div>))}
        </div>
      </div>

      {/* Department Breakdown */}
      <div className="bg-white/5 rounded-xl border border-white/10 p-6">
        <h3 className="font-semibold mb-4">Dissent by Department</h3>
        <table className="w-full">
          <thead className="text-left text-sm text-white/50">
            <tr>
              <th className="pb-3">Department</th>
              <th className="pb-3">Dissents</th>
              <th className="pb-3">Accepted</th>
              <th className="pb-3">Accuracy</th>
              <th className="pb-3">Trend</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {metrics.byDepartment.map(stryMutAct_9fa48("29583") ? () => undefined : (stryCov_9fa48("29583"), dept => <tr key={dept.department}>
                <td className="py-3 font-medium">{dept.department}</td>
                <td className="py-3">{dept.totalDissents}</td>
                <td className="py-3">{dept.acceptedRate}%</td>
                <td className="py-3">
                  <span className={(stryMutAct_9fa48("29587") ? dept.accuracy < 70 : stryMutAct_9fa48("29586") ? dept.accuracy > 70 : stryMutAct_9fa48("29585") ? false : stryMutAct_9fa48("29584") ? true : (stryCov_9fa48("29584", "29585", "29586", "29587"), dept.accuracy >= 70)) ? 'text-green-400' : 'text-white/70'}>
                    {dept.accuracy}%
                  </span>
                </td>
                <td className="py-3">
                  <span className={(stryMutAct_9fa48("29592") ? dept.trend !== 'up' : stryMutAct_9fa48("29591") ? false : stryMutAct_9fa48("29590") ? true : (stryCov_9fa48("29590", "29591", "29592"), dept.trend === 'up')) ? 'text-green-400' : (stryMutAct_9fa48("29597") ? dept.trend !== 'down' : stryMutAct_9fa48("29596") ? false : stryMutAct_9fa48("29595") ? true : (stryCov_9fa48("29595", "29596", "29597"), dept.trend === 'down')) ? 'text-red-400' : 'text-white/50'}>
                    {(stryMutAct_9fa48("29603") ? dept.trend !== 'up' : stryMutAct_9fa48("29602") ? false : stryMutAct_9fa48("29601") ? true : (stryCov_9fa48("29601", "29602", "29603"), dept.trend === 'up')) ? '↑' : (stryMutAct_9fa48("29608") ? dept.trend !== 'down' : stryMutAct_9fa48("29607") ? false : stryMutAct_9fa48("29606") ? true : (stryCov_9fa48("29606", "29607", "29608"), dept.trend === 'down')) ? '↓' : '→'}
                  </span>
                </td>
              </tr>))}
          </tbody>
        </table>
      </div>
    </div>;
};

// =============================================================================
// FILE DISSENT MODAL
// =============================================================================

interface FileDissentModalProps {
  onClose: () => void;
  onSubmit: (data: any) => Promise<void>;
}
const FileDissentModal: React.FC<FileDissentModalProps> = ({
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState(stryMutAct_9fa48("29613") ? {} : (stryCov_9fa48("29613"), {
    decisionId: '',
    decisionTitle: '',
    decisionOwner: '',
    dissentType: 'ethical' as DissentType,
    severity: 'formal_objection' as DissentSeverity,
    statement: '',
    isAnonymous: stryMutAct_9fa48("29618") ? true : (stryCov_9fa48("29618"), false)
  }));
  const [isSubmitting, setIsSubmitting] = useState(stryMutAct_9fa48("29619") ? true : (stryCov_9fa48("29619"), false));
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (stryMutAct_9fa48("29623") ? false : stryMutAct_9fa48("29622") ? true : stryMutAct_9fa48("29621") ? formData.statement.trim() : (stryCov_9fa48("29621", "29622", "29623"), !(stryMutAct_9fa48("29624") ? formData.statement : (stryCov_9fa48("29624"), formData.statement.trim())))) return;
    setIsSubmitting(stryMutAct_9fa48("29625") ? false : (stryCov_9fa48("29625"), true));
    try {
      await onSubmit(stryMutAct_9fa48("29627") ? {} : (stryCov_9fa48("29627"), {
        ...formData,
        dissenterId: 'current-user',
        dissenterName: formData.isAnonymous ? 'Anonymous Stakeholder' : 'Current User',
        dissenterRole: 'Team Member',
        dissenterDepartment: 'Engineering'
      }));
    } finally {
      setIsSubmitting(stryMutAct_9fa48("29634") ? true : (stryCov_9fa48("29634"), false));
    }
  };
  return <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <span>🛑</span> Register Formal Dissent
            </h2>
            <button onClick={onClose} className="text-white/50 hover:text-white">
              ✕
            </button>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Decision Info */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Decision Title</label>
            <input type="text" value={formData.decisionTitle} onChange={stryMutAct_9fa48("29635") ? () => undefined : (stryCov_9fa48("29635"), e => setFormData(stryMutAct_9fa48("29636") ? {} : (stryCov_9fa48("29636"), {
            ...formData,
            decisionTitle: e.target.value
          })))} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g., Q1 Product Roadmap" required />
          </div>
          
          {/* Dissent Type */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Dissent Type</label>
            <div className="grid grid-cols-2 gap-2">
              {(['factual', 'risk', 'ethical', 'process', 'strategic', 'resource'] as DissentType[]).map(stryMutAct_9fa48("29637") ? () => undefined : (stryCov_9fa48("29637"), type => <label key={type} className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${(stryMutAct_9fa48("29641") ? formData.dissentType !== type : stryMutAct_9fa48("29640") ? false : stryMutAct_9fa48("29639") ? true : (stryCov_9fa48("29639", "29640", "29641"), formData.dissentType === type)) ? 'bg-red-500/20 border-red-500' : 'bg-black/20 border-white/10'} border`}>
                  <input type="radio" name="dissentType" value={type} checked={stryMutAct_9fa48("29646") ? formData.dissentType !== type : stryMutAct_9fa48("29645") ? false : stryMutAct_9fa48("29644") ? true : (stryCov_9fa48("29644", "29645", "29646"), formData.dissentType === type)} onChange={stryMutAct_9fa48("29647") ? () => undefined : (stryCov_9fa48("29647"), () => setFormData(stryMutAct_9fa48("29648") ? {} : (stryCov_9fa48("29648"), {
                ...formData,
                dissentType: type
              })))} className="sr-only" />
                  <span className="text-sm">{getDissentTypeLabel(type)}</span>
                </label>))}
            </div>
          </div>
          
          {/* Statement */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Your Statement</label>
            <textarea value={formData.statement} onChange={stryMutAct_9fa48("29649") ? () => undefined : (stryCov_9fa48("29649"), e => setFormData(stryMutAct_9fa48("29650") ? {} : (stryCov_9fa48("29650"), {
            ...formData,
            statement: e.target.value
          })))} rows={6} className="w-full bg-black/20 border border-white/10 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="Explain your objection clearly..." required />
          </div>
          
          {/* Severity */}
          <div>
            <label className="block text-sm text-white/60 mb-2">Severity</label>
            <div className="space-y-2">
              {(stryMutAct_9fa48("29651") ? [] : (stryCov_9fa48("29651"), [stryMutAct_9fa48("29652") ? {} : (stryCov_9fa48("29652"), {
              value: 'advisory',
              label: 'Advisory (for the record)'
            }), stryMutAct_9fa48("29655") ? {} : (stryCov_9fa48("29655"), {
              value: 'formal_objection',
              label: 'Formal objection (requires response)'
            }), stryMutAct_9fa48("29658") ? {} : (stryCov_9fa48("29658"), {
              value: 'blocking',
              label: 'Blocking (request decision halt pending review)'
            })])).map(stryMutAct_9fa48("29661") ? () => undefined : (stryCov_9fa48("29661"), option => <label key={option.value} className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${(stryMutAct_9fa48("29665") ? formData.severity !== option.value : stryMutAct_9fa48("29664") ? false : stryMutAct_9fa48("29663") ? true : (stryCov_9fa48("29663", "29664", "29665"), formData.severity === option.value)) ? 'bg-red-500/20 border-red-500' : 'bg-black/20 border-white/10'} border`}>
                  <input type="radio" name="severity" value={option.value} checked={stryMutAct_9fa48("29670") ? formData.severity !== option.value : stryMutAct_9fa48("29669") ? false : stryMutAct_9fa48("29668") ? true : (stryCov_9fa48("29668", "29669", "29670"), formData.severity === option.value)} onChange={stryMutAct_9fa48("29671") ? () => undefined : (stryCov_9fa48("29671"), () => setFormData(stryMutAct_9fa48("29672") ? {} : (stryCov_9fa48("29672"), {
                ...formData,
                severity: option.value as DissentSeverity
              })))} className="sr-only" />
                  <span className="text-sm">{option.label}</span>
                </label>))}
            </div>
          </div>
          
          {/* Anonymous Option */}
          <label className="flex items-center gap-3 p-3 bg-black/20 rounded-lg cursor-pointer">
            <input type="checkbox" checked={formData.isAnonymous} onChange={stryMutAct_9fa48("29673") ? () => undefined : (stryCov_9fa48("29673"), e => setFormData(stryMutAct_9fa48("29674") ? {} : (stryCov_9fa48("29674"), {
            ...formData,
            isAnonymous: e.target.checked
          })))} className="rounded" />
            <div>
              <div className="font-medium">Submit Anonymously</div>
              <div className="text-xs text-white/50">Your identity will be encrypted and protected</div>
            </div>
          </label>
          
          {/* Warning */}
          <div className="text-sm text-white/40 border-t border-white/10 pt-4">
            ⚠️ By submitting, you confirm:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>This dissent will be permanently recorded</li>
              <li>Decision owner will be notified</li>
              <li>You are protected from retaliation</li>
            </ul>
          </div>
          
          {/* Actions */}
          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-white/10 hover:bg-white/20 rounded-lg font-medium transition-colors">
              Cancel
            </button>
            <button type="submit" disabled={stryMutAct_9fa48("29677") ? !formData.statement.trim() && isSubmitting : stryMutAct_9fa48("29676") ? false : stryMutAct_9fa48("29675") ? true : (stryCov_9fa48("29675", "29676", "29677"), (stryMutAct_9fa48("29678") ? formData.statement.trim() : (stryCov_9fa48("29678"), !(stryMutAct_9fa48("29679") ? formData.statement : (stryCov_9fa48("29679"), formData.statement.trim())))) || isSubmitting)} className="flex-1 px-4 py-3 bg-red-600 hover:bg-red-700 disabled:bg-white/10 disabled:cursor-not-allowed rounded-lg font-medium transition-colors">
              {isSubmitting ? 'Submitting...' : 'Submit Formal Dissent'}
            </button>
          </div>
        </form>
      </div>
    </div>;
};
export default DissentPage;