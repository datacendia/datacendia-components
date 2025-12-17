// @ts-nocheck
// =============================================================================
// CENDIAHABITAT™ - FACILITIES & REAL ESTATE INTELLIGENCE
// "The Building Brain" - AI-powered workplace optimization
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface HabitatZone {
  id: string;
  name: string;
  floor: number;
  building: string;
  type: 'office' | 'meeting' | 'focus' | 'collaboration' | 'wellness' | 'cafeteria' | 'lobby';
  squareFootage: number;
  maxOccupancy: number;
  currentOccupancy: number;
  sensors: ZoneSensors;
  amenities: string[];
  reservable: boolean;
  costPerSqFt: number;
  lastUpdated: Date;
}

export interface ZoneSensors {
  temperature: number; // Celsius
  humidity: number; // Percentage
  co2Level: number; // PPM
  lightLevel: number; // Lux
  noiseLevel: number; // dB
  airQualityIndex: number; // 0-500
  occupancyDetected: boolean;
  motionLastDetected?: Date;
}

export interface BioSyncRecommendation {
  zoneId: string;
  teamId: string;
  stressLevel: 'low' | 'medium' | 'high' | 'critical';
  currentConditions: ZoneSensors;
  recommendations: EnvironmentAdjustment[];
  breakSchedule: BreakRecommendation[];
  productivityForecast: number;
  wellnessScore: number;
  generatedAt: Date;
}

export interface EnvironmentAdjustment {
  parameter: 'temperature' | 'lighting' | 'ventilation' | 'noise' | 'humidity';
  currentValue: number;
  targetValue: number;
  reason: string;
  priority: 'immediate' | 'soon' | 'optional';
  automatable: boolean;
}

export interface BreakRecommendation {
  time: string;
  duration: number; // minutes
  type: 'movement' | 'hydration' | 'fresh_air' | 'social' | 'meditation';
  location?: string;
  reason: string;
}

export interface SpaceUtilization {
  zoneId: string;
  period: 'hourly' | 'daily' | 'weekly' | 'monthly';
  averageOccupancy: number;
  peakOccupancy: number;
  peakTimes: string[];
  utilizationRate: number;
  costEfficiency: number;
  recommendations: string[];
}

export interface RealEstateOptimization {
  totalSquareFootage: number;
  utilizationRate: number;
  costPerEmployee: number;
  underutilizedZones: { zone: HabitatZone; utilizationRate: number; recommendation: string }[];
  consolidationOpportunities: ConsolidationOpportunity[];
  expansionNeeds: ExpansionNeed[];
  annualSavingsPotential: number;
  aiAnalysis: string;
  generatedAt: Date;
}

export interface ConsolidationOpportunity {
  zones: string[];
  currentCost: number;
  projectedCost: number;
  savings: number;
  feasibility: 'high' | 'medium' | 'low';
  disruption: 'minimal' | 'moderate' | 'significant';
  recommendation: string;
}

export interface ExpansionNeed {
  department: string;
  currentHeadcount: number;
  projectedHeadcount: number;
  additionalSpaceNeeded: number;
  urgency: 'immediate' | '3_months' | '6_months' | '12_months';
  preferredZoneType: string;
}

export interface EnergyAnalysis {
  buildingId: string;
  period: string;
  totalConsumption: number; // kWh
  costTotal: number;
  breakdownBySystem: { system: string; percentage: number; consumption: number }[];
  comparisonToPrevious: number;
  anomalies: EnergyAnomaly[];
  optimizations: EnergyOptimization[];
  carbonFootprint: number;
}

export interface EnergyAnomaly {
  system: string;
  zone: string;
  anomalyType: 'spike' | 'waste' | 'inefficiency' | 'equipment_failure';
  severity: 'low' | 'medium' | 'high';
  estimatedWaste: number;
  possibleCause: string;
  detectedAt: Date;
}

