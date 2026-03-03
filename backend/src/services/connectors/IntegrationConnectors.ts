// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module services/connectors/IntegrationConnectors
 * @description Enterprise integration connectors for Slack, Microsoft Teams, and JIRA.
 * Sends decision notifications, deliberation summaries, and compliance alerts
 * to external collaboration tools via webhooks and APIs.
 * 
 * Configuration:
 *   SLACK_WEBHOOK_URL — Slack incoming webhook URL
 *   TEAMS_WEBHOOK_URL — Microsoft Teams incoming webhook URL
 *   JIRA_BASE_URL — JIRA instance URL (e.g., https://yourorg.atlassian.net)
 *   JIRA_API_TOKEN — JIRA API token
 *   JIRA_USER_EMAIL — JIRA user email for API auth
 *   JIRA_PROJECT_KEY — Default JIRA project key for decision tickets
 */

import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES
// =============================================================================

export interface IntegrationMessage {
  title: string;
  body: string;
  severity?: 'info' | 'warning' | 'critical';
  fields?: Array<{ label: string; value: string }>;
  link?: { url: string; text: string };
  decisionId?: string;
  deliberationId?: string;
}

export interface JiraTicket {
  summary: string;
  description: string;
  issueType?: string;
  priority?: string;
  labels?: string[];
  customFields?: Record<string, any>;
}

export interface IntegrationStatus {
  slack: { configured: boolean; lastSent?: Date; error?: string };
  teams: { configured: boolean; lastSent?: Date; error?: string };
  jira: { configured: boolean; lastSent?: Date; error?: string };
}

// =============================================================================
// SLACK CONNECTOR
// =============================================================================

const SLACK_WEBHOOK = process.env['SLACK_WEBHOOK_URL'] || '';

/**
 * Send a message to Slack via incoming webhook.
 * Formats as a rich Block Kit message with gold branding.
 */
export async function sendSlackNotification(msg: IntegrationMessage): Promise<boolean> {
  if (!SLACK_WEBHOOK) {
    logger.warn('[Slack] SLACK_WEBHOOK_URL not configured — notification skipped');
    return false;
  }

  const colorMap = { info: '#b89950', warning: '#f59e0b', critical: '#ef4444' };
  const color = colorMap[msg.severity || 'info'];

  const payload = {
    attachments: [{
      color,
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: `🛡️ ${msg.title}`, emoji: true },
        },
        {
          type: 'section',
          text: { type: 'mrkdwn', text: msg.body },
        },
        ...(msg.fields || []).map(f => ({
          type: 'section',
          fields: [
            { type: 'mrkdwn', text: `*${f.label}*` },
            { type: 'mrkdwn', text: f.value },
          ],
        })),
        ...(msg.link ? [{
          type: 'actions',
          elements: [{
            type: 'button',
            text: { type: 'plain_text', text: msg.link.text },
            url: msg.link.url,
            style: 'primary',
          }],
        }] : []),
        {
          type: 'context',
          elements: [
            { type: 'mrkdwn', text: `Datacendia • ${new Date().toISOString()}` },
          ],
        },
      ],
    }],
  };

  try {
    const resp = await fetch(SLACK_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    logger.info(`[Slack] Notification sent: ${msg.title}`);
    return true;
  } catch (err: any) {
    logger.error(`[Slack] Failed to send notification: ${err.message}`);
    return false;
  }
}

// =============================================================================
// MICROSOFT TEAMS CONNECTOR
// =============================================================================

const TEAMS_WEBHOOK = process.env['TEAMS_WEBHOOK_URL'] || '';

/**
 * Send a message to Microsoft Teams via incoming webhook.
 * Formats as an Adaptive Card with gold branding.
 */
