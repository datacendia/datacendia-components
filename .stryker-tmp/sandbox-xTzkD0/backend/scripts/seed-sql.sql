-- DATACENDIA DEMO DATA SEEDER
-- Run: docker exec -i cendia-postgres psql -U cendia -d datacendia < scripts/seed-sql.sql

-- ============================================================================
-- ORGANIZATIONS (2 companies)
-- ============================================================================
INSERT INTO organizations (id, name, slug, settings, created_at, updated_at) VALUES
  ('org-nexus-001', 'Nexus Financial Group', 'nexus-financial', '{"industry": "Financial Services", "size": "1000-5000"}', NOW(), NOW()),
  ('org-velocity-001', 'Velocity Manufacturing Corp', 'velocity-manufacturing', '{"industry": "Manufacturing", "size": "5000+"}', NOW(), NOW())
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- USERS (50 per company = 100 total)
-- ============================================================================
INSERT INTO users (id, email, password_hash, name, role, organization_id, status, preferences, created_at, updated_at)
SELECT 
  'user-' || org.slug || '-' || i,
  CASE WHEN i = 1 THEN 'admin@' || org.slug || '.com' ELSE 'user' || i || '@' || org.slug || '.com' END,
  '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZRGdjGj/n3.Q6TqV6ZCqBba8e9dXi', -- Demo2024!
  CASE WHEN i = 1 THEN 'System Administrator' 
       ELSE (ARRAY['James','Mary','John','Patricia','Robert','Jennifer','Michael','Linda','William','Elizabeth'])[1 + (i % 10)] || ' ' ||
            (ARRAY['Smith','Johnson','Williams','Brown','Jones','Garcia','Miller','Davis','Rodriguez','Martinez'])[1 + ((i * 7) % 10)]
  END,
  (CASE WHEN i = 1 THEN 'SUPER_ADMIN' WHEN i <= 5 THEN 'ADMIN' ELSE 'VIEWER' END)::"UserRole",
  org.id,
  'ACTIVE',
  '{"theme": "dark", "notifications": true}',
  NOW() - INTERVAL '1 day' * (50 - i),
  NOW()
FROM organizations org, generate_series(1, 50) i
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- METRIC DEFINITIONS (16 metrics per org = 32 total)
-- ============================================================================
INSERT INTO metric_definitions (id, organization_id, code, name, category, unit, formula, thresholds, owner_id, created_at, updated_at)
SELECT 
  'metric-def-' || org.slug || '-' || m.code,
  org.id,
  m.code,
  m.name,
  m.category,
  m.unit,
  '{"type": "direct", "source": "api"}',
  '{"warning": 80, "critical": 60}',
  (SELECT id FROM users WHERE organization_id = org.id LIMIT 1),
  NOW(),
  NOW()
