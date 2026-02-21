// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SGAS CLASS II - INSTITUTIONAL AGENTS SERVICE
 * 
 * Institutional Agents represent formal authority systems.
 * They are NOT advisors - they are guardrails.
 * 
 * They can:
 * - Block
 * - Escalate
 * - Require justification
 * - Enforce process
 * 
 * They ensure that decisions respect institutional reality.
 */

import { EventEmitter } from 'events';
import {
  SGASAgentClass,
  InstitutionalAgentConfig,
  InstitutionalAgentOutput,
  InstitutionType,
  InstitutionalStatus,
  DecisionProposal,
  DecisionAgentOutput,
  Constraint,
  ConstraintType,
  EnforcementLevel,
  AuthorityType,
  AuditRequirement,
  ConstraintMatch,
  MatchType,
  RequiredAction,
  ViolationReport,
  ViolationType,
  AuditFlag,
  AuditFlagType,
  SeverityLevel,
  InstitutionalState,
  ExecutionMetadata,
  generateSGASId,
  hashState,
} from './types.js';
import { persistServiceRecord, loadServiceRecords } from '../../utils/servicePersistence.js';
import { logger } from '../../utils/logger.js';

// =============================================================================
// INSTITUTIONAL AGENT DEFINITIONS
// =============================================================================

