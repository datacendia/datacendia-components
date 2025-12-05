// =============================================================================
// CENDIENERVE™ - IT OPERATIONS & INFRASTRUCTURE INTELLIGENCE
// "The Self-Healing Grid" - AI-powered IT operations and incident response
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface SystemService {
  id: string;
  name: string;
  type: 'api' | 'database' | 'cache' | 'queue' | 'storage' | 'compute' | 'network' | 'security';
  status: 'healthy' | 'degraded' | 'down' | 'maintenance';
  uptime: number; // percentage
  latency: number; // ms
  errorRate: number; // percentage
  throughput: number; // requests/second
  dependencies: string[];
  lastHealthCheck: Date;
  metadata: Record<string, any>;
}

export interface Incident {
  id: string;
  title: string;
  severity: 'p1' | 'p2' | 'p3' | 'p4';
  status: 'detected' | 'investigating' | 'identified' | 'resolving' | 'resolved' | 'postmortem';
  affectedServices: string[];
  rootCause?: string;
  resolution?: string;
  timeline: IncidentEvent[];
  assignee?: string;
  detectedAt: Date;
  resolvedAt?: Date;
  customerImpact: CustomerImpact;
}

export interface IncidentEvent {
  timestamp: Date;
  type: 'detection' | 'escalation' | 'update' | 'action' | 'resolution';
  description: string;
  actor: string;
  automated: boolean;
}

export interface CustomerImpact {
  affected: boolean;
  scope: 'none' | 'minimal' | 'partial' | 'significant' | 'total';
  estimatedUsers: number;
  revenueAtRisk: number;
  slaViolation: boolean;
}

export interface ThreatDetection {
  id: string;
  type: 'intrusion' | 'malware' | 'ddos' | 'data_exfiltration' | 'anomaly' | 'vulnerability';
  severity: 'low' | 'medium' | 'high' | 'critical';
  source: string;
  target: string;
  description: string;
  indicators: string[];
  recommendedAction: string;
  automated: boolean;
  detectedAt: Date;
  status: 'detected' | 'contained' | 'remediated' | 'false_positive';
}

export interface LazarusProtocol {
  id: string;
  trigger: string;
  status: 'standby' | 'activated' | 'executing' | 'complete' | 'failed';
  isolatedSystems: string[];
  backupSystems: string[];
  rebuildProgress: number;
  steps: LazarusStep[];
  estimatedRecovery: Date;
  activatedAt?: Date;
  completedAt?: Date;
}

export interface LazarusStep {
  order: number;
  name: string;
  status: 'pending' | 'in_progress' | 'complete' | 'failed';
  duration?: number;
  output?: string;
}

export interface CapacityForecast {
  service: string;
  metric: 'cpu' | 'memory' | 'storage' | 'network' | 'connections';
  currentUsage: number;
  predictedUsage: number;
  threshold: number;
  daysUntilThreshold: number;
  recommendation: string;
  confidence: number;
}

export interface CostOptimization {
  category: string;
  currentCost: number;
  optimizedCost: number;
  savings: number;
  savingsPercentage: number;
  recommendation: string;
  effort: 'low' | 'medium' | 'high';
  risk: 'low' | 'medium' | 'high';
}

export interface ChangeRequest {
  id: string;
  title: string;
  type: 'standard' | 'normal' | 'emergency';
  status: 'draft' | 'pending_approval' | 'approved' | 'scheduled' | 'in_progress' | 'complete' | 'failed' | 'rolled_back';
  description: string;
  affectedServices: string[];
  riskAssessment: RiskAssessment;
  scheduledStart?: Date;
  scheduledEnd?: Date;
  rollbackPlan: string;
  approvers: string[];
  createdBy: string;
  createdAt: Date;
}

