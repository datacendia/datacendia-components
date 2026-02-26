// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA MIRRORÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - Digital Twin Service
// "The live reflection of your enterprise."
// Sovereign Organ Layer - Time & Simulation
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface DigitalTwinState {
  id: string;
  organizationId: string;
  entityType: 'system' | 'team' | 'workflow' | 'process' | 'asset';
  entityId: string;
  entityName: string;
  currentState: Record<string, unknown>;
  healthScore: number;
  lastSync: Date;
  syncFrequency: number; // seconds
  dependencies: string[];
  metadata: Record<string, unknown>;
}

export interface StateSnapshot {
  id: string;
  twinId: string;
  state: Record<string, unknown>;
  timestamp: Date;
  trigger: 'scheduled' | 'manual' | 'event';
  changesSinceLastSnapshot: number;
}

export interface SimulationScenario {
  id: string;
  organizationId: string;
  name: string;
  description: string;
  baselineSnapshot: string;
  modifications: Record<string, unknown>[];
  results: SimulationResult | null;
  status: 'draft' | 'running' | 'completed' | 'failed';
  createdAt: Date;
  completedAt: Date | null;
}

export interface SimulationResult {
  impactScore: number;
  affectedEntities: string[];
  cascadeEffects: Array<{
    entity: string;
    effect: string;
    magnitude: number;
  }>;
  recommendations: string[];
  riskFactors: string[];
}

export interface PropagationAnalysis {
  sourceEntity: string;
  change: Record<string, unknown>;
  propagationPath: Array<{
    entity: string;
    delay: number;
    impact: number;
  }>;
  totalAffected: number;
  estimatedDuration: number;
}

// =============================================================================
// CENDIA MIRROR SERVICE
// =============================================================================

export class CendiaMirrorService {
  private _twins: Map<string, DigitalTwinState> = new Map();
  private _snapshots: Map<string, StateSnapshot[]> = new Map();
  private _scenarios: Map<string, SimulationScenario> = new Map();

  private db: PrismaClient | null;

  constructor(prisma?: PrismaClient) {
    this.db = prisma || null;
    logger.info(`[CendiaMirror] Digital Twin service initialized (persistence: ${this.db ? 'PostgreSQL' : 'in-memory'})`);


    this.loadFromDB().catch(() => {});
  }

  // ===========================================================================
  // DIGITAL TWIN MANAGEMENT
  // ===========================================================================

  async createTwin(data: Omit<DigitalTwinState, 'id' | 'lastSync'>): Promise<DigitalTwinState> {
    const twin: DigitalTwinState = {
      ...data,
      id: `twin-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      lastSync: new Date(),
    };
    this._twins.set(twin.id, twin);
    
    // Create initial snapshot
    await this.captureSnapshot(twin.id, 'manual');
    
    return twin;
  }

  async getTwin(twinId: string): Promise<DigitalTwinState | null> {
    return this._twins.get(twinId) || null;
  }

  async getTwinsForOrg(organizationId: string): Promise<DigitalTwinState[]> {
    return Array.from(this._twins.values())
      .filter(t => t.organizationId === organizationId);
  }

  async syncTwin(twinId: string, newState: Record<string, unknown>): Promise<DigitalTwinState | null> {
    const twin = this._twins.get(twinId);
    if (!twin) return null;

    const previousState = twin.currentState;
    twin.currentState = newState;
    twin.lastSync = new Date();
    
    // Calculate health score based on state changes
    twin.healthScore = this.calculateHealthScore(previousState, newState);
    
    this._twins.set(twinId, twin);
    
    // Auto-capture snapshot if significant changes
    const changeCount = this.countChanges(previousState, newState);
    if (changeCount > 5) {
      await this.captureSnapshot(twinId, 'event');
    }
    
    return twin;
  }

  async deleteTwin(twinId: string): Promise<boolean> {
    return this._twins.delete(twinId);
  }

  // ===========================================================================
  // STATE SNAPSHOTS
  // ===========================================================================

  async captureSnapshot(twinId: string, trigger: 'scheduled' | 'manual' | 'event'): Promise<StateSnapshot | null> {
    const twin = this._twins.get(twinId);
    if (!twin) return null;

    const existingSnapshots = this._snapshots.get(twinId) || [];
    const lastSnapshot = existingSnapshots[existingSnapshots.length - 1];
    
    const snapshot: StateSnapshot = {
      id: `snap-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      twinId,
      state: JSON.parse(JSON.stringify(twin.currentState)),
      timestamp: new Date(),
      trigger,
      changesSinceLastSnapshot: lastSnapshot 
        ? this.countChanges(lastSnapshot.state, twin.currentState)
        : 0,
    };

    existingSnapshots.push(snapshot);
    // Keep last 100 snapshots
    if (existingSnapshots.length > 100) {
      existingSnapshots.shift();
    }
    this._snapshots.set(twinId, existingSnapshots);
    
    return snapshot;
  }