export const INSTITUTIONAL_AGENTS: InstitutionalAgentConfig[] = [
  {
    id: 'ia_regulatory_body',
    name: 'Regulatory Compliance Authority',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.REGULATORY_BODY,
    jurisdiction: {
      geographic: ['global'],
      organizational: ['all_units'],
      temporal: {
        start: new Date('2020-01-01'),
        end: new Date('2030-12-31'),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 0,
      },
      functional: ['compliance', 'regulatory', 'licensing'],
    },
    authorities: [
      {
        id: 'auth_compliance_block',
        name: 'Compliance Block Authority',
        type: AuthorityType.BLOCK,
        scope: ['non_compliant_proposals'],
        limitations: ['cannot_override_emergency_powers'],
        delegationRules: [],
      },
      {
        id: 'auth_compliance_audit',
        name: 'Compliance Audit Authority',
        type: AuthorityType.AUDIT,
        scope: ['all_decisions'],
        limitations: [],
        delegationRules: [],
      },
    ],
    constraints: [
      {
        id: 'con_regulatory_approval',
        name: 'Regulatory Approval Required',
        type: ConstraintType.REGULATORY,
        rule: 'Proposals affecting regulated activities require explicit approval',
        enforcement: EnforcementLevel.HARD,
        auditRequirement: AuditRequirement.MANDATORY,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_regulatory_violation',
        trigger: 'regulatory_violation_detected',
        destination: 'chief_compliance_officer',
        timeLimit: 24 * 60 * 60 * 1000, // 24 hours
        autoEscalate: true,
        notificationList: ['compliance_team', 'legal_team'],
      },
    ],
  },
  {
    id: 'ia_budget_authority',
    name: 'Budget Control Authority',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.BUDGET_AUTHORITY,
    jurisdiction: {
      geographic: ['organization_wide'],
      organizational: ['finance', 'operations'],
      temporal: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 30,
      },
      functional: ['budget', 'spending', 'allocation'],
    },
    authorities: [
      {
        id: 'auth_budget_approve',
        name: 'Budget Approval Authority',
        type: AuthorityType.APPROVE,
        scope: ['within_threshold'],
        limitations: ['max_single_approval_1M'],
        delegationRules: [
          {
            delegateTo: 'department_head',
            conditions: ['amount < 100000'],
            maxAmount: 100000,
            requiresNotification: true,
          },
        ],
      },
      {
        id: 'auth_budget_block',
        name: 'Budget Block Authority',
        type: AuthorityType.BLOCK,
        scope: ['over_budget_proposals'],
        limitations: [],
        delegationRules: [],
      },
    ],
    constraints: [
      {
        id: 'con_budget_limit',
        name: 'Budget Limit Enforcement',
        type: ConstraintType.BUDGETARY,
        rule: 'Total spending must not exceed allocated budget',
        enforcement: EnforcementLevel.HARD,
        auditRequirement: AuditRequirement.CONTINUOUS,
      },
      {
        id: 'con_budget_flexibility',
        name: 'Budget Flexibility Rule',
        type: ConstraintType.BUDGETARY,
        rule: 'Line item transfers require approval if > 10%',
        enforcement: EnforcementLevel.SOFT,
        auditRequirement: AuditRequirement.ON_EXCEPTION,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_over_budget',
        trigger: 'budget_threshold_exceeded',
        destination: 'cfo',
        timeLimit: 48 * 60 * 60 * 1000, // 48 hours
        autoEscalate: true,
        notificationList: ['finance_team', 'budget_owner'],
      },
    ],
  },
  {
    id: 'ia_legal_authority',
    name: 'Legal Review Authority',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.LEGAL_AUTHORITY,
    jurisdiction: {
      geographic: ['all_jurisdictions'],
      organizational: ['all_units'],
      temporal: {
        start: new Date('2020-01-01'),
        end: new Date('2030-12-31'),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 0,
      },
      functional: ['contracts', 'litigation', 'compliance', 'ip'],
    },
    authorities: [
      {
        id: 'auth_legal_review',
        name: 'Legal Review Authority',
        type: AuthorityType.CERTIFY,
        scope: ['contracts', 'agreements', 'policies'],
        limitations: [],
        delegationRules: [],
      },
      {
        id: 'auth_legal_block',
        name: 'Legal Block Authority',
        type: AuthorityType.BLOCK,
        scope: ['legally_risky_proposals'],
        limitations: [],
        delegationRules: [],
      },
    ],
    constraints: [
      {
        id: 'con_legal_review',
        name: 'Legal Review Required',
        type: ConstraintType.LEGAL,
        rule: 'Proposals with legal implications require legal review',
        enforcement: EnforcementLevel.HARD,
        auditRequirement: AuditRequirement.MANDATORY,
      },
      {
        id: 'con_contract_threshold',
        name: 'Contract Review Threshold',
        type: ConstraintType.LEGAL,
        rule: 'Contracts > $50,000 require legal approval',
        enforcement: EnforcementLevel.HARD,
        overrideAuthority: 'general_counsel',
        auditRequirement: AuditRequirement.MANDATORY,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_legal_risk',
        trigger: 'high_legal_risk_detected',
        destination: 'general_counsel',
        timeLimit: 24 * 60 * 60 * 1000,
        autoEscalate: true,
        notificationList: ['legal_team', 'risk_management'],
      },
    ],
  },
  {
    id: 'ia_ethics_board',
    name: 'Ethics Review Board',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.ETHICS_BOARD,
    jurisdiction: {
      geographic: ['global'],
      organizational: ['all_units'],
      temporal: {
        start: new Date('2020-01-01'),
        end: new Date('2030-12-31'),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 0,
      },
      functional: ['ethics', 'ai_governance', 'research'],
    },
    authorities: [
      {
        id: 'auth_ethics_review',
        name: 'Ethics Review Authority',
        type: AuthorityType.CERTIFY,
        scope: ['ai_systems', 'research', 'data_use'],
        limitations: [],
        delegationRules: [],
      },
      {
        id: 'auth_ethics_block',
        name: 'Ethics Block Authority',
        type: AuthorityType.BLOCK,
        scope: ['ethically_questionable_proposals'],
        limitations: [],
        delegationRules: [],
      },
    ],
    constraints: [
      {
        id: 'con_ethics_review',
        name: 'Ethics Review Required',
        type: ConstraintType.ETHICAL,
        rule: 'AI/ML systems require ethics review before deployment',
        enforcement: EnforcementLevel.HARD,
        auditRequirement: AuditRequirement.MANDATORY,
      },
      {
        id: 'con_fairness',
        name: 'Fairness Requirement',
        type: ConstraintType.ETHICAL,
        rule: 'Systems must demonstrate fairness across protected groups',
        enforcement: EnforcementLevel.HARD,
        auditRequirement: AuditRequirement.CONTINUOUS,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_ethics_concern',
        trigger: 'ethics_concern_raised',
        destination: 'ethics_committee_chair',
        timeLimit: 72 * 60 * 60 * 1000, // 72 hours
        autoEscalate: false,
        notificationList: ['ethics_board', 'leadership'],
      },
    ],
  },
  {
    id: 'ia_procurement',
    name: 'Procurement Office',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.PROCUREMENT_OFFICE,
    jurisdiction: {
      geographic: ['organization_wide'],
      organizational: ['all_units'],
      temporal: {
        start: new Date('2024-01-01'),
        end: new Date('2024-12-31'),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 14,
      },
      functional: ['procurement', 'vendor_management', 'contracts'],
    },
    authorities: [
      {
        id: 'auth_procurement_approve',
        name: 'Procurement Approval Authority',
        type: AuthorityType.APPROVE,
        scope: ['vendor_selection', 'purchase_orders'],
        limitations: ['max_single_approval_500K'],
        delegationRules: [
          {
            delegateTo: 'procurement_manager',
            conditions: ['amount < 50000'],
            maxAmount: 50000,
            requiresNotification: false,
          },
        ],
      },
    ],
    constraints: [
      {
        id: 'con_competitive_bid',
        name: 'Competitive Bidding Required',
        type: ConstraintType.PROCEDURAL,
        rule: 'Purchases > $25,000 require competitive bidding',
        enforcement: EnforcementLevel.HARD,
        overrideAuthority: 'cpo',
        auditRequirement: AuditRequirement.MANDATORY,
      },
      {
        id: 'con_vendor_approval',
        name: 'Approved Vendor List',
        type: ConstraintType.PROCEDURAL,
        rule: 'Vendors must be on approved vendor list',
        enforcement: EnforcementLevel.SOFT,
        auditRequirement: AuditRequirement.ON_EXCEPTION,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_procurement_exception',
        trigger: 'sole_source_justification',
        destination: 'chief_procurement_officer',
        timeLimit: 48 * 60 * 60 * 1000,
        autoEscalate: false,
        notificationList: ['procurement_team'],
      },
    ],
  },
  {
    id: 'ia_emergency',
    name: 'Emergency Management Authority',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.EMERGENCY_MANAGEMENT,
    jurisdiction: {
      geographic: ['all_locations'],
      organizational: ['all_units'],
      temporal: {
        start: new Date('2020-01-01'),
        end: new Date('2030-12-31'),
        milestones: [],
        criticalPath: true,
        flexibilityDays: 0,
      },
      functional: ['emergency_response', 'business_continuity', 'crisis_management'],
    },
    authorities: [
      {
        id: 'auth_emergency_override',
        name: 'Emergency Override Authority',
        type: AuthorityType.OVERRIDE,
        scope: ['normal_processes'],
        limitations: ['requires_declaration', 'time_limited'],
        delegationRules: [],
      },
      {
        id: 'auth_emergency_approve',
        name: 'Emergency Approval Authority',
        type: AuthorityType.APPROVE,
        scope: ['emergency_actions'],
        limitations: [],
        delegationRules: [],
      },
    ],
    constraints: [
      {
        id: 'con_emergency_declaration',
        name: 'Emergency Declaration Required',
        type: ConstraintType.PROCEDURAL,
        rule: 'Emergency powers require formal declaration',
        enforcement: EnforcementLevel.ABSOLUTE,
        auditRequirement: AuditRequirement.MANDATORY,
      },
      {
        id: 'con_emergency_duration',
        name: 'Emergency Duration Limit',
        type: ConstraintType.TEMPORAL,
        rule: 'Emergency powers expire after 72 hours without renewal',
        enforcement: EnforcementLevel.HARD,
        auditRequirement: AuditRequirement.CONTINUOUS,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_emergency_declared',
        trigger: 'emergency_declared',
        destination: 'executive_committee',
        timeLimit: 1 * 60 * 60 * 1000, // 1 hour
        autoEscalate: true,
        notificationList: ['all_leadership', 'emergency_team'],
      },
    ],
  },
  {
    id: 'ia_audit',
    name: 'Internal Audit Authority',
    class: SGASAgentClass.INSTITUTIONAL,
    institutionType: InstitutionType.AUDIT_AUTHORITY,
    jurisdiction: {
      geographic: ['global'],
      organizational: ['all_units'],
      temporal: {
        start: new Date('2020-01-01'),
        end: new Date('2030-12-31'),
        milestones: [],
        criticalPath: false,
        flexibilityDays: 0,
      },
      functional: ['audit', 'controls', 'assurance'],
    },
    authorities: [
      {
        id: 'auth_audit_access',
        name: 'Audit Access Authority',
        type: AuthorityType.AUDIT,
        scope: ['all_records', 'all_systems'],
        limitations: [],
        delegationRules: [],
      },
      {
        id: 'auth_audit_escalate',
        name: 'Audit Escalation Authority',
        type: AuthorityType.ESCALATE,
        scope: ['control_deficiencies', 'fraud_indicators'],
        limitations: [],
        delegationRules: [],
      },
    ],
    constraints: [
      {
        id: 'con_audit_independence',
        name: 'Audit Independence',
        type: ConstraintType.PROCEDURAL,
        rule: 'Audit function must remain independent',
        enforcement: EnforcementLevel.ABSOLUTE,
        auditRequirement: AuditRequirement.CONTINUOUS,
      },
    ],
    escalationPaths: [
      {
        id: 'esc_audit_finding',
        trigger: 'material_audit_finding',
        destination: 'audit_committee',
        timeLimit: 24 * 60 * 60 * 1000,
        autoEscalate: true,
        notificationList: ['audit_committee', 'cfo', 'ceo'],
      },
    ],
  },
];

