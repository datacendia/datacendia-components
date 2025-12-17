// @ts-nocheck
// =============================================================================
// CENDIAREVENUE™ - THE TREASURER
// Financial Operations for the Solo Founder
// Runway calculation, pricing optimization, payment sync
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface RevenueMetrics {
  mrr: number;           // Monthly Recurring Revenue
  arr: number;           // Annual Recurring Revenue
  mrrGrowth: number;     // MoM growth %
  customers: number;
  churnRate: number;     // Monthly churn %
  ltv: number;           // Lifetime Value
  cac: number;           // Customer Acquisition Cost
  ltvCacRatio: number;
  netRevenue: number;    // After refunds
  grossMargin: number;   // %
}

export interface Subscription {
  id: string;
  customerId: string;
  customerEmail: string;
  plan: 'standard' | 'professional' | 'enterprise';
  status: 'active' | 'past_due' | 'canceled' | 'trialing';
  amount: number;
  currency: string;
  interval: 'month' | 'year';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  createdAt: Date;
}

export interface RunwayCalculation {
  currentCash: number;
  monthlyBurn: number;
  monthlyRevenue: number;
  netBurn: number;
  runwayMonths: number;
  runwayDate: Date;
  scenarios: {
    pessimistic: { months: number; assumptions: string };
    realistic: { months: number; assumptions: string };
    optimistic: { months: number; assumptions: string };
  };
  recommendations: string[];
}

export interface PricingRecommendation {
  currentTier: string;
  currentPrice: number;
  recommendedPrice: number;
  changePercent: number;
  reasoning: string[];
  projectedImpact: {
    revenueChange: number;
    churnRisk: 'low' | 'medium' | 'high';
  };
  competitorPricing: { competitor: string; price: number }[];
}

export interface PaymentAlert {
  id: string;
  type: 'failed_payment' | 'churn_risk' | 'upgrade_opportunity' | 'pricing_anomaly';
  severity: 'low' | 'medium' | 'high';
  customerId: string;
  message: string;
  suggestedAction: string;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface FinancialForecast {
  period: Date;
  projectedMrr: number;
  projectedCustomers: number;
  projectedChurn: number;
  confidence: number;
}

// =============================================================================
// CENDIAREVENUE SERVICE
// =============================================================================

class CendiaRevenueService {
  private subscriptions: Map<string, Subscription> = new Map();
  private alerts: PaymentAlert[] = [];
  private expenses: { category: string; amount: number; recurring: boolean }[] = [];
  private currentCash: number = 0;

  // ---------------------------------------------------------------------------
  // METRICS CALCULATION
  // ---------------------------------------------------------------------------

  calculateMetrics(): RevenueMetrics {
    const activeSubscriptions = Array.from(this.subscriptions.values())
      .filter(s => s.status === 'active');

    const mrr = activeSubscriptions.reduce((sum, s) => {
      const monthly = s.interval === 'year' ? s.amount / 12 : s.amount;
      return sum + monthly;
    }, 0);

    const canceledLastMonth = Array.from(this.subscriptions.values())
      .filter(s => s.status === 'canceled' && 
        s.currentPeriodEnd > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000));
    
    const churnRate = activeSubscriptions.length > 0 
      ? (canceledLastMonth.length / activeSubscriptions.length) * 100 
      : 0;

    const avgSubscriptionMonths = 12; // Simplified; would calculate from actual data
    const ltv = mrr * avgSubscriptionMonths;
    const cac = 500; // Placeholder; would integrate with ad spend

    return {
      mrr,
      arr: mrr * 12,
      mrrGrowth: 15, // Would calculate from historical data
      customers: activeSubscriptions.length,
      churnRate,
      ltv,
      cac,
      ltvCacRatio: cac > 0 ? ltv / cac : 0,
      netRevenue: mrr * 0.97, // After payment processor fees
      grossMargin: 85, // SaaS typical
    };
  }

  // ---------------------------------------------------------------------------
  // RUNWAY CALCULATOR
  // ---------------------------------------------------------------------------

