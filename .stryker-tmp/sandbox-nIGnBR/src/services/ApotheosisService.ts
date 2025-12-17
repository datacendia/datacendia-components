// @ts-nocheck
// =============================================================================
// CENDIA APOTHEOSIS™ — FRONTEND SERVICE
// The Self-Improvement Loop That Never Stops
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { api } from '../lib/api';

// =============================================================================
// TYPES
// =============================================================================

export interface ApotheosisScore {
  overall: number;
  components: {
    redTeamSurvivalRate: {
      value: number;
      weight: number;
    };
    weaknessClosureRate: {
      value: number;
      weight: number;
    };
    decisionSuccessRate: {
      value: number;
      weight: number;
    };
    humanReadiness: {
      value: number;
      weight: number;
    };
    patternHealth: {
      value: number;
      weight: number;
    };
  };
  trend: Array<{
    date: string;
    score: number;
  }>;
  improvementPoints: number;
  improvementPeriod: string;
}
export interface ApotheosisRun {
  id: string;
  organizationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  scenariosTested: number;
  scenariosSurvived: number;
  survivalRate: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  apotheosisScore: number;
  previousScore: number;
  scoreDelta: number;
  shadowCouncilInstances: number;
  computeHours: number;
  duration: number;
}
export interface Escalation {
  id: string;
  weaknessId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high';
  reason: string;
  estimatedCostToFix: number;
  riskIfNotFixed: number;
  assignedTo: string[];
  deadline: Date;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  responseAt?: Date;
  response?: string;
}
export interface PatternBan {
  id: string;
  pattern: string;
  description: string;
  instances: PatternInstance[];
  failureRate: number;
  totalCost: number;
  bannedAt: Date;
  bannedBy: 'apotheosis' | 'human';
  status: 'active' | 'lifted';
  overrideRequires: string;
}
export interface PatternInstance {
  decisionId: string;
  decisionTitle: string;
  date: Date;
  outcome: 'success' | 'failure';
  cost?: number;
}
export interface UpskillAssignment {
  id: string;
  userId: string;
  userName: string;
  weaknessId: string;
  gapIdentified: string;
  trainingTopic: string;
  trainingDuration: number;
  deadline: Date;
  modules: TrainingModule[];
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: Date;
  blockingActions: boolean;
}
export interface TrainingModule {
  title: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz' | 'simulation';
}
export interface ApotheosisConfig {
  runFrequency: 'nightly' | 'weekly' | 'manual';
  runTime: string;
  scenarioCount: number;
  autoPatchThreshold: number;
  escalationTimeout: number;
  patternBanThreshold: number;
  trainingDeadline: number;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

class ApotheosisService {
  private baseUrl = '/api/v1/apotheosis';

  /**
   * Get the current Apotheosis Score
   */
  async getScore(): Promise<ApotheosisScore> {
    try {
      const response = await api.get<ApotheosisScore>(`${this.baseUrl}/score`);
      return stryMutAct_9fa48("66106") ? response.data && this.getMockScore() : (stryCov_9fa48("66106"), response.data ?? this.getMockScore());
    } catch (error) {
      console.error('[Apotheosis] Error fetching score:', error);
      return this.getMockScore();
    }
  }

  /**
   * Get the latest run results
   */
  async getLatestRun(): Promise<ApotheosisRun | null> {
    try {
      const response = await api.get<ApotheosisRun>(`${this.baseUrl}/latest-run`);
      return stryMutAct_9fa48("66112") ? response.data && this.getMockLatestRun() : (stryCov_9fa48("66112"), response.data ?? this.getMockLatestRun());
    } catch (error) {
      console.error('[Apotheosis] Error fetching latest run:', error);
      return this.getMockLatestRun();
    }
  }

  /**
   * Get run history
   */
  async getRunHistory(limit: number = 30): Promise<ApotheosisRun[]> {
    try {
      const response = await api.get<ApotheosisRun[]>(`${this.baseUrl}/run-history?limit=${limit}`);
      return stryMutAct_9fa48("66118") ? response.data && [] : (stryCov_9fa48("66118"), response.data ?? (stryMutAct_9fa48("66119") ? ["Stryker was here"] : (stryCov_9fa48("66119"), [])));
    } catch (error) {
      console.error('[Apotheosis] Error fetching run history:', error);
      return stryMutAct_9fa48("66122") ? ["Stryker was here"] : (stryCov_9fa48("66122"), []);
    }
  }

