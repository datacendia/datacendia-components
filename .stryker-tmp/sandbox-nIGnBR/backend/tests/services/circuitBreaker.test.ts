/**
 * Circuit Breaker Unit Tests
 * 
 * These tests verify the circuit breaker implementation works correctly.
 * Run with: npm test
 */
// @ts-nocheck


import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCircuitBreaker, getAllCircuitBreakerStats } from '../../src/utils/circuitBreaker';

describe('CircuitBreaker', () => {
  beforeEach(() => {
    // Reset all circuit breakers before each test
    // Note: In production, you might want a resetAll() method
  });

  describe('Normal Operation (CLOSED state)', () => {
    it('should execute function successfully when circuit is closed', async () => {
      const breaker = getCircuitBreaker('test-closed');
      const mockFn = vi.fn().mockResolvedValue('success');

      const result = await breaker.execute(mockFn);

      expect(result).toBe('success');
      expect(mockFn).toHaveBeenCalledOnce();
      expect(breaker.getStats().state).toBe('CLOSED');
    });

    it('should track successful calls', async () => {
      const breaker = getCircuitBreaker('test-track');
      const mockFn = vi.fn().mockResolvedValue('ok');

      await breaker.execute(mockFn);
      await breaker.execute(mockFn);
      await breaker.execute(mockFn);

      const stats = breaker.getStats();
      expect(stats.totalCalls).toBe(3);
      expect(stats.totalFailures).toBe(0);
      expect(stats.lastSuccess).not.toBeNull();
    });
  });

  describe('Failure Handling', () => {
    it('should track failures without opening circuit below threshold', async () => {
      const breaker = getCircuitBreaker('test-failures', { failureThreshold: 3 });
      const mockFn = vi.fn().mockRejectedValue(new Error('fail'));

      // First two failures should keep circuit closed
      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');
      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');

      expect(breaker.getStats().state).toBe('CLOSED');
      expect(breaker.getStats().failures).toBe(2);
    });

    it('should open circuit after reaching failure threshold', async () => {
      const breaker = getCircuitBreaker('test-open', { failureThreshold: 2 });
      const mockFn = vi.fn().mockRejectedValue(new Error('fail'));

      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');
      await expect(breaker.execute(mockFn)).rejects.toThrow('fail');

      expect(breaker.getStats().state).toBe('OPEN');
    });

    it('should reset failure count on success', async () => {
      const breaker = getCircuitBreaker('test-reset', { failureThreshold: 3 });
      const failFn = vi.fn().mockRejectedValue(new Error('fail'));
      const successFn = vi.fn().mockResolvedValue('ok');

      await expect(breaker.execute(failFn)).rejects.toThrow();
      await expect(breaker.execute(failFn)).rejects.toThrow();
      await breaker.execute(successFn);

      expect(breaker.getStats().failures).toBe(0);
      expect(breaker.getStats().state).toBe('CLOSED');
    });
  });

  describe('Open State Behavior', () => {
    it('should use fallback when circuit is open', async () => {
      const breaker = getCircuitBreaker('test-fallback', { 
        failureThreshold: 1,
        resetTimeout: 60000, // Long timeout
      });
      
      const failFn = vi.fn().mockRejectedValue(new Error('fail'));
      const fallback = vi.fn().mockReturnValue('fallback-result');

      // Trip the circuit
      await breaker.execute(failFn, fallback);
      
      // Next call should use fallback
      const result = await breaker.execute(failFn, fallback);
      
      expect(result).toBe('fallback-result');
    });

    it('should throw error when open and no fallback provided', async () => {
      const breaker = getCircuitBreaker('test-no-fallback', {
        failureThreshold: 1,
        resetTimeout: 60000,
      });
      
      const failFn = vi.fn().mockRejectedValue(new Error('fail'));

      // Trip the circuit (this will throw because fallback not provided)
      await expect(breaker.execute(failFn)).rejects.toThrow();
      
      // Second call should also throw (circuit is open)
      await expect(breaker.execute(failFn)).rejects.toThrow();
    });
  });

  describe('Half-Open State (Recovery)', () => {
    it('should transition to half-open after reset timeout', async () => {
      const breaker = getCircuitBreaker('test-half-open', {
        failureThreshold: 1,
        resetTimeout: 100, // Short timeout for testing
        halfOpenMaxAttempts: 1,
      });
      
      const failFn = vi.fn().mockRejectedValue(new Error('fail'));
      const successFn = vi.fn().mockResolvedValue('recovered');

      // Trip the circuit
      await breaker.execute(failFn, () => 'fallback');
      expect(breaker.getStats().state).toBe('OPEN');

      // Wait for reset timeout
      await new Promise(resolve => setTimeout(resolve, 150));

      // Next call should attempt (half-open)
      const result = await breaker.execute(successFn);
      expect(result).toBe('recovered');
      expect(breaker.getStats().state).toBe('CLOSED');
    });
  });

  describe('Manual Controls', () => {
    it('should allow manual reset', async () => {
      const breaker = getCircuitBreaker('test-manual-reset', { failureThreshold: 1 });
      const failFn = vi.fn().mockRejectedValue(new Error('fail'));

      await breaker.execute(failFn, () => 'fallback');
      expect(breaker.getStats().state).toBe('OPEN');

      breaker.reset();
      expect(breaker.getStats().state).toBe('CLOSED');
      expect(breaker.getStats().failures).toBe(0);
    });

    it('should allow manual trip', () => {
      const breaker = getCircuitBreaker('test-manual-trip');
      expect(breaker.getStats().state).toBe('CLOSED');

      breaker.trip();
      expect(breaker.getStats().state).toBe('OPEN');
    });
  });

  describe('Stats Aggregation', () => {
    it('should return stats for all breakers', async () => {
      const breaker1 = getCircuitBreaker('stats-test-1');
      const breaker2 = getCircuitBreaker('stats-test-2');

      await breaker1.execute(() => Promise.resolve('ok'));
      await breaker2.execute(() => Promise.resolve('ok'));

      const allStats = getAllCircuitBreakerStats();

      expect(allStats['stats-test-1']).toBeDefined();
      expect(allStats['stats-test-2']).toBeDefined();
    });
  });
});

describe('Circuit Breaker - Integration Scenarios', () => {
  describe('Neo4j Circuit Breaker', () => {
    it('should use default config for neo4j', () => {
      const breaker = getCircuitBreaker('neo4j');
      const stats = breaker.getStats();
      
      // Just verify it was created
      expect(stats.state).toBe('CLOSED');
    });
  });

  describe('Ollama Circuit Breaker', () => {
    it('should use default config for ollama', () => {
      const breaker = getCircuitBreaker('ollama');
      const stats = breaker.getStats();
      
      expect(stats.state).toBe('CLOSED');
    });
  });
});
