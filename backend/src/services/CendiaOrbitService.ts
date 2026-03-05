/**
 * Service — Cendia Orbit Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports CendiaOrbitService, orbitService, OrbitNode, OrbitEdge, OrbitGraph, PropagationPath, InfluenceResult, OrbitRunConfig
 * @module services/CendiaOrbitService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * =============================================================================
 * CENDIA ORBIT SERVICE
 * =============================================================================
 * The Influence Simulation Engine - Core graph traversal and propagation logic.
 * 
 * CendiaOrbitâ„¢ is the ENGINE that powers CendiaCascadeâ„¢ (Butterfly Effect).
 * It walks the organizational/system graph to find how changes propagate.
 * 
 * Key Responsibilities:
 * - Graph traversal (Neo4j or in-memory)
 * - Node influence calculation
 * - Propagation path discovery
 * - Probability decay modeling
 * - Connection strength weighting
 * 
 * Design Principle: "Orbit is the motor; Cascade is the car."
 */

import { EventEmitter } from 'events';
import crypto from 'crypto';
import { logger } from '../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export enum NodeType {
  DEPARTMENT = 'department',
  TEAM = 'team',
  PERSON = 'person',
  SYSTEM = 'system',
  PROCESS = 'process',
  POLICY = 'policy',
  METRIC = 'metric',
  VENDOR = 'vendor',
  CUSTOMER = 'customer',
  PRODUCT = 'product',
  ASSET = 'asset',
  DECISION = 'decision',
  RISK = 'risk',
  CONTROL = 'control',
}

export enum EdgeType {
  DEPENDS_ON = 'depends_on',
  MANAGES = 'manages',
  PRODUCES = 'produces',
  CONSUMES = 'consumes',
  INFLUENCES = 'influences',
  REPORTS_TO = 'reports_to',
  FUNDS = 'funds',
  CONSTRAINS = 'constrains',
  TRIGGERS = 'triggers',
  MITIGATES = 'mitigates',
}

export interface OrbitNode {
  id: string;
  type: NodeType;
  name: string;
  metadata: Record<string, unknown>;
  weight?: number;           // Importance (0-1)
  sensitivity?: number;      // How reactive to changes (0-1)
  inertia?: number;          // Resistance to change (0-1)
}

export interface OrbitEdge {
  id: string;
  sourceId: string;
  targetId: string;
  type: EdgeType;
  strength: number;          // Connection strength (0-1)
  latencyDays?: number;      // How long for effect to propagate
  bidirectional?: boolean;
  metadata?: Record<string, unknown>;
}

export interface OrbitGraph {
  nodes: Map<string, OrbitNode>;
  edges: Map<string, OrbitEdge>;
  adjacency: Map<string, Set<string>>;  // nodeId -> Set<edgeIds>
}

export interface PropagationPath {
  nodes: string[];
  edges: string[];
  totalStrength: number;
  totalLatencyDays: number;
  probabilityDecay: number;
}

export interface InfluenceResult {
  nodeId: string;
  nodeName: string;
  nodeType: NodeType;
  impactScore: number;       // 0-1, how much this node is affected
  confidence: number;        // 0-1, how confident we are
  latencyDays: number;       // When the impact arrives
  paths: PropagationPath[];  // How the influence got here
  order: number;             // 1st, 2nd, 3rd order effect
}

export interface OrbitRunConfig {
  maxDepth?: number;         // Maximum hops from source
  minProbability?: number;   // Stop when probability drops below this
  includeNodeTypes?: NodeType[];
  excludeNodeTypes?: NodeType[];
  timeHorizonDays?: number;  // Only include effects within this window
}

export interface OrbitRunResult {
  runId: string;
  sourceNodeId: string;
  changeDescription: string;
  timestamp: Date;
  config: OrbitRunConfig;
  directImpacts: InfluenceResult[];    // 1st order
  rippleImpacts: InfluenceResult[];    // 2nd order
  butterflyImpacts: InfluenceResult[]; // 3rd+ order
  totalNodesAffected: number;
  maxLatencyDays: number;
  highestRiskNode?: InfluenceResult;
  executionTimeMs: number;
}

// =============================================================================
// ORBIT SERVICE
// =============================================================================

export class CendiaOrbitService extends EventEmitter {
  private graph: OrbitGraph;
  private runs: Map<string, OrbitRunResult> = new Map();