export interface RiskAssessment {
  score: number;
  level: 'low' | 'medium' | 'high' | 'critical';
  factors: { factor: string; weight: number; score: number }[];
  mitigations: string[];
  recommendations: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaNerveService {
  private services: Map<string, SystemService> = new Map();
  private incidents: Map<string, Incident> = new Map();
  private threats: Map<string, ThreatDetection> = new Map();
  private lazarusProtocols: Map<string, LazarusProtocol> = new Map();
  private changeRequests: Map<string, ChangeRequest> = new Map();

  constructor() {
    logger.info('CendiaNerve™ initialized - The Self-Healing Grid is online');
  }

  // ---------------------------------------------------------------------------
  // SERVICE MONITORING
  // ---------------------------------------------------------------------------

  registerService(service: Omit<SystemService, 'id' | 'lastHealthCheck'>): SystemService {
    const newService: SystemService = {
      ...service,
      id: `svc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastHealthCheck: new Date(),
    };
    this.services.set(newService.id, newService);
    logger.info(`CendiaNerve: Registered service ${newService.name}`);
    return newService;
  }

  updateServiceHealth(serviceId: string, update: Partial<SystemService>): SystemService | null {
    const service = this.services.get(serviceId);
    if (!service) return null;

    Object.assign(service, update, { lastHealthCheck: new Date() });

    // Auto-detect incidents if service degrades
    if (service.status === 'down' || service.status === 'degraded') {
      this.autoDetectIncident(service);
    }

    return service;
  }

  getService(serviceId: string): SystemService | null {
    return this.services.get(serviceId) || null;
  }

  getAllServices(): SystemService[] {
    return Array.from(this.services.values());
  }

  getServicesByStatus(status: SystemService['status']): SystemService[] {
    return Array.from(this.services.values()).filter(s => s.status === status);
  }

  // ---------------------------------------------------------------------------
  // INCIDENT MANAGEMENT
  // ---------------------------------------------------------------------------

  private autoDetectIncident(service: SystemService): void {
    // Check if incident already exists for this service
    const existingIncident = Array.from(this.incidents.values()).find(
      i => i.affectedServices.includes(service.id) && 
           i.status !== 'resolved' && 
           i.status !== 'postmortem'
    );

    if (!existingIncident) {
      this.createIncident({
        title: `${service.name} ${service.status === 'down' ? 'Outage' : 'Degradation'} Detected`,
        severity: service.status === 'down' ? 'p1' : 'p2',
        affectedServices: [service.id],
        customerImpact: {
          affected: true,
          scope: service.status === 'down' ? 'significant' : 'partial',
          estimatedUsers: 1000,
          revenueAtRisk: 10000,
          slaViolation: service.status === 'down',
        },
      });
    }
  }

  createIncident(incident: Omit<Incident, 'id' | 'status' | 'timeline' | 'detectedAt'>): Incident {
    const newIncident: Incident = {
      ...incident,
      id: `inc-${Date.now()}`,
      status: 'detected',
      timeline: [{
        timestamp: new Date(),
        type: 'detection',
        description: 'Incident auto-detected by CendiaNerve™',
        actor: 'CendiaNerve',
        automated: true,
      }],
      detectedAt: new Date(),
    };
    this.incidents.set(newIncident.id, newIncident);
    logger.warn(`CendiaNerve: Incident created - ${newIncident.title} (${newIncident.severity})`);
    
    // Auto-escalate P1 incidents
    if (newIncident.severity === 'p1') {
      this.escalateIncident(newIncident.id);
    }

    return newIncident;
  }

  escalateIncident(incidentId: string): void {
    const incident = this.incidents.get(incidentId);
    if (!incident) return;

    incident.timeline.push({
      timestamp: new Date(),
      type: 'escalation',
      description: 'Incident escalated to on-call team',
      actor: 'CendiaNerve',
      automated: true,
    });

    logger.warn(`CendiaNerve: Incident ${incidentId} escalated`);
  }

  updateIncident(incidentId: string, update: Partial<Incident>): Incident | null {
    const incident = this.incidents.get(incidentId);
    if (!incident) return null;

    if (update.status && update.status !== incident.status) {
      incident.timeline.push({
        timestamp: new Date(),
        type: 'update',
        description: `Status changed from ${incident.status} to ${update.status}`,
        actor: update.assignee || 'System',
        automated: false,
      });
    }

    Object.assign(incident, update);

    if (incident.status === 'resolved') {
      incident.resolvedAt = new Date();
    }

    return incident;
  }

  async analyzeIncident(incidentId: string): Promise<{ rootCause: string; recommendations: string[] }> {
    const incident = this.incidents.get(incidentId);
    if (!incident) throw new Error(`Incident ${incidentId} not found`);

    const affectedServiceDetails = incident.affectedServices
      .map(id => this.services.get(id))
      .filter(Boolean);

    const prompt = `You are CendiaNerve™, an AI IT operations system analyzing an incident.

INCIDENT: ${incident.title}
SEVERITY: ${incident.severity}
AFFECTED SERVICES: ${affectedServiceDetails.map(s => `${s!.name} (${s!.type})`).join(', ')}
CUSTOMER IMPACT: ${incident.customerImpact.scope} - ${incident.customerImpact.estimatedUsers} users affected

SERVICE METRICS:
${affectedServiceDetails.map(s => `- ${s!.name}: Status=${s!.status}, Latency=${s!.latency}ms, ErrorRate=${s!.errorRate}%`).join('\n')}

TIMELINE:
${incident.timeline.map(e => `- ${e.timestamp.toISOString()}: ${e.description}`).join('\n')}

Analyze this incident and provide:
1. Most likely root cause
2. Immediate remediation steps
3. Long-term prevention recommendations

Respond in JSON:
{
  "rootCause": "detailed root cause analysis",
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;

    let rootCause = 'Root cause under investigation';
    let recommendations: string[] = [];

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('threat_detection') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          rootCause = parsed.rootCause || rootCause;
          recommendations = parsed.recommendations || [];
        }
      }
    } catch (error) {
      logger.warn('CendiaNerve: AI incident analysis unavailable');
    }

    // Fallback analysis
    if (recommendations.length === 0) {
      const downServices = affectedServiceDetails.filter(s => s!.status === 'down');
      if (downServices.length > 0) {
        rootCause = `Service failure in ${downServices.map(s => s!.name).join(', ')}`;
        recommendations = [
          'Check service logs for error patterns',
          'Verify resource availability (CPU, memory, connections)',
          'Check recent deployments for potential issues',
          'Verify dependency health',
        ];
      }
    }

    // Update incident with analysis
    incident.rootCause = rootCause;
    incident.timeline.push({
      timestamp: new Date(),
      type: 'update',
      description: `Root cause identified: ${rootCause}`,
      actor: 'CendiaNerve',
      automated: true,
    });

    return { rootCause, recommendations };
  }

