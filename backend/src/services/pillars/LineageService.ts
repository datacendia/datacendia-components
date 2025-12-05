// =============================================================================
// DATACENDIA PLATFORM - THE LINEAGE SERVICE
// Data Provenance - Track data origins and transformations
// Enterprise Platinum Intelligence - PostgreSQL Persistent Storage
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export type EntityType = 'dataset' | 'table' | 'column' | 'report' | 'metric' | 'model' | 'pipeline' | 'api';
export type RelationshipType = 'derives_from' | 'transforms_to' | 'depends_on' | 'feeds' | 'uses';
export type DataQualityLevel = 'excellent' | 'good' | 'fair' | 'poor' | 'unknown';

export interface LineageEntity {
  id: string;
  organizationId: string;
  name: string;
  type: EntityType;
  description: string;
  source: string;
  schema?: Record<string, string>;
  qualityScore: number;
  qualityLevel: DataQualityLevel;
  lastUpdated: Date;
  recordCount?: number;
  metadata: Record<string, unknown>;
}

export interface LineageRelationship {
  id: string;
  sourceId: string;
  targetId: string;
  type: RelationshipType;
  transformations?: string[];
  confidence: number;
  createdAt: Date;
}

export interface LineageGraph {
  entities: LineageEntity[];
  relationships: LineageRelationship[];
  rootEntities: string[];
  leafEntities: string[];
}

export interface DataQualityReport {
  entityId: string;
  entityName: string;
  overallScore: number;
  dimensions: {
    completeness: number;
    accuracy: number;
    consistency: number;
    timeliness: number;
    validity: number;
  };
  issues: DataQualityIssue[];
  lastChecked: Date;
}

export interface DataQualityIssue {
  id: string;
  type: 'missing' | 'invalid' | 'inconsistent' | 'stale' | 'duplicate';
  severity: 'high' | 'medium' | 'low';
  field?: string;
  description: string;
  affectedRecords: number;
  suggestedFix?: string;
}

// Prisma enum mapping
const entityTypeMap: Record<EntityType, string> = {
  dataset: 'DATASET', table: 'TABLE', column: 'COLUMN', report: 'REPORT',
  metric: 'METRIC', model: 'MODEL', pipeline: 'PIPELINE', api: 'API'
};
const reverseEntityTypeMap: Record<string, EntityType> = Object.fromEntries(
  Object.entries(entityTypeMap).map(([k, v]) => [v, k as EntityType])
);
const relTypeMap: Record<RelationshipType, string> = {
  derives_from: 'DERIVES_FROM', transforms_to: 'TRANSFORMS_TO',
  depends_on: 'DEPENDS_ON', feeds: 'FEEDS', uses: 'USES'
};
const reverseRelTypeMap: Record<string, RelationshipType> = Object.fromEntries(
  Object.entries(relTypeMap).map(([k, v]) => [v, k as RelationshipType])
);
const qualityLevelMap: Record<DataQualityLevel, string> = {
  excellent: 'EXCELLENT', good: 'GOOD', fair: 'FAIR', poor: 'POOR', unknown: 'UNKNOWN'
};
const reverseQualityLevelMap: Record<string, DataQualityLevel> = Object.fromEntries(
  Object.entries(qualityLevelMap).map(([k, v]) => [v, k as DataQualityLevel])
);

// =============================================================================
// THE LINEAGE SERVICE - PRISMA BACKED
// =============================================================================

