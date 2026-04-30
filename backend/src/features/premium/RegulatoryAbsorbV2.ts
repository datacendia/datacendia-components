/**
 * Feature — Regulatory Absorb V2
 *
 * Feature module implementing a specific platform capability.
 *
 * @exports RegulatoryAbsorbV2Service, regulatoryAbsorbV2Service, AbsorbRequestV2, DocumentUploadV2, DocumentMetadata, AbsorptionResultV2, RequirementV2, TriggerV2
 * @module features/holy-shit/RegulatoryAbsorbV2
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PLATFORM - REGULATORY INSTANT-ABSORB V2
// Enterprise-grade compliance ingestion with provenance, verification, and review
// =============================================================================

import { createHash } from 'crypto';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';
import { featureGating, SubscriptionTier } from '../../core/subscriptions/SubscriptionTiers.js';
import type { PrismaClient } from '@prisma/client';
import { RegulatorySeverity, RegulatoryDocStatus, RegulatoryReviewStatus, ConstraintType, TriggerType, ConflictType, ConflictResolution } from '@prisma/client';
import { prisma as sharedPrisma } from '../../config/database.js';

// =============================================================================
// TYPES
// =============================================================================

export interface AbsorbRequestV2 {
  organizationId: string;
  userId: string;
  tier: SubscriptionTier;
  document: DocumentUploadV2;
  metadata: DocumentMetadata;
  parentVersionId?: string; // For version updates
}

export interface DocumentUploadV2 {
  filename: string;
  mimeType: string;
  size: number;
  content: string; // Base64 or text content
}

export interface DocumentMetadata {
  name: string;
  jurisdiction?: string;
  regulationType?: string;
  effectiveDate?: Date;
}

export interface AbsorptionResultV2 {
  id: string;
  documentName: string;
  contentHash: string;
  uploadedAt: Date;
  processingTime: number;
  status: RegulatoryDocStatus;
  reviewStatus: RegulatoryReviewStatus;
  version: number;
  detectedLanguage?: string;
  
  requirements: RequirementV2[];
  triggers: TriggerV2[];
  constraints: ConstraintV2[];
  conflicts: ConflictV2[];
  
  summary: AbsorptionSummaryV2;
  verificationReport: VerificationReport;
}

export interface RequirementV2 {
  id: string;
  title: string;
  description: string;
  originalText: string;
  originalTextHash: string;
  category: string;
  severity: RegulatorySeverity;
  verificationScore: number;
  verificationMethod: string;
  isVerified: boolean;
  deadline?: Date;
  penaltyAmount?: number;
  penaltyCurrency?: string;
  penaltyDescription?: string;
  affectedProcesses: string[];
  affectedAgents: string[];
}

export interface TriggerV2 {
  id: string;
  name: string;
  description: string;
  triggerType: TriggerType;
  conditionExpression?: string;
  actionType: string;
  actionConfig: Record<string, unknown>;
  isActive: boolean;
}

export interface ConstraintV2 {
  id: string;
  name: string;
  description: string;
  constraintType: ConstraintType;
  ruleExpression: string;
  appliesToAgents: string[];
  appliesToDecisions: string[];
  isActive: boolean;
}

export interface ConflictV2 {
  id: string;
  document1Id: string;
  document2Id: string;
  requirement1Id?: string;
  requirement2Id?: string;
  conflictType: ConflictType;
  description: string;
  requirement1Summary?: string;
  requirement2Summary?: string;
  aiRecommendation?: string;
  confidenceScore?: number;
  resolutionStatus: ConflictResolution;
  priorityDocumentId?: string;
  priorityRequirementId?: string;
}

export interface AbsorptionSummaryV2 {
  totalPages: number;
  totalWords: number;
  processingTime: number;
  requirementsExtracted: number;
  triggersIdentified: number;
  constraintsCreated: number;
  conflictsDetected: number;
  verificationScore: number;
  hallucinationRisk: 'low' | 'medium' | 'high';
  penalties: PenaltyInfoV2[];
}

export interface PenaltyInfoV2 {
  violation: string;
  maxPenalty: string;
  currency: string;
  description: string;
}

export interface VerificationReport {
  overallScore: number;
  verifiedRequirements: number;
  unverifiedRequirements: number;
  exactMatches: number;
  fuzzyMatches: number;
  noMatches: number;
  hallucinationRisk: 'low' | 'medium' | 'high';
  recommendations: string[];
}

export interface AuditEntry {
  id: string;
  documentId: string;
  action: string;
  actorId?: string;
  actorType: string;
  details: Record<string, unknown>;
  previousHash?: string;
  entryHash: string;
  createdAt: Date;
}

// =============================================================================
// REGULATORY ABSORB V2 SERVICE
// =============================================================================

export class RegulatoryAbsorbV2Service extends BaseService {
  private prisma: PrismaClient;
  private ollamaEndpoint: string;

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'regulatory-absorb-v2',
      version: '2.0.0',
      dependencies: ['council', 'database'],
      ...config,
    });
    this.prisma = sharedPrisma as unknown as PrismaClient;
    this.ollamaEndpoint = process.env['OLLAMA_HOST'] || 'http://127.0.0.1:11434';
  }

  async initialize(): Promise<void> {
    this.logger.info('Regulatory Instant-Absorb V2 service initializing...');
    await this.prisma.$connect();
  }

  async shutdown(): Promise<void> {
    this.logger.info('Regulatory Instant-Absorb V2 service shutting down...');
    await this.prisma.$disconnect();
  }

  async healthCheck(): Promise<ServiceHealth> {
    const docCount = await this.prisma.regulatory_documents.count();
    const reqCount = await this.prisma.regulatory_requirements.count();
    
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        documentsAbsorbed: docCount,
        requirementsKnown: reqCount,
        version: '2.0.0',
      },
    };
  }

  // ---------------------------------------------------------------------------
  // CRYPTOGRAPHIC UTILITIES
  // ---------------------------------------------------------------------------

  private hashContent(content: string): string {
    return createHash('sha256').update(content).digest('hex');
  }

  private createAuditHash(previousHash: string | null, action: string, timestamp: Date, details: Record<string, unknown>): string {
    const data = `${previousHash || 'genesis'}|${action}|${timestamp.toISOString()}|${JSON.stringify(details)}`;
    return createHash('sha256').update(data).digest('hex');
  }

  // ---------------------------------------------------------------------------
  // DOCUMENT PARSING WITH OCR AND CHUNKING
  // ---------------------------------------------------------------------------

  private async extractText(document: DocumentUploadV2): Promise<string> {
    let content = document.content;
    
    // Handle base64 encoded content
    if (content.startsWith('data:')) {
      const base64Data = content.split(',')[1];
      content = base64Data || content; // Keep as base64 for binary parsing
    }

    // PDF parsing (requires pdf-parse package)
    if (document.mimeType === 'application/pdf') {
      try {
        const pdfParse = await import('pdf-parse').then((m: any) => m.default).catch(() => null);
        if (pdfParse) {
          const buffer = Buffer.from(content, 'base64');
          const data = await pdfParse(buffer);
          
          // Check if PDF is scanned (very little text extracted)
          if (data.text.trim().length < 100 && data.numpages > 0) {
            this.logger.info('PDF appears to be scanned, attempting OCR...');
            const ocrText = await this.performOCR(buffer);
            if (ocrText) return ocrText;
          }
          
          return data.text;
        }
      } catch (e) {
        this.logger.warn('PDF parsing failed, attempting OCR fallback...');
        try {
          const buffer = Buffer.from(content, 'base64');
          const ocrText = await this.performOCR(buffer);
          if (ocrText) return ocrText;
        } catch (ocrError) {
          this.logger.warn('OCR also failed, using raw content');
        }
      }
    }

    // DOCX parsing (requires mammoth package)
    if (document.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      try {
        const mammoth = await import('mammoth').then(m => m.default).catch(() => null);
        if (mammoth) {
          const buffer = Buffer.from(content, 'base64');
          const result = await mammoth.extractRawText({ buffer });
          return result.value;
        }
      } catch (e) {
        this.logger.warn('DOCX parsing failed, using raw content');
      }
    }

    // For text content, decode from base64 if needed
    try {
      return Buffer.from(content, 'base64').toString('utf-8');
    } catch {
      return content;
    }
  }

  /**
   * Perform OCR on scanned documents using Tesseract.js
   * Requires: npm install tesseract.js
   */
  private async performOCR(buffer: Buffer): Promise<string | null> {
    try {
      const Tesseract = await import('tesseract.js').then(m => m.default || m).catch(() => null);
      if (!Tesseract) {
        this.logger.warn('Tesseract.js not installed. Run: npm install tesseract.js');
        return null;
      }

      this.logger.info('Running OCR on scanned document...');
      
      // Create worker for OCR
      const worker = await Tesseract.createWorker('eng');
      
      // Convert PDF buffer to image would require additional processing
      // For now, we'll handle image-based PDFs or direct images
      const { data: { text } } = await worker.recognize(buffer);
      await worker.terminate();
      
      this.logger.info(`OCR extracted ${text.length} characters`);
      return text;
    } catch (error) {
      this.logger.error('OCR failed:', error as Error);
      return null;
    }
  }

  /**
   * Chunk long documents for processing
   * Splits by sections/paragraphs while preserving context
   */
  private chunkDocument(text: string, maxChunkSize: number = 40000): string[] {
    // If document is small enough, return as single chunk
    if (text.length <= maxChunkSize) {
      return [text];
    }

    this.logger.info(`Document is ${text.length} chars, chunking into ~${maxChunkSize} char segments`);

    const chunks: string[] = [];
    
    // Try to split on section headers first (e.g., "Article 1", "Section 2", "Chapter 3")
    const sectionPattern = /(?=(?:Article|Section|Chapter|Part|Title|ARTICLE|SECTION|CHAPTER|PART|TITLE)\s+\d+)/gi;
    const sections = text.split(sectionPattern).filter(s => s.trim().length > 0);

    if (sections.length > 1) {
      // Combine sections into chunks that fit within maxChunkSize
      let currentChunk = '';
      for (const section of sections) {
        if (currentChunk.length + section.length > maxChunkSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = section;
        } else {
          currentChunk += '\n\n' + section;
        }
      }
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }
    } else {
      // Fallback: split by paragraphs
      const paragraphs = text.split(/\n\n+/);
      let currentChunk = '';
      
      for (const para of paragraphs) {
        if (currentChunk.length + para.length > maxChunkSize && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = para;
        } else {
          currentChunk += '\n\n' + para;
        }
      }
      if (currentChunk.trim().length > 0) {
        chunks.push(currentChunk.trim());
      }
    }

    this.logger.info(`Split document into ${chunks.length} chunks`);
    return chunks;
  }

  /**
   * Get the recommended model based on document complexity
   */
  private getRecommendedModel(documentText: string): { model: string; reason: string } {
    const wordCount = documentText.split(/\s+/).length;
    const hasLegalTerms = /(?:whereas|hereinafter|notwithstanding|pursuant|thereof|hereby)/gi.test(documentText);
    const hasTechnicalTerms = /(?:cryptographic|encryption|authentication|protocol|algorithm|compliance)/gi.test(documentText);
    const hasFinancialTerms = /(?:capital|liquidity|solvency|derivative|hedge|Basel|IFRS)/gi.test(documentText);
    
    const complexity = (hasLegalTerms ? 1 : 0) + (hasTechnicalTerms ? 1 : 0) + (hasFinancialTerms ? 1 : 0);
    
    if (wordCount > 50000 || complexity >= 2) {
      return {
        model: 'llama3.2:70b',
        reason: 'Large/complex document with specialized terminology - using largest model for accuracy'
      };
    } else if (wordCount > 10000 || complexity >= 1) {
      return {
        model: 'llama3.2:32b',
        reason: 'Medium complexity document - using balanced model'
      };
    } else {
      return {
        model: process.env.OLLAMA_MODEL || 'llama3.2:latest',
        reason: 'Standard document - using default model'
      };
    }
  }

  private detectLanguage(text: string): string {
    // Simple language detection based on common words
    const langPatterns: Record<string, RegExp[]> = {
      'en': [/\bthe\b/gi, /\band\b/gi, /\bshall\b/gi, /\bmust\b/gi],
      'de': [/\bund\b/gi, /\bdie\b/gi, /\bder\b/gi, /\bdas\b/gi],
      'fr': [/\ble\b/gi, /\bla\b/gi, /\bet\b/gi, /\bdes\b/gi],
      'es': [/\bel\b/gi, /\bla\b/gi, /\by\b/gi, /\bde\b/gi],
      'it': [/\bil\b/gi, /\bla\b/gi, /\be\b/gi, /\bdi\b/gi],
      'pt': [/\bo\b/gi, /\ba\b/gi, /\be\b/gi, /\bde\b/gi],
    };

    const scores: Record<string, number> = {};
    for (const [lang, patterns] of Object.entries(langPatterns)) {
      scores[lang] = patterns.reduce((sum, pattern) => {
        const matches = text.match(pattern);
        return sum + (matches ? matches.length : 0);
      }, 0);
    }

    const detected = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
    return detected && detected[1] > 10 ? detected[0] : 'en';
  }

  // ---------------------------------------------------------------------------
  // VERIFICATION (ANTI-HALLUCINATION)
  // ---------------------------------------------------------------------------

  private verifyRequirementText(originalText: string, sourceDocument: string): { score: number; method: string } {
    const normalizedOriginal = originalText.toLowerCase().replace(/\s+/g, ' ').trim();
    const normalizedSource = sourceDocument.toLowerCase().replace(/\s+/g, ' ');

    // Exact match
    if (normalizedSource.includes(normalizedOriginal)) {
      return { score: 1.0, method: 'exact' };
    }

    // Fuzzy match - check if most words are present
    const words = normalizedOriginal.split(' ').filter(w => w.length > 3);
    const matchedWords = words.filter(word => normalizedSource.includes(word));
    const fuzzyScore = matchedWords.length / words.length;

    if (fuzzyScore >= 0.8) {
      return { score: fuzzyScore, method: 'fuzzy' };
    }

    // Semantic similarity would require embeddings - mark as unverified
    return { score: fuzzyScore, method: 'semantic' };
  }

  private calculateHallucinationRisk(requirements: RequirementV2[]): 'low' | 'medium' | 'high' {
    if (requirements.length === 0) return 'low';
    
    const avgScore = requirements.reduce((sum, r) => sum + r.verificationScore, 0) / requirements.length;
    const unverifiedCount = requirements.filter(r => !r.isVerified).length;
    const unverifiedRatio = unverifiedCount / requirements.length;

    if (avgScore >= 0.8 && unverifiedRatio < 0.1) return 'low';
    if (avgScore >= 0.5 && unverifiedRatio < 0.3) return 'medium';
    return 'high';
  }

  // ---------------------------------------------------------------------------
  // LLM EXTRACTION
  // ---------------------------------------------------------------------------

  private async extractRequirementsWithLLM(documentText: string): Promise<Omit<RequirementV2, 'id' | 'verificationScore' | 'verificationMethod' | 'isVerified' | 'originalTextHash'>[]> {
    const prompt = `You are a regulatory compliance expert. Extract all compliance requirements from the following regulation document.

For each requirement, provide:
- title: A short descriptive title
- description: Full description of the requirement
- originalText: The EXACT text from the document (copy verbatim, do not paraphrase)
- category: One of: data_protection, security, financial, operational, governance, environmental, employment, industry_specific, reporting, licensing
- severity: One of: CRITICAL, HIGH, MEDIUM, LOW, INFO
- deadline: ISO date if mentioned, null otherwise
- penaltyAmount: Number if mentioned, null otherwise
- penaltyCurrency: Currency code if mentioned, null otherwise
- penaltyDescription: Description of penalties if mentioned
- affectedProcesses: Array of business processes affected
- affectedAgents: Array of roles affected (e.g., CISO, Legal, CFO, COO, HR)

IMPORTANT: The originalText MUST be copied exactly from the source document. Do not paraphrase or summarize.

Document:
${documentText.substring(0, 50000)}

Respond with a JSON array of requirements:`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env['OLLAMA_MODEL'] || 'llama3.2:latest',
          prompt,
          stream: false,
          format: 'json',
        }),
      });

      if (!response.ok) {
        throw new Error(`Ollama request failed: ${response.status}`);
      }

      const data = await response.json() as { response: string };
      const parsed = JSON.parse(data.response);
      return Array.isArray(parsed) ? parsed : parsed.requirements || [];
    } catch (error) {
      this.logger.error('LLM extraction failed:', error as any);
      return [];
    }
  }

  private async detectConflictsWithLLM(
    newRequirements: RequirementV2[],
    existingDocuments: { id: string; name: string; requirements: { id: string; title: string; description: string }[] }[]
  ): Promise<(Omit<ConflictV2, 'id'> & { requirement1Id?: string; requirement2Id?: string })[]> {
    if (existingDocuments.length === 0) return [];

    const prompt = `You are a regulatory compliance expert. Analyze if any of the NEW requirements conflict with EXISTING requirements.

NEW REQUIREMENTS (each has an "id"):
${JSON.stringify(newRequirements.map(r => ({ id: r.id, title: r.title, description: r.description })), null, 2)}

EXISTING REGULATIONS (each requirement has an "id"):
${JSON.stringify(existingDocuments.map(d => ({ id: d.id, name: d.name, requirements: d.requirements.slice(0, 10) })), null, 2)}

For each conflict found, provide:
- document1Id: "new" (for the new document)
- document2Id: The ID of the existing document
- requirement1Id: The id of the SPECIFIC new requirement that conflicts (must match an id from NEW REQUIREMENTS)
- requirement2Id: The id of the SPECIFIC existing requirement that conflicts (must match an id from EXISTING REGULATIONS requirements)
- conflictType: One of: DIRECT (directly contradict), POTENTIAL (may conflict), SUPERSEDED (one replaces another)
- description: Explanation of the conflict
- requirement1Summary: Summary of the new requirement
- requirement2Summary: Summary of the existing requirement
- aiRecommendation: How to resolve this conflict
- confidenceScore: 0-1 confidence in this being a real conflict

Respond with a JSON array of conflicts (empty array if none):`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: process.env['OLLAMA_MODEL'] || 'llama3.2:latest',
          prompt,
          stream: false,
          format: 'json',
        }),
      });

      if (!response.ok) return [];

      const data: any = await response.json();
      const parsed = JSON.parse(data.response);
      return Array.isArray(parsed) ? parsed : parsed.conflicts || [];
    } catch (error) {
      this.logger.error('Conflict detection failed:', error as any);
      return [];
    }
  }

  // ---------------------------------------------------------------------------
  // MAIN ABSORPTION FUNCTION
  // ---------------------------------------------------------------------------

  async absorbDocument(request: AbsorbRequestV2): Promise<AbsorptionResultV2> {
    const startTime = Date.now();

    // Check feature access
    const access = this.checkAccess(request.tier, request.organizationId);
    if (!access.allowed) {
      throw new Error(access.reason);
    }

    this.logger.info(`Starting V2 absorption of: ${request.document.filename}`);

    // Extract text content
    const documentText = await this.extractText(request.document);
    const contentHash = this.hashContent(documentText);
    const wordCount = documentText.split(/\s+/).length;
    const pageCount = Math.ceil(wordCount / 250);
    const detectedLanguage = this.detectLanguage(documentText);

    // Check for duplicate
    const existingDoc = await this.prisma.regulatory_documents.findFirst({
      where: { organization_id: request.organizationId, content_hash: contentHash },
    });
    if (existingDoc) {
      throw new Error(`Document already absorbed (ID: ${existingDoc.id}). Use version update if this is a new version.`);
    }

    // Determine version
    let version = 1;
    let changelog: string | undefined;
    if (request.parentVersionId) {
      const parent = await this.prisma.regulatory_documents.findUnique({
        where: { id: request.parentVersionId },
      });
      if (parent) {
        version = parent.version + 1;
        changelog = `Updated from version ${parent.version}`;
      }
    }

    // Create document record
    const document = await this.prisma.regulatory_documents.create({
      data: {
        organization_id: request.organizationId,
        name: request.metadata.name,
        filename: request.document.filename,
        mime_type: request.document.mimeType,
        jurisdiction: request.metadata.jurisdiction,
        regulation_type: request.metadata.regulationType,
        effective_date: request.metadata.effectiveDate,
        content_hash: contentHash,
        content_size: request.document.size,
        original_content: documentText,
        version,
        parent_version_id: request.parentVersionId,
        changelog,
        status: 'PROCESSING',
        review_status: 'DRAFT',
        detected_language: detectedLanguage,
        uploaded_by: request.userId,
      },
    });

    // Create initial audit entry
    await this.createAuditEntry(document.id, 'uploaded', request.userId, 'user', {
      filename: request.document.filename,
      contentHash,
      size: request.document.size,
    });

    try {
      // Extract requirements with LLM
      const rawRequirements = await this.extractRequirementsWithLLM(documentText);

      // Verify and store requirements
      const requirements: RequirementV2[] = [];
      for (const raw of rawRequirements) {
        const verification = this.verifyRequirementText(raw.originalText || '', documentText);
        const originalTextHash = this.hashContent(raw.originalText || '');

        const req = await this.prisma.regulatory_requirements.create({
          data: {
            document_id: document.id,
            title: raw.title,
            description: raw.description,
            original_text: raw.originalText || '',
            original_text_hash: originalTextHash,
            category: raw.category || 'operational',
            severity: (raw.severity as RegulatorySeverity) || 'MEDIUM',
            verification_score: verification.score,
            verification_method: verification.method,
            is_verified: verification.score >= 0.7,
            deadline: raw.deadline ? new Date(raw.deadline) : null,
            penalty_amount: raw.penaltyAmount,
            penalty_currency: raw.penaltyCurrency,
            penalty_description: raw.penaltyDescription,
            affected_processes: raw.affectedProcesses || [],
            affected_agents: raw.affectedAgents || [],
          },
        });

        requirements.push({
          id: req.id,
          title: req.title,
          description: req.description,
          originalText: req.original_text,
          originalTextHash: req.original_text_hash,
          category: req.category,
          severity: req.severity,
          verificationScore: req.verification_score,
          verificationMethod: req.verification_method || 'none',
          isVerified: req.is_verified,
          deadline: req.deadline || undefined,
          penaltyAmount: req.penalty_amount || undefined,
          penaltyCurrency: req.penalty_currency || undefined,
          penaltyDescription: req.penalty_description || undefined,
          affectedProcesses: req.affected_processes as string[],
          affectedAgents: req.affected_agents as string[],
        });
      }

      // Create triggers for critical/high severity requirements
      const triggers: TriggerV2[] = [];
      for (const req of requirements.filter(r => r.severity === 'CRITICAL' || r.severity === 'HIGH')) {
        const trigger = await this.prisma.regulatory_triggers.create({
          data: {
            document_id: document.id,
            requirement_id: req.id,
            name: `Trigger: ${req.title}`,
            description: `Compliance trigger for ${req.title}`,
            trigger_type: req.severity === 'CRITICAL' ? 'AUTOMATIC' : 'MANUAL',
            action_type: req.severity === 'CRITICAL' ? 'block' : 'alert',
            action_config: { requirementId: req.id, severity: req.severity },
            is_active: false, // Inactive until approved
          },
        });

        triggers.push({
          id: trigger.id,
          name: trigger.name,
          description: trigger.description,
          triggerType: trigger.trigger_type,
          conditionExpression: trigger.condition_expression || undefined,
          actionType: trigger.action_type,
          actionConfig: trigger.action_config as Record<string, unknown>,
          isActive: trigger.is_active,
        });
      }

      // Create constraints for mandatory requirements
      const constraints: ConstraintV2[] = [];
      for (const req of requirements.filter(r => r.severity === 'CRITICAL')) {
        const constraint = await this.prisma.regulatory_constraints.create({
          data: {
            document_id: document.id,
            requirement_id: req.id, // link for conflict-scoped deactivation
            name: `Constraint: ${req.title}`,
            description: req.description,
            constraint_type: 'MANDATORY',
            rule_expression: `BLOCK if violates "${req.title}"`,
            applies_to_agents: req.affectedAgents,
            applies_to_decisions: [],
            is_active: false, // Inactive until approved
          },
        });

        constraints.push({
          id: constraint.id,
          name: constraint.name,
          description: constraint.description,
          constraintType: constraint.constraint_type,
          ruleExpression: constraint.rule_expression,
          appliesToAgents: constraint.applies_to_agents as string[],
          appliesToDecisions: constraint.applies_to_decisions as string[],
          isActive: constraint.is_active,
        });
      }

      // Detect conflicts with existing documents
      const existingDocs = await this.prisma.regulatory_documents.findMany({
        where: { 
          organization_id: request.organizationId,
          id: { not: document.id },
          review_status: 'APPROVED',
        },
        include: {
          requirements: { select: { id: true, title: true, description: true } },
        },
      });

      const rawConflicts = await this.detectConflictsWithLLM(
        requirements,
        existingDocs.map(d => ({
          id: d.id,
          name: d.name,
          requirements: d.requirements,
        }))
      );

      // Build lookup tables to validate that LLM-returned requirement IDs are real.
      const newReqIds = new Set(requirements.map(r => r.id));
      const existingReqIds = new Set(
        existingDocs.flatMap(d => d.requirements.map(r => r.id))
      );

      const conflicts: ConflictV2[] = [];
      for (const raw of rawConflicts) {
        if (raw.document2Id && raw.document2Id !== 'new') {
          // Only persist requirement IDs if the LLM returned valid ones.
          // Hallucinated IDs are dropped to null so we never link to phantom rows.
          const req1Id = raw.requirement1Id && newReqIds.has(raw.requirement1Id) ? raw.requirement1Id : null;
          const req2Id = raw.requirement2Id && existingReqIds.has(raw.requirement2Id) ? raw.requirement2Id : null;

          const conflict = await this.prisma.regulatory_conflicts.create({
            data: {
              organization_id: request.organizationId,
              document1_id: document.id,
              document2_id: raw.document2Id,
              requirement1_id: req1Id,
              requirement2_id: req2Id,
              conflict_type: (raw.conflictType as ConflictType) || 'POTENTIAL',
              description: raw.description || 'Potential conflict detected',
              requirement1_summary: raw.requirement1Summary,
              requirement2_summary: raw.requirement2Summary,
              ai_recommendation: raw.aiRecommendation,
              confidence_score: raw.confidenceScore,
              resolution_status: 'UNRESOLVED',
            },
          });

          conflicts.push({
            id: conflict.id,
            document1Id: conflict.document1_id,
            document2Id: conflict.document2_id,
            requirement1Id: conflict.requirement1_id || undefined,
            requirement2Id: conflict.requirement2_id || undefined,
            conflictType: conflict.conflict_type,
            description: conflict.description,
            requirement1Summary: conflict.requirement1_summary || undefined,
            requirement2Summary: conflict.requirement2_summary || undefined,
            aiRecommendation: conflict.ai_recommendation || undefined,
            confidenceScore: conflict.confidence_score || undefined,
            resolutionStatus: conflict.resolution_status,
          });
        }
      }

      // Calculate verification report
      const verifiedCount = requirements.filter(r => r.isVerified).length;
      const exactMatches = requirements.filter(r => r.verificationMethod === 'exact').length;
      const fuzzyMatches = requirements.filter(r => r.verificationMethod === 'fuzzy').length;
      const noMatches = requirements.filter(r => r.verificationScore < 0.5).length;
      const avgVerificationScore = requirements.length > 0
        ? requirements.reduce((sum, r) => sum + r.verificationScore, 0) / requirements.length
        : 0;
      const hallucinationRisk = this.calculateHallucinationRisk(requirements);

      const verificationReport: VerificationReport = {
        overallScore: avgVerificationScore,
        verifiedRequirements: verifiedCount,
        unverifiedRequirements: requirements.length - verifiedCount,
        exactMatches,
        fuzzyMatches,
        noMatches,
        hallucinationRisk,
        recommendations: this.generateVerificationRecommendations(requirements, hallucinationRisk),
      };

      // Extract penalties
      const penalties = this.extractPenalties(documentText);

      const processingTime = (Date.now() - startTime) / 1000;

      // Update document status
      await this.prisma.regulatory_documents.update({
        where: { id: document.id },
        data: {
          status: 'COMPLETED',
          processing_started: new Date(startTime),
          processing_completed: new Date(),
        },
      });

      // Create processing complete audit entry
      await this.createAuditEntry(document.id, 'processed', null, 'system', {
        requirementsExtracted: requirements.length,
        triggersCreated: triggers.length,
        constraintsCreated: constraints.length,
        conflictsDetected: conflicts.length,
        verificationScore: avgVerificationScore,
        processingTime,
      });

      this.incrementCounter('documents_absorbed_v2', 1);
      this.recordMetric('absorption_time_seconds_v2', processingTime);

      return {
        id: document.id,
        documentName: document.name,
        contentHash: document.content_hash,
        uploadedAt: document.created_at,
        processingTime,
        status: 'COMPLETED',
        reviewStatus: 'DRAFT',
        version: document.version,
        detectedLanguage: document.detected_language || undefined,
        requirements,
        triggers,
        constraints,
        conflicts,
        summary: {
          totalPages: pageCount,
          totalWords: wordCount,
          processingTime,
          requirementsExtracted: requirements.length,
          triggersIdentified: triggers.length,
          constraintsCreated: constraints.length,
          conflictsDetected: conflicts.length,
          verificationScore: avgVerificationScore,
          hallucinationRisk,
          penalties,
        },
        verificationReport,
      };
    } catch (error) {
      // Update document status to failed
      await this.prisma.regulatory_documents.update({
        where: { id: document.id },
        data: {
          status: 'FAILED',
          processing_error: error instanceof Error ? error.message : 'Unknown error',
        },
      });

      await this.createAuditEntry(document.id, 'processing_failed', null, 'system', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      this.incrementCounter('absorptions_failed_v2', 1);
      throw error;
    }
  }

  // ---------------------------------------------------------------------------
  // REVIEW WORKFLOW
  // ---------------------------------------------------------------------------

  async approveDocument(documentId: string, userId: string): Promise<void> {
    const document = await this.prisma.regulatory_documents.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error('Document not found');
    if (document.review_status === 'APPROVED') throw new Error('Document already approved');

    // BLOCK approval if this document has unresolved DIRECT conflicts.
    // DIRECT conflicts are literal contradictions (e.g. GDPR right-to-erasure vs OSA retain-for-investigation)
    // and cannot be auto-resolved by "most restrictive wins" heuristics — they require human counsel review.
    const blockingConflicts = await this.prisma.regulatory_conflicts.findMany({
      where: {
        organization_id: document.organization_id,
        conflict_type: 'DIRECT',
        resolution_status: 'UNRESOLVED',
        OR: [{ document1_id: documentId }, { document2_id: documentId }],
      },
      select: { id: true, description: true },
    });
    if (blockingConflicts.length > 0) {
      const ids = blockingConflicts.map(c => c.id).join(', ');
      throw new Error(
        `Cannot approve: ${blockingConflicts.length} unresolved DIRECT regulatory conflict(s) involve this document (${ids}). ` +
        `Resolve via POST /regulatory/v2/conflicts/:id/resolve before approval.`
      );
    }

    // Activate all constraints and triggers
    await this.prisma.regulatory_constraints.updateMany({
      where: { document_id: documentId },
      data: { is_active: true, activated_at: new Date(), activated_by: userId },
    });

    await this.prisma.regulatory_triggers.updateMany({
      where: { document_id: documentId },
      data: { is_active: true },
    });

    // Update document status
    await this.prisma.regulatory_documents.update({
      where: { id: documentId },
      data: {
        review_status: 'APPROVED',
        reviewed_by: userId,
        reviewed_at: new Date(),
      },
    });

    await this.createAuditEntry(documentId, 'approved', userId, 'user', {
      constraintsActivated: true,
      triggersActivated: true,
    });
  }

  async rejectDocument(documentId: string, userId: string, reason: string): Promise<void> {
    const document = await this.prisma.regulatory_documents.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error('Document not found');

    await this.prisma.regulatory_documents.update({
      where: { id: documentId },
      data: {
        review_status: 'REJECTED',
        reviewed_by: userId,
        reviewed_at: new Date(),
        review_comments: reason,
      },
    });

    await this.createAuditEntry(documentId, 'rejected', userId, 'user', { reason });
  }

  async requestChanges(documentId: string, userId: string, comments: string): Promise<void> {
    const document = await this.prisma.regulatory_documents.findUnique({
      where: { id: documentId },
    });

    if (!document) throw new Error('Document not found');

    await this.prisma.regulatory_documents.update({
      where: { id: documentId },
      data: {
        review_status: 'CHANGES_REQUESTED',
        reviewed_by: userId,
        reviewed_at: new Date(),
        review_comments: comments,
      },
    });

    await this.createAuditEntry(documentId, 'changes_requested', userId, 'user', { comments });
  }

  // ---------------------------------------------------------------------------
  // QUERY FUNCTIONS
  // ---------------------------------------------------------------------------

  async getDocuments(organizationId: string, filters?: {
    status?: RegulatoryDocStatus;
    reviewStatus?: RegulatoryReviewStatus;
    jurisdiction?: string;
  }): Promise<any[]> {
    return this.prisma.regulatory_documents.findMany({
      where: {
        organization_id: organizationId,
        ...(filters?.status && { status: filters.status }),
        ...(filters?.reviewStatus && { review_status: filters.reviewStatus }),
        ...(filters?.jurisdiction && { jurisdiction: filters.jurisdiction }),
      },
      include: {
        requirements: { select: { id: true, title: true, severity: true, is_verified: true } },
        _count: { select: { triggers: true, constraints: true } },
      },
      orderBy: { created_at: 'desc' },
    });
  }

  async getDocument(documentId: string): Promise<any> {
    return this.prisma.regulatory_documents.findUnique({
      where: { id: documentId },
      include: {
        requirements: true,
        triggers: true,
        constraints: true,
        conflicts_as_doc1: true,
        conflicts_as_doc2: true,
        audit_logs: { orderBy: { created_at: 'desc' } },
      },
    });
  }

  async getAuditTrail(documentId: string): Promise<AuditEntry[]> {
    const logs = await this.prisma.regulatory_audit_logs.findMany({
      where: { document_id: documentId },
      orderBy: { created_at: 'asc' },
    });

    return logs.map(log => ({
      id: log.id,
      documentId: log.document_id,
      action: log.action,
      actorId: log.actor_id || undefined,
      actorType: log.actor_type,
      details: log.details as Record<string, unknown>,
      previousHash: log.previous_hash || undefined,
      entryHash: log.entry_hash,
      createdAt: log.created_at,
    }));
  }

  // ---------------------------------------------------------------------------
  // CONFLICT RESOLUTION
  // ---------------------------------------------------------------------------

  /**
   * Manually resolve a single conflict. Required path for DIRECT conflicts
   * (literal contradictions) — these cannot be auto-resolved because
   * "most-restrictive wins" is undefined when rules are orthogonal
   * (e.g. delete-on-request vs retain-for-investigation).
   */
  async resolveConflict(
    conflictId: string,
    userId: string,
    decision: {
      resolution: ConflictResolution;
      priorityDocumentId?: string; // required when resolution = RESOLVED_PRIORITY
      notes?: string;
    }
  ): Promise<ConflictV2> {
    const conflict = await this.prisma.regulatory_conflicts.findUnique({
      where: { id: conflictId },
    });
    if (!conflict) throw new Error('Conflict not found');
    if (conflict.resolution_status !== 'UNRESOLVED') {
      throw new Error(`Conflict already resolved as ${conflict.resolution_status}`);
    }

    if (decision.resolution === 'UNRESOLVED') {
      throw new Error('Cannot resolve a conflict to UNRESOLVED');
    }

    if (decision.resolution === 'RESOLVED_PRIORITY') {
      if (!decision.priorityDocumentId) {
        throw new Error('priorityDocumentId required when resolution = RESOLVED_PRIORITY');
      }
      if (
        decision.priorityDocumentId !== conflict.document1_id &&
        decision.priorityDocumentId !== conflict.document2_id
      ) {
        throw new Error('priorityDocumentId must be one of the two conflicting documents');
      }
    }

    // Resolve the losing requirement (only meaningful for RESOLVED_PRIORITY).
    let priorityRequirementId: string | null = null;
    let losingRequirementId: string | null = null;
    if (decision.resolution === 'RESOLVED_PRIORITY' && decision.priorityDocumentId) {
      ({ priorityRequirementId, losingRequirementId } = this.identifyPriorityRequirement(
        conflict,
        decision.priorityDocumentId
      ));
    }

    const updated = await this.prisma.regulatory_conflicts.update({
      where: { id: conflictId },
      data: {
        resolution_status: decision.resolution,
        resolution_notes: this.buildResolutionNotes(decision),
        resolved_by: userId,
        resolved_at: new Date(),
        priority_document_id: decision.priorityDocumentId ?? null,
        priority_requirement_id: priorityRequirementId,
      },
    });

    // Cascade-deactivate the losing requirement and its dependents.
    let cascadeSummary: { requirements: number; constraints: number; triggers: number } = {
      requirements: 0,
      constraints: 0,
      triggers: 0,
    };
    if (decision.resolution === 'RESOLVED_PRIORITY' && losingRequirementId) {
      cascadeSummary = await this.cascadeOverride(losingRequirementId, conflictId);
    }

    // Audit on both involved documents so the chain is intact for either side.
    const auditDetails = {
      conflictId,
      conflictType: conflict.conflict_type,
      resolution: decision.resolution,
      priorityDocumentId: decision.priorityDocumentId,
      priorityRequirementId: priorityRequirementId,
      losingRequirementId: losingRequirementId,
      cascade: cascadeSummary,
      notes: decision.notes,
    };
    await this.createAuditEntry(conflict.document1_id, 'conflict_resolved', userId, 'user', auditDetails);
    await this.createAuditEntry(conflict.document2_id, 'conflict_resolved', userId, 'user', auditDetails);

    return {
      id: updated.id,
      document1Id: updated.document1_id,
      document2Id: updated.document2_id,
      requirement1Id: updated.requirement1_id || undefined,
      requirement2Id: updated.requirement2_id || undefined,
      conflictType: updated.conflict_type,
      description: updated.description,
      requirement1Summary: updated.requirement1_summary || undefined,
      requirement2Summary: updated.requirement2_summary || undefined,
      aiRecommendation: updated.ai_recommendation || undefined,
      confidenceScore: updated.confidence_score || undefined,
      resolutionStatus: updated.resolution_status,
      priorityDocumentId: updated.priority_document_id || undefined,
      priorityRequirementId: updated.priority_requirement_id || undefined,
    };
  }

  /**
   * Auto-resolve POTENTIAL and SUPERSEDED conflicts only.
   * - POTENTIAL: pick the document whose conflicting requirement carries higher max severity
   *   (CRITICAL > HIGH > MEDIUM > LOW > INFO). Tie → newer document.
   * - SUPERSEDED: newer document wins (older is treated as replaced).
   * DIRECT conflicts are NEVER touched here — they require human approval.
   *
   * Returns counts for reporting.
   */
  async autoResolveNonDirectConflicts(
    organizationId: string,
    actorUserId: string = 'system'
  ): Promise<{ resolved: number; skipped: number; details: Array<{ conflictId: string; resolution: ConflictResolution; priorityDocumentId: string; reason: string }> }> {
    const candidates = await this.prisma.regulatory_conflicts.findMany({
      where: {
        organization_id: organizationId,
        resolution_status: 'UNRESOLVED',
        conflict_type: { in: ['POTENTIAL', 'SUPERSEDED'] },
      },
    });

    const details: Array<{ conflictId: string; resolution: ConflictResolution; priorityDocumentId: string; reason: string }> = [];
    let skipped = 0;

    for (const c of candidates) {
      const [doc1, doc2] = await Promise.all([
        this.prisma.regulatory_documents.findUnique({
          where: { id: c.document1_id },
          select: { id: true, created_at: true, requirements: { select: { severity: true } } },
        }),
        this.prisma.regulatory_documents.findUnique({
          where: { id: c.document2_id },
          select: { id: true, created_at: true, requirements: { select: { severity: true } } },
        }),
      ]);
      if (!doc1 || !doc2) {
        skipped++;
        continue;
      }

      let priorityDocumentId: string;
      let reason: string;

      if (c.conflict_type === 'SUPERSEDED') {
        // Newer regulation supersedes older.
        priorityDocumentId = doc1.created_at >= doc2.created_at ? doc1.id : doc2.id;
        reason = 'SUPERSEDED: newer document takes precedence';
      } else {
        // POTENTIAL: most-restrictive heuristic via max severity, tiebreak on recency.
        const sev1 = this.maxSeverityScore(doc1.requirements.map(r => r.severity));
        const sev2 = this.maxSeverityScore(doc2.requirements.map(r => r.severity));
        if (sev1 > sev2) {
          priorityDocumentId = doc1.id;
          reason = `POTENTIAL: doc1 has higher max severity (${sev1} vs ${sev2})`;
        } else if (sev2 > sev1) {
          priorityDocumentId = doc2.id;
          reason = `POTENTIAL: doc2 has higher max severity (${sev2} vs ${sev1})`;
        } else {
          priorityDocumentId = doc1.created_at >= doc2.created_at ? doc1.id : doc2.id;
          reason = `POTENTIAL: equal max severity (${sev1}); newer document chosen`;
        }
      }

      const { priorityRequirementId, losingRequirementId } = this.identifyPriorityRequirement(
        c,
        priorityDocumentId
      );

      await this.prisma.regulatory_conflicts.update({
        where: { id: c.id },
        data: {
          resolution_status: 'RESOLVED_PRIORITY',
          resolution_notes: `[auto] ${reason}; priority=${priorityDocumentId}`,
          resolved_by: actorUserId,
          resolved_at: new Date(),
          priority_document_id: priorityDocumentId,
          priority_requirement_id: priorityRequirementId,
        },
      });

      const cascade = losingRequirementId
        ? await this.cascadeOverride(losingRequirementId, c.id)
        : { requirements: 0, constraints: 0, triggers: 0 };

      const auditDetails = {
        conflictId: c.id,
        conflictType: c.conflict_type,
        resolution: 'RESOLVED_PRIORITY' as ConflictResolution,
        priorityDocumentId,
        priorityRequirementId,
        losingRequirementId,
        cascade,
        autoResolved: true,
        reason,
      };
      await this.createAuditEntry(c.document1_id, 'conflict_auto_resolved', actorUserId, 'system', auditDetails);
      await this.createAuditEntry(c.document2_id, 'conflict_auto_resolved', actorUserId, 'system', auditDetails);

      details.push({ conflictId: c.id, resolution: 'RESOLVED_PRIORITY', priorityDocumentId, reason });
    }

    return { resolved: details.length, skipped, details };
  }

  /**
   * Given a conflict and the chosen winning document, return the requirement IDs
   * for the winner (priority) and loser (to be deactivated). Returns nulls when
   * the conflict was not stored with requirement-level mapping (legacy rows).
   */
  private identifyPriorityRequirement(
    conflict: { document1_id: string; document2_id: string; requirement1_id: string | null; requirement2_id: string | null },
    priorityDocumentId: string
  ): { priorityRequirementId: string | null; losingRequirementId: string | null } {
    if (priorityDocumentId === conflict.document1_id) {
      return {
        priorityRequirementId: conflict.requirement1_id,
        losingRequirementId: conflict.requirement2_id,
      };
    }
    if (priorityDocumentId === conflict.document2_id) {
      return {
        priorityRequirementId: conflict.requirement2_id,
        losingRequirementId: conflict.requirement1_id,
      };
    }
    return { priorityRequirementId: null, losingRequirementId: null };
  }

  /**
   * Cascade-deactivate the losing requirement and any constraints/triggers
   * that derive from it. Stamps overridden_by_conflict_id on every row so
   * the override is auditable and reversible.
   *
   * Idempotent: re-running for the same (requirement, conflict) pair is safe.
   */
  private async cascadeOverride(
    losingRequirementId: string,
    conflictId: string
  ): Promise<{ requirements: number; constraints: number; triggers: number }> {
    const reqUpdate = await this.prisma.regulatory_requirements.updateMany({
      where: { id: losingRequirementId, overridden_by_conflict_id: null },
      data: { is_active: false, overridden_by_conflict_id: conflictId },
    });

    const constraintUpdate = await this.prisma.regulatory_constraints.updateMany({
      where: { requirement_id: losingRequirementId, overridden_by_conflict_id: null },
      data: { is_active: false, overridden_by_conflict_id: conflictId },
    });

    const triggerUpdate = await this.prisma.regulatory_triggers.updateMany({
      where: { requirement_id: losingRequirementId, overridden_by_conflict_id: null },
      data: { is_active: false, overridden_by_conflict_id: conflictId },
    });

    this.logger.info(
      `[RegulatoryAbsorbV2] Cascade override for conflict ${conflictId}: ` +
        `requirements=${reqUpdate.count}, constraints=${constraintUpdate.count}, triggers=${triggerUpdate.count}`
    );

    return {
      requirements: reqUpdate.count,
      constraints: constraintUpdate.count,
      triggers: triggerUpdate.count,
    };
  }

  /**
   * List unresolved DIRECT conflicts. The Sovereign OS surfaces these to admins
   * because they block document approval and require human/legal-counsel review.
   */
  async getPendingDirectConflicts(organizationId: string): Promise<ConflictV2[]> {
    const conflicts = await this.prisma.regulatory_conflicts.findMany({
      where: {
        organization_id: organizationId,
        conflict_type: 'DIRECT',
        resolution_status: 'UNRESOLVED',
      },
      orderBy: { created_at: 'desc' },
    });

    return conflicts.map(c => this.toConflictV2(c));
  }

  private buildResolutionNotes(decision: {
    resolution: ConflictResolution;
    priorityDocumentId?: string;
    notes?: string;
  }): string {
    const parts: string[] = [`resolution=${decision.resolution}`];
    if (decision.priorityDocumentId) parts.push(`priority=${decision.priorityDocumentId}`);
    if (decision.notes) parts.push(`notes=${decision.notes}`);
    return parts.join('; ');
  }

  private maxSeverityScore(severities: RegulatorySeverity[]): number {
    const rank: Record<RegulatorySeverity, number> = {
      CRITICAL: 5,
      HIGH: 4,
      MEDIUM: 3,
      LOW: 2,
      INFO: 1,
    };
    let max = 0;
    for (const s of severities) {
      const v = rank[s] ?? 0;
      if (v > max) max = v;
    }
    return max;
  }

  async getConflicts(organizationId: string): Promise<ConflictV2[]> {
    const conflicts = await this.prisma.regulatory_conflicts.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
    });

    return conflicts.map(c => this.toConflictV2(c));
  }

  private toConflictV2(c: {
    id: string;
    document1_id: string;
    document2_id: string;
    requirement1_id: string | null;
    requirement2_id: string | null;
    conflict_type: ConflictType;
    description: string;
    requirement1_summary: string | null;
    requirement2_summary: string | null;
    ai_recommendation: string | null;
    confidence_score: number | null;
    resolution_status: ConflictResolution;
    priority_document_id: string | null;
    priority_requirement_id: string | null;
  }): ConflictV2 {
    return {
      id: c.id,
      document1Id: c.document1_id,
      document2Id: c.document2_id,
      requirement1Id: c.requirement1_id || undefined,
      requirement2Id: c.requirement2_id || undefined,
      conflictType: c.conflict_type,
      description: c.description,
      requirement1Summary: c.requirement1_summary || undefined,
      requirement2Summary: c.requirement2_summary || undefined,
      aiRecommendation: c.ai_recommendation || undefined,
      confidenceScore: c.confidence_score || undefined,
      resolutionStatus: c.resolution_status,
      priorityDocumentId: c.priority_document_id || undefined,
      priorityRequirementId: c.priority_requirement_id || undefined,
    };
  }

  /**
   * Return constraints that are currently active for the org — excludes
   * inactive (pre-approval) and conflict-overridden constraints. This is the
   * read API the Council/Decision Gate should use when evaluating whether a
   * decision violates regulatory rules.
   */
  async getActiveConstraints(organizationId: string): Promise<ConstraintV2[]> {
    const rows = await this.prisma.regulatory_constraints.findMany({
      where: {
        is_active: true,
        overridden_by_conflict_id: null,
        document: {
          organization_id: organizationId,
          review_status: 'APPROVED',
        },
      },
    });
    return rows.map(c => ({
      id: c.id,
      name: c.name,
      description: c.description,
      constraintType: c.constraint_type,
      ruleExpression: c.rule_expression,
      appliesToAgents: c.applies_to_agents as string[],
      appliesToDecisions: c.applies_to_decisions as string[],
      isActive: c.is_active,
    }));
  }

  async queryKnowledge(organizationId: string, query: string): Promise<RequirementV2[]> {
    const requirements = await this.prisma.regulatory_requirements.findMany({
      where: {
        document: {
          organization_id: organizationId,
          review_status: 'APPROVED',
        },
        OR: [
          { title: { contains: query, mode: 'insensitive' } },
          { description: { contains: query, mode: 'insensitive' } },
          { category: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: { document: { select: { name: true } } },
    });

    return requirements.map(r => ({
      id: r.id,
      title: r.title,
      description: r.description,
      originalText: r.original_text,
      originalTextHash: r.original_text_hash,
      category: r.category,
      severity: r.severity,
      verificationScore: r.verification_score,
      verificationMethod: r.verification_method || 'none',
      isVerified: r.is_verified,
      deadline: r.deadline || undefined,
      penaltyAmount: r.penalty_amount || undefined,
      penaltyCurrency: r.penalty_currency || undefined,
      penaltyDescription: r.penalty_description || undefined,
      affectedProcesses: r.affected_processes as string[],
      affectedAgents: r.affected_agents as string[],
    }));
  }

  // ---------------------------------------------------------------------------
  // HELPER FUNCTIONS
  // ---------------------------------------------------------------------------

  private checkAccess(tier: SubscriptionTier, _organizationId: string): { allowed: boolean; reason?: string } {
    if (!featureGating.hasFeature(tier, 'regulatoryInstantAbsorb')) {
      return {
        allowed: false,
        reason: `Regulatory Instant-Absorb requires ${featureGating.getUpgradeTierForFeature('regulatoryInstantAbsorb')} tier or higher.`,
      };
    }
    return { allowed: true };
  }

  private async createAuditEntry(
    documentId: string,
    action: string,
    actorId: string | null,
    actorType: string,
    details: Record<string, unknown>
  ): Promise<void> {
    // Get previous entry for hash chain
    const previousEntry = await this.prisma.regulatory_audit_logs.findFirst({
      where: { document_id: documentId },
      orderBy: { created_at: 'desc' },
    });

    const timestamp = new Date();
    const entryHash = this.createAuditHash(
      previousEntry?.entry_hash || null,
      action,
      timestamp,
      details
    );

    await this.prisma.regulatory_audit_logs.create({
      data: {
        document_id: documentId,
        action,
        actor_id: actorId,
        actor_type: actorType,
        details: details as any,
        previous_hash: previousEntry?.entry_hash,
        entry_hash: entryHash,
        created_at: timestamp,
      },
    });
  }

  private extractPenalties(documentText: string): PenaltyInfoV2[] {
    const penalties: PenaltyInfoV2[] = [];
    
    // Common penalty patterns
    const patterns = [
      /(?:fine|penalty|sanction).*?(?:up to|maximum|not exceed).*?(\$|€|£|USD|EUR|GBP)?\s*([\d,]+(?:\.\d{2})?)\s*(?:million|billion|thousand)?/gi,
      /(\d+(?:,\d{3})*(?:\.\d{2})?)\s*(?:\$|€|£|USD|EUR|GBP).*?(?:fine|penalty|sanction)/gi,
    ];

    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(documentText)) !== null) {
        const context = documentText.substring(
          Math.max(0, match.index - 100),
          Math.min(documentText.length, match.index + match[0].length + 100)
        );
        
        penalties.push({
          violation: 'Regulatory violation',
          maxPenalty: match[2] || match[1] || 'Unknown',
          currency: match[1]?.replace(/[\d,.\s]/g, '') || 'USD',
          description: context.trim(),
        });
      }
    }

    return penalties.slice(0, 10); // Limit to 10 penalties
  }

  private generateVerificationRecommendations(requirements: RequirementV2[], risk: 'low' | 'medium' | 'high'): string[] {
    const recommendations: string[] = [];

    if (risk === 'high') {
      recommendations.push('⚠️ High hallucination risk detected. Manual review strongly recommended before approval.');
      recommendations.push('Consider re-uploading with a cleaner document format (plain text or well-structured PDF).');
    }

    const unverified = requirements.filter(r => !r.isVerified);
    if (unverified.length > 0) {
      recommendations.push(`${unverified.length} requirement(s) could not be verified against source text. Review these manually.`);
    }

    const criticalUnverified = requirements.filter(r => r.severity === 'CRITICAL' && !r.isVerified);
    if (criticalUnverified.length > 0) {
      recommendations.push(`⚠️ ${criticalUnverified.length} CRITICAL requirement(s) are unverified. Do not approve without manual verification.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('✅ All requirements verified against source document. Safe to proceed with review.');
    }

    return recommendations;
  }
}

// Export singleton instance
export const regulatoryAbsorbV2Service = new RegulatoryAbsorbV2Service();
