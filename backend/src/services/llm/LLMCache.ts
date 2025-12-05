/**
 * LLM Response Cache
 * Caches AI responses to save cost and speed up repeated queries
 */

import crypto from 'crypto';
import { prisma } from '../../lib/prisma.js';

// ============================================================================
// TYPES
// ============================================================================

export interface CacheEntry {
  queryHash: string;
  model: string;
  prompt: string;
  systemPrompt?: string;
  response: string;
  tokensIn: number;
  tokensOut: number;
  latencyMs: number;
  temperature: number;
}

export interface CacheStats {
  totalEntries: number;
  hitRate: number;
  totalHits: number;
  byModel: Record<string, number>;
  avgLatencySaved: number;
}

// ============================================================================
// CACHE SERVICE
// ============================================================================

export class LLMCacheService {
  private ttlHours: number = 24; // Default cache TTL

  /**
   * Generate cache key from prompt parameters
   */
  generateKey(prompt: string, model: string, systemPrompt?: string, temperature: number = 0.7): string {
    const input = `${prompt}|${model}|${systemPrompt || ''}|${temperature}`;
    return crypto.createHash('sha256').update(input).digest('hex');
  }

  /**
   * Get cached response
   */
  async get(key: string): Promise<string | null> {
    try {
      const entry = await prisma.lLMCache.findUnique({
        where: { queryHash: key },
      });

      if (!entry) return null;

      // Check if expired
      if (entry.expiresAt < new Date()) {
        await this.delete(key);
        return null;
      }

      // Update hit count and last accessed
      await prisma.lLMCache.update({
        where: { queryHash: key },
        data: {
          hitCount: { increment: 1 },
          lastAccessedAt: new Date(),
        },
      });

      return entry.response;
    } catch (error) {
      return null;
    }
  }

  /**
   * Store response in cache
   */
  async set(entry: CacheEntry): Promise<void> {
    const expiresAt = new Date(Date.now() + this.ttlHours * 60 * 60 * 1000);

    try {
      await prisma.lLMCache.upsert({
        where: { queryHash: entry.queryHash },
        update: {
          response: entry.response,
          tokensIn: entry.tokensIn,
          tokensOut: entry.tokensOut,
          latencyMs: entry.latencyMs,
          hitCount: { increment: 1 },
          lastAccessedAt: new Date(),
          expiresAt,
        },
        create: {
          queryHash: entry.queryHash,
          model: entry.model,
          prompt: entry.prompt,
          systemPrompt: entry.systemPrompt,
          response: entry.response,
          tokensIn: entry.tokensIn,
          tokensOut: entry.tokensOut,
          latencyMs: entry.latencyMs,
          temperature: entry.temperature,
          expiresAt,
        },
      });
    } catch (error) {
      console.error('Cache set error:', error);
    }
  }

  /**
   * Delete cached entry
   */
  async delete(key: string): Promise<void> {
    try {
      await prisma.lLMCache.delete({
        where: { queryHash: key },
      });
    } catch (error) {
      // Entry may not exist
    }
  }

  /**
   * Clear expired entries
   */
  async clearExpired(): Promise<number> {
    const result = await prisma.lLMCache.deleteMany({
      where: {
        expiresAt: { lt: new Date() },
      },
    });
    return result.count;
  }

  /**
   * Clear all cache
   */
  async clearAll(): Promise<number> {
    const result = await prisma.lLMCache.deleteMany({});
    return result.count;
  }

  /**
   * Get cache statistics
   */
  async getStats(): Promise<CacheStats> {
    const entries = await prisma.lLMCache.findMany({
      select: {
        model: true,
        hitCount: true,
        latencyMs: true,
      },
    });

    const totalEntries = entries.length;
    const totalHits = entries.reduce((sum: number, e: { hitCount: number }) => sum + e.hitCount, 0);
    const avgLatency = entries.length > 0
      ? entries.reduce((sum: number, e: { latencyMs: number }) => sum + e.latencyMs, 0) / entries.length
      : 0;

    const byModel: Record<string, number> = {};
    for (const entry of entries) {
      byModel[entry.model] = (byModel[entry.model] || 0) + 1;
    }

    return {
      totalEntries,
      hitRate: totalEntries > 0 ? (totalHits - totalEntries) / totalHits : 0,
      totalHits,
      byModel,
      avgLatencySaved: avgLatency,
    };
  }

  /**
   * Set cache TTL in hours
   */
  setTTL(hours: number): void {
    this.ttlHours = hours;
  }
}

export const llmCache = new LLMCacheService();
