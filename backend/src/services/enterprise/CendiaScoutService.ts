/**
 * Service — Cendia Scout Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaScoutService, PsychometricProfile, TopPerformer, Candidate, ShadowPipeline, TalentAlert
 * @module services/enterprise/CendiaScoutService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIASCOUT™ - THE HEADHUNTER
// Talent Acquisition & Psychometric Matching
// "The Shadow Pipeline" - Always-ready candidate pools
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

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



  constructor() {


    this.loadFromDB().catch(() => {});


  }


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
      const response = await ollama.generate(prompt, {});
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
      const response = await ollama.generate(prompt, {});
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
      persistServiceRecord({ serviceName: 'CendiaScout', recordType: 'candidate', referenceId: matchedCandidate.id, data: matchedCandidate });
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
    persistServiceRecord({ serviceName: 'CendiaScout', recordType: 'pipeline', referenceId: roleId, data: pipeline });
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
          offerLetter = await ollama.generate(prompt, {});
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

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Talent Intelligence Dashboard */
  getTalentIntelligenceDashboard(): {
    overview: { totalCandidates: number; totalPipelines: number; activePipelines: number; urgentPipelines: number; topPerformersProfiled: number; avgPipelineHealth: number; totalAlerts: number };
    pipelineSummary: Array<{ roleId: string; roleName: string; department: string; candidateCount: number; targetCount: number; healthPct: number; urgency: string; topMatchScore: number; lastUpdated: Date }>;
    candidatesByStatus: Array<{ status: string; count: number; pctOfTotal: number }>;
    candidatesBySource: Array<{ source: string; count: number; avgMatchScore: number }>;
    recentCandidates: Array<{ id: string; name: string; currentRole: string; currentCompany: string; matchScore: number; status: string; addedAt: Date }>;
    alertsSummary: { total: number; bySeverity: Record<string, number>; byType: Record<string, number>; recentAlerts: TalentAlert[] };
    insights: string[];
  } {
    const pipelines = Array.from(this.pipelines.values());
    const candidates = Array.from(this.candidates.values());
    const topPerformers = Array.from(this.topPerformers.values());

    const statusMap: Record<string, number> = {};
    const sourceMap: Record<string, { count: number; scores: number[] }> = {};

    for (const c of candidates) {
      statusMap[c.status] = (statusMap[c.status] || 0) + 1;
      if (!sourceMap[c.source]) sourceMap[c.source] = { count: 0, scores: [] };
      sourceMap[c.source].count++;
      sourceMap[c.source].scores.push(c.matchScore);
    }

    // Include pipeline candidates in status/source maps
    for (const p of pipelines) {
      for (const c of p.candidates) {
        statusMap[c.status] = (statusMap[c.status] || 0) + 1;
        if (!sourceMap[c.source]) sourceMap[c.source] = { count: 0, scores: [] };
        sourceMap[c.source].count++;
        sourceMap[c.source].scores.push(c.matchScore);
      }
    }

    const totalCandidates = candidates.length + pipelines.reduce((s, p) => s + p.candidates.length, 0);

    let totalHealth = 0;
    const pipelineSummary = pipelines.map(p => {
      const healthPct = Math.min(100, Math.round((p.candidates.length / p.targetCount) * 100));
      totalHealth += healthPct;
      const topMatch = p.candidates.length > 0 ? Math.max(...p.candidates.map(c => c.matchScore)) : 0;
      return {
        roleId: p.roleId, roleName: p.roleName, department: p.department,
        candidateCount: p.candidates.length, targetCount: p.targetCount,
        healthPct, urgency: p.urgency, topMatchScore: topMatch, lastUpdated: p.lastUpdated,
      };
    }).sort((a, b) => a.healthPct - b.healthPct);

    const avgPipelineHealth = pipelines.length > 0 ? Math.round(totalHealth / pipelines.length) : 100;

    const sevMap: Record<string, number> = {};
    const typeMap: Record<string, number> = {};
    for (const a of this.alerts) {
      sevMap[a.severity] = (sevMap[a.severity] || 0) + 1;
      typeMap[a.type] = (typeMap[a.type] || 0) + 1;
    }

    const insights: string[] = [];
    const emptyPipelines = pipelines.filter(p => p.candidates.length === 0);
    if (emptyPipelines.length > 0) insights.push(`${emptyPipelines.length} pipeline(s) have zero candidates — initiate sourcing immediately`);
    const urgentCount = pipelines.filter(p => p.urgency === 'urgent' || p.urgency === 'critical').length;
    if (urgentCount > 0) insights.push(`${urgentCount} pipeline(s) marked urgent/critical — prioritize emergency search`);
    if (topPerformers.length === 0) insights.push('No top performers profiled — map genome for better candidate matching');
    const lowHealthPipelines = pipelines.filter(p => (p.candidates.length / p.targetCount) * 100 < 30);
    if (lowHealthPipelines.length > 0) insights.push(`${lowHealthPipelines.length} pipeline(s) below 30% health — expand sourcing channels`);
    if (insights.length === 0) insights.push('Talent acquisition pipelines are healthy');

    return {
      overview: {
        totalCandidates, totalPipelines: pipelines.length,
        activePipelines: pipelines.filter(p => p.candidates.length > 0).length,
        urgentPipelines: urgentCount, topPerformersProfiled: topPerformers.length,
        avgPipelineHealth, totalAlerts: this.alerts.length,
      },
      pipelineSummary,
      candidatesByStatus: Object.entries(statusMap).map(([s, c]) => ({ status: s, count: c, pctOfTotal: totalCandidates > 0 ? Math.round((c / totalCandidates) * 100) : 0 })).sort((a, b) => b.count - a.count),
      candidatesBySource: Object.entries(sourceMap).map(([s, d]) => ({ source: s, count: d.count, avgMatchScore: d.scores.length > 0 ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0 })).sort((a, b) => b.avgMatchScore - a.avgMatchScore),
      recentCandidates: [...candidates].sort((a, b) => b.addedAt.getTime() - a.addedAt.getTime()).slice(0, 10).map(c => ({
        id: c.id, name: c.name, currentRole: c.currentRole, currentCompany: c.currentCompany,
        matchScore: c.matchScore, status: c.status, addedAt: c.addedAt,
      })),
      alertsSummary: {
        total: this.alerts.length, bySeverity: sevMap, byType: typeMap,
        recentAlerts: [...this.alerts].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()).slice(0, 5),
      },
      insights,
    };
  }

  /** 10/10: Candidate Pipeline Analytics */
  getCandidatePipelineAnalytics(): {
    funnelAnalysis: Array<{ stage: string; count: number; pctOfTotal: number; conversionToNext: number }>;
    matchScoreDistribution: Array<{ range: string; count: number; pctOfTotal: number }>;
    sourceEffectiveness: Array<{ source: string; count: number; avgMatchScore: number; hiredCount: number; conversionRate: number }>;
    pipelineVelocity: { avgDaysInPipeline: number; fastestHire: number | null; slowestActive: number | null };
    departmentDemand: Array<{ department: string; pipelineCount: number; totalCandidates: number; avgHealth: number; urgentCount: number }>;
    topCandidates: Array<{ id: string; name: string; matchScore: number; currentRole: string; currentCompany: string; skills: string[]; status: string }>;
    insights: string[];
  } {
    const pipelines = Array.from(this.pipelines.values());
    const candidates = Array.from(this.candidates.values());
    const allCandidates = [...candidates];
    for (const p of pipelines) {
      for (const c of p.candidates) {
        if (!allCandidates.find(ac => ac.id === c.id)) allCandidates.push(c);
      }
    }

    // Funnel analysis
    const stageOrder: Candidate['status'][] = ['identified', 'researched', 'contacted', 'interested', 'interviewing', 'offer', 'hired', 'declined'];
    const stageCounts: Record<string, number> = {};
    for (const s of stageOrder) stageCounts[s] = 0;
    for (const c of allCandidates) stageCounts[c.status] = (stageCounts[c.status] || 0) + 1;

    const total = allCandidates.length || 1;
    const funnelAnalysis = stageOrder.map((stage, i) => {
      const count = stageCounts[stage] || 0;
      const nextStage = stageOrder[i + 1];
      const nextCount = nextStage ? (stageCounts[nextStage] || 0) : 0;
      return {
        stage, count, pctOfTotal: Math.round((count / total) * 100),
        conversionToNext: count > 0 && nextStage ? Math.round((nextCount / count) * 100) : 0,
      };
    });

    // Match score distribution
    const ranges = [
      { label: '90-100', min: 90, max: 100 }, { label: '80-89', min: 80, max: 89 },
      { label: '70-79', min: 70, max: 79 }, { label: '60-69', min: 60, max: 69 },
      { label: '50-59', min: 50, max: 59 }, { label: '0-49', min: 0, max: 49 },
    ];
    const matchScoreDistribution = ranges.map(r => {
      const count = allCandidates.filter(c => c.matchScore >= r.min && c.matchScore <= r.max).length;
      return { range: r.label, count, pctOfTotal: Math.round((count / total) * 100) };
    });

    // Source effectiveness
    const srcMap: Record<string, { count: number; scores: number[]; hired: number }> = {};
    for (const c of allCandidates) {
      if (!srcMap[c.source]) srcMap[c.source] = { count: 0, scores: [], hired: 0 };
      srcMap[c.source].count++;
      srcMap[c.source].scores.push(c.matchScore);
      if (c.status === 'hired') srcMap[c.source].hired++;
    }

    // Pipeline velocity
    const now = Date.now();
    const daysInPipeline = allCandidates.map(c => (now - c.addedAt.getTime()) / (24 * 60 * 60 * 1000));
    const hiredCandidates = allCandidates.filter(c => c.status === 'hired');
    const activeCandidates = allCandidates.filter(c => c.status !== 'hired' && c.status !== 'declined');

    // Department demand
    const deptMap: Record<string, { pipelines: number; candidates: number; healths: number[]; urgent: number }> = {};
    for (const p of pipelines) {
      if (!deptMap[p.department]) deptMap[p.department] = { pipelines: 0, candidates: 0, healths: [], urgent: 0 };
      deptMap[p.department].pipelines++;
      deptMap[p.department].candidates += p.candidates.length;
      deptMap[p.department].healths.push(Math.min(100, (p.candidates.length / p.targetCount) * 100));
      if (p.urgency === 'urgent' || p.urgency === 'critical') deptMap[p.department].urgent++;
    }

    const topCandidates = [...allCandidates]
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 10)
      .map(c => ({ id: c.id, name: c.name, matchScore: c.matchScore, currentRole: c.currentRole, currentCompany: c.currentCompany, skills: c.skills, status: c.status }));

    const insights: string[] = [];
    const highMatchUncontacted = allCandidates.filter(c => c.matchScore >= 80 && (c.status === 'identified' || c.status === 'researched'));
    if (highMatchUncontacted.length > 0) insights.push(`${highMatchUncontacted.length} high-match candidate(s) (80+) not yet contacted — prioritize outreach`);
    const bestSource = Object.entries(srcMap).sort((a, b) => {
      const avgA = a[1].scores.reduce((x, y) => x + y, 0) / a[1].scores.length;
      const avgB = b[1].scores.reduce((x, y) => x + y, 0) / b[1].scores.length;
      return avgB - avgA;
    })[0];
    if (bestSource) insights.push(`Best source by match quality: "${bestSource[0]}" (avg score ${Math.round(bestSource[1].scores.reduce((a, b) => a + b, 0) / bestSource[1].scores.length)})`);
    const declinedCount = allCandidates.filter(c => c.status === 'declined').length;
    if (declinedCount > allCandidates.length * 0.3 && allCandidates.length > 5) insights.push(`${Math.round((declinedCount / allCandidates.length) * 100)}% decline rate — review offer competitiveness and candidate experience`);
    if (insights.length === 0) insights.push('Candidate pipeline metrics are healthy');

    return {
      funnelAnalysis,
      matchScoreDistribution,
      sourceEffectiveness: Object.entries(srcMap).map(([s, d]) => ({
        source: s, count: d.count,
        avgMatchScore: d.scores.length > 0 ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0,
        hiredCount: d.hired, conversionRate: d.count > 0 ? Math.round((d.hired / d.count) * 100) : 0,
      })).sort((a, b) => b.avgMatchScore - a.avgMatchScore),
      pipelineVelocity: {
        avgDaysInPipeline: daysInPipeline.length > 0 ? Math.round(daysInPipeline.reduce((a, b) => a + b, 0) / daysInPipeline.length) : 0,
        fastestHire: hiredCandidates.length > 0 ? Math.round(Math.min(...hiredCandidates.map(c => (now - c.addedAt.getTime()) / (24 * 60 * 60 * 1000)))) : null,
        slowestActive: activeCandidates.length > 0 ? Math.round(Math.max(...activeCandidates.map(c => (now - c.addedAt.getTime()) / (24 * 60 * 60 * 1000)))) : null,
      },
      departmentDemand: Object.entries(deptMap).map(([d, v]) => ({
        department: d, pipelineCount: v.pipelines, totalCandidates: v.candidates,
        avgHealth: v.healths.length > 0 ? Math.round(v.healths.reduce((a, b) => a + b, 0) / v.healths.length) : 0,
        urgentCount: v.urgent,
      })).sort((a, b) => b.urgentCount - a.urgentCount || a.avgHealth - b.avgHealth),
      topCandidates,
      insights,
    };
  }

  /** 10/10: Psychometric Genome Intelligence */
  getPsychometricGenomeIntelligence(): {
    overview: { totalProfiled: number; avgPerformanceScore: number; avgTenureMonths: number; departmentsRepresented: number };
    cognitiveStyleDistribution: Array<{ style: string; count: number; pctOfTotal: number; avgPerformance: number }>;
    riskToleranceAnalysis: { avgRiskTolerance: number; highRisk: number; lowRisk: number; byDepartment: Array<{ department: string; avgRisk: number }> };
    collaborationPatterns: Array<{ preference: string; count: number; avgPerformance: number }>;
    communicationStyles: Array<{ style: string; count: number; avgPerformance: number }>;
    topStrengths: Array<{ strength: string; frequency: number }>;
    topDevelopmentAreas: Array<{ area: string; frequency: number }>;
    idealProfiles: Array<{ role: string; cognitiveStyle: string; riskTolerance: number; strengths: string[] }>;
    insights: string[];
  } {
    const performers = Array.from(this.topPerformers.values());
    const total = performers.length || 1;

    const cogMap: Record<string, { count: number; perfScores: number[] }> = {};
    const collabMap: Record<string, { count: number; perfScores: number[] }> = {};
    const commMap: Record<string, { count: number; perfScores: number[] }> = {};
    const deptRiskMap: Record<string, number[]> = {};
    const strengthMap: Record<string, number> = {};
    const devAreaMap: Record<string, number> = {};

    let totalPerf = 0; let totalTenure = 0; let totalRisk = 0;
    const departments = new Set<string>();

    for (const p of performers) {
      departments.add(p.department);
      totalPerf += p.performanceScore;
      totalTenure += p.tenure;
      totalRisk += p.profile.riskTolerance;

      if (!cogMap[p.profile.cognitiveStyle]) cogMap[p.profile.cognitiveStyle] = { count: 0, perfScores: [] };
      cogMap[p.profile.cognitiveStyle].count++;
      cogMap[p.profile.cognitiveStyle].perfScores.push(p.performanceScore);

      if (!collabMap[p.profile.collaborationPreference]) collabMap[p.profile.collaborationPreference] = { count: 0, perfScores: [] };
      collabMap[p.profile.collaborationPreference].count++;
      collabMap[p.profile.collaborationPreference].perfScores.push(p.performanceScore);

      if (!commMap[p.profile.communicationStyle]) commMap[p.profile.communicationStyle] = { count: 0, perfScores: [] };
      commMap[p.profile.communicationStyle].count++;
      commMap[p.profile.communicationStyle].perfScores.push(p.performanceScore);

      if (!deptRiskMap[p.department]) deptRiskMap[p.department] = [];
      deptRiskMap[p.department].push(p.profile.riskTolerance);

      for (const s of p.profile.strengths) strengthMap[s] = (strengthMap[s] || 0) + 1;
      for (const d of p.profile.developmentAreas) devAreaMap[d] = (devAreaMap[d] || 0) + 1;
    }

    // Compute ideal profiles per distinct role
    const roleMap: Record<string, TopPerformer[]> = {};
    for (const p of performers) {
      if (!roleMap[p.role]) roleMap[p.role] = [];
      roleMap[p.role].push(p);
    }

    const idealProfiles = Object.entries(roleMap).map(([role, rp]) => {
      const styles = rp.map(p => p.profile.cognitiveStyle);
      const dominant = styles.sort((a, b) => styles.filter(s => s === a).length - styles.filter(s => s === b).length).pop()!;
      const avgRisk = Math.round(rp.reduce((s, p) => s + p.profile.riskTolerance, 0) / rp.length);
      const strengths = [...new Set(rp.flatMap(p => p.profile.strengths))].slice(0, 5);
      return { role, cognitiveStyle: dominant, riskTolerance: avgRisk, strengths };
    });

    const insights: string[] = [];
    if (performers.length === 0) insights.push('No top performers profiled — begin genome mapping to improve candidate matching');
    const bestCogStyle = Object.entries(cogMap).sort((a, b) => {
      const avgA = a[1].perfScores.reduce((x, y) => x + y, 0) / a[1].perfScores.length;
      const avgB = b[1].perfScores.reduce((x, y) => x + y, 0) / b[1].perfScores.length;
      return avgB - avgA;
    })[0];
    if (bestCogStyle) insights.push(`Highest-performing cognitive style: "${bestCogStyle[0]}" (avg perf ${Math.round(bestCogStyle[1].perfScores.reduce((a, b) => a + b, 0) / bestCogStyle[1].perfScores.length)})`);
    const topStrength = Object.entries(strengthMap).sort((a, b) => b[1] - a[1])[0];
    if (topStrength) insights.push(`Most common strength: "${topStrength[0]}" across ${topStrength[1]} top performer(s)`);
    if (insights.length === 0) insights.push('Psychometric genome data is being built');

    return {
      overview: {
        totalProfiled: performers.length,
        avgPerformanceScore: performers.length > 0 ? Math.round(totalPerf / total) : 0,
        avgTenureMonths: performers.length > 0 ? Math.round(totalTenure / total) : 0,
        departmentsRepresented: departments.size,
      },
      cognitiveStyleDistribution: Object.entries(cogMap).map(([s, d]) => ({
        style: s, count: d.count, pctOfTotal: Math.round((d.count / total) * 100),
        avgPerformance: Math.round(d.perfScores.reduce((a, b) => a + b, 0) / d.perfScores.length),
      })).sort((a, b) => b.avgPerformance - a.avgPerformance),
      riskToleranceAnalysis: {
        avgRiskTolerance: performers.length > 0 ? Math.round(totalRisk / total) : 0,
        highRisk: performers.filter(p => p.profile.riskTolerance >= 70).length,
        lowRisk: performers.filter(p => p.profile.riskTolerance <= 30).length,
        byDepartment: Object.entries(deptRiskMap).map(([d, risks]) => ({
          department: d, avgRisk: Math.round(risks.reduce((a, b) => a + b, 0) / risks.length),
        })).sort((a, b) => b.avgRisk - a.avgRisk),
      },
      collaborationPatterns: Object.entries(collabMap).map(([p, d]) => ({
        preference: p, count: d.count,
        avgPerformance: Math.round(d.perfScores.reduce((a, b) => a + b, 0) / d.perfScores.length),
      })).sort((a, b) => b.avgPerformance - a.avgPerformance),
      communicationStyles: Object.entries(commMap).map(([s, d]) => ({
        style: s, count: d.count,
        avgPerformance: Math.round(d.perfScores.reduce((a, b) => a + b, 0) / d.perfScores.length),
      })).sort((a, b) => b.avgPerformance - a.avgPerformance),
      topStrengths: Object.entries(strengthMap).map(([s, f]) => ({ strength: s, frequency: f })).sort((a, b) => b.frequency - a.frequency).slice(0, 15),
      topDevelopmentAreas: Object.entries(devAreaMap).map(([a, f]) => ({ area: a, frequency: f })).sort((a, b) => b.frequency - a.frequency).slice(0, 10),
      idealProfiles,
      insights,
    };
  }

  /** 10/10: Recruitment Effectiveness Tracker */
  getRecruitmentEffectivenessTracker(): {
    overallMetrics: { totalPipelines: number; totalCandidatesManaged: number; avgPipelineHealth: number; hiredCount: number; declinedCount: number; overallConversionRate: number };
    pipelineHealthTrend: Array<{ roleId: string; roleName: string; healthPct: number; urgency: string; daysSinceUpdate: number; candidateGap: number }>;
    sourcingROI: Array<{ source: string; candidateCount: number; hiredCount: number; avgMatchScore: number; costEfficiency: string }>;
    urgencyBreakdown: Array<{ urgency: string; pipelineCount: number; avgHealth: number; avgCandidates: number }>;
    alertEffectiveness: { totalAlerts: number; criticalAlerts: number; pipelineEmptyAlerts: number; recentAlertRate: number };
    talentPoolDepth: { totalTopPerformers: number; rolesWithIdealProfiles: number; rolesWithoutProfiles: number; genomeCoverage: number };
    insights: string[];
  } {
    const pipelines = Array.from(this.pipelines.values());
    const candidates = Array.from(this.candidates.values());
    const allCandidates = [...candidates];
    for (const p of pipelines) {
      for (const c of p.candidates) {
        if (!allCandidates.find(ac => ac.id === c.id)) allCandidates.push(c);
      }
    }

    const totalManaged = allCandidates.length;
    const hired = allCandidates.filter(c => c.status === 'hired').length;
    const declined = allCandidates.filter(c => c.status === 'declined').length;

    let totalHealth = 0;
    const now = Date.now();
    const pipelineHealthTrend = pipelines.map(p => {
      const healthPct = Math.min(100, Math.round((p.candidates.length / p.targetCount) * 100));
      totalHealth += healthPct;
      return {
        roleId: p.roleId, roleName: p.roleName, healthPct, urgency: p.urgency,
        daysSinceUpdate: Math.round((now - p.lastUpdated.getTime()) / (24 * 60 * 60 * 1000)),
        candidateGap: Math.max(0, p.targetCount - p.candidates.length),
      };
    }).sort((a, b) => a.healthPct - b.healthPct);

    // Source ROI
    const srcMap: Record<string, { count: number; hired: number; scores: number[] }> = {};
    for (const c of allCandidates) {
      if (!srcMap[c.source]) srcMap[c.source] = { count: 0, hired: 0, scores: [] };
      srcMap[c.source].count++;
      srcMap[c.source].scores.push(c.matchScore);
      if (c.status === 'hired') srcMap[c.source].hired++;
    }

    // Urgency breakdown
    const urgMap: Record<string, { count: number; healths: number[]; candidates: number[] }> = {};
    for (const p of pipelines) {
      if (!urgMap[p.urgency]) urgMap[p.urgency] = { count: 0, healths: [], candidates: [] };
      urgMap[p.urgency].count++;
      urgMap[p.urgency].healths.push(Math.min(100, (p.candidates.length / p.targetCount) * 100));
      urgMap[p.urgency].candidates.push(p.candidates.length);
    }

    // Alert metrics
    const d7 = now - 7 * 24 * 60 * 60 * 1000;
    const recentAlerts = this.alerts.filter(a => a.createdAt.getTime() > d7).length;
    const criticalAlerts = this.alerts.filter(a => a.severity === 'critical').length;
    const emptyAlerts = this.alerts.filter(a => a.type === 'pipeline_empty').length;

    // Genome coverage
    const topPerformers = Array.from(this.topPerformers.values());
    const rolesWithProfiles = new Set(topPerformers.map(p => p.role.toLowerCase()));
    const allRoles = new Set(pipelines.map(p => p.roleName.toLowerCase()));
    const rolesWithIdealProfiles = [...allRoles].filter(r => {
      return [...rolesWithProfiles].some(rp => rp.includes(r) || r.includes(rp));
    }).length;

    const insights: string[] = [];
    const stalePipelines = pipelineHealthTrend.filter(p => p.daysSinceUpdate > 14);
    if (stalePipelines.length > 0) insights.push(`${stalePipelines.length} pipeline(s) not updated in 14+ days — refresh candidate pools`);
    const totalGap = pipelineHealthTrend.reduce((s, p) => s + p.candidateGap, 0);
    if (totalGap > 0) insights.push(`Total candidate gap across all pipelines: ${totalGap} — accelerate sourcing`);
    if (totalManaged > 0 && declined / totalManaged > 0.25) insights.push(`${Math.round((declined / totalManaged) * 100)}% candidate decline rate — review compensation and employer branding`);
    if (rolesWithIdealProfiles < allRoles.size && allRoles.size > 0) insights.push(`Only ${rolesWithIdealProfiles}/${allRoles.size} roles have genome-based ideal profiles — profile more top performers`);
    if (insights.length === 0) insights.push('Recruitment effectiveness metrics are strong');

    return {
      overallMetrics: {
        totalPipelines: pipelines.length, totalCandidatesManaged: totalManaged,
        avgPipelineHealth: pipelines.length > 0 ? Math.round(totalHealth / pipelines.length) : 100,
        hiredCount: hired, declinedCount: declined,
        overallConversionRate: totalManaged > 0 ? Math.round((hired / totalManaged) * 100) : 0,
      },
      pipelineHealthTrend,
      sourcingROI: Object.entries(srcMap).map(([s, d]) => ({
        source: s, candidateCount: d.count, hiredCount: d.hired,
        avgMatchScore: d.scores.length > 0 ? Math.round(d.scores.reduce((a, b) => a + b, 0) / d.scores.length) : 0,
        costEfficiency: d.hired > 0 ? 'productive' : d.count > 5 ? 'low_conversion' : 'needs_data',
      })).sort((a, b) => b.hiredCount - a.hiredCount),
      urgencyBreakdown: Object.entries(urgMap).map(([u, d]) => ({
        urgency: u, pipelineCount: d.count,
        avgHealth: d.healths.length > 0 ? Math.round(d.healths.reduce((a, b) => a + b, 0) / d.healths.length) : 0,
        avgCandidates: d.candidates.length > 0 ? Math.round(d.candidates.reduce((a, b) => a + b, 0) / d.candidates.length) : 0,
      })),
      alertEffectiveness: {
        totalAlerts: this.alerts.length, criticalAlerts, pipelineEmptyAlerts: emptyAlerts,
        recentAlertRate: recentAlerts,
      },
      talentPoolDepth: {
        totalTopPerformers: topPerformers.length, rolesWithIdealProfiles,
        rolesWithoutProfiles: allRoles.size - rolesWithIdealProfiles,
        genomeCoverage: allRoles.size > 0 ? Math.round((rolesWithIdealProfiles / allRoles.size) * 100) : 0,
      },
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaScout', recordType: 'candidate', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.topPerformers.has(d.id)) this.topPerformers.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaScout', recordType: 'pipeline', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.pipelines.has(d.id)) this.pipelines.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaScout', recordType: 'pipeline', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.candidates.has(d.id)) this.candidates.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[CendiaScoutService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaScoutService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaScout',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaScout',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaScoutService = new CendiaScoutService();
export default cendiaScoutService;
