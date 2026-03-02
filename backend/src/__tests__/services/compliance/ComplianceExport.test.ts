/**
 * Module — Compliance Export Test
 *
 * Platform module.
 * @module __tests__/services/compliance/ComplianceExport.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Export Service Tests
 * Tests for generating compliance reports (SOC2, HIPAA, GDPR, etc.)
 */

import { describe, it, expect, beforeEach } from 'vitest';
import crypto from 'crypto';

// Types
type Framework = 'soc2' | 'hipaa' | 'gdpr' | 'iso27001' | 'nist' | 'pci_dss';
type ControlStatus = 'pass' | 'fail' | 'warning' | 'not_applicable';

interface ControlEvaluation {
  id: string;
  name: string;
  status: ControlStatus;
  evidence: string[];
  findings: string | undefined;
}

interface ExportFile {
  name: string;
  type: 'json' | 'csv' | 'pdf';
  size: number;
  hash: string;
  content: string;
}

interface ExportResult {
  id: string;
  framework: Framework;
  organizationId: string;
  generatedAt: Date;
  generatedBy: string;
  period: { start: Date; end: Date };
  summary: {
    totalControls: number;
    passed: number;
    failed: number;
    warnings: number;
    notApplicable: number;
  };
  controls: ControlEvaluation[];
  files: ExportFile[];
  signature: string;
}

// SOC2 Control evaluators
const SOC2_CONTROLS = [
  { id: 'CC1.1', name: 'Integrity and Ethical Values', category: 'Control Environment' },
  { id: 'CC2.1', name: 'Information Quality', category: 'Communication' },
  { id: 'CC3.1', name: 'Risk Identification', category: 'Risk Assessment' },
  { id: 'CC5.1', name: 'Control Activities Selection', category: 'Control Activities' },
  { id: 'CC6.1', name: 'Logical Access Security', category: 'Access Controls' },
  { id: 'CC6.2', name: 'User Registration', category: 'Access Controls' },
  { id: 'CC6.3', name: 'Access Removal', category: 'Access Controls' },
  { id: 'CC7.1', name: 'Security Event Detection', category: 'System Operations' },
  { id: 'CC8.1', name: 'Change Management', category: 'Change Management' },
];

const HIPAA_CONTROLS = [
  { id: '164.312(a)(1)', name: 'Access Control', category: 'Technical Safeguards' },
  { id: '164.312(b)', name: 'Audit Controls', category: 'Technical Safeguards' },
  { id: '164.312(c)(1)', name: 'Integrity Controls', category: 'Technical Safeguards' },
  { id: '164.312(d)', name: 'Person Authentication', category: 'Technical Safeguards' },
  { id: '164.312(e)(1)', name: 'Transmission Security', category: 'Technical Safeguards' },
];

const GDPR_CONTROLS = [
  { id: 'Art.5', name: 'Principles of Processing', category: 'Data Protection' },
  { id: 'Art.17', name: 'Right to Erasure', category: 'Data Subject Rights' },
  { id: 'Art.30', name: 'Records of Processing', category: 'Accountability' },
  { id: 'Art.32', name: 'Security of Processing', category: 'Security' },
  { id: 'Art.33', name: 'Breach Notification', category: 'Breach Response' },
];

class MockComplianceExportService {
  private signingKey = 'test-signing-key';

  private getControlsForFramework(framework: Framework) {
    switch (framework) {
      case 'soc2': return SOC2_CONTROLS;
      case 'hipaa': return HIPAA_CONTROLS;
      case 'gdpr': return GDPR_CONTROLS;
      default: return SOC2_CONTROLS;
    }
  }

  async generateExport(params: {
    framework: Framework;
    organizationId: string;
    startDate: Date;
    endDate: Date;
    requestedBy: string;
    includeRawLogs?: boolean;
    includeIntegrityProof?: boolean;
  }): Promise<ExportResult> {
    const controls = this.getControlsForFramework(params.framework);
    
    // Evaluate controls (simulated)
    const evaluatedControls: ControlEvaluation[] = controls.map(ctrl => {
      const status: ControlStatus = Math.random() > 0.2 ? 'pass' : 'warning';
      return {
        id: ctrl.id,
        name: ctrl.name,
        status,
        evidence: [`${ctrl.name} evaluated with automated checks`],
        findings: status === 'warning' ? `Review ${ctrl.id} implementation` : undefined,
      };
    });

    const summary = {
      totalControls: evaluatedControls.length,
      passed: evaluatedControls.filter(c => c.status === 'pass').length,
      failed: evaluatedControls.filter(c => c.status === 'fail').length,
      warnings: evaluatedControls.filter(c => c.status === 'warning').length,
      notApplicable: evaluatedControls.filter(c => c.status === 'not_applicable').length,
    };

    // Generate files
    const files: ExportFile[] = [];

    // Executive Summary
    const execSummary = JSON.stringify({
      title: `${params.framework.toUpperCase()} Compliance Report`,
      organization: params.organizationId,
      period: { start: params.startDate, end: params.endDate },
      summary,
    }, null, 2);

    files.push(this.createFile('executive-summary.json', 'json', execSummary));

    // Controls Report
    const controlsReport = JSON.stringify({ controls: evaluatedControls }, null, 2);
    files.push(this.createFile('controls-report.json', 'json', controlsReport));

    if (params.includeRawLogs) {
      const logsCSV = 'Timestamp,EventType,User,Action,Outcome\n2024-01-01T00:00:00Z,auth.login,user1,Login,success';
      files.push(this.createFile('audit-logs.csv', 'csv', logsCSV));
    }

    const exportId = `export_${crypto.randomUUID()}`;

    const result: ExportResult = {
      id: exportId,
      framework: params.framework,
      organizationId: params.organizationId,
      generatedAt: new Date(),
      generatedBy: params.requestedBy,
      period: { start: params.startDate, end: params.endDate },
      summary,
      controls: evaluatedControls,
      files,
      signature: '',
    };

    result.signature = this.signExport(result);

    return result;
  }

