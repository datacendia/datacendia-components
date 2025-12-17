// @ts-nocheck
// =============================================================================
// CENDIA DEFENSESTACK™ - GOVERNMENT/DEFENSE EDITION
// Sovereign AI Platform for National Security Applications
// "NATO/DoD Compatible • Air-Gapped Deployment • Zero Trust Architecture"
// 
// CAPABILITIES:
// - Air-gapped deployment
// - Model red/blue team wargaming
// - Classified document absorption
// - Threat simulation
// - Multi-agent battlefield strategy AI
// - Decision-chain verification
// - Zero-trust architecture
// - NATO/DoD compatible audit logging
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
import { decisionIntelApi } from '../../../lib/api';

// =============================================================================
// TYPES
// =============================================================================

type ClassificationLevel = 'unclassified' | 'cui' | 'confidential' | 'secret' | 'top-secret' | 'sci';
type DeploymentMode = 'air-gapped' | 'classified-network' | 'hybrid' | 'cross-domain';
type ThreatCategory = 'cyber' | 'kinetic' | 'information' | 'economic' | 'hybrid-warfare';
type MissionPhase = 'planning' | 'preparation' | 'execution' | 'assessment';
interface ClassifiedDocument {
  id: string;
  title: string;
  classification: ClassificationLevel;
  compartments: string[];
  dateClassified: Date;
  originatingAgency: string;
  status: 'ingested' | 'processing' | 'indexed' | 'available';
  pageCount: number;
  extractedEntities: number;
}
interface ThreatScenario {
  id: string;
  name: string;
  category: ThreatCategory;
  adversary: string;
  probability: number;
  impact: 'catastrophic' | 'critical' | 'significant' | 'moderate' | 'minimal';
  timeframe: string;
  indicators: string[];
  countermeasures: string[];
  lastUpdated: Date;
}
interface WarGame {
  id: string;
  name: string;
  scenario: string;
  status: 'planning' | 'active' | 'complete' | 'archived';
  redTeam: {
    agents: number;
    objectives: string[];
    successRate: number;
  };
  blueTeam: {
    agents: number;
    objectives: string[];
    successRate: number;
  };
  iterations: number;
  insights: string[];
  startDate: Date;
  classification: ClassificationLevel;
}
interface DecisionChain {
  id: string;
  name: string;
  phase: MissionPhase;
  decisions: {
    id: string;
    description: string;
    authority: string;
    status: 'pending' | 'approved' | 'executed' | 'verified';
    timestamp: Date;
    verificationHash: string;
  }[];
  participants: string[];
  classification: ClassificationLevel;
}
interface SecurityPosture {
  overallScore: number;
  zeroTrustCompliance: number;
  encryptionCoverage: number;
  accessControlScore: number;
  auditCompleteness: number;
  vulnerabilities: {
    critical: number;
    high: number;
    medium: number;
    low: number;
  };
  lastAssessment: Date;
  certifications: string[];
}
interface AuditEvent {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  resource: string;
  classification: ClassificationLevel;
  outcome: 'success' | 'failure' | 'denied';
  ipAddress: string;
  sessionId: string;
  verified: boolean;
}
interface DeploymentNode {
  id: string;
  name: string;
  location: string;
  mode: DeploymentMode;
  classification: ClassificationLevel;
  status: 'online' | 'offline' | 'maintenance' | 'compromised';
  lastSync: Date;
  agents: number;
  throughput: number;
}

// =============================================================================
// MOCK DATA
// =============================================================================

