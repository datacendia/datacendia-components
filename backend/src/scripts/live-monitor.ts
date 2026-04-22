import { logger } from '../utils/logger.js';
/**
 * Module — Live Monitor
 *
 * Platform module.
 * @module scripts/live-monitor
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPulse™ — LIVE AGENT MONITOR
 * Real-time visualization of agent actions, decisions, and compliance checks
 * 
 * Run: npx tsx src/scripts/live-monitor.ts
 */

import Redis from 'ioredis';
import type { PrismaClient } from '@prisma/client';
import { prisma as sharedPrisma } from '../config/database.js';
import { deterministicFloat, deterministicInt,  } from '../utils/deterministic.js';

// =============================================================================
// ANSI COLOR CODES
// =============================================================================

const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  
  // Foreground
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',
  
  // Bright
  brightRed: '\x1b[91m',
  brightGreen: '\x1b[92m',
  brightYellow: '\x1b[93m',
  brightBlue: '\x1b[94m',
  brightMagenta: '\x1b[95m',
  brightCyan: '\x1b[96m',
  brightWhite: '\x1b[97m',
  
  // Background
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
  bgGray: '\x1b[100m',
};

// =============================================================================
// TYPES
// =============================================================================

interface AgentAction {
  timestamp: Date;
  agentId: string;
  agentName: string;
  action: string;
  target?: string;
  decision: 'ALLOW' | 'BLOCK' | 'ESCALATE' | 'PENDING';
  riskScore: number;
  latencyMs: number;
  framework?: string;
  citation?: string;
  details?: string;
}

interface SystemMetrics {
  activeAgents: number;
  actionsPerSecond: number;
  avgLatency: number;
  blockRate: number;
  escalationRate: number;
  complianceScore: number;
}

// =============================================================================
// AGENT DEFINITIONS
// =============================================================================

const AGENTS = [
  { id: 'chief_strategist', name: 'chief_strategist', color: colors.brightBlue },
  { id: 'cfo_advisor', name: 'cfo_advisor', color: colors.brightGreen },
  { id: 'ciso_security', name: 'ciso_security', color: colors.brightRed },
  { id: 'risk_analyzer', name: 'risk_analyzer', color: colors.brightYellow },
  { id: 'ethics_officer', name: 'ethics_officer', color: colors.brightMagenta },
  { id: 'compliance_check', name: 'compliance_check', color: colors.brightCyan },
  { id: 'legal_counsel', name: 'legal_counsel', color: colors.magenta },
  { id: 'operations_lead', name: 'operations_lead', color: colors.cyan },
  { id: 'data_pipeline', name: 'data_pipeline', color: colors.blue },
  { id: 'audit_bot', name: 'audit_bot', color: colors.green },
  { id: 'treasury_bot', name: 'treasury_bot', color: colors.yellow },
  { id: 'invoice_processor', name: 'invoice_processor', color: colors.white },
  { id: 'portfolio_mgr', name: 'portfolio_mgr', color: colors.brightWhite },
  { id: 'customer_service', name: 'customer_service', color: colors.brightCyan },
  { id: 'hr_assistant', name: 'hr_assistant', color: colors.brightMagenta },
  { id: 'vendor_manager', name: 'vendor_manager', color: colors.brightYellow },
];

const ACTIONS = [
  'query_database', 'modify_record', 'approve_request', 'transfer_funds',
  'access_pii', 'generate_report', 'send_email', 'update_config',
  'escalate_ticket', 'close_account', 'schedule_task', 'delete_record',
  'export_data', 'import_batch', 'validate_identity', 'process_payment',
  'review_contract', 'sign_document', 'archive_file', 'restore_backup',
];

const FRAMEWORKS = [
  'HIPAA', 'GDPR', 'SOC2', 'PCI-DSS', 'CCPA', 'NIST-800-53', 
  'FedRAMP', 'ISO-27001', 'Basel-III', 'MiFID-II', 'CMMC',
];

// =============================================================================
// DISPLAY HELPERS
// =============================================================================

function padRight(str: string, len: number): string {
  return str.length >= len ? str.substring(0, len) : str + ' '.repeat(len - str.length);
}

function padLeft(str: string, len: number): string {
  return str.length >= len ? str.substring(0, len) : ' '.repeat(len - str.length) + str;
}

