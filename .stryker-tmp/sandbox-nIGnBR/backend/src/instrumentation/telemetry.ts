// @ts-nocheck
// =============================================================================
// OPENTELEMETRY INSTRUMENTATION
// Production-grade observability for enterprise deployments
// Provides: Distributed tracing, metrics, structured logging
// =============================================================================

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { OTLPMetricExporter } from '@opentelemetry/exporter-metrics-otlp-http';
import { PrometheusExporter } from '@opentelemetry/exporter-prometheus';
import * as resources from '@opentelemetry/resources';
import { PeriodicExportingMetricReader } from '@opentelemetry/sdk-metrics';
import { BatchSpanProcessor } from '@opentelemetry/sdk-trace-base';
import { DiagConsoleLogger, DiagLogLevel, diag } from '@opentelemetry/api';

// =============================================================================
// CONFIGURATION
// =============================================================================

const SERVICE_NAME = process.env.OTEL_SERVICE_NAME || 'datacendia-backend';
const SERVICE_VERSION = process.env.SERVICE_VERSION || '1.0.0';
const ENVIRONMENT = process.env.NODE_ENV || 'development';

const OTLP_ENDPOINT = process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318';
const PROMETHEUS_PORT = parseInt(process.env.PROMETHEUS_PORT || '9464');

// Enable debug logging in development
if (ENVIRONMENT === 'development') {
  diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);
}

// =============================================================================
// RESOURCE DEFINITION
// =============================================================================

const resource = resources.resourceFromAttributes({
  'service.name': SERVICE_NAME,
  'service.version': SERVICE_VERSION,
  'deployment.environment': ENVIRONMENT,
  'service.namespace': 'datacendia',
  'service.instance.id': process.env.HOSTNAME || 'local',
});

// =============================================================================
// EXPORTERS
// =============================================================================

// OTLP Trace Exporter (for Jaeger, Tempo, etc.)
const traceExporter = new OTLPTraceExporter({
  url: `${OTLP_ENDPOINT}/v1/traces`,
});

// OTLP Metric Exporter
const metricExporter = new OTLPMetricExporter({
  url: `${OTLP_ENDPOINT}/v1/metrics`,
});

// Prometheus Exporter (for Grafana scraping)
const prometheusExporter = new PrometheusExporter({
  port: PROMETHEUS_PORT,
  endpoint: '/metrics',
});

// =============================================================================
// SDK INITIALIZATION
// =============================================================================

export const sdk = new NodeSDK({
  resource,
  traceExporter,
  spanProcessor: new BatchSpanProcessor(traceExporter),
  metricReader: new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 15000,
  }),
  instrumentations: [
    getNodeAutoInstrumentations(),
  ],
});

// =============================================================================
// CUSTOM METRICS
// =============================================================================

import { metrics, Counter, Histogram, UpDownCounter } from '@opentelemetry/api';

const meter = metrics.getMeter(SERVICE_NAME, SERVICE_VERSION);

// Decision metrics
export const decisionCounter = meter.createCounter('datacendia.decisions.total', {
  description: 'Total number of decisions processed',
  unit: '1',
});

export const decisionDuration = meter.createHistogram('datacendia.decisions.duration', {
  description: 'Duration of decision processing',
  unit: 'ms',
});

// Council deliberation metrics
export const deliberationCounter = meter.createCounter('datacendia.deliberations.total', {
  description: 'Total number of council deliberations',
  unit: '1',
});

export const deliberationDuration = meter.createHistogram('datacendia.deliberations.duration', {
  description: 'Duration of council deliberations',
  unit: 'ms',
});

export const agentResponseTime = meter.createHistogram('datacendia.agents.response_time', {
  description: 'Agent response time in deliberations',
  unit: 'ms',
});

// Ollama/LLM metrics
export const ollamaRequestCounter = meter.createCounter('datacendia.ollama.requests.total', {
  description: 'Total Ollama API requests',
  unit: '1',
});

export const ollamaLatency = meter.createHistogram('datacendia.ollama.latency', {
  description: 'Ollama API response latency',
  unit: 'ms',
});

export const ollamaTokensProcessed = meter.createCounter('datacendia.ollama.tokens.total', {
  description: 'Total tokens processed by Ollama',
  unit: '1',
});

// Monte Carlo simulation metrics
export const monteCarloCounter = meter.createCounter('datacendia.monte_carlo.simulations.total', {
  description: 'Total Monte Carlo simulations run',
  unit: '1',
});

export const monteCarloIterations = meter.createHistogram('datacendia.monte_carlo.iterations', {
  description: 'Iterations per Monte Carlo simulation',
  unit: '1',
});

export const monteCarloDuration = meter.createHistogram('datacendia.monte_carlo.duration', {
  description: 'Duration of Monte Carlo simulations',
  unit: 'ms',
});

// Autopilot metrics
export const autopilotDecisions = meter.createCounter('datacendia.autopilot.decisions.total', {
  description: 'Total autonomous decisions',
  unit: '1',
});

export const autopilotApprovals = meter.createCounter('datacendia.autopilot.approvals.total', {
  description: 'Total approved autonomous decisions',
  unit: '1',
});

export const autopilotRejections = meter.createCounter('datacendia.autopilot.rejections.total', {
  description: 'Total rejected autonomous decisions',
  unit: '1',
});

// Queue metrics
export const queueDepth = meter.createUpDownCounter('datacendia.queue.depth', {
  description: 'Current queue depth',
  unit: '1',
});

export const queueProcessingTime = meter.createHistogram('datacendia.queue.processing_time', {
  description: 'Queue job processing time',
  unit: 'ms',
});

// Authentication metrics
export const authAttempts = meter.createCounter('datacendia.auth.attempts.total', {
  description: 'Total authentication attempts',
  unit: '1',
});

export const authFailures = meter.createCounter('datacendia.auth.failures.total', {
  description: 'Total authentication failures',
  unit: '1',
});

// Active users gauge
export const activeUsers = meter.createUpDownCounter('datacendia.users.active', {
  description: 'Currently active users',
  unit: '1',
});

// =============================================================================
// STARTUP
// =============================================================================

export async function startTelemetry(): Promise<void> {
  try {
    await sdk.start();
    console.log('🔭 OpenTelemetry instrumentation started');
    console.log(`   - Traces: ${OTLP_ENDPOINT}/v1/traces`);
    console.log(`   - Metrics: ${OTLP_ENDPOINT}/v1/metrics`);
    console.log(`   - Prometheus: http://localhost:${PROMETHEUS_PORT}/metrics`);
  } catch (error) {
    console.error('Failed to start OpenTelemetry:', error);
  }
}

export async function stopTelemetry(): Promise<void> {
  try {
    await sdk.shutdown();
    console.log('🔭 OpenTelemetry instrumentation stopped');
  } catch (error) {
    console.error('Failed to stop OpenTelemetry:', error);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  await stopTelemetry();
  process.exit(0);
});

process.on('SIGINT', async () => {
  await stopTelemetry();
  process.exit(0);
});