  private createFile(name: string, type: 'json' | 'csv' | 'pdf', content: string): ExportFile {
    const buffer = Buffer.from(content, 'utf-8');
    return {
      name,
      type,
      size: buffer.length,
      hash: crypto.createHash('sha256').update(buffer).digest('hex'),
      content: buffer.toString('base64'),
    };
  }

  private signExport(result: Omit<ExportResult, 'signature'>): string {
    const dataToSign = JSON.stringify({
      id: result.id,
      framework: result.framework,
      organizationId: result.organizationId,
      generatedAt: result.generatedAt.toISOString(),
      summary: result.summary,
      fileHashes: result.files.map(f => f.hash),
    });

    return crypto.createHmac('sha256', this.signingKey).update(dataToSign).digest('hex');
  }

  verifyExport(result: ExportResult): { valid: boolean; details: string } {
    // Verify file hashes
    for (const file of result.files) {
      const content = Buffer.from(file.content, 'base64');
      const calculatedHash = crypto.createHash('sha256').update(content).digest('hex');
      if (file.hash !== calculatedHash) {
        return { valid: false, details: `File ${file.name} hash mismatch` };
      }
    }

    return { valid: true, details: 'Export verified successfully' };
  }

  getAvailableFrameworks(): { id: Framework; name: string; controlCount: number }[] {
    return [
      { id: 'soc2', name: 'SOC 2 Type II', controlCount: SOC2_CONTROLS.length },
      { id: 'hipaa', name: 'HIPAA', controlCount: HIPAA_CONTROLS.length },
      { id: 'gdpr', name: 'GDPR', controlCount: GDPR_CONTROLS.length },
      { id: 'iso27001', name: 'ISO 27001', controlCount: 93 },
      { id: 'nist', name: 'NIST CSF', controlCount: 108 },
      { id: 'pci_dss', name: 'PCI DSS', controlCount: 64 },
    ];
  }
}

