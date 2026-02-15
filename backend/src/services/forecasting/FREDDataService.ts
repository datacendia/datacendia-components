// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// FRED DATA SERVICE
// Fetches real economic data from Federal Reserve Economic Data (FRED)
// =============================================================================

import { logger } from '../../utils/logger.js';

// FRED API base URL (free, no key required for basic access)
const FRED_API_BASE = 'https://api.stlouisfed.org/fred';

// Key economic indicators
export const FRED_SERIES = {
  // GDP & Growth
  GDP: { id: 'GDP', name: 'Gross Domestic Product', frequency: 'quarterly', unit: 'Billions of Dollars' },
  GDPC1: { id: 'GDPC1', name: 'Real GDP', frequency: 'quarterly', unit: 'Billions of Chained 2017 Dollars' },
  
  // Employment
  UNRATE: { id: 'UNRATE', name: 'Unemployment Rate', frequency: 'monthly', unit: 'Percent' },
  PAYEMS: { id: 'PAYEMS', name: 'Total Nonfarm Payrolls', frequency: 'monthly', unit: 'Thousands of Persons' },
  ICSA: { id: 'ICSA', name: 'Initial Jobless Claims', frequency: 'weekly', unit: 'Number' },
  
  // Inflation
  CPIAUCSL: { id: 'CPIAUCSL', name: 'Consumer Price Index', frequency: 'monthly', unit: 'Index 1982-1984=100' },
  PCEPI: { id: 'PCEPI', name: 'PCE Price Index', frequency: 'monthly', unit: 'Index 2017=100' },
  
  // Interest Rates
  FEDFUNDS: { id: 'FEDFUNDS', name: 'Federal Funds Rate', frequency: 'monthly', unit: 'Percent' },
  DGS10: { id: 'DGS10', name: '10-Year Treasury Rate', frequency: 'daily', unit: 'Percent' },
  DGS2: { id: 'DGS2', name: '2-Year Treasury Rate', frequency: 'daily', unit: 'Percent' },
  
  // Housing
  HOUST: { id: 'HOUST', name: 'Housing Starts', frequency: 'monthly', unit: 'Thousands of Units' },
  CSUSHPISA: { id: 'CSUSHPISA', name: 'Case-Shiller Home Price Index', frequency: 'monthly', unit: 'Index Jan 2000=100' },
  
  // Consumer
  RSXFS: { id: 'RSXFS', name: 'Retail Sales', frequency: 'monthly', unit: 'Millions of Dollars' },
  UMCSENT: { id: 'UMCSENT', name: 'Consumer Sentiment', frequency: 'monthly', unit: 'Index 1966:Q1=100' },
  
  // Business
  INDPRO: { id: 'INDPRO', name: 'Industrial Production Index', frequency: 'monthly', unit: 'Index 2017=100' },
  DGORDER: { id: 'DGORDER', name: 'Durable Goods Orders', frequency: 'monthly', unit: 'Millions of Dollars' },
} as const;

export type FREDSeriesId = keyof typeof FRED_SERIES;

export interface FREDDataPoint {
  date: string;
  value: number;
}

export interface FREDSeriesData {
  seriesId: string;
  name: string;
  frequency: string;
  unit: string;
  observations: FREDDataPoint[];
  lastUpdated: Date;
}

// In-memory cache for FRED data
const dataCache = new Map<string, { data: FREDSeriesData; fetchedAt: Date }>();
const CACHE_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

class FREDDataService {
  private apiKey: string | null;

  constructor() {
    this.apiKey = process.env.FRED_API_KEY || null;
    if (!this.apiKey) {
      logger.warn('[FRED] No FRED_API_KEY set - using sample data fallback');
    }
  }

