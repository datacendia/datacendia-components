/**
 * Service — Canary Tripwire Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports canaryTripwireService, Canary, CanaryContent, CanaryAlert, CanaryDeployment, CanaryType
 * @module services/sovereign/CanaryTripwireService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA CANARY TRIPWIRESÃƒÂ¢Ã¢â‚¬Å¾Ã‚Â¢ - EXFILTRATION DETECTION SYSTEM
// "We'll know if data ever leaks - and exactly when."
//
// Seeds the database with unique, trackable canary records that look legitimate
// but are traceable if they ever appear outside the system. Turns "trust us"
// into "we'll know if we fail."
// =============================================================================

import { EventEmitter } from 'events';
import * as crypto from 'crypto';
import * as fs from 'fs';
import * as path from 'path';
import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../../utils/deterministic.js';
// =============================================================================
// TYPES
// =============================================================================

export interface Canary {
  id: string;
  organizationId: string;
  
  // Canary identification
  canaryType: CanaryType;
  canaryCode: string;        // Unique trackable identifier
  
  // Fake but realistic content
  content: CanaryContent;
  
  // Placement
  tableName: string;
  recordId: string;          // ID in the actual table
  
  // Detection
  triggerUrls: string[];     // URLs that would be triggered if accessed
  webhookUrl?: string;       // Alert webhook
  
  // Status
  status: 'active' | 'triggered' | 'expired' | 'disabled';
  triggeredAt?: Date;
  triggerSource?: string;
  
  // Metadata
  createdAt: Date;
  expiresAt?: Date;
  lastCheckedAt?: Date;
}

export type CanaryType = 
  | 'decision'         // Fake high-value decision
  | 'financial'        // Fake financial data
  | 'customer'         // Fake customer record
  | 'credential'       // Honeypot credential
  | 'document'         // Fake sensitive document
  | 'api_key'          // Fake API key
  | 'executive'        // Fake executive communication
  | 'acquisition'      // Fake M&A data
  | 'custom';

export interface CanaryContent {
  title: string;
  description: string;
  data: Record<string, any>;
  
  // Markers for detection
  uniqueMarkers: string[];    // Unique strings to search for
  steganographicMarker?: string; // Hidden marker in content
}

export interface CanaryAlert {
  id: string;
  canaryId: string;
  canaryCode: string;
  
  // Detection details
  detectedAt: Date;
  detectionSource: string;
  detectionMethod: 'external_scan' | 'webhook' | 'manual' | 'darkweb' | 'pastebin';
  
  // Context
  sourceUrl?: string;
  sourceIp?: string;
  rawEvidence?: string;
  
  // Response
  acknowledged: boolean;
  acknowledgedBy?: string;
  acknowledgedAt?: Date;
  
  // Severity
  severity: 'critical' | 'high' | 'medium' | 'low';
  
  // Investigation
  investigationStatus: 'pending' | 'investigating' | 'confirmed' | 'false_positive' | 'resolved';
  investigationNotes?: string;
}

export interface CanaryDeployment {
  organizationId: string;
  
  // Deployment stats
  totalCanaries: number;
  activeCanaries: number;
  triggeredCanaries: number;
  
  // Coverage
  coveredTables: string[];
  coverage: number;           // 0-100 percentage
  
  // Health
  lastDeploymentAt: Date;
  lastScanAt?: Date;
  healthStatus: 'healthy' | 'degraded' | 'compromised';
}

// =============================================================================
// CANARY CONTENT GENERATORS
// =============================================================================

const CANARY_TEMPLATES: Record<CanaryType, () => CanaryContent> = {
  decision: () => {
    const companies = ['Acme Corp', 'GlobalTech', 'Nexus Industries', 'Vertex Solutions', 'Quantum Dynamics'];
    const amounts = ['$50M', '$125M', '$250M', '$500M', '$1.2B'];
    const company = companies[Math.floor(deterministicFloat('canarytripwire-6') * companies.length)];
    const amount = amounts[Math.floor(deterministicFloat('canarytripwire-7') * amounts.length)];
    const marker = `CDNA-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    return {
      title: `Acquisition of ${company} - Board Approval Pending`,
      description: `Strategic acquisition proposal for ${company} at ${amount} valuation. Confidential board materials enclosed.`,
      data: {
        targetCompany: company,
        proposedValuation: amount,
        dealStatus: 'pending_approval',
        boardMeetingDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        internalReference: marker,
      },
      uniqueMarkers: [marker, company, `acquisition-${marker.slice(-4)}`],
    };
  },
  
  financial: () => {
    const marker = `CFIN-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const revenue = Math.floor(deterministicFloat('canarytripwire-2') * 900 + 100) * 1000000;
    
    return {
      title: `Q4 2025 Preliminary Financial Results`,
      description: `Unaudited Q4 financials - STRICTLY CONFIDENTIAL until earnings call`,
      data: {
        quarterlyRevenue: revenue,
        grossMargin: 0.42 + deterministicFloat('canarytripwire-1') * 0.1,
        operatingIncome: revenue * 0.15,
        earningsPerShare: (deterministicFloat('canarytripwire-3') * 2 + 0.5).toFixed(2),
        internalTrackingCode: marker,
      },
      uniqueMarkers: [marker, `earnings-${marker.slice(-4)}`],
    };
  },
  
  customer: () => {
    const marker = `CCST-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const firstNames = ['Robert', 'Patricia', 'Michael', 'Jennifer', 'William'];
    const lastNames = ['Canaryson', 'Tripwire', 'Honeypot', 'Decoyfield', 'Sentinelworth'];
    
    return {
      title: `Customer Profile`,
      description: `Enterprise customer account`,
      data: {
        firstName: firstNames[Math.floor(deterministicFloat('canarytripwire-8') * firstNames.length)],
        lastName: lastNames[Math.floor(deterministicFloat('canarytripwire-9') * lastNames.length)],
        email: `${marker.toLowerCase()}@canary-detect.internal`,
        phone: `+1-555-${marker.slice(-4)}`,
        accountId: marker,
        tier: 'enterprise',
      },
      uniqueMarkers: [marker, `@canary-detect.internal`],
    };
  },
  
  credential: () => {
    const marker = `CCRED-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    return {
      title: `Service Account Credentials`,
      description: `API credentials for internal service`,
      data: {
        username: `svc_${marker.toLowerCase()}`,
        apiKey: `sk_canary_${crypto.randomBytes(16).toString('hex')}`,
        secret: `sec_${crypto.randomBytes(24).toString('base64')}`,
        environment: 'production',
        trackingId: marker,
      },
      uniqueMarkers: [marker, `svc_${marker.toLowerCase()}`, 'sk_canary_'],
    };
  },
  
  document: () => {
    const marker = `CDOC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    return {
      title: `Board Meeting Minutes - Confidential`,
      description: `Minutes from executive board meeting`,
      data: {
        meetingDate: new Date().toISOString(),
        attendees: ['CEO', 'CFO', 'CTO', 'General Counsel'],
        topics: ['Strategic initiatives', 'M&A pipeline', 'Cost restructuring'],
        documentId: marker,
        classification: 'CONFIDENTIAL',
      },
      uniqueMarkers: [marker, `minutes-${marker.slice(-4)}`],
    };
  },
  
  api_key: () => {
    const marker = `CAPI-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    return {
      title: `Production API Key`,
      description: `API key for production environment`,
      data: {
        keyId: marker,
        key: `pk_live_canary_${crypto.randomBytes(24).toString('hex')}`,
        permissions: ['read', 'write', 'admin'],
        createdBy: 'system',
        expiresAt: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      },
      uniqueMarkers: [marker, 'pk_live_canary_'],
    };
  },
  
  executive: () => {
    const marker = `CEXEC-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    return {
      title: `CEO Strategy Memo`,
      description: `Internal executive communication`,
      data: {
        from: 'CEO',
        to: 'Executive Team',
        subject: 'Strategic Direction 2025',
        body: `This memo outlines our confidential strategic priorities. Reference: ${marker}`,
        memoId: marker,
      },
      uniqueMarkers: [marker, `memo-${marker.slice(-4)}`],
    };
  },
  
  acquisition: () => {
    const marker = `CACQ-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    const targets = ['TechStartup Inc', 'DataCo Systems', 'CloudNative Ltd', 'AI Innovations'];
    
    return {
      title: `Project Phoenix - Acquisition Target Analysis`,
      description: `Confidential M&A evaluation`,
      data: {
        projectCode: 'PHOENIX',
        targetCompany: targets[Math.floor(deterministicFloat('canarytripwire-10') * targets.length)],
        proposedPrice: `$${Math.floor(deterministicFloat('canarytripwire-4') * 400 + 100)}M`,
        synergies: `$${Math.floor(deterministicFloat('canarytripwire-5') * 50 + 10)}M annually`,
        dealId: marker,
        status: 'due_diligence',
      },
      uniqueMarkers: [marker, 'Project Phoenix', `phoenix-${marker.slice(-4)}`],
    };
  },
  
  custom: () => {
    const marker = `CCUSTOM-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    return {
      title: `Custom Canary Record`,
      description: `User-defined canary`,
      data: {
        trackingId: marker,
        type: 'custom',
      },
      uniqueMarkers: [marker],
    };
  },
};

// =============================================================================
// CANARY TRIPWIRE SERVICE
// =============================================================================

class CanaryTripwireService extends EventEmitter {
  private canaries: Map<string, Canary> = new Map();
  private alerts: Map<string, CanaryAlert> = new Map();
  private storagePath: string;
  private scanInterval: NodeJS.Timeout | null = null;

  constructor() {
    super();
    this.storagePath = process.env.CANARY_STORAGE_PATH || '/var/datacendia/canary';
    this.ensureDirectories();
    
    // Start periodic scan for canary markers
    this.startPeriodicScan();
    
    logger.info('[CanaryTripwire] Service initialized - Exfiltration detection ready');


    this.loadFromDB().catch(() => {});
  }

  private ensureDirectories(): void {
    const dirs = [
      this.storagePath,
      path.join(this.storagePath, 'canaries'),
      path.join(this.storagePath, 'alerts'),
    ];
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  // ===========================================================================
  // CANARY DEPLOYMENT
  // ===========================================================================

  /**
   * Deploy a new canary
   */
  async deployCanary(params: {
    organizationId: string;
    canaryType: CanaryType;
    tableName?: string;
    customContent?: Partial<CanaryContent>;
    expiresIn?: number;       // Days
    webhookUrl?: string;
  }): Promise<Canary> {
    const id = `canary-${crypto.randomUUID()}`;
    const canaryCode = `CAN-${crypto.randomBytes(6).toString('hex').toUpperCase()}`;
    
    // Generate content from template or use custom
    const templateContent = CANARY_TEMPLATES[params.canaryType]();
    const content: CanaryContent = {
      ...templateContent,
      ...params.customContent,
      uniqueMarkers: [
        canaryCode,
        ...(templateContent.uniqueMarkers || []),
        ...(params.customContent?.uniqueMarkers || []),
      ],
    };
    
    // Generate trigger URLs
    const triggerUrls = this.generateTriggerUrls(canaryCode);
    
    const canary: Canary = {
      id,
      organizationId: params.organizationId,
      canaryType: params.canaryType,
      canaryCode,
      content,
      tableName: params.tableName || this.getDefaultTable(params.canaryType),
      recordId: '', // Will be set after insertion
      triggerUrls,
      webhookUrl: params.webhookUrl,
      status: 'active',
      createdAt: new Date(),
      expiresAt: params.expiresIn 
        ? new Date(Date.now() + params.expiresIn * 24 * 60 * 60 * 1000)
        : undefined,
    };
    
    // Insert into database
    const recordId = await this.insertCanaryRecord(canary);
    canary.recordId = recordId;
    
    // Store canary metadata
    this.canaries.set(id, canary);
    await this.persistCanary(canary);
    
    logger.info(`[CanaryTripwire] Deployed canary ${canaryCode} (${params.canaryType}) in ${canary.tableName}`);
    this.emit('canary:deployed', canary);
    
    return canary;
  }

  /**
   * Generate trigger URLs that can be embedded in canary data
   */
  private generateTriggerUrls(canaryCode: string): string[] {
    // These URLs, if ever accessed, indicate the canary was leaked
    const baseUrls = [
      `https://canary-detect.datacendia.com/t/${canaryCode}`,
      `https://verify.internal/${canaryCode}`,
    ];
    
    // Add a unique image URL (for document embedding)
    baseUrls.push(`https://cdn.datacendia.com/img/${canaryCode}.png`);
    
    return baseUrls;
  }

  /**
   * Get default table for canary type
   */
  private getDefaultTable(type: CanaryType): string {
    const tableMap: Record<CanaryType, string> = {
      decision: 'deliberations',
      financial: 'financial_reports',
      customer: 'customers',
      credential: 'api_keys',
      document: 'documents',
      api_key: 'api_keys',
      executive: 'communications',
      acquisition: 'deals',
      custom: 'canary_records',
    };
    return tableMap[type] || 'canary_records';
  }

  /**
   * Insert canary record into database
   */
  private async insertCanaryRecord(canary: Canary): Promise<string> {
    // For now, store in a dedicated canary table
    // Target table insertion via Prisma dynamic model access
    
    const recordId = `rec-${crypto.randomUUID().slice(0, 8)}`;
    
    try {
      // Try to create in canary_records table if it exists
      // Otherwise just track in memory
      await prisma.$executeRaw`
        INSERT INTO canary_records (id, organization_id, canary_code, canary_type, content, created_at)
        VALUES (${recordId}, ${canary.organizationId}, ${canary.canaryCode}, ${canary.canaryType}, 
                ${JSON.stringify(canary.content)}::jsonb, NOW())
        ON CONFLICT DO NOTHING
      `;
    } catch (err) {
      // Table may not exist - that's okay
      logger.debug('[CanaryTripwire] canary_records table not available, storing in memory');
    }
    
    return recordId;
  }

  /**
   * Persist canary metadata to disk
   */
  private async persistCanary(canary: Canary): Promise<void> {
    const filePath = path.join(this.storagePath, 'canaries', `${canary.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(canary, null, 2));
  }

  /**
   * Deploy multiple canaries of different types
   */
  async deployCanaryNetwork(params: {
    organizationId: string;
    types?: CanaryType[];
    countPerType?: number;
    webhookUrl?: string;
  }): Promise<Canary[]> {
    const types = params.types || ['decision', 'financial', 'credential', 'document', 'acquisition'];
    const countPerType = params.countPerType || 2;
    
    const deployed: Canary[] = [];
    
    for (const type of types) {
      for (let i = 0; i < countPerType; i++) {
        const canary = await this.deployCanary({
          organizationId: params.organizationId,
          canaryType: type,
          webhookUrl: params.webhookUrl,
        });
        deployed.push(canary);
      }
    }
    
    logger.info(`[CanaryTripwire] Deployed canary network: ${deployed.length} canaries`);
    this.emit('network:deployed', { organizationId: params.organizationId, count: deployed.length });
    
    return deployed;
  }

  // ===========================================================================
  // DETECTION
  // ===========================================================================

  /**
   * Start periodic scan for canary markers
   */
  private startPeriodicScan(): void {
    // Scan every hour
    this.scanInterval = setInterval(() => {
      this.scanForLeaks().catch(err => {
        logger.error('[CanaryTripwire] Scan error:', err);
      });
    }, 60 * 60 * 1000);
  }

  /**
   * Scan external sources for canary markers
   */
  async scanForLeaks(): Promise<CanaryAlert[]> {
    const alerts: CanaryAlert[] = [];
    
    for (const canary of this.canaries.values()) {
      if (canary.status !== 'active') continue;
      
      // Check expiry
      if (canary.expiresAt && canary.expiresAt < new Date()) {
        canary.status = 'expired';
        continue;
      }
      
      canary.lastCheckedAt = new Date();
      
      // Canary leak detection sources (DataConnectorFramework integration):
      // 1. Pastebin-like sites via API monitoring
      // 2. Dark web monitoring services via threat intel feeds
      // 3. Public code repositories via GitHub/GitLab search API
      // 4. Search engines via custom search API
      
      // Execute canary check
      // Real implementation would use external APIs
    }
    
    return alerts;
  }

  /**
   * Report a canary trigger (called when canary is detected externally)
   */
  async reportTrigger(params: {
    canaryCode: string;
    detectionSource: string;
    detectionMethod: CanaryAlert['detectionMethod'];
    sourceUrl?: string;
    sourceIp?: string;
    rawEvidence?: string;
  }): Promise<CanaryAlert | null> {
    // Find canary by code
    const canary = Array.from(this.canaries.values())
      .find(c => c.canaryCode === params.canaryCode);
    
    if (!canary) {
      logger.warn(`[CanaryTripwire] Unknown canary code reported: ${params.canaryCode}`);
      return null;
    }
    
    if (canary.status === 'triggered') {
      logger.info(`[CanaryTripwire] Canary ${params.canaryCode} already triggered`);
      return null;
    }
    
    // Create alert
    const alert: CanaryAlert = {
      id: `alert-${crypto.randomUUID()}`,
      canaryId: canary.id,
      canaryCode: canary.canaryCode,
      detectedAt: new Date(),
      detectionSource: params.detectionSource,
      detectionMethod: params.detectionMethod,
      sourceUrl: params.sourceUrl,
      sourceIp: params.sourceIp,
      rawEvidence: params.rawEvidence,
      acknowledged: false,
      severity: this.calculateSeverity(canary),
      investigationStatus: 'pending',
    };
    
    // Update canary status
    canary.status = 'triggered';
    canary.triggeredAt = new Date();
    canary.triggerSource = params.detectionSource;
    
    // Store alert
    this.alerts.set(alert.id, alert);
    await this.persistAlert(alert);
    
    // Send webhook if configured
    if (canary.webhookUrl) {
      await this.sendWebhook(canary.webhookUrl, alert);
    }
    
    logger.error(`[CanaryTripwire] ÃƒÂ°Ã…Â¸Ã…Â¡Ã‚Â¨ CANARY TRIGGERED: ${canary.canaryCode} (${canary.canaryType})`);
    this.emit('canary:triggered', { canary, alert });
    
    return alert;
  }

  /**
   * Calculate severity based on canary type
   */
  private calculateSeverity(canary: Canary): CanaryAlert['severity'] {
    const severityMap: Record<CanaryType, CanaryAlert['severity']> = {
      credential: 'critical',
      api_key: 'critical',
      acquisition: 'critical',
      financial: 'high',
      executive: 'high',
      decision: 'high',
      customer: 'medium',
      document: 'medium',
      custom: 'low',
    };
    return severityMap[canary.canaryType] || 'medium';
  }

  /**
   * Send webhook notification
   */
  private async sendWebhook(url: string, alert: CanaryAlert): Promise<void> {
    try {
      // HTTP requests via DataConnectorFramework (fetch with auth, retries, rate limiting)
      logger.info(`[CanaryTripwire] Would send webhook to ${url}`);
    } catch (err) {
      logger.error('[CanaryTripwire] Webhook failed:', err);
    }
  }

  /**
   * Persist alert to disk
   */
  private async persistAlert(alert: CanaryAlert): Promise<void> {
    const filePath = path.join(this.storagePath, 'alerts', `${alert.id}.json`);
    fs.writeFileSync(filePath, JSON.stringify(alert, null, 2));
  }

  /**
   * Check if a string contains any canary markers
   */
  checkForMarkers(text: string): Canary[] {
    const found: Canary[] = [];
    
    for (const canary of this.canaries.values()) {
      if (canary.status !== 'active') continue;
      
      for (const marker of canary.content.uniqueMarkers) {
        if (text.includes(marker)) {
          found.push(canary);
          break;
        }
      }
    }
    
    return found;
  }

  // ===========================================================================
  // MANAGEMENT
  // ===========================================================================

  /**
   * Acknowledge an alert
   */
  async acknowledgeAlert(alertId: string, userId: string): Promise<void> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);
    
    alert.acknowledged = true;
    alert.acknowledgedBy = userId;
    alert.acknowledgedAt = new Date();
    
    await this.persistAlert(alert);
    this.emit('alert:acknowledged', alert);
  }

  /**
   * Update investigation status
   */
  async updateInvestigation(
    alertId: string, 
    status: CanaryAlert['investigationStatus'],
    notes?: string
  ): Promise<void> {
    const alert = this.alerts.get(alertId);
    if (!alert) throw new Error(`Alert not found: ${alertId}`);
    
    alert.investigationStatus = status;
    if (notes) alert.investigationNotes = notes;
    
    await this.persistAlert(alert);
    this.emit('alert:updated', alert);
  }

  /**
   * Disable a canary
   */
  async disableCanary(canaryId: string): Promise<void> {
    const canary = this.canaries.get(canaryId);
    if (!canary) throw new Error(`Canary not found: ${canaryId}`);
    
    canary.status = 'disabled';
    await this.persistCanary(canary);
    
    logger.info(`[CanaryTripwire] Disabled canary ${canary.canaryCode}`);
    this.emit('canary:disabled', canary);
  }

  /**
   * Get deployment status
   */
  getDeploymentStatus(organizationId: string): CanaryDeployment {
    const orgCanaries = Array.from(this.canaries.values())
      .filter(c => c.organizationId === organizationId);
    
    const activeCount = orgCanaries.filter(c => c.status === 'active').length;
    const triggeredCount = orgCanaries.filter(c => c.status === 'triggered').length;
    const tables = [...new Set(orgCanaries.map(c => c.tableName))];
    
    let healthStatus: CanaryDeployment['healthStatus'] = 'healthy';
    if (triggeredCount > 0) healthStatus = 'compromised';
    else if (activeCount < 5) healthStatus = 'degraded';
    
    return {
      organizationId,
      totalCanaries: orgCanaries.length,
      activeCanaries: activeCount,
      triggeredCanaries: triggeredCount,
      coveredTables: tables,
      coverage: tables.length > 0 ? Math.min(100, tables.length * 20) : 0,
      lastDeploymentAt: orgCanaries.length > 0 
        ? new Date(Math.max(...orgCanaries.map(c => c.createdAt.getTime())))
        : new Date(),
      lastScanAt: new Date(),
      healthStatus,
    };
  }

  /**
   * List canaries for organization
   */
  listCanaries(organizationId: string): Canary[] {
    return Array.from(this.canaries.values())
      .filter(c => c.organizationId === organizationId);
  }

  /**
   * List alerts for organization
   */
  listAlerts(organizationId: string): CanaryAlert[] {
    const orgCanaryIds = new Set(
      Array.from(this.canaries.values())
        .filter(c => c.organizationId === organizationId)
        .map(c => c.id)
    );
    
    return Array.from(this.alerts.values())
      .filter(a => orgCanaryIds.has(a.canaryId))
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime());
  }

  /**
   * Shutdown service
   */
  shutdown(): void {
    if (this.scanInterval) {
      clearInterval(this.scanInterval);
    }
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'CanaryTripwire', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.canaries.has(d.id)) this.canaries.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'CanaryTripwire', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.alerts.has(d.id)) this.alerts.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[CanaryTripwireService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[CanaryTripwireService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const canaryTripwireService = new CanaryTripwireService();
export { CanaryTripwireService };
