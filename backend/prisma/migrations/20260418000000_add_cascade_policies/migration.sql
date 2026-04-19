
-- DropForeignKey
ALTER TABLE "teams" DROP CONSTRAINT "teams_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "agent_query_responses" DROP CONSTRAINT "agent_query_responses_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "council_queries" DROP CONSTRAINT "council_queries_user_id_fkey";

-- DropForeignKey
ALTER TABLE "deliberation_messages" DROP CONSTRAINT "deliberation_messages_agent_id_fkey";

-- DropForeignKey
ALTER TABLE "deliberations" DROP CONSTRAINT "deliberations_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "executive_summaries" DROP CONSTRAINT "executive_summaries_decision_id_fkey";

-- DropForeignKey
ALTER TABLE "executive_summaries" DROP CONSTRAINT "executive_summaries_deliberation_id_fkey";

-- DropForeignKey
ALTER TABLE "decision_outcomes" DROP CONSTRAINT "decision_outcomes_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "decision_outcomes" DROP CONSTRAINT "decision_outcomes_deliberation_id_fkey";

-- DropForeignKey
ALTER TABLE "dissents" DROP CONSTRAINT "dissents_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "alerts" DROP CONSTRAINT "alerts_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "data_sources" DROP CONSTRAINT "data_sources_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "metric_definitions" DROP CONSTRAINT "metric_definitions_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "dcii_iiss_scores" DROP CONSTRAINT "dcii_iiss_scores_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "dcii_media_assets" DROP CONSTRAINT "dcii_media_assets_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "dcii_jurisdiction_assessments" DROP CONSTRAINT "dcii_jurisdiction_assessments_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "dcii_timestamp_tokens" DROP CONSTRAINT "dcii_timestamp_tokens_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "evidence_vault_packets" DROP CONSTRAINT "evidence_vault_packets_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "dcii_similarity_decisions" DROP CONSTRAINT "dcii_similarity_decisions_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "enterprise_scheduled_jobs" DROP CONSTRAINT "enterprise_scheduled_jobs_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "gateway_federation_members" DROP CONSTRAINT "gateway_federation_members_federation_id_fkey";

-- DropForeignKey
ALTER TABLE "gateway_federation_policies" DROP CONSTRAINT "gateway_federation_policies_federation_id_fkey";

-- DropForeignKey
ALTER TABLE "gateway_federation_reports" DROP CONSTRAINT "gateway_federation_reports_federation_id_fkey";

-- DropForeignKey
ALTER TABLE "gateway_interactions" DROP CONSTRAINT "gateway_interactions_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "approvals" DROP CONSTRAINT "approval_execution_fkey";

-- DropForeignKey
ALTER TABLE "approvals" DROP CONSTRAINT "approvals_reference_id_fkey";

-- DropForeignKey
ALTER TABLE "panopticon_regulations" DROP CONSTRAINT "panopticon_regulations_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "panopticon_violations" DROP CONSTRAINT "panopticon_violations_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "panopticon_violations" DROP CONSTRAINT "panopticon_violations_regulation_id_fkey";

-- DropForeignKey
ALTER TABLE "panopticon_forecasts" DROP CONSTRAINT "panopticon_forecasts_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "constitutional_opinions" DROP CONSTRAINT "constitutional_opinions_dispute_id_fkey";

-- DropForeignKey
ALTER TABLE "redteam_vulnerabilities" DROP CONSTRAINT "redteam_vulnerabilities_simulation_id_fkey";

-- DropForeignKey
ALTER TABLE "redteam_patches" DROP CONSTRAINT "redteam_patches_vulnerability_id_fkey";

-- DropForeignKey
ALTER TABLE "apotheosis_runs" DROP CONSTRAINT "apotheosis_runs_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "apotheosis_pattern_bans" DROP CONSTRAINT "apotheosis_pattern_bans_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "apotheosis_scores" DROP CONSTRAINT "apotheosis_scores_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "apotheosis_configs" DROP CONSTRAINT "apotheosis_configs_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "api_keys" DROP CONSTRAINT "api_keys_user_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "audit_logs" DROP CONSTRAINT "audit_logs_user_id_fkey";

