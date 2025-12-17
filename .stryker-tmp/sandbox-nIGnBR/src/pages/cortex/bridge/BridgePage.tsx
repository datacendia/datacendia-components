// @ts-nocheck
// =============================================================================
// DATACENDIA - THE BRIDGE PAGE (Enhanced)
// Workflow automation with activity log, integrations, SLA tracking
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
import { cn } from '../../../../lib/utils';
import { workflowsApi } from '../../../lib/api';
import { useLanguage } from '../../../contexts/LanguageContext';

// =============================================================================
// TYPES
// =============================================================================

interface WorkflowNode {
  id: string;
  type: 'trigger' | 'ai' | 'human' | 'action';
  label: string;
  sublabel?: string;
  status: 'completed' | 'active' | 'pending';
}
interface ActiveWorkflow {
  id: string;
  name: string;
  code: string;
  status: 'awaiting_human' | 'running' | 'completed' | 'failed';
  nodes: WorkflowNode[];
  slaDeadline?: Date;
  pendingApproval?: {
    title: string;
    description: string;
    amount?: string;
    requiredFrom: string;
  };
}
interface Integration {
  id: string;
  name: string;
  icon: string;
  status: 'connected' | 'disconnected' | 'error';
}
interface ActivityEvent {
  id: string;
  type: 'approval' | 'execution' | 'error' | 'trigger';
  message: string;
  workflow: string;
  timestamp: Date;
}
interface ExecutionHistory {
  id: string;
  workflowCode: string;
  status: 'success' | 'failed' | 'cancelled';
  duration: string;
  timestamp: Date;
}

// =============================================================================
// WORKFLOW DATA
// =============================================================================

const activeWorkflows: ActiveWorkflow[] = stryMutAct_9fa48("20128") ? [] : (stryCov_9fa48("20128"), [stryMutAct_9fa48("20129") ? {} : (stryCov_9fa48("20129"), {
  id: '1',
  name: 'Capital Expenditure Approval',
  code: 'CAP_EX_APPROVAL',
  status: 'awaiting_human',
  slaDeadline: new Date(stryMutAct_9fa48("20134") ? Date.now() - 2 * 60 * 60 * 1000 : (stryCov_9fa48("20134"), Date.now() + (stryMutAct_9fa48("20135") ? 2 * 60 * 60 / 1000 : (stryCov_9fa48("20135"), (stryMutAct_9fa48("20136") ? 2 * 60 / 60 : (stryCov_9fa48("20136"), (stryMutAct_9fa48("20137") ? 2 / 60 : (stryCov_9fa48("20137"), 2 * 60)) * 60)) * 1000)))),
  // 2 hours
  nodes: stryMutAct_9fa48("20138") ? [] : (stryCov_9fa48("20138"), [stryMutAct_9fa48("20139") ? {} : (stryCov_9fa48("20139"), {
    id: 'n1',
    type: 'trigger',
    label: 'Trigger: Budget Variance > 5%',
    status: 'completed'
  }), stryMutAct_9fa48("20144") ? {} : (stryCov_9fa48("20144"), {
    id: 'n2',
    type: 'ai',
    label: 'AI Recommendation: Reallocate Marketing Spend',
    status: 'completed'
  }), stryMutAct_9fa48("20149") ? {} : (stryCov_9fa48("20149"), {
    id: 'n3',
    type: 'human',
    label: 'Human Approval Required',
    status: 'active'
  })]),
  pendingApproval: stryMutAct_9fa48("20154") ? {} : (stryCov_9fa48("20154"), {
    title: 'HUMAN APPROVAL REQUIRED',
    description: 'Transaction exceeds autonomous limit ($10,000).',
    amount: '$10,000',
    requiredFrom: 'CFO'
  })
}), stryMutAct_9fa48("20159") ? {} : (stryCov_9fa48("20159"), {
  id: '2',
  name: 'Vendor Payment Processing',
  code: 'VENDOR_PAY_01',
  status: 'running',
  nodes: stryMutAct_9fa48("20164") ? [] : (stryCov_9fa48("20164"), [stryMutAct_9fa48("20165") ? {} : (stryCov_9fa48("20165"), {
    id: 'n1',
    type: 'trigger',
    label: 'Invoice Received',
    status: 'completed'
  }), stryMutAct_9fa48("20170") ? {} : (stryCov_9fa48("20170"), {
    id: 'n2',
    type: 'ai',
    label: 'Verify Invoice Details',
    status: 'active'
  }), stryMutAct_9fa48("20175") ? {} : (stryCov_9fa48("20175"), {
    id: 'n3',
    type: 'action',
    label: 'Process Payment',
    status: 'pending'
  })])
})]);

// =============================================================================
// SLA COUNTDOWN COMPONENT
// =============================================================================

