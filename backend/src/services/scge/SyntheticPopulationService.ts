// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Synthetic Population Service
 * 
 * Generates and manages synthetic population distributions
 * for governance simulation stress testing.
 * 
 * CRITICAL: This models STATISTICAL DISTRIBUTIONS, not people.
 * No real individuals, no identities, no demographics.
 * Only: access variance, information asymmetry, resource constraints.
 */

import {
  SyntheticPopulation,
  PopulationDistribution,
  PopulationParameters,
  PopulationSegment,
  AccessVariance,
  InformationAsymmetry,
  MobilityConstraint,
  ResourceScarcity,
  ComplianceVariance,
  PopulationMetadata,
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
// DISTRIBUTION GENERATORS
// =============================================================================

interface DistributionConfig {
  lowAccessPercent: number;
  mediumAccessPercent: number;
  highAccessPercent: number;
}

function getDistributionConfigForVariance(variance: AccessVariance): DistributionConfig {
  switch (variance) {
    case AccessVariance.UNIFORM:
      return { lowAccessPercent: 33, mediumAccessPercent: 34, highAccessPercent: 33 };
    case AccessVariance.MODERATE:
      return { lowAccessPercent: 25, mediumAccessPercent: 50, highAccessPercent: 25 };
    case AccessVariance.HIGH:
      return { lowAccessPercent: 40, mediumAccessPercent: 35, highAccessPercent: 25 };
    case AccessVariance.EXTREME:
      return { lowAccessPercent: 55, mediumAccessPercent: 30, highAccessPercent: 15 };
  }
}

function mapToInformationAsymmetry(
  segment: PopulationSegment,
  baseLevel: InformationAsymmetry,
  rng: SeededRandom
): InformationAsymmetry {
  const levels = Object.values(InformationAsymmetry);
  const baseIndex = levels.indexOf(baseLevel);
  
  let adjustment = 0;
  if (segment === PopulationSegment.LOW_ACCESS) {
    adjustment = rng.nextInt(0, 2); // Tends higher
  } else if (segment === PopulationSegment.HIGH_ACCESS) {
    adjustment = rng.nextInt(-2, 0); // Tends lower
  } else {
    adjustment = rng.nextInt(-1, 1);
  }
  
  const newIndex = Math.max(0, Math.min(levels.length - 1, baseIndex + adjustment));
  return levels[newIndex]!;
}

function mapToMobilityConstraint(
  segment: PopulationSegment,
  baseLevel: MobilityConstraint,
  rng: SeededRandom
): MobilityConstraint {
  const levels = Object.values(MobilityConstraint);
  const baseIndex = levels.indexOf(baseLevel);
  
  let adjustment = 0;
  if (segment === PopulationSegment.LOW_ACCESS) {
    adjustment = rng.nextInt(0, 2);
  } else if (segment === PopulationSegment.HIGH_ACCESS) {
    adjustment = rng.nextInt(-2, 0);
  } else {
    adjustment = rng.nextInt(-1, 1);
  }
  
  const newIndex = Math.max(0, Math.min(levels.length - 1, baseIndex + adjustment));
  return levels[newIndex]!;
}

function mapToResourceScarcity(
  segment: PopulationSegment,
  baseLevel: ResourceScarcity,
  rng: SeededRandom
): ResourceScarcity {
  const levels = Object.values(ResourceScarcity);
  const baseIndex = levels.indexOf(baseLevel);
  
  let adjustment = 0;
  if (segment === PopulationSegment.LOW_ACCESS) {
    adjustment = rng.nextInt(0, 2);
  } else if (segment === PopulationSegment.HIGH_ACCESS) {
    adjustment = rng.nextInt(-2, 0);
  } else {
    adjustment = rng.nextInt(-1, 1);
  }
  
  const newIndex = Math.max(0, Math.min(levels.length - 1, baseIndex + adjustment));
  return levels[newIndex]!;
}

function mapToComplianceVariance(
  segment: PopulationSegment,
  baseLevel: ComplianceVariance,
  rng: SeededRandom
): ComplianceVariance {
  const levels = Object.values(ComplianceVariance);
  const baseIndex = levels.indexOf(baseLevel);
  
  const adjustment = rng.nextInt(-1, 1);
  const newIndex = Math.max(0, Math.min(levels.length - 1, baseIndex + adjustment));
  return levels[newIndex]!;
}

// =============================================================================
// SYNTHETIC POPULATION SERVICE
// =============================================================================

export class SyntheticPopulationService {
  private populations: Map<string, SyntheticPopulation> = new Map();

  /**
   * Generate a synthetic population based on parameters
   */
  generatePopulation(params: PopulationParameters): SyntheticPopulation {
    const seed = params.seed ?? Date.now();
    const rng = new SeededRandom(seed);
    
    const distributionConfig = getDistributionConfigForVariance(params.accessVarianceLevel);
    
    const distributions: PopulationDistribution[] = [
      {
        segment: PopulationSegment.LOW_ACCESS,
        percentage: distributionConfig.lowAccessPercent,
        accessVariance: params.accessVarianceLevel,
        informationAsymmetry: mapToInformationAsymmetry(
          PopulationSegment.LOW_ACCESS,
          params.informationAsymmetryLevel,
          rng
        ),
        mobilityConstraint: mapToMobilityConstraint(
          PopulationSegment.LOW_ACCESS,
          params.mobilityConstraintLevel,
          rng
        ),
        resourceScarcity: mapToResourceScarcity(
          PopulationSegment.LOW_ACCESS,
          params.resourceScarcityLevel,
          rng
        ),
        complianceVariance: mapToComplianceVariance(
          PopulationSegment.LOW_ACCESS,
          params.complianceVarianceLevel,
          rng
        ),
      },
      {
        segment: PopulationSegment.MEDIUM_ACCESS,
        percentage: distributionConfig.mediumAccessPercent,
        accessVariance: params.accessVarianceLevel,
        informationAsymmetry: mapToInformationAsymmetry(
          PopulationSegment.MEDIUM_ACCESS,
          params.informationAsymmetryLevel,
          rng
        ),
        mobilityConstraint: mapToMobilityConstraint(
          PopulationSegment.MEDIUM_ACCESS,
          params.mobilityConstraintLevel,
          rng
        ),
        resourceScarcity: mapToResourceScarcity(
          PopulationSegment.MEDIUM_ACCESS,
          params.resourceScarcityLevel,
          rng
        ),
        complianceVariance: mapToComplianceVariance(
          PopulationSegment.MEDIUM_ACCESS,
          params.complianceVarianceLevel,
          rng
        ),
      },
      {
        segment: PopulationSegment.HIGH_ACCESS,
        percentage: distributionConfig.highAccessPercent,
        accessVariance: params.accessVarianceLevel,
        informationAsymmetry: mapToInformationAsymmetry(
          PopulationSegment.HIGH_ACCESS,
          params.informationAsymmetryLevel,
          rng
        ),
        mobilityConstraint: mapToMobilityConstraint(
          PopulationSegment.HIGH_ACCESS,
          params.mobilityConstraintLevel,
          rng
        ),
        resourceScarcity: mapToResourceScarcity(
          PopulationSegment.HIGH_ACCESS,
          params.resourceScarcityLevel,
          rng
        ),
        complianceVariance: mapToComplianceVariance(
          PopulationSegment.HIGH_ACCESS,
          params.complianceVarianceLevel,
          rng
        ),
      },
    ];

    const metadata: PopulationMetadata = {
      version: 1,
      description: `Synthetic population with ${params.size} units, ${params.accessVarianceLevel} access variance`,
      assumptions: [
        'Population is synthetic and does not represent real individuals',
        'Distributions are for system stress-testing only',
        'No demographic or identity data is modeled',
        'Parameters represent system access constraints, not human characteristics',
      ],
      limitations: [
        'Does not model individual behavior',
        'Does not predict real-world outcomes',
        'Statistical only - not suitable for individual-level inference',
      ],
      validityRange: {
        start: new Date(),
        end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
      },
    };

    const population: SyntheticPopulation = {
      id: generateSCGEId('pop'),
      name: `Population-${seed}`,
      totalSize: params.size,
      distributions,
      generationSeed: seed,
      generatedAt: new Date(),
      hash: '',
      metadata,
    };

    population.hash = hashSCGEState(population);
    this.populations.set(population.id, population);

    return population;
  }

  /**
   * Get population by ID
   */
  getPopulation(id: string): SyntheticPopulation | undefined {
    return this.populations.get(id);
  }

  /**
   * List all populations
   */
  listPopulations(): SyntheticPopulation[] {
    return Array.from(this.populations.values());
  }

  /**
   * Calculate segment sizes from population
   */
  getSegmentSizes(population: SyntheticPopulation): Record<PopulationSegment, number> {
    const sizes: Record<PopulationSegment, number> = {
      [PopulationSegment.LOW_ACCESS]: 0,
      [PopulationSegment.MEDIUM_ACCESS]: 0,
      [PopulationSegment.HIGH_ACCESS]: 0,
    };

    for (const dist of population.distributions) {
      sizes[dist.segment] = Math.floor(population.totalSize * (dist.percentage / 100));
    }

    return sizes;
  }

  /**
   * Calculate impact distribution for a policy/event
   */
  calculateImpactDistribution(
    population: SyntheticPopulation,
    impactByAccess: Record<PopulationSegment, number>
  ): {
    totalImpacted: number;
    impactBySegment: Record<PopulationSegment, number>;
    equityScore: number;
    varianceScore: number;
  } {
    const segmentSizes = this.getSegmentSizes(population);
    const impactBySegment: Record<PopulationSegment, number> = {
      [PopulationSegment.LOW_ACCESS]: 0,
      [PopulationSegment.MEDIUM_ACCESS]: 0,
      [PopulationSegment.HIGH_ACCESS]: 0,
    };

    let totalImpacted = 0;
    const impacts: number[] = [];

    for (const segment of Object.values(PopulationSegment)) {
      const segmentSize = segmentSizes[segment];
      const impactRate = impactByAccess[segment];
      const impacted = Math.floor(segmentSize * impactRate);
      
      impactBySegment[segment] = impacted;
      totalImpacted += impacted;
      impacts.push(impactRate);
    }

    // Calculate equity score (1.0 = perfectly equal, 0.0 = maximally unequal)
    const avgImpact = impacts.reduce((a, b) => a + b, 0) / impacts.length;
    const variance = impacts.reduce((sum, val) => sum + Math.pow(val - avgImpact, 2), 0) / impacts.length;
    const maxVariance = 0.25; // Maximum possible variance for rates 0-1
    const equityScore = 1 - Math.min(1, variance / maxVariance);

    return {
      totalImpacted,
      impactBySegment,
      equityScore,
      varianceScore: variance,
    };
  }

  /**
   * Apply stressor effects to population distribution
   */
  applyStressorToPopulation(
    population: SyntheticPopulation,
    stressorType: string,
    intensity: number // 0.0 to 1.0
  ): {
    affectedDistributions: PopulationDistribution[];
    resilienceScore: number;
    vulnerabilityReport: VulnerabilityReport;
  } {
    const affectedDistributions: PopulationDistribution[] = [];
    const vulnerabilities: VulnerabilityItem[] = [];

    for (const dist of population.distributions) {
      // Low access segments are more vulnerable to stressors
      let vulnerabilityMultiplier = 1.0;
      if (dist.segment === PopulationSegment.LOW_ACCESS) {
        vulnerabilityMultiplier = 1.5;
      } else if (dist.segment === PopulationSegment.HIGH_ACCESS) {
        vulnerabilityMultiplier = 0.7;
      }

      // Calculate effective impact
      const effectiveImpact = intensity * vulnerabilityMultiplier;
      
      // Resource scarcity amplifies vulnerability
      const scarcityMultiplier = this.getScarcityMultiplier(dist.resourceScarcity);
      const finalImpact = Math.min(1.0, effectiveImpact * scarcityMultiplier);

      if (finalImpact > 0.1) {
        vulnerabilities.push({
          segment: dist.segment,
          vulnerabilityLevel: finalImpact,
          contributingFactors: [
            `Resource scarcity: ${dist.resourceScarcity}`,
            `Mobility constraints: ${dist.mobilityConstraint}`,
            `Information asymmetry: ${dist.informationAsymmetry}`,
          ],
        });
      }

      affectedDistributions.push({
        ...dist,
        // Stressors can temporarily shift distributions
      });
    }

    // Calculate overall resilience score
    const avgVulnerability = vulnerabilities.length > 0
      ? vulnerabilities.reduce((sum, v) => sum + v.vulnerabilityLevel, 0) / vulnerabilities.length
      : 0;
    const resilienceScore = 1 - avgVulnerability;

    return {
      affectedDistributions,
      resilienceScore,
      vulnerabilityReport: {
        stressorType,
        intensity,
        vulnerabilities,
        timestamp: new Date(),
      },
    };
  }

  private getScarcityMultiplier(scarcity: ResourceScarcity): number {
    switch (scarcity) {
      case ResourceScarcity.ABUNDANT: return 0.5;
      case ResourceScarcity.ADEQUATE: return 0.75;
      case ResourceScarcity.CONSTRAINED: return 1.0;
      case ResourceScarcity.SCARCE: return 1.25;
      case ResourceScarcity.CRITICAL: return 1.5;
    }
  }

  /**
   * Verify population integrity
   */
  verifyPopulationIntegrity(population: SyntheticPopulation): boolean {
    const storedHash = population.hash;
    const tempPopulation = { ...population, hash: '' };
    const computedHash = hashSCGEState(tempPopulation);
    return storedHash === computedHash;
  }

  /**
   * Generate deterministic population for replay
   */
  regeneratePopulation(
    params: PopulationParameters,
    expectedHash: string
  ): { population: SyntheticPopulation; verified: boolean } {
    const population = this.generatePopulation(params);
    const verified = population.hash === expectedHash;
    return { population, verified };
  }
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

interface VulnerabilityItem {
  segment: PopulationSegment;
  vulnerabilityLevel: number;
  contributingFactors: string[];
}

interface VulnerabilityReport {
  stressorType: string;
  intensity: number;
  vulnerabilities: VulnerabilityItem[];
  timestamp: Date;
}

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const syntheticPopulationService = new SyntheticPopulationService();
