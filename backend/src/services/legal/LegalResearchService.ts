/**
 * LEGAL RESEARCH SERVICE - Backend
 * Provides legal research capabilities for Council agents
 * 
 * Integrates:
 * - CourtListener (primary case law source - CAP API deprecated Jan 2025)
 * - eCFR (federal regulations)
 * - Open States (state legislation)
 * - Federal Register (rules/notices)
 * - SEC EDGAR (corporate filings)
 * 
 * Note: Caselaw Access Project API was deprecated in late 2024.
 * We now use CourtListener as primary and have 45K+ offline cases as backup.
 */

import { EventEmitter } from 'events';

// API Base URLs
const COURTLISTENER_API_BASE = 'https://www.courtlistener.com/api/rest/v3';
const ECFR_API_BASE = 'https://www.ecfr.gov/api';
const OPENSTATES_API_BASE = 'https://v3.openstates.org';
const FEDERAL_REGISTER_API_BASE = 'https://www.federalregister.gov/api/v1';
const SEC_EDGAR_API_BASE = 'https://data.sec.gov';

// Retry configuration
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 1000;
const REQUEST_TIMEOUT_MS = 30000;

// Types
export interface LegalSearchResult {
  source: string;
  type: 'case' | 'regulation' | 'bill' | 'filing' | 'rule';
  id: string;
  title: string;
  citation?: string;
  date?: string;
  snippet?: string;
  url?: string;
  relevanceScore?: number;
  metadata?: Record<string, unknown>;
}

export interface LegalToolCall {
  id: string;
  tool: string;
  params: Record<string, unknown>;
  result?: LegalSearchResult[];
  error?: string;
  durationMs?: number;
  timestamp: Date;
}

export interface CaselawCase {
  id: number;
  name: string;
  name_abbreviation: string;
  decision_date: string;
  citations: { cite: string; type: string }[];
  court: { name: string; slug: string };
  jurisdiction: { name: string; slug: string };
  frontend_url: string;
  preview?: string[];
}

export interface CFRSearchResult {
  title: number;
  part: number;
  section: string;
  heading: string;
  snippet: string;
}

export interface StateBill {
  id: string;
  identifier: string;
  title: string;
  state: string;
  session: string;
  status: string;
  lastAction: string;
  url: string;
}

export interface FederalRegisterDoc {
  document_number: string;
  title: string;
  type: string;
  abstract: string;
  publication_date: string;
  agencies: { name: string }[];
  html_url: string;
}

export interface SECFiling {
  accessionNumber: string;
  form: string;
  filingDate: string;
  companyName?: string;
  cik: string;
}

class LegalResearchService extends EventEmitter {
  private courtListenerApiKey: string | null = null;
  private openStatesApiKey: string | null = null;
  private toolCallHistory: LegalToolCall[] = [];
  private cache: Map<string, { data: unknown; timestamp: number }> = new Map();
  private CACHE_TTL = 1000 * 60 * 30; // 30 minutes

  constructor() {
    super();
    this.courtListenerApiKey = process.env['COURTLISTENER_API_KEY'] || null;
    this.openStatesApiKey = process.env['OPENSTATES_API_KEY'] || null;
  }

  // ===========================================================================
  // CONFIGURATION
  // ===========================================================================

  setApiKeys(keys: {
    courtlistener?: string;
    openstates?: string;
  }): void {
    if (keys.courtlistener) this.courtListenerApiKey = keys.courtlistener;
    if (keys.openstates) this.openStatesApiKey = keys.openstates;
  }

  getStatus(): {
    caselaw: boolean;
    courtlistener: boolean;
    openstates: boolean;
    ecfr: boolean;
    federalRegister: boolean;
    secEdgar: boolean;
  } {
    return {
      caselaw: true, // Always available (rate limited without key)
      courtlistener: true,
      openstates: !!this.openStatesApiKey,
      ecfr: true,
      federalRegister: true,
      secEdgar: true,
    };
  }

  // ===========================================================================
  // HELPER: Fetch with retry and timeout
  // ===========================================================================

