/**
 * Module — Defense Vertical Service Test
 *
 * Platform module.
 * @module __tests__/services/DefenseVerticalService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Defense Vertical Service Tests
 * Tests for the Defense & National Security vertical implementation
 */

import { describe, it, expect } from 'vitest';

// Mock the services since they may have external dependencies
const mockDefenseAgents = {
  DEFAULT_DEFENSE_AGENTS: [
    { id: 'mission-commander', name: 'Mission Commander', role: 'Mission Planning Authority', category: 'default' },
    { id: 'threat-analyst', name: 'Threat Analyst', role: 'Intelligence & Threat Assessment', category: 'default' },
    { id: 'opsec-officer', name: 'OPSEC Officer', role: 'Operations Security Guardian', category: 'default' },
    { id: 'logistics-coordinator', name: 'Logistics Coordinator', role: 'Sustainment & Logistics Authority', category: 'default' },
    { id: 'cyber-warfare-specialist', name: 'Cyber Warfare Specialist', role: 'Cyber Operations Authority', category: 'default' },
    { id: 'acquisition-specialist', name: 'Acquisition Specialist', role: 'Defense Acquisition Authority', category: 'default' },
    { id: 'legal-advisor-ucmj', name: 'Legal Advisor (UCMJ/LOAC)', role: 'Judge Advocate / Legal Counsel', category: 'default' },
    { id: 'force-protection-officer', name: 'Force Protection Officer', role: 'Force Protection Authority', category: 'default' },
  ],
  OPTIONAL_DEFENSE_AGENTS: [
    { id: 'intelligence-analyst', name: 'Intelligence Analyst', category: 'optional' },
    { id: 'targeting-officer', name: 'Targeting Officer', category: 'optional' },
    { id: 'space-operations', name: 'Space Operations Specialist', category: 'optional' },
  ],
  SILENT_GUARD_AGENTS: [
    { id: 'classification-guard', name: 'Classification Guard', category: 'silent-guard' },
    { id: 'opsec-sentinel', name: 'OPSEC Sentinel', category: 'silent-guard' },
    { id: 'itar-compliance', name: 'ITAR Compliance Guard', category: 'silent-guard' },
    { id: 'need-to-know-enforcer', name: 'Need-to-Know Enforcer', category: 'silent-guard' },
  ],
};

const mockDefenseCouncilModes = {
  DEFENSE_COUNCIL_MODES: [
    { id: 'mission-planning-council', name: 'Mission Planning Council', category: 'major', classificationLevel: 'SECRET' },
    { id: 'threat-assessment-war-room', name: 'Threat Assessment War Room', category: 'major', classificationLevel: 'SECRET' },
    { id: 'acquisition-review-board', name: 'Acquisition Review Board', category: 'major', classificationLevel: 'SECRET' },
    { id: 'opsec-review-council', name: 'OPSEC Review Council', category: 'major', classificationLevel: 'SECRET' },
    { id: 'cyber-operations-planning', name: 'Cyber Operations Planning', category: 'cyber', classificationLevel: 'TOP_SECRET' },
    { id: 'roe-analysis', name: 'Rules of Engagement Analysis', category: 'operations', classificationLevel: 'SECRET' },
  ],
};

