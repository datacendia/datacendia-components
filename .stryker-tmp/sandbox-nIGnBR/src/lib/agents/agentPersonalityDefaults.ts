// @ts-nocheck
// =============================================================================
// AGENT PERSONALITY DEFAULTS
// Suggested personality traits for each AI agent (all OFF by default)
// Users can toggle these on to modify agent behavior
// =============================================================================
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { PersonalityTrait } from './personality';

// =============================================================================
// SUGGESTED PERSONALITY PROFILES
// These are recommendations - all are OFF by default until user enables them
// =============================================================================

export interface AgentPersonalityProfile {
  agentCode: string;
  suggestedTraits: string[]; // Trait IDs that make sense for this agent type
  description: string; // Why these traits suit this agent
}
export const AGENT_PERSONALITY_PROFILES: AgentPersonalityProfile[] = stryMutAct_9fa48("11513") ? [] : (stryCov_9fa48("11513"), [// =========================================================================
// CORE AGENTS (14)
// =========================================================================
stryMutAct_9fa48("11514") ? {} : (stryCov_9fa48("11514"), {
  agentCode: 'chief',
  suggestedTraits: stryMutAct_9fa48("11516") ? [] : (stryCov_9fa48("11516"), ['assertive', 'diplomatic', 'decisive', 'big_picture', 'dominant', 'mentor']),
  description: 'Leadership-focused traits for strategic oversight and coordination'
}), stryMutAct_9fa48("11524") ? {} : (stryCov_9fa48("11524"), {
  agentCode: 'cfo',
  suggestedTraits: stryMutAct_9fa48("11526") ? [] : (stryCov_9fa48("11526"), ['analytical', 'cautious', 'risk_averse', 'detail_oriented', 'conservative', 'methodical']),
  description: 'Finance-focused traits emphasizing accuracy and risk management'
}), stryMutAct_9fa48("11534") ? {} : (stryCov_9fa48("11534"), {
  agentCode: 'coo',
  suggestedTraits: stryMutAct_9fa48("11536") ? [] : (stryCov_9fa48("11536"), ['pragmatist', 'methodical', 'deadline_driven', 'decisive', 'blunt', 'detail_oriented']),
  description: 'Operations-focused traits for efficiency and execution'
}), stryMutAct_9fa48("11544") ? {} : (stryCov_9fa48("11544"), {
  agentCode: 'ciso',
  suggestedTraits: stryMutAct_9fa48("11546") ? [] : (stryCov_9fa48("11546"), ['paranoid', 'suspicious', 'analytical', 'cautious', 'pessimistic', 'confrontational']),
  description: 'Security-focused traits emphasizing threat awareness and vigilance'
}), stryMutAct_9fa48("11554") ? {} : (stryCov_9fa48("11554"), {
  agentCode: 'cmo',
  suggestedTraits: stryMutAct_9fa48("11556") ? [] : (stryCov_9fa48("11556"), ['optimistic', 'innovative', 'passionate', 'expressive', 'risk_seeking', 'big_picture']),
  description: 'Marketing-focused traits for creative and customer-centric thinking'
}), stryMutAct_9fa48("11564") ? {} : (stryCov_9fa48("11564"), {
  agentCode: 'cro',
  suggestedTraits: stryMutAct_9fa48("11566") ? [] : (stryCov_9fa48("11566"), ['bold', 'competitive', 'optimistic', 'assertive', 'decisive', 'passionate']),
  description: 'Revenue-focused traits for aggressive growth and sales'
}), stryMutAct_9fa48("11574") ? {} : (stryCov_9fa48("11574"), {
  agentCode: 'cdo',
  suggestedTraits: stryMutAct_9fa48("11576") ? [] : (stryCov_9fa48("11576"), ['perfectionist', 'analytical', 'methodical', 'detail_oriented', 'technical', 'curious']),
  description: 'Data-focused traits for quality and governance'
}), stryMutAct_9fa48("11584") ? {} : (stryCov_9fa48("11584"), {
  agentCode: 'risk',
  suggestedTraits: stryMutAct_9fa48("11586") ? [] : (stryCov_9fa48("11586"), ['pessimistic', 'paranoid', 'analytical', 'suspicious', 'cautious', 'contrarian']),
  description: 'Risk-focused traits for comprehensive threat identification'
}), stryMutAct_9fa48("11594") ? {} : (stryCov_9fa48("11594"), {
  agentCode: 'clo',
  suggestedTraits: stryMutAct_9fa48("11596") ? [] : (stryCov_9fa48("11596"), ['analytical', 'cautious', 'detail_oriented', 'formal', 'methodical', 'suspicious']),
  description: 'Legal-focused traits for thorough analysis and risk awareness'
}), stryMutAct_9fa48("11604") ? {} : (stryCov_9fa48("11604"), {
  agentCode: 'cpo',
  suggestedTraits: stryMutAct_9fa48("11606") ? [] : (stryCov_9fa48("11606"), ['innovative', 'empathetic', 'curious', 'decisive', 'collaborative', 'pragmatist']),
  description: 'Product-focused traits balancing user needs with execution'
}), stryMutAct_9fa48("11614") ? {} : (stryCov_9fa48("11614"), {
  agentCode: 'caio',
  suggestedTraits: stryMutAct_9fa48("11616") ? [] : (stryCov_9fa48("11616"), ['innovative', 'analytical', 'curious', 'technical', 'cautious', 'mentor']),
  description: 'AI-focused traits for responsible innovation and governance'
}), stryMutAct_9fa48("11624") ? {} : (stryCov_9fa48("11624"), {
  agentCode: 'cso',
  suggestedTraits: stryMutAct_9fa48("11626") ? [] : (stryCov_9fa48("11626"), ['idealist', 'passionate', 'empathetic', 'big_picture', 'challenger', 'sincere']),
  description: 'Sustainability-focused traits for values-driven analysis'
}), stryMutAct_9fa48("11634") ? {} : (stryCov_9fa48("11634"), {
  agentCode: 'cio',
  suggestedTraits: stryMutAct_9fa48("11636") ? [] : (stryCov_9fa48("11636"), ['analytical', 'cautious', 'methodical', 'risk_averse', 'detail_oriented', 'independent']),
  description: 'Investment-focused traits for careful analysis and due diligence'
}), stryMutAct_9fa48("11644") ? {} : (stryCov_9fa48("11644"), {
  agentCode: 'cco',
  suggestedTraits: stryMutAct_9fa48("11646") ? [] : (stryCov_9fa48("11646"), ['diplomatic', 'empathetic', 'expressive', 'sincere', 'mediating', 'collaborative']),
  description: 'Communications-focused traits for stakeholder engagement'
}), // =========================================================================
// AUDIT PACK (2)
// =========================================================================
stryMutAct_9fa48("11654") ? {} : (stryCov_9fa48("11654"), {
  agentCode: 'ext-auditor',
  suggestedTraits: stryMutAct_9fa48("11656") ? [] : (stryCov_9fa48("11656"), ['suspicious', 'analytical', 'detail_oriented', 'formal', 'independent', 'confrontational']),
  description: 'External audit traits for independent, skeptical review'
}), stryMutAct_9fa48("11664") ? {} : (stryCov_9fa48("11664"), {
  agentCode: 'int-auditor',
  suggestedTraits: stryMutAct_9fa48("11666") ? [] : (stryCov_9fa48("11666"), ['analytical', 'methodical', 'detail_oriented', 'collaborative', 'diplomatic', 'curious']),
  description: 'Internal audit traits balancing thoroughness with organizational knowledge'
}), // =========================================================================
// HEALTHCARE PACK (4)
// =========================================================================
stryMutAct_9fa48("11674") ? {} : (stryCov_9fa48("11674"), {
  agentCode: 'cmio',
  suggestedTraits: stryMutAct_9fa48("11676") ? [] : (stryCov_9fa48("11676"), ['empathetic', 'analytical', 'cautious', 'methodical', 'collaborative', 'sincere']),
  description: 'Healthcare-focused traits emphasizing patient welfare and data ethics'
}), stryMutAct_9fa48("11684") ? {} : (stryCov_9fa48("11684"), {
  agentCode: 'pso',
  suggestedTraits: stryMutAct_9fa48("11686") ? [] : (stryCov_9fa48("11686"), ['paranoid', 'detail_oriented', 'cautious', 'empathetic', 'confrontational', 'passionate']),
  description: 'Patient safety traits prioritizing risk identification'
}), stryMutAct_9fa48("11694") ? {} : (stryCov_9fa48("11694"), {
  agentCode: 'hco',
  suggestedTraits: stryMutAct_9fa48("11696") ? [] : (stryCov_9fa48("11696"), ['methodical', 'detail_oriented', 'formal', 'suspicious', 'analytical', 'cautious']),
  description: 'Healthcare compliance traits for regulatory adherence'
}), stryMutAct_9fa48("11704") ? {} : (stryCov_9fa48("11704"), {
  agentCode: 'cod',
  suggestedTraits: stryMutAct_9fa48("11706") ? [] : (stryCov_9fa48("11706"), ['pragmatist', 'decisive', 'collaborative', 'deadline_driven', 'empathetic', 'assertive']),
  description: 'Clinical operations traits balancing efficiency with care quality'
}), // =========================================================================
// FINANCE PACK (4)
// =========================================================================
stryMutAct_9fa48("11714") ? {} : (stryCov_9fa48("11714"), {
  agentCode: 'quant',
  suggestedTraits: stryMutAct_9fa48("11716") ? [] : (stryCov_9fa48("11716"), ['analytical', 'technical', 'detail_oriented', 'innovative', 'independent', 'perfectionist']),
  description: 'Quantitative analysis traits for sophisticated modeling'
}), stryMutAct_9fa48("11724") ? {} : (stryCov_9fa48("11724"), {
  agentCode: 'pm',
  suggestedTraits: stryMutAct_9fa48("11726") ? [] : (stryCov_9fa48("11726"), ['decisive', 'analytical', 'risk_seeking', 'bold', 'competitive', 'assertive']),
  description: 'Portfolio management traits for active decision-making'
}), stryMutAct_9fa48("11734") ? {} : (stryCov_9fa48("11734"), {
  agentCode: 'cro-finance',
  suggestedTraits: stryMutAct_9fa48("11736") ? [] : (stryCov_9fa48("11736"), ['analytical', 'pessimistic', 'cautious', 'suspicious', 'detail_oriented', 'methodical']),
  description: 'Credit risk traits for thorough counterparty assessment'
}), stryMutAct_9fa48("11744") ? {} : (stryCov_9fa48("11744"), {
  agentCode: 'treasury',
  suggestedTraits: stryMutAct_9fa48("11746") ? [] : (stryCov_9fa48("11746"), ['cautious', 'analytical', 'methodical', 'conservative', 'detail_oriented', 'risk_averse']),
  description: 'Treasury traits for liquidity and cash flow management'
}), // =========================================================================
// LEGAL PACK (4)
// =========================================================================
stryMutAct_9fa48("11754") ? {} : (stryCov_9fa48("11754"), {
  agentCode: 'contracts',
  suggestedTraits: stryMutAct_9fa48("11756") ? [] : (stryCov_9fa48("11756"), ['detail_oriented', 'suspicious', 'analytical', 'methodical', 'perfectionist', 'formal']),
  description: 'Contract specialist traits for thorough agreement review'
}), stryMutAct_9fa48("11764") ? {} : (stryCov_9fa48("11764"), {
  agentCode: 'ip',
  suggestedTraits: stryMutAct_9fa48("11766") ? [] : (stryCov_9fa48("11766"), ['analytical', 'technical', 'detail_oriented', 'innovative', 'cautious', 'curious']),
  description: 'IP counsel traits for patent and trademark analysis'
}), stryMutAct_9fa48("11774") ? {} : (stryCov_9fa48("11774"), {
  agentCode: 'litigation',
  suggestedTraits: stryMutAct_9fa48("11776") ? [] : (stryCov_9fa48("11776"), ['aggressive', 'argumentative', 'competitive', 'confrontational', 'bold', 'analytical']),
  description: 'Litigation traits for adversarial analysis and strategy'
}), stryMutAct_9fa48("11784") ? {} : (stryCov_9fa48("11784"), {
  agentCode: 'regulatory',
  suggestedTraits: stryMutAct_9fa48("11786") ? [] : (stryCov_9fa48("11786"), ['cautious', 'detail_oriented', 'analytical', 'methodical', 'formal', 'suspicious']),
  description: 'Regulatory affairs traits for compliance-focused analysis'
})]);

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

