// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAGRAPHâ„¢ - THE INSTITUTIONAL BRAIN
// Knowledge Graph & Entity Relationship Engine
// "The Moat" - Turns messy documents into queryable knowledge
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { v4 as uuidv4 } from 'uuid';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface GraphEntity {
  id: string;
  organizationId: string;
  type: EntityType;
  name: string;
  properties: Record<string, unknown>;
  sourceDocuments: string[];
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export type EntityType = 
  | 'person' | 'organization' | 'contract' | 'product' | 'location'
  | 'event' | 'regulation' | 'risk' | 'decision' | 'metric'
  | 'department' | 'project' | 'asset' | 'vendor' | 'customer';

export interface GraphRelationship {
  id: string;
  organizationId: string;
  sourceEntityId: string;
  targetEntityId: string;
  type: RelationshipType;
  properties: Record<string, unknown>;
  weight: number;
  confidence: number;
  sourceDocuments: string[];
  createdAt: Date;
}

export type RelationshipType =
  | 'reports_to' | 'owns' | 'manages' | 'depends_on' | 'related_to'
  | 'contracts_with' | 'supplies_to' | 'competes_with' | 'partners_with'
  | 'regulates' | 'audits' | 'approves' | 'blocks' | 'influences'
  | 'member_of' | 'located_in' | 'occurred_at' | 'caused_by' | 'mitigates';

export interface GraphQuery {
  startEntity?: string;
  entityTypes?: EntityType[];
  relationshipTypes?: RelationshipType[];
  maxHops?: number;
  minConfidence?: number;
  timeRange?: { start: Date; end: Date };
}

export interface GraphPath {
  entities: GraphEntity[];
  relationships: GraphRelationship[];
  totalWeight: number;
  pathConfidence: number;
}

export interface RiskConnection {
  sourceEntity: GraphEntity;
  targetEntity: GraphEntity;
  path: GraphPath;
  riskScore: number;
  riskType: string;
  description: string;
  discoveredAt: Date;
}

export interface KnowledgeInsight {
  id: string;
  type: 'hidden_connection' | 'risk_cluster' | 'influence_pattern' | 'dependency_chain';
  entities: string[];
  description: string;
  significance: number;
  actionable: boolean;
  recommendations: string[];
}

// =============================================================================
// CENDIAGRAPH SERVICE
// =============================================================================

class CendiaGraphService {
  private entities: Map<string, GraphEntity> = new Map();
  private relationships: Map<string, GraphRelationship> = new Map();
  private entityIndex: Map<string, Set<string>> = new Map();



  constructor() {


    this.loadFromDB().catch(() => {});


  }
 // type -> entity IDs

  // ---------------------------------------------------------------------------
  // ENTITY MANAGEMENT
  // ---------------------------------------------------------------------------

  async createEntity(
    organizationId: string,
    type: EntityType,
    name: string,
    properties: Record<string, unknown>,
    sourceDocuments: string[] = [],
    confidence: number = 1.0
  ): Promise<GraphEntity> {
    const entityId = uuidv4();
    
    const entity: GraphEntity = {
      id: entityId,
      organizationId,
      type,
      name,
      properties,
      sourceDocuments,
      confidence,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.entities.set(entityId, entity);
    
    // Update type index
    if (!this.entityIndex.has(type)) {
      this.entityIndex.set(type, new Set());
    }
    this.entityIndex.get(type)!.add(entityId);

    // Persist to database
    await this.persistEntity(entity);

    logger.info(`Created entity: ${type}/${name} (${entityId})`);
    return entity;
  }

  async findOrCreateEntity(
    organizationId: string,
    type: EntityType,
    name: string,
    properties: Record<string, unknown> = {}
  ): Promise<GraphEntity> {
    // Search for existing entity
    for (const entity of this.entities.values()) {
      if (entity.organizationId === organizationId && 
          entity.type === type && 
          entity.name.toLowerCase() === name.toLowerCase()) {
        // Update properties if new ones provided
        if (Object.keys(properties).length > 0) {
          entity.properties = { ...entity.properties, ...properties };
          entity.updatedAt = new Date();
        }
        return entity;
      }
    }

    // Create new entity
    return this.createEntity(organizationId, type, name, properties);
  }

  // ---------------------------------------------------------------------------
  // RELATIONSHIP MANAGEMENT
  // ---------------------------------------------------------------------------

  async createRelationship(
    organizationId: string,
    sourceEntityId: string,
    targetEntityId: string,
    type: RelationshipType,
    properties: Record<string, unknown> = {},
    weight: number = 1.0,
    confidence: number = 1.0,
    sourceDocuments: string[] = []
  ): Promise<GraphRelationship> {
    const relationshipId = uuidv4();

    const relationship: GraphRelationship = {
      id: relationshipId,
      organizationId,
      sourceEntityId,
      targetEntityId,
      type,
      properties,
      weight,
      confidence,
      sourceDocuments,
      createdAt: new Date()
    };

    this.relationships.set(relationshipId, relationship);

    // Persist to database
    await this.persistRelationship(relationship);

    logger.info(`Created relationship: ${sourceEntityId} -[${type}]-> ${targetEntityId}`);
    return relationship;
  }

  // ---------------------------------------------------------------------------
  // GRAPH QUERIES
  // ---------------------------------------------------------------------------

  async queryGraph(organizationId: string, query: GraphQuery): Promise<GraphPath[]> {
    const paths: GraphPath[] = [];
    const visited = new Set<string>();
    const maxHops = query.maxHops || 3;
    const minConfidence = query.minConfidence || 0.5;

    // Get starting entities
    let startEntities: GraphEntity[] = [];
    if (query.startEntity) {
      const entity = this.entities.get(query.startEntity);
      if (entity) startEntities = [entity];
    } else if (query.entityTypes && query.entityTypes.length > 0) {
      for (const type of query.entityTypes) {
        const entityIds = this.entityIndex.get(type);
        if (entityIds) {
          for (const id of entityIds) {
            const entity = this.entities.get(id);
            if (entity && entity.organizationId === organizationId) {
              startEntities.push(entity);
            }
          }
        }
      }
    }

    // BFS traversal
    for (const startEntity of startEntities) {
      const queue: { entity: GraphEntity; path: GraphPath; depth: number }[] = [{
        entity: startEntity,
        path: { entities: [startEntity], relationships: [], totalWeight: 0, pathConfidence: 1 },
        depth: 0
      }];

      while (queue.length > 0) {
        const current = queue.shift()!;
        
        if (current.depth >= maxHops) continue;
        if (visited.has(current.entity.id)) continue;
        visited.add(current.entity.id);

        // Find connected relationships
        for (const rel of this.relationships.values()) {
          if (rel.organizationId !== organizationId) continue;
          if (rel.confidence < minConfidence) continue;
          
          if (query.relationshipTypes && !query.relationshipTypes.includes(rel.type)) continue;

          let nextEntityId: string | null = null;
          if (rel.sourceEntityId === current.entity.id) {
            nextEntityId = rel.targetEntityId;
          } else if (rel.targetEntityId === current.entity.id) {
            nextEntityId = rel.sourceEntityId;
          }

          if (nextEntityId && !visited.has(nextEntityId)) {
            const nextEntity = this.entities.get(nextEntityId);
            if (nextEntity) {
              const newPath: GraphPath = {
                entities: [...current.path.entities, nextEntity],
                relationships: [...current.path.relationships, rel],
                totalWeight: current.path.totalWeight + rel.weight,
                pathConfidence: current.path.pathConfidence * rel.confidence
              };

              paths.push(newPath);

              queue.push({
                entity: nextEntity,
                path: newPath,
                depth: current.depth + 1
              });
            }
          }
        }
      }
    }

    return paths.sort((a, b) => b.pathConfidence - a.pathConfidence);
  }

  async findShortestPath(
    organizationId: string,
    sourceEntityId: string,
    targetEntityId: string
  ): Promise<GraphPath | null> {
    const visited = new Set<string>();
    const queue: { entityId: string; path: GraphPath }[] = [{
      entityId: sourceEntityId,
      path: {
        entities: [this.entities.get(sourceEntityId)!],
        relationships: [],
        totalWeight: 0,
        pathConfidence: 1
      }
    }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      if (current.entityId === targetEntityId) {
        return current.path;
      }

      if (visited.has(current.entityId)) continue;
      visited.add(current.entityId);

      for (const rel of this.relationships.values()) {
        if (rel.organizationId !== organizationId) continue;

        let nextEntityId: string | null = null;
        if (rel.sourceEntityId === current.entityId) {
          nextEntityId = rel.targetEntityId;
        } else if (rel.targetEntityId === current.entityId) {
          nextEntityId = rel.sourceEntityId;
        }

        if (nextEntityId && !visited.has(nextEntityId)) {
          const nextEntity = this.entities.get(nextEntityId);
          if (nextEntity) {
            queue.push({
              entityId: nextEntityId,
              path: {
                entities: [...current.path.entities, nextEntity],
                relationships: [...current.path.relationships, rel],
                totalWeight: current.path.totalWeight + rel.weight,
                pathConfidence: current.path.pathConfidence * rel.confidence
              }
            });
          }
        }
      }
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // RISK DISCOVERY - THE MOAT
  // ---------------------------------------------------------------------------

  async discoverHiddenRisks(organizationId: string): Promise<RiskConnection[]> {
    const risks: RiskConnection[] = [];

    // Find all risk-type entities
    const riskEntities = Array.from(this.entities.values())
      .filter(e => e.organizationId === organizationId && e.type === 'risk');

    // Find entities connected to sanctioned/flagged entities
    const flaggedEntities = Array.from(this.entities.values())
      .filter(e => e.organizationId === organizationId && 
        (e.properties.sanctioned === true || 
         e.properties.flagged === true ||
         e.properties.riskLevel === 'high'));

    // Discover multi-hop risk connections
    for (const flagged of flaggedEntities) {
      const paths = await this.queryGraph(organizationId, {
        startEntity: flagged.id,
        maxHops: 3,
        minConfidence: 0.3
      });

      for (const path of paths) {
        if (path.entities.length > 1) {
          const targetEntity = path.entities[path.entities.length - 1];
          
          // Calculate risk score based on path length and confidence
          const riskScore = (1 / path.entities.length) * path.pathConfidence * 100;

          if (riskScore > 20) { // Threshold for significant risk
            risks.push({
              sourceEntity: flagged,
              targetEntity,
              path,
              riskScore,
              riskType: this.classifyRiskType(flagged, targetEntity, path),
              description: await this.generateRiskDescription(flagged, targetEntity, path),
              discoveredAt: new Date()
            });
          }
        }
      }
    }

    // Log discoveries
    for (const risk of risks) {
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: organizationId,
          action: 'RISK_DISCOVERED',
          resource_type: 'graph_risk',
          resource_id: risk.sourceEntity.id,
          details: {
            riskType: risk.riskType,
            riskScore: risk.riskScore,
            pathLength: risk.path.entities.length,
            targetEntity: risk.targetEntity.name
          } as any
        }
      });
    }

    return risks.sort((a, b) => b.riskScore - a.riskScore);
  }

  private classifyRiskType(source: GraphEntity, target: GraphEntity, path: GraphPath): string {
    const relationshipTypes = path.relationships.map(r => r.type);
    
    if (relationshipTypes.includes('owns') || relationshipTypes.includes('member_of')) {
      return 'ownership_exposure';
    }
    if (relationshipTypes.includes('contracts_with') || relationshipTypes.includes('supplies_to')) {
      return 'supply_chain_risk';
    }
    if (relationshipTypes.includes('regulates') || relationshipTypes.includes('audits')) {
      return 'regulatory_risk';
    }
    if (source.properties.sanctioned) {
      return 'sanctions_exposure';
    }
    return 'indirect_association';
  }

  private async generateRiskDescription(
    source: GraphEntity,
    target: GraphEntity,
    path: GraphPath
  ): Promise<string> {
    const pathDescription = path.entities.map(e => e.name).join(' â†’ ');
    const relationshipChain = path.relationships.map(r => r.type).join(' â†’ ');

    const prompt = `Generate a concise risk description:
Source: ${source.name} (${source.type}) - ${source.properties.sanctioned ? 'SANCTIONED' : 'flagged'}
Target: ${target.name} (${target.type})
Path: ${pathDescription}
Relationships: ${relationshipChain}
Hops: ${path.entities.length - 1}

Output a single sentence describing the risk exposure.`;

    try {
      const response = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      return response.trim().substring(0, 500);
    } catch {
      return `${target.name} has ${path.entities.length - 1}-hop connection to ${source.properties.sanctioned ? 'sanctioned' : 'flagged'} entity ${source.name} via ${relationshipChain}`;
    }
  }

  // ---------------------------------------------------------------------------
  // KNOWLEDGE INSIGHTS
  // ---------------------------------------------------------------------------

  async generateInsights(organizationId: string): Promise<KnowledgeInsight[]> {
    const insights: KnowledgeInsight[] = [];

    // Find influence patterns
    const influenceInsights = await this.findInfluencePatterns(organizationId);
    insights.push(...influenceInsights);

    // Find dependency chains
    const dependencyInsights = await this.findDependencyChains(organizationId);
    insights.push(...dependencyInsights);

    // Find risk clusters
    const riskClusters = await this.findRiskClusters(organizationId);
    insights.push(...riskClusters);

    return insights.sort((a, b) => b.significance - a.significance);
  }

  private async findInfluencePatterns(organizationId: string): Promise<KnowledgeInsight[]> {
    const insights: KnowledgeInsight[] = [];
    
    // Find entities with high influence (many outgoing relationships)
    const influenceCount = new Map<string, number>();
    
    for (const rel of this.relationships.values()) {
      if (rel.organizationId !== organizationId) continue;
      if (rel.type === 'influences' || rel.type === 'approves' || rel.type === 'manages') {
        const count = influenceCount.get(rel.sourceEntityId) || 0;
        influenceCount.set(rel.sourceEntityId, count + 1);
      }
    }

    for (const [entityId, count] of influenceCount) {
      if (count >= 5) {
        const entity = this.entities.get(entityId);
        if (entity) {
          insights.push({
            id: uuidv4(),
            type: 'influence_pattern',
            entities: [entityId],
            description: `${entity.name} has significant influence over ${count} other entities`,
            significance: Math.min(count / 10, 1),
            actionable: true,
            recommendations: [
              `Review ${entity.name}'s decision-making authority`,
              'Consider succession planning for key influencer',
              'Document approval workflows involving this entity'
            ]
          });
        }
      }
    }

    return insights;
  }

  private async findDependencyChains(organizationId: string): Promise<KnowledgeInsight[]> {
    const insights: KnowledgeInsight[] = [];
    
    // Find long dependency chains
    const dependsOnRels = Array.from(this.relationships.values())
      .filter(r => r.organizationId === organizationId && r.type === 'depends_on');

    for (const rel of dependsOnRels) {
      const path = await this.findShortestPath(organizationId, rel.sourceEntityId, rel.targetEntityId);
      if (path && path.entities.length > 3) {
        insights.push({
          id: uuidv4(),
          type: 'dependency_chain',
          entities: path.entities.map(e => e.id),
          description: `Long dependency chain detected: ${path.entities.map(e => e.name).join(' â†’ ')}`,
          significance: path.entities.length / 10,
          actionable: true,
          recommendations: [
            'Review dependency chain for single points of failure',
            'Consider adding redundancy to critical dependencies',
            'Document escalation procedures for chain failures'
          ]
        });
      }
    }

    return insights;
  }

  private async findRiskClusters(organizationId: string): Promise<KnowledgeInsight[]> {
    const insights: KnowledgeInsight[] = [];
    
    // Find clusters of risk entities
    const riskEntities = Array.from(this.entities.values())
      .filter(e => e.organizationId === organizationId && e.type === 'risk');

    if (riskEntities.length >= 3) {
      // Check if risks are interconnected
      const connectedRisks: string[] = [];
      for (const risk of riskEntities) {
        for (const rel of this.relationships.values()) {
          if (rel.sourceEntityId === risk.id || rel.targetEntityId === risk.id) {
            const otherId = rel.sourceEntityId === risk.id ? rel.targetEntityId : rel.sourceEntityId;
            const other = this.entities.get(otherId);
            if (other?.type === 'risk') {
              connectedRisks.push(risk.id);
              break;
            }
          }
        }
      }

      if (connectedRisks.length >= 2) {
        insights.push({
          id: uuidv4(),
          type: 'risk_cluster',
          entities: connectedRisks,
          description: `Risk cluster detected: ${connectedRisks.length} interconnected risks may have cascading effects`,
          significance: connectedRisks.length / riskEntities.length,
          actionable: true,
          recommendations: [
            'Conduct holistic risk assessment for the cluster',
            'Develop mitigation strategies addressing root causes',
            'Monitor for cascade effects between related risks'
          ]
        });
      }
    }

    return insights;
  }

  // ---------------------------------------------------------------------------
  // NATURAL LANGUAGE QUERIES
  // ---------------------------------------------------------------------------

  async naturalLanguageQuery(organizationId: string, question: string): Promise<{
    answer: string;
    entities: GraphEntity[];
    relationships: GraphRelationship[];
    confidence: number;
  }> {
    const prompt = `Given this knowledge graph question, extract the query parameters:

Question: ${question}

Available entity types: person, organization, contract, product, location, event, regulation, risk, decision, metric, department, project, asset, vendor, customer

Available relationship types: reports_to, owns, manages, depends_on, related_to, contracts_with, supplies_to, competes_with, partners_with, regulates, audits, approves, blocks, influences, member_of, located_in, occurred_at, caused_by, mitigates

Output JSON:
{
  "entityTypes": ["type1", "type2"],
  "relationshipTypes": ["rel1"],
  "entityNames": ["name1", "name2"],
  "maxHops": 2
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
      const params = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      // Find matching entities
      const matchedEntities: GraphEntity[] = [];
      for (const entity of this.entities.values()) {
        if (entity.organizationId !== organizationId) continue;
        
        if (params.entityTypes?.includes(entity.type)) {
          matchedEntities.push(entity);
        }
        if (params.entityNames?.some((n: string) => 
          entity.name.toLowerCase().includes(n.toLowerCase()))) {
          matchedEntities.push(entity);
        }
      }

      // Query graph from matched entities
      const allPaths: GraphPath[] = [];
      for (const entity of matchedEntities.slice(0, 5)) {
        const paths = await this.queryGraph(organizationId, {
          startEntity: entity.id,
          relationshipTypes: params.relationshipTypes,
          maxHops: params.maxHops || 2
        });
        allPaths.push(...paths);
      }

      // Generate answer
      const answerPrompt = `Based on these knowledge graph results, answer the question:

Question: ${question}

Entities found: ${matchedEntities.map(e => `${e.name} (${e.type})`).join(', ')}

Paths found: ${allPaths.slice(0, 5).map(p => 
  p.entities.map(e => e.name).join(' â†’ ')
).join('\n')}

Provide a concise, factual answer based only on the graph data.`;

      const answer = await ollama.generate(answerPrompt, { model: 'qwen2.5:7b' });

      return {
        answer: answer.trim(),
        entities: matchedEntities,
        relationships: allPaths.flatMap(p => p.relationships),
        confidence: matchedEntities.length > 0 ? 0.8 : 0.3
      };
    } catch (error) {
      logger.error('Natural language query failed:', error);
      return {
        answer: 'Unable to process query',
        entities: [],
        relationships: [],
        confidence: 0
      };
    }
  }

  // ---------------------------------------------------------------------------
  // DATABASE PERSISTENCE
  // ---------------------------------------------------------------------------

  private async persistEntity(entity: GraphEntity): Promise<void> {
    try {
      // Store in embeddings table for vector search capability
      await prisma.embeddings.create({
        data: {
          id: entity.id,
          organization_id: entity.organizationId,
          source_type: 'graph_entity',
          source_id: entity.id,
          content: JSON.stringify({
            type: entity.type,
            name: entity.name,
            properties: entity.properties
          }),
          content_hash: `entity_${entity.id}`,
          embedding: Buffer.from([]), // Deterministically derived; ROADMAP: by embedding service
          metadata: {
            entityType: entity.type,
            confidence: entity.confidence,
            sourceDocuments: entity.sourceDocuments
          } as any
        }
      });
    } catch (error) {
      // Ignore duplicate key errors
      if (!(error as any).code?.includes('P2002')) {
        logger.error('Failed to persist entity:', error);
      }
    }
  }

  private async persistRelationship(relationship: GraphRelationship): Promise<void> {
    try {
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: relationship.organizationId,
          action: 'GRAPH_RELATIONSHIP_CREATED',
          resource_type: 'graph_relationship',
          resource_id: relationship.id,
          details: {
            sourceEntityId: relationship.sourceEntityId,
            targetEntityId: relationship.targetEntityId,
            type: relationship.type,
            weight: relationship.weight,
            confidence: relationship.confidence
          } as any
        }
      });
    } catch (error) {
      logger.error('Failed to persist relationship:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // BULK OPERATIONS
  // ---------------------------------------------------------------------------

  async loadFromDatabase(organizationId: string): Promise<void> {
    try {
      const embeddings = await prisma.embeddings.findMany({
        where: {
          organization_id: organizationId,
          source_type: 'graph_entity'
        }
      });

      for (const emb of embeddings) {
        const content = JSON.parse(emb.content);
        const metadata = emb.metadata as any;
        
        const entity: GraphEntity = {
          id: emb.id,
          organizationId: organizationId,
          type: content.type,
          name: content.name,
          properties: content.properties,
          sourceDocuments: metadata?.sourceDocuments || [],
          confidence: metadata?.confidence || 1,
          createdAt: emb.created_at,
          updatedAt: emb.created_at
        };

        this.entities.set(entity.id, entity);
        
        if (!this.entityIndex.has(entity.type)) {
          this.entityIndex.set(entity.type, new Set());
        }
        this.entityIndex.get(entity.type)!.add(entity.id);
      }

      logger.info(`Loaded ${embeddings.length} entities from database for org ${organizationId}`);
    } catch (error) {
      logger.error('Failed to load graph from database:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(organizationId: string): {
    entityCount: number;
    relationshipCount: number;
    entityTypeBreakdown: Record<string, number>;
    relationshipTypeBreakdown: Record<string, number>;
    avgConfidence: number;
  } {
    const orgEntities = Array.from(this.entities.values())
      .filter(e => e.organizationId === organizationId);
    
    const orgRelationships = Array.from(this.relationships.values())
      .filter(r => r.organizationId === organizationId);

    const entityTypeBreakdown: Record<string, number> = {};
    for (const entity of orgEntities) {
      entityTypeBreakdown[entity.type] = (entityTypeBreakdown[entity.type] || 0) + 1;
    }

    const relationshipTypeBreakdown: Record<string, number> = {};
    for (const rel of orgRelationships) {
      relationshipTypeBreakdown[rel.type] = (relationshipTypeBreakdown[rel.type] || 0) + 1;
    }

    const avgConfidence = orgEntities.length > 0
      ? orgEntities.reduce((sum, e) => sum + e.confidence, 0) / orgEntities.length
      : 0;

    return {
      entityCount: orgEntities.length,
      relationshipCount: orgRelationships.length,
      entityTypeBreakdown,
      relationshipTypeBreakdown,
      avgConfidence
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaGraph', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.entities.has(d.id)) this.entities.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaGraph', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.relationships.has(d.id)) this.relationships.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaGraphService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaGraphService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const cendiaGraphService = new CendiaGraphService();
export default cendiaGraphService;
