// =============================================================================
// CENDIAFOUNDRY™ - THE ARCHITECT
// Product Management & R&D Intelligence
// Prioritizes features, tracks technical debt, guides development
// =============================================================================

import { logger } from '../../utils/logger.js';
import ollama from '../ollama.js';
import { aiModelSelector } from '../../config/aiModels.js';

// =============================================================================
// TYPES
// =============================================================================

export interface RoadmapItem {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'enterprise' | 'premium' | 'infrastructure' | 'experiment';
  status: 'backlog' | 'planned' | 'in_progress' | 'testing' | 'shipped';
  priority: number; // 1-100
  effort: 'xs' | 's' | 'm' | 'l' | 'xl';
  impact: 'low' | 'medium' | 'high' | 'critical';
  demandSignal: number; // 0-100 based on user feedback
  dependencies: string[];
  assignee?: string;
  dueDate?: Date;
  completedDate?: Date;
}

export interface TechnicalDebt {
  id: string;
  file: string;
  type: 'complexity' | 'duplication' | 'outdated' | 'security' | 'performance' | 'documentation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  estimatedHours: number;
  createdAt: Date;
  resolvedAt?: Date;
}

export interface UserFeedback {
  id: string;
  source: 'support' | 'survey' | 'interview' | 'analytics' | 'social';
  content: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  category: string;
  featureRequest?: string;
  painPoint?: string;
  createdAt: Date;
}

export interface FeatureRecommendation {
  featureId: string;
  featureName: string;
  score: number;
  reasoning: string[];
  demandSignals: {
    feedbackMentions: number;
    competitorHas: boolean;
    marketTrend: 'growing' | 'stable' | 'declining';
  };
  buildRecommendation: 'build_now' | 'plan_next' | 'monitor' | 'deprioritize';
}

export interface CodeHealthReport {
  overallScore: number; // 0-100
  technicalDebt: TechnicalDebt[];
  hotspots: { file: string; issues: number; recommendation: string }[];
  recommendations: string[];
  blockers: string[]; // Things that must be fixed before adding features
}

// =============================================================================
// CENDIAFOUNDRY SERVICE
// =============================================================================

class CendiaFoundryService {
  private roadmap: Map<string, RoadmapItem> = new Map();
  private technicalDebt: Map<string, TechnicalDebt> = new Map();
  private feedback: UserFeedback[] = [];
  private twentyYearVision: string[] = [
    'Year 1-2: Establish AI Executive Council as category leader',
    'Year 3-5: Expand to full enterprise operations platform',
    'Year 6-10: Become the standard corporate operating system',
    'Year 11-15: Autonomous enterprise management',
    'Year 16-20: Human-AI organizational symbiosis',
  ];

  // ---------------------------------------------------------------------------
  // FEATURE PRIORITIZATION
  // ---------------------------------------------------------------------------

  async prioritizeFeatures(): Promise<FeatureRecommendation[]> {
    const features = Array.from(this.roadmap.values())
      .filter(f => f.status === 'backlog' || f.status === 'planned');

    const recommendations: FeatureRecommendation[] = [];

    for (const feature of features) {
      // Calculate demand signal from feedback
      const feedbackMentions = this.feedback.filter(
        f => f.featureRequest?.toLowerCase().includes(feature.name.toLowerCase()) ||
             f.content.toLowerCase().includes(feature.name.toLowerCase())
      ).length;

      // Calculate priority score
      const impactScore = { low: 25, medium: 50, high: 75, critical: 100 }[feature.impact];
      const effortPenalty = { xs: 0, s: 5, m: 15, l: 30, xl: 50 }[feature.effort];
      const demandBonus = Math.min(feedbackMentions * 5, 30);
      
      const score = Math.min(100, impactScore - effortPenalty + demandBonus + feature.demandSignal * 0.2);

      let buildRecommendation: FeatureRecommendation['buildRecommendation'];
      if (score >= 75) buildRecommendation = 'build_now';
      else if (score >= 50) buildRecommendation = 'plan_next';
      else if (score >= 30) buildRecommendation = 'monitor';
      else buildRecommendation = 'deprioritize';

      recommendations.push({
        featureId: feature.id,
        featureName: feature.name,
        score,
        reasoning: [
          `Impact: ${feature.impact} (${impactScore} pts)`,
          `Effort: ${feature.effort} (-${effortPenalty} pts)`,
          `Demand: ${feedbackMentions} mentions (+${demandBonus} pts)`,
        ],
        demandSignals: {
          feedbackMentions,
          competitorHas: false, // Would integrate with CendiaWatch
          marketTrend: 'growing',
        },
        buildRecommendation,
      });
    }

    // Sort by score
    return recommendations.sort((a, b) => b.score - a.score);
  }

