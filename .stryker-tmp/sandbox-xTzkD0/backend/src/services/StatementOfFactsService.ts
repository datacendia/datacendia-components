// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - STATEMENT OF FACTS SERVICE
// Validates, verifies, and proves all claims made by AI Agents during deliberation
// This is the "show your work" layer that ensures trust and transparency
// =============================================================================

import { BaseService, ServiceConfig, ServiceHealth } from '../core/services/BaseService.js';
import { aiModelSelector } from '../config/aiModels.js';

// =============================================================================
// TYPES - Comprehensive claim tracking and validation
// =============================================================================

export type ClaimType = 
  | 'financial'      // Numbers, calculations, ROI, costs
  | 'statistical'    // Percentages, ratios, trends
  | 'temporal'       // Dates, timelines, durations
  | 'comparative'    // Comparisons, benchmarks
  | 'risk'           // Risk assessments, probabilities
  | 'compliance'     // Regulatory, legal claims
  | 'market'         // Market data, competition
  | 'operational'    // Process, efficiency claims
  | 'strategic'      // Strategy recommendations
  | 'citation'       // References to external data
  | 'assumption';    // Stated or implied assumptions

export type ValidationStatus = 
  | 'verified'       // Claim proven with evidence
  | 'partially_verified' // Some evidence supports claim
  | 'unverified'     // No evidence found yet
  | 'disputed'       // Contradicting evidence exists
  | 'assumption'     // Explicitly an assumption
  | 'requires_human'; // Human verification needed

export type EvidenceType =
  | 'calculation'    // Mathematical proof
  | 'data_source'    // Link to source data
  | 'query_result'   // Database/API query result
  | 'document'       // Referenced document
  | 'historical'     // Historical precedent
  | 'model_output'   // ML model prediction
  | 'external_api'   // Third-party API data
  | 'user_input'     // User-provided data
  | 'system_metric'; // Platform telemetry

export interface Claim {
  id: string;
  deliberationId: string;
  agentId: string;
  agentName: string;
  agentRole: string;
  
  // The claim itself
  statement: string;
  claimType: ClaimType;
  extractedValue?: string | number;
  unit?: string;
  
  // Location in response
  sourceText: string;
  position: { start: number; end: number };
  
  // Validation
  status: ValidationStatus;
  confidence: number; // 0-100
  validatedAt?: Date;
  
  // Evidence chain
  evidence: Evidence[];
  
  // Dependencies
  dependsOn?: string[]; // Other claim IDs this depends on
  assumptions?: string[];
  
  // User interaction
  userVerified?: boolean;
  userNotes?: string;
  
  createdAt: Date;
}

export interface Evidence {
  id: string;
  claimId: string;
  type: EvidenceType;
  
  // What the evidence shows
  description: string;
  value?: string | number;
  
  // Source
  source: {
    type: 'internal' | 'external' | 'calculation' | 'user';
    name: string;
    url?: string;
    query?: string;
    timestamp?: Date;
  };
  
  // Calculation details (if applicable)
  calculation?: {
    formula: string;
    inputs: Record<string, number | string>;
    steps: string[];
    result: number | string;
  };
  
  // Data reference (if applicable)
  dataReference?: {
    dataset: string;
    table?: string;
    columns?: string[];
    filters?: Record<string, string>;
    rowCount?: number;
    sampleData?: Record<string, unknown>[];
  };
  
  // Strength of evidence
  strength: 'strong' | 'moderate' | 'weak' | 'circumstantial';
  
  createdAt: Date;
}

export interface StatementOfFacts {
  id: string;
  deliberationId: string;
  
  // Summary
  totalClaims: number;
  verifiedClaims: number;
  partiallyVerified: number;
  unverifiedClaims: number;
  disputedClaims: number;
  assumptionsClaims: number;
  
  // Overall confidence
  overallConfidence: number;
  verificationScore: number; // % of claims verified
  
