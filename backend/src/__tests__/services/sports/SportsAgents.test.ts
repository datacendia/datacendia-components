/**
 * =============================================================================
 * SPORTS AGENTS SERVICE TEST SUITE
 * =============================================================================
 * Comprehensive testing for Sports Vertical AI Agent presets covering:
 * - Agent preset structure validation
 * - Governance-safe naming compliance
 * - Workflow mapping accuracy
 * - System prompt integrity
 * - Role-based identity enforcement
 * - Customizable label support
 */

import { describe, it, expect, beforeAll } from 'vitest';
import {
  SPORTS_AGENT_PRESETS,
  sportsAgentService,
  SportsAgentPreset,
  SportsAgentRole,
  SportsWorkflow,
} from '../../../services/sports/SportsAgents.js';

// =============================================================================
// TEST DATA
// =============================================================================

const EXPECTED_AGENTS: SportsAgentRole[] = [
  'transfer_analyst',
  'contract_negotiator',
  'ffp_compliance_officer',
  'scouting_coordinator',
  'risk_assessor',
  'agent_liaison',
  'legal_advisor',
  'youth_development_specialist',
  'commercial_evaluator',
  'board_advisor',
];

const EXPECTED_WORKFLOWS: SportsWorkflow[] = [
  'transfer_evaluation',
  'contract_negotiation',
  'ffp_assessment',
  'scouting_report',
  'due_diligence',
  'youth_promotion',
  'commercial_deal',
  'board_presentation',
];

const FORBIDDEN_HUMAN_NAMES = [
  'Marcus Sterling',
  'Victoria Chen',
  'Dr. Hans Weber',
  'Roberto Martinez',
  'Sarah MacLeod',
  'James Thornton',
  'Dr. Eleanor Grant',
  'Paul Henderson',
  'Michelle Park',
  'Sir David Campbell',
];

const FORBIDDEN_PERSONA_PHRASES = [
  'You are Marcus',
  'You are Victoria',
  'You are Dr.',
  'You are Roberto',
  'You are Sarah',
  'You are James',
  'You are Eleanor',
  'You are Paul',
  'You are Michelle',
  'You are Sir',
  'with 15 years',
  'with 20 years',
  'with experience',
  'Head of',
  'Director of',
  'Chief Scout',
  'Academy Director',
];

// =============================================================================
// AGENT PRESET STRUCTURE TESTS
// =============================================================================

describe('Sports Agent Presets - Structure Validation', () => {
  it('should have exactly 10 agent presets', () => {
    expect(SPORTS_AGENT_PRESETS).toHaveLength(10);
  });

  it('should have all expected agent roles', () => {
    const roles = SPORTS_AGENT_PRESETS.map(a => a.role);
    for (const expectedRole of EXPECTED_AGENTS) {
      expect(roles).toContain(expectedRole);
    }
  });

  it('should have unique agent IDs', () => {
    const ids = SPORTS_AGENT_PRESETS.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have unique agent roles', () => {
    const roles = SPORTS_AGENT_PRESETS.map(a => a.role);
    const uniqueRoles = new Set(roles);
    expect(uniqueRoles.size).toBe(roles.length);
  });

  describe.each(SPORTS_AGENT_PRESETS)('Agent: $id', (agent) => {
    it('should have required properties', () => {
      expect(agent).toHaveProperty('id');
      expect(agent).toHaveProperty('role');
      expect(agent).toHaveProperty('displayLabel');
      expect(agent).toHaveProperty('description');
      expect(agent).toHaveProperty('expertise');
      expect(agent).toHaveProperty('workflows');
      expect(agent).toHaveProperty('systemPrompt');
      expect(agent).toHaveProperty('temperature');
      expect(agent).toHaveProperty('model');
      expect(agent).toHaveProperty('knowledgeSources');
      expect(agent).toHaveProperty('complianceFrameworks');
      expect(agent).toHaveProperty('maxTokens');
      expect(agent).toHaveProperty('responseStyle');
    });

    it('should have valid temperature range (0.0 - 1.0)', () => {
      expect(agent.temperature).toBeGreaterThanOrEqual(0);
      expect(agent.temperature).toBeLessThanOrEqual(1);
    });

    it('should have valid maxTokens (> 0)', () => {
      expect(agent.maxTokens).toBeGreaterThan(0);
    });

    it('should have at least one workflow', () => {
      expect(agent.workflows.length).toBeGreaterThan(0);
    });

    it('should have at least one expertise area', () => {
      expect(agent.expertise.length).toBeGreaterThan(0);
    });

    it('should have valid responseStyle', () => {
      expect(['formal', 'analytical', 'advisory', 'technical']).toContain(agent.responseStyle);
    });

    it('should have non-empty displayLabel', () => {
      expect(agent.displayLabel.length).toBeGreaterThan(0);
    });

    it('should have non-empty description', () => {
      expect(agent.description.length).toBeGreaterThan(0);
    });

    it('should have non-empty systemPrompt', () => {
      expect(agent.systemPrompt.length).toBeGreaterThan(100);
    });
  });
});

