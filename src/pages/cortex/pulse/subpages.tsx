// =============================================================================
// DATACENDIA - PULSE SUB-PAGES
// =============================================================================

import React, { useState } from 'react';
import { cn, formatRelativeTime } from '../../../../lib/utils';

// =============================================================================
// ALERTS PAGE
// =============================================================================

export const AlertsPage: React.FC = () => {
  const [filter, setFilter] = useState<'all' | 'critical' | 'warning' | 'info'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'acknowledged' | 'resolved'>('all');

  const alerts = [
    { id: 1, severity: 'critical', title: 'Database Connection Pool Exhausted', message: 'Primary PostgreSQL connection pool at 100% capacity', source: 'Database', timestamp: new Date(Date.now() - 300000), status: 'active' },
    { id: 2, severity: 'critical', title: 'Revenue Anomaly Detected', message: 'Q4 revenue tracking 25% below forecast', source: 'CendiaCFO', timestamp: new Date(Date.now() - 600000), status: 'active' },
    { id: 3, severity: 'critical', title: 'Security Policy Violation', message: 'Unauthorized export attempt blocked', source: 'Security', timestamp: new Date(Date.now() - 900000), status: 'acknowledged' },
    { id: 4, severity: 'warning', title: 'ML Pipeline Latency High', message: 'Forecast model inference time >5s', source: 'ML Pipeline', timestamp: new Date(Date.now() - 1800000), status: 'active' },
    { id: 5, severity: 'warning', title: 'Data Sync Delay', message: 'Salesforce sync delayed by 45 minutes', source: 'Integrations', timestamp: new Date(Date.now() - 3600000), status: 'active' },
    { id: 6, severity: 'warning', title: 'License Limit Approaching', message: 'Using 45 of 50 user licenses', source: 'System', timestamp: new Date(Date.now() - 7200000), status: 'active' },
    { id: 7, severity: 'warning', title: 'Churn Risk Identified', message: 'Customer segment showing increased churn indicators', source: 'CendiaCRO', timestamp: new Date(Date.now() - 14400000), status: 'acknowledged' },
    { id: 8, severity: 'info', title: 'Scheduled Maintenance', message: 'System update scheduled for Sunday 2am EST', source: 'System', timestamp: new Date(Date.now() - 28800000), status: 'active' },
    { id: 9, severity: 'info', title: 'New Integration Available', message: 'Jira connector now available', source: 'Integrations', timestamp: new Date(Date.now() - 86400000), status: 'resolved' },
  ];

  const filteredAlerts = alerts.filter(a => {
    if (filter !== 'all' && a.severity !== filter) return false;
    if (statusFilter !== 'all' && a.status !== statusFilter) return false;
    return true;
  });

  const severityCounts = {
    critical: alerts.filter(a => a.severity === 'critical').length,
    warning: alerts.filter(a => a.severity === 'warning').length,
    info: alerts.filter(a => a.severity === 'info').length,
  };

  return (
    <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Alerts</h1>
          <p className="text-neutral-500">Monitor and manage system alerts</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Alert Rule
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div 
          onClick={() => setFilter('all')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'all' ? 'border-primary-500 bg-primary-50' : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Total Active</p>
          <p className="text-2xl font-bold text-neutral-900">{alerts.filter(a => a.status === 'active').length}</p>
        </div>
        <div 
          onClick={() => setFilter('critical')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'critical' ? 'border-error-main bg-error-light' : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Critical</p>
          <p className="text-2xl font-bold text-error-main">{severityCounts.critical}</p>
        </div>
        <div 
          onClick={() => setFilter('warning')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'warning' ? 'border-warning-main bg-warning-light' : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Warning</p>
          <p className="text-2xl font-bold text-warning-main">{severityCounts.warning}</p>
        </div>
        <div 
          onClick={() => setFilter('info')}
          className={cn(
            'p-4 rounded-xl border cursor-pointer transition-all',
            filter === 'info' ? 'border-info-main bg-info-light' : 'border-neutral-200 bg-white hover:border-neutral-300'
          )}
        >
          <p className="text-sm text-neutral-500">Info</p>
          <p className="text-2xl font-bold text-info-main">{severityCounts.info}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'active', 'acknowledged', 'resolved'] as const).map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors capitalize',
                statusFilter === status
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {status}
            </button>
          ))}
        </div>
        <input
          type="text"
          placeholder="Search alerts..."
          className="ml-auto w-64 h-9 px-3 border border-neutral-300 rounded-lg text-sm"
        />
      </div>

      {/* Alert List */}
      <div className="space-y-3">
        {filteredAlerts.map((alert) => (
          <div
            key={alert.id}
            className={cn(
              'bg-white rounded-xl border-l-4 p-4',
              alert.severity === 'critical' && 'border-l-error-main border border-neutral-200',
              alert.severity === 'warning' && 'border-l-warning-main border border-neutral-200',
              alert.severity === 'info' && 'border-l-info-main border border-neutral-200'
            )}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <span className={cn(
                  'mt-1 w-2.5 h-2.5 rounded-full flex-shrink-0',
                  alert.severity === 'critical' && 'bg-error-main',
                  alert.severity === 'warning' && 'bg-warning-main',
                  alert.severity === 'info' && 'bg-info-main'
                )} />
                <div>
                  <h3 className="font-semibold text-neutral-900">{alert.title}</h3>
                  <p className="text-neutral-600 mt-1">{alert.message}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <span className="text-sm text-neutral-500">{alert.source}</span>
                    <span className="text-sm text-neutral-400">{formatRelativeTime(alert.timestamp)}</span>
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-medium capitalize',
                      alert.status === 'active' && 'bg-error-light text-error-dark',
                      alert.status === 'acknowledged' && 'bg-warning-light text-warning-dark',
                      alert.status === 'resolved' && 'bg-success-light text-success-dark'
                    )}>
                      {alert.status}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {alert.status === 'active' && (
                  <button className="px-3 py-1.5 border border-neutral-300 text-neutral-700 text-sm rounded-lg hover:bg-neutral-50">
                    Acknowledge
                  </button>
                )}
                {alert.status !== 'resolved' && (
                  <button className="px-3 py-1.5 bg-success-main text-white text-sm rounded-lg hover:bg-success-dark">
                    Resolve
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// METRICS PAGE
// =============================================================================

export const MetricsPage: React.FC = () => {
  const [timeRange, setTimeRange] = useState<'1h' | '24h' | '7d' | '30d'>('24h');
  const [category, setCategory] = useState<'all' | 'financial' | 'operational' | 'customer'>('all');

  const metrics = [
    { id: 1, name: 'Monthly Recurring Revenue', value: '$1.24M', change: 12.5, trend: 'up', category: 'financial', target: '$1.5M', progress: 82 },
    { id: 2, name: 'Annual Recurring Revenue', value: '$14.88M', change: 8.2, trend: 'up', category: 'financial', target: '$18M', progress: 82 },
    { id: 3, name: 'Customer Acquisition Cost', value: '$2,450', change: -5.3, trend: 'down', category: 'financial', target: '$2,000', progress: 78 },
    { id: 4, name: 'Customer Lifetime Value', value: '$45,000', change: 3.2, trend: 'up', category: 'financial', target: '$50,000', progress: 90 },
    { id: 5, name: 'Net Promoter Score', value: '72', change: 5, trend: 'up', category: 'customer', target: '80', progress: 90 },
    { id: 6, name: 'Customer Churn Rate', value: '2.1%', change: -0.3, trend: 'down', category: 'customer', target: '< 2%', progress: 95 },
    { id: 7, name: 'Active Users (DAU)', value: '8,450', change: 15.2, trend: 'up', category: 'customer', target: '10,000', progress: 84 },
    { id: 8, name: 'API Uptime', value: '99.98%', change: 0.02, trend: 'up', category: 'operational', target: '99.9%', progress: 100 },
    { id: 9, name: 'Avg Response Time', value: '124ms', change: -8.5, trend: 'down', category: 'operational', target: '< 200ms', progress: 100 },
    { id: 10, name: 'Data Pipeline Health', value: '94%', change: 2, trend: 'up', category: 'operational', target: '95%', progress: 98 },
  ];

  const filteredMetrics = category === 'all' 
    ? metrics 
    : metrics.filter(m => m.category === category);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Metrics</h1>
          <p className="text-neutral-500">Key performance indicators and business metrics</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Add Metric
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {(['all', 'financial', 'operational', 'customer'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize',
                category === cat
                  ? 'bg-primary-100 text-primary-700'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {(['1h', '24h', '7d', '30d'] as const).map((range) => (
            <button
              key={range}
              onClick={() => setTimeRange(range)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-sm font-medium transition-colors',
                timeRange === range
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100'
              )}
            >
              {range}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredMetrics.map((metric) => (
          <div
            key={metric.id}
            className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-medium text-neutral-900">{metric.name}</h3>
                <span className={cn(
                  'text-xs px-2 py-0.5 rounded-full capitalize',
                  metric.category === 'financial' && 'bg-green-100 text-green-700',
                  metric.category === 'operational' && 'bg-blue-100 text-blue-700',
                  metric.category === 'customer' && 'bg-purple-100 text-purple-700'
                )}>
                  {metric.category}
                </span>
              </div>
              <span className={cn(
                'flex items-center text-sm font-medium',
                metric.trend === 'up' && metric.change > 0 ? 'text-success-main' : 
                metric.trend === 'down' && metric.change < 0 ? 'text-success-main' :
                'text-error-main'
              )}>
                {metric.change > 0 ? '↑' : '↓'} {Math.abs(metric.change)}%
              </span>
            </div>
            
            <p className="text-3xl font-bold text-neutral-900 mb-4">{metric.value}</p>
            
            <div>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-neutral-500">Target: {metric.target}</span>
                <span className="font-medium text-neutral-900">{metric.progress}%</span>
              </div>
              <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    metric.progress >= 90 ? 'bg-success-main' :
                    metric.progress >= 70 ? 'bg-warning-main' :
                    'bg-error-main'
                  )}
                  style={{ width: `${Math.min(metric.progress, 100)}%` }}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AlertsPage;
