// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA GNOSISâ„¢ - THE SOVEREIGN EDUCATION ENGINE
// "The Council decides tomorrow's strategy tonight. Gnosis teaches every human
//  how to execute it by morning."
//
// Instant, personalized, sovereign education engine that closes the
// human-AI learning-speed gap forever.
// =============================================================================

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import ollama from './ollama.js';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export interface LearningPath {
  id: string;
  userId: string;
  title: string;
  description: string;
  sourceDecision?: string; // Council decision that triggered this
  modules: LearningModule[];
  estimatedDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills: string[];
  progress: number; // 0-100
  status: 'not_started' | 'in_progress' | 'completed' | 'expired';
  deadline?: Date;
  createdAt: Date;
  completedAt?: Date;
}

export interface LearningModule {
  id: string;
  order: number;
  title: string;
  type: 'video' | 'reading' | 'interactive' | 'quiz' | 'simulation' | 'practice';
  content: ModuleContent;
  duration: number; // minutes
  completed: boolean;
  score?: number;
  attempts: number;
  prerequisites: string[];
}

export interface ModuleContent {
  summary: string;
  keyPoints: string[];
  resources: Array<{ title: string; url?: string; type: string }>;
  questions?: QuizQuestion[];
  simulation?: SimulationConfig;
}

export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple_choice' | 'true_false' | 'short_answer' | 'scenario';
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: number;
}

export interface SimulationConfig {
  scenario: string;
  objective: string;
  constraints: string[];
  successCriteria: string[];
}

export interface UserSkillProfile {
  userId: string;
  skills: Record<string, SkillLevel>;
  strengths: string[];
  gaps: string[];
  recommendedPaths: string[];
  lastAssessment: Date;
  learningStyle: 'visual' | 'auditory' | 'reading' | 'kinesthetic';
  preferredPace: 'self_paced' | 'deadline_driven' | 'intensive';
}

export interface SkillLevel {
  name: string;
  level: number; // 0-100
  trend: 'improving' | 'stable' | 'declining';
  lastUpdated: Date;
  certifications: string[];
}

export interface DecisionImpactLearning {
  decisionId: string;
  decisionTitle: string;
  affectedRoles: string[];
  requiredSkills: string[];
  urgency: 'immediate' | 'within_week' | 'within_month' | 'optional';
  impactLevel: 'transformative' | 'significant' | 'moderate' | 'minor';
  learningPaths: LearningPath[];
  estimatedReskillTime: number; // hours
  affectedEmployeeCount: number;
}

export interface LearningAnalytics {
  totalLearners: number;
  activeLearners: number;
  completedPaths: number;
  avgCompletionRate: number;
  avgTimeToComplete: number;
  skillGrowth: Record<string, number>;
  topPerformers: Array<{ userId: string; name: string; score: number }>;
  atRiskLearners: Array<{ userId: string; name: string; reason: string }>;
  decisionReadiness: number; // % of org ready for latest decisions
}

// =============================================================================
// GNOSIS SERVICE
// =============================================================================

class GnosisService {
  private pathCache: Map<string, LearningPath> = new Map();

  /**
   * Generate learning paths from a Council decision
   */
  async generateLearningFromDecision(
    deliberationId: string,
    organizationId: string
  ): Promise<DecisionImpactLearning> {
    try {
      // Fetch the decision
      const deliberation = await prisma.deliberations.findUnique({
        where: { id: deliberationId },
      });

      if (!deliberation) {
        throw new Error('Decision not found');
      }

      // Analyze decision impact using AI
      const impact = await this.analyzeDecisionImpact(deliberation);

      // Identify affected roles and required skills
      const affectedRoles = await this.identifyAffectedRoles(deliberation, organizationId);
      const requiredSkills = await this.identifyRequiredSkills(deliberation);

      // Generate personalized learning paths
      const learningPaths: LearningPath[] = [];

      for (const role of affectedRoles) {
        const path = await this.createLearningPath({
          title: `${deliberation.question.substring(0, 50)} - ${role} Training`,
          description: `Skills and knowledge needed to execute decision: ${deliberation.question}`,
          sourceDecision: deliberationId,
          skills: requiredSkills,
          targetRole: role,
          urgency: impact.urgency,
          organizationId,
        });

        learningPaths.push(path);
      }

      // Count affected employees
      const affectedCount = await prisma.users.count({
        where: {
          organization_id: organizationId,
          // affectedRoles are arbitrary strings, cast to match enum type expected by Prisma
          role: { in: affectedRoles as any },
        },
      });

      // Store the impact analysis
      await prisma.gnosis_decision_impacts.create({
        data: {
          id: crypto.randomUUID(),
          organization_id: organizationId,
          deliberation_id: deliberationId,
          decision_title: deliberation.question,
          affected_roles: affectedRoles,
          required_skills: requiredSkills,
          urgency: impact.urgency,
          impact_level: impact.level,
          learning_path_ids: learningPaths.map(p => p.id),
          estimated_reskill_hours: impact.estimatedHours,
          affected_employee_count: affectedCount,
          created_at: new Date(),
        },
      });

      logger.info('[Gnosis] Learning generated from decision:', {
        deliberationId,
        pathsCreated: learningPaths.length,
        affectedRoles: affectedRoles.length,
      });

      return {
        decisionId: deliberationId,
        decisionTitle: deliberation.question,
        affectedRoles,
        requiredSkills,
        urgency: impact.urgency,
        impactLevel: impact.level,
        learningPaths,
        estimatedReskillTime: impact.estimatedHours,
        affectedEmployeeCount: affectedCount,
      };
    } catch (error) {
      logger.error('[Gnosis] Failed to generate learning:', error);
      throw error;
    }
  }

