/**
 * Service — Cendia Academy Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaAcademyService, EmployeeSkillProfile, Skill, Certification, LearningGoal, GoalMilestone, SkillAssessment, SkillGap
 * @module services/enterprise/CendiaAcademyService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAACADEMY™ - LEARNING & DEVELOPMENT INTELLIGENCE
// "The Personalized Tutor" - AI-powered adaptive learning and skill development
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface EmployeeSkillProfile {
  id: string;
  employeeId: string;
  name: string;
  department: string;
  role: string;
  level: 'entry' | 'mid' | 'senior' | 'lead' | 'executive';
  skills: Skill[];
  certifications: Certification[];
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferredDuration: 'micro' | 'short' | 'medium' | 'long';
  availableHours: number; // per week
  goals: LearningGoal[];
  assessments: SkillAssessment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Skill {
  name: string;
  category: string;
  currentLevel: number; // 0-100
  targetLevel: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  lastAssessed: Date;
  trend: 'improving' | 'stable' | 'declining';
}

export interface Certification {
  name: string;
  issuer: string;
  dateObtained: Date;
  expirationDate?: Date;
  status: 'active' | 'expiring_soon' | 'expired';
  renewalRequired: boolean;
}

export interface LearningGoal {
  id: string;
  title: string;
  description: string;
  targetDate: Date;
  status: 'not_started' | 'in_progress' | 'completed' | 'overdue';
  progress: number;
  milestones: GoalMilestone[];
}

export interface GoalMilestone {
  title: string;
  completed: boolean;
  completedDate?: Date;
}

export interface SkillAssessment {
  skillName: string;
  score: number;
  maxScore: number;
  date: Date;
  assessmentType: 'self' | 'manager' | 'peer' | 'automated';
  feedback?: string;
}

export interface SkillGap {
  employeeId: string;
  skill: string;
  currentLevel: number;
  requiredLevel: number;
  gap: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  businessImpact: string;
  recommendedPath: LearningPath;
}

export interface LearningPath {
  id: string;
  name: string;
  description: string;
  targetSkill: string;
  duration: number; // hours
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  modules: LearningModule[];
  prerequisites: string[];
  outcomes: string[];
  completionCriteria: string;
}

export interface LearningModule {
  id: string;
  title: string;
  description: string;
  type: 'video' | 'reading' | 'interactive' | 'exercise' | 'quiz' | 'project' | 'mentoring';
  duration: number; // minutes
  content?: string;
  resources: string[];
  order: number;
  mandatory: boolean;
  status: 'locked' | 'available' | 'in_progress' | 'completed';
  completedAt?: Date;
  score?: number;
}

export interface MicroCourse {
  id: string;
  title: string;
  skill: string;
  duration: number; // minutes (typically 5-15)
  format: 'video' | 'interactive' | 'reading' | 'exercise' | 'quiz';
  content: string;
  keyTakeaways: string[];
  context?: string; // When to deliver (just-in-time context)
  effectiveness: number;
  completions: number;
  avgScore: number;
  generatedAt: Date;
}

export interface JustInTimeIntervention {
  id: string;
  employeeId: string;
  trigger: string;
  skill: string;
  content: MicroCourse;
  deliveredAt: Date;
  engagementStatus: 'pending' | 'viewed' | 'completed' | 'dismissed';
  completedAt?: Date;
  feedback?: string;
}

export interface TeamSkillMatrix {
  teamId: string;
  teamName: string;
  members: EmployeeSkillProfile[];
  skillCoverage: { skill: string; coverage: number; gap: boolean }[];
  strengthAreas: string[];
  developmentPriorities: string[];
  successionRisks: SuccessionRisk[];
  recommendations: string[];
}

export interface SuccessionRisk {
  role: string;
  currentHolder: string;
  readyNow: string[];
  readyInOneYear: string[];
  noSuccessor: boolean;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  developmentPlan?: string;
}

export interface LearningAnalytics {
  period: string;
  totalLearningHours: number;
  coursesCompleted: number;
  skillsImproved: number;
  averageScore: number;
  engagementRate: number;
  topSkillsLearned: { skill: string; hours: number }[];
  completionRate: number;
  byDepartment: { department: string; hours: number; completion: number }[];
  roi: LearningROI;
}

export interface LearningROI {
  investmentCost: number;
  productivityGain: number;
  retentionImpact: number;
  performanceImprovement: number;
  estimatedReturn: number;
  roiPercentage: number;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaAcademyService {
  private profiles: Map<string, EmployeeSkillProfile> = new Map();
  private paths: Map<string, LearningPath> = new Map();
  private microCourses: Map<string, MicroCourse> = new Map();
  private interventions: Map<string, JustInTimeIntervention[]> = new Map();

  constructor() {
    logger.info('CendiaAcademy™ initialized - The Personalized Tutor is ready');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // SKILL PROFILE MANAGEMENT
  // ---------------------------------------------------------------------------

  createProfile(profile: Omit<EmployeeSkillProfile, 'id' | 'assessments' | 'createdAt' | 'updatedAt'>): EmployeeSkillProfile {
    const newProfile: EmployeeSkillProfile = {
      ...profile,
      id: `profile-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      assessments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(newProfile.id, newProfile);
    this.interventions.set(newProfile.employeeId, []);
    persistServiceRecord({ serviceName: 'CendiaAcademy', recordType: 'skill_profile', referenceId: newProfile.id, data: newProfile });
    logger.info(`CendiaAcademy: Created skill profile for ${newProfile.name}`);
    return newProfile;
  }

  updateSkill(profileId: string, skillName: string, update: Partial<Skill>): EmployeeSkillProfile | null {
    const profile = this.profiles.get(profileId);
    if (!profile) return null;

    const skill = profile.skills.find(s => s.name === skillName);
    if (skill) {
      Object.assign(skill, update, { lastAssessed: new Date() });
    } else {
      profile.skills.push({
        name: skillName,
        category: 'General',
        currentLevel: 0,
        targetLevel: 100,
        priority: 'medium',
        lastAssessed: new Date(),
        trend: 'stable',
        ...update,
      } as Skill);
    }

    profile.updatedAt = new Date();
    return profile;
  }

  recordAssessment(profileId: string, assessment: Omit<SkillAssessment, 'date'>): EmployeeSkillProfile | null {
    const profile = this.profiles.get(profileId);
    if (!profile) return null;

    profile.assessments.push({
      ...assessment,
      date: new Date(),
    });

    // Update skill level based on assessment
    const skill = profile.skills.find(s => s.name === assessment.skillName);
    if (skill) {
      const percentage = (assessment.score / assessment.maxScore) * 100;
      const oldLevel = skill.currentLevel;
      skill.currentLevel = Math.round((skill.currentLevel + percentage) / 2);
      skill.trend = skill.currentLevel > oldLevel ? 'improving' : skill.currentLevel < oldLevel ? 'declining' : 'stable';
      skill.lastAssessed = new Date();
    }

    profile.updatedAt = new Date();
    logger.info(`CendiaAcademy: Assessment recorded for ${profile.name} - ${assessment.skillName}: ${assessment.score}/${assessment.maxScore}`);
    return profile;
  }

  getProfile(profileId: string): EmployeeSkillProfile | null {
    return this.profiles.get(profileId) || null;
  }

  getProfileByEmployee(employeeId: string): EmployeeSkillProfile | null {
    return Array.from(this.profiles.values()).find(p => p.employeeId === employeeId) || null;
  }

  // ---------------------------------------------------------------------------
  // SKILL GAP ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeSkillGaps(profileId: string): Promise<SkillGap[]> {
    const profile = this.profiles.get(profileId);
    if (!profile) throw new Error('Profile not found');

    const gaps: SkillGap[] = [];

    for (const skill of profile.skills) {
      if (skill.currentLevel < skill.targetLevel) {
        const gap = skill.targetLevel - skill.currentLevel;
        const priority = gap > 40 ? 'critical' : gap > 25 ? 'high' : gap > 10 ? 'medium' : 'low';

        const path = await this.recommendLearningPath(skill.name, skill.currentLevel, skill.targetLevel);

        gaps.push({
          employeeId: profile.employeeId,
          skill: skill.name,
          currentLevel: skill.currentLevel,
          requiredLevel: skill.targetLevel,
          gap,
          priority,
          businessImpact: `${gap}% gap in ${skill.name} affecting ${skill.category} capabilities`,
          recommendedPath: path,
        });
      }
    }

    // Sort by priority and gap size
    gaps.sort((a, b) => {
      const priorityOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      const priorityDiff = priorityOrder[a.priority] - priorityOrder[b.priority];
      return priorityDiff !== 0 ? priorityDiff : b.gap - a.gap;
    });

    logger.info(`CendiaAcademy: Found ${gaps.length} skill gaps for profile ${profileId}`);
    return gaps;
  }

  // ---------------------------------------------------------------------------
  // LEARNING PATH GENERATION
  // ---------------------------------------------------------------------------

  async recommendLearningPath(skill: string, currentLevel: number, targetLevel: number): Promise<LearningPath> {
    const existingPath = Array.from(this.paths.values()).find(
      p => p.targetSkill === skill && 
           this.getDifficulty(currentLevel) === p.difficulty
    );

    if (existingPath) return existingPath;

    const difficulty = this.getDifficulty(currentLevel);
    const estimatedHours = Math.ceil((targetLevel - currentLevel) / 10) * 2;

    const prompt = `You are CendiaAcademy™, an AI learning system.

Generate a learning path for: ${skill}
Current Level: ${currentLevel}%
Target Level: ${targetLevel}%
Difficulty: ${difficulty}

Provide a structured learning path in JSON:
{
  "name": "path name",
  "description": "path description",
  "modules": [
    {
      "title": "module title",
      "description": "brief description",
      "type": "video|reading|interactive|exercise|quiz|project|mentoring",
      "duration": minutes,
      "resources": ["resource 1"],
      "mandatory": boolean
    }
  ],
  "prerequisites": ["prerequisite 1"],
  "outcomes": ["outcome 1"],
  "completionCriteria": "criteria description"
}`;

    let pathData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('learning') });
        pathData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaAcademy: AI path generation unavailable');
    }

    const path: LearningPath = {
      id: `path-${Date.now()}`,
      name: pathData.name || `${skill} ${difficulty} Path`,
      description: pathData.description || `Develop ${skill} skills from ${currentLevel}% to ${targetLevel}%`,
      targetSkill: skill,
      duration: estimatedHours,
      difficulty,
      modules: (pathData.modules || this.generateDefaultModules(skill, difficulty)).map((m: any, i: number) => ({
        ...m,
        id: `mod-${Date.now()}-${i}`,
        order: i + 1,
        status: i === 0 ? 'available' : 'locked',
      })),
      prerequisites: pathData.prerequisites || [],
      outcomes: pathData.outcomes || [`Achieve ${targetLevel}% proficiency in ${skill}`],
      completionCriteria: pathData.completionCriteria || 'Complete all mandatory modules and pass final assessment',
    };

    this.paths.set(path.id, path);
    return path;
  }

  private getDifficulty(level: number): LearningPath['difficulty'] {
    if (level < 25) return 'beginner';
    if (level < 50) return 'intermediate';
    if (level < 75) return 'advanced';
    return 'expert';
  }

  private generateDefaultModules(skill: string, _difficulty: string): Partial<LearningModule>[] {
    return [
      {
        title: `Introduction to ${skill}`,
        description: 'Foundation concepts and terminology',
        type: 'video',
        duration: 30,
        resources: ['Introduction guide'],
        mandatory: true,
      },
      {
        title: `${skill} Core Concepts`,
        description: 'Deep dive into fundamental principles',
        type: 'reading',
        duration: 45,
        resources: ['Core concepts documentation'],
        mandatory: true,
      },
      {
        title: `${skill} Practice Exercises`,
        description: 'Hands-on practice with guided exercises',
        type: 'exercise',
        duration: 60,
        resources: ['Exercise workbook'],
        mandatory: true,
      },
      {
        title: `${skill} Assessment`,
        description: 'Test your understanding',
        type: 'quiz',
        duration: 20,
        resources: [],
        mandatory: true,
      },
    ];
  }

  // ---------------------------------------------------------------------------
  // MICRO-LEARNING / JUST-IN-TIME
  // ---------------------------------------------------------------------------

  async generateMicroCourse(skill: string, context?: string): Promise<MicroCourse> {
    const prompt = `You are CendiaAcademy™, generating a micro-learning course.

SKILL: ${skill}
CONTEXT: ${context || 'General skill development'}

Generate a 5-10 minute micro-course in JSON:
{
  "title": "engaging title",
  "content": "main learning content (2-3 paragraphs)",
  "keyTakeaways": ["takeaway 1", "takeaway 2", "takeaway 3"],
  "format": "video|interactive|reading|exercise|quiz"
}`;

    let courseData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('learning') });
        courseData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaAcademy: AI micro-course generation unavailable');
    }

    const course: MicroCourse = {
      id: `micro-${Date.now()}`,
      title: courseData.title || `Quick Tips: ${skill}`,
      skill,
      duration: 7,
      format: courseData.format || 'interactive',
      content: courseData.content || `Learn the essentials of ${skill} in this quick session.`,
      keyTakeaways: courseData.keyTakeaways || [`Understand ${skill} basics`, 'Apply immediately'],
      context,
      effectiveness: 0,
      completions: 0,
      avgScore: 0,
      generatedAt: new Date(),
    };

    this.microCourses.set(course.id, course);
    logger.info(`CendiaAcademy: Generated micro-course - ${course.title}`);
    return course;
  }

  async injectJustInTime(employeeId: string, trigger: string, skill: string): Promise<JustInTimeIntervention | null> {
    const profile = this.getProfileByEmployee(employeeId);
    if (!profile) return null;

    // Check if skill needs improvement
    const skillData = profile.skills.find(s => s.name === skill);
    if (skillData && skillData.currentLevel >= skillData.targetLevel) {
      return null; // No intervention needed
    }

    const course = await this.generateMicroCourse(skill, trigger);

    const intervention: JustInTimeIntervention = {
      id: `jit-${Date.now()}`,
      employeeId,
      trigger,
      skill,
      content: course,
      deliveredAt: new Date(),
      engagementStatus: 'pending',
    };

    const interventions = this.interventions.get(employeeId) || [];
    interventions.push(intervention);
    this.interventions.set(employeeId, interventions);

    logger.info(`CendiaAcademy: Just-in-time intervention delivered to ${profile.name} for ${skill}`);
    return intervention;
  }

  recordInterventionEngagement(interventionId: string, status: JustInTimeIntervention['engagementStatus'], feedback?: string): JustInTimeIntervention | null {
    for (const interventions of this.interventions.values()) {
      const intervention = interventions.find(i => i.id === interventionId);
      if (intervention) {
        intervention.engagementStatus = status;
        intervention.feedback = feedback;
        if (status === 'completed') {
          intervention.completedAt = new Date();
          intervention.content.completions++;
        }
        return intervention;
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // TEAM SKILL MATRIX
  // ---------------------------------------------------------------------------

  async analyzeTeamSkills(teamId: string, teamName: string, memberIds: string[]): Promise<TeamSkillMatrix> {
    const members = memberIds
      .map(id => this.getProfileByEmployee(id))
      .filter((p): p is EmployeeSkillProfile => p !== null);

    if (members.length === 0) {
      throw new Error('No team members found');
    }

    // Collect all unique skills
    const allSkills = new Set<string>();
    members.forEach(m => m.skills.forEach(s => allSkills.add(s.name)));

    // Calculate coverage for each skill
    const skillCoverage = Array.from(allSkills).map(skillName => {
      const membersWithSkill = members.filter(m => {
        const skill = m.skills.find(s => s.name === skillName);
        return skill && skill.currentLevel >= 70;
      });
      const coverage = (membersWithSkill.length / members.length) * 100;
      return {
        skill: skillName,
        coverage,
        gap: coverage < 30,
      };
    });

    // Find strengths and gaps
    const strengthAreas = skillCoverage
      .filter(s => s.coverage >= 70)
      .map(s => s.skill);
    
    const developmentPriorities = skillCoverage
      .filter(s => s.gap)
      .map(s => s.skill);

    // Succession risk analysis
    const successionRisks = this.analyzeSuccessionRisks(members);

    const matrix: TeamSkillMatrix = {
      teamId,
      teamName,
      members,
      skillCoverage,
      strengthAreas,
      developmentPriorities,
      successionRisks,
      recommendations: [
        developmentPriorities.length > 0 
          ? `Priority: Develop team capabilities in ${developmentPriorities.slice(0, 3).join(', ')}`
          : 'Team skills are well-balanced',
        successionRisks.some(r => r.riskLevel === 'critical')
          ? 'Critical: Address succession gaps for key roles'
          : 'Succession planning is adequate',
      ],
    };

    logger.info(`CendiaAcademy: Team skill matrix generated for ${teamName}`);
    return matrix;
  }

  private analyzeSuccessionRisks(members: EmployeeSkillProfile[]): SuccessionRisk[] {
    const risks: SuccessionRisk[] = [];
    const seniorRoles = members.filter(m => m.level === 'lead' || m.level === 'senior');

    for (const senior of seniorRoles) {
      const potentialSuccessors = members.filter(m => 
        m.id !== senior.id && 
        (m.level === 'mid' || m.level === 'senior') &&
        m.department === senior.department
      );

      const readyNow = potentialSuccessors.filter(p => {
        const skillOverlap = senior.skills.filter(ss => 
          p.skills.some(ps => ps.name === ss.name && ps.currentLevel >= ss.currentLevel * 0.8)
        );
        return skillOverlap.length >= senior.skills.length * 0.7;
      });

      const readyInOneYear = potentialSuccessors.filter(p => {
        const skillOverlap = senior.skills.filter(ss => 
          p.skills.some(ps => ps.name === ss.name && ps.currentLevel >= ss.currentLevel * 0.5)
        );
        return skillOverlap.length >= senior.skills.length * 0.5;
      });

      risks.push({
        role: senior.role,
        currentHolder: senior.name,
        readyNow: readyNow.map(r => r.name),
        readyInOneYear: readyInOneYear.map(r => r.name).filter(n => !readyNow.map(r => r.name).includes(n)),
        noSuccessor: readyNow.length === 0 && readyInOneYear.length === 0,
        riskLevel: readyNow.length > 0 ? 'low' : readyInOneYear.length > 0 ? 'medium' : 'critical',
        developmentPlan: readyInOneYear.length > 0 
          ? `Accelerate development for ${readyInOneYear[0]?.name || 'candidate'}`
          : undefined,
      });
    }

    return risks;
  }

  // ---------------------------------------------------------------------------
  // ANALYTICS
  // ---------------------------------------------------------------------------

  getLearningAnalytics(period: string = 'monthly'): LearningAnalytics {
    const profiles = Array.from(this.profiles.values());
    const interventions = Array.from(this.interventions.values()).flat();

    const completedInterventions = interventions.filter(i => i.engagementStatus === 'completed');
    const totalHours = completedInterventions.reduce((sum, i) => sum + i.content.duration / 60, 0);

    // Aggregate by skill
    const skillHours: Record<string, number> = {};
    completedInterventions.forEach(i => {
      skillHours[i.skill] = (skillHours[i.skill] || 0) + i.content.duration / 60;
    });

    const topSkills = Object.entries(skillHours)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill, hours]) => ({ skill, hours }));

    // Aggregate by department
    const deptStats: Record<string, { hours: number; completed: number; total: number }> = {};
    profiles.forEach(p => {
      const empInterventions = interventions.filter(i => i.employeeId === p.employeeId);
      if (!deptStats[p.department]) {
        deptStats[p.department] = { hours: 0, completed: 0, total: 0 };
      }
      deptStats[p.department].total += empInterventions.length;
      deptStats[p.department].completed += empInterventions.filter(i => i.engagementStatus === 'completed').length;
      deptStats[p.department].hours += empInterventions
        .filter(i => i.engagementStatus === 'completed')
        .reduce((sum, i) => sum + i.content.duration / 60, 0);
    });

    const byDepartment = Object.entries(deptStats).map(([dept, stats]) => ({
      department: dept,
      hours: stats.hours,
      completion: stats.total > 0 ? (stats.completed / stats.total) * 100 : 0,
    }));

    return {
      period,
      totalLearningHours: Math.round(totalHours),
      coursesCompleted: completedInterventions.length,
      skillsImproved: Object.keys(skillHours).length,
      averageScore: 75, // Would calculate from assessments
      engagementRate: interventions.length > 0 
        ? (completedInterventions.length / interventions.length) * 100 
        : 0,
      topSkillsLearned: topSkills,
      completionRate: interventions.length > 0 
        ? (completedInterventions.length / interventions.length) * 100 
        : 0,
      byDepartment,
      roi: {
        investmentCost: totalHours * 50, // Estimated cost per hour
        productivityGain: totalHours * 100, // Estimated productivity value
        retentionImpact: profiles.length * 500, // Retention value
        performanceImprovement: 15,
        estimatedReturn: totalHours * 150,
        roiPercentage: totalHours > 0 ? ((totalHours * 150) / (totalHours * 50) - 1) * 100 : 0,
      },
    };
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
      logger.warn('CendiaAcademy: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalProfiles: number;
    avgSkillLevel: number;
    activeGaps: number;
    interventionsDelivered: number;
    completionRate: number;
  } {
    const profiles = Array.from(this.profiles.values());
    const allInterventions = Array.from(this.interventions.values()).flat();
    
    let totalSkillLevel = 0;
    let skillCount = 0;
    let gapCount = 0;

    profiles.forEach(p => {
      p.skills.forEach(s => {
        totalSkillLevel += s.currentLevel;
        skillCount++;
        if (s.currentLevel < s.targetLevel) gapCount++;
      });
    });

    const completed = allInterventions.filter(i => i.engagementStatus === 'completed').length;

    return {
      totalProfiles: profiles.length,
      avgSkillLevel: skillCount > 0 ? Math.round(totalSkillLevel / skillCount) : 0,
      activeGaps: gapCount,
      interventionsDelivered: allInterventions.length,
      completionRate: allInterventions.length > 0 
        ? Math.round((completed / allInterventions.length) * 100) 
        : 0,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Skill Gap Intelligence Dashboard */
  getSkillGapIntelligence(): {
    totalGaps: number;
    criticalGaps: number;
    gapsByDepartment: Array<{ department: string; gapCount: number; avgDeficit: number; criticalCount: number }>;
    gapsBySkill: Array<{ skill: string; affectedEmployees: number; avgDeficit: number; priority: string }>;
    closingRate: number;
    estimatedClosureWeeks: number;
    insights: string[];
  } {
    const profiles = Array.from(this.profiles.values());
    const allInterventions = Array.from(this.interventions.values()).flat();
    const deptMap: Record<string, { gaps: number; deficit: number; critical: number }> = {};
    const skillMap: Record<string, { employees: number; deficit: number; priority: string }> = {};
    let totalGaps = 0;
    let criticalGaps = 0;
    let totalDeficit = 0;

    for (const p of profiles) {
      for (const s of p.skills) {
        if (s.currentLevel < s.targetLevel) {
          totalGaps++;
          const deficit = s.targetLevel - s.currentLevel;
          totalDeficit += deficit;
          if (s.priority === 'critical') criticalGaps++;

          if (!deptMap[p.department]) deptMap[p.department] = { gaps: 0, deficit: 0, critical: 0 };
          deptMap[p.department].gaps++;
          deptMap[p.department].deficit += deficit;
          if (s.priority === 'critical') deptMap[p.department].critical++;

          if (!skillMap[s.name]) skillMap[s.name] = { employees: 0, deficit: 0, priority: s.priority };
          skillMap[s.name].employees++;
          skillMap[s.name].deficit += deficit;
        }
      }
    }

    const gapsByDepartment = Object.entries(deptMap)
      .map(([dept, d]) => ({ department: dept, gapCount: d.gaps, avgDeficit: Math.round(d.deficit / d.gaps), criticalCount: d.critical }))
      .sort((a, b) => b.criticalCount - a.criticalCount || b.gapCount - a.gapCount);

    const gapsBySkill = Object.entries(skillMap)
      .map(([skill, d]) => ({ skill, affectedEmployees: d.employees, avgDeficit: Math.round(d.deficit / d.employees), priority: d.priority }))
      .sort((a, b) => b.affectedEmployees - a.affectedEmployees);

    const completedRecently = allInterventions.filter(i => i.engagementStatus === 'completed').length;
    const closingRate = profiles.length > 0 ? Math.round((completedRecently / Math.max(1, totalGaps)) * 100) : 0;
    const estimatedClosureWeeks = totalGaps > 0 && completedRecently > 0
      ? Math.ceil(totalGaps / Math.max(1, completedRecently / 4))
      : totalGaps > 0 ? 52 : 0;

    const insights: string[] = [];
    if (criticalGaps > 0) insights.push(`${criticalGaps} critical skill gaps require immediate attention`);
    if (gapsByDepartment[0]?.criticalCount > 2) insights.push(`${gapsByDepartment[0].department} has the highest concentration of critical gaps`);
    if (gapsBySkill[0]?.affectedEmployees > 3) insights.push(`"${gapsBySkill[0].skill}" is the most widespread gap across ${gapsBySkill[0].affectedEmployees} employees`);
    if (closingRate > 50) insights.push('Gap closure rate is strong — maintain current learning velocity');
    if (insights.length === 0) insights.push('Skill development is on track with no critical gaps');

    return { totalGaps, criticalGaps, gapsByDepartment, gapsBySkill, closingRate, estimatedClosureWeeks, insights };
  }

  /** 10/10: Learning ROI Analytics */
  getLearningROIAnalytics(): {
    totalInvestment: number;
    estimatedReturn: number;
    roiPercentage: number;
    byDepartment: Array<{ department: string; investment: number; return: number; roi: number; hoursInvested: number }>;
    bySkillCategory: Array<{ category: string; investment: number; skillImprovement: number; employeesImpacted: number }>;
    costPerSkillPoint: number;
    productivityGainEstimate: number;
    retentionImpactEstimate: number;
  } {
    const profiles = Array.from(this.profiles.values());
    const allInterventions = Array.from(this.interventions.values()).flat();
    const completed = allInterventions.filter(i => i.engagementStatus === 'completed');
    const totalHours = completed.reduce((sum, i) => sum + i.content.duration / 60, 0);
    const costPerHour = 50;
    const totalInvestment = totalHours * costPerHour;
    const productivityGain = totalHours * 100;
    const retentionImpact = profiles.length * 500;
    const estimatedReturn = productivityGain + retentionImpact;
    const roiPercentage = totalInvestment > 0 ? Math.round(((estimatedReturn - totalInvestment) / totalInvestment) * 100) : 0;

    const deptData: Record<string, { hours: number; completed: number }> = {};
    const catData: Record<string, { hours: number; improvement: number; employees: Set<string> }> = {};

    for (const p of profiles) {
      const empInterventions = completed.filter(i => i.employeeId === p.employeeId);
      const hours = empInterventions.reduce((sum, i) => sum + i.content.duration / 60, 0);
      if (!deptData[p.department]) deptData[p.department] = { hours: 0, completed: 0 };
      deptData[p.department].hours += hours;
      deptData[p.department].completed += empInterventions.length;

      for (const s of p.skills) {
        if (!catData[s.category]) catData[s.category] = { hours: 0, improvement: 0, employees: new Set() };
        catData[s.category].improvement += Math.max(0, s.currentLevel - 50); // Improvement above baseline
        catData[s.category].employees.add(p.employeeId);
      }
    }

    const byDepartment = Object.entries(deptData).map(([dept, d]) => ({
      department: dept, investment: d.hours * costPerHour, return: d.hours * 150,
      roi: d.hours > 0 ? Math.round(((d.hours * 150 - d.hours * costPerHour) / (d.hours * costPerHour)) * 100) : 0,
      hoursInvested: Math.round(d.hours),
    }));

    const bySkillCategory = Object.entries(catData).map(([cat, d]) => ({
      category: cat, investment: d.hours * costPerHour, skillImprovement: Math.round(d.improvement / Math.max(1, d.employees.size)),
      employeesImpacted: d.employees.size,
    }));

    let totalSkillPoints = 0;
    profiles.forEach(p => p.skills.forEach(s => { totalSkillPoints += s.currentLevel; }));
    const costPerSkillPoint = totalInvestment > 0 && totalSkillPoints > 0 ? Math.round(totalInvestment / totalSkillPoints) : 0;

    return { totalInvestment, estimatedReturn, roiPercentage, byDepartment, bySkillCategory, costPerSkillPoint, productivityGainEstimate: productivityGain, retentionImpactEstimate: retentionImpact };
  }

  /** 10/10: Certification Compliance Monitor */
  getCertificationCompliance(): {
    totalCertifications: number;
    activeCertifications: number;
    expiringSoon: Array<{ employeeName: string; department: string; certName: string; expirationDate: Date; daysRemaining: number }>;
    expired: Array<{ employeeName: string; department: string; certName: string; expiredDate: Date }>;
    complianceRate: number;
    byDepartment: Array<{ department: string; total: number; active: number; expiring: number; expired: number; complianceRate: number }>;
    renewalCost: number;
    insights: string[];
  } {
    const profiles = Array.from(this.profiles.values());
    const now = Date.now();
    let totalCerts = 0; let activeCerts = 0;
    const expiringSoon: Array<{ employeeName: string; department: string; certName: string; expirationDate: Date; daysRemaining: number }> = [];
    const expired: Array<{ employeeName: string; department: string; certName: string; expiredDate: Date }> = [];
    const deptMap: Record<string, { total: number; active: number; expiring: number; expired: number }> = {};

    for (const p of profiles) {
      if (!deptMap[p.department]) deptMap[p.department] = { total: 0, active: 0, expiring: 0, expired: 0 };
      for (const c of p.certifications) {
        totalCerts++;
        deptMap[p.department].total++;
        if (c.status === 'active') { activeCerts++; deptMap[p.department].active++; }
        if (c.status === 'expired') {
          deptMap[p.department].expired++;
          expired.push({ employeeName: p.name, department: p.department, certName: c.name, expiredDate: c.expirationDate || new Date() });
        }
        if (c.expirationDate && c.status !== 'expired') {
          const daysRemaining = Math.ceil((c.expirationDate.getTime() - now) / (24 * 60 * 60 * 1000));
          if (daysRemaining <= 30 && daysRemaining > 0) {
            deptMap[p.department].expiring++;
            expiringSoon.push({ employeeName: p.name, department: p.department, certName: c.name, expirationDate: c.expirationDate, daysRemaining });
          }
        }
      }
    }

    const complianceRate = totalCerts > 0 ? Math.round((activeCerts / totalCerts) * 100) : 100;
    const byDepartment = Object.entries(deptMap).map(([dept, d]) => ({
      department: dept, ...d, complianceRate: d.total > 0 ? Math.round((d.active / d.total) * 100) : 100,
    }));

    const renewalCost = (expiringSoon.length + expired.length) * 500; // Estimated per cert
    const insights: string[] = [];
    if (expired.length > 0) insights.push(`${expired.length} expired certification(s) require immediate renewal`);
    if (expiringSoon.length > 0) insights.push(`${expiringSoon.length} certification(s) expiring within 30 days`);
    if (complianceRate >= 95) insights.push('Certification compliance is excellent');
    if (insights.length === 0) insights.push('All certifications are current');

    return { totalCertifications: totalCerts, activeCertifications: activeCerts, expiringSoon: expiringSoon.sort((a, b) => a.daysRemaining - b.daysRemaining), expired, complianceRate, byDepartment, renewalCost, insights };
  }

  /** 10/10: Workforce Readiness Index */
  getWorkforceReadinessIndex(): {
    overallReadiness: number;
    byDepartment: Array<{ department: string; readiness: number; headcount: number; avgSkillLevel: number; gapCount: number; successionCoverage: number }>;
    byLevel: Array<{ level: string; readiness: number; headcount: number; avgSkillLevel: number }>;
    criticalRolesCovered: number;
    criticalRolesTotal: number;
    topStrengths: Array<{ skill: string; avgLevel: number; employeeCount: number }>;
    topWeaknesses: Array<{ skill: string; avgLevel: number; targetLevel: number; deficit: number }>;
    readinessTrend: 'improving' | 'stable' | 'declining';
    insights: string[];
  } {
    const profiles = Array.from(this.profiles.values());
    const deptMap: Record<string, { readiness: number[]; skills: number[]; gaps: number; headcount: number }> = {};
    const levelMap: Record<string, { readiness: number[]; skills: number[]; headcount: number }> = {};
    const skillAgg: Record<string, { levels: number[]; targets: number[] }> = {};

    for (const p of profiles) {
      const avgSkill = p.skills.length > 0 ? p.skills.reduce((s, sk) => s + sk.currentLevel, 0) / p.skills.length : 50;
      const gaps = p.skills.filter(s => s.currentLevel < s.targetLevel).length;
      const certCompliance = p.certifications.length > 0 ? p.certifications.filter(c => c.status === 'active').length / p.certifications.length : 1;
      const goalProgress = p.goals.length > 0 ? p.goals.reduce((s, g) => s + g.progress, 0) / p.goals.length : 50;
      const readiness = Math.round(avgSkill * 0.4 + certCompliance * 100 * 0.3 + goalProgress * 0.3);

      if (!deptMap[p.department]) deptMap[p.department] = { readiness: [], skills: [], gaps: 0, headcount: 0 };
      deptMap[p.department].readiness.push(readiness);
      deptMap[p.department].skills.push(avgSkill);
      deptMap[p.department].gaps += gaps;
      deptMap[p.department].headcount++;

      if (!levelMap[p.level]) levelMap[p.level] = { readiness: [], skills: [], headcount: 0 };
      levelMap[p.level].readiness.push(readiness);
      levelMap[p.level].skills.push(avgSkill);
      levelMap[p.level].headcount++;

      for (const s of p.skills) {
        if (!skillAgg[s.name]) skillAgg[s.name] = { levels: [], targets: [] };
        skillAgg[s.name].levels.push(s.currentLevel);
        skillAgg[s.name].targets.push(s.targetLevel);
      }
    }

    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;
    const overallReadiness = profiles.length > 0
      ? avg(Object.values(deptMap).flatMap(d => d.readiness))
      : 0;

    const byDepartment = Object.entries(deptMap).map(([dept, d]) => ({
      department: dept, readiness: avg(d.readiness), headcount: d.headcount, avgSkillLevel: avg(d.skills),
      gapCount: d.gaps, successionCoverage: d.headcount > 1 ? Math.min(100, Math.round(((d.headcount - 1) / d.headcount) * 100)) : 0,
    })).sort((a, b) => b.readiness - a.readiness);

    const byLevel = Object.entries(levelMap).map(([level, d]) => ({
      level, readiness: avg(d.readiness), headcount: d.headcount, avgSkillLevel: avg(d.skills),
    }));

    const skillEntries = Object.entries(skillAgg).map(([skill, d]) => ({
      skill, avgLevel: avg(d.levels), avgTarget: avg(d.targets), deficit: avg(d.targets) - avg(d.levels), count: d.levels.length,
    }));
    const topStrengths = skillEntries.filter(s => s.avgLevel >= s.avgTarget).sort((a, b) => b.avgLevel - a.avgLevel).slice(0, 5)
      .map(s => ({ skill: s.skill, avgLevel: s.avgLevel, employeeCount: s.count }));
    const topWeaknesses = skillEntries.filter(s => s.deficit > 0).sort((a, b) => b.deficit - a.deficit).slice(0, 5)
      .map(s => ({ skill: s.skill, avgLevel: s.avgLevel, targetLevel: s.avgTarget, deficit: s.deficit }));

    const seniorRoles = profiles.filter(p => p.level === 'lead' || p.level === 'executive');
    const coveredRoles = seniorRoles.filter(sr => profiles.some(p => p.id !== sr.id && p.department === sr.department && (p.level === 'senior' || p.level === 'mid')));

    const improving = profiles.filter(p => p.skills.some(s => s.trend === 'improving')).length;
    const declining = profiles.filter(p => p.skills.some(s => s.trend === 'declining')).length;
    const readinessTrend: 'improving' | 'stable' | 'declining' = improving > declining * 2 ? 'improving' : declining > improving * 2 ? 'declining' : 'stable';

    const insights: string[] = [];
    if (overallReadiness >= 80) insights.push('Workforce readiness is strong across the organization');
    if (overallReadiness < 60) insights.push('Workforce readiness requires attention — increase learning investment');
    if (topWeaknesses.length > 0) insights.push(`Biggest skill gap: "${topWeaknesses[0].skill}" (${topWeaknesses[0].deficit}pt deficit)`);
    if (coveredRoles.length < seniorRoles.length) insights.push(`${seniorRoles.length - coveredRoles.length} critical roles lack succession candidates`);
    if (insights.length === 0) insights.push('Workforce development metrics are within expected ranges');

    return {
      overallReadiness, byDepartment, byLevel, criticalRolesCovered: coveredRoles.length, criticalRolesTotal: seniorRoles.length,
      topStrengths, topWeaknesses, readinessTrend, insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaAcademy', recordType: 'skill_profile', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.profiles.has(d.id)) this.profiles.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaAcademy', recordType: 'skill_profile', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.paths.has(d.id)) this.paths.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaAcademy', recordType: 'skill_profile', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.microCourses.has(d.id)) this.microCourses.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaAcademy', recordType: 'skill_profile', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this.interventions.has(d.id)) this.interventions.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaAcademyService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaAcademyService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaAcademy',
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
      service: 'CendiaAcademy',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaAcademyService = new CendiaAcademyService();
