/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/panopticon/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaPanopticon™ - Module Exports
 * 
 * Global regulation engine with decomposed, testable modules
 */

// Types
export * from './types.js';

// Frameworks database and helpers
export {
  REGULATORY_FRAMEWORKS,
  DEFAULT_RADAR_EVENTS,
  DEFAULT_AI_SUMMARY,
  DEFAULT_AI_ACTIONS,
  getFrameworkByCode,
  getFrameworksByCategory,
  getFrameworksByJurisdiction,
  getAllJurisdictions,
  getAllCategories,
  getTotalRequirementsCount,
} from './frameworks.js';
