/**
 * Unit tests for CendiaGateway™ Rate Limiter
 */

import { describe, it, expect, beforeEach } from 'vitest';
import GatewayRateLimiter from '../RateLimiter';

describe('GatewayRateLimiter', () => {
  let limiter: GatewayRateLimiter;

  beforeEach(() => {
    limiter = new GatewayRateLimiter([
      {
        id: 'test-user-limit',
        name: 'Test User Limit',
        enabled: true,
        scope: 'user',
        maxRequests: 5,
        windowMs: 60_000,
        burstMultiplier: 1.0,
        action: 'block',
        notifyOnExceed: false,
      },
    ]);
  });

  it('allows requests within limit', () => {
    const result = limiter.check({ userId: 'user1', userDepartment: 'eng', organizationId: 'org1' });
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(5);
  });

  it('tracks consumption', () => {
    const params = { userId: 'user1', userDepartment: 'eng', organizationId: 'org1' };
    for (let i = 0; i < 4; i++) {
      limiter.check(params);
      limiter.consume(params);
    }
    const result = limiter.check(params);
    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(1);
  });

  it('blocks when limit exceeded', () => {
    const params = { userId: 'user1', userDepartment: 'eng', organizationId: 'org1' };
    for (let i = 0; i < 5; i++) {
      limiter.check(params);
      limiter.consume(params);
    }
    const result = limiter.check(params);
    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });

  it('isolates users from each other', () => {
    const params1 = { userId: 'user1', userDepartment: 'eng', organizationId: 'org1' };
    const params2 = { userId: 'user2', userDepartment: 'eng', organizationId: 'org1' };

    for (let i = 0; i < 5; i++) {
      limiter.check(params1);
      limiter.consume(params1);
    }

    const result1 = limiter.check(params1);
    const result2 = limiter.check(params2);
    expect(result1.allowed).toBe(false);
    expect(result2.allowed).toBe(true);
  });

  it('returns usage stats', () => {
    const params = { userId: 'user1', userDepartment: 'eng', organizationId: 'org1' };
    limiter.check(params);
    limiter.consume(params);

    const stats = limiter.getUsageStats();
    expect(stats.length).toBeGreaterThan(0);
    expect(stats[0]!.requestCount).toBe(1);
  });

  it('supports config CRUD', () => {
    expect(limiter.getConfigs()).toHaveLength(1);

    limiter.addConfig({
      id: 'new-limit',
      name: 'New Limit',
      enabled: true,
      scope: 'department',
      maxRequests: 100,
      windowMs: 60_000,
      burstMultiplier: 1.5,
      action: 'throttle',
      notifyOnExceed: true,
    });
    expect(limiter.getConfigs()).toHaveLength(2);

    const updated = limiter.updateConfig('new-limit', { maxRequests: 200 });
    expect(updated?.maxRequests).toBe(200);

    expect(limiter.removeConfig('new-limit')).toBe(true);
    expect(limiter.getConfigs()).toHaveLength(1);
  });

  it('prunes expired buckets', () => {
    const params = { userId: 'user1', userDepartment: 'eng', organizationId: 'org1' };
    limiter.check(params);
    // Can't easily test time-based pruning without mocking, but ensure it doesn't crash
    const pruned = limiter.prune();
    expect(pruned).toBeGreaterThanOrEqual(0);
  });

  it('returns sensible result with no configs', () => {
    const emptyLimiter = new GatewayRateLimiter([]);
    const result = emptyLimiter.check({ userId: 'x', userDepartment: 'y', organizationId: 'z' });
    expect(result.allowed).toBe(true);
  });
});
