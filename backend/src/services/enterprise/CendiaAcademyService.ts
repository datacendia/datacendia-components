// =============================================================================
// CENDIAACADEMY™ - LEARNING & DEVELOPMENT INTELLIGENCE
// "The Personalized Tutor" - AI-powered adaptive learning and skill development
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

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
  }

  // ---------------------------------------------------------------------------
  // SKILL PROFILE MANAGEMENT
  // ---------------------------------------------------------------------------

  createProfile(profile: Omit<EmployeeSkillProfile, 'id' | 'assessments' | 'createdAt' | 'updatedAt'>): EmployeeSkillProfile {
    const newProfile: EmployeeSkillProfile = {
      ...profile,
      id: `profile-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      assessments: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.profiles.set(newProfile.id, newProfile);
    this.interventions.set(newProfile.employeeId, []);
    
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

  private generateDefaultModules(skill: string, difficulty: string): Partial<LearningModule>[] {
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
}

// Export singleton instance
export const cendiaAcademyService = new CendiaAcademyService();
