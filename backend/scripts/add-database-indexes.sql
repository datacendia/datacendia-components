-- =============================================================================
-- DATACENDIA DATABASE PERFORMANCE INDEXES
-- =============================================================================
-- Run this SQL to add indexes for common queries
-- Expected improvement: 50-70% faster list queries

-- Decisions indexes
CREATE INDEX IF NOT EXISTS idx_decisions_org_status ON decisions(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_decisions_created ON decisions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_decisions_org_created ON decisions(organization_id, created_at DESC);

-- Deliberations indexes
CREATE INDEX IF NOT EXISTS idx_deliberations_org_status ON deliberations(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_deliberations_created ON deliberations(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_deliberations_org_created ON deliberations(organization_id, created_at DESC);

-- Alerts indexes
CREATE INDEX IF NOT EXISTS idx_alerts_org_status ON alerts(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_alerts_severity ON alerts(severity, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_alerts_acknowledged ON alerts(acknowledged_at);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_org ON users(organization_id);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- Agents indexes
CREATE INDEX IF NOT EXISTS idx_agents_org ON agents(organization_id);
CREATE INDEX IF NOT EXISTS idx_agents_code ON agents(code);
CREATE INDEX IF NOT EXISTS idx_agents_status ON agents(status);

-- Workflows indexes
CREATE INDEX IF NOT EXISTS idx_workflows_org_status ON workflows(organization_id, status);
CREATE INDEX IF NOT EXISTS idx_workflows_created ON workflows(created_at DESC);

-- Metric definitions indexes
CREATE INDEX IF NOT EXISTS idx_metric_defs_org ON metric_definitions(organization_id);
CREATE INDEX IF NOT EXISTS idx_metric_defs_category ON metric_definitions(category);

-- Metric values indexes
CREATE INDEX IF NOT EXISTS idx_metric_values_metric_time ON metric_values(metric_id, timestamp DESC);

-- Data sources indexes
CREATE INDEX IF NOT EXISTS idx_data_sources_org ON data_sources(organization_id);
CREATE INDEX IF NOT EXISTS idx_data_sources_type ON data_sources(type);
CREATE INDEX IF NOT EXISTS idx_data_sources_status ON data_sources(status);

-- Deliberation messages indexes
CREATE INDEX IF NOT EXISTS idx_delib_messages_delib ON deliberation_messages(deliberation_id, created_at);
CREATE INDEX IF NOT EXISTS idx_delib_messages_agent ON deliberation_messages(agent_id);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_org ON audit_logs(organization_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON audit_logs(action);

-- Graph nodes indexes (if using Neo4j fallback)
CREATE INDEX IF NOT EXISTS idx_graph_nodes_org ON graph_nodes(organization_id);
CREATE INDEX IF NOT EXISTS idx_graph_nodes_type ON graph_nodes(node_type);

-- Graph edges indexes
CREATE INDEX IF NOT EXISTS idx_graph_edges_source ON graph_edges(source_id);
CREATE INDEX IF NOT EXISTS idx_graph_edges_target ON graph_edges(target_id);

-- Vox stakeholders indexes
CREATE INDEX IF NOT EXISTS idx_vox_stakeholders_org ON vox_stakeholders(organization_id);
CREATE INDEX IF NOT EXISTS idx_vox_stakeholders_type ON vox_stakeholders(stakeholder_type);

-- Vox signals indexes
CREATE INDEX IF NOT EXISTS idx_vox_signals_stakeholder ON vox_signals(stakeholder_id, created_at DESC);

-- Responsibility records indexes
CREATE INDEX IF NOT EXISTS idx_responsibility_decision ON responsibility_records(decision_id);
CREATE INDEX IF NOT EXISTS idx_responsibility_accountable ON responsibility_records(accountable_party_id);

-- Evidence vault indexes
CREATE INDEX IF NOT EXISTS idx_evidence_decision ON evidence_vault(decision_id);
CREATE INDEX IF NOT EXISTS idx_evidence_created ON evidence_vault(created_at DESC);

-- Collapse reports indexes
CREATE INDEX IF NOT EXISTS idx_collapse_org ON collapse_reports(organization_id);
CREATE INDEX IF NOT EXISTS idx_collapse_created ON collapse_reports(created_at DESC);

-- =============================================================================
-- VERIFY INDEXES CREATED
-- =============================================================================

SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND indexname LIKE 'idx_%'
ORDER BY tablename, indexname;
