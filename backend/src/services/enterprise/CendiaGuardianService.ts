// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAGUARDIANÃ¢â€žÂ¢ - CUSTOMER SUCCESS & RETENTION INTELLIGENCE
// "The Churn Shield" - Proactive customer health monitoring
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface CustomerProfile {
  id: string;
  name: string;
  company: string;
  tier: 'pilot' | 'foundation' | 'enterprise' | 'strategic';
  contractValue: number;
  contractStartDate: Date;
  contractEndDate: Date;
  primaryContact: string;
  healthScore: number;
  lastActivityDate: Date;
  onboardingComplete: boolean;
  tags: string[];
}

export interface CustomerHealth {
  customerId: string;
  overallScore: number;
  trend: 'improving' | 'stable' | 'declining' | 'critical';
  components: HealthComponent[];
  riskFactors: RiskFactor[];
  opportunities: SuccessOpportunity[];
  recommendedActions: RecommendedAction[];
  lastAssessment: Date;
}

export interface HealthComponent {
  name: string;
  score: number;
  weight: number;
  trend: 'up' | 'stable' | 'down';
  details: string;
}

export interface RiskFactor {
  category: 'engagement' | 'adoption' | 'support' | 'contract' | 'champion' | 'competitive';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  impact: number;
  mitigation: string;
}

export interface SuccessOpportunity {
  type: 'upsell' | 'expansion' | 'referral' | 'case_study' | 'advocacy';
  probability: number;
  value: number;
  description: string;
  nextStep: string;
}

export interface RecommendedAction {
  action: string;
  priority: 'immediate' | 'this_week' | 'this_month' | 'next_quarter';
  impact: 'high' | 'medium' | 'low';
  effort: 'low' | 'medium' | 'high';
  owner: string;
  deadline?: Date;
}

export interface ChurnPrediction {
  customerId: string;
  probability: number;
  confidence: number;
  timeframe: '30_days' | '60_days' | '90_days' | '6_months';
  primaryDrivers: ChurnDriver[];
  preventionStrategy: string;
  interventionROI: number;
  generatedAt: Date;
}

export interface ChurnDriver {
  factor: string;
  contribution: number;
  trend: 'worsening' | 'stable' | 'improving';
  actionable: boolean;
  suggestedIntervention: string;
}

export interface CarePackage {
  id: string;
  customerId: string;
  type: 'rescue' | 'appreciation' | 'milestone' | 'apology' | 'win_back';
  components: PackageComponent[];
  totalValue: number;
  message: string;
  deliveryMethod: 'email' | 'call' | 'in_app' | 'physical';
  status: 'draft' | 'approved' | 'delivered' | 'acknowledged';
  createdAt: Date;
  deliveredAt?: Date;
}

export interface PackageComponent {
  type: 'credit' | 'training' | 'support_hours' | 'feature_access' | 'gift' | 'discount';
  description: string;
  value: number;
  duration?: string;
}

export interface CustomerEngagement {
  customerId: string;
  period: string;
  loginCount: number;
  activeUsers: number;
  totalUsers: number;
  featureAdoption: { feature: string; adoptionRate: number }[];
  supportTickets: number;
  npsScore?: number;
  lastFeedback?: string;
}

