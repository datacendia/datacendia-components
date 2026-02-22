// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
import { describe, it, expect, beforeEach, vi } from 'vitest';

vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

import { CendiaMirageService } from '../../services/sovereign/CendiaMirageService.js';

describe('CendiaMirageService', () => {
  let service: CendiaMirageService;

  beforeEach(() => {
    service = new CendiaMirageService();
  });

  describe('Honeytoken Management', () => {
    it('should deploy a honeytoken', async () => {
      const token = await service.deployHoneytoken({
        organizationId: 'org-1',
        type: 'api_key',
        name: 'Decoy API Key',
        value: 'sk-decoy-abc123',
        placement: 'config/production.env',
        alertLevel: 'critical',
        expiresAt: null,
        metadata: { department: 'engineering' },
      });

      expect(token).toBeDefined();
      expect(token.id).toMatch(/^honey-/);
      expect(token.type).toBe('api_key');
      expect(token.triggered).toBe(false);
      expect(token.triggerCount).toBe(0);
      expect(token.value).toBe('sk-decoy-abc123');
    });

    it('should list honeytokens for organization', async () => {
      await service.deployHoneytoken({
        organizationId: 'org-list', type: 'credential', name: 'Decoy Cred',
        value: 'password123', placement: 'ldap', alertLevel: 'high', expiresAt: null, metadata: {},
      });
      await service.deployHoneytoken({
        organizationId: 'org-list', type: 'document', name: 'Decoy Doc',
        value: 'classified-doc', placement: 'shared-drive', alertLevel: 'medium', expiresAt: null, metadata: {},
      });

      const tokens = await service.getHoneytokens('org-list');
      expect(tokens).toHaveLength(2);
    });

    it('should trigger a honeytoken and return result with alert', async () => {
      const token = await service.deployHoneytoken({
        organizationId: 'org-trig', type: 'ssh_key', name: 'Decoy SSH Key',
        value: 'ssh-rsa AAAA...', placement: '~/.ssh/authorized_keys',
        alertLevel: 'critical', expiresAt: null, metadata: {},
      });

      const result = await service.triggerHoneytoken(token.id, {
        sourceIp: '192.168.1.100',
        userAgent: 'curl/7.68.0',
        action: 'authentication_attempt',
      });

      expect(result).not.toBeNull();
      expect(result!.honeytoken.triggered).toBe(true);
      expect(result!.honeytoken.triggerCount).toBe(1);
      expect(result!.honeytoken.lastTriggered).not.toBeNull();
      expect(result!.alert).toBeDefined();
      expect(result!.alert.severity).toBe('critical');
    });

    it('should increment trigger count on multiple triggers', async () => {
      const token = await service.deployHoneytoken({
        organizationId: 'org-multi', type: 'token', name: 'Decoy Token',
        value: 'tok-decoy', placement: 'vault', alertLevel: 'high', expiresAt: null, metadata: {},
      });

      await service.triggerHoneytoken(token.id, { sourceIp: '10.0.0.1', action: 'use' });
      const result = await service.triggerHoneytoken(token.id, { sourceIp: '10.0.0.2', action: 'use' });

      expect(result!.honeytoken.triggerCount).toBe(2);
    });

    it('should return null for triggering nonexistent honeytoken', async () => {
      const result = await service.triggerHoneytoken('nonexistent', {});
      expect(result).toBeNull();
    });

    it('should get triggered honeytokens', async () => {
      const token = await service.deployHoneytoken({
        organizationId: 'org-gt', type: 'api_key', name: 'GT Key',
        value: 'key', placement: 'env', alertLevel: 'high', expiresAt: null, metadata: {},
      });
      await service.deployHoneytoken({
        organizationId: 'org-gt', type: 'credential', name: 'GT Cred',
        value: 'pass', placement: 'ldap', alertLevel: 'low', expiresAt: null, metadata: {},
      });

      await service.triggerHoneytoken(token.id, { sourceIp: '1.2.3.4' });

      const triggered = await service.getTriggeredHoneytokens('org-gt');
      expect(triggered).toHaveLength(1);
      expect(triggered[0].id).toBe(token.id);
    });
  });

  describe('Canary Systems', () => {
    it('should deploy a canary system', async () => {
      const canary = await service.deployCanary({
        organizationId: 'org-1',
        name: 'Decoy Database Server',
        type: 'database',
        status: 'active',
        configuration: {
          osFingerprint: 'Ubuntu 22.04',
          services: ['mysql', 'ssh'],
          openPorts: [3306, 22],
          behaviorProfile: 'normal-db-server',
        },
      });

      expect(canary).toBeDefined();
      expect(canary.id).toMatch(/^canary-/);
      expect(canary.status).toBe('active');
      expect(canary.alerts).toHaveLength(0);
      expect(canary.interactions).toBe(0);
    });

    it('should record canary interaction and create alert', async () => {
      const canary = await service.deployCanary({
        organizationId: 'org-int',
        name: 'Decoy API',
        type: 'api_endpoint',
        status: 'active',
        configuration: {
          osFingerprint: 'Alpine Linux',
          services: ['nginx', 'node'],
          openPorts: [443, 8080],
          behaviorProfile: 'api-server',
        },
      });

      const alert = await service.recordCanaryInteraction(canary.id, {
        timestamp: new Date(),
        eventType: 'connection',
        sourceIp: '172.16.0.50',
        sourcePort: 54321,
        details: { protocol: 'HTTPS', path: '/api/v1/users' },
        severity: 'high',
      });

      expect(alert).not.toBeNull();
      expect(alert!.eventType).toBe('connection');
      expect(alert!.sourceIp).toBe('172.16.0.50');
    });

    it('should return null for unknown canary interaction', async () => {
      const alert = await service.recordCanaryInteraction('nonexistent', {
        timestamp: new Date(), eventType: 'connection', sourceIp: '1.2.3.4',
        sourcePort: 1234, details: {}, severity: 'low',
      });
      expect(alert).toBeNull();
    });

    it('should list canaries by organization', async () => {
      await service.deployCanary({
        organizationId: 'org-list-c', name: 'C1', type: 'server', status: 'active',
        configuration: { osFingerprint: 'Ubuntu', services: [], openPorts: [], behaviorProfile: 'default' },
      });
      const canaries = await service.getCanaries('org-list-c');
      expect(canaries).toHaveLength(1);
    });
  });

  describe('Sandbox Environments', () => {
    it('should create a sandbox environment', async () => {
      const sandbox = await service.createSandbox({
        organizationId: 'org-1',
        name: 'Attacker Containment Zone',
        redirectRules: [],
      });

      expect(sandbox).toBeDefined();
      expect(sandbox.id).toMatch(/^sandbox-/);
      expect(sandbox.status).toBe('ready');
      expect(sandbox.capturedActivity).toHaveLength(0);
    });

    it('should engage sandbox', async () => {
      const sandbox = await service.createSandbox({
        organizationId: 'org-engage', name: 'Engagement Test', redirectRules: [],
      });

      const engaged = await service.engageSandbox(sandbox.id);
      expect(engaged).not.toBeNull();
      expect(engaged!.status).toBe('engaged');
      expect(engaged!.engagementStart).not.toBeNull();
    });

    it('should record activity in engaged sandbox', async () => {
      const sandbox = await service.createSandbox({
        organizationId: 'org-act', name: 'Activity Test', redirectRules: [],
      });
      await service.engageSandbox(sandbox.id);

      const activity = await service.recordSandboxActivity(sandbox.id, {
        timestamp: new Date(),
        activityType: 'reconnaissance',
        details: { tool: 'nmap', technique: 'port-scan' },
        artifacts: ['scan-results.xml'],
      });

      expect(activity).not.toBeNull();
      expect(activity!.activityType).toBe('reconnaissance');
    });

    it('should generate forensic report', async () => {
      const sandbox = await service.createSandbox({
        organizationId: 'org-forensic', name: 'Forensic Test', redirectRules: [],
      });
      await service.engageSandbox(sandbox.id);
      await service.recordSandboxActivity(sandbox.id, {
        timestamp: new Date(), activityType: 'credential_theft',
        details: { tool: 'mimikatz', technique: 'lsass-dump' }, artifacts: [],
      });

      const report = await service.generateForensicReport(sandbox.id);
      expect(report).not.toBeNull();
      expect(report!.attackerProfile).toBeDefined();
      expect(report!.recommendations.length).toBeGreaterThan(0);
    });

    it('should return null for unknown sandbox engagement', async () => {
      const result = await service.engageSandbox('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('Threat Intelligence', () => {
    it('should accumulate threat intelligence from triggers', async () => {
      const token = await service.deployHoneytoken({
        organizationId: 'org-intel', type: 'api_key', name: 'Intel Key',
        value: 'key', placement: 'env', alertLevel: 'critical', expiresAt: null, metadata: {},
      });

      await service.triggerHoneytoken(token.id, { sourceIp: '10.0.0.1', type: 'authentication' });

      const intel = await service.getThreatIntelligence('org-intel');
      expect(intel.length).toBeGreaterThanOrEqual(1);
      expect(intel[0].sourceType).toBe('honeytoken');
    });
  });

  describe('Dashboard', () => {
    it('should return threat intelligence dashboard', async () => {
      await service.deployHoneytoken({
        organizationId: 'org-dash', type: 'credential', name: 'D1',
        value: 'decoy', placement: 'ldap', alertLevel: 'high', expiresAt: null, metadata: {},
      });
      await service.deployCanary({
        organizationId: 'org-dash', name: 'C1', type: 'server', status: 'active',
        configuration: { osFingerprint: 'Ubuntu', services: ['ssh'], openPorts: [22], behaviorProfile: 'default' },
      });

      const dashboard = await service.getDashboard('org-dash');
      expect(dashboard).toBeDefined();
      expect(dashboard.totalHoneytokens).toBe(1);
      expect(dashboard.activeCanaries).toBe(1);
      expect(dashboard.triggeredHoneytokens).toBe(0);
    });
  });
});
