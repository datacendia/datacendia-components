/**
 * Datacendia API - Main Export
 * Unified API client for all Datacendia services
 */

import { api, tokenManager, onAuthChange } from './client';
import type * as Types from './types';

// Re-export types
export * from './types';
export { api, tokenManager, onAuthChange };

// ============================================================================
// AUTH API
// ============================================================================
export const authApi = {
  async login(credentials: Types.LoginRequest) {
    const response = await api.post<Types.LoginResponse>('/auth/login', credentials);
    if (response.success && response.data) {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      });
    }
    return response;
  },

  async register(data: Types.RegisterRequest) {
    const response = await api.post<Types.LoginResponse>('/auth/register', data);
    if (response.success && response.data) {
      tokenManager.setTokens({
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken,
        expiresIn: response.data.expiresIn,
      });
    }
    return response;
  },

  async logout() {
    await api.post('/auth/logout');
    tokenManager.clearTokens();
  },

  async getCurrentUser() {
    return api.get<Types.User>('/auth/me');
  },

  isAuthenticated: () => tokenManager.isAuthenticated(),
};

// ============================================================================
// GRAPH API
// ============================================================================
export const graphApi = {
  async getEntities(params?: { type?: string; search?: string; page?: number; pageSize?: number }) {
    return api.get<Types.GraphEntity[]>('/graph/entities', params);
  },

  async getEntity(id: string) {
    return api.get<Types.GraphEntity>(`/graph/entities/${id}`);
  },

  async createEntity(data: { type: string; name: string; properties?: Record<string, unknown> }) {
    return api.post<Types.GraphEntity>('/graph/entities', data);
  },

  async updateEntity(id: string, data: { name?: string; properties?: Record<string, unknown> }) {
    return api.put<Types.GraphEntity>(`/graph/entities/${id}`, data);
  },

  async deleteEntity(id: string) {
    return api.delete(`/graph/entities/${id}`);
  },

  async getNeighbors(id: string, params?: { direction?: 'incoming' | 'outgoing' | 'both'; depth?: number }) {
    return api.get<Types.GraphEntity[]>(`/graph/entities/${id}/neighbors`, params);
  },

  async createRelationship(data: { sourceId: string; targetId: string; type: string; properties?: Record<string, unknown> }) {
    return api.post<Types.GraphRelationship>('/graph/relationships', data);
  },

  async search(query: string) {
    return api.get<Types.GraphEntity[]>('/graph/search', { q: query });
  },

  async executeQuery(cypher: string, parameters?: Record<string, unknown>) {
    return api.post<unknown>('/graph/query', { query: cypher, parameters });
  },

  /**
   * Get real-time knowledge graph statistics from Neo4j
   */
  async getStats() {
    return api.get<{
      entities: number;
      relationships: number;
      dataPoints: number;
      freshness: number;
      labels: string[];
      entityTypes: Array<{ type: string; count: number }>;
      timestamp: string;
    }>('/graph/stats');
  },
};

// ============================================================================
// LINEAGE API
// ============================================================================
export const lineageApi = {
  async getLineage(entityId: string, params?: { direction?: 'upstream' | 'downstream' | 'both'; depth?: number }) {
    return api.get<Types.LineageResult>(`/lineage/${entityId}`, params);
  },

  async getImpact(entityId: string) {
    return api.get<Types.ImpactAnalysis>(`/lineage/${entityId}/impact`);
  },

  async getTransformations(entityId: string) {
    return api.get<{ entityId: string; transformations: unknown[]; totalTransformations: number }>(`/lineage/${entityId}/transformations`);
  },

  async getQuality(entityId: string) {
    return api.get<{ entityId: string; overallScore: number; dimensions: Record<string, number>; issues: unknown[] }>(`/lineage/${entityId}/quality`);
  },
};

