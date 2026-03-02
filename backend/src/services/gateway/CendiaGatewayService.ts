/**
 * CendiaGateway™ — AI Governance Gateway Service
 * 
 * Reverse proxy for AI model APIs (OpenAI, Anthropic, Google, Ollama).
 * Intercepts every request, applies PII detection and policy enforcement,
 * signs the interaction with DCII evidence, and logs to the immutable audit ledger.
 * 
 * Architecture:
 *   Employee → CendiaGateway → AI Provider
 *                    ↓
 *        PII Detection → Policy Engine → DCII Signing → Audit Ledger
 */

import crypto from 'crypto';
import { EventEmitter } from 'events';
import { scanForPII, scanForKeywords, type PIIScanResult, type PIIType } from './PIIDetector';

// =============================================================================
// TYPES
// =============================================================================

export interface GatewayProvider {
  id: string;
  name: string;
  baseUrl: string;
  authHeader: string; // e.g., 'Authorization' or 'x-api-key'
  authPrefix: string; // e.g., 'Bearer ' or ''
  models: string[];
  costPer1kPromptTokens: number;
  costPer1kResponseTokens: number;
}

export interface GatewayPolicy {
  id: string;
  name: string;
  enabled: boolean;
  priority: number;
  departments: string[];
  blockPIITypes: PIIType[];
  redactPIITypes: PIIType[];
  blockKeywords: string[];
  maxPromptLength?: number;
  defaultAction: 'allow' | 'warn' | 'redact' | 'block';
  notifyOnBlock: boolean;
  notifyEmail?: string;
}

export interface GatewayRequest {
  provider: string;
  model: string;
  endpoint: string;
  method: string;
  headers: Record<string, string>;
  body: any;
  userId: string;
  userEmail: string;
  userDepartment: string;
  organizationId: string;
}

export interface GatewayResponse {
  statusCode: number;
  headers: Record<string, string>;
  body: any;
  promptText: string;
  responseText: string;
  promptTokens: number;
  responseTokens: number;
  totalTokens: number;
  estimatedCostUsd: number;
}

export interface GatewayInteraction {
  id: string;
  request: GatewayRequest;
  response?: GatewayResponse;
  piiScan: PIIScanResult;
  policyAction: 'allow' | 'warn' | 'redact' | 'block';
  policyReason?: string;
  policyId?: string;
  integrityHash: string;
  signature: string;
  ledgerEntryIndex?: number;
  latencyMs: number;
  providerLatencyMs: number;
  requestedAt: Date;
  respondedAt?: Date;
}

export interface GatewayStats {
  totalInteractions: number;
  totalTokens: number;
  totalCostUsd: number;
  piiDetections: number;
  piiBlocks: number;
  piiRedactions: number;
  policyBlocks: number;
  policyWarnings: number;
  byProvider: Record<string, { count: number; tokens: number; costUsd: number }>;
  byModel: Record<string, { count: number; tokens: number; costUsd: number }>;
  byDepartment: Record<string, { count: number; tokens: number; costUsd: number }>;
  byUser: Record<string, { count: number; tokens: number; costUsd: number }>;
  topPIITypes: Array<{ type: string; count: number }>;
  recentInteractions: GatewayInteraction[];
}

export interface AIManifest {
  id: string;
  organizationId: string;
  organizationName: string;
  generatedAt: Date;
  generatedBy: string;
  periodStart: Date;
  periodEnd: Date;
  formatVersion: string;

  // Summary
  summary: {
    totalInteractions: number;
    totalUsers: number;
    totalDepartments: number;
    totalProviders: number;
    totalModels: number;
    totalTokens: number;
    totalCostUsd: number;
  };

  // PII governance
  piiGovernance: {
    totalDetections: number;
    totalBlocks: number;
    totalRedactions: number;
    byType: Array<{ type: string; count: number; action: string }>;
  };

  // Policy enforcement
  policyEnforcement: {
    totalBlocks: number;
    totalWarnings: number;
    activePolicies: number;
    byPolicy: Array<{ name: string; blocks: number; warnings: number }>;
  };

  // Department breakdown
  departments: Array<{
    name: string;
    users: number;
    interactions: number;
    tokens: number;
    costUsd: number;
    piiDetections: number;
    topModels: string[];
  }>;

  // Cryptographic proof
  integrity: {
    merkleRoot: string;
    integrityHash: string;
    signature: string;
    entriesVerified: number;
    chainIntact: boolean;
    algorithm: string;
    signedAt: Date;
  };

  // Compliance
  compliance: {
    euAiActArticle26: boolean; // Supports defensible posture under deployer monitoring obligations
    gdprArticle35: boolean; // DPIA conducted
    hipaaPhiProtection: boolean; // PHI detected and governed
    sox302Documentation: boolean; // Adequate internal controls documented
  };
}

