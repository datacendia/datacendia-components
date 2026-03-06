// Copyright (c) 2024-2026 Datacendia, Inc. All Rights Reserved.
// See LICENSE file for details.

/**
 * DATACENDIA PLATFORM — BACKEND API SERVER
 * 
 * Slim entry point. All logic is modularized into:
 *   startup/middleware.ts  — Express middleware pipeline
 *   startup/routes.ts     — API route mounting
 *   startup/connections.ts — Database & service initialization
 *   startup/shutdown.ts   — Graceful shutdown handlers
 */

import express from 'express';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { SocketServer } from './websocket/SocketServer.js';

import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { initTracing } from './telemetry/tracing.js';

// Modular startup components
import { setupMiddleware, setupErrorHandling, serveFrontendStatic } from './startup/middleware.js';
import { mountRoutes } from './startup/routes.js';
import { connectServices } from './startup/connections.js';
import { registerShutdownHandlers } from './startup/shutdown.js';
import { setupWebSocketHandlers } from './websocket/index.js';

// Initialize OpenTelemetry tracing (must be before other imports)
initTracing();

// =============================================================================
// CREATE APP + SERVER
// =============================================================================

const app = express();
const httpServer = createServer(app);

const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// =============================================================================
// PIPELINE: Middleware → Routes → Error Handling → WebSocket → Shutdown
// =============================================================================

setupMiddleware(app);
mountRoutes(app);
serveFrontendStatic(app);
setupErrorHandling(app);
setupWebSocketHandlers(io);
registerShutdownHandlers(httpServer);

// =============================================================================
// START SERVER
// =============================================================================

let socketServer: SocketServer | null = null;

const startServer = async () => {
  try {
    const listenHost = config.nodeEnv === 'development' && process.platform === 'win32'
      ? '127.0.0.1'
      : undefined;

    httpServer.listen(config.port, listenHost, () => {
      logger.info(`🚀 Datacendia API running on port ${config.port}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
    });

    // Initialize WebSocket server
    try {
      socketServer = new SocketServer(httpServer);
      logger.info('[WebSocket] Real-time streaming enabled');
    } catch (error) {
      logger.error('[WebSocket] Failed to initialize:', error);
    }

    // Connect all databases and services (non-blocking, each fails independently)
    await connectServices();

  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io, socketServer };
