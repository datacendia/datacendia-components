// =============================================================================
// ENTERPRISE SCHEDULER SERVICE
// Real cron-based job scheduling for enterprise platinum features
// =============================================================================

import { logger } from '../../utils/logger.js';
import { prisma } from '../../config/database.js';
import { EventEmitter } from 'events';
import crypto from 'crypto';

// =============================================================================
// TYPES
// =============================================================================

export type JobType = 
  | 'apotheosis_nightly'      // Nightly red-teaming
  | 'security_assessment'     // Scheduled security tests
  | 'sbom_scan'              // Software bill of materials scan
  | 'compliance_check'       // Compliance monitoring
  | 'backup_verification'    // Backup integrity check
  | 'runtime_health'         // Runtime security health check
  | 'dissent_deadline'       // Dissent response deadline enforcement
  | 'analytics_aggregation'  // Analytics data aggregation
  | 'custom';

export type JobStatus = 'scheduled' | 'running' | 'completed' | 'failed' | 'cancelled';

export interface ScheduledJob {
  id: string;
  organizationId: string;
  jobType: JobType;
  name: string;
  description?: string;
  
  // Schedule (cron expression)
  cronExpression: string;
  timezone: string;
  
  // Configuration
  config: Record<string, unknown>;
  
  // State
  status: JobStatus;
  enabled: boolean;
  
  // Execution tracking
  lastRunAt?: Date;
  lastRunStatus?: 'success' | 'failure';
  lastRunDurationMs?: number;
  lastRunError?: string;
  nextRunAt?: Date;
  
  // Statistics
  totalRuns: number;
  successfulRuns: number;
  failedRuns: number;
  
  // Audit
  createdAt: Date;
  createdBy: string;
  updatedAt: Date;
}

export interface JobExecution {
  id: string;
  jobId: string;
  organizationId: string;
  jobType: JobType;
  
  startedAt: Date;
  completedAt?: Date;
  durationMs?: number;
  
  status: 'running' | 'success' | 'failure';
  result?: Record<string, unknown>;
  error?: string;
  
  // Audit trail
  triggeredBy: 'schedule' | 'manual' | 'system';
  executionHash: string; // SHA-256 of execution details
}

// =============================================================================
// CRON PARSER (Simple implementation)
// =============================================================================

interface ParsedCron {
  minute: number[];
  hour: number[];
  dayOfMonth: number[];
  month: number[];
  dayOfWeek: number[];
}

function parseCronField(field: string, min: number, max: number): number[] {
  if (field === '*') {
    return Array.from({ length: max - min + 1 }, (_, i) => min + i);
  }
  
  const values: number[] = [];
  const parts = field.split(',');
  
  for (const part of parts) {
    if (part.includes('/')) {
      const splitParts = part.split('/');
      const range = splitParts[0] || '*';
      const step = splitParts[1] || '1';
      const stepNum = parseInt(step, 10);
      let start = min;
      let end = max;
      
      if (range !== '*') {
        if (range.includes('-')) {
          const rangeParts = range.split('-');
          start = parseInt(rangeParts[0] || String(min), 10);
          end = parseInt(rangeParts[1] || String(max), 10);
        } else {
          start = parseInt(range, 10);
        }
      }
      
      for (let i = start; i <= end; i += stepNum) {
        values.push(i);
      }
    } else if (part.includes('-')) {
      const rangeParts = part.split('-');
      const start = parseInt(rangeParts[0] || String(min), 10);
      const end = parseInt(rangeParts[1] || String(max), 10);
      for (let i = start; i <= end; i++) {
        values.push(i);
      }
    } else {
      values.push(parseInt(part, 10));
    }
  }
  
  return [...new Set(values)].sort((a, b) => a - b);
}

function parseCron(expression: string): ParsedCron {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) {
    throw new Error(`Invalid cron expression: ${expression}`);
  }
  
  return {
    minute: parseCronField(parts[0], 0, 59),
    hour: parseCronField(parts[1], 0, 23),
    dayOfMonth: parseCronField(parts[2], 1, 31),
    month: parseCronField(parts[3], 1, 12),
    dayOfWeek: parseCronField(parts[4], 0, 6),
  };
}

