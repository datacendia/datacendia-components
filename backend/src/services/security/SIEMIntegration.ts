/**
 * Service — S I E M Integration
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports siemIntegration, SIEMConfig, SIEMEvent, DeliveryResult, SIEMProvider
 * @module services/security/SIEMIntegration
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SIEM Integration Service
 * 
 * Real-time security event streaming to enterprise SIEM platforms:
 * - Splunk (HEC - HTTP Event Collector)
 * - Microsoft Sentinel (Azure Log Analytics)
 * - IBM QRadar
 * - Elastic Security
 * - Generic Webhook
 * 
 * Supports CEF (Common Event Format) and JSON formats
 */

import crypto from 'crypto';
import { AuditEvent, AuditSeverity } from '../../security/audit.service.js';
import { logger } from '../../utils/logger.js';
import { sovereignMode } from '../sovereign/SovereignModeService.js';

import { loadServiceRecords } from '../../utils/servicePersistence.js';
// =============================================================================
// TYPES
// =============================================================================

export type SIEMProvider = 'splunk' | 'sentinel' | 'qradar' | 'elastic' | 'webhook';

export interface SIEMConfig {
  id: string;
  provider: SIEMProvider;
  name: string;
  enabled: boolean;
  endpoint: string;
  authType: 'token' | 'basic' | 'api_key' | 'oauth';
  credentials: {
    token?: string;
    username?: string;
    password?: string;
    apiKey?: string;
    clientId?: string;
    clientSecret?: string;
  };
  format: 'json' | 'cef' | 'leef';
  filters?: {
    severities?: AuditSeverity[];
    eventTypes?: string[];
    excludeEventTypes?: string[];
  };
  batchSize?: number;
  flushIntervalMs?: number;
  retryAttempts?: number;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface SIEMEvent {
  timestamp: string;
  severity: string;
  severityCode: number;
  eventType: string;
  organizationId: string;
  userId?: string;
  userName?: string;
  sourceIp?: string;
  userAgent?: string;
  resource: string;
  resourceId?: string;
  action: string;
  outcome: string;
  details: Record<string, unknown>;
  datacendiaEventId: string;
}

export interface DeliveryResult {
  success: boolean;
  provider: SIEMProvider;
  eventsDelivered: number;
  timestamp: Date;
  error?: string;
  responseCode?: number;
}

// =============================================================================
// SIEM INTEGRATION SERVICE
// =============================================================================

class SIEMIntegrationService {
  private configs: Map<string, SIEMConfig> = new Map();
  private eventBuffer: Map<string, SIEMEvent[]> = new Map();
  private flushTimers: Map<string, NodeJS.Timeout> = new Map();
  private deliveryLog: DeliveryResult[] = [];

  constructor() {
    // Start periodic flush for all configs
    setInterval(() => this.flushAllBuffers(), 30000);


    this.loadFromDB().catch((err) => logger.warn('[SIEMIntegration] loadFromDB failed', err));
  }

