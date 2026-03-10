/**
 * Module — Cross Jurisdiction Engine Service Test
 *
 * Platform module.
 * @module __tests__/services/CrossJurisdictionEngineService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Cross-Jurisdiction Engine Service Tests
 */

import { describe, it, expect } from 'vitest';

const { crossJurisdictionEngineService: service } = await import(
  '../../services/compliance/CrossJurisdictionEngineService.js'
);

describe('CrossJurisdictionEngineService', () => {
  // FAILS IF: service module doesn't export singleton
  it('should export a singleton instance', () => {
    expect(service).toBeDefined();
    expect(typeof service).toBe('object');
  });

  describe('Jurisdiction Support', () => {
    // FAILS IF: getJurisdictionProfiles returns non-array or empty
    it('should return jurisdiction profiles as non-empty array', () => {
      const profiles = service.getJurisdictionProfiles();
      expect(Array.isArray(profiles)).toBe(true);
      expect(profiles.length).toBeGreaterThan(0);
    });

    // FAILS IF: profiles don't have required properties
    it('should have jurisdiction and name for each profile', () => {
      const profiles = service.getJurisdictionProfiles();
      for (const p of profiles) {
        expect(p).toHaveProperty('id');
        expect(p).toHaveProperty('name');
      }
    });
  });

  describe('Conflict Detection', () => {
    // FAILS IF: detectConflicts throws or returns non-array
    it('should detect conflicts between jurisdictions', () => {
      const profiles = service.getJurisdictionProfiles();
      if (profiles.length >= 2) {
        const jurisdictions = profiles.slice(0, 2).map((p: any) => p.jurisdiction);
        const conflicts = service.detectConflicts(jurisdictions);
        expect(Array.isArray(conflicts)).toBe(true);
      }
    });
  });

  describe('Data Residency', () => {
    // FAILS IF: getDataResidencyRules throws or returns non-array
    it('should return data residency rules for jurisdictions', () => {
      const profiles = service.getJurisdictionProfiles();
      if (profiles.length >= 1) {
        const jurisdictions = profiles.slice(0, 1).map((p: any) => p.jurisdiction);
        const rules = service.getDataResidencyRules(jurisdictions);
        expect(Array.isArray(rules)).toBe(true);
      }
    });
  });

  describe('Service Methods', () => {
    // FAILS IF: core methods don't exist
    it('should have assessCrossBorderTransfer method', () => {
      expect(typeof service.assessCrossBorderTransfer).toBe('function');
    });

    it('should have generateComplianceMatrix method', () => {
      expect(typeof service.generateComplianceMatrix).toBe('function');
    });

    it('should have listAssessments method', () => {
      expect(typeof service.listAssessments).toBe('function');
    });

    // FAILS IF: listAssessments returns non-array
    it('should return assessments as array', () => {
      const assessments = service.listAssessments();
      expect(Array.isArray(assessments)).toBe(true);
    });
  });
});
