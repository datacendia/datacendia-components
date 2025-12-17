/**
 * Council Store - AI Council deliberation state management
 * 
 * Manages deliberation sessions, agent responses, and council queries.
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

export interface Agent {
  id: string;
  code: string;
  name: string;
  role: string;
  description: string;
  avatarUrl?: string;
  isActive: boolean;
}
export interface DeliberationMessage {
  id: string;
  agentId: string;
  agentName: string;
  phase: string;
  content: string;
  confidence?: number;
  sources?: Array<{
    type: string;
    title: string;
    url?: string;
  }>;
  timestamp: Date;
}
export interface Deliberation {
  id: string;
  organizationId: string;
  question: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  currentPhase?: string;
  progress: number;
  messages: DeliberationMessage[];
  decision?: {
    outcome: string;
    confidence: number;
    rationale: string;
    dissents?: Array<{
      agentId: string;
      agentName: string;
      reason: string;
    }>;
  };
  startedAt?: Date;
  completedAt?: Date;
  createdAt: Date;
}
export interface CouncilState {
  // State
  agents: Agent[];
  activeDeliberation: Deliberation | null;
  deliberationHistory: Deliberation[];
  isLoading: boolean;
  isDeliberating: boolean;
  error: string | null;

  // Filters
  selectedAgents: string[];
  deliberationMode: 'consensus' | 'debate' | 'advisory' | 'voting';

  // Actions
  setAgents: (agents: Agent[]) => void;
  selectAgent: (agentId: string) => void;
  deselectAgent: (agentId: string) => void;
  setSelectedAgents: (agentIds: string[]) => void;
  setDeliberationMode: (mode: 'consensus' | 'debate' | 'advisory' | 'voting') => void;
  startDeliberation: (question: string, context?: Record<string, unknown>) => Promise<string | null>;
  cancelDeliberation: (id: string) => void;
  addMessage: (message: DeliberationMessage) => void;
  updateDeliberationStatus: (status: Deliberation['status'], phase?: string, progress?: number) => void;
  setDecision: (decision: Deliberation['decision']) => void;
  loadDeliberation: (id: string) => Promise<void>;
  loadHistory: (limit?: number) => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  reset: () => void;
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = stryMutAct_9fa48("71083") ? import.meta.env.VITE_API_URL && 'http://localhost:3000/api/v1' : stryMutAct_9fa48("71082") ? false : stryMutAct_9fa48("71081") ? true : (stryCov_9fa48("71081", "71082", "71083"), import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');
async function councilApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('datacendia-auth') ? stryMutAct_9fa48("71087") ? JSON.parse(localStorage.getItem('datacendia-auth')!).state.token : (stryCov_9fa48("71087"), JSON.parse(localStorage.getItem('datacendia-auth')!).state?.token) : null;
  const response = await fetch(`${API_BASE}${endpoint}`, stryMutAct_9fa48("71090") ? {} : (stryCov_9fa48("71090"), {
    ...options,
    headers: stryMutAct_9fa48("71091") ? {} : (stryCov_9fa48("71091"), {
      'Content-Type': 'application/json',
      ...(stryMutAct_9fa48("71095") ? token || {
        Authorization: `Bearer ${token}`
      } : stryMutAct_9fa48("71094") ? false : stryMutAct_9fa48("71093") ? true : (stryCov_9fa48("71093", "71094", "71095"), token && (stryMutAct_9fa48("71096") ? {} : (stryCov_9fa48("71096"), {
        Authorization: `Bearer ${token}`
      })))),
      ...options.headers
    })
  }));
  if (stryMutAct_9fa48("71100") ? false : stryMutAct_9fa48("71099") ? true : stryMutAct_9fa48("71098") ? response.ok : (stryCov_9fa48("71098", "71099", "71100"), !response.ok)) {
    const error = await response.json().catch(stryMutAct_9fa48("71102") ? () => undefined : (stryCov_9fa48("71102"), () => stryMutAct_9fa48("71103") ? {} : (stryCov_9fa48("71103"), {
      message: 'Request failed'
    })));
    throw new Error(stryMutAct_9fa48("71107") ? (error.message || error.error?.message) && 'Request failed' : stryMutAct_9fa48("71106") ? false : stryMutAct_9fa48("71105") ? true : (stryCov_9fa48("71105", "71106", "71107"), (stryMutAct_9fa48("71109") ? error.message && error.error?.message : stryMutAct_9fa48("71108") ? false : (stryCov_9fa48("71108", "71109"), error.message || (stryMutAct_9fa48("71110") ? error.error.message : (stryCov_9fa48("71110"), error.error?.message)))) || 'Request failed'));
  }
  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useCouncilStore = create<CouncilState>()(immer(stryMutAct_9fa48("71112") ? () => undefined : (stryCov_9fa48("71112"), (set, get) => stryMutAct_9fa48("71113") ? {} : (stryCov_9fa48("71113"), {
  // Initial State
  agents: stryMutAct_9fa48("71114") ? ["Stryker was here"] : (stryCov_9fa48("71114"), []),
  activeDeliberation: null,
  deliberationHistory: stryMutAct_9fa48("71115") ? ["Stryker was here"] : (stryCov_9fa48("71115"), []),
  isLoading: stryMutAct_9fa48("71116") ? true : (stryCov_9fa48("71116"), false),
  isDeliberating: stryMutAct_9fa48("71117") ? true : (stryCov_9fa48("71117"), false),
  error: null,
  selectedAgents: stryMutAct_9fa48("71118") ? ["Stryker was here"] : (stryCov_9fa48("71118"), []),
  deliberationMode: 'consensus',
  // Agent Actions
  setAgents: stryMutAct_9fa48("71120") ? () => undefined : (stryCov_9fa48("71120"), agents => set(state => {
    state.agents = agents;
  })),
  selectAgent: stryMutAct_9fa48("71122") ? () => undefined : (stryCov_9fa48("71122"), agentId => set(state => {
    if (stryMutAct_9fa48("71126") ? false : stryMutAct_9fa48("71125") ? true : stryMutAct_9fa48("71124") ? state.selectedAgents.includes(agentId) : (stryCov_9fa48("71124", "71125", "71126"), !state.selectedAgents.includes(agentId))) {
      state.selectedAgents.push(agentId);
    }
  })),
  deselectAgent: stryMutAct_9fa48("71128") ? () => undefined : (stryCov_9fa48("71128"), agentId => set(state => {
    state.selectedAgents = stryMutAct_9fa48("71130") ? state.selectedAgents : (stryCov_9fa48("71130"), state.selectedAgents.filter(stryMutAct_9fa48("71131") ? () => undefined : (stryCov_9fa48("71131"), (id: string) => stryMutAct_9fa48("71134") ? id === agentId : stryMutAct_9fa48("71133") ? false : stryMutAct_9fa48("71132") ? true : (stryCov_9fa48("71132", "71133", "71134"), id !== agentId))));
  })),
  setSelectedAgents: stryMutAct_9fa48("71135") ? () => undefined : (stryCov_9fa48("71135"), agentIds => set(state => {
    state.selectedAgents = agentIds;
  })),
  setDeliberationMode: stryMutAct_9fa48("71137") ? () => undefined : (stryCov_9fa48("71137"), mode => set(state => {
    state.deliberationMode = mode;
  })),
  // Deliberation Actions
  startDeliberation: async (question, context) => {
    const {
      selectedAgents,
      deliberationMode
    } = get();
    set(state => {
      state.isLoading = stryMutAct_9fa48("71141") ? false : (stryCov_9fa48("71141"), true);
      state.isDeliberating = stryMutAct_9fa48("71142") ? false : (stryCov_9fa48("71142"), true);
      state.error = null;
    });
    try {
      const response = await councilApi<{
        deliberation: Deliberation;
      }>('/council/deliberations', stryMutAct_9fa48("71145") ? {} : (stryCov_9fa48("71145"), {
        method: 'POST',
        body: JSON.stringify(stryMutAct_9fa48("71147") ? {} : (stryCov_9fa48("71147"), {
          question,
          context,
          config: stryMutAct_9fa48("71148") ? {} : (stryCov_9fa48("71148"), {
            mode: deliberationMode,
            requiredAgents: (stryMutAct_9fa48("71152") ? selectedAgents.length <= 0 : stryMutAct_9fa48("71151") ? selectedAgents.length >= 0 : stryMutAct_9fa48("71150") ? false : stryMutAct_9fa48("71149") ? true : (stryCov_9fa48("71149", "71150", "71151", "71152"), selectedAgents.length > 0)) ? selectedAgents : undefined
          })
        }))
      }));
      set(state => {
        state.activeDeliberation = stryMutAct_9fa48("71154") ? {} : (stryCov_9fa48("71154"), {
          ...response.deliberation,
          messages: stryMutAct_9fa48("71155") ? ["Stryker was here"] : (stryCov_9fa48("71155"), []),
          createdAt: new Date()
        });
        state.isLoading = stryMutAct_9fa48("71156") ? true : (stryCov_9fa48("71156"), false);
      });
      return response.deliberation.id;
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to start deliberation';
        state.isLoading = stryMutAct_9fa48("71160") ? true : (stryCov_9fa48("71160"), false);
        state.isDeliberating = stryMutAct_9fa48("71161") ? true : (stryCov_9fa48("71161"), false);
      });
      return null;
    }
  },
  cancelDeliberation: id => {
    councilApi(`/council/deliberations/${id}/cancel`, stryMutAct_9fa48("71164") ? {} : (stryCov_9fa48("71164"), {
      method: 'POST'
    })).catch(() => {});
    set(state => {
      if (stryMutAct_9fa48("71169") ? state.activeDeliberation?.id !== id : stryMutAct_9fa48("71168") ? false : stryMutAct_9fa48("71167") ? true : (stryCov_9fa48("71167", "71168", "71169"), (stryMutAct_9fa48("71170") ? state.activeDeliberation.id : (stryCov_9fa48("71170"), state.activeDeliberation?.id)) === id)) {
        state.activeDeliberation.status = 'cancelled';
        state.isDeliberating = stryMutAct_9fa48("71173") ? true : (stryCov_9fa48("71173"), false);
      }
    });
  },
  addMessage: stryMutAct_9fa48("71174") ? () => undefined : (stryCov_9fa48("71174"), message => set(state => {
    if (stryMutAct_9fa48("71177") ? false : stryMutAct_9fa48("71176") ? true : (stryCov_9fa48("71176", "71177"), state.activeDeliberation)) {
      state.activeDeliberation.messages.push(message);
    }
  })),
  updateDeliberationStatus: stryMutAct_9fa48("71179") ? () => undefined : (stryCov_9fa48("71179"), (status, phase, progress) => set(state => {
    if (stryMutAct_9fa48("71182") ? false : stryMutAct_9fa48("71181") ? true : (stryCov_9fa48("71181", "71182"), state.activeDeliberation)) {
      state.activeDeliberation.status = status;
      if (stryMutAct_9fa48("71186") ? phase === undefined : stryMutAct_9fa48("71185") ? false : stryMutAct_9fa48("71184") ? true : (stryCov_9fa48("71184", "71185", "71186"), phase !== undefined)) {
        state.activeDeliberation.currentPhase = phase;
      }
      if (stryMutAct_9fa48("71190") ? progress === undefined : stryMutAct_9fa48("71189") ? false : stryMutAct_9fa48("71188") ? true : (stryCov_9fa48("71188", "71189", "71190"), progress !== undefined)) {
        state.activeDeliberation.progress = progress;
      }
      if (stryMutAct_9fa48("71194") ? (status === 'completed' || status === 'failed') && status === 'cancelled' : stryMutAct_9fa48("71193") ? false : stryMutAct_9fa48("71192") ? true : (stryCov_9fa48("71192", "71193", "71194"), (stryMutAct_9fa48("71196") ? status === 'completed' && status === 'failed' : stryMutAct_9fa48("71195") ? false : (stryCov_9fa48("71195", "71196"), (stryMutAct_9fa48("71198") ? status !== 'completed' : stryMutAct_9fa48("71197") ? false : (stryCov_9fa48("71197", "71198"), status === 'completed')) || (stryMutAct_9fa48("71201") ? status !== 'failed' : stryMutAct_9fa48("71200") ? false : (stryCov_9fa48("71200", "71201"), status === 'failed')))) || (stryMutAct_9fa48("71204") ? status !== 'cancelled' : stryMutAct_9fa48("71203") ? false : (stryCov_9fa48("71203", "71204"), status === 'cancelled')))) {
        state.isDeliberating = stryMutAct_9fa48("71207") ? true : (stryCov_9fa48("71207"), false);
        state.activeDeliberation.completedAt = new Date();
      }
    }
  })),
  setDecision: stryMutAct_9fa48("71208") ? () => undefined : (stryCov_9fa48("71208"), decision => set(state => {
    if (stryMutAct_9fa48("71211") ? false : stryMutAct_9fa48("71210") ? true : (stryCov_9fa48("71210", "71211"), state.activeDeliberation)) {
      state.activeDeliberation.decision = decision;
      state.activeDeliberation.status = 'completed';
      state.activeDeliberation.completedAt = new Date();
      state.isDeliberating = stryMutAct_9fa48("71214") ? true : (stryCov_9fa48("71214"), false);
    }
  })),
  loadDeliberation: async id => {
    set(state => {
      state.isLoading = stryMutAct_9fa48("71217") ? false : (stryCov_9fa48("71217"), true);
      state.error = null;
    });
    try {
      const response = await councilApi<{
        deliberation: Deliberation;
      }>(`/council/deliberations/${id}`);
      set(state => {
        state.activeDeliberation = response.deliberation;
        state.isLoading = stryMutAct_9fa48("71221") ? true : (stryCov_9fa48("71221"), false);
        state.isDeliberating = stryMutAct_9fa48("71224") ? response.deliberation.status !== 'in_progress' : stryMutAct_9fa48("71223") ? false : stryMutAct_9fa48("71222") ? true : (stryCov_9fa48("71222", "71223", "71224"), response.deliberation.status === 'in_progress');
      });
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to load deliberation';
        state.isLoading = stryMutAct_9fa48("71229") ? true : (stryCov_9fa48("71229"), false);
      });
    }
  },
  loadHistory: async (limit = 20) => {
    set(state => {
      state.isLoading = stryMutAct_9fa48("71232") ? false : (stryCov_9fa48("71232"), true);
    });
    try {
      const response = await councilApi<{
        deliberations: Deliberation[];
      }>(`/council/deliberations?limit=${limit}`);
      set(state => {
        state.deliberationHistory = response.deliberations;
        state.isLoading = stryMutAct_9fa48("71236") ? true : (stryCov_9fa48("71236"), false);
      });
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Failed to load history';
        state.isLoading = stryMutAct_9fa48("71240") ? true : (stryCov_9fa48("71240"), false);
      });
    }
  },
  // Utility Actions
  setLoading: stryMutAct_9fa48("71241") ? () => undefined : (stryCov_9fa48("71241"), loading => set(state => {
    state.isLoading = loading;
  })),
  setError: stryMutAct_9fa48("71243") ? () => undefined : (stryCov_9fa48("71243"), error => set(state => {
    state.error = error;
  })),
  clearError: stryMutAct_9fa48("71245") ? () => undefined : (stryCov_9fa48("71245"), () => set(state => {
    state.error = null;
  })),
  reset: stryMutAct_9fa48("71247") ? () => undefined : (stryCov_9fa48("71247"), () => set(state => {
    state.activeDeliberation = null;
    state.isDeliberating = stryMutAct_9fa48("71249") ? true : (stryCov_9fa48("71249"), false);
    state.error = null;
    state.selectedAgents = stryMutAct_9fa48("71250") ? ["Stryker was here"] : (stryCov_9fa48("71250"), []);
  }))
}))));

// =============================================================================
// SELECTORS
// =============================================================================

export const selectAgents = stryMutAct_9fa48("71251") ? () => undefined : (stryCov_9fa48("71251"), (() => {
  const selectAgents = (state: CouncilState) => state.agents;
  return selectAgents;
})());
export const selectActiveDeliberation = stryMutAct_9fa48("71252") ? () => undefined : (stryCov_9fa48("71252"), (() => {
  const selectActiveDeliberation = (state: CouncilState) => state.activeDeliberation;
  return selectActiveDeliberation;
})());
export const selectIsDeliberating = stryMutAct_9fa48("71253") ? () => undefined : (stryCov_9fa48("71253"), (() => {
  const selectIsDeliberating = (state: CouncilState) => state.isDeliberating;
  return selectIsDeliberating;
})());
export const selectDeliberationMessages = stryMutAct_9fa48("71254") ? () => undefined : (stryCov_9fa48("71254"), (() => {
  const selectDeliberationMessages = (state: CouncilState) => stryMutAct_9fa48("71255") ? state.activeDeliberation?.messages && [] : (stryCov_9fa48("71255"), (stryMutAct_9fa48("71256") ? state.activeDeliberation.messages : (stryCov_9fa48("71256"), state.activeDeliberation?.messages)) ?? (stryMutAct_9fa48("71257") ? ["Stryker was here"] : (stryCov_9fa48("71257"), [])));
  return selectDeliberationMessages;
})());