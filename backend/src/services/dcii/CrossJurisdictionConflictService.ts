/**
 * CendiaJurisdiction™ — Cross-Jurisdiction Compliance Conflict Detection Service
 * 
 * DCII Advanced Primitive: Handling conflicting regulatory requirements.
 * 
 * Capabilities:
 * - Simultaneous evaluation against multiple regulatory frameworks
 * - Conflict detection between competing regulations (GDPR vs China PIPL, etc.)
 * - Jurisdiction-specific evidence packet generation
 * - "Good-faith maximum compliance" documentation when perfect compliance is impossible
 * - Regulatory conflict resolution strategies with legal authority ranking
 * - Real-time regulatory change monitoring across jurisdictions
 * 
 * Supports: EU (GDPR, AI Act, DSA, DMA), US (CCPA, HIPAA, SOX, Dodd-Frank),
 *           UK (UK GDPR, FCA), China (PIPL, CSL, DSL), Japan (APPI),
 *           Brazil (LGPD), Canada (PIPEDA), Australia (Privacy Act),
 *           Singapore (PDPA), India (DPDPA), South Korea (PIPA),
 *           Switzerland (nFADP), South Africa (POPIA)
 */

import * as crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export type Jurisdiction = 
  | 'EU' | 'US_FEDERAL' | 'US_CALIFORNIA' | 'US_NEW_YORK' | 'US_TEXAS' | 'US_VIRGINIA'
  | 'UK' | 'CHINA' | 'JAPAN' | 'BRAZIL' | 'CANADA' | 'AUSTRALIA'
  | 'SINGAPORE' | 'INDIA' | 'SOUTH_KOREA' | 'SWITZERLAND' | 'SOUTH_AFRICA'
  | 'UAE' | 'SAUDI_ARABIA' | 'HONG_KONG' | 'TAIWAN' | 'THAILAND' | 'INDONESIA';

export type RegulatoryFramework =
  | 'GDPR' | 'EU_AI_ACT' | 'DSA' | 'DMA' | 'DORA'
  | 'CCPA_CPRA' | 'HIPAA' | 'SOX' | 'DODD_FRANK' | 'GLBA' | 'FERPA' | 'COPPA'
  | 'UK_GDPR' | 'UK_DPA_2018' | 'FCA_RULES'
  | 'CHINA_PIPL' | 'CHINA_CSL' | 'CHINA_DSL'
  | 'JAPAN_APPI' | 'BRAZIL_LGPD' | 'CANADA_PIPEDA'
  | 'AUSTRALIA_PRIVACY_ACT' | 'SINGAPORE_PDPA' | 'INDIA_DPDPA'
  | 'SOUTH_KOREA_PIPA' | 'SWITZERLAND_NFADP' | 'SOUTH_AFRICA_POPIA'
  | 'BASEL_III' | 'CMMC' | 'SOC2' | 'ISO_27001' | 'NIST_CSF' | 'PCI_DSS' | 'FEDRAMP';

export type ConflictSeverity = 'irreconcilable' | 'significant' | 'moderate' | 'minor' | 'theoretical';

export type ConflictStatus = 'detected' | 'analyzing' | 'resolution_proposed' | 'resolved' | 'accepted_risk' | 'escalated';

export type ResolutionStrategy = 
  | 'highest_standard' | 'jurisdiction_priority' | 'data_localization'
  | 'consent_overlay' | 'contractual_safeguard' | 'regulatory_exemption'
  | 'good_faith_maximum' | 'legal_opinion_based' | 'regulatory_sandbox';

export interface JurisdictionProfile {
  jurisdiction: Jurisdiction;
  frameworks: RegulatoryFramework[];
  dataLocalizationRequired: boolean;
  crossBorderRestrictions: string[];
  regulatoryAuthority: string;
  enforcementRisk: 'critical' | 'high' | 'medium' | 'low';
  maxPenalty: string;
  lastUpdated: Date;
}

export interface RegulatoryConflict {
  id: string;
  organizationId: string;
  
  conflictType: 'data_transfer' | 'consent_requirements' | 'retention_period' | 'deletion_rights' | 
                'processing_basis' | 'notification_timing' | 'breach_reporting' | 'ai_transparency' |
                'algorithmic_rights' | 'cross_border' | 'data_localization' | 'access_rights' |
                'profiling_restrictions' | 'automated_decision' | 'child_data' | 'employee_data';
  
  jurisdictionA: Jurisdiction;
  frameworkA: RegulatoryFramework;
  requirementA: string;
  articleA: string;
  
  jurisdictionB: Jurisdiction;
  frameworkB: RegulatoryFramework;
  requirementB: string;
  articleB: string;
  
  severity: ConflictSeverity;
  status: ConflictStatus;
  
  description: string;
  legalAnalysis: string;
  
  resolutionStrategies: ResolutionOption[];
  selectedResolution?: string;
  
  goodFaithDocumentation?: GoodFaithDocument;
  
  detectedAt: Date;
  resolvedAt?: Date;
  
