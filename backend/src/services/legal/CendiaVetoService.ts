// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA VETO SERVICE
 * 
 * Approval gates for document exports, communications, and actions.
 * Enforces human-in-the-loop requirements for privilege-sensitive operations.
 * 
 * Key Features:
 * - Export approval gates (privilege review required)
 * - Communication approval (client-facing content)
 * - Action approval (filing, submission)
 * - Multi-level approval workflows
 * - Audit trail for all approvals/rejections
 */

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type VetoGateType = 
  | 'privilege_export'      // Document export requiring privilege review
  | 'client_communication'  // Client-facing communication
  | 'court_filing'          // Court filing or submission
  | 'regulatory_submission' // Regulatory filing
  | 'external_share'        // Sharing with external parties
  | 'ai_output_release'     // Releasing AI-generated content
  | 'matter_closure'        // Closing a matter
  | 'fee_agreement'         // Fee agreement changes
  | 'conflict_waiver';      // Conflict waiver

export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'escalated' | 'expired';

export type ApproverRole = 
  | 'privilege_officer'
  | 'matter_lead'
  | 'supervising_partner'
  | 'ethics_counsel'
  | 'general_counsel'
  | 'managing_partner';

export interface VetoGate {
  id: string;
  type: VetoGateType;
  matterId?: string | undefined;
  documentId?: string | undefined;
  requestedBy: string;
  requestedAt: Date;
  reason: string;
  context: Record<string, any>;
  requiredApprovers: ApproverRole[];
  approvals: Approval[];
  status: ApprovalStatus;
  expiresAt?: Date | undefined;
  escalatedTo?: ApproverRole | undefined;
  escalatedAt?: Date | undefined;
  resolvedAt?: Date | undefined;
  resolvedBy?: string | undefined;
  auditHash: string;
}

export interface Approval {
  id: string;
  gateId: string;
  approverRole: ApproverRole;
  approverId: string;
  approverName: string;
  decision: 'approve' | 'reject' | 'escalate';
  rationale: string;
  conditions?: string[] | undefined;
  timestamp: Date;
  signature: string;
}

export interface VetoPolicy {
  gateType: VetoGateType;
  requiredApprovers: ApproverRole[];
  escalationPath: ApproverRole[];
  timeoutHours: number;
  autoEscalateOnTimeout: boolean;
  requireUnanimous: boolean;
  allowConditionalApproval: boolean;
}

export interface VetoAuditEntry {
  id: string;
  gateId: string;
  action: string;
  actor: string;
  timestamp: Date;
  details: Record<string, any>;
  hash: string;
  previousHash: string;
}

// =============================================================================
// DEFAULT POLICIES
// =============================================================================

const DEFAULT_VETO_POLICIES: VetoPolicy[] = [
  {
    gateType: 'privilege_export',
    requiredApprovers: ['privilege_officer'],
    escalationPath: ['supervising_partner', 'general_counsel'],
    timeoutHours: 24,
    autoEscalateOnTimeout: true,
    requireUnanimous: true,
    allowConditionalApproval: true,
  },
  {
    gateType: 'client_communication',
    requiredApprovers: ['matter_lead'],
    escalationPath: ['supervising_partner'],
    timeoutHours: 4,
    autoEscalateOnTimeout: false,
    requireUnanimous: true,
    allowConditionalApproval: true,
  },
  {
    gateType: 'court_filing',
    requiredApprovers: ['matter_lead', 'supervising_partner'],
    escalationPath: ['general_counsel'],
    timeoutHours: 2,
    autoEscalateOnTimeout: true,
    requireUnanimous: true,
    allowConditionalApproval: false,
  },
  {
    gateType: 'regulatory_submission',
    requiredApprovers: ['matter_lead', 'supervising_partner'],
    escalationPath: ['general_counsel', 'managing_partner'],
    timeoutHours: 4,
    autoEscalateOnTimeout: true,
    requireUnanimous: true,
    allowConditionalApproval: false,
  },
  {
    gateType: 'external_share',
    requiredApprovers: ['privilege_officer', 'matter_lead'],
    escalationPath: ['supervising_partner'],
    timeoutHours: 8,
    autoEscalateOnTimeout: true,
    requireUnanimous: true,
    allowConditionalApproval: true,
  },
  {
    gateType: 'ai_output_release',
    requiredApprovers: ['matter_lead'],
    escalationPath: ['supervising_partner', 'ethics_counsel'],
    timeoutHours: 1,
    autoEscalateOnTimeout: false,
    requireUnanimous: true,
    allowConditionalApproval: true,
  },
  {
    gateType: 'matter_closure',
    requiredApprovers: ['matter_lead', 'supervising_partner'],
    escalationPath: ['general_counsel'],
    timeoutHours: 48,
    autoEscalateOnTimeout: false,
    requireUnanimous: true,
    allowConditionalApproval: false,
  },
  {
    gateType: 'fee_agreement',
    requiredApprovers: ['supervising_partner'],
    escalationPath: ['managing_partner'],
    timeoutHours: 24,
    autoEscalateOnTimeout: false,
    requireUnanimous: true,
    allowConditionalApproval: true,
  },
  {
    gateType: 'conflict_waiver',
    requiredApprovers: ['ethics_counsel', 'general_counsel'],
    escalationPath: ['managing_partner'],
    timeoutHours: 48,
    autoEscalateOnTimeout: true,
    requireUnanimous: true,
    allowConditionalApproval: false,
  },
];

