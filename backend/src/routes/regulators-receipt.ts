// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * DATACENDIA REGULATOR'S RECEIPT ROUTES
 * 
 * API endpoints for one-click court-admissible decision documentation
 */

import { Router, Request, Response } from 'express';
import { regulatorsReceiptService } from '../services/evidence/RegulatorsReceiptService.js';

const router = Router();

/**
 * POST /api/v1/regulators-receipt/generate
 * Generate a Regulator's Receipt for a deliberation
 */
router.post('/generate', async (req: Request, res: Response) => {
  try {
    const { deliberationId, generatedBy, options } = req.body;
    
    if (!deliberationId) {
      return res.status(400).json({ error: 'deliberationId is required' });
    }
    
    const receipt = await regulatorsReceiptService.generateReceipt(
      deliberationId,
      generatedBy || 'system',
      options
    );
    
    res.json({ success: true, receipt });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
});

/**
 * POST /api/v1/regulators-receipt/export/pdf
 * Export receipt as PDF content
 */
router.post('/export/pdf', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const pdfContent = regulatorsReceiptService.exportAsPdfContent(receipt);
  
  res.json({ success: true, pdfContent });
});

/**
 * POST /api/v1/regulators-receipt/export/json
 * Export receipt as JSON
 */
router.post('/export/json', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const json = regulatorsReceiptService.exportAsJson(receipt);
  
  res.json({ success: true, json });
});

/**
 * POST /api/v1/regulators-receipt/export/html
 * Export receipt as HTML
 */
router.post('/export/html', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const html = regulatorsReceiptService.exportAsHtml(receipt);
  
  res.json({ success: true, html });
});

/**
 * POST /api/v1/regulators-receipt/verify
 * Verify a receipt's integrity
 */
router.post('/verify', (req: Request, res: Response) => {
  const { receipt } = req.body;
  
  if (!receipt) {
    return res.status(400).json({ error: 'receipt is required' });
  }
  
  const verification = regulatorsReceiptService.verifyReceipt(receipt);
  
  res.json({ success: true, verification });
});

export default router;
