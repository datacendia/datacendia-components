/**
 * Auth API Service
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
import { api, tokenManager } from '../client';
import type { ApiResponse, LoginRequest, LoginResponse, RegisterRequest, User } from '../types';
export const authApi = stryMutAct_9fa48("14343") ? {} : (stryCov_9fa48("14343"), {
  /**
   * Login with email and password
   */
  async login(credentials: LoginRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<LoginResponse>('/auth/login', credentials);
    if (stryMutAct_9fa48("14348") ? response.success || response.data : stryMutAct_9fa48("14347") ? false : stryMutAct_9fa48("14346") ? true : (stryCov_9fa48("14346", "14347", "14348"), response.success && response.data)) {
      tokenManager.setTokens(stryMutAct_9fa48("14350") ? {} : (stryCov_9fa48("14350"), {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn
      }));
    }
    return response;
  },
  /**
   * Register new user and organization
   */
  async register(data: RegisterRequest): Promise<ApiResponse<LoginResponse>> {
    const response = await api.post<LoginResponse>('/auth/register', data);
    if (stryMutAct_9fa48("14355") ? response.success || response.data : stryMutAct_9fa48("14354") ? false : stryMutAct_9fa48("14353") ? true : (stryCov_9fa48("14353", "14354", "14355"), response.success && response.data)) {
      tokenManager.setTokens(stryMutAct_9fa48("14357") ? {} : (stryCov_9fa48("14357"), {
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn
      }));
    }
    return response;
  },
  /**
   * Logout and clear tokens
   */
  async logout(): Promise<void> {
    await api.post('/auth/logout');
    tokenManager.clearTokens();
  },
  /**
   * Get current user
   */
  async getCurrentUser(): Promise<ApiResponse<User>> {
    return api.get<User>('/auth/me');
  },
  /**
   * Refresh access token
   */
  async refreshToken(): Promise<boolean> {
    return tokenManager.refreshAccessToken();
  },
  /**
   * Check if user is authenticated
   */
  isAuthenticated(): boolean {
    return tokenManager.isAuthenticated();
  },
  /**
   * Request password reset
   */
  async requestPasswordReset(email: string): Promise<ApiResponse<{
    message: string;
  }>> {
    return api.post('/auth/forgot-password', stryMutAct_9fa48("14366") ? {} : (stryCov_9fa48("14366"), {
      email
    }));
  },
  /**
   * Reset password with token
   */
  async resetPassword(token: string, password: string): Promise<ApiResponse<{
    message: string;
  }>> {
    return api.post('/auth/reset-password', stryMutAct_9fa48("14369") ? {} : (stryCov_9fa48("14369"), {
      token,
      password
    }));
  }
});