  private async fetchWithRetry(
    url: string, 
    options: RequestInit = {},
    retries: number = MAX_RETRIES
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
    
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (retries > 0 && (error instanceof Error && error.name === 'AbortError')) {
        console.log(`[LegalResearch] Retrying ${url} (${retries} retries left)`);
        await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS));
        return this.fetchWithRetry(url, options, retries - 1);
      }
      throw error;
    }
  }

  // ===========================================================================
  // CASELAW SEARCH (CourtListener with API key, or offline data)
  // Note: Caselaw Access Project API deprecated Jan 2025
  // CourtListener requires authentication - use offline data as fallback
  // ===========================================================================

  async searchCases(query: string, options?: {
    jurisdiction?: string;
    dateMin?: string;
    dateMax?: string;
    limit?: number;
  }): Promise<LegalSearchResult[]> {
    const startTime = Date.now();
    const cacheKey = `cases:${query}:${JSON.stringify(options)}`;
    
    const cached = this.getFromCache<LegalSearchResult[]>(cacheKey);
    if (cached) return cached;

    // If no CourtListener API key, return guidance to use offline data
    if (!this.courtListenerApiKey) {
      const offlineResult: LegalSearchResult = {
        source: 'offline-guidance',
        type: 'case',
        id: 'offline-data',
        title: `Case law search: "${query}"`,
        snippet: `CourtListener API requires authentication. Use offline case law data (45,591 cases in data/caselaw/) or set COURTLISTENER_API_KEY. Get a free API key at https://www.courtlistener.com/sign-in/`,
        url: 'https://www.courtlistener.com/sign-in/',
        metadata: { note: 'API key required for live search' },
      };
      this.logToolCall('searchCases', { query, ...options }, [offlineResult], Date.now() - startTime);
      return [offlineResult];
    }

    try {
      const params = new URLSearchParams({
        q: query,
        page_size: String(options?.limit || 10),
        order_by: '-dateFiled',
      });
      
      if (options?.jurisdiction) params.append('court', options.jurisdiction);
      if (options?.dateMin) params.append('filed_after', options.dateMin);
      if (options?.dateMax) params.append('filed_before', options.dateMax);

      const headers: Record<string, string> = { 
        'Accept': 'application/json',
        'Authorization': `Token ${this.courtListenerApiKey}`,
      };

      const response = await this.fetchWithRetry(
        `${COURTLISTENER_API_BASE}/search/?${params}`,
        { headers }
      );
      
      if (!response.ok) {
        throw new Error(`CourtListener API error: ${response.status}`);
      }

      const data = await response.json() as {
        results: Array<{
          id: number;
          caseName: string;
          dateFiled: string;
          citation: string[];
          court: string;
          snippet: string;
          absolute_url: string;
        }>;
      };

      const results: LegalSearchResult[] = (data.results || []).map((c) => ({
        source: 'courtlistener',
        type: 'case' as const,
        id: String(c.id),
        title: c.caseName || 'Unknown Case',
        citation: c.citation?.[0] || undefined,
        date: c.dateFiled,
        snippet: c.snippet?.substring(0, 300) || undefined,
        url: c.absolute_url ? `https://www.courtlistener.com${c.absolute_url}` : undefined,
        metadata: { court: c.court },
      }));

      this.setCache(cacheKey, results);
      this.logToolCall('searchCases', { query, ...options }, results, Date.now() - startTime);
      
      return results;
    } catch (error) {
      this.logToolCall('searchCases', { query, ...options }, undefined, Date.now() - startTime, 
        error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  async getCaseByCitation(citation: string): Promise<LegalSearchResult | null> {
    const results = await this.searchCases(citation, { limit: 1 });
    return results[0] || null;
  }

  // ===========================================================================
  // FEDERAL REGULATIONS (eCFR)
  // ===========================================================================

  async searchRegulations(query: string, options?: {
    title?: number;
    limit?: number;
  }): Promise<LegalSearchResult[]> {
    const startTime = Date.now();
    const cacheKey = `cfr:${query}:${JSON.stringify(options)}`;
    
    const cached = this.getFromCache<LegalSearchResult[]>(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams({
        query,
        per_page: String(options?.limit || 10),
      });
      
      if (options?.title) params.append('title', String(options.title));

      const response = await fetch(`${ECFR_API_BASE}/search/v1/results?${params}`);
      
      if (!response.ok) {
        throw new Error(`eCFR API error: ${response.status}`);
      }

      const data = await response.json();
      const results: LegalSearchResult[] = (data.results || []).map((r: CFRSearchResult) => ({
        source: 'ecfr',
        type: 'regulation' as const,
        id: `${r.title}-${r.part}-${r.section}`,
        title: r.heading,
        citation: `${r.title} CFR § ${r.part}.${r.section}`,
        snippet: r.snippet,
        url: `https://www.ecfr.gov/current/title-${r.title}/part-${r.part}/section-${r.part}.${r.section}`,
        metadata: { title: r.title, part: r.part, section: r.section },
      }));

      this.setCache(cacheKey, results);
      this.logToolCall('searchRegulations', { query, ...options }, results, Date.now() - startTime);
      
      return results;
    } catch (error) {
      this.logToolCall('searchRegulations', { query, ...options }, undefined, Date.now() - startTime,
        error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // ===========================================================================
  // STATE LEGISLATION (Open States)
  // ===========================================================================

  async searchStateBills(query: string, options?: {
    state?: string;
    limit?: number;
  }): Promise<LegalSearchResult[]> {
    if (!this.openStatesApiKey) {
      throw new Error('Open States API key required');
    }

    const startTime = Date.now();
    const cacheKey = `bills:${query}:${JSON.stringify(options)}`;
    
    const cached = this.getFromCache<LegalSearchResult[]>(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams({
        q: query,
        per_page: String(options?.limit || 10),
      });
      
      if (options?.state) params.append('jurisdiction', options.state);

      const response = await fetch(`${OPENSTATES_API_BASE}/bills?${params}`, {
        headers: {
          'X-API-KEY': this.openStatesApiKey,
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`Open States API error: ${response.status}`);
      }

      const data = await response.json();
      const results: LegalSearchResult[] = (data.results || []).map((b: {
        id: string;
        identifier: string;
        title: string;
        legislative_session: { jurisdiction: { name: string }; identifier: string };
        latest_action_description: string;
        openstates_url: string;
        classification: string[];
      }) => ({
        source: 'openstates',
        type: 'bill' as const,
        id: b.id,
        title: `${b.identifier}: ${b.title}`,
        citation: b.identifier,
        snippet: b.latest_action_description,
        url: b.openstates_url,
        metadata: {
          state: b.legislative_session.jurisdiction.name,
          session: b.legislative_session.identifier,
          status: b.classification.join(', '),
        },
      }));

      this.setCache(cacheKey, results);
      this.logToolCall('searchStateBills', { query, ...options }, results, Date.now() - startTime);
      
      return results;
    } catch (error) {
      this.logToolCall('searchStateBills', { query, ...options }, undefined, Date.now() - startTime,
        error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // ===========================================================================
  // FEDERAL REGISTER
  // ===========================================================================

  async searchFederalRegister(query: string, options?: {
    type?: 'RULE' | 'PRORULE' | 'NOTICE';
    agency?: string;
    days?: number;
    limit?: number;
  }): Promise<LegalSearchResult[]> {
    const startTime = Date.now();
    const cacheKey = `fr:${query}:${JSON.stringify(options)}`;
    
    const cached = this.getFromCache<LegalSearchResult[]>(cacheKey);
    if (cached) return cached;

    try {
      const params = new URLSearchParams({
        'conditions[term]': query,
        per_page: String(options?.limit || 10),
        order: 'newest',
      });
      
      if (options?.type) params.append('conditions[type][]', options.type);
      if (options?.agency) params.append('conditions[agencies][]', options.agency);
      if (options?.days) {
        const since = new Date(Date.now() - options.days * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
        params.append('conditions[publication_date][gte]', since);
      }

      // Use retry logic for Federal Register (can timeout)
      const response = await this.fetchWithRetry(`${FEDERAL_REGISTER_API_BASE}/documents.json?${params}`);
      
      if (!response.ok) {
        throw new Error(`Federal Register API error: ${response.status}`);
      }

      const data = await response.json();
      const results: LegalSearchResult[] = (data.results || []).map((d: FederalRegisterDoc) => ({
        source: 'federal-register',
        type: 'rule' as const,
        id: d.document_number,
        title: d.title,
        date: d.publication_date,
        snippet: d.abstract?.substring(0, 300),
        url: d.html_url,
        metadata: {
          type: d.type,
          agencies: d.agencies.map(a => a.name),
        },
      }));

      this.setCache(cacheKey, results);
      this.logToolCall('searchFederalRegister', { query, ...options }, results, Date.now() - startTime);
      
      return results;
    } catch (error) {
      this.logToolCall('searchFederalRegister', { query, ...options }, undefined, Date.now() - startTime,
        error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // ===========================================================================
  // SEC EDGAR
  // ===========================================================================

  async searchSECFilings(cik: string, options?: {
    form?: string;
    limit?: number;
  }): Promise<LegalSearchResult[]> {
    const startTime = Date.now();
    const cacheKey = `sec:${cik}:${JSON.stringify(options)}`;
    
    const cached = this.getFromCache<LegalSearchResult[]>(cacheKey);
    if (cached) return cached;

    try {
      const paddedCik = cik.replace(/^0+/, '').padStart(10, '0');
      const response = await fetch(`${SEC_EDGAR_API_BASE}/submissions/CIK${paddedCik}.json`, {
        headers: {
          'User-Agent': 'Datacendia Legal Research contact@datacendia.com',
          'Accept': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`SEC EDGAR API error: ${response.status}`);
      }

      const data = await response.json();
      const recent = data.filings?.recent;
      if (!recent) return [];

      const results: LegalSearchResult[] = [];
      const limit = options?.limit || 10;

      for (let i = 0; i < Math.min(recent.accessionNumber.length, limit * 2); i++) {
        if (options?.form && recent.form[i] !== options.form) continue;
        if (results.length >= limit) break;

        results.push({
          source: 'sec-edgar',
          type: 'filing' as const,
          id: recent.accessionNumber[i],
          title: `${recent.form[i]} - ${data.name}`,
          citation: recent.accessionNumber[i],
          date: recent.filingDate[i],
          snippet: recent.primaryDocDescription[i],
          url: `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=${cik}`,
          metadata: {
            form: recent.form[i],
            companyName: data.name,
            cik: data.cik,
          },
        });
      }

      this.setCache(cacheKey, results);
      this.logToolCall('searchSECFilings', { cik, ...options }, results, Date.now() - startTime);
      
      return results;
    } catch (error) {
      this.logToolCall('searchSECFilings', { cik, ...options }, undefined, Date.now() - startTime,
        error instanceof Error ? error.message : 'Unknown error');
      throw error;
    }
  }

  // ===========================================================================
  // UNIFIED SEARCH
  // ===========================================================================

  async unifiedSearch(query: string, options?: {
    sources?: ('cases' | 'regulations' | 'bills' | 'federal-register' | 'sec')[];
    jurisdiction?: string;
    limit?: number;
  }): Promise<LegalSearchResult[]> {
    const sources = options?.sources || ['cases', 'regulations', 'bills', 'federal-register'];
    const limit = options?.limit || 5;
    const results: LegalSearchResult[] = [];

    const searches: Promise<LegalSearchResult[]>[] = [];

    if (sources.includes('cases')) {
      searches.push(
        this.searchCases(query, { jurisdiction: options?.jurisdiction, limit })
          .catch(() => [])
      );
    }

    if (sources.includes('regulations')) {
      searches.push(
        this.searchRegulations(query, { limit })
          .catch(() => [])
      );
    }

    if (sources.includes('bills') && this.openStatesApiKey) {
      searches.push(
        this.searchStateBills(query, { state: options?.jurisdiction, limit })
          .catch(() => [])
      );
    }

    if (sources.includes('federal-register')) {
      searches.push(
        this.searchFederalRegister(query, { limit })
          .catch(() => [])
      );
    }

    const searchResults = await Promise.all(searches);
    for (const r of searchResults) {
      results.push(...r);
    }

    return results;
  }

  // ===========================================================================
  // TOOL EXECUTION (for Council agents)
  // ===========================================================================

  async executeTool(toolName: string, params: Record<string, unknown>): Promise<{
    success: boolean;
    results?: LegalSearchResult[];
    error?: string;
    source: string;
  }> {
    try {
      let results: LegalSearchResult[];

      switch (toolName) {
        case 'search_cases':
        case 'searchCases':
          results = await this.searchCases(
            params.query as string,
            {
              jurisdiction: params.jurisdiction as string,
              dateMin: params.dateMin as string,
              dateMax: params.dateMax as string,
              limit: params.limit as number,
            }
          );
          return { success: true, results, source: 'caselaw-access-project' };

        case 'search_regulations':
        case 'searchRegulations':
          results = await this.searchRegulations(
            params.query as string,
            {
              title: params.title as number,
              limit: params.limit as number,
            }
          );
          return { success: true, results, source: 'ecfr' };

        case 'search_state_bills':
        case 'searchStateBills':
          results = await this.searchStateBills(
            params.query as string,
            {
              state: params.state as string,
              limit: params.limit as number,
            }
          );
          return { success: true, results, source: 'openstates' };

        case 'search_federal_register':
        case 'searchFederalRegister':
          results = await this.searchFederalRegister(
            params.query as string,
            {
              type: params.type as 'RULE' | 'PRORULE' | 'NOTICE',
              agency: params.agency as string,
              days: params.days as number,
              limit: params.limit as number,
            }
          );
          return { success: true, results, source: 'federal-register' };

        case 'search_sec_filings':
        case 'searchSECFilings':
          results = await this.searchSECFilings(
            params.cik as string,
            {
              form: params.form as string,
              limit: params.limit as number,
            }
          );
          return { success: true, results, source: 'sec-edgar' };

        case 'unified_search':
        case 'unifiedSearch':
          results = await this.unifiedSearch(
            params.query as string,
            {
              sources: params.sources as ('cases' | 'regulations' | 'bills' | 'federal-register' | 'sec')[],
              jurisdiction: params.jurisdiction as string,
              limit: params.limit as number,
            }
          );
          return { success: true, results, source: 'unified' };

        default:
          return { success: false, error: `Unknown tool: ${toolName}`, source: 'unknown' };
      }
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        source: toolName,
      };
    }
  }

  // ===========================================================================
  // HELPERS
  // ===========================================================================

  private getFromCache<T>(key: string): T | null {
    const cached = this.cache.get(key);
    if (cached && Date.now() - cached.timestamp < this.CACHE_TTL) {
      return cached.data as T;
    }
    return null;
  }

  private setCache(key: string, data: unknown): void {
    this.cache.set(key, { data, timestamp: Date.now() });
  }

  private logToolCall(
    tool: string,
    params: Record<string, unknown>,
    result?: LegalSearchResult[],
    durationMs?: number,
    error?: string
  ): void {
    const call: LegalToolCall = {
      id: `${tool}-${Date.now()}`,
      tool,
      params,
      result,
      error,
      durationMs,
      timestamp: new Date(),
    };
    
    this.toolCallHistory.push(call);
    this.emit('toolCall', call);

    // Keep only last 100 calls
    if (this.toolCallHistory.length > 100) {
      this.toolCallHistory = this.toolCallHistory.slice(-100);
    }
  }

  getToolCallHistory(): LegalToolCall[] {
    return [...this.toolCallHistory];
  }

  clearCache(): void {
    this.cache.clear();
  }

  /**
   * Format results for agent context
   */
  formatResultsForAgent(results: LegalSearchResult[]): string {
    if (results.length === 0) {
      return 'No legal sources found matching the query.';
    }

    return results.map(r => {
      let formatted = `**${r.title}**`;
      if (r.citation) formatted += `\nCitation: ${r.citation}`;
      if (r.date) formatted += `\nDate: ${r.date}`;
      if (r.snippet) formatted += `\n${r.snippet}`;
      if (r.url) formatted += `\nURL: ${r.url}`;
      formatted += `\nSource: ${r.source}`;
      return formatted;
    }).join('\n\n---\n\n');
  }
}

// Singleton instance
export const legalResearchService = new LegalResearchService();

export default legalResearchService;
