// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * CENDIA VERTICAL CONFIGURATION SERVICE�
 * 
 * Industry vertical management with toggleable service access
 * Allows customization of service bundles per organization/vertical
 */

import { EventEmitter } from 'events';
import { logger } from '../../utils/logger.js';
import { getErrorMessage } from '../../utils/errors.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ServiceDefinition {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'intelligence' | 'governance' | 'security' | 'sovereign' | 'analytics';
  icon: string;
  tier: 'foundation' | 'enterprise' | 'strategic';
  isCore: boolean; // Cannot be disabled
}

export interface VerticalTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  defaultServices: string[]; // Service IDs enabled by default
  recommendedServices: string[]; // Suggested but not enabled
  excludedServices: string[]; // Not applicable for this vertical
}

export interface OrganizationVerticalConfig {
  id: string;
  organizationId: string;
  verticalId: string;
  enabledServices: string[];
  disabledServices: string[];
  customizations: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
  createdBy: string;
  updatedBy: string;
}

export interface ServiceToggle {
  serviceId: string;
  enabled: boolean;
  enabledAt?: Date | undefined;
  enabledBy?: string | undefined;
  disabledAt?: Date | undefined;
  disabledBy?: string | undefined;
  reason?: string | undefined;
}

// =============================================================================
// SERVICE CATALOG
// =============================================================================

