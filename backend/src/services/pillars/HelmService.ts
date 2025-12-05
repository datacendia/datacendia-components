// =============================================================================
// DATACENDIA PLATFORM - THE HELM SERVICE
// Command & Control - Single source of truth for organizational metrics
// Enterprise Platinum Intelligence
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

// =============================================================================
// TYPES
// =============================================================================

export type MetricCategory = 'financial' | 'operational' | 'customer' | 'people' | 'strategic' | 'compliance';
export type MetricStatus = 'on_target' | 'at_risk' | 'critical' | 'exceeded' | 'not_set';
export type TrendDirection = 'up' | 'down' | 'stable';

export interface Metric {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  category: MetricCategory;
  currentValue: number;
  targetValue: number;
  previousValue?: number;
  unit: string;
  status: MetricStatus;
  trend: TrendDirection;
  changePercent: number;
  warningThreshold?: number;
  criticalThreshold?: number;
  source: string;
  lastUpdated: Date;
  refreshInterval: number;
  history?: MetricDataPoint[];
}

export interface MetricDataPoint {
  timestamp: Date;
  value: number;
}

export interface KPIDashboard {
  organizationId: string;
  totalMetrics: number;
  onTarget: number;
  atRisk: number;
  critical: number;
  exceeded: number;
  overallHealth: number;
  categories: CategorySummary[];
  topMetrics: Metric[];
  alerts: MetricAlert[];
  lastRefresh: Date;
}

export interface CategorySummary {
  category: MetricCategory;
  totalMetrics: number;
  avgPerformance: number;
  trend: TrendDirection;
  status: MetricStatus;
}

export interface MetricAlert {
  id: string;
  organizationId: string;
  metricId: string;
  metricName: string;
  severity: 'warning' | 'critical';
  message: string;
  triggeredAt: Date;
  acknowledged: boolean;
}

// =============================================================================
// THE HELM SERVICE
// =============================================================================

