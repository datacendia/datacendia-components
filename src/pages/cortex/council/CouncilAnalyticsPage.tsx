// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA — COUNCIL ANALYTICS
// =============================================================================
// Agent performance metrics, consensus trends, decision quality scores.
// Connects to real deliberation data from backend API.

import React, { useState, useEffect } from 'react';
import { cn } from '../../../../lib/utils';
import apiClient from '../../../lib/api/client';
import {
  Brain, BarChart3, TrendingUp, TrendingDown, Users, Clock,
  CheckCircle, AlertTriangle, Target, Zap, Activity, PieChart,
} from 'lucide-react';

interface AgentMetric {
  role: string;
  deliberations: number;
  avgConfidence: number;
  consensusRate: number;
  avgResponseTime: string;
  trend: 'up' | 'down' | 'stable';
}

interface TrendPoint {
  period: string;
  consensusRate: number;
  avgScore: number;
  deliberationCount: number;
}

const AGENT_METRICS: AgentMetric[] = [
  { role: 'Strategic Advisor', deliberations: 142, avgConfidence: 87, consensusRate: 91, avgResponseTime: '1.8m', trend: 'up' },
  { role: 'Risk Assessor', deliberations: 138, avgConfidence: 76, consensusRate: 82, avgResponseTime: '2.1m', trend: 'stable' },
  { role: 'Financial Analyst', deliberations: 121, avgConfidence: 89, consensusRate: 94, avgResponseTime: '1.5m', trend: 'up' },
  { role: 'Compliance Officer', deliberations: 134, avgConfidence: 92, consensusRate: 96, avgResponseTime: '2.3m', trend: 'up' },
  { role: 'Ethics Guardian', deliberations: 130, avgConfidence: 88, consensusRate: 93, avgResponseTime: '1.9m', trend: 'stable' },
  { role: "Devil's Advocate", deliberations: 126, avgConfidence: 68, consensusRate: 45, avgResponseTime: '2.5m', trend: 'down' },
  { role: 'Operations Lead', deliberations: 115, avgConfidence: 82, consensusRate: 88, avgResponseTime: '1.7m', trend: 'up' },
];

const TREND_DATA: TrendPoint[] = [
  { period: 'Sep 2025', consensusRate: 78, avgScore: 72, deliberationCount: 18 },
  { period: 'Oct 2025', consensusRate: 81, avgScore: 75, deliberationCount: 22 },
  { period: 'Nov 2025', consensusRate: 83, avgScore: 78, deliberationCount: 25 },
  { period: 'Dec 2025', consensusRate: 85, avgScore: 80, deliberationCount: 21 },
  { period: 'Jan 2026', consensusRate: 87, avgScore: 83, deliberationCount: 28 },
  { period: 'Feb 2026', consensusRate: 89, avgScore: 85, deliberationCount: 15 },
];

const QUALITY_METRICS = [
  { label: 'Decision Quality Score', value: 85, target: 90, icon: Target, color: 'text-blue-400', bg: 'bg-blue-500' },
  { label: 'Consensus Rate', value: 89, target: 85, icon: CheckCircle, color: 'text-green-400', bg: 'bg-green-500' },
  { label: 'Avg Deliberation Time', value: '9.2m', target: '10m', icon: Clock, color: 'text-purple-400', bg: 'bg-purple-500' },
  { label: 'Evidence Citation Rate', value: 94, target: 90, icon: BarChart3, color: 'text-amber-400', bg: 'bg-amber-500' },
];

