/**
 * Module — Vertical Council Test
 *
 * Platform module.
 * @module __tests__/routes/vertical-council.test
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * VERTICAL COUNCIL ROUTES TESTS
 * Tests for Financial, Healthcare, Insurance, and Energy vertical council modes and agents
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock dependencies
vi.mock('../../config/database.js', () => ({
  prisma: {
    organizations: { findUnique: vi.fn().mockResolvedValue({ id: 'org-123' }) },
  },
}));

vi.mock('../../config/redis.js', () => ({
  redis: { get: vi.fn(), set: vi.fn() },
  cache: { get: vi.fn(), set: vi.fn() },
}));

// Import after mocks
import {
  ALL_FINANCIAL_MODES,
  getFinancialMode,
  getFinancialModesByCategory,
  getFinancialModesByLeadAgent,
} from '../../services/verticals/financial/FinancialCouncilModes.js';

import {
  ALL_FINANCIAL_AGENTS,
  getFinancialAgent,
  getDefaultFinancialAgents,
  getOptionalFinancialAgents,
  getSilentGuardAgents,
} from '../../services/verticals/financial/FinancialAgents.js';

import {
  ALL_HEALTHCARE_MODES,
  getHealthcareMode,
  getHealthcareModesByCategory,
} from '../../services/verticals/healthcare/HealthcareCouncilModes.js';

import {
  ALL_HEALTHCARE_AGENTS,
  getHealthcareAgent,
  getDefaultHealthcareAgents,
} from '../../services/verticals/healthcare/HealthcareAgents.js';

import {
  ALL_INSURANCE_MODES,
  getInsuranceMode,
  getInsuranceModesByCategory,
} from '../../services/verticals/insurance/InsuranceCouncilModes.js';

import {
  ALL_INSURANCE_AGENTS,
  getInsuranceAgent,
  getDefaultInsuranceAgents,
} from '../../services/verticals/insurance/InsuranceAgents.js';

import {
  ALL_ENERGY_MODES,
  getEnergyMode,
  getEnergyModesByCategory,
} from '../../services/verticals/energy/EnergyCouncilModes.js';

import {
  ALL_ENERGY_AGENTS,
  getEnergyAgent,
  getDefaultEnergyAgents,
} from '../../services/verticals/energy/EnergyAgents.js';

describe('Vertical Council Modes and Agents', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  // ===========================================================================
  // FINANCIAL VERTICAL
  // ===========================================================================

  describe('Financial Vertical', () => {
    describe('Modes', () => {
      it('should have multiple financial modes defined', () => {
        expect(ALL_FINANCIAL_MODES.length).toBeGreaterThan(0);
      });

      it('should get mode by ID', () => {
        const firstMode = ALL_FINANCIAL_MODES[0]!;
        const mode = getFinancialMode(firstMode.id);
        expect(mode).toBeDefined();
        expect(mode?.id).toBe(firstMode.id);
      });

      it('should return undefined for non-existent mode', () => {
        const mode = getFinancialMode('non-existent-mode');
        expect(mode).toBeUndefined();
      });

      it('should filter modes by category', () => {
        const majorModes = getFinancialModesByCategory('major');
        expect(Array.isArray(majorModes)).toBe(true);
        majorModes.forEach(mode => {
          expect(mode.category).toBe('major');
        });
      });

      it('should filter modes by lead agent', () => {
        const firstMode = ALL_FINANCIAL_MODES[0]!;
        const modes = getFinancialModesByLeadAgent(firstMode.leadAgent);
        expect(modes.length).toBeGreaterThan(0);
        modes.forEach(mode => {
          expect(mode.leadAgent).toBe(firstMode.leadAgent);
        });
      });

      it('should have required properties on each mode', () => {
        ALL_FINANCIAL_MODES.forEach(mode => {
          expect(mode.id).toBeDefined();
          expect(mode.name).toBeDefined();
          expect(mode.category).toBeDefined();
          expect(mode.leadAgent).toBeDefined();
          expect(mode.purpose).toBeDefined();
        });
      });
    });

    describe('Agents', () => {
      it('should have 16 total financial agents (8 default + 6 optional + 2 silent)', () => {
        expect(ALL_FINANCIAL_AGENTS.length).toBe(16);
      });

      it('should have 8 default agents', () => {
        const defaultAgents = getDefaultFinancialAgents();
        expect(defaultAgents.length).toBe(8);
        defaultAgents.forEach(agent => {
          expect(agent.category).toBe('default');
        });
      });

      it('should have 6 optional agents', () => {
        const optionalAgents = getOptionalFinancialAgents();
        expect(optionalAgents.length).toBe(6);
        optionalAgents.forEach(agent => {
          expect(agent.category).toBe('optional');
        });
      });

      it('should have 2 silent guard agents', () => {
        const silentAgents = getSilentGuardAgents();
        expect(silentAgents.length).toBe(2);
        silentAgents.forEach(agent => {
          expect(agent.category).toBe('silent-guard');
          expect(agent.silent).toBe(true);
        });
      });

      it('should get agent by ID', () => {
        const agent = getFinancialAgent('risk-officer');
        expect(agent).toBeDefined();
        expect(agent?.id).toBe('risk-officer');
      });

      it('should have required properties on each agent', () => {
        ALL_FINANCIAL_AGENTS.forEach(agent => {
          expect(agent.id).toBeDefined();
          expect(agent.name).toBeDefined();
          expect(agent.role).toBeDefined();
          expect(agent.category).toBeDefined();
          expect(agent.expertise).toBeDefined();
          expect(Array.isArray(agent.expertise)).toBe(true);
          expect(agent.systemPrompt).toBeDefined();
        });
      });
    });
  });

  // ===========================================================================
  // HEALTHCARE VERTICAL
  // ===========================================================================

  describe('Healthcare Vertical', () => {
    describe('Modes', () => {
      it('should have multiple healthcare modes defined', () => {
        expect(ALL_HEALTHCARE_MODES.length).toBeGreaterThan(0);
      });

      it('should get mode by ID', () => {
        const firstMode = ALL_HEALTHCARE_MODES[0]!;
        const mode = getHealthcareMode(firstMode.id);
        expect(mode).toBeDefined();
        expect(mode?.id).toBe(firstMode.id);
      });

      it('should filter modes by category', () => {
        const clinicalModes = getHealthcareModesByCategory('clinical');
        expect(Array.isArray(clinicalModes)).toBe(true);
      });
    });

    describe('Agents', () => {
      it('should have 16 total healthcare agents', () => {
        expect(ALL_HEALTHCARE_AGENTS.length).toBe(16);
      });

      it('should have 8 default agents', () => {
        const defaultAgents = getDefaultHealthcareAgents();
        expect(defaultAgents.length).toBe(8);
      });

      it('should get agent by ID', () => {
        const agent = getHealthcareAgent('clinical-advisor');
        expect(agent).toBeDefined();
        expect(agent?.hipaaAware).toBe(true);
      });

      it('should have HIPAA awareness on clinical agents', () => {
        const defaultAgents = getDefaultHealthcareAgents();
        defaultAgents.forEach(agent => {
          expect(agent.hipaaAware).toBe(true);
        });
      });
    });
  });

  // ===========================================================================
  // INSURANCE VERTICAL
  // ===========================================================================

  describe('Insurance Vertical', () => {
    describe('Modes', () => {
      it('should have multiple insurance modes defined', () => {
        expect(ALL_INSURANCE_MODES.length).toBeGreaterThan(0);
      });

      it('should get mode by ID', () => {
        const firstMode = ALL_INSURANCE_MODES[0]!;
        const mode = getInsuranceMode(firstMode.id);
        expect(mode).toBeDefined();
      });

      it('should filter modes by category', () => {
        const underwritingModes = getInsuranceModesByCategory('underwriting');
        expect(Array.isArray(underwritingModes)).toBe(true);
      });
    });

    describe('Agents', () => {
      it('should have 16 total insurance agents', () => {
        expect(ALL_INSURANCE_AGENTS.length).toBe(16);
      });

      it('should have 8 default agents', () => {
        const defaultAgents = getDefaultInsuranceAgents();
        expect(defaultAgents.length).toBe(8);
      });

      it('should get agent by ID', () => {
        const agent = getInsuranceAgent('chief-underwriter');
        expect(agent).toBeDefined();
        expect(agent?.regulatoryAware).toBe(true);
      });
    });
  });

  // ===========================================================================
  // ENERGY VERTICAL
  // ===========================================================================

  describe('Energy Vertical', () => {
    describe('Modes', () => {
      it('should have multiple energy modes defined', () => {
        expect(ALL_ENERGY_MODES.length).toBeGreaterThan(0);
      });

      it('should get mode by ID', () => {
        const firstMode = ALL_ENERGY_MODES[0]!;
        const mode = getEnergyMode(firstMode.id);
        expect(mode).toBeDefined();
      });

      it('should filter modes by category', () => {
        const gridModes = getEnergyModesByCategory('grid');
        expect(Array.isArray(gridModes)).toBe(true);
      });
    });

    describe('Agents', () => {
      it('should have 16 total energy agents', () => {
        expect(ALL_ENERGY_AGENTS.length).toBe(16);
      });

      it('should have 8 default agents', () => {
        const defaultAgents = getDefaultEnergyAgents();
        expect(defaultAgents.length).toBe(8);
      });

      it('should get agent by ID', () => {
        const agent = getEnergyAgent('grid-controller');
        expect(agent).toBeDefined();
        expect(agent?.gridAware).toBe(true);
      });

      it('should have safety focus on relevant agents', () => {
        const safetyOfficer = getEnergyAgent('safety-officer');
        expect(safetyOfficer?.safetyFocused).toBe(true);
      });
    });
  });

  // ===========================================================================
  // CROSS-VERTICAL CONSISTENCY
  // ===========================================================================

  describe('Cross-Vertical Consistency', () => {
    it('all verticals should have the same agent structure (8 default + 6 optional + 2 silent)', () => {
      expect(ALL_FINANCIAL_AGENTS.length).toBe(16);
      expect(ALL_HEALTHCARE_AGENTS.length).toBe(16);
      expect(ALL_INSURANCE_AGENTS.length).toBe(16);
      expect(ALL_ENERGY_AGENTS.length).toBe(16);
    });

    it('all verticals should have modes with required properties', () => {
      const allModes = [
        ...ALL_FINANCIAL_MODES,
        ...ALL_HEALTHCARE_MODES,
        ...ALL_INSURANCE_MODES,
        ...ALL_ENERGY_MODES,
      ];

      allModes.forEach(mode => {
        expect(mode.id).toBeDefined();
        expect(mode.name).toBeDefined();
        expect(mode.category).toBeDefined();
        expect(mode.leadAgent).toBeDefined();
      });
    });

    it('all agents should have unique IDs within their vertical', () => {
      const checkUnique = (agents: { id: string }[]) => {
        const ids = agents.map(a => a.id);
        const uniqueIds = new Set(ids);
        expect(uniqueIds.size).toBe(ids.length);
      };

      checkUnique(ALL_FINANCIAL_AGENTS);
      checkUnique(ALL_HEALTHCARE_AGENTS);
      checkUnique(ALL_INSURANCE_AGENTS);
      checkUnique(ALL_ENERGY_AGENTS);
    });
  });
});
