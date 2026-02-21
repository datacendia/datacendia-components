// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAMESH™ - M&A CULTURE INTEGRATION INTELLIGENCE
// "The Cultural Integrator" - AI-powered post-merger integration
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CultureProfile {
  id: string;
  companyName: string;
  values: CultureValue[];
  decisionMaking: DecisionStyle;
  communicationStyle: CommunicationStyle;
  workStyle: WorkStyle;
  leadership: LeadershipStyle;
  riskTolerance: number; // 0-100
  innovationFocus: number; // 0-100
  employeeAutonomy: number; // 0-100
  performanceOrientation: number; // 0-100
  collaboration: number; // 0-100
  assessedAt: Date;
  dataPoints: number;
}

export interface CultureValue {
  name: string;
  importance: number; // 0-100
  behaviors: string[];
  artifacts: string[];
}

export interface DecisionStyle {
  type: 'consensus' | 'consultative' | 'democratic' | 'autocratic' | 'delegative';
  speed: 'fast' | 'moderate' | 'deliberate';
  dataReliance: 'high' | 'medium' | 'low';
  hierarchy: 'flat' | 'moderate' | 'hierarchical';
}

export interface CommunicationStyle {
  formality: 'formal' | 'semi_formal' | 'informal';
  directness: 'direct' | 'balanced' | 'indirect';
  meetingCulture: 'heavy' | 'moderate' | 'light';
  transparency: 'high' | 'medium' | 'low';
}

export interface WorkStyle {
  hours: 'flexible' | 'standard' | 'extended';
  remote: 'fully_remote' | 'hybrid' | 'office_first';
  dressCode: 'formal' | 'business_casual' | 'casual';
  pacePreference: 'fast' | 'steady' | 'measured';
}

export interface LeadershipStyle {
  type: 'transformational' | 'servant' | 'transactional' | 'situational';
  accessibility: 'high' | 'medium' | 'low';
  feedbackFrequency: 'continuous' | 'regular' | 'periodic';
}

export interface CultureComparison {
  acquirerId: string;
  targetId: string;
  overallCompatibility: number; // 0-100
  alignments: CultureAlignment[];
  conflicts: CultureConflict[];
  riskAreas: IntegrationRisk[];
  synergies: CultureSynergy[];
  aiAnalysis: string;
  generatedAt: Date;
}

export interface CultureAlignment {
  area: string;
  acquirerValue: string;
  targetValue: string;
  alignmentScore: number;
  leverage: string;
}

export interface CultureConflict {
  area: string;
  acquirerApproach: string;
  targetApproach: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  impactedGroups: string[];
  resolutionStrategy: string;
  timeline: string;
}

export interface IntegrationRisk {
  category: 'talent_flight' | 'productivity_loss' | 'customer_impact' | 'cultural_rejection' | 'leadership_gap';
  probability: number;
  impact: number;
  mitigation: string;
  owner: string;
}

export interface CultureSynergy {
  area: string;
  description: string;
  potentialValue: number;
  timeToRealize: string;
  actions: string[];
}

export interface IntegrationRoadmap {
  id: string;
  name: string;
  acquirer: CultureProfile;
  target: CultureProfile;
  comparison: CultureComparison;
  phases: IntegrationPhase[];
  milestones: IntegrationMilestone[];
  metrics: IntegrationMetric[];
  status: 'planning' | 'active' | 'complete';
  startDate: Date;
  targetCompletion: Date;
  actualCompletion?: Date;
  createdAt: Date;
}

export interface IntegrationPhase {
  name: string;
  description: string;
  duration: number; // days
  startDate: Date;
  endDate: Date;
  status: 'pending' | 'active' | 'complete';
  objectives: string[];
  activities: IntegrationActivity[];
  dependencies: string[];
}

export interface IntegrationActivity {
  name: string;
  description: string;
  owner: string;
  status: 'pending' | 'in_progress' | 'complete' | 'blocked';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dueDate: Date;
  completedDate?: Date;
}

export interface IntegrationMilestone {
  name: string;
  description: string;
  targetDate: Date;
  status: 'pending' | 'achieved' | 'missed' | 'at_risk';
  successCriteria: string[];
}

export interface IntegrationMetric {
  name: string;
  category: 'people' | 'process' | 'performance' | 'culture';
  baseline: number;
  target: number;
  current: number;
  trend: 'improving' | 'stable' | 'declining';
  frequency: 'daily' | 'weekly' | 'monthly';
}

export interface TalentRetention {
  employeeId: string;
  name: string;
  role: string;
  criticalTalent: boolean;
  flightRisk: number; // 0-100
  retentionPlan?: RetentionPlan;
  engagementScore: number;
  concerns: string[];
}

export interface RetentionPlan {
  incentives: { type: string; value: number; vestingPeriod: string }[];
  careerPath: string;
  specialAssignments: string[];
  mentorship: string;
  communication: string[];
}