// =============================================================================
// CENDIA VETO SERVICE
// =============================================================================

export class CendiaVetoService extends EventEmitter {
  private gates: Map<string, VetoGate> = new Map();
  private policies: Map<VetoGateType, VetoPolicy> = new Map();
  private auditLog: VetoAuditEntry[] = [];
  private lastAuditHash: string = 'genesis';

  constructor() {
    super();
    // Initialize default policies
    for (const policy of DEFAULT_VETO_POLICIES) {
      this.policies.set(policy.gateType, policy);
    }
  }

  // ===========================================================================
  // GATE MANAGEMENT
  // ===========================================================================

  /**
   * Create a new veto gate (approval request)
   */
  async createGate(params: {
    type: VetoGateType;
    matterId?: string;
    documentId?: string;
    requestedBy: string;
    reason: string;
    context?: Record<string, any>;
    expiresInHours?: number;
  }): Promise<VetoGate> {
    const policy = this.policies.get(params.type);
    if (!policy) {
      throw new Error(`No policy defined for gate type: ${params.type}`);
    }

    const id = `veto-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
    const now = new Date();
    const timeoutHours = params.expiresInHours || policy.timeoutHours;

    const gate: VetoGate = {
      id,
      type: params.type,
      matterId: params.matterId,
      documentId: params.documentId,
      requestedBy: params.requestedBy,
      requestedAt: now,
      reason: params.reason,
      context: params.context || {},
      requiredApprovers: [...policy.requiredApprovers],
      approvals: [],
      status: 'pending',
      expiresAt: new Date(now.getTime() + timeoutHours * 60 * 60 * 1000),
      auditHash: '',
    };

    // Generate audit hash
    gate.auditHash = this.generateHash(gate);

    this.gates.set(id, gate);
    this.addAuditEntry(id, 'gate_created', params.requestedBy, { gate });
    this.emit('gate-created', gate);

    return gate;
  }

  /**
   * Submit approval/rejection for a gate
   */
  async submitApproval(params: {
    gateId: string;
    approverRole: ApproverRole;
    approverId: string;
    approverName: string;
    decision: 'approve' | 'reject' | 'escalate';
    rationale: string;
    conditions?: string[];
  }): Promise<VetoGate> {
    const gate = this.gates.get(params.gateId);
    if (!gate) {
      throw new Error(`Gate not found: ${params.gateId}`);
    }

    if (gate.status !== 'pending' && gate.status !== 'escalated') {
      throw new Error(`Gate is not pending approval: ${gate.status}`);
    }

    // Verify approver is authorized
    const policy = this.policies.get(gate.type)!;
    const isRequiredApprover = gate.requiredApprovers.includes(params.approverRole);
    const isEscalationApprover = policy.escalationPath.includes(params.approverRole);

    if (!isRequiredApprover && !isEscalationApprover) {
      throw new Error(`Approver role ${params.approverRole} is not authorized for this gate`);
    }

    // Check for duplicate approval from same role
    const existingApproval = gate.approvals.find(a => a.approverRole === params.approverRole);
    if (existingApproval) {
      throw new Error(`Approval already submitted for role: ${params.approverRole}`);
    }

    // Create approval record
    const approval: Approval = {
      id: `approval-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      gateId: params.gateId,
      approverRole: params.approverRole,
      approverId: params.approverId,
      approverName: params.approverName,
      decision: params.decision,
      rationale: params.rationale,
      conditions: params.conditions,
      timestamp: new Date(),
      signature: this.generateSignature(params),
    };