  async getNextFeatureRecommendation(): Promise<string> {
    const priorities = await this.prioritizeFeatures();
    const top = priorities[0];

    if (!top) {
      return 'No features in backlog. Time to brainstorm!';
    }

    const prompt = `As the Product Architect for Datacendia (AI Executive Council platform), explain why "${top.featureName}" should be built next.

Score: ${top.score}/100
Reasoning: ${top.reasoning.join(', ')}
Demand: ${top.demandSignals.feedbackMentions} user mentions

Write a 2-sentence recommendation for the founder.`;

    try {
      return await ollama.generate(prompt, { model: 'llama3.2:3b' });
    } catch (error) {
      return `Build ${top.featureName} next. Score: ${top.score}/100. ${top.reasoning[0]}.`;
    }
  }

  // ---------------------------------------------------------------------------
  // TECHNICAL DEBT ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeCodeHealth(codebaseSummary: string): Promise<CodeHealthReport> {
    const prompt = `Analyze this codebase summary for technical debt:

${codebaseSummary}

Identify:
1. High-complexity areas that need refactoring
2. Potential performance bottlenecks
3. Security concerns
4. Documentation gaps

Output JSON: {
  "score": 0-100,
  "issues": [{ "file": "...", "type": "...", "severity": "...", "description": "...", "recommendation": "..." }],
  "blockers": ["..."]
}`;

