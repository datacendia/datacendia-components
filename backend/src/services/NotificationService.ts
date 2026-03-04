/**
 * Service — Notification Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports NotificationService, notificationService, NotificationPayload, NotificationPreferences, NotificationType, NotificationChannel
 * @module services/NotificationService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// NOTIFICATION SERVICE
// Unified notification system for in-app, email, Slack, Teams, and webhooks
// =============================================================================

import crypto from 'crypto';
import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

// Types
export type NotificationType =
  | 'DELIBERATION_STARTED'
  | 'DELIBERATION_COMPLETE'
  | 'DECISION_MADE'
  | 'DISSENT_FILED'
  | 'APPROVAL_REQUIRED'
  | 'APPROVAL_GRANTED'
  | 'APPROVAL_DENIED'
  | 'ALERT_TRIGGERED'
  | 'SYSTEM_ANNOUNCEMENT'
  | 'SECURITY_ALERT'
  | 'MFA_ENABLED'
  | 'MFA_DISABLED';

export type NotificationChannel = 'IN_APP' | 'EMAIL' | 'SLACK' | 'TEAMS' | 'PUSH' | 'WEBHOOK';

export interface NotificationPayload {
  userId: string;
  organizationId: string;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  metadata?: Record<string, unknown>;
  channels?: NotificationChannel[];
}

export interface NotificationPreferences {
  email: boolean;
  inApp: boolean;
  push: boolean;
  slack: boolean;
  teams: boolean;
  webhook: boolean;
  webhookUrl?: string;
  slackChannel?: string;
  teamsChannel?: string;
}

interface NotificationRecord {
  id: string;
  user_id: string;
  organization_id: string;
  type: string;
  channel: string;
  title: string;
  message: string;
  link: string | null;
  metadata: unknown;
  read: boolean;
  read_at: Date | null;
  sent_at: Date | null;
  created_at: Date;
}

export class NotificationService {
  private emailService: EmailNotificationHandler;
  private slackService: SlackNotificationHandler;
  private teamsService: TeamsNotificationHandler;
  private webhookService: WebhookNotificationHandler;

  constructor() {
    this.emailService = new EmailNotificationHandler();
    this.slackService = new SlackNotificationHandler();
    this.teamsService = new TeamsNotificationHandler();
    this.webhookService = new WebhookNotificationHandler();
  }

  /**
   * Send a notification through configured channels
   */
  async send(payload: NotificationPayload): Promise<{ success: boolean; channels: string[] }> {
    const sentChannels: string[] = [];
    const channels = payload.channels || ['IN_APP'];

    // Get user preferences
    const preferences = await this.getUserPreferences(payload.userId);

    for (const channel of channels) {
      try {
        const sent = await this.sendToChannel(channel, payload, preferences);
        if (sent) {
          sentChannels.push(channel);
        }
      } catch (error) {
        logger.error(`Failed to send notification via ${channel}`, error);
      }
    }

    return { success: sentChannels.length > 0, channels: sentChannels };
  }

  /**
   * Send to a specific channel
   */
  private async sendToChannel(
    channel: NotificationChannel,
    payload: NotificationPayload,
    preferences: NotificationPreferences
  ): Promise<boolean> {
    switch (channel) {
      case 'IN_APP':
        if (!preferences.inApp) return false;
        return this.createInAppNotification(payload);

      case 'EMAIL':
        if (!preferences.email) return false;
        return this.emailService.send(payload);

      case 'SLACK':
        if (!preferences.slack) return false;
        return this.slackService.send(payload, preferences.slackChannel);

      case 'TEAMS':
        if (!preferences.teams) return false;
        return this.teamsService.send(payload, preferences.teamsChannel);

      case 'WEBHOOK':
        if (!preferences.webhook || !preferences.webhookUrl) return false;
        return this.webhookService.send(payload, preferences.webhookUrl);

      case 'PUSH':
        if (!preferences.push) return false;
        return this.sendPushNotification(payload);

      default:
        return false;
    }
  }

  /**
   * Create an in-app notification
   */
  private async createInAppNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      // Use raw query since model may not be generated yet
      await prisma.$executeRaw`
        INSERT INTO notifications (id, user_id, organization_id, type, channel, title, message, link, metadata, read, created_at)
        VALUES (${crypto.randomUUID()}, ${payload.userId}, ${payload.organizationId}, ${payload.type}, 'IN_APP', ${payload.title}, ${payload.message}, ${payload.link || null}, ${JSON.stringify(payload.metadata || {})}, false, NOW())
      `;
      return true;
    } catch (error) {
      logger.error('Failed to create in-app notification', error);
      return false;
    }
  }

  /**
   * Get user's notification preferences
   */
  async getUserPreferences(userId: string): Promise<NotificationPreferences> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { preferences: true },
      });

      if (user?.preferences && typeof user.preferences === 'object') {
        const prefs = user.preferences as Record<string, unknown>;
        const notifPrefs = prefs['notifications'] as NotificationPreferences | undefined;
        if (notifPrefs) {
          return notifPrefs;
        }
      }

      // Default preferences
      return {
        email: true,
        inApp: true,
        push: false,
        slack: false,
        teams: false,
        webhook: false,
      };
    } catch (error) {
      logger.error('Failed to get user preferences', error);
      return {
        email: true,
        inApp: true,
        push: false,
        slack: false,
        teams: false,
        webhook: false,
      };
    }
  }

  /**
   * Send a push notification via Web Push API.
   * Requires VAPID keys configured in environment.
   * Falls back to storing as in-app notification if push delivery fails.
   */
  private async sendPushNotification(payload: NotificationPayload): Promise<boolean> {
    try {
      // Store push notification record for retrieval by service worker
      await prisma.$executeRaw`
        INSERT INTO notifications (id, user_id, organization_id, type, channel, title, message, link, metadata, read, created_at)
        VALUES (${crypto.randomUUID()}, ${payload.userId}, ${payload.organizationId}, ${payload.type}, 'PUSH', ${payload.title}, ${payload.message}, ${payload.link || null}, ${JSON.stringify(payload.metadata || {})}, false, NOW())
      `;

      // If Web Push VAPID keys are configured, attempt real push delivery
      const vapidPublicKey = process.env['VAPID_PUBLIC_KEY'];
      const vapidPrivateKey = process.env['VAPID_PRIVATE_KEY'];

      if (vapidPublicKey && vapidPrivateKey) {
        // Retrieve user's push subscription from DB
        const subscriptions = await prisma.$queryRaw<Array<{ endpoint: string; keys: string }>>`
          SELECT endpoint, keys FROM push_subscriptions 
          WHERE user_id = ${payload.userId} AND active = true
        `;

        for (const sub of subscriptions) {
          try {
            const pushPayload = JSON.stringify({
              title: payload.title,
              body: payload.message,
              icon: '/icons/datacendia-192.png',
              badge: '/icons/datacendia-badge.png',
              data: { url: payload.link, type: payload.type, ...payload.metadata },
            });

            // Use Web Push protocol (RFC 8030) via fetch
            const keys = JSON.parse(sub.keys);
            await fetch(sub.endpoint, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'TTL': '86400',
              },
              body: pushPayload,
            });
          } catch (pushErr) {
            logger.warn(`Push delivery failed for endpoint ${sub.endpoint}:`, pushErr);
          }
        }
      }

      return true;
    } catch (error) {
      logger.error('Failed to send push notification', error);
      return false;
    }
  }

  /**
   * Update user's notification preferences
   */
  async updateUserPreferences(userId: string, preferences: Partial<NotificationPreferences>): Promise<boolean> {
    try {
      const user = await prisma.users.findUnique({
        where: { id: userId },
        select: { preferences: true },
      });

      const currentPrefs = (user?.preferences as Record<string, unknown>) || {};
      const currentNotifPrefs = (currentPrefs['notifications'] as NotificationPreferences) || {};
      
      const newPrefs = {
        ...currentPrefs,
        notifications: { ...currentNotifPrefs, ...preferences },
      };

      await prisma.users.update({
        where: { id: userId },
        data: { preferences: newPrefs, updated_at: new Date() },
      });

      return true;
    } catch (error) {
      logger.error('Failed to update user preferences', error);
      return false;
    }
  }

  /**
   * Get unread notifications for a user
   */
  async getUnread(userId: string, limit: number = 50): Promise<NotificationRecord[]> {
    try {
      const notifications = await prisma.$queryRaw<NotificationRecord[]>`
        SELECT * FROM notifications 
        WHERE user_id = ${userId} AND read = false 
        ORDER BY created_at DESC 
        LIMIT ${limit}
      `;
      return notifications;
    } catch (error) {
      logger.error('Failed to get unread notifications', error);
      return [];
    }
  }

  /**
   * Get all notifications for a user
   */
  async getAll(userId: string, limit: number = 100, offset: number = 0): Promise<NotificationRecord[]> {
    try {
      const notifications = await prisma.$queryRaw<NotificationRecord[]>`
        SELECT * FROM notifications 
        WHERE user_id = ${userId} 
        ORDER BY created_at DESC 
        LIMIT ${limit} OFFSET ${offset}
      `;
      return notifications;
    } catch (error) {
      logger.error('Failed to get notifications', error);
      return [];
    }
  }

  /**
   * Mark notification as read
   */
  async markAsRead(notificationId: string, userId: string): Promise<boolean> {
    try {
      await prisma.$executeRaw`
        UPDATE notifications 
        SET read = true, read_at = NOW() 
        WHERE id = ${notificationId} AND user_id = ${userId}
      `;
      return true;
    } catch (error) {
      logger.error('Failed to mark notification as read', error);
      return false;
    }
  }

  /**
   * Mark all notifications as read for a user
   */
  async markAllAsRead(userId: string): Promise<boolean> {
    try {
      await prisma.$executeRaw`
        UPDATE notifications 
        SET read = true, read_at = NOW() 
        WHERE user_id = ${userId} AND read = false
      `;
      return true;
    } catch (error) {
      logger.error('Failed to mark all notifications as read', error);
      return false;
    }
  }

  /**
   * Get unread count for a user
   */
  async getUnreadCount(userId: string): Promise<number> {
    try {
      const result = await prisma.$queryRaw<[{ count: bigint }]>`
        SELECT COUNT(*) as count FROM notifications 
        WHERE user_id = ${userId} AND read = false
      `;
      return Number(result[0]?.count || 0);
    } catch (error) {
      logger.error('Failed to get unread count', error);
      return 0;
    }
  }

  /**
   * Delete old notifications (cleanup job)
   */
  async cleanup(daysOld: number = 90): Promise<number> {
    try {
      const result = await prisma.$executeRaw`
        DELETE FROM notifications 
        WHERE created_at < NOW() - INTERVAL '${daysOld} days' AND read = true
      `;
      return result;
    } catch (error) {
      logger.error('Failed to cleanup old notifications', error);
      return 0;
    }
  }

  /**
   * Send notification to all users in an organization
   */
  async broadcast(
    organizationId: string,
    type: NotificationType,
    title: string,
    message: string,
    link?: string
  ): Promise<{ success: boolean; count: number }> {
    try {
      const users = await prisma.users.findMany({
        where: { organization_id: organizationId, status: 'ACTIVE' },
        select: { id: true },
      });

      let count = 0;
      for (const user of users) {
        const payload: NotificationPayload = {
          userId: user.id,
          organizationId,
          type,
          title,
          message,
          channels: ['IN_APP'],
        };
        if (link) {
          payload.link = link;
        }
        const result = await this.send(payload);
        if (result.success) count++;
      }

      return { success: true, count };
    } catch (error) {
      logger.error('Failed to broadcast notification', error);
      return { success: false, count: 0 };
    }
  }
}

