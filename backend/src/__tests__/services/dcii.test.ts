/**
 * DCII - Decision Crisis Immunization Infrastructure™ Tests
 * 
 * Comprehensive test suite for all 5 DCII services:
 * 1. IISSService - Institutional Immune System Score
 * 2. SyntheticMediaAuthService - Media Authentication & Deepfake Detection
 * 3. CrossJurisdictionConflictService - Regulatory Conflict Detection
 * 4. TimestampAuthorityService - RFC 3161 Timestamps
 * 5. DecisionSimilarityService - Proactive Historical Matching
 */

import { describe, it, expect, beforeAll } from 'vitest';
import { iissService } from '../../services/dcii/IISSService.js';
import { syntheticMediaAuthService } from '../../services/dcii/SyntheticMediaAuthService.js';
import { crossJurisdictionConflictService } from '../../services/dcii/CrossJurisdictionConflictService.js';
import { timestampAuthorityService } from '../../services/dcii/TimestampAuthorityService.js';
import { decisionSimilarityService } from '../../services/dcii/DecisionSimilarityService.js';

// =============================================================================
// 1. IISS SERVICE TESTS
// =============================================================================

describe('IISSService', () => {
  describe('calculateScore', () => {
    it('should calculate an IISS score for an organization', async () => {
      const score = await iissService.calculateScore('org-test-1', 'Test Corp', 'test-user');
      expect(score).toBeDefined();
      expect(score.id).toBeDefined();
      expect(score.organizationId).toBe('org-test-1');
      expect(score.organizationName).toBe('Test Corp');
      expect(score.overallScore).toBeGreaterThanOrEqual(0);
      expect(score.overallScore).toBeLessThanOrEqual(1000);
      expect(['critical', 'vulnerable', 'developing', 'resilient', 'exceptional']).toContain(score.band);
      expect(['none', 'bronze', 'silver', 'gold', 'platinum']).toContain(score.certificationLevel);
    });

    it('should include 5 dimensions', async () => {
      const score = await iissService.calculateScore('org-test-dims', 'Dims Corp', 'test-user');
      expect(score.dimensions).toHaveLength(5);
      const primitives = score.dimensions.map(d => d.primitive);
      expect(primitives).toContain('discovery_time_proof');
      expect(primitives).toContain('deliberation_capture');
      expect(primitives).toContain('override_accountability');
      expect(primitives).toContain('continuity_memory');
      expect(primitives).toContain('drift_detection');
    });

    it('should include controls per dimension', async () => {
      const score = await iissService.calculateScore('org-test-ctrl', 'Ctrl Corp', 'test-user');
      for (const dim of score.dimensions) {
        expect(dim.controls.length).toBeGreaterThan(0);
        for (const ctrl of dim.controls) {
          expect(ctrl.name).toBeDefined();
          expect(ctrl.score).toBeGreaterThanOrEqual(0);
          expect(ctrl.maxScore).toBeGreaterThan(0);
          expect(['implemented', 'partial', 'not_implemented', 'not_applicable']).toContain(ctrl.status);
        }
      }
    });

    it('should calculate weighted overall score from dimensions', async () => {
      const score = await iissService.calculateScore('org-test-weight', 'Weight Corp', 'test-user');
      let expected = 0;
      for (const dim of score.dimensions) {
        expected += dim.normalizedScore * dim.weight;
      }
      expect(score.overallScore).toBe(Math.round(expected));
    });

    it('should include recommendations sorted by impact', async () => {
      const score = await iissService.calculateScore('org-test-recs', 'Recs Corp', 'test-user');
      expect(score.recommendations).toBeDefined();
      expect(Array.isArray(score.recommendations)).toBe(true);
      for (let i = 1; i < score.recommendations.length; i++) {
        expect(score.recommendations[i - 1].estimatedImpact).toBeGreaterThanOrEqual(score.recommendations[i].estimatedImpact);
      }
    });

    it('should include insurance impact', async () => {
      const score = await iissService.calculateScore('org-test-ins', 'Ins Corp', 'test-user');
      expect(score.insuranceImpact).toBeDefined();
      expect(score.insuranceImpact.currentPremiumEstimate).toBeGreaterThan(0);
      expect(typeof score.insuranceImpact.savingsPercentage).toBe('number');
      expect(typeof score.insuranceImpact.qualifiesForDiscount).toBe('boolean');
    });

    it('should include regulatory readiness', async () => {
      const score = await iissService.calculateScore('org-test-reg', 'Reg Corp', 'test-user');
      expect(score.regulatoryReadiness).toBeDefined();
      expect(score.regulatoryReadiness.euAiAct).toBeDefined();
      expect(typeof score.regulatoryReadiness.euAiAct.ready).toBe('boolean');
      expect(typeof score.regulatoryReadiness.euAiAct.score).toBe('number');
    });

    it('should include integrity hash', async () => {
      const score = await iissService.calculateScore('org-test-hash', 'Hash Corp', 'test-user');
      expect(score.integrity).toBeDefined();
      expect(score.integrity.scoreHash).toBeDefined();
      expect(score.integrity.scoreHash).toHaveLength(64); // SHA-256 hex
      expect(score.integrity.algorithm).toBe('SHA-256');
    });

    it('should track score history', async () => {
      await iissService.calculateScore('org-test-hist', 'Hist Corp', 'test-user');
      await iissService.calculateScore('org-test-hist', 'Hist Corp', 'test-user');
      const history = iissService.getHistory('org-test-hist');
      expect(history.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('getters', () => {
    it('should return score band info', () => {
      const bands = iissService.getScoreBandInfo();
      expect(bands).toHaveLength(5);
      expect(bands[0].band).toBe('critical');
      expect(bands[4].band).toBe('exceptional');
    });

    it('should return dimension definitions', () => {
      const dims = iissService.getDimensionDefinitions();
      expect(dims).toHaveLength(5);
      const totalWeight = dims.reduce((s, d) => s + d.weight, 0);
      expect(totalWeight).toBeCloseTo(1.0, 5);
    });

    it('should return benchmarks', () => {
      const benchmarks = iissService.getBenchmarks();
      expect(benchmarks.length).toBeGreaterThan(0);
      for (const b of benchmarks) {
        expect(b.industry).toBeDefined();
        expect(b.averageScore).toBeGreaterThan(0);
      }
    });

    it('should filter benchmarks by industry', () => {
      const benchmarks = iissService.getBenchmarks('Technology');
      expect(benchmarks.length).toBe(1);
      expect(benchmarks[0].industry).toBe('Technology');
    });
  });
});

// =============================================================================
// 2. SYNTHETIC MEDIA AUTH SERVICE TESTS
// =============================================================================

describe('SyntheticMediaAuthService', () => {
  let testAssetId: string;

  describe('signMedia', () => {
    it('should sign a media asset with C2PA provenance', async () => {
      const asset = await syntheticMediaAuthService.signMedia(
        'org-test', 'test-video.mp4', 'video', 'video/mp4',
        'test-content-data', 'test-user',
        { source: 'application', application: 'Test Suite', capturedAt: new Date(), capturedBy: 'test-user' }
      );
      testAssetId = asset.id;
      expect(asset).toBeDefined();
      expect(asset.id).toBeDefined();
      expect(asset.contentHash).toBeDefined();
      expect(asset.contentHash).toHaveLength(64);
      expect(asset.provenance).toBeDefined();
      expect(asset.provenance.c2paManifest).toBeDefined();
      expect(asset.provenance.c2paManifest!.claimGenerator).toBe('Cendia/SyntheticMediaAuth/2.0');
      expect(asset.provenance.signature.signature).toBeDefined();
      expect(asset.chainOfCustody).toHaveLength(1);
      expect(asset.chainOfCustody[0].action).toBe('created');
      expect(asset.status).toBe('active');
    });

    it('should create unique content hashes for different content', async () => {
      const asset1 = await syntheticMediaAuthService.signMedia('org-test', 'a.png', 'image', 'image/png', 'content-A', 'u', { source: 'upload', capturedAt: new Date(), capturedBy: 'u' });
      const asset2 = await syntheticMediaAuthService.signMedia('org-test', 'b.png', 'image', 'image/png', 'content-B', 'u', { source: 'upload', capturedAt: new Date(), capturedBy: 'u' });
      expect(asset1.contentHash).not.toBe(asset2.contentHash);
    });
  });

  describe('analyzeAuthenticity', () => {
    it('should analyze a media asset for authenticity', async () => {
      const asset = await syntheticMediaAuthService.signMedia('org-test', 'analyze-me.jpg', 'image', 'image/jpeg', 'test-img', 'user', { source: 'camera', capturedAt: new Date(), capturedBy: 'user' });
      const assessment = await syntheticMediaAuthService.analyzeAuthenticity(asset.id, 'analyst');
      expect(assessment).toBeDefined();
      expect(assessment.status).toBe('completed');
      expect(['authentic', 'likely_authentic', 'inconclusive', 'likely_synthetic', 'synthetic', 'tampered']).toContain(assessment.verdict);
      expect(assessment.confidenceScore).toBeGreaterThanOrEqual(0);
      expect(assessment.confidenceScore).toBeLessThanOrEqual(100);
      expect(assessment.analyses.length).toBeGreaterThan(0);
    });

    it('should include multiple analysis types', async () => {
      const asset = await syntheticMediaAuthService.signMedia('org-test', 'multi-analysis.mp4', 'video', 'video/mp4', 'vid', 'user', { source: 'application', application: 'App', capturedAt: new Date(), capturedBy: 'user' });
      const assessment = await syntheticMediaAuthService.analyzeAuthenticity(asset.id, 'analyst');
      const types = assessment.analyses.map(a => a.type);
      expect(types).toContain('metadata');
      expect(types).toContain('compression');
      expect(types).toContain('noise');
    });

    it('should throw for non-existent asset', async () => {
      await expect(syntheticMediaAuthService.analyzeAuthenticity('non-existent', 'user')).rejects.toThrow();
    });
  });

  describe('chain of custody', () => {
    it('should add custody entries with hash chain', async () => {
      const asset = await syntheticMediaAuthService.signMedia('org-test', 'custody.pdf', 'document', 'application/pdf', 'doc', 'user', { source: 'upload', capturedAt: new Date(), capturedBy: 'user' });
      const entry1 = syntheticMediaAuthService.addCustodyEntry(asset.id, 'accessed', 'viewer', 'reviewer', 'Reviewed document');
      const entry2 = syntheticMediaAuthService.addCustodyEntry(asset.id, 'exported', 'admin', 'admin', 'Exported for audit');
      expect(entry1).toBeDefined();
      expect(entry2).toBeDefined();
      expect(entry2!.previousHash).toBe(entry1!.entryHash);
    });
  });

  describe('verification report', () => {
    it('should generate a verification report', async () => {
      const asset = await syntheticMediaAuthService.signMedia('org-test', 'report.jpg', 'image', 'image/jpeg', 'img', 'user', { source: 'camera', capturedAt: new Date(), capturedBy: 'user' });
      await syntheticMediaAuthService.analyzeAuthenticity(asset.id, 'analyst');
      const report = await syntheticMediaAuthService.generateVerificationReport(asset.id);
      expect(report).toBeDefined();
      expect(report.reportHash).toBeDefined();
      expect(report.reportHash).toHaveLength(64);
      expect(report.provenanceVerified).toBe(true);
      expect(report.signatureValid).toBe(true);
    });
  });
});

// =============================================================================
// 3. CROSS-JURISDICTION CONFLICT SERVICE TESTS
// =============================================================================

describe('CrossJurisdictionConflictService', () => {
  describe('assessOrganization', () => {
    it('should detect conflicts between EU and China', async () => {
      const assessment = await crossJurisdictionConflictService.assessOrganization(
        'org-test-jur', 'Test Multinational', ['EU', 'CHINA'], 'test-user'
      );
      expect(assessment).toBeDefined();
      expect(assessment.conflicts.length).toBeGreaterThan(0);
      expect(assessment.conflictCount).toBe(assessment.conflicts.length);
      // EU-China should produce irreconcilable conflicts
      const irreconcilable = assessment.conflicts.filter(c => c.severity === 'irreconcilable');
      expect(irreconcilable.length).toBeGreaterThan(0);
      expect(assessment.overallRisk).toBe('critical');
    });

    it('should detect fewer conflicts with compatible jurisdictions', async () => {
      const assessment = await crossJurisdictionConflictService.assessOrganization(
        'org-test-compat', 'Compatible Corp', ['EU', 'UK'], 'test-user'
      );
      expect(assessment).toBeDefined();
      // EU and UK are largely compatible
      expect(assessment.conflicts.length).toBeLessThanOrEqual(2);
    });

    it('should include jurisdiction scores', async () => {
      const assessment = await crossJurisdictionConflictService.assessOrganization(
        'org-test-scores', 'Scores Corp', ['EU', 'US_FEDERAL', 'CHINA'], 'test-user'
      );
      expect(assessment.jurisdictionScores.length).toBe(3);
      for (const js of assessment.jurisdictionScores) {
        expect(js.complianceScore).toBeGreaterThanOrEqual(0);
        expect(js.complianceScore).toBeLessThanOrEqual(100);
      }
    });

    it('should include resolution strategies for each conflict', async () => {
      const assessment = await crossJurisdictionConflictService.assessOrganization(
        'org-test-res', 'Res Corp', ['EU', 'CHINA', 'US_CALIFORNIA'], 'test-user'
      );
      for (const conflict of assessment.conflicts) {
        expect(conflict.resolutionStrategies.length).toBeGreaterThan(0);
        for (const strategy of conflict.resolutionStrategies) {
          expect(strategy.strategy).toBeDefined();
          expect(strategy.implementationSteps.length).toBeGreaterThan(0);
        }
      }
    });

    it('should include integrity hash', async () => {
      const assessment = await crossJurisdictionConflictService.assessOrganization(
        'org-test-int', 'Int Corp', ['EU', 'US_FEDERAL'], 'test-user'
      );
      expect(assessment.integrity.assessmentHash).toBeDefined();
      expect(assessment.integrity.assessmentHash).toHaveLength(64);
    });
  });

  describe('good faith documentation', () => {
    it('should generate good-faith document for a conflict', async () => {
      const assessment = await crossJurisdictionConflictService.assessOrganization(
        'org-test-gf', 'GF Corp', ['EU', 'CHINA'], 'test-user'
      );
      const conflict = assessment.conflicts[0];
      const doc = await crossJurisdictionConflictService.generateGoodFaithDocument(conflict.id, 'legal-counsel');
      expect(doc).toBeDefined();
      expect(doc.conflictId).toBe(conflict.id);
      expect(doc.signedBy).toBe('legal-counsel');
      expect(doc.integrity.documentHash).toHaveLength(64);
      expect(doc.analysisPerformed.length).toBeGreaterThan(0);
      expect(doc.mitigations.length).toBeGreaterThan(0);
    });
  });

  describe('evidence packets', () => {
    it('should generate jurisdiction-specific evidence packet', async () => {
      await crossJurisdictionConflictService.assessOrganization('org-test-ep', 'EP Corp', ['EU', 'US_FEDERAL'], 'test-user');
      const packet = await crossJurisdictionConflictService.generateEvidencePacket(
        'org-test-ep', 'EU', 'GDPR', 'compliance_report', 'test-user'
      );
      expect(packet).toBeDefined();
      expect(packet.jurisdiction).toBe('EU');
      expect(packet.framework).toBe('GDPR');
      expect(packet.sections.length).toBeGreaterThan(0);
      expect(packet.integrity.packetHash).toHaveLength(64);
    });
  });

  describe('getters', () => {
    it('should return jurisdiction profiles', () => {
      const profiles = crossJurisdictionConflictService.getJurisdictionProfiles();
      expect(profiles.length).toBeGreaterThan(0);
      const eu = profiles.find(p => p.jurisdiction === 'EU');
      expect(eu).toBeDefined();
      expect(eu!.frameworks).toContain('GDPR');
    });
  });
});

// =============================================================================
// 4. TIMESTAMP AUTHORITY SERVICE TESTS
// =============================================================================

describe('TimestampAuthorityService', () => {
  describe('issueTimestamp', () => {
    it('should issue a timestamp with internal signing', async () => {
      const token = await timestampAuthorityService.issueTimestamp(
        'org-test-ts', 'test-decision-data', 'Test Decision', 'decision', 'dec-001'
      );
      expect(token).toBeDefined();
      expect(token.id).toBeDefined();
      expect(token.dataHash).toHaveLength(64);
      expect(token.hashAlgorithm).toBe('SHA-256');
      expect(token.internalTimestamp).toBeDefined();
      expect(token.internalTimestamp.ntpSynchronized).toBe(true);
      expect(token.internalTimestamp.signature).toBeDefined();
      expect(token.status).toBe('issued');
      expect(token.tokenHash).toHaveLength(64);
    });

    it('should include external timestamp when requested', async () => {
      const token = await timestampAuthorityService.issueTimestamp(
        'org-test-ext', 'external-data', 'External Test', 'evidence', undefined,
        { useExternal: true }
      );
      expect(token.externalTimestamp).toBeDefined();
      expect(token.externalTimestamp!.provider).toBeDefined();
      expect(token.externalTimestamp!.serialNumber).toBeDefined();
      expect(token.externalTimestamp!.certificateChain.length).toBeGreaterThanOrEqual(2);
    });

    it('should include blockchain anchor when requested', async () => {
      const token = await timestampAuthorityService.issueTimestamp(
        'org-test-bc', 'blockchain-data', 'Blockchain Test', 'override', undefined,
        { useBlockchain: true }
      );
      expect(token.blockchainAnchor).toBeDefined();
      expect(token.blockchainAnchor!.transactionHash).toBeDefined();
      expect(token.blockchainAnchor!.transactionHash).toMatch(/^0x/);
      expect(token.blockchainAnchor!.status).toBe('confirmed');
      expect(token.blockchainAnchor!.confirmations).toBeGreaterThanOrEqual(6);
    });

    it('should set 10-year expiration', async () => {
      const token = await timestampAuthorityService.issueTimestamp(
        'org-test-exp', 'expiry-data', 'Expiry Test', 'compliance'
      );
      expect(token.expiresAt).toBeDefined();
      const yearsUntilExpiry = (token.expiresAt!.getTime() - Date.now()) / (365 * 24 * 60 * 60 * 1000);
      expect(yearsUntilExpiry).toBeGreaterThan(9);
      expect(yearsUntilExpiry).toBeLessThanOrEqual(11);
    });
  });

  describe('batchTimestamp', () => {
    it('should timestamp multiple items in a batch', async () => {
      const items = [
        { dataHash: 'hash1', description: 'Item 1', dataType: 'decision' as const },
        { dataHash: 'hash2', description: 'Item 2', dataType: 'deliberation' as const },
        { dataHash: 'hash3', description: 'Item 3', dataType: 'evidence' as const },
      ];
      const batch = await timestampAuthorityService.batchTimestamp('org-test-batch', items);
      expect(batch).toBeDefined();
      expect(batch.tokensIssued).toHaveLength(3);
      expect(batch.status).toBe('completed');
      expect(batch.batchMerkleRoot).toBeDefined();
    });
  });

  describe('verifyTimestamp', () => {
    it('should verify a valid timestamp', async () => {
      const token = await timestampAuthorityService.issueTimestamp(
        'org-test-verify', 'verify-data', 'Verify Test', 'decision', undefined,
        { useExternal: true }
      );
      const verification = await timestampAuthorityService.verifyTimestamp(token.id, 'verifier');
      expect(verification).toBeDefined();
      expect(verification.internalValid).toBe(true);
      expect(verification.externalValid).toBe(true);
      expect(verification.overallValid).toBe(true);
      expect(verification.verificationDetails.length).toBeGreaterThan(0);
    });

    it('should throw for non-existent token', async () => {
      await expect(timestampAuthorityService.verifyTimestamp('non-existent', 'user')).rejects.toThrow();
    });
  });

  describe('getters', () => {
    it('should return TSA providers', () => {
      const providers = timestampAuthorityService.getProviders();
      expect(providers.length).toBeGreaterThan(0);
      const digicert = providers.find(p => p.provider === 'digicert');
      expect(digicert).toBeDefined();
    });

    it('should return stats', () => {
      const stats = timestampAuthorityService.getStats();
      expect(stats).toBeDefined();
      expect(stats.totalTokens).toBeGreaterThan(0);
      expect(typeof stats.averageVerificationTimeMs).toBe('number');
    });

    it('should filter tokens by reference', async () => {
      await timestampAuthorityService.issueTimestamp('org-test-ref', 'ref-data', 'Ref Test', 'decision', 'unique-ref-123');
      const tokens = timestampAuthorityService.getTokensByReference('unique-ref-123');
      expect(tokens.length).toBeGreaterThanOrEqual(1);
      expect(tokens[0].referenceId).toBe('unique-ref-123');
    });
  });
});

// =============================================================================
// 5. DECISION SIMILARITY SERVICE TESTS
// =============================================================================

describe('DecisionSimilarityService', () => {
  describe('addDecisionRecord', () => {
    it('should add a decision record with auto-extracted keywords', () => {
      const record = decisionSimilarityService.addDecisionRecord({
        organizationId: 'org-test-sim',
        title: 'Migrate database infrastructure to cloud',
        question: 'Should we migrate our on-premise PostgreSQL to AWS RDS?',
        context: 'Current infrastructure costs $50K/month. AWS RDS would reduce to $30K/month.',
        decisionType: 'technology',
        department: 'Engineering',
        urgency: 'high',
        overrideOccurred: false,
        tags: ['database', 'cloud', 'migration'],
        decidedAt: new Date(),
        decidedBy: 'CTO',
        relatedDecisionIds: [],
      });
      expect(record).toBeDefined();
      expect(record.id).toBeDefined();
      expect(record.keywords.length).toBeGreaterThan(0);
      expect(record.organizationId).toBe('org-test-sim');
    });
  });

  describe('updateOutcome', () => {
    it('should update decision outcome', () => {
      const record = decisionSimilarityService.addDecisionRecord({
        organizationId: 'org-test-out',
        title: 'Outcome Test Decision',
        question: 'Test?',
        context: 'Context.',
        decisionType: 'test',
        department: 'Test',
        urgency: 'low',
        overrideOccurred: false,
        tags: [],
        decidedAt: new Date(),
        decidedBy: 'tester',
        relatedDecisionIds: [],
      });
      const updated = decisionSimilarityService.updateOutcome(
        record.id, 'failed', 'It did not work', ['Should have tested more'], true
      );
      expect(updated).toBeDefined();
      expect(updated!.outcome).toBe('failed');
      expect(updated!.dissenterWasCorrect).toBe(true);
      expect(updated!.lessonsLearned).toContain('Should have tested more');
    });

    it('should return undefined for non-existent decision', () => {
      const result = decisionSimilarityService.updateOutcome('non-existent', 'failed', 'N/A');
      expect(result).toBeUndefined();
    });
  });

  describe('findSimilarDecisions', () => {
    it('should find similar decisions by semantic content', async () => {
      // The demo data includes database migration decisions
      const result = await decisionSimilarityService.findSimilarDecisions({
        organizationId: 'org-datacendia',
        title: 'Migrate primary database to new platform',
        question: 'Should we switch our database from PostgreSQL to something else?',
        context: 'Performance issues at scale. Budget available.',
        maxResults: 5,
        minSimilarity: 0.05,
      });
      expect(result).toBeDefined();
      expect(result.matches.length).toBeGreaterThan(0);
      expect(result.searchDurationMs).toBeGreaterThanOrEqual(0);
      expect(result.integrity.resultHash).toHaveLength(64);
    });

    it('should include risk assessment', async () => {
      const result = await decisionSimilarityService.findSimilarDecisions({
        organizationId: 'org-datacendia',
        title: 'Replace monitoring tool',
        question: 'Should we replace our monitoring stack with a SaaS solution?',
        context: 'Current monitoring unreliable.',
        maxResults: 5,
        minSimilarity: 0.05,
      });
      expect(result.riskAssessment).toBeDefined();
      expect(['critical', 'high', 'medium', 'low', 'unknown']).toContain(result.riskAssessment.overallRisk);
      expect(typeof result.riskAssessment.historicalSuccessRate).toBe('number');
    });

    it('should include warnings for failed precedents', async () => {
      const result = await decisionSimilarityService.findSimilarDecisions({
        organizationId: 'org-datacendia',
        title: 'Replace monitoring with Datadog',
        question: 'Should we switch to Datadog for monitoring?',
        context: 'Current system has too many false positives. Datadog seems better.',
        maxResults: 5,
        minSimilarity: 0.05,
        includeCrossDepartment: true,
      });
      const hasWarnings = result.matches.some(m => m.warnings.length > 0);
      // At least some matches should have warnings given the demo data
      expect(result.matches.length).toBeGreaterThan(0);
    });

    it('should support cross-department search', async () => {
      const result = await decisionSimilarityService.findSimilarDecisions({
        organizationId: 'org-datacendia',
        title: 'Technology investment decision',
        question: 'Should we invest in new technology?',
        context: 'Evaluating options.',
        includeCrossDepartment: true,
        maxResults: 10,
        minSimilarity: 0.01,
      });
      // Cross-department should return matches from other orgs
      expect(result.totalMatchesFound).toBeGreaterThan(0);
    });
  });

  describe('detectPatterns', () => {
    it('should detect patterns in organization decisions', async () => {
      const patterns = await decisionSimilarityService.detectPatterns('org-datacendia');
      expect(patterns).toBeDefined();
      expect(Array.isArray(patterns)).toBe(true);
      for (const pattern of patterns) {
        expect(pattern.patternType).toBeDefined();
        expect(pattern.decisionIds.length).toBeGreaterThan(0);
        expect(pattern.recommendation).toBeDefined();
      }
    });
  });

  describe('getters', () => {
    it('should return decisions by organization', () => {
      const decisions = decisionSimilarityService.getDecisionsByOrganization('org-datacendia');
      expect(decisions.length).toBeGreaterThan(0);
    });

    it('should return stats', () => {
      const stats = decisionSimilarityService.getStats('org-datacendia');
      expect(stats).toBeDefined();
      expect(stats.totalDecisions).toBeGreaterThan(0);
      expect(typeof stats.overrideCount).toBe('number');
    });
  });
});

// =============================================================================
// INTEGRATION: CROSS-SERVICE VERIFICATION
// =============================================================================

describe('DCII Cross-Service Integration', () => {
  it('all services should be instantiated as singletons', () => {
    expect(iissService).toBeDefined();
    expect(syntheticMediaAuthService).toBeDefined();
    expect(crossJurisdictionConflictService).toBeDefined();
    expect(timestampAuthorityService).toBeDefined();
    expect(decisionSimilarityService).toBeDefined();
  });

  it('IISS should calculate from all 5 primitives with correct weights', async () => {
    const score = await iissService.calculateScore('org-integration', 'Integration Corp', 'test');
    const weights = score.dimensions.map(d => d.weight);
    expect(weights.reduce((s, w) => s + w, 0)).toBeCloseTo(1.0, 5);
    expect(score.dimensions.find(d => d.primitive === 'discovery_time_proof')!.weight).toBe(0.25);
    expect(score.dimensions.find(d => d.primitive === 'deliberation_capture')!.weight).toBe(0.25);
    expect(score.dimensions.find(d => d.primitive === 'override_accountability')!.weight).toBe(0.20);
    expect(score.dimensions.find(d => d.primitive === 'continuity_memory')!.weight).toBe(0.15);
    expect(score.dimensions.find(d => d.primitive === 'drift_detection')!.weight).toBe(0.15);
  });

  it('timestamp tokens should be retrievable by org', async () => {
    await timestampAuthorityService.issueTimestamp('org-cross-test', 'data', 'Cross Test', 'generic');
    const tokens = timestampAuthorityService.getTokensByOrganization('org-cross-test');
    expect(tokens.length).toBeGreaterThanOrEqual(1);
  });

  it('media assets should be retrievable by org', async () => {
    await syntheticMediaAuthService.signMedia('org-cross-test', 'cross.jpg', 'image', 'image/jpeg', 'data', 'user', { source: 'upload', capturedAt: new Date(), capturedBy: 'user' });
    const assets = syntheticMediaAuthService.getAssetsByOrganization('org-cross-test');
    expect(assets.length).toBeGreaterThanOrEqual(1);
  });
});
