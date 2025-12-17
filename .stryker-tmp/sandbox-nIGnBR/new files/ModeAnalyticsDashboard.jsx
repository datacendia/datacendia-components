// @ts-nocheck
import React, { useState, useMemo } from 'react';

/**
 * Council Mode Analytics Dashboard
 * Tracks usage patterns, decision outcomes, and mode effectiveness
 */

// Sample analytics data structure
const SAMPLE_ANALYTICS_DATA = {
  summary: {
    totalDeliberations: 1247,
    totalDecisions: 892,
    avgTimeToDecision: '4.2 min',
    avgConfidence: 78,
    periodStart: '2024-10-01',
    periodEnd: '2024-10-31'
  },
  byMode: {
    'war-room': { 
      count: 312, 
      avgTime: '6.8 min', 
      avgConfidence: 82, 
      decisionsMade: 287,
      topUsers: ['Strategy Team', 'Executive', 'Product'],
      topQueries: ['Market expansion', 'Pricing strategy', 'Competitive response']
    },
    'due-diligence': { 
      count: 156, 
      avgTime: '12.4 min', 
      avgConfidence: 71, 
      decisionsMade: 89,
      topUsers: ['M&A Team', 'Legal', 'Finance'],
      topQueries: ['Acquisition targets', 'Vendor evaluation', 'Partnership review']
    },
    'innovation-lab': { 
      count: 189, 
      avgTime: '5.2 min', 
      avgConfidence: 65, 
      decisionsMade: 45,
      topUsers: ['Product', 'Engineering', 'Design'],
      topQueries: ['New features', 'Process improvement', 'Market opportunities']
    },
    'compliance': { 
      count: 98, 
      avgTime: '8.1 min', 
      avgConfidence: 88, 
      decisionsMade: 92,
      topUsers: ['Legal', 'Security', 'HR'],
      topQueries: ['GDPR compliance', 'Policy review', 'Audit prep']
    },
    'crisis': { 
      count: 23, 
      avgTime: '2.1 min', 
      avgConfidence: 91, 
      decisionsMade: 23,
      topUsers: ['Executive', 'Security', 'Communications'],
      topQueries: ['Security incident', 'PR response', 'Customer escalation']
    },
    'execution': { 
      count: 201, 
      avgTime: '7.3 min', 
      avgConfidence: 85, 
      decisionsMade: 198,
      topUsers: ['Product', 'Engineering', 'Operations'],
      topQueries: ['Launch planning', 'Sprint planning', 'Resource allocation']
    },
    'research': { 
      count: 134, 
      avgTime: '9.6 min', 
      avgConfidence: 74, 
      decisionsMade: 67,
      topUsers: ['Data Team', 'Marketing', 'Product'],
      topQueries: ['Market analysis', 'Customer insights', 'Performance review']
    },
    'investment': { 
      count: 89, 
      avgTime: '5.8 min', 
      avgConfidence: 79, 
      decisionsMade: 82,
      topUsers: ['Finance', 'Executive', 'HR'],
      topQueries: ['Budget approval', 'Headcount', 'Tool purchase']
    },
    'stakeholder': { 
      count: 67, 
      avgTime: '6.4 min', 
      avgConfidence: 76, 
      decisionsMade: 61,
      topUsers: ['HR', 'Executive', 'Communications'],
      topQueries: ['Reorg planning', 'Change management', 'Announcement strategy']
    },
    'rapid': { 
      count: 245, 
      avgTime: '0.8 min', 
      avgConfidence: 72, 
      decisionsMade: 241,
      topUsers: ['Everyone'],
      topQueries: ['Quick approvals', 'Sanity checks', 'Simple decisions']
    },
    'advisory': { 
      count: 78, 
      avgTime: '4.5 min', 
      avgConfidence: 69, 
      decisionsMade: 12,
      topUsers: ['New Employees', 'Managers', 'Product'],
      topQueries: ['Process questions', 'Best practices', 'Framework guidance']
    },
    'governance': { 
      count: 45, 
      avgTime: '11.2 min', 
      avgConfidence: 84, 
      decisionsMade: 43,
      topUsers: ['Legal', 'Executive', 'HR'],
      topQueries: ['Policy creation', 'Exception requests', 'Standard setting']
    }
  },
  trends: {
    daily: [
      { date: '2024-10-25', deliberations: 42, decisions: 31 },
      { date: '2024-10-26', deliberations: 38, decisions: 28 },
      { date: '2024-10-27', deliberations: 15, decisions: 12 },
      { date: '2024-10-28', deliberations: 52, decisions: 41 },
      { date: '2024-10-29', deliberations: 67, decisions: 52 },
      { date: '2024-10-30', deliberations: 71, decisions: 58 },
      { date: '2024-10-31', deliberations: 48, decisions: 39 }
    ],
    weekly: [
      { week: 'W40', deliberations: 287, decisions: 212 },
      { week: 'W41', deliberations: 312, decisions: 234 },
      { week: 'W42', deliberations: 298, decisions: 221 },
      { week: 'W43', deliberations: 350, decisions: 275 }
    ]
  },
  recentDeliberations: [
    { id: 1, query: 'Should we expand into APAC market?', mode: 'war-room', time: '8.2 min', confidence: 85, decision: 'Approved with conditions', timestamp: '2024-10-31T14:23:00Z' },
    { id: 2, query: 'Q4 budget reallocation request', mode: 'investment', time: '4.1 min', confidence: 92, decision: 'Approved', timestamp: '2024-10-31T13:45:00Z' },
    { id: 3, query: 'New feature prioritization', mode: 'execution', time: '6.7 min', confidence: 78, decision: 'Prioritized for Sprint 24', timestamp: '2024-10-31T11:30:00Z' },
    { id: 4, query: 'Vendor security assessment', mode: 'compliance', time: '9.3 min', confidence: 71, decision: 'Requires additional review', timestamp: '2024-10-31T10:15:00Z' },
    { id: 5, query: 'Creative campaign ideas', mode: 'innovation-lab', time: '5.5 min', confidence: 67, decision: '12 ideas generated', timestamp: '2024-10-30T16:45:00Z' }
  ]
};

