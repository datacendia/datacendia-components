/**
 * Service — Webhook Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports webhookService, WebhookConfig, WebhookPayload, WebhookDelivery, WebhookEventType
 * @module services/webhook.service
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Webhook Service for Datacendia
 * 
 * Allows customers to receive real-time notifications on decisions,
 * alerts, anomalies, and other system events.
 */

import crypto from 'crypto';
import { persistServiceRecord, loadServiceRecords } from '../utils/servicePersistence.js';
import { logger } from '../utils/logger.js';

export interface WebhookConfig {
  id: string;
  url: string;
  events: WebhookEventType[];
  secret: string;
  isActive: boolean;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  lastTriggeredAt?: Date;
  failureCount: number;
  maxRetries: number;
}

export type WebhookEventType =
  | 'deliberation.started'
  | 'deliberation.completed'
  | 'deliberation.failed'
  | 'agent.response'
  | 'cross_examination.completed'
  | 'synthesis.completed'
  | 'decision.approved'
  | 'decision.vetoed'
  | 'alert.critical'
  | 'alert.warning'
  | 'anomaly.detected'
  | 'graph.updated'
  | 'user.intervention'
  | 'compliance.violation';

export interface WebhookPayload {
  id: string;
  event: WebhookEventType;
  timestamp: string;
  organizationId: string;
  data: Record<string, unknown>;
}

export interface WebhookDelivery {
  id: string;
  webhookId: string;
  event: WebhookEventType;
  payload: WebhookPayload;
  statusCode?: number;
  response?: string;
  deliveredAt: Date;
  success: boolean;
  attempts: number;
  nextRetryAt?: Date;
}

class WebhookService {
  private webhooks: Map<string, WebhookConfig> = new Map();
  private deliveryQueue: WebhookDelivery[] = [];
  private retryDelays = [1000, 5000, 30000, 60000, 300000];



  constructor() {


    this.loadFromDB().catch(() => {});


  }
 // 1s, 5s, 30s, 1m, 5m

  /**
   * Register a new webhook
   */
  async createWebhook(
    organizationId: string,
    url: string,
    events: WebhookEventType[]
  ): Promise<WebhookConfig> {
    const webhook: WebhookConfig = {
      id: `wh_${crypto.randomUUID()}`,
      url,
      events,
      secret: crypto.randomBytes(32).toString('hex'),
      isActive: true,
      organizationId,
      createdAt: new Date(),
      updatedAt: new Date(),
      failureCount: 0,
      maxRetries: 5,
    };

    this.webhooks.set(webhook.id, webhook);
    logger.info(`[Webhook] Created webhook ${webhook.id} for org ${organizationId}`);
    
    return webhook;
  }

  /**
   * Update webhook configuration
   */
  async updateWebhook(
    id: string,
    updates: Partial<Pick<WebhookConfig, 'url' | 'events' | 'isActive'>>
  ): Promise<WebhookConfig | null> {
    const webhook = this.webhooks.get(id);
    if (!webhook) return null;

    const updated = {
      ...webhook,
      ...updates,
      updatedAt: new Date(),
    };

    this.webhooks.set(id, updated);
    return updated;
  }

  /**
   * Delete a webhook
   */
  async deleteWebhook(id: string): Promise<boolean> {
    return this.webhooks.delete(id);
  }

  /**
   * Get all webhooks for an organization
   */
  async getWebhooks(organizationId: string): Promise<WebhookConfig[]> {
    return Array.from(this.webhooks.values())
      .filter(w => w.organizationId === organizationId);
  }

  /**
   * Trigger webhooks for a specific event
   */
  async trigger(
    organizationId: string,
    event: WebhookEventType,
    data: Record<string, unknown>
  ): Promise<void> {
    const webhooks = await this.getWebhooks(organizationId);
    const relevantWebhooks = webhooks.filter(
      w => w.isActive && w.events.includes(event)
    );

    if (relevantWebhooks.length === 0) {
      return;
    }

    const payload: WebhookPayload = {
      id: `evt_${crypto.randomUUID()}`,
      event,
      timestamp: new Date().toISOString(),
      organizationId,
      data,
    };

    logger.info(`[Webhook] Triggering ${event} for ${relevantWebhooks.length} webhooks`);

    for (const webhook of relevantWebhooks) {
      this.deliverWebhook(webhook, payload);
    }
  }

