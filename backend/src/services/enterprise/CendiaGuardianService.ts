// =============================================================================
// CENDIAGUARDIAN™ - CUSTOMER SUCCESS & RETENTION INTELLIGENCE
// "The Churn Shield" - Proactive customer health monitoring
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

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
    logger.info('CendiaGuardian™ initialized - The Churn Shield is active');
  }

  // ---------------------------------------------------------------------------
  // CUSTOMER MANAGEMENT
  // ---------------------------------------------------------------------------

  addCustomer(customer: Omit<CustomerProfile, 'id' | 'healthScore'>): CustomerProfile {
    const newCustomer: CustomerProfile = {
      ...customer,
      id: `cust-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      healthScore: 80, // Initial health score
    };
    this.customers.set(newCustomer.id, newCustomer);
    this.engagementData.set(newCustomer.id, []);
    this.carePackages.set(newCustomer.id, []);
    
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

    const prompt = `You are CendiaGuardian™, an AI customer success system predicting churn risk.

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

    const prompt = `You are CendiaGuardian™ generating a care package for a customer.

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
}

// Export singleton instance
export const cendiaGuardianService = new CendiaGuardianService();
