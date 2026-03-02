// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Module — Opa Service Test
 *
 * Platform module.
 * @module __tests__/infrastructure/opa-service.test
 */

/**
 * =============================================================================
 * OPA SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the OPAService in embedded mode (OPA_ENABLED=true, OPA_MODE=embedded).
 * Validates: policy evaluation, ABAC, compliance, AI governance, health, stats.
 * =============================================================================
 */

import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.stubEnv('OPA_ENABLED', 'true');
vi.stubEnv('OPA_MODE', 'embedded');

describe('OPAService (embedded mode)', () => {
  let opa: any;

  beforeEach(async () => {
    const mod = await import('../../services/opa/OPAService.js');
    opa = mod.opa;
  });

  it('should have default policies loaded', () => {
    const policies = opa.getPolicies();
    expect(policies.length).toBeGreaterThanOrEqual(7);
    const ids = policies.map((p: any) => p.id);
    expect(ids).toContain('ac-data-classification');
    expect(ids).toContain('dg-pii-handling');
    expect(ids).toContain('comp-segregation-of-duties');
    expect(ids).toContain('ai-model-deployment');
    expect(ids).toContain('priv-consent-check');
    expect(ids).toContain('hc-minimum-necessary');
  });

  it('should allow access when clearance is sufficient', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1', clearanceLevel: 'confidential' },
      action: 'read',
      resource: { type: 'document', classification: 'internal' },
    });

    expect(result.allow).toBe(true);
    expect(result.violations.length).toBe(0);
    expect(result.metadata.policiesEvaluated).toBeGreaterThan(0);
    expect(result.metadata.decisionId).toBeTruthy();
  });

  it('should deny access when clearance is insufficient', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1', clearanceLevel: 'internal' },
      action: 'read',
      resource: { type: 'document', classification: 'top_secret' },
    });

    expect(result.allow).toBe(false);
    expect(result.violations.length).toBeGreaterThan(0);
    expect(result.violations[0].policyId).toBe('ac-data-classification');
    expect(result.violations[0].severity).toBe('error');
  });

  it('should enforce segregation of duties', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1' },
      action: 'approve_transaction',
      resource: { type: 'transaction', vertical: 'financial' },
      context: { initiatorId: 'user-1' },
    });

    expect(result.allow).toBe(false);
    expect(result.violations.some((v: any) => v.policyId === 'comp-segregation-of-duties')).toBe(true);
  });

  it('should add PII handling obligations', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1', clearanceLevel: 'confidential' },
      action: 'export',
      resource: { type: 'dataset', attributes: { containsPII: true } },
    });

    expect(result.obligations.length).toBeGreaterThan(0);
    expect(result.obligations.some((o: any) => o.type === 'encrypt')).toBe(true);
    expect(result.obligations.some((o: any) => o.type === 'log')).toBe(true);
  });

  it('should deny PII cross-border transfer without SCCs', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1', clearanceLevel: 'confidential' },
      action: 'export',
      resource: { type: 'dataset', attributes: { containsPII: true } },
      context: { destinationRegion: 'US' },
    });

    expect(result.violations.some((v: any) =>
      v.policyId === 'dg-pii-handling' && v.message.includes('adequacy decision')
    )).toBe(true);
  });

  it('should block high-risk AI model without impact assessment', async () => {
    const result = await opa.evaluate({
      subject: { id: 'admin-1' },
      action: 'deploy',
      resource: {
        type: 'ai_model',
        attributes: { riskLevel: 'high', hasImpactAssessment: false, hasBiasAudit: false },
      },
    });

    expect(result.allow).toBe(false);
    expect(result.violations.some((v: any) => v.message.includes('Impact Assessment'))).toBe(true);
  });

  it('should block unacceptable-risk AI system', async () => {
    const result = await opa.evaluate({
      subject: { id: 'admin-1' },
      action: 'deploy',
      resource: {
        type: 'ai_model',
        attributes: { riskLevel: 'unacceptable', hasImpactAssessment: true, hasBiasAudit: true },
      },
    });

    expect(result.allow).toBe(false);
    expect(result.violations.some((v: any) => v.message.includes('EU AI Act Art. 5'))).toBe(true);
  });

  it('should deny processing without consent or legal basis', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1' },
      action: 'process',
      resource: { type: 'personal_data', attributes: { requiresConsent: true } },
    });

    expect(result.allow).toBe(false);
    expect(result.violations.some((v: any) => v.policyId === 'priv-consent-check')).toBe(true);
  });

  it('should allow processing with valid consent', async () => {
    const result = await opa.evaluate({
      subject: { id: 'user-1' },
      action: 'process',
      resource: { type: 'personal_data', attributes: { requiresConsent: true } },
      context: { consentVerified: true },
    });

    expect(result.allow).toBe(true);
    expect(result.obligations.some((o: any) => o.type === 'log')).toBe(true);
  });

  it('should enforce HIPAA minimum necessary for PHI', async () => {
    const result = await opa.evaluate({
      subject: { id: 'nurse-1' },
      action: 'read',
      resource: {
        type: 'patient_record',
        vertical: 'healthcare',
        attributes: { containsPHI: true },
      },
      context: { treatmentPaymentOperations: false, patientAuthorization: false },
    });

    expect(result.allow).toBe(false);
    expect(result.violations.some((v: any) => v.policyId === 'hc-minimum-necessary')).toBe(true);
  });

  it('should add/remove custom policies', () => {
    const initialCount = opa.getPolicies().length;

    opa.addPolicy({
      id: 'custom-test',
      name: 'Custom Test Policy',
      description: 'Test',
      category: 'custom',
      enabled: true,
      priority: 100,
      complianceFrameworks: [],
      verticals: [],
      evaluator: () => ({ allow: true, violations: [], obligations: [], reasons: ['custom'] }),
    });

    expect(opa.getPolicies().length).toBe(initialCount + 1);
    expect(opa.getPolicy('custom-test')).toBeDefined();

    opa.removePolicy('custom-test');
    expect(opa.getPolicies().length).toBe(initialCount);
  });

  it('should enable/disable policies', () => {
    opa.setPolicyEnabled('ac-data-classification', false);
    const disabled = opa.getPolicy('ac-data-classification');
    expect(disabled.enabled).toBe(false);

    opa.setPolicyEnabled('ac-data-classification', true);
    const enabled = opa.getPolicy('ac-data-classification');
    expect(enabled.enabled).toBe(true);
  });

  it('should filter policies by category', () => {
    const accessPolicies = opa.getPoliciesByCategory('access_control');
    expect(accessPolicies.length).toBeGreaterThanOrEqual(1);
    expect(accessPolicies.every((p: any) => p.category === 'access_control')).toBe(true);
  });

  it('should filter policies by framework', () => {
    const gdprPolicies = opa.getPoliciesByFramework('GDPR');
    expect(gdprPolicies.length).toBeGreaterThanOrEqual(2);
    expect(gdprPolicies.every((p: any) => p.complianceFrameworks.includes('GDPR'))).toBe(true);
  });

  it('should track evaluation stats', () => {
    const stats = opa.getStats();
    expect(stats.enabled).toBe(true);
    expect(stats.mode).toBe('embedded');
    expect(typeof stats.evaluationCount).toBe('number');
    expect(typeof stats.denyCount).toBe('number');
    expect(typeof stats.denyRate).toBe('number');
    expect(typeof stats.averageLatencyMs).toBe('number');
  });

  it('should report healthy in embedded mode', async () => {
    const health = await opa.checkHealth();
    expect(health.enabled).toBe(true);
    expect(health.mode).toBe('embedded');
    expect(health.connected).toBe(true);
    expect(health.policyCount).toBeGreaterThan(0);
  });
});