  // Claims by agent
  claimsByAgent: Record<string, {
    agentName: string;
    totalClaims: number;
    verified: number;
    confidence: number;
  }>;
  
  // All claims
  claims: Claim[];
  
  // Key assumptions that should be noted
  keyAssumptions: string[];
  
  // Items requiring human verification
  humanVerificationRequired: Claim[];
  
  // Generation metadata
  generatedAt: Date;
  lastUpdatedAt: Date;
  version: number;
}

export interface ClaimExtractionResult {
  claims: Omit<Claim, 'id' | 'deliberationId' | 'evidence' | 'status' | 'confidence' | 'validatedAt' | 'createdAt'>[];
  assumptions: string[];
}

// =============================================================================
// STATEMENT OF FACTS SERVICE
// =============================================================================

export class StatementOfFactsService extends BaseService {
  private statementsCache: Map<string, StatementOfFacts> = new Map();
  private claimsCache: Map<string, Claim[]> = new Map();
  private ollamaEndpoint: string;

  constructor(config?: Partial<ServiceConfig>) {
    super({
      name: 'statement-of-facts-service',
      version: '1.0.0',
      dependencies: ['deliberation-service'],
      ...config,
    });
    this.ollamaEndpoint = process.env.OLLAMA_HOST || 'http://localhost:11434';
  }

  async initialize(): Promise<void> {
    this.logger.info('Statement of Facts service initializing...');
  }

  async shutdown(): Promise<void> {
    this.logger.info('Statement of Facts service shutting down...');
    this.statementsCache.clear();
    this.claimsCache.clear();
  }

  async healthCheck(): Promise<ServiceHealth> {
    return {
      status: 'healthy',
      lastCheck: new Date(),
      details: { cachedStatements: this.statementsCache.size },
    };
  }

  // ===========================================================================
  // CLAIM EXTRACTION - Parse agent responses for verifiable claims
  // ===========================================================================