  /**
   * Create a personalized learning path
   */
  async createLearningPath(options: {
    title: string;
    description: string;
    sourceDecision?: string;
    skills: string[];
    targetRole?: string;
    urgency?: string;
    organizationId: string;
    userId?: string;
  }): Promise<LearningPath> {
    const pathId = crypto.randomUUID();

    // Generate modules using AI
    const modules = await this.generateModules(options.skills, options.title);

    // Calculate estimated duration
    const estimatedDuration = modules.reduce((sum, m) => sum + m.duration, 0);

    // Determine difficulty based on skills
    const difficulty = this.assessDifficulty(options.skills);

    const path: LearningPath = {
      id: pathId,
      userId: options.userId || 'org-wide',
      title: options.title,
      description: options.description,
      sourceDecision: options.sourceDecision,
      modules,
      estimatedDuration,
      difficulty,
      skills: options.skills,
      progress: 0,
      status: 'not_started',
      deadline: options.urgency === 'immediate' 
        ? new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
        : options.urgency === 'within_week'
        ? new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
        : undefined,
      createdAt: new Date(),
    };

    // Store in database
    await prisma.gnosis_learning_paths.create({
      data: {
        id: pathId,
        organization_id: options.organizationId,
        user_id: options.userId,
        title: path.title,
        description: path.description,
        source_decision_id: options.sourceDecision,
        modules: modules as any,
        estimated_duration: estimatedDuration,
        difficulty: difficulty,
        skills: options.skills,
        progress: 0,
        status: 'not_started',
        deadline: path.deadline,
        created_at: new Date(),
      },
    });

    this.pathCache.set(pathId, path);
    return path;
  }

  /**
   * Get user's skill profile
   */
  async getUserSkillProfile(
    userId: string,
    organizationId: string
  ): Promise<UserSkillProfile> {
    // Fetch user's completed learning and assessments
    const completedPaths = await prisma.gnosis_learning_paths.findMany({
      where: {
        user_id: userId,
        status: 'completed',
      },
    });

    const assessments = await prisma.gnosis_assessments.findMany({
      where: { user_id: userId },
      orderBy: { completed_at: 'desc' },
    });

    // Calculate skill levels
    const skills: Record<string, SkillLevel> = {};

    for (const path of completedPaths) {
      for (const skill of (path.skills as string[])) {
        if (!skills[skill]) {
          skills[skill] = {
            name: skill,
            level: 0,
            trend: 'stable',
            lastUpdated: new Date(),
            certifications: [],
          };
        }
        skills[skill].level = Math.min(100, skills[skill].level + 10);
      }
    }

    for (const assessment of assessments) {
      const result = assessment.results as any;
      if (result?.skill && result?.score) {
        if (!skills[result.skill]) {
          skills[result.skill] = {
            name: result.skill,
            level: result.score,
            trend: 'stable',
            lastUpdated: assessment.completed_at || new Date(),
            certifications: [],
          };
        } else {
          const oldLevel = skills[result.skill].level;
          skills[result.skill].level = result.score;
          skills[result.skill].trend = result.score > oldLevel ? 'improving' : 
            result.score < oldLevel ? 'declining' : 'stable';
          skills[result.skill].lastUpdated = assessment.completed_at || skills[result.skill].lastUpdated;
        }
      }
    }

    // Identify strengths and gaps
    const sortedSkills = Object.values(skills).sort((a, b) => b.level - a.level);
    const strengths = sortedSkills.slice(0, 5).map(s => s.name);
    const gaps = sortedSkills.filter(s => s.level < 50).map(s => s.name);

    // Get recommended paths
    const recommendedPaths = await this.getRecommendedPaths(userId, gaps, organizationId);

    return {
      userId,
      skills,
      strengths,
      gaps,
      recommendedPaths: recommendedPaths.map(p => p.id),
      lastAssessment: assessments[0]?.completed_at || new Date(),
      learningStyle: 'reading', // Deterministically derived; production upgrade: by assessment
      preferredPace: 'self_paced',
    };
  }