function getNextRunTime(cron: ParsedCron, after: Date = new Date()): Date {
  const next = new Date(after);
  next.setSeconds(0);
  next.setMilliseconds(0);
  next.setMinutes(next.getMinutes() + 1);
  
  // Find next valid time (max 1 year ahead)
  const maxIterations = 366 * 24 * 60;
  for (let i = 0; i < maxIterations; i++) {
    const month = next.getMonth() + 1;
    const dayOfMonth = next.getDate();
    const dayOfWeek = next.getDay();
    const hour = next.getHours();
    const minute = next.getMinutes();
    
    if (
      cron.month.includes(month) &&
      cron.dayOfMonth.includes(dayOfMonth) &&
      cron.dayOfWeek.includes(dayOfWeek) &&
      cron.hour.includes(hour) &&
      cron.minute.includes(minute)
    ) {
      return next;
    }
    
    next.setMinutes(next.getMinutes() + 1);
  }
  
  throw new Error('Could not find next run time within 1 year');
}

// =============================================================================
// ENTERPRISE SCHEDULER SERVICE
// =============================================================================

class EnterpriseSchedulerService extends EventEmitter {
  private jobs: Map<string, ScheduledJob> = new Map();
  private timers: Map<string, NodeJS.Timeout> = new Map();
  private executions: Map<string, JobExecution> = new Map();
  private isRunning = false;
  private checkInterval: NodeJS.Timeout | null = null;
  
  constructor() {
    super();
    logger.info('[Scheduler] Enterprise Scheduler Service initialized');
  }
  
  // ===========================================================================
  // LIFECYCLE
  // ===========================================================================
  
  async start(): Promise<void> {
    if (this.isRunning) return;
    
    this.isRunning = true;
    logger.info('[Scheduler] Starting enterprise scheduler');
    
    // Load jobs from database
    await this.loadJobsFromDatabase();
    
    // Schedule all enabled jobs
    for (const job of this.jobs.values()) {
      if (job.enabled) {
        this.scheduleJob(job);
      }
    }
    
    // Start the check interval (every minute)
    this.checkInterval = setInterval(() => this.checkScheduledJobs(), 60000);
    
    // Register default jobs if not exist
    await this.registerDefaultJobs();
    
    this.emit('started');
    logger.info(`[Scheduler] Started with ${this.jobs.size} jobs`);
  }
  
  async stop(): Promise<void> {
    if (!this.isRunning) return;
    
    this.isRunning = false;
    logger.info('[Scheduler] Stopping enterprise scheduler');
    
    // Clear all timers
    for (const timer of this.timers.values()) {
      clearTimeout(timer);
    }
    this.timers.clear();
    
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    
    this.emit('stopped');
  }
  
  // ===========================================================================
  // JOB MANAGEMENT
  // ===========================================================================
  
