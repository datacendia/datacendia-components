/**
 * Service — Cendia Panopticon Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports CendiaPanopticonService, REGULATORY_FRAMEWORKS, cendiaPanopticonService, RegulationFramework, Obligation, ComplianceGap, ViolationAlert, RegulatoryForecast
 * @module services/CendiaPanopticonService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPanopticon™ - Global Regulation Engine
 * 
 * "Every new regulation, absorbed and enforced."
 * 
 * Capabilities:
 * - Regulation Ingestion: Parse NIST, EU AI Act, Basel, DORA, SOX, HIPAA
 * - Obligation Mapping: Connect requirements to controls
 * - System Alignment: Map obligations to data flows and processes
 * - Violation Detection: Alert when processes violate rules
 * - Risk Forecasting: Predict emerging regulatory threats
 * - Policy Coordination: Update policies across Ethics, Veto, Flow, Ledger
 * 
 * Coverage: 200+ regulatory frameworks across 50+ jurisdictions
 */

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import { EnhancedLLMService } from './EnhancedLLMService.js';

// =============================================================================
// TYPES
// =============================================================================


import { REGULATORY_FRAMEWORKS, DEFAULT_RADAR_EVENTS, DEFAULT_AI_SUMMARY, DEFAULT_AI_ACTIONS } from './panopticon-svc-types.js';
import type { RegulationFramework, ComplianceGap, ViolationAlert, RegulatoryForecast, RegulatoryRadarEvent } from './panopticon-svc-types.js';
export { REGULATORY_FRAMEWORKS } from './panopticon-svc-types.js';
export type { RegulationFramework, Obligation, ComplianceGap, ViolationAlert, RegulatoryForecast } from './panopticon-svc-types.js';


export class CendiaPanopticonService {
  private llmService: EnhancedLLMService;

  constructor() {
    this.llmService = new EnhancedLLMService();
  }

  // ===========================================================================
  // REGULATION MANAGEMENT
  // ===========================================================================

  /**
   * Get all supported regulatory frameworks
   */
  async getFrameworks(): Promise<RegulationFramework[]> {
    return REGULATORY_FRAMEWORKS;
  }

