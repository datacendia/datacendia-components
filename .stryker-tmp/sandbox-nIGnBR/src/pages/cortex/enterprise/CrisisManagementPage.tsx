// @ts-nocheck
// =============================================================================
// CENDIA CRISIS MANAGEMENT™ - INCIDENT RESPONSE CENTER
// Real-time crisis tracking, war room coordination, and incident lifecycle
// "From Detection to Resolution • Complete Audit Trail"
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
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type IncidentSeverity = 'P1' | 'P2' | 'P3' | 'P4';
type IncidentType = 'security' | 'pr' | 'operational' | 'financial' | 'legal' | 'compliance';
type IncidentPhase = 'detection' | 'triage' | 'containment' | 'eradication' | 'recovery' | 'post-mortem' | 'closed';
interface Incident {
  id: string;
  title: string;
  type: IncidentType;
  severity: IncidentSeverity;
  phase: IncidentPhase;
  description: string;
  detectedAt: Date;
  assignedTo: string;
  incidentCommander?: string;
  affectedSystems: string[];
  timeline: TimelineEvent[];
  stakeholders: string[];
  containmentActions: string[];
  rootCause?: string;
  lessonsLearned?: string[];
}
interface TimelineEvent {
  id: string;
  timestamp: Date;
  actor: string;
  action: string;
  details: string;
  phase: IncidentPhase;
}
interface WarRoom {
  id: string;
  incidentId: string;
  name: string;
  status: 'active' | 'standby' | 'closed';
  participants: {
    name: string;
    role: string;
    online: boolean;
  }[];
  startedAt: Date;
  decisions: {
    text: string;
    madeBy: string;
    timestamp: Date;
  }[];
}

// =============================================================================
// MOCK DATA
// =============================================================================

