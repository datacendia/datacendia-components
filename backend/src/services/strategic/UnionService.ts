// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// UNION™ - DEFENSE SYNTHESIS AGENT
// Defensive Recommendations & Security Response Synthesis
// "The Shield" - Synthesizes defensive strategies from multi-agent analysis
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface ThreatAssessment {
  id: string;
  organizationId: string;
  source: 'red_team' | 'external_intel' | 'internal_detection' | 'user_report';
  threats: Threat[];
  assessedAt: Date;
}

export interface Threat {
  id: string;
  type: ThreatType;
  severity: 'critical' | 'high' | 'medium' | 'low';
  description: string;
  attackVector: string;
  affectedAssets: string[];
  likelihood: number;
  impact: number;
  indicators: string[];
}

export type ThreatType = 
  | 'malware' | 'ransomware' | 'phishing' | 'insider_threat' | 'ddos'
  | 'data_exfiltration' | 'supply_chain' | 'zero_day' | 'social_engineering'
  | 'credential_theft' | 'privilege_escalation' | 'lateral_movement';

export interface DefenseStrategy {
  id: string;
  organizationId: string;
  threatAssessmentId: string;
  status: 'draft' | 'approved' | 'active' | 'archived';
  defenses: Defense[];
  mitigations: Mitigation[];
  monitoringPoints: MonitoringPoint[];
  responsePlaybook: ResponsePlaybook;
  synthesizedAt: Date;
  approvedAt?: Date;
  approvedBy?: string;
}

export interface Defense {
  id: string;
  type: 'preventive' | 'detective' | 'corrective' | 'compensating';
  name: string;
  description: string;
  priority: number;
  implementationCost: 'low' | 'medium' | 'high';
  effectiveness: number;
  timeToImplement: string;
  dependencies: string[];
}

export interface Mitigation {
  id: string;
  threatId: string;
  action: string;
  owner: string;
  deadline: string;
  status: 'pending' | 'in_progress' | 'completed' | 'blocked';
  residualRisk: number;
}

export interface MonitoringPoint {
  id: string;
  name: string;
  type: 'log' | 'metric' | 'alert' | 'behavioral';
  source: string;
  threshold?: string;
  alertSeverity: 'critical' | 'high' | 'medium' | 'low';
}

export interface ResponsePlaybook {
  id: string;
  name: string;
  triggerConditions: string[];
  phases: PlaybookPhase[];
  escalationPath: { level: number; contact: string; condition: string }[];
  communicationPlan: { audience: string; message: string; timing: string }[];
}

export interface PlaybookPhase {
  order: number;
  name: string;
  duration: string;
  actions: { action: string; owner: string; automated: boolean }[];
  successCriteria: string[];
  rollbackTriggers: string[];
}

export interface SecurityPosture {
  organizationId: string;
  overallScore: number;
  dimensions: {
    prevention: number;
    detection: number;
    response: number;
    recovery: number;
  };
  activeThreats: number;
  mitigatedThreats: number;
  openVulnerabilities: number;
  lastAssessment: Date;
}

// =============================================================================
// UNION SERVICE
// =============================================================================

class UnionService {
  private assessments: Map<string, ThreatAssessment> = new Map();
  private strategies: Map<string, DefenseStrategy> = new Map();
  private postures: Map<string, SecurityPosture> = new Map();

  // ---------------------------------------------------------------------------
  // THREAT ASSESSMENT INTAKE
  // ---------------------------------------------------------------------------

