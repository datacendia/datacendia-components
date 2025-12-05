// =============================================================================
// CENDIASCOUT™ - THE HEADHUNTER
// Talent Acquisition & Psychometric Matching
// "The Shadow Pipeline" - Always-ready candidate pools
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';

// =============================================================================
// TYPES
// =============================================================================

export interface PsychometricProfile {
  cognitiveStyle: 'analytical' | 'creative' | 'practical' | 'hybrid';
  riskTolerance: number; // 0-100
  collaborationPreference: 'solo' | 'small_team' | 'large_team';
  decisionSpeed: 'deliberate' | 'balanced' | 'rapid';
  communicationStyle: 'direct' | 'diplomatic' | 'technical';
  leadershipStyle?: 'servant' | 'transformational' | 'strategic' | 'operational';
  strengths: string[];
  developmentAreas: string[];
}

export interface TopPerformer {
  id: string;
  name: string;
  role: string;
  department: string;
  tenure: number; // months
  performanceScore: number; // 0-100
  profile: PsychometricProfile;
  keyBehaviors: string[];
  impactMetrics: string[];
}

export interface Candidate {
  id: string;
  name: string;
  email?: string;
  linkedinUrl?: string;
  githubUrl?: string;
  currentRole: string;
  currentCompany: string;
  experience: number; // years
  skills: string[];
  profile?: PsychometricProfile;
  matchScore: number; // 0-100
  matchReasons: string[];
  source: 'linkedin' | 'github' | 'referral' | 'inbound' | 'research';
  status: 'identified' | 'researched' | 'contacted' | 'interested' | 'interviewing' | 'offer' | 'hired' | 'declined';
  addedAt: Date;
  lastContactedAt?: Date;
}

export interface ShadowPipeline {
  roleId: string;
  roleName: string;
  department: string;
  targetCount: number;
  candidates: Candidate[];
  idealProfile: PsychometricProfile;
  urgency: 'proactive' | 'planning' | 'urgent' | 'critical';
  lastUpdated: Date;
}

export interface TalentAlert {
  type: 'key_departure_risk' | 'pipeline_empty' | 'market_opportunity' | 'competitor_hiring';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  action: string;
  createdAt: Date;
}

// =============================================================================
// CENDIASCOUT SERVICE
// =============================================================================

class CendiaScoutService {
  private topPerformers: Map<string, TopPerformer> = new Map();
  private pipelines: Map<string, ShadowPipeline> = new Map();
  private candidates: Map<string, Candidate> = new Map();
  private alerts: TalentAlert[] = [];

  // ---------------------------------------------------------------------------
  // PSYCHOMETRIC GENOME MAPPING
  // ---------------------------------------------------------------------------