export async function sendTeamsNotification(msg: IntegrationMessage): Promise<boolean> {
  if (!TEAMS_WEBHOOK) {
    logger.warn('[Teams] TEAMS_WEBHOOK_URL not configured — notification skipped');
    return false;
  }

  const colorMap = { info: 'good', warning: 'warning', critical: 'attention' };
  const style = colorMap[msg.severity || 'info'];

  const card = {
    type: 'message',
    attachments: [{
      contentType: 'application/vnd.microsoft.card.adaptive',
      content: {
        '$schema': 'http://adaptivecards.io/schemas/adaptive-card.json',
        type: 'AdaptiveCard',
        version: '1.4',
        body: [
          {
            type: 'TextBlock',
            text: `🛡️ ${msg.title}`,
            weight: 'bolder',
            size: 'large',
            color: style,
          },
          {
            type: 'TextBlock',
            text: msg.body,
            wrap: true,
          },
          ...(msg.fields || []).map(f => ({
            type: 'FactSet',
            facts: [{ title: f.label, value: f.value }],
          })),
          {
            type: 'TextBlock',
            text: `Datacendia • ${new Date().toISOString()}`,
            size: 'small',
            isSubtle: true,
          },
        ],
        ...(msg.link ? {
          actions: [{
            type: 'Action.OpenUrl',
            title: msg.link.text,
            url: msg.link.url,
          }],
        } : {}),
      },
    }],
  };

  try {
    const resp = await fetch(TEAMS_WEBHOOK, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(card),
    });
    if (!resp.ok) throw new Error(`HTTP ${resp.status}`);
    logger.info(`[Teams] Notification sent: ${msg.title}`);
    return true;
  } catch (err: any) {
    logger.error(`[Teams] Failed to send notification: ${err.message}`);
    return false;
  }
}

// =============================================================================
// JIRA CONNECTOR
// =============================================================================

const JIRA_BASE = process.env['JIRA_BASE_URL'] || '';
const JIRA_TOKEN = process.env['JIRA_API_TOKEN'] || '';
const JIRA_EMAIL = process.env['JIRA_USER_EMAIL'] || '';
const JIRA_PROJECT = process.env['JIRA_PROJECT_KEY'] || 'DEC';

/**
 * Create a JIRA issue for a decision that requires tracking.
 * Uses JIRA REST API v3 with Basic auth (email + API token).
 */
export async function createJiraTicket(ticket: JiraTicket): Promise<{ key: string; url: string } | null> {
  if (!JIRA_BASE || !JIRA_TOKEN || !JIRA_EMAIL) {
    logger.warn('[JIRA] JIRA_BASE_URL, JIRA_API_TOKEN, or JIRA_USER_EMAIL not configured — ticket skipped');
    return null;
  }

  const auth = Buffer.from(`${JIRA_EMAIL}:${JIRA_TOKEN}`).toString('base64');

  const payload = {
    fields: {
      project: { key: JIRA_PROJECT },
      summary: ticket.summary,
      description: {
        type: 'doc',
        version: 1,
        content: [{
          type: 'paragraph',
          content: [{ type: 'text', text: ticket.description }],
        }],
      },
      issuetype: { name: ticket.issueType || 'Task' },
      priority: { name: ticket.priority || 'Medium' },
      labels: ticket.labels || ['datacendia', 'decision-governance'],
      ...(ticket.customFields || {}),
    },
  };

  try {
    const resp = await fetch(`${JIRA_BASE}/rest/api/3/issue`, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${auth}`,
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      throw new Error(`HTTP ${resp.status}: ${errBody}`);
    }

    const data = await resp.json() as { key: string; self: string };
    const url = `${JIRA_BASE}/browse/${data.key}`;
    logger.info(`[JIRA] Ticket created: ${data.key} — ${ticket.summary}`);
    return { key: data.key, url };
  } catch (err: any) {
    logger.error(`[JIRA] Failed to create ticket: ${err.message}`);
    return null;
  }
}

// =============================================================================
// UNIFIED NOTIFICATION — Send to all configured channels
// =============================================================================

/**
 * Send a notification to all configured integration channels.
 * Fails silently for unconfigured channels (no error if Slack/Teams/JIRA not set up).
 */
export async function notifyAll(msg: IntegrationMessage): Promise<{ slack: boolean; teams: boolean }> {
  const [slack, teams] = await Promise.all([
    sendSlackNotification(msg),
    sendTeamsNotification(msg),
  ]);
  return { slack, teams };
}

/**
 * Get the configuration status of all integrations.
 */
export function getIntegrationStatus(): IntegrationStatus {
  return {
    slack: { configured: !!SLACK_WEBHOOK },
    teams: { configured: !!TEAMS_WEBHOOK },
    jira: { configured: !!(JIRA_BASE && JIRA_TOKEN && JIRA_EMAIL) },
  };
}