FROM organizations org
CROSS JOIN (VALUES 
  ('revenue', 'Revenue', 'Financial', 'USD'),
  ('gross_margin', 'Gross Margin', 'Financial', '%'),
  ('operating_income', 'Operating Income', 'Financial', 'USD'),
  ('net_income', 'Net Income', 'Financial', 'USD'),
  ('customer_count', 'Customer Count', 'Customer', 'count'),
  ('churn_rate', 'Churn Rate', 'Customer', '%'),
  ('nps_score', 'NPS Score', 'Customer', 'score'),
  ('csat_score', 'CSAT Score', 'Customer', '%'),
  ('employee_count', 'Employee Count', 'People', 'count'),
  ('attrition_rate', 'Attrition Rate', 'People', '%'),
  ('engagement_score', 'Employee Engagement', 'People', '%'),
  ('system_uptime', 'System Uptime', 'Operations', '%'),
  ('incident_count', 'Incident Count', 'Operations', 'count'),
  ('lead_time', 'Lead Time', 'Operations', 'days'),
  ('security_score', 'Security Score', 'Security', 'score'),
  ('vulnerability_count', 'Open Vulnerabilities', 'Security', 'count')
) AS m(code, name, category, unit)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- METRIC VALUES (720 days x 16 metrics x 2 orgs = 23,040 rows)
-- ============================================================================
INSERT INTO metric_values (id, metric_id, value, timestamp, dimensions, created_at)
SELECT 
  'mv-' || md.id || '-' || d,
  md.id,
  CASE 
    WHEN md.code = 'revenue' THEN 50000000 * (1 + random() * 0.3 - 0.15)
    WHEN md.code = 'gross_margin' THEN 35 + random() * 10 - 5
    WHEN md.code = 'operating_income' THEN 8000000 * (1 + random() * 0.3 - 0.15)
    WHEN md.code = 'net_income' THEN 5000000 * (1 + random() * 0.3 - 0.15)
    WHEN md.code = 'customer_count' THEN 2500 + random() * 500
    WHEN md.code = 'churn_rate' THEN 2 + random() * 3
    WHEN md.code = 'nps_score' THEN 45 + random() * 30
    WHEN md.code = 'csat_score' THEN 80 + random() * 15
    WHEN md.code = 'employee_count' THEN 1200 + random() * 200
    WHEN md.code = 'attrition_rate' THEN 8 + random() * 6
    WHEN md.code = 'engagement_score' THEN 70 + random() * 20
    WHEN md.code = 'system_uptime' THEN 99 + random() * 0.9
    WHEN md.code = 'incident_count' THEN floor(random() * 10)
    WHEN md.code = 'lead_time' THEN 5 + random() * 10
    WHEN md.code = 'security_score' THEN 85 + random() * 10
    WHEN md.code = 'vulnerability_count' THEN floor(random() * 8)
    ELSE random() * 100
  END,
  NOW() - INTERVAL '1 day' * d,
  '{"source": "seed", "generated": true}',
  NOW()
FROM metric_definitions md, generate_series(1, 720) d
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- WORKFLOWS (8 per org = 16 total)
-- ============================================================================
INSERT INTO workflows (id, organization_id, name, description, category, status, trigger, definition, created_at, updated_at)
SELECT 
  'workflow-' || org.slug || '-' || w.idx,
  org.id,
  w.name,
  w.description,
  w.category,
  ((ARRAY['ACTIVE', 'ACTIVE', 'DRAFT'])[1 + (w.idx % 3)])::"WorkflowStatus",
  '{"type": "event"}',
  '{"nodes": [{"id": "start", "type": "trigger"}, {"id": "end", "type": "action"}]}',
  NOW() - INTERVAL '30 days' * w.idx,
  NOW()
FROM organizations org
CROSS JOIN (VALUES 
  (1, 'Capital Expenditure Approval', 'Automated CapEx request with AI analysis', 'Finance'),
  (2, 'Vendor Onboarding', 'New vendor verification and setup', 'Procurement'),
  (3, 'Employee Offboarding', 'Exit process automation', 'HR'),
  (4, 'Contract Review', 'AI-assisted contract analysis', 'Legal'),
  (5, 'Incident Response', 'Security incident handling', 'Security'),
  (6, 'Budget Reallocation', 'Cross-department budget transfers', 'Finance'),
  (7, 'Customer Escalation', 'Priority customer issue handling', 'Customer Success'),
  (8, 'Product Launch', 'Go-to-market checklist automation', 'Product')
) AS w(idx, name, description, category)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- WORKFLOW EXECUTIONS (100 per workflow = 1,600 total)
-- ============================================================================
INSERT INTO workflow_executions (id, workflow_id, status, parameters, outputs, progress, started_at, completed_at, created_at)
SELECT 
  'exec-' || wf.id || '-' || e,
  wf.id,
  ((ARRAY['COMPLETED', 'COMPLETED', 'COMPLETED', 'FAILED', 'PENDING'])[1 + (e % 5)])::"ExecutionStatus",
  ('{"requestId": "REQ-' || (1000 + e) || '"}')::jsonb,
  ('{"result": "processed", "confidence": ' || (0.7 + random() * 0.25) || '}')::jsonb,
  CASE WHEN (e % 5) = 4 THEN floor(random() * 80) ELSE 100 END,
  NOW() - INTERVAL '1 hour' * e,
  CASE WHEN (e % 5) != 4 THEN NOW() - INTERVAL '1 hour' * e + INTERVAL '30 minutes' ELSE NULL END,
  NOW()
