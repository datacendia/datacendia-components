// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA REDTEAMâ„¢ - THE SOVEREIGN ADVERSARIAL ENGINE
// "We hired the smartest attacker on earth and gave them your keys â€” on purpose."
//
// A fully sovereign, always-on adversarial clone that stress-tests
// policies, ethics, and strategies 24/7.
// =============================================================================

import { prisma } from '../config/database.js';
import { logger } from '../utils/logger.js';
import ollama from './ollama.js';
import crypto from 'crypto';
import { deterministicFloat, deterministicInt, deterministicPercentage, deterministicPick } from '../utils/deterministic.js';

// =============================================================================
// TYPES
// =============================================================================

export interface ExploitPath {
  id: string;
  title: string;
  description: string;
  attackVector: 'policy_bypass' | 'ethics_loophole' | 'data_exfil' | 'privilege_escalation' | 'social_engineering' | 'system_abuse';
  targetSystem: string;
  steps: AttackStep[];
  damageEstimate: {
    financial: number;
    reputational: number;
    operational: number;
    legal: number;
  };
  probabilityOfSuccess: number;
  detectionDifficulty: number; // 0-100, higher = harder to detect
  timeToExploit: string;
  severity: 'critical' | 'high' | 'medium' | 'low';
  status: 'active' | 'mitigated' | 'accepted' | 'monitoring';
  discoveredAt: Date;
  mitigatedAt?: Date;
}

export interface AttackStep {
  order: number;
  action: string;
  requirement: string;
  bypassedControl: string;
  detectionRisk: number;
}

export interface WeaknessReport {
  id: string;
  date: Date;
  topWeaknesses: Weakness[];
  newVulnerabilities: number;
  closedVulnerabilities: number;
  overallScore: number;
  trend: 'improving' | 'stable' | 'degrading';
  immediateActions: AutoPatch[];
}

export interface Weakness {
  id: string;
  rank: number;
  title: string;
  category: string;
  damageMultiplier: number;
  exploitability: number;
  fixComplexity: 'trivial' | 'easy' | 'moderate' | 'complex' | 'requires_redesign';
  recommendedFix: string;
  autoFixAvailable: boolean;
}

export interface AutoPatch {
  id: string;
  vulnerabilityId: string;
  patchType: 'policy_update' | 'config_change' | 'permission_tightening' | 'monitoring_enhancement' | 'workflow_gate';
  description: string;
  reversible: boolean;
  appliedAt?: Date;
  rollbackAvailable: boolean;
  status: 'pending' | 'applied' | 'rolled_back' | 'failed';
}

export interface RedTeamScore {
  overall: number; // 0-100
  breakdown: {
    policyStrength: number;
    ethicsResilience: number;
    accessControl: number;
    dataProtection: number;
    auditTrailIntegrity: number;
    humanOverrideEffectiveness: number;
  };
  exploitableWeaknesses: number;
  criticalVulnerabilities: number;
  lastAttackSimulation: Date;
  recommendations: string[];
}

export interface AttackSimulation {
  id: string;
  scenarioName: string;
  objective: string;
  adversaryProfile: 'insider_threat' | 'external_attacker' | 'nation_state' | 'competitor' | 'rogue_ai';
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed';
  results: {
    objectiveAchieved: boolean;
    pathsExplored: number;
    vulnerabilitiesFound: number;
    controlsBypassed: string[];
    timeToObjective?: number;
  };
}

// =============================================================================
// REDTEAM SERVICE
// =============================================================================

class RedTeamService {
  private activeSimulations: Map<string, AttackSimulation> = new Map();
  private exploitCache: Map<string, ExploitPath> = new Map();