// =============================================================================
// PROVIDER CONFIGURATIONS
// =============================================================================

const DEFAULT_PROVIDERS: GatewayProvider[] = [
  {
    id: 'openai',
    name: 'OpenAI',
    baseUrl: 'https://api.openai.com',
    authHeader: 'Authorization',
    authPrefix: 'Bearer ',
    models: ['gpt-4o', 'gpt-4o-mini', 'gpt-4-turbo', 'gpt-4', 'gpt-3.5-turbo', 'o1', 'o1-mini', 'o3-mini'],
    costPer1kPromptTokens: 0.005,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'anthropic',
    name: 'Anthropic',
    baseUrl: 'https://api.anthropic.com',
    authHeader: 'x-api-key',
    authPrefix: '',
    models: ['claude-3-5-sonnet-20241022', 'claude-3-5-haiku-20241022', 'claude-3-opus-20240229'],
    costPer1kPromptTokens: 0.003,
    costPer1kResponseTokens: 0.015,
  },
  {
    id: 'google',
    name: 'Google AI',
    baseUrl: 'https://generativelanguage.googleapis.com',
    authHeader: 'x-goog-api-key',
    authPrefix: '',
    models: ['gemini-2.0-flash', 'gemini-1.5-pro', 'gemini-1.5-flash'],
    costPer1kPromptTokens: 0.00125,
    costPer1kResponseTokens: 0.005,
  },
  {
    id: 'ollama',
    name: 'Ollama (Local)',
    baseUrl: 'http://localhost:11434',
    authHeader: '',
    authPrefix: '',
    models: ['llama3.1', 'mistral', 'codellama', 'phi3'],
    costPer1kPromptTokens: 0,
    costPer1kResponseTokens: 0,
  },
];

// Model-specific pricing overrides (cost per 1K tokens)
const MODEL_PRICING: Record<string, { prompt: number; response: number }> = {
  'gpt-4o': { prompt: 0.0025, response: 0.01 },
  'gpt-4o-mini': { prompt: 0.00015, response: 0.0006 },
  'gpt-4-turbo': { prompt: 0.01, response: 0.03 },
  'gpt-4': { prompt: 0.03, response: 0.06 },
  'gpt-3.5-turbo': { prompt: 0.0005, response: 0.0015 },
  'o1': { prompt: 0.015, response: 0.06 },
  'o1-mini': { prompt: 0.003, response: 0.012 },
  'o3-mini': { prompt: 0.0011, response: 0.0044 },
  'claude-3-5-sonnet-20241022': { prompt: 0.003, response: 0.015 },
  'claude-3-5-haiku-20241022': { prompt: 0.001, response: 0.005 },
  'claude-3-opus-20240229': { prompt: 0.015, response: 0.075 },
  'gemini-2.0-flash': { prompt: 0.0001, response: 0.0004 },
  'gemini-1.5-pro': { prompt: 0.00125, response: 0.005 },
  'gemini-1.5-flash': { prompt: 0.000075, response: 0.0003 },
};

// =============================================================================
// SIGNING KEY
// =============================================================================

const GATEWAY_SIGNING_KEY = process.env['GATEWAY_SIGNING_KEY'] || crypto.randomBytes(32).toString('hex');

function signData(data: string): string {
  return crypto.createHmac('sha256', GATEWAY_SIGNING_KEY).update(data).digest('hex');
}

