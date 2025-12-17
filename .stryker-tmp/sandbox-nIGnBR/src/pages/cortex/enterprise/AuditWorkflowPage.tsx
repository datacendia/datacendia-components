// @ts-nocheck
// =============================================================================
// CENDIA AUDIT WORKFLOW™ - COMPLIANCE AUDIT MANAGEMENT
// T-90 to Post-Audit lifecycle management with automated checklists
// "From Planning to Closeout • Full Evidence Management"
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
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

// =============================================================================
// TYPES
// =============================================================================

type AuditPhase = 'planning' | 'readiness' | 'remediation' | 'mock-audit' | 'final-prep' | 'execution' | 'closeout';
type TaskStatus = 'pending' | 'in-progress' | 'complete' | 'blocked' | 'not-applicable';
type AuditType = 'SOC2' | 'ISO27001' | 'HIPAA' | 'GDPR' | 'PCI-DSS' | 'FedRAMP' | 'Custom';
type FindingSeverity = 'critical' | 'high' | 'medium' | 'low' | 'informational';
interface AuditTask {
  id: string;
  title: string;
  description: string;
  phase: AuditPhase;
  status: TaskStatus;
  assignee: string;
  dueDate: Date;
  completedDate?: Date;
  evidence?: string[];
  notes?: string;
  dependencies?: string[];
}
interface AuditFinding {
  id: string;
  title: string;
  description: string;
  severity: FindingSeverity;
  control: string;
  status: 'open' | 'remediated' | 'accepted' | 'disputed';
  assignee: string;
  dueDate: Date;
  remediation?: string;
}
interface Audit {
  id: string;
  name: string;
  type: AuditType;
  auditor: string;
  startDate: Date;
  targetDate: Date;
  currentPhase: AuditPhase;
  progress: number;
  tasks: AuditTask[];
  findings: AuditFinding[];
  team: {
    name: string;
    role: string;
  }[];
}

// =============================================================================
// MOCK DATA
// =============================================================================