export class LineageService extends BaseService {
  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'lineage-service',
      version: '2.0.0',
      dependencies: ['prisma'],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Lineage service initializing with PostgreSQL...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Lineage service shutting down...');
  }

  async healthCheck(): Promise<ServiceHealth> {
    const entityCount = await prisma.lineage_entities.count();
    const relCount = await prisma.lineage_relationships.count();
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { entities: entityCount, relationships: relCount },
    };
  }

  // ===========================================================================
  // ENTITY MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async createEntity(entity: Omit<LineageEntity, 'id' | 'qualityLevel' | 'lastUpdated'>): Promise<LineageEntity> {
    const qualityLevel = this.scoreToLevel(entity.qualityScore);
    
    const created = await prisma.lineage_entities.create({
      data: {
        organization_id: entity.organizationId,
        name: entity.name,
        entity_type: entityTypeMap[entity.type] as any,
        description: entity.description || '',
        source: entity.source,
        schema_def: entity.schema || {},
        quality_score: entity.qualityScore,
        quality_level: qualityLevelMap[qualityLevel] as any,
        record_count: entity.recordCount,
        metadata: entity.metadata || {},
      },
    });

    return this.mapEntity(created);
  }

  async getEntity(entityId: string): Promise<LineageEntity | null> {
    const entity = await prisma.lineage_entities.findUnique({
      where: { id: entityId },
    });
    return entity ? this.mapEntity(entity) : null;
  }

  async getEntities(organizationId: string, type?: EntityType): Promise<LineageEntity[]> {
    const where: any = { organization_id: organizationId };
    if (type) where.entity_type = entityTypeMap[type];

    const entities = await prisma.lineage_entities.findMany({ where });
    return entities.map((e: any) => this.mapEntity(e));
  }

  async updateEntity(entityId: string, updates: Partial<LineageEntity>): Promise<LineageEntity | null> {
    const data: any = {};
    if (updates.name) data.name = updates.name;
    if (updates.description) data.description = updates.description;
    if (updates.source) data.source = updates.source;
    if (updates.qualityScore !== undefined) {
      data.quality_score = updates.qualityScore;
      data.quality_level = qualityLevelMap[this.scoreToLevel(updates.qualityScore)] as any;
    }
    if (updates.recordCount !== undefined) data.record_count = updates.recordCount;
    if (updates.metadata) data.metadata = updates.metadata;

    const updated = await prisma.lineage_entities.update({
      where: { id: entityId },
      data,
    });

    return this.mapEntity(updated);
  }

  // ===========================================================================
  // RELATIONSHIP MANAGEMENT - PRISMA BACKED
  // ===========================================================================

  async createRelationship(relationship: Omit<LineageRelationship, 'id' | 'createdAt'>): Promise<LineageRelationship> {
    const created = await prisma.lineage_relationships.create({
      data: {
        source_id: relationship.sourceId,
        target_id: relationship.targetId,
        relationship_type: relTypeMap[relationship.type] as any,
        transformations: relationship.transformations || [],
        confidence: relationship.confidence,
      },
    });

    return this.mapRelationship(created);
  }

  async getUpstream(entityId: string): Promise<LineageEntity[]> {
    const relationships = await prisma.lineage_relationships.findMany({
      where: { target_id: entityId },
      include: { source_entity: true },
    });
    
    return relationships.map((r: any) => this.mapEntity(r.sourceEntity));
  }

  async getDownstream(entityId: string): Promise<LineageEntity[]> {
    const relationships = await prisma.lineage_relationships.findMany({
      where: { source_id: entityId },
      include: { target_entity: true },
    });
    
    return relationships.map((r: any) => this.mapEntity(r.targetEntity));
  }

  // ===========================================================================
  // LINEAGE GRAPH - PRISMA BACKED
  // ===========================================================================

  async getLineageGraph(organizationId: string): Promise<LineageGraph> {
    const entities = await this.getEntities(organizationId);
    const entityIds = entities.map(e => e.id);
    
    const relationships = await prisma.lineage_relationships.findMany({
      where: {
        AND: [
          { source_id: { in: entityIds } },
          { target_id: { in: entityIds } },
        ],
      },
    });

    const rels = relationships.map((r: any) => this.mapRelationship(r));
    const targetIds = new Set(rels.map(r => r.targetId));
    const sourceIds = new Set(rels.map(r => r.sourceId));

    return {
      entities,
      relationships: rels,
      rootEntities: entities.filter(e => !targetIds.has(e.id)).map(e => e.id),
      leafEntities: entities.filter(e => !sourceIds.has(e.id)).map(e => e.id),
    };
  }

  async traceLineage(entityId: string, direction: 'upstream' | 'downstream' | 'both'): Promise<LineageGraph> {
    const visited = new Set<string>();
    const entities: LineageEntity[] = [];
    const relationships: LineageRelationship[] = [];

    const traverse = async (id: string, dir: 'upstream' | 'downstream') => {
      if (visited.has(id)) return;
      visited.add(id);

      const entity = await this.getEntity(id);
      if (!entity) return;
      entities.push(entity);

      const rels = dir === 'upstream'
        ? await prisma.lineage_relationships.findMany({ where: { target_id: id } })
        : await prisma.lineage_relationships.findMany({ where: { source_id: id } });

      for (const rel of rels) {
        relationships.push(this.mapRelationship(rel));
        const nextId = dir === 'upstream' ? rel.source_id : rel.target_id;
        await traverse(nextId, dir);
      }
    };

    if (direction === 'upstream' || direction === 'both') {
      await traverse(entityId, 'upstream');
    }
    
    visited.clear();
    
    if (direction === 'downstream' || direction === 'both') {
      await traverse(entityId, 'downstream');
    }

    return { entities, relationships, rootEntities: [], leafEntities: [] };
  }

  // ===========================================================================
  // DATA QUALITY - PRISMA BACKED
  // ===========================================================================

  async checkDataQuality(entityId: string): Promise<DataQualityReport> {
    const entity = await this.getEntity(entityId);
    if (!entity) throw new Error('Entity not found');

    // Real quality check would analyze actual data
    // For now, we compute based on entity metadata patterns
    const hasSchema = entity.schema && Object.keys(entity.schema).length > 0;
    const hasRecordCount = entity.recordCount && entity.recordCount > 0;
    
    const completeness = hasSchema ? 95 : 80;
    const accuracy = hasRecordCount ? 92 : 85;
    const consistency = 90;
    const timeliness = entity.lastUpdated > new Date(Date.now() - 86400000) ? 95 : 75;
    const validity = hasSchema ? 93 : 82;

    const overallScore = (completeness + accuracy + consistency + timeliness + validity) / 5;
    const issues: DataQualityIssue[] = [];

    if (completeness < 90) {
      issues.push({
        id: `issue-${Date.now()}-1`,
        type: 'missing',
        severity: 'medium',
        description: 'Schema definition incomplete',
        affectedRecords: 0,
        suggestedFix: 'Add schema definition to entity',
      });
    }

    // Store report in database
    await prisma.data_quality_reports.upsert({
      where: { entity_id: entityId },
      update: {
        overall_score: overallScore,
        completeness, accuracy, consistency, timeliness, validity,
        issues: issues as any,
        checked_at: new Date(),
      },
      create: {
        entity_id: entityId,
        overall_score: overallScore,
        completeness, accuracy, consistency, timeliness, validity,
        issues: issues as any,
      },
    });

    return {
      entityId,
      entityName: entity.name,
      overallScore: Math.round(overallScore),
      dimensions: { completeness, accuracy, consistency, timeliness, validity },
      issues,
      lastChecked: new Date(),
    };
  }

  async getQualityReport(entityId: string): Promise<DataQualityReport | null> {
    const report = await prisma.data_quality_reports.findFirst({
      where: { entity_id: entityId },
      include: { entity: true },
    });
    
    if (!report) return null;

    return {
      entityId: report.entity_id,
      entityName: (report as any).entity?.name || 'Unknown',
      overallScore: report.overall_score,
      dimensions: {
        completeness: report.completeness,
        accuracy: report.accuracy,
        consistency: report.consistency,
        timeliness: report.timeliness,
        validity: report.validity,
      },
      issues: (report.issues as any) || [],
      lastChecked: report.checked_at,
    };
  }

  async getQualityOverview(organizationId: string): Promise<{
    avgScore: number;
    totalEntities: number;
    byLevel: Record<DataQualityLevel, number>;
    recentIssues: DataQualityIssue[];
  }> {
    const entities = await this.getEntities(organizationId);
    const byLevel: Record<DataQualityLevel, number> = {
      excellent: 0, good: 0, fair: 0, poor: 0, unknown: 0
    };

    let totalScore = 0;
    const recentIssues: DataQualityIssue[] = [];

    for (const entity of entities) {
      byLevel[entity.qualityLevel]++;
      totalScore += entity.qualityScore;
    }

    // Get recent quality reports with issues
    const reports = await prisma.data_quality_reports.findMany({
      where: { entity_id: { in: entities.map(e => e.id) } },
      orderBy: { checked_at: 'desc' },
      take: 10,
    });

    for (const report of reports) {
      const issues = (report.issues as any[]) || [];
      recentIssues.push(...issues);
    }

    return {
      avgScore: entities.length > 0 ? Math.round(totalScore / entities.length) : 0,
      totalEntities: entities.length,
      byLevel,
      recentIssues: recentIssues.slice(0, 10),
    };
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private scoreToLevel(score: number): DataQualityLevel {
    if (score >= 95) return 'excellent';
    if (score >= 85) return 'good';
    if (score >= 70) return 'fair';
    if (score >= 50) return 'poor';
    return 'unknown';
  }

  private mapEntity(e: any): LineageEntity {
    return {
      id: e.id,
      organizationId: e.organizationId,
      name: e.name,
      type: reverseEntityTypeMap[e.entityType] || 'dataset',
      description: e.description || '',
      source: e.source,
      schema: e.schemaDef as Record<string, string>,
      qualityScore: e.qualityScore,
      qualityLevel: reverseQualityLevelMap[e.qualityLevel] || 'unknown',
      lastUpdated: e.updatedAt,
      recordCount: e.recordCount,
      metadata: e.metadata as Record<string, unknown>,
    };
  }

  private mapRelationship(r: any): LineageRelationship {
    return {
      id: r.id,
      sourceId: r.sourceId,
      targetId: r.targetId,
      type: reverseRelTypeMap[r.relationshipType] || 'depends_on',
      transformations: r.transformations as string[],
      confidence: r.confidence,
      createdAt: r.createdAt,
    };
  }

  // No seed method - Enterprise Platinum standard
  // Data is created only through real API operations

  // ===========================================================================
  // CLIENT API METHODS
  // ===========================================================================

  async getDataSources(organizationId: string): Promise<LineageEntity[]> {
    return this.getEntities(organizationId, 'dataset');
  }

  async traceDataFlow(sourceId: string): Promise<{ upstream: LineageEntity[]; downstream: LineageEntity[] }> {
    const upstream = await this.getUpstream(sourceId);
    const downstream = await this.getDownstream(sourceId);
    return { upstream, downstream };
  }
}

export const lineageService = new LineageService();
