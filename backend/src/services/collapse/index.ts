/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/collapse/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Policy Collapse Mode - Index
 * 
 * Adversarial Policy Stress-Testing System
 * "Under what conditions would this decision fail, harm people, or collapse legitimacy?"
 */

// Types
export * from './types.js';

// Agents
export * from './agents/index.js';

// Orchestrator
export { CollapseOrchestrator, collapseOrchestrator } from './CollapseOrchestrator.js';
