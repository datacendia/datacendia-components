/**
 * Service — Stressor Library Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports StressorLibraryService, STRESSOR_SCENARIO_PRESETS, stressorLibraryService
 * @module services/scge/StressorLibraryService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Stressor Library Service
 * 
 * Manages stressors for governance simulation stress testing.
 * Stressors simulate infrastructure failure, trust collapse, demand spikes, etc.
 */

import {
  Stressor,
  StressorSchedule,
  ScheduledStressor,
  StressorType,
  StressorIntensity,
  StressorOnset,
  StressorParameters,
  MitigationOption,
  DEFAULT_STRESSOR_LIBRARY,
  generateSCGEId,
  hashSCGEState,
} from './types.js';

// =============================================================================
// SEEDED RANDOM NUMBER GENERATOR
// =============================================================================

class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 1103515245 + 12345) & 0x7fffffff;
    return this.seed / 0x7fffffff;
  }

  nextInRange(min: number, max: number): number {
    return min + this.next() * (max - min);
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.nextInRange(min, max + 1));
  }

  pick<T>(array: T[]): T {
    return array[this.nextInt(0, array.length - 1)]!;
  }
}

// =============================================================================
// STRESSOR LIBRARY SERVICE
// =============================================================================

export class StressorLibraryService {
  private stressors: Map<string, Stressor> = new Map();
  private schedules: Map<string, StressorSchedule> = new Map();

  constructor() {
    // Initialize with default stressor library
    for (const stressor of DEFAULT_STRESSOR_LIBRARY) {
      this.stressors.set(stressor.id, stressor);
    }
  }

  /**
   * Create a custom stressor
   */
  createStressor(
    type: StressorType,
    name: string,
    description: string,
    intensity: StressorIntensity,
    onset: StressorOnset,
    duration: number,
    affectedSystems: string[],
    parameters: Partial<StressorParameters> = {},
    mitigationOptions: MitigationOption[] = []
  ): Stressor {
    const fullParameters: StressorParameters = {
      impactRadius: parameters.impactRadius ?? 0.5,
      recoveryRate: parameters.recoveryRate ?? 0.1,
      cascadeProbability: parameters.cascadeProbability ?? 0.2,
      detectionDifficulty: parameters.detectionDifficulty ?? 0.3,
      customParameters: parameters.customParameters ?? {},
    };

    const stressor: Stressor = {
      id: generateSCGEId('str'),
      type,
      name,
      description,
      intensity,
      onset,
      duration,
      affectedSystems,
      parameters: fullParameters,
      mitigationOptions,
    };

    this.stressors.set(stressor.id, stressor);
    return stressor;
  }

  /**
   * Get stressor by ID
   */
  getStressor(stressorId: string): Stressor | undefined {
    return this.stressors.get(stressorId);
  }

  /**
   * List all stressors
   */
  listStressors(): Stressor[] {
    return Array.from(this.stressors.values());
  }

  /**
   * List stressors by type
   */
  listStressorsByType(type: StressorType): Stressor[] {
    return Array.from(this.stressors.values()).filter(s => s.type === type);
  }

  /**
   * Create a stressor schedule
   */
  createSchedule(
    scheduledStressors: ScheduledStressor[],
    seed: number
  ): StressorSchedule {
    const schedule: StressorSchedule = {
      id: generateSCGEId('sched'),
      stressors: scheduledStressors,
      seed,
      hash: '',
    };

    schedule.hash = hashSCGEState(schedule);
    this.schedules.set(schedule.id, schedule);

    return schedule;
  }