  constructor() {
    super();
    this.graph = {
      nodes: new Map(),
      edges: new Map(),
      adjacency: new Map(),
    };


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // GRAPH MANAGEMENT
  // ---------------------------------------------------------------------------

  addNode(node: OrbitNode): void {
    this.graph.nodes.set(node.id, {
      weight: 0.5,
      sensitivity: 0.5,
      inertia: 0.5,
      ...node,
    });
    
    if (!this.graph.adjacency.has(node.id)) {
      this.graph.adjacency.set(node.id, new Set());
    }
  }

  addEdge(edge: OrbitEdge): void {
    this.graph.edges.set(edge.id, edge);
    
    // Add to adjacency list
    if (!this.graph.adjacency.has(edge.sourceId)) {
      this.graph.adjacency.set(edge.sourceId, new Set());
    }
    this.graph.adjacency.get(edge.sourceId)!.add(edge.id);

    // If bidirectional, add reverse
    if (edge.bidirectional) {
      if (!this.graph.adjacency.has(edge.targetId)) {
        this.graph.adjacency.set(edge.targetId, new Set());
      }
      this.graph.adjacency.get(edge.targetId)!.add(edge.id);
    }
  }

  removeNode(nodeId: string): void {
    this.graph.nodes.delete(nodeId);
    
    // Remove all edges connected to this node
    const edgesToRemove: string[] = [];
    for (const [edgeId, edge] of this.graph.edges) {
      if (edge.sourceId === nodeId || edge.targetId === nodeId) {
        edgesToRemove.push(edgeId);
      }
    }
    edgesToRemove.forEach(id => this.graph.edges.delete(id));
    
    this.graph.adjacency.delete(nodeId);
  }

  getNode(nodeId: string): OrbitNode | undefined {
    return this.graph.nodes.get(nodeId);
  }

  getEdge(edgeId: string): OrbitEdge | undefined {
    return this.graph.edges.get(edgeId);
  }

  /**
   * Import graph from Neo4j or external source
   */
  async importFromNeo4j(neo4jDriver: unknown): Promise<void> {
    // Neo4j graph population via neo4j-driver when configured
    // This is a placeholder for the integration
    this.emit('graph:imported', { nodeCount: this.graph.nodes.size });
  }

  /**
   * Load graph from JSON
   */
  loadGraph(data: { nodes: OrbitNode[]; edges: OrbitEdge[] }): void {
    this.graph.nodes.clear();
    this.graph.edges.clear();
    this.graph.adjacency.clear();

    for (const node of data.nodes) {
      this.addNode(node);
    }
    for (const edge of data.edges) {
      this.addEdge(edge);
    }

    this.emit('graph:loaded', { 
      nodeCount: this.graph.nodes.size,
      edgeCount: this.graph.edges.size,
    });
  }

  /**
   * Export graph to JSON
   */
  exportGraph(): { nodes: OrbitNode[]; edges: OrbitEdge[] } {
    return {
      nodes: Array.from(this.graph.nodes.values()),
      edges: Array.from(this.graph.edges.values()),
    };
  }

  // ---------------------------------------------------------------------------
  // PROPAGATION ENGINE
  // ---------------------------------------------------------------------------

  /**
   * Run influence propagation from a source node
   */
  async runPropagation(
    sourceNodeId: string,
    changeDescription: string,
    initialImpact: number = 1.0,
    config: OrbitRunConfig = {}
  ): Promise<OrbitRunResult> {
    const startTime = Date.now();
    const runId = crypto.randomUUID();

    const mergedConfig: Required<OrbitRunConfig> = {
      maxDepth: config.maxDepth ?? 5,
      minProbability: config.minProbability ?? 0.05,
      includeNodeTypes: config.includeNodeTypes ?? [],
      excludeNodeTypes: config.excludeNodeTypes ?? [],
      timeHorizonDays: config.timeHorizonDays ?? 365,
    };

    const sourceNode = this.graph.nodes.get(sourceNodeId);
    if (!sourceNode) {
      throw new Error(`Source node not found: ${sourceNodeId}`);
    }

    // Track visited nodes and their influence results
    const visited = new Map<string, InfluenceResult>();
    const directImpacts: InfluenceResult[] = [];
    const rippleImpacts: InfluenceResult[] = [];
    const butterflyImpacts: InfluenceResult[] = [];

    // BFS with probability decay
    interface QueueItem {
      nodeId: string;
      depth: number;
      probability: number;
      latencyDays: number;
      path: PropagationPath;
    }

    const queue: QueueItem[] = [{
      nodeId: sourceNodeId,
      depth: 0,
      probability: initialImpact,
      latencyDays: 0,
      path: { nodes: [sourceNodeId], edges: [], totalStrength: 1, totalLatencyDays: 0, probabilityDecay: 1 },
    }];

    while (queue.length > 0) {
      const current = queue.shift()!;
      
      // Skip if below probability threshold
      if (current.probability < mergedConfig.minProbability) continue;
      
      // Skip if beyond max depth
      if (current.depth > mergedConfig.maxDepth) continue;

      // Skip if beyond time horizon
      if (current.latencyDays > mergedConfig.timeHorizonDays) continue;

      // Get outgoing edges
      const edgeIds = this.graph.adjacency.get(current.nodeId) || new Set();
      
      for (const edgeId of edgeIds) {
        const edge = this.graph.edges.get(edgeId);
        if (!edge) continue;

        // Determine target node
        const targetId = edge.sourceId === current.nodeId ? edge.targetId : edge.sourceId;
        if (!edge.bidirectional && edge.sourceId !== current.nodeId) continue;

        const targetNode = this.graph.nodes.get(targetId);
        if (!targetNode) continue;

        // Apply filters
        if (mergedConfig.excludeNodeTypes.length > 0 && 
            mergedConfig.excludeNodeTypes.includes(targetNode.type)) continue;
        if (mergedConfig.includeNodeTypes.length > 0 && 
            !mergedConfig.includeNodeTypes.includes(targetNode.type)) continue;

        // Calculate propagated impact
        const sensitivity = targetNode.sensitivity ?? 0.5;
        const inertia = targetNode.inertia ?? 0.5;
        const edgeStrength = edge.strength;
        
        // Impact formula: current_probability * edge_strength * node_sensitivity * (1 - inertia)
        const propagatedProbability = current.probability * edgeStrength * sensitivity * (1 - inertia * 0.5);
        const newLatency = current.latencyDays + (edge.latencyDays ?? 7);

        // Create new path
        const newPath: PropagationPath = {
          nodes: [...current.path.nodes, targetId],
          edges: [...current.path.edges, edgeId],
          totalStrength: current.path.totalStrength * edgeStrength,
          totalLatencyDays: newLatency,
          probabilityDecay: propagatedProbability / initialImpact,
        };

        // Update or create influence result
        const existing = visited.get(targetId);
        if (existing) {
          // Add new path if significantly different
          if (propagatedProbability > existing.impactScore * 0.5) {
            existing.paths.push(newPath);
            existing.impactScore = Math.max(existing.impactScore, propagatedProbability);
            existing.latencyDays = Math.min(existing.latencyDays, newLatency);
          }
        } else {
          const result: InfluenceResult = {
            nodeId: targetId,
            nodeName: targetNode.name,
            nodeType: targetNode.type,
            impactScore: propagatedProbability,
            confidence: this.calculateConfidence(newPath),
            latencyDays: newLatency,
            paths: [newPath],
            order: current.depth + 1,
          };
          visited.set(targetId, result);

          // Categorize by order
          if (result.order === 1) {
            directImpacts.push(result);
          } else if (result.order === 2) {
            rippleImpacts.push(result);
          } else {
            butterflyImpacts.push(result);
          }
        }

        // Add to queue for further propagation
        queue.push({
          nodeId: targetId,
          depth: current.depth + 1,
          probability: propagatedProbability,
          latencyDays: newLatency,
          path: newPath,
        });
      }
    }

    // Sort by impact score
    const sortByImpact = (a: InfluenceResult, b: InfluenceResult) => b.impactScore - a.impactScore;
    directImpacts.sort(sortByImpact);
    rippleImpacts.sort(sortByImpact);
    butterflyImpacts.sort(sortByImpact);

    // Find highest risk node
    const allImpacts = [...directImpacts, ...rippleImpacts, ...butterflyImpacts];
    const highestRiskNode = allImpacts.length > 0 
      ? allImpacts.reduce((max, curr) => curr.impactScore > max.impactScore ? curr : max)
      : undefined;

    const result: OrbitRunResult = {
      runId,
      sourceNodeId,
      changeDescription,
      timestamp: new Date(),
      config: mergedConfig,
      directImpacts,
      rippleImpacts,
      butterflyImpacts,
      totalNodesAffected: visited.size,
      maxLatencyDays: Math.max(...allImpacts.map(i => i.latencyDays), 0),
      highestRiskNode,
      executionTimeMs: Date.now() - startTime,
    };

    this.runs.set(runId, result);
    this.emit('propagation:complete', result);

    return result;
  }

  /**
   * Calculate confidence based on path characteristics
   */
  private calculateConfidence(path: PropagationPath): number {
    // Confidence decreases with path length and lower edge strengths
    const lengthPenalty = Math.pow(0.9, path.nodes.length - 1);
    const strengthFactor = path.totalStrength;
    return Math.min(1, lengthPenalty * strengthFactor * 1.2);
  }

  // ---------------------------------------------------------------------------
  // ANALYSIS METHODS
  // ---------------------------------------------------------------------------

  /**
   * Find all paths between two nodes
   */
  findPaths(sourceId: string, targetId: string, maxDepth: number = 5): PropagationPath[] {
    const paths: PropagationPath[] = [];
    
    const dfs = (current: string, target: string, depth: number, path: PropagationPath, visited: Set<string>) => {
      if (depth > maxDepth) return;
      if (current === target) {
        paths.push({ ...path });
        return;
      }

      const edgeIds = this.graph.adjacency.get(current) || new Set();
      for (const edgeId of edgeIds) {
        const edge = this.graph.edges.get(edgeId);
        if (!edge) continue;

        const nextId = edge.sourceId === current ? edge.targetId : edge.sourceId;
        if (visited.has(nextId)) continue;
        if (!edge.bidirectional && edge.sourceId !== current) continue;

        visited.add(nextId);
        path.nodes.push(nextId);
        path.edges.push(edgeId);
        path.totalStrength *= edge.strength;
        path.totalLatencyDays += edge.latencyDays ?? 7;

        dfs(nextId, target, depth + 1, path, visited);

        // Backtrack
        path.nodes.pop();
        path.edges.pop();
        path.totalStrength /= edge.strength;
        path.totalLatencyDays -= edge.latencyDays ?? 7;
        visited.delete(nextId);
      }
    };

    const initialPath: PropagationPath = {
      nodes: [sourceId],
      edges: [],
      totalStrength: 1,
      totalLatencyDays: 0,
      probabilityDecay: 1,
    };

    dfs(sourceId, targetId, 0, initialPath, new Set([sourceId]));
    return paths;
  }

  /**
   * Get critical nodes (high centrality + high sensitivity)
   */
  getCriticalNodes(topN: number = 10): OrbitNode[] {
    const nodeScores: Map<string, number> = new Map();

    // Calculate degree centrality + sensitivity score
    for (const [nodeId, node] of this.graph.nodes) {
      const edgeCount = this.graph.adjacency.get(nodeId)?.size || 0;
      const sensitivity = node.sensitivity ?? 0.5;
      const weight = node.weight ?? 0.5;
      
      // Score = degree * sensitivity * weight
      const score = edgeCount * sensitivity * weight;
      nodeScores.set(nodeId, score);
    }

    // Sort and return top N
    const sorted = Array.from(nodeScores.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, topN);

    return sorted.map(([nodeId]) => this.graph.nodes.get(nodeId)!);
  }

  /**
   * Identify feedback loops (cycles in the graph)
   */
  findFeedbackLoops(maxLength: number = 5): string[][] {
    const loops: string[][] = [];
    const visited = new Set<string>();

    const dfs = (start: string, current: string, path: string[], depth: number) => {
      if (depth > maxLength) return;

      const edgeIds = this.graph.adjacency.get(current) || new Set();
      for (const edgeId of edgeIds) {
        const edge = this.graph.edges.get(edgeId);
        if (!edge) continue;

        const nextId = edge.sourceId === current ? edge.targetId : edge.sourceId;
        
        if (nextId === start && path.length >= 2) {
          loops.push([...path, start]);
          continue;
        }

        if (path.includes(nextId)) continue;

        dfs(start, nextId, [...path, nextId], depth + 1);
      }
    };

    for (const nodeId of this.graph.nodes.keys()) {
      if (!visited.has(nodeId)) {
        dfs(nodeId, nodeId, [nodeId], 0);
        visited.add(nodeId);
      }
    }

    return loops;
  }

  // ---------------------------------------------------------------------------
  // RUN MANAGEMENT
  // ---------------------------------------------------------------------------

  getRun(runId: string): OrbitRunResult | undefined {
    return this.runs.get(runId);
  }

  listRuns(): OrbitRunResult[] {
    return Array.from(this.runs.values()).sort((a, b) => 
      b.timestamp.getTime() - a.timestamp.getTime()
    );
  }

  deleteRun(runId: string): boolean {
    return this.runs.delete(runId);
  }

  // ---------------------------------------------------------------------------
  // STATS
  // ---------------------------------------------------------------------------

  getStats(): {
    nodeCount: number;
    edgeCount: number;
    nodeTypeDistribution: Record<string, number>;
    edgeTypeDistribution: Record<string, number>;
    avgDegree: number;
  } {
    const nodeTypeDistribution: Record<string, number> = {};
    const edgeTypeDistribution: Record<string, number> = {};
    let totalDegree = 0;

    for (const node of this.graph.nodes.values()) {
      nodeTypeDistribution[node.type] = (nodeTypeDistribution[node.type] || 0) + 1;
    }

    for (const edge of this.graph.edges.values()) {
      edgeTypeDistribution[edge.type] = (edgeTypeDistribution[edge.type] || 0) + 1;
    }

    for (const edges of this.graph.adjacency.values()) {
      totalDegree += edges.size;
    }

    return {
      nodeCount: this.graph.nodes.size,
      edgeCount: this.graph.edges.size,
      nodeTypeDistribution,
      edgeTypeDistribution,
      avgDegree: this.graph.nodes.size > 0 ? totalDegree / this.graph.nodes.size : 0,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaOrbit', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.runs.has(d.id)) this.runs.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaOrbitService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaOrbitService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaOrbit',
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
      service: 'CendiaOrbit',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const orbitService = new CendiaOrbitService();
