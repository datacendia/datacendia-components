// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * GOVERNANCE ABUSE PREVENTION TEST SUITE
 * =============================================================================
 * Adversarial tests proving the system resists pressure and misuse:
 * - Attempt to rename agent to human name → blocked
 * - Attempt to bypass agent council → rejected
 * - Attempt to submit decision without alternatives considered
 * - Attempt to suppress dissent
 * - Attempt to tamper with audit records
 * 
 * Why this matters: Governance systems must prove they resist pressure,
 * not just function. This is critical for regulatory trust.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { SPORTS_AGENT_PRESETS, sportsAgentService } from '../../../services/sports/SportsAgents.js';

// =============================================================================
// TYPES FOR ABUSE SCENARIOS
// =============================================================================

interface AgentConfig {
  id: string;
  role: string;
  displayLabel: string;
  customizableLabel: boolean;
}

interface Decision {
  id: string;
  status: string;
  agentContributions: string[];
  alternativesConsidered: string[];
  dissents: Array<{ agentId: string; reason: string; timestamp: Date }>;
  auditHash?: string;
  locked: boolean;
}

// =============================================================================
// GOVERNANCE POLICY SERVICE (Test Double)
// =============================================================================

class GovernancePolicyService {
  private blockedNamePatterns: RegExp[] = [
    /^(Mr\.|Mrs\.|Ms\.|Dr\.|Sir|Dame|Prof\.|Professor)\s/i,
    /^[A-Z][a-z]+ [A-Z][a-z]+$/, // "First Last" pattern
    /^[A-Z][a-z]+ [A-Z]\. [A-Z][a-z]+$/, // "First M. Last" pattern
    /\b(Hans|Victoria|Marcus|Roberto|James|Sarah|Michael|Jennifer)\b/i, // Common persona names
  ];

  private minimumAgentsRequired = 2;
  private minimumAlternatives = 2;

  validateAgentLabel(label: string): { valid: boolean; reason?: string } {
    for (const pattern of this.blockedNamePatterns) {
      if (pattern.test(label)) {
        return {
          valid: false,
          reason: `Label "${label}" matches blocked persona pattern. Agent labels must be functional descriptors, not human names.`,
        };
      }
    }
    return { valid: true };
  }

  validateDecisionSubmission(decision: Decision): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Must have minimum agent contributions
    if (decision.agentContributions.length < this.minimumAgentsRequired) {
      errors.push(
        `Decision requires at least ${this.minimumAgentsRequired} agent contributions. ` +
        `Found: ${decision.agentContributions.length}. Cannot bypass council.`
      );
    }

    // Must have alternatives considered
    if (decision.alternativesConsidered.length < this.minimumAlternatives) {
      errors.push(
        `Decision requires at least ${this.minimumAlternatives} alternatives to be considered. ` +
        `Found: ${decision.alternativesConsidered.length}.`
      );
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }

  validateDissentHandling(
    decision: Decision,
    attemptedAction: 'suppress' | 'acknowledge' | 'address'
  ): { allowed: boolean; reason?: string } {
    if (attemptedAction === 'suppress') {
      return {
        allowed: false,
        reason: 'Dissent suppression is prohibited. All dissenting opinions must be preserved in the audit record.',
      };
    }

    if (decision.locked && attemptedAction !== 'acknowledge') {
      return {
        allowed: false,
        reason: 'Cannot modify dissent handling on a locked decision.',
      };
    }

    return { allowed: true };
  }

  validateAuditModification(
    decision: Decision,
    field: string
  ): { allowed: boolean; reason?: string } {
    if (decision.locked) {
      return {
        allowed: false,
        reason: `Cannot modify ${field} on locked decision. Audit record is immutable.`,
      };
    }

    const immutableFields = ['auditHash', 'dissents', 'agentContributions', 'id'];
    if (decision.auditHash && immutableFields.includes(field)) {
      return {
        allowed: false,
        reason: `Field ${field} is immutable once audit hash is generated.`,
      };
    }

    return { allowed: true };
  }
}

// =============================================================================
// AGENT NAME ABUSE PREVENTION TESTS
// =============================================================================

