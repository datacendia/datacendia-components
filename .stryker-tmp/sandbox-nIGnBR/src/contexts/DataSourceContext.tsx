// @ts-nocheck
// =============================================================================
// DATACENDIA - SHARED DATA SOURCE CONTEXT
// Enables all Cortex pages to work from the same data source and flow together
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
import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { api } from '../lib/api';
import { setCurrentDataSourceId } from '../lib/api/client';

// =============================================================================
// TYPES
// =============================================================================

export interface DataSource {
  id: string;
  name: string;
  type: string; // POSTGRESQL, SALESFORCE, SNOWFLAKE, etc.
  status: 'connected' | 'disconnected' | 'syncing' | 'error' | 'pending';
  lastSyncAt?: string;
  recordCount?: number;
  metadata?: Record<string, unknown>;
}
export interface SelectedEntity {
  id: string;
  name: string;
  type: string;
  dataSourceId: string;
  properties?: Record<string, unknown>;
}
export interface CortexWorkflow {
  id: string;
  name: string;
  steps: CortexWorkflowStep[];
  currentStep: number;
  status: 'active' | 'completed' | 'paused';
}
export interface CortexWorkflowStep {
  page: 'graph' | 'council' | 'pulse' | 'lens' | 'bridge';
  action: string;
  completed: boolean;
  result?: unknown;
}
export interface DataSourceContextValue {
  // Data Sources
  dataSources: DataSource[];
  selectedDataSource: DataSource | null;
  selectDataSource: (source: DataSource | null) => void;

  // Selected Entity (from Graph)
  selectedEntity: SelectedEntity | null;
  selectEntity: (entity: SelectedEntity | null) => void;

  // Cross-page workflow
  activeWorkflow: CortexWorkflow | null;
  startWorkflow: (name: string, steps: CortexWorkflowStep[]) => void;
  advanceWorkflow: (result?: unknown) => void;
  cancelWorkflow: () => void;

  // Navigation helpers
  exploreInGraph: (entityId?: string) => void;
  askCouncil: (question?: string, context?: Record<string, unknown>) => void;
  monitorInPulse: (metricId?: string) => void;
  forecastInLens: (metricId?: string, scenarioId?: string) => void;
  automateInBridge: (workflowId?: string) => void;

  // Shared state between pages
  sharedContext: Record<string, unknown>;
  setSharedContext: (key: string, value: unknown) => void;
  clearSharedContext: () => void;

  // Loading state
  isLoading: boolean;
}

// =============================================================================
// CONTEXT
// =============================================================================

const DataSourceContext = createContext<DataSourceContextValue | null>(null);

// =============================================================================
// PROVIDER
// =============================================================================

