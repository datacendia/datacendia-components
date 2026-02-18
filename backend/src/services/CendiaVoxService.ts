// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaVox™ - Stakeholder Voice Assembly
 * 
 * "Who speaks for those not in the room?"
 * 
 * Capabilities:
 * - Stakeholder Representation: Employees, customers, communities, environment, future generations
 * - Signal Integration: Sentiment, ESG data, surveys, external feeds
 * - Veto Rights: Defined objection powers for harmful externalities
 * - Impact Assessment: Multi-stakeholder consequence analysis
 * - Value Enforcement: "We do not optimize for profit alone"
 * 
 * Philosophy: Enforces stakeholder capitalism in decision-making
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { EnhancedLLMService } from './EnhancedLLMService.js';

// =============================================================================
// TYPES
// =============================================================================

export type StakeholderType = 'EMPLOYEES' | 'CUSTOMERS' | 'SHAREHOLDERS' | 'COMMUNITY' | 'ENVIRONMENT' | 'FUTURE_GENERATIONS' | 'SUPPLIERS' | 'REGULATORS' | 'CIVIL_SOCIETY';
export type SignalType = 'SURVEY' | 'SOCIAL_MEDIA' | 'ESG_FEED' | 'COMPLAINT' | 'FEEDBACK' | 'NEWS' | 'REGULATORY' | 'INTERNAL';
export type VoxSentiment = 'VERY_POSITIVE' | 'POSITIVE' | 'NEUTRAL' | 'NEGATIVE' | 'VERY_NEGATIVE';
export type VoteValue = 'APPROVE' | 'APPROVE_WITH_CONDITIONS' | 'OPPOSE' | 'ABSTAIN' | 'VETO';
export type ImpactType = 'FINANCIAL' | 'HEALTH_SAFETY' | 'ENVIRONMENTAL' | 'SOCIAL' | 'PSYCHOLOGICAL' | 'EMPLOYMENT' | 'RIGHTS' | 'OPPORTUNITY';

export interface Stakeholder {
  id: string;
  stakeholderType: StakeholderType;
  name: string;
  description: string;
  populationSize?: number;
  representationMethod: string;
  voiceWeight: number;
  vetoRights: string[];
  isActive: boolean;
}

export interface StakeholderSignal {
  id: string;
  stakeholderId: string;
  signalType: SignalType;
  source: string;
  content: string;
  sentiment: VoxSentiment;
  sentimentScore: number;
  urgency: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
  topics: string[];
}

export interface StakeholderImpact {
  id: string;
  stakeholderId: string;
  decisionId?: string;
  impactType: ImpactType;
  title: string;
  description: string;
  severity: 'CATASTROPHIC' | 'SEVERE' | 'MODERATE' | 'MINOR' | 'NEGLIGIBLE';
  affectedCount?: number;
  financialImpact?: number;
  mitigationOptions: string[];
}

export interface StakeholderVote {
  id: string;
  stakeholderId: string;
  decisionId: string;
  voteValue: VoteValue;
  reasoning?: string;
  aiGenerated: boolean;
  vetoExercised: boolean;
  vetoReason?: string;
}

export interface Assembly {
  id: string;
  decisionId: string;
  title: string;
  assemblyType: 'EMERGENCY' | 'SCHEDULED' | 'AD_HOC' | 'ANNUAL';
  participants: string[];
  consensusReached: boolean;
  finalVerdict?: VoteValue;
  dissentingVoices: string[];
  conditions: string[];
}

// =============================================================================
// DEFAULT STAKEHOLDER CONFIGURATIONS
// =============================================================================

const DEFAULT_STAKEHOLDERS: Array<{
  type: StakeholderType;
  name: string;
  description: string;
  vetoRights: string[];
  voiceWeight: number;
}> = [
  {
    type: 'EMPLOYEES',
    name: 'Employee Voice',
    description: 'Represents the interests of all employees including health, safety, fair compensation, and work-life balance',
    vetoRights: ['MASS_LAYOFFS', 'UNSAFE_CONDITIONS', 'WAGE_REDUCTION'],
    voiceWeight: 1.0,
  },
  {
    type: 'CUSTOMERS',
    name: 'Customer Voice',
    description: 'Represents customer interests including product quality, data privacy, and fair pricing',
    vetoRights: ['DATA_MISUSE', 'DECEPTIVE_PRACTICES', 'QUALITY_DEGRADATION'],
    voiceWeight: 1.0,
  },
  {
    type: 'COMMUNITY',
    name: 'Community Voice',
    description: 'Represents local communities affected by operations including environmental and social impact',
    vetoRights: ['ENVIRONMENTAL_HARM', 'COMMUNITY_DISPLACEMENT'],
    voiceWeight: 0.8,
  },
  {
    type: 'ENVIRONMENT',
    name: 'Environmental Voice',
    description: 'Represents ecological systems and environmental sustainability (AI proxy)',
    vetoRights: ['IRREVERSIBLE_ENVIRONMENTAL_DAMAGE', 'CLIMATE_HARM'],
    voiceWeight: 0.9,
  },
  {
    type: 'FUTURE_GENERATIONS',
    name: 'Future Generations Voice',
    description: 'Represents the interests of those not yet born who will inherit consequences (AI proxy)',
    vetoRights: ['GENERATIONAL_DEBT', 'RESOURCE_DEPLETION', 'LONG_TERM_HARM'],
    voiceWeight: 0.7,
  },
  {
    type: 'SHAREHOLDERS',
    name: 'Shareholder Voice',
    description: 'Represents investor interests including returns, governance, and long-term value',
    vetoRights: ['FIDUCIARY_BREACH', 'EXCESSIVE_RISK'],
    voiceWeight: 1.0,
  },
];