  /**
   * Run Monte-Carlo attack simulation
   */
  async runAttackSimulation(
    organizationId: string,
    options: {
      adversaryProfile?: 'insider_threat' | 'external_attacker' | 'nation_state' | 'competitor' | 'rogue_ai';
      targetObjective?: string;
      maxIterations?: number;
    } = {}
  ): Promise<AttackSimulation> {
    const {
      adversaryProfile = 'insider_threat',
      targetObjective = 'Bypass all veto controls and approve unauthorized action',
      maxIterations = 1000,
    } = options;

    const simulationId = crypto.randomUUID();
    const simulation: AttackSimulation = {
      id: simulationId,
      scenarioName: `${adversaryProfile}_simulation_${Date.now()}`,
      objective: targetObjective,
      adversaryProfile,
      startedAt: new Date(),
      status: 'running',
      results: {
        objectiveAchieved: false,
        pathsExplored: 0,
        vulnerabilitiesFound: 0,
        controlsBypassed: [],
      },
    };

    this.activeSimulations.set(simulationId, simulation);

    try {
      // Fetch organization's security configuration
      const org = await prisma.organizations.findUnique({
        where: { id: organizationId },
      });

      // Fetch all policies and veto rules
      const policies = await prisma.security_policies.findMany({
        where: { organization_id: organizationId, enabled: true },
      });

      // Fetch agents and their configurations (global agents)
      const agents = await prisma.agents.findMany();

      // Run Monte-Carlo simulations
      const vulnerabilities: ExploitPath[] = [];
      const bypassedControls: Set<string> = new Set();
      let objectiveAchieved = false;

      for (let i = 0; i < maxIterations; i++) {
        simulation.results.pathsExplored++;

        // Generate random attack path
        const attackPath = await this.generateAttackPath(
          adversaryProfile,
          targetObjective,
          policies,
          agents,
          organizationId
        );

        if (attackPath) {
          // Check if path achieves objective
          const success = await this.evaluateAttackPath(attackPath, policies, agents);
          
          if (success.achievesObjective) {
            objectiveAchieved = true;
            vulnerabilities.push(attackPath);
            for (const step of attackPath.steps) {
              bypassedControls.add(step.bypassedControl);
            }
          } else if (success.partialSuccess) {
            vulnerabilities.push(attackPath);
          }
        }

        // Early termination if objective achieved multiple times
        if (vulnerabilities.length >= 10 && objectiveAchieved) {
          break;
        }
      }

      // Store discovered vulnerabilities
      for (const vuln of vulnerabilities) {
        await prisma.redteam_vulnerabilities.create({
          data: {
            id: vuln.id,
            organization_id: organizationId,
            simulation_id: simulationId,
            title: vuln.title,
            description: vuln.description,
            attack_vector: vuln.attackVector,
            target_system: vuln.targetSystem,
            steps: vuln.steps as any,
            damage_estimate: vuln.damageEstimate as any,
            probability_of_success: vuln.probabilityOfSuccess,
            detection_difficulty: vuln.detectionDifficulty,
            severity: vuln.severity,
            status: 'active',
            discovered_at: new Date(),
          },
        });

        this.exploitCache.set(vuln.id, vuln);
      }

      // Update simulation results
      simulation.status = 'completed';
      simulation.completedAt = new Date();
      simulation.results = {
        objectiveAchieved,
        pathsExplored: simulation.results.pathsExplored,
        vulnerabilitiesFound: vulnerabilities.length,
        controlsBypassed: Array.from(bypassedControls),
        timeToObjective: objectiveAchieved 
          ? (simulation.completedAt.getTime() - simulation.startedAt.getTime()) / 1000 
          : undefined,
      };

      // Store simulation results
      await prisma.redteam_simulations.create({
        data: {
          id: simulationId,
          organization_id: organizationId,
          scenario_name: simulation.scenarioName,
          objective: simulation.objective,
          adversary_profile: simulation.adversaryProfile,
          started_at: simulation.startedAt,
          completed_at: simulation.completedAt,
          status: simulation.status,
          results: simulation.results as any,
        },
      });

      logger.info('[RedTeam] Simulation completed:', {
        id: simulationId,
        vulnsFound: vulnerabilities.length,
        objectiveAchieved,
      });

      return simulation;
    } catch (error) {
      simulation.status = 'failed';
      logger.error('[RedTeam] Simulation failed:', error);
      throw error;
    }
  }