// ============================================================================
// COUNCIL API (AI Agents)
// ============================================================================
export const councilApi = {
  async getAgents() {
    return api.get<Types.Agent[]>('/council/agents');
  },

  async getAgentStatus(agentId: string) {
    return api.get<{ status: 'online' | 'offline' | 'busy' }>(`/council/agents/${agentId}/status`);
  },

  async submitQuery(data: { query: string; agents?: string[]; context?: Record<string, unknown>; language?: string }) {
    return api.post<Types.CouncilQuery>('/council/query', data);
  },

  async startDeliberation(data: { question: string; agents: string[]; config?: { maxDuration?: number; requireConsensus?: boolean }; language?: string }) {
    return api.post<Types.Deliberation>('/council/deliberations', data);
  },

  async getDeliberation(id: string) {
    return api.get<Types.Deliberation>(`/council/deliberations/${id}`);
  },

  async getDeliberationTranscript(id: string) {
    return api.get<{ phases: Array<{ phase: string; messages: Types.DeliberationMessage[] }> }>(`/council/deliberations/${id}/transcript`);
  },

  async controlDeliberation(id: string, action: 'pause' | 'resume' | 'skip_to_synthesis' | 'cancel') {
    return api.post(`/council/deliberations/${id}/control`, { action });
  },

  async getActiveDeliberations() {
    return api.get<Types.Deliberation[]>('/council/deliberations/active');
  },

  async getRecentDecisions(limit?: number) {
    return api.get<Types.CouncilQuery[]>('/council/decisions/recent', limit ? { limit } : undefined);
  },

  async addUserIntervention(deliberationId: string, data: { 
    role: { code: string; title: string; department: string; icon: string }; 
    content: string; 
    type: string;
  }) {
    return api.post(`/council/deliberations/${deliberationId}/intervention`, data);
  },
};

// ============================================================================
// METRICS API
// ============================================================================
export const metricsApi = {
  async getMetrics(params?: { category?: string; search?: string; page?: number }) {
    return api.get<Types.MetricDefinition[]>('/metrics', params);
  },

  async getKeyMetrics() {
    return api.get<Array<Types.MetricDefinition & { currentValue: number; change: number }>>('/metrics/key');
  },

  async getMetric(id: string) {
    return api.get<Types.MetricDefinition>(`/metrics/${id}`);
  },

  async createMetric(data: Partial<Types.MetricDefinition>) {
    return api.post<Types.MetricDefinition>('/metrics', data);
  },

  async calculateMetric(id: string, params?: { startDate?: string; endDate?: string; granularity?: string }) {
    return api.get<Types.MetricCalculation>(`/metrics/${id}/calculate`, params);
  },

  async getMetricHistory(id: string, params?: { startDate?: string; endDate?: string; granularity?: string }) {
    return api.get<Types.MetricValue[]>(`/metrics/${id}/history`, params);
  },
};

// ============================================================================
// HEALTH API
// ============================================================================
export const healthApi = {
  async getScore() {
    return api.get<Types.HealthScore>('/health/score');
  },

  async getDimensions() {
    return api.get<Types.HealthScore['dimensions']>('/health/dimensions');
  },

  async getTrend(days?: number) {
    return api.get<Array<{ date: string; score: number }>>('/health/trend', days ? { days } : undefined);
  },

  async getSystemStatus() {
    return api.get<Array<{ service: string; status: string; latency?: number }>>('/health/systems/status');
  },
};

// ============================================================================
// ALERTS API
// ============================================================================
export const alertsApi = {
  async getAlerts(params?: { severity?: string; status?: string; page?: number }) {
    return api.get<Types.Alert[]>('/alerts', params);
  },

  async getSummary() {
    return api.get<Types.AlertSummary>('/alerts/summary');
  },

  async getAlert(id: string) {
    return api.get<Types.Alert>(`/alerts/${id}`);
  },

  async acknowledgeAlert(id: string, note?: string) {
    return api.post<Types.Alert>(`/alerts/${id}/acknowledge`, { note });
  },

  async resolveAlert(id: string, data: { resolution: string; rootCause?: string }) {
    return api.post<Types.Alert>(`/alerts/${id}/resolve`, data);
  },
};

