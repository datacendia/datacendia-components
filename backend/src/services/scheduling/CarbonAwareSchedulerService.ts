// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCarbonAwareÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ - Carbon-Aware AI Workload Scheduling
 * 
 * Enterprise Platinum Feature: Reduce carbon footprint of AI operations
 * 
 * Features:
 * - Real-time grid carbon intensity tracking
 * - Intelligent workload deferral
 * - Multi-region carbon optimization
 * - Carbon budget management
 * - ESG reporting integration
 */

import { v4 as uuidv4 } from 'uuid';
import { logger } from '../../utils/logger.js';

// ============================================================================
// TYPES
// ============================================================================

export type WorkloadPriority = 'critical' | 'high' | 'normal' | 'low' | 'deferrable';
export type WorkloadStatus = 'pending' | 'scheduled' | 'running' | 'completed' | 'deferred' | 'cancelled';

export interface CarbonIntensity {
  region: string;
  intensity: number;        // gCO2eq/kWh
  forecast: CarbonForecast[];
  source: string;
  timestamp: Date;
}

export interface CarbonForecast {
  hour: number;
  intensity: number;
  confidence: number;
}

export interface Workload {
  id: string;
  name: string;
  type: string;
  priority: WorkloadPriority;
  estimatedDurationMinutes: number;
  estimatedEnergyWh: number;
  preferredRegions: string[];
  maxDeferralHours: number;
  submittedAt: Date;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  status: WorkloadStatus;
  assignedRegion?: string;
  carbonEmitted?: number;
  carbonSaved?: number;
}

export interface SchedulingDecision {
  workloadId: string;
  action: 'execute_now' | 'defer' | 'relocate' | 'execute_in_region';
  reason: string;
  scheduledTime?: Date;
  assignedRegion: string;
  estimatedCarbon: number;
  carbonSavings: number;
  confidence: number;
}

export interface CarbonBudget {
  id: string;
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
  budgetKgCO2: number;
  usedKgCO2: number;
  remainingKgCO2: number;
  forecastKgCO2: number;
  status: 'on_track' | 'warning' | 'exceeded';
}

export interface CarbonReport {
  id: string;
  organizationId: string;
  periodStart: Date;
  periodEnd: Date;
  totalWorkloads: number;
  totalEnergyWh: number;
  totalCarbonKg: number;
  carbonSavedKg: number;
  avgIntensity: number;
  byRegion: Record<string, { workloads: number; carbonKg: number }>;
  byWorkloadType: Record<string, { workloads: number; carbonKg: number }>;
  optimizationRate: number;
  generatedAt: Date;
}

// ============================================================================
// CARBON INTENSITY DATA (deterministic; production upgrade: use real APIs)
// ============================================================================

const REGIONAL_CARBON_INTENSITY: Record<string, {
  base: number;
  variance: number;
  renewablePercent: number;
}> = {
  'us-west-1': { base: 180, variance: 50, renewablePercent: 45 },
  'us-west-2': { base: 120, variance: 40, renewablePercent: 65 },
  'us-east-1': { base: 350, variance: 80, renewablePercent: 25 },
  'us-east-2': { base: 400, variance: 100, renewablePercent: 20 },
  'eu-west-1': { base: 250, variance: 60, renewablePercent: 40 },
  'eu-west-2': { base: 200, variance: 50, renewablePercent: 55 },
  'eu-central-1': { base: 350, variance: 70, renewablePercent: 35 },
  'eu-north-1': { base: 50, variance: 20, renewablePercent: 90 },
  'ap-northeast-1': { base: 450, variance: 80, renewablePercent: 20 },
  'ap-southeast-1': { base: 400, variance: 90, renewablePercent: 15 },
};

// ============================================================================
// SERVICE CLASS
// ============================================================================

export class CarbonAwareSchedulerService {
  private workloads: Map<string, Workload> = new Map();
  private budgets: Map<string, CarbonBudget> = new Map();
  private intensityCache: Map<string, CarbonIntensity> = new Map();
  private readonly cacheExpiryMs = 5 * 60 * 1000; // 5 minutes

  constructor() {
    logger.info('[CendiaCarbon] Carbon-Aware SchedulerÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â€šÂ¬Ã…Â¾Ãƒâ€šÃ‚Â¢ initialized');
  }

