// @ts-nocheck
// =============================================================================
// CENDIATRANSIT™ - CORPORATE TRAVEL & EXECUTIVE SECURITY
// "The Executive Protection" - AI-powered travel risk and security intelligence
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface TravelRisk {
  location: string;
  country: string;
  region: string;
  overallRisk: 'minimal' | 'low' | 'medium' | 'high' | 'extreme';
  riskScore: number; // 0-100
  categories: RiskCategory[];
  activeAlerts: TravelAlert[];
  restrictions: string[];
  recommendations: string[];
  lastUpdated: Date;
}

export interface RiskCategory {
  category: 'political' | 'crime' | 'terrorism' | 'health' | 'natural_disaster' | 'infrastructure' | 'civil_unrest';
  level: 'low' | 'medium' | 'high' | 'extreme';
  score: number;
  details: string;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface TravelAlert {
  id: string;
  type: 'warning' | 'advisory' | 'emergency';
  title: string;
  description: string;
  locations: string[];
  effectiveDate: Date;
  expirationDate?: Date;
  source: string;
  actions: string[];
}

export interface TravelRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  vipLevel: 'standard' | 'executive' | 'c_suite' | 'board';
  destinations: TripDestination[];
  purpose: string;
  status: 'pending' | 'approved' | 'denied' | 'in_progress' | 'completed' | 'cancelled';
  riskAssessment?: TravelRiskAssessment;
  securityPlan?: SecurityPlan;
  emergencyContacts: EmergencyContact[];
  createdAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
}

export interface TripDestination {
  location: string;
  country: string;
  arrivalDate: Date;
  departureDate: Date;
  accommodation?: string;
  localContact?: string;
  meetings: string[];
}

export interface TravelRiskAssessment {
  overallRisk: 'low' | 'medium' | 'high' | 'critical';
  score: number;
  factors: RiskFactor[];
  mitigations: string[];
  approvalRequired: 'standard' | 'manager' | 'security' | 'executive';
  recommendations: string[];
  generatedAt: Date;
}

export interface RiskFactor {
  factor: string;
  severity: 'low' | 'medium' | 'high';
  description: string;
  mitigation: string;
}

export interface SecurityPlan {
  id: string;
  travelRequestId: string;
  level: 'standard' | 'enhanced' | 'executive' | 'high_risk';
  measures: SecurityMeasure[];
  groundTransport: TransportArrangement[];
  safeLocations: SafeLocation[];
  communicationProtocol: CommunicationProtocol;
  checkInSchedule: CheckIn[];
  extractionPlan?: ExtractionPlan;
  securityPersonnel?: SecurityPersonnel[];
  createdAt: Date;
}

export interface SecurityMeasure {
  measure: string;
  category: 'physical' | 'cyber' | 'communication' | 'transport' | 'accommodation';
  mandatory: boolean;
  instructions: string;
}

export interface TransportArrangement {
  type: 'commercial' | 'private' | 'secure_vehicle' | 'armored';
  provider: string;
  details: string;
  vetted: boolean;
}

export interface SafeLocation {
  name: string;
  type: 'embassy' | 'hotel' | 'corporate_office' | 'hospital' | 'safe_house';
  address: string;
  coordinates?: { lat: number; lng: number };
  contact: string;
  notes: string;
}

export interface CommunicationProtocol {
  primaryChannel: string;
  backupChannel: string;
  encryptionRequired: boolean;
  checkInFrequency: string;
  emergencyCode: string;
  silentAlarmCode: string;
}

export interface CheckIn {
  scheduledTime: Date;
  location: string;
  method: 'app' | 'call' | 'sms' | 'satellite';
  completed: boolean;
  completedAt?: Date;
  notes?: string;
}

export interface ExtractionPlan {
  id: string;
  triggerConditions: string[];
  primaryRoute: ExtractionRoute;
  alternativeRoutes: ExtractionRoute[];
  evacuationPoints: string[];
  medicalFacilities: string[];
  status: 'standby' | 'activated' | 'executing' | 'complete';
  activatedAt?: Date;
  activatedBy?: string;
}

