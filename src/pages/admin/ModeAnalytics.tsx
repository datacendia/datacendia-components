// =============================================================================
// COUNCIL MODE ANALYTICS DASHBOARD - Admin Analytics Page
// =============================================================================

import React, { useState, useMemo } from 'react';
import {
  BarChart3,
  TrendingUp,
  Clock,
  Users,
  Target,
  Calendar,
  ChevronDown,
  Download,
  RefreshCw,
} from 'lucide-react';
import { cn } from '../../../lib/utils';
import { COUNCIL_MODES } from '../../data/councilModes';

// Analytics data (would come from real API)
const MOCK_ANALYTICS = {
  summary: {
    totalDeliberations: 1247,
    totalDecisions: 892,
    avgTimeToDecision: '4.2 min',
    avgConfidence: 78,
    periodStart: '2024-10-01',
    periodEnd: '2024-10-31',
  },
  byMode: {
    'war-room': { count: 312, avgTime: '6.8 min', avgConfidence: 82, decisionsMade: 287 },
    'due-diligence': { count: 156, avgTime: '12.4 min', avgConfidence: 71, decisionsMade: 89 },
    'innovation-lab': { count: 189, avgTime: '5.2 min', avgConfidence: 65, decisionsMade: 45 },
    compliance: { count: 98, avgTime: '8.1 min', avgConfidence: 88, decisionsMade: 92 },
    crisis: { count: 23, avgTime: '2.1 min', avgConfidence: 91, decisionsMade: 23 },
    execution: { count: 201, avgTime: '7.3 min', avgConfidence: 85, decisionsMade: 198 },
    research: { count: 134, avgTime: '9.6 min', avgConfidence: 74, decisionsMade: 67 },
    investment: { count: 89, avgTime: '5.8 min', avgConfidence: 79, decisionsMade: 82 },
    stakeholder: { count: 67, avgTime: '6.4 min', avgConfidence: 76, decisionsMade: 61 },
    rapid: { count: 245, avgTime: '0.8 min', avgConfidence: 72, decisionsMade: 241 },
    advisory: { count: 78, avgTime: '4.5 min', avgConfidence: 70, decisionsMade: 32 },
    governance: { count: 45, avgTime: '11.2 min', avgConfidence: 84, decisionsMade: 42 },
  },
  topUsers: [
    { name: 'Strategy Team', deliberations: 342, avgConfidence: 81 },
    { name: 'Product Team', deliberations: 289, avgConfidence: 76 },
    { name: 'Finance Team', deliberations: 201, avgConfidence: 84 },
    { name: 'Engineering', deliberations: 178, avgConfidence: 79 },
    { name: 'Executive Office', deliberations: 156, avgConfidence: 88 },
  ],
  recentActivity: [
    { mode: 'war-room', query: 'Market expansion strategy Q1', confidence: 85, time: '2 min ago' },
    { mode: 'execution', query: 'Product launch timeline', confidence: 92, time: '15 min ago' },
    { mode: 'compliance', query: 'GDPR data retention review', confidence: 88, time: '1 hr ago' },
    {
      mode: 'investment',
      query: 'New tool purchase evaluation',
      confidence: 76,
      time: '2 hrs ago',
    },
  ],
};

export default function ModeAnalytics() {
  const [selectedPeriod, setSelectedPeriod] = useState('30d');
  const [selectedMode, setSelectedMode] = useState<string | null>(null);

  const sortedModes = useMemo(() => {
    return Object.entries(MOCK_ANALYTICS.byMode)
      .map(([id, data]) => ({ id, ...data, mode: COUNCIL_MODES[id] }))
      .sort((a, b) => b.count - a.count);
  }, []);

  const maxCount = Math.max(...sortedModes.map((m) => m.count));

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Council Mode Analytics</h1>
          <p className="text-gray-400">Track usage patterns and decision effectiveness</p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-gray-800 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
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
        {[
          {
            label: 'Total Deliberations',
            value: MOCK_ANALYTICS.summary.totalDeliberations.toLocaleString(),
            icon: BarChart3,
            color: 'text-blue-400',
          },
          {
            label: 'Decisions Made',
            value: MOCK_ANALYTICS.summary.totalDecisions.toLocaleString(),
            icon: Target,
            color: 'text-emerald-400',
          },
          {
            label: 'Avg Time to Decision',
            value: MOCK_ANALYTICS.summary.avgTimeToDecision,
            icon: Clock,
            color: 'text-amber-400',
          },
          {
            label: 'Avg Confidence',
            value: `${MOCK_ANALYTICS.summary.avgConfidence}%`,
            icon: TrendingUp,
            color: 'text-purple-400',
          },
        ].map((stat, i) => (
          <div key={i} className="bg-gray-900 border border-gray-800 rounded-xl p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-gray-400 text-sm">{stat.label}</span>
              <stat.icon className={cn('w-5 h-5', stat.color)} />
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Mode Usage Chart */}
        <div className="col-span-2 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Mode Usage Distribution</h3>
          <div className="space-y-3">
            {sortedModes.map(({ id, count, avgConfidence, mode }) => (
              <div
                key={id}
                className={cn(
                  'flex items-center gap-4 p-3 rounded-lg cursor-pointer transition-colors',
                  selectedMode === id ? 'bg-gray-800' : 'hover:bg-gray-800/50'
                )}
                onClick={() => setSelectedMode(selectedMode === id ? null : id)}
              >
                <span className="text-2xl w-10">{mode?.emoji}</span>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-white">{mode?.name}</span>
                    <span className="text-sm text-gray-400">{count} uses</span>
                  </div>
                  <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${(count / maxCount) * 100}%`,
                        backgroundColor: mode?.color,
                      }}
                    />
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-gray-400">Confidence</div>
                  <div
                    className={cn(
                      'font-medium',
                      avgConfidence >= 80
                        ? 'text-emerald-400'
                        : avgConfidence >= 60
                          ? 'text-amber-400'
                          : 'text-red-400'
                    )}
                  >
                    {avgConfidence}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Top Users */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Top Teams</h3>
            <div className="space-y-3">
              {MOCK_ANALYTICS.topUsers.map((user, i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center text-gray-400 text-sm font-medium">
                      {i + 1}
                    </div>
                    <span className="text-white">{user.name}</span>
                  </div>
                  <span className="text-gray-400 text-sm">{user.deliberations}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {MOCK_ANALYTICS.recentActivity.map((activity, i) => {
                const mode = COUNCIL_MODES[activity.mode];
                return (
                  <div key={i} className="flex items-start gap-3 text-sm">
                    <span className="text-lg">{mode?.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="text-white truncate">{activity.query}</div>
                      <div className="text-gray-500">{activity.time}</div>
                    </div>
                    <span
                      className={cn(
                        'text-xs px-2 py-0.5 rounded-full',
                        activity.confidence >= 80
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-amber-500/20 text-amber-400'
                      )}
                    >
                      {activity.confidence}%
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