const phases: {
  id: AuditPhase;
  name: string;
  daysOut: string;
  icon: string;
}[] = stryMutAct_9fa48("26368") ? [] : (stryCov_9fa48("26368"), [stryMutAct_9fa48("26369") ? {} : (stryCov_9fa48("26369"), {
  id: 'planning',
  name: 'Planning',
  daysOut: 'T-90',
  icon: '📋'
}), stryMutAct_9fa48("26374") ? {} : (stryCov_9fa48("26374"), {
  id: 'readiness',
  name: 'Readiness Assessment',
  daysOut: 'T-60',
  icon: '🔍'
}), stryMutAct_9fa48("26379") ? {} : (stryCov_9fa48("26379"), {
  id: 'remediation',
  name: 'Remediation',
  daysOut: 'T-45',
  icon: '🔧'
}), stryMutAct_9fa48("26384") ? {} : (stryCov_9fa48("26384"), {
  id: 'mock-audit',
  name: 'Mock Audit',
  daysOut: 'T-14',
  icon: '🎭'
}), stryMutAct_9fa48("26389") ? {} : (stryCov_9fa48("26389"), {
  id: 'final-prep',
  name: 'Final Prep',
  daysOut: 'T-7',
  icon: '✅'
}), stryMutAct_9fa48("26394") ? {} : (stryCov_9fa48("26394"), {
  id: 'execution',
  name: 'Audit Week',
  daysOut: 'T-0',
  icon: '📊'
}), stryMutAct_9fa48("26399") ? {} : (stryCov_9fa48("26399"), {
  id: 'closeout',
  name: 'Closeout',
  daysOut: 'Post',
  icon: '🏁'
})]);
const mockAudit: Audit = stryMutAct_9fa48("26404") ? {} : (stryCov_9fa48("26404"), {
  id: 'AUD-2026-001',
  name: 'SOC 2 Type II Annual Audit',
  type: 'SOC2',
  auditor: 'Deloitte',
  startDate: new Date('2026-01-15'),
  targetDate: new Date('2026-04-15'),
  currentPhase: 'remediation',
  progress: 42,
  team: stryMutAct_9fa48("26412") ? [] : (stryCov_9fa48("26412"), [stryMutAct_9fa48("26413") ? {} : (stryCov_9fa48("26413"), {
    name: 'Sarah Chen',
    role: 'Audit Lead'
  }), stryMutAct_9fa48("26416") ? {} : (stryCov_9fa48("26416"), {
    name: 'Mike Torres',
    role: 'Security'
  }), stryMutAct_9fa48("26419") ? {} : (stryCov_9fa48("26419"), {
    name: 'Lisa Park',
    role: 'Compliance'
  }), stryMutAct_9fa48("26422") ? {} : (stryCov_9fa48("26422"), {
    name: 'James Wilson',
    role: 'Engineering'
  })]),
  tasks: stryMutAct_9fa48("26425") ? [] : (stryCov_9fa48("26425"), [// Planning Phase
  stryMutAct_9fa48("26426") ? {} : (stryCov_9fa48("26426"), {
    id: 'T001',
    title: 'Confirm audit scope with Deloitte',
    description: 'Review and finalize scope document',
    phase: 'planning',
    status: 'complete',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-01-20'),
    completedDate: new Date('2026-01-18')
  }), stryMutAct_9fa48("26435") ? {} : (stryCov_9fa48("26435"), {
    id: 'T002',
    title: 'Assign audit team members',
    description: 'Identify and assign roles',
    phase: 'planning',
    status: 'complete',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-01-22'),
    completedDate: new Date('2026-01-21')
  }), stryMutAct_9fa48("26444") ? {} : (stryCov_9fa48("26444"), {
    id: 'T003',
    title: 'Create master timeline',
    description: 'Build project plan with milestones',
    phase: 'planning',
    status: 'complete',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-01-25'),
    completedDate: new Date('2026-01-24')
  }), // Readiness Phase
  stryMutAct_9fa48("26453") ? {} : (stryCov_9fa48("26453"), {
    id: 'T004',
    title: 'Council Deliberation: Risk Assessment',
    description: 'AI-assisted gap analysis across all controls',
    phase: 'readiness',
    status: 'complete',
    assignee: 'Mike Torres',
    dueDate: new Date('2026-02-01'),
    completedDate: new Date('2026-01-30')
  }), stryMutAct_9fa48("26462") ? {} : (stryCov_9fa48("26462"), {
    id: 'T005',
    title: 'Gap analysis by control domain',
    description: 'Document gaps per TSC category',
    phase: 'readiness',
    status: 'complete',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-02-05'),
    completedDate: new Date('2026-02-04')
  }), stryMutAct_9fa48("26471") ? {} : (stryCov_9fa48("26471"), {
    id: 'T006',
    title: 'Create risk-ranked remediation list',
    description: 'Prioritize findings by risk score',
    phase: 'readiness',
    status: 'complete',
    assignee: 'Mike Torres',
    dueDate: new Date('2026-02-08'),
    completedDate: new Date('2026-02-07')
  }), // Remediation Phase
  stryMutAct_9fa48("26480") ? {} : (stryCov_9fa48("26480"), {
    id: 'T007',
    title: 'Address CC6.1 - Access Control gaps',
    description: 'Implement MFA for all admin accounts',
    phase: 'remediation',
    status: 'complete',
    assignee: 'James Wilson',
    dueDate: new Date('2026-02-20'),
    completedDate: new Date('2026-02-18')
  }), stryMutAct_9fa48("26489") ? {} : (stryCov_9fa48("26489"), {
    id: 'T008',
    title: 'Address CC7.2 - Monitoring gaps',
    description: 'Deploy enhanced logging',
    phase: 'remediation',
    status: 'in-progress',
    assignee: 'James Wilson',
    dueDate: new Date('2026-02-25')
  }), stryMutAct_9fa48("26497") ? {} : (stryCov_9fa48("26497"), {
    id: 'T009',
    title: 'Update security policies',
    description: 'Revise and publish updated policies',
    phase: 'remediation',
    status: 'in-progress',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-02-28')
  }), stryMutAct_9fa48("26505") ? {} : (stryCov_9fa48("26505"), {
    id: 'T010',
    title: 'Begin evidence gathering',
    description: 'Collect screenshots, logs, configs',
    phase: 'remediation',
    status: 'pending',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-03-01')
  }), // Mock Audit
  stryMutAct_9fa48("26513") ? {} : (stryCov_9fa48("26513"), {
    id: 'T011',
    title: 'Internal walkthrough - Security',
    description: 'Security control testing',
    phase: 'mock-audit',
    status: 'pending',
    assignee: 'Mike Torres',
    dueDate: new Date('2026-03-20')
  }), stryMutAct_9fa48("26521") ? {} : (stryCov_9fa48("26521"), {
    id: 'T012',
    title: 'Internal walkthrough - Operations',
    description: 'Ops control testing',
    phase: 'mock-audit',
    status: 'pending',
    assignee: 'James Wilson',
    dueDate: new Date('2026-03-22')
  }), stryMutAct_9fa48("26529") ? {} : (stryCov_9fa48("26529"), {
    id: 'T013',
    title: 'Finding simulation',
    description: 'Document potential findings',
    phase: 'mock-audit',
    status: 'pending',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-03-25')
  }), // Final Prep
  stryMutAct_9fa48("26537") ? {} : (stryCov_9fa48("26537"), {
    id: 'T014',
    title: 'Evidence package complete',
    description: 'All evidence organized and verified',
    phase: 'final-prep',
    status: 'pending',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-04-01')
  }), stryMutAct_9fa48("26545") ? {} : (stryCov_9fa48("26545"), {
    id: 'T015',
    title: 'Team briefing',
    description: 'Final prep meeting with all stakeholders',
    phase: 'final-prep',
    status: 'pending',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-04-05')
  }), stryMutAct_9fa48("26553") ? {} : (stryCov_9fa48("26553"), {
    id: 'T016',
    title: 'Logistics confirmed',
    description: 'Meeting rooms, access, schedules',
    phase: 'final-prep',
    status: 'pending',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-04-08')
  }), // Execution
  stryMutAct_9fa48("26561") ? {} : (stryCov_9fa48("26561"), {
    id: 'T017',
    title: 'Daily standup - Day 1',
    description: 'Morning sync with audit team',
    phase: 'execution',
    status: 'pending',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-04-15')
  }), stryMutAct_9fa48("26569") ? {} : (stryCov_9fa48("26569"), {
    id: 'T018',
    title: 'Evidence request responses',
    description: 'Respond to auditor requests within SLA',
    phase: 'execution',
    status: 'pending',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-04-18')
  }), // Closeout
  stryMutAct_9fa48("26577") ? {} : (stryCov_9fa48("26577"), {
    id: 'T019',
    title: 'Exit meeting',
    description: 'Review preliminary findings',
    phase: 'closeout',
    status: 'pending',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-04-22')
  }), stryMutAct_9fa48("26585") ? {} : (stryCov_9fa48("26585"), {
    id: 'T020',
    title: 'Management response',
    description: 'Draft responses to findings',
    phase: 'closeout',
    status: 'pending',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-04-25')
  }), stryMutAct_9fa48("26593") ? {} : (stryCov_9fa48("26593"), {
    id: 'T021',
    title: 'Lessons learned',
    description: 'Document improvements for next audit',
    phase: 'closeout',
    status: 'pending',
    assignee: 'Sarah Chen',
    dueDate: new Date('2026-04-30')
  })]),
  findings: stryMutAct_9fa48("26601") ? [] : (stryCov_9fa48("26601"), [stryMutAct_9fa48("26602") ? {} : (stryCov_9fa48("26602"), {
    id: 'F001',
    title: 'MFA not enforced for service accounts',
    description: 'Several service accounts lack MFA',
    severity: 'high',
    control: 'CC6.1',
    status: 'remediated',
    assignee: 'James Wilson',
    dueDate: new Date('2026-02-20'),
    remediation: 'Implemented MFA for all service accounts'
  }), stryMutAct_9fa48("26612") ? {} : (stryCov_9fa48("26612"), {
    id: 'F002',
    title: 'Log retention below 12 months',
    description: 'Current retention is 6 months',
    severity: 'medium',
    control: 'CC7.2',
    status: 'open',
    assignee: 'James Wilson',
    dueDate: new Date('2026-02-25')
  }), stryMutAct_9fa48("26621") ? {} : (stryCov_9fa48("26621"), {
    id: 'F003',
    title: 'Incident response plan outdated',
    description: 'Last updated 18 months ago',
    severity: 'medium',
    control: 'CC7.4',
    status: 'open',
    assignee: 'Lisa Park',
    dueDate: new Date('2026-02-28')
  })])
});

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

