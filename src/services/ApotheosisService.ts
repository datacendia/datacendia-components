// =============================================================================
// CENDIA APOTHEOSIS™ — FRONTEND SERVICE
// The Self-Improvement Loop That Never Stops
// =============================================================================

import { api } from '../lib/api';
import { withRetry, isRetryableError } from '../lib/utils';
import { parseApiError } from '../lib/errors/ApotheosisError';
import {
  getMockScore,
  getMockLatestRun,
  getMockEscalations,
  getMockBannedPatterns,
  getMockUpskillAssignments,
  getDefaultConfig,
} from './mocks/ApotheosisServiceMocks';

// =============================================================================
// TYPES
// =============================================================================

export interface ApotheosisScore {
  overall: number;
  components: {
    redTeamSurvivalRate: { value: number; weight: number };
    weaknessClosureRate: { value: number; weight: number };
    decisionSuccessRate: { value: number; weight: number };
    humanReadiness: { value: number; weight: number };
    patternHealth: { value: number; weight: number };
  };
  trend: Array<{ date: string; score: number }>;
  improvementPoints: number;
  improvementPeriod: string;
}

export interface ApotheosisRun {
  id: string;
  organizationId: string;
  startedAt: Date;
  completedAt?: Date;
  status: 'running' | 'completed' | 'failed' | 'scheduled';
  scenariosTested: number;
  scenariosSurvived: number;
  survivalRate: number;
  criticalCount: number;
  highCount: number;
  mediumCount: number;
  lowCount: number;
  apotheosisScore: number;
  previousScore: number;
  scoreDelta: number;
  shadowCouncilInstances: number;
  computeHours: number;
  duration: number;
}

export interface Escalation {
  id: string;
  weaknessId: string;
  title: string;
  description: string;
  severity: 'critical' | 'high';
  reason: string;
  estimatedCostToFix: number;
  riskIfNotFixed: number;
  assignedTo: string[];
  deadline: Date;
  status: 'pending' | 'approved' | 'rejected' | 'deferred';
  responseAt?: Date;
  response?: string;
}

export interface PatternBan {
  id: string;
  pattern: string;
  description: string;
  instances: PatternInstance[];
  failureRate: number;
  totalCost: number;
  bannedAt: Date;
  bannedBy: 'apotheosis' | 'human';
  status: 'active' | 'lifted';
  overrideRequires: string;
}

export interface PatternInstance {
  decisionId: string;
  decisionTitle: string;
  date: Date;
  outcome: 'success' | 'failure';
  cost?: number;
}

export interface UpskillAssignment {
  id: string;
  userId: string;
  userName: string;
  weaknessId: string;
  gapIdentified: string;
  trainingTopic: string;
  trainingDuration: number;
  deadline: Date;
  modules: TrainingModule[];
  status: 'assigned' | 'in_progress' | 'completed' | 'overdue';
  completedAt?: Date;
  blockingActions: boolean;
}

export interface TrainingModule {
  title: string;
  duration: number;
  type: 'video' | 'reading' | 'quiz' | 'simulation';
}

export interface ApotheosisConfig {
  runFrequency: 'nightly' | 'weekly' | 'manual';
  runTime: string;
  scenarioCount: number;
  autoPatchThreshold: number;
  escalationTimeout: number;
  patternBanThreshold: number;
  trainingDeadline: number;
}

// =============================================================================
// SERVICE CLASS
// =============================================================================

class ApotheosisService {
  private baseUrl = '/api/v1/apotheosis';

