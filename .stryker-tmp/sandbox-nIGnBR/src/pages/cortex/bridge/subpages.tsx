// @ts-nocheck
// =============================================================================
// DATACENDIA - BRIDGE SUB-PAGES
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
import { useNavigate, useParams } from 'react-router-dom';
import { cn, formatRelativeTime } from '../../../../lib/utils';
import { workflowsApi, dataSourcesApi } from '../../../lib/api';
import { PageGuide, GUIDES } from '../../../components/PageGuide';

// =============================================================================
// WORKFLOWS LIST PAGE
// =============================================================================

interface Workflow {
  id: string;
  name: string;
  status: string;
  trigger: string;
  schedule: string;
  steps: number;
  runs: {
    success: number;
    failed: number;
  };
  lastRun: Date | null;
}
const FALLBACK_WORKFLOWS: Workflow[] = stryMutAct_9fa48("20565") ? [] : (stryCov_9fa48("20565"), [stryMutAct_9fa48("20566") ? {} : (stryCov_9fa48("20566"), {
  id: 'wf-1',
  name: 'Monthly Financial Close',
  status: 'active',
  trigger: 'schedule',
  schedule: '1st of month',
  steps: 12,
  runs: stryMutAct_9fa48("20572") ? {} : (stryCov_9fa48("20572"), {
    success: 24,
    failed: 1
  }),
  lastRun: new Date(stryMutAct_9fa48("20573") ? Date.now() + 86400000 : (stryCov_9fa48("20573"), Date.now() - 86400000))
}), stryMutAct_9fa48("20574") ? {} : (stryCov_9fa48("20574"), {
  id: 'wf-2',
  name: 'Alert Escalation',
  status: 'active',
  trigger: 'event',
  schedule: 'On critical alert',
  steps: 5,
  runs: stryMutAct_9fa48("20580") ? {} : (stryCov_9fa48("20580"), {
    success: 156,
    failed: 3
  }),
  lastRun: new Date(stryMutAct_9fa48("20581") ? Date.now() + 3600000 : (stryCov_9fa48("20581"), Date.now() - 3600000))
}), stryMutAct_9fa48("20582") ? {} : (stryCov_9fa48("20582"), {
  id: 'wf-3',
  name: 'Customer Onboarding',
  status: 'active',
  trigger: 'manual',
  schedule: 'Manual',
  steps: 8,
  runs: stryMutAct_9fa48("20588") ? {} : (stryCov_9fa48("20588"), {
    success: 89,
    failed: 2
  }),
  lastRun: new Date(stryMutAct_9fa48("20589") ? Date.now() + 7200000 : (stryCov_9fa48("20589"), Date.now() - 7200000))
}), stryMutAct_9fa48("20590") ? {} : (stryCov_9fa48("20590"), {
  id: 'wf-4',
  name: 'Vendor Onboarding',
  status: 'draft',
  trigger: 'manual',
  schedule: 'Manual',
  steps: 18,
  runs: stryMutAct_9fa48("20596") ? {} : (stryCov_9fa48("20596"), {
    success: 0,
    failed: 0
  }),
  lastRun: null
}), stryMutAct_9fa48("20597") ? {} : (stryCov_9fa48("20597"), {
  id: 'wf-5',
  name: 'Employee Offboarding',
  status: 'paused',
  trigger: 'manual',
  schedule: 'Manual',
  steps: 22,
  runs: stryMutAct_9fa48("20603") ? {} : (stryCov_9fa48("20603"), {
    success: 45,
    failed: 2
  }),
  lastRun: new Date(stryMutAct_9fa48("20604") ? Date.now() + 604800000 : (stryCov_9fa48("20604"), Date.now() - 604800000))
})]);
export const WorkflowsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'active' | 'draft' | 'paused'>('all');
  const [workflows, setWorkflows] = useState<Workflow[]>(FALLBACK_WORKFLOWS);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("20607") ? false : (stryCov_9fa48("20607"), true));
  React.useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const response = await workflowsApi.getWorkflows({});
        if (stryMutAct_9fa48("20613") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("20612") ? false : stryMutAct_9fa48("20611") ? true : (stryCov_9fa48("20611", "20612", "20613"), (stryMutAct_9fa48("20615") ? response.success || response.data : stryMutAct_9fa48("20614") ? true : (stryCov_9fa48("20614", "20615"), response.success && response.data)) && Array.isArray(response.data))) {
          const mapped: Workflow[] = response.data.map(stryMutAct_9fa48("20617") ? () => undefined : (stryCov_9fa48("20617"), (w: any) => stryMutAct_9fa48("20618") ? {} : (stryCov_9fa48("20618"), {
            id: w.id,
            name: w.name,
            status: stryMutAct_9fa48("20619") ? (w.status || 'draft').toUpperCase() : (stryCov_9fa48("20619"), (stryMutAct_9fa48("20622") ? w.status && 'draft' : stryMutAct_9fa48("20621") ? false : stryMutAct_9fa48("20620") ? true : (stryCov_9fa48("20620", "20621", "20622"), w.status || 'draft')).toLowerCase()),
            trigger: stryMutAct_9fa48("20626") ? w.trigger?.type && 'manual' : stryMutAct_9fa48("20625") ? false : stryMutAct_9fa48("20624") ? true : (stryCov_9fa48("20624", "20625", "20626"), (stryMutAct_9fa48("20627") ? w.trigger.type : (stryCov_9fa48("20627"), w.trigger?.type)) || 'manual'),
            schedule: stryMutAct_9fa48("20631") ? (w.trigger?.cron || w.trigger?.event) && 'Manual' : stryMutAct_9fa48("20630") ? false : stryMutAct_9fa48("20629") ? true : (stryCov_9fa48("20629", "20630", "20631"), (stryMutAct_9fa48("20633") ? w.trigger?.cron && w.trigger?.event : stryMutAct_9fa48("20632") ? false : (stryCov_9fa48("20632", "20633"), (stryMutAct_9fa48("20634") ? w.trigger.cron : (stryCov_9fa48("20634"), w.trigger?.cron)) || (stryMutAct_9fa48("20635") ? w.trigger.event : (stryCov_9fa48("20635"), w.trigger?.event)))) || 'Manual'),
            steps: stryMutAct_9fa48("20639") ? w.definition?.steps?.length && 0 : stryMutAct_9fa48("20638") ? false : stryMutAct_9fa48("20637") ? true : (stryCov_9fa48("20637", "20638", "20639"), (stryMutAct_9fa48("20641") ? w.definition.steps?.length : stryMutAct_9fa48("20640") ? w.definition?.steps.length : (stryCov_9fa48("20640", "20641"), w.definition?.steps?.length)) || 0),
            runs: stryMutAct_9fa48("20642") ? {} : (stryCov_9fa48("20642"), {
              success: stryMutAct_9fa48("20645") ? w.successCount && 0 : stryMutAct_9fa48("20644") ? false : stryMutAct_9fa48("20643") ? true : (stryCov_9fa48("20643", "20644", "20645"), w.successCount || 0),
              failed: stryMutAct_9fa48("20648") ? w.failedCount && 0 : stryMutAct_9fa48("20647") ? false : stryMutAct_9fa48("20646") ? true : (stryCov_9fa48("20646", "20647", "20648"), w.failedCount || 0)
            }),
            lastRun: w.lastExecutedAt ? new Date(w.lastExecutedAt) : null
          })));
          if (stryMutAct_9fa48("20652") ? mapped.length <= 0 : stryMutAct_9fa48("20651") ? mapped.length >= 0 : stryMutAct_9fa48("20650") ? false : stryMutAct_9fa48("20649") ? true : (stryCov_9fa48("20649", "20650", "20651", "20652"), mapped.length > 0)) setWorkflows(mapped);
        }
      } catch (err) {
        console.log('Using fallback workflows');
      } finally {
        setIsLoading(stryMutAct_9fa48("20656") ? true : (stryCov_9fa48("20656"), false));
      }
    };
    fetchWorkflows();
  }, stryMutAct_9fa48("20657") ? ["Stryker was here"] : (stryCov_9fa48("20657"), []));
  const filteredWorkflows = (stryMutAct_9fa48("20660") ? filter !== 'all' : stryMutAct_9fa48("20659") ? false : stryMutAct_9fa48("20658") ? true : (stryCov_9fa48("20658", "20659", "20660"), filter === 'all')) ? workflows : stryMutAct_9fa48("20662") ? workflows : (stryCov_9fa48("20662"), workflows.filter(stryMutAct_9fa48("20663") ? () => undefined : (stryCov_9fa48("20663"), w => stryMutAct_9fa48("20666") ? w.status !== filter : stryMutAct_9fa48("20665") ? false : stryMutAct_9fa48("20664") ? true : (stryCov_9fa48("20664", "20665", "20666"), w.status === filter))));
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Workflows</h1>
          <p className="text-neutral-500">Automate your business processes</p>
        </div>
        <button onClick={stryMutAct_9fa48("20667") ? () => undefined : (stryCov_9fa48("20667"), () => navigate('/cortex/bridge/workflows/new'))} className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Create Workflow
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['all', 'active', 'draft', 'paused'] as const).map(stryMutAct_9fa48("20669") ? () => undefined : (stryCov_9fa48("20669"), f => <button key={f} onClick={stryMutAct_9fa48("20670") ? () => undefined : (stryCov_9fa48("20670"), () => setFilter(f))} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize', (stryMutAct_9fa48("20674") ? filter !== f : stryMutAct_9fa48("20673") ? false : stryMutAct_9fa48("20672") ? true : (stryCov_9fa48("20672", "20673", "20674"), filter === f)) ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100')}>
            {f}
          </button>))}
      </div>

      {/* Workflow List */}
      <div className="space-y-4">
        {filteredWorkflows.map(stryMutAct_9fa48("20677") ? () => undefined : (stryCov_9fa48("20677"), workflow => <div key={workflow.id} onClick={stryMutAct_9fa48("20678") ? () => undefined : (stryCov_9fa48("20678"), () => navigate(`/cortex/bridge/workflows/${workflow.id}`))} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', stryMutAct_9fa48("20683") ? workflow.status === 'active' || 'bg-success-light text-success-main' : stryMutAct_9fa48("20682") ? false : stryMutAct_9fa48("20681") ? true : (stryCov_9fa48("20681", "20682", "20683"), (stryMutAct_9fa48("20685") ? workflow.status !== 'active' : stryMutAct_9fa48("20684") ? true : (stryCov_9fa48("20684", "20685"), workflow.status === 'active')) && 'bg-success-light text-success-main'), stryMutAct_9fa48("20690") ? workflow.status === 'draft' || 'bg-neutral-100 text-neutral-500' : stryMutAct_9fa48("20689") ? false : stryMutAct_9fa48("20688") ? true : (stryCov_9fa48("20688", "20689", "20690"), (stryMutAct_9fa48("20692") ? workflow.status !== 'draft' : stryMutAct_9fa48("20691") ? true : (stryCov_9fa48("20691", "20692"), workflow.status === 'draft')) && 'bg-neutral-100 text-neutral-500'), stryMutAct_9fa48("20697") ? workflow.status === 'paused' || 'bg-warning-light text-warning-main' : stryMutAct_9fa48("20696") ? false : stryMutAct_9fa48("20695") ? true : (stryCov_9fa48("20695", "20696", "20697"), (stryMutAct_9fa48("20699") ? workflow.status !== 'paused' : stryMutAct_9fa48("20698") ? true : (stryCov_9fa48("20698", "20699"), workflow.status === 'paused')) && 'bg-warning-light text-warning-main'))}>
                  {stryMutAct_9fa48("20704") ? workflow.trigger === 'schedule' || '⏰' : stryMutAct_9fa48("20703") ? false : stryMutAct_9fa48("20702") ? true : (stryCov_9fa48("20702", "20703", "20704"), (stryMutAct_9fa48("20706") ? workflow.trigger !== 'schedule' : stryMutAct_9fa48("20705") ? true : (stryCov_9fa48("20705", "20706"), workflow.trigger === 'schedule')) && '⏰')}
                  {stryMutAct_9fa48("20711") ? workflow.trigger === 'event' || '📨' : stryMutAct_9fa48("20710") ? false : stryMutAct_9fa48("20709") ? true : (stryCov_9fa48("20709", "20710", "20711"), (stryMutAct_9fa48("20713") ? workflow.trigger !== 'event' : stryMutAct_9fa48("20712") ? true : (stryCov_9fa48("20712", "20713"), workflow.trigger === 'event')) && '📨')}
                  {stryMutAct_9fa48("20718") ? workflow.trigger === 'manual' || '👤' : stryMutAct_9fa48("20717") ? false : stryMutAct_9fa48("20716") ? true : (stryCov_9fa48("20716", "20717", "20718"), (stryMutAct_9fa48("20720") ? workflow.trigger !== 'manual' : stryMutAct_9fa48("20719") ? true : (stryCov_9fa48("20719", "20720"), workflow.trigger === 'manual')) && '👤')}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{workflow.name}</h3>
                  <div className="flex items-center gap-4 mt-2 text-sm text-neutral-500">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-medium capitalize', stryMutAct_9fa48("20726") ? workflow.status === 'active' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("20725") ? false : stryMutAct_9fa48("20724") ? true : (stryCov_9fa48("20724", "20725", "20726"), (stryMutAct_9fa48("20728") ? workflow.status !== 'active' : stryMutAct_9fa48("20727") ? true : (stryCov_9fa48("20727", "20728"), workflow.status === 'active')) && 'bg-success-light text-success-dark'), stryMutAct_9fa48("20733") ? workflow.status === 'draft' || 'bg-neutral-100 text-neutral-600' : stryMutAct_9fa48("20732") ? false : stryMutAct_9fa48("20731") ? true : (stryCov_9fa48("20731", "20732", "20733"), (stryMutAct_9fa48("20735") ? workflow.status !== 'draft' : stryMutAct_9fa48("20734") ? true : (stryCov_9fa48("20734", "20735"), workflow.status === 'draft')) && 'bg-neutral-100 text-neutral-600'), stryMutAct_9fa48("20740") ? workflow.status === 'paused' || 'bg-warning-light text-warning-dark' : stryMutAct_9fa48("20739") ? false : stryMutAct_9fa48("20738") ? true : (stryCov_9fa48("20738", "20739", "20740"), (stryMutAct_9fa48("20742") ? workflow.status !== 'paused' : stryMutAct_9fa48("20741") ? true : (stryCov_9fa48("20741", "20742"), workflow.status === 'paused')) && 'bg-warning-light text-warning-dark'))}>
                      {workflow.status}
                    </span>
                    <span>{workflow.steps} steps</span>
                    <span>{workflow.schedule}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-success-main">{workflow.runs.success} success</span>
                  {stryMutAct_9fa48("20747") ? workflow.runs.failed > 0 || <span className="text-error-main">{workflow.runs.failed} failed</span> : stryMutAct_9fa48("20746") ? false : stryMutAct_9fa48("20745") ? true : (stryCov_9fa48("20745", "20746", "20747"), (stryMutAct_9fa48("20750") ? workflow.runs.failed <= 0 : stryMutAct_9fa48("20749") ? workflow.runs.failed >= 0 : stryMutAct_9fa48("20748") ? true : (stryCov_9fa48("20748", "20749", "20750"), workflow.runs.failed > 0)) && <span className="text-error-main">{workflow.runs.failed} failed</span>)}
                </div>
                <p className="text-xs text-neutral-400 mt-1">
                  {workflow.lastRun ? `Last run ${formatRelativeTime(workflow.lastRun)}` : 'Never run'}
                </p>
              </div>
            </div>
          </div>))}
      </div>
      
      {/* Page Guide */}
      <PageGuide {...GUIDES.workflows} />
    </div>;
};