export interface ExtractionRoute {
  method: 'ground' | 'air' | 'sea';
  provider: string;
  estimatedTime: number; // minutes
  cost: number;
  risks: string[];
  waypoints: string[];
}

export interface SecurityPersonnel {
  id: string;
  name: string;
  role: 'driver' | 'close_protection' | 'advance_team' | 'medical';
  credentials: string[];
  contact: string;
  assignedPeriod: { start: Date; end: Date };
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  priority: number;
}

export interface IncidentReport {
  id: string;
  travelRequestId?: string;
  employeeId: string;
  type: 'medical' | 'security' | 'theft' | 'accident' | 'natural_disaster' | 'political' | 'other';
  severity: 'minor' | 'moderate' | 'serious' | 'critical';
  location: string;
  description: string;
  immediateActions: string[];
  status: 'reported' | 'responding' | 'resolved' | 'closed';
  timeline: IncidentEvent[];
  outcome?: string;
  lessonsLearned?: string[];
  reportedAt: Date;
  resolvedAt?: Date;
}

export interface IncidentEvent {
  timestamp: Date;
  action: string;
  actor: string;
  notes?: string;
}

export interface TravelPolicy {
  id: string;
  name: string;
  destinations: { country: string; maxRiskLevel: string }[];
  approvalMatrix: { riskLevel: string; approver: string }[];
  requiredTraining: string[];
  insuranceMinimum: number;
  blacklistedLocations: string[];
  lastUpdated: Date;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaTransitService {
  private riskProfiles: Map<string, TravelRisk> = new Map();
  private travelRequests: Map<string, TravelRequest> = new Map();
  private securityPlans: Map<string, SecurityPlan> = new Map();
  private incidents: Map<string, IncidentReport> = new Map();
  private alerts: TravelAlert[] = [];

  constructor() {
    logger.info('CendiaTransit™ initialized - Executive Protection is active');
  }

  // ---------------------------------------------------------------------------
  // RISK ASSESSMENT
  // ---------------------------------------------------------------------------

  async assessLocationRisk(location: string, country: string): Promise<TravelRisk> {
    const cached = this.riskProfiles.get(`${location}-${country}`);
    if (cached && Date.now() - cached.lastUpdated.getTime() < 3600000) { // 1 hour cache
      return cached;
    }

    const prompt = `You are CendiaTransit™, an AI travel security system.

Assess travel risk for: ${location}, ${country}

Provide comprehensive risk assessment in JSON:
{
  "overallRisk": "minimal|low|medium|high|extreme",
  "riskScore": 0-100,
  "categories": [
    {
      "category": "political|crime|terrorism|health|natural_disaster|infrastructure|civil_unrest",
      "level": "low|medium|high|extreme",
      "score": 0-100,
      "details": "specific details",
      "trend": "improving|stable|deteriorating"
    }
  ],
  "activeAlerts": [
    {
      "type": "warning|advisory|emergency",
      "title": "alert title",
      "description": "description",
      "actions": ["action 1"]
    }
  ],
  "restrictions": ["restriction 1"],
  "recommendations": ["recommendation 1"]
}`;

    let riskData: any = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('risk_analysis') });
        riskData = this.parseJsonFromResponse(response) || {};
      }
    } catch (error) {
      logger.warn('CendiaTransit: AI risk assessment unavailable');
    }

    const risk: TravelRisk = {
      location,
      country,
      region: this.getRegion(country),
      overallRisk: riskData.overallRisk || 'medium',
      riskScore: riskData.riskScore || 50,
      categories: riskData.categories || [
        { category: 'crime', level: 'medium', score: 50, details: 'Standard urban crime levels', trend: 'stable' },
        { category: 'health', level: 'low', score: 30, details: 'No significant health risks', trend: 'stable' },
      ],
      activeAlerts: (riskData.activeAlerts || []).map((a: any) => ({
        ...a,
        id: `alert-${Date.now()}`,
        locations: [location],
        effectiveDate: new Date(),
        source: 'CendiaTransit AI',
      })),
      restrictions: riskData.restrictions || [],
      recommendations: riskData.recommendations || ['Register with embassy', 'Maintain situational awareness'],
      lastUpdated: new Date(),
    };

    this.riskProfiles.set(`${location}-${country}`, risk);
    logger.info(`CendiaTransit: Risk assessment for ${location}, ${country}: ${risk.overallRisk}`);
    return risk;
  }

  private getRegion(country: string): string {
    const regions: Record<string, string> = {
      'USA': 'North America', 'Canada': 'North America', 'Mexico': 'North America',
      'UK': 'Europe', 'France': 'Europe', 'Germany': 'Europe', 'Spain': 'Europe',
      'China': 'Asia Pacific', 'Japan': 'Asia Pacific', 'Australia': 'Asia Pacific',
      'Brazil': 'South America', 'Argentina': 'South America',
    };
    return regions[country] || 'Other';
  }

  // ---------------------------------------------------------------------------
  // TRAVEL REQUEST MANAGEMENT
  // ---------------------------------------------------------------------------

  async createTravelRequest(request: Omit<TravelRequest, 'id' | 'status' | 'riskAssessment' | 'createdAt'>): Promise<TravelRequest> {
    const newRequest: TravelRequest = {
      ...request,
      id: `travel-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date(),
    };

    // Automatically assess risk
    newRequest.riskAssessment = await this.assessTravelRisk(newRequest);

    this.travelRequests.set(newRequest.id, newRequest);
    
    if (newRequest.riskAssessment.overallRisk === 'critical' || newRequest.riskAssessment.overallRisk === 'high') {
      logger.warn(`CendiaTransit: High-risk travel request from ${request.employeeName} to ${request.destinations.map(d => d.country).join(', ')}`);
    }

    return newRequest;
  }

  private async assessTravelRisk(request: TravelRequest): Promise<TravelRiskAssessment> {
    const factors: RiskFactor[] = [];
    let totalScore = 0;

    for (const dest of request.destinations) {
      const locationRisk = await this.assessLocationRisk(dest.location, dest.country);
      totalScore += locationRisk.riskScore;

      if (locationRisk.riskScore > 50) {
        factors.push({
          factor: `Destination Risk: ${dest.location}`,
          severity: locationRisk.riskScore > 70 ? 'high' : 'medium',
          description: `${dest.country} has elevated risk factors`,
          mitigation: locationRisk.recommendations[0] || 'Enhanced security measures recommended',
        });
      }
    }

    const avgScore = request.destinations.length > 0 ? totalScore / request.destinations.length : 0;

    // VIP level adjustments
    if (request.vipLevel === 'c_suite' || request.vipLevel === 'board') {
      factors.push({
        factor: 'Executive Profile',
        severity: 'medium',
        description: 'High-profile traveler requires enhanced security',
        mitigation: 'Executive protection protocol recommended',
      });
    }

    const overallRisk: TravelRiskAssessment['overallRisk'] = 
      avgScore > 75 ? 'critical' :
      avgScore > 50 ? 'high' :
      avgScore > 30 ? 'medium' : 'low';

    const approvalRequired = 
      overallRisk === 'critical' ? 'executive' :
      overallRisk === 'high' ? 'security' :
      request.vipLevel === 'c_suite' ? 'security' : 'manager';

    return {
      overallRisk,
      score: avgScore,
      factors,
      mitigations: factors.map(f => f.mitigation),
      approvalRequired,
      recommendations: [
        'Complete pre-travel security briefing',
        'Register with local embassy',
        'Download emergency communication app',
      ],
      generatedAt: new Date(),
    };
  }

  approveTravelRequest(requestId: string, approver: string): TravelRequest | null {
    const request = this.travelRequests.get(requestId);
    if (!request) return null;

    request.status = 'approved';
    request.approvedBy = approver;
    request.approvedAt = new Date();

    logger.info(`CendiaTransit: Travel request ${requestId} approved by ${approver}`);
    return request;
  }

  getTravelRequest(requestId: string): TravelRequest | null {
    return this.travelRequests.get(requestId) || null;
  }

  getActiveTravelers(): TravelRequest[] {
    return Array.from(this.travelRequests.values()).filter(r => r.status === 'in_progress');
  }

  // ---------------------------------------------------------------------------
  // SECURITY PLANNING
  // ---------------------------------------------------------------------------

  async createSecurityPlan(travelRequestId: string): Promise<SecurityPlan> {
    const request = this.travelRequests.get(travelRequestId);
    if (!request) throw new Error('Travel request not found');

    const level = this.determineSecurityLevel(request);

    const plan: SecurityPlan = {
      id: `secplan-${Date.now()}`,
      travelRequestId,
      level,
      measures: this.generateSecurityMeasures(level, request),
      groundTransport: this.planTransportation(level, request),
      safeLocations: await this.identifySafeLocations(request.destinations),
      communicationProtocol: {
        primaryChannel: level === 'high_risk' ? 'Encrypted Satellite' : 'Encrypted Mobile App',
        backupChannel: 'SMS with code phrases',
        encryptionRequired: level !== 'standard',
        checkInFrequency: level === 'high_risk' ? 'Every 2 hours' : level === 'executive' ? 'Every 4 hours' : 'Daily',
        emergencyCode: this.generateCode(),
        silentAlarmCode: this.generateCode(),
      },
      checkInSchedule: this.generateCheckInSchedule(request),
      createdAt: new Date(),
    };

    // Add extraction plan for high-risk travel
    if (level === 'high_risk' || level === 'executive') {
      plan.extractionPlan = await this.createExtractionPlan(request);
    }

    this.securityPlans.set(plan.id, plan);
    request.securityPlan = plan;

    logger.info(`CendiaTransit: Security plan created for ${request.employeeName} - Level: ${level}`);
    return plan;
  }

  private determineSecurityLevel(request: TravelRequest): SecurityPlan['level'] {
    if (!request.riskAssessment) return 'standard';

    if (request.riskAssessment.overallRisk === 'critical') return 'high_risk';
    if (request.riskAssessment.overallRisk === 'high') return 'executive';
    if (request.vipLevel === 'c_suite' || request.vipLevel === 'board') return 'executive';
    if (request.riskAssessment.overallRisk === 'medium') return 'enhanced';
    return 'standard';
  }

  private generateSecurityMeasures(level: SecurityPlan['level'], request: TravelRequest): SecurityMeasure[] {
    const measures: SecurityMeasure[] = [
      {
        measure: 'Travel insurance verification',
        category: 'physical',
        mandatory: true,
        instructions: 'Verify comprehensive travel insurance is active',
      },
      {
        measure: 'Emergency contact registration',
        category: 'communication',
        mandatory: true,
        instructions: 'Register all emergency contacts in system',
      },
    ];

    if (level !== 'standard') {
      measures.push({
        measure: 'Pre-travel security briefing',
        category: 'physical',
        mandatory: true,
        instructions: 'Complete destination-specific security briefing',
      });
      measures.push({
        measure: 'Secure communication app installation',
        category: 'cyber',
        mandatory: true,
        instructions: 'Install and configure encrypted communication app',
      });
    }

    if (level === 'executive' || level === 'high_risk') {
      measures.push({
        measure: 'Close protection detail',
        category: 'physical',
        mandatory: level === 'high_risk',
        instructions: 'Security personnel assigned for duration of trip',
      });
      measures.push({
        measure: 'Counter-surveillance awareness',
        category: 'physical',
        mandatory: false,
        instructions: 'Brief on surveillance detection techniques',
      });
    }

    return measures;
  }

  private planTransportation(level: SecurityPlan['level'], request: TravelRequest): TransportArrangement[] {
    const arrangements: TransportArrangement[] = [];

    if (level === 'high_risk') {
      arrangements.push({
        type: 'armored',
        provider: 'Verified security transport provider',
        details: 'Armored vehicle with trained driver and security personnel',
        vetted: true,
      });
    } else if (level === 'executive') {
      arrangements.push({
        type: 'secure_vehicle',
        provider: 'Executive car service',
        details: 'Vetted driver with security training',
        vetted: true,
      });
    } else {
      arrangements.push({
        type: 'commercial',
        provider: 'Approved taxi/rideshare',
        details: 'Use only approved transportation services',
        vetted: false,
      });
    }

    return arrangements;
  }

  private async identifySafeLocations(destinations: TripDestination[]): Promise<SafeLocation[]> {
    const locations: SafeLocation[] = [];

    for (const dest of destinations) {
      locations.push({
        name: `US Embassy - ${dest.country}`,
        type: 'embassy',
        address: `Embassy address in ${dest.location}`,
        contact: '+1-XXX-XXX-XXXX',
        notes: 'Primary evacuation point for US citizens',
      });
      locations.push({
        name: `Primary Medical Facility - ${dest.location}`,
        type: 'hospital',
        address: `Hospital address in ${dest.location}`,
        contact: 'Local emergency number',
        notes: 'Recommended hospital for emergency care',
      });
    }

    return locations;
  }

  private generateCheckInSchedule(request: TravelRequest): CheckIn[] {
    const schedule: CheckIn[] = [];

    for (const dest of request.destinations) {
      schedule.push({
        scheduledTime: dest.arrivalDate,
        location: dest.location,
        method: 'app',
        completed: false,
      });
      schedule.push({
        scheduledTime: dest.departureDate,
        location: dest.location,
        method: 'app',
        completed: false,
      });
    }

    return schedule;
  }

  private generateCode(): string {
    return Math.random().toString(36).substr(2, 8).toUpperCase();
  }

  private async createExtractionPlan(request: TravelRequest): Promise<ExtractionPlan> {
    return {
      id: `extract-${Date.now()}`,
      triggerConditions: [
        'Civil unrest affecting traveler safety',
        'Natural disaster in travel area',
        'Medical emergency requiring evacuation',
        'Security threat specific to traveler',
      ],
      primaryRoute: {
        method: 'air',
        provider: 'Global Rescue / International SOS',
        estimatedTime: 240, // 4 hours
        cost: 50000,
        risks: ['Airport access may be compromised'],
        waypoints: ['Safe house', 'Airport', 'Evacuation destination'],
      },
      alternativeRoutes: [
        {
          method: 'ground',
          provider: 'Secure ground transport',
          estimatedTime: 480,
          cost: 25000,
          risks: ['Road conditions', 'Border crossings'],
          waypoints: ['Safe house', 'Border crossing', 'Safe country'],
        },
      ],
      evacuationPoints: request.destinations.map(d => `Safe point in ${d.location}`),
      medicalFacilities: request.destinations.map(d => `Medical facility in ${d.location}`),
      status: 'standby',
    };
  }

  // ---------------------------------------------------------------------------
  // EXTRACTION ACTIVATION
  // ---------------------------------------------------------------------------

  async activateExtraction(planId: string, reason: string, activatedBy: string): Promise<ExtractionPlan | null> {
    const plan = Array.from(this.securityPlans.values())
      .find(sp => sp.extractionPlan?.id === planId)?.extractionPlan;

    if (!plan) return null;

    plan.status = 'activated';
    plan.activatedAt = new Date();
    plan.activatedBy = activatedBy;

    logger.error(`CendiaTransit: EXTRACTION ACTIVATED - ${planId} - Reason: ${reason}`);
    
    // In production, this would trigger alerts to security teams, emergency contacts, etc.

    return plan;
  }

  // ---------------------------------------------------------------------------
  // CHECK-IN MANAGEMENT
  // ---------------------------------------------------------------------------

  recordCheckIn(planId: string, checkInIndex: number, notes?: string): SecurityPlan | null {
    const plan = this.securityPlans.get(planId);
    if (!plan || !plan.checkInSchedule[checkInIndex]) return null;

    plan.checkInSchedule[checkInIndex].completed = true;
    plan.checkInSchedule[checkInIndex].completedAt = new Date();
    plan.checkInSchedule[checkInIndex].notes = notes;

    logger.info(`CendiaTransit: Check-in recorded for plan ${planId}`);
    return plan;
  }

  getMissedCheckIns(): { plan: SecurityPlan; checkIn: CheckIn }[] {
    const missed: { plan: SecurityPlan; checkIn: CheckIn }[] = [];
    const now = new Date();

    for (const plan of this.securityPlans.values()) {
      for (const checkIn of plan.checkInSchedule) {
        if (!checkIn.completed && checkIn.scheduledTime < now) {
          missed.push({ plan, checkIn });
        }
      }
    }

    return missed;
  }

  // ---------------------------------------------------------------------------
  // INCIDENT REPORTING
  // ---------------------------------------------------------------------------

  reportIncident(incident: Omit<IncidentReport, 'id' | 'status' | 'timeline' | 'reportedAt'>): IncidentReport {
    const report: IncidentReport = {
      ...incident,
      id: `incident-${Date.now()}`,
      status: 'reported',
      timeline: [{
        timestamp: new Date(),
        action: 'Incident reported',
        actor: 'System',
      }],
      reportedAt: new Date(),
    };

    this.incidents.set(report.id, report);

    if (incident.severity === 'critical' || incident.severity === 'serious') {
      logger.error(`CendiaTransit: ${incident.severity.toUpperCase()} INCIDENT - ${incident.type} in ${incident.location}`);
    } else {
      logger.warn(`CendiaTransit: Incident reported - ${incident.type} in ${incident.location}`);
    }

    return report;
  }

  updateIncident(incidentId: string, action: string, actor: string, status?: IncidentReport['status']): IncidentReport | null {
    const incident = this.incidents.get(incidentId);
    if (!incident) return null;

    incident.timeline.push({
      timestamp: new Date(),
      action,
      actor,
    });

    if (status) {
      incident.status = status;
      if (status === 'resolved') {
        incident.resolvedAt = new Date();
      }
    }

    return incident;
  }

  // ---------------------------------------------------------------------------
  // ALERTS
  // ---------------------------------------------------------------------------

  issueAlert(alert: Omit<TravelAlert, 'id'>): TravelAlert {
    const newAlert: TravelAlert = {
      ...alert,
      id: `alert-${Date.now()}`,
    };
    this.alerts.push(newAlert);
    
    logger.warn(`CendiaTransit: Alert issued - ${alert.type}: ${alert.title}`);
    return newAlert;
  }

  getActiveAlerts(location?: string): TravelAlert[] {
    const now = new Date();
    return this.alerts.filter(a => {
      if (a.expirationDate && a.expirationDate < now) return false;
      if (location && !a.locations.includes(location)) return false;
      return true;
    });
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
      logger.warn('CendiaTransit: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    activeTravelers: number;
    pendingRequests: number;
    activeAlerts: number;
    openIncidents: number;
    missedCheckIns: number;
  } {
    return {
      activeTravelers: this.getActiveTravelers().length,
      pendingRequests: Array.from(this.travelRequests.values()).filter(r => r.status === 'pending').length,
      activeAlerts: this.getActiveAlerts().length,
      openIncidents: Array.from(this.incidents.values()).filter(i => i.status !== 'closed').length,
      missedCheckIns: this.getMissedCheckIns().length,
    };
  }
}

// Export singleton instance
export const cendiaTransitService = new CendiaTransitService();
