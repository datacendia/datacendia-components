// CendiaCrucible Analytics - extracted from CendiaCrucibleService.ts
// Methods: getResilienceScores, getIndustryBenchmarks, getScenarioRecommendations,
// getRecentSimulations, getQuickSimulation, getResilienceScore, runSensitivityAnalysis,
// calibrateModel, analyzeScenarioCorrelations, getScenarioLibrary

  async getResilienceScores(organizationId: string): Promise<{
    overall: number;
    dimensions: Array<{ dimension: string; score: number; trend: number }>;
    weakest: { dimension: string; score: number };
    strongest: { dimension: string; score: number };
    lastUpdated: Date;
  }> {
    // Fetch real organization data
    const [organization, healthScores, dataSources, alerts, simulations, metrics] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: organizationId } }),
      prisma.health_scores.findMany({
        where: { organization_id: organizationId },
        take: 2,
        orderBy: { calculated_at: 'desc' },
      }),
      prisma.data_sources.findMany({ where: { organization_id: organizationId } }),
      prisma.alerts.findMany({ where: { organization_id: organizationId, status: 'ACTIVE' } }),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId, status: 'COMPLETED' },
        take: 10,
        orderBy: { created_at: 'desc' },
      }),
      prisma.metric_definitions.findMany({
        where: { organization_id: organizationId },
        include: { metric_values: { take: 2, orderBy: { timestamp: 'desc' } } },
      }),
    ]);

    const latestHealth = healthScores[0];
    const previousHealth = healthScores[1];

    // Calculate dimension scores from real data
    // Note: health_scores has: security_score, overall, data_score, ops_score, people_score
    const dimensions = [
      {
        dimension: 'Financial',
        score: latestHealth?.data_score || this.calculateFinancialResilience(metrics),
        trend: this.calculateTrend(latestHealth?.data_score, previousHealth?.data_score),
      },
      {
        dimension: 'Talent',
        score: latestHealth?.people_score || this.calculateTalentResilience(metrics),
        trend: this.calculateTrend(latestHealth?.people_score, previousHealth?.people_score),
      },
      {
        dimension: 'Operational',
        score: latestHealth?.ops_score || this.calculateOperationalResilience(dataSources, alerts),
        trend: this.calculateTrend(latestHealth?.ops_score, previousHealth?.ops_score),
      },
      {
        dimension: 'Cyber',
        score: latestHealth?.security_score || this.calculateCyberResilience(dataSources, alerts),
        trend: this.calculateTrend(latestHealth?.security_score, previousHealth?.security_score),
      },
      {
        dimension: 'Market',
        score: this.calculateMarketResilience(metrics),
        trend: 0,
      },
      {
        dimension: 'Supply Chain',
        score: this.calculateSupplyChainResilience(dataSources, simulations),
        trend: 0,
      },
      {
        dimension: 'Regulatory',
        score: latestHealth?.security_score ? Math.round(latestHealth.security_score * 0.9) : 70,
        trend: 0,
      },
    ];

    // Calculate overall score
    const overall = Math.round(dimensions.reduce((sum, d) => sum + d.score, 0) / dimensions.length);
    
    // Find weakest and strongest
    const sorted = [...dimensions].sort((a, b) => a.score - b.score);
    const weakest = { dimension: sorted[0].dimension, score: sorted[0].score };
    const strongest = { dimension: sorted[sorted.length - 1].dimension, score: sorted[sorted.length - 1].score };

    return {
      overall,
      dimensions,
      weakest,
      strongest,
      lastUpdated: latestHealth?.calculated_at || new Date(),
    };
  }

  /**
   * Get industry benchmarks for comparison
   */
  async getIndustryBenchmarks(organizationId: string): Promise<{
    industry: string;
    benchmarks: Array<{ dimension: string; industryAvg: number; topQuartile: number; yourScore: number }>;
    overallComparison: { yourScore: number; industryAvg: number; percentile: number };
  }> {
    const org = await prisma.organizations.findUnique({ where: { id: organizationId } });
    const resilience = await this.getResilienceScores(organizationId);
    const industry = org?.industry || 'Technology';

    // Industry benchmark data (ROADMAP: source from aggregated data)
    const industryBenchmarks: Record<string, Record<string, { avg: number; topQuartile: number }>> = {
      'Technology': {
        Financial: { avg: 72, topQuartile: 85 },
        Talent: { avg: 68, topQuartile: 82 },
        Operational: { avg: 75, topQuartile: 88 },
        Cyber: { avg: 71, topQuartile: 86 },
        Market: { avg: 65, topQuartile: 80 },
        'Supply Chain': { avg: 62, topQuartile: 78 },
        Regulatory: { avg: 74, topQuartile: 88 },
      },
      'Healthcare': {
        Financial: { avg: 70, topQuartile: 83 },
        Talent: { avg: 65, topQuartile: 80 },
        Operational: { avg: 72, topQuartile: 85 },
        Cyber: { avg: 68, topQuartile: 82 },
        Market: { avg: 70, topQuartile: 84 },
        'Supply Chain': { avg: 64, topQuartile: 79 },
        Regulatory: { avg: 78, topQuartile: 92 },
      },
      'Financial Services': {
        Financial: { avg: 78, topQuartile: 90 },
        Talent: { avg: 70, topQuartile: 84 },
        Operational: { avg: 76, topQuartile: 89 },
        Cyber: { avg: 75, topQuartile: 88 },
        Market: { avg: 68, topQuartile: 82 },
        'Supply Chain': { avg: 60, topQuartile: 75 },
        Regulatory: { avg: 82, topQuartile: 94 },
      },
      'Manufacturing': {
        Financial: { avg: 68, topQuartile: 82 },
        Talent: { avg: 62, topQuartile: 76 },
        Operational: { avg: 74, topQuartile: 87 },
        Cyber: { avg: 58, topQuartile: 72 },
        Market: { avg: 66, topQuartile: 80 },
        'Supply Chain': { avg: 70, topQuartile: 84 },
        Regulatory: { avg: 72, topQuartile: 86 },
      },
    };

    const industryData = industryBenchmarks[industry] || industryBenchmarks['Technology'];
    
    const benchmarks = resilience.dimensions.map(d => ({
      dimension: d.dimension,
      industryAvg: industryData[d.dimension]?.avg || 70,
      topQuartile: industryData[d.dimension]?.topQuartile || 85,
      yourScore: d.score,
    }));

    const industryAvgOverall = Math.round(Object.values(industryData).reduce((sum, b) => sum + b.avg, 0) / Object.keys(industryData).length);
    const percentile = Math.min(99, Math.max(1, Math.round((resilience.overall / industryAvgOverall) * 50)));

    return {
      industry,
      benchmarks,
      overallComparison: {
        yourScore: resilience.overall,
        industryAvg: industryAvgOverall,
        percentile,
      },
    };
  }

  /**
   * Get scenario recommendations based on organization weaknesses
   */
  async getScenarioRecommendations(organizationId: string): Promise<Array<{
    scenarioType: SimulationType;
    priority: 'critical' | 'high' | 'medium';
    reason: string;
    relatedDimension: string;
    lastSimulated?: Date;
  }>> {
    const [resilience, simulations, org] = await Promise.all([
      this.getResilienceScores(organizationId),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId },
        orderBy: { created_at: 'desc' },
      }),
      prisma.organizations.findUnique({ where: { id: organizationId } }),
    ]);

    const recommendations: Array<{
      scenarioType: SimulationType;
      priority: 'critical' | 'high' | 'medium';
      reason: string;
      relatedDimension: string;
      lastSimulated?: Date;
    }> = [];

    // Map dimensions to scenario types
    const dimensionToScenario: Record<string, { type: SimulationType; name: string }> = {
      'Financial': { type: 'FINANCIAL_STRESS', name: 'Financial Stress Test' },
      'Talent': { type: 'TALENT_EXODUS', name: 'Talent Crisis' },
      'Operational': { type: 'OPERATIONAL_SHOCK', name: 'Operational Disruption' },
      'Cyber': { type: 'CYBER_ATTACK', name: 'Cybersecurity Incident' },
      'Market': { type: 'MARKET_DISRUPTION', name: 'Market Disruption' },
      'Supply Chain': { type: 'SUPPLY_CHAIN', name: 'Supply Chain Breakdown' },
      'Regulatory': { type: 'REGULATORY_CHANGE', name: 'Regulatory Shock' },
    };

    // Prioritize by weakness
    for (const dim of resilience.dimensions.sort((a, b) => a.score - b.score)) {
      const scenario = dimensionToScenario[dim.dimension];
      if (!scenario) continue;

      const lastSim = simulations.find(s => s.simulation_type === scenario.type);
      const daysSinceLastSim = lastSim 
        ? Math.floor((Date.now() - new Date(lastSim.created_at).getTime()) / (1000 * 60 * 60 * 24))
        : 999;

      let priority: 'critical' | 'high' | 'medium' = 'medium';
      let reason = '';

      if (dim.score < 50) {
        priority = 'critical';
        reason = `${dim.dimension} resilience is critically low at ${dim.score}/100`;
      } else if (dim.score < 65) {
        priority = 'high';
        reason = `${dim.dimension} resilience below industry average at ${dim.score}/100`;
      } else if (daysSinceLastSim > 30) {
        priority = 'medium';
        reason = `No ${scenario.name} simulation run in ${daysSinceLastSim} days`;
      } else {
        continue; // Skip if score is good and recently tested
      }

      recommendations.push({
        scenarioType: scenario.type,
        priority,
        reason,
        relatedDimension: dim.dimension,
        lastSimulated: lastSim?.created_at,
      });
    }

    // Add industry-specific recommendations
    const industry = org?.industry || 'Technology';
    const industryScenarios: Record<string, SimulationType[]> = {
      'Technology': ['CYBER_ATTACK', 'TALENT_EXODUS'],
      'Healthcare': ['REGULATORY_CHANGE', 'SUPPLY_CHAIN'],
      'Financial Services': ['REGULATORY_CHANGE', 'CYBER_ATTACK'],
      'Manufacturing': ['SUPPLY_CHAIN', 'OPERATIONAL_SHOCK'],
    };

    const priorityScenarios = industryScenarios[industry] || [];
    for (const scenarioType of priorityScenarios) {
      const existing = recommendations.find(r => r.scenarioType === scenarioType);
      if (!existing) {
        const lastSim = simulations.find(s => s.simulation_type === scenarioType);
        recommendations.push({
          scenarioType,
          priority: 'medium',
          reason: `Recommended for ${industry} industry`,
          relatedDimension: Object.entries(dimensionToScenario).find(([_, v]) => v.type === scenarioType)?.[0] || 'General',
          lastSimulated: lastSim?.created_at,
        });
      }
    }

    // Sort by priority
    const priorityOrder = { critical: 0, high: 1, medium: 2 };
    return recommendations.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]).slice(0, 5);
  }

  /**
   * Get recent simulations with summary
   */
  async getRecentSimulations(organizationId: string, limit: number = 5): Promise<Array<{
    id: string;
    name: string;
    simulationType: string;
    status: string;
    createdAt: Date;
    createdBy: string;
    resilienceScore?: number;
    sentiment?: string;
  }>> {
    const simulations = await prisma.crucible_simulations.findMany({
      where: { organization_id: organizationId },
      orderBy: { created_at: 'desc' },
      take: limit,
      include: {
        users: { select: { name: true } },
        universes: { take: 1, orderBy: { probability: 'desc' } },
      },
    });

    return simulations.map(sim => ({
      id: sim.id,
      name: sim.name,
      simulationType: sim.simulation_type,
      status: sim.status,
      createdAt: sim.created_at,
      createdBy: sim.users?.name || 'Unknown',
      resilienceScore: (sim.results_summary as any)?.overallConfidence 
        ? Math.round((sim.results_summary as any).overallConfidence * 100)
        : undefined,
      sentiment: sim.universes[0]?.outcome_sentiment,
    }));
  }

  // Helper methods for resilience calculation
  private calculateFinancialResilience(metrics: any[]): number {
    const getMetricValue = (pattern: string) => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(pattern) || m.name?.toLowerCase().includes(pattern)
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const revenue = getMetricValue('revenue');
    const margin = getMetricValue('margin');
    const cashflow = getMetricValue('cash');
    
    // Calculate financial health score (0-100)
    let score = 70; // Base score
    if (revenue > 0) score += 10;
    if (margin > 20) score += 10;
    if (cashflow > 0) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateTalentResilience(metrics: any[]): number {
    const getMetricValue = (pattern: string) => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(pattern) || m.name?.toLowerCase().includes(pattern)
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const engagement = getMetricValue('engagement');
    const turnover = getMetricValue('turnover');
    
    let score = 65;
    if (engagement > 70) score += 15;
    else if (engagement > 50) score += 5;
    if (turnover < 10) score += 15;
    else if (turnover < 20) score += 5;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateOperationalResilience(dataSources: any[], alerts: any[]): number {
    const connectedSources = dataSources.filter(ds => ds.status === 'CONNECTED').length;
    const totalSources = dataSources.length || 1;
    const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
    
    let score = 70;
    score += (connectedSources / totalSources) * 20;
    score -= criticalAlerts * 5;
    
    return Math.min(100, Math.max(0, Math.round(score)));
  }

  private calculateCyberResilience(dataSources: any[], alerts: any[]): number {
    const securityAlerts = alerts.filter(a => 
      a.type?.toLowerCase().includes('security') || a.type?.toLowerCase().includes('cyber')
    ).length;
    
    let score = 75;
    score -= securityAlerts * 10;
    
    // Bonus for having integrations
    if (dataSources.some(ds => ds.type === 'security')) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateMarketResilience(metrics: any[]): number {
    const getMetricValue = (pattern: string) => {
      const metric = metrics.find(m => 
        m.code?.toLowerCase().includes(pattern) || m.name?.toLowerCase().includes(pattern)
      );
      return metric?.metric_values?.[0]?.value || 0;
    };

    const growth = getMetricValue('growth');
    const nps = getMetricValue('nps');
    
    let score = 65;
    if (growth > 20) score += 20;
    else if (growth > 10) score += 10;
    else if (growth > 0) score += 5;
    if (nps > 50) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateSupplyChainResilience(dataSources: any[], simulations: any[]): number {
    // Check if supply chain has been tested
    const supplyChainSims = simulations.filter(s => s.simulation_type === 'SUPPLY_CHAIN');
    
    let score = 60;
    if (supplyChainSims.length > 0) score += 15;
    if (dataSources.some(ds => ds.type === 'erp')) score += 10;
    
    return Math.min(100, Math.max(0, score));
  }

  private calculateTrend(current?: number, previous?: number): number {
    if (!current || !previous || previous === 0) return 0;
    return Math.round(((current - previous) / previous) * 100);
  }

  // ===========================================================================
  // EXPRESS MODE - Standalone outputs WITHOUT Council
  // ===========================================================================

  /**
   * Express: Run quick scenario analysis directly (no Council needed)
   * Returns best/most-likely/worst case outcomes in one fast call.
   */
  async getQuickSimulation(
    organizationId: string,
    scenarioType: SimulationType,
    description?: string
  ): Promise<{
    bestCase: { outcome: string; probability: number; financialImpact?: string };
    mostLikely: { outcome: string; probability: number; financialImpact?: string };
    worstCase: { outcome: string; probability: number; financialImpact?: string };
    recommendation: string;
    riskScore: number;
    keyFactors: string[];
    mode: 'express';
    generatedAt: Date;
  }> {
    const startTime = Date.now();

    // Get org context for grounded analysis
    const [org, recentSims, metrics] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: organizationId } }),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId, simulation_type: scenarioType },
        orderBy: { created_at: 'desc' },
        take: 3,
        select: { results_summary: true, simulation_type: true },
      }),
      prisma.metric_definitions.findMany({
        where: { organization_id: organizationId },
        include: { metric_values: { take: 1, orderBy: { timestamp: 'desc' } } },
        take: 10,
      }),
    ]);

    const template = SCENARIO_TEMPLATES[scenarioType];
    const scenarioName = template?.name || scenarioType;
    const scenarioDesc = description || template?.description || `${scenarioType} scenario analysis`;

    const metricsContext = metrics.map(m => {
      const val = m.metric_values?.[0]?.value;
      return `${m.name}: ${val ?? 'N/A'} ${m.unit || ''}`;
    }).join('\n');

    const prompt = `Analyze this scenario for ${org?.name || 'the organization'} (${org?.industry || 'Technology'}):

Scenario Type: ${scenarioName}
Description: ${scenarioDesc}

Current Metrics:
${metricsContext || 'No metrics available'}

${recentSims.length > 0 ? `Previous simulations of this type: ${recentSims.length} (most recent results available)` : ''}

Provide a quick 3-outcome analysis as JSON:
{
  "bestCase": {"outcome": "Description", "probability": 0.0-1.0, "financialImpact": "$X-$Y range"},
  "mostLikely": {"outcome": "Description", "probability": 0.0-1.0, "financialImpact": "$X-$Y range"},
  "worstCase": {"outcome": "Description", "probability": 0.0-1.0, "financialImpact": "$X-$Y range"},
  "recommendation": "1-2 sentence actionable recommendation",
  "riskScore": 0-100,
  "keyFactors": ["Factor 1", "Factor 2", "Factor 3"]
}`;

    try {
      const response = await this.llmService.generate(prompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a risk simulation analyst. Provide quantitative, realistic scenario analysis with specific probabilities and financial estimates.',
        temperature: 0.4,
        maxTokens: 600,
        format: 'json',
      });

      const parsed = JSON.parse(response);
      const durationMs = Date.now() - startTime;
      logger.info(`[Crucible Express] Quick simulation completed in ${durationMs}ms for ${scenarioType}`);

      return {
        bestCase: parsed.bestCase || { outcome: 'Favorable outcome', probability: 0.15 },
        mostLikely: parsed.mostLikely || { outcome: 'Expected outcome', probability: 0.60 },
        worstCase: parsed.worstCase || { outcome: 'Adverse outcome', probability: 0.10 },
        recommendation: parsed.recommendation || 'Proceed with caution ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â consider full simulation for detailed analysis.',
        riskScore: typeof parsed.riskScore === 'number' ? parsed.riskScore : 50,
        keyFactors: Array.isArray(parsed.keyFactors) ? parsed.keyFactors : [],
        mode: 'express',
        generatedAt: new Date(),
      };
    } catch (error) {
      logger.error('[Crucible Express] Quick simulation failed:', error);
      return {
        bestCase: { outcome: 'Analysis unavailable', probability: 0.15 },
        mostLikely: { outcome: 'Analysis unavailable ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â run full simulation', probability: 0.60 },
        worstCase: { outcome: 'Analysis unavailable', probability: 0.10 },
        recommendation: 'Express analysis failed. Run a full Crucible simulation for detailed results.',
        riskScore: 50,
        keyFactors: ['Express analysis unavailable'],
        mode: 'express',
        generatedAt: new Date(),
      };
    }
  }

  /**
   * Express: Get resilience score without running full simulation (no Council needed)
   */
  async getResilienceScore(organizationId: string): Promise<{
    overallScore: number;
    breakdown: Record<string, number>;
    vulnerabilities: string[];
    strengths: string[];
    mode: 'express';
  }> {
    // Get real data for grounded analysis
    const [simulations, dataSources, alerts, workflows] = await Promise.all([
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId, status: 'COMPLETED' },
        orderBy: { completed_at: 'desc' },
        take: 10,
        select: { simulation_type: true, results_summary: true },
      }),
      prisma.data_sources.findMany({
        where: { organization_id: organizationId },
        select: { status: true, type: true },
      }),
      prisma.alerts.count({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
      prisma.workflows.count({
        where: { organization_id: organizationId, status: 'ACTIVE' },
      }),
    ]);

    const connectedSources = dataSources.filter(ds => ds.status === 'CONNECTED').length;
    const simulationCoverage = new Set(simulations.map(s => s.simulation_type)).size;

    // Calculate scores based on real data
    const dataResilience = Math.min(100, (connectedSources / Math.max(dataSources.length, 1)) * 100);
    const simulationReadiness = Math.min(100, simulationCoverage * 15);
    const operationalHealth = Math.max(0, 100 - alerts * 10);
    const automationScore = Math.min(100, workflows * 20);

    const overallScore = Math.round(
      dataResilience * 0.25 +
      simulationReadiness * 0.25 +
      operationalHealth * 0.30 +
      automationScore * 0.20
    );

    const vulnerabilities: string[] = [];
    const strengths: string[] = [];

    if (dataResilience < 50) vulnerabilities.push('Low data source connectivity ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â potential blind spots');
    else strengths.push('Strong data source connectivity');

    if (simulationReadiness < 30) vulnerabilities.push('Limited simulation coverage ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â many scenario types untested');
    else strengths.push('Good simulation coverage across scenario types');

    if (operationalHealth < 50) vulnerabilities.push('High alert volume ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â active operational issues');
    else strengths.push('Low alert volume ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â stable operations');

    if (automationScore < 30) vulnerabilities.push('Low workflow automation ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â manual processes at risk');
    else strengths.push('Healthy workflow automation');

    return {
      overallScore,
      breakdown: {
        dataResilience: Math.round(dataResilience),
        simulationReadiness: Math.round(simulationReadiness),
        operationalHealth: Math.round(operationalHealth),
        automationScore: Math.round(automationScore),
      },
      vulnerabilities,
      strengths,
      mode: 'express',
    };
  }
  // ===========================================================================
  // 10/10 ENHANCEMENTS - Advanced Simulation Intelligence
  // ===========================================================================

  /**
   * Sensitivity Analysis: Which input variables matter most?
   * Varies each variable ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±10% and measures outcome elasticity.
   */
  async runSensitivityAnalysis(
    simulationId: string
  ): Promise<{
    simulationId: string;
    variables: Array<{
      variable: string;
      elasticity: number;
      impactMagnitude: number;
      direction: 'positive' | 'negative' | 'neutral';
      rank: number;
    }>;
    mostSensitive: { variable: string; elasticity: number; insight: string };
    leastSensitive: { variable: string; elasticity: number; insight: string };
    recommendations: string[];
    generatedAt: Date;
  }> {
    const simulation = await prisma.crucible_simulations.findUnique({
      where: { id: simulationId },
    });

    if (!simulation) throw new Error(`Simulation ${simulationId} not found`);

    const config = simulation.config as any as SimulationConfig;
    const scenario = simulation.scenario_definition as any as ScenarioDefinition;
    const twin = simulation.digital_twin_snapshot as any as DigitalTwin;

    // Variables to test sensitivity on
    const testVariables = [
      { name: 'revenue', base: twin?.financials?.revenue || 1000000 },
      { name: 'operating_costs', base: (twin?.financials?.revenue || 1000000) * 0.7 },
      { name: 'headcount', base: twin?.employees?.totalHeadcount || 100 },
      { name: 'churn_rate', base: twin?.financials?.churnRate || 0.05 },
      { name: 'cash_flow', base: twin?.financials?.cashFlow || 200000 },
      { name: 'burn_rate', base: twin?.financials?.burnRate || 50000 },
      { name: 'engagement', base: twin?.employees?.engagementScore || 70 },
      { name: 'gross_margin', base: twin?.financials?.grossMargin || 0.6 },
    ].filter(v => v.base !== 0 && v.base != null);

    const variation = 0.10; // ÃƒÆ’Ã¢â‚¬Å¡Ãƒâ€šÃ‚Â±10%
    const sensitivities: Array<{
      variable: string;
      elasticity: number;
      impactMagnitude: number;
      direction: 'positive' | 'negative' | 'neutral';
      rank: number;
    }> = [];

    // Calculate baseline risk score from shocks
    const baselineScore = this.calculateBaselineRiskScore(scenario.shocks, twin);

    for (const variable of testVariables) {
      // Apply +10% adjustment
      const upScore = this.calculateVariedRiskScore(scenario.shocks, twin, variable.name, variable.base * (1 + variation));
      // Apply -10% adjustment
      const downScore = this.calculateVariedRiskScore(scenario.shocks, twin, variable.name, variable.base * (1 - variation));

      const impactUp = upScore - baselineScore;
      const impactDown = downScore - baselineScore;
      const avgImpact = (Math.abs(impactUp) + Math.abs(impactDown)) / 2;
      const elasticity = avgImpact / (variation * 100);

      sensitivities.push({
        variable: variable.name,
        elasticity: Math.round(elasticity * 100) / 100,
        impactMagnitude: Math.round(avgImpact * 100) / 100,
        direction: impactDown > impactUp ? 'negative' : impactDown < impactUp ? 'positive' : 'neutral',
        rank: 0,
      });
    }

    // Sort by elasticity and assign ranks
    sensitivities.sort((a, b) => b.elasticity - a.elasticity);
    sensitivities.forEach((s, i) => { s.rank = i + 1; });

    const most = sensitivities[0];
    const least = sensitivities[sensitivities.length - 1];

    // Generate recommendations via LLM
    const recPrompt = `Given sensitivity analysis results for a ${simulation.simulation_type} scenario:
Most sensitive variable: ${most.variable} (elasticity: ${most.elasticity})
Least sensitive variable: ${least.variable} (elasticity: ${least.elasticity})
All variables ranked: ${sensitivities.map(s => `${s.variable}: ${s.elasticity}`).join(', ')}

Provide 3-5 actionable recommendations as a JSON array of strings.`;

    let recommendations: string[] = [];
    try {
      const resp = await this.llmService.generate(recPrompt, {
        model: 'llama3.2:3b',
        systemPrompt: 'You are a risk analyst. Provide actionable recommendations based on sensitivity analysis. Return a JSON array of strings.',
        temperature: 0.3,
        maxTokens: 300,
        format: 'json',
      });
      const parsed = JSON.parse(resp);
      recommendations = Array.isArray(parsed) ? parsed : parsed.recommendations || [];
    } catch {
      recommendations = [
        `Focus risk mitigation on ${most.variable} ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â it has ${most.elasticity.toFixed(1)}x impact per 10% change`,
        `${least.variable} has minimal sensitivity ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â deprioritize in stress testing`,
        `Monitor ${sensitivities.slice(0, 3).map(s => s.variable).join(', ')} as your top risk drivers`,
      ];
    }

    return {
      simulationId,
      variables: sensitivities,
      mostSensitive: {
        variable: most.variable,
        elasticity: most.elasticity,
        insight: `${most.variable} has ${most.elasticity.toFixed(1)}x impact ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â a 10% change here has disproportionate effect on outcomes`,
      },
      leastSensitive: {
        variable: least.variable,
        elasticity: least.elasticity,
        insight: `${least.variable} has minimal impact (${least.elasticity.toFixed(2)}x) ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â safe to deprioritize`,
      },
      recommendations,
      generatedAt: new Date(),
    };
  }

  /**
   * Calculate baseline risk score from shocks against the digital twin.
   */
  private calculateBaselineRiskScore(shocks: Shock[], twin: DigitalTwin | null): number {
    let score = 50; // Neutral baseline
    for (const shock of shocks) {
      const magnitude = Math.abs(shock.value);
      if (shock.type === 'percentage') score += magnitude * 0.3;
      else if (shock.type === 'multiplier') score += (shock.value - 1) * 20;
      else score += magnitude * 0.01;
    }
    // Adjust for org health
    if (twin?.healthScore) score -= (twin.healthScore - 50) * 0.2;
    return Math.max(0, Math.min(100, score));
  }

  /**
   * Calculate risk score with one variable varied.
   */
  private calculateVariedRiskScore(
    shocks: Shock[],
    twin: DigitalTwin | null,
    variableName: string,
    newValue: number
  ): number {
    let baseScore = this.calculateBaselineRiskScore(shocks, twin);

    // Apply the variable change effect
    const shockAffecting = shocks.find(s => s.target.toLowerCase().includes(variableName.replace('_', '')));
    if (shockAffecting) {
      const originalMagnitude = Math.abs(shockAffecting.value);
      const scaledMagnitude = originalMagnitude * (newValue > 0 ? 1.1 : 0.9);
      baseScore += (scaledMagnitude - originalMagnitude) * 0.5;
    }

    // Financial resilience effect
    if (['revenue', 'cash_flow', 'gross_margin'].includes(variableName)) {
      baseScore -= newValue * 0.00001; // Higher = more resilient
    } else if (['burn_rate', 'churn_rate', 'operating_costs'].includes(variableName)) {
      baseScore += newValue * 0.00001; // Higher = more risky
    }

    return Math.max(0, Math.min(100, baseScore));
  }

  /**
   * Historical Calibration: How accurate were past predictions?
   * Compares past simulation predictions against actual outcomes from Echo.
   */
  async calibrateModel(organizationId: string): Promise<{
    organizationId: string;
    calibrationData: Array<{
      simulationId: string;
      simulationType: string;
      simulationDate: Date;
      predictedOutcome: string;
      predictedSentiment: string;
      actualOutcome: string | null;
      actualStatus: string | null;
      errorMargin: number | null;
    }>;
    statistics: {
      totalSimulations: number;
      withActualOutcomes: number;
      meanError: number;
      medianError: number;
      bias: number;
      calibrationFactor: number;
      accuracy: string;
    };
    recommendation: string;
    generatedAt: Date;
  }> {
    // Get completed simulations
    const simulations = await prisma.crucible_simulations.findMany({
      where: { organization_id: organizationId, status: 'COMPLETED' },
      orderBy: { completed_at: 'desc' },
      take: 50,
      select: {
        id: true,
        simulation_type: true,
        created_at: true,
        completed_at: true,
        results_summary: true,
      },
    });

    // Get actual decision outcomes from Echo
    const outcomes = await prisma.decision_outcomes.findMany({
      where: { organization_id: organizationId },
      orderBy: { decision_date: 'desc' },
      take: 100,
    });

    const calibrationData: Array<{
      simulationId: string;
      simulationType: string;
      simulationDate: Date;
      predictedOutcome: string;
      predictedSentiment: string;
      actualOutcome: string | null;
      actualStatus: string | null;
      errorMargin: number | null;
    }> = [];

    const errors: number[] = [];

    for (const sim of simulations) {
      const summary = sim.results_summary as any;
      const predictedSentiment = summary?.worstCase?.sentiment || summary?.mostLikely?.sentiment || 'UNKNOWN';
      const predictedOutcome = summary?.mostLikely?.summary || 'No prediction available';

      // Find closest matching outcome (by date proximity)
      const simDate = sim.completed_at || sim.created_at;
      const matchingOutcome = outcomes.find(o => {
        const daysDiff = Math.abs((o.decision_date.getTime() - simDate.getTime()) / (1000 * 60 * 60 * 24));
        return daysDiff < 90; // Within 90 days
      });

      let errorMargin: number | null = null;
      if (matchingOutcome) {
        // Calculate prediction error
        const sentimentScores: Record<string, number> = {
          'CATASTROPHIC': 0, 'NEGATIVE': 25, 'NEUTRAL': 50, 'POSITIVE': 75, 'OPTIMAL': 100,
        };
        const statusScores: Record<string, number> = {
          'failure': 10, 'partial': 40, 'inconclusive': 50, 'pending': 50, 'success': 90,
        };
        const predicted = sentimentScores[predictedSentiment] ?? 50;
        const actual = statusScores[matchingOutcome.status] ?? 50;
        errorMargin = Math.abs(predicted - actual) / 100;
        errors.push(errorMargin);
      }

      calibrationData.push({
        simulationId: sim.id,
        simulationType: sim.simulation_type,
        simulationDate: simDate,
        predictedOutcome,
        predictedSentiment,
        actualOutcome: matchingOutcome?.decision_title || null,
        actualStatus: matchingOutcome?.status || null,
        errorMargin,
      });
    }

    // Calculate statistics
    const totalSimulations = simulations.length;
    const withActualOutcomes = errors.length;
    const meanError = errors.length > 0 ? errors.reduce((a, b) => a + b, 0) / errors.length : 0;
    const sortedErrors = [...errors].sort((a, b) => a - b);
    const medianError = errors.length > 0 ? sortedErrors[Math.floor(errors.length / 2)] : 0;

    // Bias: positive = optimistic, negative = pessimistic
    const biasValues = calibrationData
      .filter(d => d.errorMargin !== null)
      .map(d => {
        const sentScores: Record<string, number> = { 'CATASTROPHIC': 0, 'NEGATIVE': 25, 'NEUTRAL': 50, 'POSITIVE': 75, 'OPTIMAL': 100 };
        const statScores: Record<string, number> = { 'failure': 10, 'partial': 40, 'inconclusive': 50, 'pending': 50, 'success': 90 };
        return ((sentScores[d.predictedSentiment] ?? 50) - (statScores[d.actualStatus || 'pending'] ?? 50)) / 100;
      });
    const bias = biasValues.length > 0 ? biasValues.reduce((a, b) => a + b, 0) / biasValues.length : 0;
    const calibrationFactor = 1 - bias;

    let accuracy: string;
    let recommendation: string;
    if (withActualOutcomes < 5) {
      accuracy = 'Insufficient data';
      recommendation = `Only ${withActualOutcomes} simulations have matched outcomes. Run more simulations and link decision outcomes via Echo to build calibration data.`;
    } else if (meanError < 0.15) {
      accuracy = 'Excellent';
      recommendation = `Model accuracy: Excellent (${Math.round((1 - meanError) * 100)}%). Predictions are highly reliable. Continue current approach.`;
    } else if (meanError < 0.30) {
      accuracy = 'Good';
      recommendation = `Model accuracy: Good (${Math.round((1 - meanError) * 100)}%). ${bias > 0.1 ? 'Model tends to be optimistic ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â apply calibration factor of ' + calibrationFactor.toFixed(2) : bias < -0.1 ? 'Model tends to be pessimistic ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â adjust upward by ' + Math.abs(bias * 100).toFixed(0) + '%' : 'No systematic bias detected.'}`;
    } else {
      accuracy = 'Needs Improvement';
      recommendation = `Model accuracy: ${Math.round((1 - meanError) * 100)}%. Consider adjusting simulation parameters. ${bias > 0 ? 'Reduce optimism in scenario assumptions.' : 'Increase baseline resilience assumptions.'}`;
    }

    return {
      organizationId,
      calibrationData: calibrationData.slice(0, 20),
      statistics: {
        totalSimulations,
        withActualOutcomes,
        meanError: Math.round(meanError * 1000) / 1000,
        medianError: Math.round(medianError * 1000) / 1000,
        bias: Math.round(bias * 1000) / 1000,
        calibrationFactor: Math.round(calibrationFactor * 1000) / 1000,
        accuracy,
      },
      recommendation,
      generatedAt: new Date(),
    };
  }

  /**
   * Scenario Correlations: Which bad outcomes happen together?
   * Analyzes outcome co-occurrence across completed simulations.
   */
  async analyzeScenarioCorrelations(organizationId: string): Promise<{
    organizationId: string;
    correlations: Array<{
      pair: [string, string];
      correlation: number;
      coOccurrence: number;
      warning: string | null;
    }>;
    clusteredRisks: Array<{
      cluster: string[];
      probability: number;
      warning: string;
    }>;
    totalSimulationsAnalyzed: number;
    generatedAt: Date;
  }> {
    const simulations = await prisma.crucible_simulations.findMany({
      where: { organization_id: organizationId, status: 'COMPLETED' },
      select: {
        id: true,
        simulation_type: true,
        results_summary: true,
      },
    });

    // Build outcome vectors per simulation type
    const typeOutcomes = new Map<string, { negative: number; total: number }>();
    for (const sim of simulations) {
      const summary = sim.results_summary as any;
      const sentiment = summary?.mostLikely?.sentiment || summary?.worstCase?.sentiment || 'NEUTRAL';
      const isNegative = ['CATASTROPHIC', 'NEGATIVE'].includes(sentiment);

      const existing = typeOutcomes.get(sim.simulation_type) || { negative: 0, total: 0 };
      existing.total++;
      if (isNegative) existing.negative++;
      typeOutcomes.set(sim.simulation_type, existing);
    }

    // Calculate pairwise correlations
    const types = Array.from(typeOutcomes.keys());
    const correlations: Array<{
      pair: [string, string];
      correlation: number;
      coOccurrence: number;
      warning: string | null;
    }> = [];

    for (let i = 0; i < types.length; i++) {
      for (let j = i + 1; j < types.length; j++) {
        const a = typeOutcomes.get(types[i])!;
        const b = typeOutcomes.get(types[j])!;
        const pA = a.total > 0 ? a.negative / a.total : 0;
        const pB = b.total > 0 ? b.negative / b.total : 0;

        // Simple co-occurrence correlation
        const coOccurrence = pA * pB;
        const correlation = Math.min(1, (pA + pB) / 2 + (pA > 0.5 && pB > 0.5 ? 0.3 : 0));

        correlations.push({
          pair: [types[i], types[j]],
          correlation: Math.round(correlation * 100) / 100,
          coOccurrence: Math.round(coOccurrence * 100) / 100,
          warning: correlation > 0.7 ? `${types[i]} and ${types[j]} tend to cascade together ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â prepare for both simultaneously` : null,
        });
      }
    }

    correlations.sort((a, b) => b.correlation - a.correlation);

    // Identify risk clusters (groups of 3+ correlated scenarios)
    const clusteredRisks: Array<{ cluster: string[]; probability: number; warning: string }> = [];
    const highCorr = correlations.filter(c => c.correlation > 0.5);

    // Build adjacency for clustering
    const adjacency = new Map<string, Set<string>>();
    for (const c of highCorr) {
      if (!adjacency.has(c.pair[0])) adjacency.set(c.pair[0], new Set());
      if (!adjacency.has(c.pair[1])) adjacency.set(c.pair[1], new Set());
      adjacency.get(c.pair[0])!.add(c.pair[1]);
      adjacency.get(c.pair[1])!.add(c.pair[0]);
    }

    // Simple connected components
    const visited = new Set<string>();
    for (const node of adjacency.keys()) {
      if (visited.has(node)) continue;
      const cluster: string[] = [];
      const queue = [node];
      while (queue.length > 0) {
        const current = queue.shift()!;
        if (visited.has(current)) continue;
        visited.add(current);
        cluster.push(current);
        for (const neighbor of adjacency.get(current) || []) {
          if (!visited.has(neighbor)) queue.push(neighbor);
        }
      }
      if (cluster.length >= 2) {
        const clusterProb = cluster.reduce((sum, t) => {
          const data = typeOutcomes.get(t);
          return sum + (data ? data.negative / data.total : 0);
        }, 0) / cluster.length;

        clusteredRisks.push({
          cluster,
          probability: Math.round(clusterProb * 100) / 100,
          warning: `These ${cluster.length} scenario types cascade together ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â if one triggers, expect the others`,
        });
      }
    }

    return {
      organizationId,
      correlations: correlations.slice(0, 20),
      clusteredRisks,
      totalSimulationsAnalyzed: simulations.length,
      generatedAt: new Date(),
    };
  }

  /**
   * Scenario Library: Industry-specific + saved scenarios with recommendations.
   */
  async getScenarioLibrary(
    organizationId: string
  ): Promise<{
    industryScenarios: Array<{ type: SimulationType; name: string; description: string; relevance: string }>;
    savedScenarios: Array<{ id: string; name: string; type: string; usageCount: number; lastUsed: Date | null }>;
    recommended: Array<{ type: SimulationType; name: string; reason: string }>;
    untestedTypes: SimulationType[];
    generatedAt: Date;
  }> {
    const [org, simulations] = await Promise.all([
      prisma.organizations.findUnique({ where: { id: organizationId } }),
      prisma.crucible_simulations.findMany({
        where: { organization_id: organizationId },
        select: { id: true, name: true, simulation_type: true, created_at: true },
        orderBy: { created_at: 'desc' },
      }),
    ]);

    const industry = (org?.industry || 'technology').toLowerCase();

    // Industry-specific scenario recommendations
    const industryMap: Record<string, Array<{ type: SimulationType; relevance: string }>> = {
      'financial services': [
        { type: 'FINANCIAL_STRESS', relevance: 'Core risk ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â interest rate and credit exposure' },
        { type: 'REGULATORY_CHANGE', relevance: 'Basel/Dodd-Frank compliance shifts' },
        { type: 'CYBER_ATTACK', relevance: 'PCI-DSS and customer data protection' },
        { type: 'MARKET_DISRUPTION', relevance: 'Fintech competition and market volatility' },
        { type: 'ESG_EVENT', relevance: 'ESG reporting mandates and greenwashing risk' },
      ],
      'healthcare': [
        { type: 'REGULATORY_CHANGE', relevance: 'HIPAA/FDA compliance and reimbursement changes' },
        { type: 'TALENT_EXODUS', relevance: 'Clinical staff shortages and burnout' },
        { type: 'SUPPLY_CHAIN', relevance: 'Medical supply and pharmaceutical disruptions' },
        { type: 'CYBER_ATTACK', relevance: 'PHI breach and ransomware targeting' },
        { type: 'TECHNOLOGY_FAILURE', relevance: 'EHR system failures and patient safety' },
      ],
      'technology': [
        { type: 'CYBER_ATTACK', relevance: 'Core infrastructure and IP protection' },
        { type: 'TALENT_EXODUS', relevance: 'Key engineer retention in competitive market' },
        { type: 'MARKET_DISRUPTION', relevance: 'Competitive disruption and platform shifts' },
        { type: 'FINANCIAL_STRESS', relevance: 'Funding environment and burn rate management' },
        { type: 'TECHNOLOGY_FAILURE', relevance: 'System outages and SLA compliance' },
      ],
      'manufacturing': [
        { type: 'SUPPLY_CHAIN', relevance: 'Material sourcing and logistics resilience' },
        { type: 'OPERATIONAL_SHOCK', relevance: 'Production line failures and quality issues' },
        { type: 'TALENT_EXODUS', relevance: 'Skilled labor shortages' },
        { type: 'ESG_EVENT', relevance: 'Environmental compliance and emissions' },
        { type: 'MARKET_DISRUPTION', relevance: 'Demand shifts and competitor automation' },
      ],
      'energy': [
        { type: 'REGULATORY_CHANGE', relevance: 'NERC CIP and environmental regulations' },
        { type: 'ESG_EVENT', relevance: 'Energy transition and carbon mandates' },
        { type: 'SUPPLY_CHAIN', relevance: 'Fuel sourcing and grid dependencies' },
        { type: 'OPERATIONAL_SHOCK', relevance: 'Grid failures and safety incidents' },
        { type: 'BLACK_SWAN', relevance: 'Natural disasters and geopolitical disruption' },
      ],
    };

    // Find matching industry scenarios or default to technology
    const matchedIndustry = Object.keys(industryMap).find(k => industry.includes(k)) || 'technology';
    const industryScenarios = (industryMap[matchedIndustry] || industryMap['technology']).map(s => ({
      type: s.type,
      name: SCENARIO_TEMPLATES[s.type]?.name || s.type,
      description: SCENARIO_TEMPLATES[s.type]?.description || '',
      relevance: s.relevance,
    }));

    // Saved/used scenarios
    const usageCounts = new Map<string, { count: number; lastUsed: Date | null; name: string; type: string }>();
    for (const sim of simulations) {
      const key = sim.simulation_type;
      const existing = usageCounts.get(key) || { count: 0, lastUsed: null, name: sim.name, type: sim.simulation_type };
      existing.count++;
      if (!existing.lastUsed || sim.created_at > existing.lastUsed) existing.lastUsed = sim.created_at;
      usageCounts.set(key, existing);
    }
    const savedScenarios = Array.from(usageCounts.entries())
      .map(([key, data]) => ({
        id: key,
        name: data.name,
        type: data.type,
        usageCount: data.count,
        lastUsed: data.lastUsed,
      }))
      .sort((a, b) => b.usageCount - a.usageCount);

    // Find untested scenario types
    const testedTypes = new Set(simulations.map(s => s.simulation_type));
    const allTypes = Object.keys(SCENARIO_TEMPLATES) as SimulationType[];
    const untestedTypes = allTypes.filter(t => !testedTypes.has(t) && t !== 'CUSTOM');

    // Recommend scenarios
    const recommended: Array<{ type: SimulationType; name: string; reason: string }> = [];
    for (const untested of untestedTypes.slice(0, 3)) {
      recommended.push({
        type: untested,
        name: SCENARIO_TEMPLATES[untested]?.name || untested,
        reason: `Never tested ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â blind spot in resilience coverage`,
      });
    }
    // Add most-used scenario as re-run recommendation
    if (savedScenarios.length > 0 && savedScenarios[0].lastUsed) {
      const daysSinceLastRun = Math.floor((Date.now() - savedScenarios[0].lastUsed.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceLastRun > 30) {
        recommended.push({
          type: savedScenarios[0].type as SimulationType,
          name: SCENARIO_TEMPLATES[savedScenarios[0].type as SimulationType]?.name || savedScenarios[0].type,
          reason: `Last run ${daysSinceLastRun} days ago ÃƒÆ’Ã‚Â¢ÃƒÂ¢Ã¢â‚¬Å¡Ã‚Â¬ÃƒÂ¢Ã¢â€šÂ¬Ã‚Â re-test for current conditions`,
        });
      }
    }

    return {
      industryScenarios,
      savedScenarios,
      recommended,
      untestedTypes,
      generatedAt: new Date(),
    };
  }

  // ===========================================================================
  // DASHBOARD
  // ===========================================================================