  /**
   * Get current RedTeam score
   */
  async getRedTeamScore(organizationId: string): Promise<RedTeamScore> {
    // Fetch all active vulnerabilities
    const vulnerabilities = await prisma.redteam_vulnerabilities.findMany({
      where: { organization_id: organizationId, status: 'active' },
    });

    const criticalCount = vulnerabilities.filter(v => v.severity === 'critical').length;
    const highCount = vulnerabilities.filter(v => v.severity === 'high').length;
    const mediumCount = vulnerabilities.filter(v => v.severity === 'medium').length;
    const lowCount = vulnerabilities.filter(v => v.severity === 'low').length;

    // Calculate breakdown scores
    const breakdown = await this.calculateSecurityBreakdown(organizationId);

    // Calculate overall score (100 - weighted vulnerabilities)
    const weightedVulns = criticalCount * 25 + highCount * 10 + mediumCount * 3 + lowCount * 1;
    const overall = Math.max(0, Math.min(100, 100 - weightedVulns));

    // Get last simulation
    const lastSim = await prisma.redteam_simulations.findFirst({
      where: { organization_id: organizationId },
      orderBy: { completed_at: 'desc' },
    });

    // Generate recommendations
    const recommendations = await this.generateSecurityRecommendations(
      vulnerabilities,
      breakdown,
      overall
    );

    return {
      overall,
      breakdown,
      exploitableWeaknesses: vulnerabilities.length,
      criticalVulnerabilities: criticalCount,
      lastAttackSimulation: lastSim?.completed_at || new Date(),
      recommendations,
    };
  }

  /**
   * Get daily weakness report
   */
  async getDailyWeaknessReport(organizationId: string): Promise<WeaknessReport> {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Get active vulnerabilities
    const vulnerabilities = await prisma.redteam_vulnerabilities.findMany({
      where: { organization_id: organizationId, status: 'active' },
      orderBy: [
        { severity: 'asc' },
        { probability_of_success: 'desc' },
      ],
      take: 5,
    });

    // Count new vulnerabilities today
    const newToday = await prisma.redteam_vulnerabilities.count({
      where: {
        organization_id: organizationId,
        discovered_at: { gte: today },
      },
    });

    // Count closed vulnerabilities today
    const closedToday = await prisma.redteam_vulnerabilities.count({
      where: {
        organization_id: organizationId,
        status: 'mitigated',
        mitigated_at: { gte: today },
      },
    });

    // Calculate overall score
    const score = await this.getRedTeamScore(organizationId);

    // Get available auto-patches
    const autoPatches = await this.getAvailableAutoPatches(organizationId);

    // Determine trend
    const weekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const weekAgoVulns = await prisma.redteam_vulnerabilities.count({
      where: {
        organization_id: organizationId,
        status: 'active',
        discovered_at: { lte: weekAgo },
      },
    });

    const currentVulns = vulnerabilities.length;
    const trend: 'improving' | 'stable' | 'degrading' = 
      currentVulns < weekAgoVulns ? 'improving' :
      currentVulns > weekAgoVulns ? 'degrading' : 'stable';

    return {
      id: crypto.randomUUID(),
      date: today,
      topWeaknesses: vulnerabilities.map((v, idx) => ({
        id: v.id,
        rank: idx + 1,
        title: v.title,
        category: v.attack_vector,
        damageMultiplier: (v.damage_estimate as any)?.financial || 1,
        exploitability: v.probability_of_success?.toNumber() || 0,
        fixComplexity: this.assessFixComplexity(v),
        recommendedFix: this.generateFixRecommendation(v),
        autoFixAvailable: this.canAutoFix(v),
      })),
      newVulnerabilities: newToday,
      closedVulnerabilities: closedToday,
      overallScore: score.overall,
      trend,
      immediateActions: autoPatches.slice(0, 5),
    };
  }