FROM workflows wf, generate_series(1, 100) e
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- ALERTS (200 per org = 400 total)
-- ============================================================================
INSERT INTO alerts (id, organization_id, title, severity, message, source, status, metadata, created_at)
SELECT 
  'alert-' || org.slug || '-' || a,
  org.id,
  'Alert #' || a,
  ((ARRAY['CRITICAL', 'WARNING', 'WARNING', 'INFO', 'INFO'])[1 + (a % 5)])::"AlertSeverity",
  (ARRAY[
    'Revenue growth slowing - 15% below target',
    'System latency exceeding SLA threshold',
    'Quarterly report ready for review',
    'Customer churn rate increasing',
    'Security vulnerability detected in production',
    'New compliance regulation published',
    'Employee satisfaction score declining',
    'Database approaching capacity limit'
  ])[1 + (a % 8)],
  (ARRAY['pulse', 'council', 'system', 'integration'])[1 + (a % 4)],
  ((ARRAY['ACTIVE', 'ACKNOWLEDGED', 'RESOLVED', 'RESOLVED'])[1 + (a % 4)])::"AlertStatus",
  '{"generated": true}',
  NOW() - INTERVAL '1 hour' * a
FROM organizations org, generate_series(1, 200) a
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DELIBERATIONS (20 per org = 40 total)
-- ============================================================================
INSERT INTO deliberations (id, organization_id, question, config, status, confidence, decision, created_at)
SELECT 
  'dlb-' || org.slug || '-' || d,
  org.id,
  (ARRAY[
    'Should we expand into the European market in Q2?',
    'Evaluate acquisition of competitor TechStart Inc',
    'Should we increase R&D budget by 20%?',
    'Assess feasibility of remote-first policy',
    'Review proposal to outsource IT operations',
    'Evaluate launching a new product line',
    'Should we renegotiate vendor contracts?',
    'Assess impact of new AI regulations',
    'Review executive compensation structure',
    'Should we pursue SOC 2 certification?',
    'Evaluate partnership with CloudTech Inc',
    'Review pricing strategy for enterprise tier',
    'Should we expand customer success team?',
    'Assess data center migration timeline',
    'Review marketing budget allocation',
    'Should we implement four-day work week?',
    'Evaluate new CRM platform options',
    'Review supply chain redundancy plan',
    'Should we acquire smaller competitor?',
    'Assess cybersecurity insurance coverage'
  ])[1 + ((d - 1) % 20)],
  ('{"mode": "' || (ARRAY['war-room', 'due-diligence', 'innovation-lab', 'compliance', 'rapid'])[1 + (d % 5)] || '"}')::jsonb,
  ((ARRAY['COMPLETED', 'COMPLETED', 'IN_PROGRESS', 'PENDING'])[1 + (d % 4)])::"DeliberationStatus",
  0.7 + random() * 0.25,
  ('{"summary": "Council deliberation completed with consensus.", "duration": ' || (300 + floor(random() * 1500)) || '}')::jsonb,
  NOW() - INTERVAL '2 days' * d
FROM organizations org, generate_series(1, 20) d
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DELIBERATION MESSAGES (15 per deliberation = 600 total)
-- ============================================================================
INSERT INTO deliberation_messages (id, deliberation_id, agent_id, phase, content, confidence, sources, created_at)
SELECT 
  'msg-' || dlb.id || '-' || m,
  dlb.id,
  (SELECT id FROM agents WHERE code = (ARRAY['cfo', 'coo', 'ciso', 'chro', 'cto', 'cmo', 'cendia_chief'])[1 + (m % 7)] LIMIT 1),
  (ARRAY['analysis', 'debate', 'synthesis'])[1 + (m % 3)],
  'Agent perspective on the deliberation topic. Analysis point #' || m || ' with supporting evidence and recommendations.',
  0.75 + random() * 0.2,
  ('[{"type": "internal", "ref": "doc-' || (100 + m) || '"}]')::jsonb,
  dlb.created_at + INTERVAL '5 minutes' * m
