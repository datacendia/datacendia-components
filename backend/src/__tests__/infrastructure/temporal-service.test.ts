// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * TEMPORAL SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the TemporalService in embedded mode (TEMPORAL_ENABLED=false).
 * Validates: workflow start, signal, cancel, terminate, list, definitions, stats.
 * =============================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.stubEnv('TEMPORAL_ENABLED', 'false');

describe('TemporalService (embedded mode)', () => {
  let temporal: any;

  beforeEach(async () => {
    const mod = await import('../../services/temporal/TemporalService.js');
    temporal = mod.temporal;
  });

  it('should report as disabled / embedded mode', () => {
    expect(temporal.isEnabled()).toBe(false);
    expect(temporal.isConnected()).toBe(false);
  });

  it('should have built-in workflow definitions', () => {
    const defs = temporal.getWorkflowDefs();
    expect(defs.length).toBeGreaterThanOrEqual(5);
    const names = defs.map((d: any) => d.id);
    expect(names).toContain('council-deliberation');
    expect(names).toContain('compliance-review');
    expect(names).toContain('data-pipeline');
    expect(names).toContain('incident-response');
    expect(names).toContain('scheduled-report');
    expect(names).toContain('onboarding-saga');
  });

  it('should get a specific workflow definition', () => {
    const def = temporal.getWorkflowDef('council-deliberation');
    expect(def).toBeDefined();
    expect(def.name).toBe('CouncilDeliberation');
    expect(def.activities.length).toBeGreaterThanOrEqual(7);
    expect(def.signals).toContain('veto');
    expect(def.signals).toContain('approve');
  });

  it('should start a workflow in embedded mode', async () => {
    const execution = await temporal.startWorkflow({
      workflowType: 'council-deliberation',
      input: { decision: 'Test decision' },
    });

    expect(execution.workflowId).toBeTruthy();
    expect(execution.runId).toBeTruthy();
    expect(execution.workflowType).toBe('council-deliberation');
    expect(execution.state).toBe('RUNNING');
    expect(execution.startedAt).toBeInstanceOf(Date);
    expect(execution.activityHistory.length).toBeGreaterThan(0);
  });

  it('should retrieve a workflow by ID', async () => {
    const execution = await temporal.startWorkflow({
      workflowType: 'compliance-review',
    });

    const retrieved = await temporal.getWorkflow(execution.workflowId);
    expect(retrieved).toBeDefined();
    expect(retrieved!.workflowId).toBe(execution.workflowId);
  });

  it('should list workflows with filters', async () => {
    await temporal.startWorkflow({ workflowType: 'council-deliberation' });
    await temporal.startWorkflow({ workflowType: 'data-pipeline' });

    const result = await temporal.listWorkflows({ limit: 10 });
    expect(result.executions.length).toBeGreaterThanOrEqual(2);
    expect(result.total).toBeGreaterThanOrEqual(2);

    const filtered = await temporal.listWorkflows({ workflowType: 'data-pipeline' });
    expect(filtered.executions.every((e: any) => e.workflowType === 'data-pipeline')).toBe(true);
  });

  it('should cancel a workflow via signal', async () => {
    const execution = await temporal.startWorkflow({
      workflowType: 'council-deliberation',
    });

    const result = await temporal.cancelWorkflow(execution.workflowId, 'test cancel');
    expect(result).toBe(true);

    const updated = await temporal.getWorkflow(execution.workflowId);
    expect(updated!.state).toBe('CANCELLED');
    expect(updated!.completedAt).toBeInstanceOf(Date);
  });

  it('should terminate a workflow immediately', async () => {
    const execution = await temporal.startWorkflow({
      workflowType: 'data-pipeline',
    });

    const result = await temporal.terminateWorkflow(execution.workflowId, 'admin kill');
    expect(result).toBe(true);

    const updated = await temporal.getWorkflow(execution.workflowId);
    expect(updated!.state).toBe('TERMINATED');
    expect(updated!.error).toBe('admin kill');
  });

  it('should register custom workflow definitions', () => {
    temporal.registerWorkflow({
      id: 'custom-test',
      name: 'CustomTest',
      description: 'Test workflow',
      taskQueue: 'test-queue',
      executionTimeoutSec: 60,
      activityTimeoutSec: 10,
      activities: [
        { name: 'Step1', description: 'Test step', startToCloseTimeoutSec: 10 },
      ],
    });

    const def = temporal.getWorkflowDef('custom-test');
    expect(def).toBeDefined();
    expect(def.name).toBe('CustomTest');
  });

  it('should track stats correctly', () => {
    const stats = temporal.getStats();
    expect(stats.enabled).toBe(false);
    expect(stats.mode).toBe('embedded');
    expect(typeof stats.startedCount).toBe('number');
    expect(typeof stats.completedCount).toBe('number');
    expect(typeof stats.failedCount).toBe('number');
    expect(typeof stats.successRate).toBe('number');
  });

  it('should check server health in embedded mode', async () => {
    const health = await temporal.checkServerHealth();
    expect(health.enabled).toBe(false);
    expect(health.mode).toBe('embedded');
    expect(health.connected).toBe(false);
  });
});
