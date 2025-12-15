/**
 * Batch Processing Queue Service for Datacendia
 * 
 * Dedicated queue for heavy operations (document processing, graph rebuilds)
 * separate from real-time deliberation requests.
 */

import crypto from 'crypto';
import { EventEmitter } from 'events';

export type JobType =
  | 'document_processing'
  | 'graph_rebuild'
  | 'vector_indexing'
  | 'report_generation'
  | 'data_export'
  | 'compliance_scan'
  | 'backup'
  | 'analytics_aggregation';

export type JobStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export type JobPriority = 'low' | 'normal' | 'high' | 'critical';

export interface Job<T = unknown> {
  id: string;
  type: JobType;
  priority: JobPriority;
  status: JobStatus;
  data: T;
  result?: unknown;
  error?: string;
  progress: number;
  attempts: number;
  maxAttempts: number;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  organizationId: string;
  userId?: string;
  metadata?: Record<string, unknown>;
}

interface JobHandler<T = unknown> {
  (job: Job<T>, updateProgress: (progress: number) => void): Promise<unknown>;
}

class QueueService extends EventEmitter {
  private queues: Map<JobType, Job[]> = new Map();
  private handlers: Map<JobType, JobHandler> = new Map();
  private processing: Map<string, Job> = new Map();
  private completed: Job[] = [];
  private maxConcurrent: Record<JobPriority, number> = {
    low: 2,
    normal: 5,
    high: 10,
    critical: 20,
  };
  private isProcessing = false;

  constructor() {
    super();
    // Initialize queues for each job type
    const jobTypes: JobType[] = [
      'document_processing',
      'graph_rebuild',
      'vector_indexing',
      'report_generation',
      'data_export',
      'compliance_scan',
      'backup',
      'analytics_aggregation',
    ];
    
    for (const type of jobTypes) {
      this.queues.set(type, []);
    }

    // Start processing loop
    this.startProcessingLoop();
  }

  /**
   * Register a handler for a job type
   */
  registerHandler<T>(type: JobType, handler: JobHandler<T>): void {
    this.handlers.set(type, handler as JobHandler);
    console.log(`[Queue] Registered handler for ${type}`);
  }

  /**
   * Add a job to the queue
   */
  async enqueue<T>(
    type: JobType,
    data: T,
    options: {
      priority?: JobPriority;
      organizationId: string;
      userId?: string;
      maxAttempts?: number;
      metadata?: Record<string, unknown>;
    }
  ): Promise<Job<T>> {
    const job: Job<T> = {
      id: `job_${crypto.randomUUID()}`,
      type,
      priority: options.priority || 'normal',
      status: 'pending',
      data,
      progress: 0,
      attempts: 0,
      maxAttempts: options.maxAttempts || 3,
      createdAt: new Date(),
      organizationId: options.organizationId,
      userId: options.userId,
      metadata: options.metadata,
    };

    const queue = this.queues.get(type) || [];
    
    // Insert by priority
    const priorityOrder: JobPriority[] = ['critical', 'high', 'normal', 'low'];
    const jobPriorityIndex = priorityOrder.indexOf(job.priority);
    let insertIndex = queue.length;
    
    for (let i = 0; i < queue.length; i++) {
      const queuedPriorityIndex = priorityOrder.indexOf(queue[i].priority);
      if (jobPriorityIndex < queuedPriorityIndex) {
        insertIndex = i;
        break;
      }
    }
    
    queue.splice(insertIndex, 0, job);
    this.queues.set(type, queue);

    console.log(`[Queue] Enqueued ${type} job ${job.id} with priority ${job.priority}`);
    this.emit('job:enqueued', job);

    return job;
  }

  /**
   * Get job by ID
   */
  getJob(jobId: string): Job | undefined {
    // Check processing jobs
    if (this.processing.has(jobId)) {
      return this.processing.get(jobId);
    }

    // Check queued jobs
    for (const queue of this.queues.values()) {
      const job = queue.find(j => j.id === jobId);
      if (job) return job;
    }

    // Check completed jobs
    return this.completed.find(j => j.id === jobId);
  }

