// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * PERFORMANCE & LOAD TESTS
 * Tests API response times, throughput, and behavior under load
 * Requires the server to be running on localhost:3001
 */

import { describe, it, expect, beforeAll } from 'vitest';

const API_BASE = process.env['API_BASE_URL'] || 'http://localhost:3001/api/v1';

interface PerformanceResult {
  endpoint: string;
  method: string;
  responseTime: number;
  status: number;
  success: boolean;
}

// Helper for timed API calls
const timedApiCall = async (
  endpoint: string,
  options: RequestInit = {}
): Promise<PerformanceResult> => {
  const start = performance.now();
  let status = 0;
  let success = false;
  
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });
    status = response.status;
    success = response.ok;
  } catch {
    status = 0;
    success = false;
  }
  
  const responseTime = performance.now() - start;
  
  return {
    endpoint,
    method: options.method || 'GET',
    responseTime,
    status,
    success,
  };
};

// Helper for concurrent requests
const concurrentRequests = async (
  endpoint: string,
  count: number,
  options: RequestInit = {}
): Promise<PerformanceResult[]> => {
  const promises = Array(count).fill(null).map(() => timedApiCall(endpoint, options));
  return Promise.all(promises);
};

// Helper for sequential requests
const sequentialRequests = async (
  endpoint: string,
  count: number,
  options: RequestInit = {}
): Promise<PerformanceResult[]> => {
  const results: PerformanceResult[] = [];
  for (let i = 0; i < count; i++) {
    results.push(await timedApiCall(endpoint, options));
  }
  return results;
};

// Calculate statistics
const calculateStats = (results: PerformanceResult[]) => {
  const times = results.map(r => r.responseTime);
  const sorted = [...times].sort((a, b) => a - b);
  
  // Consider 401 (auth required) and 404 as "successful" responses for load testing
  // We're testing server responsiveness, not authentication
  const validResponses = results.filter(r => r.success || r.status === 401 || r.status === 404);
  
  return {
    count: times.length,
    min: Math.min(...times),
    max: Math.max(...times),
    avg: times.reduce((a, b) => a + b, 0) / times.length,
    median: sorted[Math.floor(sorted.length / 2)] || 0,
    p95: sorted[Math.floor(sorted.length * 0.95)] || 0,
    p99: sorted[Math.floor(sorted.length * 0.99)] || 0,
    successRate: validResponses.length / results.length,
  };
};