  /**
   * Get pending escalations
   */
  async getEscalations(): Promise<Escalation[]> {
    try {
      const response = await api.get<Escalation[]>(`${this.baseUrl}/escalations`);
      return stryMutAct_9fa48("66126") ? response.data && this.getMockEscalations() : (stryCov_9fa48("66126"), response.data ?? this.getMockEscalations());
    } catch (error) {
      console.error('[Apotheosis] Error fetching escalations:', error);
      return this.getMockEscalations();
    }
  }

  /**
   * Respond to an escalation
   */
  async respondToEscalation(id: string, response: 'approved' | 'rejected' | 'deferred', reason: string): Promise<void> {
    await api.post(`${this.baseUrl}/escalations/${id}/respond`, stryMutAct_9fa48("66131") ? {} : (stryCov_9fa48("66131"), {
      response,
      reason
    }));
  }

  /**
   * Get banned patterns
   */
  async getBannedPatterns(): Promise<PatternBan[]> {
    try {
      const response = await api.get<PatternBan[]>(`${this.baseUrl}/banned-patterns`);
      return stryMutAct_9fa48("66135") ? response.data && this.getMockBannedPatterns() : (stryCov_9fa48("66135"), response.data ?? this.getMockBannedPatterns());
    } catch (error) {
      console.error('[Apotheosis] Error fetching banned patterns:', error);
      return this.getMockBannedPatterns();
    }
  }

  /**
   * Get upskill assignments
   */
  async getUpskillAssignments(): Promise<UpskillAssignment[]> {
    try {
      const response = await api.get<UpskillAssignment[]>(`${this.baseUrl}/upskill-assignments`);
      return stryMutAct_9fa48("66141") ? response.data && this.getMockUpskillAssignments() : (stryCov_9fa48("66141"), response.data ?? this.getMockUpskillAssignments());
    } catch (error) {
      console.error('[Apotheosis] Error fetching upskill assignments:', error);
      return this.getMockUpskillAssignments();
    }
  }

  /**
   * Get configuration
   */
  async getConfig(): Promise<ApotheosisConfig> {
    try {
      const response = await api.get<ApotheosisConfig>(`${this.baseUrl}/config`);
      return stryMutAct_9fa48("66147") ? response.data && this.getDefaultConfig() : (stryCov_9fa48("66147"), response.data ?? this.getDefaultConfig());
    } catch (error) {
      console.error('[Apotheosis] Error fetching config:', error);
      return this.getDefaultConfig();
    }
  }

  /**
   * Update configuration
   */
  async updateConfig(config: Partial<ApotheosisConfig>): Promise<ApotheosisConfig> {
    const response = await api.put<ApotheosisConfig>(`${this.baseUrl}/config`, config);
    return stryMutAct_9fa48("66152") ? response.data && this.getDefaultConfig() : (stryCov_9fa48("66152"), response.data ?? this.getDefaultConfig());
  }

  /**
   * Trigger a manual run
   */
  async triggerManualRun(): Promise<{
    runId: string;
  }> {
    const response = await api.post<{
      runId: string;
    }>(`${this.baseUrl}/trigger-run`, {});
    return stryMutAct_9fa48("66155") ? response.data && {
      runId: 'manual-run'
    } : (stryCov_9fa48("66155"), response.data ?? (stryMutAct_9fa48("66156") ? {} : (stryCov_9fa48("66156"), {
      runId: 'manual-run'
    })));
  }

  // ===========================================================================
  // MOCK DATA FOR DEMO
  // ===========================================================================

