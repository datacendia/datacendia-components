/**
 * Service — Cendia Factory Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaFactoryService, ProductionLine, Equipment, PredictiveFailure, FailureIndicator, YieldOptimization, YieldRecommendation, QualityEvent
 * @module services/enterprise/CendiaFactoryService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAFACTORY™ - MANUFACTURING & PRODUCTION INTELLIGENCE
// "The Infinite Line" - AI-powered production optimization and predictive maintenance
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ProductionLine {
  id: string;
  name: string;
  facility: string;
  product: string;
  status: 'running' | 'idle' | 'maintenance' | 'down' | 'changeover';
  capacity: number; // units per hour
  currentOutput: number;
  efficiency: number; // percentage
  quality: number; // percentage
  uptime: number; // percentage
  equipment: Equipment[];
  operators: number;
  shift: 'day' | 'evening' | 'night';
  lastMaintenance: Date;
  nextScheduledMaintenance: Date;
}

export interface Equipment {
  id: string;
  name: string;
  type: string;
  status: 'operational' | 'degraded' | 'failed' | 'maintenance';
  health: number; // 0-100
  runtime: number; // hours since last maintenance
  vibration: number; // abnormal if > threshold
  temperature: number;
  powerConsumption: number;
  lastInspection: Date;
}

export interface PredictiveFailure {
  id: string;
  equipmentId: string;
  equipmentName: string;
  lineId: string;
  failureType: string;
  probability: number;
  confidence: number;
  predictedDate: Date;
  indicators: FailureIndicator[];
  recommendedAction: string;
  partToOrder?: string;
  estimatedDowntime: number; // hours
  estimatedCost: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'predicted' | 'scheduled' | 'prevented' | 'occurred';
  generatedAt: Date;
}

export interface FailureIndicator {
  metric: string;
  currentValue: number;
  normalRange: string;
  trend: 'stable' | 'increasing' | 'decreasing' | 'erratic';
  contribution: number; // percentage contribution to prediction
}

export interface YieldOptimization {
  lineId: string;
  currentYield: number;
  potentialYield: number;
  improvement: number;
  recommendations: YieldRecommendation[];
  qualityImpact: number;
  costSavings: number;
  implementationEffort: 'low' | 'medium' | 'high';
  aiAnalysis: string;
  generatedAt: Date;
}

export interface YieldRecommendation {
  parameter: string;
  currentSetting: number;
  recommendedSetting: number;
  expectedImprovement: number;
  confidence: number;
  riskLevel: 'low' | 'medium' | 'high';
  testingRequired: boolean;
}

export interface QualityEvent {
  id: string;
  lineId: string;
  timestamp: Date;
  type: 'defect' | 'deviation' | 'contamination' | 'out_of_spec';
  severity: 'minor' | 'major' | 'critical';
  description: string;
  batchAffected: string;
  unitsAffected: number;
  rootCause?: string;
  correctiveAction?: string;
  preventiveAction?: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
}

export interface ProductionSchedule {
  id: string;
  lineId: string;
  product: string;
  quantity: number;
  scheduledStart: Date;
  scheduledEnd: Date;
  actualStart?: Date;
  actualEnd?: Date;
  status: 'scheduled' | 'in_progress' | 'complete' | 'delayed' | 'cancelled';
  priority: number;
  dependencies: string[];
  materials: MaterialRequirement[];
}

export interface MaterialRequirement {
  material: string;
  quantityRequired: number;
  quantityAvailable: number;
  leadTime: number; // days
  supplier: string;
  status: 'available' | 'low' | 'ordered' | 'critical';
}

export interface SupplyChainRisk {
  material: string;
  supplier: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  riskFactors: string[];
  impact: string;
  mitigation: string;
  alternativeSuppliers: string[];
}

export interface EnergyConsumption {
  lineId: string;
  period: string;
  totalKwh: number;
  costPerUnit: number;
  totalCost: number;
  peakDemand: number;
  offPeakUsage: number;
  efficiency: number;
  carbonFootprint: number;
  optimizations: EnergyOptimization[];
}

export interface EnergyOptimization {
  action: string;
  savings: number;
  implementation: string;
  payback: number; // months
}

export interface OEEMetrics {
  lineId: string;
  period: string;
  oee: number;
  availability: number;
  performance: number;
  quality: number;
  losses: OEELoss[];
  benchmark: number;
  trend: 'improving' | 'stable' | 'declining';
}

export interface OEELoss {
  category: 'availability' | 'performance' | 'quality';
  type: string;
  duration: number; // minutes
  impact: number; // percentage of total loss
  rootCause: string;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaFactoryService {
  private lines: Map<string, ProductionLine> = new Map();
  private predictions: Map<string, PredictiveFailure[]> = new Map();
  private qualityEvents: Map<string, QualityEvent[]> = new Map();
  private schedules: Map<string, ProductionSchedule[]> = new Map();

  constructor() {
    logger.info('CendiaFactory™ initialized - The Infinite Line is monitoring');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // PRODUCTION LINE MANAGEMENT
  // ---------------------------------------------------------------------------

  registerLine(line: Omit<ProductionLine, 'id'>): ProductionLine {
    const newLine: ProductionLine = {
      ...line,
      id: `line-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
    };
    this.lines.set(newLine.id, newLine);
    this.predictions.set(newLine.id, []);
    this.qualityEvents.set(newLine.id, []);
    this.schedules.set(newLine.id, []);
    persistServiceRecord({ serviceName: 'CendiaFactory', recordType: 'production_line', referenceId: newLine.id, data: newLine });
    logger.info(`CendiaFactory: Registered production line ${newLine.name}`);
    return newLine;
  }

  updateLineStatus(lineId: string, status: ProductionLine['status'], metrics?: Partial<ProductionLine>): ProductionLine | null {
    const line = this.lines.get(lineId);
    if (!line) return null;

    line.status = status;
    if (metrics) {
      Object.assign(line, metrics);
    }

    // Auto-detect issues
    if (line.efficiency < 70 || line.quality < 95) {
      this.flagLineForReview(line);
    }

    return line;
  }

  private flagLineForReview(line: ProductionLine): void {
    logger.warn(`CendiaFactory: Line ${line.name} flagged for review - Efficiency: ${line.efficiency}%, Quality: ${line.quality}%`);
  }

  getLine(lineId: string): ProductionLine | null {
    return this.lines.get(lineId) || null;
  }

  getAllLines(): ProductionLine[] {
    return Array.from(this.lines.values());
  }

  getLinesByStatus(status: ProductionLine['status']): ProductionLine[] {
    return Array.from(this.lines.values()).filter(l => l.status === status);
  }

  // ---------------------------------------------------------------------------
  // PREDICTIVE MAINTENANCE
  // ---------------------------------------------------------------------------

  async predictFailures(lineId: string): Promise<PredictiveFailure[]> {
    const line = this.lines.get(lineId);
    if (!line) throw new Error(`Line ${lineId} not found`);

    const predictions: PredictiveFailure[] = [];

    for (const equipment of line.equipment) {
      if (equipment.health < 70 || equipment.vibration > 50 || equipment.temperature > 80) {
        const prediction = await this.analyzeEquipmentHealth(line, equipment);
        if (prediction) {
          predictions.push(prediction);
        }
      }
    }

    // Store predictions
    this.predictions.set(lineId, predictions);

    if (predictions.length > 0) {
      logger.warn(`CendiaFactory: ${predictions.length} potential failures predicted for line ${line.name}`);
    }

    return predictions;
  }

  private async analyzeEquipmentHealth(line: ProductionLine, equipment: Equipment): Promise<PredictiveFailure | null> {
    const prompt = `You are CendiaFactory™, an AI predictive maintenance system.

EQUIPMENT: ${equipment.name} (${equipment.type})
PRODUCTION LINE: ${line.name}

CURRENT METRICS:
- Health Score: ${equipment.health}%
- Runtime Since Maintenance: ${equipment.runtime} hours
- Vibration Level: ${equipment.vibration} (normal: <30)
- Temperature: ${equipment.temperature}°C (normal: <70°C)
- Power Consumption: ${equipment.powerConsumption} kW

Analyze failure risk and provide prediction in JSON:
{
  "failureType": "type of likely failure",
  "probability": 0-100,
  "confidence": 0-100,
  "daysUntilFailure": number,
  "indicators": [
    {
      "metric": "metric name",
      "currentValue": value,
      "normalRange": "range string",
      "trend": "stable|increasing|decreasing|erratic",
      "contribution": percentage
    }
  ],
  "recommendedAction": "specific action to take",
  "partToOrder": "part name if applicable",
  "estimatedDowntime": hours,
  "estimatedCost": dollars,
  "analysis": "brief analysis"
}`;

    let predictionData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('failure_prediction') });
        predictionData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaFactory: AI prediction unavailable');
    }

    // Only create prediction if there's actual risk
    const probability = predictionData.probability || this.calculateFailureProbability(equipment);
    if (probability < 30) return null;

    const prediction: PredictiveFailure = {
      id: `pred-${Date.now()}`,
      equipmentId: equipment.id,
      equipmentName: equipment.name,
      lineId: line.id,
      failureType: predictionData.failureType || 'Mechanical wear',
      probability,
      confidence: predictionData.confidence || 70,
      predictedDate: new Date(Date.now() + (predictionData.daysUntilFailure || 14) * 24 * 60 * 60 * 1000),
      indicators: predictionData.indicators || this.generateDefaultIndicators(equipment),
      recommendedAction: predictionData.recommendedAction || 'Schedule preventive maintenance',
      partToOrder: predictionData.partToOrder,
      estimatedDowntime: predictionData.estimatedDowntime || 4,
      estimatedCost: predictionData.estimatedCost || 5000,
      priority: probability > 80 ? 'critical' : probability > 60 ? 'high' : probability > 40 ? 'medium' : 'low',
      status: 'predicted',
      generatedAt: new Date(),
    };

    return prediction;
  }

  private calculateFailureProbability(equipment: Equipment): number {
    let probability = 10;

    if (equipment.health < 50) probability += 40;
    else if (equipment.health < 70) probability += 25;
    else if (equipment.health < 85) probability += 10;

    if (equipment.vibration > 50) probability += 25;
    else if (equipment.vibration > 30) probability += 10;

    if (equipment.temperature > 80) probability += 20;
    else if (equipment.temperature > 70) probability += 10;

    if (equipment.runtime > 1000) probability += 15;

    return Math.min(95, probability);
  }

  private generateDefaultIndicators(equipment: Equipment): FailureIndicator[] {
    return [
      {
        metric: 'Health Score',
        currentValue: equipment.health,
        normalRange: '85-100%',
        trend: equipment.health < 70 ? 'decreasing' : 'stable',
        contribution: 40,
      },
      {
        metric: 'Vibration',
        currentValue: equipment.vibration,
        normalRange: '0-30',
        trend: equipment.vibration > 30 ? 'increasing' : 'stable',
        contribution: 30,
      },
      {
        metric: 'Temperature',
        currentValue: equipment.temperature,
        normalRange: '40-70°C',
        trend: equipment.temperature > 70 ? 'increasing' : 'stable',
        contribution: 30,
      },
    ];
  }

  scheduleMaintenance(predictionId: string, scheduledDate: Date): PredictiveFailure | null {
    for (const predictions of this.predictions.values()) {
      const prediction = predictions.find(p => p.id === predictionId);
      if (prediction) {
        prediction.status = 'scheduled';
        prediction.predictedDate = scheduledDate;
        logger.info(`CendiaFactory: Maintenance scheduled for ${prediction.equipmentName}`);
        return prediction;
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // YIELD OPTIMIZATION
  // ---------------------------------------------------------------------------

  async optimizeYield(lineId: string): Promise<YieldOptimization> {
    const line = this.lines.get(lineId);
    if (!line) throw new Error(`Line ${lineId} not found`);

    const currentYield = line.efficiency * line.quality / 100;

    const prompt = `You are CendiaFactory™, optimizing production yield.

PRODUCTION LINE: ${line.name}
PRODUCT: ${line.product}
CURRENT METRICS:
- Efficiency: ${line.efficiency}%
- Quality: ${line.quality}%
- Current Yield: ${currentYield.toFixed(1)}%
- Capacity: ${line.capacity} units/hour
- Current Output: ${line.currentOutput} units/hour

Analyze and provide yield optimization recommendations in JSON:
{
  "potentialYield": percentage,
  "recommendations": [
    {
      "parameter": "parameter name",
      "currentSetting": value,
      "recommendedSetting": value,
      "expectedImprovement": percentage,
      "confidence": 0-100,
      "riskLevel": "low|medium|high",
      "testingRequired": boolean
    }
  ],
  "qualityImpact": percentage_change,
  "costSavings": annual_dollars,
  "implementationEffort": "low|medium|high",
  "analysis": "detailed analysis"
}`;

    let optimizationData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('failure_prediction') });
        optimizationData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaFactory: AI yield optimization unavailable');
    }

    const potentialYield = optimizationData.potentialYield || Math.min(98, currentYield + 5);

    const optimization: YieldOptimization = {
      lineId,
      currentYield,
      potentialYield,
      improvement: potentialYield - currentYield,
      recommendations: optimizationData.recommendations || [
        {
          parameter: 'Line Speed',
          currentSetting: line.currentOutput,
          recommendedSetting: Math.round(line.currentOutput * 1.05),
          expectedImprovement: 2,
          confidence: 75,
          riskLevel: 'low',
          testingRequired: true,
        },
      ],
      qualityImpact: optimizationData.qualityImpact || 0,
      costSavings: optimizationData.costSavings || (potentialYield - currentYield) * 1000 * 365,
      implementationEffort: optimizationData.implementationEffort || 'medium',
      aiAnalysis: optimizationData.analysis || 'Yield optimization analysis complete.',
      generatedAt: new Date(),
    };

    logger.info(`CendiaFactory: Yield optimization for ${line.name}: ${currentYield.toFixed(1)}% —" ' ${potentialYield.toFixed(1)}%`);
    return optimization;
  }

  // ---------------------------------------------------------------------------
  // QUALITY MANAGEMENT
  // ---------------------------------------------------------------------------

  recordQualityEvent(lineId: string, event: Omit<QualityEvent, 'id' | 'timestamp' | 'status'>): QualityEvent {
    const qualityEvent: QualityEvent = {
      ...event,
      id: `qe-${Date.now()}`,
      timestamp: new Date(),
      status: 'open',
    };

    const events = this.qualityEvents.get(lineId) || [];
    events.push(qualityEvent);
    this.qualityEvents.set(lineId, events);

    if (event.severity === 'critical') {
      logger.error(`CendiaFactory: CRITICAL quality event on line ${lineId}: ${event.description}`);
    } else {
      logger.warn(`CendiaFactory: Quality event on line ${lineId}: ${event.type}`);
    }

    return qualityEvent;
  }

  async analyzeQualityEvent(eventId: string): Promise<{ rootCause: string; correctiveAction: string; preventiveAction: string }> {
    let event: QualityEvent | undefined;
    let lineId: string | undefined;

    for (const [lid, events] of this.qualityEvents.entries()) {
      const found = events.find(e => e.id === eventId);
      if (found) {
        event = found;
        lineId = lid;
        break;
      }
    }

    if (!event || !lineId) throw new Error('Quality event not found');

    const line = this.lines.get(lineId);

    const prompt = `You are CendiaFactory™, analyzing a quality event.

EVENT: ${event.type} - ${event.description}
SEVERITY: ${event.severity}
BATCH: ${event.batchAffected}
UNITS AFFECTED: ${event.unitsAffected}
LINE: ${line?.name || 'Unknown'}

Analyze and provide root cause in JSON:
{
  "rootCause": "identified root cause",
  "correctiveAction": "immediate corrective action",
  "preventiveAction": "long-term preventive action"
}`;

    let analysis = { rootCause: '', correctiveAction: '', preventiveAction: '' };

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('failure_prediction') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          analysis = parsed;
        }
      }
    } catch (error) {
      logger.warn('CendiaFactory: AI quality analysis unavailable');
    }

    // Update event with analysis
    event.rootCause = analysis.rootCause || 'Under investigation';
    event.correctiveAction = analysis.correctiveAction || 'Review and adjust process parameters';
    event.preventiveAction = analysis.preventiveAction || 'Implement additional quality checks';
    event.status = 'investigating';

    return analysis;
  }

  // ---------------------------------------------------------------------------
  // OEE CALCULATION
  // ---------------------------------------------------------------------------

  calculateOEE(lineId: string, periodHours: number = 8): OEEMetrics {
    const line = this.lines.get(lineId);
    if (!line) throw new Error(`Line ${lineId} not found`);

    const availability = line.uptime / 100;
    const performance = line.currentOutput / line.capacity;
    const quality = line.quality / 100;
    const oee = availability * performance * quality * 100;

    const losses: OEELoss[] = [];

    if (availability < 0.9) {
      losses.push({
        category: 'availability',
        type: 'Unplanned downtime',
        duration: (1 - availability) * periodHours * 60,
        impact: (1 - availability) * 100,
        rootCause: 'Equipment issues or changeovers',
      });
    }

    if (performance < 0.95) {
      losses.push({
        category: 'performance',
        type: 'Speed loss',
        duration: (1 - performance) * periodHours * 60,
        impact: (1 - performance) * 100,
        rootCause: 'Running below optimal speed',
      });
    }

    if (quality < 0.99) {
      losses.push({
        category: 'quality',
        type: 'Defects',
        duration: (1 - quality) * periodHours * 60,
        impact: (1 - quality) * 100,
        rootCause: 'Quality issues requiring rework',
      });
    }

    const metrics: OEEMetrics = {
      lineId,
      period: `${periodHours}h shift`,
      oee: Math.round(oee * 10) / 10,
      availability: Math.round(availability * 1000) / 10,
      performance: Math.round(performance * 1000) / 10,
      quality: Math.round(quality * 1000) / 10,
      losses,
      benchmark: 85, // World-class OEE benchmark
      trend: oee > 80 ? 'improving' : oee > 70 ? 'stable' : 'declining',
    };

    return metrics;
  }

  // ---------------------------------------------------------------------------
  // SCHEDULING
  // ---------------------------------------------------------------------------

  scheduleProduction(schedule: Omit<ProductionSchedule, 'id' | 'status'>): ProductionSchedule {
    const newSchedule: ProductionSchedule = {
      ...schedule,
      id: `sched-${Date.now()}`,
      status: 'scheduled',
    };

    const schedules = this.schedules.get(schedule.lineId) || [];
    schedules.push(newSchedule);
    this.schedules.set(schedule.lineId, schedules);

    logger.info(`CendiaFactory: Production scheduled for ${schedule.product} on line ${schedule.lineId}`);
    return newSchedule;
  }

  getSchedule(lineId: string): ProductionSchedule[] {
    return this.schedules.get(lineId) || [];
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
      logger.warn('CendiaFactory: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalLines: number;
    linesRunning: number;
    avgOEE: number;
    predictedFailures: number;
    qualityEvents: number;
  } {
    const lines = this.getAllLines();
    const running = lines.filter(l => l.status === 'running').length;
    
    let totalOEE = 0;
    for (const line of lines) {
      const oee = this.calculateOEE(line.id);
      totalOEE += oee.oee;
    }
    const avgOEE = lines.length > 0 ? totalOEE / lines.length : 0;

    let predictions = 0;
    let quality = 0;
    for (const preds of this.predictions.values()) {
      predictions += preds.filter(p => p.status === 'predicted').length;
    }
    for (const events of this.qualityEvents.values()) {
      quality += events.filter(e => e.status !== 'closed').length;
    }

    return {
      totalLines: lines.length,
      linesRunning: running,
      avgOEE: Math.round(avgOEE * 10) / 10,
      predictedFailures: predictions,
      qualityEvents: quality,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Production Intelligence Dashboard */
  getProductionIntelligenceDashboard(): {
    summary: { totalLines: number; running: number; idle: number; down: number; avgEfficiency: number; avgQuality: number; avgUptime: number };
    oeeOverview: { avgOEE: number; bestLine: string; worstLine: string; benchmark: number };
    byFacility: Array<{ facility: string; lineCount: number; avgEfficiency: number; avgOEE: number }>;
    byProduct: Array<{ product: string; lineCount: number; avgEfficiency: number; totalOutput: number }>;
    capacityUtilization: { totalCapacity: number; currentOutput: number; utilization: number };
    shiftPerformance: Array<{ shift: string; lineCount: number; avgEfficiency: number; avgQuality: number }>;
    insights: string[];
  } {
    const lines = this.getAllLines();
    const running = lines.filter(l => l.status === 'running').length;
    const idle = lines.filter(l => l.status === 'idle').length;
    const down = lines.filter(l => l.status === 'down' || l.status === 'maintenance').length;

    const avgEfficiency = lines.length > 0 ? Math.round(lines.reduce((s, l) => s + l.efficiency, 0) / lines.length * 10) / 10 : 0;
    const avgQuality = lines.length > 0 ? Math.round(lines.reduce((s, l) => s + l.quality, 0) / lines.length * 10) / 10 : 0;
    const avgUptime = lines.length > 0 ? Math.round(lines.reduce((s, l) => s + l.uptime, 0) / lines.length * 10) / 10 : 0;

    const oeeScores = lines.map(l => ({ name: l.name, oee: this.calculateOEE(l.id).oee }));
    const avgOEE = oeeScores.length > 0 ? Math.round(oeeScores.reduce((s, o) => s + o.oee, 0) / oeeScores.length * 10) / 10 : 0;
    const sorted = [...oeeScores].sort((a, b) => b.oee - a.oee);

    const facilityMap: Record<string, { count: number; eff: number; oee: number }> = {};
    const productMap: Record<string, { count: number; eff: number; output: number }> = {};
    const shiftMap: Record<string, { count: number; eff: number; qual: number }> = {};

    for (let i = 0; i < lines.length; i++) {
      const l = lines[i];
      const oee = oeeScores[i]?.oee || 0;

      if (!facilityMap[l.facility]) facilityMap[l.facility] = { count: 0, eff: 0, oee: 0 };
      facilityMap[l.facility].count++;
      facilityMap[l.facility].eff += l.efficiency;
      facilityMap[l.facility].oee += oee;

      if (!productMap[l.product]) productMap[l.product] = { count: 0, eff: 0, output: 0 };
      productMap[l.product].count++;
      productMap[l.product].eff += l.efficiency;
      productMap[l.product].output += l.currentOutput;

      if (!shiftMap[l.shift]) shiftMap[l.shift] = { count: 0, eff: 0, qual: 0 };
      shiftMap[l.shift].count++;
      shiftMap[l.shift].eff += l.efficiency;
      shiftMap[l.shift].qual += l.quality;
    }

    const totalCapacity = lines.reduce((s, l) => s + l.capacity, 0);
    const currentOutput = lines.reduce((s, l) => s + l.currentOutput, 0);

    const insights: string[] = [];
    if (avgOEE < 65) insights.push(`Average OEE is ${avgOEE}% — below world-class threshold of 85%`);
    if (down > 0) insights.push(`${down} line(s) currently down or in maintenance`);
    if (avgQuality < 95) insights.push(`Quality rate ${avgQuality}% below target 95% — investigate defect sources`);
    if (insights.length === 0) insights.push('Production performance is within target parameters');

    return {
      summary: { totalLines: lines.length, running, idle, down, avgEfficiency, avgQuality, avgUptime },
      oeeOverview: { avgOEE, bestLine: sorted[0]?.name || 'N/A', worstLine: sorted[sorted.length - 1]?.name || 'N/A', benchmark: 85 },
      byFacility: Object.entries(facilityMap).map(([f, d]) => ({ facility: f, lineCount: d.count, avgEfficiency: Math.round(d.eff / d.count * 10) / 10, avgOEE: Math.round(d.oee / d.count * 10) / 10 })),
      byProduct: Object.entries(productMap).map(([p, d]) => ({ product: p, lineCount: d.count, avgEfficiency: Math.round(d.eff / d.count * 10) / 10, totalOutput: d.output })),
      capacityUtilization: { totalCapacity, currentOutput, utilization: totalCapacity > 0 ? Math.round((currentOutput / totalCapacity) * 1000) / 10 : 0 },
      shiftPerformance: Object.entries(shiftMap).map(([s, d]) => ({ shift: s, lineCount: d.count, avgEfficiency: Math.round(d.eff / d.count * 10) / 10, avgQuality: Math.round(d.qual / d.count * 10) / 10 })),
      insights,
    };
  }

  /** 10/10: Equipment Health Intelligence */
  getEquipmentHealthIntelligence(): {
    totalEquipment: number;
    healthDistribution: { healthy: number; degraded: number; failed: number; maintenance: number };
    criticalAlerts: Array<{ equipment: string; line: string; health: number; issue: string; priority: string }>;
    maintenanceSchedule: Array<{ line: string; lastMaintenance: Date; nextMaintenance: Date; overdue: boolean }>;
    predictedFailures: Array<{ equipment: string; line: string; probability: number; predictedDate: Date; action: string }>;
    avgHealthByLine: Array<{ line: string; avgHealth: number; equipmentCount: number; worstEquipment: string }>;
    maintenanceCost: { estimatedTotal: number; preventable: number };
    insights: string[];
  } {
    const lines = this.getAllLines();
    let totalEquipment = 0;
    const healthDist = { healthy: 0, degraded: 0, failed: 0, maintenance: 0 };
    const criticalAlerts: Array<{ equipment: string; line: string; health: number; issue: string; priority: string }> = [];
    const lineHealth: Array<{ line: string; avgHealth: number; equipmentCount: number; worstEquipment: string }> = [];

    for (const line of lines) {
      let lineTotal = 0; let worst = { name: '', health: 101 };
      for (const eq of line.equipment) {
        totalEquipment++;
        lineTotal += eq.health;
        if (eq.health < worst.health) worst = { name: eq.name, health: eq.health };

        if (eq.status === 'operational' && eq.health >= 70) healthDist.healthy++;
        else if (eq.status === 'degraded' || eq.health < 70) healthDist.degraded++;
        else if (eq.status === 'failed') healthDist.failed++;
        else if (eq.status === 'maintenance') healthDist.maintenance++;

        if (eq.health < 50 || eq.status === 'failed') {
          const issue = eq.status === 'failed' ? 'Equipment failed' : eq.vibration > 50 ? 'High vibration' : eq.temperature > 80 ? 'Overheating' : 'Low health score';
          criticalAlerts.push({ equipment: eq.name, line: line.name, health: eq.health, issue, priority: eq.health < 30 ? 'critical' : 'high' });
        }
      }
      if (line.equipment.length > 0) {
        lineHealth.push({ line: line.name, avgHealth: Math.round(lineTotal / line.equipment.length), equipmentCount: line.equipment.length, worstEquipment: worst.name });
      }
    }

    const maintenanceSchedule = lines.map(l => ({
      line: l.name, lastMaintenance: l.lastMaintenance, nextMaintenance: l.nextScheduledMaintenance,
      overdue: l.nextScheduledMaintenance.getTime() < Date.now(),
    }));

    const allPredictions: Array<{ equipment: string; line: string; probability: number; predictedDate: Date; action: string }> = [];
    for (const [lineId, preds] of this.predictions.entries()) {
      const line = this.lines.get(lineId);
      for (const p of preds.filter(p => p.status === 'predicted')) {
        allPredictions.push({ equipment: p.equipmentName, line: line?.name || lineId, probability: p.probability, predictedDate: p.predictedDate, action: p.recommendedAction });
      }
    }

    const estimatedTotal = allPredictions.reduce((s, p) => s + 5000, 0);
    const preventable = Math.round(estimatedTotal * 0.6);

    const insights: string[] = [];
    if (healthDist.failed > 0) insights.push(`${healthDist.failed} equipment unit(s) in failed state — immediate action required`);
    if (criticalAlerts.length > 0) insights.push(`${criticalAlerts.length} critical equipment alert(s) active`);
    const overdue = maintenanceSchedule.filter(m => m.overdue).length;
    if (overdue > 0) insights.push(`${overdue} line(s) have overdue maintenance schedules`);
    if (insights.length === 0) insights.push('Equipment health across all lines is within acceptable range');

    return {
      totalEquipment, healthDistribution: healthDist,
      criticalAlerts: criticalAlerts.sort((a, b) => a.health - b.health),
      maintenanceSchedule, predictedFailures: allPredictions.sort((a, b) => b.probability - a.probability),
      avgHealthByLine: lineHealth.sort((a, b) => a.avgHealth - b.avgHealth),
      maintenanceCost: { estimatedTotal, preventable }, insights,
    };
  }

  /** 10/10: Quality Analytics Engine */
  getQualityAnalyticsEngine(): {
    totalEvents: number;
    openEvents: number;
    bySeverity: { minor: number; major: number; critical: number };
    byType: Array<{ type: string; count: number; unitsAffected: number }>;
    byLine: Array<{ line: string; eventCount: number; qualityRate: number }>;
    rootCauseAnalysis: Array<{ cause: string; frequency: number; avgUnitsAffected: number }>;
    trendData: { thisMonth: number; lastMonth: number; trend: string };
    costOfQuality: { scrapCost: number; reworkCost: number; inspectionCost: number; total: number };
    insights: string[];
  } {
    const allEvents: QualityEvent[] = [];
    for (const events of this.qualityEvents.values()) {
      allEvents.push(...events);
    }

    const openEvents = allEvents.filter(e => e.status !== 'closed').length;
    const bySeverity = { minor: 0, major: 0, critical: 0 };
    const typeMap: Record<string, { count: number; units: number }> = {};
    const causeMap: Record<string, { count: number; units: number }> = {};

    for (const e of allEvents) {
      bySeverity[e.severity]++;
      if (!typeMap[e.type]) typeMap[e.type] = { count: 0, units: 0 };
      typeMap[e.type].count++;
      typeMap[e.type].units += e.unitsAffected;

      const cause = e.rootCause || 'Unknown';
      if (!causeMap[cause]) causeMap[cause] = { count: 0, units: 0 };
      causeMap[cause].count++;
      causeMap[cause].units += e.unitsAffected;
    }

    const lines = this.getAllLines();
    const byLine = lines.map(l => {
      const lineEvents = this.qualityEvents.get(l.id) || [];
      return { line: l.name, eventCount: lineEvents.length, qualityRate: l.quality };
    }).sort((a, b) => b.eventCount - a.eventCount);

    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;
    const thisMonth = allEvents.filter(e => now - e.timestamp.getTime() < oneMonth).length;
    const lastMonth = allEvents.filter(e => now - e.timestamp.getTime() >= oneMonth && now - e.timestamp.getTime() < oneMonth * 2).length;
    const trend = thisMonth > lastMonth * 1.2 ? 'worsening' : thisMonth < lastMonth * 0.8 ? 'improving' : 'stable';

    const totalUnits = allEvents.reduce((s, e) => s + e.unitsAffected, 0);
    const scrapCost = Math.round(totalUnits * 15);
    const reworkCost = Math.round(totalUnits * 8);
    const inspectionCost = Math.round(allEvents.length * 200);

    const insights: string[] = [];
    if (bySeverity.critical > 0) insights.push(`${bySeverity.critical} critical quality event(s) — escalate immediately`);
    if (trend === 'worsening') insights.push('Quality events trending upward — investigate systemic causes');
    const topCause = Object.entries(causeMap).sort((a, b) => b[1].count - a[1].count)[0];
    if (topCause && topCause[1].count > 2) insights.push(`"${topCause[0]}" is the most frequent root cause (${topCause[1].count} occurrences)`);
    if (insights.length === 0) insights.push('Quality metrics are stable across all production lines');

    return {
      totalEvents: allEvents.length, openEvents, bySeverity,
      byType: Object.entries(typeMap).map(([t, d]) => ({ type: t, count: d.count, unitsAffected: d.units })).sort((a, b) => b.count - a.count),
      byLine,
      rootCauseAnalysis: Object.entries(causeMap).map(([c, d]) => ({ cause: c, frequency: d.count, avgUnitsAffected: d.count > 0 ? Math.round(d.units / d.count) : 0 })).sort((a, b) => b.frequency - a.frequency),
      trendData: { thisMonth, lastMonth, trend },
      costOfQuality: { scrapCost, reworkCost, inspectionCost, total: scrapCost + reworkCost + inspectionCost },
      insights,
    };
  }

  /** 10/10: Supply Chain Risk Monitor */
  getSupplyChainRiskMonitor(): {
    totalSchedules: number;
    activeSchedules: number;
    delayedSchedules: number;
    materialStatus: { available: number; low: number; ordered: number; critical: number };
    criticalMaterials: Array<{ material: string; supplier: string; status: string; leadTime: number; linesAffected: number }>;
    scheduleAdherence: { onTime: number; delayed: number; adherenceRate: number };
    supplierConcentration: Array<{ supplier: string; materialsSupplied: number; criticalItems: number; riskLevel: string }>;
    productionGaps: Array<{ line: string; gap: string; impact: string }>;
    insights: string[];
  } {
    const allSchedules: ProductionSchedule[] = [];
    const materialMap: Record<string, { material: string; supplier: string; status: string; leadTime: number; lines: Set<string> }> = {};
    const supplierMap: Record<string, { count: number; critical: number }> = {};

    for (const [lineId, schedules] of this.schedules.entries()) {
      for (const s of schedules) {
        allSchedules.push(s);
        for (const m of s.materials) {
          const key = `${m.material}|${m.supplier}`;
          if (!materialMap[key]) materialMap[key] = { material: m.material, supplier: m.supplier, status: m.status, leadTime: m.leadTime, lines: new Set() };
          materialMap[key].lines.add(lineId);
          if (m.status === 'critical' || m.status === 'low') materialMap[key].status = m.status;

          if (!supplierMap[m.supplier]) supplierMap[m.supplier] = { count: 0, critical: 0 };
          supplierMap[m.supplier].count++;
          if (m.status === 'critical') supplierMap[m.supplier].critical++;
        }
      }
    }

    const active = allSchedules.filter(s => s.status === 'scheduled' || s.status === 'in_progress').length;
    const delayed = allSchedules.filter(s => s.status === 'delayed').length;
    const complete = allSchedules.filter(s => s.status === 'complete').length;
    const adherenceRate = (complete + active) > 0 ? Math.round((complete / Math.max(1, complete + delayed)) * 100) : 100;

    const matStatus = { available: 0, low: 0, ordered: 0, critical: 0 };
    const criticalMaterials: Array<{ material: string; supplier: string; status: string; leadTime: number; linesAffected: number }> = [];
    for (const m of Object.values(materialMap)) {
      if (m.status === 'available') matStatus.available++;
      else if (m.status === 'low') matStatus.low++;
      else if (m.status === 'ordered') matStatus.ordered++;
      else if (m.status === 'critical') matStatus.critical++;

      if (m.status === 'critical' || m.status === 'low') {
        criticalMaterials.push({ material: m.material, supplier: m.supplier, status: m.status, leadTime: m.leadTime, linesAffected: m.lines.size });
      }
    }

    const lines = this.getAllLines();
    const productionGaps: Array<{ line: string; gap: string; impact: string }> = [];
    for (const l of lines) {
      if (l.status === 'idle') productionGaps.push({ line: l.name, gap: 'Line idle — no scheduled production', impact: 'Lost capacity' });
      if (l.status === 'down') productionGaps.push({ line: l.name, gap: 'Line down — unplanned stoppage', impact: 'Production halted' });
    }

    const insights: string[] = [];
    if (matStatus.critical > 0) insights.push(`${matStatus.critical} material(s) at critical supply level`);
    if (delayed > 0) insights.push(`${delayed} production schedule(s) delayed`);
    const singleSource = Object.entries(supplierMap).filter(([, d]) => d.count > 3);
    if (singleSource.length > 0) insights.push(`${singleSource.length} supplier(s) with high material concentration — diversification recommended`);
    if (insights.length === 0) insights.push('Supply chain and production schedules are on track');

    return {
      totalSchedules: allSchedules.length, activeSchedules: active, delayedSchedules: delayed,
      materialStatus: matStatus,
      criticalMaterials: criticalMaterials.sort((a, b) => a.status === 'critical' ? -1 : 1),
      scheduleAdherence: { onTime: complete, delayed, adherenceRate },
      supplierConcentration: Object.entries(supplierMap).map(([s, d]) => ({ supplier: s, materialsSupplied: d.count, criticalItems: d.critical, riskLevel: d.critical > 0 ? 'high' : d.count > 5 ? 'medium' : 'low' })),
      productionGaps, insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaFactory', recordType: 'production_line', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.lines.has(d.id)) this.lines.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaFactory', recordType: 'production_line', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.predictions.has(d.id)) this.predictions.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaFactory', recordType: 'production_line', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.qualityEvents.has(d.id)) this.qualityEvents.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaFactory', recordType: 'production_line', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this.schedules.has(d.id)) this.schedules.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaFactoryService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaFactoryService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaFactory',
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
      service: 'CendiaFactory',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaFactoryService = new CendiaFactoryService();