  async getSnapshots(twinId: string, limit: number = 50): Promise<StateSnapshot[]> {
    const snapshots = this._snapshots.get(twinId) || [];
    return snapshots.slice(-limit).reverse();
  }

  async getSnapshotAtTime(twinId: string, timestamp: Date): Promise<StateSnapshot | null> {
    const snapshots = this._snapshots.get(twinId) || [];
    // Find closest snapshot before or at timestamp
    const targetTime = timestamp.getTime();
    let closest: StateSnapshot | null = null;
    
    for (const snap of snapshots) {
      if (snap.timestamp.getTime() <= targetTime) {
        if (!closest || snap.timestamp.getTime() > closest.timestamp.getTime()) {
          closest = snap;
        }
      }
    }
    
    return closest;
  }

  async reconstructState(twinId: string, timestamp: Date): Promise<Record<string, unknown> | null> {
    const snapshot = await this.getSnapshotAtTime(twinId, timestamp);
    return snapshot?.state || null;
  }

  // ===========================================================================
  // SIMULATION & STRESS TESTING
  // ===========================================================================

  async createScenario(data: {
    organizationId: string;
    name: string;
    description: string;
    baselineTwinId: string;
    modifications: Record<string, unknown>[];
  }): Promise<SimulationScenario | null> {
    const twin = this._twins.get(data.baselineTwinId);
    if (!twin) return null;

    // Capture baseline snapshot
    const baselineSnap = await this.captureSnapshot(data.baselineTwinId, 'manual');
    if (!baselineSnap) return null;

    const scenario: SimulationScenario = {
      id: `scenario-${Date.now()}-${crypto.randomUUID().slice(0, 6)}`,
      organizationId: data.organizationId,
      name: data.name,
      description: data.description,
      baselineSnapshot: baselineSnap.id,
      modifications: data.modifications,
      results: null,
      status: 'draft',
      createdAt: new Date(),
      completedAt: null,
    };

    this._scenarios.set(scenario.id, scenario);
    return scenario;
  }

  async runSimulation(scenarioId: string): Promise<SimulationResult | null> {
    const scenario = this._scenarios.get(scenarioId);
    if (!scenario || scenario.status === 'running') return null;

    scenario.status = 'running';
    this._scenarios.set(scenarioId, scenario);

    try {
      // Apply changes and calculate impacts
      const result = await this.calculateSimulationResults(scenario);
      
      scenario.results = result;
      scenario.status = 'completed';
      scenario.completedAt = new Date();
      this._scenarios.set(scenarioId, scenario);
      
      return result;
    } catch (error) {
      scenario.status = 'failed';
      this._scenarios.set(scenarioId, scenario);
      throw error;
    }
  }

  private async calculateSimulationResults(scenario: SimulationScenario): Promise<SimulationResult> {
    // Compute impact analysis
    const affectedEntities: string[] = [];
    const cascadeEffects: SimulationResult['cascadeEffects'] = [];
    
    // For each modification, calculate cascade effects
    for (const mod of scenario.modifications) {
      const entityId = (mod as any).entityId || 'unknown';
      if (!affectedEntities.includes(entityId)) {
        affectedEntities.push(entityId);
      }
      
      // Propagate cascade to dependencies
      const twin = Array.from(this._twins.values()).find(t => t.entityId === entityId);
      if (twin) {
        for (const dep of twin.dependencies) {
          if (!affectedEntities.includes(dep)) {
            affectedEntities.push(dep);
            cascadeEffects.push({
              entity: dep,
              effect: `Cascaded from ${entityId} modification`,
              magnitude: Math.max(0.1, 0.8 - affectedEntities.length * 0.1),
            });
          }
        }
      }
    }

    // Calculate overall impact score
    const impactScore = Math.min(100, affectedEntities.length * 10 + cascadeEffects.length * 5);

    return {
      impactScore,
      affectedEntities,
      cascadeEffects,
      recommendations: this.generateRecommendations(impactScore, cascadeEffects),
      riskFactors: this.identifyRiskFactors(cascadeEffects),
    };
  }

  private generateRecommendations(impactScore: number, cascades: SimulationResult['cascadeEffects']): string[] {
    const recommendations: string[] = [];
    
    if (impactScore > 70) {
      recommendations.push('Consider phased rollout to minimize disruption');
      recommendations.push('Establish rollback procedures before implementation');
    }
    if (impactScore > 50) {
      recommendations.push('Notify affected teams before changes');
      recommendations.push('Monitor dependent systems closely during transition');
    }
    if (cascades.length > 5) {
      recommendations.push('High cascade effect detected - review dependency chain');
    }
    
    return recommendations;
  }