  /**
   * Get frameworks by category
   */
  async getFrameworksByCategory(category: string): Promise<RegulationFramework[]> {
    return REGULATORY_FRAMEWORKS.filter(f => 
      f.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Get frameworks by jurisdiction
   */
  async getFrameworksByJurisdiction(jurisdiction: string): Promise<RegulationFramework[]> {
    return REGULATORY_FRAMEWORKS.filter(f => 
      f.jurisdiction.toLowerCase().includes(jurisdiction.toLowerCase())
    );
  }

  /**
   * Ingest a regulation into the system
   */
  async ingestRegulation(
    organizationId: string,
    frameworkCode: string,
    version: string = '1.0',
    sourceUrl?: string
  ): Promise<any> {
    const framework = REGULATORY_FRAMEWORKS.find(f => f.code === frameworkCode);
    if (!framework) {
      throw new Error(`Unknown framework: ${frameworkCode}`);
    }

    // Check if already exists
    const existing = await prisma.panopticon_regulations.findFirst({
      where: {
        organization_id: organizationId,
        framework_code: frameworkCode,
        version,
      },
    });

    if (existing) {
      return existing;
    }

    // Parse and structure the regulation using LLM
    const parsedContent = await this.parseRegulationContent(framework);

    // Create regulation record
    const regulation = await prisma.panopticon_regulations.create({
      data: {
        organization_id: organizationId,
        framework_code: frameworkCode,
        framework_name: framework.name,
        jurisdiction: framework.jurisdiction,
        version,
        source_url: sourceUrl,
        parsed_content: parsedContent,
        status: 'ACTIVE',
      },
    });

    // Generate obligations from the framework
    await this.generateObligations(regulation.id, framework, parsedContent);

    logger.info(`Ingested regulation: ${frameworkCode} v${version} for org ${organizationId}`);

    return regulation;
  }

  /**
   * Parse regulation content using LLM
   */
  private async parseRegulationContent(framework: RegulationFramework): Promise<any> {
    const prompt = `Analyze the regulatory framework "${framework.name}" (${framework.code}) from ${framework.jurisdiction}.

Category: ${framework.category}
Description: ${framework.description}

Generate a structured analysis including:
1. Key compliance areas (3-5 main areas)
2. Critical requirements summary
3. Common compliance challenges
4. Integration points with other regulations

Respond in JSON format with keys: complianceAreas, criticalRequirements, challenges, integrations`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a regulatory compliance expert. Provide accurate, structured analysis.',
        temperature: 0.3,
        maxTokens: 500,
        format: 'json',
      });

      return JSON.parse(response);
    } catch (error) {
      logger.error('Failed to parse regulation content:', error);
      return {
        complianceAreas: [framework.category],
        criticalRequirements: [framework.description],
        challenges: ['Implementation complexity'],
        integrations: [],
      };
    }
  }

  /**
   * Generate obligations from framework
   */
  private async generateObligations(
    regulationId: string,
    framework: RegulationFramework,
    _parsedContent: any
  ): Promise<void> {
    const prompt = `Generate ${Math.min(framework.requirements, 10)} key compliance obligations for ${framework.name} (${framework.code}).

For each obligation, provide:
1. A unique code (e.g., ${framework.code}-001)
2. Title
3. Description
4. Requirement type (MANDATORY/RECOMMENDED/OPTIONAL/CONDITIONAL)
5. Priority (CRITICAL/HIGH/MEDIUM/LOW)
6. Required controls (list of control names)
7. Evidence required (list of documents/artifacts)

Respond as JSON array with these fields: code, title, description, requirementType, priority, controls, evidenceRequired`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a compliance expert. Generate realistic, accurate compliance obligations.',
        temperature: 0.4,
        maxTokens: 1000,
        format: 'json',
      });

      const obligations = JSON.parse(response);

      for (const obl of obligations) {
        await prisma.panopticon_obligations.create({
          data: {
            regulation_id: regulationId,
            obligation_code: obl.code || `${framework.code}-${Date.now()}`,
            title: obl.title || 'Compliance Requirement',
            description: obl.description || framework.description,
            requirement_type: obl.requirementType || 'MANDATORY',
            priority: obl.priority || 'MEDIUM',
            controls: obl.controls || [],
            evidence_required: obl.evidenceRequired || [],
            automation_status: 'MANUAL',
          },
        });
      }
    } catch (error) {
      logger.error('Failed to generate obligations:', error);
      // Create a default obligation
      await prisma.panopticon_obligations.create({
        data: {
          regulation_id: regulationId,
          obligation_code: `${framework.code}-DEFAULT`,
          title: `${framework.name} Compliance`,
          description: framework.description,
          requirement_type: 'MANDATORY',
          priority: 'HIGH',
          controls: [],
          evidence_required: [],
          automation_status: 'MANUAL',
        },
      });
    }
  }

  /**
   * Get organization's active regulations
   */
  async getOrganizationRegulations(organizationId: string): Promise<any[]> {
    return prisma.panopticon_regulations.findMany({
      where: {
        organization_id: organizationId,
        status: 'ACTIVE',
      },
      include: {
        obligations: true,
        violations: {
          where: { status: 'OPEN' },
        },
      },
      orderBy: { framework_code: 'asc' },
    });
  }

  // ===========================================================================
  // COMPLIANCE ALIGNMENT
  // ===========================================================================

  /**
   * Map obligations to organizational entities
   */
  async mapObligation(
    obligationId: string,
    entityType: string,
    entityId: string,
    entityName: string
  ): Promise<any> {
    // Assess alignment using LLM
    const obligation = await prisma.panopticon_obligations.findUnique({
      where: { id: obligationId },
      include: { regulation: true },
    });

    if (!obligation) {
      throw new Error('Obligation not found');
    }

    const alignmentScore = await this.assessAlignment(obligation, entityType, entityName);

    return prisma.panopticon_alignments.create({
      data: {
        obligation_id: obligationId,
        entity_type: entityType,
        entity_id: entityId,
        entity_name: entityName,
        alignment_score: alignmentScore.score,
        gap_analysis: alignmentScore.gaps,
        remediation_plan: alignmentScore.remediation,
      },
    });
  }

  /**
   * Assess alignment between obligation and entity
   */
  private async assessAlignment(
    obligation: any,
    entityType: string,
    entityName: string
  ): Promise<{ score: number; gaps: any; remediation: any }> {
    const prompt = `Assess compliance alignment between:

Obligation: ${obligation.title}
Description: ${obligation.description}
Requirements: ${JSON.stringify(obligation.controls)}

Entity: ${entityName} (${entityType})

Rate alignment 0-100 and identify:
1. Gaps (what's missing)
2. Remediation steps (how to fix)

Respond as JSON with: score, gaps (array), remediation (array of steps)`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a compliance auditor. Provide realistic assessments.',
        temperature: 0.3,
        maxTokens: 400,
        format: 'json',
      });

      return JSON.parse(response);
    } catch (error) {
      return {
        score: 50,
        gaps: ['Assessment pending'],
        remediation: ['Manual review required'],
      };
    }
  }

  /**
   * Get compliance gaps for organization
   */
  async getComplianceGaps(organizationId: string): Promise<ComplianceGap[]> {
    const alignments = await prisma.panopticon_alignments.findMany({
      where: {
        obligation: {
          regulation: {
            organization_id: organizationId,
          },
        },
        alignment_score: { lt: 70 },
      },
      include: {
        obligation: true,
      },
      orderBy: { alignment_score: 'asc' },
    });

    return alignments.map(a => ({
      obligationId: a.obligation_id,
      obligationTitle: a.obligation.title,
      entityType: a.entity_type,
      entityName: a.entity_name,
      alignmentScore: a.alignment_score,
      gaps: (a.gap_analysis as any)?.gaps || [],
      remediationSteps: (a.remediation_plan as any)?.remediation || [],
    }));
  }

  // ===========================================================================
  // VIOLATION DETECTION
  // ===========================================================================

  /**
   * Detect violations based on process data
   */
  async detectViolations(
    organizationId: string,
    processData: any
  ): Promise<ViolationAlert[]> {
    const regulations = await this.getOrganizationRegulations(organizationId);
    const violations: ViolationAlert[] = [];

    for (const reg of regulations) {
      for (const obl of reg.obligations) {
        const violation = await this.checkForViolation(obl, processData);
        if (violation) {
          const saved = await prisma.panopticon_violations.create({
            data: {
              organization_id: organizationId,
              regulation_id: reg.id,
              obligation_id: obl.id,
              violation_type: violation.type,
              severity: violation.severity,
              title: violation.title,
              description: violation.description,
              affected_entities: violation.affectedEntities,
              evidence: violation.evidence,
              status: 'OPEN',
            },
          });

          violations.push({
            id: saved.id,
            regulationCode: reg.framework_code,
            obligationCode: obl.obligation_code,
            title: violation.title,
            description: violation.description,
            severity: violation.severity,
            affectedEntities: violation.affectedEntities,
            detectedAt: saved.detected_at,
          });
        }
      }
    }

    return violations;
  }

  /**
   * Check if process data violates an obligation
   */
  private async checkForViolation(
    obligation: any,
    processData: any
  ): Promise<any | null> {
    const prompt = `Check if this process violates the compliance obligation:

Obligation: ${obligation.title}
Description: ${obligation.description}
Requirement Type: ${obligation.requirement_type}

Process Data:
${JSON.stringify(processData, null, 2)}

If violation detected, respond with JSON:
{
  "violated": true,
  "type": "PROCESS_VIOLATION|DATA_VIOLATION|DOCUMENTATION_GAP|TIMELINE_BREACH|CONTROL_FAILURE",
  "severity": "CRITICAL|HIGH|MEDIUM|LOW",
  "title": "Brief title",
  "description": "What was violated and why",
  "affectedEntities": ["list of affected items"],
  "evidence": {"key evidence points"}
}

If no violation, respond: {"violated": false}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a compliance auditor detecting regulatory violations.',
        temperature: 0.2,
        maxTokens: 400,
        format: 'json',
      });

      const result = JSON.parse(response);
      return result.violated ? result : null;
    } catch (error) {
      logger.error('Violation check failed:', error);
      return null;
    }
  }

  /**
   * Get open violations for organization
   */
  async getOpenViolations(organizationId: string): Promise<any[]> {
    return prisma.panopticon_violations.findMany({
      where: {
        organization_id: organizationId,
        status: { in: ['OPEN', 'INVESTIGATING', 'REMEDIATION'] },
      },
      include: {
        regulation: true,
        obligation: true,
      },
      orderBy: [{ severity: 'asc' }, { detected_at: 'desc' }],
    });
  }

  /**
   * Resolve a violation
   */
  async resolveViolation(
    violationId: string,
    resolution: string,
    resolvedBy: string
  ): Promise<any> {
    return prisma.panopticon_violations.update({
      where: { id: violationId },
      data: {
        status: 'RESOLVED',
        resolution,
        resolved_at: new Date(),
        resolved_by: resolvedBy,
      },
    });
  }

  // ===========================================================================
  // REGULATORY FORECASTING
  // ===========================================================================

  /**
   * Generate regulatory forecasts
   */
  async generateForecasts(organizationId: string): Promise<RegulatoryForecast[]> {
    const regulations = await this.getOrganizationRegulations(organizationId);
    const frameworks = regulations.map(r => r.framework_code);

    const prompt = `Based on current regulatory trends, forecast upcoming changes affecting these frameworks:
${frameworks.join(', ')}

Generate 3-5 forecasts including:
1. New regulations expected
2. Amendments to existing regulations
3. Enforcement trends
4. Industry-specific changes

For each forecast provide:
- title: Brief title
- description: What's expected
- forecastType: NEW_REGULATION|AMENDMENT|ENFORCEMENT_ACTION|INDUSTRY_TREND|GEOPOLITICAL
- probability: 0-1 likelihood
- impactScore: 0-100 impact
- horizonDays: Days until expected
- affectedFrameworks: Which frameworks affected
- recommendedActions: What to do now

Respond as JSON array.`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a regulatory intelligence analyst forecasting compliance trends.',
        temperature: 0.5,
        maxTokens: 800,
        format: 'json',
      });

      const forecasts = JSON.parse(response);
      const savedForecasts: RegulatoryForecast[] = [];

      for (const f of forecasts) {
        const saved = await prisma.panopticon_forecasts.create({
          data: {
            organization_id: organizationId,
            forecast_type: f.forecastType || 'INDUSTRY_TREND',
            title: f.title,
            description: f.description,
            source: 'AI Analysis',
            probability: f.probability || 0.5,
            impact_score: f.impactScore || 50,
            affected_frameworks: f.affectedFrameworks || [],
            recommended_actions: f.recommendedActions || [],
            horizon_days: f.horizonDays || 180,
            confidence: 0.7,
          },
        });

        savedForecasts.push({
          id: saved.id,
          title: saved.title,
          description: saved.description,
          forecastType: saved.forecast_type,
          probability: saved.probability,
          impactScore: saved.impact_score,
          horizonDays: saved.horizon_days,
          affectedFrameworks: saved.affected_frameworks as string[],
          recommendedActions: saved.recommended_actions as string[],
        });
      }

      return savedForecasts;
    } catch (error) {
      logger.error('Forecast generation failed:', error);
      return [];
    }
  }

  /**
   * Get forecasts for organization
   */
  async getForecasts(organizationId: string): Promise<any[]> {
    return prisma.panopticon_forecasts.findMany({
      where: { organization_id: organizationId },
      orderBy: [{ impact_score: 'desc' }, { probability: 'desc' }],
    });
  }

  async getRegulatoryRadar(
    organizationId: string,
    options?: { perspective?: string },
  ): Promise<{ events: RegulatoryRadarEvent[]; summary: string; actions: string[] }> {
    const regulations = await this.getOrganizationRegulations(organizationId);
    const forecasts = await this.getForecasts(organizationId);
    const openViolations = await this.getOpenViolations(organizationId);

    const org = await prisma.organizations.findUnique({ where: { id: organizationId } });

    const activeFrameworks = [...new Set(regulations.map((r: any) => r.framework_code))];

    const highImpactForecasts = (forecasts || [])
      .filter((f: any) =>
        (typeof f.probability === 'number' ? f.probability : 0.5) >= 0.6 &&
        (typeof f.horizon_days === 'number' ? f.horizon_days : 365) <= 180
      )
      .slice(0, 8);

    const criticalViolations = (openViolations || []).filter((v: any) => v.severity === 'CRITICAL');

    const contextLines = highImpactForecasts
      .map((f: any, idx: number) => {
        const type = f.forecast_type || 'TREND';
        const prob = typeof f.probability === 'number' ? f.probability.toFixed(2) : '0.50';
        const impact = typeof f.impact_score === 'number' ? f.impact_score : 50;
        const horizon = typeof f.horizon_days === 'number' ? f.horizon_days : 90;
        return `- [${idx + 1}] ${f.title || 'Forecast'} (${type}), prob=${prob}, impact=${impact}, horizon_days=${horizon}`;
      })
      .join('\n');

    const industry = org?.industry || 'Unknown';
    const companySize = org?.company_size || 'Unknown';
    const settings: any = org ? (org as any).settings : undefined;

    let primaryRegions: string[] = [];
    if (settings && typeof settings === 'object') {
      if (Array.isArray(settings.regions)) {
        primaryRegions = settings.regions.map((r: any) => String(r));
      } else if (typeof settings.primaryRegion === 'string') {
        primaryRegions = [settings.primaryRegion];
      } else if (typeof settings.region === 'string') {
        primaryRegions = [settings.region];
      }
    }

    const frameworkRegions = REGULATORY_FRAMEWORKS
      .filter(f => activeFrameworks.includes(f.code))
      .map(f => f.jurisdiction);

    const allRegionsSet = new Set<string>([...frameworkRegions, ...primaryRegions]);
    const regionsText = [...allRegionsSet].filter(Boolean).join(', ') || 'Global';

    let settingsSnippet = '';
    if (settings && typeof settings === 'object') {
      try {
        settingsSnippet = JSON.stringify(settings).slice(0, 400);
      } catch {
        settingsSnippet = '';
      }
    }

    const perspective = (options?.perspective || 'board').toLowerCase();
    const isBoardView = perspective === 'board';

    const orgProfileLines = [
      `Name: ${org?.name || 'Unknown'}`,
      `Industry: ${industry}`,
      `Company size: ${companySize}`,
      `Primary jurisdictions/regions: ${regionsText}`,
    ];
    if (settingsSnippet) {
      orgProfileLines.push(`Key settings (truncated JSON): ${settingsSnippet}`);
    }
    const orgProfile = orgProfileLines.join('\n');

    const viewLabel = isBoardView ? 'BOARD (executive / board-level summary)' : 'OPERATOR (compliance & operations team)';

    const taskLines = isBoardView
      ? [
          '1. Propose 3-6 upcoming regulatory changes that are most material to this organization in the next 90 days (board-level significance).',
          '2. Emphasize financial, regulatory, and reputational exposure and key decision deadlines.',
          '3. Set impact to LOW, MEDIUM, HIGH, or CRITICAL from a board/executive perspective.',
          '4. Keep events concise but clear enough for board discussion.',
          '5. In actions, focus on high-leverage moves (what the board/C-suite must ensure happens).',
        ]
      : [
          '1. Propose 4-8 upcoming regulatory changes that require concrete operational work in the next 90 days.',
          '2. For each event, set window based on when teams must start execution (now, 30, 60, or 90 days).',
          '3. Set impact to LOW, MEDIUM, HIGH, or CRITICAL from an operational risk/workload perspective.',
          '4. In actions, be specific about steps, owners, and near-term tasks for compliance/operations teams.',
          '5. Prefer frameworks already active for this org; only add new ones if clearly urgent.',
        ];

    const prompt = `You are a regulatory intelligence assistant for a global enterprise.\n\n` +
      `VIEW: ${viewLabel}\n\n` +
      `ORGANIZATION PROFILE:\n${orgProfile}\n\n` +
      `ACTIVE FRAMEWORKS (by code): ${activeFrameworks.join(', ') || 'None yet'}\n` +
      `OPEN CRITICAL VIOLATIONS: ${criticalViolations.length}\n\n` +
      `HIGH-IMPACT FORECASTS (next 180 days):\n${contextLines || '- (none)'}\n\n` +
      `TASK:\n${taskLines.join('\n')}\n\n` +
      `Respond ONLY in valid JSON with this exact shape (no markdown, no commentary):\n` +
      `{"events":[{"id":"string","title":"string","framework":"string","jurisdiction":"string","window":"now|30|60|90","impact":"LOW|MEDIUM|HIGH|CRITICAL","effectiveDate":"string","description":"string"}],"summary":"string","actions":["string"]}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a global regulatory intelligence assistant. Respond only with valid JSON matching the requested schema.',
        temperature: 0.4,
        maxTokens: 900,
        format: 'json',
      });

      let parsed: any;
      try {
        parsed = JSON.parse(response);
      } catch {
        parsed = {};
      }

      const rawEvents = Array.isArray(parsed.events) ? parsed.events : [];

      const mappedEvents: RegulatoryRadarEvent[] = rawEvents.map((e: any, index: number) => {
        const windowValues: Array<RegulatoryRadarEvent['window']> = ['now', '30', '60', '90'];
        const impactValues: Array<RegulatoryRadarEvent['impact']> = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

        const windowValue = windowValues.includes(e.window) ? e.window : '60';
        const impactValue = impactValues.includes(e.impact) ? e.impact : 'MEDIUM';

        return {
          id: String(e.id || `event-${index + 1}`),
          title: String(e.title || 'Regulatory change'),
          framework: String(e.framework || (activeFrameworks[0] || 'GDPR')),
          jurisdiction: String(e.jurisdiction || 'EU'),
          window: windowValue,
          impact: impactValue,
          effectiveDate: String(e.effectiveDate || e.effective_date || 'Within 90 days'),
          description: String(e.description || 'Upcoming regulatory development requiring attention.'),
        };
      });

      const summary = typeof parsed.summary === 'string' && parsed.summary.trim().length > 0
        ? parsed.summary
        : DEFAULT_AI_SUMMARY;

      const actions = Array.isArray(parsed.actions) && parsed.actions.length > 0
        ? parsed.actions.filter((a: any) => typeof a === 'string')
        : DEFAULT_AI_ACTIONS;

      return {
        events: mappedEvents.length > 0 ? mappedEvents : DEFAULT_RADAR_EVENTS,
        summary,
        actions,
      };
    } catch (error) {
      logger.error('Regulatory radar generation failed:', error);
      return {
        events: DEFAULT_RADAR_EVENTS,
        summary: DEFAULT_AI_SUMMARY,
        actions: DEFAULT_AI_ACTIONS,
      };
    }
  }

  // ===========================================================================
  // COMPLIANCE DASHBOARD
  // ===========================================================================

  /**
   * Get compliance dashboard summary
   */
  async getDashboard(organizationId: string): Promise<any> {
    const [regulations, violations, alignments, forecasts] = await Promise.all([
      prisma.panopticon_regulations.count({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
      prisma.panopticon_violations.groupBy({
        by: ['severity'],
        where: { organization_id: organizationId, status: 'OPEN' },
        _count: true,
      }),
      prisma.panopticon_alignments.aggregate({
        where: {
          obligation: {
            regulation: { organization_id: organizationId },
          },
        },
        _avg: { alignment_score: true },
      }),
      prisma.panopticon_forecasts.count({
        where: {
          organization_id: organizationId,
          probability: { gte: 0.6 },
          horizon_days: { lte: 90 },
        },
      }),
    ]);

    const violationCounts = violations.reduce((acc, v) => {
      acc[v.severity] = v._count;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalFrameworks: regulations,
      overallComplianceScore: Math.round(alignments._avg.alignment_score || 75),
      openViolations: {
        critical: violationCounts['CRITICAL'] || 0,
        high: violationCounts['HIGH'] || 0,
        medium: violationCounts['MEDIUM'] || 0,
        low: violationCounts['LOW'] || 0,
        total: Object.values(violationCounts).reduce((a, b) => a + b, 0),
      },
      upcomingRegulations: forecasts,
      jurisdictions: [...new Set(REGULATORY_FRAMEWORKS.map(f => f.jurisdiction))].length,
    };
  }
  // ===========================================================================
  // EXPRESS MODE - Standalone outputs WITHOUT Council
  // ===========================================================================

  /**
   * Express: Get full compliance report directly (no Council needed)
   * Returns compliance status, violations, gaps, and remediation in one call.
   */
  async getComplianceReport(organizationId: string): Promise<{
    frameworks: string[];
    violations: Array<{
      framework: string;
      obligation: string;
      gap: string;
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      remediation: string;
    }>;
    score: number;
    trend: string;
    summary: string;
    generatedAt: Date;
    mode: 'express';
  }> {
    const startTime = Date.now();

    // Gather real data
    const [regulations, openViolations, gaps, dashboard] = await Promise.all([
      this.getOrganizationRegulations(organizationId),
      this.getOpenViolations(organizationId),
      this.getComplianceGaps(organizationId),
      this.getDashboard(organizationId),
    ]);

    const activeFrameworks = regulations.map((r: any) => r.framework_code);

    // Build violation list from real DB data
    const violationList = openViolations.map((v: any) => ({
      framework: v.regulation?.framework_code || 'Unknown',
      obligation: v.obligation?.title || v.title,
      gap: v.description,
      severity: v.severity as 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW',
      remediation: v.resolution || '',
    }));

    // Enrich violations missing remediation steps with LLM
    const violationsNeedingRemediation = violationList.filter(v => !v.remediation);
    if (violationsNeedingRemediation.length > 0) {
      const prompt = `Generate specific remediation steps for these compliance violations:

${violationsNeedingRemediation.map((v, i) => `${i + 1}. [${v.framework}] ${v.obligation}: ${v.gap} (${v.severity})`).join('\n')}

Respond as JSON array of objects: [{"index": 0, "remediation": "Step-by-step fix"}]`;

      try {
        const response = await this.llmService.generate(prompt, {
          model: 'llama3.2:3b',
          systemPrompt: 'You are a compliance remediation expert. Provide specific, actionable remediation steps.',
          temperature: 0.3,
          maxTokens: 600,
          format: 'json',
        });

        const remediations = JSON.parse(response);
        for (const r of remediations) {
          if (typeof r.index === 'number' && violationsNeedingRemediation[r.index]) {
            violationsNeedingRemediation[r.index].remediation = r.remediation;
          }
        }
      } catch {
        // Fallback: generic remediation
        for (const v of violationsNeedingRemediation) {
          v.remediation = `Review ${v.framework} ${v.obligation} requirements and implement corrective controls.`;
        }
      }
    }

    // Add gap-based violations
    for (const gap of gaps) {
      if (!violationList.some(v => v.obligation === gap.obligationTitle)) {
        violationList.push({
          framework: gap.obligationId.split('-')[0] || 'Unknown',
          obligation: gap.obligationTitle,
          gap: gap.gaps.join('; '),
          severity: gap.alignmentScore < 30 ? 'CRITICAL' : gap.alignmentScore < 50 ? 'HIGH' : 'MEDIUM',
          remediation: gap.remediationSteps.join('; '),
        });
      }
    }

    // Determine trend from recent violation counts
    const trend = dashboard.openViolations.total === 0
      ? 'compliant'
      : dashboard.openViolations.critical > 0
        ? 'declining'
        : 'improving';

    const durationMs = Date.now() - startTime;
    logger.info(`[Panopticon Express] Compliance report generated in ${durationMs}ms for org ${organizationId}`);

    return {
      frameworks: activeFrameworks,
      violations: violationList,
      score: dashboard.overallComplianceScore,
      trend,
      summary: `${activeFrameworks.length} frameworks active. ${violationList.length} violations found (${violationList.filter(v => v.severity === 'CRITICAL').length} critical). Overall compliance score: ${dashboard.overallComplianceScore}/100.`,
      generatedAt: new Date(),
      mode: 'express',
    };
  }

  /**
   * Express: Generate remediation steps for specific violations (no Council needed)
   * Quick LLM-powered fix suggestions.
   */
  async generateRemediationSteps(
    organizationId: string,
    violationIds?: string[]
  ): Promise<{
    remediations: Array<{
      violationId: string;
      framework: string;
      title: string;
      severity: string;
      steps: string[];
      effort: 'LOW' | 'MEDIUM' | 'HIGH';
      timeframe: string;
    }>;
    totalEffort: string;
    mode: 'express';
  }> {
    // Get violations - either specific ones or all open
    let violations: any[];
    if (violationIds && violationIds.length > 0) {
      violations = await prisma.panopticon_violations.findMany({
        where: { id: { in: violationIds } },
        include: { regulation: true, obligation: true },
      });
    } else {
      violations = await this.getOpenViolations(organizationId);
    }

    if (violations.length === 0) {
      return {
        remediations: [],
        totalEffort: 'NONE',
        mode: 'express',
      };
    }

    const prompt = `Generate detailed remediation plans for these compliance violations:

${violations.map((v: any, i: number) => {
  const fw = v.regulation?.framework_code || 'Unknown';
  const title = v.obligation?.title || v.title;
  return `${i + 1}. [${fw}] ${title} — Severity: ${v.severity}\n   Description: ${v.description}`;
}).join('\n\n')}

For each violation, provide:
- steps: Array of specific remediation steps (3-5 steps each)
- effort: LOW, MEDIUM, or HIGH
- timeframe: Estimated time to remediate (e.g., "1-2 weeks")

Respond as JSON array: [{"index": 0, "steps": ["Step 1", "Step 2"], "effort": "MEDIUM", "timeframe": "1-2 weeks"}]`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a compliance remediation expert. Provide specific, implementable remediation steps.',
        temperature: 0.3,
        maxTokens: 1000,
        format: 'json',
      });

      const plans = JSON.parse(response);
      const remediations = violations.map((v: any, i: number) => {
        const plan = Array.isArray(plans) ? plans.find((p: any) => p.index === i) : null;
        return {
          violationId: v.id,
          framework: v.regulation?.framework_code || 'Unknown',
          title: v.obligation?.title || v.title,
          severity: v.severity,
          steps: plan?.steps || [`Review ${v.title || 'violation'} and implement corrective controls`],
          effort: (plan?.effort || 'MEDIUM') as 'LOW' | 'MEDIUM' | 'HIGH',
          timeframe: plan?.timeframe || '2-4 weeks',
        };
      });

      const highEffort = remediations.filter(r => r.effort === 'HIGH').length;
      const totalEffort = highEffort > remediations.length / 2 ? 'HIGH'
        : highEffort > 0 ? 'MEDIUM' : 'LOW';

      return { remediations, totalEffort, mode: 'express' };
    } catch (error) {
      logger.error('Express remediation generation failed:', error);
      return {
        remediations: violations.map((v: any) => ({
          violationId: v.id,
          framework: v.regulation?.framework_code || 'Unknown',
          title: v.obligation?.title || v.title,
          severity: v.severity,
          steps: ['Manual review required — Express analysis unavailable'],
          effort: 'MEDIUM' as const,
          timeframe: '2-4 weeks',
        })),
        totalEffort: 'MEDIUM',
        mode: 'express',
      };
    }
  }
  // ===========================================================================
  // 10/10 ENHANCEMENTS - Advanced Compliance Intelligence
  // ===========================================================================

  /**
   * Cross-Framework Conflict Detection: Find requirements that conflict across frameworks.
   * e.g., GDPR data minimization vs. SOX retention requirements.
   */
  async detectFrameworkConflicts(organizationId: string): Promise<{
    organizationId: string;
    conflicts: Array<{
      framework1: string;
      requirement1: string;
      framework2: string;
      requirement2: string;
      conflictType: 'DIRECT' | 'INDIRECT' | 'CONDITIONAL';
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      resolution: string;
      affectedAreas: string[];
    }>;
    riskScore: number;
    summary: string;
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    // Get active frameworks for the org
    const frameworks = await prisma.panopticon_regulations.findMany({
      where: { organization_id: organizationId, status: 'ACTIVE' },
      include: {
        obligations: {
          where: { requirement_type: { in: ['MANDATORY', 'CONDITIONAL'] } },
          take: 50,
        },
      },
    });

    if (frameworks.length < 2) {
      return {
        organizationId,
        conflicts: [],
        riskScore: 0,
        summary: `Only ${frameworks.length} framework(s) active — need at least 2 for conflict detection.`,
        generatedAt: new Date(),
      };
    }

    // Known conflict patterns (domain knowledge — not simulated)
    const KNOWN_CONFLICT_PATTERNS: Array<{
      fw1Pattern: string;
      fw2Pattern: string;
      conflictType: 'DIRECT' | 'INDIRECT' | 'CONDITIONAL';
      description: string;
      resolution: string;
    }> = [
      {
        fw1Pattern: 'GDPR',
        fw2Pattern: 'SOX',
        conflictType: 'DIRECT',
        description: 'Data minimization (GDPR Art.5) vs. financial record retention (SOX §802)',
        resolution: 'Implement tiered retention: minimize personal data while retaining anonymized financial records for SOX compliance.',
      },
      {
        fw1Pattern: 'GDPR',
        fw2Pattern: 'HIPAA',
        conflictType: 'CONDITIONAL',
        description: 'Right to erasure (GDPR Art.17) vs. medical record retention (HIPAA §164.530)',
        resolution: 'Apply geographic scope: GDPR erasure for EU patients only; HIPAA retention for US patients. Document scope boundaries.',
      },
      {
        fw1Pattern: 'CCPA',
        fw2Pattern: 'SOX',
        conflictType: 'INDIRECT',
        description: 'Consumer deletion rights (CCPA §1798.105) vs. audit trail retention (SOX §802)',
        resolution: 'Separate personal data from audit records. Delete personal data while retaining anonymized transaction logs.',
      },
      {
        fw1Pattern: 'GDPR',
        fw2Pattern: 'PCI',
        conflictType: 'CONDITIONAL',
        description: 'Data portability (GDPR Art.20) vs. payment data scope restrictions (PCI DSS Req.3)',
        resolution: 'Exclude PCI-scoped cardholder data from portability exports. Provide non-payment personal data only.',
      },
      {
        fw1Pattern: 'NIST',
        fw2Pattern: 'GDPR',
        conflictType: 'INDIRECT',
        description: 'Continuous monitoring/logging (NIST 800-53 AU) vs. data minimization (GDPR Art.5)',
        resolution: 'Log system events without personal data. Use pseudonymized identifiers in audit logs.',
      },
      {
        fw1Pattern: 'ISO',
        fw2Pattern: 'CCPA',
        conflictType: 'CONDITIONAL',
        description: 'Asset inventory requirements (ISO 27001 A.8) vs. consumer opt-out rights (CCPA §1798.120)',
        resolution: 'Maintain separate inventories: operational asset tracking (ISO) vs. personal data processing register (CCPA).',
      },
    ];

    const activeFrameworkCodes = frameworks.map((f: any) => f.framework_code.toUpperCase());
    const detectedConflicts: Array<{
      framework1: string;
      requirement1: string;
      framework2: string;
      requirement2: string;
      conflictType: 'DIRECT' | 'INDIRECT' | 'CONDITIONAL';
      severity: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      resolution: string;
      affectedAreas: string[];
    }> = [];

    // Match known conflict patterns against active frameworks
    for (const pattern of KNOWN_CONFLICT_PATTERNS) {
      const fw1Match = activeFrameworkCodes.find((c: string) => c.includes(pattern.fw1Pattern));
      const fw2Match = activeFrameworkCodes.find((c: string) => c.includes(pattern.fw2Pattern));

      if (fw1Match && fw2Match) {
        detectedConflicts.push({
          framework1: fw1Match,
          requirement1: pattern.description.split(' vs. ')[0],
          framework2: fw2Match,
          requirement2: pattern.description.split(' vs. ')[1] || '',
          conflictType: pattern.conflictType,
          severity: pattern.conflictType === 'DIRECT' ? 'CRITICAL' : pattern.conflictType === 'CONDITIONAL' ? 'HIGH' : 'MEDIUM',
          resolution: pattern.resolution,
          affectedAreas: this.extractAffectedAreas(pattern.description),
        });
      }
    }

    // Use LLM to find additional conflicts from obligation text
    if (frameworks.length >= 2) {
      const obligationSummaries = frameworks.map((f: any) => ({
        code: f.framework_code,
        obligations: f.obligations.slice(0, 10).map((o: any) => o.title || o.description).join('; '),
      }));

      try {
        const prompt = `Analyze these regulatory framework obligations for conflicts:

${obligationSummaries.map(f => `[${f.code}]: ${f.obligations}`).join('\n\n')}

Find 1-3 specific requirement conflicts between frameworks. Return JSON:
[{"framework1": "CODE", "framework2": "CODE", "conflict": "Description", "severity": "HIGH|MEDIUM|LOW", "resolution": "How to resolve"}]`;

        const resp = await this.llmService.generate(prompt, {
          model: 'llama3.2:3b',
          systemPrompt: 'You are a regulatory compliance expert. Identify real conflicts between regulatory frameworks. Only report genuine conflicts, not similarities.',
          temperature: 0.3,
          maxTokens: 500,
          format: 'json',
        });

        const llmConflicts = JSON.parse(resp);
        if (Array.isArray(llmConflicts)) {
          for (const c of llmConflicts.slice(0, 3)) {
            // Avoid duplicates
            if (!detectedConflicts.some(d =>
              d.framework1.includes(c.framework1) && d.framework2.includes(c.framework2)
            )) {
              detectedConflicts.push({
                framework1: c.framework1,
                requirement1: c.conflict?.split(' vs. ')?.[0] || c.conflict || '',
                framework2: c.framework2,
                requirement2: c.conflict?.split(' vs. ')?.[1] || '',
                conflictType: 'INDIRECT',
                severity: (c.severity || 'MEDIUM') as any,
                resolution: c.resolution || 'Review with legal/compliance team',
                affectedAreas: ['Data Management', 'Compliance Operations'],
              });
            }
          }
        }
      } catch {
        // LLM enrichment failed — known patterns are still valid
      }
    }

    const riskScore = Math.min(100, Math.round(
      detectedConflicts.filter(c => c.severity === 'CRITICAL').length * 30 +
      detectedConflicts.filter(c => c.severity === 'HIGH').length * 20 +
      detectedConflicts.filter(c => c.severity === 'MEDIUM').length * 10 +
      detectedConflicts.filter(c => c.severity === 'LOW').length * 5
    ));

    const durationMs = Date.now() - startTime;
    logger.info(`[Panopticon] Framework conflict detection completed in ${durationMs}ms: ${detectedConflicts.length} conflicts found`);

    return {
      organizationId,
      conflicts: detectedConflicts,
      riskScore,
      summary: detectedConflicts.length > 0
        ? `${detectedConflicts.length} cross-framework conflicts detected across ${activeFrameworkCodes.length} frameworks. ${detectedConflicts.filter(c => c.severity === 'CRITICAL').length} critical, ${detectedConflicts.filter(c => c.severity === 'HIGH').length} high priority.`
        : `No conflicts detected across ${activeFrameworkCodes.length} active frameworks.`,
      generatedAt: new Date(),
    };
  }

  /**
   * Extract affected areas from conflict description.
   */
  private extractAffectedAreas(description: string): string[] {
    const areas: string[] = [];
    const lower = description.toLowerCase();
    if (lower.includes('data') || lower.includes('retention') || lower.includes('erasure')) areas.push('Data Management');
    if (lower.includes('audit') || lower.includes('log') || lower.includes('monitor')) areas.push('Audit & Logging');
    if (lower.includes('financial') || lower.includes('transaction')) areas.push('Financial Operations');
    if (lower.includes('payment') || lower.includes('card')) areas.push('Payment Processing');
    if (lower.includes('medical') || lower.includes('patient') || lower.includes('health')) areas.push('Healthcare Data');
    if (lower.includes('security') || lower.includes('access')) areas.push('Information Security');
    if (areas.length === 0) areas.push('Compliance Operations');
    return areas;
  }

  /**
   * Compliance Automation Workflows: Generate actionable remediation workflows.
   * Creates step-by-step task lists with assignments, timelines, and evidence requirements.
   */
  async generateComplianceWorkflow(
    organizationId: string,
    options?: {
      frameworkCode?: string;
      severity?: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      maxTasks?: number;
    }
  ): Promise<{
    organizationId: string;
    workflow: {
      name: string;
      description: string;
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      estimatedDuration: string;
      tasks: Array<{
        id: string;
        title: string;
        description: string;
        assignee: string;
        status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
        priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
        estimatedHours: number;
        dependencies: string[];
        evidenceRequired: string[];
        framework: string;
      }>;
    };
    totalEstimatedHours: number;
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    // Get open violations filtered by criteria
    const whereClause: any = { organization_id: organizationId, status: { in: ['OPEN', 'IN_PROGRESS'] } };
    if (options?.frameworkCode) {
      whereClause.regulation = { framework_code: options.frameworkCode };
    }
    if (options?.severity) {
      whereClause.severity = options.severity;
    }

    const violations = await prisma.panopticon_violations.findMany({
      where: whereClause,
      include: { regulation: true, obligation: true },
      take: options?.maxTasks || 20,
      orderBy: [
        { severity: 'asc' }, // CRITICAL first
        { created_at: 'asc' },
      ],
    });

    if (violations.length === 0) {
      return {
        organizationId,
        workflow: {
          name: 'No Open Violations',
          description: 'All compliance obligations are currently met.',
          priority: 'LOW',
          estimatedDuration: '0 hours',
          tasks: [],
        },
        totalEstimatedHours: 0,
        generatedAt: new Date(),
      };
    }

    // Generate workflow tasks from violations
    const tasks: Array<{
      id: string;
      title: string;
      description: string;
      assignee: string;
      status: 'NOT_STARTED' | 'IN_PROGRESS' | 'BLOCKED' | 'COMPLETED';
      priority: 'CRITICAL' | 'HIGH' | 'MEDIUM' | 'LOW';
      estimatedHours: number;
      dependencies: string[];
      evidenceRequired: string[];
      framework: string;
    }> = [];

    // Estimate effort based on severity
    const effortMap: Record<string, number> = {
      'CRITICAL': 16,
      'HIGH': 8,
      'MEDIUM': 4,
      'LOW': 2,
    };

    // Assign based on violation type
    const assigneeMap: Record<string, string> = {
      'CRITICAL': 'Compliance Officer',
      'HIGH': 'Compliance Lead',
      'MEDIUM': 'Compliance Analyst',
      'LOW': 'Compliance Analyst',
    };

    for (let i = 0; i < violations.length; i++) {
      const v = violations[i] as any;
      const severity = v.severity || 'MEDIUM';
      const framework = v.regulation?.framework_code || 'Unknown';
      const taskId = `task-${i + 1}`;

      tasks.push({
        id: taskId,
        title: `Remediate: ${v.obligation?.title || v.title || `Violation #${i + 1}`}`,
        description: v.description || `Address ${severity} violation in ${framework}`,
        assignee: assigneeMap[severity] || 'Compliance Analyst',
        status: 'NOT_STARTED',
        priority: severity as any,
        estimatedHours: effortMap[severity] || 4,
        dependencies: i > 0 && severity === 'CRITICAL' ? [] : tasks.filter(t => t.priority === 'CRITICAL').map(t => t.id),
        evidenceRequired: this.getEvidenceRequirements(v),
        framework,
      });
    }

    const totalEstimatedHours = tasks.reduce((sum, t) => sum + t.estimatedHours, 0);
    const highestSeverity = tasks[0]?.priority || 'LOW';

    const durationMs = Date.now() - startTime;
    logger.info(`[Panopticon] Compliance workflow generated in ${durationMs}ms: ${tasks.length} tasks, ${totalEstimatedHours}h estimated`);

    return {
      organizationId,
      workflow: {
        name: `Compliance Remediation — ${new Date().toISOString().split('T')[0]}`,
        description: `${tasks.length} tasks across ${new Set(tasks.map(t => t.framework)).size} framework(s). ${tasks.filter(t => t.priority === 'CRITICAL').length} critical, ${tasks.filter(t => t.priority === 'HIGH').length} high priority.`,
        priority: highestSeverity,
        estimatedDuration: totalEstimatedHours > 40
          ? `${Math.ceil(totalEstimatedHours / 40)} weeks`
          : `${totalEstimatedHours} hours`,
        tasks,
      },
      totalEstimatedHours,
      generatedAt: new Date(),
    };
  }

  /**
   * Determine evidence requirements for a violation.
   */
  private getEvidenceRequirements(violation: any): string[] {
    const evidence: string[] = ['Remediation plan document'];
    const framework = (violation.regulation?.framework_code || '').toUpperCase();

    if (framework.includes('GDPR')) {
      evidence.push('Data processing records update', 'DPO sign-off');
    } else if (framework.includes('SOX')) {
      evidence.push('Internal control test results', 'Management attestation');
    } else if (framework.includes('HIPAA')) {
      evidence.push('Risk assessment update', 'Workforce training records');
    } else if (framework.includes('PCI')) {
      evidence.push('Vulnerability scan results', 'Penetration test report');
    } else if (framework.includes('NIST')) {
      evidence.push('Control assessment documentation', 'POA&M entry');
    }

    evidence.push('Verification test results');
    return evidence;
  }

  // ===========================================================================
  // HEALTH CHECK
  // ===========================================================================

  async getHealth(): Promise<{ healthy: boolean; service: string; timestamp: Date; details: Record<string, unknown> }> {
    return {
      healthy: true,
      service: 'CendiaPanopticon',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// Export singleton instance
export const cendiaPanopticonService = new CendiaPanopticonService();