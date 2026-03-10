/**
 * Vertical Sports Deep Tests
 *
 * Tests the Sports vertical end-to-end:
 * - PlayerTransferSchema (validation, TPO block, medical/window warnings)
 * - FinancialFairPlaySchema (wage ratio, related-party warnings)
 * - SportsComplianceMapper (10 frameworks, mapToFramework, checkViolation, generateEvidence)
 * - SportsDataConnector (connect, disconnect, ingest, validate)
 * - SportsKnowledgeBaseLayer (embed, retrieve, enforceProvenance)
 * - SportsGovernancePreset (capabilities, guardrails, workflow, trace)
 * - SportsDefensibleOutput (regulatorPacket, courtBundle, auditTrail)
 * - SportsVerticalImplementation (6-layer pattern, getStatus)
 *
 * Every test uses real sports domain data with explicit assertions.
 *
 * @module __tests__/services/VerticalSportsDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
  saveServiceRecord: vi.fn().mockResolvedValue(undefined),
}));
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../../services/llm/EmbeddingService.js', () => {
  function hashFallback(text: string): number[] {
    const arr = new Array(384).fill(0);
    for (let i = 0; i < text.length; i++) arr[i % 384] += text.charCodeAt(i) / 1000;
    return arr;
  }
  return {
    embeddingService: {
      embed: vi.fn().mockResolvedValue(new Array(384).fill(0.1)),
      cosineSimilarity: vi.fn().mockReturnValue(0.85),
      isOllamaAvailable: vi.fn().mockReturnValue(false),
      getDimension: vi.fn().mockReturnValue(384),
      hashFallback,
    },
  };
});
vi.mock('../../../utils/RuleEngine.js', () => ({
  expressionParser: { parse: vi.fn().mockReturnValue({ evaluate: () => true }) },
}));

// ============================================================================
// IMPORTS
// ============================================================================

const {
  PlayerTransferSchema,
  FinancialFairPlaySchema,
  SportsComplianceMapper,
  SportsDataConnector,
  SportsKnowledgeBaseLayer,
  SportsGovernancePreset,
  SportsDefensibleOutput,
  SportsVerticalImplementation,
} = await import('../../services/verticals/sports/SportsVerticalExpanded.js');

// ============================================================================
// Helper: build a minimal SportsDecision for defensible-output tests
// ============================================================================

function makeTransferDecision(overrides: Record<string, unknown> = {}) {
  return {
    type: 'player-transfer',
    metadata: { id: 'DEC-TRANSFER-001', createdAt: new Date(), updatedAt: new Date(), version: 1 },
    inputs: {
      playerId: 'PLR-001', playerName: 'Test Player', currentClub: 'Club A', targetClub: 'Club B',
      transferFee: 50_000_000, agentFee: 2_500_000, wageProposal: 200_000, contractLength: 5,
      sellOnClause: 0.15, performanceBonuses: [{ trigger: '20 goals', amount: 5_000_000 }],
      medicalPassed: true, workPermitRequired: false, registrationWindow: true, thirdPartyOwnership: false,
    },
    outcome: {
      approved: true, finalTransferFee: 50_000_000, wageAgreed: 200_000,
      ffpCompliant: true, salarCapCompliant: true, registrationConfirmed: true,
      conditions: [], riskAssessment: 'medium',
    },
    deliberation: { reasoning: 'Value justified by scouting reports', confidence: 0.8 },
    approvals: [{ approverId: 'SD-001', approverRole: 'sporting-director', approvedAt: new Date(), conditions: [] }],
    dissents: [],
    signatures: [{ signerId: 'SD-001', signerRole: 'sporting-director', signedAt: new Date(), signature: 'sig', publicKeyFingerprint: 'fp' }],
    complianceEvidence: [{ id: 'CE-001', frameworkId: 'fifa-regulations', controlId: 'fifa-transfer', status: 'compliant', evidence: 'OK', generatedAt: new Date(), hash: 'h' }],
    ...overrides,
  };
}

function makeFFPDecision(overrides: Record<string, unknown> = {}) {
  return {
    type: 'financial-fair-play',
    metadata: { id: 'DEC-FFP-001', createdAt: new Date(), updatedAt: new Date(), version: 1 },
    inputs: {
      clubId: 'CLUB-001', reportingPeriod: '2025-26', revenue: 300_000_000, wages: 180_000_000,
      wageToRevenueRatio: 0.6, transferSpend: 100_000_000, amortization: 20_000_000,
      acceptableLoss: 30_000_000, actualLoss: 10_000_000, ownerInjections: 0,
      relatedPartyTransactions: [], footballEarnings: 280_000_000, nonFootballRevenue: 20_000_000,
    },
    outcome: {
      compliant: true, breakEvenResult: 20_000_000, wageRatioCompliant: true,
      sanctionRisk: 'none', settlementAgreement: false, voluntaryAgreement: false,
      monitoringRequired: false, conditions: [],
    },
    deliberation: { reasoning: 'Within break-even and wage ratio limits', confidence: 0.95 },
    approvals: [{ approverId: 'CFO-001', approverRole: 'chief-financial-officer', approvedAt: new Date(), conditions: [] }],
    dissents: [],
    signatures: [{ signerId: 'CFO-001', signerRole: 'chief-financial-officer', signedAt: new Date(), signature: 'sig', publicKeyFingerprint: 'fp' }],
    complianceEvidence: [],
    ...overrides,
  };
}

// ============================================================================
// PlayerTransferSchema
// ============================================================================

describe('Sports — PlayerTransferSchema', () => {
  let schema: InstanceType<typeof PlayerTransferSchema>;

  beforeEach(() => { schema = new PlayerTransferSchema(); });

  // FAILS IF: valid transfer rejected
  it('should validate a complete player transfer', () => {
    const result = schema.validate({
      inputs: {
        playerId: 'PLR-001', currentClub: 'Club A', targetClub: 'Club B',
        transferFee: 50_000_000, medicalPassed: true, registrationWindow: true,
        thirdPartyOwnership: false,
      },
      outcome: { approved: true, ffpCompliant: true },
    } as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // FAILS IF: missing player ID not caught
  it('should reject missing player ID', () => {
    const result = schema.validate({
      inputs: { currentClub: 'A', targetClub: 'B', thirdPartyOwnership: false, medicalPassed: true, registrationWindow: true },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Player ID'))).toBe(true);
  });

  // FAILS IF: missing current club not caught
  it('should reject missing current club', () => {
    const result = schema.validate({
      inputs: { playerId: 'P1', targetClub: 'B', thirdPartyOwnership: false, medicalPassed: true, registrationWindow: true },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Current club'))).toBe(true);
  });

  // FAILS IF: third-party ownership not blocked
  it('should reject third-party ownership (FIFA TPO ban)', () => {
    const result = schema.validate({
      inputs: {
        playerId: 'PLR-002', currentClub: 'C', targetClub: 'D',
        transferFee: 10_000_000, thirdPartyOwnership: true,
        medicalPassed: true, registrationWindow: true,
      },
      outcome: { approved: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Third-party ownership'))).toBe(true);
  });

  // FAILS IF: medical warning not raised
  it('should warn when medical not yet passed', () => {
    const result = schema.validate({
      inputs: {
        playerId: 'PLR-003', currentClub: 'E', targetClub: 'F',
        transferFee: 30_000_000, medicalPassed: false,
        registrationWindow: true, thirdPartyOwnership: false,
      },
      outcome: { approved: true },
    } as any);
    expect(result.valid).toBe(true); // warning only, not error
    expect(result.warnings.some(w => w.includes('Medical'))).toBe(true);
  });

  // FAILS IF: registration window warning not raised
  it('should warn when outside registration window', () => {
    const result = schema.validate({
      inputs: {
        playerId: 'PLR-004', currentClub: 'G', targetClub: 'H',
        transferFee: 20_000_000, medicalPassed: true,
        registrationWindow: false, thirdPartyOwnership: false,
      },
      outcome: { approved: true },
    } as any);
    expect(result.warnings.some(w => w.includes('registration window'))).toBe(true);
  });

  it('should have correct metadata', () => {
    expect(schema.verticalId).toBe('sports');
    expect(schema.decisionType).toBe('player-transfer');
    expect(schema.requiredApprovers).toContain('sporting-director');
    expect(schema.requiredApprovers).toContain('chief-financial-officer');
    expect(schema.requiredFields.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// FinancialFairPlaySchema
// ============================================================================

describe('Sports — FinancialFairPlaySchema', () => {
  let schema: InstanceType<typeof FinancialFairPlaySchema>;

  beforeEach(() => { schema = new FinancialFairPlaySchema(); });

  // FAILS IF: compliant FFP decision rejected
  it('should validate a compliant FFP submission', () => {
    const result = schema.validate({
      inputs: {
        clubId: 'CLUB-001', reportingPeriod: '2025-26',
        revenue: 300_000_000, wages: 180_000_000,
        wageToRevenueRatio: 0.6, relatedPartyTransactions: [],
      },
      outcome: { compliant: true },
    } as any);
    expect(result.valid).toBe(true);
    expect(result.errors).toHaveLength(0);
  });

  // FAILS IF: missing club ID not caught
  it('should reject missing club ID', () => {
    const result = schema.validate({
      inputs: { reportingPeriod: '2025-26' },
      outcome: { compliant: true },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Club ID'))).toBe(true);
  });

  // FAILS IF: missing reporting period not caught
  it('should reject missing reporting period', () => {
    const result = schema.validate({
      inputs: { clubId: 'C1' },
      outcome: { compliant: false },
    } as any);
    expect(result.valid).toBe(false);
    expect(result.errors.some(e => e.includes('Reporting period'))).toBe(true);
  });

  // FAILS IF: wage ratio >70% warning not raised
  it('should warn when squad cost ratio exceeds 70%', () => {
    const result = schema.validate({
      inputs: {
        clubId: 'CLUB-002', reportingPeriod: '2025-26',
        revenue: 200_000_000, wages: 160_000_000,
        wageToRevenueRatio: 0.80,
        relatedPartyTransactions: [],
      },
      outcome: { compliant: false },
    } as any);
    expect(result.warnings.some(w => w.includes('70%'))).toBe(true);
  });

  // FAILS IF: unfair related-party transactions not warned
  it('should warn when related-party transactions are not at fair value', () => {
    const result = schema.validate({
      inputs: {
        clubId: 'CLUB-003', reportingPeriod: '2025-26',
        revenue: 500_000_000, wages: 200_000_000,
        wageToRevenueRatio: 0.4,
        relatedPartyTransactions: [
          { party: 'Owner Airline', amount: 150_000_000, fairValue: false },
        ],
      },
      outcome: { compliant: true },
    } as any);
    expect(result.warnings.some(w => w.includes('fair value'))).toBe(true);
  });

  it('should have correct approvers', () => {
    expect(schema.requiredApprovers).toContain('ffp-compliance-officer');
    expect(schema.requiredApprovers).toContain('chief-financial-officer');
  });
});

// ============================================================================
// SportsComplianceMapper
// ============================================================================

describe('Sports — SportsComplianceMapper', () => {
  let mapper: InstanceType<typeof SportsComplianceMapper>;

  beforeEach(() => { mapper = new SportsComplianceMapper(); });

  // FAILS IF: frameworks missing
  it('should have 10 compliance frameworks registered', () => {
    expect(mapper.supportedFrameworks.length).toBe(10);
  });

  // FAILS IF: framework lookup broken
  it('should retrieve each framework by ID', () => {
    const expectedIds = [
      'uefa-ffp', 'wada-code', 'fifa-regulations', 'safeguarding',
      'salary-cap-rules', 'concussion-protocol', 'match-fixing',
      'venue-safety', 'title-ix-sports', 'gdpr-sports',
    ];
    for (const id of expectedIds) {
      const fw = mapper.getFramework(id);
      expect(fw).toBeDefined();
      expect(fw!.id).toBe(id);
      expect(fw!.controls.length).toBeGreaterThan(0);
    }
  });

  // FAILS IF: returns framework for invalid ID
  it('should return undefined for nonexistent framework', () => {
    expect(mapper.getFramework('nonexistent')).toBeUndefined();
  });

  // FAILS IF: mapToFramework produces wrong controls
  it('should map player-transfer to fifa-regulations controls', () => {
    const controls = mapper.mapToFramework('player-transfer', 'fifa-regulations');
    expect(controls.length).toBeGreaterThan(0);
    const ids = controls.map(c => c.id);
    expect(ids).toContain('fifa-transfer');
    expect(ids).toContain('fifa-tpo');
  });

  it('should map financial-fair-play to uefa-ffp controls', () => {
    const controls = mapper.mapToFramework('financial-fair-play', 'uefa-ffp');
    expect(controls.length).toBe(4);
    const ids = controls.map(c => c.id);
    expect(ids).toContain('ffp-breakeven');
    expect(ids).toContain('ffp-wage-ratio');
  });

  it('should map anti-doping to wada-code controls', () => {
    const controls = mapper.mapToFramework('anti-doping', 'wada-code');
    expect(controls.length).toBe(4);
  });

  it('should map player-safety to concussion-protocol controls', () => {
    const controls = mapper.mapToFramework('player-safety', 'concussion-protocol');
    expect(controls.length).toBe(3);
  });

  it('should return empty for unmapped decision-framework pair', () => {
    expect(mapper.mapToFramework('player-transfer', 'wada-code')).toHaveLength(0);
  });

  // FAILS IF: TPO violation not detected
  it('should detect TPO violation on player transfer', async () => {
    const decision = makeTransferDecision({
      inputs: {
        ...makeTransferDecision().inputs,
        thirdPartyOwnership: true,
      },
    });
    const violations = await mapper.checkViolation(decision as any, 'fifa-regulations');
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some(v => v.controlId === 'fifa-tpo')).toBe(true);
    expect(violations[0]!.severity).toBe('critical');
  });

  // FAILS IF: wage ratio violation not detected
  it('should detect wage ratio violation on FFP decision', async () => {
    const decision = makeFFPDecision({
      inputs: {
        ...makeFFPDecision().inputs,
        wageToRevenueRatio: 0.85,
      },
    });
    const violations = await mapper.checkViolation(decision as any, 'uefa-ffp');
    expect(violations.length).toBeGreaterThan(0);
    expect(violations.some(v => v.controlId === 'ffp-wage-ratio')).toBe(true);
  });

  // FAILS IF: compliant FFP flagged
  it('should return no violations for compliant FFP', async () => {
    const decision = makeFFPDecision();
    const violations = await mapper.checkViolation(decision as any, 'uefa-ffp');
    expect(violations).toHaveLength(0);
  });

  // FAILS IF: evidence generation crashes or empty
  it('should generate compliance evidence for transfer + fifa-regulations', async () => {
    const decision = makeTransferDecision();
    const evidence = await mapper.generateEvidence(decision as any, 'fifa-regulations');
    expect(evidence.length).toBeGreaterThan(0);
    for (const e of evidence) {
      expect(e.id).toBeTruthy();
      expect(e.frameworkId).toBe('fifa-regulations');
      expect(e.status).toBe('compliant');
      expect(e.hash).toBeTruthy();
    }
  });
});

// ============================================================================
// SportsDataConnector
// ============================================================================

describe('Sports — SportsDataConnector', () => {
  let connector: InstanceType<typeof SportsDataConnector>;

  beforeEach(() => { connector = new SportsDataConnector(); });

  // FAILS IF: sources not pre-configured
  it('should have 4 preconfigured data sources', () => {
    expect(connector.getSourceStatus('player-mgmt')).toBeDefined();
    expect(connector.getSourceStatus('financial')).toBeDefined();
    expect(connector.getSourceStatus('medical')).toBeDefined();
    expect(connector.getSourceStatus('scouting')).toBeDefined();
    expect(connector.getSourceStatus('nonexistent')).toBeUndefined();
  });

  // FAILS IF: connect fails for valid source
  it('should connect to a valid source', async () => {
    const ok = await connector.connect({ sourceId: 'player-mgmt' });
    expect(ok).toBe(true);
    const source = connector.getSourceStatus('player-mgmt');
    expect(source!.connectionStatus).toBe('connected');
  });

  // FAILS IF: connect succeeds for invalid source
  it('should fail to connect to invalid source', async () => {
    const ok = await connector.connect({ sourceId: 'nonexistent' });
    expect(ok).toBe(false);
  });

  // FAILS IF: ingest without connect succeeds
  it('should fail to ingest from disconnected source', async () => {
    const result = await connector.ingest('player-mgmt');
    expect(result.success).toBe(false);
    expect(result.validationErrors.length).toBeGreaterThan(0);
  });

  // FAILS IF: ingest after connect fails
  it('should successfully ingest from connected source', async () => {
    await connector.connect({ sourceId: 'financial' });
    const result = await connector.ingest('financial');
    expect(result.success).toBe(true);
    expect(result.provenance).toBeDefined();
    expect(result.provenance.sourceId).toBe('financial');
    expect(result.validationErrors).toHaveLength(0);
  });

  // FAILS IF: disconnect doesn't reset all sources
  it('should disconnect all sources', async () => {
    await connector.connect({ sourceId: 'player-mgmt' });
    await connector.connect({ sourceId: 'medical' });
    expect(connector.getConnectedSources().length).toBe(2);
    await connector.disconnect();
    expect(connector.getConnectedSources().length).toBe(0);
    expect(connector.getSourceStatus('player-mgmt')!.connectionStatus).toBe('disconnected');
    expect(connector.getSourceStatus('medical')!.connectionStatus).toBe('disconnected');
  });

  // FAILS IF: validate crashes
  it('should validate data presence', () => {
    expect(connector.validate({ some: 'data' }).valid).toBe(true);
    expect(connector.validate(null as any).valid).toBe(false);
  });
});

// ============================================================================
// SportsKnowledgeBaseLayer
// ============================================================================

describe('Sports — SportsKnowledgeBaseLayer', () => {
  let kb: InstanceType<typeof SportsKnowledgeBaseLayer>;

  beforeEach(() => { kb = new SportsKnowledgeBaseLayer(); });

  // FAILS IF: embed crashes or returns incomplete doc
  it('should embed a document and return full KnowledgeDocument', async () => {
    const provenance = { sourceId: 'player-mgmt', hash: 'abc', authoritative: true, timestamp: new Date() };
    const doc = await kb.embed('Messi transfer to Inter Miami', { type: 'transfer' }, provenance as any);
    expect(doc.id).toBeTruthy();
    expect(doc.content).toBe('Messi transfer to Inter Miami');
    expect(doc.embedding).toBeDefined();
    expect(doc.embedding!.length).toBe(384);
  });

  // FAILS IF: retrieval returns nothing after embed
  it('should retrieve embedded documents', async () => {
    const prov = { sourceId: 'scouting', hash: 'h1', authoritative: true, timestamp: new Date() };
    await kb.embed('Premier League salary cap analysis', { type: 'financial' }, prov as any);
    await kb.embed('La Liga FFP compliance report', { type: 'compliance' }, prov as any);
    const result = await kb.retrieve('salary cap', 5);
    expect(result.documents.length).toBeGreaterThan(0);
    expect(result.scores.length).toBe(result.documents.length);
    expect(result.query).toBe('salary cap');
  });

  // FAILS IF: provenance enforcement crashes
  it('should enforce provenance on embedded document', async () => {
    const prov = { sourceId: 'financial', hash: '', authoritative: true, timestamp: new Date() };
    const doc = await kb.embed('Test content', {}, prov as any);
    // Hash won't match because provenance.hash is empty
    const enforcement = await kb.enforceProvenance(doc.id);
    expect(typeof enforcement.valid).toBe('boolean');
    expect(enforcement.issues).toBeDefined();
  });

  it('should return invalid for nonexistent document', async () => {
    const result = await kb.enforceProvenance('nonexistent-id');
    expect(result.valid).toBe(false);
    expect(result.issues).toContain('Not found');
  });
});

// ============================================================================
// SportsGovernancePreset
// ============================================================================

describe('Sports — SportsGovernancePreset', () => {
  let preset: InstanceType<typeof SportsGovernancePreset>;

  beforeEach(() => { preset = new SportsGovernancePreset(); });

  it('should have correct preset metadata', () => {
    expect(preset.verticalId).toBe('sports');
    expect(preset.presetId).toBe('sports-governance');
    expect(preset.name).toBe('Sports Governance Workflow');
  });

  // FAILS IF: capabilities empty
  it('should define capabilities', () => {
    expect(preset.capabilities.length).toBeGreaterThan(0);
    const ids = preset.capabilities.map(c => c.id);
    expect(ids).toContain('ffp-analysis');
    expect(ids).toContain('transfer-review');
    for (const cap of preset.capabilities) {
      expect(cap.name).toBeTruthy();
      expect(cap.requiredPermissions.length).toBeGreaterThan(0);
    }
  });

  // FAILS IF: guardrails empty
  it('should define guardrails with hard stops', () => {
    expect(preset.guardrails.length).toBeGreaterThan(0);
    const ids = preset.guardrails.map(g => g.id);
    expect(ids).toContain('tpo-block');
    expect(ids).toContain('concussion-block');
    for (const g of preset.guardrails) {
      expect(g.type).toBe('hard-stop');
      expect(g.condition).toBeTruthy();
      expect(g.action).toBeTruthy();
    }
  });

  // FAILS IF: workflow empty
  it('should define workflow steps', () => {
    expect(preset.workflow.length).toBeGreaterThan(0);
    for (const step of preset.workflow) {
      expect(step.id).toBeTruthy();
      expect(step.name).toBeTruthy();
      expect(step.agentId).toBeTruthy();
    }
  });

  // FAILS IF: loadWorkflow crashes
  it('should load workflow steps', async () => {
    const steps = await preset.loadWorkflow();
    expect(steps.length).toBe(preset.workflow.length);
  });

  // FAILS IF: enforceGuardrails crashes
  it('should enforce guardrails (default allows)', async () => {
    const result = await preset.enforceGuardrails();
    expect(result.allowed).toBe(true);
  });

  // FAILS IF: trace doesn't produce valid AgentTrace
  it('should create a trace entry', () => {
    const trace = preset.trace('step-1', 'compliance-reviewer', { data: 'test' });
    expect(trace.stepId).toBe('step-1');
    expect(trace.agentId).toBe('compliance-reviewer');
    expect(trace.status).toBe('running');
    expect(trace.startedAt).toBeInstanceOf(Date);
    expect(trace.completedAt).toBeNull();
  });
});

// ============================================================================
// SportsDefensibleOutput
// ============================================================================

describe('Sports — SportsDefensibleOutput', () => {
  let output: InstanceType<typeof SportsDefensibleOutput>;

  beforeEach(() => { output = new SportsDefensibleOutput(); });

  // FAILS IF: regulator packet generation crashes or missing fields
  it('should generate a regulator packet for transfer decision', async () => {
    const decision = makeTransferDecision();
    const packet = await output.toRegulatorPacket(decision as any, 'fifa-regulations');
    expect(packet.id).toBeTruthy();
    expect(packet.decisionId).toBe('DEC-TRANSFER-001');
    expect(packet.frameworkId).toBe('fifa-regulations');
    expect(packet.sections.executiveSummary).toContain('player-transfer');
    expect(packet.signatures.length).toBeGreaterThan(0);
    expect(packet.hash).toBeTruthy();
    expect(packet.validUntil).toBeDefined();
  });

  // FAILS IF: court bundle generation crashes or missing fields
  it('should generate a court bundle for transfer decision', async () => {
    const decision = makeTransferDecision();
    const bundle = await output.toCourtBundle(decision as any, 'CAS-2026-001');
    expect(bundle.id).toBeTruthy();
    expect(bundle.decisionId).toBe('DEC-TRANSFER-001');
    expect(bundle.caseReference).toBe('CAS-2026-001');
    expect(bundle.sections.factualBackground).toContain('player-transfer');
    expect(bundle.sections.humanOversight).toContain('sporting-director');
    expect(bundle.sections.evidenceChain.length).toBeGreaterThan(0);
    expect(bundle.certifications.integrityHash).toBeTruthy();
  });

  // FAILS IF: court bundle without case ref crashes
  it('should generate a court bundle without case reference', async () => {
    const decision = makeTransferDecision();
    const bundle = await output.toCourtBundle(decision as any);
    expect(bundle.id).toBeTruthy();
    expect(bundle.caseReference).toBeUndefined();
  });

  // FAILS IF: audit trail generation crashes
  it('should generate an audit trail', async () => {
    const decision = makeTransferDecision();
    const events = [
      { timestamp: new Date(), actor: 'scout-team', action: 'player-identified', details: { rating: 8.5 } },
      { timestamp: new Date(), actor: 'sporting-director', action: 'transfer-approved', details: { fee: 50_000_000 } },
      { timestamp: new Date(), actor: 'system', action: 'guardrail-check', details: { passed: true } },
    ];
    const trail = await output.toAuditTrail(decision as any, events);
    expect(trail.id).toBeTruthy();
    expect(trail.decisionId).toBe('DEC-TRANSFER-001');
    expect(trail.events.length).toBe(3);
    expect(trail.summary.totalEvents).toBe(3);
    expect(trail.summary.uniqueActors).toBe(3);
    expect(trail.summary.guardrailsTriggered).toBe(1);
    expect(trail.summary.dissentsRecorded).toBe(0);
    expect(trail.hash).toBeTruthy();
    for (const e of trail.events) {
      expect(e.hash).toBeTruthy();
    }
  });
});

// ============================================================================
// SportsVerticalImplementation
// ============================================================================

describe('Sports — SportsVerticalImplementation', () => {
  let vertical: InstanceType<typeof SportsVerticalImplementation>;

  beforeEach(() => { vertical = new SportsVerticalImplementation(); });

  it('should have correct vertical metadata', () => {
    expect(vertical.verticalId).toBe('sports');
    expect(vertical.verticalName).toBe('Sports');
    expect(vertical.completionPercentage).toBe(100);
  });

  // FAILS IF: 6-layer pattern not complete
  it('should have all 6 layers instantiated', () => {
    expect(vertical.dataConnector).toBeInstanceOf(SportsDataConnector);
    expect(vertical.knowledgeBase).toBeInstanceOf(SportsKnowledgeBaseLayer);
    expect(vertical.complianceMapper).toBeInstanceOf(SportsComplianceMapper);
    expect(vertical.decisionSchemas).toBeInstanceOf(Map);
    expect(vertical.agentPresets).toBeInstanceOf(Map);
    expect(vertical.defensibleOutput).toBeInstanceOf(SportsDefensibleOutput);
  });

  // FAILS IF: decision schemas not registered
  it('should have decision schemas registered', () => {
    expect(vertical.decisionSchemas.size).toBeGreaterThanOrEqual(2);
    expect(vertical.decisionSchemas.has('player-transfer')).toBe(true);
    expect(vertical.decisionSchemas.has('financial-fair-play')).toBe(true);
  });

  // FAILS IF: agent presets not registered
  it('should have agent presets registered', () => {
    expect(vertical.agentPresets.size).toBeGreaterThanOrEqual(1);
    expect(vertical.agentPresets.has('sports-governance')).toBe(true);
  });

  // FAILS IF: getStatus returns wrong shape
  it('should return complete status', () => {
    const status = vertical.getStatus();
    expect(status.vertical).toBe('Sports');
    expect(status.completionPercentage).toBe(100);
    expect(status.layers.dataConnector).toBe(true);
    expect(status.layers.knowledgeBase).toBe(true);
    expect(status.layers.complianceMapper).toBe(true);
    expect(status.layers.decisionSchemas).toBe(true);
    expect(status.layers.agentPresets).toBe(true);
    expect(status.layers.defensibleOutput).toBe(true);
    expect(status.totalComplianceFrameworks).toBe(10);
    expect(status.totalDecisionTypes).toBe(12);
    expect(status.missingComponents).toHaveLength(0);
  });
});