// =============================================================================
// INSTITUTIONAL AGENTS SERVICE
// =============================================================================

export class InstitutionalAgentsService extends EventEmitter {
  private agents: Map<string, InstitutionalAgentConfig> = new Map();
  private executionHistory: Map<string, InstitutionalAgentOutput[]> = new Map();
  private currentInstitutionalState: InstitutionalState = InstitutionalState.NORMAL;

  constructor() {
    super();
    this.initializeAgents();


    this.loadFromDB().catch(() => {});
  }

  private initializeAgents(): void {
    for (const agent of INSTITUTIONAL_AGENTS) {
      this.agents.set(agent.id, agent);
    }
  }

  /**
   * Get all institutional agents
   */
  getAgents(): InstitutionalAgentConfig[] {
    return Array.from(this.agents.values());
  }

  /**
   * Get agent by ID
   */
  getAgent(agentId: string): InstitutionalAgentConfig | undefined {
    return this.agents.get(agentId);
  }

  /**
   * Get agents by institution type
   */
  getAgentsByType(type: InstitutionType): InstitutionalAgentConfig[] {
    return Array.from(this.agents.values()).filter(a => a.institutionType === type);
  }

  /**
   * Set institutional state (normal, elevated, emergency, etc.)
   */
  setInstitutionalState(state: InstitutionalState): void {
    const previousState = this.currentInstitutionalState;
    this.currentInstitutionalState = state;
    this.emit('state:changed', { previousState, newState: state });
  }