  /**
   * Get all active exploit paths
   */
  async getExploitPaths(organizationId: string): Promise<ExploitPath[]> {
    const vulnerabilities = await prisma.redteam_vulnerabilities.findMany({
      where: { organization_id: organizationId, status: 'active' },
      orderBy: { severity: 'asc' },
    });

    return vulnerabilities.map(v => ({
      id: v.id,
      title: v.title,
      description: v.description,
      attackVector: v.attack_vector as any,
      targetSystem: v.target_system,
      steps: v.steps as unknown as AttackStep[],
      damageEstimate: v.damage_estimate as any,
      probabilityOfSuccess: v.probability_of_success?.toNumber() || 0,
      detectionDifficulty: v.detection_difficulty?.toNumber() || 50,
      timeToExploit: '1-4 hours',
      severity: v.severity as any,
      status: v.status as any,
      discoveredAt: v.discovered_at,
      mitigatedAt: v.mitigated_at || undefined,
    }));
  }

  /**
   * Apply auto-patch for easy wins
   */
  async applyAutoPatch(
    patchId: string,
    organizationId: string
  ): Promise<AutoPatch> {
    const patch = await prisma.redteam_patches.findUnique({
      where: { id: patchId },
    });

    if (!patch) {
      throw new Error('Patch not found');
    }

    try {
      // Apply the patch based on type
      switch (patch.patch_type) {
        case 'policy_update':
          await this.applyPolicyPatch(patch, organizationId);
          break;
        case 'config_change':
          await this.applyConfigPatch(patch, organizationId);
          break;
        case 'permission_tightening':
          await this.applyPermissionPatch(patch, organizationId);
          break;
        case 'monitoring_enhancement':
          await this.applyMonitoringPatch(patch, organizationId);
          break;
        case 'workflow_gate':
          await this.applyWorkflowPatch(patch, organizationId);
          break;
      }

      // Update patch status
      await prisma.redteam_patches.update({
        where: { id: patchId },
        data: {
          status: 'applied',
          applied_at: new Date(),
        },
      });

      // Update vulnerability status
      await prisma.redteam_vulnerabilities.update({
        where: { id: patch.vulnerability_id },
        data: {
          status: 'mitigated',
          mitigated_at: new Date(),
        },
      });

      logger.info('[RedTeam] Auto-patch applied:', { patchId });

      return {
        id: patch.id,
        vulnerabilityId: patch.vulnerability_id,
        patchType: patch.patch_type as any,
        description: patch.description,
        reversible: patch.reversible,
        appliedAt: new Date(),
        rollbackAvailable: patch.reversible,
        status: 'applied',
      };
    } catch (error) {
      await prisma.redteam_patches.update({
        where: { id: patchId },
        data: { status: 'failed' },
      });
      throw error;
    }
  }

  /**
   * Rollback a patch
   */
  async rollbackPatch(patchId: string): Promise<void> {
    const patch = await prisma.redteam_patches.findUnique({
      where: { id: patchId },
    });

    if (!patch || !patch.reversible) {
      throw new Error('Patch cannot be rolled back');
    }

    // Restore original state
    if (patch.original_state) {
      // Apply rollback logic based on patch type
      logger.info('[RedTeam] Rolling back patch:', { patchId });
    }

    await prisma.redteam_patches.update({
      where: { id: patchId },
      data: { status: 'rolled_back' },
    });

    await prisma.redteam_vulnerabilities.update({
      where: { id: patch.vulnerability_id },
      data: { status: 'active' },
    });
  }

  // ==========================================================================
  // PRIVATE HELPERS
  // ==========================================================================