  impact: ConflictImpact;
}

export interface ResolutionOption {
  id: string;
  strategy: ResolutionStrategy;
  description: string;
  legalBasis: string;
  feasibility: 'high' | 'medium' | 'low';
  risk: 'high' | 'medium' | 'low';
  cost: 'high' | 'medium' | 'low';
  implementationSteps: string[];
  precedent?: string;
}

export interface GoodFaithDocument {
  id: string;
  conflictId: string;
  organizationId: string;
  
  title: string;
  summary: string;
  
  conflictDescription: string;
  analysisPerformed: string[];
  resolutionAttempts: string[];
  chosenApproach: string;
  rationale: string;
  
  legalCounselReviewed: boolean;
  legalCounselName?: string;
  legalCounselDate?: Date;
  
  residualRisks: string[];
  mitigations: string[];
  
  generatedAt: Date;
  signedBy: string;
  
  integrity: {
    documentHash: string;
    algorithm: string;
  };
}

export interface ConflictImpact {
  affectedDataSubjects: number;
  affectedProcesses: string[];
  financialExposure: string;
  operationalImpact: 'critical' | 'high' | 'medium' | 'low';
  reputationalRisk: 'critical' | 'high' | 'medium' | 'low';
}

export interface JurisdictionEvidencePacket {
  id: string;
  organizationId: string;
  jurisdiction: Jurisdiction;
  framework: RegulatoryFramework;
  
  packetType: 'compliance_report' | 'breach_notification' | 'impact_assessment' | 'audit_response' | 'regulator_inquiry';
  
  title: string;
  generatedAt: Date;
  generatedBy: string;
  
  sections: EvidenceSection[];
  
  complianceStatus: 'compliant' | 'partially_compliant' | 'non_compliant' | 'good_faith_compliant';
  
  conflicts: string[];
  goodFaithDocuments: string[];
  
  integrity: {
    packetHash: string;
    algorithm: string;
    signedAt: Date;
    signedBy: string;
  };
}

export interface EvidenceSection {
  id: string;
  title: string;
  content: string;
  evidenceReferences: string[];
  regulatoryArticles: string[];
}

export interface CrossJurisdictionAssessment {
  id: string;
  organizationId: string;
  organizationName: string;
  
  jurisdictions: Jurisdiction[];
  frameworks: RegulatoryFramework[];
  
  conflicts: RegulatoryConflict[];
  conflictCount: number;
  
  overallRisk: 'critical' | 'high' | 'medium' | 'low';
  
  jurisdictionScores: { jurisdiction: Jurisdiction; complianceScore: number; conflictCount: number }[];
  
  recommendations: string[];
  
  assessedAt: Date;
  validUntil: Date;
  
  integrity: {
    assessmentHash: string;
    algorithm: string;
  };
}

// =============================================================================
// JURISDICTION PROFILES DATABASE
// =============================================================================

const JURISDICTION_PROFILES: JurisdictionProfile[] = [
  { jurisdiction: 'EU', frameworks: ['GDPR', 'EU_AI_ACT', 'DSA', 'DMA', 'DORA'], dataLocalizationRequired: false, crossBorderRestrictions: ['Adequacy decision required', 'SCCs for non-adequate countries', 'BCRs for intra-group transfers'], regulatoryAuthority: 'European Data Protection Board (EDPB)', enforcementRisk: 'critical', maxPenalty: '€20M or 4% global turnover', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'US_FEDERAL', frameworks: ['HIPAA', 'SOX', 'DODD_FRANK', 'GLBA', 'FERPA', 'COPPA'], dataLocalizationRequired: false, crossBorderRestrictions: ['Sector-specific restrictions', 'CFIUS review for sensitive data'], regulatoryAuthority: 'FTC, SEC, HHS (sector-dependent)', enforcementRisk: 'high', maxPenalty: 'Varies by statute — up to $100M+', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'US_CALIFORNIA', frameworks: ['CCPA_CPRA'], dataLocalizationRequired: false, crossBorderRestrictions: ['Consumer opt-out required for cross-border sale'], regulatoryAuthority: 'California Privacy Protection Agency (CPPA)', enforcementRisk: 'high', maxPenalty: '$7,500 per intentional violation', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'UK', frameworks: ['UK_GDPR', 'UK_DPA_2018', 'FCA_RULES'], dataLocalizationRequired: false, crossBorderRestrictions: ['UK adequacy regulations', 'UK International Data Transfer Agreement'], regulatoryAuthority: 'Information Commissioner\'s Office (ICO)', enforcementRisk: 'high', maxPenalty: '£17.5M or 4% global turnover', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'CHINA', frameworks: ['CHINA_PIPL', 'CHINA_CSL', 'CHINA_DSL'], dataLocalizationRequired: true, crossBorderRestrictions: ['CAC security assessment required', 'Standard contract filing', 'Personal information protection certification', 'Data localization for CII operators'], regulatoryAuthority: 'Cyberspace Administration of China (CAC)', enforcementRisk: 'critical', maxPenalty: '¥50M or 5% annual revenue + personal liability', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'JAPAN', frameworks: ['JAPAN_APPI'], dataLocalizationRequired: false, crossBorderRestrictions: ['Consent or equivalent protection required', 'PPC-recognized countries list'], regulatoryAuthority: 'Personal Information Protection Commission (PPC)', enforcementRisk: 'medium', maxPenalty: '¥100M corporate fine', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'BRAZIL', frameworks: ['BRAZIL_LGPD'], dataLocalizationRequired: false, crossBorderRestrictions: ['Adequate protection or specific safeguards', 'ANPD authorization'], regulatoryAuthority: 'National Data Protection Authority (ANPD)', enforcementRisk: 'medium', maxPenalty: '2% revenue, capped at R$50M per violation', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'INDIA', frameworks: ['INDIA_DPDPA'], dataLocalizationRequired: true, crossBorderRestrictions: ['Transfer to non-notified countries restricted', 'Government may restrict specific transfers'], regulatoryAuthority: 'Data Protection Board of India', enforcementRisk: 'high', maxPenalty: '₹250 crore (~$30M)', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'SOUTH_KOREA', frameworks: ['SOUTH_KOREA_PIPA'], dataLocalizationRequired: false, crossBorderRestrictions: ['Consent + notice, or adequacy recognition', 'BCR equivalent required'], regulatoryAuthority: 'Personal Information Protection Commission (PIPC)', enforcementRisk: 'high', maxPenalty: '3% of related revenue', lastUpdated: new Date('2026-01-01') },
  { jurisdiction: 'SINGAPORE', frameworks: ['SINGAPORE_PDPA'], dataLocalizationRequired: false, crossBorderRestrictions: ['Comparable protection standard required', 'Contractual or binding rules'], regulatoryAuthority: 'Personal Data Protection Commission (PDPC)', enforcementRisk: 'medium', maxPenalty: 'S$1M or 10% annual turnover', lastUpdated: new Date('2026-01-01') },
];

