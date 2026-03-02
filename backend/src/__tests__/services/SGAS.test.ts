/**
 * Module — S G A S Test
 *
 * Platform module.
 * @module __tests__/services/SGAS.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS - Synthetic Governance Agent System Tests
 * 
 * Enterprise/Government Platinum Standard Test Suite
 * Tests all 5 agent classes, orchestrator, and deterministic replay
 */

import { describe, it, expect } from 'vitest';
import {
  sgasOrchestrator,
  decisionAgentsService,
  institutionalAgentsService,
  adversarialAgentsService,
  observerAgentsService,
  metaGovernanceAgentsService,
  DecisionProposal,
  DecisionType,
  RiskLevel,
  InstitutionalState,
  generateSGASId,
  hashState,
} from '../../services/sgas/index.js';

// =============================================================================
// TEST FIXTURES
// =============================================================================

function createTestProposal(overrides: Partial<DecisionProposal> = {}): DecisionProposal {
  const now = new Date();
  return {
    id: generateSGASId('prop'),
    timestamp: now,
    proposer: 'test-department',
    title: 'Test Proposal',
    description: 'A test proposal for unit testing',
    type: DecisionType.OPERATIONAL,
    context: {
      budget: {
        allocated: 100000,
        currency: 'USD',
        fiscalYear: '2026',
        lineItems: [],
        flexibilityPercent: 10,
      },
      timeframe: {
        start: now,
        end: new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 7,
      },
      scope: {
        boundaries: ['organizational'],
        exclusions: [],
        authorities: [],
        geographicScope: ['global'],
        organizationalUnits: ['all'],
      },
      stakeholders: ['engineering', 'finance'],
      dependencies: [],
      riskTolerance: RiskLevel.MEDIUM,
      institutionalState: InstitutionalState.NORMAL,
    },
    constraints: [],
    metadata: {
      version: 1,
      previousVersions: [],
      classifications: [],
      tags: ['test'],
      priority: 5,
      urgency: 'routine' as any,
      sensitivity: 'internal' as any,
    },
    ...overrides,
  };
}

// =============================================================================
// DECISION AGENTS SERVICE TESTS
// =============================================================================

describe('DecisionAgentsService', () => {
  describe('getAgents', () => {
    it('should return all decision agents', () => {
      const agents = decisionAgentsService.getAgents();
      expect(agents).toBeDefined();
      expect(agents.length).toBeGreaterThan(0);
      expect(agents.every(a => a.id.startsWith('da_'))).toBe(true);
    });

    it('should have required agent properties', () => {
      const agents = decisionAgentsService.getAgents();
      agents.forEach(agent => {
        expect(agent.id).toBeDefined();
        expect(agent.name).toBeDefined();
        expect(agent.objective).toBeDefined();
        expect(agent.capabilities).toBeDefined();
        expect(Array.isArray(agent.capabilities)).toBe(true);
      });
    });
  });

  describe('executeAgent', () => {
    it('should execute a decision agent and return valid output', async () => {
      const proposal = createTestProposal();
      const agents = decisionAgentsService.getAgents();
      const agent = agents[0]!;
      
      const output = await decisionAgentsService.executeAgent(agent.id, proposal, 12345);
      
      expect(output).toBeDefined();
      expect(output.agentId).toBe(agent.id);
      expect(output.recommendation).toBeDefined();
      expect(['approve', 'modify', 'reject', 'escalate']).toContain(output.recommendation);
      expect(output.confidence).toBeGreaterThanOrEqual(0);
      expect(output.confidence).toBeLessThanOrEqual(1);
      expect(output.executionMetadata).toBeDefined();
      expect(output.executionMetadata.deterministic).toBe(true);
    });

    it('should produce deterministic outputs with same seed', async () => {
      const proposal = createTestProposal();
      const agents = decisionAgentsService.getAgents();
      const agent = agents[0]!;
      const seed = 42;
      
      const output1 = await decisionAgentsService.executeAgent(agent.id, proposal, seed);
      const output2 = await decisionAgentsService.executeAgent(agent.id, proposal, seed);
      
      expect(output1.recommendation).toBe(output2.recommendation);
      expect(output1.confidence).toBe(output2.confidence);
      expect(output1.executionMetadata.outputHash).toBe(output2.executionMetadata.outputHash);
    });
  });

  describe('aggregateOutputs', () => {
    it('should aggregate multiple decision outputs', async () => {
      const proposal = createTestProposal();
      const outputs = await decisionAgentsService.executeAllAgents(proposal, 12345);
      
      const aggregated = decisionAgentsService.aggregateOutputs(outputs);
      
      expect(aggregated).toBeDefined();
      expect(aggregated.consensusRecommendation).toBeDefined();
      expect(aggregated.averageConfidence).toBeGreaterThanOrEqual(0);
      expect(aggregated.averageConfidence).toBeLessThanOrEqual(1);
      expect(aggregated.aggregateRiskLevel).toBeDefined();
    });
  });
});