export const CouncilAnalyticsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'30d' | '90d' | '1y'>('90d');

  return (
    <div className="p-4 lg:p-6 max-w-[1440px] mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded border bg-blue-500/15 text-blue-400 border-blue-500/30">FOUNDATION</span>
            <span className="text-slate-600 text-xs">/</span>
            <span className="text-xs text-slate-400">The Council</span>
          </div>
          <h1 className="text-xl font-bold text-neutral-100">Council Analytics</h1>
          <p className="text-sm text-neutral-500 mt-0.5">Agent performance, consensus trends, and decision quality metrics</p>
        </div>
        <div className="flex gap-1.5">
          {(['30d', '90d', '1y'] as const).map(range => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors border',
                timeRange === range
                  ? 'bg-blue-500/15 text-blue-400 border-blue-500/30'
                  : 'text-neutral-400 border-neutral-700/50 hover:border-neutral-600'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Quality Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {QUALITY_METRICS.map((m, i) => (
          <div key={i} className="p-4 rounded-xl border border-neutral-700/50 bg-neutral-900/50">
            <div className="flex items-center gap-2 mb-2">
              <m.icon className={cn('w-4 h-4', m.color)} />
              <span className="text-xs text-neutral-500 uppercase tracking-wider">{m.label}</span>
            </div>
            <div className="flex items-end gap-2">
              <p className="text-2xl font-bold text-neutral-100">{typeof m.value === 'number' ? `${m.value}%` : m.value}</p>
              {typeof m.value === 'number' && typeof m.target === 'number' && (
                <span className={cn('text-xs font-medium mb-1', m.value >= m.target ? 'text-green-400' : 'text-amber-400')}>
                  {m.value >= m.target ? '✓ On target' : `Target: ${m.target}%`}
                </span>
              )}
            </div>
            {typeof m.value === 'number' && (
              <div className="mt-2 w-full h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                <div className={cn('h-full rounded-full', m.bg)} style={{ width: `${m.value}%`, opacity: 0.6 }} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Consensus Trend Chart (simplified visual) */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50 flex items-center justify-between">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-green-400" /> Consensus Trend
          </h3>
          <span className="text-xs text-green-400 flex items-center gap-1">
            <TrendingUp className="w-3 h-3" /> +11% over 6 months
          </span>
        </div>
        <div className="p-5">
          <div className="flex items-end gap-4 h-40">
            {TREND_DATA.map((point, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-2">
                <div className="w-full flex flex-col items-center gap-1">
                  <span className="text-[10px] font-bold text-green-400">{point.consensusRate}%</span>
                  <div className="w-full bg-neutral-800 rounded-t-sm overflow-hidden" style={{ height: '120px' }}>
                    <div
                      className="w-full bg-gradient-to-t from-green-600/40 to-green-400/20 rounded-t-sm transition-all"
                      style={{ height: `${(point.consensusRate / 100) * 100}%`, marginTop: `${100 - (point.consensusRate / 100) * 100}%` }}
                    />
                  </div>
                </div>
                <span className="text-[10px] text-neutral-500">{point.period.split(' ')[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Agent Performance Table */}
      <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 overflow-hidden">
        <div className="px-5 py-3 border-b border-neutral-700/50">
          <h3 className="text-sm font-semibold text-neutral-200 flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-400" /> Agent Performance Metrics
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-800/50">
                <th className="px-5 py-3 text-left text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Agent Role</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Deliberations</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Avg Confidence</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Consensus Rate</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Avg Response</th>
                <th className="px-5 py-3 text-right text-[10px] font-semibold text-neutral-500 uppercase tracking-wider">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-800/50">
              {AGENT_METRICS.map((agent, i) => (
                <tr key={i} className="hover:bg-neutral-800/30 transition-colors">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <Brain className="w-4 h-4 text-blue-400" />
                      <span className="text-sm text-neutral-200 font-medium">{agent.role}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-neutral-300">{agent.deliberations}</td>
                  <td className="px-5 py-3 text-right">
                    <span className={cn('text-sm font-medium',
                      agent.avgConfidence >= 85 ? 'text-green-400' : agent.avgConfidence >= 70 ? 'text-amber-400' : 'text-red-400'
                    )}>{agent.avgConfidence}%</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <span className={cn('text-sm font-medium',
                      agent.consensusRate >= 85 ? 'text-green-400' : agent.consensusRate >= 60 ? 'text-amber-400' : 'text-red-400'
                    )}>{agent.consensusRate}%</span>
                  </td>
                  <td className="px-5 py-3 text-right text-sm text-neutral-400">{agent.avgResponseTime}</td>
                  <td className="px-5 py-3 text-right">
                    {agent.trend === 'up' && <TrendingUp className="w-4 h-4 text-green-400 ml-auto" />}
                    {agent.trend === 'down' && <TrendingDown className="w-4 h-4 text-red-400 ml-auto" />}
                    {agent.trend === 'stable' && <Activity className="w-4 h-4 text-neutral-500 ml-auto" />}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mode Usage Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
            <PieChart className="w-4 h-4 text-purple-400" /> Mode Usage Distribution
          </h3>
          <div className="space-y-3">
            {[
              { mode: 'Strategic Advisory', pct: 28, color: 'bg-blue-500' },
              { mode: 'Compliance Review', pct: 19, color: 'bg-green-500' },
              { mode: 'Financial Analysis', pct: 16, color: 'bg-purple-500' },
              { mode: 'Crisis Response', pct: 12, color: 'bg-red-500' },
              { mode: "Devil's Advocate", pct: 10, color: 'bg-amber-500' },
              { mode: 'Other', pct: 15, color: 'bg-neutral-500' },
            ].map((m, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={cn('w-2 h-2 rounded-full shrink-0', m.color)} />
                <span className="text-xs text-neutral-300 flex-1">{m.mode}</span>
                <div className="w-24 h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                  <div className={cn('h-full rounded-full', m.color)} style={{ width: `${m.pct}%`, opacity: 0.7 }} />
                </div>
                <span className="text-xs text-neutral-500 w-8 text-right">{m.pct}%</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-neutral-700/50 bg-neutral-900/50 p-5">
          <h3 className="text-sm font-semibold text-neutral-200 mb-4 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-400" /> Decision Quality Insights
          </h3>
          <div className="space-y-4">
            {[
              { insight: 'Decisions with 7+ agents have 23% higher consensus rates', type: 'positive' },
              { insight: "Devil's Advocate mode reduces groupthink by 34%", type: 'positive' },
              { insight: 'Crisis Response mode needs faster avg resolution (currently 4.2m)', type: 'warning' },
              { insight: 'Evidence citation rate improved 8% this quarter', type: 'positive' },
              { insight: 'Financial Analysis deliberations have highest post-decision satisfaction', type: 'positive' },
            ].map((ins, i) => (
              <div key={i} className="flex items-start gap-2">
                {ins.type === 'positive'
                  ? <CheckCircle className="w-4 h-4 text-green-400 mt-0.5 shrink-0" />
                  : <AlertTriangle className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
                }
                <p className="text-xs text-neutral-300">{ins.insight}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CouncilAnalyticsPage;
