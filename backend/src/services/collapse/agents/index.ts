/**
 * Service — Index
 *
 * Business logic service implementing platform capabilities.
 * @module services/collapse/agents/index
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * Collapse Mode Agents - Index
 * 
 * 18 Adversarial Agents across 7 Failure Domains
 */

export { BaseCollapseAgent, PolicyContext, AgentAnalysisParams } from './BaseCollapseAgent.js';

// A. Legitimacy & Trust Collapse
export { LegitimacyCollapseAgent } from './LegitimacyCollapseAgent.js';
export { DemocraticProcessErosionAgent } from './DemocraticProcessErosionAgent.js';
export { ProceduralJusticeAgent } from './ProceduralJusticeAgent.js';

// B. Civil Liberties & Rights Collapse (Critical)
export { FreeSpeechChillingAgent } from './FreeSpeechChillingAgent.js';           // NON-OVERRIDABLE
export { DueProcessViolationAgent } from './DueProcessViolationAgent.js';
export { FreedomOfAssociationAgent } from './FreedomOfAssociationAgent.js';

// C. Minority, Equity & Protection
export { MinorityHarmAgent } from './MinorityHarmAgent.js';                        // NON-OVERRIDABLE
export { CulturalErasureAgent } from './CulturalErasureAgent.js';
export { DisabilityImpactAgent } from './DisabilityImpactAgent.js';

// D. Political & Narrative Weaponization
export { PoliticalBacklashAgent } from './PoliticalBacklashAgent.js';
export { NarrativeWeaponizationAgent } from './NarrativeWeaponizationAgent.js';
export { ForeignInfluenceAmplificationAgent } from './ForeignInfluenceAmplificationAgent.js';

// E. Economic & Systemic Risk
export { EconomicInstabilityAgent } from './EconomicInstabilityAgent.js';
export { MarketDistortionAgent } from './MarketDistortionAgent.js';
export { SystemicRiskAgent } from './SystemicRiskAgent.js';

// F. Temporal & Environmental
export { TemporalDecayAgent } from './TemporalDecayAgent.js';
export { EnvironmentalExternalityAgent } from './EnvironmentalExternalityAgent.js';

// G. Abuse & Misuse
export { AdversarialAbuseAgent } from './AdversarialAbuseAgent.js';
