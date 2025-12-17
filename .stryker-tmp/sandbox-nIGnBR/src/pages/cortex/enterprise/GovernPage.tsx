// @ts-nocheck
// =============================================================================
// CENDIA GOVERN™ - LEGAL-GRADE POLICY & AUDIT MAPPING
// Real-Time Regulatory Compliance Engine
// "Your AI Compliance Officer That Never Sleeps"
// 
// CAPABILITIES:
// - Real-time law & regulation parsing
// - Policy-to-procedure mapping
// - Missing control identification
// - Automated audit evidence generation
// - Board packet generation
// - Regulatory impact simulation
// - Multi-framework compliance (SOX, GDPR, HIPAA, SOC2, FedRAMP, etc.)
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
import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { governApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type ComplianceFramework = 'sox' | 'gdpr' | 'hipaa' | 'soc2' | 'fedramp' | 'pci-dss' | 'iso27001' | 'ccpa' | 'nist' | 'dora';
type ControlStatus = 'compliant' | 'partial' | 'non-compliant' | 'not-applicable' | 'under-review';
type RiskLevel = 'critical' | 'high' | 'medium' | 'low';
type EvidenceType = 'policy' | 'procedure' | 'screenshot' | 'log' | 'attestation' | 'report' | 'audit-trail';
interface Regulation {
  id: string;
  name: string;
  shortName: string;
  jurisdiction: string;
  effectiveDate: Date;
  lastUpdated: Date;
  version: string;
  totalRequirements: number;
  applicableRequirements: number;
  sections: RegulationSection[];
}
interface RegulationSection {
  id: string;
  code: string;
  title: string;
  description: string;
  requirements: Requirement[];
}
interface Requirement {
  id: string;
  code: string;
  text: string;
  controls: string[];
  riskLevel: RiskLevel;
  status: ControlStatus;
  lastAssessed: Date;
  evidenceCount: number;
}
interface Control {
  id: string;
  code: string;
  name: string;
  description: string;
  framework: ComplianceFramework;
  category: string;
  status: ControlStatus;
  owner: string;
  department: string;
  lastTested: Date;
  nextTest: Date;
  testFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annual';
  automationLevel: 'manual' | 'semi-automated' | 'fully-automated';
  riskRating: RiskLevel;
  mappedRequirements: string[];
  evidence: Evidence[];
  findings: Finding[];
}
interface Evidence {
  id: string;
  type: EvidenceType;
  name: string;
  description: string;
  collectedAt: Date;
  collectedBy: string;
  source: string;
  isAutomated: boolean;
  validUntil: Date;
  status: 'valid' | 'expired' | 'pending-review';
}
interface Finding {
  id: string;
  title: string;
  description: string;
  severity: RiskLevel;
  status: 'open' | 'in-progress' | 'remediated' | 'accepted';
  identifiedAt: Date;
  dueDate: Date;
  owner: string;
  remediationPlan: string;
}
interface PolicyDocument {
  id: string;
  name: string;
  version: string;
  status: 'draft' | 'review' | 'approved' | 'retired';
  owner: string;
  department: string;
  lastReviewed: Date;
  nextReview: Date;
  mappedControls: string[];
  mappedRegulations: string[];
  approvers: string[];
  effectiveDate: Date;
}
interface AuditProject {
  id: string;
  name: string;
  type: 'internal' | 'external' | 'regulatory';
  framework: ComplianceFramework;
  status: 'planning' | 'fieldwork' | 'reporting' | 'complete';
  startDate: Date;
  endDate: Date;
  auditor: string;
  controlsInScope: number;
  controlsTested: number;
  findingsCount: number;
  criticalFindings: number;
}
interface BoardPacket {
  id: string;
  name: string;
  period: string;
  generatedAt: Date;
  status: 'draft' | 'review' | 'approved' | 'published';
  sections: {
    name: string;
    status: 'complete' | 'pending' | 'needs-update';
  }[];
  approvers: {
    name: string;
    approved: boolean;
    approvedAt?: Date;
  }[];
}
interface ComplianceMetrics {
  overallScore: number;
  frameworkScores: Record<ComplianceFramework, number>;
  controlsTotal: number;
  controlsCompliant: number;
  controlsPartial: number;
  controlsNonCompliant: number;
  openFindings: number;
  criticalFindings: number;
  overdueRemediations: number;
  upcomingAudits: number;
  policiesExpiringSoon: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const FRAMEWORK_CONFIG: Record<ComplianceFramework, {
  icon: string;
  name: string;
  color: string;
}> = stryMutAct_9fa48("30238") ? {} : (stryCov_9fa48("30238"), {
  sox: stryMutAct_9fa48("30239") ? {} : (stryCov_9fa48("30239"), {
    icon: '📊',
    name: 'SOX',
    color: 'from-blue-600 to-indigo-600'
  }),
  gdpr: stryMutAct_9fa48("30243") ? {} : (stryCov_9fa48("30243"), {
    icon: '🇪🇺',
    name: 'GDPR',
    color: 'from-purple-600 to-violet-600'
  }),
  hipaa: stryMutAct_9fa48("30247") ? {} : (stryCov_9fa48("30247"), {
    icon: '🏥',
    name: 'HIPAA',
    color: 'from-red-600 to-rose-600'
  }),
  soc2: stryMutAct_9fa48("30251") ? {} : (stryCov_9fa48("30251"), {
    icon: '🔐',
    name: 'SOC 2',
    color: 'from-green-600 to-emerald-600'
  }),
  fedramp: stryMutAct_9fa48("30255") ? {} : (stryCov_9fa48("30255"), {
    icon: '🏛️',
    name: 'FedRAMP',
    color: 'from-slate-600 to-gray-600'
  }),
  'pci-dss': stryMutAct_9fa48("30259") ? {} : (stryCov_9fa48("30259"), {
    icon: '💳',
    name: 'PCI-DSS',
    color: 'from-amber-600 to-orange-600'
  }),
  iso27001: stryMutAct_9fa48("30263") ? {} : (stryCov_9fa48("30263"), {
    icon: '🌐',
    name: 'ISO 27001',
    color: 'from-cyan-600 to-blue-600'
  }),
  ccpa: stryMutAct_9fa48("30267") ? {} : (stryCov_9fa48("30267"), {
    icon: '🐻',
    name: 'CCPA',
    color: 'from-yellow-600 to-amber-600'
  }),
  nist: stryMutAct_9fa48("30271") ? {} : (stryCov_9fa48("30271"), {
    icon: '🇺🇸',
    name: 'NIST CSF',
    color: 'from-red-600 to-blue-600'
  }),
  dora: stryMutAct_9fa48("30275") ? {} : (stryCov_9fa48("30275"), {
    icon: '🏦',
    name: 'DORA',
    color: 'from-teal-600 to-cyan-600'
  })
});
const generateControls = stryMutAct_9fa48("30279") ? () => undefined : (stryCov_9fa48("30279"), (() => {
  const generateControls = (): Control[] => stryMutAct_9fa48("30280") ? [] : (stryCov_9fa48("30280"), [stryMutAct_9fa48("30281") ? {} : (stryCov_9fa48("30281"), {
    id: 'ctrl-001',
    code: 'AC-1',
    name: 'Access Control Policy',
    description: 'Documented access control policy with defined roles and responsibilities',
    framework: 'soc2',
    category: 'Access Control',
    status: 'compliant',
    owner: 'CISO',
    department: 'Security',
    lastTested: new Date(stryMutAct_9fa48("30291") ? Date.now() + 15 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30291"), Date.now() - (stryMutAct_9fa48("30292") ? 15 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30292"), (stryMutAct_9fa48("30293") ? 15 * 24 * 60 / 60 : (stryCov_9fa48("30293"), (stryMutAct_9fa48("30294") ? 15 * 24 / 60 : (stryCov_9fa48("30294"), (stryMutAct_9fa48("30295") ? 15 / 24 : (stryCov_9fa48("30295"), 15 * 24)) * 60)) * 60)) * 1000)))),
    nextTest: new Date(stryMutAct_9fa48("30296") ? Date.now() - 75 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30296"), Date.now() + (stryMutAct_9fa48("30297") ? 75 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30297"), (stryMutAct_9fa48("30298") ? 75 * 24 * 60 / 60 : (stryCov_9fa48("30298"), (stryMutAct_9fa48("30299") ? 75 * 24 / 60 : (stryCov_9fa48("30299"), (stryMutAct_9fa48("30300") ? 75 / 24 : (stryCov_9fa48("30300"), 75 * 24)) * 60)) * 60)) * 1000)))),
    testFrequency: 'quarterly',
    automationLevel: 'semi-automated',
    riskRating: 'high',
    mappedRequirements: stryMutAct_9fa48("30304") ? [] : (stryCov_9fa48("30304"), ['SOX 404', 'SOC2 CC6.1', 'ISO 27001 A.9']),
    evidence: stryMutAct_9fa48("30308") ? [] : (stryCov_9fa48("30308"), [stryMutAct_9fa48("30309") ? {} : (stryCov_9fa48("30309"), {
      id: 'ev-001',
      type: 'policy',
      name: 'Access Control Policy v3.2',
      description: 'Current policy document',
      collectedAt: new Date(),
      collectedBy: 'System',
      source: 'SharePoint',
      isAutomated: stryMutAct_9fa48("30316") ? false : (stryCov_9fa48("30316"), true),
      validUntil: new Date(stryMutAct_9fa48("30317") ? Date.now() - 365 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30317"), Date.now() + (stryMutAct_9fa48("30318") ? 365 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30318"), (stryMutAct_9fa48("30319") ? 365 * 24 * 60 / 60 : (stryCov_9fa48("30319"), (stryMutAct_9fa48("30320") ? 365 * 24 / 60 : (stryCov_9fa48("30320"), (stryMutAct_9fa48("30321") ? 365 / 24 : (stryCov_9fa48("30321"), 365 * 24)) * 60)) * 60)) * 1000)))),
      status: 'valid'
    }), stryMutAct_9fa48("30323") ? {} : (stryCov_9fa48("30323"), {
      id: 'ev-002',
      type: 'screenshot',
      name: 'RBAC Configuration',
      description: 'Okta RBAC settings',
      collectedAt: new Date(),
      collectedBy: 'Security Team',
      source: 'Okta',
      isAutomated: stryMutAct_9fa48("30330") ? false : (stryCov_9fa48("30330"), true),
      validUntil: new Date(stryMutAct_9fa48("30331") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30331"), Date.now() + (stryMutAct_9fa48("30332") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30332"), (stryMutAct_9fa48("30333") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30333"), (stryMutAct_9fa48("30334") ? 30 * 24 / 60 : (stryCov_9fa48("30334"), (stryMutAct_9fa48("30335") ? 30 / 24 : (stryCov_9fa48("30335"), 30 * 24)) * 60)) * 60)) * 1000)))),
      status: 'valid'
    })]),
    findings: stryMutAct_9fa48("30337") ? ["Stryker was here"] : (stryCov_9fa48("30337"), [])
  }), stryMutAct_9fa48("30338") ? {} : (stryCov_9fa48("30338"), {
    id: 'ctrl-002',
    code: 'AC-2',
    name: 'User Access Provisioning',
    description: 'Automated user provisioning and deprovisioning processes',
    framework: 'soc2',
    category: 'Access Control',
    status: 'compliant',
    owner: 'IT Manager',
    department: 'IT',
    lastTested: new Date(stryMutAct_9fa48("30348") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30348"), Date.now() - (stryMutAct_9fa48("30349") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30349"), (stryMutAct_9fa48("30350") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("30350"), (stryMutAct_9fa48("30351") ? 7 * 24 / 60 : (stryCov_9fa48("30351"), (stryMutAct_9fa48("30352") ? 7 / 24 : (stryCov_9fa48("30352"), 7 * 24)) * 60)) * 60)) * 1000)))),
    nextTest: new Date(stryMutAct_9fa48("30353") ? Date.now() - 23 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30353"), Date.now() + (stryMutAct_9fa48("30354") ? 23 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30354"), (stryMutAct_9fa48("30355") ? 23 * 24 * 60 / 60 : (stryCov_9fa48("30355"), (stryMutAct_9fa48("30356") ? 23 * 24 / 60 : (stryCov_9fa48("30356"), (stryMutAct_9fa48("30357") ? 23 / 24 : (stryCov_9fa48("30357"), 23 * 24)) * 60)) * 60)) * 1000)))),
    testFrequency: 'monthly',
    automationLevel: 'fully-automated',
    riskRating: 'high',
    mappedRequirements: stryMutAct_9fa48("30361") ? [] : (stryCov_9fa48("30361"), ['SOX 404', 'SOC2 CC6.2', 'GDPR Art.25']),
    evidence: stryMutAct_9fa48("30365") ? [] : (stryCov_9fa48("30365"), [stryMutAct_9fa48("30366") ? {} : (stryCov_9fa48("30366"), {
      id: 'ev-003',
      type: 'audit-trail',
      name: 'Provisioning Logs',
      description: 'Last 30 days of provisioning activity',
      collectedAt: new Date(),
      collectedBy: 'System',
      source: 'Okta',
      isAutomated: stryMutAct_9fa48("30373") ? false : (stryCov_9fa48("30373"), true),
      validUntil: new Date(stryMutAct_9fa48("30374") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30374"), Date.now() + (stryMutAct_9fa48("30375") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30375"), (stryMutAct_9fa48("30376") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30376"), (stryMutAct_9fa48("30377") ? 30 * 24 / 60 : (stryCov_9fa48("30377"), (stryMutAct_9fa48("30378") ? 30 / 24 : (stryCov_9fa48("30378"), 30 * 24)) * 60)) * 60)) * 1000)))),
      status: 'valid'
    })]),
    findings: stryMutAct_9fa48("30380") ? ["Stryker was here"] : (stryCov_9fa48("30380"), [])
  }), stryMutAct_9fa48("30381") ? {} : (stryCov_9fa48("30381"), {
    id: 'ctrl-003',
    code: 'DP-1',
    name: 'Data Classification',
    description: 'Data classification and handling procedures',
    framework: 'gdpr',
    category: 'Data Protection',
    status: 'partial',
    owner: 'Data Protection Officer',
    department: 'Legal',
    lastTested: new Date(stryMutAct_9fa48("30391") ? Date.now() + 45 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30391"), Date.now() - (stryMutAct_9fa48("30392") ? 45 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30392"), (stryMutAct_9fa48("30393") ? 45 * 24 * 60 / 60 : (stryCov_9fa48("30393"), (stryMutAct_9fa48("30394") ? 45 * 24 / 60 : (stryCov_9fa48("30394"), (stryMutAct_9fa48("30395") ? 45 / 24 : (stryCov_9fa48("30395"), 45 * 24)) * 60)) * 60)) * 1000)))),
    nextTest: new Date(stryMutAct_9fa48("30396") ? Date.now() - 45 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30396"), Date.now() + (stryMutAct_9fa48("30397") ? 45 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30397"), (stryMutAct_9fa48("30398") ? 45 * 24 * 60 / 60 : (stryCov_9fa48("30398"), (stryMutAct_9fa48("30399") ? 45 * 24 / 60 : (stryCov_9fa48("30399"), (stryMutAct_9fa48("30400") ? 45 / 24 : (stryCov_9fa48("30400"), 45 * 24)) * 60)) * 60)) * 1000)))),
    testFrequency: 'quarterly',
    automationLevel: 'manual',
    riskRating: 'medium',
    mappedRequirements: stryMutAct_9fa48("30404") ? [] : (stryCov_9fa48("30404"), ['GDPR Art.5', 'CCPA 1798.100']),
    evidence: stryMutAct_9fa48("30407") ? [] : (stryCov_9fa48("30407"), [stryMutAct_9fa48("30408") ? {} : (stryCov_9fa48("30408"), {
      id: 'ev-004',
      type: 'policy',
      name: 'Data Classification Policy',
      description: 'Policy document needs update',
      collectedAt: new Date(stryMutAct_9fa48("30413") ? Date.now() + 180 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30413"), Date.now() - (stryMutAct_9fa48("30414") ? 180 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30414"), (stryMutAct_9fa48("30415") ? 180 * 24 * 60 / 60 : (stryCov_9fa48("30415"), (stryMutAct_9fa48("30416") ? 180 * 24 / 60 : (stryCov_9fa48("30416"), (stryMutAct_9fa48("30417") ? 180 / 24 : (stryCov_9fa48("30417"), 180 * 24)) * 60)) * 60)) * 1000)))),
      collectedBy: 'DPO',
      source: 'SharePoint',
      isAutomated: stryMutAct_9fa48("30420") ? true : (stryCov_9fa48("30420"), false),
      validUntil: new Date(stryMutAct_9fa48("30421") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30421"), Date.now() - (stryMutAct_9fa48("30422") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30422"), (stryMutAct_9fa48("30423") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30423"), (stryMutAct_9fa48("30424") ? 30 * 24 / 60 : (stryCov_9fa48("30424"), (stryMutAct_9fa48("30425") ? 30 / 24 : (stryCov_9fa48("30425"), 30 * 24)) * 60)) * 60)) * 1000)))),
      status: 'expired'
    })]),
    findings: stryMutAct_9fa48("30427") ? [] : (stryCov_9fa48("30427"), [stryMutAct_9fa48("30428") ? {} : (stryCov_9fa48("30428"), {
      id: 'find-001',
      title: 'Outdated Data Classification Policy',
      description: 'Policy has not been reviewed in 6 months',
      severity: 'medium',
      status: 'in-progress',
      identifiedAt: new Date(stryMutAct_9fa48("30434") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30434"), Date.now() - (stryMutAct_9fa48("30435") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30435"), (stryMutAct_9fa48("30436") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30436"), (stryMutAct_9fa48("30437") ? 30 * 24 / 60 : (stryCov_9fa48("30437"), (stryMutAct_9fa48("30438") ? 30 / 24 : (stryCov_9fa48("30438"), 30 * 24)) * 60)) * 60)) * 1000)))),
      dueDate: new Date(stryMutAct_9fa48("30439") ? Date.now() - 15 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30439"), Date.now() + (stryMutAct_9fa48("30440") ? 15 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30440"), (stryMutAct_9fa48("30441") ? 15 * 24 * 60 / 60 : (stryCov_9fa48("30441"), (stryMutAct_9fa48("30442") ? 15 * 24 / 60 : (stryCov_9fa48("30442"), (stryMutAct_9fa48("30443") ? 15 / 24 : (stryCov_9fa48("30443"), 15 * 24)) * 60)) * 60)) * 1000)))),
      owner: 'DPO',
      remediationPlan: 'Update policy to include new data categories and AI processing requirements'
    })])
  }), stryMutAct_9fa48("30446") ? {} : (stryCov_9fa48("30446"), {
    id: 'ctrl-004',
    code: 'FIN-1',
    name: 'Financial Close Controls',
    description: 'Month-end and quarter-end financial close procedures',
    framework: 'sox',
    category: 'Financial Reporting',
    status: 'compliant',
    owner: 'Controller',
    department: 'Finance',
    lastTested: new Date(stryMutAct_9fa48("30456") ? Date.now() + 5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30456"), Date.now() - (stryMutAct_9fa48("30457") ? 5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30457"), (stryMutAct_9fa48("30458") ? 5 * 24 * 60 / 60 : (stryCov_9fa48("30458"), (stryMutAct_9fa48("30459") ? 5 * 24 / 60 : (stryCov_9fa48("30459"), (stryMutAct_9fa48("30460") ? 5 / 24 : (stryCov_9fa48("30460"), 5 * 24)) * 60)) * 60)) * 1000)))),
    nextTest: new Date(stryMutAct_9fa48("30461") ? Date.now() - 25 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30461"), Date.now() + (stryMutAct_9fa48("30462") ? 25 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30462"), (stryMutAct_9fa48("30463") ? 25 * 24 * 60 / 60 : (stryCov_9fa48("30463"), (stryMutAct_9fa48("30464") ? 25 * 24 / 60 : (stryCov_9fa48("30464"), (stryMutAct_9fa48("30465") ? 25 / 24 : (stryCov_9fa48("30465"), 25 * 24)) * 60)) * 60)) * 1000)))),
    testFrequency: 'monthly',
    automationLevel: 'semi-automated',
    riskRating: 'critical',
    mappedRequirements: stryMutAct_9fa48("30469") ? [] : (stryCov_9fa48("30469"), ['SOX 302', 'SOX 404']),
    evidence: stryMutAct_9fa48("30472") ? [] : (stryCov_9fa48("30472"), [stryMutAct_9fa48("30473") ? {} : (stryCov_9fa48("30473"), {
      id: 'ev-005',
      type: 'procedure',
      name: 'Close Checklist',
      description: 'Q3 close checklist - all items complete',
      collectedAt: new Date(),
      collectedBy: 'Controller',
      source: 'NetSuite',
      isAutomated: stryMutAct_9fa48("30480") ? true : (stryCov_9fa48("30480"), false),
      validUntil: new Date(stryMutAct_9fa48("30481") ? Date.now() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30481"), Date.now() + (stryMutAct_9fa48("30482") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30482"), (stryMutAct_9fa48("30483") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("30483"), (stryMutAct_9fa48("30484") ? 90 * 24 / 60 : (stryCov_9fa48("30484"), (stryMutAct_9fa48("30485") ? 90 / 24 : (stryCov_9fa48("30485"), 90 * 24)) * 60)) * 60)) * 1000)))),
      status: 'valid'
    }), stryMutAct_9fa48("30487") ? {} : (stryCov_9fa48("30487"), {
      id: 'ev-006',
      type: 'attestation',
      name: 'Management Certification',
      description: 'CFO certification of Q3 financials',
      collectedAt: new Date(),
      collectedBy: 'CFO',
      source: 'DocuSign',
      isAutomated: stryMutAct_9fa48("30494") ? true : (stryCov_9fa48("30494"), false),
      validUntil: new Date(stryMutAct_9fa48("30495") ? Date.now() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30495"), Date.now() + (stryMutAct_9fa48("30496") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30496"), (stryMutAct_9fa48("30497") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("30497"), (stryMutAct_9fa48("30498") ? 90 * 24 / 60 : (stryCov_9fa48("30498"), (stryMutAct_9fa48("30499") ? 90 / 24 : (stryCov_9fa48("30499"), 90 * 24)) * 60)) * 60)) * 1000)))),
      status: 'valid'
    })]),
    findings: stryMutAct_9fa48("30501") ? ["Stryker was here"] : (stryCov_9fa48("30501"), [])
  }), stryMutAct_9fa48("30502") ? {} : (stryCov_9fa48("30502"), {
    id: 'ctrl-005',
    code: 'SEC-1',
    name: 'Encryption at Rest',
    description: 'All sensitive data encrypted at rest using AES-256',
    framework: 'pci-dss',
    category: 'Security',
    status: 'non-compliant',
    owner: 'Security Engineer',
    department: 'Security',
    lastTested: new Date(stryMutAct_9fa48("30512") ? Date.now() + 10 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30512"), Date.now() - (stryMutAct_9fa48("30513") ? 10 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30513"), (stryMutAct_9fa48("30514") ? 10 * 24 * 60 / 60 : (stryCov_9fa48("30514"), (stryMutAct_9fa48("30515") ? 10 * 24 / 60 : (stryCov_9fa48("30515"), (stryMutAct_9fa48("30516") ? 10 / 24 : (stryCov_9fa48("30516"), 10 * 24)) * 60)) * 60)) * 1000)))),
    nextTest: new Date(stryMutAct_9fa48("30517") ? Date.now() - 20 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30517"), Date.now() + (stryMutAct_9fa48("30518") ? 20 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30518"), (stryMutAct_9fa48("30519") ? 20 * 24 * 60 / 60 : (stryCov_9fa48("30519"), (stryMutAct_9fa48("30520") ? 20 * 24 / 60 : (stryCov_9fa48("30520"), (stryMutAct_9fa48("30521") ? 20 / 24 : (stryCov_9fa48("30521"), 20 * 24)) * 60)) * 60)) * 1000)))),
    testFrequency: 'monthly',
    automationLevel: 'fully-automated',
    riskRating: 'critical',
    mappedRequirements: stryMutAct_9fa48("30525") ? [] : (stryCov_9fa48("30525"), ['PCI-DSS 3.4', 'HIPAA 164.312']),
    evidence: stryMutAct_9fa48("30528") ? [] : (stryCov_9fa48("30528"), [stryMutAct_9fa48("30529") ? {} : (stryCov_9fa48("30529"), {
      id: 'ev-007',
      type: 'screenshot',
      name: 'Encryption Configuration',
      description: 'AWS KMS settings',
      collectedAt: new Date(),
      collectedBy: 'System',
      source: 'AWS',
      isAutomated: stryMutAct_9fa48("30536") ? false : (stryCov_9fa48("30536"), true),
      validUntil: new Date(stryMutAct_9fa48("30537") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30537"), Date.now() + (stryMutAct_9fa48("30538") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30538"), (stryMutAct_9fa48("30539") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30539"), (stryMutAct_9fa48("30540") ? 30 * 24 / 60 : (stryCov_9fa48("30540"), (stryMutAct_9fa48("30541") ? 30 / 24 : (stryCov_9fa48("30541"), 30 * 24)) * 60)) * 60)) * 1000)))),
      status: 'valid'
    })]),
    findings: stryMutAct_9fa48("30543") ? [] : (stryCov_9fa48("30543"), [stryMutAct_9fa48("30544") ? {} : (stryCov_9fa48("30544"), {
      id: 'find-002',
      title: 'Legacy Database Unencrypted',
      description: 'Legacy Oracle database contains PII without encryption',
      severity: 'critical',
      status: 'open',
      identifiedAt: new Date(stryMutAct_9fa48("30550") ? Date.now() + 5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30550"), Date.now() - (stryMutAct_9fa48("30551") ? 5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30551"), (stryMutAct_9fa48("30552") ? 5 * 24 * 60 / 60 : (stryCov_9fa48("30552"), (stryMutAct_9fa48("30553") ? 5 * 24 / 60 : (stryCov_9fa48("30553"), (stryMutAct_9fa48("30554") ? 5 / 24 : (stryCov_9fa48("30554"), 5 * 24)) * 60)) * 60)) * 1000)))),
      dueDate: new Date(stryMutAct_9fa48("30555") ? Date.now() - 10 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30555"), Date.now() + (stryMutAct_9fa48("30556") ? 10 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30556"), (stryMutAct_9fa48("30557") ? 10 * 24 * 60 / 60 : (stryCov_9fa48("30557"), (stryMutAct_9fa48("30558") ? 10 * 24 / 60 : (stryCov_9fa48("30558"), (stryMutAct_9fa48("30559") ? 10 / 24 : (stryCov_9fa48("30559"), 10 * 24)) * 60)) * 60)) * 1000)))),
      owner: 'Database Admin',
      remediationPlan: 'Implement TDE on legacy Oracle instance or migrate to AWS RDS'
    })])
  })]);
  return generateControls;
})());
const generateAuditProjects = stryMutAct_9fa48("30562") ? () => undefined : (stryCov_9fa48("30562"), (() => {
  const generateAuditProjects = (): AuditProject[] => stryMutAct_9fa48("30563") ? [] : (stryCov_9fa48("30563"), [stryMutAct_9fa48("30564") ? {} : (stryCov_9fa48("30564"), {
    id: 'audit-001',
    name: 'SOC 2 Type II Annual Audit',
    type: 'external',
    framework: 'soc2',
    status: 'fieldwork',
    startDate: new Date(stryMutAct_9fa48("30570") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30570"), Date.now() - (stryMutAct_9fa48("30571") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30571"), (stryMutAct_9fa48("30572") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30572"), (stryMutAct_9fa48("30573") ? 30 * 24 / 60 : (stryCov_9fa48("30573"), (stryMutAct_9fa48("30574") ? 30 / 24 : (stryCov_9fa48("30574"), 30 * 24)) * 60)) * 60)) * 1000)))),
    endDate: new Date(stryMutAct_9fa48("30575") ? Date.now() - 60 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30575"), Date.now() + (stryMutAct_9fa48("30576") ? 60 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30576"), (stryMutAct_9fa48("30577") ? 60 * 24 * 60 / 60 : (stryCov_9fa48("30577"), (stryMutAct_9fa48("30578") ? 60 * 24 / 60 : (stryCov_9fa48("30578"), (stryMutAct_9fa48("30579") ? 60 / 24 : (stryCov_9fa48("30579"), 60 * 24)) * 60)) * 60)) * 1000)))),
    auditor: 'Deloitte',
    controlsInScope: 87,
    controlsTested: 45,
    findingsCount: 3,
    criticalFindings: 0
  }), stryMutAct_9fa48("30581") ? {} : (stryCov_9fa48("30581"), {
    id: 'audit-002',
    name: 'GDPR Data Protection Impact Assessment',
    type: 'internal',
    framework: 'gdpr',
    status: 'reporting',
    startDate: new Date(stryMutAct_9fa48("30587") ? Date.now() + 60 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30587"), Date.now() - (stryMutAct_9fa48("30588") ? 60 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30588"), (stryMutAct_9fa48("30589") ? 60 * 24 * 60 / 60 : (stryCov_9fa48("30589"), (stryMutAct_9fa48("30590") ? 60 * 24 / 60 : (stryCov_9fa48("30590"), (stryMutAct_9fa48("30591") ? 60 / 24 : (stryCov_9fa48("30591"), 60 * 24)) * 60)) * 60)) * 1000)))),
    endDate: new Date(stryMutAct_9fa48("30592") ? Date.now() - 15 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30592"), Date.now() + (stryMutAct_9fa48("30593") ? 15 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30593"), (stryMutAct_9fa48("30594") ? 15 * 24 * 60 / 60 : (stryCov_9fa48("30594"), (stryMutAct_9fa48("30595") ? 15 * 24 / 60 : (stryCov_9fa48("30595"), (stryMutAct_9fa48("30596") ? 15 / 24 : (stryCov_9fa48("30596"), 15 * 24)) * 60)) * 60)) * 1000)))),
    auditor: 'Internal Audit Team',
    controlsInScope: 34,
    controlsTested: 34,
    findingsCount: 5,
    criticalFindings: 1
  }), stryMutAct_9fa48("30598") ? {} : (stryCov_9fa48("30598"), {
    id: 'audit-003',
    name: 'Q4 SOX 404 Testing',
    type: 'internal',
    framework: 'sox',
    status: 'planning',
    startDate: new Date(stryMutAct_9fa48("30604") ? Date.now() - 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30604"), Date.now() + (stryMutAct_9fa48("30605") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30605"), (stryMutAct_9fa48("30606") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("30606"), (stryMutAct_9fa48("30607") ? 30 * 24 / 60 : (stryCov_9fa48("30607"), (stryMutAct_9fa48("30608") ? 30 / 24 : (stryCov_9fa48("30608"), 30 * 24)) * 60)) * 60)) * 1000)))),
    endDate: new Date(stryMutAct_9fa48("30609") ? Date.now() - 90 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30609"), Date.now() + (stryMutAct_9fa48("30610") ? 90 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30610"), (stryMutAct_9fa48("30611") ? 90 * 24 * 60 / 60 : (stryCov_9fa48("30611"), (stryMutAct_9fa48("30612") ? 90 * 24 / 60 : (stryCov_9fa48("30612"), (stryMutAct_9fa48("30613") ? 90 / 24 : (stryCov_9fa48("30613"), 90 * 24)) * 60)) * 60)) * 1000)))),
    auditor: 'PwC',
    controlsInScope: 156,
    controlsTested: 0,
    findingsCount: 0,
    criticalFindings: 0
  })]);
  return generateAuditProjects;
})());
const generateBoardPackets = stryMutAct_9fa48("30615") ? () => undefined : (stryCov_9fa48("30615"), (() => {
  const generateBoardPackets = (): BoardPacket[] => stryMutAct_9fa48("30616") ? [] : (stryCov_9fa48("30616"), [stryMutAct_9fa48("30617") ? {} : (stryCov_9fa48("30617"), {
    id: 'bp-001',
    name: 'Q3 2024 Compliance Report',
    period: 'Q3 2024',
    generatedAt: new Date(stryMutAct_9fa48("30621") ? Date.now() + 5 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30621"), Date.now() - (stryMutAct_9fa48("30622") ? 5 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30622"), (stryMutAct_9fa48("30623") ? 5 * 24 * 60 / 60 : (stryCov_9fa48("30623"), (stryMutAct_9fa48("30624") ? 5 * 24 / 60 : (stryCov_9fa48("30624"), (stryMutAct_9fa48("30625") ? 5 / 24 : (stryCov_9fa48("30625"), 5 * 24)) * 60)) * 60)) * 1000)))),
    status: 'review',
    sections: stryMutAct_9fa48("30627") ? [] : (stryCov_9fa48("30627"), [stryMutAct_9fa48("30628") ? {} : (stryCov_9fa48("30628"), {
      name: 'Executive Summary',
      status: 'complete'
    }), stryMutAct_9fa48("30631") ? {} : (stryCov_9fa48("30631"), {
      name: 'Control Environment',
      status: 'complete'
    }), stryMutAct_9fa48("30634") ? {} : (stryCov_9fa48("30634"), {
      name: 'Risk Assessment',
      status: 'complete'
    }), stryMutAct_9fa48("30637") ? {} : (stryCov_9fa48("30637"), {
      name: 'Audit Findings',
      status: 'complete'
    }), stryMutAct_9fa48("30640") ? {} : (stryCov_9fa48("30640"), {
      name: 'Remediation Status',
      status: 'needs-update'
    }), stryMutAct_9fa48("30643") ? {} : (stryCov_9fa48("30643"), {
      name: 'Regulatory Changes',
      status: 'pending'
    })]),
    approvers: stryMutAct_9fa48("30646") ? [] : (stryCov_9fa48("30646"), [stryMutAct_9fa48("30647") ? {} : (stryCov_9fa48("30647"), {
      name: 'CFO',
      approved: stryMutAct_9fa48("30649") ? false : (stryCov_9fa48("30649"), true),
      approvedAt: new Date(stryMutAct_9fa48("30650") ? Date.now() + 2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30650"), Date.now() - (stryMutAct_9fa48("30651") ? 2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30651"), (stryMutAct_9fa48("30652") ? 2 * 24 * 60 / 60 : (stryCov_9fa48("30652"), (stryMutAct_9fa48("30653") ? 2 * 24 / 60 : (stryCov_9fa48("30653"), (stryMutAct_9fa48("30654") ? 2 / 24 : (stryCov_9fa48("30654"), 2 * 24)) * 60)) * 60)) * 1000))))
    }), stryMutAct_9fa48("30655") ? {} : (stryCov_9fa48("30655"), {
      name: 'General Counsel',
      approved: stryMutAct_9fa48("30657") ? true : (stryCov_9fa48("30657"), false)
    }), stryMutAct_9fa48("30658") ? {} : (stryCov_9fa48("30658"), {
      name: 'CISO',
      approved: stryMutAct_9fa48("30660") ? false : (stryCov_9fa48("30660"), true),
      approvedAt: new Date(stryMutAct_9fa48("30661") ? Date.now() + 3 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("30661"), Date.now() - (stryMutAct_9fa48("30662") ? 3 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("30662"), (stryMutAct_9fa48("30663") ? 3 * 24 * 60 / 60 : (stryCov_9fa48("30663"), (stryMutAct_9fa48("30664") ? 3 * 24 / 60 : (stryCov_9fa48("30664"), (stryMutAct_9fa48("30665") ? 3 / 24 : (stryCov_9fa48("30665"), 3 * 24)) * 60)) * 60)) * 1000))))
    })])
  })]);
  return generateBoardPackets;
})());
const calculateMetrics = (controls: Control[]): ComplianceMetrics => {
  const compliant = stryMutAct_9fa48("30667") ? controls.length : (stryCov_9fa48("30667"), controls.filter(stryMutAct_9fa48("30668") ? () => undefined : (stryCov_9fa48("30668"), c => stryMutAct_9fa48("30671") ? c.status !== 'compliant' : stryMutAct_9fa48("30670") ? false : stryMutAct_9fa48("30669") ? true : (stryCov_9fa48("30669", "30670", "30671"), c.status === 'compliant'))).length);
  const partial = stryMutAct_9fa48("30673") ? controls.length : (stryCov_9fa48("30673"), controls.filter(stryMutAct_9fa48("30674") ? () => undefined : (stryCov_9fa48("30674"), c => stryMutAct_9fa48("30677") ? c.status !== 'partial' : stryMutAct_9fa48("30676") ? false : stryMutAct_9fa48("30675") ? true : (stryCov_9fa48("30675", "30676", "30677"), c.status === 'partial'))).length);
  const nonCompliant = stryMutAct_9fa48("30679") ? controls.length : (stryCov_9fa48("30679"), controls.filter(stryMutAct_9fa48("30680") ? () => undefined : (stryCov_9fa48("30680"), c => stryMutAct_9fa48("30683") ? c.status !== 'non-compliant' : stryMutAct_9fa48("30682") ? false : stryMutAct_9fa48("30681") ? true : (stryCov_9fa48("30681", "30682", "30683"), c.status === 'non-compliant'))).length);
  const allFindings = controls.flatMap(stryMutAct_9fa48("30685") ? () => undefined : (stryCov_9fa48("30685"), c => c.findings));
  const frameworkScores: Record<ComplianceFramework, number> = stryMutAct_9fa48("30686") ? {} : (stryCov_9fa48("30686"), {
    sox: 94,
    gdpr: 78,
    hipaa: 85,
    soc2: 91,
    fedramp: 72,
    'pci-dss': 68,
    iso27001: 88,
    ccpa: 82,
    nist: 79,
    dora: 65
  });
  return stryMutAct_9fa48("30687") ? {} : (stryCov_9fa48("30687"), {
    overallScore: Math.round(stryMutAct_9fa48("30688") ? compliant / controls.length / 100 : (stryCov_9fa48("30688"), (stryMutAct_9fa48("30689") ? compliant * controls.length : (stryCov_9fa48("30689"), compliant / controls.length)) * 100)),
    frameworkScores,
    controlsTotal: controls.length,
    controlsCompliant: compliant,
    controlsPartial: partial,
    controlsNonCompliant: nonCompliant,
    openFindings: stryMutAct_9fa48("30690") ? allFindings.length : (stryCov_9fa48("30690"), allFindings.filter(stryMutAct_9fa48("30691") ? () => undefined : (stryCov_9fa48("30691"), f => stryMutAct_9fa48("30694") ? f.status === 'open' && f.status === 'in-progress' : stryMutAct_9fa48("30693") ? false : stryMutAct_9fa48("30692") ? true : (stryCov_9fa48("30692", "30693", "30694"), (stryMutAct_9fa48("30696") ? f.status !== 'open' : stryMutAct_9fa48("30695") ? false : (stryCov_9fa48("30695", "30696"), f.status === 'open')) || (stryMutAct_9fa48("30699") ? f.status !== 'in-progress' : stryMutAct_9fa48("30698") ? false : (stryCov_9fa48("30698", "30699"), f.status === 'in-progress'))))).length),
    criticalFindings: stryMutAct_9fa48("30701") ? allFindings.length : (stryCov_9fa48("30701"), allFindings.filter(stryMutAct_9fa48("30702") ? () => undefined : (stryCov_9fa48("30702"), f => stryMutAct_9fa48("30705") ? f.severity === 'critical' || f.status !== 'remediated' : stryMutAct_9fa48("30704") ? false : stryMutAct_9fa48("30703") ? true : (stryCov_9fa48("30703", "30704", "30705"), (stryMutAct_9fa48("30707") ? f.severity !== 'critical' : stryMutAct_9fa48("30706") ? true : (stryCov_9fa48("30706", "30707"), f.severity === 'critical')) && (stryMutAct_9fa48("30710") ? f.status === 'remediated' : stryMutAct_9fa48("30709") ? true : (stryCov_9fa48("30709", "30710"), f.status !== 'remediated'))))).length),
    overdueRemediations: stryMutAct_9fa48("30712") ? allFindings.length : (stryCov_9fa48("30712"), allFindings.filter(stryMutAct_9fa48("30713") ? () => undefined : (stryCov_9fa48("30713"), f => stryMutAct_9fa48("30716") ? f.dueDate < new Date() || f.status !== 'remediated' : stryMutAct_9fa48("30715") ? false : stryMutAct_9fa48("30714") ? true : (stryCov_9fa48("30714", "30715", "30716"), (stryMutAct_9fa48("30719") ? f.dueDate >= new Date() : stryMutAct_9fa48("30718") ? f.dueDate <= new Date() : stryMutAct_9fa48("30717") ? true : (stryCov_9fa48("30717", "30718", "30719"), f.dueDate < new Date())) && (stryMutAct_9fa48("30721") ? f.status === 'remediated' : stryMutAct_9fa48("30720") ? true : (stryCov_9fa48("30720", "30721"), f.status !== 'remediated'))))).length),
    upcomingAudits: 2,
    policiesExpiringSoon: 3
  });
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const GovernPage: React.FC = () => {
  const navigate = useNavigate();
  const [controls, setControls] = useState<Control[]>(generateControls);
  const [auditProjects, setAuditProjects] = useState<AuditProject[]>(generateAuditProjects);
  const [boardPackets] = useState<BoardPacket[]>(generateBoardPackets);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'controls' | 'regulations' | 'audits' | 'board-packets'>('dashboard');
  const [selectedFramework, setSelectedFramework] = useState<ComplianceFramework | 'all'>('all');
  const [selectedControl, setSelectedControl] = useState<Control | null>(null);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("30726") ? false : (stryCov_9fa48("30726"), true));

  // Fetch real governance data from API
  useEffect(() => {
    const fetchGovernData = async () => {
      try {
        const [policiesRes, auditsRes] = await Promise.all(stryMutAct_9fa48("30730") ? [] : (stryCov_9fa48("30730"), [governApi.getPolicies(), governApi.getAudits()]));
        if (stryMutAct_9fa48("30733") ? policiesRes.success || policiesRes.data : stryMutAct_9fa48("30732") ? false : stryMutAct_9fa48("30731") ? true : (stryCov_9fa48("30731", "30732", "30733"), policiesRes.success && policiesRes.data)) {
          console.log('[Govern] Loaded', policiesRes.data.length, 'policies from database');
        }
        if (stryMutAct_9fa48("30739") ? auditsRes.success || auditsRes.data : stryMutAct_9fa48("30738") ? false : stryMutAct_9fa48("30737") ? true : (stryCov_9fa48("30737", "30738", "30739"), auditsRes.success && auditsRes.data)) {
          console.log('[Govern] Loaded', auditsRes.data.length, 'audits from database');
        }
      } catch (error) {
        console.log('[Govern] Using local generators (API unavailable)');
      } finally {
        setIsLoading(stryMutAct_9fa48("30746") ? true : (stryCov_9fa48("30746"), false));
      }
    };
    fetchGovernData();
  }, stryMutAct_9fa48("30747") ? ["Stryker was here"] : (stryCov_9fa48("30747"), []));
  const metrics = useMemo(stryMutAct_9fa48("30748") ? () => undefined : (stryCov_9fa48("30748"), () => calculateMetrics(controls)), stryMutAct_9fa48("30749") ? [] : (stryCov_9fa48("30749"), [controls]));
  const filteredControls = (stryMutAct_9fa48("30752") ? selectedFramework !== 'all' : stryMutAct_9fa48("30751") ? false : stryMutAct_9fa48("30750") ? true : (stryCov_9fa48("30750", "30751", "30752"), selectedFramework === 'all')) ? controls : stryMutAct_9fa48("30754") ? controls : (stryCov_9fa48("30754"), controls.filter(stryMutAct_9fa48("30755") ? () => undefined : (stryCov_9fa48("30755"), c => stryMutAct_9fa48("30758") ? c.framework !== selectedFramework : stryMutAct_9fa48("30757") ? false : stryMutAct_9fa48("30756") ? true : (stryCov_9fa48("30756", "30757", "30758"), c.framework === selectedFramework))));
  return <div className="min-h-screen bg-gradient-to-br from-emerald-950 via-green-950 to-slate-950 text-white">
      {/* Header */}
      <header className="border-b border-emerald-800/50 bg-black/20 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("30759") ? () => undefined : (stryCov_9fa48("30759"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">⚖️</span>
                  CendiaGovern™
                  <span className="text-xs bg-gradient-to-r from-emerald-500 to-green-500 px-2 py-0.5 rounded-full font-medium">
                    COMPLIANCE
                  </span>
                </h1>
                <p className="text-emerald-300 text-sm">Legal-Grade Policy & Audit Mapping • Real-Time Compliance</p>
              </div>
            </div>
            
            <div className="flex items-center gap-6">
              <div className="text-right">
                <div className="text-sm text-white/60">Compliance Score</div>
                <div className={`text-2xl font-bold ${(stryMutAct_9fa48("30765") ? metrics.overallScore < 90 : stryMutAct_9fa48("30764") ? metrics.overallScore > 90 : stryMutAct_9fa48("30763") ? false : stryMutAct_9fa48("30762") ? true : (stryCov_9fa48("30762", "30763", "30764", "30765"), metrics.overallScore >= 90)) ? 'text-green-400' : (stryMutAct_9fa48("30770") ? metrics.overallScore < 70 : stryMutAct_9fa48("30769") ? metrics.overallScore > 70 : stryMutAct_9fa48("30768") ? false : stryMutAct_9fa48("30767") ? true : (stryCov_9fa48("30767", "30768", "30769", "30770"), metrics.overallScore >= 70)) ? 'text-amber-400' : 'text-red-400'}`}>{metrics.overallScore}%</div>
              </div>
              {stryMutAct_9fa48("30775") ? metrics.criticalFindings > 0 || <div className="px-3 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{metrics.criticalFindings} Critical</div>
                  <div className="text-xs">Findings Open</div>
                </div> : stryMutAct_9fa48("30774") ? false : stryMutAct_9fa48("30773") ? true : (stryCov_9fa48("30773", "30774", "30775"), (stryMutAct_9fa48("30778") ? metrics.criticalFindings <= 0 : stryMutAct_9fa48("30777") ? metrics.criticalFindings >= 0 : stryMutAct_9fa48("30776") ? true : (stryCov_9fa48("30776", "30777", "30778"), metrics.criticalFindings > 0)) && <div className="px-3 py-2 bg-red-600 rounded-lg animate-pulse">
                  <div className="text-sm font-bold">{metrics.criticalFindings} Critical</div>
                  <div className="text-xs">Findings Open</div>
                </div>)}
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 border-b border-emerald-800/30">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-white">{metrics.controlsTotal}</div>
              <div className="text-xs text-emerald-300">Total Controls</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-green-400">{metrics.controlsCompliant}</div>
              <div className="text-xs text-emerald-300">Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.controlsPartial}</div>
              <div className="text-xs text-emerald-300">Partial</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.controlsNonCompliant}</div>
              <div className="text-xs text-emerald-300">Non-Compliant</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{metrics.openFindings}</div>
              <div className="text-xs text-emerald-300">Open Findings</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{metrics.overdueRemediations}</div>
              <div className="text-xs text-emerald-300">Overdue</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{metrics.upcomingAudits}</div>
              <div className="text-xs text-emerald-300">Upcoming Audits</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{metrics.policiesExpiringSoon}</div>
              <div className="text-xs text-emerald-300">Policies Expiring</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-emerald-800/30 bg-black/10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("30779") ? [] : (stryCov_9fa48("30779"), [stryMutAct_9fa48("30780") ? {} : (stryCov_9fa48("30780"), {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊'
          }), stryMutAct_9fa48("30784") ? {} : (stryCov_9fa48("30784"), {
            id: 'controls',
            label: 'Control Library',
            icon: '🎛️'
          }), stryMutAct_9fa48("30788") ? {} : (stryCov_9fa48("30788"), {
            id: 'regulations',
            label: 'Regulations',
            icon: '📜'
          }), stryMutAct_9fa48("30792") ? {} : (stryCov_9fa48("30792"), {
            id: 'audits',
            label: 'Audit Projects',
            icon: '🔍'
          }), stryMutAct_9fa48("30796") ? {} : (stryCov_9fa48("30796"), {
            id: 'board-packets',
            label: 'Board Packets',
            icon: '📋'
          })])).map(stryMutAct_9fa48("30800") ? () => undefined : (stryCov_9fa48("30800"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("30801") ? () => undefined : (stryCov_9fa48("30801"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("30805") ? activeTab !== tab.id : stryMutAct_9fa48("30804") ? false : stryMutAct_9fa48("30803") ? true : (stryCov_9fa48("30803", "30804", "30805"), activeTab === tab.id)) ? 'border-emerald-400 text-white bg-emerald-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("30810") ? activeTab === 'dashboard' || <div className="space-y-6">
            {/* Framework Compliance Scores */}
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-semibold mb-4">Framework Compliance Scores</h2>
              <div className="grid grid-cols-5 gap-4">
                {(Object.entries(FRAMEWORK_CONFIG) as [ComplianceFramework, typeof FRAMEWORK_CONFIG[ComplianceFramework]][]).map(([key, config]) => {
              const score = metrics.frameworkScores[key];
              return <div key={key} onClick={() => setSelectedFramework(key)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedFramework === key ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-emerald-800/50 hover:border-emerald-600'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="font-medium">{config.name}</span>
                      </div>
                      <div className={`text-3xl font-bold ${score >= 90 ? 'text-green-400' : score >= 70 ? 'text-amber-400' : 'text-red-400'}`}>{score}%</div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden mt-2">
                        <div className={`h-full ${score >= 90 ? 'bg-green-500' : score >= 70 ? 'bg-amber-500' : 'bg-red-500'}`} style={{
                    width: `${score}%`
                  }} />
                      </div>
                    </div>;
            })}
              </div>
            </div>

            {/* Critical Items */}
            <div className="grid grid-cols-2 gap-6">
              {/* Critical Findings */}
              <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Findings
                </h3>
                <div className="space-y-3">
                  {controls.flatMap(c => c.findings).filter(f => f.severity === 'critical').map(finding => <div key={finding.id} className="p-4 bg-red-900/20 rounded-xl border border-red-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{finding.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${finding.status === 'open' ? 'bg-red-600' : finding.status === 'in-progress' ? 'bg-amber-600' : 'bg-green-600'}`}>
                          {finding.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{finding.description}</p>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Owner: {finding.owner}</span>
                        <span>Due: {finding.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>)}
                  {controls.flatMap(c => c.findings).filter(f => f.severity === 'critical').length === 0 && <div className="text-center py-8 text-white/50">
                      <div className="text-4xl mb-2">✅</div>
                      <div>No critical findings</div>
                    </div>}
                </div>
              </div>

              {/* Upcoming Audits */}
              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🔍</span> Active & Upcoming Audits
                </h3>
                <div className="space-y-3">
                  {auditProjects.map(audit => <div key={audit.id} className="p-4 bg-black/20 rounded-xl border border-emerald-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{FRAMEWORK_CONFIG[audit.framework].icon}</span>
                          <h4 className="font-semibold">{audit.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${audit.status === 'planning' ? 'bg-blue-600' : audit.status === 'fieldwork' ? 'bg-amber-600' : audit.status === 'reporting' ? 'bg-purple-600' : 'bg-green-600'}`}>
                          {audit.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-white/50">Auditor:</span>
                          <div className="font-medium">{audit.auditor}</div>
                        </div>
                        <div>
                          <span className="text-white/50">Progress:</span>
                          <div className="font-medium">{audit.controlsTested}/{audit.controlsInScope} controls</div>
                        </div>
                        <div>
                          <span className="text-white/50">Findings:</span>
                          <div className={`font-medium ${audit.criticalFindings > 0 ? 'text-red-400' : ''}`}>
                            {audit.findingsCount} ({audit.criticalFindings} critical)
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={{
                      width: `${audit.controlsTested / audit.controlsInScope * 100}%`
                    }} />
                        </div>
                      </div>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Regulatory Impact Simulation */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">🔮 Regulatory Impact Simulator</h2>
                  <p className="text-white/60 text-sm">
                    Simulate the impact of upcoming regulations on your control environment.
                    Proactively identify gaps before requirements take effect.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Run Simulation
                </button>
              </div>
            </div>
          </div> : stryMutAct_9fa48("30809") ? false : stryMutAct_9fa48("30808") ? true : (stryCov_9fa48("30808", "30809", "30810"), (stryMutAct_9fa48("30812") ? activeTab !== 'dashboard' : stryMutAct_9fa48("30811") ? true : (stryCov_9fa48("30811", "30812"), activeTab === 'dashboard')) && <div className="space-y-6">
            {/* Framework Compliance Scores */}
            <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
              <h2 className="text-lg font-semibold mb-4">Framework Compliance Scores</h2>
              <div className="grid grid-cols-5 gap-4">
                {(Object.entries(FRAMEWORK_CONFIG) as [ComplianceFramework, typeof FRAMEWORK_CONFIG[ComplianceFramework]][]).map(([key, config]) => {
              const score = metrics.frameworkScores[key];
              return <div key={key} onClick={stryMutAct_9fa48("30815") ? () => undefined : (stryCov_9fa48("30815"), () => setSelectedFramework(key))} className={`p-4 rounded-xl border cursor-pointer transition-all ${(stryMutAct_9fa48("30819") ? selectedFramework !== key : stryMutAct_9fa48("30818") ? false : stryMutAct_9fa48("30817") ? true : (stryCov_9fa48("30817", "30818", "30819"), selectedFramework === key)) ? 'border-emerald-400 ring-2 ring-emerald-400/20' : 'border-emerald-800/50 hover:border-emerald-600'}`}>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">{config.icon}</span>
                        <span className="font-medium">{config.name}</span>
                      </div>
                      <div className={`text-3xl font-bold ${(stryMutAct_9fa48("30826") ? score < 90 : stryMutAct_9fa48("30825") ? score > 90 : stryMutAct_9fa48("30824") ? false : stryMutAct_9fa48("30823") ? true : (stryCov_9fa48("30823", "30824", "30825", "30826"), score >= 90)) ? 'text-green-400' : (stryMutAct_9fa48("30831") ? score < 70 : stryMutAct_9fa48("30830") ? score > 70 : stryMutAct_9fa48("30829") ? false : stryMutAct_9fa48("30828") ? true : (stryCov_9fa48("30828", "30829", "30830", "30831"), score >= 70)) ? 'text-amber-400' : 'text-red-400'}`}>{score}%</div>
                      <div className="h-2 bg-black/30 rounded-full overflow-hidden mt-2">
                        <div className={`h-full ${(stryMutAct_9fa48("30838") ? score < 90 : stryMutAct_9fa48("30837") ? score > 90 : stryMutAct_9fa48("30836") ? false : stryMutAct_9fa48("30835") ? true : (stryCov_9fa48("30835", "30836", "30837", "30838"), score >= 90)) ? 'bg-green-500' : (stryMutAct_9fa48("30843") ? score < 70 : stryMutAct_9fa48("30842") ? score > 70 : stryMutAct_9fa48("30841") ? false : stryMutAct_9fa48("30840") ? true : (stryCov_9fa48("30840", "30841", "30842", "30843"), score >= 70)) ? 'bg-amber-500' : 'bg-red-500'}`} style={stryMutAct_9fa48("30846") ? {} : (stryCov_9fa48("30846"), {
                    width: `${score}%`
                  })} />
                      </div>
                    </div>;
            })}
              </div>
            </div>

            {/* Critical Items */}
            <div className="grid grid-cols-2 gap-6">
              {/* Critical Findings */}
              <div className="bg-black/30 rounded-2xl p-6 border border-red-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Critical Findings
                </h3>
                <div className="space-y-3">
                  {stryMutAct_9fa48("30848") ? controls.flatMap(c => c.findings).map(finding => <div key={finding.id} className="p-4 bg-red-900/20 rounded-xl border border-red-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{finding.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${finding.status === 'open' ? 'bg-red-600' : finding.status === 'in-progress' ? 'bg-amber-600' : 'bg-green-600'}`}>
                          {finding.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{finding.description}</p>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Owner: {finding.owner}</span>
                        <span>Due: {finding.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>) : (stryCov_9fa48("30848"), controls.flatMap(stryMutAct_9fa48("30849") ? () => undefined : (stryCov_9fa48("30849"), c => c.findings)).filter(stryMutAct_9fa48("30850") ? () => undefined : (stryCov_9fa48("30850"), f => stryMutAct_9fa48("30853") ? f.severity !== 'critical' : stryMutAct_9fa48("30852") ? false : stryMutAct_9fa48("30851") ? true : (stryCov_9fa48("30851", "30852", "30853"), f.severity === 'critical'))).map(stryMutAct_9fa48("30855") ? () => undefined : (stryCov_9fa48("30855"), finding => <div key={finding.id} className="p-4 bg-red-900/20 rounded-xl border border-red-700/50">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{finding.title}</h4>
                        <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("30859") ? finding.status !== 'open' : stryMutAct_9fa48("30858") ? false : stryMutAct_9fa48("30857") ? true : (stryCov_9fa48("30857", "30858", "30859"), finding.status === 'open')) ? 'bg-red-600' : (stryMutAct_9fa48("30864") ? finding.status !== 'in-progress' : stryMutAct_9fa48("30863") ? false : stryMutAct_9fa48("30862") ? true : (stryCov_9fa48("30862", "30863", "30864"), finding.status === 'in-progress')) ? 'bg-amber-600' : 'bg-green-600'}`}>
                          {finding.status}
                        </span>
                      </div>
                      <p className="text-sm text-white/70 mb-2">{finding.description}</p>
                      <div className="flex justify-between text-xs text-white/50">
                        <span>Owner: {finding.owner}</span>
                        <span>Due: {finding.dueDate.toLocaleDateString()}</span>
                      </div>
                    </div>)))}
                  {stryMutAct_9fa48("30870") ? controls.flatMap(c => c.findings).filter(f => f.severity === 'critical').length === 0 || <div className="text-center py-8 text-white/50">
                      <div className="text-4xl mb-2">✅</div>
                      <div>No critical findings</div>
                    </div> : stryMutAct_9fa48("30869") ? false : stryMutAct_9fa48("30868") ? true : (stryCov_9fa48("30868", "30869", "30870"), (stryMutAct_9fa48("30872") ? controls.flatMap(c => c.findings).filter(f => f.severity === 'critical').length !== 0 : stryMutAct_9fa48("30871") ? true : (stryCov_9fa48("30871", "30872"), (stryMutAct_9fa48("30873") ? controls.flatMap(c => c.findings).length : (stryCov_9fa48("30873"), controls.flatMap(stryMutAct_9fa48("30874") ? () => undefined : (stryCov_9fa48("30874"), c => c.findings)).filter(stryMutAct_9fa48("30875") ? () => undefined : (stryCov_9fa48("30875"), f => stryMutAct_9fa48("30878") ? f.severity !== 'critical' : stryMutAct_9fa48("30877") ? false : stryMutAct_9fa48("30876") ? true : (stryCov_9fa48("30876", "30877", "30878"), f.severity === 'critical'))).length)) === 0)) && <div className="text-center py-8 text-white/50">
                      <div className="text-4xl mb-2">✅</div>
                      <div>No critical findings</div>
                    </div>)}
                </div>
              </div>

              {/* Upcoming Audits */}
              <div className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span>🔍</span> Active & Upcoming Audits
                </h3>
                <div className="space-y-3">
                  {auditProjects.map(stryMutAct_9fa48("30880") ? () => undefined : (stryCov_9fa48("30880"), audit => <div key={audit.id} className="p-4 bg-black/20 rounded-xl border border-emerald-800/30">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{FRAMEWORK_CONFIG[audit.framework].icon}</span>
                          <h4 className="font-semibold">{audit.name}</h4>
                        </div>
                        <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("30884") ? audit.status !== 'planning' : stryMutAct_9fa48("30883") ? false : stryMutAct_9fa48("30882") ? true : (stryCov_9fa48("30882", "30883", "30884"), audit.status === 'planning')) ? 'bg-blue-600' : (stryMutAct_9fa48("30889") ? audit.status !== 'fieldwork' : stryMutAct_9fa48("30888") ? false : stryMutAct_9fa48("30887") ? true : (stryCov_9fa48("30887", "30888", "30889"), audit.status === 'fieldwork')) ? 'bg-amber-600' : (stryMutAct_9fa48("30894") ? audit.status !== 'reporting' : stryMutAct_9fa48("30893") ? false : stryMutAct_9fa48("30892") ? true : (stryCov_9fa48("30892", "30893", "30894"), audit.status === 'reporting')) ? 'bg-purple-600' : 'bg-green-600'}`}>
                          {audit.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-white/50">Auditor:</span>
                          <div className="font-medium">{audit.auditor}</div>
                        </div>
                        <div>
                          <span className="text-white/50">Progress:</span>
                          <div className="font-medium">{audit.controlsTested}/{audit.controlsInScope} controls</div>
                        </div>
                        <div>
                          <span className="text-white/50">Findings:</span>
                          <div className={`font-medium ${(stryMutAct_9fa48("30902") ? audit.criticalFindings <= 0 : stryMutAct_9fa48("30901") ? audit.criticalFindings >= 0 : stryMutAct_9fa48("30900") ? false : stryMutAct_9fa48("30899") ? true : (stryCov_9fa48("30899", "30900", "30901", "30902"), audit.criticalFindings > 0)) ? 'text-red-400' : ''}`}>
                            {audit.findingsCount} ({audit.criticalFindings} critical)
                          </div>
                        </div>
                      </div>
                      <div className="mt-2">
                        <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                          <div className="h-full bg-emerald-500" style={stryMutAct_9fa48("30905") ? {} : (stryCov_9fa48("30905"), {
                      width: `${stryMutAct_9fa48("30907") ? audit.controlsTested / audit.controlsInScope / 100 : (stryCov_9fa48("30907"), (stryMutAct_9fa48("30908") ? audit.controlsTested * audit.controlsInScope : (stryCov_9fa48("30908"), audit.controlsTested / audit.controlsInScope)) * 100)}%`
                    })} />
                        </div>
                      </div>
                    </div>))}
                </div>
              </div>
            </div>

            {/* Regulatory Impact Simulation */}
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">🔮 Regulatory Impact Simulator</h2>
                  <p className="text-white/60 text-sm">
                    Simulate the impact of upcoming regulations on your control environment.
                    Proactively identify gaps before requirements take effect.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Run Simulation
                </button>
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("30911") ? activeTab === 'controls' || <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-6">
              <button onClick={() => setSelectedFramework('all')} className={`px-4 py-2 rounded-lg text-sm transition-colors ${selectedFramework === 'all' ? 'bg-emerald-600 text-white' : 'bg-black/30 text-white/60 hover:text-white'}`}>
                All Frameworks
              </button>
              {(Object.entries(FRAMEWORK_CONFIG) as [ComplianceFramework, typeof FRAMEWORK_CONFIG[ComplianceFramework]][]).slice(0, 6).map(([key, config]) => <button key={key} onClick={() => setSelectedFramework(key)} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedFramework === key ? 'bg-emerald-600 text-white' : 'bg-black/30 text-white/60 hover:text-white'}`}>
                  {config.icon} {config.name}
                </button>)}
            </div>

            {filteredControls.map(control => <div key={control.id} onClick={() => setSelectedControl(selectedControl?.id === control.id ? null : control)} className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all ${control.status === 'compliant' ? 'border-green-800/50 hover:border-green-600' : control.status === 'partial' ? 'border-amber-800/50 hover:border-amber-600' : 'border-red-800/50 hover:border-red-600'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{FRAMEWORK_CONFIG[control.framework].icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/50">{control.code}</span>
                        <h3 className="font-semibold">{control.name}</h3>
                      </div>
                      <div className="text-sm text-white/50">{control.category} • {control.department}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${control.riskRating === 'critical' ? 'bg-red-900 text-red-300' : control.riskRating === 'high' ? 'bg-amber-900 text-amber-300' : control.riskRating === 'medium' ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                      {control.riskRating} risk
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm ${control.status === 'compliant' ? 'bg-green-600' : control.status === 'partial' ? 'bg-amber-600' : 'bg-red-600'}`}>
                      {control.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-white/70 mb-3">{control.description}</p>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Owner:</span>
                    <div className="font-medium">{control.owner}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Last Tested:</span>
                    <div className="font-medium">{control.lastTested.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Automation:</span>
                    <div className={`font-medium ${control.automationLevel === 'fully-automated' ? 'text-green-400' : control.automationLevel === 'semi-automated' ? 'text-amber-400' : 'text-red-400'}`}>
                      {control.automationLevel}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/50">Evidence:</span>
                    <div className="font-medium">{control.evidence.length} items</div>
                  </div>
                </div>

                {/* Expanded View */}
                {selectedControl?.id === control.id && <div className="mt-4 pt-4 border-t border-emerald-800/30 space-y-4">
                    {/* Evidence */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Evidence</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {control.evidence.map(ev => <div key={ev.id} className="p-3 bg-black/20 rounded-xl flex items-center gap-3">
                            <span className="text-xl">
                              {ev.type === 'policy' ? '📄' : ev.type === 'procedure' ? '📋' : ev.type === 'screenshot' ? '📸' : ev.type === 'log' ? '📝' : ev.type === 'attestation' ? '✍️' : '📁'}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{ev.name}</div>
                              <div className="text-xs text-white/50">{ev.description}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs ${ev.status === 'valid' ? 'bg-green-900 text-green-300' : ev.status === 'expired' ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300'}`}>
                              {ev.status}
                            </span>
                          </div>)}
                      </div>
                    </div>

                    {/* Findings */}
                    {control.findings.length > 0 && <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Findings</h4>
                        <div className="space-y-2">
                          {control.findings.map(finding => <div key={finding.id} className={`p-3 rounded-xl ${finding.severity === 'critical' ? 'bg-red-900/30 border border-red-700/50' : finding.severity === 'high' ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-yellow-900/30 border border-yellow-700/50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{finding.title}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${finding.status === 'open' ? 'bg-red-600' : finding.status === 'in-progress' ? 'bg-amber-600' : 'bg-green-600'}`}>
                                  {finding.status}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">{finding.remediationPlan}</p>
                            </div>)}
                        </div>
                      </div>}

                    {/* Mapped Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Mapped Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {control.mappedRequirements.map(req => <span key={req} className="px-3 py-1 bg-emerald-900/50 rounded-lg text-sm">{req}</span>)}
                      </div>
                    </div>
                  </div>}
              </div>)}
          </div> : stryMutAct_9fa48("30910") ? false : stryMutAct_9fa48("30909") ? true : (stryCov_9fa48("30909", "30910", "30911"), (stryMutAct_9fa48("30913") ? activeTab !== 'controls' : stryMutAct_9fa48("30912") ? true : (stryCov_9fa48("30912", "30913"), activeTab === 'controls')) && <div className="space-y-4">
            {/* Filter Bar */}
            <div className="flex items-center gap-2 mb-6">
              <button onClick={stryMutAct_9fa48("30915") ? () => undefined : (stryCov_9fa48("30915"), () => setSelectedFramework('all'))} className={`px-4 py-2 rounded-lg text-sm transition-colors ${(stryMutAct_9fa48("30920") ? selectedFramework !== 'all' : stryMutAct_9fa48("30919") ? false : stryMutAct_9fa48("30918") ? true : (stryCov_9fa48("30918", "30919", "30920"), selectedFramework === 'all')) ? 'bg-emerald-600 text-white' : 'bg-black/30 text-white/60 hover:text-white'}`}>
                All Frameworks
              </button>
              {stryMutAct_9fa48("30924") ? (Object.entries(FRAMEWORK_CONFIG) as [ComplianceFramework, typeof FRAMEWORK_CONFIG[ComplianceFramework]][]).map(([key, config]) => <button key={key} onClick={() => setSelectedFramework(key)} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${selectedFramework === key ? 'bg-emerald-600 text-white' : 'bg-black/30 text-white/60 hover:text-white'}`}>
                  {config.icon} {config.name}
                </button>) : (stryCov_9fa48("30924"), (Object.entries(FRAMEWORK_CONFIG) as [ComplianceFramework, typeof FRAMEWORK_CONFIG[ComplianceFramework]][]).slice(0, 6).map(stryMutAct_9fa48("30925") ? () => undefined : (stryCov_9fa48("30925"), ([key, config]) => <button key={key} onClick={stryMutAct_9fa48("30926") ? () => undefined : (stryCov_9fa48("30926"), () => setSelectedFramework(key))} className={`px-4 py-2 rounded-lg text-sm transition-colors flex items-center gap-2 ${(stryMutAct_9fa48("30930") ? selectedFramework !== key : stryMutAct_9fa48("30929") ? false : stryMutAct_9fa48("30928") ? true : (stryCov_9fa48("30928", "30929", "30930"), selectedFramework === key)) ? 'bg-emerald-600 text-white' : 'bg-black/30 text-white/60 hover:text-white'}`}>
                  {config.icon} {config.name}
                </button>)))}
            </div>

            {filteredControls.map(stryMutAct_9fa48("30933") ? () => undefined : (stryCov_9fa48("30933"), control => <div key={control.id} onClick={stryMutAct_9fa48("30934") ? () => undefined : (stryCov_9fa48("30934"), () => setSelectedControl((stryMutAct_9fa48("30937") ? selectedControl?.id !== control.id : stryMutAct_9fa48("30936") ? false : stryMutAct_9fa48("30935") ? true : (stryCov_9fa48("30935", "30936", "30937"), (stryMutAct_9fa48("30938") ? selectedControl.id : (stryCov_9fa48("30938"), selectedControl?.id)) === control.id)) ? null : control))} className={`bg-black/30 rounded-2xl p-6 border cursor-pointer transition-all ${(stryMutAct_9fa48("30942") ? control.status !== 'compliant' : stryMutAct_9fa48("30941") ? false : stryMutAct_9fa48("30940") ? true : (stryCov_9fa48("30940", "30941", "30942"), control.status === 'compliant')) ? 'border-green-800/50 hover:border-green-600' : (stryMutAct_9fa48("30947") ? control.status !== 'partial' : stryMutAct_9fa48("30946") ? false : stryMutAct_9fa48("30945") ? true : (stryCov_9fa48("30945", "30946", "30947"), control.status === 'partial')) ? 'border-amber-800/50 hover:border-amber-600' : 'border-red-800/50 hover:border-red-600'}`}>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{FRAMEWORK_CONFIG[control.framework].icon}</span>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-white/50">{control.code}</span>
                        <h3 className="font-semibold">{control.name}</h3>
                      </div>
                      <div className="text-sm text-white/50">{control.category} • {control.department}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("30954") ? control.riskRating !== 'critical' : stryMutAct_9fa48("30953") ? false : stryMutAct_9fa48("30952") ? true : (stryCov_9fa48("30952", "30953", "30954"), control.riskRating === 'critical')) ? 'bg-red-900 text-red-300' : (stryMutAct_9fa48("30959") ? control.riskRating !== 'high' : stryMutAct_9fa48("30958") ? false : stryMutAct_9fa48("30957") ? true : (stryCov_9fa48("30957", "30958", "30959"), control.riskRating === 'high')) ? 'bg-amber-900 text-amber-300' : (stryMutAct_9fa48("30964") ? control.riskRating !== 'medium' : stryMutAct_9fa48("30963") ? false : stryMutAct_9fa48("30962") ? true : (stryCov_9fa48("30962", "30963", "30964"), control.riskRating === 'medium')) ? 'bg-yellow-900 text-yellow-300' : 'bg-green-900 text-green-300'}`}>
                      {control.riskRating} risk
                    </span>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("30971") ? control.status !== 'compliant' : stryMutAct_9fa48("30970") ? false : stryMutAct_9fa48("30969") ? true : (stryCov_9fa48("30969", "30970", "30971"), control.status === 'compliant')) ? 'bg-green-600' : (stryMutAct_9fa48("30976") ? control.status !== 'partial' : stryMutAct_9fa48("30975") ? false : stryMutAct_9fa48("30974") ? true : (stryCov_9fa48("30974", "30975", "30976"), control.status === 'partial')) ? 'bg-amber-600' : 'bg-red-600'}`}>
                      {control.status}
                    </span>
                  </div>
                </div>

                <p className="text-sm text-white/70 mb-3">{control.description}</p>

                <div className="grid grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="text-white/50">Owner:</span>
                    <div className="font-medium">{control.owner}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Last Tested:</span>
                    <div className="font-medium">{control.lastTested.toLocaleDateString()}</div>
                  </div>
                  <div>
                    <span className="text-white/50">Automation:</span>
                    <div className={`font-medium ${(stryMutAct_9fa48("30983") ? control.automationLevel !== 'fully-automated' : stryMutAct_9fa48("30982") ? false : stryMutAct_9fa48("30981") ? true : (stryCov_9fa48("30981", "30982", "30983"), control.automationLevel === 'fully-automated')) ? 'text-green-400' : (stryMutAct_9fa48("30988") ? control.automationLevel !== 'semi-automated' : stryMutAct_9fa48("30987") ? false : stryMutAct_9fa48("30986") ? true : (stryCov_9fa48("30986", "30987", "30988"), control.automationLevel === 'semi-automated')) ? 'text-amber-400' : 'text-red-400'}`}>
                      {control.automationLevel}
                    </div>
                  </div>
                  <div>
                    <span className="text-white/50">Evidence:</span>
                    <div className="font-medium">{control.evidence.length} items</div>
                  </div>
                </div>

                {/* Expanded View */}
                {stryMutAct_9fa48("30994") ? selectedControl?.id === control.id || <div className="mt-4 pt-4 border-t border-emerald-800/30 space-y-4">
                    {/* Evidence */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Evidence</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {control.evidence.map(ev => <div key={ev.id} className="p-3 bg-black/20 rounded-xl flex items-center gap-3">
                            <span className="text-xl">
                              {ev.type === 'policy' ? '📄' : ev.type === 'procedure' ? '📋' : ev.type === 'screenshot' ? '📸' : ev.type === 'log' ? '📝' : ev.type === 'attestation' ? '✍️' : '📁'}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{ev.name}</div>
                              <div className="text-xs text-white/50">{ev.description}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs ${ev.status === 'valid' ? 'bg-green-900 text-green-300' : ev.status === 'expired' ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300'}`}>
                              {ev.status}
                            </span>
                          </div>)}
                      </div>
                    </div>

                    {/* Findings */}
                    {control.findings.length > 0 && <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Findings</h4>
                        <div className="space-y-2">
                          {control.findings.map(finding => <div key={finding.id} className={`p-3 rounded-xl ${finding.severity === 'critical' ? 'bg-red-900/30 border border-red-700/50' : finding.severity === 'high' ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-yellow-900/30 border border-yellow-700/50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{finding.title}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${finding.status === 'open' ? 'bg-red-600' : finding.status === 'in-progress' ? 'bg-amber-600' : 'bg-green-600'}`}>
                                  {finding.status}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">{finding.remediationPlan}</p>
                            </div>)}
                        </div>
                      </div>}

                    {/* Mapped Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Mapped Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {control.mappedRequirements.map(req => <span key={req} className="px-3 py-1 bg-emerald-900/50 rounded-lg text-sm">{req}</span>)}
                      </div>
                    </div>
                  </div> : stryMutAct_9fa48("30993") ? false : stryMutAct_9fa48("30992") ? true : (stryCov_9fa48("30992", "30993", "30994"), (stryMutAct_9fa48("30996") ? selectedControl?.id !== control.id : stryMutAct_9fa48("30995") ? true : (stryCov_9fa48("30995", "30996"), (stryMutAct_9fa48("30997") ? selectedControl.id : (stryCov_9fa48("30997"), selectedControl?.id)) === control.id)) && <div className="mt-4 pt-4 border-t border-emerald-800/30 space-y-4">
                    {/* Evidence */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Evidence</h4>
                      <div className="grid grid-cols-2 gap-3">
                        {control.evidence.map(stryMutAct_9fa48("30998") ? () => undefined : (stryCov_9fa48("30998"), ev => <div key={ev.id} className="p-3 bg-black/20 rounded-xl flex items-center gap-3">
                            <span className="text-xl">
                              {(stryMutAct_9fa48("31001") ? ev.type !== 'policy' : stryMutAct_9fa48("31000") ? false : stryMutAct_9fa48("30999") ? true : (stryCov_9fa48("30999", "31000", "31001"), ev.type === 'policy')) ? '📄' : (stryMutAct_9fa48("31006") ? ev.type !== 'procedure' : stryMutAct_9fa48("31005") ? false : stryMutAct_9fa48("31004") ? true : (stryCov_9fa48("31004", "31005", "31006"), ev.type === 'procedure')) ? '📋' : (stryMutAct_9fa48("31011") ? ev.type !== 'screenshot' : stryMutAct_9fa48("31010") ? false : stryMutAct_9fa48("31009") ? true : (stryCov_9fa48("31009", "31010", "31011"), ev.type === 'screenshot')) ? '📸' : (stryMutAct_9fa48("31016") ? ev.type !== 'log' : stryMutAct_9fa48("31015") ? false : stryMutAct_9fa48("31014") ? true : (stryCov_9fa48("31014", "31015", "31016"), ev.type === 'log')) ? '📝' : (stryMutAct_9fa48("31021") ? ev.type !== 'attestation' : stryMutAct_9fa48("31020") ? false : stryMutAct_9fa48("31019") ? true : (stryCov_9fa48("31019", "31020", "31021"), ev.type === 'attestation')) ? '✍️' : '📁'}
                            </span>
                            <div className="flex-1">
                              <div className="font-medium text-sm">{ev.name}</div>
                              <div className="text-xs text-white/50">{ev.description}</div>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("31028") ? ev.status !== 'valid' : stryMutAct_9fa48("31027") ? false : stryMutAct_9fa48("31026") ? true : (stryCov_9fa48("31026", "31027", "31028"), ev.status === 'valid')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("31033") ? ev.status !== 'expired' : stryMutAct_9fa48("31032") ? false : stryMutAct_9fa48("31031") ? true : (stryCov_9fa48("31031", "31032", "31033"), ev.status === 'expired')) ? 'bg-red-900 text-red-300' : 'bg-amber-900 text-amber-300'}`}>
                              {ev.status}
                            </span>
                          </div>))}
                      </div>
                    </div>

                    {/* Findings */}
                    {stryMutAct_9fa48("31039") ? control.findings.length > 0 || <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Findings</h4>
                        <div className="space-y-2">
                          {control.findings.map(finding => <div key={finding.id} className={`p-3 rounded-xl ${finding.severity === 'critical' ? 'bg-red-900/30 border border-red-700/50' : finding.severity === 'high' ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-yellow-900/30 border border-yellow-700/50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{finding.title}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${finding.status === 'open' ? 'bg-red-600' : finding.status === 'in-progress' ? 'bg-amber-600' : 'bg-green-600'}`}>
                                  {finding.status}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">{finding.remediationPlan}</p>
                            </div>)}
                        </div>
                      </div> : stryMutAct_9fa48("31038") ? false : stryMutAct_9fa48("31037") ? true : (stryCov_9fa48("31037", "31038", "31039"), (stryMutAct_9fa48("31042") ? control.findings.length <= 0 : stryMutAct_9fa48("31041") ? control.findings.length >= 0 : stryMutAct_9fa48("31040") ? true : (stryCov_9fa48("31040", "31041", "31042"), control.findings.length > 0)) && <div>
                        <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Findings</h4>
                        <div className="space-y-2">
                          {control.findings.map(stryMutAct_9fa48("31043") ? () => undefined : (stryCov_9fa48("31043"), finding => <div key={finding.id} className={`p-3 rounded-xl ${(stryMutAct_9fa48("31047") ? finding.severity !== 'critical' : stryMutAct_9fa48("31046") ? false : stryMutAct_9fa48("31045") ? true : (stryCov_9fa48("31045", "31046", "31047"), finding.severity === 'critical')) ? 'bg-red-900/30 border border-red-700/50' : (stryMutAct_9fa48("31052") ? finding.severity !== 'high' : stryMutAct_9fa48("31051") ? false : stryMutAct_9fa48("31050") ? true : (stryCov_9fa48("31050", "31051", "31052"), finding.severity === 'high')) ? 'bg-amber-900/30 border border-amber-700/50' : 'bg-yellow-900/30 border border-yellow-700/50'}`}>
                              <div className="flex items-center justify-between mb-1">
                                <span className="font-medium">{finding.title}</span>
                                <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("31059") ? finding.status !== 'open' : stryMutAct_9fa48("31058") ? false : stryMutAct_9fa48("31057") ? true : (stryCov_9fa48("31057", "31058", "31059"), finding.status === 'open')) ? 'bg-red-600' : (stryMutAct_9fa48("31064") ? finding.status !== 'in-progress' : stryMutAct_9fa48("31063") ? false : stryMutAct_9fa48("31062") ? true : (stryCov_9fa48("31062", "31063", "31064"), finding.status === 'in-progress')) ? 'bg-amber-600' : 'bg-green-600'}`}>
                                  {finding.status}
                                </span>
                              </div>
                              <p className="text-sm text-white/70">{finding.remediationPlan}</p>
                            </div>))}
                        </div>
                      </div>)}

                    {/* Mapped Requirements */}
                    <div>
                      <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Mapped Requirements</h4>
                      <div className="flex flex-wrap gap-2">
                        {control.mappedRequirements.map(stryMutAct_9fa48("31068") ? () => undefined : (stryCov_9fa48("31068"), req => <span key={req} className="px-3 py-1 bg-emerald-900/50 rounded-lg text-sm">{req}</span>))}
                      </div>
                    </div>
                  </div>)}
              </div>))}
          </div>)}

        {stryMutAct_9fa48("31071") ? activeTab === 'board-packets' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">📋 Board Packet Generator</h2>
                  <p className="text-white/60 text-sm">
                    Automatically generate comprehensive compliance reports for board meetings,
                    audit committees, and regulatory submissions.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Generate New Packet
                </button>
              </div>
            </div>

            {boardPackets.map(packet => <div key={packet.id} className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{packet.name}</h3>
                    <div className="text-sm text-white/50">
                      Generated: {packet.generatedAt.toLocaleDateString()} • Period: {packet.period}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${packet.status === 'draft' ? 'bg-neutral-600' : packet.status === 'review' ? 'bg-amber-600' : packet.status === 'approved' ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {packet.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Sections */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Sections</h4>
                    <div className="space-y-2">
                      {packet.sections.map(section => <div key={section.name} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                          <span>{section.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${section.status === 'complete' ? 'bg-green-900 text-green-300' : section.status === 'pending' ? 'bg-amber-900 text-amber-300' : 'bg-red-900 text-red-300'}`}>
                            {section.status}
                          </span>
                        </div>)}
                    </div>
                  </div>

                  {/* Approvers */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Approvers</h4>
                    <div className="space-y-2">
                      {packet.approvers.map(approver => <div key={approver.name} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                          <span>{approver.name}</span>
                          {approver.approved ? <span className="flex items-center gap-2 text-green-400 text-sm">
                              ✅ Approved {approver.approvedAt?.toLocaleDateString()}
                            </span> : <span className="px-2 py-0.5 bg-amber-900 text-amber-300 rounded text-xs">
                              Pending
                            </span>}
                        </div>)}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-emerald-800/30">
                  <button className="px-4 py-2 bg-emerald-700 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                    📄 View Report
                  </button>
                  <button className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 transition-colors">
                    ✏️ Edit
                  </button>
                  <button className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 transition-colors">
                    📤 Export PDF
                  </button>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("31070") ? false : stryMutAct_9fa48("31069") ? true : (stryCov_9fa48("31069", "31070", "31071"), (stryMutAct_9fa48("31073") ? activeTab !== 'board-packets' : stryMutAct_9fa48("31072") ? true : (stryCov_9fa48("31072", "31073"), activeTab === 'board-packets')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-emerald-900/30 to-green-900/30 rounded-2xl p-6 border border-emerald-700/50">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold mb-2">📋 Board Packet Generator</h2>
                  <p className="text-white/60 text-sm">
                    Automatically generate comprehensive compliance reports for board meetings,
                    audit committees, and regulatory submissions.
                  </p>
                </div>
                <button className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-medium hover:opacity-90 transition-all">
                  Generate New Packet
                </button>
              </div>
            </div>

            {boardPackets.map(stryMutAct_9fa48("31075") ? () => undefined : (stryCov_9fa48("31075"), packet => <div key={packet.id} className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{packet.name}</h3>
                    <div className="text-sm text-white/50">
                      Generated: {packet.generatedAt.toLocaleDateString()} • Period: {packet.period}
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("31079") ? packet.status !== 'draft' : stryMutAct_9fa48("31078") ? false : stryMutAct_9fa48("31077") ? true : (stryCov_9fa48("31077", "31078", "31079"), packet.status === 'draft')) ? 'bg-neutral-600' : (stryMutAct_9fa48("31084") ? packet.status !== 'review' : stryMutAct_9fa48("31083") ? false : stryMutAct_9fa48("31082") ? true : (stryCov_9fa48("31082", "31083", "31084"), packet.status === 'review')) ? 'bg-amber-600' : (stryMutAct_9fa48("31089") ? packet.status !== 'approved' : stryMutAct_9fa48("31088") ? false : stryMutAct_9fa48("31087") ? true : (stryCov_9fa48("31087", "31088", "31089"), packet.status === 'approved')) ? 'bg-green-600' : 'bg-blue-600'}`}>
                    {packet.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Sections */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Sections</h4>
                    <div className="space-y-2">
                      {packet.sections.map(stryMutAct_9fa48("31093") ? () => undefined : (stryCov_9fa48("31093"), section => <div key={section.name} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                          <span>{section.name}</span>
                          <span className={`px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("31097") ? section.status !== 'complete' : stryMutAct_9fa48("31096") ? false : stryMutAct_9fa48("31095") ? true : (stryCov_9fa48("31095", "31096", "31097"), section.status === 'complete')) ? 'bg-green-900 text-green-300' : (stryMutAct_9fa48("31102") ? section.status !== 'pending' : stryMutAct_9fa48("31101") ? false : stryMutAct_9fa48("31100") ? true : (stryCov_9fa48("31100", "31101", "31102"), section.status === 'pending')) ? 'bg-amber-900 text-amber-300' : 'bg-red-900 text-red-300'}`}>
                            {section.status}
                          </span>
                        </div>))}
                    </div>
                  </div>

                  {/* Approvers */}
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-3">Approvers</h4>
                    <div className="space-y-2">
                      {packet.approvers.map(stryMutAct_9fa48("31106") ? () => undefined : (stryCov_9fa48("31106"), approver => <div key={approver.name} className="flex items-center justify-between p-3 bg-black/20 rounded-xl">
                          <span>{approver.name}</span>
                          {approver.approved ? <span className="flex items-center gap-2 text-green-400 text-sm">
                              ✅ Approved {stryMutAct_9fa48("31107") ? approver.approvedAt.toLocaleDateString() : (stryCov_9fa48("31107"), approver.approvedAt?.toLocaleDateString())}
                            </span> : <span className="px-2 py-0.5 bg-amber-900 text-amber-300 rounded text-xs">
                              Pending
                            </span>}
                        </div>))}
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-4 pt-4 border-t border-emerald-800/30">
                  <button className="px-4 py-2 bg-emerald-700 rounded-lg text-sm hover:bg-emerald-600 transition-colors">
                    📄 View Report
                  </button>
                  <button className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 transition-colors">
                    ✏️ Edit
                  </button>
                  <button className="px-4 py-2 bg-black/30 rounded-lg text-sm hover:bg-black/40 transition-colors">
                    📤 Export PDF
                  </button>
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("31110") ? activeTab === 'regulations' || <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-bold mb-2">Regulation Library</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Access the full regulatory library with real-time updates on SOX, GDPR, HIPAA, PCI-DSS, 
              FedRAMP, DORA, and 50+ other frameworks.
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-medium hover:opacity-90 transition-all">
              Browse Regulations
            </button>
          </div> : stryMutAct_9fa48("31109") ? false : stryMutAct_9fa48("31108") ? true : (stryCov_9fa48("31108", "31109", "31110"), (stryMutAct_9fa48("31112") ? activeTab !== 'regulations' : stryMutAct_9fa48("31111") ? true : (stryCov_9fa48("31111", "31112"), activeTab === 'regulations')) && <div className="text-center py-12">
            <div className="text-6xl mb-4">📜</div>
            <h2 className="text-2xl font-bold mb-2">Regulation Library</h2>
            <p className="text-white/60 max-w-md mx-auto">
              Access the full regulatory library with real-time updates on SOX, GDPR, HIPAA, PCI-DSS, 
              FedRAMP, DORA, and 50+ other frameworks.
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 rounded-xl font-medium hover:opacity-90 transition-all">
              Browse Regulations
            </button>
          </div>)}

        {stryMutAct_9fa48("31116") ? activeTab === 'audits' || <div className="space-y-4">
            {auditProjects.map(audit => <div key={audit.id} className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{FRAMEWORK_CONFIG[audit.framework].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{audit.name}</h3>
                      <div className="text-sm text-white/50">
                        {audit.auditor} • {audit.type} audit
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${audit.status === 'planning' ? 'bg-blue-600' : audit.status === 'fieldwork' ? 'bg-amber-600' : audit.status === 'reporting' ? 'bg-purple-600' : 'bg-green-600'}`}>
                    {audit.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold">{audit.controlsInScope}</div>
                    <div className="text-xs text-white/50">Controls in Scope</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">{audit.controlsTested}</div>
                    <div className="text-xs text-white/50">Tested</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold">{Math.round(audit.controlsTested / audit.controlsInScope * 100)}%</div>
                    <div className="text-xs text-white/50">Progress</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-amber-400">{audit.findingsCount}</div>
                    <div className="text-xs text-white/50">Findings</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className={`text-2xl font-bold ${audit.criticalFindings > 0 ? 'text-red-400' : 'text-green-400'}`}>
                      {audit.criticalFindings}
                    </div>
                    <div className="text-xs text-white/50">Critical</div>
                  </div>
                </div>

                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all" style={{
              width: `${audit.controlsTested / audit.controlsInScope * 100}%`
            }} />
                </div>

                <div className="flex justify-between text-sm text-white/50 mt-2">
                  <span>Start: {audit.startDate.toLocaleDateString()}</span>
                  <span>End: {audit.endDate.toLocaleDateString()}</span>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("31115") ? false : stryMutAct_9fa48("31114") ? true : (stryCov_9fa48("31114", "31115", "31116"), (stryMutAct_9fa48("31118") ? activeTab !== 'audits' : stryMutAct_9fa48("31117") ? true : (stryCov_9fa48("31117", "31118"), activeTab === 'audits')) && <div className="space-y-4">
            {auditProjects.map(stryMutAct_9fa48("31120") ? () => undefined : (stryCov_9fa48("31120"), audit => <div key={audit.id} className="bg-black/30 rounded-2xl p-6 border border-emerald-800/50">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{FRAMEWORK_CONFIG[audit.framework].icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold">{audit.name}</h3>
                      <div className="text-sm text-white/50">
                        {audit.auditor} • {audit.type} audit
                      </div>
                    </div>
                  </div>
                  <span className={`px-4 py-2 rounded-lg text-sm font-medium ${(stryMutAct_9fa48("31124") ? audit.status !== 'planning' : stryMutAct_9fa48("31123") ? false : stryMutAct_9fa48("31122") ? true : (stryCov_9fa48("31122", "31123", "31124"), audit.status === 'planning')) ? 'bg-blue-600' : (stryMutAct_9fa48("31129") ? audit.status !== 'fieldwork' : stryMutAct_9fa48("31128") ? false : stryMutAct_9fa48("31127") ? true : (stryCov_9fa48("31127", "31128", "31129"), audit.status === 'fieldwork')) ? 'bg-amber-600' : (stryMutAct_9fa48("31134") ? audit.status !== 'reporting' : stryMutAct_9fa48("31133") ? false : stryMutAct_9fa48("31132") ? true : (stryCov_9fa48("31132", "31133", "31134"), audit.status === 'reporting')) ? 'bg-purple-600' : 'bg-green-600'}`}>
                    {stryMutAct_9fa48("31138") ? audit.status.toLowerCase() : (stryCov_9fa48("31138"), audit.status.toUpperCase())}
                  </span>
                </div>

                <div className="grid grid-cols-5 gap-4 mb-4">
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold">{audit.controlsInScope}</div>
                    <div className="text-xs text-white/50">Controls in Scope</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-emerald-400">{audit.controlsTested}</div>
                    <div className="text-xs text-white/50">Tested</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold">{Math.round(stryMutAct_9fa48("31139") ? audit.controlsTested / audit.controlsInScope / 100 : (stryCov_9fa48("31139"), (stryMutAct_9fa48("31140") ? audit.controlsTested * audit.controlsInScope : (stryCov_9fa48("31140"), audit.controlsTested / audit.controlsInScope)) * 100))}%</div>
                    <div className="text-xs text-white/50">Progress</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className="text-2xl font-bold text-amber-400">{audit.findingsCount}</div>
                    <div className="text-xs text-white/50">Findings</div>
                  </div>
                  <div className="text-center p-3 bg-black/20 rounded-xl">
                    <div className={`text-2xl font-bold ${(stryMutAct_9fa48("31145") ? audit.criticalFindings <= 0 : stryMutAct_9fa48("31144") ? audit.criticalFindings >= 0 : stryMutAct_9fa48("31143") ? false : stryMutAct_9fa48("31142") ? true : (stryCov_9fa48("31142", "31143", "31144", "31145"), audit.criticalFindings > 0)) ? 'text-red-400' : 'text-green-400'}`}>
                      {audit.criticalFindings}
                    </div>
                    <div className="text-xs text-white/50">Critical</div>
                  </div>
                </div>

                <div className="h-3 bg-black/30 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-emerald-500 to-green-500 transition-all" style={stryMutAct_9fa48("31148") ? {} : (stryCov_9fa48("31148"), {
              width: `${stryMutAct_9fa48("31150") ? audit.controlsTested / audit.controlsInScope / 100 : (stryCov_9fa48("31150"), (stryMutAct_9fa48("31151") ? audit.controlsTested * audit.controlsInScope : (stryCov_9fa48("31151"), audit.controlsTested / audit.controlsInScope)) * 100)}%`
            })} />
                </div>

                <div className="flex justify-between text-sm text-white/50 mt-2">
                  <span>Start: {audit.startDate.toLocaleDateString()}</span>
                  <span>End: {audit.endDate.toLocaleDateString()}</span>
                </div>
              </div>))}
          </div>)}
      </main>
    </div>;
};
export default GovernPage;