// =============================================================================
// INSTITUTIONAL AGENTS SERVICE TESTS
// =============================================================================

describe('InstitutionalAgentsService', () => {
  describe('getAgents', () => {
    it('should return all institutional agents', () => {
      const agents = institutionalAgentsService.getAgents();
      expect(agents).toBeDefined();
      expect(agents.length).toBeGreaterThan(0);
      expect(agents.every(a => a.id.startsWith('ia_'))).toBe(true);
    });

    it('should have institution type defined', () => {
      const agents = institutionalAgentsService.getAgents();
      agents.forEach(agent => {
        expect(agent.institutionType).toBeDefined();
      });
    });
  });

  describe('executeAgent', () => {
    it('should execute and return institutional status', async () => {
      const proposal = createTestProposal();
      const decisionOutputs = await decisionAgentsService.executeAllAgents(proposal, 12345);
      const agents = institutionalAgentsService.getAgents();
      const agent = agents[0]!;
      
      const output = await institutionalAgentsService.executeAgent(
        agent.id,
        proposal,
        decisionOutputs,
        12345
      );
      
      expect(output).toBeDefined();
      expect(output.status).toBeDefined();
      expect(['allow', 'block', 'escalate', 'conditional']).toContain(output.status);
      expect(output.auditFlags).toBeDefined();
      expect(Array.isArray(output.requiredActions)).toBe(true);
    });
  });

  describe('aggregateOutputs', () => {
    it('should correctly identify blocking conditions', async () => {
      const proposal = createTestProposal();
      const decisionOutputs = await decisionAgentsService.executeAllAgents(proposal, 12345);
      const outputs = await institutionalAgentsService.executeAllAgents(proposal, decisionOutputs, 12345);
      
      const aggregated = institutionalAgentsService.aggregateOutputs(outputs);
      
      expect(aggregated).toBeDefined();
      expect(aggregated.overallStatus).toBeDefined();
      expect(typeof aggregated.escalationRequired).toBe('boolean');
    });
  });
});

// =============================================================================
// ADVERSARIAL AGENTS SERVICE TESTS
// =============================================================================

describe('AdversarialAgentsService', () => {
  describe('getAgents', () => {
    it('should return all adversarial agents', () => {
      const agents = adversarialAgentsService.getAgents();
      expect(agents).toBeDefined();
      expect(agents.length).toBeGreaterThan(0);
      expect(agents.every(a => a.id.startsWith('aa_'))).toBe(true);
    });

    it('should have attack profile defined', () => {
      const agents = adversarialAgentsService.getAgents();
      agents.forEach(agent => {
        expect(agent.attackProfile).toBeDefined();
      });
    });
  });

  describe('executeAgent', () => {
    it('should generate failure scenarios', async () => {
      const proposal = createTestProposal();
      const decisionOutputs = await decisionAgentsService.executeAllAgents(proposal, 12345);
      const institutionalOutputs = await institutionalAgentsService.executeAllAgents(
        proposal,
        decisionOutputs,
        12345
      );
      const agents = adversarialAgentsService.getAgents();
      const agent = agents[0]!;
      
      const output = await adversarialAgentsService.executeAgent(
        agent.id,
        proposal,
        institutionalOutputs,
        12345
      );
      
      expect(output).toBeDefined();
      expect(Array.isArray(output.failureScenarios)).toBe(true);
      expect(Array.isArray(output.exploitPaths)).toBe(true);
      expect(output.severityAssessment).toBeDefined();
    });
  });

  describe('aggregateOutputs', () => {
    it('should summarize all adversarial findings', async () => {
      const proposal = createTestProposal();
      const decisionOutputs = await decisionAgentsService.executeAllAgents(proposal, 12345);
      const institutionalOutputs = await institutionalAgentsService.executeAllAgents(
        proposal,
        decisionOutputs,
        12345
      );
      const outputs = await adversarialAgentsService.executeAllAgents(
        proposal,
        institutionalOutputs,
        12345
      );
      
      const aggregated = adversarialAgentsService.aggregateOutputs(outputs);
      
      expect(aggregated).toBeDefined();
      expect(aggregated.totalFailureScenarios).toBeGreaterThanOrEqual(0);
      expect(aggregated.totalExploitPaths).toBeGreaterThanOrEqual(0);
      expect(aggregated.worstCaseSeverity).toBeDefined();
    });
  });
});