function formatDecision(decision: AgentAction['decision']): string {
  switch (decision) {
    case 'ALLOW':
      return `${colors.bgGreen}${colors.black}${colors.bold} ALLOW ${colors.reset}`;
    case 'BLOCK':
      return `${colors.bgRed}${colors.white}${colors.bold} BLOCK ${colors.reset}`;
    case 'ESCALATE':
      return `${colors.bgYellow}${colors.black}${colors.bold} ESCALATE ${colors.reset}`;
    case 'PENDING':
      return `${colors.bgGray}${colors.white}${colors.bold} PENDING ${colors.reset}`;
  }
}

function formatRisk(risk: number): string {
  const riskStr = `${risk}%`;
  if (risk >= 80) return `${colors.brightRed}${colors.bold}${padLeft(riskStr, 4)}${colors.reset}`;
  if (risk >= 60) return `${colors.red}${padLeft(riskStr, 4)}${colors.reset}`;
  if (risk >= 40) return `${colors.yellow}${padLeft(riskStr, 4)}${colors.reset}`;
  if (risk >= 20) return `${colors.green}${padLeft(riskStr, 4)}${colors.reset}`;
  return `${colors.brightGreen}${padLeft(riskStr, 4)}${colors.reset}`;
}

function formatLatency(ms: number): string {
  const latStr = `${ms}ms`;
  if (ms >= 100) return `${colors.red}${padLeft(latStr, 5)}${colors.reset}`;
  if (ms >= 50) return `${colors.yellow}${padLeft(latStr, 5)}${colors.reset}`;
  return `${colors.green}${padLeft(latStr, 5)}${colors.reset}`;
}

function formatAgent(agent: typeof AGENTS[0], name: string): string {
  return `${agent.color}${padRight(name, 20)}${colors.reset}`;
}

function formatAction(action: string): string {
  return `${colors.white}${padRight(action, 20)}${colors.reset}`;
}

function formatCitation(framework?: string, citation?: string): string {
  if (!framework) return '';
  const cite = citation ? ` §${citation}` : '';
  return `${colors.dim}${colors.cyan}[${framework}${cite}]${colors.reset}`;
}

// =============================================================================
// HEADER & METRICS DISPLAY
// =============================================================================

function clearScreen(): void {
  process.stdout.write('\x1b[2J\x1b[H');
}

function printHeader(): void {
  const now = new Date().toISOString().replace('T', ' ').substring(0, 19);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}                                                                                                    ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}  ██████┢—  █████┢— ████████┢— █████┢—  ██████┢—███████┢—███┢—   ██┢—██████┢— ██┢— █████┢—                      ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}  ██┢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢—██┢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢—┢š—"¢ÂÃ¢"¢ÂÃ¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢"¢ÂÃ¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢—██┢"┢—"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢–ˆ—–ˆ—–ˆ—–ˆ—"¢—  ██┢"˜Ã¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢—██┢"˜Ã¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢—                     ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}  ██┢"˜  ██┢"˜Ã¢–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—"¢"˜   ██┢"˜   ███████┢"˜Ã¢–ˆ—–ˆ—"¢"˜     █████┢—  ██┢"██┢— ██┢"˜Ã¢–ˆ—–ˆ—"¢"˜  ██┢"˜Ã¢–ˆ—–ˆ—"¢"˜Ã¢–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—"¢"˜                     ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}  ██┢"˜  ██┢"˜Ã¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢"˜   ██┢"˜   ██┢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢"˜Ã¢–ˆ—–ˆ—"¢"˜     ██┢"┢—"¢ÂÃ¢"¢Â  ██┢"˜Ã¢"¢Å¡Ã¢–ˆ—–ˆ—"¢—██┢"˜Ã¢–ˆ—–ˆ—"¢"˜  ██┢"˜Ã¢–ˆ—–ˆ—"¢"˜Ã¢–ˆ—–ˆ—"¢"┢—"¢ÂÃ¢–ˆ—–ˆ—"¢"˜                     ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}  ██████┢"┢—–ˆ—–ˆ—"¢"˜  ██┢"˜   ██┢"˜   ██┢"˜  ██┢"˜Ã¢"¢Å¡Ã¢–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—"¢—███████┢—██┢"˜ ┢š—–ˆ—–ˆ—–ˆ—–ˆ—"¢"˜Ã¢–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—–ˆ—"¢"┢—–ˆ—–ˆ—"¢"˜Ã¢–ˆ—–ˆ—"¢"˜  ██┢"˜                     ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}  ┢š—"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â ┢š—"¢ÂÃ¢"¢Â  ┢š—"¢ÂÃ¢"¢Â   ┢š—"¢ÂÃ¢"¢Â   ┢š—"¢ÂÃ¢"¢Â  ┢š—"¢ÂÃ¢"¢Â ┢š—"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Å¡Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Å¡Ã¢"¢ÂÃ¢"¢Â  ┢š—"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Å¡Ã¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢ÂÃ¢"¢Â ┢š—"¢ÂÃ¢"¢ÂÃ¢"¢Å¡Ã¢"¢ÂÃ¢"¢Â  ┢š—"¢ÂÃ¢"¢Â                     ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}                                                                                                    ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.brightCyan}${colors.bold}  CendiaPulse™ LIVE AGENT MONITOR                                                              ${now} UTC  ${colors.reset}`);
  logger.info(`${colors.bgBlue}${colors.white}${colors.bold}                                                                                                    ${colors.reset}`);
  logger.info('');
}

