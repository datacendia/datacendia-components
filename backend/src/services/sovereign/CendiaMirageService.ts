// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA MIRAGEÃ¢â€žÂ¢ - Deception Technology Service
// "Let attackers reveal themselves in shadow environments."
// Sovereign Security Layer - Deception & Threat Intelligence
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface Honeytoken {
  id: string;
  organizationId: string;
  type: 'credential' | 'api_key' | 'document' | 'database_record' | 'ssh_key' | 'token';
  name: string;
  value: string; // The decoy value
  placement: string; // Where it's planted
  alertLevel: 'critical' | 'high' | 'medium' | 'low';
  triggered: boolean;
  triggerCount: number;
  lastTriggered: Date | null;
  createdAt: Date;
  expiresAt: Date | null;
  metadata: Record<string, unknown>;
}

export interface CanarySystem {
  id: string;
  organizationId: string;
  name: string;
  type: 'server' | 'database' | 'application' | 'api_endpoint' | 'file_share';
  status: 'active' | 'inactive' | 'triggered' | 'compromised';
  configuration: {
    osFingerprint: string;
    services: string[];
    openPorts: number[];
    behaviorProfile: string;
  };
  alerts: CanaryAlert[];
  interactions: number;
  createdAt: Date;
  lastInteraction: Date | null;
}

export interface CanaryAlert {
  id: string;
  canaryId: string;
  timestamp: Date;
  eventType: 'connection' | 'authentication' | 'data_access' | 'exfiltration' | 'lateral_movement';
  sourceIp: string;
  sourcePort: number;
  details: Record<string, unknown>;
  severity: 'critical' | 'high' | 'medium' | 'low';
  analyzed: boolean;
}

export interface SandboxEnvironment {
  id: string;
  organizationId: string;
  name: string;
  status: 'ready' | 'engaged' | 'analyzing' | 'cleanup';
  redirectRules: RedirectRule[];
  capturedActivity: CapturedActivity[];
  engagementStart: Date | null;
  engagementEnd: Date | null;
  forensicReport: ForensicReport | null;
}

export interface RedirectRule {
  id: string;
  sandboxId: string;
  condition: string;
  action: 'redirect' | 'mirror' | 'delay' | 'modify';
  target: string;
  enabled: boolean;
}

export interface CapturedActivity {
  id: string;
  sandboxId: string;
  timestamp: Date;
  activityType: string;
  details: Record<string, unknown>;
  artifacts: string[];
}

export interface ForensicReport {
  id: string;
  sandboxId: string;
  attackerProfile: {
    estimatedSkillLevel: 'script_kiddie' | 'intermediate' | 'advanced' | 'nation_state';
    tools: string[];
    techniques: string[];
    objectives: string[];
  };
  timeline: Array<{
    timestamp: Date;
    action: string;
    significance: string;
  }>;
  indicators: {
    iocs: string[];
    ttps: string[];
    signatures: string[];
  };
  recommendations: string[];
  generatedAt: Date;
}

export interface ThreatIntelligence {
  id: string;
  organizationId: string;
  sourceType: 'honeytoken' | 'canary' | 'sandbox';
  sourceId: string;
  attackPattern: string;
  confidence: number;
  indicators: string[];
  mitreTechniques: string[];
  firstSeen: Date;
  lastSeen: Date;
  occurrences: number;
}

// =============================================================================
// CENDIA MIRAGE SERVICE
// =============================================================================

export class CendiaMirageService {
  private _honeytokens: Map<string, Honeytoken> = new Map();
  private _canaries: Map<string, CanarySystem> = new Map();
  private _sandboxes: Map<string, SandboxEnvironment> = new Map();
  private _intelligence: Map<string, ThreatIntelligence> = new Map();

  private db: PrismaClient | null;

