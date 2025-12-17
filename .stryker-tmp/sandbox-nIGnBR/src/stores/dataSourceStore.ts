/**
 * Data Source Store - Data connection state management
 * 
 * Manages data sources, connections, sync status, and schemas.
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
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export type DataSourceType = 'postgresql' | 'mysql' | 'mongodb' | 'snowflake' | 'bigquery' | 'redshift' | 'sqlserver' | 'oracle' | 'csv' | 'api' | 'salesforce' | 'hubspot';
export type DataSourceStatus = 'connected' | 'disconnected' | 'syncing' | 'error' | 'pending';
export interface DataSource {
  id: string;
  name: string;
  type: DataSourceType;
  status: DataSourceStatus;
  lastSyncAt?: Date;
  lastSyncStatus?: string;
  syncSchedule?: string;
  metadata?: {
    tables?: string[];
    rowCounts?: Record<string, number>;
    lastError?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
export interface DataSourceState {
  // State
  dataSources: DataSource[];
  activeDataSource: DataSource | null;
  isLoading: boolean;
  isSyncing: string | null; // ID of currently syncing source
  error: string | null;

  // Schema
  schemas: Record<string, {
    tables: Array<{
      name: string;
      columns: Array<{
        name: string;
        type: string;
        nullable: boolean;
      }>;
      rowCount?: number;
    }>;
  }>;

  // Actions
  setDataSources: (sources: DataSource[]) => void;
  addDataSource: (source: DataSource) => void;
  updateDataSource: (id: string, updates: Partial<DataSource>) => void;
  removeDataSource: (id: string) => void;
  setActiveDataSource: (source: DataSource | null) => void;
  fetchDataSources: () => Promise<void>;
  createDataSource: (config: CreateDataSourceConfig) => Promise<string | null>;
  testConnection: (id: string) => Promise<boolean>;
  syncDataSource: (id: string) => Promise<boolean>;
  deleteDataSource: (id: string) => Promise<boolean>;
  loadSchema: (id: string) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
}
export interface CreateDataSourceConfig {
  name: string;
  type: DataSourceType;
  config: Record<string, unknown>;
  credentials?: Record<string, string>;
  syncSchedule?: string;
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = stryMutAct_9fa48("71260") ? import.meta.env.VITE_API_URL && 'http://localhost:3000/api/v1' : stryMutAct_9fa48("71259") ? false : stryMutAct_9fa48("71258") ? true : (stryCov_9fa48("71258", "71259", "71260"), import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');
async function dataSourceApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('datacendia-auth') ? stryMutAct_9fa48("71264") ? JSON.parse(localStorage.getItem('datacendia-auth')!).state.token : (stryCov_9fa48("71264"), JSON.parse(localStorage.getItem('datacendia-auth')!).state?.token) : null;
  const response = await fetch(`${API_BASE}${endpoint}`, stryMutAct_9fa48("71267") ? {} : (stryCov_9fa48("71267"), {
    ...options,
    headers: stryMutAct_9fa48("71268") ? {} : (stryCov_9fa48("71268"), {
      'Content-Type': 'application/json',
      ...(stryMutAct_9fa48("71272") ? token || {
        Authorization: `Bearer ${token}`
      } : stryMutAct_9fa48("71271") ? false : stryMutAct_9fa48("71270") ? true : (stryCov_9fa48("71270", "71271", "71272"), token && (stryMutAct_9fa48("71273") ? {} : (stryCov_9fa48("71273"), {
        Authorization: `Bearer ${token}`
      })))),
      ...options.headers
    })
  }));
  if (stryMutAct_9fa48("71277") ? false : stryMutAct_9fa48("71276") ? true : stryMutAct_9fa48("71275") ? response.ok : (stryCov_9fa48("71275", "71276", "71277"), !response.ok)) {
    const error = await response.json().catch(stryMutAct_9fa48("71279") ? () => undefined : (stryCov_9fa48("71279"), () => stryMutAct_9fa48("71280") ? {} : (stryCov_9fa48("71280"), {
      message: 'Request failed'
    })));
    throw new Error(stryMutAct_9fa48("71284") ? (error.message || error.error?.message) && 'Request failed' : stryMutAct_9fa48("71283") ? false : stryMutAct_9fa48("71282") ? true : (stryCov_9fa48("71282", "71283", "71284"), (stryMutAct_9fa48("71286") ? error.message && error.error?.message : stryMutAct_9fa48("71285") ? false : (stryCov_9fa48("71285", "71286"), error.message || (stryMutAct_9fa48("71287") ? error.error.message : (stryCov_9fa48("71287"), error.error?.message)))) || 'Request failed'));
  }
  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useDataSourceStore = create<DataSourceState>()(immer(stryMutAct_9fa48("71289") ? () => undefined : (stryCov_9fa48("71289"), (set, get) => stryMutAct_9fa48("71290") ? {} : (stryCov_9fa48("71290"), {
  // Initial State
  dataSources: stryMutAct_9fa48("71291") ? ["Stryker was here"] : (stryCov_9fa48("71291"), []),
  activeDataSource: null,
  isLoading: stryMutAct_9fa48("71292") ? true : (stryCov_9fa48("71292"), false),
  isSyncing: null,
  error: null,
  schemas: {},
  // Basic Actions
  setDataSources: stryMutAct_9fa48("71293") ? () => undefined : (stryCov_9fa48("71293"), sources => set(state => {
    state.dataSources = sources;
  })),
  addDataSource: stryMutAct_9fa48("71295") ? () => undefined : (stryCov_9fa48("71295"), source => set(state => {
    state.dataSources.push(source);
  })),
  updateDataSource: stryMutAct_9fa48("71297") ? () => undefined : (stryCov_9fa48("71297"), (id, updates) => set(state => {
    const index = state.dataSources.findIndex(stryMutAct_9fa48("71299") ? () => undefined : (stryCov_9fa48("71299"), (s: DataSource) => stryMutAct_9fa48("71302") ? s.id !== id : stryMutAct_9fa48("71301") ? false : stryMutAct_9fa48("71300") ? true : (stryCov_9fa48("71300", "71301", "71302"), s.id === id)));
    if (stryMutAct_9fa48("71305") ? index === -1 : stryMutAct_9fa48("71304") ? false : stryMutAct_9fa48("71303") ? true : (stryCov_9fa48("71303", "71304", "71305"), index !== (stryMutAct_9fa48("71306") ? +1 : (stryCov_9fa48("71306"), -1)))) {
      Object.assign(state.dataSources[index], updates);
    }
    if (stryMutAct_9fa48("71310") ? state.activeDataSource?.id !== id : stryMutAct_9fa48("71309") ? false : stryMutAct_9fa48("71308") ? true : (stryCov_9fa48("71308", "71309", "71310"), (stryMutAct_9fa48("71311") ? state.activeDataSource.id : (stryCov_9fa48("71311"), state.activeDataSource?.id)) === id)) {
      Object.assign(state.activeDataSource, updates);
    }
  })),
  removeDataSource: stryMutAct_9fa48("71313") ? () => undefined : (stryCov_9fa48("71313"), id => set(state => {
    state.dataSources = stryMutAct_9fa48("71315") ? state.dataSources : (stryCov_9fa48("71315"), state.dataSources.filter(stryMutAct_9fa48("71316") ? () => undefined : (stryCov_9fa48("71316"), (s: DataSource) => stryMutAct_9fa48("71319") ? s.id === id : stryMutAct_9fa48("71318") ? false : stryMutAct_9fa48("71317") ? true : (stryCov_9fa48("71317", "71318", "71319"), s.id !== id))));
    if (stryMutAct_9fa48("71322") ? state.activeDataSource?.id !== id : stryMutAct_9fa48("71321") ? false : stryMutAct_9fa48("71320") ? true : (stryCov_9fa48("71320", "71321", "71322"), (stryMutAct_9fa48("71323") ? state.activeDataSource.id : (stryCov_9fa48("71323"), state.activeDataSource?.id)) === id)) {
      state.activeDataSource = null;
    }
  })),
  setActiveDataSource: stryMutAct_9fa48("71325") ? () => undefined : (stryCov_9fa48("71325"), source => set(state => {
    state.activeDataSource = source;
  })),
  // API Actions
  fetchDataSources: async () => {
    set(state => {
      state.isLoading = stryMutAct_9fa48("71329") ? false : (stryCov_9fa48("71329"), true);
      state.error = null;
    });
    try {
      const response = await dataSourceApi<{
        dataSources: DataSource[];
      }>('/data-sources');
      set(state => {
        state.dataSources = response.dataSources;
        state.isLoading = stryMutAct_9fa48("71333") ? true : (stryCov_9fa48("71333"), false);
      });
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to fetch data sources';
        state.isLoading = stryMutAct_9fa48("71337") ? true : (stryCov_9fa48("71337"), false);
      });
    }
  },
  createDataSource: async config => {
    set(state => {
      state.isLoading = stryMutAct_9fa48("71340") ? false : (stryCov_9fa48("71340"), true);
      state.error = null;
    });
    try {
      const response = await dataSourceApi<{
        dataSource: DataSource;
      }>('/data-sources', stryMutAct_9fa48("71343") ? {} : (stryCov_9fa48("71343"), {
        method: 'POST',
        body: JSON.stringify(config)
      }));
      set(state => {
        state.dataSources.push(response.dataSource);
        state.isLoading = stryMutAct_9fa48("71346") ? true : (stryCov_9fa48("71346"), false);
      });
      return response.dataSource.id;
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to create data source';
        state.isLoading = stryMutAct_9fa48("71350") ? true : (stryCov_9fa48("71350"), false);
      });
      return null;
    }
  },
  testConnection: async id => {
    try {
      await dataSourceApi(`/data-sources/${id}/test`, stryMutAct_9fa48("71354") ? {} : (stryCov_9fa48("71354"), {
        method: 'POST'
      }));
      return stryMutAct_9fa48("71356") ? false : (stryCov_9fa48("71356"), true);
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Connection test failed';
      });
      return stryMutAct_9fa48("71360") ? true : (stryCov_9fa48("71360"), false);
    }
  },
  syncDataSource: async id => {
    set(state => {
      state.isSyncing = id;
    });
    try {
      await dataSourceApi(`/data-sources/${id}/sync`, stryMutAct_9fa48("71365") ? {} : (stryCov_9fa48("71365"), {
        method: 'POST'
      }));
      set(state => {
        state.isSyncing = null;
        const source = state.dataSources.find(stryMutAct_9fa48("71368") ? () => undefined : (stryCov_9fa48("71368"), (s: DataSource) => stryMutAct_9fa48("71371") ? s.id !== id : stryMutAct_9fa48("71370") ? false : stryMutAct_9fa48("71369") ? true : (stryCov_9fa48("71369", "71370", "71371"), s.id === id)));
        if (stryMutAct_9fa48("71373") ? false : stryMutAct_9fa48("71372") ? true : (stryCov_9fa48("71372", "71373"), source)) {
          source.lastSyncAt = new Date();
          source.lastSyncStatus = 'success';
        }
      });
      return stryMutAct_9fa48("71376") ? false : (stryCov_9fa48("71376"), true);
    } catch (error) {
      set(state => {
        state.isSyncing = null;
        state.error = error instanceof Error ? error.message : 'Sync failed';
        const source = state.dataSources.find(stryMutAct_9fa48("71380") ? () => undefined : (stryCov_9fa48("71380"), (s: DataSource) => stryMutAct_9fa48("71383") ? s.id !== id : stryMutAct_9fa48("71382") ? false : stryMutAct_9fa48("71381") ? true : (stryCov_9fa48("71381", "71382", "71383"), s.id === id)));
        if (stryMutAct_9fa48("71385") ? false : stryMutAct_9fa48("71384") ? true : (stryCov_9fa48("71384", "71385"), source)) {
          source.lastSyncStatus = 'error';
        }
      });
      return stryMutAct_9fa48("71388") ? true : (stryCov_9fa48("71388"), false);
    }
  },
  deleteDataSource: async id => {
    try {
      await dataSourceApi(`/data-sources/${id}`, stryMutAct_9fa48("71392") ? {} : (stryCov_9fa48("71392"), {
        method: 'DELETE'
      }));
      get().removeDataSource(id);
      return stryMutAct_9fa48("71394") ? false : (stryCov_9fa48("71394"), true);
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to delete data source';
      });
      return stryMutAct_9fa48("71398") ? true : (stryCov_9fa48("71398"), false);
    }
  },
  loadSchema: async id => {
    try {
      const response = await dataSourceApi<{
        schema: DataSourceState['schemas'][string];
      }>(`/data-sources/${id}/schema`);
      set(state => {
        state.schemas[id] = response.schema;
      });
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to load schema';
      });
    }
  },
  // Utility Actions
  setLoading: stryMutAct_9fa48("71406") ? () => undefined : (stryCov_9fa48("71406"), loading => set(state => {
    state.isLoading = loading;
  })),
  setError: stryMutAct_9fa48("71408") ? () => undefined : (stryCov_9fa48("71408"), error => set(state => {
    state.error = error;
  })),
  clearError: stryMutAct_9fa48("71410") ? () => undefined : (stryCov_9fa48("71410"), () => set(state => {
    state.error = null;
  }))
}))));

// =============================================================================
// SELECTORS
// =============================================================================

export const selectDataSources = stryMutAct_9fa48("71412") ? () => undefined : (stryCov_9fa48("71412"), (() => {
  const selectDataSources = (state: DataSourceState) => state.dataSources;
  return selectDataSources;
})());
export const selectActiveDataSource = stryMutAct_9fa48("71413") ? () => undefined : (stryCov_9fa48("71413"), (() => {
  const selectActiveDataSource = (state: DataSourceState) => state.activeDataSource;
  return selectActiveDataSource;
})());
export const selectIsLoading = stryMutAct_9fa48("71414") ? () => undefined : (stryCov_9fa48("71414"), (() => {
  const selectIsLoading = (state: DataSourceState) => state.isLoading;
  return selectIsLoading;
})());
export const selectConnectedSources = stryMutAct_9fa48("71415") ? () => undefined : (stryCov_9fa48("71415"), (() => {
  const selectConnectedSources = (state: DataSourceState) => stryMutAct_9fa48("71416") ? state.dataSources : (stryCov_9fa48("71416"), state.dataSources.filter(stryMutAct_9fa48("71417") ? () => undefined : (stryCov_9fa48("71417"), s => stryMutAct_9fa48("71420") ? s.status !== 'connected' : stryMutAct_9fa48("71419") ? false : stryMutAct_9fa48("71418") ? true : (stryCov_9fa48("71418", "71419", "71420"), s.status === 'connected'))));
  return selectConnectedSources;
})());