export const SERVICE_CATALOG: ServiceDefinition[] = [
  // Core Services (Cannot be disabled)
  { id: 'council', name: 'CendiaCouncil�', description: 'AI-powered multi-agent deliberation engine', category: 'core', icon: '???', tier: 'foundation', isCore: true },
  { id: 'ledger', name: 'CendiaLedger�', description: 'Immutable decision blockchain for audit trails', category: 'governance', icon: '??', tier: 'foundation', isCore: true },
  { id: 'evidence-vault', name: 'Evidence Vault', description: 'Global decision packet management', category: 'governance', icon: '???', tier: 'foundation', isCore: true },
  
  // Intelligence Services
  { id: 'chronos', name: 'CendiaChronos�', description: 'Decision timeline & pivotal moment detection', category: 'intelligence', icon: '?', tier: 'foundation', isCore: false },
  { id: 'decision-dna', name: 'DecisionDNA', description: 'Full decision lifecycle visualization', category: 'intelligence', icon: '??', tier: 'foundation', isCore: false },
  { id: 'ghost-board', name: 'Ghost Board', description: 'What-if scenario simulation', category: 'intelligence', icon: '??', tier: 'foundation', isCore: false },
  { id: 'pre-mortem', name: 'Pre-Mortem', description: 'Proactive risk analysis', category: 'intelligence', icon: '??', tier: 'foundation', isCore: false },
  { id: 'cascade', name: 'CendiaCascade�', description: 'Decision consequence engineering', category: 'intelligence', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'horizon', name: 'CendiaHorizon�', description: 'Strategic forecasting & prediction', category: 'intelligence', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'genomics', name: 'CendiaGenomics�', description: 'Decision pattern DNA analysis', category: 'intelligence', icon: '??', tier: 'enterprise', isCore: false },
  
  // Governance Services
  { id: 'govern', name: 'CendiaGovern�', description: 'Policy-as-code enforcement', category: 'governance', icon: '??', tier: 'foundation', isCore: false },
  { id: 'veto', name: 'CendiaVeto�', description: 'Human override capability', category: 'governance', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'dissent', name: 'CendiaDissent�', description: 'Protected whistleblower channels', category: 'governance', icon: '?', tier: 'enterprise', isCore: false },
  { id: 'regulatory-absorb', name: 'Regulatory Absorb', description: 'Compliance document ingestion', category: 'governance', icon: '??', tier: 'foundation', isCore: false },
  { id: 'audit-workflow', name: 'Audit Workflow', description: 'Compliance audit management', category: 'governance', icon: '??', tier: 'foundation', isCore: false },
  
  // Security Services
  { id: 'defense-stack', name: 'CendiaDefenseStack�', description: 'Security posture management', category: 'security', icon: '???', tier: 'enterprise', isCore: false },
  { id: 'red-team', name: 'RedTeam', description: 'Adversarial AI testing', category: 'security', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'apotheosis', name: 'CendiaApotheosis�', description: 'Self-improving AI with safety rails', category: 'security', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'panopticon', name: 'CendiaPanopticon�', description: 'Real-time observability', category: 'security', icon: '???', tier: 'enterprise', isCore: false },
  { id: 'crisis-management', name: 'Crisis Management', description: 'Incident response coordination', category: 'security', icon: '??', tier: 'enterprise', isCore: false },
  
  // Analytics Services
  { id: 'echo', name: 'CendiaEcho�', description: 'Decision outcome tracking', category: 'analytics', icon: '??', tier: 'foundation', isCore: false },
  { id: 'gnosis', name: 'CendiaGnosis�', description: 'Knowledge graph exploration', category: 'analytics', icon: '??', tier: 'foundation', isCore: false },
  { id: 'voice', name: 'CendiaVoice�', description: 'Executive presentation layer', category: 'analytics', icon: '???', tier: 'enterprise', isCore: false },
  { id: 'persona-forge', name: 'CendiaPersonaForge�', description: 'Stakeholder simulation', category: 'analytics', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'omni-translate', name: 'CendiaOmniTranslate�', description: '100+ language translation', category: 'analytics', icon: '??', tier: 'enterprise', isCore: false },
  
  // Sovereign Services
  { id: 'sovereign', name: 'CendiaSovereign�', description: 'On-premise air-gapped deployment', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'mesh', name: 'CendiaMesh�', description: 'Secure multi-site collaboration', category: 'sovereign', icon: '???', tier: 'enterprise', isCore: false },
  { id: 'data-diode', name: 'Data Diode', description: 'Unidirectional secure data ingest', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'local-rlhf', name: 'Local RLHF', description: 'Zero-cloud AI improvement', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'tpm-attestation', name: 'TPM Attestation', description: 'Hardware-signed decisions', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'time-lock', name: 'Time-Lock', description: 'Cryptographic decision embargo', category: 'sovereign', icon: '?', tier: 'strategic', isCore: false },
  { id: 'federated-mesh', name: 'Federated Mesh', description: 'Multi-org learning without data sharing', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'qr-air-gap', name: 'QR Air-Gap Bridge', description: 'Animated QR for disconnected ops', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'canary-tripwire', name: 'Canary Tripwire', description: 'Exfiltration detection', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  { id: 'portable-instance', name: 'Portable Instance', description: 'USB-bootable deployment', category: 'sovereign', icon: '??', tier: 'strategic', isCore: false },
  
  // Additional Enterprise Services
  { id: 'autopilot', name: 'CendiaAutopilot�', description: 'Automated decision execution', category: 'intelligence', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'union', name: 'CendiaUnion�', description: 'Multi-agent defensive synthesis', category: 'intelligence', icon: '??', tier: 'enterprise', isCore: false },
  { id: 'training', name: 'Training Center', description: 'User onboarding & certification', category: 'core', icon: '??', tier: 'foundation', isCore: false },
];

// =============================================================================
// VERTICAL TEMPLATES
// =============================================================================

export const VERTICAL_TEMPLATES: VerticalTemplate[] = [
  {
    id: 'financial-services',
    name: 'Financial Services',
    description: 'Banks, Asset Managers, Insurance',
    icon: '??',
    color: '#10B981',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'govern', 'chronos', 'decision-dna', 'regulatory-absorb', 'audit-workflow', 'cascade', 'dissent', 'omni-translate'],
    recommendedServices: ['red-team', 'ghost-board', 'pre-mortem', 'echo', 'crisis-management'],
    excludedServices: ['data-diode', 'qr-air-gap', 'portable-instance'],
  },
  {
    id: 'healthcare',
    name: 'Healthcare / Life Sciences',
    description: 'Hospitals, Pharma, Biotech',
    icon: '??',
    color: '#EC4899',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'veto', 'dissent', 'regulatory-absorb', 'ghost-board', 'pre-mortem', 'mesh', 'omni-translate', 'apotheosis'],
    recommendedServices: ['chronos', 'decision-dna', 'crisis-management', 'audit-workflow'],
    excludedServices: ['qr-air-gap', 'portable-instance'],
  },
  {
    id: 'manufacturing',
    name: 'Manufacturing / Supply Chain',
    description: 'Automotive, Aerospace, CPG',
    icon: '??',
    color: '#F59E0B',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'chronos', 'horizon', 'pre-mortem', 'mesh', 'data-diode', 'ghost-board', 'genomics', 'crisis-management'],
    recommendedServices: ['govern', 'audit-workflow', 'echo'],
    excludedServices: ['regulatory-absorb', 'time-lock'],
  },
  {
    id: 'technology',
    name: 'Technology / SaaS',
    description: 'Software Companies, Cloud Providers',
    icon: '??',
    color: '#8B5CF6',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'apotheosis', 'red-team', 'chronos', 'ghost-board', 'defense-stack', 'panopticon', 'autopilot', 'crisis-management'],
    recommendedServices: ['cascade', 'genomics', 'echo', 'gnosis'],
    excludedServices: ['regulatory-absorb', 'time-lock', 'qr-air-gap'],
  },
  {
    id: 'energy',
    name: 'Energy / Utilities',
    description: 'Oil & Gas, Power, Renewables',
    icon: '?',
    color: '#EF4444',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'pre-mortem', 'data-diode', 'qr-air-gap', 'tpm-attestation', 'crisis-management', 'mesh'],
    recommendedServices: ['govern', 'audit-workflow', 'chronos'],
    excludedServices: ['persona-forge', 'voice'],
  },
  {
    id: 'government',
    name: 'Government / Public Sector',
    description: 'Federal, State, Defense',
    icon: '???',
    color: '#3B82F6',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'sovereign', 'veto', 'dissent', 'portable-instance', 'federated-mesh', 'local-rlhf', 'time-lock', 'canary-tripwire', 'tpm-attestation'],
    recommendedServices: ['data-diode', 'qr-air-gap', 'govern', 'audit-workflow'],
    excludedServices: ['autopilot', 'omni-translate'],
  },
  {
    id: 'legal',
    name: 'Legal / Professional Services',
    description: 'Law Firms, Consulting',
    icon: '??',
    color: '#6366F1',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'regulatory-absorb', 'omni-translate', 'voice', 'ghost-board', 'pre-mortem', 'persona-forge', 'decision-dna'],
    recommendedServices: ['chronos', 'govern', 'dissent'],
    excludedServices: ['data-diode', 'qr-air-gap', 'tpm-attestation', 'portable-instance'],
  },
  // High-Value Additions
  {
    id: 'retail',
    name: 'Retail / E-Commerce',
    description: 'Retailers, D2C Brands, Marketplaces',
    icon: '??',
    color: '#F97316',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'horizon', 'cascade', 'ghost-board', 'crisis-management', 'chronos', 'echo', 'persona-forge'],
    recommendedServices: ['omni-translate', 'autopilot', 'gnosis'],
    excludedServices: ['sovereign', 'time-lock', 'tpm-attestation', 'portable-instance'],
  },
  {
    id: 'real-estate',
    name: 'Real Estate / PropTech',
    description: 'REITs, Property Management, Development',
    icon: '??',
    color: '#84CC16',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'ghost-board', 'decision-dna', 'chronos', 'govern'],
    recommendedServices: ['pre-mortem', 'echo', 'audit-workflow'],
    excludedServices: ['sovereign', 'data-diode', 'tpm-attestation', 'portable-instance'],
  },
  {
    id: 'telecommunications',
    name: 'Telecommunications',
    description: 'Carriers, ISPs, Network Operators',
    icon: '??',
    color: '#06B6D4',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'panopticon', 'cascade', 'mesh', 'crisis-management', 'horizon', 'defense-stack', 'chronos'],
    recommendedServices: ['data-diode', 'autopilot', 'echo'],
    excludedServices: ['time-lock', 'portable-instance'],
  },
  {
    id: 'hospitality',
    name: 'Hospitality / Travel',
    description: 'Hotels, Airlines, OTAs, Cruise Lines',
    icon: '??',
    color: '#0EA5E9',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'horizon', 'cascade', 'omni-translate', 'persona-forge', 'crisis-management', 'ghost-board', 'chronos'],
    recommendedServices: ['echo', 'voice', 'autopilot'],
    excludedServices: ['sovereign', 'data-diode', 'tpm-attestation', 'portable-instance'],
  },
  {
    id: 'education',
    name: 'Education / EdTech',
    description: 'Universities, K-12, LMS Providers',
    icon: '??',
    color: '#A855F7',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'training', 'veto', 'dissent', 'govern', 'decision-dna', 'chronos', 'gnosis'],
    recommendedServices: ['regulatory-absorb', 'omni-translate', 'echo'],
    excludedServices: ['sovereign', 'data-diode', 'tpm-attestation', 'autopilot'],
  },
  {
    id: 'media',
    name: 'Media / Entertainment',
    description: 'Studios, Streaming, Gaming, Publishing',
    icon: '??',
    color: '#EC4899',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'persona-forge', 'cascade', 'chronos', 'ghost-board', 'horizon', 'voice', 'echo'],
    recommendedServices: ['omni-translate', 'gnosis', 'crisis-management'],
    excludedServices: ['sovereign', 'data-diode', 'tpm-attestation', 'portable-instance'],
  },
  {
    id: 'agriculture',
    name: 'Agriculture / AgTech',
    description: 'Farms, Food Supply Chain, AgTech',
    icon: '??',
    color: '#22C55E',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'horizon', 'data-diode', 'cascade', 'mesh', 'crisis-management', 'chronos', 'pre-mortem'],
    recommendedServices: ['govern', 'echo', 'panopticon'],
    excludedServices: ['time-lock', 'portable-instance', 'persona-forge'],
  },
  {
    id: 'logistics',
    name: 'Logistics / Transportation',
    description: 'Freight, 3PL, Shipping, Fleet',
    icon: '??',
    color: '#F59E0B',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'data-diode', 'crisis-management', 'mesh', 'chronos', 'panopticon'],
    recommendedServices: ['autopilot', 'echo', 'govern'],
    excludedServices: ['time-lock', 'portable-instance', 'persona-forge'],
  },
  {
    id: 'insurance',
    name: 'Insurance (Specialized)',
    description: 'P&C, Reinsurance, InsurTech',
    icon: '???',
    color: '#14B8A6',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'horizon', 'regulatory-absorb', 'audit-workflow', 'ghost-board', 'pre-mortem', 'decision-dna'],
    recommendedServices: ['echo', 'chronos', 'persona-forge'],
    excludedServices: ['sovereign', 'data-diode', 'tpm-attestation', 'portable-instance'],
  },
  {
    id: 'nonprofit',
    name: 'Non-Profit / NGO',
    description: 'Foundations, Aid Organizations, Charities',
    icon: '??',
    color: '#F472B6',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'veto', 'dissent', 'govern', 'decision-dna', 'chronos', 'omni-translate', 'audit-workflow'],
    recommendedServices: ['echo', 'pre-mortem', 'voice'],
    excludedServices: ['sovereign', 'autopilot', 'red-team', 'defense-stack'],
  },
  // Specialized / Niche
  {
    id: 'construction',
    name: 'Construction / Engineering',
    description: 'Contractors, AEC, Infrastructure',
    icon: '???',
    color: '#78716C',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'pre-mortem', 'data-diode', 'crisis-management', 'mesh', 'chronos', 'horizon'],
    recommendedServices: ['govern', 'audit-workflow', 'echo'],
    excludedServices: ['time-lock', 'portable-instance', 'persona-forge'],
  },
  {
    id: 'mining',
    name: 'Mining / Resources',
    description: 'Mining, Forestry, Natural Resources',
    icon: '??',
    color: '#A16207',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'sovereign', 'data-diode', 'tpm-attestation', 'crisis-management', 'cascade', 'mesh', 'qr-air-gap'],
    recommendedServices: ['horizon', 'pre-mortem', 'portable-instance'],
    excludedServices: ['persona-forge', 'voice', 'omni-translate'],
  },
  {
    id: 'aerospace',
    name: 'Aerospace / Defense',
    description: 'Defense Contractors, Space, Aviation',
    icon: '??',
    color: '#1E3A8A',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'sovereign', 'time-lock', 'tpm-attestation', 'federated-mesh', 'canary-tripwire', 'portable-instance', 'local-rlhf', 'veto', 'dissent'],
    recommendedServices: ['data-diode', 'qr-air-gap', 'crisis-management'],
    excludedServices: ['autopilot', 'omni-translate'],
  },
  {
    id: 'pharmaceuticals',
    name: 'Pharmaceuticals (Specialized)',
    description: 'Clinical Trials, Drug Development, R&D',
    icon: '??',
    color: '#059669',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'regulatory-absorb', 'chronos', 'veto', 'dissent', 'audit-workflow', 'decision-dna', 'pre-mortem', 'ghost-board'],
    recommendedServices: ['mesh', 'omni-translate', 'echo'],
    excludedServices: ['autopilot', 'qr-air-gap'],
  },
  {
    id: 'automotive',
    name: 'Automotive (Specialized)',
    description: 'OEMs, Tier 1 Suppliers, EV Manufacturers',
    icon: '??',
    color: '#DC2626',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'cascade', 'data-diode', 'mesh', 'crisis-management', 'horizon', 'pre-mortem', 'chronos', 'genomics'],
    recommendedServices: ['govern', 'audit-workflow', 'panopticon'],
    excludedServices: ['time-lock', 'portable-instance'],
  },
  {
    id: 'sports',
    name: 'Sports / Entertainment',
    description: 'Leagues, Teams, Venues, Esports',
    icon: '??',
    color: '#7C3AED',
    defaultServices: ['council', 'ledger', 'evidence-vault', 'persona-forge', 'crisis-management', 'cascade', 'ghost-board', 'chronos', 'voice', 'echo'],
    recommendedServices: ['omni-translate', 'horizon', 'gnosis'],
    excludedServices: ['sovereign', 'data-diode', 'tpm-attestation'],
  },
  {
    id: 'custom',
    name: 'Custom Configuration',
    description: 'Build your own service bundle',
    icon: '??',
    color: '#6B7280',
    defaultServices: ['council', 'ledger', 'evidence-vault'],
    recommendedServices: [],
    excludedServices: [],
  },
];