export interface ChangeReadiness {
  department: string;
  readinessScore: number;
  resistanceLevel: 'low' | 'medium' | 'high';
  keyInfluencers: string[];
  concerns: string[];
  recommendations: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaMeshService {
  private profiles: Map<string, CultureProfile> = new Map();
  private comparisons: Map<string, CultureComparison> = new Map();
  private roadmaps: Map<string, IntegrationRoadmap> = new Map();
  private talentTracker: Map<string, TalentRetention[]> = new Map();

  constructor() {
    logger.info('CendiaMesh™ initialized - The Cultural Integrator is ready');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // CULTURE ASSESSMENT
  // ---------------------------------------------------------------------------

  async assessCulture(companyName: string, surveyData?: any): Promise<CultureProfile> {
    const prompt = `You are CendiaMesh™, an AI culture assessment system.

Analyze and generate a culture profile for: ${companyName}

${surveyData ? `Survey Data Available: ${JSON.stringify(surveyData).substring(0, 2000)}` : 'No survey data - generate representative profile based on company type.'}

Generate a comprehensive culture profile in JSON:
{
  "values": [
    {
      "name": "value name",
      "importance": 0-100,
      "behaviors": ["behavior 1", "behavior 2"],
      "artifacts": ["artifact 1", "artifact 2"]
    }
  ],
  "decisionMaking": {
    "type": "consensus|consultative|democratic|autocratic|delegative",
    "speed": "fast|moderate|deliberate",
    "dataReliance": "high|medium|low",
    "hierarchy": "flat|moderate|hierarchical"
  },
  "communicationStyle": {
    "formality": "formal|semi_formal|informal",
    "directness": "direct|balanced|indirect",
    "meetingCulture": "heavy|moderate|light",
    "transparency": "high|medium|low"
  },
  "workStyle": {
    "hours": "flexible|standard|extended",
    "remote": "fully_remote|hybrid|office_first",
    "dressCode": "formal|business_casual|casual",
    "pacePreference": "fast|steady|measured"
  },
  "leadership": {
    "type": "transformational|servant|transactional|situational",
    "accessibility": "high|medium|low",
    "feedbackFrequency": "continuous|regular|periodic"
  },
  "metrics": {
    "riskTolerance": 0-100,
    "innovationFocus": 0-100,
    "employeeAutonomy": 0-100,
    "performanceOrientation": 0-100,
    "collaboration": 0-100
  }
}`;

    let profileData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('culture_assessment') });
        profileData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaMesh: AI culture assessment unavailable');
    }

    const profile: CultureProfile = {
      id: `culture-${Date.now()}`,
      companyName,
      values: profileData.values || [
        { name: 'Excellence', importance: 85, behaviors: ['High standards'], artifacts: ['Awards program'] },
        { name: 'Integrity', importance: 90, behaviors: ['Ethical decisions'], artifacts: ['Code of conduct'] },
      ],
      decisionMaking: profileData.decisionMaking || {
        type: 'consultative',
        speed: 'moderate',
        dataReliance: 'high',
        hierarchy: 'moderate',
      },
      communicationStyle: profileData.communicationStyle || {
        formality: 'semi_formal',
        directness: 'balanced',
        meetingCulture: 'moderate',
        transparency: 'medium',
      },
      workStyle: profileData.workStyle || {
        hours: 'standard',
        remote: 'hybrid',
        dressCode: 'business_casual',
        pacePreference: 'steady',
      },
      leadership: profileData.leadership || {
        type: 'situational',
        accessibility: 'medium',
        feedbackFrequency: 'regular',
      },
      riskTolerance: profileData.metrics?.riskTolerance || 50,
      innovationFocus: profileData.metrics?.innovationFocus || 60,
      employeeAutonomy: profileData.metrics?.employeeAutonomy || 55,
      performanceOrientation: profileData.metrics?.performanceOrientation || 70,
      collaboration: profileData.metrics?.collaboration || 65,
      assessedAt: new Date(),
      dataPoints: surveyData ? Object.keys(surveyData).length : 0,
    };

