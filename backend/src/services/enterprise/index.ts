/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports EnterpriseDashboard
 * @module services/enterprise/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA ENTERPRISE SERVICES
// "Total Enterprise Operating System" - Full-Stack Corporation Services
// ALL 15 SERVICES FULLY IMPLEMENTED WITH AI INTEGRATION
// =============================================================================

// 1. PROCUREMENT & SOURCING
export { cendiaProcureService } from './CendiaProcureService.js';
export type { VendorContract, NegotiationOpportunity, SqueezeResult } from './CendiaProcureService.js';

// 2. HUMAN RESOURCES - TALENT ACQUISITION  
export { cendiaScoutService } from './CendiaScoutService.js';
export type { PsychometricProfile, TopPerformer, Candidate, ShadowPipeline } from './CendiaScoutService.js';

// 3. FACILITIES & REAL ESTATE
export { cendiaHabitatService } from './CendiaHabitatService.js';
export type { HabitatZone, BioSyncRecommendation, SpaceUtilization, RealEstateOptimization, EnergyAnalysis } from './CendiaHabitatService.js';

// 4. SALES OPERATIONS
export { cendiaRainmakerService } from './CendiaRainmakerService.js';
export type { Deal, CallAnalysis, DealPrediction, ExecutiveLetter } from './CendiaRainmakerService.js';

// 5. CUSTOMER SUCCESS
export { cendiaGuardianService } from './CendiaGuardianService.js';
export type { CustomerProfile, CustomerHealth, ChurnPrediction, CarePackage } from './CendiaGuardianService.js';

// 6. IT OPERATIONS & DEVOPS
export { cendiaNerveService } from './CendiaNerveService.js';
export type { SystemService, Incident, ThreatDetection, LazarusProtocol, CapacityForecast } from './CendiaNerveService.js';

// 7. LEGAL OPERATIONS
export { cendiaDocketService } from './CendiaDocketService.js';
export type { LegalMatter, LitigationAnalysis, ContractAnalysis, DiscoveryRequest, ComplianceCheck } from './CendiaDocketService.js';

// 8. INVESTOR RELATIONS
export { cendiaEquityService } from './CendiaEquityService.js';
export type { MarketSentiment, EarningsSimulation, EarningsCallPrep, InvestorProfile, ActivistDefense } from './CendiaEquityService.js';

// 9. M&A CULTURE INTEGRATION
export { cendiaMeshService } from './CultureIntegrationService.js';
export type { CultureProfile, CultureComparison, IntegrationRoadmap, TalentRetention, ChangeReadiness } from './CultureIntegrationService.js';

// 10. MANUFACTURING & PRODUCTION
export { cendiaFactoryService } from './CendiaFactoryService.js';
export type { ProductionLine, PredictiveFailure, YieldOptimization, QualityEvent, OEEMetrics } from './CendiaFactoryService.js';

// 11. CORPORATE TRAVEL & SECURITY
export { cendiaTransitService } from './CendiaTransitService.js';
export type { TravelRisk, TravelRequest, SecurityPlan, ExtractionPlan, IncidentReport } from './CendiaTransitService.js';

// 12. LEARNING & DEVELOPMENT
export { cendiaAcademyService } from './CendiaAcademyService.js';
export type { EmployeeSkillProfile, SkillGap, LearningPath, MicroCourse, TeamSkillMatrix } from './CendiaAcademyService.js';

// 13. CORPORATE COMMUNICATIONS
export { cendiaResonanceService } from './CendiaResonanceService.js';
export type { CommunicationCampaign, BeliefMetric, LeakPattern, CrisisResponse, NarrativeAnalysis } from './CendiaResonanceService.js';

// 14. R&D & INTELLECTUAL PROPERTY
export { cendiaInventumService } from './CendiaInventumService.js';
export type { IdeaCapture, Patent, ResearchProject, IPPortfolio, ProvisionalPatentDraft } from './CendiaInventumService.js';

// 15. CEO'S OFFICE
export { cendiaRegentService } from './CendiaRegentService.js';
export type { HistoricalAdvisor, RegentSession, MirrorAnalysis } from './CendiaRegentService.js';

// =============================================================================
// ENTERPRISE DASHBOARD - AGGREGATED METRICS
// =============================================================================

