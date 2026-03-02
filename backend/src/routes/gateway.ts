/**
 * CendiaGateway™ — AI Governance Gateway Routes
 * 
 * Endpoints:
 *   POST   /api/gateway/proxy/:provider/*     — Reverse proxy to AI provider
 *   GET    /api/gateway/stats                  — Gateway statistics dashboard
 *   GET    /api/gateway/interactions            — List all interactions
 *   GET    /api/gateway/interactions/:id        — Get single interaction
 *   GET    /api/gateway/providers               — List configured providers
 *   GET    /api/gateway/policies                — List gateway policies
 *   POST   /api/gateway/policies                — Create a new policy
 *   PUT    /api/gateway/policies/:id            — Update a policy
 *   DELETE /api/gateway/policies/:id            — Delete a policy
 *   POST   /api/gateway/manifest                — Generate AI Manifest™
 *   POST   /api/gateway/test-pii               — Test PII detection on sample text
 * 
 *   OpenAI-compatible passthrough:
 *   POST   /api/gateway/v1/chat/completions     — OpenAI-compatible endpoint
 *   POST   /api/gateway/v1/messages             — Anthropic-compatible endpoint
 */

import { Router, Request, Response } from 'express';
import CendiaGatewayService from '../services/gateway/CendiaGatewayService';
import { scanForPII } from '../services/gateway/PIIDetector';

const router = Router();

// Get service singleton
function getGateway(): CendiaGatewayService {
  return CendiaGatewayService.getInstance();
}

// Helper to extract user info from request (JWT or API key auth)
function extractUserInfo(req: Request): {
  userId: string;
  userEmail: string;
  userDepartment: string;
  organizationId: string;
} {
  // From JWT auth middleware (if authenticated)
  const user = (req as any).user;
  if (user) {
    return {
      userId: user.id || 'anonymous',
      userEmail: user.email || 'unknown@unknown.com',
      userDepartment: user.department || 'unknown',
      organizationId: user.organizationId || 'default-org',
    };
  }

  // From custom headers (for API key auth / programmatic access)
  return {
    userId: (req.headers['x-gateway-user-id'] as string) || 'anonymous',
    userEmail: (req.headers['x-gateway-user-email'] as string) || 'unknown@unknown.com',
    userDepartment: (req.headers['x-gateway-department'] as string) || 'unknown',
    organizationId: (req.headers['x-gateway-org-id'] as string) || 'default-org',
  };
}

// =============================================================================
// REVERSE PROXY — OpenAI-compatible endpoint
// =============================================================================

router.post('/v1/chat/completions', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);
    const model = req.body?.model || 'gpt-4o';

    // Determine provider from model name
    let provider = 'openai';
    if (model.startsWith('claude')) provider = 'anthropic';
    else if (model.startsWith('gemini')) provider = 'google';
    else if (['llama', 'mistral', 'codellama', 'phi'].some(p => model.startsWith(p))) provider = 'ollama';

    const interaction = await gateway.processRequest({
      provider,
      model,
      endpoint: '/v1/chat/completions',
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => typeof v === 'string') as [string, string][]
      ),
      body: req.body,
      ...userInfo,
    });

    // If blocked by policy, return a structured error
    if (interaction.policyAction === 'block') {
      return res.status(403).json({
        error: {
          message: `Request blocked by CendiaGateway policy: ${interaction.policyReason}`,
          type: 'gateway_policy_block',
          code: 'policy_violation',
          gateway_interaction_id: interaction.id,
          pii_detected: interaction.piiScan.types,
        },
      });
    }

    // Return the provider's response (or gateway error)
    if (interaction.response) {
      // Add gateway metadata headers
      res.set('X-Gateway-Interaction-Id', interaction.id);
      res.set('X-Gateway-Integrity-Hash', interaction.integrityHash);
      res.set('X-Gateway-PII-Detected', String(interaction.piiScan.hasPII));
      res.set('X-Gateway-Policy-Action', interaction.policyAction);
      res.set('X-Gateway-Latency-Ms', String(interaction.latencyMs));

      return res.status(interaction.response.statusCode).json(interaction.response.body);
    }

    return res.status(500).json({ error: 'No response from provider' });
  } catch (err: any) {
    console.error('[CendiaGateway] Proxy error:', err);
    return res.status(500).json({ error: { message: err.message, type: 'gateway_error' } });
  }
});