-- DropForeignKey
ALTER TABLE "scenarios" DROP CONSTRAINT "scenarios_forecast_id_fkey";

-- DropForeignKey
ALTER TABLE "workflow_executions" DROP CONSTRAINT "workflow_executions_workflow_id_fkey";

-- DropForeignKey
ALTER TABLE "workflows" DROP CONSTRAINT "workflows_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "omnitranslate_glossaries" DROP CONSTRAINT "omnitranslate_glossaries_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "omnitranslate_glossary" DROP CONSTRAINT "omnitranslate_glossary_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "omnitranslate_memory" DROP CONSTRAINT "omnitranslate_memory_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "schema_mappings" DROP CONSTRAINT "schema_mappings_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "webhooks" DROP CONSTRAINT "webhooks_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "webhook_deliveries" DROP CONSTRAINT "webhook_deliveries_webhook_id_fkey";

-- DropForeignKey
ALTER TABLE "crucible_simulations" DROP CONSTRAINT "crucible_simulations_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "crucible_redteam_reports" DROP CONSTRAINT "crucible_redteam_reports_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "crucible_sbom" DROP CONSTRAINT "crucible_sbom_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "crucible_runtime_events" DROP CONSTRAINT "crucible_runtime_events_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "aegis_signals" DROP CONSTRAINT "aegis_signals_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "aegis_threats" DROP CONSTRAINT "aegis_threats_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "aegis_briefings" DROP CONSTRAINT "aegis_briefings_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "aegis_briefings" DROP CONSTRAINT "aegis_briefings_threat_id_fkey";

-- DropForeignKey
ALTER TABLE "ledger_entries" DROP CONSTRAINT "ledger_entries_block_number_fkey";

-- DropForeignKey
ALTER TABLE "eternal_artifacts" DROP CONSTRAINT "eternal_artifacts_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "eternal_migrations" DROP CONSTRAINT "eternal_migrations_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "eternal_succession" DROP CONSTRAINT "eternal_succession_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "symbiont_entities" DROP CONSTRAINT "symbiont_entities_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "symbiont_opportunities" DROP CONSTRAINT "symbiont_opportunities_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "symbiont_opportunities" DROP CONSTRAINT "symbiont_opportunities_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "symbiont_relationships" DROP CONSTRAINT "symbiont_relationships_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "symbiont_relationships" DROP CONSTRAINT "symbiont_relationships_entity_id_fkey";

-- DropForeignKey
ALTER TABLE "vox_stakeholders" DROP CONSTRAINT "vox_stakeholders_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "vox_impacts" DROP CONSTRAINT "vox_impacts_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "vox_impacts" DROP CONSTRAINT "vox_impacts_stakeholder_id_fkey";

-- DropForeignKey
ALTER TABLE "vox_votes" DROP CONSTRAINT "vox_votes_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "vox_votes" DROP CONSTRAINT "vox_votes_stakeholder_id_fkey";

-- DropForeignKey
ALTER TABLE "vox_assemblies" DROP CONSTRAINT "vox_assemblies_organization_id_fkey";

