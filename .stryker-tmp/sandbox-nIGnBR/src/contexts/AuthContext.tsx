// @ts-nocheck
// =============================================================================
// DATACENDIA AUTH CONTEXT
// Enterprise-grade authentication state management
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
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { tokenManager, onAuthChange } from '../lib/api/client';
import { authApi } from '../lib/api/services/auth';
import type { User } from '../lib/api/types';
export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isInitialized: boolean;
  error: string | null;
}
export interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  register: (data: RegisterData) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  updateUser: (updates: Partial<User>) => void;
  clearError: () => void;
  hasPermission: (permission: string) => boolean;
  hasRole: (roles: string | string[]) => boolean;
}
export interface RegisterData {
  email: string;
  password: string;
  name: string;
  organizationName?: string;
  inviteCode?: string;
}

// =============================================================================
// CONTEXT
// =============================================================================

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

// =============================================================================
// PROVIDER
// =============================================================================

export function AuthProvider({
  children
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = useState<AuthState>(stryMutAct_9fa48("7202") ? {} : (stryCov_9fa48("7202"), {
    user: null,
    isAuthenticated: stryMutAct_9fa48("7203") ? true : (stryCov_9fa48("7203"), false),
    isLoading: stryMutAct_9fa48("7204") ? false : (stryCov_9fa48("7204"), true),
    isInitialized: stryMutAct_9fa48("7205") ? true : (stryCov_9fa48("7205"), false),
    error: null
  }));

  // Initialize auth state on mount
  useEffect(() => {
    const initAuth = async () => {
      if (stryMutAct_9fa48("7209") ? false : stryMutAct_9fa48("7208") ? true : (stryCov_9fa48("7208", "7209"), tokenManager.isAuthenticated())) {
        try {
          const response = await authApi.getCurrentUser();
          if (stryMutAct_9fa48("7214") ? response.success || response.data : stryMutAct_9fa48("7213") ? false : stryMutAct_9fa48("7212") ? true : (stryCov_9fa48("7212", "7213", "7214"), response.success && response.data)) {
            setState(stryMutAct_9fa48("7216") ? {} : (stryCov_9fa48("7216"), {
              user: response.data as User,
              isAuthenticated: stryMutAct_9fa48("7217") ? false : (stryCov_9fa48("7217"), true),
              isLoading: stryMutAct_9fa48("7218") ? true : (stryCov_9fa48("7218"), false),
              isInitialized: stryMutAct_9fa48("7219") ? false : (stryCov_9fa48("7219"), true),
              error: null
            }));
          } else {
            // Token invalid, clear it
            tokenManager.clearTokens();
            setState(stryMutAct_9fa48("7221") ? {} : (stryCov_9fa48("7221"), {
              user: null,
              isAuthenticated: stryMutAct_9fa48("7222") ? true : (stryCov_9fa48("7222"), false),
              isLoading: stryMutAct_9fa48("7223") ? true : (stryCov_9fa48("7223"), false),
              isInitialized: stryMutAct_9fa48("7224") ? false : (stryCov_9fa48("7224"), true),
              error: null
            }));
          }
        } catch {
          tokenManager.clearTokens();
          setState(stryMutAct_9fa48("7226") ? {} : (stryCov_9fa48("7226"), {
            user: null,
            isAuthenticated: stryMutAct_9fa48("7227") ? true : (stryCov_9fa48("7227"), false),
            isLoading: stryMutAct_9fa48("7228") ? true : (stryCov_9fa48("7228"), false),
            isInitialized: stryMutAct_9fa48("7229") ? false : (stryCov_9fa48("7229"), true),
            error: null
          }));
        }
      } else {
        setState(stryMutAct_9fa48("7231") ? {} : (stryCov_9fa48("7231"), {
          user: null,
          isAuthenticated: stryMutAct_9fa48("7232") ? true : (stryCov_9fa48("7232"), false),
          isLoading: stryMutAct_9fa48("7233") ? true : (stryCov_9fa48("7233"), false),
          isInitialized: stryMutAct_9fa48("7234") ? false : (stryCov_9fa48("7234"), true),
          error: null
        }));
      }
    };
    initAuth();

    // Listen for auth changes (e.g., from other tabs)
    const unsubscribe = onAuthChange(isAuthenticated => {
      if (stryMutAct_9fa48("7238") ? false : stryMutAct_9fa48("7237") ? true : stryMutAct_9fa48("7236") ? isAuthenticated : (stryCov_9fa48("7236", "7237", "7238"), !isAuthenticated)) {
        setState(stryMutAct_9fa48("7240") ? () => undefined : (stryCov_9fa48("7240"), prev => stryMutAct_9fa48("7241") ? {} : (stryCov_9fa48("7241"), {
          ...prev,
          user: null,
          isAuthenticated: stryMutAct_9fa48("7242") ? true : (stryCov_9fa48("7242"), false)
        })));
      }
    });
    return unsubscribe;
  }, stryMutAct_9fa48("7243") ? ["Stryker was here"] : (stryCov_9fa48("7243"), []));

  // Login
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    setState(stryMutAct_9fa48("7245") ? () => undefined : (stryCov_9fa48("7245"), prev => stryMutAct_9fa48("7246") ? {} : (stryCov_9fa48("7246"), {
      ...prev,
      isLoading: stryMutAct_9fa48("7247") ? false : (stryCov_9fa48("7247"), true),
      error: null
    })));
    try {
      const response = await authApi.login(stryMutAct_9fa48("7249") ? {} : (stryCov_9fa48("7249"), {
        email,
        password
      }));
      if (stryMutAct_9fa48("7252") ? response.success || response.data : stryMutAct_9fa48("7251") ? false : stryMutAct_9fa48("7250") ? true : (stryCov_9fa48("7250", "7251", "7252"), response.success && response.data)) {
        // Fetch user details
        const userResponse = await authApi.getCurrentUser();
        if (stryMutAct_9fa48("7256") ? userResponse.success || userResponse.data : stryMutAct_9fa48("7255") ? false : stryMutAct_9fa48("7254") ? true : (stryCov_9fa48("7254", "7255", "7256"), userResponse.success && userResponse.data)) {
          setState(stryMutAct_9fa48("7258") ? {} : (stryCov_9fa48("7258"), {
            user: userResponse.data as User,
            isAuthenticated: stryMutAct_9fa48("7259") ? false : (stryCov_9fa48("7259"), true),
            isLoading: stryMutAct_9fa48("7260") ? true : (stryCov_9fa48("7260"), false),
            isInitialized: stryMutAct_9fa48("7261") ? false : (stryCov_9fa48("7261"), true),
            error: null
          }));
          return stryMutAct_9fa48("7262") ? false : (stryCov_9fa48("7262"), true);
        }
      }
      setState(stryMutAct_9fa48("7263") ? () => undefined : (stryCov_9fa48("7263"), prev => stryMutAct_9fa48("7264") ? {} : (stryCov_9fa48("7264"), {
        ...prev,
        isLoading: stryMutAct_9fa48("7265") ? true : (stryCov_9fa48("7265"), false),
        error: stryMutAct_9fa48("7268") ? response.error?.message && 'Login failed' : stryMutAct_9fa48("7267") ? false : stryMutAct_9fa48("7266") ? true : (stryCov_9fa48("7266", "7267", "7268"), (stryMutAct_9fa48("7269") ? response.error.message : (stryCov_9fa48("7269"), response.error?.message)) || 'Login failed')
      })));
      return stryMutAct_9fa48("7271") ? true : (stryCov_9fa48("7271"), false);
    } catch (error) {
      setState(stryMutAct_9fa48("7273") ? () => undefined : (stryCov_9fa48("7273"), prev => stryMutAct_9fa48("7274") ? {} : (stryCov_9fa48("7274"), {
        ...prev,
        isLoading: stryMutAct_9fa48("7275") ? true : (stryCov_9fa48("7275"), false),
        error: error instanceof Error ? error.message : 'Login failed'
      })));
      return stryMutAct_9fa48("7277") ? true : (stryCov_9fa48("7277"), false);
    }
  }, stryMutAct_9fa48("7278") ? ["Stryker was here"] : (stryCov_9fa48("7278"), []));

  // Register
  const register = useCallback(async (data: RegisterData): Promise<boolean> => {
    setState(stryMutAct_9fa48("7280") ? () => undefined : (stryCov_9fa48("7280"), prev => stryMutAct_9fa48("7281") ? {} : (stryCov_9fa48("7281"), {
      ...prev,
      isLoading: stryMutAct_9fa48("7282") ? false : (stryCov_9fa48("7282"), true),
      error: null
    })));
    try {
      const response = await authApi.register(stryMutAct_9fa48("7284") ? {} : (stryCov_9fa48("7284"), {
        email: data.email,
        password: data.password,
        name: data.name,
        organizationName: data.organizationName
      }));
      if (stryMutAct_9fa48("7287") ? response.success || response.data : stryMutAct_9fa48("7286") ? false : stryMutAct_9fa48("7285") ? true : (stryCov_9fa48("7285", "7286", "7287"), response.success && response.data)) {
        // Fetch user details
        const userResponse = await authApi.getCurrentUser();
        if (stryMutAct_9fa48("7291") ? userResponse.success || userResponse.data : stryMutAct_9fa48("7290") ? false : stryMutAct_9fa48("7289") ? true : (stryCov_9fa48("7289", "7290", "7291"), userResponse.success && userResponse.data)) {
          setState(stryMutAct_9fa48("7293") ? {} : (stryCov_9fa48("7293"), {
            user: userResponse.data as User,
            isAuthenticated: stryMutAct_9fa48("7294") ? false : (stryCov_9fa48("7294"), true),
            isLoading: stryMutAct_9fa48("7295") ? true : (stryCov_9fa48("7295"), false),
            isInitialized: stryMutAct_9fa48("7296") ? false : (stryCov_9fa48("7296"), true),
            error: null
          }));
          return stryMutAct_9fa48("7297") ? false : (stryCov_9fa48("7297"), true);
        }
      }
      setState(stryMutAct_9fa48("7298") ? () => undefined : (stryCov_9fa48("7298"), prev => stryMutAct_9fa48("7299") ? {} : (stryCov_9fa48("7299"), {
        ...prev,
        isLoading: stryMutAct_9fa48("7300") ? true : (stryCov_9fa48("7300"), false),
        error: stryMutAct_9fa48("7303") ? response.error?.message && 'Registration failed' : stryMutAct_9fa48("7302") ? false : stryMutAct_9fa48("7301") ? true : (stryCov_9fa48("7301", "7302", "7303"), (stryMutAct_9fa48("7304") ? response.error.message : (stryCov_9fa48("7304"), response.error?.message)) || 'Registration failed')
      })));
      return stryMutAct_9fa48("7306") ? true : (stryCov_9fa48("7306"), false);
    } catch (error) {
      setState(stryMutAct_9fa48("7308") ? () => undefined : (stryCov_9fa48("7308"), prev => stryMutAct_9fa48("7309") ? {} : (stryCov_9fa48("7309"), {
        ...prev,
        isLoading: stryMutAct_9fa48("7310") ? true : (stryCov_9fa48("7310"), false),
        error: error instanceof Error ? error.message : 'Registration failed'
      })));
      return stryMutAct_9fa48("7312") ? true : (stryCov_9fa48("7312"), false);
    }
  }, stryMutAct_9fa48("7313") ? ["Stryker was here"] : (stryCov_9fa48("7313"), []));

  // Logout
  const logout = useCallback(async () => {
    setState(stryMutAct_9fa48("7315") ? () => undefined : (stryCov_9fa48("7315"), prev => stryMutAct_9fa48("7316") ? {} : (stryCov_9fa48("7316"), {
      ...prev,
      isLoading: stryMutAct_9fa48("7317") ? false : (stryCov_9fa48("7317"), true)
    })));
    try {
      await authApi.logout();
    } catch {
      // Ignore logout errors, clear local state anyway
    }
    setState(stryMutAct_9fa48("7319") ? {} : (stryCov_9fa48("7319"), {
      user: null,
      isAuthenticated: stryMutAct_9fa48("7320") ? true : (stryCov_9fa48("7320"), false),
      isLoading: stryMutAct_9fa48("7321") ? true : (stryCov_9fa48("7321"), false),
      isInitialized: stryMutAct_9fa48("7322") ? false : (stryCov_9fa48("7322"), true),
      error: null
    }));
  }, stryMutAct_9fa48("7323") ? ["Stryker was here"] : (stryCov_9fa48("7323"), []));

  // Refresh user data
  const refreshUser = useCallback(async () => {
    if (stryMutAct_9fa48("7327") ? false : stryMutAct_9fa48("7326") ? true : stryMutAct_9fa48("7325") ? tokenManager.isAuthenticated() : (stryCov_9fa48("7325", "7326", "7327"), !tokenManager.isAuthenticated())) {
      return;
    }
    try {
      const response = await authApi.getCurrentUser();
      if (stryMutAct_9fa48("7332") ? response.success || response.data : stryMutAct_9fa48("7331") ? false : stryMutAct_9fa48("7330") ? true : (stryCov_9fa48("7330", "7331", "7332"), response.success && response.data)) {
        setState(stryMutAct_9fa48("7334") ? () => undefined : (stryCov_9fa48("7334"), prev => stryMutAct_9fa48("7335") ? {} : (stryCov_9fa48("7335"), {
          ...prev,
          user: response.data as User
        })));
      }
    } catch {
      // Silently fail, user data will remain stale
    }
  }, stryMutAct_9fa48("7336") ? ["Stryker was here"] : (stryCov_9fa48("7336"), []));

  // Update user locally (optimistic update)
  const updateUser = useCallback((updates: Partial<User>) => {
    setState(stryMutAct_9fa48("7338") ? () => undefined : (stryCov_9fa48("7338"), prev => stryMutAct_9fa48("7339") ? {} : (stryCov_9fa48("7339"), {
      ...prev,
      user: prev.user ? stryMutAct_9fa48("7340") ? {} : (stryCov_9fa48("7340"), {
        ...prev.user,
        ...updates
      }) : null
    })));
  }, stryMutAct_9fa48("7341") ? ["Stryker was here"] : (stryCov_9fa48("7341"), []));

  // Clear error
  const clearError = useCallback(() => {
    setState(stryMutAct_9fa48("7343") ? () => undefined : (stryCov_9fa48("7343"), prev => stryMutAct_9fa48("7344") ? {} : (stryCov_9fa48("7344"), {
      ...prev,
      error: null
    })));
  }, stryMutAct_9fa48("7345") ? ["Stryker was here"] : (stryCov_9fa48("7345"), []));

  // Permission check - role-based for now
  const hasPermission = useCallback((permission: string): boolean => {
    if (stryMutAct_9fa48("7349") ? false : stryMutAct_9fa48("7348") ? true : stryMutAct_9fa48("7347") ? state.user : (stryCov_9fa48("7347", "7348", "7349"), !state.user)) {
      return stryMutAct_9fa48("7351") ? true : (stryCov_9fa48("7351"), false);
    }
    // Admins and Super Admins have all permissions
    if (stryMutAct_9fa48("7354") ? state.user.role === 'ADMIN' && state.user.role === 'SUPER_ADMIN' : stryMutAct_9fa48("7353") ? false : stryMutAct_9fa48("7352") ? true : (stryCov_9fa48("7352", "7353", "7354"), (stryMutAct_9fa48("7356") ? state.user.role !== 'ADMIN' : stryMutAct_9fa48("7355") ? false : (stryCov_9fa48("7355", "7356"), state.user.role === 'ADMIN')) || (stryMutAct_9fa48("7359") ? state.user.role !== 'SUPER_ADMIN' : stryMutAct_9fa48("7358") ? false : (stryCov_9fa48("7358", "7359"), state.user.role === 'SUPER_ADMIN')))) {
      return stryMutAct_9fa48("7362") ? false : (stryCov_9fa48("7362"), true);
    }
    // Role-based permission mapping
    const rolePermissions: Record<string, string[]> = stryMutAct_9fa48("7363") ? {} : (stryCov_9fa48("7363"), {
      'SUPER_ADMIN': stryMutAct_9fa48("7364") ? [] : (stryCov_9fa48("7364"), ['*']),
      'ADMIN': stryMutAct_9fa48("7366") ? [] : (stryCov_9fa48("7366"), ['*']),
      'ANALYST': stryMutAct_9fa48("7368") ? [] : (stryCov_9fa48("7368"), ['read', 'write', 'analyze', 'council', 'graph', 'pulse', 'lens', 'bridge']),
      'VIEWER': stryMutAct_9fa48("7377") ? [] : (stryCov_9fa48("7377"), ['read', 'council'])
    });
    return stryMutAct_9fa48("7382") ? (rolePermissions[state.user.role]?.includes(permission) || rolePermissions[state.user.role]?.includes('*')) && false : stryMutAct_9fa48("7381") ? false : stryMutAct_9fa48("7380") ? true : (stryCov_9fa48("7380", "7381", "7382"), (stryMutAct_9fa48("7384") ? rolePermissions[state.user.role]?.includes(permission) && rolePermissions[state.user.role]?.includes('*') : stryMutAct_9fa48("7383") ? false : (stryCov_9fa48("7383", "7384"), (stryMutAct_9fa48("7385") ? rolePermissions[state.user.role].includes(permission) : (stryCov_9fa48("7385"), rolePermissions[state.user.role]?.includes(permission))) || (stryMutAct_9fa48("7386") ? rolePermissions[state.user.role].includes('*') : (stryCov_9fa48("7386"), rolePermissions[state.user.role]?.includes('*'))))) || (stryMutAct_9fa48("7388") ? true : (stryCov_9fa48("7388"), false)));
  }, stryMutAct_9fa48("7389") ? [] : (stryCov_9fa48("7389"), [state.user]));

  // Role check
  const hasRole = useCallback((roles: string | string[]): boolean => {
    if (stryMutAct_9fa48("7393") ? false : stryMutAct_9fa48("7392") ? true : stryMutAct_9fa48("7391") ? state.user : (stryCov_9fa48("7391", "7392", "7393"), !state.user)) {
      return stryMutAct_9fa48("7395") ? true : (stryCov_9fa48("7395"), false);
    }
    const roleArray = Array.isArray(roles) ? roles : stryMutAct_9fa48("7396") ? [] : (stryCov_9fa48("7396"), [roles]);
    return roleArray.includes(state.user.role);
  }, stryMutAct_9fa48("7397") ? [] : (stryCov_9fa48("7397"), [state.user]));
  const value: AuthContextValue = stryMutAct_9fa48("7398") ? {} : (stryCov_9fa48("7398"), {
    ...state,
    login,
    register,
    logout,
    refreshUser,
    updateUser,
    clearError,
    hasPermission,
    hasRole
  });
  return <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>;
}

// =============================================================================
// HOOKS
// =============================================================================

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (stryMutAct_9fa48("7402") ? context !== undefined : stryMutAct_9fa48("7401") ? false : stryMutAct_9fa48("7400") ? true : (stryCov_9fa48("7400", "7401", "7402"), context === undefined)) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
export function useUser(): User | null {
  const {
    user
  } = useAuth();
  return user;
}
export function useIsAuthenticated(): boolean {
  const {
    isAuthenticated
  } = useAuth();
  return isAuthenticated;
}
export function usePermissions() {
  const {
    hasPermission,
    hasRole
  } = useAuth();
  return stryMutAct_9fa48("7408") ? {} : (stryCov_9fa48("7408"), {
    hasPermission,
    hasRole
  });
}
export default AuthContext;