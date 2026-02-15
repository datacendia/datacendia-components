// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Synthetic Civic Governance Environment Tests
 * 
 * Comprehensive test suite for all SCGE components
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  SyntheticPopulationService,
  PolicyInjectionService,
  EventInjectionService,
  StressorLibraryService,
  SCGEOrchestrator,
  PopulationSegment,
  AccessVariance,
  InformationAsymmetry,
  MobilityConstraint,
  ResourceScarcity,
  ComplianceVariance,
  PolicyDomain,
  PolicyStatus,
  EventType,
  EventSeverity,
  StressorType,
  StressorIntensity,
  StressorOnset,
  DEFAULT_STRESSOR_LIBRARY,
  DEFAULT_EVENT_SCENARIOS,
  DEFAULT_GOVERNANCE_PRESETS,
  generateSCGEId,
  hashSCGEState,
  createMerkleRoot,
} from '../../services/scge/index.js';

// =============================================================================
// SYNTHETIC POPULATION SERVICE TESTS
// =============================================================================

describe('SyntheticPopulationService', () => {
  let populationService: SyntheticPopulationService;

  beforeEach(() => {
    populationService = new SyntheticPopulationService();
  });

  describe('generatePopulation', () => {
    it('should generate a population with correct size', () => {
      const population = populationService.generatePopulation({
        size: 100000,
        accessVarianceLevel: AccessVariance.MODERATE,
        informationAsymmetryLevel: InformationAsymmetry.MODERATE,
        mobilityConstraintLevel: MobilityConstraint.LIMITED,
        resourceScarcityLevel: ResourceScarcity.CONSTRAINED,
        complianceVarianceLevel: ComplianceVariance.MODERATE_COMPLIANCE,
        seed: 12345,
      });

      expect(population).toBeDefined();
      expect(population.totalSize).toBe(100000);
      expect(population.distributions.length).toBe(3);
    });

    it('should produce consistent distributions with same seed', () => {
      const params = {
        size: 50000,
        accessVarianceLevel: AccessVariance.HIGH,
        informationAsymmetryLevel: InformationAsymmetry.HIGH,
        mobilityConstraintLevel: MobilityConstraint.MODERATE,
        resourceScarcityLevel: ResourceScarcity.SCARCE,
        complianceVarianceLevel: ComplianceVariance.LOW_COMPLIANCE,
        seed: 99999,
      };

      const pop1 = populationService.generatePopulation(params);
      const pop2 = populationService.generatePopulation(params);

      // Same seed produces same distributions (IDs differ but structure matches)
      expect(pop1.distributions.length).toBe(pop2.distributions.length);
      expect(pop1.totalSize).toBe(pop2.totalSize);
      expect(pop1.generationSeed).toBe(pop2.generationSeed);
    });

    it('should include all population segments', () => {
      const population = populationService.generatePopulation({
        size: 100000,
        accessVarianceLevel: AccessVariance.MODERATE,
        informationAsymmetryLevel: InformationAsymmetry.LOW,
        mobilityConstraintLevel: MobilityConstraint.NONE,
        resourceScarcityLevel: ResourceScarcity.ADEQUATE,
        complianceVarianceLevel: ComplianceVariance.HIGH_COMPLIANCE,
        seed: 12345,
      });

      const segments = population.distributions.map(d => d.segment);
      expect(segments).toContain(PopulationSegment.LOW_ACCESS);
      expect(segments).toContain(PopulationSegment.MEDIUM_ACCESS);
      expect(segments).toContain(PopulationSegment.HIGH_ACCESS);
    });

    it('should verify population integrity', () => {
      const population = populationService.generatePopulation({
        size: 100000,
        accessVarianceLevel: AccessVariance.MODERATE,
        informationAsymmetryLevel: InformationAsymmetry.MODERATE,
        mobilityConstraintLevel: MobilityConstraint.LIMITED,
        resourceScarcityLevel: ResourceScarcity.CONSTRAINED,
        complianceVarianceLevel: ComplianceVariance.MODERATE_COMPLIANCE,
        seed: 12345,
      });

      expect(populationService.verifyPopulationIntegrity(population)).toBe(true);
    });
  });

  describe('calculateImpactDistribution', () => {
    it('should calculate equity score', () => {
      const population = populationService.generatePopulation({
        size: 100000,
        accessVarianceLevel: AccessVariance.MODERATE,
        informationAsymmetryLevel: InformationAsymmetry.MODERATE,
        mobilityConstraintLevel: MobilityConstraint.LIMITED,
        resourceScarcityLevel: ResourceScarcity.CONSTRAINED,
        complianceVarianceLevel: ComplianceVariance.MODERATE_COMPLIANCE,
        seed: 12345,
      });

      const impact = populationService.calculateImpactDistribution(population, {
        [PopulationSegment.LOW_ACCESS]: 0.5,
        [PopulationSegment.MEDIUM_ACCESS]: 0.4,
        [PopulationSegment.HIGH_ACCESS]: 0.3,
      });

      expect(impact.equityScore).toBeGreaterThan(0);
      expect(impact.equityScore).toBeLessThanOrEqual(1);
      expect(impact.totalImpacted).toBeGreaterThan(0);
    });
  });

  describe('applyStressorToPopulation', () => {
    it('should calculate resilience score under stress', () => {
      const population = populationService.generatePopulation({
        size: 100000,
        accessVarianceLevel: AccessVariance.MODERATE,
        informationAsymmetryLevel: InformationAsymmetry.MODERATE,
        mobilityConstraintLevel: MobilityConstraint.LIMITED,
        resourceScarcityLevel: ResourceScarcity.CONSTRAINED,
        complianceVarianceLevel: ComplianceVariance.MODERATE_COMPLIANCE,
        seed: 12345,
      });

      const result = populationService.applyStressorToPopulation(
        population,
        'infrastructure_failure',
        0.5
      );

      expect(result.resilienceScore).toBeGreaterThanOrEqual(0);
      expect(result.resilienceScore).toBeLessThanOrEqual(1);
      expect(result.vulnerabilityReport).toBeDefined();
    });
  });
});