// =============================================================================
// REVERSE PROXY — Anthropic-compatible endpoint
// =============================================================================

router.post('/v1/messages', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);

    const interaction = await gateway.processRequest({
      provider: 'anthropic',
      model: req.body?.model || 'claude-3-5-sonnet-20241022',
      endpoint: '/v1/messages',
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => typeof v === 'string') as [string, string][]
      ),
      body: req.body,
      ...userInfo,
    });

    if (interaction.policyAction === 'block') {
      return res.status(403).json({
        error: {
          message: `Request blocked by CendiaGateway policy: ${interaction.policyReason}`,
          type: 'gateway_policy_block',
          gateway_interaction_id: interaction.id,
        },
      });
    }

    if (interaction.response) {
      res.set('X-Gateway-Interaction-Id', interaction.id);
      res.set('X-Gateway-Integrity-Hash', interaction.integrityHash);
      res.set('X-Gateway-PII-Detected', String(interaction.piiScan.hasPII));
      res.set('X-Gateway-Policy-Action', interaction.policyAction);
      return res.status(interaction.response.statusCode).json(interaction.response.body);
    }

    return res.status(500).json({ error: 'No response from provider' });
  } catch (err: any) {
    return res.status(500).json({ error: { message: err.message } });
  }
});

// =============================================================================
// REVERSE PROXY — Generic provider endpoint
// =============================================================================

router.post('/proxy/:provider/*', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);
    const provider = req.params.provider;
    const endpoint = '/' + (req.params as any)[0]; // Capture the wildcard path

    const interaction = await gateway.processRequest({
      provider,
      model: req.body?.model || 'unknown',
      endpoint,
      method: 'POST',
      headers: Object.fromEntries(
        Object.entries(req.headers).filter(([_, v]) => typeof v === 'string') as [string, string][]
      ),
      body: req.body,
      ...userInfo,
    });

    if (interaction.policyAction === 'block') {
      return res.status(403).json({
        error: {
          message: `Blocked: ${interaction.policyReason}`,
          type: 'gateway_policy_block',
          gateway_interaction_id: interaction.id,
        },
      });
    }

    if (interaction.response) {
      res.set('X-Gateway-Interaction-Id', interaction.id);
      res.set('X-Gateway-Integrity-Hash', interaction.integrityHash);
      return res.status(interaction.response.statusCode).json(interaction.response.body);
    }

    return res.status(500).json({ error: 'No response from provider' });
  } catch (err: any) {
    return res.status(500).json({ error: { message: err.message } });
  }
});

// =============================================================================
// DASHBOARD & STATISTICS
// =============================================================================