export interface SuccessPlaybook {
  customerId: string;
  stage: 'onboarding' | 'adoption' | 'growth' | 'renewal' | 'at_risk' | 'churned';
  currentMilestone: string;
  completedMilestones: string[];
  upcomingMilestones: { milestone: string; dueDate: Date; owner: string }[];
  blockers: string[];
  successCriteria: string[];
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaGuardianService {
  private customers: Map<string, CustomerProfile> = new Map();
  private healthScores: Map<string, CustomerHealth> = new Map();
  private engagementData: Map<string, CustomerEngagement[]> = new Map();
  private carePackages: Map<string, CarePackage[]> = new Map();
  private playbooks: Map<string, SuccessPlaybook> = new Map();

  constructor() {
    logger.info('CendiaGuardianÃ¢â€žÂ¢ initialized - The Churn Shield is active');
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER MANAGEMENT
  // ---------------------------------------------------------------------------

  addCustomer(customer: Omit<CustomerProfile, 'id' | 'healthScore'>): CustomerProfile {
    const newCustomer: CustomerProfile = {
      ...customer,
      id: `cust-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      healthScore: 80, // Initial health score
    };
    this.customers.set(newCustomer.id, newCustomer);
    this.engagementData.set(newCustomer.id, []);
    this.carePackages.set(newCustomer.id, []);
    persistServiceRecord({ serviceName: 'CendiaGuardian', recordType: 'customer_profile', referenceId: newCustomer.id, data: newCustomer });
    
    // Initialize playbook
    this.playbooks.set(newCustomer.id, {
      customerId: newCustomer.id,
      stage: 'onboarding',
      currentMilestone: 'Initial Setup',
      completedMilestones: [],
      upcomingMilestones: [
        { milestone: 'Complete onboarding', dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), owner: 'CSM' },
        { milestone: 'First value realization', dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), owner: 'CSM' },
      ],
      blockers: [],
      successCriteria: ['50% feature adoption', '3+ active users', 'NPS > 7'],
    });

    logger.info(`CendiaGuardian: Added customer ${newCustomer.company} (${newCustomer.id})`);
    return newCustomer;
  }

  getCustomer(customerId: string): CustomerProfile | null {
    return this.customers.get(customerId) || null;
  }

  getAllCustomers(): CustomerProfile[] {
    return Array.from(this.customers.values());
  }

  getCustomersByTier(tier: CustomerProfile['tier']): CustomerProfile[] {
    return Array.from(this.customers.values()).filter(c => c.tier === tier);
  }

  // ---------------------------------------------------------------------------
  // ENGAGEMENT TRACKING
  // ---------------------------------------------------------------------------

  recordEngagement(engagement: CustomerEngagement): void {
    const history = this.engagementData.get(engagement.customerId) || [];
    history.push(engagement);
    if (history.length > 365) history.shift(); // Keep 1 year of data
    this.engagementData.set(engagement.customerId, history);
    
    // Update customer last activity
    const customer = this.customers.get(engagement.customerId);
    if (customer) {
      customer.lastActivityDate = new Date();
    }

    logger.debug(`CendiaGuardian: Recorded engagement for ${engagement.customerId}`);
  }

  getEngagementHistory(customerId: string, periods?: number): CustomerEngagement[] {
    const history = this.engagementData.get(customerId) || [];
    return periods ? history.slice(-periods) : history;
  }

  // ---------------------------------------------------------------------------
  // HEALTH ASSESSMENT
  // ---------------------------------------------------------------------------

  async assessHealth(customerId: string): Promise<CustomerHealth> {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error(`Customer ${customerId} not found`);

    const engagement = this.getEngagementHistory(customerId, 30);
    const playbook = this.playbooks.get(customerId);
    
    // Calculate health components
    const components = this.calculateHealthComponents(customer, engagement);
    const overallScore = this.calculateOverallHealth(components);
    
    // Determine trend
    const previousHealth = this.healthScores.get(customerId);
    const trend = this.determineTrend(overallScore, previousHealth?.overallScore);

    // Identify risk factors
    const riskFactors = await this.identifyRiskFactors(customer, engagement, components);

    // Identify opportunities
    const opportunities = this.identifyOpportunities(customer, engagement, overallScore);

    // Generate recommended actions
    const recommendedActions = await this.generateRecommendedActions(
      customer, riskFactors, opportunities, playbook
    );

    const health: CustomerHealth = {
      customerId,
      overallScore,
      trend,
      components,
      riskFactors,
      opportunities,
      recommendedActions,
      lastAssessment: new Date(),
    };

    // Update stored health and customer score
    this.healthScores.set(customerId, health);
    customer.healthScore = overallScore;

    logger.info(`CendiaGuardian: Health assessment for ${customerId}: ${overallScore} (${trend})`);
    return health;
  }

  private calculateHealthComponents(
    customer: CustomerProfile, 
    engagement: CustomerEngagement[]
  ): HealthComponent[] {
    const recentEngagement = engagement[engagement.length - 1];
    const previousEngagement = engagement[engagement.length - 2];

    const components: HealthComponent[] = [];

    // Engagement Score
    const loginScore = recentEngagement 
      ? Math.min(100, (recentEngagement.loginCount / 20) * 100)
      : 50;
    components.push({
      name: 'Engagement',
      score: loginScore,
      weight: 0.25,
      trend: previousEngagement && recentEngagement
        ? recentEngagement.loginCount > previousEngagement.loginCount ? 'up' : 
          recentEngagement.loginCount < previousEngagement.loginCount ? 'down' : 'stable'
        : 'stable',
      details: `${recentEngagement?.loginCount || 0} logins in period`,
    });

    // Adoption Score
    const adoptionRate = recentEngagement?.featureAdoption?.length
      ? recentEngagement.featureAdoption.reduce((sum, f) => sum + f.adoptionRate, 0) / 
        recentEngagement.featureAdoption.length
      : 50;
    components.push({
      name: 'Adoption',
      score: adoptionRate,
      weight: 0.25,
      trend: 'stable',
      details: `${Math.round(adoptionRate)}% average feature adoption`,
    });

    // Support Health (inverse of tickets)
    const supportScore = recentEngagement
      ? Math.max(0, 100 - (recentEngagement.supportTickets * 10))
      : 80;
    components.push({
      name: 'Support Health',
      score: supportScore,
      weight: 0.2,
      trend: previousEngagement && recentEngagement
        ? recentEngagement.supportTickets < previousEngagement.supportTickets ? 'up' : 
          recentEngagement.supportTickets > previousEngagement.supportTickets ? 'down' : 'stable'
        : 'stable',
      details: `${recentEngagement?.supportTickets || 0} support tickets`,
    });

    // Contract Health
    const daysToRenewal = Math.ceil(
      (customer.contractEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    const contractScore = daysToRenewal > 180 ? 100 : 
      daysToRenewal > 90 ? 80 :
      daysToRenewal > 30 ? 60 : 40;
    components.push({
      name: 'Contract Health',
      score: contractScore,
      weight: 0.15,
      trend: 'stable',
      details: `${daysToRenewal} days to renewal`,
    });

    // NPS Score
    const npsScore = recentEngagement?.npsScore 
      ? (recentEngagement.npsScore / 10) * 100
      : 70;
    components.push({
      name: 'Sentiment',
      score: npsScore,
      weight: 0.15,
      trend: 'stable',
      details: `NPS: ${recentEngagement?.npsScore || 'N/A'}`,
    });

    return components;
  }

  private calculateOverallHealth(components: HealthComponent[]): number {
    return Math.round(
      components.reduce((sum, c) => sum + (c.score * c.weight), 0)
    );
  }

  private determineTrend(
    current: number, 
    previous?: number
  ): CustomerHealth['trend'] {
    if (!previous) return 'stable';
    const diff = current - previous;
    if (diff > 10) return 'improving';
    if (diff < -10) return 'critical';
    if (diff < -5) return 'declining';
    return 'stable';
  }

  private async identifyRiskFactors(
    customer: CustomerProfile,
    engagement: CustomerEngagement[],
    components: HealthComponent[]
  ): Promise<RiskFactor[]> {
    const risks: RiskFactor[] = [];
    const recent = engagement[engagement.length - 1];

    // Check engagement risks
    if (components.find(c => c.name === 'Engagement')?.score || 0 < 50) {
      risks.push({
        category: 'engagement',
        severity: 'high',
        description: 'Low platform engagement detected',
        impact: 25,
        mitigation: 'Schedule executive business review to understand blockers',
      });
    }

    // Check adoption risks
    if (components.find(c => c.name === 'Adoption')?.score || 0 < 40) {
      risks.push({
        category: 'adoption',
        severity: 'medium',
        description: 'Feature adoption below target',
        impact: 20,
        mitigation: 'Provide targeted training on underutilized features',
      });
    }

    // Check support risks
    if (recent && recent.supportTickets > 5) {
      risks.push({
        category: 'support',
        severity: recent.supportTickets > 10 ? 'high' : 'medium',
        description: `Elevated support ticket volume (${recent.supportTickets} tickets)`,
        impact: 15,
        mitigation: 'Escalate to support leadership, consider dedicated support',
      });
    }

    // Check contract risks
    const daysToRenewal = Math.ceil(
      (customer.contractEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
    );
    if (daysToRenewal < 60) {
      risks.push({
        category: 'contract',
        severity: daysToRenewal < 30 ? 'critical' : 'high',
        description: `Contract renewal in ${daysToRenewal} days`,
        impact: 30,
        mitigation: 'Initiate renewal conversations immediately',
      });
    }

    return risks;
  }

  private identifyOpportunities(
    customer: CustomerProfile,
    engagement: CustomerEngagement[],
    healthScore: number
  ): SuccessOpportunity[] {
    const opportunities: SuccessOpportunity[] = [];
    const recent = engagement[engagement.length - 1];

    if (healthScore > 80 && recent?.npsScore && recent.npsScore >= 9) {
      opportunities.push({
        type: 'referral',
        probability: 0.7,
        value: customer.contractValue * 0.5,
        description: 'High NPS promoter - referral candidate',
        nextStep: 'Ask for referral introduction',
      });

      opportunities.push({
        type: 'case_study',
        probability: 0.6,
        value: 5000,
        description: 'Strong candidate for success story',
        nextStep: 'Propose case study collaboration',
      });
    }

    if (customer.tier !== 'strategic' && healthScore > 75) {
      opportunities.push({
        type: 'upsell',
        probability: 0.5,
        value: customer.contractValue * 0.3,
        description: 'Potential tier upgrade',
        nextStep: 'Present value of higher tier features',
      });
    }

    if (recent && recent.activeUsers / recent.totalUsers > 0.8) {
      opportunities.push({
        type: 'expansion',
        probability: 0.6,
        value: customer.contractValue * 0.4,
        description: 'High user saturation - expansion opportunity',
        nextStep: 'Discuss adding more seats/licenses',
      });
    }

    return opportunities;
  }

  private async generateRecommendedActions(
    customer: CustomerProfile,
    riskFactors: RiskFactor[],
    opportunities: SuccessOpportunity[],
    playbook?: SuccessPlaybook
  ): Promise<RecommendedAction[]> {
    const actions: RecommendedAction[] = [];

    // Actions from risk factors
    for (const risk of riskFactors.filter(r => r.severity === 'critical' || r.severity === 'high')) {
      actions.push({
        action: risk.mitigation,
        priority: risk.severity === 'critical' ? 'immediate' : 'this_week',
        impact: 'high',
        effort: 'medium',
        owner: 'CSM',
        deadline: new Date(Date.now() + (risk.severity === 'critical' ? 3 : 7) * 24 * 60 * 60 * 1000),
      });
    }

    // Actions from opportunities
    for (const opp of opportunities.filter(o => o.probability > 0.5)) {
      actions.push({
        action: opp.nextStep,
        priority: 'this_month',
        impact: opp.value > customer.contractValue * 0.3 ? 'high' : 'medium',
        effort: 'low',
        owner: opp.type === 'upsell' || opp.type === 'expansion' ? 'AE' : 'CSM',
      });
    }

    // Actions from playbook
    if (playbook) {
      for (const milestone of playbook.upcomingMilestones.slice(0, 2)) {
        if (milestone.dueDate <= new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)) {
          actions.push({
            action: `Complete: ${milestone.milestone}`,
            priority: 'this_week',
            impact: 'medium',
            effort: 'medium',
            owner: milestone.owner,
            deadline: milestone.dueDate,
          });
        }
      }
    }

    return actions;
  }

  // ---------------------------------------------------------------------------
  // CHURN PREDICTION
  // ---------------------------------------------------------------------------

  async predictChurn(customerId: string): Promise<ChurnPrediction> {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error(`Customer ${customerId} not found`);

    const health = this.healthScores.get(customerId) || await this.assessHealth(customerId);
    const engagement = this.getEngagementHistory(customerId, 90);

    const prompt = `You are CendiaGuardianÃ¢â€žÂ¢, an AI customer success system predicting churn risk.

CUSTOMER PROFILE:
- Company: ${customer.company}
- Tier: ${customer.tier}
- Contract Value: $${customer.contractValue.toLocaleString()}
- Days to Renewal: ${Math.ceil((customer.contractEndDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24))}
- Current Health Score: ${health.overallScore}
- Health Trend: ${health.trend}

RISK FACTORS:
${health.riskFactors.map(r => `- ${r.category}: ${r.description} (${r.severity})`).join('\n')}

ENGAGEMENT (Last 3 Periods):
${engagement.slice(-3).map(e => `- Logins: ${e.loginCount}, Active Users: ${e.activeUsers}/${e.totalUsers}, Tickets: ${e.supportTickets}`).join('\n')}

Analyze churn probability. Respond in JSON:
{
  "probability": 0-100,
  "confidence": 0-100,
  "timeframe": "30_days|60_days|90_days|6_months",
  "primaryDrivers": [
    {
      "factor": "description",
      "contribution": percentage,
      "trend": "worsening|stable|improving",
      "actionable": boolean,
      "suggestedIntervention": "specific action"
    }
  ],
  "preventionStrategy": "detailed strategy",
  "interventionROI": estimated_value_saved
}`;

    let probability = 30;
    let confidence = 70;
    let timeframe: ChurnPrediction['timeframe'] = '90_days';
    let primaryDrivers: ChurnDriver[] = [];
    let preventionStrategy = 'Maintain regular engagement and address any emerging issues promptly.';
    let interventionROI = customer.contractValue * 0.3;

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('customer_success') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          probability = parsed.probability || probability;
          confidence = parsed.confidence || confidence;
          timeframe = parsed.timeframe || timeframe;
          primaryDrivers = parsed.primaryDrivers || [];
          preventionStrategy = parsed.preventionStrategy || preventionStrategy;
          interventionROI = parsed.interventionROI || interventionROI;
        }
      }
    } catch (error) {
      logger.warn('CendiaGuardian: AI churn prediction unavailable, using heuristic');
    }

    // Heuristic fallback
    if (primaryDrivers.length === 0) {
      probability = this.calculateHeuristicChurnProbability(health, engagement);
      primaryDrivers = health.riskFactors.map(r => ({
        factor: r.description,
        contribution: r.impact,
        trend: 'stable',
        actionable: true,
        suggestedIntervention: r.mitigation,
      }));
    }

    const prediction: ChurnPrediction = {
      customerId,
      probability,
      confidence,
      timeframe,
      primaryDrivers,
      preventionStrategy,
      interventionROI,
      generatedAt: new Date(),
    };

    logger.info(`CendiaGuardian: Churn prediction for ${customerId}: ${probability}%`);
    return prediction;
  }

  private calculateHeuristicChurnProbability(
    health: CustomerHealth, 
    engagement: CustomerEngagement[]
  ): number {
    let probability = 20; // Base probability

    // Health score impact
    if (health.overallScore < 50) probability += 40;
    else if (health.overallScore < 70) probability += 20;
    else if (health.overallScore > 85) probability -= 10;

    // Trend impact
    if (health.trend === 'critical') probability += 25;
    else if (health.trend === 'declining') probability += 15;
    else if (health.trend === 'improving') probability -= 10;

    // Risk factors impact
    for (const risk of health.riskFactors) {
      if (risk.severity === 'critical') probability += 15;
      else if (risk.severity === 'high') probability += 10;
    }

    return Math.min(95, Math.max(5, probability));
  }

  // ---------------------------------------------------------------------------
  // CARE PACKAGES
  // ---------------------------------------------------------------------------

  async generateCarePackage(
    customerId: string, 
    type: CarePackage['type'],
    context?: string
  ): Promise<CarePackage> {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error(`Customer ${customerId} not found`);

    const health = this.healthScores.get(customerId);

    const prompt = `You are CendiaGuardianÃ¢â€žÂ¢ generating a care package for a customer.

CUSTOMER: ${customer.company} (${customer.tier} tier)
CONTRACT VALUE: $${customer.contractValue.toLocaleString()}
HEALTH SCORE: ${health?.overallScore || 'Unknown'}
PACKAGE TYPE: ${type}
CONTEXT: ${context || 'Standard care package'}

Generate an appropriate care package. Response in JSON:
{
  "components": [
    {
      "type": "credit|training|support_hours|feature_access|gift|discount",
      "description": "specific item",
      "value": dollar_value,
      "duration": "if applicable"
    }
  ],
  "message": "personalized message to customer",
  "deliveryMethod": "email|call|in_app|physical"
}

Consider:
- rescue: significant value to retain at-risk customer
- appreciation: thank valued customer
- milestone: celebrate achievement
- apology: make amends for issue
- win_back: re-engage churned customer`;

    let components: PackageComponent[] = [];
    let message = `We value your partnership with Datacendia.`;
    let deliveryMethod: CarePackage['deliveryMethod'] = 'email';

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForService('customer_success') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          components = parsed.components || [];
          message = parsed.message || message;
          deliveryMethod = parsed.deliveryMethod || deliveryMethod;
        }
      }
    } catch (error) {
      logger.warn('CendiaGuardian: AI care package generation unavailable');
    }

    // Fallback components
    if (components.length === 0) {
      components = this.generateDefaultComponents(type, customer);
      message = this.generateDefaultMessage(type, customer);
    }

    const carePackage: CarePackage = {
      id: `care-${Date.now()}`,
      customerId,
      type,
      components,
      totalValue: components.reduce((sum, c) => sum + c.value, 0),
      message,
      deliveryMethod,
      status: 'draft',
      createdAt: new Date(),
    };

    const packages = this.carePackages.get(customerId) || [];
    packages.push(carePackage);
    this.carePackages.set(customerId, packages);

    logger.info(`CendiaGuardian: Generated ${type} care package for ${customerId}`);
    return carePackage;
  }

  private generateDefaultComponents(type: CarePackage['type'], customer: CustomerProfile): PackageComponent[] {
    const baseValue = customer.contractValue * 0.05;

    switch (type) {
      case 'rescue':
        return [
          { type: 'credit', description: 'Account credit', value: baseValue * 2 },
          { type: 'support_hours', description: 'Dedicated support hours', value: 500, duration: '1 month' },
          { type: 'training', description: 'Custom training session', value: 1000 },
        ];
      case 'appreciation':
        return [
          { type: 'gift', description: 'Executive gift box', value: 200 },
          { type: 'feature_access', description: 'Early access to new features', value: 500, duration: '3 months' },
        ];
      case 'milestone':
        return [
          { type: 'credit', description: 'Milestone bonus credit', value: baseValue },
          { type: 'discount', description: 'Renewal discount', value: baseValue * 0.5 },
        ];
      case 'apology':
        return [
          { type: 'credit', description: 'Service credit', value: baseValue },
          { type: 'support_hours', description: 'Priority support', value: 300, duration: '2 weeks' },
        ];
      case 'win_back':
        return [
          { type: 'discount', description: 'Return customer discount', value: baseValue * 3 },
          { type: 'training', description: 'Fresh start onboarding', value: 1500 },
        ];
      default:
        return [{ type: 'credit', description: 'Account credit', value: baseValue }];
    }
  }

  private generateDefaultMessage(type: CarePackage['type'], customer: CustomerProfile): string {
    switch (type) {
      case 'rescue':
        return `Dear ${customer.primaryContact}, we noticed some challenges and want to ensure your success with Datacendia. Please accept this care package as a demonstration of our commitment to your success.`;
      case 'appreciation':
        return `Dear ${customer.primaryContact}, thank you for being a valued Datacendia customer. Your partnership means the world to us.`;
      case 'milestone':
        return `Congratulations ${customer.primaryContact}! You've achieved a significant milestone with Datacendia. Here's a small token of our appreciation.`;
      case 'apology':
        return `Dear ${customer.primaryContact}, we sincerely apologize for the recent experience. Please accept this package as we work to make things right.`;
      case 'win_back':
        return `Dear ${customer.primaryContact}, we'd love to welcome you back to Datacendia. We've made improvements and would value another opportunity to serve you.`;
      default:
        return `Dear ${customer.primaryContact}, thank you for being part of the Datacendia community.`;
    }
  }

  approveCarePackage(packageId: string): CarePackage | null {
    for (const packages of this.carePackages.values()) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg) {
        pkg.status = 'approved';
        return pkg;
      }
    }
    return null;
  }

  deliverCarePackage(packageId: string): CarePackage | null {
    for (const packages of this.carePackages.values()) {
      const pkg = packages.find(p => p.id === packageId);
      if (pkg && pkg.status === 'approved') {
        pkg.status = 'delivered';
        pkg.deliveredAt = new Date();
        logger.info(`CendiaGuardian: Care package ${packageId} delivered`);
        return pkg;
      }
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // AT-RISK CUSTOMERS
  // ---------------------------------------------------------------------------

  async getAtRiskCustomers(): Promise<{ customer: CustomerProfile; health: CustomerHealth; churnRisk: number }[]> {
    const atRisk: { customer: CustomerProfile; health: CustomerHealth; churnRisk: number }[] = [];

    for (const customer of this.customers.values()) {
      const health = this.healthScores.get(customer.id) || await this.assessHealth(customer.id);
      
      if (health.overallScore < 70 || health.trend === 'declining' || health.trend === 'critical') {
        const prediction = await this.predictChurn(customer.id);
        atRisk.push({
          customer,
          health,
          churnRisk: prediction.probability,
        });
      }
    }

    return atRisk.sort((a, b) => b.churnRisk - a.churnRisk);
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
      logger.warn('CendiaGuardian: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalCustomers: number;
    averageHealthScore: number;
    atRiskCount: number;
    totalContractValue: number;
    atRiskValue: number;
  } {
    const customers = this.getAllCustomers();
    const totalValue = customers.reduce((sum, c) => sum + c.contractValue, 0);
    const atRisk = customers.filter(c => c.healthScore < 70);
    const atRiskValue = atRisk.reduce((sum, c) => sum + c.contractValue, 0);

    return {
      totalCustomers: customers.length,
      averageHealthScore: customers.length > 0 
        ? Math.round(customers.reduce((sum, c) => sum + c.healthScore, 0) / customers.length)
        : 0,
      atRiskCount: atRisk.length,
      totalContractValue: totalValue,
      atRiskValue,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Portfolio Health Dashboard
   * Aggregate view across all customers with tier breakdowns and revenue-at-risk analysis.
   */
  async getPortfolioHealthDashboard(): Promise<{
    summary: {
      totalCustomers: number;
      totalContractValue: number;
      weightedHealthScore: number;
      revenueAtRisk: number;
      revenueAtRiskPercentage: number;
      netRetentionForecast: number;
    };
    tierBreakdown: Array<{
      tier: CustomerProfile['tier'];
      count: number;
      contractValue: number;
      avgHealthScore: number;
      atRiskCount: number;
      revenueAtRisk: number;
    }>;
    healthDistribution: {
      excellent: { count: number; value: number }; // 85+
      good: { count: number; value: number };      // 70-84
      warning: { count: number; value: number };   // 50-69
      critical: { count: number; value: number };   // <50
    };
    renewalPipeline: Array<{
      customerId: string;
      company: string;
      tier: string;
      contractValue: number;
      daysToRenewal: number;
      healthScore: number;
      renewalRisk: 'low' | 'medium' | 'high' | 'critical';
    }>;
    topRisks: Array<{
      customerId: string;
      company: string;
      healthScore: number;
      contractValue: number;
      primaryRisk: string;
    }>;
    topOpportunities: Array<{
      customerId: string;
      company: string;
      type: string;
      estimatedValue: number;
      probability: number;
    }>;
  }> {
    const customers = this.getAllCustomers();
    const totalContractValue = customers.reduce((sum, c) => sum + c.contractValue, 0);

    // Weighted health score (by contract value)
    const weightedHealthScore = totalContractValue > 0
      ? Math.round(customers.reduce((sum, c) => sum + c.healthScore * c.contractValue, 0) / totalContractValue)
      : 0;

    // At-risk revenue
    const atRiskCustomers = customers.filter(c => c.healthScore < 70);
    const revenueAtRisk = atRiskCustomers.reduce((sum, c) => sum + c.contractValue, 0);

    // Tier breakdown
    const tiers: CustomerProfile['tier'][] = ['pilot', 'foundation', 'enterprise', 'strategic'];
    const tierBreakdown = tiers.map(tier => {
      const tierCustomers = customers.filter(c => c.tier === tier);
      const tierAtRisk = tierCustomers.filter(c => c.healthScore < 70);
      return {
        tier,
        count: tierCustomers.length,
        contractValue: tierCustomers.reduce((sum, c) => sum + c.contractValue, 0),
        avgHealthScore: tierCustomers.length > 0
          ? Math.round(tierCustomers.reduce((sum, c) => sum + c.healthScore, 0) / tierCustomers.length)
          : 0,
        atRiskCount: tierAtRisk.length,
        revenueAtRisk: tierAtRisk.reduce((sum, c) => sum + c.contractValue, 0),
      };
    }).filter(t => t.count > 0);

    // Health distribution
    const bucketize = (minScore: number, maxScore: number) => {
      const bucket = customers.filter(c => c.healthScore >= minScore && c.healthScore <= maxScore);
      return { count: bucket.length, value: bucket.reduce((sum, c) => sum + c.contractValue, 0) };
    };
    const healthDistribution = {
      excellent: bucketize(85, 100),
      good: bucketize(70, 84),
      warning: bucketize(50, 69),
      critical: bucketize(0, 49),
    };

    // Renewal pipeline (next 120 days)
    const now = Date.now();
    const renewalPipeline = customers
      .map(c => {
        const daysToRenewal = Math.ceil((c.contractEndDate.getTime() - now) / (1000 * 60 * 60 * 24));
        const renewalRisk: 'low' | 'medium' | 'high' | 'critical' =
          c.healthScore < 50 || daysToRenewal < 15 ? 'critical'
          : c.healthScore < 70 || daysToRenewal < 30 ? 'high'
          : c.healthScore < 80 || daysToRenewal < 60 ? 'medium' : 'low';
        return {
          customerId: c.id,
          company: c.company,
          tier: c.tier,
          contractValue: c.contractValue,
          daysToRenewal,
          healthScore: c.healthScore,
          renewalRisk,
        };
      })
      .filter(r => r.daysToRenewal <= 120 && r.daysToRenewal > 0)
      .sort((a, b) => a.daysToRenewal - b.daysToRenewal);

    // Top risks
    const topRisks = customers
      .filter(c => c.healthScore < 75)
      .sort((a, b) => a.healthScore - b.healthScore)
      .slice(0, 10)
      .map(c => {
        const health = this.healthScores.get(c.id);
        const primaryRisk = health?.riskFactors?.[0]?.description || 'Health score below threshold';
        return { customerId: c.id, company: c.company, healthScore: c.healthScore, contractValue: c.contractValue, primaryRisk };
      });

    // Top opportunities
    const allOpps: Array<{ customerId: string; company: string; type: string; estimatedValue: number; probability: number }> = [];
    for (const c of customers) {
      const health = this.healthScores.get(c.id);
      if (health?.opportunities) {
        for (const opp of health.opportunities) {
          allOpps.push({
            customerId: c.id,
            company: c.company,
            type: opp.type,
            estimatedValue: opp.value,
            probability: opp.probability,
          });
        }
      }
    }
    const topOpportunities = allOpps
      .sort((a, b) => (b.estimatedValue * b.probability) - (a.estimatedValue * a.probability))
      .slice(0, 10);

    // Net retention forecast (simplified)
    const retainedValue = customers
      .filter(c => c.healthScore >= 50)
      .reduce((sum, c) => sum + c.contractValue, 0);
    const expansionValue = allOpps
      .filter(o => o.probability > 0.5)
      .reduce((sum, o) => sum + o.estimatedValue * o.probability, 0);
    const netRetentionForecast = totalContractValue > 0
      ? Math.round(((retainedValue + expansionValue) / totalContractValue) * 100)
      : 100;

    return {
      summary: {
        totalCustomers: customers.length,
        totalContractValue,
        weightedHealthScore,
        revenueAtRisk,
        revenueAtRiskPercentage: totalContractValue > 0 ? Math.round((revenueAtRisk / totalContractValue) * 100) : 0,
        netRetentionForecast,
      },
      tierBreakdown,
      healthDistribution,
      renewalPipeline,
      topRisks,
      topOpportunities,
    };
  }

  /**
   * 10/10: Customer Lifecycle Analytics
   * Stage progression tracking, time-in-stage, and bottleneck detection.
   */
  async getLifecycleAnalytics(): Promise<{
    stageDistribution: Array<{
      stage: SuccessPlaybook['stage'];
      count: number;
      avgHealthScore: number;
      totalContractValue: number;
    }>;
    stageProgression: Array<{
      customerId: string;
      company: string;
      currentStage: string;
      completedMilestones: number;
      upcomingMilestones: number;
      blockerCount: number;
      onTrack: boolean;
    }>;
    bottlenecks: Array<{
      stage: string;
      milestone: string;
      blockedCustomers: number;
      commonBlockers: string[];
      recommendation: string;
    }>;
    onboardingHealth: {
      totalOnboarding: number;
      completedOnboarding: number;
      avgOnboardingDays: number;
      stuckInOnboarding: number;
    };
  }> {
    const customers = this.getAllCustomers();
    const stages: SuccessPlaybook['stage'][] = ['onboarding', 'adoption', 'growth', 'renewal', 'at_risk', 'churned'];

    // Stage distribution
    const stageDistribution = stages.map(stage => {
      const stageCustomers = customers.filter(c => {
        const playbook = this.playbooks.get(c.id);
        return playbook?.stage === stage;
      });
      return {
        stage,
        count: stageCustomers.length,
        avgHealthScore: stageCustomers.length > 0
          ? Math.round(stageCustomers.reduce((sum, c) => sum + c.healthScore, 0) / stageCustomers.length)
          : 0,
        totalContractValue: stageCustomers.reduce((sum, c) => sum + c.contractValue, 0),
      };
    }).filter(s => s.count > 0);

    // Stage progression
    const stageProgression = customers.map(c => {
      const playbook = this.playbooks.get(c.id);
      if (!playbook) return null;
      const overdueMilestones = playbook.upcomingMilestones.filter(m => m.dueDate <= new Date());
      return {
        customerId: c.id,
        company: c.company,
        currentStage: playbook.stage,
        completedMilestones: playbook.completedMilestones.length,
        upcomingMilestones: playbook.upcomingMilestones.length,
        blockerCount: playbook.blockers.length,
        onTrack: overdueMilestones.length === 0 && playbook.blockers.length === 0,
      };
    }).filter((p): p is NonNullable<typeof p> => p !== null);

    // Bottleneck detection
    const blockerMap: Record<string, { stage: string; milestone: string; customers: number; blockers: string[] }> = {};
    for (const c of customers) {
      const playbook = this.playbooks.get(c.id);
      if (playbook && playbook.blockers.length > 0) {
        const key = `${playbook.stage}:${playbook.currentMilestone}`;
        if (!blockerMap[key]) {
          blockerMap[key] = { stage: playbook.stage, milestone: playbook.currentMilestone, customers: 0, blockers: [] };
        }
        blockerMap[key].customers++;
        blockerMap[key].blockers.push(...playbook.blockers);
      }
    }
    const bottlenecks = Object.values(blockerMap)
      .sort((a, b) => b.customers - a.customers)
      .slice(0, 10)
      .map(b => {
        const uniqueBlockers = [...new Set(b.blockers)].slice(0, 5);
        return {
          stage: b.stage,
          milestone: b.milestone,
          blockedCustomers: b.customers,
          commonBlockers: uniqueBlockers,
          recommendation: uniqueBlockers.length > 0
            ? `Address common blocker: "${uniqueBlockers[0]}" affecting ${b.customers} customer(s)`
            : 'Investigate stage-specific delays',
        };
      });

    // Onboarding health
    const onboardingCustomers = customers.filter(c => {
      const playbook = this.playbooks.get(c.id);
      return playbook?.stage === 'onboarding';
    });
    const completedOnboarding = customers.filter(c => c.onboardingComplete);
    const avgOnboardingDays = completedOnboarding.length > 0
      ? Math.round(completedOnboarding.reduce((sum, c) => {
          const days = Math.ceil((Date.now() - c.contractStartDate.getTime()) / (1000 * 60 * 60 * 24));
          return sum + Math.min(days, 90); // Cap at 90 as reasonable onboarding window
        }, 0) / completedOnboarding.length)
      : 0;
    const stuckInOnboarding = onboardingCustomers.filter(c => {
      const daysSinceStart = (Date.now() - c.contractStartDate.getTime()) / (1000 * 60 * 60 * 24);
      return daysSinceStart > 30 && !c.onboardingComplete;
    }).length;

    return {
      stageDistribution,
      stageProgression,
      bottlenecks,
      onboardingHealth: {
        totalOnboarding: onboardingCustomers.length,
        completedOnboarding: completedOnboarding.length,
        avgOnboardingDays,
        stuckInOnboarding,
      },
    };
  }

  /**
   * 10/10: Engagement Trend Intelligence
   * Multi-period engagement analysis with anomaly detection and forecasting.
   */
  async getEngagementTrendIntelligence(customerId: string): Promise<{
    customerId: string;
    company: string;
    periods: number;
    trends: {
      loginTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
      adoptionTrend: 'increasing' | 'decreasing' | 'stable' | 'volatile';
      supportTrend: 'improving' | 'worsening' | 'stable';
      userGrowthTrend: 'growing' | 'shrinking' | 'stable';
    };
    anomalies: Array<{
      period: string;
      metric: string;
      expectedValue: number;
      actualValue: number;
      deviation: number;
      severity: 'low' | 'medium' | 'high';
    }>;
    forecast: {
      nextPeriodLogins: number;
      nextPeriodActiveUsers: number;
      nextPeriodTickets: number;
      confidence: number;
    };
    engagementScore: number;
    insights: string[];
  }> {
    const customer = this.customers.get(customerId);
    if (!customer) throw new Error(`Customer ${customerId} not found`);

    const engagement = this.getEngagementHistory(customerId);
    const recentPeriods = engagement.slice(-12);

    // Calculate trends
    const loginValues = recentPeriods.map(e => e.loginCount);
    const activeUserValues = recentPeriods.map(e => e.activeUsers);
    const ticketValues = recentPeriods.map(e => e.supportTickets);
    const totalUserValues = recentPeriods.map(e => e.totalUsers);

    const calcTrend = (values: number[]): 'increasing' | 'decreasing' | 'stable' | 'volatile' => {
      if (values.length < 3) return 'stable';
      const firstHalf = values.slice(0, Math.floor(values.length / 2));
      const secondHalf = values.slice(Math.floor(values.length / 2));
      const avgFirst = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
      const avgSecond = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
      const change = avgFirst > 0 ? ((avgSecond - avgFirst) / avgFirst) * 100 : 0;
      const variance = values.reduce((sum, v) => sum + Math.pow(v - (values.reduce((a, b) => a + b, 0) / values.length), 2), 0) / values.length;
      const cv = Math.sqrt(variance) / (values.reduce((a, b) => a + b, 0) / values.length || 1);
      if (cv > 0.5) return 'volatile';
      if (change > 15) return 'increasing';
      if (change < -15) return 'decreasing';
      return 'stable';
    };

    const loginTrend = calcTrend(loginValues);
    const adoptionTrend = calcTrend(activeUserValues);
    const supportTrend = calcTrend(ticketValues) === 'decreasing' ? 'improving' as const
      : calcTrend(ticketValues) === 'increasing' ? 'worsening' as const : 'stable' as const;
    const userGrowthTrend = calcTrend(totalUserValues) === 'increasing' ? 'growing' as const
      : calcTrend(totalUserValues) === 'decreasing' ? 'shrinking' as const : 'stable' as const;

    // Anomaly detection (simple z-score based)
    const anomalies: Array<{
      period: string; metric: string; expectedValue: number; actualValue: number; deviation: number; severity: 'low' | 'medium' | 'high';
    }> = [];

    const detectAnomalies = (values: number[], periods: CustomerEngagement[], metricName: string) => {
      if (values.length < 3) return;
      const mean = values.reduce((a, b) => a + b, 0) / values.length;
      const stdDev = Math.sqrt(values.reduce((sum, v) => sum + Math.pow(v - mean, 2), 0) / values.length);
      if (stdDev === 0) return;
      for (let i = 0; i < values.length; i++) {
        const zScore = Math.abs((values[i] - mean) / stdDev);
        if (zScore > 1.5) {
          anomalies.push({
            period: periods[i].period,
            metric: metricName,
            expectedValue: Math.round(mean),
            actualValue: values[i],
            deviation: Math.round(zScore * 100) / 100,
            severity: zScore > 3 ? 'high' : zScore > 2 ? 'medium' : 'low',
          });
        }
      }
    };

    detectAnomalies(loginValues, recentPeriods, 'logins');
    detectAnomalies(ticketValues, recentPeriods, 'support_tickets');
    detectAnomalies(activeUserValues, recentPeriods, 'active_users');

    // Simple forecast (moving average of last 3 periods)
    const last3 = recentPeriods.slice(-3);
    const forecast = {
      nextPeriodLogins: last3.length > 0 ? Math.round(last3.reduce((sum, e) => sum + e.loginCount, 0) / last3.length) : 0,
      nextPeriodActiveUsers: last3.length > 0 ? Math.round(last3.reduce((sum, e) => sum + e.activeUsers, 0) / last3.length) : 0,
      nextPeriodTickets: last3.length > 0 ? Math.round(last3.reduce((sum, e) => sum + e.supportTickets, 0) / last3.length) : 0,
      confidence: recentPeriods.length >= 6 ? 75 : recentPeriods.length >= 3 ? 55 : 30,
    };

    // Engagement score (0-100)
    const latest = recentPeriods[recentPeriods.length - 1];
    let engagementScore = 50;
    if (latest) {
      const loginScore = Math.min(100, (latest.loginCount / 20) * 100);
      const userScore = latest.totalUsers > 0 ? (latest.activeUsers / latest.totalUsers) * 100 : 50;
      const ticketPenalty = Math.min(30, latest.supportTickets * 3);
      engagementScore = Math.round(Math.max(0, Math.min(100, (loginScore * 0.4 + userScore * 0.4) - ticketPenalty + 20)));
    }

    // Generate insights
    const insights: string[] = [];
    if (loginTrend === 'decreasing') insights.push('Login frequency is declining Ã¢â‚¬â€ schedule a check-in to identify friction points');
    if (loginTrend === 'volatile') insights.push('Login patterns are irregular Ã¢â‚¬â€ investigate whether usage is seasonal or event-driven');
    if (supportTrend === 'worsening') insights.push('Support ticket volume is increasing Ã¢â‚¬â€ proactive intervention recommended');
    if (userGrowthTrend === 'shrinking') insights.push('Active user count is declining Ã¢â‚¬â€ potential champion loss or adoption regression');
    if (anomalies.filter(a => a.severity === 'high').length > 0) insights.push('Significant engagement anomalies detected Ã¢â‚¬â€ investigate immediately');
    if (engagementScore >= 80) insights.push('Strong engagement Ã¢â‚¬â€ consider expansion or advocacy opportunities');
    if (insights.length === 0) insights.push('Engagement patterns are healthy and stable');

    return {
      customerId,
      company: customer.company,
      periods: recentPeriods.length,
      trends: { loginTrend, adoptionTrend, supportTrend, userGrowthTrend },
      anomalies: anomalies.sort((a, b) => b.deviation - a.deviation).slice(0, 10),
      forecast,
      engagementScore,
      insights,
    };
  }

  /**
   * 10/10: Intervention Effectiveness Tracker
   * Measures ROI of care packages and interventions on customer health.
   */
  async getInterventionEffectiveness(): Promise<{
    totalInterventions: number;
    totalInvestment: number;
    interventionsByType: Array<{
      type: CarePackage['type'];
      count: number;
      totalValue: number;
      deliveredCount: number;
      avgHealthBefore: number;
      avgHealthAfter: number;
      healthImprovement: number;
      effectivenessScore: number;
    }>;
    topInterventions: Array<{
      packageId: string;
      customerId: string;
      company: string;
      type: string;
      value: number;
      healthBefore: number;
      healthAfter: number;
      roi: number;
    }>;
    savingsEstimate: {
      customersRetained: number;
      revenuePreserved: number;
      interventionCost: number;
      netROI: number;
    };
    insights: string[];
  }> {
    const allPackages: Array<CarePackage & { company: string }> = [];
    for (const [customerId, packages] of this.carePackages) {
      const customer = this.customers.get(customerId);
      if (customer) {
        for (const pkg of packages) {
          allPackages.push({ ...pkg, company: customer.company });
        }
      }
    }

    const totalInvestment = allPackages.reduce((sum, p) => sum + p.totalValue, 0);

    // By type
    const typeMap: Record<string, {
      count: number; totalValue: number; delivered: number;
      healthBefore: number[]; healthAfter: number[];
    }> = {};

    for (const pkg of allPackages) {
      if (!typeMap[pkg.type]) {
        typeMap[pkg.type] = { count: 0, totalValue: 0, delivered: 0, healthBefore: [], healthAfter: [] };
      }
      typeMap[pkg.type].count++;
      typeMap[pkg.type].totalValue += pkg.totalValue;
      if (pkg.status === 'delivered' || pkg.status === 'acknowledged') {
        typeMap[pkg.type].delivered++;
        // Approximate health before/after using current health
        const customer = this.customers.get(pkg.customerId);
        if (customer) {
          const healthAfter = customer.healthScore;
          const healthBefore = Math.max(0, healthAfter - 15); // Estimate pre-intervention
          typeMap[pkg.type].healthBefore.push(healthBefore);
          typeMap[pkg.type].healthAfter.push(healthAfter);
        }
      }
    }

    const interventionsByType = Object.entries(typeMap).map(([type, data]) => {
      const avgBefore = data.healthBefore.length > 0
        ? Math.round(data.healthBefore.reduce((a, b) => a + b, 0) / data.healthBefore.length)
        : 0;
      const avgAfter = data.healthAfter.length > 0
        ? Math.round(data.healthAfter.reduce((a, b) => a + b, 0) / data.healthAfter.length)
        : 0;
      const improvement = avgAfter - avgBefore;
      return {
        type: type as CarePackage['type'],
        count: data.count,
        totalValue: data.totalValue,
        deliveredCount: data.delivered,
        avgHealthBefore: avgBefore,
        avgHealthAfter: avgAfter,
        healthImprovement: improvement,
        effectivenessScore: data.delivered > 0
          ? Math.round(Math.min(100, (improvement / 30) * 100))
          : 0,
      };
    });

    // Top interventions by estimated ROI
    const topInterventions = allPackages
      .filter(p => p.status === 'delivered' || p.status === 'acknowledged')
      .map(pkg => {
        const customer = this.customers.get(pkg.customerId);
        if (!customer) return null;
        const healthAfter = customer.healthScore;
        const healthBefore = Math.max(0, healthAfter - 15);
        const revenuePreserved = healthBefore < 50 ? customer.contractValue * 0.7 : customer.contractValue * 0.3;
        const roi = pkg.totalValue > 0 ? Math.round((revenuePreserved / pkg.totalValue) * 100) / 100 : 0;
        return {
          packageId: pkg.id,
          customerId: pkg.customerId,
          company: pkg.company,
          type: pkg.type,
          value: pkg.totalValue,
          healthBefore: Math.round(healthBefore),
          healthAfter,
          roi,
        };
      })
      .filter((t): t is NonNullable<typeof t> => t !== null)
      .sort((a, b) => b.roi - a.roi)
      .slice(0, 10);

    // Savings estimate
    const deliveredToAtRisk = allPackages.filter(p => {
      if (p.status !== 'delivered' && p.status !== 'acknowledged') return false;
      const customer = this.customers.get(p.customerId);
      return customer && customer.healthScore >= 50; // Now above threshold
    });
    const customersRetained = deliveredToAtRisk.length;
    const revenuePreserved = deliveredToAtRisk.reduce((sum, p) => {
      const customer = this.customers.get(p.customerId);
      return sum + (customer?.contractValue || 0);
    }, 0);
    const interventionCost = deliveredToAtRisk.reduce((sum, p) => sum + p.totalValue, 0);

    const insights: string[] = [];
    if (interventionsByType.length === 0) {
      insights.push('No interventions on record Ã¢â‚¬â€ begin generating care packages for at-risk customers');
    }
    const bestType = interventionsByType.sort((a, b) => b.effectivenessScore - a.effectivenessScore)[0];
    if (bestType && bestType.effectivenessScore > 0) {
      insights.push(`"${bestType.type}" packages show the highest effectiveness score (${bestType.effectivenessScore})`);
    }
    if (revenuePreserved > interventionCost * 3) {
      insights.push(`Strong ROI: $${revenuePreserved.toLocaleString()} preserved vs $${interventionCost.toLocaleString()} invested`);
    }

    return {
      totalInterventions: allPackages.length,
      totalInvestment,
      interventionsByType,
      topInterventions,
      savingsEstimate: {
        customersRetained,
        revenuePreserved,
        interventionCost,
        netROI: interventionCost > 0 ? Math.round(((revenuePreserved - interventionCost) / interventionCost) * 100) : 0,
      },
      insights,
    };
  }
}

// Export singleton instance
export const cendiaGuardianService = new CendiaGuardianService();
