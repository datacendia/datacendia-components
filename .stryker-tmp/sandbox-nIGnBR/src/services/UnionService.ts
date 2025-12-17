// @ts-nocheck
// =============================================================================
// CENDIA UNION™ — EMPLOYEE RIGHTS & ADVOCACY MODULE
// First AI product marketed as union-grade protection
// Digital labor rights with audit trail, burnout scoring, and negotiation prep
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
import { ollamaService } from '../lib/ollama';

// =============================================================================
// TYPES
// =============================================================================

export type EmployeeStatus = 'active' | 'on_leave' | 'probation' | 'notice_period' | 'terminated';
export type BurnoutLevel = 'healthy' | 'caution' | 'warning' | 'critical' | 'emergency';
export type RightType = 'compensation' | 'time_off' | 'workload' | 'safety' | 'privacy' | 'dignity' | 'growth' | 'voice';
export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  level: string;
  startDate: Date;
  status: EmployeeStatus;
  managerId?: string;

  // Compensation
  salary: number;
  bonus?: number;
  equity?: number;
  lastRaiseDate?: Date;
  lastRaisePercent?: number;

  // Workload metrics
  avgHoursPerWeek: number;
  overtimeHoursThisMonth: number;
  ptoDaysRemaining: number;
  ptoUsedThisYear: number;

  // Burnout indicators
  burnoutScore: number; // 0-100
  burnoutLevel: BurnoutLevel;
  burnoutFactors: BurnoutFactor[];

  // Rights tracking
  rightsViolations: RightsViolation[];
  pendingRequests: EmployeeRequest[];
  advocacySessions: AdvocacySession[];
}
export interface BurnoutFactor {
  id: string;
  category: 'workload' | 'work_life' | 'recognition' | 'growth' | 'autonomy' | 'relationships' | 'values';
  name: string;
  score: number; // 0-100 (higher = worse)
  weight: number;
  indicators: string[];
  recommendations: string[];
  detectedAt: Date;
}
export interface RightsViolation {
  id: string;
  type: RightType;
  severity: 'minor' | 'moderate' | 'severe' | 'critical';
  description: string;
  occurredAt: Date;
  reportedAt?: Date;
  status: 'detected' | 'reported' | 'investigating' | 'resolved' | 'escalated';
  resolution?: string;
  compensationOwed?: number;
  auditTrail: AuditEntry[];
}
export interface EmployeeRequest {
  id: string;
  type: 'raise' | 'promotion' | 'time_off' | 'transfer' | 'accommodation' | 'grievance' | 'feedback';
  title: string;
  description: string;
  submittedAt: Date;
  status: 'draft' | 'submitted' | 'under_review' | 'approved' | 'denied' | 'negotiating';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  aiPrepared: boolean;
  negotiationBrief?: NegotiationBrief;
  outcome?: string;
  resolvedAt?: Date;
}
export interface AdvocacySession {
  id: string;
  type: 'preparation' | 'coaching' | 'review' | 'debrief';
  topic: string;
  scheduledAt: Date;
  completedAt?: Date;
  summary?: string;
  recommendations: string[];
  confidential: boolean;
}
export interface NegotiationBrief {
  id: string;
  generatedAt: Date;
  context: string;

  // Market data
  marketSalaryRange: {
    min: number;
    median: number;
    max: number;
  };
  marketPosition: 'below' | 'at' | 'above';
  marketPercentile: number;

  // Performance
  performanceRating: number;
  performanceHighlights: string[];
  impactMetrics: {
    metric: string;
    value: string;
    comparison: string;
  }[];

  // Leverage points
  leveragePoints: {
    point: string;
    strength: 'weak' | 'moderate' | 'strong';
  }[];
  riskFactors: {
    factor: string;
    mitigation: string;
  }[];

  // Strategy
  askRange: {
    minimum: number;
    target: number;
    stretch: number;
  };
  talkingPoints: string[];
  objectionHandlers: {
    objection: string;
    response: string;
  }[];
  walkawayConditions: string[];

  // Timing
  bestTimeToAsk: string;
  budgetCycleContext: string;
}
export interface AuditEntry {
  id: string;
  timestamp: Date;
  action: string;
  actor: string;
  details: Record<string, any>;
  hash: string;
}
export interface WorkforceMetrics {
  totalEmployees: number;
  avgBurnoutScore: number;
  burnoutDistribution: Record<BurnoutLevel, number>;
  avgTenure: number;
  turnoverRate: number;
  openViolations: number;
  pendingRequests: number;
  avgSalaryVsMarket: number;
  overtimeAverage: number;
  ptoUtilization: number;
  rightsByType: Record<RightType, {
    violations: number;
    resolved: number;
  }>;
}
export interface EmployeeInsight {
  id: string;
  type: 'risk' | 'opportunity' | 'violation' | 'milestone' | 'recommendation';
  severity: 'info' | 'warning' | 'critical';
  title: string;
  description: string;
  affectedEmployees: string[];
  suggestedAction: string;
  detectedAt: Date;
}

// =============================================================================
// STORAGE KEY
// =============================================================================

const STORAGE_KEY = 'datacendia_union_service';

// =============================================================================
// BURNOUT CALCULATION
// =============================================================================