  /**
   * Get current carbon intensity for a region
   */
  async getCarbonIntensity(region: string): Promise<CarbonIntensity> {
    const cached = this.intensityCache.get(region);
    if (cached && Date.now() - cached.timestamp.getTime() < this.cacheExpiryMs) {
      return cached;
    }

    // Deterministic carbon intensity (production upgrade: call electricity maps API or similar)
    const config = REGIONAL_CARBON_INTENSITY[region] || { base: 300, variance: 100, renewablePercent: 30 };
    const hourOfDay = new Date().getHours();
    
    // Model time-of-day variation (lower at night, higher during day)
    const timeMultiplier = 1 + 0.3 * Math.sin((hourOfDay - 14) * Math.PI / 12);
    const currentIntensity = config.base * timeMultiplier;

    // Generate 24-hour forecast
    const forecast: CarbonForecast[] = [];
    for (let h = 0; h < 24; h++) {
      const futureHour = (hourOfDay + h) % 24;
      const futureMultiplier = 1 + 0.3 * Math.sin((futureHour - 14) * Math.PI / 12);
      forecast.push({
        hour: h,
        intensity: Math.round(config.base * futureMultiplier),
        confidence: Math.max(0.5, 1 - h * 0.02),
      });
    }

    const intensity: CarbonIntensity = {
      region,
      intensity: Math.round(currentIntensity),
      forecast,
      source: 'deterministic',
      timestamp: new Date(),
    };

    this.intensityCache.set(region, intensity);
    return intensity;
  }

  /**
   * Get intensities for all regions
   */
  async getAllRegionIntensities(): Promise<CarbonIntensity[]> {
    const intensities = await Promise.all(
      Object.keys(REGIONAL_CARBON_INTENSITY).map(r => this.getCarbonIntensity(r))
    );
    return intensities.sort((a, b) => a.intensity - b.intensity);
  }

  /**
   * Submit a workload for carbon-optimized scheduling
   */
  async submitWorkload(params: {
    name: string;
    type: string;
    priority: WorkloadPriority;
    estimatedDurationMinutes: number;
    estimatedEnergyWh: number;
    preferredRegions?: string[];
    maxDeferralHours?: number;
  }): Promise<Workload> {
    const id = uuidv4();
    
    const workload: Workload = {
      id,
      name: params.name,
      type: params.type,
      priority: params.priority,
      estimatedDurationMinutes: params.estimatedDurationMinutes,
      estimatedEnergyWh: params.estimatedEnergyWh,
      preferredRegions: params.preferredRegions || Object.keys(REGIONAL_CARBON_INTENSITY),
      maxDeferralHours: params.maxDeferralHours || (params.priority === 'deferrable' ? 24 : 4),
      submittedAt: new Date(),
      status: 'pending',
    };

    this.workloads.set(id, workload);
    logger.info(`Workload submitted: ${id} (${params.name})`);
    
    return workload;
  }

  /**
   * Schedule a workload with carbon optimization
   */
  async scheduleWorkload(workloadId: string): Promise<SchedulingDecision> {
    const workload = this.workloads.get(workloadId);
    if (!workload) throw new Error('Workload not found');

    // Get carbon intensities for preferred regions
    const intensities = await Promise.all(
      workload.preferredRegions.map(async (region) => ({
        region,
        intensity: await this.getCarbonIntensity(region),
      }))
    );

    // Find best region based on current intensity
    const sortedRegions = intensities.sort((a, b) => a.intensity.intensity - b.intensity.intensity);
    const bestRegion = sortedRegions[0];
    const worstRegion = sortedRegions[sortedRegions.length - 1];

    // Calculate carbon for execution
    const energyKwh = workload.estimatedEnergyWh / 1000;
    const estimatedCarbon = energyKwh * bestRegion.intensity.intensity; // gCO2eq
    const worstCaseCarbon = energyKwh * worstRegion.intensity.intensity;
    const carbonSavings = worstCaseCarbon - estimatedCarbon;

    // Check if we should defer based on forecast
    let decision: SchedulingDecision;
    
    if (workload.priority === 'critical' || workload.priority === 'high') {
      // Execute immediately in best region
      decision = {
        workloadId,
        action: 'execute_in_region',
        reason: `Priority ${workload.priority} - executing in lowest carbon region`,
        assignedRegion: bestRegion.region,
        estimatedCarbon,
        carbonSavings,
        confidence: 0.95,
      };
    } else {
      // Check if deferral would save significant carbon
      const forecast = bestRegion.intensity.forecast;
      const betterHour = forecast.find(f => f.intensity < bestRegion.intensity.intensity * 0.8);
      
      if (betterHour && betterHour.hour <= workload.maxDeferralHours) {
        const scheduledTime = new Date(Date.now() + betterHour.hour * 60 * 60 * 1000);
        const deferredCarbon = energyKwh * betterHour.intensity;
        
        decision = {
          workloadId,
          action: 'defer',
          reason: `Deferring ${betterHour.hour}h for ${Math.round((1 - betterHour.intensity / bestRegion.intensity.intensity) * 100)}% lower carbon`,
          scheduledTime,
          assignedRegion: bestRegion.region,
          estimatedCarbon: deferredCarbon,
          carbonSavings: worstCaseCarbon - deferredCarbon,
          confidence: betterHour.confidence,
        };
        workload.status = 'deferred';
      } else {
        decision = {
          workloadId,
          action: 'execute_now',
          reason: 'No significant carbon savings from deferral',
          assignedRegion: bestRegion.region,
          estimatedCarbon,
          carbonSavings,
          confidence: 0.9,
        };
      }
    }

    // Update workload
    workload.assignedRegion = decision.assignedRegion;
    workload.scheduledAt = decision.scheduledTime || new Date();
    if (decision.action !== 'defer') {
      workload.status = 'scheduled';
    }

    logger.info(`Workload scheduled: ${workloadId} -> ${decision.action} in ${decision.assignedRegion}`);
    return decision;
  }

