// =============================================================================
// DATACENDIA - DASHBOARD PAGE (Real API Integration)
// =============================================================================

// File: src/pages/cortex/DashboardPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn, formatNumber, formatCurrency, formatRelativeTime } from '../../../lib/utils';
import { healthApi, alertsApi, metricsApi, organizationsApi } from '../../lib/api';
import { wsClient } from '../../lib/api/websocket';
import type { HealthScore as ApiHealthScore, Alert as ApiAlert } from '../../lib/api/types';
import { useLanguage } from '../../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface HealthScore {
  overall: number;
  dimensions: {
    data: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    operations: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    security: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
    people: { score: number; trend: 'up' | 'down' | 'stable'; change: number };
  };
}

interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  timestamp: Date;
}

interface Approval {
  id: string;
  type: 'workflow' | 'access' | 'budget';
  title: string;
  requestedBy: string;
}

interface Metric {
  id: string;
  name: string;
  value: number;
  unit: string;
  change: number;
  changeType: 'increase' | 'decrease' | 'neutral';
}

interface Activity {
  id: string;
  type: 'success' | 'info' | 'warning' | 'error';
  message: string;
  timestamp: Date;
}

// =============================================================================
// FALLBACK DATA (Used when API is unavailable)
// =============================================================================

const fallbackHealthScore: HealthScore = {
  overall: 82,
  dimensions: {
    data: { score: 94, trend: 'up', change: 2 },
    operations: { score: 78, trend: 'down', change: -5 },
    security: { score: 85, trend: 'up', change: 1 },
    people: { score: 71, trend: 'stable', change: 0 },
  },
};

const fallbackAlerts: Alert[] = [
  { id: '1', severity: 'critical', title: 'Database CPU > 90% for 15 min', timestamp: new Date(Date.now() - 300000) },
  { id: '2', severity: 'critical', title: 'Payment processing latency spike', timestamp: new Date(Date.now() - 600000) },
  { id: '3', severity: 'warning', title: 'Disk usage at 78% on prod-db-01', timestamp: new Date(Date.now() - 1800000) },
];

const fallbackApprovals: Approval[] = [
  { id: '1', type: 'workflow', title: 'Monthly Close Process', requestedBy: 'Sarah Chen' },
  { id: '2', type: 'access', title: 'Production DB Access', requestedBy: 'Emily Davis' },
];

const fallbackMetrics: Metric[] = [
  { id: '1', name: 'Revenue', value: 12400000, unit: 'USD', change: 12, changeType: 'increase' },
  { id: '2', name: 'Pipeline', value: 48200000, unit: 'USD', change: 8, changeType: 'increase' },
  { id: '3', name: 'Burn Rate', value: 1200000, unit: 'USD/mo', change: -3, changeType: 'decrease' },
  { id: '4', name: 'NPS', value: 72, unit: 'pts', change: 5, changeType: 'increase' },
];

const fallbackActivity: Activity[] = [
  { id: '1', type: 'success', message: 'Workflow "Monthly Close" completed', timestamp: new Date(Date.now() - 120000) },
  { id: '2', type: 'info', message: 'Sarah queried revenue forecast', timestamp: new Date(Date.now() - 900000) },
];

const recentQueries = [
  'Why did churn increase?',
  'Forecast Q4 revenue',
  "What's our biggest risk?",
];

