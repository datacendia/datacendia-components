/**
 * CendiaCommandService Deep Tests
 *
 * Tests vertical-specific AI command interface:
 * - Vertical configuration retrieval (all 15 verticals)
 * - Quick action retrieval and category filtering
 * - Natural language command parsing with pattern matching
 * - Command execution lifecycle (pending -> processing -> completed)
 * - Command suggestions based on partial input
 * - Execution history retrieval and filtering
 * - Dashboard and health checks
 *
 * @module __tests__/services/CendiaCommandDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { CendiaCommandService, VERTICAL_CONFIGS } = await import('../../services/command/CendiaCommandService.js');

type CommandContextType = {
  verticalId: string;
  userId: string;
  organizationId: string;
  sessionId: string;
};

function createService(): InstanceType<typeof CendiaCommandService> {
  return new CendiaCommandService();
}

const CTX_FINANCIAL: CommandContextType = {
  verticalId: 'financial',
  userId: 'usr-analyst',
  organizationId: 'org-test',
  sessionId: 'sess-001',
};

const CTX_LEGAL: CommandContextType = {
  verticalId: 'legal',
  userId: 'usr-attorney',
  organizationId: 'org-test',
  sessionId: 'sess-002',
};

const CTX_HEALTHCARE: CommandContextType = {
  verticalId: 'healthcare',
  userId: 'usr-clinician',
  organizationId: 'org-test',
  sessionId: 'sess-003',
};

// ============================================================================
// VERTICAL CONFIGURATION
// ============================================================================

describe('CendiaCommand — Vertical Configuration', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: any of the 15 verticals missing from config
  it('should have all 15 vertical configurations', () => {
    const verticals = svc.getAllVerticals();
    expect(verticals.length).toBe(15);
    const ids = verticals.map(v => v.id);
    expect(ids).toContain('financial');
    expect(ids).toContain('legal');
    expect(ids).toContain('healthcare');
    expect(ids).toContain('government');
    expect(ids).toContain('defense');
    expect(ids).toContain('energy');
    expect(ids).toContain('insurance');
    expect(ids).toContain('manufacturing');
    expect(ids).toContain('retail');
    expect(ids).toContain('telecom');
    expect(ids).toContain('aerospace');
    expect(ids).toContain('pharma');
    expect(ids).toContain('education');
    expect(ids).toContain('realestate');
    expect(ids).toContain('media');
  });

  // FAILS IF: vertical summary missing required fields
  it('should return vertical summary with required fields', () => {
    const verticals = svc.getAllVerticals();
    for (const v of verticals) {
      expect(v.id).toBeTruthy();
      expect(v.name).toBeTruthy();
      expect(v.description).toBeTruthy();
      expect(v.quickActionCount).toBeGreaterThan(0);
      expect(v.primaryAgents.length).toBeGreaterThan(0);
      expect(v.complianceFrameworks.length).toBeGreaterThanOrEqual(0);
    }
  });

  // FAILS IF: financial config missing critical compliance frameworks
  it('should return financial vertical with correct frameworks', () => {
    const config = svc.getVerticalConfig('financial' as any);
    expect(config).toBeDefined();
    expect(config.name).toBe('Financial Services');
    expect(config.complianceFrameworks).toContain('BASEL-III');
    expect(config.complianceFrameworks).toContain('DORA');
    expect(config.complianceFrameworks).toContain('MiFID-II');
    expect(config.complianceFrameworks).toContain('SOX');
    expect(config.primaryAgents).toContain('CFO');
    expect(config.primaryAgents).toContain('Risk');
    expect(config.primaryAgents).toContain('Compliance');
  });

  // FAILS IF: healthcare config missing HIPAA
  it('should return healthcare vertical with HIPAA frameworks', () => {
    const config = svc.getVerticalConfig('healthcare' as any);
    expect(config.name).toBe('Healthcare');
    expect(config.complianceFrameworks).toContain('HIPAA');
    expect(config.complianceFrameworks).toContain('FDA-21-CFR-11');
    expect(config.primaryAgents).toContain('Clinical');
  });

  // FAILS IF: defense config missing ITAR/CMMC
  it('should return defense vertical with export control frameworks', () => {
    const config = svc.getVerticalConfig('defense' as any);
    expect(config.complianceFrameworks).toContain('ITAR');
    expect(config.complianceFrameworks).toContain('CMMC');
    expect(config.complianceFrameworks).toContain('EAR');
  });
});

// ============================================================================
// QUICK ACTIONS
// ============================================================================

describe('CendiaCommand — Quick Actions', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: financial vertical has no quick actions
  it('should return quick actions for financial vertical', () => {
    const actions = svc.getQuickActions('financial' as any);
    expect(actions.length).toBeGreaterThan(0);
    for (const action of actions) {
      expect(action.id).toBeTruthy();
      expect(action.label).toBeTruthy();
      expect(action.command).toBeTruthy();
      expect(action.category).toBeTruthy();
      expect(action.agentsInvolved.length).toBeGreaterThan(0);
    }
  });

  // FAILS IF: category filter doesn't work
  it('should filter quick actions by category', () => {
    const riskActions = svc.getQuickActions('financial' as any, 'Risk');
    expect(riskActions.length).toBeGreaterThan(0);
    expect(riskActions.every(a => a.category === 'Risk')).toBe(true);
  });

  // FAILS IF: compliance actions missing from financial
  it('should have compliance-related quick actions for financial', () => {
    const compActions = svc.getQuickActions('financial' as any, 'Compliance');
    expect(compActions.length).toBeGreaterThan(0);
    expect(compActions.some(a => a.id === 'fin-compliance-check')).toBe(true);
  });

  // FAILS IF: unknown vertical returns actions
  it('should return empty array for unknown vertical', () => {
    const actions = svc.getQuickActions('nonexistent' as any);
    expect(actions).toEqual([]);
  });

  // FAILS IF: quick actions missing compliance framework references
  it('should include compliance frameworks in quick actions', () => {
    const actions = svc.getQuickActions('financial' as any);
    const stressTest = actions.find(a => a.id === 'fin-stress-test');
    expect(stressTest).toBeDefined();
    expect(stressTest!.complianceFrameworks).toContain('BASEL-III');
    expect(stressTest!.complianceFrameworks).toContain('DORA');
  });
});

// ============================================================================
// COMMAND PARSING
// ============================================================================

describe('CendiaCommand — Command Parsing', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: risk-related command not parsed as 'analyze' action
  it('should parse financial risk command with high confidence', () => {
    const intent = svc.parseCommand('Analyze portfolio risk and VaR exposure', CTX_FINANCIAL as any);
    expect(intent.action).toBe('analyze');
    expect(intent.subject).toBe('risk');
    expect(intent.confidence).toBeGreaterThan(0.7);
    expect(intent.suggestedAgents.length).toBeGreaterThan(0);
    expect(intent.relevantFrameworks.length).toBeGreaterThan(0);
  });

  // FAILS IF: compliance command not parsed
  it('should parse compliance command correctly', () => {
    const intent = svc.parseCommand('Check our regulatory compliance status', CTX_FINANCIAL as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('compliance');
    expect(intent.confidence).toBeGreaterThan(0.7);
  });

  // FAILS IF: trade review not parsed
  it('should parse trade execution command', () => {
    const intent = svc.parseCommand('Review trade execution quality for last quarter', CTX_FINANCIAL as any);
    expect(intent.action).toBe('review');
    expect(intent.subject).toBe('trading');
  });

  // FAILS IF: legal contract command not parsed
  it('should parse legal contract review command', () => {
    const intent = svc.parseCommand('Review this contract for unfavorable terms', CTX_LEGAL as any);
    expect(intent.action).toBe('review');
    expect(intent.subject).toBe('contract');
    expect(intent.confidence).toBeGreaterThan(0.7);
  });

  // FAILS IF: healthcare HIPAA command not parsed
  it('should parse healthcare HIPAA command', () => {
    const intent = svc.parseCommand('Check HIPAA compliance for patient data transfers', CTX_HEALTHCARE as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('hipaa');
  });

  // FAILS IF: unknown command doesn't get default intent
  it('should return default intent for unrecognized command', () => {
    const intent = svc.parseCommand('What is the meaning of life?', CTX_FINANCIAL as any);
    expect(intent.action).toBe('query');
    expect(intent.subject).toBe('general');
    expect(intent.confidence).toBeLessThanOrEqual(0.5);
    expect(intent.suggestedAgents.length).toBeGreaterThan(0);
  });

  // FAILS IF: unknown vertical crashes
  it('should handle unknown vertical gracefully', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'nonexistent' };
    const intent = svc.parseCommand('Test command', ctx as any);
    expect(intent.action).toBe('query');
    expect(intent.confidence).toBe(0.3);
  });

  // FAILS IF: parameters missing rawCommand
  it('should include raw command in parameters', () => {
    const cmd = 'Analyze risk exposure for EMEA portfolio';
    const intent = svc.parseCommand(cmd, CTX_FINANCIAL as any);
    expect(intent.parameters.rawCommand).toBe(cmd);
  });
});

// ============================================================================
// COMMAND EXECUTION
// ============================================================================

describe('CendiaCommand — Command Execution', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: execution doesn't complete
  it('should execute a command and return completed execution', async () => {
    const execution = await svc.executeCommand('Analyze portfolio risk exposure', CTX_FINANCIAL as any);
    expect(execution.id).toBeTruthy();
    expect(execution.command).toBe('Analyze portfolio risk exposure');
    expect(execution.status).toBe('completed');
    expect(execution.completedAt).toBeInstanceOf(Date);
    expect(execution.startedAt).toBeInstanceOf(Date);
    expect(execution.verticalId).toBe('financial');
  });

  // FAILS IF: intent not attached to execution
  it('should attach parsed intent to execution', async () => {
    const execution = await svc.executeCommand('Check regulatory compliance status', CTX_FINANCIAL as any);
    expect(execution.intent).toBeDefined();
    expect(execution.intent.action).toBe('validate');
    expect(execution.intent.subject).toBe('compliance');
  });

  // FAILS IF: result missing
  it('should include result with suggested next steps', async () => {
    const execution = await svc.executeCommand('Review trade execution quality', CTX_FINANCIAL as any);
    expect(execution.result).toBeDefined();
    expect(execution.result.message).toContain('Command processed');
    expect(execution.result.suggestedNextSteps).toBeDefined();
    expect(execution.result.suggestedNextSteps.length).toBeGreaterThan(0);
  });

  // FAILS IF: execution not stored
  it('should store execution for later retrieval', async () => {
    const execution = await svc.executeCommand('Analyze risk', CTX_FINANCIAL as any);
    const retrieved = svc.getExecution(execution.id);
    expect(retrieved).toBeDefined();
    expect(retrieved!.id).toBe(execution.id);
    expect(retrieved!.command).toBe('Analyze risk');
  });

  // FAILS IF: nonexistent execution returns something
  it('should return undefined for nonexistent execution', () => {
    const retrieved = svc.getExecution('nonexistent-id');
    expect(retrieved).toBeUndefined();
  });
});

// ============================================================================
// COMMAND SUGGESTIONS
// ============================================================================

describe('CendiaCommand — Suggestions', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: no suggestions for "risk"
  it('should return suggestions matching partial command', () => {
    const suggestions = svc.getSuggestions('risk', CTX_FINANCIAL as any);
    expect(suggestions.length).toBeGreaterThan(0);
    for (const s of suggestions) {
      expect(s.command).toBeTruthy();
      expect(s.description).toBeTruthy();
      expect(s.relevance).toBeGreaterThan(0);
      expect(s.category).toBeTruthy();
    }
  });

  // FAILS IF: suggestions exceed limit of 5
  it('should return at most 5 suggestions', () => {
    const suggestions = svc.getSuggestions('a', CTX_FINANCIAL as any);
    expect(suggestions.length).toBeLessThanOrEqual(5);
  });

  // FAILS IF: suggestions not sorted by relevance
  it('should return suggestions sorted by relevance descending', () => {
    const suggestions = svc.getSuggestions('compliance', CTX_FINANCIAL as any);
    for (let i = 1; i < suggestions.length; i++) {
      expect(suggestions[i - 1].relevance).toBeGreaterThanOrEqual(suggestions[i].relevance);
    }
  });

  // FAILS IF: unknown vertical doesn't return empty
  it('should return empty suggestions for unknown vertical', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'nonexistent' };
    const suggestions = svc.getSuggestions('risk', ctx as any);
    expect(suggestions).toEqual([]);
  });

  // FAILS IF: legal suggestions don't match legal commands
  it('should return legal-specific suggestions', () => {
    const suggestions = svc.getSuggestions('contract', CTX_LEGAL as any);
    expect(suggestions.length).toBeGreaterThan(0);
    expect(suggestions.some(s => s.command.toLowerCase().includes('contract'))).toBe(true);
  });
});

// ============================================================================
// EXECUTION HISTORY
// ============================================================================

describe('CendiaCommand — Execution History', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: history not filtered by vertical
  it('should return execution history filtered by vertical', async () => {
    await svc.executeCommand('Analyze risk', CTX_FINANCIAL as any);
    await svc.executeCommand('Check compliance', CTX_FINANCIAL as any);
    await svc.executeCommand('Review contract', CTX_LEGAL as any);

    const financialHistory = svc.getExecutionHistory(CTX_FINANCIAL as any);
    expect(financialHistory.length).toBe(2);
    expect(financialHistory.every(e => e.verticalId === 'financial')).toBe(true);

    const legalHistory = svc.getExecutionHistory(CTX_LEGAL as any);
    expect(legalHistory.length).toBe(1);
    expect(legalHistory[0].verticalId).toBe('legal');
  });

  // FAILS IF: history not sorted by most recent first
  it('should return history sorted by most recent first', async () => {
    await svc.executeCommand('First command', CTX_FINANCIAL as any);
    await svc.executeCommand('Second command', CTX_FINANCIAL as any);
    await svc.executeCommand('Third command', CTX_FINANCIAL as any);

    const history = svc.getExecutionHistory(CTX_FINANCIAL as any);
    expect(history.length).toBe(3);
    expect(history[0].command).toBe('Third command');
    expect(history[2].command).toBe('First command');
  });

  // FAILS IF: limit not respected
  it('should respect limit parameter', async () => {
    for (let i = 0; i < 5; i++) {
      await svc.executeCommand(`Command ${i}`, CTX_FINANCIAL as any);
    }
    const history = svc.getExecutionHistory(CTX_FINANCIAL as any, 2);
    expect(history.length).toBe(2);
  });
});

// ============================================================================
// CROSS-VERTICAL COMMAND PATTERNS
// ============================================================================

describe('CendiaCommand — Cross-Vertical Patterns', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: energy NERC CIP command not parsed
  it('should parse energy NERC CIP command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'energy' };
    const intent = svc.parseCommand('Check NERC CIP compliance status', ctx as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('nerc-cip');
  });

  // FAILS IF: insurance claims command not parsed
  it('should parse insurance claims command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'insurance' };
    const intent = svc.parseCommand('Review claim for fraud indicators', ctx as any);
    expect(intent.action).toBe('review');
    expect(intent.subject).toBe('claims');
  });

  // FAILS IF: manufacturing quality command not parsed
  it('should parse manufacturing quality command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'manufacturing' };
    const intent = svc.parseCommand('Review quality control metrics', ctx as any);
    expect(intent.action).toBe('review');
    expect(intent.subject).toBe('quality');
  });

  // FAILS IF: government FedRAMP command not parsed
  it('should parse government FedRAMP command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'government' };
    const intent = svc.parseCommand('Check FedRAMP authorization status', ctx as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('fedramp');
  });

  // FAILS IF: defense ITAR command not parsed
  it('should parse defense ITAR export control command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'defense' };
    const intent = svc.parseCommand('Review items for ITAR classification', ctx as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('export-control');
  });

  // FAILS IF: pharma GxP command not parsed
  it('should parse pharma GxP command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'pharma' };
    const intent = svc.parseCommand('Check GMP compliance for batch production', ctx as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('gxp');
  });

  // FAILS IF: retail PCI command not parsed
  it('should parse retail PCI DSS command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'retail' };
    const intent = svc.parseCommand('Check PCI DSS compliance for payment processing', ctx as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('pci');
  });

  // FAILS IF: education FERPA command not parsed
  it('should parse education FERPA command', () => {
    const ctx = { ...CTX_FINANCIAL, verticalId: 'education' };
    const intent = svc.parseCommand('Check FERPA compliance for student records', ctx as any);
    expect(intent.action).toBe('validate');
    expect(intent.subject).toBe('ferpa');
  });
});

// ============================================================================
// DASHBOARD & HEALTH
// ============================================================================

describe('CendiaCommand — Dashboard & Health', () => {
  let svc: InstanceType<typeof CendiaCommandService>;
  beforeEach(() => { svc = createService(); });

  // FAILS IF: dashboard returns wrong shape
  it('should return dashboard with correct structure', async () => {
    await svc.executeCommand('Test command', CTX_FINANCIAL as any);

    const dashboard = await svc.getDashboard();
    expect(dashboard.serviceName).toBe('CendiaCommand');
    expect(dashboard.status).toBe('operational');
    expect(dashboard.recordCount).toBeGreaterThan(0);
    expect(dashboard.lastActivity).toBeInstanceOf(Date);
    expect(typeof dashboard.uptime).toBe('number');
    expect(typeof dashboard.metrics).toBe('object');
  });

  // FAILS IF: health check returns unhealthy
  it('should return healthy status', async () => {
    const health = await svc.getHealth();
    expect(health.healthy).toBe(true);
    expect(health.service).toBe('CendiaCommand');
    expect(health.timestamp).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('uptime');
    expect(health.details).toHaveProperty('memoryMB');
  });
});
