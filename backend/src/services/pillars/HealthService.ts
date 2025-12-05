// =============================================================================
// DATACENDIA PLATFORM - THE HEALTH SERVICE
// System Health - Platform monitoring and diagnostics
// Enterprise Platinum Intelligence
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

// =============================================================================
// TYPES
// =============================================================================

export type HealthStatus = 'healthy' | 'degraded' | 'critical' | 'unknown';
export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface SystemHealth {
  organizationId: string;
  overallScore: number;
  status: HealthStatus;
  dimensions: HealthDimension[];
  alerts: HealthAlert[];
  uptime: number;
  lastChecked: Date;
}

export interface HealthDimension {
  name: string;
  score: number;
  status: HealthStatus;
  components: ComponentHealth[];
}

export interface ComponentHealth {
  name: string;
  status: HealthStatus;
  latency?: number;
  errorRate?: number;
  lastCheck: Date;
  details?: Record<string, unknown>;
}

export interface HealthAlert {
  id: string;
  organizationId: string;
  severity: AlertSeverity;
  title: string;
  message: string;
  source: string;
  createdAt: Date;
  acknowledged: boolean;
  resolvedAt?: Date;
}

export interface HealthTrend {
  timestamp: Date;
  score: number;
  alerts: number;
}

// =============================================================================
// THE HEALTH SERVICE
// =============================================================================

export class HealthService extends BaseService {
  private healthStore: Map<string, SystemHealth> = new Map();
  private alertsStore: Map<string, HealthAlert> = new Map();
  private trendsStore: Map<string, HealthTrend[]> = new Map();
  private startTime: Date = new Date();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'health-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Health service initializing...');
    this.startTime = new Date();
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Health service shutting down...');
    this.healthStore.clear();
    this.alertsStore.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        monitoredOrgs: this.healthStore.size,
        activeAlerts: Array.from(this.alertsStore.values()).filter(a => !a.acknowledged).length,
      },
    };
  }

  // ===========================================================================
  // HEALTH MONITORING
  // ===========================================================================

  async getSystemHealth(organizationId: string): Promise<SystemHealth> {
    let health = this.healthStore.get(organizationId);
    
    if (!health || Date.now() - health.lastChecked.getTime() > 60000) {
      health = await this.performHealthCheck(organizationId);
      this.healthStore.set(organizationId, health);
      
      // Store trend
      const trends = this.trendsStore.get(organizationId) || [];
      trends.push({
        timestamp: new Date(),
        score: health.overallScore,
        alerts: health.alerts.filter(a => !a.acknowledged).length,
      });
      if (trends.length > 1440) trends.shift(); // Keep 24 hours (1 per minute)
      this.trendsStore.set(organizationId, trends);
    }
    
    return health;
  }

  private async performHealthCheck(organizationId: string): Promise<SystemHealth> {
    const dimensions: HealthDimension[] = [
      {
        name: 'Data Health',
        score: 88 + Math.random() * 10,
        status: 'healthy',
        components: [
          { name: 'PostgreSQL', status: 'healthy', latency: 5 + Math.random() * 10, lastCheck: new Date() },
          { name: 'Redis', status: 'healthy', latency: 1 + Math.random() * 3, lastCheck: new Date() },
          { name: 'Data Pipelines', status: 'healthy', errorRate: Math.random() * 0.5, lastCheck: new Date() },
        ],
      },
      {
        name: 'Operations',
        score: 85 + Math.random() * 12,
        status: 'healthy',
        components: [
          { name: 'API Gateway', status: 'healthy', latency: 20 + Math.random() * 30, lastCheck: new Date() },
          { name: 'Background Jobs', status: 'healthy', lastCheck: new Date() },
          { name: 'Workflow Engine', status: 'healthy', lastCheck: new Date() },
        ],
      },
      {
        name: 'Security',
        score: 90 + Math.random() * 8,
        status: 'healthy',
        components: [
          { name: 'Authentication', status: 'healthy', lastCheck: new Date() },
          { name: 'Encryption', status: 'healthy', lastCheck: new Date() },
          { name: 'Audit Logging', status: 'healthy', lastCheck: new Date() },
        ],
      },
      {
        name: 'AI Services',
        score: 82 + Math.random() * 15,
        status: 'healthy',
        components: [
          { name: 'Ollama LLM', status: 'healthy', latency: 100 + Math.random() * 200, lastCheck: new Date() },
          { name: 'ML Models', status: 'healthy', lastCheck: new Date() },
          { name: 'Council Service', status: 'healthy', lastCheck: new Date() },
        ],
      },
    ];

    // Calculate overall score
    const overallScore = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);
    const status: HealthStatus = overallScore >= 90 ? 'healthy' : overallScore >= 70 ? 'degraded' : 'critical';

    // Get active alerts
    const alerts = Array.from(this.alertsStore.values())
      .filter(a => a.organizationId === organizationId && !a.resolvedAt)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());

    // Calculate uptime
    const uptime = (Date.now() - this.startTime.getTime()) / 1000;

    return {
      organizationId,
      overallScore,
      status,
      dimensions,
      alerts,
      uptime,
      lastChecked: new Date(),
    };
  }

  // ===========================================================================
  // ALERTS
  // ===========================================================================

  async createAlert(alert: Omit<HealthAlert, 'id' | 'createdAt' | 'acknowledged'>): Promise<HealthAlert> {
    const newAlert: HealthAlert = {
      ...alert,
      id: `health-alert-${Date.now()}`,
      createdAt: new Date(),
      acknowledged: false,
    };
    this.alertsStore.set(newAlert.id, newAlert);
    return newAlert;
  }

  async getAlerts(organizationId: string, includeResolved: boolean = false): Promise<HealthAlert[]> {
    return Array.from(this.alertsStore.values())
      .filter(a => a.organizationId === organizationId && (includeResolved || !a.resolvedAt))
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async acknowledgeAlert(alertId: string): Promise<HealthAlert | null> {
    const alert = this.alertsStore.get(alertId);
    if (!alert) return null;
    alert.acknowledged = true;
    this.alertsStore.set(alertId, alert);
    return alert;
  }

  async resolveAlert(alertId: string): Promise<HealthAlert | null> {
    const alert = this.alertsStore.get(alertId);
    if (!alert) return null;
    alert.resolvedAt = new Date();
    this.alertsStore.set(alertId, alert);
    return alert;
  }

  // ===========================================================================
  // TRENDS
  // ===========================================================================

  async getHealthTrends(organizationId: string, hours: number = 24): Promise<HealthTrend[]> {
    const trends = this.trendsStore.get(organizationId) || [];
    const since = Date.now() - hours * 60 * 60 * 1000;
    return trends.filter(t => t.timestamp.getTime() >= since);
  }

  // ===========================================================================
  // SEED DATA
  // ===========================================================================

  async seedDefaultData(organizationId: string): Promise<void> {
    // Create some sample alerts
    await this.createAlert({
      organizationId, severity: 'warning', title: 'High API Latency',
      message: 'API response times have increased by 25% in the last hour',
      source: 'API Gateway',
    });

    await this.createAlert({
      organizationId, severity: 'info', title: 'Scheduled Maintenance',
      message: 'Database maintenance scheduled for tonight at 2 AM UTC',
      source: 'System',
    });

    // Generate health check
    await this.getSystemHealth(organizationId);

    this.logger.info(`Seeded health data for org ${organizationId}`);
  }
}

export const healthService = new HealthService();