function calculateBurnoutScore(employee: Partial<Employee>): {
  score: number;
  level: BurnoutLevel;
  factors: BurnoutFactor[];
} {
  const factors: BurnoutFactor[] = stryMutAct_9fa48("69720") ? ["Stryker was here"] : (stryCov_9fa48("69720"), []);
  let totalScore = 0;
  let totalWeight = 0;

  // Workload factor
  const workloadScore = stryMutAct_9fa48("69721") ? Math.max(100, ((employee.avgHoursPerWeek || 40) - 40) * 5 + (employee.overtimeHoursThisMonth || 0) * 2) : (stryCov_9fa48("69721"), Math.min(100, stryMutAct_9fa48("69722") ? ((employee.avgHoursPerWeek || 40) - 40) * 5 - (employee.overtimeHoursThisMonth || 0) * 2 : (stryCov_9fa48("69722"), (stryMutAct_9fa48("69723") ? ((employee.avgHoursPerWeek || 40) - 40) / 5 : (stryCov_9fa48("69723"), (stryMutAct_9fa48("69724") ? (employee.avgHoursPerWeek || 40) + 40 : (stryCov_9fa48("69724"), (stryMutAct_9fa48("69727") ? employee.avgHoursPerWeek && 40 : stryMutAct_9fa48("69726") ? false : stryMutAct_9fa48("69725") ? true : (stryCov_9fa48("69725", "69726", "69727"), employee.avgHoursPerWeek || 40)) - 40)) * 5)) + (stryMutAct_9fa48("69728") ? (employee.overtimeHoursThisMonth || 0) / 2 : (stryCov_9fa48("69728"), (stryMutAct_9fa48("69731") ? employee.overtimeHoursThisMonth && 0 : stryMutAct_9fa48("69730") ? false : stryMutAct_9fa48("69729") ? true : (stryCov_9fa48("69729", "69730", "69731"), employee.overtimeHoursThisMonth || 0)) * 2)))));
  if (stryMutAct_9fa48("69735") ? workloadScore <= 20 : stryMutAct_9fa48("69734") ? workloadScore >= 20 : stryMutAct_9fa48("69733") ? false : stryMutAct_9fa48("69732") ? true : (stryCov_9fa48("69732", "69733", "69734", "69735"), workloadScore > 20)) {
    factors.push(stryMutAct_9fa48("69737") ? {} : (stryCov_9fa48("69737"), {
      id: `factor-workload-${Date.now()}`,
      category: 'workload',
      name: 'Excessive Work Hours',
      score: workloadScore,
      weight: 0.25,
      indicators: stryMutAct_9fa48("69741") ? [] : (stryCov_9fa48("69741"), [`${stryMutAct_9fa48("69745") ? employee.avgHoursPerWeek && 40 : stryMutAct_9fa48("69744") ? false : stryMutAct_9fa48("69743") ? true : (stryCov_9fa48("69743", "69744", "69745"), employee.avgHoursPerWeek || 40)} hours/week average`, `${stryMutAct_9fa48("69749") ? employee.overtimeHoursThisMonth && 0 : stryMutAct_9fa48("69748") ? false : stryMutAct_9fa48("69747") ? true : (stryCov_9fa48("69747", "69748", "69749"), employee.overtimeHoursThisMonth || 0)} overtime hours this month`]),
      recommendations: stryMutAct_9fa48("69750") ? [] : (stryCov_9fa48("69750"), ['Review workload distribution', 'Consider delegation opportunities', 'Evaluate project priorities']),
      detectedAt: new Date()
    }));
    stryMutAct_9fa48("69754") ? totalScore -= workloadScore * 0.25 : (stryCov_9fa48("69754"), totalScore += stryMutAct_9fa48("69755") ? workloadScore / 0.25 : (stryCov_9fa48("69755"), workloadScore * 0.25));
    stryMutAct_9fa48("69756") ? totalWeight -= 0.25 : (stryCov_9fa48("69756"), totalWeight += 0.25);
  }

  // Work-life balance (PTO usage)
  const ptoScore = (stryMutAct_9fa48("69759") ? employee.ptoUsedThisYear !== undefined || employee.ptoDaysRemaining !== undefined : stryMutAct_9fa48("69758") ? false : stryMutAct_9fa48("69757") ? true : (stryCov_9fa48("69757", "69758", "69759"), (stryMutAct_9fa48("69761") ? employee.ptoUsedThisYear === undefined : stryMutAct_9fa48("69760") ? true : (stryCov_9fa48("69760", "69761"), employee.ptoUsedThisYear !== undefined)) && (stryMutAct_9fa48("69763") ? employee.ptoDaysRemaining === undefined : stryMutAct_9fa48("69762") ? true : (stryCov_9fa48("69762", "69763"), employee.ptoDaysRemaining !== undefined)))) ? stryMutAct_9fa48("69764") ? Math.min(0, 100 - employee.ptoUsedThisYear / (employee.ptoUsedThisYear + employee.ptoDaysRemaining) * 100) : (stryCov_9fa48("69764"), Math.max(0, stryMutAct_9fa48("69765") ? 100 + employee.ptoUsedThisYear / (employee.ptoUsedThisYear + employee.ptoDaysRemaining) * 100 : (stryCov_9fa48("69765"), 100 - (stryMutAct_9fa48("69766") ? employee.ptoUsedThisYear / (employee.ptoUsedThisYear + employee.ptoDaysRemaining) / 100 : (stryCov_9fa48("69766"), (stryMutAct_9fa48("69767") ? employee.ptoUsedThisYear * (employee.ptoUsedThisYear + employee.ptoDaysRemaining) : (stryCov_9fa48("69767"), employee.ptoUsedThisYear / (stryMutAct_9fa48("69768") ? employee.ptoUsedThisYear - employee.ptoDaysRemaining : (stryCov_9fa48("69768"), employee.ptoUsedThisYear + employee.ptoDaysRemaining)))) * 100))))) : 50;
  if (stryMutAct_9fa48("69772") ? ptoScore <= 60 : stryMutAct_9fa48("69771") ? ptoScore >= 60 : stryMutAct_9fa48("69770") ? false : stryMutAct_9fa48("69769") ? true : (stryCov_9fa48("69769", "69770", "69771", "69772"), ptoScore > 60)) {
    factors.push(stryMutAct_9fa48("69774") ? {} : (stryCov_9fa48("69774"), {
      id: `factor-pto-${Date.now()}`,
      category: 'work_life',
      name: 'Low PTO Utilization',
      score: ptoScore,
      weight: 0.15,
      indicators: stryMutAct_9fa48("69778") ? [] : (stryCov_9fa48("69778"), [`${stryMutAct_9fa48("69782") ? employee.ptoDaysRemaining && 0 : stryMutAct_9fa48("69781") ? false : stryMutAct_9fa48("69780") ? true : (stryCov_9fa48("69780", "69781", "69782"), employee.ptoDaysRemaining || 0)} PTO days remaining`, `${stryMutAct_9fa48("69786") ? employee.ptoUsedThisYear && 0 : stryMutAct_9fa48("69785") ? false : stryMutAct_9fa48("69784") ? true : (stryCov_9fa48("69784", "69785", "69786"), employee.ptoUsedThisYear || 0)} days used this year`]),
      recommendations: stryMutAct_9fa48("69787") ? [] : (stryCov_9fa48("69787"), ['Encourage taking time off', 'Schedule vacation proactively', 'Review workload allowing breaks']),
      detectedAt: new Date()
    }));
    stryMutAct_9fa48("69791") ? totalScore -= ptoScore * 0.15 : (stryCov_9fa48("69791"), totalScore += stryMutAct_9fa48("69792") ? ptoScore / 0.15 : (stryCov_9fa48("69792"), ptoScore * 0.15));
    stryMutAct_9fa48("69793") ? totalWeight -= 0.15 : (stryCov_9fa48("69793"), totalWeight += 0.15);
  }

  // Compensation fairness
  // This would normally compare to market data
  const compensationScore = 30; // Placeholder
  stryMutAct_9fa48("69794") ? totalScore -= compensationScore * 0.2 : (stryCov_9fa48("69794"), totalScore += stryMutAct_9fa48("69795") ? compensationScore / 0.2 : (stryCov_9fa48("69795"), compensationScore * 0.2));
  stryMutAct_9fa48("69796") ? totalWeight -= 0.2 : (stryCov_9fa48("69796"), totalWeight += 0.2);

  // Growth opportunities
  const growthScore = employee.lastRaiseDate ? stryMutAct_9fa48("69797") ? Math.max(100, (Date.now() - employee.lastRaiseDate.getTime()) / (365 * 24 * 60 * 60 * 1000) * 30) : (stryCov_9fa48("69797"), Math.min(100, stryMutAct_9fa48("69798") ? (Date.now() - employee.lastRaiseDate.getTime()) / (365 * 24 * 60 * 60 * 1000) / 30 : (stryCov_9fa48("69798"), (stryMutAct_9fa48("69799") ? (Date.now() - employee.lastRaiseDate.getTime()) * (365 * 24 * 60 * 60 * 1000) : (stryCov_9fa48("69799"), (stryMutAct_9fa48("69800") ? Date.now() + employee.lastRaiseDate.getTime() : (stryCov_9fa48("69800"), Date.now() - employee.lastRaiseDate.getTime())) / (stryMutAct_9fa48("69801") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("69801"), (stryMutAct_9fa48("69802") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("69802"), (stryMutAct_9fa48("69803") ? 365 * 24 / 60 : (stryCov_9fa48("69803"), (stryMutAct_9fa48("69804") ? 365 / 24 : (stryCov_9fa48("69804"), 365 * 24)) * 60)) * 60)) * 1000)))) * 30))) : 50;
  if (stryMutAct_9fa48("69808") ? growthScore <= 50 : stryMutAct_9fa48("69807") ? growthScore >= 50 : stryMutAct_9fa48("69806") ? false : stryMutAct_9fa48("69805") ? true : (stryCov_9fa48("69805", "69806", "69807", "69808"), growthScore > 50)) {
    factors.push(stryMutAct_9fa48("69810") ? {} : (stryCov_9fa48("69810"), {
      id: `factor-growth-${Date.now()}`,
      category: 'growth',
      name: 'Stagnant Career Progression',
      score: growthScore,
      weight: 0.2,
      indicators: stryMutAct_9fa48("69814") ? [] : (stryCov_9fa48("69814"), [employee.lastRaiseDate ? `Last raise: ${employee.lastRaiseDate.toLocaleDateString()}` : 'No raise on record']),
      recommendations: stryMutAct_9fa48("69817") ? [] : (stryCov_9fa48("69817"), ['Schedule career development discussion', 'Review promotion timeline', 'Identify skill development opportunities']),
      detectedAt: new Date()
    }));
    stryMutAct_9fa48("69821") ? totalScore -= growthScore * 0.2 : (stryCov_9fa48("69821"), totalScore += stryMutAct_9fa48("69822") ? growthScore / 0.2 : (stryCov_9fa48("69822"), growthScore * 0.2));
    stryMutAct_9fa48("69823") ? totalWeight -= 0.2 : (stryCov_9fa48("69823"), totalWeight += 0.2);
  }

  // Normalize score
  const finalScore = (stryMutAct_9fa48("69827") ? totalWeight <= 0 : stryMutAct_9fa48("69826") ? totalWeight >= 0 : stryMutAct_9fa48("69825") ? false : stryMutAct_9fa48("69824") ? true : (stryCov_9fa48("69824", "69825", "69826", "69827"), totalWeight > 0)) ? Math.round(stryMutAct_9fa48("69828") ? totalScore * totalWeight : (stryCov_9fa48("69828"), totalScore / totalWeight)) : 0;

  // Determine level
  let level: BurnoutLevel;
  if (stryMutAct_9fa48("69832") ? finalScore < 80 : stryMutAct_9fa48("69831") ? finalScore > 80 : stryMutAct_9fa48("69830") ? false : stryMutAct_9fa48("69829") ? true : (stryCov_9fa48("69829", "69830", "69831", "69832"), finalScore >= 80)) {
    level = 'emergency';
  } else if (stryMutAct_9fa48("69838") ? finalScore < 65 : stryMutAct_9fa48("69837") ? finalScore > 65 : stryMutAct_9fa48("69836") ? false : stryMutAct_9fa48("69835") ? true : (stryCov_9fa48("69835", "69836", "69837", "69838"), finalScore >= 65)) {
    level = 'critical';
  } else if (stryMutAct_9fa48("69844") ? finalScore < 50 : stryMutAct_9fa48("69843") ? finalScore > 50 : stryMutAct_9fa48("69842") ? false : stryMutAct_9fa48("69841") ? true : (stryCov_9fa48("69841", "69842", "69843", "69844"), finalScore >= 50)) {
    level = 'warning';
  } else if (stryMutAct_9fa48("69850") ? finalScore < 30 : stryMutAct_9fa48("69849") ? finalScore > 30 : stryMutAct_9fa48("69848") ? false : stryMutAct_9fa48("69847") ? true : (stryCov_9fa48("69847", "69848", "69849", "69850"), finalScore >= 30)) {
    level = 'caution';
  } else {
    level = 'healthy';
  }
  return stryMutAct_9fa48("69855") ? {} : (stryCov_9fa48("69855"), {
    score: finalScore,
    level,
    factors
  });
}

