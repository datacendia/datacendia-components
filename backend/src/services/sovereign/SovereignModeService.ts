/**
 * Service — Sovereign Mode Service
 *
 * Controls online/offline mode for air-gapped, sovereign, and SCIF deployments.
 * When DATACENDIA_ONLINE_MODE=false, all cloud AI providers and external services
 * are disabled. The system operates entirely on local infrastructure.
 *
 * Environment variables:
 *   DATACENDIA_ONLINE_MODE        — 'true' (default) | 'false'
 *   DATACENDIA_CLOUD_AI           — 'true' (default) | 'false'  (overridden by ONLINE_MODE=false)
 *   DATACENDIA_CLOUD_AI_FALLBACK  — 'error' (default) | 'local'
 *   DATACENDIA_EXTERNAL_DATA      — 'true' (default) | 'false'  (overridden by ONLINE_MODE=false)
 *   DATACENDIA_EXTERNAL_NOTIFY    — 'true' (default) | 'false'  (overridden by ONLINE_MODE=false)
 *
 * @exports sovereignMode, SovereignModeService, CloudAIDisabledError, ExternalServiceDisabledError
 * @module services/sovereign/SovereignModeService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

import { logger } from '../../utils/logger.js';
import { offlineLicense } from './OfflineLicenseService.js';

// =============================================================================
// ERRORS
// =============================================================================

/**
 * Thrown when a cloud AI provider is invoked while sovereign mode blocks it.
 * HTTP 503 — Service Unavailable (not a client error, the service is intentionally disabled).
 */
export class CloudAIDisabledError extends Error {
  readonly statusCode = 503;
  readonly code = 'CLOUD_AI_DISABLED';

  constructor(provider: string) {
    super(
      `Cloud AI provider '${provider}' is disabled (DATACENDIA_ONLINE_MODE=false). ` +
      `Configure a local LLM provider (Ollama, NIM, or Triton) or set DATACENDIA_CLOUD_AI_FALLBACK=local ` +
      `to auto-route to a local provider.`
    );
    this.name = 'CloudAIDisabledError';
  }
}

/**
 * Thrown when an external service (FRED, SIEM, email, webhook) is invoked while disabled.
 */
export class ExternalServiceDisabledError extends Error {
  readonly statusCode = 503;
  readonly code = 'EXTERNAL_SERVICE_DISABLED';

  constructor(service: string, category: 'data' | 'notify') {
    const envVar = category === 'data'
      ? 'DATACENDIA_EXTERNAL_DATA'
      : 'DATACENDIA_EXTERNAL_NOTIFY';
    super(
      `External service '${service}' is disabled (DATACENDIA_ONLINE_MODE=false). ` +
      `To enable this service independently, set ${envVar}=true.`
    );
    this.name = 'ExternalServiceDisabledError';
  }
}

// =============================================================================
// TYPES
// =============================================================================

export type CloudAIFallback = 'error' | 'local';

export interface SovereignStatus {
  onlineMode: boolean;
  cloudAI: boolean;
  cloudAIFallback: CloudAIFallback;
  externalData: boolean;
  externalNotify: boolean;
  validationErrors: string[];
  validatedAt: string | null;
}

export interface SovereignValidationResult {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

// Cloud AI provider types that are blocked in sovereign mode
const CLOUD_PROVIDERS = new Set(['openai', 'anthropic', 'gemini', 'togetherai']);
const LOCAL_PROVIDERS = new Set(['ollama', 'triton', 'nim']);

// =============================================================================
// SERVICE
// =============================================================================

class SovereignModeService {
  private _onlineMode: boolean;
  private _cloudAI: boolean;
  private _cloudAIFallback: CloudAIFallback;
  private _externalData: boolean;
  private _externalNotify: boolean;
  private _validationErrors: string[] = [];
  private _validatedAt: string | null = null;

  constructor() {
    // Master toggle — when false, overrides all sub-toggles to false
    this._onlineMode = process.env['DATACENDIA_ONLINE_MODE'] !== 'false';

    if (this._onlineMode) {
      // Online mode: sub-toggles can be independently controlled
      this._cloudAI = process.env['DATACENDIA_CLOUD_AI'] !== 'false';
      this._externalData = process.env['DATACENDIA_EXTERNAL_DATA'] !== 'false';
      this._externalNotify = process.env['DATACENDIA_EXTERNAL_NOTIFY'] !== 'false';
    } else {
      // Offline mode: master toggle overrides everything
      this._cloudAI = false;
      this._externalData = false;
      this._externalNotify = false;
    }

    // Fallback behaviour when cloud AI is invoked while disabled
    const fallbackEnv = (process.env['DATACENDIA_CLOUD_AI_FALLBACK'] || 'error').toLowerCase();
    this._cloudAIFallback = fallbackEnv === 'local' ? 'local' : 'error';
  }