// Mode metadata
const MODE_META = {
  'war-room': { name: 'War Room', emoji: '⚔️', color: '#EF4444' },
  'due-diligence': { name: 'Due Diligence', emoji: '🔍', color: '#0F172A' },
  'innovation-lab': { name: 'Innovation Lab', emoji: '💡', color: '#10B981' },
  'compliance': { name: 'Compliance', emoji: '🛡️', color: '#F59E0B' },
  'crisis': { name: 'Crisis', emoji: '🚨', color: '#EF4444' },
  'execution': { name: 'Execution', emoji: '🎯', color: '#2563EB' },
  'research': { name: 'Research', emoji: '🔬', color: '#8B5CF6' },
  'investment': { name: 'Investment', emoji: '💰', color: '#10B981' },
  'stakeholder': { name: 'Stakeholder', emoji: '🤝', color: '#3B82F6' },
  'rapid': { name: 'Rapid', emoji: '⚡', color: '#F59E0B' },
  'advisory': { name: 'Advisory', emoji: '🎓', color: '#8B5CF6' },
  'governance': { name: 'Governance', emoji: '🏛️', color: '#0F172A' }
};

// Stat Card Component
function StatCard({ label, value, subvalue, trend, icon }) {
  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-2">
        <span className="text-slate-400 text-sm">{label}</span>
        {icon && <span className="text-2xl">{icon}</span>}
      </div>
      <div className="text-2xl font-bold text-white">{value}</div>
      {subvalue && <div className="text-sm text-slate-500">{subvalue}</div>}
      {trend && (
        <div className={`text-xs mt-1 ${trend > 0 ? 'text-green-400' : 'text-red-400'}`}>
          {trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs last period
        </div>
      )}
    </div>
  );
}