  /**
   * Execute a workload
   */
  async executeWorkload(workloadId: string): Promise<Workload> {
    const workload = this.workloads.get(workloadId);
    if (!workload) throw new Error('Workload not found');

    workload.status = 'running';
    workload.startedAt = new Date();

    // Execute task
    const region = workload.assignedRegion || 'us-west-2';
    const intensity = await this.getCarbonIntensity(region);
    const energyKwh = workload.estimatedEnergyWh / 1000;
    workload.carbonEmitted = energyKwh * intensity.intensity;

    // Calculate savings vs worst region
    const worstConfig = Object.values(REGIONAL_CARBON_INTENSITY).reduce((max, c) => c.base > max.base ? c : max);
    workload.carbonSaved = energyKwh * worstConfig.base - workload.carbonEmitted;

    workload.status = 'completed';
    workload.completedAt = new Date();

    logger.info(`Workload completed: ${workloadId} - ${workload.carbonEmitted.toFixed(2)}g CO2 emitted, ${workload.carbonSaved.toFixed(2)}g saved`);
    return workload;
  }

  /**
   * Get or create carbon budget
   */
  async getCarbonBudget(organizationId: string): Promise<CarbonBudget> {
    const existing = this.budgets.get(organizationId);
    if (existing) return existing;

    const now = new Date();
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    const budget: CarbonBudget = {
      id: uuidv4(),
      organizationId,
      periodStart,
      periodEnd,
      budgetKgCO2: 1000, // Default 1 ton/month
      usedKgCO2: 0,
      remainingKgCO2: 1000,
      forecastKgCO2: 0,
      status: 'on_track',
    };

    this.budgets.set(organizationId, budget);
    return budget;
  }

  /**
   * Update carbon budget with workload
   */
  updateBudget(organizationId: string, carbonGrams: number): CarbonBudget {
    const budget = this.budgets.get(organizationId);
    if (!budget) throw new Error('Budget not found');

    budget.usedKgCO2 += carbonGrams / 1000;
    budget.remainingKgCO2 = budget.budgetKgCO2 - budget.usedKgCO2;
    
    const usageRate = budget.usedKgCO2 / budget.budgetKgCO2;
    budget.status = usageRate > 1 ? 'exceeded' : usageRate > 0.8 ? 'warning' : 'on_track';

    return budget;
  }

  /**
   * Generate carbon report
   */
  async generateReport(organizationId: string): Promise<CarbonReport> {
    const workloads = Array.from(this.workloads.values()).filter(w => w.status === 'completed');
    
    const byRegion: Record<string, { workloads: number; carbonKg: number }> = {};
    const byWorkloadType: Record<string, { workloads: number; carbonKg: number }> = {};
    let totalEnergy = 0;
    let totalCarbon = 0;
    let totalSaved = 0;

    for (const w of workloads) {
      totalEnergy += w.estimatedEnergyWh;
      totalCarbon += (w.carbonEmitted || 0);
      totalSaved += (w.carbonSaved || 0);

      const region = w.assignedRegion || 'unknown';
      if (!byRegion[region]) byRegion[region] = { workloads: 0, carbonKg: 0 };
      byRegion[region].workloads++;
      byRegion[region].carbonKg += (w.carbonEmitted || 0) / 1000;

      if (!byWorkloadType[w.type]) byWorkloadType[w.type] = { workloads: 0, carbonKg: 0 };
      byWorkloadType[w.type].workloads++;
      byWorkloadType[w.type].carbonKg += (w.carbonEmitted || 0) / 1000;
    }

    const now = new Date();
    return {
      id: uuidv4(),
      organizationId,
      periodStart: new Date(now.getFullYear(), now.getMonth(), 1),
      periodEnd: now,
      totalWorkloads: workloads.length,
      totalEnergyWh: totalEnergy,
      totalCarbonKg: totalCarbon / 1000,
      carbonSavedKg: totalSaved / 1000,
      avgIntensity: workloads.length > 0 ? totalCarbon / (totalEnergy / 1000) : 0,
      byRegion,
      byWorkloadType,
      optimizationRate: totalCarbon > 0 ? totalSaved / (totalCarbon + totalSaved) : 0,
      generatedAt: new Date(),
    };
  }

  /**
   * Get workload by ID
   */
  getWorkload(id: string): Workload | undefined {
    return this.workloads.get(id);
  }

  /**
   * List workloads
   */
  listWorkloads(status?: WorkloadStatus): Workload[] {
    const all = Array.from(this.workloads.values());
    return status ? all.filter(w => w.status === status) : all;
  }
}

export const carbonAwareSchedulerService = new CarbonAwareSchedulerService();
