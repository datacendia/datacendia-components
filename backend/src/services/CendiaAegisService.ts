// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaAegis™ - Strategic Defense Intelligence
 * 
 * "Real-time threat detection, containment, and resilience modeling."
 * 
 * Capabilities:
 * - Signal Monitoring: Cyber, geopolitical, infrastructure, supply chain
 * - Scenario Generation: "If X happens, here are cascading failures"
 * - Countermeasure Simulation: Test response options
 * - Threat Briefings: Executive-ready intelligence reports
 * - Early Warning: Emerging threat detection
 * 
 * Integrations: Crucible, Council, Shield, Mirror
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { EnhancedLLMService } from './EnhancedLLMService.js';

// =============================================================================
// TYPES
// =============================================================================

export type SignalType = 'CYBER' | 'GEOPOLITICAL' | 'INFRASTRUCTURE' | 'SUPPLY_CHAIN' | 'FINANCIAL' | 'ENVIRONMENTAL' | 'SOCIAL' | 'REGULATORY';
export type ThreatType = 'CYBER_ATTACK' | 'DATA_BREACH' | 'INSIDER_THREAT' | 'SUPPLY_CHAIN_ATTACK' | 'PHYSICAL_SECURITY' | 'GEOPOLITICAL_RISK' | 'NATURAL_DISASTER' | 'MARKET_DISRUPTION' | 'REGULATORY_ACTION' | 'REPUTATIONAL_CRISIS';
export type Severity = 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW' | 'INFORMATIONAL';
export type ThreatStatus = 'ACTIVE' | 'MONITORING' | 'CONTAINED' | 'MITIGATED' | 'RESOLVED';

export interface ThreatSignal {
  id: string;
  signalType: SignalType;
  source: string;
  title: string;
  content: string;
  severity: Severity;
  confidence: number;
  entities: string[];
  tags: string[];
}

export interface ThreatAssessment {
  id: string;
  threatType: ThreatType;
  title: string;
  description: string;
  severity: Severity;
  probability: number;
  impactScore: number;
  affectedAssets: string[];
  status: ThreatStatus;
}

export interface CascadeScenario {
  id: string;
  scenarioName: string;
  description: string;
  triggerConditions: string[];
  cascadeEffects: CascadeEffect[];
  financialImpact: number;
  operationalImpact: number;
  reputationalImpact: number;
  recoveryTimeHours: number;
  probability: number;
}

export interface CascadeEffect {
  system: string;
  effect: string;
  timeToImpact: number;
  severity: Severity;
}

export interface Countermeasure {
  id: string;
  title: string;
  description: string;
  type: 'PREVENTIVE' | 'DETECTIVE' | 'CORRECTIVE' | 'DETERRENT' | 'RECOVERY';
  effectiveness: number;
  costEstimate: number;
  timeToImplement: number;
  status: string;
}

export interface ThreatBriefing {
  id: string;
  title: string;
  classification: 'PUBLIC' | 'INTERNAL' | 'CONFIDENTIAL' | 'RESTRICTED';
  executiveSummary: string;
  detailedAnalysis: string;
  recommendations: string[];
}

// =============================================================================
// THREAT INTELLIGENCE FEEDS (Simulated sources for demo)
// =============================================================================

