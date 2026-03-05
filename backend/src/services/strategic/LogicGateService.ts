/**
 * Service — Logic Gate Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports logicGateService, ParallelTask, TaskResult, ParallelExecution, BurstConfig, GateMetrics
 * @module services/strategic/LogicGateService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// LOGICGATE� - PARALLEL PROCESSING ARCHITECTURE
// Concurrent Agent Execution & Burst Compute
// "The Accelerator" - Recursive bursts at infrastructure speed
// =============================================================================

import { PrismaClient } from '@prisma/client';
import { logger } from '../../utils/logger.js';
import { v4 as uuidv4 } from 'uuid';
import { getErrorMessage } from '../../utils/errors.js';
const prisma = new PrismaClient();

// =============================================================================
// TYPES
// =============================================================================

export interface ParallelTask {
  id: string;
  name: string;
  type: 'agent' | 'query' | 'computation' | 'validation';
  handler: () => Promise<unknown>;
  priority: number;
  timeout: number;
  dependencies?: string[];
  retryCount?: number;
}

export interface TaskResult {
  taskId: string;
  status: 'completed' | 'failed' | 'timeout' | 'cancelled';
  result?: unknown;
  error?: string;
  startedAt: Date;
  completedAt: Date;
  durationMs: number;
}

export interface ParallelExecution {
  id: string;
  organizationId: string;
  name: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'partial';
  tasks: ParallelTask[];
  results: Map<string, TaskResult>;
  concurrencyLimit: number;
  startedAt?: Date;
  completedAt?: Date;
  totalDurationMs?: number;
}

export interface BurstConfig {
  maxConcurrency: number;
  taskTimeout: number;
  executionTimeout: number;
  retryFailedTasks: boolean;
  maxRetries: number;
  priorityOrder: boolean;
}

export interface GateMetrics {
  activeExecutions: number;
  totalExecutions: number;
  avgTaskDurationMs: number;
  avgConcurrency: number;
  successRate: number;
  burstCapacity: number;
}

// =============================================================================
// LOGICGATE SERVICE
// =============================================================================

class LogicGateService {
  private executions: Map<string, ParallelExecution> = new Map();
  private taskQueue: ParallelTask[] = [];
  private activeWorkers: number = 0;
  private readonly MAX_WORKERS = 50;



  constructor() {


    this.loadFromDB().catch(() => {});


  }

  private metrics = {
    totalExecutions: 0,
    totalTasks: 0,
    totalDurationMs: 0,
    successfulTasks: 0
  };

  // ---------------------------------------------------------------------------
  // PARALLEL EXECUTION
  // ---------------------------------------------------------------------------

  async executeParallel(
    organizationId: string,
    name: string,
    tasks: ParallelTask[],
    config: Partial<BurstConfig> = {}
  ): Promise<ParallelExecution> {
    const executionId = uuidv4();
    const burstConfig: BurstConfig = {
      maxConcurrency: config.maxConcurrency || 10,
      taskTimeout: config.taskTimeout || 30000,
      executionTimeout: config.executionTimeout || 300000,
      retryFailedTasks: config.retryFailedTasks ?? true,
      maxRetries: config.maxRetries || 3,
      priorityOrder: config.priorityOrder ?? true
    };

    const execution: ParallelExecution = {
      id: executionId,
      organizationId,
      name,
      status: 'pending',
      tasks: burstConfig.priorityOrder 
        ? [...tasks].sort((a, b) => b.priority - a.priority)
        : tasks,
      results: new Map(),
      concurrencyLimit: burstConfig.maxConcurrency,
      startedAt: new Date()
    };

    this.executions.set(executionId, execution);
    this.metrics.totalExecutions++;

    // Log execution start
    await this.logExecution(executionId, organizationId, 'started', {
      taskCount: tasks.length,
      concurrency: burstConfig.maxConcurrency
    });

    // Execute with burst compute
    await this.runBurstExecution(execution, burstConfig);

    return execution;
  }

  private async runBurstExecution(
    execution: ParallelExecution,
    config: BurstConfig
  ): Promise<void> {
    execution.status = 'running';
    const startTime = Date.now();

    // Build dependency graph
    const dependencyMap = new Map<string, Set<string>>();
    const completedTasks = new Set<string>();

    for (const task of execution.tasks) {
      dependencyMap.set(task.id, new Set(task.dependencies || []));
    }

    // Process tasks respecting dependencies and concurrency
    const pendingTasks = [...execution.tasks];
    const runningTasks = new Map<string, Promise<TaskResult>>();

    while (pendingTasks.length > 0 || runningTasks.size > 0) {
      // Check timeout
      if (Date.now() - startTime > config.executionTimeout) {
        execution.status = 'partial';
        logger.warn(`Execution ${execution.id} timed out`);
        break;
      }

      // Find ready tasks (dependencies satisfied)
      const readyTasks: ParallelTask[] = [];
      for (let i = pendingTasks.length - 1; i >= 0; i--) {
        const task = pendingTasks[i];
        const deps = dependencyMap.get(task.id) || new Set();
        const depsCompleted = [...deps].every(d => completedTasks.has(d));

        if (depsCompleted && runningTasks.size < config.maxConcurrency) {
          readyTasks.push(task);
          pendingTasks.splice(i, 1);
        }
      }

      // Start ready tasks
      for (const task of readyTasks) {
        const taskPromise = this.executeTask(task, config);
        runningTasks.set(task.id, taskPromise);
        this.activeWorkers++;
      }

      // Wait for at least one task to complete
      if (runningTasks.size > 0) {
        const completedPromise = await Promise.race(
          [...runningTasks.entries()].map(async ([id, promise]) => {
            const result = await promise;
            return { id, result };
          })
        );

        runningTasks.delete(completedPromise.id);
        execution.results.set(completedPromise.id, completedPromise.result);
        completedTasks.add(completedPromise.id);
        this.activeWorkers--;

        // Handle retry
        if (completedPromise.result.status === 'failed' && config.retryFailedTasks) {
          const task = execution.tasks.find(t => t.id === completedPromise.id);
          if (task && (task.retryCount || 0) < config.maxRetries) {
            task.retryCount = (task.retryCount || 0) + 1;
            pendingTasks.push(task);
            completedTasks.delete(completedPromise.id);
            logger.info(`Retrying task ${task.id} (attempt ${task.retryCount})`);
          }
        }
      }
    }

    execution.completedAt = new Date();
    execution.totalDurationMs = execution.completedAt.getTime() - execution.startedAt!.getTime();

    // Determine final status
    const failedCount = [...execution.results.values()].filter(r => r.status === 'failed').length;
    if (failedCount === 0) {
      execution.status = 'completed';
    } else if (failedCount === execution.tasks.length) {
      execution.status = 'failed';
    } else {
      execution.status = 'partial';
    }

    // Log completion
    await this.logExecution(execution.id, execution.organizationId, 'completed', {
      status: execution.status,
      durationMs: execution.totalDurationMs,
      successCount: execution.tasks.length - failedCount,
      failedCount
    });
  }

  private async executeTask(task: ParallelTask, config: BurstConfig): Promise<TaskResult> {
    const startedAt = new Date();
    this.metrics.totalTasks++;

    try {
      // Execute with timeout
      const result = await Promise.race([
        task.handler(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Task timeout')), config.taskTimeout)
        )
      ]);

      const completedAt = new Date();
      this.metrics.successfulTasks++;
      this.metrics.totalDurationMs += completedAt.getTime() - startedAt.getTime();

      return {
        taskId: task.id,
        status: 'completed',
        result,
        startedAt,
        completedAt,
        durationMs: completedAt.getTime() - startedAt.getTime()
      };
    } catch (error: unknown) {
      const completedAt = new Date();
      return {
        taskId: task.id,
        status: getErrorMessage(error) === 'Task timeout' ? 'timeout' : 'failed',
        error: getErrorMessage(error),
        startedAt,
        completedAt,
        durationMs: completedAt.getTime() - startedAt.getTime()
      };
    }
  }

  // ---------------------------------------------------------------------------
  // AGENT-SPECIFIC PARALLEL EXECUTION
  // ---------------------------------------------------------------------------

  async executeAgentsInParallel(
    organizationId: string,
    agentTasks: { agentId: string; prompt: string; model?: string }[],
    config: Partial<BurstConfig> = {}
  ): Promise<ParallelExecution> {
    const tasks: ParallelTask[] = agentTasks.map((at, index) => ({
      id: uuidv4(),
      name: `Agent-${at.agentId}`,
      type: 'agent' as const,
      handler: async () => {
        // Import ollama dynamically to avoid circular deps
        const ollama: any = (await import('../ollama.js')).default;
        return ollama.generate(at.prompt, { model: at.model });
      },
      priority: agentTasks.length - index,
      timeout: config.taskTimeout || 60000
    }));

    return this.executeParallel(organizationId, 'Agent Parallel Execution', tasks, config);
  }

  async executeRedTeamAndUnion(
    organizationId: string,
    scenario: string,
    context: Record<string, unknown>
  ): Promise<{ redTeam: unknown; union: unknown; synthesis: string }> {
    const startTime = Date.now();

    // Execute Red Team and Union in parallel
    const execution = await this.executeAgentsInParallel(
      organizationId,
      [
        {
          agentId: 'red-team',
          prompt: `RED TEAM ANALYSIS - Adversarial Assessment

Scenario: ${scenario}
Context: ${JSON.stringify(context)}

As the Red Team, identify all potential attack vectors, vulnerabilities, and failure modes.
Focus on:
1. Security vulnerabilities
2. Process weaknesses
3. Human factors
4. External threats
5. Cascade failures

Output JSON:
{
  "threats": [{"type": "...", "severity": "critical|high|medium|low", "description": "..."}],
  "attackVectors": ["..."],
  "recommendations": ["..."]
}`
        },
        {
          agentId: 'union',
          prompt: `UNION ANALYSIS - Defensive Synthesis

Scenario: ${scenario}
Context: ${JSON.stringify(context)}

As Union, synthesize defensive recommendations and mitigation strategies.
Focus on:
1. Immediate defenses
2. Long-term hardening
3. Detection mechanisms
4. Response procedures
5. Recovery plans

Output JSON:
{
  "defenses": [{"type": "...", "priority": 1-5, "description": "..."}],
  "mitigations": ["..."],
  "monitoringPoints": ["..."]
}`
        }
      ],
      { maxConcurrency: 2, taskTimeout: 60000 }
    );

    const redTeamResult = execution.results.get([...execution.results.keys()][0]);
    const unionResult = execution.results.get([...execution.results.keys()][1]);

    // Synthesize results
    const ollama: any = (await import('../ollama.js')).default;
    const synthesis = await ollama.generate(`
Synthesize these parallel Red Team and Union analyses:

RED TEAM FINDINGS:
${JSON.stringify(redTeamResult?.result || 'Analysis failed')}

UNION RECOMMENDATIONS:
${JSON.stringify(unionResult?.result || 'Analysis failed')}

Provide a unified security posture recommendation in 2-3 sentences.
`, {});

    logger.info(`Red Team + Union parallel execution completed in ${Date.now() - startTime}ms`);

    return {
      redTeam: redTeamResult?.result,
      union: unionResult?.result,
      synthesis: synthesis.trim()
    };
  }

  // ---------------------------------------------------------------------------
  // QUERY VALIDATION
  // ---------------------------------------------------------------------------

  async validateQuery(
    query: string,
    validations: { name: string; validator: (q: string) => Promise<boolean> }[]
  ): Promise<{ valid: boolean; results: Record<string, boolean> }> {
    const tasks: ParallelTask[] = validations.map((v, i) => ({
      id: uuidv4(),
      name: v.name,
      type: 'validation' as const,
      handler: () => v.validator(query),
      priority: validations.length - i,
      timeout: 5000
    }));

    const execution = await this.executeParallel('system', 'Query Validation', tasks, {
      maxConcurrency: validations.length
    });

    const results: Record<string, boolean> = {};
    let allValid = true;

    for (const [taskId, result] of execution.results) {
      const task = tasks.find(t => t.id === taskId);
      if (task) {
        results[task.name] = result.status === 'completed' && result.result === true;
        if (!results[task.name]) allValid = false;
      }
    }

    return { valid: allValid, results };
  }

  // ---------------------------------------------------------------------------
  // DATABASE LOGGING
  // ---------------------------------------------------------------------------

  private async logExecution(
    executionId: string,
    organizationId: string,
    event: string,
    details: Record<string, unknown>
  ): Promise<void> {
    try {
      await prisma.audit_logs.create({
        data: {
          id: uuidv4(),
          organization_id: organizationId,
          action: `LOGICGATE_${event.toUpperCase()}`,
          resource_type: 'parallel_execution',
          resource_id: executionId,
          details: details as any
        }
      });
    } catch (error) {
      logger.error('Failed to log execution:', error);
    }
  }

  // ---------------------------------------------------------------------------
  // QUERY METHODS
  // ---------------------------------------------------------------------------

  getExecution(executionId: string): ParallelExecution | undefined {
    return this.executions.get(executionId);
  }

  getActiveExecutions(): ParallelExecution[] {
    return [...this.executions.values()].filter(e => e.status === 'running');
  }

  // ---------------------------------------------------------------------------
  // METRICS
  // ---------------------------------------------------------------------------

  getMetrics(): GateMetrics {
    const activeExecutions = [...this.executions.values()].filter(e => e.status === 'running').length;

    return {
      activeExecutions,
      totalExecutions: this.metrics.totalExecutions,
      avgTaskDurationMs: this.metrics.totalTasks > 0 
        ? this.metrics.totalDurationMs / this.metrics.totalTasks 
        : 0,
      avgConcurrency: this.metrics.totalExecutions > 0
        ? [...this.executions.values()].reduce((sum, e) => sum + e.concurrencyLimit, 0) / this.executions.size
        : 0,
      successRate: this.metrics.totalTasks > 0
        ? this.metrics.successfulTasks / this.metrics.totalTasks
        : 1,
      burstCapacity: this.MAX_WORKERS - this.activeWorkers
    };
  }



  async loadFromDB(): Promise<void> {


    try {


      let restored = 0;


      const recs = await loadServiceRecords({ serviceName: 'LogicGate', recordType: 'record', limit: 1000 });


      for (const rec of recs) {


        const d = rec.data as any;


        if (d?.id && !this.executions.has(d.id)) this.executions.set(d.id, d);


      }


      restored += recs.length;


      if (restored > 0) logger.info(`[LogicGateService] Restored ${restored} records from database`);


    } catch (err) {


      logger.warn(`[LogicGateService] DB reload skipped: ${(err as Error).message}`);


    }


  }
}

export const logicGateService = new LogicGateService();
export default logicGateService;