const CLASSIFICATION_CONFIG: Record<ClassificationLevel, {
  color: string;
  label: string;
  bg: string;
}> = stryMutAct_9fa48("28648") ? {} : (stryCov_9fa48("28648"), {
  unclassified: stryMutAct_9fa48("28649") ? {} : (stryCov_9fa48("28649"), {
    color: 'text-green-400',
    label: 'UNCLASSIFIED',
    bg: 'bg-green-900/50'
  }),
  cui: stryMutAct_9fa48("28653") ? {} : (stryCov_9fa48("28653"), {
    color: 'text-blue-400',
    label: 'CUI',
    bg: 'bg-blue-900/50'
  }),
  confidential: stryMutAct_9fa48("28657") ? {} : (stryCov_9fa48("28657"), {
    color: 'text-cyan-400',
    label: 'CONFIDENTIAL',
    bg: 'bg-cyan-900/50'
  }),
  secret: stryMutAct_9fa48("28661") ? {} : (stryCov_9fa48("28661"), {
    color: 'text-amber-400',
    label: 'SECRET',
    bg: 'bg-amber-900/50'
  }),
  'top-secret': stryMutAct_9fa48("28665") ? {} : (stryCov_9fa48("28665"), {
    color: 'text-red-400',
    label: 'TOP SECRET',
    bg: 'bg-red-900/50'
  }),
  sci: stryMutAct_9fa48("28669") ? {} : (stryCov_9fa48("28669"), {
    color: 'text-purple-400',
    label: 'TS/SCI',
    bg: 'bg-purple-900/50'
  })
});
const generateSecurityPosture = stryMutAct_9fa48("28673") ? () => undefined : (stryCov_9fa48("28673"), (() => {
  const generateSecurityPosture = (): SecurityPosture => stryMutAct_9fa48("28674") ? {} : (stryCov_9fa48("28674"), {
    overallScore: 94,
    zeroTrustCompliance: 98,
    encryptionCoverage: 100,
    accessControlScore: 96,
    auditCompleteness: 99,
    vulnerabilities: stryMutAct_9fa48("28675") ? {} : (stryCov_9fa48("28675"), {
      critical: 0,
      high: 2,
      medium: 8,
      low: 23
    }),
    lastAssessment: new Date(stryMutAct_9fa48("28676") ? Date.now() + 2 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("28676"), Date.now() - (stryMutAct_9fa48("28677") ? 2 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("28677"), (stryMutAct_9fa48("28678") ? 2 * 24 * 60 / 60 : (stryCov_9fa48("28678"), (stryMutAct_9fa48("28679") ? 2 * 24 / 60 : (stryCov_9fa48("28679"), (stryMutAct_9fa48("28680") ? 2 / 24 : (stryCov_9fa48("28680"), 2 * 24)) * 60)) * 60)) * 1000)))),
    certifications: stryMutAct_9fa48("28681") ? [] : (stryCov_9fa48("28681"), ['FedRAMP High', 'IL5', 'IL6', 'CMMC Level 3', 'NIST 800-171', 'JSIG'])
  });
  return generateSecurityPosture;
})());
const generateThreatScenarios = stryMutAct_9fa48("28688") ? () => undefined : (stryCov_9fa48("28688"), (() => {
  const generateThreatScenarios = (): ThreatScenario[] => stryMutAct_9fa48("28689") ? [] : (stryCov_9fa48("28689"), [stryMutAct_9fa48("28690") ? {} : (stryCov_9fa48("28690"), {
    id: 'threat-001',
    name: 'Advanced Persistent Threat - APT29',
    category: 'cyber',
    adversary: 'Nation State Actor',
    probability: 0.72,
    impact: 'critical',
    timeframe: '30-90 days',
    indicators: stryMutAct_9fa48("28697") ? [] : (stryCov_9fa48("28697"), ['Spear phishing campaigns', 'C2 beacon activity', 'Lateral movement patterns', 'Data staging']),
    countermeasures: stryMutAct_9fa48("28702") ? [] : (stryCov_9fa48("28702"), ['Enhanced email filtering', 'Network segmentation', 'EDR deployment', 'Zero trust enforcement']),
    lastUpdated: new Date(stryMutAct_9fa48("28707") ? Date.now() + 4 * 60 * 60 * 1000 : (stryCov_9fa48("28707"), Date.now() - (stryMutAct_9fa48("28708") ? 4 * 60 * 60 / 1000 : (stryCov_9fa48("28708"), (stryMutAct_9fa48("28709") ? 4 * 60 / 60 : (stryCov_9fa48("28709"), (stryMutAct_9fa48("28710") ? 4 / 60 : (stryCov_9fa48("28710"), 4 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("28711") ? {} : (stryCov_9fa48("28711"), {
    id: 'threat-002',
    name: 'Supply Chain Compromise',
    category: 'hybrid-warfare',
    adversary: 'Multiple Actors',
    probability: 0.45,
    impact: 'catastrophic',
    timeframe: '6-12 months',
    indicators: stryMutAct_9fa48("28718") ? [] : (stryCov_9fa48("28718"), ['Vendor anomalies', 'Code integrity failures', 'Unexpected dependencies', 'Certificate issues']),
    countermeasures: stryMutAct_9fa48("28723") ? [] : (stryCov_9fa48("28723"), ['SBOM verification', 'Vendor security assessments', 'Code signing enforcement', 'Continuous monitoring']),
    lastUpdated: new Date(stryMutAct_9fa48("28728") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("28728"), Date.now() - (stryMutAct_9fa48("28729") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("28729"), (stryMutAct_9fa48("28730") ? 24 * 60 / 60 : (stryCov_9fa48("28730"), (stryMutAct_9fa48("28731") ? 24 / 60 : (stryCov_9fa48("28731"), 24 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("28732") ? {} : (stryCov_9fa48("28732"), {
    id: 'threat-003',
    name: 'Disinformation Campaign',
    category: 'information',
    adversary: 'State-Sponsored Media',
    probability: 0.88,
    impact: 'significant',
    timeframe: 'Ongoing',
    indicators: stryMutAct_9fa48("28739") ? [] : (stryCov_9fa48("28739"), ['Coordinated social media activity', 'Bot network activation', 'Narrative amplification', 'Deep fake content']),
    countermeasures: stryMutAct_9fa48("28744") ? [] : (stryCov_9fa48("28744"), ['Media monitoring', 'Attribution analysis', 'Counter-narrative development', 'Public awareness']),
    lastUpdated: new Date(stryMutAct_9fa48("28749") ? Date.now() + 2 * 60 * 60 * 1000 : (stryCov_9fa48("28749"), Date.now() - (stryMutAct_9fa48("28750") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("28750"), (stryMutAct_9fa48("28751") ? 2 * 60 / 60 : (stryCov_9fa48("28751"), (stryMutAct_9fa48("28752") ? 2 / 60 : (stryCov_9fa48("28752"), 2 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("28753") ? {} : (stryCov_9fa48("28753"), {
    id: 'threat-004',
    name: 'Critical Infrastructure Attack',
    category: 'kinetic',
    adversary: 'Terrorist Organization',
    probability: 0.15,
    impact: 'catastrophic',
    timeframe: 'Unknown',
    indicators: stryMutAct_9fa48("28760") ? [] : (stryCov_9fa48("28760"), ['Surveillance activity', 'Insider threat signals', 'Physical security anomalies']),
    countermeasures: stryMutAct_9fa48("28764") ? [] : (stryCov_9fa48("28764"), ['Physical security hardening', 'Personnel vetting', 'Redundancy planning', 'Rapid response teams']),
    lastUpdated: new Date(stryMutAct_9fa48("28769") ? Date.now() + 48 * 60 * 60 * 1000 : (stryCov_9fa48("28769"), Date.now() - (stryMutAct_9fa48("28770") ? 48 * 60 * 60 / 1000 : (stryCov_9fa48("28770"), (stryMutAct_9fa48("28771") ? 48 * 60 / 60 : (stryCov_9fa48("28771"), (stryMutAct_9fa48("28772") ? 48 / 60 : (stryCov_9fa48("28772"), 48 * 60)) * 60)) * 1000))))
  })]);
  return generateThreatScenarios;
})());
const generateWarGames = stryMutAct_9fa48("28773") ? () => undefined : (stryCov_9fa48("28773"), (() => {
  const generateWarGames = (): WarGame[] => stryMutAct_9fa48("28774") ? [] : (stryCov_9fa48("28774"), [stryMutAct_9fa48("28775") ? {} : (stryCov_9fa48("28775"), {
    id: 'wg-001',
    name: 'Operation CYBER SHIELD',
    scenario: 'Nation-state cyber attack on critical infrastructure',
    status: 'active',
    redTeam: stryMutAct_9fa48("28780") ? {} : (stryCov_9fa48("28780"), {
      agents: 8,
      objectives: stryMutAct_9fa48("28781") ? [] : (stryCov_9fa48("28781"), ['Establish persistence', 'Exfiltrate data', 'Disrupt operations']),
      successRate: 34
    }),
    blueTeam: stryMutAct_9fa48("28785") ? {} : (stryCov_9fa48("28785"), {
      agents: 12,
      objectives: stryMutAct_9fa48("28786") ? [] : (stryCov_9fa48("28786"), ['Detect intrusion', 'Contain threat', 'Preserve evidence', 'Restore operations']),
      successRate: 66
    }),
    iterations: 1247,
    insights: stryMutAct_9fa48("28791") ? [] : (stryCov_9fa48("28791"), ['Initial access via compromised vendor credentials', 'Lateral movement through legacy systems', 'Detection gap in OT network monitoring']),
    startDate: new Date(stryMutAct_9fa48("28795") ? Date.now() + 7 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("28795"), Date.now() - (stryMutAct_9fa48("28796") ? 7 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("28796"), (stryMutAct_9fa48("28797") ? 7 * 24 * 60 / 60 : (stryCov_9fa48("28797"), (stryMutAct_9fa48("28798") ? 7 * 24 / 60 : (stryCov_9fa48("28798"), (stryMutAct_9fa48("28799") ? 7 / 24 : (stryCov_9fa48("28799"), 7 * 24)) * 60)) * 60)) * 1000)))),
    classification: 'secret'
  }), stryMutAct_9fa48("28801") ? {} : (stryCov_9fa48("28801"), {
    id: 'wg-002',
    name: 'Operation SWIFT RESPONSE',
    scenario: 'Multi-domain conflict escalation',
    status: 'complete',
    redTeam: stryMutAct_9fa48("28806") ? {} : (stryCov_9fa48("28806"), {
      agents: 15,
      objectives: stryMutAct_9fa48("28807") ? [] : (stryCov_9fa48("28807"), ['Achieve air superiority', 'Disrupt logistics', 'Information dominance']),
      successRate: 42
    }),
    blueTeam: stryMutAct_9fa48("28811") ? {} : (stryCov_9fa48("28811"), {
      agents: 20,
      objectives: stryMutAct_9fa48("28812") ? [] : (stryCov_9fa48("28812"), ['Maintain deterrence', 'Coalition coordination', 'Escalation management']),
      successRate: 58
    }),
    iterations: 5000,
    insights: stryMutAct_9fa48("28816") ? [] : (stryCov_9fa48("28816"), ['Space domain critical for C2', 'Supply chain resilience essential', 'Allied interoperability gaps identified']),
    startDate: new Date(stryMutAct_9fa48("28820") ? Date.now() + 30 * 24 * 60 * 60 * 1000 : (stryCov_9fa48("28820"), Date.now() - (stryMutAct_9fa48("28821") ? 30 * 24 * 60 * 60 / 1000 : (stryCov_9fa48("28821"), (stryMutAct_9fa48("28822") ? 30 * 24 * 60 / 60 : (stryCov_9fa48("28822"), (stryMutAct_9fa48("28823") ? 30 * 24 / 60 : (stryCov_9fa48("28823"), (stryMutAct_9fa48("28824") ? 30 / 24 : (stryCov_9fa48("28824"), 30 * 24)) * 60)) * 60)) * 1000)))),
    classification: 'top-secret'
  })]);
  return generateWarGames;
})());
const generateClassifiedDocs = stryMutAct_9fa48("28826") ? () => undefined : (stryCov_9fa48("28826"), (() => {
  const generateClassifiedDocs = (): ClassifiedDocument[] => stryMutAct_9fa48("28827") ? [] : (stryCov_9fa48("28827"), [stryMutAct_9fa48("28828") ? {} : (stryCov_9fa48("28828"), {
    id: 'doc-001',
    title: 'National Defense Strategy Implementation Plan',
    classification: 'secret',
    compartments: stryMutAct_9fa48("28832") ? [] : (stryCov_9fa48("28832"), ['NOFORN']),
    dateClassified: new Date('2024-01-15'),
    originatingAgency: 'DoD',
    status: 'available',
    pageCount: 847,
    extractedEntities: 12453
  }), stryMutAct_9fa48("28837") ? {} : (stryCov_9fa48("28837"), {
    id: 'doc-002',
    title: 'Threat Assessment - Indo-Pacific Region',
    classification: 'top-secret',
    compartments: stryMutAct_9fa48("28841") ? [] : (stryCov_9fa48("28841"), ['SI', 'TK']),
    dateClassified: new Date('2024-06-22'),
    originatingAgency: 'DIA',
    status: 'available',
    pageCount: 234,
    extractedEntities: 5621
  }), stryMutAct_9fa48("28847") ? {} : (stryCov_9fa48("28847"), {
    id: 'doc-003',
    title: 'Cyber Operations Framework',
    classification: 'sci',
    compartments: stryMutAct_9fa48("28851") ? [] : (stryCov_9fa48("28851"), ['GAMMA', 'HCS']),
    dateClassified: new Date('2024-08-10'),
    originatingAgency: 'NSA',
    status: 'processing',
    pageCount: 156,
    extractedEntities: 0
  })]);
  return generateClassifiedDocs;
})());
const generateDeploymentNodes = stryMutAct_9fa48("28857") ? () => undefined : (stryCov_9fa48("28857"), (() => {
  const generateDeploymentNodes = (): DeploymentNode[] => stryMutAct_9fa48("28858") ? [] : (stryCov_9fa48("28858"), [stryMutAct_9fa48("28859") ? {} : (stryCov_9fa48("28859"), {
    id: 'node-001',
    name: 'Pentagon SCIF',
    location: 'Arlington, VA',
    mode: 'air-gapped',
    classification: 'top-secret',
    status: 'online',
    lastSync: new Date(stryMutAct_9fa48("28866") ? Date.now() + 15 * 60 * 1000 : (stryCov_9fa48("28866"), Date.now() - (stryMutAct_9fa48("28867") ? 15 * 60 / 1000 : (stryCov_9fa48("28867"), (stryMutAct_9fa48("28868") ? 15 / 60 : (stryCov_9fa48("28868"), 15 * 60)) * 1000)))),
    agents: 24,
    throughput: 1250
  }), stryMutAct_9fa48("28869") ? {} : (stryCov_9fa48("28869"), {
    id: 'node-002',
    name: 'EUCOM Forward',
    location: 'Stuttgart, Germany',
    mode: 'classified-network',
    classification: 'secret',
    status: 'online',
    lastSync: new Date(stryMutAct_9fa48("28876") ? Date.now() + 5 * 60 * 1000 : (stryCov_9fa48("28876"), Date.now() - (stryMutAct_9fa48("28877") ? 5 * 60 / 1000 : (stryCov_9fa48("28877"), (stryMutAct_9fa48("28878") ? 5 / 60 : (stryCov_9fa48("28878"), 5 * 60)) * 1000)))),
    agents: 18,
    throughput: 890
  }), stryMutAct_9fa48("28879") ? {} : (stryCov_9fa48("28879"), {
    id: 'node-003',
    name: 'INDOPACOM Hub',
    location: 'Hawaii',
    mode: 'classified-network',
    classification: 'secret',
    status: 'online',
    lastSync: new Date(stryMutAct_9fa48("28886") ? Date.now() + 8 * 60 * 1000 : (stryCov_9fa48("28886"), Date.now() - (stryMutAct_9fa48("28887") ? 8 * 60 / 1000 : (stryCov_9fa48("28887"), (stryMutAct_9fa48("28888") ? 8 / 60 : (stryCov_9fa48("28888"), 8 * 60)) * 1000)))),
    agents: 32,
    throughput: 2100
  }), stryMutAct_9fa48("28889") ? {} : (stryCov_9fa48("28889"), {
    id: 'node-004',
    name: 'IC Fusion Center',
    location: 'McLean, VA',
    mode: 'air-gapped',
    classification: 'sci',
    status: 'online',
    lastSync: new Date(stryMutAct_9fa48("28896") ? Date.now() + 30 * 60 * 1000 : (stryCov_9fa48("28896"), Date.now() - (stryMutAct_9fa48("28897") ? 30 * 60 / 1000 : (stryCov_9fa48("28897"), (stryMutAct_9fa48("28898") ? 30 / 60 : (stryCov_9fa48("28898"), 30 * 60)) * 1000)))),
    agents: 48,
    throughput: 3400
  })]);
  return generateDeploymentNodes;
})());
const generateAuditEvents = stryMutAct_9fa48("28899") ? () => undefined : (stryCov_9fa48("28899"), (() => {
  const generateAuditEvents = (): AuditEvent[] => stryMutAct_9fa48("28900") ? [] : (stryCov_9fa48("28900"), [stryMutAct_9fa48("28901") ? {} : (stryCov_9fa48("28901"), {
    id: 'audit-001',
    timestamp: new Date(stryMutAct_9fa48("28903") ? Date.now() + 5 * 60 * 1000 : (stryCov_9fa48("28903"), Date.now() - (stryMutAct_9fa48("28904") ? 5 * 60 / 1000 : (stryCov_9fa48("28904"), (stryMutAct_9fa48("28905") ? 5 / 60 : (stryCov_9fa48("28905"), 5 * 60)) * 1000)))),
    actor: 'ADM.JOHNSON',
    action: 'DOCUMENT_ACCESS',
    resource: 'doc-002',
    classification: 'top-secret',
    outcome: 'success',
    ipAddress: '10.0.45.123',
    sessionId: 'sess-847291',
    verified: stryMutAct_9fa48("28913") ? false : (stryCov_9fa48("28913"), true)
  }), stryMutAct_9fa48("28914") ? {} : (stryCov_9fa48("28914"), {
    id: 'audit-002',
    timestamp: new Date(stryMutAct_9fa48("28916") ? Date.now() + 12 * 60 * 1000 : (stryCov_9fa48("28916"), Date.now() - (stryMutAct_9fa48("28917") ? 12 * 60 / 1000 : (stryCov_9fa48("28917"), (stryMutAct_9fa48("28918") ? 12 / 60 : (stryCov_9fa48("28918"), 12 * 60)) * 1000)))),
    actor: 'COL.MARTINEZ',
    action: 'WARGAME_EXECUTE',
    resource: 'wg-001',
    classification: 'secret',
    outcome: 'success',
    ipAddress: '10.0.32.89',
    sessionId: 'sess-847234',
    verified: stryMutAct_9fa48("28926") ? false : (stryCov_9fa48("28926"), true)
  }), stryMutAct_9fa48("28927") ? {} : (stryCov_9fa48("28927"), {
    id: 'audit-003',
    timestamp: new Date(stryMutAct_9fa48("28929") ? Date.now() + 18 * 60 * 1000 : (stryCov_9fa48("28929"), Date.now() - (stryMutAct_9fa48("28930") ? 18 * 60 / 1000 : (stryCov_9fa48("28930"), (stryMutAct_9fa48("28931") ? 18 / 60 : (stryCov_9fa48("28931"), 18 * 60)) * 1000)))),
    actor: 'SYSTEM',
    action: 'THREAT_ANALYSIS',
    resource: 'threat-001',
    classification: 'secret',
    outcome: 'success',
    ipAddress: '10.0.1.1',
    sessionId: 'sys-auto',
    verified: stryMutAct_9fa48("28939") ? false : (stryCov_9fa48("28939"), true)
  }), stryMutAct_9fa48("28940") ? {} : (stryCov_9fa48("28940"), {
    id: 'audit-004',
    timestamp: new Date(stryMutAct_9fa48("28942") ? Date.now() + 25 * 60 * 1000 : (stryCov_9fa48("28942"), Date.now() - (stryMutAct_9fa48("28943") ? 25 * 60 / 1000 : (stryCov_9fa48("28943"), (stryMutAct_9fa48("28944") ? 25 / 60 : (stryCov_9fa48("28944"), 25 * 60)) * 1000)))),
    actor: 'LT.CHEN',
    action: 'DOCUMENT_ACCESS',
    resource: 'doc-003',
    classification: 'sci',
    outcome: 'denied',
    ipAddress: '10.0.67.45',
    sessionId: 'sess-847198',
    verified: stryMutAct_9fa48("28952") ? false : (stryCov_9fa48("28952"), true)
  })]);
  return generateAuditEvents;
})());

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const DefenseStackPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'overview' | 'threats' | 'wargames' | 'documents' | 'deployment' | 'audit'>('overview');
  const [securityPosture] = useState<SecurityPosture>(generateSecurityPosture);
  const [threatScenarios] = useState<ThreatScenario[]>(generateThreatScenarios);
  const [warGames] = useState<WarGame[]>(generateWarGames);
  const [classifiedDocs] = useState<ClassifiedDocument[]>(generateClassifiedDocs);
  const [deploymentNodes] = useState<DeploymentNode[]>(generateDeploymentNodes);
  const [auditEvents] = useState<AuditEvent[]>(generateAuditEvents);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("28955") ? false : (stryCov_9fa48("28955"), true));

  // Fetch real data from API
  useEffect(() => {
    const fetchDefenseData = async () => {
      try {
        const [preMortemRes, regulatoryRes] = await Promise.all(stryMutAct_9fa48("28959") ? [] : (stryCov_9fa48("28959"), [decisionIntelApi.getPreMortemAnalyses(), decisionIntelApi.getRegulatoryItems()]));
        if (stryMutAct_9fa48("28962") ? preMortemRes.success || preMortemRes.data : stryMutAct_9fa48("28961") ? false : stryMutAct_9fa48("28960") ? true : (stryCov_9fa48("28960", "28961", "28962"), preMortemRes.success && preMortemRes.data)) {
          console.log('[DefenseStack] Loaded', preMortemRes.data.length, 'risk analyses');
        }
        if (stryMutAct_9fa48("28968") ? regulatoryRes.success || regulatoryRes.data : stryMutAct_9fa48("28967") ? false : stryMutAct_9fa48("28966") ? true : (stryCov_9fa48("28966", "28967", "28968"), regulatoryRes.success && regulatoryRes.data)) {
          console.log('[DefenseStack] Loaded', regulatoryRes.data.length, 'regulatory items');
        }
      } catch (error) {
        console.log('[DefenseStack] Using local generators (API unavailable)');
      } finally {
        setIsLoading(stryMutAct_9fa48("28975") ? true : (stryCov_9fa48("28975"), false));
      }
    };
    fetchDefenseData();
  }, stryMutAct_9fa48("28976") ? ["Stryker was here"] : (stryCov_9fa48("28976"), []));
  const activeThreats = stryMutAct_9fa48("28977") ? threatScenarios : (stryCov_9fa48("28977"), threatScenarios.filter(stryMutAct_9fa48("28978") ? () => undefined : (stryCov_9fa48("28978"), t => stryMutAct_9fa48("28982") ? t.probability <= 0.5 : stryMutAct_9fa48("28981") ? t.probability >= 0.5 : stryMutAct_9fa48("28980") ? false : stryMutAct_9fa48("28979") ? true : (stryCov_9fa48("28979", "28980", "28981", "28982"), t.probability > 0.5))));
  return <div className="min-h-screen bg-gradient-to-br from-slate-950 via-neutral-950 to-slate-950 text-white">
      {/* Classification Banner */}
      <div className="bg-red-800 text-white text-center py-1 text-xs font-bold tracking-wider">
        TOP SECRET // NOFORN // DEMONSTRATION SYSTEM - NOT FOR OPERATIONAL USE
      </div>

      {/* Header */}
      <header className="border-b border-slate-700/50 bg-black/40 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={stryMutAct_9fa48("28983") ? () => undefined : (stryCov_9fa48("28983"), () => navigate('/cortex/dashboard'))} className="text-white/60 hover:text-white transition-colors">
                ← Back
              </button>
              <div>
                <h1 className="text-2xl font-bold flex items-center gap-3">
                  <span className="text-3xl">🛡️</span>
                  CendiaDefenseStack™
                  <span className="text-xs bg-gradient-to-r from-red-600 to-orange-600 px-2 py-0.5 rounded-full font-medium">
                    DEFENSE
                  </span>
                </h1>
                <p className="text-slate-400 text-sm">Government/Defense Edition • Air-Gapped • Zero Trust</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {stryMutAct_9fa48("28985") ? securityPosture.certifications.map(cert => <span key={cert} className="px-2 py-1 bg-green-900/30 border border-green-600/30 rounded text-xs text-green-400">
                  ✓ {cert}
                </span>) : (stryCov_9fa48("28985"), securityPosture.certifications.slice(0, 3).map(stryMutAct_9fa48("28986") ? () => undefined : (stryCov_9fa48("28986"), cert => <span key={cert} className="px-2 py-1 bg-green-900/30 border border-green-600/30 rounded text-xs text-green-400">
                  ✓ {cert}
                </span>)))}
              <div className="text-right">
                <div className="text-sm text-white/60">Security Score</div>
                <div className="text-xl font-bold text-green-400">{securityPosture.overallScore}%</div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Metrics Bar */}
      <div className="bg-gradient-to-r from-slate-900/50 to-neutral-900/50 border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="grid grid-cols-8 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-green-400">{securityPosture.zeroTrustCompliance}%</div>
              <div className="text-xs text-slate-400">Zero Trust</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-cyan-400">{securityPosture.encryptionCoverage}%</div>
              <div className="text-xs text-slate-400">Encryption</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-amber-400">{activeThreats.length}</div>
              <div className="text-xs text-slate-400">Active Threats</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-purple-400">{stryMutAct_9fa48("28987") ? warGames.length : (stryCov_9fa48("28987"), warGames.filter(stryMutAct_9fa48("28988") ? () => undefined : (stryCov_9fa48("28988"), w => stryMutAct_9fa48("28991") ? w.status !== 'active' : stryMutAct_9fa48("28990") ? false : stryMutAct_9fa48("28989") ? true : (stryCov_9fa48("28989", "28990", "28991"), w.status === 'active'))).length)}</div>
              <div className="text-xs text-slate-400">Active Wargames</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-blue-400">{stryMutAct_9fa48("28993") ? deploymentNodes.length : (stryCov_9fa48("28993"), deploymentNodes.filter(stryMutAct_9fa48("28994") ? () => undefined : (stryCov_9fa48("28994"), n => stryMutAct_9fa48("28997") ? n.status !== 'online' : stryMutAct_9fa48("28996") ? false : stryMutAct_9fa48("28995") ? true : (stryCov_9fa48("28995", "28996", "28997"), n.status === 'online'))).length)}</div>
              <div className="text-xs text-slate-400">Nodes Online</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-red-400">{securityPosture.vulnerabilities.critical}</div>
              <div className="text-xs text-slate-400">Critical Vulns</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-300">{classifiedDocs.length}</div>
              <div className="text-xs text-slate-400">Classified Docs</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-emerald-400">{securityPosture.auditCompleteness}%</div>
              <div className="text-xs text-slate-400">Audit Coverage</div>
            </div>
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-slate-800/50 bg-black/20">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-1">
            {(stryMutAct_9fa48("28999") ? [] : (stryCov_9fa48("28999"), [stryMutAct_9fa48("29000") ? {} : (stryCov_9fa48("29000"), {
            id: 'overview',
            label: 'Command Center',
            icon: '🎖️'
          }), stryMutAct_9fa48("29004") ? {} : (stryCov_9fa48("29004"), {
            id: 'threats',
            label: 'Threat Analysis',
            icon: '⚠️'
          }), stryMutAct_9fa48("29008") ? {} : (stryCov_9fa48("29008"), {
            id: 'wargames',
            label: 'Wargaming',
            icon: '♟️'
          }), stryMutAct_9fa48("29012") ? {} : (stryCov_9fa48("29012"), {
            id: 'documents',
            label: 'Classified Intel',
            icon: '📁'
          }), stryMutAct_9fa48("29016") ? {} : (stryCov_9fa48("29016"), {
            id: 'deployment',
            label: 'Deployment',
            icon: '🌐'
          }), stryMutAct_9fa48("29020") ? {} : (stryCov_9fa48("29020"), {
            id: 'audit',
            label: 'Audit Log',
            icon: '📋'
          })])).map(stryMutAct_9fa48("29024") ? () => undefined : (stryCov_9fa48("29024"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("29025") ? () => undefined : (stryCov_9fa48("29025"), () => setActiveTab(tab.id as any))} className={`px-4 py-3 text-sm font-medium transition-colors border-b-2 ${(stryMutAct_9fa48("29029") ? activeTab !== tab.id : stryMutAct_9fa48("29028") ? false : stryMutAct_9fa48("29027") ? true : (stryCov_9fa48("29027", "29028", "29029"), activeTab === tab.id)) ? 'border-red-500 text-white bg-red-900/20' : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'}`}>
                {tab.icon} {tab.label}
              </button>))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-6">
        {stryMutAct_9fa48("29034") ? activeTab === 'overview' || <div className="space-y-6">
            {/* Active Threats Alert */}
            {activeThreats.length > 0 && <div className="bg-red-900/20 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Active Threat Indicators
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {activeThreats.map(threat => <div key={threat.id} className="p-4 bg-red-900/30 rounded-xl border border-red-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{threat.name}</span>
                        <span className="text-xl font-bold text-red-400">{(threat.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{threat.adversary} • {threat.timeframe}</div>
                      <div className={`inline-block px-2 py-0.5 rounded text-xs ${threat.impact === 'catastrophic' ? 'bg-red-600' : threat.impact === 'critical' ? 'bg-orange-600' : 'bg-amber-600'}`}>{threat.impact.toUpperCase()} IMPACT</div>
                    </div>)}
                </div>
              </div>}

            {/* Security Posture */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Zero Trust Compliance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Identity Verification</span>
                      <span className="font-bold text-green-400">100%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{
                    width: '100%'
                  }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Device Trust</span>
                      <span className="font-bold text-green-400">98%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{
                    width: '98%'
                  }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Segmentation</span>
                      <span className="font-bold text-green-400">96%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{
                    width: '96%'
                  }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Continuous Monitoring</span>
                      <span className="font-bold text-green-400">99%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{
                    width: '99%'
                  }} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Vulnerability Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-red-400">{securityPosture.vulnerabilities.critical}</div>
                    <div className="text-xs text-white/50">Critical</div>
                  </div>
                  <div className="text-center p-4 bg-orange-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-orange-400">{securityPosture.vulnerabilities.high}</div>
                    <div className="text-xs text-white/50">High</div>
                  </div>
                  <div className="text-center p-4 bg-amber-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-amber-400">{securityPosture.vulnerabilities.medium}</div>
                    <div className="text-xs text-white/50">Medium</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-blue-400">{securityPosture.vulnerabilities.low}</div>
                    <div className="text-xs text-white/50">Low</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="space-y-2">
                  {securityPosture.certifications.map(cert => <div key={cert} className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                      <span className="font-medium">{cert}</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>)}
                </div>
              </div>
            </div>

            {/* Deployment Status */}
            <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Global Deployment Status</h3>
              <div className="grid grid-cols-4 gap-4">
                {deploymentNodes.map(node => {
              const classConfig = CLASSIFICATION_CONFIG[node.classification];
              return <div key={node.id} className="p-4 bg-black/20 rounded-xl border border-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{node.name}</span>
                        <span className={`w-3 h-3 rounded-full ${node.status === 'online' ? 'bg-green-400' : node.status === 'offline' ? 'bg-red-400' : 'bg-amber-400'}`} />
                      </div>
                      <div className="text-sm text-white/50 mb-2">{node.location}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                          {classConfig.label}
                        </span>
                        <span className="text-xs text-white/40">{node.mode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/40">Agents:</span>
                          <span className="ml-1 font-medium">{node.agents}</span>
                        </div>
                        <div>
                          <span className="text-white/40">TPS:</span>
                          <span className="ml-1 font-medium">{node.throughput}</span>
                        </div>
                      </div>
                    </div>;
            })}
              </div>
            </div>
          </div> : stryMutAct_9fa48("29033") ? false : stryMutAct_9fa48("29032") ? true : (stryCov_9fa48("29032", "29033", "29034"), (stryMutAct_9fa48("29036") ? activeTab !== 'overview' : stryMutAct_9fa48("29035") ? true : (stryCov_9fa48("29035", "29036"), activeTab === 'overview')) && <div className="space-y-6">
            {/* Active Threats Alert */}
            {stryMutAct_9fa48("29040") ? activeThreats.length > 0 || <div className="bg-red-900/20 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Active Threat Indicators
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {activeThreats.map(threat => <div key={threat.id} className="p-4 bg-red-900/30 rounded-xl border border-red-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{threat.name}</span>
                        <span className="text-xl font-bold text-red-400">{(threat.probability * 100).toFixed(0)}%</span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{threat.adversary} • {threat.timeframe}</div>
                      <div className={`inline-block px-2 py-0.5 rounded text-xs ${threat.impact === 'catastrophic' ? 'bg-red-600' : threat.impact === 'critical' ? 'bg-orange-600' : 'bg-amber-600'}`}>{threat.impact.toUpperCase()} IMPACT</div>
                    </div>)}
                </div>
              </div> : stryMutAct_9fa48("29039") ? false : stryMutAct_9fa48("29038") ? true : (stryCov_9fa48("29038", "29039", "29040"), (stryMutAct_9fa48("29043") ? activeThreats.length <= 0 : stryMutAct_9fa48("29042") ? activeThreats.length >= 0 : stryMutAct_9fa48("29041") ? true : (stryCov_9fa48("29041", "29042", "29043"), activeThreats.length > 0)) && <div className="bg-red-900/20 rounded-2xl p-6 border border-red-700/50">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <span className="text-red-400">🚨</span> Active Threat Indicators
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {activeThreats.map(stryMutAct_9fa48("29044") ? () => undefined : (stryCov_9fa48("29044"), threat => <div key={threat.id} className="p-4 bg-red-900/30 rounded-xl border border-red-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{threat.name}</span>
                        <span className="text-xl font-bold text-red-400">{(stryMutAct_9fa48("29045") ? threat.probability / 100 : (stryCov_9fa48("29045"), threat.probability * 100)).toFixed(0)}%</span>
                      </div>
                      <div className="text-sm text-white/60 mb-2">{threat.adversary} • {threat.timeframe}</div>
                      <div className={`inline-block px-2 py-0.5 rounded text-xs ${(stryMutAct_9fa48("29049") ? threat.impact !== 'catastrophic' : stryMutAct_9fa48("29048") ? false : stryMutAct_9fa48("29047") ? true : (stryCov_9fa48("29047", "29048", "29049"), threat.impact === 'catastrophic')) ? 'bg-red-600' : (stryMutAct_9fa48("29054") ? threat.impact !== 'critical' : stryMutAct_9fa48("29053") ? false : stryMutAct_9fa48("29052") ? true : (stryCov_9fa48("29052", "29053", "29054"), threat.impact === 'critical')) ? 'bg-orange-600' : 'bg-amber-600'}`}>{stryMutAct_9fa48("29058") ? threat.impact.toLowerCase() : (stryCov_9fa48("29058"), threat.impact.toUpperCase())} IMPACT</div>
                    </div>))}
                </div>
              </div>)}

            {/* Security Posture */}
            <div className="grid grid-cols-3 gap-6">
              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Zero Trust Compliance</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Identity Verification</span>
                      <span className="font-bold text-green-400">100%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={stryMutAct_9fa48("29059") ? {} : (stryCov_9fa48("29059"), {
                    width: '100%'
                  })} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Device Trust</span>
                      <span className="font-bold text-green-400">98%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={stryMutAct_9fa48("29061") ? {} : (stryCov_9fa48("29061"), {
                    width: '98%'
                  })} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Network Segmentation</span>
                      <span className="font-bold text-green-400">96%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={stryMutAct_9fa48("29063") ? {} : (stryCov_9fa48("29063"), {
                    width: '96%'
                  })} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Continuous Monitoring</span>
                      <span className="font-bold text-green-400">99%</span>
                    </div>
                    <div className="h-2 bg-black/30 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={stryMutAct_9fa48("29065") ? {} : (stryCov_9fa48("29065"), {
                    width: '99%'
                  })} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Vulnerability Status</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-red-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-red-400">{securityPosture.vulnerabilities.critical}</div>
                    <div className="text-xs text-white/50">Critical</div>
                  </div>
                  <div className="text-center p-4 bg-orange-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-orange-400">{securityPosture.vulnerabilities.high}</div>
                    <div className="text-xs text-white/50">High</div>
                  </div>
                  <div className="text-center p-4 bg-amber-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-amber-400">{securityPosture.vulnerabilities.medium}</div>
                    <div className="text-xs text-white/50">Medium</div>
                  </div>
                  <div className="text-center p-4 bg-blue-900/20 rounded-xl">
                    <div className="text-3xl font-bold text-blue-400">{securityPosture.vulnerabilities.low}</div>
                    <div className="text-xs text-white/50">Low</div>
                  </div>
                </div>
              </div>

              <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                <h3 className="text-lg font-semibold mb-4">Certifications</h3>
                <div className="space-y-2">
                  {securityPosture.certifications.map(stryMutAct_9fa48("29067") ? () => undefined : (stryCov_9fa48("29067"), cert => <div key={cert} className="flex items-center justify-between p-3 bg-green-900/20 rounded-lg border border-green-700/30">
                      <span className="font-medium">{cert}</span>
                      <span className="text-green-400">✓ Active</span>
                    </div>))}
                </div>
              </div>
            </div>

            {/* Deployment Status */}
            <div className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
              <h3 className="text-lg font-semibold mb-4">Global Deployment Status</h3>
              <div className="grid grid-cols-4 gap-4">
                {deploymentNodes.map(node => {
              const classConfig = CLASSIFICATION_CONFIG[node.classification];
              return <div key={node.id} className="p-4 bg-black/20 rounded-xl border border-slate-700/30">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium">{node.name}</span>
                        <span className={`w-3 h-3 rounded-full ${(stryMutAct_9fa48("29072") ? node.status !== 'online' : stryMutAct_9fa48("29071") ? false : stryMutAct_9fa48("29070") ? true : (stryCov_9fa48("29070", "29071", "29072"), node.status === 'online')) ? 'bg-green-400' : (stryMutAct_9fa48("29077") ? node.status !== 'offline' : stryMutAct_9fa48("29076") ? false : stryMutAct_9fa48("29075") ? true : (stryCov_9fa48("29075", "29076", "29077"), node.status === 'offline')) ? 'bg-red-400' : 'bg-amber-400'}`} />
                      </div>
                      <div className="text-sm text-white/50 mb-2">{node.location}</div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                          {classConfig.label}
                        </span>
                        <span className="text-xs text-white/40">{node.mode}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>
                          <span className="text-white/40">Agents:</span>
                          <span className="ml-1 font-medium">{node.agents}</span>
                        </div>
                        <div>
                          <span className="text-white/40">TPS:</span>
                          <span className="ml-1 font-medium">{node.throughput}</span>
                        </div>
                      </div>
                    </div>;
            })}
              </div>
            </div>
          </div>)}

        {stryMutAct_9fa48("29084") ? activeTab === 'threats' || <div className="space-y-4">
            {threatScenarios.map(threat => <div key={threat.id} className={`bg-black/30 rounded-2xl p-6 border ${threat.probability > 0.7 ? 'border-red-700/50' : threat.probability > 0.4 ? 'border-amber-700/50' : 'border-slate-700/50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{threat.name}</h3>
                    <div className="text-sm text-white/50">{threat.adversary} • {threat.category}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${threat.probability > 0.7 ? 'text-red-400' : threat.probability > 0.4 ? 'text-amber-400' : 'text-green-400'}`}>{(threat.probability * 100).toFixed(0)}%</div>
                    <div className="text-xs text-white/50">Probability</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Indicators</h4>
                    <ul className="space-y-1">
                      {threat.indicators.map((ind, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-red-400">•</span> {ind}
                        </li>)}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Countermeasures</h4>
                    <ul className="space-y-1">
                      {threat.countermeasures.map((cm, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-green-400">→</span> {cm}
                        </li>)}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
                  <span className={`px-3 py-1 rounded text-sm ${threat.impact === 'catastrophic' ? 'bg-red-600' : threat.impact === 'critical' ? 'bg-orange-600' : threat.impact === 'significant' ? 'bg-amber-600' : 'bg-blue-600'}`}>{threat.impact.toUpperCase()} IMPACT</span>
                  <span className="text-sm text-white/40">
                    Timeframe: {threat.timeframe} • Updated: {Math.floor((Date.now() - threat.lastUpdated.getTime()) / 3600000)}h ago
                  </span>
                </div>
              </div>)}
          </div> : stryMutAct_9fa48("29083") ? false : stryMutAct_9fa48("29082") ? true : (stryCov_9fa48("29082", "29083", "29084"), (stryMutAct_9fa48("29086") ? activeTab !== 'threats' : stryMutAct_9fa48("29085") ? true : (stryCov_9fa48("29085", "29086"), activeTab === 'threats')) && <div className="space-y-4">
            {threatScenarios.map(stryMutAct_9fa48("29088") ? () => undefined : (stryCov_9fa48("29088"), threat => <div key={threat.id} className={`bg-black/30 rounded-2xl p-6 border ${(stryMutAct_9fa48("29093") ? threat.probability <= 0.7 : stryMutAct_9fa48("29092") ? threat.probability >= 0.7 : stryMutAct_9fa48("29091") ? false : stryMutAct_9fa48("29090") ? true : (stryCov_9fa48("29090", "29091", "29092", "29093"), threat.probability > 0.7)) ? 'border-red-700/50' : (stryMutAct_9fa48("29098") ? threat.probability <= 0.4 : stryMutAct_9fa48("29097") ? threat.probability >= 0.4 : stryMutAct_9fa48("29096") ? false : stryMutAct_9fa48("29095") ? true : (stryCov_9fa48("29095", "29096", "29097", "29098"), threat.probability > 0.4)) ? 'border-amber-700/50' : 'border-slate-700/50'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{threat.name}</h3>
                    <div className="text-sm text-white/50">{threat.adversary} • {threat.category}</div>
                  </div>
                  <div className="text-right">
                    <div className={`text-3xl font-bold ${(stryMutAct_9fa48("29105") ? threat.probability <= 0.7 : stryMutAct_9fa48("29104") ? threat.probability >= 0.7 : stryMutAct_9fa48("29103") ? false : stryMutAct_9fa48("29102") ? true : (stryCov_9fa48("29102", "29103", "29104", "29105"), threat.probability > 0.7)) ? 'text-red-400' : (stryMutAct_9fa48("29110") ? threat.probability <= 0.4 : stryMutAct_9fa48("29109") ? threat.probability >= 0.4 : stryMutAct_9fa48("29108") ? false : stryMutAct_9fa48("29107") ? true : (stryCov_9fa48("29107", "29108", "29109", "29110"), threat.probability > 0.4)) ? 'text-amber-400' : 'text-green-400'}`}>{(stryMutAct_9fa48("29113") ? threat.probability / 100 : (stryCov_9fa48("29113"), threat.probability * 100)).toFixed(0)}%</div>
                    <div className="text-xs text-white/50">Probability</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Indicators</h4>
                    <ul className="space-y-1">
                      {threat.indicators.map(stryMutAct_9fa48("29114") ? () => undefined : (stryCov_9fa48("29114"), (ind, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-red-400">•</span> {ind}
                        </li>))}
                    </ul>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Countermeasures</h4>
                    <ul className="space-y-1">
                      {threat.countermeasures.map(stryMutAct_9fa48("29115") ? () => undefined : (stryCov_9fa48("29115"), (cm, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-green-400">→</span> {cm}
                        </li>))}
                    </ul>
                  </div>
                </div>

                <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30">
                  <span className={`px-3 py-1 rounded text-sm ${(stryMutAct_9fa48("29119") ? threat.impact !== 'catastrophic' : stryMutAct_9fa48("29118") ? false : stryMutAct_9fa48("29117") ? true : (stryCov_9fa48("29117", "29118", "29119"), threat.impact === 'catastrophic')) ? 'bg-red-600' : (stryMutAct_9fa48("29124") ? threat.impact !== 'critical' : stryMutAct_9fa48("29123") ? false : stryMutAct_9fa48("29122") ? true : (stryCov_9fa48("29122", "29123", "29124"), threat.impact === 'critical')) ? 'bg-orange-600' : (stryMutAct_9fa48("29129") ? threat.impact !== 'significant' : stryMutAct_9fa48("29128") ? false : stryMutAct_9fa48("29127") ? true : (stryCov_9fa48("29127", "29128", "29129"), threat.impact === 'significant')) ? 'bg-amber-600' : 'bg-blue-600'}`}>{stryMutAct_9fa48("29133") ? threat.impact.toLowerCase() : (stryCov_9fa48("29133"), threat.impact.toUpperCase())} IMPACT</span>
                  <span className="text-sm text-white/40">
                    Timeframe: {threat.timeframe} • Updated: {Math.floor(stryMutAct_9fa48("29134") ? (Date.now() - threat.lastUpdated.getTime()) * 3600000 : (stryCov_9fa48("29134"), (stryMutAct_9fa48("29135") ? Date.now() + threat.lastUpdated.getTime() : (stryCov_9fa48("29135"), Date.now() - threat.lastUpdated.getTime())) / 3600000))}h ago
                  </span>
                </div>
              </div>))}
          </div>)}

        {stryMutAct_9fa48("29138") ? activeTab === 'wargames' || <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">♟️ Multi-Agent Wargaming Platform</h2>
              <p className="text-white/60">
                Red team vs Blue team AI simulations for strategic planning and vulnerability discovery.
                All scenarios are run in isolated, air-gapped environments.
              </p>
            </div>

            {warGames.map(wg => {
          const classConfig = CLASSIFICATION_CONFIG[wg.classification];
          return <div key={wg.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{wg.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                          {classConfig.label}
                        </span>
                      </div>
                      <div className="text-sm text-white/50">{wg.scenario}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${wg.status === 'active' ? 'bg-green-600' : wg.status === 'complete' ? 'bg-blue-600' : 'bg-neutral-600'}`}>{wg.status.toUpperCase()}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="p-4 bg-red-900/20 rounded-xl border border-red-700/30">
                      <h4 className="font-semibold text-red-400 mb-2">🔴 Red Team</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold">{wg.redTeam.agents}</div>
                          <div className="text-xs text-white/50">Agents</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">{wg.redTeam.successRate}%</div>
                          <div className="text-xs text-white/50">Success Rate</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Objectives: {wg.redTeam.objectives.join(', ')}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                      <h4 className="font-semibold text-blue-400 mb-2">🔵 Blue Team</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold">{wg.blueTeam.agents}</div>
                          <div className="text-xs text-white/50">Agents</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">{wg.blueTeam.successRate}%</div>
                          <div className="text-xs text-white/50">Success Rate</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Objectives: {wg.blueTeam.objectives.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Key Insights</h4>
                    <ul className="space-y-1">
                      {wg.insights.map((insight, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-amber-400">💡</span> {insight}
                        </li>)}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30 text-sm text-white/40">
                    <span>{wg.iterations.toLocaleString()} iterations completed</span>
                    <span>Started: {wg.startDate.toLocaleDateString()}</span>
                  </div>
                </div>;
        })}
          </div> : stryMutAct_9fa48("29137") ? false : stryMutAct_9fa48("29136") ? true : (stryCov_9fa48("29136", "29137", "29138"), (stryMutAct_9fa48("29140") ? activeTab !== 'wargames' : stryMutAct_9fa48("29139") ? true : (stryCov_9fa48("29139", "29140"), activeTab === 'wargames')) && <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-900/30 to-pink-900/30 rounded-2xl p-6 border border-purple-700/50">
              <h2 className="text-lg font-semibold mb-2">♟️ Multi-Agent Wargaming Platform</h2>
              <p className="text-white/60">
                Red team vs Blue team AI simulations for strategic planning and vulnerability discovery.
                All scenarios are run in isolated, air-gapped environments.
              </p>
            </div>

            {warGames.map(wg => {
          const classConfig = CLASSIFICATION_CONFIG[wg.classification];
          return <div key={wg.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold">{wg.name}</h3>
                        <span className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                          {classConfig.label}
                        </span>
                      </div>
                      <div className="text-sm text-white/50">{wg.scenario}</div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("29147") ? wg.status !== 'active' : stryMutAct_9fa48("29146") ? false : stryMutAct_9fa48("29145") ? true : (stryCov_9fa48("29145", "29146", "29147"), wg.status === 'active')) ? 'bg-green-600' : (stryMutAct_9fa48("29152") ? wg.status !== 'complete' : stryMutAct_9fa48("29151") ? false : stryMutAct_9fa48("29150") ? true : (stryCov_9fa48("29150", "29151", "29152"), wg.status === 'complete')) ? 'bg-blue-600' : 'bg-neutral-600'}`}>{stryMutAct_9fa48("29156") ? wg.status.toLowerCase() : (stryCov_9fa48("29156"), wg.status.toUpperCase())}</span>
                  </div>

                  <div className="grid grid-cols-2 gap-6 mb-4">
                    <div className="p-4 bg-red-900/20 rounded-xl border border-red-700/30">
                      <h4 className="font-semibold text-red-400 mb-2">🔴 Red Team</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold">{wg.redTeam.agents}</div>
                          <div className="text-xs text-white/50">Agents</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-red-400">{wg.redTeam.successRate}%</div>
                          <div className="text-xs text-white/50">Success Rate</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Objectives: {wg.redTeam.objectives.join(', ')}
                      </div>
                    </div>

                    <div className="p-4 bg-blue-900/20 rounded-xl border border-blue-700/30">
                      <h4 className="font-semibold text-blue-400 mb-2">🔵 Blue Team</h4>
                      <div className="grid grid-cols-2 gap-4 mb-3">
                        <div>
                          <div className="text-2xl font-bold">{wg.blueTeam.agents}</div>
                          <div className="text-xs text-white/50">Agents</div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-blue-400">{wg.blueTeam.successRate}%</div>
                          <div className="text-xs text-white/50">Success Rate</div>
                        </div>
                      </div>
                      <div className="text-xs text-white/60">
                        Objectives: {wg.blueTeam.objectives.join(', ')}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-black/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-2">Key Insights</h4>
                    <ul className="space-y-1">
                      {wg.insights.map(stryMutAct_9fa48("29159") ? () => undefined : (stryCov_9fa48("29159"), (insight, idx) => <li key={idx} className="text-sm flex items-center gap-2">
                          <span className="text-amber-400">💡</span> {insight}
                        </li>))}
                    </ul>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-700/30 text-sm text-white/40">
                    <span>{wg.iterations.toLocaleString()} iterations completed</span>
                    <span>Started: {wg.startDate.toLocaleDateString()}</span>
                  </div>
                </div>;
        })}
          </div>)}

        {stryMutAct_9fa48("29162") ? activeTab === 'documents' || <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
              <h2 className="text-lg font-semibold mb-2">📁 Classified Document Intelligence</h2>
              <p className="text-white/60">
                AI-powered analysis of classified documents with entity extraction, relationship mapping,
                and secure search. All processing occurs within air-gapped environments.
              </p>
            </div>

            {classifiedDocs.map(doc => {
          const classConfig = CLASSIFICATION_CONFIG[doc.classification];
          return <div key={doc.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded ${classConfig.bg}`}>
                        <span className={`font-bold ${classConfig.color}`}>{classConfig.label}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <div className="text-sm text-white/50">
                          {doc.originatingAgency} • {doc.dateClassified.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${doc.status === 'available' ? 'bg-green-600' : doc.status === 'processing' ? 'bg-amber-600' : 'bg-blue-600'}`}>{doc.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.compartments.map(comp => <span key={comp} className="px-2 py-1 bg-red-900/30 border border-red-700/30 rounded text-xs">
                        {comp}
                      </span>)}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{doc.pageCount}</div>
                      <div className="text-xs text-white/50">Pages</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{doc.extractedEntities.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Entities Extracted</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className={`text-xl font-bold ${doc.status === 'available' ? 'text-green-400' : 'text-amber-400'}`}>
                        {doc.status === 'available' ? 'Ready' : 'Processing'}
                      </div>
                      <div className="text-xs text-white/50">Status</div>
                    </div>
                  </div>
                </div>;
        })}
          </div> : stryMutAct_9fa48("29161") ? false : stryMutAct_9fa48("29160") ? true : (stryCov_9fa48("29160", "29161", "29162"), (stryMutAct_9fa48("29164") ? activeTab !== 'documents' : stryMutAct_9fa48("29163") ? true : (stryCov_9fa48("29163", "29164"), activeTab === 'documents')) && <div className="space-y-4">
            <div className="bg-gradient-to-r from-amber-900/30 to-orange-900/30 rounded-2xl p-6 border border-amber-700/50">
              <h2 className="text-lg font-semibold mb-2">📁 Classified Document Intelligence</h2>
              <p className="text-white/60">
                AI-powered analysis of classified documents with entity extraction, relationship mapping,
                and secure search. All processing occurs within air-gapped environments.
              </p>
            </div>

            {classifiedDocs.map(doc => {
          const classConfig = CLASSIFICATION_CONFIG[doc.classification];
          return <div key={doc.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4">
                      <div className={`px-3 py-1.5 rounded ${classConfig.bg}`}>
                        <span className={`font-bold ${classConfig.color}`}>{classConfig.label}</span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{doc.title}</h3>
                        <div className="text-sm text-white/50">
                          {doc.originatingAgency} • {doc.dateClassified.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-lg text-sm ${(stryMutAct_9fa48("29172") ? doc.status !== 'available' : stryMutAct_9fa48("29171") ? false : stryMutAct_9fa48("29170") ? true : (stryCov_9fa48("29170", "29171", "29172"), doc.status === 'available')) ? 'bg-green-600' : (stryMutAct_9fa48("29177") ? doc.status !== 'processing' : stryMutAct_9fa48("29176") ? false : stryMutAct_9fa48("29175") ? true : (stryCov_9fa48("29175", "29176", "29177"), doc.status === 'processing')) ? 'bg-amber-600' : 'bg-blue-600'}`}>{doc.status}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {doc.compartments.map(stryMutAct_9fa48("29181") ? () => undefined : (stryCov_9fa48("29181"), comp => <span key={comp} className="px-2 py-1 bg-red-900/30 border border-red-700/30 rounded text-xs">
                        {comp}
                      </span>))}
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold">{doc.pageCount}</div>
                      <div className="text-xs text-white/50">Pages</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{doc.extractedEntities.toLocaleString()}</div>
                      <div className="text-xs text-white/50">Entities Extracted</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className={`text-xl font-bold ${(stryMutAct_9fa48("29185") ? doc.status !== 'available' : stryMutAct_9fa48("29184") ? false : stryMutAct_9fa48("29183") ? true : (stryCov_9fa48("29183", "29184", "29185"), doc.status === 'available')) ? 'text-green-400' : 'text-amber-400'}`}>
                        {(stryMutAct_9fa48("29191") ? doc.status !== 'available' : stryMutAct_9fa48("29190") ? false : stryMutAct_9fa48("29189") ? true : (stryCov_9fa48("29189", "29190", "29191"), doc.status === 'available')) ? 'Ready' : 'Processing'}
                      </div>
                      <div className="text-xs text-white/50">Status</div>
                    </div>
                  </div>
                </div>;
        })}
          </div>)}

        {stryMutAct_9fa48("29197") ? activeTab === 'deployment' || <div className="grid grid-cols-2 gap-6">
            {deploymentNodes.map(node => {
          const classConfig = CLASSIFICATION_CONFIG[node.classification];
          return <div key={node.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${node.status === 'online' ? 'bg-green-400 animate-pulse' : node.status === 'offline' ? 'bg-red-400' : 'bg-amber-400'}`} />
                      <h3 className="text-lg font-semibold">{node.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                      {classConfig.label}
                    </span>
                  </div>

                  <div className="text-sm text-white/60 mb-4">{node.location} • {node.mode}</div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{node.agents}</div>
                      <div className="text-xs text-white/50">AI Agents</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-purple-400">{node.throughput}</div>
                      <div className="text-xs text-white/50">TPS</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        {Math.floor((Date.now() - node.lastSync.getTime()) / 60000)}m
                      </div>
                      <div className="text-xs text-white/50">Last Sync</div>
                    </div>
                  </div>
                </div>;
        })}
          </div> : stryMutAct_9fa48("29196") ? false : stryMutAct_9fa48("29195") ? true : (stryCov_9fa48("29195", "29196", "29197"), (stryMutAct_9fa48("29199") ? activeTab !== 'deployment' : stryMutAct_9fa48("29198") ? true : (stryCov_9fa48("29198", "29199"), activeTab === 'deployment')) && <div className="grid grid-cols-2 gap-6">
            {deploymentNodes.map(node => {
          const classConfig = CLASSIFICATION_CONFIG[node.classification];
          return <div key={node.id} className="bg-black/30 rounded-2xl p-6 border border-slate-700/50">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full ${(stryMutAct_9fa48("29205") ? node.status !== 'online' : stryMutAct_9fa48("29204") ? false : stryMutAct_9fa48("29203") ? true : (stryCov_9fa48("29203", "29204", "29205"), node.status === 'online')) ? 'bg-green-400 animate-pulse' : (stryMutAct_9fa48("29210") ? node.status !== 'offline' : stryMutAct_9fa48("29209") ? false : stryMutAct_9fa48("29208") ? true : (stryCov_9fa48("29208", "29209", "29210"), node.status === 'offline')) ? 'bg-red-400' : 'bg-amber-400'}`} />
                      <h3 className="text-lg font-semibold">{node.name}</h3>
                    </div>
                    <span className={`px-2 py-1 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                      {classConfig.label}
                    </span>
                  </div>

                  <div className="text-sm text-white/60 mb-4">{node.location} • {node.mode}</div>

                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-cyan-400">{node.agents}</div>
                      <div className="text-xs text-white/50">AI Agents</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-purple-400">{node.throughput}</div>
                      <div className="text-xs text-white/50">TPS</div>
                    </div>
                    <div className="text-center p-3 bg-black/20 rounded-xl">
                      <div className="text-xl font-bold text-green-400">
                        {Math.floor(stryMutAct_9fa48("29215") ? (Date.now() - node.lastSync.getTime()) * 60000 : (stryCov_9fa48("29215"), (stryMutAct_9fa48("29216") ? Date.now() + node.lastSync.getTime() : (stryCov_9fa48("29216"), Date.now() - node.lastSync.getTime())) / 60000))}m
                      </div>
                      <div className="text-xs text-white/50">Last Sync</div>
                    </div>
                  </div>
                </div>;
        })}
          </div>)}

        {stryMutAct_9fa48("29219") ? activeTab === 'audit' || <div className="space-y-4">
            <div className="bg-gradient-to-r from-slate-800/50 to-neutral-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold mb-2">📋 NATO/DoD Compatible Audit Log</h2>
              <p className="text-white/60">
                Cryptographically verified, tamper-evident audit trail. All events are signed and
                stored in WORM-compliant storage with chain-of-custody preservation.
              </p>
            </div>

            <div className="bg-black/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-4 bg-black/30 border-b border-slate-700/30 text-xs font-semibold text-white/60 uppercase tracking-wider">
                <div>Timestamp</div>
                <div>Actor</div>
                <div>Action</div>
                <div>Resource</div>
                <div>Classification</div>
                <div>Outcome</div>
                <div>Verified</div>
              </div>
              {auditEvents.map(event => {
            const classConfig = CLASSIFICATION_CONFIG[event.classification];
            return <div key={event.id} className="grid grid-cols-7 gap-4 p-4 border-b border-slate-800/30 text-sm">
                    <div className="font-mono text-xs">{event.timestamp.toLocaleTimeString()}</div>
                    <div className="font-medium">{event.actor}</div>
                    <div>{event.action}</div>
                    <div className="font-mono text-xs">{event.resource}</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                        {classConfig.label}
                      </span>
                    </div>
                    <div className={event.outcome === 'success' ? 'text-green-400' : event.outcome === 'denied' ? 'text-red-400' : 'text-amber-400'}>
                      {event.outcome}
                    </div>
                    <div>{event.verified ? <span className="text-green-400">✓ Verified</span> : <span className="text-amber-400">Pending</span>}</div>
                  </div>;
          })}
            </div>
          </div> : stryMutAct_9fa48("29218") ? false : stryMutAct_9fa48("29217") ? true : (stryCov_9fa48("29217", "29218", "29219"), (stryMutAct_9fa48("29221") ? activeTab !== 'audit' : stryMutAct_9fa48("29220") ? true : (stryCov_9fa48("29220", "29221"), activeTab === 'audit')) && <div className="space-y-4">
            <div className="bg-gradient-to-r from-slate-800/50 to-neutral-800/50 rounded-2xl p-6 border border-slate-700/50">
              <h2 className="text-lg font-semibold mb-2">📋 NATO/DoD Compatible Audit Log</h2>
              <p className="text-white/60">
                Cryptographically verified, tamper-evident audit trail. All events are signed and
                stored in WORM-compliant storage with chain-of-custody preservation.
              </p>
            </div>

            <div className="bg-black/30 rounded-2xl border border-slate-700/50 overflow-hidden">
              <div className="grid grid-cols-7 gap-4 p-4 bg-black/30 border-b border-slate-700/30 text-xs font-semibold text-white/60 uppercase tracking-wider">
                <div>Timestamp</div>
                <div>Actor</div>
                <div>Action</div>
                <div>Resource</div>
                <div>Classification</div>
                <div>Outcome</div>
                <div>Verified</div>
              </div>
              {auditEvents.map(event => {
            const classConfig = CLASSIFICATION_CONFIG[event.classification];
            return <div key={event.id} className="grid grid-cols-7 gap-4 p-4 border-b border-slate-800/30 text-sm">
                    <div className="font-mono text-xs">{event.timestamp.toLocaleTimeString()}</div>
                    <div className="font-medium">{event.actor}</div>
                    <div>{event.action}</div>
                    <div className="font-mono text-xs">{event.resource}</div>
                    <div>
                      <span className={`px-2 py-0.5 rounded text-xs ${classConfig.bg} ${classConfig.color}`}>
                        {classConfig.label}
                      </span>
                    </div>
                    <div className={(stryMutAct_9fa48("29227") ? event.outcome !== 'success' : stryMutAct_9fa48("29226") ? false : stryMutAct_9fa48("29225") ? true : (stryCov_9fa48("29225", "29226", "29227"), event.outcome === 'success')) ? 'text-green-400' : (stryMutAct_9fa48("29232") ? event.outcome !== 'denied' : stryMutAct_9fa48("29231") ? false : stryMutAct_9fa48("29230") ? true : (stryCov_9fa48("29230", "29231", "29232"), event.outcome === 'denied')) ? 'text-red-400' : 'text-amber-400'}>
                      {event.outcome}
                    </div>
                    <div>{event.verified ? <span className="text-green-400">✓ Verified</span> : <span className="text-amber-400">Pending</span>}</div>
                  </div>;
          })}
            </div>
          </div>)}
      </main>

      {/* Classification Banner Bottom */}
      <div className="bg-red-800 text-white text-center py-1 text-xs font-bold tracking-wider">
        TOP SECRET // NOFORN // DEMONSTRATION SYSTEM - NOT FOR OPERATIONAL USE
      </div>
    </div>;
};
export default DefenseStackPage;