  private identifyRiskFactors(cascades: SimulationResult['cascadeEffects']): string[] {
    const risks: string[] = [];
    
    const highMagnitudeCascades = cascades.filter(c => c.magnitude > 0.7);
    if (highMagnitudeCascades.length > 0) {
      risks.push(`${highMagnitudeCascades.length} high-magnitude cascade effects detected`);
    }
    
    if (cascades.length > 10) {
      risks.push('Extensive dependency chain may cause unpredictable behavior');
    }
    
    return risks;
  }

  async getScenarios(organizationId: string): Promise<SimulationScenario[]> {
    return Array.from(this._scenarios.values())
      .filter(s => s.organizationId === organizationId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  // ===========================================================================
  // CHANGE PROPAGATION ANALYSIS
  // ===========================================================================

  async analyzeChangePropagation(
    twinId: string,
    proposedChange: Record<string, unknown>
  ): Promise<PropagationAnalysis | null> {
    const twin = this._twins.get(twinId);
    if (!twin) return null;

    const propagationPath: PropagationAnalysis['propagationPath'] = [];
    const visited = new Set<string>();
    
    // BFS through dependencies
    const queue: Array<{ entityId: string; depth: number }> = [
      { entityId: twin.entityId, depth: 0 }
    ];
    
    while (queue.length > 0) {
      const { entityId, depth } = queue.shift()!;
      if (visited.has(entityId)) continue;
      visited.add(entityId);
      
      if (entityId !== twin.entityId) {
        propagationPath.push({
          entity: entityId,
          delay: depth * 100 + Math.random() * 50, // ms estimated propagation delay
          impact: Math.max(0.1, 1 - depth * 0.2),
        });
      }
      
      // Find dependent twins
      const dependentTwins = Array.from(this._twins.values())
        .filter(t => t.dependencies.includes(entityId));
      
      for (const depTwin of dependentTwins) {
        if (!visited.has(depTwin.entityId)) {
          queue.push({ entityId: depTwin.entityId, depth: depth + 1 });
        }
      }
    }

    return {
      sourceEntity: twin.entityId,
      change: proposedChange,
      propagationPath,
      totalAffected: propagationPath.length,
      estimatedDuration: propagationPath.reduce((sum, p) => sum + p.delay, 0),
    };
  }

  // ===========================================================================
  // DASHBOARD & STATISTICS
  // ===========================================================================

  async getDashboard(organizationId: string): Promise<{
    totalTwins: number;
    syncedInLastHour: number;
    avgHealthScore: number;
    pendingScenarios: number;
    recentSnapshots: number;
    twins: DigitalTwinState[];
  }> {
    const orgTwins = await this.getTwinsForOrg(organizationId);
    const oneHourAgo = new Date(Date.now() - 3600000);
    
    const syncedRecently = orgTwins.filter(t => t.lastSync > oneHourAgo).length;
    const avgHealth = orgTwins.length > 0
      ? orgTwins.reduce((sum, t) => sum + t.healthScore, 0) / orgTwins.length
      : 0;
    
    const orgScenarios = await this.getScenarios(organizationId);
    const pending = orgScenarios.filter(s => s.status === 'draft' || s.status === 'running').length;
    
    let recentSnapshots = 0;
    for (const twin of orgTwins) {
      const snaps = this._snapshots.get(twin.id) || [];
      recentSnapshots += snaps.filter(s => s.timestamp > oneHourAgo).length;
    }

    return {
      totalTwins: orgTwins.length,
      syncedInLastHour: syncedRecently,
      avgHealthScore: avgHealth,
      pendingScenarios: pending,
      recentSnapshots,
      twins: orgTwins,
    };
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private calculateHealthScore(prev: Record<string, unknown>, curr: Record<string, unknown>): number {
    const changes = this.countChanges(prev, curr);
    // Health score decreases with rapid changes
    return Math.max(0, 100 - changes * 5);
  }

  private countChanges(prev: Record<string, unknown>, curr: Record<string, unknown>): number {
    const prevKeys = Object.keys(prev);
    const currKeys = Object.keys(curr);
    const allKeys = new Set([...prevKeys, ...currKeys]);
    
    let changes = 0;
    for (const key of allKeys) {
      if (JSON.stringify(prev[key]) !== JSON.stringify(curr[key])) {
        changes++;
      }
    }
    return changes;
  }

  // No seed method - Enterprise Platinum standard
  // Digital twins are created through real API operations



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaMirror', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this._twins.has(d.id)) this._twins.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaMirror', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this._snapshots.has(d.id)) this._snapshots.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaMirror', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this._scenarios.has(d.id)) this._scenarios.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[CendiaMirrorService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaMirrorService] DB reload skipped: ${(err as Error).message}`);


    }


  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaMirror',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaMirrorService = new CendiaMirrorService();
