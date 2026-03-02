/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/scge/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Synthetic Civic Governance Environment
 * 
 * Index file for all SCGE exports
 */

// Core types
export * from './types.js';

// Services
export { SyntheticPopulationService, syntheticPopulationService } from './SyntheticPopulationService.js';
export { PolicyInjectionService, policyInjectionService, DEFAULT_POLICY_TEMPLATES } from './PolicyInjectionService.js';
export { EventInjectionService, eventInjectionService, DEFAULT_EVENT_SCENARIOS } from './EventInjectionService.js';
export { StressorLibraryService, stressorLibraryService, STRESSOR_SCENARIO_PRESETS } from './StressorLibraryService.js';
export { SCGEOrchestrator, scgeOrchestrator } from './SCGEOrchestrator.js';