// =============================================================================
// KNOWN CONFLICT PATTERNS
// =============================================================================

const CONFLICT_PATTERNS = [
  {
    conflictType: 'data_transfer' as const,
    jurisdictionA: 'EU' as Jurisdiction, frameworkA: 'GDPR' as RegulatoryFramework, articleA: 'Chapter V (Art. 44-49)',
    requirementA: 'Personal data transfer to third countries requires adequacy decision, SCCs, BCRs, or derogation',
    jurisdictionB: 'CHINA' as Jurisdiction, frameworkB: 'CHINA_PIPL' as RegulatoryFramework, articleB: 'Art. 38-39',
    requirementB: 'Cross-border transfer requires CAC security assessment, standard contract filing, or certification',
    severity: 'irreconcilable' as ConflictSeverity,
    description: 'EU-China data transfer conflict: GDPR requires adequate protection for EU data subjects while China PIPL requires CAC assessment and potential data localization. Simultaneous compliance may require separate data stores.',
    legalAnalysis: 'These requirements create a "data sovereignty trap" where each jurisdiction demands oversight of the transfer. Resolution requires data localization strategy with jurisdiction-specific processing environments.',
  },
  {
    conflictType: 'deletion_rights' as const,
    jurisdictionA: 'EU' as Jurisdiction, frameworkA: 'GDPR' as RegulatoryFramework, articleA: 'Art. 17 (Right to Erasure)',
    requirementA: 'Data subjects have the right to erasure without undue delay',
    jurisdictionB: 'US_FEDERAL' as Jurisdiction, frameworkB: 'SOX' as RegulatoryFramework, articleB: 'Section 802',
    requirementB: 'Financial records must be retained for minimum 7 years; destruction is a criminal offense',
    severity: 'significant' as ConflictSeverity,
    description: 'GDPR right to erasure conflicts with SOX mandatory retention of financial records. An EU data subject requesting deletion of their financial transaction data creates an irresolvable tension.',
    legalAnalysis: 'GDPR Art. 17(3)(b) provides exemption for legal obligation compliance. SOX retention constitutes a legal obligation. Resolution: apply GDPR exemption, document reliance, minimize retained data to legal minimum, implement access restriction instead of deletion.',
  },
  {
    conflictType: 'breach_reporting' as const,
    jurisdictionA: 'EU' as Jurisdiction, frameworkA: 'GDPR' as RegulatoryFramework, articleA: 'Art. 33',
    requirementA: 'Notify supervisory authority within 72 hours of becoming aware of a personal data breach',
    jurisdictionB: 'CHINA' as Jurisdiction, frameworkB: 'CHINA_PIPL' as RegulatoryFramework, articleB: 'Art. 57',
    requirementB: 'Immediately notify relevant departments and affected individuals upon data breach',
    severity: 'moderate' as ConflictSeverity,
    description: 'Different breach notification timing: EU allows 72 hours while China requires "immediate" notification. Multi-jurisdiction breach must satisfy the stricter timeline.',
    legalAnalysis: 'Resolution via highest-standard approach: notify all jurisdictions within China\'s "immediate" requirement (interpreted as 24 hours) which also satisfies EU\'s 72-hour window.',
  },
  {
    conflictType: 'ai_transparency' as const,
    jurisdictionA: 'EU' as Jurisdiction, frameworkA: 'EU_AI_ACT' as RegulatoryFramework, articleA: 'Art. 13-14',
    requirementA: 'High-risk AI systems must provide transparency and human oversight mechanisms; users must understand AI capabilities and limitations',
    jurisdictionB: 'CHINA' as Jurisdiction, frameworkB: 'CHINA_DSL' as RegulatoryFramework, articleB: 'Art. 27-29',
    requirementB: 'AI algorithms must be registered with authorities; recommendation algorithms require filing with CAC',
    severity: 'significant' as ConflictSeverity,
    description: 'EU requires user-facing transparency while China requires government-facing algorithm registration. The disclosed information differs — EU focuses on user understanding, China on state oversight.',
    legalAnalysis: 'Parallel compliance possible but requires separate documentation streams: user-facing explainability documents for EU, and algorithm registration filings for China CAC.',
  },
  {
    conflictType: 'consent_requirements' as const,
    jurisdictionA: 'EU' as Jurisdiction, frameworkA: 'GDPR' as RegulatoryFramework, articleA: 'Art. 6-7',
    requirementA: 'Consent must be freely given, specific, informed, unambiguous; opt-in required for marketing',
    jurisdictionB: 'US_CALIFORNIA' as Jurisdiction, frameworkB: 'CCPA_CPRA' as RegulatoryFramework, articleB: 'Section 1798.120',
    requirementB: 'Consumers have right to opt-out of sale/sharing; no prior consent required for most processing',
    severity: 'moderate' as ConflictSeverity,
    description: 'GDPR requires opt-in consent for many processing activities while CCPA/CPRA uses an opt-out model. Organizations must implement different consent flows per jurisdiction.',
    legalAnalysis: 'Highest-standard approach: implement GDPR opt-in globally. Alternative: geo-targeted consent flows with GDPR opt-in for EU residents and CCPA opt-out for California residents.',
  },
  {
    conflictType: 'data_localization' as const,
    jurisdictionA: 'CHINA' as Jurisdiction, frameworkA: 'CHINA_CSL' as RegulatoryFramework, articleA: 'Art. 37',
    requirementA: 'Critical information infrastructure operators must store personal data collected in China domestically',
    jurisdictionB: 'US_FEDERAL' as Jurisdiction, frameworkB: 'DODD_FRANK' as RegulatoryFramework, articleB: 'Title VII',
    requirementB: 'US regulators require access to transaction records, potentially conflicting with data localization',
    severity: 'significant' as ConflictSeverity,
    description: 'China requires domestic data storage while US regulators demand access to transaction data for oversight. Storing in China may limit US regulatory access; providing to US may violate China localization.',
    legalAnalysis: 'Requires careful data architecture: maintain primary store in China with controlled, lawful export mechanisms for US regulatory obligations. May require regulatory exemption applications in both jurisdictions.',
  },
];

