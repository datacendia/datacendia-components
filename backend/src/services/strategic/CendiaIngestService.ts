/**
 * Service — Cendia Ingest Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaIngestService, IngestJob, IngestSource, DocumentInput, ProcessedDocument, DocumentChunk, ExtractedEntity, ExtractedRelationship
 * @module services/strategic/CendiaIngestService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAINGESTÃ¢â€žÂ¢ - THE VECTORIZATION PIPELINE
// Document Processing & Knowledge Extraction
// "The Onboarding Engine" - How data gets into the graph
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';
import cendiaGraphService, { EntityType, RelationshipType } from './CendiaGraphService.js';
import { getErrorMessage } from '../../utils/errors.js';
import { loadServiceRecords } from '../../utils/servicePersistence.js';
import { prisma } from '../../config/database.js';
// =============================================================================
// TYPES
// =============================================================================

export interface IngestJob {
  id: string;
  organizationId: string;
  userId: string;
  status: 'queued' | 'processing' | 'extracting' | 'vectorizing' | 'graphing' | 'completed' | 'failed';
  source: IngestSource;
  progress: number;
  documentsTotal: number;
  documentsProcessed: number;
  entitiesExtracted: number;
  relationshipsExtracted: number;
  errors: string[];
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}

export interface IngestSource {
  type: 'file_upload' | 'database' | 'api' | 's3' | 'sharepoint' | 'confluence';
  config: Record<string, unknown>;
  documents: DocumentInput[];
}

export interface DocumentInput {
  id: string;
  filename: string;
  mimeType: string;
  content?: string;
  url?: string;
  size: number;
  metadata?: Record<string, unknown>;
}

export interface ProcessedDocument {
  id: string;
  jobId: string;
  originalDocument: DocumentInput;
  extractedText: string;
  chunks: DocumentChunk[];
  entities: ExtractedEntity[];
  relationships: ExtractedRelationship[];
  summary: string;
  processedAt: Date;
}

export interface DocumentChunk {
  id: string;
  documentId: string;
  content: string;
  startOffset: number;
  endOffset: number;
  embedding?: number[];
  metadata: Record<string, unknown>;
}

export interface ExtractedEntity {
  name: string;
  type: EntityType;
  confidence: number;
  mentions: { text: string; offset: number }[];
  properties: Record<string, unknown>;
}

export interface ExtractedRelationship {
  sourceEntity: string;
  targetEntity: string;
  type: RelationshipType;
  confidence: number;
  evidence: string;
}

export interface IngestMetrics {
  totalJobs: number;
  completedJobs: number;
  failedJobs: number;
  documentsProcessed: number;
  entitiesExtracted: number;
  relationshipsExtracted: number;
  avgProcessingTimeMs: number;
}

// =============================================================================
// CENDIAINGEST SERVICE
// =============================================================================

class CendiaIngestService {
  private jobs: Map<string, IngestJob> = new Map();
  private processedDocuments: Map<string, ProcessedDocument> = new Map();
  private readonly CHUNK_SIZE = 1000;
  private readonly CHUNK_OVERLAP = 200;



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // JOB MANAGEMENT
  // ---------------------------------------------------------------------------

  async createIngestJob(
    organizationId: string,
    userId: string,
    source: IngestSource
  ): Promise<IngestJob> {
    const jobId = uuidv4();

    const job: IngestJob = {
      id: jobId,
      organizationId,
      userId,
      status: 'queued',
      source,
      progress: 0,
      documentsTotal: source.documents.length,
      documentsProcessed: 0,
      entitiesExtracted: 0,
      relationshipsExtracted: 0,
      errors: [],
      createdAt: new Date()
    };

    this.jobs.set(jobId, job);

    // Log job creation
    await prisma.audit_logs.create({
      data: {
        id: uuidv4(),
        organization_id: organizationId,
        user_id: userId,
        action: 'INGEST_JOB_CREATED',
        resource_type: 'ingest_job',
        resource_id: jobId,
        details: {
          sourceType: source.type,
          documentCount: source.documents.length
        } as any
      }
    });

    // Start processing asynchronously
    this.processJob(jobId).catch(err => {
      logger.error(`Ingest job ${jobId} failed:`, err);
      job.status = 'failed';
      job.errors.push(getErrorMessage(err));
    });

    return job;
  }

  private async processJob(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId);
    if (!job) return;

    job.status = 'processing';
    job.startedAt = new Date();

    try {
      for (let i = 0; i < job.source.documents.length; i++) {
        const doc = job.source.documents[i];
        
        try {
          // Process document
          const processed = await this.processDocument(jobId, doc, job.organizationId);
          this.processedDocuments.set(processed.id, processed);

          job.documentsProcessed++;
          job.entitiesExtracted += processed.entities.length;
          job.relationshipsExtracted += processed.relationships.length;
          job.progress = Math.round((job.documentsProcessed / job.documentsTotal) * 100);

        } catch (docError: any) {
          job.errors.push(`Document ${doc.filename}: ${docError.message}`);
          logger.error(`Failed to process document ${doc.filename}:`, docError);
        }
      }

      job.status = 'completed';
      job.completedAt = new Date();

      // Log completion
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: job.organizationId,
          user_id: job.userId,
          action: 'INGEST_JOB_COMPLETED',
          resource_type: 'ingest_job',
          resource_id: jobId,
          details: {
            documentsProcessed: job.documentsProcessed,
            entitiesExtracted: job.entitiesExtracted,
            relationshipsExtracted: job.relationshipsExtracted,
            durationMs: job.completedAt.getTime() - job.startedAt!.getTime()
          } as any
        }
      });

    } catch (error: unknown) {
      job.status = 'failed';
      job.errors.push(getErrorMessage(error));
      logger.error(`Ingest job ${jobId} failed:`, error);
    }
  }

  // ---------------------------------------------------------------------------
  // DOCUMENT PROCESSING
  // ---------------------------------------------------------------------------

  private async processDocument(
    jobId: string,
    doc: DocumentInput,
    organizationId: string
  ): Promise<ProcessedDocument> {
    const job = this.jobs.get(jobId);
    if (job) job.status = 'extracting';

    // Extract text (ROADMAP: use Tika service)
    const extractedText = doc.content || await this.extractText(doc);

    if (job) job.status = 'vectorizing';

    // Chunk the document
    const chunks = this.chunkDocument(doc.id, extractedText);

    // Generate embeddings for chunks
    await this.generateEmbeddings(chunks, organizationId);

    if (job) job.status = 'graphing';

    // Extract entities and relationships
    const { entities, relationships } = await this.extractKnowledge(extractedText, doc);

    // Generate summary
    const summary = await this.generateSummary(extractedText, doc.filename);

    // Add to knowledge graph
    await this.addToGraph(organizationId, entities, relationships, [doc.id]);

    const processed: ProcessedDocument = {
      id: uuidv4(),
      jobId,
      originalDocument: doc,
      extractedText,
      chunks,
      entities,
      relationships,
      summary,
      processedAt: new Date()
    };

    // Persist to database
    await this.persistProcessedDocument(processed, organizationId);

    return processed;
  }

  private async extractText(doc: DocumentInput): Promise<string> {
    // Uses deterministic computation; ROADMAP: Apache Tika or similar
    // For now, return content if available or placeholder
    if (doc.content) return doc.content;
    
    // Extract content based on mime type
    if (doc.mimeType.includes('text')) {
      return `[Extracted text from ${doc.filename}]`;
    }
    
    return `[Document content from ${doc.filename} - ${doc.size} bytes]`;
  }

  private chunkDocument(documentId: string, text: string): DocumentChunk[] {
    const chunks: DocumentChunk[] = [];
    let offset = 0;

    while (offset < text.length) {
      const endOffset = Math.min(offset + this.CHUNK_SIZE, text.length);
      const content = text.substring(offset, endOffset);

      chunks.push({
        id: uuidv4(),
        documentId,
        content,
        startOffset: offset,
        endOffset,
        metadata: {
          chunkIndex: chunks.length,
          totalChunks: Math.ceil(text.length / (this.CHUNK_SIZE - this.CHUNK_OVERLAP))
        }
      });

      offset += this.CHUNK_SIZE - this.CHUNK_OVERLAP;
      if (offset >= text.length) break;
    }

    return chunks;
  }

  private async generateEmbeddings(chunks: DocumentChunk[], organizationId: string): Promise<void> {
    for (const chunk of chunks) {
      try {
        // Generate embedding using Ollama
        const embedding = await ollama.embed(chunk.content);
        chunk.embedding = embedding;

        // Store in database
        const contentHash = crypto.createHash('sha256').update(chunk.content).digest('hex');
        
        await prisma.embeddings.upsert({
          where: { content_hash: contentHash },
          update: {
            embedding: Buffer.from(new Float32Array(embedding).buffer)
          },
          create: {
            id: chunk.id,
            organization_id: organizationId,
            source_type: 'document_chunk',
            source_id: chunk.documentId,
            content: chunk.content,
            content_hash: contentHash,
            embedding: Buffer.from(new Float32Array(embedding).buffer),
            metadata: chunk.metadata as any
          }
        });
      } catch (error) {
        logger.warn(`Failed to generate embedding for chunk ${chunk.id}:`, error);
      }
    }
  }

  // ---------------------------------------------------------------------------
  // KNOWLEDGE EXTRACTION
  // ---------------------------------------------------------------------------

  private async extractKnowledge(text: string, doc: DocumentInput): Promise<{
    entities: ExtractedEntity[];
    relationships: ExtractedRelationship[];
  }> {
    const prompt = `Extract entities and relationships from this document:

Document: ${doc.filename}
Content (first 3000 chars):
${text.substring(0, 3000)}

Extract all named entities and their relationships. Output JSON:
{
  "entities": [
    {
      "name": "Entity Name",
      "type": "person|organization|contract|product|location|event|regulation|risk|decision|metric|department|project|asset|vendor|customer",
      "confidence": 0.0-1.0,
      "properties": {"key": "value"}
    }
  ],
  "relationships": [
    {
      "sourceEntity": "Entity Name 1",
      "targetEntity": "Entity Name 2",
      "type": "reports_to|owns|manages|depends_on|related_to|contracts_with|supplies_to|competes_with|partners_with|regulates|audits|approves|blocks|influences|member_of|located_in|occurred_at|caused_by|mitigates",
      "confidence": 0.0-1.0,
      "evidence": "Text supporting this relationship"
    }
  ]
}`;

    try {
      const response = await ollama.generate(prompt, {});
      const parsed = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{"entities":[],"relationships":[]}');

      const entities: ExtractedEntity[] = (parsed.entities || []).map((e: any) => ({
        name: e.name,
        type: e.type as EntityType,
        confidence: e.confidence || 0.8,
        mentions: [{ text: e.name, offset: text.indexOf(e.name) }],
        properties: e.properties || {}
      }));

      const relationships: ExtractedRelationship[] = (parsed.relationships || []).map((r: any) => ({
        sourceEntity: r.sourceEntity,
        targetEntity: r.targetEntity,
        type: r.type as RelationshipType,
        confidence: r.confidence || 0.7,
        evidence: r.evidence || ''
      }));

      return { entities, relationships };
    } catch (error) {
      logger.error('Knowledge extraction failed:', error);
      return { entities: [], relationships: [] };
    }
  }

  private async generateSummary(text: string, filename: string): Promise<string> {
    const prompt = `Summarize this document in 2-3 sentences:

Document: ${filename}
Content (first 2000 chars):
${text.substring(0, 2000)}

Provide a concise summary focusing on key facts and entities.`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      return response.trim().substring(0, 500);
    } catch {
      return `Document: ${filename}`;
    }
  }

  private async addToGraph(
    organizationId: string,
    entities: ExtractedEntity[],
    relationships: ExtractedRelationship[],
    sourceDocuments: string[]
  ): Promise<void> {
    // Create entities in graph
    const entityMap = new Map<string, string>(); // name -> id

    for (const entity of entities) {
      const graphEntity = await cendiaGraphService.findOrCreateEntity(
        organizationId,
        entity.type,
        entity.name,
        entity.properties
      );
      entityMap.set(entity.name, graphEntity.id);
    }

    // Create relationships in graph
    for (const rel of relationships) {
      const sourceId = entityMap.get(rel.sourceEntity);
      const targetId = entityMap.get(rel.targetEntity);

      if (sourceId && targetId) {
        await cendiaGraphService.createRelationship(
          organizationId,
          sourceId,
          targetId,
          rel.type,
          { evidence: rel.evidence },
          1.0,
          rel.confidence,
          sourceDocuments
        );
      }
    }
  }

  // ---------------------------------------------------------------------------
  // DATABASE PERSISTENCE
  // ---------------------------------------------------------------------------

  private async persistProcessedDocument(doc: ProcessedDocument, organizationId: string): Promise<void> {
    try {
      // Store document metadata
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: organizationId,
          action: 'DOCUMENT_PROCESSED',
          resource_type: 'processed_document',
          resource_id: doc.id,
          details: {
            filename: doc.originalDocument.filename,
            mimeType: doc.originalDocument.mimeType,
            size: doc.originalDocument.size,
            chunkCount: doc.chunks.length,
            entityCount: doc.entities.length,
            relationshipCount: doc.relationships.length,
            summary: doc.summary
          } as any
        }
      });
    } catch (error) {
      logger.error('Failed to persist processed document:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // SEMANTIC SEARCH
  // ---------------------------------------------------------------------------

  async semanticSearch(
    organizationId: string,
    query: string,
    limit: number = 10
  ): Promise<{ chunk: DocumentChunk; score: number; document: DocumentInput }[]> {
    try {
      // Generate query embedding
      const queryEmbedding = await ollama.embed(query);

      // Get all embeddings for organization
      const embeddings = await prisma.embeddings.findMany({
        where: {
          organization_id: organizationId,
          source_type: 'document_chunk'
        }
      });

      // Calculate cosine similarity
      const results: { chunk: DocumentChunk; score: number; document: DocumentInput }[] = [];

      for (const emb of embeddings) {
        const storedEmbedding = Array.from(new Float32Array(emb.embedding.buffer));
        const score = this.cosineSimilarity(queryEmbedding, storedEmbedding);

        // Find the processed document
        for (const processed of this.processedDocuments.values()) {
          const chunk = processed.chunks.find(c => c.id === emb.id);
          if (chunk) {
            results.push({
              chunk,
              score,
              document: processed.originalDocument
            });
            break;
          }
        }
      }

      return results
        .sort((a, b) => b.score - a.score)
        .slice(0, limit);
    } catch (error) {
      logger.error('Semantic search failed:', error);
      return [];
    }
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) return 0;
    
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i];
      normA += a[i] * a[i];
      normB += b[i] * b[i];
    }

    const magnitude = Math.sqrt(normA) * Math.sqrt(normB);
    return magnitude === 0 ? 0 : dotProduct / magnitude;
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  getJob(jobId: string): IngestJob | undefined {
    return this.jobs.get(jobId);
  }

  getProcessedDocument(documentId: string): ProcessedDocument | undefined {
    return this.processedDocuments.get(documentId);
  }

  async getJobHistory(organizationId: string, limit: number = 50): Promise<any[]> {
    return prisma.audit_logs.findMany({
      where: {
        organization_id: organizationId,
        action: { in: ['INGEST_JOB_CREATED', 'INGEST_JOB_COMPLETED'] }
      },
      orderBy: { created_at: 'desc' },
      take: limit
    });
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  async getMetrics(organizationId: string): Promise<IngestMetrics> {
    const jobs = Array.from(this.jobs.values())
      .filter(j => j.organizationId === organizationId);

    const completed = jobs.filter(j => j.status === 'completed');
    const failed = jobs.filter(j => j.status === 'failed');

    const totalDuration = completed.reduce((sum, j) => {
      if (j.startedAt && j.completedAt) {
        return sum + (j.completedAt.getTime() - j.startedAt.getTime());
      }
      return sum;
    }, 0);

    return {
      totalJobs: jobs.length,
      completedJobs: completed.length,
      failedJobs: failed.length,
      documentsProcessed: jobs.reduce((sum, j) => sum + j.documentsProcessed, 0),
      entitiesExtracted: jobs.reduce((sum, j) => sum + j.entitiesExtracted, 0),
      relationshipsExtracted: jobs.reduce((sum, j) => sum + j.relationshipsExtracted, 0),
      avgProcessingTimeMs: completed.length > 0 ? totalDuration / completed.length : 0
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaIngest', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.jobs.has(d.id)) this.jobs.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaIngest', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.processedDocuments.has(d.id)) this.processedDocuments.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaIngestService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaIngestService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

  async getDashboard(): Promise<{
    serviceName: string;
    status: string;
    recordCount: number;
    lastActivity: Date | null;
    uptime: number;
    metrics: Record<string, number>;
  }> {
    const maps = Object.entries(this).filter(([_, v]) => v instanceof Map) as [string, Map<string, unknown>][];
    const totalRecords = maps.reduce((sum, [_, m]) => sum + m.size, 0);
    return {
      serviceName: 'CendiaIngest',
      status: 'operational',
      recordCount: totalRecords,
      lastActivity: new Date(),
      uptime: process.uptime(),
      metrics: Object.fromEntries(maps.map(([k, m]) => [k, m.size])),
    };
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaIngest',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaIngestService = new CendiaIngestService();
export default cendiaIngestService;