    try {
      const response = await ollama.generate(prompt, { model: 'qwq:32b' });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const debts: TechnicalDebt[] = (analysis.issues || []).map((issue: any, i: number) => ({
        id: `debt-${Date.now()}-${i}`,
        file: issue.file || 'unknown',
        type: issue.type || 'complexity',
        severity: issue.severity || 'medium',
        description: issue.description || '',
        recommendation: issue.recommendation || '',
        estimatedHours: issue.hours || 4,
        createdAt: new Date(),
      }));

      // Store debts
      debts.forEach(d => this.technicalDebt.set(d.id, d));

      return {
        overallScore: analysis.score || 70,
        technicalDebt: debts,
        hotspots: debts
          .reduce((acc: any[], d) => {
            const existing = acc.find(h => h.file === d.file);
            if (existing) {
              existing.issues++;
            } else {
              acc.push({ file: d.file, issues: 1, recommendation: d.recommendation });
            }
            return acc;
          }, [])
          .sort((a, b) => b.issues - a.issues),
        recommendations: debts.map(d => d.recommendation).filter(Boolean),
        blockers: analysis.blockers || [],
      };
    } catch (error) {
      logger.error('Code health analysis failed:', error);
      return {
        overallScore: 70,
        technicalDebt: [],
        hotspots: [],
        recommendations: ['Unable to analyze - check AI connection'],
        blockers: [],
      };
    }
  }

  getNagMessage(): string | null {
    const criticalDebt = Array.from(this.technicalDebt.values())
      .filter(d => d.severity === 'critical' && !d.resolvedAt);

    if (criticalDebt.length > 0) {
      return `⚠️ FOUNDRY NAG: ${criticalDebt.length} critical technical debt items. Fix "${criticalDebt[0].file}" before adding more features.`;
    }

    const highDebt = Array.from(this.technicalDebt.values())
      .filter(d => d.severity === 'high' && !d.resolvedAt);

    if (highDebt.length >= 5) {
      return `🔧 FOUNDRY NAG: ${highDebt.length} high-severity debt items accumulating. Consider a refactoring sprint.`;
    }

    return null;
  }

  // ---------------------------------------------------------------------------
  // FEEDBACK MANAGEMENT
  // ---------------------------------------------------------------------------

  async ingestFeedback(feedback: Omit<UserFeedback, 'id' | 'createdAt' | 'sentiment' | 'category'>): Promise<UserFeedback> {
    // Analyze sentiment and categorize
    const prompt = `Analyze this user feedback for Datacendia:

"${feedback.content}"

Output JSON: {
  "sentiment": "positive|neutral|negative",
  "category": "feature_request|bug_report|praise|complaint|question",
  "featureRequest": "extracted feature name or null",
  "painPoint": "extracted pain point or null"
}`;

    try {
      const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
      const analysis = JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');

      const processed: UserFeedback = {
        id: `fb-${Date.now()}`,
        ...feedback,
        sentiment: analysis.sentiment || 'neutral',
        category: analysis.category || 'other',
        featureRequest: analysis.featureRequest,
        painPoint: analysis.painPoint,
        createdAt: new Date(),
      };

      this.feedback.push(processed);
      logger.info(`CendiaFoundry: Ingested feedback ${processed.id}`);

      return processed;
    } catch (error) {
      const processed: UserFeedback = {
        id: `fb-${Date.now()}`,
        ...feedback,
        sentiment: 'neutral',
        category: 'other',
        createdAt: new Date(),
      };
      this.feedback.push(processed);
      return processed;
    }
  }

  getFeedbackSummary(): {
    total: number;
    bySentiment: Record<string, number>;
    topRequests: string[];
    topPainPoints: string[];
  } {
    const bySentiment = this.feedback.reduce((acc, f) => {
      acc[f.sentiment] = (acc[f.sentiment] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const requests = this.feedback
      .filter(f => f.featureRequest)
      .map(f => f.featureRequest!)
      .reduce((acc, r) => {
        acc[r] = (acc[r] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    const painPoints = this.feedback
      .filter(f => f.painPoint)
      .map(f => f.painPoint!)
      .reduce((acc, p) => {
        acc[p] = (acc[p] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    return {
      total: this.feedback.length,
      bySentiment,
      topRequests: Object.entries(requests)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([r]) => r),
      topPainPoints: Object.entries(painPoints)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([p]) => p),
    };
  }

  // ---------------------------------------------------------------------------
  // ROADMAP MANAGEMENT
  // ---------------------------------------------------------------------------

  addToRoadmap(item: Omit<RoadmapItem, 'id'>): RoadmapItem {
    const roadmapItem: RoadmapItem = {
      id: `road-${Date.now()}`,
      ...item,
    };
    this.roadmap.set(roadmapItem.id, roadmapItem);
    return roadmapItem;
  }

  getRoadmap(): RoadmapItem[] {
    return Array.from(this.roadmap.values())
      .sort((a, b) => b.priority - a.priority);
  }

  getVision(): string[] {
    return this.twentyYearVision;
  }

  async alignWithVision(featureName: string): Promise<{
    aligned: boolean;
    phase: string;
    reasoning: string;
  }> {
    const prompt = `Does "${featureName}" align with Datacendia's 20-year vision?

Vision:
${this.twentyYearVision.join('\n')}

Output JSON: { "aligned": true/false, "phase": "Year X-Y", "reasoning": "..." }`;

    try {
      const response = await ollama.generate(prompt, { model: aiModelSelector.getModelForTask('strategic_analysis') });
      return JSON.parse(response.match(/\{[\s\S]*\}/)?.[0] || '{}');
    } catch (error) {
      return { aligned: true, phase: 'Year 1-2', reasoning: 'Analysis unavailable' };
    }
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): {
    backlogItems: number;
    inProgressItems: number;
    shippedItems: number;
    technicalDebtCount: number;
    avgPriority: number;
  } {
    const items = Array.from(this.roadmap.values());
    const backlog = items.filter(i => i.status === 'backlog');
    const inProgress = items.filter(i => i.status === 'in_progress');
    const shipped = items.filter(i => i.status === 'shipped');
    
    const totalPriority = items.reduce((sum, i) => sum + i.priority, 0);

    return {
      backlogItems: backlog.length,
      inProgressItems: inProgress.length,
      shippedItems: shipped.length,
      technicalDebtCount: this.technicalDebt.size,
      avgPriority: items.length > 0 ? Math.round(totalPriority / items.length) : 0,
    };
  }
}

export const cendiaFoundryService = new CendiaFoundryService();
export default cendiaFoundryService;
