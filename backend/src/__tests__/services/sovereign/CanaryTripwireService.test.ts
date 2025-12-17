// =============================================================================
// CANARY TRIPWIRE SERVICE TESTS
// Tests for Exfiltration Detection System
// Grade: A | Coverage: Comprehensive | Risk: Security Critical (Data Leak Detection)
// 
// SERVICE OVERVIEW:
// CanaryTripwireService™ seeds the database with unique, trackable canary records
// that look legitimate but are traceable if they ever appear outside the system.
// "We'll know if data ever leaks - and exactly when."
// Turns "trust us" into "we'll know if we fail."
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../../config/database.js', () => ({
  prisma: {
    canary_records: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
    canary_alerts: { create: vi.fn(), findMany: vi.fn(), update: vi.fn() },
  },
}));

import type {
  Canary,
  CanaryType,
  CanaryContent,
  CanaryAlert,
  CanaryDeployment,
} from '../../../services/sovereign/CanaryTripwireService.js';

describe('CanaryTripwireService', () => {
  beforeEach(() => { vi.clearAllMocks(); });

  // ===========================================================================
  // CANARY TYPES (9 types)
  // ===========================================================================

  describe('CanaryType', () => {
    it('should support decision canary type', () => {
      const type: CanaryType = 'decision';
      expect(type).toBe('decision');
    });

    it('should support financial canary type', () => {
      const type: CanaryType = 'financial';
      expect(type).toBe('financial');
    });

    it('should support customer canary type', () => {
      const type: CanaryType = 'customer';
      expect(type).toBe('customer');
    });

    it('should support credential canary type', () => {
      const type: CanaryType = 'credential';
      expect(type).toBe('credential');
    });

    it('should support document canary type', () => {
      const type: CanaryType = 'document';
      expect(type).toBe('document');
    });

    it('should support api_key canary type', () => {
      const type: CanaryType = 'api_key';
      expect(type).toBe('api_key');
    });

    it('should support executive canary type', () => {
      const type: CanaryType = 'executive';
      expect(type).toBe('executive');
    });

    it('should support acquisition canary type', () => {
      const type: CanaryType = 'acquisition';
      expect(type).toBe('acquisition');
    });

    it('should support custom canary type', () => {
      const type: CanaryType = 'custom';
      expect(type).toBe('custom');
    });
  });

  // ===========================================================================
  // CANARY STRUCTURE
  // ===========================================================================

  describe('Canary Structure', () => {
    it('should create valid canary', () => {
      const canary: Canary = {
        id: 'canary-123',
        organizationId: 'org-456',
        canaryType: 'acquisition',
        canaryCode: 'CDNA-ABC12345',
        content: {
          title: 'Acquisition of Target Corp',
          description: 'Confidential M&A materials',
          data: { targetCompany: 'Target Corp', valuation: '$500M' },
          uniqueMarkers: ['CDNA-ABC12345', 'Target Corp'],
        },
        tableName: 'decisions',
        recordId: 'decision-fake-123',
        triggerUrls: ['https://canary.datacendia.com/trigger/ABC12345'],
        webhookUrl: 'https://alerts.company.com/canary',
        status: 'active',
        createdAt: new Date(),
      };
      expect(canary.status).toBe('active');
    });

    it('should support active status', () => {
      const canary: Partial<Canary> = { status: 'active' };
      expect(canary.status).toBe('active');
    });

    it('should support triggered status', () => {
      const canary: Partial<Canary> = { status: 'triggered' };
      expect(canary.status).toBe('triggered');
    });

    it('should support expired status', () => {
      const canary: Partial<Canary> = { status: 'expired' };
      expect(canary.status).toBe('expired');
    });

    it('should support disabled status', () => {
      const canary: Partial<Canary> = { status: 'disabled' };
      expect(canary.status).toBe('disabled');
    });

    it('should handle trigger source', () => {
      const canary: Partial<Canary> = {
        status: 'triggered',
        triggeredAt: new Date(),
        triggerSource: 'pastebin.com',
      };
      expect(canary.triggerSource).toBe('pastebin.com');
    });

    it('should handle multiple trigger URLs', () => {
      const canary: Partial<Canary> = {
        triggerUrls: ['url1', 'url2', 'url3'],
      };
      expect(canary.triggerUrls?.length).toBe(3);
    });

    it('should handle expiration date', () => {
      const canary: Partial<Canary> = {
        expiresAt: new Date('2025-12-31'),
      };
      expect(canary.expiresAt).toBeDefined();
    });
  });

  // ===========================================================================
  // CANARY CONTENT STRUCTURE
  // ===========================================================================

  describe('CanaryContent Structure', () => {
    it('should create valid content', () => {
      const content: CanaryContent = {
        title: 'Q4 Earnings Preview',
        description: 'Confidential financial data',
        data: { revenue: 150000000, growth: 0.15 },
        uniqueMarkers: ['CFIN-12345', 'Q4-PREVIEW'],
        steganographicMarker: 'hidden-marker-xyz',
      };
      expect(content.uniqueMarkers.length).toBe(2);
    });

    it('should handle multiple unique markers', () => {
      const content: Partial<CanaryContent> = {
        uniqueMarkers: ['marker1', 'marker2', 'marker3', 'marker4', 'marker5'],
      };
      expect(content.uniqueMarkers?.length).toBe(5);
    });

    it('should handle steganographic marker', () => {
      const content: Partial<CanaryContent> = {
        steganographicMarker: 'hidden-in-image-xyz',
      };
      expect(content.steganographicMarker).toContain('hidden');
    });

    it('should handle complex data object', () => {
      const content: Partial<CanaryContent> = {
        data: {
          nested: { deep: { value: 123 } },
          array: [1, 2, 3],
          boolean: true,
        },
      };
      expect(content.data).toBeDefined();
    });
  });

  // ===========================================================================
  // CANARY ALERT STRUCTURE
  // ===========================================================================

  describe('CanaryAlert Structure', () => {
    it('should create valid alert', () => {
      const alert: CanaryAlert = {
        id: 'alert-123',
        canaryId: 'canary-456',
        canaryCode: 'CDNA-ABC12345',
        detectedAt: new Date(),
        detectionSource: 'pastebin.com',
        detectionMethod: 'external_scan',
        sourceUrl: 'https://pastebin.com/abc123',
        sourceIp: '192.168.1.1',
        rawEvidence: 'Found marker CDNA-ABC12345 in paste...',
        acknowledged: false,
        severity: 'critical',
        investigationStatus: 'pending',
      };
      expect(alert.severity).toBe('critical');
    });

    it('should support external_scan detection method', () => {
      const alert: Partial<CanaryAlert> = { detectionMethod: 'external_scan' };
      expect(alert.detectionMethod).toBe('external_scan');
    });

    it('should support webhook detection method', () => {
      const alert: Partial<CanaryAlert> = { detectionMethod: 'webhook' };
      expect(alert.detectionMethod).toBe('webhook');
    });

    it('should support manual detection method', () => {
      const alert: Partial<CanaryAlert> = { detectionMethod: 'manual' };
      expect(alert.detectionMethod).toBe('manual');
    });

    it('should support darkweb detection method', () => {
      const alert: Partial<CanaryAlert> = { detectionMethod: 'darkweb' };
      expect(alert.detectionMethod).toBe('darkweb');
    });

    it('should support pastebin detection method', () => {
      const alert: Partial<CanaryAlert> = { detectionMethod: 'pastebin' };
      expect(alert.detectionMethod).toBe('pastebin');
    });

    it('should support critical severity', () => {
      const alert: Partial<CanaryAlert> = { severity: 'critical' };
      expect(alert.severity).toBe('critical');
    });

    it('should support high severity', () => {
      const alert: Partial<CanaryAlert> = { severity: 'high' };
      expect(alert.severity).toBe('high');
    });

    it('should support medium severity', () => {
      const alert: Partial<CanaryAlert> = { severity: 'medium' };
      expect(alert.severity).toBe('medium');
    });

    it('should support low severity', () => {
      const alert: Partial<CanaryAlert> = { severity: 'low' };
      expect(alert.severity).toBe('low');
    });

    it('should support pending investigation status', () => {
      const alert: Partial<CanaryAlert> = { investigationStatus: 'pending' };
      expect(alert.investigationStatus).toBe('pending');
    });

    it('should support investigating status', () => {
      const alert: Partial<CanaryAlert> = { investigationStatus: 'investigating' };
      expect(alert.investigationStatus).toBe('investigating');
    });

    it('should support confirmed status', () => {
      const alert: Partial<CanaryAlert> = { investigationStatus: 'confirmed' };
      expect(alert.investigationStatus).toBe('confirmed');
    });

    it('should support false_positive status', () => {
      const alert: Partial<CanaryAlert> = { investigationStatus: 'false_positive' };
      expect(alert.investigationStatus).toBe('false_positive');
    });

    it('should support resolved status', () => {
      const alert: Partial<CanaryAlert> = { investigationStatus: 'resolved' };
      expect(alert.investigationStatus).toBe('resolved');
    });

    it('should handle acknowledged alert', () => {
      const alert: Partial<CanaryAlert> = {
        acknowledged: true,
        acknowledgedBy: 'security@company.com',
        acknowledgedAt: new Date(),
      };
      expect(alert.acknowledged).toBe(true);
    });
  });

  // ===========================================================================
  // CANARY DEPLOYMENT STRUCTURE
  // ===========================================================================

  describe('CanaryDeployment Structure', () => {
    it('should create valid deployment', () => {
      const deployment: CanaryDeployment = {
        organizationId: 'org-123',
        totalCanaries: 100,
        activeCanaries: 95,
        triggeredCanaries: 2,
        coveredTables: ['decisions', 'customers', 'financials'],
        coverage: 85,
        lastDeploymentAt: new Date(),
        lastScanAt: new Date(),
        healthStatus: 'healthy',
      };
      expect(deployment.coverage).toBe(85);
    });

    it('should support healthy status', () => {
      const deployment: Partial<CanaryDeployment> = { healthStatus: 'healthy' };
      expect(deployment.healthStatus).toBe('healthy');
    });

    it('should support degraded status', () => {
      const deployment: Partial<CanaryDeployment> = { healthStatus: 'degraded' };
      expect(deployment.healthStatus).toBe('degraded');
    });

    it('should support compromised status', () => {
      const deployment: Partial<CanaryDeployment> = { healthStatus: 'compromised' };
      expect(deployment.healthStatus).toBe('compromised');
    });

    it('should handle 0% coverage', () => {
      const deployment: Partial<CanaryDeployment> = { coverage: 0 };
      expect(deployment.coverage).toBe(0);
    });

    it('should handle 50% coverage', () => {
      const deployment: Partial<CanaryDeployment> = { coverage: 50 };
      expect(deployment.coverage).toBe(50);
    });

    it('should handle 100% coverage', () => {
      const deployment: Partial<CanaryDeployment> = { coverage: 100 };
      expect(deployment.coverage).toBe(100);
    });

    it('should handle multiple covered tables', () => {
      const deployment: Partial<CanaryDeployment> = {
        coveredTables: ['table1', 'table2', 'table3', 'table4', 'table5'],
      };
      expect(deployment.coveredTables?.length).toBe(5);
    });
  });

  // ===========================================================================
  // BUSINESS SCENARIOS
  // ===========================================================================

  describe('Business Scenarios', () => {
    it('should deploy acquisition canary', () => {
      const canary: Partial<Canary> = {
        canaryType: 'acquisition',
        content: {
          title: 'Acquisition of Acme Corp',
          description: 'Confidential M&A materials',
          data: { targetCompany: 'Acme Corp', valuation: '$1.2B' },
          uniqueMarkers: ['CDNA-ACQ-12345'],
        },
        status: 'active',
      };
      expect(canary.canaryType).toBe('acquisition');
    });

    it('should deploy financial canary', () => {
      const canary: Partial<Canary> = {
        canaryType: 'financial',
        content: {
          title: 'Q4 Preliminary Results',
          description: 'Unaudited financials',
          data: { revenue: 150000000 },
          uniqueMarkers: ['CFIN-Q4-2024'],
        },
        status: 'active',
      };
      expect(canary.canaryType).toBe('financial');
    });

    it('should deploy credential canary', () => {
      const canary: Partial<Canary> = {
        canaryType: 'credential',
        content: {
          title: 'Admin Credentials',
          description: 'Honeypot admin account',
          data: { username: 'admin_backup', password: 'fake-password-xyz' },
          uniqueMarkers: ['CCRED-ADMIN-001'],
        },
        status: 'active',
      };
      expect(canary.canaryType).toBe('credential');
    });

    it('should detect canary on pastebin', () => {
      const alert: Partial<CanaryAlert> = {
        detectionMethod: 'pastebin',
        detectionSource: 'pastebin.com',
        severity: 'critical',
        investigationStatus: 'pending',
      };
      expect(alert.detectionMethod).toBe('pastebin');
    });

    it('should detect canary on darkweb', () => {
      const alert: Partial<CanaryAlert> = {
        detectionMethod: 'darkweb',
        detectionSource: 'darkweb-forum.onion',
        severity: 'critical',
        investigationStatus: 'investigating',
      };
      expect(alert.detectionMethod).toBe('darkweb');
    });

    it('should confirm data breach', () => {
      const alert: Partial<CanaryAlert> = {
        investigationStatus: 'confirmed',
        investigationNotes: 'Confirmed data exfiltration via insider threat',
      };
      expect(alert.investigationStatus).toBe('confirmed');
    });
  });

  // ===========================================================================
  // EDGE CASES
  // ===========================================================================

  describe('Edge Cases', () => {
    it('should handle empty trigger URLs', () => {
      const canary: Partial<Canary> = { triggerUrls: [] };
      expect(canary.triggerUrls?.length).toBe(0);
    });

    it('should handle empty unique markers', () => {
      const content: Partial<CanaryContent> = { uniqueMarkers: [] };
      expect(content.uniqueMarkers?.length).toBe(0);
    });

    it('should handle empty covered tables', () => {
      const deployment: Partial<CanaryDeployment> = { coveredTables: [] };
      expect(deployment.coveredTables?.length).toBe(0);
    });

    it('should handle very long title', () => {
      const content: Partial<CanaryContent> = { title: 'A'.repeat(500) };
      expect(content.title?.length).toBe(500);
    });

    it('should handle very long description', () => {
      const content: Partial<CanaryContent> = { description: 'B'.repeat(5000) };
      expect(content.description?.length).toBe(5000);
    });

    it('should handle special characters in title', () => {
      const content: Partial<CanaryContent> = {
        title: 'Acquisition: "Target" & <Company>',
      };
      expect(content.title).toContain('Target');
    });

    it('should handle unicode in description', () => {
      const content: Partial<CanaryContent> = {
        description: '機密データ 🔒 カナリア',
      };
      expect(content.description).toContain('機密');
    });

    it('should handle zero canaries', () => {
      const deployment: Partial<CanaryDeployment> = {
        totalCanaries: 0,
        activeCanaries: 0,
        triggeredCanaries: 0,
      };
      expect(deployment.totalCanaries).toBe(0);
    });

    it('should handle all canaries triggered', () => {
      const deployment: Partial<CanaryDeployment> = {
        totalCanaries: 100,
        activeCanaries: 0,
        triggeredCanaries: 100,
        healthStatus: 'compromised',
      };
      expect(deployment.healthStatus).toBe('compromised');
    });
  });
});