function printMetrics(metrics: SystemMetrics): void {
  const complianceColor = metrics.complianceScore >= 95 ? colors.brightGreen : 
                          metrics.complianceScore >= 80 ? colors.yellow : colors.red;
  
  logger.info(`${colors.dim}—"Ή"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"${colors.reset}`);
  logger.info(`${colors.dim}—""š${colors.reset} ${colors.bold}SYSTEM METRICS${colors.reset}                                                                                       ${colors.dim}—""š${colors.reset}`);
  logger.info(`${colors.dim}—"ω"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¤${colors.reset}`);
  logger.info(`${colors.dim}—""š${colors.reset} Active Agents: ${colors.brightCyan}${padLeft(String(metrics.activeAgents), 3)}${colors.reset}  —""š  Actions/sec: ${colors.brightYellow}${padLeft(metrics.actionsPerSecond.toFixed(1), 5)}${colors.reset}  —""š  Avg Latency: ${formatLatency(metrics.avgLatency)}  —""š  Compliance: ${complianceColor}${metrics.complianceScore.toFixed(1)}%${colors.reset} ${colors.dim}—""š${colors.reset}`);
  logger.info(`${colors.dim}—""š${colors.reset} Block Rate: ${colors.red}${padLeft(metrics.blockRate.toFixed(1), 5)}%${colors.reset}  —""š  Escalations: ${colors.yellow}${padLeft(metrics.escalationRate.toFixed(1), 5)}%${colors.reset}  —""š  Allow Rate: ${colors.green}${padLeft((100 - metrics.blockRate - metrics.escalationRate).toFixed(1), 5)}%${colors.reset}                  ${colors.dim}—""š${colors.reset}`);
  logger.info(`${colors.dim}—""—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"Ëœ${colors.reset}`);
  logger.info('');
}

function printTableHeader(): void {
  logger.info(`${colors.dim}—"Ή"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"‰"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"‰"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"‰"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"‰"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"‰"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"${colors.reset}`);
  logger.info(`${colors.dim}—""š${colors.reset} ${colors.bold}AGENT${colors.reset}              ${colors.dim}—""š${colors.reset} ${colors.bold}ACTION${colors.reset}             ${colors.dim}—""š${colors.reset} ${colors.bold}DECISION${colors.reset} ${colors.dim}—""š${colors.reset} ${colors.bold}RISK${colors.reset}  ${colors.dim}—""š${colors.reset} ${colors.bold}LAT${colors.reset}   ${colors.dim}—""š${colors.reset} ${colors.bold}COMPLIANCE${colors.reset}                  ${colors.dim}—""š${colors.reset}`);
  logger.info(`${colors.dim}—"ω"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¼—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¼—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¼—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¼—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¼—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"¤${colors.reset}`);
}

