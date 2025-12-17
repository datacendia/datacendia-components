// @ts-nocheck
// =============================================================================
// DATACENDIA CORE - INTERNAL ADMIN SERVICES
// "Dogfooding" - Datacendia runs on Datacendia
// =============================================================================

export { cendiaBrandService, type ContentPiece, type ProductFeature, type LaunchSchedule } from './CendiaBrandService.js';
export { cendiaFoundryService, type RoadmapItem, type TechnicalDebt, type FeatureRecommendation } from './CendiaFoundryService.js';
export { cendiaRevenueService, type RevenueMetrics, type RunwayCalculation, type PricingRecommendation } from './CendiaRevenueService.js';
export { cendiaSupportService, type SupportTicket, type CustomerHealth, type ChurnPrediction } from './CendiaSupportService.js';
export { cendiaWatchService, type Competitor, type MarketSignal, type ThreatAlert, type IntelligenceReport } from './CendiaWatchService.js';

// =============================================================================
// DATACENDIA CORE DASHBOARD
// Aggregates all internal services into a single view
// =============================================================================

import { cendiaBrandService } from './CendiaBrandService.js';
import { cendiaFoundryService } from './CendiaFoundryService.js';
import { cendiaRevenueService } from './CendiaRevenueService.js';
import { cendiaSupportService } from './CendiaSupportService.js';
import { cendiaWatchService } from './CendiaWatchService.js';

export interface CoreDashboard {
  // Brand
  contentQueue: number;
  scheduledPosts: number;
  
  // Foundry
  backlogItems: number;
  technicalDebtCount: number;
  topPriority: string | null;
  nagMessage: string | null;
  
  // Revenue
  mrr: number;
  arr: number;
  runwayMonths: number;
  pricingAdvice: string | null;
  
  // Support
  openTickets: number;
  atRiskCustomers: number;
  
  // Watch
  activeAlerts: number;
  criticalAlert: string | null;
  
  // Overall
  lastUpdated: Date;
}

export async function getCoreDashboard(): Promise<CoreDashboard> {
  const metrics = cendiaRevenueService.calculateMetrics();
  const runway = cendiaRevenueService.calculateRunway(100000, 15000); // Would get real values
  const priorities = await cendiaFoundryService.prioritizeFeatures();
  const atRisk = await cendiaSupportService.getAtRiskCustomers();
  
  return {
    // Brand
    contentQueue: cendiaBrandService.getContentQueue().length,
    scheduledPosts: cendiaBrandService.getContentQueue().filter(c => c.status === 'scheduled').length,
    
    // Foundry
    backlogItems: cendiaFoundryService.getRoadmap().filter(r => r.status === 'backlog').length,
    technicalDebtCount: 0, // Would get from Foundry
    topPriority: priorities[0]?.featureName || null,
    nagMessage: cendiaFoundryService.getNagMessage(),
    
    // Revenue
    mrr: metrics.mrr,
    arr: metrics.arr,
    runwayMonths: runway.runwayMonths,
    pricingAdvice: await cendiaRevenueService.getQuickPricingAdvice(),
    
    // Support
    openTickets: cendiaSupportService.getMetrics().openTickets,
    atRiskCustomers: atRisk.length,
    
    // Watch
    activeAlerts: cendiaWatchService.getAlerts(false).length,
    criticalAlert: cendiaWatchService.getCriticalAlert(),
    
    // Overall
    lastUpdated: new Date(),
  };
}