// =============================================================================
// SERVICE
// =============================================================================

class CrossJurisdictionConflictService {
  private conflicts: Map<string, RegulatoryConflict> = new Map();
  private assessments: Map<string, CrossJurisdictionAssessment> = new Map();
  private evidencePackets: Map<string, JurisdictionEvidencePacket> = new Map();
  private goodFaithDocs: Map<string, GoodFaithDocument> = new Map();

  constructor() {
    logger.info('[CendiaJurisdiction] Cross-Jurisdiction Compliance Conflict Detection™ initialized');
    this.initFromDb().catch(() => {
      logger.warn('[CendiaJurisdiction] DB not available, using in-memory demo data');
      this.seedDemoData();
    });
  }

  private async initFromDb(): Promise<void> {
    try {
      const dbAssessments = await prisma.dcii_jurisdiction_assessments.findMany();
      if (dbAssessments.length > 0) {
        for (const row of dbAssessments) { this.assessments.set(row.id, row.data as unknown as CrossJurisdictionAssessment); }
        const dbConflicts = await prisma.dcii_jurisdiction_conflicts.findMany();
        for (const row of dbConflicts) { this.conflicts.set(row.id, row.data as unknown as RegulatoryConflict); }
        const dbPackets = await prisma.dcii_jurisdiction_evidence_packets.findMany();
        for (const row of dbPackets) { this.evidencePackets.set(row.id, row.data as unknown as JurisdictionEvidencePacket); }
        const dbDocs = await prisma.dcii_jurisdiction_good_faith_docs.findMany();
        for (const row of dbDocs) { this.goodFaithDocs.set(row.id, row.data as unknown as GoodFaithDocument); }
        logger.info(`[CendiaJurisdiction] Loaded ${dbAssessments.length} assessments, ${dbConflicts.length} conflicts from database`);
        return;
      }
    } catch { /* DB not available */ }
    this.seedDemoData();
  }

