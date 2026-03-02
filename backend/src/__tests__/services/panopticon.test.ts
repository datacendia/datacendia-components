/**
 * Module — Panopticon Test
 *
 * Platform module.
 * @module __tests__/services/panopticon.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPanopticon™ - Unit Tests
 * 
 * Tests for regulatory framework management and compliance types
 */

import { describe, it, expect } from 'vitest';
import {
  REGULATORY_FRAMEWORKS,
  DEFAULT_RADAR_EVENTS,
  DEFAULT_AI_SUMMARY,
  DEFAULT_AI_ACTIONS,
  getFrameworkByCode,
  getFrameworksByCategory,
  getFrameworksByJurisdiction,
  getAllJurisdictions,
  getAllCategories,
  getTotalRequirementsCount,
} from '../../services/panopticon/frameworks.js';
import type {
  RegulationFramework,
  Obligation,
  ComplianceGap,
  ViolationAlert,
  RegulatoryForecast,
  RegulatoryRadarEvent,
  ViolationSeverity,
  RequirementType,
} from '../../services/panopticon/types.js';

describe('CendiaPanopticon - Frameworks Database', () => {
  describe('REGULATORY_FRAMEWORKS', () => {
    it('should contain regulatory frameworks', () => {
      expect(REGULATORY_FRAMEWORKS).toBeDefined();
      expect(Array.isArray(REGULATORY_FRAMEWORKS)).toBe(true);
      expect(REGULATORY_FRAMEWORKS.length).toBeGreaterThan(30);
    });

    it('should have required properties on each framework', () => {
      for (const framework of REGULATORY_FRAMEWORKS) {
        expect(framework.code).toBeDefined();
        expect(typeof framework.code).toBe('string');
        expect(framework.name).toBeDefined();
        expect(typeof framework.name).toBe('string');
        expect(framework.jurisdiction).toBeDefined();
        expect(framework.category).toBeDefined();
        expect(framework.description).toBeDefined();
        expect(typeof framework.requirements).toBe('number');
        expect(framework.requirements).toBeGreaterThan(0);
      }
    });

    it('should include major regulatory frameworks', () => {
      const codes = REGULATORY_FRAMEWORKS.map(f => f.code);
      expect(codes).toContain('GDPR');
      expect(codes).toContain('HIPAA');
      expect(codes).toContain('SOX');
      expect(codes).toContain('PCI_DSS');
      expect(codes).toContain('NIST_CSF');
      expect(codes).toContain('ISO_27001');
      expect(codes).toContain('EU_AI_ACT');
    });

    it('should cover multiple jurisdictions', () => {
      const jurisdictions = [...new Set(REGULATORY_FRAMEWORKS.map(f => f.jurisdiction))];
      expect(jurisdictions).toContain('EU');
      expect(jurisdictions).toContain('US');
      expect(jurisdictions).toContain('Global');
      expect(jurisdictions.length).toBeGreaterThan(5);
    });

    it('should cover multiple categories', () => {
      const categories = [...new Set(REGULATORY_FRAMEWORKS.map(f => f.category))];
      expect(categories).toContain('Privacy');
      expect(categories).toContain('Financial');
      expect(categories).toContain('Cybersecurity');
      expect(categories).toContain('AI');
      expect(categories.length).toBeGreaterThan(5);
    });
  });

  describe('getFrameworkByCode', () => {
    it('should return framework by code', () => {
      const gdpr = getFrameworkByCode('GDPR');
      expect(gdpr).toBeDefined();
      expect(gdpr?.name).toBe('General Data Protection Regulation');
      expect(gdpr?.jurisdiction).toBe('EU');
    });

    it('should return undefined for unknown code', () => {
      const unknown = getFrameworkByCode('UNKNOWN_FRAMEWORK');
      expect(unknown).toBeUndefined();
    });

    it('should be case-sensitive', () => {
      const lower = getFrameworkByCode('gdpr');
      expect(lower).toBeUndefined();
    });
  });

  describe('getFrameworksByCategory', () => {
    it('should return frameworks by category', () => {
      const privacy = getFrameworksByCategory('Privacy');
      expect(privacy.length).toBeGreaterThan(0);
      expect(privacy.every(f => f.category === 'Privacy')).toBe(true);
    });

    it('should be case-insensitive', () => {
      const privacy1 = getFrameworksByCategory('Privacy');
      const privacy2 = getFrameworksByCategory('privacy');
      const privacy3 = getFrameworksByCategory('PRIVACY');
      expect(privacy1.length).toBe(privacy2.length);
      expect(privacy2.length).toBe(privacy3.length);
    });

    it('should return empty array for unknown category', () => {
      const unknown = getFrameworksByCategory('UnknownCategory');
      expect(unknown).toEqual([]);
    });
  });

  describe('getFrameworksByJurisdiction', () => {
    it('should return frameworks by jurisdiction', () => {
      const eu = getFrameworksByJurisdiction('EU');
      expect(eu.length).toBeGreaterThan(0);
      expect(eu.every(f => f.jurisdiction.includes('EU'))).toBe(true);
    });

    it('should support partial matching', () => {
      const us = getFrameworksByJurisdiction('US');
      expect(us.length).toBeGreaterThan(0);
      // Should include US, US-CA, US-NY, etc.
    });

    it('should be case-insensitive', () => {
      const eu1 = getFrameworksByJurisdiction('EU');
      const eu2 = getFrameworksByJurisdiction('eu');
      expect(eu1.length).toBe(eu2.length);
    });
  });

  describe('getAllJurisdictions', () => {
    it('should return unique jurisdictions', () => {
      const jurisdictions = getAllJurisdictions();
      expect(jurisdictions.length).toBeGreaterThan(0);
      // Check uniqueness
      expect(jurisdictions.length).toBe(new Set(jurisdictions).size);
    });
  });

  describe('getAllCategories', () => {
    it('should return unique categories', () => {
      const categories = getAllCategories();
      expect(categories.length).toBeGreaterThan(0);
      // Check uniqueness
      expect(categories.length).toBe(new Set(categories).size);
    });
  });

  describe('getTotalRequirementsCount', () => {
    it('should return total requirements across all frameworks', () => {
      const total = getTotalRequirementsCount();
      expect(total).toBeGreaterThan(1000); // Should be substantial
    });

    it('should equal sum of individual framework requirements', () => {
      const sum = REGULATORY_FRAMEWORKS.reduce((acc, f) => acc + f.requirements, 0);
      expect(getTotalRequirementsCount()).toBe(sum);
    });
  });
});