const getStatusColor = (status: TaskStatus) => {
  switch (status) {
    case 'complete':
      if (stryMutAct_9fa48("26631")) {} else {
        stryCov_9fa48("26631");
        return 'bg-green-500/20 text-green-400 border-green-500/30';
      }
    case 'in-progress':
      if (stryMutAct_9fa48("26634")) {} else {
        stryCov_9fa48("26634");
        return 'bg-blue-500/20 text-blue-400 border-blue-500/30';
      }
    case 'pending':
      if (stryMutAct_9fa48("26637")) {} else {
        stryCov_9fa48("26637");
        return 'bg-neutral-500/20 text-neutral-400 border-neutral-500/30';
      }
    case 'blocked':
      if (stryMutAct_9fa48("26640")) {} else {
        stryCov_9fa48("26640");
        return 'bg-red-500/20 text-red-400 border-red-500/30';
      }
    case 'not-applicable':
      if (stryMutAct_9fa48("26643")) {} else {
        stryCov_9fa48("26643");
        return 'bg-neutral-700/20 text-neutral-500 border-neutral-700/30';
      }
  }
};
const getSeverityColor = (severity: FindingSeverity) => {
  switch (severity) {
    case 'critical':
      if (stryMutAct_9fa48("26647")) {} else {
        stryCov_9fa48("26647");
        return 'bg-red-500/20 text-red-400';
      }
    case 'high':
      if (stryMutAct_9fa48("26650")) {} else {
        stryCov_9fa48("26650");
        return 'bg-orange-500/20 text-orange-400';
      }
    case 'medium':
      if (stryMutAct_9fa48("26653")) {} else {
        stryCov_9fa48("26653");
        return 'bg-yellow-500/20 text-yellow-400';
      }
    case 'low':
      if (stryMutAct_9fa48("26656")) {} else {
        stryCov_9fa48("26656");
        return 'bg-blue-500/20 text-blue-400';
      }
    case 'informational':
      if (stryMutAct_9fa48("26659")) {} else {
        stryCov_9fa48("26659");
        return 'bg-neutral-500/20 text-neutral-400';
      }
  }
};
const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', stryMutAct_9fa48("26664") ? {} : (stryCov_9fa48("26664"), {
    month: 'short',
    day: 'numeric'
  }));
};
const getDaysUntil = (date: Date) => {
  const days = Math.ceil(stryMutAct_9fa48("26668") ? (date.getTime() - Date.now()) * (1000 * 60 * 60 * 24) : (stryCov_9fa48("26668"), (stryMutAct_9fa48("26669") ? date.getTime() + Date.now() : (stryCov_9fa48("26669"), date.getTime() - Date.now())) / (stryMutAct_9fa48("26670") ? 1000 * 60 * 60 / 24 : (stryCov_9fa48("26670"), (stryMutAct_9fa48("26671") ? 1000 * 60 / 60 : (stryCov_9fa48("26671"), (stryMutAct_9fa48("26672") ? 1000 / 60 : (stryCov_9fa48("26672"), 1000 * 60)) * 60)) * 24))));
  if (stryMutAct_9fa48("26676") ? days >= 0 : stryMutAct_9fa48("26675") ? days <= 0 : stryMutAct_9fa48("26674") ? false : stryMutAct_9fa48("26673") ? true : (stryCov_9fa48("26673", "26674", "26675", "26676"), days < 0)) return `${Math.abs(days)}d overdue`;
  if (stryMutAct_9fa48("26680") ? days !== 0 : stryMutAct_9fa48("26679") ? false : stryMutAct_9fa48("26678") ? true : (stryCov_9fa48("26678", "26679", "26680"), days === 0)) return 'Today';
  return `${days}d`;
};

// =============================================================================
// COMPONENT
// =============================================================================

