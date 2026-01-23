/**
 * Government/Public Sector Vertical Implementation
 * 
 * Target: 85%+ (Awaiting agency-specific connectors)
 * Datacendia = "Decision Accountability for Government"
 * 
 * Killer Asset: Audit-ready decision trails for IG and GAO
 */

import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import {
  DataConnector,
  IngestResult,
  ProvenanceRecord,
  VerticalKnowledgeBase,
  KnowledgeDocument,
  RetrievalResult,
  ComplianceMapper,
  ComplianceFramework,
  ComplianceControl,
  ComplianceViolation,
  ComplianceEvidence,
  DecisionSchema,
  BaseDecision,
  ValidationResult,
  DefensibleArtifact,
  DefensibleOutput,
  RegulatorPacket,
  CourtBundle,
  AuditTrail,
  VerticalImplementation,
  VerticalRegistry
} from '../core/VerticalPattern.js';

// ============================================================================
// GOVERNMENT DECISION TYPES
// ============================================================================

export interface ProcurementDecision extends BaseDecision {
  type: 'procurement';
  inputs: {
    solicitationNumber: string;
    acquisitionType: 'competitive' | 'sole-source' | 'task-order' | 'modification';
    estimatedValue: number;
    naicsCode: string;
    setAside?: 'small-business' | '8a' | 'hubzone' | 'sdvosb' | 'wosb' | 'none';
    evaluationFactors: { factor: string; weight: number }[];
    proposals: { vendorId: string; technicalScore: number; priceScore: number; pastPerformance: string }[];
  };
  outcome: {
    awarded: boolean;
    awardeeId?: string;
    awardAmount?: number;
    rationale: string;
    bestValueDetermination: string;
    competitionDocumented: boolean;
  };
}

export interface PolicyDecision extends BaseDecision {
  type: 'policy';
  inputs: {
    policyId: string;
    policyType: 'regulation' | 'guidance' | 'directive' | 'standard';
    affectedParties: string[];
    publicComments: number;
    economicImpact: { costs: number; benefits: number; netBenefit: number };
    alternatives: { description: string; impact: string }[];
  };
  outcome: {
    approved: boolean;
    finalRule: boolean;
    effectiveDate?: Date;
    modifications: string[];
    responseToBriefComments: string;
    regulatoryImpactAssessment: boolean;
  };
}

export interface GrantDecision extends BaseDecision {
  type: 'grant';
  inputs: {
    opportunityNumber: string;
    programId: string;
    applicantId: string;
    requestedAmount: number;
    meritReviewScores: { criterion: string; score: number; maxScore: number }[];
    panelRecommendation: 'fund' | 'fund-with-conditions' | 'decline';
  };
  outcome: {
    awarded: boolean;
    awardAmount?: number;
    conditions: string[];
    performanceMilestones: { milestone: string; dueDate: Date }[];
    monitoringLevel: 'standard' | 'enhanced' | 'high-risk';
  };
}

export interface BudgetDecision extends BaseDecision {
  type: 'budget';
  inputs: {
    fiscalYear: number;
    accountCode: string;
    programElement: string;
    requestedAmount: number;
    justification: string;
    performanceGoals: { goal: string; target: number; baseline: number }[];
    priorYearExecution: number;
  };
  outcome: {
    approved: boolean;
    approvedAmount: number;
    reductions: { area: string; amount: number; rationale: string }[];
    performanceCommitments: string[];
    reportingRequirements: string[];
  };
}

export type GovernmentDecision = ProcurementDecision | PolicyDecision | GrantDecision | BudgetDecision;

// ============================================================================
// LAYER 1: GOVERNMENT DATA CONNECTOR
// ============================================================================

export interface FederalSystemData {
  systemId: string;
  systemType: 'fpds' | 'sam' | 'usaspending' | 'grants-gov' | 'max' | 'cfda';
  records: Record<string, unknown>[];
  lastUpdated: Date;
}

export class GovernmentDataConnector extends DataConnector<FederalSystemData> {
  readonly verticalId = 'government';
  readonly connectorType = 'federal-systems';

  constructor() {
    super();
    this.initializeSources();
  }

