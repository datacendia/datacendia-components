// =============================================================================
// CENDIAPROCURE™ - THE RUTHLESS NEGOTIATOR
// Procurement & Sourcing Automation
// "The Squeeze" - Automated vendor negotiations at scale
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';

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
      draftEmail = await ollama.generate(prompt, { model: 'llama3.3:70b' });
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
}

export const cendiaProcureService = new CendiaProcureService();
export default cendiaProcureService;