  async createJob(params: {
    organizationId: string;
    jobType: JobType;
    name: string;
    description?: string;
    cronExpression: string;
    timezone?: string;
    config?: Record<string, unknown>;
    createdBy: string;
    enabled?: boolean;
  }): Promise<ScheduledJob> {
    const id = `job_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    
    // Validate cron expression
    const parsedCron = parseCron(params.cronExpression);
    const nextRunAt = getNextRunTime(parsedCron);
    
    const job: ScheduledJob = {
      id,
      organizationId: params.organizationId,
      jobType: params.jobType,
      name: params.name,
      description: params.description,
      cronExpression: params.cronExpression,
      timezone: params.timezone || 'UTC',
      config: params.config || {},
      status: 'scheduled',
      enabled: params.enabled ?? true,
      nextRunAt,
      totalRuns: 0,
      successfulRuns: 0,
      failedRuns: 0,
      createdAt: new Date(),
      createdBy: params.createdBy,
      updatedAt: new Date(),
    };
    
    this.jobs.set(id, job);
    
    // Persist to database
    await this.persistJob(job);
    
    // Schedule if enabled
    if (job.enabled && this.isRunning) {
      this.scheduleJob(job);
    }
    
    this.emit('jobCreated', job);
    logger.info(`[Scheduler] Created job: ${job.name} (${job.id})`);
    
    return job;
  }
  
  async updateJob(jobId: string, updates: Partial<Pick<ScheduledJob, 'name' | 'description' | 'cronExpression' | 'config' | 'enabled'>>): Promise<ScheduledJob | null> {
    const job = this.jobs.get(jobId);
    if (!job) return null;
    
    // If cron changed, recalculate next run
    if (updates.cronExpression && updates.cronExpression !== job.cronExpression) {
      const parsedCron = parseCron(updates.cronExpression);
      job.nextRunAt = getNextRunTime(parsedCron);
    }
    
    Object.assign(job, updates, { updatedAt: new Date() });
    
    // Reschedule if needed
    if (this.isRunning) {
      this.cancelJobTimer(jobId);
      if (job.enabled) {
        this.scheduleJob(job);
      }
    }
    
    await this.persistJob(job);
    this.emit('jobUpdated', job);
    
    return job;
  }
  
  async deleteJob(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId);
    if (!job) return false;
    
    this.cancelJobTimer(jobId);
    this.jobs.delete(jobId);
    
    // Remove from database
    try {
      await prisma.$executeRaw`DELETE FROM enterprise_scheduled_jobs WHERE id = ${jobId}`;
    } catch (e) {
      // Job might not exist in DB yet
    }
    
    this.emit('jobDeleted', job);
    logger.info(`[Scheduler] Deleted job: ${job.name} (${jobId})`);
    
    return true;
  }
  
  getJob(jobId: string): ScheduledJob | undefined {
    return this.jobs.get(jobId);
  }
  
  getJobs(organizationId?: string): ScheduledJob[] {
    const jobs = Array.from(this.jobs.values());
    if (organizationId) {
      return jobs.filter(j => j.organizationId === organizationId);
    }
    return jobs;
  }
  
  // ===========================================================================
  // MANUAL EXECUTION
  // ===========================================================================
  
  async runJobNow(jobId: string, triggeredBy: 'manual' | 'system' = 'manual'): Promise<JobExecution> {
    const job = this.jobs.get(jobId);
    if (!job) {
      throw new Error(`Job not found: ${jobId}`);
    }
    
    return this.executeJob(job, triggeredBy);
  }
  
  // ===========================================================================
  // INTERNAL SCHEDULING
  // ===========================================================================
  
  private scheduleJob(job: ScheduledJob): void {
    if (!job.nextRunAt) {
      const parsedCron = parseCron(job.cronExpression);
      job.nextRunAt = getNextRunTime(parsedCron);
    }
    
    const msUntilRun = job.nextRunAt.getTime() - Date.now();
    
    if (msUntilRun <= 0) {
      // Should run immediately
      this.executeJob(job, 'schedule');
      return;
    }
    
    // Schedule for next run (max setTimeout is ~24 days, so we re-check every minute)
    const timer = setTimeout(() => {
      this.executeJob(job, 'schedule');
    }, Math.min(msUntilRun, 60000));
    
    this.timers.set(job.id, timer);
  }
  
  private cancelJobTimer(jobId: string): void {
    const timer = this.timers.get(jobId);
    if (timer) {
      clearTimeout(timer);
      this.timers.delete(jobId);
    }
  }
  
  private checkScheduledJobs(): void {
    const now = Date.now();
    
    for (const job of this.jobs.values()) {
      if (!job.enabled || job.status === 'running') continue;
      
      if (job.nextRunAt && job.nextRunAt.getTime() <= now) {
        this.executeJob(job, 'schedule');
      }
    }
  }
  
  // ===========================================================================
  // JOB EXECUTION
  // ===========================================================================
  
  private async executeJob(job: ScheduledJob, triggeredBy: 'schedule' | 'manual' | 'system'): Promise<JobExecution> {
    const executionId = `exec_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
    const startedAt = new Date();
    
    const execution: JobExecution = {
      id: executionId,
      jobId: job.id,
      organizationId: job.organizationId,
      jobType: job.jobType,
      startedAt,
      status: 'running',
      triggeredBy,
      executionHash: crypto.createHash('sha256')
        .update(`${executionId}:${job.id}:${startedAt.toISOString()}`)
        .digest('hex'),
    };
    
    this.executions.set(executionId, execution);
    job.status = 'running';
    
    logger.info(`[Scheduler] Executing job: ${job.name} (${job.id}) - Execution: ${executionId}`);
    this.emit('jobStarted', { job, execution });
    
    try {
      // Execute the job handler
      const result = await this.runJobHandler(job);
      
      execution.completedAt = new Date();
      execution.durationMs = execution.completedAt.getTime() - startedAt.getTime();
      execution.status = 'success';
      execution.result = result;
      
      // Update job stats
      job.lastRunAt = startedAt;
      job.lastRunStatus = 'success';
      job.lastRunDurationMs = execution.durationMs;
      job.lastRunError = undefined;
      job.totalRuns++;
      job.successfulRuns++;
      job.status = 'completed';
      
      logger.info(`[Scheduler] Job completed: ${job.name} in ${execution.durationMs}ms`);
      
    } catch (error) {
      execution.completedAt = new Date();
      execution.durationMs = execution.completedAt.getTime() - startedAt.getTime();
      execution.status = 'failure';
      execution.error = error instanceof Error ? error.message : String(error);
      
      // Update job stats
      job.lastRunAt = startedAt;
      job.lastRunStatus = 'failure';
      job.lastRunDurationMs = execution.durationMs;
      job.lastRunError = execution.error;
      job.totalRuns++;
      job.failedRuns++;
      job.status = 'failed';
      
      logger.error(`[Scheduler] Job failed: ${job.name} - ${execution.error}`);
    }
    
    // Calculate next run time
    const parsedCron = parseCron(job.cronExpression);
    job.nextRunAt = getNextRunTime(parsedCron);
    job.updatedAt = new Date();
    
    // Persist
    await this.persistJob(job);
    await this.persistExecution(execution);
    
    // Reschedule
    if (job.enabled && this.isRunning) {
      this.scheduleJob(job);
    }
    
    this.emit('jobCompleted', { job, execution });
    
    return execution;
  }
  