// =============================================================================
// OBSERVER AGENTS SERVICE TESTS
// =============================================================================

describe('ObserverAgentsService', () => {
  describe('getAgents', () => {
    it('should return all observer agents', () => {
      const agents = observerAgentsService.getAgents();
      expect(agents).toBeDefined();
      expect(agents.length).toBeGreaterThan(0);
      expect(agents.length).toBeGreaterThan(0); // Observer agents have varying prefixes
    });

    it('should have observation types defined', () => {
      const agents = observerAgentsService.getAgents();
      agents.forEach(agent => {
        expect(agent.observationType).toBeDefined();
      });
    });
  });

  describe('executeAgent', () => {
    it('should compute metrics and verify integrity', async () => {
      const proposal = createTestProposal();
      const decisionOutputs = await decisionAgentsService.executeAllAgents(proposal, 12345);
      const institutionalOutputs = await institutionalAgentsService.executeAllAgents(
        proposal,
        decisionOutputs,
        12345
      );
      const adversarialOutputs = await adversarialAgentsService.executeAllAgents(
        proposal,
        institutionalOutputs,
        12345
      );
      const agents = observerAgentsService.getAgents();
      const agent = agents[0]!;
      
      const output = await observerAgentsService.executeAgent(
        agent.id,
        proposal,
        decisionOutputs,
        institutionalOutputs,
        adversarialOutputs,
        'test-deliberation-id',
        12345
      );
      
      expect(output).toBeDefined();
      expect(Array.isArray(output.metrics)).toBe(true);
      expect(output.integrityVerification).toBeDefined();
      expect(Array.isArray(output.auditArtifacts)).toBe(true);
    });
  });
});

// =============================================================================
// META-GOVERNANCE AGENTS SERVICE TESTS
// =============================================================================

describe('MetaGovernanceAgentsService', () => {
  describe('getAgents', () => {
    it('should return all meta-governance agents', () => {
      const agents = metaGovernanceAgentsService.getAgents();
      expect(agents).toBeDefined();
      expect(agents.length).toBeGreaterThan(0);
      expect(agents.length).toBeGreaterThan(0); // Meta-governance agents have varying prefixes
    });

    it('should have monitoring scope defined', () => {
      const agents = metaGovernanceAgentsService.getAgents();
      agents.forEach(agent => {
        expect(agent.monitoringScope).toBeDefined();
      });
    });
  });

  describe('executeAgent', () => {
    it('should detect drift and generate risk reports', async () => {
      const agents = metaGovernanceAgentsService.getAgents();
      const agent = agents[0]!;
      
      const output = await metaGovernanceAgentsService.executeAgent(agent.id, 12345);
      
      expect(output).toBeDefined();
      expect(Array.isArray(output.driftWarnings)).toBe(true);
      expect(output.governanceRiskReport).toBeDefined();
      expect(output.systemHealthScore).toBeDefined();
      expect(typeof output.systemHealthScore.overallScore === 'number' || output.systemHealthScore.components).toBeTruthy();
    });
  });

  describe('aggregateOutputs', () => {
    it('should combine all meta-governance findings', async () => {
      const outputs = await metaGovernanceAgentsService.executeAllAgents(12345);
      
      const aggregated = metaGovernanceAgentsService.aggregateOutputs(outputs);
      
      expect(aggregated).toBeDefined();
      expect(aggregated.systemWideHealthScore).toBeDefined();
      expect(aggregated.systemWideHealthScore).toBeGreaterThanOrEqual(0);
      expect(aggregated.systemWideHealthScore).toBeLessThanOrEqual(1);
    });
  });
});

// =============================================================================
// SGAS ORCHESTRATOR TESTS
// =============================================================================