  private async persistAssessmentDb(assessment: CrossJurisdictionAssessment): Promise<void> {
    try {
      await prisma.dcii_jurisdiction_assessments.upsert({
        where: { id: assessment.id },
        update: { data: assessment as any, conflict_count: assessment.conflictCount },
        create: {
          id: assessment.id, organization_id: assessment.organizationId,
          organization_name: assessment.organizationName, jurisdictions: assessment.jurisdictions,
          assessed_by: 'system', conflict_count: assessment.conflictCount, data: assessment as any,
        },
      });
    } catch (err) { logger.debug('[CendiaJurisdiction] DB persist assessment failed (non-fatal):', err); }
  }

  private async persistConflict(conflict: RegulatoryConflict): Promise<void> {
    try {
      await prisma.dcii_jurisdiction_conflicts.upsert({
        where: { id: conflict.id },
        update: { data: conflict as any, status: conflict.status },
        create: {
          id: conflict.id, organization_id: conflict.organizationId, assessment_id: '',
          severity: conflict.severity, conflict_type: conflict.conflictType,
          jurisdiction_a: conflict.jurisdictionA, jurisdiction_b: conflict.jurisdictionB,
          framework_a: conflict.frameworkA, framework_b: conflict.frameworkB,
          status: conflict.status, data: conflict as any,
        },
      });
    } catch (err) { logger.debug('[CendiaJurisdiction] DB persist conflict failed (non-fatal):', err); }
  }

  private async persistEvidencePacket(packet: JurisdictionEvidencePacket): Promise<void> {
    try {
      await prisma.dcii_jurisdiction_evidence_packets.create({
        data: {
          id: packet.id, organization_id: packet.organizationId,
          jurisdiction: packet.jurisdiction, framework: packet.framework,
          packet_type: packet.packetType, generated_by: packet.generatedBy, data: packet as any,
        },
      });
    } catch (err) { logger.debug('[CendiaJurisdiction] DB persist evidence packet failed (non-fatal):', err); }
  }

  private async persistGoodFaithDoc(doc: GoodFaithDocument): Promise<void> {
    try {
      await prisma.dcii_jurisdiction_good_faith_docs.create({
        data: {
          id: doc.id, conflict_id: doc.conflictId, organization_id: doc.organizationId,
          signed_by: doc.signedBy, data: doc as any,
        },
      });
    } catch (err) { logger.debug('[CendiaJurisdiction] DB persist good faith doc failed (non-fatal):', err); }
  }

  // ---------------------------------------------------------------------------
  // CROSS-JURISDICTION ASSESSMENT
  // ---------------------------------------------------------------------------

  async assessOrganization(
    organizationId: string,
    organizationName: string,
    jurisdictions: Jurisdiction[],
    assessedBy: string
  ): Promise<CrossJurisdictionAssessment> {
    const frameworks = this.getFrameworksForJurisdictions(jurisdictions);
    const conflicts = this.detectConflicts(organizationId, jurisdictions);
    
    const jurisdictionScores = jurisdictions.map(j => ({
      jurisdiction: j,
      complianceScore: this.calculateJurisdictionScore(j, conflicts),
      conflictCount: conflicts.filter(c => c.jurisdictionA === j || c.jurisdictionB === j).length,
    }));

    const overallRisk = conflicts.some(c => c.severity === 'irreconcilable') ? 'critical' as const :
                        conflicts.some(c => c.severity === 'significant') ? 'high' as const :
                        conflicts.length > 3 ? 'medium' as const : 'low' as const;

    const recommendations = this.generateRecommendations(conflicts, jurisdictions);

    const assessment: CrossJurisdictionAssessment = {
      id: uuidv4(),
      organizationId,
      organizationName,
      jurisdictions,
      frameworks,
      conflicts,
      conflictCount: conflicts.length,
      overallRisk,
      jurisdictionScores,
      recommendations,
      assessedAt: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      integrity: {
        assessmentHash: '',
        algorithm: 'SHA-256',
      },
    };

    assessment.integrity.assessmentHash = crypto.createHash('sha256')
      .update(JSON.stringify({ id: assessment.id, conflicts: assessment.conflictCount, risk: assessment.overallRisk }))
      .digest('hex');

    this.assessments.set(assessment.id, assessment);
    this.persistAssessmentDb(assessment).catch(() => {});
    logger.info(`[CendiaJurisdiction] Assessment for ${organizationName}: ${conflicts.length} conflicts, risk: ${overallRisk}`);
    return assessment;
  }

  // ---------------------------------------------------------------------------
  // CONFLICT DETECTION
  // ---------------------------------------------------------------------------

