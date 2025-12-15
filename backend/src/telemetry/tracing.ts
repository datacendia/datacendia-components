// =============================================================================
// OPENTELEMETRY TRACING - Distributed Tracing for Full Observability
// =============================================================================
// Traces every request across all services for debugging and monitoring
// Exports to Tempo/Jaeger for visualization in Grafana
// =============================================================================

import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { SpanStatusCode, trace, SpanKind } from '@opentelemetry/api';

// Tracing configuration
const TRACING_CONFIG = {
  serviceName: process.env.OTEL_SERVICE_NAME || 'cendia-backend',
  tempoUrl: process.env.TEMPO_URL || 'http://localhost:4318/v1/traces',
  enabled: process.env.TRACING_ENABLED !== 'false',
};

let sdk: NodeSDK | null = null;

/**
 * Initialize OpenTelemetry tracing
 */
export function initTracing(): void {
  if (!TRACING_CONFIG.enabled) {
    console.log('[Tracing] Disabled by configuration');
    return;
  }

  try {
    const exporter = new OTLPTraceExporter({
      url: TRACING_CONFIG.tempoUrl,
    });

    sdk = new NodeSDK({
      serviceName: TRACING_CONFIG.serviceName,
      traceExporter: exporter,
      instrumentations: [
        getNodeAutoInstrumentations({
          '@opentelemetry/instrumentation-fs': { enabled: false },
          '@opentelemetry/instrumentation-http': { enabled: true },
          '@opentelemetry/instrumentation-express': { enabled: true },
          '@opentelemetry/instrumentation-pg': { enabled: true },
          '@opentelemetry/instrumentation-redis': { enabled: true },
        }),
      ],
    });

    sdk.start();
    console.log('[Tracing] OpenTelemetry initialized, exporting to:', TRACING_CONFIG.tempoUrl);

    // Graceful shutdown
    process.on('SIGTERM', () => {
      sdk?.shutdown()
        .then(() => console.log('[Tracing] Shutdown complete'))
        .catch((err) => console.error('[Tracing] Shutdown error:', err));
    });
  } catch (error: any) {
    console.error('[Tracing] Initialization failed:', error.message);
  }
}

/**
 * Get the tracer instance
 */
export function getTracer(name: string = 'cendia') {
  return trace.getTracer(name);
}

/**
 * Create a custom span for tracking operations
 */
export async function withSpan<T>(
  name: string,
  operation: () => Promise<T>,
  attributes?: Record<string, string | number | boolean>
): Promise<T> {
  const tracer = getTracer();
  
  return tracer.startActiveSpan(name, { kind: SpanKind.INTERNAL }, async (span) => {
    try {
      if (attributes) {
        Object.entries(attributes).forEach(([key, value]) => {
          span.setAttribute(key, value);
        });
      }
      
      const result = await operation();
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error: any) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}

/**
 * Track a Council deliberation session
 */
export function traceDeliberation(sessionId: string, question: string, agents: string[]) {
  const tracer = getTracer('council');
  const span = tracer.startSpan('council.deliberation', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'council.session_id': sessionId,
      'council.question': question.substring(0, 100),
      'council.agent_count': agents.length,
      'council.agents': agents.join(','),
    },
  });
  
  return {
    addAgentResponse: (agentId: string, duration: number) => {
      span.addEvent('agent_response', {
        agent_id: agentId,
        duration_ms: duration,
      });
    },
    setConsensus: (reached: boolean, confidence: number) => {
      span.setAttribute('council.consensus_reached', reached);
      span.setAttribute('council.confidence', confidence);
    },
    end: (success: boolean) => {
      span.setStatus({ 
        code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR 
      });
      span.end();
    },
  };
}

/**
 * Track a document processing operation
 */
export function traceDocumentProcessing(documentId: string, fileName: string) {
  const tracer = getTracer('gnosis');
  const span = tracer.startSpan('document.processing', {
    kind: SpanKind.INTERNAL,
    attributes: {
      'document.id': documentId,
      'document.filename': fileName,
    },
  });
  
  return {
    setExtraction: (textLength: number, format: string) => {
      span.setAttribute('document.text_length', textLength);
      span.setAttribute('document.format', format);
    },
    setEmbedding: (chunkCount: number) => {
      span.setAttribute('document.chunk_count', chunkCount);
    },
    end: (success: boolean) => {
      span.setStatus({ 
        code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR 
      });
      span.end();
    },
  };
}

/**
 * Track an analytics query
 */
export function traceAnalyticsQuery(queryType: string, backend: string) {
  const tracer = getTracer('analytics');
  const span = tracer.startSpan('analytics.query', {
    kind: SpanKind.CLIENT,
    attributes: {
      'analytics.query_type': queryType,
      'analytics.backend': backend,
    },
  });
  
  return {
    setResult: (rowCount: number, queryTime: number) => {
      span.setAttribute('analytics.row_count', rowCount);
      span.setAttribute('analytics.query_time_ms', queryTime);
    },
    end: (success: boolean) => {
      span.setStatus({ 
        code: success ? SpanStatusCode.OK : SpanStatusCode.ERROR 
      });
      span.end();
    },
  };
}

export default {
  initTracing,
  getTracer,
  withSpan,
  traceDeliberation,
  traceDocumentProcessing,
  traceAnalyticsQuery,
};