  /**
   * Get current institutional state
   */
  getInstitutionalState(): InstitutionalState {
    return this.currentInstitutionalState;
  }

  /**
   * Execute institutional agent against proposal and decision outputs
   */
  async executeAgent(
    agentId: string,
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    seed?: number
  ): Promise<InstitutionalAgentOutput> {
    const agent = this.agents.get(agentId);
    if (!agent) {
      throw new Error(`Institutional agent not found: ${agentId}`);
    }

    const startTime = new Date();
    const inputHash = hashState({ agentId, proposal, decisionOutputs, seed });

    this.emit('agent:start', { agentId, proposalId: proposal.id });

    try {
      // Match constraints
      const constraintMatches = this.matchConstraints(agent, proposal);
      
      // Check for violations
      const violations = this.detectViolations(agent, proposal, constraintMatches);
      
      // Determine status
      const status = this.determineStatus(agent, constraintMatches, violations);
      
      // Generate required actions
      const requiredActions = this.generateRequiredActions(agent, status, violations);
      
      // Generate audit flags
      const auditFlags = this.generateAuditFlags(agent, constraintMatches, violations);

      // Determine if override is available
      const overrideInfo = this.checkOverrideAvailability(agent, status, violations);

      const endTime = new Date();
      const outputHash = hashState({ status, constraintMatches, violations });

      const output: InstitutionalAgentOutput = {
        agentId: agent.id,
        timestamp: startTime,
        proposalId: proposal.id,
        decisionAgentOutputs: decisionOutputs.map(d => d.agentId),
        status: status.status,
        reason: status.reason,
        constraintMatches,
        overrideAvailable: overrideInfo.available,
        overrideAuthority: overrideInfo.authority,
        overrideConditions: overrideInfo.conditions,
        requiredActions,
        violationReports: violations,
        auditFlags,
        executionMetadata: {
          startTime,
          endTime,
          durationMs: endTime.getTime() - startTime.getTime(),
          seed: seed || 0,
          inputHash,
          outputHash,
          resourcesUsed: {
            cpuMs: endTime.getTime() - startTime.getTime(),
            memoryMb: process.memoryUsage().heapUsed / 1024 / 1024,
            externalCalls: 0,
          },
          deterministic: true,
        },
      };

      // Store in history
      const history = this.executionHistory.get(proposal.id) || [];
      history.push(output);
      this.executionHistory.set(proposal.id, history);

      this.emit('agent:complete', { agentId, proposalId: proposal.id, output });

      // Handle escalations
      if (status.status === InstitutionalStatus.ESCALATE) {
        this.handleEscalation(agent, proposal, output);
      }

      return output;
    } catch (error) {
      this.emit('agent:error', { agentId, proposalId: proposal.id, error });
      throw error;
    }
  }