export const DataSourceProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Data sources state
  const [dataSources, setDataSources] = useState<DataSource[]>(stryMutAct_9fa48("7410") ? ["Stryker was here"] : (stryCov_9fa48("7410"), []));
  const [selectedDataSource, setSelectedDataSource] = useState<DataSource | null>(null);
  const [selectedEntity, setSelectedEntity] = useState<SelectedEntity | null>(null);
  const [activeWorkflow, setActiveWorkflow] = useState<CortexWorkflow | null>(null);
  const [sharedContext, setSharedContextState] = useState<Record<string, unknown>>({});
  const [isLoading, setIsLoading] = useState(stryMutAct_9fa48("7411") ? true : (stryCov_9fa48("7411"), false));

  // Load data sources on mount
  useEffect(() => {
    const loadDataSources = async () => {
      setIsLoading(stryMutAct_9fa48("7414") ? false : (stryCov_9fa48("7414"), true));
      try {
        // Fetch from API via shared client so auth and data-source header are consistent
        const res = await api.get<any[]>('/data-sources');
        if (stryMutAct_9fa48("7419") ? res.success || res.data : stryMutAct_9fa48("7418") ? false : stryMutAct_9fa48("7417") ? true : (stryCov_9fa48("7417", "7418", "7419"), res.success && res.data)) {
          // Map API response to frontend format
          const mapped = res.data.map(stryMutAct_9fa48("7421") ? () => undefined : (stryCov_9fa48("7421"), (ds: any) => stryMutAct_9fa48("7422") ? {} : (stryCov_9fa48("7422"), {
            id: ds.id,
            name: ds.name,
            type: ds.type,
            status: stryMutAct_9fa48("7423") ? ds.status?.toLowerCase() as DataSource['status'] && 'pending' : (stryCov_9fa48("7423"), ds.status?.toLowerCase() as DataSource['status'] ?? 'pending'),
            lastSyncAt: stryMutAct_9fa48("7425") ? ds.lastSyncAt && ds.last_sync_at : (stryCov_9fa48("7425"), ds.lastSyncAt ?? ds.last_sync_at),
            recordCount: stryMutAct_9fa48("7428") ? ds.metadata?.rows && ds.metadata?.records : stryMutAct_9fa48("7427") ? false : stryMutAct_9fa48("7426") ? true : (stryCov_9fa48("7426", "7427", "7428"), (stryMutAct_9fa48("7429") ? ds.metadata.rows : (stryCov_9fa48("7429"), ds.metadata?.rows)) || (stryMutAct_9fa48("7430") ? ds.metadata.records : (stryCov_9fa48("7430"), ds.metadata?.records))),
            metadata: ds.metadata
          })));
          setDataSources(mapped);

          // Auto-select first connected source if none selected
          if (stryMutAct_9fa48("7433") ? false : stryMutAct_9fa48("7432") ? true : stryMutAct_9fa48("7431") ? selectedDataSource : (stryCov_9fa48("7431", "7432", "7433"), !selectedDataSource)) {
            const connected = mapped.find(stryMutAct_9fa48("7435") ? () => undefined : (stryCov_9fa48("7435"), (ds: DataSource) => stryMutAct_9fa48("7438") ? ds.status !== 'connected' : stryMutAct_9fa48("7437") ? false : stryMutAct_9fa48("7436") ? true : (stryCov_9fa48("7436", "7437", "7438"), ds.status === 'connected')));
            if (stryMutAct_9fa48("7441") ? false : stryMutAct_9fa48("7440") ? true : (stryCov_9fa48("7440", "7441"), connected)) {
              setSelectedDataSource(connected);
            }
          }
        }
      } catch (error) {
        // Silently fail if not authenticated - data sources will load after login
        if (stryMutAct_9fa48("7445") ? false : stryMutAct_9fa48("7444") ? true : (stryCov_9fa48("7444", "7445"), localStorage.getItem('accessToken'))) {
          console.error('Failed to load data sources:', error);
        }
      } finally {
        setIsLoading(stryMutAct_9fa48("7450") ? true : (stryCov_9fa48("7450"), false));
      }
    };
    loadDataSources();
  }, stryMutAct_9fa48("7451") ? ["Stryker was here"] : (stryCov_9fa48("7451"), []));

  // Persist selected data source to URL params
  useEffect(() => {
    if (stryMutAct_9fa48("7454") ? false : stryMutAct_9fa48("7453") ? true : (stryCov_9fa48("7453", "7454"), selectedDataSource)) {
      const params = new URLSearchParams(location.search);
      params.set('dataSource', selectedDataSource.id);
      // Only update if different to avoid loops
      if (stryMutAct_9fa48("7459") ? params.get('dataSource') === selectedDataSource.id : stryMutAct_9fa48("7458") ? false : stryMutAct_9fa48("7457") ? true : (stryCov_9fa48("7457", "7458", "7459"), params.get('dataSource') !== selectedDataSource.id)) {
        navigate(stryMutAct_9fa48("7462") ? {} : (stryCov_9fa48("7462"), {
          search: params.toString()
        }), stryMutAct_9fa48("7463") ? {} : (stryCov_9fa48("7463"), {
          replace: stryMutAct_9fa48("7464") ? false : (stryCov_9fa48("7464"), true)
        }));
      }
    }
  }, stryMutAct_9fa48("7465") ? [] : (stryCov_9fa48("7465"), [selectedDataSource, location.pathname]));

  // Restore from URL on mount
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const dsId = params.get('dataSource');
    if (stryMutAct_9fa48("7470") ? dsId && dataSources.length > 0 || !selectedDataSource : stryMutAct_9fa48("7469") ? false : stryMutAct_9fa48("7468") ? true : (stryCov_9fa48("7468", "7469", "7470"), (stryMutAct_9fa48("7472") ? dsId || dataSources.length > 0 : stryMutAct_9fa48("7471") ? true : (stryCov_9fa48("7471", "7472"), dsId && (stryMutAct_9fa48("7475") ? dataSources.length <= 0 : stryMutAct_9fa48("7474") ? dataSources.length >= 0 : stryMutAct_9fa48("7473") ? true : (stryCov_9fa48("7473", "7474", "7475"), dataSources.length > 0)))) && (stryMutAct_9fa48("7476") ? selectedDataSource : (stryCov_9fa48("7476"), !selectedDataSource)))) {
      const source = dataSources.find(stryMutAct_9fa48("7478") ? () => undefined : (stryCov_9fa48("7478"), ds => stryMutAct_9fa48("7481") ? ds.id !== dsId : stryMutAct_9fa48("7480") ? false : stryMutAct_9fa48("7479") ? true : (stryCov_9fa48("7479", "7480", "7481"), ds.id === dsId)));
      if (stryMutAct_9fa48("7483") ? false : stryMutAct_9fa48("7482") ? true : (stryCov_9fa48("7482", "7483"), source)) {
        setSelectedDataSource(source);
      }
    }
  }, stryMutAct_9fa48("7485") ? [] : (stryCov_9fa48("7485"), [dataSources, location.search]));

  // Sync selected data source with API client header helper
  useEffect(() => {
    setCurrentDataSourceId(selectedDataSource ? selectedDataSource.id : null);
  }, stryMutAct_9fa48("7487") ? [] : (stryCov_9fa48("7487"), [selectedDataSource]));

  // Select data source
  const selectDataSource = useCallback((source: DataSource | null) => {
    setSelectedDataSource(source);
    // Clear entity when changing source
    if (stryMutAct_9fa48("7491") ? source?.id === selectedDataSource?.id : stryMutAct_9fa48("7490") ? false : stryMutAct_9fa48("7489") ? true : (stryCov_9fa48("7489", "7490", "7491"), (stryMutAct_9fa48("7492") ? source.id : (stryCov_9fa48("7492"), source?.id)) !== (stryMutAct_9fa48("7493") ? selectedDataSource.id : (stryCov_9fa48("7493"), selectedDataSource?.id)))) {
      setSelectedEntity(null);
    }
  }, stryMutAct_9fa48("7495") ? [] : (stryCov_9fa48("7495"), [selectedDataSource]));

  // Select entity
  const selectEntity = useCallback((entity: SelectedEntity | null) => {
    setSelectedEntity(entity);
    if (stryMutAct_9fa48("7498") ? false : stryMutAct_9fa48("7497") ? true : (stryCov_9fa48("7497", "7498"), entity)) {
      // Auto-select the data source if not already
      const source = dataSources.find(stryMutAct_9fa48("7500") ? () => undefined : (stryCov_9fa48("7500"), ds => stryMutAct_9fa48("7503") ? ds.id !== entity.dataSourceId : stryMutAct_9fa48("7502") ? false : stryMutAct_9fa48("7501") ? true : (stryCov_9fa48("7501", "7502", "7503"), ds.id === entity.dataSourceId)));
      if (stryMutAct_9fa48("7506") ? source || source.id !== selectedDataSource?.id : stryMutAct_9fa48("7505") ? false : stryMutAct_9fa48("7504") ? true : (stryCov_9fa48("7504", "7505", "7506"), source && (stryMutAct_9fa48("7508") ? source.id === selectedDataSource?.id : stryMutAct_9fa48("7507") ? true : (stryCov_9fa48("7507", "7508"), source.id !== (stryMutAct_9fa48("7509") ? selectedDataSource.id : (stryCov_9fa48("7509"), selectedDataSource?.id)))))) {
        setSelectedDataSource(source);
      }
    }
  }, stryMutAct_9fa48("7511") ? [] : (stryCov_9fa48("7511"), [dataSources, selectedDataSource]));

  // Start a cross-page workflow
  const startWorkflow = useCallback((name: string, steps: CortexWorkflowStep[]) => {
    const workflow: CortexWorkflow = stryMutAct_9fa48("7513") ? {} : (stryCov_9fa48("7513"), {
      id: `wf-${Date.now()}`,
      name,
      steps,
      currentStep: 0,
      status: 'active'
    });
    setActiveWorkflow(workflow);

    // Navigate to first step
    if (stryMutAct_9fa48("7519") ? steps.length <= 0 : stryMutAct_9fa48("7518") ? steps.length >= 0 : stryMutAct_9fa48("7517") ? false : stryMutAct_9fa48("7516") ? true : (stryCov_9fa48("7516", "7517", "7518", "7519"), steps.length > 0)) {
      navigate(`/cortex/${steps[0].page}`);
    }
  }, stryMutAct_9fa48("7522") ? [] : (stryCov_9fa48("7522"), [navigate]));

  // Advance workflow to next step
  const advanceWorkflow = useCallback((result?: unknown) => {
    if (stryMutAct_9fa48("7526") ? false : stryMutAct_9fa48("7525") ? true : stryMutAct_9fa48("7524") ? activeWorkflow : (stryCov_9fa48("7524", "7525", "7526"), !activeWorkflow)) {
      return;
    }
    const updatedSteps = stryMutAct_9fa48("7528") ? [] : (stryCov_9fa48("7528"), [...activeWorkflow.steps]);
    updatedSteps[activeWorkflow.currentStep].completed = stryMutAct_9fa48("7529") ? false : (stryCov_9fa48("7529"), true);
    updatedSteps[activeWorkflow.currentStep].result = result;
    const nextStep = stryMutAct_9fa48("7530") ? activeWorkflow.currentStep - 1 : (stryCov_9fa48("7530"), activeWorkflow.currentStep + 1);
    if (stryMutAct_9fa48("7534") ? nextStep < activeWorkflow.steps.length : stryMutAct_9fa48("7533") ? nextStep > activeWorkflow.steps.length : stryMutAct_9fa48("7532") ? false : stryMutAct_9fa48("7531") ? true : (stryCov_9fa48("7531", "7532", "7533", "7534"), nextStep >= activeWorkflow.steps.length)) {
      // Workflow complete
      setActiveWorkflow(stryMutAct_9fa48("7536") ? {} : (stryCov_9fa48("7536"), {
        ...activeWorkflow,
        steps: updatedSteps,
        currentStep: nextStep,
        status: 'completed'
      }));
    } else {
      // Move to next step
      setActiveWorkflow(stryMutAct_9fa48("7539") ? {} : (stryCov_9fa48("7539"), {
        ...activeWorkflow,
        steps: updatedSteps,
        currentStep: nextStep
      }));
      navigate(`/cortex/${activeWorkflow.steps[nextStep].page}`);
    }
  }, stryMutAct_9fa48("7541") ? [] : (stryCov_9fa48("7541"), [activeWorkflow, navigate]));

  // Cancel workflow
  const cancelWorkflow = useCallback(() => {
    setActiveWorkflow(null);
  }, stryMutAct_9fa48("7543") ? ["Stryker was here"] : (stryCov_9fa48("7543"), []));

  // Navigation helpers with context passing
  const exploreInGraph = useCallback((entityId?: string) => {
    if (stryMutAct_9fa48("7546") ? false : stryMutAct_9fa48("7545") ? true : (stryCov_9fa48("7545", "7546"), entityId)) {
      setSharedContextState(stryMutAct_9fa48("7548") ? () => undefined : (stryCov_9fa48("7548"), prev => stryMutAct_9fa48("7549") ? {} : (stryCov_9fa48("7549"), {
        ...prev,
        focusEntityId: entityId
      })));
      navigate(`/cortex/graph/entity/${entityId}`);
    } else {
      navigate('/cortex/graph');
    }
  }, stryMutAct_9fa48("7553") ? [] : (stryCov_9fa48("7553"), [navigate]));
  const askCouncil = useCallback((question?: string, context?: Record<string, unknown>) => {
    const councilContext: Record<string, unknown> = stryMutAct_9fa48("7555") ? {} : (stryCov_9fa48("7555"), {
      ...context,
      dataSource: selectedDataSource,
      entity: selectedEntity
    });
    if (stryMutAct_9fa48("7557") ? false : stryMutAct_9fa48("7556") ? true : (stryCov_9fa48("7556", "7557"), question)) {
      councilContext.prefillQuestion = question;
    }
    setSharedContextState(stryMutAct_9fa48("7559") ? () => undefined : (stryCov_9fa48("7559"), prev => stryMutAct_9fa48("7560") ? {} : (stryCov_9fa48("7560"), {
      ...prev,
      councilContext
    })));
    navigate('/cortex/council');
  }, stryMutAct_9fa48("7562") ? [] : (stryCov_9fa48("7562"), [navigate, selectedDataSource, selectedEntity]));
  const monitorInPulse = useCallback((metricId?: string) => {
    if (stryMutAct_9fa48("7565") ? false : stryMutAct_9fa48("7564") ? true : (stryCov_9fa48("7564", "7565"), metricId)) {
      setSharedContextState(stryMutAct_9fa48("7567") ? () => undefined : (stryCov_9fa48("7567"), prev => stryMutAct_9fa48("7568") ? {} : (stryCov_9fa48("7568"), {
        ...prev,
        focusMetricId: metricId
      })));
    }
    navigate('/cortex/pulse');
  }, stryMutAct_9fa48("7570") ? [] : (stryCov_9fa48("7570"), [navigate]));
  const forecastInLens = useCallback((metricId?: string, scenarioId?: string) => {
    const lensContext: Record<string, unknown> = stryMutAct_9fa48("7572") ? {} : (stryCov_9fa48("7572"), {
      dataSource: selectedDataSource,
      entity: selectedEntity
    });
    if (stryMutAct_9fa48("7574") ? false : stryMutAct_9fa48("7573") ? true : (stryCov_9fa48("7573", "7574"), metricId)) {
      lensContext.targetMetricId = metricId;
    }
    if (stryMutAct_9fa48("7577") ? false : stryMutAct_9fa48("7576") ? true : (stryCov_9fa48("7576", "7577"), scenarioId)) {
      lensContext.scenarioId = scenarioId;
    }
    setSharedContextState(stryMutAct_9fa48("7579") ? () => undefined : (stryCov_9fa48("7579"), prev => stryMutAct_9fa48("7580") ? {} : (stryCov_9fa48("7580"), {
      ...prev,
      lensContext
    })));
    navigate(scenarioId ? `/cortex/lens/scenarios/${scenarioId}` : '/cortex/lens');
  }, stryMutAct_9fa48("7583") ? [] : (stryCov_9fa48("7583"), [navigate, selectedDataSource, selectedEntity]));
  const automateInBridge = useCallback((workflowId?: string) => {
    const bridgeContext: Record<string, unknown> = stryMutAct_9fa48("7585") ? {} : (stryCov_9fa48("7585"), {
      dataSource: selectedDataSource,
      entity: selectedEntity
    });
    setSharedContextState(stryMutAct_9fa48("7586") ? () => undefined : (stryCov_9fa48("7586"), prev => stryMutAct_9fa48("7587") ? {} : (stryCov_9fa48("7587"), {
      ...prev,
      bridgeContext
    })));
    navigate(workflowId ? `/cortex/bridge/workflows/${workflowId}` : '/cortex/bridge');
  }, stryMutAct_9fa48("7590") ? [] : (stryCov_9fa48("7590"), [navigate, selectedDataSource, selectedEntity]));

  // Set shared context value
  const setSharedContext = useCallback((key: string, value: unknown) => {
    setSharedContextState(stryMutAct_9fa48("7592") ? () => undefined : (stryCov_9fa48("7592"), prev => stryMutAct_9fa48("7593") ? {} : (stryCov_9fa48("7593"), {
      ...prev,
      [key]: value
    })));
  }, stryMutAct_9fa48("7594") ? ["Stryker was here"] : (stryCov_9fa48("7594"), []));

  // Clear shared context
  const clearSharedContext = useCallback(() => {
    setSharedContextState({});
  }, stryMutAct_9fa48("7596") ? ["Stryker was here"] : (stryCov_9fa48("7596"), []));
  const value: DataSourceContextValue = stryMutAct_9fa48("7597") ? {} : (stryCov_9fa48("7597"), {
    dataSources,
    selectedDataSource,
    selectDataSource,
    selectedEntity,
    selectEntity,
    activeWorkflow,
    startWorkflow,
    advanceWorkflow,
    cancelWorkflow,
    exploreInGraph,
    askCouncil,
    monitorInPulse,
    forecastInLens,
    automateInBridge,
    sharedContext,
    setSharedContext,
    clearSharedContext,
    isLoading
  });
  return <DataSourceContext.Provider value={value}>
      {children}
    </DataSourceContext.Provider>;
};