// =============================================================================
// GOVERNANCE-SAFE NAMING COMPLIANCE TESTS
// =============================================================================

describe('Sports Agent Presets - Governance-Safe Naming Compliance', () => {
  describe('No Human Names Allowed', () => {
    it.each(SPORTS_AGENT_PRESETS)('$id displayLabel should not contain human names', (agent) => {
      for (const name of FORBIDDEN_HUMAN_NAMES) {
        expect(agent.displayLabel).not.toContain(name);
      }
    });

    it.each(SPORTS_AGENT_PRESETS)('$id description should not contain human names', (agent) => {
      for (const name of FORBIDDEN_HUMAN_NAMES) {
        expect(agent.description).not.toContain(name);
      }
    });

    it.each(SPORTS_AGENT_PRESETS)('$id systemPrompt should not contain human names', (agent) => {
      for (const name of FORBIDDEN_HUMAN_NAMES) {
        expect(agent.systemPrompt).not.toContain(name);
      }
    });
  });

  describe('No Persona Framing Allowed', () => {
    it.each(SPORTS_AGENT_PRESETS)('$id systemPrompt should not use persona framing', (agent) => {
      for (const phrase of FORBIDDEN_PERSONA_PHRASES) {
        expect(agent.systemPrompt).not.toContain(phrase);
      }
    });
  });

  describe('Functional Identity Pattern Required', () => {
    it.each(SPORTS_AGENT_PRESETS)('$id systemPrompt should start with function identity', (agent) => {
      expect(agent.systemPrompt).toMatch(/^You are the [A-Za-z\s]+ function\./);
    });

    it.each(SPORTS_AGENT_PRESETS)('$id systemPrompt should contain mandate statement', (agent) => {
      expect(agent.systemPrompt).toContain('mandate');
    });
  });

  describe('Customizable Label Support', () => {
    it.each(SPORTS_AGENT_PRESETS)('$id should have customizableLabel property', (agent) => {
      expect(agent).toHaveProperty('customizableLabel');
    });

    it.each(SPORTS_AGENT_PRESETS)('$id should have customizableLabel set to true', (agent) => {
      expect(agent.customizableLabel).toBe(true);
    });
  });

  describe('Display Label Format Validation', () => {
    it.each(SPORTS_AGENT_PRESETS)('$id displayLabel should be title-cased functional descriptor', (agent) => {
      // Should not start with lowercase
      expect(agent.displayLabel[0]).toBe(agent.displayLabel[0].toUpperCase());
      // Should not contain personal pronouns
      expect(agent.displayLabel.toLowerCase()).not.toContain(' i ');
      expect(agent.displayLabel.toLowerCase()).not.toContain(' my ');
      expect(agent.displayLabel.toLowerCase()).not.toContain(' me ');
    });

    it.each(SPORTS_AGENT_PRESETS)('$id displayLabel should be reasonably short (< 50 chars)', (agent) => {
      expect(agent.displayLabel.length).toBeLessThan(50);
    });
  });
});

// =============================================================================
// WORKFLOW MAPPING TESTS
// =============================================================================

describe('Sports Agent Presets - Workflow Mapping', () => {
  it('should cover all expected workflows', () => {
    const allWorkflows = new Set<SportsWorkflow>();
    for (const agent of SPORTS_AGENT_PRESETS) {
      for (const workflow of agent.workflows) {
        allWorkflows.add(workflow);
      }
    }
    for (const expected of EXPECTED_WORKFLOWS) {
      expect(allWorkflows.has(expected)).toBe(true);
    }
  });

  it('each workflow should have at least one agent', () => {
    for (const workflow of EXPECTED_WORKFLOWS) {
      const agents = SPORTS_AGENT_PRESETS.filter(a => a.workflows.includes(workflow));
      expect(agents.length).toBeGreaterThan(0);
    }
  });

  describe('Workflow-Specific Agent Coverage', () => {
    it('transfer_evaluation should have multiple agents', () => {
      const agents = SPORTS_AGENT_PRESETS.filter(a => a.workflows.includes('transfer_evaluation'));
      expect(agents.length).toBeGreaterThanOrEqual(3);
    });

    it('ffp_assessment should include FFP compliance officer', () => {
      const agents = SPORTS_AGENT_PRESETS.filter(a => a.workflows.includes('ffp_assessment'));
      const roles = agents.map(a => a.role);
      expect(roles).toContain('ffp_compliance_officer');
    });

    it('board_presentation should include board advisor', () => {
      const agents = SPORTS_AGENT_PRESETS.filter(a => a.workflows.includes('board_presentation'));
      const roles = agents.map(a => a.role);
      expect(roles).toContain('board_advisor');
    });

    it('youth_promotion should include youth specialist', () => {
      const agents = SPORTS_AGENT_PRESETS.filter(a => a.workflows.includes('youth_promotion'));
      const roles = agents.map(a => a.role);
      expect(roles).toContain('youth_development_specialist');
    });
  });
});

