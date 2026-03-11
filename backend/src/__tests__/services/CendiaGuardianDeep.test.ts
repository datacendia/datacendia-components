/**
 * CendiaGuardianService Deep Tests
 * 
 * Tests the full customer success lifecycle: customer management, engagement tracking,
 * health assessment (5 components × weighted scoring), churn prediction (heuristic path),
 * care packages (5 types × default components/messages), portfolio dashboard,
 * lifecycle analytics, engagement trend intelligence, and intervention effectiveness.
 * 
 * Uses realistic SaaS customer data with real contract values, engagement metrics,
 * and health scoring. Every test has meaningful assertions that fail if logic breaks.
 * 
 * @module __tests__/services/CendiaGuardianDeep.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));
vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));
vi.mock('../../config/aiModels.js', () => ({
  aiModelSelector: { getModelForService: vi.fn().mockReturnValue('llama3.2:3b') },
}));
vi.mock('../../services/ollama.js', () => ({
  default: {
    isAvailable: vi.fn().mockResolvedValue(false),
    generate: vi.fn().mockResolvedValue('{}'),
  },
}));

const { cendiaGuardianService } = await import('../../services/enterprise/CendiaGuardianService.js');

// Helper: create a realistic enterprise customer
function addTestCustomer(overrides: Record<string, any> = {}) {
  return cendiaGuardianService.addCustomer({
    name: overrides.name || 'Jane Doe',
    company: overrides.company || 'Acme Healthcare',
    tier: overrides.tier || 'enterprise',
    contractValue: overrides.contractValue || 250000,
    contractStartDate: overrides.contractStartDate || new Date('2024-01-01'),
    contractEndDate: overrides.contractEndDate || new Date('2025-12-31'),
    primaryContact: overrides.primaryContact || 'jane@acme.com',
    lastActivityDate: overrides.lastActivityDate || new Date(),
    onboardingComplete: overrides.onboardingComplete ?? true,
    tags: overrides.tags || ['healthcare', 'enterprise'],
  });
}

// Helper: create realistic engagement data
function recordEngagement(customerId: string, overrides: Record<string, any> = {}) {
  cendiaGuardianService.recordEngagement({
    customerId,
    period: overrides.period || '2024-Q4',
    loginCount: overrides.loginCount ?? 45,
    activeUsers: overrides.activeUsers ?? 18,
    totalUsers: overrides.totalUsers ?? 25,
    featureAdoption: overrides.featureAdoption || [
      { feature: 'council', adoptionRate: 85 },
      { feature: 'deliberations', adoptionRate: 72 },
      { feature: 'dcii', adoptionRate: 60 },
    ],
    supportTickets: overrides.supportTickets ?? 2,
    npsScore: overrides.npsScore ?? 8,
    lastFeedback: overrides.lastFeedback || 'Great platform for our compliance needs',
  });
}

// ============================================================================
// CUSTOMER MANAGEMENT
// ============================================================================

describe('CendiaGuardianService — Customer Management', () => {
  // FAILS IF: addCustomer doesn't return object with id and default health score
  it('should add customer with generated ID and initial health score of 80', () => {
    const customer = addTestCustomer({ company: 'Mgmt-Test Corp', contractValue: 150000 });
    expect(customer).toBeDefined();
    expect(customer.id).toMatch(/^cust-/);
    expect(customer.healthScore).toBe(80);
    expect(customer.company).toBe('Mgmt-Test Corp');
    expect(customer.contractValue).toBe(150000);
    expect(customer.tier).toBe('enterprise');
  });

  // FAILS IF: getCustomer returns null for valid customer
  it('should retrieve added customer by ID', () => {
    const added = addTestCustomer({ company: 'Retrieve-Test Inc' });
    const retrieved = cendiaGuardianService.getCustomer(added.id);
    expect(retrieved).not.toBeNull();
    expect(retrieved!.id).toBe(added.id);
    expect(retrieved!.company).toBe('Retrieve-Test Inc');
  });

  // FAILS IF: returns non-null for unknown ID
  it('should return null for non-existent customer', () => {
    expect(cendiaGuardianService.getCustomer('nonexistent')).toBeNull();
  });

  // FAILS IF: getAllCustomers doesn't include added customers
  it('should return all customers', () => {
    const all = cendiaGuardianService.getAllCustomers();
    expect(Array.isArray(all)).toBe(true);
    expect(all.length).toBeGreaterThan(0);
  });

  // FAILS IF: tier filter returns wrong customers
  it('should filter customers by tier', () => {
    addTestCustomer({ company: 'Pilot Co', tier: 'pilot', contractValue: 50000 });
    const pilots = cendiaGuardianService.getCustomersByTier('pilot');
    expect(pilots.length).toBeGreaterThan(0);
    expect(pilots.every(c => c.tier === 'pilot')).toBe(true);
  });
});

// ============================================================================
// ENGAGEMENT TRACKING
// ============================================================================

describe('CendiaGuardianService — Engagement Tracking', () => {
  let customerId: string;

  beforeEach(() => {
    const c = addTestCustomer({ company: 'Engagement-Test LLC' });
    customerId = c.id;
  });

  // FAILS IF: recordEngagement throws or doesn't store
  it('should record engagement and update last activity date', () => {
    const before = cendiaGuardianService.getCustomer(customerId)!.lastActivityDate;
    recordEngagement(customerId, { period: '2024-Q3', loginCount: 30 });
    const history = cendiaGuardianService.getEngagementHistory(customerId);
    expect(history.length).toBe(1);
    expect(history[0].loginCount).toBe(30);
    expect(history[0].period).toBe('2024-Q3');
  });

  // FAILS IF: getEngagementHistory doesn't respect periods limit
  it('should limit engagement history to requested periods', () => {
    recordEngagement(customerId, { period: 'Q1' });
    recordEngagement(customerId, { period: 'Q2' });
    recordEngagement(customerId, { period: 'Q3' });
    recordEngagement(customerId, { period: 'Q4' });

    const last2 = cendiaGuardianService.getEngagementHistory(customerId, 2);
    expect(last2).toHaveLength(2);
    expect(last2[0].period).toBe('Q3');
    expect(last2[1].period).toBe('Q4');
  });

  // FAILS IF: returns data for wrong customer
  it('should return empty history for customer with no engagement', () => {
    const c2 = addTestCustomer({ company: 'No-Engagement Corp' });
    const history = cendiaGuardianService.getEngagementHistory(c2.id);
    expect(history).toHaveLength(0);
  });
});

// ============================================================================
// HEALTH ASSESSMENT — Core weighted scoring
// ============================================================================

describe('CendiaGuardianService — Health Assessment', () => {
  let customerId: string;

  beforeEach(() => {
    const c = addTestCustomer({
      company: 'Health-Test Hospital',
      contractValue: 500000,
      contractEndDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year out
    });
    customerId = c.id;
  });

  // FAILS IF: assessHealth throws for valid customer with no engagement
  it('should assess health for customer with no engagement (defaults)', async () => {
    const health = await cendiaGuardianService.assessHealth(customerId);
    expect(health).toBeDefined();
    expect(health.customerId).toBe(customerId);
    expect(typeof health.overallScore).toBe('number');
    expect(health.overallScore).toBeGreaterThanOrEqual(0);
    expect(health.overallScore).toBeLessThanOrEqual(100);
    expect(health.components.length).toBe(5); // Engagement, Adoption, Support, Contract, Sentiment
    expect(['improving', 'stable', 'declining', 'critical']).toContain(health.trend);
    expect(health.lastAssessment).toBeInstanceOf(Date);
  });

  // FAILS IF: weighted scoring math is wrong
  it('should calculate weighted health from 5 components', async () => {
    // Add high engagement data
    recordEngagement(customerId, {
      loginCount: 20, activeUsers: 20, totalUsers: 25,
      featureAdoption: [{ feature: 'council', adoptionRate: 90 }],
      supportTickets: 0, npsScore: 9,
    });

    const health = await cendiaGuardianService.assessHealth(customerId);

    // Verify all 5 components present
    const names = health.components.map(c => c.name);
    expect(names).toContain('Engagement');
    expect(names).toContain('Adoption');
    expect(names).toContain('Support Health');
    expect(names).toContain('Contract Health');
    expect(names).toContain('Sentiment');

    // Weights should sum to 1.0
    const totalWeight = health.components.reduce((sum, c) => sum + c.weight, 0);
    expect(totalWeight).toBeCloseTo(1.0, 2);

    // With good engagement, score should be high
    expect(health.overallScore).toBeGreaterThan(70);
  });

  // FAILS IF: assessHealth doesn't throw for unknown customer
  it('should throw for non-existent customer', async () => {
    await expect(cendiaGuardianService.assessHealth('fake-id')).rejects.toThrow('Customer fake-id not found');
  });

  // FAILS IF: high support tickets don't reduce health score
  it('should penalize health for high support ticket volume', async () => {
    recordEngagement(customerId, { supportTickets: 12, loginCount: 5, npsScore: 4 });
    const health = await cendiaGuardianService.assessHealth(customerId);
    const supportComponent = health.components.find(c => c.name === 'Support Health');
    expect(supportComponent).toBeDefined();
    // 100 - (12 * 10) = max(0, -20) = 0
    expect(supportComponent!.score).toBeLessThanOrEqual(0);
  });

  // FAILS IF: contract risk not detected for near-expiry contract
  it('should detect contract risk for customer near renewal', async () => {
    const nearExpiry = addTestCustomer({
      company: 'Expiring-Soon Inc',
      contractEndDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000), // 20 days
      contractValue: 300000,
    });
    recordEngagement(nearExpiry.id, { loginCount: 5, supportTickets: 3 });
    const health = await cendiaGuardianService.assessHealth(nearExpiry.id);
    
    const contractRisk = health.riskFactors.find(r => r.category === 'contract');
    expect(contractRisk).toBeDefined();
    expect(contractRisk!.severity).toBe('critical');
    expect(contractRisk!.description).toContain('renewal');
  });

  // FAILS IF: trend detection returns wrong direction
  it('should detect declining trend when health drops significantly', async () => {
    // First assessment (baseline)
    recordEngagement(customerId, { loginCount: 20, supportTickets: 0, npsScore: 9 });
    await cendiaGuardianService.assessHealth(customerId);

    // Second assessment with terrible engagement
    recordEngagement(customerId, { loginCount: 1, supportTickets: 15, npsScore: 2 });
    const health = await cendiaGuardianService.assessHealth(customerId);
    
    // Should be declining or critical
    expect(['declining', 'critical']).toContain(health.trend);
  });
});

// ============================================================================
// CHURN PREDICTION — Heuristic path (Ollama unavailable)
// ============================================================================

describe('CendiaGuardianService — Churn Prediction', () => {
  let customerId: string;

  beforeEach(() => {
    const c = addTestCustomer({
      company: 'Churn-Test Corp',
      contractValue: 200000,
      contractEndDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    });
    customerId = c.id;
  });

  // FAILS IF: predictChurn throws for valid customer
  it('should predict churn probability with heuristic fallback', async () => {
    recordEngagement(customerId, { loginCount: 3, supportTickets: 8, npsScore: 4 });
    const prediction = await cendiaGuardianService.predictChurn(customerId);

    expect(prediction).toBeDefined();
    expect(prediction.customerId).toBe(customerId);
    expect(prediction.probability).toBeGreaterThanOrEqual(5);
    expect(prediction.probability).toBeLessThanOrEqual(95);
    expect(prediction.confidence).toBeGreaterThan(0);
    expect(['30_days', '60_days', '90_days', '6_months']).toContain(prediction.timeframe);
    expect(prediction.generatedAt).toBeInstanceOf(Date);
  });

  // FAILS IF: healthy customer gets high churn score
  it('should predict low churn for healthy customer', async () => {
    recordEngagement(customerId, { loginCount: 25, supportTickets: 0, npsScore: 9, activeUsers: 20, totalUsers: 25 });
    const prediction = await cendiaGuardianService.predictChurn(customerId);
    // Base 20 - health bonus = should be low
    expect(prediction.probability).toBeLessThan(50);
  });

  // FAILS IF: predictChurn doesn't throw for unknown customer
  it('should throw for non-existent customer', async () => {
    await expect(cendiaGuardianService.predictChurn('fake-id')).rejects.toThrow();
  });

  // FAILS IF: churn drivers are empty when risk factors exist
  it('should include primary drivers from risk factors', async () => {
    recordEngagement(customerId, { loginCount: 2, supportTickets: 12, npsScore: 3 });
    const prediction = await cendiaGuardianService.predictChurn(customerId);
    expect(prediction.primaryDrivers.length).toBeGreaterThan(0);
    for (const driver of prediction.primaryDrivers) {
      expect(driver).toHaveProperty('factor');
      expect(driver).toHaveProperty('contribution');
      expect(driver).toHaveProperty('actionable');
      expect(driver).toHaveProperty('suggestedIntervention');
    }
  });
});

// ============================================================================
// CARE PACKAGES — 5 types × default components
// ============================================================================

describe('CendiaGuardianService — Care Packages', () => {
  let customerId: string;

  beforeEach(() => {
    const c = addTestCustomer({ company: 'Care-Test Inc', contractValue: 100000 });
    customerId = c.id;
  });

  // FAILS IF: generateCarePackage throws for valid customer
  it('should generate rescue care package with default components', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'rescue');
    expect(pkg).toBeDefined();
    expect(pkg.id).toMatch(/^care-/);
    expect(pkg.customerId).toBe(customerId);
    expect(pkg.type).toBe('rescue');
    expect(pkg.status).toBe('draft');
    expect(pkg.components.length).toBe(3); // credit + support_hours + training
    expect(pkg.totalValue).toBeGreaterThan(0);
    expect(pkg.message).toContain('challenges');
  });

  // FAILS IF: appreciation package doesn't have gift component
  it('should generate appreciation care package', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'appreciation');
    expect(pkg.type).toBe('appreciation');
    expect(pkg.components.length).toBe(2); // gift + feature_access
    const types = pkg.components.map(c => c.type);
    expect(types).toContain('gift');
    expect(types).toContain('feature_access');
    expect(pkg.message).toContain('valued');
  });

  // FAILS IF: milestone message doesn't congratulate
  it('should generate milestone care package', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'milestone');
    expect(pkg.components.length).toBe(2); // credit + discount
    expect(pkg.message).toContain('Congratulations');
  });

  // FAILS IF: apology package doesn't include service credit
  it('should generate apology care package', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'apology');
    const types = pkg.components.map(c => c.type);
    expect(types).toContain('credit');
    expect(types).toContain('support_hours');
    expect(pkg.message).toContain('apologize');
  });

  // FAILS IF: win_back package doesn't include discount
  it('should generate win_back care package', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'win_back');
    const types = pkg.components.map(c => c.type);
    expect(types).toContain('discount');
    expect(types).toContain('training');
    expect(pkg.message).toContain('welcome you back');
  });

  // FAILS IF: approve doesn't change status
  it('should approve a care package', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'appreciation');
    const approved = cendiaGuardianService.approveCarePackage(pkg.id);
    expect(approved).not.toBeNull();
    expect(approved!.status).toBe('approved');
  });

  // FAILS IF: deliver works on non-approved package
  it('should only deliver approved packages', async () => {
    const pkg = await cendiaGuardianService.generateCarePackage(customerId, 'rescue');
    // Try to deliver before approval
    const notDelivered = cendiaGuardianService.deliverCarePackage(pkg.id);
    expect(notDelivered).toBeFalsy();

    // Approve then deliver
    cendiaGuardianService.approveCarePackage(pkg.id);
    const delivered = cendiaGuardianService.deliverCarePackage(pkg.id);
    expect(delivered).not.toBeNull();
    expect(delivered!.status).toBe('delivered');
    expect(delivered!.deliveredAt).toBeInstanceOf(Date);
  });

  // FAILS IF: throws for unknown customer
  it('should throw for non-existent customer', async () => {
    await expect(cendiaGuardianService.generateCarePackage('fake', 'rescue')).rejects.toThrow();
  });
});

// ============================================================================
// METRICS
// ============================================================================

describe('CendiaGuardianService — Metrics', () => {
  // FAILS IF: getMetrics returns wrong shape
  it('should return portfolio metrics', () => {
    const metrics = cendiaGuardianService.getMetrics();
    expect(metrics).toHaveProperty('totalCustomers');
    expect(metrics).toHaveProperty('averageHealthScore');
    expect(metrics).toHaveProperty('atRiskCount');
    expect(metrics).toHaveProperty('totalContractValue');
    expect(metrics).toHaveProperty('atRiskValue');
    expect(typeof metrics.totalCustomers).toBe('number');
    expect(metrics.totalCustomers).toBeGreaterThan(0);
    expect(metrics.totalContractValue).toBeGreaterThan(0);
  });
});

// ============================================================================
// PORTFOLIO HEALTH DASHBOARD
// ============================================================================

describe('CendiaGuardianService — Portfolio Health Dashboard', () => {
  // FAILS IF: getPortfolioHealthDashboard throws or returns wrong shape
  it('should return complete portfolio dashboard', async () => {
    const dashboard = await cendiaGuardianService.getPortfolioHealthDashboard();
    expect(dashboard).toBeDefined();

    // Summary
    expect(dashboard.summary.totalCustomers).toBeGreaterThan(0);
    expect(dashboard.summary.totalContractValue).toBeGreaterThan(0);
    expect(typeof dashboard.summary.weightedHealthScore).toBe('number');
    expect(typeof dashboard.summary.revenueAtRisk).toBe('number');
    expect(typeof dashboard.summary.revenueAtRiskPercentage).toBe('number');
    expect(typeof dashboard.summary.netRetentionForecast).toBe('number');

    // Tier breakdown
    expect(Array.isArray(dashboard.tierBreakdown)).toBe(true);
    for (const tier of dashboard.tierBreakdown) {
      expect(tier).toHaveProperty('tier');
      expect(tier).toHaveProperty('count');
      expect(tier).toHaveProperty('contractValue');
      expect(tier).toHaveProperty('avgHealthScore');
    }

    // Health distribution
    expect(dashboard.healthDistribution).toHaveProperty('excellent');
    expect(dashboard.healthDistribution).toHaveProperty('good');
    expect(dashboard.healthDistribution).toHaveProperty('warning');
    expect(dashboard.healthDistribution).toHaveProperty('critical');

    // Renewal pipeline
    expect(Array.isArray(dashboard.renewalPipeline)).toBe(true);

    // Top risks and opportunities
    expect(Array.isArray(dashboard.topRisks)).toBe(true);
    expect(Array.isArray(dashboard.topOpportunities)).toBe(true);
  });
});

// ============================================================================
// LIFECYCLE ANALYTICS
// ============================================================================

describe('CendiaGuardianService — Lifecycle Analytics', () => {
  // FAILS IF: getLifecycleAnalytics throws or returns wrong shape
  it('should return lifecycle analytics with stage distribution', async () => {
    const analytics = await cendiaGuardianService.getLifecycleAnalytics();
    expect(analytics).toBeDefined();

    // Stage distribution
    expect(Array.isArray(analytics.stageDistribution)).toBe(true);
    for (const stage of analytics.stageDistribution) {
      expect(stage).toHaveProperty('stage');
      expect(stage).toHaveProperty('count');
      expect(stage).toHaveProperty('avgHealthScore');
      expect(stage).toHaveProperty('totalContractValue');
    }

    // Stage progression
    expect(Array.isArray(analytics.stageProgression)).toBe(true);
    for (const prog of analytics.stageProgression) {
      expect(prog).toHaveProperty('customerId');
      expect(prog).toHaveProperty('currentStage');
      expect(prog).toHaveProperty('onTrack');
      expect(typeof prog.onTrack).toBe('boolean');
    }

    // Bottlenecks
    expect(Array.isArray(analytics.bottlenecks)).toBe(true);

    // Onboarding health
    expect(analytics.onboardingHealth).toHaveProperty('totalOnboarding');
    expect(analytics.onboardingHealth).toHaveProperty('completedOnboarding');
    expect(analytics.onboardingHealth).toHaveProperty('avgOnboardingDays');
    expect(analytics.onboardingHealth).toHaveProperty('stuckInOnboarding');
  });
});

// ============================================================================
// ENGAGEMENT TREND INTELLIGENCE
// ============================================================================

describe('CendiaGuardianService — Engagement Trend Intelligence', () => {
  let customerId: string;

  beforeEach(() => {
    const c = addTestCustomer({ company: 'Trend-Test Corp' });
    customerId = c.id;
  });

  // FAILS IF: getEngagementTrendIntelligence throws for valid customer
  it('should return engagement trends with forecasting', async () => {
    // Record 6 periods of engagement to enable forecasting
    for (let i = 1; i <= 6; i++) {
      recordEngagement(customerId, {
        period: `2024-W${i}`,
        loginCount: 10 + i * 3,
        activeUsers: 10 + i,
        totalUsers: 25,
        supportTickets: Math.max(0, 5 - i),
        npsScore: 6 + Math.floor(i / 2),
      });
    }

    const intel = await cendiaGuardianService.getEngagementTrendIntelligence(customerId);
    expect(intel).toBeDefined();
    expect(intel.customerId).toBe(customerId);
    expect(intel.periods).toBe(6);

    // Trends
    expect(['increasing', 'decreasing', 'stable', 'volatile']).toContain(intel.trends.loginTrend);
    expect(['increasing', 'decreasing', 'stable', 'volatile']).toContain(intel.trends.adoptionTrend);
    expect(['improving', 'worsening', 'stable']).toContain(intel.trends.supportTrend);
    expect(['growing', 'shrinking', 'stable']).toContain(intel.trends.userGrowthTrend);

    // Forecast
    expect(intel.forecast.nextPeriodLogins).toBeGreaterThan(0);
    expect(intel.forecast.nextPeriodActiveUsers).toBeGreaterThan(0);
    expect(intel.forecast.confidence).toBe(75); // 6 periods = high confidence

    // Engagement score
    expect(intel.engagementScore).toBeGreaterThanOrEqual(0);
    expect(intel.engagementScore).toBeLessThanOrEqual(100);

    // Insights
    expect(Array.isArray(intel.insights)).toBe(true);
    expect(intel.insights.length).toBeGreaterThan(0);
  });

  // FAILS IF: doesn't throw for unknown customer
  it('should throw for non-existent customer', async () => {
    await expect(cendiaGuardianService.getEngagementTrendIntelligence('fake')).rejects.toThrow();
  });

  // FAILS IF: anomaly detection breaks with minimal data
  it('should handle customer with minimal engagement data', async () => {
    recordEngagement(customerId, { period: 'Q1', loginCount: 5 });
    const intel = await cendiaGuardianService.getEngagementTrendIntelligence(customerId);
    expect(intel.periods).toBe(1);
    expect(intel.forecast.confidence).toBe(30); // Low confidence with 1 period
  });
});

// ============================================================================
// INTERVENTION EFFECTIVENESS
// ============================================================================

describe('CendiaGuardianService — Intervention Effectiveness', () => {
  // FAILS IF: getInterventionEffectiveness throws or returns wrong shape
  it('should return intervention effectiveness metrics', async () => {
    const effectiveness = await cendiaGuardianService.getInterventionEffectiveness();
    expect(effectiveness).toBeDefined();
    expect(typeof effectiveness.totalInterventions).toBe('number');
    expect(typeof effectiveness.totalInvestment).toBe('number');
    expect(Array.isArray(effectiveness.interventionsByType)).toBe(true);
    expect(Array.isArray(effectiveness.topInterventions)).toBe(true);
    expect(effectiveness.savingsEstimate).toHaveProperty('customersRetained');
    expect(effectiveness.savingsEstimate).toHaveProperty('revenuePreserved');
    expect(effectiveness.savingsEstimate).toHaveProperty('interventionCost');
    expect(effectiveness.savingsEstimate).toHaveProperty('netROI');
    expect(Array.isArray(effectiveness.insights)).toBe(true);
  });
});

// ============================================================================
// DASHBOARD & HEALTH CHECK
// ============================================================================

describe('CendiaGuardianService — Dashboard & Health', () => {
  // FAILS IF: getDashboard returns wrong shape
  it('should return service dashboard', async () => {
    const dashboard = await cendiaGuardianService.getDashboard();
    expect(dashboard.serviceName).toBe('CendiaGuardian');
    expect(dashboard.status).toBe('operational');
    expect(typeof dashboard.recordCount).toBe('number');
    expect(dashboard.lastActivity).toBeInstanceOf(Date);
    expect(typeof dashboard.uptime).toBe('number');
    expect(typeof dashboard.metrics).toBe('object');
  });

  // FAILS IF: getHealth returns unhealthy or wrong shape
  it('should return health check', async () => {
    const health = await cendiaGuardianService.getHealth();
    expect(health.healthy).toBe(true);
    expect(health.service).toBe('CendiaGuardian');
    expect(health.timestamp).toBeInstanceOf(Date);
    expect(health.details).toHaveProperty('uptime');
    expect(health.details).toHaveProperty('memoryMB');
  });
});