// =============================================================================
// HOOKS
// =============================================================================

export function useDataSource() {
  const context = useContext(DataSourceContext);
  if (stryMutAct_9fa48("7601") ? false : stryMutAct_9fa48("7600") ? true : stryMutAct_9fa48("7599") ? context : (stryCov_9fa48("7599", "7600", "7601"), !context)) {
    throw new Error('useDataSource must be used within a DataSourceProvider');
  }
  return context;
}

// Convenience hooks for specific pages
export function useGraphContext() {
  const {
    selectedDataSource,
    selectedEntity,
    selectEntity,
    sharedContext
  } = useDataSource();
  return stryMutAct_9fa48("7605") ? {} : (stryCov_9fa48("7605"), {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    selectEntity,
    focusEntityId: sharedContext.focusEntityId as string | undefined
  });
}
export function useCouncilContext() {
  const {
    selectedDataSource,
    selectedEntity,
    sharedContext,
    askCouncil
  } = useDataSource();
  const councilContext = sharedContext.councilContext as Record<string, unknown> | undefined;
  return stryMutAct_9fa48("7607") ? {} : (stryCov_9fa48("7607"), {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    prefillQuestion: councilContext?.prefillQuestion as string | undefined,
    additionalContext: councilContext,
    askFollowUp: askCouncil
  });
}
export function usePulseContext() {
  const {
    selectedDataSource,
    sharedContext,
    monitorInPulse
  } = useDataSource();
  return stryMutAct_9fa48("7609") ? {} : (stryCov_9fa48("7609"), {
    dataSource: selectedDataSource,
    focusMetricId: sharedContext.focusMetricId as string | undefined,
    drillDown: monitorInPulse
  });
}
export function useLensContext() {
  const {
    selectedDataSource,
    selectedEntity,
    sharedContext,
    forecastInLens
  } = useDataSource();
  const lensContext = sharedContext.lensContext as Record<string, unknown> | undefined;
  return stryMutAct_9fa48("7611") ? {} : (stryCov_9fa48("7611"), {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    targetMetricId: lensContext?.targetMetricId as string | undefined,
    scenarioId: lensContext?.scenarioId as string | undefined,
    createScenario: forecastInLens
  });
}
export function useBridgeContext() {
  const {
    selectedDataSource,
    selectedEntity,
    sharedContext,
    automateInBridge
  } = useDataSource();
  const bridgeContext = sharedContext.bridgeContext as Record<string, unknown> | undefined;
  return stryMutAct_9fa48("7613") ? {} : (stryCov_9fa48("7613"), {
    dataSource: selectedDataSource,
    entity: selectedEntity,
    workflowContext: bridgeContext,
    createWorkflow: automateInBridge
  });
}

