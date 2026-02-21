// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SCGE - Policy Injection Service
 * 
 * Manages policy bundles for governance simulation.
 * Policies are code-as-law: versioned, signed, immutable once executed.
 */

import {
  PolicyBundle,
  PolicyRule,
  PolicyConstraint,
  PolicyMetadata,
  PolicyDomain,
  PolicyStatus,
  InstitutionType,
  generateSCGEId,
  hashSCGEState,
} from './types.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// POLICY INJECTION SERVICE
// =============================================================================

export class PolicyInjectionService {
  private policies: Map<string, PolicyBundle> = new Map();
  private policyVersions: Map<string, PolicyBundle[]> = new Map();



  constructor() {


    this.loadFromDB().catch(() => {});


  }


  /**
   * Create a new policy bundle
   */
  createPolicyBundle(
    name: string,
    domain: PolicyDomain,
    rules: PolicyRule[],
    constraints: PolicyConstraint[],
    metadata: Partial<PolicyMetadata>
  ): PolicyBundle {
    const now = new Date();
    
    const fullMetadata: PolicyMetadata = {
      author: metadata.author || 'system',
      reviewers: metadata.reviewers || [],
      approvalDate: metadata.approvalDate,
      expiryDate: metadata.expiryDate,
      tags: metadata.tags || [],
      references: metadata.references || [],
    };

    const bundle: PolicyBundle = {
      id: generateSCGEId('pol'),
      name,
      domain,
      version: 1,
      status: PolicyStatus.DRAFT,
      rules: rules.map(r => ({ ...r, id: r.id || generateSCGEId('rule') })),
      constraints: constraints.map(c => ({ ...c, id: c.id || generateSCGEId('con') })),
      metadata: fullMetadata,
      hash: '',
      createdAt: now,
    };

    bundle.hash = hashSCGEState(bundle);
    this.policies.set(bundle.id, bundle);
    this.policyVersions.set(bundle.id, [bundle]);

    return bundle;
  }

  /**
   * Create a new version of an existing policy
   */
  createPolicyVersion(
    policyId: string,
    updates: {
      rules?: PolicyRule[];
      constraints?: PolicyConstraint[];
      metadata?: Partial<PolicyMetadata>;
    }
  ): PolicyBundle {
    const existing = this.policies.get(policyId);
    if (!existing) {
      throw new Error(`Policy not found: ${policyId}`);
    }

    const now = new Date();
    const newVersion: PolicyBundle = {
      ...existing,
      id: generateSCGEId('pol'),
      version: existing.version + 1,
      status: PolicyStatus.DRAFT,
      rules: updates.rules || existing.rules,
      constraints: updates.constraints || existing.constraints,
      metadata: {
        ...existing.metadata,
        ...updates.metadata,
      },
      hash: '',
      previousVersionHash: existing.hash,
      createdAt: now,
      activatedAt: undefined,
    };

    newVersion.hash = hashSCGEState(newVersion);
    this.policies.set(newVersion.id, newVersion);
    
    const versions = this.policyVersions.get(policyId) || [];
    versions.push(newVersion);
    this.policyVersions.set(policyId, versions);

    return newVersion;
  }

  /**
   * Activate a policy bundle
   */
  activatePolicy(policyId: string): PolicyBundle {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error(`Policy not found: ${policyId}`);
    }

    if (policy.status !== PolicyStatus.APPROVED && policy.status !== PolicyStatus.DRAFT) {
      throw new Error(`Policy cannot be activated from status: ${policy.status}`);
    }

    const activated: PolicyBundle = {
      ...policy,
      status: PolicyStatus.ACTIVE,
      activatedAt: new Date(),
    };

    activated.hash = hashSCGEState(activated);
    this.policies.set(policyId, activated);