// =============================================================================
// UNION SERVICE
// =============================================================================

class UnionService {
  private employees: Map<string, Employee> = new Map();
  private insights: EmployeeInsight[] = stryMutAct_9fa48("69856") ? ["Stryker was here"] : (stryCov_9fa48("69856"), []);
  private ollamaAvailable: boolean = stryMutAct_9fa48("69857") ? true : (stryCov_9fa48("69857"), false);
  constructor() {
    this.loadFromStorage();
    this.checkOllamaStatus();
  }
  private async checkOllamaStatus(): Promise<void> {
    try {
      this.ollamaAvailable = await ollamaService.checkAvailability();
    } catch {
      this.ollamaAvailable = stryMutAct_9fa48("69862") ? true : (stryCov_9fa48("69862"), false);
    }
  }
  private loadFromStorage(): void {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stryMutAct_9fa48("69866") ? false : stryMutAct_9fa48("69865") ? true : (stryCov_9fa48("69865", "69866"), stored)) {
        const data = JSON.parse(stored);
        stryMutAct_9fa48("69868") ? data.employees.forEach((e: Employee) => {
          e.startDate = new Date(e.startDate);
          if (e.lastRaiseDate) {
            e.lastRaiseDate = new Date(e.lastRaiseDate);
          }
          e.burnoutFactors.forEach(f => f.detectedAt = new Date(f.detectedAt));
          e.rightsViolations.forEach(v => {
            v.occurredAt = new Date(v.occurredAt);
            if (v.reportedAt) {
              v.reportedAt = new Date(v.reportedAt);
            }
            v.auditTrail.forEach(a => a.timestamp = new Date(a.timestamp));
          });
          e.pendingRequests.forEach(r => {
            r.submittedAt = new Date(r.submittedAt);
            if (r.resolvedAt) {
              r.resolvedAt = new Date(r.resolvedAt);
            }
          });
          e.advocacySessions.forEach(s => {
            s.scheduledAt = new Date(s.scheduledAt);
            if (s.completedAt) {
              s.completedAt = new Date(s.completedAt);
            }
          });
          this.employees.set(e.id, e);
        }) : (stryCov_9fa48("69868"), data.employees?.forEach((e: Employee) => {
          e.startDate = new Date(e.startDate);
          if (stryMutAct_9fa48("69871") ? false : stryMutAct_9fa48("69870") ? true : (stryCov_9fa48("69870", "69871"), e.lastRaiseDate)) {
            e.lastRaiseDate = new Date(e.lastRaiseDate);
          }
          e.burnoutFactors.forEach(stryMutAct_9fa48("69873") ? () => undefined : (stryCov_9fa48("69873"), f => f.detectedAt = new Date(f.detectedAt)));
          e.rightsViolations.forEach(v => {
            v.occurredAt = new Date(v.occurredAt);
            if (stryMutAct_9fa48("69876") ? false : stryMutAct_9fa48("69875") ? true : (stryCov_9fa48("69875", "69876"), v.reportedAt)) {
              v.reportedAt = new Date(v.reportedAt);
            }
            v.auditTrail.forEach(stryMutAct_9fa48("69878") ? () => undefined : (stryCov_9fa48("69878"), a => a.timestamp = new Date(a.timestamp)));
          });
          e.pendingRequests.forEach(r => {
            r.submittedAt = new Date(r.submittedAt);
            if (stryMutAct_9fa48("69881") ? false : stryMutAct_9fa48("69880") ? true : (stryCov_9fa48("69880", "69881"), r.resolvedAt)) {
              r.resolvedAt = new Date(r.resolvedAt);
            }
          });
          e.advocacySessions.forEach(s => {
            s.scheduledAt = new Date(s.scheduledAt);
            if (stryMutAct_9fa48("69885") ? false : stryMutAct_9fa48("69884") ? true : (stryCov_9fa48("69884", "69885"), s.completedAt)) {
              s.completedAt = new Date(s.completedAt);
            }
          });
          this.employees.set(e.id, e);
        }));
        this.insights = stryMutAct_9fa48("69889") ? data.insights && [] : stryMutAct_9fa48("69888") ? false : stryMutAct_9fa48("69887") ? true : (stryCov_9fa48("69887", "69888", "69889"), data.insights || (stryMutAct_9fa48("69890") ? ["Stryker was here"] : (stryCov_9fa48("69890"), [])));
      }
    } catch (error) {
      console.error('Failed to load union data:', error);
    }
  }
  private saveToStorage(): void {
    try {
      const data = stryMutAct_9fa48("69895") ? {} : (stryCov_9fa48("69895"), {
        employees: Array.from(this.employees.values()),
        insights: this.insights
      });
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save union data:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // EMPLOYEE MANAGEMENT
  // ---------------------------------------------------------------------------

  addEmployee(employeeData: Omit<Employee, 'id' | 'burnoutScore' | 'burnoutLevel' | 'burnoutFactors' | 'rightsViolations' | 'pendingRequests' | 'advocacySessions'>): Employee {
    const id = `emp-${Date.now()}-${stryMutAct_9fa48("69900") ? Math.random().toString(36) : (stryCov_9fa48("69900"), Math.random().toString(36).substr(2, 9))}`;
    const burnout = calculateBurnoutScore(employeeData);
    const employee: Employee = stryMutAct_9fa48("69901") ? {} : (stryCov_9fa48("69901"), {
      ...employeeData,
      id,
      burnoutScore: burnout.score,
      burnoutLevel: burnout.level,
      burnoutFactors: burnout.factors,
      rightsViolations: stryMutAct_9fa48("69902") ? ["Stryker was here"] : (stryCov_9fa48("69902"), []),
      pendingRequests: stryMutAct_9fa48("69903") ? ["Stryker was here"] : (stryCov_9fa48("69903"), []),
      advocacySessions: stryMutAct_9fa48("69904") ? ["Stryker was here"] : (stryCov_9fa48("69904"), [])
    });
    this.employees.set(id, employee);
    this.saveToStorage();
    return employee;
  }
  updateEmployee(id: string, updates: Partial<Employee>): Employee | null {
    const employee = this.employees.get(id);
    if (stryMutAct_9fa48("69908") ? false : stryMutAct_9fa48("69907") ? true : stryMutAct_9fa48("69906") ? employee : (stryCov_9fa48("69906", "69907", "69908"), !employee)) {
      return null;
    }
    Object.assign(employee, updates);

    // Recalculate burnout
    const burnout = calculateBurnoutScore(employee);
    employee.burnoutScore = burnout.score;
    employee.burnoutLevel = burnout.level;
    employee.burnoutFactors = burnout.factors;
    this.saveToStorage();
    return employee;
  }
  getEmployee(id: string): Employee | undefined {
    return this.employees.get(id);
  }
  getAllEmployees(): Employee[] {
    return Array.from(this.employees.values());
  }
  getEmployeesByBurnoutLevel(level: BurnoutLevel): Employee[] {
    return stryMutAct_9fa48("69913") ? this.getAllEmployees() : (stryCov_9fa48("69913"), this.getAllEmployees().filter(stryMutAct_9fa48("69914") ? () => undefined : (stryCov_9fa48("69914"), e => stryMutAct_9fa48("69917") ? e.burnoutLevel !== level : stryMutAct_9fa48("69916") ? false : stryMutAct_9fa48("69915") ? true : (stryCov_9fa48("69915", "69916", "69917"), e.burnoutLevel === level))));
  }
  getAtRiskEmployees(): Employee[] {
    return stryMutAct_9fa48("69919") ? this.getAllEmployees() : (stryCov_9fa48("69919"), this.getAllEmployees().filter(stryMutAct_9fa48("69920") ? () => undefined : (stryCov_9fa48("69920"), e => stryMutAct_9fa48("69923") ? (e.burnoutLevel === 'warning' || e.burnoutLevel === 'critical') && e.burnoutLevel === 'emergency' : stryMutAct_9fa48("69922") ? false : stryMutAct_9fa48("69921") ? true : (stryCov_9fa48("69921", "69922", "69923"), (stryMutAct_9fa48("69925") ? e.burnoutLevel === 'warning' && e.burnoutLevel === 'critical' : stryMutAct_9fa48("69924") ? false : (stryCov_9fa48("69924", "69925"), (stryMutAct_9fa48("69927") ? e.burnoutLevel !== 'warning' : stryMutAct_9fa48("69926") ? false : (stryCov_9fa48("69926", "69927"), e.burnoutLevel === 'warning')) || (stryMutAct_9fa48("69930") ? e.burnoutLevel !== 'critical' : stryMutAct_9fa48("69929") ? false : (stryCov_9fa48("69929", "69930"), e.burnoutLevel === 'critical')))) || (stryMutAct_9fa48("69933") ? e.burnoutLevel !== 'emergency' : stryMutAct_9fa48("69932") ? false : (stryCov_9fa48("69932", "69933"), e.burnoutLevel === 'emergency'))))));
  }

  // ---------------------------------------------------------------------------
  // BURNOUT ANALYSIS
  // ---------------------------------------------------------------------------

  async analyzeBurnout(employeeId: string): Promise<{
    score: number;
    level: BurnoutLevel;
    factors: BurnoutFactor[];
    recommendations: string[];
  }> {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("69938") ? false : stryMutAct_9fa48("69937") ? true : stryMutAct_9fa48("69936") ? employee : (stryCov_9fa48("69936", "69937", "69938"), !employee)) {
      throw new Error('Employee not found');
    }
    const burnout = calculateBurnoutScore(employee);
    let recommendations: string[] = burnout.factors.flatMap(stryMutAct_9fa48("69941") ? () => undefined : (stryCov_9fa48("69941"), f => f.recommendations));
    if (stryMutAct_9fa48("69943") ? false : stryMutAct_9fa48("69942") ? true : (stryCov_9fa48("69942", "69943"), this.ollamaAvailable)) {
      try {
        const prompt = `As an employee wellness AI, analyze this burnout assessment and provide 3-5 specific, actionable recommendations:

Employee: ${employee.name}
Role: ${employee.role}
Burnout Score: ${burnout.score}/100 (${burnout.level})

Factors:
${burnout.factors.map(stryMutAct_9fa48("69947") ? () => undefined : (stryCov_9fa48("69947"), f => `- ${f.name}: ${f.score}/100 - ${f.indicators.join(', ')}`)).join('\n')}

Provide recommendations in JSON format:
{
  "recommendations": ["recommendation 1", "recommendation 2", ...]
}`;
        const response = await ollamaService.generate(stryMutAct_9fa48("69951") ? {} : (stryCov_9fa48("69951"), {
          prompt,
          model: 'llama3.2:latest'
        }));
        const jsonMatch = (stryMutAct_9fa48("69955") ? response.response && '' : stryMutAct_9fa48("69954") ? false : stryMutAct_9fa48("69953") ? true : (stryCov_9fa48("69953", "69954", "69955"), response.response || '')).match(stryMutAct_9fa48("69960") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("69959") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("69958") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("69957") ? /\{[\s\S]\}/ : (stryCov_9fa48("69957", "69958", "69959", "69960"), /\{[\s\S]*\}/));
        if (stryMutAct_9fa48("69962") ? false : stryMutAct_9fa48("69961") ? true : (stryCov_9fa48("69961", "69962"), jsonMatch)) {
          const parsed = JSON.parse(jsonMatch[0]);
          recommendations = stryMutAct_9fa48("69966") ? parsed.recommendations && recommendations : stryMutAct_9fa48("69965") ? false : stryMutAct_9fa48("69964") ? true : (stryCov_9fa48("69964", "69965", "69966"), parsed.recommendations || recommendations);
        }
      } catch (error) {
        console.error('Ollama burnout analysis failed:', error);
      }
    }

    // Update employee
    employee.burnoutScore = burnout.score;
    employee.burnoutLevel = burnout.level;
    employee.burnoutFactors = burnout.factors;
    this.saveToStorage();
    return stryMutAct_9fa48("69969") ? {} : (stryCov_9fa48("69969"), {
      ...burnout,
      recommendations
    });
  }

  // ---------------------------------------------------------------------------
  // RIGHTS VIOLATIONS
  // ---------------------------------------------------------------------------

  reportViolation(employeeId: string, type: RightType, severity: RightsViolation['severity'], description: string): RightsViolation {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("69973") ? false : stryMutAct_9fa48("69972") ? true : stryMutAct_9fa48("69971") ? employee : (stryCov_9fa48("69971", "69972", "69973"), !employee)) {
      throw new Error('Employee not found');
    }
    const violation: RightsViolation = stryMutAct_9fa48("69976") ? {} : (stryCov_9fa48("69976"), {
      id: `violation-${Date.now()}`,
      type,
      severity,
      description,
      occurredAt: new Date(),
      reportedAt: new Date(),
      status: 'reported',
      auditTrail: stryMutAct_9fa48("69979") ? [] : (stryCov_9fa48("69979"), [stryMutAct_9fa48("69980") ? {} : (stryCov_9fa48("69980"), {
        id: `audit-${Date.now()}`,
        timestamp: new Date(),
        action: 'Violation reported',
        actor: 'system',
        details: stryMutAct_9fa48("69984") ? {} : (stryCov_9fa48("69984"), {
          type,
          severity,
          description
        }),
        hash: this.generateHash(stryMutAct_9fa48("69985") ? {} : (stryCov_9fa48("69985"), {
          type,
          severity,
          description,
          timestamp: Date.now()
        }))
      })])
    });
    employee.rightsViolations.push(violation);
    this.saveToStorage();

    // Generate insight
    this.addInsight(stryMutAct_9fa48("69986") ? {} : (stryCov_9fa48("69986"), {
      type: 'violation',
      severity: (stryMutAct_9fa48("69990") ? severity !== 'critical' : stryMutAct_9fa48("69989") ? false : stryMutAct_9fa48("69988") ? true : (stryCov_9fa48("69988", "69989", "69990"), severity === 'critical')) ? 'critical' : (stryMutAct_9fa48("69995") ? severity !== 'severe' : stryMutAct_9fa48("69994") ? false : stryMutAct_9fa48("69993") ? true : (stryCov_9fa48("69993", "69994", "69995"), severity === 'severe')) ? 'warning' : 'info',
      title: `${stryMutAct_9fa48("70000") ? type.charAt(0).toUpperCase() - type.slice(1) : (stryCov_9fa48("70000"), (stryMutAct_9fa48("70002") ? type.toUpperCase() : stryMutAct_9fa48("70001") ? type.charAt(0).toLowerCase() : (stryCov_9fa48("70001", "70002"), type.charAt(0).toUpperCase())) + (stryMutAct_9fa48("70003") ? type : (stryCov_9fa48("70003"), type.slice(1))))} Rights Violation Reported`,
      description,
      affectedEmployees: stryMutAct_9fa48("70004") ? [] : (stryCov_9fa48("70004"), [employeeId]),
      suggestedAction: 'Review and investigate the reported violation'
    }));
    return violation;
  }
  updateViolationStatus(employeeId: string, violationId: string, status: RightsViolation['status'], resolution?: string): RightsViolation | null {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("70009") ? false : stryMutAct_9fa48("70008") ? true : stryMutAct_9fa48("70007") ? employee : (stryCov_9fa48("70007", "70008", "70009"), !employee)) {
      return null;
    }
    const violation = employee.rightsViolations.find(stryMutAct_9fa48("70011") ? () => undefined : (stryCov_9fa48("70011"), v => stryMutAct_9fa48("70014") ? v.id !== violationId : stryMutAct_9fa48("70013") ? false : stryMutAct_9fa48("70012") ? true : (stryCov_9fa48("70012", "70013", "70014"), v.id === violationId)));
    if (stryMutAct_9fa48("70017") ? false : stryMutAct_9fa48("70016") ? true : stryMutAct_9fa48("70015") ? violation : (stryCov_9fa48("70015", "70016", "70017"), !violation)) {
      return null;
    }
    violation.status = status;
    if (stryMutAct_9fa48("70020") ? false : stryMutAct_9fa48("70019") ? true : (stryCov_9fa48("70019", "70020"), resolution)) {
      violation.resolution = resolution;
    }
    violation.auditTrail.push(stryMutAct_9fa48("70022") ? {} : (stryCov_9fa48("70022"), {
      id: `audit-${Date.now()}`,
      timestamp: new Date(),
      action: `Status updated to ${status}`,
      actor: 'system',
      details: stryMutAct_9fa48("70026") ? {} : (stryCov_9fa48("70026"), {
        status,
        resolution
      }),
      hash: this.generateHash(stryMutAct_9fa48("70027") ? {} : (stryCov_9fa48("70027"), {
        status,
        resolution,
        timestamp: Date.now()
      }))
    }));
    this.saveToStorage();
    return violation;
  }
  private generateHash(data: any): string {
    const str = JSON.stringify(data);
    let hash = 0;
    for (let i = 0; stryMutAct_9fa48("70031") ? i >= str.length : stryMutAct_9fa48("70030") ? i <= str.length : stryMutAct_9fa48("70029") ? false : (stryCov_9fa48("70029", "70030", "70031"), i < str.length); stryMutAct_9fa48("70032") ? i-- : (stryCov_9fa48("70032"), i++)) {
      const char = str.charCodeAt(i);
      hash = stryMutAct_9fa48("70034") ? (hash << 5) - hash - char : (stryCov_9fa48("70034"), (stryMutAct_9fa48("70035") ? (hash << 5) + hash : (stryCov_9fa48("70035"), (hash << 5) - hash)) + char);
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16).padStart(8, '0');
  }

  // ---------------------------------------------------------------------------
  // EMPLOYEE REQUESTS
  // ---------------------------------------------------------------------------

  createRequest(employeeId: string, type: EmployeeRequest['type'], title: string, description: string, priority: EmployeeRequest['priority'] = 'medium'): EmployeeRequest {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("70041") ? false : stryMutAct_9fa48("70040") ? true : stryMutAct_9fa48("70039") ? employee : (stryCov_9fa48("70039", "70040", "70041"), !employee)) {
      throw new Error('Employee not found');
    }
    const request: EmployeeRequest = stryMutAct_9fa48("70044") ? {} : (stryCov_9fa48("70044"), {
      id: `request-${Date.now()}`,
      type,
      title,
      description,
      submittedAt: new Date(),
      status: 'draft',
      priority,
      aiPrepared: stryMutAct_9fa48("70047") ? true : (stryCov_9fa48("70047"), false)
    });
    employee.pendingRequests.push(request);
    this.saveToStorage();
    return request;
  }
  async prepareNegotiation(employeeId: string, requestId: string): Promise<NegotiationBrief> {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("70051") ? false : stryMutAct_9fa48("70050") ? true : stryMutAct_9fa48("70049") ? employee : (stryCov_9fa48("70049", "70050", "70051"), !employee)) {
      throw new Error('Employee not found');
    }
    const request = employee.pendingRequests.find(stryMutAct_9fa48("70054") ? () => undefined : (stryCov_9fa48("70054"), r => stryMutAct_9fa48("70057") ? r.id !== requestId : stryMutAct_9fa48("70056") ? false : stryMutAct_9fa48("70055") ? true : (stryCov_9fa48("70055", "70056", "70057"), r.id === requestId)));
    if (stryMutAct_9fa48("70060") ? false : stryMutAct_9fa48("70059") ? true : stryMutAct_9fa48("70058") ? request : (stryCov_9fa48("70058", "70059", "70060"), !request)) {
      throw new Error('Request not found');
    }

    // Calculate market data (simplified - would normally use external APIs)
    const marketRange = stryMutAct_9fa48("70063") ? {} : (stryCov_9fa48("70063"), {
      min: Math.round(stryMutAct_9fa48("70064") ? employee.salary / 0.85 : (stryCov_9fa48("70064"), employee.salary * 0.85)),
      median: Math.round(stryMutAct_9fa48("70065") ? employee.salary / 1.05 : (stryCov_9fa48("70065"), employee.salary * 1.05)),
      max: Math.round(stryMutAct_9fa48("70066") ? employee.salary / 1.25 : (stryCov_9fa48("70066"), employee.salary * 1.25))
    });
    const marketPosition: 'below' | 'at' | 'above' = (stryMutAct_9fa48("70070") ? employee.salary >= marketRange.min : stryMutAct_9fa48("70069") ? employee.salary <= marketRange.min : stryMutAct_9fa48("70068") ? false : stryMutAct_9fa48("70067") ? true : (stryCov_9fa48("70067", "70068", "70069", "70070"), employee.salary < marketRange.min)) ? 'below' : (stryMutAct_9fa48("70075") ? employee.salary <= marketRange.max : stryMutAct_9fa48("70074") ? employee.salary >= marketRange.max : stryMutAct_9fa48("70073") ? false : stryMutAct_9fa48("70072") ? true : (stryCov_9fa48("70072", "70073", "70074", "70075"), employee.salary > marketRange.max)) ? 'above' : 'at';
    const marketPercentile = Math.round(stryMutAct_9fa48("70078") ? (employee.salary - marketRange.min) / (marketRange.max - marketRange.min) / 100 : (stryCov_9fa48("70078"), (stryMutAct_9fa48("70079") ? (employee.salary - marketRange.min) * (marketRange.max - marketRange.min) : (stryCov_9fa48("70079"), (stryMutAct_9fa48("70080") ? employee.salary + marketRange.min : (stryCov_9fa48("70080"), employee.salary - marketRange.min)) / (stryMutAct_9fa48("70081") ? marketRange.max + marketRange.min : (stryCov_9fa48("70081"), marketRange.max - marketRange.min)))) * 100));
    const brief: NegotiationBrief = stryMutAct_9fa48("70082") ? {} : (stryCov_9fa48("70082"), {
      id: `brief-${Date.now()}`,
      generatedAt: new Date(),
      context: `Negotiation preparation for ${request.type} request`,
      marketSalaryRange: marketRange,
      marketPosition,
      marketPercentile,
      performanceRating: 4.2,
      // Would come from performance system
      performanceHighlights: stryMutAct_9fa48("70085") ? [] : (stryCov_9fa48("70085"), ['Consistently meets deadlines', 'Strong team collaboration', 'Key contributor to recent project']),
      impactMetrics: stryMutAct_9fa48("70089") ? [] : (stryCov_9fa48("70089"), [stryMutAct_9fa48("70090") ? {} : (stryCov_9fa48("70090"), {
        metric: 'Tenure',
        value: `${Math.round(stryMutAct_9fa48("70093") ? (Date.now() - employee.startDate.getTime()) * (365 * 24 * 60 * 60 * 1000) : (stryCov_9fa48("70093"), (stryMutAct_9fa48("70094") ? Date.now() + employee.startDate.getTime() : (stryCov_9fa48("70094"), Date.now() - employee.startDate.getTime())) / (stryMutAct_9fa48("70095") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("70095"), (stryMutAct_9fa48("70096") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("70096"), (stryMutAct_9fa48("70097") ? 365 * 24 / 60 : (stryCov_9fa48("70097"), (stryMutAct_9fa48("70098") ? 365 / 24 : (stryCov_9fa48("70098"), 365 * 24)) * 60)) * 60)) * 1000))))} years`,
        comparison: 'above average'
      }), stryMutAct_9fa48("70100") ? {} : (stryCov_9fa48("70100"), {
        metric: 'Overtime',
        value: `${employee.overtimeHoursThisMonth} hrs/month`,
        comparison: 'shows dedication'
      })]),
      leveragePoints: stryMutAct_9fa48("70104") ? [] : (stryCov_9fa48("70104"), [stryMutAct_9fa48("70105") ? {} : (stryCov_9fa48("70105"), {
        point: 'Market rate is higher than current compensation',
        strength: (stryMutAct_9fa48("70109") ? marketPosition !== 'below' : stryMutAct_9fa48("70108") ? false : stryMutAct_9fa48("70107") ? true : (stryCov_9fa48("70107", "70108", "70109"), marketPosition === 'below')) ? 'strong' : 'moderate'
      }), stryMutAct_9fa48("70113") ? {} : (stryCov_9fa48("70113"), {
        point: 'Institutional knowledge and relationships',
        strength: 'moderate'
      }), stryMutAct_9fa48("70116") ? {} : (stryCov_9fa48("70116"), {
        point: 'Proven track record',
        strength: 'strong'
      })]),
      riskFactors: stryMutAct_9fa48("70119") ? [] : (stryCov_9fa48("70119"), [stryMutAct_9fa48("70120") ? {} : (stryCov_9fa48("70120"), {
        factor: 'Budget constraints may limit approval',
        mitigation: 'Propose phased increase or alternative compensation'
      }), stryMutAct_9fa48("70123") ? {} : (stryCov_9fa48("70123"), {
        factor: 'Timing may not align with review cycle',
        mitigation: 'Document for next cycle with interim benefits'
      })]),
      askRange: stryMutAct_9fa48("70126") ? {} : (stryCov_9fa48("70126"), {
        minimum: Math.round(stryMutAct_9fa48("70127") ? employee.salary / 1.05 : (stryCov_9fa48("70127"), employee.salary * 1.05)),
        target: Math.round(stryMutAct_9fa48("70128") ? employee.salary / 1.12 : (stryCov_9fa48("70128"), employee.salary * 1.12)),
        stretch: Math.round(stryMutAct_9fa48("70129") ? employee.salary / 1.18 : (stryCov_9fa48("70129"), employee.salary * 1.18))
      }),
      talkingPoints: stryMutAct_9fa48("70130") ? [] : (stryCov_9fa48("70130"), ['I have consistently delivered high-quality work over the past year', 'My contributions have directly impacted team success', 'Market research shows my current compensation is below industry standards']),
      objectionHandlers: stryMutAct_9fa48("70134") ? [] : (stryCov_9fa48("70134"), [stryMutAct_9fa48("70135") ? {} : (stryCov_9fa48("70135"), {
        objection: 'Budget is tight this year',
        response: 'I understand. Could we discuss a phased approach or non-monetary benefits?'
      }), stryMutAct_9fa48("70138") ? {} : (stryCov_9fa48("70138"), {
        objection: 'Your performance hasn\'t justified a raise',
        response: 'I\'d like to understand what specific achievements would warrant reconsideration'
      })]),
      walkawayConditions: stryMutAct_9fa48("70141") ? [] : (stryCov_9fa48("70141"), ['No increase offered after multiple discussions', 'Proposed increase less than 3% with no timeline for more']),
      bestTimeToAsk: 'After successful project completion or during annual review',
      budgetCycleContext: 'Q4 typically has most budget flexibility for next year planning'
    });

    // Enhance with AI if available
    if (stryMutAct_9fa48("70147") ? false : stryMutAct_9fa48("70146") ? true : (stryCov_9fa48("70146", "70147"), this.ollamaAvailable)) {
      try {
        const prompt = `As a career negotiation coach, enhance this raise negotiation brief with 3 additional talking points and 2 objection handlers specific to this situation:

Employee: ${employee.name}
Role: ${employee.role}, Level: ${employee.level}
Department: ${employee.department}
Tenure: ${Math.round(stryMutAct_9fa48("70151") ? (Date.now() - employee.startDate.getTime()) * (365 * 24 * 60 * 60 * 1000) : (stryCov_9fa48("70151"), (stryMutAct_9fa48("70152") ? Date.now() + employee.startDate.getTime() : (stryCov_9fa48("70152"), Date.now() - employee.startDate.getTime())) / (stryMutAct_9fa48("70153") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("70153"), (stryMutAct_9fa48("70154") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("70154"), (stryMutAct_9fa48("70155") ? 365 * 24 / 60 : (stryCov_9fa48("70155"), (stryMutAct_9fa48("70156") ? 365 / 24 : (stryCov_9fa48("70156"), 365 * 24)) * 60)) * 60)) * 1000))))} years
Current Salary: $${employee.salary.toLocaleString()}
Market Position: ${marketPosition} market (${marketPercentile}th percentile)
Last Raise: ${employee.lastRaiseDate ? employee.lastRaiseDate.toLocaleDateString() : 'No record'}

Respond in JSON:
{
  "additionalTalkingPoints": ["point1", "point2", "point3"],
  "additionalObjectionHandlers": [
    {"objection": "...", "response": "..."},
    {"objection": "...", "response": "..."}
  ]
}`;
        const response = await ollamaService.generate(stryMutAct_9fa48("70158") ? {} : (stryCov_9fa48("70158"), {
          prompt,
          model: 'llama3.2:latest'
        }));
        const jsonMatch = (stryMutAct_9fa48("70162") ? response.response && '' : stryMutAct_9fa48("70161") ? false : stryMutAct_9fa48("70160") ? true : (stryCov_9fa48("70160", "70161", "70162"), response.response || '')).match(stryMutAct_9fa48("70167") ? /\{[\s\s]*\}/ : stryMutAct_9fa48("70166") ? /\{[\S\S]*\}/ : stryMutAct_9fa48("70165") ? /\{[^\s\S]*\}/ : stryMutAct_9fa48("70164") ? /\{[\s\S]\}/ : (stryCov_9fa48("70164", "70165", "70166", "70167"), /\{[\s\S]*\}/));
        if (stryMutAct_9fa48("70169") ? false : stryMutAct_9fa48("70168") ? true : (stryCov_9fa48("70168", "70169"), jsonMatch)) {
          const parsed = JSON.parse(jsonMatch[0]);
          if (stryMutAct_9fa48("70172") ? false : stryMutAct_9fa48("70171") ? true : (stryCov_9fa48("70171", "70172"), parsed.additionalTalkingPoints)) {
            brief.talkingPoints.push(...parsed.additionalTalkingPoints);
          }
          if (stryMutAct_9fa48("70175") ? false : stryMutAct_9fa48("70174") ? true : (stryCov_9fa48("70174", "70175"), parsed.additionalObjectionHandlers)) {
            brief.objectionHandlers.push(...parsed.additionalObjectionHandlers);
          }
        }
      } catch (error) {
        console.error('AI enhancement failed:', error);
      }
    }
    request.negotiationBrief = brief;
    request.aiPrepared = stryMutAct_9fa48("70179") ? false : (stryCov_9fa48("70179"), true);
    this.saveToStorage();
    return brief;
  }
  submitRequest(employeeId: string, requestId: string): EmployeeRequest | null {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("70183") ? false : stryMutAct_9fa48("70182") ? true : stryMutAct_9fa48("70181") ? employee : (stryCov_9fa48("70181", "70182", "70183"), !employee)) {
      return null;
    }
    const request = employee.pendingRequests.find(stryMutAct_9fa48("70185") ? () => undefined : (stryCov_9fa48("70185"), r => stryMutAct_9fa48("70188") ? r.id !== requestId : stryMutAct_9fa48("70187") ? false : stryMutAct_9fa48("70186") ? true : (stryCov_9fa48("70186", "70187", "70188"), r.id === requestId)));
    if (stryMutAct_9fa48("70191") ? false : stryMutAct_9fa48("70190") ? true : stryMutAct_9fa48("70189") ? request : (stryCov_9fa48("70189", "70190", "70191"), !request)) {
      return null;
    }
    request.status = 'submitted';
    this.saveToStorage();
    return request;
  }

  // ---------------------------------------------------------------------------
  // ADVOCACY SESSIONS
  // ---------------------------------------------------------------------------

  scheduleAdvocacySession(employeeId: string, type: AdvocacySession['type'], topic: string, scheduledAt: Date): AdvocacySession {
    const employee = this.employees.get(employeeId);
    if (stryMutAct_9fa48("70197") ? false : stryMutAct_9fa48("70196") ? true : stryMutAct_9fa48("70195") ? employee : (stryCov_9fa48("70195", "70196", "70197"), !employee)) {
      throw new Error('Employee not found');
    }
    const session: AdvocacySession = stryMutAct_9fa48("70200") ? {} : (stryCov_9fa48("70200"), {
      id: `session-${Date.now()}`,
      type,
      topic,
      scheduledAt,
      recommendations: stryMutAct_9fa48("70202") ? ["Stryker was here"] : (stryCov_9fa48("70202"), []),
      confidential: stryMutAct_9fa48("70203") ? false : (stryCov_9fa48("70203"), true)
    });
    employee.advocacySessions.push(session);
    this.saveToStorage();
    return session;
  }

  // ---------------------------------------------------------------------------
  // INSIGHTS
  // ---------------------------------------------------------------------------

  private addInsight(insight: Omit<EmployeeInsight, 'id' | 'detectedAt'>): void {
    this.insights.push(stryMutAct_9fa48("70205") ? {} : (stryCov_9fa48("70205"), {
      ...insight,
      id: `insight-${Date.now()}`,
      detectedAt: new Date()
    }));
    this.saveToStorage();
  }
  getInsights(): EmployeeInsight[] {
    return stryMutAct_9fa48("70208") ? this.insights : (stryCov_9fa48("70208"), this.insights.sort(stryMutAct_9fa48("70209") ? () => undefined : (stryCov_9fa48("70209"), (a, b) => stryMutAct_9fa48("70210") ? b.detectedAt.getTime() + a.detectedAt.getTime() : (stryCov_9fa48("70210"), b.detectedAt.getTime() - a.detectedAt.getTime()))));
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getWorkforceMetrics(): WorkforceMetrics {
    const employees = this.getAllEmployees();
    if (stryMutAct_9fa48("70214") ? employees.length !== 0 : stryMutAct_9fa48("70213") ? false : stryMutAct_9fa48("70212") ? true : (stryCov_9fa48("70212", "70213", "70214"), employees.length === 0)) {
      return stryMutAct_9fa48("70216") ? {} : (stryCov_9fa48("70216"), {
        totalEmployees: 0,
        avgBurnoutScore: 0,
        burnoutDistribution: stryMutAct_9fa48("70217") ? {} : (stryCov_9fa48("70217"), {
          healthy: 0,
          caution: 0,
          warning: 0,
          critical: 0,
          emergency: 0
        }),
        avgTenure: 0,
        turnoverRate: 0,
        openViolations: 0,
        pendingRequests: 0,
        avgSalaryVsMarket: 0,
        overtimeAverage: 0,
        ptoUtilization: 0,
        rightsByType: stryMutAct_9fa48("70218") ? {} : (stryCov_9fa48("70218"), {
          compensation: stryMutAct_9fa48("70219") ? {} : (stryCov_9fa48("70219"), {
            violations: 0,
            resolved: 0
          }),
          time_off: stryMutAct_9fa48("70220") ? {} : (stryCov_9fa48("70220"), {
            violations: 0,
            resolved: 0
          }),
          workload: stryMutAct_9fa48("70221") ? {} : (stryCov_9fa48("70221"), {
            violations: 0,
            resolved: 0
          }),
          safety: stryMutAct_9fa48("70222") ? {} : (stryCov_9fa48("70222"), {
            violations: 0,
            resolved: 0
          }),
          privacy: stryMutAct_9fa48("70223") ? {} : (stryCov_9fa48("70223"), {
            violations: 0,
            resolved: 0
          }),
          dignity: stryMutAct_9fa48("70224") ? {} : (stryCov_9fa48("70224"), {
            violations: 0,
            resolved: 0
          }),
          growth: stryMutAct_9fa48("70225") ? {} : (stryCov_9fa48("70225"), {
            violations: 0,
            resolved: 0
          }),
          voice: stryMutAct_9fa48("70226") ? {} : (stryCov_9fa48("70226"), {
            violations: 0,
            resolved: 0
          })
        })
      });
    }
    const burnoutDistribution: Record<BurnoutLevel, number> = stryMutAct_9fa48("70227") ? {} : (stryCov_9fa48("70227"), {
      healthy: 0,
      caution: 0,
      warning: 0,
      critical: 0,
      emergency: 0
    });
    employees.forEach(stryMutAct_9fa48("70228") ? () => undefined : (stryCov_9fa48("70228"), e => stryMutAct_9fa48("70229") ? burnoutDistribution[e.burnoutLevel]-- : (stryCov_9fa48("70229"), burnoutDistribution[e.burnoutLevel]++)));
    const rightsByType: Record<RightType, {
      violations: number;
      resolved: number;
    }> = stryMutAct_9fa48("70230") ? {} : (stryCov_9fa48("70230"), {
      compensation: stryMutAct_9fa48("70231") ? {} : (stryCov_9fa48("70231"), {
        violations: 0,
        resolved: 0
      }),
      time_off: stryMutAct_9fa48("70232") ? {} : (stryCov_9fa48("70232"), {
        violations: 0,
        resolved: 0
      }),
      workload: stryMutAct_9fa48("70233") ? {} : (stryCov_9fa48("70233"), {
        violations: 0,
        resolved: 0
      }),
      safety: stryMutAct_9fa48("70234") ? {} : (stryCov_9fa48("70234"), {
        violations: 0,
        resolved: 0
      }),
      privacy: stryMutAct_9fa48("70235") ? {} : (stryCov_9fa48("70235"), {
        violations: 0,
        resolved: 0
      }),
      dignity: stryMutAct_9fa48("70236") ? {} : (stryCov_9fa48("70236"), {
        violations: 0,
        resolved: 0
      }),
      growth: stryMutAct_9fa48("70237") ? {} : (stryCov_9fa48("70237"), {
        violations: 0,
        resolved: 0
      }),
      voice: stryMutAct_9fa48("70238") ? {} : (stryCov_9fa48("70238"), {
        violations: 0,
        resolved: 0
      })
    });
    employees.forEach(e => {
      e.rightsViolations.forEach(v => {
        stryMutAct_9fa48("70241") ? rightsByType[v.type].violations-- : (stryCov_9fa48("70241"), rightsByType[v.type].violations++);
        if (stryMutAct_9fa48("70244") ? v.status !== 'resolved' : stryMutAct_9fa48("70243") ? false : stryMutAct_9fa48("70242") ? true : (stryCov_9fa48("70242", "70243", "70244"), v.status === 'resolved')) {
          stryMutAct_9fa48("70247") ? rightsByType[v.type].resolved-- : (stryCov_9fa48("70247"), rightsByType[v.type].resolved++);
        }
      });
    });
    const avgBurnoutScore = stryMutAct_9fa48("70248") ? employees.reduce((sum, e) => sum + e.burnoutScore, 0) * employees.length : (stryCov_9fa48("70248"), employees.reduce(stryMutAct_9fa48("70249") ? () => undefined : (stryCov_9fa48("70249"), (sum, e) => stryMutAct_9fa48("70250") ? sum - e.burnoutScore : (stryCov_9fa48("70250"), sum + e.burnoutScore)), 0) / employees.length);
    const avgTenure = stryMutAct_9fa48("70251") ? employees.reduce((sum, e) => sum + (Date.now() - e.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000), 0) * employees.length : (stryCov_9fa48("70251"), employees.reduce(stryMutAct_9fa48("70252") ? () => undefined : (stryCov_9fa48("70252"), (sum, e) => stryMutAct_9fa48("70253") ? sum - (Date.now() - e.startDate.getTime()) / (365 * 24 * 60 * 60 * 1000) : (stryCov_9fa48("70253"), sum + (stryMutAct_9fa48("70254") ? (Date.now() - e.startDate.getTime()) * (365 * 24 * 60 * 60 * 1000) : (stryCov_9fa48("70254"), (stryMutAct_9fa48("70255") ? Date.now() + e.startDate.getTime() : (stryCov_9fa48("70255"), Date.now() - e.startDate.getTime())) / (stryMutAct_9fa48("70256") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("70256"), (stryMutAct_9fa48("70257") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("70257"), (stryMutAct_9fa48("70258") ? 365 * 24 / 60 : (stryCov_9fa48("70258"), (stryMutAct_9fa48("70259") ? 365 / 24 : (stryCov_9fa48("70259"), 365 * 24)) * 60)) * 60)) * 1000)))))), 0) / employees.length);
    const overtimeAverage = stryMutAct_9fa48("70260") ? employees.reduce((sum, e) => sum + e.overtimeHoursThisMonth, 0) * employees.length : (stryCov_9fa48("70260"), employees.reduce(stryMutAct_9fa48("70261") ? () => undefined : (stryCov_9fa48("70261"), (sum, e) => stryMutAct_9fa48("70262") ? sum - e.overtimeHoursThisMonth : (stryCov_9fa48("70262"), sum + e.overtimeHoursThisMonth)), 0) / employees.length);
    const openViolations = employees.reduce(stryMutAct_9fa48("70263") ? () => undefined : (stryCov_9fa48("70263"), (sum, e) => stryMutAct_9fa48("70264") ? sum - e.rightsViolations.filter(v => v.status !== 'resolved').length : (stryCov_9fa48("70264"), sum + (stryMutAct_9fa48("70265") ? e.rightsViolations.length : (stryCov_9fa48("70265"), e.rightsViolations.filter(stryMutAct_9fa48("70266") ? () => undefined : (stryCov_9fa48("70266"), v => stryMutAct_9fa48("70269") ? v.status === 'resolved' : stryMutAct_9fa48("70268") ? false : stryMutAct_9fa48("70267") ? true : (stryCov_9fa48("70267", "70268", "70269"), v.status !== 'resolved'))).length)))), 0);
    const pendingRequests = employees.reduce(stryMutAct_9fa48("70271") ? () => undefined : (stryCov_9fa48("70271"), (sum, e) => stryMutAct_9fa48("70272") ? sum - e.pendingRequests.filter(r => r.status !== 'approved' && r.status !== 'denied').length : (stryCov_9fa48("70272"), sum + (stryMutAct_9fa48("70273") ? e.pendingRequests.length : (stryCov_9fa48("70273"), e.pendingRequests.filter(stryMutAct_9fa48("70274") ? () => undefined : (stryCov_9fa48("70274"), r => stryMutAct_9fa48("70277") ? r.status !== 'approved' || r.status !== 'denied' : stryMutAct_9fa48("70276") ? false : stryMutAct_9fa48("70275") ? true : (stryCov_9fa48("70275", "70276", "70277"), (stryMutAct_9fa48("70279") ? r.status === 'approved' : stryMutAct_9fa48("70278") ? true : (stryCov_9fa48("70278", "70279"), r.status !== 'approved')) && (stryMutAct_9fa48("70282") ? r.status === 'denied' : stryMutAct_9fa48("70281") ? true : (stryCov_9fa48("70281", "70282"), r.status !== 'denied'))))).length)))), 0);
    return stryMutAct_9fa48("70284") ? {} : (stryCov_9fa48("70284"), {
      totalEmployees: employees.length,
      avgBurnoutScore: Math.round(avgBurnoutScore),
      burnoutDistribution,
      avgTenure: stryMutAct_9fa48("70285") ? Math.round(avgTenure * 10) * 10 : (stryCov_9fa48("70285"), Math.round(stryMutAct_9fa48("70286") ? avgTenure / 10 : (stryCov_9fa48("70286"), avgTenure * 10)) / 10),
      turnoverRate: 0,
      // Would calculate from historical data
      openViolations,
      pendingRequests,
      avgSalaryVsMarket: 100,
      // Would compare to market data
      overtimeAverage: Math.round(overtimeAverage),
      ptoUtilization: 65,
      // Would calculate from PTO data
      rightsByType
    });
  }

  // ---------------------------------------------------------------------------
  // OLLAMA STATUS
  // ---------------------------------------------------------------------------

  isOllamaAvailable(): boolean {
    return this.ollamaAvailable;
  }
  async refreshOllamaStatus(): Promise<boolean> {
    await this.checkOllamaStatus();
    return this.ollamaAvailable;
  }
}

// Singleton
export const unionService = new UnionService();
export default unionService;