// ============================================================================
// WORKFLOWS API
// ============================================================================
export const workflowsApi = {
  async getWorkflows(params?: { status?: string; category?: string; search?: string }) {
    return api.get<Types.Workflow[]>('/workflows', params);
  },

  async getWorkflow(id: string) {
    return api.get<Types.Workflow>(`/workflows/${id}`);
  },

  async createWorkflow(data: Partial<Types.Workflow>) {
    return api.post<Types.Workflow>('/workflows', data);
  },

  async updateWorkflow(id: string, data: Partial<Types.Workflow>) {
    return api.put<Types.Workflow>(`/workflows/${id}`, data);
  },

  async deleteWorkflow(id: string) {
    return api.delete(`/workflows/${id}`);
  },

  async activateWorkflow(id: string) {
    return api.post(`/workflows/${id}/activate`);
  },

  async executeWorkflow(id: string, params?: Record<string, unknown>) {
    return api.post<Types.WorkflowExecution>(`/workflows/${id}/execute`, { parameters: params });
  },

  async getExecution(executionId: string) {
    return api.get<Types.WorkflowExecution>(`/workflows/executions/${executionId}`);
  },

  async getExecutions(params?: { workflowId?: string; status?: string; page?: number }) {
    return api.get<Types.WorkflowExecution[]>('/workflows/executions', params);
  },
};

// ============================================================================
// FORECASTS API
// ============================================================================
export const forecastsApi = {
  async getForecasts(params?: { status?: string; page?: number }) {
    return api.get<Types.Forecast[]>('/predict/forecasts', params);
  },

  async getForecast(id: string) {
    return api.get<Types.Forecast>(`/predict/forecasts/${id}`);
  },

  async createForecast(data: { name: string; targetMetric: string; horizon: { value: number; unit: string }; model?: string; features?: string[] }) {
    return api.post<Types.Forecast>('/predict/forecasts', data);
  },

  async getScenarios(params?: { page?: number }) {
    return api.get<Types.Scenario[]>('/predict/scenarios', params);
  },

  async getScenario(id: string) {
    return api.get<Types.Scenario>(`/predict/scenarios/${id}`);
  },

  async createScenario(data: Partial<Types.Scenario>) {
    return api.post<Types.Scenario>('/predict/scenarios', data);
  },

  async compareScenarios(scenarioIds: string[], metrics: string[], timeRange?: { start: string; end: string }) {
    return api.post<{ scenarios: Array<{ id: string; name: string; values: Record<string, number[]> }> }>('/predict/scenarios/compare', { scenarioIds, metrics, timeRange });
  },
};

// ============================================================================
// USERS API
// ============================================================================
export const usersApi = {
  async getUsers(params?: { search?: string; role?: string; page?: number }) {
    return api.get<Types.User[]>('/users', params);
  },

  async getCurrentUser() {
    return api.get<Types.User>('/users/me');
  },

  async updateCurrentUser(data: Partial<Types.User>) {
    return api.put<Types.User>('/users/me', data);
  },

  async inviteUser(data: { email: string; role: string; teams?: string[]; message?: string }) {
    return api.post<Types.User>('/users/invite', data);
  },

  async updateUserRole(userId: string, role: string) {
    return api.put<Types.User>(`/users/${userId}/role`, { role });
  },

  async deleteUser(userId: string) {
    return api.delete(`/users/${userId}`);
  },
};

// ============================================================================
// ORGANIZATIONS API
// ============================================================================
export const organizationsApi = {
  async getCurrent() {
    return api.get<Types.Organization>('/organizations/current');
  },

  async updateCurrent(data: Partial<Types.Organization>) {
    return api.put<Types.Organization>('/organizations/current', data);
  },

  async getTeams() {
    return api.get<Array<{ id: string; name: string; memberCount: number }>>('/organizations/current/teams');
  },

  async createTeam(data: { name: string; description?: string }) {
    return api.post<{ id: string; name: string }>('/organizations/current/teams', data);
  },

  async getActivity(params?: { page?: number; limit?: number }) {
    return api.get<Array<{ id: string; action: string; user: string; timestamp: string }>>('/organizations/current/activity', params);
  },
};

