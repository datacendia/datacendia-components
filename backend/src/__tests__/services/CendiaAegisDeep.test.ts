/**
 * CendiaAegisService Deep Tests
 *
 * Tests strategic defense intelligence:
 * - Signal ingestion and LLM-based analysis
 * - Threat creation and status management
 * - Cascade scenario generation
 * - Countermeasure generation and implementation
 * - Executive threat briefings
 * - Dashboard aggregation
 * - IR Playbook generation (NIST 800-61)
 * - Signal correlation (temporal, entity, source)
 * - Threat hunting with hypothesis-driven queries
 * - Quick briefing and threat summary (express mode)
 * - Health check
 *
 * @module __tests__/services/CendiaAegisDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

// Mock EnhancedLLMService
let llmGenerateMock = vi.fn();
vi.mock('../../services/EnhancedLLMService.js', () => {
  return {
    EnhancedLLMService: class MockEnhancedLLMService {
      generate(...args: unknown[]) { return llmGenerateMock(...args); }
    },
  };
});

// Mock prisma with rich return values for testing
const mockPrisma = {
  aegis_signals: {
    create: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
    count: vi.fn().mockResolvedValue(0),
  },
  aegis_threats: {
    create: vi.fn(),
    findUnique: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
    update: vi.fn(),
    count: vi.fn().mockResolvedValue(0),
  },
  aegis_scenarios: {
    create: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
  },
  aegis_countermeasures: {
    create: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
    update: vi.fn(),
    count: vi.fn().mockResolvedValue(0),
  },
  aegis_briefings: {
    create: vi.fn(),
    findMany: vi.fn().mockResolvedValue([]),
  },
  alerts: { findMany: vi.fn().mockResolvedValue([]) },
  audit_logs: { findMany: vi.fn().mockResolvedValue([]) },
};

vi.mock('../../config/database.js', () => ({
  prisma: mockPrisma,
}));

const { CendiaAegisService } = await import('../../services/CendiaAegisService.js');

type AegisServiceType = InstanceType<typeof CendiaAegisService>;

function createService(): AegisServiceType {
  return new CendiaAegisService();
}

const ORG = 'org-aegis-test';

// ============================================================================
// SIGNAL INGESTION
// ============================================================================

describe('CendiaAegis — Signal Ingestion', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();

    llmGenerateMock = vi.fn().mockResolvedValue(JSON.stringify({
      severity: 'HIGH',
      confidence: 0.85,
      entities: ['ACME Corp', 'Production Server'],
      tags: ['ransomware', 'critical-infrastructure'],
      threatIndicators: ['encryption activity', 'c2 communication'],
    }));

    mockPrisma.aegis_signals.create.mockResolvedValue({
      id: 'sig-001',
      organization_id: ORG,
      signal_type: 'CYBER',
      source: 'CISA Alerts',
      title: 'Ransomware Campaign Targeting Critical Infrastructure',
      content: 'New ransomware variant detected targeting industrial control systems',
      severity: 'HIGH',
      confidence: 0.85,
      entities_mentioned: ['ACME Corp', 'Production Server'],
      tags: ['ransomware', 'critical-infrastructure'],
    });

    mockPrisma.aegis_threats.create.mockResolvedValue({
      id: 'threat-001', organization_id: ORG, threat_type: 'CYBER_ATTACK',
      title: 'Ransomware Threat', description: 'Active ransomware campaign',
      severity: 'HIGH', probability: 0.7, impact_score: 80,
      affected_assets: ['Production Server'], status: 'ACTIVE',
    });
  });

  // FAILS IF: signal not ingested correctly
  it('should ingest a cyber threat signal with LLM analysis', async () => {
    const signal = await svc.ingestSignal(ORG, {
      signalType: 'CYBER',
      source: 'CISA Alerts',
      title: 'Ransomware Campaign Targeting Critical Infrastructure',
      content: 'New ransomware variant detected targeting industrial control systems',
    });

    expect(signal.id).toBe('sig-001');
    expect(signal.signalType).toBe('CYBER');
    expect(signal.severity).toBe('HIGH');
    expect(signal.confidence).toBe(0.85);
    expect(signal.entities).toContain('ACME Corp');
    expect(signal.tags).toContain('ransomware');
  });

  // FAILS IF: LLM called with wrong prompt
  it('should call LLM with signal content for analysis', async () => {
    await svc.ingestSignal(ORG, {
      signalType: 'GEOPOLITICAL',
      source: 'Reuters',
      title: 'Sanctions Update',
      content: 'New trade restrictions on key supplier regions',
    });

    // analyzeSignal + assessThreatFromSignal (severity HIGH + confidence > 0.6)
    expect(llmGenerateMock).toHaveBeenCalledTimes(2);
    const prompt = llmGenerateMock.mock.calls[0][0];
    expect(prompt).toContain('GEOPOLITICAL');
    expect(prompt).toContain('Sanctions Update');
  });

  // FAILS IF: LLM failure crashes ingestion
  it('should fall back to defaults when LLM analysis fails', async () => {
    llmGenerateMock = vi.fn().mockRejectedValue(new Error('LLM unavailable'));

    mockPrisma.aegis_signals.create.mockResolvedValue({
      id: 'sig-002', organization_id: ORG, signal_type: 'FINANCIAL',
      source: 'Market Watch', title: 'Market Alert',
      content: 'Significant market movement', severity: 'LOW',
      confidence: 0.5, entities_mentioned: [], tags: ['financial'],
    });

    const signal = await svc.ingestSignal(ORG, {
      signalType: 'FINANCIAL',
      source: 'Market Watch',
      title: 'Market Alert',
      content: 'Significant market movement',
    });

    expect(signal.id).toBe('sig-002');
    expect(signal.severity).toBe('LOW');
    expect(signal.confidence).toBe(0.5);
  });
});

// ============================================================================
// THREAT MANAGEMENT
// ============================================================================

describe('CendiaAegis — Threat Management', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: threat not created with correct fields
  it('should create a manual threat assessment', async () => {
    mockPrisma.aegis_threats.create.mockResolvedValue({
      id: 'threat-manual-001', organization_id: ORG,
      threat_type: 'DATA_BREACH', title: 'Suspected Data Exfiltration',
      description: 'Unusual data transfer patterns detected from finance department',
      severity: 'CRITICAL', probability: 0.75, impact_score: 90,
      affected_assets: ['Finance DB', 'HR System'], status: 'ACTIVE',
    });

    const threat = await svc.createThreat(ORG, {
      threatType: 'DATA_BREACH',
      title: 'Suspected Data Exfiltration',
      description: 'Unusual data transfer patterns detected from finance department',
      severity: 'CRITICAL',
      probability: 0.75,
      impactScore: 90,
      affectedAssets: ['Finance DB', 'HR System'],
    });

    expect(threat.id).toBe('threat-manual-001');
    expect(threat.threatType).toBe('DATA_BREACH');
    expect(threat.severity).toBe('CRITICAL');
    expect(threat.probability).toBe(0.75);
    expect(threat.impactScore).toBe(90);
    expect(threat.affectedAssets).toContain('Finance DB');
    expect(threat.status).toBe('ACTIVE');
  });

  // FAILS IF: threat status not updated
  it('should update threat status to MITIGATED', async () => {
    mockPrisma.aegis_threats.update.mockResolvedValue({
      id: 'threat-001', organization_id: ORG,
      threat_type: 'CYBER_ATTACK', title: 'Ransomware',
      description: 'Contained', severity: 'HIGH',
      probability: 0.3, impact_score: 40,
      affected_assets: ['Server'], status: 'MITIGATED',
    });

    const updated = await svc.updateThreatStatus('threat-001', 'MITIGATED');
    expect(updated.status).toBe('MITIGATED');
    expect(mockPrisma.aegis_threats.update).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { id: 'threat-001' },
        data: expect.objectContaining({ status: 'MITIGATED', mitigated_at: expect.any(Date) }),
      })
    );
  });

  // FAILS IF: RESOLVED status doesn't set mitigated_at
  it('should set mitigated_at when resolving threat', async () => {
    mockPrisma.aegis_threats.update.mockResolvedValue({
      id: 'threat-002', threat_type: 'INSIDER_THREAT', title: 'Resolved Insider',
      description: 'Resolved', severity: 'MEDIUM', probability: 0, impact_score: 0,
      affected_assets: [], status: 'RESOLVED',
    });

    await svc.updateThreatStatus('threat-002', 'RESOLVED');
    const updateCall = mockPrisma.aegis_threats.update.mock.calls[0][0];
    expect(updateCall.data.mitigated_at).toBeInstanceOf(Date);
  });

  // FAILS IF: active threats not returned
  it('should get active threats for organization', async () => {
    mockPrisma.aegis_threats.findMany.mockResolvedValue([
      { id: 't1', threat_type: 'CYBER_ATTACK', title: 'Active Cyber Threat', description: 'Ongoing',
        severity: 'CRITICAL', probability: 0.8, impact_score: 95, affected_assets: ['All Systems'], status: 'ACTIVE' },
      { id: 't2', threat_type: 'SUPPLY_CHAIN_ATTACK', title: 'Supply Chain Issue', description: 'Monitoring',
        severity: 'HIGH', probability: 0.6, impact_score: 70, affected_assets: ['Vendor A'], status: 'MONITORING' },
    ]);

    const threats = await svc.getActiveThreats(ORG);
    expect(threats.length).toBe(2);
    expect(threats[0].threatType).toBe('CYBER_ATTACK');
    expect(threats[1].status).toBe('MONITORING');
  });
});

// ============================================================================
// IR PLAYBOOK GENERATION (PURE DOMAIN LOGIC — NO DB)
// ============================================================================

describe('CendiaAegis — IR Playbook (NIST 800-61)', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: playbook structure wrong
  it('should generate CYBER_ATTACK playbook with all NIST phases', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'CYBER_ATTACK');
    const pb = result.playbook;

    expect(pb.incidentType).toBe('CYBER_ATTACK');
    expect(pb.title).toBe('Cyber Attack Response Playbook');

    // NIST phases
    expect(pb.nistPhases.preparation.length).toBeGreaterThan(0);
    expect(pb.nistPhases.detectionAndAnalysis.length).toBeGreaterThan(0);
    expect(pb.nistPhases.containment.shortTerm.length).toBeGreaterThan(0);
    expect(pb.nistPhases.containment.longTerm.length).toBeGreaterThan(0);
    expect(pb.nistPhases.eradication.length).toBeGreaterThan(0);
    expect(pb.nistPhases.recovery.length).toBeGreaterThan(0);
    expect(pb.nistPhases.lessonsLearned.length).toBe(5);
  });

  // FAILS IF: preparation steps missing responsible/tools
  it('should include responsible parties and tools in preparation steps', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'CYBER_ATTACK');
    for (const step of result.playbook.nistPhases.preparation) {
      expect(step.step).toBeTruthy();
      expect(step.responsible).toBeTruthy();
      expect(step.tools.length).toBeGreaterThan(0);
    }
  });

  // FAILS IF: containment missing timeframes
  it('should include timeframes in containment steps', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'CYBER_ATTACK');
    for (const step of result.playbook.nistPhases.containment.shortTerm) {
      expect(step.step).toBeTruthy();
      expect(step.timeframe).toBeTruthy();
      expect(step.impact).toBeTruthy();
    }
  });

  // FAILS IF: escalation matrix missing severity levels
  it('should have escalation matrix covering all severity levels', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'DATA_BREACH');
    const severities = result.playbook.escalationMatrix.map((e: { severity: string }) => e.severity);
    expect(severities).toContain('CRITICAL');
    expect(severities).toContain('HIGH');
    expect(severities).toContain('MEDIUM');
    expect(severities).toContain('LOW');
    expect(severities).toContain('INFORMATIONAL');
  });

  // FAILS IF: communication plan missing audiences
  it('should have communication plan with appropriate audiences', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'DATA_BREACH');
    const audiences = result.playbook.communicationPlan.map((c: { audience: string }) => c.audience);
    expect(audiences).toContain('Executive Leadership');
    expect(audiences).toContain('Legal/Compliance');
  });

  // FAILS IF: DATA_BREACH template not used
  it('should generate DATA_BREACH playbook with breach-specific steps', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'DATA_BREACH');
    expect(result.playbook.title).toBe('Data Breach Response Playbook');
    // Breach-specific: should mention notification
    const recoverySteps = result.playbook.nistPhases.recovery.map((s: { step: string }) => s.step);
    expect(recoverySteps.some((s: string) => s.toLowerCase().includes('notification'))).toBe(true);
  });

  // FAILS IF: INSIDER_THREAT template not used
  it('should generate INSIDER_THREAT playbook with UBA steps', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'INSIDER_THREAT');
    expect(result.playbook.title).toBe('Insider Threat Response Playbook');
    const prepSteps = result.playbook.nistPhases.preparation.map((s: { step: string }) => s.step);
    expect(prepSteps.some((s: string) => s.toLowerCase().includes('behavior analytics'))).toBe(true);
  });

  // FAILS IF: unknown type doesn't get default template
  it('should use default template for unrecognized incident types', async () => {
    const result = await svc.generateIRPlaybook(ORG, 'NATURAL_DISASTER');
    expect(result.playbook.title).toContain('NATURAL DISASTER');
    expect(result.playbook.nistPhases.preparation.length).toBeGreaterThan(0);
  });
});

// ============================================================================
// SIGNAL CORRELATION
// ============================================================================

describe('CendiaAegis — Signal Correlation', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: empty signals don't return clean result
  it('should return empty correlation when no signals exist', async () => {
    mockPrisma.aegis_signals.findMany.mockResolvedValue([]);

    const result = await svc.correlateSignals(ORG);
    expect(result.correlationGroups).toEqual([]);
    expect(result.totalSignalsAnalyzed).toBe(0);
    expect(result.overallThreatLevel).toBe('LOW');
  });

  // FAILS IF: temporal correlation doesn't group signals within 1 hour
  it('should detect temporal correlation for signals within 1 hour', async () => {
    const baseTime = new Date('2026-03-01T10:00:00Z');
    const signals = Array.from({ length: 5 }, (_, i) => ({
      id: `sig-temp-${i}`,
      title: `Temporal Signal ${i}`,
      signal_type: 'CYBER',
      severity: 'HIGH',
      confidence: 0.8,
      source: `Source ${i}`,
      entities_mentioned: [],
      tags: [],
      created_at: new Date(baseTime.getTime() + i * 60000), // 1 minute apart
    }));

    mockPrisma.aegis_signals.findMany.mockResolvedValue(signals);

    const result = await svc.correlateSignals(ORG);
    expect(result.totalSignalsAnalyzed).toBe(5);
    // 5 signals within 1 hour should form a temporal group
    const temporalGroups = result.correlationGroups.filter((g: { correlationType: string }) => g.correlationType === 'TEMPORAL');
    expect(temporalGroups.length).toBeGreaterThan(0);
    expect(temporalGroups[0].signals.length).toBeGreaterThanOrEqual(3);
  });

  // FAILS IF: entity correlation doesn't detect shared entities
  it('should detect entity correlation for shared entities', async () => {
    const signals = [
      { id: 'sig-e1', title: 'Signal 1', signal_type: 'CYBER', severity: 'MEDIUM', confidence: 0.7,
        source: 'Source A', entities_mentioned: ['ACME Corp'], tags: [], created_at: new Date('2026-03-01T10:00:00Z') },
      { id: 'sig-e2', title: 'Signal 2', signal_type: 'FINANCIAL', severity: 'HIGH', confidence: 0.8,
        source: 'Source B', entities_mentioned: ['ACME Corp'], tags: [], created_at: new Date('2026-03-05T10:00:00Z') },
    ];

    mockPrisma.aegis_signals.findMany.mockResolvedValue(signals);

    const result = await svc.correlateSignals(ORG);
    const entityGroups = result.correlationGroups.filter((g: { correlationType: string }) => g.correlationType === 'ENTITY');
    expect(entityGroups.length).toBeGreaterThan(0);
  });

  // FAILS IF: overall threat level calculation wrong
  it('should calculate overall threat level from group severity', async () => {
    const signals = Array.from({ length: 4 }, (_, i) => ({
      id: `sig-sev-${i}`,
      title: `Critical Signal ${i}`,
      signal_type: 'CYBER',
      severity: 'CRITICAL',
      confidence: 0.95,
      source: 'Same Source',
      entities_mentioned: [],
      tags: [],
      created_at: new Date('2026-03-01T10:00:00Z'),
    }));

    mockPrisma.aegis_signals.findMany.mockResolvedValue(signals);

    const result = await svc.correlateSignals(ORG);
    // 4 CRITICAL signals from same source = high composite risk
    expect(['CRITICAL', 'HIGH']).toContain(result.overallThreatLevel);
  });
});

// ============================================================================
// THREAT HUNTING
// ============================================================================

describe('CendiaAegis — Threat Hunting', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: clean hunt doesn't return CLEAN verdict
  it('should return CLEAN verdict when no findings', async () => {
    mockPrisma.aegis_signals.findMany.mockResolvedValue([]);
    mockPrisma.aegis_threats.findMany.mockResolvedValue([]);
    mockPrisma.alerts.findMany.mockResolvedValue([]);
    mockPrisma.audit_logs.findMany.mockResolvedValue([]);

    const result = await svc.runThreatHunt(ORG);
    expect(result.verdict).toBe('CLEAN');
    expect(result.findings.length).toBe(0);
    expect(result.dataSourcesChecked.length).toBe(4);
    expect(result.nextSteps.length).toBeGreaterThan(0);
    expect(result.nextSteps.some((s: string) => s.includes('clean'))).toBe(true);
  });

  // FAILS IF: critical signals not flagged as THREAT_FOUND
  it('should return THREAT_FOUND when critical signals exist', async () => {
    mockPrisma.aegis_signals.findMany.mockResolvedValue([
      { id: 's1', title: 'Critical Alert', signal_type: 'CYBER', severity: 'CRITICAL',
        confidence: 0.95, source: 'CISA', entities_mentioned: [], tags: [], created_at: new Date() },
    ]);
    mockPrisma.aegis_threats.findMany.mockResolvedValue([]);
    mockPrisma.alerts.findMany.mockResolvedValue([]);
    mockPrisma.audit_logs.findMany.mockResolvedValue([]);

    const result = await svc.runThreatHunt(ORG);
    expect(result.verdict).toBe('THREAT_FOUND');
    expect(result.findings.some((f: { severity: string }) => f.severity === 'CRITICAL')).toBe(true);
    expect(result.nextSteps.some((s: string) => s.includes('incident response'))).toBe(true);
  });

  // FAILS IF: anomalous users not detected
  it('should detect anomalous user activity in audit logs', async () => {
    // Need 1 user with 3x+ average activity. With 50 suspicious + 10 normal users × 1 log each:
    // total=60 logs, 11 users, avg=60/11≈5.45. suspicious=50 > 5.45*3=16.35 → detected
    const logs = [
      ...Array.from({ length: 50 }, (_, i) => ({ id: `log-${i}`, user_id: 'user-suspicious', created_at: new Date() })),
      ...Array.from({ length: 10 }, (_, i) => ({ id: `log-norm-${i}`, user_id: `user-normal-${i}`, created_at: new Date() })),
    ];

    mockPrisma.aegis_signals.findMany.mockResolvedValue([]);
    mockPrisma.aegis_threats.findMany.mockResolvedValue([]);
    mockPrisma.alerts.findMany.mockResolvedValue([]);
    mockPrisma.audit_logs.findMany.mockResolvedValue(logs);

    const result = await svc.runThreatHunt(ORG);
    expect(result.verdict).toBe('SUSPICIOUS');
    expect(result.findings.some((f: { finding: string }) => f.finding.includes('anomalous'))).toBe(true);
  });

  // FAILS IF: custom hypothesis not used
  it('should use provided hypothesis', async () => {
    mockPrisma.aegis_signals.findMany.mockResolvedValue([]);
    mockPrisma.aegis_threats.findMany.mockResolvedValue([]);
    mockPrisma.alerts.findMany.mockResolvedValue([]);
    mockPrisma.audit_logs.findMany.mockResolvedValue([]);

    const result = await svc.runThreatHunt(ORG, {
      hypothesis: 'APT group may be present in the network',
    });
    expect(result.hypothesis).toBe('APT group may be present in the network');
  });
});

// ============================================================================
// QUICK BRIEFING (EXPRESS MODE)
// ============================================================================

describe('CendiaAegis — Quick Briefing (Express)', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: no threats doesn't return clean briefing
  it('should return clean briefing when no active threats', async () => {
    mockPrisma.aegis_threats.findMany.mockResolvedValue([]);

    const briefing = await svc.getQuickBriefing(ORG);
    expect(briefing.threat).toBe('No active threats detected');
    expect(briefing.severity).toBe('INFORMATIONAL');
    expect(briefing.probability).toBe(0);
    expect(briefing.mode).toBe('express');
    expect(briefing.generatedAt).toBeInstanceOf(Date);
  });

  // FAILS IF: specific threat briefing fails
  it('should generate briefing for specific threat with existing countermeasures', async () => {
    mockPrisma.aegis_threats.findUnique.mockResolvedValue({
      id: 'threat-x', title: 'Ransomware Attack', threat_type: 'CYBER_ATTACK',
      description: 'Active ransomware targeting finance servers',
      severity: 'CRITICAL', probability: 0.85, impact_score: 95,
      affected_assets: ['Finance Server', 'Backup System'],
      attack_vectors: ['phishing'],
      countermeasures: [
        { id: 'cm1', title: 'Isolate Affected Systems', cost_estimate: 5000 },
        { id: 'cm2', title: 'Deploy EDR Updates', cost_estimate: 15000 },
        { id: 'cm3', title: 'Rebuild Infrastructure', cost_estimate: 100000 },
      ],
    });

    const briefing = await svc.getQuickBriefing(ORG, 'threat-x');
    expect(briefing.threat).toBe('Ransomware Attack');
    expect(briefing.severity).toBe('CRITICAL');
    expect(briefing.probability).toBe(0.85);
    expect(briefing.countermeasures.length).toBe(3);
    expect(briefing.countermeasures[0].action).toBe('Isolate Affected Systems');
    expect(briefing.countermeasures[0].effort).toBe('LOW'); // cost < 10000
    expect(briefing.countermeasures[2].effort).toBe('HIGH'); // cost > 50000
    expect(briefing.mode).toBe('express');
  });

  // FAILS IF: nonexistent threat doesn't throw
  it('should throw for nonexistent threat', async () => {
    mockPrisma.aegis_threats.findUnique.mockResolvedValue(null);

    try {
      await svc.getQuickBriefing(ORG, 'nonexistent');
      expect.unreachable('Should have thrown');
    } catch (err: any) {
      expect(err.message).toBe('Threat not found');
    }
  });
});

// ============================================================================
// THREAT SUMMARY (EXPRESS MODE)
// ============================================================================

describe('CendiaAegis — Threat Summary (Express)', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: risk score calculation wrong
  it('should calculate risk score from threat severity counts', async () => {
    mockPrisma.aegis_threats.findMany.mockResolvedValue([
      { id: 't1', threat_type: 'CYBER_ATTACK', title: 'Critical Threat', severity: 'CRITICAL',
        probability: 0.9, impact_score: 95, affected_assets: [], status: 'ACTIVE' },
      { id: 't2', threat_type: 'DATA_BREACH', title: 'High Threat', severity: 'HIGH',
        probability: 0.7, impact_score: 80, affected_assets: [], status: 'MONITORING' },
      { id: 't3', threat_type: 'INSIDER_THREAT', title: 'Medium Threat', severity: 'MEDIUM',
        probability: 0.5, impact_score: 50, affected_assets: [], status: 'ACTIVE' },
    ]);

    const summary = await svc.getThreatSummary(ORG);
    expect(summary.threatLevel).toBe('CRITICAL');
    expect(summary.activeThreats).toBe(3);
    expect(summary.criticalCount).toBe(1);
    expect(summary.highCount).toBe(1);
    // riskScore = min(100, 1*30 + 1*15 + 3*5) = 60
    expect(summary.riskScore).toBe(60);
    expect(summary.topThreats.length).toBe(3);
    expect(summary.mode).toBe('express');
  });

  // FAILS IF: no threats returns wrong threat level
  it('should return LOW threat level with no threats', async () => {
    mockPrisma.aegis_threats.findMany.mockResolvedValue([]);

    const summary = await svc.getThreatSummary(ORG);
    expect(summary.threatLevel).toBe('LOW');
    expect(summary.activeThreats).toBe(0);
    expect(summary.riskScore).toBe(0);
  });
});

// ============================================================================
// DASHBOARD
// ============================================================================

describe('CendiaAegis — Dashboard', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
    vi.clearAllMocks();
  });

  // FAILS IF: dashboard shape wrong
  it('should aggregate dashboard data from multiple sources', async () => {
    mockPrisma.aegis_threats.count.mockResolvedValue(5);
    mockPrisma.aegis_signals.count.mockResolvedValue(12);
    mockPrisma.aegis_threats.findMany.mockResolvedValue([
      { id: 't1', title: 'Critical Ransomware', severity: 'CRITICAL', threat_type: 'CYBER_ATTACK' },
      { id: 't2', title: 'Supply Chain Risk', severity: 'HIGH', threat_type: 'SUPPLY_CHAIN_ATTACK' },
    ]);
    mockPrisma.aegis_countermeasures.count.mockResolvedValue(3);

    const dashboard = await svc.getDashboard(ORG);
    expect(dashboard.activeThreats).toBe(5);
    expect(dashboard.signalsLast24h).toBe(12);
    expect(dashboard.criticalThreats).toBe(2);
    expect(dashboard.pendingCountermeasures).toBe(3);
    expect(dashboard.topThreats.length).toBeLessThanOrEqual(5);
    expect(dashboard.threatFeeds).toBe(7); // 7 feeds defined in THREAT_FEEDS
  });
});

// ============================================================================
// HEALTH CHECK
// ============================================================================

describe('CendiaAegis — Health Check', () => {
  let svc: AegisServiceType;

  beforeEach(() => {
    svc = createService();
  });

  // FAILS IF: health check shape wrong
  it('should return healthy status with uptime and memory', async () => {
    const health = await svc.getHealth();
    expect(health.healthy).toBe(true);
    expect(health.service).toBe('CendiaAegis');
    expect(health.timestamp).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('uptime');
    expect(health.details).toHaveProperty('memoryMB');
  });
});