  private getMockScore(): ApotheosisScore {
    return stryMutAct_9fa48("66159") ? {} : (stryCov_9fa48("66159"), {
      overall: 94.7,
      components: stryMutAct_9fa48("66160") ? {} : (stryCov_9fa48("66160"), {
        redTeamSurvivalRate: stryMutAct_9fa48("66161") ? {} : (stryCov_9fa48("66161"), {
          value: 93,
          weight: 0.30
        }),
        weaknessClosureRate: stryMutAct_9fa48("66162") ? {} : (stryCov_9fa48("66162"), {
          value: 97,
          weight: 0.25
        }),
        decisionSuccessRate: stryMutAct_9fa48("66163") ? {} : (stryCov_9fa48("66163"), {
          value: 89,
          weight: 0.25
        }),
        humanReadiness: stryMutAct_9fa48("66164") ? {} : (stryCov_9fa48("66164"), {
          value: 96,
          weight: 0.10
        }),
        patternHealth: stryMutAct_9fa48("66165") ? {} : (stryCov_9fa48("66165"), {
          value: 98,
          weight: 0.10
        })
      }),
      trend: stryMutAct_9fa48("66166") ? [] : (stryCov_9fa48("66166"), [stryMutAct_9fa48("66167") ? {} : (stryCov_9fa48("66167"), {
        date: '2024-01',
        score: 78.2
      }), stryMutAct_9fa48("66169") ? {} : (stryCov_9fa48("66169"), {
        date: '2024-03',
        score: 82.4
      }), stryMutAct_9fa48("66171") ? {} : (stryCov_9fa48("66171"), {
        date: '2024-06',
        score: 88.1
      }), stryMutAct_9fa48("66173") ? {} : (stryCov_9fa48("66173"), {
        date: '2024-09',
        score: 92.3
      }), stryMutAct_9fa48("66175") ? {} : (stryCov_9fa48("66175"), {
        date: '2024-12',
        score: 94.7
      })]),
      improvementPoints: 16.5,
      improvementPeriod: '11 months'
    });
  }
  private getMockLatestRun(): ApotheosisRun {
    return stryMutAct_9fa48("66179") ? {} : (stryCov_9fa48("66179"), {
      id: 'run-demo-1',
      organizationId: 'demo-org',
      startedAt: new Date(stryMutAct_9fa48("66182") ? Date.now() + 3 * 60 * 60 * 1000 : (stryCov_9fa48("66182"), Date.now() - (stryMutAct_9fa48("66183") ? 3 * 60 * 60 / 1000 : (stryCov_9fa48("66183"), (stryMutAct_9fa48("66184") ? 3 * 60 / 60 : (stryCov_9fa48("66184"), (stryMutAct_9fa48("66185") ? 3 / 60 : (stryCov_9fa48("66185"), 3 * 60)) * 60)) * 1000)))),
      completedAt: new Date(stryMutAct_9fa48("66186") ? Date.now() + 15 * 60 * 1000 : (stryCov_9fa48("66186"), Date.now() - (stryMutAct_9fa48("66187") ? 15 * 60 / 1000 : (stryCov_9fa48("66187"), (stryMutAct_9fa48("66188") ? 15 / 60 : (stryCov_9fa48("66188"), 15 * 60)) * 1000)))),
      status: 'completed',
      scenariosTested: 1247,
      scenariosSurvived: 1160,
      survivalRate: 93.0,
      criticalCount: 3,
      highCount: 12,
      mediumCount: 18,
      lowCount: 14,
      apotheosisScore: 94.7,
      previousScore: 92.3,
      scoreDelta: 2.4,
      shadowCouncilInstances: 12,
      computeHours: 847,
      duration: 167
    });
  }
  private getMockEscalations(): Escalation[] {
    return stryMutAct_9fa48("66191") ? [] : (stryCov_9fa48("66191"), [stryMutAct_9fa48("66192") ? {} : (stryCov_9fa48("66192"), {
      id: 'esc-1',
      weaknessId: 'w1',
      title: 'Single point of failure in Finance',
      description: 'Only CFO can approve wire transfers >$100K. CFO unavailable = business stops.',
      severity: 'critical',
      reason: 'Requires policy change',
      estimatedCostToFix: 0,
      riskIfNotFixed: 2300000,
      assignedTo: stryMutAct_9fa48("66199") ? [] : (stryCov_9fa48("66199"), ['executive-team']),
      deadline: new Date(stryMutAct_9fa48("66201") ? Date.now() - 48 * 60 * 60 * 1000 : (stryCov_9fa48("66201"), Date.now() + (stryMutAct_9fa48("66202") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("66202"), (stryMutAct_9fa48("66203") ? 48 * 60 / 60 : (stryCov_9fa48("66203"), (stryMutAct_9fa48("66204") ? 48 / 60 : (stryCov_9fa48("66204"), 48 * 60)) * 60)) * 1000)))),
      status: 'pending'
    }), stryMutAct_9fa48("66206") ? {} : (stryCov_9fa48("66206"), {
      id: 'esc-2',
      weaknessId: 'w2',
      title: 'Vendor concentration risk',
      description: '73% of cloud spend with single vendor (AWS). Price increase or outage = major impact.',
      severity: 'high',
      reason: 'Budget impact exceeds threshold',
      estimatedCostToFix: 150000,
      riskIfNotFixed: 4100000,
      assignedTo: stryMutAct_9fa48("66213") ? [] : (stryCov_9fa48("66213"), ['cto', 'cfo']),
      deadline: new Date(stryMutAct_9fa48("66216") ? Date.now() - 72 * 60 * 60 * 1000 : (stryCov_9fa48("66216"), Date.now() + (stryMutAct_9fa48("66217") ? 72 * 60 * 60 / 1000 : (stryCov_9fa48("66217"), (stryMutAct_9fa48("66218") ? 72 * 60 / 60 : (stryCov_9fa48("66218"), (stryMutAct_9fa48("66219") ? 72 / 60 : (stryCov_9fa48("66219"), 72 * 60)) * 60)) * 1000)))),
      status: 'pending'
    }), stryMutAct_9fa48("66221") ? {} : (stryCov_9fa48("66221"), {
      id: 'esc-3',
      weaknessId: 'w3',
      title: 'Knowledge concentration in Engineering',
      description: '3 engineers hold 80% of critical system knowledge. Departure = 6-12 month recovery.',
      severity: 'high',
      reason: 'Requires resource allocation',
      estimatedCostToFix: 45000,
      riskIfNotFixed: 1800000,
      assignedTo: stryMutAct_9fa48("66228") ? [] : (stryCov_9fa48("66228"), ['vp-engineering']),
      deadline: new Date(stryMutAct_9fa48("66230") ? Date.now() - 120 * 60 * 60 * 1000 : (stryCov_9fa48("66230"), Date.now() + (stryMutAct_9fa48("66231") ? 120 * 60 * 60 / 1000 : (stryCov_9fa48("66231"), (stryMutAct_9fa48("66232") ? 120 * 60 / 60 : (stryCov_9fa48("66232"), (stryMutAct_9fa48("66233") ? 120 / 60 : (stryCov_9fa48("66233"), 120 * 60)) * 60)) * 1000)))),
      status: 'pending'
    })]);
  }
  private getMockBannedPatterns(): PatternBan[] {
    return stryMutAct_9fa48("66236") ? [] : (stryCov_9fa48("66236"), [stryMutAct_9fa48("66237") ? {} : (stryCov_9fa48("66237"), {
      id: 'pb-1',
      pattern: 'Skip process for urgent requests',
      description: 'Bypassing standard review for urgency claims',
      instances: stryMutAct_9fa48("66241") ? [] : (stryCov_9fa48("66241"), [stryMutAct_9fa48("66242") ? {} : (stryCov_9fa48("66242"), {
        decisionId: 'd1',
        decisionTitle: 'Rush vendor onboarding',
        date: new Date('2024-09-15'),
        outcome: 'failure',
        cost: 120000
      }), stryMutAct_9fa48("66247") ? {} : (stryCov_9fa48("66247"), {
        decisionId: 'd2',
        decisionTitle: 'Skip QA for deadline',
        date: new Date('2024-06-10'),
        outcome: 'failure',
        cost: 45000
      }), stryMutAct_9fa48("66252") ? {} : (stryCov_9fa48("66252"), {
        decisionId: 'd3',
        decisionTitle: 'Skip legal review',
        date: new Date('2024-03-22'),
        outcome: 'failure',
        cost: 75000
      })]),
      failureRate: 100,
      totalCost: 240000,
      bannedAt: new Date('2024-09-20'),
      bannedBy: 'apotheosis',
      status: 'active',
      overrideRequires: 'CEO approval'
    }), stryMutAct_9fa48("66261") ? {} : (stryCov_9fa48("66261"), {
      id: 'pb-2',
      pattern: 'Approve vendor without references',
      description: 'Onboarding vendors without reference checks',
      instances: stryMutAct_9fa48("66265") ? [] : (stryCov_9fa48("66265"), [stryMutAct_9fa48("66266") ? {} : (stryCov_9fa48("66266"), {
        decisionId: 'd4',
        decisionTitle: 'New supplier approval',
        date: new Date('2024-06-01'),
        outcome: 'failure',
        cost: 85000
      }), stryMutAct_9fa48("66271") ? {} : (stryCov_9fa48("66271"), {
        decisionId: 'd5',
        decisionTitle: 'Contractor engagement',
        date: new Date('2024-04-15'),
        outcome: 'failure',
        cost: 62000
      })]),
      failureRate: 100,
      totalCost: 147000,
      bannedAt: new Date('2024-06-15'),
      bannedBy: 'apotheosis',
      status: 'active',
      overrideRequires: 'CFO approval'
    }), stryMutAct_9fa48("66280") ? {} : (stryCov_9fa48("66280"), {
      id: 'pb-3',
      pattern: 'Deploy Friday afternoon',
      description: 'Production deployments on Friday afternoons',
      instances: stryMutAct_9fa48("66284") ? [] : (stryCov_9fa48("66284"), [stryMutAct_9fa48("66285") ? {} : (stryCov_9fa48("66285"), {
        decisionId: 'd6',
        decisionTitle: 'Feature release',
        date: new Date('2024-03-08'),
        outcome: 'failure',
        cost: 35000
      }), stryMutAct_9fa48("66290") ? {} : (stryCov_9fa48("66290"), {
        decisionId: 'd7',
        decisionTitle: 'Hotfix deployment',
        date: new Date('2024-02-16'),
        outcome: 'failure',
        cost: 28000
      })]),
      failureRate: 83,
      totalCost: 63000,
      bannedAt: new Date('2024-03-15'),
      bannedBy: 'apotheosis',
      status: 'active',
      overrideRequires: 'CTO approval'
    })]);
  }
  private getMockUpskillAssignments(): UpskillAssignment[] {
    return stryMutAct_9fa48("66300") ? [] : (stryCov_9fa48("66300"), [stryMutAct_9fa48("66301") ? {} : (stryCov_9fa48("66301"), {
      id: 'us-1',
      userId: 'user-1',
      userName: 'James Wilson',
      weaknessId: 'w1',
      gapIdentified: 'Vendor security assessment',
      trainingTopic: 'Vendor Security Fundamentals',
      trainingDuration: 45,
      deadline: new Date(stryMutAct_9fa48("66308") ? Date.now() - 72 * 60 * 60 * 1000 : (stryCov_9fa48("66308"), Date.now() + (stryMutAct_9fa48("66309") ? 72 * 60 * 60 / 1000 : (stryCov_9fa48("66309"), (stryMutAct_9fa48("66310") ? 72 * 60 / 60 : (stryCov_9fa48("66310"), (stryMutAct_9fa48("66311") ? 72 / 60 : (stryCov_9fa48("66311"), 72 * 60)) * 60)) * 1000)))),
      modules: stryMutAct_9fa48("66312") ? [] : (stryCov_9fa48("66312"), [stryMutAct_9fa48("66313") ? {} : (stryCov_9fa48("66313"), {
        title: 'Why vendor security matters',
        duration: 10,
        type: 'video'
      }), stryMutAct_9fa48("66316") ? {} : (stryCov_9fa48("66316"), {
        title: 'The breach that bankrupted...',
        duration: 15,
        type: 'reading'
      }), stryMutAct_9fa48("66319") ? {} : (stryCov_9fa48("66319"), {
        title: 'Security checklist for contracts',
        duration: 10,
        type: 'reading'
      }), stryMutAct_9fa48("66322") ? {} : (stryCov_9fa48("66322"), {
        title: 'Quiz + certification',
        duration: 10,
        type: 'quiz'
      })]),
      status: 'assigned',
      blockingActions: stryMutAct_9fa48("66326") ? false : (stryCov_9fa48("66326"), true)
    }), stryMutAct_9fa48("66327") ? {} : (stryCov_9fa48("66327"), {
      id: 'us-2',
      userId: 'user-2',
      userName: 'Sarah Chen',
      weaknessId: 'w2',
      gapIdentified: 'Financial red flags recognition',
      trainingTopic: 'Financial Risk Indicators',
      trainingDuration: 30,
      deadline: new Date(stryMutAct_9fa48("66334") ? Date.now() - 48 * 60 * 60 * 1000 : (stryCov_9fa48("66334"), Date.now() + (stryMutAct_9fa48("66335") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("66335"), (stryMutAct_9fa48("66336") ? 48 * 60 / 60 : (stryCov_9fa48("66336"), (stryMutAct_9fa48("66337") ? 48 / 60 : (stryCov_9fa48("66337"), 48 * 60)) * 60)) * 1000)))),
      modules: stryMutAct_9fa48("66338") ? [] : (stryCov_9fa48("66338"), [stryMutAct_9fa48("66339") ? {} : (stryCov_9fa48("66339"), {
        title: 'Common financial warning signs',
        duration: 10,
        type: 'video'
      }), stryMutAct_9fa48("66342") ? {} : (stryCov_9fa48("66342"), {
        title: 'Case studies',
        duration: 15,
        type: 'reading'
      }), stryMutAct_9fa48("66345") ? {} : (stryCov_9fa48("66345"), {
        title: 'Assessment',
        duration: 5,
        type: 'quiz'
      })]),
      status: 'in_progress',
      blockingActions: stryMutAct_9fa48("66349") ? true : (stryCov_9fa48("66349"), false)
    }), stryMutAct_9fa48("66350") ? {} : (stryCov_9fa48("66350"), {
      id: 'us-3',
      userId: 'user-3',
      userName: 'Mike Rodriguez',
      weaknessId: 'w3',
      gapIdentified: 'Data privacy (GDPR)',
      trainingTopic: 'GDPR Compliance Essentials',
      trainingDuration: 60,
      deadline: new Date(stryMutAct_9fa48("66357") ? Date.now() - 120 * 60 * 60 * 1000 : (stryCov_9fa48("66357"), Date.now() + (stryMutAct_9fa48("66358") ? 120 * 60 * 60 / 1000 : (stryCov_9fa48("66358"), (stryMutAct_9fa48("66359") ? 120 * 60 / 60 : (stryCov_9fa48("66359"), (stryMutAct_9fa48("66360") ? 120 / 60 : (stryCov_9fa48("66360"), 120 * 60)) * 60)) * 1000)))),
      modules: stryMutAct_9fa48("66361") ? [] : (stryCov_9fa48("66361"), [stryMutAct_9fa48("66362") ? {} : (stryCov_9fa48("66362"), {
        title: 'GDPR fundamentals',
        duration: 20,
        type: 'video'
      }), stryMutAct_9fa48("66365") ? {} : (stryCov_9fa48("66365"), {
        title: 'Data handling procedures',
        duration: 25,
        type: 'reading'
      }), stryMutAct_9fa48("66368") ? {} : (stryCov_9fa48("66368"), {
        title: 'Certification exam',
        duration: 15,
        type: 'quiz'
      })]),
      status: 'assigned',
      blockingActions: stryMutAct_9fa48("66372") ? true : (stryCov_9fa48("66372"), false)
    })]);
  }
  private getDefaultConfig(): ApotheosisConfig {
    return stryMutAct_9fa48("66374") ? {} : (stryCov_9fa48("66374"), {
      runFrequency: 'nightly',
      runTime: '03:00',
      scenarioCount: 1000,
      autoPatchThreshold: 10000,
      escalationTimeout: 72,
      patternBanThreshold: 3,
      trainingDeadline: 72
    });
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const apotheosisService = new ApotheosisService();
export default apotheosisService;