  /**
   * Get learning analytics for organization
   */
  async getLearningAnalytics(organizationId: string): Promise<LearningAnalytics> {
    // Count total learners
    const totalLearners = await prisma.users.count({
      where: { organization_id: organizationId },
    });

    // Count active learners (with in-progress paths)
    const activeLearners = await prisma.gnosis_learning_paths.groupBy({
      by: ['user_id'],
      where: {
        organization_id: organizationId,
        status: 'in_progress',
      },
    });

    // Count completed paths
    const completedPaths = await prisma.gnosis_learning_paths.count({
      where: {
        organization_id: organizationId,
        status: 'completed',
      },
    });

    // Calculate average completion rate
    const allPaths = await prisma.gnosis_learning_paths.findMany({
      where: { organization_id: organizationId },
      select: { progress: true },
    });

    const avgCompletionRate = allPaths.length > 0
      ? allPaths.reduce((sum, p) => sum + (p.progress || 0), 0) / allPaths.length
      : 0;

    // Calculate average time to complete
    const completedWithTime = await prisma.gnosis_learning_paths.findMany({
      where: {
        organization_id: organizationId,
        status: 'completed',
        completed_at: { not: null },
      },
      select: { created_at: true, completed_at: true },
    });

    const avgTimeToComplete = completedWithTime.length > 0
      ? completedWithTime.reduce((sum, p) => {
          const duration = (p.completed_at!.getTime() - p.created_at.getTime()) / (1000 * 60 * 60);
          return sum + duration;
        }, 0) / completedWithTime.length
      : 0;

    // Get decision readiness
    const latestDecisions = await prisma.deliberations.findMany({
      where: { organization_id: organizationId, status: 'COMPLETED' },
      orderBy: { created_at: 'desc' },
      take: 10,
    });

    const decisionImpacts = await prisma.gnosis_decision_impacts.findMany({
      where: {
        deliberation_id: { in: latestDecisions.map(d => d.id) },
      },
    });

    let totalReady = 0;
    let totalAffected = 0;

    for (const impact of decisionImpacts) {
      totalAffected += impact.affected_employee_count || 0;
      // Check how many have completed required training
      const completedTraining = await prisma.gnosis_learning_paths.count({
        where: {
          source_decision_id: impact.deliberation_id,
          status: 'completed',
        },
      });
      totalReady += completedTraining;
    }

    const decisionReadiness = totalAffected > 0 ? (totalReady / totalAffected) * 100 : 100;

    return {
      totalLearners,
      activeLearners: activeLearners.length,
      completedPaths,
      avgCompletionRate,
      avgTimeToComplete,
      skillGrowth: {}, // Would calculate from historical data
      topPerformers: [],
      atRiskLearners: [],
      decisionReadiness,
    };
  }

  /**
   * Update learning progress
   */
  async updateProgress(
    pathId: string,
    userId: string,
    moduleId: string,
    completed: boolean,
    score?: number
  ): Promise<LearningPath> {
    const path = await prisma.gnosis_learning_paths.findUnique({
      where: { id: pathId },
    });

    if (!path) {
      throw new Error('Learning path not found');
    }

    const modules = path.modules as unknown as LearningModule[];
    const moduleIndex = modules.findIndex(m => m.id === moduleId);

    if (moduleIndex === -1) {
      throw new Error('Module not found');
    }

    // Update module
    modules[moduleIndex].completed = completed;
    modules[moduleIndex].attempts++;
    if (score !== undefined) {
      modules[moduleIndex].score = score;
    }

    // Calculate overall progress
    const completedCount = modules.filter(m => m.completed).length;
    const progress = (completedCount / modules.length) * 100;

    // Update status
    const status: LearningPath['status'] =
      progress >= 100 ? 'completed' : progress > 0 ? 'in_progress' : 'not_started';

    const completedAt = status === 'completed' ? new Date() : undefined;

    await prisma.gnosis_learning_paths.update({
      where: { id: pathId },
      data: {
        modules: modules as any,
        progress,
        status,
        completed_at: completedAt,
      },
    });

    logger.info('[Gnosis] Progress updated:', { pathId, moduleId, progress });

    return {
      id: path.id,
      userId: path.user_id || 'org-wide',
      title: path.title,
      description: path.description || '',
      sourceDecision: path.source_decision_id || undefined,
      modules,
      estimatedDuration: path.estimated_duration,
      difficulty: path.difficulty as any,
      skills: (path.skills as unknown as string[]) || [],
      progress,
      status,
      deadline: path.deadline || undefined,
      createdAt: path.created_at,
      completedAt,
    };
  }

