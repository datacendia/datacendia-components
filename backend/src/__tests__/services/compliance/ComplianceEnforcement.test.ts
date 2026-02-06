/**
 * Compliance Enforcement Tests
 * Tests for real-time compliance rule enforcement
 */

import { describe, it, expect, beforeEach } from 'vitest';

type Severity = 'critical' | 'high' | 'medium' | 'low';
type Action = 'block' | 'warn' | 'log' | 'allow';

interface ComplianceRule {
  id: string;
  name: string;
  description: string;
  framework: string;
  controlId: string;
  condition: (context: EnforcementContext) => boolean;
  action: Action;
  severity: Severity;
  enabled: boolean;
}

interface EnforcementContext {
  userId: string;
  role: string;
  resource: string;
  action: string;
  data?: Record<string, unknown>;
  metadata?: Record<string, unknown>;
}

interface EnforcementResult {
  allowed: boolean;
  action: Action;
  violations: Array<{
    ruleId: string;
    ruleName: string;
    severity: Severity;
    message: string;
  }>;
  auditId: string;
}

class MockComplianceEnforcer {
  private rules: ComplianceRule[] = [];
  private auditLog: Array<{ id: string; timestamp: Date; context: EnforcementContext; result: EnforcementResult }> = [];
  private auditCounter = 0;

  constructor() {
    this.loadDefaultRules();
  }

  private loadDefaultRules() {
    this.rules = [
      // SOC2 Access Control
      {
        id: 'soc2-cc6.1-admin-access',
        name: 'Admin Access Logging',
        description: 'All admin access must be logged',
        framework: 'SOC2',
        controlId: 'CC6.1',
        condition: (ctx) => ctx.role === 'admin',
        action: 'log',
        severity: 'medium',
        enabled: true,
      },
      {
        id: 'soc2-cc6.1-data-export',
        name: 'Data Export Restriction',
        description: 'Bulk data exports require approval',
        framework: 'SOC2',
        controlId: 'CC6.1',
        condition: (ctx) => ctx.action === 'export' && ctx.resource === 'bulk_data',
        action: 'block',
        severity: 'high',
        enabled: true,
      },
      // HIPAA PHI Protection
      {
        id: 'hipaa-164.312-phi-access',
        name: 'PHI Access Control',
        description: 'PHI access requires healthcare role',
        framework: 'HIPAA',
        controlId: '164.312(a)(1)',
        condition: (ctx) => 
          ctx.resource === 'phi' && !['doctor', 'nurse', 'admin'].includes(ctx.role),
        action: 'block',
        severity: 'critical',
        enabled: true,
      },
      {
        id: 'hipaa-164.312-phi-logging',
        name: 'PHI Access Logging',
        description: 'All PHI access must be logged',
        framework: 'HIPAA',
        controlId: '164.312(b)',
        condition: (ctx) => ctx.resource === 'phi',
        action: 'log',
        severity: 'high',
        enabled: true,
      },
      // GDPR Data Subject Rights
      {
        id: 'gdpr-art17-erasure',
        name: 'Right to Erasure',
        description: 'Data erasure requests must be honored',
        framework: 'GDPR',
        controlId: 'Art.17',
        condition: (ctx) => ctx.action === 'erasure_request',
        action: 'allow',
        severity: 'high',
        enabled: true,
      },
      {
        id: 'gdpr-art32-encryption',
        name: 'Data Encryption Required',
        description: 'Personal data must be encrypted',
        framework: 'GDPR',
        controlId: 'Art.32',
        condition: (ctx) => 
          ctx.resource === 'personal_data' && ctx.metadata?.['encrypted'] !== true,
        action: 'warn',
        severity: 'high',
        enabled: true,
      },
      // PCI-DSS Payment Data
      {
        id: 'pci-req3-cardholder-data',
        name: 'Cardholder Data Protection',
        description: 'Cardholder data access restricted',
        framework: 'PCI-DSS',
        controlId: 'Req.3',
        condition: (ctx) => 
          ctx.resource === 'cardholder_data' && ctx.role !== 'payment_processor',
        action: 'block',
        severity: 'critical',
        enabled: true,
      },
      // NIST Access Control
      {
        id: 'nist-ac2-account-management',
        name: 'Account Management',
        description: 'Account changes require authorization',
        framework: 'NIST-800-53',
        controlId: 'AC-2',
        condition: (ctx) => 
          ['create_user', 'delete_user', 'modify_user'].includes(ctx.action) &&
          ctx.role !== 'admin',
        action: 'block',
        severity: 'high',
        enabled: true,
      },
    ];
  }