-- DropForeignKey
ALTER TABLE "sports_transfer_decisions" DROP CONSTRAINT "sports_transfer_decisions_organization_id_fkey";

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_query_responses" ADD CONSTRAINT "agent_query_responses_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "council_queries" ADD CONSTRAINT "council_queries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliberation_messages" ADD CONSTRAINT "deliberation_messages_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliberations" ADD CONSTRAINT "deliberations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_summaries" ADD CONSTRAINT "executive_summaries_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_summaries" ADD CONSTRAINT "executive_summaries_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissents" ADD CONSTRAINT "dissents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_definitions" ADD CONSTRAINT "metric_definitions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_iiss_scores" ADD CONSTRAINT "dcii_iiss_scores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_media_assets" ADD CONSTRAINT "dcii_media_assets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_jurisdiction_assessments" ADD CONSTRAINT "dcii_jurisdiction_assessments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_timestamp_tokens" ADD CONSTRAINT "dcii_timestamp_tokens_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_vault_packets" ADD CONSTRAINT "evidence_vault_packets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_similarity_decisions" ADD CONSTRAINT "dcii_similarity_decisions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_scheduled_jobs" ADD CONSTRAINT "enterprise_scheduled_jobs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_federation_members" ADD CONSTRAINT "gateway_federation_members_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "gateway_federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_federation_policies" ADD CONSTRAINT "gateway_federation_policies_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "gateway_federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_federation_reports" ADD CONSTRAINT "gateway_federation_reports_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "gateway_federations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_interactions" ADD CONSTRAINT "gateway_interactions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approval_execution_fkey" FOREIGN KEY ("reference_id") REFERENCES "workflow_executions"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "deliberations"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_regulations" ADD CONSTRAINT "panopticon_regulations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_regulation_id_fkey" FOREIGN KEY ("regulation_id") REFERENCES "panopticon_regulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_forecasts" ADD CONSTRAINT "panopticon_forecasts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constitutional_opinions" ADD CONSTRAINT "constitutional_opinions_dispute_id_fkey" FOREIGN KEY ("dispute_id") REFERENCES "constitutional_disputes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redteam_vulnerabilities" ADD CONSTRAINT "redteam_vulnerabilities_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "redteam_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redteam_patches" ADD CONSTRAINT "redteam_patches_vulnerability_id_fkey" FOREIGN KEY ("vulnerability_id") REFERENCES "redteam_vulnerabilities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_runs" ADD CONSTRAINT "apotheosis_runs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_pattern_bans" ADD CONSTRAINT "apotheosis_pattern_bans_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_scores" ADD CONSTRAINT "apotheosis_scores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_configs" ADD CONSTRAINT "apotheosis_configs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_forecast_id_fkey" FOREIGN KEY ("forecast_id") REFERENCES "forecasts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossaries" ADD CONSTRAINT "omnitranslate_glossaries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossary" ADD CONSTRAINT "omnitranslate_glossary_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_memory" ADD CONSTRAINT "omnitranslate_memory_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schema_mappings" ADD CONSTRAINT "schema_mappings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhooks" ADD CONSTRAINT "webhooks_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "webhook_deliveries" ADD CONSTRAINT "webhook_deliveries_webhook_id_fkey" FOREIGN KEY ("webhook_id") REFERENCES "webhooks"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_simulations" ADD CONSTRAINT "crucible_simulations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_redteam_reports" ADD CONSTRAINT "crucible_redteam_reports_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_sbom" ADD CONSTRAINT "crucible_sbom_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_runtime_events" ADD CONSTRAINT "crucible_runtime_events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_signals" ADD CONSTRAINT "aegis_signals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_threats" ADD CONSTRAINT "aegis_threats_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_briefings" ADD CONSTRAINT "aegis_briefings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_briefings" ADD CONSTRAINT "aegis_briefings_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_block_number_fkey" FOREIGN KEY ("block_number") REFERENCES "ledger_blocks"("block_number") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_artifacts" ADD CONSTRAINT "eternal_artifacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_migrations" ADD CONSTRAINT "eternal_migrations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_succession" ADD CONSTRAINT "eternal_succession_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_entities" ADD CONSTRAINT "symbiont_entities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_opportunities" ADD CONSTRAINT "symbiont_opportunities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_opportunities" ADD CONSTRAINT "symbiont_opportunities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "symbiont_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "symbiont_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_stakeholders" ADD CONSTRAINT "vox_stakeholders_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_impacts" ADD CONSTRAINT "vox_impacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_impacts" ADD CONSTRAINT "vox_impacts_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_votes" ADD CONSTRAINT "vox_votes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_votes" ADD CONSTRAINT "vox_votes_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_assemblies" ADD CONSTRAINT "vox_assemblies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports_transfer_decisions" ADD CONSTRAINT "sports_transfer_decisions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