// =============================================================================
// SERVICE IMPLEMENTATION
// =============================================================================

class VerticalConfigService extends EventEmitter {
  private static instance: VerticalConfigService;
  private orgConfigs: Map<string, OrganizationVerticalConfig> = new Map();

  private constructor() {
    super();
    // Auto-initialize default organization with Legal vertical (most comprehensive)
    this.initializeDefaultOrg();
    logger.info('[VerticalConfig] Service initialized');


    this.loadFromDB().catch(() => {});
  }

  private initializeDefaultOrg(): void {
    const defaultOrgId = 'default-org';
    const legalVertical = VERTICAL_TEMPLATES.find(v => v.id === 'legal');
    if (legalVertical) {
      const coreServiceIds = SERVICE_CATALOG.filter(s => s.isCore).map(s => s.id);
      const config: OrganizationVerticalConfig = {
        id: `vc-default`,
        organizationId: defaultOrgId,
        verticalId: 'legal',
        enabledServices: [...new Set([...coreServiceIds, ...legalVertical.defaultServices])],
        disabledServices: [],
        customizations: {},
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        updatedBy: 'system',
      };
      this.orgConfigs.set(defaultOrgId, config);
      logger.info('[VerticalConfig] Default organization initialized with Legal vertical');
    }
  }