  /**
   * Execute all institutional agents
   */
  async executeAllAgents(
    proposal: DecisionProposal,
    decisionOutputs: DecisionAgentOutput[],
    seed?: number
  ): Promise<InstitutionalAgentOutput[]> {
    const outputs: InstitutionalAgentOutput[] = [];
    const baseSeed = seed || Date.now();

    for (let i = 0; i < INSTITUTIONAL_AGENTS.length; i++) {
      const agent = INSTITUTIONAL_AGENTS[i];
      const agentSeed = baseSeed + i + 100; // Offset from decision agents
      const output = await this.executeAgent(agent.id, proposal, decisionOutputs, agentSeed);
      outputs.push(output);
    }

    return outputs;
  }

  /**
   * Match proposal against agent constraints
   */
  private matchConstraints(
    agent: InstitutionalAgentConfig,
    proposal: DecisionProposal
  ): ConstraintMatch[] {
    const matches: ConstraintMatch[] = [];

    for (const constraint of agent.constraints) {
      const match = this.evaluateConstraint(constraint, proposal);
      matches.push(match);
    }

    // Also check proposal constraints against institutional requirements
    for (const proposalConstraint of proposal.constraints) {
      const relevantInstitutionalConstraint = agent.constraints.find(
        c => c.type === proposalConstraint.type
      );
      if (relevantInstitutionalConstraint) {
        matches.push({
          constraintId: proposalConstraint.id,
          matched: true,
          matchType: MatchType.PARTIAL,
          parameters: { proposalConstraint: proposalConstraint.name },
          severity: SeverityLevel.INFO,
        });
      }
    }

    return matches;
  }

  /**
   * Evaluate a single constraint
   */
  private evaluateConstraint(
    constraint: Constraint | { id: string; type: ConstraintType; rule: string; enforcement: EnforcementLevel },
    proposal: DecisionProposal
  ): ConstraintMatch {
    // Budget constraints
    if (constraint.type === ConstraintType.BUDGETARY) {
      if (proposal.context.budget) {
        const overBudget = proposal.context.budget.flexibilityPercent < 5;
        return {
          constraintId: constraint.id,
          matched: true,
          matchType: overBudget ? MatchType.EDGE_CASE : MatchType.EXACT,
          parameters: { budget: proposal.context.budget.allocated },
          severity: overBudget ? SeverityLevel.WARNING : SeverityLevel.INFO,
        };
      }
    }

    // Legal constraints
    if (constraint.type === ConstraintType.LEGAL) {
      const hasLegalImplications = proposal.constraints.some(
        c => c.type === ConstraintType.LEGAL
      );
      return {
        constraintId: constraint.id,
        matched: hasLegalImplications,
        matchType: hasLegalImplications ? MatchType.EXACT : MatchType.PARTIAL,
        parameters: { legalConstraints: proposal.constraints.filter(c => c.type === ConstraintType.LEGAL).length },
        severity: hasLegalImplications ? SeverityLevel.WARNING : SeverityLevel.INFO,
      };
    }

    // Temporal constraints
    if (constraint.type === ConstraintType.TEMPORAL) {
      const isUrgent = proposal.metadata.urgency !== 'routine';
      return {
        constraintId: constraint.id,
        matched: true,
        matchType: MatchType.EXACT,
        parameters: { urgency: proposal.metadata.urgency },
        severity: isUrgent ? SeverityLevel.WARNING : SeverityLevel.INFO,
      };
    }

    // Default match
    return {
      constraintId: constraint.id,
      matched: true,
      matchType: MatchType.EXACT,
      parameters: {},
      severity: SeverityLevel.INFO,
    };
  }

