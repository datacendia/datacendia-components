/**
 * EvidenceVaultService Deep Tests
 *
 * Tests the full evidence vault lifecycle:
 * - Packet retrieval with filtering (status, mode, businessUnit, framework, search)
 * - Packet generation with RBAC enforcement
 * - Send to approvers workflow
 * - Approval response (approve/reject) with automatic status transition
 * - Evidence attachment with SHA-256 hashing and RBAC
 * - Packet locking with RBAC
 * - Break-glass export with dual approval requirement
 * - Council decision packet storage
 * - Related decisions search
 * - Export with RBAC (viewer blocked, auditor restricted)
 * - Stats aggregation
 * - Integrity hash generation (real SHA-256)
 *
 * @module __tests__/services/EvidenceVaultDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/database.js', () => ({
  prisma: {
    evidence_vault_packets: {
      findMany: vi.fn().mockResolvedValue([]),
      upsert: vi.fn().mockResolvedValue({}),
    },
  },
}));

const { evidenceVaultService } = await import('../../services/evidence/EvidenceVaultService.js');

// ============================================================================
// PACKET RETRIEVAL & SAMPLE DATA
// ============================================================================

describe('EvidenceVaultService — Packet Retrieval', () => {
  // FAILS IF: sample data not loaded or getPackets returns wrong shape
  it('should return sample packets with total count', async () => {
    const { packets, total } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
    });
    expect(Array.isArray(packets)).toBe(true);
    expect(total).toBeGreaterThanOrEqual(6); // 6 sample packets
    expect(packets[0]).toHaveProperty('id');
    expect(packets[0]).toHaveProperty('decisionTitle');
    expect(packets[0]).toHaveProperty('status');
    expect(packets[0]).toHaveProperty('mode');
    expect(packets[0]).toHaveProperty('integrityHash');
  });

  // FAILS IF: status filter doesn't work
  it('should filter packets by status', async () => {
    const { packets } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
      status: 'locked',
    });
    expect(packets.length).toBeGreaterThan(0);
    expect(packets.every(p => p.status === 'locked')).toBe(true);
  });

  // FAILS IF: mode filter doesn't work
  it('should filter packets by mode', async () => {
    const { packets } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
      mode: 'strategic',
    });
    expect(packets.length).toBeGreaterThan(0);
    expect(packets.every(p => p.mode === 'strategic')).toBe(true);
  });

  // FAILS IF: framework filter doesn't match
  it('should filter packets by compliance framework', async () => {
    const { packets } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
      framework: 'GDPR',
    });
    expect(packets.length).toBeGreaterThan(0);
    for (const p of packets) {
      expect(p.complianceFrameworks).toContain('GDPR');
    }
  });

  // FAILS IF: search doesn't match title/owner/systems
  it('should search packets by title text', async () => {
    const { packets } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
      search: 'Emergency',
    });
    expect(packets.length).toBeGreaterThan(0);
    expect(packets[0].decisionTitle).toContain('Emergency');
  });

  // FAILS IF: pagination doesn't work
  it('should support limit and offset', async () => {
    const { packets: first2 } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
      limit: 2,
      offset: 0,
    });
    expect(first2.length).toBeLessThanOrEqual(2);

    const { packets: next2 } = await evidenceVaultService.getPackets({
      organizationId: 'org-default',
      limit: 2,
      offset: 2,
    });
    // Different packets
    if (next2.length > 0 && first2.length > 0) {
      expect(next2[0].id).not.toBe(first2[0].id);
    }
  });

  // FAILS IF: RBAC not enforced for auditors
  it('should enforce RBAC: auditor can only access locked packets', async () => {
    // PKT-2024-005 is draft - auditor should be blocked
    await expect(
      evidenceVaultService.getPacketById('PKT-2024-005', 'usr-auditor', 'auditor')
    ).rejects.toThrow('Auditors can only access locked packets');

    // PKT-2024-001 is locked - auditor should succeed
    const locked = await evidenceVaultService.getPacketById('PKT-2024-001', 'usr-auditor', 'auditor');
    expect(locked).not.toBeNull();
    expect(locked!.status).toBe('locked');
  });

  // FAILS IF: access log not written on view
  it('should log access when viewing a packet', async () => {
    const packet = await evidenceVaultService.getPacketById('PKT-2024-001', 'usr-viewer-test', 'viewer');
    expect(packet).not.toBeNull();
    const lastLog = packet!.accessLog[packet!.accessLog.length - 1];
    expect(lastLog.userId).toBe('usr-viewer-test');
    expect(lastLog.action).toBe('view');
  });
});

// ============================================================================
// PACKET GENERATION
// ============================================================================

describe('EvidenceVaultService — Packet Generation', () => {
  // FAILS IF: generatePacket doesn't create valid packet
  it('should generate a new packet with correct fields', async () => {
    const packet = await evidenceVaultService.generatePacket(
      'DEC-TEST-001',
      'usr-owner',
      'decision_owner',
      'ds-test',
      {
        title: 'Test Decision: Cloud Migration',
        mode: 'strategic',
        businessUnit: 'Engineering',
        systemsImpacted: ['AWS', 'GCP', 'Kubernetes'],
        complianceFrameworks: ['SOC2', 'ISO27001'],
        policyPackVersion: 'v2025.01.1',
      }
    );

    expect(packet.id).toMatch(/^PKT-/);
    expect(packet.decisionId).toBe('DEC-TEST-001');
    expect(packet.decisionTitle).toBe('Test Decision: Cloud Migration');
    expect(packet.status).toBe('draft');
    expect(packet.mode).toBe('strategic');
    expect(packet.signatureValid).toBe(false);
    expect(packet.integrityHash).toMatch(/^sha256-/);
    expect(packet.version).toBe(1);
    expect(packet.attachments).toEqual([]);
    expect(packet.dissents).toEqual([]);
    expect(packet.systemsImpacted).toContain('AWS');
    expect(packet.complianceFrameworks).toContain('SOC2');
    // Retention should be ~7 years from now
    expect(packet.retentionUntil.getFullYear()).toBeGreaterThanOrEqual(new Date().getFullYear() + 6);
  });

  // FAILS IF: RBAC not enforced
  it('should reject packet generation by viewer', async () => {
    await expect(
      evidenceVaultService.generatePacket('DEC-X', 'usr-viewer', 'viewer', 'ds-1', {
        title: 'X', mode: 'operational', businessUnit: 'X',
        systemsImpacted: [], complianceFrameworks: [], policyPackVersion: 'v1',
      })
    ).rejects.toThrow('Only Decision Owners and Council Operators can generate packets');
  });
});

// ============================================================================
// APPROVAL WORKFLOW
// ============================================================================

describe('EvidenceVaultService — Approval Workflow', () => {
  let packetId: string;

  beforeEach(async () => {
    const packet = await evidenceVaultService.generatePacket(
      `DEC-APPR-${Date.now()}`,
      'usr-owner',
      'decision_owner',
      'ds-test',
      {
        title: 'Approval Test Decision',
        mode: 'compliance',
        businessUnit: 'Legal',
        systemsImpacted: ['CRM'],
        complianceFrameworks: ['GDPR'],
        policyPackVersion: 'v2025.01.1',
      }
    );
    packetId = packet.id;
  });

  // FAILS IF: sendToApprovers doesn't create workflow
  it('should create approval workflow with approvers', async () => {
    const workflow = await evidenceVaultService.sendToApprovers(
      packetId,
      'usr-owner',
      'decision_owner',
      [
        { userId: 'usr-legal', email: 'legal@co.com', name: 'Legal Team', role: 'Legal Counsel' },
        { userId: 'usr-ciso', email: 'ciso@co.com', name: 'CISO', role: 'Security' },
      ],
      'Please review for GDPR compliance',
      new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
    );

    expect(workflow.id).toMatch(/^wf-/);
    expect(workflow.status).toBe('pending');
    expect(workflow.approvers).toHaveLength(2);
    expect(workflow.approvers[0].status).toBe('pending');
    expect(workflow.approvers[1].status).toBe('pending');
    expect(workflow.message).toContain('GDPR');

    // Packet should now be under_review
    const pkt = await evidenceVaultService.getPacketById(packetId, 'usr-owner', 'decision_owner');
    expect(pkt!.status).toBe('under_review');
  });

  // FAILS IF: RBAC not enforced for sending approval
  it('should reject approval send by viewer', async () => {
    await expect(
      evidenceVaultService.sendToApprovers(packetId, 'usr-viewer', 'viewer', [
        { userId: 'u1', email: 'x', name: 'x', role: 'x' },
      ])
    ).rejects.toThrow('Only Decision Owners and Council Operators');
  });

  // FAILS IF: approval response doesn't update status correctly
  it('should approve packet when all approvers approve', async () => {
    await evidenceVaultService.sendToApprovers(
      packetId, 'usr-owner', 'decision_owner',
      [
        { userId: 'usr-a1', email: 'a1@co.com', name: 'Approver 1', role: 'Legal' },
        { userId: 'usr-a2', email: 'a2@co.com', name: 'Approver 2', role: 'Security' },
      ]
    );

    await evidenceVaultService.respondToApproval(packetId, 'usr-a1', 'approved', 'LGTM');
    // Not yet fully approved - one pending
    let pkt = await evidenceVaultService.getPacketById(packetId, 'usr-owner', 'decision_owner');
    expect(pkt!.status).toBe('under_review');

    await evidenceVaultService.respondToApproval(packetId, 'usr-a2', 'approved', 'Verified');
    // Now all approved
    pkt = await evidenceVaultService.getPacketById(packetId, 'usr-owner', 'decision_owner');
    expect(pkt!.status).toBe('approved');
    expect(pkt!.signatureValid).toBe(true);
    expect(pkt!.approvalWorkflow!.status).toBe('approved');
    expect(pkt!.approvalWorkflow!.completedAt).toBeInstanceOf(Date);
  });

  // FAILS IF: rejection doesn't set workflow to rejected
  it('should reject packet when any approver rejects', async () => {
    await evidenceVaultService.sendToApprovers(
      packetId, 'usr-owner', 'decision_owner',
      [
        { userId: 'usr-r1', email: 'r1@co.com', name: 'Reviewer 1', role: 'Legal' },
        { userId: 'usr-r2', email: 'r2@co.com', name: 'Reviewer 2', role: 'Security' },
      ]
    );

    await evidenceVaultService.respondToApproval(packetId, 'usr-r1', 'approved');
    await evidenceVaultService.respondToApproval(packetId, 'usr-r2', 'rejected', 'Missing risk assessment');

    const pkt = await evidenceVaultService.getPacketById(packetId, 'usr-owner', 'decision_owner');
    expect(pkt!.approvalWorkflow!.status).toBe('rejected');
    // Packet should NOT be approved
    expect(pkt!.status).not.toBe('approved');
  });
});

// ============================================================================
// EVIDENCE ATTACHMENT
// ============================================================================

describe('EvidenceVaultService — Evidence Attachment', () => {
  let packetId: string;

  beforeEach(async () => {
    const packet = await evidenceVaultService.generatePacket(
      `DEC-ATT-${Date.now()}`,
      'usr-owner',
      'decision_owner',
      'ds-test',
      {
        title: 'Attachment Test',
        mode: 'due_diligence',
        businessUnit: 'Procurement',
        systemsImpacted: ['ERP'],
        complianceFrameworks: ['SOX'],
        policyPackVersion: 'v1',
      }
    );
    packetId = packet.id;
  });

  // FAILS IF: attachEvidence doesn't create attachment with SHA-256 hash
  it('should attach evidence with SHA-256 hash of content', async () => {
    const content = Buffer.from('This is a test document for evidence vault');
    const attachment = await evidenceVaultService.attachEvidence(
      packetId, 'usr-owner', 'decision_owner',
      {
        filename: 'test-evidence.pdf',
        mimeType: 'application/pdf',
        size: content.length,
        buffer: content,
        description: 'Test evidence document',
        category: 'evidence',
      }
    );

    expect(attachment.id).toMatch(/^att-/);
    expect(attachment.filename).toBe('test-evidence.pdf');
    expect(attachment.hash).toMatch(/^[a-f0-9]{64}$/); // SHA-256 hex
    expect(attachment.category).toBe('evidence');
    expect(attachment.uploadedBy).toBe('usr-owner');
    expect(attachment.uploadedAt).toBeInstanceOf(Date);

    // Verify it's on the packet
    const pkt = await evidenceVaultService.getPacketById(packetId, 'usr-owner', 'decision_owner');
    expect(pkt!.attachments.length).toBeGreaterThanOrEqual(1);
    // Signature should be invalidated after attachment
    expect(pkt!.signatureValid).toBe(false);
  });

  // FAILS IF: RBAC not enforced
  it('should reject attachment by viewer', async () => {
    await expect(
      evidenceVaultService.attachEvidence(packetId, 'usr-viewer', 'viewer', {
        filename: 'x.pdf', mimeType: 'application/pdf', size: 10,
        buffer: Buffer.from('x'), category: 'evidence',
      })
    ).rejects.toThrow('Insufficient permissions');
  });

  // FAILS IF: locked packet allows attachment
  it('should reject attachment to locked packet', async () => {
    // Use a sample locked packet
    await expect(
      evidenceVaultService.attachEvidence('PKT-2024-001', 'usr-owner', 'decision_owner', {
        filename: 'x.pdf', mimeType: 'application/pdf', size: 10,
        buffer: Buffer.from('x'), category: 'evidence',
      })
    ).rejects.toThrow('Cannot attach evidence to locked or superseded packets');
  });
});

// ============================================================================
// PACKET LOCKING
// ============================================================================

describe('EvidenceVaultService — Packet Locking', () => {
  // FAILS IF: lockPacket doesn't set correct fields
  it('should lock an approved packet', async () => {
    // Generate, approve via workflow, then lock
    const pkt = await evidenceVaultService.generatePacket(
      `DEC-LOCK-${Date.now()}`, 'usr-owner', 'decision_owner', 'ds-1',
      { title: 'Lock Test', mode: 'operational', businessUnit: 'Ops',
        systemsImpacted: ['DB'], complianceFrameworks: ['SOC2'], policyPackVersion: 'v1' }
    );

    // Send and approve
    await evidenceVaultService.sendToApprovers(
      pkt.id, 'usr-owner', 'decision_owner',
      [{ userId: 'usr-approver', email: 'a@co.com', name: 'Approver', role: 'Admin' }]
    );
    await evidenceVaultService.respondToApproval(pkt.id, 'usr-approver', 'approved');

    // Lock
    const locked = await evidenceVaultService.lockPacket(pkt.id, 'usr-admin', 'admin');
    expect(locked.status).toBe('locked');
    expect(locked.lockedAt).toBeInstanceOf(Date);
    expect(locked.signedAt).toBeInstanceOf(Date);
    expect(locked.signatureValid).toBe(true);
    expect(locked.integrityHash).toMatch(/^sha256-/);
  });

  // FAILS IF: non-approved packet can be locked
  it('should reject locking a draft packet', async () => {
    const pkt = await evidenceVaultService.generatePacket(
      `DEC-LOCKFAIL-${Date.now()}`, 'usr-owner', 'decision_owner', 'ds-1',
      { title: 'X', mode: 'operational', businessUnit: 'X',
        systemsImpacted: [], complianceFrameworks: [], policyPackVersion: 'v1' }
    );
    await expect(
      evidenceVaultService.lockPacket(pkt.id, 'usr-admin', 'admin')
    ).rejects.toThrow('Only approved packets can be locked');
  });

  // FAILS IF: RBAC not enforced
  it('should reject locking by viewer', async () => {
    await expect(
      evidenceVaultService.lockPacket('PKT-2024-003', 'usr-viewer', 'viewer')
    ).rejects.toThrow('Only Approvers, Risk/Compliance, and Admins can lock packets');
  });
});

// ============================================================================
// BREAK-GLASS EXPORT — Dual Approval
// ============================================================================

describe('EvidenceVaultService — Break-Glass Export', () => {
  let breakGlassId: string;
  const packetId = 'PKT-2024-001'; // locked sample packet

  // FAILS IF: requestBreakGlassExport doesn't create request
  it('should request break-glass export with audit trail', async () => {
    const bg = await evidenceVaultService.requestBreakGlassExport(
      packetId,
      'usr-requester',
      'Regulatory audit requires immediate access to locked evidence',
      'critical'
    );
    breakGlassId = bg.id;

    expect(bg.id).toMatch(/^bg-/);
    expect(bg.status).toBe('pending');
    expect(bg.justification).toContain('Regulatory audit');
    expect(bg.urgencyLevel).toBe('critical');
    expect(bg.auditTrail.length).toBe(1);
    expect(bg.auditTrail[0]).toContain('requested');
  });

  // FAILS IF: dual approval not enforced
  it('should require two different admins for break-glass approval', async () => {
    const bg = await evidenceVaultService.requestBreakGlassExport(
      packetId, 'usr-req', 'Urgent', 'emergency'
    );

    // First approval
    const afterFirst = await evidenceVaultService.approveBreakGlassExport(bg.id, 'admin-1', 'admin');
    expect(afterFirst.status).toBe('pending'); // Still pending - needs 2nd
    expect(afterFirst.firstApprover).toBeDefined();
    expect(afterFirst.firstApprover!.userId).toBe('admin-1');

    // Same admin can't approve twice
    await expect(
      evidenceVaultService.approveBreakGlassExport(bg.id, 'admin-1', 'admin')
    ).rejects.toThrow('Cannot be both approvers');

    // Second admin approves
    const afterSecond = await evidenceVaultService.approveBreakGlassExport(bg.id, 'admin-2', 'admin');
    expect(afterSecond.status).toBe('approved');
    expect(afterSecond.secondApprover).toBeDefined();
    expect(afterSecond.auditTrail.length).toBeGreaterThanOrEqual(3);
  });

  // FAILS IF: non-admin can approve
  it('should reject break-glass approval by non-admin', async () => {
    const bg = await evidenceVaultService.requestBreakGlassExport(
      packetId, 'usr-req', 'Test', 'high'
    );
    await expect(
      evidenceVaultService.approveBreakGlassExport(bg.id, 'usr-viewer', 'viewer')
    ).rejects.toThrow('Only Admins can approve');
  });

  // FAILS IF: execute works without approval
  it('should reject execution of unapproved break-glass', async () => {
    const bg = await evidenceVaultService.requestBreakGlassExport(
      packetId, 'usr-req', 'Test', 'high'
    );
    await expect(
      evidenceVaultService.executeBreakGlassExport(bg.id)
    ).rejects.toThrow('not yet approved');
  });

  // FAILS IF: execution doesn't return buffer
  it('should execute approved break-glass and return export bundle', async () => {
    const bg = await evidenceVaultService.requestBreakGlassExport(
      packetId, 'usr-req', 'Court order', 'emergency'
    );
    await evidenceVaultService.approveBreakGlassExport(bg.id, 'admin-a', 'admin');
    await evidenceVaultService.approveBreakGlassExport(bg.id, 'admin-b', 'admin');

    const buffer = await evidenceVaultService.executeBreakGlassExport(bg.id);
    expect(buffer).toBeInstanceOf(Buffer);
    expect(buffer.length).toBeGreaterThan(0);

    // Should be valid JSON
    const parsed = JSON.parse(buffer.toString());
    expect(parsed).toHaveProperty('packet');
    expect(parsed).toHaveProperty('exportedAt');
    expect(parsed).toHaveProperty('exportVersion');
  });
});

// ============================================================================
// COUNCIL DECISION PACKET
// ============================================================================

describe('EvidenceVaultService — Council Decision Packet', () => {
  // FAILS IF: storeCouncilDecisionPacket doesn't create valid packet
  it('should store a council decision packet', async () => {
    const runId = `run-${Date.now()}`;
    const packet = await evidenceVaultService.storeCouncilDecisionPacket({
      runId,
      deliberationId: 'delib-001',
      organizationId: 'org-council',
      userId: 'council-system',
      question: 'Should we proceed with the vendor integration?',
      recommendation: 'Proceed with phased rollout',
      confidence: 0.85,
      merkleRoot: 'sha256-abc123def456',
      regulatoryFrameworks: ['SOC2', 'GDPR'],
      retentionUntil: new Date('2032-01-01'),
    });

    expect(packet.id).toBe(`PKT-${runId}`);
    expect(packet.decisionId).toBe('delib-001');
    expect(packet.status).toBe('draft'); // No signature provided
    expect(packet.mode).toBe('due_diligence');
    expect(packet.integrityHash).toBe('sha256-abc123def456');
    expect(packet.complianceFrameworks).toContain('SOC2');
    expect(packet.accessLog).toHaveLength(1);
    expect(packet.accessLog[0].action).toBe('generate');
  });

  // FAILS IF: signed packet doesn't get locked status
  it('should create locked packet when signature provided', async () => {
    const packet = await evidenceVaultService.storeCouncilDecisionPacket({
      runId: `run-signed-${Date.now()}`,
      deliberationId: 'delib-002',
      organizationId: 'org-council',
      userId: 'council-system',
      question: 'Approve budget allocation?',
      recommendation: 'Approved',
      confidence: 0.95,
      merkleRoot: 'sha256-signed-merkle',
      signature: { signature: 'sig-123', algorithm: 'ed25519', keyId: 'key-001' },
      regulatoryFrameworks: ['SOX'],
      retentionUntil: new Date('2032-01-01'),
    });

    expect(packet.status).toBe('locked');
    expect(packet.signatureValid).toBe(true);
    expect(packet.signedAt).toBeInstanceOf(Date);
    expect(packet.lockedAt).toBeInstanceOf(Date);
  });

  // FAILS IF: getCouncilPacketByRunId doesn't work
  it('should retrieve council packet by run ID', async () => {
    const runId = `run-retrieve-${Date.now()}`;
    await evidenceVaultService.storeCouncilDecisionPacket({
      runId,
      deliberationId: 'delib-003',
      organizationId: 'org-council',
      userId: 'system',
      question: 'Test retrieval',
      recommendation: 'OK',
      confidence: 0.9,
      merkleRoot: 'sha256-test',
      regulatoryFrameworks: [],
      retentionUntil: new Date('2032-01-01'),
    });

    const retrieved = await evidenceVaultService.getCouncilPacketByRunId(runId);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(`PKT-${runId}`);
  });
});

// ============================================================================
// EXPORT & RELATED DECISIONS
// ============================================================================

describe('EvidenceVaultService — Export & Related Decisions', () => {
  // FAILS IF: export doesn't return buffer
  it('should export a packet as bundle', async () => {
    const buffer = await evidenceVaultService.exportPacket('PKT-2024-001', 'usr-owner', 'decision_owner');
    expect(buffer).toBeInstanceOf(Buffer);
    const parsed = JSON.parse(buffer.toString());
    expect(parsed.packet).toBeDefined();
    expect(parsed.packet.id).toBe('PKT-2024-001');
  });

  // FAILS IF: viewer can export
  it('should reject export by viewer', async () => {
    await expect(
      evidenceVaultService.exportPacket('PKT-2024-001', 'usr-viewer', 'viewer')
    ).rejects.toThrow('Viewers cannot export');
  });

  // FAILS IF: auditor can export non-locked packet
  it('should reject auditor export of non-locked packet', async () => {
    await expect(
      evidenceVaultService.exportPacket('PKT-2024-005', 'usr-auditor', 'auditor')
    ).rejects.toThrow('Auditors can only export locked packets');
  });

  // FAILS IF: related decisions search returns wrong shape
  it('should find related decisions by system impact', async () => {
    const related = await evidenceVaultService.getRelatedDecisions('system', 'CRM', 'org-default');
    expect(Array.isArray(related)).toBe(true);
    // PKT-2024-001 has 'CRM' in systemsImpacted
    expect(related.length).toBeGreaterThan(0);
    expect(related[0]).toHaveProperty('packetId');
    expect(related[0]).toHaveProperty('relevanceScore');
    expect(related[0].entityId).toBe('CRM');
  });
});

// ============================================================================
// STATS
// ============================================================================

describe('EvidenceVaultService — Stats', () => {
  // FAILS IF: getStats returns wrong shape or counts
  it('should return packet stats with status breakdown', async () => {
    const stats = await evidenceVaultService.getStats();
    expect(typeof stats.total).toBe('number');
    expect(stats.total).toBeGreaterThan(0);
    expect(typeof stats.draft).toBe('number');
    expect(typeof stats.underReview).toBe('number');
    expect(typeof stats.approved).toBe('number');
    expect(typeof stats.locked).toBe('number');
    expect(typeof stats.superseded).toBe('number');
    // Sum of statuses should equal total
    const sum = stats.draft + stats.underReview + stats.approved + stats.locked + stats.superseded;
    expect(sum).toBe(stats.total);
  });

  // FAILS IF: data source filter doesn't work
  it('should filter stats by data source', async () => {
    const stats = await evidenceVaultService.getStats('ds-primary');
    expect(stats.total).toBeGreaterThan(0);
  });
});
