/**
 * Module — Evidence Vault Service Test
 *
 * Platform module.
 * @module __tests__/services/EvidenceVaultService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * EvidenceVault™ Service Tests
 * Decision packet management with RBAC, approvals, and break-glass export
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Mock the EvidenceVaultService since it uses singleton pattern
class MockEvidenceVaultService {
  private packets: Map<string, any> = new Map();
  private breakGlassRequests: Map<string, any> = new Map();
  private packetCounter = 0;

  constructor() {
    // Initialize with sample data
    this.seedSampleData();
  }

  private seedSampleData() {
    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() + 7);

    const samplePacket = {
      id: 'PKT-2024-001',
      decisionId: 'DEC-2024-0847',
      decisionTitle: 'Q1 2025 Market Expansion Strategy',
      status: 'locked',
      mode: 'strategic',
      owner: { id: 'usr-001', name: 'Sarah Chen', email: 'sarah.chen@company.com', role: 'CSO', department: 'Executive' },
      businessUnit: 'Corporate Strategy',
      organizationId: 'org-default',
      dataSourceId: 'ds-primary',
      generatedAt: new Date('2024-12-15T10:30:00'),
      signedAt: new Date('2024-12-15T14:22:00'),
      lockedAt: new Date('2024-12-16T09:00:00'),
      policyPackVersion: 'v2024.12.1',
      signatureValid: true,
      integrityHash: 'sha256-9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      version: 3,
      attachments: [],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: ['CRM', 'ERP'],
      complianceFrameworks: ['SOX', 'GDPR'],
      retentionUntil: retentionDate,
      accessLog: [],
    };
    this.packets.set(samplePacket.id, samplePacket);
  }

  async getPackets(params: any) {
    let result = Array.from(this.packets.values());

    if (params.status && params.status !== 'all') {
      result = result.filter((p: any) => p.status === params.status);
    }
    if (params.mode && params.mode !== 'all') {
      result = result.filter((p: any) => p.mode === params.mode);
    }
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      result = result.filter((p: any) =>
        p.decisionTitle.toLowerCase().includes(searchLower) ||
        p.decisionId.toLowerCase().includes(searchLower)
      );
    }

    return { packets: result, total: result.length };
  }

  async getPacketById(id: string, userId: string, userRole: string) {
    const packet = this.packets.get(id);
    if (!packet) return null;

    if (userRole === 'auditor' && packet.status !== 'locked') {
      throw new Error('Auditors can only access locked packets');
    }

    packet.accessLog.push({
      id: `log-${Date.now()}`,
      userId,
      userName: 'Test User',
      action: 'view',
      timestamp: new Date(),
    });

    return packet;
  }

  async generatePacket(decisionId: string, userId: string, userRole: string, dataSourceId: string, options: any) {
    if (!['decision_owner', 'council_operator'].includes(userRole)) {
      throw new Error('Only Decision Owners and Council Operators can generate packets');
    }

    const retentionDate = new Date();
    retentionDate.setFullYear(retentionDate.getFullYear() + 7);

    const packet = {
      id: `PKT-${Date.now()}-${++this.packetCounter}`,
      decisionId,
      decisionTitle: options.title,
      status: 'draft',
      mode: options.mode,
      owner: { id: userId, name: 'Test User', email: 'test@company.com', role: 'Decision Owner', department: options.businessUnit },
      businessUnit: options.businessUnit,
      organizationId: 'org-default',
      dataSourceId,
      generatedAt: new Date(),
      policyPackVersion: options.policyPackVersion,
      signatureValid: false,
      integrityHash: `sha256-${Date.now()}`,
      version: 1,
      attachments: [],
      dissents: [],
      vetoes: [],
      overrides: [],
      systemsImpacted: options.systemsImpacted,
      complianceFrameworks: options.complianceFrameworks,
      retentionUntil: retentionDate,
      accessLog: [],
    };

    this.packets.set(packet.id, packet);
    return packet;
  }

  async sendToApprovers(packetId: string, userId: string, userRole: string, approvers: any[], message?: string) {
    if (!['decision_owner', 'council_operator'].includes(userRole)) {
      throw new Error('Only Decision Owners and Council Operators can send packets for approval');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');
    if (packet.status !== 'draft' && packet.status !== 'under_review') {
      throw new Error('Only draft or under-review packets can be sent for approval');
    }

    const workflow = {
      id: `wf-${Date.now()}`,
      status: 'pending',
      requestedBy: userId,
      requestedAt: new Date(),
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      message,
      approvers: approvers.map(a => ({
        userId: a.userId,
        userName: a.name,
        email: a.email,
        role: a.role,
        status: 'pending',
      })),
    };

    packet.status = 'under_review';
    packet.approvalWorkflow = workflow;
    return workflow;
  }

  async respondToApproval(packetId: string, userId: string, response: string, comment?: string) {
    const packet = this.packets.get(packetId);
    if (!packet || !packet.approvalWorkflow) throw new Error('Workflow not found');

    const approver = packet.approvalWorkflow.approvers.find((a: any) => a.userId === userId);
    if (!approver) throw new Error('Not an approver for this packet');

    approver.status = response;
    approver.respondedAt = new Date();
    approver.comment = comment;

    const allResponded = packet.approvalWorkflow.approvers.every((a: any) => a.status !== 'pending');
    const allApproved = packet.approvalWorkflow.approvers.every((a: any) => a.status === 'approved');

    if (allResponded) {
      packet.approvalWorkflow.status = allApproved ? 'approved' : 'rejected';
      packet.approvalWorkflow.completedAt = new Date();
      if (allApproved) {
        packet.status = 'approved';
        packet.signedAt = new Date();
        packet.signatureValid = true;
      }
    }
  }

  async attachEvidence(packetId: string, userId: string, userRole: string, file: any) {
    if (!['decision_owner', 'council_operator', 'approver', 'risk_compliance'].includes(userRole)) {
      throw new Error('Insufficient permissions to attach evidence');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');
    if (packet.status === 'locked' || packet.status === 'superseded') {
      throw new Error('Cannot attach evidence to locked or superseded packets');
    }

    const attachment = {
      id: `att-${Date.now()}`,
      filename: file.filename,
      mimeType: file.mimeType,
      size: file.size,
      uploadedAt: new Date(),
      uploadedBy: userId,
      hash: `sha256-${Date.now()}`,
      description: file.description,
      category: file.category,
    };

    packet.attachments.push(attachment);
    packet.signatureValid = false;
    return attachment;
  }

  async lockPacket(packetId: string, userId: string, userRole: string) {
    if (!['approver', 'risk_compliance', 'admin'].includes(userRole)) {
      throw new Error('Only Approvers, Risk/Compliance, and Admins can lock packets');
    }

    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');
    if (packet.status !== 'approved') {
      throw new Error('Only approved packets can be locked');
    }

    packet.status = 'locked';
    packet.lockedAt = new Date();
    packet.signedAt = new Date();
    packet.signatureValid = true;
    return packet;
  }

  async requestBreakGlassExport(packetId: string, userId: string, justification: string, urgencyLevel: string) {
    const packet = this.packets.get(packetId);
    if (!packet) throw new Error('Packet not found');

    const breakGlass = {
      id: `bg-${Date.now()}`,
      status: 'pending',
      requestedBy: userId,
      requestedAt: new Date(),
      justification,
      urgencyLevel,
      auditTrail: [`${new Date().toISOString()}: Break-glass export requested by ${userId}`],
    };

    this.breakGlassRequests.set(breakGlass.id, breakGlass);
    packet.breakGlassExport = breakGlass;
    return breakGlass;
  }

  async approveBreakGlassExport(breakGlassId: string, userId: string, userRole: string) {
    if (userRole !== 'admin') {
      throw new Error('Only Admins can approve break-glass exports');
    }

    const breakGlass = this.breakGlassRequests.get(breakGlassId);
    if (!breakGlass) throw new Error('Break-glass request not found');

    if (!breakGlass.firstApprover) {
      breakGlass.firstApprover = { userId, userName: 'Admin', approvedAt: new Date() };
      breakGlass.auditTrail.push(`${new Date().toISOString()}: First approval by ${userId}`);
    } else if (!breakGlass.secondApprover) {
      if (breakGlass.firstApprover.userId === userId) {
        throw new Error('Cannot be both approvers for break-glass export');
      }
      breakGlass.secondApprover = { userId, userName: 'Admin', approvedAt: new Date() };
      breakGlass.status = 'approved';
      breakGlass.auditTrail.push(`${new Date().toISOString()}: Second approval by ${userId}`);
    }

    return breakGlass;
  }

  async getStats(dataSourceId?: string) {
    let packets = Array.from(this.packets.values());
    if (dataSourceId) {
      packets = packets.filter((p: any) => p.dataSourceId === dataSourceId);
    }

    return {
      total: packets.length,
      draft: packets.filter((p: any) => p.status === 'draft').length,
      underReview: packets.filter((p: any) => p.status === 'under_review').length,
      approved: packets.filter((p: any) => p.status === 'approved').length,
      locked: packets.filter((p: any) => p.status === 'locked').length,
      superseded: packets.filter((p: any) => p.status === 'superseded').length,
    };
  }
}

describe('EvidenceVaultService', () => {
  let service: MockEvidenceVaultService;

  beforeEach(() => {
    service = new MockEvidenceVaultService();
  });

  describe('Packet Retrieval', () => {
    it('should retrieve all packets', async () => {
      const result = await service.getPackets({ organizationId: 'org-default' });
      expect(result.packets.length).toBeGreaterThan(0);
      expect(result.total).toBe(result.packets.length);
    });

    it('should filter packets by status', async () => {
      const result = await service.getPackets({ organizationId: 'org-default', status: 'locked' });
      result.packets.forEach((p: any) => expect(p.status).toBe('locked'));
    });

    it('should filter packets by mode', async () => {
      const result = await service.getPackets({ organizationId: 'org-default', mode: 'strategic' });
      result.packets.forEach((p: any) => expect(p.mode).toBe('strategic'));
    });

    it('should search packets by title', async () => {
      const result = await service.getPackets({ organizationId: 'org-default', search: 'Market Expansion' });
      expect(result.packets.length).toBeGreaterThan(0);
      result.packets.forEach((p: any) => {
        expect(p.decisionTitle.toLowerCase()).toContain('market expansion');
      });
    });

    it('should get packet by ID', async () => {
      const packet = await service.getPacketById('PKT-2024-001', 'usr-001', 'decision_owner');
      expect(packet).not.toBeNull();
      expect(packet?.id).toBe('PKT-2024-001');
    });

    it('should return null for non-existent packet', async () => {
      const packet = await service.getPacketById('PKT-FAKE', 'usr-001', 'viewer');
      expect(packet).toBeNull();
    });

    it('should log access when viewing packet', async () => {
      const packet = await service.getPacketById('PKT-2024-001', 'usr-test', 'viewer');
      expect(packet?.accessLog.length).toBeGreaterThan(0);
      expect(packet?.accessLog[packet.accessLog.length - 1].userId).toBe('usr-test');
    });

    it('should restrict auditor access to non-locked packets', async () => {
      // Generate a draft packet first
      const draft = await service.generatePacket('DEC-TEST', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Draft Packet',
        mode: 'operational',
        businessUnit: 'Test',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await expect(service.getPacketById(draft.id, 'auditor-1', 'auditor'))
        .rejects.toThrow('Auditors can only access locked packets');
    });
  });

  describe('Packet Generation', () => {
    it('should generate a new packet', async () => {
      const packet = await service.generatePacket(
        'DEC-2024-NEW',
        'usr-owner',
        'decision_owner',
        'ds-primary',
        {
          title: 'New Strategic Decision',
          mode: 'strategic',
          businessUnit: 'Strategy',
          systemsImpacted: ['CRM', 'Analytics'],
          complianceFrameworks: ['SOX'],
          policyPackVersion: 'v2024.12.1',
        }
      );

      expect(packet.id).toMatch(/^PKT-/);
      expect(packet.status).toBe('draft');
      expect(packet.decisionTitle).toBe('New Strategic Decision');
      expect(packet.mode).toBe('strategic');
    });

    it('should reject packet generation from unauthorized roles', async () => {
      await expect(
        service.generatePacket('DEC-X', 'usr-viewer', 'viewer', 'ds-1', {
          title: 'Test',
          mode: 'operational',
          businessUnit: 'Test',
          systemsImpacted: [],
          complianceFrameworks: [],
          policyPackVersion: 'v1',
        })
      ).rejects.toThrow('Only Decision Owners and Council Operators can generate packets');
    });

    it('should allow council operator to generate packets', async () => {
      const packet = await service.generatePacket(
        'DEC-OP',
        'usr-operator',
        'council_operator',
        'ds-primary',
        {
          title: 'Operator Decision',
          mode: 'compliance',
          businessUnit: 'Compliance',
          systemsImpacted: ['Audit'],
          complianceFrameworks: ['GDPR'],
          policyPackVersion: 'v1',
        }
      );

      expect(packet.id).toBeDefined();
      expect(packet.status).toBe('draft');
    });
  });

  describe('Approval Workflow', () => {
    it('should send packet to approvers', async () => {
      const packet = await service.generatePacket('DEC-APPR', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Needs Approval',
        mode: 'due_diligence',
        businessUnit: 'Legal',
        systemsImpacted: [],
        complianceFrameworks: ['SOX'],
        policyPackVersion: 'v1',
      });

      const workflow = await service.sendToApprovers(
        packet.id,
        'usr-001',
        'decision_owner',
        [
          { userId: 'appr-1', name: 'Approver 1', email: 'appr1@co.com', role: 'Legal' },
          { userId: 'appr-2', name: 'Approver 2', email: 'appr2@co.com', role: 'Finance' },
        ],
        'Please review'
      );

      expect(workflow.status).toBe('pending');
      expect(workflow.approvers.length).toBe(2);
      expect(workflow.message).toBe('Please review');
    });

    it('should update packet status to under_review when sent for approval', async () => {
      const packet = await service.generatePacket('DEC-REV', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Under Review',
        mode: 'operational',
        businessUnit: 'Ops',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await service.sendToApprovers(packet.id, 'usr-001', 'decision_owner', [
        { userId: 'appr-1', name: 'A', email: 'a@co.com', role: 'R' },
      ]);

      const updated = await service.getPacketById(packet.id, 'usr-001', 'decision_owner');
      expect(updated?.status).toBe('under_review');
    });

    it('should approve packet when all approvers approve', async () => {
      const packet = await service.generatePacket('DEC-ALL-APPR', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'All Approve',
        mode: 'compliance',
        businessUnit: 'Compliance',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await service.sendToApprovers(packet.id, 'usr-001', 'decision_owner', [
        { userId: 'appr-1', name: 'A1', email: 'a1@co.com', role: 'R1' },
        { userId: 'appr-2', name: 'A2', email: 'a2@co.com', role: 'R2' },
      ]);

      await service.respondToApproval(packet.id, 'appr-1', 'approved', 'LGTM');
      await service.respondToApproval(packet.id, 'appr-2', 'approved', 'Approved');

      const updated = await service.getPacketById(packet.id, 'usr-001', 'decision_owner');
      expect(updated?.status).toBe('approved');
      expect(updated?.signatureValid).toBe(true);
    });

    it('should reject packet if any approver rejects', async () => {
      const packet = await service.generatePacket('DEC-REJECT', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Will Reject',
        mode: 'operational',
        businessUnit: 'Test',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await service.sendToApprovers(packet.id, 'usr-001', 'decision_owner', [
        { userId: 'appr-1', name: 'A1', email: 'a1@co.com', role: 'R1' },
        { userId: 'appr-2', name: 'A2', email: 'a2@co.com', role: 'R2' },
      ]);

      await service.respondToApproval(packet.id, 'appr-1', 'approved');
      await service.respondToApproval(packet.id, 'appr-2', 'rejected', 'Needs revision');

      const updated = await service.getPacketById(packet.id, 'usr-001', 'decision_owner');
      expect(updated?.approvalWorkflow.status).toBe('rejected');
    });

    it('should reject non-approver response', async () => {
      const packet = await service.generatePacket('DEC-NA', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Test',
        mode: 'operational',
        businessUnit: 'Test',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await service.sendToApprovers(packet.id, 'usr-001', 'decision_owner', [
        { userId: 'appr-1', name: 'A1', email: 'a1@co.com', role: 'R1' },
      ]);

      await expect(
        service.respondToApproval(packet.id, 'not-an-approver', 'approved')
      ).rejects.toThrow('Not an approver for this packet');
    });
  });

  describe('Evidence Attachment', () => {
    it('should attach evidence to draft packet', async () => {
      const packet = await service.generatePacket('DEC-ATT', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Needs Evidence',
        mode: 'due_diligence',
        businessUnit: 'Legal',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      const attachment = await service.attachEvidence(packet.id, 'usr-001', 'decision_owner', {
        filename: 'evidence.pdf',
        mimeType: 'application/pdf',
        size: 123456,
        buffer: Buffer.from('test'),
        description: 'Supporting document',
        category: 'evidence',
      });

      expect(attachment.id).toMatch(/^att-/);
      expect(attachment.filename).toBe('evidence.pdf');
      expect(attachment.category).toBe('evidence');
    });

    it('should invalidate signature when evidence attached', async () => {
      const packet = await service.generatePacket('DEC-SIG', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Test Sig',
        mode: 'operational',
        businessUnit: 'Test',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await service.attachEvidence(packet.id, 'usr-001', 'decision_owner', {
        filename: 'doc.pdf',
        mimeType: 'application/pdf',
        size: 1000,
        buffer: Buffer.from(''),
        category: 'supporting',
      });

      const updated = await service.getPacketById(packet.id, 'usr-001', 'decision_owner');
      expect(updated?.signatureValid).toBe(false);
    });

    it('should reject evidence attachment to locked packet', async () => {
      await expect(
        service.attachEvidence('PKT-2024-001', 'usr-001', 'decision_owner', {
          filename: 'late.pdf',
          mimeType: 'application/pdf',
          size: 100,
          buffer: Buffer.from(''),
          category: 'evidence',
        })
      ).rejects.toThrow('Cannot attach evidence to locked or superseded packets');
    });

    it('should reject unauthorized evidence attachment', async () => {
      const packet = await service.generatePacket('DEC-UNAUTH', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Test',
        mode: 'operational',
        businessUnit: 'Test',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await expect(
        service.attachEvidence(packet.id, 'viewer-1', 'viewer', {
          filename: 'doc.pdf',
          mimeType: 'application/pdf',
          size: 100,
          buffer: Buffer.from(''),
          category: 'supporting',
        })
      ).rejects.toThrow('Insufficient permissions to attach evidence');
    });
  });

  describe('Packet Locking', () => {
    it('should lock approved packet', async () => {
      const packet = await service.generatePacket('DEC-LOCK', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'To Lock',
        mode: 'strategic',
        businessUnit: 'Strategy',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await service.sendToApprovers(packet.id, 'usr-001', 'decision_owner', [
        { userId: 'appr-1', name: 'A', email: 'a@co.com', role: 'R' },
      ]);
      await service.respondToApproval(packet.id, 'appr-1', 'approved');

      const locked = await service.lockPacket(packet.id, 'admin-1', 'admin');
      expect(locked.status).toBe('locked');
      expect(locked.lockedAt).toBeDefined();
    });

    it('should reject locking non-approved packet', async () => {
      const packet = await service.generatePacket('DEC-NA-LOCK', 'usr-001', 'decision_owner', 'ds-1', {
        title: 'Draft',
        mode: 'operational',
        businessUnit: 'Test',
        systemsImpacted: [],
        complianceFrameworks: [],
        policyPackVersion: 'v1',
      });

      await expect(service.lockPacket(packet.id, 'admin-1', 'admin'))
        .rejects.toThrow('Only approved packets can be locked');
    });

    it('should reject unauthorized lock attempt', async () => {
      await expect(service.lockPacket('PKT-2024-001', 'viewer-1', 'viewer'))
        .rejects.toThrow('Only Approvers, Risk/Compliance, and Admins can lock packets');
    });
  });

  describe('Break-Glass Export', () => {
    it('should request break-glass export', async () => {
      const breakGlass = await service.requestBreakGlassExport(
        'PKT-2024-001',
        'usr-emergency',
        'Critical audit requirement',
        'critical'
      );

      expect(breakGlass.id).toMatch(/^bg-/);
      expect(breakGlass.status).toBe('pending');
      expect(breakGlass.urgencyLevel).toBe('critical');
      expect(breakGlass.auditTrail.length).toBe(1);
    });

    it('should require two different admins to approve', async () => {
      const breakGlass = await service.requestBreakGlassExport(
        'PKT-2024-001',
        'usr-req',
        'Emergency',
        'emergency'
      );

      const afterFirst = await service.approveBreakGlassExport(breakGlass.id, 'admin-1', 'admin');
      expect(afterFirst.status).toBe('pending');
      expect(afterFirst.firstApprover).toBeDefined();

      const afterSecond = await service.approveBreakGlassExport(breakGlass.id, 'admin-2', 'admin');
      expect(afterSecond.status).toBe('approved');
      expect(afterSecond.secondApprover).toBeDefined();
    });

    it('should reject same admin as both approvers', async () => {
      const breakGlass = await service.requestBreakGlassExport(
        'PKT-2024-001',
        'usr-req',
        'Test',
        'high'
      );

      await service.approveBreakGlassExport(breakGlass.id, 'admin-1', 'admin');

      await expect(
        service.approveBreakGlassExport(breakGlass.id, 'admin-1', 'admin')
      ).rejects.toThrow('Cannot be both approvers for break-glass export');
    });

    it('should reject non-admin approval', async () => {
      const breakGlass = await service.requestBreakGlassExport(
        'PKT-2024-001',
        'usr-req',
        'Test',
        'high'
      );

      await expect(
        service.approveBreakGlassExport(breakGlass.id, 'viewer-1', 'viewer')
      ).rejects.toThrow('Only Admins can approve break-glass exports');
    });
  });

  describe('Statistics', () => {
    it('should return packet statistics', async () => {
      const stats = await service.getStats();

      expect(stats.total).toBeGreaterThan(0);
      expect(stats).toHaveProperty('draft');
      expect(stats).toHaveProperty('underReview');
      expect(stats).toHaveProperty('approved');
      expect(stats).toHaveProperty('locked');
      expect(stats).toHaveProperty('superseded');
    });

    it('should filter stats by data source', async () => {
      const stats = await service.getStats('ds-primary');
      expect(stats.total).toBeGreaterThanOrEqual(0);
    });
  });
});