  /**
   * Generate a random stressor schedule for stress testing
   */
  generateRandomSchedule(
    stressorCount: number,
    maxDuration: number,
    seed: number
  ): StressorSchedule {
    const rng = new SeededRandom(seed);
    const allStressors = this.listStressors();
    const scheduledStressors: ScheduledStressor[] = [];

    for (let i = 0; i < stressorCount; i++) {
      const stressor = rng.pick(allStressors);
      const activationTime = rng.nextInt(0, maxDuration - stressor.duration);
      
      scheduledStressors.push({
        stressor,
        activationTime,
        deactivationTime: activationTime + stressor.duration,
        layeredWith: [],
      });
    }

    // Sort by activation time
    scheduledStressors.sort((a, b) => a.activationTime - b.activationTime);

    // Detect overlapping stressors (layering)
    for (let i = 0; i < scheduledStressors.length; i++) {
      const current = scheduledStressors[i]!;
      for (let j = 0; j < scheduledStressors.length; j++) {
        if (i === j) continue;
        const other = scheduledStressors[j]!;
        
        // Check if overlapping
        if (current.activationTime < (other.deactivationTime ?? Infinity) &&
            (current.deactivationTime ?? Infinity) > other.activationTime) {
          current.layeredWith.push(other.stressor.id);
        }
      }
    }

    return this.createSchedule(scheduledStressors, seed);
  }

  /**
   * Get active stressors at a given simulation time
   */
  getActiveStressors(
    schedule: StressorSchedule,
    simulationTime: number
  ): Stressor[] {
    const activeStressors: Stressor[] = [];

    for (const scheduled of schedule.stressors) {
      const endTime = scheduled.deactivationTime ?? 
        (scheduled.activationTime + scheduled.stressor.duration);

      if (simulationTime >= scheduled.activationTime && simulationTime < endTime) {
        activeStressors.push(scheduled.stressor);
      }
    }

    return activeStressors;
  }

  /**
   * Calculate combined stressor impact
   */
  calculateCombinedImpact(stressors: Stressor[]): StressorImpactAnalysis {
    if (stressors.length === 0) {
      return {
        totalIntensity: 0,
        affectedSystems: [],
        cascadeRisk: 0,
        recoveryEstimate: 0,
        mitigationPriority: [],
      };
    }

    // Collect all affected systems
    const affectedSystemsSet = new Set<string>();
    for (const stressor of stressors) {
      for (const system of stressor.affectedSystems) {
        affectedSystemsSet.add(system);
      }
    }

    // Calculate combined intensity (non-linear - compounding effect)
    let totalIntensity = 0;
    for (const stressor of stressors) {
      const intensityValue = this.intensityToValue(stressor.intensity);
      totalIntensity = totalIntensity + intensityValue * (1 - totalIntensity * 0.3);
    }
    totalIntensity = Math.min(1.0, totalIntensity);

    // Calculate cascade risk
    let cascadeRisk = 0;
    for (const stressor of stressors) {
      cascadeRisk = Math.max(cascadeRisk, stressor.parameters.cascadeProbability);
    }
    // Multiple stressors increase cascade risk
    cascadeRisk = Math.min(1.0, cascadeRisk * (1 + (stressors.length - 1) * 0.2));

    // Estimate recovery time
    let maxRecoveryTime = 0;
    for (const stressor of stressors) {
      const recoveryTime = stressor.duration / stressor.parameters.recoveryRate;
      maxRecoveryTime = Math.max(maxRecoveryTime, recoveryTime);
    }

    // Prioritize mitigations
    const mitigationPriority: MitigationPriority[] = [];
    for (const stressor of stressors) {
      for (const mitigation of stressor.mitigationOptions) {
        mitigationPriority.push({
          stressorId: stressor.id,
          mitigationId: mitigation.id,
          mitigationName: mitigation.name,
          effectiveness: mitigation.effectiveness,
          cost: mitigation.cost,
          priority: mitigation.effectiveness / (mitigation.cost + 1),
        });
      }
    }
    mitigationPriority.sort((a, b) => b.priority - a.priority);

    return {
      totalIntensity,
      affectedSystems: Array.from(affectedSystemsSet),
      cascadeRisk,
      recoveryEstimate: maxRecoveryTime,
      mitigationPriority: mitigationPriority.slice(0, 5),
    };
  }

