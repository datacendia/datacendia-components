import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import { createServer } from 'http';
import { Server as SocketIOServer } from 'socket.io';
import { rateLimit } from 'express-rate-limit';

import { config } from './config/index.js';
import { logger } from './utils/logger.js';
import { prisma } from './config/database.js';
import swaggerUi from 'swagger-ui-express';
import { swaggerSpec } from './config/swagger.js';
import { redis } from './config/redis.js';
import { neo4j } from './config/neo4j.js';
import { errorHandler } from './middleware/errorHandler.js';
import { requestLogger } from './middleware/requestLogger.js';

// Security Hardening
import { 
  threatDetectionMiddleware,
  advancedRateLimitMiddleware,
  createAuditLog 
} from './security/SecurityHardening.js';
import { customSecurityHeaders } from './security/headers.js';
import { 
  masterSecurityMiddleware,
  preventDataExfiltration,
  preventReplayAttack 
} from './security/DefenseInDepth.js';
import { honeypotMiddleware } from './security/Honeypot.js';
import { csrfProtection, csrfTokenHandler, ensureCsrfToken } from './middleware/csrf.js';

// Telemetry & Enterprise Services
import { initTracing } from './telemetry/tracing.js';
import { policyEngine } from './security/PolicyEngine.js';

// Initialize OpenTelemetry tracing (must be before other imports that need instrumentation)
initTracing();

// Route imports
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import organizationRoutes from './routes/organizations.js';
import metricsRoutes from './routes/metrics.js';
import alertsRoutes from './routes/alerts.js';
import healthRoutes from './routes/health.js';
import councilRoutes from './routes/council.js';
import graphRoutes from './routes/graph.js';
import workflowRoutes from './routes/workflows.js';
import forecastRoutes from './routes/forecasts.js';
import dataSourceRoutes from './routes/dataSources.js';
import lineageRoutes from './routes/lineage.js';
import integrationsRoutes from './routes/integrations.js';
import demoRoutes from './routes/demo.js';
import platformRoutes from './routes/platform.js';
import holyShitRoutes from './routes/holyShit.js';
import deliberationsRoutes from './routes/deliberations.js';
import deliberationsApiRoutes from './routes/deliberationsApi.js';
import decisionsRoutes from './routes/decisions.js';
import uploadRoutes from './routes/upload.js';
import i18nRoutes from './routes/i18n.js';
import summaryRoutes from './routes/summaries.js';
import modelRoutes from './routes/models.js';
import adminSettingsRoutes from './routes/admin-settings.js';
import ragRoutes from './routes/rag.js';
import vetoRoutes from './routes/veto.js';
import unionRoutes from './routes/union.js';
import ledgerRoutes from './routes/ledger.js';
import hrRoutes from './routes/hr.js';
import salaryRoutes from './routes/salary.js';
import coreRoutes from './routes/core.js';
import enterpriseRoutes from './routes/enterprise.js';
import adminRoutes from './routes/admin.js';
import settingsRoutes from './routes/settings.js';
import pillarsRoutes from './routes/pillars.js';
import complianceRoutes from './routes/compliance.js';
import crucibleRoutes from './routes/crucible.js';
import panopticonRoutes from './routes/panopticon.js';
import aegisRoutes from './routes/aegis.js';
import eternalRoutes from './routes/eternal.js';
import symbiontRoutes from './routes/symbiont.js';
import voxRoutes from './routes/vox.js';
import sovereignOrgansRoutes from './routes/sovereign-organs.js';
import sovereignSecurityRoutes from './routes/sovereign-security.js';
import meshRoutes from './routes/mesh.js';
import personaRoutes from './routes/persona.js';
import governRoutes from './routes/govern.js';
import autopilotRoutes from './routes/autopilot.js';
import decisionIntelRoutes from './routes/decision-intel.js';
import errorRoutes from './routes/errors.js';
import contactRoutes from './routes/contact.js';
import echoRoutes from './routes/echo.js';
import redteamRoutes from './routes/redteam.js';
import gnosisRoutes from './routes/gnosis.js';
import apotheosisRoutes from './routes/apotheosis.js';
import dissentRoutes from './routes/dissent.js';
import sovereignRoutes from './routes/sovereign.js';
import enterpriseSecurityRoutes from './routes/enterprise.security.js';
import sovereignArchRoutes from './routes/sovereign-arch.js';
import evidenceRoutes from './routes/evidence.js';
import omnitranslateRoutes from './routes/omnitranslate.js';
import connectorsRoutes from './routes/connectors.js';
import cascadeRoutes from './routes/cascade.js';
import adaptersRoutes from './routes/adapters.js';
import strategicRoutes from './routes/strategic.js';
import sampleDataRoutes from './routes/sample-data.js';
import druidRoutes from './routes/druid.js';
import horizonRoutes from './routes/horizon.js';
import { registerPlatformServices } from './core/services/PlatformServices.js';