// =============================================================================
// COMPLIANCE FRAMEWORK TESTS
// =============================================================================

describe('Sports Agent Presets - Compliance Framework Coverage', () => {
  const EXPECTED_FRAMEWORKS = [
    'UEFA_FFP',
    'PREMIER_LEAGUE_PSR',
    'FIFA_AGENT_REGS',
    'UEFA_CLUB_LICENSING',
  ];

  it('should have at least one agent per major framework', () => {
    for (const framework of EXPECTED_FRAMEWORKS) {
      const agents = SPORTS_AGENT_PRESETS.filter(a => 
        a.complianceFrameworks.includes(framework)
      );
      expect(agents.length).toBeGreaterThan(0);
    }
  });

  it('FFP compliance officer should cover UEFA FFP', () => {
    const ffpAgent = SPORTS_AGENT_PRESETS.find(a => a.role === 'ffp_compliance_officer');
    expect(ffpAgent?.complianceFrameworks).toContain('UEFA_FFP');
  });

  it('agent liaison should cover FIFA agent regulations', () => {
    const agentLiaison = SPORTS_AGENT_PRESETS.find(a => a.role === 'agent_liaison');
    expect(agentLiaison?.complianceFrameworks).toContain('FIFA_AGENT_REGS');
  });
});

// =============================================================================
// KNOWLEDGE SOURCE TESTS
// =============================================================================

describe('Sports Agent Presets - Knowledge Source Configuration', () => {
  const EXPECTED_SOURCES = [
    'uefa-ffp-2024',
    'fifa-agent-2023',
    'pl-psr-2024',
    'sfa-licensing-2024',
  ];

  it('should reference at least one knowledge source across all agents', () => {
    const allSources = new Set<string>();
    for (const agent of SPORTS_AGENT_PRESETS) {
      for (const source of agent.knowledgeSources) {
        allSources.add(source);
      }
    }
    expect(allSources.size).toBeGreaterThan(0);
  });

  it('FFP compliance officer should use UEFA FFP knowledge source', () => {
    const ffpAgent = SPORTS_AGENT_PRESETS.find(a => a.role === 'ffp_compliance_officer');
    expect(ffpAgent?.knowledgeSources).toContain('uefa-ffp-2024');
  });

  it('agent liaison should use FIFA agent knowledge source', () => {
    const agentLiaison = SPORTS_AGENT_PRESETS.find(a => a.role === 'agent_liaison');
    expect(agentLiaison?.knowledgeSources).toContain('fifa-agent-2023');
  });
});

// =============================================================================
// AGENT SERVICE TESTS
// =============================================================================

describe('Sports Agent Service', () => {
  describe('getAgentPreset', () => {
    it('should return agent by ID', () => {
      const agent = sportsAgentService.getAgentPreset('agent-transfer-analyst');
      expect(agent).toBeDefined();
      expect(agent?.role).toBe('transfer_analyst');
    });

    it('should return undefined for non-existent agent', () => {
      const agent = sportsAgentService.getAgentPreset('non-existent');
      expect(agent).toBeUndefined();
    });

    it.each(SPORTS_AGENT_PRESETS)('should find agent: $id', (expectedAgent) => {
      const agent = sportsAgentService.getAgentPreset(expectedAgent.id);
      expect(agent).toBeDefined();
      expect(agent?.id).toBe(expectedAgent.id);
    });
  });

  describe('getAgentsByRole', () => {
    it.each(EXPECTED_AGENTS)('should find agent for role: %s', (role) => {
      const agents = sportsAgentService.getAgentsByRole(role);
      expect(agents.length).toBeGreaterThan(0);
    });
  });

  describe('getRecommendedAgents', () => {
    it.each(EXPECTED_WORKFLOWS)('should return agents for workflow: %s', (workflow) => {
      const agents = sportsAgentService.getRecommendedAgents(workflow);
      expect(agents.length).toBeGreaterThan(0);
    });

    it('transfer_evaluation should return multiple agents', () => {
      const agents = sportsAgentService.getRecommendedAgents('transfer_evaluation');
      expect(agents.length).toBeGreaterThanOrEqual(3);
    });
  });

  describe('getWorkflows', () => {
    it('should return all workflows', () => {
      const workflows = sportsAgentService.getWorkflows();
      expect(workflows.length).toBe(EXPECTED_WORKFLOWS.length);
      for (const expected of EXPECTED_WORKFLOWS) {
        expect(workflows).toContain(expected);
      }
    });
  });

  describe('buildAgentPrompt', () => {
    it('should build prompt with player context', async () => {
      const agent = sportsAgentService.getAgentPreset('agent-transfer-analyst');
      expect(agent).toBeDefined();
      
      const prompt = await sportsAgentService.buildAgentPrompt(agent!, {
        workflow: 'transfer_evaluation',
        player: {
          name: 'Test Player',
          age: 25,
          position: 'Midfielder',
          currentClub: 'Test FC',
        },
      });
      
      expect(prompt).toContain('Test Player');
      expect(prompt).toContain('25');
      expect(prompt).toContain('Midfielder');
    });

    it('should include financial context when provided', async () => {
      const agent = sportsAgentService.getAgentPreset('agent-ffp-compliance');
      expect(agent).toBeDefined();
      
      const prompt = await sportsAgentService.buildAgentPrompt(agent!, {
        workflow: 'ffp_assessment',
        financials: {
          transferFee: 50000000,
          wages: 200000,
        },
      });
      
      expect(prompt).toContain('50');
      expect(prompt).toContain('200');
    });

    it('should include workflow context', async () => {
      const agent = sportsAgentService.getAgentPreset('agent-risk-assessor');
      expect(agent).toBeDefined();
      
      const prompt = await sportsAgentService.buildAgentPrompt(agent!, {
        workflow: 'due_diligence',
      });
      
      expect(prompt).toContain('due_diligence');
    });
  });
});

