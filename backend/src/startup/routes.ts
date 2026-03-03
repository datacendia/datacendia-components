/**
 * Route Mounting — All API route registration
 * Extracted from index.ts for modularity (F21 audit item)
 */

import type { Express } from 'express';
import { logger } from '../utils/logger.js';

// Domain Routers - 14 logical groups replacing 110+ individual route imports
import {
  authDomain,
  councilDomain,
  dataDomain,
  governanceDomain,
  securityDomain,
  sovereignDomain,
  enterpriseDomain,
  legalDomain,
  verticalsDomain,
  platformDomain,
  simulationDomain,
  workflowsDomain,
  intelligenceDomain,
  demoDomain,
} from '../routes/domains/index.js';

// Special routes that need non-standard mounting
import prometheusRoutes from '../routes/prometheus.js';
import recallRoutes from '../routes/recall.js';
import euBankingRoutes from '../routes/eu-banking.js';
import kafkaRoutes from '../routes/kafka.js';
import guardrailsRoutes from '../routes/guardrails.js';
import opaRoutes from '../routes/opa.js';
import temporalRoutes from '../routes/temporal.js';
import openbaoRoutes from '../routes/openbao.js';
import rapidsRoutes from '../routes/rapids.js';
import flinkRoutes from '../routes/flink.js';
import billingRoutes from '../routes/billing.js';
import gatewayRoutes from '../routes/gateway.js';

/**
 * Mount all API routes on the Express app.
 * Prometheus metrics are mounted before auth middleware.
 */
export function mountRoutes(app: Express): void {
  // Prometheus metrics — before middleware so scraping works without auth
  app.use('/metrics', prometheusRoutes);

  // =========================================================================
  // DOMAIN ROUTERS (14 domains, ~110 route modules)
  // All paths: /api/v1/{original-path}
  // =========================================================================
  app.use('/api/v1', authDomain);        // auth, users, organizations
  app.use('/api/v1', councilDomain);     // council, deliberations, decisions, veto, union, dissent, vox, echo
  app.use('/api/v1', dataDomain);        // metrics, alerts, forecasts, data-sources, lineage, druid, rag, graph, horizon
  app.use('/api/v1', governanceDomain);  // compliance, govern, panopticon, pillars, responsibility, constitutional-court
  app.use('/api/v1', securityDomain);    // crucible, aegis, kms, post-quantum, zkp, adversarial-redteam, redteam
  app.use('/api/v1', sovereignDomain);   // sovereign-organs, sovereign-infra, sovereign-arch, vault, evidence, mesh, eternal
  app.use('/api/v1', enterpriseDomain);  // enterprise, ledger, audit-packages, ai-insurance, cascade, connectors, hr
  app.use('/api/v1', legalDomain);       // legal, legal-research, legal-services
  app.use('/api/v1', verticalsDomain);   // financial, healthcare, insurance, energy, defense, sports, vertical-agents
  app.use('/api/v1', platformDomain);    // platform, core, cortex, admin, settings, health, i18n, notifications, upload
  app.use('/api/v1', simulationDomain);  // sgas, scge, collapse
  app.use('/api/v1', workflowsDomain);   // workflows, integrations, scheduler
  app.use('/api/v1', intelligenceDomain); // persona, autopilot, decision-intel, gnosis, apotheosis, visualization
  app.use('/api/v1', demoDomain);        // leads, premium, demo, consolidated

  // Express Intelligence — enterprise route loaded dynamically
  import('../routes/express.js').then(mod => {
    app.use('/api/v1/express', mod.default as any);
  }).catch(() => { /* Enterprise module not available */ });

  // =========================================================================
  // SPECIAL ROUTES (non-standard mounting paths)
  // =========================================================================
  app.use('/api/v1', recallRoutes);                      // CendiaRecall™ — Decision Outcome Tracking
  app.use('/api/v1/eu-banking', euBankingRoutes);        // EU Banking — Basel III + EU AI Act compliance
  app.use('/api/v1/kafka', kafkaRoutes);                 // Kafka admin & monitoring
  app.use('/api/v1/guardrails', guardrailsRoutes);       // NeMo Guardrails admin & evaluation
  app.use('/api/v1/opa', opaRoutes);                     // Open Policy Agent policy-as-code
  app.use('/api/v1/temporal', temporalRoutes);           // Temporal.io workflow orchestration
  app.use('/api/v1/openbao', openbaoRoutes);             // OpenBao/Vault secrets & KMS
  app.use('/api/v1/rapids', rapidsRoutes);               // NVIDIA RAPIDS GPU analytics + Confidential Computing
  app.use('/api/v1/flink', flinkRoutes);                 // Apache Flink CEP stream processing
  app.use('/api/v1', billingRoutes);                     // Stripe billing & checkout
  app.use('/api/v1/gateway', gatewayRoutes);             // CendiaGateway™ AI Governance Gateway

  logger.info('All API routes mounted');
}