// ============================================================================
// INTEGRATIONS API
// ============================================================================
export const integrationsApi = {
  async getIntegrations() {
    return api.get<{ available: Types.Integration[]; connected: Types.IntegrationConnection[] }>('/integrations');
  },

  async getIntegration(id: string) {
    return api.get<Types.Integration & { configSchema: Record<string, unknown> }>(`/integrations/${id}`);
  },

  async connect(integrationId: string, data: { name: string; config: Record<string, unknown> }) {
    return api.post<{ connectionId?: string; authUrl?: string; method?: string }>(`/integrations/${integrationId}/connect`, data);
  },

  async getConnection(connectionId: string) {
    return api.get<Types.IntegrationConnection>(`/integrations/connections/${connectionId}`);
  },

  async testConnection(connectionId: string) {
    return api.post<{ success: boolean; message: string; latency?: number }>(`/integrations/connections/${connectionId}/test`);
  },

  async syncConnection(connectionId: string) {
    return api.post<{ message: string }>(`/integrations/connections/${connectionId}/sync`);
  },

  async disconnectConnection(connectionId: string) {
    return api.delete(`/integrations/connections/${connectionId}`);
  },

  async getConnectionSchema(connectionId: string) {
    return api.get<{ objects: Array<{ name: string; type: string; fields: unknown[] }> }>(`/integrations/connections/${connectionId}/schema`);
  },
};

// ============================================================================
// MESH API (CendiaMesh™)
// ============================================================================
export const meshApi = {
  async getStats() {
    return api.get<{ total_participants: number; active_today: number; data_points_shared: number; insights_generated: number; avg_response_ms: number; privacy_score: number; uptime_percent: number }>('/mesh/stats');
  },

  async getParticipants(params?: { industry?: string; region?: string; limit?: number }) {
    return api.get<unknown[]>('/mesh/participants', params);
  },

  async getBenchmarks(params?: { industry?: string; category?: string }) {
    return api.get<unknown[]>('/mesh/benchmarks', params);
  },

  async getRiskSignals(params?: { severity?: string; category?: string; active?: boolean }) {
    return api.get<unknown[]>('/mesh/signals', params);
  },

  async createSignal(data: { title: string; description: string; category: string; severity: string; affected_industries?: string[]; affected_regions?: string[]; confidence?: number; sources?: number }) {
    return api.post<unknown>('/mesh/signals', data);
  },
};

// ============================================================================
// PERSONA API (PersonaForge™)
// ============================================================================
export const personaApi = {
  async getTwins(params?: { organization_id?: string }) {
    return api.get<unknown[]>('/persona/twins', params);
  },

  async getTwin(id: string) {
    return api.get<unknown>(`/persona/twins/${id}`);
  },

  async createTwin(data: { organization_id: string; name: string; role: string; department?: string; personality_config?: Record<string, unknown>; knowledge_domains?: string[] }) {
    return api.post<unknown>('/persona/twins', data);
  },

  async addConversation(twinId: string, data: { user_id: string; messages: unknown[]; satisfaction?: number; duration_ms?: number }) {
    return api.post<unknown>(`/persona/twins/${twinId}/conversation`, data);
  },
};

// ============================================================================
// AUTOPILOT API (CendiaAutopilot™)
// ============================================================================
export const autopilotApi = {
  async getRules(params?: { organization_id?: string; enabled?: boolean }) {
    return api.get<unknown[]>('/autopilot/rules', params);
  },

  async createRule(data: { organization_id: string; name: string; trigger_type: string; trigger_config?: Record<string, unknown>; action_type: string; action_config?: Record<string, unknown> }) {
    return api.post<unknown>('/autopilot/rules', data);
  },

  async executeRule(ruleId: string, data?: { duration_ms?: number }) {
    return api.post<unknown>(`/autopilot/rules/${ruleId}/execute`, data);
  },

  async getExecutions(params?: { rule_id?: string }) {
    return api.get<unknown[]>('/autopilot/executions', params);
  },
};

