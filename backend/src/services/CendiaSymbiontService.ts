// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaSymbiont™ - Partnership & Ecosystem Engine
 * 
 * "The ecosystem strategist."
 * 
 * Capabilities:
 * - Ecosystem Scanning: Markets, partners, vendors, competitors
 * - Opportunity Detection: Symbiotic relationship identification
 * - Alliance Simulation: Model joint ventures and partnerships
 * - Integration Planning: Technical and business alignment
 * - Relationship Management: Ongoing partnership health
 * 
 * Integrations: Council, Frontier services (Alliance, MarketSovereign)
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { EnhancedLLMService } from './EnhancedLLMService.js';

// =============================================================================
// TYPES
// =============================================================================

export type EntityType = 'PARTNER' | 'VENDOR' | 'COMPETITOR' | 'CUSTOMER' | 'INVESTOR' | 'REGULATOR' | 'INDUSTRY_BODY' | 'RESEARCH_INSTITUTION' | 'STARTUP';
export type OpportunityType = 'STRATEGIC_PARTNERSHIP' | 'JOINT_VENTURE' | 'ACQUISITION' | 'MERGER' | 'LICENSING' | 'DISTRIBUTION' | 'CO_DEVELOPMENT' | 'INVESTMENT' | 'DIVESTITURE';
export type OpportunityStatus = 'IDENTIFIED' | 'ANALYZING' | 'QUALIFIED' | 'PURSUING' | 'NEGOTIATING' | 'CLOSED_WON' | 'CLOSED_LOST' | 'ON_HOLD';
export type RelationshipType = 'PARTNERSHIP' | 'VENDOR' | 'CUSTOMER' | 'COMPETITOR' | 'INVESTOR' | 'SUBSIDIARY' | 'AFFILIATE';
export type Sentiment = 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';

export interface EcosystemEntity {
  id: string;
  entityType: EntityType;
  name: string;
  description?: string;
  domain?: string;
  website?: string;
  location?: string;
  sizeCategory?: string;
  financialHealth?: number;
  reputationScore?: number;
  tags: string[];
}

export interface Opportunity {
  id: string;
  entityId?: string;
  opportunityType: OpportunityType;
  title: string;
  description: string;
  strategicFit: number;
  financialPotential?: number;
  riskScore: number;
  synergyAreas: string[];
  status: OpportunityStatus;
}

export interface Relationship {
  id: string;
  entityId: string;
  relatedEntityId: string;
  relationshipType: RelationshipType;
  strength: number;
  sentiment: Sentiment;
  healthScore: number;
}

export interface AllianceSimulation {
  id: string;
  simulationType: string;
  scenarioName: string;
  projectedOutcomes: any;
  financialModel?: any;
  riskAnalysis?: any;
  successProbability: number;
  recommendation?: string;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class CendiaSymbiontService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  // ===========================================================================
  // ECOSYSTEM SCANNING
  // ===========================================================================

  /**
   * Add entity to ecosystem map
   */
  async addEntity(
    organizationId: string,
    entityData: {
      entityType: EntityType;
      name: string;
      description?: string;
      domain?: string;
      website?: string;
      location?: string;
      sizeCategory?: string;
      tags?: string[];
    }
  ): Promise<EcosystemEntity> {
    // Analyze entity using LLM
    const analysis = await this.analyzeEntity(entityData);

    const entity = await prisma.symbiont_entities.create({
      data: {
        organization_id: organizationId,
        entity_type: entityData.entityType,
        name: entityData.name,
        description: entityData.description || null,
        domain: entityData.domain || null,
        website: entityData.website || null,
        location: entityData.location || null,
        size_category: (entityData.sizeCategory as any) || null,
        financial_health: analysis.financialHealth,
        reputation_score: analysis.reputationScore,
        data_sources: [],
        tags: entityData.tags || [],
        last_analyzed_at: new Date(),
      },
    });

    logger.info(`Added ecosystem entity: ${entity.name} (${entity.entity_type})`);

    return this.mapEntity(entity);
  }

