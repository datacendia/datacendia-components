// =============================================================================
// DATACENDIA PLATFORM - THE LINEAGE SERVICE
// Data Provenance - Track data origins and transformations
// Enterprise Platinum Intelligence
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../../core/services/BaseService.js';

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

// =============================================================================
// THE LINEAGE SERVICE
// =============================================================================

export class LineageService extends BaseService {
  private entitiesStore: Map<string, LineageEntity> = new Map();
  private relationshipsStore: Map<string, LineageRelationship> = new Map();
  private qualityReportsStore: Map<string, DataQualityReport> = new Map();

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'lineage-service',
      version: '1.0.0',
      dependencies: [],
      ...config,
    });
  }

  async initialize(): Promise<void> {
    this.logger.info('The Lineage service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('The Lineage service shutting down...');
    this.entitiesStore.clear();
    this.relationshipsStore.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { 
        entities: this.entitiesStore.size, 
        relationships: this.relationshipsStore.size 
      },
    };
  }

  // ===========================================================================
  // ENTITY MANAGEMENT
  // ===========================================================================

  async createEntity(entity: Omit<LineageEntity, 'id' | 'qualityLevel' | 'lastUpdated'>): Promise<LineageEntity> {
    const id = `entity-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
    const qualityLevel = this.scoreToLevel(entity.qualityScore);

    const newEntity: LineageEntity = {
      ...entity,
      id,
      qualityLevel,
      lastUpdated: new Date(),
    };

    this.entitiesStore.set(id, newEntity);
    return newEntity;
  }

  async getEntity(entityId: string): Promise<LineageEntity | null> {
    return this.entitiesStore.get(entityId) || null;
  }

  async getEntities(organizationId: string, type?: EntityType): Promise<LineageEntity[]> {
    const entities = Array.from(this.entitiesStore.values())
      .filter(e => e.organizationId === organizationId);
    return type ? entities.filter(e => e.type === type) : entities;
  }

  async updateEntity(entityId: string, updates: Partial<LineageEntity>): Promise<LineageEntity | null> {
    const entity = this.entitiesStore.get(entityId);
    if (!entity) return null;

    const updated = { ...entity, ...updates, lastUpdated: new Date() };
    if (updates.qualityScore !== undefined) {
      updated.qualityLevel = this.scoreToLevel(updates.qualityScore);
    }
    this.entitiesStore.set(entityId, updated);
    return updated;
  }

  // ===========================================================================
  // RELATIONSHIP MANAGEMENT
  // ===========================================================================

  async createRelationship(relationship: Omit<LineageRelationship, 'id' | 'createdAt'>): Promise<LineageRelationship> {
    const id = `rel-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;

    const newRelationship: LineageRelationship = {
      ...relationship,
      id,
      createdAt: new Date(),
    };

    this.relationshipsStore.set(id, newRelationship);
    return newRelationship;
  }

  async getUpstream(entityId: string): Promise<LineageEntity[]> {
    const relationships = Array.from(this.relationshipsStore.values())
      .filter(r => r.targetId === entityId);
    
    return relationships
      .map(r => this.entitiesStore.get(r.sourceId))
      .filter((e): e is LineageEntity => e !== undefined);
  }

  async getDownstream(entityId: string): Promise<LineageEntity[]> {
    const relationships = Array.from(this.relationshipsStore.values())
      .filter(r => r.sourceId === entityId);
    
    return relationships
      .map(r => this.entitiesStore.get(r.targetId))
      .filter((e): e is LineageEntity => e !== undefined);
  }

  // ===========================================================================
  // LINEAGE GRAPH
  // ===========================================================================

  async getLineageGraph(organizationId: string): Promise<LineageGraph> {
    const entities = await this.getEntities(organizationId);
    const entityIds = new Set(entities.map(e => e.id));
    
    const relationships = Array.from(this.relationshipsStore.values())
      .filter(r => entityIds.has(r.sourceId) && entityIds.has(r.targetId));

    const targetIds = new Set(relationships.map(r => r.targetId));
    const sourceIds = new Set(relationships.map(r => r.sourceId));

    const rootEntities = entities.filter(e => !targetIds.has(e.id)).map(e => e.id);
    const leafEntities = entities.filter(e => !sourceIds.has(e.id)).map(e => e.id);

    return {
      entities,
      relationships,
      rootEntities,
      leafEntities,
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

      const rels = Array.from(this.relationshipsStore.values())
        .filter(r => dir === 'upstream' ? r.targetId === id : r.sourceId === id);

      for (const rel of rels) {
        relationships.push(rel);
        const nextId = dir === 'upstream' ? rel.sourceId : rel.targetId;
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

    return {
      entities,
      relationships,
      rootEntities: [],
      leafEntities: [],
    };
  }

  // ===========================================================================
  // DATA QUALITY
  // ===========================================================================

  async checkDataQuality(entityId: string): Promise<DataQualityReport> {
    const entity = await this.getEntity(entityId);
    if (!entity) throw new Error('Entity not found');

    // Simulate quality check (in production, would query actual data)
    const completeness = 85 + Math.random() * 15;
    const accuracy = 90 + Math.random() * 10;
    const consistency = 88 + Math.random() * 12;
    const timeliness = 75 + Math.random() * 25;
    const validity = 92 + Math.random() * 8;

    const overallScore = (completeness + accuracy + consistency + timeliness + validity) / 5;

    const issues: DataQualityIssue[] = [];
    if (completeness < 90) {
      issues.push({
        id: `issue-${Date.now()}-1`,
        type: 'missing',
        severity: completeness < 80 ? 'high' : 'medium',
        description: `${(100 - completeness).toFixed(1)}% of records have missing fields`,
        affectedRecords: Math.floor((entity.recordCount || 1000) * (100 - completeness) / 100),
        suggestedFix: 'Implement data validation at source',
      });
    }

    const report: DataQualityReport = {
      entityId,
      entityName: entity.name,
      overallScore: Math.round(overallScore),
      dimensions: {
        completeness: Math.round(completeness),
        accuracy: Math.round(accuracy),
        consistency: Math.round(consistency),
        timeliness: Math.round(timeliness),
        validity: Math.round(validity),
      },
      issues,
      lastChecked: new Date(),
    };

    this.qualityReportsStore.set(entityId, report);
    return report;
  }

  async getQualityReport(entityId: string): Promise<DataQualityReport | null> {
    return this.qualityReportsStore.get(entityId) || null;
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
      
      const report = this.qualityReportsStore.get(entity.id);
      if (report) {
        recentIssues.push(...report.issues);
      }
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

  // ===========================================================================
  // SEED DATA
  // ===========================================================================

  async seedDefaultData(organizationId: string): Promise<void> {
    // Create sample entities
    const salesforce = await this.createEntity({
      organizationId, name: 'Salesforce CRM', type: 'api', description: 'Customer data source',
      source: 'external', qualityScore: 98, recordCount: 2300000, metadata: { connector: 'native' }
    });

    const snowflake = await this.createEntity({
      organizationId, name: 'Snowflake DW', type: 'dataset', description: 'Data warehouse',
      source: 'internal', qualityScore: 96, recordCount: 45000000, metadata: { region: 'us-west-2' }
    });

    const customer360 = await this.createEntity({
      organizationId, name: 'Customer 360', type: 'table', description: 'Unified customer view',
      source: 'derived', qualityScore: 94, recordCount: 1500000, metadata: { refreshFrequency: 'hourly' }
    });

    const revenueReport = await this.createEntity({
      organizationId, name: 'Revenue Report', type: 'report', description: 'Monthly revenue analysis',
      source: 'derived', qualityScore: 92, metadata: { owner: 'finance' }
    });

    const churnModel = await this.createEntity({
      organizationId, name: 'Churn Prediction Model', type: 'model', description: 'ML model for churn prediction',
      source: 'derived', qualityScore: 89, metadata: { algorithm: 'XGBoost', accuracy: 0.92 }
    });

    // Create relationships
    await this.createRelationship({ sourceId: salesforce.id, targetId: snowflake.id, type: 'feeds', confidence: 1 });
    await this.createRelationship({ sourceId: snowflake.id, targetId: customer360.id, type: 'transforms_to', confidence: 0.95, transformations: ['join', 'aggregate', 'clean'] });
    await this.createRelationship({ sourceId: customer360.id, targetId: revenueReport.id, type: 'derives_from', confidence: 0.9 });
    await this.createRelationship({ sourceId: customer360.id, targetId: churnModel.id, type: 'uses', confidence: 0.88 });

    this.logger.info(`Seeded lineage data for org ${organizationId}`);
  }
}

export const lineageService = new LineageService();