  static getInstance(): VerticalConfigService {
    if (!VerticalConfigService.instance) {
      VerticalConfigService.instance = new VerticalConfigService();
    }
    return VerticalConfigService.instance;
  }

  // ===========================================================================
  // CATALOG & TEMPLATES
  // ===========================================================================

  getServiceCatalog(): ServiceDefinition[] {
    return SERVICE_CATALOG;
  }

  getServiceById(serviceId: string): ServiceDefinition | undefined {
    return SERVICE_CATALOG.find(s => s.id === serviceId);
  }

  getServicesByCategory(category: ServiceDefinition['category']): ServiceDefinition[] {
    return SERVICE_CATALOG.filter(s => s.category === category);
  }

  getServicesByTier(tier: ServiceDefinition['tier']): ServiceDefinition[] {
    return SERVICE_CATALOG.filter(s => s.tier === tier);
  }

  getCoreServices(): ServiceDefinition[] {
    return SERVICE_CATALOG.filter(s => s.isCore);
  }

  getVerticalTemplates(): VerticalTemplate[] {
    return VERTICAL_TEMPLATES;
  }

  getVerticalById(verticalId: string): VerticalTemplate | undefined {
    return VERTICAL_TEMPLATES.find(v => v.id === verticalId);
  }

  // ===========================================================================
  // ORGANIZATION CONFIGURATION
  // ===========================================================================