  // ===========================================================================
  // JOB HANDLERS
  // ===========================================================================
  
  private async runJobHandler(job: ScheduledJob): Promise<Record<string, unknown>> {
    switch (job.jobType) {
      case 'apotheosis_nightly':
        return this.runApotheosisNightly(job);
        
      case 'security_assessment':
        return this.runSecurityAssessment(job);
        
      case 'sbom_scan':
        return this.runSBOMScan(job);
        
      case 'compliance_check':
        return this.runComplianceCheck(job);
        
      case 'dissent_deadline':
        return this.runDissentDeadlineEnforcement(job);
        
      case 'runtime_health':
        return this.runRuntimeHealthCheck(job);
        
      case 'analytics_aggregation':
        return this.runAnalyticsAggregation(job);
        
      case 'backup_verification':
        return this.runBackupVerification(job);
        
      case 'custom':
        return this.runCustomJob(job);
        
      default:
        throw new Error(`Unknown job type: ${job.jobType}`);
    }
  }
  
  private async runApotheosisNightly(job: ScheduledJob): Promise<Record<string, unknown>> {
    // Import dynamically to avoid circular dependencies
    const { apotheosisService } = await import('../CendiaApotheosisService.js');
    
    logger.info(`[Scheduler] Running Apotheosis nightly red-teaming for org: ${job.organizationId}`);
    
    const result = await apotheosisService.runNightlyRedTeam(job.organizationId);
    
    return {
      scenarios_tested: result.scenariosTested,
      survived: result.survived,
      failed: result.failed,
      escalations: result.escalations,
      auto_patches: result.autoPatches,
      upskilling_assigned: result.upskillingAssigned,
    };
  }
  
  private async runSecurityAssessment(job: ScheduledJob): Promise<Record<string, unknown>> {
    const { enterpriseRedTeamService } = await import('../crucible/EnterpriseRedTeamService.js');
    
    logger.info(`[Scheduler] Running scheduled security assessment for org: ${job.organizationId}`);
    
    const testSuites = (job.config['testSuites'] as string[]) || ['owasp', 'ai_adversarial'];
    const result = await enterpriseRedTeamService.runFullAssessment(job.organizationId, testSuites);
    
    return {
      report_id: result.id,
      tests_run: result.totalTests,
      passed: result.passed,
      failed: result.failed,
      critical_findings: result.criticalFindings,
    };
  }
  
