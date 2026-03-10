/**
 * Deterministic Utilities Tests
 * @module lib/__tests__/deterministic.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect } from 'vitest';
import {
  deterministicFloat,
  deterministicInt,
  deterministicPercentage,
  deterministicPick,
  deterministicBool,
  deterministicScore,
  deterministicLatency,
} from '../deterministic';

describe('deterministicFloat', () => {
  it('should return a number between 0 and 1', () => {
    const result = deterministicFloat('seed');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(1);
  });

  it('should be deterministic (same input = same output)', () => {
    const a = deterministicFloat('seed', 'factor1');
    const b = deterministicFloat('seed', 'factor1');
    expect(a).toBe(b);
  });

  it('should differ for different seeds', () => {
    const a = deterministicFloat('seed1');
    const b = deterministicFloat('seed2');
    expect(a).not.toBe(b);
  });

  it('should differ for different factors', () => {
    const a = deterministicFloat('seed', 'a');
    const b = deterministicFloat('seed', 'b');
    expect(a).not.toBe(b);
  });
});

describe('deterministicInt', () => {
  it('should return integer within range', () => {
    const result = deterministicInt(1, 10, 'seed');
    expect(Number.isInteger(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(1);
    expect(result).toBeLessThanOrEqual(10);
  });

  it('should be deterministic', () => {
    const a = deterministicInt(0, 100, 'seed', 'x');
    const b = deterministicInt(0, 100, 'seed', 'x');
    expect(a).toBe(b);
  });
});

describe('deterministicPercentage', () => {
  it('should return a number between 0 and 100', () => {
    const result = deterministicPercentage(50, 10, 'seed');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });

  it('should be near base value', () => {
    const result = deterministicPercentage(80, 5, 'seed');
    expect(result).toBeGreaterThanOrEqual(70);
    expect(result).toBeLessThanOrEqual(90);
  });
});

describe('deterministicPick', () => {
  it('should pick an item from array', () => {
    const items = ['a', 'b', 'c', 'd'];
    const result = deterministicPick(items, 'seed');
    expect(items).toContain(result);
  });

  it('should be deterministic', () => {
    const items = [1, 2, 3, 4, 5];
    const a = deterministicPick(items, 'seed', 'x');
    const b = deterministicPick(items, 'seed', 'x');
    expect(a).toBe(b);
  });
});

describe('deterministicBool', () => {
  it('should return boolean', () => {
    expect(typeof deterministicBool(0.5, 'seed')).toBe('boolean');
  });

  it('should return true with probability 1', () => {
    expect(deterministicBool(1, 'seed')).toBe(true);
  });

  it('should return false with probability 0', () => {
    expect(deterministicBool(0, 'seed')).toBe(false);
  });
});

describe('deterministicScore', () => {
  it('should return number between 0 and 100', () => {
    const result = deterministicScore('seed');
    expect(result).toBeGreaterThanOrEqual(0);
    expect(result).toBeLessThanOrEqual(100);
  });
});

describe('deterministicLatency', () => {
  it('should return positive number', () => {
    const result = deterministicLatency(100, 'seed');
    expect(result).toBeGreaterThan(0);
  });

  it('should be at least baseMs', () => {
    const result = deterministicLatency(50, 'seed');
    expect(result).toBeGreaterThanOrEqual(50);
  });
});