  async getOrganizationConfig(organizationId: string): Promise<OrganizationVerticalConfig | null> {
    return this.orgConfigs.get(organizationId) || null;
  }

  async createOrganizationConfig(
    organizationId: string,
    verticalId: string,
    userId: string,
    customEnabledServices?: string[]
  ): Promise<OrganizationVerticalConfig> {
    const vertical = this.getVerticalById(verticalId);
    if (!vertical) {
      throw new Error(`Vertical ${verticalId} not found`);
    }

    const coreServiceIds = this.getCoreServices().map(s => s.id);
    const enabledServices = customEnabledServices 
      ? [...new Set([...coreServiceIds, ...customEnabledServices])]
      : [...new Set([...coreServiceIds, ...vertical.defaultServices])];

    const config: OrganizationVerticalConfig = {
      id: `vc-${Date.now()}`,
      organizationId,
      verticalId,
      enabledServices,
      disabledServices: [],
      customizations: {},
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: userId,
      updatedBy: userId,
    };

    this.orgConfigs.set(organizationId, config);
    this.emit('config:created', { organizationId, config });

    return config;
  }

  async updateOrganizationConfig(
    organizationId: string,
    updates: Partial<Pick<OrganizationVerticalConfig, 'verticalId' | 'enabledServices' | 'disabledServices' | 'customizations'>>,
    userId: string
  ): Promise<OrganizationVerticalConfig> {
    const existing = this.orgConfigs.get(organizationId);
    if (!existing) {
      throw new Error(`No configuration found for organization ${organizationId}`);
    }

    // Ensure core services are always enabled
    const coreServiceIds = this.getCoreServices().map(s => s.id);
    let enabledServices = updates.enabledServices || existing.enabledServices;
    enabledServices = [...new Set([...coreServiceIds, ...enabledServices])];

    // Remove core services from disabled list
    let disabledServices = updates.disabledServices || existing.disabledServices;
    disabledServices = disabledServices.filter(s => !coreServiceIds.includes(s));

    const updated: OrganizationVerticalConfig = {
      ...existing,
      ...updates,
      enabledServices,
      disabledServices,
      updatedAt: new Date(),
      updatedBy: userId,
    };

    this.orgConfigs.set(organizationId, updated);
    this.emit('config:updated', { organizationId, config: updated });

    return updated;
  }