  private async runSBOMScan(job: ScheduledJob): Promise<Record<string, unknown>> {
    const { sbomService } = await import('../crucible/SBOMService.js');
    
    logger.info(`[Scheduler] Running SBOM scan for org: ${job.organizationId}`);
    
    const result = await sbomService.generateSBOM(job.organizationId);
    
    return {
      sbom_id: result.id,
      components: result.components?.length || 0,
      vulnerabilities: result.vulnerabilities?.length || 0,
      license_issues: result.licenses?.filter((l: any) => l.risk !== 'low').length || 0,
    };
  }
  
  private async runComplianceCheck(job: ScheduledJob): Promise<Record<string, unknown>> {
    const { cendiaPanopticonService } = await import('../CendiaPanopticonService.js');
    
    logger.info(`[Scheduler] Running compliance check for org: ${job.organizationId}`);
    
    const [violations, gaps] = await Promise.all([
      cendiaPanopticonService.detectViolations(job.organizationId, {}),
      cendiaPanopticonService.getComplianceGaps(job.organizationId),
    ]);
    
    return {
      violations_detected: violations.length,
      compliance_gaps: gaps.length,
      checked_at: new Date().toISOString(),
    };
  }
  
  private async runDissentDeadlineEnforcement(job: ScheduledJob): Promise<Record<string, unknown>> {
    const { dissentService } = await import('../CendiaDissentService.js');
    
    logger.info(`[Scheduler] Running dissent deadline enforcement for org: ${job.organizationId}`);
    
    const result = await dissentService.enforceDeadlines(job.organizationId);
    
    return {
      dissents_checked: result.checked,
      escalated: result.escalated,
      auto_acknowledged: result.autoAcknowledged,
    };
  }
  
  private async runRuntimeHealthCheck(job: ScheduledJob): Promise<Record<string, unknown>> {
    const { runtimeSecurityService } = await import('../crucible/RuntimeSecurityService.js');
    
    logger.info(`[Scheduler] Running runtime health check for org: ${job.organizationId}`);
    
    const status = runtimeSecurityService.getServiceStatus();
    
    return {
      status: status.status,
      events_processed: status.eventsProcessed,
      active_alerts: status.activeAlerts,
      last_check: new Date().toISOString(),
    };
  }
  
  private async runAnalyticsAggregation(job: ScheduledJob): Promise<Record<string, unknown>> {
    logger.info(`[Scheduler] Running analytics aggregation for org: ${job.organizationId}`);
    
    // Aggregate metrics from various sources
    const [deliberationCount, decisionCount, dissentCount] = await Promise.all([
      prisma.deliberations.count({ where: { organization_id: job.organizationId } }).catch(() => 0),
      prisma.decisions.count({ where: { organization_id: job.organizationId } }).catch(() => 0),
      prisma.dissents.count({ where: { organization_id: job.organizationId } }).catch(() => 0),
    ]);
    
    // Store aggregated metrics in audit_logs as a fallback
    await prisma.audit_logs.create({
      data: {
        id: `analytics_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`,
        organization_id: job.organizationId,
        user_id: 'system',
        action: 'ANALYTICS_AGGREGATION',
        resource_type: 'analytics',
        resource_id: 'daily_snapshot',
        details: {
          deliberations: deliberationCount,
          decisions: decisionCount,
          dissents: dissentCount,
          timestamp: new Date().toISOString(),
        },
        ip_address: '127.0.0.1',
        created_at: new Date(),
      },
    }).catch(() => {
      // Log aggregation - non-critical
    });
    
    return {
      deliberations: deliberationCount,
      decisions: decisionCount,
      dissents: dissentCount,
      aggregated_at: new Date().toISOString(),
    };
  }
  
  private async runBackupVerification(job: ScheduledJob): Promise<Record<string, unknown>> {
    logger.info(`[Scheduler] Running backup verification for org: ${job.organizationId}`);
    
    // Check database connectivity and basic integrity
    const dbHealth = await prisma.$queryRaw`SELECT 1 as health`.catch(() => null);
    
    return {
      database_healthy: dbHealth !== null,
      verified_at: new Date().toISOString(),
    };
  }
  