  calculateRunway(cash: number, monthlyExpenses: number): RunwayCalculation {
    this.currentCash = cash;
    const metrics = this.calculateMetrics();
    const netBurn = monthlyExpenses - metrics.netRevenue;

    // Calculate runway
    const runwayMonths = netBurn > 0 
      ? Math.floor(cash / netBurn)
      : Infinity; // Profitable!

    const runwayDate = new Date();
    if (runwayMonths !== Infinity) {
      runwayDate.setMonth(runwayDate.getMonth() + runwayMonths);
    }

    // Scenarios
    const scenarios = {
      pessimistic: {
        months: Math.floor(cash / (netBurn * 1.3)),
        assumptions: '30% higher expenses, 10% churn spike',
      },
      realistic: {
        months: runwayMonths,
        assumptions: 'Current burn rate continues',
      },
      optimistic: {
        months: netBurn > 0 ? Math.floor(cash / (netBurn * 0.7)) : Infinity,
        assumptions: '30% expense reduction, 20% revenue growth',
      },
    };

    // Recommendations
    const recommendations: string[] = [];
    if (runwayMonths < 6) {
      recommendations.push('🚨 CRITICAL: Less than 6 months runway. Immediate action required.');
      recommendations.push('Consider raising bridge financing or cutting non-essential expenses.');
    } else if (runwayMonths < 12) {
      recommendations.push('⚠️ WARNING: Less than 12 months runway. Start planning next raise.');
    }
    if (metrics.churnRate > 5) {
      recommendations.push('Churn is high. Focus on retention before growth.');
    }
    if (metrics.ltvCacRatio < 3) {
      recommendations.push('LTV:CAC ratio below 3. Optimize acquisition channels or raise prices.');
    }

    return {
      currentCash: cash,
      monthlyBurn: monthlyExpenses,
      monthlyRevenue: metrics.netRevenue,
      netBurn,
      runwayMonths,
      runwayDate,
      scenarios,
      recommendations,
    };
  }

  getRunwayAlert(): string | null {
    const runway = this.calculateRunway(this.currentCash, this.getMonthlyExpenses());
    
    if (runway.runwayMonths < 6) {
      return `🚨 CRITICAL: ${runway.runwayMonths} months of runway remaining (${runway.runwayDate.toLocaleDateString()}). Take action now.`;
    }
    if (runway.runwayMonths < 12) {
      return `⚠️ ${runway.runwayMonths} months of runway. Start planning next funding round.`;
    }
    return null;
  }

  private getMonthlyExpenses(): number {
    return this.expenses
      .filter(e => e.recurring)
      .reduce((sum, e) => sum + e.amount, 0);
  }

  // ---------------------------------------------------------------------------
  // PRICING OPTIMIZER
  // ---------------------------------------------------------------------------

