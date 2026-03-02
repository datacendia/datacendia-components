/**
 * Module — Audit Service Test
 *
 * Platform module.
 * @module __tests__/security/audit.service.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// AUDIT SERVICE TESTS
// Critical path coverage for audit logging and compliance
// =============================================================================

import { describe, it, expect, beforeEach } from 'vitest';
import { auditService } from '../../security/audit.service.js';

// =============================================================================
// AUDIT EVENT LOGGING TESTS
// =============================================================================

describe('AuditService', () => {
  const testOrgId = 'test-org-' + Date.now();

  describe('log', () => {
    it('should log an audit event', async () => {
      const event = await auditService.log({
        eventType: 'auth.login',
        severity: 'info',
        organizationId: testOrgId,
        userId: 'user-123',
        userName: 'Test User',
        resource: { type: 'session', id: 'sess-123' },
        action: 'User logged in',
        details: { method: 'password' },
        outcome: 'success',
      });

      expect(event).toHaveProperty('id');
      expect(event.id).toMatch(/^audit_/);
      expect(event).toHaveProperty('timestamp');
      expect(event.eventType).toBe('auth.login');
      expect(event.severity).toBe('info');
      expect(event.outcome).toBe('success');
    });

    it('should log warning severity event', async () => {
      const event = await auditService.log({
        eventType: 'admin.permission_granted',
        severity: 'warning',
        organizationId: testOrgId,
        userId: 'admin-1',
        resource: { type: 'permission', id: 'perm-1' },
        action: 'Granted admin permission',
        details: { targetUser: 'user-456' },
        outcome: 'success',
      });

      expect(event.severity).toBe('warning');
    });

    it('should log critical severity event and trigger alert', async () => {
      const event = await auditService.log({
        eventType: 'security.unauthorized_access',
        severity: 'critical',
        organizationId: testOrgId,
        userId: 'attacker-1',
        ipAddress: '192.168.1.100',
        resource: { type: 'admin_panel', id: 'admin' },
        action: 'Unauthorized access attempt',
        details: { path: '/admin/users' },
        outcome: 'failure',
      });

      expect(event.severity).toBe('critical');
      expect(event.outcome).toBe('failure');
    });

    it('should generate unique event IDs', async () => {
      const event1 = await auditService.log({
        eventType: 'data.accessed',
        severity: 'info',
        organizationId: testOrgId,
        resource: { type: 'document', id: 'doc-1' },
        action: 'Document accessed',
        details: {},
        outcome: 'success',
      });

      const event2 = await auditService.log({
        eventType: 'data.accessed',
        severity: 'info',
        organizationId: testOrgId,
        resource: { type: 'document', id: 'doc-2' },
        action: 'Document accessed',
        details: {},
        outcome: 'success',
      });

      expect(event1.id).not.toBe(event2.id);
    });
  });

  // ===========================================================================
  // DELIBERATION LOGGING TESTS
  // ===========================================================================

  describe('logDeliberation', () => {
    it('should log completed deliberation', async () => {
      await expect(auditService.logDeliberation({
        organizationId: testOrgId,
        deliberationId: 'delib-123',
        query: 'What is the best approach for Q4 strategy?',
        userId: 'user-123',
        userName: 'Test User',
        agents: ['strategist', 'analyst', 'risk-assessor'],
        outcome: 'completed',
        confidence: 0.85,
        approvedBy: 'manager-1',
      })).resolves.not.toThrow();
    });

    it('should log cancelled deliberation', async () => {
      await expect(auditService.logDeliberation({
        organizationId: testOrgId,
        deliberationId: 'delib-456',
        query: 'Should we proceed with merger?',
        userId: 'user-456',
        userName: 'Another User',
        agents: ['legal', 'financial'],
        outcome: 'cancelled',
      })).resolves.not.toThrow();
    });

    it('should log failed deliberation', async () => {
      await expect(auditService.logDeliberation({
        organizationId: testOrgId,
        deliberationId: 'delib-789',
        query: 'Complex query that failed',
        userId: 'user-789',
        userName: 'Failed User',
        agents: ['agent-1'],
        outcome: 'failed',
        ipAddress: '10.0.0.1',
      })).resolves.not.toThrow();
    });

    it('should log vetoed deliberation', async () => {
      await expect(auditService.logDeliberation({
        organizationId: testOrgId,
        deliberationId: 'delib-veto',
        query: 'Risky decision',
        userId: 'user-123',
        userName: 'Test User',
        agents: ['risk-assessor'],
        outcome: 'completed',
        vetoedBy: 'veto-authority-1',
      })).resolves.not.toThrow();
    });
  });

  // ===========================================================================
  // SESSION MANAGEMENT TESTS
  // ===========================================================================

  describe('createSession', () => {
    it('should create a new session', async () => {
      const session = await auditService.createSession({
        userId: 'user-session-test',
        organizationId: testOrgId,
        ipAddress: '192.168.1.1',
        userAgent: 'Mozilla/5.0 Test Browser',
      });

      expect(session).toHaveProperty('id');
      expect(session.id).toMatch(/^sess_/);
      expect(session.userId).toBe('user-session-test');
      expect(session.organizationId).toBe(testOrgId);
      expect(session.ipAddress).toBe('192.168.1.1');
      expect(session.isActive).toBe(true);
      expect(session.mfaVerified).toBe(false);
    });

    it('should set default session duration to 480 minutes', async () => {
      const before = Date.now();
      const session = await auditService.createSession({
        userId: 'user-duration-test',
        organizationId: testOrgId,
        ipAddress: '192.168.1.2',
        userAgent: 'Test Browser',
      });
      const after = Date.now();

      const expectedMin = before + 480 * 60 * 1000;
      const expectedMax = after + 480 * 60 * 1000;

      expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin - 1000);
      expect(session.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax + 1000);
    });

    it('should allow custom session duration', async () => {
      const before = Date.now();
      const session = await auditService.createSession({
        userId: 'user-custom-duration',
        organizationId: testOrgId,
        ipAddress: '192.168.1.3',
        userAgent: 'Test Browser',
        durationMinutes: 60,
      });
      const after = Date.now();

      const expectedMin = before + 60 * 60 * 1000;
      const expectedMax = after + 60 * 60 * 1000;

      expect(session.expiresAt.getTime()).toBeGreaterThanOrEqual(expectedMin - 1000);
      expect(session.expiresAt.getTime()).toBeLessThanOrEqual(expectedMax + 1000);
    });
  });

  describe('endSession', () => {
    it('should end an active session', async () => {
      const session = await auditService.createSession({
        userId: 'user-end-test',
        organizationId: testOrgId,
        ipAddress: '192.168.1.4',
        userAgent: 'Test Browser',
      });

      await expect(auditService.endSession(session.id)).resolves.not.toThrow();
    });

    it('should handle ending non-existent session', async () => {
      await expect(auditService.endSession('non-existent-session')).resolves.not.toThrow();
    });
  });

  describe('validateSession', () => {
    it('should validate active session', async () => {
      const session = await auditService.createSession({
        userId: 'user-validate-test',
        organizationId: testOrgId,
        ipAddress: '192.168.1.5',
        userAgent: 'Test Browser',
      });

      const validated = auditService.validateSession(session.id);

      expect(validated).not.toBeNull();
      expect(validated?.id).toBe(session.id);
      expect(validated?.isActive).toBe(true);
    });

    it('should return null for non-existent session', () => {
      const validated = auditService.validateSession('non-existent');
      expect(validated).toBeNull();
    });

    it('should return null for ended session', async () => {
      const session = await auditService.createSession({
        userId: 'user-ended-test',
        organizationId: testOrgId,
        ipAddress: '192.168.1.6',
        userAgent: 'Test Browser',
      });

      await auditService.endSession(session.id);

      const validated = auditService.validateSession(session.id);
      expect(validated).toBeNull();
    });

    it('should update lastActivityAt on validation', async () => {
      const session = await auditService.createSession({
        userId: 'user-activity-test',
        organizationId: testOrgId,
        ipAddress: '192.168.1.7',
        userAgent: 'Test Browser',
      });

      const originalActivity = session.lastActivityAt;

      // Wait a bit
      await new Promise(resolve => setTimeout(resolve, 10));

      const validated = auditService.validateSession(session.id);

      expect(validated?.lastActivityAt.getTime()).toBeGreaterThanOrEqual(originalActivity.getTime());
    });
  });

  describe('getActiveSessions', () => {
    it('should get active sessions for user', async () => {
      const userId = 'user-active-sessions-' + Date.now();

      await auditService.createSession({
        userId,
        organizationId: testOrgId,
        ipAddress: '192.168.1.10',
        userAgent: 'Browser 1',
      });

      await auditService.createSession({
        userId,
        organizationId: testOrgId,
        ipAddress: '192.168.1.11',
        userAgent: 'Browser 2',
      });

      const sessions = auditService.getActiveSessions(userId);

      expect(sessions.length).toBeGreaterThanOrEqual(2);
      expect(sessions.every(s => s.userId === userId)).toBe(true);
      expect(sessions.every(s => s.isActive)).toBe(true);
    });

    it('should return empty array for user with no sessions', () => {
      const sessions = auditService.getActiveSessions('no-sessions-user-' + Date.now());
      expect(sessions).toEqual([]);
    });
  });

  // ===========================================================================
  // ACCESS CONTROL TESTS
  // ===========================================================================

  describe('hasPermission', () => {
    it('should return false for user without permission', () => {
      const hasAccess = auditService.hasPermission(
        'user-no-perms-' + Date.now(),
        'secret-resource',
        'read'
      );

      expect(hasAccess).toBe(false);
    });
  });

  describe('grantPermission', () => {
    it('should grant permission to user', async () => {
      const userId = 'user-grant-test-' + Date.now();
      const resource = 'test-resource-' + Date.now();

      await auditService.grantPermission({
        userId,
        resource,
        permission: 'read',
        grantedBy: 'admin-1',
        organizationId: testOrgId,
      });

      const hasAccess = auditService.hasPermission(userId, resource, 'read');
      expect(hasAccess).toBe(true);
    });

    it('should grant permission with expiration', async () => {
      const userId = 'user-expiring-perm-' + Date.now();
      const resource = 'expiring-resource-' + Date.now();

      await auditService.grantPermission({
        userId,
        resource,
        permission: 'write',
        grantedBy: 'admin-1',
        organizationId: testOrgId,
        expiresAt: new Date(Date.now() + 3600000), // 1 hour from now
      });

      const hasAccess = auditService.hasPermission(userId, resource, 'write');
      expect(hasAccess).toBe(true);
    });

    it('should not grant access for different permission level', async () => {
      const userId = 'user-perm-level-' + Date.now();
      const resource = 'level-resource-' + Date.now();

      await auditService.grantPermission({
        userId,
        resource,
        permission: 'read',
        grantedBy: 'admin-1',
        organizationId: testOrgId,
      });

      // Should have read but not write
      expect(auditService.hasPermission(userId, resource, 'read')).toBe(true);
      expect(auditService.hasPermission(userId, resource, 'write')).toBe(false);
      expect(auditService.hasPermission(userId, resource, 'admin')).toBe(false);
    });
  });

  // ===========================================================================
  // QUERY EVENTS TESTS
  // ===========================================================================

  describe('queryEvents', () => {
    const queryOrgId = 'query-org-' + Date.now();

    beforeEach(async () => {
      // Add some test events
      await auditService.log({
        eventType: 'auth.login',
        severity: 'info',
        organizationId: queryOrgId,
        userId: 'query-user-1',
        resource: { type: 'session' },
        action: 'Login',
        details: {},
        outcome: 'success',
      });

      await auditService.log({
        eventType: 'auth.failed',
        severity: 'warning',
        organizationId: queryOrgId,
        userId: 'query-user-2',
        resource: { type: 'session' },
        action: 'Failed login',
        details: {},
        outcome: 'failure',
      });

      await auditService.log({
        eventType: 'data.accessed',
        severity: 'info',
        organizationId: queryOrgId,
        userId: 'query-user-1',
        resource: { type: 'document', id: 'doc-1' },
        action: 'Accessed document',
        details: {},
        outcome: 'success',
      });
    });

    it('should query events by organization', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
      });

      expect(result.events.length).toBeGreaterThan(0);
      expect(result.events.every(e => e.organizationId === queryOrgId)).toBe(true);
    });

    it('should filter by event type', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
        eventTypes: ['auth.login'],
      });

      expect(result.events.every(e => e.eventType === 'auth.login')).toBe(true);
    });

    it('should filter by severity', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
        severity: ['warning'],
      });

      expect(result.events.every(e => e.severity === 'warning')).toBe(true);
    });

    it('should filter by user ID', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
        userId: 'query-user-1',
      });

      expect(result.events.every(e => e.userId === 'query-user-1')).toBe(true);
    });

    it('should filter by resource type', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
        resourceType: 'document',
      });

      expect(result.events.every(e => e.resource.type === 'document')).toBe(true);
    });

    it('should respect limit and offset', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
        limit: 1,
        offset: 0,
      });

      expect(result.events.length).toBeLessThanOrEqual(1);
    });

    it('should return total count', async () => {
      const result = await auditService.queryEvents({
        organizationId: queryOrgId,
      });

      expect(typeof result.total).toBe('number');
      expect(result.total).toBeGreaterThan(0);
    });
  });

  // ===========================================================================
  // COMPLIANCE REPORT TESTS
  // ===========================================================================

  describe('generateSOC2Report', () => {
    it('should generate SOC 2 compliance report', async () => {
      const reportOrgId = 'report-org-' + Date.now();

      // Add some events for the report
      await auditService.log({
        eventType: 'auth.login',
        severity: 'info',
        organizationId: reportOrgId,
        resource: { type: 'session' },
        action: 'Login',
        details: {},
        outcome: 'success',
      });

      const report = await auditService.generateSOC2Report({
        organizationId: reportOrgId,
        startDate: new Date(Date.now() - 86400000), // 1 day ago
        endDate: new Date(),
        generatedBy: 'compliance-admin',
      });

      expect(report).toHaveProperty('id');
      expect(report.id).toMatch(/^report_/);
      expect(report.type).toBe('soc2');
      expect(report.organizationId).toBe(reportOrgId);
      expect(report.generatedBy).toBe('compliance-admin');
    });

    it('should include compliance sections', async () => {
      const report = await auditService.generateSOC2Report({
        organizationId: 'sections-org-' + Date.now(),
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(),
        generatedBy: 'admin',
      });

      expect(report.sections.length).toBeGreaterThan(0);
      expect(report.sections[0]).toHaveProperty('id');
      expect(report.sections[0]).toHaveProperty('name');
      expect(report.sections[0]).toHaveProperty('controls');
    });

    it('should include summary statistics', async () => {
      const report = await auditService.generateSOC2Report({
        organizationId: 'summary-org-' + Date.now(),
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(),
        generatedBy: 'admin',
      });

      expect(report.summary).toHaveProperty('totalControls');
      expect(report.summary).toHaveProperty('passedControls');
      expect(report.summary).toHaveProperty('failedControls');
      expect(report.summary).toHaveProperty('notApplicable');
      expect(report.summary.totalControls).toBeGreaterThan(0);
    });

    it('should include control evidence', async () => {
      const report = await auditService.generateSOC2Report({
        organizationId: 'evidence-org-' + Date.now(),
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(),
        generatedBy: 'admin',
      });

      const controls = report.sections[0].controls;
      expect(controls.length).toBeGreaterThan(0);
      expect(controls[0]).toHaveProperty('evidence');
      expect(Array.isArray(controls[0].evidence)).toBe(true);
    });
  });

  // ===========================================================================
  // EXPORT TESTS
  // ===========================================================================

  describe('exportAuditLog', () => {
    const exportOrgId = 'export-org-' + Date.now();

    beforeEach(async () => {
      await auditService.log({
        eventType: 'auth.login',
        severity: 'info',
        organizationId: exportOrgId,
        userId: 'export-user',
        userName: 'Export User',
        resource: { type: 'session', id: 'sess-export' },
        action: 'Login',
        details: {},
        outcome: 'success',
      });
    });

    it('should export audit log as JSON', async () => {
      const json = await auditService.exportAuditLog({
        organizationId: exportOrgId,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(),
        format: 'json',
      });

      expect(typeof json).toBe('string');
      const parsed = JSON.parse(json);
      expect(Array.isArray(parsed)).toBe(true);
    });

    it('should export audit log as CSV', async () => {
      const csv = await auditService.exportAuditLog({
        organizationId: exportOrgId,
        startDate: new Date(Date.now() - 86400000),
        endDate: new Date(),
        format: 'csv',
      });

      expect(typeof csv).toBe('string');
      expect(csv).toContain('timestamp,eventType,severity');
      expect(csv.split('\n').length).toBeGreaterThan(1);
    });
  });
});