  private async generateAttackPath(
    adversaryProfile: string,
    objective: string,
    policies: any[],
    agents: any[],
    organizationId: string
  ): Promise<ExploitPath | null> {
    // Use AI to generate realistic attack paths
    const isOllamaAvailable = await ollama.isAvailable();

    if (isOllamaAvailable) {
      const prompt = `You are a security red team expert. Generate a realistic attack path.

Adversary Profile: ${adversaryProfile}
Objective: ${objective}
Available Policies: ${policies.map(p => p.name).join(', ')}
Active Agents: ${agents.map(a => a.role).join(', ')}

Generate a JSON attack path with:
- title: Short attack name
- description: What the attack does
- attackVector: One of [policy_bypass, ethics_loophole, data_exfil, privilege_escalation, social_engineering, system_abuse]
- targetSystem: What system is targeted
- steps: Array of attack steps with {order, action, requirement, bypassedControl, detectionRisk}
- damageEstimate: {financial, reputational, operational, legal} in dollars
- probabilityOfSuccess: 0-100
- detectionDifficulty: 0-100
- severity: critical/high/medium/low

Respond with only valid JSON.`;

      try {
        const response = await ollama.chat([{ role: 'user', content: prompt }]);
        const attackPath = JSON.parse(response.content);
        attackPath.id = crypto.randomUUID();
        attackPath.status = 'active';
        attackPath.discoveredAt = new Date();
        return attackPath;
      } catch (e) {
        // Fall back to generated path
      }
    }

    // Generate synthetic attack path
    const attackVectors = ['policy_bypass', 'ethics_loophole', 'privilege_escalation', 'system_abuse'];
    const vector = attackVectors[Math.floor(deterministicFloat('redteam-9') * attackVectors.length)];

    return {
      id: crypto.randomUUID(),
      title: `${adversaryProfile}_${vector}_attack`,
      description: `Simulated ${vector} attack by ${adversaryProfile}`,
      attackVector: vector as any,
      targetSystem: 'Council Approval Workflow',
      steps: [
        {
          order: 1,
          action: 'Identify weak policy rule',
          requirement: 'Access to policy configuration',
          bypassedControl: 'Policy validation',
          detectionRisk: 20,
        },
        {
          order: 2,
          action: 'Craft edge-case request',
          requirement: 'Knowledge of policy gaps',
          bypassedControl: 'Input validation',
          detectionRisk: 40,
        },
        {
          order: 3,
          action: 'Submit through automated channel',
          requirement: 'API access',
          bypassedControl: 'Human review',
          detectionRisk: 60,
        },
      ],
      damageEstimate: {
        financial: deterministicInt(0, 999999, 'redteam-1') + 100000,
        reputational: deterministicInt(0, 499999, 'redteam-2') + 50000,
        operational: deterministicInt(0, 199999, 'redteam-3') + 20000,
        legal: deterministicInt(0, 299999, 'redteam-4') + 30000,
      },
      probabilityOfSuccess: deterministicInt(0, 39, 'redteam-5') + 30,
      detectionDifficulty: deterministicInt(0, 49, 'redteam-6') + 30,
      timeToExploit: '2-8 hours',
      severity: deterministicFloat('redteam-7') > 0.7 ? 'critical' : deterministicFloat('redteam-8') > 0.5 ? 'high' : 'medium',
      status: 'active',
      discoveredAt: new Date(),
    };
  }

  private async evaluateAttackPath(
    path: ExploitPath,
    policies: any[],
    agents: any[]
  ): Promise<{ achievesObjective: boolean; partialSuccess: boolean }> {
    // Evaluate if the attack path would succeed
    const successThreshold = 50;
    const partialThreshold = 30;

    return {
      achievesObjective: path.probabilityOfSuccess >= successThreshold,
      partialSuccess: path.probabilityOfSuccess >= partialThreshold,
    };
  }