  /**
   * Detect violations
   */
  private detectViolations(
    agent: InstitutionalAgentConfig,
    proposal: DecisionProposal,
    matches: ConstraintMatch[]
  ): ViolationReport[] {
    const violations: ViolationReport[] = [];

    // Check for hard constraint violations
    for (const match of matches) {
      if (match.severity === SeverityLevel.ERROR || match.severity === SeverityLevel.CRITICAL) {
        const constraint = agent.constraints.find(c => c.id === match.constraintId);
        if (constraint && constraint.enforcement === EnforcementLevel.HARD) {
          violations.push({
            id: generateSGASId('viol'),
            type: ViolationType.CONSTRAINT_VIOLATION,
            description: `Hard constraint violation: ${constraint.name}`,
            severity: match.severity,
            evidence: [JSON.stringify(match.parameters)],
            remediation: ['Review and modify proposal', 'Seek override authority'],
            reportedTo: agent.escalationPaths[0]?.notificationList || [],
          });
        }
      }
    }

    // Check authority bounds
    for (const authority of agent.authorities) {
      if (authority.type === AuthorityType.APPROVE && authority.limitations.length > 0) {
        // Check if proposal exceeds authority limits
        if (proposal.context.budget) {
          const limit = authority.limitations.find(l => l.includes('max_single_approval'));
          if (limit) {
            const maxAmount = parseInt(limit.split('_').pop() || '0');
            if (proposal.context.budget.allocated > maxAmount) {
              violations.push({
                id: generateSGASId('viol'),
                type: ViolationType.AUTHORITY_BREACH,
                description: `Proposal exceeds approval authority limit of ${maxAmount}`,
                severity: SeverityLevel.WARNING,
                evidence: [`Budget: ${proposal.context.budget.allocated}`],
                remediation: ['Escalate to higher authority', 'Reduce proposal scope'],
                reportedTo: [],
              });
            }
          }
        }
      }
    }

    // Check for emergency state misuse
    if (this.currentInstitutionalState !== InstitutionalState.EMERGENCY) {
      if (proposal.context.institutionalState === InstitutionalState.EMERGENCY) {
        violations.push({
          id: generateSGASId('viol'),
          type: ViolationType.PROCESS_BYPASS,
          description: 'Proposal requests emergency powers but no emergency is declared',
          severity: SeverityLevel.ERROR,
          evidence: ['Institutional state: ' + this.currentInstitutionalState],
          remediation: ['Remove emergency power request', 'Formally declare emergency'],
          reportedTo: agent.escalationPaths.find(e => e.trigger.includes('emergency'))?.notificationList || [],
        });
      }
    }

    return violations;
  }

  /**
   * Determine institutional status
   */
  private determineStatus(
    agent: InstitutionalAgentConfig,
    matches: ConstraintMatch[],
    violations: ViolationReport[]
  ): { status: InstitutionalStatus; reason: string } {
    // Any critical violations = BLOCK
    const criticalViolations = violations.filter(v => v.severity === SeverityLevel.CRITICAL);
    if (criticalViolations.length > 0) {
      return {
        status: InstitutionalStatus.BLOCK,
        reason: `Critical violation: ${criticalViolations[0].description}`,
      };
    }

    // Error-level violations = ESCALATE
    const errorViolations = violations.filter(v => v.severity === SeverityLevel.ERROR);
    if (errorViolations.length > 0) {
      return {
        status: InstitutionalStatus.ESCALATE,
        reason: `Requires escalation: ${errorViolations[0].description}`,
      };
    }

    // Warning-level violations = CONDITIONAL
    const warningViolations = violations.filter(v => v.severity === SeverityLevel.WARNING);
    if (warningViolations.length > 0) {
      return {
        status: InstitutionalStatus.CONDITIONAL,
        reason: `Conditional approval: ${warningViolations.map(v => v.description).join('; ')}`,
      };
    }

    // Edge case matches need attention
    const edgeCases = matches.filter(m => m.matchType === MatchType.EDGE_CASE);
    if (edgeCases.length > 0) {
      return {
        status: InstitutionalStatus.CONDITIONAL,
        reason: `Edge cases detected requiring review`,
      };
    }

    return {
      status: InstitutionalStatus.ALLOW,
      reason: 'All institutional constraints satisfied',
    };
  }

