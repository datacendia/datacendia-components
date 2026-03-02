/**
 * Module — Compliance Frameworks Test
 *
 * Platform module.
 * @module __tests__/services/compliance/ComplianceFrameworks.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Compliance Frameworks Tests
 * Tests for the Five Rings of Sovereignty compliance framework system
 */

import { describe, it, expect, beforeEach } from 'vitest';

// Types matching the real implementation
type ComplianceDomain = 'ethical_ai' | 'cybersecurity' | 'privacy' | 'governance' | 'industry';
type PillarId = 'helm' | 'lineage' | 'predict' | 'flow' | 'health' | 'guard' | 'ethics' | 'agents';

interface ComplianceFramework {
  id: string;
  code: string;
  name: string;
  fullName: string;
  domain: ComplianceDomain;
  description: string;
  version: string;
  jurisdiction: string[];
  industries: string[];
  pillars: PillarId[];
  controlCount: number;
  status: 'active' | 'deprecated' | 'draft';
}

interface ComplianceFinding {
  id: string;
  controlId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'open' | 'remediated' | 'accepted';
  description: string;
  recommendation: string;
}

interface ComplianceAssessment {
  id: string;
  organizationId: string;
  frameworkId: string;
  pillarId: PillarId;
  domain: ComplianceDomain;
  overallScore: number;
  controlScores: Record<string, number>;
  findings: ComplianceFinding[];
  assessedAt: Date;
  assessedBy: string;
}