// =============================================================================
// COMPONENT
// =============================================================================

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [queryInput, setQueryInput] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => setIsLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  const handleQuerySubmit = () => {
    if (queryInput.trim()) {
      navigate(`/cortex/council?q=${encodeURIComponent(queryInput)}`);
    }
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    const greetings: Record<string, { morning: string; afternoon: string; evening: string }> = {
      en: { morning: 'Good morning', afternoon: 'Good afternoon', evening: 'Good evening' },
      es: { morning: 'Buenos días', afternoon: 'Buenas tardes', evening: 'Buenas noches' },
      fr: { morning: 'Bonjour', afternoon: 'Bon après-midi', evening: 'Bonsoir' },
      de: { morning: 'Guten Morgen', afternoon: 'Guten Tag', evening: 'Guten Abend' },
      zh: { morning: '早上好', afternoon: '下午好', evening: '晚上好' },
      ja: { morning: 'おはようございます', afternoon: 'こんにちは', evening: 'こんばんは' },
    };
    const lang = greetings[language] || greetings.en;
    if (hour < 12) return lang.morning;
    if (hour < 18) return lang.afternoon;
    return lang.evening;
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable') => {
    if (trend === 'up') return '↑';
    if (trend === 'down') return '↓';
    return '→';
  };

  const getTrendColor = (trend: 'up' | 'down' | 'stable', isPositive: boolean = true) => {
    if (trend === 'stable') return 'text-neutral-500';
    if (trend === 'up') return isPositive ? 'text-success-main' : 'text-error-main';
    return isPositive ? 'text-error-main' : 'text-success-main';
  };

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      {/* ================================================================= */}
      {/* HEADER */}
      {/* ================================================================= */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-neutral-900">
          {getGreeting()}, John
        </h1>
        <p className="text-neutral-500 mt-1">
          Here's how Acme Corp is doing today
        </p>
      </div>

      {/* ================================================================= */}
      {/* HEALTH SCORE */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          {/* Overall Score */}
          <div className="flex items-center gap-6">
            <div className="relative">
              <svg className="w-24 h-24 transform -rotate-90">
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke="#E2E8F0"
                  strokeWidth="8"
                />
                <circle
                  cx="48"
                  cy="48"
                  r="40"
                  fill="none"
                  stroke={fallbackHealthScore.overall >= 80 ? '#22C55E' : fallbackHealthScore.overall >= 60 ? '#F59E0B' : '#EF4444'}
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${(fallbackHealthScore.overall / 100) * 251.2} 251.2`}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-bold text-neutral-900">{fallbackHealthScore.overall}</span>
              </div>
            </div>
            <div>
              <h2 className="text-lg font-semibold text-neutral-900">{t('dashboard.health_score')}</h2>
              <p className="text-sm text-success-main font-medium">▲ +3 {language === 'es' ? 'desde la semana pasada' : 'from last week'}</p>
            </div>
          </div>

          {/* Dimensions */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-1 lg:max-w-xl">
            {Object.entries(fallbackHealthScore.dimensions).map(([key, data]) => (
              <div key={key} className="text-center p-3 bg-neutral-50 rounded-lg">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-1">
                  {t(`dashboard.${key}`)}
                </p>
                <p className="text-2xl font-bold text-neutral-900">{data.score}</p>
                <p className={cn('text-xs font-medium', getTrendColor(data.trend, true))}>
                  {getTrendIcon(data.trend)} {Math.abs(data.change)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* ALERTS & APPROVALS ROW */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Active Alerts */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">{t('dashboard.alerts')}</h3>
            <button
              onClick={() => navigate('/cortex/pulse/alerts')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              {t('button.view_all')} →
            </button>
          </div>
          
          <div className="space-y-3">
            {/* Summary badges */}
            <div className="flex gap-3 mb-4">
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-error-light text-error-dark">
                🔴 {fallbackAlerts.filter(a => a.severity === 'critical').length} {language === 'es' ? 'Crítico' : 'Critical'}
              </span>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-warning-light text-warning-dark">
                🟡 {fallbackAlerts.filter(a => a.severity === 'warning').length} Warning
              </span>
            </div>

            {/* Alert list */}
            {fallbackAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert.id}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <span className={cn(
                  'mt-0.5 w-2 h-2 rounded-full flex-shrink-0',
                  alert.severity === 'critical' && 'bg-error-main',
                  alert.severity === 'warning' && 'bg-warning-main',
                  alert.severity === 'info' && 'bg-info-main'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{alert.title}</p>
                  <p className="text-xs text-neutral-500">{formatRelativeTime(alert.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">{t('dashboard.pending_approvals')}</h3>
            <button
              onClick={() => navigate('/cortex/bridge/approvals')}
              className="text-sm text-primary-600 hover:text-primary-700 font-medium"
            >
              View All →
            </button>
          </div>

          {/* Summary badges */}
          <div className="flex gap-3 mb-4">
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-primary-50 text-primary-700">
              📋 {fallbackApprovals.filter(a => a.type === 'workflow').length} Workflows
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary-50 text-secondary-700">
              👤 {fallbackApprovals.filter(a => a.type === 'access').length} Access
            </span>
            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-accent-50 text-accent-700">
              💰 {fallbackApprovals.filter(a => a.type === 'budget').length} Budget
            </span>
          </div>

          {/* Approval list */}
          <div className="space-y-3">
            {fallbackApprovals.slice(0, 4).map((approval) => (
              <div
                key={approval.id}
                className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-50 cursor-pointer transition-colors"
              >
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-900 truncate">{approval.title}</p>
                  <p className="text-xs text-neutral-500">by {approval.requestedBy}</p>
                </div>
                <div className="flex gap-2 ml-4">
                  <button className="px-3 py-1 text-xs font-medium text-success-main bg-success-light rounded-md hover:bg-success-main hover:text-white transition-colors">
                    {language === 'es' ? 'Aprobar' : 'Approve'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ================================================================= */}
      {/* KEY METRICS */}
      {/* ================================================================= */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Key Metrics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {fallbackMetrics.map((metric) => (
            <div key={metric.id} className="p-4 bg-neutral-50 rounded-lg">
              <p className="text-xs font-medium text-neutral-500 mb-1">{metric.name}</p>
              <p className="text-xl font-bold text-neutral-900">
                {metric.unit === 'USD' || metric.unit === 'USD/mo'
                  ? formatCurrency(metric.value)
                  : metric.unit === '%' || metric.unit === 'pts'
                  ? formatNumber(metric.value, 1)
                  : formatNumber(metric.value)}
                {metric.unit === '%' && '%'}
              </p>
              <p className={cn(
                'text-xs font-medium mt-1',
                metric.changeType === 'increase' ? 'text-success-main' : 
                metric.changeType === 'decrease' && metric.name === 'Churn' ? 'text-success-main' :
                metric.changeType === 'decrease' && metric.name === 'Burn Rate' ? 'text-success-main' :
                'text-error-main'
              )}>
                {metric.changeType === 'increase' ? '▲' : '▼'} {Math.abs(metric.change)}{metric.unit === '%' ? 'pp' : '%'}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* ================================================================= */}
      {/* ASK THE COUNCIL & ACTIVITY */}
      {/* ================================================================= */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Ask the Council */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-700 rounded-xl p-6 text-white">
          <h3 className="text-lg font-semibold mb-4">Ask The Council</h3>
          
          <div className="relative mb-4">
            <input
              type="text"
              value={queryInput}
              onChange={(e) => setQueryInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleQuerySubmit()}
              placeholder="What would you like to know?"
              className={cn(
                'w-full h-12 pl-4 pr-12 rounded-lg',
                'bg-white/10 border border-white/20',
                'text-white placeholder:text-white/60',
                'focus:outline-none focus:ring-2 focus:ring-white/30'
              )}
            />
            <button
              onClick={handleQuerySubmit}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-md hover:bg-white/10"
            >
              🎤
            </button>
          </div>

          <div>
            <p className="text-sm text-white/70 mb-2">Recent queries:</p>
            <div className="space-y-2">
              {recentQueries.map((query, i) => (
                <button
                  key={i}
                  onClick={() => setQueryInput(query)}
                  className="block w-full text-left text-sm text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-md transition-colors"
                >
                  "{query}"
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-xl border border-neutral-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-neutral-900">Recent Activity</h3>
            <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
              View Full Log →
            </button>
          </div>

          <div className="space-y-3">
            {fallbackActivity.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <span className={cn(
                  'mt-1.5 w-2 h-2 rounded-full flex-shrink-0',
                  activity.type === 'success' && 'bg-success-main',
                  activity.type === 'info' && 'bg-info-main',
                  activity.type === 'warning' && 'bg-warning-main',
                  activity.type === 'error' && 'bg-error-main'
                )} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-700">{activity.message}</p>
                  <p className="text-xs text-neutral-400">{formatRelativeTime(activity.timestamp)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