  /**
   * Generate required actions
   */
  private generateRequiredActions(
    agent: InstitutionalAgentConfig,
    status: { status: InstitutionalStatus; reason: string },
    violations: ViolationReport[]
  ): RequiredAction[] {
    const actions: RequiredAction[] = [];

    if (status.status === InstitutionalStatus.BLOCK) {
      actions.push({
        id: generateSGASId('act'),
        action: 'Address blocking violations before resubmission',
        responsible: 'proposal_owner',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        mandatory: true,
        verificationMethod: 'violation_cleared',
      });
    }

    if (status.status === InstitutionalStatus.ESCALATE) {
      const escalationPath = agent.escalationPaths[0];
      if (escalationPath) {
        actions.push({
          id: generateSGASId('act'),
          action: `Escalate to ${escalationPath.destination}`,
          responsible: 'system',
          deadline: new Date(Date.now() + escalationPath.timeLimit),
          mandatory: true,
          verificationMethod: 'escalation_acknowledged',
        });
      }
    }

    if (status.status === InstitutionalStatus.CONDITIONAL) {
      for (const violation of violations) {
        for (const remediation of violation.remediation) {
          actions.push({
            id: generateSGASId('act'),
            action: remediation,
            responsible: 'proposal_owner',
            deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days
            mandatory: violation.severity === SeverityLevel.WARNING,
            verificationMethod: 'action_completed',
          });
        }
      }
    }

    // Add audit action if required
    const mandatoryAudit = agent.constraints.some(
      c => c.auditRequirement === AuditRequirement.MANDATORY
    );
    if (mandatoryAudit) {
      actions.push({
        id: generateSGASId('act'),
        action: 'Submit to audit trail',
        responsible: 'system',
        deadline: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 hours
        mandatory: true,
        verificationMethod: 'audit_recorded',
      });
    }

    return actions;
  }

  /**
   * Generate audit flags
   */
  private generateAuditFlags(
    agent: InstitutionalAgentConfig,
    matches: ConstraintMatch[],
    violations: ViolationReport[]
  ): AuditFlag[] {
    const flags: AuditFlag[] = [];

    // Flag for each violation
    for (const violation of violations) {
      flags.push({
        id: generateSGASId('flag'),
        type: this.mapViolationToAuditType(violation.type),
        description: violation.description,
        priority: this.severityToPriority(violation.severity),
        autoResolve: false,
      });
    }

    // Flag for edge cases
    const edgeCases = matches.filter(m => m.matchType === MatchType.EDGE_CASE);
    for (const edgeCase of edgeCases) {
      flags.push({
        id: generateSGASId('flag'),
        type: AuditFlagType.PROCESS,
        description: `Edge case detected for constraint ${edgeCase.constraintId}`,
        priority: 2,
        autoResolve: true,
        resolution: 'Manual review completed',
      });
    }

    return flags;
  }

  /**
   * Check override availability
   */
  private checkOverrideAvailability(
    agent: InstitutionalAgentConfig,
    status: { status: InstitutionalStatus; reason: string },
    violations: ViolationReport[]
  ): { available: boolean; authority?: string; conditions?: string[] } {
    if (status.status === InstitutionalStatus.ALLOW) {
      return { available: false };
    }

    // Check if emergency override is available
    if (this.currentInstitutionalState === InstitutionalState.EMERGENCY) {
      const emergencyAuthority = agent.authorities.find(a => a.type === AuthorityType.OVERRIDE);
      if (emergencyAuthority) {
        return {
          available: true,
          authority: 'emergency_powers',
          conditions: emergencyAuthority.limitations,
        };
      }
    }

    // Check for specific override authorities
    for (const constraint of agent.constraints) {
      if (constraint.overrideAuthority) {
        return {
          available: true,
          authority: constraint.overrideAuthority,
          conditions: ['Requires justification', 'Subject to audit'],
        };
      }
    }

    return { available: false };
  }

  /**
   * Handle escalation
   */
  private handleEscalation(
    agent: InstitutionalAgentConfig,
    proposal: DecisionProposal,
    output: InstitutionalAgentOutput
  ): void {
    for (const path of agent.escalationPaths) {
      if (path.autoEscalate) {
        this.emit('escalation:triggered', {
          agentId: agent.id,
          proposalId: proposal.id,
          destination: path.destination,
          timeLimit: path.timeLimit,
          notificationList: path.notificationList,
          output,
        });
      }
    }
  }