// ============================================================================
// GOVERN API (CendiaGovern™)
// ============================================================================
export const governApi = {
  async getPolicies(params?: { organization_id?: string; status?: string; category?: string }) {
    return api.get<unknown[]>('/govern/policies', params);
  },

  async createPolicy(data: { organization_id: string; name: string; description: string; category: string; rules?: unknown[]; created_by: string }) {
    return api.post<unknown>('/govern/policies', data);
  },

  async getAudits(params?: { organization_id?: string; status?: string }) {
    return api.get<unknown[]>('/govern/audits', params);
  },

  async createAudit(data: { organization_id: string; policy_id?: string; audit_type: string; findings?: unknown[]; risk_score?: number }) {
    return api.post<unknown>('/govern/audits', data);
  },
};

// ============================================================================
// DECISION INTELLIGENCE API
// ============================================================================
export const decisionIntelApi = {
  // Chronos
  async getChronosSnapshots(params?: { organization_id?: string; snapshot_type?: string }) {
    return api.get<unknown[]>('/decision-intel/chronos/snapshots', params);
  },

  async createChronosSnapshot(data: { organization_id: string; snapshot_type: string; name: string; data?: Record<string, unknown>; metrics?: Record<string, unknown>; created_by: string }) {
    return api.post<unknown>('/decision-intel/chronos/snapshots', data);
  },

  // Chronos AI - Powered by Ollama
  async detectPivotalMoments(data: { organization_id?: string; events: unknown[]; limit?: number }) {
    return api.post<unknown[]>('/decision-intel/chronos/ai/pivotal-moments', data);
  },

  async analyzeCausalChain(data: { organization_id?: string; root_event: unknown; all_events: unknown[] }) {
    return api.post<unknown[]>('/decision-intel/chronos/ai/causal-chain', data);
  },

  async generateFutureScenarios(data: { organization_id?: string; current_metrics: Record<string, number>; recent_events: unknown[]; time_horizon?: string }) {
    return api.post<unknown[]>('/decision-intel/chronos/ai/future-scenarios', data);
  },

  async getTimelineInsight(data: { organization_id?: string; start_date: string; end_date: string; events: unknown[]; metrics?: Record<string, number> }) {
    return api.post<unknown>('/decision-intel/chronos/ai/timeline-insight', data);
  },

  async analyzeWhatIf(data: { organization_id?: string; event: unknown; alternative_action: string }) {
    return api.post<unknown>('/decision-intel/chronos/ai/what-if', data);
  },

  // Ghost Board
  async getGhostBoardSessions(params?: { organization_id?: string; status?: string }) {
    return api.get<unknown[]>('/decision-intel/ghost-board/sessions', params);
  },

  async createGhostBoardSession(data: { organization_id: string; title: string; scenario: string; board_composition?: unknown[]; created_by: string }) {
    return api.post<unknown>('/decision-intel/ghost-board/sessions', data);
  },

  // Pre-Mortem
  async getPreMortemAnalyses(params?: { organization_id?: string; decision_id?: string; status?: string }) {
    return api.get<unknown[]>('/decision-intel/pre-mortem/analyses', params);
  },

  async createPreMortemAnalysis(data: { organization_id: string; decision_id?: string; title: string; failure_modes?: unknown[]; risk_factors?: unknown[]; mitigations?: unknown[]; overall_risk?: number; created_by: string }) {
    return api.post<unknown>('/decision-intel/pre-mortem/analyses', data);
  },

  // Regulatory
  async getRegulatoryItems(params?: { organization_id?: string; jurisdiction?: string; status?: string }) {
    return api.get<unknown[]>('/decision-intel/regulatory/items', params);
  },

  async createRegulatoryItem(data: { organization_id: string; regulation_id: string; title: string; description: string; jurisdiction: string; category: string; impact_level?: string; required_actions?: unknown[] }) {
    return api.post<unknown>('/decision-intel/regulatory/items', data);
  },
};