function printAction(action: AgentAction): void {
  const foundAgent = AGENTS.find(a => a.id === action.agentId);
  const agent = foundAgent ? foundAgent : AGENTS[0];
  const citation = formatCitation(action.framework, action.citation);
  const citationLen = citation.replace(/\x1b\[[0-9;]*m/g, '').length;
  
  logger.info(
    `${colors.dim}—""š${colors.reset} ` +
    `${formatAgent(agent, action.agentName)} ` +
    `${colors.dim}—""š${colors.reset} ` +
    `${formatAction(action.action)} ` +
    `${colors.dim}—""š${colors.reset} ` +
    `${formatDecision(action.decision)} ` +
    `${colors.dim}—""š${colors.reset} ` +
    `${formatRisk(action.riskScore)} ` +
    `${colors.dim}—""š${colors.reset} ` +
    `${formatLatency(action.latencyMs)} ` +
    `${colors.dim}—""š${colors.reset} ` +
    `${citation}${' '.repeat(Math.max(0, 27 - citationLen))} ` +
    `${colors.dim}—""š${colors.reset}`
  );
}

function printTableFooter(): void {
  logger.info(`${colors.dim}—""—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"´—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"´—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"´—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"´—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"´—"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"ۉ"Ëœ${colors.reset}`);
}

// =============================================================================
// ACTION GENERATION (Simulated - Replace with real Redis/DB events)
// =============================================================================

function generateAction(): AgentAction {
  const agent = AGENTS[Math.floor(deterministicFloat('live-monitor-8') * AGENTS.length)];
  const action = ACTIONS[Math.floor(deterministicFloat('live-monitor-9') * ACTIONS.length)];
  
  // Risk-based decision logic
  const riskScore = deterministicInt(0, 99, 'live-monitor-1');
  let decision: AgentAction['decision'];
  
  if (riskScore >= 85) {
    decision = 'BLOCK';
  } else if (riskScore >= 60) {
    decision = deterministicFloat('live-monitor-6') > 0.5 ? 'ESCALATE' : 'ALLOW';
  } else if (riskScore >= 40) {
    decision = deterministicFloat('live-monitor-7') > 0.8 ? 'ESCALATE' : 'ALLOW';
  } else {
    decision = 'ALLOW';
  }
  
  // High-risk actions always get framework citations
  const needsCitation = riskScore >= 40 || ['access_pii', 'transfer_funds', 'delete_record', 'export_data'].includes(action as string);
  const framework = needsCitation ? FRAMEWORKS[Math.floor(deterministicFloat('live-monitor-10') * FRAMEWORKS.length)] : undefined;
  const citation = framework ? `${deterministicInt(0, 499, 'live-monitor-2')}.${deterministicInt(0, 99, 'live-monitor-3')}` : undefined;
  
  const selectedAgent = agent ?? AGENTS[0];
  return {
    timestamp: new Date(),
    agentId: selectedAgent.id,
    agentName: selectedAgent.name,
    action: action as string,
    decision,
    riskScore,
    latencyMs: deterministicInt(0, 49, 'live-monitor-4') + 3,
    framework,
    citation,
  };
}

// =============================================================================
// MAIN MONITOR LOOP
// =============================================================================

class LiveMonitor {
  private actions: AgentAction[] = [];
  private maxDisplayActions = 25;
  private metrics: SystemMetrics = {
    activeAgents: AGENTS.length,
    actionsPerSecond: 0,
    avgLatency: 0,
    blockRate: 0,
    escalationRate: 0,
    complianceScore: 99.2,
  };
  private actionCounts = { total: 0, blocked: 0, escalated: 0 };
  private latencySum = 0;
  private lastSecondActions = 0;
  private redis: Redis | null = null;
  private prisma: PrismaClient | null = null;

  async connectToRedis(): Promise<boolean> {
    try {
      this.redis = new Redis(process.env['REDIS_URL'] || 'redis://:datacendia_redis_2024@localhost:6380');
      await this.redis.ping();
      return true;
    } catch (e) {
      logger.info(`${colors.yellow}Redis not available, using simulation mode${colors.reset}`);
      return false;
    }
  }

  async connectToDatabase(): Promise<boolean> {
    try {
      this.prisma = sharedPrisma as unknown as PrismaClient;
      await this.prisma.$connect();
      return true;
    } catch (e) {
      logger.info(`${colors.yellow}Database not available, using simulation mode${colors.reset}`);
      return false;
    }
  }

  addAction(action: AgentAction): void {
    this.actions.unshift(action);
    if (this.actions.length > this.maxDisplayActions) {
      this.actions.pop();
    }
    
    // Update metrics
    this.actionCounts.total++;
    this.lastSecondActions++;
    this.latencySum += action.latencyMs;
    
    if (action.decision === 'BLOCK') this.actionCounts.blocked++;
    if (action.decision === 'ESCALATE') this.actionCounts.escalated++;
    
    this.metrics.avgLatency = Math.round(this.latencySum / this.actionCounts.total);
    this.metrics.blockRate = (this.actionCounts.blocked / this.actionCounts.total) * 100;
    this.metrics.escalationRate = (this.actionCounts.escalated / this.actionCounts.total) * 100;
    this.metrics.complianceScore = 100 - (this.metrics.blockRate * 0.5) - (this.metrics.escalationRate * 0.2);
  }

  render(): void {
    clearScreen();
    printHeader();
    printMetrics(this.metrics);
    printTableHeader();
    
    for (const action of this.actions) {
      printAction(action);
    }
    
    // Fill remaining rows with empty lines for consistent display
    for (let i = this.actions.length; i < this.maxDisplayActions; i++) {
      logger.info(`${colors.dim}—""š${colors.reset}                    ${colors.dim}—""š${colors.reset}                    ${colors.dim}—""š${colors.reset}          ${colors.dim}—""š${colors.reset}       ${colors.dim}—""š${colors.reset}       ${colors.dim}—""š${colors.reset}                             ${colors.dim}—""š${colors.reset}`);
    }
    
    printTableFooter();
    logger.info('');
    logger.info(`${colors.dim}Press Ctrl+C to exit${colors.reset}`);
  }

  async subscribeToRealEvents(): Promise<void> {
    if (!this.redis) return;
    
    const subscriber = this.redis.duplicate();
    
    subscriber.subscribe('agent:actions', 'compliance:decisions');
    subscriber.on('message', (channel: string, message: string) => {
      if (channel === 'agent:actions') {
        try {
          const action = JSON.parse(message) as AgentAction;
          action.timestamp = new Date(action.timestamp);
          this.addAction(action);
        } catch (e) {
          // Ignore malformed messages
        }
      }

      if (channel === 'compliance:decisions') {
        try {
          const decision = JSON.parse(message);
          const action: AgentAction = {
            timestamp: new Date(),
            agentId: decision.agentId || 'compliance_check',
            agentName: decision.agentName || 'compliance_check',
            action: decision.action || 'compliance_check',
            decision: decision.allowed ? 'ALLOW' : decision.requiresReview ? 'ESCALATE' : 'BLOCK',
            riskScore: decision.riskScore || 0,
            latencyMs: decision.latencyMs || 10,
            framework: decision.framework,
            citation: decision.citation,
          };
          this.addAction(action);
        } catch (e) {
          // Ignore malformed messages
        }
      }
    });
  }

  async run(): Promise<void> {
    logger.info(`${colors.brightCyan}Starting Datacendia Live Monitor...${colors.reset}`);
    
    const redisConnected = await this.connectToRedis();
    await this.connectToDatabase();
    
    if (redisConnected) {
      await this.subscribeToRealEvents();
      logger.info(`${colors.green}Connected to Redis - listening for real events${colors.reset}`);
    }
    
    // Update actions per second every second
    setInterval(() => {
      this.metrics.actionsPerSecond = this.lastSecondActions;
      this.lastSecondActions = 0;
    }, 1000);
    
    // Generate simulated actions if not receiving real ones
    // (Production upgrade: use as fallback only)
    const simulationInterval = setInterval(() => {
      // Generate 1-3 actions per tick
      const count = deterministicInt(0, 2, 'live-monitor-5') + 1;
      for (let i = 0; i < count; i++) {
        this.addAction(generateAction());
      }
    }, 200);
    
    // Render loop
    const renderInterval = setInterval(() => {
      this.render();
    }, 100);
    
    // Handle shutdown
    process.on('SIGINT', async () => {
      clearInterval(simulationInterval);
      clearInterval(renderInterval);
      if (this.redis) await this.redis.quit();
      if (this.prisma) await this.prisma.$disconnect();
      clearScreen();
      logger.info(`${colors.brightCyan}Monitor stopped.${colors.reset}`);
      process.exit(0);
    });
  }
}

// =============================================================================
// ENTRY POINT
// =============================================================================

const monitor = new LiveMonitor();
monitor.run().catch((err) => logger.error('LiveMonitor failed:', err));
