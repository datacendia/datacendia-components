/**
 * SOC 2 Type I/II Readiness Service
 *
 * Manages SOC 2 readiness tracking, system description generation,
 * trust services criteria mapping, and auditor engagement readiness.
 *
 * @module services/compliance/SOC2ReadinessService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.

import crypto from 'crypto';

export type TrustServiceCategory = 
  | 'security' | 'availability' | 'processing_integrity' 
  | 'confidentiality' | 'privacy';

export type ControlStatus = 
  | 'implemented' | 'partially_implemented' | 'planned' | 'not_applicable';

export type ReportType = 'type_i' | 'type_ii';

export interface SOC2Control {
  id: string;
  category: TrustServiceCategory;
  criteriaRef: string;
  title: string;
  description: string;
  status: ControlStatus;
  implementationDetails: string;
  evidenceTypes: string[];
  evidenceLocations: string[];
  testProcedure: string;
  lastTested: Date | null;
  owner: string;
  gaps: string[];
}

export interface SystemDescription {
  organizationName: string;
  systemName: string;
  systemDescription: string;
  principalServiceCommitments: string[];
  systemRequirements: string[];
  components: {
    infrastructure: string[];
    software: string[];
    people: string[];
    procedures: string[];
    data: string[];
  };
  boundaries: {
    services: string[];
    dataTypes: string[];
    exclusions: string[];
  };
  subserviceOrganizations: Array<{
    name: string;
    services: string;
    controlsType: 'inclusive' | 'carve_out';
  }>;
  complementaryUserEntityControls: string[];
  generatedAt: Date;
  hash: string;
}

export interface ReadinessAssessment {
  overallScore: number;
  reportType: ReportType;
  categoryScores: Record<TrustServiceCategory, number>;
  totalControls: number;
  implementedControls: number;
  partialControls: number;
  plannedControls: number;
  criticalGaps: string[];
  auditorReadiness: boolean;
  estimatedTypeITimeline: string;
  estimatedTypeIITimeline: string;
  assessedAt: Date;
}

// SOC 2 Trust Services Criteria (2017 TSC)
const SOC2_CONTROLS: SOC2Control[] = [
  // ========== CC1: Control Environment ==========
  {
    id: 'CC1.1', category: 'security', criteriaRef: 'CC1.1',
    title: 'COSO Principle 1 — Commitment to Integrity',
    description: 'The entity demonstrates a commitment to integrity and ethical values.',
    status: 'implemented',
    implementationDetails: 'Code of conduct policy; AI Agent Naming Governance Rule prevents persona impersonation; ethics-first architecture.',
    evidenceTypes: ['policy_document', 'code_of_conduct'],
    evidenceLocations: ['docs/policies/CODE_OF_CONDUCT.md', 'docs/policies/INFORMATION_SECURITY_POLICY.md'],
    testProcedure: 'Review code of conduct acknowledgments; verify ethics training completion',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC1.2', category: 'security', criteriaRef: 'CC1.2',
    title: 'COSO Principle 2 — Board Independence',
    description: 'Board exercises oversight of internal controls.',
    status: 'partially_implemented',
    implementationDetails: 'Owner oversight via compliance dashboard; no formal board of directors yet (pre-Series A).',
    evidenceTypes: ['dashboard_screenshots', 'meeting_minutes'],
    evidenceLocations: ['ComplianceDashboardService'],
    testProcedure: 'Review board meeting minutes; verify oversight activities',
    lastTested: null, owner: 'CEO',
    gaps: ['No formal board of directors — acceptable for pre-Series A startup'],
  },
  {
    id: 'CC1.3', category: 'security', criteriaRef: 'CC1.3',
    title: 'COSO Principle 3 — Management Authority',
    description: 'Management establishes structures, reporting lines, and authorities.',
    status: 'implemented',
    implementationDetails: 'RBAC with Casbin; role-based access with OWNER/ADMIN/USER tiers; audit trail on all auth decisions.',
    evidenceTypes: ['rbac_config', 'org_chart'],
    evidenceLocations: ['backend/src/config/casbin.ts', 'backend/src/middleware/auth.ts'],
    testProcedure: 'Review org structure and reporting lines; verify RBAC enforcement',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'CC1.4', category: 'security', criteriaRef: 'CC1.4',
    title: 'COSO Principle 4 — Competence Commitment',
    description: 'Entity demonstrates commitment to competence.',
    status: 'partially_implemented',
    implementationDetails: 'Technical hiring standards; training documentation in progress.',
    evidenceTypes: ['job_descriptions', 'training_records'],
    evidenceLocations: [],
    testProcedure: 'Review job descriptions and competency requirements',
    lastTested: null, owner: 'HR',
    gaps: ['Formal training program documentation needed'],
  },
  {
    id: 'CC1.5', category: 'security', criteriaRef: 'CC1.5',
    title: 'COSO Principle 5 — Accountability',
    description: 'Entity holds individuals accountable for internal controls.',
    status: 'implemented',
    implementationDetails: 'Immutable audit ledger with SHA-256 chain; all actions attributed to authenticated users.',
    evidenceTypes: ['audit_logs', 'accountability_policy'],
    evidenceLocations: ['backend/src/services/CendiaAuditService.ts'],
    testProcedure: 'Review audit logs for attribution; verify accountability enforcement',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  // ========== CC2: Communication and Information ==========
  {
    id: 'CC2.1', category: 'security', criteriaRef: 'CC2.1',
    title: 'Information Quality',
    description: 'Entity obtains or generates relevant, quality information.',
    status: 'implemented',
    implementationDetails: 'Data validation at API boundaries; input sanitization; schema validation with Zod/Prisma.',
    evidenceTypes: ['validation_config', 'api_schemas'],
    evidenceLocations: ['backend/src/middleware/validation.ts'],
    testProcedure: 'Review data validation rules and error handling',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'CC2.2', category: 'security', criteriaRef: 'CC2.2',
    title: 'Internal Communication',
    description: 'Entity internally communicates information necessary for internal controls.',
    status: 'implemented',
    implementationDetails: 'Compliance dashboard; real-time alerting via ContinuousComplianceMonitorService.',
    evidenceTypes: ['dashboard_screenshots', 'alert_configs'],
    evidenceLocations: ['backend/src/services/compliance/ContinuousComplianceMonitorService.ts'],
    testProcedure: 'Verify alert delivery and dashboard accuracy',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC2.3', category: 'security', criteriaRef: 'CC2.3',
    title: 'External Communication',
    description: 'Entity communicates with external parties about internal controls.',
    status: 'partially_implemented',
    implementationDetails: 'Privacy policy published; terms of service; compliance documentation.',
    evidenceTypes: ['privacy_policy', 'terms_of_service'],
    evidenceLocations: ['docs/legal/PRIVACY_POLICY.md', 'docs/legal/TERMS_OF_SERVICE.md'],
    testProcedure: 'Review external communications for accuracy',
    lastTested: null, owner: 'Legal',
    gaps: ['Need formal external communication procedures for control changes'],
  },
  // ========== CC3: Risk Assessment ==========
  {
    id: 'CC3.1', category: 'security', criteriaRef: 'CC3.1',
    title: 'Risk Identification',
    description: 'Entity specifies objectives to identify and assess risks.',
    status: 'implemented',
    implementationDetails: 'ComplianceEnforcer with 5-ring risk model; ContinuousComplianceMonitorService drift detection.',
    evidenceTypes: ['risk_register', 'risk_assessment'],
    evidenceLocations: ['backend/src/services/compliance/ComplianceEnforcer.ts'],
    testProcedure: 'Review risk assessment methodology and coverage',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC3.2', category: 'security', criteriaRef: 'CC3.2',
    title: 'Fraud Risk Assessment',
    description: 'Entity considers potential for fraud.',
    status: 'implemented',
    implementationDetails: 'Canary tripwire service for exfiltration detection; anomaly detection in audit logs.',
    evidenceTypes: ['fraud_controls', 'canary_config'],
    evidenceLocations: ['backend/src/services/sovereign/CanaryTripwireService.ts'],
    testProcedure: 'Test canary detection and anomaly alerting',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC3.3', category: 'security', criteriaRef: 'CC3.3',
    title: 'Change Management Risk',
    description: 'Entity identifies and assesses changes that could impact internal controls.',
    status: 'partially_implemented',
    implementationDetails: 'Git-based change management; PR reviews required. Formal change advisory board process needed.',
    evidenceTypes: ['change_log', 'pr_reviews'],
    evidenceLocations: [],
    testProcedure: 'Review change management process and documentation',
    lastTested: null, owner: 'CTO',
    gaps: ['Formalize change advisory board (CAB) process'],
  },
  // ========== CC4: Monitoring ==========
  {
    id: 'CC4.1', category: 'security', criteriaRef: 'CC4.1',
    title: 'Ongoing Monitoring',
    description: 'Entity selects, develops, and performs ongoing monitoring.',
    status: 'implemented',
    implementationDetails: 'ContinuousComplianceMonitorService with real-time drift detection across 10 frameworks.',
    evidenceTypes: ['monitoring_config', 'alert_history'],
    evidenceLocations: ['backend/src/services/compliance/ContinuousComplianceMonitorService.ts'],
    testProcedure: 'Review monitoring coverage and alert response times',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC4.2', category: 'security', criteriaRef: 'CC4.2',
    title: 'Deficiency Evaluation',
    description: 'Entity evaluates and communicates internal control deficiencies.',
    status: 'implemented',
    implementationDetails: 'Compliance dashboard scoring; gap identification in audit reports.',
    evidenceTypes: ['gap_reports', 'remediation_plans'],
    evidenceLocations: ['docs/COMPLIANCE_AUDIT_APR2026.md'],
    testProcedure: 'Review gap reports and remediation tracking',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  // ========== CC5: Control Activities ==========
  {
    id: 'CC5.1', category: 'security', criteriaRef: 'CC5.1',
    title: 'Control Selection',
    description: 'Entity selects and develops control activities.',
    status: 'implemented',
    implementationDetails: 'ComplianceEnforcer rules engine; automated violation detection and blocking.',
    evidenceTypes: ['control_matrix', 'enforcement_rules'],
    evidenceLocations: ['backend/src/services/compliance/ComplianceEnforcer.ts'],
    testProcedure: 'Review control selection rationale and coverage',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC5.2', category: 'security', criteriaRef: 'CC5.2',
    title: 'Technology Controls',
    description: 'Entity selects and develops general controls over technology.',
    status: 'implemented',
    implementationDetails: 'Helmet security headers; CORS; rate limiting; JWT auth; AES-256 encryption; TLS 1.3.',
    evidenceTypes: ['security_config', 'penetration_test'],
    evidenceLocations: ['backend/src/security/headers.ts', 'backend/src/middleware/auth.ts'],
    testProcedure: 'Run security scan; review header configuration',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'CC5.3', category: 'security', criteriaRef: 'CC5.3',
    title: 'Policy Deployment',
    description: 'Entity deploys control activities through policies.',
    status: 'partially_implemented',
    implementationDetails: 'Technical policies implemented in code; formal policy documents being created.',
    evidenceTypes: ['policy_documents'],
    evidenceLocations: ['docs/policies/'],
    testProcedure: 'Review policy completeness and deployment',
    lastTested: null, owner: 'CISO',
    gaps: ['Complete formal policy document suite'],
  },
  // ========== CC6: Logical Access ==========
  {
    id: 'CC6.1', category: 'security', criteriaRef: 'CC6.1',
    title: 'Logical Access Security',
    description: 'Entity implements logical access security software.',
    status: 'implemented',
    implementationDetails: 'JWT authentication; Casbin RBAC; session management; MFA support.',
    evidenceTypes: ['auth_config', 'access_logs'],
    evidenceLocations: ['backend/src/middleware/auth.ts', 'backend/src/config/casbin.ts'],
    testProcedure: 'Test authentication flows; verify RBAC enforcement',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'CC6.2', category: 'security', criteriaRef: 'CC6.2',
    title: 'Access Provisioning',
    description: 'Prior to issuing system credentials, entity registers and authorizes users.',
    status: 'implemented',
    implementationDetails: 'User registration with email verification; admin approval for elevated roles.',
    evidenceTypes: ['provisioning_logs', 'approval_records'],
    evidenceLocations: ['backend/src/routes/auth.ts'],
    testProcedure: 'Review user provisioning process and approval workflow',
    lastTested: null, owner: 'Admin',
    gaps: [],
  },
  {
    id: 'CC6.3', category: 'security', criteriaRef: 'CC6.3',
    title: 'Access Removal',
    description: 'Entity removes access when no longer appropriate.',
    status: 'implemented',
    implementationDetails: 'User deactivation; JWT token revocation; session invalidation.',
    evidenceTypes: ['deprovisioning_logs'],
    evidenceLocations: ['backend/src/routes/admin.ts'],
    testProcedure: 'Test user deactivation and access removal',
    lastTested: null, owner: 'Admin',
    gaps: [],
  },
  {
    id: 'CC6.6', category: 'security', criteriaRef: 'CC6.6',
    title: 'System Boundaries',
    description: 'Entity implements controls to restrict access at system boundaries.',
    status: 'implemented',
    implementationDetails: 'Helmet security headers; CORS restrictions; API rate limiting; WAF-ready architecture.',
    evidenceTypes: ['network_config', 'firewall_rules'],
    evidenceLocations: ['backend/src/security/headers.ts'],
    testProcedure: 'Review network security configuration',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'CC6.7', category: 'security', criteriaRef: 'CC6.7',
    title: 'Data Transmission Restriction',
    description: 'Entity restricts transmission of data to authorized users.',
    status: 'implemented',
    implementationDetails: 'TLS 1.3 enforced; AES-256 encryption at rest; API authentication required.',
    evidenceTypes: ['encryption_config', 'tls_cert'],
    evidenceLocations: ['backend/src/config/index.ts'],
    testProcedure: 'Verify TLS configuration and encryption standards',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'CC6.8', category: 'security', criteriaRef: 'CC6.8',
    title: 'Malicious Software Prevention',
    description: 'Entity implements controls to prevent malicious software.',
    status: 'implemented',
    implementationDetails: 'Input validation; SQL injection prevention (Prisma ORM); XSS protection (Helmet CSP).',
    evidenceTypes: ['security_scan', 'dependency_audit'],
    evidenceLocations: ['backend/src/security/headers.ts'],
    testProcedure: 'Run SAST/DAST scans; review dependency vulnerabilities',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  // ========== CC7: System Operations ==========
  {
    id: 'CC7.1', category: 'security', criteriaRef: 'CC7.1',
    title: 'Anomaly Detection',
    description: 'Entity uses detection and monitoring to identify anomalies.',
    status: 'implemented',
    implementationDetails: 'Canary tripwire service; continuous compliance monitoring; audit log analysis.',
    evidenceTypes: ['monitoring_config', 'alert_logs'],
    evidenceLocations: ['backend/src/services/sovereign/CanaryTripwireService.ts'],
    testProcedure: 'Test anomaly detection triggers and response',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC7.2', category: 'security', criteriaRef: 'CC7.2',
    title: 'Incident Response',
    description: 'Entity monitors and evaluates security incidents.',
    status: 'partially_implemented',
    implementationDetails: 'Audit logging and alerting implemented; formal incident response plan being documented.',
    evidenceTypes: ['ir_plan', 'incident_logs'],
    evidenceLocations: ['docs/policies/INCIDENT_RESPONSE_PLAN.md'],
    testProcedure: 'Review IR plan; test incident response procedures',
    lastTested: null, owner: 'CISO',
    gaps: ['Complete and test incident response plan tabletop exercise'],
  },
  {
    id: 'CC7.3', category: 'security', criteriaRef: 'CC7.3',
    title: 'Incident Evaluation',
    description: 'Entity evaluates security events to determine incidents.',
    status: 'implemented',
    implementationDetails: 'ComplianceEnforcer severity classification; risk level calculation.',
    evidenceTypes: ['incident_classification', 'severity_matrix'],
    evidenceLocations: ['backend/src/services/compliance/ComplianceEnforcer.ts'],
    testProcedure: 'Review incident classification criteria',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC7.4', category: 'security', criteriaRef: 'CC7.4',
    title: 'Incident Response Execution',
    description: 'Entity responds to identified security incidents.',
    status: 'partially_implemented',
    implementationDetails: 'Automated blocking of critical violations; alerting system. Formal playbooks needed.',
    evidenceTypes: ['ir_playbooks', 'response_logs'],
    evidenceLocations: [],
    testProcedure: 'Test incident response playbooks',
    lastTested: null, owner: 'CISO',
    gaps: ['Document formal incident response playbooks'],
  },
  // ========== CC8: Change Management ==========
  {
    id: 'CC8.1', category: 'security', criteriaRef: 'CC8.1',
    title: 'Infrastructure Changes',
    description: 'Entity authorizes, designs, and implements changes to infrastructure.',
    status: 'implemented',
    implementationDetails: 'Git-based version control; PR review required; CI/CD pipeline.',
    evidenceTypes: ['change_logs', 'pr_history'],
    evidenceLocations: [],
    testProcedure: 'Review change management process',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  // ========== CC9: Risk Mitigation ==========
  {
    id: 'CC9.1', category: 'security', criteriaRef: 'CC9.1',
    title: 'Risk Mitigation',
    description: 'Entity identifies, selects, and develops risk mitigation activities.',
    status: 'implemented',
    implementationDetails: '5-ring compliance enforcement model; automated risk detection and blocking.',
    evidenceTypes: ['risk_register', 'mitigation_plans'],
    evidenceLocations: ['backend/src/services/compliance/ComplianceEnforcer.ts'],
    testProcedure: 'Review risk mitigation activities and effectiveness',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'CC9.2', category: 'security', criteriaRef: 'CC9.2',
    title: 'Vendor Risk Management',
    description: 'Entity assesses and manages risks related to vendors.',
    status: 'partially_implemented',
    implementationDetails: 'Sovereign architecture minimizes vendor dependencies; local-first model execution.',
    evidenceTypes: ['vendor_inventory', 'risk_assessments'],
    evidenceLocations: [],
    testProcedure: 'Review vendor risk assessment process',
    lastTested: null, owner: 'CISO',
    gaps: ['Formalize vendor risk management program'],
  },
  // ========== Availability Criteria ==========
  {
    id: 'A1.1', category: 'availability', criteriaRef: 'A1.1',
    title: 'Availability Commitments',
    description: 'Entity maintains infrastructure to support system availability.',
    status: 'implemented',
    implementationDetails: 'Sovereign deployment architecture; health check endpoints; graceful degradation.',
    evidenceTypes: ['uptime_reports', 'health_checks'],
    evidenceLocations: ['backend/src/routes/health.ts'],
    testProcedure: 'Review uptime metrics and health check configuration',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  {
    id: 'A1.2', category: 'availability', criteriaRef: 'A1.2',
    title: 'Recovery Planning',
    description: 'Entity authorizes, designs, and implements recovery procedures.',
    status: 'partially_implemented',
    implementationDetails: 'Database backup strategy; deterministic replay capability for decision recovery.',
    evidenceTypes: ['bcp_plan', 'backup_config'],
    evidenceLocations: ['docs/policies/BCP_DR_PLAN.md'],
    testProcedure: 'Review BCP/DR plan; test recovery procedures',
    lastTested: null, owner: 'CTO',
    gaps: ['Complete and test BCP/DR plan'],
  },
  // ========== Processing Integrity ==========
  {
    id: 'PI1.1', category: 'processing_integrity', criteriaRef: 'PI1.1',
    title: 'Processing Accuracy',
    description: 'Entity processes data accurately and completely.',
    status: 'implemented',
    implementationDetails: 'SHA-256 integrity verification; Merkle tree evidence chains; immutable audit ledger.',
    evidenceTypes: ['integrity_checks', 'validation_rules'],
    evidenceLocations: ['backend/src/services/CendiaAuditService.ts'],
    testProcedure: 'Verify data integrity checks and validation',
    lastTested: null, owner: 'CTO',
    gaps: [],
  },
  // ========== Confidentiality ==========
  {
    id: 'C1.1', category: 'confidentiality', criteriaRef: 'C1.1',
    title: 'Confidential Information Identification',
    description: 'Entity identifies and maintains confidential information.',
    status: 'implemented',
    implementationDetails: 'Data classification in PII detector; CendiaGateway policy engine; encryption at rest.',
    evidenceTypes: ['classification_policy', 'encryption_config'],
    evidenceLocations: ['backend/src/services/gateway/PIIDetector.ts'],
    testProcedure: 'Review data classification and protection controls',
    lastTested: null, owner: 'CISO',
    gaps: [],
  },
  {
    id: 'C1.2', category: 'confidentiality', criteriaRef: 'C1.2',
    title: 'Confidential Information Disposal',
    description: 'Entity disposes of confidential information per policy.',
    status: 'partially_implemented',
    implementationDetails: 'Data retention policies defined; automated purge capabilities planned.',
    evidenceTypes: ['retention_policy', 'disposal_logs'],
    evidenceLocations: [],
    testProcedure: 'Review data disposal procedures and logs',
    lastTested: null, owner: 'CISO',
    gaps: ['Implement automated data disposal per retention schedule'],
  },
  // ========== Privacy ==========
  {
    id: 'P1.1', category: 'privacy', criteriaRef: 'P1.1',
    title: 'Privacy Notice',
    description: 'Entity provides notice to data subjects.',
    status: 'implemented',
    implementationDetails: 'Published privacy policy; cookie consent banner (implementing); data collection notices.',
    evidenceTypes: ['privacy_policy', 'consent_records'],
    evidenceLocations: ['docs/legal/PRIVACY_POLICY.md'],
    testProcedure: 'Review privacy notices for completeness',
    lastTested: null, owner: 'DPO',
    gaps: [],
  },
];

export class SOC2ReadinessService {
  private controls: SOC2Control[] = SOC2_CONTROLS;

  generateSystemDescription(): SystemDescription {
    const description: SystemDescription = {
      organizationName: 'Datacendia, LLC',
      systemName: 'Datacendia Decision Crisis Immunization Infrastructure (DCII)',
      systemDescription: 
        'Datacendia provides a sovereign-first enterprise decision governance platform that enables organizations ' +
        'to make, understand, and prove critical decisions. The system includes AI-powered council deliberation, ' +
        'compliance enforcement, immutable audit trails, and evidence generation for regulatory defensibility. ' +
        'The platform is deployed on customer-owned infrastructure with no external data dependencies.',
      principalServiceCommitments: [
        'Provide decision governance infrastructure with immutable audit trails',
        'Enforce compliance across 190+ regulatory frameworks in real-time',
        'Generate court-admissible evidence packages for regulatory defense',
        'Protect customer data with AES-256 encryption at rest and TLS 1.3 in transit',
        'Maintain 99.9% platform availability during contracted hours',
        'Process AI-assisted decisions with documented provenance and accountability',
      ],
      systemRequirements: [
        'Authentication via JWT tokens with configurable session duration',
        'Role-based access control enforced by Casbin policy engine',
        'All data encrypted at rest (AES-256) and in transit (TLS 1.3)',
        'Audit logs retained per customer-configured retention period (minimum 1 year)',
        'Compliance violations blocked in real-time for critical severity',
        'Decision records are immutable once finalized (SHA-256 hash chain)',
      ],
      components: {
        infrastructure: [
          'Customer-managed compute (Docker containers or bare metal)',
          'PostgreSQL database (customer-owned)',
          'Redis cache (customer-owned)',
          'Qdrant vector database (customer-owned)',
          'Ollama AI inference (customer-owned, air-gap capable)',
        ],
        software: [
          'Datacendia Backend (Node.js/Express)',
          'Datacendia Frontend (React/TypeScript)',
          'Prisma ORM for database access',
          'Casbin for RBAC enforcement',
          'Helmet for security headers',
        ],
        people: [
          'Platform Owner (full system access)',
          'Platform Administrators (user and configuration management)',
          'Standard Users (operational access per RBAC)',
          'Datacendia Engineering (development and maintenance)',
        ],
        procedures: [
          'User provisioning and deprovisioning',
          'Access review and recertification',
          'Change management via Git pull requests',
          'Incident response and breach notification',
          'Compliance monitoring and drift detection',
          'Backup and recovery procedures',
        ],
        data: [
          'Decision records and deliberation transcripts',
          'User accounts and authentication credentials',
          'Compliance attestations and evidence artifacts',
          'Audit logs and security events',
          'AI model configurations (no customer data in models)',
        ],
      },
      boundaries: {
        services: [
          'Council deliberation and decision-making',
          'Compliance enforcement and monitoring',
          'Evidence generation and regulatory reporting',
          'User authentication and authorization',
          'Data source integration and governance',
        ],
        dataTypes: [
          'Decision records', 'User authentication data', 'Audit logs',
          'Compliance attestations', 'AI interaction logs', 'Configuration data',
        ],
        exclusions: [
          'Customer-managed infrastructure (IaaS)',
          'Customer network security',
          'Customer endpoint security',
          'Third-party AI model providers (if customer chooses cloud models)',
        ],
      },
      subserviceOrganizations: [],
      complementaryUserEntityControls: [
        'Customer is responsible for securing the infrastructure hosting the platform',
        'Customer is responsible for managing user access provisioning and deprovisioning',
        'Customer is responsible for network-level security controls',
        'Customer is responsible for physical security of hosting infrastructure',
        'Customer is responsible for configuring backup and recovery per their requirements',
        'Customer must enforce strong password policies for user accounts',
      ],
      generatedAt: new Date(),
      hash: '',
    };

    description.hash = crypto
      .createHash('sha256')
      .update(JSON.stringify({ ...description, hash: '' }))
      .digest('hex');

    return description;
  }

  assessReadiness(reportType: ReportType = 'type_i'): ReadinessAssessment {
    const categoryScores: Record<TrustServiceCategory, number> = {
      security: 0,
      availability: 0,
      processing_integrity: 0,
      confidentiality: 0,
      privacy: 0,
    };

    const categoryCounts: Record<TrustServiceCategory, { total: number; implemented: number }> = {
      security: { total: 0, implemented: 0 },
      availability: { total: 0, implemented: 0 },
      processing_integrity: { total: 0, implemented: 0 },
      confidentiality: { total: 0, implemented: 0 },
      privacy: { total: 0, implemented: 0 },
    };

    let implemented = 0;
    let partial = 0;
    let planned = 0;
    const criticalGaps: string[] = [];

    for (const control of this.controls) {
      categoryCounts[control.category].total++;
      if (control.status === 'implemented') {
        categoryCounts[control.category].implemented++;
        implemented++;
      } else if (control.status === 'partially_implemented') {
        categoryCounts[control.category].implemented += 0.5;
        partial++;
        control.gaps.forEach(g => criticalGaps.push(`${control.criteriaRef}: ${g}`));
      } else if (control.status === 'planned') {
        planned++;
        criticalGaps.push(`${control.criteriaRef}: ${control.title} — Not yet implemented`);
      }
    }

    for (const cat of Object.keys(categoryCounts) as TrustServiceCategory[]) {
      const { total, implemented: impl } = categoryCounts[cat];
      categoryScores[cat] = total > 0 ? Math.round((impl / total) * 100) : 0;
    }

    const overallScore = Math.round(
      ((implemented + partial * 0.5) / this.controls.length) * 100
    );

    return {
      overallScore,
      reportType,
      categoryScores,
      totalControls: this.controls.length,
      implementedControls: implemented,
      partialControls: partial,
      plannedControls: planned,
      criticalGaps,
      auditorReadiness: overallScore >= 80 && criticalGaps.length <= 5,
      estimatedTypeITimeline: overallScore >= 85 ? '2-3 months' : overallScore >= 70 ? '4-6 months' : '6-9 months',
      estimatedTypeIITimeline: overallScore >= 85 ? '6-9 months' : overallScore >= 70 ? '9-12 months' : '12-18 months',
      assessedAt: new Date(),
    };
  }

  getControls(): SOC2Control[] {
    return this.controls;
  }

  getControlsByCategory(category: TrustServiceCategory): SOC2Control[] {
    return this.controls.filter(c => c.category === category);
  }

  getGaps(): Array<{ control: string; gap: string }> {
    const gaps: Array<{ control: string; gap: string }> = [];
    for (const control of this.controls) {
      for (const gap of control.gaps) {
        gaps.push({ control: control.criteriaRef, gap });
      }
      if (control.status === 'planned') {
        gaps.push({ control: control.criteriaRef, gap: `${control.title} — Not yet implemented` });
      }
    }
    return gaps;
  }
}

export const soc2ReadinessService = new SOC2ReadinessService();