  getIncident(incidentId: string): Incident | null {
    return this.incidents.get(incidentId) || null;
  }

  getActiveIncidents(): Incident[] {
    return Array.from(this.incidents.values()).filter(
      i => i.status !== 'resolved' && i.status !== 'postmortem'
    );
  }

  // ---------------------------------------------------------------------------
  // THREAT DETECTION
  // ---------------------------------------------------------------------------

  async detectThreats(): Promise<ThreatDetection[]> {
    const threats: ThreatDetection[] = [];
    
    // Analyze each service for anomalies
    for (const service of this.services.values()) {
      if (service.errorRate > 10) {
        threats.push({
          id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'anomaly',
          severity: service.errorRate > 50 ? 'high' : 'medium',
          source: 'internal',
          target: service.name,
          description: `Abnormal error rate detected: ${service.errorRate}%`,
          indicators: [`Error rate: ${service.errorRate}%`, `Normal baseline: <5%`],
          recommendedAction: 'Investigate error logs and recent changes',
          automated: false,
          detectedAt: new Date(),
          status: 'detected',
        });
      }

      if (service.latency > 5000) {
        threats.push({
          id: `threat-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          type: 'anomaly',
          severity: 'medium',
          source: 'internal',
          target: service.name,
          description: `High latency detected: ${service.latency}ms`,
          indicators: [`Current latency: ${service.latency}ms`, `Threshold: 1000ms`],
          recommendedAction: 'Check database connections and resource utilization',
          automated: false,
          detectedAt: new Date(),
          status: 'detected',
        });
      }
    }

    // Store detected threats
    for (const threat of threats) {
      this.threats.set(threat.id, threat);
    }

    if (threats.length > 0) {
      logger.warn(`CendiaNerve: Detected ${threats.length} potential threats`);
    }

    return threats;
  }

  reportThreat(threat: Omit<ThreatDetection, 'id' | 'detectedAt' | 'status'>): ThreatDetection {
    const newThreat: ThreatDetection = {
      ...threat,
      id: `threat-${Date.now()}`,
      detectedAt: new Date(),
      status: 'detected',
    };
    this.threats.set(newThreat.id, newThreat);
    logger.warn(`CendiaNerve: Threat reported - ${newThreat.type} (${newThreat.severity})`);
    
    // Auto-contain critical threats
    if (newThreat.severity === 'critical' && newThreat.automated) {
      this.containThreat(newThreat.id);
    }

    return newThreat;
  }

  containThreat(threatId: string): ThreatDetection | null {
    const threat = this.threats.get(threatId);
    if (!threat) return null;

    threat.status = 'contained';
    logger.info(`CendiaNerve: Threat ${threatId} contained`);
    return threat;
  }

  // ---------------------------------------------------------------------------
  // LAZARUS PROTOCOL - DISASTER RECOVERY
  // ---------------------------------------------------------------------------

  async activateLazarusProtocol(trigger: string): Promise<LazarusProtocol> {
    logger.warn(`CendiaNerve: LAZARUS PROTOCOL ACTIVATED - ${trigger}`);

    const protocol: LazarusProtocol = {
      id: `lazarus-${Date.now()}`,
      trigger,
      status: 'activated',
      isolatedSystems: [],
      backupSystems: [],
      rebuildProgress: 0,
      steps: [
        { order: 1, name: 'Isolate compromised systems', status: 'pending' },
        { order: 2, name: 'Verify backup integrity', status: 'pending' },
        { order: 3, name: 'Spin up clean infrastructure', status: 'pending' },
        { order: 4, name: 'Restore from backup', status: 'pending' },
        { order: 5, name: 'Security validation', status: 'pending' },
        { order: 6, name: 'Gradual traffic restoration', status: 'pending' },
        { order: 7, name: 'Full system verification', status: 'pending' },
      ],
      estimatedRecovery: new Date(Date.now() + 4 * 60 * 60 * 1000), // 4 hours
      activatedAt: new Date(),
    };

    this.lazarusProtocols.set(protocol.id, protocol);

    // Start executing protocol
    this.executeLazarusStep(protocol.id, 1);

    return protocol;
  }

  private async executeLazarusStep(protocolId: string, stepOrder: number): Promise<void> {
    const protocol = this.lazarusProtocols.get(protocolId);
    if (!protocol) return;

    const step = protocol.steps.find(s => s.order === stepOrder);
    if (!step) {
      protocol.status = 'complete';
      protocol.completedAt = new Date();
      logger.info(`CendiaNerve: Lazarus Protocol ${protocolId} complete`);
      return;
    }

    step.status = 'in_progress';
    protocol.status = 'executing';
    protocol.rebuildProgress = Math.round((stepOrder - 1) / protocol.steps.length * 100);

    logger.info(`CendiaNerve: Lazarus step ${stepOrder}: ${step.name}`);

    // Simulate step execution (in production, this would trigger real recovery actions)
    setTimeout(() => {
      step.status = 'complete';
      step.duration = 300; // 5 minutes per step
      this.executeLazarusStep(protocolId, stepOrder + 1);
    }, 5000); // 5 second simulation
  }

  getLazarusStatus(protocolId: string): LazarusProtocol | null {
    return this.lazarusProtocols.get(protocolId) || null;
  }

  // ---------------------------------------------------------------------------
  // CAPACITY FORECASTING
  // ---------------------------------------------------------------------------

  async forecastCapacity(): Promise<CapacityForecast[]> {
    const forecasts: CapacityForecast[] = [];

    for (const service of this.services.values()) {
      // CPU forecast
      const cpuUsage = service.metadata?.cpuUsage || 50;
      const cpuGrowthRate = service.metadata?.cpuGrowthRate || 2; // % per month
      const cpuThreshold = 80;
      const daysUntilCpuThreshold = cpuUsage < cpuThreshold 
        ? Math.round((cpuThreshold - cpuUsage) / (cpuGrowthRate / 30))
        : 0;

      if (daysUntilCpuThreshold < 90 && daysUntilCpuThreshold > 0) {
        forecasts.push({
          service: service.name,
          metric: 'cpu',
          currentUsage: cpuUsage,
          predictedUsage: cpuUsage + (cpuGrowthRate * 3),
          threshold: cpuThreshold,
          daysUntilThreshold: daysUntilCpuThreshold,
          recommendation: `Consider scaling ${service.name} within ${daysUntilCpuThreshold} days`,
          confidence: 75,
        });
      }

      // Storage forecast
      const storageUsage = service.metadata?.storageUsage || 40;
      const storageGrowthRate = service.metadata?.storageGrowthRate || 5; // % per month
      const storageThreshold = 85;
      const daysUntilStorageThreshold = storageUsage < storageThreshold
        ? Math.round((storageThreshold - storageUsage) / (storageGrowthRate / 30))
        : 0;

      if (daysUntilStorageThreshold < 60 && daysUntilStorageThreshold > 0) {
        forecasts.push({
          service: service.name,
          metric: 'storage',
          currentUsage: storageUsage,
          predictedUsage: storageUsage + (storageGrowthRate * 2),
          threshold: storageThreshold,
          daysUntilThreshold: daysUntilStorageThreshold,
          recommendation: `Expand storage for ${service.name} or implement data archival`,
          confidence: 80,
        });
      }
    }

    return forecasts;
  }

  // ---------------------------------------------------------------------------
  // COST OPTIMIZATION
  // ---------------------------------------------------------------------------

  async analyzeCosts(): Promise<CostOptimization[]> {
    const optimizations: CostOptimization[] = [];

    // Analyze underutilized services
    const underutilized = Array.from(this.services.values()).filter(
      s => (s.metadata?.cpuUsage || 50) < 20
    );

    if (underutilized.length > 0) {
      optimizations.push({
        category: 'Rightsizing',
        currentCost: underutilized.length * 500,
        optimizedCost: underutilized.length * 200,
        savings: underutilized.length * 300,
        savingsPercentage: 60,
        recommendation: `Downsize ${underutilized.length} underutilized services`,
        effort: 'medium',
        risk: 'low',
      });
    }

    // Reserved capacity opportunities
    const stableServices = Array.from(this.services.values()).filter(
      s => s.uptime > 99 && s.status === 'healthy'
    );

    if (stableServices.length >= 5) {
      optimizations.push({
        category: 'Reserved Capacity',
        currentCost: stableServices.length * 1000,
        optimizedCost: stableServices.length * 600,
        savings: stableServices.length * 400,
        savingsPercentage: 40,
        recommendation: 'Purchase reserved capacity for stable workloads',
        effort: 'low',
        risk: 'low',
      });
    }

    return optimizations;
  }

  // ---------------------------------------------------------------------------
  // CHANGE MANAGEMENT
  // ---------------------------------------------------------------------------

  createChangeRequest(request: Omit<ChangeRequest, 'id' | 'status' | 'riskAssessment' | 'createdAt'>): ChangeRequest {
    const riskAssessment = this.assessChangeRisk(request);

    const change: ChangeRequest = {
      ...request,
      id: `chg-${Date.now()}`,
      status: 'draft',
      riskAssessment,
      createdAt: new Date(),
    };

    this.changeRequests.set(change.id, change);
    logger.info(`CendiaNerve: Change request created - ${change.title}`);
    return change;
  }

  private assessChangeRisk(request: Omit<ChangeRequest, 'id' | 'status' | 'riskAssessment' | 'createdAt'>): RiskAssessment {
    const factors: RiskAssessment['factors'] = [];
    let totalScore = 0;

    // Service criticality
    const criticalServices = request.affectedServices.filter(id => {
      const svc = this.services.get(id);
      return svc && (svc.type === 'database' || svc.type === 'api');
    });
    const criticalityScore = criticalServices.length > 0 ? 30 : 10;
    factors.push({ factor: 'Service Criticality', weight: 0.3, score: criticalityScore });
    totalScore += criticalityScore * 0.3;

    // Scope
    const scopeScore = request.affectedServices.length > 5 ? 40 : 
      request.affectedServices.length > 2 ? 25 : 10;
    factors.push({ factor: 'Change Scope', weight: 0.25, score: scopeScore });
    totalScore += scopeScore * 0.25;

    // Type
    const typeScore = request.type === 'emergency' ? 50 : 
      request.type === 'normal' ? 25 : 10;
    factors.push({ factor: 'Change Type', weight: 0.25, score: typeScore });
    totalScore += typeScore * 0.25;

    // Rollback plan
    const rollbackScore = request.rollbackPlan?.length > 50 ? 10 : 30;
    factors.push({ factor: 'Rollback Readiness', weight: 0.2, score: rollbackScore });
    totalScore += rollbackScore * 0.2;

    const level: RiskAssessment['level'] = 
      totalScore >= 35 ? 'critical' :
      totalScore >= 25 ? 'high' :
      totalScore >= 15 ? 'medium' : 'low';

    return {
      score: Math.round(totalScore),
      level,
      factors,
      mitigations: this.generateMitigations(level, request),
      recommendations: [],
    };
  }

  private generateMitigations(level: RiskAssessment['level'], request: any): string[] {
    const mitigations: string[] = [];

    if (level === 'critical' || level === 'high') {
      mitigations.push('Schedule during maintenance window');
      mitigations.push('Ensure rollback procedure is tested');
      mitigations.push('Have senior engineer on standby');
    }

    if (request.affectedServices?.length > 3) {
      mitigations.push('Consider phased rollout');
    }

    mitigations.push('Monitor key metrics post-deployment');

    return mitigations;
  }

  approveChangeRequest(changeId: string, approver: string): ChangeRequest | null {
    const change = this.changeRequests.get(changeId);
    if (!change) return null;

    change.approvers.push(approver);
    change.status = 'approved';
    logger.info(`CendiaNerve: Change ${changeId} approved by ${approver}`);
    return change;
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private parseJsonFromResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.warn('CendiaNerve: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalServices: number;
    healthyServices: number;
    activeIncidents: number;
    p1Incidents: number;
    overallUptime: number;
    threatsDetected: number;
  } {
    const services = this.getAllServices();
    const healthy = services.filter(s => s.status === 'healthy').length;
    const active = this.getActiveIncidents();
    const p1 = active.filter(i => i.severity === 'p1').length;
    const avgUptime = services.length > 0
      ? services.reduce((sum, s) => sum + s.uptime, 0) / services.length
      : 100;

    return {
      totalServices: services.length,
      healthyServices: healthy,
      activeIncidents: active.length,
      p1Incidents: p1,
      overallUptime: Math.round(avgUptime * 100) / 100,
      threatsDetected: this.threats.size,
    };
  }
}

// Export singleton instance
export const cendiaNerveService = new CendiaNerveService();
