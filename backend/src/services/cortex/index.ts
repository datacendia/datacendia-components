/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/cortex/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Cortex Core Services - Export all cortex-related services
 */

export * from './types';
export { CortexCoreService, cortexCore } from './CortexCoreService';
export { PillarAggregator } from './PillarAggregator';
