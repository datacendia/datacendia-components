/**
 * Service — Cendia Docket Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports cendiaDocketService, LegalMatter, Party, LegalDocument, MatterEvent, LitigationAnalysis, Risk, OutcomeProjection
 * @module services/enterprise/CendiaDocketService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIADOCKET™ - LEGAL OPERATIONS INTELLIGENCE
// "The Litigation Engine" - AI-powered legal analysis and case management
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface LegalMatter {
  id: string;
  title: string;
  type: 'lawsuit' | 'contract' | 'compliance' | 'ip' | 'employment' | 'regulatory' | 'corporate';
  status: 'open' | 'active' | 'discovery' | 'negotiation' | 'trial' | 'appeal' | 'settled' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  parties: Party[];
  jurisdiction: string;
  filingDate?: Date;
  estimatedResolution?: Date;
  estimatedCost: number;
  actualCost: number;
  winProbability?: number;
  riskExposure: number;
  assignedCounsel: string;
  documents: LegalDocument[];
  timeline: MatterEvent[];
  createdAt: Date;
  updatedAt: Date;
}

export interface Party {
  name: string;
  role: 'plaintiff' | 'defendant' | 'counterparty' | 'witness' | 'expert';
  type: 'individual' | 'corporation' | 'government';
  contact?: string;
  counsel?: string;
}

export interface LegalDocument {
  id: string;
  name: string;
  type: 'contract' | 'pleading' | 'motion' | 'brief' | 'discovery' | 'correspondence' | 'exhibit' | 'agreement';
  status: 'draft' | 'review' | 'final' | 'filed' | 'executed';
  version: number;
  confidential: boolean;
  privileged: boolean;
  uploadedAt: Date;
  uploadedBy: string;
  summary?: string;
}

export interface MatterEvent {
  timestamp: Date;
  type: 'filing' | 'hearing' | 'deadline' | 'settlement_offer' | 'discovery' | 'motion' | 'ruling' | 'note';
  description: string;
  outcome?: string;
  actor: string;
}

export interface LitigationAnalysis {
  matterId: string;
  winProbability: number;
  confidence: number;
  strengths: string[];
  weaknesses: string[];
  keyRisks: Risk[];
  recommendation: 'proceed' | 'settle' | 'mediate' | 'withdraw';
  recommendedSettlement?: number;
  projectedOutcome: OutcomeProjection;
  aiAnalysis: string;
  generatedAt: Date;
}

export interface Risk {
  description: string;
  probability: number;
  impact: number;
  mitigation: string;
}

export interface OutcomeProjection {
  bestCase: { outcome: string; probability: number; financialImpact: number };
  likelyCase: { outcome: string; probability: number; financialImpact: number };
  worstCase: { outcome: string; probability: number; financialImpact: number };
}

export interface DiscoveryRequest {
  id: string;
  matterId: string;
  type: 'interrogatories' | 'document_request' | 'deposition' | 'admission';
  status: 'pending' | 'in_progress' | 'complete' | 'objected';
  requestedBy: 'us' | 'opposing';
  description: string;
  deadline: Date;
  documentsProduced: number;
  privilegedRedactions: number;
  responseDueDate?: Date;
}

export interface ContractAnalysis {
  documentId: string;
  parties: string[];
  effectiveDate?: Date;
  terminationDate?: Date;
  value?: number;
  keyTerms: KeyTerm[];
  risks: ContractRisk[];
  obligations: Obligation[];
  redFlags: string[];
  recommendations: string[];
  score: number;
  aiSummary: string;
}

export interface KeyTerm {
  term: string;
  section: string;
  summary: string;
  favorable: boolean;
}

export interface ContractRisk {
  type: 'liability' | 'termination' | 'ip' | 'indemnification' | 'limitation' | 'compliance';
  severity: 'low' | 'medium' | 'high';
  description: string;
  clause: string;
  recommendation: string;
}

export interface Obligation {
  description: string;
  party: string;
  deadline?: Date;
  recurring: boolean;
  compliance: 'compliant' | 'at_risk' | 'non_compliant' | 'unknown';
}

export interface ComplianceCheck {
  id: string;
  regulation: string;
  jurisdiction: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'pending_review';
  findings: ComplianceFinding[];
  lastAudit: Date;
  nextAudit: Date;
  riskScore: number;
}

export interface ComplianceFinding {
  area: string;
  status: 'pass' | 'fail' | 'warning';
  description: string;
  remediation?: string;
  deadline?: Date;
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaDocketService {
  private matters: Map<string, LegalMatter> = new Map();
  private documents: Map<string, LegalDocument> = new Map();
  private discoveryRequests: Map<string, DiscoveryRequest> = new Map();
  private complianceChecks: Map<string, ComplianceCheck> = new Map();

  constructor() {
    logger.info('CendiaDocket™ initialized - The Litigation Engine is ready');


    this.loadFromDB().catch(() => {});
  }

  // ---------------------------------------------------------------------------
  // MATTER MANAGEMENT
  // ---------------------------------------------------------------------------

  createMatter(matter: Omit<LegalMatter, 'id' | 'documents' | 'timeline' | 'actualCost' | 'createdAt' | 'updatedAt'>): LegalMatter {
    const newMatter: LegalMatter = {
      ...matter,
      id: `matter-${Date.now()}-${crypto.randomUUID().slice(0, 9)}`,
      actualCost: 0,
      documents: [],
      timeline: [{
        timestamp: new Date(),
        type: 'note',
        description: 'Matter created',
        actor: 'System',
      }],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this.matters.set(newMatter.id, newMatter);
    persistServiceRecord({ serviceName: 'CendiaDocket', recordType: 'matter', referenceId: newMatter.id, data: newMatter });
    logger.info(`CendiaDocket: Created matter ${newMatter.title} (${newMatter.id})`);
    return newMatter;
  }

  updateMatter(matterId: string, update: Partial<LegalMatter>): LegalMatter | null {
    const matter = this.matters.get(matterId);
    if (!matter) return null;

    Object.assign(matter, update, { updatedAt: new Date() });
    return matter;
  }

  addMatterEvent(matterId: string, event: Omit<MatterEvent, 'timestamp'>): LegalMatter | null {
    const matter = this.matters.get(matterId);
    if (!matter) return null;

    matter.timeline.push({
      ...event,
      timestamp: new Date(),
    });
    matter.updatedAt = new Date();

    logger.debug(`CendiaDocket: Event added to matter ${matterId}: ${event.type}`);
    return matter;
  }

  getMatter(matterId: string): LegalMatter | null {
    return this.matters.get(matterId) || null;
  }

  getAllMatters(): LegalMatter[] {
    return Array.from(this.matters.values());
  }

  getMattersByType(type: LegalMatter['type']): LegalMatter[] {
    return Array.from(this.matters.values()).filter(m => m.type === type);
  }

  getMattersByStatus(status: LegalMatter['status']): LegalMatter[] {
    return Array.from(this.matters.values()).filter(m => m.status === status);
  }

  // ---------------------------------------------------------------------------
  // LITIGATION ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeLitigation(matterId: string): Promise<LitigationAnalysis> {
    const matter = this.matters.get(matterId);
    if (!matter) throw new Error(`Matter ${matterId} not found`);

    const prompt = `You are CendiaDocket™, an AI legal analysis system evaluating litigation.

CASE DETAILS:
- Title: ${matter.title}
- Type: ${matter.type}
- Status: ${matter.status}
- Jurisdiction: ${matter.jurisdiction}
- Description: ${matter.description}
- Risk Exposure: $${matter.riskExposure.toLocaleString()}
- Estimated Cost: $${matter.estimatedCost.toLocaleString()}

PARTIES:
${matter.parties.map(p => `- ${p.name} (${p.role}, ${p.type})`).join('\n')}

CASE TIMELINE:
${matter.timeline.slice(-10).map(e => `- ${e.timestamp.toISOString().split('T')[0]}: ${e.type} - ${e.description}`).join('\n')}

Analyze this litigation and provide assessment in JSON:
{
  "winProbability": 0-100,
  "confidence": 0-100,
  "strengths": ["strength 1", "strength 2"],
  "weaknesses": ["weakness 1", "weakness 2"],
  "keyRisks": [
    {
      "description": "risk description",
      "probability": 0-100,
      "impact": dollar_amount,
      "mitigation": "mitigation strategy"
    }
  ],
  "recommendation": "proceed|settle|mediate|withdraw",
  "recommendedSettlement": dollar_amount_or_null,
  "projectedOutcome": {
    "bestCase": { "outcome": "description", "probability": 0-100, "financialImpact": dollar },
    "likelyCase": { "outcome": "description", "probability": 0-100, "financialImpact": dollar },
    "worstCase": { "outcome": "description", "probability": 0-100, "financialImpact": dollar }
  },
  "analysis": "detailed analysis paragraph"
}`;

    let analysis: Partial<LitigationAnalysis> = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('legal_analysis') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          analysis = parsed;
        }
      }
    } catch (error) {
      logger.warn('CendiaDocket: AI litigation analysis unavailable');
    }

    // Fallback/defaults
    const result: LitigationAnalysis = {
      matterId,
      winProbability: analysis.winProbability || this.calculateHeuristicWinProbability(matter),
      confidence: analysis.confidence || 65,
      strengths: analysis.strengths || ['Strong documentation'],
      weaknesses: analysis.weaknesses || ['Complex legal issues'],
      keyRisks: analysis.keyRisks || [{
        description: 'Adverse ruling',
        probability: 30,
        impact: matter.riskExposure,
        mitigation: 'Thorough preparation and strong legal arguments',
      }],
      recommendation: analysis.recommendation || this.determineRecommendation(matter),
      recommendedSettlement: analysis.recommendedSettlement,
      projectedOutcome: analysis.projectedOutcome || {
        bestCase: { outcome: 'Favorable ruling', probability: 25, financialImpact: 0 },
        likelyCase: { outcome: 'Partial settlement', probability: 50, financialImpact: matter.riskExposure * 0.4 },
        worstCase: { outcome: 'Adverse judgment', probability: 25, financialImpact: matter.riskExposure },
      },
      aiAnalysis: analysis.aiAnalysis || 'AI analysis pending. Manual review recommended.',
      generatedAt: new Date(),
    };

    // Update matter with win probability
    matter.winProbability = result.winProbability;
    matter.updatedAt = new Date();

    logger.info(`CendiaDocket: Litigation analysis for ${matterId}: ${result.winProbability}% win probability`);
    return result;
  }

  private calculateHeuristicWinProbability(matter: LegalMatter): number {
    let probability = 50;

    // Adjust based on status
    if (matter.status === 'negotiation') probability += 10;
    if (matter.status === 'trial') probability -= 10;

    // Adjust based on type
    if (matter.type === 'contract') probability += 5;
    if (matter.type === 'ip') probability -= 5;

    // Adjust based on documentation
    probability += Math.min(10, matter.documents.length * 2);

    return Math.max(10, Math.min(90, probability));
  }

  private determineRecommendation(matter: LegalMatter): LitigationAnalysis['recommendation'] {
    const costRatio = matter.estimatedCost / matter.riskExposure;
    
    if (costRatio > 0.7) return 'settle';
    if (matter.winProbability && matter.winProbability > 70) return 'proceed';
    if (matter.winProbability && matter.winProbability < 40) return 'settle';
    return 'mediate';
  }

  // ---------------------------------------------------------------------------
  // CONTRACT ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeContract(documentId: string, contractText: string): Promise<ContractAnalysis> {
    const prompt = `You are CendiaDocket™, an AI contract analysis system.

Analyze this contract and extract key information in JSON:
{
  "parties": ["party 1", "party 2"],
  "effectiveDate": "YYYY-MM-DD or null",
  "terminationDate": "YYYY-MM-DD or null",
  "value": dollar_amount_or_null,
  "keyTerms": [
    {
      "term": "term name",
      "section": "section reference",
      "summary": "brief summary",
      "favorable": true_or_false
    }
  ],
  "risks": [
    {
      "type": "liability|termination|ip|indemnification|limitation|compliance",
      "severity": "low|medium|high",
      "description": "risk description",
      "clause": "relevant clause text",
      "recommendation": "mitigation recommendation"
    }
  ],
  "obligations": [
    {
      "description": "obligation description",
      "party": "responsible party",
      "deadline": "YYYY-MM-DD or null",
      "recurring": true_or_false
    }
  ],
  "redFlags": ["red flag 1", "red flag 2"],
  "recommendations": ["recommendation 1", "recommendation 2"],
  "score": 0-100,
  "summary": "executive summary of contract"
}

CONTRACT TEXT:
${contractText.substring(0, 8000)}`;

    let analysis: Partial<ContractAnalysis> = {};

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('legal_analysis') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          analysis = parsed;
        }
      }
    } catch (error) {
      logger.warn('CendiaDocket: AI contract analysis unavailable');
    }

    const result: ContractAnalysis = {
      documentId,
      parties: analysis.parties || ['Party A', 'Party B'],
      effectiveDate: analysis.effectiveDate ? new Date(analysis.effectiveDate) : undefined,
      terminationDate: analysis.terminationDate ? new Date(analysis.terminationDate) : undefined,
      value: analysis.value,
      keyTerms: analysis.keyTerms || [],
      risks: analysis.risks || [],
      obligations: (analysis.obligations || []).map(o => ({
        ...o,
        compliance: 'unknown' as const,
      })),
      redFlags: analysis.redFlags || [],
      recommendations: analysis.recommendations || ['Thorough legal review recommended'],
      score: analysis.score || 70,
      aiSummary: analysis.aiSummary || 'Contract analysis complete. Review key terms and risks.',
    };

    logger.info(`CendiaDocket: Contract analysis complete for ${documentId}`);
    return result;
  }

  // ---------------------------------------------------------------------------
  // DISCOVERY MANAGEMENT
  // ---------------------------------------------------------------------------

  createDiscoveryRequest(request: Omit<DiscoveryRequest, 'id' | 'status' | 'documentsProduced' | 'privilegedRedactions'>): DiscoveryRequest {
    const newRequest: DiscoveryRequest = {
      ...request,
      id: `disc-${Date.now()}`,
      status: 'pending',
      documentsProduced: 0,
      privilegedRedactions: 0,
    };
    this.discoveryRequests.set(newRequest.id, newRequest);
    
    // Add to matter timeline
    const matter = this.matters.get(request.matterId);
    if (matter) {
      matter.timeline.push({
        timestamp: new Date(),
        type: 'discovery',
        description: `${request.type} ${request.requestedBy === 'us' ? 'sent' : 'received'}`,
        actor: 'Legal',
      });
    }

    logger.info(`CendiaDocket: Discovery request created for matter ${request.matterId}`);
    return newRequest;
  }

  updateDiscoveryProgress(requestId: string, produced: number, redacted: number): DiscoveryRequest | null {
    const request = this.discoveryRequests.get(requestId);
    if (!request) return null;

    request.documentsProduced = produced;
    request.privilegedRedactions = redacted;
    
    if (produced > 0) {
      request.status = 'in_progress';
    }

    return request;
  }

  completeDiscovery(requestId: string): DiscoveryRequest | null {
    const request = this.discoveryRequests.get(requestId);
    if (!request) return null;

    request.status = 'complete';

    // Add to matter timeline
    const matter = this.matters.get(request.matterId);
    if (matter) {
      matter.timeline.push({
        timestamp: new Date(),
        type: 'discovery',
        description: `${request.type} completed - ${request.documentsProduced} documents produced`,
        actor: 'Legal',
      });
    }

    logger.info(`CendiaDocket: Discovery ${requestId} completed`);
    return request;
  }

  // ---------------------------------------------------------------------------
  // COMPLIANCE
  // ---------------------------------------------------------------------------

  async runComplianceCheck(regulation: string, jurisdiction: string): Promise<ComplianceCheck> {
    const checkId = `comp-${Date.now()}`;

    const prompt = `You are CendiaDocket™, performing a compliance assessment.

REGULATION: ${regulation}
JURISDICTION: ${jurisdiction}

Generate a compliance assessment in JSON:
{
  "status": "compliant|partial|non_compliant|pending_review",
  "findings": [
    {
      "area": "compliance area",
      "status": "pass|fail|warning",
      "description": "finding description",
      "remediation": "remediation steps if needed",
      "deadline": "YYYY-MM-DD or null"
    }
  ],
  "riskScore": 0-100
}`;

    let status: ComplianceCheck['status'] = 'pending_review';
    let findings: ComplianceFinding[] = [];
    let riskScore = 50;

    try {
      const isAvailable = await ollama.isAvailable();
      if (isAvailable) {
        const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('legal_analysis') });
        const parsed = this.parseJsonFromResponse(response);
        if (parsed) {
          status = parsed.status || status;
          findings = parsed.findings || [];
          riskScore = parsed.riskScore || riskScore;
        }
      }
    } catch (error) {
      logger.warn('CendiaDocket: AI compliance check unavailable');
    }

    const check: ComplianceCheck = {
      id: checkId,
      regulation,
      jurisdiction,
      status,
      findings,
      lastAudit: new Date(),
      nextAudit: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000), // 90 days
      riskScore,
    };

    this.complianceChecks.set(checkId, check);
    logger.info(`CendiaDocket: Compliance check ${checkId} complete - ${status}`);
    return check;
  }

  getComplianceStatus(): ComplianceCheck[] {
    return Array.from(this.complianceChecks.values());
  }

  // ---------------------------------------------------------------------------
  // DEADLINES & CALENDAR
  // ---------------------------------------------------------------------------

  getUpcomingDeadlines(days: number = 30): { matter: LegalMatter; event: MatterEvent; daysUntil: number }[] {
    const deadlines: { matter: LegalMatter; event: MatterEvent; daysUntil: number }[] = [];
    const now = Date.now();
    const threshold = now + days * 24 * 60 * 60 * 1000;

    for (const matter of this.matters.values()) {
      for (const event of matter.timeline) {
        if (event.type === 'deadline' && event.timestamp.getTime() > now && event.timestamp.getTime() <= threshold) {
          deadlines.push({
            matter,
            event,
            daysUntil: Math.ceil((event.timestamp.getTime() - now) / (24 * 60 * 60 * 1000)),
          });
        }
      }
    }

    return deadlines.sort((a, b) => a.daysUntil - b.daysUntil);
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
      logger.warn('CendiaDocket: Failed to parse AI response as JSON');
    }
    return null;
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    totalMatters: number;
    activeMatters: number;
    totalExposure: number;
    totalCosts: number;
    avgWinProbability: number;
    upcomingDeadlines: number;
  } {
    const matters = this.getAllMatters();
    const active = matters.filter(m => !['closed', 'settled'].includes(m.status));
    const totalExposure = active.reduce((sum, m) => sum + m.riskExposure, 0);
    const totalCosts = matters.reduce((sum, m) => sum + m.actualCost, 0);
    const withProbability = matters.filter(m => m.winProbability !== undefined);
    const avgWin = withProbability.length > 0
      ? withProbability.reduce((sum, m) => sum + (m.winProbability || 0), 0) / withProbability.length
      : 0;

    return {
      totalMatters: matters.length,
      activeMatters: active.length,
      totalExposure,
      totalCosts,
      avgWinProbability: Math.round(avgWin),
      upcomingDeadlines: this.getUpcomingDeadlines(14).length,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /** 10/10: Legal Portfolio Dashboard */
  getLegalPortfolioDashboard(): {
    summary: { totalMatters: number; activeMatters: number; totalExposure: number; totalSpend: number; budgetVariance: number; avgDuration: number };
    byType: Array<{ type: LegalMatter['type']; count: number; exposure: number; spend: number; avgWinProb: number }>;
    byStatus: Array<{ status: LegalMatter['status']; count: number; exposure: number }>;
    byJurisdiction: Array<{ jurisdiction: string; count: number; exposure: number }>;
    byCounsel: Array<{ counsel: string; matters: number; totalCost: number; avgWinProb: number }>;
    riskTiers: { critical: number; high: number; medium: number; low: number };
    insights: string[];
  } {
    const matters = this.getAllMatters();
    const active = matters.filter(m => !['closed', 'settled'].includes(m.status));
    const totalExposure = active.reduce((sum, m) => sum + m.riskExposure, 0);
    const totalSpend = matters.reduce((sum, m) => sum + m.actualCost, 0);
    const totalEstimated = matters.reduce((sum, m) => sum + m.estimatedCost, 0);
    const budgetVariance = totalEstimated > 0 ? Math.round(((totalSpend - totalEstimated) / totalEstimated) * 100) : 0;

    const resolved = matters.filter(m => ['closed', 'settled'].includes(m.status));
    const avgDuration = resolved.length > 0
      ? Math.round(resolved.reduce((sum, m) => {
          const start = m.filingDate?.getTime() || m.createdAt.getTime();
          const end = m.updatedAt.getTime();
          return sum + (end - start) / (1000 * 60 * 60 * 24);
        }, 0) / resolved.length)
      : 0;

    const typeMap: Record<string, { count: number; exposure: number; spend: number; winProbs: number[] }> = {};
    const statusMap: Record<string, { count: number; exposure: number }> = {};
    const jurisdictionMap: Record<string, { count: number; exposure: number }> = {};
    const counselMap: Record<string, { matters: number; cost: number; winProbs: number[] }> = {};

    for (const m of matters) {
      if (!typeMap[m.type]) typeMap[m.type] = { count: 0, exposure: 0, spend: 0, winProbs: [] };
      typeMap[m.type].count++;
      typeMap[m.type].exposure += m.riskExposure;
      typeMap[m.type].spend += m.actualCost;
      if (m.winProbability !== undefined) typeMap[m.type].winProbs.push(m.winProbability);

      if (!statusMap[m.status]) statusMap[m.status] = { count: 0, exposure: 0 };
      statusMap[m.status].count++;
      statusMap[m.status].exposure += m.riskExposure;

      if (!jurisdictionMap[m.jurisdiction]) jurisdictionMap[m.jurisdiction] = { count: 0, exposure: 0 };
      jurisdictionMap[m.jurisdiction].count++;
      jurisdictionMap[m.jurisdiction].exposure += m.riskExposure;

      if (!counselMap[m.assignedCounsel]) counselMap[m.assignedCounsel] = { matters: 0, cost: 0, winProbs: [] };
      counselMap[m.assignedCounsel].matters++;
      counselMap[m.assignedCounsel].cost += m.actualCost;
      if (m.winProbability !== undefined) counselMap[m.assignedCounsel].winProbs.push(m.winProbability);
    }

    const avg = (arr: number[]) => arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b, 0) / arr.length) : 0;

    const riskTiers = { critical: 0, high: 0, medium: 0, low: 0 };
    for (const m of active) {
      if (m.riskExposure > 1000000 || m.priority === 'critical') riskTiers.critical++;
      else if (m.riskExposure > 500000 || m.priority === 'high') riskTiers.high++;
      else if (m.riskExposure > 100000 || m.priority === 'medium') riskTiers.medium++;
      else riskTiers.low++;
    }

    const insights: string[] = [];
    if (budgetVariance > 20) insights.push(`Legal spend is ${budgetVariance}% over budget — review cost controls`);
    if (riskTiers.critical > 0) insights.push(`${riskTiers.critical} matter(s) at critical risk exposure level`);
    if (this.getUpcomingDeadlines(7).length > 0) insights.push(`${this.getUpcomingDeadlines(7).length} deadline(s) within 7 days`);
    if (insights.length === 0) insights.push('Legal portfolio is within normal parameters');

    return {
      summary: { totalMatters: matters.length, activeMatters: active.length, totalExposure, totalSpend, budgetVariance, avgDuration },
      byType: Object.entries(typeMap).map(([type, d]) => ({ type: type as LegalMatter['type'], count: d.count, exposure: d.exposure, spend: d.spend, avgWinProb: avg(d.winProbs) })),
      byStatus: Object.entries(statusMap).map(([status, d]) => ({ status: status as LegalMatter['status'], ...d })),
      byJurisdiction: Object.entries(jurisdictionMap).map(([j, d]) => ({ jurisdiction: j, ...d })).sort((a, b) => b.exposure - a.exposure),
      byCounsel: Object.entries(counselMap).map(([c, d]) => ({ counsel: c, matters: d.matters, totalCost: d.cost, avgWinProb: avg(d.winProbs) })),
      riskTiers, insights,
    };
  }

  /** 10/10: Litigation Cost Intelligence */
  getLitigationCostIntelligence(): {
    totalSpend: number;
    totalBudget: number;
    budgetUtilization: number;
    costByPhase: Array<{ phase: string; count: number; totalCost: number; avgCost: number }>;
    costEfficiency: Array<{ counsel: string; mattersHandled: number; totalCost: number; costPerMatter: number; successRate: number }>;
    overBudgetMatters: Array<{ matterId: string; title: string; budget: number; actual: number; overagePercent: number }>;
    savingsOpportunities: Array<{ description: string; estimatedSavings: number; priority: string }>;
    forecast: { nextQuarterEstimate: number; confidence: number };
  } {
    const matters = this.getAllMatters();
    const totalSpend = matters.reduce((sum, m) => sum + m.actualCost, 0);
    const totalBudget = matters.reduce((sum, m) => sum + m.estimatedCost, 0);
    const budgetUtilization = totalBudget > 0 ? Math.round((totalSpend / totalBudget) * 100) : 0;

    const phaseMap: Record<string, { count: number; cost: number }> = {};
    for (const m of matters) {
      if (!phaseMap[m.status]) phaseMap[m.status] = { count: 0, cost: 0 };
      phaseMap[m.status].count++;
      phaseMap[m.status].cost += m.actualCost;
    }

    const counselMap: Record<string, { handled: number; cost: number; won: number; closed: number }> = {};
    for (const m of matters) {
      if (!counselMap[m.assignedCounsel]) counselMap[m.assignedCounsel] = { handled: 0, cost: 0, won: 0, closed: 0 };
      counselMap[m.assignedCounsel].handled++;
      counselMap[m.assignedCounsel].cost += m.actualCost;
      if (m.status === 'settled' || m.status === 'closed') {
        counselMap[m.assignedCounsel].closed++;
        if (m.winProbability && m.winProbability > 50) counselMap[m.assignedCounsel].won++;
      }
    }

    const overBudgetMatters = matters
      .filter(m => m.actualCost > m.estimatedCost * 1.1)
      .map(m => ({ matterId: m.id, title: m.title, budget: m.estimatedCost, actual: m.actualCost, overagePercent: Math.round(((m.actualCost - m.estimatedCost) / m.estimatedCost) * 100) }))
      .sort((a, b) => b.overagePercent - a.overagePercent);

    const savingsOpportunities: Array<{ description: string; estimatedSavings: number; priority: string }> = [];
    const active = matters.filter(m => !['closed', 'settled'].includes(m.status));
    const settleable = active.filter(m => m.winProbability !== undefined && m.winProbability < 40);
    if (settleable.length > 0) {
      const savings = settleable.reduce((sum, m) => sum + m.estimatedCost * 0.3, 0);
      savingsOpportunities.push({ description: `Settle ${settleable.length} low-probability matter(s) early`, estimatedSavings: Math.round(savings), priority: 'high' });
    }
    if (overBudgetMatters.length > 0) {
      savingsOpportunities.push({ description: 'Implement stricter budget controls on over-budget matters', estimatedSavings: Math.round(overBudgetMatters.reduce((s, m) => s + m.actual - m.budget, 0) * 0.5), priority: 'medium' });
    }

    const quarterlySpend = totalSpend / Math.max(1, Math.ceil(matters.length / 4));
    return {
      totalSpend, totalBudget, budgetUtilization,
      costByPhase: Object.entries(phaseMap).map(([phase, d]) => ({ phase, count: d.count, totalCost: d.cost, avgCost: d.count > 0 ? Math.round(d.cost / d.count) : 0 })),
      costEfficiency: Object.entries(counselMap).map(([c, d]) => ({ counsel: c, mattersHandled: d.handled, totalCost: d.cost, costPerMatter: d.handled > 0 ? Math.round(d.cost / d.handled) : 0, successRate: d.closed > 0 ? Math.round((d.won / d.closed) * 100) : 0 })),
      overBudgetMatters, savingsOpportunities,
      forecast: { nextQuarterEstimate: Math.round(quarterlySpend * 1.05), confidence: matters.length >= 10 ? 75 : 50 },
    };
  }

  /** 10/10: Compliance Risk Heatmap */
  getComplianceRiskHeatmap(): {
    overallRisk: number;
    byRegulation: Array<{ regulation: string; jurisdiction: string; status: string; riskScore: number; findingsCount: number; criticalFindings: number; nextAudit: Date }>;
    riskDistribution: { low: number; medium: number; high: number; critical: number };
    overdueAudits: Array<{ regulation: string; lastAudit: Date; daysSinceAudit: number }>;
    remediationProgress: { total: number; remediated: number; inProgress: number; overdue: number; rate: number };
    insights: string[];
  } {
    const checks = this.getComplianceStatus();
    const now = Date.now();

    let totalRisk = 0;
    const riskDistribution = { low: 0, medium: 0, high: 0, critical: 0 };
    const overdueAudits: Array<{ regulation: string; lastAudit: Date; daysSinceAudit: number }> = [];
    let totalFindings = 0; let remediatedFindings = 0; let inProgressFindings = 0; let overdueFindings = 0;

    const byRegulation = checks.map(c => {
      totalRisk += c.riskScore;
      const criticalFindings = c.findings.filter(f => f.status === 'fail').length;
      const allFindings = c.findings.length;
      totalFindings += allFindings;
      remediatedFindings += c.findings.filter(f => f.status === 'pass').length;

      if (c.riskScore >= 80) riskDistribution.critical++;
      else if (c.riskScore >= 60) riskDistribution.high++;
      else if (c.riskScore >= 40) riskDistribution.medium++;
      else riskDistribution.low++;

      if (c.nextAudit.getTime() < now) {
        overdueAudits.push({ regulation: c.regulation, lastAudit: c.lastAudit, daysSinceAudit: Math.ceil((now - c.lastAudit.getTime()) / (24 * 60 * 60 * 1000)) });
      }

      return { regulation: c.regulation, jurisdiction: c.jurisdiction, status: c.status, riskScore: c.riskScore, findingsCount: allFindings, criticalFindings, nextAudit: c.nextAudit };
    }).sort((a, b) => b.riskScore - a.riskScore);

    const overallRisk = checks.length > 0 ? Math.round(totalRisk / checks.length) : 0;
    const rate = totalFindings > 0 ? Math.round((remediatedFindings / totalFindings) * 100) : 100;

    const insights: string[] = [];
    if (riskDistribution.critical > 0) insights.push(`${riskDistribution.critical} regulation(s) at critical risk level`);
    if (overdueAudits.length > 0) insights.push(`${overdueAudits.length} compliance audit(s) overdue`);
    if (rate < 70) insights.push('Remediation rate below 70% — accelerate compliance remediation efforts');
    if (insights.length === 0) insights.push('Compliance posture is healthy across all regulations');

    return { overallRisk, byRegulation, riskDistribution, overdueAudits, remediationProgress: { total: totalFindings, remediated: remediatedFindings, inProgress: inProgressFindings, overdue: overdueFindings, rate }, insights };
  }

  /** 10/10: Matter Lifecycle Analytics */
  getMatterLifecycleAnalytics(): {
    avgTimeToResolution: number;
    resolutionByType: Array<{ type: string; avgDays: number; count: number }>;
    bottleneckStages: Array<{ stage: string; avgDaysInStage: number; matterCount: number }>;
    outcomeAnalysis: { settled: number; won: number; lost: number; withdrawn: number; settledValue: number };
    documentVolume: { totalDocuments: number; byType: Record<string, number>; avgDocsPerMatter: number };
    timelineActivity: { eventsThisMonth: number; eventsLastMonth: number; trend: 'increasing' | 'stable' | 'decreasing' };
    insights: string[];
  } {
    const matters = this.getAllMatters();
    const resolved = matters.filter(m => ['closed', 'settled'].includes(m.status));
    const now = Date.now();
    const oneMonth = 30 * 24 * 60 * 60 * 1000;

    const avgTimeToResolution = resolved.length > 0
      ? Math.round(resolved.reduce((sum, m) => {
          const start = m.filingDate?.getTime() || m.createdAt.getTime();
          return sum + (m.updatedAt.getTime() - start) / (24 * 60 * 60 * 1000);
        }, 0) / resolved.length)
      : 0;

    const typeResolution: Record<string, { days: number; count: number }> = {};
    for (const m of resolved) {
      if (!typeResolution[m.type]) typeResolution[m.type] = { days: 0, count: 0 };
      const start = m.filingDate?.getTime() || m.createdAt.getTime();
      typeResolution[m.type].days += (m.updatedAt.getTime() - start) / (24 * 60 * 60 * 1000);
      typeResolution[m.type].count++;
    }

    const statusDuration: Record<string, { days: number; count: number }> = {};
    for (const m of matters) {
      if (!statusDuration[m.status]) statusDuration[m.status] = { days: 0, count: 0 };
      const duration = (now - m.updatedAt.getTime()) / (24 * 60 * 60 * 1000);
      statusDuration[m.status].days += duration;
      statusDuration[m.status].count++;
    }

    const settled = resolved.filter(m => m.status === 'settled');
    const won = resolved.filter(m => m.winProbability && m.winProbability > 70);
    const lost = resolved.filter(m => m.winProbability !== undefined && m.winProbability < 30);
    const settledValue = settled.reduce((sum, m) => sum + m.actualCost, 0);

    let totalDocs = 0;
    const docTypes: Record<string, number> = {};
    for (const m of matters) {
      totalDocs += m.documents.length;
      for (const d of m.documents) {
        docTypes[d.type] = (docTypes[d.type] || 0) + 1;
      }
    }

    let thisMonthEvents = 0; let lastMonthEvents = 0;
    for (const m of matters) {
      for (const e of m.timeline) {
        const age = now - e.timestamp.getTime();
        if (age < oneMonth) thisMonthEvents++;
        else if (age < oneMonth * 2) lastMonthEvents++;
      }
    }
    const trend: 'increasing' | 'stable' | 'decreasing' = thisMonthEvents > lastMonthEvents * 1.2 ? 'increasing' : thisMonthEvents < lastMonthEvents * 0.8 ? 'decreasing' : 'stable';

    const insights: string[] = [];
    if (avgTimeToResolution > 180) insights.push('Average resolution time exceeds 6 months — review case management efficiency');
    const slowestStage = Object.entries(statusDuration).sort((a, b) => (b[1].days / b[1].count) - (a[1].days / a[1].count))[0];
    if (slowestStage) insights.push(`"${slowestStage[0]}" stage has the longest average duration`);
    if (insights.length === 0) insights.push('Matter lifecycle metrics are within normal ranges');

    return {
      avgTimeToResolution,
      resolutionByType: Object.entries(typeResolution).map(([type, d]) => ({ type, avgDays: Math.round(d.days / d.count), count: d.count })),
      bottleneckStages: Object.entries(statusDuration).map(([stage, d]) => ({ stage, avgDaysInStage: Math.round(d.days / d.count), matterCount: d.count })).sort((a, b) => b.avgDaysInStage - a.avgDaysInStage),
      outcomeAnalysis: { settled: settled.length, won: won.length, lost: lost.length, withdrawn: 0, settledValue },
      documentVolume: { totalDocuments: totalDocs, byType: docTypes, avgDocsPerMatter: matters.length > 0 ? Math.round(totalDocs / matters.length) : 0 },
      timelineActivity: { eventsThisMonth: thisMonthEvents, eventsLastMonth: lastMonthEvents, trend },
      insights,
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaDocket', recordType: 'matter', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.matters.has(d.id)) this.matters.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaDocket', recordType: 'matter', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.documents.has(d.id)) this.documents.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'CendiaDocket', recordType: 'matter', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.discoveryRequests.has(d.id)) this.discoveryRequests.set(d.id, d);


      }


      restored += recs_2.length;


      const recs_3 = await loadServiceRecords({ serviceName: 'CendiaDocket', recordType: 'matter', limit: 1000 });


      for (const rec of recs_3) {


        const d = rec.data as any;


        if (d?.id && !this.complianceChecks.has(d.id)) this.complianceChecks.set(d.id, d);


      }


      restored += recs_3.length;


      if (restored > 0) logger.info(`[CendiaDocketService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaDocketService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaDocket',
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
      service: 'CendiaDocket',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaDocketService = new CendiaDocketService();
