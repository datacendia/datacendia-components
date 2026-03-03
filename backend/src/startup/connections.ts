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
import { policyEngine } from '../security/PolicyEngine.js';
import { databaseBackupService } from '../services/backup/index.js';
import { vectorDB } from '../services/vectordb/index.js';
import { registerPlatformServices } from '../core/services/PlatformServices.js';
import { applyPerformanceIndexes } from './applyIndexes.js';

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
}