    this.profiles.set(profile.id, profile);
    persistServiceRecord({ serviceName: 'CendiaMesh', recordType: 'culture_profile', referenceId: profile.id, data: profile });
    logger.info(`CendiaMesh: Culture profile created for ${companyName}`);
    return profile;
  }

  getCultureProfile(profileId: string): CultureProfile | null {
    return this.profiles.get(profileId) || null;
  }

  // ---------------------------------------------------------------------------
  // CULTURE COMPARISON
  // ---------------------------------------------------------------------------

  async compareCultures(acquirerId: string, targetId: string): Promise<CultureComparison> {
    const acquirer = this.profiles.get(acquirerId);
    const target = this.profiles.get(targetId);

    if (!acquirer || !target) {
      throw new Error('Both culture profiles must exist');
    }

    const prompt = `You are CendiaMesh™, comparing two organizational cultures for M&A integration.

ACQUIRER: ${acquirer.companyName}
- Decision Making: ${acquirer.decisionMaking.type}, ${acquirer.decisionMaking.speed}
- Risk Tolerance: ${acquirer.riskTolerance}%
- Innovation Focus: ${acquirer.innovationFocus}%
- Employee Autonomy: ${acquirer.employeeAutonomy}%
- Work Style: ${acquirer.workStyle.remote}, ${acquirer.workStyle.pacePreference}

TARGET: ${target.companyName}
- Decision Making: ${target.decisionMaking.type}, ${target.decisionMaking.speed}
- Risk Tolerance: ${target.riskTolerance}%
- Innovation Focus: ${target.innovationFocus}%
- Employee Autonomy: ${target.employeeAutonomy}%
- Work Style: ${target.workStyle.remote}, ${target.workStyle.pacePreference}

Analyze compatibility and generate JSON:
{
  "overallCompatibility": 0-100,
  "alignments": [
    {
      "area": "area name",
      "acquirerValue": "value",
      "targetValue": "value",
      "alignmentScore": 0-100,
      "leverage": "how to leverage alignment"
    }
  ],
  "conflicts": [
    {
      "area": "area name",
      "acquirerApproach": "approach",
      "targetApproach": "approach",
      "severity": "low|medium|high|critical",
      "impactedGroups": ["group 1"],
      "resolutionStrategy": "strategy",
      "timeline": "timeframe"
    }
  ],
  "riskAreas": [
    {
      "category": "talent_flight|productivity_loss|customer_impact|cultural_rejection|leadership_gap",
      "probability": 0-100,
      "impact": 0-100,
      "mitigation": "strategy",
      "owner": "role"
    }
  ],
  "synergies": [
    {
      "area": "area",
      "description": "description",
      "potentialValue": dollar_amount,
      "timeToRealize": "timeframe",
      "actions": ["action 1"]
    }
  ],
  "analysis": "detailed analysis"
}`;

    let comparisonData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('culture_assessment') });
        comparisonData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaMesh: AI culture comparison unavailable');
    }

    // Calculate compatibility if AI didn't
    const compatibility = comparisonData.overallCompatibility || 
      this.calculateCompatibility(acquirer, target);

    const comparison: CultureComparison = {
      acquirerId,
      targetId,
      overallCompatibility: compatibility,
      alignments: comparisonData.alignments || this.findAlignments(acquirer, target),
      conflicts: comparisonData.conflicts || this.findConflicts(acquirer, target),
      riskAreas: comparisonData.riskAreas || [{
        category: 'talent_flight',
        probability: 40,
        impact: 70,
        mitigation: 'Retention packages for key talent',
        owner: 'HR Lead',
      }],
      synergies: comparisonData.synergies || [],
      aiAnalysis: comparisonData.analysis || 'Culture comparison complete. Review conflicts carefully.',
      generatedAt: new Date(),
    };

    const key = `${acquirerId}-${targetId}`;
    this.comparisons.set(key, comparison);
    logger.info(`CendiaMesh: Culture comparison complete - ${compatibility}% compatibility`);
    return comparison;
  }

  private calculateCompatibility(acquirer: CultureProfile, target: CultureProfile): number {
    const factors = [
      Math.abs(acquirer.riskTolerance - target.riskTolerance),
      Math.abs(acquirer.innovationFocus - target.innovationFocus),
      Math.abs(acquirer.employeeAutonomy - target.employeeAutonomy),
      Math.abs(acquirer.performanceOrientation - target.performanceOrientation),
      Math.abs(acquirer.collaboration - target.collaboration),
    ];
    
    const avgDiff = factors.reduce((a, b) => a + b, 0) / factors.length;
    return Math.round(100 - avgDiff);
  }

  private findAlignments(acquirer: CultureProfile, target: CultureProfile): CultureAlignment[] {
    const alignments: CultureAlignment[] = [];

    if (Math.abs(acquirer.innovationFocus - target.innovationFocus) < 15) {
      alignments.push({
        area: 'Innovation Focus',
        acquirerValue: `${acquirer.innovationFocus}%`,
        targetValue: `${target.innovationFocus}%`,
        alignmentScore: 85,
        leverage: 'Build joint innovation initiatives',
      });
    }

    if (acquirer.decisionMaking.dataReliance === target.decisionMaking.dataReliance) {
      alignments.push({
        area: 'Data-Driven Decision Making',
        acquirerValue: acquirer.decisionMaking.dataReliance,
        targetValue: target.decisionMaking.dataReliance,
        alignmentScore: 90,
        leverage: 'Unify analytics and reporting',
      });
    }

    return alignments;
  }

  private findConflicts(acquirer: CultureProfile, target: CultureProfile): CultureConflict[] {
    const conflicts: CultureConflict[] = [];

    if (acquirer.decisionMaking.speed !== target.decisionMaking.speed) {
      conflicts.push({
        area: 'Decision Speed',
        acquirerApproach: acquirer.decisionMaking.speed,
        targetApproach: target.decisionMaking.speed,
        severity: 'medium',
        impactedGroups: ['Leadership', 'Middle Management'],
        resolutionStrategy: 'Establish clear decision frameworks with defined timelines',
        timeline: '3-6 months',
      });
    }

    if (acquirer.workStyle.remote !== target.workStyle.remote) {
      conflicts.push({
        area: 'Remote Work Policy',
        acquirerApproach: acquirer.workStyle.remote,
        targetApproach: target.workStyle.remote,
        severity: 'high',
        impactedGroups: ['All Employees'],
        resolutionStrategy: 'Develop hybrid policy that accommodates both preferences',
        timeline: '1-3 months',
      });
    }

    return conflicts;
  }

  // ---------------------------------------------------------------------------
  // INTEGRATION ROADMAP
  // ---------------------------------------------------------------------------

  async generateIntegrationRoadmap(
    name: string, 
    acquirerId: string, 
    targetId: string
  ): Promise<IntegrationRoadmap> {
    const acquirer = this.profiles.get(acquirerId);
    const target = this.profiles.get(targetId);
    
    if (!acquirer || !target) {
      throw new Error('Both culture profiles must exist');
    }

    const comparisonKey = `${acquirerId}-${targetId}`;
    let comparison = this.comparisons.get(comparisonKey);
    if (!comparison) {
      comparison = await this.compareCultures(acquirerId, targetId);
    }

    const startDate = new Date();
    const phases: IntegrationPhase[] = [
      {
        name: 'Day One Readiness',
        description: 'Immediate integration activities and communication',
        duration: 30,
        startDate,
        endDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        status: 'pending',
        objectives: ['Communicate vision', 'Establish governance', 'Identify key talent'],
        activities: [],
        dependencies: [],
      },
      {
        name: 'Foundation Building',
        description: 'Establish integrated operations and culture bridge',
        duration: 90,
        startDate: new Date(startDate.getTime() + 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(startDate.getTime() + 120 * 24 * 60 * 60 * 1000),
        status: 'pending',
        objectives: ['Align processes', 'Integrate teams', 'Launch culture initiatives'],
        activities: [],
        dependencies: ['Day One Readiness'],
      },
      {
        name: 'Optimization',
        description: 'Optimize combined operations and culture',
        duration: 180,
        startDate: new Date(startDate.getTime() + 120 * 24 * 60 * 60 * 1000),
        endDate: new Date(startDate.getTime() + 300 * 24 * 60 * 60 * 1000),
        status: 'pending',
        objectives: ['Capture synergies', 'Stabilize culture', 'Measure success'],
        activities: [],
        dependencies: ['Foundation Building'],
      },
    ];

    const roadmap: IntegrationRoadmap = {
      id: `roadmap-${Date.now()}`,
      name,
      acquirer,
      target,
      comparison,
      phases,
      milestones: [
        {
          name: 'Day One Complete',
          description: 'All Day One activities executed successfully',
          targetDate: phases[0].endDate,
          status: 'pending',
          successCriteria: ['Communications sent', 'Leadership in place', 'Systems accessible'],
        },
        {
          name: 'Integration Complete',
          description: 'Full organizational integration achieved',
          targetDate: phases[2].endDate,
          status: 'pending',
          successCriteria: ['Synergies captured', 'Culture unified', 'Retention targets met'],
        },
      ],
      metrics: [
        { name: 'Employee Retention', category: 'people', baseline: 100, target: 90, current: 100, trend: 'stable', frequency: 'weekly' },
        { name: 'Engagement Score', category: 'culture', baseline: 70, target: 75, current: 70, trend: 'stable', frequency: 'monthly' },
        { name: 'Synergy Capture', category: 'performance', baseline: 0, target: 100, current: 0, trend: 'stable', frequency: 'monthly' },
      ],
      status: 'planning',
      startDate,
      targetCompletion: phases[2].endDate,
      createdAt: new Date(),
    };

    this.roadmaps.set(roadmap.id, roadmap);
    logger.info(`CendiaMesh: Integration roadmap created - ${name}`);
    return roadmap;
  }

  getRoadmap(roadmapId: string): IntegrationRoadmap | null {
    return this.roadmaps.get(roadmapId) || null;
  }

  updateRoadmapMetric(roadmapId: string, metricName: string, value: number): IntegrationRoadmap | null {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) return null;

    const metric = roadmap.metrics.find(m => m.name === metricName);
    if (metric) {
      const previousValue = metric.current;
      metric.current = value;
      metric.trend = value > previousValue ? 'improving' : value < previousValue ? 'declining' : 'stable';
    }

    return roadmap;
  }

  // ---------------------------------------------------------------------------
  // TALENT RETENTION
  // ---------------------------------------------------------------------------

  trackTalent(roadmapId: string, talent: Omit<TalentRetention, 'flightRisk'>): TalentRetention {
    const flightRisk = this.calculateFlightRisk(talent);
    
    const tracked: TalentRetention = {
      ...talent,
      flightRisk,
    };

    const existing = this.talentTracker.get(roadmapId) || [];
    existing.push(tracked);
    this.talentTracker.set(roadmapId, existing);

    if (flightRisk > 70) {
      logger.warn(`CendiaMesh: High flight risk for ${talent.name} (${flightRisk}%)`);
    }

    return tracked;
  }

  private calculateFlightRisk(talent: Omit<TalentRetention, 'flightRisk'>): number {
    let risk = 30; // Base risk

    if (talent.criticalTalent) risk += 20;
    if (talent.engagementScore < 50) risk += 25;
    if (talent.concerns.length > 2) risk += 15;
    if (!talent.retentionPlan) risk += 10;

    return Math.min(100, risk);
  }

  getAtRiskTalent(roadmapId: string, threshold: number = 60): TalentRetention[] {
    const talent = this.talentTracker.get(roadmapId) || [];
    return talent.filter(t => t.flightRisk >= threshold);
  }

  createRetentionPlan(roadmapId: string, employeeId: string, plan: RetentionPlan): TalentRetention | null {
    const talent = this.talentTracker.get(roadmapId) || [];
    const employee = talent.find(t => t.employeeId === employeeId);
    
    if (employee) {
      employee.retentionPlan = plan;
      employee.flightRisk = Math.max(10, employee.flightRisk - 20); // Reduce risk with plan
      logger.info(`CendiaMesh: Retention plan created for ${employee.name}`);
    }

    return employee || null;
  }

  // ---------------------------------------------------------------------------
  // CHANGE READINESS
  // ---------------------------------------------------------------------------

  async assessChangeReadiness(roadmapId: string, department: string): Promise<ChangeReadiness> {
    const roadmap = this.roadmaps.get(roadmapId);
    if (!roadmap) throw new Error('Roadmap not found');

    const prompt = `You are CendiaMesh™, assessing change readiness for M&A integration.

INTEGRATION: ${roadmap.name}
DEPARTMENT: ${department}
COMPATIBILITY SCORE: ${roadmap.comparison.overallCompatibility}%
CONFLICTS: ${roadmap.comparison.conflicts.length}

Assess change readiness in JSON:
{
  "readinessScore": 0-100,
  "resistanceLevel": "low|medium|high",
  "keyInfluencers": ["name/role 1", "name/role 2"],
  "concerns": ["concern 1", "concern 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}`;

    let readinessData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('culture_assessment') });
        readinessData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaMesh: AI readiness assessment unavailable');
    }

    const readiness: ChangeReadiness = {
      department,
      readinessScore: readinessData.readinessScore || 60,
      resistanceLevel: readinessData.resistanceLevel || 'medium',
      keyInfluencers: readinessData.keyInfluencers || ['Department Head', 'Senior Manager'],
      concerns: readinessData.concerns || ['Job security', 'Process changes'],
      recommendations: readinessData.recommendations || [
        'Increase communication frequency',
        'Involve team in integration planning',
      ],
    };

    logger.info(`CendiaMesh: Change readiness assessed for ${department}: ${readiness.readinessScore}%`);
    return readiness;
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
      logger.warn('CendiaMesh: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    activeIntegrations: number;
    avgCompatibility: number;
    talentAtRisk: number;
    milestonesAchieved: number;
  } {
    const roadmaps = Array.from(this.roadmaps.values());
    const active = roadmaps.filter(r => r.status === 'active');
    const avgCompat = roadmaps.length > 0
      ? roadmaps.reduce((sum, r) => sum + r.comparison.overallCompatibility, 0) / roadmaps.length
      : 0;
    
    let atRisk = 0;
    let achieved = 0;
    for (const roadmap of roadmaps) {
      const talent = this.talentTracker.get(roadmap.id) || [];
      atRisk += talent.filter(t => t.flightRisk > 60).length;
      achieved += roadmap.milestones.filter(m => m.status === 'achieved').length;
    }

    return {
      activeIntegrations: active.length,
      avgCompatibility: Math.round(avgCompat),
      talentAtRisk: atRisk,
      milestonesAchieved: achieved,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Integration Health Dashboard */
  getIntegrationHealthDashboard(): {
    activeIntegrations: number;
    overallHealth: number;
    byRoadmap: Array<{ name: string; status: string; compatibility: number; phaseProgress: number; milestoneProgress: number; talentAtRisk: number; health: string }>;
    phaseBreakdown: { pending: number; active: number; complete: number };
    milestoneBreakdown: { pending: number; achieved: number; missed: number; atRisk: number };
    metricsTrend: Array<{ metric: string; baseline: number; target: number; current: number; trend: string; onTrack: boolean }>;
    riskSummary: { totalRisks: number; criticalConflicts: number; highFlightRisk: number; missedMilestones: number };
    insights: string[];
  } {
    const roadmaps = Array.from(this.roadmaps.values());

    let totalHealth = 0;
    const phaseBreakdown = { pending: 0, active: 0, complete: 0 };
    const milestoneBreakdown = { pending: 0, achieved: 0, missed: 0, atRisk: 0 };
    let totalRisks = 0; let criticalConflicts = 0; let highFlightRisk = 0; let missedMilestones = 0;
    const allMetrics: Array<{ metric: string; baseline: number; target: number; current: number; trend: string; onTrack: boolean }> = [];

    const byRoadmap = roadmaps.map(r => {
      const talent = this.talentTracker.get(r.id) || [];
      const atRisk = talent.filter(t => t.flightRisk > 60).length;
      highFlightRisk += atRisk;

      const totalPhases = r.phases.length;
      const completedPhases = r.phases.filter(p => p.status === 'complete').length;
      const phaseProgress = totalPhases > 0 ? Math.round((completedPhases / totalPhases) * 100) : 0;

      for (const p of r.phases) {
        if (p.status === 'pending') phaseBreakdown.pending++;
        else if (p.status === 'active') phaseBreakdown.active++;
        else if (p.status === 'complete') phaseBreakdown.complete++;
      }

      const totalMs = r.milestones.length;
      const achievedMs = r.milestones.filter(m => m.status === 'achieved').length;
      const milestoneProgress = totalMs > 0 ? Math.round((achievedMs / totalMs) * 100) : 0;

      for (const m of r.milestones) {
        if (m.status === 'pending') milestoneBreakdown.pending++;
        else if (m.status === 'achieved') milestoneBreakdown.achieved++;
        else if (m.status === 'missed') { milestoneBreakdown.missed++; missedMilestones++; }
        else if (m.status === 'at_risk') milestoneBreakdown.atRisk++;
      }

      totalRisks += r.comparison.riskAreas.length;
      criticalConflicts += r.comparison.conflicts.filter(c => c.severity === 'critical').length;

      for (const met of r.metrics) {
        const progress = met.target !== met.baseline ? ((met.current - met.baseline) / (met.target - met.baseline)) * 100 : 100;
        allMetrics.push({ metric: `${r.name}: ${met.name}`, baseline: met.baseline, target: met.target, current: met.current, trend: met.trend, onTrack: progress >= 50 || met.trend === 'improving' });
      }

      const health = atRisk > 3 ? 'critical' : r.comparison.overallCompatibility < 50 ? 'at_risk' : phaseProgress > 50 ? 'on_track' : 'early_stage';
      const healthScore = health === 'on_track' ? 85 : health === 'early_stage' ? 70 : health === 'at_risk' ? 50 : 30;
      totalHealth += healthScore;

      return { name: r.name, status: r.status, compatibility: r.comparison.overallCompatibility, phaseProgress, milestoneProgress, talentAtRisk: atRisk, health };
    });

    const overallHealth = roadmaps.length > 0 ? Math.round(totalHealth / roadmaps.length) : 100;

    const insights: string[] = [];
    if (highFlightRisk > 0) insights.push(`${highFlightRisk} employee(s) at high flight risk across all integrations`);
    if (criticalConflicts > 0) insights.push(`${criticalConflicts} critical culture conflict(s) requiring immediate attention`);
    if (missedMilestones > 0) insights.push(`${missedMilestones} milestone(s) missed — review recovery plans`);
    if (overallHealth < 60) insights.push(`Overall integration health is ${overallHealth}% — escalation recommended`);
    if (insights.length === 0) insights.push('All integrations progressing within expected parameters');

    return {
      activeIntegrations: roadmaps.filter(r => r.status === 'active').length,
      overallHealth, byRoadmap, phaseBreakdown, milestoneBreakdown,
      metricsTrend: allMetrics,
      riskSummary: { totalRisks, criticalConflicts, highFlightRisk, missedMilestones },
      insights,
    };
  }

  /** 10/10: Culture Compatibility Matrix */
  getCultureCompatibilityMatrix(): {
    profiles: Array<{ id: string; company: string; riskTolerance: number; innovationFocus: number; employeeAutonomy: number; performanceOrientation: number; collaboration: number; decisionStyle: string; workStyle: string }>;
    comparisons: Array<{ acquirer: string; target: string; compatibility: number; alignments: number; conflicts: number; topConflict: string; synergies: number }>;
    dimensionAnalysis: Array<{ dimension: string; avgScore: number; stdDeviation: number; mostAligned: string; leastAligned: string }>;
    insights: string[];
  } {
    const profiles = Array.from(this.profiles.values());
    const comparisons = Array.from(this.comparisons.values());

    const profileSummaries = profiles.map(p => ({
      id: p.id, company: p.companyName, riskTolerance: p.riskTolerance, innovationFocus: p.innovationFocus,
      employeeAutonomy: p.employeeAutonomy, performanceOrientation: p.performanceOrientation,
      collaboration: p.collaboration, decisionStyle: p.decisionMaking.type, workStyle: p.workStyle.remote,
    }));

    const comparisonSummaries = comparisons.map(c => {
      const acq = this.profiles.get(c.acquirerId);
      const tgt = this.profiles.get(c.targetId);
      return {
        acquirer: acq?.companyName || c.acquirerId, target: tgt?.companyName || c.targetId,
        compatibility: c.overallCompatibility, alignments: c.alignments.length, conflicts: c.conflicts.length,
        topConflict: c.conflicts[0]?.area || 'None', synergies: c.synergies.length,
      };
    });

    const dimensions: Array<{ name: string; getter: (p: CultureProfile) => number }> = [
      { name: 'Risk Tolerance', getter: p => p.riskTolerance },
      { name: 'Innovation Focus', getter: p => p.innovationFocus },
      { name: 'Employee Autonomy', getter: p => p.employeeAutonomy },
      { name: 'Performance Orientation', getter: p => p.performanceOrientation },
      { name: 'Collaboration', getter: p => p.collaboration },
    ];

    const dimensionAnalysis = dimensions.map(d => {
      const values = profiles.map(p => ({ company: p.companyName, score: d.getter(p) }));
      const avg = values.length > 0 ? values.reduce((s, v) => s + v.score, 0) / values.length : 0;
      const variance = values.length > 0 ? values.reduce((s, v) => s + Math.pow(v.score - avg, 2), 0) / values.length : 0;
      const sorted = [...values].sort((a, b) => b.score - a.score);
      return {
        dimension: d.name, avgScore: Math.round(avg), stdDeviation: Math.round(Math.sqrt(variance) * 10) / 10,
        mostAligned: sorted[0]?.company || 'N/A', leastAligned: sorted[sorted.length - 1]?.company || 'N/A',
      };
    });

    const insights: string[] = [];
    const lowCompat = comparisonSummaries.filter(c => c.compatibility < 50);
    if (lowCompat.length > 0) insights.push(`${lowCompat.length} comparison(s) below 50% compatibility — high integration risk`);
    const highConflict = comparisonSummaries.filter(c => c.conflicts > 3);
    if (highConflict.length > 0) insights.push(`${highConflict.length} comparison(s) with 4+ culture conflicts`);
    if (profiles.length < 2) insights.push('Need at least 2 culture profiles for meaningful comparisons');
    if (insights.length === 0) insights.push('Culture compatibility analysis is within acceptable ranges');

    return { profiles: profileSummaries, comparisons: comparisonSummaries, dimensionAnalysis, insights };
  }

  /** 10/10: Talent Risk Intelligence */
  getTalentRiskIntelligence(): {
    totalTracked: number;
    criticalTalent: number;
    highFlightRisk: number;
    avgFlightRisk: number;
    avgEngagement: number;
    withRetentionPlan: number;
    withoutRetentionPlan: number;
    byRoadmap: Array<{ roadmap: string; tracked: number; atRisk: number; critical: number; avgFlightRisk: number }>;
    topRisks: Array<{ name: string; role: string; flightRisk: number; engagement: number; critical: boolean; hasPlan: boolean; topConcerns: string[] }>;
    retentionEffectiveness: { plansCreated: number; avgRiskReduction: number };
    insights: string[];
  } {
    const roadmaps = Array.from(this.roadmaps.values());
    let totalTracked = 0; let criticalTalent = 0; let highFlightRisk = 0;
    let totalFlightRisk = 0; let totalEngagement = 0; let withPlan = 0; let withoutPlan = 0;
    const allTalent: TalentRetention[] = [];

    const byRoadmap: Array<{ roadmap: string; tracked: number; atRisk: number; critical: number; avgFlightRisk: number }> = [];

    for (const r of roadmaps) {
      const talent = this.talentTracker.get(r.id) || [];
      const atRisk = talent.filter(t => t.flightRisk > 60).length;
      const critical = talent.filter(t => t.criticalTalent).length;
      const avgRisk = talent.length > 0 ? talent.reduce((s, t) => s + t.flightRisk, 0) / talent.length : 0;

      byRoadmap.push({ roadmap: r.name, tracked: talent.length, atRisk, critical, avgFlightRisk: Math.round(avgRisk) });

      for (const t of talent) {
        allTalent.push(t);
        totalTracked++;
        if (t.criticalTalent) criticalTalent++;
        if (t.flightRisk > 60) highFlightRisk++;
        totalFlightRisk += t.flightRisk;
        totalEngagement += t.engagementScore;
        if (t.retentionPlan) withPlan++; else withoutPlan++;
      }
    }

    const topRisks = [...allTalent]
      .sort((a, b) => b.flightRisk - a.flightRisk)
      .slice(0, 10)
      .map(t => ({ name: t.name, role: t.role, flightRisk: t.flightRisk, engagement: t.engagementScore, critical: t.criticalTalent, hasPlan: !!t.retentionPlan, topConcerns: t.concerns.slice(0, 3) }));

    const insights: string[] = [];
    if (highFlightRisk > 0) insights.push(`${highFlightRisk} employee(s) with flight risk above 60%`);
    const criticalAtRisk = allTalent.filter(t => t.criticalTalent && t.flightRisk > 60).length;
    if (criticalAtRisk > 0) insights.push(`${criticalAtRisk} critical talent member(s) at high flight risk — urgent action needed`);
    if (withoutPlan > 0 && highFlightRisk > 0) insights.push(`${withoutPlan} at-risk employee(s) without retention plans`);
    if (insights.length === 0) insights.push('Talent retention metrics are within acceptable ranges');

    return {
      totalTracked, criticalTalent, highFlightRisk,
      avgFlightRisk: totalTracked > 0 ? Math.round(totalFlightRisk / totalTracked) : 0,
      avgEngagement: totalTracked > 0 ? Math.round(totalEngagement / totalTracked) : 0,
      withRetentionPlan: withPlan, withoutRetentionPlan: withoutPlan,
      byRoadmap, topRisks,
      retentionEffectiveness: { plansCreated: withPlan, avgRiskReduction: withPlan > 0 ? 20 : 0 },
      insights,
    };
  }

  /** 10/10: Change Readiness Scorecard */
  getChangeReadinessScorecard(): {
    overallReadiness: number;
    totalProfiles: number;
    totalRoadmaps: number;
    totalComparisons: number;
    integrationVelocity: { avgPhaseDuration: number; avgMilestoneAchievementRate: number; avgSynergyCapture: number };
    riskDistribution: { talentFlight: number; productivityLoss: number; customerImpact: number; culturalRejection: number; leadershipGap: number };
    conflictResolution: { total: number; bySeverity: { low: number; medium: number; high: number; critical: number } };
    synergySummary: { totalIdentified: number; totalValue: number; avgTimeToRealize: string };
    insights: string[];
  } {
    const profiles = Array.from(this.profiles.values());
    const roadmaps = Array.from(this.roadmaps.values());
    const comparisons = Array.from(this.comparisons.values());

    let totalReadiness = 0;
    let phaseDurations = 0; let phaseCount = 0;
    let achievedMs = 0; let totalMs = 0;
    const riskDist = { talentFlight: 0, productivityLoss: 0, customerImpact: 0, culturalRejection: 0, leadershipGap: 0 };
    const conflictSev = { low: 0, medium: 0, high: 0, critical: 0 };
    let totalSynergies = 0; let totalSynergyValue = 0;

    for (const r of roadmaps) {
      totalReadiness += r.comparison.overallCompatibility;
      for (const p of r.phases) {
        phaseDurations += p.duration;
        phaseCount++;
      }
      for (const m of r.milestones) {
        totalMs++;
        if (m.status === 'achieved') achievedMs++;
      }
    }

    for (const c of comparisons) {
      for (const risk of c.riskAreas) {
        const key = risk.category.replace(/_/g, '') as string;
        if (key === 'talentflight') riskDist.talentFlight++;
        else if (key === 'productivityloss') riskDist.productivityLoss++;
        else if (key === 'customerimpact') riskDist.customerImpact++;
        else if (key === 'culturalrejection') riskDist.culturalRejection++;
        else if (key === 'leadershipgap') riskDist.leadershipGap++;
      }
      for (const conf of c.conflicts) {
        conflictSev[conf.severity]++;
      }
      for (const syn of c.synergies) {
        totalSynergies++;
        totalSynergyValue += syn.potentialValue;
      }
    }

    const overallReadiness = roadmaps.length > 0 ? Math.round(totalReadiness / roadmaps.length) : 0;
    const avgPhaseDuration = phaseCount > 0 ? Math.round(phaseDurations / phaseCount) : 0;
    const milestoneRate = totalMs > 0 ? Math.round((achievedMs / totalMs) * 100) : 0;

    const synergyMetrics = roadmaps.flatMap(r => r.metrics.filter(m => m.name === 'Synergy Capture'));
    const avgSynergy = synergyMetrics.length > 0 ? Math.round(synergyMetrics.reduce((s, m) => s + m.current, 0) / synergyMetrics.length) : 0;

    const insights: string[] = [];
    if (overallReadiness < 60) insights.push(`Overall readiness at ${overallReadiness}% — increase change management efforts`);
    if (conflictSev.critical > 0) insights.push(`${conflictSev.critical} critical conflict(s) unresolved`);
    if (milestoneRate < 50 && totalMs > 0) insights.push(`Milestone achievement rate is only ${milestoneRate}%`);
    if (insights.length === 0) insights.push('Change readiness metrics indicate healthy integration progress');

    return {
      overallReadiness, totalProfiles: profiles.length, totalRoadmaps: roadmaps.length, totalComparisons: comparisons.length,
      integrationVelocity: { avgPhaseDuration, avgMilestoneAchievementRate: milestoneRate, avgSynergyCapture: avgSynergy },
      riskDistribution: riskDist,
      conflictResolution: { total: conflictSev.low + conflictSev.medium + conflictSev.high + conflictSev.critical, bySeverity: conflictSev },
      synergySummary: { totalIdentified: totalSynergies, totalValue: totalSynergyValue, avgTimeToRealize: totalSynergies > 0 ? '6-12 months' : 'N/A' },
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'culture_profile', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.profiles.has(d.id)) this.profiles.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'culture_profile', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.comparisons.has(d.id)) this.comparisons.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'culture_profile', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.roadmaps.has(d.id)) this.roadmaps.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaMesh', recordType: 'culture_profile', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this.talentTracker.has(d.id)) this.talentTracker.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaMeshService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaMeshService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton instance
export const cendiaMeshService = new CendiaMeshService();