// =============================================================================
// WORKFLOW BUILDER PAGE
// =============================================================================

export const WorkflowBuilderPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    workflowId
  } = useParams();
  const isNew = stryMutAct_9fa48("20756") ? workflowId !== 'new' : stryMutAct_9fa48("20755") ? false : stryMutAct_9fa48("20754") ? true : (stryCov_9fa48("20754", "20755", "20756"), workflowId === 'new');
  const [workflow, setWorkflow] = useState(stryMutAct_9fa48("20758") ? {} : (stryCov_9fa48("20758"), {
    name: isNew ? 'New Workflow' : 'Monthly Financial Close',
    trigger: 'schedule',
    schedule: '0 0 1 * *',
    steps: stryMutAct_9fa48("20763") ? [] : (stryCov_9fa48("20763"), [stryMutAct_9fa48("20764") ? {} : (stryCov_9fa48("20764"), {
      id: 1,
      type: 'query',
      name: 'Fetch Revenue Data',
      config: stryMutAct_9fa48("20767") ? {} : (stryCov_9fa48("20767"), {
        dataset: 'revenue_metrics'
      })
    }), stryMutAct_9fa48("20769") ? {} : (stryCov_9fa48("20769"), {
      id: 2,
      type: 'transform',
      name: 'Calculate Totals',
      config: {}
    }), stryMutAct_9fa48("20772") ? {} : (stryCov_9fa48("20772"), {
      id: 3,
      type: 'agent',
      name: 'CendiaCFO Analysis',
      config: stryMutAct_9fa48("20775") ? {} : (stryCov_9fa48("20775"), {
        agent: 'cfo'
      })
    }), stryMutAct_9fa48("20777") ? {} : (stryCov_9fa48("20777"), {
      id: 4,
      type: 'approval',
      name: 'CFO Approval',
      config: stryMutAct_9fa48("20780") ? {} : (stryCov_9fa48("20780"), {
        approvers: stryMutAct_9fa48("20781") ? [] : (stryCov_9fa48("20781"), ['cfo@acme.com'])
      })
    }), stryMutAct_9fa48("20783") ? {} : (stryCov_9fa48("20783"), {
      id: 5,
      type: 'action',
      name: 'Generate Report',
      config: stryMutAct_9fa48("20786") ? {} : (stryCov_9fa48("20786"), {
        format: 'pdf'
      })
    }), stryMutAct_9fa48("20788") ? {} : (stryCov_9fa48("20788"), {
      id: 6,
      type: 'notify',
      name: 'Send to Stakeholders',
      config: stryMutAct_9fa48("20791") ? {} : (stryCov_9fa48("20791"), {
        channel: 'slack'
      })
    })])
  }));
  const stepTypes = stryMutAct_9fa48("20793") ? [] : (stryCov_9fa48("20793"), [stryMutAct_9fa48("20794") ? {} : (stryCov_9fa48("20794"), {
    type: 'query',
    icon: '📊',
    label: 'Query Data'
  }), stryMutAct_9fa48("20798") ? {} : (stryCov_9fa48("20798"), {
    type: 'transform',
    icon: '🔄',
    label: 'Transform'
  }), stryMutAct_9fa48("20802") ? {} : (stryCov_9fa48("20802"), {
    type: 'agent',
    icon: '🤖',
    label: 'AI Agent'
  }), stryMutAct_9fa48("20806") ? {} : (stryCov_9fa48("20806"), {
    type: 'approval',
    icon: '✅',
    label: 'Approval'
  }), stryMutAct_9fa48("20810") ? {} : (stryCov_9fa48("20810"), {
    type: 'action',
    icon: '⚡',
    label: 'Action'
  }), stryMutAct_9fa48("20814") ? {} : (stryCov_9fa48("20814"), {
    type: 'notify',
    icon: '🔔',
    label: 'Notify'
  }), stryMutAct_9fa48("20818") ? {} : (stryCov_9fa48("20818"), {
    type: 'condition',
    icon: '🔀',
    label: 'Condition'
  }), stryMutAct_9fa48("20822") ? {} : (stryCov_9fa48("20822"), {
    type: 'wait',
    icon: '⏳',
    label: 'Wait'
  })]);
  return <div className="h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-neutral-200 bg-white">
        <div className="flex items-center gap-4">
          <button onClick={stryMutAct_9fa48("20826") ? () => undefined : (stryCov_9fa48("20826"), () => navigate('/cortex/bridge/workflows'))} className="text-neutral-500 hover:text-neutral-900">
            ← Back
          </button>
          <input type="text" value={workflow.name} onChange={stryMutAct_9fa48("20828") ? () => undefined : (stryCov_9fa48("20828"), e => setWorkflow(stryMutAct_9fa48("20829") ? {} : (stryCov_9fa48("20829"), {
          ...workflow,
          name: e.target.value
        })))} className="text-xl font-bold text-neutral-900 border-0 focus:ring-0 p-0 bg-transparent" />
        </div>
        <div className="flex items-center gap-2">
          <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
            Test Run
          </button>
          <button className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700">
            Save & Activate
          </button>
        </div>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* Steps Palette */}
        <div className="w-64 border-r border-neutral-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Add Steps</h3>
          <div className="grid grid-cols-2 gap-2">
            {stepTypes.map(stryMutAct_9fa48("20830") ? () => undefined : (stryCov_9fa48("20830"), step => <button key={step.type} className="p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 text-center transition-colors">
                <div className="text-2xl mb-1">{step.icon}</div>
                <span className="text-xs text-neutral-600">{step.label}</span>
              </button>))}
          </div>

          <div className="mt-6">
            <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Trigger</h3>
            <select value={workflow.trigger} onChange={stryMutAct_9fa48("20831") ? () => undefined : (stryCov_9fa48("20831"), e => setWorkflow(stryMutAct_9fa48("20832") ? {} : (stryCov_9fa48("20832"), {
            ...workflow,
            trigger: e.target.value
          })))} className="w-full h-10 px-3 border border-neutral-300 rounded-lg">
              <option value="schedule">Schedule</option>
              <option value="event">Event</option>
              <option value="manual">Manual</option>
              <option value="webhook">Webhook</option>
            </select>
            {stryMutAct_9fa48("20835") ? workflow.trigger === 'schedule' || <input type="text" value={workflow.schedule} onChange={e => setWorkflow({
            ...workflow,
            schedule: e.target.value
          })} placeholder="Cron expression" className="w-full h-10 px-3 border border-neutral-300 rounded-lg mt-2 font-mono text-sm" /> : stryMutAct_9fa48("20834") ? false : stryMutAct_9fa48("20833") ? true : (stryCov_9fa48("20833", "20834", "20835"), (stryMutAct_9fa48("20837") ? workflow.trigger !== 'schedule' : stryMutAct_9fa48("20836") ? true : (stryCov_9fa48("20836", "20837"), workflow.trigger === 'schedule')) && <input type="text" value={workflow.schedule} onChange={stryMutAct_9fa48("20839") ? () => undefined : (stryCov_9fa48("20839"), e => setWorkflow(stryMutAct_9fa48("20840") ? {} : (stryCov_9fa48("20840"), {
            ...workflow,
            schedule: e.target.value
          })))} placeholder="Cron expression" className="w-full h-10 px-3 border border-neutral-300 rounded-lg mt-2 font-mono text-sm" />)}
          </div>
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-neutral-100 p-8 overflow-auto">
          <div className="max-w-2xl mx-auto space-y-4">
            {/* Trigger */}
            <div className="bg-primary-100 border-2 border-primary-500 rounded-xl p-4 text-center">
              <span className="text-2xl">🎯</span>
              <p className="font-medium text-primary-700 mt-1">Trigger</p>
              <p className="text-sm text-primary-600">{workflow.trigger}</p>
            </div>

            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-neutral-300" />
            </div>

            {/* Steps */}
            {workflow.steps.map(stryMutAct_9fa48("20841") ? () => undefined : (stryCov_9fa48("20841"), (step, index) => <React.Fragment key={step.id}>
                <div className="bg-white rounded-xl border border-neutral-200 p-4 hover:border-primary-300 hover:shadow-sm transition-all cursor-pointer">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center text-xl">
                      {stryMutAct_9fa48("20842") ? stepTypes.find(s => s.type === step.type).icon : (stryCov_9fa48("20842"), stepTypes.find(stryMutAct_9fa48("20843") ? () => undefined : (stryCov_9fa48("20843"), s => stryMutAct_9fa48("20846") ? s.type !== step.type : stryMutAct_9fa48("20845") ? false : stryMutAct_9fa48("20844") ? true : (stryCov_9fa48("20844", "20845", "20846"), s.type === step.type)))?.icon)}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-neutral-900">{step.name}</h4>
                      <p className="text-sm text-neutral-500 capitalize">{step.type}</p>
                    </div>
                    <button className="text-neutral-400 hover:text-neutral-600">•••</button>
                  </div>
                </div>
                
                {stryMutAct_9fa48("20849") ? index < workflow.steps.length - 1 || <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-neutral-300" />
                  </div> : stryMutAct_9fa48("20848") ? false : stryMutAct_9fa48("20847") ? true : (stryCov_9fa48("20847", "20848", "20849"), (stryMutAct_9fa48("20852") ? index >= workflow.steps.length - 1 : stryMutAct_9fa48("20851") ? index <= workflow.steps.length - 1 : stryMutAct_9fa48("20850") ? true : (stryCov_9fa48("20850", "20851", "20852"), index < (stryMutAct_9fa48("20853") ? workflow.steps.length + 1 : (stryCov_9fa48("20853"), workflow.steps.length - 1)))) && <div className="flex justify-center">
                    <div className="w-0.5 h-8 bg-neutral-300" />
                  </div>)}
              </React.Fragment>))}

            {/* Add Step */}
            <div className="flex justify-center">
              <div className="w-0.5 h-8 bg-neutral-300" />
            </div>
            <button className="w-full border-2 border-dashed border-neutral-300 rounded-xl p-4 text-neutral-500 hover:border-primary-300 hover:text-primary-600 transition-colors">
              + Add Step
            </button>
          </div>
        </div>

        {/* Properties Panel */}
        <div className="w-80 border-l border-neutral-200 bg-white p-4 overflow-y-auto">
          <h3 className="text-sm font-semibold text-neutral-500 uppercase mb-3">Properties</h3>
          <p className="text-sm text-neutral-400">Select a step to configure its properties</p>
        </div>
      </div>
    </div>;
};