  /**
   * Apply mitigation to a stressor
   */
  applyMitigation(
    stressor: Stressor,
    mitigationId: string
  ): MitigationResult {
    const mitigation = stressor.mitigationOptions.find(m => m.id === mitigationId);
    if (!mitigation) {
      return {
        success: false,
        error: `Mitigation not found: ${mitigationId}`,
        newIntensity: this.intensityToValue(stressor.intensity),
        sideEffects: [],
      };
    }

    const currentIntensity = this.intensityToValue(stressor.intensity);
    const newIntensity = currentIntensity * (1 - mitigation.effectiveness);

    return {
      success: true,
      mitigationApplied: mitigation.name,
      newIntensity,
      intensityReduction: currentIntensity - newIntensity,
      costIncurred: mitigation.cost,
      timeToEffect: mitigation.timeToImplement,
      sideEffects: mitigation.sideEffects,
    };
  }

  /**
   * Get schedule by ID
   */
  getSchedule(scheduleId: string): StressorSchedule | undefined {
    return this.schedules.get(scheduleId);
  }

  /**
   * List all schedules
   */
  listSchedules(): StressorSchedule[] {
    return Array.from(this.schedules.values());
  }

  /**
   * Verify schedule integrity
   */
  verifyScheduleIntegrity(schedule: StressorSchedule): boolean {
    const storedHash = schedule.hash;
    const tempSchedule = { ...schedule, hash: '' };
    const computedHash = hashSCGEState(tempSchedule);
    return storedHash === computedHash;
  }

  private intensityToValue(intensity: StressorIntensity): number {
    switch (intensity) {
      case StressorIntensity.MINIMAL: return 0.1;
      case StressorIntensity.LOW: return 0.25;
      case StressorIntensity.MODERATE: return 0.5;
      case StressorIntensity.HIGH: return 0.7;
      case StressorIntensity.CRITICAL: return 0.85;
      case StressorIntensity.CATASTROPHIC: return 1.0;
    }
  }
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

interface StressorImpactAnalysis {
  totalIntensity: number;
  affectedSystems: string[];
  cascadeRisk: number;
  recoveryEstimate: number;
  mitigationPriority: MitigationPriority[];
}

interface MitigationPriority {
  stressorId: string;
  mitigationId: string;
  mitigationName: string;
  effectiveness: number;
  cost: number;
  priority: number;
}

interface MitigationResult {
  success: boolean;
  error?: string;
  mitigationApplied?: string;
  newIntensity: number;
  intensityReduction?: number;
  costIncurred?: number;
  timeToEffect?: number;
  sideEffects: string[];
}

// =============================================================================
// STRESSOR SCENARIO PRESETS
// =============================================================================

export const STRESSOR_SCENARIO_PRESETS = {
  LIGHT_STRESS: {
    name: 'Light Stress',
    description: 'Minor operational challenges',
    stressorCount: 2,
    maxIntensity: StressorIntensity.LOW,
  },
  MODERATE_STRESS: {
    name: 'Moderate Stress',
    description: 'Significant but manageable challenges',
    stressorCount: 4,
    maxIntensity: StressorIntensity.MODERATE,
  },
  HEAVY_STRESS: {
    name: 'Heavy Stress',
    description: 'Major operational challenges',
    stressorCount: 6,
    maxIntensity: StressorIntensity.HIGH,
  },
  CRISIS: {
    name: 'Crisis',
    description: 'Cascading failures and critical challenges',
    stressorCount: 8,
    maxIntensity: StressorIntensity.CRITICAL,
  },
  CATASTROPHIC: {
    name: 'Catastrophic',
    description: 'System-wide stress testing',
    stressorCount: 12,
    maxIntensity: StressorIntensity.CATASTROPHIC,
  },
};

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const stressorLibraryService = new StressorLibraryService();