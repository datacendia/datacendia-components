/**
 * Datacendia API Client
 * Production-grade API client with authentication, error handling, and type safety
 */
// @ts-nocheck


// In development, use relative path to go through Vite's proxy
// In production, use the full URL from environment
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
const API_BASE_URL = stryMutAct_9fa48("13859") ? import.meta.env.VITE_API_URL && (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1') : stryMutAct_9fa48("13858") ? false : stryMutAct_9fa48("13857") ? true : (stryCov_9fa48("13857", "13858", "13859"), import.meta.env.VITE_API_URL || (import.meta.env.DEV ? '/api/v1' : 'http://localhost:3001/api/v1'));

// Header used to propagate the currently selected data source
const DATA_SOURCE_HEADER = 'X-Data-Source-Id';

// Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, unknown>;
  };
  meta?: {
    page?: number;
    pageSize?: number;
    total?: number;
    totalPages?: number;
  };
}
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  organizationId: string;
  avatarUrl?: string;
  preferences?: Record<string, unknown>;
}

// Token storage
class TokenManager {
  private accessToken: string | null = null;
  private refreshToken: string | null = null;
  private refreshPromise: Promise<boolean> | null = null;
  constructor() {
    this.loadFromStorage();
  }
  private loadFromStorage(): void {
    if (stryMutAct_9fa48("13867") ? typeof window === 'undefined' : stryMutAct_9fa48("13866") ? false : stryMutAct_9fa48("13865") ? true : (stryCov_9fa48("13865", "13866", "13867"), typeof window !== 'undefined')) {
      this.accessToken = localStorage.getItem('dc_access_token');
      this.refreshToken = localStorage.getItem('dc_refresh_token');
    }
  }
  setTokens(tokens: AuthTokens): void {
    this.accessToken = tokens.accessToken;
    this.refreshToken = tokens.refreshToken;
    if (stryMutAct_9fa48("13875") ? typeof window === 'undefined' : stryMutAct_9fa48("13874") ? false : stryMutAct_9fa48("13873") ? true : (stryCov_9fa48("13873", "13874", "13875"), typeof window !== 'undefined')) {
      localStorage.setItem('dc_access_token', tokens.accessToken);
      localStorage.setItem('dc_refresh_token', tokens.refreshToken);
    }
  }
  getAccessToken(): string | null {
    return this.accessToken;
  }
  getRefreshToken(): string | null {
    return this.refreshToken;
  }
  clearTokens(): void {
    this.accessToken = null;
    this.refreshToken = null;
    if (stryMutAct_9fa48("13885") ? typeof window === 'undefined' : stryMutAct_9fa48("13884") ? false : stryMutAct_9fa48("13883") ? true : (stryCov_9fa48("13883", "13884", "13885"), typeof window !== 'undefined')) {
      localStorage.removeItem('dc_access_token');
      localStorage.removeItem('dc_refresh_token');
    }
  }
  isAuthenticated(): boolean {
    return stryMutAct_9fa48("13891") ? !this.accessToken : (stryCov_9fa48("13891"), !(stryMutAct_9fa48("13892") ? this.accessToken : (stryCov_9fa48("13892"), !this.accessToken)));
  }
  async refreshAccessToken(): Promise<boolean> {
    // Prevent multiple simultaneous refresh attempts
    if (stryMutAct_9fa48("13895") ? false : stryMutAct_9fa48("13894") ? true : (stryCov_9fa48("13894", "13895"), this.refreshPromise)) {
      return this.refreshPromise;
    }
    this.refreshPromise = this._doRefresh();
    const result = await this.refreshPromise;
    this.refreshPromise = null;
    return result;
  }
  private async _doRefresh(): Promise<boolean> {
    if (stryMutAct_9fa48("13900") ? false : stryMutAct_9fa48("13899") ? true : stryMutAct_9fa48("13898") ? this.refreshToken : (stryCov_9fa48("13898", "13899", "13900"), !this.refreshToken)) {
      return stryMutAct_9fa48("13902") ? true : (stryCov_9fa48("13902"), false);
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/refresh`, stryMutAct_9fa48("13905") ? {} : (stryCov_9fa48("13905"), {
        method: 'POST',
        headers: stryMutAct_9fa48("13907") ? {} : (stryCov_9fa48("13907"), {
          'Content-Type': 'application/json'
        }),
        body: JSON.stringify(stryMutAct_9fa48("13909") ? {} : (stryCov_9fa48("13909"), {
          refreshToken: this.refreshToken
        }))
      }));
      if (stryMutAct_9fa48("13912") ? false : stryMutAct_9fa48("13911") ? true : stryMutAct_9fa48("13910") ? response.ok : (stryCov_9fa48("13910", "13911", "13912"), !response.ok)) {
        this.clearTokens();
        return stryMutAct_9fa48("13914") ? true : (stryCov_9fa48("13914"), false);
      }
      const data: ApiResponse<AuthTokens> = await response.json();
      if (stryMutAct_9fa48("13917") ? data.success || data.data : stryMutAct_9fa48("13916") ? false : stryMutAct_9fa48("13915") ? true : (stryCov_9fa48("13915", "13916", "13917"), data.success && data.data)) {
        this.setTokens(data.data);
        return stryMutAct_9fa48("13919") ? false : (stryCov_9fa48("13919"), true);
      }
      this.clearTokens();
      return stryMutAct_9fa48("13920") ? true : (stryCov_9fa48("13920"), false);
    } catch {
      this.clearTokens();
      return stryMutAct_9fa48("13922") ? true : (stryCov_9fa48("13922"), false);
    }
  }
}
export const tokenManager = new TokenManager();

// Selected data source tracking
let currentDataSourceId: string | null = null;
export function setCurrentDataSourceId(id: string | null): void {
  currentDataSourceId = id;
  if (stryMutAct_9fa48("13926") ? typeof window === 'undefined' : stryMutAct_9fa48("13925") ? false : stryMutAct_9fa48("13924") ? true : (stryCov_9fa48("13924", "13925", "13926"), typeof window !== 'undefined')) {
    if (stryMutAct_9fa48("13930") ? false : stryMutAct_9fa48("13929") ? true : (stryCov_9fa48("13929", "13930"), id)) {
      localStorage.setItem('dc_selected_data_source_id', id);
    } else {
      localStorage.removeItem('dc_selected_data_source_id');
    }
  }
}
function getCurrentDataSourceId(): string | null {
  if (stryMutAct_9fa48("13938") ? currentDataSourceId === null : stryMutAct_9fa48("13937") ? false : stryMutAct_9fa48("13936") ? true : (stryCov_9fa48("13936", "13937", "13938"), currentDataSourceId !== null)) {
    return currentDataSourceId;
  }
  if (stryMutAct_9fa48("13942") ? typeof window === 'undefined' : stryMutAct_9fa48("13941") ? false : stryMutAct_9fa48("13940") ? true : (stryCov_9fa48("13940", "13941", "13942"), typeof window !== 'undefined')) {
    const stored = localStorage.getItem('dc_selected_data_source_id');
    currentDataSourceId = stored;
    return stored;
  }
  return null;
}

// API Client
class ApiClient {
  private baseUrl: string;
  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<ApiResponse<T>> {
    const url = `${this.baseUrl}${endpoint}`;
    const headers: Record<string, string> = stryMutAct_9fa48("13949") ? {} : (stryCov_9fa48("13949"), {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>)
    });
    const accessToken = tokenManager.getAccessToken();
    if (stryMutAct_9fa48("13952") ? false : stryMutAct_9fa48("13951") ? true : (stryCov_9fa48("13951", "13952"), accessToken)) {
      headers['Authorization'] = `Bearer ${accessToken}`;
    }
    const dataSourceId = getCurrentDataSourceId();
    if (stryMutAct_9fa48("13958") ? dataSourceId || !headers[DATA_SOURCE_HEADER] : stryMutAct_9fa48("13957") ? false : stryMutAct_9fa48("13956") ? true : (stryCov_9fa48("13956", "13957", "13958"), dataSourceId && (stryMutAct_9fa48("13959") ? headers[DATA_SOURCE_HEADER] : (stryCov_9fa48("13959"), !headers[DATA_SOURCE_HEADER])))) {
      headers[DATA_SOURCE_HEADER] = dataSourceId;
    }
    try {
      let response = await fetch(url, stryMutAct_9fa48("13962") ? {} : (stryCov_9fa48("13962"), {
        ...options,
        headers
      }));

      // Handle token expiration
      if (stryMutAct_9fa48("13965") ? response.status === 401 || accessToken : stryMutAct_9fa48("13964") ? false : stryMutAct_9fa48("13963") ? true : (stryCov_9fa48("13963", "13964", "13965"), (stryMutAct_9fa48("13967") ? response.status !== 401 : stryMutAct_9fa48("13966") ? true : (stryCov_9fa48("13966", "13967"), response.status === 401)) && accessToken)) {
        const refreshed = await tokenManager.refreshAccessToken();
        if (stryMutAct_9fa48("13970") ? false : stryMutAct_9fa48("13969") ? true : (stryCov_9fa48("13969", "13970"), refreshed)) {
          headers['Authorization'] = `Bearer ${tokenManager.getAccessToken()}`;
          response = await fetch(url, stryMutAct_9fa48("13974") ? {} : (stryCov_9fa48("13974"), {
            ...options,
            headers
          }));
        } else {
          // Redirect to login
          window.location.href = '/login';
          return stryMutAct_9fa48("13977") ? {} : (stryCov_9fa48("13977"), {
            success: stryMutAct_9fa48("13978") ? true : (stryCov_9fa48("13978"), false),
            error: stryMutAct_9fa48("13979") ? {} : (stryCov_9fa48("13979"), {
              code: 'AUTH_EXPIRED',
              message: 'Session expired'
            })
          });
        }
      }
      const data: ApiResponse<T> = await response.json();
      if (stryMutAct_9fa48("13984") ? !response.ok || !data.error : stryMutAct_9fa48("13983") ? false : stryMutAct_9fa48("13982") ? true : (stryCov_9fa48("13982", "13983", "13984"), (stryMutAct_9fa48("13985") ? response.ok : (stryCov_9fa48("13985"), !response.ok)) && (stryMutAct_9fa48("13986") ? data.error : (stryCov_9fa48("13986"), !data.error)))) {
        data.success = stryMutAct_9fa48("13988") ? true : (stryCov_9fa48("13988"), false);
        data.error = stryMutAct_9fa48("13989") ? {} : (stryCov_9fa48("13989"), {
          code: 'HTTP_ERROR',
          message: `HTTP ${response.status}: ${response.statusText}`
        });
      }
      return data;
    } catch (error) {
      return stryMutAct_9fa48("13993") ? {} : (stryCov_9fa48("13993"), {
        success: stryMutAct_9fa48("13994") ? true : (stryCov_9fa48("13994"), false),
        error: stryMutAct_9fa48("13995") ? {} : (stryCov_9fa48("13995"), {
          code: 'NETWORK_ERROR',
          message: error instanceof Error ? error.message : 'Network error'
        })
      });
    }
  }

  // HTTP methods
  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<ApiResponse<T>> {
    let url = endpoint;
    if (stryMutAct_9fa48("14000") ? false : stryMutAct_9fa48("13999") ? true : (stryCov_9fa48("13999", "14000"), params)) {
      const searchParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (stryMutAct_9fa48("14005") ? value !== undefined || value !== null : stryMutAct_9fa48("14004") ? false : stryMutAct_9fa48("14003") ? true : (stryCov_9fa48("14003", "14004", "14005"), (stryMutAct_9fa48("14007") ? value === undefined : stryMutAct_9fa48("14006") ? true : (stryCov_9fa48("14006", "14007"), value !== undefined)) && (stryMutAct_9fa48("14009") ? value === null : stryMutAct_9fa48("14008") ? true : (stryCov_9fa48("14008", "14009"), value !== null)))) {
          searchParams.append(key, String(value));
        }
      });
      const queryString = searchParams.toString();
      if (stryMutAct_9fa48("14012") ? false : stryMutAct_9fa48("14011") ? true : (stryCov_9fa48("14011", "14012"), queryString)) {
        url += `?${queryString}`;
      }
    }
    return this.request<T>(url, stryMutAct_9fa48("14015") ? {} : (stryCov_9fa48("14015"), {
      method: 'GET'
    }));
  }
  async post<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, stryMutAct_9fa48("14018") ? {} : (stryCov_9fa48("14018"), {
      method: 'POST',
      body: body ? JSON.stringify(body) : undefined
    }));
  }
  async put<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, stryMutAct_9fa48("14021") ? {} : (stryCov_9fa48("14021"), {
      method: 'PUT',
      body: body ? JSON.stringify(body) : undefined
    }));
  }
  async patch<T>(endpoint: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, stryMutAct_9fa48("14024") ? {} : (stryCov_9fa48("14024"), {
      method: 'PATCH',
      body: body ? JSON.stringify(body) : undefined
    }));
  }
  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, stryMutAct_9fa48("14027") ? {} : (stryCov_9fa48("14027"), {
      method: 'DELETE'
    }));
  }
}
export const api = new ApiClient();

// Event emitter for auth state changes
type AuthListener = (isAuthenticated: boolean) => void;
const authListeners: AuthListener[] = stryMutAct_9fa48("14029") ? ["Stryker was here"] : (stryCov_9fa48("14029"), []);
export function onAuthChange(listener: AuthListener): () => void {
  authListeners.push(listener);
  return () => {
    const index = authListeners.indexOf(listener);
    if (stryMutAct_9fa48("14035") ? index <= -1 : stryMutAct_9fa48("14034") ? index >= -1 : stryMutAct_9fa48("14033") ? false : stryMutAct_9fa48("14032") ? true : (stryCov_9fa48("14032", "14033", "14034", "14035"), index > (stryMutAct_9fa48("14036") ? +1 : (stryCov_9fa48("14036"), -1)))) {
      authListeners.splice(index, 1);
    }
  };
}
function notifyAuthChange(isAuthenticated: boolean): void {
  authListeners.forEach(stryMutAct_9fa48("14039") ? () => undefined : (stryCov_9fa48("14039"), listener => listener(isAuthenticated)));
}

// Export convenience methods
export default stryMutAct_9fa48("14040") ? {} : (stryCov_9fa48("14040"), {
  api,
  tokenManager,
  onAuthChange,
  notifyAuthChange
});