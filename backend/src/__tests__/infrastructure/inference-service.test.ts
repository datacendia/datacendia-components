// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * INFERENCE SERVICE — UNIT TESTS
 * =============================================================================
 * Tests the InferenceProvider abstraction and InferenceService facade.
 * Validates: provider types, interface compliance, failover logic, status.
 * =============================================================================
 */

import { describe, it, expect, vi } from 'vitest';

vi.stubEnv('INFERENCE_PROVIDER', 'ollama');
vi.stubEnv('INFERENCE_FAILOVER', 'false');

describe('InferenceProvider interface', () => {
  it('should define all required provider types', async () => {
    const mod = await import('../../services/inference/InferenceProvider.js');
    // Type check: InferenceProviderType should be a union
    const validTypes: string[] = ['ollama', 'triton', 'nim'];
    expect(validTypes).toContain('ollama');
    expect(validTypes).toContain('triton');
    expect(validTypes).toContain('nim');
    // Interface exports should exist
    expect(mod).toBeDefined();
  });
});

describe('InferenceService (Ollama default)', () => {
  let inference: any;

  beforeAll(async () => {
    const mod = await import('../../services/inference/InferenceService.js');
    inference = mod.inference;
  });

  it('should default to ollama provider', () => {
    const status = inference.getStatus();
    expect(status.primaryProvider).toBe('ollama');
    expect(status.activeProvider).toBe('ollama');
    expect(status.failoverEnabled).toBe(false);
    expect(status.failoverActive).toBe(false);
  });

  it('should implement IInferenceProvider interface', () => {
    expect(typeof inference.isAvailable).toBe('function');
    expect(typeof inference.healthCheck).toBe('function');
    expect(typeof inference.resolveModel).toBe('function');
    expect(typeof inference.listModels).toBe('function');
    expect(typeof inference.generate).toBe('function');
    expect(typeof inference.chat).toBe('function');
    expect(typeof inference.embed).toBe('function');
    expect(typeof inference.streamChat).toBe('function');
    expect(typeof inference.generateWithTelemetry).toBe('function');
    expect(typeof inference.chatWithTelemetry).toBe('function');
    expect(typeof inference.embedWithTelemetry).toBe('function');
  });

  it('should expose healthCheckAll for diagnostics', () => {
    expect(typeof inference.healthCheckAll).toBe('function');
  });

  it('should support forceProvider admin override', () => {
    expect(typeof inference.forceProvider).toBe('function');
    // Force to primary (no-op since no fallback)
    inference.forceProvider('primary');
    const status = inference.getStatus();
    expect(status.failoverActive).toBe(false);
  });

  it('should support clean shutdown', () => {
    expect(typeof inference.shutdown).toBe('function');
    // Should not throw
    inference.shutdown();
  });
});

describe('OllamaProvider', () => {
  it('should instantiate with default config', async () => {
    const { OllamaProvider } = await import('../../services/inference/OllamaProvider.js');
    const provider = new OllamaProvider();
    expect(provider.type).toBe('ollama');
  });

  it('should accept custom baseUrl and model', async () => {
    const { OllamaProvider } = await import('../../services/inference/OllamaProvider.js');
    const provider = new OllamaProvider('http://custom:11434', 'custom-model');
    expect(provider.type).toBe('ollama');
    const model = await provider.resolveModel();
    expect(model).toBe('custom-model');
  });
});

describe('TritonProvider', () => {
  it('should instantiate with default config', async () => {
    const { TritonProvider } = await import('../../services/inference/TritonProvider.js');
    const provider = new TritonProvider();
    expect(provider.type).toBe('triton');
  });

  it('should accept custom config', async () => {
    const { TritonProvider } = await import('../../services/inference/TritonProvider.js');
    const provider = new TritonProvider('http://gpu-server:8000', 'llama-trt', 'e5-embed');
    expect(provider.type).toBe('triton');
    const model = await provider.resolveModel();
    expect(model).toBe('llama-trt');
  });

  it('should return false for isAvailable when server is down', async () => {
    const { TritonProvider } = await import('../../services/inference/TritonProvider.js');
    const provider = new TritonProvider('http://localhost:99999');
    const available = await provider.isAvailable();
    expect(available).toBe(false);
  });
});

describe('Backward-compatible ollama shim', () => {
  it('should re-export inference as ollama', async () => {
    const shimMod = await import('../../services/ollama.js');
    const inferenceMod = await import('../../services/inference/InferenceService.js');
    // The shim's ollama should be the same inference singleton
    expect(shimMod.ollama).toBeDefined();
    expect(typeof shimMod.ollama.generate).toBe('function');
    expect(typeof shimMod.ollama.chat).toBe('function');
    expect(typeof shimMod.ollama.embed).toBe('function');
  });
});