describe('Governance Abuse Prevention - Agent Naming', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  describe('Blocked Human Name Patterns', () => {
    it('should BLOCK "Dr. Hans Weber" style names', () => {
      const result = policy.validateAgentLabel('Dr. Hans Weber');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('blocked persona pattern');
    });

    it('should BLOCK "Victoria Chen" style names', () => {
      const result = policy.validateAgentLabel('Victoria Chen');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('blocked persona pattern');
    });

    it('should BLOCK "Marcus Sterling" style names', () => {
      const result = policy.validateAgentLabel('Marcus Sterling');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('blocked persona pattern');
    });

    it('should BLOCK "Mr. Transfer Analyst" style titles', () => {
      const result = policy.validateAgentLabel('Mr. Transfer Analyst');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('blocked persona pattern');
    });

    it('should BLOCK "Professor Risk Assessment" style titles', () => {
      const result = policy.validateAgentLabel('Prof. Risk Assessment');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('blocked persona pattern');
    });

    it('should BLOCK "James M. Anderson" style names', () => {
      const result = policy.validateAgentLabel('James M. Anderson');
      expect(result.valid).toBe(false);
      expect(result.reason).toContain('blocked persona pattern');
    });
  });

  describe('Allowed Functional Labels', () => {
    it('should ALLOW "Player Valuation & Market Analysis"', () => {
      const result = policy.validateAgentLabel('Player Valuation & Market Analysis');
      expect(result.valid).toBe(true);
    });

    it('should ALLOW "UEFA Financial Sustainability Check"', () => {
      const result = policy.validateAgentLabel('UEFA Financial Sustainability Check');
      expect(result.valid).toBe(true);
    });

    it('should ALLOW "Contract Terms & Negotiation Support"', () => {
      const result = policy.validateAgentLabel('Contract Terms & Negotiation Support');
      expect(result.valid).toBe(true);
    });

    it('should ALLOW "Risk & Due Diligence Assessment"', () => {
      const result = policy.validateAgentLabel('Risk & Due Diligence Assessment');
      expect(result.valid).toBe(true);
    });

    it('should ALLOW "Board Presentation & Strategic Advisory"', () => {
      const result = policy.validateAgentLabel('Board Presentation & Strategic Advisory');
      expect(result.valid).toBe(true);
    });
  });

  describe('All Production Agents Pass Validation', () => {
    it.each(SPORTS_AGENT_PRESETS)(
      '$id displayLabel should pass governance validation',
      (agent) => {
        const result = policy.validateAgentLabel(agent.displayLabel);
        expect(result.valid).toBe(true);
      }
    );
  });
});

// =============================================================================
// COUNCIL BYPASS PREVENTION TESTS
// =============================================================================

describe('Governance Abuse Prevention - Council Bypass', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  it('should REJECT decision with no agent contributions (bypass attempt)', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'PENDING',
      agentContributions: [], // No agents consulted!
      alternativesConsidered: ['Option A', 'Option B'],
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(decision);

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('agent contributions'))).toBe(true);
  });

  it('should REJECT decision with only 1 agent (insufficient deliberation)', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'PENDING',
      agentContributions: ['agent-transfer-analyst'], // Only 1 agent
      alternativesConsidered: ['Option A', 'Option B'],
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(decision);

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('agent contributions'))).toBe(true);
  });

  it('should ACCEPT decision with adequate agent contributions', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'PENDING',
      agentContributions: ['agent-transfer-analyst', 'agent-ffp-compliance', 'agent-risk-assessor'],
      alternativesConsidered: ['Proceed with transfer', 'Negotiate lower fee', 'Walk away'],
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(decision);

    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });
});

// =============================================================================
// ALTERNATIVES REQUIREMENT TESTS
// =============================================================================

describe('Governance Abuse Prevention - Alternatives Requirement', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  it('should REJECT decision with no alternatives considered', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'PENDING',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: [], // No alternatives!
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(decision);

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('alternatives'))).toBe(true);
  });

  it('should REJECT decision with only 1 alternative (rubber stamp)', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'PENDING',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['Just do it'], // Only 1 alternative = rubber stamp
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(decision);

    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('alternatives'))).toBe(true);
  });

  it('should ACCEPT decision with proper alternatives analysis', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'PENDING',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: [
        'Proceed with £50M offer',
        'Counter with £45M + performance bonuses',
        'Walk away and pursue alternative targets',
      ],
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(decision);

    expect(result.valid).toBe(true);
  });
});

// =============================================================================
// DISSENT SUPPRESSION PREVENTION TESTS
// =============================================================================

