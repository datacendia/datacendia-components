// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * PolicyEngine Tests
 * RBAC/ABAC policy enforcement tests
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Policy types
type Effect = 'allow' | 'deny';
type Action = 'read' | 'write' | 'delete' | 'approve' | 'veto' | 'admin';

interface Policy {
  id: string;
  subject: string;
  object: string;
  action: Action;
  effect: Effect;
  conditions?: Record<string, unknown>;
}

interface PolicyContext {
  userId: string;
  role: string;
  organizationId: string;
  department?: string;
  attributes?: Record<string, unknown>;
}

class MockPolicyEngine {
  private policies: Policy[] = [];

  constructor() {
    this.loadDefaultPolicies();
  }

  private loadDefaultPolicies() {
    this.policies = [
      // Admin policies
      { id: 'pol-1', subject: 'admin', object: '*', action: 'admin', effect: 'allow' },
      { id: 'pol-2', subject: 'admin', object: '*', action: 'read', effect: 'allow' },
      { id: 'pol-3', subject: 'admin', object: '*', action: 'write', effect: 'allow' },
      { id: 'pol-4', subject: 'admin', object: '*', action: 'delete', effect: 'allow' },
      
      // Analyst policies
      { id: 'pol-5', subject: 'analyst', object: 'deliberation', action: 'read', effect: 'allow' },
      { id: 'pol-6', subject: 'analyst', object: 'deliberation', action: 'write', effect: 'allow' },
      { id: 'pol-7', subject: 'analyst', object: 'decision', action: 'read', effect: 'allow' },
      
      // Viewer policies
      { id: 'pol-8', subject: 'viewer', object: 'deliberation', action: 'read', effect: 'allow' },
      { id: 'pol-9', subject: 'viewer', object: 'decision', action: 'read', effect: 'allow' },
      
      // Approver policies
      { id: 'pol-10', subject: 'approver', object: 'decision', action: 'approve', effect: 'allow' },
      { id: 'pol-11', subject: 'approver', object: 'deliberation', action: 'read', effect: 'allow' },
      
      // Veto authority policies
      { id: 'pol-12', subject: 'veto_authority', object: 'decision', action: 'veto', effect: 'allow' },
      { id: 'pol-13', subject: 'veto_authority', object: '*', action: 'read', effect: 'allow' },
      
      // Deny policies
      { id: 'pol-14', subject: 'viewer', object: 'admin_settings', action: 'read', effect: 'deny' },
      { id: 'pol-15', subject: 'analyst', object: 'admin_settings', action: 'read', effect: 'deny' },
    ];
  }

  addPolicy(policy: Policy): void {
    this.policies.push(policy);
  }

  removePolicy(policyId: string): boolean {
    const idx = this.policies.findIndex(p => p.id === policyId);
    if (idx >= 0) {
      this.policies.splice(idx, 1);
      return true;
    }
    return false;
  }

  enforce(context: PolicyContext, object: string, action: Action): boolean {
    // Check explicit deny first
    const denyPolicies = this.policies.filter(p => 
      p.effect === 'deny' &&
      (p.subject === context.role || p.subject === '*') &&
      (p.object === object || p.object === '*') &&
      p.action === action
    );

    if (denyPolicies.length > 0) {
      return false;
    }

    // Check allow policies
    const allowPolicies = this.policies.filter(p =>
      p.effect === 'allow' &&
      (p.subject === context.role || p.subject === '*') &&
      (p.object === object || p.object === '*') &&
      p.action === action
    );

    return allowPolicies.length > 0;
  }

  getEffectivePolicies(role: string): Policy[] {
    return this.policies.filter(p => p.subject === role || p.subject === '*');
  }

  checkBulk(context: PolicyContext, checks: Array<{ object: string; action: Action }>): Record<string, boolean> {
    const results: Record<string, boolean> = {};
    for (const check of checks) {
      const key = `${check.object}:${check.action}`;
      results[key] = this.enforce(context, check.object, check.action);
    }
    return results;
  }
}