  addRule(rule: ComplianceRule): void {
    this.rules.push(rule);
  }

  removeRule(ruleId: string): boolean {
    const idx = this.rules.findIndex(r => r.id === ruleId);
    if (idx >= 0) {
      this.rules.splice(idx, 1);
      return true;
    }
    return false;
  }

  enableRule(ruleId: string): boolean {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = true;
      return true;
    }
    return false;
  }

  disableRule(ruleId: string): boolean {
    const rule = this.rules.find(r => r.id === ruleId);
    if (rule) {
      rule.enabled = false;
      return true;
    }
    return false;
  }

  enforce(context: EnforcementContext): EnforcementResult {
    const violations: EnforcementResult['violations'] = [];
    let finalAction: Action = 'allow';

    for (const rule of this.rules) {
      if (!rule.enabled) continue;

      if (rule.condition(context)) {
        violations.push({
          ruleId: rule.id,
          ruleName: rule.name,
          severity: rule.severity,
          message: rule.description,
        });

        // Escalate action based on severity
        if (rule.action === 'block') {
          finalAction = 'block';
        } else if (rule.action === 'warn' && finalAction !== 'block') {
          finalAction = 'warn';
        } else if (rule.action === 'log' && finalAction === 'allow') {
          finalAction = 'log';
        }
      }
    }

    this.auditCounter++;
    const auditId = `audit-${Date.now()}-${this.auditCounter}`;
    const result: EnforcementResult = {
      allowed: finalAction !== 'block',
      action: finalAction,
      violations,
      auditId,
    };

    this.auditLog.push({
      id: auditId,
      timestamp: new Date(),
      context,
      result,
    });

    return result;
  }

  getRulesByFramework(framework: string): ComplianceRule[] {
    return this.rules.filter(r => r.framework === framework);
  }

  getAuditLog(): typeof this.auditLog {
    return [...this.auditLog];
  }

  getViolationStats(): Record<Severity, number> {
    const stats: Record<Severity, number> = { critical: 0, high: 0, medium: 0, low: 0 };
    
    for (const entry of this.auditLog) {
      for (const v of entry.result.violations) {
        stats[v.severity]++;
      }
    }
    
    return stats;
  }
}