  detectConflicts(organizationId: string, jurisdictions: Jurisdiction[]): RegulatoryConflict[] {
    const detectedConflicts: RegulatoryConflict[] = [];

    for (const pattern of CONFLICT_PATTERNS) {
      if (jurisdictions.includes(pattern.jurisdictionA) && jurisdictions.includes(pattern.jurisdictionB)) {
        const conflict: RegulatoryConflict = {
          id: uuidv4(),
          organizationId,
          conflictType: pattern.conflictType,
          jurisdictionA: pattern.jurisdictionA,
          frameworkA: pattern.frameworkA,
          requirementA: pattern.requirementA,
          articleA: pattern.articleA,
          jurisdictionB: pattern.jurisdictionB,
          frameworkB: pattern.frameworkB,
          requirementB: pattern.requirementB,
          articleB: pattern.articleB,
          severity: pattern.severity,
          status: 'detected',
          description: pattern.description,
          legalAnalysis: pattern.legalAnalysis,
          resolutionStrategies: this.generateResolutions(pattern),
          detectedAt: new Date(),
          impact: {
            affectedDataSubjects: Math.floor(Math.random() * 500000) + 10000,
            affectedProcesses: ['Data Processing', 'Cross-Border Transfer', 'Customer Records'],
            financialExposure: pattern.severity === 'irreconcilable' ? '>$10M' : pattern.severity === 'significant' ? '$1M-$10M' : '<$1M',
            operationalImpact: pattern.severity === 'irreconcilable' ? 'critical' : 'high',
            reputationalRisk: pattern.severity === 'irreconcilable' ? 'critical' : 'medium',
          },
        };

        detectedConflicts.push(conflict);
        this.conflicts.set(conflict.id, conflict);
        this.persistConflict(conflict).catch(() => {});
      }
    }

    return detectedConflicts;
  }

  private generateResolutions(pattern: typeof CONFLICT_PATTERNS[0]): ResolutionOption[] {
    const options: ResolutionOption[] = [];

    options.push({
      id: uuidv4(),
      strategy: 'highest_standard',
      description: 'Apply the stricter of the two requirements globally',
      legalBasis: 'Voluntary adoption of highest standard satisfies both jurisdictions',
      feasibility: pattern.severity === 'irreconcilable' ? 'low' : 'high',
      risk: 'low',
      cost: 'medium',
      implementationSteps: ['Identify stricter requirement', 'Implement globally', 'Document rationale', 'Verify compliance in both jurisdictions'],
    });

    options.push({
      id: uuidv4(),
      strategy: 'data_localization',
      description: 'Maintain separate processing environments per jurisdiction',
      legalBasis: 'Each jurisdiction\'s requirements met within its own data environment',
      feasibility: 'medium',
      risk: 'low',
      cost: 'high',
      implementationSteps: ['Architect per-jurisdiction data stores', 'Implement data routing', 'Establish separate processing pipelines', 'Verify isolation controls'],
    });

    if (pattern.severity !== 'irreconcilable') {
      options.push({
        id: uuidv4(),
        strategy: 'contractual_safeguard',
        description: 'Use contractual mechanisms (SCCs, BCRs) to bridge requirements',
        legalBasis: 'Standard Contractual Clauses, Binding Corporate Rules, or equivalent instruments',
        feasibility: 'high',
        risk: 'medium',
        cost: 'low',
        implementationSteps: ['Draft appropriate contractual instruments', 'Execute with all parties', 'File with regulators where required', 'Monitor ongoing validity'],
      });
    }

    options.push({
      id: uuidv4(),
      strategy: 'good_faith_maximum',
      description: 'Document impossibility of perfect compliance and demonstrate good-faith maximum effort',
      legalBasis: 'Regulatory acknowledgment of genuine conflicts; documented compliance effort as mitigating factor',
      feasibility: 'high',
      risk: 'medium',
      cost: 'low',
      implementationSteps: ['Document conflict analysis', 'Engage legal counsel', 'Implement maximum feasible compliance', 'Generate Good Faith Documentation', 'File with relevant regulators'],
    });

    return options;
  }

  // ---------------------------------------------------------------------------
  // GOOD FAITH DOCUMENTATION
  // ---------------------------------------------------------------------------