router.get('/stats', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const orgId = req.query.organizationId as string | undefined;
    const stats = gateway.getStats(orgId);
    return res.json(stats);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// INTERACTIONS
// =============================================================================

router.get('/interactions', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const interactions = gateway.getInteractions({
      organizationId: req.query.organizationId as string,
      userId: req.query.userId as string,
      provider: req.query.provider as string,
      piiOnly: req.query.piiOnly === 'true',
      blockedOnly: req.query.blockedOnly === 'true',
      limit: req.query.limit ? parseInt(req.query.limit as string) : 100,
    });

    // Strip sensitive data from list view (prompt/response text)
    const sanitized = interactions.map(i => ({
      id: i.id,
      provider: i.request.provider,
      model: i.request.model,
      userId: i.request.userId,
      userEmail: i.request.userEmail,
      userDepartment: i.request.userDepartment,
      piiDetected: i.piiScan.hasPII,
      piiTypes: i.piiScan.types,
      policyAction: i.policyAction,
      policyReason: i.policyReason,
      promptTokens: i.response?.promptTokens || 0,
      responseTokens: i.response?.responseTokens || 0,
      totalTokens: i.response?.totalTokens || 0,
      estimatedCostUsd: i.response?.estimatedCostUsd || 0,
      latencyMs: i.latencyMs,
      statusCode: i.response?.statusCode || 0,
      integrityHash: i.integrityHash,
      requestedAt: i.requestedAt,
    }));

    return res.json({ interactions: sanitized, total: sanitized.length });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.get('/interactions/:id', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const interaction = gateway.getInteraction(req.params.id);
    if (!interaction) {
      return res.status(404).json({ error: 'Interaction not found' });
    }

    return res.json({
      ...interaction,
      // Redact the actual prompt/response in the API response for security
      piiScan: {
        hasPII: interaction.piiScan.hasPII,
        types: interaction.piiScan.types,
        detectionCount: interaction.piiScan.detections.length,
        scanDurationMs: interaction.piiScan.scanDurationMs,
        // Don't expose raw PII values in the API
      },
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// PROVIDERS
// =============================================================================

router.get('/providers', async (_req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const providers = gateway.getProviders().map(p => ({
      id: p.id,
      name: p.name,
      models: p.models,
      // Don't expose baseUrl or auth config
    }));
    return res.json({ providers });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// POLICIES
// =============================================================================

router.get('/policies', async (_req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    return res.json({ policies: gateway.getPolicies() });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.post('/policies', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const policy = {
      id: `policy-${Date.now()}`,
      name: req.body.name || 'New Policy',
      enabled: req.body.enabled ?? true,
      priority: req.body.priority ?? 100,
      departments: req.body.departments || [],
      blockPIITypes: req.body.blockPIITypes || [],
      redactPIITypes: req.body.redactPIITypes || [],
      blockKeywords: req.body.blockKeywords || [],
      maxPromptLength: req.body.maxPromptLength,
      defaultAction: req.body.defaultAction || 'allow',
      notifyOnBlock: req.body.notifyOnBlock ?? true,
      notifyEmail: req.body.notifyEmail,
    };
    gateway.addPolicy(policy);
    return res.status(201).json(policy);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.put('/policies/:id', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const updated = gateway.updatePolicy(req.params.id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    return res.json(updated);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

router.delete('/policies/:id', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const removed = gateway.removePolicy(req.params.id);
    if (!removed) {
      return res.status(404).json({ error: 'Policy not found' });
    }
    return res.json({ success: true });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// AI MANIFEST™ — Generate compliance artifact
// =============================================================================

router.post('/manifest', async (req: Request, res: Response) => {
  try {
    const gateway = getGateway();
    const userInfo = extractUserInfo(req);

    const manifest = await gateway.generateManifest({
      organizationId: req.body.organizationId || userInfo.organizationId,
      organizationName: req.body.organizationName || 'Datacendia',
      periodStart: new Date(req.body.periodStart || Date.now() - 90 * 24 * 60 * 60 * 1000),
      periodEnd: new Date(req.body.periodEnd || Date.now()),
      generatedBy: userInfo.userEmail,
    });

    return res.json(manifest);
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// PII DETECTION TEST
// =============================================================================

router.post('/test-pii', async (req: Request, res: Response) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ error: 'text field is required' });
    }

    const result = scanForPII(text);

    return res.json({
      hasPII: result.hasPII,
      types: result.types,
      detections: result.detections.map(d => ({
        type: d.type,
        redacted: d.redacted,
        confidence: d.confidence,
        // Don't return the actual PII value in the response
      })),
      redactedText: result.redactedText,
      scanDurationMs: result.scanDurationMs,
    });
  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

// =============================================================================
// HEALTH CHECK
// =============================================================================

router.get('/health', async (_req: Request, res: Response) => {
  const gateway = getGateway();
  const stats = gateway.getStats();
  return res.json({
    status: 'healthy',
    service: 'CendiaGateway',
    version: '1.0.0',
    providers: gateway.getProviders().length,
    policies: gateway.getPolicies().filter(p => p.enabled).length,
    totalInteractions: stats.totalInteractions,
    uptime: process.uptime(),
  });
});

export default router;