// =============================================================================
// APPROVALS PAGE
// =============================================================================

export const ApprovalsPage: React.FC = () => {
  const [filter, setFilter] = useState<'pending' | 'approved' | 'rejected' | 'all'>('pending');
  const approvals = stryMutAct_9fa48("20856") ? [] : (stryCov_9fa48("20856"), [stryMutAct_9fa48("20857") ? {} : (stryCov_9fa48("20857"), {
    id: 1,
    type: 'workflow',
    title: 'Monthly Close - CFO Approval',
    requestor: 'System',
    workflow: 'Monthly Financial Close',
    priority: 'high',
    requestedAt: new Date(stryMutAct_9fa48("20863") ? Date.now() + 3600000 : (stryCov_9fa48("20863"), Date.now() - 3600000)),
    status: 'pending'
  }), stryMutAct_9fa48("20865") ? {} : (stryCov_9fa48("20865"), {
    id: 2,
    type: 'access',
    title: 'Production Database Access',
    requestor: 'John Smith',
    details: 'Read access to production DB',
    priority: 'medium',
    requestedAt: new Date(stryMutAct_9fa48("20871") ? Date.now() + 7200000 : (stryCov_9fa48("20871"), Date.now() - 7200000)),
    status: 'pending'
  }), stryMutAct_9fa48("20873") ? {} : (stryCov_9fa48("20873"), {
    id: 3,
    type: 'budget',
    title: 'Q2 Marketing Budget Increase',
    requestor: 'Sarah Chen',
    details: '+$50,000 for campaign',
    priority: 'medium',
    requestedAt: new Date(stryMutAct_9fa48("20879") ? Date.now() + 14400000 : (stryCov_9fa48("20879"), Date.now() - 14400000)),
    status: 'pending'
  }), stryMutAct_9fa48("20881") ? {} : (stryCov_9fa48("20881"), {
    id: 4,
    type: 'vendor',
    title: 'New Vendor: CloudTech Inc',
    requestor: 'Mike Johnson',
    details: 'Data analytics vendor',
    priority: 'low',
    requestedAt: new Date(stryMutAct_9fa48("20887") ? Date.now() + 86400000 : (stryCov_9fa48("20887"), Date.now() - 86400000)),
    status: 'approved'
  }), stryMutAct_9fa48("20889") ? {} : (stryCov_9fa48("20889"), {
    id: 5,
    type: 'access',
    title: 'Admin Console Access',
    requestor: 'Emily Davis',
    details: 'Full admin access',
    priority: 'high',
    requestedAt: new Date(stryMutAct_9fa48("20895") ? Date.now() + 172800000 : (stryCov_9fa48("20895"), Date.now() - 172800000)),
    status: 'rejected'
  })]);
  const filteredApprovals = (stryMutAct_9fa48("20899") ? filter !== 'all' : stryMutAct_9fa48("20898") ? false : stryMutAct_9fa48("20897") ? true : (stryCov_9fa48("20897", "20898", "20899"), filter === 'all')) ? approvals : stryMutAct_9fa48("20901") ? approvals : (stryCov_9fa48("20901"), approvals.filter(stryMutAct_9fa48("20902") ? () => undefined : (stryCov_9fa48("20902"), a => stryMutAct_9fa48("20905") ? a.status !== filter : stryMutAct_9fa48("20904") ? false : stryMutAct_9fa48("20903") ? true : (stryCov_9fa48("20903", "20904", "20905"), a.status === filter))));
  const typeIcons: Record<string, string> = stryMutAct_9fa48("20906") ? {} : (stryCov_9fa48("20906"), {
    workflow: '🔄',
    access: '🔑',
    budget: '💰',
    vendor: '🏢'
  });
  return <div className="p-6 lg:p-8 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Approvals</h1>
          <p className="text-neutral-500">Review and approve pending requests</p>
        </div>
        <div className="flex items-center gap-4">
          <span className="px-3 py-1 bg-warning-light text-warning-dark text-sm font-medium rounded-full">
            {stryMutAct_9fa48("20911") ? approvals.length : (stryCov_9fa48("20911"), approvals.filter(stryMutAct_9fa48("20912") ? () => undefined : (stryCov_9fa48("20912"), a => stryMutAct_9fa48("20915") ? a.status !== 'pending' : stryMutAct_9fa48("20914") ? false : stryMutAct_9fa48("20913") ? true : (stryCov_9fa48("20913", "20914", "20915"), a.status === 'pending'))).length)} pending
          </span>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-2 mb-6">
        {(['pending', 'approved', 'rejected', 'all'] as const).map(stryMutAct_9fa48("20917") ? () => undefined : (stryCov_9fa48("20917"), f => <button key={f} onClick={stryMutAct_9fa48("20918") ? () => undefined : (stryCov_9fa48("20918"), () => setFilter(f))} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize', (stryMutAct_9fa48("20922") ? filter !== f : stryMutAct_9fa48("20921") ? false : stryMutAct_9fa48("20920") ? true : (stryCov_9fa48("20920", "20921", "20922"), filter === f)) ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100')}>
            {f}
          </button>))}
      </div>

      {/* Approvals List */}
      <div className="space-y-4">
        {filteredApprovals.map(stryMutAct_9fa48("20925") ? () => undefined : (stryCov_9fa48("20925"), approval => <div key={approval.id} className={cn('bg-white rounded-xl border-l-4 p-5', stryMutAct_9fa48("20929") ? approval.priority === 'high' || 'border-l-error-main border border-neutral-200' : stryMutAct_9fa48("20928") ? false : stryMutAct_9fa48("20927") ? true : (stryCov_9fa48("20927", "20928", "20929"), (stryMutAct_9fa48("20931") ? approval.priority !== 'high' : stryMutAct_9fa48("20930") ? true : (stryCov_9fa48("20930", "20931"), approval.priority === 'high')) && 'border-l-error-main border border-neutral-200'), stryMutAct_9fa48("20936") ? approval.priority === 'medium' || 'border-l-warning-main border border-neutral-200' : stryMutAct_9fa48("20935") ? false : stryMutAct_9fa48("20934") ? true : (stryCov_9fa48("20934", "20935", "20936"), (stryMutAct_9fa48("20938") ? approval.priority !== 'medium' : stryMutAct_9fa48("20937") ? true : (stryCov_9fa48("20937", "20938"), approval.priority === 'medium')) && 'border-l-warning-main border border-neutral-200'), stryMutAct_9fa48("20943") ? approval.priority === 'low' || 'border-l-info-main border border-neutral-200' : stryMutAct_9fa48("20942") ? false : stryMutAct_9fa48("20941") ? true : (stryCov_9fa48("20941", "20942", "20943"), (stryMutAct_9fa48("20945") ? approval.priority !== 'low' : stryMutAct_9fa48("20944") ? true : (stryCov_9fa48("20944", "20945"), approval.priority === 'low')) && 'border-l-info-main border border-neutral-200'))}>
            <div className="flex items-start justify-between">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg flex items-center justify-center text-2xl">
                  {typeIcons[approval.type]}
                </div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{approval.title}</h3>
                  <p className="text-neutral-500 mt-1">
                    Requested by {approval.requestor} • {formatRelativeTime(approval.requestedAt)}
                  </p>
                  {stryMutAct_9fa48("20950") ? approval.details || <p className="text-sm text-neutral-400 mt-1">{approval.details}</p> : stryMutAct_9fa48("20949") ? false : stryMutAct_9fa48("20948") ? true : (stryCov_9fa48("20948", "20949", "20950"), approval.details && <p className="text-sm text-neutral-400 mt-1">{approval.details}</p>)}
                </div>
              </div>
              <div className="flex items-center gap-3">
                {(stryMutAct_9fa48("20953") ? approval.status !== 'pending' : stryMutAct_9fa48("20952") ? false : stryMutAct_9fa48("20951") ? true : (stryCov_9fa48("20951", "20952", "20953"), approval.status === 'pending')) ? <>
                    <button className="px-4 py-2 border border-neutral-300 text-neutral-700 rounded-lg hover:bg-neutral-50">
                      Reject
                    </button>
                    <button className="px-4 py-2 bg-success-main text-white rounded-lg hover:bg-success-dark">
                      Approve
                    </button>
                  </> : <span className={cn('px-3 py-1.5 rounded-full text-sm font-medium capitalize', stryMutAct_9fa48("20958") ? approval.status === 'approved' || 'bg-success-light text-success-dark' : stryMutAct_9fa48("20957") ? false : stryMutAct_9fa48("20956") ? true : (stryCov_9fa48("20956", "20957", "20958"), (stryMutAct_9fa48("20960") ? approval.status !== 'approved' : stryMutAct_9fa48("20959") ? true : (stryCov_9fa48("20959", "20960"), approval.status === 'approved')) && 'bg-success-light text-success-dark'), stryMutAct_9fa48("20965") ? approval.status === 'rejected' || 'bg-error-light text-error-dark' : stryMutAct_9fa48("20964") ? false : stryMutAct_9fa48("20963") ? true : (stryCov_9fa48("20963", "20964", "20965"), (stryMutAct_9fa48("20967") ? approval.status !== 'rejected' : stryMutAct_9fa48("20966") ? true : (stryCov_9fa48("20966", "20967"), approval.status === 'rejected')) && 'bg-error-light text-error-dark'))}>
                    {approval.status}
                  </span>}
              </div>
            </div>
          </div>))}
      </div>
    </div>;
};