  /**
   * Map violation type to audit flag type
   */
  private mapViolationToAuditType(violationType: ViolationType): AuditFlagType {
    const mapping: Record<ViolationType, AuditFlagType> = {
      [ViolationType.SCOPE_EXCEEDED]: AuditFlagType.AUTHORITY,
      [ViolationType.AUTHORITY_BREACH]: AuditFlagType.AUTHORITY,
      [ViolationType.CONSTRAINT_VIOLATION]: AuditFlagType.COMPLIANCE,
      [ViolationType.PROCESS_BYPASS]: AuditFlagType.PROCESS,
      [ViolationType.RESOURCE_EXCEEDED]: AuditFlagType.COMPLIANCE,
      [ViolationType.TEMPORAL_VIOLATION]: AuditFlagType.TIMING,
    };
    return mapping[violationType] || AuditFlagType.COMPLIANCE;
  }

  /**
   * Convert severity to priority number
   */
  private severityToPriority(severity: SeverityLevel): number {
    const mapping: Record<SeverityLevel, number> = {
      [SeverityLevel.INFO]: 5,
      [SeverityLevel.WARNING]: 4,
      [SeverityLevel.ERROR]: 2,
      [SeverityLevel.CRITICAL]: 1,
      [SeverityLevel.CATASTROPHIC]: 0,
    };
    return mapping[severity];
  }

  /**
   * Get execution history
   */
  getExecutionHistory(proposalId: string): InstitutionalAgentOutput[] {
    return this.executionHistory.get(proposalId) || [];
  }

  /**
   * Aggregate institutional outputs
   */
  aggregateOutputs(outputs: InstitutionalAgentOutput[]): {
    overallStatus: InstitutionalStatus;
    blockingAgents: string[];
    escalationRequired: boolean;
    allViolations: ViolationReport[];
    allRequiredActions: RequiredAction[];
  } {
    if (outputs.length === 0) {
      return {
        overallStatus: InstitutionalStatus.ESCALATE,
        blockingAgents: [],
        escalationRequired: true,
        allViolations: [],
        allRequiredActions: [],
      };
    }

    // Any BLOCK = overall BLOCK
    const blockingOutputs = outputs.filter(o => o.status === InstitutionalStatus.BLOCK);
    if (blockingOutputs.length > 0) {
      return {
        overallStatus: InstitutionalStatus.BLOCK,
        blockingAgents: blockingOutputs.map(o => o.agentId),
        escalationRequired: false,
        allViolations: outputs.flatMap(o => o.violationReports),
        allRequiredActions: outputs.flatMap(o => o.requiredActions),
      };
    }

    // Any ESCALATE = overall ESCALATE
    const escalatingOutputs = outputs.filter(o => o.status === InstitutionalStatus.ESCALATE);
    if (escalatingOutputs.length > 0) {
      return {
        overallStatus: InstitutionalStatus.ESCALATE,
        blockingAgents: [],
        escalationRequired: true,
        allViolations: outputs.flatMap(o => o.violationReports),
        allRequiredActions: outputs.flatMap(o => o.requiredActions),
      };
    }

    // Any CONDITIONAL = overall CONDITIONAL
    const conditionalOutputs = outputs.filter(o => o.status === InstitutionalStatus.CONDITIONAL);
    if (conditionalOutputs.length > 0) {
      return {
        overallStatus: InstitutionalStatus.CONDITIONAL,
        blockingAgents: [],
        escalationRequired: false,
        allViolations: outputs.flatMap(o => o.violationReports),
        allRequiredActions: outputs.flatMap(o => o.requiredActions),
      };
    }

    // All ALLOW
    return {
      overallStatus: InstitutionalStatus.ALLOW,
      blockingAgents: [],
      escalationRequired: false,
      allViolations: [],
      allRequiredActions: outputs.flatMap(o => o.requiredActions),
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'InstitutionalAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.agents.has(d.id)) this.agents.set(d.id, d);


      }


      restored += recs.length;


      const recs_1 = await loadServiceRecords({ serviceName: 'InstitutionalAgents', recordType: 'record', limit: 1000 });


      for (const rec of recs_1) {


        const d = rec.data as any;


        if (d?.id && !this.executionHistory.has(d.id)) this.executionHistory.set(d.id, d);


      }


      restored += recs_1.length;


      if (restored > 0) logger.info(`[InstitutionalAgentsService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[InstitutionalAgentsService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

// Export singleton instance
export const institutionalAgentsService = new InstitutionalAgentsService();
export default institutionalAgentsService;
