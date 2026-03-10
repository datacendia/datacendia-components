/**
 * Module — Carbon Aware Scheduler Service Test
 *
 * Platform module.
 * @module __tests__/services/CarbonAwareSchedulerService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Carbon-Aware Scheduler Service Tests
 */

import { describe, it, expect } from 'vitest';

const { carbonAwareSchedulerService: service } = await import(
  '../../services/scheduling/CarbonAwareSchedulerService.js'
);

describe('CarbonAwareSchedulerService', () => {
  // FAILS IF: service module doesn't export singleton
  it('should export a singleton instance', () => {
    expect(service).toBeDefined();
    expect(typeof service).toBe('object');
  });

  describe('Carbon Intensity', () => {
    // FAILS IF: getCarbonIntensity throws or returns wrong shape
    it('should return carbon intensity for a region', async () => {
      const intensity = await service.getCarbonIntensity('us-east-1');
      expect(intensity).toBeDefined();
      expect(typeof intensity).toBe('object');
    });

    // FAILS IF: getAllRegionIntensities throws or returns non-array
    it('should return all region intensities as array', async () => {
      const intensities = await service.getAllRegionIntensities();
      expect(Array.isArray(intensities)).toBe(true);
      expect(intensities.length).toBeGreaterThan(0);
    });
  });

  describe('Workload Management', () => {
    // FAILS IF: listWorkloads throws or returns non-array
    it('should list workloads as array', () => {
      const workloads = service.listWorkloads();
      expect(Array.isArray(workloads)).toBe(true);
    });

    // FAILS IF: submitWorkload throws or doesn't return object with id
    it('should submit a workload', async () => {
      const workload = await service.submitWorkload({
        name: 'Test ML Training',
        type: 'training',
        priority: 'deferrable',
        estimatedDurationMinutes: 60,
        estimatedCarbonGrams: 500,
        organizationId: 'org-1',
      } as any);
      expect(workload).toBeDefined();
      expect(workload).toHaveProperty('id');
      expect(typeof workload.id).toBe('string');
    });
  });

  describe('Carbon Budget', () => {
    // FAILS IF: getCarbonBudget throws or returns wrong shape
    it('should return carbon budget for organization', async () => {
      const budget = await service.getCarbonBudget('org-1');
      expect(budget).toBeDefined();
      expect(budget).toHaveProperty('organizationId', 'org-1');
    });

    // FAILS IF: updateBudget throws or doesn't update usedKgCO2
    it('should update carbon budget usage', async () => {
      // Must initialize budget first
      await service.getCarbonBudget('org-1');
      const updated = service.updateBudget('org-1', 1000); // 1000g = 1kg
      expect(updated).toBeDefined();
      expect(typeof updated.usedKgCO2).toBe('number');
      expect(updated.usedKgCO2).toBeGreaterThan(0);
    });
  });

  describe('Service Methods', () => {
    // FAILS IF: core methods don't exist
    it('should have scheduleWorkload method', () => {
      expect(typeof service.scheduleWorkload).toBe('function');
    });

    it('should have executeWorkload method', () => {
      expect(typeof service.executeWorkload).toBe('function');
    });

    it('should have generateReport method', () => {
      expect(typeof service.generateReport).toBe('function');
    });
  });
});