// WebSocket handlers
import { setupWebSocketHandlers } from './websocket/index.js';

const app = express();
const httpServer = createServer(app);

// Socket.IO setup with Redis adapter for scaling
const io = new SocketIOServer(httpServer, {
  cors: {
    origin: config.corsOrigins,
    methods: ['GET', 'POST'],
    credentials: true,
  },
  pingTimeout: 60000,
  pingInterval: 25000,
});

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", 'data:', 'https:'],
    },
  },
}));

// CORS configuration - allow any localhost/127.0.0.1 origin in development
app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // In development, allow any localhost or 127.0.0.1 origin
    if (config.nodeEnv === 'development') {
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        return callback(null, true);
      }
    }
    
    // Check against configured origins
    if (config.corsOrigins.includes(origin)) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'X-Data-Source-Id', 'x-data-source-id'],
}));

// Rate limiting (higher limit for dev/test)
const limiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: config.nodeEnv === 'production' ? 100 : 1000, // Higher limit in dev
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  skip: () => config.nodeEnv === 'test', // Skip in test environment
});
app.use('/api/', limiter);

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Cookie parser for CSRF tokens
import cookieParser from 'cookie-parser';
app.use(cookieParser());

// Compression
app.use(compression());

// Request logging
app.use(requestLogger);

// Custom security headers
app.use(customSecurityHeaders);

// Honeypot/deception - catches attackers probing for vulnerabilities
app.use(honeypotMiddleware);

// Master security middleware (all attack protections)
if (config.nodeEnv === 'production') {
  app.use(masterSecurityMiddleware);
  app.use(preventReplayAttack);
  app.use(preventDataExfiltration);
  app.use(threatDetectionMiddleware);
}
// NOTE: Threat detection disabled in dev - SQL patterns too aggressive for AI content

// CSRF Protection - apply to state-changing API routes
// Token endpoint is exempt so clients can get initial token
app.get('/api/v1/csrf-token', csrfTokenHandler);
app.use('/api/', ensureCsrfToken);
if (config.nodeEnv === 'production') {
  app.use('/api/', csrfProtection);
}