// =============================================================================
// WORKFLOW PRESETS
// =============================================================================

export const WORKFLOW_PRESETS = stryMutAct_9fa48("7614") ? {} : (stryCov_9fa48("7614"), {
  // Explore → Ask → Monitor
  dataDiscovery: stryMutAct_9fa48("7615") ? () => undefined : (stryCov_9fa48("7615"), (entityName: string): CortexWorkflowStep[] => stryMutAct_9fa48("7616") ? [] : (stryCov_9fa48("7616"), [stryMutAct_9fa48("7617") ? {} : (stryCov_9fa48("7617"), {
    page: 'graph',
    action: `Explore ${entityName} in The Graph`,
    completed: stryMutAct_9fa48("7620") ? true : (stryCov_9fa48("7620"), false)
  }), stryMutAct_9fa48("7621") ? {} : (stryCov_9fa48("7621"), {
    page: 'council',
    action: 'Ask Council about implications',
    completed: stryMutAct_9fa48("7624") ? true : (stryCov_9fa48("7624"), false)
  }), stryMutAct_9fa48("7625") ? {} : (stryCov_9fa48("7625"), {
    page: 'pulse',
    action: 'Monitor related metrics',
    completed: stryMutAct_9fa48("7628") ? true : (stryCov_9fa48("7628"), false)
  })])),
  // Analyze → Forecast → Automate
  predictiveAction: stryMutAct_9fa48("7629") ? () => undefined : (stryCov_9fa48("7629"), (metricName: string): CortexWorkflowStep[] => stryMutAct_9fa48("7630") ? [] : (stryCov_9fa48("7630"), [stryMutAct_9fa48("7631") ? {} : (stryCov_9fa48("7631"), {
    page: 'pulse',
    action: `Review ${metricName} health`,
    completed: stryMutAct_9fa48("7634") ? true : (stryCov_9fa48("7634"), false)
  }), stryMutAct_9fa48("7635") ? {} : (stryCov_9fa48("7635"), {
    page: 'lens',
    action: 'Create forecast scenario',
    completed: stryMutAct_9fa48("7638") ? true : (stryCov_9fa48("7638"), false)
  }), stryMutAct_9fa48("7639") ? {} : (stryCov_9fa48("7639"), {
    page: 'bridge',
    action: 'Set up automated response',
    completed: stryMutAct_9fa48("7642") ? true : (stryCov_9fa48("7642"), false)
  })])),
  // Full cycle: Explore → Analyze → Consult → Forecast → Automate
  fullAnalysis: stryMutAct_9fa48("7643") ? () => undefined : (stryCov_9fa48("7643"), (entityName: string): CortexWorkflowStep[] => stryMutAct_9fa48("7644") ? [] : (stryCov_9fa48("7644"), [stryMutAct_9fa48("7645") ? {} : (stryCov_9fa48("7645"), {
    page: 'graph',
    action: `Map ${entityName} relationships`,
    completed: stryMutAct_9fa48("7648") ? true : (stryCov_9fa48("7648"), false)
  }), stryMutAct_9fa48("7649") ? {} : (stryCov_9fa48("7649"), {
    page: 'pulse',
    action: 'Check current health',
    completed: stryMutAct_9fa48("7652") ? true : (stryCov_9fa48("7652"), false)
  }), stryMutAct_9fa48("7653") ? {} : (stryCov_9fa48("7653"), {
    page: 'council',
    action: 'Get strategic recommendations',
    completed: stryMutAct_9fa48("7656") ? true : (stryCov_9fa48("7656"), false)
  }), stryMutAct_9fa48("7657") ? {} : (stryCov_9fa48("7657"), {
    page: 'lens',
    action: 'Model future scenarios',
    completed: stryMutAct_9fa48("7660") ? true : (stryCov_9fa48("7660"), false)
  }), stryMutAct_9fa48("7661") ? {} : (stryCov_9fa48("7661"), {
    page: 'bridge',
    action: 'Implement automation',
    completed: stryMutAct_9fa48("7664") ? true : (stryCov_9fa48("7664"), false)
  })]))
});
export default DataSourceContext;