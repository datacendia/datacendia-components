/**
 * Service — Cendia Procure Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaProcureService, VendorContract, NegotiationOpportunity, SqueezeResult
 * @module services/enterprise/CendiaProcureService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIAPROCURE™ - THE RUTHLESS NEGOTIATOR
// Procurement & Sourcing Automation
// "The Squeeze" - Automated vendor negotiations at scale
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface VendorContract {
  id: string;
  vendorName: string;
  vendorEmail: string;
  category: 'cloud' | 'software' | 'hardware' | 'services' | 'supplies' | 'other';
  annualValue: number;
  currency: string;
  startDate: Date;
  endDate: Date;
  renewalDate: Date;
  autoRenew: boolean;
  usagePercent: number; // How much of the contract are we actually using
  marketBenchmark?: number; // What similar companies pay
  terms: string;
  status: 'active' | 'expiring' | 'negotiating' | 'renewed' | 'canceled';
}

export interface NegotiationOpportunity {
  contractId: string;
  vendorName: string;
  currentPrice: number;
  targetPrice: number;
  savingsEstimate: number;
  leverage: string[];
  negotiationScript: string;
  draftEmail: string;
  priority: 'low' | 'medium' | 'high';
  deadlineDays: number;
}

export interface SqueezeResult {
  contractId: string;
  vendorName: string;
  originalPrice: number;
  negotiatedPrice: number;
  savingsAchieved: number;
  savingsPercent: number;
  completedAt: Date;
}

// =============================================================================
// CENDIAPROCURE SERVICE
// =============================================================================

class CendiaProcureService {
  private contracts: Map<string, VendorContract> = new Map();
  private negotiations: NegotiationOpportunity[] = [];
  private results: SqueezeResult[] = [];



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  // ---------------------------------------------------------------------------
  // CONTRACT ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeContract(contract: VendorContract): Promise<NegotiationOpportunity> {
    const daysUntilRenewal = Math.floor(
      (contract.renewalDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000)
    );

    // Calculate target price based on usage and market
    const usageAdjustment = contract.usagePercent < 70 ? 0.15 : 0;
    const marketAdjustment = contract.marketBenchmark 
      ? Math.max(0, (contract.annualValue - contract.marketBenchmark) / contract.annualValue)
      : 0.10;
    
    const targetReduction = Math.min(0.25, usageAdjustment + marketAdjustment);
    const targetPrice = Math.round(contract.annualValue * (1 - targetReduction));
    const savingsEstimate = contract.annualValue - targetPrice;

    // Generate leverage points
    const leverage: string[] = [];
    if (contract.usagePercent < 70) {
      leverage.push(`Only using ${contract.usagePercent}% of contracted capacity`);
    }
    if (contract.marketBenchmark && contract.annualValue > contract.marketBenchmark) {
      leverage.push(`Market rate is $${contract.marketBenchmark.toLocaleString()}, we pay ${Math.round((contract.annualValue / contract.marketBenchmark - 1) * 100)}% above`);
    }
    if (daysUntilRenewal < 90) {
      leverage.push('We have alternative vendors ready');
    }
    leverage.push('Multi-year commitment available for right price');

    // Generate negotiation email
    const prompt = `Write a professional but firm negotiation email to ${contract.vendorName}.

Current contract: $${contract.annualValue.toLocaleString()}/year
Target: $${targetPrice.toLocaleString()}/year
Leverage: ${leverage.join('; ')}

The email should:
1. Be professional but signal we're serious about savings
2. Mention we're reviewing all vendor relationships
3. Request a meeting to discuss renewal terms
4. Not mention specific competing vendors (keep them guessing)

Write only the email body, no subject line.`;

    let draftEmail = '';
    try {
      draftEmail = await ollama.generate(prompt, {});
    } catch (error) {
      draftEmail = `Dear ${contract.vendorName} Team,\n\nAs we approach our contract renewal, we are conducting a comprehensive review of all vendor relationships and associated costs.\n\nWe value our partnership and would like to discuss renewal terms that better reflect our current usage patterns and market conditions.\n\nPlease arrange a meeting at your earliest convenience.\n\nBest regards`;
    }

    const opportunity: NegotiationOpportunity = {
      contractId: contract.id,
      vendorName: contract.vendorName,
      currentPrice: contract.annualValue,
      targetPrice,
      savingsEstimate,
      leverage,
      negotiationScript: `Target: ${targetReduction * 100}% reduction. Walk-away: ${targetReduction * 0.5 * 100}% reduction.`,
      draftEmail,
      priority: savingsEstimate > 50000 ? 'high' : savingsEstimate > 10000 ? 'medium' : 'low',
      deadlineDays: Math.max(0, daysUntilRenewal - 30),
    };

    this.negotiations.push(opportunity);
    return opportunity;
  }

  // ---------------------------------------------------------------------------
  // THE SQUEEZE - Mass Negotiation
  // ---------------------------------------------------------------------------

  async executeTheSqueeze(): Promise<{
    contractsAnalyzed: number;
    negotiationsInitiated: number;
    totalPotentialSavings: number;
    emails: { vendor: string; email: string }[];
  }> {
    const contracts = Array.from(this.contracts.values())
      .filter(c => {
        const daysUntilRenewal = (c.renewalDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000);
        return daysUntilRenewal <= 90 && daysUntilRenewal > 0 && c.status !== 'negotiating';
      });

    const emails: { vendor: string; email: string }[] = [];
    let totalPotentialSavings = 0;

    for (const contract of contracts) {
      const opportunity = await this.analyzeContract(contract);
      totalPotentialSavings += opportunity.savingsEstimate;
      
      emails.push({
        vendor: contract.vendorName,
        email: opportunity.draftEmail,
      });

      contract.status = 'negotiating';
    }

    logger.info(`CendiaProcure: The Squeeze initiated for ${contracts.length} contracts. Potential savings: $${totalPotentialSavings.toLocaleString()}`);

    return {
      contractsAnalyzed: contracts.length,
      negotiationsInitiated: emails.length,
      totalPotentialSavings,
      emails,
    };
  }

  // ---------------------------------------------------------------------------
  // CONTRACT MANAGEMENT
  // ---------------------------------------------------------------------------

  addContract(contract: Omit<VendorContract, 'id' | 'status'>): VendorContract {
    const vendorContract: VendorContract = {
      id: `contract-${Date.now()}`,
      ...contract,
      status: 'active',
    };
    this.contracts.set(vendorContract.id, vendorContract);
    persistServiceRecord({ serviceName: 'CendiaProcure', recordType: 'contract', referenceId: vendorContract.id, data: vendorContract });
    return vendorContract;
  }

  getExpiringContracts(withinDays: number = 90): VendorContract[] {
    const cutoff = new Date(Date.now() + withinDays * 24 * 60 * 60 * 1000);
    return Array.from(this.contracts.values())
      .filter(c => c.renewalDate <= cutoff && c.status === 'active')
      .sort((a, b) => a.renewalDate.getTime() - b.renewalDate.getTime());
  }

  recordNegotiationResult(contractId: string, negotiatedPrice: number): SqueezeResult {
    const contract = this.contracts.get(contractId);
    if (!contract) throw new Error('Contract not found');

    const result: SqueezeResult = {
      contractId,
      vendorName: contract.vendorName,
      originalPrice: contract.annualValue,
      negotiatedPrice,
      savingsAchieved: contract.annualValue - negotiatedPrice,
      savingsPercent: ((contract.annualValue - negotiatedPrice) / contract.annualValue) * 100,
      completedAt: new Date(),
    };

    this.results.push(result);
    contract.annualValue = negotiatedPrice;
    contract.status = 'renewed';

    logger.info(`CendiaProcure: Saved $${result.savingsAchieved.toLocaleString()} on ${contract.vendorName}`);
    return result;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalContractValue: number;
    savingsThisYear: number;
    pendingNegotiations: number;
    avgSavingsPercent: number;
  } {
    const totalContractValue = Array.from(this.contracts.values())
      .reduce((sum, c) => sum + c.annualValue, 0);

    const currentYear = new Date().getFullYear();
    const yearResults = this.results.filter(r => r.completedAt.getFullYear() === currentYear);
    const savingsThisYear = yearResults.reduce((sum, r) => sum + r.savingsAchieved, 0);
    const avgSavingsPercent = yearResults.length > 0
      ? yearResults.reduce((sum, r) => sum + r.savingsPercent, 0) / yearResults.length
      : 0;

    return {
      totalContractValue,
      savingsThisYear,
      pendingNegotiations: this.negotiations.filter(n => 
        !this.results.some(r => r.contractId === n.contractId)
      ).length,
      avgSavingsPercent,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Procurement Intelligence Dashboard */
  getProcurementIntelligenceDashboard(): {
    overview: { totalContracts: number; totalAnnualSpend: number; avgContractValue: number; expiringWithin90Days: number };
    byCategory: Array<{ category: string; count: number; totalValue: number; avgValue: number; pctOfSpend: number }>;
    byStatus: Array<{ status: string; count: number; totalValue: number }>;
    negotiationPipeline: { active: number; potentialSavings: number; avgTargetReduction: number; highPriority: number };
    savingsPerformance: { totalSavingsAchieved: number; negotiationsCompleted: number; avgSavingsPercent: number; bestNegotiation: { vendor: string; savingsPercent: number } | null };
    contractHealth: { autoRenewCount: number; lowUtilization: number; aboveMarketRate: number; needsReview: number };
    insights: string[];
  } {
    const contracts = Array.from(this.contracts.values());
    const totalSpend = contracts.reduce((s, c) => s + c.annualValue, 0);

    const catMap: Record<string, { count: number; value: number }> = {};
    const statusMap: Record<string, { count: number; value: number }> = {};
    let autoRenew = 0; let lowUtil = 0; let aboveMarket = 0;

    for (const c of contracts) {
      if (!catMap[c.category]) catMap[c.category] = { count: 0, value: 0 };
      catMap[c.category].count++;
      catMap[c.category].value += c.annualValue;

      if (!statusMap[c.status]) statusMap[c.status] = { count: 0, value: 0 };
      statusMap[c.status].count++;
      statusMap[c.status].value += c.annualValue;

      if (c.autoRenew) autoRenew++;
      if (c.usagePercent < 50) lowUtil++;
      if (c.marketBenchmark && c.annualValue > c.marketBenchmark * 1.1) aboveMarket++;
    }

    const now = Date.now();
    const expiring90 = contracts.filter(c => {
      const days = (c.renewalDate.getTime() - now) / (24 * 60 * 60 * 1000);
      return days > 0 && days <= 90 && c.status === 'active';
    }).length;

    const pendingNeg = this.negotiations.filter(n => !this.results.some(r => r.contractId === n.contractId));
    const potentialSavings = pendingNeg.reduce((s, n) => s + n.savingsEstimate, 0);
    const avgTargetReduction = pendingNeg.length > 0 ? pendingNeg.reduce((s, n) => s + ((n.currentPrice - n.targetPrice) / n.currentPrice) * 100, 0) / pendingNeg.length : 0;

    const bestResult = this.results.length > 0 ? this.results.reduce((best, r) => r.savingsPercent > best.savingsPercent ? r : best, this.results[0]) : null;

    const insights: string[] = [];
    if (expiring90 > 0) insights.push(`${expiring90} contract(s) expiring within 90 days — initiate negotiations`);
    if (lowUtil > 0) insights.push(`${lowUtil} contract(s) with utilization below 50% — rightsize or renegotiate`);
    if (aboveMarket > 0) insights.push(`${aboveMarket} contract(s) above market rate by 10%+ — leverage in negotiations`);
    if (potentialSavings > 0) insights.push(`$${Math.round(potentialSavings).toLocaleString()} in potential savings from active negotiations`);
    if (insights.length === 0) insights.push('Procurement portfolio is well-optimized');

    return {
      overview: { totalContracts: contracts.length, totalAnnualSpend: totalSpend, avgContractValue: contracts.length > 0 ? Math.round(totalSpend / contracts.length) : 0, expiringWithin90Days: expiring90 },
      byCategory: Object.entries(catMap).map(([cat, d]) => ({ category: cat, count: d.count, totalValue: d.value, avgValue: Math.round(d.value / d.count), pctOfSpend: totalSpend > 0 ? Math.round((d.value / totalSpend) * 100) : 0 })).sort((a, b) => b.totalValue - a.totalValue),
      byStatus: Object.entries(statusMap).map(([st, d]) => ({ status: st, count: d.count, totalValue: d.value })),
      negotiationPipeline: { active: pendingNeg.length, potentialSavings, avgTargetReduction: Math.round(avgTargetReduction * 10) / 10, highPriority: pendingNeg.filter(n => n.priority === 'high').length },
      savingsPerformance: { totalSavingsAchieved: this.results.reduce((s, r) => s + r.savingsAchieved, 0), negotiationsCompleted: this.results.length, avgSavingsPercent: this.results.length > 0 ? Math.round(this.results.reduce((s, r) => s + r.savingsPercent, 0) / this.results.length * 10) / 10 : 0, bestNegotiation: bestResult ? { vendor: bestResult.vendorName, savingsPercent: Math.round(bestResult.savingsPercent * 10) / 10 } : null },
      contractHealth: { autoRenewCount: autoRenew, lowUtilization: lowUtil, aboveMarketRate: aboveMarket, needsReview: lowUtil + aboveMarket },
      insights,
    };
  }

  /** 10/10: Vendor Risk & Performance Analytics */
  getVendorRiskAnalytics(): {
    vendorCount: number;
    vendorConcentration: Array<{ vendor: string; contractCount: number; totalSpend: number; pctOfSpend: number; riskLevel: string }>;
    categoryConcentration: Array<{ category: string; vendorCount: number; singleVendorRisk: boolean }>;
    expirationTimeline: Array<{ month: string; count: number; totalValue: number }>;
    utilizationDistribution: { high: number; medium: number; low: number; critical: number };
    renewalRisk: Array<{ vendor: string; contractId: string; daysUntilRenewal: number; annualValue: number; autoRenew: boolean; utilization: number }>;
    insights: string[];
  } {
    const contracts = Array.from(this.contracts.values());
    const totalSpend = contracts.reduce((s, c) => s + c.annualValue, 0);

    const vendorMap: Record<string, { count: number; spend: number }> = {};
    const catVendors: Record<string, Set<string>> = {};
    const monthMap: Record<string, { count: number; value: number }> = {};
    const utilDist = { high: 0, medium: 0, low: 0, critical: 0 };

    for (const c of contracts) {
      if (!vendorMap[c.vendorName]) vendorMap[c.vendorName] = { count: 0, spend: 0 };
      vendorMap[c.vendorName].count++;
      vendorMap[c.vendorName].spend += c.annualValue;

      if (!catVendors[c.category]) catVendors[c.category] = new Set();
      catVendors[c.category].add(c.vendorName);

      const monthKey = `${c.renewalDate.getFullYear()}-${String(c.renewalDate.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[monthKey]) monthMap[monthKey] = { count: 0, value: 0 };
      monthMap[monthKey].count++;
      monthMap[monthKey].value += c.annualValue;

      if (c.usagePercent >= 80) utilDist.high++;
      else if (c.usagePercent >= 50) utilDist.medium++;
      else if (c.usagePercent >= 25) utilDist.low++;
      else utilDist.critical++;
    }

    const now = Date.now();
    const renewalRisk = contracts
      .filter(c => c.status === 'active')
      .map(c => ({ vendor: c.vendorName, contractId: c.id, daysUntilRenewal: Math.floor((c.renewalDate.getTime() - now) / (24 * 60 * 60 * 1000)), annualValue: c.annualValue, autoRenew: c.autoRenew, utilization: c.usagePercent }))
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal)
      .slice(0, 10);

    const vendorConc = Object.entries(vendorMap)
      .map(([v, d]) => ({ vendor: v, contractCount: d.count, totalSpend: d.spend, pctOfSpend: totalSpend > 0 ? Math.round((d.spend / totalSpend) * 100) : 0, riskLevel: d.spend / totalSpend > 0.3 ? 'high' : d.spend / totalSpend > 0.15 ? 'medium' : 'low' }))
      .sort((a, b) => b.totalSpend - a.totalSpend);

    const insights: string[] = [];
    const highConc = vendorConc.filter(v => v.riskLevel === 'high');
    if (highConc.length > 0) insights.push(`${highConc.length} vendor(s) represent 30%+ of total spend — concentration risk`);
    const singleVendorCats = Object.entries(catVendors).filter(([, vendors]) => vendors.size === 1);
    if (singleVendorCats.length > 0) insights.push(`${singleVendorCats.length} category(ies) depend on a single vendor`);
    if (utilDist.critical > 0) insights.push(`${utilDist.critical} contract(s) with critically low utilization (<25%)`);
    if (insights.length === 0) insights.push('Vendor portfolio is well-diversified');

    return {
      vendorCount: Object.keys(vendorMap).length,
      vendorConcentration: vendorConc,
      categoryConcentration: Object.entries(catVendors).map(([cat, vendors]) => ({ category: cat, vendorCount: vendors.size, singleVendorRisk: vendors.size === 1 })),
      expirationTimeline: Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([month, d]) => ({ month, count: d.count, totalValue: d.value })),
      utilizationDistribution: utilDist,
      renewalRisk,
      insights,
    };
  }

  /** 10/10: Contract Optimization Engine */
  getContractOptimizations(): {
    totalOptimizationPotential: number;
    rightsizing: Array<{ vendor: string; contractId: string; currentValue: number; recommendedValue: number; savings: number; reason: string }>;
    consolidation: Array<{ category: string; vendors: string[]; currentTotalSpend: number; estimatedConsolidatedSpend: number; savings: number }>;
    renegotiation: Array<{ vendor: string; contractId: string; currentValue: number; marketBenchmark: number; overpayment: number; priority: string }>;
    autoRenewAlerts: Array<{ vendor: string; contractId: string; renewalDate: Date; annualValue: number; daysUntilRenewal: number }>;
    insights: string[];
  } {
    const contracts = Array.from(this.contracts.values());
    const now = Date.now();
    let totalPotential = 0;

    const rightsizing = contracts
      .filter(c => c.usagePercent < 60)
      .map(c => {
        const recommended = Math.round(c.annualValue * (c.usagePercent / 100) * 1.2);
        const savings = c.annualValue - recommended;
        totalPotential += savings;
        return { vendor: c.vendorName, contractId: c.id, currentValue: c.annualValue, recommendedValue: recommended, savings, reason: `Utilization at ${c.usagePercent}% — rightsize to actual usage + 20% buffer` };
      });

    const catContracts: Record<string, VendorContract[]> = {};
    for (const c of contracts) {
      if (!catContracts[c.category]) catContracts[c.category] = [];
      catContracts[c.category].push(c);
    }
    const consolidation = Object.entries(catContracts)
      .filter(([, cs]) => cs.length > 2)
      .map(([cat, cs]) => {
        const currentTotal = cs.reduce((s, c) => s + c.annualValue, 0);
        const estimated = Math.round(currentTotal * 0.8);
        const savings = currentTotal - estimated;
        totalPotential += savings;
        return { category: cat, vendors: cs.map(c => c.vendorName), currentTotalSpend: currentTotal, estimatedConsolidatedSpend: estimated, savings };
      });

    const renegotiation = contracts
      .filter(c => c.marketBenchmark && c.annualValue > c.marketBenchmark * 1.05)
      .map(c => {
        const overpayment = c.annualValue - c.marketBenchmark!;
        return { vendor: c.vendorName, contractId: c.id, currentValue: c.annualValue, marketBenchmark: c.marketBenchmark!, overpayment, priority: overpayment > 50000 ? 'high' : overpayment > 10000 ? 'medium' : 'low' };
      })
      .sort((a, b) => b.overpayment - a.overpayment);

    const autoRenewAlerts = contracts
      .filter(c => c.autoRenew && c.status === 'active')
      .map(c => ({ vendor: c.vendorName, contractId: c.id, renewalDate: c.renewalDate, annualValue: c.annualValue, daysUntilRenewal: Math.floor((c.renewalDate.getTime() - now) / (24 * 60 * 60 * 1000)) }))
      .filter(a => a.daysUntilRenewal > 0 && a.daysUntilRenewal <= 60)
      .sort((a, b) => a.daysUntilRenewal - b.daysUntilRenewal);

    const insights: string[] = [];
    if (totalPotential > 0) insights.push(`$${Math.round(totalPotential).toLocaleString()} total optimization potential identified`);
    if (rightsizing.length > 0) insights.push(`${rightsizing.length} contract(s) can be rightsized based on actual usage`);
    if (autoRenewAlerts.length > 0) insights.push(`${autoRenewAlerts.length} auto-renew contract(s) within 60 days — review before auto-renewal`);
    if (insights.length === 0) insights.push('Contract portfolio is well-optimized');

    return { totalOptimizationPotential: totalPotential, rightsizing, consolidation, renegotiation, autoRenewAlerts, insights };
  }

  /** 10/10: Savings Impact Tracker */
  getSavingsImpactTracker(): {
    lifetime: { totalNegotiations: number; totalSavings: number; avgSavingsPercent: number; totalOriginalValue: number; totalNegotiatedValue: number };
    thisYear: { negotiations: number; savings: number; avgSavingsPercent: number };
    byVendor: Array<{ vendor: string; negotiations: number; totalSavings: number; avgSavingsPercent: number }>;
    byMonth: Array<{ month: string; negotiations: number; savings: number }>;
    topSavings: Array<{ vendor: string; originalPrice: number; negotiatedPrice: number; savings: number; savingsPercent: number; completedAt: Date }>;
    roi: { negotiationEffort: number; savingsGenerated: number; roiMultiple: number };
    insights: string[];
  } {
    const currentYear = new Date().getFullYear();
    const yearResults = this.results.filter(r => r.completedAt.getFullYear() === currentYear);
    const totalSavings = this.results.reduce((s, r) => s + r.savingsAchieved, 0);
    const totalOriginal = this.results.reduce((s, r) => s + r.originalPrice, 0);
    const totalNegotiated = this.results.reduce((s, r) => s + r.negotiatedPrice, 0);

    const vendorMap: Record<string, { count: number; savings: number; pcts: number[] }> = {};
    const monthMap: Record<string, { count: number; savings: number }> = {};

    for (const r of this.results) {
      if (!vendorMap[r.vendorName]) vendorMap[r.vendorName] = { count: 0, savings: 0, pcts: [] };
      vendorMap[r.vendorName].count++;
      vendorMap[r.vendorName].savings += r.savingsAchieved;
      vendorMap[r.vendorName].pcts.push(r.savingsPercent);

      const monthKey = `${r.completedAt.getFullYear()}-${String(r.completedAt.getMonth() + 1).padStart(2, '0')}`;
      if (!monthMap[monthKey]) monthMap[monthKey] = { count: 0, savings: 0 };
      monthMap[monthKey].count++;
      monthMap[monthKey].savings += r.savingsAchieved;
    }

    const topSavings = [...this.results]
      .sort((a, b) => b.savingsAchieved - a.savingsAchieved)
      .slice(0, 10)
      .map(r => ({ vendor: r.vendorName, originalPrice: r.originalPrice, negotiatedPrice: r.negotiatedPrice, savings: r.savingsAchieved, savingsPercent: Math.round(r.savingsPercent * 10) / 10, completedAt: r.completedAt }));

    const negotiationEffort = this.results.length * 8; // Estimate 8 hours per negotiation
    const roiMultiple = negotiationEffort > 0 ? Math.round(totalSavings / (negotiationEffort * 150) * 10) / 10 : 0; // $150/hr cost

    const insights: string[] = [];
    if (totalSavings > 0) insights.push(`$${Math.round(totalSavings).toLocaleString()} in total lifetime savings achieved`);
    const yearSavings = yearResults.reduce((s, r) => s + r.savingsAchieved, 0);
    if (yearSavings > 0) insights.push(`$${Math.round(yearSavings).toLocaleString()} saved this year across ${yearResults.length} negotiation(s)`);
    if (roiMultiple > 1) insights.push(`${roiMultiple}x ROI on negotiation effort`);
    if (insights.length === 0) insights.push('No completed negotiations yet — initiate The Squeeze');

    return {
      lifetime: { totalNegotiations: this.results.length, totalSavings, avgSavingsPercent: this.results.length > 0 ? Math.round(this.results.reduce((s, r) => s + r.savingsPercent, 0) / this.results.length * 10) / 10 : 0, totalOriginalValue: totalOriginal, totalNegotiatedValue: totalNegotiated },
      thisYear: { negotiations: yearResults.length, savings: yearSavings, avgSavingsPercent: yearResults.length > 0 ? Math.round(yearResults.reduce((s, r) => s + r.savingsPercent, 0) / yearResults.length * 10) / 10 : 0 },
      byVendor: Object.entries(vendorMap).map(([v, d]) => ({ vendor: v, negotiations: d.count, totalSavings: d.savings, avgSavingsPercent: Math.round(d.pcts.reduce((a, b) => a + b, 0) / d.pcts.length * 10) / 10 })).sort((a, b) => b.totalSavings - a.totalSavings),
      byMonth: Object.entries(monthMap).sort(([a], [b]) => a.localeCompare(b)).map(([m, d]) => ({ month: m, negotiations: d.count, savings: d.savings })),
      topSavings,
      roi: { negotiationEffort, savingsGenerated: totalSavings, roiMultiple },
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaProcure', recordType: 'contract', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.contracts.has(d.id)) this.contracts.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[CendiaProcureService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaProcureService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaProcure',
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
      service: 'CendiaProcure',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

export const cendiaProcureService = new CendiaProcureService();
export default cendiaProcureService;