  constructor(prisma?: PrismaClient) {
    this.db = prisma || null;
    console.log(`[CendiaMirage] Deception Technology service initialized (persistence: ${this.db ? 'PostgreSQL' : 'in-memory'})`);


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // HONEYTOKEN MANAGEMENT
  // ===========================================================================

  async deployHoneytoken(data: Omit<Honeytoken, 'id' | 'triggered' | 'triggerCount' | 'lastTriggered' | 'createdAt'>): Promise<Honeytoken> {
    const honeytoken: Honeytoken = {
      ...data,
      id: `honey-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      triggered: false,
      triggerCount: 0,
      lastTriggered: null,
      createdAt: new Date(),
    };
    
    this._honeytokens.set(honeytoken.id, honeytoken);
    return honeytoken;
  }

  async triggerHoneytoken(honeytokenId: string, context: Record<string, unknown>): Promise<{
    honeytoken: Honeytoken;
    alert: CanaryAlert;
  } | null> {
    const honeytoken = this._honeytokens.get(honeytokenId);
    if (!honeytoken) return null;
    
    honeytoken.triggered = true;
    honeytoken.triggerCount++;
    honeytoken.lastTriggered = new Date();
    this._honeytokens.set(honeytokenId, honeytoken);
    
    // Create alert
    const alert: CanaryAlert = {
      id: `alert-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      canaryId: honeytokenId,
      timestamp: new Date(),
      eventType: 'authentication',
      sourceIp: (context.sourceIp as string) || 'unknown',
      sourcePort: (context.sourcePort as number) || 0,
      details: context,
      severity: honeytoken.alertLevel,
      analyzed: false,
    };
    
    // Record threat intelligence
    await this.recordThreatIntel(honeytoken.organizationId, 'honeytoken', honeytokenId, context);
    
    return { honeytoken, alert };
  }

  async getHoneytokens(organizationId: string): Promise<Honeytoken[]> {
    return Array.from(this._honeytokens.values())
      .filter(h => h.organizationId === organizationId);
  }

  async getTriggeredHoneytokens(organizationId: string): Promise<Honeytoken[]> {
    return (await this.getHoneytokens(organizationId))
      .filter(h => h.triggered);
  }

  // ===========================================================================
  // CANARY SYSTEMS
  // ===========================================================================

  async deployCanary(data: Omit<CanarySystem, 'id' | 'alerts' | 'interactions' | 'createdAt' | 'lastInteraction'>): Promise<CanarySystem> {
    const canary: CanarySystem = {
      ...data,
      id: `canary-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      alerts: [],
      interactions: 0,
      createdAt: new Date(),
      lastInteraction: null,
    };
    
    this._canaries.set(canary.id, canary);
    return canary;
  }

  async recordCanaryInteraction(canaryId: string, interaction: Omit<CanaryAlert, 'id' | 'canaryId' | 'analyzed'>): Promise<CanaryAlert | null> {
    const canary = this._canaries.get(canaryId);
    if (!canary) return null;
    
    const alert: CanaryAlert = {
      ...interaction,
      id: `calert-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      canaryId,
      analyzed: false,
    };
    
    canary.alerts.push(alert);
    canary.interactions++;
    canary.lastInteraction = new Date();
    
    if (interaction.severity === 'critical' || interaction.severity === 'high') {
      canary.status = 'triggered';
    }
    
    this._canaries.set(canaryId, canary);
    
    // Record threat intelligence
    await this.recordThreatIntel(canary.organizationId, 'canary', canaryId, interaction.details);
    
    return alert;
  }

  async getCanaries(organizationId: string): Promise<CanarySystem[]> {
    return Array.from(this._canaries.values())
      .filter(c => c.organizationId === organizationId);
  }

  async getCanaryAlerts(organizationId: string): Promise<CanaryAlert[]> {
    const canaries = await this.getCanaries(organizationId);
    const alerts: CanaryAlert[] = [];
    for (const canary of canaries) {
      alerts.push(...canary.alerts);
    }
    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  // ===========================================================================
  // SANDBOX ENVIRONMENTS
  // ===========================================================================

  async createSandbox(data: Omit<SandboxEnvironment, 'id' | 'status' | 'capturedActivity' | 'engagementStart' | 'engagementEnd' | 'forensicReport'>): Promise<SandboxEnvironment> {
    const sandbox: SandboxEnvironment = {
      ...data,
      id: `sandbox-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      status: 'ready',
      capturedActivity: [],
      engagementStart: null,
      engagementEnd: null,
      forensicReport: null,
    };
    
    this._sandboxes.set(sandbox.id, sandbox);
    return sandbox;
  }

  async engageSandbox(sandboxId: string): Promise<SandboxEnvironment | null> {
    const sandbox = this._sandboxes.get(sandboxId);
    if (!sandbox) return null;
    
    sandbox.status = 'engaged';
    sandbox.engagementStart = new Date();
    this._sandboxes.set(sandboxId, sandbox);
    
    return sandbox;
  }

  async recordSandboxActivity(sandboxId: string, activity: Omit<CapturedActivity, 'id' | 'sandboxId'>): Promise<CapturedActivity | null> {
    const sandbox = this._sandboxes.get(sandboxId);
    if (!sandbox || sandbox.status !== 'engaged') return null;
    
    const captured: CapturedActivity = {
      ...activity,
      id: `activity-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      sandboxId,
    };
    
    sandbox.capturedActivity.push(captured);
    this._sandboxes.set(sandboxId, sandbox);
    
    return captured;
  }

  async generateForensicReport(sandboxId: string): Promise<ForensicReport | null> {
    const sandbox = this._sandboxes.get(sandboxId);
    if (!sandbox) return null;
    
    sandbox.status = 'analyzing';
    this._sandboxes.set(sandboxId, sandbox);
    
    // Analyze captured activity
    const activities = sandbox.capturedActivity;
    const tools = new Set<string>();
    const techniques = new Set<string>();
    const timeline: ForensicReport['timeline'] = [];
    
    for (const act of activities) {
      const details = act.details as any;
      if (details.tool) tools.add(details.tool);
      if (details.technique) techniques.add(details.technique);
      
      timeline.push({
        timestamp: act.timestamp,
        action: act.activityType,
        significance: this.assessSignificance(act.activityType),
      });
    }
    
    const report: ForensicReport = {
      id: `forensic-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      sandboxId,
      attackerProfile: {
        estimatedSkillLevel: this.estimateSkillLevel(activities),
        tools: Array.from(tools),
        techniques: Array.from(techniques),
        objectives: this.inferObjectives(activities),
      },
      timeline: timeline.sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime()),
      indicators: {
        iocs: this.extractIocs(activities),
        ttps: Array.from(techniques),
        signatures: [],
      },
      recommendations: this.generateRecommendations(activities),
      generatedAt: new Date(),
    };
    
    sandbox.forensicReport = report;
    sandbox.status = 'cleanup';
    sandbox.engagementEnd = new Date();
    this._sandboxes.set(sandboxId, sandbox);
    
    return report;
  }

  async getSandboxes(organizationId: string): Promise<SandboxEnvironment[]> {
    return Array.from(this._sandboxes.values())
      .filter(s => s.organizationId === organizationId);
  }

  // ===========================================================================
  // THREAT INTELLIGENCE
  // ===========================================================================

  private async recordThreatIntel(
    organizationId: string,
    sourceType: ThreatIntelligence['sourceType'],
    sourceId: string,
    context: Record<string, unknown>
  ): Promise<ThreatIntelligence> {
    const attackPattern = this.inferAttackPattern(context);
    const existingIntel = Array.from(this._intelligence.values())
      .find(i => i.organizationId === organizationId && i.attackPattern === attackPattern);
    
    if (existingIntel) {
      existingIntel.lastSeen = new Date();
      existingIntel.occurrences++;
      this._intelligence.set(existingIntel.id, existingIntel);
      return existingIntel;
    }
    
    const intel: ThreatIntelligence = {
      id: `intel-${Date.now()}-${crypto.randomUUID().slice(0, 8)}`,
      organizationId,
      sourceType,
      sourceId,
      attackPattern,
      confidence: 0.7,
      indicators: this.extractIndicators(context),
      mitreTechniques: this.mapToMitre(context),
      firstSeen: new Date(),
      lastSeen: new Date(),
      occurrences: 1,
    };
    
    this._intelligence.set(intel.id, intel);
    return intel;
  }

  async getThreatIntelligence(organizationId: string): Promise<ThreatIntelligence[]> {
    return Array.from(this._intelligence.values())
      .filter(i => i.organizationId === organizationId)
      .sort((a, b) => b.lastSeen.getTime() - a.lastSeen.getTime());
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    totalHoneytokens: number;
    triggeredHoneytokens: number;
    activeCanaries: number;
    canaryAlerts: number;
    activeSandboxes: number;
    threatIntelCount: number;
    recentAlerts: CanaryAlert[];
    topThreats: ThreatIntelligence[];
  }> {
    const honeytokens = await this.getHoneytokens(organizationId);
    const canaries = await this.getCanaries(organizationId);
    const sandboxes = await this.getSandboxes(organizationId);
    const intel = await this.getThreatIntelligence(organizationId);
    const alerts = await this.getCanaryAlerts(organizationId);
    
    return {
      totalHoneytokens: honeytokens.length,
      triggeredHoneytokens: honeytokens.filter(h => h.triggered).length,
      activeCanaries: canaries.filter(c => c.status === 'active').length,
      canaryAlerts: alerts.length,
      activeSandboxes: sandboxes.filter(s => s.status === 'engaged').length,
      threatIntelCount: intel.length,
      recentAlerts: alerts.slice(0, 10),
      topThreats: intel.slice(0, 5),
    };
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private assessSignificance(activityType: string): string {
    const significanceMap: Record<string, string> = {
      'reconnaissance': 'Initial enumeration attempt',
      'credential_theft': 'Critical - attempting credential access',
      'lateral_movement': 'High - attempting to move within network',
      'data_access': 'Medium - accessing sensitive data',
      'exfiltration': 'Critical - data exfiltration attempt',
    };
    return significanceMap[activityType] || 'Unknown activity type';
  }

  private estimateSkillLevel(activities: CapturedActivity[]): ForensicReport['attackerProfile']['estimatedSkillLevel'] {
    if (activities.length > 20) return 'advanced';
    if (activities.length > 10) return 'intermediate';
    return 'script_kiddie';
  }

  private inferObjectives(activities: CapturedActivity[]): string[] {
    const objectives = new Set<string>();
    for (const act of activities) {
      if (act.activityType.includes('credential')) objectives.add('Credential harvesting');
      if (act.activityType.includes('data')) objectives.add('Data exfiltration');
      if (act.activityType.includes('recon')) objectives.add('Reconnaissance');
    }
    return Array.from(objectives);
  }

  private extractIocs(activities: CapturedActivity[]): string[] {
    const iocs: string[] = [];
    for (const act of activities) {
      const details = act.details as any;
      if (details.ip) iocs.push(`IP: ${details.ip}`);
      if (details.hash) iocs.push(`Hash: ${details.hash}`);
      if (details.domain) iocs.push(`Domain: ${details.domain}`);
    }
    return iocs;
  }

  private generateRecommendations(activities: CapturedActivity[]): string[] {
    const recs: string[] = [
      'Block identified IOCs at network perimeter',
      'Rotate any potentially compromised credentials',
      'Review access logs for affected systems',
    ];
    if (activities.length > 10) {
      recs.push('Consider engaging incident response team');
    }
    return recs;
  }

  private inferAttackPattern(context: Record<string, unknown>): string {
    if (context.type === 'authentication') return 'credential-access';
    if (context.type === 'data_access') return 'data-theft';
    return 'unknown';
  }

  private extractIndicators(context: Record<string, unknown>): string[] {
    const indicators: string[] = [];
    if (context.sourceIp) indicators.push(`IP:${context.sourceIp}`);
    if (context.userAgent) indicators.push(`UA:${context.userAgent}`);
    return indicators;
  }

  private mapToMitre(context: Record<string, unknown>): string[] {
    // Map to MITRE ATT&CK techniques
    const techniques: string[] = [];
    if (context.type === 'authentication') techniques.push('T1078 - Valid Accounts');
    if (context.type === 'data_access') techniques.push('T1005 - Data from Local System');
    return techniques;
  }

  // No seed method - Enterprise Platinum standard



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaMirage', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this._honeytokens.has(d.id)) this._honeytokens.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaMirage', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this._canaries.has(d.id)) this._canaries.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaMirage', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this._sandboxes.has(d.id)) this._sandboxes.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaMirage', recordType: 'record', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this._intelligence.has(d.id)) this._intelligence.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaMirageService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaMirageService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const cendiaMirageService = new CendiaMirageService();
