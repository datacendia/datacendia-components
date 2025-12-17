/**
 * Auth Store - Zustand-based authentication state management
 * 
 * Replaces AuthContext for better performance and simpler patterns.
 * Provides authentication state, user info, and auth actions.
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
import { persist, createJSONStorage } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

// =============================================================================
// TYPES
// =============================================================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  organizationId: string;
  organizationName?: string;
  avatar?: string;
  permissions?: string[];
  preferences?: UserPreferences;
}
export type UserRole = 'admin' | 'analyst' | 'operator' | 'auditor' | 'council-member' | 'veto-authority' | 'viewer';
export interface UserPreferences {
  language: string;
  theme: 'light' | 'dark' | 'system';
  timezone: string;
  notifications: {
    email: boolean;
    push: boolean;
    inApp: boolean;
  };
}
export interface AuthState {
  // State
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  lastActivity: number | null;

  // Actions
  setUser: (user: User | null) => void;
  setTokens: (token: string, refreshToken?: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  refreshAuth: () => Promise<boolean>;
  updateUser: (updates: Partial<User>) => void;
  updatePreferences: (preferences: Partial<UserPreferences>) => void;
  checkPermission: (permission: string) => boolean;
  touchActivity: () => void;
  clearError: () => void;
}

// =============================================================================
// API HELPERS
// =============================================================================

const API_BASE = stryMutAct_9fa48("70973") ? import.meta.env.VITE_API_URL && 'http://localhost:3000/api/v1' : stryMutAct_9fa48("70972") ? false : stryMutAct_9fa48("70971") ? true : (stryCov_9fa48("70971", "70972", "70973"), import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1');
async function authApi<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${endpoint}`, stryMutAct_9fa48("70977") ? {} : (stryCov_9fa48("70977"), {
    ...options,
    headers: stryMutAct_9fa48("70978") ? {} : (stryCov_9fa48("70978"), {
      'Content-Type': 'application/json',
      ...options.headers
    })
  }));
  if (stryMutAct_9fa48("70982") ? false : stryMutAct_9fa48("70981") ? true : stryMutAct_9fa48("70980") ? response.ok : (stryCov_9fa48("70980", "70981", "70982"), !response.ok)) {
    const error = await response.json().catch(stryMutAct_9fa48("70984") ? () => undefined : (stryCov_9fa48("70984"), () => stryMutAct_9fa48("70985") ? {} : (stryCov_9fa48("70985"), {
      message: 'Request failed'
    })));
    throw new Error(stryMutAct_9fa48("70989") ? error.message && 'Request failed' : stryMutAct_9fa48("70988") ? false : stryMutAct_9fa48("70987") ? true : (stryCov_9fa48("70987", "70988", "70989"), error.message || 'Request failed'));
  }
  return response.json();
}

// =============================================================================
// STORE
// =============================================================================

export const useAuthStore = create<AuthState>()(persist(immer(stryMutAct_9fa48("70991") ? () => undefined : (stryCov_9fa48("70991"), (set, get) => stryMutAct_9fa48("70992") ? {} : (stryCov_9fa48("70992"), {
  // Initial State
  user: null,
  token: null,
  refreshToken: null,
  isAuthenticated: stryMutAct_9fa48("70993") ? true : (stryCov_9fa48("70993"), false),
  isLoading: stryMutAct_9fa48("70994") ? true : (stryCov_9fa48("70994"), false),
  error: null,
  lastActivity: null,
  // Actions
  setUser: stryMutAct_9fa48("70995") ? () => undefined : (stryCov_9fa48("70995"), user => set(state => {
    state.user = user;
    state.isAuthenticated = stryMutAct_9fa48("70997") ? !user : (stryCov_9fa48("70997"), !(stryMutAct_9fa48("70998") ? user : (stryCov_9fa48("70998"), !user)));
  })),
  setTokens: stryMutAct_9fa48("70999") ? () => undefined : (stryCov_9fa48("70999"), (token, refreshToken) => set(state => {
    state.token = token;
    if (stryMutAct_9fa48("71002") ? false : stryMutAct_9fa48("71001") ? true : (stryCov_9fa48("71001", "71002"), refreshToken)) {
      state.refreshToken = refreshToken;
    }
  })),
  setLoading: stryMutAct_9fa48("71004") ? () => undefined : (stryCov_9fa48("71004"), loading => set(state => {
    state.isLoading = loading;
  })),
  setError: stryMutAct_9fa48("71006") ? () => undefined : (stryCov_9fa48("71006"), error => set(state => {
    state.error = error;
  })),
  clearError: stryMutAct_9fa48("71008") ? () => undefined : (stryCov_9fa48("71008"), () => set(state => {
    state.error = null;
  })),
  login: async (email, password) => {
    set(state => {
      state.isLoading = stryMutAct_9fa48("71012") ? false : (stryCov_9fa48("71012"), true);
      state.error = null;
    });
    try {
      const response = await authApi<{
        token: string;
        refreshToken: string;
        user: User;
      }>('/auth/login', stryMutAct_9fa48("71015") ? {} : (stryCov_9fa48("71015"), {
        method: 'POST',
        body: JSON.stringify(stryMutAct_9fa48("71017") ? {} : (stryCov_9fa48("71017"), {
          email,
          password
        }))
      }));
      set(state => {
        state.user = response.user;
        state.token = response.token;
        state.refreshToken = response.refreshToken;
        state.isAuthenticated = stryMutAct_9fa48("71019") ? false : (stryCov_9fa48("71019"), true);
        state.isLoading = stryMutAct_9fa48("71020") ? true : (stryCov_9fa48("71020"), false);
        state.lastActivity = Date.now();
      });
      return stryMutAct_9fa48("71021") ? false : (stryCov_9fa48("71021"), true);
    } catch (error) {
      set(state => {
        state.error = error instanceof Error ? error.message : 'Login failed';
        state.isLoading = stryMutAct_9fa48("71025") ? true : (stryCov_9fa48("71025"), false);
      });
      return stryMutAct_9fa48("71026") ? true : (stryCov_9fa48("71026"), false);
    }
  },
  logout: () => {
    set(state => {
      state.user = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = stryMutAct_9fa48("71029") ? true : (stryCov_9fa48("71029"), false);
      state.error = null;
      state.lastActivity = null;
    });
  },
  refreshAuth: async () => {
    const {
      refreshToken
    } = get();
    if (stryMutAct_9fa48("71033") ? false : stryMutAct_9fa48("71032") ? true : stryMutAct_9fa48("71031") ? refreshToken : (stryCov_9fa48("71031", "71032", "71033"), !refreshToken)) return stryMutAct_9fa48("71034") ? true : (stryCov_9fa48("71034"), false);
    try {
      const response = await authApi<{
        token: string;
        refreshToken: string;
      }>('/auth/refresh', stryMutAct_9fa48("71037") ? {} : (stryCov_9fa48("71037"), {
        method: 'POST',
        body: JSON.stringify(stryMutAct_9fa48("71039") ? {} : (stryCov_9fa48("71039"), {
          refreshToken
        }))
      }));
      set(state => {
        state.token = response.token;
        state.refreshToken = response.refreshToken;
      });
      return stryMutAct_9fa48("71041") ? false : (stryCov_9fa48("71041"), true);
    } catch {
      get().logout();
      return stryMutAct_9fa48("71043") ? true : (stryCov_9fa48("71043"), false);
    }
  },
  updateUser: stryMutAct_9fa48("71044") ? () => undefined : (stryCov_9fa48("71044"), updates => set(state => {
    if (stryMutAct_9fa48("71047") ? false : stryMutAct_9fa48("71046") ? true : (stryCov_9fa48("71046", "71047"), state.user)) {
      Object.assign(state.user, updates);
    }
  })),
  updatePreferences: stryMutAct_9fa48("71049") ? () => undefined : (stryCov_9fa48("71049"), preferences => set(state => {
    if (stryMutAct_9fa48("71052") ? false : stryMutAct_9fa48("71051") ? true : (stryCov_9fa48("71051", "71052"), state.user)) {
      state.user.preferences = {
        ...state.user.preferences,
        ...preferences
      } as UserPreferences;
    }
  })),
  checkPermission: permission => {
    const {
      user
    } = get();
    if (stryMutAct_9fa48("71057") ? false : stryMutAct_9fa48("71056") ? true : stryMutAct_9fa48("71055") ? user : (stryCov_9fa48("71055", "71056", "71057"), !user)) return stryMutAct_9fa48("71058") ? true : (stryCov_9fa48("71058"), false);

    // Admins have all permissions
    if (stryMutAct_9fa48("71061") ? user.role !== 'admin' : stryMutAct_9fa48("71060") ? false : stryMutAct_9fa48("71059") ? true : (stryCov_9fa48("71059", "71060", "71061"), user.role === 'admin')) return stryMutAct_9fa48("71063") ? false : (stryCov_9fa48("71063"), true);

    // Check explicit permissions
    return stryMutAct_9fa48("71064") ? user.permissions?.includes(permission) && false : (stryCov_9fa48("71064"), (stryMutAct_9fa48("71065") ? user.permissions.includes(permission) : (stryCov_9fa48("71065"), user.permissions?.includes(permission))) ?? (stryMutAct_9fa48("71066") ? true : (stryCov_9fa48("71066"), false)));
  },
  touchActivity: stryMutAct_9fa48("71067") ? () => undefined : (stryCov_9fa48("71067"), () => set(state => {
    state.lastActivity = Date.now();
  }))
}))), stryMutAct_9fa48("71069") ? {} : (stryCov_9fa48("71069"), {
  name: 'datacendia-auth',
  storage: createJSONStorage(stryMutAct_9fa48("71071") ? () => undefined : (stryCov_9fa48("71071"), () => localStorage)),
  partialize: stryMutAct_9fa48("71072") ? () => undefined : (stryCov_9fa48("71072"), state => stryMutAct_9fa48("71073") ? {} : (stryCov_9fa48("71073"), {
    token: state.token,
    refreshToken: state.refreshToken,
    user: state.user
  }))
})));

// =============================================================================
// SELECTORS (for optimized re-renders)
// =============================================================================

export const selectUser = stryMutAct_9fa48("71074") ? () => undefined : (stryCov_9fa48("71074"), (() => {
  const selectUser = (state: AuthState) => state.user;
  return selectUser;
})());
export const selectIsAuthenticated = stryMutAct_9fa48("71075") ? () => undefined : (stryCov_9fa48("71075"), (() => {
  const selectIsAuthenticated = (state: AuthState) => state.isAuthenticated;
  return selectIsAuthenticated;
})());
export const selectIsLoading = stryMutAct_9fa48("71076") ? () => undefined : (stryCov_9fa48("71076"), (() => {
  const selectIsLoading = (state: AuthState) => state.isLoading;
  return selectIsLoading;
})());
export const selectUserRole = stryMutAct_9fa48("71077") ? () => undefined : (stryCov_9fa48("71077"), (() => {
  const selectUserRole = (state: AuthState) => stryMutAct_9fa48("71078") ? state.user.role : (stryCov_9fa48("71078"), state.user?.role);
  return selectUserRole;
})());
export const selectOrganizationId = stryMutAct_9fa48("71079") ? () => undefined : (stryCov_9fa48("71079"), (() => {
  const selectOrganizationId = (state: AuthState) => stryMutAct_9fa48("71080") ? state.user.organizationId : (stryCov_9fa48("71080"), state.user?.organizationId);
  return selectOrganizationId;
})());