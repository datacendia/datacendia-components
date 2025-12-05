/**
 * Compliance API Client
 * Five Rings of Sovereignty - Frontend API
 */

const API_BASE = '/api/v1/compliance';

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
export const complianceApi = {
  // Frameworks
  async getFrameworks(filters?: { domain?: ComplianceDomain; pillar?: PillarId; industry?: string }) {
    const params = new URLSearchParams();
    if (filters?.domain) {params.set('domain', filters.domain);}
    if (filters?.pillar) {params.set('pillar', filters.pillar);}
    if (filters?.industry) {params.set('industry', filters.industry);}
    
    const res = await fetch(`${API_BASE}/frameworks?${params}`);
    return res.json();
  },

  async getFramework(id: string) {
    const res = await fetch(`${API_BASE}/frameworks/${id}`);
    return res.json();
  },

  // Five Rings
  async getFiveRings() {
    const res = await fetch(`${API_BASE}/five-rings`);
    return res.json();
  },

  // Pillar Mapping
  async getPillarMapping(pillarId: PillarId) {
    const res = await fetch(`${API_BASE}/pillars/${pillarId}/mapping`);
    return res.json();
  },

  // Assessments
  async runPillarAssessment(organizationId: string, pillarId: PillarId, assessor: string) {
    const res = await fetch(`${API_BASE}/assessments/pillar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, pillarId, assessor }),
    });
    return res.json();
  },

  async runFrameworkAssessment(organizationId: string, frameworkId: string, pillarId: PillarId, assessor: string) {
    const res = await fetch(`${API_BASE}/assessments/framework`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ organizationId, frameworkId, pillarId, assessor }),
    });
    return res.json();
  },

  async getAssessment(id: string) {
    const res = await fetch(`${API_BASE}/assessments/${id}`);
    return res.json();
  },

  async getAssessments(organizationId: string, filters?: { domain?: ComplianceDomain; pillarId?: PillarId }) {
    const params = new URLSearchParams({ organizationId });
    if (filters?.domain) {params.set('domain', filters.domain);}
    if (filters?.pillarId) {params.set('pillarId', filters.pillarId);}
    
    const res = await fetch(`${API_BASE}/assessments?${params}`);
    return res.json();
  },

  // Bundles
  async generateBundle(options: {
    organizationId: string;
    generatedBy: string;
    frameworks?: string[];
    pillars?: PillarId[];
    domains?: ComplianceDomain[];
  }) {
    const res = await fetch(`${API_BASE}/bundles/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(options),
    });
    return res.json();
  },

  async getBundle(id: string) {
    const res = await fetch(`${API_BASE}/bundles/${id}`);
    return res.json();
  },

  async downloadBundle(id: string) {
    const res = await fetch(`${API_BASE}/bundles/${id}/download`);
    return res.json();
  },

  async getBundleFile(bundleId: string, filePath: string) {
    const res = await fetch(`${API_BASE}/bundles/${bundleId}/files/${filePath}`);
    return res.json();
  },

  // Summary
  async getSummary(organizationId: string) {
    const res = await fetch(`${API_BASE}/summary?organizationId=${organizationId}`);
    return res.json();
  },

  // ========================================
  // ACTIVE ENFORCEMENT
  // ========================================

  async enforce(agentId: string, action: string, description: string, dataTypes?: string[]) {
    const res = await fetch(`${API_BASE}/enforce`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ agentId, action, description, dataTypes }),
    });
    return res.json();
  },

  async checkCompliance(context: {
    action: string;
    description: string;
    dataTypes?: string[];
    pillar?: PillarId;
    userId?: string;
    agentId?: string;
  }) {
    const res = await fetch(`${API_BASE}/check`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(context),
    });
    return res.json();
  },

  async getRules(filters?: { domain?: ComplianceDomain; framework?: string }) {
    const params = new URLSearchParams();
    if (filters?.domain) {params.set('domain', filters.domain);}
    if (filters?.framework) {params.set('framework', filters.framework);}
    const res = await fetch(`${API_BASE}/rules?${params}`);
    return res.json();
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
    const res = await fetch(`${API_BASE}/council/evaluate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(proposal),
    });
    return res.json();
  },

  async getCouncilHistory(limit = 100) {
    const res = await fetch(`${API_BASE}/council/history?limit=${limit}`);
    return res.json();
  },

  async getCouncilStatistics() {
    const res = await fetch(`${API_BASE}/council/statistics`);
    return res.json();
  },
};

export default complianceApi;
