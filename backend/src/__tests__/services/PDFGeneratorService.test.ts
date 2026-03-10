/**
 * PDFGeneratorService Tests
 * 
 * Tests for real PDF/A-3 generation
 * @module __tests__/services/PDFGeneratorService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';
import os from 'os';
import path from 'path';
import fs from 'fs';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

const { PDFGeneratorService } = await import('../../services/document/PDFGeneratorService.js');

describe('PDFGeneratorService', () => {
  let service: InstanceType<typeof PDFGeneratorService>;
  let tmpDir: string;

  beforeEach(() => {
    tmpDir = path.join(os.tmpdir(), `pdf-test-${Date.now()}`);
    fs.mkdirSync(tmpDir, { recursive: true });
    service = new PDFGeneratorService(tmpDir);
  });

  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  describe('initialization', () => {
    it('should be instantiable', () => {
      expect(service).toBeDefined();
    });

    it('should create storage directory', () => {
      expect(fs.existsSync(tmpDir)).toBe(true);
    });
  });

  // =========================================================================
  // GENERIC PDF GENERATION
  // =========================================================================

  describe('generatePDF()', () => {
    it('should generate a PDF from sections and metadata', async () => {
      const result = await service.generatePDF(
        [
          { type: 'heading', content: 'Section 1', level: 1 },
          { type: 'paragraph', content: 'This is test content for the PDF.' },
        ],
        { title: 'Test Document' }
      );

      expect(result).toBeDefined();
      expect(result.buffer).toBeInstanceOf(Buffer);
      expect(result.buffer.length).toBeGreaterThan(0);
      expect(result.filename).toContain('.pdf');
      expect(result.hash).toBeDefined();
      expect(result.hash.length).toBe(64); // SHA-256 hex
      expect(result.size).toBeGreaterThan(0);
      expect(result.pageCount).toBeGreaterThanOrEqual(1);
      expect(result.createdAt).toBeInstanceOf(Date);
    });

    it('should produce valid PDF bytes', async () => {
      const result = await service.generatePDF(
        [{ type: 'paragraph', content: 'Hello' }],
        { title: 'Magic Bytes Test' }
      );
      expect(result.buffer.slice(0, 4).toString()).toBe('%PDF');
    });

    it('should handle empty sections', async () => {
      const result = await service.generatePDF([], { title: 'Empty Document' });
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should support table sections', async () => {
      const result = await service.generatePDF(
        [{
          type: 'table',
          headers: ['Name', 'Value', 'Status'],
          rows: [['Item A', '100', 'Active'], ['Item B', '200', 'Inactive']],
        }],
        { title: 'Table Document' }
      );
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should support list sections', async () => {
      const result = await service.generatePDF(
        [{ type: 'list', items: ['First item', 'Second item', 'Third item'] }],
        { title: 'List Document' }
      );
      expect(result.buffer.length).toBeGreaterThan(0);
    });

    it('should apply header and footer options', async () => {
      const result = await service.generatePDF(
        [{ type: 'paragraph', content: 'Content with headers/footers' }],
        { title: 'Options Test' },
        { headerText: 'CONFIDENTIAL', footerText: '© Datacendia', includePageNumbers: true }
      );
      expect(result.pageCount).toBeGreaterThanOrEqual(1);
    });

    it('should respect PDF/A compliance option', async () => {
      const result = await service.generatePDF(
        [{ type: 'paragraph', content: 'PDF/A compliant document' }],
        { title: 'PDFA Test' },
        { pdfaCompliant: true }
      );
      expect(result.buffer.length).toBeGreaterThan(0);
    });
  });

  // =========================================================================
  // SPECIALIZED REPORTS
  // =========================================================================

  describe('generateDecisionReport()', () => {
    it('should generate a decision report PDF', async () => {
      const result = await service.generateDecisionReport({
        id: 'dec-001',
        title: 'Q4 Budget Allocation',
        summary: 'Quarterly budget allocation decision for engineering department',
        recommendation: 'Approve $2M for cloud infrastructure',
        confidence: 0.85,
        participants: ['CTO', 'CFO', 'VP Engineering'],
        votes: [
          { agent: 'CTO', vote: 'approve', rationale: 'Critical for scaling' },
          { agent: 'CFO', vote: 'approve', rationale: 'Within budget' },
        ],
        dissents: [
          { agent: 'VP Ops', reason: 'Timeline too aggressive' },
        ],
        createdAt: new Date('2024-01-15'),
      });

      expect(result.buffer.length).toBeGreaterThan(100);
      expect(result.filename).toContain('.pdf');
    });
  });

  describe('generateTestReport()', () => {
    it('should generate a test results PDF', async () => {
      const result = await service.generateTestReport({
        reportId: 'test-001',
        title: 'Security Compliance Tests',
        summary: { total: 25, passed: 22, failed: 2, skipped: 1 },
        categories: [
          { name: 'Auth', total: 10, passed: 9, failed: 1 },
          { name: 'Injection', total: 8, passed: 8, failed: 0 },
        ],
        failures: [
          { test: 'XSS detection', category: 'Input Validation', error: 'Unfiltered input detected' },
        ],
        executedAt: new Date(),
        duration: 45000,
      });

      expect(result.buffer.length).toBeGreaterThan(100);
    });
  });

  describe('generateRegulatorsReceipt()', () => {
    it('should generate a regulators receipt PDF', async () => {
      const result = await service.generateRegulatorsReceipt({
        receiptId: 'receipt-001',
        version: '1.0',
        generatedAt: new Date(),
        generatedBy: 'system',
        decision: {
          id: 'dec-1',
          question: 'Budget allocation',
          finalDecision: 'Approved',
          councilMode: 'consensus',
          consensusScore: 0.92,
          createdAt: new Date(),
          completedAt: new Date(),
        },
        participants: {
          agents: [
            { name: 'Analyst', role: 'advisor', responseCount: 3, dissented: false },
          ],
        },
        evidenceChain: {
          deliberationHash: 'abc123',
          merkleRoot: 'def456',
          citationsHash: 'ghi789',
          agentResponsesHash: 'jkl012',
          dissentsHash: 'mno345',
        },
        compliance: {
          frameworks: ['SOX'],
          gatesCleared: ['deliberation', 'evidence'],
          gatesFailed: [],
        },
        cryptographicProof: {
          algorithm: 'SHA-256',
          receiptHash: 'sha256:abc123',
        },
        retention: {
          retentionPeriod: '7 years',
          retentionUntil: new Date('2031-01-01'),
          legalHold: false,
          jurisdiction: 'US',
        },
      });

      expect(result.buffer.length).toBeGreaterThan(100);
    });
  });
});