  // ===========================================================================
  // SERVICE TOGGLES
  // ===========================================================================

  async toggleService(
    organizationId: string,
    serviceId: string,
    enabled: boolean,
    userId: string,
    reason?: string
  ): Promise<ServiceToggle> {
    const service = this.getServiceById(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    if (service.isCore && !enabled) {
      throw new Error(`Core service ${serviceId} cannot be disabled`);
    }

    const config = await this.getOrganizationConfig(organizationId);
    if (!config) {
      throw new Error(`No configuration found for organization ${organizationId}`);
    }

    const now = new Date();
    const toggle: ServiceToggle = {
      serviceId,
      enabled,
      ...(enabled ? { enabledAt: now, enabledBy: userId } : { disabledAt: now, disabledBy: userId }),
      reason,
    };

    // Update enabled/disabled lists
    if (enabled) {
      config.enabledServices = [...new Set([...config.enabledServices, serviceId])];
      config.disabledServices = config.disabledServices.filter(s => s !== serviceId);
    } else {
      config.disabledServices = [...new Set([...config.disabledServices, serviceId])];
      config.enabledServices = config.enabledServices.filter(s => s !== serviceId);
    }

    config.updatedAt = now;
    config.updatedBy = userId;

    this.orgConfigs.set(organizationId, config);
    this.emit('service:toggled', { organizationId, toggle });

    logger.info(`[VerticalConfig] Service ${serviceId} ${enabled ? 'enabled' : 'disabled'} for org ${organizationId}`);

    return toggle;
  }

  async bulkToggleServices(
    organizationId: string,
    toggles: { serviceId: string; enabled: boolean }[],
    userId: string
  ): Promise<ServiceToggle[]> {
    const results: ServiceToggle[] = [];

    for (const { serviceId, enabled } of toggles) {
      try {
        const toggle = await this.toggleService(organizationId, serviceId, enabled, userId);
        results.push(toggle);
      } catch (error: unknown) {
        logger.warn(`[VerticalConfig] Failed to toggle ${serviceId}: ${getErrorMessage(error)}`);
      }
    }

    return results;
  }

  // ===========================================================================
  // ACCESS CHECKS
  // ===========================================================================

  async isServiceEnabled(organizationId: string, serviceId: string): Promise<boolean> {
    const service = this.getServiceById(serviceId);
    if (!service) return false;

    // Core services are always enabled
    if (service.isCore) return true;

    const config = await this.getOrganizationConfig(organizationId);
    if (!config) return false;

    return config.enabledServices.includes(serviceId) && !config.disabledServices.includes(serviceId);
  }

  async getEnabledServices(organizationId: string): Promise<ServiceDefinition[]> {
    const config = await this.getOrganizationConfig(organizationId);
    if (!config) {
      return this.getCoreServices();
    }

    return SERVICE_CATALOG.filter(s => 
      s.isCore || (config.enabledServices.includes(s.id) && !config.disabledServices.includes(s.id))
    );
  }

  async getDisabledServices(organizationId: string): Promise<ServiceDefinition[]> {
    const config = await this.getOrganizationConfig(organizationId);
    if (!config) {
      return SERVICE_CATALOG.filter(s => !s.isCore);
    }

    return SERVICE_CATALOG.filter(s => 
      !s.isCore && (!config.enabledServices.includes(s.id) || config.disabledServices.includes(s.id))
    );
  }

  // ===========================================================================
  // VERTICAL SWITCHING
  // ===========================================================================

  async switchVertical(
    organizationId: string,
    newVerticalId: string,
    userId: string,
    preserveCustomizations: boolean = true
  ): Promise<OrganizationVerticalConfig> {
    const newVertical = this.getVerticalById(newVerticalId);
    if (!newVertical) {
      throw new Error(`Vertical ${newVerticalId} not found`);
    }

    const existing = await this.getOrganizationConfig(organizationId);
    const coreServiceIds = this.getCoreServices().map(s => s.id);

    let enabledServices: string[];
    if (preserveCustomizations && existing) {
      // Keep existing customizations but add new vertical defaults
      const customEnabled = existing.enabledServices.filter(s => 
        !VERTICAL_TEMPLATES.find(v => v.id === existing.verticalId)?.defaultServices.includes(s)
      );
      enabledServices = [...new Set([...coreServiceIds, ...newVertical.defaultServices, ...customEnabled])];
    } else {
      enabledServices = [...new Set([...coreServiceIds, ...newVertical.defaultServices])];
    }

    const config: OrganizationVerticalConfig = {
      id: existing?.id || `vc-${Date.now()}`,
      organizationId,
      verticalId: newVerticalId,
      enabledServices,
      disabledServices: preserveCustomizations && existing ? existing.disabledServices : [],
      customizations: preserveCustomizations && existing ? existing.customizations : {},
      createdAt: existing?.createdAt || new Date(),
      updatedAt: new Date(),
      createdBy: existing?.createdBy || userId,
      updatedBy: userId,
    };

    this.orgConfigs.set(organizationId, config);
    this.emit('vertical:switched', { organizationId, oldVertical: existing?.verticalId, newVertical: newVerticalId });

    return config;
  }

  // ===========================================================================
  // COMPARISON & RECOMMENDATIONS
  // ===========================================================================

  compareVerticals(verticalId1: string, verticalId2: string): {
    onlyIn1: string[];
    onlyIn2: string[];
    inBoth: string[];
  } {
    const v1 = this.getVerticalById(verticalId1);
    const v2 = this.getVerticalById(verticalId2);

    if (!v1 || !v2) {
      throw new Error('One or both verticals not found');
    }

    const set1 = new Set(v1.defaultServices);
    const set2 = new Set(v2.defaultServices);

    return {
      onlyIn1: v1.defaultServices.filter(s => !set2.has(s)),
      onlyIn2: v2.defaultServices.filter(s => !set1.has(s)),
      inBoth: v1.defaultServices.filter(s => set2.has(s)),
    };
  }

  getRecommendedServices(verticalId: string): ServiceDefinition[] {
    const vertical = this.getVerticalById(verticalId);
    if (!vertical) return [];

    return SERVICE_CATALOG.filter(s => vertical.recommendedServices.includes(s.id));
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'VerticalConfig', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.orgConfigs.has(d.id)) this.orgConfigs.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[VerticalConfigService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[VerticalConfigService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const verticalConfigService = VerticalConfigService.getInstance();
export default verticalConfigService;