// Health check endpoint (no auth required)
app.get('/health', (_req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// OpenAPI/Swagger Documentation (dev only)
if (config.nodeEnv === 'development') {
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
    explorer: true,
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'Datacendia API Documentation',
  }));
  app.get('/api/docs.json', (_req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
  logger.info('📚 API Documentation available at /api/docs');
}

// API Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/organizations', organizationRoutes);
app.use('/api/v1/metrics', metricsRoutes);
app.use('/api/v1/alerts', alertsRoutes);
app.use('/api/v1/health', healthRoutes);
app.use('/api/v1/council/deliberations', deliberationsRoutes); // Must come BEFORE /council
app.use('/api/v1/council', councilRoutes);
app.use('/api/v1/graph', graphRoutes);
app.use('/api/v1/workflows', workflowRoutes);
app.use('/api/v1/predict', forecastRoutes);
app.use('/api/v1/data-sources', dataSourceRoutes);
app.use('/api/v1/lineage', lineageRoutes);
app.use('/api/v1/integrations', integrationsRoutes);
app.use('/api/v1/leads', demoRoutes);
app.use('/api/v1/platform', platformRoutes);
app.use('/api/v1/premium', holyShitRoutes);
app.use('/api/v1/deliberations', deliberationsApiRoutes);  // New Prisma-based API
app.use('/api/v1/decisions', decisionsRoutes);
app.use('/api/v1/upload', uploadRoutes);
app.use('/api/v1/i18n', i18nRoutes);
app.use('/api/v1/summaries', summaryRoutes);
app.use('/api/v1/models', modelRoutes);
app.use('/api/v1/admin/settings', adminSettingsRoutes);
app.use('/api/v1/rag', ragRoutes);
app.use('/api/v1/veto', vetoRoutes);
app.use('/api/v1/union', unionRoutes);
app.use('/api/v1/ledger', ledgerRoutes);
app.use('/api/v1/hr', hrRoutes);
app.use('/api/v1/salary', salaryRoutes);
app.use('/api/v1/core', coreRoutes);
app.use('/api/v1/enterprise/security', enterpriseSecurityRoutes);
app.use('/api/v1/enterprise', enterpriseRoutes);
app.use('/api/v1/admin', adminRoutes);
app.use('/api/v1/settings', settingsRoutes);
app.use('/api/v1/pillars', pillarsRoutes);
app.use('/api/v1/compliance', complianceRoutes);
app.use('/api/v1/crucible', crucibleRoutes);
app.use('/api/v1/panopticon', panopticonRoutes);
app.use('/api/v1/aegis', aegisRoutes);
app.use('/api/v1/eternal', eternalRoutes);
app.use('/api/v1/symbiont', symbiontRoutes);
app.use('/api/v1/vox', voxRoutes);
app.use('/api/v1/sovereign', sovereignOrgansRoutes);
app.use('/api/v1/security', sovereignSecurityRoutes);
app.use('/api/v1/mesh', meshRoutes);
app.use('/api/v1/persona', personaRoutes);
app.use('/api/v1/govern', governRoutes);
app.use('/api/v1/autopilot', autopilotRoutes);
app.use('/api/v1/decision-intel', decisionIntelRoutes);
app.use('/api/v1/errors', errorRoutes);
app.use('/api/v1/contact', contactRoutes);

// Crown Jewels - Premium Services
app.use('/api/v1/echo', echoRoutes);
app.use('/api/v1/redteam', redteamRoutes);
app.use('/api/v1/gnosis', gnosisRoutes);
app.use('/api/v1/apotheosis', apotheosisRoutes);
app.use('/api/v1/dissent', dissentRoutes);
app.use('/api/v1/sovereign', sovereignRoutes);
app.use('/api/v1/sovereign-arch', sovereignArchRoutes);
app.use('/api/v1/evidence', evidenceRoutes);
app.use('/api/v1/omnitranslate', omnitranslateRoutes);
app.use('/api/v1/connectors', connectorsRoutes);

// Decision Consequence Engineering
app.use('/api/v1/cascade', cascadeRoutes);
app.use('/api/v1/adapters', adaptersRoutes);

// Strategic Services - Investor-Aligned Capabilities
app.use('/api/v1/strategic', strategicRoutes);

// Sample Data - Auto-populate demo data for data sources
app.use('/api/v1/sample-data', sampleDataRoutes);

// Druid Analytics - CendiaChronos™, CendiaWitness™, CendiaPulse™
app.use('/api/v1/druid', druidRoutes);

// CendiaHorizon™ - Predictive Decision Intelligence
app.use('/api/v1/horizon', horizonRoutes);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    error: { code: 'NOT_FOUND', message: 'Resource not found' },
  });
});

// Global error handler
app.use(errorHandler);

// Setup WebSocket handlers
setupWebSocketHandlers(io);

// Graceful shutdown
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

// Start server
const startServer = async () => {
  try {
    const listenHost = config.nodeEnv === 'development' && process.platform === 'win32'
      ? '127.0.0.1'
      : undefined;

    httpServer.listen(config.port, listenHost, () => {
      logger.info(`🚀 Datacendia API running on port ${config.port}`);
      logger.info(`📊 Environment: ${config.nodeEnv}`);
    });

    // Test database connections with timeouts
    const timeout = (ms: number, promise: Promise<any>, name: string) =>
      Promise.race([
        promise,
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error(`${name} connection timeout`)), ms)
        ),
      ]);

    // PostgreSQL
    try {
      await timeout(5000, prisma.$connect(), 'PostgreSQL');
      logger.info('Connected to PostgreSQL');
    } catch (e) {
      logger.warn('PostgreSQL connection failed - some features may be unavailable:', e);
    }

    // Redis
    try {
      await timeout(3000, redis.ping(), 'Redis');
      logger.info('Connected to Redis');
    } catch (e) {
      logger.warn('Redis connection failed - caching disabled:', e);
    }

    // Neo4j (optional - don't block startup)
    try {
      const neo4jSession = neo4j.session();
      await timeout(3000, neo4jSession.run('RETURN 1'), 'Neo4j');
      await neo4jSession.close();
      logger.info('Connected to Neo4j');
    } catch (e) {
      logger.warn('Neo4j connection failed - graph features disabled:', e);
    }

    // Register platform services with health monitoring
    try {
      await registerPlatformServices();
      logger.info('Platform services registered');
    } catch (e) {
      logger.warn('Platform services registration failed:', e);
    }

    // Initialize Casbin policy engine
    try {
      await policyEngine.initialize();
      logger.info('Policy engine initialized');
    } catch (e) {
      logger.warn('Policy engine initialization failed:', e);
    }
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export { app, io };
