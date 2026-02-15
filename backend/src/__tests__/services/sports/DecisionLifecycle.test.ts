// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * DECISION LIFECYCLE STATE MACHINE TESTS
 * =============================================================================
 * Critical governance tests for decision state transitions:
 * - Draft → Deliberating → Decided → Archived
 * - Mutability rules (what can change when)
 * - Locking behavior post-decision
 * - Audit hash invalidation on mutation attempts
 * 
 * Why this matters: In governance systems, state transitions are more 
 * important than correctness. Regulators and auditors need proof that
 * the "immutable record" claim is enforceable.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';

// =============================================================================
// DECISION STATE TYPES
// =============================================================================

type DecisionStatus = 'DRAFT' | 'DELIBERATING' | 'DECIDED' | 'ARCHIVED' | 'ESCALATED';

interface DecisionState {
  id: string;
  status: DecisionStatus;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lockedAt?: Date;
  archivedAt?: Date;
  auditHash?: string;
  version: number;
  metadata: Record<string, unknown>;
  deliberationStartedAt?: Date;
  deliberationEndedAt?: Date;
  finalDecision?: string;
  approvals: Array<{ userId: string; role: string; timestamp: Date }>;
  modifications: Array<{ field: string; oldValue: unknown; newValue: unknown; timestamp: Date; userId: string }>;
}

// =============================================================================
// STATE MACHINE IMPLEMENTATION (Test Double)
// =============================================================================

class DecisionLifecycleService {
  private decisions: Map<string, DecisionState> = new Map();