  // ─── Public Getters ─────────────────────────────────────────────────────

  /** True if the platform is in full online mode (cloud AI + external services allowed) */
  get isOnline(): boolean { return this._onlineMode; }

  /** True if cloud AI providers (OpenAI, Anthropic, etc.) are allowed */
  get isCloudAIEnabled(): boolean { return this._cloudAI; }

  /** What to do when cloud AI is invoked while disabled: 'error' or 'local' */
  get cloudAIFallback(): CloudAIFallback { return this._cloudAIFallback; }

  /** True if external data feeds (FRED, etc.) are allowed */
  get isExternalDataEnabled(): boolean { return this._externalData; }

  /** True if external notifications (email, webhook, SIEM) are allowed */
  get isExternalNotifyEnabled(): boolean { return this._externalNotify; }

  // ─── Guards ─────────────────────────────────────────────────────────────

  /**
   * Guard: Check if a cloud AI provider is allowed.
   * Call this at the top of any cloud provider method.
   *
   * @throws CloudAIDisabledError if cloud AI is disabled and fallback is 'error'
   * @returns 'proceed' if allowed, 'fallback-local' if should route to local provider
   */
  guardCloudAI(provider: string): 'proceed' | 'fallback-local' {
    // Local providers are always allowed
    if (LOCAL_PROVIDERS.has(provider.toLowerCase())) {
      return 'proceed';
    }

    // Cloud AI is enabled — proceed
    if (this._cloudAI) {
      return 'proceed';
    }

    // Cloud AI is disabled — check fallback behaviour
    if (this._cloudAIFallback === 'local') {
      logger.warn(
        `[Sovereign] Cloud provider '${provider}' unavailable in offline mode, ` +
        `routing to local provider`
      );
      return 'fallback-local';
    }

    // Default: hard error
    throw new CloudAIDisabledError(provider);
  }

  /**
   * Guard: Check if external data feeds are allowed.
   * @throws ExternalServiceDisabledError if external data is disabled
   */
  guardExternalData(service: string): void {
    if (!this._externalData) {
      throw new ExternalServiceDisabledError(service, 'data');
    }
  }

  /**
   * Guard: Check if external notifications are allowed.
   * @throws ExternalServiceDisabledError if external notifications are disabled
   */
  guardExternalNotify(service: string): void {
    if (!this._externalNotify) {
      throw new ExternalServiceDisabledError(service, 'notify');
    }
  }

  // ─── Startup Validation ─────────────────────────────────────────────────

  /**
   * Validate sovereign mode configuration at startup.
   * When DATACENDIA_ONLINE_MODE=false, ensures local providers are configured.
   * Returns validation result; caller decides whether to block startup.
   */
  async validate(): Promise<SovereignValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];

    if (this._onlineMode) {
      // Online mode — no validation needed
      logger.info('[Sovereign] Online mode — cloud AI and external services enabled');
      this._validatedAt = new Date().toISOString();
      return { valid: true, errors: [], warnings: [] };
    }

    logger.info('[Sovereign] ══════════════════════════════════════════════════');
    logger.info('[Sovereign] OFFLINE MODE — Sovereign deployment validation');
    logger.info('[Sovereign] ══════════════════════════════════════════════════');

    // 1. Check that at least one local LLM provider is configured
    const ollamaHost = process.env['OLLAMA_BASE_URL'] || process.env['OLLAMA_HOST'];
    const nimEndpoint = process.env['NIM_BASE_URL'] || process.env['NIM_ENDPOINT'];
    const tritonEndpoint = process.env['TRITON_BASE_URL'] || process.env['TRITON_ENDPOINT'];

    const hasLocalProvider = !!(ollamaHost || nimEndpoint || tritonEndpoint);
    if (!hasLocalProvider) {
      errors.push(
        'No local LLM provider configured (set OLLAMA_BASE_URL, NIM_BASE_URL, or TRITON_BASE_URL)'
      );
    }

    // 2. Check inference provider is set to a local provider
    const inferenceProvider = (process.env['INFERENCE_PROVIDER'] || 'ollama').toLowerCase();
    if (CLOUD_PROVIDERS.has(inferenceProvider)) {
      errors.push(
        `INFERENCE_PROVIDER is set to '${inferenceProvider}' (cloud) but DATACENDIA_ONLINE_MODE=false. ` +
        `Set INFERENCE_PROVIDER to 'ollama', 'nim', or 'triton'.`
      );
    }