/**
 * Get suggested personality traits for an agent
 */
export function getSuggestedTraits(agentCode: string): string[] {
  const profile = AGENT_PERSONALITY_PROFILES.find(stryMutAct_9fa48("11795") ? () => undefined : (stryCov_9fa48("11795"), p => stryMutAct_9fa48("11798") ? p.agentCode !== agentCode : stryMutAct_9fa48("11797") ? false : stryMutAct_9fa48("11796") ? true : (stryCov_9fa48("11796", "11797", "11798"), p.agentCode === agentCode)));
  return stryMutAct_9fa48("11801") ? profile?.suggestedTraits && [] : stryMutAct_9fa48("11800") ? false : stryMutAct_9fa48("11799") ? true : (stryCov_9fa48("11799", "11800", "11801"), (stryMutAct_9fa48("11802") ? profile.suggestedTraits : (stryCov_9fa48("11802"), profile?.suggestedTraits)) || (stryMutAct_9fa48("11803") ? ["Stryker was here"] : (stryCov_9fa48("11803"), [])));
}

/**
 * Get the personality profile description for an agent
 */
export function getProfileDescription(agentCode: string): string {
  const profile = AGENT_PERSONALITY_PROFILES.find(stryMutAct_9fa48("11805") ? () => undefined : (stryCov_9fa48("11805"), p => stryMutAct_9fa48("11808") ? p.agentCode !== agentCode : stryMutAct_9fa48("11807") ? false : stryMutAct_9fa48("11806") ? true : (stryCov_9fa48("11806", "11807", "11808"), p.agentCode === agentCode)));
  return stryMutAct_9fa48("11811") ? profile?.description && '' : stryMutAct_9fa48("11810") ? false : stryMutAct_9fa48("11809") ? true : (stryCov_9fa48("11809", "11810", "11811"), (stryMutAct_9fa48("11812") ? profile.description : (stryCov_9fa48("11812"), profile?.description)) || '');
}

