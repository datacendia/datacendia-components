/**
 * Compliance API Client
 * Five Rings of Sovereignty - Frontend API
 */
// @ts-nocheck
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
import { api } from './client';
const API_BASE = '/compliance';
export type ComplianceDomain = 'ethical_ai' | 'cybersecurity' | 'privacy' | 'governance' | 'industry';
export type PillarId = 'helm' | 'lineage' | 'predict' | 'flow' | 'health' | 'guard' | 'ethics' | 'agents';
export interface ComplianceFramework {
  id: string;
  code: string;
  name: string;
  fullName: string;
  domain: ComplianceDomain;
  description: string;
  version: string;
  jurisdiction: string[];
  industries: string[];
  pillars: PillarId[];
  controlCount: number;
  lastUpdated: string;
  status: 'active' | 'deprecated' | 'draft';
}
export interface Ring {
  ring: number;
  domain: ComplianceDomain;
  name: string;
  description: string;
  frameworks: ComplianceFramework[];
  totalControls: number;
}
export interface ComplianceSummary {
  overallScore: number;
  fiveRings: Ring[];
  findings: {
    total: number;
    critical: number;
    high: number;
    medium: number;
    low: number;
    open: number;
  };
  assessments: {
    total: number;
  };
}
export interface ComplianceAssessment {
  id: string;
  organizationId: string;
  frameworkId: string;
  pillarId: PillarId;
  domain: ComplianceDomain;
  assessmentDate: string;
  assessor: string;
  overallScore: number;
  controlResults: ControlResult[];
  findings: Finding[];
  recommendations: string[];
  nextAssessmentDate: string;
  status: 'in_progress' | 'completed' | 'expired';
}
export interface ControlResult {
  controlId: string;
  status: 'compliant' | 'partial' | 'non_compliant' | 'not_applicable';
  score: number;
  evidence: string[];
  gaps: string[];
  automatedTestResult?: boolean;
  lastTestedAt?: string;
}
export interface Finding {
  id: string;
  controlId: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  title: string;
  description: string;
  impact: string;
  recommendation: string;
  dueDate?: string;
  status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
}
export interface BundleFile {
  path: string;
  name: string;
  format: 'json' | 'pdf' | 'csv' | 'xlsx' | 'yaml' | 'txt';
  size: number;
  hash: string;
}
export interface ComplianceBundle {
  id: string;
  organizationId: string;
  generatedAt: string;
  generatedBy: string;
  frameworks: string[];
  pillars: PillarId[];
  domains: ComplianceDomain[];
  fileCount: number;
  files: BundleFile[];
  merkleRoot: string;
  bundleHash: string;
  expiresAt: string;
}

