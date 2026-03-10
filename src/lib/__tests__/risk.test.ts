/**
 * Risk Algorithm Tests
 * @module lib/__tests__/risk.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import { riskWeightedExposure, expectedLoss } from '../algorithms/risk';

describe('riskWeightedExposure', () => {
  it('should return 0 for empty factors', () => {
    expect(riskWeightedExposure([])).toBe(0);
  });

  it('should calculate simple RWE', () => {
    const factors = [
      { probability: 0.5, impact: 1000 },
      { probability: 0.2, impact: 5000 },
    ];
    expect(riskWeightedExposure(factors)).toBe(1500);
  });

  it('should account for mitigation', () => {
    const factors = [
      { probability: 1.0, impact: 1000, mitigation: 0.5 },
    ];
    expect(riskWeightedExposure(factors)).toBe(500);
  });

  it('should handle full mitigation', () => {
    const factors = [
      { probability: 1.0, impact: 1000, mitigation: 1.0 },
    ];
    expect(riskWeightedExposure(factors)).toBe(0);
  });

  it('should handle zero probability', () => {
    const factors = [
      { probability: 0, impact: 1000000 },
    ];
    expect(riskWeightedExposure(factors)).toBe(0);
  });
});

describe('expectedLoss', () => {
  it('should calculate EL = PD x LGD x EAD', () => {
    expect(expectedLoss(0.1, 0.5, 100000)).toBe(5000);
  });

  it('should return 0 with zero probability', () => {
    expect(expectedLoss(0, 0.5, 100000)).toBe(0);
  });

  it('should return 0 with zero exposure', () => {
    expect(expectedLoss(0.5, 0.5, 0)).toBe(0);
  });

  it('should handle full default', () => {
    expect(expectedLoss(1.0, 1.0, 50000)).toBe(50000);
  });
});
