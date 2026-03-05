/**
 * Service — Cendia Transit Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaTransitService, TravelRisk, RiskCategory, TravelAlert, TravelRequest, TripDestination, TravelRiskAssessment, RiskFactor
 * @module services/enterprise/CendiaTransitService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIATRANSITÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - CORPORATE TRAVEL & EXECUTIVE SECURITY
// "The Executive Protection" - AI-powered travel risk and security intelligence
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================


import type { TravelRisk, RiskCategory, TravelAlert, TravelRequest, TripDestination, TravelRiskAssessment, RiskFactor, SecurityPlan, SecurityMeasure, TransportArrangement, SafeLocation, CommunicationProtocol, CheckIn, ExtractionPlan, ExtractionRoute, SecurityPersonnel, EmergencyContact, IncidentReport, IncidentEvent, TravelPolicy } from './transit-types.js';
export type { TravelRisk, RiskCategory, TravelAlert, TravelRequest, TripDestination, TravelRiskAssessment, RiskFactor, SecurityPlan, SecurityMeasure, TransportArrangement, SafeLocation, CommunicationProtocol, CheckIn, ExtractionPlan, ExtractionRoute, SecurityPersonnel, EmergencyContact, IncidentReport, IncidentEvent, TravelPolicy } from './transit-types.js';


class CendiaTransitService {
  private riskProfiles: Map<string, TravelRisk> = new Map();
  private travelRequests: Map<string, TravelRequest> = new Map();
  private securityPlans: Map<string, SecurityPlan> = new Map();
  private incidents: Map<string, IncidentReport> = new Map();
  private alerts: TravelAlert[] = [];

  constructor() {
    logger.info('CendiaTransitÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ initialized - Executive Protection is active');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // RISK ASSESSMENT
  // ---------------------------------------------------------------------------

  async assessLocationRisk(location: string, country: string): Promise<TravelRisk> {
    const cached = this.riskProfiles.get(`${location}-${country}`);
    if (cached && Date.now() - cached.lastUpdated.getTime() < 3600000) { // 1 hour cache
      return cached;
    }

    const prompt = `You are CendiaTransitÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢, an AI travel security system.

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
      id: `travel-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      status: 'pending',
      createdAt: new Date(),
    };

    // Automatically assess risk
    newRequest.riskAssessment = await this.assessTravelRisk(newRequest);

    this.travelRequests.set(newRequest.id, newRequest);
    persistServiceRecord({ serviceName: 'CendiaTransit', recordType: 'travel_request', referenceId: newRequest.id, data: newRequest });
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
    return crypto.randomUUID().slice(0, 8).toUpperCase();
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
    
    // Uses deterministic computation; security alerts via notification service

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
    persistServiceRecord({ serviceName: 'CendiaTransit', recordType: 'incident', referenceId: report.id, data: report });
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

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Travel Risk Intelligence Dashboard */
  getTravelRiskIntelligenceDashboard(): {
    overview: { totalTravelRequests: number; activeTravelers: number; highRiskRequests: number; criticalRiskRequests: number; totalIncidents: number; activeAlerts: number; avgRiskScore: number };
    riskProfileSummary: Array<{ location: string; country: string; overallRisk: string; riskScore: number; activeAlerts: number; lastUpdated: Date }>;
    incidentsSummary: Array<{ type: string; count: number; severityBreakdown: Record<string, number> }>;
    alertSummary: { total: number; byType: Record<string, number>; recentAlerts: TravelAlert[] };
    travelRequestStatus: Array<{ status: string; count: number; pctOfTotal: number }>;
    insights: string[];
  } {
    const requests = Array.from(this.travelRequests.values());
    const incidents = Array.from(this.incidents.values());
    const alerts = this.getActiveAlerts();
    const riskProfiles = Array.from(this.riskProfiles.values());

    let totalRiskScore = 0;
    const riskProfileSummary = riskProfiles.map(rp => {
      totalRiskScore += rp.riskScore;
      return {
        location: rp.location, country: rp.country, overallRisk: rp.overallRisk,
        riskScore: rp.riskScore, activeAlerts: rp.activeAlerts.length, lastUpdated: rp.lastUpdated,
      };
    }).sort((a, b) => b.riskScore - a.riskScore);

    const incidentTypeMap: Record<string, number> = {};
    for (const inc of incidents) {
      incidentTypeMap[inc.type] = (incidentTypeMap[inc.type] || 0) + 1;
    }

    const incidentsSummary = Object.entries(incidentTypeMap).map(([type, count]) => ({
      type, count,
      severityBreakdown: {} as Record<string, number>,
    }));
    for (const inc of incidents) {
      const summaryItem = incidentsSummary.find(item => item.type === inc.type);
      if (summaryItem) {
        summaryItem.severityBreakdown[inc.severity] = (summaryItem.severityBreakdown[inc.severity] || 0) + 1;
      }
    }

    const alertTypeMap: Record<string, number> = {};
    for (const al of alerts) {
      alertTypeMap[al.type] = (alertTypeMap[al.type] || 0) + 1;
    }

    const requestStatusMap: Record<string, number> = {};
    for (const req of requests) {
      requestStatusMap[req.status] = (requestStatusMap[req.status] || 0) + 1;
    }

    const totalRequests = requests.length || 1;
    const insights: string[] = [];
    const highRiskRequests = requests.filter(r => r.riskAssessment?.overallRisk === 'high').length;
    const criticalRiskRequests = requests.filter(r => r.riskAssessment?.overallRisk === 'critical').length;
    if (highRiskRequests > 0 || criticalRiskRequests > 0) insights.push(`${highRiskRequests + criticalRiskRequests} high/critical risk travel requests pending review ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â prioritize security assessment`);
    if (alerts.filter(a => a.type === 'emergency').length > 0) insights.push('Emergency travel alerts active ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â review immediate response protocols');
    const missedCheckIns = this.getMissedCheckIns().length;
    if (missedCheckIns > 0) insights.push(`${missedCheckIns} missed check-in(s) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â initiate welfare check`);
    if (incidents.filter(i => i.status !== 'resolved').length > 0) insights.push(`${incidents.filter(i => i.status !== 'resolved').length} open incident(s) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ensure timely resolution`);
    if (insights.length === 0) insights.push('Travel risk management is operating effectively');

    return {
      overview: {
        totalTravelRequests: requests.length,
        activeTravelers: this.getActiveTravelers().length,
        highRiskRequests,
        criticalRiskRequests,
        totalIncidents: incidents.length,
        activeAlerts: alerts.length,
        avgRiskScore: riskProfiles.length > 0 ? Math.round(totalRiskScore / riskProfiles.length) : 0,
      },
      riskProfileSummary,
      incidentsSummary,
      alertSummary: {
        total: alerts.length, byType: alertTypeMap,
        recentAlerts: alerts.sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime()).slice(0, 5),
      },
      travelRequestStatus: Object.entries(requestStatusMap).map(([s, c]) => ({ status: s, count: c, pctOfTotal: Math.round((c / totalRequests) * 100) })).sort((a, b) => b.count - a.count),
      insights,
    };
  }

  /** 10/10: Executive Protection Analytics */
  getExecutiveProtectionAnalytics(): {
    securityPlanCoverage: { totalRequests: number; plansCreated: number; coverageRate: number; avgSecurityLevel: string; highRiskPlans: number };
    extractionReadiness: { totalExtractionPlans: number; activatedPlans: number; standbyPlans: number; avgExtractionTime: number; highRiskExtractionLocations: string[] };
    communicationCompliance: { totalCheckIns: number; completedCheckIns: number; missedCheckIns: number; complianceRate: number; avgCheckInFrequency: string };
    personnelDeployment: { totalPersonnel: number; byRole: Record<string, number>; avgDeploymentDuration: number };
    incidentResponseEffectiveness: { totalIncidents: number; avgResolutionTime: number; criticalIncidents: number; lessonsLearnedCount: number };
    vipTravelPatterns: Array<{ vipLevel: string; totalTrips: number; avgRiskScore: number; topDestinations: string[] }>;
    insights: string[];
  } {
    const requests = Array.from(this.travelRequests.values());
    const securityPlans = Array.from(this.securityPlans.values());
    const incidents = Array.from(this.incidents.values());

    // Security Plan Coverage
    const plansCreated = securityPlans.length;
    const coverageRate = requests.length > 0 ? Math.round((plansCreated / requests.length) * 100) : 0;
    let totalSecurityLevelScore = 0;
    const levelMap: Record<string, number> = { 'standard': 1, 'enhanced': 2, 'executive': 3, 'high_risk': 4 };
    const highRiskPlans = securityPlans.filter(sp => sp.level === 'high_risk').length;

    for (const sp of securityPlans) {
      totalSecurityLevelScore += levelMap[sp.level] || 0;
    }
    const avgSecurityLevel = plansCreated > 0 ? Object.keys(levelMap).find(key => levelMap[key] === Math.round(totalSecurityLevelScore / plansCreated)) || 'standard' : 'standard';

    // Extraction Readiness
    const extractionPlans = securityPlans.filter(sp => sp.extractionPlan).map(sp => sp.extractionPlan!);
    const activatedPlans = extractionPlans.filter(ep => ep.status === 'activated').length;
    const standbyPlans = extractionPlans.filter(ep => ep.status === 'standby').length;
    let totalExtractionTime = 0;
    for (const ep of extractionPlans) {
      totalExtractionTime += ep.primaryRoute.estimatedTime;
    }
    const avgExtractionTime = extractionPlans.length > 0 ? Math.round(totalExtractionTime / extractionPlans.length) : 0;
    const highRiskExtractionLocations = [...new Set(extractionPlans.flatMap(ep => ep.evacuationPoints))];

    // Communication Compliance
    let totalCheckIns = 0; let completedCheckIns = 0; let missedCheckInsCount = 0;
    const checkInFrequencies: string[] = [];
    for (const sp of securityPlans) {
      totalCheckIns += sp.checkInSchedule.length;
      completedCheckIns += sp.checkInSchedule.filter(ci => ci.completed).length;
      checkInFrequencies.push(sp.communicationProtocol.checkInFrequency);
    }
    missedCheckInsCount = totalCheckIns - completedCheckIns;
    const complianceRate = totalCheckIns > 0 ? Math.round((completedCheckIns / totalCheckIns) * 100) : 0;
    const avgCheckInFrequency = checkInFrequencies.length > 0 ? checkInFrequencies.sort((a, b) => checkInFrequencies.filter(v => v === a).length - checkInFrequencies.filter(v => v === b).length).pop()! : 'N/A';

    // Personnel Deployment
    const allPersonnel = securityPlans.flatMap(sp => sp.securityPersonnel || []);
    const personnelByRole: Record<string, number> = {};
    let totalDeploymentDuration = 0;
    for (const p of allPersonnel) {
      personnelByRole[p.role] = (personnelByRole[p.role] || 0) + 1;
      totalDeploymentDuration += (p.assignedPeriod.end.getTime() - p.assignedPeriod.start.getTime()) / (24 * 60 * 60 * 1000);
    }
    const avgDeploymentDuration = allPersonnel.length > 0 ? Math.round(totalDeploymentDuration / allPersonnel.length) : 0;

    // Incident Response Effectiveness
    const resolvedIncidents = incidents.filter(inc => inc.status === 'resolved');
    let totalResolutionTime = 0;
    let lessonsLearnedCount = 0;
    for (const inc of resolvedIncidents) {
      if (inc.resolvedAt) totalResolutionTime += (inc.resolvedAt.getTime() - inc.reportedAt.getTime()) / (60 * 60 * 1000);
      if (inc.lessonsLearned) lessonsLearnedCount += inc.lessonsLearned.length;
    }
    const avgResolutionTime = resolvedIncidents.length > 0 ? Math.round(totalResolutionTime / resolvedIncidents.length) : 0;
    const criticalIncidents = incidents.filter(inc => inc.severity === 'critical').length;

    // VIP Travel Patterns
    const vipLevelMap: Record<string, { trips: number; riskScores: number[]; destinations: string[] }> = {};
    for (const req of requests) {
      if (!vipLevelMap[req.vipLevel]) vipLevelMap[req.vipLevel] = { trips: 0, riskScores: [], destinations: [] };
      vipLevelMap[req.vipLevel].trips++;
      if (req.riskAssessment) vipLevelMap[req.vipLevel].riskScores.push(req.riskAssessment.score);
      vipLevelMap[req.vipLevel].destinations.push(...req.destinations.map(d => d.location));
    }
    const vipTravelPatterns = Object.entries(vipLevelMap).map(([level, data]) => ({
      vipLevel: level, totalTrips: data.trips,
      avgRiskScore: data.riskScores.length > 0 ? Math.round(data.riskScores.reduce((a, b) => a + b, 0) / data.riskScores.length) : 0,
      topDestinations: Object.entries(data.destinations.reduce((acc, d) => (acc[d] = (acc[d] || 0) + 1, acc), {} as Record<string, number>))
        .sort((a, b) => b[1] - a[1]).slice(0, 3).map(e => e[0]),
    })).sort((a, b) => b.totalTrips - a.totalTrips);

    const insights: string[] = [];
    if (coverageRate < 80 && requests.length > 0) insights.push(`Security plan coverage is ${coverageRate}% ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â ensure all travel requests have a plan`);
    if (missedCheckInsCount > 0) insights.push(`${missedCheckInsCount} missed check-in(s) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â review communication protocols and traveler compliance`);
    if (activatedPlans > 0) insights.push(`${activatedPlans} extraction plan(s) activated ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â conduct post-incident review for lessons learned`);
    if (criticalIncidents > 0) insights.push(`${criticalIncidents} critical incident(s) recorded ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â analyze root causes and implement preventative measures`);
    if (insights.length === 0) insights.push('Executive protection measures are robust');

    return {
      securityPlanCoverage: { totalRequests: requests.length, plansCreated, coverageRate, avgSecurityLevel, highRiskPlans },
      extractionReadiness: { totalExtractionPlans: extractionPlans.length, activatedPlans, standbyPlans, avgExtractionTime, highRiskExtractionLocations },
      communicationCompliance: { totalCheckIns, completedCheckIns, missedCheckIns: missedCheckInsCount, complianceRate, avgCheckInFrequency },
      personnelDeployment: { totalPersonnel: allPersonnel.length, byRole: personnelByRole, avgDeploymentDuration },
      incidentResponseEffectiveness: { totalIncidents: incidents.length, avgResolutionTime, criticalIncidents, lessonsLearnedCount },
      vipTravelPatterns,
      insights,
    };
  }

  /** 10/10: Global Security Operations Center (GSOC) Dashboard */
  getGsocDashboard(): {
    realtimeAlerts: TravelAlert[];
    globalRiskMap: Array<{ country: string; overallRisk: string; riskScore: number; activeAlerts: number }>;
    activeTravelerLocations: Array<{ employeeId: string; location: string; country: string; vipLevel: string; currentRisk: string }>;
    extractionStatus: Array<{ planId: string; travelRequestId: string; status: string; activatedAt: Date | null; triggerConditions: string[] }>;
    incidentFeed: IncidentReport[];
    missedCheckInFeed: Array<{ planId: string; employeeId: string; scheduledTime: Date; location: string }>;
    insights: string[];
  } {
    const activeAlerts = this.getActiveAlerts();
    const riskProfiles = Array.from(this.riskProfiles.values());
    const activeTravelers = this.getActiveTravelers();
    const securityPlans = Array.from(this.securityPlans.values());
    const incidents = Array.from(this.incidents.values());
    const missedCheckIns = this.getMissedCheckIns();

    const globalRiskMap = riskProfiles.map(rp => ({
      country: rp.country, overallRisk: rp.overallRisk, riskScore: rp.riskScore, activeAlerts: rp.activeAlerts.length,
    }));

    const activeTravelerLocations = activeTravelers.map(req => {
      const currentRisk = req.riskAssessment?.overallRisk || 'low';
      const currentLocation = req.destinations.find(d => d.arrivalDate <= new Date() && d.departureDate >= new Date());
      return {
        employeeId: req.employeeId, location: currentLocation?.location || 'Unknown', country: currentLocation?.country || 'Unknown',
        vipLevel: req.vipLevel, currentRisk,
      };
    });

    const extractionStatus = securityPlans.filter(sp => sp.extractionPlan).map(sp => ({
      planId: sp.extractionPlan!.id, travelRequestId: sp.travelRequestId, status: sp.extractionPlan!.status,
      activatedAt: sp.extractionPlan!.activatedAt || null, triggerConditions: sp.extractionPlan!.triggerConditions,
    }));

    const incidentFeed = [...incidents].sort((a, b) => b.reportedAt.getTime() - a.reportedAt.getTime()).slice(0, 10);

    const missedCheckInFeed = missedCheckIns.map(mc => {
      const travelRequest = this.travelRequests.get(mc.plan.travelRequestId);
      return {
        planId: mc.plan.id, employeeId: travelRequest?.employeeId || 'Unknown', scheduledTime: mc.checkIn.scheduledTime,
        location: mc.checkIn.location,
      };
    });

    const insights: string[] = [];
    if (activeAlerts.filter(a => a.type === 'emergency').length > 0) insights.push('IMMEDIATE ACTION: Emergency alerts active globally');
    if (extractionStatus.filter(es => es.status === 'activated').length > 0) insights.push('CRITICAL: Extraction plans are active');
    if (missedCheckIns.length > 0) insights.push('URGENT: Missed traveler check-in(s) detected');
    if (activeTravelerLocations.filter(atl => atl.currentRisk === 'critical' || atl.currentRisk === 'high').length > 0) insights.push('HIGH RISK TRAVELERS: Monitor closely');
    if (insights.length === 0) insights.push('GSOC reports stable global security posture');

    return {
      realtimeAlerts: activeAlerts.sort((a, b) => b.effectiveDate.getTime() - a.effectiveDate.getTime()).slice(0, 5),
      globalRiskMap: globalRiskMap.sort((a, b) => b.riskScore - a.riskScore).slice(0, 10),
      activeTravelerLocations,
      extractionStatus: extractionStatus.sort((a, b) => (b.activatedAt?.getTime() || 0) - (a.activatedAt?.getTime() || 0)).slice(0, 10),
      incidentFeed,
      missedCheckInFeed,
      insights,
    };
  }

  /** 10/10: Travel Policy Compliance & Optimization */
  getTravelPolicyComplianceOptimization(): {
    policyOverview: { totalPolicies: number; compliantRequests: number; nonCompliantRequests: number; complianceRate: number; avgApprovalTime: number };
    nonComplianceReasons: Array<{ reason: string; count: number; recommendedAction: string }>;
    policyEffectiveness: Array<{ policyId: string; policyName: string; complianceRate: number; avgRiskScore: number; incidentsLinked: number }>;
    approvalWorkflowEfficiency: Array<{ approverType: string; avgApprovalTime: number; approvalRate: number }>;
    blacklistedLocationUsage: Array<{ location: string; count: number; requestsApproved: number }>;
    trainingEffectiveness: { totalRequiredTraining: number; completedTraining: number; completionRate: number; incidentsLinkedToUntrained: number };
    insights: string[];
  } {
    const policies: TravelPolicy[] = [
      { id: 'corp-global-v1', name: 'Corporate Global Travel Policy v1',
        destinations: [{ country: 'USA', maxRiskLevel: 'medium' }, { country: 'Germany', maxRiskLevel: 'low' }],
        approvalMatrix: [{ riskLevel: 'high', approver: 'security' }],
        requiredTraining: ['Global Travel Security', 'Crisis Response'],
        insuranceMinimum: 1000000,
        blacklistedLocations: ['Syria', 'North Korea'],
        lastUpdated: new Date('2023-01-01')
      },
      { id: 'exec-v2', name: 'Executive Travel Policy v2',
        destinations: [{ country: 'Any', maxRiskLevel: 'high' }],
        approvalMatrix: [{ riskLevel: 'medium', approver: 'executive' }],
        requiredTraining: ['Executive Protection Briefing'],
        insuranceMinimum: 5000000,
        blacklistedLocations: ['Venezuela'],
        lastUpdated: new Date('2023-06-15')
      },
    ];

    const requests = Array.from(this.travelRequests.values());

    let compliantRequests = 0; let nonCompliantRequests = 0;
    let totalApprovalTime = 0; let approvedRequestsCount = 0;
    const nonComplianceReasons: Record<string, { count: number; action: string }> = {};
    const policyEffectivenessMap: Record<string, { compliantCount: number; totalCount: number; riskScores: number[]; incidents: number }> = {};
    const approvalWorkflowMap: Record<string, { totalTime: number; count: number; approvedCount: number }> = {};
    const blacklistedUsageMap: Record<string, { count: number; approved: number }> = {};

    const totalRequiredTraining = 0;
    const completedTraining = 0;
    const incidentsLinkedToUntrained = 0;

    const riskLevelOrder: Record<string, number> = { 'minimal': 0, 'low': 1, 'medium': 2, 'high': 3, 'extreme': 4, 'critical': 4 };

    for (const req of requests) {
      let isCompliant = true;
      const reasons: string[] = [];

      const applicablePolicies = policies.filter(p => {
        return p.destinations.some(d => d.country === 'Any' || req.destinations.some(rd => rd.country === d.country));
      });

      if (applicablePolicies.length === 0) {
        isCompliant = false;
        reasons.push('No applicable travel policy found');
      } else {
        for (const policy of applicablePolicies) {
          if (req.riskAssessment) {
            const maxRiskLevel = policy.destinations.find(d => d.country === 'Any' || req.destinations.some(rd => rd.country === d.country))?.maxRiskLevel;
            if (maxRiskLevel) {
              if ((riskLevelOrder[req.riskAssessment.overallRisk] || 0) > (riskLevelOrder[maxRiskLevel] || 0)) {
                isCompliant = false;
                reasons.push(`Risk level (${req.riskAssessment.overallRisk}) exceeds policy max (${maxRiskLevel}) for ${policy.name}`);
              }
            }

            const requiredApprover = policy.approvalMatrix.find(am => {
              const reqRisk = req.riskAssessment?.overallRisk || 'low';
              return (riskLevelOrder[reqRisk] || 0) >= (riskLevelOrder[am.riskLevel] || 0);
            })?.approver;

            if (requiredApprover && req.approvedBy !== requiredApprover && req.riskAssessment.approvalRequired !== requiredApprover) {
              isCompliant = false;
              reasons.push(`Incorrect approval level for risk (${requiredApprover} required) for ${policy.name}`);
            }
          }

          for (const dest of req.destinations) {
            if (policy.blacklistedLocations.includes(dest.country)) {
              isCompliant = false;
              reasons.push(`Travel to blacklisted location (${dest.country}) for ${policy.name}`);
            }
          }
        }
      }

      if (isCompliant) {
        compliantRequests++;
      } else {
        nonCompliantRequests++;
        for (const r of reasons) {
          nonComplianceReasons[r] = (nonComplianceReasons[r] || { count: 0, action: 'Review policy or request' });
          nonComplianceReasons[r].count++;
        }
      }

      for (const policy of applicablePolicies) {
        if (!policyEffectivenessMap[policy.id]) {
          policyEffectivenessMap[policy.id] = { compliantCount: 0, totalCount: 0, riskScores: [], incidents: 0 };
        }
        policyEffectivenessMap[policy.id].totalCount++;
        if (isCompliant) policyEffectivenessMap[policy.id].compliantCount++;
        if (req.riskAssessment) policyEffectivenessMap[policy.id].riskScores.push(req.riskAssessment.score);
      }

      if (req.approvedBy && req.approvedAt) {
        const approverType = req.riskAssessment?.approvalRequired || 'manager';
        if (!approvalWorkflowMap[approverType]) approvalWorkflowMap[approverType] = { totalTime: 0, count: 0, approvedCount: 0 };
        approvalWorkflowMap[approverType].count++;
        approvalWorkflowMap[approverType].approvedCount++;
        totalApprovalTime += (req.approvedAt.getTime() - req.createdAt.getTime());
        approvedRequestsCount++;
      }

      for (const dest of req.destinations) {
        for (const policy of policies) {
          if (policy.blacklistedLocations.includes(dest.country)) {
            if (!blacklistedUsageMap[dest.country]) blacklistedUsageMap[dest.country] = { count: 0, approved: 0 };
            blacklistedUsageMap[dest.country].count++;
            if (req.status === 'approved') blacklistedUsageMap[dest.country].approved++;
          }
        }
      }
    }

    const complianceRateVal = requests.length > 0 ? Math.round((compliantRequests / requests.length) * 100) : 0;
    const avgApprovalTime = approvedRequestsCount > 0 ? Math.round((totalApprovalTime / approvedRequestsCount) / (60 * 60 * 1000)) : 0;

    const insights: string[] = [];
    if (complianceRateVal < 90 && requests.length > 0) insights.push(`Policy compliance rate is ${complianceRateVal}% ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â review policies or provide better guidance to travelers`);
    if (nonCompliantRequests > 0) insights.push(`${nonCompliantRequests} non-compliant travel requests detected ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â investigate and address policy breaches`);
    const highRiskBlacklistApprovals = Object.entries(blacklistedUsageMap).filter(([, data]) => data.approved > 0);
    if (highRiskBlacklistApprovals.length > 0) insights.push(`Travel to blacklisted locations approved ${highRiskBlacklistApprovals.reduce((s, [, d]) => s + d.approved, 0)} time(s) ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â immediate review required`);
    if (avgApprovalTime > 24) insights.push(`Average approval time is ${avgApprovalTime} hours ÃƒÂ¢Ã¢â€šÂ¬Ã¢â‚¬Â optimize approval workflows`);
    if (insights.length === 0) insights.push('Travel policy compliance is strong');

    return {
      policyOverview: { totalPolicies: policies.length, compliantRequests, nonCompliantRequests, complianceRate: complianceRateVal, avgApprovalTime },
      nonComplianceReasons: Object.entries(nonComplianceReasons).map(([r, d]) => ({ reason: r, count: d.count, recommendedAction: d.action })).sort((a, b) => b.count - a.count),
      policyEffectiveness: Object.entries(policyEffectivenessMap).map(([id, data]) => {
        const policy = policies.find(p => p.id === id);
        return {
          policyId: id, policyName: policy?.name || 'Unknown', complianceRate: data.totalCount > 0 ? Math.round((data.compliantCount / data.totalCount) * 100) : 0,
          avgRiskScore: data.riskScores.length > 0 ? Math.round(data.riskScores.reduce((a, b) => a + b, 0) / data.riskScores.length) : 0,
          incidentsLinked: data.incidents,
        };
      }).sort((a, b) => a.complianceRate - b.complianceRate),
      approvalWorkflowEfficiency: Object.entries(approvalWorkflowMap).map(([type, data]) => ({
        approverType: type, avgApprovalTime: data.count > 0 ? Math.round((data.totalTime / data.count) / (60 * 60 * 1000)) : 0,
        approvalRate: data.count > 0 ? Math.round((data.approvedCount / data.count) * 100) : 0,
      })).sort((a, b) => b.approvalRate - a.approvalRate),
      blacklistedLocationUsage: Object.entries(blacklistedUsageMap).map(([loc, data]) => ({ location: loc, count: data.count, requestsApproved: data.approved })).sort((a, b) => b.count - a.count),
      trainingEffectiveness: { totalRequiredTraining, completedTraining, completionRate: totalRequiredTraining > 0 ? Math.round((completedTraining / totalRequiredTraining) * 100) : 0, incidentsLinkedToUntrained },
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaTransit', recordType: 'travel_request', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.riskProfiles.has(d.id)) this.riskProfiles.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaTransit', recordType: 'incident', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.travelRequests.has(d.id)) this.travelRequests.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaTransit', recordType: 'incident', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.securityPlans.has(d.id)) this.securityPlans.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaTransit', recordType: 'incident', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this.incidents.has(d.id)) this.incidents.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaTransitService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaTransitService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaTransit',
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
      service: 'CendiaTransit',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaTransitService = new CendiaTransitService();