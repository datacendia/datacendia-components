// @ts-nocheck
// =============================================================================
// COUNCIL MODE ANALYTICS DASHBOARD - Admin Analytics Page
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
import React, { useState, useMemo } from 'react';
import { BarChart3, TrendingUp, Clock, Users, Target, Calendar, ChevronDown, Download, RefreshCw } from 'lucide-react';
import { cn } from '../../../lib/utils';
import { COUNCIL_MODES } from '../../data/councilModes';

// Analytics data (would come from real API)
const MOCK_ANALYTICS = stryMutAct_9fa48("18138") ? {} : (stryCov_9fa48("18138"), {
  summary: stryMutAct_9fa48("18139") ? {} : (stryCov_9fa48("18139"), {
    totalDeliberations: 1247,
    totalDecisions: 892,
    avgTimeToDecision: '4.2 min',
    avgConfidence: 78,
    periodStart: '2024-10-01',
    periodEnd: '2024-10-31'
  }),
  byMode: stryMutAct_9fa48("18143") ? {} : (stryCov_9fa48("18143"), {
    'war-room': stryMutAct_9fa48("18144") ? {} : (stryCov_9fa48("18144"), {
      count: 312,
      avgTime: '6.8 min',
      avgConfidence: 82,
      decisionsMade: 287
    }),
    'due-diligence': stryMutAct_9fa48("18146") ? {} : (stryCov_9fa48("18146"), {
      count: 156,
      avgTime: '12.4 min',
      avgConfidence: 71,
      decisionsMade: 89
    }),
    'innovation-lab': stryMutAct_9fa48("18148") ? {} : (stryCov_9fa48("18148"), {
      count: 189,
      avgTime: '5.2 min',
      avgConfidence: 65,
      decisionsMade: 45
    }),
    'compliance': stryMutAct_9fa48("18150") ? {} : (stryCov_9fa48("18150"), {
      count: 98,
      avgTime: '8.1 min',
      avgConfidence: 88,
      decisionsMade: 92
    }),
    'crisis': stryMutAct_9fa48("18152") ? {} : (stryCov_9fa48("18152"), {
      count: 23,
      avgTime: '2.1 min',
      avgConfidence: 91,
      decisionsMade: 23
    }),
    'execution': stryMutAct_9fa48("18154") ? {} : (stryCov_9fa48("18154"), {
      count: 201,
      avgTime: '7.3 min',
      avgConfidence: 85,
      decisionsMade: 198
    }),
    'research': stryMutAct_9fa48("18156") ? {} : (stryCov_9fa48("18156"), {
      count: 134,
      avgTime: '9.6 min',
      avgConfidence: 74,
      decisionsMade: 67
    }),
    'investment': stryMutAct_9fa48("18158") ? {} : (stryCov_9fa48("18158"), {
      count: 89,
      avgTime: '5.8 min',
      avgConfidence: 79,
      decisionsMade: 82
    }),
    'stakeholder': stryMutAct_9fa48("18160") ? {} : (stryCov_9fa48("18160"), {
      count: 67,
      avgTime: '6.4 min',
      avgConfidence: 76,
      decisionsMade: 61
    }),
    'rapid': stryMutAct_9fa48("18162") ? {} : (stryCov_9fa48("18162"), {
      count: 245,
      avgTime: '0.8 min',
      avgConfidence: 72,
      decisionsMade: 241
    }),
    'advisory': stryMutAct_9fa48("18164") ? {} : (stryCov_9fa48("18164"), {
      count: 78,
      avgTime: '4.5 min',
      avgConfidence: 70,
      decisionsMade: 32
    }),
    'governance': stryMutAct_9fa48("18166") ? {} : (stryCov_9fa48("18166"), {
      count: 45,
      avgTime: '11.2 min',
      avgConfidence: 84,
      decisionsMade: 42
    })
  }),
  topUsers: stryMutAct_9fa48("18168") ? [] : (stryCov_9fa48("18168"), [stryMutAct_9fa48("18169") ? {} : (stryCov_9fa48("18169"), {
    name: 'Strategy Team',
    deliberations: 342,
    avgConfidence: 81
  }), stryMutAct_9fa48("18171") ? {} : (stryCov_9fa48("18171"), {
    name: 'Product Team',
    deliberations: 289,
    avgConfidence: 76
  }), stryMutAct_9fa48("18173") ? {} : (stryCov_9fa48("18173"), {
    name: 'Finance Team',
    deliberations: 201,
    avgConfidence: 84
  }), stryMutAct_9fa48("18175") ? {} : (stryCov_9fa48("18175"), {
    name: 'Engineering',
    deliberations: 178,
    avgConfidence: 79
  }), stryMutAct_9fa48("18177") ? {} : (stryCov_9fa48("18177"), {
    name: 'Executive Office',
    deliberations: 156,
    avgConfidence: 88
  })]),
  recentActivity: stryMutAct_9fa48("18179") ? [] : (stryCov_9fa48("18179"), [stryMutAct_9fa48("18180") ? {} : (stryCov_9fa48("18180"), {
    mode: 'war-room',
    query: 'Market expansion strategy Q1',
    confidence: 85,
    time: '2 min ago'
  }), stryMutAct_9fa48("18184") ? {} : (stryCov_9fa48("18184"), {
    mode: 'execution',
    query: 'Product launch timeline',
    confidence: 92,
    time: '15 min ago'
  }), stryMutAct_9fa48("18188") ? {} : (stryCov_9fa48("18188"), {
    mode: 'compliance',
    query: 'GDPR data retention review',
    confidence: 88,
    time: '1 hr ago'
  }), stryMutAct_9fa48("18192") ? {} : (stryCov_9fa48("18192"), {
    mode: 'investment',
    query: 'New tool purchase evaluation',
    confidence: 76,
    time: '2 hrs ago'
  })])
});
export default function ModeAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);
  const sortedModes = useMemo(() => {
    return stryMutAct_9fa48("18199") ? Object.entries(MOCK_ANALYTICS.byMode).map(([id, data]) => ({
      id,
      ...data,
      mode: COUNCIL_MODES[id]
    })) : (stryCov_9fa48("18199"), Object.entries(MOCK_ANALYTICS.byMode).map(stryMutAct_9fa48("18200") ? () => undefined : (stryCov_9fa48("18200"), ([id, data]) => stryMutAct_9fa48("18201") ? {} : (stryCov_9fa48("18201"), {
      id,
      ...data,
      mode: COUNCIL_MODES[id]
    }))).sort(stryMutAct_9fa48("18202") ? () => undefined : (stryCov_9fa48("18202"), (a, b) => stryMutAct_9fa48("18203") ? b.count + a.count : (stryCov_9fa48("18203"), b.count - a.count))));
  }, stryMutAct_9fa48("18204") ? ["Stryker was here"] : (stryCov_9fa48("18204"), []));
  const maxCount = stryMutAct_9fa48("18205") ? Math.min(...sortedModes.map(m => m.count)) : (stryCov_9fa48("18205"), Math.max(...sortedModes.map(stryMutAct_9fa48("18206") ? () => undefined : (stryCov_9fa48("18206"), m => m.count))));
  return <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Council Mode Analytics</h1>
          <p className="text-gray-400">Track usage patterns and decision effectiveness</p>
        </div>
        <div className="flex items-center gap-3">
          <select value={selectedPeriod} onChange={stryMutAct_9fa48("18207") ? () => undefined : (stryCov_9fa48("18207"), e => setSelectedPeriod(e.target.value))} className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white">
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white">
            <Download className="w-4 h-4" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4">
        {(stryMutAct_9fa48("18208") ? [] : (stryCov_9fa48("18208"), [stryMutAct_9fa48("18209") ? {} : (stryCov_9fa48("18209"), {
        label: 'Total Deliberations',
        value: MOCK_ANALYTICS.summary.totalDeliberations.toLocaleString(),
        icon: BarChart3,
        color: 'text-blue-400'
      }), stryMutAct_9fa48("18212") ? {} : (stryCov_9fa48("18212"), {
        label: 'Decisions Made',
        value: MOCK_ANALYTICS.summary.totalDecisions.toLocaleString(),
        icon: Target,
        color: 'text-emerald-400'
      }), stryMutAct_9fa48("18215") ? {} : (stryCov_9fa48("18215"), {
        label: 'Avg Time to Decision',
        value: MOCK_ANALYTICS.summary.avgTimeToDecision,
        icon: Clock,
        color: 'text-amber-400'
      }), stryMutAct_9fa48("18218") ? {} : (stryCov_9fa48("18218"), {
        label: 'Avg Confidence',
        value: `${MOCK_ANALYTICS.summary.avgConfidence}%`,
        icon: TrendingUp,
        color: 'text-purple-400'
      })])).map(stryMutAct_9fa48("18222") ? () => undefined : (stryCov_9fa48("18222"), (stat, i) => <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <stat.icon className={cn("w-5 h-5", stat.color)} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Mode Usage Chart */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mode Usage Distribution</h3>
          <div className="space-y-3">
            {sortedModes.map(stryMutAct_9fa48("18224") ? () => undefined : (stryCov_9fa48("18224"), ({
            id,
            count,
            avgConfidence,
            mode
          }) => <div key={id} className={cn("flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors", (stryMutAct_9fa48("18228") ? selectedMode !== id : stryMutAct_9fa48("18227") ? false : stryMutAct_9fa48("18226") ? true : (stryCov_9fa48("18226", "18227", "18228"), selectedMode === id)) ? "bg-gray-800" : "hover:bg-gray-800/50")} onClick={stryMutAct_9fa48("18231") ? () => undefined : (stryCov_9fa48("18231"), () => setSelectedMode((stryMutAct_9fa48("18234") ? selectedMode !== id : stryMutAct_9fa48("18233") ? false : stryMutAct_9fa48("18232") ? true : (stryCov_9fa48("18232", "18233", "18234"), selectedMode === id)) ? null : id))}>
                <span className="text-2xl w-10">{stryMutAct_9fa48("18235") ? mode.emoji : (stryCov_9fa48("18235"), mode?.emoji)}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{stryMutAct_9fa48("18236") ? mode.name : (stryCov_9fa48("18236"), mode?.name)}</span>
                    <span className="text-sm text-gray-400">{count} uses</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all" style={stryMutAct_9fa48("18237") ? {} : (stryCov_9fa48("18237"), {
                  width: `${stryMutAct_9fa48("18239") ? count / maxCount / 100 : (stryCov_9fa48("18239"), (stryMutAct_9fa48("18240") ? count * maxCount : (stryCov_9fa48("18240"), count / maxCount)) * 100)}%`,
                  backgroundColor: stryMutAct_9fa48("18241") ? mode.color : (stryCov_9fa48("18241"), mode?.color)
                })} />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Confidence</div>
                  <div className={cn("font-medium", (stryMutAct_9fa48("18246") ? avgConfidence < 80 : stryMutAct_9fa48("18245") ? avgConfidence > 80 : stryMutAct_9fa48("18244") ? false : stryMutAct_9fa48("18243") ? true : (stryCov_9fa48("18243", "18244", "18245", "18246"), avgConfidence >= 80)) ? "text-emerald-400" : (stryMutAct_9fa48("18251") ? avgConfidence < 60 : stryMutAct_9fa48("18250") ? avgConfidence > 60 : stryMutAct_9fa48("18249") ? false : stryMutAct_9fa48("18248") ? true : (stryCov_9fa48("18248", "18249", "18250", "18251"), avgConfidence >= 60)) ? "text-amber-400" : "text-red-400")}>
                    {avgConfidence}%
                  </div>
                </div>
              </div>))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Teams</h3>
            <div className="space-y-3">
              {MOCK_ANALYTICS.topUsers.map(stryMutAct_9fa48("18254") ? () => undefined : (stryCov_9fa48("18254"), (user, i) => <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm font-medium">
                      {stryMutAct_9fa48("18255") ? i - 1 : (stryCov_9fa48("18255"), i + 1)}
                    </div>
                    <span className="text-white">{user.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{user.deliberations}</span>
                </div>))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {MOCK_ANALYTICS.recentActivity.map((activity, i) => {
              const mode = COUNCIL_MODES[activity.mode];
              return <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-lg">{stryMutAct_9fa48("18257") ? mode.emoji : (stryCov_9fa48("18257"), mode?.emoji)}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{activity.query}</div>
                      <div className="text-gray-500">{activity.time}</div>
                    </div>
                    <span className={cn("text-xs px-2 py-0.5 rounded-full", (stryMutAct_9fa48("18262") ? activity.confidence < 80 : stryMutAct_9fa48("18261") ? activity.confidence > 80 : stryMutAct_9fa48("18260") ? false : stryMutAct_9fa48("18259") ? true : (stryCov_9fa48("18259", "18260", "18261", "18262"), activity.confidence >= 80)) ? "bg-emerald-500/20 text-emerald-400" : "bg-amber-500/20 text-amber-400")}>
                      {activity.confidence}%
                    </span>
                  </div>;
            })}
            </div>
          </div>
        </div>
      </div>
    </div>;
}