    gate.approvals.push(approval);
    this.addAuditEntry(params.gateId, `approval_${params.decision}`, params.approverId, { approval });

    // Handle decision
    if (params.decision === 'reject') {
      gate.status = 'rejected';
      gate.resolvedAt = new Date();
      gate.resolvedBy = params.approverId;
      this.emit('gate-rejected', gate, approval);
    } else if (params.decision === 'escalate') {
      await this.escalateGate(gate, params.approverRole);
    } else {
      // Check if all required approvals are in
      const approvedRoles = gate.approvals
        .filter(a => a.decision === 'approve')
        .map(a => a.approverRole);

      const allApproved = gate.requiredApprovers.every(role => approvedRoles.includes(role));

      if (allApproved) {
        gate.status = 'approved';
        gate.resolvedAt = new Date();
        gate.resolvedBy = params.approverId;
        this.emit('gate-approved', gate);
      }
    }

    // Update audit hash
    gate.auditHash = this.generateHash(gate);
    this.gates.set(params.gateId, gate);

    return gate;
  }

  /**
   * Escalate a gate to the next level
   */
  private async escalateGate(gate: VetoGate, currentRole: ApproverRole): Promise<void> {
    const policy = this.policies.get(gate.type)!;
    const currentIndex = policy.escalationPath.indexOf(currentRole);
    
    let nextApprover: ApproverRole;
    if (currentIndex === -1) {
      // Current role is not in escalation path, start from beginning
      nextApprover = policy.escalationPath[0]!;
    } else if (currentIndex < policy.escalationPath.length - 1) {
      nextApprover = policy.escalationPath[currentIndex + 1]!;
    } else {
      // Already at top of escalation path
      throw new Error('Cannot escalate further - already at highest level');
    }

    gate.escalatedTo = nextApprover;
    gate.status = 'escalated';
    gate.escalatedAt = new Date();
    gate.requiredApprovers = [nextApprover];

    this.addAuditEntry(gate.id, 'gate_escalated', 'system', { escalatedTo: gate.escalatedTo });
    this.emit('gate-escalated', gate);
  }

  /**
   * Check if a gate is approved
   */
  isApproved(gateId: string): boolean {
    const gate = this.gates.get(gateId);
    return gate?.status === 'approved';
  }

  /**
   * Get gate by ID
   */
  getGate(gateId: string): VetoGate | undefined {
    return this.gates.get(gateId);
  }

  /**
   * Get pending gates for an approver role
   */
  getPendingGatesForRole(role: ApproverRole): VetoGate[] {
    return Array.from(this.gates.values()).filter(gate => 
      (gate.status === 'pending' || gate.status === 'escalated') &&
      gate.requiredApprovers.includes(role)
    );
  }

  /**
   * Get gates for a matter
   */
  getGatesForMatter(matterId: string): VetoGate[] {
    return Array.from(this.gates.values()).filter(gate => gate.matterId === matterId);
  }

  // ===========================================================================
  // POLICY MANAGEMENT
  // ===========================================================================

  /**
   * Update a veto policy
   */
  updatePolicy(policy: VetoPolicy): void {
    this.policies.set(policy.gateType, policy);
    this.emit('policy-updated', policy);
  }

  /**
   * Get policy for a gate type
   */
  getPolicy(gateType: VetoGateType): VetoPolicy | undefined {
    return this.policies.get(gateType);
  }

  /**
   * Get all policies
   */
  getAllPolicies(): VetoPolicy[] {
    return Array.from(this.policies.values());
  }

  // ===========================================================================
  // CONVENIENCE METHODS FOR LEGAL WORKFLOWS
  // ===========================================================================

  /**
   * Request privilege export approval
   */
  async requestPrivilegeExportApproval(params: {
    matterId: string;
    documentId: string;
    requestedBy: string;
    exportReason: string;
    destination: string;
  }): Promise<VetoGate> {
    return this.createGate({
      type: 'privilege_export',
      matterId: params.matterId,
      documentId: params.documentId,
      requestedBy: params.requestedBy,
      reason: params.exportReason,
      context: { destination: params.destination },
    });
  }

  /**
   * Request AI output release approval
   */
  async requestAIOutputApproval(params: {
    matterId: string;
    requestedBy: string;
    outputType: string;
    outputSummary: string;
  }): Promise<VetoGate> {
    return this.createGate({
      type: 'ai_output_release',
      matterId: params.matterId,
      requestedBy: params.requestedBy,
      reason: `Release AI-generated ${params.outputType}`,
      context: { outputType: params.outputType, summary: params.outputSummary },
    });
  }

  /**
   * Request court filing approval
   */
  async requestCourtFilingApproval(params: {
    matterId: string;
    documentId: string;
    requestedBy: string;
    filingType: string;
    court: string;
    deadline?: Date;
  }): Promise<VetoGate> {
    const expiresInHours = params.deadline ? 
      Math.max(1, (params.deadline.getTime() - Date.now()) / (1000 * 60 * 60) - 1) : 
      undefined;
    
    const gateParams: Parameters<typeof this.createGate>[0] = {
      type: 'court_filing',
      matterId: params.matterId,
      documentId: params.documentId,
      requestedBy: params.requestedBy,
      reason: `Court filing: ${params.filingType}`,
      context: { filingType: params.filingType, court: params.court, deadline: params.deadline },
    };
    
    if (expiresInHours !== undefined) {
      gateParams.expiresInHours = expiresInHours;
    }
    
    return this.createGate(gateParams);
  }

  // ===========================================================================
  // AUDIT & INTEGRITY
  // ===========================================================================

  private addAuditEntry(gateId: string, action: string, actor: string, details: Record<string, any>): void {
    const entry: VetoAuditEntry = {
      id: `audit-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`,
      gateId,
      action,
      actor,
      timestamp: new Date(),
      details,
      hash: '',
      previousHash: this.lastAuditHash,
    };

    entry.hash = crypto.createHash('sha256')
      .update(JSON.stringify({ ...entry, hash: undefined }))
      .digest('hex');

    this.lastAuditHash = entry.hash;
    this.auditLog.push(entry);
  }

  private generateHash(data: any): string {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data))
      .digest('hex');
  }

  private generateSignature(data: any): string {
    return crypto.createHash('sha256')
      .update(JSON.stringify(data) + Date.now())
      .digest('hex');
  }

  /**
   * Get audit log for a gate
   */
  getAuditLog(gateId: string): VetoAuditEntry[] {
    return this.auditLog.filter(entry => entry.gateId === gateId);
  }

  /**
   * Verify audit chain integrity
   */
  verifyAuditIntegrity(): { valid: boolean; brokenAt?: number } {
    let previousHash = 'genesis';

    for (let i = 0; i < this.auditLog.length; i++) {
      const entry = this.auditLog[i];
      if (!entry) continue;
      
      if (entry.previousHash !== previousHash) {
        return { valid: false, brokenAt: i };
      }

      const computedHash = crypto.createHash('sha256')
        .update(JSON.stringify({ ...entry, hash: undefined }))
        .digest('hex');

      if (computedHash !== entry.hash) {
        return { valid: false, brokenAt: i };
      }

      previousHash = entry.hash;
    }

    return { valid: true };
  }

  // ===========================================================================
  // STATISTICS
  // ===========================================================================

  getStatistics(): {
    totalGates: number;
    byStatus: Record<ApprovalStatus, number>;
    byType: Record<VetoGateType, number>;
    averageApprovalTimeHours: number;
    rejectionRate: number;
  } {
    const gates = Array.from(this.gates.values());
    const byStatus: Record<string, number> = {};
    const byType: Record<string, number> = {};
    let totalApprovalTime = 0;
    let approvedCount = 0;
    let rejectedCount = 0;

    for (const gate of gates) {
      byStatus[gate.status] = (byStatus[gate.status] || 0) + 1;
      byType[gate.type] = (byType[gate.type] || 0) + 1;

      if (gate.status === 'approved' && gate.resolvedAt) {
        totalApprovalTime += gate.resolvedAt.getTime() - gate.requestedAt.getTime();
        approvedCount++;
      }
      if (gate.status === 'rejected') {
        rejectedCount++;
      }
    }

    return {
      totalGates: gates.length,
      byStatus: byStatus as Record<ApprovalStatus, number>,
      byType: byType as Record<VetoGateType, number>,
      averageApprovalTimeHours: approvedCount > 0 ? 
        (totalApprovalTime / approvedCount) / (1000 * 60 * 60) : 0,
      rejectionRate: gates.length > 0 ? rejectedCount / gates.length : 0,
    };
  }
}

// Export singleton instance
export const cendiaVetoService = new CendiaVetoService();
export default cendiaVetoService;
