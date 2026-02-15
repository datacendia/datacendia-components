// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Redis Caching Layer for Datacendia
 * 
 * Distributed caching for Council deliberations and frequently-accessed
 * graph queries. Falls back to in-memory cache when Redis is unavailable.
 */

import crypto from 'crypto';
import { redis as redisClient } from '../config/redis.js';
import { logger } from '../utils/logger.js';

export interface CacheConfig {
  defaultTTL: number;
  maxMemoryItems: number;
  prefix: string;
}

export interface CacheEntry<T> {
  value: T;
  expiresAt: number;
  createdAt: number;
  hits: number;
  tags: string[];
}

export interface CacheStats {
  hits: number;
  misses: number;
  size: number;
  hitRate: number;
  memoryUsage: number;
}

class CacheService {
  private cache: Map<string, CacheEntry<unknown>> = new Map();
  private config: CacheConfig = {
    defaultTTL: 300000, // 5 minutes default
    maxMemoryItems: 10000,
    prefix: 'datacendia:',
  };
  private stats = { hits: 0, misses: 0 };
  private redisAvailable: boolean = false;

  constructor() {
    // Cleanup expired entries every minute
    setInterval(() => this.cleanup(), 60000);
    
    // Connect to real Redis
    this.initRedis();
  }

  private async initRedis(): Promise<void> {
    try {
      const status = redisClient.status;
      if (status === 'ready' || status === 'connect') {
        this.redisAvailable = true;
        logger.info('[Cache] Connected to Redis — distributed caching enabled');
      } else {
        // Listen for ready event
        redisClient.once('ready', () => {
          this.redisAvailable = true;
          logger.info('[Cache] Redis became ready — distributed caching enabled');
        });
        redisClient.once('error', () => {
          this.redisAvailable = false;
          logger.warn('[Cache] Redis unavailable — using in-memory fallback');
        });
      }
    } catch {
      this.redisAvailable = false;
      logger.warn('[Cache] Redis unavailable — using in-memory fallback');
    }
  }

  /**
   * Generate cache key with prefix
   */
  private getKey(key: string): string {
    return `${this.config.prefix}${key}`;
  }

  /**
   * Set a value in cache
   */
  async set<T>(
    key: string,
    value: T,
    options?: {
      ttl?: number;
      tags?: string[];
    }
  ): Promise<void> {
    const fullKey = this.getKey(key);
    const ttl = options?.ttl || this.config.defaultTTL;

    const entry: CacheEntry<T> = {
      value,
      expiresAt: Date.now() + ttl,
      createdAt: Date.now(),
      hits: 0,
      tags: options?.tags || [],
    };

    // Try Redis first
    if (this.redisAvailable) {
      try {
        await redisClient.setex(
          fullKey,
          Math.ceil(ttl / 1000),
          JSON.stringify(entry)
        );
        return;
      } catch (error) {
        logger.warn('[Cache] Redis set failed, using memory:', error);
      }
    }

    // Fallback to memory
    this.cache.set(fullKey, entry);
    
    // Evict if over limit
    if (this.cache.size > this.config.maxMemoryItems) {
      this.evictOldest();
    }
  }

  /**
   * Get a value from cache
   */
  async get<T>(key: string): Promise<T | null> {
    const fullKey = this.getKey(key);

    // Try Redis first
    if (this.redisAvailable) {
      try {
        const data = await redisClient.get(fullKey);
        if (data) {
          const entry = JSON.parse(data) as CacheEntry<T>;
          if (entry.expiresAt > Date.now()) {
            this.stats.hits++;
            return entry.value;
          }
        }
        this.stats.misses++;
        return null;
      } catch (error) {
        logger.warn('[Cache] Redis get failed, using memory:', error);
      }
    }

    // Fallback to memory
    const entry = this.cache.get(fullKey) as CacheEntry<T> | undefined;
    
    if (entry && entry.expiresAt > Date.now()) {
      entry.hits++;
      this.stats.hits++;
      return entry.value;
    }

    this.stats.misses++;
    
    if (entry) {
      this.cache.delete(fullKey);
    }
    
    return null;
  }

  /**
   * Get or set with callback
   */
  async getOrSet<T>(
    key: string,
    callback: () => Promise<T>,
    options?: { ttl?: number; tags?: string[] }
  ): Promise<T> {
    const cached = await this.get<T>(key);
    if (cached !== null) {
      return cached;
    }

    const value = await callback();
    await this.set(key, value, options);
    return value;
  }

  /**
   * Delete a key from cache
   */
  async delete(key: string): Promise<boolean> {
    const fullKey = this.getKey(key);

    if (this.redisAvailable) {
      try {
        await redisClient.del(fullKey);
      } catch (error) {
        logger.warn('[Cache] Redis delete failed:', error);
      }
    }

    return this.cache.delete(fullKey);
  }