  /**
   * Fetch series data from FRED API
   */
  async fetchSeries(seriesId: FREDSeriesId, startDate?: string, endDate?: string): Promise<FREDSeriesData> {
    const cacheKey = `${seriesId}-${startDate || 'start'}-${endDate || 'end'}`;
    
    // Check cache
    const cached = dataCache.get(cacheKey);
    if (cached && Date.now() - cached.fetchedAt.getTime() < CACHE_DURATION_MS) {
      logger.debug('[FRED] Returning cached data for', seriesId);
      return cached.data;
    }

    const seriesInfo = FRED_SERIES[seriesId];
    
    // If no API key, return sample data
    if (!this.apiKey) {
      return this.getSampleData(seriesId);
    }

    try {
      const params = new URLSearchParams();
      params.set('series_id', seriesInfo.id);
      params.set('api_key', this.apiKey);
      params.set('file_type', 'json');
      params.set('observation_start', startDate || '2000-01-01');
      params.set('observation_end', endDate ?? new Date().toISOString().split('T')[0]!);

      const response = await fetch(`${FRED_API_BASE}/series/observations?${params}`);
      
      if (!response.ok) {
        throw new Error(`FRED API error: ${response.status}`);
      }

      const json: any = await response.json();
      
      const observations: FREDDataPoint[] = json.observations
        .filter((obs: any) => obs.value !== '.')
        .map((obs: any) => ({
          date: obs.date,
          value: parseFloat(obs.value),
        }));

      const data: FREDSeriesData = {
        seriesId: seriesInfo.id,
        name: seriesInfo.name,
        frequency: seriesInfo.frequency,
        unit: seriesInfo.unit,
        observations,
        lastUpdated: new Date(),
      };

      // Cache the result
      dataCache.set(cacheKey, { data, fetchedAt: new Date() });
      
      logger.info('[FRED] Fetched', observations.length, 'observations for', seriesId);
      return data;

    } catch (error) {
      logger.error('[FRED] API fetch failed, using sample data:', error);
      return this.getSampleData(seriesId);
    }
  }

  /**
   * Generate sample data for demo/fallback
   */
  private getSampleData(seriesId: FREDSeriesId): FREDSeriesData {
    const seriesInfo = FRED_SERIES[seriesId];
    const observations: FREDDataPoint[] = [];
    
    // Generate realistic sample data based on series type
    const now = new Date();
    const startYear = 2015;
    let baseValue: number;
    let volatility: number;
    let trend: number;

    switch (seriesId) {
      case 'GDP':
        baseValue = 18000; volatility = 200; trend = 150;
        break;
      case 'UNRATE':
        baseValue = 5; volatility = 0.3; trend = -0.02;
        break;
      case 'CPIAUCSL':
        baseValue = 240; volatility = 1; trend = 0.5;
        break;
      case 'FEDFUNDS':
        baseValue = 1.5; volatility = 0.25; trend = 0.05;
        break;
      case 'DGS10':
        baseValue = 2.5; volatility = 0.3; trend = 0.02;
        break;
      case 'INDPRO':
        baseValue = 100; volatility = 1; trend = 0.3;
        break;
      default:
        baseValue = 100; volatility = 5; trend = 0.5;
    }

    // Generate monthly data points
    for (let year = startYear; year <= now.getFullYear(); year++) {
      const maxMonth = year === now.getFullYear() ? now.getMonth() : 11;
      for (let month = 0; month <= maxMonth; month++) {
        const monthsFromStart = (year - startYear) * 12 + month;
        const cyclical = Math.sin(monthsFromStart / 12 * Math.PI * 2) * volatility;
        const noise = (Math.random() - 0.5) * volatility;
        const value = baseValue + trend * monthsFromStart + cyclical + noise;
        
        observations.push({
          date: `${year}-${String(month + 1).padStart(2, '0')}-01`,
          value: Math.round(value * 100) / 100,
        });
      }
    }

    return {
      seriesId: seriesInfo.id,
      name: seriesInfo.name,
      frequency: seriesInfo.frequency,
      unit: seriesInfo.unit,
      observations,
      lastUpdated: new Date(),
    };
  }

  /**
   * Get multiple series at once
   */
  async fetchMultipleSeries(seriesIds: FREDSeriesId[]): Promise<Map<FREDSeriesId, FREDSeriesData>> {
    const results = new Map<FREDSeriesId, FREDSeriesData>();
    
    await Promise.all(
      seriesIds.map(async (id) => {
        const data = await this.fetchSeries(id);
        results.set(id, data);
      })
    );
    
    return results;
  }

  /**
   * Get available series list
   */
  getAvailableSeries(): typeof FRED_SERIES {
    return FRED_SERIES;
  }

  /**
   * Clear cache
   */
  clearCache(): void {
    dataCache.clear();
    logger.info('[FRED] Cache cleared');
  }
}

export const fredDataService = new FREDDataService();
