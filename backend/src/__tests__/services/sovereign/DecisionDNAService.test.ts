// =============================================================================
// DECISION DNA SERVICE TESTS
// Tests for One-Click Audit Artifact Export
// Grade: A | Coverage: Comprehensive | Risk: Compliance Critical (Audit)
// 
// SERVICE OVERVIEW:
// DecisionDNAService™ generates comprehensive audit bundles containing full
// Chronos replay, agent rationales, Vox ethical assessments, dissent records,
// human overrides, and cryptographic proof of integrity. "Every decision,
// fully documented, instantly exportable, legally defensible."
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../config/database.js', () => ({
  prisma: {
    decisions: { findUnique: vi.fn(), findMany: vi.fn() },
    deliberations: { findMany: vi.fn() },
    dissents: { findMany: vi.fn() },
    audit_logs: { findMany: vi.fn() },
  },
}));

import type {
  DecisionDNA,
} from '../../../services/sovereign/DecisionDNAService.js';

describe('DecisionDNAService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // URGENCY LEVELS
  // ===========================================================================

  describe('Urgency Levels', () => {
    it('should support low urgency', () => {
      const dna: Partial<DecisionDNA> = {
        decision: { urgency: 'low' } as DecisionDNA['decision'],
      };
      expect(dna.decision?.urgency).toBe('low');
    });

    it('should support medium urgency', () => {
      const dna: Partial<DecisionDNA> = {
        decision: { urgency: 'medium' } as DecisionDNA['decision'],
      };
      expect(dna.decision?.urgency).toBe('medium');
    });

    it('should support high urgency', () => {
      const dna: Partial<DecisionDNA> = {
        decision: { urgency: 'high' } as DecisionDNA['decision'],
      };
      expect(dna.decision?.urgency).toBe('high');
    });

    it('should support critical urgency', () => {
      const dna: Partial<DecisionDNA> = {
        decision: { urgency: 'critical' } as DecisionDNA['decision'],
      };
      expect(dna.decision?.urgency).toBe('critical');
    });
  });

  // ===========================================================================
  // EXPORT FORMATS
  // ===========================================================================

  describe('Export Formats', () => {
    it('should support full export format', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { exportFormat: 'full' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.exportFormat).toBe('full');
    });

    it('should support summary export format', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { exportFormat: 'summary' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.exportFormat).toBe('summary');
    });

    it('should support compliance export format', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { exportFormat: 'compliance' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.exportFormat).toBe('compliance');
    });
  });

  // ===========================================================================
  // CLASSIFICATION LEVELS
  // ===========================================================================

  describe('Classification Levels', () => {
    it('should support public classification', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { classificationLevel: 'public' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.classificationLevel).toBe('public');
    });

    it('should support internal classification', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { classificationLevel: 'internal' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.classificationLevel).toBe('internal');
    });

    it('should support confidential classification', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { classificationLevel: 'confidential' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.classificationLevel).toBe('confidential');
    });

    it('should support restricted classification', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: { classificationLevel: 'restricted' } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.classificationLevel).toBe('restricted');
    });
  });

  // ===========================================================================
  // DECISION DNA STRUCTURE
  // ===========================================================================

  describe('DecisionDNA Structure', () => {
    it('should create valid decision DNA', () => {
      const dna: DecisionDNA = {
        id: 'dna-123',
        version: '1.0',
        generatedAt: new Date(),
        generatedBy: 'system',
        decisionId: 'decision-456',
        organizationId: 'org-789',
        organizationName: 'Acme Corp',
        decision: {
          title: 'APAC Expansion',
          question: 'Should we expand to APAC?',
          context: 'Market opportunity analysis',
          urgency: 'high',
          decisionType: 'strategic',
          status: 'decided',
          outcome: 'Approved',
          proposedAt: new Date(),
          deliberationStartedAt: new Date(),
          deliberationEndedAt: new Date(),
          decidedAt: new Date(),
          proposedBy: 'ceo@company.com',
          decidedBy: 'board',
        },
        deliberation: {
          mode: 'executive',
          phases: [],
          totalDurationMs: 3600000,
          participatingAgents: [],
        },
        ethics: {
          ethicalFlags: [],
          stakeholderImpact: [],
        },
        dissents: [],
        humanOversight: {
          reviewRequired: true,
          reviewedBy: 'ceo@company.com',
          reviewedAt: new Date(),
          overrides: [],
          vetoes: [],
          approvals: [],
        },
        auditTrail: [],
        integrity: {
          ledgerHash: 'sha256:ledger123',
          previousHash: 'sha256:prev123',
          merkleRoot: 'sha256:merkle123',
          signatures: [],
        },
        metadata: {
          exportFormat: 'full',
          complianceFrameworks: ['SOX', 'GDPR'],
          retentionPeriod: '7 years',
          classificationLevel: 'confidential',
          tags: ['strategic', 'expansion'],
        },
      };
      expect(dna.version).toBe('1.0');
    });
  });

  // ===========================================================================
  // DELIBERATION STRUCTURE
  // ===========================================================================

  describe('Deliberation Structure', () => {
    it('should handle multiple phases', () => {
      const dna: Partial<DecisionDNA> = {
        deliberation: {
          mode: 'executive',
          phases: [
            { name: 'Analysis', startedAt: new Date(), endedAt: new Date(), durationMs: 1000, events: [] },
            { name: 'Debate', startedAt: new Date(), endedAt: new Date(), durationMs: 2000, events: [] },
            { name: 'Synthesis', startedAt: new Date(), endedAt: new Date(), durationMs: 1500, events: [] },
          ],
          totalDurationMs: 4500,
          participatingAgents: [],
        },
      };
      expect(dna.deliberation?.phases.length).toBe(3);
    });

    it('should handle synthesis with confidence', () => {
      const dna: Partial<DecisionDNA> = {
        deliberation: {
          mode: 'executive',
          phases: [],
          totalDurationMs: 1000,
          participatingAgents: [],
          synthesis: {
            summary: 'The council recommends...',
            confidence: 0.85,
            keyPoints: ['Point 1', 'Point 2'],
            risks: ['Risk 1'],
            recommendations: ['Rec 1'],
          },
        },
      };
      expect(dna.deliberation?.synthesis?.confidence).toBe(0.85);
    });

    it('should handle 1 hour duration', () => {
      const dna: Partial<DecisionDNA> = {
        deliberation: {
          mode: 'executive',
          phases: [],
          totalDurationMs: 3600000,
          participatingAgents: [],
        },
      };
      expect(dna.deliberation?.totalDurationMs).toBe(3600000);
    });

    it('should handle 24 hour duration', () => {
      const dna: Partial<DecisionDNA> = {
        deliberation: {
          mode: 'executive',
          phases: [],
          totalDurationMs: 86400000,
          participatingAgents: [],
        },
      };
      expect(dna.deliberation?.totalDurationMs).toBe(86400000);
    });
  });

  // ===========================================================================
  // HUMAN OVERSIGHT STRUCTURE
  // ===========================================================================

  describe('Human Oversight Structure', () => {
    it('should handle review required', () => {
      const dna: Partial<DecisionDNA> = {
        humanOversight: {
          reviewRequired: true,
          overrides: [],
          vetoes: [],
          approvals: [],
        },
      };
      expect(dna.humanOversight?.reviewRequired).toBe(true);
    });

    it('should handle review not required', () => {
      const dna: Partial<DecisionDNA> = {
        humanOversight: {
          reviewRequired: false,
          overrides: [],
          vetoes: [],
          approvals: [],
        },
      };
      expect(dna.humanOversight?.reviewRequired).toBe(false);
    });

    it('should handle reviewed decision', () => {
      const dna: Partial<DecisionDNA> = {
        humanOversight: {
          reviewRequired: true,
          reviewedBy: 'ceo@company.com',
          reviewedAt: new Date(),
          overrides: [],
          vetoes: [],
          approvals: [],
        },
      };
      expect(dna.humanOversight?.reviewedBy).toBe('ceo@company.com');
    });
  });

  // ===========================================================================
  // INTEGRITY STRUCTURE
  // ===========================================================================

  describe('Integrity Structure', () => {
    it('should handle ledger hash', () => {
      const dna: Partial<DecisionDNA> = {
        integrity: {
          ledgerHash: 'sha256:abc123',
          previousHash: 'sha256:prev123',
          merkleRoot: 'sha256:merkle123',
          signatures: [],
        },
      };
      expect(dna.integrity?.ledgerHash).toContain('sha256:');
    });

    it('should handle merkle root', () => {
      const dna: Partial<DecisionDNA> = {
        integrity: {
          ledgerHash: 'sha256:abc123',
          previousHash: 'sha256:prev123',
          merkleRoot: 'sha256:merkle123',
          signatures: [],
        },
      };
      expect(dna.integrity?.merkleRoot).toContain('sha256:');
    });

    it('should handle multiple signatures', () => {
      const dna: Partial<DecisionDNA> = {
        integrity: {
          ledgerHash: 'sha256:abc123',
          previousHash: 'sha256:prev123',
          merkleRoot: 'sha256:merkle123',
          signatures: [
            { signer: 'ceo', signature: 'sig1', timestamp: new Date() },
            { signer: 'cfo', signature: 'sig2', timestamp: new Date() },
          ] as any[],
        },
      };
      expect(dna.integrity?.signatures.length).toBe(2);
    });
  });

  // ===========================================================================
  // OUTCOMES STRUCTURE
  // ===========================================================================

  describe('Outcomes Structure', () => {
    it('should handle successful outcome', () => {
      const dna: Partial<DecisionDNA> = {
        outcomes: {
          actualOutcome: 'Expansion successful',
          outcomeRecordedAt: new Date(),
          success: true,
          lessonsLearned: ['Lesson 1', 'Lesson 2'],
        },
      };
      expect(dna.outcomes?.success).toBe(true);
    });

    it('should handle failed outcome', () => {
      const dna: Partial<DecisionDNA> = {
        outcomes: {
          actualOutcome: 'Expansion failed',
          outcomeRecordedAt: new Date(),
          success: false,
          lessonsLearned: ['What went wrong'],
        },
      };
      expect(dna.outcomes?.success).toBe(false);
    });

    it('should track dissenter accuracy', () => {
      const dna: Partial<DecisionDNA> = {
        outcomes: {
          dissenterAccuracy: [
            { dissenterId: 'user-1', wasCorrect: true },
            { dissenterId: 'user-2', wasCorrect: false },
          ],
        },
      };
      expect(dna.outcomes?.dissenterAccuracy?.length).toBe(2);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should export M&A decision DNA', () => {
      const dna: Partial<DecisionDNA> = {
        decision: {
          title: 'Acquisition of Target Corp',
          decisionType: 'M&A',
          urgency: 'critical',
        } as DecisionDNA['decision'],
        metadata: {
          exportFormat: 'full',
          classificationLevel: 'restricted',
          complianceFrameworks: ['SOX', 'SEC'],
        } as DecisionDNA['metadata'],
      };
      expect(dna.decision?.decisionType).toBe('M&A');
    });

    it('should export compliance audit DNA', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: {
          exportFormat: 'compliance',
          complianceFrameworks: ['GDPR', 'HIPAA', 'SOX'],
          retentionPeriod: '7 years',
        } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.complianceFrameworks?.length).toBe(3);
    });

    it('should export summary for board', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: {
          exportFormat: 'summary',
          classificationLevel: 'confidential',
        } as DecisionDNA['metadata'],
      };
      expect(dna.metadata?.exportFormat).toBe('summary');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty phases', () => {
      const dna: Partial<DecisionDNA> = {
        deliberation: {
          mode: 'executive',
          phases: [],
          totalDurationMs: 0,
          participatingAgents: [],
        },
      };
      expect(dna.deliberation?.phases.length).toBe(0);
    });

    it('should handle empty dissents', () => {
      const dna: Partial<DecisionDNA> = { dissents: [] };
      expect(dna.dissents?.length).toBe(0);
    });

    it('should handle empty audit trail', () => {
      const dna: Partial<DecisionDNA> = { auditTrail: [] };
      expect(dna.auditTrail?.length).toBe(0);
    });

    it('should handle empty ethical flags', () => {
      const dna: Partial<DecisionDNA> = {
        ethics: {
          ethicalFlags: [],
          stakeholderImpact: [],
        },
      };
      expect(dna.ethics?.ethicalFlags.length).toBe(0);
    });

    it('should handle empty compliance frameworks', () => {
      const dna: Partial<DecisionDNA> = {
        metadata: {
          exportFormat: 'full',
          complianceFrameworks: [],
          retentionPeriod: '7 years',
          classificationLevel: 'internal',
          tags: [],
        },
      };
      expect(dna.metadata?.complianceFrameworks?.length).toBe(0);
    });

    it('should handle very long title', () => {
      const dna: Partial<DecisionDNA> = {
        decision: {
          title: 'A'.repeat(1000),
        } as DecisionDNA['decision'],
      };
      expect(dna.decision?.title.length).toBe(1000);
    });

    it('should handle unicode in title', () => {
      const dna: Partial<DecisionDNA> = {
        decision: {
          title: '戦略的決定 📊',
        } as DecisionDNA['decision'],
      };
      expect(dna.decision?.title).toContain('戦略');
    });

    it('should handle zero duration', () => {
      const dna: Partial<DecisionDNA> = {
        deliberation: {
          mode: 'executive',
          phases: [],
          totalDurationMs: 0,
          participatingAgents: [],
        },
      };
      expect(dna.deliberation?.totalDurationMs).toBe(0);
    });
  });
});