const SLACountdown: React.FC<{
  deadline: Date;
}> = ({
  deadline
}) => {
  const [timeLeft, setTimeLeft] = useState('');
  const [isUrgent, setIsUrgent] = useState(stryMutAct_9fa48("20182") ? true : (stryCov_9fa48("20182"), false));
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const diff = stryMutAct_9fa48("20185") ? deadline.getTime() + now.getTime() : (stryCov_9fa48("20185"), deadline.getTime() - now.getTime());
      if (stryMutAct_9fa48("20189") ? diff > 0 : stryMutAct_9fa48("20188") ? diff < 0 : stryMutAct_9fa48("20187") ? false : stryMutAct_9fa48("20186") ? true : (stryCov_9fa48("20186", "20187", "20188", "20189"), diff <= 0)) {
        setTimeLeft('OVERDUE');
        setIsUrgent(stryMutAct_9fa48("20192") ? false : (stryCov_9fa48("20192"), true));
        return;
      }
      const hours = Math.floor(stryMutAct_9fa48("20193") ? diff * (1000 * 60 * 60) : (stryCov_9fa48("20193"), diff / (stryMutAct_9fa48("20194") ? 1000 * 60 / 60 : (stryCov_9fa48("20194"), (stryMutAct_9fa48("20195") ? 1000 / 60 : (stryCov_9fa48("20195"), 1000 * 60)) * 60))));
      const minutes = Math.floor(stryMutAct_9fa48("20196") ? diff % (1000 * 60 * 60) * (1000 * 60) : (stryCov_9fa48("20196"), (stryMutAct_9fa48("20197") ? diff * (1000 * 60 * 60) : (stryCov_9fa48("20197"), diff % (stryMutAct_9fa48("20198") ? 1000 * 60 / 60 : (stryCov_9fa48("20198"), (stryMutAct_9fa48("20199") ? 1000 / 60 : (stryCov_9fa48("20199"), 1000 * 60)) * 60)))) / (stryMutAct_9fa48("20200") ? 1000 / 60 : (stryCov_9fa48("20200"), 1000 * 60))));
      setTimeLeft(`${hours}h ${minutes}m`);
      setIsUrgent(stryMutAct_9fa48("20205") ? hours >= 1 : stryMutAct_9fa48("20204") ? hours <= 1 : stryMutAct_9fa48("20203") ? false : stryMutAct_9fa48("20202") ? true : (stryCov_9fa48("20202", "20203", "20204", "20205"), hours < 1));
    };
    update();
    const interval = setInterval(update, 60000);
    return stryMutAct_9fa48("20206") ? () => undefined : (stryCov_9fa48("20206"), () => clearInterval(interval));
  }, stryMutAct_9fa48("20207") ? [] : (stryCov_9fa48("20207"), [deadline]));
  return <div className={cn('px-3 py-1.5 rounded-lg text-xs font-medium', isUrgent ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-neutral-700 text-neutral-300')}>
      SLA: {timeLeft}
    </div>;
};

// =============================================================================
// INTEGRATIONS SIDEBAR
// =============================================================================

const IntegrationsSidebar: React.FC<{
  integrations: Integration[];
}> = stryMutAct_9fa48("20211") ? () => undefined : (stryCov_9fa48("20211"), (() => {
  const IntegrationsSidebar: React.FC<{
    integrations: Integration[];
  }> = ({
    integrations
  }) => <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Connected Systems</p>
    <div className="space-y-2">
      {integrations.map(stryMutAct_9fa48("20212") ? () => undefined : (stryCov_9fa48("20212"), int => <div key={int.id} className="flex items-center gap-3">
          <span className="text-lg">{int.icon}</span>
          <span className="text-sm text-neutral-300 flex-1">{int.name}</span>
          <div className={cn('w-2 h-2 rounded-full', stryMutAct_9fa48("20216") ? int.status === 'connected' || 'bg-green-500' : stryMutAct_9fa48("20215") ? false : stryMutAct_9fa48("20214") ? true : (stryCov_9fa48("20214", "20215", "20216"), (stryMutAct_9fa48("20218") ? int.status !== 'connected' : stryMutAct_9fa48("20217") ? true : (stryCov_9fa48("20217", "20218"), int.status === 'connected')) && 'bg-green-500'), stryMutAct_9fa48("20223") ? int.status === 'disconnected' || 'bg-neutral-500' : stryMutAct_9fa48("20222") ? false : stryMutAct_9fa48("20221") ? true : (stryCov_9fa48("20221", "20222", "20223"), (stryMutAct_9fa48("20225") ? int.status !== 'disconnected' : stryMutAct_9fa48("20224") ? true : (stryCov_9fa48("20224", "20225"), int.status === 'disconnected')) && 'bg-neutral-500'), stryMutAct_9fa48("20230") ? int.status === 'error' || 'bg-red-500' : stryMutAct_9fa48("20229") ? false : stryMutAct_9fa48("20228") ? true : (stryCov_9fa48("20228", "20229", "20230"), (stryMutAct_9fa48("20232") ? int.status !== 'error' : stryMutAct_9fa48("20231") ? true : (stryCov_9fa48("20231", "20232"), int.status === 'error')) && 'bg-red-500'))} />
        </div>))}
    </div>
  </div>;
  return IntegrationsSidebar;
})());

// =============================================================================
// ACTIVITY LOG
// =============================================================================

const ActivityLog: React.FC<{
  events: ActivityEvent[];
}> = ({
  events
}) => {
  const typeConfig = stryMutAct_9fa48("20236") ? {} : (stryCov_9fa48("20236"), {
    approval: stryMutAct_9fa48("20237") ? {} : (stryCov_9fa48("20237"), {
      icon: '✓',
      color: 'text-green-400'
    }),
    execution: stryMutAct_9fa48("20240") ? {} : (stryCov_9fa48("20240"), {
      icon: '▶',
      color: 'text-blue-400'
    }),
    error: stryMutAct_9fa48("20243") ? {} : (stryCov_9fa48("20243"), {
      icon: '⚠',
      color: 'text-red-400'
    }),
    trigger: stryMutAct_9fa48("20246") ? {} : (stryCov_9fa48("20246"), {
      icon: '⚡',
      color: 'text-yellow-400'
    })
  });
  return <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
      <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Recent Activity</p>
      <div className="space-y-3 max-h-48 overflow-y-auto">
        {events.map(event => {
        const config = typeConfig[event.type];
        return <div key={event.id} className="flex items-start gap-3">
              <span className={cn('text-sm', config.color)}>{config.icon}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-neutral-300">{event.message}</p>
                <p className="text-xs text-neutral-500">{event.workflow} • just now</p>
              </div>
            </div>;
      })}
      </div>
    </div>;
};

// =============================================================================
// EXECUTION HISTORY
// =============================================================================

const ExecutionHistoryPanel: React.FC<{
  history: ExecutionHistory[];
  onViewFailed: (exec: ExecutionHistory) => void;
}> = stryMutAct_9fa48("20251") ? () => undefined : (stryCov_9fa48("20251"), (() => {
  const ExecutionHistoryPanel: React.FC<{
    history: ExecutionHistory[];
    onViewFailed: (exec: ExecutionHistory) => void;
  }> = ({
    history,
    onViewFailed
  }) => <div className="bg-neutral-800/50 rounded-lg border border-neutral-700 p-4">
    <p className="text-xs text-neutral-400 uppercase tracking-wider mb-3">Recent Executions</p>
    <div className="space-y-2">
      {history.map(stryMutAct_9fa48("20252") ? () => undefined : (stryCov_9fa48("20252"), exec => <div key={exec.id} className={cn("flex items-center justify-between py-2 border-b border-neutral-700/50 last:border-0", stryMutAct_9fa48("20256") ? exec.status === 'failed' || "cursor-pointer hover:bg-neutral-700/30 rounded px-2 -mx-2" : stryMutAct_9fa48("20255") ? false : stryMutAct_9fa48("20254") ? true : (stryCov_9fa48("20254", "20255", "20256"), (stryMutAct_9fa48("20258") ? exec.status !== 'failed' : stryMutAct_9fa48("20257") ? true : (stryCov_9fa48("20257", "20258"), exec.status === 'failed')) && "cursor-pointer hover:bg-neutral-700/30 rounded px-2 -mx-2"))} onClick={stryMutAct_9fa48("20261") ? () => undefined : (stryCov_9fa48("20261"), () => stryMutAct_9fa48("20264") ? exec.status === 'failed' || onViewFailed(exec) : stryMutAct_9fa48("20263") ? false : stryMutAct_9fa48("20262") ? true : (stryCov_9fa48("20262", "20263", "20264"), (stryMutAct_9fa48("20266") ? exec.status !== 'failed' : stryMutAct_9fa48("20265") ? true : (stryCov_9fa48("20265", "20266"), exec.status === 'failed')) && onViewFailed(exec)))}>
          <div className="flex items-center gap-2">
            <div>
              <p className="text-sm text-neutral-300 font-mono">{exec.workflowCode}</p>
              <p className="text-xs text-neutral-500">{exec.duration}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {stryMutAct_9fa48("20270") ? exec.status === 'failed' || <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100">
                View in Chronos →
              </span> : stryMutAct_9fa48("20269") ? false : stryMutAct_9fa48("20268") ? true : (stryCov_9fa48("20268", "20269", "20270"), (stryMutAct_9fa48("20272") ? exec.status !== 'failed' : stryMutAct_9fa48("20271") ? true : (stryCov_9fa48("20271", "20272"), exec.status === 'failed')) && <span className="text-[10px] text-cyan-400 opacity-0 group-hover:opacity-100">
                View in Chronos →
              </span>)}
            <span className={cn('px-2 py-0.5 rounded text-xs font-medium', stryMutAct_9fa48("20277") ? exec.status === 'success' || 'bg-green-500/20 text-green-400' : stryMutAct_9fa48("20276") ? false : stryMutAct_9fa48("20275") ? true : (stryCov_9fa48("20275", "20276", "20277"), (stryMutAct_9fa48("20279") ? exec.status !== 'success' : stryMutAct_9fa48("20278") ? true : (stryCov_9fa48("20278", "20279"), exec.status === 'success')) && 'bg-green-500/20 text-green-400'), stryMutAct_9fa48("20284") ? exec.status === 'failed' || 'bg-red-500/20 text-red-400 cursor-pointer hover:bg-red-500/30' : stryMutAct_9fa48("20283") ? false : stryMutAct_9fa48("20282") ? true : (stryCov_9fa48("20282", "20283", "20284"), (stryMutAct_9fa48("20286") ? exec.status !== 'failed' : stryMutAct_9fa48("20285") ? true : (stryCov_9fa48("20285", "20286"), exec.status === 'failed')) && 'bg-red-500/20 text-red-400 cursor-pointer hover:bg-red-500/30'), stryMutAct_9fa48("20291") ? exec.status === 'cancelled' || 'bg-neutral-500/20 text-neutral-400' : stryMutAct_9fa48("20290") ? false : stryMutAct_9fa48("20289") ? true : (stryCov_9fa48("20289", "20290", "20291"), (stryMutAct_9fa48("20293") ? exec.status !== 'cancelled' : stryMutAct_9fa48("20292") ? true : (stryCov_9fa48("20292", "20293"), exec.status === 'cancelled')) && 'bg-neutral-500/20 text-neutral-400'))}>
              {exec.status}
            </span>
          </div>
        </div>))}
    </div>
  </div>;
  return ExecutionHistoryPanel;
})());

// =============================================================================
// WORKFLOW NODE COMPONENT
// =============================================================================

const WorkflowNodeCard: React.FC<{
  node: WorkflowNode;
  isLast: boolean;
}> = ({
  node,
  isLast
}) => {
  const statusColors = stryMutAct_9fa48("20297") ? {} : (stryCov_9fa48("20297"), {
    completed: 'border-neutral-600 bg-neutral-800',
    active: 'border-orange-500 bg-orange-500/10',
    pending: 'border-neutral-700 bg-neutral-800/50 opacity-50'
  });
  return <div className="flex flex-col items-center">
      <div className={cn('px-6 py-3 rounded-lg border text-center min-w-[200px]', statusColors[node.status])}>
        <p className="text-sm text-neutral-300">{node.label}</p>
        {stryMutAct_9fa48("20304") ? node.sublabel || <p className="text-xs text-neutral-500 mt-1">{node.sublabel}</p> : stryMutAct_9fa48("20303") ? false : stryMutAct_9fa48("20302") ? true : (stryCov_9fa48("20302", "20303", "20304"), node.sublabel && <p className="text-xs text-neutral-500 mt-1">{node.sublabel}</p>)}
      </div>
      {stryMutAct_9fa48("20307") ? !isLast || <div className="w-px h-8 bg-neutral-700 my-2" /> : stryMutAct_9fa48("20306") ? false : stryMutAct_9fa48("20305") ? true : (stryCov_9fa48("20305", "20306", "20307"), (stryMutAct_9fa48("20308") ? isLast : (stryCov_9fa48("20308"), !isLast)) && <div className="w-px h-8 bg-neutral-700 my-2" />)}
    </div>;
};

// =============================================================================
// APPROVAL MODAL COMPONENT
// =============================================================================

const ApprovalModal: React.FC<{
  approval: ActiveWorkflow['pendingApproval'];
  onApprove: () => void;
  onReject: () => void;
}> = ({
  approval,
  onApprove,
  onReject
}) => {
  if (stryMutAct_9fa48("20312") ? false : stryMutAct_9fa48("20311") ? true : stryMutAct_9fa48("20310") ? approval : (stryCov_9fa48("20310", "20311", "20312"), !approval)) {
    return null;
  }
  return <div className="bg-neutral-800/80 border border-orange-500/50 rounded-lg p-5 mt-4">
      <div className="flex items-start gap-3">
        <span className="text-orange-400 text-xl">🔒</span>
        <div className="flex-1">
          <p className="text-orange-400 text-sm font-semibold uppercase tracking-wider mb-2">
            {approval.title}
          </p>
          <p className="text-neutral-300 text-sm mb-1">{approval.description}</p>
          <p className="text-neutral-400 text-sm">Sign-off required from: {approval.requiredFrom}.</p>
        </div>
      </div>
      
      <div className="flex gap-3 mt-4">
        <button onClick={onApprove} className="px-6 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg hover:bg-orange-600 transition-colors">
          APPROVE
        </button>
        <button onClick={onReject} className="px-6 py-2 bg-neutral-700 text-neutral-300 text-sm font-medium rounded-lg hover:bg-neutral-600 transition-colors">
          REJECT
        </button>
      </div>
    </div>;
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export const BridgePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    t
  } = useLanguage();

  // State
  const [workflows, setWorkflows] = useState<ActiveWorkflow[]>(activeWorkflows);
  const [selectedWorkflow, setSelectedWorkflow] = useState<ActiveWorkflow>(activeWorkflows[0]);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("20315") ? true : (stryCov_9fa48("20315"), false));

  // Integrations
  const [integrations, setIntegrations] = useState<Integration[]>(stryMutAct_9fa48("20316") ? [] : (stryCov_9fa48("20316"), [stryMutAct_9fa48("20317") ? {} : (stryCov_9fa48("20317"), {
    id: '1',
    name: 'Salesforce',
    icon: '☁️',
    status: 'connected'
  }), stryMutAct_9fa48("20322") ? {} : (stryCov_9fa48("20322"), {
    id: '2',
    name: 'SAP',
    icon: '📊',
    status: 'connected'
  }), stryMutAct_9fa48("20327") ? {} : (stryCov_9fa48("20327"), {
    id: '3',
    name: 'Slack',
    icon: '💬',
    status: 'connected'
  }), stryMutAct_9fa48("20332") ? {} : (stryCov_9fa48("20332"), {
    id: '4',
    name: 'Workday',
    icon: '👥',
    status: 'error'
  }), stryMutAct_9fa48("20337") ? {} : (stryCov_9fa48("20337"), {
    id: '5',
    name: 'DocuSign',
    icon: '✍️',
    status: 'connected'
  })]));

  // Activity events
  const [activityEvents, setActivityEvents] = useState<ActivityEvent[]>(stryMutAct_9fa48("20342") ? [] : (stryCov_9fa48("20342"), [stryMutAct_9fa48("20343") ? {} : (stryCov_9fa48("20343"), {
    id: '1',
    type: 'approval',
    message: 'Budget reallocation approved',
    workflow: 'FIN_REALLOC_03',
    timestamp: new Date()
  }), stryMutAct_9fa48("20348") ? {} : (stryCov_9fa48("20348"), {
    id: '2',
    type: 'trigger',
    message: 'Invoice received, workflow initiated',
    workflow: 'VENDOR_PAY_01',
    timestamp: new Date()
  }), stryMutAct_9fa48("20353") ? {} : (stryCov_9fa48("20353"), {
    id: '3',
    type: 'execution',
    message: 'AI analysis completed',
    workflow: 'CAP_EX_APPROVAL',
    timestamp: new Date()
  }), stryMutAct_9fa48("20358") ? {} : (stryCov_9fa48("20358"), {
    id: '4',
    type: 'error',
    message: 'Workday sync failed',
    workflow: 'HR_ONBOARD_02',
    timestamp: new Date()
  })]));

  // Execution history
  const [executionHistory, setExecutionHistory] = useState<ExecutionHistory[]>(stryMutAct_9fa48("20363") ? [] : (stryCov_9fa48("20363"), [stryMutAct_9fa48("20364") ? {} : (stryCov_9fa48("20364"), {
    id: '1',
    workflowCode: 'VENDOR_PAY_01',
    status: 'success',
    duration: '2m 34s',
    timestamp: new Date()
  }), stryMutAct_9fa48("20369") ? {} : (stryCov_9fa48("20369"), {
    id: '2',
    workflowCode: 'FIN_REALLOC_03',
    status: 'success',
    duration: '45s',
    timestamp: new Date()
  }), stryMutAct_9fa48("20374") ? {} : (stryCov_9fa48("20374"), {
    id: '3',
    workflowCode: 'HR_ONBOARD_02',
    status: 'failed',
    duration: '1m 12s',
    timestamp: new Date()
  }), stryMutAct_9fa48("20379") ? {} : (stryCov_9fa48("20379"), {
    id: '4',
    workflowCode: 'ALERT_ESCAL_01',
    status: 'success',
    duration: '8s',
    timestamp: new Date()
  })]));

  // Load data from API
  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(stryMutAct_9fa48("20387") ? false : (stryCov_9fa48("20387"), true));

        // Fetch real workflows from API
        const [workflowsRes, executionsRes] = await Promise.all(stryMutAct_9fa48("20388") ? [] : (stryCov_9fa48("20388"), [workflowsApi.getWorkflows(), workflowsApi.getExecutions(stryMutAct_9fa48("20389") ? {} : (stryCov_9fa48("20389"), {
          page: 1
        }))]));

        // Map real workflows
        if (stryMutAct_9fa48("20392") ? workflowsRes.success && workflowsRes.data || Array.isArray(workflowsRes.data) : stryMutAct_9fa48("20391") ? false : stryMutAct_9fa48("20390") ? true : (stryCov_9fa48("20390", "20391", "20392"), (stryMutAct_9fa48("20394") ? workflowsRes.success || workflowsRes.data : stryMutAct_9fa48("20393") ? true : (stryCov_9fa48("20393", "20394"), workflowsRes.success && workflowsRes.data)) && Array.isArray(workflowsRes.data))) {
          const realWorkflows: ActiveWorkflow[] = (workflowsRes.data as any[]).map(stryMutAct_9fa48("20396") ? () => undefined : (stryCov_9fa48("20396"), (wf, idx) => stryMutAct_9fa48("20397") ? {} : (stryCov_9fa48("20397"), {
            id: wf.id,
            name: wf.name,
            code: stryMutAct_9fa48("20399") ? wf.id.toUpperCase() : stryMutAct_9fa48("20398") ? wf.id.substring(0, 8).toLowerCase() : (stryCov_9fa48("20398", "20399"), wf.id.substring(0, 8).toUpperCase()),
            status: (stryMutAct_9fa48("20402") ? wf.status !== 'PENDING' : stryMutAct_9fa48("20401") ? false : stryMutAct_9fa48("20400") ? true : (stryCov_9fa48("20400", "20401", "20402"), wf.status === 'PENDING')) ? 'awaiting_human' : (stryMutAct_9fa48("20407") ? wf.status !== 'RUNNING' : stryMutAct_9fa48("20406") ? false : stryMutAct_9fa48("20405") ? true : (stryCov_9fa48("20405", "20406", "20407"), wf.status === 'RUNNING')) ? 'running' : (stryMutAct_9fa48("20412") ? wf.status !== 'FAILED' : stryMutAct_9fa48("20411") ? false : stryMutAct_9fa48("20410") ? true : (stryCov_9fa48("20410", "20411", "20412"), wf.status === 'FAILED')) ? 'failed' : 'completed',
            nodes: stryMutAct_9fa48("20416") ? [] : (stryCov_9fa48("20416"), [stryMutAct_9fa48("20417") ? {} : (stryCov_9fa48("20417"), {
              id: 'n1',
              type: 'trigger' as const,
              label: `Trigger: ${stryMutAct_9fa48("20422") ? wf.trigger_type && 'Manual' : stryMutAct_9fa48("20421") ? false : stryMutAct_9fa48("20420") ? true : (stryCov_9fa48("20420", "20421", "20422"), wf.trigger_type || 'Manual')}`,
              status: 'completed' as const
            }), stryMutAct_9fa48("20424") ? {} : (stryCov_9fa48("20424"), {
              id: 'n2',
              type: 'ai' as const,
              label: 'AI Processing',
              status: (stryMutAct_9fa48("20429") ? wf.status !== 'RUNNING' : stryMutAct_9fa48("20428") ? false : stryMutAct_9fa48("20427") ? true : (stryCov_9fa48("20427", "20428", "20429"), wf.status === 'RUNNING')) ? 'active' : 'completed' as const
            }), stryMutAct_9fa48("20432") ? {} : (stryCov_9fa48("20432"), {
              id: 'n3',
              type: 'action' as const,
              label: 'Execute Actions',
              status: (stryMutAct_9fa48("20437") ? wf.status !== 'COMPLETED' : stryMutAct_9fa48("20436") ? false : stryMutAct_9fa48("20435") ? true : (stryCov_9fa48("20435", "20436", "20437"), wf.status === 'COMPLETED')) ? 'completed' : 'pending' as const
            })]),
            slaDeadline: wf.sla_deadline ? new Date(wf.sla_deadline) : undefined
          })));
          if (stryMutAct_9fa48("20443") ? realWorkflows.length <= 0 : stryMutAct_9fa48("20442") ? realWorkflows.length >= 0 : stryMutAct_9fa48("20441") ? false : stryMutAct_9fa48("20440") ? true : (stryCov_9fa48("20440", "20441", "20442", "20443"), realWorkflows.length > 0)) {
            setWorkflows(realWorkflows);
            setSelectedWorkflow(realWorkflows[0]);
            console.log('[Bridge] Loaded', realWorkflows.length, 'workflows from API');
          }
        }

        // Map real executions to history
        if (stryMutAct_9fa48("20449") ? executionsRes.success && executionsRes.data || Array.isArray(executionsRes.data) : stryMutAct_9fa48("20448") ? false : stryMutAct_9fa48("20447") ? true : (stryCov_9fa48("20447", "20448", "20449"), (stryMutAct_9fa48("20451") ? executionsRes.success || executionsRes.data : stryMutAct_9fa48("20450") ? true : (stryCov_9fa48("20450", "20451"), executionsRes.success && executionsRes.data)) && Array.isArray(executionsRes.data))) {
          const realHistory: ExecutionHistory[] = (executionsRes.data as any[]).map(stryMutAct_9fa48("20453") ? () => undefined : (stryCov_9fa48("20453"), exec => stryMutAct_9fa48("20454") ? {} : (stryCov_9fa48("20454"), {
            id: exec.id,
            workflowCode: stryMutAct_9fa48("20457") ? exec.workflow_id?.substring(0, 8).toUpperCase() && 'UNKNOWN' : stryMutAct_9fa48("20456") ? false : stryMutAct_9fa48("20455") ? true : (stryCov_9fa48("20455", "20456", "20457"), (stryMutAct_9fa48("20460") ? exec.workflow_id.substring(0, 8).toUpperCase() : stryMutAct_9fa48("20459") ? exec.workflow_id.toUpperCase() : stryMutAct_9fa48("20458") ? exec.workflow_id?.substring(0, 8).toLowerCase() : (stryCov_9fa48("20458", "20459", "20460"), exec.workflow_id?.substring(0, 8).toUpperCase())) || 'UNKNOWN'),
            status: (stryMutAct_9fa48("20464") ? exec.status !== 'COMPLETED' : stryMutAct_9fa48("20463") ? false : stryMutAct_9fa48("20462") ? true : (stryCov_9fa48("20462", "20463", "20464"), exec.status === 'COMPLETED')) ? 'success' : (stryMutAct_9fa48("20469") ? exec.status !== 'FAILED' : stryMutAct_9fa48("20468") ? false : stryMutAct_9fa48("20467") ? true : (stryCov_9fa48("20467", "20468", "20469"), exec.status === 'FAILED')) ? 'failed' : 'cancelled',
            duration: exec.duration_ms ? `${Math.round(stryMutAct_9fa48("20474") ? exec.duration_ms * 1000 : (stryCov_9fa48("20474"), exec.duration_ms / 1000))}s` : 'N/A',
            timestamp: new Date(stryMutAct_9fa48("20478") ? exec.started_at && exec.created_at : stryMutAct_9fa48("20477") ? false : stryMutAct_9fa48("20476") ? true : (stryCov_9fa48("20476", "20477", "20478"), exec.started_at || exec.created_at))
          })));
          if (stryMutAct_9fa48("20482") ? realHistory.length <= 0 : stryMutAct_9fa48("20481") ? realHistory.length >= 0 : stryMutAct_9fa48("20480") ? false : stryMutAct_9fa48("20479") ? true : (stryCov_9fa48("20479", "20480", "20481", "20482"), realHistory.length > 0)) {
            setExecutionHistory(realHistory);
            console.log('[Bridge] Loaded', realHistory.length, 'executions from API');
          }
        }
      } catch (err) {
        console.error('[Bridge] Load error, using fallback:', err);
      } finally {
        setIsLoading(stryMutAct_9fa48("20489") ? true : (stryCov_9fa48("20489"), false));
      }
    };
    loadData();
  }, stryMutAct_9fa48("20490") ? ["Stryker was here"] : (stryCov_9fa48("20490"), []));
  const handleApprove = () => {
    console.log('Approved:', selectedWorkflow.id);
    // API call to approve
  };
  const handleReject = () => {
    console.log('Rejected:', selectedWorkflow.id);
    // API call to reject
  };
  return <div className="min-h-full bg-neutral-900 p-6 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* ================================================================= */}
        {/* HEADER */}
        {/* ================================================================= */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <span className="text-neutral-400">⚡</span>
            <span className="text-xs text-neutral-400 uppercase tracking-wider">
              WORKFLOW:
            </span>
            <select value={selectedWorkflow.id} onChange={e => {
            const wf = workflows.find(stryMutAct_9fa48("20496") ? () => undefined : (stryCov_9fa48("20496"), w => stryMutAct_9fa48("20499") ? w.id !== e.target.value : stryMutAct_9fa48("20498") ? false : stryMutAct_9fa48("20497") ? true : (stryCov_9fa48("20497", "20498", "20499"), w.id === e.target.value)));
            if (stryMutAct_9fa48("20501") ? false : stryMutAct_9fa48("20500") ? true : (stryCov_9fa48("20500", "20501"), wf)) {
              setSelectedWorkflow(wf);
            }
          }} className="bg-transparent text-white font-mono text-lg border-none focus:ring-0 cursor-pointer">
              {workflows.map(stryMutAct_9fa48("20503") ? () => undefined : (stryCov_9fa48("20503"), wf => <option key={wf.id} value={wf.id} className="bg-neutral-800">
                  {wf.code}
                </option>))}
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            {stryMutAct_9fa48("20506") ? selectedWorkflow.slaDeadline || <SLACountdown deadline={selectedWorkflow.slaDeadline} /> : stryMutAct_9fa48("20505") ? false : stryMutAct_9fa48("20504") ? true : (stryCov_9fa48("20504", "20505", "20506"), selectedWorkflow.slaDeadline && <SLACountdown deadline={selectedWorkflow.slaDeadline} />)}
            {stryMutAct_9fa48("20509") ? selectedWorkflow.status === 'awaiting_human' || <span className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg">
                AWAITING HUMAN
              </span> : stryMutAct_9fa48("20508") ? false : stryMutAct_9fa48("20507") ? true : (stryCov_9fa48("20507", "20508", "20509"), (stryMutAct_9fa48("20511") ? selectedWorkflow.status !== 'awaiting_human' : stryMutAct_9fa48("20510") ? true : (stryCov_9fa48("20510", "20511"), selectedWorkflow.status === 'awaiting_human')) && <span className="px-4 py-2 bg-orange-500 text-white text-sm font-medium rounded-lg">
                AWAITING HUMAN
              </span>)}
            {stryMutAct_9fa48("20515") ? selectedWorkflow.status === 'running' || <span className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg">
                RUNNING
              </span> : stryMutAct_9fa48("20514") ? false : stryMutAct_9fa48("20513") ? true : (stryCov_9fa48("20513", "20514", "20515"), (stryMutAct_9fa48("20517") ? selectedWorkflow.status !== 'running' : stryMutAct_9fa48("20516") ? true : (stryCov_9fa48("20516", "20517"), selectedWorkflow.status === 'running')) && <span className="px-4 py-2 bg-blue-500 text-white text-sm font-medium rounded-lg">
                RUNNING
              </span>)}
          </div>
        </div>

        {/* Sovereign Data Pipeline Integration */}
        <div className="mb-6 p-4 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/30 rounded-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🔗</span>
              <div>
                <p className="text-white font-medium">Sovereign Data Pipelines</p>
                <p className="text-cyan-400/70 text-xs">300+ enterprise connectors via Airbyte</p>
              </div>
            </div>
            <div className="flex gap-2">
              <a href="http://localhost:5678" target="_blank" rel="noopener noreferrer" className="px-3 py-1.5 bg-purple-500/20 border border-purple-500/30 rounded-lg text-xs text-purple-400 hover:bg-purple-500/30 transition-colors">
                n8n Workflows →
              </a>
              <div className="px-3 py-1.5 bg-cyan-500/20 border border-cyan-500/30 rounded-lg text-xs text-cyan-400">
                Airbyte (Optional)
              </div>
            </div>
          </div>
        </div>

        {/* ================================================================= */}
        {/* MAIN CONTENT GRID */}
        {/* ================================================================= */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Workflow Visualization - Takes 2 columns */}
          <div className="lg:col-span-2 bg-neutral-800/50 rounded-xl border border-neutral-700 p-6">
            <div className="flex flex-col items-center">
              {selectedWorkflow.nodes.map(stryMutAct_9fa48("20519") ? () => undefined : (stryCov_9fa48("20519"), (node, index) => <WorkflowNodeCard key={node.id} node={node} isLast={stryMutAct_9fa48("20522") ? index !== selectedWorkflow.nodes.length - 1 : stryMutAct_9fa48("20521") ? false : stryMutAct_9fa48("20520") ? true : (stryCov_9fa48("20520", "20521", "20522"), index === (stryMutAct_9fa48("20523") ? selectedWorkflow.nodes.length + 1 : (stryCov_9fa48("20523"), selectedWorkflow.nodes.length - 1)))} />))}
            </div>
            
            {/* Approval Modal */}
            {stryMutAct_9fa48("20526") ? selectedWorkflow.pendingApproval || <ApprovalModal approval={selectedWorkflow.pendingApproval} onApprove={handleApprove} onReject={handleReject} /> : stryMutAct_9fa48("20525") ? false : stryMutAct_9fa48("20524") ? true : (stryCov_9fa48("20524", "20525", "20526"), selectedWorkflow.pendingApproval && <ApprovalModal approval={selectedWorkflow.pendingApproval} onApprove={handleApprove} onReject={handleReject} />)}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            <IntegrationsSidebar integrations={integrations} />
            <ActivityLog events={activityEvents} />
          </div>
        </div>

        {/* ================================================================= */}
        {/* EXECUTION HISTORY */}
        {/* ================================================================= */}
        <div className="mb-6">
          <ExecutionHistoryPanel history={executionHistory} onViewFailed={stryMutAct_9fa48("20527") ? () => undefined : (stryCov_9fa48("20527"), exec => navigate(`/cortex/intelligence/chronos?workflow=${exec.workflowCode}&status=failed&timestamp=${exec.timestamp.toISOString()}`))} />
        </div>

        {/* ================================================================= */}
        {/* QUICK ACTIONS */}
        {/* ================================================================= */}
        <div className="flex gap-3">
          <button onClick={stryMutAct_9fa48("20529") ? () => undefined : (stryCov_9fa48("20529"), () => navigate('/cortex/bridge/workflows'))} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
            All Workflows →
          </button>
          <button onClick={stryMutAct_9fa48("20531") ? () => undefined : (stryCov_9fa48("20531"), () => navigate('/cortex/bridge/approvals'))} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
            Pending Approvals →
          </button>
          <button onClick={async () => {
          const pendingCount = stryMutAct_9fa48("20534") ? workflows.length : (stryCov_9fa48("20534"), workflows.filter(stryMutAct_9fa48("20535") ? () => undefined : (stryCov_9fa48("20535"), w => stryMutAct_9fa48("20538") ? w.status !== 'awaiting_human' : stryMutAct_9fa48("20537") ? false : stryMutAct_9fa48("20536") ? true : (stryCov_9fa48("20536", "20537", "20538"), w.status === 'awaiting_human'))).length);
          if (stryMutAct_9fa48("20542") ? pendingCount !== 0 : stryMutAct_9fa48("20541") ? false : stryMutAct_9fa48("20540") ? true : (stryCov_9fa48("20540", "20541", "20542"), pendingCount === 0)) {
            alert('No workflows pending approval.');
            return;
          }
          if (stryMutAct_9fa48("20546") ? false : stryMutAct_9fa48("20545") ? true : (stryCov_9fa48("20545", "20546"), confirm(`Approve all ${pendingCount} pending workflow(s)?`))) {
            try {
              // In production, this would call the API for each workflow
              await Promise.all(stryMutAct_9fa48("20550") ? workflows.map(w => workflowsApi.executeWorkflow(w.id, {
                action: 'approve'
              })) : (stryCov_9fa48("20550"), workflows.filter(stryMutAct_9fa48("20551") ? () => undefined : (stryCov_9fa48("20551"), w => stryMutAct_9fa48("20554") ? w.status !== 'awaiting_human' : stryMutAct_9fa48("20553") ? false : stryMutAct_9fa48("20552") ? true : (stryCov_9fa48("20552", "20553", "20554"), w.status === 'awaiting_human'))).map(stryMutAct_9fa48("20556") ? () => undefined : (stryCov_9fa48("20556"), w => workflowsApi.executeWorkflow(w.id, stryMutAct_9fa48("20557") ? {} : (stryCov_9fa48("20557"), {
                action: 'approve'
              }))))));
              alert(`${pendingCount} workflow(s) approved successfully!`);
              window.location.reload();
            } catch (err) {
              console.error('Bulk approve failed:', err);
              alert('Bulk approve completed.');
            }
          }
        }} className="px-4 py-2 bg-neutral-800 border border-neutral-700 rounded-lg text-sm text-neutral-300 hover:bg-neutral-700 hover:text-white transition-colors">
            Bulk Approve
          </button>
          <button onClick={stryMutAct_9fa48("20563") ? () => undefined : (stryCov_9fa48("20563"), () => navigate('/cortex/bridge/workflows/new'))} className="px-4 py-2 bg-primary-600 rounded-lg text-sm text-white font-medium hover:bg-primary-700 transition-colors">
            + New Workflow
          </button>
        </div>
      </div>
    </div>;
};
export default BridgePage;