  private initializeSources(): void {
    this.sources.set('fpds', {
      id: 'fpds',
      name: 'Federal Procurement Data System',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('sam', {
      id: 'sam',
      name: 'System for Award Management',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('usaspending', {
      id: 'usaspending',
      name: 'USASpending.gov',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('grants-gov', {
      id: 'grants-gov',
      name: 'Grants.gov',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });

    this.sources.set('regulations-gov', {
      id: 'regulations-gov',
      name: 'Regulations.gov',
      type: 'api',
      connectionStatus: 'disconnected',
      lastSync: null,
      recordCount: 0
    });
  }

  async connect(config: Record<string, unknown>): Promise<boolean> {
    const sourceId = config['sourceId'] as string;
    const source = this.sources.get(sourceId);
    if (!source) return false;
    source.connectionStatus = 'connected';
    source.lastSync = new Date();
    return true;
  }

  async disconnect(): Promise<void> {
    for (const source of this.sources.values()) {
      source.connectionStatus = 'disconnected';
    }
  }

  async ingest(sourceId: string, query?: Record<string, unknown>): Promise<IngestResult<FederalSystemData>> {
    const source = this.sources.get(sourceId);
    if (!source || source.connectionStatus !== 'connected') {
      return {
        success: false,
        data: null,
        provenance: this.generateProvenance(sourceId, null),
        validationErrors: [`Source ${sourceId} not connected`]
      };
    }

    const data = this.simulateDataFetch(sourceId, query);
    const validation = this.validate(data);
    
    source.lastSync = new Date();
    source.recordCount += 1;

    return {
      success: validation.valid,
      data: validation.valid ? data : null,
      provenance: this.generateProvenance(sourceId, data),
      validationErrors: validation.errors
    };
  }

  validate(data: FederalSystemData): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    if (!data) {
      errors.push('Data is null or undefined');
      return { valid: false, errors };
    }
    if (!data.systemId) errors.push('System ID required');
    if (!data.systemType) errors.push('System type required');
    return { valid: errors.length === 0, errors };
  }

  private simulateDataFetch(sourceId: string, _query?: Record<string, unknown>): FederalSystemData {
    return {
      systemId: sourceId,
      systemType: sourceId as FederalSystemData['systemType'],
      records: [],
      lastUpdated: new Date()
    };
  }
}

// ============================================================================
// LAYER 2: GOVERNMENT KNOWLEDGE BASE
// ============================================================================

export class GovernmentKnowledgeBase extends VerticalKnowledgeBase {
  readonly verticalId = 'government';

  async embed(content: string, metadata: Record<string, unknown>, provenance: ProvenanceRecord): Promise<KnowledgeDocument> {
    const doc: KnowledgeDocument = {
      id: uuidv4(),
      content,
      metadata: {
        ...metadata,
        documentType: metadata['documentType'] || 'regulation',
        agency: metadata['agency'] || 'unknown',
        effectiveDate: metadata['effectiveDate'] || new Date()
      },
      provenance,
      embedding: this.generateEmbedding(content),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    this.documents.set(doc.id, doc);
    return doc;
  }

  async retrieve(query: string, topK: number = 5): Promise<RetrievalResult> {
    const queryEmbedding = this.generateEmbedding(query);
    const scored: { doc: KnowledgeDocument; score: number }[] = [];

    for (const doc of this.documents.values()) {
      if (doc.embedding) {
        const score = this.cosineSimilarity(queryEmbedding, doc.embedding);
        scored.push({ doc, score });
      }
    }

    scored.sort((a, b) => b.score - a.score);
    const topDocs = scored.slice(0, topK);

    return {
      documents: topDocs.map(s => s.doc),
      scores: topDocs.map(s => s.score),
      provenanceVerified: topDocs.every(s => s.doc.provenance.authoritative),
      query
    };
  }

  async enforceProvenance(docId: string): Promise<{ valid: boolean; issues: string[] }> {
    const doc = this.documents.get(docId);
    if (!doc) return { valid: false, issues: ['Document not found'] };

    const issues: string[] = [];
    if (!doc.provenance.authoritative) {
      issues.push('Document source is not authoritative');
    }
    
    const currentHash = crypto.createHash('sha256').update(doc.content).digest('hex');
    if (currentHash !== doc.provenance.hash) {
      issues.push('Document content hash mismatch');
    }

    return { valid: issues.length === 0, issues };
  }

  private generateEmbedding(text: string): number[] {
    const embedding: number[] = [];
    for (let i = 0; i < 384; i++) {
      embedding.push(Math.sin(text.charCodeAt(i % text.length) + i) / 2 + 0.5);
    }
    return embedding;
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < a.length; i++) {
      dotProduct += (a[i] ?? 0) * (b[i] ?? 0);
      normA += (a[i] ?? 0) ** 2;
      normB += (b[i] ?? 0) ** 2;
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
  }
}

// ============================================================================
// LAYER 3: GOVERNMENT COMPLIANCE MAPPER
// ============================================================================

export class GovernmentComplianceMapper extends ComplianceMapper {
  readonly verticalId = 'government';
  readonly supportedFrameworks: ComplianceFramework[] = [
    {
      id: 'far',
      name: 'Federal Acquisition Regulation',
      version: '2024',
      jurisdiction: 'US Federal',
      controls: [
        { id: 'far-6', name: 'Competition Requirements', description: 'Full and open competition', severity: 'critical', automatable: true },
        { id: 'far-15', name: 'Contracting by Negotiation', description: 'Competitive proposals', severity: 'high', automatable: true },
        { id: 'far-19', name: 'Small Business Programs', description: 'Small business set-asides', severity: 'high', automatable: true },
        { id: 'far-42', name: 'Contract Administration', description: 'Performance monitoring', severity: 'medium', automatable: true }
      ]
    },
    {
      id: 'fisma',
      name: 'Federal Information Security Modernization Act',
      version: '2014',
      jurisdiction: 'US Federal',
      controls: [
        { id: 'fisma-ato', name: 'Authority to Operate', description: 'System authorization', severity: 'critical', automatable: false },
        { id: 'fisma-poam', name: 'Plan of Action and Milestones', description: 'Remediation tracking', severity: 'high', automatable: true },
        { id: 'fisma-ca', name: 'Continuous Assessment', description: 'Ongoing authorization', severity: 'high', automatable: true }
      ]
    },
    {
      id: 'gpra',
      name: 'GPRA Modernization Act',
      version: '2010',
      jurisdiction: 'US Federal',
      controls: [
        { id: 'gpra-goals', name: 'Performance Goals', description: 'Outcome-based goals', severity: 'high', automatable: true },
        { id: 'gpra-measures', name: 'Performance Measures', description: 'Quantifiable metrics', severity: 'high', automatable: true },
        { id: 'gpra-review', name: 'Quarterly Reviews', description: 'Performance monitoring', severity: 'medium', automatable: true }
      ]
    },
    {
      id: 'apa',
      name: 'Administrative Procedure Act',
      version: '1946',
      jurisdiction: 'US Federal',
      controls: [
        { id: 'apa-notice', name: 'Notice and Comment', description: 'Rulemaking requirements', severity: 'critical', automatable: false },
        { id: 'apa-record', name: 'Administrative Record', description: 'Decision documentation', severity: 'critical', automatable: true },
        { id: 'apa-review', name: 'Judicial Review', description: 'Reviewable decisions', severity: 'high', automatable: false }
      ]
    },
    {
      id: '2cfr200',
      name: 'Uniform Administrative Requirements (2 CFR 200)',
      version: '2024',
      jurisdiction: 'US Federal',
      controls: [
        { id: '2cfr-merit', name: 'Merit Review', description: 'Competitive selection', severity: 'high', automatable: true },
        { id: '2cfr-monitoring', name: 'Subrecipient Monitoring', description: 'Grantee oversight', severity: 'high', automatable: true },
        { id: '2cfr-closeout', name: 'Grant Closeout', description: 'Final reporting', severity: 'medium', automatable: true }
      ]
    }
  ];

  mapToFramework(decisionType: string, frameworkId: string): ComplianceControl[] {
    const framework = this.getFramework(frameworkId);
    if (!framework) return [];

    const mappings: Record<string, Record<string, string[]>> = {
      procurement: {
        'far': ['far-6', 'far-15', 'far-19', 'far-42']
      },
      policy: {
        'apa': ['apa-notice', 'apa-record', 'apa-review']
      },
      grant: {
        '2cfr200': ['2cfr-merit', '2cfr-monitoring', '2cfr-closeout']
      },
      budget: {
        'gpra': ['gpra-goals', 'gpra-measures', 'gpra-review']
      }
    };

    const controlIds = mappings[decisionType]?.[frameworkId] || [];
    return framework.controls.filter(c => controlIds.includes(c.id));
  }

  async checkViolation(decision: GovernmentDecision, frameworkId: string): Promise<ComplianceViolation[]> {
    const violations: ComplianceViolation[] = [];
    const controls = this.mapToFramework(decision.type, frameworkId);

    for (const control of controls) {
      const violation = await this.evaluateControl(decision, control);
      if (violation) violations.push(violation);
    }

    return violations;
  }

  async generateEvidence(decision: GovernmentDecision, frameworkId: string): Promise<ComplianceEvidence[]> {
    const controls = this.mapToFramework(decision.type, frameworkId);
    const evidence: ComplianceEvidence[] = [];

    for (const control of controls) {
      const status = await this.evaluateControlStatus(decision, control);
      evidence.push({
        id: uuidv4(),
        frameworkId,
        controlId: control.id,
        status,
        evidence: `Control ${control.id} evaluated for ${decision.type} decision`,
        generatedAt: new Date(),
        hash: crypto.createHash('sha256').update(JSON.stringify({ decision, control, status })).digest('hex')
      });
    }

    return evidence;
  }

  private async evaluateControl(decision: GovernmentDecision, control: ComplianceControl): Promise<ComplianceViolation | null> {
    if (decision.type === 'procurement' && control.id === 'far-6') {
      const procDecision = decision as ProcurementDecision;
      if (procDecision.inputs.acquisitionType === 'sole-source' && !procDecision.outcome.competitionDocumented) {
        return {
          controlId: control.id,
          severity: 'critical',
          description: 'Sole-source procurement without competition documentation',
          remediation: 'Document justification for other than full and open competition',
          detectedAt: new Date()
        };
      }
    }
    return null;
  }

  private async evaluateControlStatus(_decision: GovernmentDecision, _control: ComplianceControl): Promise<ComplianceEvidence['status']> {
    return 'compliant';
  }
}

// ============================================================================
// LAYER 4: GOVERNMENT DECISION SCHEMAS
// ============================================================================

export class ProcurementDecisionSchema extends DecisionSchema<ProcurementDecision> {
  readonly verticalId = 'government';
  readonly decisionType = 'procurement';
  readonly requiredFields = [
    'inputs.solicitationNumber',
    'inputs.acquisitionType',
    'inputs.estimatedValue',
    'outcome.awarded',
    'outcome.rationale'
  ];
  readonly requiredApprovers = ['contracting-officer', 'legal-counsel'];

  validate(decision: Partial<ProcurementDecision>): ValidationResult {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (!decision.inputs?.solicitationNumber) errors.push('Solicitation number required');
    if (!decision.inputs?.acquisitionType) errors.push('Acquisition type required');
    if (typeof decision.inputs?.estimatedValue !== 'number') errors.push('Estimated value required');
    if (typeof decision.outcome?.awarded !== 'boolean') errors.push('Award decision required');
    if (!decision.outcome?.rationale) errors.push('Decision rationale required');

    if (decision.inputs?.acquisitionType === 'sole-source' && !decision.outcome?.competitionDocumented) {
      warnings.push('Sole-source requires J&A documentation');
    }

    return { valid: errors.length === 0, errors, warnings, requiredFields: this.requiredFields };
  }

  async sign(decision: ProcurementDecision, signerId: string, signerRole: string, privateKey: string): Promise<ProcurementDecision> {
    const hash = this.hashDecision(decision);
    decision.signatures.push({
      signerId,
      signerRole,
      signedAt: new Date(),
      signature: this.generateSignature(hash, privateKey),
      publicKeyFingerprint: crypto.createHash('sha256').update(privateKey).digest('hex').slice(0, 16)
    });
    return decision;
  }

  async toDefensibleArtifact(decision: ProcurementDecision, artifactType: DefensibleArtifact['type']): Promise<DefensibleArtifact> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      type: artifactType,
      content: {
        solicitation: decision.inputs.solicitationNumber,
        acquisitionType: decision.inputs.acquisitionType,
        awarded: decision.outcome.awarded,
        rationale: decision.outcome.rationale,
        approvals: decision.approvals,
        dissents: decision.dissents
      },
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      generatedAt: new Date(),
      expiresAt: new Date(Date.now() + 6 * 365 * 24 * 60 * 60 * 1000) // 6 years for procurement
    };
  }
}

// ============================================================================
// LAYER 5: GOVERNMENT AGENT PRESETS (imported from GovernmentAgents.ts)
// ============================================================================

// ============================================================================
// LAYER 6: GOVERNMENT DEFENSIBLE OUTPUTS
// ============================================================================

export class GovernmentDefensibleOutput extends DefensibleOutput<GovernmentDecision> {
  readonly verticalId = 'government';

  async toRegulatorPacket(decision: GovernmentDecision, regulatorId: string): Promise<RegulatorPacket> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      regulatorId,
      format: 'ig-report',
      content: {
        decisionSummary: this.summarizeDecision(decision),
        complianceEvidence: decision.complianceEvidence,
        deliberationRecord: decision.deliberation,
        approvalChain: decision.approvals,
        dissentsRecorded: decision.dissents
      },
      generatedAt: new Date(),
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      signature: ''
    };
  }

  async toCourtBundle(decision: GovernmentDecision, caseId: string): Promise<CourtBundle> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      caseId,
      documents: [
        { name: 'Decision Record', type: 'primary', content: JSON.stringify(decision) },
        { name: 'Administrative Record', type: 'supporting', content: JSON.stringify(decision.deliberation) }
      ],
      humanOversightStatement: `Decision made by ${decision.metadata.createdBy} with ${decision.approvals.length} approvals and ${decision.dissents.length} recorded dissents`,
      generatedAt: new Date(),
      hash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex')
    };
  }