// =============================================================================
// INTEGRATIONS PAGE
// =============================================================================

interface Integration {
  id: string;
  name: string;
  category: string;
  icon: string;
  status: string;
  lastSync: Date | null;
}
const FALLBACK_INTEGRATIONS: Integration[] = stryMutAct_9fa48("20970") ? [] : (stryCov_9fa48("20970"), [stryMutAct_9fa48("20971") ? {} : (stryCov_9fa48("20971"), {
  id: 'salesforce',
  name: 'Salesforce',
  category: 'CRM',
  icon: '☁️',
  status: 'connected',
  lastSync: new Date(stryMutAct_9fa48("20977") ? Date.now() + 300000 : (stryCov_9fa48("20977"), Date.now() - 300000))
}), stryMutAct_9fa48("20978") ? {} : (stryCov_9fa48("20978"), {
  id: 'hubspot',
  name: 'HubSpot',
  category: 'CRM',
  icon: '🧡',
  status: 'pending',
  lastSync: null
}), stryMutAct_9fa48("20984") ? {} : (stryCov_9fa48("20984"), {
  id: 'snowflake',
  name: 'Snowflake',
  category: 'Database',
  icon: '❄️',
  status: 'connected',
  lastSync: new Date(stryMutAct_9fa48("20990") ? Date.now() + 1800000 : (stryCov_9fa48("20990"), Date.now() - 1800000))
}), stryMutAct_9fa48("20991") ? {} : (stryCov_9fa48("20991"), {
  id: 'bigquery',
  name: 'BigQuery',
  category: 'Analytics',
  icon: '📦',
  status: 'connected',
  lastSync: new Date(stryMutAct_9fa48("20997") ? Date.now() + 3600000 : (stryCov_9fa48("20997"), Date.now() - 3600000))
}), stryMutAct_9fa48("20998") ? {} : (stryCov_9fa48("20998"), {
  id: 'sap',
  name: 'SAP',
  category: 'ERP',
  icon: '📊',
  status: 'syncing',
  lastSync: null
})]);
const getIconForType = (type: string): string => {
  const icons: Record<string, string> = stryMutAct_9fa48("21005") ? {} : (stryCov_9fa48("21005"), {
    SALESFORCE: '☁️',
    HUBSPOT: '🧡',
    POSTGRESQL: '🐘',
    MYSQL: '🐬',
    SNOWFLAKE: '❄️',
    BIGQUERY: '📦',
    SAP: '📊',
    ORACLE: '🔴',
    MONGODB: '🍃',
    REST_API: '🔗',
    GOOGLE_SHEETS: '📋',
    AIRTABLE: '📑'
  });
  return stryMutAct_9fa48("21020") ? icons[type] && '📊' : stryMutAct_9fa48("21019") ? false : stryMutAct_9fa48("21018") ? true : (stryCov_9fa48("21018", "21019", "21020"), icons[type] || '📊');
};
export const BridgeIntegrationsPage: React.FC = () => {
  const categories = stryMutAct_9fa48("21023") ? [] : (stryCov_9fa48("21023"), ['All', 'CRM', 'ERP', 'Database', 'Analytics', 'Spreadsheet']);
  const [activeCategory, setActiveCategory] = useState('All');
  const [integrations, setIntegrations] = useState<Integration[]>(FALLBACK_INTEGRATIONS);
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("21031") ? false : (stryCov_9fa48("21031"), true));
  React.useEffect(() => {
    const fetchDataSources = async () => {
      try {
        const response = await dataSourcesApi.getDataSources();
        if (stryMutAct_9fa48("21037") ? response.success && response.data || Array.isArray(response.data) : stryMutAct_9fa48("21036") ? false : stryMutAct_9fa48("21035") ? true : (stryCov_9fa48("21035", "21036", "21037"), (stryMutAct_9fa48("21039") ? response.success || response.data : stryMutAct_9fa48("21038") ? true : (stryCov_9fa48("21038", "21039"), response.success && response.data)) && Array.isArray(response.data))) {
          const mapped: Integration[] = response.data.map(stryMutAct_9fa48("21041") ? () => undefined : (stryCov_9fa48("21041"), (ds: any) => stryMutAct_9fa48("21042") ? {} : (stryCov_9fa48("21042"), {
            id: ds.id,
            name: ds.name,
            category: stryMutAct_9fa48("21045") ? ds.config?.category && 'Database' : stryMutAct_9fa48("21044") ? false : stryMutAct_9fa48("21043") ? true : (stryCov_9fa48("21043", "21044", "21045"), (stryMutAct_9fa48("21046") ? ds.config.category : (stryCov_9fa48("21046"), ds.config?.category)) || 'Database'),
            icon: getIconForType(ds.type),
            status: stryMutAct_9fa48("21048") ? (ds.status || 'pending').toUpperCase() : (stryCov_9fa48("21048"), (stryMutAct_9fa48("21051") ? ds.status && 'pending' : stryMutAct_9fa48("21050") ? false : stryMutAct_9fa48("21049") ? true : (stryCov_9fa48("21049", "21050", "21051"), ds.status || 'pending')).toLowerCase()),
            lastSync: ds.last_sync_at ? new Date(ds.last_sync_at) : null
          })));
          if (stryMutAct_9fa48("21056") ? mapped.length <= 0 : stryMutAct_9fa48("21055") ? mapped.length >= 0 : stryMutAct_9fa48("21054") ? false : stryMutAct_9fa48("21053") ? true : (stryCov_9fa48("21053", "21054", "21055", "21056"), mapped.length > 0)) setIntegrations(mapped);
        }
      } catch (err) {
        console.log('Using fallback integrations');
      } finally {
        setIsLoading(stryMutAct_9fa48("21060") ? true : (stryCov_9fa48("21060"), false));
      }
    };
    fetchDataSources();
  }, stryMutAct_9fa48("21061") ? ["Stryker was here"] : (stryCov_9fa48("21061"), []));
  const filtered = (stryMutAct_9fa48("21064") ? activeCategory !== 'All' : stryMutAct_9fa48("21063") ? false : stryMutAct_9fa48("21062") ? true : (stryCov_9fa48("21062", "21063", "21064"), activeCategory === 'All')) ? integrations : stryMutAct_9fa48("21066") ? integrations : (stryCov_9fa48("21066"), integrations.filter(stryMutAct_9fa48("21067") ? () => undefined : (stryCov_9fa48("21067"), i => stryMutAct_9fa48("21070") ? i.category !== activeCategory : stryMutAct_9fa48("21069") ? false : stryMutAct_9fa48("21068") ? true : (stryCov_9fa48("21068", "21069", "21070"), i.category === activeCategory))));
  return <div className="p-6 lg:p-8 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900">Integrations</h1>
          <p className="text-neutral-500">Connect your tools and services</p>
        </div>
        <button className="px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          + Request Integration
        </button>
      </div>

      {/* Categories */}
      <div className="flex items-center gap-2 mb-6">
        {categories.map(stryMutAct_9fa48("21071") ? () => undefined : (stryCov_9fa48("21071"), cat => <button key={cat} onClick={stryMutAct_9fa48("21072") ? () => undefined : (stryCov_9fa48("21072"), () => setActiveCategory(cat))} className={cn('px-4 py-2 rounded-lg text-sm font-medium transition-colors', (stryMutAct_9fa48("21076") ? activeCategory !== cat : stryMutAct_9fa48("21075") ? false : stryMutAct_9fa48("21074") ? true : (stryCov_9fa48("21074", "21075", "21076"), activeCategory === cat)) ? 'bg-primary-100 text-primary-700' : 'text-neutral-600 hover:bg-neutral-100')}>
            {cat}
          </button>))}
      </div>

      {/* Integration Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(stryMutAct_9fa48("21079") ? () => undefined : (stryCov_9fa48("21079"), integration => <div key={integration.id} className="bg-white rounded-xl border border-neutral-200 p-5 hover:border-primary-300 hover:shadow-sm transition-all">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="text-3xl">{integration.icon}</div>
                <div>
                  <h3 className="font-semibold text-neutral-900">{integration.name}</h3>
                  <p className="text-sm text-neutral-500">{integration.category}</p>
                </div>
              </div>
              <span className={cn('w-2.5 h-2.5 rounded-full', (stryMutAct_9fa48("21083") ? integration.status !== 'connected' : stryMutAct_9fa48("21082") ? false : stryMutAct_9fa48("21081") ? true : (stryCov_9fa48("21081", "21082", "21083"), integration.status === 'connected')) ? 'bg-success-main' : 'bg-neutral-300')} />
            </div>
            
            <p className="text-sm text-neutral-400 mb-4">
              {(stryMutAct_9fa48("21089") ? integration.status !== 'connected' : stryMutAct_9fa48("21088") ? false : stryMutAct_9fa48("21087") ? true : (stryCov_9fa48("21087", "21088", "21089"), integration.status === 'connected')) ? `Last sync ${formatRelativeTime(integration.lastSync!)}` : 'Not connected'}
            </p>

            <button className={cn('w-full py-2 rounded-lg font-medium text-sm transition-colors', (stryMutAct_9fa48("21096") ? integration.status !== 'connected' : stryMutAct_9fa48("21095") ? false : stryMutAct_9fa48("21094") ? true : (stryCov_9fa48("21094", "21095", "21096"), integration.status === 'connected')) ? 'border border-neutral-300 text-neutral-700 hover:bg-neutral-50' : 'bg-primary-600 text-white hover:bg-primary-700')}>
              {(stryMutAct_9fa48("21102") ? integration.status !== 'connected' : stryMutAct_9fa48("21101") ? false : stryMutAct_9fa48("21100") ? true : (stryCov_9fa48("21100", "21101", "21102"), integration.status === 'connected')) ? 'Configure' : 'Connect'}
            </button>
          </div>))}
      </div>
      
      {/* Page Guide */}
      <PageGuide {...GUIDES.integrations} />
    </div>;
};
export default WorkflowsListPage;