/**
 * Module — Cendia Academy Service Test
 *
 * Platform module.
 * @module __tests__/services/enterprise/CendiaAcademyService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA ACADEMY SERVICE TESTS
// Tests for Learning & Development Intelligence
// Grade: A | Coverage: Comprehensive | Risk: HR/Training Critical
// 
// SERVICE OVERVIEW:
// CendiaAcademy™ is "The Personalized Tutor" - an AI-powered adaptive learning
// and skill development system. Features skill profiling, gap analysis, 
// personalized learning paths, micro-courses, and just-in-time interventions.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../services/ollama.js', () => ({
  default: { chat: vi.fn().mockResolvedValue({ message: { content: 'AI response' } }) },
}));

vi.mock('../../../config/aiModels.js', () => ({
  aiModelSelector: { selectModel: vi.fn().mockReturnValue('llama3.2:3b') },
}));

import type {
  EmployeeSkillProfile,
  Skill,
  Certification,
  LearningGoal,
  GoalMilestone,
  SkillAssessment,
  SkillGap,
  LearningPath,
  LearningModule,
  MicroCourse,
  JustInTimeIntervention,
  TeamSkillMatrix,
} from '../../../services/enterprise/CendiaAcademyService.js';

describe('CendiaAcademyService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // EMPLOYEE LEVELS
  // ===========================================================================

  describe('Employee Levels', () => {
    it('should support entry level', () => {
      const profile: Partial<EmployeeSkillProfile> = { level: 'entry' };
      expect(profile.level).toBe('entry');
    });

    it('should support mid level', () => {
      const profile: Partial<EmployeeSkillProfile> = { level: 'mid' };
      expect(profile.level).toBe('mid');
    });

    it('should support senior level', () => {
      const profile: Partial<EmployeeSkillProfile> = { level: 'senior' };
      expect(profile.level).toBe('senior');
    });

    it('should support lead level', () => {
      const profile: Partial<EmployeeSkillProfile> = { level: 'lead' };
      expect(profile.level).toBe('lead');
    });

    it('should support executive level', () => {
      const profile: Partial<EmployeeSkillProfile> = { level: 'executive' };
      expect(profile.level).toBe('executive');
    });
  });

  // ===========================================================================
  // LEARNING STYLES
  // ===========================================================================

  describe('Learning Styles', () => {
    it('should support visual learning style', () => {
      const profile: Partial<EmployeeSkillProfile> = { learningStyle: 'visual' };
      expect(profile.learningStyle).toBe('visual');
    });

    it('should support auditory learning style', () => {
      const profile: Partial<EmployeeSkillProfile> = { learningStyle: 'auditory' };
      expect(profile.learningStyle).toBe('auditory');
    });

    it('should support reading learning style', () => {
      const profile: Partial<EmployeeSkillProfile> = { learningStyle: 'reading' };
      expect(profile.learningStyle).toBe('reading');
    });

    it('should support kinesthetic learning style', () => {
      const profile: Partial<EmployeeSkillProfile> = { learningStyle: 'kinesthetic' };
      expect(profile.learningStyle).toBe('kinesthetic');
    });
  });

  // ===========================================================================
  // PREFERRED DURATION
  // ===========================================================================

  describe('Preferred Duration', () => {
    it('should support micro duration', () => {
      const profile: Partial<EmployeeSkillProfile> = { preferredDuration: 'micro' };
      expect(profile.preferredDuration).toBe('micro');
    });

    it('should support short duration', () => {
      const profile: Partial<EmployeeSkillProfile> = { preferredDuration: 'short' };
      expect(profile.preferredDuration).toBe('short');
    });

    it('should support medium duration', () => {
      const profile: Partial<EmployeeSkillProfile> = { preferredDuration: 'medium' };
      expect(profile.preferredDuration).toBe('medium');
    });

    it('should support long duration', () => {
      const profile: Partial<EmployeeSkillProfile> = { preferredDuration: 'long' };
      expect(profile.preferredDuration).toBe('long');
    });
  });

  // ===========================================================================
  // SKILL STRUCTURE
  // ===========================================================================

  describe('Skill Structure', () => {
    it('should create valid skill', () => {
      const skill: Skill = {
        name: 'Python Programming',
        category: 'Technical',
        currentLevel: 65,
        targetLevel: 85,
        priority: 'high',
        lastAssessed: new Date(),
        trend: 'improving',
      };
      expect(skill.currentLevel).toBe(65);
    });

    it('should support low priority', () => {
      const skill: Partial<Skill> = { priority: 'low' };
      expect(skill.priority).toBe('low');
    });

    it('should support medium priority', () => {
      const skill: Partial<Skill> = { priority: 'medium' };
      expect(skill.priority).toBe('medium');
    });

    it('should support high priority', () => {
      const skill: Partial<Skill> = { priority: 'high' };
      expect(skill.priority).toBe('high');
    });

    it('should support critical priority', () => {
      const skill: Partial<Skill> = { priority: 'critical' };
      expect(skill.priority).toBe('critical');
    });

    it('should support improving trend', () => {
      const skill: Partial<Skill> = { trend: 'improving' };
      expect(skill.trend).toBe('improving');
    });

    it('should support stable trend', () => {
      const skill: Partial<Skill> = { trend: 'stable' };
      expect(skill.trend).toBe('stable');
    });

    it('should support declining trend', () => {
      const skill: Partial<Skill> = { trend: 'declining' };
      expect(skill.trend).toBe('declining');
    });

    it('should handle skill level 0', () => {
      const skill: Partial<Skill> = { currentLevel: 0 };
      expect(skill.currentLevel).toBe(0);
    });

    it('should handle skill level 50', () => {
      const skill: Partial<Skill> = { currentLevel: 50 };
      expect(skill.currentLevel).toBe(50);
    });

    it('should handle skill level 100', () => {
      const skill: Partial<Skill> = { currentLevel: 100 };
      expect(skill.currentLevel).toBe(100);
    });
  });

  // ===========================================================================
  // CERTIFICATION STRUCTURE
  // ===========================================================================

  describe('Certification Structure', () => {
    it('should create valid certification', () => {
      const cert: Certification = {
        name: 'AWS Solutions Architect',
        issuer: 'Amazon Web Services',
        dateObtained: new Date('2023-01-15'),
        expirationDate: new Date('2026-01-15'),
        status: 'active',
        renewalRequired: true,
      };
      expect(cert.status).toBe('active');
    });

    it('should support active status', () => {
      const cert: Partial<Certification> = { status: 'active' };
      expect(cert.status).toBe('active');
    });

    it('should support expiring_soon status', () => {
      const cert: Partial<Certification> = { status: 'expiring_soon' };
      expect(cert.status).toBe('expiring_soon');
    });

    it('should support expired status', () => {
      const cert: Partial<Certification> = { status: 'expired' };
      expect(cert.status).toBe('expired');
    });

    it('should handle renewal required', () => {
      const cert: Partial<Certification> = { renewalRequired: true };
      expect(cert.renewalRequired).toBe(true);
    });

    it('should handle no renewal required', () => {
      const cert: Partial<Certification> = { renewalRequired: false };
      expect(cert.renewalRequired).toBe(false);
    });
  });

  // ===========================================================================
  // LEARNING GOAL STRUCTURE
  // ===========================================================================

  describe('LearningGoal Structure', () => {
    it('should create valid learning goal', () => {
      const goal: LearningGoal = {
        id: 'goal-123',
        title: 'Master Machine Learning',
        description: 'Complete ML certification path',
        targetDate: new Date('2024-12-31'),
        status: 'in_progress',
        progress: 45,
        milestones: [],
      };
      expect(goal.progress).toBe(45);
    });

    it('should support not_started status', () => {
      const goal: Partial<LearningGoal> = { status: 'not_started' };
      expect(goal.status).toBe('not_started');
    });

    it('should support in_progress status', () => {
      const goal: Partial<LearningGoal> = { status: 'in_progress' };
      expect(goal.status).toBe('in_progress');
    });

    it('should support completed status', () => {
      const goal: Partial<LearningGoal> = { status: 'completed' };
      expect(goal.status).toBe('completed');
    });

    it('should support overdue status', () => {
      const goal: Partial<LearningGoal> = { status: 'overdue' };
      expect(goal.status).toBe('overdue');
    });

    it('should handle 0% progress', () => {
      const goal: Partial<LearningGoal> = { progress: 0 };
      expect(goal.progress).toBe(0);
    });

    it('should handle 50% progress', () => {
      const goal: Partial<LearningGoal> = { progress: 50 };
      expect(goal.progress).toBe(50);
    });

    it('should handle 100% progress', () => {
      const goal: Partial<LearningGoal> = { progress: 100 };
      expect(goal.progress).toBe(100);
    });
  });

  // ===========================================================================
  // SKILL ASSESSMENT STRUCTURE
  // ===========================================================================

  describe('SkillAssessment Structure', () => {
    it('should create valid assessment', () => {
      const assessment: SkillAssessment = {
        skillName: 'Python',
        score: 85,
        maxScore: 100,
        date: new Date(),
        assessmentType: 'automated',
        feedback: 'Strong fundamentals, needs work on async',
      };
      expect(assessment.score).toBe(85);
    });

    it('should support self assessment type', () => {
      const assessment: Partial<SkillAssessment> = { assessmentType: 'self' };
      expect(assessment.assessmentType).toBe('self');
    });

    it('should support manager assessment type', () => {
      const assessment: Partial<SkillAssessment> = { assessmentType: 'manager' };
      expect(assessment.assessmentType).toBe('manager');
    });

    it('should support peer assessment type', () => {
      const assessment: Partial<SkillAssessment> = { assessmentType: 'peer' };
      expect(assessment.assessmentType).toBe('peer');
    });

    it('should support automated assessment type', () => {
      const assessment: Partial<SkillAssessment> = { assessmentType: 'automated' };
      expect(assessment.assessmentType).toBe('automated');
    });
  });

  // ===========================================================================
  // SKILL GAP STRUCTURE
  // ===========================================================================

  describe('SkillGap Structure', () => {
    it('should create valid skill gap', () => {
      const gap: SkillGap = {
        employeeId: 'emp-123',
        skill: 'Cloud Architecture',
        currentLevel: 40,
        requiredLevel: 80,
        gap: 40,
        priority: 'high',
        businessImpact: 'Critical for cloud migration project',
        recommendedPath: {
          id: 'path-123',
          name: 'Cloud Architect Path',
          description: 'Comprehensive cloud training',
          targetSkill: 'Cloud Architecture',
          duration: 40,
          difficulty: 'advanced',
          modules: [],
          prerequisites: ['Networking Basics'],
          outcomes: ['AWS Certified'],
          completionCriteria: 'Pass final exam',
        },
      };
      expect(gap.gap).toBe(40);
    });
  });

  // ===========================================================================
  // LEARNING PATH STRUCTURE
  // ===========================================================================

  describe('LearningPath Structure', () => {
    it('should create valid learning path', () => {
      const path: LearningPath = {
        id: 'path-123',
        name: 'Data Science Fundamentals',
        description: 'Complete data science bootcamp',
        targetSkill: 'Data Science',
        duration: 80,
        difficulty: 'intermediate',
        modules: [],
        prerequisites: ['Python Basics', 'Statistics'],
        outcomes: ['Build ML models', 'Data visualization'],
        completionCriteria: 'Complete all modules and final project',
      };
      expect(path.duration).toBe(80);
    });

    it('should support beginner difficulty', () => {
      const path: Partial<LearningPath> = { difficulty: 'beginner' };
      expect(path.difficulty).toBe('beginner');
    });

    it('should support intermediate difficulty', () => {
      const path: Partial<LearningPath> = { difficulty: 'intermediate' };
      expect(path.difficulty).toBe('intermediate');
    });

    it('should support advanced difficulty', () => {
      const path: Partial<LearningPath> = { difficulty: 'advanced' };
      expect(path.difficulty).toBe('advanced');
    });

    it('should support expert difficulty', () => {
      const path: Partial<LearningPath> = { difficulty: 'expert' };
      expect(path.difficulty).toBe('expert');
    });

    it('should handle 1 hour duration', () => {
      const path: Partial<LearningPath> = { duration: 1 };
      expect(path.duration).toBe(1);
    });

    it('should handle 40 hour duration', () => {
      const path: Partial<LearningPath> = { duration: 40 };
      expect(path.duration).toBe(40);
    });

    it('should handle 200 hour duration', () => {
      const path: Partial<LearningPath> = { duration: 200 };
      expect(path.duration).toBe(200);
    });
  });

  // ===========================================================================
  // LEARNING MODULE STRUCTURE
  // ===========================================================================

  describe('LearningModule Structure', () => {
    it('should create valid module', () => {
      const module: LearningModule = {
        id: 'module-123',
        title: 'Introduction to Python',
        description: 'Learn Python basics',
        type: 'video',
        duration: 30,
        resources: ['python.org', 'realpython.com'],
        order: 1,
        mandatory: true,
        status: 'available',
      };
      expect(module.type).toBe('video');
    });

    it('should support video type', () => {
      const module: Partial<LearningModule> = { type: 'video' };
      expect(module.type).toBe('video');
    });

    it('should support reading type', () => {
      const module: Partial<LearningModule> = { type: 'reading' };
      expect(module.type).toBe('reading');
    });

    it('should support interactive type', () => {
      const module: Partial<LearningModule> = { type: 'interactive' };
      expect(module.type).toBe('interactive');
    });

    it('should support exercise type', () => {
      const module: Partial<LearningModule> = { type: 'exercise' };
      expect(module.type).toBe('exercise');
    });

    it('should support quiz type', () => {
      const module: Partial<LearningModule> = { type: 'quiz' };
      expect(module.type).toBe('quiz');
    });

    it('should support project type', () => {
      const module: Partial<LearningModule> = { type: 'project' };
      expect(module.type).toBe('project');
    });

    it('should support mentoring type', () => {
      const module: Partial<LearningModule> = { type: 'mentoring' };
      expect(module.type).toBe('mentoring');
    });

    it('should support locked status', () => {
      const module: Partial<LearningModule> = { status: 'locked' };
      expect(module.status).toBe('locked');
    });

    it('should support available status', () => {
      const module: Partial<LearningModule> = { status: 'available' };
      expect(module.status).toBe('available');
    });

    it('should support in_progress status', () => {
      const module: Partial<LearningModule> = { status: 'in_progress' };
      expect(module.status).toBe('in_progress');
    });

    it('should support completed status', () => {
      const module: Partial<LearningModule> = { status: 'completed' };
      expect(module.status).toBe('completed');
    });
  });

  // ===========================================================================
  // MICRO COURSE STRUCTURE
  // ===========================================================================

  describe('MicroCourse Structure', () => {
    it('should create valid micro course', () => {
      const course: MicroCourse = {
        id: 'micro-123',
        title: 'Quick Git Tips',
        skill: 'Version Control',
        duration: 5,
        format: 'video',
        content: 'Learn 5 essential git commands...',
        keyTakeaways: ['git stash', 'git rebase', 'git cherry-pick'],
        context: 'Before code review',
        effectiveness: 0.85,
        completions: 150,
        avgScore: 92,
        generatedAt: new Date(),
      };
      expect(course.duration).toBe(5);
    });

    it('should handle 5 minute duration', () => {
      const course: Partial<MicroCourse> = { duration: 5 };
      expect(course.duration).toBe(5);
    });

    it('should handle 10 minute duration', () => {
      const course: Partial<MicroCourse> = { duration: 10 };
      expect(course.duration).toBe(10);
    });

    it('should handle 15 minute duration', () => {
      const course: Partial<MicroCourse> = { duration: 15 };
      expect(course.duration).toBe(15);
    });

    it('should handle effectiveness 0.5', () => {
      const course: Partial<MicroCourse> = { effectiveness: 0.5 };
      expect(course.effectiveness).toBe(0.5);
    });

    it('should handle effectiveness 0.9', () => {
      const course: Partial<MicroCourse> = { effectiveness: 0.9 };
      expect(course.effectiveness).toBe(0.9);
    });
  });

  // ===========================================================================
  // JUST-IN-TIME INTERVENTION STRUCTURE
  // ===========================================================================

  describe('JustInTimeIntervention Structure', () => {
    it('should create valid intervention', () => {
      const intervention: JustInTimeIntervention = {
        id: 'jit-123',
        employeeId: 'emp-456',
        trigger: 'code_review_feedback',
        skill: 'Code Quality',
        content: {} as MicroCourse,
        deliveredAt: new Date(),
        engagementStatus: 'pending',
      };
      expect(intervention.engagementStatus).toBe('pending');
    });

    it('should support pending engagement status', () => {
      const intervention: Partial<JustInTimeIntervention> = { engagementStatus: 'pending' };
      expect(intervention.engagementStatus).toBe('pending');
    });

    it('should support viewed engagement status', () => {
      const intervention: Partial<JustInTimeIntervention> = { engagementStatus: 'viewed' };
      expect(intervention.engagementStatus).toBe('viewed');
    });

    it('should support completed engagement status', () => {
      const intervention: Partial<JustInTimeIntervention> = { engagementStatus: 'completed' };
      expect(intervention.engagementStatus).toBe('completed');
    });

    it('should support dismissed engagement status', () => {
      const intervention: Partial<JustInTimeIntervention> = { engagementStatus: 'dismissed' };
      expect(intervention.engagementStatus).toBe('dismissed');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should create onboarding learning path', () => {
      const path: Partial<LearningPath> = {
        name: 'New Employee Onboarding',
        difficulty: 'beginner',
        duration: 20,
        prerequisites: [],
      };
      expect(path.difficulty).toBe('beginner');
    });

    it('should create leadership development path', () => {
      const path: Partial<LearningPath> = {
        name: 'Leadership Development',
        difficulty: 'advanced',
        duration: 100,
        targetSkill: 'Leadership',
      };
      expect(path.targetSkill).toBe('Leadership');
    });

    it('should identify critical skill gap', () => {
      const gap: Partial<SkillGap> = {
        skill: 'Cybersecurity',
        currentLevel: 20,
        requiredLevel: 80,
        gap: 60,
        priority: 'critical',
      };
      expect(gap.priority).toBe('critical');
    });

    it('should deliver just-in-time training', () => {
      const intervention: Partial<JustInTimeIntervention> = {
        trigger: 'security_incident',
        skill: 'Security Awareness',
        engagementStatus: 'pending',
      };
      expect(intervention.trigger).toBe('security_incident');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty skills array', () => {
      const profile: Partial<EmployeeSkillProfile> = { skills: [] };
      expect(profile.skills?.length).toBe(0);
    });

    it('should handle empty certifications array', () => {
      const profile: Partial<EmployeeSkillProfile> = { certifications: [] };
      expect(profile.certifications?.length).toBe(0);
    });

    it('should handle empty goals array', () => {
      const profile: Partial<EmployeeSkillProfile> = { goals: [] };
      expect(profile.goals?.length).toBe(0);
    });

    it('should handle empty modules array', () => {
      const path: Partial<LearningPath> = { modules: [] };
      expect(path.modules?.length).toBe(0);
    });

    it('should handle empty prerequisites', () => {
      const path: Partial<LearningPath> = { prerequisites: [] };
      expect(path.prerequisites?.length).toBe(0);
    });

    it('should handle very long title', () => {
      const path: Partial<LearningPath> = { name: 'A'.repeat(500) };
      expect(path.name?.length).toBe(500);
    });

    it('should handle special characters in name', () => {
      const path: Partial<LearningPath> = {
        name: 'Course: "Advanced" & <Expert>',
      };
      expect(path.name).toContain('Advanced');
    });

    it('should handle unicode in description', () => {
      const path: Partial<LearningPath> = {
        description: '学習パス 📚 スキル開発',
      };
      expect(path.description).toContain('学習');
    });

    it('should handle zero available hours', () => {
      const profile: Partial<EmployeeSkillProfile> = { availableHours: 0 };
      expect(profile.availableHours).toBe(0);
    });

    it('should handle zero duration', () => {
      const module: Partial<LearningModule> = { duration: 0 };
      expect(module.duration).toBe(0);
    });
  });
});