  async mapTopPerformerGenome(performer: Omit<TopPerformer, 'profile'>): Promise<TopPerformer> {
    const prompt = `Analyze this top performer to create a psychometric profile:

Role: ${performer.role}
Department: ${performer.department}
Tenure: ${performer.tenure} months
Performance Score: ${performer.performanceScore}/100
Key Behaviors: ${performer.keyBehaviors.join(', ')}
Impact: ${performer.impactMetrics.join(', ')}

Output JSON:
{
  "cognitiveStyle": "analytical|creative|practical|hybrid",
  "riskTolerance": 0-100,
  "collaborationPreference": "solo|small_team|large_team",
  "decisionSpeed": "deliberate|balanced|rapid",
  "communicationStyle": "direct|diplomatic|technical",
  "leadershipStyle": "servant|transformational|strategic|operational",
  "strengths": ["..."],
  "developmentAreas": ["..."]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.3:70b' });
      const profile = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const topPerformer: TopPerformer = {
        ...performer,
        id: performer.id || `tp-${Date.now()}`,
        profile: {
          cognitiveStyle: profile.cognitiveStyle || 'hybrid',
          riskTolerance: profile.riskTolerance || 50,
          collaborationPreference: profile.collaborationPreference || 'small_team',
          decisionSpeed: profile.decisionSpeed || 'balanced',
          communicationStyle: profile.communicationStyle || 'direct',
          leadershipStyle: profile.leadershipStyle,
          strengths: profile.strengths || [],
          developmentAreas: profile.developmentAreas || [],
        },
      };

      this.topPerformers.set(topPerformer.id, topPerformer);
      logger.info(`CendiaScout: Mapped genome for ${performer.name}`);
      return topPerformer;
    } catch (error) {
      logger.error('Genome mapping failed:', error);
      throw error;
    }
  }

  getIdealProfile(role: string): PsychometricProfile | null {
    const performers = Array.from(this.topPerformers.values())
      .filter(p => p.role.toLowerCase().includes(role.toLowerCase()));

    if (performers.length === 0) return null;

    // Aggregate profiles to find ideal
    const avgRisk = performers.reduce((sum, p) => sum + p.profile.riskTolerance, 0) / performers.length;
    const styles = performers.map(p => p.profile.cognitiveStyle);
    const mostCommonStyle = styles.sort((a, b) =>
      styles.filter(s => s === a).length - styles.filter(s => s === b).length
    ).pop()!;

    return {
      cognitiveStyle: mostCommonStyle,
      riskTolerance: Math.round(avgRisk),
      collaborationPreference: performers[0].profile.collaborationPreference,
      decisionSpeed: performers[0].profile.decisionSpeed,
      communicationStyle: performers[0].profile.communicationStyle,
      strengths: [...new Set(performers.flatMap(p => p.profile.strengths))],
      developmentAreas: [],
    };
  }

  // ---------------------------------------------------------------------------
  // CANDIDATE MATCHING
  // ---------------------------------------------------------------------------

  async matchCandidate(candidate: Omit<Candidate, 'id' | 'matchScore' | 'matchReasons' | 'profile' | 'addedAt' | 'status'>, targetRole: string): Promise<Candidate> {
    const idealProfile = this.getIdealProfile(targetRole);

    const prompt = `Analyze this candidate for the ${targetRole} role:

Candidate:
- Current: ${candidate.currentRole} at ${candidate.currentCompany}
- Experience: ${candidate.experience} years
- Skills: ${candidate.skills.join(', ')}

${idealProfile ? `Ideal Profile:
- Cognitive Style: ${idealProfile.cognitiveStyle}
- Risk Tolerance: ${idealProfile.riskTolerance}
- Key Strengths: ${idealProfile.strengths.join(', ')}` : ''}

Score this candidate 0-100 and explain why.

Output JSON:
{
  "matchScore": 0-100,
  "matchReasons": ["..."],
  "inferredProfile": {
    "cognitiveStyle": "...",
    "riskTolerance": 0-100,
    "strengths": ["..."]
  }
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.3:70b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const matchedCandidate: Candidate = {
        id: `cand-${Date.now()}`,
        ...candidate,
        matchScore: analysis.matchScore || 50,
        matchReasons: analysis.matchReasons || ['Analysis pending'],
        profile: analysis.inferredProfile ? {
          cognitiveStyle: analysis.inferredProfile.cognitiveStyle || 'hybrid',
          riskTolerance: analysis.inferredProfile.riskTolerance || 50,
          collaborationPreference: 'small_team',
          decisionSpeed: 'balanced',
          communicationStyle: 'direct',
          strengths: analysis.inferredProfile.strengths || [],
          developmentAreas: [],
        } : undefined,
        status: 'researched',
        addedAt: new Date(),
      };

      this.candidates.set(matchedCandidate.id, matchedCandidate);
      return matchedCandidate;
    } catch (error) {
      logger.error('Candidate matching failed:', error);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // THE SHADOW PIPELINE
  // ---------------------------------------------------------------------------

  async buildShadowPipeline(roleId: string, roleName: string, department: string, targetCount: number = 50): Promise<ShadowPipeline> {
    const idealProfile = this.getIdealProfile(roleName);
    
    const pipeline: ShadowPipeline = {
      roleId,
      roleName,
      department,
      targetCount,
      candidates: [],
      idealProfile: idealProfile || {
        cognitiveStyle: 'hybrid',
        riskTolerance: 50,
        collaborationPreference: 'small_team',
        decisionSpeed: 'balanced',
        communicationStyle: 'direct',
        strengths: [],
        developmentAreas: [],
      },
      urgency: 'proactive',
      lastUpdated: new Date(),
    };

    this.pipelines.set(roleId, pipeline);
    logger.info(`CendiaScout: Created shadow pipeline for ${roleName}`);
    return pipeline;
  }

  async activateEmergencySearch(roleId: string): Promise<{
    topCandidates: Candidate[];
    draftOffers: { candidateId: string; offerLetter: string }[];
  }> {
    const pipeline = this.pipelines.get(roleId);
    if (!pipeline) throw new Error('Pipeline not found');

    pipeline.urgency = 'critical';

    // Get top 3 candidates
    const topCandidates = pipeline.candidates
      .filter(c => c.status === 'interested' || c.status === 'researched')
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 3);

    // Generate offer letters
    const draftOffers = await Promise.all(
      topCandidates.map(async (candidate) => {
        const prompt = `Draft a compelling offer letter for ${candidate.name} for the ${pipeline.roleName} position.

Candidate: ${candidate.currentRole} at ${candidate.currentCompany}
Match Score: ${candidate.matchScore}%
Key Strengths: ${candidate.matchReasons.join(', ')}

Write a warm, personalized offer letter. Include placeholder for [SALARY] and [START_DATE].`;

        let offerLetter = '';
        try {
          offerLetter = await ollama.generate(prompt, { model: 'llama3.3:70b' });
        } catch (error) {
          offerLetter = `Dear ${candidate.name},\n\nWe are pleased to extend an offer for the ${pipeline.roleName} position...\n\n[Salary: [SALARY]]\n[Start Date: [START_DATE]]`;
        }

        return { candidateId: candidate.id, offerLetter };
      })
    );

    logger.warn(`CendiaScout: Emergency search activated for ${pipeline.roleName}. ${topCandidates.length} candidates ready.`);

    return { topCandidates, draftOffers };
  }

  // ---------------------------------------------------------------------------
  // PIPELINE MANAGEMENT
  // ---------------------------------------------------------------------------

  addCandidateToPipeline(roleId: string, candidate: Candidate): void {
    const pipeline = this.pipelines.get(roleId);
    if (pipeline) {
      pipeline.candidates.push(candidate);
      pipeline.lastUpdated = new Date();
    }
  }

  getPipelineHealth(): {
    roleId: string;
    roleName: string;
    candidateCount: number;
    targetCount: number;
    healthPercent: number;
    urgency: string;
  }[] {
    return Array.from(this.pipelines.values()).map(p => ({
      roleId: p.roleId,
      roleName: p.roleName,
      candidateCount: p.candidates.length,
      targetCount: p.targetCount,
      healthPercent: Math.round((p.candidates.length / p.targetCount) * 100),
      urgency: p.urgency,
    }));
  }

  // ---------------------------------------------------------------------------
  // ALERTS
  // ---------------------------------------------------------------------------

  checkPipelineAlerts(): TalentAlert[] {
    const newAlerts: TalentAlert[] = [];

    for (const pipeline of this.pipelines.values()) {
      const healthPercent = (pipeline.candidates.length / pipeline.targetCount) * 100;
      
      if (healthPercent < 20) {
        newAlerts.push({
          type: 'pipeline_empty',
          severity: 'high',
          message: `${pipeline.roleName} pipeline is critically low (${pipeline.candidates.length}/${pipeline.targetCount})`,
          action: 'Initiate sourcing campaign',
          createdAt: new Date(),
        });
      }
    }

    this.alerts.push(...newAlerts);
    return newAlerts;
  }

  getAlerts(): TalentAlert[] {
    return this.alerts.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalCandidates: number;
    pipelineHealth: number;
    openPositions: number;
    activePipelines: number;
    urgentPipelines: number;
  } {
    const pipelines = Array.from(this.pipelines.values());
    const candidates = Array.from(this.candidates.values());
    
    let totalHealth = 0;
    for (const p of pipelines) {
      totalHealth += Math.min(100, (p.candidates.length / p.targetCount) * 100);
    }
    const pipelineHealth = pipelines.length > 0 ? Math.round(totalHealth / pipelines.length) : 100;

    return {
      totalCandidates: candidates.length,
      pipelineHealth,
      openPositions: pipelines.length,
      activePipelines: pipelines.filter(p => p.candidates.length > 0).length,
      urgentPipelines: pipelines.filter(p => p.urgency === 'urgent' || p.urgency === 'critical').length,
    };
  }
}

export const cendiaScoutService = new CendiaScoutService();
export default cendiaScoutService;