describe('PolicyEngine', () => {
  let engine: MockPolicyEngine;

  beforeEach(() => {
    engine = new MockPolicyEngine();
  });

  describe('Basic RBAC', () => {
    it('should allow admin to perform any action', () => {
      const ctx: PolicyContext = { userId: 'u1', role: 'admin', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(true);
      expect(engine.enforce(ctx, 'deliberation', 'write')).toBe(true);
      expect(engine.enforce(ctx, 'deliberation', 'delete')).toBe(true);
      expect(engine.enforce(ctx, 'decision', 'admin')).toBe(true);
    });

    it('should allow analyst to read and write deliberations', () => {
      const ctx: PolicyContext = { userId: 'u2', role: 'analyst', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(true);
      expect(engine.enforce(ctx, 'deliberation', 'write')).toBe(true);
    });

    it('should deny analyst delete on deliberations', () => {
      const ctx: PolicyContext = { userId: 'u2', role: 'analyst', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'deliberation', 'delete')).toBe(false);
    });

    it('should allow viewer only read access', () => {
      const ctx: PolicyContext = { userId: 'u3', role: 'viewer', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(true);
      expect(engine.enforce(ctx, 'deliberation', 'write')).toBe(false);
      expect(engine.enforce(ctx, 'decision', 'read')).toBe(true);
    });

    it('should allow approver to approve decisions', () => {
      const ctx: PolicyContext = { userId: 'u4', role: 'approver', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'decision', 'approve')).toBe(true);
    });

    it('should allow veto authority to veto decisions', () => {
      const ctx: PolicyContext = { userId: 'u5', role: 'veto_authority', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'decision', 'veto')).toBe(true);
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(true);
    });
  });

  describe('Deny Rules', () => {
    it('should deny viewer access to admin settings', () => {
      const ctx: PolicyContext = { userId: 'u3', role: 'viewer', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'admin_settings', 'read')).toBe(false);
    });

    it('should deny analyst access to admin settings', () => {
      const ctx: PolicyContext = { userId: 'u2', role: 'analyst', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'admin_settings', 'read')).toBe(false);
    });

    it('should prioritize deny over allow', () => {
      // Add an allow policy for viewer on admin_settings
      engine.addPolicy({
        id: 'pol-test',
        subject: 'viewer',
        object: 'admin_settings',
        action: 'read',
        effect: 'allow',
      });

      const ctx: PolicyContext = { userId: 'u3', role: 'viewer', organizationId: 'org1' };
      
      // Deny should still take precedence
      expect(engine.enforce(ctx, 'admin_settings', 'read')).toBe(false);
    });
  });

  describe('Policy Management', () => {
    it('should add new policy', () => {
      const ctx: PolicyContext = { userId: 'u1', role: 'custom_role', organizationId: 'org1' };
      
      // Initially denied
      expect(engine.enforce(ctx, 'custom_object', 'read')).toBe(false);

      // Add policy
      engine.addPolicy({
        id: 'pol-custom',
        subject: 'custom_role',
        object: 'custom_object',
        action: 'read',
        effect: 'allow',
      });

      // Now allowed
      expect(engine.enforce(ctx, 'custom_object', 'read')).toBe(true);
    });

    it('should remove policy', () => {
      const ctx: PolicyContext = { userId: 'u2', role: 'analyst', organizationId: 'org1' };
      
      // Initially allowed
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(true);

      // Remove policy
      const removed = engine.removePolicy('pol-5');
      expect(removed).toBe(true);

      // Now denied
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(false);
    });

    it('should return false when removing non-existent policy', () => {
      const removed = engine.removePolicy('pol-nonexistent');
      expect(removed).toBe(false);
    });

    it('should get effective policies for role', () => {
      const policies = engine.getEffectivePolicies('analyst');
      
      expect(policies.length).toBeGreaterThan(0);
      expect(policies.some(p => p.subject === 'analyst')).toBe(true);
    });
  });

  describe('Bulk Checks', () => {
    it('should check multiple permissions at once', () => {
      const ctx: PolicyContext = { userId: 'u2', role: 'analyst', organizationId: 'org1' };
      
      const results = engine.checkBulk(ctx, [
        { object: 'deliberation', action: 'read' },
        { object: 'deliberation', action: 'write' },
        { object: 'deliberation', action: 'delete' },
        { object: 'admin_settings', action: 'read' },
      ]);

      expect(results['deliberation:read']).toBe(true);
      expect(results['deliberation:write']).toBe(true);
      expect(results['deliberation:delete']).toBe(false);
      expect(results['admin_settings:read']).toBe(false);
    });
  });

  describe('Unknown Roles', () => {
    it('should deny all actions for unknown role', () => {
      const ctx: PolicyContext = { userId: 'u99', role: 'unknown_role', organizationId: 'org1' };
      
      expect(engine.enforce(ctx, 'deliberation', 'read')).toBe(false);
      expect(engine.enforce(ctx, 'decision', 'write')).toBe(false);
      expect(engine.enforce(ctx, 'admin_settings', 'admin')).toBe(false);
    });
  });
});