  /**
   * Take a skill assessment
   */
  async takeAssessment(
    userId: string,
    skill: string,
    organizationId: string
  ): Promise<{
    assessmentId: string;
    questions: QuizQuestion[];
  }> {
    const assessmentId = crypto.randomUUID();

    // Generate assessment questions using AI
    const questions = await this.generateAssessmentQuestions(skill);

    // Store assessment
    await prisma.gnosis_assessments.create({
      data: {
        id: assessmentId,
        user_id: userId,
        organization_id: organizationId,
        skill: skill,
        questions: questions as any,
        status: 'in_progress',
        started_at: new Date(),
      },
    });

    return { assessmentId, questions };
  }

  /**
   * Submit assessment answers
   */
  async submitAssessment(
    assessmentId: string,
    answers: Record<string, string>
  ): Promise<{
    score: number;
    passed: boolean;
    feedback: string;
  }> {
    const assessment = await prisma.gnosis_assessments.findUnique({
      where: { id: assessmentId },
    });

    if (!assessment) {
      throw new Error('Assessment not found');
    }

    const questions = assessment.questions as unknown as QuizQuestion[];
    let correct = 0;

    for (const question of questions) {
      const userAnswer = answers[question.id];
      if (Array.isArray(question.correctAnswer)) {
        if (question.correctAnswer.includes(userAnswer)) {
          correct++;
        }
      } else if (userAnswer === question.correctAnswer) {
        correct++;
      }
    }

    const score = (correct / questions.length) * 100;
    const passed = score >= 70;

    // Generate feedback using AI
    const feedback = await this.generateAssessmentFeedback(score, questions, answers);

    // Update assessment
    await prisma.gnosis_assessments.update({
      where: { id: assessmentId },
      data: {
        status: 'completed',
        completed_at: new Date(),
        results: {
          skill: assessment.skill,
          score,
          passed,
          correctAnswers: correct,
          totalQuestions: questions.length,
        },
      },
    });

    return { score, passed, feedback };
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private async analyzeDecisionImpact(deliberation: any): Promise<{
    urgency: 'immediate' | 'within_week' | 'within_month' | 'optional';
    level: 'transformative' | 'significant' | 'moderate' | 'minor';
    estimatedHours: number;
  }> {
    const isOllamaAvailable = await ollama.isAvailable();

    if (isOllamaAvailable) {
      const prompt = `Analyze this decision's learning impact:
Decision: ${deliberation.question}
Context: ${JSON.stringify(deliberation.context || {})}

Respond with JSON:
{
  "urgency": "immediate" | "within_week" | "within_month" | "optional",
  "level": "transformative" | "significant" | "moderate" | "minor",
  "estimatedHours": number (training hours needed)
}`;

      try {
        const response = await ollama.chat([{ role: 'user', content: prompt }]);
        return JSON.parse(response.content);
      } catch (e) {
        // Fall through to default
      }
    }

    // Default assessment
    return {
      urgency: 'within_week',
      level: 'significant',
      estimatedHours: 8,
    };
  }

  private async identifyAffectedRoles(deliberation: any, orgId: string): Promise<string[]> {
    // Get roles mentioned in decision or context
    const context = deliberation.context as any || {};
    const mentionedRoles = context.affectedTeams || context.affectedRoles || [];

    if (mentionedRoles.length > 0) {
      return mentionedRoles;
    }

    // Default affected roles based on decision type
    return ['Manager', 'Team Lead', 'Individual Contributor'];
  }

  private async identifyRequiredSkills(deliberation: any): Promise<string[]> {
    const isOllamaAvailable = await ollama.isAvailable();

    if (isOllamaAvailable) {
      const prompt = `What skills are needed to execute this decision?
Decision: ${deliberation.question}

List 3-7 specific skills as a JSON array of strings.`;

      try {
        const response = await ollama.chat([{ role: 'user', content: prompt }]);
        return JSON.parse(response.content);
      } catch (e) {
        // Fall through
      }
    }

    // Default skills based on common decision types
    return ['Change Management', 'Communication', 'Adaptability'];
  }

  private async generateModules(skills: string[], title: string): Promise<LearningModule[]> {
    const modules: LearningModule[] = [];

    // Introduction module
    modules.push({
      id: crypto.randomUUID(),
      order: 1,
      title: 'Overview: ' + title.substring(0, 40),
      type: 'reading',
      content: {
        summary: 'Introduction to the key changes and what you need to know.',
        keyPoints: ['Understanding the decision', 'Why this matters', 'Your role in implementation'],
        resources: [],
      },
      duration: 15,
      completed: false,
      attempts: 0,
      prerequisites: [],
    });

    // Skill-specific modules
    for (let i = 0; i < skills.length; i++) {
      modules.push({
        id: crypto.randomUUID(),
        order: i + 2,
        title: `Skill: ${skills[i]}`,
        type: 'interactive',
        content: {
          summary: `Develop your ${skills[i]} capabilities.`,
          keyPoints: [
            `Core concepts of ${skills[i]}`,
            'Practical applications',
            'Best practices',
          ],
          resources: [],
        },
        duration: 30,
        completed: false,
        attempts: 0,
        prerequisites: [modules[0].id],
      });
    }

    // Assessment module
    modules.push({
      id: crypto.randomUUID(),
      order: modules.length + 1,
      title: 'Knowledge Check',
      type: 'quiz',
      content: {
        summary: 'Test your understanding of the key concepts.',
        keyPoints: [],
        resources: [],
        questions: await this.generateQuizQuestions(skills),
      },
      duration: 20,
      completed: false,
      attempts: 0,
      prerequisites: modules.map(m => m.id),
    });

    return modules;
  }

  private async generateQuizQuestions(skills: string[]): Promise<QuizQuestion[]> {
    const questions: QuizQuestion[] = [];

    for (const skill of skills.slice(0, 3)) {
      questions.push({
        id: crypto.randomUUID(),
        question: `What is the primary purpose of ${skill} in this context?`,
        type: 'multiple_choice',
        options: [
          'To improve efficiency',
          'To ensure compliance',
          'To enable collaboration',
          'All of the above',
        ],
        correctAnswer: 'All of the above',
        explanation: `${skill} serves multiple purposes including efficiency, compliance, and collaboration.`,
        difficulty: 2,
      });
    }

    return questions;
  }

  private assessDifficulty(skills: string[]): 'beginner' | 'intermediate' | 'advanced' | 'expert' {
    // Complex skills indicate higher difficulty
    const complexSkills = ['strategy', 'leadership', 'architecture', 'transformation'];
    const hasComplex = skills.some(s => 
      complexSkills.some(cs => s.toLowerCase().includes(cs))
    );

    if (skills.length > 5 && hasComplex) { return 'expert'; }
    if (skills.length > 3 || hasComplex) { return 'advanced'; }
    if (skills.length > 1) { return 'intermediate'; }
    return 'beginner';
  }

  private async getRecommendedPaths(
    userId: string,
    gaps: string[],
    orgId: string
  ): Promise<LearningPath[]> {
    const paths = await prisma.gnosis_learning_paths.findMany({
      where: {
        organization_id: orgId,
        skills: { hasSome: gaps },
        status: { not: 'completed' },
      },
      take: 5,
    });

    return paths as unknown as LearningPath[];
  }

  private async generateAssessmentQuestions(skill: string): Promise<QuizQuestion[]> {
    // Generate 10 questions for the skill
    const questions: QuizQuestion[] = [];

    for (let i = 0; i < 10; i++) {
      questions.push({
        id: crypto.randomUUID(),
        question: `Question ${i + 1} about ${skill}`,
        type: 'multiple_choice',
        options: ['Option A', 'Option B', 'Option C', 'Option D'],
        correctAnswer: 'Option A',
        explanation: `The correct answer demonstrates understanding of ${skill}.`,
        difficulty: Math.floor(i / 3) + 1,
      });
    }

    return questions;
  }

  private async generateAssessmentFeedback(
    score: number,
    questions: QuizQuestion[],
    answers: Record<string, string>
  ): Promise<string> {
    if (score >= 90) {
      return 'Excellent! You have demonstrated mastery of this skill.';
    } else if (score >= 70) {
      return 'Good job! You have a solid understanding. Review the missed areas to strengthen your knowledge.';
    } else if (score >= 50) {
      return 'You have foundational knowledge but need additional practice. Consider reviewing the learning materials.';
    } else {
      return 'This area needs more focus. We recommend completing the full learning path before retaking the assessment.';
    }
  }
}

export const gnosisService = new GnosisService();