  /**
   * Get all jobs for an organization
   */
  getOrganizationJobs(organizationId: string, status?: JobStatus): Job[] {
    const jobs: Job[] = [];

    // Collect from all sources
    for (const queue of this.queues.values()) {
      jobs.push(...queue.filter(j => j.organizationId === organizationId));
    }
    jobs.push(...Array.from(this.processing.values()).filter(j => j.organizationId === organizationId));
    jobs.push(...this.completed.filter(j => j.organizationId === organizationId));

    // Filter by status if provided
    if (status) {
      return jobs.filter(j => j.status === status);
    }

    return jobs.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  /**
   * Cancel a pending job
   */
  async cancelJob(jobId: string): Promise<boolean> {
    for (const [type, queue] of this.queues.entries()) {
      const index = queue.findIndex(j => j.id === jobId);
      if (index !== -1) {
        const job = queue[index];
        job.status = 'cancelled';
        job.completedAt = new Date();
        queue.splice(index, 1);
        this.completed.push(job);
        this.emit('job:cancelled', job);
        console.log(`[Queue] Cancelled job ${jobId}`);
        return true;
      }
    }
    return false;
  }

  /**
   * Get queue statistics
   */
  getStats(): {
    queued: number;
    processing: number;
    completed: number;
    failed: number;
    byType: Record<JobType, { queued: number; processing: number }>;
  } {
    const stats = {
      queued: 0,
      processing: this.processing.size,
      completed: this.completed.filter(j => j.status === 'completed').length,
      failed: this.completed.filter(j => j.status === 'failed').length,
      byType: {} as Record<JobType, { queued: number; processing: number }>,
    };

    for (const [type, queue] of this.queues.entries()) {
      const processingCount = Array.from(this.processing.values())
        .filter(j => j.type === type).length;
      
      stats.queued += queue.length;
      stats.byType[type] = {
        queued: queue.length,
        processing: processingCount,
      };
    }

    return stats;
  }

  /**
   * Start the processing loop
   */
  private startProcessingLoop(): void {
    setInterval(() => {
      this.processNextJobs();
    }, 1000); // Check every second
  }

  /**
   * Process next available jobs
   */
  private async processNextJobs(): Promise<void> {
    if (this.isProcessing) return;
    this.isProcessing = true;

    try {
      // Calculate available slots per priority
      const currentCounts: Record<JobPriority, number> = {
        low: 0,
        normal: 0,
        high: 0,
        critical: 0,
      };

      for (const job of this.processing.values()) {
        currentCounts[job.priority]++;
      }

      // Process jobs from each queue
      for (const [type, queue] of this.queues.entries()) {
        const handler = this.handlers.get(type);
        if (!handler) continue;

        const pendingJobs = queue.filter(j => j.status === 'pending');
        
        for (const job of pendingJobs) {
          if (currentCounts[job.priority] >= this.maxConcurrent[job.priority]) {
            continue;
          }

          // Move to processing
          const index = queue.indexOf(job);
          if (index !== -1) {
            queue.splice(index, 1);
          }

          job.status = 'processing';
          job.startedAt = new Date();
          job.attempts++;
          this.processing.set(job.id, job);
          currentCounts[job.priority]++;

          this.emit('job:started', job);
          console.log(`[Queue] Processing ${type} job ${job.id} (attempt ${job.attempts})`);

          // Process async
          this.executeJob(job, handler);
        }
      }
    } finally {
      this.isProcessing = false;
    }
  }

  /**
   * Execute a job with the registered handler
   */
  private async executeJob(job: Job, handler: JobHandler): Promise<void> {
    const updateProgress = (progress: number) => {
      job.progress = Math.min(100, Math.max(0, progress));
      this.emit('job:progress', job);
    };

    try {
      const result = await handler(job, updateProgress);
      
      job.status = 'completed';
      job.result = result;
      job.progress = 100;
      job.completedAt = new Date();
      
      console.log(`[Queue] Completed job ${job.id}`);
      this.emit('job:completed', job);
    } catch (error) {
      console.error(`[Queue] Job ${job.id} failed:`, error);
      
      job.error = error instanceof Error ? error.message : String(error);
      
      if (job.attempts < job.maxAttempts) {
        // Re-queue for retry
        job.status = 'pending';
        job.progress = 0;
        const queue = this.queues.get(job.type) || [];
        queue.unshift(job); // Add to front of queue
        this.queues.set(job.type, queue);
        
        console.log(`[Queue] Requeued job ${job.id} for retry`);
        this.emit('job:retry', job);
      } else {
        job.status = 'failed';
        job.completedAt = new Date();
        
        this.emit('job:failed', job);
      }
    } finally {
      this.processing.delete(job.id);
      
      if (job.status === 'completed' || job.status === 'failed') {
        this.completed.push(job);
        
        // Keep only last 1000 completed jobs
        if (this.completed.length > 1000) {
          this.completed = this.completed.slice(-1000);
        }
      }
    }
  }
}

// Singleton instance
export const queueService = new QueueService();

// Register default handlers
queueService.registerHandler('document_processing', async (job, updateProgress) => {
  console.log(`[DocumentProcessor] Processing document for org ${job.organizationId}`);
  updateProgress(10);
  
  // Simulate document processing
  await new Promise(resolve => setTimeout(resolve, 2000));
  updateProgress(50);
  
  await new Promise(resolve => setTimeout(resolve, 2000));
  updateProgress(90);
  
  return { processed: true, pages: 10 };
});

queueService.registerHandler('graph_rebuild', async (job, updateProgress) => {
  console.log(`[GraphRebuilder] Rebuilding graph for org ${job.organizationId}`);
  
  for (let i = 0; i <= 100; i += 10) {
    updateProgress(i);
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  
  return { entities: 1500, relationships: 4800 };
});

queueService.registerHandler('report_generation', async (job, updateProgress) => {
  console.log(`[ReportGenerator] Generating report for org ${job.organizationId}`);
  updateProgress(25);
  
  await new Promise(resolve => setTimeout(resolve, 3000));
  updateProgress(75);
  
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return { reportId: `report_${Date.now()}`, format: 'pdf' };
});

export default queueService;
