/**
 * CendiaWatch™ Service Tests
 * 
 * Tests for competitive intelligence and market monitoring
 * @module __tests__/services/CendiaWatchService.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.

import { describe, it, expect, vi, beforeEach } from 'vitest';

vi.mock('../../utils/logger.js', () => ({
  logger: { info: vi.fn(), warn: vi.fn(), error: vi.fn(), debug: vi.fn() },
}));

vi.mock('../../utils/servicePersistence.js', () => ({
  persistServiceRecord: vi.fn().mockResolvedValue(undefined),
  loadServiceRecords: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../services/ollama.js', () => ({
  default: {
    generate: vi.fn().mockResolvedValue('{"sentiment": 0.5, "relevance": 0.8, "keywords": ["AI", "governance"], "summary": "Test summary"}'),
    chat: vi.fn().mockResolvedValue({ role: 'assistant', content: '{"sentiment": 0.5, "relevance": 0.8}' }),
    type: 'ollama',
    isAvailable: vi.fn().mockResolvedValue(true),
    resolveModel: vi.fn().mockResolvedValue('llama3.2:3b'),
  },
}));

const { cendiaWatchService } = await import('../../services/core/CendiaWatchService.js');

describe('CendiaWatchService', () => {
  // =========================================================================
  // INITIALIZATION
  // =========================================================================

  describe('initialization', () => {
    it('should export a singleton instance', () => {
      expect(cendiaWatchService).toBeDefined();
    });

    it('should return config', () => {
      const config = cendiaWatchService.getConfig();
      expect(config).toBeDefined();
    });
  });

  // =========================================================================
  // HEALTH & DASHBOARD
  // =========================================================================

  describe('getHealth()', () => {
    it('should return health status', async () => {
      const health = await cendiaWatchService.getHealth();
      expect(health.healthy).toBe(true);
      expect(health.service).toBeDefined();
      expect(health.timestamp).toBeInstanceOf(Date);
    });
  });

  describe('getDashboard()', () => {
    it('should return dashboard data', async () => {
      const dashboard = await cendiaWatchService.getDashboard();
      expect(dashboard).toBeDefined();
      expect(dashboard).toHaveProperty('serviceName');
      expect(dashboard).toHaveProperty('status');
      expect(dashboard).toHaveProperty('recordCount');
    });
  });

  // =========================================================================
  // SIGNAL INGESTION
  // =========================================================================

  describe('ingestSignal()', () => {
    it('should ingest a market signal', async () => {
      const signal = await cendiaWatchService.ingestSignal({
        type: 'news',
        source: 'tech-news',
        title: 'Competitor launches new product',
        content: 'Major competitor announced a new AI governance platform today',
        url: 'https://example.com/news/1',
      });
      expect(signal).toBeDefined();
      expect(signal.id).toBeDefined();
      expect(signal.title).toBe('Competitor launches new product');
      expect(signal.detectedAt).toBeInstanceOf(Date);
    });

    it('should auto-detect keywords', async () => {
      const signal = await cendiaWatchService.ingestSignal({
        type: 'social',
        source: 'linkedin',
        title: 'AI governance market analysis',
        content: 'The AI governance market is expected to grow significantly',
      });
      expect(signal.keywords).toBeDefined();
      expect(Array.isArray(signal.keywords)).toBe(true);
    });
  });

  // =========================================================================
  // COMPETITOR MANAGEMENT
  // =========================================================================

  describe('addCompetitor()', () => {
    it('should add a competitor', () => {
      const competitor = cendiaWatchService.addCompetitor({
        name: 'TestCompetitor Inc',
        website: 'testcompetitor.com',
        category: 'direct',
        products: ['AI Platform'],
        strengths: ['Good UI'],
        weaknesses: ['No governance'],
      });

      expect(competitor).toBeDefined();
      expect(competitor.id).toBeDefined();
      expect(competitor.name).toBe('TestCompetitor Inc');
      expect(competitor.lastUpdated).toBeInstanceOf(Date);
    });
  });

  describe('getCompetitors()', () => {
    it('should return array of competitors', () => {
      const competitors = cendiaWatchService.getCompetitors();
      expect(Array.isArray(competitors)).toBe(true);
    });
  });

  // =========================================================================
  // ALERTS
  // =========================================================================

  describe('getAlerts()', () => {
    it('should return array of alerts', () => {
      const alerts = cendiaWatchService.getAlerts();
      expect(Array.isArray(alerts)).toBe(true);
    });

    it('should filter by acknowledged status', () => {
      const unacknowledged = cendiaWatchService.getAlerts(false);
      expect(Array.isArray(unacknowledged)).toBe(true);
    });
  });

  describe('getCriticalAlert()', () => {
    it('should return string or null', () => {
      const alert = cendiaWatchService.getCriticalAlert();
      expect(alert === null || typeof alert === 'string').toBe(true);
    });
  });

  // =========================================================================
  // REPORTS
  // =========================================================================

  describe('generateReport()', () => {
    it('should generate daily report', async () => {
      const report = await cendiaWatchService.generateReport('daily');
      expect(report).toBeDefined();
      expect(report).toHaveProperty('period', 'daily');
    });

    it('should generate weekly report', async () => {
      const report = await cendiaWatchService.generateReport('weekly');
      expect(report.period).toBe('weekly');
    });

    it('should generate monthly report', async () => {
      const report = await cendiaWatchService.generateReport('monthly');
      expect(report.period).toBe('monthly');
    });
  });

  // =========================================================================
  // SCANNING
  // =========================================================================

  describe('scanForKeyword()', () => {
    it('should return matching signals', async () => {
      const results = await cendiaWatchService.scanForKeyword('governance');
      expect(Array.isArray(results)).toBe(true);
    });
  });

  describe('scanCompetitor()', () => {
    it('should return competitor analysis', async () => {
      const result = await cendiaWatchService.scanCompetitor('TestCompetitor Inc');
      expect(result).toBeDefined();
      expect(typeof result).toBe('object');
    });
  });

  // =========================================================================
  // METRICS & ANALYTICS
  // =========================================================================

  describe('getMetrics()', () => {
    it('should return service metrics', () => {
      const metrics = cendiaWatchService.getMetrics();
      expect(metrics).toBeDefined();
      expect(typeof metrics).toBe('object');
    });
  });

  describe('getMarketIntelligenceDashboard()', () => {
    it('should return intelligence dashboard data', () => {
      const dashboard = cendiaWatchService.getMarketIntelligenceDashboard();
      expect(dashboard).toBeDefined();
    });
  });

  describe('getCompetitorLandscapeAnalytics()', () => {
    it('should return competitor analytics', async () => {
      const analytics = await cendiaWatchService.getCompetitorLandscapeAnalytics();
      expect(analytics).toBeDefined();
      expect(typeof analytics).toBe('object');
    });
  });

  describe('getSignalPatternIntelligence()', () => {
    it('should return signal patterns', () => {
      const patterns = cendiaWatchService.getSignalPatternIntelligence();
      expect(patterns).toBeDefined();
    });
  });

  describe('getThreatResponseEffectiveness()', () => {
    it('should return threat response metrics', () => {
      const effectiveness = cendiaWatchService.getThreatResponseEffectiveness();
      expect(effectiveness).toBeDefined();
    });
  });

  describe('getMarketTrendForecast()', () => {
    it('should return market forecasts', async () => {
      const forecast = await cendiaWatchService.getMarketTrendForecast();
      expect(forecast).toBeDefined();
      expect(typeof forecast).toBe('object');
    });
  });

  // =========================================================================
  // CONFIG
  // =========================================================================

  describe('updateConfig()', () => {
    it('should update configuration', () => {
      const originalConfig = cendiaWatchService.getConfig();
      cendiaWatchService.updateConfig({ scanIntervalMinutes: 30 } as any);
      const updated = cendiaWatchService.getConfig();
      expect(updated).toBeDefined();
    });
  });
});