  /**
   * Analyze entity using LLM
   */
  private async analyzeEntity(entityData: any): Promise<{
    financialHealth: number;
    reputationScore: number;
    strengths: string[];
    weaknesses: string[];
  }> {
    const prompt = `Analyze this organization for ecosystem mapping:

Name: ${entityData.name}
Type: ${entityData.entityType}
Domain: ${entityData.domain || 'Unknown'}
Description: ${entityData.description || 'Not provided'}

Provide analysis as JSON:
{
  "financialHealth": 0-100,
  "reputationScore": 0-100,
  "strengths": ["key strengths"],
  "weaknesses": ["potential weaknesses"]
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a business analyst assessing ecosystem partners.',
        temperature: 0.3,
        maxTokens: 250,
        format: 'json',
      });

      return JSON.parse(response);
    } catch {
      return {
        financialHealth: 50,
        reputationScore: 50,
        strengths: [],
        weaknesses: [],
      };
    }
  }

  /**
   * Get ecosystem entities
   */
  async getEntities(
    organizationId: string,
    filters?: {
      entityType?: EntityType;
      domain?: string;
      minHealth?: number;
    }
  ): Promise<EcosystemEntity[]> {
    const entities = await prisma.symbiont_entities.findMany({
      where: {
        organization_id: organizationId,
        ...(filters?.entityType && { entity_type: filters.entityType }),
        ...(filters?.domain && { domain: { contains: filters.domain, mode: 'insensitive' } }),
        ...(filters?.minHealth && { financial_health: { gte: filters.minHealth } }),
      },
      orderBy: { reputation_score: 'desc' },
    });

    return entities.map(e => this.mapEntity(e));
  }

  /**
   * Map entity to API type
   */
  private mapEntity(entity: any): EcosystemEntity {
    return {
      id: entity.id,
      entityType: entity.entity_type,
      name: entity.name,
      description: entity.description,
      domain: entity.domain,
      website: entity.website,
      location: entity.location,
      sizeCategory: entity.size_category,
      financialHealth: entity.financial_health,
      reputationScore: entity.reputation_score,
      tags: entity.tags as string[],
    };
  }

  // ===========================================================================
  // OPPORTUNITY DETECTION
  // ===========================================================================

  /**
   * Detect opportunities for an entity
   */
  async detectOpportunities(
    organizationId: string,
    entityId: string
  ): Promise<Opportunity[]> {
    const entity = await prisma.symbiont_entities.findUnique({
      where: { id: entityId },
    });

    if (!entity) {
      throw new Error('Entity not found');
    }

    const prompt = `Identify partnership opportunities with this organization:

Entity: ${entity.name}
Type: ${entity.entity_type}
Domain: ${entity.domain || 'General'}
Reputation: ${entity.reputation_score}/100
Financial Health: ${entity.financial_health}/100

Generate 3 strategic opportunities as JSON array:
[{
  "opportunityType": "STRATEGIC_PARTNERSHIP|JOINT_VENTURE|LICENSING|CO_DEVELOPMENT|DISTRIBUTION",
  "title": "Opportunity title",
  "description": "What this opportunity involves",
  "strategicFit": 0-100,
  "financialPotential": estimated_value,
  "riskScore": 0-100,
  "synergyAreas": ["areas of synergy"],
  "requiredResources": ["what's needed"],
  "timelineMonths": estimated_months
}]`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a strategic partnerships advisor identifying business opportunities.',
        temperature: 0.5,
        maxTokens: 800,
        format: 'json',
      });

      const opportunities = JSON.parse(response);
      const saved: Opportunity[] = [];

      for (const opp of opportunities) {
        const opportunity = await prisma.symbiont_opportunities.create({
          data: {
            organization_id: organizationId,
            entity_id: entityId,
            opportunity_type: opp.opportunityType || 'STRATEGIC_PARTNERSHIP',
            title: opp.title,
            description: opp.description,
            strategic_fit: opp.strategicFit || 50,
            financial_potential: opp.financialPotential || null,
            risk_score: opp.riskScore || 50,
            synergy_areas: opp.synergyAreas || [],
            required_resources: opp.requiredResources || [],
            timeline_months: opp.timelineMonths || null,
            status: 'IDENTIFIED',
            ai_analysis: opp,
          },
        });

        saved.push(this.mapOpportunity(opportunity));
      }

      return saved;
    } catch (error) {
      logger.error('Opportunity detection failed:', error);
      return [];
    }
  }

  /**
   * Get opportunities
   */
  async getOpportunities(
    organizationId: string,
    status?: OpportunityStatus
  ): Promise<Opportunity[]> {
    const opportunities = await prisma.symbiont_opportunities.findMany({
      where: {
        organization_id: organizationId,
        ...(status && { status }),
      },
      include: { entity: true },
      orderBy: [{ strategic_fit: 'desc' }, { created_at: 'desc' }],
    });

    return opportunities.map(o => this.mapOpportunity(o));
  }

  /**
   * Update opportunity status
   */
  async updateOpportunityStatus(
    opportunityId: string,
    status: OpportunityStatus
  ): Promise<Opportunity> {
    const opportunity = await prisma.symbiont_opportunities.update({
      where: { id: opportunityId },
      data: { status },
    });

    return this.mapOpportunity(opportunity);
  }

  /**
   * Map opportunity to API type
   */
  private mapOpportunity(opp: any): Opportunity {
    return {
      id: opp.id,
      entityId: opp.entity_id,
      opportunityType: opp.opportunity_type,
      title: opp.title,
      description: opp.description,
      strategicFit: opp.strategic_fit,
      financialPotential: opp.financial_potential,
      riskScore: opp.risk_score,
      synergyAreas: opp.synergy_areas as string[],
      status: opp.status,
    };
  }

  // ===========================================================================
  // ALLIANCE SIMULATION
  // ===========================================================================

  /**
   * Simulate alliance outcomes
   */
  async simulateAlliance(
    opportunityId: string,
    simulationType: 'PARTNERSHIP_MODEL' | 'JV_STRUCTURE' | 'ACQUISITION_INTEGRATION' | 'MARKET_ENTRY' | 'TECHNOLOGY_TRANSFER'
  ): Promise<AllianceSimulation> {
    const opportunity = await prisma.symbiont_opportunities.findUnique({
      where: { id: opportunityId },
      include: { entity: true },
    });

    if (!opportunity) {
      throw new Error('Opportunity not found');
    }

    const prompt = `Simulate ${simulationType} for this opportunity:

Opportunity: ${opportunity.title}
Type: ${opportunity.opportunity_type}
Partner: ${opportunity.entity?.name || 'Unknown'}
Strategic Fit: ${opportunity.strategic_fit}%
Risk Score: ${opportunity.risk_score}%

Provide simulation results as JSON:
{
  "scenarioName": "Scenario name",
  "projectedOutcomes": {
    "year1": {"revenue": num, "costs": num, "synergies": num},
    "year3": {"revenue": num, "costs": num, "synergies": num},
    "year5": {"revenue": num, "costs": num, "synergies": num}
  },
  "financialModel": {
    "investmentRequired": num,
    "expectedROI": percent,
    "breakEvenMonths": num,
    "npv": num
  },
  "riskAnalysis": {
    "integrationRisk": "HIGH|MEDIUM|LOW",
    "marketRisk": "HIGH|MEDIUM|LOW",
    "culturalRisk": "HIGH|MEDIUM|LOW",
    "mitigationStrategies": ["strategies"]
  },
  "integrationPlan": {
    "phases": ["phase descriptions"],
    "keyMilestones": ["milestones"],
    "criticalDependencies": ["dependencies"]
  },
  "successProbability": 0.0-1.0,
  "recommendation": "Strategic recommendation"
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a strategic analyst simulating partnership outcomes.',
        temperature: 0.4,
        maxTokens: 800,
        format: 'json',
      });

