/**
 * Service — Cendia Aegis Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports CendiaAegisService, cendiaAegisService, ThreatSignal, ThreatAssessment, CascadeScenario, CascadeEffect, Countermeasure, ThreatBriefing
 * @module services/CendiaAegisService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaAegisÃ¢â€žÂ¢ - Strategic Defense Intelligence
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


import type { SignalType, ThreatType, Severity, ThreatStatus, ThreatSignal, ThreatAssessment, CascadeScenario, CascadeEffect, Countermeasure, ThreatBriefing } from './aegis-svc-types.js';
export type { SignalType, ThreatType, Severity, ThreatStatus, ThreatSignal, ThreatAssessment, CascadeScenario, CascadeEffect, Countermeasure, ThreatBriefing } from './aegis-svc-types.js';


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
    // Extended methods extracted to aegis-methods.ts
export const cendiaAegisService = new CendiaAegisService();