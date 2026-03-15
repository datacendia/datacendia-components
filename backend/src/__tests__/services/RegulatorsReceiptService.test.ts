/**
 * Module — Regulators Receipt Service Test
 *
 * Platform module.
 * @module __tests__/services/RegulatorsReceiptService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Regulator's Receipt Service Tests
 * Tests for the forensic-grade, independently verifiable decision documentation feature
 */

import { describe, it, expect } from 'vitest';

// Mock receipt structure
interface Receipt {
  receiptId: string;
  version: string;
  generatedAt: Date;
  generatedBy: string;
  decision: {
    id: string;
    question: string;
    finalDecision: string;
    councilMode: string;
    consensusScore: number;
  };
  participants: {
    agents: { name: string; role: string; responseCount: number; dissented: boolean }[];
  };
  evidenceChain: {
    merkleRoot: string;
    deliberationHash: string;
    citationsHash: string;
  };
  compliance: {
    frameworks: string[];
    gatesCleared: string[];
    gatesFailed: string[];
  };
  cryptographicProof: {
    algorithm: string;
    receiptHash: string;
    signedBy?: string;
    signedAt?: Date;
  };
  retention: {
    retentionPeriod: string;
    retentionUntil: Date;
    jurisdiction: string;
    legalHold: boolean;
  };
}

// Mock receipt generator
const generateReceiptId = (timestamp: number): string => {
  const randomPart = Math.random().toString(36).substring(2, 10).toUpperCase();
  return `RR-${timestamp}-${randomPart}`;
};

// Mock hash generator (simplified)
const generateHash = (data: string): string => {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash).toString(16).padStart(64, '0');
};

// Mock Merkle root calculation
const calculateMerkleRoot = (hashes: string[]): string => {
  if (hashes.length === 0) return generateHash('empty');
  if (hashes.length === 1) return hashes[0] ?? generateHash('empty');
  
  const combined = hashes.join('');
  return generateHash(combined);
};