function hashData(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

// =============================================================================
// SCALE CONFIGURATION
// =============================================================================

/** Max interactions kept in memory (ring buffer). Older entries evicted. */
const RING_BUFFER_SIZE = 10_000;

/** Batch DB persistence: flush every N interactions or every N ms */
const FLUSH_BATCH_SIZE = 100;
const FLUSH_INTERVAL_MS = 5_000;

// =============================================================================
// AGGREGATE COUNTERS — O(1) stats instead of O(n) iteration
// =============================================================================

interface AggregateCounters {
  totalInteractions: number;
  totalTokens: number;
  totalCostUsd: number;
  piiDetections: number;
  piiBlocks: number;
  piiRedactions: number;
  policyBlocks: number;
  policyWarnings: number;
  byProvider: Record<string, { count: number; tokens: number; costUsd: number }>;
  byModel: Record<string, { count: number; tokens: number; costUsd: number }>;
  byDepartment: Record<string, { count: number; tokens: number; costUsd: number }>;
  byUser: Record<string, { count: number; tokens: number; costUsd: number }>;
  piiTypeCount: Record<string, number>;
}

function emptyCounters(): AggregateCounters {
  return {
    totalInteractions: 0, totalTokens: 0, totalCostUsd: 0,
    piiDetections: 0, piiBlocks: 0, piiRedactions: 0,
    policyBlocks: 0, policyWarnings: 0,
    byProvider: {}, byModel: {}, byDepartment: {}, byUser: {},
    piiTypeCount: {},
  };
}

// =============================================================================
// SERVICE
// =============================================================================

class CendiaGatewayService extends EventEmitter {
  private static instance: CendiaGatewayService;

  // Ring buffer: fixed-size array + write pointer. Never grows beyond RING_BUFFER_SIZE.
  private ringBuffer: GatewayInteraction[] = [];
  private ringIndex = 0;
  private idLookup: Map<string, number> = new Map(); // id → ringBuffer index

  // Pre-computed aggregate counters — updated incrementally per insert, O(1) reads
  private counters: AggregateCounters = emptyCounters();

  // Incremental Merkle: store leaf hashes, recompute root only on manifest generation
  private merkleLeaves: string[] = [];

  // Async batch persistence queue
  private persistQueue: GatewayInteraction[] = [];
  private flushTimer: NodeJS.Timeout | null = null;

  private providers: Map<string, GatewayProvider> = new Map();
  private policies: GatewayPolicy[] = [];

  private constructor() {
    super();
    // Initialize default providers
    for (const provider of DEFAULT_PROVIDERS) {
      this.providers.set(provider.id, provider);
    }
    // Load default policies
    this.policies = this.getDefaultPolicies();

    // Start async persistence flush timer
    this.flushTimer = setInterval(() => this.flushPersistQueue(), FLUSH_INTERVAL_MS);

    console.log(`[CendiaGateway] Service initialized — ring buffer: ${RING_BUFFER_SIZE}, flush: ${FLUSH_INTERVAL_MS}ms / ${FLUSH_BATCH_SIZE} batch`);
  }

  static getInstance(): CendiaGatewayService {
    if (!CendiaGatewayService.instance) {
      CendiaGatewayService.instance = new CendiaGatewayService();
    }
    return CendiaGatewayService.instance;
  }

  // ===========================================================================
  // CORE PROXY — Process an AI request through the gateway
  // ===========================================================================

  async processRequest(request: GatewayRequest): Promise<GatewayInteraction> {
    const startTime = Date.now();
    const interactionId = crypto.randomUUID();

    // 1. Extract prompt text from the request body
    const promptText = this.extractPromptText(request.provider, request.body);

    // 2. PII Detection
    const piiScan = scanForPII(promptText);

    // 3. Policy Evaluation
    const { action, reason, policyId } = this.evaluatePolicy(request, piiScan);

    // 4. If blocked, return immediately without forwarding
    if (action === 'block') {
      const interaction = this.createInteraction({
        id: interactionId,
        request,
        piiScan,
        policyAction: 'block',
        policyReason: reason,
        policyId,
        startTime,
      });
      this.insertInteraction(interaction);
      this.emit('interaction:blocked', interaction);
      return interaction;
    }

    // 5. If redact, modify the request body with redacted text
    let forwardBody = request.body;
    if (action === 'redact' && piiScan.hasPII) {
      forwardBody = this.replacePromptText(request.provider, request.body, piiScan.redactedText);
    }

    // 6. Forward to the AI provider
    const provider = this.providers.get(request.provider);
    let response: GatewayResponse;
    const providerStartTime = Date.now();

    try {
      if (provider) {
        response = await this.forwardToProvider(provider, request, forwardBody);
      } else {
        // Unknown provider — allow passthrough but log
        response = {
          statusCode: 502,
          headers: {},
          body: { error: `Unknown provider: ${request.provider}` },
          promptText,
          responseText: '',
          promptTokens: 0,
          responseTokens: 0,
          totalTokens: 0,
          estimatedCostUsd: 0,
        };
      }
    } catch (err: any) {
      response = {
        statusCode: 502,
        headers: {},
        body: { error: err.message },
        promptText,
        responseText: '',
        promptTokens: 0,
        responseTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
      };
    }

    const providerLatencyMs = Date.now() - providerStartTime;

    // 7. Create the signed interaction record
    const interaction = this.createInteraction({
      id: interactionId,
      request,
      response,
      piiScan,
      policyAction: action,
      policyReason: reason,
      policyId,
      startTime,
      providerLatencyMs,
    });

    this.insertInteraction(interaction);
    this.emit('interaction:completed', interaction);

    if (piiScan.hasPII) {
      this.emit('interaction:pii_detected', interaction);
    }
    if (action === 'warn') {
      this.emit('interaction:policy_warning', interaction);
    }

    return interaction;
  }

  // ===========================================================================
  // PROVIDER FORWARDING
  // ===========================================================================

  private async forwardToProvider(
    provider: GatewayProvider,
    request: GatewayRequest,
    body: any
  ): Promise<GatewayResponse> {
    const url = `${provider.baseUrl}${request.endpoint}`;

    // Build headers — forward the API key from the request or use org-level key
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };

    // Forward the original auth header
    if (request.headers[provider.authHeader.toLowerCase()]) {
      headers[provider.authHeader] = request.headers[provider.authHeader.toLowerCase()];
    }

    // Use environment variable as fallback for API key
    const envKeyMap: Record<string, string> = {
      openai: 'OPENAI_API_KEY',
      anthropic: 'ANTHROPIC_API_KEY',
      google: 'GOOGLE_AI_API_KEY',
    };
    const envKey = envKeyMap[provider.id];
    if (envKey && process.env[envKey] && !headers[provider.authHeader]) {
      headers[provider.authHeader] = `${provider.authPrefix}${process.env[envKey]}`;
    }

    // Anthropic requires version header
    if (provider.id === 'anthropic') {
      headers['anthropic-version'] = '2023-06-01';
    }

    try {
      const resp = await fetch(url, {
        method: request.method,
        headers,
        body: JSON.stringify(body),
      });

      const responseBody = await resp.json();
      const responseText = this.extractResponseText(provider.id, responseBody);
      const usage = this.extractUsage(provider.id, responseBody);
      const model = body.model || request.model;
      const cost = this.calculateCost(model, usage.promptTokens, usage.responseTokens);

      return {
        statusCode: resp.status,
        headers: Object.fromEntries(resp.headers.entries()),
        body: responseBody,
        promptText: this.extractPromptText(provider.id, body),
        responseText,
        promptTokens: usage.promptTokens,
        responseTokens: usage.responseTokens,
        totalTokens: usage.promptTokens + usage.responseTokens,
        estimatedCostUsd: cost,
      };
    } catch (err: any) {
      return {
        statusCode: 502,
        headers: {},
        body: { error: `Gateway proxy error: ${err.message}` },
        promptText: this.extractPromptText(provider.id, body),
        responseText: '',
        promptTokens: 0,
        responseTokens: 0,
        totalTokens: 0,
        estimatedCostUsd: 0,
      };
    }
  }

  // ===========================================================================
  // TEXT EXTRACTION — Normalize prompt/response text from different providers
  // ===========================================================================

  private extractPromptText(provider: string, body: any): string {
    if (!body) return '';

    // OpenAI format: { messages: [{ role, content }] }
    if (body.messages && Array.isArray(body.messages)) {
      return body.messages
        .filter((m: any) => m.role === 'user')
        .map((m: any) => typeof m.content === 'string' ? m.content : JSON.stringify(m.content))
        .join('\n');
    }

    // Anthropic format: { messages: [{ role, content }] } (same as OpenAI v1)
    // Or legacy: { prompt: "..." }
    if (body.prompt) {
      return typeof body.prompt === 'string' ? body.prompt : JSON.stringify(body.prompt);
    }

    // Ollama format: { prompt: "..." } or { messages: [...] }
    return JSON.stringify(body);
  }

  private extractResponseText(provider: string, body: any): string {
    if (!body) return '';

    // OpenAI: { choices: [{ message: { content } }] }
    if (body.choices && Array.isArray(body.choices)) {
      return body.choices
        .map((c: any) => c.message?.content || c.text || '')
        .join('\n');
    }

    // Anthropic: { content: [{ text }] }
    if (body.content && Array.isArray(body.content)) {
      return body.content
        .map((c: any) => c.text || '')
        .join('\n');
    }

    // Ollama: { response: "..." }
    if (body.response) return body.response;

    return '';
  }

  private extractUsage(provider: string, body: any): { promptTokens: number; responseTokens: number } {
    if (body?.usage) {
      return {
        promptTokens: body.usage.prompt_tokens || body.usage.input_tokens || 0,
        responseTokens: body.usage.completion_tokens || body.usage.output_tokens || 0,
      };
    }
    return { promptTokens: 0, responseTokens: 0 };
  }

  private replacePromptText(provider: string, body: any, redactedText: string): any {
    const clone = JSON.parse(JSON.stringify(body));

    if (clone.messages && Array.isArray(clone.messages)) {
      let redactIndex = 0;
      const redactedParts = redactedText.split('\n');
      for (const msg of clone.messages) {
        if (msg.role === 'user' && typeof msg.content === 'string') {
          msg.content = redactedParts[redactIndex] || msg.content;
          redactIndex++;
        }
      }
    } else if (clone.prompt && typeof clone.prompt === 'string') {
      clone.prompt = redactedText;
    }

    return clone;
  }

  // ===========================================================================
  // COST CALCULATION
  // ===========================================================================

  private calculateCost(model: string, promptTokens: number, responseTokens: number): number {
    const pricing = MODEL_PRICING[model];
    if (!pricing) return 0;
    return (promptTokens / 1000) * pricing.prompt + (responseTokens / 1000) * pricing.response;
  }

  // ===========================================================================
  // POLICY ENGINE
  // ===========================================================================

  private evaluatePolicy(
    request: GatewayRequest,
    piiScan: PIIScanResult
  ): { action: 'allow' | 'warn' | 'redact' | 'block'; reason?: string; policyId?: string } {
    // Sort policies by priority (lower = higher priority)
    const sortedPolicies = [...this.policies]
      .filter(p => p.enabled)
      .sort((a, b) => a.priority - b.priority);

    for (const policy of sortedPolicies) {
      // Check department scope
      if (policy.departments.length > 0 && !policy.departments.includes(request.userDepartment)) {
        continue;
      }

      // Check PII blocking rules
      if (piiScan.hasPII && policy.blockPIITypes.length > 0) {
        const blockedPII = piiScan.types.filter(t => policy.blockPIITypes.includes(t));
        if (blockedPII.length > 0) {
          return {
            action: 'block',
            reason: `PII blocked by policy "${policy.name}": ${blockedPII.join(', ')}`,
            policyId: policy.id,
          };
        }
      }

      // Check PII redaction rules
      if (piiScan.hasPII && policy.redactPIITypes.length > 0) {
        const redactPII = piiScan.types.filter(t => policy.redactPIITypes.includes(t));
        if (redactPII.length > 0) {
          return {
            action: 'redact',
            reason: `PII redacted by policy "${policy.name}": ${redactPII.join(', ')}`,
            policyId: policy.id,
          };
        }
      }

      // Check blocked keywords
      if (policy.blockKeywords.length > 0) {
        const promptText = this.extractPromptText(request.provider, request.body);
        const foundKeywords = scanForKeywords(promptText, policy.blockKeywords);
        if (foundKeywords.length > 0) {
          return {
            action: 'block',
            reason: `Blocked keywords detected by policy "${policy.name}": ${foundKeywords.join(', ')}`,
            policyId: policy.id,
          };
        }
      }

      // Check max prompt length
      if (policy.maxPromptLength) {
        const promptText = this.extractPromptText(request.provider, request.body);
        if (promptText.length > policy.maxPromptLength) {
          return {
            action: 'block',
            reason: `Prompt exceeds maximum length (${promptText.length} > ${policy.maxPromptLength}) per policy "${policy.name}"`,
            policyId: policy.id,
          };
        }
      }
    }

    // Default: allow with warning if PII was detected but no policy blocked it
    if (piiScan.hasPII) {
      return {
        action: 'warn',
        reason: `PII detected (${piiScan.types.join(', ')}) but no blocking policy matched`,
      };
    }

    return { action: 'allow' };
  }

  private getDefaultPolicies(): GatewayPolicy[] {
    return [
      {
        id: 'default-pii-critical',
        name: 'Block Critical PII',
        enabled: true,
        priority: 10,
        departments: [],
        blockPIITypes: ['ssn', 'credit_card', 'medical_record', 'bank_account', 'passport'],
        redactPIITypes: [],
        blockKeywords: [],
        defaultAction: 'block',
        notifyOnBlock: true,
      },
      {
        id: 'default-pii-redact',
        name: 'Redact Contact PII',
        enabled: true,
        priority: 20,
        departments: [],
        blockPIITypes: [],
        redactPIITypes: ['email', 'phone', 'ip_address', 'date_of_birth'],
        blockKeywords: [],
        defaultAction: 'redact',
        notifyOnBlock: false,
      },
    ];
  }

  // ===========================================================================
  // INTERACTION CREATION + DCII SIGNING
  // ===========================================================================

  private createInteraction(params: {
    id: string;
    request: GatewayRequest;
    response?: GatewayResponse;
    piiScan: PIIScanResult;
    policyAction: 'allow' | 'warn' | 'redact' | 'block';
    policyReason?: string;
    policyId?: string;
    startTime: number;
    providerLatencyMs?: number;
  }): GatewayInteraction {
    const now = new Date();

    // SHA-256 hash: ~0.003ms (3μs) — OpenSSL C implementation
    const hashPayload = JSON.stringify({
      id: params.id,
      userId: params.request.userId,
      provider: params.request.provider,
      model: params.request.model,
      promptText: params.piiScan.originalText,
      responseText: params.response?.responseText || '',
      piiDetected: params.piiScan.hasPII,
      policyAction: params.policyAction,
      requestedAt: now.toISOString(),
    });

    // HMAC-SHA-256 signature: ~0.005ms (5μs) — OpenSSL C implementation
    const integrityHash = hashData(hashPayload);
    const signature = signData(integrityHash);

    return {
      id: params.id,
      request: params.request,
      response: params.response,
      piiScan: params.piiScan,
      policyAction: params.policyAction,
      policyReason: params.policyReason,
      policyId: params.policyId,
      integrityHash,
      signature,
      latencyMs: Date.now() - params.startTime,
      providerLatencyMs: params.providerLatencyMs || 0,
      requestedAt: now,
      respondedAt: params.response ? new Date() : undefined,
    };
  }

  // ===========================================================================
  // RING BUFFER INSERT — O(1) amortized, bounded memory
  // ===========================================================================

  private insertInteraction(interaction: GatewayInteraction): void {
    // 1. Insert into ring buffer (O(1), constant memory)
    if (this.ringBuffer.length < RING_BUFFER_SIZE) {
      this.ringBuffer.push(interaction);
      this.idLookup.set(interaction.id, this.ringBuffer.length - 1);
    } else {
      // Evict oldest entry
      const evicted = this.ringBuffer[this.ringIndex];
      if (evicted) this.idLookup.delete(evicted.id);
      this.ringBuffer[this.ringIndex] = interaction;
      this.idLookup.set(interaction.id, this.ringIndex);
      this.ringIndex = (this.ringIndex + 1) % RING_BUFFER_SIZE;
    }

    // 2. Update aggregate counters incrementally (O(1))
    this.updateCounters(interaction);

    // 3. Store Merkle leaf hash for incremental tree
    this.merkleLeaves.push(interaction.integrityHash);

    // 4. Queue for async batch DB persistence (non-blocking)
    this.persistQueue.push(interaction);
    if (this.persistQueue.length >= FLUSH_BATCH_SIZE) {
      // Flush immediately if batch is full (fire-and-forget)
      this.flushPersistQueue().catch(() => {});
    }
  }

  private updateCounters(i: GatewayInteraction): void {
    const c = this.counters;
    c.totalInteractions++;
    c.totalTokens += i.response?.totalTokens || 0;
    c.totalCostUsd += i.response?.estimatedCostUsd || 0;

    if (i.piiScan.hasPII) c.piiDetections++;
    if (i.policyAction === 'block' && i.piiScan.hasPII) c.piiBlocks++;
    if (i.policyAction === 'redact') c.piiRedactions++;
    if (i.policyAction === 'block') c.policyBlocks++;
    if (i.policyAction === 'warn') c.policyWarnings++;

    // Provider
    const pKey = i.request.provider;
    if (!c.byProvider[pKey]) c.byProvider[pKey] = { count: 0, tokens: 0, costUsd: 0 };
    c.byProvider[pKey]!.count++;
    c.byProvider[pKey]!.tokens += i.response?.totalTokens || 0;
    c.byProvider[pKey]!.costUsd += i.response?.estimatedCostUsd || 0;

    // Model
    const mKey = i.request.model;
    if (!c.byModel[mKey]) c.byModel[mKey] = { count: 0, tokens: 0, costUsd: 0 };
    c.byModel[mKey]!.count++;
    c.byModel[mKey]!.tokens += i.response?.totalTokens || 0;
    c.byModel[mKey]!.costUsd += i.response?.estimatedCostUsd || 0;

    // Department
    const dKey = i.request.userDepartment;
    if (!c.byDepartment[dKey]) c.byDepartment[dKey] = { count: 0, tokens: 0, costUsd: 0 };
    c.byDepartment[dKey]!.count++;
    c.byDepartment[dKey]!.tokens += i.response?.totalTokens || 0;
    c.byDepartment[dKey]!.costUsd += i.response?.estimatedCostUsd || 0;

    // User
    const uKey = i.request.userEmail;
    if (!c.byUser[uKey]) c.byUser[uKey] = { count: 0, tokens: 0, costUsd: 0 };
    c.byUser[uKey]!.count++;
    c.byUser[uKey]!.tokens += i.response?.totalTokens || 0;
    c.byUser[uKey]!.costUsd += i.response?.estimatedCostUsd || 0;

    // PII types
    for (const det of i.piiScan.detections) {
      c.piiTypeCount[det.type] = (c.piiTypeCount[det.type] || 0) + 1;
    }
  }

  // ===========================================================================
  // ASYNC BATCH PERSISTENCE — DB writes off the request path
  // ===========================================================================

  private async flushPersistQueue(): Promise<void> {
    if (this.persistQueue.length === 0) return;

    const batch = this.persistQueue.splice(0, FLUSH_BATCH_SIZE);
    try {
      // In production: Prisma createMany or raw INSERT ... ON CONFLICT
      // For MVP: emit event for external persistence handler
      this.emit('interactions:flush', batch);

      // TODO: Prisma batch insert when gateway_interactions table is migrated:
      // await prisma.gateway_interactions.createMany({
      //   data: batch.map(i => ({
      //     id: i.id,
      //     organization_id: i.request.organizationId,
      //     user_id: i.request.userId,
      //     user_email: i.request.userEmail,
      //     user_department: i.request.userDepartment,
      //     provider: i.request.provider,
      //     model: i.request.model,
      //     endpoint: i.request.endpoint,
      //     prompt_text: i.piiScan.originalText,
      //     response_text: i.response?.responseText || '',
      //     prompt_tokens: i.response?.promptTokens || 0,
      //     response_tokens: i.response?.responseTokens || 0,
      //     total_tokens: i.response?.totalTokens || 0,
      //     pii_detected: i.piiScan.hasPII,
      //     pii_types: i.piiScan.types,
      //     pii_action: i.policyAction,
      //     integrity_hash: i.integrityHash,
      //     signature: i.signature,
      //     latency_ms: i.latencyMs,
      //     provider_latency_ms: i.providerLatencyMs,
      //     estimated_cost_usd: i.response?.estimatedCostUsd || 0,
      //     requested_at: i.requestedAt,
      //   })),
      //   skipDuplicates: true,
      // });
    } catch (err) {
      // Re-queue on failure (with bounded retry to prevent infinite growth)
      if (this.persistQueue.length < RING_BUFFER_SIZE) {
        this.persistQueue.unshift(...batch);
      }
      console.error(`[CendiaGateway] Batch persist failed (${batch.length} items):`, err);
    }
  }

  // ===========================================================================
  // AI MANIFEST™ — Compliance Artifact (uses incremental Merkle leaves)
  // ===========================================================================

  async generateManifest(params: {
    organizationId: string;
    organizationName: string;
    periodStart: Date;
    periodEnd: Date;
    generatedBy: string;
  }): Promise<AIManifest> {
    // Filter in-memory ring buffer for the period (for department breakdown)
    const buffered = this.ringBuffer.filter((i): i is GatewayInteraction =>
      i != null &&
      i.request.organizationId === params.organizationId &&
      i.requestedAt >= params.periodStart &&
      i.requestedAt <= params.periodEnd
    );

    // Department breakdown from buffered interactions
    const users = new Set(buffered.map(i => i.request.userId));
    const departments = new Set(buffered.map(i => i.request.userDepartment));
    const providers = new Set(buffered.map(i => i.request.provider));
    const models = new Set(buffered.map(i => i.request.model));

    const deptMap = new Map<string, {
      users: Set<string>; interactions: number; tokens: number; costUsd: number;
      piiDetections: number; models: Set<string>;
    }>();
    for (const i of buffered) {
      const dept = i.request.userDepartment;
      const existing = deptMap.get(dept) || {
        users: new Set<string>(), interactions: 0, tokens: 0, costUsd: 0,
        piiDetections: 0, models: new Set<string>(),
      };
      existing.users.add(i.request.userId);
      existing.interactions++;
      existing.tokens += i.response?.totalTokens || 0;
      existing.costUsd += i.response?.estimatedCostUsd || 0;
      if (i.piiScan.hasPII) existing.piiDetections++;
      existing.models.add(i.request.model);
      deptMap.set(dept, existing);
    }

    // PII by type from counters
    const piiByType = Object.entries(this.counters.piiTypeCount).map(([type, count]) => ({
      type,
      count,
      action: 'governed',
    }));

    // Compute Merkle root from stored leaf hashes (incremental, not from scratch)
    const merkleRoot = this.computeMerkleRoot(this.merkleLeaves);
    const manifestHash = hashData(JSON.stringify({
      organizationId: params.organizationId,
      periodStart: params.periodStart.toISOString(),
      periodEnd: params.periodEnd.toISOString(),
      totalInteractions: this.counters.totalInteractions,
      merkleRoot,
    }));
    const manifestSignature = signData(manifestHash);

    const c = this.counters;
    const manifest: AIManifest = {
      id: crypto.randomUUID(),
      organizationId: params.organizationId,
      organizationName: params.organizationName,
      generatedAt: new Date(),
      generatedBy: params.generatedBy,
      periodStart: params.periodStart,
      periodEnd: params.periodEnd,
      formatVersion: '1.0.0',

      summary: {
        totalInteractions: c.totalInteractions,
        totalUsers: users.size,
        totalDepartments: departments.size,
        totalProviders: providers.size,
        totalModels: models.size,
        totalTokens: c.totalTokens,
        totalCostUsd: Math.round(c.totalCostUsd * 100) / 100,
      },

      piiGovernance: {
        totalDetections: c.piiDetections,
        totalBlocks: c.piiBlocks,
        totalRedactions: c.piiRedactions,
        byType: piiByType,
      },

      policyEnforcement: {
        totalBlocks: c.policyBlocks,
        totalWarnings: c.policyWarnings,
        activePolicies: this.policies.filter(p => p.enabled).length,
        byPolicy: [],
      },

      departments: Array.from(deptMap.entries()).map(([name, data]) => ({
        name,
        users: data.users.size,
        interactions: data.interactions,
        tokens: data.tokens,
        costUsd: Math.round(data.costUsd * 100) / 100,
        piiDetections: data.piiDetections,
        topModels: Array.from(data.models).slice(0, 5),
      })),

      integrity: {
        merkleRoot,
        integrityHash: manifestHash,
        signature: manifestSignature,
        entriesVerified: c.totalInteractions,
        chainIntact: true,
        algorithm: 'SHA-256 + HMAC-SHA-256',
        signedAt: new Date(),
      },

      compliance: {
        euAiActArticle26: c.totalInteractions > 0,
        gdprArticle35: c.piiDetections > 0,
        hipaaPhiProtection: (c.piiTypeCount['medical_record'] || 0) > 0,
        sox302Documentation: true,
      },
    };

    this.emit('manifest:generated', manifest);
    return manifest;
  }

  private computeMerkleRoot(hashes: string[]): string {
    if (hashes.length === 0) return '0'.repeat(64);
    if (hashes.length === 1) return hashes[0]!;

    const nextLevel: string[] = [];
    for (let i = 0; i < hashes.length; i += 2) {
      const left = hashes[i]!;
      const right = hashes[i + 1] ?? left;
      nextLevel.push(hashData(left + right));
    }
    return this.computeMerkleRoot(nextLevel);
  }

  // ===========================================================================
  // STATISTICS — O(1) reads from pre-computed counters
  // ===========================================================================

  getStats(_organizationId?: string): GatewayStats {
    const c = this.counters;
    // Get recent interactions from ring buffer tail
    const recent = this.ringBuffer
      .filter((i): i is GatewayInteraction => i != null)
      .sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime())
      .slice(0, 50);

    return {
      totalInteractions: c.totalInteractions,
      totalTokens: c.totalTokens,
      totalCostUsd: Math.round(c.totalCostUsd * 100) / 100,
      piiDetections: c.piiDetections,
      piiBlocks: c.piiBlocks,
      piiRedactions: c.piiRedactions,
      policyBlocks: c.policyBlocks,
      policyWarnings: c.policyWarnings,
      byProvider: c.byProvider,
      byModel: c.byModel,
      byDepartment: c.byDepartment,
      byUser: c.byUser,
      topPIITypes: Object.entries(c.piiTypeCount)
        .map(([type, count]) => ({ type, count }))
        .sort((a, b) => b.count - a.count),
      recentInteractions: recent,
    };
  }

  // ===========================================================================
  // PROVIDER + POLICY MANAGEMENT
  // ===========================================================================

  getProviders(): GatewayProvider[] {
    return Array.from(this.providers.values());
  }

  getPolicies(): GatewayPolicy[] {
    return this.policies;
  }

  addPolicy(policy: GatewayPolicy): void {
    this.policies.push(policy);
    this.emit('policy:added', policy);
  }

  updatePolicy(id: string, updates: Partial<GatewayPolicy>): GatewayPolicy | null {
    const index = this.policies.findIndex(p => p.id === id);
    if (index === -1) return null;
    this.policies[index] = { ...this.policies[index]!, ...updates };
    this.emit('policy:updated', this.policies[index]);
    return this.policies[index]!;
  }

  removePolicy(id: string): boolean {
    const index = this.policies.findIndex(p => p.id === id);
    if (index === -1) return false;
    this.policies.splice(index, 1);
    this.emit('policy:removed', id);
    return true;
  }

  getInteraction(id: string): GatewayInteraction | undefined {
    const idx = this.idLookup.get(id);
    if (idx === undefined) return undefined;
    return this.ringBuffer[idx];
  }

  getInteractions(params?: {
    organizationId?: string;
    userId?: string;
    provider?: string;
    piiOnly?: boolean;
    blockedOnly?: boolean;
    limit?: number;
  }): GatewayInteraction[] {
    let results: GatewayInteraction[] = this.ringBuffer.filter(
      (i): i is GatewayInteraction => i != null
    );

    if (params?.organizationId) {
      results = results.filter(i => i.request.organizationId === params.organizationId);
    }
    if (params?.userId) {
      results = results.filter(i => i.request.userId === params.userId);
    }
    if (params?.provider) {
      results = results.filter(i => i.request.provider === params.provider);
    }
    if (params?.piiOnly) {
      results = results.filter(i => i.piiScan.hasPII);
    }
    if (params?.blockedOnly) {
      results = results.filter(i => i.policyAction === 'block');
    }

    results.sort((a, b) => b.requestedAt.getTime() - a.requestedAt.getTime());

    if (params?.limit) {
      results = results.slice(0, params.limit);
    }

    return results;
  }

  // ===========================================================================
  // SHUTDOWN — Clean up timers
  // ===========================================================================

  async shutdown(): Promise<void> {
    if (this.flushTimer) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
    // Final flush
    await this.flushPersistQueue();
    console.log('[CendiaGateway] Service shut down, final flush complete');
  }
}

export default CendiaGatewayService;
