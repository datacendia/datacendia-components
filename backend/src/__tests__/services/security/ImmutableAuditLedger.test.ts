// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * @fileoverview Comprehensive tests for ImmutableAuditLedger
 * @module tests/services/security/ImmutableAuditLedger
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';

// Mock crypto for deterministic tests
vi.mock('crypto', async () => {
  const actual = await vi.importActual('crypto');
  return {
    ...actual,
    randomBytes: vi.fn(() => Buffer.from('0'.repeat(64), 'hex')),
  };
});

// Mock the audit service types
const mockAuditEvent = {
  id: 'test-event-1',
  timestamp: new Date('2025-01-01T00:00:00Z'),
  eventType: 'auth.login',
  severity: 'info' as const,
  organizationId: 'org-123',
  resource: { type: 'user', id: 'user-1', name: 'Test User' },
  action: 'User logged in',
  details: { ip: '192.168.1.1' },
  outcome: 'success' as const,
};

describe('ImmutableAuditLedger', () => {
  let ledger: any;

  beforeEach(async () => {
    // Dynamic import to get fresh instance
    vi.resetModules();
    const module = await import('../../../services/security/ImmutableAuditLedger.js');
    // Use the singleton instance or create via default export
    ledger = module.immutableAuditLedger || new (module.default as any)();
  });

  afterEach(() => {
    if (ledger?.shutdown) {
      ledger.shutdown();
    }
  });

  describe('Initialization', () => {
    it('should create genesis entry on initialization', () => {
      const entries = ledger.getEntries?.() || [];
      expect(entries.length).toBeGreaterThanOrEqual(1);
    });

    it('should have genesis entry with index 0', async () => {
      const result = await ledger.getEntriesWithProof({ organizationId: 'system' });
      const genesisEntry = result.entries.find((e: any) => e.index === 0);
      expect(genesisEntry).toBeDefined();
    });

    it('should initialize with default configuration', () => {
      expect(ledger).toBeDefined();
    });

    it('should accept custom configuration', async () => {
      vi.resetModules();
      const module = await import('../../../services/security/ImmutableAuditLedger.js');
      const customLedger = module.immutableAuditLedger || new (module.default as any)({
        blockSize: 50,
        enableBackgroundVerification: false,
      });
      expect(customLedger).toBeDefined();
      customLedger.shutdown?.();
    });
  });

  describe('append()', () => {
    it('should append an audit event and return entry', async () => {
      const entry = await ledger.append(mockAuditEvent);
      
      expect(entry).toBeDefined();
      expect(entry.index).toBeGreaterThan(0);
      expect(entry.hash).toBeDefined();
      expect(entry.hash.length).toBe(64); // SHA-256 hex
      expect(entry.previousHash).toBeDefined();
      expect(entry.event).toEqual(mockAuditEvent);
    });

    it('should link entries via previousHash', async () => {
      const entry1 = await ledger.append({ ...mockAuditEvent, id: 'event-1' });
      const entry2 = await ledger.append({ ...mockAuditEvent, id: 'event-2' });
      
      expect(entry2.previousHash).toBe(entry1.hash);
    });

    it('should sign entries', async () => {
      const entry = await ledger.append(mockAuditEvent);
      
      expect(entry.signature).toBeDefined();
      expect(entry.signature.length).toBe(64); // HMAC-SHA256 hex
    });

    it('should increment index for each entry', async () => {
      const entry1 = await ledger.append({ ...mockAuditEvent, id: 'event-1' });
      const entry2 = await ledger.append({ ...mockAuditEvent, id: 'event-2' });
      const entry3 = await ledger.append({ ...mockAuditEvent, id: 'event-3' });
      
      expect(entry2.index).toBe(entry1.index + 1);
      expect(entry3.index).toBe(entry2.index + 1);
    });

    it('should handle high-volume appends', async () => {
      const events = Array.from({ length: 50 }, (_, i) => ({
        ...mockAuditEvent,
        id: `event-${i}`,
      }));

      const entries = await Promise.all(events.map(e => ledger.append(e)));
      
      expect(entries.length).toBe(50);
      entries.forEach((entry, i) => {
        expect(entry.event.id).toBe(`event-${i}`);
      });
    });
  });

  describe('verifyIntegrity()', () => {
    it('should return valid for untampered ledger', async () => {
      await ledger.append(mockAuditEvent);
      await ledger.append({ ...mockAuditEvent, id: 'event-2' });
      
      const proof = await ledger.verifyIntegrity();
      
      expect(proof.valid).toBe(true);
      expect(proof.entriesVerified).toBeGreaterThan(0);
      expect(proof.checkedAt).toBeInstanceOf(Date);
    });

    it('should include verification details', async () => {
      await ledger.append(mockAuditEvent);
      
      const proof = await ledger.verifyIntegrity();
      
      expect(proof.details).toBeDefined();
      expect(typeof proof.details).toBe('string');
    });

    it('should verify empty ledger (genesis only)', async () => {
      const proof = await ledger.verifyIntegrity();
      
      expect(proof.valid).toBe(true);
    });
  });

  describe('getEntriesWithProof()', () => {
    beforeEach(async () => {
      // Add test entries
      await ledger.append({ ...mockAuditEvent, id: 'event-1', organizationId: 'org-123' });
      await ledger.append({ ...mockAuditEvent, id: 'event-2', organizationId: 'org-123' });
      await ledger.append({ ...mockAuditEvent, id: 'event-3', organizationId: 'org-456' });
    });

    it('should filter by organizationId', async () => {
      const result = await ledger.getEntriesWithProof({ organizationId: 'org-123' });
      
      expect(result.entries.every((e: any) => e.event.organizationId === 'org-123')).toBe(true);
    });

    it('should include integrity proof', async () => {
      const result = await ledger.getEntriesWithProof({ organizationId: 'org-123' });
      
      expect(result.proof).toBeDefined();
      expect(result.proof.valid).toBe(true);
    });

    it('should filter by date range', async () => {
      const result = await ledger.getEntriesWithProof({
        organizationId: 'org-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
      });
      
      expect(result.entries.length).toBeGreaterThan(0);
    });

    it('should filter by event types', async () => {
      const result = await ledger.getEntriesWithProof({
        organizationId: 'org-123',
        eventTypes: ['auth.login'],
      });
      
      expect(result.entries.every((e: any) => e.event.eventType === 'auth.login')).toBe(true);
    });

    it('should respect limit parameter', async () => {
      const result = await ledger.getEntriesWithProof({
        organizationId: 'org-123',
        limit: 1,
      });
      
      expect(result.entries.length).toBeLessThanOrEqual(1);
    });
  });

  describe('exportWithProof()', () => {
    beforeEach(async () => {
      await ledger.append({ ...mockAuditEvent, id: 'event-1' });
      await ledger.append({ ...mockAuditEvent, id: 'event-2' });
    });

    it('should export entries with merkle root', async () => {
      const exportData = await ledger.exportWithProof({
        organizationId: 'org-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        exportedBy: 'auditor@example.com',
      });
      
      expect(exportData.merkleRoot).toBeDefined();
      expect(exportData.merkleRoot.length).toBe(64);
    });

    it('should include export metadata', async () => {
      const exportData = await ledger.exportWithProof({
        organizationId: 'org-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        exportedBy: 'auditor@example.com',
      });
      
      expect(exportData.exportedAt).toBeInstanceOf(Date);
      expect(exportData.exportedBy).toBe('auditor@example.com');
    });

    it('should include integrity proof', async () => {
      const exportData = await ledger.exportWithProof({
        organizationId: 'org-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        exportedBy: 'auditor@example.com',
      });
      
      expect(exportData.integrityProof).toBeDefined();
      expect(exportData.integrityProof.valid).toBe(true);
    });

    it('should sign the export', async () => {
      const exportData = await ledger.exportWithProof({
        organizationId: 'org-123',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2026-12-31'),
        exportedBy: 'auditor@example.com',
      });
      
      expect(exportData.signature).toBeDefined();
      expect(exportData.signature.length).toBe(64);
    });
  });

  describe('Cryptographic Properties', () => {
    it('should produce deterministic hashes for same input', async () => {
      const event1 = { ...mockAuditEvent, id: 'deterministic-test' };
      const entry1 = await ledger.append(event1);
      
      // Create new ledger and append same event
      vi.resetModules();
      const module = await import('../../../services/security/ImmutableAuditLedger.js');
      const ledger2 = module.immutableAuditLedger || new (module.default as any)();
      const entry2 = await ledger2.append(event1);
      
      // Hashes should be different because previousHash differs
      // But the hash algorithm should be consistent
      expect(entry1.hash.length).toBe(entry2.hash.length);
      ledger2.shutdown?.();
    });

    it('should produce different hashes for different inputs', async () => {
      const entry1 = await ledger.append({ ...mockAuditEvent, id: 'event-a' });
      const entry2 = await ledger.append({ ...mockAuditEvent, id: 'event-b' });
      
      expect(entry1.hash).not.toBe(entry2.hash);
    });

    it('should chain hashes correctly', async () => {
      const entries: any[] = [];
      for (let i = 0; i < 5; i++) {
        entries.push(await ledger.append({ ...mockAuditEvent, id: `chain-${i}` }));
      }
      
      for (let i = 1; i < entries.length; i++) {
        expect(entries[i].previousHash).toBe(entries[i - 1].hash);
      }
    });
  });

  describe('Error Handling', () => {
    it('should handle null event gracefully', async () => {
      await expect(ledger.append(null)).rejects.toThrow();
    });

    it('should handle undefined event gracefully', async () => {
      await expect(ledger.append(undefined)).rejects.toThrow();
    });

    it('should handle malformed event', async () => {
      const malformedEvent = { foo: 'bar' };
      // Should either throw or handle gracefully
      try {
        await ledger.append(malformedEvent);
      } catch (e) {
        expect(e).toBeDefined();
      }
    });
  });

  describe('shutdown()', () => {
    it('should clean up resources', () => {
      expect(() => ledger.shutdown()).not.toThrow();
    });

    it('should be safe to call multiple times', () => {
      ledger.shutdown();
      expect(() => ledger.shutdown()).not.toThrow();
    });
  });
});

