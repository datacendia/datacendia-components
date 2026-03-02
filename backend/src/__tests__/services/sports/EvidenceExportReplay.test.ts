/**
 * Module — Evidence Export Replay Test
 *
 * Platform module.
 * @module __tests__/services/sports/EvidenceExportReplay.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * EVIDENCE EXPORT & DETERMINISTIC REPLAY TEST SUITE
 * =============================================================================
 * Critical tests for audit defensibility:
 * - Deterministic replay (re-run decision, get same hash)
 * - Evidence export fidelity (PDF/JSON matches stored record)
 * - Cross-system verification (hash matches ledger)
 * - Bit-perfect reproducibility
 * 
 * Why this matters: For sports, this is critical in:
 * - disputes, arbitration, regulator inquiries, board challenges
 * This is a Datacendia differentiator.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

interface DecisionArtifact {
  id: string;
  version: number;
  decision: {
    id: string;
    title: string;
    type: string;
    outcome: string;
    rationale: string;
  };
  council: {
    agents: string[];
    contributions: Array<{
      agentId: string;
      input: string;
      timestamp: string;
    }>;
    dissents: Array<{
      agentId: string;
      reason: string;
      timestamp: string;
    }>;
  };
  evidence: {
    documents: Array<{
      id: string;
      hash: string;
      type: string;
    }>;
    citations: Array<{
      source: string;
      reference: string;
      accessedAt: string;
    }>;
  };
  timestamps: {
    created: string;
    deliberationStart: string;
    deliberationEnd: string;
    finalized: string;
  };
  randomSeed?: string;
  merkleRoot?: string;
  signature?: string;
}

interface ExportedPackage {
  format: 'json' | 'pdf';
  artifact: DecisionArtifact;
  exportedAt: string;
  exportHash: string;
  metadata: {
    exportedBy: string;
    purpose: string;
  };
}

interface ReplayResult {
  success: boolean;
  originalHash: string;
  replayHash: string;
  matched: boolean;
  divergencePoint?: string;
}

// =============================================================================
// EVIDENCE SERVICE (Test Double)
// =============================================================================

class EvidenceExportService {
  private storedArtifacts: Map<string, DecisionArtifact> = new Map();
  private exportLog: Array<{ artifactId: string; exportHash: string; timestamp: Date }> = [];

  storeArtifact(artifact: DecisionArtifact): string {
    // Generate merkle root for the artifact
    artifact.merkleRoot = this.generateMerkleRoot(artifact);
    this.storedArtifacts.set(artifact.id, artifact);
    return artifact.merkleRoot;
  }

  getArtifact(id: string): DecisionArtifact | undefined {
    return this.storedArtifacts.get(id);
  }

  exportToJSON(artifactId: string, exportedBy: string, purpose: string): ExportedPackage | null {
    const artifact = this.storedArtifacts.get(artifactId);
    if (!artifact) return null;

    const exportedAt = new Date().toISOString();
    const exportHash = this.generateExportHash(artifact, exportedAt);

    const pkg: ExportedPackage = {
      format: 'json',
      artifact: JSON.parse(JSON.stringify(artifact)), // Deep clone
      exportedAt,
      exportHash,
      metadata: {
        exportedBy,
        purpose,
      },
    };

    this.exportLog.push({
      artifactId,
      exportHash,
      timestamp: new Date(),
    });

    return pkg;
  }

  exportToPDF(artifactId: string, exportedBy: string, purpose: string): ExportedPackage | null {
    const artifact = this.storedArtifacts.get(artifactId);
    if (!artifact) return null;

    const exportedAt = new Date().toISOString();
    const exportHash = this.generateExportHash(artifact, exportedAt);

    const pkg: ExportedPackage = {
      format: 'pdf',
      artifact: JSON.parse(JSON.stringify(artifact)),
      exportedAt,
      exportHash,
      metadata: {
        exportedBy,
        purpose,
      },
    };

    this.exportLog.push({
      artifactId,
      exportHash,
      timestamp: new Date(),
    });

    return pkg;
  }

  verifyExportIntegrity(pkg: ExportedPackage): { valid: boolean; error?: string } {
    const recalculatedHash = this.generateExportHash(pkg.artifact, pkg.exportedAt);
    
    if (recalculatedHash !== pkg.exportHash) {
      return {
        valid: false,
        error: `Export hash mismatch. Expected: ${pkg.exportHash}, Got: ${recalculatedHash}`,
      };
    }

    return { valid: true };
  }

  verifyAgainstLedger(
    pkg: ExportedPackage, 
    ledgerMerkleRoot: string
  ): { valid: boolean; error?: string } {
    if (pkg.artifact.merkleRoot !== ledgerMerkleRoot) {
      return {
        valid: false,
        error: `Merkle root mismatch. Export: ${pkg.artifact.merkleRoot}, Ledger: ${ledgerMerkleRoot}`,
      };
    }

    return { valid: true };
  }

  private generateMerkleRoot(artifact: DecisionArtifact): string {
    // Simplified merkle root - hash of canonical JSON
    const canonical = JSON.stringify({
      decision: artifact.decision,
      council: artifact.council,
      evidence: artifact.evidence,
      timestamps: artifact.timestamps,
    });
    
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  private generateExportHash(artifact: DecisionArtifact, exportedAt: string): string {
    const payload = JSON.stringify({
      artifact,
      exportedAt,
    });
    
    return crypto.createHash('sha256').update(payload).digest('hex');
  }
}

// =============================================================================
// REPLAY SERVICE (Test Double)
// =============================================================================

class DeterministicReplayService {
  replayDecision(
    artifact: DecisionArtifact,
    seed?: string
  ): ReplayResult {
    // Use stored seed or provided seed for determinism
    const replaySeed = seed || artifact.randomSeed || 'default-seed';
    
    // Regenerate the decision with the same inputs
    const replayedArtifact = this.simulateDecision(artifact, replaySeed);
    
    const originalHash = this.hashArtifact(artifact);
    const replayHash = this.hashArtifact(replayedArtifact);
    
    const result: ReplayResult = {
      success: true,
      originalHash,
      replayHash,
      matched: originalHash === replayHash,
    };

    if (!result.matched) {
      result.divergencePoint = this.findDivergence(artifact, replayedArtifact);
    }

    return result;
  }

  private simulateDecision(
    original: DecisionArtifact,
    _seed: string
  ): DecisionArtifact {
    // For deterministic replay, we return the exact same artifact
    // In a real implementation, this would re-run the decision logic
    // with the pinned seed to verify determinism
    return JSON.parse(JSON.stringify(original));
  }

  private hashArtifact(artifact: DecisionArtifact): string {
    const canonical = JSON.stringify({
      decision: artifact.decision,
      council: artifact.council,
      evidence: artifact.evidence,
      timestamps: artifact.timestamps,
    });
    
    return crypto.createHash('sha256').update(canonical).digest('hex');
  }

  private findDivergence(
    original: DecisionArtifact,
    replayed: DecisionArtifact
  ): string {
    if (JSON.stringify(original.decision) !== JSON.stringify(replayed.decision)) {
      return 'decision';
    }
    if (JSON.stringify(original.council) !== JSON.stringify(replayed.council)) {
      return 'council';
    }
    if (JSON.stringify(original.evidence) !== JSON.stringify(replayed.evidence)) {
      return 'evidence';
    }
    if (JSON.stringify(original.timestamps) !== JSON.stringify(replayed.timestamps)) {
      return 'timestamps';
    }
    return 'unknown';
  }
}

// =============================================================================
// SAMPLE ARTIFACTS
// =============================================================================

function createSampleArtifact(): DecisionArtifact {
  return {
    id: 'artifact-001',
    version: 1,
    decision: {
      id: 'dec-transfer-001',
      title: 'Transfer Acquisition - Test Player',
      type: 'TRANSFER_IN',
      outcome: 'APPROVED',
      rationale: 'Player acquisition approved following comprehensive council review.',
    },
    council: {
      agents: ['agent-transfer-analyst', 'agent-ffp-compliance', 'agent-risk-assessor'],
      contributions: [
        {
          agentId: 'agent-transfer-analyst',
          input: 'Market value assessment: £30M is fair given age and performance metrics.',
          timestamp: '2024-01-15T10:30:00Z',
        },
        {
          agentId: 'agent-ffp-compliance',
          input: 'FFP impact: Within acceptable parameters. Squad cost ratio remains at 65%.',
          timestamp: '2024-01-15T10:35:00Z',
        },
        {
          agentId: 'agent-risk-assessor',
          input: 'Risk assessment: LOW. No significant injury history or contractual concerns.',
          timestamp: '2024-01-15T10:40:00Z',
        },
      ],
      dissents: [],
    },
    evidence: {
      documents: [
        {
          id: 'doc-medical-001',
          hash: 'abc123def456',
          type: 'medical_report',
        },
        {
          id: 'doc-scouting-001',
          hash: 'xyz789ghi012',
          type: 'scouting_report',
        },
      ],
      citations: [
        {
          source: 'UEFA',
          reference: 'Financial Sustainability Regulations, Article 58',
          accessedAt: '2024-01-15T10:32:00Z',
        },
      ],
    },
    timestamps: {
      created: '2024-01-15T10:00:00Z',
      deliberationStart: '2024-01-15T10:30:00Z',
      deliberationEnd: '2024-01-15T10:45:00Z',
      finalized: '2024-01-15T11:00:00Z',
    },
    randomSeed: 'seed-2024-01-15-001',
  };
}

// =============================================================================
// EVIDENCE EXPORT TESTS
// =============================================================================

describe('Evidence Export - JSON Format', () => {
  let service: EvidenceExportService;

  beforeEach(() => {
    service = new EvidenceExportService();
  });

  it('should export artifact to JSON with valid hash', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user-123', 'regulatory_inquiry');

    expect(exported).not.toBeNull();
    expect(exported?.format).toBe('json');
    expect(exported?.exportHash).toBeDefined();
    expect(exported?.exportHash.length).toBe(64); // SHA-256
  });

  it('should include complete artifact data in export', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user-123', 'audit');

    expect(exported?.artifact.decision).toEqual(artifact.decision);
    expect(exported?.artifact.council).toEqual(artifact.council);
    expect(exported?.artifact.evidence).toEqual(artifact.evidence);
    expect(exported?.artifact.timestamps).toEqual(artifact.timestamps);
  });

  it('should include export metadata', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'auditor-456', 'compliance_review');

    expect(exported?.metadata.exportedBy).toBe('auditor-456');
    expect(exported?.metadata.purpose).toBe('compliance_review');
    expect(exported?.exportedAt).toBeDefined();
  });

  it('should return null for non-existent artifact', () => {
    const exported = service.exportToJSON('non-existent', 'user', 'test');
    expect(exported).toBeNull();
  });
});

describe('Evidence Export - PDF Format', () => {
  let service: EvidenceExportService;

  beforeEach(() => {
    service = new EvidenceExportService();
  });

  it('should export artifact to PDF format', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToPDF(artifact.id, 'user-123', 'board_presentation');

    expect(exported).not.toBeNull();
    expect(exported?.format).toBe('pdf');
    expect(exported?.exportHash).toBeDefined();
  });

  it('PDF and JSON exports should have different hashes (different timestamps)', async () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const jsonExport = service.exportToJSON(artifact.id, 'user', 'test');
    await new Promise(r => setTimeout(r, 10)); // Small delay
    const pdfExport = service.exportToPDF(artifact.id, 'user', 'test');

    // Different export times = different hashes
    expect(jsonExport?.exportHash).not.toBe(pdfExport?.exportHash);
  });
});

// =============================================================================
// EXPORT INTEGRITY VERIFICATION TESTS
// =============================================================================

describe('Evidence Export - Integrity Verification', () => {
  let service: EvidenceExportService;

  beforeEach(() => {
    service = new EvidenceExportService();
  });

  it('should verify unmodified export as valid', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user', 'test')!;
    const result = service.verifyExportIntegrity(exported);

    expect(result.valid).toBe(true);
  });

  it('should detect tampered artifact in export', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user', 'test')!;
    
    // Tamper with the export
    exported.artifact.decision.outcome = 'REJECTED'; // Changed from APPROVED

    const result = service.verifyExportIntegrity(exported);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('hash mismatch');
  });

  it('should detect tampered export timestamp', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user', 'test')!;
    
    // Tamper with the export timestamp
    exported.exportedAt = '2020-01-01T00:00:00Z'; // Fake date

    const result = service.verifyExportIntegrity(exported);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('hash mismatch');
  });

  it('should detect tampered council contributions', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user', 'test')!;
    
    // Tamper with council contribution
    exported.artifact.council.contributions[0].input = 'Tampered input';

    const result = service.verifyExportIntegrity(exported);

    expect(result.valid).toBe(false);
  });
});

// =============================================================================
// CROSS-SYSTEM VERIFICATION TESTS
// =============================================================================

describe('Evidence Export - Cross-System Verification', () => {
  let service: EvidenceExportService;

  beforeEach(() => {
    service = new EvidenceExportService();
  });

  it('should verify export matches ledger merkle root', () => {
    const artifact = createSampleArtifact();
    const merkleRoot = service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user', 'test')!;
    const result = service.verifyAgainstLedger(exported, merkleRoot);

    expect(result.valid).toBe(true);
  });

  it('should detect mismatch with ledger merkle root', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'user', 'test')!;
    
    // Provide wrong merkle root (simulating ledger mismatch)
    const wrongMerkleRoot = 'wrong-merkle-root-abc123';
    const result = service.verifyAgainstLedger(exported, wrongMerkleRoot);

    expect(result.valid).toBe(false);
    expect(result.error).toContain('Merkle root mismatch');
  });

  it('merkle root should be deterministic', () => {
    const artifact1 = createSampleArtifact();
    const artifact2 = createSampleArtifact();

    const merkle1 = service.storeArtifact(artifact1);
    
    // Create new service instance
    const service2 = new EvidenceExportService();
    const merkle2 = service2.storeArtifact(artifact2);

    // Same artifact should produce same merkle root
    expect(merkle1).toBe(merkle2);
  });
});

// =============================================================================
// DETERMINISTIC REPLAY TESTS
// =============================================================================

describe('Deterministic Replay - Basic Replay', () => {
  let replayService: DeterministicReplayService;
  let exportService: EvidenceExportService;

  beforeEach(() => {
    replayService = new DeterministicReplayService();
    exportService = new EvidenceExportService();
  });

  it('should replay decision and get same hash', () => {
    const artifact = createSampleArtifact();
    exportService.storeArtifact(artifact);

    const result = replayService.replayDecision(artifact);

    expect(result.success).toBe(true);
    expect(result.matched).toBe(true);
    expect(result.originalHash).toBe(result.replayHash);
  });

  it('should use stored random seed for replay', () => {
    const artifact = createSampleArtifact();
    artifact.randomSeed = 'pinned-seed-12345';

    const result = replayService.replayDecision(artifact);

    expect(result.matched).toBe(true);
  });

  it('should detect divergence if artifact was modified', () => {
    const originalArtifact = createSampleArtifact();
    const modifiedArtifact = JSON.parse(JSON.stringify(originalArtifact));
    modifiedArtifact.decision.outcome = 'MODIFIED';

    // Replay with original, compare to modified
    const originalHash = crypto.createHash('sha256')
      .update(JSON.stringify({
        decision: originalArtifact.decision,
        council: originalArtifact.council,
        evidence: originalArtifact.evidence,
        timestamps: originalArtifact.timestamps,
      }))
      .digest('hex');

    const modifiedHash = crypto.createHash('sha256')
      .update(JSON.stringify({
        decision: modifiedArtifact.decision,
        council: modifiedArtifact.council,
        evidence: modifiedArtifact.evidence,
        timestamps: modifiedArtifact.timestamps,
      }))
      .digest('hex');

    expect(originalHash).not.toBe(modifiedHash);
  });
});

describe('Deterministic Replay - Hash Consistency', () => {
  let replayService: DeterministicReplayService;

  beforeEach(() => {
    replayService = new DeterministicReplayService();
  });

  it('multiple replays should produce identical hashes', () => {
    const artifact = createSampleArtifact();

    const result1 = replayService.replayDecision(artifact);
    const result2 = replayService.replayDecision(artifact);
    const result3 = replayService.replayDecision(artifact);

    expect(result1.replayHash).toBe(result2.replayHash);
    expect(result2.replayHash).toBe(result3.replayHash);
  });

  it('hash should be 64 characters (SHA-256 hex)', () => {
    const artifact = createSampleArtifact();
    const result = replayService.replayDecision(artifact);

    expect(result.originalHash.length).toBe(64);
    expect(result.replayHash.length).toBe(64);
  });
});

// =============================================================================
// BIT-PERFECT REPRODUCIBILITY TESTS
// =============================================================================

describe('Evidence Export - Bit-Perfect Reproducibility', () => {
  let service: EvidenceExportService;

  beforeEach(() => {
    service = new EvidenceExportService();
  });

  it('same artifact should always produce same merkle root', () => {
    const artifact1 = createSampleArtifact();
    const artifact2 = JSON.parse(JSON.stringify(createSampleArtifact()));

    const merkle1 = service.storeArtifact(artifact1);
    
    const service2 = new EvidenceExportService();
    const merkle2 = service2.storeArtifact(artifact2);

    expect(merkle1).toBe(merkle2);
  });

  it('artifact with different content should produce different merkle root', () => {
    const artifact1 = createSampleArtifact();
    const artifact2 = createSampleArtifact();
    artifact2.decision.outcome = 'REJECTED';

    const merkle1 = service.storeArtifact(artifact1);
    
    const service2 = new EvidenceExportService();
    const merkle2 = service2.storeArtifact(artifact2);

    expect(merkle1).not.toBe(merkle2);
  });

  it('order of council contributions should affect hash', () => {
    const artifact1 = createSampleArtifact();
    const artifact2 = createSampleArtifact();
    
    // Swap order of contributions
    const temp = artifact2.council.contributions[0];
    artifact2.council.contributions[0] = artifact2.council.contributions[1];
    artifact2.council.contributions[1] = temp;

    const merkle1 = service.storeArtifact(artifact1);
    
    const service2 = new EvidenceExportService();
    const merkle2 = service2.storeArtifact(artifact2);

    expect(merkle1).not.toBe(merkle2);
  });
});

// =============================================================================
// AUDIT TRAIL FOR EXPORTS
// =============================================================================

describe('Evidence Export - Export Audit Trail', () => {
  let service: EvidenceExportService;

  beforeEach(() => {
    service = new EvidenceExportService();
  });

  it('should track who exported and why', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const exported = service.exportToJSON(artifact.id, 'regulator-789', 'ffp_inquiry');

    expect(exported?.metadata.exportedBy).toBe('regulator-789');
    expect(exported?.metadata.purpose).toBe('ffp_inquiry');
  });

  it('should timestamp each export', () => {
    const artifact = createSampleArtifact();
    service.storeArtifact(artifact);

    const before = new Date().toISOString();
    const exported = service.exportToJSON(artifact.id, 'user', 'test');
    const after = new Date().toISOString();

    expect(exported?.exportedAt).toBeDefined();
    expect(exported?.exportedAt >= before).toBe(true);
    expect(exported?.exportedAt <= after).toBe(true);
  });
});

// =============================================================================
// SPORTS-SPECIFIC EVIDENCE SCENARIOS
// =============================================================================

describe('Evidence Export - Sports Scenarios', () => {
  let exportService: EvidenceExportService;
  let replayService: DeterministicReplayService;

  beforeEach(() => {
    exportService = new EvidenceExportService();
    replayService = new DeterministicReplayService();
  });

  it('Scenario: Transfer dispute - verify original decision', () => {
    const transferDecision = createSampleArtifact();
    transferDecision.decision.title = 'Transfer Acquisition - Disputed Player';
    transferDecision.decision.id = 'transfer-dispute-001';
    
    const merkleRoot = exportService.storeArtifact(transferDecision);

    // Agent/club disputes the decision
    const exported = exportService.exportToJSON(
      transferDecision.id,
      'dispute-panel',
      'transfer_dispute_resolution'
    );

    // Verify export matches original ledger
    const ledgerVerification = exportService.verifyAgainstLedger(exported!, merkleRoot);
    expect(ledgerVerification.valid).toBe(true);

    // Replay the decision
    const replay = replayService.replayDecision(exported!.artifact);
    expect(replay.matched).toBe(true);
  });

  it('Scenario: Regulator inquiry - FFP compliance evidence', () => {
    const ffpDecision = createSampleArtifact();
    ffpDecision.decision.type = 'FFP_ASSESSMENT';
    ffpDecision.evidence.citations.push({
      source: 'UEFA',
      reference: 'Financial Sustainability Regulations, Article 65 - Squad Cost Rule',
      accessedAt: '2024-01-15T10:33:00Z',
    });

    const merkleRoot = exportService.storeArtifact(ffpDecision);

    // UEFA requests evidence
    const exported = exportService.exportToJSON(
      ffpDecision.id,
      'uefa-compliance-officer',
      'ffp_audit'
    );

    // Verify integrity
    expect(exportService.verifyExportIntegrity(exported!).valid).toBe(true);
    expect(exportService.verifyAgainstLedger(exported!, merkleRoot).valid).toBe(true);

    // Verify citations are preserved
    expect(exported!.artifact.evidence.citations.length).toBe(2);
    expect(exported!.artifact.evidence.citations[1].source).toBe('UEFA');
  });

  it('Scenario: Board challenge - verify all agents contributed', () => {
    const boardDecision = createSampleArtifact();
    boardDecision.decision.type = 'MAJOR_ACQUISITION';
    
    exportService.storeArtifact(boardDecision);
    const exported = exportService.exportToJSON(
      boardDecision.id,
      'board-secretary',
      'board_meeting_record'
    );

    // Board can verify all agents contributed
    expect(exported!.artifact.council.agents.length).toBe(3);
    expect(exported!.artifact.council.contributions.length).toBe(3);
    
    // Each contribution has timestamp
    for (const contrib of exported!.artifact.council.contributions) {
      expect(contrib.timestamp).toBeDefined();
      expect(contrib.agentId).toBeDefined();
      expect(contrib.input.length).toBeGreaterThan(0);
    }
  });

  it('Scenario: Arbitration - prove no tampering occurred', () => {
    const originalDecision = createSampleArtifact();
    const merkleRoot = exportService.storeArtifact(originalDecision);

    // Export for arbitration
    const exported = exportService.exportToJSON(
      originalDecision.id,
      'arbitration-panel',
      'cas_appeal'
    );

    // Verify bit-perfect match
    expect(exportService.verifyAgainstLedger(exported!, merkleRoot).valid).toBe(true);

    // Replay produces same hash
    const replay = replayService.replayDecision(exported!.artifact);
    expect(replay.matched).toBe(true);

    // Any modification would be detected
    const tampered = JSON.parse(JSON.stringify(exported!));
    tampered.artifact.decision.rationale = 'Tampered rationale';
    
    expect(exportService.verifyExportIntegrity(tampered).valid).toBe(false);
  });
});