// ============================================================================
// ECHO API - Decision Outcome Engine
// ============================================================================
export const echoApi = {
  async linkOutcome(data: {
    deliberationId: string;
    actualRevenue?: number;
    actualProfit?: number;
    actualHeadcount?: number;
    actualRisk?: number;
    actualSatisfaction?: number;
    actualMarketShare?: number;
    notes?: string;
  }) {
    return api.post<unknown>('/echo/outcomes', data);
  },

  async getOutcome(deliberationId: string) {
    return api.get<unknown>(`/echo/outcomes/${deliberationId}`);
  },

  async getLeaderboard(params?: { limit?: number; period?: string; sortBy?: string }) {
    return api.get<unknown[]>('/echo/leaderboard', params);
  },

  async getAccuracyReport() {
    return api.get<unknown>('/echo/accuracy');
  },

  async getOutcomeReport(deliberationId: string) {
    return api.get<unknown>(`/echo/report/${deliberationId}`);
  },

  async getDashboard() {
    return api.get<unknown>('/echo/dashboard');
  },
};

// ============================================================================
// REDTEAM API - Adversarial Security Engine
// ============================================================================
export const redteamApi = {
  async runSimulation(options?: {
    adversaryProfile?: string;
    targetObjective?: string;
    maxIterations?: number;
  }) {
    return api.post<unknown>('/redteam/simulate', options);
  },

  async getScore() {
    return api.get<unknown>('/redteam/score');
  },

  async getWeaknessReport() {
    return api.get<unknown>('/redteam/weakness-report');
  },

  async getExploits() {
    return api.get<unknown[]>('/redteam/exploits');
  },

  async applyPatch(patchId: string) {
    return api.post<unknown>(`/redteam/patches/${patchId}/apply`, {});
  },

  async rollbackPatch(patchId: string) {
    return api.post<unknown>(`/redteam/patches/${patchId}/rollback`, {});
  },

  async getDashboard() {
    return api.get<unknown>('/redteam/dashboard');
  },

  async getEvilTwin() {
    return api.get<unknown>('/redteam/evil-twin');
  },
};

// ============================================================================
// GNOSIS API - Education Engine
// ============================================================================
export const gnosisApi = {
  async generateFromDecision(deliberationId: string) {
    return api.post<unknown>('/gnosis/generate-from-decision', { deliberationId });
  },

  async createPath(data: {
    title: string;
    description: string;
    skills: string[];
    sourceDecision?: string;
    targetRole?: string;
    urgency?: string;
  }) {
    return api.post<unknown>('/gnosis/paths', data);
  },

  async getPath(pathId: string) {
    return api.get<unknown>(`/gnosis/paths/${pathId}`);
  },

  async updateProgress(pathId: string, moduleId: string, completed: boolean, score?: number) {
    return api.put<unknown>(`/gnosis/paths/${pathId}/progress`, { moduleId, completed, score });
  },

  async getProfile() {
    return api.get<unknown>('/gnosis/profile');
  },

  async getAnalytics() {
    return api.get<unknown>('/gnosis/analytics');
  },

  async startAssessment(skill: string) {
    return api.post<unknown>('/gnosis/assessments', { skill });
  },

  async submitAssessment(assessmentId: string, answers: Record<string, string>) {
    return api.post<unknown>(`/gnosis/assessments/${assessmentId}/submit`, { answers });
  },

  async getDashboard() {
    return api.get<unknown>('/gnosis/dashboard');
  },

  async getDecisionReadiness() {
    return api.get<unknown>('/gnosis/decision-readiness');
  },
};

// Default export with all APIs
export default {
  auth: authApi,
  graph: graphApi,
  lineage: lineageApi,
  council: councilApi,
  metrics: metricsApi,
  health: healthApi,
  alerts: alertsApi,
  workflows: workflowsApi,
  forecasts: forecastsApi,
  users: usersApi,
  organizations: organizationsApi,
  integrations: integrationsApi,
  mesh: meshApi,
  persona: personaApi,
  autopilot: autopilotApi,
  govern: governApi,
  decisionIntel: decisionIntelApi,
  echo: echoApi,
  redteam: redteamApi,
  gnosis: gnosisApi,
};