export class HelmService extends BaseService {
  private metricsStore: Map<string, Metric> = new Map();
  private alertsStore: Map<string, MetricAlert> = new Map();
  private historyStore: Map<string, MetricDataPoint[]> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'helm-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Helm service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Helm service shutting down...');
    this.metricsStore.clear();
    this.alertsStore.clear();
    this.historyStore.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { totalMetrics: this.metricsStore.size, totalAlerts: this.alertsStore.size },
    };
  }

  // ===========================================================================
  // METRIC MANAGEMENT
  // ===========================================================================

  async createMetric(metric: Omit<Metric, 'id' | 'status' | 'trend' | 'changePercent' | 'lastUpdated'>): Promise<Metric> {
    const id = `metric-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const status = this.calculateStatus(metric.currentValue, metric.targetValue, metric.warningThreshold, metric.criticalThreshold);
    const changePercent = metric.previousValue 
      ? ((metric.currentValue - metric.previousValue) / metric.previousValue) * 100 
      : 0;
    const trend: TrendDirection = changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable';

    const newMetric: Metric = {
      ...metric,
      id,
      status,
      trend,
      changePercent: Math.round(changePercent * 100) / 100,
      lastUpdated: new Date(),
    };

    this.metricsStore.set(id, newMetric);
    return newMetric;
  }

  async updateMetricValue(metricId: string, newValue: number): Promise<Metric | null> {
    const metric = this.metricsStore.get(metricId);
    if (!metric) return null;

    const previousValue = metric.currentValue;
    const changePercent = previousValue !== 0 ? ((newValue - previousValue) / previousValue) * 100 : 0;
    const trend: TrendDirection = changePercent > 1 ? 'up' : changePercent < -1 ? 'down' : 'stable';
    const status = this.calculateStatus(newValue, metric.targetValue, metric.warningThreshold, metric.criticalThreshold);

    // Store history point
    const history = this.historyStore.get(metricId) || [];
    history.push({ timestamp: metric.lastUpdated, value: previousValue });
    this.historyStore.set(metricId, history);

    // Update metric
    metric.currentValue = newValue;
    metric.previousValue = previousValue;
    metric.changePercent = Math.round(changePercent * 100) / 100;
    metric.trend = trend;
    metric.status = status;
    metric.lastUpdated = new Date();

    this.metricsStore.set(metricId, metric);
    await this.checkMetricAlerts(metric);
    return metric;
  }

  async getMetric(metricId: string): Promise<Metric | null> {
    return this.metricsStore.get(metricId) || null;
  }

  async getOrgMetrics(organizationId: string, category?: MetricCategory): Promise<Metric[]> {
    const allMetrics = Array.from(this.metricsStore.values());
    let metrics = allMetrics.filter(m => m.organizationId === organizationId);
    if (category) metrics = metrics.filter(m => m.category === category);
    return metrics;
  }

  async getMetricHistory(metricId: string, days: number = 30): Promise<MetricDataPoint[]> {
    const since = new Date();
    since.setDate(since.getDate() - days);
    const history = this.historyStore.get(metricId) || [];
    return history.filter(h => h.timestamp >= since);
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getKPIDashboard(organizationId: string): Promise<KPIDashboard> {
    const metrics = await this.getOrgMetrics(organizationId);
    
    // Calculate counts
    const onTarget = metrics.filter(m => m.status === 'on_target' || m.status === 'exceeded').length;
    const atRisk = metrics.filter(m => m.status === 'at_risk').length;
    const critical = metrics.filter(m => m.status === 'critical').length;
    const exceeded = metrics.filter(m => m.status === 'exceeded').length;

    // Calculate overall health
    const healthScore = metrics.length > 0
      ? Math.round((onTarget / metrics.length) * 100)
      : 100;

    // Category summaries
    const categories: MetricCategory[] = ['financial', 'operational', 'customer', 'people', 'strategic', 'compliance'];
    const categorySummaries: CategorySummary[] = categories.map(cat => {
      const catMetrics = metrics.filter(m => m.category === cat);
      const avgPerf = catMetrics.length > 0
        ? catMetrics.reduce((sum, m) => sum + (m.currentValue / m.targetValue) * 100, 0) / catMetrics.length
        : 0;
      
      const catOnTarget = catMetrics.filter(m => m.status === 'on_target' || m.status === 'exceeded').length;
      const catAtRisk = catMetrics.filter(m => m.status === 'at_risk').length;
      const catCritical = catMetrics.filter(m => m.status === 'critical').length;

      return {
        category: cat,
        totalMetrics: catMetrics.length,
        avgPerformance: Math.round(avgPerf),
        trend: avgPerf > 100 ? 'up' : avgPerf < 90 ? 'down' : 'stable',
        status: catCritical > 0 ? 'critical' : catAtRisk > 0 ? 'at_risk' : 'on_target',
      };
    });

    // Get active alerts
    const alerts = await this.getActiveAlerts(organizationId);

    // Top metrics (most important / critical first)
    const topMetrics = [...metrics]
      .sort((a, b) => {
        if (a.status === 'critical' && b.status !== 'critical') return -1;
        if (a.status !== 'critical' && b.status === 'critical') return 1;
        if (a.status === 'at_risk' && b.status !== 'at_risk') return -1;
        return 0;
      })
      .slice(0, 10);

    return {
      organizationId,
      totalMetrics: metrics.length,
      onTarget,
      atRisk,
      critical,
      exceeded,
      overallHealth: healthScore,
      categories: categorySummaries,
      topMetrics,
      alerts,
      lastRefresh: new Date(),
    };
  }

  // ===========================================================================
  // ALERTS
  // ===========================================================================

  private async checkMetricAlerts(metric: Metric): Promise<void> {
    if (metric.status === 'critical') {
      await this.createAlert({
        metricId: metric.id,
        metricName: metric.name,
        severity: 'critical',
        message: `${metric.name} has reached critical level: ${metric.currentValue}${metric.unit}`,
        organizationId: metric.organizationId,
      });
    } else if (metric.status === 'at_risk') {
      await this.createAlert({
        metricId: metric.id,
        metricName: metric.name,
        severity: 'warning',
        message: `${metric.name} is at risk: ${metric.currentValue}${metric.unit} (target: ${metric.targetValue}${metric.unit})`,
        organizationId: metric.organizationId,
      });
    }
  }

  private async createAlert(alert: Omit<MetricAlert, 'id' | 'triggeredAt' | 'acknowledged'>): Promise<void> {
    const newAlert: MetricAlert = {
      id: `alert-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      ...alert,
      triggeredAt: new Date(),
      acknowledged: false,
    };
    this.alertsStore.set(newAlert.id, newAlert);
  }

  async getActiveAlerts(organizationId: string): Promise<MetricAlert[]> {
    const alerts = Array.from(this.alertsStore.values())
      .filter(a => a.organizationId === organizationId && !a.acknowledged)
      .sort((a, b) => b.triggeredAt.getTime() - a.triggeredAt.getTime())
      .slice(0, 20);
    return alerts;
  }

  async acknowledgeAlert(alertId: string): Promise<void> {
    const alert = this.alertsStore.get(alertId);
    if (alert) {
      alert.acknowledged = true;
      this.alertsStore.set(alertId, alert);
    }
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private calculateStatus(
    current: number, 
    target: number, 
    warning?: number, 
    critical?: number
  ): MetricStatus {
    const ratio = current / target;
    
    if (ratio >= 1) return 'exceeded';
    if (critical && current <= critical) return 'critical';
    if (warning && current <= warning) return 'at_risk';
    if (ratio >= 0.9) return 'on_target';
    if (ratio >= 0.7) return 'at_risk';
    return 'critical';
  }

  private async loadAllOrganizationMetrics(): Promise<void> {
    // Metrics are loaded on-demand from the store
  }

  // ===========================================================================
  // SEED DEFAULT METRICS
  // ===========================================================================

  async seedDefaultMetrics(organizationId: string): Promise<void> {
    const defaultMetrics: Omit<Metric, 'id' | 'status' | 'trend' | 'changePercent' | 'lastUpdated'>[] = [
      // Financial
      { organizationId, name: 'Monthly Revenue', description: 'Total monthly revenue', category: 'financial', currentValue: 450000, targetValue: 500000, previousValue: 420000, unit: '$', source: 'ERP', refreshInterval: 3600, warningThreshold: 400000, criticalThreshold: 350000 },
      { organizationId, name: 'EBITDA Margin', description: 'EBITDA as % of revenue', category: 'financial', currentValue: 22, targetValue: 25, previousValue: 21, unit: '%', source: 'Finance', refreshInterval: 86400, warningThreshold: 18, criticalThreshold: 15 },
      { organizationId, name: 'Operating Cash Flow', description: 'Monthly operating cash flow', category: 'financial', currentValue: 125000, targetValue: 150000, previousValue: 118000, unit: '$', source: 'Treasury', refreshInterval: 86400 },
      { organizationId, name: 'Burn Rate', description: 'Monthly cash burn', category: 'financial', currentValue: 85000, targetValue: 75000, previousValue: 90000, unit: '$', source: 'Finance', refreshInterval: 86400, warningThreshold: 90000, criticalThreshold: 100000 },

      // Operational
      { organizationId, name: 'Process Efficiency', description: 'Overall process efficiency', category: 'operational', currentValue: 87, targetValue: 90, previousValue: 85, unit: '%', source: 'Operations', refreshInterval: 3600 },
      { organizationId, name: 'Cycle Time', description: 'Average process cycle time', category: 'operational', currentValue: 4.2, targetValue: 3.5, previousValue: 4.5, unit: 'days', source: 'Operations', refreshInterval: 3600, warningThreshold: 5, criticalThreshold: 7 },
      { organizationId, name: 'Throughput', description: 'Daily throughput volume', category: 'operational', currentValue: 1250, targetValue: 1500, previousValue: 1180, unit: 'units', source: 'Production', refreshInterval: 1800 },
      { organizationId, name: 'Utilization', description: 'Resource utilization rate', category: 'operational', currentValue: 78, targetValue: 85, previousValue: 75, unit: '%', source: 'HR', refreshInterval: 3600 },

      // Customer
      { organizationId, name: 'NPS Score', description: 'Net Promoter Score', category: 'customer', currentValue: 45, targetValue: 50, previousValue: 42, unit: '', source: 'Surveys', refreshInterval: 604800 },
      { organizationId, name: 'Customer Churn', description: 'Monthly churn rate', category: 'customer', currentValue: 2.3, targetValue: 2.0, previousValue: 2.5, unit: '%', source: 'CRM', refreshInterval: 86400, warningThreshold: 3, criticalThreshold: 5 },
      { organizationId, name: 'Customer LTV', description: 'Average customer lifetime value', category: 'customer', currentValue: 12500, targetValue: 15000, previousValue: 11800, unit: '$', source: 'Analytics', refreshInterval: 86400 },
      { organizationId, name: 'CAC', description: 'Customer acquisition cost', category: 'customer', currentValue: 850, targetValue: 700, previousValue: 920, unit: '$', source: 'Marketing', refreshInterval: 86400, warningThreshold: 1000, criticalThreshold: 1200 },

      // People
      { organizationId, name: 'Employee Headcount', description: 'Total employees', category: 'people', currentValue: 127, targetValue: 150, previousValue: 120, unit: '', source: 'HR', refreshInterval: 86400 },
      { organizationId, name: 'Turnover Rate', description: 'Annual turnover rate', category: 'people', currentValue: 12, targetValue: 10, previousValue: 14, unit: '%', source: 'HR', refreshInterval: 604800, warningThreshold: 15, criticalThreshold: 20 },
      { organizationId, name: 'Engagement Score', description: 'Employee engagement score', category: 'people', currentValue: 7.8, targetValue: 8.5, previousValue: 7.5, unit: '/10', source: 'Surveys', refreshInterval: 2592000 },
      { organizationId, name: 'Productivity Index', description: 'Revenue per employee', category: 'people', currentValue: 3540, targetValue: 4000, previousValue: 3500, unit: '$/emp', source: 'Analytics', refreshInterval: 86400 },
    ];

    for (const metric of defaultMetrics) {
      await this.createMetric(metric);
    }
    this.logger.info(`Seeded ${defaultMetrics.length} default metrics for org ${organizationId}`);
  }

  async hasMetricsForOrg(organizationId: string): Promise<boolean> {
    const metrics = await this.getOrgMetrics(organizationId);
    return metrics.length > 0;
  }
}

export const helmService = new HelmService();
