/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/crucible/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrucible™ - Module Exports
 * 
 * Decomposed simulation engine with focused, testable modules
 */

// Types
export * from './types.js';

// Scenario Templates
export { SCENARIO_TEMPLATES, getScenarioTemplate, listScenarioTypes } from './scenarioTemplates.js';

// Monte Carlo Engine
export { MonteCarloEngine } from './MonteCarloEngine.js';