import { cendiaProcureService } from './CendiaProcureService.js';
import { cendiaScoutService } from './CendiaScoutService.js';
import { cendiaRainmakerService } from './CendiaRainmakerService.js';
import { cendiaRegentService } from './CendiaRegentService.js';
import { cendiaHabitatService } from './CendiaHabitatService.js';
import { cendiaGuardianService } from './CendiaGuardianService.js';
import { cendiaNerveService } from './CendiaNerveService.js';
import { cendiaDocketService } from './CendiaDocketService.js';
import { cendiaEquityService } from './CendiaEquityService.js';
import { cendiaMeshService } from './CultureIntegrationService.js';
import { cendiaFactoryService } from './CendiaFactoryService.js';
import { cendiaTransitService } from './CendiaTransitService.js';
import { cendiaAcademyService } from './CendiaAcademyService.js';
import { cendiaResonanceService } from './CendiaResonanceService.js';
import { cendiaInventumService } from './CendiaInventumService.js';

export interface EnterpriseDashboard {
  procurement: { totalContracts: number; pendingSavings: number };
  talent: { pipelineHealth: number; openReqs: number };
  sales: { pipelineValue: number; atRiskDeals: number };
  ceo: { pendingDecisions: number; mirrorAlerts: number };
  facilities: { totalZones: number; avgUtilization: number };
  customerSuccess: { totalCustomers: number; atRiskCount: number; avgHealthScore: number };
  itOps: { healthyServices: number; activeIncidents: number; uptime: number };
  legal: { activeMatters: number; totalExposure: number };
  ir: { totalInvestors: number; inBlackout: boolean };
  ma: { activeIntegrations: number; avgCompatibility: number };
  manufacturing: { linesRunning: number; avgOEE: number };
  travel: { activeTravelers: number; activeAlerts: number };
  learning: { avgSkillLevel: number; activeGaps: number };
  communications: { activeCampaigns: number; activeCrises: number };
  innovation: { totalIdeas: number; patentableIdeas: number; activeProjects: number };
}

export async function getEnterpriseDashboard(): Promise<EnterpriseDashboard> {
  // Get metrics from all 15 services
  const procure = cendiaProcureService.getMetrics();
  const scout = cendiaScoutService.getMetrics();
  const rainmaker = cendiaRainmakerService.getMetrics();
  const regent = cendiaRegentService.getMetrics();
  const habitat = cendiaHabitatService.getMetrics();
  const guardian = cendiaGuardianService.getMetrics();
  const nerve = cendiaNerveService.getMetrics();
  const docket = cendiaDocketService.getMetrics();
  const equity = cendiaEquityService.getMetrics();
  const mesh = cendiaMeshService.getMetrics();
  const factory = cendiaFactoryService.getMetrics();
  const transit = cendiaTransitService.getMetrics();
  const academy = cendiaAcademyService.getMetrics();
  const resonance = cendiaResonanceService.getMetrics();
  const inventum = cendiaInventumService.getMetrics();

  return {
    procurement: { 
      totalContracts: procure.pendingNegotiations, 
      pendingSavings: procure.savingsThisYear 
    },
    talent: { 
      pipelineHealth: scout.pipelineHealth, 
      openReqs: scout.openPositions 
    },
    sales: { 
      pipelineValue: rainmaker.pipelineValue, 
      atRiskDeals: rainmaker.atRiskDeals 
    },
    ceo: { 
      pendingDecisions: regent.pendingDecisions, 
      mirrorAlerts: regent.mirrorAlerts 
    },
    facilities: {
      totalZones: habitat.totalZones,
      avgUtilization: habitat.averageUtilization,
    },
    customerSuccess: {
      totalCustomers: guardian.totalCustomers,
      atRiskCount: guardian.atRiskCount,
      avgHealthScore: guardian.averageHealthScore,
    },
    itOps: {
      healthyServices: nerve.healthyServices,
      activeIncidents: nerve.activeIncidents,
      uptime: nerve.overallUptime,
    },
    legal: {
      activeMatters: docket.activeMatters,
      totalExposure: docket.totalExposure,
    },
    ir: {
      totalInvestors: equity.totalInvestors,
      inBlackout: equity.inBlackout,
    },
    ma: {
      activeIntegrations: mesh.activeIntegrations,
      avgCompatibility: mesh.avgCompatibility,
    },
    manufacturing: {
      linesRunning: factory.linesRunning,
      avgOEE: factory.avgOEE,
    },
    travel: {
      activeTravelers: transit.activeTravelers,
      activeAlerts: transit.activeAlerts,
    },
    learning: {
      avgSkillLevel: academy.avgSkillLevel,
      activeGaps: academy.activeGaps,
    },
    communications: {
      activeCampaigns: resonance.activeCampaigns,
      activeCrises: resonance.activeCrises,
    },
    innovation: {
      totalIdeas: inventum.totalIdeas,
      patentableIdeas: inventum.patentableIdeas,
      activeProjects: inventum.activeProjects,
    },
  };
}
