// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * @module startup/shutdown
 * @description Graceful shutdown handlers for SIGTERM/SIGINT.
 * Closes all database connections and stops schedulers.
 * Extracted from index.ts for modularity (F21 audit item).
 */

import type { Server } from 'http';
import { prisma } from '../config/database.js';
import { redis } from '../config/redis.js';
import { neo4j } from '../config/neo4j.js';
import { logger } from '../utils/logger.js';
import { databaseBackupService } from '../services/backup/index.js';
import { vectorDB } from '../services/vectordb/index.js';

/**
 * Register SIGTERM/SIGINT handlers for graceful shutdown.
 * Closes all database connections and stops schedulers.
 */
export function registerShutdownHandlers(httpServer: Server): void {
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received. Starting graceful shutdown...`);

    httpServer.close(async () => {
      logger.info('HTTP server closed');

      try {
        await prisma.$disconnect();
        logger.info('PostgreSQL connection closed');

        await redis.quit();
        logger.info('Redis connection closed');

        await neo4j.close();
        logger.info('Neo4j connection closed');

        await vectorDB.shutdown();
        logger.info('Qdrant connection closed');

        databaseBackupService.stopScheduler();
        logger.info('Backup scheduler stopped');

        process.exit(0);
      } catch (error) {
        logger.error('Error during shutdown:', error);
        process.exit(1);
      }
    });

    // Force shutdown after 30 seconds
    setTimeout(() => {
      logger.error('Forced shutdown due to timeout');
      process.exit(1);
    }, 30000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));
}
