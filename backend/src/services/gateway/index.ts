/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/gateway/index
 */

export { default as CendiaGatewayService } from './CendiaGatewayService';
export { scanForPII, containsPII, scanForKeywords } from './PIIDetector';
export type { PIIDetection, PIIType, PIIScanResult } from './PIIDetector';
export type {
  GatewayProvider,
  GatewayPolicy,
  GatewayRequest,
  GatewayResponse,
  GatewayInteraction,
  GatewayStats,
  AIManifest,
} from './CendiaGatewayService';