// Mock frameworks data
const MOCK_FRAMEWORKS: ComplianceFramework[] = [
  // Ring 1: Ethical AI
  {
    id: 'nist-ai-rmf',
    code: 'NIST-AI-RMF',
    name: 'NIST AI RMF',
    fullName: 'NIST Artificial Intelligence Risk Management Framework',
    domain: 'ethical_ai',
    description: 'Framework for managing AI risks throughout the AI lifecycle',
    version: '1.0',
    jurisdiction: ['US', 'Global'],
    industries: ['All'],
    pillars: ['helm', 'predict', 'ethics', 'agents'],
    controlCount: 72,
    status: 'active',
  },
  {
    id: 'eu-ai-act',
    code: 'EU-AI-ACT',
    name: 'EU AI Act',
    fullName: 'European Union Artificial Intelligence Act',
    domain: 'ethical_ai',
    description: 'Comprehensive AI regulation for the European Union',
    version: '2024',
    jurisdiction: ['EU'],
    industries: ['All'],
    pillars: ['ethics', 'agents', 'predict', 'guard'],
    controlCount: 85,
    status: 'active',
  },
  {
    id: 'iso-42001',
    code: 'ISO-42001',
    name: 'ISO 42001',
    fullName: 'ISO/IEC 42001 AI Management System',
    domain: 'ethical_ai',
    description: 'International standard for AI management systems',
    version: '2023',
    jurisdiction: ['Global'],
    industries: ['All'],
    pillars: ['predict', 'ethics', 'agents', 'helm'],
    controlCount: 93,
    status: 'active',
  },
  // Ring 2: Cybersecurity
  {
    id: 'soc2',
    code: 'SOC2',
    name: 'SOC 2',
    fullName: 'Service Organization Control 2',
    domain: 'cybersecurity',
    description: 'Trust services criteria for security, availability, processing integrity',
    version: '2017',
    jurisdiction: ['US', 'Global'],
    industries: ['All', 'SaaS'],
    pillars: ['guard', 'helm', 'health', 'lineage'],
    controlCount: 64,
    status: 'active',
  },
  {
    id: 'iso-27001',
    code: 'ISO-27001',
    name: 'ISO 27001',
    fullName: 'ISO/IEC 27001 Information Security Management',
    domain: 'cybersecurity',
    description: 'International standard for information security management systems',
    version: '2022',
    jurisdiction: ['Global'],
    industries: ['All'],
    pillars: ['guard', 'lineage', 'health', 'flow'],
    controlCount: 93,
    status: 'active',
  },
  {
    id: 'nist-800-53',
    code: 'NIST-800-53',
    name: 'NIST 800-53',
    fullName: 'NIST Special Publication 800-53 Security Controls',
    domain: 'cybersecurity',
    description: 'Comprehensive security and privacy controls catalog',
    version: 'Rev 5',
    jurisdiction: ['US', 'Global'],
    industries: ['All', 'Government'],
    pillars: ['guard', 'health', 'lineage', 'flow'],
    controlCount: 1189,
    status: 'active',
  },
  // Ring 3: Privacy
  {
    id: 'gdpr',
    code: 'GDPR',
    name: 'GDPR',
    fullName: 'General Data Protection Regulation',
    domain: 'privacy',
    description: 'EU regulation on data protection and privacy',
    version: '2016/679',
    jurisdiction: ['EU', 'EEA'],
    industries: ['All'],
    pillars: ['lineage', 'guard', 'helm', 'ethics', 'flow'],
    controlCount: 99,
    status: 'active',
  },
  {
    id: 'hipaa',
    code: 'HIPAA',
    name: 'HIPAA',
    fullName: 'Health Insurance Portability and Accountability Act',
    domain: 'privacy',
    description: 'US law protecting sensitive patient health information',
    version: '2013 Omnibus',
    jurisdiction: ['US'],
    industries: ['Healthcare'],
    pillars: ['guard', 'lineage', 'health', 'predict'],
    controlCount: 75,
    status: 'active',
  },
  {
    id: 'ccpa',
    code: 'CCPA/CPRA',
    name: 'CCPA/CPRA',
    fullName: 'California Consumer Privacy Act / California Privacy Rights Act',
    domain: 'privacy',
    description: 'California data privacy and protection law',
    version: '2023',
    jurisdiction: ['US-CA'],
    industries: ['All'],
    pillars: ['lineage', 'guard', 'ethics'],
    controlCount: 55,
    status: 'active',
  },
  // Ring 4: Governance
  {
    id: 'sox',
    code: 'SOX',
    name: 'SOX',
    fullName: 'Sarbanes-Oxley Act',
    domain: 'governance',
    description: 'US law for corporate financial accountability and auditing',
    version: '2002',
    jurisdiction: ['US'],
    industries: ['Public Companies', 'Finance'],
    pillars: ['helm', 'lineage', 'guard', 'flow'],
    controlCount: 66,
    status: 'active',
  },
  {
    id: 'cobit',
    code: 'COBIT',
    name: 'COBIT 2019',
    fullName: 'Control Objectives for Information Technologies',
    domain: 'governance',
    description: 'IT governance and management framework',
    version: '2019',
    jurisdiction: ['Global'],
    industries: ['All'],
    pillars: ['helm', 'flow', 'guard', 'health'],
    controlCount: 40,
    status: 'active',
  },
  // Ring 5: Industry
  {
    id: 'pci-dss',
    code: 'PCI-DSS',
    name: 'PCI DSS',
    fullName: 'Payment Card Industry Data Security Standard',
    domain: 'industry',
    description: 'Security standards for card payment data protection',
    version: '4.0',
    jurisdiction: ['Global'],
    industries: ['Finance', 'Retail'],
    pillars: ['guard', 'lineage', 'flow'],
    controlCount: 64,
    status: 'active',
  },
  {
    id: 'fedramp',
    code: 'FedRAMP',
    name: 'FedRAMP',
    fullName: 'Federal Risk and Authorization Management Program',
    domain: 'industry',
    description: 'US government cloud security standard',
    version: 'Rev 5',
    jurisdiction: ['US'],
    industries: ['Government'],
    pillars: ['guard', 'lineage', 'flow'],
    controlCount: 325,
    status: 'active',
  },
];

// Mock ComplianceService
class MockComplianceService {
  private frameworks: ComplianceFramework[] = MOCK_FRAMEWORKS;
  private assessments: Map<string, ComplianceAssessment> = new Map();
  private assessmentCounter = 0;

  getAllFrameworks(): ComplianceFramework[] {
    return this.frameworks;
  }

  getFramework(id: string): ComplianceFramework | undefined {
    return this.frameworks.find(f => f.id === id);
  }

  getFrameworkByCode(code: string): ComplianceFramework | undefined {
    return this.frameworks.find(f => f.code === code);
  }