const mockIncidents: Incident[] = stryMutAct_9fa48("28105") ? [] : (stryCov_9fa48("28105"), [stryMutAct_9fa48("28106") ? {} : (stryCov_9fa48("28106"), {
  id: 'INC-2025-001',
  title: 'Unauthorized Access Attempt Detected',
  type: 'security',
  severity: 'P2',
  phase: 'containment',
  description: 'Multiple failed login attempts from suspicious IP range targeting executive accounts.',
  detectedAt: new Date(stryMutAct_9fa48("28113") ? Date.now() + 2 * 60 * 60 * 1000 : (stryCov_9fa48("28113"), Date.now() - (stryMutAct_9fa48("28114") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("28114"), (stryMutAct_9fa48("28115") ? 2 * 60 / 60 : (stryCov_9fa48("28115"), (stryMutAct_9fa48("28116") ? 2 / 60 : (stryCov_9fa48("28116"), 2 * 60)) * 60)) * 1000)))),
  assignedTo: 'Security Team',
  incidentCommander: 'Sarah Chen (CISO)',
  affectedSystems: stryMutAct_9fa48("28119") ? [] : (stryCov_9fa48("28119"), ['Identity Provider', 'VPN Gateway', 'Executive Portal']),
  stakeholders: stryMutAct_9fa48("28123") ? [] : (stryCov_9fa48("28123"), ['CISO', 'CTO', 'Legal']),
  containmentActions: stryMutAct_9fa48("28127") ? [] : (stryCov_9fa48("28127"), ['Blocked IP range 185.x.x.x', 'Forced password reset for targeted accounts', 'Enabled enhanced monitoring']),
  timeline: stryMutAct_9fa48("28131") ? [] : (stryCov_9fa48("28131"), [stryMutAct_9fa48("28132") ? {} : (stryCov_9fa48("28132"), {
    id: '1',
    timestamp: new Date(stryMutAct_9fa48("28134") ? Date.now() + 2 * 60 * 60 * 1000 : (stryCov_9fa48("28134"), Date.now() - (stryMutAct_9fa48("28135") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("28135"), (stryMutAct_9fa48("28136") ? 2 * 60 / 60 : (stryCov_9fa48("28136"), (stryMutAct_9fa48("28137") ? 2 / 60 : (stryCov_9fa48("28137"), 2 * 60)) * 60)) * 1000)))),
    actor: 'SIEM',
    action: 'Alert Generated',
    details: '50+ failed login attempts detected',
    phase: 'detection'
  }), stryMutAct_9fa48("28142") ? {} : (stryCov_9fa48("28142"), {
    id: '2',
    timestamp: new Date(stryMutAct_9fa48("28144") ? Date.now() + 1.9 * 60 * 60 * 1000 : (stryCov_9fa48("28144"), Date.now() - (stryMutAct_9fa48("28145") ? 1.9 * 60 * 60 / 1000 : (stryCov_9fa48("28145"), (stryMutAct_9fa48("28146") ? 1.9 * 60 / 60 : (stryCov_9fa48("28146"), (stryMutAct_9fa48("28147") ? 1.9 / 60 : (stryCov_9fa48("28147"), 1.9 * 60)) * 60)) * 1000)))),
    actor: 'SOC Analyst',
    action: 'Triage Started',
    details: 'Confirmed malicious pattern, escalated to P2',
    phase: 'triage'
  }), stryMutAct_9fa48("28152") ? {} : (stryCov_9fa48("28152"), {
    id: '3',
    timestamp: new Date(stryMutAct_9fa48("28154") ? Date.now() + 1.5 * 60 * 60 * 1000 : (stryCov_9fa48("28154"), Date.now() - (stryMutAct_9fa48("28155") ? 1.5 * 60 * 60 / 1000 : (stryCov_9fa48("28155"), (stryMutAct_9fa48("28156") ? 1.5 * 60 / 60 : (stryCov_9fa48("28156"), (stryMutAct_9fa48("28157") ? 1.5 / 60 : (stryCov_9fa48("28157"), 1.5 * 60)) * 60)) * 1000)))),
    actor: 'Security Team',
    action: 'IP Block Deployed',
    details: 'Firewall rules updated',
    phase: 'containment'
  })])
}), stryMutAct_9fa48("28162") ? {} : (stryCov_9fa48("28162"), {
  id: 'INC-2025-002',
  title: 'Negative Press Coverage - Data Practices',
  type: 'pr',
  severity: 'P2',
  phase: 'recovery',
  description: 'TechNews article questioning data handling practices, gaining social media traction.',
  detectedAt: new Date(stryMutAct_9fa48("28169") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("28169"), Date.now() - (stryMutAct_9fa48("28170") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("28170"), (stryMutAct_9fa48("28171") ? 24 * 60 / 60 : (stryCov_9fa48("28171"), (stryMutAct_9fa48("28172") ? 24 / 60 : (stryCov_9fa48("28172"), 24 * 60)) * 60)) * 1000)))),
  assignedTo: 'Communications Team',
  incidentCommander: 'Michael Torres (CMO)',
  affectedSystems: stryMutAct_9fa48("28175") ? ["Stryker was here"] : (stryCov_9fa48("28175"), []),
  stakeholders: stryMutAct_9fa48("28176") ? [] : (stryCov_9fa48("28176"), ['CMO', 'CEO', 'Legal', 'Privacy Officer']),
  containmentActions: stryMutAct_9fa48("28181") ? [] : (stryCov_9fa48("28181"), ['Prepared holding statement', 'Identified spokesperson', 'Drafted detailed response']),
  timeline: stryMutAct_9fa48("28185") ? [] : (stryCov_9fa48("28185"), [stryMutAct_9fa48("28186") ? {} : (stryCov_9fa48("28186"), {
    id: '1',
    timestamp: new Date(stryMutAct_9fa48("28188") ? Date.now() + 24 * 60 * 60 * 1000 : (stryCov_9fa48("28188"), Date.now() - (stryMutAct_9fa48("28189") ? 24 * 60 * 60 / 1000 : (stryCov_9fa48("28189"), (stryMutAct_9fa48("28190") ? 24 * 60 / 60 : (stryCov_9fa48("28190"), (stryMutAct_9fa48("28191") ? 24 / 60 : (stryCov_9fa48("28191"), 24 * 60)) * 60)) * 1000)))),
    actor: 'Social Listening',
    action: 'Alert',
    details: 'Article gaining traction, 500+ shares',
    phase: 'detection'
  }), stryMutAct_9fa48("28196") ? {} : (stryCov_9fa48("28196"), {
    id: '2',
    timestamp: new Date(stryMutAct_9fa48("28198") ? Date.now() + 23 * 60 * 60 * 1000 : (stryCov_9fa48("28198"), Date.now() - (stryMutAct_9fa48("28199") ? 23 * 60 * 60 / 1000 : (stryCov_9fa48("28199"), (stryMutAct_9fa48("28200") ? 23 * 60 / 60 : (stryCov_9fa48("28200"), (stryMutAct_9fa48("28201") ? 23 / 60 : (stryCov_9fa48("28201"), 23 * 60)) * 60)) * 1000)))),
    actor: 'CMO',
    action: 'War Room Activated',
    details: 'Crisis team assembled',
    phase: 'triage'
  }), stryMutAct_9fa48("28206") ? {} : (stryCov_9fa48("28206"), {
    id: '3',
    timestamp: new Date(stryMutAct_9fa48("28208") ? Date.now() + 22 * 60 * 60 * 1000 : (stryCov_9fa48("28208"), Date.now() - (stryMutAct_9fa48("28209") ? 22 * 60 * 60 / 1000 : (stryCov_9fa48("28209"), (stryMutAct_9fa48("28210") ? 22 * 60 / 60 : (stryCov_9fa48("28210"), (stryMutAct_9fa48("28211") ? 22 / 60 : (stryCov_9fa48("28211"), 22 * 60)) * 60)) * 1000)))),
    actor: 'Communications',
    action: 'Holding Statement',
    details: 'Released initial response',
    phase: 'containment'
  }), stryMutAct_9fa48("28216") ? {} : (stryCov_9fa48("28216"), {
    id: '4',
    timestamp: new Date(stryMutAct_9fa48("28218") ? Date.now() + 18 * 60 * 60 * 1000 : (stryCov_9fa48("28218"), Date.now() - (stryMutAct_9fa48("28219") ? 18 * 60 * 60 / 1000 : (stryCov_9fa48("28219"), (stryMutAct_9fa48("28220") ? 18 * 60 / 60 : (stryCov_9fa48("28220"), (stryMutAct_9fa48("28221") ? 18 / 60 : (stryCov_9fa48("28221"), 18 * 60)) * 60)) * 1000)))),
    actor: 'CEO',
    action: 'Full Response Published',
    details: 'Detailed blog post addressing concerns',
    phase: 'recovery'
  })]),
  rootCause: 'Outdated privacy policy language not reflecting current practices',
  lessonsLearned: stryMutAct_9fa48("28227") ? [] : (stryCov_9fa48("28227"), ['Update privacy policy quarterly', 'Proactive transparency reports'])
}), stryMutAct_9fa48("28230") ? {} : (stryCov_9fa48("28230"), {
  id: 'INC-2025-003',
  title: 'Database Performance Degradation',
  type: 'operational',
  severity: 'P3',
  phase: 'post-mortem',
  description: 'Primary database experiencing 3x normal query latency during peak hours.',
  detectedAt: new Date(stryMutAct_9fa48("28237") ? Date.now() + 72 * 60 * 60 * 1000 : (stryCov_9fa48("28237"), Date.now() - (stryMutAct_9fa48("28238") ? 72 * 60 * 60 / 1000 : (stryCov_9fa48("28238"), (stryMutAct_9fa48("28239") ? 72 * 60 / 60 : (stryCov_9fa48("28239"), (stryMutAct_9fa48("28240") ? 72 / 60 : (stryCov_9fa48("28240"), 72 * 60)) * 60)) * 1000)))),
  assignedTo: 'Platform Team',
  affectedSystems: stryMutAct_9fa48("28242") ? [] : (stryCov_9fa48("28242"), ['PostgreSQL Primary', 'API Gateway']),
  stakeholders: stryMutAct_9fa48("28245") ? [] : (stryCov_9fa48("28245"), ['CTO', 'VP Engineering']),
  containmentActions: stryMutAct_9fa48("28248") ? [] : (stryCov_9fa48("28248"), ['Scaled read replicas', 'Implemented query caching', 'Identified slow queries']),
  timeline: stryMutAct_9fa48("28252") ? ["Stryker was here"] : (stryCov_9fa48("28252"), []),
  rootCause: 'Unoptimized query from new feature deployment',
  lessonsLearned: stryMutAct_9fa48("28254") ? [] : (stryCov_9fa48("28254"), ['Mandatory query review for new features', 'Load testing before deployment'])
})]);
const mockWarRoom: WarRoom = stryMutAct_9fa48("28257") ? {} : (stryCov_9fa48("28257"), {
  id: 'WR-001',
  incidentId: 'INC-2025-001',
  name: 'Security Incident War Room',
  status: 'active',
  startedAt: new Date(stryMutAct_9fa48("28262") ? Date.now() + 1.9 * 60 * 60 * 1000 : (stryCov_9fa48("28262"), Date.now() - (stryMutAct_9fa48("28263") ? 1.9 * 60 * 60 / 1000 : (stryCov_9fa48("28263"), (stryMutAct_9fa48("28264") ? 1.9 * 60 / 60 : (stryCov_9fa48("28264"), (stryMutAct_9fa48("28265") ? 1.9 / 60 : (stryCov_9fa48("28265"), 1.9 * 60)) * 60)) * 1000)))),
  participants: stryMutAct_9fa48("28266") ? [] : (stryCov_9fa48("28266"), [stryMutAct_9fa48("28267") ? {} : (stryCov_9fa48("28267"), {
    name: 'Sarah Chen',
    role: 'Incident Commander',
    online: stryMutAct_9fa48("28270") ? false : (stryCov_9fa48("28270"), true)
  }), stryMutAct_9fa48("28271") ? {} : (stryCov_9fa48("28271"), {
    name: 'Alex Kim',
    role: 'Security Lead',
    online: stryMutAct_9fa48("28274") ? false : (stryCov_9fa48("28274"), true)
  }), stryMutAct_9fa48("28275") ? {} : (stryCov_9fa48("28275"), {
    name: 'Jordan Lee',
    role: 'Network Engineer',
    online: stryMutAct_9fa48("28278") ? false : (stryCov_9fa48("28278"), true)
  }), stryMutAct_9fa48("28279") ? {} : (stryCov_9fa48("28279"), {
    name: 'Pat Williams',
    role: 'Legal Counsel',
    online: stryMutAct_9fa48("28282") ? true : (stryCov_9fa48("28282"), false)
  })]),
  decisions: stryMutAct_9fa48("28283") ? [] : (stryCov_9fa48("28283"), [stryMutAct_9fa48("28284") ? {} : (stryCov_9fa48("28284"), {
    text: 'Block suspicious IP range immediately',
    madeBy: 'Sarah Chen',
    timestamp: new Date(stryMutAct_9fa48("28287") ? Date.now() + 1.5 * 60 * 60 * 1000 : (stryCov_9fa48("28287"), Date.now() - (stryMutAct_9fa48("28288") ? 1.5 * 60 * 60 / 1000 : (stryCov_9fa48("28288"), (stryMutAct_9fa48("28289") ? 1.5 * 60 / 60 : (stryCov_9fa48("28289"), (stryMutAct_9fa48("28290") ? 1.5 / 60 : (stryCov_9fa48("28290"), 1.5 * 60)) * 60)) * 1000))))
  }), stryMutAct_9fa48("28291") ? {} : (stryCov_9fa48("28291"), {
    text: 'Force password reset for all executive accounts',
    madeBy: 'Sarah Chen',
    timestamp: new Date(stryMutAct_9fa48("28294") ? Date.now() + 1.3 * 60 * 60 * 1000 : (stryCov_9fa48("28294"), Date.now() - (stryMutAct_9fa48("28295") ? 1.3 * 60 * 60 / 1000 : (stryCov_9fa48("28295"), (stryMutAct_9fa48("28296") ? 1.3 * 60 / 60 : (stryCov_9fa48("28296"), (stryMutAct_9fa48("28297") ? 1.3 / 60 : (stryCov_9fa48("28297"), 1.3 * 60)) * 60)) * 1000))))
  })])
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getSeverityColor = (severity: IncidentSeverity) => {
  switch (severity) {
    case 'P1':
      if (stryMutAct_9fa48("28299")) {} else {
        stryCov_9fa48("28299");
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      }
    case 'P2':
      if (stryMutAct_9fa48("28302")) {} else {
        stryCov_9fa48("28302");
        return 'bg-orange-500/20 text-orange-400 border-orange-500/30';
      }
    case 'P3':
      if (stryMutAct_9fa48("28305")) {} else {
        stryCov_9fa48("28305");
        return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      }
    case 'P4':
      if (stryMutAct_9fa48("28308")) {} else {
        stryCov_9fa48("28308");
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      }
  }
};
const getPhaseColor = (phase: IncidentPhase) => {
  switch (phase) {
    case 'detection':
      if (stryMutAct_9fa48("28312")) {} else {
        stryCov_9fa48("28312");
        return 'bg-purple-500/20 text-purple-400';
      }
    case 'triage':
      if (stryMutAct_9fa48("28315")) {} else {
        stryCov_9fa48("28315");
        return 'bg-orange-500/20 text-orange-400';
      }
    case 'containment':
      if (stryMutAct_9fa48("28318")) {} else {
        stryCov_9fa48("28318");
        return 'bg-yellow-500/20 text-yellow-400';
      }
    case 'eradication':
      if (stryMutAct_9fa48("28321")) {} else {
        stryCov_9fa48("28321");
        return 'bg-blue-500/20 text-blue-400';
      }
    case 'recovery':
      if (stryMutAct_9fa48("28324")) {} else {
        stryCov_9fa48("28324");
        return 'bg-cyan-500/20 text-cyan-400';
      }
    case 'post-mortem':
      if (stryMutAct_9fa48("28327")) {} else {
        stryCov_9fa48("28327");
        return 'bg-indigo-500/20 text-indigo-400';
      }
    case 'closed':
      if (stryMutAct_9fa48("28330")) {} else {
        stryCov_9fa48("28330");
        return 'bg-green-500/20 text-green-400';
      }
  }
};
const getTypeIcon = (type: IncidentType) => {
  switch (type) {
    case 'security':
      if (stryMutAct_9fa48("28334")) {} else {
        stryCov_9fa48("28334");
        return '🛡️';
      }
    case 'pr':
      if (stryMutAct_9fa48("28337")) {} else {
        stryCov_9fa48("28337");
        return '📢';
      }
    case 'operational':
      if (stryMutAct_9fa48("28340")) {} else {
        stryCov_9fa48("28340");
        return '⚙️';
      }
    case 'financial':
      if (stryMutAct_9fa48("28343")) {} else {
        stryCov_9fa48("28343");
        return '💰';
      }
    case 'legal':
      if (stryMutAct_9fa48("28346")) {} else {
        stryCov_9fa48("28346");
        return '⚖️';
      }
    case 'compliance':
      if (stryMutAct_9fa48("28349")) {} else {
        stryCov_9fa48("28349");
        return '📋';
      }
  }
};
const formatTimeAgo = (date: Date) => {
  const seconds = Math.floor(stryMutAct_9fa48("28353") ? (Date.now() - date.getTime()) * 1000 : (stryCov_9fa48("28353"), (stryMutAct_9fa48("28354") ? Date.now() + date.getTime() : (stryCov_9fa48("28354"), Date.now() - date.getTime())) / 1000));
  if (stryMutAct_9fa48("28358") ? seconds >= 60 : stryMutAct_9fa48("28357") ? seconds <= 60 : stryMutAct_9fa48("28356") ? false : stryMutAct_9fa48("28355") ? true : (stryCov_9fa48("28355", "28356", "28357", "28358"), seconds < 60)) return 'Just now';
  if (stryMutAct_9fa48("28363") ? seconds >= 3600 : stryMutAct_9fa48("28362") ? seconds <= 3600 : stryMutAct_9fa48("28361") ? false : stryMutAct_9fa48("28360") ? true : (stryCov_9fa48("28360", "28361", "28362", "28363"), seconds < 3600)) return `${Math.floor(stryMutAct_9fa48("28365") ? seconds * 60 : (stryCov_9fa48("28365"), seconds / 60))}m ago`;
  if (stryMutAct_9fa48("28369") ? seconds >= 86400 : stryMutAct_9fa48("28368") ? seconds <= 86400 : stryMutAct_9fa48("28367") ? false : stryMutAct_9fa48("28366") ? true : (stryCov_9fa48("28366", "28367", "28368", "28369"), seconds < 86400)) return `${Math.floor(stryMutAct_9fa48("28371") ? seconds * 3600 : (stryCov_9fa48("28371"), seconds / 3600))}h ago`;
  return `${Math.floor(stryMutAct_9fa48("28373") ? seconds * 86400 : (stryCov_9fa48("28373"), seconds / 86400))}d ago`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const CrisisManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'incidents' | 'war-room' | 'playbooks'>('dashboard');
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<IncidentSeverity | 'all'>('all');
  const activeIncidents = stryMutAct_9fa48("28377") ? mockIncidents : (stryCov_9fa48("28377"), mockIncidents.filter(stryMutAct_9fa48("28378") ? () => undefined : (stryCov_9fa48("28378"), i => stryMutAct_9fa48("28379") ? ['closed', 'post-mortem'].includes(i.phase) : (stryCov_9fa48("28379"), !(stryMutAct_9fa48("28380") ? [] : (stryCov_9fa48("28380"), ['closed', 'post-mortem'])).includes(i.phase)))));
  const filteredIncidents = (stryMutAct_9fa48("28385") ? filterSeverity !== 'all' : stryMutAct_9fa48("28384") ? false : stryMutAct_9fa48("28383") ? true : (stryCov_9fa48("28383", "28384", "28385"), filterSeverity === 'all')) ? mockIncidents : stryMutAct_9fa48("28387") ? mockIncidents : (stryCov_9fa48("28387"), mockIncidents.filter(stryMutAct_9fa48("28388") ? () => undefined : (stryCov_9fa48("28388"), i => stryMutAct_9fa48("28391") ? i.severity !== filterSeverity : stryMutAct_9fa48("28390") ? false : stryMutAct_9fa48("28389") ? true : (stryCov_9fa48("28389", "28390", "28391"), i.severity === filterSeverity))));
  const phases: IncidentPhase[] = stryMutAct_9fa48("28392") ? [] : (stryCov_9fa48("28392"), ['detection', 'triage', 'containment', 'eradication', 'recovery', 'post-mortem', 'closed']);
  return <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">🚨</span>
          <h1 className="text-3xl font-bold">Crisis Management</h1>
          {stryMutAct_9fa48("28402") ? activeIncidents.length > 0 || <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium animate-pulse">
              {activeIncidents.length} Active
            </span> : stryMutAct_9fa48("28401") ? false : stryMutAct_9fa48("28400") ? true : (stryCov_9fa48("28400", "28401", "28402"), (stryMutAct_9fa48("28405") ? activeIncidents.length <= 0 : stryMutAct_9fa48("28404") ? activeIncidents.length >= 0 : stryMutAct_9fa48("28403") ? true : (stryCov_9fa48("28403", "28404", "28405"), activeIncidents.length > 0)) && <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm font-medium animate-pulse">
              {activeIncidents.length} Active
            </span>)}
        </div>
        <p className="text-neutral-400">
          Incident response center • War room coordination • Complete audit trail
        </p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700 pb-2">
        {(stryMutAct_9fa48("28406") ? [] : (stryCov_9fa48("28406"), [stryMutAct_9fa48("28407") ? {} : (stryCov_9fa48("28407"), {
        id: 'dashboard',
        label: 'Dashboard',
        icon: '📊'
      }), stryMutAct_9fa48("28411") ? {} : (stryCov_9fa48("28411"), {
        id: 'incidents',
        label: 'All Incidents',
        icon: '📋'
      }), stryMutAct_9fa48("28415") ? {} : (stryCov_9fa48("28415"), {
        id: 'war-room',
        label: 'War Room',
        icon: '🎯'
      }), stryMutAct_9fa48("28419") ? {} : (stryCov_9fa48("28419"), {
        id: 'playbooks',
        label: 'Playbooks',
        icon: '📖'
      })])).map(stryMutAct_9fa48("28423") ? () => undefined : (stryCov_9fa48("28423"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("28424") ? () => undefined : (stryCov_9fa48("28424"), () => setActiveTab(tab.id as typeof activeTab))} className={`px-4 py-2 rounded-lg font-medium transition-all ${(stryMutAct_9fa48("28428") ? activeTab !== tab.id : stryMutAct_9fa48("28427") ? false : stryMutAct_9fa48("28426") ? true : (stryCov_9fa48("28426", "28427", "28428"), activeTab === tab.id)) ? 'bg-primary-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            {tab.icon} {tab.label}
          </button>))}
      </div>

      {/* Dashboard Tab */}
      {stryMutAct_9fa48("28433") ? activeTab === 'dashboard' || <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[{
          label: 'Active Incidents',
          value: activeIncidents.length,
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        }, {
          label: 'P1 Critical',
          value: mockIncidents.filter(i => i.severity === 'P1').length,
          color: 'text-red-500',
          bg: 'bg-red-500/10'
        }, {
          label: 'Mean Time to Contain',
          value: '2.4h',
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10'
        }, {
          label: 'Resolved This Month',
          value: '12',
          color: 'text-green-400',
          bg: 'bg-green-500/10'
        }].map(stat => <div key={stat.label} className={`${stat.bg} rounded-xl p-6 border border-neutral-700`}>
                <p className="text-neutral-400 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>)}
          </div>

          {/* Active Incidents */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Active Incidents
            </h2>
            <div className="space-y-3">
              {activeIncidents.map(incident => <div key={incident.id} onClick={() => setSelectedIncident(incident)} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-neutral-500">{incident.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(incident.phase)}`}>
                            {incident.phase}
                          </span>
                        </div>
                        <h3 className="font-semibold mt-1">{incident.title}</h3>
                        <p className="text-sm text-neutral-400 mt-1">{incident.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-neutral-500">Detected {formatTimeAgo(incident.detectedAt)}</p>
                      <p className="text-neutral-400">{incident.incidentCommander || incident.assignedTo}</p>
                    </div>
                  </div>
                </div>)}
              {activeIncidents.length === 0 && <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No active incidents</p>
                </div>}
            </div>
          </div>

          {/* Incident Lifecycle */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Lifecycle</h2>
            <div className="flex items-center justify-between">
              {phases.map((phase, idx) => <React.Fragment key={phase}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${getPhaseColor(phase)}`}>
                      {mockIncidents.filter(i => i.phase === phase).length}
                    </div>
                    <span className="text-xs text-neutral-400 mt-2 capitalize">{phase.replace('-', ' ')}</span>
                  </div>
                  {idx < phases.length - 1 && <div className="flex-1 h-0.5 bg-neutral-700 mx-2"></div>}
                </React.Fragment>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("28432") ? false : stryMutAct_9fa48("28431") ? true : (stryCov_9fa48("28431", "28432", "28433"), (stryMutAct_9fa48("28435") ? activeTab !== 'dashboard' : stryMutAct_9fa48("28434") ? true : (stryCov_9fa48("28434", "28435"), activeTab === 'dashboard')) && <div className="space-y-6">
          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {(stryMutAct_9fa48("28437") ? [] : (stryCov_9fa48("28437"), [stryMutAct_9fa48("28438") ? {} : (stryCov_9fa48("28438"), {
          label: 'Active Incidents',
          value: activeIncidents.length,
          color: 'text-red-400',
          bg: 'bg-red-500/10'
        }), stryMutAct_9fa48("28442") ? {} : (stryCov_9fa48("28442"), {
          label: 'P1 Critical',
          value: stryMutAct_9fa48("28444") ? mockIncidents.length : (stryCov_9fa48("28444"), mockIncidents.filter(stryMutAct_9fa48("28445") ? () => undefined : (stryCov_9fa48("28445"), i => stryMutAct_9fa48("28448") ? i.severity !== 'P1' : stryMutAct_9fa48("28447") ? false : stryMutAct_9fa48("28446") ? true : (stryCov_9fa48("28446", "28447", "28448"), i.severity === 'P1'))).length),
          color: 'text-red-500',
          bg: 'bg-red-500/10'
        }), stryMutAct_9fa48("28452") ? {} : (stryCov_9fa48("28452"), {
          label: 'Mean Time to Contain',
          value: '2.4h',
          color: 'text-yellow-400',
          bg: 'bg-yellow-500/10'
        }), stryMutAct_9fa48("28457") ? {} : (stryCov_9fa48("28457"), {
          label: 'Resolved This Month',
          value: '12',
          color: 'text-green-400',
          bg: 'bg-green-500/10'
        })])).map(stryMutAct_9fa48("28462") ? () => undefined : (stryCov_9fa48("28462"), stat => <div key={stat.label} className={`${stat.bg} rounded-xl p-6 border border-neutral-700`}>
                <p className="text-neutral-400 text-sm">{stat.label}</p>
                <p className={`text-3xl font-bold ${stat.color} mt-1`}>{stat.value}</p>
              </div>))}
          </div>

          {/* Active Incidents */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              Active Incidents
            </h2>
            <div className="space-y-3">
              {activeIncidents.map(stryMutAct_9fa48("28465") ? () => undefined : (stryCov_9fa48("28465"), incident => <div key={incident.id} onClick={stryMutAct_9fa48("28466") ? () => undefined : (stryCov_9fa48("28466"), () => setSelectedIncident(incident))} className="p-4 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getTypeIcon(incident.type)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-neutral-500">{incident.id}</span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                            {incident.severity}
                          </span>
                          <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(incident.phase)}`}>
                            {incident.phase}
                          </span>
                        </div>
                        <h3 className="font-semibold mt-1">{incident.title}</h3>
                        <p className="text-sm text-neutral-400 mt-1">{incident.description}</p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="text-neutral-500">Detected {formatTimeAgo(incident.detectedAt)}</p>
                      <p className="text-neutral-400">{stryMutAct_9fa48("28471") ? incident.incidentCommander && incident.assignedTo : stryMutAct_9fa48("28470") ? false : stryMutAct_9fa48("28469") ? true : (stryCov_9fa48("28469", "28470", "28471"), incident.incidentCommander || incident.assignedTo)}</p>
                    </div>
                  </div>
                </div>))}
              {stryMutAct_9fa48("28474") ? activeIncidents.length === 0 || <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No active incidents</p>
                </div> : stryMutAct_9fa48("28473") ? false : stryMutAct_9fa48("28472") ? true : (stryCov_9fa48("28472", "28473", "28474"), (stryMutAct_9fa48("28476") ? activeIncidents.length !== 0 : stryMutAct_9fa48("28475") ? true : (stryCov_9fa48("28475", "28476"), activeIncidents.length === 0)) && <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No active incidents</p>
                </div>)}
            </div>
          </div>

          {/* Incident Lifecycle */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h2 className="text-xl font-semibold mb-4">Incident Lifecycle</h2>
            <div className="flex items-center justify-between">
              {phases.map(stryMutAct_9fa48("28477") ? () => undefined : (stryCov_9fa48("28477"), (phase, idx) => <React.Fragment key={phase}>
                  <div className="flex flex-col items-center">
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center text-sm font-medium ${getPhaseColor(phase)}`}>
                      {stryMutAct_9fa48("28479") ? mockIncidents.length : (stryCov_9fa48("28479"), mockIncidents.filter(stryMutAct_9fa48("28480") ? () => undefined : (stryCov_9fa48("28480"), i => stryMutAct_9fa48("28483") ? i.phase !== phase : stryMutAct_9fa48("28482") ? false : stryMutAct_9fa48("28481") ? true : (stryCov_9fa48("28481", "28482", "28483"), i.phase === phase))).length)}
                    </div>
                    <span className="text-xs text-neutral-400 mt-2 capitalize">{phase.replace('-', ' ')}</span>
                  </div>
                  {stryMutAct_9fa48("28488") ? idx < phases.length - 1 || <div className="flex-1 h-0.5 bg-neutral-700 mx-2"></div> : stryMutAct_9fa48("28487") ? false : stryMutAct_9fa48("28486") ? true : (stryCov_9fa48("28486", "28487", "28488"), (stryMutAct_9fa48("28491") ? idx >= phases.length - 1 : stryMutAct_9fa48("28490") ? idx <= phases.length - 1 : stryMutAct_9fa48("28489") ? true : (stryCov_9fa48("28489", "28490", "28491"), idx < (stryMutAct_9fa48("28492") ? phases.length + 1 : (stryCov_9fa48("28492"), phases.length - 1)))) && <div className="flex-1 h-0.5 bg-neutral-700 mx-2"></div>)}
                </React.Fragment>))}
            </div>
          </div>
        </div>)}

      {/* Incidents Tab */}
      {stryMutAct_9fa48("28495") ? activeTab === 'incidents' || <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select value={filterSeverity} onChange={e => setFilterSeverity(e.target.value as IncidentSeverity | 'all')} className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Severities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              + Report Incident
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Title</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Phase</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Detected</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Commander</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(incident => <tr key={incident.id} onClick={() => setSelectedIncident(incident)} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4 font-mono text-sm">{incident.id}</td>
                    <td className="p-4">{getTypeIcon(incident.type)}</td>
                    <td className="p-4">{incident.title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPhaseColor(incident.phase)}`}>
                        {incident.phase}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatTimeAgo(incident.detectedAt)}</td>
                    <td className="p-4 text-neutral-300">{incident.incidentCommander || incident.assignedTo}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : stryMutAct_9fa48("28494") ? false : stryMutAct_9fa48("28493") ? true : (stryCov_9fa48("28493", "28494", "28495"), (stryMutAct_9fa48("28497") ? activeTab !== 'incidents' : stryMutAct_9fa48("28496") ? true : (stryCov_9fa48("28496", "28497"), activeTab === 'incidents')) && <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select value={filterSeverity} onChange={stryMutAct_9fa48("28499") ? () => undefined : (stryCov_9fa48("28499"), e => setFilterSeverity(e.target.value as IncidentSeverity | 'all'))} className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Severities</option>
              <option value="P1">P1 - Critical</option>
              <option value="P2">P2 - High</option>
              <option value="P3">P3 - Medium</option>
              <option value="P4">P4 - Low</option>
            </select>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors">
              + Report Incident
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Type</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Title</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Phase</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Detected</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Commander</th>
                </tr>
              </thead>
              <tbody>
                {filteredIncidents.map(stryMutAct_9fa48("28500") ? () => undefined : (stryCov_9fa48("28500"), incident => <tr key={incident.id} onClick={stryMutAct_9fa48("28501") ? () => undefined : (stryCov_9fa48("28501"), () => setSelectedIncident(incident))} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4 font-mono text-sm">{incident.id}</td>
                    <td className="p-4">{getTypeIcon(incident.type)}</td>
                    <td className="p-4">{incident.title}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getSeverityColor(incident.severity)}`}>
                        {incident.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getPhaseColor(incident.phase)}`}>
                        {incident.phase}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatTimeAgo(incident.detectedAt)}</td>
                    <td className="p-4 text-neutral-300">{stryMutAct_9fa48("28506") ? incident.incidentCommander && incident.assignedTo : stryMutAct_9fa48("28505") ? false : stryMutAct_9fa48("28504") ? true : (stryCov_9fa48("28504", "28505", "28506"), incident.incidentCommander || incident.assignedTo)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* War Room Tab */}
      {stryMutAct_9fa48("28509") ? activeTab === 'war-room' || <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-neutral-800 rounded-xl border border-red-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <h2 className="text-xl font-semibold">{mockWarRoom.name}</h2>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  Active • {formatTimeAgo(mockWarRoom.startedAt)}
                </span>
              </div>
              
              <div className="bg-neutral-900 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Linked Incident</h3>
                <p className="font-mono">{mockWarRoom.incidentId} - {mockIncidents.find(i => i.id === mockWarRoom.incidentId)?.title}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400">War Room Decisions</h3>
                {mockWarRoom.decisions.map((decision, idx) => <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-900 rounded-lg">
                    <span className="text-green-500">✓</span>
                    <div>
                      <p>{decision.text}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {decision.madeBy} • {formatTimeAgo(decision.timestamp)}
                      </p>
                    </div>
                  </div>)}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                {[{
              label: 'Escalate to P1',
              icon: '⬆️',
              color: 'bg-red-600 hover:bg-red-700'
            }, {
              label: 'Notify Stakeholders',
              icon: '📧',
              color: 'bg-blue-600 hover:bg-blue-700'
            }, {
              label: 'Start Council Deliberation',
              icon: '🧠',
              color: 'bg-purple-600 hover:bg-purple-700'
            }, {
              label: 'Log Decision',
              icon: '📝',
              color: 'bg-green-600 hover:bg-green-700'
            }, {
              label: 'Request Resources',
              icon: '🔧',
              color: 'bg-orange-600 hover:bg-orange-700'
            }, {
              label: 'Close Incident',
              icon: '✅',
              color: 'bg-neutral-600 hover:bg-neutral-700'
            }].map(action => <button key={action.label} className={`${action.color} text-white rounded-lg p-3 text-sm font-medium transition-colors`}>
                    {action.icon} {action.label}
                  </button>)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Participants ({mockWarRoom.participants.length})</h3>
              <div className="space-y-3">
                {mockWarRoom.participants.map(p => <div key={p.name} className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${p.online ? 'bg-green-500' : 'bg-neutral-500'}`}></span>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-neutral-400">{p.role}</p>
                    </div>
                  </div>)}
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                + Invite Participant
              </button>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Communication Channels</h3>
              <div className="space-y-2">
                {[{
              name: 'Slack: #incident-response',
              status: 'connected'
            }, {
              name: 'Video Call',
              status: 'ready'
            }, {
              name: 'Status Page',
              status: 'draft'
            }].map(channel => <div key={channel.name} className="flex items-center justify-between p-2 bg-neutral-900 rounded">
                    <span className="text-sm">{channel.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${channel.status === 'connected' ? 'bg-green-500/20 text-green-400' : channel.status === 'ready' ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {channel.status}
                    </span>
                  </div>)}
              </div>
            </div>
          </div>
        </div> : stryMutAct_9fa48("28508") ? false : stryMutAct_9fa48("28507") ? true : (stryCov_9fa48("28507", "28508", "28509"), (stryMutAct_9fa48("28511") ? activeTab !== 'war-room' : stryMutAct_9fa48("28510") ? true : (stryCov_9fa48("28510", "28511"), activeTab === 'war-room')) && <div className="grid grid-cols-3 gap-6">
          <div className="col-span-2 space-y-4">
            <div className="bg-neutral-800 rounded-xl border border-red-500/30 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <span className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></span>
                  <h2 className="text-xl font-semibold">{mockWarRoom.name}</h2>
                </div>
                <span className="px-3 py-1 bg-red-500/20 text-red-400 rounded-full text-sm">
                  Active • {formatTimeAgo(mockWarRoom.startedAt)}
                </span>
              </div>
              
              <div className="bg-neutral-900 rounded-lg p-4 mb-4">
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Linked Incident</h3>
                <p className="font-mono">{mockWarRoom.incidentId} - {stryMutAct_9fa48("28513") ? mockIncidents.find(i => i.id === mockWarRoom.incidentId).title : (stryCov_9fa48("28513"), mockIncidents.find(stryMutAct_9fa48("28514") ? () => undefined : (stryCov_9fa48("28514"), i => stryMutAct_9fa48("28517") ? i.id !== mockWarRoom.incidentId : stryMutAct_9fa48("28516") ? false : stryMutAct_9fa48("28515") ? true : (stryCov_9fa48("28515", "28516", "28517"), i.id === mockWarRoom.incidentId)))?.title)}</p>
              </div>

              <div className="space-y-3">
                <h3 className="text-sm font-medium text-neutral-400">War Room Decisions</h3>
                {mockWarRoom.decisions.map(stryMutAct_9fa48("28518") ? () => undefined : (stryCov_9fa48("28518"), (decision, idx) => <div key={idx} className="flex items-start gap-3 p-3 bg-neutral-900 rounded-lg">
                    <span className="text-green-500">✓</span>
                    <div>
                      <p>{decision.text}</p>
                      <p className="text-sm text-neutral-500 mt-1">
                        {decision.madeBy} • {formatTimeAgo(decision.timestamp)}
                      </p>
                    </div>
                  </div>))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Quick Actions</h3>
              <div className="grid grid-cols-3 gap-3">
                {(stryMutAct_9fa48("28519") ? [] : (stryCov_9fa48("28519"), [stryMutAct_9fa48("28520") ? {} : (stryCov_9fa48("28520"), {
              label: 'Escalate to P1',
              icon: '⬆️',
              color: 'bg-red-600 hover:bg-red-700'
            }), stryMutAct_9fa48("28524") ? {} : (stryCov_9fa48("28524"), {
              label: 'Notify Stakeholders',
              icon: '📧',
              color: 'bg-blue-600 hover:bg-blue-700'
            }), stryMutAct_9fa48("28528") ? {} : (stryCov_9fa48("28528"), {
              label: 'Start Council Deliberation',
              icon: '🧠',
              color: 'bg-purple-600 hover:bg-purple-700'
            }), stryMutAct_9fa48("28532") ? {} : (stryCov_9fa48("28532"), {
              label: 'Log Decision',
              icon: '📝',
              color: 'bg-green-600 hover:bg-green-700'
            }), stryMutAct_9fa48("28536") ? {} : (stryCov_9fa48("28536"), {
              label: 'Request Resources',
              icon: '🔧',
              color: 'bg-orange-600 hover:bg-orange-700'
            }), stryMutAct_9fa48("28540") ? {} : (stryCov_9fa48("28540"), {
              label: 'Close Incident',
              icon: '✅',
              color: 'bg-neutral-600 hover:bg-neutral-700'
            })])).map(stryMutAct_9fa48("28544") ? () => undefined : (stryCov_9fa48("28544"), action => <button key={action.label} className={`${action.color} text-white rounded-lg p-3 text-sm font-medium transition-colors`}>
                    {action.icon} {action.label}
                  </button>))}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Participants ({mockWarRoom.participants.length})</h3>
              <div className="space-y-3">
                {mockWarRoom.participants.map(stryMutAct_9fa48("28546") ? () => undefined : (stryCov_9fa48("28546"), p => <div key={p.name} className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full ${p.online ? 'bg-green-500' : 'bg-neutral-500'}`}></span>
                    <div>
                      <p className="font-medium">{p.name}</p>
                      <p className="text-sm text-neutral-400">{p.role}</p>
                    </div>
                  </div>))}
              </div>
              <button className="w-full mt-4 px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                + Invite Participant
              </button>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="font-semibold mb-4">Communication Channels</h3>
              <div className="space-y-2">
                {(stryMutAct_9fa48("28550") ? [] : (stryCov_9fa48("28550"), [stryMutAct_9fa48("28551") ? {} : (stryCov_9fa48("28551"), {
              name: 'Slack: #incident-response',
              status: 'connected'
            }), stryMutAct_9fa48("28554") ? {} : (stryCov_9fa48("28554"), {
              name: 'Video Call',
              status: 'ready'
            }), stryMutAct_9fa48("28557") ? {} : (stryCov_9fa48("28557"), {
              name: 'Status Page',
              status: 'draft'
            })])).map(stryMutAct_9fa48("28560") ? () => undefined : (stryCov_9fa48("28560"), channel => <div key={channel.name} className="flex items-center justify-between p-2 bg-neutral-900 rounded">
                    <span className="text-sm">{channel.name}</span>
                    <span className={`text-xs px-2 py-0.5 rounded ${(stryMutAct_9fa48("28564") ? channel.status !== 'connected' : stryMutAct_9fa48("28563") ? false : stryMutAct_9fa48("28562") ? true : (stryCov_9fa48("28562", "28563", "28564"), channel.status === 'connected')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("28569") ? channel.status !== 'ready' : stryMutAct_9fa48("28568") ? false : stryMutAct_9fa48("28567") ? true : (stryCov_9fa48("28567", "28568", "28569"), channel.status === 'ready')) ? 'bg-blue-500/20 text-blue-400' : 'bg-yellow-500/20 text-yellow-400'}`}>
                      {channel.status}
                    </span>
                  </div>))}
              </div>
            </div>
          </div>
        </div>)}

      {/* Playbooks Tab */}
      {stryMutAct_9fa48("28575") ? activeTab === 'playbooks' || <div className="grid grid-cols-3 gap-4">
          {[{
        name: 'Security Incident Response',
        type: 'security',
        steps: 8,
        lastUsed: '2 days ago',
        sla: '15 min triage'
      }, {
        name: 'PR Crisis Response',
        type: 'pr',
        steps: 6,
        lastUsed: '1 week ago',
        sla: '60 min statement'
      }, {
        name: 'Data Breach Protocol',
        type: 'security',
        steps: 12,
        lastUsed: 'Never',
        sla: '4 hr notification'
      }, {
        name: 'Service Outage',
        type: 'operational',
        steps: 7,
        lastUsed: '3 days ago',
        sla: '5 min detection'
      }, {
        name: 'Compliance Violation',
        type: 'compliance',
        steps: 10,
        lastUsed: '2 weeks ago',
        sla: '24 hr remediation'
      }, {
        name: 'Legal Threat',
        type: 'legal',
        steps: 5,
        lastUsed: 'Never',
        sla: '4 hr legal review'
      }].map(playbook => <div key={playbook.name} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-primary-500 cursor-pointer transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getTypeIcon(playbook.type as IncidentType)}</span>
                <h3 className="font-semibold">{playbook.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-neutral-400">{playbook.steps} steps</p>
                <p className="text-neutral-400">SLA: {playbook.sla}</p>
                <p className="text-neutral-500">Last used: {playbook.lastUsed}</p>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Activate Playbook
              </button>
            </div>)}
        </div> : stryMutAct_9fa48("28574") ? false : stryMutAct_9fa48("28573") ? true : (stryCov_9fa48("28573", "28574", "28575"), (stryMutAct_9fa48("28577") ? activeTab !== 'playbooks' : stryMutAct_9fa48("28576") ? true : (stryCov_9fa48("28576", "28577"), activeTab === 'playbooks')) && <div className="grid grid-cols-3 gap-4">
          {(stryMutAct_9fa48("28579") ? [] : (stryCov_9fa48("28579"), [stryMutAct_9fa48("28580") ? {} : (stryCov_9fa48("28580"), {
        name: 'Security Incident Response',
        type: 'security',
        steps: 8,
        lastUsed: '2 days ago',
        sla: '15 min triage'
      }), stryMutAct_9fa48("28585") ? {} : (stryCov_9fa48("28585"), {
        name: 'PR Crisis Response',
        type: 'pr',
        steps: 6,
        lastUsed: '1 week ago',
        sla: '60 min statement'
      }), stryMutAct_9fa48("28590") ? {} : (stryCov_9fa48("28590"), {
        name: 'Data Breach Protocol',
        type: 'security',
        steps: 12,
        lastUsed: 'Never',
        sla: '4 hr notification'
      }), stryMutAct_9fa48("28595") ? {} : (stryCov_9fa48("28595"), {
        name: 'Service Outage',
        type: 'operational',
        steps: 7,
        lastUsed: '3 days ago',
        sla: '5 min detection'
      }), stryMutAct_9fa48("28600") ? {} : (stryCov_9fa48("28600"), {
        name: 'Compliance Violation',
        type: 'compliance',
        steps: 10,
        lastUsed: '2 weeks ago',
        sla: '24 hr remediation'
      }), stryMutAct_9fa48("28605") ? {} : (stryCov_9fa48("28605"), {
        name: 'Legal Threat',
        type: 'legal',
        steps: 5,
        lastUsed: 'Never',
        sla: '4 hr legal review'
      })])).map(stryMutAct_9fa48("28610") ? () => undefined : (stryCov_9fa48("28610"), playbook => <div key={playbook.name} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 hover:border-primary-500 cursor-pointer transition-all">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">{getTypeIcon(playbook.type as IncidentType)}</span>
                <h3 className="font-semibold">{playbook.name}</h3>
              </div>
              <div className="space-y-2 text-sm">
                <p className="text-neutral-400">{playbook.steps} steps</p>
                <p className="text-neutral-400">SLA: {playbook.sla}</p>
                <p className="text-neutral-500">Last used: {playbook.lastUsed}</p>
              </div>
              <button className="w-full mt-4 px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Activate Playbook
              </button>
            </div>))}
        </div>)}

      {/* Incident Detail Modal */}
      {stryMutAct_9fa48("28613") ? selectedIncident || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(selectedIncident.type)}</span>
                    <span className="font-mono text-neutral-500">{selectedIncident.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(selectedIncident.severity)}`}>
                      {selectedIncident.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(selectedIncident.phase)}`}>
                      {selectedIncident.phase}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedIncident.title}</h2>
                </div>
                <button onClick={() => setSelectedIncident(null)} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Description</h3>
                <p>{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Incident Commander</h3>
                  <p>{selectedIncident.incidentCommander || selectedIncident.assignedTo}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Detected</h3>
                  <p>{selectedIncident.detectedAt.toLocaleString()}</p>
                </div>
              </div>

              {selectedIncident.affectedSystems.length > 0 && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Affected Systems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedSystems.map(sys => <span key={sys} className="px-3 py-1 bg-neutral-700 rounded-full text-sm">{sys}</span>)}
                  </div>
                </div>}

              {selectedIncident.containmentActions.length > 0 && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Containment Actions</h3>
                  <ul className="space-y-2">
                    {selectedIncident.containmentActions.map((action, idx) => <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {action}
                      </li>)}
                  </ul>
                </div>}

              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Timeline</h3>
                <div className="space-y-3">
                  {selectedIncident.timeline.map(event => <div key={event.id} className="flex items-start gap-3 p-3 bg-neutral-900 rounded-lg">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(event.phase)}`}>
                        {event.phase}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-neutral-400">{event.details}</p>
                        <p className="text-xs text-neutral-500 mt-1">{event.actor} • {event.timestamp.toLocaleString()}</p>
                      </div>
                    </div>)}
                </div>
              </div>

              {selectedIncident.rootCause && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Root Cause</h3>
                  <p className="p-3 bg-neutral-900 rounded-lg">{selectedIncident.rootCause}</p>
                </div>}

              {selectedIncident.lessonsLearned && selectedIncident.lessonsLearned.length > 0 && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Lessons Learned</h3>
                  <ul className="space-y-2">
                    {selectedIncident.lessonsLearned.map((lesson, idx) => <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-400">💡</span>
                        {lesson}
                      </li>)}
                  </ul>
                </div>}
            </div>

            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                View Full Audit Trail
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Open in War Room
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("28612") ? false : stryMutAct_9fa48("28611") ? true : (stryCov_9fa48("28611", "28612", "28613"), selectedIncident && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-2xl">{getTypeIcon(selectedIncident.type)}</span>
                    <span className="font-mono text-neutral-500">{selectedIncident.id}</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium border ${getSeverityColor(selectedIncident.severity)}`}>
                      {selectedIncident.severity}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(selectedIncident.phase)}`}>
                      {selectedIncident.phase}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold">{selectedIncident.title}</h2>
                </div>
                <button onClick={stryMutAct_9fa48("28616") ? () => undefined : (stryCov_9fa48("28616"), () => setSelectedIncident(null))} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Description</h3>
                <p>{selectedIncident.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Incident Commander</h3>
                  <p>{stryMutAct_9fa48("28619") ? selectedIncident.incidentCommander && selectedIncident.assignedTo : stryMutAct_9fa48("28618") ? false : stryMutAct_9fa48("28617") ? true : (stryCov_9fa48("28617", "28618", "28619"), selectedIncident.incidentCommander || selectedIncident.assignedTo)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Detected</h3>
                  <p>{selectedIncident.detectedAt.toLocaleString()}</p>
                </div>
              </div>

              {stryMutAct_9fa48("28622") ? selectedIncident.affectedSystems.length > 0 || <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Affected Systems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedSystems.map(sys => <span key={sys} className="px-3 py-1 bg-neutral-700 rounded-full text-sm">{sys}</span>)}
                  </div>
                </div> : stryMutAct_9fa48("28621") ? false : stryMutAct_9fa48("28620") ? true : (stryCov_9fa48("28620", "28621", "28622"), (stryMutAct_9fa48("28625") ? selectedIncident.affectedSystems.length <= 0 : stryMutAct_9fa48("28624") ? selectedIncident.affectedSystems.length >= 0 : stryMutAct_9fa48("28623") ? true : (stryCov_9fa48("28623", "28624", "28625"), selectedIncident.affectedSystems.length > 0)) && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Affected Systems</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedIncident.affectedSystems.map(stryMutAct_9fa48("28626") ? () => undefined : (stryCov_9fa48("28626"), sys => <span key={sys} className="px-3 py-1 bg-neutral-700 rounded-full text-sm">{sys}</span>))}
                  </div>
                </div>)}

              {stryMutAct_9fa48("28629") ? selectedIncident.containmentActions.length > 0 || <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Containment Actions</h3>
                  <ul className="space-y-2">
                    {selectedIncident.containmentActions.map((action, idx) => <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {action}
                      </li>)}
                  </ul>
                </div> : stryMutAct_9fa48("28628") ? false : stryMutAct_9fa48("28627") ? true : (stryCov_9fa48("28627", "28628", "28629"), (stryMutAct_9fa48("28632") ? selectedIncident.containmentActions.length <= 0 : stryMutAct_9fa48("28631") ? selectedIncident.containmentActions.length >= 0 : stryMutAct_9fa48("28630") ? true : (stryCov_9fa48("28630", "28631", "28632"), selectedIncident.containmentActions.length > 0)) && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Containment Actions</h3>
                  <ul className="space-y-2">
                    {selectedIncident.containmentActions.map(stryMutAct_9fa48("28633") ? () => undefined : (stryCov_9fa48("28633"), (action, idx) => <li key={idx} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        {action}
                      </li>))}
                  </ul>
                </div>)}

              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-2">Timeline</h3>
                <div className="space-y-3">
                  {selectedIncident.timeline.map(stryMutAct_9fa48("28634") ? () => undefined : (stryCov_9fa48("28634"), event => <div key={event.id} className="flex items-start gap-3 p-3 bg-neutral-900 rounded-lg">
                      <span className={`px-2 py-0.5 rounded text-xs font-medium ${getPhaseColor(event.phase)}`}>
                        {event.phase}
                      </span>
                      <div className="flex-1">
                        <p className="font-medium">{event.action}</p>
                        <p className="text-sm text-neutral-400">{event.details}</p>
                        <p className="text-xs text-neutral-500 mt-1">{event.actor} • {event.timestamp.toLocaleString()}</p>
                      </div>
                    </div>))}
                </div>
              </div>

              {stryMutAct_9fa48("28638") ? selectedIncident.rootCause || <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Root Cause</h3>
                  <p className="p-3 bg-neutral-900 rounded-lg">{selectedIncident.rootCause}</p>
                </div> : stryMutAct_9fa48("28637") ? false : stryMutAct_9fa48("28636") ? true : (stryCov_9fa48("28636", "28637", "28638"), selectedIncident.rootCause && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Root Cause</h3>
                  <p className="p-3 bg-neutral-900 rounded-lg">{selectedIncident.rootCause}</p>
                </div>)}

              {stryMutAct_9fa48("28641") ? selectedIncident.lessonsLearned && selectedIncident.lessonsLearned.length > 0 || <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Lessons Learned</h3>
                  <ul className="space-y-2">
                    {selectedIncident.lessonsLearned.map((lesson, idx) => <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-400">💡</span>
                        {lesson}
                      </li>)}
                  </ul>
                </div> : stryMutAct_9fa48("28640") ? false : stryMutAct_9fa48("28639") ? true : (stryCov_9fa48("28639", "28640", "28641"), (stryMutAct_9fa48("28643") ? selectedIncident.lessonsLearned || selectedIncident.lessonsLearned.length > 0 : stryMutAct_9fa48("28642") ? true : (stryCov_9fa48("28642", "28643"), selectedIncident.lessonsLearned && (stryMutAct_9fa48("28646") ? selectedIncident.lessonsLearned.length <= 0 : stryMutAct_9fa48("28645") ? selectedIncident.lessonsLearned.length >= 0 : stryMutAct_9fa48("28644") ? true : (stryCov_9fa48("28644", "28645", "28646"), selectedIncident.lessonsLearned.length > 0)))) && <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-2">Lessons Learned</h3>
                  <ul className="space-y-2">
                    {selectedIncident.lessonsLearned.map(stryMutAct_9fa48("28647") ? () => undefined : (stryCov_9fa48("28647"), (lesson, idx) => <li key={idx} className="flex items-center gap-2">
                        <span className="text-blue-400">💡</span>
                        {lesson}
                      </li>))}
                  </ul>
                </div>)}
            </div>

            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              <button className="px-4 py-2 border border-neutral-600 text-neutral-300 rounded-lg hover:bg-neutral-700 transition-colors">
                View Full Audit Trail
              </button>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Open in War Room
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default CrisisManagementPage;