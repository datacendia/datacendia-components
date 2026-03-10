/**
 * CendiaCascadeService Deep Tests
 *
 * Tests the Second/Third-Order Consequence Engine ("The Butterfly Effect"):
 * - Severity scoring from impact scores
 * - Likelihood scoring from confidence
 * - Risk score calculation (severity × likelihood)
 * - Evidence basis determination
 * - Impact categorization by node type
 * - Consequence merging and deduplication
 * - Butterfly effect detection
 * - Timeline construction
 * - Mitigation generation
 * - Guardrail generation
 * - Multi-lens analysis (CFO, COO, CISO, People, Ethics)
 * - Total risk calculation
 * - Recommendation engine (proceed/caution/reconsider/reject)
 * - Alternatives generation
 * - Report management (sign, get, list, update status)
 * - Dashboard and health check
 *
 * @module __tests__/services/CendiaCascadeDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../utils/servicePersistence.js', () => ({
  loadServiceRecords: vi.fn().mockResolvedValue([]),
  saveServiceRecord: vi.fn().mockResolvedValue(undefined),
}));

// Mock CendiaOrbitService before importing CendiaCascadeService
const mockOrbit = {
  runPropagation: vi.fn(),
  findFeedbackLoops: vi.fn().mockReturnValue([]),
  getNode: vi.fn(),
  addNode: vi.fn(),
  addEdge: vi.fn(),
  loadGraph: vi.fn(),
  getStats: vi.fn().mockReturnValue({ nodes: 0, edges: 0 }),
};

vi.mock('../../services/CendiaOrbitService.js', () => ({
  orbitService: mockOrbit,
  CendiaOrbitService: class MockOrbit {},
  NodeType: {
    DEPARTMENT: 'department',
    TEAM: 'team',
    PERSON: 'person',
    SYSTEM: 'system',
    PROCESS: 'process',
    POLICY: 'policy',
    METRIC: 'metric',
    VENDOR: 'vendor',
    CUSTOMER: 'customer',
    PRODUCT: 'product',
    ASSET: 'asset',
    DECISION: 'decision',
    RISK: 'risk',
    CONTROL: 'control',
  },
  EdgeType: {
    DEPENDS_ON: 'depends_on',
    MANAGES: 'manages',
    PRODUCES: 'produces',
    CONSUMES: 'consumes',
    INFLUENCES: 'influences',
    REPORTS_TO: 'reports_to',
    FUNDS: 'funds',
    CONSTRAINS: 'constrains',
    TRIGGERS: 'triggers',
    MITIGATES: 'mitigates',
  },
}));

const {
  CendiaCascadeService,
  ChangeType,
  ImpactCategory,
  Severity,
  Likelihood,
} = await import('../../services/CendiaCascadeService.js');

type CascadeServiceType = InstanceType<typeof CendiaCascadeService>;

function createService(): CascadeServiceType {
  return new CendiaCascadeService(mockOrbit as any);
}

// ============================================================================
// PRIVATE METHOD TESTING VIA PROTOTYPE
// ============================================================================

describe('CendiaCascade — Severity Scoring', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should score CRITICAL for impactScore >= 0.8', () => {
    expect(svc.scoreSeverity(0.8)).toBe(Severity.CRITICAL);
    expect(svc.scoreSeverity(1.0)).toBe(Severity.CRITICAL);
  });

  it('should score HIGH for impactScore >= 0.6', () => {
    expect(svc.scoreSeverity(0.6)).toBe(Severity.HIGH);
    expect(svc.scoreSeverity(0.79)).toBe(Severity.HIGH);
  });

  it('should score MODERATE for impactScore >= 0.4', () => {
    expect(svc.scoreSeverity(0.4)).toBe(Severity.MODERATE);
    expect(svc.scoreSeverity(0.59)).toBe(Severity.MODERATE);
  });

  it('should score LOW for impactScore >= 0.2', () => {
    expect(svc.scoreSeverity(0.2)).toBe(Severity.LOW);
  });

  it('should score MINIMAL for impactScore < 0.2', () => {
    expect(svc.scoreSeverity(0.1)).toBe(Severity.MINIMAL);
    expect(svc.scoreSeverity(0)).toBe(Severity.MINIMAL);
  });
});

describe('CendiaCascade — Likelihood Scoring', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should score ALMOST_CERTAIN for confidence >= 0.8', () => {
    expect(svc.scoreLikelihood(0.8)).toBe(Likelihood.ALMOST_CERTAIN);
  });

  it('should score LIKELY for confidence >= 0.6', () => {
    expect(svc.scoreLikelihood(0.6)).toBe(Likelihood.LIKELY);
  });

  it('should score POSSIBLE for confidence >= 0.4', () => {
    expect(svc.scoreLikelihood(0.4)).toBe(Likelihood.POSSIBLE);
  });

  it('should score UNLIKELY for confidence >= 0.2', () => {
    expect(svc.scoreLikelihood(0.2)).toBe(Likelihood.UNLIKELY);
  });

  it('should score RARE for confidence < 0.2', () => {
    expect(svc.scoreLikelihood(0.1)).toBe(Likelihood.RARE);
  });
});

describe('CendiaCascade — Risk Score Calculation', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: risk matrix math is wrong
  it('should calculate CRITICAL × ALMOST_CERTAIN = 25', () => {
    expect(svc.calculateRiskScore(Severity.CRITICAL, Likelihood.ALMOST_CERTAIN)).toBe(25);
  });

  it('should calculate MINIMAL × RARE = 1', () => {
    expect(svc.calculateRiskScore(Severity.MINIMAL, Likelihood.RARE)).toBe(1);
  });

  it('should calculate MODERATE × POSSIBLE = 9', () => {
    expect(svc.calculateRiskScore(Severity.MODERATE, Likelihood.POSSIBLE)).toBe(9);
  });

  it('should calculate HIGH × LIKELY = 16', () => {
    expect(svc.calculateRiskScore(Severity.HIGH, Likelihood.LIKELY)).toBe(16);
  });
});

describe('CendiaCascade — Evidence Basis', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should classify as measured for high confidence 1st order', () => {
    expect(svc.determineEvidenceBasis({ confidence: 0.9, order: 1 })).toBe('measured');
  });

  it('should classify as derived for high confidence 2nd+ order', () => {
    expect(svc.determineEvidenceBasis({ confidence: 0.7, order: 2 })).toBe('derived');
  });

  it('should classify as inferred for moderate confidence', () => {
    expect(svc.determineEvidenceBasis({ confidence: 0.4, order: 3 })).toBe('inferred');
  });

  it('should classify as assumed for low confidence', () => {
    expect(svc.determineEvidenceBasis({ confidence: 0.1, order: 3 })).toBe('assumed');
  });
});

describe('CendiaCascade — Impact Categorization', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should map metric to FINANCIAL', () => {
    expect(svc.categorizeImpact('metric')).toBe(ImpactCategory.FINANCIAL);
  });

  it('should map process to OPERATIONAL', () => {
    expect(svc.categorizeImpact('process')).toBe(ImpactCategory.OPERATIONAL);
  });

  it('should map customer to REPUTATIONAL', () => {
    expect(svc.categorizeImpact('customer')).toBe(ImpactCategory.REPUTATIONAL);
  });

  it('should map policy to COMPLIANCE', () => {
    expect(svc.categorizeImpact('policy')).toBe(ImpactCategory.COMPLIANCE);
  });

  it('should map control to SECURITY', () => {
    expect(svc.categorizeImpact('control')).toBe(ImpactCategory.SECURITY);
  });

  it('should map person and team to HUMAN', () => {
    expect(svc.categorizeImpact('person')).toBe(ImpactCategory.HUMAN);
    expect(svc.categorizeImpact('team')).toBe(ImpactCategory.HUMAN);
  });

  it('should map product to STRATEGIC', () => {
    expect(svc.categorizeImpact('product')).toBe(ImpactCategory.STRATEGIC);
  });

  it('should default unknown type to OPERATIONAL', () => {
    expect(svc.categorizeImpact('unknown_type')).toBe(ImpactCategory.OPERATIONAL);
  });
});

// ============================================================================
// CONSEQUENCE MERGING
// ============================================================================

describe('CendiaCascade — Consequence Merging', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should deduplicate by nodeId keeping higher risk', () => {
    const consequences = [
      { nodeId: 'n1', riskScore: 10, severity: 'high' },
      { nodeId: 'n1', riskScore: 15, severity: 'critical' },
      { nodeId: 'n2', riskScore: 5, severity: 'low' },
    ];
    const merged = svc.mergeConsequences(consequences);
    expect(merged).toHaveLength(2);
    const n1 = merged.find((c: any) => c.nodeId === 'n1');
    expect(n1.riskScore).toBe(15);
  });

  it('should sort merged consequences by riskScore descending', () => {
    const consequences = [
      { nodeId: 'n1', riskScore: 5 },
      { nodeId: 'n2', riskScore: 20 },
      { nodeId: 'n3', riskScore: 12 },
    ];
    const merged = svc.mergeConsequences(consequences);
    expect(merged[0].riskScore).toBe(20);
    expect(merged[1].riskScore).toBe(12);
    expect(merged[2].riskScore).toBe(5);
  });

  it('should handle empty consequences', () => {
    expect(svc.mergeConsequences([])).toEqual([]);
  });
});

// ============================================================================
// BUTTERFLY EFFECT DETECTION
// ============================================================================

describe('CendiaCascade — Butterfly Effect', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should detect 3rd+ order, high risk, low confidence consequence', () => {
    const consequences = [
      { nodeId: 'n1', order: 1, riskScore: 20, confidence: 0.9 },
      { nodeId: 'n2', order: 3, riskScore: 15, confidence: 0.3 }, // butterfly!
      { nodeId: 'n3', order: 2, riskScore: 10, confidence: 0.7 },
    ];
    const butterfly = svc.findButterflyEffect(consequences);
    expect(butterfly).toBeDefined();
    expect(butterfly.nodeId).toBe('n2');
  });

  it('should return undefined when no qualifying consequence exists', () => {
    const consequences = [
      { nodeId: 'n1', order: 1, riskScore: 20, confidence: 0.9 },
      { nodeId: 'n2', order: 2, riskScore: 10, confidence: 0.7 },
    ];
    expect(svc.findButterflyEffect(consequences)).toBeUndefined();
  });

  it('should pick highest surprise (riskScore/confidence) when multiple qualify', () => {
    const consequences = [
      { nodeId: 'n1', order: 3, riskScore: 12, confidence: 0.4 },  // surprise: 30
      { nodeId: 'n2', order: 3, riskScore: 15, confidence: 0.2 },  // surprise: 75 ← winner
      { nodeId: 'n3', order: 4, riskScore: 12, confidence: 0.3 },  // surprise: 40
    ];
    const butterfly = svc.findButterflyEffect(consequences);
    expect(butterfly.nodeId).toBe('n2');
  });
});

// ============================================================================
// TIMELINE CONSTRUCTION
// ============================================================================

describe('CendiaCascade — Timeline', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should bin consequences into short/medium/long buckets', () => {
    const consequences = [
      { order: 1, latencyDays: 0, description: 'Immediate effect' },
      { order: 2, latencyDays: 15, description: 'Two-week effect' },
      { order: 2, latencyDays: 60, description: 'Two-month effect' },
      { order: 3, latencyDays: 200, description: 'Long-range effect' },
    ];
    const changeSpec = { title: 'Vendor Switch' };
    const timeline = svc.buildTimeline(consequences, changeSpec);

    expect(timeline.tZero.event).toBe('Vendor Switch');
    expect(timeline.tShort.effects).toHaveLength(2); // 0 and 15 days
    expect(timeline.tMedium.effects).toHaveLength(1); // 60 days
    expect(timeline.tLong.effects).toHaveLength(1); // 200 days
  });

  it('should only include 1st-order effects in tZero directEffects', () => {
    const consequences = [
      { order: 1, latencyDays: 5, description: 'Direct' },
      { order: 2, latencyDays: 10, description: 'Secondary' },
    ];
    const timeline = svc.buildTimeline(consequences, { title: 'Test' });
    expect(timeline.tZero.directEffects).toContain('Direct');
    expect(timeline.tZero.directEffects).not.toContain('Secondary');
  });
});

// ============================================================================
// MITIGATION GENERATION
// ============================================================================

describe('CendiaCascade — Mitigations', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should generate prevent + detect mitigations for high-risk consequences', () => {
    const consequences = [
      { nodeId: 'n1', nodeName: 'Revenue', nodeType: 'metric', category: ImpactCategory.FINANCIAL, severity: Severity.HIGH, riskScore: 16 },
    ];
    const mitigations = svc.generateMitigations(consequences, {});
    
    const prevent = mitigations.filter((m: any) => m.type === 'prevent');
    const detect = mitigations.filter((m: any) => m.type === 'detect');
    
    expect(prevent.length).toBeGreaterThanOrEqual(1);
    expect(detect.length).toBeGreaterThanOrEqual(1);
  });

  it('should add respond mitigation for CRITICAL severity', () => {
    const consequences = [
      { nodeId: 'n1', nodeName: 'Core System', nodeType: 'system', category: ImpactCategory.OPERATIONAL, severity: Severity.CRITICAL, riskScore: 25 },
    ];
    const mitigations = svc.generateMitigations(consequences, {});
    const respond = mitigations.filter((m: any) => m.type === 'respond');
    expect(respond.length).toBeGreaterThanOrEqual(1);
  });

  it('should not generate mitigations for low-risk consequences (riskScore < 12)', () => {
    const consequences = [
      { nodeId: 'n1', nodeName: 'Minor', severity: Severity.LOW, riskScore: 5 },
    ];
    const mitigations = svc.generateMitigations(consequences, {});
    expect(mitigations).toHaveLength(0);
  });
});

// ============================================================================
// GUARDRAIL GENERATION
// ============================================================================

describe('CendiaCascade — Guardrails', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should always generate canary, circuit_breaker, and rollback_trigger', () => {
    const guardrails = svc.generateGuardrails([], {});
    const types = guardrails.map((g: any) => g.type);
    expect(types).toContain('canary');
    expect(types).toContain('circuit_breaker');
    expect(types).toContain('rollback_trigger');
  });

  it('should add tripwires for CRITICAL consequences', () => {
    const consequences = [
      { nodeName: 'Database', severity: Severity.CRITICAL },
      { nodeName: 'API', severity: Severity.CRITICAL },
    ];
    const guardrails = svc.generateGuardrails(consequences, {});
    const tripwires = guardrails.filter((g: any) => g.type === 'tripwire');
    expect(tripwires).toHaveLength(2);
    expect(tripwires[0].condition).toContain('Database');
    expect(tripwires[1].condition).toContain('API');
  });

  it('should not add tripwires for non-critical consequences', () => {
    const consequences = [
      { nodeName: 'Report', severity: Severity.LOW },
    ];
    const guardrails = svc.generateGuardrails(consequences, {});
    const tripwires = guardrails.filter((g: any) => g.type === 'tripwire');
    expect(tripwires).toHaveLength(0);
  });
});

// ============================================================================
// MULTI-LENS ANALYSIS
// ============================================================================

describe('CendiaCascade — Multi-Lens Analysis', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('CFO lens should return 100 score with no financial impacts', () => {
    const result = svc.runCFOLens([]);
    expect(result.lens).toBe('CFO');
    expect(result.score).toBe(100);
  });

  it('CFO lens should degrade score with financial impacts', () => {
    const consequences = [
      { category: ImpactCategory.FINANCIAL, severity: Severity.HIGH, riskScore: 16, nodeName: 'Revenue', description: 'Revenue drop' },
    ];
    const result = svc.runCFOLens(consequences);
    expect(result.score).toBeLessThan(100);
    expect(result.findings).toHaveLength(1);
    expect(result.riskFactors.length).toBeGreaterThan(0);
  });

  it('CISO lens should detect security impacts', () => {
    const consequences = [
      { category: ImpactCategory.SECURITY, severity: Severity.MODERATE, riskScore: 9, nodeName: 'Firewall', description: 'Firewall rules' },
    ];
    const result = svc.runCISOLens(consequences);
    expect(result.lens).toBe('CISO');
    expect(result.findings).toHaveLength(1);
    expect(result.riskFactors.length).toBeGreaterThan(0);
  });

  it('Ethics lens should flag high human impact', () => {
    const consequences = [
      { category: ImpactCategory.HUMAN, severity: Severity.HIGH, riskScore: 16, description: 'layoffs' },
    ];
    const result = svc.runEthicsLens(consequences, {});
    expect(result.lens).toBe('Ethics');
    expect(result.findings.some((f: string) => f.includes('disparate impact'))).toBe(true);
    expect(result.score).toBeLessThan(100);
  });

  it('Ethics lens should flag no-go line violations', () => {
    const consequences = [
      { category: ImpactCategory.HUMAN, severity: Severity.LOW, riskScore: 4, description: 'customer data exposure possible' },
    ];
    const changeSpec = {
      constraints: { noGoLines: ['customer data'] },
    };
    const result = svc.runEthicsLens(consequences, changeSpec);
    expect(result.findings.some((f: string) => f.includes('customer data'))).toBe(true);
  });

  it('Ethics lens should return 100 with no concerns', () => {
    const result = svc.runEthicsLens([], {});
    expect(result.score).toBe(100);
    expect(result.findings).toHaveLength(0);
  });
});

// ============================================================================
// RECOMMENDATION ENGINE
// ============================================================================

describe('CendiaCascade — Recommendation Engine', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should reject when 3+ critical consequences', () => {
    const consequences = Array.from({ length: 3 }, () => ({
      severity: Severity.CRITICAL, order: 1, riskScore: 25,
    }));
    const result = svc.generateRecommendation(75, consequences, {});
    expect(result.action).toBe('reject');
    expect(result.requiredApprovals).toContain('CEO');
  });

  it('should reject when total risk >= 100', () => {
    const consequences = Array.from({ length: 10 }, () => ({
      severity: Severity.MODERATE, order: 1, riskScore: 10,
    }));
    const result = svc.generateRecommendation(100, consequences, {});
    expect(result.action).toBe('reject');
  });

  it('should reconsider when 1 critical consequence exists', () => {
    const consequences = [
      { severity: Severity.CRITICAL, order: 1, riskScore: 20 },
    ];
    const result = svc.generateRecommendation(20, consequences, {});
    expect(result.action).toBe('reconsider');
    expect(result.requiredApprovals).toContain('C-Suite');
  });

  it('should reconsider when butterfly effect detected', () => {
    const consequences = [
      { severity: Severity.MODERATE, order: 3, riskScore: 16 }, // 3rd+ order, risk >= 15
    ];
    const result = svc.generateRecommendation(16, consequences, {});
    expect(result.action).toBe('reconsider');
  });

  it('should proceed with caution for 3+ high consequences', () => {
    const consequences = Array.from({ length: 3 }, () => ({
      severity: Severity.HIGH, order: 1, riskScore: 16,
    }));
    const result = svc.generateRecommendation(48, consequences, {});
    expect(result.action).toBe('proceed_with_caution');
    expect(result.requiredApprovals).toContain('Risk Officer');
  });

  it('should proceed with caution for total risk >= 50', () => {
    const consequences = [
      { severity: Severity.MODERATE, order: 1, riskScore: 9 },
    ];
    const result = svc.generateRecommendation(55, consequences, {});
    expect(result.action).toBe('proceed_with_caution');
  });

  it('should proceed for low risk profile', () => {
    const consequences = [
      { severity: Severity.LOW, order: 1, riskScore: 4 },
    ];
    const result = svc.generateRecommendation(4, consequences, {});
    expect(result.action).toBe('proceed');
    expect(result.requiredApprovals).toContain('Manager');
  });
});

// ============================================================================
// ALTERNATIVES GENERATION
// ============================================================================

describe('CendiaCascade — Alternatives', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should generate 3 alternatives with negative risk deltas', () => {
    const alternatives = svc.generateAlternatives({}, []);
    expect(alternatives).toHaveLength(3);
    for (const alt of alternatives) {
      expect(alt.riskDelta).toBeLessThan(0);
      expect(alt.description).toBeTruthy();
      expect(alt.tradeoffs.length).toBeGreaterThan(0);
    }
  });
});

// ============================================================================
// TOTAL RISK CALCULATION
// ============================================================================

describe('CendiaCascade — Total Risk', () => {
  let svc: any;

  beforeEach(() => {
    svc = createService();
  });

  it('should sum all riskScores', () => {
    const consequences = [
      { riskScore: 5 },
      { riskScore: 12 },
      { riskScore: 25 },
    ];
    expect(svc.calculateTotalRisk(consequences)).toBe(42);
  });

  it('should return 0 for empty consequences', () => {
    expect(svc.calculateTotalRisk([])).toBe(0);
  });
});

// ============================================================================
// REPORT MANAGEMENT
// ============================================================================

describe('CendiaCascade — Report Management', () => {
  let svc: CascadeServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
    // Set up orbit mock for analyzeChange
    mockOrbit.runPropagation.mockResolvedValue({
      runId: 'orbit-run-001',
      directImpacts: [
        {
          nodeId: 'n1', nodeName: 'Revenue', nodeType: 'metric',
          impactScore: 0.7, confidence: 0.8, latencyDays: 5, order: 1,
          paths: [{ nodes: ['n0', 'n1'], edges: ['e1'] }],
        },
      ],
      rippleImpacts: [
        {
          nodeId: 'n2', nodeName: 'Support Team', nodeType: 'team',
          impactScore: 0.4, confidence: 0.5, latencyDays: 30, order: 2,
          paths: [{ nodes: ['n0', 'n1', 'n2'], edges: ['e1', 'e2'] }],
        },
      ],
      butterflyImpacts: [],
    });
    mockOrbit.getNode.mockReturnValue({ name: 'TestNode' });
  });

  it('should create a full cascade report via analyzeChange', async () => {
    const report = await svc.analyzeChange({
      type: ChangeType.VENDOR,
      title: 'Replace CRM Vendor',
      description: 'Switch from Salesforce to HubSpot',
      affectedAssets: ['crm-node'],
      expectedBenefit: 'Cost reduction of 40%',
    });

    expect(report.id).toBeTruthy();
    expect(report.status).toBe('draft');
    expect(report.changeSpec.title).toBe('Replace CRM Vendor');
    expect(report.consequences.length).toBeGreaterThan(0);
    expect(report.timeline).toBeDefined();
    expect(report.timeline.tZero.event).toBe('Replace CRM Vendor');
    expect(report.mitigations.length).toBeGreaterThanOrEqual(0);
    expect(report.guardrails.length).toBeGreaterThanOrEqual(3); // canary + circuit breaker + rollback
    expect(report.recommendation).toBeDefined();
    expect(report.rationale).toBeTruthy();
    expect(report.evidenceHash).toBeTruthy();
    expect(report.alternatives!.length).toBe(3);
    expect(typeof report.totalRiskScore).toBe('number');
  });

  it('should store and retrieve report by ID', async () => {
    const report = await svc.analyzeChange({
      type: ChangeType.PRICING,
      title: 'Price Increase',
      description: 'Raise prices by 20%',
      affectedAssets: ['pricing-node'],
      expectedBenefit: 'Revenue growth',
    });

    const retrieved = svc.getReport(report.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(report.id);
  });

  it('should list all reports sorted by timestamp descending', async () => {
    await svc.analyzeChange({
      type: ChangeType.STAFFING,
      title: 'First Change',
      description: 'Hire 10 engineers',
      affectedAssets: ['eng-team'],
      expectedBenefit: 'Capacity',
    });
    await svc.analyzeChange({
      type: ChangeType.TECHNOLOGY,
      title: 'Second Change',
      description: 'Migrate to cloud',
      affectedAssets: ['infra'],
      expectedBenefit: 'Scalability',
    });

    const reports = svc.listReports();
    expect(reports).toHaveLength(2);
    // Most recent first
    expect(reports[0].timestamp.getTime()).toBeGreaterThanOrEqual(reports[1].timestamp.getTime());
  });

  it('should sign a report and update status to in_review', async () => {
    const report = await svc.analyzeChange({
      type: ChangeType.POLICY,
      title: 'Policy Update',
      description: 'New data retention policy',
      affectedAssets: ['policy-node'],
      expectedBenefit: 'Compliance',
    });

    await svc.signReport(report.id, 'cto-001');

    const signed = svc.getReport(report.id);
    expect(signed!.signedBy).toBe('cto-001');
    expect(signed!.signedAt).toBeInstanceOf(Date);
    expect(signed!.status).toBe('in_review');
  });

  it('should throw when signing nonexistent report', async () => {
    await expect(svc.signReport('nonexistent', 'user')).rejects.toThrow('Report not found');
  });

  it('should update report status', async () => {
    const report = await svc.analyzeChange({
      type: ChangeType.PROCESS,
      title: 'Process Change',
      description: 'Automate invoice processing',
      affectedAssets: ['finance-proc'],
      expectedBenefit: 'Efficiency',
    });

    svc.updateReportStatus(report.id, 'approved');
    expect(svc.getReport(report.id)!.status).toBe('approved');
  });

  it('should throw when updating nonexistent report', () => {
    expect(() => svc.updateReportStatus('nonexistent', 'approved')).toThrow('Report not found');
  });

  it('should return undefined for nonexistent report', () => {
    expect(svc.getReport('nonexistent')).toBeUndefined();
  });
});

// ============================================================================
// FULL ANALYSIS WITH BUTTERFLY EFFECT
// ============================================================================

describe('CendiaCascade — Full Analysis with Butterfly Effect', () => {
  let svc: CascadeServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();

    mockOrbit.runPropagation.mockResolvedValue({
      runId: 'orbit-run-002',
      directImpacts: [
        {
          nodeId: 'n1', nodeName: 'Engineering', nodeType: 'department',
          impactScore: 0.9, confidence: 0.85, latencyDays: 2, order: 1,
          paths: [{ nodes: ['src', 'n1'], edges: ['e1'] }],
        },
      ],
      rippleImpacts: [
        {
          nodeId: 'n2', nodeName: 'Product Delivery', nodeType: 'process',
          impactScore: 0.6, confidence: 0.6, latencyDays: 45, order: 2,
          paths: [{ nodes: ['src', 'n1', 'n2'], edges: ['e1', 'e2'] }],
        },
      ],
      butterflyImpacts: [
        {
          nodeId: 'n3', nodeName: 'Customer Retention', nodeType: 'customer',
          impactScore: 0.9, confidence: 0.45, latencyDays: 180, order: 3,
          paths: [{ nodes: ['src', 'n1', 'n2', 'n3'], edges: ['e1', 'e2', 'e3'] }],
        },
      ],
    });
    mockOrbit.getNode.mockReturnValue({ name: 'Node' });
  });

  it('should detect butterfly effect in the report', async () => {
    const report = await svc.analyzeChange({
      type: ChangeType.STAFFING,
      title: 'Layoff 30% of Engineering',
      description: 'Reduce engineering headcount by 30% to cut costs',
      affectedAssets: ['eng-dept'],
      expectedBenefit: 'Cost reduction',
    });

    // Should have consequences from all 3 orders
    expect(report.consequences.length).toBeGreaterThanOrEqual(3);

    // Should detect the butterfly effect (3rd order, high risk, low confidence)
    expect(report.butterflyEffect).toBeDefined();
    expect(report.butterflyEffect!.nodeName).toBe('Customer Retention');

    // Should have timeline entries
    expect(report.timeline.tShort.effects.length).toBeGreaterThan(0); // 2 days
    expect(report.timeline.tLong.effects.length).toBeGreaterThan(0); // 180 days
  });
});

// ============================================================================
// GRAPH DELEGATION
// ============================================================================

describe('CendiaCascade — Graph Delegation', () => {
  let svc: CascadeServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  it('should delegate addNode to orbit', () => {
    const node = { id: 'n1', type: 'metric', name: 'Revenue', metadata: {} };
    svc.addNode(node as any);
    expect(mockOrbit.addNode).toHaveBeenCalledWith(node);
  });

  it('should delegate addEdge to orbit', () => {
    const edge = { id: 'e1', sourceId: 'n1', targetId: 'n2', type: 'depends_on', strength: 0.8 };
    svc.addEdge(edge as any);
    expect(mockOrbit.addEdge).toHaveBeenCalledWith(edge);
  });

  it('should delegate getStats to orbit', () => {
    svc.getGraphStats();
    expect(mockOrbit.getStats).toHaveBeenCalled();
  });
});

// ============================================================================
// DASHBOARD & HEALTH CHECK
// ============================================================================

describe('CendiaCascade — Dashboard', () => {
  let svc: CascadeServiceType;

  beforeEach(() => {
    svc = createService();
  });

  it('should return dashboard with service info', async () => {
    const dashboard = await svc.getDashboard();
    expect(dashboard.serviceName).toBe('CendiaCascade');
    expect(dashboard.status).toBe('operational');
    expect(dashboard.uptime).toBeGreaterThan(0);
    expect(typeof dashboard.recordCount).toBe('number');
  });
});

describe('CendiaCascade — Health Check', () => {
  let svc: CascadeServiceType;

  beforeEach(() => {
    svc = createService();
  });

  it('should return healthy status', async () => {
    const health = await svc.getHealth();
    expect(health.healthy).toBe(true);
    expect(health.service).toBe('CendiaCascade');
    expect(health.timestamp).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('uptime');
    expect(health.details).toHaveProperty('memoryMB');
  });
});