describe('Compliance Export Service', () => {
  let service: MockComplianceExportService;

  beforeEach(() => {
    service = new MockComplianceExportService();
  });

  describe('SOC 2 Export', () => {
    it('should generate SOC 2 compliance export', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      expect(result.id).toContain('export_');
      expect(result.framework).toBe('soc2');
      expect(result.organizationId).toBe('org-1');
    });

    it('should evaluate SOC 2 trust service criteria', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      expect(result.controls.length).toBe(SOC2_CONTROLS.length);
      expect(result.controls.some(c => c.id === 'CC6.1')).toBe(true); // Access Controls
      expect(result.controls.some(c => c.id === 'CC7.1')).toBe(true); // Security Events
    });

    it('should include CC1-CC8 control categories', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      const controlIds = result.controls.map(c => c.id);
      expect(controlIds.some(id => id.startsWith('CC1'))).toBe(true);
      expect(controlIds.some(id => id.startsWith('CC6'))).toBe(true);
      expect(controlIds.some(id => id.startsWith('CC7'))).toBe(true);
    });
  });

  describe('HIPAA Export', () => {
    it('should generate HIPAA compliance export', async () => {
      const result = await service.generateExport({
        framework: 'hipaa',
        organizationId: 'healthcare-org',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'hipaa-officer@example.com',
      });

      expect(result.framework).toBe('hipaa');
      expect(result.controls.length).toBe(HIPAA_CONTROLS.length);
    });

    it('should evaluate HIPAA technical safeguards', async () => {
      const result = await service.generateExport({
        framework: 'hipaa',
        organizationId: 'healthcare-org',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'hipaa-officer@example.com',
      });

      expect(result.controls.some(c => c.id === '164.312(a)(1)')).toBe(true); // Access Control
      expect(result.controls.some(c => c.id === '164.312(b)')).toBe(true); // Audit Controls
      expect(result.controls.some(c => c.id === '164.312(d)')).toBe(true); // Authentication
    });

    it('should track ePHI access controls', async () => {
      const result = await service.generateExport({
        framework: 'hipaa',
        organizationId: 'healthcare-org',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'hipaa-officer@example.com',
      });

      const accessControl = result.controls.find(c => c.id === '164.312(a)(1)');
      expect(accessControl).toBeDefined();
      expect(accessControl?.name).toBe('Access Control');
    });
  });

  describe('GDPR Export', () => {
    it('should generate GDPR compliance export', async () => {
      const result = await service.generateExport({
        framework: 'gdpr',
        organizationId: 'eu-org',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'dpo@example.com',
      });

      expect(result.framework).toBe('gdpr');
      expect(result.controls.length).toBe(GDPR_CONTROLS.length);
    });

    it('should evaluate GDPR articles', async () => {
      const result = await service.generateExport({
        framework: 'gdpr',
        organizationId: 'eu-org',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'dpo@example.com',
      });

      expect(result.controls.some(c => c.id === 'Art.5')).toBe(true); // Processing Principles
      expect(result.controls.some(c => c.id === 'Art.17')).toBe(true); // Right to Erasure
      expect(result.controls.some(c => c.id === 'Art.33')).toBe(true); // Breach Notification
    });

    it('should include data subject rights evaluation', async () => {
      const result = await service.generateExport({
        framework: 'gdpr',
        organizationId: 'eu-org',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'dpo@example.com',
      });

      const rightToErasure = result.controls.find(c => c.id === 'Art.17');
      expect(rightToErasure).toBeDefined();
      expect(rightToErasure?.name).toBe('Right to Erasure');
    });
  });

  describe('Export Files', () => {
    it('should generate executive summary file', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      const execSummary = result.files.find(f => f.name === 'executive-summary.json');
      expect(execSummary).toBeDefined();
      expect(execSummary?.type).toBe('json');
    });

    it('should generate controls report file', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      const controlsReport = result.files.find(f => f.name === 'controls-report.json');
      expect(controlsReport).toBeDefined();
    });

    it('should include audit logs when requested', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
        includeRawLogs: true,
      });

      const auditLogs = result.files.find(f => f.name === 'audit-logs.csv');
      expect(auditLogs).toBeDefined();
      expect(auditLogs?.type).toBe('csv');
    });

    it('should calculate file hashes', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      for (const file of result.files) {
        expect(file.hash).toHaveLength(64); // SHA-256 hex
        expect(file.size).toBeGreaterThan(0);
      }
    });
  });

  describe('Export Summary', () => {
    it('should calculate control summary', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      const total = result.summary.passed + result.summary.failed + 
                    result.summary.warnings + result.summary.notApplicable;
      
      expect(total).toBe(result.summary.totalControls);
    });

    it('should track period in export', async () => {
      const startDate = new Date('2024-01-01');
      const endDate = new Date('2024-12-31');

      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate,
        endDate,
        requestedBy: 'auditor@example.com',
      });

      expect(result.period.start).toEqual(startDate);
      expect(result.period.end).toEqual(endDate);
    });
  });

  describe('Export Verification', () => {
    it('should sign exports', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      expect(result.signature).toBeDefined();
      expect(result.signature.length).toBe(64); // HMAC-SHA256 hex
    });

    it('should verify valid export', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      const verification = service.verifyExport(result);
      expect(verification.valid).toBe(true);
    });

    it('should detect tampered file content', async () => {
      const result = await service.generateExport({
        framework: 'soc2',
        organizationId: 'org-1',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-12-31'),
        requestedBy: 'auditor@example.com',
      });

      // Tamper with file content
      if (result.files[0]) {
        result.files[0].content = Buffer.from('tampered content').toString('base64');
      }

      const verification = service.verifyExport(result);
      expect(verification.valid).toBe(false);
      expect(verification.details).toContain('hash mismatch');
    });
  });

  describe('Available Frameworks', () => {
    it('should list all available frameworks', () => {
      const frameworks = service.getAvailableFrameworks();

      expect(frameworks.length).toBeGreaterThanOrEqual(6);
      expect(frameworks.some(f => f.id === 'soc2')).toBe(true);
      expect(frameworks.some(f => f.id === 'hipaa')).toBe(true);
      expect(frameworks.some(f => f.id === 'gdpr')).toBe(true);
      expect(frameworks.some(f => f.id === 'iso27001')).toBe(true);
      expect(frameworks.some(f => f.id === 'nist')).toBe(true);
      expect(frameworks.some(f => f.id === 'pci_dss')).toBe(true);
    });

    it('should include control counts', () => {
      const frameworks = service.getAvailableFrameworks();

      for (const f of frameworks) {
        expect(f.controlCount).toBeGreaterThan(0);
      }
    });
  });
});