    return activated;
  }

  /**
   * Suspend a policy
   */
  suspendPolicy(policyId: string): PolicyBundle {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error(`Policy not found: ${policyId}`);
    }

    const suspended: PolicyBundle = {
      ...policy,
      status: PolicyStatus.SUSPENDED,
    };

    suspended.hash = hashSCGEState(suspended);
    this.policies.set(policyId, suspended);

    return suspended;
  }

  /**
   * Get policy by ID
   */
  getPolicy(policyId: string): PolicyBundle | undefined {
    return this.policies.get(policyId);
  }

  /**
   * List all policies
   */
  listPolicies(): PolicyBundle[] {
    return Array.from(this.policies.values());
  }

  /**
   * List policies by domain
   */
  listPoliciesByDomain(domain: PolicyDomain): PolicyBundle[] {
    return Array.from(this.policies.values()).filter(p => p.domain === domain);
  }

  /**
   * List active policies
   */
  listActivePolicies(): PolicyBundle[] {
    return Array.from(this.policies.values()).filter(p => p.status === PolicyStatus.ACTIVE);
  }

  /**
   * Evaluate a decision against policy rules
   */
  evaluateDecision(
    policyId: string,
    decisionContext: Record<string, unknown>
  ): PolicyEvaluationResult {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error(`Policy not found: ${policyId}`);
    }

    const ruleResults: RuleEvaluationResult[] = [];
    const constraintResults: ConstraintEvaluationResult[] = [];

    // Evaluate each rule
    for (const rule of policy.rules) {
      const result = this.evaluateRule(rule, decisionContext);
      ruleResults.push(result);
    }

    // Evaluate each constraint
    for (const constraint of policy.constraints) {
      const result = this.evaluateConstraint(constraint, decisionContext);
      constraintResults.push(result);
    }

    // Determine overall status
    const hardViolations = constraintResults.filter(
      c => c.constraint.type === 'hard' && c.violated
    );
    const softViolations = constraintResults.filter(
      c => c.constraint.type === 'soft' && c.violated
    );

    let overallStatus: 'allowed' | 'blocked' | 'conditional' | 'escalate';
    if (hardViolations.length > 0) {
      overallStatus = 'blocked';
    } else if (softViolations.length > 0) {
      overallStatus = 'conditional';
    } else {
      overallStatus = 'allowed';
    }

    return {
      policyId,
      policyVersion: policy.version,
      evaluatedAt: new Date(),
      overallStatus,
      ruleResults,
      constraintResults,
      requiredActions: this.determineRequiredActions(constraintResults),
      overrideOptions: this.determineOverrideOptions(hardViolations),
      hash: hashSCGEState({ policyId, decisionContext, ruleResults, constraintResults }),
    };
  }

  private evaluateRule(
    rule: PolicyRule,
    context: Record<string, unknown>
  ): RuleEvaluationResult {
    // Simplified rule evaluation - ROADMAP: use rule engine
    const triggered = this.checkRuleCondition(rule.condition, context);
    
    return {
      ruleId: rule.id,
      ruleName: rule.name,
      triggered,
      action: triggered ? rule.action : null,
      exceptions: rule.exceptions.filter(e => this.checkException(e, context)),
    };
  }

  private evaluateConstraint(
    constraint: PolicyConstraint,
    context: Record<string, unknown>
  ): ConstraintEvaluationResult {
    // Simplified constraint evaluation
    const violated = this.checkConstraintViolation(constraint, context);
    
    return {
      constraint,
      violated,
      severity: violated ? constraint.enforcementLevel : 0,
      overrideAuthority: constraint.overrideAuthority,
    };
  }

  private checkRuleCondition(condition: string, context: Record<string, unknown>): boolean {
    // Simplified rule evaluation; ROADMAP: use proper rule engine
    // For now, check if any context key matches condition keywords
    const keywords = condition.toLowerCase().split(/\s+/);
    for (const key of Object.keys(context)) {
      if (keywords.some(kw => key.toLowerCase().includes(kw))) {
        return true;
      }
    }
    return false;
  }

  private checkException(exception: string, context: Record<string, unknown>): boolean {
    // Simplified exception checking
    const exceptionLower = exception.toLowerCase();
    for (const [key, value] of Object.entries(context)) {
      if (exceptionLower.includes(key.toLowerCase()) && value === true) {
        return true;
      }
    }
    return false;
  }

  private checkConstraintViolation(
    constraint: PolicyConstraint,
    context: Record<string, unknown>
  ): boolean {
    // Simplified constraint checking
    // Uses deterministic computation; ROADMAP: formal constraint solver
    const description = constraint.description.toLowerCase();
    
    // Check for budget constraints
    if (description.includes('budget') && context.budgetExceeded) {
      return true;
    }
    
    // Check for approval constraints
    if (description.includes('approval') && !context.approvalObtained) {
      return true;
    }
    
    // Check for timeline constraints
    if (description.includes('timeline') && context.timelineViolated) {
      return true;
    }

    return false;
  }

  private determineRequiredActions(results: ConstraintEvaluationResult[]): string[] {
    const actions: string[] = [];
    
    for (const result of results) {
      if (result.violated) {
        if (result.constraint.type === 'hard') {
          actions.push(`RESOLVE: ${result.constraint.description}`);
        } else if (result.constraint.type === 'soft') {
          actions.push(`REVIEW: ${result.constraint.description}`);
        } else {
          actions.push(`NOTE: ${result.constraint.description}`);
        }
      }
    }
    
    return actions;
  }

  private determineOverrideOptions(
    hardViolations: ConstraintEvaluationResult[]
  ): OverrideOption[] {
    const options: OverrideOption[] = [];
    
    for (const violation of hardViolations) {
      if (violation.overrideAuthority) {
        options.push({
          constraintId: violation.constraint.id,
          authority: violation.overrideAuthority,
          conditions: [`Requires ${violation.overrideAuthority} approval`],
        });
      }
    }
    
    return options;
  }

  /**
   * Verify policy bundle integrity
   */
  verifyPolicyIntegrity(policy: PolicyBundle): boolean {
    const storedHash = policy.hash;
    const tempPolicy = { ...policy, hash: '' };
    const computedHash = hashSCGEState(tempPolicy);
    return storedHash === computedHash;
  }

  /**
   * Get policy version history
   */
  getPolicyHistory(policyId: string): PolicyBundle[] {
    return this.policyVersions.get(policyId) || [];
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'PolicyInjection', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.policies.has(d.id)) this.policies.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'PolicyInjection', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.policyVersions.has(d.id)) this.policyVersions.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[PolicyInjectionService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[PolicyInjectionService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// =============================================================================
// SUPPORTING TYPES
// =============================================================================

interface RuleEvaluationResult {
  ruleId: string;
  ruleName: string;
  triggered: boolean;
  action: string | null;
  exceptions: string[];
}

interface ConstraintEvaluationResult {
  constraint: PolicyConstraint;
  violated: boolean;
  severity: number;
  overrideAuthority?: InstitutionType;
}

interface OverrideOption {
  constraintId: string;
  authority: InstitutionType;
  conditions: string[];
}

interface PolicyEvaluationResult {
  policyId: string;
  policyVersion: number;
  evaluatedAt: Date;
  overallStatus: 'allowed' | 'blocked' | 'conditional' | 'escalate';
  ruleResults: RuleEvaluationResult[];
  constraintResults: ConstraintEvaluationResult[];
  requiredActions: string[];
  overrideOptions: OverrideOption[];
  hash: string;
}

// =============================================================================
// DEFAULT POLICY TEMPLATES
// =============================================================================

export const DEFAULT_POLICY_TEMPLATES: Omit<PolicyBundle, 'id' | 'hash' | 'createdAt'>[] = [
  {
    name: 'Standard Zoning Review',
    domain: PolicyDomain.ZONING,
    version: 1,
    status: PolicyStatus.DRAFT,
    rules: [
      {
        id: 'rule_zone_residential',
        name: 'Residential Zone Compliance',
        condition: 'zone_type = residential',
        action: 'Apply residential density limits',
        priority: 1,
        exceptions: ['historic_district_exemption'],
        effectiveFrom: new Date(),
      },
      {
        id: 'rule_zone_commercial',
        name: 'Commercial Zone Compliance',
        condition: 'zone_type = commercial',
        action: 'Apply commercial use restrictions',
        priority: 1,
        exceptions: ['mixed_use_permit'],
        effectiveFrom: new Date(),
      },
      {
        id: 'rule_environmental',
        name: 'Environmental Review Required',
        condition: 'project_size > threshold',
        action: 'Require environmental impact assessment',
        priority: 2,
        exceptions: ['emergency_infrastructure'],
        effectiveFrom: new Date(),
      },
    ],
    constraints: [
      {
        id: 'con_public_notice',
        type: 'hard',
        description: 'Public notice period must be completed',
        enforcementLevel: 1.0,
      },
      {
        id: 'con_traffic_study',
        type: 'soft',
        description: 'Traffic impact study recommended for major projects',
        enforcementLevel: 0.7,
      },
    ],
    metadata: {
      author: 'planning_department',
      reviewers: ['city_council', 'planning_commission'],
      tags: ['zoning', 'land_use', 'development'],
      references: ['municipal_code_ch17', 'comprehensive_plan'],
    },
  },
  {
    name: 'Emergency Procurement Fast-Track',
    domain: PolicyDomain.PROCUREMENT,
    version: 1,
    status: PolicyStatus.DRAFT,
    rules: [
      {
        id: 'rule_emergency_threshold',
        name: 'Emergency Declaration Required',
        condition: 'procurement_type = emergency',
        action: 'Require emergency declaration documentation',
        priority: 1,
        exceptions: [],
        effectiveFrom: new Date(),
      },
      {
        id: 'rule_sole_source',
        name: 'Sole Source Justification',
        condition: 'vendors_available < 3',
        action: 'Require sole source justification',
        priority: 2,
        exceptions: ['standardized_equipment'],
        effectiveFrom: new Date(),
      },
    ],
    constraints: [
      {
        id: 'con_budget_authority',
        type: 'hard',
        description: 'Budget authority must be confirmed',
        enforcementLevel: 1.0,
        overrideAuthority: InstitutionType.EMERGENCY_AUTHORITY,
      },
      {
        id: 'con_conflict_check',
        type: 'hard',
        description: 'Conflict of interest check required',
        enforcementLevel: 1.0,
      },
    ],
    metadata: {
      author: 'procurement_office',
      reviewers: ['legal', 'finance'],
      tags: ['procurement', 'emergency', 'fast_track'],
      references: ['procurement_code', 'emergency_powers_act'],
    },
  },
  {
    name: 'Public Health Emergency Response',
    domain: PolicyDomain.HEALTHCARE,
    version: 1,
    status: PolicyStatus.DRAFT,
    rules: [
      {
        id: 'rule_outbreak_trigger',
        name: 'Outbreak Response Trigger',
        condition: 'case_count > threshold',
        action: 'Activate emergency response protocol',
        priority: 1,
        exceptions: [],
        effectiveFrom: new Date(),
      },
      {
        id: 'rule_resource_allocation',
        name: 'Resource Allocation Priority',
        condition: 'resource_scarcity = true',
        action: 'Apply triage resource allocation',
        priority: 2,
        exceptions: ['critical_infrastructure_personnel'],
        effectiveFrom: new Date(),
      },
    ],
    constraints: [
      {
        id: 'con_hipaa',
        type: 'hard',
        description: 'HIPAA compliance required for all data handling',
        enforcementLevel: 1.0,
      },
      {
        id: 'con_equity',
        type: 'soft',
        description: 'Equitable distribution across access levels',
        enforcementLevel: 0.8,
      },
    ],
    metadata: {
      author: 'health_department',
      reviewers: ['legal', 'emergency_management'],
      tags: ['health', 'emergency', 'pandemic'],
      references: ['public_health_code', 'cdc_guidelines'],
    },
  },
];

// =============================================================================
// SINGLETON INSTANCE
// =============================================================================

export const policyInjectionService = new PolicyInjectionService();