  /**
   * Deliver webhook with retry logic
   */
  private async deliverWebhook(
    webhook: WebhookConfig,
    payload: WebhookPayload,
    attempt: number = 1
  ): Promise<void> {
    const delivery: WebhookDelivery = {
      id: `del_${crypto.randomUUID()}`,
      webhookId: webhook.id,
      event: payload.event,
      payload,
      deliveredAt: new Date(),
      success: false,
      attempts: attempt,
    };

    try {
      const signature = this.generateSignature(payload, webhook.secret);
      
      const response = await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Datacendia-Signature': signature,
          'X-Datacendia-Event': payload.event,
          'X-Datacendia-Delivery': delivery.id,
          'X-Datacendia-Timestamp': payload.timestamp,
        },
        body: JSON.stringify(payload),
        signal: AbortSignal.timeout(30000), // 30s timeout
      });

      delivery.statusCode = response.status;
      delivery.response = await response.text().catch(() => '');
      delivery.success = response.ok;

      if (response.ok) {
        logger.info(`[Webhook] Successfully delivered ${payload.event} to ${webhook.url}`);
        webhook.lastTriggeredAt = new Date();
        webhook.failureCount = 0;
      } else {
        throw new Error(`HTTP ${response.status}: ${delivery.response}`);
      }
    } catch (error) {
      logger.error(`[Webhook] Delivery failed (attempt ${attempt}):`, error);
      
      webhook.failureCount++;
      
      // Retry with exponential backoff
      if (attempt < webhook.maxRetries) {
        const delay = this.retryDelays[Math.min(attempt - 1, this.retryDelays.length - 1)];
        delivery.nextRetryAt = new Date(Date.now() + delay);
        
        logger.info(`[Webhook] Scheduling retry in ${delay}ms`);
        setTimeout(() => {
          this.deliverWebhook(webhook, payload, attempt + 1);
        }, delay);
      } else {
        logger.error(`[Webhook] Max retries exceeded for ${webhook.id}`);
        
        // Disable webhook after too many failures
        if (webhook.failureCount >= 10) {
          webhook.isActive = false;
          logger.warn(`[Webhook] Disabled webhook ${webhook.id} due to repeated failures`);
        }
      }
    }

    this.deliveryQueue.push(delivery);
    
    // Keep only last 1000 deliveries in memory
    if (this.deliveryQueue.length > 1000) {
      this.deliveryQueue = this.deliveryQueue.slice(-1000);
    }
  }

  /**
   * Generate HMAC signature for payload verification
   */
  private generateSignature(payload: WebhookPayload, secret: string): string {
    const hmac = crypto.createHmac('sha256', secret);
    hmac.update(JSON.stringify(payload));
    return `sha256=${hmac.digest('hex')}`;
  }

  /**
   * Verify incoming webhook signature (for receiving webhooks)
   */
  verifySignature(
    payload: string,
    signature: string,
    secret: string
  ): boolean {
    const expectedSignature = `sha256=${crypto
      .createHmac('sha256', secret)
      .update(payload)
      .digest('hex')}`;
    
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  /**
   * Get recent deliveries for a webhook
   */
  async getDeliveries(webhookId: string, limit: number = 50): Promise<WebhookDelivery[]> {
    return this.deliveryQueue
      .filter(d => d.webhookId === webhookId)
      .slice(-limit)
      .reverse();
  }

  /**
   * Test webhook by sending a test event
   */
  async testWebhook(webhookId: string): Promise<WebhookDelivery | null> {
    const webhook = this.webhooks.get(webhookId);
    if (!webhook) return null;

    const testPayload: WebhookPayload = {
      id: `evt_test_${crypto.randomUUID()}`,
      event: 'deliberation.completed',
      timestamp: new Date().toISOString(),
      organizationId: webhook.organizationId,
      data: {
        test: true,
        message: 'This is a test webhook delivery from Datacendia',
      },
    };

    await this.deliverWebhook(webhook, testPayload);
    
    return this.deliveryQueue[this.deliveryQueue.length - 1];
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'Webhook', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.webhooks.has(d.id)) this.webhooks.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[WebhookService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[WebhookService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const webhookService = new WebhookService();
export default webhookService;