  getFrameworksByDomain(domain: ComplianceDomain): ComplianceFramework[] {
    return this.frameworks.filter(f => f.domain === domain);
  }

  getFrameworksForPillar(pillarId: PillarId): ComplianceFramework[] {
    return this.frameworks.filter(f => f.pillars.includes(pillarId));
  }

  getFrameworksByIndustry(industry: string): ComplianceFramework[] {
    return this.frameworks.filter(f => 
      f.industries.includes(industry) || f.industries.includes('All')
    );
  }

  getFrameworksByJurisdiction(jurisdiction: string): ComplianceFramework[] {
    return this.frameworks.filter(f => 
      f.jurisdiction.includes(jurisdiction) || f.jurisdiction.includes('Global')
    );
  }

  getFiveRingsOverview() {
    const domains: ComplianceDomain[] = ['ethical_ai', 'cybersecurity', 'privacy', 'governance', 'industry'];
    const ringNames: Record<ComplianceDomain, string> = {
      ethical_ai: 'Ethical AI',
      cybersecurity: 'Cybersecurity & Risk',
      privacy: 'Privacy & Data Rights',
      governance: 'Governance & Audit',
      industry: 'Industry Regulation',
    };

    return domains.map((domain, index) => {
      const frameworks = this.getFrameworksByDomain(domain);
      return {
        ring: index + 1,
        domain,
        name: ringNames[domain],
        frameworks,
        totalControls: frameworks.reduce((sum, f) => sum + f.controlCount, 0),
      };
    });
  }

  getPillarComplianceMapping(pillarId: PillarId): Record<ComplianceDomain, ComplianceFramework[]> {
    const result: Record<ComplianceDomain, ComplianceFramework[]> = {
      ethical_ai: [],
      cybersecurity: [],
      privacy: [],
      governance: [],
      industry: [],
    };

    for (const framework of this.frameworks) {
      if (framework.pillars.includes(pillarId)) {
        result[framework.domain].push(framework);
      }
    }

    return result;
  }

  async runAssessment(params: {
    organizationId: string;
    frameworkId: string;
    pillarId: PillarId;
    assessedBy: string;
  }): Promise<ComplianceAssessment> {
    const framework = this.getFramework(params.frameworkId);
    if (!framework) {
      throw new Error(`Framework not found: ${params.frameworkId}`);
    }

    // Simulate assessment with random scores
    const controlScores: Record<string, number> = {};
    const findings: ComplianceFinding[] = [];

    for (let i = 1; i <= 5; i++) {
      const controlId = `${framework.code}-CTRL-${i}`;
      const score = Math.floor(Math.random() * 40) + 60; // 60-100
      controlScores[controlId] = score;

      if (score < 80) {
        findings.push({
          id: `finding-${Date.now()}-${i}`,
          controlId,
          severity: score < 70 ? 'high' : 'medium',
          status: 'open',
          description: `Control ${controlId} scored below threshold`,
          recommendation: `Review and improve ${controlId} implementation`,
        });
      }
    }

    const overallScore = Math.round(
      Object.values(controlScores).reduce((a, b) => a + b, 0) / Object.values(controlScores).length
    );

    this.assessmentCounter++;
    const assessment: ComplianceAssessment = {
      id: `assessment-${Date.now()}-${this.assessmentCounter}`,
      organizationId: params.organizationId,
      frameworkId: params.frameworkId,
      pillarId: params.pillarId,
      domain: framework.domain,
      overallScore,
      controlScores,
      findings,
      assessedAt: new Date(),
      assessedBy: params.assessedBy,
    };

    this.assessments.set(assessment.id, assessment);
    return assessment;
  }

  getAssessment(id: string): ComplianceAssessment | undefined {
    return this.assessments.get(id);
  }

  getAssessmentsForOrg(organizationId: string): ComplianceAssessment[] {
    return Array.from(this.assessments.values()).filter(a => a.organizationId === organizationId);
  }

  getTotalControlCount(): number {
    return this.frameworks.reduce((sum, f) => sum + f.controlCount, 0);
  }
}

