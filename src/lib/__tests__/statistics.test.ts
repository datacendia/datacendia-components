/**
 * Statistics Algorithm Tests
 * @module lib/__tests__/statistics.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import {
  mean,
  weightedMean,
  median,
  variancePopulation,
  varianceSample,
  stdDevPopulation,
  stdDevSample,
  percentile,
} from '../algorithms/statistics';

describe('mean', () => {
  it('should return 0 for empty array', () => {
    expect(mean([])).toBe(0);
  });

  it('should calculate mean of numbers', () => {
    expect(mean([1, 2, 3, 4, 5])).toBe(3);
  });

  it('should handle single element', () => {
    expect(mean([42])).toBe(42);
  });

  it('should handle negative numbers', () => {
    expect(mean([-5, 5])).toBe(0);
  });
});

describe('weightedMean', () => {
  it('should return 0 for empty arrays', () => {
    expect(weightedMean([], [])).toBe(0);
  });

  it('should calculate weighted mean', () => {
    expect(weightedMean([10, 20], [1, 1])).toBe(15);
    expect(weightedMean([10, 20], [1, 3])).toBe(17.5);
  });

  it('should throw for mismatched lengths', () => {
    expect(() => weightedMean([1, 2], [1])).toThrow('Values and weights must have the same length');
  });

  it('should return 0 for zero total weight', () => {
    expect(weightedMean([10, 20], [0, 0])).toBe(0);
  });
});

describe('median', () => {
  it('should return 0 for empty array', () => {
    expect(median([])).toBe(0);
  });

  it('should return middle value for odd length', () => {
    expect(median([1, 3, 5])).toBe(3);
  });

  it('should return average of two middle values for even length', () => {
    expect(median([1, 2, 3, 4])).toBe(2.5);
  });

  it('should handle unsorted input', () => {
    expect(median([5, 1, 3])).toBe(3);
  });

  it('should handle single element', () => {
    expect(median([7])).toBe(7);
  });
});

describe('variancePopulation', () => {
  it('should return 0 for empty array', () => {
    expect(variancePopulation([])).toBe(0);
  });

  it('should return 0 for identical values', () => {
    expect(variancePopulation([5, 5, 5])).toBe(0);
  });

  it('should calculate population variance', () => {
    const result = variancePopulation([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(result).toBeCloseTo(4, 1);
  });
});

describe('varianceSample', () => {
  it('should return 0 for arrays with < 2 elements', () => {
    expect(varianceSample([])).toBe(0);
    expect(varianceSample([1])).toBe(0);
  });

  it('should use Bessel correction (N-1)', () => {
    const pop = variancePopulation([2, 4, 4, 4, 5, 5, 7, 9]);
    const samp = varianceSample([2, 4, 4, 4, 5, 5, 7, 9]);
    expect(samp).toBeGreaterThan(pop);
  });
});

describe('stdDevPopulation', () => {
  it('should return 0 for empty array', () => {
    expect(stdDevPopulation([])).toBe(0);
  });

  it('should be sqrt of variance', () => {
    const vals = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(stdDevPopulation(vals)).toBeCloseTo(Math.sqrt(variancePopulation(vals)), 10);
  });
});

describe('stdDevSample', () => {
  it('should return 0 for < 2 elements', () => {
    expect(stdDevSample([])).toBe(0);
    expect(stdDevSample([1])).toBe(0);
  });

  it('should be sqrt of sample variance', () => {
    const vals = [2, 4, 4, 4, 5, 5, 7, 9];
    expect(stdDevSample(vals)).toBeCloseTo(Math.sqrt(varianceSample(vals)), 10);
  });
});

describe('percentile', () => {
  it('should return 0 for empty array', () => {
    expect(percentile([], 50)).toBe(0);
  });

  it('should return min for 0th percentile', () => {
    expect(percentile([1, 2, 3, 4, 5], 0)).toBe(1);
  });

  it('should return max for 100th percentile', () => {
    expect(percentile([1, 2, 3, 4, 5], 100)).toBe(5);
  });

  it('should return median for 50th percentile', () => {
    const values = [1, 2, 3, 4, 5];
    expect(percentile(values, 50)).toBe(median(values));
  });
});
