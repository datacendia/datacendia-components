// =============================================================================
// DATACENDIA - PILLARS PAGES (The 8 Foundational Data Layers)
// =============================================================================

import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { cn } from '../../../../lib/utils';
import { metricsApi, healthApi, alertsApi } from '../../../lib/api';

// =============================================================================
// SHARED COMPONENTS
// =============================================================================

const PillarHeader: React.FC<{
  icon: string;
  name: string;
  tagline: string;
  color: string;
}> = ({ icon, name, tagline, color }) => (
  <div className="mb-8">
    <div className="flex items-center gap-4 mb-4">
      <div
        className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl"
        style={{ backgroundColor: `${color}20` }}
      >
        {icon}
      </div>
      <div>
        <h1 className="text-2xl font-bold text-neutral-900">{name}</h1>
        <p className="text-neutral-500">{tagline}</p>
      </div>
    </div>
  </div>
);

const MetricCard: React.FC<{
  label: string;
  value: string | number;
  change?: number;
  trend?: 'up' | 'down' | 'stable';
  unit?: string;
}> = ({ label, value, change, trend, unit }) => (
  <div className="bg-white rounded-xl border border-neutral-200 p-4">
    <p className="text-sm text-neutral-500 mb-1">{label}</p>
    <div className="flex items-end gap-2">
      <span className="text-2xl font-bold text-neutral-900">
        {value}{unit && <span className="text-base font-normal text-neutral-500">{unit}</span>}
      </span>
      {change !== undefined && (
        <span className={cn(
          'text-sm font-medium',
          trend === 'up' && 'text-success-main',
          trend === 'down' && 'text-error-main',
          trend === 'stable' && 'text-neutral-500'
        )}>
          {trend === 'up' && '↑'}{trend === 'down' && '↓'}{Math.abs(change)}%
        </span>
      )}
    </div>
  </div>
);

// =============================================================================
// THE HELM - Metrics & KPIs
// =============================================================================