describe('Compliance Enforcement', () => {
  let enforcer: MockComplianceEnforcer;

  beforeEach(() => {
    enforcer = new MockComplianceEnforcer();
  });

  describe('SOC2 Enforcement', () => {
    it('should log admin access', () => {
      const result = enforcer.enforce({
        userId: 'admin-1',
        role: 'admin',
        resource: 'settings',
        action: 'read',
      });

      expect(result.allowed).toBe(true);
      expect(result.action).toBe('log');
      expect(result.violations.some(v => v.ruleId === 'soc2-cc6.1-admin-access')).toBe(true);
    });

    it('should block bulk data export', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'bulk_data',
        action: 'export',
      });

      expect(result.allowed).toBe(false);
      expect(result.action).toBe('block');
      expect(result.violations.some(v => v.ruleId === 'soc2-cc6.1-data-export')).toBe(true);
    });
  });

  describe('HIPAA Enforcement', () => {
    it('should block unauthorized PHI access', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'phi',
        action: 'read',
      });

      expect(result.allowed).toBe(false);
      expect(result.action).toBe('block');
      expect(result.violations.some(v => v.ruleId === 'hipaa-164.312-phi-access')).toBe(true);
    });

    it('should allow doctor PHI access with logging', () => {
      const result = enforcer.enforce({
        userId: 'doctor-1',
        role: 'doctor',
        resource: 'phi',
        action: 'read',
      });

      expect(result.allowed).toBe(true);
      expect(result.action).toBe('log');
      expect(result.violations.some(v => v.ruleId === 'hipaa-164.312-phi-logging')).toBe(true);
    });

    it('should allow nurse PHI access with logging', () => {
      const result = enforcer.enforce({
        userId: 'nurse-1',
        role: 'nurse',
        resource: 'phi',
        action: 'read',
      });

      expect(result.allowed).toBe(true);
    });
  });

  describe('GDPR Enforcement', () => {
    it('should allow erasure requests', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'user',
        resource: 'personal_data',
        action: 'erasure_request',
      });

      expect(result.allowed).toBe(true);
      expect(result.violations.some(v => v.ruleId === 'gdpr-art17-erasure')).toBe(true);
    });

    it('should warn on unencrypted personal data access', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'personal_data',
        action: 'read',
        metadata: { encrypted: false },
      });

      expect(result.allowed).toBe(true);
      expect(result.action).toBe('warn');
      expect(result.violations.some(v => v.ruleId === 'gdpr-art32-encryption')).toBe(true);
    });

    it('should not warn on encrypted personal data access', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'personal_data',
        action: 'read',
        metadata: { encrypted: true },
      });

      expect(result.violations.some(v => v.ruleId === 'gdpr-art32-encryption')).toBe(false);
    });
  });

  describe('PCI-DSS Enforcement', () => {
    it('should block non-processor cardholder data access', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'cardholder_data',
        action: 'read',
      });

      expect(result.allowed).toBe(false);
      expect(result.action).toBe('block');
      expect(result.violations.some(v => v.ruleId === 'pci-req3-cardholder-data')).toBe(true);
    });

    it('should allow payment processor cardholder data access', () => {
      const result = enforcer.enforce({
        userId: 'processor-1',
        role: 'payment_processor',
        resource: 'cardholder_data',
        action: 'read',
      });

      expect(result.allowed).toBe(true);
      expect(result.violations.some(v => v.ruleId === 'pci-req3-cardholder-data')).toBe(false);
    });
  });

  describe('NIST Enforcement', () => {
    it('should block non-admin user creation', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'users',
        action: 'create_user',
      });

      expect(result.allowed).toBe(false);
      expect(result.action).toBe('block');
      expect(result.violations.some(v => v.ruleId === 'nist-ac2-account-management')).toBe(true);
    });

    it('should allow admin user creation', () => {
      const result = enforcer.enforce({
        userId: 'admin-1',
        role: 'admin',
        resource: 'users',
        action: 'create_user',
      });

      // Admin access will be logged but not blocked
      expect(result.allowed).toBe(true);
    });
  });

  describe('Rule Management', () => {
    it('should add new rule', () => {
      enforcer.addRule({
        id: 'custom-rule',
        name: 'Custom Rule',
        description: 'Custom compliance rule',
        framework: 'Custom',
        controlId: 'CUST-1',
        condition: (ctx) => ctx.action === 'custom_action',
        action: 'block',
        severity: 'high',
        enabled: true,
      });

      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'user',
        resource: 'any',
        action: 'custom_action',
      });

      expect(result.allowed).toBe(false);
      expect(result.violations.some(v => v.ruleId === 'custom-rule')).toBe(true);
    });

    it('should remove rule', () => {
      const removed = enforcer.removeRule('soc2-cc6.1-data-export');
      expect(removed).toBe(true);

      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'bulk_data',
        action: 'export',
      });

      expect(result.allowed).toBe(true);
    });

    it('should disable rule', () => {
      enforcer.disableRule('soc2-cc6.1-data-export');

      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'bulk_data',
        action: 'export',
      });

      expect(result.allowed).toBe(true);
    });

    it('should enable rule', () => {
      enforcer.disableRule('soc2-cc6.1-data-export');
      enforcer.enableRule('soc2-cc6.1-data-export');

      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'bulk_data',
        action: 'export',
      });

      expect(result.allowed).toBe(false);
    });
  });

  describe('Audit Trail', () => {
    it('should generate audit ID for each enforcement', () => {
      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'user',
        resource: 'data',
        action: 'read',
      });

      expect(result.auditId).toContain('audit-');
    });

    it('should track audit log', () => {
      enforcer.enforce({
        userId: 'user-1',
        role: 'admin',
        resource: 'settings',
        action: 'read',
      });

      enforcer.enforce({
        userId: 'user-2',
        role: 'analyst',
        resource: 'data',
        action: 'read',
      });

      const log = enforcer.getAuditLog();
      expect(log.length).toBe(2);
    });

    it('should calculate violation stats', () => {
      // Trigger various violations
      enforcer.enforce({
        userId: 'user-1',
        role: 'analyst',
        resource: 'phi',
        action: 'read',
      }); // critical

      enforcer.enforce({
        userId: 'user-2',
        role: 'admin',
        resource: 'settings',
        action: 'read',
      }); // medium

      const stats = enforcer.getViolationStats();
      expect(stats.critical).toBeGreaterThan(0);
      expect(stats.medium).toBeGreaterThan(0);
    });
  });

  describe('Framework Filtering', () => {
    it('should get rules by framework', () => {
      const soc2Rules = enforcer.getRulesByFramework('SOC2');
      expect(soc2Rules.length).toBeGreaterThanOrEqual(2);
      expect(soc2Rules.every(r => r.framework === 'SOC2')).toBe(true);
    });

    it('should get HIPAA rules', () => {
      const hipaaRules = enforcer.getRulesByFramework('HIPAA');
      expect(hipaaRules.length).toBeGreaterThanOrEqual(2);
      expect(hipaaRules.every(r => r.framework === 'HIPAA')).toBe(true);
    });

    it('should get GDPR rules', () => {
      const gdprRules = enforcer.getRulesByFramework('GDPR');
      expect(gdprRules.length).toBeGreaterThanOrEqual(2);
      expect(gdprRules.every(r => r.framework === 'GDPR')).toBe(true);
    });
  });

  describe('Multiple Violations', () => {
    it('should collect multiple violations', () => {
      // Admin accessing PHI triggers both admin logging and PHI logging
      const result = enforcer.enforce({
        userId: 'admin-1',
        role: 'admin',
        resource: 'phi',
        action: 'read',
      });

      expect(result.violations.length).toBeGreaterThanOrEqual(2);
    });

    it('should escalate to most restrictive action', () => {
      // Create a scenario with both warn and block
      enforcer.addRule({
        id: 'test-warn',
        name: 'Test Warn',
        description: 'Test warning rule',
        framework: 'Test',
        controlId: 'TEST-1',
        condition: (ctx) => ctx.resource === 'test_resource',
        action: 'warn',
        severity: 'medium',
        enabled: true,
      });

      enforcer.addRule({
        id: 'test-block',
        name: 'Test Block',
        description: 'Test blocking rule',
        framework: 'Test',
        controlId: 'TEST-2',
        condition: (ctx) => ctx.resource === 'test_resource',
        action: 'block',
        severity: 'high',
        enabled: true,
      });

      const result = enforcer.enforce({
        userId: 'user-1',
        role: 'user',
        resource: 'test_resource',
        action: 'read',
      });

      expect(result.action).toBe('block');
      expect(result.allowed).toBe(false);
    });
  });
});
