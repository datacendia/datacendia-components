/**
 * Cultural Erasure Agent
 * 
 * "Does this decision marginalize language, customs, or non-dominant norms?"
 */

import {
  CollapseAgentType,
  FailureCategory,
  CollapseAgentOutput,
  Reversibility,
  VisibilityType,
} from '../types.js';
import { BaseCollapseAgent, AgentAnalysisParams } from './BaseCollapseAgent.js';

export class CulturalErasureAgent extends BaseCollapseAgent {
  constructor() {
    super(CollapseAgentType.CULTURAL_ERASURE);
  }

  getDescription(): string {
    return 'Analyzes whether policy marginalizes language, customs, traditions, or non-dominant cultural norms.';
  }

  getFailureQuestions(): string[] {
    return [
      'Does this privilege one cultural norm over others?',
      'Are minority languages or practices disadvantaged?',
      'Does this assume cultural homogeneity?',
      'Will cultural heritage be eroded over time?',
    ];
  }

  async analyze(params: AgentAnalysisParams): Promise<CollapseAgentOutput> {
    const { context, seed, stressMultiplier } = params;
    this.initRng(seed);

    const text = context.decisionText.toLowerCase();
    const failureConditions = [];

    const languageMarginalization = this.calculateLanguageMarginalization(text);
    const culturalHomogeneity = this.calculateCulturalHomogeneity(text);
    const heritageErosion = this.calculateHeritageErosion(text);

    if (languageMarginalization > 0.4) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.CULTURAL_MARGINALIZATION,
        { metric: 'language_marginalization', operator: '>', value: 0.4 },
        0.75,
        'LANGUAGE_MARGINALIZATION',
        `${(languageMarginalization * 100).toFixed(0)}% language marginalization risk - minority language speakers disadvantaged.`,
        languageMarginalization * 0.8 * stressMultiplier,
        0.65,
        Reversibility.PARTIALLY_REVERSIBLE,
        '1-5 years',
        VisibilityType.GRADUAL,
        [{ name: 'Minority language speakers', populationShare: 0.15, vulnerabilityScore: languageMarginalization, protectedClass: true }],
        true,
        'MEDIUM',
        ['UNESCO language rights', 'Linguistic diversity protection'],
        'Language is core to cultural identity and equal access'
      ));
    }

    if (culturalHomogeneity > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.CULTURAL_MARGINALIZATION,
        { metric: 'cultural_homogeneity_assumption', operator: '>', value: 0.5 },
        0.7,
        'CULTURAL_HOMOGENEITY_ASSUMPTION',
        `${(culturalHomogeneity * 100).toFixed(0)}% cultural homogeneity assumption - policy assumes single cultural norm.`,
        culturalHomogeneity * 0.75 * stressMultiplier,
        0.6,
        Reversibility.REVERSIBLE,
        '6-12 months',
        VisibilityType.DELAYED,
        [{ name: 'Cultural minorities', populationShare: 0.25, vulnerabilityScore: culturalHomogeneity, protectedClass: true }],
        true,
        'LOW',
        ['Multicultural policy frameworks', 'Cultural pluralism principles'],
        'Diverse societies require culturally-sensitive policies'
      ));
    }

    if (heritageErosion > 0.5) {
      failureConditions.push(this.createFailureCondition(
        FailureCategory.CULTURAL_MARGINALIZATION,
        { metric: 'heritage_erosion', operator: '>', value: 0.5 },
        0.8,
        'CULTURAL_HERITAGE_EROSION',
        `${(heritageErosion * 100).toFixed(0)}% heritage erosion risk - traditional practices may be lost.`,
        heritageErosion * 0.85 * stressMultiplier,
        0.7,
        Reversibility.IRREVERSIBLE,
        '5-20 years',
        VisibilityType.GRADUAL,
        [{ name: 'Traditional communities', populationShare: 0.1, vulnerabilityScore: heritageErosion, protectedClass: true }],
        false,
        'HIGH',
        ['UNESCO cultural heritage conventions', 'Indigenous rights declarations'],
        'Once cultural knowledge is lost, it cannot be recovered'
      ));
    }

    const riskScore = this.calculateRiskScore(failureConditions);

    return this.finalizeOutput({
      agentType: this.agentType,
      agentId: this.agentId,
      timestamp: new Date().toISOString(),
      seed,
      failureConditions,
      riskScore,
      reasoning: `Cultural erasure analysis: Language marginalization ${(languageMarginalization * 100).toFixed(0)}%, ` +
        `Cultural homogeneity ${(culturalHomogeneity * 100).toFixed(0)}%, Heritage erosion ${(heritageErosion * 100).toFixed(0)}%.`,
      evidence: ['Cultural rights frameworks', 'Minority protection standards'],
    });
  }

  private calculateLanguageMarginalization(text: string): number {
    let score = 0;
    if (text.includes('english only') || text.includes('official language')) score += 0.4;
    if (text.includes('translat') && text.includes('not')) score += 0.25;
    if (!text.includes('multilingual') && !text.includes('translation')) score += 0.15;
    if (text.includes('standard') && text.includes('language')) score += 0.1;
    return Math.min(1, score + this.rng() * 0.1);
  }

  private calculateCulturalHomogeneity(text: string): number {
    let score = 0.2;
    if (!text.includes('cultur') && !text.includes('divers') && !text.includes('tradition')) score += 0.3;
    if (text.includes('uniform') || text.includes('standard') || text.includes('consistent')) score += 0.2;
    if (text.includes('accommodate') || text.includes('exception')) score -= 0.2;
    return Math.min(1, Math.max(0, score + this.rng() * 0.1));
  }

  private calculateHeritageErosion(text: string): number {
    let score = 0;
    if (text.includes('moderniz') && !text.includes('preserv')) score += 0.25;
    if (text.includes('replac') && (text.includes('tradition') || text.includes('practice'))) score += 0.3;
    if (text.includes('phase out') || text.includes('discontinue')) score += 0.25;
    return Math.min(1, score + this.rng() * 0.1);
  }
}