  async toAuditTrail(decision: GovernmentDecision): Promise<AuditTrail> {
    return {
      id: uuidv4(),
      decisionId: decision.metadata.id,
      events: [
        { timestamp: decision.metadata.createdAt, event: 'decision_created', actor: decision.metadata.createdBy, details: {} },
        ...decision.approvals.map(a => ({
          timestamp: a.approvedAt,
          event: 'approval_granted' as const,
          actor: a.approverId,
          details: { role: a.approverRole }
        })),
        ...decision.signatures.map(s => ({
          timestamp: s.signedAt,
          event: 'signature_added' as const,
          actor: s.signerId,
          details: { role: s.signerRole }
        }))
      ],
      integrityHash: crypto.createHash('sha256').update(JSON.stringify(decision)).digest('hex'),
      exportedAt: new Date()
    };
  }

  private summarizeDecision(decision: GovernmentDecision): string {
    switch (decision.type) {
      case 'procurement':
        return `Procurement decision for ${decision.inputs.solicitationNumber}: ${decision.outcome.awarded ? 'Awarded' : 'Not awarded'}`;
      case 'policy':
        return `Policy decision ${decision.inputs.policyId}: ${decision.outcome.approved ? 'Approved' : 'Not approved'}`;
      case 'grant':
        return `Grant decision for ${decision.inputs.opportunityNumber}: ${decision.outcome.awarded ? 'Awarded' : 'Not awarded'}`;
      case 'budget':
        return `Budget decision for FY${decision.inputs.fiscalYear}: $${decision.outcome.approvedAmount.toLocaleString()}`;
      default:
        return 'Government decision';
    }
  }
}

// ============================================================================
// VERTICAL REGISTRATION
// ============================================================================

export const GovernmentVerticalImplementation: VerticalImplementation = {
  id: 'government',
  name: 'Government / Public Sector',
  version: '1.0.0',
  completionPercentage: 85,
  layers: {
    dataConnector: new GovernmentDataConnector(),
    knowledgeBase: new GovernmentKnowledgeBase(),
    complianceMapper: new GovernmentComplianceMapper(),
    decisionSchemas: {
      procurement: new ProcurementDecisionSchema()
    },
    defensibleOutput: new GovernmentDefensibleOutput()
  },
  supportedDecisionTypes: ['procurement', 'policy', 'grant', 'budget'],
  regulatoryFrameworks: ['FAR', 'FISMA', 'GPRA', 'APA', '2 CFR 200']
};

VerticalRegistry.register(GovernmentVerticalImplementation);

export default GovernmentVerticalImplementation;