  createDecision(title: string, metadata: Record<string, unknown> = {}): DecisionState {
    const id = `dec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const now = new Date();
    
    const decision: DecisionState = {
      id,
      status: 'DRAFT',
      title,
      createdAt: now,
      updatedAt: now,
      version: 1,
      metadata,
      approvals: [],
      modifications: [],
    };
    
    this.decisions.set(id, decision);
    return decision;
  }

  getDecision(id: string): DecisionState | undefined {
    return this.decisions.get(id);
  }

  // State transition: DRAFT → DELIBERATING
  startDeliberation(id: string): { success: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { success: false, error: 'Decision not found' };
    
    if (decision.status !== 'DRAFT') {
      return { success: false, error: `Cannot start deliberation from ${decision.status} state` };
    }
    
    decision.status = 'DELIBERATING';
    decision.deliberationStartedAt = new Date();
    decision.updatedAt = new Date();
    decision.version++;
    
    return { success: true };
  }

  // State transition: DELIBERATING → DECIDED
  finalizeDecision(id: string, finalDecision: string, userId: string): { success: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { success: false, error: 'Decision not found' };
    
    if (decision.status !== 'DELIBERATING') {
      return { success: false, error: `Cannot finalize from ${decision.status} state` };
    }
    
    decision.status = 'DECIDED';
    decision.finalDecision = finalDecision;
    decision.deliberationEndedAt = new Date();
    decision.lockedAt = new Date();
    decision.updatedAt = new Date();
    decision.version++;
    
    // Generate audit hash - this locks the decision
    decision.auditHash = this.generateAuditHash(decision);
    
    return { success: true };
  }

  // State transition: DECIDED → ARCHIVED
  archiveDecision(id: string): { success: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { success: false, error: 'Decision not found' };
    
    if (decision.status !== 'DECIDED') {
      return { success: false, error: `Cannot archive from ${decision.status} state` };
    }
    
    decision.status = 'ARCHIVED';
    decision.archivedAt = new Date();
    decision.updatedAt = new Date();
    decision.version++;
    
    return { success: true };
  }

  // State transition: DELIBERATING → ESCALATED
  escalateDecision(id: string, reason: string): { success: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { success: false, error: 'Decision not found' };
    
    if (decision.status !== 'DELIBERATING') {
      return { success: false, error: `Cannot escalate from ${decision.status} state` };
    }
    
    decision.status = 'ESCALATED';
    decision.metadata.escalationReason = reason;
    decision.updatedAt = new Date();
    decision.version++;
    
    return { success: true };
  }

  // Attempt to modify a decision (enforces mutability rules)
  modifyDecision(
    id: string, 
    field: string, 
    newValue: unknown, 
    userId: string
  ): { success: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { success: false, error: 'Decision not found' };
    
    // CRITICAL: Enforce immutability after finalization
    if (decision.status === 'DECIDED' || decision.status === 'ARCHIVED') {
      return { 
        success: false, 
        error: `Cannot modify decision in ${decision.status} state - record is immutable` 
      };
    }
    
    // Record the modification attempt
    const oldValue = (decision as unknown as Record<string, unknown>)[field];
    decision.modifications.push({
      field,
      oldValue,
      newValue,
      timestamp: new Date(),
      userId,
    });
    
    // Apply modification
    (decision as unknown as Record<string, unknown>)[field] = newValue;
    decision.updatedAt = new Date();
    decision.version++;
    
    return { success: true };
  }

  // Verify audit hash integrity
  verifyAuditHash(id: string): { valid: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { valid: false, error: 'Decision not found' };
    
    if (!decision.auditHash) {
      return { valid: false, error: 'Decision has no audit hash (not finalized)' };
    }
    
    const currentHash = this.generateAuditHash(decision);
    return { valid: currentHash === decision.auditHash };
  }

  // Add agent input to deliberation
  addAgentInput(
    id: string, 
    agentId: string, 
    input: string
  ): { success: boolean; error?: string } {
    const decision = this.decisions.get(id);
    if (!decision) return { success: false, error: 'Decision not found' };
    
    // Can only add input during deliberation
    if (decision.status !== 'DELIBERATING') {
      return { 
        success: false, 
        error: `Cannot add agent input in ${decision.status} state - council is ${decision.status === 'DECIDED' ? 'closed' : 'not started'}` 
      };
    }
    
    if (!decision.metadata.agentInputs) {
      decision.metadata.agentInputs = [];
    }
    
    (decision.metadata.agentInputs as Array<{ agentId: string; input: string; timestamp: Date }>).push({
      agentId,
      input,
      timestamp: new Date(),
    });
    
    decision.updatedAt = new Date();
    return { success: true };
  }

  private generateAuditHash(decision: DecisionState): string {
    const hashPayload = {
      id: decision.id,
      title: decision.title,
      finalDecision: decision.finalDecision,
      deliberationStartedAt: decision.deliberationStartedAt?.toISOString(),
      deliberationEndedAt: decision.deliberationEndedAt?.toISOString(),
      metadata: decision.metadata,
      version: decision.version,
    };
    
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(hashPayload))
      .digest('hex');
  }
}

// =============================================================================
// VALID STATE TRANSITION TESTS
// =============================================================================

describe('Decision Lifecycle - Valid State Transitions', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should create decision in DRAFT state', () => {
    const decision = service.createDecision('Test Transfer Decision');
    expect(decision.status).toBe('DRAFT');
    expect(decision.version).toBe(1);
  });

  it('should transition DRAFT → DELIBERATING', () => {
    const decision = service.createDecision('Test Decision');
    const result = service.startDeliberation(decision.id);
    
    expect(result.success).toBe(true);
    
    const updated = service.getDecision(decision.id);
    expect(updated?.status).toBe('DELIBERATING');
    expect(updated?.deliberationStartedAt).toBeDefined();
    expect(updated?.version).toBe(2);
  });

  it('should transition DELIBERATING → DECIDED', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    const result = service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    expect(result.success).toBe(true);
    
    const updated = service.getDecision(decision.id);
    expect(updated?.status).toBe('DECIDED');
    expect(updated?.finalDecision).toBe('APPROVED');
    expect(updated?.lockedAt).toBeDefined();
    expect(updated?.auditHash).toBeDefined();
    expect(updated?.auditHash?.length).toBe(64); // SHA-256 hex
  });

  it('should transition DECIDED → ARCHIVED', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    const result = service.archiveDecision(decision.id);
    
    expect(result.success).toBe(true);
    
    const updated = service.getDecision(decision.id);
    expect(updated?.status).toBe('ARCHIVED');
    expect(updated?.archivedAt).toBeDefined();
  });

  it('should transition DELIBERATING → ESCALATED', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    const result = service.escalateDecision(decision.id, 'Requires board approval');
    
    expect(result.success).toBe(true);
    
    const updated = service.getDecision(decision.id);
    expect(updated?.status).toBe('ESCALATED');
    expect(updated?.metadata.escalationReason).toBe('Requires board approval');
  });

  it('should complete full lifecycle: DRAFT → DELIBERATING → DECIDED → ARCHIVED', () => {
    const decision = service.createDecision('Full Lifecycle Test');
    expect(decision.status).toBe('DRAFT');
    
    service.startDeliberation(decision.id);
    expect(service.getDecision(decision.id)?.status).toBe('DELIBERATING');
    
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    expect(service.getDecision(decision.id)?.status).toBe('DECIDED');
    
    service.archiveDecision(decision.id);
    expect(service.getDecision(decision.id)?.status).toBe('ARCHIVED');
    
    // Verify version incremented at each step
    expect(service.getDecision(decision.id)?.version).toBe(4);
  });
});

// =============================================================================
// INVALID STATE TRANSITION TESTS
// =============================================================================

describe('Decision Lifecycle - Invalid State Transitions', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should reject DRAFT → DECIDED (must go through DELIBERATING)', () => {
    const decision = service.createDecision('Test Decision');
    const result = service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot finalize from DRAFT state');
  });

  it('should reject DRAFT → ARCHIVED', () => {
    const decision = service.createDecision('Test Decision');
    const result = service.archiveDecision(decision.id);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot archive from DRAFT state');
  });

  it('should reject DELIBERATING → DRAFT (no backward transitions)', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    // Attempt to go back to DRAFT by starting deliberation again
    const result = service.startDeliberation(decision.id);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot start deliberation from DELIBERATING state');
  });

  it('should reject DECIDED → DELIBERATING (no backward transitions)', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    const result = service.startDeliberation(decision.id);
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot start deliberation from DECIDED state');
  });

  it('should reject ARCHIVED → any state', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    service.archiveDecision(decision.id);
    
    // Try all transitions
    expect(service.startDeliberation(decision.id).success).toBe(false);
    expect(service.finalizeDecision(decision.id, 'CHANGED', 'user').success).toBe(false);
    expect(service.escalateDecision(decision.id, 'reason').success).toBe(false);
  });
});

// =============================================================================
// MUTABILITY RULES TESTS
// =============================================================================

describe('Decision Lifecycle - Mutability Rules', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should allow modification in DRAFT state', () => {
    const decision = service.createDecision('Original Title');
    
    const result = service.modifyDecision(decision.id, 'title', 'Updated Title', 'user-123');
    
    expect(result.success).toBe(true);
    expect(service.getDecision(decision.id)?.title).toBe('Updated Title');
  });

  it('should allow modification in DELIBERATING state', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    const result = service.modifyDecision(
      decision.id, 
      'metadata', 
      { additionalContext: 'New information' }, 
      'user-123'
    );
    
    expect(result.success).toBe(true);
  });

  it('should REJECT modification in DECIDED state', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    const result = service.modifyDecision(decision.id, 'title', 'Tampered Title', 'attacker');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot modify decision in DECIDED state');
    expect(result.error).toContain('immutable');
    
    // Verify title unchanged
    expect(service.getDecision(decision.id)?.title).toBe('Test Decision');
  });

  it('should REJECT modification in ARCHIVED state', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    service.archiveDecision(decision.id);
    
    const result = service.modifyDecision(decision.id, 'title', 'Tampered Title', 'attacker');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot modify decision in ARCHIVED state');
    expect(result.error).toContain('immutable');
  });

  it('should track all modification attempts with audit trail', () => {
    const decision = service.createDecision('Original');
    
    service.modifyDecision(decision.id, 'title', 'First Update', 'user-1');
    service.modifyDecision(decision.id, 'title', 'Second Update', 'user-2');
    
    const updated = service.getDecision(decision.id);
    expect(updated?.modifications.length).toBe(2);
    expect(updated?.modifications[0].userId).toBe('user-1');
    expect(updated?.modifications[0].oldValue).toBe('Original');
    expect(updated?.modifications[1].oldValue).toBe('First Update');
  });
});

// =============================================================================
// LOCKING BEHAVIOR TESTS
// =============================================================================

describe('Decision Lifecycle - Locking Behavior', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should set lockedAt timestamp on finalization', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    const beforeFinalize = new Date();
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    const afterFinalize = new Date();
    
    const updated = service.getDecision(decision.id);
    expect(updated?.lockedAt).toBeDefined();
    expect(updated?.lockedAt!.getTime()).toBeGreaterThanOrEqual(beforeFinalize.getTime());
    expect(updated?.lockedAt!.getTime()).toBeLessThanOrEqual(afterFinalize.getTime());
  });

  it('should generate audit hash on finalization', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    const updated = service.getDecision(decision.id);
    expect(updated?.auditHash).toBeDefined();
    expect(updated?.auditHash?.length).toBe(64);
  });

  it('should verify audit hash integrity', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    const result = service.verifyAuditHash(decision.id);
    expect(result.valid).toBe(true);
  });

  it('should detect tampering via audit hash verification', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    // Directly tamper with the decision (bypassing service methods)
    const tampered = service.getDecision(decision.id)!;
    tampered.finalDecision = 'TAMPERED';
    
    const result = service.verifyAuditHash(decision.id);
    expect(result.valid).toBe(false);
  });
});

// =============================================================================
// LATE INPUT REJECTION TESTS
// =============================================================================

describe('Decision Lifecycle - Late Input Rejection', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should allow agent input during DELIBERATING', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    const result = service.addAgentInput(decision.id, 'agent-transfer-analyst', 'Analysis: Good value');
    
    expect(result.success).toBe(true);
  });

  it('should REJECT agent input before deliberation starts', () => {
    const decision = service.createDecision('Test Decision');
    
    const result = service.addAgentInput(decision.id, 'agent-transfer-analyst', 'Too early');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot add agent input in DRAFT state');
    expect(result.error).toContain('not started');
  });

  it('should REJECT agent input after council closes (DECIDED)', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    
    const result = service.addAgentInput(decision.id, 'agent-late-arrival', 'Too late!');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot add agent input in DECIDED state');
    expect(result.error).toContain('council is closed');
  });

  it('should REJECT agent input in ARCHIVED state', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user-123');
    service.archiveDecision(decision.id);
    
    const result = service.addAgentInput(decision.id, 'agent-late-arrival', 'Way too late!');
    
    expect(result.success).toBe(false);
    expect(result.error).toContain('Cannot add agent input in ARCHIVED state');
  });

  it('should preserve all inputs added during deliberation', () => {
    const decision = service.createDecision('Test Decision');
    service.startDeliberation(decision.id);
    
    service.addAgentInput(decision.id, 'agent-1', 'First input');
    service.addAgentInput(decision.id, 'agent-2', 'Second input');
    service.addAgentInput(decision.id, 'agent-3', 'Third input');
    
    const updated = service.getDecision(decision.id);
    const inputs = updated?.metadata.agentInputs as Array<{ agentId: string }>;
    
    expect(inputs.length).toBe(3);
    expect(inputs.map(i => i.agentId)).toEqual(['agent-1', 'agent-2', 'agent-3']);
  });
});

// =============================================================================
// VERSION TRACKING TESTS
// =============================================================================

describe('Decision Lifecycle - Version Tracking', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should increment version on each state change', () => {
    const decision = service.createDecision('Test');
    expect(decision.version).toBe(1);
    
    service.startDeliberation(decision.id);
    expect(service.getDecision(decision.id)?.version).toBe(2);
    
    service.finalizeDecision(decision.id, 'APPROVED', 'user');
    expect(service.getDecision(decision.id)?.version).toBe(3);
    
    service.archiveDecision(decision.id);
    expect(service.getDecision(decision.id)?.version).toBe(4);
  });

  it('should increment version on modification', () => {
    const decision = service.createDecision('Test');
    expect(decision.version).toBe(1);
    
    service.modifyDecision(decision.id, 'title', 'Updated', 'user');
    expect(service.getDecision(decision.id)?.version).toBe(2);
  });

  it('should NOT increment version on failed operations', () => {
    const decision = service.createDecision('Test');
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user');
    
    const versionBeforeAttempt = service.getDecision(decision.id)?.version;
    
    // This should fail
    service.modifyDecision(decision.id, 'title', 'Tampered', 'attacker');
    
    expect(service.getDecision(decision.id)?.version).toBe(versionBeforeAttempt);
  });
});

// =============================================================================
// TIMESTAMP CONSISTENCY TESTS
// =============================================================================

describe('Decision Lifecycle - Timestamp Consistency', () => {
  let service: DecisionLifecycleService;

  beforeEach(() => {
    service = new DecisionLifecycleService();
  });

  it('should have createdAt <= deliberationStartedAt <= deliberationEndedAt <= archivedAt', () => {
    const decision = service.createDecision('Test');
    
    // Small delays to ensure timestamp differences
    service.startDeliberation(decision.id);
    service.finalizeDecision(decision.id, 'APPROVED', 'user');
    service.archiveDecision(decision.id);
    
    const final = service.getDecision(decision.id)!;
    
    expect(final.createdAt.getTime()).toBeLessThanOrEqual(final.deliberationStartedAt!.getTime());
    expect(final.deliberationStartedAt!.getTime()).toBeLessThanOrEqual(final.deliberationEndedAt!.getTime());
    expect(final.deliberationEndedAt!.getTime()).toBeLessThanOrEqual(final.archivedAt!.getTime());
  });

  it('should update updatedAt on every operation', () => {
    const decision = service.createDecision('Test');
    const initialUpdatedAt = decision.updatedAt;
    
    service.startDeliberation(decision.id);
    const afterDeliberation = service.getDecision(decision.id)!.updatedAt;
    
    expect(afterDeliberation.getTime()).toBeGreaterThanOrEqual(initialUpdatedAt.getTime());
  });
});
