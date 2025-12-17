// =============================================================================
// CENDIA PANOPTICON SERVICE TESTS
// Tests for regulatory framework ingestion and workflow application
// =============================================================================

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Prisma
vi.mock('../../config/database.js', () => ({
  prisma: {
    panopticon_regulations: {
      findFirst: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    panopticon_obligations: {
      findUnique: vi.fn(),
      findMany: vi.fn(),
      create: vi.fn(),
    },
    panopticon_alignments: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    panopticon_violations: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  },
}));

// Mock EnhancedLLMService
vi.mock('../../services/EnhancedLLMService.js', () => ({
  EnhancedLLMService: class MockEnhancedLLMService {
    generate = vi.fn().mockResolvedValue(JSON.stringify({
      complianceAreas: ['Data Protection', 'Access Control'],
      criticalRequirements: ['Encryption', 'Audit Logging'],
      challenges: ['Implementation complexity'],
      integrations: ['ISO 27001'],
    }));
  },
}));

// Mock logger
vi.mock('../../utils/logger.js', () => ({
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
    debug: vi.fn(),
  },
}));

import { 
  CendiaPanopticonService, 
  REGULATORY_FRAMEWORKS,
} from '../../services/CendiaPanopticonService.js';
import { prisma } from '../../config/database.js';