// API Functions
export const complianceApi = stryMutAct_9fa48("14042") ? {} : (stryCov_9fa48("14042"), {
  // Frameworks
  async getFrameworks(filters?: {
    domain?: ComplianceDomain;
    pillar?: PillarId;
    industry?: string;
  }) {
    const params: Record<string, string> = {};
    if (stryMutAct_9fa48("14046") ? filters.domain : stryMutAct_9fa48("14045") ? false : stryMutAct_9fa48("14044") ? true : (stryCov_9fa48("14044", "14045", "14046"), filters?.domain)) {
      params.domain = filters.domain;
    }
    if (stryMutAct_9fa48("14050") ? filters.pillar : stryMutAct_9fa48("14049") ? false : stryMutAct_9fa48("14048") ? true : (stryCov_9fa48("14048", "14049", "14050"), filters?.pillar)) {
      params.pillar = filters.pillar;
    }
    if (stryMutAct_9fa48("14054") ? filters.industry : stryMutAct_9fa48("14053") ? false : stryMutAct_9fa48("14052") ? true : (stryCov_9fa48("14052", "14053", "14054"), filters?.industry)) {
      params.industry = filters.industry;
    }
    return api.get<ComplianceFramework[]>(`${API_BASE}/frameworks`, params);
  },
  async getFramework(id: string) {
    return api.get<ComplianceFramework>(`${API_BASE}/frameworks/${id}`);
  },
  // Five Rings
  async getFiveRings() {
    return api.get<{
      rings: Ring[];
    }>(`${API_BASE}/five-rings`);
  },
  // Pillar Mapping
  async getPillarMapping(pillarId: PillarId) {
    return api.get<unknown>(`${API_BASE}/pillars/${pillarId}/mapping`);
  },
  // Assessments
  async runPillarAssessment(organizationId: string, pillarId: PillarId, assessor: string) {
    return api.post<ComplianceAssessment>(`${API_BASE}/assessments/pillar`, stryMutAct_9fa48("14065") ? {} : (stryCov_9fa48("14065"), {
      organizationId,
      pillarId,
      assessor
    }));
  },
  async runFrameworkAssessment(organizationId: string, frameworkId: string, pillarId: PillarId, assessor: string) {
    return api.post<ComplianceAssessment>(`${API_BASE}/assessments/framework`, stryMutAct_9fa48("14068") ? {} : (stryCov_9fa48("14068"), {
      organizationId,
      frameworkId,
      pillarId,
      assessor
    }));
  },
  async getAssessment(id: string) {
    return api.get<ComplianceAssessment>(`${API_BASE}/assessments/${id}`);
  },
  async getAssessments(organizationId: string, filters?: {
    domain?: ComplianceDomain;
    pillarId?: PillarId;
  }) {
    const params: Record<string, string> = stryMutAct_9fa48("14072") ? {} : (stryCov_9fa48("14072"), {
      organizationId
    });
    if (stryMutAct_9fa48("14075") ? filters.domain : stryMutAct_9fa48("14074") ? false : stryMutAct_9fa48("14073") ? true : (stryCov_9fa48("14073", "14074", "14075"), filters?.domain)) {
      params.domain = filters.domain;
    }
    if (stryMutAct_9fa48("14079") ? filters.pillarId : stryMutAct_9fa48("14078") ? false : stryMutAct_9fa48("14077") ? true : (stryCov_9fa48("14077", "14078", "14079"), filters?.pillarId)) {
      params.pillarId = filters.pillarId;
    }
    return api.get<ComplianceAssessment[]>(`${API_BASE}/assessments`, params);
  },
  // Bundles
  async generateBundle(options: {
    organizationId: string;
    generatedBy: string;
    frameworks?: string[];
    pillars?: PillarId[];
    domains?: ComplianceDomain[];
  }) {
    return api.post<ComplianceBundle>(`${API_BASE}/bundles/generate`, options);
  },
  async getBundle(id: string) {
    return api.get<ComplianceBundle>(`${API_BASE}/bundles/${id}`);
  },
  async downloadBundle(id: string) {
    return api.get<unknown>(`${API_BASE}/bundles/${id}/download`);
  },
  async getBundleFile(bundleId: string, filePath: string) {
    return api.get<unknown>(`${API_BASE}/bundles/${bundleId}/files/${filePath}`);
  },
  // Summary
  async getSummary(organizationId: string) {
    return api.get<ComplianceSummary>(`${API_BASE}/summary`, stryMutAct_9fa48("14092") ? {} : (stryCov_9fa48("14092"), {
      organizationId
    }));
  },
  // ========================================
  // ACTIVE ENFORCEMENT
  // ========================================

  async enforce(agentId: string, action: string, description: string, dataTypes?: string[]) {
    return api.post<unknown>(`${API_BASE}/enforce`, stryMutAct_9fa48("14095") ? {} : (stryCov_9fa48("14095"), {
      agentId,
      action,
      description,
      dataTypes
    }));
  },
  async checkCompliance(context: {
    action: string;
    description: string;
    dataTypes?: string[];
    pillar?: PillarId;
    userId?: string;
    agentId?: string;
  }) {
    return api.post<unknown>(`${API_BASE}/check`, context);
  },
  async getRules(filters?: {
    domain?: ComplianceDomain;
    framework?: string;
  }) {
    const params: Record<string, string> = {};
    if (stryMutAct_9fa48("14101") ? filters.domain : stryMutAct_9fa48("14100") ? false : stryMutAct_9fa48("14099") ? true : (stryCov_9fa48("14099", "14100", "14101"), filters?.domain)) {
      params.domain = filters.domain;
    }
    if (stryMutAct_9fa48("14105") ? filters.framework : stryMutAct_9fa48("14104") ? false : stryMutAct_9fa48("14103") ? true : (stryCov_9fa48("14103", "14104", "14105"), filters?.framework)) {
      params.framework = filters.framework;
    }
    return api.get<unknown>(`${API_BASE}/rules`, params);
  },
  // ========================================
  // COUNCIL INTEGRATION
  // ========================================

  async evaluateCouncilProposal(proposal: {
    id?: string;
    agentId?: string;
    action: string;
    description: string;
    dataTypes?: string[];
    targetSystems?: string[];
    affectedData?: string[];
    rationale?: string;
  }) {
    return api.post<unknown>(`${API_BASE}/council/evaluate`, proposal);
  },
  async getCouncilHistory(limit = 100) {
    return api.get<unknown>(`${API_BASE}/council/history`, stryMutAct_9fa48("14112") ? {} : (stryCov_9fa48("14112"), {
      limit
    }));
  },
  async getCouncilStatistics() {
    return api.get<unknown>(`${API_BASE}/council/statistics`);
  }
});
export default complianceApi;