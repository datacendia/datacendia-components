/**
 * DecisionService Deep Tests
 *
 * Tests the full decision lifecycle "Black Box Flight Recorder":
 * - CRUD: create, get, getDecisions, update
 * - Analysis recording: pre-mortem, council session, ghost board
 * - Final decision & outcome recording with audit hash
 * - Timeline & full replay
 * - Export for audit with hash validation
 * - Analytics: getDecisionStats, getDashboardMetrics
 * - Health check & model selection
 *
 * All tests exercise real in-memory logic with meaningful assertions.
 * Prisma is mocked to fall through to in-memory paths.
 *
 * @module __tests__/services/DecisionServiceDeep.test
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
vi.mock('../../config/aiModels.js', () => ({
  aiModelSelector: { getModelForService: vi.fn().mockReturnValue('llama3.2:3b') },
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    decisions: {
      findUnique: vi.fn().mockResolvedValue(null),
      findMany: vi.fn().mockResolvedValue([]),
      create: vi.fn().mockResolvedValue({}),
    },
  },
}));

const { DecisionService, decisionService } = await import('../../services/DecisionService.js');

const ORG = 'org-deep-test';
const USER = 'user-analyst-1';

// Helper: create a decision with real business context
async function createTestDecision(overrides: Record<string, any> = {}) {
  return decisionService.createDecision({
    organizationId: overrides.organizationId || ORG,
    userId: overrides.userId || USER,
    title: overrides.title || 'Migrate to multi-cloud infrastructure',
    description: overrides.description || 'Evaluate moving from single AWS to multi-cloud AWS+GCP for resilience',
    category: overrides.category || 'infrastructure',
    priority: overrides.priority || 'high',
    budget: overrides.budget ?? 500000,
    timeframe: overrides.timeframe || 'Q2 2025',
    deadline: overrides.deadline || new Date('2025-06-30'),
    stakeholders: overrides.stakeholders || ['CTO', 'VP Engineering', 'Security Lead'],
    constraints: overrides.constraints || ['Budget cap $500K', 'Zero downtime migration'],
  });
}

// ============================================================================
// DECISION CRUD
// ============================================================================

describe('DecisionService — CRUD', () => {
  // FAILS IF: createDecision doesn't return a properly structured Decision
  it('should create a decision with all fields populated', async () => {
    const dec = await createTestDecision();

    expect(dec).toBeDefined();
    expect(dec.id).toMatch(/^dec-/);
    expect(dec.organizationId).toBe(ORG);
    expect(dec.createdBy).toBe(USER);
    expect(dec.title).toBe('Migrate to multi-cloud infrastructure');
    expect(dec.status).toBe('draft');
    expect(dec.priority).toBe('high');
    expect(dec.category).toBe('infrastructure');
    expect(dec.budget).toBe(500000);
    expect(dec.timeframe).toBe('Q2 2025');
    expect(dec.deadline).toBeInstanceOf(Date);
    expect(dec.version).toBe(1);

    // Context
    expect(dec.context.stakeholders).toContain('CTO');
    expect(dec.context.constraints).toContain('Budget cap $500K');
    expect(dec.context.assumptions).toEqual([]);
    expect(dec.context.dataSourcesUsed).toEqual([]);

    // Empty analysis arrays
    expect(dec.preMortems).toEqual([]);
    expect(dec.councilSessions).toEqual([]);
    expect(dec.ghostBoardSimulations).toEqual([]);

    // Timeline should have "created" event
    expect(dec.timeline).toHaveLength(1);
    expect(dec.timeline[0].type).toBe('created');
    expect(dec.timeline[0].title).toBe('Decision Created');
    expect(dec.timeline[0].userId).toBe(USER);
  });

  // FAILS IF: defaults are wrong when optional params omitted
  it('should use defaults for optional fields', async () => {
    const dec = await decisionService.createDecision({
      organizationId: ORG,
      userId: USER,
      title: 'Simple decision',
      description: 'Minimal params test',
    });

    expect(dec.priority).toBe('medium');
    expect(dec.category).toBe('general');
    expect(dec.budget).toBeUndefined();
    expect(dec.timeframe).toBeUndefined();
    expect(dec.deadline).toBeUndefined();
    expect(dec.context.stakeholders).toEqual([]);
    expect(dec.context.constraints).toEqual([]);
  });

  // FAILS IF: getDecision returns null for valid in-memory decision
  it('should retrieve decision by ID (in-memory fallback)', async () => {
    const dec = await createTestDecision();
    const retrieved = await decisionService.getDecision(dec.id);

    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(dec.id);
    expect(retrieved!.title).toBe(dec.title);
  });

  // FAILS IF: returns non-null for unknown ID
  it('should return null for non-existent decision', async () => {
    const result = await decisionService.getDecision('nonexistent-id');
    expect(result).toBeNull();
  });

  // FAILS IF: getDecisions doesn't return summaries for org
  it('should list decisions for organization', async () => {
    const uniqueOrg = `org-list-${Date.now()}`;
    await decisionService.createDecision({
      organizationId: uniqueOrg,
      userId: USER,
      title: 'Decision A',
      description: 'First',
    });
    await decisionService.createDecision({
      organizationId: uniqueOrg,
      userId: USER,
      title: 'Decision B',
      description: 'Second',
      category: 'finance',
    });

    const all = await decisionService.getDecisions(uniqueOrg);
    expect(all.length).toBe(2);
    expect(all[0]).toHaveProperty('id');
    expect(all[0]).toHaveProperty('title');
    expect(all[0]).toHaveProperty('status');
    expect(all[0]).toHaveProperty('priority');
    expect(all[0]).toHaveProperty('eventCount');
  });

  // FAILS IF: status filter doesn't work
  it('should filter decisions by status', async () => {
    const uniqueOrg = `org-filter-${Date.now()}`;
    const dec = await decisionService.createDecision({
      organizationId: uniqueOrg,
      userId: USER,
      title: 'Filterable',
      description: 'Test filtering',
    });
    // Update to 'analyzing'
    await decisionService.updateDecision(dec.id, USER, { status: 'analyzing' });

    const drafts = await decisionService.getDecisions(uniqueOrg, { status: 'draft' });
    expect(drafts.length).toBe(0);

    const analyzing = await decisionService.getDecisions(uniqueOrg, { status: 'analyzing' });
    expect(analyzing.length).toBe(1);
  });

  // FAILS IF: update doesn't modify fields and increment version
  it('should update decision fields and increment version', async () => {
    const dec = await createTestDecision();
    const updated = await decisionService.updateDecision(dec.id, USER, {
      title: 'Updated: Multi-cloud migration',
      priority: 'critical',
      tags: ['urgent', 'infra'],
    });

    expect(updated).not.toBeNull();
    expect(updated!.title).toBe('Updated: Multi-cloud migration');
    expect(updated!.priority).toBe('critical');
    expect(updated!.tags).toContain('urgent');
    expect(updated!.version).toBe(2);

    // Timeline should have update event
    expect(updated!.timeline).toHaveLength(2);
    expect(updated!.timeline[1].type).toBe('context_added');
    expect(updated!.timeline[1].summary).toContain('title');
  });

  // FAILS IF: update returns non-null for unknown ID
  it('should return null when updating non-existent decision', async () => {
    const result = await decisionService.updateDecision('fake-id', USER, { title: 'Nope' });
    expect(result).toBeNull();
  });
});

// ============================================================================
// ANALYSIS RECORDING — Black Box Data
// ============================================================================

describe('DecisionService — Analysis Recording', () => {
  let decisionId: string;

  beforeEach(async () => {
    const dec = await createTestDecision({ title: `Analysis-${Date.now()}` });
    decisionId = dec.id;
  });

  // FAILS IF: recordPreMortem doesn't store snapshot or update status
  it('should record pre-mortem and change status to analyzing', async () => {
    const result = await decisionService.recordPreMortem(decisionId, USER, {
      overallRiskScore: 65,
      recommendation: { action: 'PROCEED_WITH_CAUTION' },
      agentAnalyses: [
        { agentId: 'risk-analyst', findings: 'High vendor lock-in risk' },
        { agentId: 'cost-analyst', findings: 'Budget overrun possible' },
      ],
      failureModes: [
        { title: 'Vendor lock-in', probability: 0.4, costImpact: 200000, category: 'strategic' },
        { title: 'Migration downtime', probability: 0.2, costImpact: 150000, category: 'operational' },
      ],
      totalRiskWeightedExposure: 110000,
    });

    expect(result).not.toBeNull();
    expect(result!.status).toBe('analyzing');
    expect(result!.preMortems).toHaveLength(1);

    const pm = result!.preMortems[0];
    expect(pm.riskScore).toBe(65);
    expect(pm.recommendation).toBe('PROCEED_WITH_CAUTION');
    expect(pm.selectedAgents).toContain('risk-analyst');
    expect(pm.failureModes).toHaveLength(2);
    expect(pm.failureModes[0].title).toBe('Vendor lock-in');
    expect(pm.failureModes[0].probability).toBe(0.4);
    expect(pm.totalExposure).toBe(110000);

    // Timeline event
    const lastEvent = result!.timeline[result!.timeline.length - 1];
    expect(lastEvent.type).toBe('premortem_run');
    expect(lastEvent.summary).toContain('65');
    expect(lastEvent.agentsInvolved).toContain('risk-analyst');
  });

  // FAILS IF: recordCouncilSession doesn't store snapshot or update status
  it('should record council session and change status to deliberating', async () => {
    const result = await decisionService.recordCouncilSession(decisionId, USER, {
      mode: 'adversarial',
      query: 'Should we proceed with multi-cloud migration?',
      agentResponses: [
        { agentId: 'agent-strategy', agentName: 'Strategy Advisor', response: 'Proceed for resilience', confidence: 85 },
        { agentId: 'agent-finance', agentName: 'Finance Advisor', response: 'Cost concerns with dual infra', confidence: 60 },
      ],
      synthesis: 'Proceed with phased approach to manage costs',
      consensusLevel: 72,
    });

    expect(result).not.toBeNull();
    expect(result!.status).toBe('deliberating');
    expect(result!.councilSessions).toHaveLength(1);

    const cs = result!.councilSessions[0];
    expect(cs.mode).toBe('adversarial');
    expect(cs.query).toContain('multi-cloud');
    expect(cs.agentResponses).toHaveLength(2);
    expect(cs.agentResponses[0].agentName).toBe('Strategy Advisor');
    expect(cs.agentResponses[0].confidence).toBe(85);
    expect(cs.synthesis).toContain('phased');
    expect(cs.consensusLevel).toBe(72);

    // Timeline
    const lastEvent = result!.timeline[result!.timeline.length - 1];
    expect(lastEvent.type).toBe('council_session');
    expect(lastEvent.agentsInvolved).toContain('agent-strategy');
  });

  // FAILS IF: recordGhostBoard doesn't store snapshot
  it('should record ghost board simulation', async () => {
    const result = await decisionService.recordGhostBoard(decisionId, USER, {
      boardMembers: ['Warren Buffett', 'Jamie Dimon', 'Satya Nadella'],
      questions: [
        { member: 'Warren Buffett', question: 'What is the margin of safety?', difficulty: 'hard' },
        { member: 'Satya Nadella', question: 'How does this align with platform strategy?', difficulty: 'medium' },
      ],
      preparednessScore: 68,
      criticalGaps: ['No disaster recovery plan for migration', 'Unclear rollback strategy'],
    });

    expect(result).not.toBeNull();
    expect(result!.ghostBoardSimulations).toHaveLength(1);

    const gb = result!.ghostBoardSimulations[0];
    expect(gb.boardMembers).toContain('Warren Buffett');
    expect(gb.questions).toHaveLength(2);
    expect(gb.questions[0].difficulty).toBe('hard');
    expect(gb.preparednessScore).toBe(68);
    expect(gb.criticalGaps).toHaveLength(2);
    expect(gb.criticalGaps[0]).toContain('disaster recovery');

    // Timeline
    const lastEvent = result!.timeline[result!.timeline.length - 1];
    expect(lastEvent.type).toBe('ghost_board');
    expect(lastEvent.summary).toContain('68');
  });

  // FAILS IF: returns non-null for unknown decision
  it('should return null for unknown decision ID in all record methods', async () => {
    expect(await decisionService.recordPreMortem('fake', USER, {})).toBeNull();
    expect(await decisionService.recordCouncilSession('fake', USER, {})).toBeNull();
    expect(await decisionService.recordGhostBoard('fake', USER, {})).toBeNull();
  });
});

// ============================================================================
// FINAL DECISION & OUTCOME
// ============================================================================

describe('DecisionService — Final Decision & Outcome', () => {
  let decisionId: string;

  beforeEach(async () => {
    const dec = await createTestDecision({ title: `Outcome-${Date.now()}` });
    decisionId = dec.id;
  });

  // FAILS IF: recordFinalDecision doesn't set status/hash
  it('should record final decision with audit hash', async () => {
    const result = await decisionService.recordFinalDecision(
      decisionId,
      USER,
      'Proceed with phased multi-cloud migration starting with non-critical services'
    );

    expect(result).not.toBeNull();
    expect(result!.status).toBe('decided');
    expect(result!.finalDecision).toContain('phased multi-cloud');
    expect(result!.decisionMadeAt).toBeInstanceOf(Date);
    expect(result!.decisionMadeBy).toBe(USER);
    expect(result!.auditHash).toBeDefined();
    expect(result!.auditHash!.startsWith('audit-')).toBe(true);

    // Timeline
    const lastEvent = result!.timeline[result!.timeline.length - 1];
    expect(lastEvent.type).toBe('decision_made');
  });

  // FAILS IF: recordOutcome doesn't set status to closed
  it('should record outcome and close decision', async () => {
    await decisionService.recordFinalDecision(decisionId, USER, 'Go multi-cloud');

    const result = await decisionService.recordOutcome(decisionId, USER, {
      actualResult: 'partial_success',
      notes: 'Migration completed but 2 hours of degraded performance during cutover',
      lessonsLearned: [
        'Need dedicated migration team',
        'Canary deployments essential for cloud migration',
      ],
      predictedRisksOccurred: ['Migration downtime'],
      unpredictedIssues: ['DNS propagation delays in GCP'],
      financialImpact: -25000,
    });

    expect(result).not.toBeNull();
    expect(result!.status).toBe('closed');
    expect(result!.outcome).toBeDefined();
    expect(result!.outcome!.actualResult).toBe('partial_success');
    expect(result!.outcome!.recordedAt).toBeInstanceOf(Date);
    expect(result!.outcome!.lessonsLearned).toHaveLength(2);
    expect(result!.outcome!.predictedRisksOccurred).toContain('Migration downtime');
    expect(result!.outcome!.unpredictedIssues).toContain('DNS propagation delays in GCP');
    expect(result!.outcome!.financialImpact).toBe(-25000);

    // Audit hash should be updated
    expect(result!.auditHash).toBeDefined();
  });

  // FAILS IF: returns non-null for unknown decision
  it('should return null for unknown decision', async () => {
    expect(await decisionService.recordFinalDecision('fake', USER, 'x')).toBeNull();
    expect(await decisionService.recordOutcome('fake', USER, {
      actualResult: 'failure',
      notes: '',
      lessonsLearned: [],
      predictedRisksOccurred: [],
      unpredictedIssues: [],
    })).toBeNull();
  });
});

// ============================================================================
// TIMELINE, REPLAY & EXPORT
// ============================================================================

describe('DecisionService — Timeline, Replay & Export', () => {
  let decisionId: string;

  beforeEach(async () => {
    const dec = await createTestDecision({ title: `Replay-${Date.now()}` });
    decisionId = dec.id;
    // Add some analysis events
    await decisionService.recordPreMortem(decisionId, USER, {
      overallRiskScore: 45,
      recommendation: { action: 'PROCEED' },
      failureModes: [{ title: 'Scope creep', probability: 0.3, costImpact: 50000, category: 'project' }],
    });
    await decisionService.recordCouncilSession(decisionId, USER, {
      mode: 'consensus',
      query: 'Evaluate migration plan',
      agentResponses: [{ agentId: 'a1', agentName: 'Agent1', response: 'Approved', confidence: 90 }],
      synthesis: 'Consensus to proceed',
      consensusLevel: 90,
    });
    await decisionService.recordFinalDecision(decisionId, USER, 'Approved');
  });

  // FAILS IF: getTimeline doesn't return all events
  it('should return full timeline with all events', async () => {
    const timeline = await decisionService.getTimeline(decisionId);
    expect(timeline.length).toBe(4); // created + premortem + council + decision_made
    expect(timeline[0].type).toBe('created');
    expect(timeline[1].type).toBe('premortem_run');
    expect(timeline[2].type).toBe('council_session');
    expect(timeline[3].type).toBe('decision_made');
  });

  // FAILS IF: returns empty for unknown decision
  it('should return empty timeline for unknown decision', async () => {
    const timeline = await decisionService.getTimeline('fake');
    expect(timeline).toEqual([]);
  });

  // FAILS IF: getFullReplay doesn't return numbered steps
  it('should return full replay with numbered steps', async () => {
    const replay = await decisionService.getFullReplay(decisionId);
    expect(replay).not.toBeNull();
    expect(replay!.decision.id).toBe(decisionId);
    expect(replay!.replay).toHaveLength(4);
    expect(replay!.replay[0].step).toBe(1);
    expect(replay!.replay[1].step).toBe(2);
    expect(replay!.replay[2].step).toBe(3);
    expect(replay!.replay[3].step).toBe(4);
    expect(replay!.replay[0].type).toBe('created');
    expect(replay!.replay[3].type).toBe('decision_made');
  });

  // FAILS IF: returns non-null for unknown decision
  it('should return null replay for unknown decision', async () => {
    expect(await decisionService.getFullReplay('fake')).toBeNull();
  });

  // FAILS IF: exportForAudit doesn't validate hash
  it('should export for audit with valid hash', async () => {
    const exported = await decisionService.exportForAudit(decisionId);
    expect(exported).not.toBeNull();
    expect(exported!.decision.id).toBe(decisionId);
    expect(exported!.auditMetadata.exportedAt).toBeInstanceOf(Date);
    expect(exported!.auditMetadata.hash).toMatch(/^audit-/);
    expect(exported!.auditMetadata.hashValid).toBe(true);
    expect(exported!.auditMetadata.totalEvents).toBe(4);
    expect(exported!.auditMetadata.analysisRuns).toBe(2); // 1 premortem + 1 council
  });

  // FAILS IF: returns non-null for unknown decision
  it('should return null export for unknown decision', async () => {
    expect(await decisionService.exportForAudit('fake')).toBeNull();
  });

  // FAILS IF: hash tampering not detected
  it('should detect tampered audit hash', async () => {
    // Get the decision and manually change its audit hash
    const dec = await decisionService.getDecision(decisionId);
    expect(dec).not.toBeNull();
    // Tamper with the hash
    dec!.auditHash = 'audit-tampered';

    const exported = await decisionService.exportForAudit(decisionId);
    expect(exported).not.toBeNull();
    expect(exported!.auditMetadata.hashValid).toBe(false);
  });
});

// ============================================================================
// ANALYTICS — Stats & Dashboard
// ============================================================================

describe('DecisionService — Analytics', () => {
  let orgId: string;

  beforeEach(async () => {
    orgId = `org-stats-${Date.now()}`;

    // Decision 1: completed with outcome
    const d1 = await decisionService.createDecision({
      organizationId: orgId,
      userId: USER,
      title: 'Decision with outcome',
      description: 'Test stats',
      priority: 'high',
    });
    await decisionService.recordPreMortem(d1.id, USER, {
      overallRiskScore: 70,
      failureModes: [{ title: 'Risk A', probability: 0.5, costImpact: 100000, category: 'ops' }],
    });
    await decisionService.recordFinalDecision(d1.id, USER, 'Go');
    await decisionService.recordOutcome(d1.id, USER, {
      actualResult: 'failure',
      notes: 'Did not go well',
      lessonsLearned: ['Learn from this'],
      predictedRisksOccurred: ['Risk A'],
      unpredictedIssues: [],
    });

    // Decision 2: still in draft
    await decisionService.createDecision({
      organizationId: orgId,
      userId: USER,
      title: 'Draft decision',
      description: 'Still open',
      priority: 'low',
    });

    // Decision 3: analyzing with low risk
    const d3 = await decisionService.createDecision({
      organizationId: orgId,
      userId: USER,
      title: 'Analyzing decision',
      description: 'Under analysis',
      priority: 'medium',
    });
    await decisionService.recordPreMortem(d3.id, USER, {
      overallRiskScore: 30,
      failureModes: [],
    });
  });

  // FAILS IF: getDecisionStats returns wrong counts
  it('should return accurate decision stats per org', async () => {
    const stats = await decisionService.getDecisionStats(orgId);
    expect(stats.total).toBe(3);
    expect(stats.byPriority['high']).toBe(1);
    expect(stats.byPriority['low']).toBe(1);
    expect(stats.byPriority['medium']).toBe(1);
    // avgRiskScore: (70+30)/2 = 50
    expect(stats.avgRiskScore).toBe(50);
    // outcomeAccuracy: d1 had riskScore 70>50 (predicted high) and actual 'failure' → correct
    expect(stats.outcomeAccuracy).toBe(100);
  });

  // FAILS IF: getDashboardMetrics doesn't aggregate globally
  it('should return dashboard metrics', () => {
    const metrics = decisionService.getDashboardMetrics();
    expect(typeof metrics.totalDecisions).toBe('number');
    expect(metrics.totalDecisions).toBeGreaterThan(0);
    expect(typeof metrics.pendingDecisions).toBe('number');
    expect(typeof metrics.decidedDecisions).toBe('number');
    expect(typeof metrics.avgRiskScore).toBe('number');
    expect(typeof metrics.outcomeAccuracy).toBe('number');
  });

  // FAILS IF: empty org returns wrong defaults
  it('should return zero stats for empty org', async () => {
    const stats = await decisionService.getDecisionStats('org-empty-never-used');
    expect(stats.total).toBe(0);
    expect(stats.avgRiskScore).toBe(0);
    expect(stats.outcomeAccuracy).toBe(0);
  });
});

// ============================================================================
// HEALTH CHECK & MODEL
// ============================================================================

describe('DecisionService — Health & Model', () => {
  // FAILS IF: healthCheck returns wrong shape
  it('should return healthy status', async () => {
    const health = await decisionService.healthCheck();
    expect(health.status).toBe('healthy');
    expect(health.lastCheck).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('totalDecisions');
    expect(health.details).toHaveProperty('organizations');
  });

  // FAILS IF: getModelForTask doesn't use aiModelSelector
  it('should return model for decision task', () => {
    const model = decisionService.getModelForTask();
    expect(model).toBe('llama3.2:3b');
  });
});

// ============================================================================
// FULL LIFECYCLE — End-to-End
// ============================================================================

describe('DecisionService — Full Lifecycle E2E', () => {
  // FAILS IF: any step in the lifecycle breaks
  it('should complete entire decision lifecycle from draft to closed', async () => {
    // 1. Create
    const dec = await decisionService.createDecision({
      organizationId: 'org-e2e',
      userId: 'cto-mike',
      title: 'Acquire CompetitorX',
      description: 'Strategic acquisition of CompetitorX to expand market share',
      priority: 'critical',
      budget: 10000000,
      stakeholders: ['CEO', 'CFO', 'CTO', 'Board'],
      constraints: ['Must pass antitrust review', 'Complete by end of year'],
    });
    expect(dec.status).toBe('draft');
    expect(dec.version).toBe(1);

    // 2. Pre-mortem analysis
    const afterPM = await decisionService.recordPreMortem(dec.id, 'cto-mike', {
      overallRiskScore: 55,
      recommendation: { action: 'PROCEED_WITH_CAUTION' },
      agentAnalyses: [
        { agentId: 'legal-ai', findings: 'Antitrust risk moderate' },
        { agentId: 'finance-ai', findings: 'Valuation appears fair' },
      ],
      failureModes: [
        { title: 'Antitrust block', probability: 0.25, costImpact: 2000000, category: 'regulatory' },
        { title: 'Culture clash', probability: 0.4, costImpact: 5000000, category: 'organizational' },
        { title: 'Key talent departure', probability: 0.35, costImpact: 3000000, category: 'human_capital' },
      ],
      totalRiskWeightedExposure: 3250000,
    });
    expect(afterPM!.status).toBe('analyzing');
    expect(afterPM!.version).toBe(2);

    // 3. Council deliberation
    const afterCouncil = await decisionService.recordCouncilSession(dec.id, 'cto-mike', {
      mode: 'adversarial',
      query: 'Should we acquire CompetitorX?',
      agentResponses: [
        { agentId: 'strategy', agentName: 'Strategy AI', response: 'Strong market synergy', confidence: 80 },
        { agentId: 'finance', agentName: 'Finance AI', response: 'Favorable DCF analysis', confidence: 75 },
        { agentId: 'risk', agentName: 'Risk AI', response: 'Integration risk high', confidence: 45 },
      ],
      synthesis: 'Proceed with acquisition but invest heavily in integration planning',
      consensusLevel: 67,
    });
    expect(afterCouncil!.status).toBe('deliberating');
    expect(afterCouncil!.version).toBe(3);

    // 4. Ghost board simulation
    const afterGB = await decisionService.recordGhostBoard(dec.id, 'cto-mike', {
      boardMembers: ['Warren Buffett', 'Reed Hastings', 'Indra Nooyi'],
      questions: [
        { member: 'Warren Buffett', question: 'What is the moat after acquisition?', difficulty: 'hard' },
        { member: 'Indra Nooyi', question: 'How will you retain their talent?', difficulty: 'medium' },
      ],
      preparednessScore: 72,
      criticalGaps: ['No detailed 100-day integration plan'],
    });
    expect(afterGB!.version).toBe(4);
    expect(afterGB!.ghostBoardSimulations).toHaveLength(1);

    // 5. Final decision
    const afterDecision = await decisionService.recordFinalDecision(
      dec.id,
      'ceo-sarah',
      'Approved: Acquire CompetitorX at $9.5M with 100-day integration plan required before close'
    );
    expect(afterDecision!.status).toBe('decided');
    expect(afterDecision!.version).toBe(5);
    expect(afterDecision!.auditHash).toBeDefined();

    // 6. Record outcome
    const afterOutcome = await decisionService.recordOutcome(dec.id, 'cto-mike', {
      actualResult: 'success',
      notes: 'Acquisition completed. Integration on track. Key talent retained.',
      lessonsLearned: [
        'Early integration planning was critical',
        'Ghost board identified the right gaps',
        'Adversarial council mode surfaced real concerns',
      ],
      predictedRisksOccurred: ['Culture clash'],
      unpredictedIssues: ['Customer overlap required account deduplication'],
      financialImpact: 2000000,
    });
    expect(afterOutcome!.status).toBe('closed');
    expect(afterOutcome!.version).toBe(6);

    // 7. Verify full timeline
    const timeline = await decisionService.getTimeline(dec.id);
    expect(timeline).toHaveLength(6);
    const types = timeline.map(e => e.type);
    expect(types).toEqual([
      'created', 'premortem_run', 'council_session', 'ghost_board', 'decision_made', 'outcome_recorded',
    ]);

    // 8. Verify replay
    const replay = await decisionService.getFullReplay(dec.id);
    expect(replay!.replay).toHaveLength(6);
    expect(replay!.replay[5].step).toBe(6);

    // 9. Verify audit export
    const exported = await decisionService.exportForAudit(dec.id);
    expect(exported!.auditMetadata.hashValid).toBe(true);
    expect(exported!.auditMetadata.totalEvents).toBe(6);
    expect(exported!.auditMetadata.analysisRuns).toBe(3); // PM + council + ghost board
  });
});
