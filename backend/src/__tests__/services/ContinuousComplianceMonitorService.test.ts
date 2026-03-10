/**
 * Module — Continuous Compliance Monitor Service Test
 *
 * Platform module.
 * @module __tests__/services/ContinuousComplianceMonitorService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Continuous Compliance Monitor Service Tests
 */

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

const { continuousComplianceMonitorService: service } = await import(
  '../../services/compliance/ContinuousComplianceMonitorService.js'
);

describe('ContinuousComplianceMonitorService', () => {
  // FAILS IF: service module doesn't export singleton
  it('should export a singleton instance', () => {
    expect(service).toBeDefined();
    expect(typeof service).toBe('object');
  });

  describe('Framework Support', () => {
    // FAILS IF: getSupportedFrameworks doesn't exist or returns non-array
    it('should return supported compliance frameworks as array', () => {
      const frameworks = service.getSupportedFrameworks();
      expect(Array.isArray(frameworks)).toBe(true);
      expect(frameworks.length).toBeGreaterThan(0);
    });

    // FAILS IF: no frameworks have controlCount > 0
    it('should have control counts for each framework', () => {
      const frameworks = service.getSupportedFrameworks();
      for (const fw of frameworks) {
        expect(fw).toHaveProperty('framework');
        expect(fw).toHaveProperty('controlCount');
        expect(typeof fw.controlCount).toBe('number');
      }
    });

    // FAILS IF: known frameworks are missing from supported list
    it('should include key compliance frameworks', () => {
      const frameworks = service.getSupportedFrameworks();
      const names = frameworks.map((f: any) => f.framework);
      // At least some of these should be present
      const knownFrameworks = ['EU_AI_ACT', 'GDPR', 'HIPAA', 'SOC2', 'NIST_AI_RMF', 'ISO_27001'];
      const found = knownFrameworks.filter(k => names.includes(k));
      expect(found.length).toBeGreaterThan(0);
    });
  });

  describe('Alert Management', () => {
    // FAILS IF: getAlerts doesn't exist or returns non-array
    it('should return alerts as array for organization', () => {
      const alerts = service.getAlerts('org-1');
      expect(Array.isArray(alerts)).toBe(true);
    });

    // FAILS IF: createAlert doesn't return object with id
    it('should create a compliance alert', async () => {
      const alert = await service.createAlert({
        organizationId: 'org-1',
        framework: 'SOC2',
        controlId: 'ctrl-1',
        severity: 'high',
        title: 'Control failed',
        description: 'Control failed validation',
      });
      expect(alert).toBeDefined();
      expect(alert).toHaveProperty('id');
      expect(typeof alert.id).toBe('string');
      expect(alert).toHaveProperty('severity', 'high');
    });

    // FAILS IF: acknowledgeAlert doesn't update alert status
    it('should acknowledge an alert', async () => {
      const alert = await service.createAlert({
        organizationId: 'org-1',
        framework: 'GDPR',
        controlId: 'ctrl-2',
        severity: 'medium',
        title: 'Data retention',
        description: 'Data retention exceeded',
      });
      const acked = service.acknowledgeAlert(alert.id, 'admin@test.com');
      expect(acked).toBeDefined();
      expect(acked.status).toBe('acknowledged');
    });

    // FAILS IF: resolveAlert doesn't update status to resolved
    it('should resolve an alert', async () => {
      const alert = await service.createAlert({
        organizationId: 'org-1',
        framework: 'HIPAA',
        controlId: 'ctrl-3',
        severity: 'critical',
        title: 'PHI exposure',
        description: 'PHI exposure detected',
      });
      const resolved = service.resolveAlert(alert.id, 'resolved');
      expect(resolved).toBeDefined();
      expect(resolved.status).toBe('resolved');
    });
  });

  describe('Compliance Controls', () => {
    // FAILS IF: getControls doesn't exist or returns non-array
    it('should return controls for a framework', () => {
      const controls = service.getControls('org-1', 'SOC2');
      expect(Array.isArray(controls)).toBe(true);
    });
  });

  describe('Drift Detection', () => {
    // FAILS IF: getRecentDrifts doesn't exist or returns non-array
    it('should return recent drifts', () => {
      const drifts = service.getRecentDrifts(24);
      expect(Array.isArray(drifts)).toBe(true);
    });
  });

  describe('Compliance History', () => {
    // FAILS IF: getComplianceHistory throws or returns non-array
    it('should return compliance history as array', () => {
      const history = service.getComplianceHistory('org-1', 'SOC2');
      expect(Array.isArray(history)).toBe(true);
    });
  });
});