  async ingestThreatAssessment(
    organizationId: string,
    source: ThreatAssessment['source'],
    rawThreats: Partial<Threat>[]
  ): Promise<ThreatAssessment> {
    const assessmentId = uuidv4();

    // Enrich and normalize threats
    const threats: Threat[] = rawThreats.map((t, i) => ({
      id: t.id || uuidv4(),
      type: t.type || 'malware',
      severity: t.severity || 'medium',
      description: t.description || 'Unknown threat',
      attackVector: t.attackVector || 'Unknown',
      affectedAssets: t.affectedAssets || [],
      likelihood: t.likelihood || 0.5,
      impact: t.impact || 0.5,
      indicators: t.indicators || []
    }));

    const assessment: ThreatAssessment = {
      id: assessmentId,
      organizationId,
      source,
      threats,
      assessedAt: new Date()
    };

    this.assessments.set(assessmentId, assessment);

    // Log assessment
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: organizationId,
        action: 'UNION_THREAT_ASSESSMENT',
        resource_type: 'threat_assessment',
        resource_id: assessmentId,
        details: {
          source,
          threatCount: threats.length,
          criticalCount: threats.filter(t => t.severity === 'critical').length,
          highCount: threats.filter(t => t.severity === 'high').length
        } as any
      }
    });

    logger.info(`Union ingested ${threats.length} threats from ${source}`);
    return assessment;
  }

  // ---------------------------------------------------------------------------
  // DEFENSE SYNTHESIS - THE CORE
  // ---------------------------------------------------------------------------

  async synthesizeDefenseStrategy(
    organizationId: string,
    assessmentId: string
  ): Promise<DefenseStrategy> {
    const assessment = this.assessments.get(assessmentId);
    if (!assessment) throw new Error('Assessment not found');

    const strategyId = uuidv4();

    // Generate defenses using AI
    const defenses = await this.generateDefenses(assessment.threats);
    
    // Generate mitigations for each threat
    const mitigations = await this.generateMitigations(assessment.threats);
    
    // Generate monitoring points
    const monitoringPoints = await this.generateMonitoringPoints(assessment.threats);
    
    // Generate response playbook
    const responsePlaybook = await this.generatePlaybook(assessment.threats);

    const strategy: DefenseStrategy = {
      id: strategyId,
      organizationId,
      threatAssessmentId: assessmentId,
      status: 'draft',
      defenses,
      mitigations,
      monitoringPoints,
      responsePlaybook,
      synthesizedAt: new Date()
    };

    this.strategies.set(strategyId, strategy);

    // Update security posture
    await this.updateSecurityPosture(organizationId);

    // Log synthesis
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: organizationId,
        action: 'UNION_STRATEGY_SYNTHESIZED',
        resource_type: 'defense_strategy',
        resource_id: strategyId,
        details: {
          assessmentId,
          defenseCount: defenses.length,
          mitigationCount: mitigations.length,
          monitoringPointCount: monitoringPoints.length
        } as any
      }
    });

    return strategy;
  }

  private async generateDefenses(threats: Threat[]): Promise<Defense[]> {
    const threatSummary = threats.map(t => 
      `${t.type} (${t.severity}): ${t.description}`
    ).join('\n');

    const prompt = `Generate defensive controls for these threats:

THREATS:
${threatSummary}

For each threat, recommend preventive, detective, and corrective controls.
Output JSON array:
[
  {
    "type": "preventive|detective|corrective|compensating",
    "name": "Control name",
    "description": "What it does",
    "priority": 1-5,
    "implementationCost": "low|medium|high",
    "effectiveness": 0.0-1.0,
    "timeToImplement": "e.g., 1 day, 1 week",
    "dependencies": ["dep1"]
  }
]`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
      const parsed = JSON.parse(response.match(/\[[\s\S]*\]/)?.[0] || '[]');
      
      return parsed.map((d: any, i: number) => ({
        id: uuidv4(),
        type: d.type || 'preventive',
        name: d.name || `Defense ${i + 1}`,
        description: d.description || '',
        priority: d.priority || 3,
        implementationCost: d.implementationCost || 'medium',
        effectiveness: d.effectiveness || 0.7,
        timeToImplement: d.timeToImplement || '1 week',
        dependencies: d.dependencies || []
      }));
    } catch (error) {
      logger.error('Defense generation failed:', error);
      return this.getDefaultDefenses(threats);
    }
  }

  private getDefaultDefenses(threats: Threat[]): Defense[] {
    const defenses: Defense[] = [
      {
        id: uuidv4(),
        type: 'preventive',
        name: 'Network Segmentation',
        description: 'Isolate critical systems to limit lateral movement',
        priority: 1,
        implementationCost: 'medium',
        effectiveness: 0.8,
        timeToImplement: '2 weeks',
        dependencies: []
      },
      {
        id: uuidv4(),
        type: 'detective',
        name: 'Enhanced Logging',
        description: 'Increase log verbosity and retention for affected systems',
        priority: 2,
        implementationCost: 'low',
        effectiveness: 0.7,
        timeToImplement: '1 day',
        dependencies: []
      },
      {
        id: uuidv4(),
        type: 'corrective',
        name: 'Incident Response Activation',
        description: 'Activate IR team and begin containment procedures',
        priority: 1,
        implementationCost: 'high',
        effectiveness: 0.9,
        timeToImplement: 'immediate',
        dependencies: []
      }
    ];

    // Add threat-specific defenses
    for (const threat of threats) {
      if (threat.type === 'ransomware') {
        defenses.push({
          id: uuidv4(),
          type: 'preventive',
          name: 'Backup Isolation',
          description: 'Air-gap backup systems from production network',
          priority: 1,
          implementationCost: 'medium',
          effectiveness: 0.95,
          timeToImplement: '1 week',
          dependencies: []
        });
      }
      if (threat.type === 'phishing') {
        defenses.push({
          id: uuidv4(),
          type: 'preventive',
          name: 'Email Security Enhancement',
          description: 'Deploy advanced email filtering and DMARC',
          priority: 2,
          implementationCost: 'low',
          effectiveness: 0.75,
          timeToImplement: '3 days',
          dependencies: []
        });
      }
    }

    return defenses;
  }

  private async generateMitigations(threats: Threat[]): Promise<Mitigation[]> {
    const mitigations: Mitigation[] = [];

    for (const threat of threats) {
      const prompt = `Generate mitigation actions for this threat:

THREAT: ${threat.type}
SEVERITY: ${threat.severity}
DESCRIPTION: ${threat.description}
ATTACK VECTOR: ${threat.attackVector}
AFFECTED ASSETS: ${threat.affectedAssets.join(', ')}

Output JSON:
{
  "action": "Specific mitigation action",
  "owner": "Role responsible",
  "deadline": "Relative deadline",
  "residualRisk": 0.0-1.0
}`;

      try {
        const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
        const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

        mitigations.push({
          id: uuidv4(),
          threatId: threat.id,
          action: parsed.action || `Mitigate ${threat.type} threat`,
          owner: parsed.owner || 'Security Team',
          deadline: parsed.deadline || '48 hours',
          status: 'pending',
          residualRisk: parsed.residualRisk || 0.2
        });
      } catch {
        mitigations.push({
          id: uuidv4(),
          threatId: threat.id,
          action: `Address ${threat.type} threat via standard procedures`,
          owner: 'Security Team',
          deadline: threat.severity === 'critical' ? '24 hours' : '1 week',
          status: 'pending',
          residualRisk: 0.3
        });
      }
    }

    return mitigations;
  }

  private async generateMonitoringPoints(threats: Threat[]): Promise<MonitoringPoint[]> {
    const points: MonitoringPoint[] = [];

    // Standard monitoring points
    points.push(
      {
        id: uuidv4(),
        name: 'Authentication Failures',
        type: 'metric',
        source: 'auth_logs',
        threshold: '> 10 per minute',
        alertSeverity: 'high'
      },
      {
        id: uuidv4(),
        name: 'Outbound Data Volume',
        type: 'metric',
        source: 'network_monitor',
        threshold: '> 1GB per hour',
        alertSeverity: 'critical'
      },
      {
        id: uuidv4(),
        name: 'Process Anomalies',
        type: 'behavioral',
        source: 'endpoint_detection',
        alertSeverity: 'high'
      }
    );

    // Threat-specific monitoring
    for (const threat of threats) {
      if (threat.indicators.length > 0) {
        points.push({
          id: uuidv4(),
          name: `IOC Detection - ${threat.type}`,
          type: 'alert',
          source: 'siem',
          threshold: `Match: ${threat.indicators[0]}`,
          alertSeverity: threat.severity
        });
      }
    }

    return points;
  }

  private async generatePlaybook(threats: Threat[]): Promise<ResponsePlaybook> {
    const criticalThreats = threats.filter(t => t.severity === 'critical');
    const primaryThreat = criticalThreats[0] || threats[0];

    return {
      id: uuidv4(),
      name: `Response Playbook - ${primaryThreat?.type || 'General'} Incident`,
      triggerConditions: [
        'Critical alert from SIEM',
        'Confirmed IOC match',
        'User-reported suspicious activity'
      ],
      phases: [
        {
          order: 1,
          name: 'Detection & Triage',
          duration: '15 minutes',
          actions: [
            { action: 'Validate alert authenticity', owner: 'SOC Analyst', automated: false },
            { action: 'Gather initial IOCs', owner: 'SOC Analyst', automated: true },
            { action: 'Determine blast radius', owner: 'SOC Analyst', automated: false }
          ],
          successCriteria: ['Incident confirmed or false positive identified'],
          rollbackTriggers: ['Confirmed false positive']
        },
        {
          order: 2,
          name: 'Containment',
          duration: '1 hour',
          actions: [
            { action: 'Isolate affected systems', owner: 'IT Operations', automated: true },
            { action: 'Block malicious IPs/domains', owner: 'Network Team', automated: true },
            { action: 'Disable compromised accounts', owner: 'IAM Team', automated: false }
          ],
          successCriteria: ['Threat contained', 'No further spread detected'],
          rollbackTriggers: ['Business-critical system impacted without approval']
        },
        {
          order: 3,
          name: 'Eradication',
          duration: '4 hours',
          actions: [
            { action: 'Remove malware/backdoors', owner: 'Security Team', automated: false },
            { action: 'Patch exploited vulnerabilities', owner: 'IT Operations', automated: false },
            { action: 'Reset compromised credentials', owner: 'IAM Team', automated: true }
          ],
          successCriteria: ['All IOCs removed', 'Vulnerabilities patched'],
          rollbackTriggers: ['Reinfection detected']
        },
        {
          order: 4,
          name: 'Recovery',
          duration: '24 hours',
          actions: [
            { action: 'Restore from clean backups', owner: 'IT Operations', automated: false },
            { action: 'Validate system integrity', owner: 'Security Team', automated: true },
            { action: 'Gradual service restoration', owner: 'IT Operations', automated: false }
          ],
          successCriteria: ['Systems operational', 'No anomalies detected'],
          rollbackTriggers: ['Integrity check failure']
        },
        {
          order: 5,
          name: 'Lessons Learned',
          duration: '1 week',
          actions: [
            { action: 'Conduct post-incident review', owner: 'Security Team', automated: false },
            { action: 'Update detection rules', owner: 'SOC Team', automated: false },
            { action: 'Improve defenses based on findings', owner: 'Security Team', automated: false }
          ],
          successCriteria: ['PIR completed', 'Improvements documented'],
          rollbackTriggers: []
        }
      ],
      escalationPath: [
        { level: 1, contact: 'SOC Manager', condition: 'Initial detection' },
        { level: 2, contact: 'CISO', condition: 'Confirmed incident' },
        { level: 3, contact: 'CEO', condition: 'Critical business impact' },
        { level: 4, contact: 'Board', condition: 'Material breach' }
      ],
      communicationPlan: [
        { audience: 'Internal IT', message: 'Technical details and actions required', timing: 'Immediate' },
        { audience: 'Executive Team', message: 'Impact summary and response status', timing: '1 hour' },
        { audience: 'Employees', message: 'General awareness if needed', timing: '4 hours' },
        { audience: 'Customers', message: 'If data affected, per legal requirements', timing: 'As required' },
        { audience: 'Regulators', message: 'Per compliance requirements', timing: 'Within 72 hours' }
      ]
    };
  }

  // ---------------------------------------------------------------------------
  // SECURITY POSTURE
  // ---------------------------------------------------------------------------

  private async updateSecurityPosture(organizationId: string): Promise<void> {
    const orgAssessments = [...this.assessments.values()]
      .filter(a => a.organizationId === organizationId);
    
    const orgStrategies = [...this.strategies.values()]
      .filter(s => s.organizationId === organizationId);

    const activeThreats = orgAssessments
      .flatMap(a => a.threats)
      .filter(t => t.severity === 'critical' || t.severity === 'high').length;

    const mitigatedThreats = orgStrategies
      .flatMap(s => s.mitigations)
      .filter(m => m.status === 'completed').length;

    const totalDefenses = orgStrategies.flatMap(s => s.defenses).length;
    const avgEffectiveness = totalDefenses > 0
      ? orgStrategies.flatMap(s => s.defenses).reduce((sum, d) => sum + d.effectiveness, 0) / totalDefenses
      : 0.5;

    const posture: SecurityPosture = {
      organizationId,
      overallScore: Math.round(avgEffectiveness * 100),
      dimensions: {
        prevention: Math.round(avgEffectiveness * 100 * 0.9),
        detection: Math.round(avgEffectiveness * 100 * 0.85),
        response: Math.round(avgEffectiveness * 100 * 0.8),
        recovery: Math.round(avgEffectiveness * 100 * 0.75)
      },
      activeThreats,
      mitigatedThreats,
      openVulnerabilities: activeThreats - mitigatedThreats,
      lastAssessment: new Date()
    };

    this.postures.set(organizationId, posture);
  }

  getSecurityPosture(organizationId: string): SecurityPosture | undefined {
    return this.postures.get(organizationId);
  }

  // ---------------------------------------------------------------------------
  // STRATEGY MANAGEMENT
  // ---------------------------------------------------------------------------

  async approveStrategy(strategyId: string, approverId: string): Promise<DefenseStrategy> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error('Strategy not found');

    strategy.status = 'approved';
    strategy.approvedAt = new Date();
    strategy.approvedBy = approverId;

    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: strategy.organizationId,
        user_id: approverId,
        action: 'UNION_STRATEGY_APPROVED',
        resource_type: 'defense_strategy',
        resource_id: strategyId,
        details: {
          defenseCount: strategy.defenses.length,
          mitigationCount: strategy.mitigations.length
        } as any
      }
    });

    return strategy;
  }

  async activateStrategy(strategyId: string): Promise<DefenseStrategy> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error('Strategy not found');
    if (strategy.status !== 'approved') throw new Error('Strategy must be approved first');

    strategy.status = 'active';

    // Update all mitigations to in_progress
    for (const mitigation of strategy.mitigations) {
      mitigation.status = 'in_progress';
    }

    return strategy;
  }

  async updateMitigationStatus(
    strategyId: string,
    mitigationId: string,
    status: Mitigation['status']
  ): Promise<Mitigation> {
    const strategy = this.strategies.get(strategyId);
    if (!strategy) throw new Error('Strategy not found');

    const mitigation = strategy.mitigations.find(m => m.id === mitigationId);
    if (!mitigation) throw new Error('Mitigation not found');

    mitigation.status = status;

    // Update security posture if completed
    if (status === 'completed') {
      await this.updateSecurityPosture(strategy.organizationId);
    }

    return mitigation;
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  getAssessment(assessmentId: string): ThreatAssessment | undefined {
    return this.assessments.get(assessmentId);
  }

  getStrategy(strategyId: string): DefenseStrategy | undefined {
    return this.strategies.get(strategyId);
  }

  async getOrganizationStrategies(organizationId: string): Promise<DefenseStrategy[]> {
    return [...this.strategies.values()].filter(s => s.organizationId === organizationId);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(organizationId?: string): {
    totalAssessments: number;
    totalStrategies: number;
    activeStrategies: number;
    totalThreatsIdentified: number;
    totalMitigationsCompleted: number;
    avgDefenseEffectiveness: number;
  } {
    const assessments = organizationId
      ? [...this.assessments.values()].filter(a => a.organizationId === organizationId)
      : [...this.assessments.values()];

    const strategies = organizationId
      ? [...this.strategies.values()].filter(s => s.organizationId === organizationId)
      : [...this.strategies.values()];

    const activeStrategies = strategies.filter(s => s.status === 'active');
    const allDefenses = strategies.flatMap(s => s.defenses);
    const completedMitigations = strategies.flatMap(s => s.mitigations).filter(m => m.status === 'completed');

    return {
      totalAssessments: assessments.length,
      totalStrategies: strategies.length,
      activeStrategies: activeStrategies.length,
      totalThreatsIdentified: assessments.flatMap(a => a.threats).length,
      totalMitigationsCompleted: completedMitigations.length,
      avgDefenseEffectiveness: allDefenses.length > 0
        ? allDefenses.reduce((sum, d) => sum + d.effectiveness, 0) / allDefenses.length
        : 0
    };
  }
}

export const unionService = new UnionService();
export default unionService;