// =============================================================================
// SERVICE CLASS
// =============================================================================

export class CendiaVoxService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  // ===========================================================================
  // STAKEHOLDER MANAGEMENT
  // ===========================================================================

  /**
   * Initialize default stakeholders for organization
   */
  async initializeStakeholders(organizationId: string): Promise<Stakeholder[]> {
    const stakeholders: Stakeholder[] = [];

    for (const config of DEFAULT_STAKEHOLDERS) {
      // Check if already exists
      const existing = await prisma.vox_stakeholders.findFirst({
        where: {
          organization_id: organizationId,
          stakeholder_type: config.type,
        },
      });

      if (!existing) {
        const stakeholder = await prisma.vox_stakeholders.create({
          data: {
            organization_id: organizationId,
            stakeholder_type: config.type,
            name: config.name,
            description: config.description,
            representation_method: config.type === 'ENVIRONMENT' || config.type === 'FUTURE_GENERATIONS' 
              ? 'AI Proxy' 
              : 'Mixed (Survey + AI)',
            voice_weight: config.voiceWeight,
            veto_rights: config.vetoRights,
            data_sources: [],
            is_active: true,
          },
        });

        stakeholders.push(this.mapStakeholder(stakeholder));
      }
    }

    logger.info(`Initialized ${stakeholders.length} stakeholders for org ${organizationId}`);
    return stakeholders;
  }

  /**
   * Get stakeholders
   */
  async getStakeholders(organizationId: string): Promise<Stakeholder[]> {
    const stakeholders = await prisma.vox_stakeholders.findMany({
      where: { organization_id: organizationId, is_active: true },
      orderBy: { voice_weight: 'desc' },
    });

    return stakeholders.map(s => this.mapStakeholder(s));
  }

  /**
   * Update stakeholder configuration
   */
  async updateStakeholder(
    stakeholderId: string,
    updates: Partial<{
      voiceWeight: number;
      vetoRights: string[];
      isActive: boolean;
    }>
  ): Promise<Stakeholder> {
    const stakeholder = await prisma.vox_stakeholders.update({
      where: { id: stakeholderId },
      data: {
        ...(updates.voiceWeight !== undefined && { voice_weight: updates.voiceWeight }),
        ...(updates.vetoRights && { veto_rights: updates.vetoRights }),
        ...(updates.isActive !== undefined && { is_active: updates.isActive }),
      },
    });

    return this.mapStakeholder(stakeholder);
  }

  /**
   * Map stakeholder to API type
   */
  private mapStakeholder(s: any): Stakeholder {
    return {
      id: s.id,
      stakeholderType: s.stakeholder_type,
      name: s.name,
      description: s.description,
      populationSize: s.population_size,
      representationMethod: s.representation_method,
      voiceWeight: s.voice_weight,
      vetoRights: s.veto_rights as string[],
      isActive: s.is_active,
    };
  }

  // ===========================================================================
  // SIGNAL INTEGRATION
  // ===========================================================================

  /**
   * Ingest stakeholder signal
   */
  async ingestSignal(
    stakeholderId: string,
    signalData: {
      signalType: SignalType;
      source: string;
      content: string;
      rawData?: any;
    }
  ): Promise<StakeholderSignal> {
    // Analyze sentiment using LLM
    const analysis = await this.analyzeSentiment(signalData.content);

    const signal = await prisma.vox_signals.create({
      data: {
        stakeholder_id: stakeholderId,
        signal_type: signalData.signalType,
        source: signalData.source,
        content: signalData.content,
        sentiment: analysis.sentiment,
        sentiment_score: analysis.score,
        urgency: analysis.urgency,
        topics: analysis.topics,
        raw_data: signalData.rawData || null,
      },
    });

    return {
      id: signal.id,
      stakeholderId: signal.stakeholder_id,
      signalType: signal.signal_type as SignalType,
      source: signal.source,
      content: signal.content,
      sentiment: signal.sentiment as VoxSentiment,
      sentimentScore: signal.sentiment_score,
      urgency: signal.urgency as any,
      topics: signal.topics as string[],
    };
  }

  /**
   * Analyze sentiment using LLM
   */
  private async analyzeSentiment(content: string): Promise<{
    sentiment: VoxSentiment;
    score: number;
    urgency: 'CRITICAL' | 'HIGH' | 'NORMAL' | 'LOW';
    topics: string[];
  }> {
    const prompt = `Analyze this stakeholder feedback:

"${content}"

Provide analysis as JSON:
{
  "sentiment": "VERY_POSITIVE|POSITIVE|NEUTRAL|NEGATIVE|VERY_NEGATIVE",
  "score": -1.0 to 1.0,
  "urgency": "CRITICAL|HIGH|NORMAL|LOW",
  "topics": ["key topics mentioned"]
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are analyzing stakeholder sentiment for corporate governance.',
        temperature: 0.2,
        maxTokens: 150,
        format: 'json',
      });

      return JSON.parse(response);
    } catch {
      return {
        sentiment: 'NEUTRAL',
        score: 0,
        urgency: 'NORMAL',
        topics: [],
      };
    }
  }

  /**
   * Get stakeholder signals
   */
  async getSignals(
    stakeholderId: string,
    limit: number = 50
  ): Promise<StakeholderSignal[]> {
    const signals = await prisma.vox_signals.findMany({
      where: { stakeholder_id: stakeholderId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return signals.map(s => ({
      id: s.id,
      stakeholderId: s.stakeholder_id,
      signalType: s.signal_type as SignalType,
      source: s.source,
      content: s.content,
      sentiment: s.sentiment as VoxSentiment,
      sentimentScore: s.sentiment_score,
      urgency: s.urgency as any,
      topics: s.topics as string[],
    }));
  }

  // ===========================================================================
  // IMPACT ASSESSMENT
  // ===========================================================================

  /**
   * Assess impact on stakeholders
   */
  async assessImpact(
    organizationId: string,
    decisionId: string,
    decisionContext: string
  ): Promise<StakeholderImpact[]> {
    const stakeholders = await this.getStakeholders(organizationId);
    const impacts: StakeholderImpact[] = [];

    for (const stakeholder of stakeholders) {
      const impact = await this.assessStakeholderImpact(stakeholder, decisionContext);
      
      if (impact) {
        const saved = await prisma.vox_impacts.create({
          data: {
            organization_id: organizationId,
            decision_id: decisionId,
            stakeholder_id: stakeholder.id,
            impact_type: impact.impactType,
            title: impact.title,
            description: impact.description,
            severity: impact.severity as any,
            affected_count: impact.affectedCount || null,
            financial_impact: impact.financialImpact || null,
            mitigation_options: impact.mitigationOptions,
          },
        });

        impacts.push({
          id: saved.id,
          stakeholderId: saved.stakeholder_id,
          decisionId: saved.decision_id || undefined,
          impactType: saved.impact_type as ImpactType,
          title: saved.title,
          description: saved.description,
          severity: saved.severity as any,
          affectedCount: saved.affected_count || undefined,
          financialImpact: saved.financial_impact || undefined,
          mitigationOptions: saved.mitigation_options as string[],
        });
      }
    }

    return impacts;
  }

  /**
   * Assess impact on single stakeholder
   */
  private async assessStakeholderImpact(
    stakeholder: Stakeholder,
    decisionContext: string
  ): Promise<{
    impactType: ImpactType;
    title: string;
    description: string;
    severity: string;
    affectedCount?: number;
    financialImpact?: number;
    mitigationOptions: string[];
  } | null> {
    const prompt = `Assess how this decision affects ${stakeholder.name}:

Stakeholder: ${stakeholder.name}
Type: ${stakeholder.stakeholderType}
Description: ${stakeholder.description}

Decision:
${decisionContext}

If there's a meaningful impact, provide JSON:
{
  "hasImpact": true,
  "impactType": "(CHOOSE ONE: FINANCIAL, HEALTH_SAFETY, ENVIRONMENTAL, SOCIAL, PSYCHOLOGICAL, EMPLOYMENT, RIGHTS, or OPPORTUNITY)",
  "title": "Brief impact title",
  "description": "Detailed description of impact",
  "severity": "(CHOOSE ONE: CATASTROPHIC, SEVERE, MODERATE, MINOR, or NEGLIGIBLE)",
  "affectedCount": estimated_number_affected,
  "financialImpact": estimated_dollars,
  "mitigationOptions": ["ways to reduce negative impact"]
}

If no meaningful impact: {"hasImpact": false}`;

    const VALID_IMPACT_TYPES = ['FINANCIAL', 'HEALTH_SAFETY', 'ENVIRONMENTAL', 'SOCIAL', 'PSYCHOLOGICAL', 'EMPLOYMENT', 'RIGHTS', 'OPPORTUNITY'];
    const VALID_SEVERITIES = ['CATASTROPHIC', 'SEVERE', 'MODERATE', 'MINOR', 'NEGLIGIBLE'];

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are assessing decision impacts on stakeholders for ethical governance. Return valid JSON only.',
        temperature: 0.3,
        maxTokens: 400,
        format: 'json',
      });

      const result = JSON.parse(response);
      if (!result.hasImpact) return null;
      
      // Validate and fix impactType - take first valid value if multiple provided
      let impactType = String(result.impactType || 'SOCIAL').toUpperCase();
      if (impactType.includes('|')) {
        impactType = impactType.split('|')[0].trim();
      }
      if (!VALID_IMPACT_TYPES.includes(impactType)) {
        impactType = 'SOCIAL'; // Default fallback
      }
      
      // Validate and fix severity
      let severity = String(result.severity || 'MODERATE').toUpperCase();
      if (severity.includes('|')) {
        severity = severity.split('|')[0].trim();
      }
      if (!VALID_SEVERITIES.includes(severity)) {
        severity = 'MODERATE'; // Default fallback
      }
      
      return {
        ...result,
        impactType,
        severity,
      };
    } catch {
      return null;
    }
  }

  /**
   * Get impacts for a decision
   */
  async getDecisionImpacts(decisionId: string): Promise<StakeholderImpact[]> {
    const impacts = await prisma.vox_impacts.findMany({
      where: { decision_id: decisionId },
      include: { stakeholder: true },
      orderBy: { severity: 'asc' },
    });

    return impacts.map(i => ({
      id: i.id,
      stakeholderId: i.stakeholder_id,
      decisionId: i.decision_id || undefined,
      impactType: i.impact_type as ImpactType,
      title: i.title,
      description: i.description,
      severity: i.severity as any,
      affectedCount: i.affected_count || undefined,
      financialImpact: i.financial_impact || undefined,
      mitigationOptions: i.mitigation_options as string[],
    }));
  }

  // ===========================================================================
  // VOTING & VETO
  // ===========================================================================

  /**
   * Conduct stakeholder vote
   */
  async conductVote(
    organizationId: string,
    decisionId: string,
    decisionContext: string
  ): Promise<StakeholderVote[]> {
    const stakeholders = await this.getStakeholders(organizationId);
    const votes: StakeholderVote[] = [];

    for (const stakeholder of stakeholders) {
      const vote = await this.getStakeholderVote(stakeholder, decisionContext);

      const saved = await prisma.vox_votes.create({
        data: {
          organization_id: organizationId,
          decision_id: decisionId,
          stakeholder_id: stakeholder.id,
          vote_type: vote.vetoExercised ? 'VETO' : 'APPROVAL',
          vote_value: vote.voteValue,
          reasoning: vote.reasoning || null,
          ai_generated: true,
          weight_applied: stakeholder.voiceWeight,
          veto_exercised: vote.vetoExercised,
          veto_reason: vote.vetoReason || null,
        },
      });

      votes.push({
        id: saved.id,
        stakeholderId: saved.stakeholder_id,
        decisionId: saved.decision_id,
        voteValue: saved.vote_value as VoteValue,
        reasoning: saved.reasoning || undefined,
        aiGenerated: saved.ai_generated,
        vetoExercised: saved.veto_exercised,
        vetoReason: saved.veto_reason || undefined,
      });
    }

    return votes;
  }

  /**
   * Get stakeholder's vote via AI proxy
   */
  private async getStakeholderVote(
    stakeholder: Stakeholder,
    decisionContext: string
  ): Promise<{
    voteValue: VoteValue;
    reasoning: string;
    vetoExercised: boolean;
    vetoReason?: string;
  }> {
    const prompt = `You are representing ${stakeholder.name} in a governance decision.

Stakeholder: ${stakeholder.name}
Type: ${stakeholder.stakeholderType}
Description: ${stakeholder.description}
Veto Rights: ${stakeholder.vetoRights.join(', ')}

Decision being considered:
${decisionContext}

Based on this stakeholder's interests, how would they vote?

Respond as JSON:
{
  "voteValue": "APPROVE|APPROVE_WITH_CONDITIONS|OPPOSE|ABSTAIN|VETO",
  "reasoning": "Why this stakeholder would vote this way",
  "vetoExercised": true/false,
  "vetoReason": "If vetoing, why this falls within veto rights"
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: `You are an AI proxy representing ${stakeholder.stakeholderType} stakeholders. Vote based on their genuine interests, not corporate interests.`,
        temperature: 0.4,
        maxTokens: 300,
        format: 'json',
      });

      return JSON.parse(response);
    } catch {
      return {
        voteValue: 'ABSTAIN',
        reasoning: 'Unable to assess impact',
        vetoExercised: false,
      };
    }
  }

  /**
   * Get votes for a decision
   */
  async getDecisionVotes(decisionId: string): Promise<StakeholderVote[]> {
    const votes = await prisma.vox_votes.findMany({
      where: { decision_id: decisionId },
      include: { stakeholder: true },
    });

    return votes.map(v => ({
      id: v.id,
      stakeholderId: v.stakeholder_id,
      decisionId: v.decision_id,
      voteValue: v.vote_value as VoteValue,
      reasoning: v.reasoning || undefined,
      aiGenerated: v.ai_generated,
      vetoExercised: v.veto_exercised,
      vetoReason: v.veto_reason || undefined,
    }));
  }

  // ===========================================================================
  // ASSEMBLY
  // ===========================================================================

  /**
   * Conduct stakeholder assembly
   */
  async conductAssembly(
    organizationId: string,
    decisionId: string,
    title: string,
    assemblyType: 'EMERGENCY' | 'SCHEDULED' | 'AD_HOC' | 'ANNUAL' = 'AD_HOC'
  ): Promise<Assembly> {
    // Get stakeholders
    const stakeholders = await this.getStakeholders(organizationId);
    
    // Assess impacts
    const impacts = await prisma.vox_impacts.findMany({
      where: { decision_id: decisionId },
    });

    // Conduct votes
    const votes = await prisma.vox_votes.findMany({
      where: { decision_id: decisionId },
    });

    // Determine consensus
    const approvals = votes.filter(v => v.vote_value === 'APPROVE' || v.vote_value === 'APPROVE_WITH_CONDITIONS');
    const oppositions = votes.filter(v => v.vote_value === 'OPPOSE');
    const vetoes = votes.filter(v => v.veto_exercised);

    const consensusReached = vetoes.length === 0 && approvals.length > oppositions.length;
    
    let finalVerdict: VoteValue = 'ABSTAIN';
    if (vetoes.length > 0) {
      finalVerdict = 'VETO';
    } else if (approvals.length > oppositions.length) {
      finalVerdict = votes.some(v => v.vote_value === 'APPROVE_WITH_CONDITIONS')
        ? 'APPROVE_WITH_CONDITIONS'
        : 'APPROVE';
    } else if (oppositions.length > 0) {
      finalVerdict = 'OPPOSE';
    }

    // Extract conditions
    const conditions = votes
      .filter(v => v.vote_value === 'APPROVE_WITH_CONDITIONS' && v.reasoning)
      .map(v => v.reasoning as string);

    const assembly = await prisma.vox_assemblies.create({
      data: {
        organization_id: organizationId,
        decision_id: decisionId,
        assembly_type: assemblyType,
        title,
        agenda: `Stakeholder assembly for decision: ${decisionId}`,
        participants: stakeholders.map(s => s.id),
        deliberation_log: votes.map(v => ({
          stakeholder: v.stakeholder_id,
          vote: v.vote_value,
          reasoning: v.reasoning,
        })),
        consensus_reached: consensusReached,
        final_verdict: finalVerdict,
        dissenting_voices: oppositions.map(v => v.stakeholder_id),
        conditions,
        completed_at: new Date(),
      },
    });

    return {
      id: assembly.id,
      decisionId: assembly.decision_id,
      title: assembly.title,
      assemblyType: assembly.assembly_type as any,
      participants: assembly.participants as string[],
      consensusReached: assembly.consensus_reached,
      finalVerdict: assembly.final_verdict as VoteValue | undefined,
      dissentingVoices: assembly.dissenting_voices as string[],
      conditions: assembly.conditions as string[],
    };
  }

  /**
   * Get assemblies
   */
  async getAssemblies(
    organizationId: string,
    limit: number = 20
  ): Promise<Assembly[]> {
    const assemblies = await prisma.vox_assemblies.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: limit,
    });

    return assemblies.map(a => ({
      id: a.id,
      decisionId: a.decision_id,
      title: a.title,
      assemblyType: a.assembly_type as any,
      participants: a.participants as string[],
      consensusReached: a.consensus_reached,
      finalVerdict: a.final_verdict as VoteValue | undefined,
      dissentingVoices: a.dissenting_voices as string[],
      conditions: a.conditions as string[],
    }));
  }

  // ===========================================================================
  // ORGANIZATION-WIDE QUERIES
  // ===========================================================================

  /**
   * Get all signals for an organization
   */
  async getAllSignals(organizationId: string, limit: number = 50): Promise<any[]> {
    const signals = await prisma.vox_signals.findMany({
      where: {
        stakeholder: { organization_id: organizationId },
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        stakeholder: {
          select: { stakeholder_type: true, name: true },
        },
      },
    });

    return signals.map(s => ({
      id: s.id,
      timestamp: s.created_at,
      stakeholder: s.stakeholder?.stakeholder_type || 'UNKNOWN',
      stakeholderName: s.stakeholder?.name || 'Unknown',
      signalType: s.signal_type,
      content: s.content,
      sentiment: s.sentiment,
      urgency: s.urgency,
      source: s.source,
    }));
  }

  /**
   * Get all vetoes for an organization
   */
  async getAllVetoes(organizationId: string, limit: number = 50): Promise<any[]> {
    const vetoes = await prisma.vox_votes.findMany({
      where: {
        organization_id: organizationId,
        veto_exercised: true,
      },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        stakeholder: {
          select: { stakeholder_type: true, name: true },
        },
      },
    });

    return vetoes.map(v => ({
      id: v.id,
      timestamp: v.created_at,
      stakeholder: v.stakeholder?.stakeholder_type || 'UNKNOWN',
      stakeholderName: v.stakeholder?.name || 'Unknown',
      decisionId: v.decision_id,
      reason: v.reasoning,
      status: 'ACTIVE',
    }));
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  /**
   * Get stakeholder voice dashboard
   */
  async getDashboard(organizationId: string): Promise<any> {
    const [
      stakeholders,
      recentSignals,
      sentimentBreakdown,
      recentVetoes,
      assemblies,
    ] = await Promise.all([
      prisma.vox_stakeholders.count({
        where: { organization_id: organizationId, is_active: true },
      }),
      prisma.vox_signals.count({
        where: {
          stakeholder: { organization_id: organizationId },
          created_at: { gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.vox_signals.groupBy({
        by: ['sentiment'],
        where: {
          stakeholder: { organization_id: organizationId },
          created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
        _count: true,
      }),
      prisma.vox_votes.count({
        where: {
          organization_id: organizationId,
          veto_exercised: true,
          created_at: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) },
        },
      }),
      prisma.vox_assemblies.count({
        where: { organization_id: organizationId },
      }),
    ]);

    return {
      activeStakeholders: stakeholders,
      signalsLast7Days: recentSignals,
      sentimentBreakdown: sentimentBreakdown.reduce((acc, s) => {
        acc[s.sentiment] = s._count;
        return acc;
      }, {} as Record<string, number>),
      vetoesLast30Days: recentVetoes,
      totalAssemblies: assemblies,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Sentiment Correlation Engine
   * Finds correlations between stakeholder sentiment shifts and business decisions.
   * Answers: "When we make X type of decision, which stakeholders react negatively?"
   */
  async analyzeSentimentCorrelations(organizationId: string): Promise<{
    correlations: Array<{
      stakeholderType: string;
      decisionPattern: string;
      sentimentShift: string;
      strength: number;
      examples: string[];
    }>;
    insights: string[];
    riskAreas: string[];
  }> {
    const [signals, votes, stakeholders] = await Promise.all([
      prisma.vox_signals.findMany({
        where: { stakeholder: { organization_id: organizationId } },
        orderBy: { created_at: 'desc' },
        take: 200,
        include: { stakeholder: { select: { stakeholder_type: true, name: true } } },
      }),
      prisma.vox_votes.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'desc' },
        take: 100,
        include: { stakeholder: { select: { stakeholder_type: true, name: true } } },
      }),
      prisma.vox_stakeholders.findMany({
        where: { organization_id: organizationId, is_active: true },
      }),
    ]);

    const signalSummary = signals.slice(0, 50).map(s => ({
      type: s.stakeholder?.stakeholder_type,
      sentiment: s.sentiment,
      urgency: s.urgency,
      date: s.created_at,
    }));

    const voteSummary = votes.slice(0, 30).map(v => ({
      type: v.stakeholder?.stakeholder_type,
      vote: v.vote_value,
      veto: v.veto_exercised,
      decision: v.decision_id,
    }));

    try {
      const raw = await this.llmService.generate(
        `Analyze stakeholder sentiment correlations for an organization.

STAKEHOLDER TYPES: ${stakeholders.map(s => s.stakeholder_type).join(', ')}

RECENT SIGNALS (${signals.length} total):
${JSON.stringify(signalSummary, null, 2)}

RECENT VOTES (${votes.length} total):
${JSON.stringify(voteSummary, null, 2)}

Find correlations between decision types and stakeholder sentiment shifts.
Return JSON ONLY:
{
  "correlations": [
    {
      "stakeholderType": "EMPLOYEES",
      "decisionPattern": "description of decision pattern",
      "sentimentShift": "NEGATIVE" or "POSITIVE",
      "strength": 0.0-1.0,
      "examples": ["example1", "example2"]
    }
  ],
  "insights": ["insight about patterns"],
  "riskAreas": ["areas where stakeholder backlash is likely"]
}`,
        {
          model: 'qwq:32b',
          systemPrompt: 'You are a stakeholder analytics engine. Analyze sentiment patterns objectively. Return valid JSON only.',
        }
      );
      const result = raw;

      return typeof result === 'string' ? JSON.parse(result) : result;
    } catch (error) {
      logger.warn('LLM sentiment correlation failed, using statistical fallback', { error });

      const sentimentByType: Record<string, { positive: number; negative: number; neutral: number }> = {};
      for (const signal of signals) {
        const type = signal.stakeholder?.stakeholder_type || 'UNKNOWN';
        if (!sentimentByType[type]) sentimentByType[type] = { positive: 0, negative: 0, neutral: 0 };
        if (signal.sentiment === 'POSITIVE' || signal.sentiment === 'VERY_POSITIVE') sentimentByType[type].positive++;
        else if (signal.sentiment === 'NEGATIVE' || signal.sentiment === 'VERY_NEGATIVE') sentimentByType[type].negative++;
        else sentimentByType[type].neutral++;
      }

      const correlations = Object.entries(sentimentByType).map(([type, counts]) => ({
        stakeholderType: type,
        decisionPattern: 'General organizational decisions',
        sentimentShift: counts.negative > counts.positive ? 'NEGATIVE' : 'POSITIVE',
        strength: Math.abs(counts.negative - counts.positive) / Math.max(1, counts.negative + counts.positive + counts.neutral),
        examples: [],
      }));

      return {
        correlations,
        insights: [`Analyzed ${signals.length} signals across ${Object.keys(sentimentByType).length} stakeholder types`],
        riskAreas: correlations.filter(c => c.sentimentShift === 'NEGATIVE' && c.strength > 0.3).map(c => c.stakeholderType),
      };
    }
  }

  /**
   * 10/10: Stakeholder Impact Prediction
   * Predicts how a proposed decision will affect each stakeholder group.
   */
  async predictStakeholderImpact(
    organizationId: string,
    proposedDecision: { title: string; description: string; category?: string }
  ): Promise<{
    predictions: Array<{
      stakeholderType: string;
      predictedSentiment: string;
      impactSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      vetoRisk: boolean;
      reasoning: string;
      mitigations: string[];
    }>;
    overallRisk: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
    recommendedActions: string[];
  }> {
    const stakeholders = await prisma.vox_stakeholders.findMany({
      where: { organization_id: organizationId, is_active: true },
    });

    const recentSignals = await prisma.vox_signals.findMany({
      where: { stakeholder: { organization_id: organizationId } },
      orderBy: { created_at: 'desc' },
      take: 50,
      include: { stakeholder: { select: { stakeholder_type: true } } },
    });

    const currentMood: Record<string, string> = {};
    for (const signal of recentSignals) {
      const type = signal.stakeholder?.stakeholder_type || 'UNKNOWN';
      if (!currentMood[type]) currentMood[type] = signal.sentiment;
    }

    try {
      const raw = await this.llmService.generate(
        `Predict how this proposed decision will affect each stakeholder group.

PROPOSED DECISION:
Title: ${proposedDecision.title}
Description: ${proposedDecision.description}
Category: ${proposedDecision.category || 'General'}

STAKEHOLDER GROUPS:
${stakeholders.map(s => `- ${s.stakeholder_type}: ${s.description} (veto rights: ${(s.veto_rights as string[]).join(', ')})`).join('\n')}

CURRENT STAKEHOLDER MOOD:
${JSON.stringify(currentMood, null, 2)}

Return JSON ONLY:
{
  "predictions": [
    {
      "stakeholderType": "EMPLOYEES",
      "predictedSentiment": "NEGATIVE",
      "impactSeverity": "HIGH",
      "vetoRisk": false,
      "reasoning": "why this group is affected",
      "mitigations": ["action to reduce negative impact"]
    }
  ],
  "overallRisk": "MEDIUM",
  "recommendedActions": ["recommended action before proceeding"]
}`,
        {
          model: 'qwq:32b',
          systemPrompt: 'You are a stakeholder impact prediction engine. Be realistic and conservative in predictions. Return valid JSON only.',
        }
      );
      const result = raw;

      return typeof result === 'string' ? JSON.parse(result) : result;
    } catch (error) {
      logger.warn('LLM impact prediction failed, using heuristic fallback', { error });

      const predictions = stakeholders.map(s => ({
        stakeholderType: s.stakeholder_type,
        predictedSentiment: 'NEUTRAL' as string,
        impactSeverity: 'MEDIUM' as const,
        vetoRisk: false,
        reasoning: 'Unable to predict — insufficient historical data for AI analysis',
        mitigations: ['Consult directly with stakeholder representatives before proceeding'],
      }));

      return {
        predictions,
        overallRisk: 'MEDIUM',
        recommendedActions: ['Conduct stakeholder consultation before finalizing decision'],
      };
    }
  }

  /**
   * 10/10: Voice Amplification Scoring
   * Identifies which stakeholder voices are being under-represented relative to their impact.
   */
  async analyzeVoiceAmplification(organizationId: string): Promise<{
    amplificationScores: Array<{
      stakeholderType: string;
      signalVolume: number;
      impactWeight: number;
      amplificationGap: number;
      underRepresented: boolean;
      recommendation: string;
    }>;
    silentStakeholders: string[];
    overRepresented: string[];
  }> {
    const [stakeholders, signalCounts] = await Promise.all([
      prisma.vox_stakeholders.findMany({
        where: { organization_id: organizationId, is_active: true },
      }),
      prisma.vox_signals.groupBy({
        by: ['stakeholder_id'],
        where: {
          stakeholder: { organization_id: organizationId },
          created_at: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        },
        _count: true,
      }),
    ]);

    const signalMap: Record<string, number> = {};
    for (const sc of signalCounts) {
      signalMap[sc.stakeholder_id] = sc._count;
    }

    const totalSignals = Object.values(signalMap).reduce((sum, c) => sum + c, 0) || 1;
    const amplificationScores = stakeholders.map(s => {
      const volume = signalMap[s.id] || 0;
      const signalShare = volume / totalSignals;
      const expectedShare = s.voice_weight / stakeholders.reduce((sum, st) => sum + st.voice_weight, 0);
      const gap = expectedShare - signalShare;

      return {
        stakeholderType: s.stakeholder_type,
        signalVolume: volume,
        impactWeight: s.voice_weight,
        amplificationGap: Math.round(gap * 100) / 100,
        underRepresented: gap > 0.1,
        recommendation: gap > 0.1
          ? `Increase ${s.stakeholder_type} representation — they account for ${Math.round(signalShare * 100)}% of signals but should be ~${Math.round(expectedShare * 100)}%`
          : gap < -0.1
            ? `${s.stakeholder_type} may be over-represented — consider rebalancing`
            : `${s.stakeholder_type} representation is balanced`,
      };
    });

    return {
      amplificationScores,
      silentStakeholders: amplificationScores.filter(a => a.signalVolume === 0).map(a => a.stakeholderType),
      overRepresented: amplificationScores.filter(a => a.amplificationGap < -0.1).map(a => a.stakeholderType),
    };
  }

  /**
   * 10/10: Stakeholder Health Report
   * Comprehensive health assessment combining sentiment trends, engagement, and risk.
   */
  async getStakeholderHealthReport(organizationId: string): Promise<{
    overallHealth: number;
    stakeholderHealth: Array<{
      stakeholderType: string;
      healthScore: number;
      sentimentTrend: 'IMPROVING' | 'STABLE' | 'DECLINING';
      engagementLevel: 'HIGH' | 'MEDIUM' | 'LOW' | 'NONE';
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      recentSignalCount: number;
      vetoCount: number;
    }>;
    alerts: string[];
  }> {
    const stakeholders = await prisma.vox_stakeholders.findMany({
      where: { organization_id: organizationId, is_active: true },
    });

    const now = Date.now();
    const thirtyDaysAgo = new Date(now - 30 * 24 * 60 * 60 * 1000);
    const sixtyDaysAgo = new Date(now - 60 * 24 * 60 * 60 * 1000);

    const stakeholderHealth = await Promise.all(
      stakeholders.map(async (s) => {
        const [recentSignals, olderSignals, vetoCount] = await Promise.all([
          prisma.vox_signals.findMany({
            where: { stakeholder_id: s.id, created_at: { gte: thirtyDaysAgo } },
            select: { sentiment: true },
          }),
          prisma.vox_signals.findMany({
            where: { stakeholder_id: s.id, created_at: { gte: sixtyDaysAgo, lt: thirtyDaysAgo } },
            select: { sentiment: true },
          }),
          prisma.vox_votes.count({
            where: { stakeholder_id: s.id, veto_exercised: true, created_at: { gte: thirtyDaysAgo } },
          }),
        ]);

        const sentimentScore = (signals: Array<{ sentiment: string }>) => {
          if (signals.length === 0) return 50;
          const scores: Record<string, number> = { VERY_POSITIVE: 100, POSITIVE: 75, NEUTRAL: 50, NEGATIVE: 25, VERY_NEGATIVE: 0 };
          return Math.round(signals.reduce((sum, sig) => sum + (scores[sig.sentiment] || 50), 0) / signals.length);
        };

        const currentScore = sentimentScore(recentSignals);
        const previousScore = sentimentScore(olderSignals);
        const trend = currentScore > previousScore + 5 ? 'IMPROVING' as const
          : currentScore < previousScore - 5 ? 'DECLINING' as const
          : 'STABLE' as const;

        const engagementLevel = recentSignals.length >= 10 ? 'HIGH' as const
          : recentSignals.length >= 3 ? 'MEDIUM' as const
          : recentSignals.length >= 1 ? 'LOW' as const
          : 'NONE' as const;

        const riskLevel = (vetoCount > 2 || (trend === 'DECLINING' && currentScore < 30)) ? 'CRITICAL' as const
          : (vetoCount > 0 || currentScore < 40) ? 'HIGH' as const
          : currentScore < 50 ? 'MEDIUM' as const
          : 'LOW' as const;

        return {
          stakeholderType: s.stakeholder_type,
          healthScore: currentScore,
          sentimentTrend: trend,
          engagementLevel,
          riskLevel,
          recentSignalCount: recentSignals.length,
          vetoCount,
        };
      })
    );

    const overallHealth = stakeholderHealth.length > 0
      ? Math.round(stakeholderHealth.reduce((sum, h) => sum + h.healthScore, 0) / stakeholderHealth.length)
      : 50;

    const alerts: string[] = [];
    for (const h of stakeholderHealth) {
      if (h.riskLevel === 'CRITICAL') alerts.push(`CRITICAL: ${h.stakeholderType} sentiment is critically low with ${h.vetoCount} vetoes in 30 days`);
      if (h.sentimentTrend === 'DECLINING') alerts.push(`WARNING: ${h.stakeholderType} sentiment is declining`);
      if (h.engagementLevel === 'NONE') alerts.push(`SILENT: ${h.stakeholderType} has zero signals in 30 days — voice may be suppressed`);
    }

    return { overallHealth, stakeholderHealth, alerts };
  }
}

// Export singleton instance
export const cendiaVoxService = new CendiaVoxService();
