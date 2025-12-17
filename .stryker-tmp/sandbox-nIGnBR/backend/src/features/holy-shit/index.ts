// @ts-nocheck
// =============================================================================
// DATACENDIA PLATFORM - HOLY SHIT FEATURES
// The 5 features that close deals
// =============================================================================

// Feature exports
export * from './PreMortem.js';
export * from './GhostBoard.js';
export * from './DecisionDebt.js';
export * from './LiveDemoMode.js';
export * from './RegulatoryAbsorb.js';

// Service singletons
export { preMortemService } from './PreMortem.js';
export { ghostBoardService } from './GhostBoard.js';
export { decisionDebtService } from './DecisionDebt.js';
export { liveDemoModeService } from './LiveDemoMode.js';
export { regulatoryAbsorbService } from './RegulatoryAbsorb.js';

// Feature metadata
export const HOLY_SHIT_FEATURES = {
  preMortem: {
    id: 'preMortem',
    name: 'The Pre-Mortem',
    icon: '💀',
    tagline: 'Before you decide, let me show you every way this could fail.',
    minimumTier: 'starter',
    closeRateImpact: 5,
  },
  ghostBoard: {
    id: 'ghostBoard',
    name: 'The Ghost Board',
    icon: '👻',
    tagline: 'Rehearse your board meeting with AI directors before the real one.',
    minimumTier: 'professional',
    closeRateImpact: 5,
  },
  decisionDebtDashboard: {
    id: 'decisionDebtDashboard',
    name: 'Decision Debt Dashboard',
    icon: '📊',
    tagline: 'See every decision that\'s stuck, who\'s blocking it, and what it\'s costing you per day.',
    minimumTier: 'professional',
    closeRateImpact: 4,
  },
  liveDemoMode: {
    id: 'liveDemoMode',
    name: 'Live Demo Mode',
    icon: '⚡',
    tagline: 'Let\'s connect to YOUR data right now and run a real deliberation.',
    minimumTier: 'enterprise',
    closeRateImpact: 5,
  },
  regulatoryInstantAbsorb: {
    id: 'regulatoryInstantAbsorb',
    name: 'Regulatory Instant-Absorb',
    icon: '📜',
    tagline: 'Drop in any regulation. The Council knows it in 60 seconds.',
    minimumTier: 'enterprise',
    closeRateImpact: 4,
  },
};