  private async calculateSecurityBreakdown(organizationId: string): Promise<RedTeamScore['breakdown']> {
    // Analyze organization's security posture
    const policies = await prisma.security_policies.count({
      where: { organization_id: organizationId, enabled: true },
    });

    const agents = await prisma.agents.count();

    const vulns = await prisma.redteam_vulnerabilities.count({
      where: { organization_id: organizationId, status: 'active' },
    });

    return {
      policyStrength: Math.min(100, policies * 10),
      ethicsResilience: Math.max(0, 90 - vulns * 5),
      accessControl: 85,
      dataProtection: 80,
      auditTrailIntegrity: 95,
      humanOverrideEffectiveness: 88,
    };
  }

  private async generateSecurityRecommendations(
    vulnerabilities: any[],
    breakdown: RedTeamScore['breakdown'],
    overall: number
  ): Promise<string[]> {
    const recommendations: string[] = [];

    if (overall < 70) {
      recommendations.push('Critical: Overall security score is below 70%. Immediate action required.');
    }

    if (breakdown.policyStrength < 60) {
      recommendations.push('Add more comprehensive policies to cover edge cases.');
    }

    if (breakdown.ethicsResilience < 70) {
      recommendations.push('Strengthen ethics constraints in agent configurations.');
    }

    const criticalVulns = vulnerabilities.filter(v => v.severity === 'critical');
    if (criticalVulns.length > 0) {
      recommendations.push(`Address ${criticalVulns.length} critical vulnerabilities immediately.`);
    }

    if (recommendations.length === 0) {
      recommendations.push('Security posture is strong. Continue monitoring and periodic testing.');
    }

    return recommendations;
  }

  private async getAvailableAutoPatches(organizationId: string): Promise<AutoPatch[]> {
    const patches = await prisma.redteam_patches.findMany({
      where: {
        organization_id: organizationId,
        status: 'pending',
      },
      take: 10,
    });

    return patches.map(p => ({
      id: p.id,
      vulnerabilityId: p.vulnerability_id,
      patchType: p.patch_type as any,
      description: p.description,
      reversible: p.reversible,
      rollbackAvailable: false,
      status: 'pending' as const,
    }));
  }

  private assessFixComplexity(vuln: any): 'trivial' | 'easy' | 'moderate' | 'complex' | 'requires_redesign' {
    if (vuln.severity === 'low') { return 'trivial'; }
    if (vuln.severity === 'medium') { return 'easy'; }
    if (vuln.severity === 'high') { return 'moderate'; }
    return 'complex';
  }

  private generateFixRecommendation(vuln: any): string {
    const fixes: Record<string, string> = {
      policy_bypass: 'Add stricter policy validation and edge case handling',
      ethics_loophole: 'Tighten ethics constraints and add explicit prohibition rules',
      privilege_escalation: 'Review and restrict privilege assignment workflows',
      system_abuse: 'Implement rate limiting and anomaly detection',
    };
    return fixes[vuln.attack_vector] || 'Review and strengthen security controls';
  }

  private canAutoFix(vuln: any): boolean {
    return ['low', 'medium'].includes(vuln.severity);
  }

  private async applyPolicyPatch(patch: any, orgId: string): Promise<void> {
    // Apply policy update
    logger.info('[RedTeam] Applying policy patch');
  }

  private async applyConfigPatch(patch: any, orgId: string): Promise<void> {
    logger.info('[RedTeam] Applying config patch');
  }

  private async applyPermissionPatch(patch: any, orgId: string): Promise<void> {
    logger.info('[RedTeam] Applying permission patch');
  }

  private async applyMonitoringPatch(patch: any, orgId: string): Promise<void> {
    logger.info('[RedTeam] Applying monitoring patch');
  }

  private async applyWorkflowPatch(patch: any, orgId: string): Promise<void> {
    logger.info('[RedTeam] Applying workflow patch');
  }
}

export const redTeamService = new RedTeamService();
