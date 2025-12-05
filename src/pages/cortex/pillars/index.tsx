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

interface HelmDashboard {
  totalMetrics: number;
  onTarget: number;
  atRisk: number;
  critical: number;
  categories: Array<{
    id: string;
    name: string;
    icon: string;
    metrics: Array<{
      id: string;
      name: string;
      value: number;
      unit: string;
      status: 'on_track' | 'at_risk' | 'critical' | 'stable';
      trend: number;
    }>;
  }>;
}

export const HelmPage: React.FC = () => {
  const [dashboard, setDashboard] = useState<HelmDashboard | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHelmData = async () => {
      try {
        setIsLoading(true);
        const res = await fetch('/api/v1/pillars/helm/dashboard?organizationId=demo');
        const data = await res.json();
        if (data.success) {
          setDashboard(data.data);
        }
      } catch (err) {
        console.error('Failed to load helm data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHelmData();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'on_track': return 'bg-success-light text-success-dark';
      case 'at_risk': return 'bg-warning-light text-warning-dark';
      case 'critical': return 'bg-error-light text-error-dark';
      default: return 'bg-neutral-100 text-neutral-600';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'on_track': return 'On Track';
      case 'at_risk': return 'At Risk';
      case 'critical': return 'Critical';
      default: return 'Stable';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="🎯" name="The Helm" tagline="Single source of truth for organizational metrics" color="#6366F1" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-neutral-500">Loading metrics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader icon="🎯" name="The Helm" tagline="Single source of truth for organizational metrics" color="#6366F1" />

      {/* KPI Overview - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Total Metrics" value={dashboard?.totalMetrics ?? 0} />
        <MetricCard label="On Target" value={dashboard?.onTarget ?? 0} trend="up" />
        <MetricCard label="At Risk" value={dashboard?.atRisk ?? 0} trend="down" />
        <MetricCard label="Critical" value={dashboard?.critical ?? 0} />
      </div>

      {/* Metric Categories - REAL DATA */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {(dashboard?.categories || []).map((cat: any, idx: number) => {
          const key = cat.id || cat.name || cat.category || idx;
          const displayName = cat.name || cat.category || 'Category';
          return (
          <div key={key} className="bg-white rounded-xl border border-neutral-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{cat.icon}</span>
              <h3 className="text-lg font-semibold text-neutral-900">{displayName}</h3>
            </div>
            <div className="space-y-3">
              {(cat.metrics || []).map((metric: any) => (
                <div key={metric.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                  <span className="text-neutral-700">{metric.name}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-medium text-neutral-900">
                      {typeof metric.value === 'number' ? metric.value.toFixed(1) : metric.value}{metric.unit}
                    </span>
                    <span className={cn('text-xs px-2 py-0.5 rounded-full', getStatusStyle(metric.status))}>
                      {getStatusLabel(metric.status)}
                    </span>
                  </div>
                </div>
              ))}
              {(!cat.metrics || cat.metrics.length === 0) && (
                <p className="text-neutral-500 text-center py-2">No metrics in this category</p>
              )}
            </div>
          </div>
          );
        })}
        {(!dashboard?.categories || dashboard.categories.length === 0) && (
          <p className="col-span-2 text-neutral-500 text-center py-8">No metrics configured</p>
        )}
      </div>
    </div>
  );
};

// =============================================================================
// THE LINEAGE - Data Provenance
// =============================================================================

interface LineageEntity {
  id: string;
  name: string;
  type: string;
  upstreamCount: number;
  downstreamCount: number;
  qualityScore: number;
  lastUpdated: string;
}

interface QualityOverview {
  totalEntities: number;
  totalSources: number;
  totalRelationships: number;
  avgQualityScore: number;
  sourceQuality: Array<{ name: string; quality: number; recordCount: number }>;
}

export const LineagePage: React.FC = () => {
  const navigate = useNavigate();
  const [entities, setEntities] = useState<LineageEntity[]>([]);
  const [qualityOverview, setQualityOverview] = useState<QualityOverview | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadLineageData = async () => {
      try {
        setIsLoading(true);
        const [entitiesRes, qualityRes] = await Promise.all([
          fetch('/api/v1/pillars/lineage/entities?organizationId=demo'),
          fetch('/api/v1/pillars/lineage/quality?organizationId=demo'),
        ]);
        
        const entitiesData = await entitiesRes.json();
        const qualityData = await qualityRes.json();
        
        if (entitiesData.success) setEntities(entitiesData.data || []);
        if (qualityData.success) setQualityOverview(qualityData.data);
      } catch (err) {
        console.error('Failed to load lineage data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadLineageData();
  }, []);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${Math.floor(diffMs / 86400000)} days ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="🔗" name="The Lineage" tagline="Complete data provenance and dependency tracking" color="#10B981" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500"></div>
          <span className="ml-3 text-neutral-500">Loading lineage data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader icon="🔗" name="The Lineage" tagline="Complete data provenance and dependency tracking" color="#10B981" />

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Tracked Entities" value={qualityOverview?.totalEntities ?? entities.length} />
        <MetricCard label="Data Sources" value={qualityOverview?.totalSources ?? 0} />
        <MetricCard label="Relationships" value={qualityOverview?.totalRelationships ?? 0} />
        <MetricCard label="Quality Score" value={Math.round(qualityOverview?.avgQualityScore ?? 0)} unit="%" />
      </div>

      {/* Lineage Explorer - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-neutral-900">Recent Lineage Views</h3>
          <button onClick={() => navigate('/cortex/graph')} className="text-sm text-primary-600 hover:text-primary-700">
            Open Graph Explorer →
          </button>
        </div>
        <div className="space-y-3">
          {entities.length > 0 ? entities.slice(0, 6).map(entity => (
            <div
              key={entity.id}
              className="flex items-center justify-between p-4 bg-neutral-50 rounded-lg hover:bg-neutral-100 cursor-pointer"
              onClick={() => navigate(`/cortex/graph?entity=${entity.id}`)}
            >
              <div className="flex items-center gap-3">
                <span className="text-xl">
                  {entity.type === 'report' ? '📄' : entity.type === 'dataset' ? '📊' : entity.type === 'metric' ? '📈' : entity.type === 'model' ? '🤖' : '📁'}
                </span>
                <div>
                  <p className="font-medium text-neutral-900">{entity.name}</p>
                  <p className="text-sm text-neutral-500">{entity.upstreamCount} upstream sources</p>
                </div>
              </div>
              <span className="text-sm text-neutral-500">{formatRelativeTime(entity.lastUpdated)}</span>
            </div>
          )) : (
            <p className="text-neutral-500 text-center py-4">No entities tracked yet</p>
          )}
        </div>
      </div>

      {/* Data Quality - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Data Quality by Source</h3>
        <div className="space-y-4">
          {(qualityOverview?.sourceQuality || []).map((source, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-32 text-neutral-700">{source.name}</span>
              <div className="flex-1 h-2 bg-neutral-200 rounded-full overflow-hidden">
                <div
                  className={cn('h-full rounded-full', source.quality >= 95 ? 'bg-success-main' : source.quality >= 85 ? 'bg-warning-main' : 'bg-error-main')}
                  style={{ width: `${source.quality}%` }}
                />
              </div>
              <span className="w-12 text-sm font-medium text-neutral-900">{source.quality}%</span>
              <span className="w-20 text-sm text-neutral-500">{source.recordCount.toLocaleString()}</span>
            </div>
          ))}
          {(!qualityOverview?.sourceQuality || qualityOverview.sourceQuality.length === 0) && (
            <p className="text-neutral-500 text-center py-4">No quality data available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE PREDICT - Forecasting
// =============================================================================

interface PredictModel {
  id: string;
  name: string;
  type: string;
  accuracy: number;
  status: 'active' | 'training' | 'inactive';
  predictions: number;
  lastTrained: string;
}

interface PredictInsight {
  feature: string;
  importance: number;
}

export const PredictPage: React.FC = () => {
  const [models, setModels] = useState<PredictModel[]>([]);
  const [insights, setInsights] = useState<PredictInsight[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPredictData = async () => {
      try {
        setIsLoading(true);
        const [modelsRes, insightsRes] = await Promise.all([
          fetch('/api/v1/pillars/predict/models?organizationId=demo'),
          fetch('/api/v1/pillars/predict/insights?organizationId=demo'),
        ]);
        
        const modelsData = await modelsRes.json();
        const insightsData = await insightsRes.json();
        
        if (modelsData.success) setModels(modelsData.data || []);
        if (insightsData.success) setInsights(insightsData.data?.features || []);
      } catch (err) {
        console.error('Failed to load predict data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadPredictData();
  }, []);

  const activeModels = models.filter(m => m.status === 'active').length;
  const avgAccuracy = models.length > 0 ? models.reduce((sum, m) => sum + m.accuracy, 0) / models.length : 0;
  const totalPredictions = models.reduce((sum, m) => sum + (m.predictions || 0), 0);

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="🔮" name="The Predict" tagline="AI-powered forecasting and predictive analytics" color="#8B5CF6" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500"></div>
          <span className="ml-3 text-neutral-500">Loading prediction models...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader icon="🔮" name="The Predict" tagline="AI-powered forecasting and predictive analytics" color="#8B5CF6" />

      {/* Active Models - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Models" value={activeModels} />
        <MetricCard label="Avg Accuracy" value={avgAccuracy.toFixed(1)} unit="%" />
        <MetricCard label="Predictions Today" value={totalPredictions} />
        <MetricCard label="Models Training" value={models.filter(m => m.status === 'training').length} />
      </div>

      {/* Forecast Models - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Forecast Models</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {models.length > 0 ? models.map((model) => (
            <div key={model.id} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-neutral-900">{model.name}</h4>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  model.status === 'active' ? 'bg-success-light text-success-dark' : 
                  model.status === 'training' ? 'bg-warning-light text-warning-dark' : 'bg-neutral-100 text-neutral-600'
                )}>
                  {model.status}
                </span>
              </div>
              <p className="text-sm text-neutral-500 mb-2">{model.type}</p>
              <div className="flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-neutral-200 rounded-full">
                  <div className="h-full bg-primary-500 rounded-full" style={{ width: `${model.accuracy}%` }} />
                </div>
                <span className="text-sm font-medium text-neutral-900">{model.accuracy.toFixed(1)}%</span>
              </div>
            </div>
          )) : (
            <p className="col-span-2 text-neutral-500 text-center py-4">No models configured</p>
          )}
        </div>
      </div>

      {/* Feature Importance - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Top Predictive Features</h3>
        <div className="space-y-3">
          {insights.length > 0 ? insights.slice(0, 5).map((f, idx) => (
            <div key={idx} className="flex items-center gap-4">
              <span className="w-40 text-neutral-700">{f.feature}</span>
              <div className="flex-1 h-3 bg-neutral-100 rounded-full overflow-hidden">
                <div className="h-full bg-primary-500 rounded-full" style={{ width: `${f.importance * 100}%` }} />
              </div>
              <span className="w-12 text-sm text-neutral-600">{(f.importance * 100).toFixed(0)}%</span>
            </div>
          )) : (
            <p className="text-neutral-500 text-center py-4">No feature insights available</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE FLOW - Workflow Automation
// =============================================================================

interface FlowStats {
  activeWorkflows: number;
  executionsToday: number;
  successRate: number;
  timeSavedHours: number;
  pendingApprovals: number;
}

interface FlowExecution {
  id: string;
  workflowName: string;
  status: 'success' | 'running' | 'failed' | 'pending';
  startedAt: string;
  duration: number | null;
}

export const FlowPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<FlowStats | null>(null);
  const [executions, setExecutions] = useState<FlowExecution[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadFlowData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, execRes] = await Promise.all([
          fetch('/api/v1/pillars/flow/stats?organizationId=demo'),
          fetch('/api/v1/pillars/flow/executions?organizationId=demo&limit=10'),
        ]);
        
        const statsData = await statsRes.json();
        const execData = await execRes.json();
        
        if (statsData.success) setStats(statsData.data);
        if (execData.success) setExecutions(execData.data || []);
      } catch (err) {
        console.error('Failed to load flow data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadFlowData();
  }, []);

  const formatDuration = (ms: number | null) => {
    if (ms === null) return '—';
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(0)}s`;
    return `${Math.floor(ms / 60000)}m ${Math.floor((ms % 60000) / 1000)}s`;
  };

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    if (diffMs < 60000) return 'Now';
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    return `${Math.floor(diffMs / 3600000)} hours ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="🌊" name="The Flow" tagline="Intelligent workflow automation and orchestration" color="#06B6D4" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
          <span className="ml-3 text-neutral-500">Loading workflow data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader icon="🌊" name="The Flow" tagline="Intelligent workflow automation and orchestration" color="#06B6D4" />

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Workflows" value={stats?.activeWorkflows ?? 0} />
        <MetricCard label="Executions Today" value={stats?.executionsToday ?? 0} />
        <MetricCard label="Success Rate" value={(stats?.successRate ?? 0).toFixed(1)} unit="%" />
        <MetricCard label="Pending Approvals" value={stats?.pendingApprovals ?? 0} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <button onClick={() => navigate('/cortex/bridge')} className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left">
          <span className="text-3xl mb-3 block">🔧</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Workflow Builder</h3>
          <p className="text-sm text-neutral-500">Create and edit automation workflows</p>
        </button>
        <button onClick={() => navigate('/cortex/bridge?tab=executions')} className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left">
          <span className="text-3xl mb-3 block">📊</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Execution History</h3>
          <p className="text-sm text-neutral-500">View past runs and logs</p>
        </button>
        <button onClick={() => navigate('/cortex/bridge?tab=approvals')} className="p-6 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all text-left">
          <span className="text-3xl mb-3 block">✅</span>
          <h3 className="font-semibold text-neutral-900 mb-1">Pending Approvals</h3>
          <p className="text-sm text-neutral-500">Review human-in-the-loop tasks</p>
        </button>
      </div>

      {/* Recent Activity - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Flow Executions</h3>
        <div className="space-y-3">
          {executions.length > 0 ? executions.map((exec) => (
            <div key={exec.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  exec.status === 'success' && 'bg-success-main',
                  exec.status === 'running' && 'bg-primary-500 animate-pulse',
                  exec.status === 'failed' && 'bg-error-main',
                  exec.status === 'pending' && 'bg-warning-main'
                )} />
                <span className="font-medium text-neutral-900">{exec.workflowName}</span>
              </div>
              <div className="flex items-center gap-4 text-sm text-neutral-500">
                <span>{formatDuration(exec.duration)}</span>
                <span>{formatRelativeTime(exec.startedAt)}</span>
              </div>
            </div>
          )) : (
            <p className="text-neutral-500 text-center py-4">No recent executions</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE HEALTH - Organizational Health
// =============================================================================

interface SystemHealth {
  overallScore: number;
  dimensions: Array<{ name: string; score: number; color: string }>;
  status: 'healthy' | 'degraded' | 'critical';
}

interface HealthAlert {
  id: string;
  severity: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  source: string;
  createdAt: string;
  acknowledged: boolean;
}

export const HealthPage: React.FC = () => {
  const navigate = useNavigate();
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [alerts, setAlerts] = useState<HealthAlert[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadHealthData = async () => {
      try {
        setIsLoading(true);
        const [healthRes, alertsRes] = await Promise.all([
          fetch('/api/v1/pillars/health/status?organizationId=demo'),
          fetch('/api/v1/pillars/health/alerts?organizationId=demo'),
        ]);
        
        const healthData = await healthRes.json();
        const alertsData = await alertsRes.json();
        
        if (healthData.success) setHealth(healthData.data);
        if (alertsData.success) setAlerts(alertsData.data || []);
      } catch (err) {
        console.error('Failed to load health data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadHealthData();
  }, []);

  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${diffMins} min ago`;
    return `${Math.floor(diffMs / 3600000)} hours ago`;
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return '#10B981';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="💓" name="The Health" tagline="Real-time organizational health monitoring" color="#EF4444" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          <span className="ml-3 text-neutral-500">Loading health data...</span>
        </div>
      </div>
    );
  }

  const overallScore = health?.overallScore ?? 0;

  return (
    <div className="p-6">
      <PillarHeader icon="💓" name="The Health" tagline="Real-time organizational health monitoring" color="#EF4444" />

      {/* Health Score - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-neutral-900">Overall Health Score</h3>
          <button onClick={() => navigate('/cortex/pulse')} className="text-sm text-primary-600 hover:text-primary-700">
            View Details →
          </button>
        </div>
        <div className="flex items-center gap-8">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="56" fill="none" stroke="#E5E7EB" strokeWidth="12" />
              <circle
                cx="64" cy="64" r="56" fill="none" stroke={getScoreColor(overallScore)} strokeWidth="12"
                strokeDasharray={`${overallScore * 3.52} 352`}
                strokeLinecap="round"
              />
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-3xl font-bold text-neutral-900">{Math.round(overallScore)}</span>
            </div>
          </div>
          <div className="flex-1 grid grid-cols-2 gap-4">
            {(health?.dimensions || []).map((dim, idx) => (
              <div key={idx} className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: dim.color || getScoreColor(dim.score) }} />
                <span className="text-neutral-600">{dim.name}</span>
                <span className="font-medium text-neutral-900 ml-auto">{Math.round(dim.score)}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Alerts - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Alerts</h3>
        <div className="space-y-3">
          {alerts.length > 0 ? alerts.map((alert) => (
            <div key={alert.id} className={cn(
              'p-4 rounded-lg border-l-4',
              alert.severity === 'critical' && 'bg-error-light border-error-main',
              alert.severity === 'warning' && 'bg-warning-light border-warning-main',
              alert.severity === 'info' && 'bg-primary-50 border-primary-500'
            )}>
              <div className="flex items-center justify-between">
                <div>
                  <span className="font-medium text-neutral-900">{alert.title}</span>
                  {alert.description && <p className="text-sm text-neutral-600 mt-1">{alert.description}</p>}
                </div>
                <span className="text-sm text-neutral-500">{formatRelativeTime(alert.createdAt)}</span>
              </div>
            </div>
          )) : (
            <p className="text-neutral-500 text-center py-4">No active alerts - all systems healthy</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE GUARD - Security Posture
// =============================================================================

interface SecurityPosture {
  securityScore: number;
  openVulnerabilities: number;
  complianceScore: number;
  daysSinceIncident: number;
  frameworks: Array<{
    id: string;
    name: string;
    status: 'compliant' | 'in_progress' | 'non_compliant';
    implementedControls: number;
    totalControls: number;
  }>;
}

interface SecurityThreat {
  id: string;
  type: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  detectedAt: string;
  status: string;
}

export const GuardPage: React.FC = () => {
  const [posture, setPosture] = useState<SecurityPosture | null>(null);
  const [threats, setThreats] = useState<SecurityThreat[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSecurityData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch security posture and threats from backend
        const [postureRes, threatsRes] = await Promise.all([
          fetch('/api/v1/pillars/guard/posture?organizationId=demo'),
          fetch('/api/v1/pillars/guard/threats?organizationId=demo'),
        ]);
        
        const postureData = await postureRes.json();
        const threatsData = await threatsRes.json();
        
        if (postureData.success && postureData.data) {
          setPosture(postureData.data);
        }
        
        if (threatsData.success && threatsData.data) {
          setThreats(threatsData.data);
        }
      } catch (err) {
        console.error('Failed to load security data:', err);
        setError('Failed to load security data');
      } finally {
        setIsLoading(false);
      }
    };
    
    loadSecurityData();
  }, []);

  // Format relative time
  const formatRelativeTime = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);
    
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours < 24) return `${diffHours} hours ago`;
    return `${diffDays} days ago`;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader
          icon="🛡️"
          name="The Guard"
          tagline="Proactive security posture and compliance monitoring"
          color="#F59E0B"
        />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
          <span className="ml-3 text-neutral-500">Loading security data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader
        icon="🛡️"
        name="The Guard"
        tagline="Proactive security posture and compliance monitoring"
        color="#F59E0B"
      />

      {error && (
        <div className="mb-6 p-4 bg-error-light text-error-dark rounded-lg">
          {error}
        </div>
      )}

      {/* Security Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard 
          label="Security Score" 
          value={Math.round(posture?.securityScore ?? 0)} 
          unit="/100" 
        />
        <MetricCard 
          label="Open Vulnerabilities" 
          value={posture?.openVulnerabilities ?? 0} 
        />
        <MetricCard 
          label="Compliance Status" 
          value={Math.round(posture?.complianceScore ?? 0)} 
          unit="%" 
        />
        <MetricCard 
          label="Days Since Incident" 
          value={posture?.daysSinceIncident ?? 0} 
        />
      </div>

      {/* Compliance Frameworks - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Compliance Status</h3>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {(posture?.frameworks || []).map((fw, idx) => (
            <div key={idx} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-neutral-900">{fw.name}</span>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  fw.status === 'compliant' ? 'bg-success-light text-success-dark' : 
                  fw.status === 'in_progress' ? 'bg-warning-light text-warning-dark' :
                  'bg-error-light text-error-dark'
                )}>
                  {fw.status === 'compliant' ? 'Compliant' : 
                   fw.status === 'in_progress' ? 'In Progress' : 'Non-Compliant'}
                </span>
              </div>
              <p className="text-sm text-neutral-500">{fw.implementedControls}/{fw.totalControls} controls</p>
            </div>
          ))}
          {(!posture?.frameworks || posture.frameworks.length === 0) && (
            <p className="col-span-4 text-neutral-500 text-center py-4">No compliance frameworks configured</p>
          )}
        </div>
      </div>

      {/* Threats - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Threat Detection</h3>
        <div className="space-y-3">
          {threats.length > 0 ? threats.map((threat) => (
            <div key={threat.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div className="flex items-center gap-3">
                <span className={cn(
                  'w-2 h-2 rounded-full',
                  threat.severity === 'critical' && 'bg-error-main',
                  threat.severity === 'high' && 'bg-error-main',
                  threat.severity === 'medium' && 'bg-warning-main',
                  threat.severity === 'low' && 'bg-neutral-400'
                )} />
                <div>
                  <p className="font-medium text-neutral-900">{threat.type}</p>
                  <p className="text-sm text-neutral-500">{threat.source}</p>
                </div>
              </div>
              <div className="text-right">
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  threat.status === 'resolved' ? 'bg-success-light text-success-dark' :
                  threat.status === 'investigating' ? 'bg-warning-light text-warning-dark' :
                  'bg-neutral-100 text-neutral-600'
                )}>
                  {threat.status}
                </span>
                <p className="text-xs text-neutral-500 mt-1">{formatRelativeTime(threat.detectedAt)}</p>
              </div>
            </div>
          )) : (
            <p className="text-neutral-500 text-center py-4">No active threats detected</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE ETHICS - Ethical Guardrails
// =============================================================================

interface EthicsStats {
  policyCompliance: number;
  biasChecks: number;
  flaggedDecisions: number;
  humanOverrides: number;
}

interface EthicsPrinciple {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  checksThisWeek: number;
}

interface EthicsReview {
  id: string;
  decisionName: string;
  result: 'approved' | 'flagged' | 'rejected';
  reviewedBy: string;
  reviewedAt: string;
}

export const EthicsPage: React.FC = () => {
  const [stats, setStats] = useState<EthicsStats | null>(null);
  const [principles, setPrinciples] = useState<EthicsPrinciple[]>([]);
  const [reviews, setReviews] = useState<EthicsReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadEthicsData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, principlesRes, reviewsRes] = await Promise.all([
          fetch('/api/v1/pillars/ethics/stats?organizationId=demo'),
          fetch('/api/v1/pillars/ethics/principles?organizationId=demo'),
          fetch('/api/v1/pillars/ethics/reviews?organizationId=demo'),
        ]);
        
        const statsData = await statsRes.json();
        const principlesData = await principlesRes.json();
        const reviewsData = await reviewsRes.json();
        
        if (statsData.success) setStats(statsData.data);
        if (principlesData.success) setPrinciples(principlesData.data || []);
        if (reviewsData.success) setReviews(reviewsData.data || []);
      } catch (err) {
        console.error('Failed to load ethics data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadEthicsData();
  }, []);

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="⚖️" name="The Ethics" tagline="Built-in ethical guardrails and governance" color="#EC4899" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
          <span className="ml-3 text-neutral-500">Loading ethics data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader icon="⚖️" name="The Ethics" tagline="Built-in ethical guardrails and governance" color="#EC4899" />

      {/* Ethics Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Policy Compliance" value={(stats?.policyCompliance ?? 0).toFixed(1)} unit="%" />
        <MetricCard label="Bias Checks" value={stats?.biasChecks ?? 0} />
        <MetricCard label="Flagged Decisions" value={stats?.flaggedDecisions ?? 0} />
        <MetricCard label="Human Overrides" value={stats?.humanOverrides ?? 0} />
      </div>

      {/* Ethical Principles - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6 mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Active Ethical Principles</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {principles.length > 0 ? principles.map((principle) => (
            <div key={principle.id} className="p-4 bg-neutral-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-neutral-900">{principle.name}</h4>
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  principle.status === 'active' ? 'bg-success-light text-success-dark' : 'bg-neutral-100 text-neutral-600'
                )}>
                  {principle.status}
                </span>
              </div>
              <p className="text-sm text-neutral-600 mb-2">{principle.description}</p>
              <p className="text-xs text-neutral-500">{principle.checksThisWeek} checks this week</p>
            </div>
          )) : (
            <p className="col-span-2 text-neutral-500 text-center py-4">No ethical principles configured</p>
          )}
        </div>
      </div>

      {/* Recent Reviews - REAL DATA */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Recent Ethics Reviews</h3>
        <div className="space-y-3">
          {reviews.length > 0 ? reviews.map((review) => (
            <div key={review.id} className="flex items-center justify-between p-3 bg-neutral-50 rounded-lg">
              <div>
                <p className="font-medium text-neutral-900">{review.decisionName}</p>
                <p className="text-sm text-neutral-500">Reviewed by {review.reviewedBy}</p>
              </div>
              <div className="text-right">
                <span className={cn(
                  'text-xs px-2 py-1 rounded-full',
                  review.result === 'approved' ? 'bg-success-light text-success-dark' : 
                  review.result === 'flagged' ? 'bg-warning-light text-warning-dark' : 'bg-error-light text-error-dark'
                )}>
                  {review.result}
                </span>
                <p className="text-xs text-neutral-500 mt-1">{formatDate(review.reviewedAt)}</p>
              </div>
            </div>
          )) : (
            <p className="text-neutral-500 text-center py-4">No recent reviews</p>
          )}
        </div>
      </div>
    </div>
  );
};

// =============================================================================
// THE AGENTS - AI Advisors
// =============================================================================

interface AgentStats {
  activeAgents: number;
  queriesToday: number;
  avgResponseTime: number;
  satisfaction: number;
}

interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  icon: string;
  status: 'online' | 'busy' | 'offline';
  queriesToday: number;
}

export const AgentsPage: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState<AgentStats | null>(null);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAgentsData = async () => {
      try {
        setIsLoading(true);
        const [statsRes, agentsRes] = await Promise.all([
          fetch('/api/v1/pillars/agents/stats?organizationId=demo'),
          fetch('/api/v1/pillars/agents?organizationId=demo'),
        ]);
        
        const statsData = await statsRes.json();
        const agentsData = await agentsRes.json();
        
        if (statsData.success) setStats(statsData.data);
        if (agentsData.success) setAgents(agentsData.data || []);
      } catch (err) {
        console.error('Failed to load agents data:', err);
      } finally {
        setIsLoading(false);
      }
    };
    loadAgentsData();
  }, []);

  const getAgentIcon = (code: string): string => {
    const icons: Record<string, string> = {
      'chief': '👔', 'cfo': '💰', 'coo': '⚙️', 'ciso': '🔒', 'cto': '💻',
      'cmo': '📢', 'cro': '📈', 'cdo': '📊', 'risk': '⚠️', 'clo': '⚖️',
      'chro': '👥', 'cso': '🌍', 'cco': '📰', 'caio': '🤖',
    };
    return icons[code.toLowerCase()] || '🤖';
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <PillarHeader icon="🤖" name="The Agents" tagline="AI advisors for every domain - The Pantheon" color="#6366F1" />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500"></div>
          <span className="ml-3 text-neutral-500">Loading agents data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <PillarHeader icon="🤖" name="The Agents" tagline="AI advisors for every domain - The Pantheon" color="#6366F1" />

      {/* Stats - REAL DATA */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <MetricCard label="Active Agents" value={stats?.activeAgents ?? agents.filter(a => a.status === 'online').length} />
        <MetricCard label="Queries Today" value={stats?.queriesToday ?? agents.reduce((sum, a) => sum + a.queriesToday, 0)} />
        <MetricCard label="Avg Response" value={(stats?.avgResponseTime ?? 0).toFixed(1)} unit="s" />
        <MetricCard label="Satisfaction" value={(stats?.satisfaction ?? 0).toFixed(1)} unit="/5" />
      </div>

      {/* Agent Grid - REAL DATA */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {agents.length > 0 ? agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => navigate(`/cortex/council?agent=${agent.code}`)}
            className="p-4 bg-white rounded-xl border border-neutral-200 hover:border-primary-500 hover:shadow-md transition-all cursor-pointer"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-3xl">{agent.icon || getAgentIcon(agent.code)}</span>
              <span className={cn(
                'w-2 h-2 rounded-full',
                agent.status === 'online' && 'bg-success-main',
                agent.status === 'busy' && 'bg-warning-main',
                agent.status === 'offline' && 'bg-neutral-300'
              )} />
            </div>
            <h4 className="font-semibold text-neutral-900">{agent.name}</h4>
            <p className="text-sm text-neutral-500">{agent.role}</p>
            <p className="text-xs text-neutral-400 mt-2">{agent.queriesToday} queries today</p>
          </div>
        )) : (
          <p className="col-span-4 text-neutral-500 text-center py-8">No agents configured</p>
        )}
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-neutral-200 p-6">
        <h3 className="text-lg font-semibold text-neutral-900 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button onClick={() => navigate('/cortex/council')} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            Ask The Council
          </button>
          <button onClick={() => navigate('/cortex/council?mode=deliberation')} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
            Start Deliberation
          </button>
          <button onClick={() => navigate('/cortex/council?tab=history')} className="px-4 py-2 bg-neutral-100 text-neutral-700 rounded-lg hover:bg-neutral-200 transition-colors">
            View Decision History
          </button>
        </div>
      </div>
    </div>
  );
};

export default HelmPage;