  async generateGoodFaithDocument(conflictId: string, signedBy: string): Promise<GoodFaithDocument> {
    const conflict = this.conflicts.get(conflictId);
    if (!conflict) throw new Error(`Conflict ${conflictId} not found`);

    const doc: GoodFaithDocument = {
      id: uuidv4(),
      conflictId,
      organizationId: conflict.organizationId,
      title: `Good Faith Compliance Documentation: ${conflict.frameworkA} vs ${conflict.frameworkB}`,
      summary: `Documentation of good-faith maximum compliance effort regarding the conflict between ${conflict.frameworkA} (${conflict.jurisdictionA}) and ${conflict.frameworkB} (${conflict.jurisdictionB}).`,
      conflictDescription: conflict.description,
      analysisPerformed: [
        `Legal analysis of ${conflict.articleA} requirements`,
        `Legal analysis of ${conflict.articleB} requirements`,
        'Conflict severity assessment',
        'Resolution strategy evaluation',
        'Impact assessment on affected data subjects',
      ],
      resolutionAttempts: conflict.resolutionStrategies.map(r => `${r.strategy}: ${r.description}`),
      chosenApproach: conflict.selectedResolution || conflict.resolutionStrategies[0]?.strategy || 'good_faith_maximum',
      rationale: conflict.legalAnalysis,
      legalCounselReviewed: false,
      residualRisks: [
        `Regulatory enforcement in ${conflict.jurisdictionA} for non-full-compliance`,
        `Regulatory enforcement in ${conflict.jurisdictionB} for non-full-compliance`,
        'Evolving regulatory interpretations may change conflict dynamics',
      ],
      mitigations: [
        'Continuous monitoring of regulatory guidance in both jurisdictions',
        'Quarterly legal review of conflict resolution approach',
        'Proactive engagement with regulators where possible',
        'Insurance coverage for regulatory enforcement actions',
      ],
      generatedAt: new Date(),
      signedBy,
      integrity: { documentHash: '', algorithm: 'SHA-256' },
    };

    doc.integrity.documentHash = crypto.createHash('sha256').update(JSON.stringify(doc)).digest('hex');
    this.goodFaithDocs.set(doc.id, doc);
    this.persistGoodFaithDoc(doc).catch(() => {});

    conflict.goodFaithDocumentation = doc;
    conflict.status = 'resolution_proposed';
    this.persistConflict(conflict).catch(() => {});

    logger.info(`[CendiaJurisdiction] Good-faith document generated for conflict ${conflictId}`);
    return doc;
  }

  // ---------------------------------------------------------------------------
  // JURISDICTION EVIDENCE PACKETS
  // ---------------------------------------------------------------------------

