// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM - SPORTS VERTICAL
 * Unit Tests for SportsDecisionService
 * 
 * Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { SportsDecisionService } from '../../services/sports/SportsDecisionService.js';

describe('SportsDecisionService', () => {
  let service: SportsDecisionService;

  beforeEach(async () => {
    service = new SportsDecisionService();
    await service.initialize();
  });

  afterEach(async () => {
    await service.shutdown();
  });

  describe('healthCheck', () => {
    it('should return healthy status', async () => {
      const health = await service.healthCheck();
      expect(health.status).toBe('healthy');
      expect(health.details).toBeDefined();
      expect(health.details?.templates).toBeGreaterThan(0);
      expect(health.details?.frameworks).toBeGreaterThan(0);
    });
  });

  describe('getAvailableTemplates', () => {
    it('should return all decision templates', () => {
      const templates = service.getAvailableTemplates();
      expect(templates.length).toBeGreaterThan(0);
      expect(templates.some(t => t.category === 'transfer_inbound')).toBe(true);
      expect(templates.some(t => t.category === 'contract_new')).toBe(true);
    });
  });

  describe('getComplianceFrameworks', () => {
    it('should return all compliance frameworks', () => {
      const frameworks = service.getComplianceFrameworks();
      expect(frameworks.length).toBeGreaterThan(0);
      expect(frameworks.some(f => f.id === 'UEFA_FFP')).toBe(true);
      expect(frameworks.some(f => f.id === 'FIFA_AGENT_REGS')).toBe(true);
    });
  });

  describe('createTransferDecision', () => {
    it('should create a transfer decision with required fields', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-1',
          name: 'Test Player',
          dateOfBirth: new Date('1998-05-15'),
          nationality: 'Scottish',
          position: 'CM',
        },
        counterpartyClub: {
          id: 'club-1',
          name: 'Selling FC',
          country: 'England',
          league: 'Premier League',
          tier: 1,
        },
        transferFee: 8000000,
        addOns: 1500000,
        agentFee: 800000,
      });

      expect(decision.id).toBeDefined();
      expect(decision.id.startsWith('trf-')).toBe(true);
      expect(decision.status).toBe('draft');
      expect(decision.player.name).toBe('Test Player');
      expect(decision.transferFee).toBe(8000000);
      expect(decision.approvals.length).toBeGreaterThan(0);
      expect(decision.timeline.length).toBe(1);
      expect(decision.timeline[0].action).toBe('created');
    });

    it('should determine approvers based on total value', async () => {
      // High value decision should require board approval
      const highValueDecision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-2',
          name: 'Expensive Player',
          dateOfBirth: new Date('1995-01-01'),
          nationality: 'Brazilian',
          position: 'ST',
        },
        counterpartyClub: {
          id: 'club-2',
          name: 'Big Club FC',
          country: 'Spain',
          league: 'La Liga',
          tier: 1,
        },
        transferFee: 60000000, // £60M
        addOns: 10000000,
        agentFee: 5000000,
      });

      // Should have board approval required
      expect(highValueDecision.approvals.some(a => a.role === 'board')).toBe(true);
    });
  });

  describe('getTransferDecision', () => {
    it('should retrieve a created decision', async () => {
      const created = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-3',
          name: 'Retrieve Test Player',
          dateOfBirth: new Date('2000-03-20'),
          nationality: 'English',
          position: 'CB',
        },
        counterpartyClub: {
          id: 'club-3',
          name: 'Test FC',
          country: 'Germany',
          league: 'Bundesliga',
          tier: 1,
        },
        transferFee: 5000000,
      });

      const retrieved = await service.getTransferDecision(created.id);
      expect(retrieved).not.toBeNull();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.player.name).toBe('Retrieve Test Player');
    });

    it('should return null for non-existent decision', async () => {
      const result = await service.getTransferDecision('non-existent-id');
      expect(result).toBeNull();
    });
  });

  describe('addScoutingAssessment', () => {
    it('should add scouting assessment to decision', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-4',
          name: 'Scouting Test Player',
          dateOfBirth: new Date('1999-07-10'),
          nationality: 'French',
          position: 'LW',
        },
        counterpartyClub: {
          id: 'club-4',
          name: 'French Club',
          country: 'France',
          league: 'Ligue 1',
          tier: 1,
        },
        transferFee: 15000000,
      });

      const updated = await service.addScoutingAssessment(decision.id, 'scout-user-1', {
        matchesObserved: 12,
        videoAnalysisComplete: true,
        dataProfile: 'Top 15% for progressive carries',
        characterReferences: 3,
        recommendation: 'strong_buy',
      });

      expect(updated.scoutingAssessment.matchesObserved).toBe(12);
      expect(updated.scoutingAssessment.recommendation).toBe('strong_buy');
      expect(updated.timeline.some(t => t.action === 'scouting_assessment_added')).toBe(true);
    });
  });

  describe('addValuation', () => {
    it('should add valuation to decision', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-5',
          name: 'Valuation Test Player',
          dateOfBirth: new Date('1997-11-25'),
          nationality: 'Dutch',
          position: 'RB',
        },
        counterpartyClub: {
          id: 'club-5',
          name: 'Dutch Club',
          country: 'Netherlands',
          league: 'Eredivisie',
          tier: 1,
        },
        transferFee: 10000000,
      });

      const updated = await service.addValuation(decision.id, 'analyst-user-1', {
        methodology: 'Market comparable + data model blend',
        marketComparables: 'Similar profile transfers £8-12M',
        internalValuation: 9500000,
        dataValuation: 10200000,
        negotiatedFee: 10000000,
        premium: 5.2,
      });

      expect(updated.valuation.internalValuation).toBe(9500000);
      expect(updated.valuation.premium).toBe(5.2);
      expect(updated.timeline.some(t => t.action === 'valuation_added')).toBe(true);
    });
  });

  describe('addAlternative', () => {
    it('should add alternative player to decision', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-6',
          name: 'Primary Target',
          dateOfBirth: new Date('1998-02-14'),
          nationality: 'Spanish',
          position: 'CAM',
        },
        counterpartyClub: {
          id: 'club-6',
          name: 'Spanish Club',
          country: 'Spain',
          league: 'La Liga',
          tier: 1,
        },
        transferFee: 20000000,
      });

      await service.addAlternative(decision.id, 'user-test-123', {
        playerName: 'Alternative Player A',
        reason: 'Similar profile, younger',
        whyNotSelected: 'Higher fee (£25M), less proven',
      });

      const updated = await service.getTransferDecision(decision.id);
      expect(updated?.alternativesConsidered.length).toBe(1);
      expect(updated?.alternativesConsidered[0].playerName).toBe('Alternative Player A');
    });
  });

  describe('approval workflow', () => {
    it('should submit for approval and record approvals', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-7',
          name: 'Approval Test Player',
          dateOfBirth: new Date('1996-08-30'),
          nationality: 'Portuguese',
          position: 'CM',
        },
        counterpartyClub: {
          id: 'club-7',
          name: 'Portuguese Club',
          country: 'Portugal',
          league: 'Primeira Liga',
          tier: 1,
        },
        transferFee: 12000000,
      });

      // Submit for approval
      const submitted = await service.submitForApproval(decision.id, 'user-test-123');
      expect(submitted.status).toBe('pending_approval');

      // Record approval
      const pendingApproval = submitted.approvals.find(a => a.decision === 'pending');
      if (pendingApproval) {
        const approved = await service.recordApproval(
          decision.id,
          'approver-1',
          'John Smith',
          pendingApproval.role,
          true,
          'Approved - good value'
        );
        expect(approved.approvals.some(a => a.decision === 'approved')).toBe(true);
      }
    });

    it('should reject if any approver rejects', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-8',
          name: 'Rejection Test Player',
          dateOfBirth: new Date('1994-04-12'),
          nationality: 'Italian',
          position: 'GK',
        },
        counterpartyClub: {
          id: 'club-8',
          name: 'Italian Club',
          country: 'Italy',
          league: 'Serie A',
          tier: 1,
        },
        transferFee: 8000000,
      });

      await service.submitForApproval(decision.id, 'user-test-123');

      const pendingApproval = decision.approvals.find(a => a.decision === 'pending');
      if (pendingApproval) {
        const rejected = await service.recordApproval(
          decision.id,
          'approver-2',
          'Jane Doe',
          pendingApproval.role,
          false,
          'Too expensive for position need'
        );
        expect(rejected.status).toBe('rejected');
      }
    });
  });

  describe('completeDecision', () => {
    it('should lock decision when completed', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-9',
          name: 'Complete Test Player',
          dateOfBirth: new Date('1999-09-09'),
          nationality: 'Belgian',
          position: 'ST',
        },
        counterpartyClub: {
          id: 'club-9',
          name: 'Belgian Club',
          country: 'Belgium',
          league: 'Pro League',
          tier: 2,
        },
        transferFee: 5000000,
      });

      // Submit and approve
      await service.submitForApproval(decision.id, 'user-test-123');
      for (const approval of decision.approvals) {
        await service.recordApproval(
          decision.id,
          'approver-3',
          'Approver Name',
          approval.role,
          true
        );
      }

      // Complete
      const completed = await service.completeDecision(decision.id, 'user-test-123');
      expect(completed.status).toBe('completed');
      expect(completed.lockedAt).toBeDefined();
      expect(completed.auditHash).toBeDefined();
    });
  });

  describe('assessFFPImpact', () => {
    it('should calculate FFP impact correctly', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-10',
          name: 'FFP Test Player',
          dateOfBirth: new Date('1997-06-15'),
          nationality: 'German',
          position: 'CDM',
        },
        counterpartyClub: {
          id: 'club-10',
          name: 'German Club',
          country: 'Germany',
          league: 'Bundesliga',
          tier: 1,
        },
        transferFee: 20000000,
        agentFee: 2000000,
      });

      // Add wages
      await service.updateTransferDecision(decision.id, 'user-test-123', {
        wages: {
          weekly: 80000,
          contractLength: 4,
          totalValue: 16640000,
        },
      });

      const assessment = await service.assessFFPImpact(decision.id, {
        breakEvenPosition: 50000000,
        squadCostRatio: 65,
      });

      expect(assessment.decisionId).toBe(decision.id);
      expect(assessment.immediateImpact.cashOutflow).toBe(22000000); // fee + agent
      expect(assessment.risk).toBeDefined();
      expect(['low', 'medium', 'high', 'critical']).toContain(assessment.risk);
    });
  });

  describe('exportDecisionRecord', () => {
    it('should export decision with compliance mapping', async () => {
      const decision = await service.createTransferDecision({
        organizationId: 'org-test-123',
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: {
          id: 'player-11',
          name: 'Export Test Player',
          dateOfBirth: new Date('1998-12-01'),
          nationality: 'Croatian',
          position: 'CB',
        },
        counterpartyClub: {
          id: 'club-11',
          name: 'Croatian Club',
          country: 'Croatia',
          league: 'HNL',
          tier: 2,
        },
        transferFee: 3000000,
      });

      const exported = await service.exportDecisionRecord(decision.id);
      expect(exported.decision).toBeDefined();
      expect(exported.complianceMapping).toBeDefined();
      expect(exported.integrityVerified).toBeDefined();
    });
  });

  describe('getOrganizationDecisions', () => {
    it('should retrieve all decisions for an organization', async () => {
      const orgId = 'org-list-test-' + Date.now();

      // Create multiple decisions
      await service.createTransferDecision({
        organizationId: orgId,
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: { id: 'p1', name: 'Player 1', dateOfBirth: new Date(), nationality: 'Test', position: 'ST' },
        counterpartyClub: { id: 'c1', name: 'Club 1', country: 'Test', league: 'Test', tier: 1 },
        transferFee: 1000000,
      });

      await service.createTransferDecision({
        organizationId: orgId,
        userId: 'user-test-123',
        templateId: 'transfer-outbound-v1',
        transactionType: 'outbound',
        player: { id: 'p2', name: 'Player 2', dateOfBirth: new Date(), nationality: 'Test', position: 'GK' },
        counterpartyClub: { id: 'c2', name: 'Club 2', country: 'Test', league: 'Test', tier: 1 },
        transferFee: 2000000,
      });

      const decisions = await service.getOrganizationDecisions(orgId);
      expect(decisions.length).toBe(2);
    });

    it('should filter by type', async () => {
      const orgId = 'org-filter-test-' + Date.now();

      await service.createTransferDecision({
        organizationId: orgId,
        userId: 'user-test-123',
        templateId: 'transfer-inbound-v1',
        transactionType: 'inbound',
        player: { id: 'p3', name: 'Player 3', dateOfBirth: new Date(), nationality: 'Test', position: 'CM' },
        counterpartyClub: { id: 'c3', name: 'Club 3', country: 'Test', league: 'Test', tier: 1 },
        transferFee: 3000000,
      });

      const transferDecisions = await service.getOrganizationDecisions(orgId, { type: 'transfer' });
      expect(transferDecisions.length).toBe(1);

      const contractDecisions = await service.getOrganizationDecisions(orgId, { type: 'contract' });
      expect(contractDecisions.length).toBe(0);
    });
  });
});