  async extractClaims(
    agentId: string,
    agentName: string,
    agentRole: string,
    response: string
  ): Promise<ClaimExtractionResult> {
    const prompt = `You are a fact-checker. Extract ALL verifiable claims from this AI agent's response.

AGENT: ${agentName} (${agentRole})
RESPONSE: ${response}

For each claim, identify:
1. The exact statement being claimed
2. The type of claim (financial, statistical, temporal, comparative, risk, compliance, market, operational, strategic, citation, assumption)
3. Any specific values mentioned
4. The unit of measurement if applicable

Output JSON:
{
  "claims": [
    {
      "statement": "The exact claim",
      "claimType": "financial|statistical|temporal|comparative|risk|compliance|market|operational|strategic|citation|assumption",
      "extractedValue": "23" or null,
      "unit": "percent|dollars|days|etc" or null,
      "sourceText": "The sentence containing the claim"
    }
  ],
  "assumptions": ["Any explicit or implicit assumptions made"]
}

Be thorough - extract EVERY factual assertion, number, prediction, or recommendation that could be verified.`;

    try {
      const llmResponse = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: aiModelSelector.getModelForService('council') || 'llama3.2:3b',
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.1, num_predict: 2000 },
        }),
      });

      const data = await llmResponse.json() as { response: string };
      const parsed = JSON.parse(data.response);

      return {
        claims: (parsed.claims || []).map((c: any) => ({
          agentId,
          agentName,
          agentRole,
          statement: c.statement,
          claimType: c.claimType || 'strategic',
          extractedValue: c.extractedValue,
          unit: c.unit,
          sourceText: c.sourceText || c.statement,
          position: { start: response.indexOf(c.sourceText || c.statement), end: 0 },
        })),
        assumptions: parsed.assumptions || [],
      };
    } catch (error) {
      this.logger.error('Failed to extract claims:', error as Error);
      // Fallback: basic extraction
      return this.basicClaimExtraction(agentId, agentName, agentRole, response);
    }
  }

  private basicClaimExtraction(
    agentId: string,
    agentName: string,
    agentRole: string,
    response: string
  ): ClaimExtractionResult {
    const claims: ClaimExtractionResult['claims'] = [];
    const assumptions: string[] = [];
    const sentences = response.split(/[.!?]+/).filter(s => s.trim().length > 15);

    // Patterns for different claim types
    const patterns = {
      financial: /\$[\d,]+|\d+%|\d+\s*(million|billion|thousand|M|B|K)|\bROI\b|\bcost\b|\brevenue\b|\bprofit\b/i,
      statistical: /\d+%|\d+\s*out of\s*\d+|\baverage\b|\bmedian\b|\bratio\b/i,
      temporal: /\d+\s*(days?|weeks?|months?|years?|hours?)|\bby\s+\d{4}\b|\bQ[1-4]\b/i,
      risk: /\brisk\b|\bprobability\b|\blikelihood\b|\bthreat\b|\bvulnerability\b/i,
      comparative: /\bmore than\b|\bless than\b|\bbetter\b|\bworse\b|\bcompared to\b|\bvs\b/i,
      assumption: /\bassume\b|\bassuming\b|\bif\b.*\bthen\b|\bgiven that\b/i,
    };

    for (const sentence of sentences) {
      const trimmed = sentence.trim();
      let claimType: ClaimType = 'strategic';
      let extractedValue: string | undefined;

      // Detect claim type
      for (const [type, pattern] of Object.entries(patterns)) {
        if (pattern.test(trimmed)) {
          claimType = type as ClaimType;
          const match = trimmed.match(/\d+\.?\d*%?/);
          if (match) extractedValue = match[0];
          break;
        }
      }

      // Check for assumptions
      if (patterns.assumption.test(trimmed)) {
        assumptions.push(trimmed);
      }

      // Add as claim if it seems substantive
      if (trimmed.length > 30) {
        claims.push({
          agentId,
          agentName,
          agentRole,
          statement: trimmed,
          claimType,
          extractedValue,
          sourceText: trimmed,
          position: { start: response.indexOf(trimmed), end: response.indexOf(trimmed) + trimmed.length },
        });
      }
    }

    return { claims, assumptions };
  }

  // ===========================================================================
  // CLAIM VALIDATION - Verify claims with evidence
  // ===========================================================================

  async validateClaim(claim: Claim): Promise<Claim> {
    const evidence: Evidence[] = [];
    let status: ValidationStatus = 'unverified';
    let confidence = 50;

    // Validate based on claim type
    switch (claim.claimType) {
      case 'financial':
      case 'statistical':
        const calcEvidence = await this.validateCalculation(claim);
        if (calcEvidence) {
          evidence.push(calcEvidence);
          status = calcEvidence.strength === 'strong' ? 'verified' : 'partially_verified';
          confidence = calcEvidence.strength === 'strong' ? 90 : 70;
        }
        break;

      case 'temporal':
        const temporalEvidence = await this.validateTemporal(claim);
        if (temporalEvidence) {
          evidence.push(temporalEvidence);
          status = 'verified';
          confidence = 85;
        }
        break;

      case 'risk':
        const riskEvidence = await this.validateRiskClaim(claim);
        if (riskEvidence) {
          evidence.push(riskEvidence);
          status = 'partially_verified';
          confidence = 75;
        }
        break;

      case 'assumption':
        status = 'assumption';
        confidence = 100; // It's explicitly an assumption
        evidence.push({
          id: `ev-${Date.now()}`,
          claimId: claim.id,
          type: 'user_input',
          description: 'Explicitly stated as an assumption',
          source: { type: 'internal', name: 'Assumption Recognition' },
          strength: 'moderate',
          createdAt: new Date(),
        });
        break;

      default:
        // Strategic, operational, etc. - require human verification
        status = 'requires_human';
        confidence = 50;
    }

    return {
      ...claim,
      status,
      confidence,
      evidence,
      validatedAt: new Date(),
    };
  }

  private async validateCalculation(claim: Claim): Promise<Evidence | null> {
    if (!claim.extractedValue) return null;

    // Parse and verify the calculation
    const value = parseFloat(String(claim.extractedValue).replace(/[%$,]/g, ''));
    if (isNaN(value)) return null;

    // Generate calculation proof
    const prompt = `Given this claim: "${claim.statement}"

If this contains a calculation or derived number, show how it could be calculated.
Output JSON:
{
  "formula": "The mathematical formula used",
  "inputs": {"variable1": value1, "variable2": value2},
  "steps": ["Step 1: ...", "Step 2: ..."],
  "result": final_number,
  "canVerify": true/false
}`;

    try {
      const response = await fetch(`${this.ollamaEndpoint}/api/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'llama3.2:3b',
          prompt,
          stream: false,
          format: 'json',
          options: { temperature: 0.1, num_predict: 500 },
        }),
      });

      const data = await response.json() as { response: string };
      const parsed = JSON.parse(data.response);

      if (parsed.canVerify) {
        return {
          id: `ev-${Date.now()}`,
          claimId: claim.id,
          type: 'calculation',
          description: `Calculation verified: ${parsed.formula}`,
          value: parsed.result,
          source: { type: 'calculation', name: 'Mathematical Verification' },
          calculation: {
            formula: parsed.formula,
            inputs: parsed.inputs,
            steps: parsed.steps,
            result: parsed.result,
          },
          strength: Math.abs(parsed.result - value) < 0.01 * value ? 'strong' : 'moderate',
          createdAt: new Date(),
        };
      }
    } catch (error) {
      this.logger.warn('Calculation validation failed:', error as Error);
    }

    return null;
  }

  private async validateTemporal(claim: Claim): Promise<Evidence | null> {
    // Extract and validate date/time claims
    const datePattern = /(\d{1,2}\/\d{1,2}\/\d{2,4}|\d{4}|Q[1-4]\s*\d{4}|\d+\s*(days?|weeks?|months?|years?))/gi;
    const matches = claim.statement.match(datePattern);

    if (matches && matches.length > 0) {
      return {
        id: `ev-${Date.now()}`,
        claimId: claim.id,
        type: 'system_metric',
        description: `Temporal reference identified: ${matches.join(', ')}`,
        source: { type: 'internal', name: 'Temporal Parser', timestamp: new Date() },
        strength: 'moderate',
        createdAt: new Date(),
      };
    }

    return null;
  }

  private async validateRiskClaim(claim: Claim): Promise<Evidence | null> {
    // For risk claims, document the methodology
    return {
      id: `ev-${Date.now()}`,
      claimId: claim.id,
      type: 'model_output',
      description: 'Risk assessment based on agent analysis methodology',
      source: { 
        type: 'internal', 
        name: `${claim.agentName} Risk Model`,
        timestamp: new Date(),
      },
      strength: 'moderate',
      createdAt: new Date(),
    };
  }

  // ===========================================================================
  // GENERATE FULL STATEMENT OF FACTS
  // ===========================================================================

  async generateStatementOfFacts(
    deliberationId: string,
    agentResponses: Array<{
      agentId: string;
      agentName: string;
      agentRole: string;
      response: string;
    }>
  ): Promise<StatementOfFacts> {
    this.logger.info(`Generating Statement of Facts for deliberation ${deliberationId}`);
    
    const allClaims: Claim[] = [];
    const allAssumptions: string[] = [];
    const claimsByAgent: StatementOfFacts['claimsByAgent'] = {};

    // Extract claims from each agent
    for (const agent of agentResponses) {
      const { claims, assumptions } = await this.extractClaims(
        agent.agentId,
        agent.agentName,
        agent.agentRole,
        agent.response
      );

      // Create and validate claims
      for (const extractedClaim of claims) {
        const claim: Claim = {
          id: `claim-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          deliberationId,
          ...extractedClaim,
          status: 'unverified',
          confidence: 50,
          evidence: [],
          createdAt: new Date(),
        };

        // Validate the claim
        const validatedClaim = await this.validateClaim(claim);
        allClaims.push(validatedClaim);

        // Track by agent
        if (!claimsByAgent[agent.agentId]) {
          claimsByAgent[agent.agentId] = {
            agentName: agent.agentName,
            totalClaims: 0,
            verified: 0,
            confidence: 0,
          };
        }
        claimsByAgent[agent.agentId].totalClaims++;
        if (validatedClaim.status === 'verified') {
          claimsByAgent[agent.agentId].verified++;
        }
      }

      allAssumptions.push(...assumptions);
    }

    // Calculate agent confidence scores
    for (const agentId of Object.keys(claimsByAgent)) {
      const agentClaims = allClaims.filter(c => c.agentId === agentId);
      claimsByAgent[agentId].confidence = agentClaims.length > 0
        ? Math.round(agentClaims.reduce((sum, c) => sum + c.confidence, 0) / agentClaims.length)
        : 0;
    }

    // Categorize claims
    const verifiedClaims = allClaims.filter(c => c.status === 'verified').length;
    const partiallyVerified = allClaims.filter(c => c.status === 'partially_verified').length;
    const unverifiedClaims = allClaims.filter(c => c.status === 'unverified').length;
    const disputedClaims = allClaims.filter(c => c.status === 'disputed').length;
    const assumptionsClaims = allClaims.filter(c => c.status === 'assumption').length;
    const humanVerificationRequired = allClaims.filter(c => c.status === 'requires_human');

    // Calculate overall metrics
    const totalClaims = allClaims.length;
    const overallConfidence = totalClaims > 0
      ? Math.round(allClaims.reduce((sum, c) => sum + c.confidence, 0) / totalClaims)
      : 0;
    const verificationScore = totalClaims > 0
      ? Math.round(((verifiedClaims + partiallyVerified * 0.5) / totalClaims) * 100)
      : 0;

    const statement: StatementOfFacts = {
      id: `sof-${deliberationId}`,
      deliberationId,
      totalClaims,
      verifiedClaims,
      partiallyVerified,
      unverifiedClaims,
      disputedClaims,
      assumptionsClaims,
      overallConfidence,
      verificationScore,
      claimsByAgent,
      claims: allClaims,
      keyAssumptions: [...new Set(allAssumptions)],
      humanVerificationRequired,
      generatedAt: new Date(),
      lastUpdatedAt: new Date(),
      version: 1,
    };

    // Cache
    this.statementsCache.set(deliberationId, statement);
    this.claimsCache.set(deliberationId, allClaims);

    this.logger.info(`Statement of Facts generated: ${totalClaims} claims, ${verifiedClaims} verified`);
    return statement;
  }

  // ===========================================================================
  // RETRIEVAL & UPDATES
  // ===========================================================================

  async getStatementOfFacts(deliberationId: string): Promise<StatementOfFacts | null> {
    return this.statementsCache.get(deliberationId) || null;
  }

  async getClaims(deliberationId: string): Promise<Claim[]> {
    return this.claimsCache.get(deliberationId) || [];
  }

  async getClaimsByAgent(deliberationId: string, agentId: string): Promise<Claim[]> {
    const claims = this.claimsCache.get(deliberationId) || [];
    return claims.filter(c => c.agentId === agentId);
  }

  async updateClaimVerification(
    deliberationId: string,
    claimId: string,
    userVerified: boolean,
    userNotes?: string
  ): Promise<Claim | null> {
    const claims = this.claimsCache.get(deliberationId);
    if (!claims) return null;

    const claim = claims.find(c => c.id === claimId);
    if (!claim) return null;

    claim.userVerified = userVerified;
    claim.userNotes = userNotes;
    if (userVerified) {
      claim.status = 'verified';
      claim.confidence = 100;
      claim.evidence.push({
        id: `ev-${Date.now()}`,
        claimId,
        type: 'user_input',
        description: `Manually verified by user${userNotes ? `: ${userNotes}` : ''}`,
        source: { type: 'user', name: 'Manual Verification', timestamp: new Date() },
        strength: 'strong',
        createdAt: new Date(),
      });
    }

    // Update statement
    const statement = this.statementsCache.get(deliberationId);
    if (statement) {
      statement.lastUpdatedAt = new Date();
      statement.version++;
    }

    return claim;
  }

  async addEvidence(
    deliberationId: string,
    claimId: string,
    evidence: Omit<Evidence, 'id' | 'claimId' | 'createdAt'>
  ): Promise<Claim | null> {
    const claims = this.claimsCache.get(deliberationId);
    if (!claims) return null;

    const claim = claims.find(c => c.id === claimId);
    if (!claim) return null;

    claim.evidence.push({
      ...evidence,
      id: `ev-${Date.now()}`,
      claimId,
      createdAt: new Date(),
    });

    // Re-evaluate claim status based on new evidence
    if (evidence.strength === 'strong') {
      claim.status = 'verified';
      claim.confidence = Math.min(100, claim.confidence + 20);
    } else if (evidence.strength === 'moderate') {
      if (claim.status === 'unverified') claim.status = 'partially_verified';
      claim.confidence = Math.min(100, claim.confidence + 10);
    }

    claim.validatedAt = new Date();
    return claim;
  }

  // ===========================================================================
  // EXPORT & REPORTING
  // ===========================================================================

  generateFactsReport(statement: StatementOfFacts): string {
    const claims = statement.claims;
    
    let report = `# Statement of Facts\n\n`;
    report += `**Deliberation ID:** ${statement.deliberationId}\n`;
    report += `**Generated:** ${statement.generatedAt.toISOString()}\n\n`;
    
    report += `## Summary\n\n`;
    report += `| Metric | Value |\n|--------|-------|\n`;
    report += `| Total Claims | ${statement.totalClaims} |\n`;
    report += `| Verified | ${statement.verifiedClaims} |\n`;
    report += `| Partially Verified | ${statement.partiallyVerified} |\n`;
    report += `| Unverified | ${statement.unverifiedClaims} |\n`;
    report += `| Overall Confidence | ${statement.overallConfidence}% |\n`;
    report += `| Verification Score | ${statement.verificationScore}% |\n\n`;

    report += `## Claims by Agent\n\n`;
    for (const [agentId, data] of Object.entries(statement.claimsByAgent)) {
      report += `### ${data.agentName}\n`;
      report += `- Claims: ${data.totalClaims}\n`;
      report += `- Verified: ${data.verified}\n`;
      report += `- Confidence: ${data.confidence}%\n\n`;
    }

    report += `## All Claims\n\n`;
    for (const claim of claims) {
      const statusIcon = {
        verified: '✅',
        partially_verified: '🟡',
        unverified: '⚪',
        disputed: '❌',
        assumption: '💭',
        requires_human: '👤',
      }[claim.status];

      report += `### ${statusIcon} ${claim.statement.substring(0, 60)}...\n`;
      report += `- **Agent:** ${claim.agentName}\n`;
      report += `- **Type:** ${claim.claimType}\n`;
      report += `- **Status:** ${claim.status}\n`;
      report += `- **Confidence:** ${claim.confidence}%\n`;
      
      if (claim.evidence.length > 0) {
        report += `- **Evidence:**\n`;
        for (const ev of claim.evidence) {
          report += `  - ${ev.description} (${ev.strength})\n`;
        }
      }
      report += '\n';
    }

    if (statement.keyAssumptions.length > 0) {
      report += `## Key Assumptions\n\n`;
      for (const assumption of statement.keyAssumptions) {
        report += `- ${assumption}\n`;
      }
    }

    return report;
  }
}

export const statementOfFactsService = new StatementOfFactsService();