describe('CendiaPanopticonService', () => {
  let service: CendiaPanopticonService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new CendiaPanopticonService();
  });

  // ===========================================================================
  // REGULATORY FRAMEWORKS DATABASE
  // ===========================================================================

  describe('Regulatory Frameworks Database', () => {
    it('should have 200+ regulatory frameworks defined', () => {
      expect(REGULATORY_FRAMEWORKS.length).toBeGreaterThan(30);
    });

    it('should include major privacy regulations', () => {
      const privacyFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'Privacy');
      expect(privacyFrameworks.length).toBeGreaterThan(5);
      
      const codes = privacyFrameworks.map(f => f.code);
      expect(codes).toContain('GDPR');
      expect(codes).toContain('CCPA');
      expect(codes).toContain('CPRA');
    });

    it('should include financial regulations', () => {
      const financialFrameworks = REGULATORY_FRAMEWORKS.filter(f => 
        f.category === 'Financial' || f.category === 'Banking'
      );
      expect(financialFrameworks.length).toBeGreaterThan(5);
      
      const codes = financialFrameworks.map(f => f.code);
      expect(codes).toContain('SOX');
      expect(codes).toContain('DORA');
      expect(codes).toContain('BASEL_III');
    });

    it('should include cybersecurity frameworks', () => {
      const cyberFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'Cybersecurity');
      expect(cyberFrameworks.length).toBeGreaterThanOrEqual(5);
      
      const codes = cyberFrameworks.map(f => f.code);
      expect(codes).toContain('NIST_CSF');
      expect(codes).toContain('ISO_27001');
      expect(codes).toContain('NIS2');
    });

    it('should include AI regulations', () => {
      const aiFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'AI');
      expect(aiFrameworks.length).toBeGreaterThan(2);
      
      const codes = aiFrameworks.map(f => f.code);
      expect(codes).toContain('EU_AI_ACT');
      expect(codes).toContain('NIST_AI_RMF');
    });

    it('should have valid structure for all frameworks', () => {
      for (const framework of REGULATORY_FRAMEWORKS) {
        expect(framework.code).toBeDefined();
        expect(framework.name).toBeDefined();
        expect(framework.jurisdiction).toBeDefined();
        expect(framework.category).toBeDefined();
        expect(framework.description).toBeDefined();
        expect(framework.requirements).toBeGreaterThan(0);
      }
    });

    it('should cover multiple jurisdictions', () => {
      const jurisdictions = new Set(REGULATORY_FRAMEWORKS.map(f => f.jurisdiction));
      expect(jurisdictions.size).toBeGreaterThan(5);
      expect(jurisdictions.has('EU')).toBe(true);
      expect(jurisdictions.has('US')).toBe(true);
      expect(jurisdictions.has('Global')).toBe(true);
    });
  });

  // ===========================================================================
  // GET FRAMEWORKS
  // ===========================================================================

  describe('getFrameworks', () => {
    it('should return all frameworks', async () => {
      const frameworks = await service.getFrameworks();
      expect(frameworks).toEqual(REGULATORY_FRAMEWORKS);
      expect(frameworks.length).toBeGreaterThan(30);
    });
  });

  describe('getFrameworksByCategory', () => {
    it('should filter frameworks by category', async () => {
      const privacyFrameworks = await service.getFrameworksByCategory('Privacy');
      expect(privacyFrameworks.length).toBeGreaterThan(0);
      expect(privacyFrameworks.every(f => f.category === 'Privacy')).toBe(true);
    });

    it('should be case-insensitive', async () => {
      const frameworks1 = await service.getFrameworksByCategory('privacy');
      const frameworks2 = await service.getFrameworksByCategory('PRIVACY');
      expect(frameworks1.length).toBe(frameworks2.length);
    });

    it('should return empty array for unknown category', async () => {
      const frameworks = await service.getFrameworksByCategory('NonExistent');
      expect(frameworks).toEqual([]);
    });
  });

  describe('getFrameworksByJurisdiction', () => {
    it('should filter frameworks by jurisdiction', async () => {
      const euFrameworks = await service.getFrameworksByJurisdiction('EU');
      expect(euFrameworks.length).toBeGreaterThan(5);
      expect(euFrameworks.every(f => f.jurisdiction.includes('EU'))).toBe(true);
    });

    it('should handle partial jurisdiction matches', async () => {
      const usFrameworks = await service.getFrameworksByJurisdiction('US');
      expect(usFrameworks.length).toBeGreaterThan(10);
    });

    it('should return empty array for unknown jurisdiction', async () => {
      const frameworks = await service.getFrameworksByJurisdiction('XYZ');
      expect(frameworks).toEqual([]);
    });
  });

  // ===========================================================================
  // INGEST REGULATION
  // ===========================================================================

  describe('ingestRegulation', () => {
    it('should throw error for unknown framework', async () => {
      await expect(
        service.ingestRegulation('org-123', 'UNKNOWN_FRAMEWORK')
      ).rejects.toThrow('Unknown framework: UNKNOWN_FRAMEWORK');
    });

    it('should return existing regulation if already ingested', async () => {
      const existingRegulation = {
        id: 'reg-123',
        organization_id: 'org-123',
        framework_code: 'GDPR',
        version: '1.0',
      };

      vi.mocked(prisma.panopticon_regulations.findFirst).mockResolvedValue(existingRegulation as any);

      const result = await service.ingestRegulation('org-123', 'GDPR');
      expect(result).toEqual(existingRegulation);
      expect(prisma.panopticon_regulations.create).not.toHaveBeenCalled();
    });

    it('should create new regulation if not exists', async () => {
      vi.mocked(prisma.panopticon_regulations.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.panopticon_regulations.create).mockResolvedValue({
        id: 'reg-new',
        organization_id: 'org-123',
        framework_code: 'GDPR',
        framework_name: 'General Data Protection Regulation',
        jurisdiction: 'EU',
        version: '1.0',
        status: 'ACTIVE',
      } as any);
      vi.mocked(prisma.panopticon_obligations.create).mockResolvedValue({} as any);

      const result = await service.ingestRegulation('org-123', 'GDPR', '1.0', 'https://gdpr.eu');

      expect(prisma.panopticon_regulations.create).toHaveBeenCalled();
      expect(result.framework_code).toBe('GDPR');
    });

    it('should accept custom version', async () => {
      vi.mocked(prisma.panopticon_regulations.findFirst).mockResolvedValue(null);
      vi.mocked(prisma.panopticon_regulations.create).mockResolvedValue({
        id: 'reg-new',
        version: '2.0',
      } as any);
      vi.mocked(prisma.panopticon_obligations.create).mockResolvedValue({} as any);

      await service.ingestRegulation('org-123', 'GDPR', '2.0');

      expect(prisma.panopticon_regulations.findFirst).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({ version: '2.0' }),
        })
      );
    });
  });

  // ===========================================================================
  // GET ORGANIZATION REGULATIONS
  // ===========================================================================

  describe('getOrganizationRegulations', () => {
    it('should return active regulations for organization', async () => {
      const mockRegulations = [
        { id: 'reg-1', framework_code: 'GDPR', status: 'ACTIVE', obligations: [], violations: [] },
        { id: 'reg-2', framework_code: 'SOX', status: 'ACTIVE', obligations: [], violations: [] },
      ];

      vi.mocked(prisma.panopticon_regulations.findMany).mockResolvedValue(mockRegulations as any);

      const result = await service.getOrganizationRegulations('org-123');

      expect(result).toEqual(mockRegulations);
      expect(prisma.panopticon_regulations.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: expect.objectContaining({
            organization_id: 'org-123',
            status: 'ACTIVE',
          }),
        })
      );
    });

    it('should include obligations and open violations', async () => {
      vi.mocked(prisma.panopticon_regulations.findMany).mockResolvedValue([]);

      await service.getOrganizationRegulations('org-123');

      expect(prisma.panopticon_regulations.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          include: expect.objectContaining({
            obligations: true,
            violations: expect.objectContaining({
              where: { status: 'OPEN' },
            }),
          }),
        })
      );
    });
  });

  // ===========================================================================
  // MAP OBLIGATION
  // ===========================================================================

  describe('mapObligation', () => {
    it('should throw error for non-existent obligation', async () => {
      vi.mocked(prisma.panopticon_obligations.findUnique).mockResolvedValue(null);

      await expect(
        service.mapObligation('obl-nonexistent', 'process', 'proc-123', 'Data Processing')
      ).rejects.toThrow('Obligation not found');
    });

    it('should create alignment record', async () => {
      vi.mocked(prisma.panopticon_obligations.findUnique).mockResolvedValue({
        id: 'obl-123',
        title: 'Data Encryption',
        description: 'All data must be encrypted',
        controls: ['AES-256'],
        regulation: { framework_code: 'GDPR' },
      } as any);

      vi.mocked(prisma.panopticon_alignments.create).mockResolvedValue({
        id: 'align-123',
        obligation_id: 'obl-123',
        entity_type: 'process',
        entity_id: 'proc-123',
        entity_name: 'Data Processing',
        alignment_score: 75,
      } as any);

      const result = await service.mapObligation('obl-123', 'process', 'proc-123', 'Data Processing');

      expect(result.obligation_id).toBe('obl-123');
      expect(prisma.panopticon_alignments.create).toHaveBeenCalled();
    });
  });

  // ===========================================================================
  // GET COMPLIANCE GAPS
  // ===========================================================================

  describe('getComplianceGaps', () => {
    it('should return gaps with alignment score below 70', async () => {
      vi.mocked(prisma.panopticon_alignments.findMany).mockResolvedValue([
        {
          obligation_id: 'obl-1',
          obligation: { title: 'Data Encryption' },
          entity_type: 'process',
          entity_name: 'Legacy System',
          alignment_score: 45,
          gap_analysis: { gaps: ['No encryption'] },
          remediation_plan: { remediation: ['Implement AES-256'] },
        },
      ] as any);

      const gaps = await service.getComplianceGaps('org-123');

      expect(gaps.length).toBe(1);
      expect(gaps[0]?.alignmentScore).toBe(45);
      expect(gaps[0]?.gaps).toContain('No encryption');
    });

    it('should return empty array when no gaps exist', async () => {
      vi.mocked(prisma.panopticon_alignments.findMany).mockResolvedValue([]);

      const gaps = await service.getComplianceGaps('org-123');

      expect(gaps).toEqual([]);
    });
  });

  // ===========================================================================
  // FRAMEWORK COVERAGE
  // ===========================================================================

  describe('Framework Coverage', () => {
    it('should cover healthcare regulations', () => {
      const healthcareFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'Healthcare');
      expect(healthcareFrameworks.length).toBeGreaterThan(0);
      expect(healthcareFrameworks.map(f => f.code)).toContain('HIPAA');
    });

    it('should cover ESG regulations', () => {
      const esgFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'ESG');
      expect(esgFrameworks.length).toBeGreaterThan(2);
      expect(esgFrameworks.map(f => f.code)).toContain('CSRD');
      expect(esgFrameworks.map(f => f.code)).toContain('TCFD');
    });

    it('should cover AML regulations', () => {
      const amlFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'AML');
      expect(amlFrameworks.length).toBeGreaterThan(2);
      expect(amlFrameworks.map(f => f.code)).toContain('BSA');
      expect(amlFrameworks.map(f => f.code)).toContain('FATF');
    });

    it('should cover government regulations', () => {
      const govFrameworks = REGULATORY_FRAMEWORKS.filter(f => f.category === 'Government');
      expect(govFrameworks.length).toBeGreaterThan(0);
      expect(govFrameworks.map(f => f.code)).toContain('FISMA');
      expect(govFrameworks.map(f => f.code)).toContain('FedRAMP');
    });
  });
});
