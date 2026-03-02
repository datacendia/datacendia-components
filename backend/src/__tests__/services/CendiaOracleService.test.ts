/**
 * Module — Cendia Oracle Service Test
 *
 * Platform module.
 * @module __tests__/services/CendiaOracleService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaOracle™ Service Tests
 * Truth Arbiter - Verification of disputed facts
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { CendiaOracleService } from '../../services/sovereign/CendiaOracleService.js';

describe('CendiaOracleService', () => {
  let service: CendiaOracleService;
  const testOrgId = 'org-test-123';

  beforeEach(() => {
    service = new CendiaOracleService();
  });

  describe('Truth Claims', () => {
    it('should submit a new truth claim', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Q4 Revenue',
        claim: 'Q4 revenue exceeded $10M',
        claimant: 'Finance Team',
        metadata: { source: 'quarterly_report' },
      });

      expect(claim.id).toMatch(/^claim-/);
      expect(claim.status).toBe('pending');
      expect(claim.evidence).toEqual([]);
      expect(claim.verification).toBeNull();
    });

    it('should retrieve a claim by ID', async () => {
      const submitted = await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'User Growth',
        claim: 'User base grew 25%',
        claimant: 'Growth Team',
        metadata: {},
      });

      const retrieved = await service.getClaim(submitted.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(submitted.id);
    });

    it('should return null for non-existent claim', async () => {
      const result = await service.getClaim('claim-nonexistent');
      expect(result).toBeNull();
    });

    it('should filter claims by organization', async () => {
      await service.submitClaim({
        organizationId: testOrgId,
        category: 'event',
        subject: 'Product Launch',
        claim: 'Product launched on time',
        claimant: 'PM',
        metadata: {},
      });

      await service.submitClaim({
        organizationId: 'other-org',
        category: 'event',
        subject: 'Other Event',
        claim: 'Something happened',
        claimant: 'Someone',
        metadata: {},
      });

      const claims = await service.getClaimsForOrg(testOrgId);
      expect(claims.length).toBe(1);
      expect(claims[0].organizationId).toBe(testOrgId);
    });

    it('should filter claims by status', async () => {
      await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Test 1',
        claim: 'Claim 1',
        claimant: 'User',
        metadata: {},
      });

      const pendingClaims = await service.getClaimsForOrg(testOrgId, { status: 'pending' });
      expect(pendingClaims.length).toBe(1);

      const verifiedClaims = await service.getClaimsForOrg(testOrgId, { status: 'verified' });
      expect(verifiedClaims.length).toBe(0);
    });

    it('should filter claims by category', async () => {
      await service.submitClaim({
        organizationId: testOrgId,
        category: 'forecast',
        subject: 'Revenue Forecast',
        claim: 'Will hit $20M',
        claimant: 'CFO',
        metadata: {},
      });

      const forecasts = await service.getClaimsForOrg(testOrgId, { category: 'forecast' });
      expect(forecasts.length).toBe(1);
      expect(forecasts[0].category).toBe('forecast');
    });
  });

  describe('Evidence Management', () => {
    it('should submit evidence for a claim', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'Performance',
        claim: 'System uptime was 99.9%',
        claimant: 'DevOps',
        metadata: {},
      });

      const evidence = await service.submitEvidence(claim.id, {
        type: 'data_source',
        source: 'monitoring-system',
        content: { uptime: 99.92 },
        reliability: 95,
        submittedBy: 'admin',
      });

      expect(evidence).not.toBeNull();
      expect(evidence?.id).toMatch(/^evidence-/);
      expect(evidence?.claimId).toBe(claim.id);
    });

    it('should return null when submitting evidence for non-existent claim', async () => {
      const result = await service.submitEvidence('claim-fake', {
        type: 'document',
        source: 'report.pdf',
        content: {},
        reliability: 80,
        submittedBy: 'user',
      });

      expect(result).toBeNull();
    });

    it('should retrieve all evidence for a claim', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'statement',
        subject: 'Policy Compliance',
        claim: 'All policies met',
        claimant: 'Compliance',
        metadata: {},
      });

      await service.submitEvidence(claim.id, {
        type: 'audit_log',
        source: 'audit-system',
        content: { passed: true },
        reliability: 90,
        submittedBy: 'auditor1',
      });

      await service.submitEvidence(claim.id, {
        type: 'document',
        source: 'compliance-report.pdf',
        content: { status: 'compliant' },
        reliability: 85,
        submittedBy: 'auditor2',
      });

      const evidence = await service.getEvidenceForClaim(claim.id);
      expect(evidence.length).toBe(2);
    });
  });

  describe('Verification', () => {
    it('should return inconclusive for claim with no evidence', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Test',
        claim: 'Some claim',
        claimant: 'User',
        metadata: {},
      });

      const result = await service.verifyClaim(claim.id, 'verifier');
      expect(result).not.toBeNull();
      expect(result?.verdict).toBe('inconclusive');
      expect(result?.confidence).toBe(0);
      expect(result?.reasoning).toContain('No evidence submitted');
    });

    it('should verify claim as true with strong supporting evidence', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'Sales',
        claim: 'Sales increased',
        claimant: 'Sales Team',
        metadata: {},
      });

      // Add high-reliability evidence
      await service.submitEvidence(claim.id, {
        type: 'data_source',
        source: 'crm-system',
        content: { increase: 15 },
        reliability: 95,
        submittedBy: 'analyst',
      });

      await service.submitEvidence(claim.id, {
        type: 'calculation',
        source: 'financial-model',
        content: { verified: true },
        reliability: 90,
        submittedBy: 'finance',
      });

      const result = await service.verifyClaim(claim.id, 'verifier');
      expect(result?.verdict).toBe('true');
      expect(result?.confidence).toBeGreaterThan(50);
    });

    it('should verify claim as false with contradicting evidence', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'statement',
        subject: 'Attendance',
        claim: 'All attended meeting',
        claimant: 'Manager',
        metadata: {},
      });

      // Add low-reliability contradicting evidence
      await service.submitEvidence(claim.id, {
        type: 'witness',
        source: 'witness-1',
        content: { attended: false },
        reliability: 20,
        submittedBy: 'hr',
      });

      await service.submitEvidence(claim.id, {
        type: 'audit_log',
        source: 'access-logs',
        content: { missing: ['user1', 'user2'] },
        reliability: 15,
        submittedBy: 'security',
      });

      const result = await service.verifyClaim(claim.id, 'verifier');
      expect(result?.verdict).toBe('false');
    });

    it('should return null for non-existent claim verification', async () => {
      const result = await service.verifyClaim('claim-fake', 'verifier');
      expect(result).toBeNull();
    });

    it('should update claim status after verification', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Test',
        claim: 'Test claim',
        claimant: 'Tester',
        metadata: {},
      });

      await service.verifyClaim(claim.id, 'verifier');

      const updated = await service.getClaim(claim.id);
      expect(updated?.status).not.toBe('pending');
      expect(updated?.resolvedAt).not.toBeNull();
    });
  });

  describe('Disputes', () => {
    it('should file a dispute against a claim', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'Budget',
        claim: 'Under budget',
        claimant: 'Finance',
        metadata: {},
      });

      const dispute = await service.fileDispute({
        organizationId: testOrgId,
        claimId: claim.id,
        disputant: 'Operations',
        counterClaim: 'Actually over budget by 5%',
      });

      expect(dispute.id).toMatch(/^dispute-/);
      expect(dispute.status).toBe('open');
      expect(dispute.claimId).toBe(claim.id);
    });

    it('should mark claim as disputed when dispute filed', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'event',
        subject: 'Delivery',
        claim: 'Delivered on time',
        claimant: 'Logistics',
        metadata: {},
      });

      await service.fileDispute({
        organizationId: testOrgId,
        claimId: claim.id,
        disputant: 'Customer',
        counterClaim: 'Was late by 2 days',
      });

      const updated = await service.getClaim(claim.id);
      expect(updated?.status).toBe('disputed');
    });

    it('should resolve a dispute', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Count',
        claim: 'Count is 100',
        claimant: 'Counter',
        metadata: {},
      });

      const dispute = await service.fileDispute({
        organizationId: testOrgId,
        claimId: claim.id,
        disputant: 'Auditor',
        counterClaim: 'Count is 98',
      });

      const resolved = await service.resolveDispute(dispute.id, 'Final count confirmed as 99');
      expect(resolved?.status).toBe('resolved');
      expect(resolved?.resolution).toBe('Final count confirmed as 99');
      expect(resolved?.resolvedAt).not.toBeNull();
    });

    it('should return null when resolving non-existent dispute', async () => {
      const result = await service.resolveDispute('dispute-fake', 'resolution');
      expect(result).toBeNull();
    });

    it('should get disputes for organization', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'statement',
        subject: 'Test',
        claim: 'Test claim',
        claimant: 'Tester',
        metadata: {},
      });

      await service.fileDispute({
        organizationId: testOrgId,
        claimId: claim.id,
        disputant: 'Disputant 1',
        counterClaim: 'Counter 1',
      });

      await service.fileDispute({
        organizationId: testOrgId,
        claimId: claim.id,
        disputant: 'Disputant 2',
        counterClaim: 'Counter 2',
      });

      const disputes = await service.getDisputesForOrg(testOrgId);
      expect(disputes.length).toBe(2);
    });
  });

  describe('Consensus Voting', () => {
    it('should cast a vote on a pending claim', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'forecast',
        subject: 'Projection',
        claim: 'Will grow 20%',
        claimant: 'Strategy',
        metadata: {},
      });

      const vote = await service.castVote(claim.id, {
        voterId: 'voter-1',
        voterRole: 'analyst',
        vote: 'support',
        rationale: 'Data supports this projection',
      });

      expect(vote).not.toBeNull();
      expect(vote?.vote).toBe('support');
      expect(vote?.claimId).toBe(claim.id);
    });

    it('should update existing vote from same voter', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'KPI',
        claim: 'KPI met',
        claimant: 'Manager',
        metadata: {},
      });

      await service.castVote(claim.id, {
        voterId: 'voter-1',
        voterRole: 'analyst',
        vote: 'support',
        rationale: 'Initial support',
      });

      const updatedVote = await service.castVote(claim.id, {
        voterId: 'voter-1',
        voterRole: 'analyst',
        vote: 'oppose',
        rationale: 'Changed mind after review',
      });

      expect(updatedVote?.vote).toBe('oppose');
      expect(updatedVote?.rationale).toBe('Changed mind after review');
    });

    it('should not allow voting on non-pending claims', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Test',
        claim: 'Test',
        claimant: 'Tester',
        metadata: {},
      });

      // Verify the claim (changes status from pending)
      await service.verifyClaim(claim.id, 'verifier');

      const vote = await service.castVote(claim.id, {
        voterId: 'voter-1',
        voterRole: 'analyst',
        vote: 'support',
        rationale: 'Too late',
      });

      expect(vote).toBeNull();
    });

    it('should get vote summary for a claim', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'statement',
        subject: 'Policy',
        claim: 'Policy effective',
        claimant: 'Legal',
        metadata: {},
      });

      await service.castVote(claim.id, { voterId: 'v1', voterRole: 'analyst', vote: 'support', rationale: 'Yes' });
      await service.castVote(claim.id, { voterId: 'v2', voterRole: 'manager', vote: 'support', rationale: 'Agree' });
      await service.castVote(claim.id, { voterId: 'v3', voterRole: 'director', vote: 'oppose', rationale: 'No' });
      await service.castVote(claim.id, { voterId: 'v4', voterRole: 'analyst', vote: 'abstain', rationale: 'Unsure' });

      const result = await service.getVotesForClaim(claim.id);
      expect(result.votes.length).toBe(4);
      expect(result.summary.support).toBe(2);
      expect(result.summary.oppose).toBe(1);
      expect(result.summary.abstain).toBe(1);
    });
  });

  describe('Source Reliability', () => {
    it('should track source reliability over time', async () => {
      const claim1 = await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Test 1',
        claim: 'Claim 1',
        claimant: 'Source',
        metadata: {},
      });

      await service.submitEvidence(claim1.id, {
        type: 'data_source',
        source: 'reliable-source',
        content: {},
        reliability: 90,
        submittedBy: 'analyst',
      });

      await service.verifyClaim(claim1.id, 'verifier');

      const reliability = await service.getSourceReliability('reliable-source');
      expect(reliability).not.toBeNull();
      expect(reliability?.totalClaims).toBe(1);
    });

    it('should return null for unknown source', async () => {
      const result = await service.getSourceReliability('unknown-source');
      expect(result).toBeNull();
    });

    it('should get all source reliabilities sorted by score', async () => {
      // Create claims with evidence from different sources
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'Test',
        claim: 'Test claim',
        claimant: 'Tester',
        metadata: {},
      });

      await service.submitEvidence(claim.id, {
        type: 'data_source',
        source: 'source-a',
        content: {},
        reliability: 95,
        submittedBy: 'analyst',
      });

      await service.submitEvidence(claim.id, {
        type: 'data_source',
        source: 'source-b',
        content: {},
        reliability: 70,
        submittedBy: 'analyst',
      });

      await service.verifyClaim(claim.id, 'verifier');

      const reliabilities = await service.getAllSourceReliabilities(testOrgId);
      expect(reliabilities.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Dashboard', () => {
    it('should return dashboard statistics', async () => {
      // Create some claims
      await service.submitClaim({
        organizationId: testOrgId,
        category: 'data',
        subject: 'Test 1',
        claim: 'Claim 1',
        claimant: 'User',
        metadata: {},
      });

      await service.submitClaim({
        organizationId: testOrgId,
        category: 'metric',
        subject: 'Test 2',
        claim: 'Claim 2',
        claimant: 'User',
        metadata: {},
      });

      const dashboard = await service.getDashboard(testOrgId);

      expect(dashboard.totalClaims).toBe(2);
      expect(dashboard.pending).toBe(2);
      expect(dashboard.verified).toBe(0);
      expect(dashboard.disputed).toBe(0);
      expect(dashboard.claimsByCategory).toHaveProperty('data');
      expect(dashboard.claimsByCategory).toHaveProperty('metric');
    });

    it('should calculate average confidence for verified claims', async () => {
      const claim = await service.submitClaim({
        organizationId: testOrgId,
        category: 'statement',
        subject: 'Test',
        claim: 'Verified claim',
        claimant: 'User',
        metadata: {},
      });

      await service.submitEvidence(claim.id, {
        type: 'data_source',
        source: 'source',
        content: {},
        reliability: 95,
        submittedBy: 'analyst',
      });

      await service.verifyClaim(claim.id, 'verifier');

      const dashboard = await service.getDashboard(testOrgId);
      expect(dashboard.avgConfidence).toBeGreaterThan(0);
    });
  });
});