      const result = JSON.parse(response);

      const simulation = await prisma.symbiont_simulations.create({
        data: {
          opportunity_id: opportunityId,
          simulation_type: simulationType,
          scenario_name: result.scenarioName || `${simulationType} Simulation`,
          parameters: { opportunityId, simulationType },
          projected_outcomes: result.projectedOutcomes || {},
          financial_model: result.financialModel || null,
          risk_analysis: result.riskAnalysis || null,
          integration_plan: result.integrationPlan || null,
          success_probability: result.successProbability || 0.5,
          recommendation: result.recommendation || null,
        },
      });

      return {
        id: simulation.id,
        simulationType: simulation.simulation_type,
        scenarioName: simulation.scenario_name,
        projectedOutcomes: simulation.projected_outcomes,
        financialModel: simulation.financial_model,
        riskAnalysis: simulation.risk_analysis,
        successProbability: simulation.success_probability,
        recommendation: simulation.recommendation || undefined,
      };
    } catch (error) {
      logger.error('Alliance simulation failed:', error);
      throw error;
    }
  }

  /**
   * Get simulations for opportunity
   */
  async getSimulations(opportunityId: string): Promise<AllianceSimulation[]> {
    const simulations = await prisma.symbiont_simulations.findMany({
      where: { opportunity_id: opportunityId },
      orderBy: { created_at: 'desc' },
    });

    return simulations.map(s => ({
      id: s.id,
      simulationType: s.simulation_type,
      scenarioName: s.scenario_name,
      projectedOutcomes: s.projected_outcomes,
      financialModel: s.financial_model,
      riskAnalysis: s.risk_analysis,
      successProbability: s.success_probability,
      recommendation: s.recommendation || undefined,
    }));
  }

  // ===========================================================================
  // RELATIONSHIP MANAGEMENT
  // ===========================================================================

  /**
   * Create relationship between entities
   */
  async createRelationship(
    organizationId: string,
    entityId: string,
    relatedEntityId: string,
    relationshipType: RelationshipType
  ): Promise<Relationship> {
    const relationship = await prisma.symbiont_relationships.create({
      data: {
        organization_id: organizationId,
        entity_id: entityId,
        related_entity_id: relatedEntityId,
        relationship_type: relationshipType,
        strength: 50,
        sentiment: 'NEUTRAL',
        interaction_history: [],
        health_score: 50,
      },
    });

    return {
      id: relationship.id,
      entityId: relationship.entity_id,
      relatedEntityId: relationship.related_entity_id,
      relationshipType: relationship.relationship_type as RelationshipType,
      strength: relationship.strength,
      sentiment: relationship.sentiment as Sentiment,
      healthScore: relationship.health_score,
    };
  }

  /**
   * Update relationship health
   */
  async updateRelationshipHealth(
    relationshipId: string,
    interaction: {
      type: string;
      outcome: 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE';
      notes?: string;
    }
  ): Promise<Relationship> {
    const existing = await prisma.symbiont_relationships.findUnique({
      where: { id: relationshipId },
    });

    if (!existing) {
      throw new Error('Relationship not found');
    }

    const history = existing.interaction_history as any[] || [];
    history.push({
      ...interaction,
      timestamp: new Date().toISOString(),
    });

    // Calculate new health score based on recent interactions
    const recentInteractions = history.slice(-10);
    const positiveCount = recentInteractions.filter(i => i.outcome === 'POSITIVE').length;
    const negativeCount = recentInteractions.filter(i => i.outcome === 'NEGATIVE').length;
    const healthDelta = (positiveCount - negativeCount) * 5;
    const newHealth = Math.min(100, Math.max(0, existing.health_score + healthDelta));

    // Update sentiment
    let sentiment: Sentiment = 'NEUTRAL';
    if (newHealth >= 80) sentiment = 'VERY_POSITIVE';
    else if (newHealth >= 60) sentiment = 'POSITIVE';
    else if (newHealth <= 20) sentiment = 'VERY_NEGATIVE';
    else if (newHealth <= 40) sentiment = 'NEGATIVE';

    const relationship = await prisma.symbiont_relationships.update({
      where: { id: relationshipId },
      data: {
        interaction_history: history,
        health_score: newHealth,
        sentiment,
        last_interaction: new Date(),
      },
    });

    return {
      id: relationship.id,
      entityId: relationship.entity_id,
      relatedEntityId: relationship.related_entity_id,
      relationshipType: relationship.relationship_type as RelationshipType,
      strength: relationship.strength,
      sentiment: relationship.sentiment as Sentiment,
      healthScore: relationship.health_score,
    };
  }

  /**
   * Get relationships
   */
  async getRelationships(organizationId: string): Promise<Relationship[]> {
    const relationships = await prisma.symbiont_relationships.findMany({
      where: { organization_id: organizationId },
      include: { entity: true, related_entity: true },
      orderBy: { health_score: 'desc' },
    });

    return relationships.map(r => ({
      id: r.id,
      entityId: r.entity_id,
      relatedEntityId: r.related_entity_id,
      relationshipType: r.relationship_type as RelationshipType,
      strength: r.strength,
      sentiment: r.sentiment as Sentiment,
      healthScore: r.health_score,
    }));
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  /**
   * Get ecosystem dashboard
   */
  async getDashboard(organizationId: string): Promise<any> {
    const [
      totalEntities,
      entitiesByType,
      activeOpportunities,
      healthyRelationships,
      avgHealth,
    ] = await Promise.all([
      prisma.symbiont_entities.count({
        where: { organization_id: organizationId },
      }),
      prisma.symbiont_entities.groupBy({
        by: ['entity_type'],
        where: { organization_id: organizationId },
        _count: true,
      }),
      prisma.symbiont_opportunities.count({
        where: {
          organization_id: organizationId,
          status: { in: ['IDENTIFIED', 'ANALYZING', 'QUALIFIED', 'PURSUING', 'NEGOTIATING'] },
        },
      }),
      prisma.symbiont_relationships.count({
        where: {
          organization_id: organizationId,
          health_score: { gte: 60 },
        },
      }),
      prisma.symbiont_relationships.aggregate({
        where: { organization_id: organizationId },
        _avg: { health_score: true },
      }),
    ]);

    return {
      totalEntities,
      entitiesByType: entitiesByType.reduce((acc, e) => {
        acc[e.entity_type] = e._count;
        return acc;
      }, {} as Record<string, number>),
      activeOpportunities,
      healthyRelationships,
      avgRelationshipHealth: Math.round(avgHealth._avg.health_score || 50),
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Alliance Risk Prediction
   * Predicts which partnerships are at risk of deterioration based on interaction patterns.
   */
  async predictAllianceRisks(organizationId: string): Promise<{
    atRiskAlliances: Array<{
      relationshipId: string;
      entityName: string;
      relatedEntityName: string;
      riskScore: number;
      riskFactors: string[];
      recommendedActions: string[];
      predictedOutcome: string;
    }>;
    overallEcosystemRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    summary: string;
  }> {
    const relationships = await prisma.symbiont_relationships.findMany({
      where: { organization_id: organizationId },
      include: { entity: true, related_entity: true },
      orderBy: { health_score: 'asc' },
    });

    const atRiskAlliances = relationships
      .filter(r => r.health_score < 60)
      .map(r => {
        const history = (r.interaction_history as Array<{ outcome: string; date: string }>) || [];
        const recentNegative = history.slice(-10).filter(i => i.outcome === 'NEGATIVE').length;
        const riskScore = Math.min(100, Math.max(0, 100 - r.health_score + recentNegative * 10));

        const riskFactors: string[] = [];
        if (r.health_score < 30) riskFactors.push('Critically low health score');
        if (r.health_score < 50) riskFactors.push('Below-average relationship health');
        if (recentNegative >= 3) riskFactors.push(`${recentNegative} negative interactions in last 10`);
        if (r.sentiment === 'VERY_NEGATIVE') riskFactors.push('Very negative sentiment');
        if (r.sentiment === 'NEGATIVE') riskFactors.push('Negative sentiment');
        if (history.length === 0) riskFactors.push('No interaction history — relationship may be dormant');

        const recommendedActions: string[] = [];
        if (riskScore > 70) recommendedActions.push('Schedule urgent relationship review meeting');
        if (recentNegative >= 3) recommendedActions.push('Conduct root cause analysis on negative interactions');
        if (r.health_score < 30) recommendedActions.push('Evaluate whether to terminate or restructure partnership');
        recommendedActions.push('Increase engagement frequency and transparency');

        return {
          relationshipId: r.id,
          entityName: r.entity?.name || 'Unknown',
          relatedEntityName: r.related_entity?.name || 'Unknown',
          riskScore,
          riskFactors,
          recommendedActions,
          predictedOutcome: riskScore > 70 ? 'Partnership likely to fail within 90 days without intervention'
            : riskScore > 40 ? 'Partnership deteriorating — intervention recommended'
            : 'Minor risk — monitor and maintain engagement',
        };
      });

    const criticalCount = atRiskAlliances.filter(a => a.riskScore > 70).length;
    const overallEcosystemRisk = criticalCount >= 3 ? 'CRITICAL' as const
      : criticalCount >= 1 ? 'HIGH' as const
      : atRiskAlliances.length > 0 ? 'MEDIUM' as const
      : 'LOW' as const;

    return {
      atRiskAlliances,
      overallEcosystemRisk,
      summary: `${atRiskAlliances.length} of ${relationships.length} partnerships at risk (${criticalCount} critical)`,
    };
  }

  /**
   * 10/10: Ecosystem Health Analysis
   * Comprehensive health analysis across all ecosystem relationships.
   */
  async analyzeEcosystemHealth(organizationId: string): Promise<{
    healthScore: number;
    diversityIndex: number;
    concentrationRisk: string[];
    healthByType: Record<string, { count: number; avgHealth: number; trend: string }>;
    recommendations: string[];
  }> {
    const [entities, relationships, opportunities] = await Promise.all([
      prisma.symbiont_entities.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.symbiont_relationships.findMany({
        where: { organization_id: organizationId },
        include: { entity: true },
      }),
      prisma.symbiont_opportunities.findMany({
        where: { organization_id: organizationId },
      }),
    ]);

    // Diversity index: how evenly distributed are entity types
    const typeCounts: Record<string, number> = {};
    for (const e of entities) {
      typeCounts[e.entity_type] = (typeCounts[e.entity_type] || 0) + 1;
    }
    const totalEntities = entities.length || 1;
    const proportions = Object.values(typeCounts).map(c => c / totalEntities);
    const shannonDiversity = -proportions.reduce((sum, p) => sum + (p > 0 ? p * Math.log(p) : 0), 0);
    const maxDiversity = Math.log(Object.keys(typeCounts).length || 1);
    const diversityIndex = maxDiversity > 0 ? Math.round((shannonDiversity / maxDiversity) * 100) : 0;

    // Concentration risk: any type > 50% of relationships
    const concentrationRisk: string[] = [];
    for (const [type, count] of Object.entries(typeCounts)) {
      if (count / totalEntities > 0.5) {
        concentrationRisk.push(`${type} represents ${Math.round(count / totalEntities * 100)}% of ecosystem — high concentration risk`);
      }
    }

    // Health by type
    const healthByType: Record<string, { count: number; avgHealth: number; trend: string }> = {};
    for (const r of relationships) {
      const type = r.entity?.entity_type || 'UNKNOWN';
      if (!healthByType[type]) healthByType[type] = { count: 0, avgHealth: 0, trend: 'STABLE' };
      healthByType[type].count++;
      healthByType[type].avgHealth += r.health_score;
    }
    for (const type of Object.keys(healthByType)) {
      healthByType[type].avgHealth = Math.round(healthByType[type].avgHealth / healthByType[type].count);
      healthByType[type].trend = healthByType[type].avgHealth >= 70 ? 'HEALTHY' : healthByType[type].avgHealth >= 40 ? 'STABLE' : 'DECLINING';
    }

    const avgHealth = relationships.length > 0
      ? Math.round(relationships.reduce((sum, r) => sum + r.health_score, 0) / relationships.length)
      : 50;

    const recommendations: string[] = [];
    if (diversityIndex < 50) recommendations.push('Diversify ecosystem partnerships — current mix is too concentrated');
    if (avgHealth < 60) recommendations.push('Invest in relationship health — average score is below threshold');
    if (concentrationRisk.length > 0) recommendations.push('Reduce dependency on dominant entity types');
    const wonCount = opportunities.filter(o => o.status === 'CLOSED_WON').length;
    const lostCount = opportunities.filter(o => o.status === 'CLOSED_LOST').length;
    if (lostCount > wonCount) recommendations.push('Review opportunity qualification process — loss rate exceeds win rate');

    return {
      healthScore: avgHealth,
      diversityIndex,
      concentrationRisk,
      healthByType,
      recommendations,
    };
  }

  /**
   * 10/10: Synergy Optimization
   * Uses LLM to identify untapped synergies between existing ecosystem partners.
   */
  async identifySynergies(organizationId: string): Promise<{
    synergies: Array<{
      entities: string[];
      synergyType: string;
      description: string;
      potentialValue: 'LOW' | 'MEDIUM' | 'HIGH';
      actionRequired: string;
    }>;
    totalPotentialValue: string;
  }> {
    const entities = await prisma.symbiont_entities.findMany({
      where: { organization_id: organizationId },
      take: 30,
    });

    const relationships = await prisma.symbiont_relationships.findMany({
      where: { organization_id: organizationId },
      include: { entity: true, related_entity: true },
      take: 50,
    });

    try {
      const raw = await this.llmService.generate(
        `Analyze this business ecosystem and identify untapped synergies.

ENTITIES:
${entities.map(e => `- ${e.name} (${e.entity_type}): ${e.description || 'No description'}`).join('\n')}

EXISTING RELATIONSHIPS:
${relationships.map(r => `- ${r.entity?.name} <-> ${r.related_entity?.name} (${r.relationship_type}, health: ${r.health_score})`).join('\n')}

Identify 3-5 untapped synergies between entities that could create value.
Return JSON ONLY:
{
  "synergies": [
    {
      "entities": ["Entity A", "Entity B"],
      "synergyType": "CO_DEVELOPMENT",
      "description": "description of the synergy",
      "potentialValue": "HIGH",
      "actionRequired": "specific next step"
    }
  ],
  "totalPotentialValue": "summary of combined value"
}`,
        {
          model: 'qwq:32b',
          systemPrompt: 'You are a partnership strategy analyst. Identify realistic, actionable synergies. Return valid JSON only.',
        }
      );

      return typeof raw === 'string' ? JSON.parse(raw) : raw;
    } catch (error) {
      logger.warn('LLM synergy analysis failed, using heuristic fallback', { error });

      // Simple fallback: find entities with no relationship
      const connectedPairs = new Set(relationships.map(r => `${r.entity_id}-${r.related_entity_id}`));
      const synergies: Array<{ entities: string[]; synergyType: string; description: string; potentialValue: 'LOW' | 'MEDIUM' | 'HIGH'; actionRequired: string }> = [];

      for (let i = 0; i < entities.length && synergies.length < 5; i++) {
        for (let j = i + 1; j < entities.length && synergies.length < 5; j++) {
          const key1 = `${entities[i].id}-${entities[j].id}`;
          const key2 = `${entities[j].id}-${entities[i].id}`;
          if (!connectedPairs.has(key1) && !connectedPairs.has(key2)) {
            synergies.push({
              entities: [entities[i].name, entities[j].name],
              synergyType: 'POTENTIAL_PARTNERSHIP',
              description: `No existing relationship between ${entities[i].name} and ${entities[j].name} — explore potential collaboration`,
              potentialValue: 'MEDIUM',
              actionRequired: 'Schedule introductory meeting to explore alignment',
            });
          }
        }
      }

      return { synergies, totalPotentialValue: `${synergies.length} unexplored partnership opportunities identified` };
    }
  }

  /**
   * 10/10: Partnership Value Scoring
   * Quantifies the strategic value of each partnership to the organization.
   */
  async scorePartnershipValues(organizationId: string): Promise<{
    rankings: Array<{
      entityId: string;
      entityName: string;
      entityType: string;
      valueScore: number;
      healthScore: number;
      opportunityCount: number;
      interactionFrequency: number;
      strategicAlignment: 'HIGH' | 'MEDIUM' | 'LOW';
    }>;
    topPartner: string;
    underperformers: string[];
  }> {
    const [entities, relationships, opportunities] = await Promise.all([
      prisma.symbiont_entities.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.symbiont_relationships.findMany({
        where: { organization_id: organizationId },
      }),
      prisma.symbiont_opportunities.findMany({
        where: { organization_id: organizationId },
      }),
    ]);

    const rankings = entities.map(entity => {
      const rels = relationships.filter(r => r.entity_id === entity.id || r.related_entity_id === entity.id);
      const avgHealth = rels.length > 0
        ? Math.round(rels.reduce((sum, r) => sum + r.health_score, 0) / rels.length)
        : 0;
      const opps = opportunities.filter(o => (o as any).entity_id === entity.id);
      const totalInteractions = rels.reduce((sum, r) => {
        const history = (r.interaction_history as any[]) || [];
        return sum + history.length;
      }, 0);

      const valueScore = Math.min(100, Math.round(
        avgHealth * 0.4 +
        Math.min(100, opps.length * 20) * 0.3 +
        Math.min(100, totalInteractions * 5) * 0.3
      ));

      return {
        entityId: entity.id,
        entityName: entity.name,
        entityType: entity.entity_type,
        valueScore,
        healthScore: avgHealth,
        opportunityCount: opps.length,
        interactionFrequency: totalInteractions,
        strategicAlignment: valueScore >= 70 ? 'HIGH' as const
          : valueScore >= 40 ? 'MEDIUM' as const
          : 'LOW' as const,
      };
    }).sort((a, b) => b.valueScore - a.valueScore);

    return {
      rankings,
      topPartner: rankings[0]?.entityName || 'None',
      underperformers: rankings.filter(r => r.valueScore < 30).map(r => r.entityName),
    };
  }
  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaSymbiont',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaSymbiontService = new CendiaSymbiontService();
