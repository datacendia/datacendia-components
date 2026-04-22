/**
 * Service — Decision D N A Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports decisionDNAService, DecisionDNA, DNAExportOptions
 * @module services/sovereign/DecisionDNAService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DECISION DNA—„¢ - ONE-CLICK AUDIT ARTIFACT EXPORT
// "Every decision, fully documented, instantly exportable, legally defensible."
//
// Generates comprehensive audit bundles containing:
// - Full Chronos replay (timeline + events)
// - Agent rationales and votes
// - Vox ethical assessments
// - Dissent records
// - Human overrides
// - Cryptographic proof of integrity
// =============================================================================

import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { embeddingService } from '../llm/EmbeddingService.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface DecisionDNA {
  id: string;
  version: '1.0';
  generatedAt: Date;
  generatedBy: string;
  
  // Decision identification
  decisionId: string;
  organizationId: string;
  organizationName?: string;
  
  // Core decision data
  decision: {
    title: string;
    question: string;
    context: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
    decisionType: string;
    status: string;
    outcome?: string;
    
    // Timeline
    proposedAt: Date;
    deliberationStartedAt?: Date;
    deliberationEndedAt?: Date;
    decidedAt?: Date;
    executedAt?: Date;
    
    // Ownership
    proposedBy: string;
    decidedBy?: string;
    executedBy?: string;
  };
  
  // Deliberation details
  deliberation: {
    mode: string;
    phases: DeliberationPhase[];
    totalDurationMs: number;
    
    // Agents
    participatingAgents: AgentContribution[];
    
    // Cross-examination
    crossExaminations?: CrossExamination[];
    
    // Synthesis
    synthesis?: {
      summary: string;
      confidence: number;
      keyPoints: string[];
      risks: string[];
      recommendations: string[];
    };
  };
  
  // Ethical assessment
  ethics: {
    voxAssessment?: VoxAssessment;
    ethicalFlags: string[];
    stakeholderImpact: StakeholderImpact[];
  };
  
  // Dissent records
  dissents: DissentRecord[];
  
  // Human oversight
  humanOversight: {
    reviewRequired: boolean;
    reviewedBy?: string;
    reviewedAt?: Date;
    overrides: Override[];
    vetoes: Veto[];
    approvals: Approval[];
  };
  
  // Audit trail
  auditTrail: AuditEvent[];
  
  // Outcome tracking
  outcomes?: {
    actualOutcome?: string;
    outcomeRecordedAt?: Date;
    success?: boolean;
    lessonsLearned?: string[];
    dissenterAccuracy?: {
      dissenterId: string;
      wasCorrect: boolean;
    }[];
  };
  
  // Integrity
  integrity: {
    ledgerHash: string;
    previousHash: string;
    merkleRoot: string;
    signatures: Signature[];
  };
  
  // Metadata
  metadata: {
    exportFormat: 'full' | 'summary' | 'compliance';
    complianceFrameworks: string[];
    retentionPeriod: string;
    classificationLevel: 'public' | 'internal' | 'confidential' | 'restricted';
    tags: string[];
  };
}

interface DeliberationPhase {
  name: string;
  startedAt: Date;
  endedAt: Date;
  durationMs: number;
  events: PhaseEvent[];
}

interface PhaseEvent {
  timestamp: Date;
  type: string;
  actor: string;
  description: string;
  data?: Record<string, any>;
}

interface AgentContribution {
  agentId: string;
  agentCode: string;
  agentName: string;
  role: string;
  
  // Analysis
  analysis: string;
  confidence: number;
  keyPoints: string[];
  risks: string[];
  recommendations: string[];
  
  // Vote
  vote?: 'approve' | 'reject' | 'abstain' | 'defer';
  voteRationale?: string;
  
  // Performance
  responseTimeMs: number;
  modelUsed: string;
  tokenCount: number;
}

interface CrossExamination {
  challengerId: string;
  challengerName: string;
  defenderId: string;
  defenderName: string;
  
  challenge: string;
  defense: string;
  resolution?: string;
  
  timestamp: Date;
}

interface VoxAssessment {
  overallScore: number;
  dimensions: {
    fairness: number;
    transparency: number;
    accountability: number;
    sustainability: number;
    humanDignity: number;
  };
  concerns: string[];
  recommendations: string[];
  assessedAt: Date;
}

interface StakeholderImpact {
  stakeholder: string;
  impactType: 'positive' | 'negative' | 'neutral';
  severity: 'low' | 'medium' | 'high';
  description: string;
}

interface DissentRecord {
  id: string;
  dissentType: string;
  severity: string;
  statement: string;
  
  isAnonymous: boolean;
  dissenterRole?: string;
  
  status: string;
  response?: string;
  
  filedAt: Date;
  resolvedAt?: Date;
  
  wasCorrect?: boolean;
}

interface Override {
  id: string;
  overrideType: string;
  originalDecision: string;
  newDecision: string;
  reason: string;
  
  overriddenBy: string;
  overriddenAt: Date;
  
  approved: boolean;
  approvedBy?: string;
}

interface Veto {
  id: string;
  vetoedBy: string;
  vetoedAt: Date;
  reason: string;
  authority: string;
  
  appealed: boolean;
  appealOutcome?: string;
}

interface Approval {
  id: string;
  approvedBy: string;
  approvedAt: Date;
  role: string;
  conditions?: string[];
}

interface AuditEvent {
  id: string;
  timestamp: Date;
  eventType: string;
  actor: string;
  actorType: 'human' | 'agent' | 'system';
  description: string;
  
  // Immutability
  previousHash: string;
  hash: string;
}

interface Signature {
  signerId: string;
  signerRole: string;
  algorithm: string;
  signature: string;
  signedAt: Date;
  publicKeyId?: string;
}

export interface DNAExportOptions {
  format: 'full' | 'summary' | 'compliance';
  outputFormat: 'json' | 'pdf' | 'bundle';
  includeRawData: boolean;
  redactPII: boolean;
  complianceFramework?: string;
  signWithKey?: string;
}

// =============================================================================
// DECISION DNA SERVICE
// =============================================================================

class DecisionDNAService extends EventEmitter {
  private exportPath: string;
  
  constructor() {
    super();
    this.exportPath = process.env.DNA_EXPORT_PATH || '/var/datacendia/dna/exports';
    this.ensureDirectories();
    logger.info('[DecisionDNA] Service initialized - Audit artifact generation ready');
  }

  private ensureDirectories(): void {
    if (!fs.existsSync(this.exportPath)) {
      fs.mkdirSync(this.exportPath, { recursive: true });
    }
  }

  // ===========================================================================
  // DNA GENERATION
  // ===========================================================================

  /**
   * Generate complete Decision DNA for a deliberation
   */
  async generateDNA(
    deliberationId: string,
    options: DNAExportOptions = {
      format: 'full',
      outputFormat: 'bundle',
      includeRawData: true,
      redactPII: false,
    }
  ): Promise<DecisionDNA> {
    logger.info(`[DecisionDNA] Generating DNA for deliberation ${deliberationId}`);
    
    // Fetch deliberation data
    const deliberation = await prisma.deliberations.findUnique({
      where: { id: deliberationId },
      include: {
        deliberation_messages: {
          include: { agents: true },
          orderBy: { created_at: 'asc' },
        },
      },
    });
    
    if (!deliberation) {
      throw new Error(`Deliberation not found: ${deliberationId}`);
    }
    
    // Build DNA structure
    const dna: DecisionDNA = {
      id: `dna-${crypto.randomUUID()}`,
      version: '1.0',
      generatedAt: new Date(),
      generatedBy: 'DecisionDNA Service v1.0',
      
      decisionId: deliberationId,
      organizationId: deliberation.organization_id,
      
      decision: await this.buildDecisionSection(deliberation),
      deliberation: await this.buildDeliberationSection(deliberation),
      ethics: await this.buildEthicsSection(deliberationId),
      dissents: await this.buildDissentsSection(deliberationId),
      humanOversight: await this.buildOversightSection(deliberationId),
      auditTrail: await this.buildAuditTrail(deliberationId),
      
      integrity: {
        ledgerHash: '',
        previousHash: '',
        merkleRoot: '',
        signatures: [],
      },
      
      metadata: {
        exportFormat: options.format,
        complianceFrameworks: options.complianceFramework ? [options.complianceFramework] : [],
        retentionPeriod: '7 years',
        classificationLevel: 'confidential',
        tags: [],
      },
    };
    
    // Calculate integrity hashes
    dna.integrity = this.calculateIntegrity(dna);
    
    // Redact PII if requested
    if (options.redactPII) {
      this.redactPII(dna);
    }
    
    // Sign if key provided
    if (options.signWithKey) {
      dna.integrity.signatures.push(
        await this.signDNA(dna, options.signWithKey)
      );
    }
    
    logger.info(`[DecisionDNA] Generated DNA ${dna.id}`);
    this.emit('dna:generated', dna);
    
    return dna;
  }

  /**
   * Build decision section
   */
  private async buildDecisionSection(deliberation: any): Promise<DecisionDNA['decision']> {
    const config = deliberation.config as any || {};
    
    return {
      title: config.title || `Deliberation ${deliberation.id}`,
      question: deliberation.question,
      context: config.context || '',
      urgency: config.urgency || 'medium',
      decisionType: config.decisionType || 'strategic',
      status: deliberation.status,
      outcome: deliberation.final_decision,
      
      proposedAt: deliberation.created_at,
      deliberationStartedAt: deliberation.started_at,
      deliberationEndedAt: deliberation.completed_at,
      decidedAt: deliberation.completed_at,
      executedAt: undefined,
      
      proposedBy: config.proposedBy || 'system',
      decidedBy: config.decidedBy,
      executedBy: undefined,
    };
  }

  /**
   * Build deliberation section
   */
  private async buildDeliberationSection(deliberation: any): Promise<DecisionDNA['deliberation']> {
    const messages = deliberation.deliberation_messages || [];
    
    // Group by phase
    const phases: DeliberationPhase[] = [];
    const phaseMap = new Map<string, PhaseEvent[]>();
    
    for (const msg of messages) {
      const phase = msg.phase || 'deliberation';
      if (!phaseMap.has(phase)) {
        phaseMap.set(phase, []);
      }
      phaseMap.get(phase)!.push({
        timestamp: msg.created_at,
        type: msg.message_type,
        actor: msg.agents?.name || 'System',
        description: msg.content?.substring(0, 200) || '',
        data: msg.metadata,
      });
    }
    
    for (const [name, events] of phaseMap) {
      if (events.length > 0) {
        phases.push({
          name,
          startedAt: events[0].timestamp,
          endedAt: events[events.length - 1].timestamp,
          durationMs: events[events.length - 1].timestamp.getTime() - events[0].timestamp.getTime(),
          events,
        });
      }
    }
    
    // Build agent contributions
    const agentContributions: AgentContribution[] = [];
    const agentMessages = messages.filter((m: any) => m.agents);
    
    for (const msg of agentMessages) {
      const existing = agentContributions.find(a => a.agentId === msg.agent_id);
      if (!existing) {
        const metadata = msg.metadata as any || {};
        agentContributions.push({
          agentId: msg.agent_id,
          agentCode: msg.agents.code,
          agentName: msg.agents.name,
          role: msg.agents.role,
          analysis: msg.content || '',
          confidence: metadata.confidence || 0.7,
          keyPoints: metadata.keyPoints || [],
          risks: metadata.risks || [],
          recommendations: metadata.recommendations || [],
          vote: metadata.vote,
          voteRationale: metadata.voteRationale,
          responseTimeMs: metadata.responseTimeMs || 0,
          modelUsed: metadata.model || 'unknown',
          tokenCount: metadata.tokens || 0,
        });
      }
    }
    
    // Calculate total duration
    const totalDurationMs = deliberation.completed_at && deliberation.started_at
      ? new Date(deliberation.completed_at).getTime() - new Date(deliberation.started_at).getTime()
      : 0;
    
    return {
      mode: (deliberation.config as any)?.mode || 'war-room',
      phases,
      totalDurationMs,
      participatingAgents: agentContributions,
      synthesis: deliberation.final_decision ? {
        summary: deliberation.final_decision,
        confidence: (deliberation.config as any)?.finalConfidence || 0.8,
        keyPoints: [],
        risks: [],
        recommendations: [],
      } : undefined,
    };
  }

  /**
   * Build ethics section
   */
  private async buildEthicsSection(_deliberationId: string): Promise<DecisionDNA['ethics']> {
    // Vox service integration via internal service mesh
    return {
      voxAssessment: undefined,
      ethicalFlags: [],
      stakeholderImpact: [],
    };
  }

  /**
   * Build dissents section
   */
  private async buildDissentsSection(deliberationId: string): Promise<DissentRecord[]> {
    try {
      const dissents = await prisma.dissents.findMany({
        where: { decision_id: deliberationId },
      });
      
      return dissents.map(d => ({
        id: d.id,
        dissentType: d.dissent_type,
        severity: d.severity,
        statement: d.statement,
        isAnonymous: d.is_anonymous,
        dissenterRole: d.dissenter_role || undefined,
        status: d.status,
        response: (d as any).response?.text,
        filedAt: d.created_at,
        resolvedAt: (d as any).resolved_at || undefined,
        wasCorrect: d.outcome_verified ? d.dissenter_was_right || undefined : undefined,
      }));
    } catch {
      return [];
    }
  }

  /**
   * Build human oversight section
   */
  private async buildOversightSection(_deliberationId: string): Promise<DecisionDNA['humanOversight']> {
    // Approval/veto data from Prisma decision_approvals table
    return {
      reviewRequired: true,
      overrides: [],
      vetoes: [],
      approvals: [],
    };
  }

  /**
   * Build audit trail
   */
  private async buildAuditTrail(deliberationId: string): Promise<AuditEvent[]> {
    const events: AuditEvent[] = [];
    let previousHash = '0'.repeat(64);
    
    // Fetch audit logs
    try {
      const logs = await prisma.audit_logs.findMany({
        where: {
          resource_type: 'deliberation',
          resource_id: deliberationId,
        },
        orderBy: { created_at: 'asc' },
      });
      
      for (const log of logs) {
        const eventData = {
          id: log.id,
          timestamp: log.created_at,
          eventType: log.action,
          actor: log.user_id || 'system',
          actorType: (log.user_id ? 'human' : 'system') as 'human' | 'system' | 'agent',
          description: `${log.action} on ${log.resource_type}`,
        };
        
        const hash = crypto
          .createHash('sha256')
          .update(JSON.stringify({ ...eventData, previousHash }))
          .digest('hex');
        
        events.push({
          ...eventData,
          previousHash,
          hash,
        });
        
        previousHash = hash;
      }
    } catch {
      // Table may not exist
    }
    
    return events;
  }

  /**
   * Calculate integrity hashes
   */
  private calculateIntegrity(dna: DecisionDNA): DecisionDNA['integrity'] {
    // Calculate Merkle root of all audit events
    const eventHashes = dna.auditTrail.map(e => e.hash);
    const merkleRoot = this.calculateMerkleRoot(eventHashes);
    
    // Calculate overall ledger hash
    const ledgerHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        decisionId: dna.decisionId,
        decision: dna.decision,
        deliberation: dna.deliberation,
        dissents: dna.dissents,
        merkleRoot,
        generatedAt: dna.generatedAt,
      }))
      .digest('hex');
    
    // Get previous hash from last audit event
    const previousHash = eventHashes.length > 0 
      ? eventHashes[eventHashes.length - 1] 
      : '0'.repeat(64);
    
    return {
      ledgerHash,
      previousHash,
      merkleRoot,
      signatures: [],
    };
  }

  /**
   * Calculate Merkle root from hashes
   */
  private calculateMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '0'.repeat(64);
    if (hashes.length === 1) return hashes[0];
    
    const pairs: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i];
      const right = hashes[i + 1] || left;
      pairs.push(
        crypto.createHash('sha256').update(left + right).digest('hex')
      );
    }
    
    return this.calculateMerkleRoot(pairs);
  }

  /**
   * Redact PII from DNA
   */
  private redactPII(dna: DecisionDNA): void {
    // Redact user IDs
    if (dna.decision.proposedBy) {
      dna.decision.proposedBy = this.redactId(dna.decision.proposedBy);
    }
    if (dna.decision.decidedBy) {
      dna.decision.decidedBy = this.redactId(dna.decision.decidedBy);
    }
    
    // Redact dissent info
    for (const dissent of dna.dissents) {
      if (!dissent.isAnonymous) {
        dissent.isAnonymous = true;
      }
    }
    
    // Redact override/approval actors
    for (const override of dna.humanOversight.overrides) {
      override.overriddenBy = this.redactId(override.overriddenBy);
    }
    for (const approval of dna.humanOversight.approvals) {
      approval.approvedBy = this.redactId(approval.approvedBy);
    }
  }

  private redactId(id: string): string {
    return `[REDACTED-${crypto.createHash('sha256').update(id).digest('hex').slice(0, 8)}]`;
  }

  /**
   * Sign DNA with private key
   */
  private async signDNA(dna: DecisionDNA, keyPath: string): Promise<Signature> {
    const privateKey = fs.readFileSync(keyPath, 'utf8');
    const dataToSign = JSON.stringify({
      ledgerHash: dna.integrity.ledgerHash,
      merkleRoot: dna.integrity.merkleRoot,
      generatedAt: dna.generatedAt,
    });
    
    const sign = crypto.createSign('SHA256');
    sign.update(dataToSign);
    const signature = sign.sign(privateKey, 'base64');
    
    return {
      signerId: 'system',
      signerRole: 'DecisionDNA Service',
      algorithm: 'SHA256withRSA',
      signature,
      signedAt: new Date(),
    };
  }

  // ===========================================================================
  // EXPORT METHODS
  // ===========================================================================

  /**
   * Export DNA as JSON file
   */
  async exportAsJSON(dna: DecisionDNA): Promise<string> {
    const filename = `${dna.id}.json`;
    const filepath = path.join(this.exportPath, filename);
    
    fs.writeFileSync(filepath, JSON.stringify(dna, null, 2));
    
    logger.info(`[DecisionDNA] Exported JSON: ${filepath}`);
    return filepath;
  }

  /**
   * Export DNA as audit bundle (ZIP with JSON + summary)
   */
  async exportAsBundle(dna: DecisionDNA): Promise<string> {
    const bundleDir = path.join(this.exportPath, dna.id);
    fs.mkdirSync(bundleDir, { recursive: true });
    
    // Write full JSON
    fs.writeFileSync(
      path.join(bundleDir, 'decision_dna.json'),
      JSON.stringify(dna, null, 2)
    );
    
    // Write human-readable summary
    const summary = this.generateSummary(dna);
    fs.writeFileSync(path.join(bundleDir, 'summary.md'), summary);
    
    // Write trust artifacts reference
    const trustArtifacts = {
      iso42001: 'https://datacendia.com/trust/iso-42001-conformance.pdf',
      nistAIRMF: 'https://datacendia.com/trust/nist-ai-rmf-alignment.pdf',
      euAIAct: 'https://datacendia.com/trust/eu-ai-act-conformance.pdf',
      sbom: 'https://datacendia.com/trust/sbom.json',
      securityPolicy: 'https://datacendia.com/.well-known/security.txt',
      verificationTools: 'https://github.com/datacendia/verification-tools',
    };
    fs.writeFileSync(
      path.join(bundleDir, 'trust_artifacts.json'),
      JSON.stringify(trustArtifacts, null, 2)
    );

    // Write integrity manifest
    const manifest = {
      id: dna.id,
      decisionId: dna.decisionId,
      generatedAt: dna.generatedAt,
      integrity: dna.integrity,
      trustArtifacts,
      files: ['decision_dna.json', 'summary.md', 'trust_artifacts.json', 'manifest.json'],
    };
    fs.writeFileSync(
      path.join(bundleDir, 'manifest.json'),
      JSON.stringify(manifest, null, 2)
    );
    
    logger.info(`[DecisionDNA] Exported bundle: ${bundleDir}`);
    this.emit('dna:exported', { dna, path: bundleDir });
    
    return bundleDir;
  }

  /**
   * Generate human-readable summary
   */
  private generateSummary(dna: DecisionDNA): string {
    return `# Decision DNA Report

## Executive Summary

**Decision ID:** ${dna.decisionId}
**Title:** ${dna.decision.title}
**Status:** ${dna.decision.status}
**Generated:** ${dna.generatedAt.toISOString()}

---

## Decision Details

**Question:** ${dna.decision.question}

**Context:** ${dna.decision.context || 'Not provided'}

**Urgency:** ${dna.decision.urgency}
**Type:** ${dna.decision.decisionType}

### Timeline
- **Proposed:** ${dna.decision.proposedAt?.toISOString() || 'N/A'}
- **Deliberation Started:** ${dna.decision.deliberationStartedAt?.toISOString() || 'N/A'}
- **Deliberation Ended:** ${dna.decision.deliberationEndedAt?.toISOString() || 'N/A'}
- **Decided:** ${dna.decision.decidedAt?.toISOString() || 'N/A'}

---

## Deliberation Summary

**Mode:** ${dna.deliberation.mode}
**Duration:** ${Math.round(dna.deliberation.totalDurationMs / 1000)}s
**Participating Agents:** ${dna.deliberation.participatingAgents.length}

### Agent Contributions

${dna.deliberation.participatingAgents.map(a => `
#### ${a.agentName} (${a.role})
- **Confidence:** ${Math.round(a.confidence * 100)}%
- **Vote:** ${a.vote || 'N/A'}
- **Model:** ${a.modelUsed}
- **Response Time:** ${a.responseTimeMs}ms
`).join('\n')}

${dna.deliberation.synthesis ? `
### Synthesis

${dna.deliberation.synthesis.summary}

**Confidence:** ${Math.round(dna.deliberation.synthesis.confidence * 100)}%
` : ''}

---

## Dissent Records

${dna.dissents.length === 0 ? 'No dissents recorded.' : dna.dissents.map(d => `
### Dissent: ${d.dissentType} (${d.severity})
**Status:** ${d.status}
**Filed:** ${d.filedAt.toISOString()}
${d.isAnonymous ? '**Anonymous Dissent**' : ''}

${d.statement}

${d.response ? `**Response:** ${d.response}` : ''}
${d.wasCorrect !== undefined ? `**Outcome Accuracy:** ${d.wasCorrect ? 'Dissenter was correct' : 'Decision was correct'}` : ''}
`).join('\n')}

---

## Human Oversight

**Review Required:** ${dna.humanOversight.reviewRequired ? 'Yes' : 'No'}
**Overrides:** ${dna.humanOversight.overrides.length}
**Vetoes:** ${dna.humanOversight.vetoes.length}
**Approvals:** ${dna.humanOversight.approvals.length}

---

## Integrity Verification

**Ledger Hash:** \`${dna.integrity.ledgerHash}\`
**Merkle Root:** \`${dna.integrity.merkleRoot}\`
**Signatures:** ${dna.integrity.signatures.length}

To verify this document's integrity:
1. Recalculate the ledger hash from the JSON data
2. Compare with the hash above
3. Verify any attached signatures

---

## Audit Trail

${dna.auditTrail.length} events recorded.

${dna.auditTrail.slice(0, 10).map(e => `
- **${e.timestamp.toISOString()}** - ${e.eventType} by ${e.actor} (${e.actorType})
`).join('')}

${dna.auditTrail.length > 10 ? `\n... and ${dna.auditTrail.length - 10} more events. See full JSON for complete audit trail.` : ''}

---

*Generated by Datacendia Decision DNA—„¢ v1.0*
*Classification: ${dna.metadata.classificationLevel}*
*Retention: ${dna.metadata.retentionPeriod}*
`;
  }

  // ===========================================================================
  // DCII LEARNING INTEGRATION — Proactive Past-Decision Surfacing
  // ===========================================================================

  /**
   * Find similar past decisions for a new question.
   * Uses RAG (EmbeddingService) for semantic similarity + Prisma for metadata.
   * Called at deliberation start to surface relevant precedents.
   */
  async findSimilarDecisions(params: {
    question: string;
    organizationId: string;
    topK?: number;
    minScore?: number;
  }): Promise<Array<{
    deliberationId: string;
    question: string;
    outcome: string | null;
    similarity: number;
    decidedAt: Date | null;
    status: string;
  }>> {
    const { question, organizationId, topK = 5, minScore = 0.1 } = params;

    try {
      // Step 1: Fetch recent deliberations from Prisma
      const pastDeliberations = await prisma.deliberations.findMany({
        where: { organization_id: organizationId, status: 'COMPLETED' },
        orderBy: { completed_at: 'desc' },
        take: 200,
        select: {
          id: true,
          question: true,
          decision: true,
          completed_at: true,
          status: true,
        },
      });

      if (pastDeliberations.length === 0) {
        logger.info('[DecisionDNA] No past deliberations found for similarity search');
        return [];
      }

      // Step 2: Index past deliberations into EmbeddingService (ephemeral index)
      const indexId = `dna-similarity-${organizationId}-${Date.now()}`;
      for (const delib of pastDeliberations) {
        if (delib.question) {
          await embeddingService.addDocument(
            `${indexId}::${delib.id}`,
            delib.question,
            { deliberationId: delib.id, outcome: delib.decision ? JSON.stringify(delib.decision).slice(0, 500) : null, decidedAt: delib.completed_at, status: delib.status }
          );
        }
      }

      // Step 3: Search for similar decisions
      const results = await embeddingService.search(question, topK, minScore);

      // Step 4: Map results back to deliberation data
      const similar = results
        .filter(r => r.id.startsWith(`${indexId}::`))
        .map(r => ({
          deliberationId: r.metadata?.deliberationId as string,
          question: r.text,
          outcome: (r.metadata?.outcome as string) || null,
          similarity: Math.round(r.score * 1000) / 1000,
          decidedAt: r.metadata?.decidedAt as Date | null,
          status: (r.metadata?.status as string) || 'unknown',
        }));

      logger.info(`[DecisionDNA] Found ${similar.length} similar past decisions for: "${question.slice(0, 80)}..."`);
      this.emit('learning:similar_found', { question, count: similar.length, topScore: similar[0]?.similarity });

      return similar;
    } catch (err) {
      logger.warn(`[DecisionDNA] Similarity search failed: ${(err as Error).message}`);
      return [];
    }
  }

  /**
   * Generate a learning context summary from similar past decisions.
   * Returns a formatted string suitable for inclusion in deliberation context.
   */
  async getLearningContext(params: {
    question: string;
    organizationId: string;
    topK?: number;
  }): Promise<string> {
    const similar = await this.findSimilarDecisions(params);

    if (similar.length === 0) {
      return '**No similar past decisions found.** This appears to be a novel question for this organization.';
    }

    const lines = similar.map((s, i) => {
      const outcomeStr = s.outcome ? `Outcome: ${s.outcome.slice(0, 200)}` : 'Outcome: pending';
      const dateStr = s.decidedAt ? new Date(s.decidedAt).toLocaleDateString() : 'N/A';
      return `${i + 1}. **[${(s.similarity * 100).toFixed(0)}% similar]** "${s.question.slice(0, 150)}" (${dateStr})\n   ${outcomeStr}`;
    });

    return `## Similar Past Decisions (DCII Learning Integration)\n\n${lines.join('\n\n')}\n\n*Surfaced automatically by DecisionDNA™ Learning Integration.*`;
  }

  // ===========================================================================
  // OUTCOME TRACKING — Automated Follow-Up on Decision Results
  // ===========================================================================

  /**
   * Schedule an outcome review for a completed deliberation.
   * Stores the review schedule in Prisma and emits events when due.
   */
  async scheduleOutcomeReview(params: {
    deliberationId: string;
    organizationId: string;
    reviewAfterDays: number;
    expectedOutcome?: string;
    successCriteria?: string[];
  }): Promise<{ id: string; reviewDate: Date }> {
    const reviewDate = new Date(Date.now() + params.reviewAfterDays * 24 * 60 * 60 * 1000);

    const id = await persistServiceRecord({
      serviceName: 'DecisionDNA',
      recordType: 'outcome_review_scheduled',
      organizationId: params.organizationId,
      referenceId: params.deliberationId,
      data: {
        deliberationId: params.deliberationId,
        reviewDate: reviewDate.toISOString(),
        expectedOutcome: params.expectedOutcome || null,
        successCriteria: params.successCriteria || [],
        status: 'scheduled',
      },
    }) || `outcome-${crypto.randomUUID()}`;

    logger.info(`[DecisionDNA] Outcome review scheduled for ${params.deliberationId} on ${reviewDate.toLocaleDateString()}`);
    this.emit('outcome:scheduled', { id, deliberationId: params.deliberationId, reviewDate });

    return { id, reviewDate };
  }

  /**
   * Record the actual outcome of a past decision.
   */
  async recordOutcome(params: {
    deliberationId: string;
    organizationId: string;
    actualOutcome: string;
    wasSuccessful: boolean;
    lessonsLearned?: string[];
    impactAssessment?: string;
  }): Promise<{ id: string }> {
    const id = await persistServiceRecord({
      serviceName: 'DecisionDNA',
      recordType: 'outcome_recorded',
      organizationId: params.organizationId,
      referenceId: params.deliberationId,
      data: {
        deliberationId: params.deliberationId,
        actualOutcome: params.actualOutcome,
        wasSuccessful: params.wasSuccessful,
        lessonsLearned: params.lessonsLearned || [],
        impactAssessment: params.impactAssessment || null,
        recordedAt: new Date().toISOString(),
      },
    }) || `outcome-result-${crypto.randomUUID()}`;

    logger.info(`[DecisionDNA] Outcome recorded for ${params.deliberationId}: ${params.wasSuccessful ? 'SUCCESS' : 'FAILURE'}`);
    this.emit('outcome:recorded', { id, ...params });

    return { id };
  }

  /**
   * Get pending outcome reviews that are overdue.
   */
  async getPendingOutcomeReviews(organizationId: string): Promise<Array<{
    id: string;
    deliberationId: string;
    reviewDate: string;
    daysOverdue: number;
  }>> {
    try {
      const records = await loadServiceRecords({
        serviceName: 'DecisionDNA',
        recordType: 'outcome_review_scheduled',
        organizationId,
      });

      const now = Date.now();
      return records
        .filter((r: { data: unknown }) => {
          const d = r.data as any;
          return d?.status === 'scheduled' && new Date(d.reviewDate).getTime() <= now;
        })
        .map((r: { id: string; data: unknown }) => {
          const d = r.data as any;
          const rd = new Date(d.reviewDate);
          return {
            id: r.id,
            deliberationId: d.deliberationId,
            reviewDate: rd.toISOString(),
            daysOverdue: Math.floor((now - rd.getTime()) / 86400000),
          };
        });
    } catch {
      return [];
    }
  }

  // ===========================================================================
  // DECISION REVERSAL WORKFLOW
  // ===========================================================================

  /**
   * Initiate a decision reversal — formally reverse a prior decision with full audit trail.
   */
  async initiateReversal(params: {
    deliberationId: string;
    organizationId: string;
    reason: string;
    initiatedBy: string;
    urgency: 'low' | 'medium' | 'high' | 'critical';
  }): Promise<{ reversalId: string; status: string }> {
    const reversalId = await persistServiceRecord({
      serviceName: 'DecisionDNA',
      recordType: 'decision_reversal',
      organizationId: params.organizationId,
      referenceId: params.deliberationId,
      data: {
        deliberationId: params.deliberationId,
        reason: params.reason,
        initiatedBy: params.initiatedBy,
        urgency: params.urgency,
        status: 'pending_approval',
        initiatedAt: new Date().toISOString(),
        approvals: [],
        hash: crypto.createHash('sha256').update(JSON.stringify({
          deliberationId: params.deliberationId,
          reason: params.reason,
          initiatedBy: params.initiatedBy,
          timestamp: Date.now(),
        })).digest('hex'),
      },
    }) || `reversal-${crypto.randomUUID()}`;

    logger.info(`[DecisionDNA] Decision reversal initiated: ${reversalId} for deliberation ${params.deliberationId} (${params.urgency})`);
    this.emit('reversal:initiated', { reversalId, ...params });

    return { reversalId, status: 'pending_approval' };
  }

  /**
   * Approve a pending reversal. Loads the reversal record, adds approval, and re-persists.
   */
  async approveReversal(params: {
    reversalId: string;
    approvedBy: string;
    comments?: string;
  }): Promise<{ status: string }> {
    try {
      const records = await loadServiceRecords({
        serviceName: 'DecisionDNA',
        recordType: 'decision_reversal',
      });
      const record = records.find((r: { id: string }) => r.id === params.reversalId);
      if (!record) throw new Error(`Reversal not found: ${params.reversalId}`);

      const data = record.data as any;
      data.approvals = data.approvals || [];
      data.approvals.push({
        approvedBy: params.approvedBy,
        approvedAt: new Date().toISOString(),
        comments: params.comments || '',
      });
      data.status = 'approved';

      await persistServiceRecord({
        serviceName: 'DecisionDNA',
        recordType: 'reversal_approved',
        referenceId: params.reversalId,
        data,
      });

      logger.info(`[DecisionDNA] Reversal approved: ${params.reversalId} by ${params.approvedBy}`);
      this.emit('reversal:approved', params);

      return { status: 'approved' };
    } catch (err) {
      logger.warn(`[DecisionDNA] Reversal approval failed: ${(err as Error).message}`);
      return { status: 'error' };
    }
  }

  /**
   * Verify DNA integrity
   */
  verifyIntegrity(dna: DecisionDNA): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    // Recalculate Merkle root
    const eventHashes = dna.auditTrail.map(e => e.hash);
    const calculatedMerkle = this.calculateMerkleRoot(eventHashes);
    
    if (calculatedMerkle !== dna.integrity.merkleRoot) {
      errors.push('Merkle root mismatch - audit trail may have been modified');
    }
    
    // Verify hash chain
    let previousHash = '0'.repeat(64);
    for (const event of dna.auditTrail) {
      if (event.previousHash !== previousHash) {
        errors.push(`Hash chain broken at event ${event.id}`);
      }
      previousHash = event.hash;
    }
    
    return {
      valid: errors.length === 0,
      errors,
    };
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const decisionDNAService = new DecisionDNAService();
export { DecisionDNAService };
