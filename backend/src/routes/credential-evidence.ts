/**
 * Routes — Credential Evidence
 *
 * API endpoints for credential generation evidence — the "proof at creation"
 * layer that answers auditor questions about entropy, policy, and provenance
 * for every credential the platform generates.
 *
 * @module routes/credential-evidence
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import { Router, Request, Response } from 'express';
import { credentialEvidenceService } from '../services/security/CredentialEvidenceService.js';
import type { CredentialType } from '../services/security/CredentialEvidenceService.js';

const router = Router();

// =========================================================================
// HEALTH
// =========================================================================
router.get('/health', (_req: Request, res: Response) => {
  res.json({
    service: 'CredentialEvidenceService',
    status: 'operational',
    description: 'Credential generation proof-at-creation for SOC 2, HIPAA, NIST audits',
    timestamp: new Date().toISOString(),
  });
});

// =========================================================================
// POLICIES — What rules govern each credential type
// =========================================================================
router.get('/policies', (_req: Request, res: Response) => {
  const policies = credentialEvidenceService.getPolicies();
  res.json({
    success: true,
    data: {
      totalPolicies: policies.length,
      policies,
    },
  });
});

router.get('/policies/:type', (req: Request, res: Response) => {
  const policy = credentialEvidenceService.getPolicy(req.params.type as CredentialType);
  res.json({ success: true, data: policy });
});

// =========================================================================
// RECORDS — Evidence records proving what was true at generation time
// =========================================================================
router.get('/records', async (req: Request, res: Response) => {
  try {
    const records = await credentialEvidenceService.getRecords({
      credentialType: req.query.type as CredentialType | undefined,
      userId: req.query.userId as string | undefined,
      limit: req.query.limit ? parseInt(req.query.limit as string, 10) : 100,
    });
    res.json({
      success: true,
      data: {
        totalRecords: records.length,
        records,
      },
    });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =========================================================================
// CHAIN VERIFICATION — Prove no records were tampered with or deleted
// =========================================================================
router.get('/verify-chain', async (_req: Request, res: Response) => {
  try {
    const result = await credentialEvidenceService.verifyChain();
    res.json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =========================================================================
// STATS — Dashboard for compliance officers
// =========================================================================
router.get('/stats', async (_req: Request, res: Response) => {
  try {
    const stats = await credentialEvidenceService.getStats();
    res.json({ success: true, data: stats });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// =========================================================================
// EXPORT — Full audit package for external auditors
// =========================================================================
router.get('/export', async (_req: Request, res: Response) => {
  try {
    const auditPackage = await credentialEvidenceService.exportAuditPackage();
    res.json({ success: true, data: auditPackage });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