// Mode Usage Bar Chart
function ModeUsageChart({ data }) {
  const maxCount = Math.max(...Object.values(data).map(d => d.count));
  const sortedModes = Object.entries(data).sort((a, b) => b[1].count - a[1].count);

  return (
    <div className="space-y-3">
      {sortedModes.map(([modeId, stats]) => {
        const meta = MODE_META[modeId];
        const percentage = (stats.count / maxCount) * 100;
        return (
          <div key={modeId} className="group">
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span>{meta.emoji}</span>
                <span className="text-sm text-white">{meta.name}</span>
              </div>
              <span className="text-sm text-slate-400">{stats.count}</span>
            </div>
            <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
              <div 
                className="h-full rounded-full transition-all group-hover:opacity-80"
                style={{ 
                  width: `${percentage}%`, 
                  backgroundColor: meta.color 
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Mini Trend Chart
function MiniTrendChart({ data, height = 60 }) {
  const maxVal = Math.max(...data.map(d => d.deliberations));
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (d.deliberations / maxVal) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox="0 0 100 100" className="w-full" style={{ height }} preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke="#3B82F6"
        strokeWidth="2"
        vectorEffect="non-scaling-stroke"
      />
      {data.map((d, i) => {
        const x = (i / (data.length - 1)) * 100;
        const y = 100 - (d.deliberations / maxVal) * 100;
        return (
          <circle
            key={i}
            cx={x}
            cy={y}
            r="3"
            fill="#3B82F6"
            className="hover:r-4"
          />
        );
      })}
    </svg>
  );
}

// Mode Detail Card
function ModeDetailCard({ modeId, stats, onClick }) {
  const meta = MODE_META[modeId];
  const decisionRate = ((stats.decisionsMade / stats.count) * 100).toFixed(0);

  return (
    <button
      onClick={() => onClick(modeId)}
      className="w-full p-4 bg-slate-800 rounded-lg border border-slate-700 hover:border-slate-600 transition-colors text-left"
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-2xl">{meta.emoji}</span>
          <span className="font-semibold text-white">{meta.name}</span>
        </div>
        <span 
          className="px-2 py-1 rounded text-xs font-medium"
          style={{ backgroundColor: `${meta.color}20`, color: meta.color }}
        >
          {stats.count} uses
        </span>
      </div>
      
      <div className="grid grid-cols-3 gap-4 text-center">
        <div>
          <div className="text-lg font-bold text-white">{stats.avgTime}</div>
          <div className="text-xs text-slate-500">Avg Time</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">{stats.avgConfidence}%</div>
          <div className="text-xs text-slate-500">Confidence</div>
        </div>
        <div>
          <div className="text-lg font-bold text-white">{decisionRate}%</div>
          <div className="text-xs text-slate-500">Decision Rate</div>
        </div>
      </div>
    </button>
  );
}

// Recent Deliberations Table
function RecentDeliberationsTable({ deliberations }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="text-left text-xs text-slate-500 border-b border-slate-700">
            <th className="pb-2 font-medium">Query</th>
            <th className="pb-2 font-medium">Mode</th>
            <th className="pb-2 font-medium">Time</th>
            <th className="pb-2 font-medium">Confidence</th>
            <th className="pb-2 font-medium">Decision</th>
          </tr>
        </thead>
        <tbody>
          {deliberations.map(d => {
            const meta = MODE_META[d.mode];
            return (
              <tr key={d.id} className="border-b border-slate-800 hover:bg-slate-800/50">
                <td className="py-3 text-sm text-white max-w-xs truncate">{d.query}</td>
                <td className="py-3">
                  <span className="flex items-center gap-1 text-sm">
                    <span>{meta.emoji}</span>
                    <span className="text-slate-400">{meta.name}</span>
                  </span>
                </td>
                <td className="py-3 text-sm text-slate-400">{d.time}</td>
                <td className="py-3">
                  <span className={`text-sm font-medium ${
                    d.confidence >= 80 ? 'text-green-400' : 
                    d.confidence >= 60 ? 'text-yellow-400' : 'text-red-400'
                  }`}>
                    {d.confidence}%
                  </span>
                </td>
                <td className="py-3 text-sm text-slate-300 max-w-xs truncate">{d.decision}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

// Mode Detail Modal
function ModeDetailModal({ modeId, stats, onClose }) {
  const meta = MODE_META[modeId];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-slate-900 rounded-xl border border-slate-800 w-full max-w-2xl max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{meta.emoji}</span>
            <div>
              <h2 className="text-xl font-bold text-white">{meta.name} Mode</h2>
              <p className="text-sm text-slate-400">{stats.count} deliberations this period</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-4">
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.count}</div>
              <div className="text-xs text-slate-500">Total Uses</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.avgTime}</div>
              <div className="text-xs text-slate-500">Avg Time</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.avgConfidence}%</div>
              <div className="text-xs text-slate-500">Avg Confidence</div>
            </div>
            <div className="text-center p-3 bg-slate-800 rounded-lg">
              <div className="text-2xl font-bold text-white">{stats.decisionsMade}</div>
              <div className="text-xs text-slate-500">Decisions Made</div>
            </div>
          </div>

          {/* Top Users */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Top Users</h3>
            <div className="flex flex-wrap gap-2">
              {stats.topUsers.map(user => (
                <span key={user} className="px-3 py-1 bg-slate-800 rounded-full text-sm text-slate-300">
                  {user}
                </span>
              ))}
            </div>
          </div>

          {/* Common Queries */}
          <div>
            <h3 className="text-sm font-semibold text-slate-300 mb-2">Common Query Types</h3>
            <ul className="space-y-2">
              {stats.topQueries.map((query, i) => (
                <li key={i} className="flex items-center gap-2 text-sm text-slate-400">
                  <span className="text-slate-600">{i + 1}.</span>
                  {query}
                </li>
              ))}
            </ul>
          </div>

          {/* Recommendations */}
          <div className="p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg">
            <h3 className="text-sm font-semibold text-blue-400 mb-2">💡 Insights</h3>
            <ul className="text-sm text-slate-300 space-y-1">
              {stats.avgConfidence >= 80 && (
                <li>• High confidence mode - users trust the outputs</li>
              )}
              {stats.avgConfidence < 70 && (
                <li>• Consider reviewing prompts to improve confidence</li>
              )}
              {stats.decisionsMade / stats.count < 0.5 && (
                <li>• Low decision rate - often used for exploration rather than decisions</li>
              )}
              {stats.decisionsMade / stats.count >= 0.9 && (
                <li>• High decision rate - effective for driving action</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Dashboard Component
export function ModeAnalyticsDashboard({ data = SAMPLE_ANALYTICS_DATA }) {
  const [timeRange, setTimeRange] = useState('month');
  const [selectedMode, setSelectedMode] = useState(null);

  // Calculate top mode
  const topMode = useMemo(() => {
    const entries = Object.entries(data.byMode);
    return entries.reduce((max, curr) => curr[1].count > max[1].count ? curr : max);
  }, [data.byMode]);

  // Calculate average confidence across all modes
  const avgConfidence = useMemo(() => {
    const modes = Object.values(data.byMode);
    const total = modes.reduce((sum, m) => sum + m.avgConfidence * m.count, 0);
    const count = modes.reduce((sum, m) => sum + m.count, 0);
    return (total / count).toFixed(0);
  }, [data.byMode]);

  return (
    <div className="min-h-screen bg-slate-950 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Council Mode Analytics</h1>
            <p className="text-slate-400 text-sm">
              {data.summary.periodStart} to {data.summary.periodEnd}
            </p>
          </div>
          <div className="flex gap-2">
            {['week', 'month', 'quarter'].map(range => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  timeRange === range 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                {range.charAt(0).toUpperCase() + range.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatCard 
            label="Total Deliberations" 
            value={data.summary.totalDeliberations.toLocaleString()} 
            trend={12}
            icon="🏛️"
          />
          <StatCard 
            label="Decisions Made" 
            value={data.summary.totalDecisions.toLocaleString()}
            subvalue={`${((data.summary.totalDecisions / data.summary.totalDeliberations) * 100).toFixed(0)}% decision rate`}
            icon="✅"
          />
          <StatCard 
            label="Avg Time to Decision" 
            value={data.summary.avgTimeToDecision}
            trend={-8}
            icon="⏱️"
          />
          <StatCard 
            label="Avg Confidence" 
            value={`${avgConfidence}%`}
            trend={3}
            icon="📊"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mode Usage Chart */}
          <div className="lg:col-span-2 bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Mode Usage</h2>
            <ModeUsageChart data={data.byMode} />
          </div>

          {/* Top Mode Highlight */}
          <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Most Used Mode</h2>
            <div 
              className="p-4 rounded-lg border-2 text-center"
              style={{ borderColor: MODE_META[topMode[0]].color, backgroundColor: `${MODE_META[topMode[0]].color}10` }}
            >
              <span className="text-4xl">{MODE_META[topMode[0]].emoji}</span>
              <h3 className="text-xl font-bold text-white mt-2">{MODE_META[topMode[0]].name}</h3>
              <p className="text-3xl font-bold mt-2" style={{ color: MODE_META[topMode[0]].color }}>
                {topMode[1].count}
              </p>
              <p className="text-sm text-slate-500">deliberations</p>
            </div>

            {/* Trend */}
            <div className="mt-4">
              <h3 className="text-sm text-slate-400 mb-2">Weekly Trend</h3>
              <MiniTrendChart data={data.trends.daily} />
            </div>
          </div>
        </div>

        {/* Mode Grid */}
        <div>
          <h2 className="text-lg font-semibold text-white mb-4">Mode Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(data.byMode).map(([modeId, stats]) => (
              <ModeDetailCard 
                key={modeId}
                modeId={modeId}
                stats={stats}
                onClick={setSelectedMode}
              />
            ))}
          </div>
        </div>

        {/* Recent Deliberations */}
        <div className="bg-slate-900 rounded-xl border border-slate-800 p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Recent Deliberations</h2>
          <RecentDeliberationsTable deliberations={data.recentDeliberations} />
        </div>

        {/* Mode Detail Modal */}
        {selectedMode && (
          <ModeDetailModal 
            modeId={selectedMode}
            stats={data.byMode[selectedMode]}
            onClose={() => setSelectedMode(null)}
          />
        )}
      </div>
    </div>
  );
}

// Analytics data types for TypeScript
export const AnalyticsDataShape = {
  summary: {
    totalDeliberations: 'number',
    totalDecisions: 'number',
    avgTimeToDecision: 'string',
    avgConfidence: 'number',
    periodStart: 'string (ISO date)',
    periodEnd: 'string (ISO date)'
  },
  byMode: {
    '[modeId]': {
      count: 'number',
      avgTime: 'string',
      avgConfidence: 'number',
      decisionsMade: 'number',
      topUsers: 'string[]',
      topQueries: 'string[]'
    }
  },
  trends: {
    daily: '[{ date, deliberations, decisions }]',
    weekly: '[{ week, deliberations, decisions }]'
  },
  recentDeliberations: '[{ id, query, mode, time, confidence, decision, timestamp }]'
};

export default ModeAnalyticsDashboard;