export interface EnergyOptimization {
  action: string;
  system: string;
  estimatedSavings: number;
  implementationCost: number;
  paybackPeriod: number; // months
  carbonReduction: number;
  priority: number;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaHabitatService {
  private zones: Map<string, HabitatZone> = new Map();
  private sensorHistory: Map<string, ZoneSensors[]> = new Map();
  private utilizationData: Map<string, SpaceUtilization> = new Map();

  constructor() {
    logger.info('CendiaHabitat™ initialized - The Building Brain is online');
  }

  // ---------------------------------------------------------------------------
  // ZONE MANAGEMENT
  // ---------------------------------------------------------------------------

  registerZone(zone: Omit<HabitatZone, 'id' | 'lastUpdated'>): HabitatZone {
    const newZone: HabitatZone = {
      ...zone,
      id: `zone-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      lastUpdated: new Date(),
    };
    this.zones.set(newZone.id, newZone);
    this.sensorHistory.set(newZone.id, []);
    logger.info(`CendiaHabitat: Registered zone ${newZone.name} (${newZone.id})`);
    return newZone;
  }

  updateSensors(zoneId: string, sensors: Partial<ZoneSensors>): HabitatZone | null {
    const zone = this.zones.get(zoneId);
    if (!zone) return null;

    zone.sensors = { ...zone.sensors, ...sensors };
    zone.lastUpdated = new Date();

    // Store sensor history for analytics
    const history = this.sensorHistory.get(zoneId) || [];
    history.push({ ...zone.sensors });
    if (history.length > 1000) history.shift(); // Keep last 1000 readings
    this.sensorHistory.set(zoneId, history);

    return zone;
  }

  updateOccupancy(zoneId: string, count: number): HabitatZone | null {
    const zone = this.zones.get(zoneId);
    if (!zone) return null;

    zone.currentOccupancy = Math.max(0, Math.min(count, zone.maxOccupancy));
    zone.sensors.occupancyDetected = count > 0;
    zone.sensors.motionLastDetected = count > 0 ? new Date() : zone.sensors.motionLastDetected;
    zone.lastUpdated = new Date();

    return zone;
  }

  getZone(zoneId: string): HabitatZone | null {
    return this.zones.get(zoneId) || null;
  }

  getAllZones(): HabitatZone[] {
    return Array.from(this.zones.values());
  }

  getZonesByType(type: HabitatZone['type']): HabitatZone[] {
    return Array.from(this.zones.values()).filter(z => z.type === type);
  }

  getZonesByBuilding(building: string): HabitatZone[] {
    return Array.from(this.zones.values()).filter(z => z.building === building);
  }

  // ---------------------------------------------------------------------------
  // BIOSYNC - STRESS-RESPONSIVE ENVIRONMENT
  // ---------------------------------------------------------------------------

  async activateBioSync(zoneId: string, teamId: string, teamStressLevel: number): Promise<BioSyncRecommendation> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone ${zoneId} not found`);

    const stressLevel = this.categorizeStress(teamStressLevel);
    
    const prompt = `You are CendiaHabitat™, the AI-powered facilities optimization system.

A team is working in zone "${zone.name}" (${zone.type}).

CURRENT ENVIRONMENTAL CONDITIONS:
- Temperature: ${zone.sensors.temperature}°C
- Humidity: ${zone.sensors.humidity}%
- CO2 Level: ${zone.sensors.co2Level} PPM
- Light Level: ${zone.sensors.lightLevel} lux
- Noise Level: ${zone.sensors.noiseLevel} dB
- Air Quality Index: ${zone.sensors.airQualityIndex}
- Current Occupancy: ${zone.currentOccupancy}/${zone.maxOccupancy}

TEAM STRESS LEVEL: ${stressLevel} (${teamStressLevel}% stress indicator)

Based on biometric data and environmental science, provide recommendations in this JSON format:
{
  "recommendations": [
    {
      "parameter": "temperature|lighting|ventilation|noise|humidity",
      "currentValue": number,
      "targetValue": number,
      "reason": "scientific explanation",
      "priority": "immediate|soon|optional",
      "automatable": boolean
    }
  ],
  "breakSchedule": [
    {
      "time": "HH:MM",
      "duration": minutes,
      "type": "movement|hydration|fresh_air|social|meditation",
      "location": "suggested location or null",
      "reason": "why this break helps"
    }
  ],
  "productivityForecast": 0-100,
  "wellnessScore": 0-100,
  "summary": "brief explanation of overall environment strategy"
}

Consider:
- For HIGH stress: cooler temps (20-21°C), softer lighting (300-400 lux), reduced CO2
- For MEDIUM stress: optimal temps (21-22°C), balanced lighting (400-500 lux)
- For LOW stress: maintain comfort, focus on productivity optimization
- CO2 above 1000 PPM impairs cognition
- Noise above 50 dB disrupts deep work
- Break every 90 minutes for sustained performance`;

    let recommendations: EnvironmentAdjustment[] = [];
    let breakSchedule: BreakRecommendation[] = [];
    let productivityForecast = 75;
    let wellnessScore = 70;

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('facilities') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          recommendations = parsed.recommendations || [];
          breakSchedule = parsed.breakSchedule || [];
          productivityForecast = parsed.productivityForecast || 75;
          wellnessScore = parsed.wellnessScore || 70;
        }
      }
    } catch (error) {
      logger.warn('CendiaHabitat: AI analysis unavailable, using heuristic recommendations');
    }

    // Fallback heuristic recommendations if AI unavailable
    if (recommendations.length === 0) {
      recommendations = this.generateHeuristicRecommendations(zone, stressLevel);
      breakSchedule = this.generateHeuristicBreaks(stressLevel);
      productivityForecast = this.calculateProductivityForecast(zone, stressLevel);
      wellnessScore = this.calculateWellnessScore(zone, stressLevel);
    }

    const result: BioSyncRecommendation = {
      zoneId,
      teamId,
      stressLevel,
      currentConditions: { ...zone.sensors },
      recommendations,
      breakSchedule,
      productivityForecast,
      wellnessScore,
      generatedAt: new Date(),
    };

    logger.info(`CendiaHabitat: BioSync activated for zone ${zoneId}, stress level: ${stressLevel}`);
    return result;
  }

  private categorizeStress(level: number): BioSyncRecommendation['stressLevel'] {
    if (level >= 80) return 'critical';
    if (level >= 60) return 'high';
    if (level >= 40) return 'medium';
    return 'low';
  }

  private generateHeuristicRecommendations(zone: HabitatZone, stressLevel: string): EnvironmentAdjustment[] {
    const recommendations: EnvironmentAdjustment[] = [];

    // Temperature adjustments
    const idealTemp = stressLevel === 'critical' || stressLevel === 'high' ? 20 : 22;
    if (Math.abs(zone.sensors.temperature - idealTemp) > 1) {
      recommendations.push({
        parameter: 'temperature',
        currentValue: zone.sensors.temperature,
        targetValue: idealTemp,
        reason: `Adjusting temperature to ${idealTemp}°C for ${stressLevel} stress conditions`,
        priority: stressLevel === 'critical' ? 'immediate' : 'soon',
        automatable: true,
      });
    }

    // CO2 adjustments
    if (zone.sensors.co2Level > 800) {
      recommendations.push({
        parameter: 'ventilation',
        currentValue: zone.sensors.co2Level,
        targetValue: 600,
        reason: 'CO2 levels elevated - increasing fresh air circulation to improve cognitive function',
        priority: zone.sensors.co2Level > 1000 ? 'immediate' : 'soon',
        automatable: true,
      });
    }

    // Lighting adjustments
    const idealLight = stressLevel === 'high' || stressLevel === 'critical' ? 350 : 500;
    if (Math.abs(zone.sensors.lightLevel - idealLight) > 100) {
      recommendations.push({
        parameter: 'lighting',
        currentValue: zone.sensors.lightLevel,
        targetValue: idealLight,
        reason: `Adjusting lighting to ${idealLight} lux for ${stressLevel} stress conditions`,
        priority: 'soon',
        automatable: true,
      });
    }

    return recommendations;
  }

  private generateHeuristicBreaks(stressLevel: string): BreakRecommendation[] {
    const now = new Date();
    const breaks: BreakRecommendation[] = [];

    const intervals = stressLevel === 'critical' ? 45 : stressLevel === 'high' ? 60 : 90;
    
    for (let i = 1; i <= 4; i++) {
      const breakTime = new Date(now.getTime() + i * intervals * 60 * 1000);
      breaks.push({
        time: breakTime.toTimeString().slice(0, 5),
        duration: stressLevel === 'critical' ? 10 : 5,
        type: i % 2 === 0 ? 'movement' : 'hydration',
        reason: `Scheduled ${intervals}-minute interval break for recovery`,
      });
    }

    return breaks;
  }

  private calculateProductivityForecast(zone: HabitatZone, stressLevel: string): number {
    let score = 85;
    
    if (zone.sensors.co2Level > 1000) score -= 15;
    else if (zone.sensors.co2Level > 800) score -= 8;
    
    if (zone.sensors.temperature < 18 || zone.sensors.temperature > 26) score -= 10;
    
    if (zone.sensors.noiseLevel > 60) score -= 12;
    else if (zone.sensors.noiseLevel > 50) score -= 5;
    
    if (stressLevel === 'critical') score -= 20;
    else if (stressLevel === 'high') score -= 10;
    
    return Math.max(20, Math.min(100, score));
  }

  private calculateWellnessScore(zone: HabitatZone, stressLevel: string): number {
    let score = 80;
    
    if (zone.sensors.airQualityIndex > 100) score -= 20;
    else if (zone.sensors.airQualityIndex > 50) score -= 10;
    
    if (zone.sensors.humidity < 30 || zone.sensors.humidity > 60) score -= 10;
    
    if (stressLevel === 'critical') score -= 25;
    else if (stressLevel === 'high') score -= 15;
    else if (stressLevel === 'medium') score -= 5;
    
    return Math.max(20, Math.min(100, score));
  }

  // ---------------------------------------------------------------------------
  // SPACE UTILIZATION ANALYTICS
  // ---------------------------------------------------------------------------

  async analyzeUtilization(zoneId: string, period: SpaceUtilization['period']): Promise<SpaceUtilization> {
    const zone = this.zones.get(zoneId);
    if (!zone) throw new Error(`Zone ${zoneId} not found`);

    const history = this.sensorHistory.get(zoneId) || [];
    
    // Calculate utilization metrics from history
    const occupancyReadings = history.filter(h => h.occupancyDetected).length;
    const utilizationRate = history.length > 0 ? (occupancyReadings / history.length) * 100 : 0;
    const avgOccupancy = zone.currentOccupancy; // In real system, calculate from history
    
    const costEfficiency = utilizationRate > 50 
      ? (utilizationRate / 100) * (avgOccupancy / zone.maxOccupancy) * 100
      : utilizationRate * 0.5;

    const recommendations: string[] = [];
    if (utilizationRate < 30) {
      recommendations.push('Consider consolidating this space or repurposing for different use');
    }
    if (utilizationRate > 90) {
      recommendations.push('Space is over-utilized - consider expansion or scheduling optimization');
    }

    const utilization: SpaceUtilization = {
      zoneId,
      period,
      averageOccupancy: avgOccupancy,
      peakOccupancy: zone.maxOccupancy * 0.8,
      peakTimes: ['10:00-11:00', '14:00-15:00'],
      utilizationRate,
      costEfficiency,
      recommendations,
    };

    this.utilizationData.set(zoneId, utilization);
    return utilization;
  }

  // ---------------------------------------------------------------------------
  // REAL ESTATE OPTIMIZATION
  // ---------------------------------------------------------------------------

  async optimizeRealEstate(): Promise<RealEstateOptimization> {
    const zones = this.getAllZones();
    
    const totalSqFt = zones.reduce((sum, z) => sum + z.squareFootage, 0);
    const totalCost = zones.reduce((sum, z) => sum + (z.squareFootage * z.costPerSqFt), 0);
    const totalCapacity = zones.reduce((sum, z) => sum + z.maxOccupancy, 0);
    const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
    
    const utilizationRate = totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0;
    const costPerEmployee = totalOccupancy > 0 ? totalCost / totalOccupancy : 0;

    const underutilized = zones
      .filter(z => z.currentOccupancy < z.maxOccupancy * 0.3)
      .map(z => ({
        zone: z,
        utilizationRate: (z.currentOccupancy / z.maxOccupancy) * 100,
        recommendation: `Consider repurposing ${z.name} - only ${Math.round((z.currentOccupancy / z.maxOccupancy) * 100)}% utilized`,
      }));

    const prompt = `You are CendiaHabitat™, analyzing real estate portfolio.

PORTFOLIO SUMMARY:
- Total Square Footage: ${totalSqFt.toLocaleString()} sq ft
- Total Annual Cost: $${totalCost.toLocaleString()}
- Overall Utilization: ${utilizationRate.toFixed(1)}%
- Cost per Employee: $${costPerEmployee.toFixed(2)}
- Underutilized Zones: ${underutilized.length}

ZONES:
${zones.map(z => `- ${z.name}: ${z.type}, ${z.squareFootage}sqft, ${z.currentOccupancy}/${z.maxOccupancy} occupancy`).join('\n')}

Provide strategic real estate optimization analysis. Focus on:
1. Cost reduction opportunities
2. Space consolidation potential
3. Expansion planning
4. Sustainability improvements

Respond with a concise strategic analysis (2-3 paragraphs).`;

    let aiAnalysis = 'AI analysis unavailable. Review underutilized spaces for consolidation opportunities.';
    
    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        aiAnalysis = await ollama.generate(prompt, { model: 'llama3.2:3b' });
      }
    } catch (error) {
      logger.warn('CendiaHabitat: AI real estate analysis unavailable');
    }

    const annualSavings = underutilized.reduce((sum, u) => 
      sum + (u.zone.squareFootage * u.zone.costPerSqFt * 0.5), 0);

    return {
      totalSquareFootage: totalSqFt,
      utilizationRate,
      costPerEmployee,
      underutilizedZones: underutilized,
      consolidationOpportunities: [],
      expansionNeeds: [],
      annualSavingsPotential: annualSavings,
      aiAnalysis,
      generatedAt: new Date(),
    };
  }

  // ---------------------------------------------------------------------------
  // ENERGY MANAGEMENT
  // ---------------------------------------------------------------------------

  async analyzeEnergy(buildingId: string): Promise<EnergyAnalysis> {
    const buildingZones = this.getZonesByBuilding(buildingId);
    
    // Simulate energy data (in production, this would come from building management system)
    const baseConsumption = buildingZones.reduce((sum, z) => sum + z.squareFootage * 15, 0); // 15 kWh per sqft annually
    
    const breakdown = [
      { system: 'HVAC', percentage: 45, consumption: baseConsumption * 0.45 },
      { system: 'Lighting', percentage: 25, consumption: baseConsumption * 0.25 },
      { system: 'Equipment', percentage: 20, consumption: baseConsumption * 0.20 },
      { system: 'Other', percentage: 10, consumption: baseConsumption * 0.10 },
    ];

    const anomalies: EnergyAnomaly[] = [];
    const optimizations: EnergyOptimization[] = [];

    // Check for anomalies based on sensor data
    for (const zone of buildingZones) {
      if (!zone.sensors.occupancyDetected && zone.sensors.lightLevel > 200) {
        anomalies.push({
          system: 'Lighting',
          zone: zone.name,
          anomalyType: 'waste',
          severity: 'medium',
          estimatedWaste: zone.squareFootage * 0.5,
          possibleCause: 'Lights on in unoccupied space',
          detectedAt: new Date(),
        });
      }
    }

    optimizations.push({
      action: 'Install occupancy-based lighting controls',
      system: 'Lighting',
      estimatedSavings: baseConsumption * 0.05,
      implementationCost: buildingZones.length * 500,
      paybackPeriod: 12,
      carbonReduction: baseConsumption * 0.05 * 0.4,
      priority: 1,
    });

    return {
      buildingId,
      period: 'monthly',
      totalConsumption: baseConsumption / 12,
      costTotal: (baseConsumption / 12) * 0.12,
      breakdownBySystem: breakdown,
      comparisonToPrevious: -3.5,
      anomalies,
      optimizations,
      carbonFootprint: (baseConsumption / 12) * 0.4,
    };
  }

  // ---------------------------------------------------------------------------
  // HELPERS
  // ---------------------------------------------------------------------------

  private parseJsonFromResponse(response: string): any {
    try {
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      logger.warn('CendiaHabitat: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalZones: number;
    totalSquareFootage: number;
    averageUtilization: number;
    zonesNeedingAttention: number;
  } {
    const zones = this.getAllZones();
    const totalSqFt = zones.reduce((sum, z) => sum + z.squareFootage, 0);
    const totalOccupancy = zones.reduce((sum, z) => sum + z.currentOccupancy, 0);
    const totalCapacity = zones.reduce((sum, z) => sum + z.maxOccupancy, 0);
    
    const needsAttention = zones.filter(z => 
      z.sensors.co2Level > 1000 || 
      z.sensors.airQualityIndex > 100 ||
      z.sensors.temperature < 18 || 
      z.sensors.temperature > 26
    ).length;

    return {
      totalZones: zones.length,
      totalSquareFootage: totalSqFt,
      averageUtilization: totalCapacity > 0 ? (totalOccupancy / totalCapacity) * 100 : 0,
      zonesNeedingAttention: needsAttention,
    };
  }
}

// Export singleton instance
export const cendiaHabitatService = new CendiaHabitatService();