export const HelmPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMetrics = async () => {
      try {
        const res = await metricsApi.getMetrics();
        if (res.success && res.data) {
          setMetrics(res.data);
        }
      } catch (err) {
        console.error('Failed to load metrics:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadMetrics();
  }, []);

  const categories = [
    { id: 'financial', name: 'Financial', icon: '💰', metrics: ['Revenue', 'EBITDA', 'Cash Flow', 'Burn Rate'] },
    { id: 'operational', name: 'Operational', icon: '⚙️', metrics: ['Throughput', 'Cycle Time', 'Utilization', 'Efficiency'] },
    { id: 'customer', name: 'Customer', icon: '👥', metrics: ['NPS', 'Churn Rate', 'LTV', 'CAC'] },
    { id: 'people', name: 'People', icon: '🧑‍💼', metrics: ['Headcount', 'Turnover', 'Engagement', 'Productivity'] },
  ];

  return (
    <div className="p-6">
      <PillarHeader
        icon="🎯"
        name="The Helm"
        tagline="Single source of truth for organizational metrics"
        color="#6366F1"
      />

      {/* KPI Overview */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Metrics" value={metrics.length || 47} />
        <MetricCard label="On Target" value="38" change={5} trend="up" />
        <MetricCard label="At Risk" value="6" change={-2} trend="down" />
        <MetricCard label="Critical" value="3" />
      </div>

      {/* Metric Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {categories.map(cat => (
          <div key={cat.id} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="text-lg font-semibold text-neutral-900">{cat.name}</h3>
            </div>
            <div className="space-y-3">
              {cat.metrics.map((metric, idx) => (
                <div key={idx} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <span className="text-neutral-700">{metric}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900">
                      {Math.floor(Math.random() * 100)}%
                    </span>
                    <span className={cn(
                      'text-xs px-2 py-0.5 rounded-full',
                      idx % 3 === 0 ? 'bg-success-light text-success-dark' :
                      idx % 3 === 1 ? 'bg-warning-light text-warning-dark' :
                      'bg-neutral-100 text-neutral-600'
                    )}>
                      {idx % 3 === 0 ? 'On Track' : idx % 3 === 1 ? 'At Risk' : 'Stable'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// =============================================================================
// THE LINEAGE - Data Provenance
// =============================================================================

export const LineagePage: React.FC = () => {
  const navigate = useNavigate();

  const lineageItems = [
    { id: 'l1', name: 'Revenue Report', type: 'report', sources: 5, lastUpdated: '2 hours ago' },
    { id: 'l2', name: 'Customer 360', type: 'dataset', sources: 12, lastUpdated: '1 hour ago' },
    { id: 'l3', name: 'Sales Pipeline', type: 'metric', sources: 3, lastUpdated: '15 min ago' },
    { id: 'l4', name: 'Churn Model', type: 'model', sources: 8, lastUpdated: '4 hours ago' },
  ];

  return (
    <div className="p-6">
      <PillarHeader
        icon="🔗"
        name="The Lineage"
        tagline="Complete data provenance and dependency tracking"
        color="#10B981"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Tracked Entities" value="1,247" />
        <MetricCard label="Data Sources" value="34" />
        <MetricCard label="Relationships" value="3,891" />
        <MetricCard label="Quality Score" value="94" unit="%" />
      </div>

      {/* Lineage Explorer */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Lineage Views</h3>
          <button
            onClick={() => navigate('/cortex/graph')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            Open Graph Explorer →
          </button>
        </div>
        <div className="space-y-3">
          {lineageItems.map(item => (
            <div
              key={item.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
              onClick={() => navigate(`/cortex/graph?entity=${item.id}`)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {item.type === 'report' ? '📄' : item.type === 'dataset' ? '📊' : item.type === 'metric' ? '📈' : '🤖'}
                </span>
                <div>
                  <p className="font-medium text-neutral-900">{item.name}</p>
                  <p className="text-sm text-neutral-500">{item.sources} upstream sources</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{item.lastUpdated}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Quality by Source</h3>
        <div className="space-y-4">
          {[
            { name: 'Salesforce', quality: 98, records: '2.3M' },
            { name: 'Snowflake', quality: 96, records: '45M' },
            { name: 'SAP', quality: 92, records: '12M' },
            { name: 'Manual Uploads', quality: 78, records: '15K' },
          ].map((source, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-32 text-neutral-700">{source.name}</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={cn(
                    'h-full rounded-full',
                    source.quality >= 95 ? 'bg-success-main' :
                    source.quality >= 85 ? 'bg-warning-main' : 'bg-error-main'
                  )}
                  style={{ width: `${source.quality}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-neutral-900">{source.quality}%</span>
              <span className="w-20 text-sm text-neutral-500">{source.records}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE PREDICT - Forecasting
// =============================================================================

export const PredictPage: React.FC = () => {
  return (
    <div className="p-6">
      <PillarHeader
        icon="🔮"
        name="The Predict"
        tagline="AI-powered forecasting and predictive analytics"
        color="#8B5CF6"
      />

      {/* Active Models */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Models" value="12" />
        <MetricCard label="Avg Accuracy" value="94.2" unit="%" />
        <MetricCard label="Predictions Today" value="847" />
        <MetricCard label="Alerts Generated" value="3" />
      </div>

      {/* Forecast Models */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Forecast Models</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { name: 'Revenue Forecast', type: 'Time Series', accuracy: 96.3, status: 'active' },
            { name: 'Churn Prediction', type: 'Classification', accuracy: 92.1, status: 'active' },
            { name: 'Demand Planning', type: 'Time Series', accuracy: 89.7, status: 'training' },
            { name: 'Lead Scoring', type: 'Regression', accuracy: 87.4, status: 'active' },
          ].map((model, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{model.name}</h4>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  model.status === 'active' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'
                )}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mb-2">{model.type}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${model.accuracy}%` }} />
                </div>
                <span className="text-sm font-medium text-neutral-900">{model.accuracy}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Importance */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Predictive Features</h3>
        <div className="space-y-3">
          {[
            { feature: 'Historical Revenue', importance: 0.34 },
            { feature: 'Customer Tenure', importance: 0.22 },
            { feature: 'Product Usage', importance: 0.18 },
            { feature: 'Support Tickets', importance: 0.14 },
            { feature: 'Contract Value', importance: 0.12 },
          ].map((f, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-40 text-neutral-700">{f.feature}</span>
              <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${f.importance * 100}%` }} />
              </div>
              <span className="w-12 text-sm text-neutral-600">{(f.importance * 100).toFixed(0)}%</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE FLOW - Workflow Automation
// =============================================================================

export const FlowPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PillarHeader
        icon="🌊"
        name="The Flow"
        tagline="Intelligent workflow automation and orchestration"
        color="#06B6D4"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Workflows" value="23" />
        <MetricCard label="Executions Today" value="156" />
        <MetricCard label="Success Rate" value="98.4" unit="%" />
        <MetricCard label="Time Saved" value="47" unit="hrs" />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <button
          onClick={() => navigate('/cortex/bridge')}
          className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <span className="text-3xl mb-3 block">🔧</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Workflow Builder</h3>
          <p className="text-sm text-neutral-500">Create and edit automation workflows</p>
        </button>
        <button
          onClick={() => navigate('/cortex/bridge?tab=executions')}
          className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <span className="text-3xl mb-3 block">📊</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Execution History</h3>
          <p className="text-sm text-neutral-500">View past runs and logs</p>
        </button>
        <button
          onClick={() => navigate('/cortex/bridge?tab=approvals')}
          className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left"
        >
          <span className="text-3xl mb-3 block">✅</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Pending Approvals</h3>
          <p className="text-sm text-neutral-500">Review human-in-the-loop tasks</p>
        </button>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Flow Executions</h3>
        <div className="space-y-3">
          {[
            { name: 'Daily Revenue Sync', status: 'success', time: '5 min ago', duration: '12s' },
            { name: 'Customer Onboarding', status: 'running', time: 'Now', duration: '—' },
            { name: 'Month-End Close', status: 'success', time: '1 hour ago', duration: '4m 32s' },
            { name: 'Anomaly Detection', status: 'failed', time: '2 hours ago', duration: '8s' },
          ].map((exec, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  exec.status === 'success' && 'bg-success-main',
                  exec.status === 'running' && 'bg-primary-500 animate-pulse',
                  exec.status === 'failed' && 'bg-error-main'
                )} />
                <span className="font-medium text-neutral-900">{exec.name}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>{exec.duration}</span>
                <span>{exec.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE HEALTH - Organizational Health
// =============================================================================

export const HealthPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="p-6">
      <PillarHeader
        icon="💓"
        name="The Health"
        tagline="Real-time organizational health monitoring"
        color="#EF4444"
      />

      {/* Health Score */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Overall Health Score</h3>
          <button
            onClick={() => navigate('/cortex/pulse')}
            className="text-sm text-primary-600 hover:text-primary-700"
          >
            View Details →
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="56" fill="none" stroke="#10B981" strokeWidth="12"
                strokeDasharray={`${87 * 3.52} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">87</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {[
              { name: 'Data Health', score: 92, color: '#10B981' },
              { name: 'Operations', score: 88, color: '#3B82F6' },
              { name: 'Security', score: 85, color: '#8B5CF6' },
              { name: 'People', score: 83, color: '#F59E0B' },
            ].map((dim, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dim.color }} />
                <span className="text-neutral-600">{dim.name}</span>
                <span className="font-medium text-neutral-900 ml-auto">{dim.score}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Alerts</h3>
        <div className="space-y-3">
          {[
            { severity: 'critical', title: 'Database latency spike', time: '5 min ago' },
            { severity: 'warning', title: 'API rate limit approaching', time: '15 min ago' },
            { severity: 'info', title: 'Scheduled maintenance tonight', time: '1 hour ago' },
          ].map((alert, idx) => (
            <div key={idx} className={cn(
              'p-4 rounded-lg border-l-4',
              alert.severity === 'critical' && 'bg-error-light border-error-main',
              alert.severity === 'warning' && 'bg-warning-light border-warning-main',
              alert.severity === 'info' && 'bg-primary-50 border-primary-500'
            )}>
              <div className="flex items-center justify-between">
                <span className="font-medium text-neutral-900">{alert.title}</span>
                <span className="text-sm text-neutral-500">{alert.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE GUARD - Security Posture
// =============================================================================

export const GuardPage: React.FC = () => {
  return (
    <div className="p-6">
      <PillarHeader
        icon="🛡️"
        name="The Guard"
        tagline="Proactive security posture and compliance monitoring"
        color="#F59E0B"
      />

      {/* Security Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Security Score" value="94" unit="/100" />
        <MetricCard label="Open Vulnerabilities" value="3" />
        <MetricCard label="Compliance Status" value="98" unit="%" />
        <MetricCard label="Days Since Incident" value="127" />
      </div>

      {/* Compliance Frameworks */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Compliance Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'SOC 2', status: 'compliant', controls: '89/89' },
            { name: 'GDPR', status: 'compliant', controls: '45/45' },
            { name: 'HIPAA', status: 'in_progress', controls: '38/42' },
            { name: 'ISO 27001', status: 'compliant', controls: '114/114' },
          ].map((fw, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-900">{fw.name}</span>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  fw.status === 'compliant' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'
                )}>
                  {fw.status === 'compliant' ? 'Compliant' : 'In Progress'}
                </span>
              </div>
              <p className="text-sm text-neutral-500">{fw.controls} controls</p>
            </div>
          ))}
        </div>
      </div>

      {/* Threats */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Threat Detection</h3>
        <div className="space-y-3">
          {[
            { type: 'Anomalous Login', severity: 'medium', source: 'Identity', time: '2 hours ago' },
            { type: 'Unusual Data Access', severity: 'low', source: 'Data Layer', time: '4 hours ago' },
            { type: 'Config Change', severity: 'low', source: 'Infrastructure', time: '1 day ago' },
          ].map((threat, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  threat.severity === 'high' && 'bg-error-main',
                  threat.severity === 'medium' && 'bg-warning-main',
                  threat.severity === 'low' && 'bg-neutral-400'
                )} />
                <div>
                  <p className="font-medium text-neutral-900">{threat.type}</p>
                  <p className="text-sm text-neutral-500">{threat.source}</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{threat.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE ETHICS - Ethical Guardrails
// =============================================================================

export const EthicsPage: React.FC = () => {
  return (
    <div className="p-6">
      <PillarHeader
        icon="⚖️"
        name="The Ethics"
        tagline="Built-in ethical guardrails and governance"
        color="#EC4899"
      />

      {/* Ethics Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Policy Compliance" value="99.2" unit="%" />
        <MetricCard label="Bias Checks" value="1,247" />
        <MetricCard label="Flagged Decisions" value="12" />
        <MetricCard label="Human Overrides" value="3" />
      </div>

      {/* Ethical Principles */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Ethical Principles</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {[
            { name: 'Fairness', desc: 'Ensure equitable treatment across demographics', status: 'active', checks: 342 },
            { name: 'Transparency', desc: 'Explainable AI decisions with clear reasoning', status: 'active', checks: 567 },
            { name: 'Privacy', desc: 'Data minimization and purpose limitation', status: 'active', checks: 234 },
            { name: 'Accountability', desc: 'Clear ownership and audit trails', status: 'active', checks: 104 },
          ].map((principle, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-neutral-900">{principle.name}</h4>
                <span className="text-xs px-2 py-1 rounded-full bg-success-light text-success-dark">Active</span>
              </div>
              <p className="text-sm text-neutral-600 mb-2">{principle.desc}</p>
              <p className="text-xs text-neutral-500">{principle.checks} checks this week</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Reviews */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Ethics Reviews</h3>
        <div className="space-y-3">
          {[
            { decision: 'Customer segmentation model', result: 'approved', reviewer: 'Ethics Board', date: 'Nov 25' },
            { decision: 'Automated pricing algorithm', result: 'flagged', reviewer: 'CendiaRisk', date: 'Nov 24' },
            { decision: 'Employee performance scoring', result: 'approved', reviewer: 'HR Committee', date: 'Nov 22' },
          ].map((review, idx) => (
            <div key={idx} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium text-neutral-900">{review.decision}</p>
                <p className="text-sm text-neutral-500">Reviewed by {review.reviewer}</p>
              </div>
              <div className="text-right">
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  review.result === 'approved' ? 'bg-success-light text-success-dark' : 'bg-warning-light text-warning-dark'
                )}>
                  {review.result}
                </span>
                <p className="text-xs text-neutral-500 mt-1">{review.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE AGENTS - AI Advisors
// =============================================================================

export const AgentsPage: React.FC = () => {
  const navigate = useNavigate();

  const agents = [
    { code: 'chief', name: 'CendiaChief', role: 'Chief of Staff', icon: '👔', status: 'online', queries: 234 },
    { code: 'cfo', name: 'CendiaCFO', role: 'Financial Intelligence', icon: '💰', status: 'online', queries: 189 },
    { code: 'coo', name: 'CendiaCOO', role: 'Operations', icon: '⚙️', status: 'online', queries: 156 },
    { code: 'ciso', name: 'CendiaCISO', role: 'Security', icon: '🔒', status: 'online', queries: 98 },
    { code: 'cmo', name: 'CendiaCMO', role: 'Marketing', icon: '📢', status: 'busy', queries: 67 },
    { code: 'cro', name: 'CendiaCRO', role: 'Revenue', icon: '📈', status: 'online', queries: 145 },
    { code: 'cdo', name: 'CendiaCDO', role: 'Data Governance', icon: '📊', status: 'online', queries: 112 },
    { code: 'risk', name: 'CendiaRisk', role: 'Risk Management', icon: '⚠️', status: 'online', queries: 78 },
  ];

  return (
    <div className="p-6">
      <PillarHeader
        icon="🤖"
        name="The Agents"
        tagline="AI advisors for every domain - The Pantheon"
        color="#6366F1"
      />

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Agents" value="8" />
        <MetricCard label="Queries Today" value="1,079" />
        <MetricCard label="Avg Response" value="2.3" unit="s" />
        <MetricCard label="Satisfaction" value="4.8" unit="/5" />
      </div>

      {/* Agent Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {agents.map(agent => (
          <div
            key={agent.code}
            onClick={() => navigate(`/cortex/council?agent=${agent.code}`)}
            className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{agent.icon}</span>
              <span className={cn(
                'w-2 h-2 rounded-full',
                agent.status === 'online' && 'bg-success-main',
                agent.status === 'busy' && 'bg-warning-main',
                agent.status === 'offline' && 'bg-neutral-300'
              )} />
            </div>
            <h4 className="font-semibold text-neutral-900">{agent.name}</h4>
            <p className="text-sm text-neutral-500">{agent.role}</p>
            <p className="text-xs text-neutral-400 mt-2">{agent.queries} queries today</p>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate('/cortex/council')}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Ask The Council
          </button>
          <button
            onClick={() => navigate('/cortex/council?mode=deliberation')}
            className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors"
          >
            Start Deliberation
          </button>
          <button className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
            View Decision History
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelmPage;