export const AuditWorkflowPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'timeline' | 'tasks' | 'findings' | 'evidence' | 'council'>('timeline');
  const [selectedPhase, setSelectedPhase] = useState<AuditPhase | 'all'>('all');
  const [selectedTask, setSelectedTask] = useState<AuditTask | null>(null);
  const audit = mockAudit;
  const currentPhaseIndex = phases.findIndex(stryMutAct_9fa48("26686") ? () => undefined : (stryCov_9fa48("26686"), p => stryMutAct_9fa48("26689") ? p.id !== audit.currentPhase : stryMutAct_9fa48("26688") ? false : stryMutAct_9fa48("26687") ? true : (stryCov_9fa48("26687", "26688", "26689"), p.id === audit.currentPhase)));
  const tasksByPhase = phases.map(stryMutAct_9fa48("26690") ? () => undefined : (stryCov_9fa48("26690"), phase => stryMutAct_9fa48("26691") ? {} : (stryCov_9fa48("26691"), {
    ...phase,
    tasks: stryMutAct_9fa48("26692") ? audit.tasks : (stryCov_9fa48("26692"), audit.tasks.filter(stryMutAct_9fa48("26693") ? () => undefined : (stryCov_9fa48("26693"), t => stryMutAct_9fa48("26696") ? t.phase !== phase.id : stryMutAct_9fa48("26695") ? false : stryMutAct_9fa48("26694") ? true : (stryCov_9fa48("26694", "26695", "26696"), t.phase === phase.id)))),
    complete: stryMutAct_9fa48("26697") ? audit.tasks.length : (stryCov_9fa48("26697"), audit.tasks.filter(stryMutAct_9fa48("26698") ? () => undefined : (stryCov_9fa48("26698"), t => stryMutAct_9fa48("26701") ? t.phase === phase.id || t.status === 'complete' : stryMutAct_9fa48("26700") ? false : stryMutAct_9fa48("26699") ? true : (stryCov_9fa48("26699", "26700", "26701"), (stryMutAct_9fa48("26703") ? t.phase !== phase.id : stryMutAct_9fa48("26702") ? true : (stryCov_9fa48("26702", "26703"), t.phase === phase.id)) && (stryMutAct_9fa48("26705") ? t.status !== 'complete' : stryMutAct_9fa48("26704") ? true : (stryCov_9fa48("26704", "26705"), t.status === 'complete'))))).length),
    total: stryMutAct_9fa48("26707") ? audit.tasks.length : (stryCov_9fa48("26707"), audit.tasks.filter(stryMutAct_9fa48("26708") ? () => undefined : (stryCov_9fa48("26708"), t => stryMutAct_9fa48("26711") ? t.phase !== phase.id : stryMutAct_9fa48("26710") ? false : stryMutAct_9fa48("26709") ? true : (stryCov_9fa48("26709", "26710", "26711"), t.phase === phase.id))).length)
  })));
  const filteredTasks = (stryMutAct_9fa48("26714") ? selectedPhase !== 'all' : stryMutAct_9fa48("26713") ? false : stryMutAct_9fa48("26712") ? true : (stryCov_9fa48("26712", "26713", "26714"), selectedPhase === 'all')) ? audit.tasks : stryMutAct_9fa48("26716") ? audit.tasks : (stryCov_9fa48("26716"), audit.tasks.filter(stryMutAct_9fa48("26717") ? () => undefined : (stryCov_9fa48("26717"), t => stryMutAct_9fa48("26720") ? t.phase !== selectedPhase : stryMutAct_9fa48("26719") ? false : stryMutAct_9fa48("26718") ? true : (stryCov_9fa48("26718", "26719", "26720"), t.phase === selectedPhase))));
  return <div className="min-h-screen bg-neutral-900 text-white p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">📋</span>
          <h1 className="text-3xl font-bold">Audit Workflow</h1>
        </div>
        <p className="text-neutral-400">
          Compliance audit lifecycle management • Evidence tracking • Council integration
        </p>
      </div>

      {/* Current Audit Card */}
      <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6 mb-6">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="font-mono text-neutral-500">{audit.id}</span>
              <span className="px-3 py-1 bg-primary-500/20 text-primary-400 rounded-full text-sm font-medium">
                {audit.type}
              </span>
            </div>
            <h2 className="text-2xl font-bold">{audit.name}</h2>
            <p className="text-neutral-400 mt-1">Auditor: {audit.auditor}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-neutral-400">Target Date</p>
            <p className="text-xl font-semibold">{formatDate(audit.targetDate)}</p>
            <p className="text-sm text-neutral-500">{getDaysUntil(audit.targetDate)}</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-sm mb-2">
            <span className="text-neutral-400">Overall Progress</span>
            <span className="font-medium">{audit.progress}%</span>
          </div>
          <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
            <div className="h-full bg-primary-500 rounded-full transition-all duration-500" style={stryMutAct_9fa48("26721") ? {} : (stryCov_9fa48("26721"), {
            width: `${audit.progress}%`
          })} />
          </div>
        </div>

        {/* Team */}
        <div className="mt-6 flex items-center gap-4">
          <span className="text-sm text-neutral-400">Team:</span>
          <div className="flex -space-x-2">
            {audit.team.map(stryMutAct_9fa48("26723") ? () => undefined : (stryCov_9fa48("26723"), (member, idx) => <div key={member.name} className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-xs font-medium border-2 border-neutral-800" title={`${member.name} - ${member.role}`}>
                {member.name.split(' ').map(stryMutAct_9fa48("26726") ? () => undefined : (stryCov_9fa48("26726"), n => n[0])).join('')}
              </div>))}
          </div>
          <button className="text-sm text-primary-400 hover:text-primary-300">+ Add</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b border-neutral-700 pb-2">
        {(stryMutAct_9fa48("26728") ? [] : (stryCov_9fa48("26728"), [stryMutAct_9fa48("26729") ? {} : (stryCov_9fa48("26729"), {
        id: 'timeline',
        label: 'Timeline',
        icon: '📅'
      }), stryMutAct_9fa48("26733") ? {} : (stryCov_9fa48("26733"), {
        id: 'tasks',
        label: 'Tasks',
        icon: '✓'
      }), stryMutAct_9fa48("26737") ? {} : (stryCov_9fa48("26737"), {
        id: 'findings',
        label: 'Findings',
        icon: '🔍'
      }), stryMutAct_9fa48("26741") ? {} : (stryCov_9fa48("26741"), {
        id: 'evidence',
        label: 'Evidence',
        icon: '📁'
      }), stryMutAct_9fa48("26745") ? {} : (stryCov_9fa48("26745"), {
        id: 'council',
        label: 'Council Queries',
        icon: '🧠'
      })])).map(stryMutAct_9fa48("26749") ? () => undefined : (stryCov_9fa48("26749"), tab => <button key={tab.id} onClick={stryMutAct_9fa48("26750") ? () => undefined : (stryCov_9fa48("26750"), () => setActiveTab(tab.id as typeof activeTab))} className={`px-4 py-2 rounded-lg font-medium transition-all ${(stryMutAct_9fa48("26754") ? activeTab !== tab.id : stryMutAct_9fa48("26753") ? false : stryMutAct_9fa48("26752") ? true : (stryCov_9fa48("26752", "26753", "26754"), activeTab === tab.id)) ? 'bg-primary-600 text-white' : 'text-neutral-400 hover:text-white hover:bg-neutral-800'}`}>
            {tab.icon} {tab.label}
          </button>))}
      </div>

      {/* Timeline Tab */}
      {stryMutAct_9fa48("26759") ? activeTab === 'timeline' || <div className="space-y-6">
          {/* Phase Progress */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-6">Audit Phases</h3>
            <div className="flex items-start justify-between">
              {tasksByPhase.map((phase, idx) => <React.Fragment key={phase.id}>
                  <div className={`flex flex-col items-center cursor-pointer group ${idx <= currentPhaseIndex ? 'opacity-100' : 'opacity-50'}`} onClick={() => setSelectedPhase(phase.id)}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${idx < currentPhaseIndex ? 'bg-green-500/20 border-green-500' : idx === currentPhaseIndex ? 'bg-primary-500/20 border-primary-500 animate-pulse' : 'bg-neutral-700 border-neutral-600'} group-hover:scale-110`}>
                      {phase.icon}
                    </div>
                    <span className="text-xs text-neutral-400 mt-2">{phase.daysOut}</span>
                    <span className="text-sm font-medium mt-1 text-center">{phase.name}</span>
                    <span className="text-xs text-neutral-500 mt-1">
                      {phase.complete}/{phase.total} tasks
                    </span>
                  </div>
                  {idx < tasksByPhase.length - 1 && <div className={`flex-1 h-0.5 mt-8 mx-2 ${idx < currentPhaseIndex ? 'bg-green-500' : 'bg-neutral-700'}`} />}
                </React.Fragment>)}
            </div>
          </div>

          {/* Current Phase Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Current Phase: {phases.find(p => p.id === audit.currentPhase)?.name}
              </h3>
              <div className="space-y-3">
                {audit.tasks.filter(t => t.phase === audit.currentPhase).map(task => <div key={task.id} onClick={() => setSelectedTask(task)} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {task.status === 'complete' && <span className="text-green-500">✓</span>}
                          {task.status === 'in-progress' && <span className="text-blue-500">◐</span>}
                          {task.status === 'pending' && <span className="text-neutral-500">○</span>}
                          <span className={task.status === 'complete' ? 'line-through text-neutral-500' : ''}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500">{formatDate(task.dueDate)}</span>
                      </div>
                      <p className="text-sm text-neutral-400 mt-1 ml-6">{task.assignee}</p>
                    </div>)}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Open Findings</h3>
              {audit.findings.filter(f => f.status === 'open').length === 0 ? <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No open findings</p>
                </div> : <div className="space-y-3">
                  {audit.findings.filter(f => f.status === 'open').map(finding => <div key={finding.id} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                        <span className="text-xs text-neutral-500">{finding.control}</span>
                      </div>
                      <p className="font-medium">{finding.title}</p>
                      <p className="text-sm text-neutral-400 mt-1">Due: {formatDate(finding.dueDate)}</p>
                    </div>)}
                </div>}
            </div>
          </div>
        </div> : stryMutAct_9fa48("26758") ? false : stryMutAct_9fa48("26757") ? true : (stryCov_9fa48("26757", "26758", "26759"), (stryMutAct_9fa48("26761") ? activeTab !== 'timeline' : stryMutAct_9fa48("26760") ? true : (stryCov_9fa48("26760", "26761"), activeTab === 'timeline')) && <div className="space-y-6">
          {/* Phase Progress */}
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-6">Audit Phases</h3>
            <div className="flex items-start justify-between">
              {tasksByPhase.map(stryMutAct_9fa48("26763") ? () => undefined : (stryCov_9fa48("26763"), (phase, idx) => <React.Fragment key={phase.id}>
                  <div className={`flex flex-col items-center cursor-pointer group ${(stryMutAct_9fa48("26768") ? idx > currentPhaseIndex : stryMutAct_9fa48("26767") ? idx < currentPhaseIndex : stryMutAct_9fa48("26766") ? false : stryMutAct_9fa48("26765") ? true : (stryCov_9fa48("26765", "26766", "26767", "26768"), idx <= currentPhaseIndex)) ? 'opacity-100' : 'opacity-50'}`} onClick={stryMutAct_9fa48("26771") ? () => undefined : (stryCov_9fa48("26771"), () => setSelectedPhase(phase.id))}>
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all ${(stryMutAct_9fa48("26776") ? idx >= currentPhaseIndex : stryMutAct_9fa48("26775") ? idx <= currentPhaseIndex : stryMutAct_9fa48("26774") ? false : stryMutAct_9fa48("26773") ? true : (stryCov_9fa48("26773", "26774", "26775", "26776"), idx < currentPhaseIndex)) ? 'bg-green-500/20 border-green-500' : (stryMutAct_9fa48("26780") ? idx !== currentPhaseIndex : stryMutAct_9fa48("26779") ? false : stryMutAct_9fa48("26778") ? true : (stryCov_9fa48("26778", "26779", "26780"), idx === currentPhaseIndex)) ? 'bg-primary-500/20 border-primary-500 animate-pulse' : 'bg-neutral-700 border-neutral-600'} group-hover:scale-110`}>
                      {phase.icon}
                    </div>
                    <span className="text-xs text-neutral-400 mt-2">{phase.daysOut}</span>
                    <span className="text-sm font-medium mt-1 text-center">{phase.name}</span>
                    <span className="text-xs text-neutral-500 mt-1">
                      {phase.complete}/{phase.total} tasks
                    </span>
                  </div>
                  {stryMutAct_9fa48("26785") ? idx < tasksByPhase.length - 1 || <div className={`flex-1 h-0.5 mt-8 mx-2 ${idx < currentPhaseIndex ? 'bg-green-500' : 'bg-neutral-700'}`} /> : stryMutAct_9fa48("26784") ? false : stryMutAct_9fa48("26783") ? true : (stryCov_9fa48("26783", "26784", "26785"), (stryMutAct_9fa48("26788") ? idx >= tasksByPhase.length - 1 : stryMutAct_9fa48("26787") ? idx <= tasksByPhase.length - 1 : stryMutAct_9fa48("26786") ? true : (stryCov_9fa48("26786", "26787", "26788"), idx < (stryMutAct_9fa48("26789") ? tasksByPhase.length + 1 : (stryCov_9fa48("26789"), tasksByPhase.length - 1)))) && <div className={`flex-1 h-0.5 mt-8 mx-2 ${(stryMutAct_9fa48("26794") ? idx >= currentPhaseIndex : stryMutAct_9fa48("26793") ? idx <= currentPhaseIndex : stryMutAct_9fa48("26792") ? false : stryMutAct_9fa48("26791") ? true : (stryCov_9fa48("26791", "26792", "26793", "26794"), idx < currentPhaseIndex)) ? 'bg-green-500' : 'bg-neutral-700'}`} />)}
                </React.Fragment>))}
            </div>
          </div>

          {/* Current Phase Details */}
          <div className="grid grid-cols-2 gap-6">
            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">
                Current Phase: {stryMutAct_9fa48("26797") ? phases.find(p => p.id === audit.currentPhase).name : (stryCov_9fa48("26797"), phases.find(stryMutAct_9fa48("26798") ? () => undefined : (stryCov_9fa48("26798"), p => stryMutAct_9fa48("26801") ? p.id !== audit.currentPhase : stryMutAct_9fa48("26800") ? false : stryMutAct_9fa48("26799") ? true : (stryCov_9fa48("26799", "26800", "26801"), p.id === audit.currentPhase)))?.name)}
              </h3>
              <div className="space-y-3">
                {stryMutAct_9fa48("26802") ? audit.tasks.map(task => <div key={task.id} onClick={() => setSelectedTask(task)} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {task.status === 'complete' && <span className="text-green-500">✓</span>}
                          {task.status === 'in-progress' && <span className="text-blue-500">◐</span>}
                          {task.status === 'pending' && <span className="text-neutral-500">○</span>}
                          <span className={task.status === 'complete' ? 'line-through text-neutral-500' : ''}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500">{formatDate(task.dueDate)}</span>
                      </div>
                      <p className="text-sm text-neutral-400 mt-1 ml-6">{task.assignee}</p>
                    </div>) : (stryCov_9fa48("26802"), audit.tasks.filter(stryMutAct_9fa48("26803") ? () => undefined : (stryCov_9fa48("26803"), t => stryMutAct_9fa48("26806") ? t.phase !== audit.currentPhase : stryMutAct_9fa48("26805") ? false : stryMutAct_9fa48("26804") ? true : (stryCov_9fa48("26804", "26805", "26806"), t.phase === audit.currentPhase))).map(stryMutAct_9fa48("26807") ? () => undefined : (stryCov_9fa48("26807"), task => <div key={task.id} onClick={stryMutAct_9fa48("26808") ? () => undefined : (stryCov_9fa48("26808"), () => setSelectedTask(task))} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700 hover:border-primary-500 cursor-pointer transition-all">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {stryMutAct_9fa48("26811") ? task.status === 'complete' || <span className="text-green-500">✓</span> : stryMutAct_9fa48("26810") ? false : stryMutAct_9fa48("26809") ? true : (stryCov_9fa48("26809", "26810", "26811"), (stryMutAct_9fa48("26813") ? task.status !== 'complete' : stryMutAct_9fa48("26812") ? true : (stryCov_9fa48("26812", "26813"), task.status === 'complete')) && <span className="text-green-500">✓</span>)}
                          {stryMutAct_9fa48("26817") ? task.status === 'in-progress' || <span className="text-blue-500">◐</span> : stryMutAct_9fa48("26816") ? false : stryMutAct_9fa48("26815") ? true : (stryCov_9fa48("26815", "26816", "26817"), (stryMutAct_9fa48("26819") ? task.status !== 'in-progress' : stryMutAct_9fa48("26818") ? true : (stryCov_9fa48("26818", "26819"), task.status === 'in-progress')) && <span className="text-blue-500">◐</span>)}
                          {stryMutAct_9fa48("26823") ? task.status === 'pending' || <span className="text-neutral-500">○</span> : stryMutAct_9fa48("26822") ? false : stryMutAct_9fa48("26821") ? true : (stryCov_9fa48("26821", "26822", "26823"), (stryMutAct_9fa48("26825") ? task.status !== 'pending' : stryMutAct_9fa48("26824") ? true : (stryCov_9fa48("26824", "26825"), task.status === 'pending')) && <span className="text-neutral-500">○</span>)}
                          <span className={(stryMutAct_9fa48("26829") ? task.status !== 'complete' : stryMutAct_9fa48("26828") ? false : stryMutAct_9fa48("26827") ? true : (stryCov_9fa48("26827", "26828", "26829"), task.status === 'complete')) ? 'line-through text-neutral-500' : ''}>
                            {task.title}
                          </span>
                        </div>
                        <span className="text-sm text-neutral-500">{formatDate(task.dueDate)}</span>
                      </div>
                      <p className="text-sm text-neutral-400 mt-1 ml-6">{task.assignee}</p>
                    </div>)))}
              </div>
            </div>

            <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
              <h3 className="text-lg font-semibold mb-4">Open Findings</h3>
              {(stryMutAct_9fa48("26835") ? audit.findings.filter(f => f.status === 'open').length !== 0 : stryMutAct_9fa48("26834") ? false : stryMutAct_9fa48("26833") ? true : (stryCov_9fa48("26833", "26834", "26835"), (stryMutAct_9fa48("26836") ? audit.findings.length : (stryCov_9fa48("26836"), audit.findings.filter(stryMutAct_9fa48("26837") ? () => undefined : (stryCov_9fa48("26837"), f => stryMutAct_9fa48("26840") ? f.status !== 'open' : stryMutAct_9fa48("26839") ? false : stryMutAct_9fa48("26838") ? true : (stryCov_9fa48("26838", "26839", "26840"), f.status === 'open'))).length)) === 0)) ? <div className="text-center py-8 text-neutral-500">
                  <span className="text-4xl">✅</span>
                  <p className="mt-2">No open findings</p>
                </div> : <div className="space-y-3">
                  {stryMutAct_9fa48("26842") ? audit.findings.map(finding => <div key={finding.id} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                        <span className="text-xs text-neutral-500">{finding.control}</span>
                      </div>
                      <p className="font-medium">{finding.title}</p>
                      <p className="text-sm text-neutral-400 mt-1">Due: {formatDate(finding.dueDate)}</p>
                    </div>) : (stryCov_9fa48("26842"), audit.findings.filter(stryMutAct_9fa48("26843") ? () => undefined : (stryCov_9fa48("26843"), f => stryMutAct_9fa48("26846") ? f.status !== 'open' : stryMutAct_9fa48("26845") ? false : stryMutAct_9fa48("26844") ? true : (stryCov_9fa48("26844", "26845", "26846"), f.status === 'open'))).map(stryMutAct_9fa48("26848") ? () => undefined : (stryCov_9fa48("26848"), finding => <div key={finding.id} className="p-3 bg-neutral-900 rounded-lg border border-neutral-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`px-2 py-0.5 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                          {finding.severity}
                        </span>
                        <span className="text-xs text-neutral-500">{finding.control}</span>
                      </div>
                      <p className="font-medium">{finding.title}</p>
                      <p className="text-sm text-neutral-400 mt-1">Due: {formatDate(finding.dueDate)}</p>
                    </div>)))}
                </div>}
            </div>
          </div>
        </div>)}

      {/* Tasks Tab */}
      {stryMutAct_9fa48("26852") ? activeTab === 'tasks' || <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select value={selectedPhase} onChange={e => setSelectedPhase(e.target.value as AuditPhase | 'all')} className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Phases</option>
              {phases.map(phase => <option key={phase.id} value={phase.id}>{phase.name}</option>)}
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              + Add Task
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Task</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Phase</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Assignee</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Due</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(task => <tr key={task.id} onClick={() => setSelectedTask(task)} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-neutral-500">{task.description}</p>
                    </td>
                    <td className="p-4 text-neutral-400 capitalize">{task.phase.replace('-', ' ')}</td>
                    <td className="p-4 text-neutral-300">{task.assignee}</td>
                    <td className="p-4 text-neutral-400">{formatDate(task.dueDate)}</td>
                    <td className="p-4 text-neutral-400">
                      {task.completedDate ? formatDate(task.completedDate) : '-'}
                    </td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : stryMutAct_9fa48("26851") ? false : stryMutAct_9fa48("26850") ? true : (stryCov_9fa48("26850", "26851", "26852"), (stryMutAct_9fa48("26854") ? activeTab !== 'tasks' : stryMutAct_9fa48("26853") ? true : (stryCov_9fa48("26853", "26854"), activeTab === 'tasks')) && <div className="space-y-4">
          <div className="flex items-center gap-4 mb-4">
            <select value={selectedPhase} onChange={stryMutAct_9fa48("26856") ? () => undefined : (stryCov_9fa48("26856"), e => setSelectedPhase(e.target.value as AuditPhase | 'all'))} className="bg-neutral-800 border border-neutral-700 rounded-lg px-3 py-2 text-sm">
              <option value="all">All Phases</option>
              {phases.map(stryMutAct_9fa48("26857") ? () => undefined : (stryCov_9fa48("26857"), phase => <option key={phase.id} value={phase.id}>{phase.name}</option>))}
            </select>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              + Add Task
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Task</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Phase</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Assignee</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Due</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredTasks.map(stryMutAct_9fa48("26858") ? () => undefined : (stryCov_9fa48("26858"), task => <tr key={task.id} onClick={stryMutAct_9fa48("26859") ? () => undefined : (stryCov_9fa48("26859"), () => setSelectedTask(task))} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(task.status)}`}>
                        {task.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{task.title}</p>
                      <p className="text-sm text-neutral-500">{task.description}</p>
                    </td>
                    <td className="p-4 text-neutral-400 capitalize">{task.phase.replace('-', ' ')}</td>
                    <td className="p-4 text-neutral-300">{task.assignee}</td>
                    <td className="p-4 text-neutral-400">{formatDate(task.dueDate)}</td>
                    <td className="p-4 text-neutral-400">
                      {task.completedDate ? formatDate(task.completedDate) : '-'}
                    </td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Findings Tab */}
      {stryMutAct_9fa48("26866") ? activeTab === 'findings' || <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              {['critical', 'high', 'medium', 'low'].map(severity => {
            const count = audit.findings.filter(f => f.severity === severity).length;
            return <div key={severity} className={`px-4 py-2 rounded-lg ${getSeverityColor(severity as FindingSeverity)}`}>
                    <span className="capitalize">{severity}</span>
                    <span className="ml-2 font-bold">{count}</span>
                  </div>;
          })}
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              + Log Finding
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Finding</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Control</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Due</th>
                </tr>
              </thead>
              <tbody>
                {audit.findings.map(finding => <tr key={finding.id} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4 font-mono text-sm">{finding.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{finding.title}</p>
                      <p className="text-sm text-neutral-500">{finding.description}</p>
                    </td>
                    <td className="p-4 font-mono text-sm">{finding.control}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${finding.status === 'remediated' ? 'bg-green-500/20 text-green-400' : finding.status === 'open' ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-500/20 text-neutral-400'}`}>
                        {finding.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(finding.dueDate)}</td>
                  </tr>)}
              </tbody>
            </table>
          </div>
        </div> : stryMutAct_9fa48("26865") ? false : stryMutAct_9fa48("26864") ? true : (stryCov_9fa48("26864", "26865", "26866"), (stryMutAct_9fa48("26868") ? activeTab !== 'findings' : stryMutAct_9fa48("26867") ? true : (stryCov_9fa48("26867", "26868"), activeTab === 'findings')) && <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex gap-4">
              {(stryMutAct_9fa48("26870") ? [] : (stryCov_9fa48("26870"), ['critical', 'high', 'medium', 'low'])).map(severity => {
            const count = stryMutAct_9fa48("26876") ? audit.findings.length : (stryCov_9fa48("26876"), audit.findings.filter(stryMutAct_9fa48("26877") ? () => undefined : (stryCov_9fa48("26877"), f => stryMutAct_9fa48("26880") ? f.severity !== severity : stryMutAct_9fa48("26879") ? false : stryMutAct_9fa48("26878") ? true : (stryCov_9fa48("26878", "26879", "26880"), f.severity === severity))).length);
            return <div key={severity} className={`px-4 py-2 rounded-lg ${getSeverityColor(severity as FindingSeverity)}`}>
                    <span className="capitalize">{severity}</span>
                    <span className="ml-2 font-bold">{count}</span>
                  </div>;
          })}
            </div>
            <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
              + Log Finding
            </button>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 overflow-hidden">
            <table className="w-full">
              <thead className="bg-neutral-900">
                <tr>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">ID</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Severity</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Finding</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Control</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Status</th>
                  <th className="text-left p-4 text-sm font-medium text-neutral-400">Due</th>
                </tr>
              </thead>
              <tbody>
                {audit.findings.map(stryMutAct_9fa48("26882") ? () => undefined : (stryCov_9fa48("26882"), finding => <tr key={finding.id} className="border-t border-neutral-700 hover:bg-neutral-700/50 cursor-pointer transition-colors">
                    <td className="p-4 font-mono text-sm">{finding.id}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(finding.severity)}`}>
                        {finding.severity}
                      </span>
                    </td>
                    <td className="p-4">
                      <p className="font-medium">{finding.title}</p>
                      <p className="text-sm text-neutral-500">{finding.description}</p>
                    </td>
                    <td className="p-4 font-mono text-sm">{finding.control}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${(stryMutAct_9fa48("26887") ? finding.status !== 'remediated' : stryMutAct_9fa48("26886") ? false : stryMutAct_9fa48("26885") ? true : (stryCov_9fa48("26885", "26886", "26887"), finding.status === 'remediated')) ? 'bg-green-500/20 text-green-400' : (stryMutAct_9fa48("26892") ? finding.status !== 'open' : stryMutAct_9fa48("26891") ? false : stryMutAct_9fa48("26890") ? true : (stryCov_9fa48("26890", "26891", "26892"), finding.status === 'open')) ? 'bg-yellow-500/20 text-yellow-400' : 'bg-neutral-500/20 text-neutral-400'}`}>
                        {finding.status}
                      </span>
                    </td>
                    <td className="p-4 text-neutral-400">{formatDate(finding.dueDate)}</td>
                  </tr>))}
              </tbody>
            </table>
          </div>
        </div>)}

      {/* Evidence Tab */}
      {stryMutAct_9fa48("26898") ? activeTab === 'evidence' || <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {[{
          label: 'Total Evidence Items',
          value: '127',
          icon: '📄'
        }, {
          label: 'Pending Review',
          value: '12',
          icon: '👀'
        }, {
          label: 'Approved',
          value: '108',
          icon: '✅'
        }, {
          label: 'Needs Update',
          value: '7',
          icon: '⚠️'
        }].map(stat => <div key={stat.label} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>)}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Evidence by Control Category</h3>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                + Upload Evidence
              </button>
            </div>
            <div className="space-y-3">
              {[{
            control: 'CC6 - Logical and Physical Access',
            items: 28,
            complete: 25
          }, {
            control: 'CC7 - System Operations',
            items: 22,
            complete: 18
          }, {
            control: 'CC8 - Change Management',
            items: 15,
            complete: 15
          }, {
            control: 'CC9 - Risk Mitigation',
            items: 12,
            complete: 10
          }, {
            control: 'A1 - Availability',
            items: 18,
            complete: 16
          }, {
            control: 'C1 - Confidentiality',
            items: 20,
            complete: 14
          }, {
            control: 'PI1 - Processing Integrity',
            items: 12,
            complete: 10
          }].map(cat => <div key={cat.control} className="p-4 bg-neutral-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.control}</span>
                    <span className="text-sm text-neutral-400">{cat.complete}/{cat.items}</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={{
                width: `${cat.complete / cat.items * 100}%`
              }} />
                  </div>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("26897") ? false : stryMutAct_9fa48("26896") ? true : (stryCov_9fa48("26896", "26897", "26898"), (stryMutAct_9fa48("26900") ? activeTab !== 'evidence' : stryMutAct_9fa48("26899") ? true : (stryCov_9fa48("26899", "26900"), activeTab === 'evidence')) && <div className="space-y-6">
          <div className="grid grid-cols-4 gap-4">
            {(stryMutAct_9fa48("26902") ? [] : (stryCov_9fa48("26902"), [stryMutAct_9fa48("26903") ? {} : (stryCov_9fa48("26903"), {
          label: 'Total Evidence Items',
          value: '127',
          icon: '📄'
        }), stryMutAct_9fa48("26907") ? {} : (stryCov_9fa48("26907"), {
          label: 'Pending Review',
          value: '12',
          icon: '👀'
        }), stryMutAct_9fa48("26911") ? {} : (stryCov_9fa48("26911"), {
          label: 'Approved',
          value: '108',
          icon: '✅'
        }), stryMutAct_9fa48("26915") ? {} : (stryCov_9fa48("26915"), {
          label: 'Needs Update',
          value: '7',
          icon: '⚠️'
        })])).map(stryMutAct_9fa48("26919") ? () => undefined : (stryCov_9fa48("26919"), stat => <div key={stat.label} className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
                <span className="text-2xl">{stat.icon}</span>
                <p className="text-2xl font-bold mt-2">{stat.value}</p>
                <p className="text-sm text-neutral-400">{stat.label}</p>
              </div>))}
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Evidence by Control Category</h3>
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                + Upload Evidence
              </button>
            </div>
            <div className="space-y-3">
              {(stryMutAct_9fa48("26920") ? [] : (stryCov_9fa48("26920"), [stryMutAct_9fa48("26921") ? {} : (stryCov_9fa48("26921"), {
            control: 'CC6 - Logical and Physical Access',
            items: 28,
            complete: 25
          }), stryMutAct_9fa48("26923") ? {} : (stryCov_9fa48("26923"), {
            control: 'CC7 - System Operations',
            items: 22,
            complete: 18
          }), stryMutAct_9fa48("26925") ? {} : (stryCov_9fa48("26925"), {
            control: 'CC8 - Change Management',
            items: 15,
            complete: 15
          }), stryMutAct_9fa48("26927") ? {} : (stryCov_9fa48("26927"), {
            control: 'CC9 - Risk Mitigation',
            items: 12,
            complete: 10
          }), stryMutAct_9fa48("26929") ? {} : (stryCov_9fa48("26929"), {
            control: 'A1 - Availability',
            items: 18,
            complete: 16
          }), stryMutAct_9fa48("26931") ? {} : (stryCov_9fa48("26931"), {
            control: 'C1 - Confidentiality',
            items: 20,
            complete: 14
          }), stryMutAct_9fa48("26933") ? {} : (stryCov_9fa48("26933"), {
            control: 'PI1 - Processing Integrity',
            items: 12,
            complete: 10
          })])).map(stryMutAct_9fa48("26935") ? () => undefined : (stryCov_9fa48("26935"), cat => <div key={cat.control} className="p-4 bg-neutral-900 rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{cat.control}</span>
                    <span className="text-sm text-neutral-400">{cat.complete}/{cat.items}</span>
                  </div>
                  <div className="h-2 bg-neutral-700 rounded-full overflow-hidden">
                    <div className="h-full bg-primary-500 rounded-full" style={stryMutAct_9fa48("26936") ? {} : (stryCov_9fa48("26936"), {
                width: `${stryMutAct_9fa48("26938") ? cat.complete / cat.items / 100 : (stryCov_9fa48("26938"), (stryMutAct_9fa48("26939") ? cat.complete * cat.items : (stryCov_9fa48("26939"), cat.complete / cat.items)) * 100)}%`
              })} />
                  </div>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Council Tab */}
      {stryMutAct_9fa48("26942") ? activeTab === 'council' || <div className="space-y-6">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Ask the Council</h3>
            <p className="text-neutral-400 mb-4">
              Use AI-powered deliberation to analyze audit risks and get recommendations.
            </p>
            <div className="space-y-3">
              {['What are our highest risk areas for this audit?', 'How should we prioritize our remediation efforts?', 'What evidence gaps might auditors identify?', 'Compare our readiness to last year\'s audit'].map(query => <button key={query} onClick={() => navigate('/cortex/council')} className="w-full p-4 bg-neutral-900 rounded-lg border border-neutral-700 text-left hover:border-primary-500 transition-all">
                  <span className="text-primary-400 mr-2">🧠</span>
                  {query}
                </button>)}
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Council Deliberations</h3>
            <div className="space-y-3">
              {[{
            query: 'Risk assessment for CC7.2 monitoring gaps',
            date: '2 days ago',
            confidence: 87
          }, {
            query: 'Evidence requirements for access control',
            date: '5 days ago',
            confidence: 92
          }, {
            query: 'Remediation timeline feasibility',
            date: '1 week ago',
            confidence: 78
          }].map((delib, idx) => <div key={idx} className="p-4 bg-neutral-900 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{delib.query}</p>
                    <p className="text-sm text-neutral-500">{delib.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Confidence</p>
                    <p className="font-semibold text-primary-400">{delib.confidence}%</p>
                  </div>
                </div>)}
            </div>
          </div>
        </div> : stryMutAct_9fa48("26941") ? false : stryMutAct_9fa48("26940") ? true : (stryCov_9fa48("26940", "26941", "26942"), (stryMutAct_9fa48("26944") ? activeTab !== 'council' : stryMutAct_9fa48("26943") ? true : (stryCov_9fa48("26943", "26944"), activeTab === 'council')) && <div className="space-y-6">
          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Ask the Council</h3>
            <p className="text-neutral-400 mb-4">
              Use AI-powered deliberation to analyze audit risks and get recommendations.
            </p>
            <div className="space-y-3">
              {(stryMutAct_9fa48("26946") ? [] : (stryCov_9fa48("26946"), ['What are our highest risk areas for this audit?', 'How should we prioritize our remediation efforts?', 'What evidence gaps might auditors identify?', 'Compare our readiness to last year\'s audit'])).map(stryMutAct_9fa48("26951") ? () => undefined : (stryCov_9fa48("26951"), query => <button key={query} onClick={stryMutAct_9fa48("26952") ? () => undefined : (stryCov_9fa48("26952"), () => navigate('/cortex/council'))} className="w-full p-4 bg-neutral-900 rounded-lg border border-neutral-700 text-left hover:border-primary-500 transition-all">
                  <span className="text-primary-400 mr-2">🧠</span>
                  {query}
                </button>))}
            </div>
          </div>

          <div className="bg-neutral-800 rounded-xl border border-neutral-700 p-6">
            <h3 className="text-lg font-semibold mb-4">Recent Council Deliberations</h3>
            <div className="space-y-3">
              {(stryMutAct_9fa48("26954") ? [] : (stryCov_9fa48("26954"), [stryMutAct_9fa48("26955") ? {} : (stryCov_9fa48("26955"), {
            query: 'Risk assessment for CC7.2 monitoring gaps',
            date: '2 days ago',
            confidence: 87
          }), stryMutAct_9fa48("26958") ? {} : (stryCov_9fa48("26958"), {
            query: 'Evidence requirements for access control',
            date: '5 days ago',
            confidence: 92
          }), stryMutAct_9fa48("26961") ? {} : (stryCov_9fa48("26961"), {
            query: 'Remediation timeline feasibility',
            date: '1 week ago',
            confidence: 78
          })])).map(stryMutAct_9fa48("26964") ? () => undefined : (stryCov_9fa48("26964"), (delib, idx) => <div key={idx} className="p-4 bg-neutral-900 rounded-lg flex items-center justify-between">
                  <div>
                    <p className="font-medium">{delib.query}</p>
                    <p className="text-sm text-neutral-500">{delib.date}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-neutral-400">Confidence</p>
                    <p className="font-semibold text-primary-400">{delib.confidence}%</p>
                  </div>
                </div>))}
            </div>
          </div>
        </div>)}

      {/* Task Detail Modal */}
      {stryMutAct_9fa48("26967") ? selectedTask || <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-2xl w-full">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                  <h2 className="text-xl font-bold mt-2">{selectedTask.title}</h2>
                </div>
                <button onClick={() => setSelectedTask(null)} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-1">Description</h3>
                <p>{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Assignee</h3>
                  <p>{selectedTask.assignee}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Due Date</h3>
                  <p>{formatDate(selectedTask.dueDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Phase</h3>
                  <p className="capitalize">{selectedTask.phase.replace('-', ' ')}</p>
                </div>
                {selectedTask.completedDate && <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Completed</h3>
                    <p>{formatDate(selectedTask.completedDate)}</p>
                  </div>}
              </div>
            </div>
            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              {selectedTask.status !== 'complete' && <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark Complete
                </button>}
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Edit Task
              </button>
            </div>
          </div>
        </div> : stryMutAct_9fa48("26966") ? false : stryMutAct_9fa48("26965") ? true : (stryCov_9fa48("26965", "26966", "26967"), selectedTask && <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-8">
          <div className="bg-neutral-800 rounded-2xl border border-neutral-700 max-w-2xl w-full">
            <div className="p-6 border-b border-neutral-700">
              <div className="flex items-start justify-between">
                <div>
                  <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status}
                  </span>
                  <h2 className="text-xl font-bold mt-2">{selectedTask.title}</h2>
                </div>
                <button onClick={stryMutAct_9fa48("26969") ? () => undefined : (stryCov_9fa48("26969"), () => setSelectedTask(null))} className="p-2 hover:bg-neutral-700 rounded-lg transition-colors">
                  ✕
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-neutral-400 mb-1">Description</h3>
                <p>{selectedTask.description}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Assignee</h3>
                  <p>{selectedTask.assignee}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Due Date</h3>
                  <p>{formatDate(selectedTask.dueDate)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-neutral-400 mb-1">Phase</h3>
                  <p className="capitalize">{selectedTask.phase.replace('-', ' ')}</p>
                </div>
                {stryMutAct_9fa48("26974") ? selectedTask.completedDate || <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Completed</h3>
                    <p>{formatDate(selectedTask.completedDate)}</p>
                  </div> : stryMutAct_9fa48("26973") ? false : stryMutAct_9fa48("26972") ? true : (stryCov_9fa48("26972", "26973", "26974"), selectedTask.completedDate && <div>
                    <h3 className="text-sm font-medium text-neutral-400 mb-1">Completed</h3>
                    <p>{formatDate(selectedTask.completedDate)}</p>
                  </div>)}
              </div>
            </div>
            <div className="p-6 border-t border-neutral-700 flex justify-end gap-3">
              {stryMutAct_9fa48("26977") ? selectedTask.status !== 'complete' || <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark Complete
                </button> : stryMutAct_9fa48("26976") ? false : stryMutAct_9fa48("26975") ? true : (stryCov_9fa48("26975", "26976", "26977"), (stryMutAct_9fa48("26979") ? selectedTask.status === 'complete' : stryMutAct_9fa48("26978") ? true : (stryCov_9fa48("26978", "26979"), selectedTask.status !== 'complete')) && <button className="px-4 py-2 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 transition-colors">
                  Mark Complete
                </button>)}
              <button className="px-4 py-2 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors">
                Edit Task
              </button>
            </div>
          </div>
        </div>)}
    </div>;
};
export default AuditWorkflowPage;