describe('Governance Abuse Prevention - Dissent Suppression', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  it('should BLOCK attempt to suppress dissent', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [
        {
          agentId: 'agent-risk-assessor',
          reason: 'FFP compliance risk exceeds acceptable threshold',
          timestamp: new Date(),
        },
      ],
      locked: true,
    };

    const result = policy.validateDissentHandling(decision, 'suppress');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('suppression is prohibited');
    expect(result.reason).toContain('preserved in the audit record');
  });

  it('should ALLOW acknowledging dissent', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [
        {
          agentId: 'agent-risk-assessor',
          reason: 'High risk',
          timestamp: new Date(),
        },
      ],
      locked: true,
    };

    const result = policy.validateDissentHandling(decision, 'acknowledge');

    expect(result.allowed).toBe(true);
  });

  it('should BLOCK addressing dissent on locked decision', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [],
      locked: true,
    };

    const result = policy.validateDissentHandling(decision, 'address');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('locked decision');
  });
});

// =============================================================================
// AUDIT TAMPERING PREVENTION TESTS
// =============================================================================

describe('Governance Abuse Prevention - Audit Tampering', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  it('should BLOCK modification of locked decision', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [],
      auditHash: 'abc123',
      locked: true,
    };

    const result = policy.validateAuditModification(decision, 'status');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('locked decision');
    expect(result.reason).toContain('immutable');
  });

  it('should BLOCK modification of auditHash', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [],
      auditHash: 'abc123',
      locked: false,
    };

    const result = policy.validateAuditModification(decision, 'auditHash');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('immutable');
  });

  it('should BLOCK modification of dissents after audit hash generated', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [{ agentId: 'agent-1', reason: 'Concern', timestamp: new Date() }],
      auditHash: 'abc123',
      locked: false,
    };

    const result = policy.validateAuditModification(decision, 'dissents');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('immutable');
  });

  it('should BLOCK modification of agentContributions after audit hash', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [],
      auditHash: 'abc123',
      locked: false,
    };

    const result = policy.validateAuditModification(decision, 'agentContributions');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('immutable');
  });

  it('should BLOCK modification of decision ID', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [],
      auditHash: 'abc123',
      locked: false,
    };

    const result = policy.validateAuditModification(decision, 'id');

    expect(result.allowed).toBe(false);
    expect(result.reason).toContain('immutable');
  });

  it('should ALLOW modification of non-critical fields before lock', () => {
    const decision: Decision = {
      id: 'dec-123',
      status: 'DRAFT',
      agentContributions: [],
      alternativesConsidered: [],
      dissents: [],
      locked: false,
    };

    const result = policy.validateAuditModification(decision, 'status');

    expect(result.allowed).toBe(true);
  });
});

// =============================================================================
// SYSTEM PROMPT INJECTION PREVENTION TESTS
// =============================================================================

describe('Governance Abuse Prevention - Prompt Injection', () => {
  it('all agent systemPrompts should NOT contain persona-based identity', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      // Should not have "You are [Name]" with human-like names
      expect(agent.systemPrompt).not.toMatch(/You are (Dr\.|Mr\.|Mrs\.|Ms\.) [A-Z]/);
      expect(agent.systemPrompt).not.toMatch(/My name is [A-Z][a-z]+ [A-Z][a-z]+/);
      expect(agent.systemPrompt).not.toMatch(/I am [A-Z][a-z]+ [A-Z][a-z]+, (a|the)/);
    }
  });

  it('all agent systemPrompts should identify as functions, not people', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      // Should contain function/role-based identity
      const hasRoleIdentity = 
        agent.systemPrompt.includes('function') ||
        agent.systemPrompt.includes('role') ||
        agent.systemPrompt.includes('mandate') ||
        agent.systemPrompt.includes('responsibility');
      
      expect(hasRoleIdentity).toBe(true);
    }
  });

  it('no agent should claim personal experience or tenure', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      expect(agent.systemPrompt).not.toMatch(/\d+ years (of )?experience/i);
      expect(agent.systemPrompt).not.toMatch(/worked at/i);
      expect(agent.systemPrompt).not.toMatch(/my career/i);
      expect(agent.systemPrompt).not.toMatch(/throughout my/i);
    }
  });
});

// =============================================================================
// ROLE IMPERSONATION PREVENTION TESTS
// =============================================================================

describe('Governance Abuse Prevention - Role Impersonation', () => {
  it('should have unique agent IDs', () => {
    const ids = SPORTS_AGENT_PRESETS.map(a => a.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(ids.length);
  });

  it('should have unique roles', () => {
    const roles = SPORTS_AGENT_PRESETS.map(a => a.role);
    const uniqueRoles = new Set(roles);
    expect(uniqueRoles.size).toBe(roles.length);
  });

  it('agent ID should follow standardized pattern', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      expect(agent.id).toMatch(/^agent-[a-z-]+$/);
    }
  });

  it('role should follow snake_case pattern', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      expect(agent.role).toMatch(/^[a-z_]+$/);
    }
  });
});