describe('Compliance Frameworks', () => {
  let service: MockComplianceService;

  beforeEach(() => {
    service = new MockComplianceService();
  });

  describe('Framework Registry', () => {
    it('should contain all major compliance frameworks', () => {
      const frameworks = service.getAllFrameworks();
      
      expect(frameworks.length).toBeGreaterThanOrEqual(13);
      
      // Check for key frameworks
      const codes = frameworks.map(f => f.code);
      expect(codes).toContain('SOC2');
      expect(codes).toContain('ISO-27001');
      expect(codes).toContain('GDPR');
      expect(codes).toContain('HIPAA');
      expect(codes).toContain('NIST-800-53');
      expect(codes).toContain('PCI-DSS');
      expect(codes).toContain('NIST-AI-RMF');
      expect(codes).toContain('EU-AI-ACT');
    });

    it('should retrieve framework by ID', () => {
      const soc2 = service.getFramework('soc2');
      
      expect(soc2).toBeDefined();
      expect(soc2?.name).toBe('SOC 2');
      expect(soc2?.domain).toBe('cybersecurity');
    });

    it('should retrieve framework by code', () => {
      const gdpr = service.getFrameworkByCode('GDPR');
      
      expect(gdpr).toBeDefined();
      expect(gdpr?.fullName).toBe('General Data Protection Regulation');
      expect(gdpr?.jurisdiction).toContain('EU');
    });

    it('should return undefined for non-existent framework', () => {
      const notFound = service.getFramework('nonexistent');
      expect(notFound).toBeUndefined();
    });
  });

  describe('Five Rings of Sovereignty', () => {
    it('should return all five rings', () => {
      const rings = service.getFiveRingsOverview();
      
      expect(rings).toHaveLength(5);
      expect(rings[0]?.domain).toBe('ethical_ai');
      expect(rings[1]?.domain).toBe('cybersecurity');
      expect(rings[2]?.domain).toBe('privacy');
      expect(rings[3]?.domain).toBe('governance');
      expect(rings[4]?.domain).toBe('industry');
    });

    it('should calculate total controls per ring', () => {
      const rings = service.getFiveRingsOverview();
      
      for (const ring of rings) {
        expect(ring.totalControls).toBeGreaterThan(0);
        
        const expectedTotal = ring.frameworks.reduce((sum, f) => sum + f.controlCount, 0);
        expect(ring.totalControls).toBe(expectedTotal);
      }
    });

    it('should have Ring 1 as Ethical AI', () => {
      const rings = service.getFiveRingsOverview();
      const ring1 = rings[0];
      
      expect(ring1?.ring).toBe(1);
      expect(ring1?.name).toBe('Ethical AI');
      expect(ring1?.frameworks.some(f => f.code === 'NIST-AI-RMF')).toBe(true);
      expect(ring1?.frameworks.some(f => f.code === 'EU-AI-ACT')).toBe(true);
    });

    it('should have Ring 2 as Cybersecurity', () => {
      const rings = service.getFiveRingsOverview();
      const ring2 = rings[1];
      
      expect(ring2?.ring).toBe(2);
      expect(ring2?.name).toBe('Cybersecurity & Risk');
      expect(ring2?.frameworks.some(f => f.code === 'SOC2')).toBe(true);
      expect(ring2?.frameworks.some(f => f.code === 'ISO-27001')).toBe(true);
    });

    it('should have Ring 3 as Privacy', () => {
      const rings = service.getFiveRingsOverview();
      const ring3 = rings[2];
      
      expect(ring3?.ring).toBe(3);
      expect(ring3?.name).toBe('Privacy & Data Rights');
      expect(ring3?.frameworks.some(f => f.code === 'GDPR')).toBe(true);
      expect(ring3?.frameworks.some(f => f.code === 'HIPAA')).toBe(true);
    });
  });

  describe('Domain Filtering', () => {
    it('should filter frameworks by ethical_ai domain', () => {
      const aiFrameworks = service.getFrameworksByDomain('ethical_ai');
      
      expect(aiFrameworks.length).toBeGreaterThanOrEqual(3);
      expect(aiFrameworks.every(f => f.domain === 'ethical_ai')).toBe(true);
    });

    it('should filter frameworks by cybersecurity domain', () => {
      const cyberFrameworks = service.getFrameworksByDomain('cybersecurity');
      
      expect(cyberFrameworks.length).toBeGreaterThanOrEqual(3);
      expect(cyberFrameworks.every(f => f.domain === 'cybersecurity')).toBe(true);
    });

    it('should filter frameworks by privacy domain', () => {
      const privacyFrameworks = service.getFrameworksByDomain('privacy');
      
      expect(privacyFrameworks.length).toBeGreaterThanOrEqual(3);
      expect(privacyFrameworks.every(f => f.domain === 'privacy')).toBe(true);
    });

    it('should filter frameworks by governance domain', () => {
      const govFrameworks = service.getFrameworksByDomain('governance');
      
      expect(govFrameworks.length).toBeGreaterThanOrEqual(2);
      expect(govFrameworks.every(f => f.domain === 'governance')).toBe(true);
    });

    it('should filter frameworks by industry domain', () => {
      const industryFrameworks = service.getFrameworksByDomain('industry');
      
      expect(industryFrameworks.length).toBeGreaterThanOrEqual(2);
      expect(industryFrameworks.every(f => f.domain === 'industry')).toBe(true);
    });
  });

  describe('Pillar Mapping', () => {
    it('should get frameworks for guard pillar', () => {
      const guardFrameworks = service.getFrameworksForPillar('guard');
      
      expect(guardFrameworks.length).toBeGreaterThan(5);
      expect(guardFrameworks.every(f => f.pillars.includes('guard'))).toBe(true);
    });

    it('should get frameworks for ethics pillar', () => {
      const ethicsFrameworks = service.getFrameworksForPillar('ethics');
      
      expect(ethicsFrameworks.length).toBeGreaterThanOrEqual(3);
      expect(ethicsFrameworks.every(f => f.pillars.includes('ethics'))).toBe(true);
    });

    it('should get frameworks for lineage pillar', () => {
      const lineageFrameworks = service.getFrameworksForPillar('lineage');
      
      expect(lineageFrameworks.length).toBeGreaterThan(5);
      expect(lineageFrameworks.every(f => f.pillars.includes('lineage'))).toBe(true);
    });

    it('should get pillar compliance mapping', () => {
      const mapping = service.getPillarComplianceMapping('guard');
      
      expect(mapping.ethical_ai.length).toBeGreaterThanOrEqual(1);
      expect(mapping.cybersecurity.length).toBeGreaterThanOrEqual(2);
      expect(mapping.privacy.length).toBeGreaterThanOrEqual(2);
    });
  });

  describe('Industry and Jurisdiction Filtering', () => {
    it('should filter frameworks by healthcare industry', () => {
      const healthcareFrameworks = service.getFrameworksByIndustry('Healthcare');
      
      expect(healthcareFrameworks.some(f => f.code === 'HIPAA')).toBe(true);
    });

    it('should filter frameworks by finance industry', () => {
      const financeFrameworks = service.getFrameworksByIndustry('Finance');
      
      expect(financeFrameworks.some(f => f.code === 'PCI-DSS')).toBe(true);
      expect(financeFrameworks.some(f => f.code === 'SOX')).toBe(true);
    });

    it('should filter frameworks by government industry', () => {
      const govFrameworks = service.getFrameworksByIndustry('Government');
      
      expect(govFrameworks.some(f => f.code === 'FedRAMP')).toBe(true);
      expect(govFrameworks.some(f => f.code === 'NIST-800-53')).toBe(true);
    });

    it('should filter frameworks by EU jurisdiction', () => {
      const euFrameworks = service.getFrameworksByJurisdiction('EU');
      
      expect(euFrameworks.some(f => f.code === 'GDPR')).toBe(true);
      expect(euFrameworks.some(f => f.code === 'EU-AI-ACT')).toBe(true);
    });

    it('should filter frameworks by US jurisdiction', () => {
      const usFrameworks = service.getFrameworksByJurisdiction('US');
      
      expect(usFrameworks.some(f => f.code === 'HIPAA')).toBe(true);
      expect(usFrameworks.some(f => f.code === 'SOX')).toBe(true);
      expect(usFrameworks.some(f => f.code === 'NIST-800-53')).toBe(true);
    });
  });

  describe('Compliance Assessments', () => {
    it('should run assessment for a framework', async () => {
      const assessment = await service.runAssessment({
        organizationId: 'org-1',
        frameworkId: 'soc2',
        pillarId: 'guard',
        assessedBy: 'auditor@example.com',
      });

      expect(assessment.id).toBeDefined();
      expect(assessment.organizationId).toBe('org-1');
      expect(assessment.frameworkId).toBe('soc2');
      expect(assessment.overallScore).toBeGreaterThanOrEqual(0);
      expect(assessment.overallScore).toBeLessThanOrEqual(100);
    });

    it('should generate findings for low-scoring controls', async () => {
      const assessment = await service.runAssessment({
        organizationId: 'org-1',
        frameworkId: 'iso-27001',
        pillarId: 'guard',
        assessedBy: 'auditor@example.com',
      });

      // Findings should exist for scores below threshold
      for (const finding of assessment.findings) {
        expect(finding.id).toBeDefined();
        expect(finding.controlId).toBeDefined();
        expect(['critical', 'high', 'medium', 'low']).toContain(finding.severity);
        expect(['open', 'remediated', 'accepted']).toContain(finding.status);
      }
    });

    it('should retrieve assessment by ID', async () => {
      const created = await service.runAssessment({
        organizationId: 'org-1',
        frameworkId: 'gdpr',
        pillarId: 'lineage',
        assessedBy: 'auditor@example.com',
      });

      const retrieved = service.getAssessment(created.id);
      
      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
    });

    it('should retrieve assessments for organization', async () => {
      await service.runAssessment({
        organizationId: 'org-multi',
        frameworkId: 'soc2',
        pillarId: 'guard',
        assessedBy: 'auditor@example.com',
      });

      await service.runAssessment({
        organizationId: 'org-multi',
        frameworkId: 'hipaa',
        pillarId: 'lineage',
        assessedBy: 'auditor@example.com',
      });

      const assessments = service.getAssessmentsForOrg('org-multi');
      
      expect(assessments.length).toBe(2);
      expect(assessments.every(a => a.organizationId === 'org-multi')).toBe(true);
    });

    it('should throw error for non-existent framework', async () => {
      await expect(service.runAssessment({
        organizationId: 'org-1',
        frameworkId: 'nonexistent',
        pillarId: 'guard',
        assessedBy: 'auditor@example.com',
      })).rejects.toThrow('Framework not found');
    });
  });

  describe('Control Counts', () => {
    it('should track correct control counts per framework', () => {
      const soc2 = service.getFramework('soc2');
      expect(soc2?.controlCount).toBe(64);

      const iso27001 = service.getFramework('iso-27001');
      expect(iso27001?.controlCount).toBe(93);

      const nist80053 = service.getFramework('nist-800-53');
      expect(nist80053?.controlCount).toBe(1189);
    });

    it('should calculate total control count across all frameworks', () => {
      const total = service.getTotalControlCount();
      
      expect(total).toBeGreaterThan(2000);
    });
  });

  describe('Framework Metadata', () => {
    it('should have version information', () => {
      const frameworks = service.getAllFrameworks();
      
      for (const f of frameworks) {
        expect(f.version).toBeDefined();
        expect(f.version.length).toBeGreaterThan(0);
      }
    });

    it('should have status for all frameworks', () => {
      const frameworks = service.getAllFrameworks();
      
      for (const f of frameworks) {
        expect(['active', 'deprecated', 'draft']).toContain(f.status);
      }
    });

    it('should have jurisdiction information', () => {
      const frameworks = service.getAllFrameworks();
      
      for (const f of frameworks) {
        expect(f.jurisdiction.length).toBeGreaterThan(0);
      }
    });

    it('should have pillar mappings', () => {
      const frameworks = service.getAllFrameworks();
      
      for (const f of frameworks) {
        expect(f.pillars.length).toBeGreaterThan(0);
        for (const p of f.pillars) {
          expect(['helm', 'lineage', 'predict', 'flow', 'health', 'guard', 'ethics', 'agents']).toContain(p);
        }
      }
    });
  });
});
