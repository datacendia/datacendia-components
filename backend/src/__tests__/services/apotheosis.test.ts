// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaApotheosis™ - Unit Tests
 * 
 * Tests for self-improvement loop types and configuration
 */

import { describe, it, expect } from 'vitest';
import {
  DEFAULT_APOTHEOSIS_CONFIG,
} from '../../services/apotheosis/types.js';
import type {
  ApotheosisRun,
  WeaknessItem,
  AutoPatch,
  Escalation,
  UpskillAssignment,
  PatternBan,
  AttackScenario,
  ApotheosisConfig,
  WeaknessSeverity,
  WeaknessCategory,
  PatchType,
  EscalationStatus,
} from '../../services/apotheosis/types.js';

describe('CendiaApotheosis - Type Definitions', () => {
  describe('ApotheosisRun type', () => {
    it('should allow valid run objects', () => {
      const run: ApotheosisRun = {
        id: 'run-1',
        organizationId: 'org-1',
        startedAt: new Date(),
        status: 'running',
        scenariosTested: 100,
        scenariosSurvived: 85,
        survivalRate: 0.85,
        weaknessesFound: [],
        criticalCount: 0,
        highCount: 2,
        mediumCount: 5,
        lowCount: 8,
        autoPatches: [],
        escalations: [],
        upskillAssignments: [],
        patternBans: [],
        apotheosisScore: 85,
        previousScore: 80,
        scoreDelta: 5,
        shadowCouncilInstances: 3,
        computeHours: 2.5,
        duration: 120,
      };
      expect(run.status).toBe('running');
      expect(run.survivalRate).toBe(0.85);
    });

    it('should allow completed run with completedAt', () => {
      const run: ApotheosisRun = {
        id: 'run-2',
        organizationId: 'org-1',
        startedAt: new Date(),
        completedAt: new Date(),
        status: 'completed',
        scenariosTested: 100,
        scenariosSurvived: 90,
        survivalRate: 0.90,
        weaknessesFound: [],
        criticalCount: 0,
        highCount: 1,
        mediumCount: 3,
        lowCount: 5,
        autoPatches: [],
        escalations: [],
        upskillAssignments: [],
        patternBans: [],
        apotheosisScore: 90,
        previousScore: 85,
        scoreDelta: 5,
        shadowCouncilInstances: 3,
        computeHours: 2.0,
        duration: 100,
      };
      expect(run.completedAt).toBeInstanceOf(Date);
    });
  });

  describe('WeaknessItem type', () => {
    it('should allow valid weakness objects', () => {
      const weakness: WeaknessItem = {
        id: 'weak-1',
        title: 'Insufficient Access Controls',
        description: 'Database lacks row-level security',
        category: 'technical',
        severity: 'high',
        exploitScenario: 'Attacker gains unauthorized access to sensitive data',
        damageEstimate: 500000,
        fixComplexity: 'moderate',
        recommendedFix: 'Implement row-level security policies',
        autoFixable: false,
        status: 'new',
        discoveredAt: new Date(),
      };
      expect(weakness.severity).toBe('high');
      expect(weakness.autoFixable).toBe(false);
    });

    it('should validate all severity levels', () => {
      const severities: WeaknessSeverity[] = ['critical', 'high', 'medium', 'low'];
      expect(severities).toHaveLength(4);
    });

    it('should validate all weakness categories', () => {
      const categories: WeaknessCategory[] = [
        'financial', 'operational', 'competitive', 'regulatory',
        'reputational', 'technical', 'human', 'black_swan'
      ];
      expect(categories).toHaveLength(8);
    });
  });

  describe('AutoPatch type', () => {
    it('should allow valid auto-patch objects', () => {
      const patch: AutoPatch = {
        id: 'patch-1',
        weaknessId: 'weak-1',
        patchType: 'policy_adjustment',
        description: 'Updated access policy to restrict admin access',
        beforeState: 'All users had admin access',
        afterState: 'Only designated admins have access',
        reversible: true,
        budgetImpact: 0,
        appliedAt: new Date(),
        status: 'applied',
        rollbackAvailable: true,
      };
      expect(patch.reversible).toBe(true);
    });

    it('should validate all patch types', () => {
      const types: PatchType[] = [
        'policy_adjustment', 'access_control', 'workflow_modification',
        'council_tuning', 'alert_creation', 'config_change'
      ];
      expect(types).toHaveLength(6);
    });
  });

  describe('Escalation type', () => {
    it('should allow valid escalation objects', () => {
      const escalation: Escalation = {
        id: 'esc-1',
        weaknessId: 'weak-1',
        title: 'Critical Infrastructure Vulnerability',
        description: 'Core payment system has unpatched vulnerability',
        severity: 'critical',
        reason: 'Requires infrastructure changes beyond auto-fix scope',
        estimatedCostToFix: 250000,
        riskIfNotFixed: 5000000,
        assignedTo: ['cto@company.com', 'security@company.com'],
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        status: 'pending',
      };
      expect(escalation.severity).toBe('critical');
    });

    it('should validate all escalation statuses', () => {
      const statuses: EscalationStatus[] = ['pending', 'approved', 'rejected', 'deferred'];
      expect(statuses).toHaveLength(4);
    });
  });

  describe('UpskillAssignment type', () => {
    it('should allow valid upskill assignments', () => {
      const assignment: UpskillAssignment = {
        id: 'upskill-1',
        userId: 'user-1',
        userName: 'John Doe',
        department: 'Engineering',
        weaknessId: 'weak-1',
        title: 'Security Best Practices Training',
        description: 'Complete security awareness training module',
        learningPath: [
          {
            id: 'mod-1',
            title: 'Introduction to Security',
            type: 'video',
            duration: 30,
            completed: false,
          },
          {
            id: 'mod-2',
            title: 'Secure Coding Quiz',
            type: 'assessment',
            duration: 15,
            completed: false,
          },
        ],
        estimatedHours: 2,
        deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
        status: 'assigned',
      };
      expect(assignment.learningPath).toHaveLength(2);
    });
  });

  describe('PatternBan type', () => {
    it('should allow valid pattern ban objects', () => {
      const ban: PatternBan = {
        id: 'ban-1',
        pattern: 'approve_without_review',
        patternType: 'approval_pattern',
        reason: 'Detected pattern of approvals without proper review',
        weaknessIds: ['weak-1', 'weak-2'],
        createdAt: new Date(),
        status: 'active',
        appealable: true,
        appealDeadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      };
      expect(ban.appealable).toBe(true);
    });
  });

  describe('AttackScenario type', () => {
    it('should allow valid attack scenario objects', () => {
      const scenario: AttackScenario = {
        id: 'attack-1',
        category: 'cyber_attack',
        name: 'Ransomware Attack',
        description: 'Simulated ransomware attack on critical systems',
        probability: 0.3,
        severity: 'critical',
        vectors: [
          {
            name: 'Phishing Email',
            description: 'Employee clicks malicious link',
            exploitSteps: ['Send phishing email', 'User clicks link', 'Malware installed'],
            targetAssets: ['Email System', 'Workstations'],
            requiredAccess: 'None (external)',
          },
        ],
        mitigations: ['Email filtering', 'User training', 'Endpoint protection'],
      };
      expect(scenario.vectors).toHaveLength(1);
    });
  });
});