// =============================================================================
// CHANNEL HANDLERS
// =============================================================================

class EmailNotificationHandler {
  async send(payload: NotificationPayload): Promise<boolean> {
    try {
      // Get user email
      const user = await prisma.users.findUnique({
        where: { id: payload.userId },
        select: { email: true, name: true },
      });

      if (!user?.email) return false;

      // Use nodemailer if configured
      const smtpHost = process.env['SMTP_HOST'];
      if (!smtpHost) {
        logger.info('SMTP not configured, skipping email notification');
        return false;
      }

      // Import nodemailer dynamically
      const nodemailer = await import('nodemailer');
      
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: parseInt(process.env['SMTP_PORT'] || '587'),
        secure: process.env['SMTP_SECURE'] === 'true',
        auth: {
          user: process.env['SMTP_USER'],
          pass: process.env['SMTP_PASSWORD'],
        },
      });

      await transporter.sendMail({
        from: process.env['SMTP_FROM'] || 'noreply@datacendia.com',
        to: user.email,
        subject: payload.title,
        html: this.buildEmailHtml(payload, user.name),
      });

      return true;
    } catch (error) {
      logger.error('Failed to send email notification', error);
      return false;
    }
  }

  private buildEmailHtml(payload: NotificationPayload, userName: string): string {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: #1a1a2e; color: white; padding: 20px; text-align: center; }
          .content { padding: 20px; background: #f9f9f9; }
          .button { display: inline-block; padding: 10px 20px; background: #6366f1; color: white; text-decoration: none; border-radius: 5px; }
          .footer { padding: 20px; text-align: center; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Datacendia</h1>
          </div>
          <div class="content">
            <p>Hi ${userName},</p>
            <h2>${payload.title}</h2>
            <p>${payload.message}</p>
            ${payload.link ? `<p><a href="${payload.link}" class="button">View Details</a></p>` : ''}
          </div>
          <div class="footer">
            <p>This is an automated notification from Datacendia.</p>
            <p>You can manage your notification preferences in your account settings.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

class SlackNotificationHandler {
  async send(payload: NotificationPayload, channel?: string): Promise<boolean> {
    try {
      const webhookUrl = process.env['SLACK_WEBHOOK_URL'];
      if (!webhookUrl) {
        logger.info('Slack webhook not configured');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          channel: channel || '#notifications',
          username: 'Datacendia',
          icon_emoji: ':brain:',
          blocks: [
            {
              type: 'header',
              text: { type: 'plain_text', text: payload.title },
            },
            {
              type: 'section',
              text: { type: 'mrkdwn', text: payload.message },
            },
            ...(payload.link
              ? [
                  {
                    type: 'actions',
                    elements: [
                      {
                        type: 'button',
                        text: { type: 'plain_text', text: 'View Details' },
                        url: payload.link,
                      },
                    ],
                  },
                ]
              : []),
          ],
        }),
      });

      return response.ok;
    } catch (error) {
      logger.error('Failed to send Slack notification', error);
      return false;
    }
  }
}

class TeamsNotificationHandler {
  async send(payload: NotificationPayload, channel?: string): Promise<boolean> {
    try {
      const webhookUrl = process.env['TEAMS_WEBHOOK_URL'] || channel;
      if (!webhookUrl) {
        logger.info('Teams webhook not configured');
        return false;
      }

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          '@type': 'MessageCard',
          '@context': 'http://schema.org/extensions',
          themeColor: '6366f1',
          summary: payload.title,
          sections: [
            {
              activityTitle: payload.title,
              activitySubtitle: 'Datacendia Notification',
              activityImage: 'https://datacendia.com/logo.png',
              text: payload.message,
            },
          ],
          potentialAction: payload.link
            ? [
                {
                  '@type': 'OpenUri',
                  name: 'View Details',
                  targets: [{ os: 'default', uri: payload.link }],
                },
              ]
            : [],
        }),
      });

      return response.ok;
    } catch (error) {
      logger.error('Failed to send Teams notification', error);
      return false;
    }
  }
}

class WebhookNotificationHandler {
  async send(payload: NotificationPayload, webhookUrl: string): Promise<boolean> {
    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'X-Datacendia-Event': payload.type,
        },
        body: JSON.stringify({
          event: payload.type,
          title: payload.title,
          message: payload.message,
          link: payload.link,
          metadata: payload.metadata,
          timestamp: new Date().toISOString(),
        }),
      });

      return response.ok;
    } catch (error) {
      logger.error('Failed to send webhook notification', error);
      return false;
    }
  }
}

// Singleton instance
export const notificationService = new NotificationService();