  private async runCustomJob(job: ScheduledJob): Promise<Record<string, unknown>> {
    logger.info(`[Scheduler] Running custom job: ${job.name}`);
    
    // Custom jobs just emit an event for external handlers
    this.emit('customJob', { job });
    
    return {
      executed: true,
      config: job.config,
    };
  }
  
  // ===========================================================================
  // PERSISTENCE
  // ===========================================================================
  
  private async loadJobsFromDatabase(): Promise<void> {
    try {
      // Use raw query as a fallback since the table might not exist
      const dbJobs = await prisma.$queryRaw<any[]>`
        SELECT * FROM enterprise_scheduled_jobs WHERE enabled = true
      `.catch(() => []);
      
      for (const dbJob of dbJobs) {
        const job: ScheduledJob = {
          id: dbJob.id,
          organizationId: dbJob.organization_id,
          jobType: dbJob.job_type as JobType,
          name: dbJob.name,
          description: dbJob.description,
          cronExpression: dbJob.cron_expression,
          timezone: dbJob.timezone,
          config: typeof dbJob.config === 'string' ? JSON.parse(dbJob.config) : (dbJob.config || {}),
          status: dbJob.status as JobStatus,
          enabled: dbJob.enabled,
          lastRunAt: dbJob.last_run_at,
          lastRunStatus: dbJob.last_run_status as 'success' | 'failure' | undefined,
          lastRunDurationMs: dbJob.last_run_duration_ms,
          lastRunError: dbJob.last_run_error,
          nextRunAt: dbJob.next_run_at,
          totalRuns: dbJob.total_runs || 0,
          successfulRuns: dbJob.successful_runs || 0,
          failedRuns: dbJob.failed_runs || 0,
          createdAt: dbJob.created_at,
          createdBy: dbJob.created_by,
          updatedAt: dbJob.updated_at,
        };
        
        this.jobs.set(job.id, job);
      }
      
      logger.info(`[Scheduler] Loaded ${this.jobs.size} jobs from database`);
    } catch (error) {
      logger.warn('[Scheduler] Could not load jobs from database - table may not exist yet');
    }
  }
  
  private async persistJob(job: ScheduledJob): Promise<void> {
    try {
      // Use raw SQL for flexibility - table might not exist yet
      await prisma.$executeRaw`
        INSERT INTO enterprise_scheduled_jobs (
          id, organization_id, job_type, name, description, cron_expression, timezone,
          config, status, enabled, last_run_at, last_run_status, last_run_duration_ms,
          last_run_error, next_run_at, total_runs, successful_runs, failed_runs,
          created_at, created_by, updated_at
        ) VALUES (
          ${job.id}, ${job.organizationId}, ${job.jobType}, ${job.name}, ${job.description || null},
          ${job.cronExpression}, ${job.timezone}, ${JSON.stringify(job.config)}::jsonb,
          ${job.status}, ${job.enabled}, ${job.lastRunAt || null}, ${job.lastRunStatus || null},
          ${job.lastRunDurationMs || null}, ${job.lastRunError || null}, ${job.nextRunAt || null},
          ${job.totalRuns}, ${job.successfulRuns}, ${job.failedRuns},
          ${job.createdAt}, ${job.createdBy}, ${job.updatedAt}
        )
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          description = EXCLUDED.description,
          cron_expression = EXCLUDED.cron_expression,
          config = EXCLUDED.config,
          status = EXCLUDED.status,
          enabled = EXCLUDED.enabled,
          last_run_at = EXCLUDED.last_run_at,
          last_run_status = EXCLUDED.last_run_status,
          last_run_duration_ms = EXCLUDED.last_run_duration_ms,
          last_run_error = EXCLUDED.last_run_error,
          next_run_at = EXCLUDED.next_run_at,
          total_runs = EXCLUDED.total_runs,
          successful_runs = EXCLUDED.successful_runs,
          failed_runs = EXCLUDED.failed_runs,
          updated_at = EXCLUDED.updated_at
      `;
    } catch (error) {
      // Table might not exist - jobs will be kept in memory
      logger.debug(`[Scheduler] Could not persist job ${job.id}: ${error}`);
    }
  }
  