// =============================================================================
// CUSTOMIZABLE LABEL ABUSE PREVENTION
// =============================================================================

describe('Governance Abuse Prevention - Customizable Labels', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  it('should BLOCK custom label that introduces human name', () => {
    // Simulate club trying to customize label to human name
    const customLabel = 'Dr. John Smith';
    const result = policy.validateAgentLabel(customLabel);
    
    expect(result.valid).toBe(false);
  });

  it('should ALLOW club-specific functional labels', () => {
    // Celtic FC wants to customize labels
    const celticLabels = [
      'Football Operations Risk Assessment',
      'Board Governance Review Function',
      'UEFA Compliance Analysis Lens',
      'Celtic Transfer Intelligence',
    ];

    for (const label of celticLabels) {
      const result = policy.validateAgentLabel(label);
      expect(result.valid).toBe(true);
    }
  });

  it('all agents should have customizableLabel flag', () => {
    for (const agent of SPORTS_AGENT_PRESETS) {
      expect(agent).toHaveProperty('customizableLabel');
      expect(typeof agent.customizableLabel).toBe('boolean');
    }
  });
});

// =============================================================================
// COMPREHENSIVE ADVERSARIAL SCENARIO TESTS
// =============================================================================

describe('Governance Abuse Prevention - Adversarial Scenarios', () => {
  let policy: GovernancePolicyService;

  beforeEach(() => {
    policy = new GovernancePolicyService();
  });

  it('Scenario: Rogue admin tries to push through decision without council', () => {
    const rogueDecision: Decision = {
      id: 'rogue-dec-001',
      status: 'PENDING',
      agentContributions: [], // Bypassed council!
      alternativesConsidered: ['Just buy him'],
      dissents: [],
      locked: false,
    };

    const result = policy.validateDecisionSubmission(rogueDecision);

    expect(result.valid).toBe(false);
    expect(result.errors.length).toBeGreaterThanOrEqual(2); // Both council AND alternatives violations
  });

  it('Scenario: Pressure to suppress negative risk assessment', () => {
    const pressuredDecision: Decision = {
      id: 'pressured-dec-001',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2', 'agent-risk-assessor'],
      alternativesConsidered: ['Proceed', 'Delay', 'Cancel'],
      dissents: [
        {
          agentId: 'agent-risk-assessor',
          reason: 'Financial risk is unacceptable. Wage structure will destabilize squad.',
          timestamp: new Date(),
        },
      ],
      auditHash: 'abc123',
      locked: true,
    };

    // Someone pressures to suppress the dissent
    const suppressResult = policy.validateDissentHandling(pressuredDecision, 'suppress');
    expect(suppressResult.allowed).toBe(false);

    // Try to modify the dissents directly
    const modifyResult = policy.validateAuditModification(pressuredDecision, 'dissents');
    expect(modifyResult.allowed).toBe(false);
  });

  it('Scenario: Attempt to rebrand AI agent as trusted human advisor', () => {
    const humanBrandingAttempts = [
      'Dr. Marcus Transfer',
      'Mr. Alex Analytics',
      'Mrs. Finance Expert',
      'Prof. Risk Management',
      'Ms. Scout Davies',
    ];

    for (const attempt of humanBrandingAttempts) {
      const result = policy.validateAgentLabel(attempt);
      expect(result.valid).toBe(false);
    }
  });

  it('Scenario: Post-decision audit hash tampering attempt', () => {
    const finalizedDecision: Decision = {
      id: 'final-dec-001',
      status: 'DECIDED',
      agentContributions: ['agent-1', 'agent-2'],
      alternativesConsidered: ['A', 'B'],
      dissents: [],
      auditHash: 'original-hash-abc123',
      locked: true,
    };

    // Try to change the audit hash
    const hashResult = policy.validateAuditModification(finalizedDecision, 'auditHash');
    expect(hashResult.allowed).toBe(false);

    // Try to change the ID
    const idResult = policy.validateAuditModification(finalizedDecision, 'id');
    expect(idResult.allowed).toBe(false);

    // Try to add fake contributions
    const contribResult = policy.validateAuditModification(finalizedDecision, 'agentContributions');
    expect(contribResult.allowed).toBe(false);
  });
});