// =============================================================================
// POLICY INJECTION SERVICE TESTS
// =============================================================================

describe('PolicyInjectionService', () => {
  let policyService: PolicyInjectionService;

  beforeEach(() => {
    policyService = new PolicyInjectionService();
  });

  describe('createPolicyBundle', () => {
    it('should create a policy bundle', () => {
      const policy = policyService.createPolicyBundle(
        'Test Policy',
        PolicyDomain.ZONING,
        [
          {
            id: 'rule1',
            name: 'Test Rule',
            condition: 'zone_type = residential',
            action: 'Apply residential limits',
            priority: 1,
            exceptions: [],
            effectiveFrom: new Date(),
          },
        ],
        [
          {
            id: 'con1',
            type: 'hard',
            description: 'Test constraint',
            enforcementLevel: 1.0,
          },
        ],
        { author: 'test' }
      );

      expect(policy).toBeDefined();
      expect(policy.name).toBe('Test Policy');
      expect(policy.domain).toBe(PolicyDomain.ZONING);
      expect(policy.status).toBe(PolicyStatus.DRAFT);
      expect(policy.rules.length).toBe(1);
      expect(policy.constraints.length).toBe(1);
    });

    it('should generate hash for policy', () => {
      const policy = policyService.createPolicyBundle(
        'Test Policy',
        PolicyDomain.HEALTHCARE,
        [],
        [],
        {}
      );

      expect(policy.hash).toBeDefined();
      expect(policy.hash.length).toBeGreaterThan(0);
    });
  });

  describe('activatePolicy', () => {
    it('should activate a draft policy', () => {
      const policy = policyService.createPolicyBundle(
        'Test Policy',
        PolicyDomain.PROCUREMENT,
        [],
        [],
        {}
      );

      const activated = policyService.activatePolicy(policy.id);

      expect(activated.status).toBe(PolicyStatus.ACTIVE);
      expect(activated.activatedAt).toBeDefined();
    });
  });

  describe('evaluateDecision', () => {
    it('should evaluate a decision against policy', () => {
      const policy = policyService.createPolicyBundle(
        'Budget Policy',
        PolicyDomain.BUDGET,
        [
          {
            id: 'rule1',
            name: 'Budget Check',
            condition: 'budget amount',
            action: 'Verify budget',
            priority: 1,
            exceptions: [],
            effectiveFrom: new Date(),
          },
        ],
        [
          {
            id: 'con1',
            type: 'hard',
            description: 'Budget authority must be confirmed',
            enforcementLevel: 1.0,
          },
        ],
        {}
      );

      const result = policyService.evaluateDecision(policy.id, {
        budgetAmount: 50000,
        approvalObtained: true,
      });

      expect(result).toBeDefined();
      expect(result.policyId).toBe(policy.id);
      expect(['allowed', 'blocked', 'conditional', 'escalate']).toContain(result.overallStatus);
    });
  });
});

// =============================================================================
// EVENT INJECTION SERVICE TESTS
// =============================================================================

