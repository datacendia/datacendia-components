// @ts-nocheck
// =============================================================================
// CENDIADOCKET™ - LEGAL OPERATIONS INTELLIGENCE
// "The Litigation Engine" - AI-powered legal analysis and case management
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

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
  }

  // ---------------------------------------------------------------------------
  // MATTER MANAGEMENT
  // ---------------------------------------------------------------------------

  createMatter(matter: Omit<LegalMatter, 'id' | 'documents' | 'timeline' | 'actualCost' | 'createdAt' | 'updatedAt'>): LegalMatter {
    const newMatter: LegalMatter = {
      ...matter,
      id: `matter-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
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
}

// Export singleton instance
export const cendiaDocketService = new CendiaDocketService();