FROM deliberations dlb, generate_series(1, 15) m
WHERE EXISTS (SELECT 1 FROM agents LIMIT 1)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- HEALTH SCORES (365 days per org = 730 total)
-- ============================================================================
INSERT INTO health_scores (id, organization_id, overall, data_score, ops_score, security_score, people_score, calculated_at, details)
SELECT 
  'hs-' || org.slug || '-' || d,
  org.id,
  75 + floor(random() * 20),
  80 + floor(random() * 15),
  85 + floor(random() * 12),
  78 + floor(random() * 18),
  72 + floor(random() * 22),
  NOW() - INTERVAL '1 day' * d,
  ('{"dimensions": {"data": {"quality": ' || (90 + floor(random() * 9)) || '}, "ops": {"uptime": ' || (99 + random()) || '}}}')::jsonb
FROM organizations org, generate_series(1, 365) d
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- AUDIT LOGS (500 per org = 1,000 total)
-- ============================================================================
INSERT INTO audit_logs (id, organization_id, user_id, action, resource_type, resource_id, details, created_at)
SELECT 
  'audit-' || org.slug || '-' || a,
  org.id,
  (SELECT id FROM users WHERE organization_id = org.id ORDER BY random() LIMIT 1),
  (ARRAY['user.login', 'user.logout', 'deliberation.create', 'deliberation.complete', 'workflow.execute', 'alert.acknowledge', 'settings.update', 'data_source.sync'])[1 + (a % 8)],
  (ARRAY['user', 'deliberation', 'workflow', 'alert', 'metric', 'data_source'])[1 + (a % 6)],
  'res-' || (1000 + a),
  ('{"ip": "192.168.' || (1 + (a % 255)) || '.' || (1 + ((a * 7) % 255)) || '", "userAgent": "Mozilla/5.0"}')::jsonb,
  NOW() - INTERVAL '1 hour' * a
FROM organizations org, generate_series(1, 500) a
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- DATA SOURCES (7 per org = 14 total)
-- ============================================================================
INSERT INTO data_sources (id, organization_id, name, type, status, config, credentials, last_sync_at, metadata, created_at, updated_at)
SELECT 
  'ds-' || org.slug || '-' || s.idx,
  org.id,
  s.name,
  s.type::"DataSourceType",
  s.status::"DataSourceStatus",
  '{"host": "db.example.com", "port": 5432}',
  '{}',
  CASE WHEN s.status = 'CONNECTED' THEN NOW() ELSE NULL END,
  ('{"tables": ' || (10 + floor(random() * 90)) || ', "records": ' || (10000 + floor(random() * 990000)) || '}')::jsonb,
  NOW() - INTERVAL '90 days',
  NOW()
FROM organizations org
CROSS JOIN (VALUES 
  (1, 'Primary PostgreSQL', 'POSTGRESQL', 'CONNECTED'),
  (2, 'Analytics Warehouse', 'SNOWFLAKE', 'CONNECTED'),
  (3, 'CRM System', 'SALESFORCE', 'CONNECTED'),
  (4, 'HR Platform', 'SAP', 'CONNECTED'),
  (5, 'Marketing Cloud', 'REST_API', 'CONNECTED'),
  (6, 'Financial System', 'ORACLE', 'PENDING'),
  (7, 'Customer Events', 'GRAPHQL', 'CONNECTED')
) AS s(idx, name, type, status)
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- SUMMARY
-- ============================================================================
SELECT 'organizations' as table_name, count(*) as row_count FROM organizations
UNION ALL SELECT 'users', count(*) FROM users
UNION ALL SELECT 'metric_definitions', count(*) FROM metric_definitions
UNION ALL SELECT 'metric_values', count(*) FROM metric_values
UNION ALL SELECT 'workflows', count(*) FROM workflows
UNION ALL SELECT 'workflow_executions', count(*) FROM workflow_executions
UNION ALL SELECT 'alerts', count(*) FROM alerts
UNION ALL SELECT 'deliberations', count(*) FROM deliberations
UNION ALL SELECT 'deliberation_messages', count(*) FROM deliberation_messages
UNION ALL SELECT 'health_scores', count(*) FROM health_scores
UNION ALL SELECT 'audit_logs', count(*) FROM audit_logs
UNION ALL SELECT 'data_sources', count(*) FROM data_sources
ORDER BY table_name;
