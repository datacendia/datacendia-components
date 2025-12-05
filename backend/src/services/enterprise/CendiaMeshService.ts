// =============================================================================
// CENDIAMESH™ - M&A CULTURE INTEGRATION INTELLIGENCE
// "The Cultural Integrator" - AI-powered post-merger integration
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

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
}

// Export singleton instance
export const cendiaMeshService = new CendiaMeshService();
