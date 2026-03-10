/**
 * LLM Services Tests
 * Tests for EmbeddingService, LLMCache, RAGService
 * @module __tests__/services/LLMServices.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    embeddings: { findMany: vi.fn().mockResolvedValue([]), create: vi.fn().mockResolvedValue({}), upsert: vi.fn().mockResolvedValue({}) },
    rag_documents: { findMany: vi.fn().mockResolvedValue([]), findUnique: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), update: vi.fn().mockResolvedValue({}) },
    llm_cache: { findFirst: vi.fn().mockResolvedValue(null), create: vi.fn().mockResolvedValue({}), deleteMany: vi.fn().mockResolvedValue({ count: 0 }) },
    $queryRaw: vi.fn().mockResolvedValue([]),
  },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    chat: vi.fn().mockResolvedValue({ message: { content: 'test' } }),
    generate: vi.fn().mockResolvedValue({ response: 'test' }),
    embeddings: vi.fn().mockResolvedValue({ embedding: new Array(384).fill(0.1) }),
  },
}));
vi.mock('../../config/cache.js', () => ({
  cache: { get: vi.fn().mockResolvedValue(null), set: vi.fn().mockResolvedValue('OK'), del: vi.fn().mockResolvedValue(1) },
}));

// ============================================================================
// EmbeddingService
// ============================================================================
const { embeddingService, EMBEDDING_DIM_OLLAMA, EMBEDDING_DIM_FALLBACK } = await import('../../services/llm/EmbeddingService.js');

describe('EmbeddingService', () => {
  it('should export a singleton instance', () => {
    expect(typeof embeddingService).toBe('object');
  });

  it('should export embedding dimension constants', () => {
    expect(typeof EMBEDDING_DIM_OLLAMA).toBe('number');
    expect(typeof EMBEDDING_DIM_FALLBACK).toBe('number');
  });

  it('should have embed or generateEmbedding method', () => {
    const hasEmbed = typeof (embeddingService as any).embed === 'function';
    const hasGenerate = typeof (embeddingService as any).generateEmbedding === 'function';
    const hasGetEmbedding = typeof (embeddingService as any).getEmbedding === 'function';
    expect(hasEmbed || hasGenerate || hasGetEmbedding).toBe(true);
  });
});

// ============================================================================
// LLMCache
// ============================================================================
const { llmCache } = await import('../../services/llm/LLMCache.js');

describe('LLMCacheService', () => {
  it('should export a singleton instance', () => {
    expect(llmCache).toBeDefined();
  });

  it('should have get method', () => {
    const hasGet = typeof (llmCache as any).get === 'function';
    const hasLookup = typeof (llmCache as any).lookup === 'function';
    expect(hasGet || hasLookup).toBe(true);
  });

  it('should have set or store method', () => {
    const hasSet = typeof (llmCache as any).set === 'function';
    const hasStore = typeof (llmCache as any).store === 'function';
    expect(hasSet || hasStore).toBe(true);
  });
});

// ============================================================================
// RAGService
// ============================================================================
const { ragService } = await import('../../services/llm/RAGService.js');

describe('RAGService', () => {
  it('should export a singleton instance', () => {
    expect(typeof ragService).toBe('object');
  });

  it('should have query or search method', () => {
    const hasQuery = typeof (ragService as any).query === 'function';
    const hasSearch = typeof (ragService as any).search === 'function';
    const hasRetrieve = typeof (ragService as any).retrieve === 'function';
    expect(hasQuery || hasSearch || hasRetrieve).toBe(true);
  });

  it('should have ingest or addDocument method', () => {
    const hasIngest = typeof (ragService as any).ingest === 'function';
    const hasAdd = typeof (ragService as any).addDocument === 'function';
    const hasIndex = typeof (ragService as any).indexDocument === 'function';
    expect(hasIngest || hasAdd || hasIndex).toBe(true);
  });
});
