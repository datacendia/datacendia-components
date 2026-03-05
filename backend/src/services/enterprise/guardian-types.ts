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