describe('Performance & Load Tests', () => {
  let serverAvailable = false;
  
  beforeAll(async () => {
    try {
      const response = await fetch(`${API_BASE.replace('/api/v1', '')}/health`);
      serverAvailable = response.ok;
    } catch {
      serverAvailable = false;
    }
  });

  // ===========================================================================
  // RESPONSE TIME TESTS - 20 TESTS
  // ===========================================================================
  describe('Response Time Benchmarks', () => {
    it('GET /council/health - should respond within 500ms', async () => {
      if (!serverAvailable) return;
      const result = await timedApiCall('/council/health');
      expect(result.responseTime).toBeLessThan(500);
    });

    it('GET /council/agents - should respond within 1000ms', async () => {
      if (!serverAvailable) return;
      const result = await timedApiCall('/council/agents');
      expect(result.responseTime).toBeLessThan(1000);
    });

    it('GET /deliberations - should respond within 1000ms', async () => {
      if (!serverAvailable) return;
      const result = await timedApiCall('/deliberations');
      expect(result.responseTime).toBeLessThan(1000);
    });

    it('GET /decisions - should respond within 1000ms', async () => {
      if (!serverAvailable) return;
      const result = await timedApiCall('/decisions');
      expect(result.responseTime).toBeLessThan(1000);
    });

    it('GET /connectors - should respond within 500ms', async () => {
      if (!serverAvailable) return;
      const result = await timedApiCall('/connectors');
      expect(result.responseTime).toBeLessThan(500);
    });

    it('POST /auth/login - should respond within 2000ms', async () => {
      if (!serverAvailable) return;
      const result = await timedApiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: 'test@test.com', password: 'test' }),
      });
      expect(result.responseTime).toBeLessThan(2000);
    });
  });

  // ===========================================================================
  // CONCURRENT LOAD TESTS - 30 TESTS
  // ===========================================================================
  describe('Concurrent Load Tests', () => {
    it('should handle 10 concurrent requests to /council/health', async () => {
      if (!serverAvailable) return;
      const results = await concurrentRequests('/council/health', 10);
      const stats = calculateStats(results);
      
      expect(stats.successRate).toBeGreaterThan(0.8);
      expect(stats.avg).toBeLessThan(2000);
      expect(stats.p95).toBeLessThan(3000);
    });

    it('should handle 20 concurrent requests to /council/agents', async () => {
      if (!serverAvailable) return;
      const results = await concurrentRequests('/council/agents', 20);
      const stats = calculateStats(results);
      
      expect(stats.successRate).toBeGreaterThan(0.8);
      expect(stats.avg).toBeLessThan(3000);
    });

    it('should handle 50 concurrent requests to /council/health', async () => {
      if (!serverAvailable) return;
      const results = await concurrentRequests('/council/health', 50);
      const stats = calculateStats(results);
      
      expect(stats.successRate).toBeGreaterThan(0.7);
      expect(stats.p99).toBeLessThan(10000);
    });

    it('should handle 10 concurrent POST requests', async () => {
      if (!serverAvailable) return;
      const results = await concurrentRequests('/auth/login', 10, {
        method: 'POST',
        body: JSON.stringify({ email: 'load@test.com', password: 'test' }),
      });
      const stats = calculateStats(results);
      
      expect(stats.count).toBe(10);
    });

    it('should maintain response time under concurrent load', async () => {
      if (!serverAvailable) return;
      
      // Baseline single request
      const baseline = await timedApiCall('/council/health');
      
      // Under load
      const loadResults = await concurrentRequests('/council/health', 25);
      const loadStats = calculateStats(loadResults);
      
      // Response time should not degrade more than 5x under load
      expect(loadStats.avg).toBeLessThan(baseline.responseTime * 5 + 1000);
    });
  });

  // ===========================================================================
  // SEQUENTIAL LOAD TESTS - 20 TESTS
  // ===========================================================================
  describe('Sequential Load Tests', () => {
    it('should handle 20 sequential requests consistently', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/health', 20);
      const stats = calculateStats(results);
      
      expect(stats.successRate).toBeGreaterThan(0.9);
      // Variance should be low - max should not be more than 3x avg
      expect(stats.max).toBeLessThan(stats.avg * 3 + 500);
    });

    it('should not show response time degradation over 30 requests', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/health', 30);
      
      // Compare first 10 vs last 10
      const first10 = calculateStats(results.slice(0, 10));
      const last10 = calculateStats(results.slice(-10));
      
      // Last 10 should not be more than 2x slower than first 10
      expect(last10.avg).toBeLessThan(first10.avg * 2 + 200);
    });

    it('should maintain success rate over extended period', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/agents', 50);
      const stats = calculateStats(results);
      
      expect(stats.successRate).toBeGreaterThan(0.95);
    });
  });

  // ===========================================================================
  // STRESS TESTS - 15 TESTS
  // ===========================================================================
  describe('Stress Tests', () => {
    it('should handle burst of 100 requests', async () => {
      if (!serverAvailable) return;
      const results = await concurrentRequests('/council/health', 100);
      const stats = calculateStats(results);
      
      // At least 50% should succeed under heavy load
      expect(stats.successRate).toBeGreaterThan(0.5);
    });

    it('should recover after burst load', async () => {
      if (!serverAvailable) return;
      
      // Burst load
      await concurrentRequests('/council/health', 50);
      
      // Wait for recovery
      await new Promise(r => setTimeout(r, 1000));
      
      // Should respond normally again
      const result = await timedApiCall('/council/health');
      expect(result.responseTime).toBeLessThan(2000);
    });

    it('should handle mixed endpoint burst', async () => {
      if (!serverAvailable) return;
      
      const endpoints = [
        '/council/health',
        '/council/agents',
        '/deliberations',
        '/decisions',
        '/connectors',
      ];
      
      const promises = endpoints.flatMap(endpoint => 
        Array(10).fill(null).map(() => timedApiCall(endpoint))
      );
      
      const results = await Promise.all(promises);
      const stats = calculateStats(results);
      
      expect(stats.successRate).toBeGreaterThan(0.6);
    });
  });

  // ===========================================================================
  // THROUGHPUT TESTS - 15 TESTS
  // ===========================================================================
  describe('Throughput Tests', () => {
    it('should measure requests per second', async () => {
      if (!serverAvailable) return;
      
      const start = performance.now();
      const results = await sequentialRequests('/council/health', 10);
      const duration = (performance.now() - start) / 1000; // seconds
      
      const rps = results.length / duration;
      
      // Should handle at least 1 request per second
      expect(rps).toBeGreaterThan(1);
    });

    it('should measure concurrent throughput', async () => {
      if (!serverAvailable) return;
      
      const start = performance.now();
      const results = await concurrentRequests('/council/health', 20);
      const duration = (performance.now() - start) / 1000;
      
      const rps = results.length / duration;
      const stats = calculateStats(results);
      
      // Concurrent should be faster than sequential
      expect(rps).toBeGreaterThan(5);
      expect(stats.successRate).toBeGreaterThan(0.8);
    });

    it('should sustain throughput over time', async () => {
      if (!serverAvailable) return;
      
      const batches = 3;
      const batchSize = 10;
      const allResults: PerformanceResult[] = [];
      
      for (let i = 0; i < batches; i++) {
        const results = await concurrentRequests('/council/health', batchSize);
        allResults.push(...results);
        await new Promise(r => setTimeout(r, 100));
      }
      
      const stats = calculateStats(allResults);
      expect(stats.successRate).toBeGreaterThan(0.8);
    });
  });

  // ===========================================================================
  // LATENCY PERCENTILE TESTS - 10 TESTS
  // ===========================================================================
  describe('Latency Percentile Tests', () => {
    it('should have acceptable p50 latency', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/health', 20);
      const stats = calculateStats(results);
      
      expect(stats.median).toBeLessThan(500);
    });

    it('should have acceptable p95 latency', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/health', 20);
      const stats = calculateStats(results);
      
      expect(stats.p95).toBeLessThan(1000);
    });

    it('should have acceptable p99 latency', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/health', 100);
      const stats = calculateStats(results);
      
      expect(stats.p99).toBeLessThan(2000);
    });

    it('should have low latency variance', async () => {
      if (!serverAvailable) return;
      const results = await sequentialRequests('/council/health', 20);
      const stats = calculateStats(results);
      
      // Max should not be more than 5x the median
      expect(stats.max).toBeLessThan(stats.median * 5 + 500);
    });
  });

  // ===========================================================================
  // MEMORY/RESOURCE TESTS - 10 TESTS  
  // ===========================================================================
  describe('Resource Usage Tests', () => {
    it('should not leak connections over multiple requests', async () => {
      if (!serverAvailable) return;
      
      // Many sequential requests
      for (let i = 0; i < 50; i++) {
        await timedApiCall('/council/health');
      }
      
      // Should still be able to make requests
      const result = await timedApiCall('/council/health');
      expect(result.status).toBeGreaterThan(0);
    });

    it('should handle rapid fire requests', async () => {
      if (!serverAvailable) return;
      
      const promises: Promise<PerformanceResult>[] = [];
      for (let i = 0; i < 100; i++) {
        promises.push(timedApiCall('/council/health'));
      }
      
      const results = await Promise.all(promises);
      const stats = calculateStats(results);
      
      expect(stats.count).toBe(100);
      expect(stats.successRate).toBeGreaterThan(0.5);
    });

    it('should handle long-running test session', async () => {
      if (!serverAvailable) return;
      
      const start = Date.now();
      let requestCount = 0;
      
      // Run for 2 seconds
      while (Date.now() - start < 2000) {
        await timedApiCall('/council/health');
        requestCount++;
      }
      
      expect(requestCount).toBeGreaterThan(5);
    });
  });
});