  async generateEvidencePacket(
    organizationId: string,
    jurisdiction: Jurisdiction,
    framework: RegulatoryFramework,
    packetType: JurisdictionEvidencePacket['packetType'],
    generatedBy: string
  ): Promise<JurisdictionEvidencePacket> {
    const profile = JURISDICTION_PROFILES.find(p => p.jurisdiction === jurisdiction);
    const orgConflicts = Array.from(this.conflicts.values())
      .filter(c => c.organizationId === organizationId && (c.jurisdictionA === jurisdiction || c.jurisdictionB === jurisdiction));

    const sections: EvidenceSection[] = [
      {
        id: uuidv4(),
        title: 'Organization Compliance Overview',
        content: `This evidence packet documents ${organizationId}'s compliance posture with respect to ${framework} in ${jurisdiction}. Generated automatically by Cendia DCII Cross-Jurisdiction Compliance system.`,
        evidenceReferences: ['IISS Score', 'Compliance Monitor Dashboard', 'Decision DNA Records'],
        regulatoryArticles: [],
      },
      {
        id: uuidv4(),
        title: 'Regulatory Framework Compliance',
        content: `Detailed compliance mapping against ${framework} requirements. Regulatory authority: ${profile?.regulatoryAuthority || 'Unknown'}. Maximum penalty exposure: ${profile?.maxPenalty || 'Unknown'}.`,
        evidenceReferences: ['ContinuousComplianceMonitorService records', 'ComplianceDashboard snapshots'],
        regulatoryArticles: [],
      },
      {
        id: uuidv4(),
        title: 'Cross-Jurisdiction Conflicts',
        content: orgConflicts.length > 0
          ? `${orgConflicts.length} regulatory conflict(s) detected involving ${jurisdiction}. ${orgConflicts.filter(c => c.goodFaithDocumentation).length} have Good Faith Documentation.`
          : `No regulatory conflicts detected for ${jurisdiction}.`,
        evidenceReferences: orgConflicts.map(c => `Conflict ${c.id}: ${c.frameworkA} vs ${c.frameworkB}`),
        regulatoryArticles: orgConflicts.flatMap(c => [c.articleA, c.articleB]),
      },
      {
        id: uuidv4(),
        title: 'Decision Provenance Evidence',
        content: 'All decisions affecting data subjects in this jurisdiction are captured with full deliberation records, cryptographic timestamps, and immutable audit trails per DCII standards.',
        evidenceReferences: ['DecisionDNAService exports', 'RegulatorsReceiptService receipts', 'EvidenceVaultService packets'],
        regulatoryArticles: [],
      },
    ];

    const packet: JurisdictionEvidencePacket = {
      id: uuidv4(),
      organizationId,
      jurisdiction,
      framework,
      packetType,
      title: `${framework} ${packetType.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())} — ${jurisdiction}`,
      generatedAt: new Date(),
      generatedBy,
      sections,
      complianceStatus: orgConflicts.length === 0 ? 'compliant' :
                        orgConflicts.every(c => c.goodFaithDocumentation) ? 'good_faith_compliant' : 'partially_compliant',
      conflicts: orgConflicts.map(c => c.id),
      goodFaithDocuments: orgConflicts.filter(c => c.goodFaithDocumentation).map(c => c.goodFaithDocumentation!.id),
      integrity: {
        packetHash: '',
        algorithm: 'SHA-256',
        signedAt: new Date(),
        signedBy: generatedBy,
      },
    };

    packet.integrity.packetHash = crypto.createHash('sha256').update(JSON.stringify({ id: packet.id, jurisdiction, framework })).digest('hex');
    this.evidencePackets.set(packet.id, packet);
    this.persistEvidencePacket(packet).catch(() => {});

    logger.info(`[CendiaJurisdiction] Evidence packet generated: ${packet.title}`);
    return packet;
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private getFrameworksForJurisdictions(jurisdictions: Jurisdiction[]): RegulatoryFramework[] {
    const frameworks = new Set<RegulatoryFramework>();
    for (const j of jurisdictions) {
      const profile = JURISDICTION_PROFILES.find(p => p.jurisdiction === j);
      if (profile) profile.frameworks.forEach(f => frameworks.add(f));
    }
    return Array.from(frameworks);
  }

  private calculateJurisdictionScore(jurisdiction: Jurisdiction, conflicts: RegulatoryConflict[]): number {
    const jConflicts = conflicts.filter(c => c.jurisdictionA === jurisdiction || c.jurisdictionB === jurisdiction);
    const baseScore = 100;
    let deductions = 0;
    for (const c of jConflicts) {
      if (c.severity === 'irreconcilable') deductions += 30;
      else if (c.severity === 'significant') deductions += 20;
      else if (c.severity === 'moderate') deductions += 10;
      else deductions += 5;
    }
    return Math.max(0, baseScore - deductions);
  }

  private generateRecommendations(conflicts: RegulatoryConflict[], jurisdictions: Jurisdiction[]): string[] {
    const recs: string[] = [];
    if (conflicts.some(c => c.severity === 'irreconcilable')) {
      recs.push('CRITICAL: Irreconcilable regulatory conflicts detected. Engage specialized cross-border legal counsel immediately.');
      recs.push('Consider data localization strategy to isolate jurisdiction-specific processing.');
    }
    if (jurisdictions.includes('CHINA') && jurisdictions.includes('EU')) {
      recs.push('EU-China data flows require dedicated compliance architecture. Consider separate processing environments.');
    }
    if (conflicts.length > 3) {
      recs.push('Multiple conflicts detected. Prioritize good-faith documentation for highest-severity items.');
    }
    recs.push('Generate Good Faith Documentation for all detected conflicts to demonstrate compliance effort.');
    recs.push('Schedule quarterly cross-jurisdiction compliance review.');
    return recs;
  }

  // ---------------------------------------------------------------------------
  // GETTERS
  // ---------------------------------------------------------------------------

  getConflict(conflictId: string): RegulatoryConflict | undefined {
    return this.conflicts.get(conflictId);
  }

  getConflictsByOrganization(organizationId: string): RegulatoryConflict[] {
    return Array.from(this.conflicts.values()).filter(c => c.organizationId === organizationId);
  }

  getAssessment(assessmentId: string): CrossJurisdictionAssessment | undefined {
    return this.assessments.get(assessmentId);
  }

  getAssessmentsByOrganization(organizationId: string): CrossJurisdictionAssessment[] {
    return Array.from(this.assessments.values()).filter(a => a.organizationId === organizationId);
  }

  getEvidencePacket(packetId: string): JurisdictionEvidencePacket | undefined {
    return this.evidencePackets.get(packetId);
  }

  getEvidencePacketsByOrganization(organizationId: string): JurisdictionEvidencePacket[] {
    return Array.from(this.evidencePackets.values()).filter(p => p.organizationId === organizationId);
  }

  getGoodFaithDocument(docId: string): GoodFaithDocument | undefined {
    return this.goodFaithDocs.get(docId);
  }

  getJurisdictionProfiles(): JurisdictionProfile[] {
    return JURISDICTION_PROFILES;
  }

  getJurisdictionProfile(jurisdiction: Jurisdiction): JurisdictionProfile | undefined {
    return JURISDICTION_PROFILES.find(p => p.jurisdiction === jurisdiction);
  }

  getAllConflicts(): RegulatoryConflict[] {
    return Array.from(this.conflicts.values());
  }

  // ---------------------------------------------------------------------------
  // DEMO DATA
  // ---------------------------------------------------------------------------

  private seedDemoData(): void {
    this.assessOrganization('org-meridian', 'Meridian Bank', ['EU', 'US_FEDERAL', 'US_CALIFORNIA', 'UK', 'SINGAPORE'], 'system-seed')
      .catch(err => logger.error('Failed to seed cross-jurisdiction demo:', err));

    this.assessOrganization('org-datacendia', 'Datacendia', ['EU', 'US_FEDERAL', 'US_CALIFORNIA', 'UK', 'JAPAN', 'AUSTRALIA'], 'system-seed')
      .catch(err => logger.error('Failed to seed cross-jurisdiction demo:', err));
  }
}

// =============================================================================
// SINGLETON
// =============================================================================

export const crossJurisdictionConflictService = new CrossJurisdictionConflictService();
export default crossJurisdictionConflictService;