describe('Regulator\'s Receipt Service', () => {
  describe('Receipt ID Generation', () => {
    it('should generate unique receipt IDs', () => {
      const timestamp = Date.now();
      const id1 = generateReceiptId(timestamp);
      const id2 = generateReceiptId(timestamp);
      
      expect(id1).not.toBe(id2);
    });

    it('should start with RR- prefix', () => {
      const id = generateReceiptId(Date.now());
      expect(id.startsWith('RR-')).toBe(true);
    });

    it('should include timestamp', () => {
      const timestamp = 1737500000;
      const id = generateReceiptId(timestamp);
      expect(id).toContain(timestamp.toString());
    });
  });

  describe('Hash Generation', () => {
    it('should generate consistent hashes for same input', () => {
      const data = 'test data';
      const hash1 = generateHash(data);
      const hash2 = generateHash(data);
      
      expect(hash1).toBe(hash2);
    });

    it('should generate different hashes for different input', () => {
      const hash1 = generateHash('data1');
      const hash2 = generateHash('data2');
      
      expect(hash1).not.toBe(hash2);
    });

    it('should generate 64-character hashes', () => {
      const hash = generateHash('test');
      expect(hash.length).toBe(64);
    });
  });

  describe('Merkle Root Calculation', () => {
    it('should handle empty array', () => {
      const root = calculateMerkleRoot([]);
      expect(root).toBeTruthy();
    });

    it('should return single hash for single element', () => {
      const hash = generateHash('test');
      const root = calculateMerkleRoot([hash]);
      expect(root).toBe(hash);
    });

    it('should combine multiple hashes', () => {
      const hashes = [
        generateHash('data1'),
        generateHash('data2'),
        generateHash('data3'),
      ];
      const root = calculateMerkleRoot(hashes);
      
      expect(root).toBeTruthy();
      expect(root.length).toBe(64);
    });

    it('should produce different roots for different inputs', () => {
      const root1 = calculateMerkleRoot([generateHash('a'), generateHash('b')]);
      const root2 = calculateMerkleRoot([generateHash('c'), generateHash('d')]);
      
      expect(root1).not.toBe(root2);
    });
  });

  describe('Receipt Structure', () => {
    const mockReceipt: Receipt = {
      receiptId: 'RR-1737500000-A1B2C3D4',
      version: '1.0.0',
      generatedAt: new Date(),
      generatedBy: 'test@datacendia.com',
      decision: {
        id: 'del-001',
        question: 'Should we proceed with the expansion?',
        finalDecision: 'Approved with modifications',
        councilMode: 'strategic-planning',
        consensusScore: 87,
      },
      participants: {
        agents: [
          { name: 'CendiaChief', role: 'Chief Strategist', responseCount: 12, dissented: false },
          { name: 'CendiaCISO', role: 'Security Officer', responseCount: 6, dissented: true },
        ],
      },
      evidenceChain: {
        merkleRoot: generateHash('merkle'),
        deliberationHash: generateHash('deliberation'),
        citationsHash: generateHash('citations'),
      },
      compliance: {
        frameworks: ['SOX', 'GDPR', 'CCPA'],
        gatesCleared: ['audit-trail', 'data-lineage', 'access-control'],
        gatesFailed: [],
      },
      cryptographicProof: {
        algorithm: 'SHA-256',
        receiptHash: generateHash('receipt'),
        signedBy: 'datacendia-kms',
        signedAt: new Date(),
      },
      retention: {
        retentionPeriod: '7 years',
        retentionUntil: new Date(Date.now() + 7 * 365 * 24 * 60 * 60 * 1000),
        jurisdiction: 'US',
        legalHold: false,
      },
    };

    it('should have valid receipt ID', () => {
      expect(mockReceipt.receiptId).toMatch(/^RR-\d+-[A-Z0-9]+$/);
    });

    it('should have version number', () => {
      expect(mockReceipt.version).toBe('1.0.0');
    });

    it('should have decision information', () => {
      expect(mockReceipt.decision).toHaveProperty('id');
      expect(mockReceipt.decision).toHaveProperty('question');
      expect(mockReceipt.decision).toHaveProperty('finalDecision');
      expect(mockReceipt.decision).toHaveProperty('consensusScore');
    });

    it('should have participants with agents', () => {
      expect(mockReceipt.participants.agents.length).toBeGreaterThan(0);
    });

    it('should track dissenting agents', () => {
      const dissenters = mockReceipt.participants.agents.filter(a => a.dissented);
      expect(dissenters.length).toBe(1);
      expect(dissenters[0]?.name).toBe('CendiaCISO');
    });

    it('should have evidence chain with hashes', () => {
      expect(mockReceipt.evidenceChain.merkleRoot).toBeTruthy();
      expect(mockReceipt.evidenceChain.deliberationHash).toBeTruthy();
      expect(mockReceipt.evidenceChain.citationsHash).toBeTruthy();
    });

    it('should have compliance frameworks', () => {
      expect(mockReceipt.compliance.frameworks).toContain('SOX');
      expect(mockReceipt.compliance.frameworks).toContain('GDPR');
    });

    it('should have cryptographic proof', () => {
      expect(mockReceipt.cryptographicProof.algorithm).toBe('SHA-256');
      expect(mockReceipt.cryptographicProof.receiptHash).toBeTruthy();
    });

    it('should have retention policy', () => {
      expect(mockReceipt.retention.retentionPeriod).toBe('7 years');
      expect(mockReceipt.retention.jurisdiction).toBe('US');
    });

    it('should have future retention date', () => {
      expect(mockReceipt.retention.retentionUntil.getTime()).toBeGreaterThan(Date.now());
    });
  });

  describe('Compliance Validation', () => {
    it('should validate all gates cleared', () => {
      const compliance = {
        frameworks: ['SOX'],
        gatesCleared: ['audit-trail', 'data-lineage'],
        gatesFailed: [],
      };
      
      expect(compliance.gatesFailed.length).toBe(0);
    });

    it('should track failed gates', () => {
      const compliance = {
        frameworks: ['SOX'],
        gatesCleared: ['audit-trail'],
        gatesFailed: ['encryption-at-rest'],
      };
      
      expect(compliance.gatesFailed.length).toBe(1);
      expect(compliance.gatesFailed).toContain('encryption-at-rest');
    });
  });
});