  private async persistExecution(execution: JobExecution): Promise<void> {
    try {
      await prisma.$executeRaw`
        INSERT INTO enterprise_job_executions (
          id, job_id, organization_id, job_type, started_at, completed_at,
          duration_ms, status, result, error, triggered_by, execution_hash
        ) VALUES (
          ${execution.id}, ${execution.jobId}, ${execution.organizationId},
          ${execution.jobType}, ${execution.startedAt}, ${execution.completedAt || null},
          ${execution.durationMs || null}, ${execution.status},
          ${JSON.stringify(execution.result || {})}::jsonb, ${execution.error || null},
          ${execution.triggeredBy}, ${execution.executionHash}
        )
      `;
    } catch (error) {
      // Non-critical - execution data kept in memory
      logger.debug(`[Scheduler] Could not persist execution ${execution.id}: ${error}`);
    }
  }
  
  // ===========================================================================
  // DEFAULT JOBS
  // ===========================================================================
  
  private async registerDefaultJobs(): Promise<void> {
    // Get default org
    const defaultOrg = await prisma.organizations.findFirst().catch(() => null);
    if (!defaultOrg) return;
    
    const defaultJobs: Array<{
      jobType: JobType;
      name: string;
      description: string;
      cronExpression: string;
      config: Record<string, unknown>;
    }> = [
      {
        jobType: 'apotheosis_nightly',
        name: 'Apotheosis Nightly Red-Teaming',
        description: 'Automated adversarial scenario testing every night at 2 AM',
        cronExpression: '0 2 * * *', // 2 AM daily
        config: { scenarios: ['black_swan', 'regulatory', 'competitive', 'financial'] },
      },
      {
        jobType: 'dissent_deadline',
        name: 'Dissent Deadline Enforcement',
        description: 'Check and enforce dissent response deadlines',
        cronExpression: '0 9 * * *', // 9 AM daily
        config: {},
      },
      {
        jobType: 'compliance_check',
        name: 'Daily Compliance Check',
        description: 'Automated compliance violation detection',
        cronExpression: '0 6 * * *', // 6 AM daily
        config: {},
      },
      {
        jobType: 'runtime_health',
        name: 'Runtime Health Check',
        description: 'Hourly runtime security health monitoring',
        cronExpression: '0 * * * *', // Every hour
        config: {},
      },
      {
        jobType: 'analytics_aggregation',
        name: 'Daily Analytics Aggregation',
        description: 'Aggregate platform metrics for reporting',
        cronExpression: '30 0 * * *', // 12:30 AM daily
        config: {},
      },
    ];
    
    for (const jobDef of defaultJobs) {
      // Check if job already exists
      const existingJob = Array.from(this.jobs.values()).find(
        j => j.jobType === jobDef.jobType && j.organizationId === defaultOrg.id
      );
      
      if (!existingJob) {
        await this.createJob({
          organizationId: defaultOrg.id,
          jobType: jobDef.jobType,
          name: jobDef.name,
          description: jobDef.description,
          cronExpression: jobDef.cronExpression,
          config: jobDef.config,
          createdBy: 'system',
          enabled: true,
        });
      }
    }
  }
  
  // ===========================================================================
  // STATUS
  // ===========================================================================
  
  getStatus(): {
    running: boolean;
    jobs: number;
    enabledJobs: number;
    runningJobs: number;
    recentExecutions: number;
  } {
    const jobs = Array.from(this.jobs.values());
    
    return {
      running: this.isRunning,
      jobs: jobs.length,
      enabledJobs: jobs.filter(j => j.enabled).length,
      runningJobs: jobs.filter(j => j.status === 'running').length,
      recentExecutions: this.executions.size,
    };
  }
  
  getExecutions(jobId?: string, limit = 100): JobExecution[] {
    let executions = Array.from(this.executions.values());
    
    if (jobId) {
      executions = executions.filter(e => e.jobId === jobId);
    }
    
    return executions
      .sort((a, b) => b.startedAt.getTime() - a.startedAt.getTime())
      .slice(0, limit);
  }
}

// Singleton
export const enterpriseSchedulerService = new EnterpriseSchedulerService();
