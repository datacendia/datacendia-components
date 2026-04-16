node.exe : Loaded Prisma config from prisma.config.ts.
At line:1 char:1
+ & "C:\Program Files\nodejs/node.exe" "C:\Program Files\nodejs/node_mo ...
+ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    + CategoryInfo          : NotSpecified: (Loaded Prisma c...isma.config.ts.:String) [], RemoteException
    + FullyQualifiedErrorId : NativeCommandError
 

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('OWNER', 'SUPER_ADMIN', 'ADMIN', 'ANALYST', 'VIEWER');

-- CreateEnum
CREATE TYPE "UserStatus" AS ENUM ('ACTIVE', 'INVITED', 'DISABLED');

-- CreateEnum
CREATE TYPE "DecisionPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "DecisionStatus" AS ENUM ('PENDING', 'BLOCKED', 'DEFERRED', 'ESCALATED', 'APPROVED', 'REJECTED', 'IMPLEMENTED');

-- CreateEnum
CREATE TYPE "DeliberationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'AWAITING_APPROVAL', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "QueryStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "SummaryType" AS ENUM ('COUNCIL_DELIBERATION', 'DECISION_DNS', 'PRE_MORTEM', 'GHOST_BOARD', 'DECISION_DEBT', 'REGULATORY_ABSORB', 'LIVE_DEMO');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('CRITICAL', 'WARNING', 'INFO');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('ACTIVE', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "DataSourceStatus" AS ENUM ('PENDING', 'CONNECTED', 'SYNCING', 'ERROR', 'DISABLED');

-- CreateEnum
CREATE TYPE "DataSourceType" AS ENUM ('POSTGRESQL', 'MYSQL', 'SNOWFLAKE', 'BIGQUERY', 'SALESFORCE', 'SAP', 'ORACLE', 'MONGODB', 'REST_API', 'GRAPHQL', 'CSV_UPLOAD', 'AWS', 'AZURE', 'HUBSPOT', 'GOOGLE_SHEETS', 'AIRTABLE', 'STRIPE', 'SHOPIFY', 'ZENDESK', 'JIRA', 'SLACK', 'REDIS', 'NEO4J');

-- CreateEnum
CREATE TYPE "ForecastStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "LineageEntityType" AS ENUM ('DATASET', 'TABLE', 'COLUMN', 'REPORT', 'METRIC', 'MODEL', 'PIPELINE', 'API');

-- CreateEnum
CREATE TYPE "LineageRelationType" AS ENUM ('DERIVES_FROM', 'TRANSFORMS_TO', 'DEPENDS_ON', 'FEEDS', 'USES');

-- CreateEnum
CREATE TYPE "DataQualityLevel" AS ENUM ('EXCELLENT', 'GOOD', 'FAIR', 'POOR', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "ForecastModelType" AS ENUM ('TIME_SERIES', 'REGRESSION', 'CLASSIFICATION', 'ANOMALY_DETECTION', 'NEURAL_NETWORK');

-- CreateEnum
CREATE TYPE "ModelTrainingStatus" AS ENUM ('UNTRAINED', 'TRAINING', 'TRAINED', 'FAILED', 'STALE');

-- CreateEnum
CREATE TYPE "HealthStatus" AS ENUM ('HEALTHY', 'DEGRADED', 'UNHEALTHY', 'UNKNOWN');

-- CreateEnum
CREATE TYPE "IncidentSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "IncidentStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'IDENTIFIED', 'MONITORING', 'RESOLVED');

-- CreateEnum
CREATE TYPE "NotificationType" AS ENUM ('DELIBERATION_STARTED', 'DELIBERATION_COMPLETE', 'DECISION_MADE', 'DISSENT_FILED', 'APPROVAL_REQUIRED', 'APPROVAL_GRANTED', 'APPROVAL_DENIED', 'ALERT_TRIGGERED', 'SYSTEM_ANNOUNCEMENT', 'SECURITY_ALERT', 'MFA_ENABLED', 'MFA_DISABLED');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SLACK', 'TEAMS', 'PUSH', 'WEBHOOK');

-- CreateEnum
CREATE TYPE "AlertLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "ApprovalStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ApprovalType" AS ENUM ('WORKFLOW', 'DELIBERATION', 'ACCESS', 'BUDGET', 'DATA_EXPORT');

-- CreateEnum
CREATE TYPE "PanopticonRegulationStatus" AS ENUM ('DRAFT', 'ACTIVE', 'SUPERSEDED', 'RETIRED');

-- CreateEnum
CREATE TYPE "PanopticonRequirementType" AS ENUM ('MANDATORY', 'RECOMMENDED', 'OPTIONAL', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "PanopticonPriority" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "PanopticonAutomationStatus" AS ENUM ('FULLY_AUTOMATED', 'PARTIALLY_AUTOMATED', 'MANUAL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "PanopticonViolationType" AS ENUM ('PROCESS_VIOLATION', 'DATA_VIOLATION', 'DOCUMENTATION_GAP', 'TIMELINE_BREACH', 'CONTROL_FAILURE');

-- CreateEnum
CREATE TYPE "PanopticonViolationStatus" AS ENUM ('OPEN', 'INVESTIGATING', 'REMEDIATION', 'RESOLVED', 'ACCEPTED_RISK');

-- CreateEnum
CREATE TYPE "PanopticonForecastType" AS ENUM ('NEW_REGULATION', 'AMENDMENT', 'ENFORCEMENT_ACTION', 'INDUSTRY_TREND', 'GEOPOLITICAL');

-- CreateEnum
CREATE TYPE "EthicsCategory" AS ENUM ('FAIRNESS', 'TRANSPARENCY', 'PRIVACY', 'ACCOUNTABILITY', 'SAFETY', 'HUMAN_OVERSIGHT');

-- CreateEnum
CREATE TYPE "PrincipleStatus" AS ENUM ('ACTIVE', 'DRAFT', 'DEPRECATED', 'UNDER_REVIEW');

-- CreateEnum
CREATE TYPE "ReviewStatus" AS ENUM ('PENDING', 'IN_REVIEW', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ReviewResult" AS ENUM ('APPROVED', 'REJECTED', 'CONDITIONAL', 'NEEDS_REVISION');

-- CreateEnum
CREATE TYPE "BiasCheckStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RegulatoryDocStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "RegulatoryReviewStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'APPROVED', 'REJECTED', 'CHANGES_REQUESTED');

-- CreateEnum
CREATE TYPE "RegulatorySeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "TriggerType" AS ENUM ('AUTOMATIC', 'MANUAL', 'SCHEDULED');

-- CreateEnum
CREATE TYPE "ConstraintType" AS ENUM ('MANDATORY', 'ADVISORY', 'CONDITIONAL');

-- CreateEnum
CREATE TYPE "ConflictType" AS ENUM ('DIRECT', 'POTENTIAL', 'SUPERSEDED');

-- CreateEnum
CREATE TYPE "ConflictResolution" AS ENUM ('UNRESOLVED', 'RESOLVED_PRIORITY', 'RESOLVED_MERGED', 'RESOLVED_EXCEPTION', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "MeshNodeType" AS ENUM ('DCU', 'GATEWAY', 'ENDPOINT', 'SENSOR');

-- CreateEnum
CREATE TYPE "NodeStatus" AS ENUM ('ONLINE', 'OFFLINE', 'DEGRADED', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "EncryptionLevel" AS ENUM ('STANDARD', 'HIGH', 'QUANTUM_RESISTANT');

-- CreateEnum
CREATE TYPE "ConnectionStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'DEGRADED');

-- CreateEnum
CREATE TYPE "ChannelProtocol" AS ENUM ('AES256', 'CHACHA20', 'KYBER', 'DILITHIUM');

-- CreateEnum
CREATE TYPE "ChannelStatus" AS ENUM ('ACTIVE', 'EXPIRED', 'REVOKED');

-- CreateEnum
CREATE TYPE "BlackboxStatus" AS ENUM ('OPERATIONAL', 'DEGRADED', 'OFFLINE', 'RECOVERY_MODE');

-- CreateEnum
CREATE TYPE "BackupSourceType" AS ENUM ('LEDGER', 'CHRONOS', 'WITNESS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "BackupStatus" AS ENUM ('SCHEDULED', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "BackupPriority" AS ENUM ('CRITICAL', 'HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "ARDeviceType" AS ENUM ('VISION_PRO', 'META_QUEST', 'HOLOLENS', 'CUSTOM');

-- CreateEnum
CREATE TYPE "ARDeviceStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'PAIRING', 'MAINTENANCE');

-- CreateEnum
CREATE TYPE "SecurityClearance" AS ENUM ('BASIC', 'STANDARD', 'ELEVATED', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "OverlayType" AS ENUM ('HEALTH_SCORE', 'RISK_INDICATOR', 'COUNCIL_INSIGHT', 'METRIC', 'ALERT', 'CUSTOM');

-- CreateEnum
CREATE TYPE "SessionType" AS ENUM ('INDIVIDUAL', 'COLLABORATIVE', 'PRESENTATION');

-- CreateEnum
CREATE TYPE "SessionStatus" AS ENUM ('ACTIVE', 'PAUSED', 'ENDED');

-- CreateEnum
CREATE TYPE "ExecutionStatus" AS ENUM ('PENDING', 'RUNNING', 'COMPLETED', 'FAILED', 'SKIPPED', 'AWAITING_APPROVAL');

-- CreateEnum
CREATE TYPE "WorkflowStatus" AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "TenantPlan" AS ENUM ('PILOT', 'TRIAL', 'FOUNDATION', 'ENTERPRISE', 'STRATEGIC', 'CUSTOM');

-- CreateEnum
CREATE TYPE "TenantStatus" AS ENUM ('PENDING', 'TRIAL', 'ACTIVE', 'SUSPENDED', 'CHURNED');

-- CreateEnum
CREATE TYPE "LicenseType" AS ENUM ('PILOT', 'TRIAL', 'FOUNDATION', 'ENTERPRISE', 'STRATEGIC', 'CUSTOM');

-- CreateEnum
CREATE TYPE "LicenseStatus" AS ENUM ('ACTIVE', 'EXPIRING', 'EXPIRED', 'SUSPENDED');

-- CreateEnum
CREATE TYPE "BillingCycle" AS ENUM ('MONTHLY', 'ANNUAL');

-- CreateEnum
CREATE TYPE "FeatureFlagType" AS ENUM ('BOOLEAN', 'PERCENTAGE', 'USER_LIST', 'TENANT_LIST');

-- CreateEnum
CREATE TYPE "CrucibleSimulationType" AS ENUM ('FINANCIAL_STRESS', 'OPERATIONAL_SHOCK', 'CYBER_ATTACK', 'REGULATORY_CHANGE', 'CULTURAL_SHIFT', 'ESG_EVENT', 'MA_SCENARIO', 'MARKET_DISRUPTION', 'SUPPLY_CHAIN', 'TALENT_EXODUS', 'TECHNOLOGY_FAILURE', 'BLACK_SWAN', 'CUSTOM');

-- CreateEnum
CREATE TYPE "CrucibleSimulationStatus" AS ENUM ('DRAFT', 'CONFIGURING', 'RUNNING', 'COMPLETED', 'FAILED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CrucibleOutcomeSentiment" AS ENUM ('CATASTROPHIC', 'NEGATIVE', 'NEUTRAL', 'POSITIVE', 'OPTIMAL');

-- CreateEnum
CREATE TYPE "CrucibleImpactCategory" AS ENUM ('FINANCIAL', 'OPERATIONAL', 'SECURITY', 'COMPLIANCE', 'CULTURAL', 'REPUTATIONAL', 'STRATEGIC', 'TECHNOLOGICAL');

-- CreateEnum
CREATE TYPE "CrucibleSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'MINIMAL');

-- CreateEnum
CREATE TYPE "AegisSignalType" AS ENUM ('CYBER', 'GEOPOLITICAL', 'INFRASTRUCTURE', 'SUPPLY_CHAIN', 'FINANCIAL', 'ENVIRONMENTAL', 'SOCIAL', 'REGULATORY');

-- CreateEnum
CREATE TYPE "AegisSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFORMATIONAL');

-- CreateEnum
CREATE TYPE "AegisThreatType" AS ENUM ('CYBER_ATTACK', 'DATA_BREACH', 'INSIDER_THREAT', 'SUPPLY_CHAIN_ATTACK', 'PHYSICAL_SECURITY', 'GEOPOLITICAL_RISK', 'NATURAL_DISASTER', 'MARKET_DISRUPTION', 'REGULATORY_ACTION', 'REPUTATIONAL_CRISIS');

-- CreateEnum
CREATE TYPE "AegisThreatStatus" AS ENUM ('ACTIVE', 'MONITORING', 'CONTAINED', 'MITIGATED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AegisCountermeasureType" AS ENUM ('PREVENTIVE', 'DETECTIVE', 'CORRECTIVE', 'DETERRENT', 'RECOVERY');

-- CreateEnum
CREATE TYPE "AegisCountermeasureStatus" AS ENUM ('PROPOSED', 'APPROVED', 'IN_PROGRESS', 'IMPLEMENTED', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AegisBriefingType" AS ENUM ('DAILY_INTEL', 'THREAT_ALERT', 'INCIDENT_REPORT', 'STRATEGIC_ASSESSMENT', 'EXECUTIVE_SUMMARY');

-- CreateEnum
CREATE TYPE "AegisClassification" AS ENUM ('PUBLIC', 'INTERNAL', 'CONFIDENTIAL', 'RESTRICTED', 'TOP_SECRET');

-- CreateEnum
CREATE TYPE "ThreatType" AS ENUM ('INTRUSION', 'MALWARE', 'PHISHING', 'DATA_EXFILTRATION', 'PRIVILEGE_ESCALATION', 'DENIAL_OF_SERVICE', 'INSIDER_THREAT', 'POLICY_VIOLATION');

-- CreateEnum
CREATE TYPE "ThreatSeverity" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW', 'INFO');

-- CreateEnum
CREATE TYPE "ThreatStatus" AS ENUM ('ACTIVE', 'INVESTIGATING', 'CONTAINED', 'MITIGATED', 'RESOLVED', 'FALSE_POSITIVE');

-- CreateEnum
CREATE TYPE "PolicyType" AS ENUM ('ACCESS_CONTROL', 'DATA_PROTECTION', 'NETWORK_SECURITY', 'COMPLIANCE', 'OPERATIONAL');

-- CreateEnum
CREATE TYPE "PolicyEnforcement" AS ENUM ('BLOCK', 'WARN', 'LOG', 'DISABLED');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('CRITICAL', 'HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "HoneytokenType" AS ENUM ('CREDENTIAL', 'API_KEY', 'DOCUMENT', 'DATABASE_RECORD', 'SSH_KEY', 'TOKEN');

-- CreateEnum
CREATE TYPE "CanaryType" AS ENUM ('SERVER', 'DATABASE', 'APPLICATION', 'API_ENDPOINT', 'FILE_SHARE');

-- CreateEnum
CREATE TYPE "CanaryStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'TRIGGERED', 'COMPROMISED');

-- CreateEnum
CREATE TYPE "CanaryEventType" AS ENUM ('CONNECTION', 'AUTHENTICATION', 'DATA_ACCESS', 'EXFILTRATION', 'LATERAL_MOVEMENT');

-- CreateEnum
CREATE TYPE "HardwareKeyType" AS ENUM ('USB', 'NFC', 'SMARTCARD', 'BIOMETRIC');

-- CreateEnum
CREATE TYPE "KeyStatus" AS ENUM ('ACTIVE', 'INACTIVE', 'LOST', 'REVOKED');

-- CreateEnum
CREATE TYPE "OperationType" AS ENUM ('LARGE_TRANSACTION', 'CONFIG_CHANGE', 'DATA_EXPORT', 'USER_MANAGEMENT', 'SYSTEM_ACCESS');

-- CreateEnum
CREATE TYPE "KeyEvent" AS ENUM ('REGISTERED', 'ASSIGNED', 'USED', 'LOST', 'REVOKED', 'RECOVERED');

-- CreateEnum
CREATE TYPE "EternalArtifactType" AS ENUM ('STRATEGIC_DECISION', 'POLICY_DOCUMENT', 'FINANCIAL_RECORD', 'LEGAL_AGREEMENT', 'INTELLECTUAL_PROPERTY', 'HISTORICAL_RECORD', 'CULTURAL_ARTIFACT', 'LEADERSHIP_WISDOM', 'CRISIS_RESPONSE', 'LESSONS_LEARNED');

-- CreateEnum
CREATE TYPE "EternalAccessLevel" AS ENUM ('PUBLIC', 'ORGANIZATION', 'LEADERSHIP', 'BOARD', 'FOUNDER', 'SUCCESSION');

-- CreateEnum
CREATE TYPE "EternalVerificationStatus" AS ENUM ('PENDING', 'VERIFIED', 'DRIFT_DETECTED', 'CORRECTED', 'QUARANTINED');

-- CreateEnum
CREATE TYPE "EternalValidationType" AS ENUM ('SCHEDULED', 'MANUAL', 'TRIGGERED', 'MIGRATION');

-- CreateEnum
CREATE TYPE "EternalMigrationType" AS ENUM ('FORMAT_UPGRADE', 'PLATFORM_MIGRATION', 'ENCRYPTION_UPDATE', 'SCHEMA_EVOLUTION');

-- CreateEnum
CREATE TYPE "EternalMigrationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'ROLLED_BACK');

-- CreateEnum
CREATE TYPE "EternalSuccessorType" AS ENUM ('INDIVIDUAL', 'ORGANIZATION', 'FOUNDATION', 'GOVERNMENT', 'TRUST');

-- CreateEnum
CREATE TYPE "SymbiontEntityType" AS ENUM ('PARTNER', 'VENDOR', 'COMPETITOR', 'CUSTOMER', 'INVESTOR', 'REGULATOR', 'INDUSTRY_BODY', 'RESEARCH_INSTITUTION', 'STARTUP');

-- CreateEnum
CREATE TYPE "SymbiontSizeCategory" AS ENUM ('STARTUP', 'SMB', 'MID_MARKET', 'ENTERPRISE', 'CONGLOMERATE');

-- CreateEnum
CREATE TYPE "SymbiontOpportunityType" AS ENUM ('STRATEGIC_PARTNERSHIP', 'JOINT_VENTURE', 'ACQUISITION', 'MERGER', 'LICENSING', 'DISTRIBUTION', 'CO_DEVELOPMENT', 'INVESTMENT', 'DIVESTITURE');

-- CreateEnum
CREATE TYPE "SymbiontOpportunityStatus" AS ENUM ('IDENTIFIED', 'ANALYZING', 'QUALIFIED', 'PURSUING', 'NEGOTIATING', 'CLOSED_WON', 'CLOSED_LOST', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "SymbiontRelationshipType" AS ENUM ('PARTNERSHIP', 'VENDOR', 'CUSTOMER', 'COMPETITOR', 'INVESTOR', 'SUBSIDIARY', 'AFFILIATE');

-- CreateEnum
CREATE TYPE "SymbiontSentiment" AS ENUM ('VERY_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE');

-- CreateEnum
CREATE TYPE "SymbiontSimulationType" AS ENUM ('PARTNERSHIP_MODEL', 'JV_STRUCTURE', 'ACQUISITION_INTEGRATION', 'MARKET_ENTRY', 'TECHNOLOGY_TRANSFER');

-- CreateEnum
CREATE TYPE "VoxStakeholderType" AS ENUM ('EMPLOYEES', 'CUSTOMERS', 'SHAREHOLDERS', 'COMMUNITY', 'ENVIRONMENT', 'FUTURE_GENERATIONS', 'SUPPLIERS', 'REGULATORS', 'CIVIL_SOCIETY');

-- CreateEnum
CREATE TYPE "VoxSignalType" AS ENUM ('SURVEY', 'SOCIAL_MEDIA', 'ESG_FEED', 'COMPLAINT', 'FEEDBACK', 'NEWS', 'REGULATORY', 'INTERNAL');

-- CreateEnum
CREATE TYPE "VoxSentiment" AS ENUM ('VERY_POSITIVE', 'POSITIVE', 'NEUTRAL', 'NEGATIVE', 'VERY_NEGATIVE');

-- CreateEnum
CREATE TYPE "VoxUrgency" AS ENUM ('CRITICAL', 'HIGH', 'NORMAL', 'LOW');

-- CreateEnum
CREATE TYPE "VoxImpactType" AS ENUM ('FINANCIAL', 'HEALTH_SAFETY', 'ENVIRONMENTAL', 'SOCIAL', 'PSYCHOLOGICAL', 'EMPLOYMENT', 'RIGHTS', 'OPPORTUNITY');

-- CreateEnum
CREATE TYPE "VoxSeverity" AS ENUM ('CATASTROPHIC', 'SEVERE', 'MODERATE', 'MINOR', 'NEGLIGIBLE');

-- CreateEnum
CREATE TYPE "VoxVoteType" AS ENUM ('APPROVAL', 'ADVISORY', 'VETO', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "VoxVoteValue" AS ENUM ('APPROVE', 'APPROVE_WITH_CONDITIONS', 'OPPOSE', 'ABSTAIN', 'VETO');

-- CreateEnum
CREATE TYPE "VoxAssemblyType" AS ENUM ('EMERGENCY', 'SCHEDULED', 'AD_HOC', 'ANNUAL');

-- CreateEnum
CREATE TYPE "TwinEntityType" AS ENUM ('SYSTEM', 'TEAM', 'WORKFLOW', 'PROCESS', 'ASSET');

-- CreateEnum
CREATE TYPE "SnapshotTrigger" AS ENUM ('SCHEDULED', 'MANUAL', 'EVENT');

-- CreateEnum
CREATE TYPE "SimulationStatus" AS ENUM ('DRAFT', 'RUNNING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "WitnessEventType" AS ENUM ('DECISION', 'TRANSACTION', 'COMMUNICATION', 'AGREEMENT', 'AUDIT', 'DISCLOSURE');

-- CreateEnum
CREATE TYPE "LegalRelevance" AS ENUM ('HIGH', 'MEDIUM', 'LOW');

-- CreateEnum
CREATE TYPE "LegalHoldStatus" AS ENUM ('ACTIVE', 'RELEASED');

-- CreateEnum
CREATE TYPE "CustodyAction" AS ENUM ('CREATED', 'ACCESSED', 'MODIFIED', 'EXPORTED', 'VERIFIED');

-- CreateEnum
CREATE TYPE "ClaimCategory" AS ENUM ('DATA', 'METRIC', 'EVENT', 'STATEMENT', 'FORECAST');

-- CreateEnum
CREATE TYPE "ClaimStatus" AS ENUM ('PENDING', 'VERIFIED', 'DISPUTED', 'FALSE', 'INCONCLUSIVE');

-- CreateEnum
CREATE TYPE "EvidenceType" AS ENUM ('DATA_SOURCE', 'DOCUMENT', 'WITNESS', 'AUDIT_LOG', 'CALCULATION');

-- CreateEnum
CREATE TYPE "VoteValue" AS ENUM ('SUPPORT', 'OPPOSE', 'ABSTAIN');

-- CreateEnum
CREATE TYPE "ArticleCategory" AS ENUM ('POLICY', 'PROCEDURE', 'BEST_PRACTICE', 'LESSON_LEARNED', 'HISTORICAL', 'TECHNICAL');

-- CreateEnum
CREATE TYPE "ArticleStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED', 'DEPRECATED');

-- CreateEnum
CREATE TYPE "MemoryType" AS ENUM ('SUCCESS', 'FAILURE', 'PIVOT', 'CRISIS', 'INNOVATION', 'MILESTONE', 'LESSON_LEARNED');

-- CreateEnum
CREATE TYPE "ConfidentialityLevel" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'CONFIDENTIAL');

-- CreateEnum
CREATE TYPE "DisputeStatus" AS ENUM ('OPEN', 'UNDER_REVIEW', 'RESOLVED', 'DISMISSED');

-- CreateEnum
CREATE TYPE "DiscoveryStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'REJECTED');

-- CreateEnum
CREATE TYPE "RecoveryStatus" AS ENUM ('INITIATED', 'SCANNING', 'RECOVERING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "AttemptStatus" AS ENUM ('PENDING', 'VERIFIED', 'REJECTED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "TransferStatus" AS ENUM ('INITIATED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "TransferType" AS ENUM ('INBOUND', 'OUTBOUND', 'LOAN_OUT', 'LOAN_IN');

-- CreateEnum
CREATE TYPE "SportsDecisionStatus" AS ENUM ('DRAFT', 'PENDING_APPROVAL', 'APPROVED', 'REJECTED', 'COMPLETED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "ScoutingRecommendation" AS ENUM ('STRONG_BUY', 'BUY', 'CONDITIONAL', 'PASS');

-- CreateTable
CREATE TABLE "email_verifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "email_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "industry" TEXT,
    "company_size" TEXT,
    "settings" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "organizations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "password_resets" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "used_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_resets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sessions" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "refresh_token_hash" TEXT NOT NULL,
    "user_agent" TEXT,
    "ip_address" TEXT,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "team_members" (
    "team_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'member',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "team_members_pkey" PRIMARY KEY ("team_id","user_id")
);

-- CreateTable
CREATE TABLE "teams" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "teams_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "translations" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "language" TEXT NOT NULL,
    "namespace" TEXT NOT NULL DEFAULT 'common',
    "value" TEXT NOT NULL,
    "context" TEXT,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "translations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password_hash" TEXT,
    "name" TEXT NOT NULL,
    "avatar_url" TEXT,
    "role" "UserRole" NOT NULL DEFAULT 'VIEWER',
    "status" "UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "email_verified" BOOLEAN NOT NULL DEFAULT false,
    "email_verified_at" TIMESTAMP(3),
    "preferences" JSONB NOT NULL DEFAULT '{}',
    "last_login_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),
    "mfa_enabled" BOOLEAN NOT NULL DEFAULT false,
    "mfa_secret" TEXT,
    "mfa_backup_codes" TEXT,
    "mfa_enabled_at" TIMESTAMP(3),
    "notification_preferences" JSONB NOT NULL DEFAULT '{"email":true,"inApp":true,"push":false,"slack":false}',

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_templates" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "variables" JSONB NOT NULL DEFAULT '[]',
    "model_config" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parent_id" TEXT,

    CONSTRAINT "prompt_templates_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "prompt_usages" (
    "id" TEXT NOT NULL,
    "prompt_template_id" TEXT NOT NULL,
    "deliberation_id" TEXT,
    "agent_code" TEXT,
    "mode" TEXT,
    "input_variables" JSONB NOT NULL DEFAULT '{}',
    "model_used" TEXT,
    "token_count" INTEGER,
    "response_quality" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "prompt_usages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_query_responses" (
    "id" TEXT NOT NULL,
    "query_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "sources" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_query_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agents" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar_url" TEXT,
    "system_prompt" TEXT NOT NULL,
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "constraints" JSONB NOT NULL DEFAULT '[]',
    "model_config" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "agents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "council_queries" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "query" TEXT NOT NULL,
    "context" JSONB NOT NULL DEFAULT '{}',
    "status" "QueryStatus" NOT NULL DEFAULT 'PENDING',
    "response" JSONB,
    "confidence" DOUBLE PRECISION,
    "processing_time" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "council_queries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_activities" (
    "id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "details" JSONB,
    "timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_blockers" (
    "id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "blocked_since" TIMESTAMP(3) NOT NULL,
    "estimated_resolution" TIMESTAMP(3),
    "escalation_level" INTEGER NOT NULL DEFAULT 0,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "decision_blockers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decisions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT,
    "priority" "DecisionPriority" NOT NULL DEFAULT 'MEDIUM',
    "status" "DecisionStatus" NOT NULL DEFAULT 'PENDING',
    "department" TEXT,
    "owner_name" TEXT,
    "owner_email" TEXT,
    "budget" DOUBLE PRECISION,
    "timeframe" TEXT,
    "deadline" TIMESTAMP(3),
    "estimated_daily_cost" DOUBLE PRECISION,
    "total_cost_accrued" DOUBLE PRECISION,
    "stakeholders" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliberation_messages" (
    "id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "phase" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "target_agent_id" TEXT,
    "sources" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliberation_messages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliberations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "context" JSONB NOT NULL DEFAULT '{}',
    "mode" TEXT,
    "status" "DeliberationStatus" NOT NULL DEFAULT 'PENDING',
    "current_phase" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "decision" JSONB,
    "confidence" DOUBLE PRECISION,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliberations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_packets" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "organization_id" TEXT NOT NULL,
    "session_id" TEXT NOT NULL,
    "user_id" TEXT,
    "deliberation_id" TEXT,
    "question" TEXT NOT NULL,
    "context" TEXT,
    "recommendation" TEXT NOT NULL,
    "confidence" DECIMAL(5,4) NOT NULL,
    "confidence_bounds" JSONB NOT NULL DEFAULT '{}',
    "key_assumptions" JSONB NOT NULL DEFAULT '[]',
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "conditions_for_change" JSONB NOT NULL DEFAULT '[]',
    "citations" JSONB NOT NULL DEFAULT '[]',
    "agent_contributions" JSONB NOT NULL DEFAULT '[]',
    "dissents" JSONB NOT NULL DEFAULT '[]',
    "consensus_reached" BOOLEAN NOT NULL DEFAULT false,
    "tool_calls" JSONB NOT NULL DEFAULT '[]',
    "approvals" JSONB NOT NULL DEFAULT '[]',
    "policy_gates" JSONB NOT NULL DEFAULT '[]',
    "artifact_hashes" JSONB NOT NULL DEFAULT '{}',
    "merkle_root" TEXT NOT NULL,
    "signature" JSONB,
    "signed_at" TIMESTAMP(3),
    "regulatory_frameworks" JSONB NOT NULL DEFAULT '[]',
    "retention_until" TIMESTAMP(3) NOT NULL,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "exported_at" TIMESTAMP(3),

    CONSTRAINT "decision_packets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "executive_summaries" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT,
    "decision_id" TEXT,
    "type" "SummaryType" NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "key_points" JSONB NOT NULL DEFAULT '[]',
    "action_items" JSONB NOT NULL DEFAULT '[]',
    "participants" JSONB NOT NULL DEFAULT '[]',
    "risks" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "next_steps" JSONB NOT NULL DEFAULT '[]',
    "language" TEXT NOT NULL DEFAULT 'en',
    "generated_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "executive_summaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deliberation_votes" (
    "id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "agent_role" TEXT NOT NULL,
    "vote" TEXT NOT NULL,
    "reasoning" TEXT,
    "confidence" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deliberation_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "veto_events" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "target_type" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "veto_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ghost_board_sessions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "scenario" TEXT NOT NULL,
    "board_composition" JSONB NOT NULL DEFAULT '[]',
    "discussion" JSONB NOT NULL DEFAULT '[]',
    "insights" JSONB NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ghost_board_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pre_mortem_analyses" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT,
    "title" TEXT NOT NULL,
    "failure_modes" JSONB NOT NULL DEFAULT '[]',
    "risk_factors" JSONB NOT NULL DEFAULT '[]',
    "mitigations" JSONB NOT NULL DEFAULT '[]',
    "overall_risk" DOUBLE PRECISION,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pre_mortem_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decision_outcomes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "outcome_date" TIMESTAMP(3) NOT NULL,
    "predictions" JSONB NOT NULL DEFAULT '{}',
    "dollar_impact" DECIMAL(18,2),
    "roi" DECIMAL(10,4),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "confidence_score" DECIMAL(5,4),
    "council_mode" TEXT,
    "participating_agents" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "voting_pattern" JSONB NOT NULL DEFAULT '{}',
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "decision_outcomes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "agent_weight_history" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_role" TEXT NOT NULL,
    "previous_weight" DECIMAL(5,4) NOT NULL,
    "new_weight" DECIMAL(5,4) NOT NULL,
    "adjustment" DECIMAL(5,4) NOT NULL,
    "reason" TEXT NOT NULL,
    "deliberation_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "agent_weight_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "echo_collection_jobs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "scheduled_collection_date" TIMESTAMP(3) NOT NULL,
    "data_source_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "metric_keys" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "collected_data" JSONB,
    "collected_at" TIMESTAMP(3),
    "error" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "echo_collection_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dissents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "decision_date" TIMESTAMP(3) NOT NULL,
    "decision_owner" TEXT NOT NULL,
    "dissent_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "statement" TEXT NOT NULL,
    "supporting_evidence" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "is_anonymous" BOOLEAN NOT NULL DEFAULT false,
    "dissenter_id" TEXT NOT NULL,
    "dissenter_name" TEXT NOT NULL,
    "dissenter_role" TEXT,
    "dissenter_department" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "response_deadline" TIMESTAMP(3) NOT NULL,
    "outcome_verified" BOOLEAN NOT NULL DEFAULT false,
    "dissenter_was_right" BOOLEAN,
    "outcome_verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ledger_hash" TEXT NOT NULL,
    "ledger_timestamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dissents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dissent_responses" (
    "id" TEXT NOT NULL,
    "dissent_id" TEXT NOT NULL,
    "responder_id" TEXT NOT NULL,
    "responder_name" TEXT NOT NULL,
    "responder_role" TEXT NOT NULL,
    "response_type" TEXT NOT NULL,
    "reasoning" TEXT NOT NULL,
    "mitigating_actions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "ledger_hash" TEXT NOT NULL,

    CONSTRAINT "dissent_responses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alerts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "metric_id" TEXT,
    "severity" "AlertSeverity" NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "acknowledged_at" TIMESTAMP(3),
    "acknowledged_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "type" "NotificationType" NOT NULL,
    "channel" "NotificationChannel" NOT NULL DEFAULT 'IN_APP',
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "link" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "read" BOOLEAN NOT NULL DEFAULT false,
    "read_at" TIMESTAMP(3),
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_sources" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "DataSourceType" NOT NULL,
    "config" JSONB NOT NULL DEFAULT '{}',
    "credentials" JSONB NOT NULL DEFAULT '{}',
    "status" "DataSourceStatus" NOT NULL DEFAULT 'PENDING',
    "last_sync_at" TIMESTAMP(3),
    "last_sync_status" TEXT,
    "sync_schedule" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "data_sources_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "embeddings" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "embedding" BYTEA NOT NULL,
    "embedding_model" TEXT NOT NULL DEFAULT 'nomic-embed-text',
    "dimensions" INTEGER NOT NULL DEFAULT 768,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "embeddings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecasts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "target_metric" TEXT NOT NULL,
    "horizon" JSONB NOT NULL,
    "model" TEXT NOT NULL,
    "features" JSONB NOT NULL DEFAULT '[]',
    "status" "ForecastStatus" NOT NULL DEFAULT 'PENDING',
    "predictions" JSONB,
    "accuracy" JSONB,
    "feature_importance" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_scores" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "overall" INTEGER NOT NULL,
    "data_score" INTEGER NOT NULL,
    "ops_score" INTEGER NOT NULL,
    "security_score" INTEGER NOT NULL,
    "people_score" INTEGER NOT NULL,
    "calculated_at" TIMESTAMP(3) NOT NULL,
    "details" JSONB NOT NULL DEFAULT '{}',

    CONSTRAINT "health_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "llm_cache" (
    "id" TEXT NOT NULL,
    "query_hash" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "system_prompt" TEXT,
    "response" TEXT NOT NULL,
    "tokens_in" INTEGER NOT NULL,
    "tokens_out" INTEGER NOT NULL,
    "latency_ms" INTEGER NOT NULL,
    "temperature" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "hit_count" INTEGER NOT NULL DEFAULT 1,
    "last_accessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "llm_cache_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_definitions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "formula" JSONB NOT NULL,
    "unit" TEXT,
    "category" TEXT,
    "thresholds" JSONB NOT NULL DEFAULT '{}',
    "owner_id" TEXT,
    "refresh_schedule" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "metric_definitions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "metric_values" (
    "id" TEXT NOT NULL,
    "metric_id" TEXT NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "timestamp" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "metric_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineage_entities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "entity_type" "LineageEntityType" NOT NULL,
    "description" TEXT,
    "source" TEXT NOT NULL,
    "schema_def" JSONB NOT NULL DEFAULT '{}',
    "quality_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "quality_level" "DataQualityLevel" NOT NULL DEFAULT 'UNKNOWN',
    "record_count" INTEGER,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "lineage_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lineage_relationships" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "target_id" TEXT NOT NULL,
    "relationship_type" "LineageRelationType" NOT NULL,
    "transformations" JSONB NOT NULL DEFAULT '[]',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "lineage_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_quality_reports" (
    "id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "overall_score" DOUBLE PRECISION NOT NULL,
    "completeness" DOUBLE PRECISION NOT NULL,
    "accuracy" DOUBLE PRECISION NOT NULL,
    "consistency" DOUBLE PRECISION NOT NULL,
    "timeliness" DOUBLE PRECISION NOT NULL,
    "validity" DOUBLE PRECISION NOT NULL,
    "issues" JSONB NOT NULL DEFAULT '[]',
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_quality_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "forecast_models" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "model_type" "ForecastModelType" NOT NULL,
    "description" TEXT,
    "target_metric" TEXT NOT NULL,
    "features" JSONB NOT NULL DEFAULT '[]',
    "hyperparameters" JSONB NOT NULL DEFAULT '{}',
    "accuracy" DOUBLE PRECISION,
    "mape" DOUBLE PRECISION,
    "training_status" "ModelTrainingStatus" NOT NULL DEFAULT 'UNTRAINED',
    "last_trained_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "forecast_models_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "predictions" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "input_data" JSONB NOT NULL,
    "predicted_value" DOUBLE PRECISION NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "prediction_date" TIMESTAMP(3) NOT NULL,
    "actual_value" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "predictions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_importance" (
    "id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "feature_name" TEXT NOT NULL,
    "importance" DOUBLE PRECISION NOT NULL,
    "direction" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_importance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_checks" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "component" TEXT NOT NULL,
    "status" "HealthStatus" NOT NULL,
    "latency_ms" INTEGER,
    "error_message" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "checked_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "health_incidents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "IncidentSeverity" NOT NULL,
    "status" "IncidentStatus" NOT NULL DEFAULT 'OPEN',
    "affected_components" JSONB NOT NULL DEFAULT '[]',
    "root_cause" TEXT,
    "resolution" TEXT,
    "started_at" TIMESTAMP(3) NOT NULL,
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "health_incidents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chronos_events" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL DEFAULT 'info',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "actor" TEXT,
    "actor_type" TEXT,
    "resource_type" TEXT,
    "resource_id" TEXT,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "impact" TEXT,
    "magnitude" INTEGER NOT NULL DEFAULT 0,
    "parent_event_id" TEXT,
    "hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chronos_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "chronos_snapshots" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "snapshot_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "data" JSONB NOT NULL DEFAULT '{}',
    "metrics" JSONB NOT NULL DEFAULT '{}',
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chronos_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_iiss_scores" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "overall_score" INTEGER NOT NULL,
    "band" TEXT NOT NULL,
    "certification" TEXT NOT NULL DEFAULT 'none',
    "previous_score" INTEGER,
    "previous_band" TEXT,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "change_amount" INTEGER NOT NULL DEFAULT 0,
    "percentile" DOUBLE PRECISION,
    "assessment_id" TEXT NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "integrity_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_iiss_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_iiss_assessments" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "initiated_by" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_iiss_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_iiss_history" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "band" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_iiss_history_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_media_assets" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "media_type" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'signed',
    "created_by" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_media_assets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_media_assessments" (
    "id" TEXT NOT NULL,
    "asset_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "verdict" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "analyzed_by" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_media_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_jurisdiction_assessments" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "organization_name" TEXT NOT NULL,
    "jurisdictions" TEXT[],
    "assessed_by" TEXT NOT NULL,
    "conflict_count" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_jurisdiction_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_jurisdiction_conflicts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "assessment_id" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "conflict_type" TEXT NOT NULL,
    "jurisdiction_a" TEXT NOT NULL,
    "jurisdiction_b" TEXT NOT NULL,
    "framework_a" TEXT NOT NULL,
    "framework_b" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'detected',
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_jurisdiction_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_jurisdiction_evidence_packets" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "framework" TEXT NOT NULL,
    "packet_type" TEXT NOT NULL DEFAULT 'compliance_report',
    "generated_by" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_jurisdiction_evidence_packets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_jurisdiction_good_faith_docs" (
    "id" TEXT NOT NULL,
    "conflict_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "signed_by" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_jurisdiction_good_faith_docs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_timestamp_tokens" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "data_hash" TEXT NOT NULL,
    "hash_algorithm" TEXT NOT NULL DEFAULT 'SHA-256',
    "data_type" TEXT NOT NULL DEFAULT 'generic',
    "description" TEXT NOT NULL,
    "reference_id" TEXT,
    "status" TEXT NOT NULL DEFAULT 'valid',
    "has_external" BOOLEAN NOT NULL DEFAULT false,
    "has_blockchain" BOOLEAN NOT NULL DEFAULT false,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3),

    CONSTRAINT "dcii_timestamp_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_timestamp_verifications" (
    "id" TEXT NOT NULL,
    "token_id" TEXT NOT NULL,
    "verified_by" TEXT NOT NULL,
    "valid" BOOLEAN NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_timestamp_verifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_timestamp_batches" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "item_count" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'completed',
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_timestamp_batches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "evidence_vault_packets" (
    "id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "mode" TEXT NOT NULL DEFAULT 'operational',
    "owner_id" TEXT NOT NULL,
    "owner_name" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "owner_role" TEXT NOT NULL,
    "owner_department" TEXT NOT NULL,
    "business_unit" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "data_source_id" TEXT,
    "policy_pack_version" TEXT NOT NULL DEFAULT 'v1.0.0',
    "signature_valid" BOOLEAN NOT NULL DEFAULT false,
    "integrity_hash" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "superseded_by" TEXT,
    "systems_impacted" TEXT[],
    "compliance_frameworks" TEXT[],
    "retention_until" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "signed_at" TIMESTAMP(3),
    "locked_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "evidence_vault_packets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_similarity_decisions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "context" TEXT NOT NULL,
    "decision_type" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "urgency" TEXT NOT NULL DEFAULT 'medium',
    "outcome" TEXT,
    "override" BOOLEAN NOT NULL DEFAULT false,
    "decided_by" TEXT NOT NULL,
    "decided_at" TIMESTAMP(3) NOT NULL,
    "tags" TEXT[],
    "keywords" TEXT[],
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_similarity_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_similarity_results" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "query_title" TEXT NOT NULL,
    "match_count" INTEGER NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_similarity_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "dcii_similarity_patterns" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "pattern_type" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "data" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "dcii_similarity_patterns_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_scheduled_jobs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "cron_expression" TEXT NOT NULL,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "config" JSONB NOT NULL DEFAULT '{}',
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "last_run_at" TIMESTAMP(3),
    "last_run_status" TEXT,
    "last_run_duration_ms" INTEGER,
    "last_run_error" TEXT,
    "next_run_at" TIMESTAMP(3),
    "total_runs" INTEGER NOT NULL DEFAULT 0,
    "successful_runs" INTEGER NOT NULL DEFAULT 0,
    "failed_runs" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_by" TEXT NOT NULL,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "enterprise_scheduled_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "enterprise_job_executions" (
    "id" TEXT NOT NULL,
    "job_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "job_type" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "duration_ms" INTEGER,
    "status" TEXT NOT NULL,
    "result" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "triggered_by" TEXT NOT NULL,
    "execution_hash" TEXT NOT NULL,

    CONSTRAINT "enterprise_job_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_policies" (
    "id" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "coverage_type" TEXT NOT NULL,
    "coverage_limit" DOUBLE PRECISION NOT NULL,
    "deductible" DOUBLE PRECISION NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "risk_tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "effective_date" TIMESTAMP(3) NOT NULL,
    "expiration_date" TIMESTAMP(3) NOT NULL,
    "data" JSONB NOT NULL,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "insurance_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_quotes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "coverage_type" TEXT NOT NULL,
    "requested_limit" DOUBLE PRECISION NOT NULL,
    "premium" DOUBLE PRECISION NOT NULL,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "risk_tier" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "data" JSONB NOT NULL,
    "quoted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "insurance_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "insurance_claims" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "policy_id" TEXT NOT NULL,
    "policy_number" TEXT NOT NULL,
    "claim_amount" DOUBLE PRECISION NOT NULL,
    "claim_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'filed',
    "decision_id" TEXT,
    "data" JSONB NOT NULL,
    "filed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "insurance_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_federations" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "admin_org_id" TEXT NOT NULL,
    "admin_contact" TEXT,
    "shared_policies" BOOLEAN NOT NULL DEFAULT true,
    "consolidated_reporting" BOOLEAN NOT NULL DEFAULT true,
    "data_isolation" TEXT NOT NULL DEFAULT 'strict',
    "regulatory_framework" TEXT,
    "reporting_authority" TEXT,
    "compliance_deadline" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "gateway_federations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_federation_members" (
    "id" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "org_name" TEXT NOT NULL,
    "org_code" TEXT,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "policy_override" BOOLEAN NOT NULL DEFAULT false,
    "custom_domains" TEXT[],
    "status" TEXT NOT NULL DEFAULT 'active',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateway_federation_members_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_federation_policies" (
    "id" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "priority" INTEGER NOT NULL DEFAULT 100,
    "action" TEXT NOT NULL DEFAULT 'block',
    "pii_types" TEXT[],
    "blocked_keywords" TEXT[],
    "max_prompt_length" INTEGER,
    "allowed_providers" TEXT[],
    "blocked_providers" TEXT[],
    "applies_to_all" BOOLEAN NOT NULL DEFAULT true,
    "member_org_ids" TEXT[],
    "departments" TEXT[],
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "gateway_federation_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_federation_reports" (
    "id" TEXT NOT NULL,
    "federation_id" TEXT NOT NULL,
    "report_type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "period_start" TIMESTAMP(3) NOT NULL,
    "period_end" TIMESTAMP(3) NOT NULL,
    "total_interactions" INTEGER NOT NULL DEFAULT 0,
    "total_blocked" INTEGER NOT NULL DEFAULT 0,
    "total_pii_detected" INTEGER NOT NULL DEFAULT 0,
    "total_policy_violations" INTEGER NOT NULL DEFAULT 0,
    "member_breakdown" JSONB NOT NULL DEFAULT '{}',
    "provider_breakdown" JSONB NOT NULL DEFAULT '{}',
    "pii_breakdown" JSONB NOT NULL DEFAULT '{}',
    "compliance_score" DOUBLE PRECISION,
    "findings" JSONB NOT NULL DEFAULT '[]',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "integrity_hash" TEXT NOT NULL,
    "signature" TEXT,
    "merkle_root" TEXT,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "submitted_to" TEXT,
    "submitted_at" TIMESTAMP(3),
    "generated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gateway_federation_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gateway_interactions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_email" TEXT NOT NULL,
    "user_department" TEXT NOT NULL DEFAULT 'unknown',
    "provider" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "endpoint" TEXT NOT NULL,
    "method" TEXT NOT NULL DEFAULT 'POST',
    "prompt_text" TEXT NOT NULL,
    "response_text" TEXT,
    "prompt_tokens" INTEGER NOT NULL DEFAULT 0,
    "response_tokens" INTEGER NOT NULL DEFAULT 0,
    "total_tokens" INTEGER NOT NULL DEFAULT 0,
    "pii_detected" BOOLEAN NOT NULL DEFAULT false,
    "pii_types" TEXT[],
    "pii_action" TEXT NOT NULL DEFAULT 'allow',
    "pii_redacted_prompt" TEXT,
    "policy_id" TEXT,
    "policy_action" TEXT NOT NULL DEFAULT 'allow',
    "policy_reason" TEXT,
    "integrity_hash" TEXT NOT NULL,
    "merkle_leaf" TEXT,
    "ledger_entry_index" INTEGER,
    "signature" TEXT,
    "latency_ms" INTEGER NOT NULL DEFAULT 0,
    "provider_latency_ms" INTEGER NOT NULL DEFAULT 0,
    "status_code" INTEGER NOT NULL DEFAULT 200,
    "error_message" TEXT,
    "estimated_cost_usd" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "requested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "responded_at" TIMESTAMP(3),
    "deleted_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gateway_interactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "approvals" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "type" "ApprovalType" NOT NULL,
    "reference_id" TEXT NOT NULL,
    "requester_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "status" "ApprovalStatus" NOT NULL DEFAULT 'PENDING',
    "reviewer_id" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "comments" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "approvals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_regulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "framework_code" TEXT NOT NULL,
    "framework_name" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "effective_date" TIMESTAMP(3),
    "sunset_date" TIMESTAMP(3),
    "source_url" TEXT,
    "raw_content" TEXT,
    "parsed_content" JSONB,
    "status" "PanopticonRegulationStatus" NOT NULL DEFAULT 'ACTIVE',
    "last_ingested_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panopticon_regulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_obligations" (
    "id" TEXT NOT NULL,
    "regulation_id" TEXT NOT NULL,
    "obligation_code" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "requirement_type" "PanopticonRequirementType" NOT NULL,
    "priority" "PanopticonPriority" NOT NULL DEFAULT 'MEDIUM',
    "due_date" TIMESTAMP(3),
    "recurring" BOOLEAN NOT NULL DEFAULT false,
    "recurrence_pattern" TEXT,
    "controls" JSONB NOT NULL DEFAULT '[]',
    "evidence_required" JSONB NOT NULL DEFAULT '[]',
    "automation_status" "PanopticonAutomationStatus" NOT NULL DEFAULT 'MANUAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "panopticon_obligations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_alignments" (
    "id" TEXT NOT NULL,
    "obligation_id" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "entity_name" TEXT NOT NULL,
    "alignment_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "gap_analysis" JSONB,
    "remediation_plan" JSONB,
    "last_assessed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panopticon_alignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_violations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "regulation_id" TEXT NOT NULL,
    "obligation_id" TEXT,
    "violation_type" "PanopticonViolationType" NOT NULL,
    "severity" "PanopticonPriority" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "affected_entities" JSONB NOT NULL DEFAULT '[]',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "evidence" JSONB,
    "status" "PanopticonViolationStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "resolved_at" TIMESTAMP(3),
    "resolved_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panopticon_violations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "panopticon_forecasts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "forecast_type" "PanopticonForecastType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL,
    "impact_score" DOUBLE PRECISION NOT NULL,
    "affected_frameworks" JSONB NOT NULL DEFAULT '[]',
    "recommended_actions" JSONB NOT NULL DEFAULT '[]',
    "horizon_days" INTEGER NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "panopticon_forecasts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethics_principles" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" "EthicsCategory" NOT NULL,
    "weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "status" "PrincipleStatus" NOT NULL DEFAULT 'ACTIVE',
    "requirements" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ethics_principles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ethics_reviews" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "principle_id" TEXT,
    "subject_type" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,
    "subject_name" TEXT NOT NULL,
    "status" "ReviewStatus" NOT NULL DEFAULT 'PENDING',
    "result" "ReviewResult",
    "reviewer" TEXT,
    "notes" TEXT,
    "violations" JSONB NOT NULL DEFAULT '[]',
    "submitted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "ethics_reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bias_checks" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "model_id" TEXT NOT NULL,
    "model_name" TEXT NOT NULL,
    "status" "BiasCheckStatus" NOT NULL DEFAULT 'PENDING',
    "overall_score" DOUBLE PRECISION,
    "dimensions" JSONB NOT NULL DEFAULT '{}',
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "checked_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bias_checks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "govern_policies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'draft',
    "effective_date" TIMESTAMP(3),
    "rules" JSONB NOT NULL DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "govern_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "govern_audits" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "policy_id" TEXT,
    "audit_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "findings" JSONB NOT NULL DEFAULT '[]',
    "risk_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "govern_audits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_items" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "regulation_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "jurisdiction" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "compliance_status" TEXT NOT NULL DEFAULT 'pending',
    "impact_level" TEXT NOT NULL DEFAULT 'medium',
    "required_actions" JSONB NOT NULL DEFAULT '[]',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_documents" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "filename" TEXT NOT NULL,
    "mime_type" TEXT NOT NULL,
    "jurisdiction" TEXT,
    "regulation_type" TEXT,
    "effective_date" TIMESTAMP(3),
    "content_hash" TEXT NOT NULL,
    "content_size" INTEGER NOT NULL,
    "original_content" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "parent_version_id" TEXT,
    "changelog" TEXT,
    "status" "RegulatoryDocStatus" NOT NULL DEFAULT 'PENDING',
    "processing_started" TIMESTAMP(3),
    "processing_completed" TIMESTAMP(3),
    "processing_error" TEXT,
    "review_status" "RegulatoryReviewStatus" NOT NULL DEFAULT 'DRAFT',
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "review_comments" TEXT,
    "detected_language" TEXT,
    "uploaded_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_requirements" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "original_text" TEXT NOT NULL,
    "original_text_hash" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" "RegulatorySeverity" NOT NULL DEFAULT 'MEDIUM',
    "verification_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "verification_method" TEXT,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,
    "deadline" TIMESTAMP(3),
    "penalty_amount" DOUBLE PRECISION,
    "penalty_currency" TEXT,
    "penalty_description" TEXT,
    "affected_processes" JSONB NOT NULL DEFAULT '[]',
    "affected_agents" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_requirements_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_triggers" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "requirement_id" TEXT,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trigger_type" "TriggerType" NOT NULL DEFAULT 'MANUAL',
    "condition_expression" TEXT,
    "action_type" TEXT NOT NULL,
    "action_config" JSONB NOT NULL DEFAULT '{}',
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_triggers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_constraints" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "constraint_type" "ConstraintType" NOT NULL DEFAULT 'ADVISORY',
    "rule_expression" TEXT NOT NULL,
    "applies_to_agents" JSONB NOT NULL DEFAULT '[]',
    "applies_to_decisions" JSONB NOT NULL DEFAULT '[]',
    "is_active" BOOLEAN NOT NULL DEFAULT false,
    "activated_at" TIMESTAMP(3),
    "activated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_constraints_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_conflicts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "document1_id" TEXT NOT NULL,
    "document2_id" TEXT NOT NULL,
    "conflict_type" "ConflictType" NOT NULL DEFAULT 'POTENTIAL',
    "description" TEXT NOT NULL,
    "requirement1_summary" TEXT,
    "requirement2_summary" TEXT,
    "resolution_status" "ConflictResolution" NOT NULL DEFAULT 'UNRESOLVED',
    "resolution_notes" TEXT,
    "resolved_by" TEXT,
    "resolved_at" TIMESTAMP(3),
    "ai_recommendation" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_conflicts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "regulatory_audit_logs" (
    "id" TEXT NOT NULL,
    "document_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor_id" TEXT,
    "actor_type" TEXT NOT NULL DEFAULT 'user',
    "details" JSONB NOT NULL DEFAULT '{}',
    "previous_hash" TEXT,
    "entry_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "regulatory_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constitutional_disputes" (
    "id" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'filed',
    "petitioner" JSONB NOT NULL,
    "respondent" JSONB NOT NULL,
    "deliberation_id" TEXT,
    "vertical_id" TEXT,
    "organization_id" TEXT NOT NULL,
    "precedents_applied" TEXT[],
    "data" JSONB,
    "filed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "hearing_at" TIMESTAMP(3),
    "resolved_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "constitutional_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "constitutional_opinions" (
    "id" TEXT NOT NULL,
    "dispute_id" TEXT NOT NULL,
    "case_number" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "ruling" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "rationale" TEXT NOT NULL,
    "holdings" TEXT[],
    "principles_applied" TEXT[],
    "precedent_strength" TEXT NOT NULL DEFAULT 'binding',
    "authoring_judge" TEXT NOT NULL,
    "opinion_hash" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "drafted_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finalized_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "constitutional_opinions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "accountability_records" (
    "id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "deliberation_id" TEXT,
    "organization_id" TEXT NOT NULL,
    "human_authority_name" TEXT NOT NULL,
    "human_authority_role" TEXT NOT NULL,
    "human_authority_dept" TEXT,
    "action_taken" TEXT NOT NULL,
    "justification" TEXT NOT NULL,
    "accepted_risks" TEXT[],
    "risk_acknowledgment" TEXT NOT NULL,
    "ai_recommendation" TEXT,
    "ai_confidence_score" DOUBLE PRECISION,
    "dissents_overridden" TEXT[],
    "signature_algorithm" TEXT NOT NULL DEFAULT 'RSA-SHA256',
    "signature" TEXT NOT NULL,
    "public_key_fp" TEXT,
    "previous_record_hash" TEXT,
    "record_hash" TEXT NOT NULL,
    "witnesses" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "accountability_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "delegation_records" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "from_name" TEXT NOT NULL,
    "from_role" TEXT NOT NULL,
    "to_name" TEXT NOT NULL,
    "to_role" TEXT NOT NULL,
    "scope" TEXT[],
    "constraints" TEXT[],
    "valid_from" TIMESTAMP(3) NOT NULL,
    "valid_until" TIMESTAMP(3) NOT NULL,
    "signature" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "delegation_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "drift_snapshots" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "snapshot_type" TEXT NOT NULL,
    "primitive" TEXT,
    "score" DOUBLE PRECISION NOT NULL,
    "max_score" DOUBLE PRECISION,
    "metadata" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "drift_snapshots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bias_analyses" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "deliberation_title" TEXT NOT NULL,
    "analyzed_by" TEXT NOT NULL,
    "biases_detected" JSONB NOT NULL,
    "overall_risk" TEXT NOT NULL,
    "bias_count" INTEGER NOT NULL,
    "high_risk_count" INTEGER NOT NULL,
    "rubber_stamp_detected" BOOLEAN NOT NULL DEFAULT false,
    "rubber_stamp_reason" TEXT,
    "duration_minutes" DOUBLE PRECISION,
    "min_expected_minutes" DOUBLE PRECISION,
    "groupthink_indicators" JSONB,
    "recommendations" TEXT[],
    "analysis_hash" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bias_analyses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "meta_governance_reports" (
    "id" TEXT NOT NULL,
    "agent_id" TEXT NOT NULL,
    "agent_name" TEXT NOT NULL,
    "drift_warnings" JSONB NOT NULL,
    "risk_report" JSONB NOT NULL,
    "recommendations" JSONB NOT NULL,
    "health_score" JSONB NOT NULL,
    "interventions" JSONB NOT NULL,
    "analysis_window" JSONB NOT NULL,
    "execution_seed" INTEGER,
    "execution_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "meta_governance_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "deterministic_replay_states" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "master_seed" TEXT NOT NULL,
    "execution_env" JSONB NOT NULL,
    "random_state" JSONB NOT NULL,
    "model_state" JSONB NOT NULL,
    "input_state" JSONB NOT NULL,
    "output_state" JSONB NOT NULL,
    "state_hash" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "verified_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "deterministic_replay_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "data_diode_events" (
    "id" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "file_name" TEXT NOT NULL,
    "file_size" INTEGER NOT NULL,
    "file_hash" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "signature_valid" BOOLEAN,
    "signed_by" TEXT,
    "scan_result" TEXT,
    "scan_engine" TEXT,
    "records_extracted" INTEGER,
    "bytes_processed" INTEGER,
    "target_system" TEXT,
    "error_message" TEXT,
    "ledger_hash" TEXT,
    "detected_at" TIMESTAMP(3) NOT NULL,
    "quarantined_at" TIMESTAMP(3),
    "scanned_at" TIMESTAMP(3),
    "parsed_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "data_diode_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "service_records" (
    "id" TEXT NOT NULL,
    "service_name" TEXT NOT NULL,
    "record_type" TEXT NOT NULL,
    "organization_id" TEXT,
    "reference_id" TEXT,
    "data" JSONB NOT NULL,
    "hash" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "service_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_twins" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "department" TEXT,
    "personality_config" JSONB NOT NULL DEFAULT '{}',
    "knowledge_domains" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "training_status" TEXT NOT NULL DEFAULT 'pending',
    "accuracy_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "interactions" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_twins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "persona_conversations" (
    "id" TEXT NOT NULL,
    "twin_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "messages" JSONB NOT NULL DEFAULT '[]',
    "satisfaction" DOUBLE PRECISION,
    "duration_ms" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "persona_conversations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autopilot_rules" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "trigger_type" TEXT NOT NULL,
    "trigger_config" JSONB NOT NULL DEFAULT '{}',
    "action_type" TEXT NOT NULL,
    "action_config" JSONB NOT NULL DEFAULT '{}',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "trigger_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopilot_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "autopilot_executions" (
    "id" TEXT NOT NULL,
    "rule_id" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "duration_ms" INTEGER,
    "executed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "autopilot_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_simulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,
    "adversary_profile" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "results" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redteam_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_vulnerabilities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "simulation_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "attack_vector" TEXT NOT NULL,
    "target_system" TEXT NOT NULL,
    "steps" JSONB NOT NULL DEFAULT '[]',
    "damage_estimate" JSONB NOT NULL DEFAULT '{}',
    "probability_of_success" DECIMAL(5,2),
    "detection_difficulty" DECIMAL(5,2),
    "severity" TEXT NOT NULL DEFAULT 'medium',
    "status" TEXT NOT NULL DEFAULT 'active',
    "discovered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mitigated_at" TIMESTAMP(3),

    CONSTRAINT "redteam_vulnerabilities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "redteam_patches" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "vulnerability_id" TEXT NOT NULL,
    "patch_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "reversible" BOOLEAN NOT NULL DEFAULT true,
    "original_state" JSONB,
    "applied_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'pending',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "redteam_patches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_learning_paths" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source_decision_id" TEXT,
    "modules" JSONB NOT NULL DEFAULT '[]',
    "estimated_duration" INTEGER NOT NULL DEFAULT 0,
    "difficulty" TEXT NOT NULL DEFAULT 'intermediate',
    "skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "progress" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'not_started',
    "deadline" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "gnosis_learning_paths_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_decision_impacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "deliberation_id" TEXT NOT NULL,
    "decision_title" TEXT NOT NULL,
    "affected_roles" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "required_skills" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "urgency" TEXT NOT NULL DEFAULT 'within_week',
    "impact_level" TEXT NOT NULL DEFAULT 'moderate',
    "learning_path_ids" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "estimated_reskill_hours" INTEGER NOT NULL DEFAULT 0,
    "affected_employee_count" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "gnosis_decision_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "gnosis_assessments" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "skill" TEXT NOT NULL,
    "questions" JSONB NOT NULL DEFAULT '[]',
    "results" JSONB,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "gnosis_assessments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_runs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "scenarios_tested" INTEGER NOT NULL DEFAULT 0,
    "scenarios_survived" INTEGER NOT NULL DEFAULT 0,
    "survival_rate" DECIMAL(5,2) NOT NULL,
    "critical_count" INTEGER NOT NULL DEFAULT 0,
    "high_count" INTEGER NOT NULL DEFAULT 0,
    "medium_count" INTEGER NOT NULL DEFAULT 0,
    "low_count" INTEGER NOT NULL DEFAULT 0,
    "apotheosis_score" DECIMAL(5,2) NOT NULL,
    "previous_score" DECIMAL(5,2) NOT NULL,
    "score_delta" DECIMAL(5,2) NOT NULL,
    "shadow_council_instances" INTEGER NOT NULL DEFAULT 0,
    "compute_hours" DECIMAL(8,2) NOT NULL,
    "duration_minutes" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_runs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_weaknesses" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "exploit_scenario" TEXT NOT NULL,
    "damage_estimate" DECIMAL(12,2) NOT NULL,
    "fix_complexity" TEXT NOT NULL,
    "recommended_fix" TEXT NOT NULL,
    "auto_fixable" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "discovered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "apotheosis_weaknesses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_auto_patches" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "weakness_id" TEXT NOT NULL,
    "patch_type" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "before_state" TEXT NOT NULL,
    "after_state" TEXT NOT NULL,
    "reversible" BOOLEAN NOT NULL DEFAULT true,
    "budget_impact" DECIMAL(12,2) NOT NULL,
    "applied_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "rollback_available" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "apotheosis_auto_patches_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_escalations" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "weakness_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "estimated_cost_to_fix" DECIMAL(12,2) NOT NULL,
    "risk_if_not_fixed" DECIMAL(12,2) NOT NULL,
    "assigned_to" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "response_at" TIMESTAMP(3),
    "response" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_escalations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_upskill_assignments" (
    "id" TEXT NOT NULL,
    "run_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "user_name" TEXT NOT NULL,
    "skill_gap" TEXT NOT NULL,
    "weakness_id" TEXT NOT NULL,
    "training_module" TEXT NOT NULL,
    "estimated_hours" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'assigned',
    "progress" INTEGER NOT NULL DEFAULT 0,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_upskill_assignments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_pattern_bans" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "pattern" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "instances" JSONB NOT NULL DEFAULT '[]',
    "failure_rate" DECIMAL(5,2) NOT NULL,
    "total_cost" DECIMAL(12,2) NOT NULL,
    "banned_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "banned_by" TEXT NOT NULL DEFAULT 'apotheosis',
    "status" TEXT NOT NULL DEFAULT 'active',
    "override_requires" TEXT NOT NULL,

    CONSTRAINT "apotheosis_pattern_bans_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_scores" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "overall" DECIMAL(5,2) NOT NULL,
    "red_team_survival" DECIMAL(5,2) NOT NULL,
    "weakness_closure" DECIMAL(5,2) NOT NULL,
    "decision_success" DECIMAL(5,2) NOT NULL,
    "human_readiness" DECIMAL(5,2) NOT NULL,
    "pattern_health" DECIMAL(5,2) NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_scores_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "apotheosis_configs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "run_frequency" TEXT NOT NULL DEFAULT 'nightly',
    "run_time" TEXT NOT NULL DEFAULT '03:00',
    "scenario_count" INTEGER NOT NULL DEFAULT 1000,
    "auto_patch_threshold" DECIMAL(12,2) NOT NULL,
    "escalation_timeout" INTEGER NOT NULL DEFAULT 72,
    "pattern_ban_threshold" INTEGER NOT NULL DEFAULT 3,
    "training_deadline" INTEGER NOT NULL DEFAULT 72,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "apotheosis_configs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blackbox_units" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" "BlackboxStatus" NOT NULL DEFAULT 'OPERATIONAL',
    "location" JSONB NOT NULL DEFAULT '{}',
    "specifications" JSONB NOT NULL DEFAULT '{}',
    "health_metrics" JSONB NOT NULL DEFAULT '{}',
    "last_sync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_verification" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blackbox_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_network_stats" (
    "id" TEXT NOT NULL,
    "recorded_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "total_participants" INTEGER NOT NULL DEFAULT 0,
    "active_today" INTEGER NOT NULL DEFAULT 0,
    "data_points_shared" BIGINT NOT NULL DEFAULT 0,
    "insights_generated" INTEGER NOT NULL DEFAULT 0,
    "avg_response_ms" INTEGER NOT NULL DEFAULT 0,
    "privacy_score" DOUBLE PRECISION NOT NULL DEFAULT 99.9,
    "uptime_percent" DOUBLE PRECISION NOT NULL DEFAULT 99.99,

    CONSTRAINT "mesh_network_stats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_participants" (
    "id" TEXT NOT NULL,
    "anonymous_id" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "region" TEXT NOT NULL,
    "employee_range" TEXT NOT NULL,
    "revenue_range" TEXT NOT NULL,
    "contribution_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "data_quality" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "last_active" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesh_participants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_benchmarks" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "p25_value" DOUBLE PRECISION NOT NULL,
    "p50_value" DOUBLE PRECISION NOT NULL,
    "p75_value" DOUBLE PRECISION NOT NULL,
    "p90_value" DOUBLE PRECISION NOT NULL,
    "trend" TEXT NOT NULL DEFAULT 'stable',
    "trend_percent" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "unit" TEXT NOT NULL,
    "participants" INTEGER NOT NULL DEFAULT 0,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "mesh_benchmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "mesh_risk_signals" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "severity" TEXT NOT NULL,
    "affected_industries" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "affected_regions" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "sources" INTEGER NOT NULL DEFAULT 0,
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_until" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "mesh_risk_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_settings" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "encrypted" BOOLEAN NOT NULL DEFAULT false,
    "category" TEXT NOT NULL,
    "updated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admin_settings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "api_keys" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "key_hash" TEXT NOT NULL,
    "key_prefix" TEXT NOT NULL,
    "scopes" JSONB NOT NULL DEFAULT '[]',
    "last_used_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "revoked_at" TIMESTAMP(3),

    CONSTRAINT "api_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "user_id" TEXT,
    "action" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "demo_requests" (
    "id" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "company" TEXT NOT NULL,
    "job_title" TEXT NOT NULL,
    "company_size" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "primary_interest" TEXT NOT NULL,
    "additional_notes" TEXT,
    "marketing_consent" BOOLEAN NOT NULL DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'new',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "demo_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "execution_nodes" (
    "id" TEXT NOT NULL,
    "execution_id" TEXT NOT NULL,
    "node_id" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "input" JSONB NOT NULL DEFAULT '{}',
    "output" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "duration" INTEGER,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "execution_nodes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "scenarios" (
    "id" TEXT NOT NULL,
    "forecast_id" TEXT,
    "name" TEXT NOT NULL,
    "assumptions" JSONB NOT NULL DEFAULT '[]',
    "projections" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflow_executions" (
    "id" TEXT NOT NULL,
    "workflow_id" TEXT NOT NULL,
    "status" "ExecutionStatus" NOT NULL DEFAULT 'PENDING',
    "parameters" JSONB NOT NULL DEFAULT '{}',
    "current_node" TEXT,
    "progress" INTEGER NOT NULL DEFAULT 0,
    "outputs" JSONB NOT NULL DEFAULT '{}',
    "error" TEXT,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "workflow_executions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "workflows" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT,
    "trigger" JSONB NOT NULL,
    "definition" JSONB NOT NULL,
    "status" "WorkflowStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "workflows_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "omnitranslate_glossaries" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL DEFAULT '',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "omnitranslate_glossaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "omnitranslate_glossary" (
    "id" TEXT NOT NULL,
    "glossary_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "translations" JSONB NOT NULL DEFAULT '{}',
    "case_sensitive" BOOLEAN NOT NULL DEFAULT false,
    "context" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "omnitranslate_glossary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "omnitranslate_memory" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_text" TEXT NOT NULL,
    "source_language" TEXT NOT NULL,
    "target_text" TEXT NOT NULL,
    "target_language" TEXT NOT NULL,
    "context" TEXT NOT NULL DEFAULT 'general',
    "quality" DECIMAL(3,2) NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "omnitranslate_memory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "schema_mappings" (
    "id" TEXT NOT NULL,
    "data_source_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "table_mappings" JSONB NOT NULL DEFAULT '[]',
    "version" INTEGER NOT NULL DEFAULT 1,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "schema_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenants" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" "TenantPlan" NOT NULL DEFAULT 'TRIAL',
    "status" "TenantStatus" NOT NULL DEFAULT 'TRIAL',
    "user_count" INTEGER NOT NULL DEFAULT 0,
    "user_limit" INTEGER NOT NULL DEFAULT 10,
    "mrr" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "billing_email" TEXT,
    "primary_contact" TEXT,
    "industry" TEXT,
    "company_size" TEXT,
    "country" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "settings" JSONB NOT NULL DEFAULT '{}',
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "trial_ends_at" TIMESTAMP(3),
    "subscription_ends_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deleted_at" TIMESTAMP(3),

    CONSTRAINT "tenants_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "licenses" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "license_key" TEXT NOT NULL,
    "type" "LicenseType" NOT NULL DEFAULT 'TRIAL',
    "status" "LicenseStatus" NOT NULL DEFAULT 'ACTIVE',
    "seats" INTEGER NOT NULL DEFAULT 10,
    "seats_used" INTEGER NOT NULL DEFAULT 0,
    "features" JSONB NOT NULL DEFAULT '[]',
    "billing_cycle" "BillingCycle" NOT NULL DEFAULT 'MONTHLY',
    "revenue" DECIMAL(10,2) NOT NULL DEFAULT 0,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "auto_renew" BOOLEAN NOT NULL DEFAULT false,
    "renewal_price" DECIMAL(10,2),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "licenses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_usage" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "api_calls" INTEGER NOT NULL DEFAULT 0,
    "deliberations" INTEGER NOT NULL DEFAULT 0,
    "active_users" INTEGER NOT NULL DEFAULT 0,
    "storage_used_mb" INTEGER NOT NULL DEFAULT 0,
    "agent_invocations" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_usage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "feature_flags" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "type" "FeatureFlagType" NOT NULL DEFAULT 'BOOLEAN',
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB NOT NULL DEFAULT 'null',
    "rollout_percentage" INTEGER,
    "category" TEXT NOT NULL DEFAULT 'core',
    "environment" TEXT NOT NULL DEFAULT 'all',
    "created_by" TEXT,
    "last_toggled_at" TIMESTAMP(3),
    "last_toggled_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tenant_feature_flags" (
    "id" TEXT NOT NULL,
    "tenant_id" TEXT NOT NULL,
    "feature_flag_id" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT false,
    "value" JSONB NOT NULL DEFAULT 'null',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tenant_feature_flags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "system_alerts" (
    "id" TEXT NOT NULL,
    "severity" "AlertSeverity" NOT NULL DEFAULT 'INFO',
    "service" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "acknowledged" BOOLEAN NOT NULL DEFAULT false,
    "acknowledged_at" TIMESTAMP(3),
    "acknowledged_by" TEXT,
    "resolved" BOOLEAN NOT NULL DEFAULT false,
    "resolved_at" TIMESTAMP(3),
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "system_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_simulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "simulation_type" "CrucibleSimulationType" NOT NULL,
    "status" "CrucibleSimulationStatus" NOT NULL DEFAULT 'DRAFT',
    "config" JSONB NOT NULL,
    "digital_twin_snapshot" JSONB,
    "scenario_definition" JSONB NOT NULL,
    "monte_carlo_runs" INTEGER NOT NULL DEFAULT 1000,
    "confidence_level" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "time_horizon_days" INTEGER NOT NULL DEFAULT 365,
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "results_summary" JSONB,

    CONSTRAINT "crucible_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_universes" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "universe_number" INTEGER NOT NULL,
    "parent_universe" TEXT,
    "branch_point" TEXT,
    "probability" DOUBLE PRECISION NOT NULL,
    "state_snapshot" JSONB NOT NULL,
    "kpi_projections" JSONB NOT NULL,
    "risk_scores" JSONB NOT NULL,
    "outcome_summary" TEXT,
    "outcome_sentiment" "CrucibleOutcomeSentiment" NOT NULL DEFAULT 'NEUTRAL',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_universes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_impacts" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "impact_category" "CrucibleImpactCategory" NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" TEXT,
    "entity_name" TEXT NOT NULL,
    "baseline_value" DOUBLE PRECISION,
    "projected_value" DOUBLE PRECISION,
    "change_percent" DOUBLE PRECISION,
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.95,
    "severity" "CrucibleSeverity" NOT NULL DEFAULT 'LOW',
    "description" TEXT,
    "propagation_path" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_failure_cascades" (
    "id" TEXT NOT NULL,
    "universe_id" TEXT NOT NULL,
    "trigger_event" TEXT NOT NULL,
    "cascade_depth" INTEGER NOT NULL DEFAULT 0,
    "affected_nodes" JSONB NOT NULL,
    "propagation_time" INTEGER,
    "total_impact" DOUBLE PRECISION,
    "visualization" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_failure_cascades_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_council_deliberations" (
    "id" TEXT NOT NULL,
    "simulation_id" TEXT NOT NULL,
    "universe_id" TEXT,
    "scenario_context" TEXT NOT NULL,
    "agent_responses" JSONB NOT NULL,
    "consensus_reached" BOOLEAN NOT NULL DEFAULT false,
    "final_recommendation" TEXT,
    "confidence_score" DOUBLE PRECISION,
    "deliberation_log" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_council_deliberations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_redteam_reports" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "run_type" TEXT NOT NULL,
    "started_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3) NOT NULL,
    "total_tests" INTEGER NOT NULL,
    "passed_tests" INTEGER NOT NULL,
    "failed_tests" INTEGER NOT NULL,
    "critical_findings" INTEGER NOT NULL,
    "high_findings" INTEGER NOT NULL,
    "medium_findings" INTEGER NOT NULL,
    "low_findings" INTEGER NOT NULL,
    "informational_findings" INTEGER NOT NULL,
    "security_score" INTEGER NOT NULL,
    "results" JSONB NOT NULL,
    "compliance_status" JSONB NOT NULL,
    "evidence_hash" TEXT NOT NULL,
    "signature" TEXT,
    "signed_at" TIMESTAMP(3),
    "signed_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_redteam_reports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_sbom" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "version" TEXT NOT NULL,
    "format" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "packages" INTEGER NOT NULL,
    "vulnerabilities" INTEGER NOT NULL,
    "critical_vulns" INTEGER NOT NULL,
    "high_vulns" INTEGER NOT NULL,
    "medium_vulns" INTEGER NOT NULL,
    "low_vulns" INTEGER NOT NULL,
    "signature" TEXT,
    "signed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_sbom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "crucible_runtime_events" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "severity" "CrucibleSeverity" NOT NULL,
    "source" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "metadata" JSONB,
    "mitigated" BOOLEAN NOT NULL DEFAULT false,
    "mitigated_at" TIMESTAMP(3),
    "mitigated_by" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "crucible_runtime_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_signals" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "signal_type" "AegisSignalType" NOT NULL,
    "source" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "severity" "AegisSeverity" NOT NULL DEFAULT 'LOW',
    "confidence" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "location" TEXT,
    "entities_mentioned" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "raw_data" JSONB,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_threats" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "signal_id" TEXT,
    "threat_type" "AegisThreatType" NOT NULL,
    "threat_actor" TEXT,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "AegisSeverity" NOT NULL,
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "impact_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "affected_assets" JSONB NOT NULL DEFAULT '[]',
    "attack_vectors" JSONB NOT NULL DEFAULT '[]',
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "status" "AegisThreatStatus" NOT NULL DEFAULT 'ACTIVE',
    "first_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "last_seen_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "mitigated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_scenarios" (
    "id" TEXT NOT NULL,
    "threat_id" TEXT NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "trigger_conditions" JSONB NOT NULL,
    "cascade_effects" JSONB NOT NULL,
    "affected_systems" JSONB NOT NULL DEFAULT '[]',
    "financial_impact" DOUBLE PRECISION,
    "operational_impact" DOUBLE PRECISION,
    "reputational_impact" DOUBLE PRECISION,
    "recovery_time_hours" INTEGER,
    "probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "simulation_results" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_scenarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_countermeasures" (
    "id" TEXT NOT NULL,
    "threat_id" TEXT NOT NULL,
    "countermeasure_type" "AegisCountermeasureType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "implementation" JSONB NOT NULL,
    "cost_estimate" DOUBLE PRECISION,
    "effectiveness" DOUBLE PRECISION NOT NULL DEFAULT 0.7,
    "time_to_implement" INTEGER,
    "dependencies" JSONB NOT NULL DEFAULT '[]',
    "status" "AegisCountermeasureStatus" NOT NULL DEFAULT 'PROPOSED',
    "implemented_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_countermeasures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "aegis_briefings" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "threat_id" TEXT,
    "briefing_type" "AegisBriefingType" NOT NULL,
    "title" TEXT NOT NULL,
    "executive_summary" TEXT NOT NULL,
    "detailed_analysis" TEXT NOT NULL,
    "recommendations" JSONB NOT NULL DEFAULT '[]',
    "attachments" JSONB NOT NULL DEFAULT '[]',
    "classification" "AegisClassification" NOT NULL DEFAULT 'INTERNAL',
    "recipients" JSONB NOT NULL DEFAULT '[]',
    "sent_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "aegis_briefings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_threats" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "threat_type" "ThreatType" NOT NULL,
    "severity" "ThreatSeverity" NOT NULL,
    "status" "ThreatStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "source" TEXT,
    "target" TEXT,
    "indicators" JSONB NOT NULL DEFAULT '[]',
    "mitigations" JSONB NOT NULL DEFAULT '[]',
    "detected_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "security_threats_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_policies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "policy_type" "PolicyType" NOT NULL,
    "rules" JSONB NOT NULL DEFAULT '[]',
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "enforcement" "PolicyEnforcement" NOT NULL DEFAULT 'WARN',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "security_policies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "security_audit_logs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "actor" TEXT NOT NULL,
    "resource_type" TEXT NOT NULL,
    "resource_id" TEXT,
    "details" JSONB NOT NULL DEFAULT '{}',
    "ip_address" TEXT,
    "user_agent" TEXT,
    "risk_level" "RiskLevel" NOT NULL DEFAULT 'LOW',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "security_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "honeytokens" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "token_type" "HoneytokenType" NOT NULL,
    "name" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "placement" TEXT NOT NULL,
    "alert_level" "AlertLevel" NOT NULL DEFAULT 'HIGH',
    "triggered" BOOLEAN NOT NULL DEFAULT false,
    "trigger_count" INTEGER NOT NULL DEFAULT 0,
    "last_triggered" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "honeytokens_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "canary_alerts" (
    "id" TEXT NOT NULL,
    "canary_id" TEXT NOT NULL,
    "event_type" "CanaryEventType" NOT NULL,
    "source_ip" TEXT NOT NULL,
    "source_port" INTEGER,
    "details" JSONB NOT NULL DEFAULT '{}',
    "severity" "AlertLevel" NOT NULL,
    "analyzed" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "canary_alerts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hardware_keys" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "key_type" "HardwareKeyType" NOT NULL,
    "assigned_to" TEXT,
    "assigned_name" TEXT,
    "status" "KeyStatus" NOT NULL DEFAULT 'ACTIVE',
    "capabilities" JSONB NOT NULL DEFAULT '[]',
    "public_key" TEXT NOT NULL,
    "usage_count" INTEGER NOT NULL DEFAULT 0,
    "last_used" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "hardware_keys_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "auth_challenges" (
    "id" TEXT NOT NULL,
    "key_id" TEXT NOT NULL,
    "challenge" TEXT NOT NULL,
    "operation" TEXT NOT NULL,
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "expires_at" TIMESTAMP(3) NOT NULL,
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "auth_challenges_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "high_risk_operations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "operation_type" "OperationType" NOT NULL,
    "description" TEXT NOT NULL,
    "threshold" JSONB NOT NULL DEFAULT '{}',
    "requires_key" BOOLEAN NOT NULL DEFAULT true,
    "requires_biometric" BOOLEAN NOT NULL DEFAULT false,
    "cooldown_seconds" INTEGER NOT NULL DEFAULT 60,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "high_risk_operations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "key_audit_logs" (
    "id" TEXT NOT NULL,
    "key_id" TEXT NOT NULL,
    "event" "KeyEvent" NOT NULL,
    "details" TEXT,
    "actor" TEXT NOT NULL,
    "ip_address" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "key_audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_entries" (
    "id" TEXT NOT NULL,
    "entry_index" INTEGER NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" TEXT NOT NULL,
    "event_id" TEXT NOT NULL,
    "event_data" JSONB NOT NULL,
    "previous_hash" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "signature" TEXT,
    "nonce" TEXT,
    "merkle_root" TEXT,
    "block_number" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ledger_blocks" (
    "block_number" INTEGER NOT NULL,
    "block_hash" TEXT NOT NULL,
    "previous_block_hash" TEXT NOT NULL,
    "merkle_root" TEXT NOT NULL,
    "entry_count" INTEGER NOT NULL,
    "first_entry_index" INTEGER NOT NULL,
    "last_entry_index" INTEGER NOT NULL,
    "witness" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ledger_blocks_pkey" PRIMARY KEY ("block_number")
);

-- CreateTable
CREATE TABLE "eternal_artifacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "artifact_type" "EternalArtifactType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "content_hash" TEXT NOT NULL,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "importance_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "retention_years" INTEGER NOT NULL DEFAULT 100,
    "access_level" "EternalAccessLevel" NOT NULL DEFAULT 'ORGANIZATION',
    "format_version" TEXT NOT NULL DEFAULT '1.0',
    "original_format" TEXT,
    "migrated_formats" JSONB NOT NULL DEFAULT '[]',
    "verification_status" "EternalVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "last_verified_at" TIMESTAMP(3),
    "created_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "eternal_artifacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_validations" (
    "id" TEXT NOT NULL,
    "artifact_id" TEXT NOT NULL,
    "validation_type" "EternalValidationType" NOT NULL,
    "validator" TEXT NOT NULL,
    "previous_hash" TEXT NOT NULL,
    "current_hash" TEXT NOT NULL,
    "integrity_check" BOOLEAN NOT NULL DEFAULT true,
    "drift_detected" BOOLEAN NOT NULL DEFAULT false,
    "drift_details" JSONB,
    "correction_applied" BOOLEAN NOT NULL DEFAULT false,
    "validated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eternal_validations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_migrations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "migration_type" "EternalMigrationType" NOT NULL,
    "source_format" TEXT NOT NULL,
    "target_format" TEXT NOT NULL,
    "artifacts_affected" INTEGER NOT NULL,
    "status" "EternalMigrationStatus" NOT NULL DEFAULT 'PENDING',
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "error_log" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eternal_migrations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "eternal_succession" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "successor_type" "EternalSuccessorType" NOT NULL,
    "successor_name" TEXT NOT NULL,
    "successor_contact" TEXT NOT NULL,
    "verification_method" TEXT NOT NULL,
    "access_conditions" JSONB NOT NULL,
    "artifacts_scope" JSONB NOT NULL DEFAULT '[]',
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "activated_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "eternal_succession_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_entities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_type" "SymbiontEntityType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "domain" TEXT,
    "website" TEXT,
    "location" TEXT,
    "size_category" "SymbiontSizeCategory",
    "financial_health" DOUBLE PRECISION,
    "reputation_score" DOUBLE PRECISION,
    "data_sources" JSONB NOT NULL DEFAULT '[]',
    "tags" JSONB NOT NULL DEFAULT '[]',
    "last_analyzed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symbiont_entities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_opportunities" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_id" TEXT,
    "opportunity_type" "SymbiontOpportunityType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "strategic_fit" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "financial_potential" DOUBLE PRECISION,
    "risk_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "synergy_areas" JSONB NOT NULL DEFAULT '[]',
    "required_resources" JSONB NOT NULL DEFAULT '[]',
    "timeline_months" INTEGER,
    "status" "SymbiontOpportunityStatus" NOT NULL DEFAULT 'IDENTIFIED',
    "ai_analysis" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symbiont_opportunities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_relationships" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "entity_id" TEXT NOT NULL,
    "related_entity_id" TEXT NOT NULL,
    "relationship_type" "SymbiontRelationshipType" NOT NULL,
    "strength" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "sentiment" "SymbiontSentiment" NOT NULL DEFAULT 'NEUTRAL',
    "interaction_history" JSONB NOT NULL DEFAULT '[]',
    "health_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "last_interaction" TIMESTAMP(3),
    "notes" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "symbiont_relationships_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "symbiont_simulations" (
    "id" TEXT NOT NULL,
    "opportunity_id" TEXT NOT NULL,
    "simulation_type" "SymbiontSimulationType" NOT NULL,
    "scenario_name" TEXT NOT NULL,
    "parameters" JSONB NOT NULL,
    "projected_outcomes" JSONB NOT NULL,
    "financial_model" JSONB,
    "risk_analysis" JSONB,
    "integration_plan" JSONB,
    "success_probability" DOUBLE PRECISION NOT NULL DEFAULT 0.5,
    "recommendation" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "symbiont_simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_stakeholders" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "stakeholder_type" "VoxStakeholderType" NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "population_size" INTEGER,
    "representation_method" TEXT NOT NULL,
    "voice_weight" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "veto_rights" JSONB NOT NULL DEFAULT '[]',
    "data_sources" JSONB NOT NULL DEFAULT '[]',
    "ai_proxy_config" JSONB,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "vox_stakeholders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_signals" (
    "id" TEXT NOT NULL,
    "stakeholder_id" TEXT NOT NULL,
    "signal_type" "VoxSignalType" NOT NULL,
    "source" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sentiment" "VoxSentiment" NOT NULL,
    "sentiment_score" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "urgency" "VoxUrgency" NOT NULL DEFAULT 'NORMAL',
    "topics" JSONB NOT NULL DEFAULT '[]',
    "raw_data" JSONB,
    "processed_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_signals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_impacts" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT,
    "stakeholder_id" TEXT NOT NULL,
    "impact_type" "VoxImpactType" NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "severity" "VoxSeverity" NOT NULL DEFAULT 'MODERATE',
    "affected_count" INTEGER,
    "financial_impact" DOUBLE PRECISION,
    "duration" TEXT,
    "mitigation_options" JSONB NOT NULL DEFAULT '[]',
    "stakeholder_response" JSONB,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_impacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_votes" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "stakeholder_id" TEXT NOT NULL,
    "vote_type" "VoxVoteType" NOT NULL,
    "vote_value" "VoxVoteValue" NOT NULL,
    "reasoning" TEXT,
    "ai_generated" BOOLEAN NOT NULL DEFAULT false,
    "weight_applied" DOUBLE PRECISION NOT NULL DEFAULT 1.0,
    "veto_exercised" BOOLEAN NOT NULL DEFAULT false,
    "veto_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vox_assemblies" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "decision_id" TEXT NOT NULL,
    "assembly_type" "VoxAssemblyType" NOT NULL,
    "title" TEXT NOT NULL,
    "agenda" TEXT NOT NULL,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "deliberation_log" JSONB NOT NULL DEFAULT '[]',
    "consensus_reached" BOOLEAN NOT NULL DEFAULT false,
    "final_verdict" "VoxVoteValue",
    "dissenting_voices" JSONB NOT NULL DEFAULT '[]',
    "conditions" JSONB NOT NULL DEFAULT '[]',
    "scheduled_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vox_assemblies_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "simulations" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "baseline_snapshot" TEXT NOT NULL,
    "modifications" JSONB NOT NULL DEFAULT '[]',
    "results" JSONB,
    "status" "SimulationStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completed_at" TIMESTAMP(3),

    CONSTRAINT "simulations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "witness_records" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "event_type" "WitnessEventType" NOT NULL,
    "event_id" TEXT NOT NULL,
    "participants" JSONB NOT NULL DEFAULT '[]',
    "content" JSONB NOT NULL,
    "content_hash" TEXT NOT NULL,
    "attestations" JSONB NOT NULL DEFAULT '[]',
    "legal_relevance" "LegalRelevance" NOT NULL DEFAULT 'LOW',
    "retention_policy" TEXT,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "witness_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "legal_holds" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "scope" JSONB NOT NULL DEFAULT '[]',
    "custodians" JSONB NOT NULL DEFAULT '[]',
    "status" "LegalHoldStatus" NOT NULL DEFAULT 'ACTIVE',
    "created_by" TEXT NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "end_date" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "legal_holds_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "custody_events" (
    "id" TEXT NOT NULL,
    "record_id" TEXT NOT NULL,
    "action" "CustodyAction" NOT NULL,
    "actor" TEXT NOT NULL,
    "details" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "custody_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "truth_claims" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "category" "ClaimCategory" NOT NULL,
    "subject" TEXT NOT NULL,
    "claim" TEXT NOT NULL,
    "claimant" TEXT NOT NULL,
    "status" "ClaimStatus" NOT NULL DEFAULT 'PENDING',
    "verification" JSONB,
    "metadata" JSONB NOT NULL DEFAULT '{}',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "truth_claims_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_evidence" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "evidence_type" "EvidenceType" NOT NULL,
    "source" TEXT NOT NULL,
    "content" JSONB NOT NULL,
    "reliability" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "submitted_by" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_evidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_votes" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "voter_id" TEXT NOT NULL,
    "voter_role" TEXT NOT NULL,
    "vote" "VoteValue" NOT NULL,
    "rationale" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "claim_votes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "claim_disputes" (
    "id" TEXT NOT NULL,
    "claim_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "disputant" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "counter_claim" TEXT,
    "status" "DisputeStatus" NOT NULL DEFAULT 'OPEN',
    "resolution" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolved_at" TIMESTAMP(3),

    CONSTRAINT "claim_disputes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "source_reliability" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_name" TEXT NOT NULL,
    "reliability_score" DOUBLE PRECISION NOT NULL DEFAULT 50,
    "total_claims" INTEGER NOT NULL DEFAULT 0,
    "accurate_claims" INTEGER NOT NULL DEFAULT 0,
    "last_evaluated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "source_reliability_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "discovery_requests" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "requesting_party" TEXT NOT NULL,
    "scope" JSONB NOT NULL DEFAULT '[]',
    "record_ids" JSONB NOT NULL DEFAULT '[]',
    "status" "DiscoveryStatus" NOT NULL DEFAULT 'PENDING',
    "due_date" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "discovery_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sovereign_blackbox_units" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "serial_number" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'operational',
    "data" JSONB NOT NULL,
    "last_sync" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "registered_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sovereign_blackbox_units_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sovereign_blackbox_jobs" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "blackbox_id" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'scheduled',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "bytes_transferred" BIGINT NOT NULL DEFAULT 0,
    "error" TEXT,
    "data" JSONB NOT NULL,
    "scheduled_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "started_at" TIMESTAMP(3),
    "completed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sovereign_blackbox_jobs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sovereign_blackbox_records" (
    "id" TEXT NOT NULL,
    "blackbox_id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "source_type" TEXT NOT NULL,
    "source_id" TEXT NOT NULL,
    "data_hash" TEXT NOT NULL,
    "size_bytes" BIGINT NOT NULL DEFAULT 0,
    "retention_policy" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "expires_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "verified_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "sovereign_blackbox_records_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sports_transfer_decisions" (
    "id" TEXT NOT NULL,
    "organization_id" TEXT NOT NULL,
    "template_id" TEXT NOT NULL,
    "status" "SportsDecisionStatus" NOT NULL DEFAULT 'DRAFT',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,
    "created_by" TEXT NOT NULL,
    "locked_at" TIMESTAMP(3),
    "audit_hash" TEXT,
    "transaction_type" "TransferType" NOT NULL,
    "player_name" TEXT NOT NULL,
    "player_dob" TIMESTAMP(3),
    "player_position" TEXT,
    "player_nationality" TEXT,
    "counterparty_club" TEXT NOT NULL,
    "counterparty_country" TEXT,
    "counterparty_league" TEXT,
    "transfer_fee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "add_ons" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "agent_fee" DECIMAL(15,2) NOT NULL DEFAULT 0,
    "weekly_wage" DECIMAL(12,2),
    "contract_length_years" INTEGER,
    "total_commitment" DECIMAL(15,2),
    "sell_on_percentage" DECIMAL(5,2),
    "buyback_clause" DECIMAL(15,2),
    "release_clause" DECIMAL(15,2),
    "scouting_matches_observed" INTEGER NOT NULL DEFAULT 0,
    "scouting_video_analysis" BOOLEAN NOT NULL DEFAULT false,
    "scouting_data_profile" TEXT,
    "scouting_character_refs" INTEGER NOT NULL DEFAULT 0,
    "scouting_recommendation" "ScoutingRecommendation",
    "valuation_methodology" TEXT,
    "valuation_market_comparables" TEXT,
    "valuation_internal" DECIMAL(15,2),
    "valuation_data_model" DECIMAL(15,2),
    "valuation_negotiated" DECIMAL(15,2),
    "valuation_premium_pct" DECIMAL(5,2),
    "alternatives_considered" JSONB NOT NULL DEFAULT '[]',
    "compliance_checks" JSONB NOT NULL DEFAULT '[]',
    "timeline" JSONB NOT NULL DEFAULT '[]',

    CONSTRAINT "sports_transfer_decisions_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_user_id_key" ON "email_verifications"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "email_verifications_token_key" ON "email_verifications"("token");

-- CreateIndex
CREATE INDEX "email_verifications_expires_at_idx" ON "email_verifications"("expires_at");

-- CreateIndex
CREATE INDEX "email_verifications_token_idx" ON "email_verifications"("token");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_slug_key" ON "organizations"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "password_resets_token_key" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_token_idx" ON "password_resets"("token");

-- CreateIndex
CREATE INDEX "password_resets_user_id_idx" ON "password_resets"("user_id");

-- CreateIndex
CREATE INDEX "sessions_expires_at_idx" ON "sessions"("expires_at");

-- CreateIndex
CREATE INDEX "sessions_user_id_idx" ON "sessions"("user_id");

-- CreateIndex
CREATE INDEX "translations_language_idx" ON "translations"("language");

-- CreateIndex
CREATE INDEX "translations_namespace_idx" ON "translations"("namespace");

-- CreateIndex
CREATE UNIQUE INDEX "translations_key_language_namespace_key" ON "translations"("key", "language", "namespace");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_email_idx" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_organization_id_idx" ON "users"("organization_id");

-- CreateIndex
CREATE INDEX "prompt_templates_category_idx" ON "prompt_templates"("category");

-- CreateIndex
CREATE INDEX "prompt_templates_name_is_active_idx" ON "prompt_templates"("name", "is_active");

-- CreateIndex
CREATE INDEX "prompt_templates_organization_id_idx" ON "prompt_templates"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "prompt_templates_name_version_key" ON "prompt_templates"("name", "version");

-- CreateIndex
CREATE INDEX "prompt_usages_prompt_template_id_idx" ON "prompt_usages"("prompt_template_id");

-- CreateIndex
CREATE INDEX "prompt_usages_deliberation_id_idx" ON "prompt_usages"("deliberation_id");

-- CreateIndex
CREATE INDEX "prompt_usages_created_at_idx" ON "prompt_usages"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "agents_code_key" ON "agents"("code");

-- CreateIndex
CREATE INDEX "council_queries_organization_id_created_at_idx" ON "council_queries"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "decisions_organization_id_idx" ON "decisions"("organization_id");

-- CreateIndex
CREATE INDEX "decisions_priority_idx" ON "decisions"("priority");

-- CreateIndex
CREATE INDEX "decisions_status_idx" ON "decisions"("status");

-- CreateIndex
CREATE INDEX "deliberation_messages_deliberation_id_created_at_idx" ON "deliberation_messages"("deliberation_id", "created_at");

-- CreateIndex
CREATE INDEX "deliberations_organization_id_status_idx" ON "deliberations"("organization_id", "status");

-- CreateIndex
CREATE UNIQUE INDEX "decision_packets_run_id_key" ON "decision_packets"("run_id");

-- CreateIndex
CREATE INDEX "decision_packets_organization_id_idx" ON "decision_packets"("organization_id");

-- CreateIndex
CREATE INDEX "decision_packets_session_id_idx" ON "decision_packets"("session_id");

-- CreateIndex
CREATE INDEX "decision_packets_deliberation_id_idx" ON "decision_packets"("deliberation_id");

-- CreateIndex
CREATE INDEX "decision_packets_run_id_idx" ON "decision_packets"("run_id");

-- CreateIndex
CREATE INDEX "executive_summaries_organization_id_idx" ON "executive_summaries"("organization_id");

-- CreateIndex
CREATE INDEX "executive_summaries_type_idx" ON "executive_summaries"("type");

-- CreateIndex
CREATE INDEX "deliberation_votes_deliberation_id_idx" ON "deliberation_votes"("deliberation_id");

-- CreateIndex
CREATE INDEX "veto_events_organization_id_idx" ON "veto_events"("organization_id");

-- CreateIndex
CREATE INDEX "ghost_board_sessions_organization_id_idx" ON "ghost_board_sessions"("organization_id");

-- CreateIndex
CREATE INDEX "pre_mortem_analyses_organization_id_idx" ON "pre_mortem_analyses"("organization_id");

-- CreateIndex
CREATE INDEX "decision_outcomes_organization_id_idx" ON "decision_outcomes"("organization_id");

-- CreateIndex
CREATE INDEX "decision_outcomes_deliberation_id_idx" ON "decision_outcomes"("deliberation_id");

-- CreateIndex
CREATE INDEX "decision_outcomes_status_idx" ON "decision_outcomes"("status");

-- CreateIndex
CREATE INDEX "agent_weight_history_organization_id_idx" ON "agent_weight_history"("organization_id");

-- CreateIndex
CREATE INDEX "agent_weight_history_agent_id_idx" ON "agent_weight_history"("agent_id");

-- CreateIndex
CREATE INDEX "echo_collection_jobs_organization_id_idx" ON "echo_collection_jobs"("organization_id");

-- CreateIndex
CREATE INDEX "echo_collection_jobs_deliberation_id_idx" ON "echo_collection_jobs"("deliberation_id");

-- CreateIndex
CREATE INDEX "echo_collection_jobs_status_idx" ON "echo_collection_jobs"("status");

-- CreateIndex
CREATE INDEX "echo_collection_jobs_scheduled_collection_date_idx" ON "echo_collection_jobs"("scheduled_collection_date");

-- CreateIndex
CREATE INDEX "dissents_organization_id_idx" ON "dissents"("organization_id");

-- CreateIndex
CREATE INDEX "dissents_dissenter_id_idx" ON "dissents"("dissenter_id");

-- CreateIndex
CREATE INDEX "dissents_status_idx" ON "dissents"("status");

-- CreateIndex
CREATE INDEX "dissents_decision_id_idx" ON "dissents"("decision_id");

-- CreateIndex
CREATE UNIQUE INDEX "dissent_responses_dissent_id_key" ON "dissent_responses"("dissent_id");

-- CreateIndex
CREATE INDEX "dissent_responses_responder_id_idx" ON "dissent_responses"("responder_id");

-- CreateIndex
CREATE INDEX "alerts_organization_id_status_idx" ON "alerts"("organization_id", "status");

-- CreateIndex
CREATE INDEX "alerts_severity_idx" ON "alerts"("severity");

-- CreateIndex
CREATE INDEX "notifications_user_id_read_idx" ON "notifications"("user_id", "read");

-- CreateIndex
CREATE INDEX "notifications_organization_id_idx" ON "notifications"("organization_id");

-- CreateIndex
CREATE INDEX "data_sources_organization_id_type_idx" ON "data_sources"("organization_id", "type");

-- CreateIndex
CREATE UNIQUE INDEX "embeddings_content_hash_key" ON "embeddings"("content_hash");

-- CreateIndex
CREATE INDEX "embeddings_organization_id_idx" ON "embeddings"("organization_id");

-- CreateIndex
CREATE INDEX "embeddings_source_id_idx" ON "embeddings"("source_id");

-- CreateIndex
CREATE INDEX "embeddings_source_type_idx" ON "embeddings"("source_type");

-- CreateIndex
CREATE INDEX "forecasts_organization_id_idx" ON "forecasts"("organization_id");

-- CreateIndex
CREATE INDEX "health_scores_organization_id_calculated_at_idx" ON "health_scores"("organization_id", "calculated_at");

-- CreateIndex
CREATE UNIQUE INDEX "llm_cache_query_hash_key" ON "llm_cache"("query_hash");

-- CreateIndex
CREATE INDEX "llm_cache_expires_at_idx" ON "llm_cache"("expires_at");

-- CreateIndex
CREATE INDEX "llm_cache_model_idx" ON "llm_cache"("model");

-- CreateIndex
CREATE UNIQUE INDEX "metric_definitions_organization_id_code_key" ON "metric_definitions"("organization_id", "code");

-- CreateIndex
CREATE INDEX "metric_values_metric_id_timestamp_idx" ON "metric_values"("metric_id", "timestamp");

-- CreateIndex
CREATE INDEX "lineage_entities_organization_id_idx" ON "lineage_entities"("organization_id");

-- CreateIndex
CREATE INDEX "lineage_entities_entity_type_idx" ON "lineage_entities"("entity_type");

-- CreateIndex
CREATE UNIQUE INDEX "lineage_relationships_source_id_target_id_relationship_type_key" ON "lineage_relationships"("source_id", "target_id", "relationship_type");

-- CreateIndex
CREATE INDEX "data_quality_reports_entity_id_idx" ON "data_quality_reports"("entity_id");

-- CreateIndex
CREATE INDEX "forecast_models_organization_id_idx" ON "forecast_models"("organization_id");

-- CreateIndex
CREATE INDEX "forecast_models_model_type_idx" ON "forecast_models"("model_type");

-- CreateIndex
CREATE INDEX "predictions_model_id_idx" ON "predictions"("model_id");

-- CreateIndex
CREATE INDEX "predictions_prediction_date_idx" ON "predictions"("prediction_date");

-- CreateIndex
CREATE UNIQUE INDEX "feature_importance_model_id_feature_name_key" ON "feature_importance"("model_id", "feature_name");

-- CreateIndex
CREATE INDEX "health_checks_organization_id_idx" ON "health_checks"("organization_id");

-- CreateIndex
CREATE INDEX "health_checks_component_idx" ON "health_checks"("component");

-- CreateIndex
CREATE INDEX "health_checks_checked_at_idx" ON "health_checks"("checked_at");

-- CreateIndex
CREATE INDEX "health_incidents_organization_id_idx" ON "health_incidents"("organization_id");

-- CreateIndex
CREATE INDEX "health_incidents_status_idx" ON "health_incidents"("status");

-- CreateIndex
CREATE INDEX "chronos_events_organization_id_created_at_idx" ON "chronos_events"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "chronos_events_event_type_idx" ON "chronos_events"("event_type");

-- CreateIndex
CREATE INDEX "chronos_events_category_idx" ON "chronos_events"("category");

-- CreateIndex
CREATE INDEX "chronos_events_severity_idx" ON "chronos_events"("severity");

-- CreateIndex
CREATE INDEX "chronos_events_resource_type_resource_id_idx" ON "chronos_events"("resource_type", "resource_id");

-- CreateIndex
CREATE INDEX "chronos_events_parent_event_id_idx" ON "chronos_events"("parent_event_id");

-- CreateIndex
CREATE INDEX "chronos_snapshots_organization_id_idx" ON "chronos_snapshots"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_iiss_scores_organization_id_idx" ON "dcii_iiss_scores"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_iiss_scores_band_idx" ON "dcii_iiss_scores"("band");

-- CreateIndex
CREATE INDEX "dcii_iiss_scores_created_at_idx" ON "dcii_iiss_scores"("created_at");

-- CreateIndex
CREATE INDEX "dcii_iiss_assessments_organization_id_idx" ON "dcii_iiss_assessments"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_iiss_assessments_status_idx" ON "dcii_iiss_assessments"("status");

-- CreateIndex
CREATE INDEX "dcii_iiss_history_organization_id_idx" ON "dcii_iiss_history"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_iiss_history_created_at_idx" ON "dcii_iiss_history"("created_at");

-- CreateIndex
CREATE INDEX "dcii_media_assets_organization_id_idx" ON "dcii_media_assets"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_media_assets_status_idx" ON "dcii_media_assets"("status");

-- CreateIndex
CREATE INDEX "dcii_media_assets_content_hash_idx" ON "dcii_media_assets"("content_hash");

-- CreateIndex
CREATE INDEX "dcii_media_assessments_asset_id_idx" ON "dcii_media_assessments"("asset_id");

-- CreateIndex
CREATE INDEX "dcii_media_assessments_organization_id_idx" ON "dcii_media_assessments"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_assessments_organization_id_idx" ON "dcii_jurisdiction_assessments"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_assessments_created_at_idx" ON "dcii_jurisdiction_assessments"("created_at");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_conflicts_organization_id_idx" ON "dcii_jurisdiction_conflicts"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_conflicts_severity_idx" ON "dcii_jurisdiction_conflicts"("severity");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_conflicts_status_idx" ON "dcii_jurisdiction_conflicts"("status");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_evidence_packets_organization_id_idx" ON "dcii_jurisdiction_evidence_packets"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_evidence_packets_jurisdiction_idx" ON "dcii_jurisdiction_evidence_packets"("jurisdiction");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_good_faith_docs_conflict_id_idx" ON "dcii_jurisdiction_good_faith_docs"("conflict_id");

-- CreateIndex
CREATE INDEX "dcii_jurisdiction_good_faith_docs_organization_id_idx" ON "dcii_jurisdiction_good_faith_docs"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_timestamp_tokens_organization_id_idx" ON "dcii_timestamp_tokens"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_timestamp_tokens_data_hash_idx" ON "dcii_timestamp_tokens"("data_hash");

-- CreateIndex
CREATE INDEX "dcii_timestamp_tokens_reference_id_idx" ON "dcii_timestamp_tokens"("reference_id");

-- CreateIndex
CREATE INDEX "dcii_timestamp_tokens_status_idx" ON "dcii_timestamp_tokens"("status");

-- CreateIndex
CREATE INDEX "dcii_timestamp_verifications_token_id_idx" ON "dcii_timestamp_verifications"("token_id");

-- CreateIndex
CREATE INDEX "dcii_timestamp_batches_organization_id_idx" ON "dcii_timestamp_batches"("organization_id");

-- CreateIndex
CREATE INDEX "evidence_vault_packets_organization_id_idx" ON "evidence_vault_packets"("organization_id");

-- CreateIndex
CREATE INDEX "evidence_vault_packets_status_idx" ON "evidence_vault_packets"("status");

-- CreateIndex
CREATE INDEX "evidence_vault_packets_mode_idx" ON "evidence_vault_packets"("mode");

-- CreateIndex
CREATE INDEX "evidence_vault_packets_decision_id_idx" ON "evidence_vault_packets"("decision_id");

-- CreateIndex
CREATE INDEX "evidence_vault_packets_business_unit_idx" ON "evidence_vault_packets"("business_unit");

-- CreateIndex
CREATE INDEX "evidence_vault_packets_generated_at_idx" ON "evidence_vault_packets"("generated_at");

-- CreateIndex
CREATE INDEX "dcii_similarity_decisions_organization_id_idx" ON "dcii_similarity_decisions"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_similarity_decisions_department_idx" ON "dcii_similarity_decisions"("department");

-- CreateIndex
CREATE INDEX "dcii_similarity_decisions_decision_type_idx" ON "dcii_similarity_decisions"("decision_type");

-- CreateIndex
CREATE INDEX "dcii_similarity_decisions_outcome_idx" ON "dcii_similarity_decisions"("outcome");

-- CreateIndex
CREATE INDEX "dcii_similarity_decisions_decided_at_idx" ON "dcii_similarity_decisions"("decided_at");

-- CreateIndex
CREATE INDEX "dcii_similarity_results_organization_id_idx" ON "dcii_similarity_results"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_similarity_patterns_organization_id_idx" ON "dcii_similarity_patterns"("organization_id");

-- CreateIndex
CREATE INDEX "dcii_similarity_patterns_pattern_type_idx" ON "dcii_similarity_patterns"("pattern_type");

-- CreateIndex
CREATE INDEX "dcii_similarity_patterns_severity_idx" ON "dcii_similarity_patterns"("severity");

-- CreateIndex
CREATE INDEX "enterprise_scheduled_jobs_organization_id_idx" ON "enterprise_scheduled_jobs"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_scheduled_jobs_job_type_idx" ON "enterprise_scheduled_jobs"("job_type");

-- CreateIndex
CREATE INDEX "enterprise_scheduled_jobs_enabled_idx" ON "enterprise_scheduled_jobs"("enabled");

-- CreateIndex
CREATE INDEX "enterprise_scheduled_jobs_next_run_at_idx" ON "enterprise_scheduled_jobs"("next_run_at");

-- CreateIndex
CREATE INDEX "enterprise_job_executions_job_id_idx" ON "enterprise_job_executions"("job_id");

-- CreateIndex
CREATE INDEX "enterprise_job_executions_organization_id_idx" ON "enterprise_job_executions"("organization_id");

-- CreateIndex
CREATE INDEX "enterprise_job_executions_started_at_idx" ON "enterprise_job_executions"("started_at");

-- CreateIndex
CREATE INDEX "enterprise_job_executions_status_idx" ON "enterprise_job_executions"("status");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_policies_policy_number_key" ON "insurance_policies"("policy_number");

-- CreateIndex
CREATE INDEX "insurance_policies_organization_id_idx" ON "insurance_policies"("organization_id");

-- CreateIndex
CREATE INDEX "insurance_policies_status_idx" ON "insurance_policies"("status");

-- CreateIndex
CREATE INDEX "insurance_policies_policy_number_idx" ON "insurance_policies"("policy_number");

-- CreateIndex
CREATE INDEX "insurance_quotes_organization_id_idx" ON "insurance_quotes"("organization_id");

-- CreateIndex
CREATE INDEX "insurance_quotes_status_idx" ON "insurance_quotes"("status");

-- CreateIndex
CREATE UNIQUE INDEX "insurance_claims_claim_number_key" ON "insurance_claims"("claim_number");

-- CreateIndex
CREATE INDEX "insurance_claims_policy_id_idx" ON "insurance_claims"("policy_id");

-- CreateIndex
CREATE INDEX "insurance_claims_status_idx" ON "insurance_claims"("status");

-- CreateIndex
CREATE INDEX "insurance_claims_claim_number_idx" ON "insurance_claims"("claim_number");

-- CreateIndex
CREATE UNIQUE INDEX "gateway_federations_slug_key" ON "gateway_federations"("slug");

-- CreateIndex
CREATE INDEX "gateway_federations_admin_org_id_idx" ON "gateway_federations"("admin_org_id");

-- CreateIndex
CREATE INDEX "gateway_federations_status_idx" ON "gateway_federations"("status");

-- CreateIndex
CREATE INDEX "gateway_federation_members_federation_id_idx" ON "gateway_federation_members"("federation_id");

-- CreateIndex
CREATE INDEX "gateway_federation_members_organization_id_idx" ON "gateway_federation_members"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "gateway_federation_members_federation_id_organization_id_key" ON "gateway_federation_members"("federation_id", "organization_id");

-- CreateIndex
CREATE INDEX "gateway_federation_policies_federation_id_idx" ON "gateway_federation_policies"("federation_id");

-- CreateIndex
CREATE INDEX "gateway_federation_policies_enabled_idx" ON "gateway_federation_policies"("enabled");

-- CreateIndex
CREATE INDEX "gateway_federation_reports_federation_id_idx" ON "gateway_federation_reports"("federation_id");

-- CreateIndex
CREATE INDEX "gateway_federation_reports_report_type_idx" ON "gateway_federation_reports"("report_type");

-- CreateIndex
CREATE INDEX "gateway_federation_reports_period_start_period_end_idx" ON "gateway_federation_reports"("period_start", "period_end");

-- CreateIndex
CREATE INDEX "gateway_federation_reports_status_idx" ON "gateway_federation_reports"("status");

-- CreateIndex
CREATE INDEX "gateway_interactions_organization_id_idx" ON "gateway_interactions"("organization_id");

-- CreateIndex
CREATE INDEX "gateway_interactions_user_id_idx" ON "gateway_interactions"("user_id");

-- CreateIndex
CREATE INDEX "gateway_interactions_user_department_idx" ON "gateway_interactions"("user_department");

-- CreateIndex
CREATE INDEX "gateway_interactions_provider_idx" ON "gateway_interactions"("provider");

-- CreateIndex
CREATE INDEX "gateway_interactions_model_idx" ON "gateway_interactions"("model");

-- CreateIndex
CREATE INDEX "gateway_interactions_pii_detected_idx" ON "gateway_interactions"("pii_detected");

-- CreateIndex
CREATE INDEX "gateway_interactions_policy_action_idx" ON "gateway_interactions"("policy_action");

-- CreateIndex
CREATE INDEX "gateway_interactions_requested_at_idx" ON "gateway_interactions"("requested_at");

-- CreateIndex
CREATE INDEX "gateway_interactions_created_at_idx" ON "gateway_interactions"("created_at");

-- CreateIndex
CREATE INDEX "approvals_organization_id_status_idx" ON "approvals"("organization_id", "status");

-- CreateIndex
CREATE INDEX "panopticon_regulations_organization_id_status_idx" ON "panopticon_regulations"("organization_id", "status");

-- CreateIndex
CREATE INDEX "panopticon_regulations_framework_code_idx" ON "panopticon_regulations"("framework_code");

-- CreateIndex
CREATE INDEX "panopticon_regulations_jurisdiction_idx" ON "panopticon_regulations"("jurisdiction");

-- CreateIndex
CREATE UNIQUE INDEX "panopticon_regulations_organization_id_framework_code_versi_key" ON "panopticon_regulations"("organization_id", "framework_code", "version");

-- CreateIndex
CREATE INDEX "panopticon_obligations_regulation_id_idx" ON "panopticon_obligations"("regulation_id");

-- CreateIndex
CREATE INDEX "panopticon_obligations_requirement_type_idx" ON "panopticon_obligations"("requirement_type");

-- CreateIndex
CREATE UNIQUE INDEX "panopticon_obligations_regulation_id_obligation_code_key" ON "panopticon_obligations"("regulation_id", "obligation_code");

-- CreateIndex
CREATE INDEX "panopticon_alignments_obligation_id_idx" ON "panopticon_alignments"("obligation_id");

-- CreateIndex
CREATE INDEX "panopticon_alignments_entity_type_entity_id_idx" ON "panopticon_alignments"("entity_type", "entity_id");

-- CreateIndex
CREATE INDEX "panopticon_violations_organization_id_status_idx" ON "panopticon_violations"("organization_id", "status");

-- CreateIndex
CREATE INDEX "panopticon_violations_severity_idx" ON "panopticon_violations"("severity");

-- CreateIndex
CREATE INDEX "panopticon_forecasts_organization_id_idx" ON "panopticon_forecasts"("organization_id");

-- CreateIndex
CREATE INDEX "panopticon_forecasts_forecast_type_idx" ON "panopticon_forecasts"("forecast_type");

-- CreateIndex
CREATE UNIQUE INDEX "ethics_principles_organization_id_name_key" ON "ethics_principles"("organization_id", "name");

-- CreateIndex
CREATE INDEX "ethics_reviews_organization_id_idx" ON "ethics_reviews"("organization_id");

-- CreateIndex
CREATE INDEX "ethics_reviews_status_idx" ON "ethics_reviews"("status");

-- CreateIndex
CREATE INDEX "bias_checks_organization_id_idx" ON "bias_checks"("organization_id");

-- CreateIndex
CREATE INDEX "bias_checks_model_id_idx" ON "bias_checks"("model_id");

-- CreateIndex
CREATE INDEX "govern_policies_organization_id_idx" ON "govern_policies"("organization_id");

-- CreateIndex
CREATE INDEX "govern_audits_organization_id_idx" ON "govern_audits"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_items_organization_id_idx" ON "regulatory_items"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_documents_organization_id_idx" ON "regulatory_documents"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_documents_status_idx" ON "regulatory_documents"("status");

-- CreateIndex
CREATE INDEX "regulatory_documents_review_status_idx" ON "regulatory_documents"("review_status");

-- CreateIndex
CREATE INDEX "regulatory_documents_jurisdiction_idx" ON "regulatory_documents"("jurisdiction");

-- CreateIndex
CREATE INDEX "regulatory_documents_content_hash_idx" ON "regulatory_documents"("content_hash");

-- CreateIndex
CREATE INDEX "regulatory_requirements_document_id_idx" ON "regulatory_requirements"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_requirements_category_idx" ON "regulatory_requirements"("category");

-- CreateIndex
CREATE INDEX "regulatory_requirements_severity_idx" ON "regulatory_requirements"("severity");

-- CreateIndex
CREATE INDEX "regulatory_requirements_is_verified_idx" ON "regulatory_requirements"("is_verified");

-- CreateIndex
CREATE INDEX "regulatory_triggers_document_id_idx" ON "regulatory_triggers"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_triggers_trigger_type_idx" ON "regulatory_triggers"("trigger_type");

-- CreateIndex
CREATE INDEX "regulatory_triggers_is_active_idx" ON "regulatory_triggers"("is_active");

-- CreateIndex
CREATE INDEX "regulatory_constraints_document_id_idx" ON "regulatory_constraints"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_constraints_is_active_idx" ON "regulatory_constraints"("is_active");

-- CreateIndex
CREATE INDEX "regulatory_constraints_constraint_type_idx" ON "regulatory_constraints"("constraint_type");

-- CreateIndex
CREATE INDEX "regulatory_conflicts_organization_id_idx" ON "regulatory_conflicts"("organization_id");

-- CreateIndex
CREATE INDEX "regulatory_conflicts_resolution_status_idx" ON "regulatory_conflicts"("resolution_status");

-- CreateIndex
CREATE INDEX "regulatory_audit_logs_document_id_idx" ON "regulatory_audit_logs"("document_id");

-- CreateIndex
CREATE INDEX "regulatory_audit_logs_action_idx" ON "regulatory_audit_logs"("action");

-- CreateIndex
CREATE INDEX "regulatory_audit_logs_created_at_idx" ON "regulatory_audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "constitutional_disputes_case_number_key" ON "constitutional_disputes"("case_number");

-- CreateIndex
CREATE INDEX "constitutional_disputes_organization_id_idx" ON "constitutional_disputes"("organization_id");

-- CreateIndex
CREATE INDEX "constitutional_disputes_status_idx" ON "constitutional_disputes"("status");

-- CreateIndex
CREATE INDEX "constitutional_disputes_category_idx" ON "constitutional_disputes"("category");

-- CreateIndex
CREATE INDEX "constitutional_disputes_case_number_idx" ON "constitutional_disputes"("case_number");

-- CreateIndex
CREATE INDEX "constitutional_opinions_dispute_id_idx" ON "constitutional_opinions"("dispute_id");

-- CreateIndex
CREATE INDEX "constitutional_opinions_case_number_idx" ON "constitutional_opinions"("case_number");

-- CreateIndex
CREATE INDEX "accountability_records_decision_id_idx" ON "accountability_records"("decision_id");

-- CreateIndex
CREATE INDEX "accountability_records_deliberation_id_idx" ON "accountability_records"("deliberation_id");

-- CreateIndex
CREATE INDEX "accountability_records_organization_id_action_taken_idx" ON "accountability_records"("organization_id", "action_taken");

-- CreateIndex
CREATE INDEX "accountability_records_created_at_idx" ON "accountability_records"("created_at");

-- CreateIndex
CREATE INDEX "delegation_records_organization_id_idx" ON "delegation_records"("organization_id");

-- CreateIndex
CREATE INDEX "delegation_records_valid_until_idx" ON "delegation_records"("valid_until");

-- CreateIndex
CREATE INDEX "drift_snapshots_organization_id_snapshot_type_idx" ON "drift_snapshots"("organization_id", "snapshot_type");

-- CreateIndex
CREATE INDEX "drift_snapshots_organization_id_primitive_idx" ON "drift_snapshots"("organization_id", "primitive");

-- CreateIndex
CREATE INDEX "drift_snapshots_created_at_idx" ON "drift_snapshots"("created_at");

-- CreateIndex
CREATE INDEX "bias_analyses_organization_id_idx" ON "bias_analyses"("organization_id");

-- CreateIndex
CREATE INDEX "bias_analyses_deliberation_id_idx" ON "bias_analyses"("deliberation_id");

-- CreateIndex
CREATE INDEX "bias_analyses_overall_risk_idx" ON "bias_analyses"("overall_risk");

-- CreateIndex
CREATE INDEX "bias_analyses_created_at_idx" ON "bias_analyses"("created_at");

-- CreateIndex
CREATE INDEX "meta_governance_reports_agent_id_idx" ON "meta_governance_reports"("agent_id");

-- CreateIndex
CREATE INDEX "meta_governance_reports_created_at_idx" ON "meta_governance_reports"("created_at");

-- CreateIndex
CREATE INDEX "deterministic_replay_states_organization_id_idx" ON "deterministic_replay_states"("organization_id");

-- CreateIndex
CREATE INDEX "deterministic_replay_states_deliberation_id_idx" ON "deterministic_replay_states"("deliberation_id");

-- CreateIndex
CREATE INDEX "deterministic_replay_states_created_at_idx" ON "deterministic_replay_states"("created_at");

-- CreateIndex
CREATE INDEX "data_diode_events_source_id_idx" ON "data_diode_events"("source_id");

-- CreateIndex
CREATE INDEX "data_diode_events_status_idx" ON "data_diode_events"("status");

-- CreateIndex
CREATE INDEX "data_diode_events_file_hash_idx" ON "data_diode_events"("file_hash");

-- CreateIndex
CREATE INDEX "data_diode_events_created_at_idx" ON "data_diode_events"("created_at");

-- CreateIndex
CREATE INDEX "service_records_service_name_record_type_idx" ON "service_records"("service_name", "record_type");

-- CreateIndex
CREATE INDEX "service_records_organization_id_idx" ON "service_records"("organization_id");

-- CreateIndex
CREATE INDEX "service_records_reference_id_idx" ON "service_records"("reference_id");

-- CreateIndex
CREATE INDEX "service_records_created_at_idx" ON "service_records"("created_at");

-- CreateIndex
CREATE INDEX "persona_twins_organization_id_idx" ON "persona_twins"("organization_id");

-- CreateIndex
CREATE INDEX "persona_conversations_twin_id_idx" ON "persona_conversations"("twin_id");

-- CreateIndex
CREATE INDEX "autopilot_rules_organization_id_idx" ON "autopilot_rules"("organization_id");

-- CreateIndex
CREATE INDEX "autopilot_executions_rule_id_idx" ON "autopilot_executions"("rule_id");

-- CreateIndex
CREATE INDEX "redteam_simulations_organization_id_idx" ON "redteam_simulations"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_simulations_status_idx" ON "redteam_simulations"("status");

-- CreateIndex
CREATE INDEX "redteam_vulnerabilities_organization_id_idx" ON "redteam_vulnerabilities"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_vulnerabilities_severity_idx" ON "redteam_vulnerabilities"("severity");

-- CreateIndex
CREATE INDEX "redteam_vulnerabilities_status_idx" ON "redteam_vulnerabilities"("status");

-- CreateIndex
CREATE INDEX "redteam_patches_organization_id_idx" ON "redteam_patches"("organization_id");

-- CreateIndex
CREATE INDEX "redteam_patches_status_idx" ON "redteam_patches"("status");

-- CreateIndex
CREATE INDEX "gnosis_learning_paths_organization_id_idx" ON "gnosis_learning_paths"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_learning_paths_user_id_idx" ON "gnosis_learning_paths"("user_id");

-- CreateIndex
CREATE INDEX "gnosis_learning_paths_status_idx" ON "gnosis_learning_paths"("status");

-- CreateIndex
CREATE INDEX "gnosis_decision_impacts_organization_id_idx" ON "gnosis_decision_impacts"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_decision_impacts_deliberation_id_idx" ON "gnosis_decision_impacts"("deliberation_id");

-- CreateIndex
CREATE INDEX "gnosis_assessments_user_id_idx" ON "gnosis_assessments"("user_id");

-- CreateIndex
CREATE INDEX "gnosis_assessments_organization_id_idx" ON "gnosis_assessments"("organization_id");

-- CreateIndex
CREATE INDEX "gnosis_assessments_skill_idx" ON "gnosis_assessments"("skill");

-- CreateIndex
CREATE INDEX "apotheosis_runs_organization_id_idx" ON "apotheosis_runs"("organization_id");

-- CreateIndex
CREATE INDEX "apotheosis_runs_status_idx" ON "apotheosis_runs"("status");

-- CreateIndex
CREATE INDEX "apotheosis_runs_started_at_idx" ON "apotheosis_runs"("started_at");

-- CreateIndex
CREATE INDEX "apotheosis_weaknesses_run_id_idx" ON "apotheosis_weaknesses"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_weaknesses_severity_idx" ON "apotheosis_weaknesses"("severity");

-- CreateIndex
CREATE INDEX "apotheosis_weaknesses_status_idx" ON "apotheosis_weaknesses"("status");

-- CreateIndex
CREATE INDEX "apotheosis_auto_patches_run_id_idx" ON "apotheosis_auto_patches"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_auto_patches_status_idx" ON "apotheosis_auto_patches"("status");

-- CreateIndex
CREATE INDEX "apotheosis_escalations_run_id_idx" ON "apotheosis_escalations"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_escalations_status_idx" ON "apotheosis_escalations"("status");

-- CreateIndex
CREATE INDEX "apotheosis_escalations_deadline_idx" ON "apotheosis_escalations"("deadline");

-- CreateIndex
CREATE INDEX "apotheosis_upskill_assignments_run_id_idx" ON "apotheosis_upskill_assignments"("run_id");

-- CreateIndex
CREATE INDEX "apotheosis_upskill_assignments_user_id_idx" ON "apotheosis_upskill_assignments"("user_id");

-- CreateIndex
CREATE INDEX "apotheosis_upskill_assignments_status_idx" ON "apotheosis_upskill_assignments"("status");

-- CreateIndex
CREATE INDEX "apotheosis_pattern_bans_organization_id_idx" ON "apotheosis_pattern_bans"("organization_id");

-- CreateIndex
CREATE INDEX "apotheosis_pattern_bans_status_idx" ON "apotheosis_pattern_bans"("status");

-- CreateIndex
CREATE INDEX "apotheosis_scores_organization_id_idx" ON "apotheosis_scores"("organization_id");

-- CreateIndex
CREATE INDEX "apotheosis_scores_recorded_at_idx" ON "apotheosis_scores"("recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "apotheosis_configs_organization_id_key" ON "apotheosis_configs"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "blackbox_units_serial_number_key" ON "blackbox_units"("serial_number");

-- CreateIndex
CREATE INDEX "blackbox_units_organization_id_idx" ON "blackbox_units"("organization_id");

-- CreateIndex
CREATE INDEX "blackbox_units_status_idx" ON "blackbox_units"("status");

-- CreateIndex
CREATE INDEX "mesh_network_stats_recorded_at_idx" ON "mesh_network_stats"("recorded_at");

-- CreateIndex
CREATE UNIQUE INDEX "mesh_participants_anonymous_id_key" ON "mesh_participants"("anonymous_id");

-- CreateIndex
CREATE INDEX "mesh_participants_industry_idx" ON "mesh_participants"("industry");

-- CreateIndex
CREATE INDEX "mesh_benchmarks_category_idx" ON "mesh_benchmarks"("category");

-- CreateIndex
CREATE UNIQUE INDEX "mesh_benchmarks_name_industry_key" ON "mesh_benchmarks"("name", "industry");

-- CreateIndex
CREATE INDEX "mesh_risk_signals_severity_idx" ON "mesh_risk_signals"("severity");

-- CreateIndex
CREATE INDEX "admin_settings_category_idx" ON "admin_settings"("category");

-- CreateIndex
CREATE UNIQUE INDEX "admin_settings_organization_id_key_key" ON "admin_settings"("organization_id", "key");

-- CreateIndex
CREATE INDEX "audit_logs_action_idx" ON "audit_logs"("action");

-- CreateIndex
CREATE INDEX "audit_logs_organization_id_created_at_idx" ON "audit_logs"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "audit_logs_resource_type_resource_id_idx" ON "audit_logs"("resource_type", "resource_id");

-- CreateIndex
CREATE UNIQUE INDEX "execution_nodes_execution_id_node_id_key" ON "execution_nodes"("execution_id", "node_id");

-- CreateIndex
CREATE INDEX "workflow_executions_workflow_id_status_idx" ON "workflow_executions"("workflow_id", "status");

-- CreateIndex
CREATE INDEX "workflows_organization_id_status_idx" ON "workflows"("organization_id", "status");

-- CreateIndex
CREATE INDEX "omnitranslate_glossaries_organization_id_idx" ON "omnitranslate_glossaries"("organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossary_glossary_id_idx" ON "omnitranslate_glossary"("glossary_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossary_organization_id_idx" ON "omnitranslate_glossary"("organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_glossary_source_text_idx" ON "omnitranslate_glossary"("source_text");

-- CreateIndex
CREATE INDEX "omnitranslate_memory_organization_id_idx" ON "omnitranslate_memory"("organization_id");

-- CreateIndex
CREATE INDEX "omnitranslate_memory_source_language_target_language_idx" ON "omnitranslate_memory"("source_language", "target_language");

-- CreateIndex
CREATE INDEX "omnitranslate_memory_created_at_idx" ON "omnitranslate_memory"("created_at");

-- CreateIndex
CREATE INDEX "schema_mappings_organization_id_idx" ON "schema_mappings"("organization_id");

-- CreateIndex
CREATE INDEX "schema_mappings_data_source_id_idx" ON "schema_mappings"("data_source_id");

-- CreateIndex
CREATE INDEX "schema_mappings_is_active_idx" ON "schema_mappings"("is_active");

-- CreateIndex
CREATE UNIQUE INDEX "schema_mappings_data_source_id_organization_id_key" ON "schema_mappings"("data_source_id", "organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenants_slug_key" ON "tenants"("slug");

-- CreateIndex
CREATE INDEX "tenants_status_idx" ON "tenants"("status");

-- CreateIndex
CREATE INDEX "tenants_plan_idx" ON "tenants"("plan");

-- CreateIndex
CREATE INDEX "tenants_created_at_idx" ON "tenants"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "licenses_license_key_key" ON "licenses"("license_key");

-- CreateIndex
CREATE INDEX "licenses_tenant_id_idx" ON "licenses"("tenant_id");

-- CreateIndex
CREATE INDEX "licenses_status_idx" ON "licenses"("status");

-- CreateIndex
CREATE INDEX "licenses_expires_at_idx" ON "licenses"("expires_at");

-- CreateIndex
CREATE INDEX "tenant_usage_tenant_id_idx" ON "tenant_usage"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_usage_period_idx" ON "tenant_usage"("period");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_usage_tenant_id_period_key" ON "tenant_usage"("tenant_id", "period");

-- CreateIndex
CREATE UNIQUE INDEX "feature_flags_key_key" ON "feature_flags"("key");

-- CreateIndex
CREATE INDEX "feature_flags_category_idx" ON "feature_flags"("category");

-- CreateIndex
CREATE INDEX "feature_flags_enabled_idx" ON "feature_flags"("enabled");

-- CreateIndex
CREATE INDEX "tenant_feature_flags_tenant_id_idx" ON "tenant_feature_flags"("tenant_id");

-- CreateIndex
CREATE INDEX "tenant_feature_flags_feature_flag_id_idx" ON "tenant_feature_flags"("feature_flag_id");

-- CreateIndex
CREATE UNIQUE INDEX "tenant_feature_flags_tenant_id_feature_flag_id_key" ON "tenant_feature_flags"("tenant_id", "feature_flag_id");

-- CreateIndex
CREATE INDEX "system_alerts_severity_idx" ON "system_alerts"("severity");

-- CreateIndex
CREATE INDEX "system_alerts_acknowledged_idx" ON "system_alerts"("acknowledged");

-- CreateIndex
CREATE INDEX "system_alerts_created_at_idx" ON "system_alerts"("created_at");

-- CreateIndex
CREATE INDEX "crucible_simulations_organization_id_status_idx" ON "crucible_simulations"("organization_id", "status");

-- CreateIndex
CREATE INDEX "crucible_simulations_simulation_type_idx" ON "crucible_simulations"("simulation_type");

-- CreateIndex
CREATE INDEX "crucible_universes_simulation_id_idx" ON "crucible_universes"("simulation_id");

-- CreateIndex
CREATE UNIQUE INDEX "crucible_universes_simulation_id_universe_number_key" ON "crucible_universes"("simulation_id", "universe_number");

-- CreateIndex
CREATE INDEX "crucible_impacts_simulation_id_impact_category_idx" ON "crucible_impacts"("simulation_id", "impact_category");

-- CreateIndex
CREATE INDEX "crucible_failure_cascades_universe_id_idx" ON "crucible_failure_cascades"("universe_id");

-- CreateIndex
CREATE INDEX "crucible_council_deliberations_simulation_id_idx" ON "crucible_council_deliberations"("simulation_id");

-- CreateIndex
CREATE INDEX "crucible_redteam_reports_organization_id_completed_at_idx" ON "crucible_redteam_reports"("organization_id", "completed_at");

-- CreateIndex
CREATE INDEX "crucible_redteam_reports_security_score_idx" ON "crucible_redteam_reports"("security_score");

-- CreateIndex
CREATE INDEX "crucible_sbom_organization_id_created_at_idx" ON "crucible_sbom"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "crucible_runtime_events_organization_id_event_type_idx" ON "crucible_runtime_events"("organization_id", "event_type");

-- CreateIndex
CREATE INDEX "crucible_runtime_events_severity_mitigated_idx" ON "crucible_runtime_events"("severity", "mitigated");

-- CreateIndex
CREATE INDEX "aegis_signals_organization_id_signal_type_idx" ON "aegis_signals"("organization_id", "signal_type");

-- CreateIndex
CREATE INDEX "aegis_signals_severity_idx" ON "aegis_signals"("severity");

-- CreateIndex
CREATE INDEX "aegis_signals_created_at_idx" ON "aegis_signals"("created_at");

-- CreateIndex
CREATE INDEX "aegis_threats_organization_id_status_idx" ON "aegis_threats"("organization_id", "status");

-- CreateIndex
CREATE INDEX "aegis_threats_threat_type_idx" ON "aegis_threats"("threat_type");

-- CreateIndex
CREATE INDEX "aegis_threats_severity_idx" ON "aegis_threats"("severity");

-- CreateIndex
CREATE INDEX "aegis_scenarios_threat_id_idx" ON "aegis_scenarios"("threat_id");

-- CreateIndex
CREATE INDEX "aegis_countermeasures_threat_id_idx" ON "aegis_countermeasures"("threat_id");

-- CreateIndex
CREATE INDEX "aegis_countermeasures_status_idx" ON "aegis_countermeasures"("status");

-- CreateIndex
CREATE INDEX "aegis_briefings_organization_id_idx" ON "aegis_briefings"("organization_id");

-- CreateIndex
CREATE INDEX "aegis_briefings_briefing_type_idx" ON "aegis_briefings"("briefing_type");

-- CreateIndex
CREATE INDEX "security_threats_organization_id_idx" ON "security_threats"("organization_id");

-- CreateIndex
CREATE INDEX "security_threats_status_idx" ON "security_threats"("status");

-- CreateIndex
CREATE INDEX "security_threats_severity_idx" ON "security_threats"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "security_policies_organization_id_name_key" ON "security_policies"("organization_id", "name");

-- CreateIndex
CREATE INDEX "security_audit_logs_organization_id_idx" ON "security_audit_logs"("organization_id");

-- CreateIndex
CREATE INDEX "security_audit_logs_action_idx" ON "security_audit_logs"("action");

-- CreateIndex
CREATE INDEX "security_audit_logs_created_at_idx" ON "security_audit_logs"("created_at");

-- CreateIndex
CREATE INDEX "honeytokens_organization_id_idx" ON "honeytokens"("organization_id");

-- CreateIndex
CREATE INDEX "honeytokens_triggered_idx" ON "honeytokens"("triggered");

-- CreateIndex
CREATE INDEX "canary_alerts_canary_id_idx" ON "canary_alerts"("canary_id");

-- CreateIndex
CREATE INDEX "canary_alerts_created_at_idx" ON "canary_alerts"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "hardware_keys_serial_number_key" ON "hardware_keys"("serial_number");

-- CreateIndex
CREATE INDEX "hardware_keys_organization_id_idx" ON "hardware_keys"("organization_id");

-- CreateIndex
CREATE INDEX "hardware_keys_status_idx" ON "hardware_keys"("status");

-- CreateIndex
CREATE INDEX "auth_challenges_key_id_idx" ON "auth_challenges"("key_id");

-- CreateIndex
CREATE INDEX "high_risk_operations_organization_id_idx" ON "high_risk_operations"("organization_id");

-- CreateIndex
CREATE INDEX "key_audit_logs_key_id_idx" ON "key_audit_logs"("key_id");

-- CreateIndex
CREATE INDEX "key_audit_logs_created_at_idx" ON "key_audit_logs"("created_at");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_entries_entry_index_key" ON "ledger_entries"("entry_index");

-- CreateIndex
CREATE INDEX "ledger_entries_organization_id_created_at_idx" ON "ledger_entries"("organization_id", "created_at");

-- CreateIndex
CREATE INDEX "ledger_entries_event_type_idx" ON "ledger_entries"("event_type");

-- CreateIndex
CREATE INDEX "ledger_entries_hash_idx" ON "ledger_entries"("hash");

-- CreateIndex
CREATE INDEX "ledger_entries_block_number_idx" ON "ledger_entries"("block_number");

-- CreateIndex
CREATE UNIQUE INDEX "ledger_blocks_block_hash_key" ON "ledger_blocks"("block_hash");

-- CreateIndex
CREATE INDEX "ledger_blocks_merkle_root_idx" ON "ledger_blocks"("merkle_root");

-- CreateIndex
CREATE INDEX "eternal_artifacts_organization_id_artifact_type_idx" ON "eternal_artifacts"("organization_id", "artifact_type");

-- CreateIndex
CREATE INDEX "eternal_artifacts_importance_score_idx" ON "eternal_artifacts"("importance_score");

-- CreateIndex
CREATE INDEX "eternal_artifacts_retention_years_idx" ON "eternal_artifacts"("retention_years");

-- CreateIndex
CREATE INDEX "eternal_validations_artifact_id_idx" ON "eternal_validations"("artifact_id");

-- CreateIndex
CREATE INDEX "eternal_validations_validated_at_idx" ON "eternal_validations"("validated_at");

-- CreateIndex
CREATE INDEX "eternal_migrations_organization_id_idx" ON "eternal_migrations"("organization_id");

-- CreateIndex
CREATE INDEX "eternal_migrations_status_idx" ON "eternal_migrations"("status");

-- CreateIndex
CREATE INDEX "eternal_succession_organization_id_idx" ON "eternal_succession"("organization_id");

-- CreateIndex
CREATE INDEX "symbiont_entities_organization_id_entity_type_idx" ON "symbiont_entities"("organization_id", "entity_type");

-- CreateIndex
CREATE INDEX "symbiont_entities_domain_idx" ON "symbiont_entities"("domain");

-- CreateIndex
CREATE INDEX "symbiont_opportunities_organization_id_status_idx" ON "symbiont_opportunities"("organization_id", "status");

-- CreateIndex
CREATE INDEX "symbiont_opportunities_opportunity_type_idx" ON "symbiont_opportunities"("opportunity_type");

-- CreateIndex
CREATE INDEX "symbiont_relationships_organization_id_idx" ON "symbiont_relationships"("organization_id");

-- CreateIndex
CREATE INDEX "symbiont_relationships_relationship_type_idx" ON "symbiont_relationships"("relationship_type");

-- CreateIndex
CREATE UNIQUE INDEX "symbiont_relationships_entity_id_related_entity_id_key" ON "symbiont_relationships"("entity_id", "related_entity_id");

-- CreateIndex
CREATE INDEX "symbiont_simulations_opportunity_id_idx" ON "symbiont_simulations"("opportunity_id");

-- CreateIndex
CREATE INDEX "vox_stakeholders_organization_id_stakeholder_type_idx" ON "vox_stakeholders"("organization_id", "stakeholder_type");

-- CreateIndex
CREATE INDEX "vox_signals_stakeholder_id_idx" ON "vox_signals"("stakeholder_id");

-- CreateIndex
CREATE INDEX "vox_signals_signal_type_idx" ON "vox_signals"("signal_type");

-- CreateIndex
CREATE INDEX "vox_signals_created_at_idx" ON "vox_signals"("created_at");

-- CreateIndex
CREATE INDEX "vox_impacts_organization_id_idx" ON "vox_impacts"("organization_id");

-- CreateIndex
CREATE INDEX "vox_impacts_stakeholder_id_idx" ON "vox_impacts"("stakeholder_id");

-- CreateIndex
CREATE INDEX "vox_impacts_decision_id_idx" ON "vox_impacts"("decision_id");

-- CreateIndex
CREATE INDEX "vox_votes_organization_id_idx" ON "vox_votes"("organization_id");

-- CreateIndex
CREATE INDEX "vox_votes_decision_id_idx" ON "vox_votes"("decision_id");

-- CreateIndex
CREATE UNIQUE INDEX "vox_votes_decision_id_stakeholder_id_key" ON "vox_votes"("decision_id", "stakeholder_id");

-- CreateIndex
CREATE INDEX "vox_assemblies_organization_id_idx" ON "vox_assemblies"("organization_id");

-- CreateIndex
CREATE INDEX "vox_assemblies_decision_id_idx" ON "vox_assemblies"("decision_id");

-- CreateIndex
CREATE INDEX "simulations_organization_id_idx" ON "simulations"("organization_id");

-- CreateIndex
CREATE INDEX "simulations_status_idx" ON "simulations"("status");

-- CreateIndex
CREATE INDEX "witness_records_organization_id_idx" ON "witness_records"("organization_id");

-- CreateIndex
CREATE INDEX "witness_records_event_type_idx" ON "witness_records"("event_type");

-- CreateIndex
CREATE INDEX "witness_records_legal_relevance_idx" ON "witness_records"("legal_relevance");

-- CreateIndex
CREATE INDEX "legal_holds_organization_id_idx" ON "legal_holds"("organization_id");

-- CreateIndex
CREATE INDEX "legal_holds_status_idx" ON "legal_holds"("status");

-- CreateIndex
CREATE INDEX "custody_events_record_id_idx" ON "custody_events"("record_id");

-- CreateIndex
CREATE INDEX "truth_claims_organization_id_idx" ON "truth_claims"("organization_id");

-- CreateIndex
CREATE INDEX "truth_claims_status_idx" ON "truth_claims"("status");

-- CreateIndex
CREATE INDEX "truth_claims_category_idx" ON "truth_claims"("category");

-- CreateIndex
CREATE INDEX "claim_evidence_claim_id_idx" ON "claim_evidence"("claim_id");

-- CreateIndex
CREATE UNIQUE INDEX "claim_votes_claim_id_voter_id_key" ON "claim_votes"("claim_id", "voter_id");

-- CreateIndex
CREATE INDEX "claim_disputes_claim_id_idx" ON "claim_disputes"("claim_id");

-- CreateIndex
CREATE INDEX "claim_disputes_organization_id_idx" ON "claim_disputes"("organization_id");

-- CreateIndex
CREATE INDEX "claim_disputes_status_idx" ON "claim_disputes"("status");

-- CreateIndex
CREATE INDEX "source_reliability_organization_id_idx" ON "source_reliability"("organization_id");

-- CreateIndex
CREATE UNIQUE INDEX "source_reliability_organization_id_source_name_key" ON "source_reliability"("organization_id", "source_name");

-- CreateIndex
CREATE INDEX "discovery_requests_organization_id_idx" ON "discovery_requests"("organization_id");

-- CreateIndex
CREATE INDEX "discovery_requests_status_idx" ON "discovery_requests"("status");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_units_organization_id_idx" ON "sovereign_blackbox_units"("organization_id");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_units_status_idx" ON "sovereign_blackbox_units"("status");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_jobs_organization_id_idx" ON "sovereign_blackbox_jobs"("organization_id");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_jobs_blackbox_id_idx" ON "sovereign_blackbox_jobs"("blackbox_id");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_jobs_status_idx" ON "sovereign_blackbox_jobs"("status");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_records_organization_id_idx" ON "sovereign_blackbox_records"("organization_id");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_records_blackbox_id_idx" ON "sovereign_blackbox_records"("blackbox_id");

-- CreateIndex
CREATE INDEX "sovereign_blackbox_records_data_hash_idx" ON "sovereign_blackbox_records"("data_hash");

-- CreateIndex
CREATE INDEX "sports_transfer_decisions_organization_id_idx" ON "sports_transfer_decisions"("organization_id");

-- CreateIndex
CREATE INDEX "sports_transfer_decisions_status_idx" ON "sports_transfer_decisions"("status");

-- CreateIndex
CREATE INDEX "sports_transfer_decisions_transaction_type_idx" ON "sports_transfer_decisions"("transaction_type");

-- CreateIndex
CREATE INDEX "sports_transfer_decisions_created_at_idx" ON "sports_transfer_decisions"("created_at");

-- CreateIndex
CREATE INDEX "sports_transfer_decisions_player_name_idx" ON "sports_transfer_decisions"("player_name");

-- AddForeignKey
ALTER TABLE "sessions" ADD CONSTRAINT "sessions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_team_id_fkey" FOREIGN KEY ("team_id") REFERENCES "teams"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "team_members" ADD CONSTRAINT "team_members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "teams" ADD CONSTRAINT "teams_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "prompt_usages" ADD CONSTRAINT "prompt_usages_prompt_template_id_fkey" FOREIGN KEY ("prompt_template_id") REFERENCES "prompt_templates"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_query_responses" ADD CONSTRAINT "agent_query_responses_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "agent_query_responses" ADD CONSTRAINT "agent_query_responses_query_id_fkey" FOREIGN KEY ("query_id") REFERENCES "council_queries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "council_queries" ADD CONSTRAINT "council_queries_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_activities" ADD CONSTRAINT "decision_activities_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_blockers" ADD CONSTRAINT "decision_blockers_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "decisions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliberation_messages" ADD CONSTRAINT "deliberation_messages_agent_id_fkey" FOREIGN KEY ("agent_id") REFERENCES "agents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliberation_messages" ADD CONSTRAINT "deliberation_messages_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliberations" ADD CONSTRAINT "deliberations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_summaries" ADD CONSTRAINT "executive_summaries_decision_id_fkey" FOREIGN KEY ("decision_id") REFERENCES "decisions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "executive_summaries" ADD CONSTRAINT "executive_summaries_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "deliberation_votes" ADD CONSTRAINT "deliberation_votes_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "decision_outcomes" ADD CONSTRAINT "decision_outcomes_deliberation_id_fkey" FOREIGN KEY ("deliberation_id") REFERENCES "deliberations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissents" ADD CONSTRAINT "dissents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dissent_responses" ADD CONSTRAINT "dissent_responses_dissent_id_fkey" FOREIGN KEY ("dissent_id") REFERENCES "dissents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_metric_id_fkey" FOREIGN KEY ("metric_id") REFERENCES "metric_definitions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alerts" ADD CONSTRAINT "alerts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_sources" ADD CONSTRAINT "data_sources_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_definitions" ADD CONSTRAINT "metric_definitions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_definitions" ADD CONSTRAINT "metric_definitions_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "metric_values" ADD CONSTRAINT "metric_values_metric_id_fkey" FOREIGN KEY ("metric_id") REFERENCES "metric_definitions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineage_relationships" ADD CONSTRAINT "lineage_relationships_source_id_fkey" FOREIGN KEY ("source_id") REFERENCES "lineage_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lineage_relationships" ADD CONSTRAINT "lineage_relationships_target_id_fkey" FOREIGN KEY ("target_id") REFERENCES "lineage_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "data_quality_reports" ADD CONSTRAINT "data_quality_reports_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "lineage_entities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "predictions" ADD CONSTRAINT "predictions_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "forecast_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "feature_importance" ADD CONSTRAINT "feature_importance_model_id_fkey" FOREIGN KEY ("model_id") REFERENCES "forecast_models"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_iiss_scores" ADD CONSTRAINT "dcii_iiss_scores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_media_assets" ADD CONSTRAINT "dcii_media_assets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_jurisdiction_assessments" ADD CONSTRAINT "dcii_jurisdiction_assessments_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_timestamp_tokens" ADD CONSTRAINT "dcii_timestamp_tokens_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "evidence_vault_packets" ADD CONSTRAINT "evidence_vault_packets_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "dcii_similarity_decisions" ADD CONSTRAINT "dcii_similarity_decisions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_scheduled_jobs" ADD CONSTRAINT "enterprise_scheduled_jobs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "enterprise_job_executions" ADD CONSTRAINT "enterprise_job_executions_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "enterprise_scheduled_jobs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "insurance_claims" ADD CONSTRAINT "insurance_claims_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "insurance_policies"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_federation_members" ADD CONSTRAINT "gateway_federation_members_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "gateway_federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_federation_policies" ADD CONSTRAINT "gateway_federation_policies_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "gateway_federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_federation_reports" ADD CONSTRAINT "gateway_federation_reports_federation_id_fkey" FOREIGN KEY ("federation_id") REFERENCES "gateway_federations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "gateway_interactions" ADD CONSTRAINT "gateway_interactions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approval_execution_fkey" FOREIGN KEY ("reference_id") REFERENCES "workflow_executions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "deliberations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "approvals" ADD CONSTRAINT "approvals_requester_id_fkey" FOREIGN KEY ("requester_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_regulations" ADD CONSTRAINT "panopticon_regulations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_obligations" ADD CONSTRAINT "panopticon_obligations_regulation_id_fkey" FOREIGN KEY ("regulation_id") REFERENCES "panopticon_regulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_alignments" ADD CONSTRAINT "panopticon_alignments_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "panopticon_obligations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_regulation_id_fkey" FOREIGN KEY ("regulation_id") REFERENCES "panopticon_regulations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_violations" ADD CONSTRAINT "panopticon_violations_obligation_id_fkey" FOREIGN KEY ("obligation_id") REFERENCES "panopticon_obligations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "panopticon_forecasts" ADD CONSTRAINT "panopticon_forecasts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ethics_reviews" ADD CONSTRAINT "ethics_reviews_principle_id_fkey" FOREIGN KEY ("principle_id") REFERENCES "ethics_principles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "govern_audits" ADD CONSTRAINT "govern_audits_policy_id_fkey" FOREIGN KEY ("policy_id") REFERENCES "govern_policies"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_documents" ADD CONSTRAINT "regulatory_documents_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_requirements" ADD CONSTRAINT "regulatory_requirements_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_triggers" ADD CONSTRAINT "regulatory_triggers_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_triggers" ADD CONSTRAINT "regulatory_triggers_requirement_id_fkey" FOREIGN KEY ("requirement_id") REFERENCES "regulatory_requirements"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_constraints" ADD CONSTRAINT "regulatory_constraints_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_conflicts" ADD CONSTRAINT "regulatory_conflicts_document1_id_fkey" FOREIGN KEY ("document1_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_conflicts" ADD CONSTRAINT "regulatory_conflicts_document2_id_fkey" FOREIGN KEY ("document2_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "regulatory_audit_logs" ADD CONSTRAINT "regulatory_audit_logs_document_id_fkey" FOREIGN KEY ("document_id") REFERENCES "regulatory_documents"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "constitutional_opinions" ADD CONSTRAINT "constitutional_opinions_dispute_id_fkey" FOREIGN KEY ("dispute_id") REFERENCES "constitutional_disputes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "persona_conversations" ADD CONSTRAINT "persona_conversations_twin_id_fkey" FOREIGN KEY ("twin_id") REFERENCES "persona_twins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "autopilot_executions" ADD CONSTRAINT "autopilot_executions_rule_id_fkey" FOREIGN KEY ("rule_id") REFERENCES "autopilot_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redteam_vulnerabilities" ADD CONSTRAINT "redteam_vulnerabilities_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "redteam_simulations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "redteam_patches" ADD CONSTRAINT "redteam_patches_vulnerability_id_fkey" FOREIGN KEY ("vulnerability_id") REFERENCES "redteam_vulnerabilities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_runs" ADD CONSTRAINT "apotheosis_runs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_weaknesses" ADD CONSTRAINT "apotheosis_weaknesses_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_auto_patches" ADD CONSTRAINT "apotheosis_auto_patches_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_escalations" ADD CONSTRAINT "apotheosis_escalations_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_upskill_assignments" ADD CONSTRAINT "apotheosis_upskill_assignments_run_id_fkey" FOREIGN KEY ("run_id") REFERENCES "apotheosis_runs"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_pattern_bans" ADD CONSTRAINT "apotheosis_pattern_bans_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_scores" ADD CONSTRAINT "apotheosis_scores_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "apotheosis_configs" ADD CONSTRAINT "apotheosis_configs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "api_keys" ADD CONSTRAINT "api_keys_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "execution_nodes" ADD CONSTRAINT "execution_nodes_execution_id_fkey" FOREIGN KEY ("execution_id") REFERENCES "workflow_executions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "scenarios" ADD CONSTRAINT "scenarios_forecast_id_fkey" FOREIGN KEY ("forecast_id") REFERENCES "forecasts"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflow_executions" ADD CONSTRAINT "workflow_executions_workflow_id_fkey" FOREIGN KEY ("workflow_id") REFERENCES "workflows"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "workflows" ADD CONSTRAINT "workflows_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossaries" ADD CONSTRAINT "omnitranslate_glossaries_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossary" ADD CONSTRAINT "omnitranslate_glossary_glossary_id_fkey" FOREIGN KEY ("glossary_id") REFERENCES "omnitranslate_glossaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_glossary" ADD CONSTRAINT "omnitranslate_glossary_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "omnitranslate_memory" ADD CONSTRAINT "omnitranslate_memory_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "schema_mappings" ADD CONSTRAINT "schema_mappings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "licenses" ADD CONSTRAINT "licenses_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_usage" ADD CONSTRAINT "tenant_usage_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_feature_flags" ADD CONSTRAINT "tenant_feature_flags_tenant_id_fkey" FOREIGN KEY ("tenant_id") REFERENCES "tenants"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tenant_feature_flags" ADD CONSTRAINT "tenant_feature_flags_feature_flag_id_fkey" FOREIGN KEY ("feature_flag_id") REFERENCES "feature_flags"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_simulations" ADD CONSTRAINT "crucible_simulations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_simulations" ADD CONSTRAINT "crucible_simulations_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_universes" ADD CONSTRAINT "crucible_universes_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "crucible_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_impacts" ADD CONSTRAINT "crucible_impacts_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "crucible_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_failure_cascades" ADD CONSTRAINT "crucible_failure_cascades_universe_id_fkey" FOREIGN KEY ("universe_id") REFERENCES "crucible_universes"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_council_deliberations" ADD CONSTRAINT "crucible_council_deliberations_simulation_id_fkey" FOREIGN KEY ("simulation_id") REFERENCES "crucible_simulations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_redteam_reports" ADD CONSTRAINT "crucible_redteam_reports_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_sbom" ADD CONSTRAINT "crucible_sbom_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "crucible_runtime_events" ADD CONSTRAINT "crucible_runtime_events_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_signals" ADD CONSTRAINT "aegis_signals_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_threats" ADD CONSTRAINT "aegis_threats_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_threats" ADD CONSTRAINT "aegis_threats_signal_id_fkey" FOREIGN KEY ("signal_id") REFERENCES "aegis_signals"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_scenarios" ADD CONSTRAINT "aegis_scenarios_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_countermeasures" ADD CONSTRAINT "aegis_countermeasures_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_briefings" ADD CONSTRAINT "aegis_briefings_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "aegis_briefings" ADD CONSTRAINT "aegis_briefings_threat_id_fkey" FOREIGN KEY ("threat_id") REFERENCES "aegis_threats"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "auth_challenges" ADD CONSTRAINT "auth_challenges_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "hardware_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "key_audit_logs" ADD CONSTRAINT "key_audit_logs_key_id_fkey" FOREIGN KEY ("key_id") REFERENCES "hardware_keys"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ledger_entries" ADD CONSTRAINT "ledger_entries_block_number_fkey" FOREIGN KEY ("block_number") REFERENCES "ledger_blocks"("block_number") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_artifacts" ADD CONSTRAINT "eternal_artifacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_artifacts" ADD CONSTRAINT "eternal_artifacts_created_by_fkey" FOREIGN KEY ("created_by") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_validations" ADD CONSTRAINT "eternal_validations_artifact_id_fkey" FOREIGN KEY ("artifact_id") REFERENCES "eternal_artifacts"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_migrations" ADD CONSTRAINT "eternal_migrations_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "eternal_succession" ADD CONSTRAINT "eternal_succession_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_entities" ADD CONSTRAINT "symbiont_entities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_opportunities" ADD CONSTRAINT "symbiont_opportunities_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_opportunities" ADD CONSTRAINT "symbiont_opportunities_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "symbiont_entities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_entity_id_fkey" FOREIGN KEY ("entity_id") REFERENCES "symbiont_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_relationships" ADD CONSTRAINT "symbiont_relationships_related_entity_id_fkey" FOREIGN KEY ("related_entity_id") REFERENCES "symbiont_entities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "symbiont_simulations" ADD CONSTRAINT "symbiont_simulations_opportunity_id_fkey" FOREIGN KEY ("opportunity_id") REFERENCES "symbiont_opportunities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_stakeholders" ADD CONSTRAINT "vox_stakeholders_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_signals" ADD CONSTRAINT "vox_signals_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_impacts" ADD CONSTRAINT "vox_impacts_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_impacts" ADD CONSTRAINT "vox_impacts_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_votes" ADD CONSTRAINT "vox_votes_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_votes" ADD CONSTRAINT "vox_votes_stakeholder_id_fkey" FOREIGN KEY ("stakeholder_id") REFERENCES "vox_stakeholders"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vox_assemblies" ADD CONSTRAINT "vox_assemblies_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "custody_events" ADD CONSTRAINT "custody_events_record_id_fkey" FOREIGN KEY ("record_id") REFERENCES "witness_records"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_evidence" ADD CONSTRAINT "claim_evidence_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "truth_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_votes" ADD CONSTRAINT "claim_votes_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "truth_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "claim_disputes" ADD CONSTRAINT "claim_disputes_claim_id_fkey" FOREIGN KEY ("claim_id") REFERENCES "truth_claims"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sports_transfer_decisions" ADD CONSTRAINT "sports_transfer_decisions_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

