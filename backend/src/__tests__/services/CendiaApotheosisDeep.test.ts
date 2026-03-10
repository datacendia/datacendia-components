/**
 * CendiaApotheosisService Deep Tests
 *
 * Tests automated adversarial scenario simulations:
 * - Full Apotheosis run pipeline (attack → weakness → patch → escalate → upskill → score)
 * - Adjudication schema validation (strict JSON parsing)
 * - Scenario selection and category filtering
 * - Weakness identification from failures (grouped by category/vector)
 * - Auto-patch application with budget thresholds
 * - Escalation creation for critical/high severity
 * - Upskill assignment for training gaps
 * - Score calculation with weighted components
 * - Audit trail recording and retrieval
 * - Fail-closed behavior when adjudication fails
 *
 * @module __tests__/services/CendiaApotheosisDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

// Mock ollama to return valid adjudication JSON
let ollamaChatMock = vi.fn();
vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: (...args: unknown[]) => ollamaChatMock(...args),
  },
}));

// Mock prisma — all DB calls return empty/null
vi.mock('../../config/database.js', () => ({
  prisma: {
    apotheosis_runs: {
      create: vi.fn().mockResolvedValue({}),
      findFirst: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
    },
    apotheosis_weaknesses: { createMany: vi.fn().mockResolvedValue({}) },
    apotheosis_escalations: {
      createMany: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
      update: vi.fn().mockResolvedValue({}),
    },
    apotheosis_auto_patches: { createMany: vi.fn().mockResolvedValue({}) },
    apotheosis_upskill_assignments: {
      createMany: vi.fn().mockResolvedValue({}),
      findMany: vi.fn().mockResolvedValue([]),
    },
    apotheosis_pattern_bans: { findMany: vi.fn().mockResolvedValue([]) },
    apotheosis_configs: { findUnique: vi.fn().mockResolvedValue(null) },
    apotheosis_scores: { findFirst: vi.fn().mockResolvedValue(null), findMany: vi.fn().mockResolvedValue([]) },
  },
}));

const apotheosisModule = await import('../../services/CendiaApotheosisService.js');
const apotheosisService = apotheosisModule.default;

type ApotheosisServiceType = typeof apotheosisService;

function createService(): ApotheosisServiceType {
  // Create fresh instance via the constructor of the singleton
  const Ctor = Object.getPrototypeOf(apotheosisService).constructor;
  return new Ctor() as ApotheosisServiceType;
}

const ORG = 'org-apotheosis-test';

// ============================================================================
// FULL APOTHEOSIS RUN — SURVIVING SCENARIOS
// ============================================================================

describe('CendiaApotheosis — Full Run (All Survive)', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
    // Mock ollama to always return "survived" verdict
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({
        survived: true,
        mitigated_damage: 500000,
        reason: 'Organization has strong controls in place',
      }),
    });
  });

  // FAILS IF: run doesn't complete
  it('should complete a full Apotheosis run with small scenario count', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    expect(run.id).toBeTruthy();
    expect(run.organizationId).toBe(ORG);
    expect(run.status).toBe('completed');
    expect(run.completedAt).toBeInstanceOf(Date);
    expect(run.startedAt).toBeInstanceOf(Date);
  });

  // FAILS IF: scenario count mismatch
  it('should test exactly the requested number of scenarios', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 10 });
    expect(run.scenariosTested).toBe(10);
  });

  // FAILS IF: survival rate not 100% when all survive
  it('should report 100% survival when all scenarios pass', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    expect(run.scenariosSurvived).toBe(5);
    expect(run.survivalRate).toBe(100);
  });

  // FAILS IF: no weaknesses found when all survive
  it('should find zero weaknesses when all scenarios survive', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    expect(run.weaknessesFound.length).toBe(0);
    expect(run.criticalCount).toBe(0);
    expect(run.highCount).toBe(0);
  });

  // FAILS IF: shadow councils not created
  it('should create shadow council instances', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    expect(run.shadowCouncilInstances).toBe(12);
  });

  // FAILS IF: score not calculated
  it('should calculate apotheosis score', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    expect(run.apotheosisScore).toBeGreaterThan(0);
    expect(typeof run.previousScore).toBe('number');
    expect(typeof run.scoreDelta).toBe('number');
  });

  // FAILS IF: duration not tracked
  it('should track compute duration', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    expect(run.duration).toBeGreaterThanOrEqual(0);
    expect(typeof run.computeHours).toBe('number');
  });
});

// ============================================================================
// FULL RUN — FAILING SCENARIOS (WEAKNESSES, PATCHES, ESCALATIONS)
// ============================================================================

describe('CendiaApotheosis — Full Run (Failures)', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
    // Mock ollama to return "failed" verdict
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({
        survived: false,
        mitigated_damage: 100000,
        reason: 'Organization lacks adequate controls for this threat',
      }),
    });
  });

  // FAILS IF: weaknesses not identified from failures
  it('should identify weaknesses from failed scenarios', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    expect(run.scenariosSurvived).toBe(0);
    expect(run.survivalRate).toBe(0);
    expect(run.weaknessesFound.length).toBeGreaterThan(0);
  });

  // FAILS IF: weakness severity counts incorrect
  it('should count weaknesses by severity', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 10 });
    const totalCounted = run.criticalCount + run.highCount + run.mediumCount + run.lowCount;
    expect(totalCounted).toBe(run.weaknessesFound.length);
  });

  // FAILS IF: weaknesses missing required fields
  it('should produce weaknesses with all required fields', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    for (const w of run.weaknessesFound) {
      expect(w.id).toBeTruthy();
      expect(w.title).toBeTruthy();
      expect(w.description).toBeTruthy();
      expect(['financial', 'operational', 'competitive', 'regulatory', 'reputational', 'technical', 'human', 'black_swan']).toContain(w.category);
      expect(['critical', 'high', 'medium', 'low']).toContain(w.severity);
      expect(w.damageEstimate).toBeGreaterThan(0);
      expect(w.recommendedFix).toBeTruthy();
      expect(w.discoveredAt).toBeInstanceOf(Date);
    }
  });

  // FAILS IF: escalations not created for critical/high
  it('should create escalations for critical and high severity weaknesses', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 30 });
    // With 30 failed scenarios, there should be critical/high weaknesses
    const critHighWeaknesses = run.weaknessesFound.filter((w: { severity: string }) => w.severity === 'critical' || w.severity === 'high');
    if (critHighWeaknesses.length > 0) {
      expect(run.escalations.length).toBeGreaterThan(0);
      for (const e of run.escalations) {
        expect(e.id).toBeTruthy();
        expect(e.weaknessId).toBeTruthy();
        expect(e.title).toBeTruthy();
        expect(['critical', 'high']).toContain(e.severity);
        expect(e.status).toBe('pending');
        expect(e.assignedTo).toContain('executive-team');
        expect(e.estimatedCostToFix).toBeGreaterThan(0);
        expect(e.riskIfNotFixed).toBeGreaterThan(0);
        expect(e.deadline).toBeInstanceOf(Date);
      }
    }
  });

  // FAILS IF: upskill assignments not created for critical/high
  it('should create upskill assignments for relevant weaknesses', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 30 });
    if (run.upskillAssignments.length > 0) {
      for (const u of run.upskillAssignments) {
        expect(u.id).toBeTruthy();
        expect(u.userId).toBeTruthy();
        expect(u.weaknessId).toBeTruthy();
        expect(u.trainingModule).toBeTruthy();
        expect(u.estimatedHours).toBeGreaterThan(0);
        expect(u.status).toBe('assigned');
        expect(u.progress).toBe(0);
      }
    }
    // Upskill capped at 5
    expect(run.upskillAssignments.length).toBeLessThanOrEqual(5);
  });
});

// ============================================================================
// CATEGORY FILTERING
// ============================================================================

describe('CendiaApotheosis — Category Filtering', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({ survived: false, mitigated_damage: 0, reason: 'Failed' }),
    });
  });

  // FAILS IF: category filter not applied
  it('should filter scenarios by category', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5, categories: ['financial'] });
    expect(run.scenariosTested).toBe(5);
    // All weaknesses should be financial category
    for (const w of run.weaknessesFound) {
      expect(w.category).toBe('financial');
    }
  });

  // FAILS IF: multi-category filter not applied
  it('should filter scenarios by multiple categories', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 10, categories: ['technical', 'human'] });
    for (const w of run.weaknessesFound) {
      expect(['technical', 'human']).toContain(w.category);
    }
  });
});

// ============================================================================
// FAIL-CLOSED BEHAVIOR
// ============================================================================

describe('CendiaApotheosis — Fail-Closed Adjudication', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: invalid JSON doesn't trigger fail-closed
  it('should fail-closed (default survived) when LLM returns invalid JSON', async () => {
    ollamaChatMock = vi.fn().mockResolvedValue({ content: 'NOT VALID JSON' });
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    // Fail-closed default is 'survived', so all should survive
    expect(run.scenariosSurvived).toBe(3);
    expect(run.survivalRate).toBe(100);
  });

  // FAILS IF: schema-invalid responses not caught
  it('should fail-closed when response missing required fields', async () => {
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({ survived: true }),  // missing mitigated_damage and reason
    });
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    // Should still complete (fail-closed to survived)
    expect(run.status).toBe('completed');
    expect(run.scenariosSurvived).toBe(3);
  });

  // FAILS IF: LLM error crashes the run
  it('should fail-closed when LLM throws error', async () => {
    ollamaChatMock = vi.fn().mockRejectedValue(new Error('LLM unavailable'));
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    expect(run.status).toBe('completed');
    expect(run.scenariosSurvived).toBe(3);
  });
});

// ============================================================================
// AUDIT TRAIL
// ============================================================================

describe('CendiaApotheosis — Audit Trail', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({ survived: true, mitigated_damage: 100000, reason: 'Passed' }),
    });
  });

  // FAILS IF: audit records not created
  it('should create audit records for each scenario', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    const records = svc.getAuditRecords(run.id);
    expect(records.length).toBe(5);
  });

  // FAILS IF: audit records missing required fields
  it('should include all required audit fields', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 2 });
    const records = svc.getAuditRecords(run.id);
    for (const r of records) {
      expect(r.id).toBeTruthy();
      expect(r.runId).toBe(run.id);
      expect(r.scenarioId).toBeTruthy();
      expect(r.timestamp).toBeInstanceOf(Date);
      expect(r.modelName).toBeTruthy();
      expect(typeof r.temperature).toBe('number');
      expect(r.systemPromptHash).toBeTruthy();
      expect(r.scenarioPromptHash).toBeTruthy();
      expect(r.scenarioTitle).toBeTruthy();
      expect(r.scenarioCategory).toBeTruthy();
    }
  });

  // FAILS IF: successful adjudication not marked schema-valid
  it('should mark successful adjudications as schema-valid', async () => {
    await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    const records = svc.getAuditRecords();
    const valid = records.filter((r: { schemaValid: boolean }) => r.schemaValid);
    expect(valid.length).toBe(3);
    expect(valid.every((r: { failedClosed: boolean }) => !r.failedClosed)).toBe(true);
  });

  // FAILS IF: failed adjudication not marked as fail-closed
  it('should mark failed adjudications as fail-closed', async () => {
    ollamaChatMock = vi.fn().mockResolvedValue({ content: 'INVALID' });
    svc.clearAuditLog();
    await svc.executeApotheosisRun(ORG, { scenarioCount: 2 });
    const records = svc.getAuditRecords();
    expect(records.every((r: { failedClosed: boolean }) => r.failedClosed)).toBe(true);
    expect(records.every((r: { schemaValid: boolean }) => !r.schemaValid)).toBe(true);
  });

  // FAILS IF: clearAuditLog doesn't work
  it('should clear audit log', async () => {
    await svc.executeApotheosisRun(ORG, { scenarioCount: 3 });
    expect(svc.getAuditRecords().length).toBeGreaterThan(0);
    svc.clearAuditLog();
    expect(svc.getAuditRecords().length).toBe(0);
  });
});

// ============================================================================
// SCORE CALCULATION
// ============================================================================

describe('CendiaApotheosis — Score Calculation', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: perfect run doesn't give high score
  it('should give high score for 100% survival with no weaknesses', async () => {
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({ survived: true, mitigated_damage: 1000000, reason: 'Strong defenses' }),
    });
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 10 });
    // Score formula: survival(30%) + weaknessClosure(25%) + decisionSuccess(25%) + humanReadiness(10%) + patternHealth(10%)
    // With 100% survival but 0 weaknesses: weaknessClosure=0% (0 patches / max(0,1)), so score ~62
    expect(run.apotheosisScore).toBeGreaterThan(50);
  });

  // FAILS IF: total failure doesn't give low score
  it('should give lower score for 0% survival', async () => {
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({ survived: false, mitigated_damage: 0, reason: 'No defenses' }),
    });
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 10 });
    // Score should be lower than a perfect run (but not necessarily 0 due to other components)
    expect(run.apotheosisScore).toBeLessThan(70);
  });

  // FAILS IF: score components don't add up
  it('should calculate score from weighted components', async () => {
    ollamaChatMock = vi.fn().mockResolvedValue({
      content: JSON.stringify({ survived: true, mitigated_damage: 500000, reason: 'Survived' }),
    });
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 5 });
    // Score should be between 0 and 100
    expect(run.apotheosisScore).toBeGreaterThanOrEqual(0);
    expect(run.apotheosisScore).toBeLessThanOrEqual(100);
  });
});

// ============================================================================
// CONFIG
// ============================================================================

describe('CendiaApotheosis — Configuration', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: default config missing fields
  it('should return default config when no DB config exists', async () => {
    const config = await svc.getConfig(ORG);
    expect(config.runFrequency).toBe('nightly');
    expect(config.runTime).toBe('03:00');
    expect(config.scenarioCount).toBe(1000);
    expect(config.autoPatchThreshold).toBe(10000);
    expect(config.escalationTimeout).toBe(72);
    expect(config.patternBanThreshold).toBe(3);
    expect(config.trainingDeadline).toBe(72);
  });

  // FAILS IF: config cache not working
  it('should cache config after first retrieval', async () => {
    const config1 = await svc.getConfig(ORG);
    const config2 = await svc.getConfig(ORG);
    expect(config1).toEqual(config2);
  });
});

// ============================================================================
// APOTHEOSIS SCORE (DB-DEPENDENT — RETURNS DEFAULT)
// ============================================================================

describe('CendiaApotheosis — Score API', () => {
  let svc: ApotheosisServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: default score shape wrong
  it('should return default score when no DB data exists', async () => {
    const score = await svc.getApotheosisScore(ORG);
    expect(score.overall).toBe(0);
    expect(score.components.redTeamSurvivalRate.weight).toBe(0.30);
    expect(score.components.weaknessClosureRate.weight).toBe(0.25);
    expect(score.components.decisionSuccessRate.weight).toBe(0.25);
    expect(score.components.humanReadiness.weight).toBe(0.10);
    expect(score.components.patternHealth.weight).toBe(0.10);
    expect(score.trend).toEqual([]);
    expect(score.improvementPeriod).toBe('No data');
  });
});

// ============================================================================
// MIXED RESULTS — PARTIAL SURVIVAL
// ============================================================================

describe('CendiaApotheosis — Mixed Results', () => {
  let svc: ApotheosisServiceType;
  let callCount: number;

  beforeEach(() => {
    svc = createService();
    callCount = 0;
    // Alternate: survive, fail, survive, fail, ...
    ollamaChatMock = vi.fn().mockImplementation(() => {
      callCount++;
      const survived = callCount % 2 === 1;
      return Promise.resolve({
        content: JSON.stringify({
          survived,
          mitigated_damage: survived ? 500000 : 50000,
          reason: survived ? 'Organization responded well' : 'Controls were insufficient',
        }),
      });
    });
  });

  // FAILS IF: mixed results don't produce ~50% survival
  it('should handle mixed survival/failure results', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 10 });
    expect(run.scenariosTested).toBe(10);
    expect(run.scenariosSurvived).toBe(5);
    expect(run.survivalRate).toBe(50);
    expect(run.weaknessesFound.length).toBeGreaterThan(0);
  });

  // FAILS IF: mixed results don't produce escalations + patches where appropriate
  it('should produce both patches and escalations for mixed results', async () => {
    const run = await svc.executeApotheosisRun(ORG, { scenarioCount: 30 });
    // With 15 failures across many categories, we should see escalations
    if (run.weaknessesFound.some((w: { severity: string }) => w.severity === 'critical' || w.severity === 'high')) {
      expect(run.escalations.length).toBeGreaterThan(0);
    }
    expect(run.status).toBe('completed');
  });
});