  /**
   * Register a SIEM integration
   */
  async registerIntegration(config: Omit<SIEMConfig, 'id' | 'createdAt' | 'updatedAt'>): Promise<SIEMConfig> {
    const fullConfig: SIEMConfig = {
      ...config,
      id: `siem_${crypto.randomUUID()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
      batchSize: config.batchSize || 100,
      flushIntervalMs: config.flushIntervalMs || 5000,
      retryAttempts: config.retryAttempts || 3,
    };

    this.configs.set(fullConfig.id, fullConfig);
    this.eventBuffer.set(fullConfig.id, []);

    logger.info(`[SIEM] Registered ${config.provider} integration: ${config.name}`);
    return fullConfig;
  }

  /**
   * Update a SIEM integration
   */
  async updateIntegration(id: string, updates: Partial<SIEMConfig>): Promise<SIEMConfig | null> {
    const config = this.configs.get(id);
    if (!config) return null;

    const updated = { ...config, ...updates, updatedAt: new Date() };
    this.configs.set(id, updated);
    return updated;
  }

  /**
   * Remove a SIEM integration
   */
  async removeIntegration(id: string): Promise<boolean> {
    const timer = this.flushTimers.get(id);
    if (timer) clearTimeout(timer);
    
    this.flushTimers.delete(id);
    this.eventBuffer.delete(id);
    return this.configs.delete(id);
  }

  /**
   * Get all integrations for an organization
   */
  getIntegrations(organizationId: string): SIEMConfig[] {
    return Array.from(this.configs.values())
      .filter(c => c.organizationId === organizationId);
  }

  /**
   * Convert audit event to SIEM format
   */
  private convertToSIEMEvent(event: AuditEvent): SIEMEvent {
    const severityMap: Record<AuditSeverity, number> = {
      info: 1,
      warning: 5,
      critical: 10,
    };

    return {
      timestamp: event.timestamp.toISOString(),
      severity: event.severity.toUpperCase(),
      severityCode: severityMap[event.severity],
      eventType: event.eventType,
      organizationId: event.organizationId,
      userId: event.userId,
      userName: event.userName,
      sourceIp: event.ipAddress,
      userAgent: event.userAgent,
      resource: event.resource.type,
      resourceId: event.resource.id,
      action: event.action,
      outcome: event.outcome,
      details: event.details,
      datacendiaEventId: event.id,
    };
  }

  /**
   * Convert to CEF (Common Event Format) for legacy SIEMs
   */
  private toCEF(event: SIEMEvent): string {
    const severityMap: Record<number, number> = { 1: 3, 5: 6, 10: 10 };
    const cefSeverity = severityMap[event.severityCode] || 5;

    // CEF:Version|Device Vendor|Device Product|Device Version|Signature ID|Name|Severity|Extension
    const cef = [
      'CEF:0',
      'Datacendia',
      'DecisionIntelligence',
      '1.0',
      event.eventType,
      event.action,
      cefSeverity,
      [
        `rt=${new Date(event.timestamp).getTime()}`,
        `src=${event.sourceIp || 'unknown'}`,
        `suser=${event.userName || event.userId || 'unknown'}`,
        `cs1=${event.organizationId}`,
        `cs1Label=OrganizationId`,
        `cs2=${event.resource}`,
        `cs2Label=Resource`,
        `outcome=${event.outcome}`,
        `msg=${JSON.stringify(event.details).replace(/\|/g, '\\|')}`,
      ].join(' '),
    ].join('|');

    return cef;
  }

  /**
   * Stream an audit event to all configured SIEMs
   */
  async streamEvent(event: AuditEvent): Promise<void> {
    // Sovereign mode: block external SIEM streaming, buffer locally only
    if (!sovereignMode.isExternalNotifyEnabled) {
      logger.debug('[SIEM] External notifications disabled (sovereign mode) — event buffered locally only');
      return;
    }

    const siemEvent = this.convertToSIEMEvent(event);

    for (const [configId, config] of this.configs) {
      if (!config.enabled) continue;
      if (config.organizationId !== event.organizationId) continue;

      // Apply filters
      if (config.filters) {
        if (config.filters.severities && !config.filters.severities.includes(event.severity)) {
          continue;
        }
        if (config.filters.eventTypes && !config.filters.eventTypes.includes(event.eventType)) {
          continue;
        }
        if (config.filters.excludeEventTypes && config.filters.excludeEventTypes.includes(event.eventType)) {
          continue;
        }
      }

      // Add to buffer
      const buffer = this.eventBuffer.get(configId) || [];
      buffer.push(siemEvent);
      this.eventBuffer.set(configId, buffer);

      // Flush if buffer is full
      if (buffer.length >= (config.batchSize || 100)) {
        await this.flushBuffer(configId);
      }
    }
  }

  /**
   * Flush event buffer to SIEM
   */
  private async flushBuffer(configId: string): Promise<DeliveryResult | null> {
    const config = this.configs.get(configId);
    const buffer = this.eventBuffer.get(configId);

    if (!config || !buffer || buffer.length === 0) return null;

    // Clear buffer immediately to prevent duplicates
    this.eventBuffer.set(configId, []);

    try {
      const result = await this.deliverEvents(config, buffer);
      this.deliveryLog.push(result);
      
      // Keep only last 1000 delivery results
      if (this.deliveryLog.length > 1000) {
        this.deliveryLog = this.deliveryLog.slice(-1000);
      }

      return result;
    } catch (error) {
      const errorResult: DeliveryResult = {
        success: false,
        provider: config.provider,
        eventsDelivered: 0,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
      };
      this.deliveryLog.push(errorResult);
      
      // Re-add events to buffer for retry (up to limit)
      const currentBuffer = this.eventBuffer.get(configId) || [];
      if (currentBuffer.length < 1000) {
        this.eventBuffer.set(configId, [...buffer, ...currentBuffer]);
      }
      
      return errorResult;
    }
  }

  /**
   * Deliver events to specific SIEM provider
   */
  private async deliverEvents(config: SIEMConfig, events: SIEMEvent[]): Promise<DeliveryResult> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Set auth headers based on provider
    switch (config.authType) {
      case 'token':
        headers['Authorization'] = `Bearer ${config.credentials.token}`;
        break;
      case 'basic':
        const auth = Buffer.from(`${config.credentials.username}:${config.credentials.password}`).toString('base64');
        headers['Authorization'] = `Basic ${auth}`;
        break;
      case 'api_key':
        headers['X-API-Key'] = config.credentials.apiKey || '';
        break;
    }

    // Format payload based on provider
    let payload: string;
    switch (config.provider) {
      case 'splunk':
        // Splunk HEC format
        headers['Authorization'] = `Splunk ${config.credentials.token}`;
        payload = events.map(e => JSON.stringify({ event: e, sourcetype: 'datacendia:audit' })).join('\n');
        break;

      case 'sentinel':
        // Azure Log Analytics format
        headers['Log-Type'] = 'DatacendiaAudit';
        headers['x-ms-date'] = new Date().toUTCString();
        payload = JSON.stringify(events);
        break;

      case 'qradar':
        // QRadar expects syslog/CEF format
        payload = events.map(e => this.toCEF(e)).join('\n');
        headers['Content-Type'] = 'text/plain';
        break;

      case 'elastic':
        // Elasticsearch bulk format
        payload = events.map(e => 
          JSON.stringify({ index: { _index: 'datacendia-audit' } }) + '\n' + JSON.stringify(e)
        ).join('\n') + '\n';
        break;

      default:
        // Generic webhook - JSON array
        payload = JSON.stringify(events);
    }

    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers,
      body: payload,
      signal: AbortSignal.timeout(30000),
    });

    if (!response.ok) {
      throw new Error(`SIEM delivery failed: ${response.status} ${response.statusText}`);
    }

    logger.info(`[SIEM] Delivered ${events.length} events to ${config.provider}`);

    return {
      success: true,
      provider: config.provider,
      eventsDelivered: events.length,
      timestamp: new Date(),
      responseCode: response.status,
    };
  }

  /**
   * Flush all buffers
   */
  private async flushAllBuffers(): Promise<void> {
    for (const configId of this.configs.keys()) {
      await this.flushBuffer(configId);
    }
  }

  /**
   * Test SIEM connection
   */
  async testConnection(configId: string): Promise<{ success: boolean; message: string; latencyMs?: number }> {
    const config = this.configs.get(configId);
    if (!config) {
      return { success: false, message: 'Configuration not found' };
    }

    const testEvent: SIEMEvent = {
      timestamp: new Date().toISOString(),
      severity: 'INFO',
      severityCode: 1,
      eventType: 'test.connection',
      organizationId: config.organizationId,
      resource: 'siem_test',
      action: 'Connection test',
      outcome: 'success',
      details: { test: true },
      datacendiaEventId: `test_${crypto.randomUUID()}`,
    };

    const startTime = Date.now();

    try {
      await this.deliverEvents(config, [testEvent]);
      const latencyMs = Date.now() - startTime;
      return {
        success: true,
        message: `Successfully connected to ${config.provider}`,
        latencyMs,
      };
    } catch (error) {
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  /**
   * Get delivery statistics
   */
  getDeliveryStats(organizationId?: string): {
    totalDelivered: number;
    totalFailed: number;
    byProvider: Record<SIEMProvider, { delivered: number; failed: number }>;
    recentDeliveries: DeliveryResult[];
  } {
    const relevant = organizationId
      ? this.deliveryLog.filter(d => {
          const config = Array.from(this.configs.values()).find(c => c.provider === d.provider);
          return config?.organizationId === organizationId;
        })
      : this.deliveryLog;

    const byProvider: Record<SIEMProvider, { delivered: number; failed: number }> = {
      splunk: { delivered: 0, failed: 0 },
      sentinel: { delivered: 0, failed: 0 },
      qradar: { delivered: 0, failed: 0 },
      elastic: { delivered: 0, failed: 0 },
      webhook: { delivered: 0, failed: 0 },
    };

    let totalDelivered = 0;
    let totalFailed = 0;

    for (const result of relevant) {
      if (result.success) {
        totalDelivered += result.eventsDelivered;
        byProvider[result.provider].delivered += result.eventsDelivered;
      } else {
        totalFailed++;
        byProvider[result.provider].failed++;
      }
    }

    return {
      totalDelivered,
      totalFailed,
      byProvider,
      recentDeliveries: relevant.slice(-20),
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'SIEMIntegration', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.configs.has(d.id)) this.configs.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'SIEMIntegration', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.eventBuffer.has(d.id)) this.eventBuffer.set(d.id, d);


      }


      restored += recs_1.length;


      const recs_2 = await loadServiceRecords({ serviceName: 'SIEMIntegration', recordType: 'record', limit: 1000 });


      for (const rec of recs_2) {


        const d = rec.data as any;


        if (d?.id && !this.flushTimers.has(d.id)) this.flushTimers.set(d.id, d);


      }


      restored += recs_2.length;


      if (restored > 0) logger.info(`[SIEMIntegrationService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[SIEMIntegrationService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Singleton instance
export const siemIntegration = new SIEMIntegrationService();
export default siemIntegration;