/**
 * Get all agent personality profiles
 */
export function getAllProfiles(): AgentPersonalityProfile[] {
  return AGENT_PERSONALITY_PROFILES;
}

// =============================================================================
// PRESET PERSONALITY COMBINATIONS
// Quick-select combinations for common use cases
// =============================================================================

export interface PersonalityPreset {
  id: string;
  name: string;
  description: string;
  traits: string[];
  icon: string;
}
export const PERSONALITY_PRESETS: PersonalityPreset[] = stryMutAct_9fa48("11815") ? [] : (stryCov_9fa48("11815"), [stryMutAct_9fa48("11816") ? {} : (stryCov_9fa48("11816"), {
  id: 'devils-advocate',
  name: "Devil's Advocate",
  description: 'Challenge assumptions and stress-test ideas',
  traits: stryMutAct_9fa48("11820") ? [] : (stryCov_9fa48("11820"), ['contrarian', 'argumentative', 'suspicious', 'pessimistic', 'analytical']),
  icon: '😈'
}), stryMutAct_9fa48("11827") ? {} : (stryCov_9fa48("11827"), {
  id: 'cheerleader',
  name: 'Cheerleader',
  description: 'Encouraging, optimistic support',
  traits: stryMutAct_9fa48("11831") ? [] : (stryCov_9fa48("11831"), ['optimistic', 'passionate', 'cooperative', 'expressive', 'sincere']),
  icon: '📣'
}), stryMutAct_9fa48("11838") ? {} : (stryCov_9fa48("11838"), {
  id: 'drill-sergeant',
  name: 'Drill Sergeant',
  description: 'Tough, demanding standards',
  traits: stryMutAct_9fa48("11842") ? [] : (stryCov_9fa48("11842"), ['aggressive', 'perfectionist', 'blunt', 'confrontational', 'decisive']),
  icon: '🎖️'
}), stryMutAct_9fa48("11849") ? {} : (stryCov_9fa48("11849"), {
  id: 'wise-mentor',
  name: 'Wise Mentor',
  description: 'Patient, teaching approach',
  traits: stryMutAct_9fa48("11853") ? [] : (stryCov_9fa48("11853"), ['mentor', 'empathetic', 'diplomatic', 'curious', 'sincere']),
  icon: '🧙'
}), stryMutAct_9fa48("11860") ? {} : (stryCov_9fa48("11860"), {
  id: 'risk-hawk',
  name: 'Risk Hawk',
  description: 'Hyper-focused on risks and downsides',
  traits: stryMutAct_9fa48("11864") ? [] : (stryCov_9fa48("11864"), ['paranoid', 'pessimistic', 'suspicious', 'cautious', 'analytical']),
  icon: '🦅'
}), stryMutAct_9fa48("11871") ? {} : (stryCov_9fa48("11871"), {
  id: 'disruptor',
  name: 'Disruptor',
  description: 'Challenge status quo, push for innovation',
  traits: stryMutAct_9fa48("11875") ? [] : (stryCov_9fa48("11875"), ['innovative', 'bold', 'contrarian', 'risk_seeking', 'spontaneous']),
  icon: '💥'
}), stryMutAct_9fa48("11882") ? {} : (stryCov_9fa48("11882"), {
  id: 'diplomat',
  name: 'Diplomat',
  description: 'Harmony-focused, builds consensus',
  traits: stryMutAct_9fa48("11886") ? [] : (stryCov_9fa48("11886"), ['diplomatic', 'agreeable', 'mediating', 'collaborative', 'empathetic']),
  icon: '🕊️'
}), stryMutAct_9fa48("11893") ? {} : (stryCov_9fa48("11893"), {
  id: 'executioner',
  name: 'Executioner',
  description: 'Ruthlessly practical, deadline-focused',
  traits: stryMutAct_9fa48("11897") ? [] : (stryCov_9fa48("11897"), ['decisive', 'pragmatist', 'deadline_driven', 'blunt', 'dominant']),
  icon: '⚔️'
}), stryMutAct_9fa48("11904") ? {} : (stryCov_9fa48("11904"), {
  id: 'perfectionist',
  name: 'Perfectionist',
  description: 'Nothing less than excellence',
  traits: stryMutAct_9fa48("11908") ? [] : (stryCov_9fa48("11908"), ['perfectionist', 'detail_oriented', 'methodical', 'analytical', 'challenger']),
  icon: '💎'
}), stryMutAct_9fa48("11915") ? {} : (stryCov_9fa48("11915"), {
  id: 'creative-visionary',
  name: 'Creative Visionary',
  description: 'Blue-sky thinking, imagination',
  traits: stryMutAct_9fa48("11919") ? [] : (stryCov_9fa48("11919"), ['innovative', 'optimistic', 'big_picture', 'intuitive', 'expressive']),
  icon: '🎨'
})]);

/**
 * Get a preset by ID
 */
export function getPreset(id: string): PersonalityPreset | undefined {
  return PERSONALITY_PRESETS.find(stryMutAct_9fa48("11927") ? () => undefined : (stryCov_9fa48("11927"), p => stryMutAct_9fa48("11930") ? p.id !== id : stryMutAct_9fa48("11929") ? false : stryMutAct_9fa48("11928") ? true : (stryCov_9fa48("11928", "11929", "11930"), p.id === id)));
}

/**
 * Get all presets
 */
export function getAllPresets(): PersonalityPreset[] {
  return PERSONALITY_PRESETS;
}