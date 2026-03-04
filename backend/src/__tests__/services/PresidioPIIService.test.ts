/**
 * Integration tests for PresidioPIIService
 * 
 * Tests ML-based PII detection via Microsoft Presidio with graceful
 * fallback to regex-based PIIDetector when Presidio is unavailable.
 */

import { describe, it, expect, beforeAll, vi } from 'vitest';

// Mock fetch for Presidio API calls
const mockFetch = vi.fn();
global.fetch = mockFetch as any;

// Import after mocking
import presidioPIIService from '../../services/gateway/PresidioPIIService.js';

describe('PresidioPIIService', () => {
  beforeAll(() => {
    vi.clearAllMocks();
  });

  describe('isAvailable', () => {
    it('should return false when Presidio is unreachable', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      const available = await presidioPIIService.isAvailable();
      expect(available).toBe(false);
    });

    it('should return true when Presidio health check succeeds', async () => {
      mockFetch.mockResolvedValueOnce({ ok: true });
      // Force re-check by waiting past the cache interval
      (presidioPIIService as any).lastHealthCheck = 0;
      const available = await presidioPIIService.isAvailable();
      expect(available).toBe(true);
    });
  });

  describe('analyze - regex fallback', () => {
    it('should fall back to regex scanner when Presidio is down', async () => {
      // Force Presidio unavailable
      (presidioPIIService as any).available = false;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      const result = await presidioPIIService.analyze(
        'My SSN is 123-45-6789 and email is test@example.com'
      );

      expect(result.engine).toBe('regex-fallback');
      expect(result.hasPII).toBe(true);
      expect(result.detections.length).toBeGreaterThanOrEqual(2);
      expect(result.types).toContain('ssn');
      expect(result.types).toContain('email');
      expect(result.redactedText).not.toContain('123-45-6789');
      expect(result.redactedText).not.toContain('test@example.com');
    });

    it('should return no PII for clean text in fallback mode', async () => {
      (presidioPIIService as any).available = false;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      const result = await presidioPIIService.analyze(
        'The weather today is sunny with a high of 72 degrees.'
      );

      expect(result.engine).toBe('regex-fallback');
      expect(result.hasPII).toBe(false);
      expect(result.detections).toHaveLength(0);
    });
  });

  describe('analyze - Presidio ML engine', () => {
    it('should use Presidio when available and return ML detections', async () => {
      // Force Presidio available
      (presidioPIIService as any).available = true;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      // Mock the analyze endpoint
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            entity_type: 'PERSON',
            start: 11,
            end: 19,
            score: 0.95,
            analysis_explanation: { recognizer: 'SpacyRecognizer' },
          },
          {
            entity_type: 'EMAIL_ADDRESS',
            start: 33,
            end: 49,
            score: 0.99,
            analysis_explanation: { recognizer: 'EmailRecognizer' },
          },
        ],
      });

      const result = await presidioPIIService.analyze(
        'My name is John Doe and email is test@example.com'
      );

      expect(result.engine).toBe('presidio');
      expect(result.hasPII).toBe(true);
      expect(result.detections.length).toBe(2);
      expect(result.types).toContain('person_name');
      expect(result.types).toContain('email');
      expect(result.presidioLatencyMs).toBeDefined();
      expect(result.recognizers).toContain('SpacyRecognizer');
    });

    it('should fall back to regex if Presidio analyzer returns error', async () => {
      (presidioPIIService as any).available = true;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      mockFetch.mockResolvedValueOnce({ ok: false, status: 500 });

      const result = await presidioPIIService.analyze(
        'My SSN is 123-45-6789'
      );

      expect(result.engine).toBe('regex-fallback');
      expect(result.hasPII).toBe(true);
    });
  });

  describe('analyze - PII types coverage', () => {
    it('should detect credit card numbers', async () => {
      (presidioPIIService as any).available = false;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      const result = await presidioPIIService.analyze(
        'Card number: 4111-1111-1111-1111'
      );

      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('credit_card');
    });

    it('should detect phone numbers', async () => {
      (presidioPIIService as any).available = false;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      const result = await presidioPIIService.analyze(
        'Call me at (555) 123-4567'
      );

      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('phone');
    });

    it('should detect IP addresses', async () => {
      (presidioPIIService as any).available = false;
      (presidioPIIService as any).lastHealthCheck = Date.now();

      const result = await presidioPIIService.analyze(
        'Server IP: 192.168.1.100'
      );

      expect(result.hasPII).toBe(true);
      expect(result.types).toContain('ip_address');
    });
  });

  describe('getSupportedEntities', () => {
    it('should return empty array when Presidio is down', async () => {
      mockFetch.mockRejectedValueOnce(new Error('ECONNREFUSED'));
      const entities = await presidioPIIService.getSupportedEntities();
      expect(entities).toEqual([]);
    });
  });
});