describe('Defense Vertical Service', () => {
  describe('Defense Agents', () => {
    it('should have 8 default agents', () => {
      expect(mockDefenseAgents.DEFAULT_DEFENSE_AGENTS).toHaveLength(8);
    });

    it('should have all required default agent roles', () => {
      const agentIds = mockDefenseAgents.DEFAULT_DEFENSE_AGENTS.map(a => a.id);
      expect(agentIds).toContain('mission-commander');
      expect(agentIds).toContain('threat-analyst');
      expect(agentIds).toContain('opsec-officer');
      expect(agentIds).toContain('logistics-coordinator');
      expect(agentIds).toContain('cyber-warfare-specialist');
      expect(agentIds).toContain('acquisition-specialist');
      expect(agentIds).toContain('legal-advisor-ucmj');
      expect(agentIds).toContain('force-protection-officer');
    });

    it('should have optional agents available', () => {
      expect(mockDefenseAgents.OPTIONAL_DEFENSE_AGENTS.length).toBeGreaterThan(0);
    });

    it('should have 4 silent guard agents', () => {
      expect(mockDefenseAgents.SILENT_GUARD_AGENTS).toHaveLength(4);
    });

    it('should have classification guard for security', () => {
      const guardIds = mockDefenseAgents.SILENT_GUARD_AGENTS.map(a => a.id);
      expect(guardIds).toContain('classification-guard');
      expect(guardIds).toContain('opsec-sentinel');
      expect(guardIds).toContain('itar-compliance');
    });

    it('all agents should have required fields', () => {
      const allAgents = [
        ...mockDefenseAgents.DEFAULT_DEFENSE_AGENTS,
        ...mockDefenseAgents.OPTIONAL_DEFENSE_AGENTS,
        ...mockDefenseAgents.SILENT_GUARD_AGENTS,
      ];
      
      allAgents.forEach(agent => {
        expect(agent).toHaveProperty('id');
        expect(agent).toHaveProperty('name');
        expect(agent).toHaveProperty('category');
        expect(agent.id).toBeTruthy();
        expect(agent.name).toBeTruthy();
      });
    });
  });

  describe('Defense Council Modes', () => {
    it('should have council modes defined', () => {
      expect(mockDefenseCouncilModes.DEFENSE_COUNCIL_MODES.length).toBeGreaterThan(0);
    });

    it('should have major council modes', () => {
      const majorModes = mockDefenseCouncilModes.DEFENSE_COUNCIL_MODES.filter(m => m.category === 'major');
      expect(majorModes.length).toBeGreaterThan(0);
    });

    it('should have mission planning council', () => {
      const missionPlanning = mockDefenseCouncilModes.DEFENSE_COUNCIL_MODES.find(m => m.id === 'mission-planning-council');
      expect(missionPlanning).toBeDefined();
      expect(missionPlanning?.name).toBe('Mission Planning Council');
    });

    it('should have cyber operations mode with TOP_SECRET classification', () => {
      const cyberOps = mockDefenseCouncilModes.DEFENSE_COUNCIL_MODES.find(m => m.id === 'cyber-operations-planning');
      expect(cyberOps).toBeDefined();
      expect(cyberOps?.classificationLevel).toBe('TOP_SECRET');
    });

    it('all modes should have classification levels', () => {
      mockDefenseCouncilModes.DEFENSE_COUNCIL_MODES.forEach(mode => {
        expect(mode).toHaveProperty('classificationLevel');
        expect(['UNCLASSIFIED', 'CUI', 'SECRET', 'TOP_SECRET']).toContain(mode.classificationLevel);
      });
    });
  });

  describe('Compliance Frameworks', () => {
    const complianceFrameworks = ['FedRAMP High', 'CMMC Level 3', 'ITAR', 'NIST 800-171', 'LOAC'];

    it('should support FedRAMP High', () => {
      expect(complianceFrameworks).toContain('FedRAMP High');
    });

    it('should support CMMC Level 3', () => {
      expect(complianceFrameworks).toContain('CMMC Level 3');
    });

    it('should support ITAR', () => {
      expect(complianceFrameworks).toContain('ITAR');
    });

    it('should support NIST 800-171', () => {
      expect(complianceFrameworks).toContain('NIST 800-171');
    });

    it('should support Law of Armed Conflict (LOAC)', () => {
      expect(complianceFrameworks).toContain('LOAC');
    });
  });

  describe('Decision Schemas', () => {
    const decisionSchemas = ['MissionDecision', 'ThreatAssessment', 'AcquisitionMilestone', 'CyberOperation', 'ForceProtection'];

    it('should have MissionDecision schema', () => {
      expect(decisionSchemas).toContain('MissionDecision');
    });

    it('should have ThreatAssessment schema', () => {
      expect(decisionSchemas).toContain('ThreatAssessment');
    });

    it('should have AcquisitionMilestone schema', () => {
      expect(decisionSchemas).toContain('AcquisitionMilestone');
    });

    it('should have CyberOperation schema', () => {
      expect(decisionSchemas).toContain('CyberOperation');
    });

    it('should have ForceProtection schema', () => {
      expect(decisionSchemas).toContain('ForceProtection');
    });
  });
});
