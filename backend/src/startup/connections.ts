// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module startup/connections
 * @description Database and service initialization — PostgreSQL, Redis, Neo4j, Qdrant, Kafka, Temporal, etc.
 * Each connection is independent; failures don't block startup.
 * Extracted from index.ts for modularity (F21 audit item).
 */

import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { neo4j } from '../config/neo4j.js';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { policyEngine } from '../security/PolicyEngine.js';
import { databaseBackupService } from '../services/backup/index.js';
import { vectorDB } from '../services/vectordb/index.js';
import { registerPlatformServices } from '../core/services/PlatformServices.js';
import { applyPerformanceIndexes } from './applyIndexes.js';
import { sovereignMode } from '../services/sovereign/SovereignModeService.js';

// =============================================================================
// SIGNING KEY VALIDATION — Fail-fast if critical keys missing in production
// =============================================================================

/**
 * Validate that cryptographic signing keys are configured.
 * In production, ephemeral keys mean evidence signed today can't be verified tomorrow.
 * Logs warnings in development, throws in production.
 */
function validateSigningKeys(): void {
  const requiredInProd = [
    { key: 'AUDIT_SIGNING_KEY', purpose: 'ImmutableAuditLedger HMAC signing' },
    { key: 'GATEWAY_SIGNING_KEY', purpose: 'CendiaGateway interaction signing' },
    { key: 'JWT_SECRET', purpose: 'Authentication token signing' },
    { key: 'JWT_REFRESH_SECRET', purpose: 'Refresh token signing' },
  ];

  const missing: string[] = [];
  for (const { key, purpose } of requiredInProd) {
    const value = process.env[key];
    if (!value || value.length < 32) {
      missing.push(`${key} (${purpose})`);
    }
  }

  if (missing.length > 0) {
    const msg = `Missing or weak signing keys:\n  ${missing.join('\n  ')}\n\nEvidence signed with ephemeral keys cannot be verified after restart.`;
    if (config.nodeEnv === 'production') {
      logger.error(`[CRITICAL] ${msg}`);
      throw new Error(`Signing key validation failed in production. Set these environment variables with >=32 char values:\n${missing.join(', ')}`);
    } else {
      logger.warn(`[SigningKeys] ${msg}\n  This is acceptable in development but MUST be fixed before production.`);
    }
  } else {
    logger.info('[SigningKeys] All cryptographic signing keys validated');
  }
}

/**
 * Utility: race a promise against a timeout.
 */
function withTimeout<T>(ms: number, promise: Promise<T>, name: string): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`${name} connection timeout`)), ms)
    ),
  ]);
}

/**
 * Connect to all databases and initialize platform services.
 * Each connection is independent — failures don't block startup.
 */