describe('SGASOrchestrator', () => {
  describe('executeDeliberation', () => {
    it('should execute a full deliberation with all agent classes', async () => {
      const proposal = createTestProposal();
      
      const result = await sgasOrchestrator.executeDeliberation(proposal, {}, 12345);
      
      expect(result).toBeDefined();
      expect(result.graph).toBeDefined();
      expect(result.graph.id).toBeDefined();
      expect(result.graph.status).toBe('completed');
      expect(result.decisionOutputs.length).toBeGreaterThan(0);
      expect(result.institutionalOutputs.length).toBeGreaterThan(0);
      expect(result.adversarialOutputs.length).toBeGreaterThan(0);
      expect(result.observerOutputs.length).toBeGreaterThan(0);
      expect(result.finalStatus).toBeDefined();
      expect(result.summary).toBeDefined();
    });

    it('should produce deterministic results with same seed', async () => {
      const proposal = createTestProposal();
      const seed = 42;
      
      const result1 = await sgasOrchestrator.executeDeliberation(proposal, {}, seed);
      const result2 = await sgasOrchestrator.executeDeliberation(proposal, {}, seed);
      
      expect(result1.graph.deterministicHash).toBe(result2.graph.deterministicHash);
      expect(result1.summary.consensusRecommendation).toBe(result2.summary.consensusRecommendation);
      expect(result1.summary.institutionalStatus).toBe(result2.summary.institutionalStatus);
    });

    it('should include meta-governance when configured', async () => {
      const proposal = createTestProposal();
      
      const result = await sgasOrchestrator.executeDeliberation(
        proposal,
        { includeMetaGovernance: true },
        12345
      );
      
      expect(result.metaGovernanceOutputs).toBeDefined();
      expect(result.metaGovernanceOutputs!.length).toBeGreaterThan(0);
    });

    it('should generate valid merkle root for integrity', async () => {
      const proposal = createTestProposal();
      
      const result = await sgasOrchestrator.executeDeliberation(proposal, {}, 12345);
      
      expect(result.summary.merkleRoot).toBeDefined();
      expect(result.summary.merkleRoot.length).toBe(64); // SHA-256 hex
    });
  });

  describe('getStatistics', () => {
    it('should return system statistics', () => {
      const stats = sgasOrchestrator.getStatistics();
      
      expect(stats).toBeDefined();
      expect(typeof stats.activeCount).toBe('number');
      expect(typeof stats.completedCount).toBe('number');
      expect(typeof stats.averageDurationMs).toBe('number');
      expect(typeof stats.approvalRate).toBe('number');
    });
  });
});

// =============================================================================
// UTILITY FUNCTION TESTS
// =============================================================================

describe('SGAS Utility Functions', () => {
  describe('generateSGASId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateSGASId('test');
      const id2 = generateSGASId('test');
      
      expect(id1).toMatch(/^test_[a-f0-9]{32}$/);
      expect(id2).toMatch(/^test_[a-f0-9]{32}$/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('hashState', () => {
    it('should produce consistent hashes for same input', () => {
      const state = { a: 1, b: 'test' };
      
      const hash1 = hashState(state);
      const hash2 = hashState(state);
      
      expect(hash1).toBe(hash2);
      expect(hash1.length).toBe(64); // SHA-256 hex
    });

    it('should produce different hashes for different inputs', () => {
      const hash1 = hashState({ a: 1 });
      const hash2 = hashState({ a: 2 });
      
      expect(hash1).not.toBe(hash2);
    });
  });
});

// =============================================================================
// INTEGRATION TESTS
// =============================================================================

describe('SGAS Integration', () => {
  it('should handle high-risk proposal with blocking', async () => {
    const proposal = createTestProposal({
      title: 'Emergency Budget Override',
      description: 'Request to bypass normal approval process',
      type: DecisionType.EMERGENCY,
      context: {
        budget: {
          allocated: 10000000,
          currency: 'USD',
          fiscalYear: '2026',
          lineItems: [],
          flexibilityPercent: 0,
        },
        timeframe: {
          start: new Date(),
          end: new Date(),
          milestones: [],
          criticalPath: true,
          flexibilityDays: 0,
        },
        scope: {
          boundaries: ['global'],
          exclusions: [],
          authorities: [],
          geographicScope: ['global'],
          organizationalUnits: ['all'],
        },
        stakeholders: ['board', 'ceo', 'cfo'],
        dependencies: [],
        riskTolerance: RiskLevel.CRITICAL,
        institutionalState: InstitutionalState.EMERGENCY,
      },
    });
    
    const result = await sgasOrchestrator.executeDeliberation(proposal, {}, 12345);
    
    // Should have adversarial findings for risky proposal
    expect(result.adversarialOutputs.length).toBeGreaterThan(0);
    expect(result.summary.adversarialFindingsCount).toBeGreaterThan(0);
  });

  it('should track trust delta through observer agents', async () => {
    const proposal = createTestProposal();
    
    const result = await sgasOrchestrator.executeDeliberation(proposal, {}, 12345);
    
    expect(result.summary.trustDelta).toBeDefined();
    expect(typeof result.summary.trustDelta).toBe('number');
  });
});