  async analyzePricing(tier: string, currentPrice: number): Promise<PricingRecommendation> {
    const metrics = this.calculateMetrics();
    
    // Competitor pricing (would integrate with CendiaWatch)
    const competitorPricing = [
      { competitor: 'Palantir Foundry', price: 500000 },
      { competitor: 'Salesforce Einstein', price: 150000 },
      { competitor: 'Microsoft Copilot', price: 30000 },
    ];

    const prompt = `As a SaaS pricing expert, analyze this pricing scenario:

Product: Datacendia (AI Executive Council)
Tier: ${tier}
Current Price: $${currentPrice}/year
MRR: $${metrics.mrr}
Customers: ${metrics.customers}
Churn: ${metrics.churnRate}%
LTV:CAC: ${metrics.ltvCacRatio}

Competitors: ${competitorPricing.map(c => `${c.competitor}: $${c.price}`).join(', ')}

Should we raise prices? By how much? Output JSON:
{
  "recommendedPrice": number,
  "reasoning": ["..."],
  "churnRisk": "low|medium|high"
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwen2.5:7b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const recommendedPrice = analysis.recommendedPrice || currentPrice;
      const changePercent = ((recommendedPrice - currentPrice) / currentPrice) * 100;

      return {
        currentTier: tier,
        currentPrice,
        recommendedPrice,
        changePercent,
        reasoning: analysis.reasoning || ['Analysis pending'],
        projectedImpact: {
          revenueChange: changePercent * metrics.mrr / 100,
          churnRisk: analysis.churnRisk || 'medium',
        },
        competitorPricing,
      };
    } catch (error) {
      logger.error('Pricing analysis failed:', error);
      return {
        currentTier: tier,
        currentPrice,
        recommendedPrice: currentPrice,
        changePercent: 0,
        reasoning: ['AI analysis unavailable'],
        projectedImpact: { revenueChange: 0, churnRisk: 'medium' },
        competitorPricing,
      };
    }
  }

  async getQuickPricingAdvice(): Promise<string> {
    const metrics = this.calculateMetrics();
    
    if (metrics.ltvCacRatio > 5) {
      return '💰 REVENUE: You are closing deals too fast (LTV:CAC > 5). Raise prices 20-30%.';
    }
    if (metrics.churnRate < 2 && metrics.customers > 10) {
      return '💰 REVENUE: Low churn with decent volume. Test a 15% price increase on new customers.';
    }
    return '💰 REVENUE: Current pricing appears optimal. Focus on volume.';
  }

  // ---------------------------------------------------------------------------
  // PAYMENT SYNC (Stripe/Lemon Squeezy)
  // ---------------------------------------------------------------------------

  async syncFromStripe(stripeData: any[]): Promise<void> {
    for (const sub of stripeData) {
      const subscription: Subscription = {
        id: sub.id,
        customerId: sub.customer,
        customerEmail: sub.customer_email || '',
        plan: this.mapStripePlan(sub.plan?.id),
        status: sub.status as Subscription['status'],
        amount: sub.plan?.amount / 100 || 0,
        currency: sub.currency,
        interval: sub.plan?.interval || 'month',
        currentPeriodStart: new Date(sub.current_period_start * 1000),
        currentPeriodEnd: new Date(sub.current_period_end * 1000),
        cancelAtPeriodEnd: sub.cancel_at_period_end,
        createdAt: new Date(sub.created * 1000),
      };

      this.subscriptions.set(subscription.id, subscription);
    }

    logger.info(`CendiaRevenue: Synced ${stripeData.length} subscriptions`);

    // Check for alerts after sync
    await this.generateAlerts();
  }

  private mapStripePlan(planId: string): Subscription['plan'] {
    if (planId?.includes('enterprise')) return 'enterprise';
    if (planId?.includes('professional')) return 'professional';
    return 'standard';
  }

  private async generateAlerts(): Promise<void> {
    const now = new Date();
    
    for (const sub of this.subscriptions.values()) {
      // Past due alert
      if (sub.status === 'past_due') {
        this.alerts.push({
          id: `alert-${Date.now()}`,
          type: 'failed_payment',
          severity: 'high',
          customerId: sub.customerId,
          message: `Payment failed for ${sub.customerEmail}`,
          suggestedAction: 'Send payment reminder email, update card on file',
          createdAt: now,
        });
      }

      // Churn risk (canceling at period end)
      if (sub.cancelAtPeriodEnd && sub.status === 'active') {
        this.alerts.push({
          id: `alert-${Date.now()}`,
          type: 'churn_risk',
          severity: 'medium',
          customerId: sub.customerId,
          message: `${sub.customerEmail} scheduled to cancel`,
          suggestedAction: 'Reach out with retention offer',
          createdAt: now,
        });
      }
    }
  }

  getAlerts(): PaymentAlert[] {
    return this.alerts.filter(a => !a.resolvedAt);
  }

  // ---------------------------------------------------------------------------
  // FORECASTING
  // ---------------------------------------------------------------------------

  generateForecast(months: number): FinancialForecast[] {
    const metrics = this.calculateMetrics();
    const forecasts: FinancialForecast[] = [];

    let projectedMrr = metrics.mrr;
    let projectedCustomers = metrics.customers;

    for (let i = 1; i <= months; i++) {
      const growthRate = 0.10; // 10% MoM growth assumption
      const churnLoss = projectedCustomers * (metrics.churnRate / 100);
      const newCustomers = projectedCustomers * growthRate;

      projectedCustomers = Math.round(projectedCustomers - churnLoss + newCustomers);
      projectedMrr = projectedMrr * (1 + growthRate - metrics.churnRate / 100);

      const period = new Date();
      period.setMonth(period.getMonth() + i);

      forecasts.push({
        period,
        projectedMrr: Math.round(projectedMrr),
        projectedCustomers,
        projectedChurn: Math.round(churnLoss),
        confidence: Math.max(50, 95 - i * 5), // Confidence decreases over time
      });
    }

    return forecasts;
  }

  // ---------------------------------------------------------------------------
  // EXPENSE TRACKING
  // ---------------------------------------------------------------------------

  addExpense(category: string, amount: number, recurring: boolean): void {
    this.expenses.push({ category, amount, recurring });
    logger.info(`CendiaRevenue: Added expense ${category} $${amount}`);
  }

  getExpenseBreakdown(): { category: string; amount: number; percent: number }[] {
    const total = this.expenses.reduce((sum, e) => sum + e.amount, 0);
    
    const byCategory = this.expenses.reduce((acc, e) => {
      acc[e.category] = (acc[e.category] || 0) + e.amount;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(byCategory)
      .map(([category, amount]) => ({
        category,
        amount,
        percent: total > 0 ? (amount / total) * 100 : 0,
      }))
      .sort((a, b) => b.amount - a.amount);
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    mrr: number;
    arr: number;
    customers: number;
    runwayMonths: number;
    churnRate: number;
  } {
    const metrics = this.calculateMetrics();
    const runway = this.calculateRunway(
      this.expenses.reduce((sum, e) => sum + e.amount, 0) * 12,
      this.expenses.reduce((sum, e) => sum + e.amount, 0)
    );

    return {
      mrr: metrics.mrr,
      arr: metrics.arr,
      customers: metrics.customers,
      runwayMonths: runway.runwayMonths,
      churnRate: metrics.churnRate,
    };
  }
}

export const cendiaRevenueService = new CendiaRevenueService();
export default cendiaRevenueService;