describe('CendiaApotheosis - Configuration', () => {
  describe('DEFAULT_APOTHEOSIS_CONFIG', () => {
    it('should have valid default configuration', () => {
      expect(DEFAULT_APOTHEOSIS_CONFIG).toBeDefined();
      expect(DEFAULT_APOTHEOSIS_CONFIG.enabled).toBe(true);
      expect(DEFAULT_APOTHEOSIS_CONFIG.schedule).toBe('0 2 * * *');
      expect(DEFAULT_APOTHEOSIS_CONFIG.maxRunDuration).toBe(120);
      expect(DEFAULT_APOTHEOSIS_CONFIG.shadowCouncilInstances).toBe(3);
    });

    it('should have default attack categories', () => {
      expect(DEFAULT_APOTHEOSIS_CONFIG.attackCategories).toContain('financial_stress');
      expect(DEFAULT_APOTHEOSIS_CONFIG.attackCategories).toContain('cyber_attack');
      expect(DEFAULT_APOTHEOSIS_CONFIG.attackCategories.length).toBeGreaterThan(3);
    });

    it('should have auto-fix settings', () => {
      expect(DEFAULT_APOTHEOSIS_CONFIG.autoFixEnabled).toBe(true);
      expect(DEFAULT_APOTHEOSIS_CONFIG.autoFixBudgetLimit).toBe(10000);
    });

    it('should have escalation threshold', () => {
      expect(DEFAULT_APOTHEOSIS_CONFIG.escalationThreshold).toBe('high');
    });

    it('should enable upskill and pattern ban features', () => {
      expect(DEFAULT_APOTHEOSIS_CONFIG.upskillEnabled).toBe(true);
      expect(DEFAULT_APOTHEOSIS_CONFIG.patternBanEnabled).toBe(true);
    });
  });

  describe('ApotheosisConfig type', () => {
    it('should allow custom configuration', () => {
      const config: ApotheosisConfig = {
        enabled: true,
        schedule: '0 3 * * 1', // Weekly on Monday at 3 AM
        maxRunDuration: 180,
        shadowCouncilInstances: 5,
        attackCategories: ['cyber_attack', 'financial_stress'],
        autoFixEnabled: false,
        autoFixBudgetLimit: 5000,
        escalationThreshold: 'critical',
        upskillEnabled: true,
        patternBanEnabled: false,
      };
      expect(config.schedule).toBe('0 3 * * 1');
      expect(config.autoFixEnabled).toBe(false);
    });
  });
});
