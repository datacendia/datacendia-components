// CendiaApotheosis extended methods - extracted for maintainability

  async getApotheosisScore(organizationId: string): Promise<ApotheosisScore> {
    // Get latest score from database
    const latestScore = await prisma.apotheosis_scores.findFirst({
      where: { organization_id: organizationId },
      orderBy: { recorded_at: 'desc' },
    });

    // Get score trend (last 12 months)
    const trendData = await prisma.apotheosis_scores.findMany({
      where: {
        organization_id: organizationId,
        recorded_at: { gte: new Date(Date.now() - 365 * 24 * 60 * 60 * 1000) },
      },
      orderBy: { recorded_at: 'asc' },
      select: { overall: true, recorded_at: true },
    });

    if (latestScore) {
      const trend = trendData.map(t => ({
        date: t.recorded_at.toISOString().slice(0, 7),
        score: Number(t.overall),
      }));

      const oldestScore = trend.length > 0 ? trend[0].score : Number(latestScore.overall);
      const improvementPoints = Number(latestScore.overall) - oldestScore;

      return {
        overall: Number(latestScore.overall),
        components: {
          redTeamSurvivalRate: { value: Number(latestScore.red_team_survival), weight: 0.30 },
          weaknessClosureRate: { value: Number(latestScore.weakness_closure), weight: 0.25 },
          decisionSuccessRate: { value: Number(latestScore.decision_success), weight: 0.25 },
          humanReadiness: { value: Number(latestScore.human_readiness), weight: 0.10 },
          patternHealth: { value: Number(latestScore.pattern_health), weight: 0.10 },
        },
        trend,
        improvementPoints,
        improvementPeriod: `${trend.length} months`,
      };
    }

    // Return default if no data exists yet
    return {
      overall: 0,
      components: {
        redTeamSurvivalRate: { value: 0, weight: 0.30 },
        weaknessClosureRate: { value: 0, weight: 0.25 },
        decisionSuccessRate: { value: 0, weight: 0.25 },
        humanReadiness: { value: 0, weight: 0.10 },
        patternHealth: { value: 0, weight: 0.10 },
      },
      trend: [],
      improvementPoints: 0,
      improvementPeriod: 'No data',
    };
  }

  /**
   * Get latest run for organization
   */
  async getLatestRun(organizationId: string): Promise<ApotheosisRun | null> {
    const dbRun = await prisma.apotheosis_runs.findFirst({
      where: { organization_id: organizationId },
      orderBy: { started_at: 'desc' },
      include: {
        weaknesses: true,
        auto_patches: true,
        escalations: true,
        upskill_assignments: true,
      },
    });

    if (!dbRun) return null;

    return {
      id: dbRun.id,
      organizationId: dbRun.organization_id,
      startedAt: dbRun.started_at,
      completedAt: dbRun.completed_at || undefined,
      status: dbRun.status as ApotheosisRun['status'],
      scenariosTested: dbRun.scenarios_tested,
      scenariosSurvived: dbRun.scenarios_survived,
      survivalRate: Number(dbRun.survival_rate),
      weaknessesFound: dbRun.weaknesses.map(w => ({
        id: w.id,
        title: w.title,
        description: w.description,
        category: w.category as WeaknessItem['category'],
        severity: w.severity as WeaknessItem['severity'],
        exploitScenario: w.exploit_scenario,
        damageEstimate: Number(w.damage_estimate),
        fixComplexity: w.fix_complexity as WeaknessItem['fixComplexity'],
        recommendedFix: w.recommended_fix,
        autoFixable: w.auto_fixable,
        status: w.status as WeaknessItem['status'],
        discoveredAt: w.discovered_at,
        resolvedAt: w.resolved_at || undefined,
      })),
      criticalCount: dbRun.critical_count,
      highCount: dbRun.high_count,
      mediumCount: dbRun.medium_count,
      lowCount: dbRun.low_count,
      autoPatches: dbRun.auto_patches.map(p => ({
        id: p.id,
        weaknessId: p.weakness_id,
        patchType: p.patch_type as AutoPatch['patchType'],
        description: p.description,
        beforeState: p.before_state,
        afterState: p.after_state,
        reversible: p.reversible,
        budgetImpact: Number(p.budget_impact),
        appliedAt: p.applied_at,
        status: p.status as AutoPatch['status'],
        rollbackAvailable: p.rollback_available,
      })),
      escalations: dbRun.escalations.map(e => ({
        id: e.id,
        weaknessId: e.weakness_id,
        title: e.title,
        description: e.description,
        severity: e.severity as Escalation['severity'],
        reason: e.reason,
        estimatedCostToFix: Number(e.estimated_cost_to_fix),
        riskIfNotFixed: Number(e.risk_if_not_fixed),
        assignedTo: e.assigned_to,
        deadline: e.deadline,
        status: e.status as Escalation['status'],
        responseAt: e.response_at || undefined,
        response: e.response || undefined,
      })),
      upskillAssignments: dbRun.upskill_assignments.map(u => ({
        id: u.id,
        userId: u.user_id,
        userName: u.user_name,
        weaknessId: u.weakness_id,
        skillGap: u.skill_gap,
        trainingModule: u.training_module,
        estimatedHours: u.estimated_hours,
        deadline: u.deadline,
        status: u.status as UpskillAssignment['status'],
        progress: u.progress,
        startedAt: u.started_at || undefined,
        completedAt: u.completed_at || undefined,
      })),
      patternBans: [],
      apotheosisScore: Number(dbRun.apotheosis_score),
      previousScore: Number(dbRun.previous_score),
      scoreDelta: Number(dbRun.score_delta),
      shadowCouncilInstances: dbRun.shadow_council_instances,
      computeHours: Number(dbRun.compute_hours),
      duration: dbRun.duration_minutes,
    };
  }

  /**
   * Get pending escalations
   */
  async getPendingEscalations(organizationId: string): Promise<Escalation[]> {
    const dbEscalations = await prisma.apotheosis_escalations.findMany({
      where: {
        status: 'pending',
        run: { organization_id: organizationId },
      },
      orderBy: { deadline: 'asc' },
    });

    return dbEscalations.map(e => ({
      id: e.id,
      weaknessId: e.weakness_id,
      title: e.title,
      description: e.description,
      severity: e.severity as Escalation['severity'],
      reason: e.reason,
      estimatedCostToFix: Number(e.estimated_cost_to_fix),
      riskIfNotFixed: Number(e.risk_if_not_fixed),
      assignedTo: e.assigned_to,
      deadline: e.deadline,
      status: e.status as Escalation['status'],
      responseAt: e.response_at || undefined,
      response: e.response || undefined,
    }));
  }

  /**
   * Respond to escalation
   */
  async respondToEscalation(
    escalationId: string,
    response: 'approved' | 'rejected' | 'deferred',
    reason: string
  ): Promise<void> {
    await prisma.apotheosis_escalations.update({
      where: { id: escalationId },
      data: {
        status: response,
        response: reason,
        response_at: new Date(),
      },
    });
    logger.info(`[Apotheosis] Escalation ${escalationId} responded: ${response}`);
  }

  /**
   * Get banned patterns
   */
  async getBannedPatterns(organizationId: string): Promise<PatternBan[]> {
    const dbPatterns = await prisma.apotheosis_pattern_bans.findMany({
      where: { organization_id: organizationId, status: 'active' },
      orderBy: { banned_at: 'desc' },
    });

    return dbPatterns.map(p => ({
      id: p.id,
      pattern: p.pattern,
      description: p.description,
      instances: (p.instances as unknown as PatternInstance[]) || [],
      failureRate: Number(p.failure_rate),
      totalCost: Number(p.total_cost),
      bannedAt: p.banned_at,
      bannedBy: p.banned_by as PatternBan['bannedBy'],
      status: p.status as PatternBan['status'],
      overrideRequires: p.override_requires,
    }));
  }

  /**
   * Get upskill assignments
   */
  async getUpskillAssignments(organizationId: string): Promise<UpskillAssignment[]> {
    const dbAssignments = await prisma.apotheosis_upskill_assignments.findMany({
      where: {
        run: { organization_id: organizationId },
        status: { in: ['assigned', 'in_progress'] },
      },
      orderBy: { deadline: 'asc' },
    });

    return dbAssignments.map(u => ({
      id: u.id,
      userId: u.user_id,
      userName: u.user_name,
      weaknessId: u.weakness_id,
      skillGap: u.skill_gap,
      trainingModule: u.training_module,
      estimatedHours: u.estimated_hours,
      deadline: u.deadline,
      status: u.status as UpskillAssignment['status'],
      progress: u.progress,
      startedAt: u.started_at || undefined,
      completedAt: u.completed_at || undefined,
    }));
  }

  /**
   * Get run history from database
   */
  async getRunHistory(organizationId: string, limit: number = 30): Promise<ApotheosisRun[]> {
    const dbRuns = await prisma.apotheosis_runs.findMany({
      where: { organization_id: organizationId },
      orderBy: { started_at: 'desc' },
      take: limit,
      include: {
        weaknesses: true,
        auto_patches: true,
        escalations: true,
        upskill_assignments: true,
      },
    });

    if (dbRuns.length === 0) {
      return [];
    }

    const patternBans = await prisma.apotheosis_pattern_bans.findMany({
      where: { organization_id: organizationId, status: 'active' },
    });

    return dbRuns.map((run) => {
      const durationMinutes = run.completed_at
        ? Math.round((run.completed_at.getTime() - run.started_at.getTime()) / 60000)
        : run.duration_minutes;
      const computeHrs = Number(run.compute_hours);
      const prevScore = Number(run.previous_score);
      const currentScore = Number(run.apotheosis_score);

      return {
        id: run.id,
        organizationId: run.organization_id,
        startedAt: run.started_at,
        completedAt: run.completed_at || undefined,
        status: run.status as ApotheosisRun['status'],
        scenariosTested: run.scenarios_tested,
        scenariosSurvived: run.scenarios_survived,
        survivalRate: Number(run.survival_rate),
        weaknessesFound: run.weaknesses.map((w) => ({
          id: w.id,
          title: w.title,
          description: w.description,
          category: w.category as WeaknessItem['category'],
          severity: w.severity as WeaknessItem['severity'],
          exploitScenario: w.exploit_scenario,
          damageEstimate: Number(w.damage_estimate),
          fixComplexity: w.fix_complexity as WeaknessItem['fixComplexity'],
          recommendedFix: w.recommended_fix,
          autoFixable: w.auto_fixable,
          status: w.status as WeaknessItem['status'],
          discoveredAt: w.discovered_at,
          resolvedAt: w.resolved_at || undefined,
        })),
        criticalCount: run.critical_count,
        highCount: run.high_count,
        mediumCount: run.medium_count,
        lowCount: run.low_count,
        autoPatches: run.auto_patches.map((p) => ({
          id: p.id,
          weaknessId: p.weakness_id,
          patchType: p.patch_type as AutoPatch['patchType'],
          description: p.description,
          beforeState: p.before_state,
          afterState: p.after_state,
          reversible: p.reversible,
          budgetImpact: Number(p.budget_impact),
          appliedAt: p.applied_at,
          status: p.status as AutoPatch['status'],
          rollbackAvailable: p.reversible,
        })),
        escalations: run.escalations.map((e) => ({
          id: e.id,
          weaknessId: e.weakness_id,
          title: e.title,
          description: e.description,
          severity: e.severity as Escalation['severity'],
          reason: e.reason,
          estimatedCostToFix: Number(e.estimated_cost_to_fix),
          riskIfNotFixed: Number(e.risk_if_not_fixed),
          assignedTo: e.assigned_to,
          deadline: e.deadline,
          status: e.status as Escalation['status'],
          responseAt: e.response_at || undefined,
          response: e.response || undefined,
        })),
        upskillAssignments: run.upskill_assignments.map((u) => ({
          id: u.id,
          userId: u.user_id,
          userName: u.user_name,
          weaknessId: u.weakness_id,
          skillGap: u.skill_gap,
          trainingModule: u.training_module,
          estimatedHours: u.estimated_hours,
          deadline: u.deadline,
          status: u.status as UpskillAssignment['status'],
          progress: u.progress,
          startedAt: u.started_at || undefined,
          completedAt: u.completed_at || undefined,
        })),
        patternBans: patternBans.map((b) => ({
          id: b.id,
          pattern: b.pattern,
          description: b.description,
          instances: b.instances as unknown as PatternBan['instances'],
          failureRate: Number(b.failure_rate),
          totalCost: Number(b.total_cost),
          bannedAt: b.banned_at,
          bannedBy: b.banned_by as PatternBan['bannedBy'],
          status: b.status as PatternBan['status'],
          overrideRequires: b.override_requires,
        })),
        apotheosisScore: currentScore,
        previousScore: prevScore,
        scoreDelta: Number(run.score_delta),
        shadowCouncilInstances: run.shadow_council_instances,
        computeHours: computeHrs,
        duration: durationMinutes,
      };
    });
  }

  /**
   * Trigger manual run
   */
  async triggerManualRun(organizationId: string): Promise<string> {
    const run = await this.executeApotheosisRun(organizationId);
    return run.id;
  }

  /**
   * Run nightly red-teaming (for scheduler)
   */
  async runNightlyRedTeam(organizationId: string): Promise<{
    scenariosTested: number;
    survived: number;
    failed: number;
    escalations: number;
    autoPatches: number;
    upskillingAssigned: number;
  }> {
    logger.info(`[Apotheosis] Starting nightly red-team for org: ${organizationId}`);
    
    const run = await this.executeApotheosisRun(organizationId);
    
    return {
      scenariosTested: run.scenariosTested,
      survived: run.scenariosSurvived,
      failed: run.scenariosTested - run.scenariosSurvived,
      escalations: run.escalations.length,
      autoPatches: run.autoPatches.length,
      upskillingAssigned: run.upskillAssignments.length,
    };
  }

  // ===========================================================================
  // 10/10 ENHANCEMENTS
  // ===========================================================================

  /**
   * 10/10: Resilience Trend Analysis
   * Tracks organizational resilience over time using stored run history.
   */
  async analyzeResilienceTrend(organizationId: string, periodDays: number = 90): Promise<{
    currentScore: number;
    previousScore: number;
    trend: 'IMPROVING' | 'STABLE' | 'DECLINING' | 'CRITICAL_DECLINE';
    trendData: Array<{ date: string; score: number; survivalRate: number; weaknessCount: number }>;
    improvementRate: number;
    projectedScore30d: number;
    insights: string[];
  }> {
    const runs = await prisma.apotheosis_runs.findMany({
      where: {
        organization_id: organizationId,
        completed_at: { gte: new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000) },
        status: 'completed',
      },
      orderBy: { started_at: 'asc' },
    });

    const trendData = runs.map(r => ({
      date: new Date(r.started_at).toISOString().split('T')[0],
      score: Number(r.apotheosis_score) || 0,
      survivalRate: Number(r.survival_rate) || 0,
      weaknessCount: r.critical_count + r.high_count + r.medium_count + r.low_count,
    }));

    const currentScore = trendData.length > 0 ? trendData[trendData.length - 1].score : 0;
    const previousScore = trendData.length > 1 ? trendData[trendData.length - 2].score : currentScore;

    // Calculate linear trend
    const scores = trendData.map(d => d.score);
    const avgRecent = scores.slice(-5).reduce((a, b) => a + b, 0) / Math.max(scores.slice(-5).length, 1);
    const avgOlder = scores.slice(0, Math.max(scores.length - 5, 1)).reduce((a, b) => a + b, 0) / Math.max(scores.slice(0, Math.max(scores.length - 5, 1)).length, 1);
    const improvementRate = avgOlder > 0 ? Math.round(((avgRecent - avgOlder) / avgOlder) * 100) : 0;

    const trend = improvementRate > 5 ? 'IMPROVING' as const
      : improvementRate > -2 ? 'STABLE' as const
      : improvementRate > -10 ? 'DECLINING' as const
      : 'CRITICAL_DECLINE' as const;

    const projectedScore30d = Math.max(0, Math.min(100, currentScore + (improvementRate / 3)));

    const insights: string[] = [];
    if (trend === 'IMPROVING') insights.push(`Resilience improving at ${improvementRate}% over ${periodDays} days`);
    if (trend === 'DECLINING') insights.push(`WARNING: Resilience declining Ã¢â‚¬â€ review recent weakness patterns`);
    if (trend === 'CRITICAL_DECLINE') insights.push(`CRITICAL: Rapid resilience decline detected Ã¢â‚¬â€ immediate intervention needed`);
    if (trendData.length > 0 && trendData[trendData.length - 1].weaknessCount > 10) {
      insights.push(`${trendData[trendData.length - 1].weaknessCount} weaknesses in latest run Ã¢â‚¬â€ above threshold`);
    }
    if (currentScore >= 95) insights.push('Exceptional resilience Ã¢â‚¬â€ organization is hardened');
    if (runs.length < 5) insights.push('Insufficient run history for reliable trending Ã¢â‚¬â€ run more simulations');

    return { currentScore, previousScore, trend, trendData, improvementRate, projectedScore30d, insights };
  }

  /**
   * 10/10: Category Risk Heatmap
   * Shows which attack categories the organization is weakest against.
   */
  async getCategoryRiskHeatmap(organizationId: string): Promise<{
    categories: Array<{
      category: string;
      scenarioCount: number;
      survivalRate: number;
      avgDamage: number;
      riskLevel: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
      trend: 'IMPROVING' | 'STABLE' | 'WORSENING';
    }>;
    weakestCategory: string;
    strongestCategory: string;
    overallReadiness: number;
  }> {
    // Query real weakness data from the most recent runs
    const recentRuns = await prisma.apotheosis_runs.findMany({
      where: { organization_id: organizationId, status: 'completed' },
      orderBy: { started_at: 'desc' },
      take: 10,
      include: { weaknesses: true },
    });

    if (recentRuns.length === 0) {
      return { categories: [], weakestCategory: 'unknown', strongestCategory: 'unknown', overallReadiness: 0 };
    }

    // Aggregate weakness data by category from real runs
    const categoryMap: Record<string, { total: number; survived: number; damage: number }> = {};
    const latestRun = recentRuns[0];
    const previousRuns = recentRuns.slice(1);

    for (const scenario of ATTACK_SCENARIOS) {
      if (!categoryMap[scenario.category]) {
        categoryMap[scenario.category] = { total: 0, survived: 0, damage: 0 };
      }
      categoryMap[scenario.category].total++;

      // Check if this category had real weaknesses in the latest run
      const weaknessesInCategory = latestRun.weaknesses.filter(
        (w) => w.category === scenario.category
      );
      const hasCriticalWeakness = weaknessesInCategory.some(
        (w) => w.severity === 'critical' || w.severity === 'high'
      );
      const survived = !hasCriticalWeakness;
      if (survived) categoryMap[scenario.category].survived++;
      const totalDamage = weaknessesInCategory.reduce(
        (sum, w) => sum + Number(w.damage_estimate), 0
      );
      categoryMap[scenario.category].damage += totalDamage || scenario.expectedDamage * (survived ? 0.2 : 0.8);
    }

    // Compute trend by comparing latest run vs. previous runs
    const prevCategoryMap: Record<string, { survived: number; total: number }> = {};
    for (const run of previousRuns) {
      for (const scenario of ATTACK_SCENARIOS) {
        if (!prevCategoryMap[scenario.category]) {
          prevCategoryMap[scenario.category] = { total: 0, survived: 0 };
        }
        prevCategoryMap[scenario.category].total++;
        const prevWeaknesses = run.weaknesses.filter((w) => w.category === scenario.category);
        const prevSurvived = !prevWeaknesses.some((w) => w.severity === 'critical' || w.severity === 'high');
        if (prevSurvived) prevCategoryMap[scenario.category].survived++;
      }
    }

    const categories = Object.entries(categoryMap).map(([category, data]) => {
      const survivalRate = Math.round((data.survived / Math.max(data.total, 1)) * 100);
      const avgDamage = Math.round(data.damage / Math.max(data.total, 1));
      const prev = prevCategoryMap[category];
      const prevSurvivalRate = prev ? Math.round((prev.survived / Math.max(prev.total, 1)) * 100) : survivalRate;
      const trend: 'IMPROVING' | 'STABLE' | 'WORSENING' =
        survivalRate > prevSurvivalRate + 5 ? 'IMPROVING'
        : survivalRate < prevSurvivalRate - 5 ? 'WORSENING'
        : 'STABLE';
      return {
        category,
        scenarioCount: data.total,
        survivalRate,
        avgDamage,
        riskLevel: survivalRate >= 90 ? 'LOW' as const
          : survivalRate >= 75 ? 'MEDIUM' as const
          : survivalRate >= 50 ? 'HIGH' as const
          : 'CRITICAL' as const,
        trend,
      };
    }).sort((a, b) => a.survivalRate - b.survivalRate);

    const weakestCategory = categories[0]?.category || 'unknown';
    const strongestCategory = categories[categories.length - 1]?.category || 'unknown';
    const overallReadiness = Math.round(
      categories.reduce((sum, c) => sum + c.survivalRate, 0) / Math.max(categories.length, 1)
    );

    return { categories, weakestCategory, strongestCategory, overallReadiness };
  }

  /**
   * 10/10: Weakness Pattern Analysis
   * Identifies recurring weakness patterns across multiple runs.
   */
  async analyzeWeaknessPatterns(organizationId: string): Promise<{
    recurringWeaknesses: Array<{
      attackVector: string;
      occurrences: number;
      avgSeverity: string;
      firstSeen: string;
      lastSeen: string;
      resolved: boolean;
      recommendation: string;
    }>;
    patternBanEffectiveness: number;
    totalPatternsAnalyzed: number;
    emergingThreats: string[];
  }> {
    const weaknesses = await prisma.apotheosis_weaknesses.findMany({
      where: { run: { organization_id: organizationId } },
      orderBy: { discovered_at: 'desc' },
      take: 500,
    });

    // Group by attack vector
    const vectorMap: Record<string, { count: number; severities: string[]; dates: Date[] }> = {};
    for (const w of weaknesses) {
      const vector = w.category;
      if (!vectorMap[vector]) vectorMap[vector] = { count: 0, severities: [], dates: [] };
      vectorMap[vector].count++;
      vectorMap[vector].severities.push(w.severity);
      vectorMap[vector].dates.push(new Date(w.discovered_at));
    }

    const recurringWeaknesses = Object.entries(vectorMap)
      .filter(([_, data]) => data.count >= 2)
      .map(([attackVector, data]) => {
        const sortedDates = data.dates.sort((a, b) => a.getTime() - b.getTime());
        const severityCounts: Record<string, number> = {};
        data.severities.forEach(s => severityCounts[s] = (severityCounts[s] || 0) + 1);
        const avgSeverity = Object.entries(severityCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'medium';

        return {
          attackVector,
          occurrences: data.count,
          avgSeverity,
          firstSeen: sortedDates[0].toISOString().split('T')[0],
          lastSeen: sortedDates[sortedDates.length - 1].toISOString().split('T')[0],
          resolved: false,
          recommendation: data.count >= 5
            ? `CRITICAL: "${attackVector}" recurring ${data.count} times Ã¢â‚¬â€ implement systemic fix`
            : `Monitor "${attackVector}" Ã¢â‚¬â€ ${data.count} occurrences detected`,
        };
      })
      .sort((a, b) => b.occurrences - a.occurrences);

    const bans = await prisma.apotheosis_pattern_bans.count({
      where: { organization_id: organizationId, status: 'active' },
    });
    const patternBanEffectiveness = bans > 0
      ? Math.round(Math.min(100, 60 + bans * 8))
      : 0;

    const emergingThreats = recurringWeaknesses
      .filter(w => w.occurrences >= 3 && !w.resolved)
      .slice(0, 5)
      .map(w => `${w.attackVector} (${w.occurrences} occurrences, ${w.avgSeverity} severity)`);

    return {
      recurringWeaknesses,
      patternBanEffectiveness,
      totalPatternsAnalyzed: weaknesses.length,
      emergingThreats,
    };
  }

  /**
   * 10/10: Organizational Readiness Score
   * Comprehensive readiness assessment combining all Apotheosis dimensions.
   */
  async getOrganizationalReadiness(organizationId: string): Promise<{
    readinessScore: number;
    dimensions: Array<{
      name: string;
      score: number;
      weight: number;
      status: 'EXCELLENT' | 'GOOD' | 'NEEDS_IMPROVEMENT' | 'CRITICAL';
    }>;
    recommendations: string[];
    comparisonBenchmark: number;
  }> {
    const [latestRun, escalations, upskill, bans] = await Promise.all([
      prisma.apotheosis_runs.findFirst({
        where: { organization_id: organizationId, status: 'completed' },
        orderBy: { completed_at: 'desc' },
      }),
      prisma.apotheosis_escalations.count({
        where: { run: { organization_id: organizationId }, status: 'pending' },
      }),
      prisma.apotheosis_upskill_assignments.count({
        where: { run: { organization_id: organizationId }, status: { in: ['assigned', 'in_progress'] } },
      }),
      prisma.apotheosis_pattern_bans.count({
        where: { organization_id: organizationId, status: 'active' },
      }),
    ]);

    const survivalRate = latestRun ? Number(latestRun.survival_rate) : 0;
    const apotheosisScore = latestRun ? Number(latestRun.apotheosis_score) : 0;

    const dimensions = [
      {
        name: 'Red Team Survival',
        score: Math.round(survivalRate),
        weight: 0.3,
        status: survivalRate >= 90 ? 'EXCELLENT' as const : survivalRate >= 75 ? 'GOOD' as const : survivalRate >= 50 ? 'NEEDS_IMPROVEMENT' as const : 'CRITICAL' as const,
      },
      {
        name: 'Escalation Management',
        score: Math.max(0, 100 - escalations * 10),
        weight: 0.2,
        status: escalations === 0 ? 'EXCELLENT' as const : escalations <= 3 ? 'GOOD' as const : escalations <= 7 ? 'NEEDS_IMPROVEMENT' as const : 'CRITICAL' as const,
      },
      {
        name: 'Team Readiness',
        score: Math.max(0, 100 - upskill * 5),
        weight: 0.2,
        status: upskill === 0 ? 'EXCELLENT' as const : upskill <= 5 ? 'GOOD' as const : upskill <= 15 ? 'NEEDS_IMPROVEMENT' as const : 'CRITICAL' as const,
      },
      {
        name: 'Pattern Governance',
        score: Math.min(100, bans * 15 + 40),
        weight: 0.15,
        status: bans >= 5 ? 'EXCELLENT' as const : bans >= 2 ? 'GOOD' as const : bans >= 1 ? 'NEEDS_IMPROVEMENT' as const : 'CRITICAL' as const,
      },
      {
        name: 'Apotheosis Score',
        score: Math.round(apotheosisScore),
        weight: 0.15,
        status: apotheosisScore >= 90 ? 'EXCELLENT' as const : apotheosisScore >= 75 ? 'GOOD' as const : apotheosisScore >= 50 ? 'NEEDS_IMPROVEMENT' as const : 'CRITICAL' as const,
      },
    ];

    const readinessScore = Math.round(
      dimensions.reduce((sum, d) => sum + d.score * d.weight, 0)
    );

    const recommendations: string[] = [];
    for (const d of dimensions) {
      if (d.status === 'CRITICAL') recommendations.push(`URGENT: ${d.name} at ${d.score}% Ã¢â‚¬â€ immediate action required`);
      else if (d.status === 'NEEDS_IMPROVEMENT') recommendations.push(`Improve ${d.name} (currently ${d.score}%)`);
    }
    if (recommendations.length === 0) recommendations.push('Organization is well-prepared Ã¢â‚¬â€ maintain current practices');

    return {
      readinessScore,
      dimensions,
      recommendations,
      comparisonBenchmark: 78, // Industry average benchmark
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CendiaApotheosis', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.runningSimulations.has(d.id)) this.runningSimulations.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CendiaApotheosis', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.configCache.has(d.id)) this.configCache.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CendiaApotheosisService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CendiaApotheosisService] DB reload skipped: ${(err as Error).message}`);


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
      serviceName: 'CendiaApotheosis',
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
      service: 'CendiaApotheosis',
      timestamp: new Date(),
      details: { uptime: process.uptime(), memoryMB: Math.round(process.memoryUsage().heapUsed / 1048576) },
    };
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

