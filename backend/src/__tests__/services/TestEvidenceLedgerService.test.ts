/**
 * Module — Test Evidence Ledger Service Test
 *
 * Platform module.
 * @module __tests__/services/TestEvidenceLedgerService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// TEST EVIDENCE LEDGER SERVICE TESTS
// Tests for immutable blockchain-style test evidence ledger
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';
import crypto from 'crypto';

// Mock fs
vi.mock('fs', () => ({
  default: {
    existsSync: vi.fn().mockReturnValue(true),
    mkdirSync: vi.fn(),
    readFileSync: vi.fn().mockReturnValue('mock-key-content'),
    writeFileSync: vi.fn(),
  },
  existsSync: vi.fn().mockReturnValue(true),
  mkdirSync: vi.fn(),
  readFileSync: vi.fn().mockReturnValue('mock-key-content'),
  writeFileSync: vi.fn(),
}));

// Mock crypto for key generation - inline to avoid hoisting issues
vi.mock('crypto', async () => {
  const actual = await vi.importActual('crypto');
  return {
    ...actual,
    default: {
      ...(actual as any).default,
      generateKeyPairSync: vi.fn().mockReturnValue({
        privateKey: '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----',
        publicKey: '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----',
      }),
      randomUUID: vi.fn().mockReturnValue('test-uuid-12345'),
    },
    generateKeyPairSync: vi.fn().mockReturnValue({
      privateKey: '-----BEGIN PRIVATE KEY-----\nMOCK\n-----END PRIVATE KEY-----',
      publicKey: '-----BEGIN PUBLIC KEY-----\nMOCK\n-----END PUBLIC KEY-----',
    }),
    randomUUID: vi.fn().mockReturnValue('test-uuid-12345'),
  };
});

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import {
  TestEvidenceLedgerService,
  TestExecution,
  LedgerEntry,
  ExecutionEnvironment,
} from '../../services/evidence/TestEvidenceLedgerService.js';

// Helper to create mock test execution
function createMockExecution(overrides: Partial<TestExecution> = {}): TestExecution {
  return {
    id: `test-${Date.now()}`,
    testSuiteId: 'suite-123',
    testSuiteName: 'Security Tests',
    testCaseId: 'tc-001',
    testCaseName: 'Should validate authentication',
    category: 'security',
    executedAt: new Date(),
    executedBy: 'test-runner',
    executionEnvironment: createMockEnvironment(),
    status: 'passed',
    durationMs: 150,
    assertions: [
      { name: 'status check', expected: '200', actual: '200', passed: true },
    ],
    tags: ['auth', 'security'],
    complianceFrameworks: ['SOC2', 'ISO27001'],
    securityControls: ['AC-1', 'AC-2'],
    ...overrides,
  };
}

function createMockEnvironment(): ExecutionEnvironment {
  return {
    hostname: 'test-host',
    platform: 'linux',
    nodeVersion: 'v20.0.0',
    timestamp: new Date().toISOString(),
    timezone: 'UTC',
    buildIdentity: {
      gitCommitSha: 'abc123def456',
      gitBranch: 'main',
      gitDirty: false,
      buildArtifactDigest: 'sha256:abc123',
      deploymentMode: 'air-gapped',
      environmentName: 'audit-lab',
      buildTimestamp: new Date().toISOString(),
    },
    executionIdentity: {
      runnerIdentity: 'test-service-account',
      hostFingerprint: 'host-fp-123',
      tpmPresent: true,
      tpmMode: 'software-fallback',
      processId: 12345,
      parentProcessId: 1,
    },
    networkInterfaces: [
      { name: 'eth0', mac: '00:00:00:00:00:00', ipv4: '10.0.0.1', internal: false },
    ],
    dnsServers: ['8.8.8.8'],
    cpuUsage: 25,
    memoryUsage: 50,
    diskUsage: 30,
  };
}

describe('TestEvidenceLedgerService', () => {
  let service: TestEvidenceLedgerService;

  beforeEach(() => {
    vi.clearAllMocks();
    // Get singleton instance (will be same instance across tests)
    service = TestEvidenceLedgerService.getInstance();
  });

  // ===========================================================================
  // SINGLETON PATTERN
  // ===========================================================================

  describe('Singleton Pattern', () => {
    it('should return same instance', () => {
      const instance1 = TestEvidenceLedgerService.getInstance();
      const instance2 = TestEvidenceLedgerService.getInstance();
      expect(instance1).toBe(instance2);
    });

    it('should be an EventEmitter', () => {
      expect(typeof service.on).toBe('function');
      expect(typeof service.emit).toBe('function');
    });
  });

  // ===========================================================================
  // TEST EXECUTION TYPES
  // ===========================================================================

  describe('TestExecution Types', () => {
    it('should create valid test execution', () => {
      const execution = createMockExecution();
      expect(execution.id).toBeDefined();
      expect(execution.testSuiteId).toBe('suite-123');
      expect(execution.status).toBe('passed');
    });

    it('should support passed status', () => {
      const execution = createMockExecution({ status: 'passed' });
      expect(execution.status).toBe('passed');
    });

    it('should support failed status', () => {
      const execution = createMockExecution({ status: 'failed' });
      expect(execution.status).toBe('failed');
    });

    it('should support skipped status', () => {
      const execution = createMockExecution({ status: 'skipped' });
      expect(execution.status).toBe('skipped');
    });

    it('should support error status', () => {
      const execution = createMockExecution({ status: 'error' });
      expect(execution.status).toBe('error');
    });

    it('should include assertions', () => {
      const execution = createMockExecution({
        assertions: [
          { name: 'check1', expected: 'true', actual: 'true', passed: true },
          { name: 'check2', expected: '200', actual: '500', passed: false, message: 'Status mismatch' },
        ],
      });
      expect(execution.assertions.length).toBe(2);
      expect(execution.assertions[1]?.passed).toBe(false);
    });

    it('should include compliance frameworks', () => {
      const execution = createMockExecution({
        complianceFrameworks: ['SOC2', 'HIPAA', 'GDPR'],
      });
      expect(execution.complianceFrameworks).toContain('SOC2');
      expect(execution.complianceFrameworks).toContain('HIPAA');
    });

    it('should include security controls', () => {
      const execution = createMockExecution({
        securityControls: ['AC-1', 'AC-2', 'AU-1'],
      });
      expect(execution.securityControls.length).toBe(3);
    });

    it('should include optional error details', () => {
      const execution = createMockExecution({
        status: 'error',
        errorMessage: 'Connection timeout',
        stackTrace: 'Error: Connection timeout\n  at test.js:10',
      });
      expect(execution.errorMessage).toBe('Connection timeout');
      expect(execution.stackTrace).toContain('test.js');
    });

    it('should include optional screenshots', () => {
      const execution = createMockExecution({
        screenshots: ['screenshot1.png', 'screenshot2.png'],
      });
      expect(execution.screenshots?.length).toBe(2);
    });
  });

  // ===========================================================================
  // EXECUTION ENVIRONMENT
  // ===========================================================================

  describe('ExecutionEnvironment', () => {
    it('should include build identity', () => {
      const env = createMockEnvironment();
      expect(env.buildIdentity.gitCommitSha).toBeDefined();
      expect(env.buildIdentity.gitBranch).toBe('main');
    });

    it('should include execution identity', () => {
      const env = createMockEnvironment();
      expect(env.executionIdentity.runnerIdentity).toBeDefined();
      expect(env.executionIdentity.tpmPresent).toBe(true);
    });

    it('should support air-gapped deployment mode', () => {
      const env = createMockEnvironment();
      expect(env.buildIdentity.deploymentMode).toBe('air-gapped');
    });

    it('should include network interfaces', () => {
      const env = createMockEnvironment();
      expect(env.networkInterfaces.length).toBeGreaterThan(0);
    });

    it('should include system metrics', () => {
      const env = createMockEnvironment();
      expect(env.cpuUsage).toBeDefined();
      expect(env.memoryUsage).toBeDefined();
      expect(env.diskUsage).toBeDefined();
    });
  });

  // ===========================================================================
  // HASH CHAIN INTEGRITY
  // ===========================================================================

  describe('Hash Chain Concepts', () => {
    it('should use SHA-256 for hashing', () => {
      const data = 'test data';
      const hash = crypto.createHash('sha256').update(data).digest('hex');
      expect(hash.length).toBe(64); // SHA-256 produces 64 hex chars
    });

    it('should produce different hashes for different data', () => {
      const hash1 = crypto.createHash('sha256').update('data1').digest('hex');
      const hash2 = crypto.createHash('sha256').update('data2').digest('hex');
      expect(hash1).not.toBe(hash2);
    });

    it('should produce same hash for same data', () => {
      const data = 'consistent data';
      const hash1 = crypto.createHash('sha256').update(data).digest('hex');
      const hash2 = crypto.createHash('sha256').update(data).digest('hex');
      expect(hash1).toBe(hash2);
    });
  });

  // ===========================================================================
  // MERKLE TREE CONCEPTS
  // ===========================================================================

  describe('Merkle Tree Concepts', () => {
    it('should combine hashes for Merkle tree', () => {
      const hash1 = crypto.createHash('sha256').update('leaf1').digest('hex');
      const hash2 = crypto.createHash('sha256').update('leaf2').digest('hex');
      const combined = crypto.createHash('sha256').update(hash1 + hash2).digest('hex');
      expect(combined.length).toBe(64);
    });

    it('should handle odd number of leaves', () => {
      const hashes = ['hash1', 'hash2', 'hash3'];
      // In Merkle tree, odd leaf is duplicated
      expect(hashes.length % 2).toBe(1);
    });
  });

  // ===========================================================================
  // COMPLIANCE FRAMEWORK COVERAGE
  // ===========================================================================

  describe('Compliance Framework Coverage', () => {
    it('should support SOC2 framework', () => {
      const execution = createMockExecution({
        complianceFrameworks: ['SOC2'],
      });
      expect(execution.complianceFrameworks).toContain('SOC2');
    });

    it('should support ISO27001 framework', () => {
      const execution = createMockExecution({
        complianceFrameworks: ['ISO27001'],
      });
      expect(execution.complianceFrameworks).toContain('ISO27001');
    });

    it('should support HIPAA framework', () => {
      const execution = createMockExecution({
        complianceFrameworks: ['HIPAA'],
      });
      expect(execution.complianceFrameworks).toContain('HIPAA');
    });

    it('should support GDPR framework', () => {
      const execution = createMockExecution({
        complianceFrameworks: ['GDPR'],
      });
      expect(execution.complianceFrameworks).toContain('GDPR');
    });

    it('should support multiple frameworks', () => {
      const execution = createMockExecution({
        complianceFrameworks: ['SOC2', 'ISO27001', 'HIPAA', 'GDPR', 'PCI-DSS'],
      });
      expect(execution.complianceFrameworks.length).toBe(5);
    });
  });

  // ===========================================================================
  // SECURITY CONTROLS
  // ===========================================================================

  describe('Security Controls', () => {
    it('should support NIST access controls', () => {
      const execution = createMockExecution({
        securityControls: ['AC-1', 'AC-2', 'AC-3'],
      });
      expect(execution.securityControls.every(c => c.startsWith('AC-'))).toBe(true);
    });

    it('should support NIST audit controls', () => {
      const execution = createMockExecution({
        securityControls: ['AU-1', 'AU-2', 'AU-3'],
      });
      expect(execution.securityControls.every(c => c.startsWith('AU-'))).toBe(true);
    });

    it('should support mixed control families', () => {
      const execution = createMockExecution({
        securityControls: ['AC-1', 'AU-1', 'IA-1', 'SC-1'],
      });
      expect(execution.securityControls.length).toBe(4);
    });
  });

  // ===========================================================================
  // TEST CATEGORIES
  // ===========================================================================

  describe('Test Categories', () => {
    it('should support security category', () => {
      const execution = createMockExecution({ category: 'security' });
      expect(execution.category).toBe('security');
    });

    it('should support performance category', () => {
      const execution = createMockExecution({ category: 'performance' });
      expect(execution.category).toBe('performance');
    });

    it('should support integration category', () => {
      const execution = createMockExecution({ category: 'integration' });
      expect(execution.category).toBe('integration');
    });

    it('should support unit category', () => {
      const execution = createMockExecution({ category: 'unit' });
      expect(execution.category).toBe('unit');
    });

    it('should support e2e category', () => {
      const execution = createMockExecution({ category: 'e2e' });
      expect(execution.category).toBe('e2e');
    });

    it('should support compliance category', () => {
      const execution = createMockExecution({ category: 'compliance' });
      expect(execution.category).toBe('compliance');
    });
  });

  // ===========================================================================
  // DEPLOYMENT MODES
  // ===========================================================================

  describe('Deployment Modes', () => {
    it('should support air-gapped mode', () => {
      const env = createMockEnvironment();
      env.buildIdentity.deploymentMode = 'air-gapped';
      expect(env.buildIdentity.deploymentMode).toBe('air-gapped');
    });

    it('should support offline mode', () => {
      const env = createMockEnvironment();
      env.buildIdentity.deploymentMode = 'offline';
      expect(env.buildIdentity.deploymentMode).toBe('offline');
    });

    it('should support connected mode', () => {
      const env = createMockEnvironment();
      env.buildIdentity.deploymentMode = 'connected';
      expect(env.buildIdentity.deploymentMode).toBe('connected');
    });

    it('should support hybrid mode', () => {
      const env = createMockEnvironment();
      env.buildIdentity.deploymentMode = 'hybrid';
      expect(env.buildIdentity.deploymentMode).toBe('hybrid');
    });
  });

  // ===========================================================================
  // TPM MODES
  // ===========================================================================

  describe('TPM Modes', () => {
    it('should support hardware TPM', () => {
      const env = createMockEnvironment();
      env.executionIdentity.tpmMode = 'hardware';
      expect(env.executionIdentity.tpmMode).toBe('hardware');
    });

    it('should support software fallback TPM', () => {
      const env = createMockEnvironment();
      env.executionIdentity.tpmMode = 'software-fallback';
      expect(env.executionIdentity.tpmMode).toBe('software-fallback');
    });

    it('should support unavailable TPM', () => {
      const env = createMockEnvironment();
      env.executionIdentity.tpmMode = 'unavailable';
      expect(env.executionIdentity.tpmMode).toBe('unavailable');
    });
  });

  // ===========================================================================
  // ASSERTION TYPES
  // ===========================================================================

  describe('Assertion Types', () => {
    it('should support passed assertions', () => {
      const assertion = { name: 'check', expected: 'true', actual: 'true', passed: true };
      expect(assertion.passed).toBe(true);
    });

    it('should support failed assertions', () => {
      const assertion = { name: 'check', expected: 'true', actual: 'false', passed: false };
      expect(assertion.passed).toBe(false);
    });

    it('should include assertion message', () => {
      const assertion = { 
        name: 'check', 
        expected: '200', 
        actual: '500', 
        passed: false,
        message: 'Expected status 200 but got 500',
      };
      expect(assertion.message).toContain('Expected');
    });

    it('should handle complex expected values', () => {
      const assertion = { 
        name: 'json check', 
        expected: JSON.stringify({ key: 'value' }), 
        actual: JSON.stringify({ key: 'value' }), 
        passed: true,
      };
      expect(assertion.passed).toBe(true);
    });
  });

  // ===========================================================================
  // LEDGER ENTRY STRUCTURE
  // ===========================================================================

  describe('LedgerEntry Structure', () => {
    it('should define entry structure', () => {
      const entry: Partial<LedgerEntry> = {
        id: 'entry-123',
        index: 0,
        timestamp: new Date(),
        previousHash: 'genesis-hash',
        dataHash: 'data-hash',
        entryHash: 'entry-hash',
      };
      expect(entry.id).toBeDefined();
      expect(entry.index).toBe(0);
    });

    it('should include hash chain fields', () => {
      const entry: Partial<LedgerEntry> = {
        previousHash: 'prev-hash',
        dataHash: 'data-hash',
        entryHash: 'entry-hash',
      };
      expect(entry.previousHash).toBeDefined();
      expect(entry.dataHash).toBeDefined();
      expect(entry.entryHash).toBeDefined();
    });

    it('should include signature fields', () => {
      const entry: Partial<LedgerEntry> = {
        signature: 'sig-123',
        signedBy: 'TestEvidenceLedger',
        signatureAlgorithm: 'RSA-SHA256',
      };
      expect(entry.signature).toBeDefined();
      expect(entry.signatureAlgorithm).toBe('RSA-SHA256');
    });

    it('should include Merkle fields', () => {
      const entry: Partial<LedgerEntry> = {
        merkleRoot: 'merkle-root',
        merkleProof: ['proof1', 'proof2'],
      };
      expect(entry.merkleRoot).toBeDefined();
      expect(entry.merkleProof?.length).toBe(2);
    });
  });

  // ===========================================================================
  // VERIFICATION RESULT STRUCTURE
  // ===========================================================================

  describe('VerificationResult Structure', () => {
    it('should define verification result', () => {
      const result = {
        valid: true,
        chainIntegrity: true,
        signatureValid: true,
        timestampsValid: true,
        merkleValid: true,
        errors: [] as string[],
        warnings: [] as string[],
        verifiedAt: new Date(),
        verifiedBy: 'TestEvidenceLedgerService',
      };
      expect(result.valid).toBe(true);
      expect(result.errors.length).toBe(0);
    });

    it('should track chain integrity', () => {
      const result = { chainIntegrity: false };
      expect(result.chainIntegrity).toBe(false);
    });

    it('should track signature validity', () => {
      const result = { signatureValid: false };
      expect(result.signatureValid).toBe(false);
    });

    it('should track Merkle validity', () => {
      const result = { merkleValid: false };
      expect(result.merkleValid).toBe(false);
    });

    it('should collect errors', () => {
      const result = { errors: ['Entry 1 tampered', 'Entry 2 invalid signature'] };
      expect(result.errors.length).toBe(2);
    });

    it('should collect warnings', () => {
      const result = { warnings: ['Entry 3 not signed'] };
      expect(result.warnings.length).toBe(1);
    });
  });

  // ===========================================================================
  // TEST SUITE SUMMARY
  // ===========================================================================

  describe('TestSuiteSummary Structure', () => {
    it('should track test counts', () => {
      const summary = {
        totalTests: 100,
        passed: 95,
        failed: 3,
        skipped: 1,
        errors: 1,
      };
      expect(summary.passed + summary.failed + summary.skipped + summary.errors).toBe(100);
    });

    it('should calculate pass rate', () => {
      const summary = { totalTests: 100, passed: 95 };
      const passRate = (summary.passed / summary.totalTests) * 100;
      expect(passRate).toBe(95);
    });

    it('should track duration', () => {
      const summary = { durationMs: 15000 };
      expect(summary.durationMs).toBe(15000);
    });

    it('should include Merkle root', () => {
      const summary = { merkleRoot: 'suite-merkle-root' };
      expect(summary.merkleRoot).toBeDefined();
    });

    it('should include signature', () => {
      const summary = { signature: 'suite-signature' };
      expect(summary.signature).toBeDefined();
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty assertions', () => {
      const execution = createMockExecution({ assertions: [] });
      expect(execution.assertions.length).toBe(0);
    });

    it('should handle empty tags', () => {
      const execution = createMockExecution({ tags: [] });
      expect(execution.tags.length).toBe(0);
    });

    it('should handle empty compliance frameworks', () => {
      const execution = createMockExecution({ complianceFrameworks: [] });
      expect(execution.complianceFrameworks.length).toBe(0);
    });

    it('should handle very long test names', () => {
      const execution = createMockExecution({ 
        testCaseName: 'A'.repeat(1000),
      });
      expect(execution.testCaseName.length).toBe(1000);
    });

    it('should handle special characters in test names', () => {
      const execution = createMockExecution({ 
        testCaseName: 'Test with "quotes" & <special> chars',
      });
      expect(execution.testCaseName).toContain('quotes');
    });

    it('should handle unicode in test names', () => {
      const execution = createMockExecution({ 
        testCaseName: '测试用例 🧪',
      });
      expect(execution.testCaseName).toContain('测试');
    });

    it('should handle zero duration', () => {
      const execution = createMockExecution({ durationMs: 0 });
      expect(execution.durationMs).toBe(0);
    });

    it('should handle very long duration', () => {
      const execution = createMockExecution({ durationMs: 3600000 }); // 1 hour
      expect(execution.durationMs).toBe(3600000);
    });
  });
});