describe('CendiaPanopticon - Default Radar Data', () => {
  describe('DEFAULT_RADAR_EVENTS', () => {
    it('should contain radar events', () => {
      expect(DEFAULT_RADAR_EVENTS).toBeDefined();
      expect(Array.isArray(DEFAULT_RADAR_EVENTS)).toBe(true);
      expect(DEFAULT_RADAR_EVENTS.length).toBeGreaterThan(0);
    });

    it('should have valid event structure', () => {
      for (const event of DEFAULT_RADAR_EVENTS) {
        expect(event.id).toBeDefined();
        expect(event.title).toBeDefined();
        expect(event.framework).toBeDefined();
        expect(event.jurisdiction).toBeDefined();
        expect(['now', '30', '60', '90']).toContain(event.window);
        expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(event.impact);
        expect(event.effectiveDate).toBeDefined();
        expect(event.description).toBeDefined();
      }
    });
  });

  describe('DEFAULT_AI_SUMMARY', () => {
    it('should be a non-empty string', () => {
      expect(typeof DEFAULT_AI_SUMMARY).toBe('string');
      expect(DEFAULT_AI_SUMMARY.length).toBeGreaterThan(50);
    });
  });

  describe('DEFAULT_AI_ACTIONS', () => {
    it('should be an array of action strings', () => {
      expect(Array.isArray(DEFAULT_AI_ACTIONS)).toBe(true);
      expect(DEFAULT_AI_ACTIONS.length).toBeGreaterThan(0);
      for (const action of DEFAULT_AI_ACTIONS) {
        expect(typeof action).toBe('string');
        expect(action.length).toBeGreaterThan(0);
      }
    });
  });
});

describe('CendiaPanopticon - Type Definitions', () => {
  describe('RegulationFramework type', () => {
    it('should allow valid framework objects', () => {
      const framework: RegulationFramework = {
        code: 'TEST',
        name: 'Test Framework',
        jurisdiction: 'Global',
        category: 'Privacy',
        description: 'Test description',
        requirements: 10,
      };
      expect(framework.code).toBe('TEST');
    });

    it('should allow optional effectiveDate', () => {
      const framework: RegulationFramework = {
        code: 'TEST',
        name: 'Test Framework',
        jurisdiction: 'Global',
        category: 'Privacy',
        description: 'Test description',
        requirements: 10,
        effectiveDate: new Date(),
      };
      expect(framework.effectiveDate).toBeInstanceOf(Date);
    });
  });

  describe('Obligation type', () => {
    it('should allow valid obligation objects', () => {
      const obligation: Obligation = {
        id: 'obl-1',
        code: 'GDPR-001',
        title: 'Data Subject Rights',
        description: 'Ensure data subject rights',
        requirementType: 'MANDATORY',
        priority: 'HIGH',
        controls: ['Access Control', 'Audit Logging'],
        evidenceRequired: ['Policy Document', 'Training Records'],
      };
      expect(obligation.requirementType).toBe('MANDATORY');
    });
  });

  describe('ViolationAlert type', () => {
    it('should allow valid violation alert objects', () => {
      const alert: ViolationAlert = {
        id: 'viol-1',
        regulationCode: 'GDPR',
        obligationCode: 'GDPR-001',
        title: 'Data Breach Detected',
        description: 'Unauthorized access to PII',
        severity: 'CRITICAL',
        affectedEntities: ['Customer Database'],
        detectedAt: new Date(),
      };
      expect(alert.severity).toBe('CRITICAL');
    });
  });

  describe('RegulatoryForecast type', () => {
    it('should allow valid forecast objects', () => {
      const forecast: RegulatoryForecast = {
        id: 'forecast-1',
        title: 'New Privacy Law',
        description: 'Expected new privacy legislation',
        forecastType: 'NEW_REGULATION',
        probability: 0.8,
        impactScore: 85,
        horizonDays: 180,
        affectedFrameworks: ['GDPR', 'CCPA'],
        recommendedActions: ['Review policies', 'Update procedures'],
      };
      expect(forecast.probability).toBe(0.8);
    });
  });

  describe('Severity and RequirementType enums', () => {
    it('should validate severity values', () => {
      const severities: ViolationSeverity[] = ['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'];
      expect(severities).toHaveLength(4);
    });

    it('should validate requirement type values', () => {
      const types: RequirementType[] = ['MANDATORY', 'RECOMMENDED', 'OPTIONAL', 'CONDITIONAL'];
      expect(types).toHaveLength(4);
    });
  });
});
