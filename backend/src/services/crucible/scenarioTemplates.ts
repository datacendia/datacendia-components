// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CendiaCrucible™ - Scenario Templates
 * 
 * Pre-defined scenario templates for common stress testing scenarios
 */

import { SimulationType, ScenarioDefinition } from './types.js';

export const SCENARIO_TEMPLATES: Record<SimulationType, ScenarioDefinition> = {
  FINANCIAL_STRESS: {
    name: 'Financial Stress Test',
    description: 'Simulate revenue decline, cost increases, or cash flow disruption',
    shocks: [
      { target: 'revenue', type: 'percentage', value: -30, timing: 'gradual', duration: 90 },
      { target: 'operating_costs', type: 'percentage', value: 15, timing: 'immediate' },
    ],
  },
  OPERATIONAL_SHOCK: {
    name: 'Operational Disruption',
    description: 'Simulate major operational failures or supply chain breaks',
    shocks: [
      { target: 'throughput', type: 'percentage', value: -50, timing: 'immediate' },
      { target: 'cycle_time', type: 'multiplier', value: 2.5, timing: 'immediate' },
    ],
  },
  CYBER_ATTACK: {
    name: 'Cybersecurity Incident',
    description: 'Simulate ransomware, data breach, or system compromise',
    shocks: [
      { target: 'system_availability', type: 'absolute', value: 0, timing: 'immediate' },
      { target: 'security_score', type: 'percentage', value: -80, timing: 'immediate' },
      { target: 'reputation', type: 'percentage', value: -40, timing: 'gradual', duration: 180 },
    ],
  },
  REGULATORY_CHANGE: {
    name: 'Regulatory Shock',
    description: 'Simulate new compliance requirements or enforcement actions',
    shocks: [
      { target: 'compliance_costs', type: 'percentage', value: 100, timing: 'delayed', duration: 365 },
      { target: 'operational_flexibility', type: 'percentage', value: -30, timing: 'gradual', duration: 180 },
    ],
  },
  CULTURAL_SHIFT: {
    name: 'Cultural Disruption',
    description: 'Simulate morale collapse, talent exodus, or leadership failure',
    shocks: [
      { target: 'employee_engagement', type: 'percentage', value: -40, timing: 'gradual', duration: 60 },
      { target: 'turnover_rate', type: 'multiplier', value: 3, timing: 'gradual', duration: 90 },
    ],
  },
  ESG_EVENT: {
    name: 'ESG Crisis',
    description: 'Simulate environmental, social, or governance failures',
    shocks: [
      { target: 'esg_score', type: 'percentage', value: -60, timing: 'immediate' },
      { target: 'investor_confidence', type: 'percentage', value: -35, timing: 'gradual', duration: 120 },
    ],
  },
  MA_SCENARIO: {
    name: 'M&A Event',
    description: 'Simulate acquisition, merger, or divestiture',
    shocks: [
      { target: 'integration_costs', type: 'absolute', value: 5000000, timing: 'immediate' },
      { target: 'productivity', type: 'percentage', value: -25, timing: 'gradual', duration: 180 },
    ],
  },
  MARKET_DISRUPTION: {
    name: 'Market Disruption',
    description: 'Simulate competitive threat, market shift, or demand collapse',
    shocks: [
      { target: 'market_share', type: 'percentage', value: -20, timing: 'gradual', duration: 365 },
      { target: 'pricing_power', type: 'percentage', value: -15, timing: 'gradual', duration: 180 },
    ],
  },
  SUPPLY_CHAIN: {
    name: 'Supply Chain Breakdown',
    description: 'Simulate supplier failure, logistics disruption, or material shortage',
    shocks: [
      { target: 'supply_availability', type: 'percentage', value: -70, timing: 'immediate' },
      { target: 'lead_times', type: 'multiplier', value: 4, timing: 'immediate' },
    ],
  },
  TALENT_EXODUS: {
    name: 'Talent Crisis',
    description: 'Simulate key person departures or mass resignation',
    shocks: [
      { target: 'key_talent_retention', type: 'percentage', value: -50, timing: 'immediate' },
      { target: 'institutional_knowledge', type: 'percentage', value: -40, timing: 'gradual', duration: 90 },
    ],
  },
  TECHNOLOGY_FAILURE: {
    name: 'Technology Failure',
    description: 'Simulate critical system outage or technology obsolescence',
    shocks: [
      { target: 'core_systems', type: 'absolute', value: 0, timing: 'immediate' },
      { target: 'recovery_time', type: 'absolute', value: 72, timing: 'immediate' },
    ],
  },
  BLACK_SWAN: {
    name: 'Black Swan Event',
    description: 'Simulate extreme, unpredictable events with massive impact',
    shocks: [
      { target: 'all_operations', type: 'percentage', value: -80, timing: 'immediate' },
      { target: 'external_environment', type: 'percentage', value: -60, timing: 'immediate' },
    ],
  },
  CUSTOM: {
    name: 'Custom Scenario',
    description: 'Define your own shocks and parameters',
    shocks: [],
  },
};

export function getScenarioTemplate(type: SimulationType): ScenarioDefinition {
  return SCENARIO_TEMPLATES[type];
}

export function listScenarioTypes(): SimulationType[] {
  return Object.keys(SCENARIO_TEMPLATES) as SimulationType[];
}