const THREAT_FEEDS = [
  { source: 'CISA Alerts', type: 'CYBER' as SignalType, reliability: 0.95 },
  { source: 'Reuters Geopolitical', type: 'GEOPOLITICAL' as SignalType, reliability: 0.9 },
  { source: 'Supply Chain Monitor', type: 'SUPPLY_CHAIN' as SignalType, reliability: 0.85 },
  { source: 'Financial Times Markets', type: 'FINANCIAL' as SignalType, reliability: 0.9 },
  { source: 'Environmental Watch', type: 'ENVIRONMENTAL' as SignalType, reliability: 0.8 },
  { source: 'Social Sentiment AI', type: 'SOCIAL' as SignalType, reliability: 0.75 },
  { source: 'RegTech Scanner', type: 'REGULATORY' as SignalType, reliability: 0.88 },
];

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class CendiaAegisService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  // ===========================================================================
  // SIGNAL MONITORING
  // ===========================================================================

  /**
   * Ingest a new threat signal
   */
  async ingestSignal(
    organizationId: string,
    signalData: {
      signalType: SignalType;
      source: string;
      title: string;
      content: string;
      rawData?: any;
    }
  ): Promise<ThreatSignal> {
    // Analyze signal using LLM
    const analysis = await this.analyzeSignal(signalData);

    const signal = await prisma.aegis_signals.create({
      data: {
        organization_id: organizationId,
        signal_type: signalData.signalType,
        source: signalData.source,
        title: signalData.title,
        content: signalData.content,
        severity: analysis.severity,
        confidence: analysis.confidence,
        entities_mentioned: analysis.entities,
        tags: analysis.tags,
        raw_data: signalData.rawData || null,
      },
    });

    // Check if this signals a new threat
    if (analysis.severity !== 'INFORMATIONAL' && analysis.confidence > 0.6) {
      await this.assessThreatFromSignal(organizationId, signal.id, analysis);
    }

    logger.info(`Ingested ${signalData.signalType} signal: ${signalData.title}`);

    return {
      id: signal.id,
      signalType: signal.signal_type as SignalType,
      source: signal.source,
      title: signal.title,
      content: signal.content,
      severity: signal.severity as Severity,
      confidence: signal.confidence,
      entities: signal.entities_mentioned as string[],
      tags: signal.tags as string[],
    };
  }

  /**
   * Analyze signal content using LLM
   */
  private async analyzeSignal(signalData: any): Promise<{
    severity: Severity;
    confidence: number;
    entities: string[];
    tags: string[];
    threatIndicators: string[];
  }> {
    const prompt = `Analyze this threat intelligence signal:

Type: ${signalData.signalType}
Source: ${signalData.source}
Title: ${signalData.title}
Content: ${signalData.content}

Provide analysis as JSON:
{
  "severity": "CRITICAL|HIGH|MEDIUM|LOW|INFORMATIONAL",
  "confidence": 0.0-1.0,
  "entities": ["organizations, people, systems mentioned"],
  "tags": ["relevant tags"],
  "threatIndicators": ["specific threat indicators found"]
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a threat intelligence analyst. Analyze signals accurately and concisely.',
        temperature: 0.3,
        maxTokens: 300,
        format: 'json',
      });

      return JSON.parse(response);
    } catch (error) {
      return {
        severity: 'LOW' as Severity,
        confidence: 0.5,
        entities: [],
        tags: [signalData.signalType.toLowerCase()],
        threatIndicators: [],
      };
    }
  }

  /**
   * Get recent signals for organization
   */
  async getRecentSignals(
    organizationId: string,
    filters?: {
      signalType?: SignalType;
      severity?: Severity;
      limit?: number;
    }
  ): Promise<ThreatSignal[]> {
    const signals = await prisma.aegis_signals.findMany({
      where: {
        organization_id: organizationId,
        ...(filters?.signalType && { signal_type: filters.signalType }),
        ...(filters?.severity && { severity: filters.severity }),
      },
      orderBy: { created_at: 'desc' },
      take: filters?.limit || 50,
    });

    return signals.map(s => ({
      id: s.id,
      signalType: s.signal_type as SignalType,
      source: s.source,
      title: s.title,
      content: s.content,
      severity: s.severity as Severity,
      confidence: s.confidence,
      entities: s.entities_mentioned as string[],
      tags: s.tags as string[],
    }));
  }

  // ===========================================================================
  // THREAT ASSESSMENT
  // ===========================================================================

  /**
   * Create threat assessment from signal
   */
  private async assessThreatFromSignal(
    organizationId: string,
    signalId: string,
    analysis: any
  ): Promise<void> {
    const prompt = `Based on this threat signal analysis, determine if it represents an active threat:

Severity: ${analysis.severity}
Confidence: ${analysis.confidence}
Entities: ${analysis.entities.join(', ')}
Indicators: ${analysis.threatIndicators.join(', ')}

If this is a credible threat, provide:
{
  "isThreat": true,
  "threatType": "CYBER_ATTACK|DATA_BREACH|INSIDER_THREAT|SUPPLY_CHAIN_ATTACK|PHYSICAL_SECURITY|GEOPOLITICAL_RISK|NATURAL_DISASTER|MARKET_DISRUPTION|REGULATORY_ACTION|REPUTATIONAL_CRISIS",
  "title": "Threat title",
  "description": "Detailed description",
  "probability": 0.0-1.0,
  "impactScore": 0-100,
  "affectedAssets": ["list of potentially affected assets"],
  "attackVectors": ["potential attack methods"]
}

If not a threat: {"isThreat": false}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a threat assessment specialist.',
        temperature: 0.3,
        maxTokens: 400,
        format: 'json',
      });

      const result = JSON.parse(response);

      if (result.isThreat) {
        await prisma.aegis_threats.create({
          data: {
            organization_id: organizationId,
            signal_id: signalId,
            threat_type: result.threatType || 'CYBER_ATTACK',
            title: result.title,
            description: result.description,
            severity: analysis.severity,
            probability: result.probability || 0.5,
            impact_score: result.impactScore || 50,
            affected_assets: result.affectedAssets || [],
            attack_vectors: result.attackVectors || [],
            indicators: analysis.threatIndicators || [],
            status: 'ACTIVE',
          },
        });
      }
    } catch (error) {
      logger.error('Threat assessment failed:', error);
    }
  }

  /**
   * Create manual threat assessment
   */
  async createThreat(
    organizationId: string,
    threatData: {
      threatType: ThreatType;
      title: string;
      description: string;
      severity: Severity;
      probability?: number;
      impactScore?: number;
      affectedAssets?: string[];
    }
  ): Promise<ThreatAssessment> {
    const threat = await prisma.aegis_threats.create({
      data: {
        organization_id: organizationId,
        threat_type: threatData.threatType,
        title: threatData.title,
        description: threatData.description,
        severity: threatData.severity,
        probability: threatData.probability || 0.5,
        impact_score: threatData.impactScore || 50,
        affected_assets: threatData.affectedAssets || [],
        attack_vectors: [],
        indicators: [],
        status: 'ACTIVE',
      },
    });

    return {
      id: threat.id,
      threatType: threat.threat_type as ThreatType,
      title: threat.title,
      description: threat.description,
      severity: threat.severity as Severity,
      probability: threat.probability,
      impactScore: threat.impact_score,
      affectedAssets: threat.affected_assets as string[],
      status: threat.status as ThreatStatus,
    };
  }

  /**
   * Get active threats
   */
  async getActiveThreats(organizationId: string): Promise<ThreatAssessment[]> {
    const threats = await prisma.aegis_threats.findMany({
      where: {
        organization_id: organizationId,
        status: { in: ['ACTIVE', 'MONITORING', 'CONTAINED'] },
      },
      include: {
        signal: true,
        scenarios: true,
        countermeasures: true,
      },
      orderBy: [{ severity: 'asc' }, { probability: 'desc' }],
    });

    return threats.map(t => ({
      id: t.id,
      threatType: t.threat_type as ThreatType,
      title: t.title,
      description: t.description,
      severity: t.severity as Severity,
      probability: t.probability,
      impactScore: t.impact_score,
      affectedAssets: t.affected_assets as string[],
      status: t.status as ThreatStatus,
    }));
  }

  /**
   * Update threat status
   */
  async updateThreatStatus(
    threatId: string,
    status: ThreatStatus
  ): Promise<ThreatAssessment> {
    const threat = await prisma.aegis_threats.update({
      where: { id: threatId },
      data: {
        status,
        ...(status === 'MITIGATED' || status === 'RESOLVED' 
          ? { mitigated_at: new Date() } 
          : {}),
      },
    });

    return {
      id: threat.id,
      threatType: threat.threat_type as ThreatType,
      title: threat.title,
      description: threat.description,
      severity: threat.severity as Severity,
      probability: threat.probability,
      impactScore: threat.impact_score,
      affectedAssets: threat.affected_assets as string[],
      status: threat.status as ThreatStatus,
    };
  }

  // ===========================================================================
  // SCENARIO GENERATION
  // ===========================================================================

  /**
   * Generate cascade scenarios for a threat
   */
  async generateScenarios(threatId: string): Promise<CascadeScenario[]> {
    const threat = await prisma.aegis_threats.findUnique({
      where: { id: threatId },
    });

    if (!threat) {
      throw new Error('Threat not found');
    }

    const prompt = `Generate 3 cascade failure scenarios for this threat:

Threat: ${threat.title}
Type: ${threat.threat_type}
Description: ${threat.description}
Severity: ${threat.severity}
Affected Assets: ${(threat.affected_assets as string[]).join(', ')}

For each scenario provide:
{
  "scenarioName": "Name",
  "description": "What happens",
  "triggerConditions": ["conditions that trigger this"],
  "cascadeEffects": [
    {"system": "affected system", "effect": "what fails", "timeToImpact": hours, "severity": "CRITICAL|HIGH|MEDIUM|LOW"}
  ],
  "financialImpact": estimated_dollars,
  "operationalImpact": 0-100,
  "reputationalImpact": 0-100,
  "recoveryTimeHours": hours,
  "probability": 0.0-1.0
}

Respond as JSON array of 3 scenarios.`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a risk analyst specializing in cascade failure analysis.',
        temperature: 0.5,
        maxTokens: 1000,
        format: 'json',
      });

      const scenarios = JSON.parse(response);
      const savedScenarios: CascadeScenario[] = [];

      for (const s of scenarios) {
        const saved = await prisma.aegis_scenarios.create({
          data: {
            threat_id: threatId,
            scenario_name: s.scenarioName,
            description: s.description,
            trigger_conditions: s.triggerConditions || [],
            cascade_effects: s.cascadeEffects || [],
            affected_systems: s.cascadeEffects?.map((e: any) => e.system) || [],
            financial_impact: s.financialImpact || 0,
            operational_impact: s.operationalImpact || 50,
            reputational_impact: s.reputationalImpact || 50,
            recovery_time_hours: s.recoveryTimeHours || 24,
            probability: s.probability || 0.5,
          },
        });

        savedScenarios.push({
          id: saved.id,
          scenarioName: saved.scenario_name,
          description: saved.description,
          triggerConditions: saved.trigger_conditions as string[],
          cascadeEffects: (saved.cascade_effects as unknown) as CascadeEffect[],
          financialImpact: saved.financial_impact || 0,
          operationalImpact: saved.operational_impact || 0,
          reputationalImpact: saved.reputational_impact || 0,
          recoveryTimeHours: saved.recovery_time_hours || 0,
          probability: saved.probability,
        });
      }

      return savedScenarios;
    } catch (error) {
      logger.error('Scenario generation failed:', error);
      return [];
    }
  }

  /**
   * Get scenarios for a threat
   */
  async getThreatScenarios(threatId: string): Promise<CascadeScenario[]> {
    const scenarios = await prisma.aegis_scenarios.findMany({
      where: { threat_id: threatId },
      orderBy: { probability: 'desc' },
    });

    return scenarios.map(s => ({
      id: s.id,
      scenarioName: s.scenario_name,
      description: s.description,
      triggerConditions: s.trigger_conditions as string[],
      cascadeEffects: (s.cascade_effects as unknown) as CascadeEffect[],
      financialImpact: s.financial_impact || 0,
      operationalImpact: s.operational_impact || 0,
      reputationalImpact: s.reputational_impact || 0,
      recoveryTimeHours: s.recovery_time_hours || 0,
      probability: s.probability,
    }));
  }

  // ===========================================================================
  // COUNTERMEASURE SIMULATION
  // ===========================================================================

  /**
   * Generate countermeasures for a threat
   */
  async generateCountermeasures(threatId: string): Promise<Countermeasure[]> {
    const threat = await prisma.aegis_threats.findUnique({
      where: { id: threatId },
      include: { scenarios: true },
    });

    if (!threat) {
      throw new Error('Threat not found');
    }

    const prompt = `Recommend countermeasures for this threat:

Threat: ${threat.title}
Type: ${threat.threat_type}
Severity: ${threat.severity}
Affected Assets: ${(threat.affected_assets as string[]).join(', ')}

Generate 5 countermeasures with:
{
  "title": "Countermeasure name",
  "description": "What to do",
  "type": "PREVENTIVE|DETECTIVE|CORRECTIVE|DETERRENT|RECOVERY",
  "implementation": ["step 1", "step 2"],
  "effectiveness": 0.0-1.0,
  "costEstimate": dollars,
  "timeToImplement": hours
}

Respond as JSON array.`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a security architect designing threat countermeasures.',
        temperature: 0.4,
        maxTokens: 800,
        format: 'json',
      });

      const countermeasures = JSON.parse(response);
      const saved: Countermeasure[] = [];

      for (const c of countermeasures) {
        const cm = await prisma.aegis_countermeasures.create({
          data: {
            threat_id: threatId,
            countermeasure_type: c.type || 'PREVENTIVE',
            title: c.title,
            description: c.description,
            implementation: c.implementation || [],
            cost_estimate: c.costEstimate || 0,
            effectiveness: c.effectiveness || 0.7,
            time_to_implement: c.timeToImplement || 24,
            dependencies: [],
            status: 'PROPOSED',
          },
        });

        saved.push({
          id: cm.id,
          title: cm.title,
          description: cm.description,
          type: cm.countermeasure_type as any,
          effectiveness: cm.effectiveness,
          costEstimate: cm.cost_estimate || 0,
          timeToImplement: cm.time_to_implement || 0,
          status: cm.status,
        });
      }

      return saved;
    } catch (error) {
      logger.error('Countermeasure generation failed:', error);
      return [];
    }
  }

  /**
   * Get countermeasures for a threat
   */
  async getThreatCountermeasures(threatId: string): Promise<Countermeasure[]> {
    const cms = await prisma.aegis_countermeasures.findMany({
      where: { threat_id: threatId },
      orderBy: { effectiveness: 'desc' },
    });

    return cms.map(cm => ({
      id: cm.id,
      title: cm.title,
      description: cm.description,
      type: cm.countermeasure_type as any,
      effectiveness: cm.effectiveness,
      costEstimate: cm.cost_estimate || 0,
      timeToImplement: cm.time_to_implement || 0,
      status: cm.status,
    }));
  }

  /**
   * Implement a countermeasure
   */
  async implementCountermeasure(countermeasureId: string): Promise<Countermeasure> {
    const cm = await prisma.aegis_countermeasures.update({
      where: { id: countermeasureId },
      data: {
        status: 'IMPLEMENTED',
        implemented_at: new Date(),
      },
    });

    return {
      id: cm.id,
      title: cm.title,
      description: cm.description,
      type: cm.countermeasure_type as any,
      effectiveness: cm.effectiveness,
      costEstimate: cm.cost_estimate || 0,
      timeToImplement: cm.time_to_implement || 0,
      status: cm.status,
    };
  }

  // ===========================================================================
  // THREAT BRIEFINGS
  // ===========================================================================

  /**
   * Generate executive briefing
   */
  async generateBriefing(
    organizationId: string,
    threatId?: string,
    briefingType: 'DAILY_INTEL' | 'THREAT_ALERT' | 'INCIDENT_REPORT' | 'STRATEGIC_ASSESSMENT' | 'EXECUTIVE_SUMMARY' = 'EXECUTIVE_SUMMARY'
  ): Promise<ThreatBriefing> {
    let context = '';
    
    if (threatId) {
      const threat = await prisma.aegis_threats.findUnique({
        where: { id: threatId },
        include: { scenarios: true, countermeasures: true },
      });
      
      if (threat) {
        context = `
Specific Threat: ${threat.title}
Type: ${threat.threat_type}
Severity: ${threat.severity}
Status: ${threat.status}
Scenarios: ${threat.scenarios.map(s => s.scenario_name).join(', ')}
Countermeasures: ${threat.countermeasures.map(c => c.title).join(', ')}`;
      }
    } else {
      const threats = await this.getActiveThreats(organizationId);
      context = `
Active Threats: ${threats.length}
Critical: ${threats.filter(t => t.severity === 'CRITICAL').length}
High: ${threats.filter(t => t.severity === 'HIGH').length}
Threat Types: ${[...new Set(threats.map(t => t.threatType))].join(', ')}`;
    }

    const prompt = `Generate an executive threat briefing:

Briefing Type: ${briefingType}
${context}

Provide:
{
  "title": "Briefing title",
  "executiveSummary": "2-3 paragraph executive summary",
  "detailedAnalysis": "Detailed analysis (3-4 paragraphs)",
  "recommendations": ["actionable recommendations"],
  "classification": "INTERNAL|CONFIDENTIAL|RESTRICTED"
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a threat intelligence briefer preparing executive communications.',
        temperature: 0.4,
        maxTokens: 800,
        format: 'json',
      });

      const briefingData = JSON.parse(response);

      const briefing = await prisma.aegis_briefings.create({
        data: {
          organization_id: organizationId,
          threat_id: threatId || null,
          briefing_type: briefingType,
          title: briefingData.title,
          executive_summary: briefingData.executiveSummary,
          detailed_analysis: briefingData.detailedAnalysis,
          recommendations: briefingData.recommendations || [],
          classification: briefingData.classification || 'INTERNAL',
          recipients: [],
        },
      });

      return {
        id: briefing.id,
        title: briefing.title,
        classification: briefing.classification as any,
        executiveSummary: briefing.executive_summary,
        detailedAnalysis: briefing.detailed_analysis,
        recommendations: briefing.recommendations as string[],
      };
    } catch (error) {
      logger.error('Briefing generation failed:', error);
      throw error;
    }
  }

  /**
   * Get briefings
   */
  async getBriefings(
    organizationId: string,
    limit: number = 10
  ): Promise<ThreatBriefing[]> {
    const briefings = await prisma.aegis_briefings.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return briefings.map(b => ({
      id: b.id,
      title: b.title,
      classification: b.classification as any,
      executiveSummary: b.executive_summary,
      detailedAnalysis: b.detailed_analysis,
      recommendations: b.recommendations as string[],
    }));
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  /**
   * Get threat intelligence dashboard
   */
  async getDashboard(organizationId: string): Promise<any> {
    const [
      activeThreats,
      recentSignals,
      criticalThreats,
      pendingCountermeasures,
    ] = await Promise.all([
      prisma.aegis_threats.count({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
      prisma.aegis_signals.count({
        where: {
          organization_id: organizationId,
          created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.aegis_threats.findMany({
        where: {
          organization_id: organizationId,
          severity: { in: ['CRITICAL', 'HIGH'] },
          status: { in: ['ACTIVE', 'MONITORING'] },
        },
        select: { id: true, title: true, severity: true, threat_type: true },
      }),
      prisma.aegis_countermeasures.count({
        where: {
          threat: { organization_id: organizationId },
          status: 'PROPOSED',
        },
      }),
    ]);

    return {
      activeThreats,
      signalsLast24h: recentSignals,
      criticalThreats: criticalThreats.length,
      pendingCountermeasures,
      topThreats: criticalThreats.slice(0, 5),
      threatFeeds: THREAT_FEEDS.length,
    };
  }

  // ===========================================================================
  // EXPRESS MODE - Standalone outputs WITHOUT Council
  // ===========================================================================

  /**
   * Express: Generate quick threat briefing directly (no Council needed)
   * Returns threat assessment with countermeasures in one fast call.
   */
  async getQuickBriefing(
    organizationId: string,
    threatId?: string
  ): Promise<{
    threat: string;
    severity: Severity;
    probability: number;
    countermeasures: Array<{
      action: string;
      priority: number;
      effort: 'LOW' | 'MEDIUM' | 'HIGH';
    }>;
    estimatedImpact: string;
    summary: string;
    mode: 'express';
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    if (threatId) {
      // Briefing for a specific threat
      const threat = await prisma.aegis_threats.findUnique({
        where: { id: threatId },
        include: { countermeasures: true },
      });

      if (!threat) {
        throw new Error('Threat not found');
      }

      // If countermeasures already exist, use them
      const existingCMs = (threat.countermeasures || []).map((cm: any, i: number) => ({
        action: cm.title,
        priority: i + 1,
        effort: (cm.cost_estimate > 50000 ? 'HIGH' : cm.cost_estimate > 10000 ? 'MEDIUM' : 'LOW') as 'LOW' | 'MEDIUM' | 'HIGH',
      }));

      if (existingCMs.length > 0) {
        return {
          threat: threat.title,
          severity: threat.severity as Severity,
          probability: threat.probability,
          countermeasures: existingCMs,
          estimatedImpact: `Impact score: ${threat.impact_score}/100. Affected assets: ${(threat.affected_assets as string[]).join(', ') || 'Unknown'}`,
          summary: threat.description,
          mode: 'express',
          generatedAt: new Date(),
        };
      }

      // Generate countermeasures with LLM
      const prompt = `Generate prioritized countermeasures for this threat:

Threat: ${threat.title}
Type: ${threat.threat_type}
Severity: ${threat.severity}
Description: ${threat.description}
Affected Assets: ${(threat.affected_assets as string[]).join(', ')}
Attack Vectors: ${(threat.attack_vectors as string[]).join(', ')}

Respond as JSON:
{
  "countermeasures": [
    {"action": "Specific action to take", "priority": 1, "effort": "LOW|MEDIUM|HIGH"}
  ],
  "estimatedImpact": "$X-$Y if successful"
}`;

      try {
        const response = await this.llmService.generate(prompt, {
          model: 'llama3.2:3b',
          systemPrompt: 'You are a threat response expert. Provide specific, actionable countermeasures.',
          temperature: 0.3,
          maxTokens: 500,
          format: 'json',
        });

        const parsed = JSON.parse(response);
        const durationMs = Date.now() - startTime;
        logger.info(`[Aegis Express] Quick briefing generated in ${durationMs}ms`);

        return {
          threat: threat.title,
          severity: threat.severity as Severity,
          probability: threat.probability,
          countermeasures: parsed.countermeasures || [],
          estimatedImpact: parsed.estimatedImpact || `Impact score: ${threat.impact_score}/100`,
          summary: threat.description,
          mode: 'express',
          generatedAt: new Date(),
        };
      } catch {
        return {
          threat: threat.title,
          severity: threat.severity as Severity,
          probability: threat.probability,
          countermeasures: [{ action: 'Initiate incident response procedures', priority: 1, effort: 'HIGH' }],
          estimatedImpact: `Impact score: ${threat.impact_score}/100`,
          summary: threat.description,
          mode: 'express',
          generatedAt: new Date(),
        };
      }
    }

    // General threat landscape briefing
    const activeThreats = await this.getActiveThreats(organizationId);
    const highestThreat = activeThreats[0];

    if (!highestThreat) {
      return {
        threat: 'No active threats detected',
        severity: 'INFORMATIONAL',
        probability: 0,
        countermeasures: [{ action: 'Continue monitoring threat feeds', priority: 1, effort: 'LOW' }],
        estimatedImpact: 'No immediate impact',
        summary: 'Threat landscape is clear. No active threats detected for this organization.',
        mode: 'express',
        generatedAt: new Date(),
      };
    }

    const prompt = `Generate a quick threat landscape briefing:

Active Threats: ${activeThreats.length}
Critical: ${activeThreats.filter(t => t.severity === 'CRITICAL').length}
High: ${activeThreats.filter(t => t.severity === 'HIGH').length}
Top Threat: ${highestThreat.title} (${highestThreat.threatType}, ${highestThreat.severity})

Respond as JSON:
{
  "summary": "2-3 sentence landscape summary",
  "countermeasures": [
    {"action": "Top priority action", "priority": 1, "effort": "LOW|MEDIUM|HIGH"}
  ],
  "estimatedImpact": "Overall risk estimate"
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a threat intelligence analyst. Provide concise, actionable briefings.',
        temperature: 0.3,
        maxTokens: 400,
        format: 'json',
      });

      const parsed = JSON.parse(response);

      return {
        threat: highestThreat.title,
        severity: highestThreat.severity,
        probability: highestThreat.probability,
        countermeasures: parsed.countermeasures || [],
        estimatedImpact: parsed.estimatedImpact || `${activeThreats.length} active threats`,
        summary: parsed.summary || `${activeThreats.length} active threats detected.`,
        mode: 'express',
        generatedAt: new Date(),
      };
    } catch {
      return {
        threat: highestThreat.title,
        severity: highestThreat.severity,
        probability: highestThreat.probability,
        countermeasures: [{ action: 'Review active threats and prioritize response', priority: 1, effort: 'MEDIUM' }],
        estimatedImpact: `${activeThreats.length} active threats detected`,
        summary: `${activeThreats.length} active threats. Highest: ${highestThreat.title} (${highestThreat.severity}).`,
        mode: 'express',
        generatedAt: new Date(),
      };
    }
  }

  /**
   * Express: Get threat summary with risk score (no Council needed)
   */
  async getThreatSummary(organizationId: string): Promise<{
    threatLevel: Severity;
    activeThreats: number;
    criticalCount: number;
    highCount: number;
    topThreats: Array<{ title: string; type: string; severity: Severity; probability: number }>;
    riskScore: number;
    mode: 'express';
  }> {
    const threats = await this.getActiveThreats(organizationId);

    const criticalCount = threats.filter(t => t.severity === 'CRITICAL').length;
    const highCount = threats.filter(t => t.severity === 'HIGH').length;

    const threatLevel: Severity = criticalCount > 0 ? 'CRITICAL'
      : highCount > 0 ? 'HIGH'
        : threats.length > 0 ? 'MEDIUM'
          : 'LOW';

    const riskScore = Math.min(100, Math.round(
      criticalCount * 30 + highCount * 15 + threats.length * 5
    ));

    return {
      threatLevel,
      activeThreats: threats.length,
      criticalCount,
      highCount,
      topThreats: threats.slice(0, 5).map(t => ({
        title: t.title,
        type: t.threatType,
        severity: t.severity,
        probability: t.probability,
      })),
      riskScore,
      mode: 'express',
    };
  }
  // ===========================================================================
  // 10/10 ENHANCEMENTS - Advanced Threat Intelligence
  // ===========================================================================

  /**
   * Signal Correlation Engine: Find patterns across multiple threat signals.
   * Groups related signals, identifies attack chains, and calculates composite risk.
   */
  async correlateSignals(organizationId: string): Promise<{
    organizationId: string;
    correlationGroups: Array<{
      groupId: string;
      signals: Array<{ id: string; title: string; type: string; severity: Severity }>;
      correlationType: 'TEMPORAL' | 'ENTITY' | 'ATTACK_CHAIN' | 'SOURCE';
      compositeRisk: number;
      attackChain: string | null;
      recommendation: string;
    }>;
    isolatedSignals: number;
    totalSignalsAnalyzed: number;
    overallThreatLevel: Severity;
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    // Get recent signals
    const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000); // 30 days
    const signals = await prisma.aegis_signals.findMany({
      where: {
        organization_id: organizationId,
        created_at: { gte: cutoff },
      },
      orderBy: { created_at: 'desc' },
      take: 200,
    });

    if (signals.length === 0) {
      return {
        organizationId,
        correlationGroups: [],
        isolatedSignals: 0,
        totalSignalsAnalyzed: 0,
        overallThreatLevel: 'LOW',
        generatedAt: new Date(),
      };
    }

    const correlationGroups: Array<{
      groupId: string;
      signals: Array<{ id: string; title: string; type: string; severity: Severity }>;
      correlationType: 'TEMPORAL' | 'ENTITY' | 'ATTACK_CHAIN' | 'SOURCE';
      compositeRisk: number;
      attackChain: string | null;
      recommendation: string;
    }> = [];

    let groupCounter = 0;
    const assignedSignals = new Set<string>();

    // 1. Temporal correlation: signals within 1 hour of each other
    const sortedByTime = [...signals].sort((a, b) => a.created_at.getTime() - b.created_at.getTime());
    for (let i = 0; i < sortedByTime.length; i++) {
      if (assignedSignals.has(sortedByTime[i].id)) continue;
      const cluster: typeof signals = [sortedByTime[i]];

      for (let j = i + 1; j < sortedByTime.length; j++) {
        if (assignedSignals.has(sortedByTime[j].id)) continue;
        const timeDiff = sortedByTime[j].created_at.getTime() - sortedByTime[i].created_at.getTime();
        if (timeDiff < 3600000 && timeDiff >= 0) { // Within 1 hour
          cluster.push(sortedByTime[j]);
        }
      }

      if (cluster.length >= 3) {
        groupCounter++;
        for (const s of cluster) assignedSignals.add(s.id);
        const severityScore = this.calculateGroupSeverity(cluster);
        correlationGroups.push({
          groupId: `corr-temporal-${groupCounter}`,
          signals: cluster.map((s: any) => ({
            id: s.id,
            title: s.title,
            type: s.signal_type,
            severity: s.severity as Severity,
          })),
          correlationType: 'TEMPORAL',
          compositeRisk: severityScore,
          attackChain: cluster.length >= 4 ? 'Potential coordinated activity — multiple signals in rapid succession' : null,
          recommendation: `${cluster.length} signals within 1 hour — investigate for coordinated attack pattern`,
        });
      }
    }

    // 2. Entity correlation: signals mentioning same entities
    const entityMap = new Map<string, typeof signals>();
    for (const signal of signals) {
      if (assignedSignals.has(signal.id)) continue;
      const entities = (signal.entities_mentioned as string[]) || [];
      for (const entity of entities) {
        const normalized = entity.toLowerCase().trim();
        if (normalized.length < 3) continue;
        if (!entityMap.has(normalized)) entityMap.set(normalized, []);
        entityMap.get(normalized)!.push(signal);
      }
    }

    for (const [entity, entitySignals] of entityMap) {
      if (entitySignals.length >= 2) {
        const uniqueSignals = entitySignals.filter(s => !assignedSignals.has(s.id));
        if (uniqueSignals.length >= 2) {
          groupCounter++;
          for (const s of uniqueSignals) assignedSignals.add(s.id);
          const severityScore = this.calculateGroupSeverity(uniqueSignals);
          correlationGroups.push({
            groupId: `corr-entity-${groupCounter}`,
            signals: uniqueSignals.map((s: any) => ({
              id: s.id,
              title: s.title,
              type: s.signal_type,
              severity: s.severity as Severity,
            })),
            correlationType: 'ENTITY',
            compositeRisk: severityScore,
            attackChain: null,
            recommendation: `Multiple signals reference "${entity}" — potential targeted threat against this entity`,
          });
        }
      }
    }

    // 3. Source correlation: multiple signals from same source
    const sourceMap = new Map<string, typeof signals>();
    for (const signal of signals) {
      if (assignedSignals.has(signal.id)) continue;
      if (!sourceMap.has(signal.source)) sourceMap.set(signal.source, []);
      sourceMap.get(signal.source)!.push(signal);
    }

    for (const [source, sourceSignals] of sourceMap) {
      if (sourceSignals.length >= 3) {
        groupCounter++;
        for (const s of sourceSignals) assignedSignals.add(s.id);
        const severityScore = this.calculateGroupSeverity(sourceSignals);
        correlationGroups.push({
          groupId: `corr-source-${groupCounter}`,
          signals: sourceSignals.map((s: any) => ({
            id: s.id,
            title: s.title,
            type: s.signal_type,
            severity: s.severity as Severity,
          })),
          correlationType: 'SOURCE',
          compositeRisk: severityScore,
          attackChain: null,
          recommendation: `${sourceSignals.length} signals from "${source}" — evaluate source reliability and signal coherence`,
        });
      }
    }

    // Sort by composite risk
    correlationGroups.sort((a, b) => b.compositeRisk - a.compositeRisk);

    const isolatedSignals = signals.length - assignedSignals.size;
    const maxRisk = correlationGroups.length > 0 ? correlationGroups[0].compositeRisk : 0;
    const overallThreatLevel: Severity = maxRisk > 80 ? 'CRITICAL'
      : maxRisk > 60 ? 'HIGH'
        : maxRisk > 40 ? 'MEDIUM'
          : maxRisk > 20 ? 'LOW'
            : 'INFORMATIONAL';

    const durationMs = Date.now() - startTime;
    logger.info(`[Aegis] Signal correlation completed in ${durationMs}ms: ${correlationGroups.length} groups, ${isolatedSignals} isolated`);

    return {
      organizationId,
      correlationGroups: correlationGroups.slice(0, 10),
      isolatedSignals,
      totalSignalsAnalyzed: signals.length,
      overallThreatLevel,
      generatedAt: new Date(),
    };
  }

  /**
   * Calculate composite severity score for a group of signals.
   */
  private calculateGroupSeverity(signals: any[]): number {
    const severityValues: Record<string, number> = {
      'CRITICAL': 90, 'HIGH': 70, 'MEDIUM': 50, 'LOW': 30, 'INFORMATIONAL': 10,
    };
    const scores = signals.map((s: any) => severityValues[s.severity] || 30);
    const maxScore = Math.max(...scores);
    const avgScore = scores.reduce((a: number, b: number) => a + b, 0) / scores.length;
    // Composite: weighted toward max, boosted by count
    return Math.min(100, Math.round(maxScore * 0.6 + avgScore * 0.3 + Math.min(signals.length * 2, 10)));
  }

  /**
   * IR Playbooks: Generate NIST 800-61 incident response playbooks.
   * Creates structured playbooks with preparation, detection, containment, eradication, recovery, and lessons learned.
   */
  async generateIRPlaybook(
    organizationId: string,
    incidentType: ThreatType
  ): Promise<{
    organizationId: string;
    playbook: {
      incidentType: ThreatType;
      title: string;
      nistPhases: {
        preparation: Array<{ step: string; responsible: string; tools: string[] }>;
        detectionAndAnalysis: Array<{ step: string; responsible: string; indicators: string[] }>;
        containment: {
          shortTerm: Array<{ step: string; timeframe: string; impact: string }>;
          longTerm: Array<{ step: string; timeframe: string; impact: string }>;
        };
        eradication: Array<{ step: string; verification: string }>;
        recovery: Array<{ step: string; criteria: string; timeframe: string }>;
        lessonsLearned: Array<{ question: string; purpose: string }>;
      };
      escalationMatrix: Array<{ severity: Severity; notifyWithin: string; audience: string }>;
      communicationPlan: Array<{ audience: string; channel: string; frequency: string; template: string }>;
    };
    generatedAt: Date;
  }> {
    // NIST 800-61 based playbook templates (domain knowledge — not simulated)
    const PLAYBOOK_TEMPLATES: Record<string, {
      title: string;
      preparationSteps: string[];
      detectionIndicators: string[];
      shortTermContainment: string[];
      longTermContainment: string[];
      eradicationSteps: string[];
      recoverySteps: string[];
    }> = {
      'CYBER_ATTACK': {
        title: 'Cyber Attack Response Playbook',
        preparationSteps: [
          'Verify endpoint detection and response (EDR) tools are active on all systems',
          'Confirm backup integrity and test restore procedures',
          'Validate network segmentation controls',
          'Review and update firewall rules and ACLs',
          'Ensure incident response team contact list is current',
        ],
        detectionIndicators: [
          'Unusual network traffic patterns or data exfiltration',
          'Multiple failed authentication attempts',
          'Unauthorized process execution or privilege escalation',
          'Anomalous DNS queries or C2 communication patterns',
        ],
        shortTermContainment: [
          'Isolate affected systems from the network',
          'Block known malicious IPs and domains at the firewall',
          'Disable compromised accounts',
          'Preserve forensic evidence (memory dumps, disk images)',
        ],
        longTermContainment: [
          'Deploy additional network monitoring on affected segments',
          'Implement enhanced authentication for critical systems',
          'Patch exploited vulnerabilities across all systems',
          'Deploy additional endpoint monitoring',
        ],
        eradicationSteps: [
          'Remove malware and unauthorized access tools',
          'Reset all potentially compromised credentials',
          'Rebuild affected systems from clean images',
          'Verify removal with full system scans',
        ],
        recoverySteps: [
          'Restore systems from verified clean backups',
          'Gradually re-enable network connectivity with monitoring',
          'Validate system functionality and data integrity',
          'Monitor for re-compromise indicators for 30 days',
        ],
      },
      'DATA_BREACH': {
        title: 'Data Breach Response Playbook',
        preparationSteps: [
          'Maintain current data classification inventory',
          'Ensure DLP tools are configured and active',
          'Prepare breach notification templates (GDPR 72h, state laws)',
          'Establish relationships with external forensics firms',
          'Review cyber insurance coverage and notification requirements',
        ],
        detectionIndicators: [
          'DLP alerts on unusual data access or transfer patterns',
          'Unauthorized access to sensitive data repositories',
          'Reports from external parties about exposed data',
          'Anomalous database queries or bulk data exports',
        ],
        shortTermContainment: [
          'Revoke access to compromised data stores immediately',
          'Preserve logs and access records for forensic analysis',
          'Assess scope: what data, how much, how many affected',
          'Engage legal counsel for breach notification obligations',
        ],
        longTermContainment: [
          'Implement enhanced access controls on affected systems',
          'Deploy additional DLP monitoring rules',
          'Review and restrict data access permissions organization-wide',
          'Enable additional audit logging on sensitive data stores',
        ],
        eradicationSteps: [
          'Close the access vector used for the breach',
          'Verify no persistent access mechanisms remain',
          'Review all access logs for the compromised period',
          'Update data classification and handling procedures',
        ],
        recoverySteps: [
          'Issue breach notifications per regulatory requirements',
          'Offer affected individuals credit monitoring if PII exposed',
          'Implement compensating controls identified during analysis',
          'Update incident response procedures based on findings',
        ],
      },
      'INSIDER_THREAT': {
        title: 'Insider Threat Response Playbook',
        preparationSteps: [
          'Implement user behavior analytics (UBA) monitoring',
          'Establish clear acceptable use policies',
          'Configure DLP for data exfiltration detection',
          'Maintain chain of custody procedures for evidence',
          'Coordinate with HR and Legal on investigation protocols',
        ],
        detectionIndicators: [
          'Unusual after-hours access to sensitive systems',
          'Bulk downloading or copying of sensitive data',
          'Access to systems outside normal job function',
          'Use of unauthorized storage devices or cloud services',
        ],
        shortTermContainment: [
          'Increase monitoring on suspected account without alerting',
          'Preserve all digital evidence with proper chain of custody',
          'Restrict access to most sensitive resources',
          'Brief Legal and HR before any employee confrontation',
        ],
        longTermContainment: [
          'Review and restrict the individual access privileges',
          'Implement enhanced monitoring on similar role accounts',
          'Review data access patterns for the past 90 days',
          'Assess what data the individual had access to',
        ],
        eradicationSteps: [
          'Disable accounts and revoke all access upon HR decision',
          'Change shared credentials and API keys the person accessed',
          'Review and revoke any delegated permissions',
          'Scan for any planted backdoors or persistence mechanisms',
        ],
        recoverySteps: [
          'Reassign responsibilities and access to replacement personnel',
          'Verify data integrity of systems the individual accessed',
          'Update access control policies based on findings',
          'Conduct awareness training on insider threat indicators',
        ],
      },
    };

    // Default template for unmatched types
    const defaultTemplate = {
      title: `${incidentType.replace(/_/g, ' ')} Response Playbook`,
      preparationSteps: [
        'Review and update incident response plan',
        'Verify monitoring tools are active',
        'Ensure response team contact information is current',
        'Test communication channels',
      ],
      detectionIndicators: ['Anomalous activity patterns', 'Alert triggers from monitoring systems', 'Reports from internal or external parties'],
      shortTermContainment: ['Isolate affected systems', 'Preserve evidence', 'Assess scope and impact'],
      longTermContainment: ['Deploy enhanced monitoring', 'Implement additional controls', 'Review access permissions'],
      eradicationSteps: ['Remove root cause', 'Verify remediation', 'Reset compromised credentials'],
      recoverySteps: ['Restore normal operations', 'Monitor for recurrence', 'Update procedures'],
    };

    const template = PLAYBOOK_TEMPLATES[incidentType] || defaultTemplate;

    return {
      organizationId,
      playbook: {
        incidentType,
        title: template.title,
        nistPhases: {
          preparation: template.preparationSteps.map((step: string, i: number) => ({
            step,
            responsible: i === 0 ? 'Security Operations' : i < 3 ? 'IT Operations' : 'IR Team Lead',
            tools: i === 0 ? ['EDR', 'SIEM'] : i === 1 ? ['Backup System', 'Recovery Tools'] : ['Firewall', 'IAM'],
          })),
          detectionAndAnalysis: template.detectionIndicators.map((indicator: string) => ({
            step: `Monitor for: ${indicator}`,
            responsible: 'SOC Analyst',
            indicators: [indicator],
          })),
          containment: {
            shortTerm: template.shortTermContainment.map((step: string, i: number) => ({
              step,
              timeframe: i === 0 ? '0-15 minutes' : i === 1 ? '15-30 minutes' : '30-60 minutes',
              impact: i === 0 ? 'Service disruption possible' : 'Minimal additional impact',
            })),
            longTerm: template.longTermContainment.map((step: string, i: number) => ({
              step,
              timeframe: i === 0 ? '1-4 hours' : '4-24 hours',
              impact: 'Temporary operational constraints',
            })),
          },
          eradication: template.eradicationSteps.map((step: string) => ({
            step,
            verification: `Confirm: ${step.toLowerCase()} completed and verified`,
          })),
          recovery: template.recoverySteps.map((step: string, i: number) => ({
            step,
            criteria: 'System functionality verified, no indicators of compromise',
            timeframe: i === 0 ? '24-48 hours' : i === 1 ? '48-72 hours' : '1-2 weeks',
          })),
          lessonsLearned: [
            { question: 'What was the root cause of the incident?', purpose: 'Prevent recurrence' },
            { question: 'Were detection and response times adequate?', purpose: 'Improve MTTD/MTTR' },
            { question: 'Were communication procedures effective?', purpose: 'Improve coordination' },
            { question: 'What controls failed or were missing?', purpose: 'Identify control gaps' },
            { question: 'What should be changed in the response plan?', purpose: 'Continuous improvement' },
          ],
        },
        escalationMatrix: [
          { severity: 'CRITICAL' as Severity, notifyWithin: '15 minutes', audience: 'CISO, CTO, Legal, Executive Team' },
          { severity: 'HIGH' as Severity, notifyWithin: '1 hour', audience: 'CISO, Security Lead, IT Director' },
          { severity: 'MEDIUM' as Severity, notifyWithin: '4 hours', audience: 'Security Lead, SOC Manager' },
          { severity: 'LOW' as Severity, notifyWithin: '24 hours', audience: 'SOC Manager' },
          { severity: 'INFORMATIONAL' as Severity, notifyWithin: 'Next business day', audience: 'Security Analyst' },
        ],
        communicationPlan: [
          { audience: 'Executive Leadership', channel: 'Secure email + phone', frequency: 'Every 2 hours during active incident', template: 'Executive Situation Report' },
          { audience: 'IT Operations', channel: 'Incident Slack channel', frequency: 'Continuous during active response', template: 'Technical Status Update' },
          { audience: 'Legal/Compliance', channel: 'Secure email', frequency: 'As needed for regulatory obligations', template: 'Legal Notification Brief' },
          { audience: 'Affected Users', channel: 'Email notification', frequency: 'Post-containment', template: 'User Notification' },
        ],
      },
      generatedAt: new Date(),
    };
  }

  /**
   * Proactive Threat Hunting: Hypothesis-driven queries against internal data.
   * Generates hunt hypotheses based on current threat landscape and checks internal logs.
   */
  async runThreatHunt(
    organizationId: string,
    options?: {
      hypothesis?: string;
      focusArea?: SignalType;
      lookbackDays?: number;
    }
  ): Promise<{
    organizationId: string;
    huntId: string;
    hypothesis: string;
    findings: Array<{
      finding: string;
      severity: Severity;
      evidence: string[];
      recommendation: string;
    }>;
    dataSourcesChecked: string[];
    timeRangeChecked: { from: Date; to: Date };
    verdict: 'THREAT_FOUND' | 'SUSPICIOUS' | 'CLEAN';
    nextSteps: string[];
    generatedAt: Date;
  }> {
    const startTime = Date.now();
    const lookbackDays = options?.lookbackDays || 30;
    const cutoff = new Date(Date.now() - lookbackDays * 24 * 60 * 60 * 1000);

    // Generate or use provided hypothesis
    const hypothesis = options?.hypothesis || await this.generateHuntHypothesis(organizationId, options?.focusArea);

    // Check internal data sources
    const [signals, threats, alerts, auditLogs] = await Promise.all([
      prisma.aegis_signals.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
          ...(options?.focusArea ? { signal_type: options.focusArea } : {}),
        },
        orderBy: { created_at: 'desc' },
        take: 100,
      }),
      prisma.aegis_threats.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
          status: { in: ['ACTIVE', 'MONITORING'] },
        },
        take: 50,
      }),
      prisma.alerts.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
        },
        orderBy: { created_at: 'desc' },
        take: 50,
      }),
      prisma.audit_logs.findMany({
        where: {
          organization_id: organizationId,
          created_at: { gte: cutoff },
        },
        orderBy: { created_at: 'desc' },
        take: 200,
      }),
    ]);

    const findings: Array<{
      finding: string;
      severity: Severity;
      evidence: string[];
      recommendation: string;
    }> = [];

    // Analyze signals for anomalies
    const criticalSignals = signals.filter((s: any) => s.severity === 'CRITICAL' || s.severity === 'HIGH');
    if (criticalSignals.length > 0) {
      findings.push({
        finding: `${criticalSignals.length} high/critical signals detected in last ${lookbackDays} days`,
        severity: criticalSignals.some((s: any) => s.severity === 'CRITICAL') ? 'CRITICAL' : 'HIGH',
        evidence: criticalSignals.slice(0, 5).map((s: any) => `${s.title} (${s.signal_type}, ${s.severity})`),
        recommendation: 'Investigate each critical signal for active exploitation',
      });
    }

    // Check for unusual patterns in audit logs
    const userActions = new Map<string, number>();
    for (const log of auditLogs) {
      const userId = (log as any).user_id || 'unknown';
      userActions.set(userId, (userActions.get(userId) || 0) + 1);
    }

    // Detect anomalous users (3x average activity)
    const avgActivity = auditLogs.length / Math.max(userActions.size, 1);
    const anomalousUsers = Array.from(userActions.entries())
      .filter(([_, count]) => count > avgActivity * 3)
      .map(([userId, count]) => ({ userId, count }));

    if (anomalousUsers.length > 0) {
      findings.push({
        finding: `${anomalousUsers.length} user(s) with anomalous activity levels (3x+ average)`,
        severity: 'MEDIUM',
        evidence: anomalousUsers.map(u => `User ${u.userId}: ${u.count} actions (avg: ${Math.round(avgActivity)})`),
        recommendation: 'Review anomalous user activity for potential compromise or policy violation',
      });
    }

    // Check for active but unresolved threats
    const activeThreats = threats.filter((t: any) => t.status === 'ACTIVE');
    if (activeThreats.length > 0) {
      findings.push({
        finding: `${activeThreats.length} active unresolved threats require attention`,
        severity: activeThreats.some((t: any) => t.severity === 'CRITICAL') ? 'HIGH' : 'MEDIUM',
        evidence: activeThreats.slice(0, 5).map((t: any) => `${t.title} (${t.threat_type}, active since ${t.created_at.toISOString().split('T')[0]})`),
        recommendation: 'Prioritize resolution of active threats — each represents an open risk',
      });
    }

    // Determine verdict
    let verdict: 'THREAT_FOUND' | 'SUSPICIOUS' | 'CLEAN';
    if (findings.some(f => f.severity === 'CRITICAL')) {
      verdict = 'THREAT_FOUND';
    } else if (findings.length > 0) {
      verdict = 'SUSPICIOUS';
    } else {
      verdict = 'CLEAN';
    }

    // Generate next steps
    const nextSteps: string[] = [];
    if (verdict === 'THREAT_FOUND') {
      nextSteps.push('Initiate incident response for critical findings');
      nextSteps.push('Engage IR team and preserve evidence');
      nextSteps.push('Expand hunt scope to related systems and timeframes');
    } else if (verdict === 'SUSPICIOUS') {
      nextSteps.push('Deepen investigation on suspicious findings');
      nextSteps.push('Correlate findings with external threat intelligence');
      nextSteps.push('Schedule follow-up hunt in 7 days');
    } else {
      nextSteps.push('Document clean hunt results for compliance records');
      nextSteps.push('Schedule next proactive hunt in 30 days');
      nextSteps.push('Consider expanding hunt scope to new data sources');
    }

    const durationMs = Date.now() - startTime;
    logger.info(`[Aegis] Threat hunt completed in ${durationMs}ms: ${findings.length} findings, verdict: ${verdict}`);

    return {
      organizationId,
      huntId: `hunt-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      hypothesis,
      findings,
      dataSourcesChecked: ['Aegis Signals', 'Aegis Threats', 'System Alerts', 'Audit Logs'],
      timeRangeChecked: { from: cutoff, to: new Date() },
      verdict,
      nextSteps,
      generatedAt: new Date(),
    };
  }

  /**
   * Generate a threat hunt hypothesis based on current landscape.
   */
  private async generateHuntHypothesis(organizationId: string, focusArea?: SignalType): Promise<string> {
    const recentThreats = await prisma.aegis_threats.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: 5,
      select: { title: true, threat_type: true, severity: true },
    });

    if (recentThreats.length === 0) {
      const defaultHypotheses: Record<string, string> = {
        'CYBER': 'An attacker may have gained initial access through phishing and is performing reconnaissance',
        'GEOPOLITICAL': 'Geopolitical tensions may be creating supply chain or operational risks',
        'SUPPLY_CHAIN': 'A critical supplier may be compromised or experiencing disruption',
        'FINANCIAL': 'Market conditions may be creating exposure in financial operations',
      };
      return defaultHypotheses[focusArea || 'CYBER'] || 'Undiscovered threats may exist in the environment based on current threat landscape trends';
    }

    const threatContext = recentThreats.map((t: any) => `${t.title} (${t.threat_type})`).join(', ');
    return `Based on recent activity (${threatContext}), additional related threats may be present in the environment targeting similar vectors`;
  }
}

// Export singleton instance
export const cendiaAegisService = new CendiaAegisService();
