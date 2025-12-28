// =============================================================================
// DATACENDIA KMS/HSM API ROUTES
// Enterprise Key Management API
// =============================================================================

import { Router, Request, Response } from 'express';
import { keyManagementService } from '../services/security/KeyManagementService.js';
import { logger } from '../utils/logger.js';
import { devAuth } from '../middleware/auth.js';

const router = Router();

// All routes require authentication
router.use(devAuth);

// =============================================================================
// STATUS & INFO
// =============================================================================

/**
 * GET /api/v1/kms/status
 * Get KMS service status and configuration
 */
router.get('/status', async (_req: Request, res: Response) => {
  try {
    const status = keyManagementService.getStatus();
    
    res.json({
      success: true,
      data: {
        ...status,
        providers: {
          'aws-kms': {
            name: 'AWS Key Management Service',
            description: 'Cloud-based key management with FIPS 140-2 validated HSMs',
            configured: !!process.env['AWS_KMS_KEY_ID'],
          },
          'hashicorp-vault': {
            name: 'HashiCorp Vault',
            description: 'Secrets management with Transit encryption backend',
            configured: !!process.env['VAULT_TOKEN'],
          },
          'azure-keyvault': {
            name: 'Azure Key Vault',
            description: 'Cloud-based key management for Azure environments',
            configured: !!process.env['AZURE_KEYVAULT_URL'],
          },
          'local': {
            name: 'Local File-based Keys',
            description: 'Development/air-gapped fallback with RSA-4096 keys',
            configured: true,
          },
        },
      },
    });
  } catch (error) {
    logger.error('KMS status error:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get KMS status',
    });
  }
});

// =============================================================================
// SIGNING OPERATIONS
// =============================================================================

/**
 * POST /api/v1/kms/sign
 * Sign data with the configured KMS provider
 */
router.post('/sign', async (req: Request, res: Response) => {
  try {
    const { data, keyId, encoding = 'utf8' } = req.body;

    if (!data) {
      res.status(400).json({
        success: false,
        error: 'Data is required',
      });
      return;
    }

    // Convert data based on encoding
    let dataBuffer: Buffer;
    if (encoding === 'base64') {
      dataBuffer = Buffer.from(data, 'base64');
    } else if (encoding === 'hex') {
      dataBuffer = Buffer.from(data, 'hex');
    } else {
      dataBuffer = Buffer.from(data, 'utf8');
    }

    const result = await keyManagementService.sign(dataBuffer, keyId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('KMS sign error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Signing failed',
    });
  }
});

/**
 * POST /api/v1/kms/verify
 * Verify a signature with the configured KMS provider
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { data, signature, keyId, encoding = 'utf8' } = req.body;

    if (!data || !signature) {
      res.status(400).json({
        success: false,
        error: 'Data and signature are required',
      });
      return;
    }

    let dataBuffer: Buffer;
    if (encoding === 'base64') {
      dataBuffer = Buffer.from(data, 'base64');
    } else if (encoding === 'hex') {
      dataBuffer = Buffer.from(data, 'hex');
    } else {
      dataBuffer = Buffer.from(data, 'utf8');
    }

    const valid = await keyManagementService.verify(dataBuffer, signature, keyId);

    res.json({
      success: true,
      data: { valid },
    });
  } catch (error) {
    logger.error('KMS verify error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Verification failed',
    });
  }
});

// =============================================================================
// ENCRYPTION OPERATIONS
// =============================================================================

/**
 * POST /api/v1/kms/encrypt
 * Encrypt data with the configured KMS provider
 */
router.post('/encrypt', async (req: Request, res: Response) => {
  try {
    const { data, keyId, encoding = 'utf8' } = req.body;

    if (!data) {
      res.status(400).json({
        success: false,
        error: 'Data is required',
      });
      return;
    }

    let dataBuffer: Buffer;
    if (encoding === 'base64') {
      dataBuffer = Buffer.from(data, 'base64');
    } else if (encoding === 'hex') {
      dataBuffer = Buffer.from(data, 'hex');
    } else {
      dataBuffer = Buffer.from(data, 'utf8');
    }

    const result = await keyManagementService.encrypt(dataBuffer, keyId);

    res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    logger.error('KMS encrypt error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Encryption failed',
    });
  }
});

/**
 * POST /api/v1/kms/decrypt
 * Decrypt data with the configured KMS provider
 */
router.post('/decrypt', async (req: Request, res: Response) => {
  try {
    const { ciphertext, keyId } = req.body;

    if (!ciphertext) {
      res.status(400).json({
        success: false,
        error: 'Ciphertext is required',
      });
      return;
    }

    const result = await keyManagementService.decrypt(ciphertext, keyId as string | undefined);

    res.json({
      success: true,
      data: {
        plaintext: result.plaintext.toString('base64'),
        keyId: result.keyId,
        provider: result.provider,
      },
    });
  } catch (error) {
    logger.error('KMS decrypt error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Decryption failed',
    });
  }
});

// =============================================================================
// KEY MANAGEMENT
// =============================================================================

/**
 * POST /api/v1/kms/keys
 * Create a new key
 */
router.post('/keys', async (req: Request, res: Response) => {
  try {
    const { keyId, algorithm, exportable } = req.body;

    if (!keyId) {
      res.status(400).json({
        success: false,
        error: 'Key ID is required',
      });
      return;
    }

    // Validate key ID format
    if (!/^[a-zA-Z0-9-_]+$/.test(keyId)) {
      res.status(400).json({
        success: false,
        error: 'Key ID must contain only alphanumeric characters, hyphens, and underscores',
      });
      return;
    }

    const metadata = await keyManagementService.createKey(keyId, { algorithm, exportable });

    res.status(201).json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    logger.error('KMS create key error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Key creation failed',
    });
  }
});

/**
 * GET /api/v1/kms/keys/:keyId
 * Get key metadata
 */
router.get('/keys/:keyId', async (req: Request, res: Response) => {
  try {
    const { keyId } = req.params;
    const metadata = await keyManagementService.getKeyMetadata(keyId as string);

    if (!metadata) {
      res.status(404).json({
        success: false,
        error: 'Key not found',
      });
      return;
    }

    res.json({
      success: true,
      data: metadata,
    });
  } catch (error) {
    logger.error('KMS get key error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get key',
    });
  }
});

/**
 * POST /api/v1/kms/keys/:keyId/rotate
 * Rotate a key
 */
router.post('/keys/:keyId/rotate', async (req: Request, res: Response) => {
  try {
    const { keyId } = req.params;
    const metadata = await keyManagementService.rotateKey(keyId as string);

    res.json({
      success: true,
      data: metadata,
      message: 'Key rotated successfully',
    });
  } catch (error) {
    logger.error('KMS rotate key error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Key rotation failed',
    });
  }
});

/**
 * GET /api/v1/kms/keys/:keyId/public
 * Get public key (for local provider)
 */
router.get('/keys/:keyId/public', async (req: Request, res: Response) => {
  try {
    const { keyId } = req.params;
    const publicKey = keyManagementService.getPublicKey(keyId);

    if (!publicKey) {
      res.status(404).json({
        success: false,
        error: 'Public key not found',
      });
      return;
    }

    res.json({
      success: true,
      data: {
        keyId,
        publicKey,
        format: 'PEM',
      },
    });
  } catch (error) {
    logger.error('KMS get public key error:', error);
    res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get public key',
    });
  }
});

export default router;