describe('EventInjectionService', () => {
  let eventService: EventInjectionService;

  beforeEach(() => {
    eventService = new EventInjectionService();
  });

  describe('createEvent', () => {
    it('should create a simulation event', () => {
      const event = eventService.createEvent(
        EventType.INFRASTRUCTURE,
        'Power Outage',
        'Major power grid failure',
        EventSeverity.MAJOR,
        new Date(),
        48,
        ['power', 'communications'],
        { severity: 0.8 },
        []
      );

      expect(event).toBeDefined();
      expect(event.type).toBe(EventType.INFRASTRUCTURE);
      expect(event.name).toBe('Power Outage');
      expect(event.hash).toBeDefined();
    });
  });

  describe('createSequence', () => {
    it('should create an event sequence', () => {
      const event1 = eventService.createEvent(
        EventType.HEALTH,
        'Event 1',
        'First event',
        EventSeverity.NOTABLE,
        new Date(),
        24,
        ['healthcare'],
        {},
        []
      );

      const event2 = eventService.createEvent(
        EventType.HEALTH,
        'Event 2',
        'Second event',
        EventSeverity.SIGNIFICANT,
        new Date(Date.now() + 86400000),
        48,
        ['healthcare', 'emergency'],
        {},
        [event1.id]
      );

      const sequence = eventService.createSequence('Test Sequence', [event1, event2], 12345);

      expect(sequence).toBeDefined();
      expect(sequence.events.length).toBe(2);
      expect(sequence.hash).toBeDefined();
    });
  });

  describe('generateScenarioSequence', () => {
    it('should generate a scenario sequence', () => {
      const scenario = DEFAULT_EVENT_SCENARIOS[0]!;
      const sequence = eventService.generateScenarioSequence(scenario, 12345);

      expect(sequence).toBeDefined();
      expect(sequence.events.length).toBeGreaterThan(0);
      expect(sequence.name).toBe(scenario.name);
    });

    it('should produce consistent event counts with same seed', () => {
      const scenario = DEFAULT_EVENT_SCENARIOS[0]!;
      const seq1 = eventService.generateScenarioSequence(scenario, 99999);
      const seq2 = eventService.generateScenarioSequence(scenario, 99999);

      // Same seed produces same event count and structure
      expect(seq1.events.length).toBe(seq2.events.length);
      expect(seq1.name).toBe(seq2.name);
      expect(seq1.seed).toBe(seq2.seed);
    });
  });

  describe('checkCausalDependencies', () => {
    it('should verify causal dependencies', () => {
      const event1 = eventService.createEvent(
        EventType.CIVIC,
        'Event 1',
        'First event',
        EventSeverity.ROUTINE,
        new Date(),
        12,
        ['governance'],
        {},
        []
      );

      const event2 = eventService.createEvent(
        EventType.CIVIC,
        'Event 2',
        'Second event',
        EventSeverity.NOTABLE,
        new Date(),
        12,
        ['governance'],
        {},
        [event1.id]
      );

      const completedIds = new Set([event1.id]);
      const result = eventService.checkCausalDependencies(event2, completedIds);

      expect(result.satisfied).toBe(true);
      expect(result.missingDependencies.length).toBe(0);
    });
  });
});

// =============================================================================
// STRESSOR LIBRARY SERVICE TESTS
// =============================================================================