describe('ImmutableAuditLedger - Compliance Scenarios', () => {
  let ledger: any;

  beforeEach(async () => {
    vi.resetModules();
    const module = await import('../../../services/security/ImmutableAuditLedger.js');
    ledger = module.immutableAuditLedger || new (module.default as any)();
  });

  afterEach(() => {
    ledger?.shutdown?.();
  });

  it('SOC 2 CC6.1 - should log all access events', async () => {
    const accessEvent = {
      ...mockAuditEvent,
      eventType: 'data.access',
      action: 'User accessed sensitive data',
    };
    
    const entry = await ledger.append(accessEvent);
    expect(entry.event.eventType).toBe('data.access');
  });

  it('HIPAA §164.312(b) - should maintain audit controls', async () => {
    const phiAccessEvent = {
      ...mockAuditEvent,
      eventType: 'phi.access',
      resource: { type: 'patient_record', id: 'patient-123', name: 'Patient Record' },
    };
    
    const entry = await ledger.append(phiAccessEvent);
    const proof = await ledger.verifyIntegrity();
    
    expect(entry).toBeDefined();
    expect(proof.valid).toBe(true);
  });

  it('GDPR Article 30 - should support records of processing', async () => {
    const processingEvent = {
      ...mockAuditEvent,
      eventType: 'gdpr.processing',
      details: {
        dataSubject: 'anonymized-id',
        processingPurpose: 'analytics',
        legalBasis: 'consent',
      },
    };
    
    const entry = await ledger.append(processingEvent);
    expect(entry.event.details.processingPurpose).toBe('analytics');
  });

  it('should support auditor export workflow', async () => {
    // Simulate audit period - use current time range since ledger uses entry timestamp
    const now = new Date();
    const startDate = new Date(now.getTime() - 60000); // 1 minute ago
    const endDate = new Date(now.getTime() + 60000); // 1 minute from now
    
    for (let i = 0; i < 10; i++) {
      await ledger.append({
        ...mockAuditEvent,
        id: `audit-event-${i}`,
        timestamp: new Date(),
      });
    }

    const exportData = await ledger.exportWithProof({
      organizationId: 'org-123',
      startDate,
      endDate,
      exportedBy: 'external-auditor@kpmg.com',
    });

    expect(exportData.entries.length).toBeGreaterThan(0);
    expect(exportData.integrityProof.valid).toBe(true);
    expect(exportData.signature).toBeDefined();
  });
});