export async function connectServices(): Promise<void> {
  // Validate cryptographic signing keys before any service initialization
  validateSigningKeys();

  // Sovereign mode validation — fail-fast in production if offline mode is misconfigured
  const sovereignResult = await sovereignMode.validate();
  if (!sovereignResult.valid && config.nodeEnv === 'production') {
    throw new Error(
      `Sovereign mode validation failed in production:\n  ${sovereignResult.errors.join('\n  ')}\n` +
      `System will not start in DATACENDIA_ONLINE_MODE=false without resolving these.`
    );
  }

  // PostgreSQL
  try {
    await withTimeout(5000, prisma.$connect(), 'PostgreSQL');
    logger.info('Connected to PostgreSQL');
    try {
      await applyPerformanceIndexes(prisma);
    } catch (indexErr) {
      logger.warn('Performance indexes could not be applied:', indexErr);
    }
  } catch (e) {
    logger.warn('PostgreSQL connection failed - some features may be unavailable:', e);
  }

  // Redis
  try {
    await withTimeout(3000, redis.ping(), 'Redis');
    logger.info('Connected to Redis');
  } catch (e) {
    logger.warn('Redis connection failed - caching disabled:', e);
  }

  // Neo4j (optional)
  try {
    const neo4jSession = neo4j.session();
    await withTimeout(3000, neo4jSession.run('RETURN 1'), 'Neo4j');
    await neo4jSession.close();
    logger.info('Connected to Neo4j');
  } catch (e) {
    logger.warn('Neo4j connection failed - graph features disabled:', e);
  }

  // Qdrant Vector Database (optional)
  try {
    const vectorReady = await vectorDB.initialize();
    if (vectorReady) {
      logger.info('Connected to Qdrant — CendiaVector™ neural search enabled');
    } else {
      logger.warn('Qdrant unavailable — using TF-IDF fallback for similarity search');
    }
  } catch (e) {
    logger.warn('Qdrant initialization failed — vector search disabled:', e);
  }

  // Platform services
  try {
    await registerPlatformServices();
    logger.info('Platform services registered');
  } catch (e) {
    logger.warn('Platform services registration failed:', e);
  }

  // Casbin policy engine
  try {
    await policyEngine.initialize();
    logger.info('Policy engine initialized');
  } catch (e) {
    logger.warn('Policy engine initialization failed:', e);
  }

  // Kafka (optional — KAFKA_ENABLED=true)
  try {
    const { kafka: kafkaService } = await import('../services/kafka/KafkaService.js');
    await kafkaService.connect();
    const { kafkaEventBridge } = await import('../services/kafka/KafkaEventBridge.js');
    await kafkaEventBridge.initialize();
    logger.info('[Kafka] Durable event streaming initialized');
  } catch (e) {
    logger.warn('[Kafka] Event streaming initialization failed — using in-memory buffer:', e);
  }

  // Temporal.io (optional — TEMPORAL_ENABLED=true)
  try {
    const { temporal: temporalService } = await import('../services/temporal/TemporalService.js');
    await temporalService.connect();
    logger.info('[Temporal] Workflow orchestration initialized');
  } catch (e) {
    logger.warn('[Temporal] Workflow orchestration initialization failed — using embedded mode:', e);
  }

  // OpenBao/Vault (optional — OPENBAO_ENABLED=true)
  try {
    const { openBao } = await import('../services/vault/OpenBaoService.js');
    await openBao.connect();
    logger.info('[OpenBao] Secrets management initialized');
  } catch (e) {
    logger.warn('[OpenBao] Secrets management initialization failed:', e);
  }

  // NVIDIA RAPIDS (optional — RAPIDS_ENABLED=true)
  try {
    const { rapids } = await import('../services/gpu/RAPIDSService.js');
    await rapids.connect();
    logger.info('[RAPIDS] GPU analytics initialized');
  } catch (e) {
    logger.warn('[RAPIDS] GPU analytics initialization failed — using CPU fallback:', e);
  }

  // Chronos Event Bus flush scheduler
  try {
    const { chronosEventBus } = await import('../services/ChronosEventBus.js');
    chronosEventBus.startFlushScheduler(30000);
    logger.info('[Chronos] Event bus flush scheduler started');
  } catch (e) {
    logger.warn('[Chronos] Event bus scheduler failed to start:', e);
  }

  // Echo automated outcome collection
  try {
    const { echoService } = await import('../services/echoService.js');
    echoService.startCollectionScheduler(60 * 60 * 1000);
    logger.info('[Echo] Automated collection scheduler started');
  } catch (e) {
    logger.warn('[Echo] Collection scheduler failed to start:', e);
  }

  // Database backup scheduler (production only)
  try {
    if (databaseBackupService.isEnabled()) {
      databaseBackupService.startScheduler();
      logger.info('[CendiaBackup] Automated backup scheduler started');
    } else {
      logger.info('[CendiaBackup] Backups disabled (set BACKUP_ENABLED=true for production)');
    }
  } catch (e) {
    logger.warn('[CendiaBackup] Backup scheduler failed to start:', e);
  }

  // MinIO Object Storage (sovereign document storage)
  try {
    const { minioService } = await import('../services/storage/MinioService.js');
    await withTimeout(5000, minioService.initialize(), 'MinIO');
    logger.info('[MinIO] Sovereign object storage initialized — buckets ready');
  } catch (e) {
    logger.warn('[MinIO] Object storage unavailable — document upload/download disabled:', e);
  }

  // ClickHouse Analytics (fast SQL analytics)
  try {
    const { clickhouseService } = await import('../services/storage/ClickHouseService.js');
    const available = await withTimeout(5000, clickhouseService.checkAvailability(), 'ClickHouse');
    if (available) {
      await clickhouseService.initializeTables();
      logger.info('[ClickHouse] Analytics storage initialized — tables ready');
    } else {
      logger.warn('[ClickHouse] Analytics storage unavailable — audit analytics disabled');
    }
  } catch (e) {
    logger.warn('[ClickHouse] Analytics initialization failed:', e);
  }

  // ClamAV Antivirus (enterprise malware scanning)
  try {
    const { clamAVIntegration } = await import('../services/sovereign/ClamAVIntegration.js');
    const clamAvailable = await withTimeout(5000, clamAVIntegration.ping(), 'ClamAV');
    if (clamAvailable) {
      logger.info('[ClamAV] Antivirus scanning enabled — real signature-based detection');
    } else {
      logger.info('[ClamAV] Daemon unavailable — using heuristic fallback scanner');
    }
  } catch (e) {
    logger.warn('[ClamAV] Antivirus initialization failed — heuristic fallback active:', e);
  }

  // OPA Policy Engine (embedded policy evaluation)
  try {
    const { opa } = await import('../services/opa/OPAService.js');
    const health = await withTimeout(5000, opa.checkHealth(), 'OPA');
    logger.info(`[OPA] Policy engine ready — ${health.policyCount} policies loaded (mode: ${health.mode})`);
  } catch (e) {
    logger.warn('[OPA] Policy engine health check failed:', e);
  }
}