  /**
   * Delete all keys matching a pattern
   */
  async deletePattern(pattern: string): Promise<number> {
    const fullPattern = this.getKey(pattern);
    let deleted = 0;

    // Memory cache
    for (const key of this.cache.keys()) {
      if (this.matchPattern(key, fullPattern)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    // Redis (if available)
    if (this.redisAvailable) {
      try {
        const keys = await redisClient.keys(fullPattern.replace('*', '*'));
        if (keys.length > 0) {
          await redisClient.del(...keys);
          deleted += keys.length;
        }
      } catch (error) {
        logger.warn('[Cache] Redis pattern delete failed:', error);
      }
    }

    return deleted;
  }

  /**
   * Delete all entries with a specific tag
   */
  async deleteByTag(tag: string): Promise<number> {
    let deleted = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.tags.includes(tag)) {
        this.cache.delete(key);
        deleted++;
      }
    }

    logger.debug(`[Cache] Deleted ${deleted} entries with tag: ${tag}`);
    return deleted;
  }

  /**
   * Clear all cache entries
   */
  async clear(): Promise<void> {
    this.cache.clear();
    
    if (this.redisAvailable) {
      try {
        const keys = await redisClient.keys(`${this.config.prefix}*`);
        if (keys.length > 0) {
          await redisClient.del(...keys);
        }
      } catch (error) {
        logger.warn('[Cache] Redis clear failed:', error);
      }
    }

    logger.debug('[Cache] Cleared all entries');
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    const total = this.stats.hits + this.stats.misses;
    return {
      hits: this.stats.hits,
      misses: this.stats.misses,
      size: this.cache.size,
      hitRate: total > 0 ? this.stats.hits / total : 0,
      memoryUsage: this.estimateMemoryUsage(),
    };
  }

  /**
   * Estimate memory usage in bytes
   */
  private estimateMemoryUsage(): number {
    let size = 0;
    for (const [key, entry] of this.cache.entries()) {
      size += key.length * 2; // UTF-16
      size += JSON.stringify(entry.value).length * 2;
      size += 100; // Overhead for entry metadata
    }
    return size;
  }

  /**
   * Cleanup expired entries
   */
  private cleanup(): void {
    const now = Date.now();
    let cleaned = 0;

    for (const [key, entry] of this.cache.entries()) {
      if (entry.expiresAt < now) {
        this.cache.delete(key);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      logger.debug(`[Cache] Cleaned ${cleaned} expired entries`);
    }
  }

  /**
   * Evict oldest entries when over limit
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries())
      .sort((a, b) => a[1].createdAt - b[1].createdAt);

    const toRemove = Math.ceil(this.config.maxMemoryItems * 0.1); // Remove 10%
    
    for (let i = 0; i < toRemove && i < entries.length; i++) {
      this.cache.delete(entries[i][0]);
    }

    logger.debug(`[Cache] Evicted ${toRemove} oldest entries`);
  }

  /**
   * Simple pattern matching (supports * wildcard)
   */
  private matchPattern(str: string, pattern: string): boolean {
    const regex = new RegExp(
      '^' + pattern.replace(/\*/g, '.*').replace(/\?/g, '.') + '$'
    );
    return regex.test(str);
  }

  // ==========================================================================
  // Domain-Specific Cache Methods
  // ==========================================================================

  /**
   * Cache a deliberation result
   */
  async cacheDeliberation(
    deliberationId: string,
    data: unknown,
    ttl: number = 3600000 // 1 hour
  ): Promise<void> {
    await this.set(`deliberation:${deliberationId}`, data, {
      ttl,
      tags: ['deliberation'],
    });
  }

  /**
   * Get cached deliberation
   */
  async getDeliberation<T>(deliberationId: string): Promise<T | null> {
    return this.get<T>(`deliberation:${deliberationId}`);
  }

  /**
   * Cache graph query result
   */
  async cacheGraphQuery(
    query: string,
    result: unknown,
    ttl: number = 300000 // 5 minutes
  ): Promise<void> {
    const queryHash = crypto.createHash('md5').update(query).digest('hex');
    await this.set(`graph:query:${queryHash}`, result, {
      ttl,
      tags: ['graph'],
    });
  }

  /**
   * Get cached graph query
   */
  async getGraphQuery<T>(query: string): Promise<T | null> {
    const queryHash = crypto.createHash('md5').update(query).digest('hex');
    return this.get<T>(`graph:query:${queryHash}`);
  }

  /**
   * Invalidate all graph cache (after updates)
   */
  async invalidateGraphCache(): Promise<void> {
    await this.deleteByTag('graph');
  }

  /**
   * Cache agent response
   */
  async cacheAgentResponse(
    agentId: string,
    queryHash: string,
    response: unknown,
    ttl: number = 600000 // 10 minutes
  ): Promise<void> {
    await this.set(`agent:${agentId}:${queryHash}`, response, {
      ttl,
      tags: ['agent', `agent:${agentId}`],
    });
  }

  /**
   * Cache user session data
   */
  async cacheSession(
    sessionId: string,
    data: unknown,
    ttl: number = 86400000 // 24 hours
  ): Promise<void> {
    await this.set(`session:${sessionId}`, data, {
      ttl,
      tags: ['session'],
    });
  }

  /**
   * Cache organization settings
   */
  async cacheOrgSettings(
    orgId: string,
    settings: unknown,
    ttl: number = 3600000 // 1 hour
  ): Promise<void> {
    await this.set(`org:${orgId}:settings`, settings, {
      ttl,
      tags: ['org', `org:${orgId}`],
    });
  }
}

export const cacheService = new CacheService();
export default cacheService;