// =============================================================================
// EDGE CASE TESTS
// =============================================================================

describe('Sports Agent Presets - Edge Cases', () => {
  it('should handle empty workflow filter gracefully', () => {
    // This should not throw
    const result = sportsAgentService.getRecommendedAgents('' as any);
    expect(Array.isArray(result)).toBe(true);
  });

  it('should handle undefined agent ID gracefully', () => {
    const result = sportsAgentService.getAgentPreset(undefined as any);
    expect(result).toBeUndefined();
  });

  it('should handle null agent ID gracefully', () => {
    const result = sportsAgentService.getAgentPreset(null as any);
    expect(result).toBeUndefined();
  });

  it('all agents should have properly escaped systemPrompts', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      // Should not throw when used as template literal
      expect(() => {
        const test = `${agent.systemPrompt}`;
        return test;
      }).not.toThrow();
    }
  });
});

// =============================================================================
// AUDIT TRAIL COMPLIANCE TESTS
// =============================================================================

describe('Sports Agent Presets - Audit Trail Compliance', () => {
  it.each(SPORTS_AGENT_PRESETS)('$id should be identifiable for audit', (agent) => {
    // Agent ID should be stable and audit-friendly
    expect(agent.id).toMatch(/^agent-[a-z-]+$/);
  });

  it.each(SPORTS_AGENT_PRESETS)('$id role should be audit-friendly', (agent) => {
    // Role should be snake_case
    expect(agent.role).toMatch(/^[a-z_]+$/);
  });

  it('all agents should produce audit-safe responses', () => {
    // Verify no agent claims to be a person in their identity
    for (const agent of SPORTS_AGENT_PRESETS) {
      // Display label should not imply personhood
      expect(agent.displayLabel).not.toMatch(/^(Mr\.|Mrs\.|Ms\.|Dr\.|Sir|Dame)/);
      // Should not contain obvious human name patterns (First Last without & or special chars)
      expect(agent.displayLabel).not.toMatch(/^[A-Z][a-z]+ [A-Z][a-z]+$/);
    }
  });
});

// =============================================================================
// MODEL CONFIGURATION TESTS
// =============================================================================

describe('Sports Agent Presets - Model Configuration', () => {
  it.each(SPORTS_AGENT_PRESETS)('$id should use valid model', (agent) => {
    expect(agent.model).toMatch(/^(qwen|llama|mistral|gpt)/i);
  });

  it.each(SPORTS_AGENT_PRESETS)('$id should have appropriate temperature for role', (agent) => {
    // Compliance officers should be more deterministic
    if (agent.role === 'ffp_compliance_officer' || agent.role === 'legal_advisor') {
      expect(agent.temperature).toBeLessThanOrEqual(0.3);
    }
    // Creative roles can have higher temperature
    if (agent.role === 'commercial_evaluator' || agent.role === 'scouting_coordinator') {
      expect(agent.temperature).toBeGreaterThanOrEqual(0.4);
    }
  });

  it.each(SPORTS_AGENT_PRESETS)('$id should have sufficient maxTokens for detailed response', (agent) => {
    expect(agent.maxTokens).toBeGreaterThanOrEqual(3000);
  });
});
