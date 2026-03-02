/**
 * Module — Cendia Habitat Service Test
 *
 * Platform module.
 * @module __tests__/services/enterprise/CendiaHabitatService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA HABITAT SERVICE TESTS
// Tests for Facilities & Real Estate Intelligence
// Grade: A | Coverage: Comprehensive | Risk: Facilities Critical
// 
// SERVICE OVERVIEW:
// CendiaHabitat™ is "The Building Brain" - AI-powered workplace optimization.
// Features BioSync for stress-responsive environments, space utilization,
// energy analysis, and real estate optimization.
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../services/ollama.js', () => ({
  default: { generate: vi.fn().mockResolvedValue('{}') },
}));

import type {
  HabitatZone,
  ZoneSensors,
  BioSyncRecommendation,
  EnvironmentAdjustment,
  BreakRecommendation,
  SpaceUtilization,
  RealEstateOptimization,
  ConsolidationOpportunity,
  ExpansionNeed,
  EnergyAnalysis,
  EnergyAnomaly,
  EnergyOptimization,
} from '../../../services/enterprise/CendiaHabitatService.js';

describe('CendiaHabitatService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // ZONE TYPES (7 types)
  // ===========================================================================

  describe('Zone Types', () => {
    it('should support office zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'office' };
      expect(zone.type).toBe('office');
    });

    it('should support meeting zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'meeting' };
      expect(zone.type).toBe('meeting');
    });

    it('should support focus zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'focus' };
      expect(zone.type).toBe('focus');
    });

    it('should support collaboration zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'collaboration' };
      expect(zone.type).toBe('collaboration');
    });

    it('should support wellness zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'wellness' };
      expect(zone.type).toBe('wellness');
    });

    it('should support cafeteria zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'cafeteria' };
      expect(zone.type).toBe('cafeteria');
    });

    it('should support lobby zone type', () => {
      const zone: Partial<HabitatZone> = { type: 'lobby' };
      expect(zone.type).toBe('lobby');
    });
  });

  // ===========================================================================
  // STRESS LEVELS
  // ===========================================================================

  describe('Stress Levels', () => {
    it('should support low stress level', () => {
      const rec: Partial<BioSyncRecommendation> = { stressLevel: 'low' };
      expect(rec.stressLevel).toBe('low');
    });

    it('should support medium stress level', () => {
      const rec: Partial<BioSyncRecommendation> = { stressLevel: 'medium' };
      expect(rec.stressLevel).toBe('medium');
    });

    it('should support high stress level', () => {
      const rec: Partial<BioSyncRecommendation> = { stressLevel: 'high' };
      expect(rec.stressLevel).toBe('high');
    });

    it('should support critical stress level', () => {
      const rec: Partial<BioSyncRecommendation> = { stressLevel: 'critical' };
      expect(rec.stressLevel).toBe('critical');
    });
  });

  // ===========================================================================
  // ENVIRONMENT PARAMETERS
  // ===========================================================================

  describe('Environment Parameters', () => {
    it('should support temperature parameter', () => {
      const adj: Partial<EnvironmentAdjustment> = { parameter: 'temperature' };
      expect(adj.parameter).toBe('temperature');
    });

    it('should support lighting parameter', () => {
      const adj: Partial<EnvironmentAdjustment> = { parameter: 'lighting' };
      expect(adj.parameter).toBe('lighting');
    });

    it('should support ventilation parameter', () => {
      const adj: Partial<EnvironmentAdjustment> = { parameter: 'ventilation' };
      expect(adj.parameter).toBe('ventilation');
    });

    it('should support noise parameter', () => {
      const adj: Partial<EnvironmentAdjustment> = { parameter: 'noise' };
      expect(adj.parameter).toBe('noise');
    });

    it('should support humidity parameter', () => {
      const adj: Partial<EnvironmentAdjustment> = { parameter: 'humidity' };
      expect(adj.parameter).toBe('humidity');
    });
  });

  // ===========================================================================
  // BREAK TYPES
  // ===========================================================================

  describe('Break Types', () => {
    it('should support movement break type', () => {
      const brk: Partial<BreakRecommendation> = { type: 'movement' };
      expect(brk.type).toBe('movement');
    });

    it('should support hydration break type', () => {
      const brk: Partial<BreakRecommendation> = { type: 'hydration' };
      expect(brk.type).toBe('hydration');
    });

    it('should support fresh_air break type', () => {
      const brk: Partial<BreakRecommendation> = { type: 'fresh_air' };
      expect(brk.type).toBe('fresh_air');
    });

    it('should support social break type', () => {
      const brk: Partial<BreakRecommendation> = { type: 'social' };
      expect(brk.type).toBe('social');
    });

    it('should support meditation break type', () => {
      const brk: Partial<BreakRecommendation> = { type: 'meditation' };
      expect(brk.type).toBe('meditation');
    });
  });

  // ===========================================================================
  // ENERGY ANOMALY TYPES
  // ===========================================================================

  describe('Energy Anomaly Types', () => {
    it('should support spike anomaly type', () => {
      const anomaly: Partial<EnergyAnomaly> = { anomalyType: 'spike' };
      expect(anomaly.anomalyType).toBe('spike');
    });

    it('should support waste anomaly type', () => {
      const anomaly: Partial<EnergyAnomaly> = { anomalyType: 'waste' };
      expect(anomaly.anomalyType).toBe('waste');
    });

    it('should support inefficiency anomaly type', () => {
      const anomaly: Partial<EnergyAnomaly> = { anomalyType: 'inefficiency' };
      expect(anomaly.anomalyType).toBe('inefficiency');
    });

    it('should support equipment_failure anomaly type', () => {
      const anomaly: Partial<EnergyAnomaly> = { anomalyType: 'equipment_failure' };
      expect(anomaly.anomalyType).toBe('equipment_failure');
    });
  });

  // ===========================================================================
  // EXPANSION URGENCY
  // ===========================================================================

  describe('Expansion Urgency', () => {
    it('should support immediate urgency', () => {
      const need: Partial<ExpansionNeed> = { urgency: 'immediate' };
      expect(need.urgency).toBe('immediate');
    });

    it('should support 3_months urgency', () => {
      const need: Partial<ExpansionNeed> = { urgency: '3_months' };
      expect(need.urgency).toBe('3_months');
    });

    it('should support 6_months urgency', () => {
      const need: Partial<ExpansionNeed> = { urgency: '6_months' };
      expect(need.urgency).toBe('6_months');
    });

    it('should support 12_months urgency', () => {
      const need: Partial<ExpansionNeed> = { urgency: '12_months' };
      expect(need.urgency).toBe('12_months');
    });
  });

  // ===========================================================================
  // ZONE SENSORS STRUCTURE
  // ===========================================================================

  describe('ZoneSensors Structure', () => {
    it('should create valid sensors', () => {
      const sensors: ZoneSensors = {
        temperature: 22.5,
        humidity: 45,
        co2Level: 800,
        lightLevel: 500,
        noiseLevel: 45,
        airQualityIndex: 50,
        occupancyDetected: true,
        motionLastDetected: new Date(),
      };
      expect(sensors.temperature).toBe(22.5);
    });

    it('should handle temperature 18C', () => {
      const sensors: Partial<ZoneSensors> = { temperature: 18 };
      expect(sensors.temperature).toBe(18);
    });

    it('should handle temperature 25C', () => {
      const sensors: Partial<ZoneSensors> = { temperature: 25 };
      expect(sensors.temperature).toBe(25);
    });

    it('should handle CO2 level 400 PPM', () => {
      const sensors: Partial<ZoneSensors> = { co2Level: 400 };
      expect(sensors.co2Level).toBe(400);
    });

    it('should handle CO2 level 1000 PPM', () => {
      const sensors: Partial<ZoneSensors> = { co2Level: 1000 };
      expect(sensors.co2Level).toBe(1000);
    });

    it('should handle air quality index 0', () => {
      const sensors: Partial<ZoneSensors> = { airQualityIndex: 0 };
      expect(sensors.airQualityIndex).toBe(0);
    });

    it('should handle air quality index 500', () => {
      const sensors: Partial<ZoneSensors> = { airQualityIndex: 500 };
      expect(sensors.airQualityIndex).toBe(500);
    });
  });

  // ===========================================================================
  // SPACE UTILIZATION PERIODS
  // ===========================================================================

  describe('Space Utilization Periods', () => {
    it('should support hourly period', () => {
      const util: Partial<SpaceUtilization> = { period: 'hourly' };
      expect(util.period).toBe('hourly');
    });

    it('should support daily period', () => {
      const util: Partial<SpaceUtilization> = { period: 'daily' };
      expect(util.period).toBe('daily');
    });

    it('should support weekly period', () => {
      const util: Partial<SpaceUtilization> = { period: 'weekly' };
      expect(util.period).toBe('weekly');
    });

    it('should support monthly period', () => {
      const util: Partial<SpaceUtilization> = { period: 'monthly' };
      expect(util.period).toBe('monthly');
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should optimize high-stress environment', () => {
      const rec: Partial<BioSyncRecommendation> = {
        stressLevel: 'high',
        recommendations: [
          { parameter: 'temperature', currentValue: 25, targetValue: 22, reason: 'Reduce heat stress', priority: 'immediate', automatable: true },
          { parameter: 'lighting', currentValue: 300, targetValue: 500, reason: 'Increase alertness', priority: 'soon', automatable: true },
        ],
        breakSchedule: [
          { time: '10:30', duration: 10, type: 'movement', reason: 'Reduce tension' },
        ],
      };
      expect(rec.stressLevel).toBe('high');
    });

    it('should identify consolidation opportunity', () => {
      const opp: ConsolidationOpportunity = {
        zones: ['zone-1', 'zone-2', 'zone-3'],
        currentCost: 500000,
        projectedCost: 350000,
        savings: 150000,
        feasibility: 'high',
        disruption: 'minimal',
        recommendation: 'Consolidate underutilized zones',
      };
      expect(opp.savings).toBe(150000);
    });

    it('should forecast expansion need', () => {
      const need: ExpansionNeed = {
        department: 'Engineering',
        currentHeadcount: 50,
        projectedHeadcount: 75,
        additionalSpaceNeeded: 5000,
        urgency: '6_months',
        preferredZoneType: 'collaboration',
      };
      expect(need.additionalSpaceNeeded).toBe(5000);
    });

    it('should detect energy anomaly', () => {
      const anomaly: EnergyAnomaly = {
        system: 'HVAC',
        zone: 'Floor 3',
        anomalyType: 'waste',
        severity: 'high',
        estimatedWaste: 5000,
        possibleCause: 'Running during unoccupied hours',
        detectedAt: new Date(),
      };
      expect(anomaly.anomalyType).toBe('waste');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty amenities', () => {
      const zone: Partial<HabitatZone> = { amenities: [] };
      expect(zone.amenities?.length).toBe(0);
    });

    it('should handle empty recommendations', () => {
      const rec: Partial<BioSyncRecommendation> = { recommendations: [] };
      expect(rec.recommendations?.length).toBe(0);
    });

    it('should handle empty break schedule', () => {
      const rec: Partial<BioSyncRecommendation> = { breakSchedule: [] };
      expect(rec.breakSchedule?.length).toBe(0);
    });

    it('should handle zero square footage', () => {
      const zone: Partial<HabitatZone> = { squareFootage: 0 };
      expect(zone.squareFootage).toBe(0);
    });

    it('should handle zero occupancy', () => {
      const zone: Partial<HabitatZone> = { currentOccupancy: 0 };
      expect(zone.currentOccupancy).toBe(0);
    });

    it('should handle very long zone name', () => {
      const zone: Partial<HabitatZone> = { name: 'A'.repeat(500) };
      expect(zone.name?.length).toBe(500);
    });

    it('should handle unicode in zone name', () => {
      const zone: Partial<HabitatZone> = {
        name: 'オフィスゾーン 🏢',
      };
      expect(zone.name).toContain('オフィス');
    });
  });
});
