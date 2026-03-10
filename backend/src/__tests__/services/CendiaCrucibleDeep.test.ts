/**
 * CendiaCrucibleService Deep Tests
 *
 * Tests the Synthetic Multiverse Simulation Engine:
 * - Scenario templates (all 13 types)
 * - Shock application (percentage, multiplier, absolute)
 * - Sentiment determination from change + risk
 * - Department risk level calculation
 * - Role-to-department inference
 * - Severity determination from change percentage
 * - Probability bell curve calculation
 * - Fast summary generation (template-based)
 * - Consensus analysis
 * - Text extraction (analysis, recommendation, risk, confidence)
 * - JSON array parsing
 * - Resilience score (express mode)
 * - Dashboard and health check
 *
 * @module __tests__/services/CendiaCrucibleDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

let llmGenerateMock = vi.fn();
vi.mock('../../services/EnhancedLLMService.js', () => {
  return {
    EnhancedLLMService: class MockEnhancedLLMService {
      generate(...args: unknown[]) { return llmGenerateMock(...args); }
    },
  };
});

const mockPrisma: Record<string, any> = {
  organizations: { findUnique: vi.fn().mockResolvedValue(null) },
  metric_definitions: { findMany: vi.fn().mockResolvedValue([]) },
  data_sources: { findMany: vi.fn().mockResolvedValue([]) },
  health_scores: { findMany: vi.fn().mockResolvedValue([]) },
  users: { findMany: vi.fn().mockResolvedValue([]) },
  workflows: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
  alerts: { findMany: vi.fn().mockResolvedValue([]), count: vi.fn().mockResolvedValue(0) },
  crucible_simulations: {
    create: vi.fn().mockResolvedValue({ id: 'sim-001' }),
    findUnique: vi.fn().mockResolvedValue(null),
    findMany: vi.fn().mockResolvedValue([]),
    update: vi.fn().mockResolvedValue({}),
  },
  crucible_universes: { create: vi.fn().mockResolvedValue({}) },
  crucible_impacts: { create: vi.fn().mockResolvedValue({}) },
  crucible_council_deliberations: { create: vi.fn().mockResolvedValue({}) },
  crucible_failure_cascades: { create: vi.fn().mockResolvedValue({}) },
  decision_outcomes: { findMany: vi.fn().mockResolvedValue([]) },
};

vi.mock('../../config/database.js', () => ({
  prisma: mockPrisma,
}));

// Import types for crucible
vi.mock('../../services/crucible/types.js', async () => {
  return {};
});

const crucibleModule = await import('../../services/CendiaCrucibleService.js');
const { SCENARIO_TEMPLATES } = crucibleModule;
const cendiaCrucibleService = crucibleModule.default;

type CrucibleServiceType = typeof cendiaCrucibleService;

function createService(): CrucibleServiceType {
  const Ctor = Object.getPrototypeOf(cendiaCrucibleService).constructor;
  return new Ctor() as CrucibleServiceType;
}

const ORG = 'org-crucible-test';
const USER_ID = 'user-test-001';

// ============================================================================
// SCENARIO TEMPLATES
// ============================================================================

describe('CendiaCrucible — Scenario Templates', () => {
  // FAILS IF: templates missing expected types
  it('should have all 13 scenario types defined', () => {
    const expectedTypes = [
      'FINANCIAL_STRESS', 'OPERATIONAL_SHOCK', 'CYBER_ATTACK',
      'REGULATORY_CHANGE', 'CULTURAL_SHIFT', 'ESG_EVENT',
      'MA_SCENARIO', 'MARKET_DISRUPTION', 'SUPPLY_CHAIN',
      'TALENT_EXODUS', 'TECHNOLOGY_FAILURE', 'BLACK_SWAN', 'CUSTOM',
    ];
    for (const type of expectedTypes) {
      expect(SCENARIO_TEMPLATES).toHaveProperty(type);
    }
  });

  // FAILS IF: templates missing name/description/shocks
  it('should have name, description, and shocks for each template', () => {
    for (const [type, template] of Object.entries(SCENARIO_TEMPLATES)) {
      const t = template as { name: string; description: string; shocks: unknown[] };
      expect(t.name).toBeTruthy();
      expect(t.description).toBeTruthy();
      expect(Array.isArray(t.shocks)).toBe(true);
      if (type !== 'CUSTOM') {
        expect(t.shocks.length).toBeGreaterThan(0);
      }
    }
  });

  // FAILS IF: financial stress template wrong
  it('should define financial stress shocks correctly', () => {
    const fs = SCENARIO_TEMPLATES.FINANCIAL_STRESS as any;
    expect(fs.name).toBe('Financial Stress Test');
    expect(fs.shocks.length).toBe(2);
    const revenueShock = fs.shocks.find((s: any) => s.target === 'revenue');
    expect(revenueShock).toBeDefined();
    expect(revenueShock.value).toBe(-30);
    expect(revenueShock.type).toBe('percentage');
  });

  // FAILS IF: cyber attack template missing system_availability shock
  it('should define cyber attack shocks including system_availability', () => {
    const ca = SCENARIO_TEMPLATES.CYBER_ATTACK as any;
    expect(ca.shocks.length).toBe(3);
    const sysShock = ca.shocks.find((s: any) => s.target === 'system_availability');
    expect(sysShock).toBeDefined();
    expect(sysShock.value).toBe(0); // absolute zero
    expect(sysShock.type).toBe('absolute');
  });

  // FAILS IF: black swan not extremely severe
  it('should define black swan as extremely severe', () => {
    const bs = SCENARIO_TEMPLATES.BLACK_SWAN as any;
    const allOps = bs.shocks.find((s: any) => s.target === 'all_operations');
    expect(allOps).toBeDefined();
    expect(allOps.value).toBeLessThanOrEqual(-80);
  });

  // FAILS IF: custom template has shocks
  it('should have empty shocks for CUSTOM type', () => {
    const custom = SCENARIO_TEMPLATES.CUSTOM as any;
    expect(custom.shocks).toEqual([]);
  });
});

// ============================================================================
// getScenarioTemplates
// ============================================================================

describe('CendiaCrucible — getScenarioTemplates', () => {
  let svc: CrucibleServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: doesn't return all templates
  it('should return all scenario templates', () => {
    const templates = svc.getScenarioTemplates();
    expect(Object.keys(templates).length).toBe(13);
    expect(templates.FINANCIAL_STRESS).toBeDefined();
    expect(templates.BLACK_SWAN).toBeDefined();
  });
});

// ============================================================================
// PRIVATE METHOD TESTING VIA PUBLIC API — applyShock, determineSentiment, etc.
// We access private methods through the prototype for targeted testing.
// ============================================================================

describe('CendiaCrucible — Internal Logic (via prototype)', () => {
  let svc: any; // Using any to access private methods

  beforeEach(() => {
    svc = createService();
  });

  // --- applyShock ---
  // FAILS IF: percentage shock calculation wrong
  it('applyShock: should apply percentage decrease', () => {
    const result = svc.applyShock(100, { target: 'revenue', type: 'percentage', value: -30, timing: 'immediate' }, {});
    expect(result).toBe(70); // 100 * (1 + (-30/100)) = 100 * 0.7 = 70
  });

  it('applyShock: should apply percentage increase', () => {
    const result = svc.applyShock(100, { target: 'costs', type: 'percentage', value: 50, timing: 'immediate' }, {});
    expect(result).toBe(150); // 100 * (1 + 50/100)
  });

  it('applyShock: should apply multiplier', () => {
    const result = svc.applyShock(10, { target: 'cycle_time', type: 'multiplier', value: 2.5, timing: 'immediate' }, {});
    expect(result).toBe(25); // 10 * 2.5
  });

  it('applyShock: should apply absolute value', () => {
    const result = svc.applyShock(99.9, { target: 'system_availability', type: 'absolute', value: 0, timing: 'immediate' }, {});
    expect(result).toBe(0); // Absolute override
  });

  it('applyShock: should return original for unknown type', () => {
    const result = svc.applyShock(50, { target: 'x', type: 'unknown', value: 10, timing: 'immediate' }, {});
    expect(result).toBe(50);
  });

  // --- determineSentiment ---
  it('determineSentiment: should return CATASTROPHIC for extreme loss + high risk', () => {
    const result = svc.determineSentiment(-55, { financial: 90, operational: 80 });
    expect(result).toBe('CATASTROPHIC');
  });

  it('determineSentiment: should return NEGATIVE for moderate loss', () => {
    const result = svc.determineSentiment(-25, { financial: 60, operational: 60 });
    expect(result).toBe('NEGATIVE');
  });

  it('determineSentiment: should return OPTIMAL for strong gain + low risk', () => {
    const result = svc.determineSentiment(25, { financial: 30, operational: 35 });
    expect(result).toBe('OPTIMAL');
  });

  it('determineSentiment: should return POSITIVE for moderate gain + moderate risk', () => {
    const result = svc.determineSentiment(10, { financial: 40, operational: 50 });
    expect(result).toBe('POSITIVE');
  });

  it('determineSentiment: should return NEUTRAL for flat change', () => {
    const result = svc.determineSentiment(0, { financial: 55, operational: 55 });
    expect(result).toBe('NEUTRAL');
  });

  // --- determineSeverity ---
  it('determineSeverity: should return CRITICAL for >50% change', () => {
    expect(svc.determineSeverity(-60)).toBe('CRITICAL');
    expect(svc.determineSeverity(55)).toBe('CRITICAL');
  });

  it('determineSeverity: should return HIGH for 30-50% change', () => {
    expect(svc.determineSeverity(-35)).toBe('HIGH');
  });

  it('determineSeverity: should return MEDIUM for 15-30% change', () => {
    expect(svc.determineSeverity(20)).toBe('MEDIUM');
  });

  it('determineSeverity: should return LOW for 5-15% change', () => {
    expect(svc.determineSeverity(-10)).toBe('LOW');
  });

  it('determineSeverity: should return MINIMAL for <5% change', () => {
    expect(svc.determineSeverity(3)).toBe('MINIMAL');
  });

  // --- calculateDeptRiskLevel ---
  it('calculateDeptRiskLevel: should flag understaffed as high risk', () => {
    expect(svc.calculateDeptRiskLevel(0, 5)).toBe('high');
  });

  it('calculateDeptRiskLevel: should flag single point of failure as high risk', () => {
    expect(svc.calculateDeptRiskLevel(1, 4)).toBe('high');
  });

  it('calculateDeptRiskLevel: should flag no automation as medium risk', () => {
    expect(svc.calculateDeptRiskLevel(5, 0)).toBe('medium');
  });

  it('calculateDeptRiskLevel: should return low for healthy department', () => {
    expect(svc.calculateDeptRiskLevel(10, 3)).toBe('low');
  });

  // --- inferDepartmentFromRole ---
  it('inferDepartmentFromRole: should map SUPER_ADMIN to Executive', () => {
    expect(svc.inferDepartmentFromRole('SUPER_ADMIN')).toBe('Executive');
  });

  it('inferDepartmentFromRole: should map ANALYST to Analytics', () => {
    expect(svc.inferDepartmentFromRole('ANALYST')).toBe('Analytics');
  });

  it('inferDepartmentFromRole: should default unknown roles to Operations', () => {
    expect(svc.inferDepartmentFromRole('UNKNOWN_ROLE')).toBe('Operations');
  });

  // --- inferDepartmentFromDataSource ---
  it('inferDepartmentFromDataSource: should map database to Engineering', () => {
    expect(svc.inferDepartmentFromDataSource('database')).toBe('Engineering');
  });

  it('inferDepartmentFromDataSource: should map erp to Finance', () => {
    expect(svc.inferDepartmentFromDataSource('erp')).toBe('Finance');
  });

  it('inferDepartmentFromDataSource: should map crm to Sales', () => {
    expect(svc.inferDepartmentFromDataSource('crm')).toBe('Sales');
  });

  it('inferDepartmentFromDataSource: should default to Operations', () => {
    expect(svc.inferDepartmentFromDataSource('unknown')).toBe('Operations');
  });

  // --- shockAffectsKPI ---
  it('shockAffectsKPI: should match revenue shock to revenue KPIs', () => {
    expect(svc.shockAffectsKPI('revenue', 'revenue_growth')).toBe(true);
    expect(svc.shockAffectsKPI('revenue', 'sales')).toBe(true);
  });

  it('shockAffectsKPI: should not match unrelated targets', () => {
    expect(svc.shockAffectsKPI('revenue', 'employee_engagement')).toBe(false);
  });

  it('shockAffectsKPI: all_operations should match everything', () => {
    expect(svc.shockAffectsKPI('all_operations', 'anything')).toBe(true);
  });

  // --- calculateProbability (bell curve) ---
  it('calculateProbability: should give highest probability near center', () => {
    // With 12 universes: center is index 6
    const centerProb = svc.calculateProbability(6, 12);
    const edgeProb = svc.calculateProbability(0, 12);
    expect(centerProb).toBeGreaterThan(edgeProb);
  });

  // --- parseJsonArray ---
  it('parseJsonArray: should extract JSON array from text', () => {
    const result = svc.parseJsonArray('Here is the analysis: ["Risk 1", "Risk 2", "Risk 3"]');
    expect(result).toEqual(['Risk 1', 'Risk 2', 'Risk 3']);
  });

  it('parseJsonArray: should return null for invalid JSON', () => {
    expect(svc.parseJsonArray('No JSON here')).toBeNull();
  });

  it('parseJsonArray: should return null for non-string arrays', () => {
    expect(svc.parseJsonArray('[1, 2, 3]')).toBeNull();
  });

  // --- analyzeConsensus ---
  it('analyzeConsensus: should reach consensus when average confidence > 70', () => {
    const responses = [
      { agentRole: 'CEO', analysis: 'a', recommendation: 'Do X', riskAssessment: 'r', confidenceLevel: 80 },
      { agentRole: 'Risk', analysis: 'b', recommendation: 'Do Y', riskAssessment: 'r', confidenceLevel: 85 },
    ];
    const result = svc.analyzeConsensus(responses);
    expect(result.consensusReached).toBe(true);
    expect(result.confidence).toBe(82.5);
    expect(result.recommendation).toBe('Do X');
  });

  it('analyzeConsensus: should not reach consensus when average confidence <= 70', () => {
    const responses = [
      { agentRole: 'CEO', analysis: 'a', recommendation: 'Maybe X', riskAssessment: 'r', confidenceLevel: 50 },
      { agentRole: 'Risk', analysis: 'b', recommendation: 'Maybe Y', riskAssessment: 'r', confidenceLevel: 60 },
    ];
    const result = svc.analyzeConsensus(responses);
    expect(result.consensusReached).toBe(false);
  });

  // --- extractConfidenceLevel ---
  it('extractConfidenceLevel: should extract numeric confidence', () => {
    expect(svc.extractConfidenceLevel('My confidence: 85%')).toBe(85);
  });

  it('extractConfidenceLevel: should default to 75 when not found', () => {
    expect(svc.extractConfidenceLevel('No number here')).toBe(75);
  });

  // --- mode ---
  it('mode: should find most frequent element', () => {
    expect(svc.mode(['A', 'B', 'A', 'C', 'A'])).toBe('A');
    expect(svc.mode(['X', 'Y', 'Y'])).toBe('Y');
  });

  // --- calculateTrend ---
  it('calculateTrend: should calculate percentage change', () => {
    expect(svc.calculateTrend(110, 100)).toBe(10);
    expect(svc.calculateTrend(90, 100)).toBe(-10);
  });

  it('calculateTrend: should return 0 for missing values', () => {
    expect(svc.calculateTrend(undefined, 100)).toBe(0);
    expect(svc.calculateTrend(100, 0)).toBe(0);
  });

  // --- generateFastSummary ---
  it('generateFastSummary: should generate CATASTROPHIC summary', () => {
    const summary = svc.generateFastSummary(
      { name: 'Financial Stress Test', description: 'Revenue decline' },
      'CATASTROPHIC',
      -55,
      { financial: 90, operational: 85 }
    );
    expect(summary).toContain('Severe');
    expect(summary).toContain('Financial Stress Test');
  });

  it('generateFastSummary: should generate OPTIMAL summary', () => {
    const summary = svc.generateFastSummary(
      { name: 'M&A Event', description: 'Merger' },
      'OPTIMAL',
      25,
      { financial: 20, operational: 25 }
    );
    expect(summary).toContain('Best-case');
  });
});

// ============================================================================
// RESILIENCE SCORE (EXPRESS MODE)
// ============================================================================

describe('CendiaCrucible — Resilience Score (Express)', () => {
  let svc: CrucibleServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: score formula wrong
  it('should calculate resilience score from real data', async () => {
    mockPrisma.crucible_simulations.findMany.mockResolvedValue([
      { simulation_type: 'CYBER_ATTACK', results_summary: {} },
      { simulation_type: 'FINANCIAL_STRESS', results_summary: {} },
    ]);
    mockPrisma.data_sources.findMany.mockResolvedValue([
      { status: 'CONNECTED', type: 'database' },
      { status: 'CONNECTED', type: 'api' },
      { status: 'DISCONNECTED', type: 'file' },
    ]);
    mockPrisma.alerts.count.mockResolvedValue(2);
    mockPrisma.workflows.count.mockResolvedValue(3);

    const result = await svc.getResilienceScore(ORG);

    expect(result.mode).toBe('express');
    expect(result.overallScore).toBeGreaterThanOrEqual(0);
    expect(result.overallScore).toBeLessThanOrEqual(100);

    // dataResilience = 2/3 * 100 = 66.7
    expect(result.breakdown.dataResilience).toBe(67);
    // simulationReadiness = 2 types * 15 = 30
    expect(result.breakdown.simulationReadiness).toBe(30);
    // operationalHealth = max(0, 100 - 2*10) = 80
    expect(result.breakdown.operationalHealth).toBe(80);
    // automationScore = min(100, 3*20) = 60
    expect(result.breakdown.automationScore).toBe(60);
  });

  // FAILS IF: vulnerabilities not identified
  it('should identify vulnerabilities for low scores', async () => {
    mockPrisma.crucible_simulations.findMany.mockResolvedValue([]);
    mockPrisma.data_sources.findMany.mockResolvedValue([
      { status: 'DISCONNECTED', type: 'database' },
    ]);
    mockPrisma.alerts.count.mockResolvedValue(8);
    mockPrisma.workflows.count.mockResolvedValue(0);

    const result = await svc.getResilienceScore(ORG);

    // dataResilience = 0/1 * 100 = 0 → vulnerability
    expect(result.vulnerabilities.some((v: string) => v.includes('data source'))).toBe(true);
    // simulationReadiness = 0 → vulnerability
    expect(result.vulnerabilities.some((v: string) => v.includes('simulation'))).toBe(true);
    // operationalHealth = 100 - 80 = 20 → vulnerability
    expect(result.vulnerabilities.some((v: string) => v.includes('alert'))).toBe(true);
    // automationScore = 0 → vulnerability
    expect(result.vulnerabilities.some((v: string) => v.includes('automation'))).toBe(true);
  });

  // FAILS IF: strengths not identified
  it('should identify strengths for high scores', async () => {
    mockPrisma.crucible_simulations.findMany.mockResolvedValue(
      Array.from({ length: 5 }, (_, i) => ({ simulation_type: `TYPE_${i}`, results_summary: {} }))
    );
    mockPrisma.data_sources.findMany.mockResolvedValue([
      { status: 'CONNECTED', type: 'database' },
      { status: 'CONNECTED', type: 'api' },
    ]);
    mockPrisma.alerts.count.mockResolvedValue(0);
    mockPrisma.workflows.count.mockResolvedValue(5);

    const result = await svc.getResilienceScore(ORG);
    expect(result.strengths.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// DASHBOARD
// ============================================================================

describe('CendiaCrucible — Dashboard', () => {
  let svc: CrucibleServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: dashboard shape wrong
  it('should return dashboard with service info', async () => {
    const dashboard = await svc.getDashboard();
    expect(dashboard.serviceName).toBe('CendiaCrucible');
    expect(dashboard.status).toBe('operational');
    expect(dashboard.uptime).toBeGreaterThan(0);
    expect(typeof dashboard.recordCount).toBe('number');
    expect(dashboard.lastActivity).toBeInstanceOf(Date);
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

describe('CendiaCrucible — Health Check', () => {
  let svc: CrucibleServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: health check shape wrong
  it('should return healthy status', async () => {
    const health = await svc.getHealth();
    expect(health.healthy).toBe(true);
    expect(health.service).toBe('CendiaCrucible');
    expect(health.timestamp).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('uptime');
    expect(health.details).toHaveProperty('memoryMB');
  });
});

// ============================================================================
// BASELINE RISK SCORE
// ============================================================================

describe('CendiaCrucible — Baseline Risk Score', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should calculate baseline from percentage shocks', () => {
    const shocks = [
      { target: 'revenue', type: 'percentage', value: -30, timing: 'gradual' },
    ];
    const score = svc.calculateBaselineRiskScore(shocks, null);
    // base 50 + abs(-30) * 0.3 = 50 + 9 = 59
    expect(score).toBe(59);
  });

  it('should calculate baseline from multiplier shocks', () => {
    const shocks = [
      { target: 'cycle_time', type: 'multiplier', value: 2.5, timing: 'immediate' },
    ];
    const score = svc.calculateBaselineRiskScore(shocks, null);
    // base 50 + (2.5 - 1) * 20 = 50 + 30 = 80
    expect(score).toBe(80);
  });

  it('should adjust for org health when twin provided', () => {
    const shocks = [
      { target: 'revenue', type: 'percentage', value: -10, timing: 'immediate' },
    ];
    const twinHealthy = { healthScore: 80 };
    const twinWeak = { healthScore: 30 };

    const scoreHealthy = svc.calculateBaselineRiskScore(shocks, twinHealthy);
    const scoreWeak = svc.calculateBaselineRiskScore(shocks, twinWeak);

    // Healthy org (80) reduces risk; weak org (30) increases risk
    expect(scoreHealthy).toBeLessThan(scoreWeak);
  });

  it('should clamp score between 0 and 100', () => {
    // Massive shocks
    const bigShocks = Array.from({ length: 10 }, () => ({
      target: 'x', type: 'multiplier' as const, value: 5, timing: 'immediate' as const,
    }));
    const score = svc.calculateBaselineRiskScore(bigShocks, null);
    expect(score).toBeLessThanOrEqual(100);
    expect(score).toBeGreaterThanOrEqual(0);
  });
});