    // 3. Check cloud AI fallback setting
    if (this._cloudAIFallback === 'local' && !hasLocalProvider) {
      errors.push(
        'DATACENDIA_CLOUD_AI_FALLBACK=local but no local provider is configured. ' +
        'Fallback would fail at runtime.'
      );
    }

    // 4. Verify local provider is reachable (non-blocking attempt)
    if (hasLocalProvider) {
      try {
        const providerUrl = ollamaHost || nimEndpoint || tritonEndpoint;
        const healthUrl = ollamaHost
          ? `${ollamaHost}/api/tags`
          : `${providerUrl}/v2/health/ready`;
        const resp = await fetch(healthUrl, { signal: AbortSignal.timeout(5000) });
        if (resp.ok) {
          const providerName = ollamaHost ? 'Ollama' : nimEndpoint ? 'NIM' : 'Triton';
          logger.info(`[Sovereign] ✓ Local LLM provider reachable (${providerName})`);
        } else {
          warnings.push(
            `Local LLM provider returned HTTP ${resp.status} — may not be ready yet`
          );
        }
      } catch (e) {
        warnings.push(
          `Local LLM provider is not reachable — ensure it is running before processing requests`
        );
      }
    }

    // 5. Check SMTP configuration
    const smtpHost = process.env['SMTP_HOST'] || '';
    if (smtpHost && !this._externalNotify) {
      const isExternal = !smtpHost.includes('localhost') &&
                         !smtpHost.includes('127.0.0.1') &&
                         !smtpHost.includes('10.') &&
                         !smtpHost.includes('192.168.');
      if (isExternal) {
        warnings.push(
          `SMTP_HOST='${smtpHost}' appears to be an external relay but DATACENDIA_EXTERNAL_NOTIFY=false. ` +
          `Email notifications will be blocked.`
        );
      }
    }

    // 6. Validate offline license file
    const licenseStatus = await offlineLicense.validate();
    if (licenseStatus.valid) {
      logger.info(`[Sovereign] ✓ Offline license verified (${licenseStatus.payload?.tier} tier, ${licenseStatus.daysRemaining} days remaining)`);
    } else if (licenseStatus.error) {
      // In offline mode, a missing or invalid license is a warning, not a hard error.
      // The platform defaults to pilot-tier access via requireLicense middleware.
      // Defense/strategic customers MUST have a valid .dcl file.
      const licenseFilePath = offlineLicense.findLicenseFile();
      if (licenseFilePath) {
        // File exists but is invalid — that's an error
        errors.push(`Offline license file invalid: ${licenseStatus.error}`);
      } else {
        warnings.push(
          'No offline license file found. Platform will default to pilot-tier access. ' +
          'For enterprise/strategic features, place a signed .dcl file at /etc/datacendia/license.dcl ' +
          'or set DATACENDIA_LICENSE_FILE.'
        );
      }
    }

    // Store validation results
    this._validationErrors = errors;
    this._validatedAt = new Date().toISOString();

    // Log results
    if (errors.length > 0) {
      logger.error('[Sovereign] ══════════════════════════════════════════════════');
      logger.error('[Sovereign] SOVEREIGN MODE VALIDATION FAILED:');
      errors.forEach(e => logger.error(`[Sovereign]   ✗ ${e}`));
      logger.error('[Sovereign] ══════════════════════════════════════════════════');
    }
    if (warnings.length > 0) {
      warnings.forEach(w => logger.warn(`[Sovereign]   ⚠ ${w}`));
    }
    if (errors.length === 0) {
      logger.info('[Sovereign] ✓ Sovereign mode validation passed');
      logger.info(`[Sovereign]   Cloud AI: DISABLED`);
      logger.info(`[Sovereign]   Cloud AI fallback: ${this._cloudAIFallback}`);
      logger.info(`[Sovereign]   External data: DISABLED`);
      logger.info(`[Sovereign]   External notifications: DISABLED`);
    }

    return {
      valid: errors.length === 0,
      errors,
      warnings,
    };
  }

  // ─── Status ─────────────────────────────────────────────────────────────

  /**
   * Return current sovereign mode status (for health endpoints, admin UI).
   */
  getStatus(): SovereignStatus {
    return {
      onlineMode: this._onlineMode,
      cloudAI: this._cloudAI,
      cloudAIFallback: this._cloudAIFallback,
      externalData: this._externalData,
      externalNotify: this._externalNotify,
      validationErrors: this._validationErrors,
      validatedAt: this._validatedAt,
    };
  }
}

// Singleton export
export const sovereignMode = new SovereignModeService();