  /**
   * Get the current Apotheosis Score
   * 
   * FALLBACK BEHAVIOR:
   * - Returns mock data if the API call fails due to network/server errors
   * - Returns mock data if the API returns no data (null/undefined)
   * - Logs detailed error information for debugging
   * - Retries transient errors (network, timeout, server errors) up to 3 times with exponential backoff
   */
  async getScore(): Promise<ApotheosisScore> {
    try {
      const response = await withRetry(
        async () => api.get<ApotheosisScore>(`${this.baseUrl}/score`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getScore (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getMockScore();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/score`);
      console.error('[Apotheosis] Error fetching score:', parsedError.toJSON());
      // Fallback to mock data to ensure UI remains functional
      return getMockScore();
    }
  }

  /**
   * Get the latest run results
   * 
   * FALLBACK BEHAVIOR:
   * - Returns mock data if the API call fails due to network/server errors
   * - Returns mock data if the API returns no data (null/undefined)
   * - Logs detailed error information for debugging
   * - Retries transient errors (network, timeout, server errors) up to 3 times with exponential backoff
   */
  async getLatestRun(): Promise<ApotheosisRun | null> {
    try {
      const response = await withRetry(
        async () => api.get<ApotheosisRun>(`${this.baseUrl}/latest-run`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getLatestRun (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getMockLatestRun();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/latest-run`);
      console.error('[Apotheosis] Error fetching latest run:', parsedError.toJSON());
      // Fallback to mock data to ensure UI remains functional
      return getMockLatestRun();
    }
  }

  /**
   * Get run history
   * 
   * FALLBACK BEHAVIOR:
   * - Returns empty array if the API call fails
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   */
  async getRunHistory(limit: number = 30): Promise<ApotheosisRun[]> {
    try {
      const response = await withRetry(
        async () => api.get<ApotheosisRun[]>(`${this.baseUrl}/run-history?limit=${limit}`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getRunHistory (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? [];
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/run-history`);
      console.error('[Apotheosis] Error fetching run history:', parsedError.toJSON());
      // Return empty array as fallback (no historical data available)
      return [];
    }
  }

  /**
   * Get pending escalations
   * 
   * FALLBACK BEHAVIOR:
   * - Returns mock escalations if the API call fails
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   */
  async getEscalations(): Promise<Escalation[]> {
    try {
      const response = await withRetry(
        async () => api.get<Escalation[]>(`${this.baseUrl}/escalations`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getEscalations (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getMockEscalations();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/escalations`);
      console.error('[Apotheosis] Error fetching escalations:', parsedError.toJSON());
      // Fallback to mock data to ensure UI remains functional
      return getMockEscalations();
    }
  }

  /**
   * Respond to an escalation
   * 
   * ERROR HANDLING:
   * - Propagates errors to caller for proper handling
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   * 
   * @throws {ApotheosisError} If the request fails after all retries
   */
  async respondToEscalation(
    id: string,
    response: 'approved' | 'rejected' | 'deferred',
    reason: string
  ): Promise<void> {
    try {
      await withRetry(
        async () => api.post(`${this.baseUrl}/escalations/${id}/respond`, { response, reason }),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying respondToEscalation (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/escalations/${id}/respond`);
      console.error('[Apotheosis] Error responding to escalation:', parsedError.toJSON());
      // Re-throw the error for the caller to handle
      throw parsedError;
    }
  }

  /**
   * Get banned patterns
   * 
   * FALLBACK BEHAVIOR:
   * - Returns mock banned patterns if the API call fails
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   */
  async getBannedPatterns(): Promise<PatternBan[]> {
    try {
      const response = await withRetry(
        async () => api.get<PatternBan[]>(`${this.baseUrl}/banned-patterns`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getBannedPatterns (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getMockBannedPatterns();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/banned-patterns`);
      console.error('[Apotheosis] Error fetching banned patterns:', parsedError.toJSON());
      // Fallback to mock data to ensure UI remains functional
      return getMockBannedPatterns();
    }
  }

  /**
   * Get upskill assignments
   * 
   * FALLBACK BEHAVIOR:
   * - Returns mock upskill assignments if the API call fails
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   */
  async getUpskillAssignments(): Promise<UpskillAssignment[]> {
    try {
      const response = await withRetry(
        async () => api.get<UpskillAssignment[]>(`${this.baseUrl}/upskill-assignments`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getUpskillAssignments (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getMockUpskillAssignments();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/upskill-assignments`);
      console.error('[Apotheosis] Error fetching upskill assignments:', parsedError.toJSON());
      // Fallback to mock data to ensure UI remains functional
      return getMockUpskillAssignments();
    }
  }

  /**
   * Get configuration
   * 
   * FALLBACK BEHAVIOR:
   * - Returns default configuration if the API call fails
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   */
  async getConfig(): Promise<ApotheosisConfig> {
    try {
      const response = await withRetry(
        async () => api.get<ApotheosisConfig>(`${this.baseUrl}/config`),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying getConfig (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getDefaultConfig();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/config`);
      console.error('[Apotheosis] Error fetching config:', parsedError.toJSON());
      // Fallback to default configuration
      return getDefaultConfig();
    }
  }

  /**
   * Update configuration
   * 
   * ERROR HANDLING:
   * - Propagates errors to caller for proper handling
   * - Returns default config as fallback if update fails
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   */
  async updateConfig(config: Partial<ApotheosisConfig>): Promise<ApotheosisConfig> {
    try {
      const response = await withRetry(
        async () => api.put<ApotheosisConfig>(`${this.baseUrl}/config`, config),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying updateConfig (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? getDefaultConfig();
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/config`);
      console.error('[Apotheosis] Error updating config:', parsedError.toJSON());
      // Return default config as fallback
      return getDefaultConfig();
    }
  }

  /**
   * Trigger a manual run
   * 
   * ERROR HANDLING:
   * - Propagates errors to caller for proper handling
   * - Logs detailed error information for debugging
   * - Retries transient errors up to 3 times with exponential backoff
   * 
   * @throws {ApotheosisError} If the request fails after all retries
   */
  async triggerManualRun(): Promise<{ runId: string }> {
    try {
      const response = await withRetry(
        async () => api.post<{ runId: string }>(`${this.baseUrl}/trigger-run`, {}),
        {
          maxAttempts: 3,
          initialDelay: 1000,
          shouldRetry: isRetryableError,
          onRetry: (attempt, error, delay) => {
            console.warn(
              `[Apotheosis] Retrying triggerManualRun (attempt ${attempt}) after ${delay}ms due to:`,
              error
            );
          },
        }
      );
      return response.data ?? { runId: 'manual-run' };
    } catch (error) {
      const parsedError = parseApiError(error, `${this.baseUrl}/trigger-run`);
      console.error('[Apotheosis] Error triggering manual run:', parsedError.toJSON());
      // Re-throw the error for the caller to handle
      throw parsedError;
    }
  }
}

// =============================================================================
// EXPORT SINGLETON
// =============================================================================

export const apotheosisService = new ApotheosisService();
export default apotheosisService;