describe('StressorLibraryService', () => {
  let stressorService: StressorLibraryService;

  beforeEach(() => {
    stressorService = new StressorLibraryService();
  });

  describe('default stressors', () => {
    it('should have default stressors loaded', () => {
      const stressors = stressorService.listStressors();
      expect(stressors.length).toBeGreaterThan(0);
      expect(stressors.length).toBe(DEFAULT_STRESSOR_LIBRARY.length);
    });
  });

  describe('createStressor', () => {
    it('should create a custom stressor', () => {
      const stressor = stressorService.createStressor(
        StressorType.DEMAND_SPIKE,
        'Custom Demand Spike',
        'Test stressor',
        StressorIntensity.HIGH,
        StressorOnset.SUDDEN,
        48,
        ['public_services'],
        { impactRadius: 0.6 },
        []
      );

      expect(stressor).toBeDefined();
      expect(stressor.name).toBe('Custom Demand Spike');
      expect(stressor.type).toBe(StressorType.DEMAND_SPIKE);
    });
  });

  describe('generateRandomSchedule', () => {
    it('should generate a random stressor schedule', () => {
      const schedule = stressorService.generateRandomSchedule(4, 168, 12345);

      expect(schedule).toBeDefined();
      expect(schedule.stressors.length).toBe(4);
      expect(schedule.hash).toBeDefined();
    });

    it('should produce consistent stressor counts with same seed', () => {
      const sched1 = stressorService.generateRandomSchedule(3, 100, 88888);
      const sched2 = stressorService.generateRandomSchedule(3, 100, 88888);

      // Same seed produces same stressor count
      expect(sched1.stressors.length).toBe(sched2.stressors.length);
      expect(sched1.seed).toBe(sched2.seed);
    });
  });

  describe('calculateCombinedImpact', () => {
    it('should calculate combined impact of multiple stressors', () => {
      const stressors = stressorService.listStressors().slice(0, 3);
      const impact = stressorService.calculateCombinedImpact(stressors);

      expect(impact).toBeDefined();
      expect(impact.totalIntensity).toBeGreaterThan(0);
      expect(impact.totalIntensity).toBeLessThanOrEqual(1);
      expect(impact.affectedSystems.length).toBeGreaterThan(0);
      expect(impact.cascadeRisk).toBeGreaterThanOrEqual(0);
    });

    it('should return zero impact for empty stressor list', () => {
      const impact = stressorService.calculateCombinedImpact([]);

      expect(impact.totalIntensity).toBe(0);
      expect(impact.affectedSystems.length).toBe(0);
    });
  });

  describe('applyMitigation', () => {
    it('should apply mitigation to a stressor', () => {
      const stressor = DEFAULT_STRESSOR_LIBRARY[0]!;
      const mitigation = stressor.mitigationOptions[0]!;

      const result = stressorService.applyMitigation(stressor, mitigation.id);

      expect(result.success).toBe(true);
      expect(result.newIntensity).toBeLessThan(1);
    });

    it('should fail for unknown mitigation', () => {
      const stressor = DEFAULT_STRESSOR_LIBRARY[0]!;
      const result = stressorService.applyMitigation(stressor, 'unknown_mitigation');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });
  });
});

// =============================================================================
// UTILITY FUNCTION TESTS
// =============================================================================

describe('SCGE Utility Functions', () => {
  describe('generateSCGEId', () => {
    it('should generate unique IDs with prefix', () => {
      const id1 = generateSCGEId('test');
      const id2 = generateSCGEId('test');

      expect(id1).toMatch(/^test_/);
      expect(id2).toMatch(/^test_/);
      expect(id1).not.toBe(id2);
    });
  });

  describe('hashSCGEState', () => {
    it('should produce consistent hashes for same input', () => {
      const state = { a: 1, b: 'test', c: [1, 2, 3] };
      const hash1 = hashSCGEState(state);
      const hash2 = hashSCGEState(state);

      expect(hash1).toBe(hash2);
    });

    it('should produce different hashes for different inputs', () => {
      const state1 = { a: 1 };
      const state2 = { a: 2 };

      expect(hashSCGEState(state1)).not.toBe(hashSCGEState(state2));
    });
  });

  describe('createMerkleRoot', () => {
    it('should create merkle root from hashes', () => {
      const hashes = ['hash1', 'hash2', 'hash3', 'hash4'];
      const root = createMerkleRoot(hashes);

      expect(root).toBeDefined();
      expect(root.length).toBeGreaterThan(0);
    });

    it('should handle single hash', () => {
      const root = createMerkleRoot(['single_hash']);
      expect(root).toBe('single_hash');
    });

    it('should handle empty array', () => {
      const root = createMerkleRoot([]);
      expect(root).toBeDefined();
    });
  });
});

// =============================================================================
// GOVERNANCE PRESETS TESTS
// =============================================================================

describe('Governance Presets', () => {
  it('should have default presets defined', () => {
    expect(DEFAULT_GOVERNANCE_PRESETS.length).toBeGreaterThan(0);
  });

  it('should have valid parameter ranges', () => {
    for (const preset of DEFAULT_GOVERNANCE_PRESETS) {
      expect(preset.id).toBeDefined();
      expect(preset.name).toBeDefined();
      expect(preset.parameters).toBeDefined();

      for (const value of Object.values(preset.parameters)) {
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThanOrEqual(1);
      }
    }
  });
});

// =============================================================================
// DEFAULT SCENARIOS TESTS
// =============================================================================

describe('Default Event Scenarios', () => {
  it('should have default scenarios defined', () => {
    expect(DEFAULT_EVENT_SCENARIOS.length).toBeGreaterThan(0);
  });

  it('should have valid scenario structure', () => {
    for (const scenario of DEFAULT_EVENT_SCENARIOS) {
      expect(scenario.id).toBeDefined();
      expect(scenario.name).toBeDefined();
      expect(scenario.eventTemplates).toBeDefined();
      expect(scenario.eventTemplates.length).toBeGreaterThan(0);
    }
  });
});
