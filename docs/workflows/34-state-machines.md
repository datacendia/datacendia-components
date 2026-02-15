# Datacendia Platform — State Machine Diagrams

> **Purpose:** Lifecycle state transitions for key entities — deliberations, decisions, workflows, alerts, compliance, tenants, licenses, disputes, and evidence.

## Deliberation Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: User submits query
    PENDING --> ACTIVE: Agents assigned, deliberation starts
    ACTIVE --> ROUND_N: Agent generates response
    ROUND_N --> GUARDRAIL_CHECK: CendiaSentry validates
    GUARDRAIL_CHECK --> ROUND_N: Pass → next agent
    GUARDRAIL_CHECK --> FLAGGED: Guardrail triggered
    FLAGGED --> ROUND_N: After redaction/filtering
    ROUND_N --> CONSENSUS: All agents complete
    CONSENSUS --> COMPLETE: Recommendation generated
    COMPLETE --> PACKET_GENERATED: Decision packet built
    PACKET_GENERATED --> SIGNED: KMS signs packet
    SIGNED --> [*]

    ACTIVE --> FAILED: LLM error / timeout
    ACTIVE --> CANCELLED: User cancels
    FAILED --> [*]
    CANCELLED --> [*]
```

## Decision Packet Lifecycle

```mermaid
stateDiagram-v2
    [*] --> DRAFT: Deliberation completes
    DRAFT --> BUILDING: Merkle tree generation
    BUILDING --> BUILT: All hashes computed
    BUILT --> SIGNING: Submit to KMS
    SIGNING --> SIGNED: Cryptographic signature applied
    SIGNED --> EXPORTED: Download / API export
    SIGNED --> SUBMITTED: Sent to regulator
    SUBMITTED --> RECEIPT_ISSUED: Regulator receipt generated

    BUILT --> VERIFICATION: Integrity check requested
    VERIFICATION --> VERIFIED: Hash chain intact ✓
    VERIFICATION --> TAMPERED: Hash mismatch ✗

    state SIGNED {
        [*] --> LOCKED: Immutable after signing
        LOCKED --> VETO_REVIEW: Approval gate triggered
        VETO_REVIEW --> APPROVED: All gates pass
        VETO_REVIEW --> VETOED: Gate blocks decision
    }
```

## Workflow Execution Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: Workflow triggered
    PENDING --> RUNNING: First node starts

    state RUNNING {
        [*] --> NODE_EXECUTING
        NODE_EXECUTING --> NODE_COMPLETED: Success
        NODE_EXECUTING --> NODE_FAILED: Error
        NODE_COMPLETED --> NEXT_NODE: More nodes
        NODE_COMPLETED --> AWAITING_APPROVAL: Approval gate
        AWAITING_APPROVAL --> APPROVED: Approver accepts
        AWAITING_APPROVAL --> REJECTED: Approver rejects
        APPROVED --> NEXT_NODE
        NEXT_NODE --> NODE_EXECUTING
    }

    RUNNING --> COMPLETED: All nodes done
    RUNNING --> FAILED: Unrecoverable error
    RUNNING --> SKIPPED: Conditional skip
    FAILED --> [*]
    COMPLETED --> [*]
    SKIPPED --> [*]
```

## Alert Lifecycle

```mermaid
stateDiagram-v2
    [*] --> ACTIVE: Alert triggered
    ACTIVE --> ACKNOWLEDGED: User acknowledges
    ACKNOWLEDGED --> RESOLVED: Issue fixed
    ACTIVE --> RESOLVED: Auto-resolved

    note right of ACTIVE
        Severity: CRITICAL | WARNING | INFO
        Source: system health, compliance, security
    end note

    note right of RESOLVED
        resolution: string
        resolved_by: userId
        resolved_at: timestamp
    end note
```

## Tenant Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: Signup initiated
    PENDING --> TRIAL: Account activated
    TRIAL --> ACTIVE: Subscription starts
    TRIAL --> CHURNED: Trial expires, no conversion

    ACTIVE --> SUSPENDED: Payment failed / policy violation
    SUSPENDED --> ACTIVE: Payment resolved
    SUSPENDED --> CHURNED: No resolution

    state ACTIVE {
        [*] --> PILOT: TenantPlan = PILOT
        [*] --> FOUNDATION: TenantPlan = FOUNDATION
        [*] --> ENTERPRISE: TenantPlan = ENTERPRISE
        [*] --> STRATEGIC: TenantPlan = STRATEGIC
        PILOT --> FOUNDATION: Upgrade
        FOUNDATION --> ENTERPRISE: Upgrade
        ENTERPRISE --> STRATEGIC: Upgrade
    }
```

## License Lifecycle

```mermaid
stateDiagram-v2
    [*] --> ACTIVE: License issued
    ACTIVE --> EXPIRING: 30 days before expiry
    EXPIRING --> EXPIRED: Past expires_at
    EXPIRING --> ACTIVE: Renewed (auto or manual)
    ACTIVE --> SUSPENDED: Manual suspension

    note right of ACTIVE
        Tracks: seats, seats_used
        Types: PILOT, TRIAL, FOUNDATION,
               ENTERPRISE, STRATEGIC, CUSTOM
        Billing: MONTHLY | ANNUAL
    end note
```

## Compliance Assessment Lifecycle

```mermaid
stateDiagram-v2
    [*] --> SCHEDULED: Assessment planned
    SCHEDULED --> RUNNING: Assessment starts
    RUNNING --> EVALUATING: Controls tested
    EVALUATING --> SCORED: Score calculated (0-100)

    SCORED --> COMPLIANT: Score >= threshold
    SCORED --> NON_COMPLIANT: Score < threshold
    NON_COMPLIANT --> REMEDIATION: Auto-fix available
    REMEDIATION --> RE_ASSESSMENT: Fix applied
    RE_ASSESSMENT --> EVALUATING

    state ContinuousMonitor {
        [*] --> MONITORING: 24/7 drift detection
        MONITORING --> DRIFT_DETECTED: Score drops
        DRIFT_DETECTED --> ALERT_SENT: Notify team
        ALERT_SENT --> MONITORING: Issue addressed
    }
```

## Dissent Lifecycle

```mermaid
stateDiagram-v2
    [*] --> FILED: Dissent submitted
    FILED --> UNDER_REVIEW: Assigned to reviewer
    UNDER_REVIEW --> ACKNOWLEDGED: Reviewer accepts validity
    UNDER_REVIEW --> DISMISSED: Reviewer rejects
    ACKNOWLEDGED --> INVESTIGATING: Root cause analysis
    INVESTIGATING --> RESOLVED: Action taken
    INVESTIGATING --> ESCALATED: Needs higher authority

    note right of FILED
        Retaliation protection: ON
        Anonymous option available
        Auto-logged to audit trail
    end note
```

## Data Source Sync Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: Data source created
    PENDING --> CONNECTED: Connection test passes
    PENDING --> ERROR: Connection test fails
    CONNECTED --> SYNCING: Sync job starts
    SYNCING --> CONNECTED: Sync complete
    SYNCING --> ERROR: Sync fails
    ERROR --> CONNECTED: Retry succeeds
    CONNECTED --> DISABLED: Admin disables

    note right of SYNCING
        Types: POSTGRESQL, MYSQL, SNOWFLAKE,
        BIGQUERY, SALESFORCE, SAP, ORACLE,
        MONGODB, REST_API, GRAPHQL, CSV_UPLOAD,
        AWS, AZURE, HUBSPOT, GOOGLE_SHEETS,
        AIRTABLE, STRIPE, SHOPIFY, ZENDESK,
        JIRA, SLACK, REDIS, NEO4J
    end note
```

## Eternal Artifact Verification Lifecycle

```mermaid
stateDiagram-v2
    [*] --> PENDING: Artifact created
    PENDING --> VERIFIED: Initial hash verified
    VERIFIED --> SCHEDULED_CHECK: Periodic validation
    SCHEDULED_CHECK --> VERIFIED: Hash matches ✓
    SCHEDULED_CHECK --> DRIFT_DETECTED: Hash mismatch ✗
    DRIFT_DETECTED --> CORRECTED: Auto-correction applied
    DRIFT_DETECTED --> QUARANTINED: Cannot auto-fix
    CORRECTED --> VERIFIED

    note right of VERIFIED
        retention_years: 1-100+
        access_level: PUBLIC → SUCCESSION
        format_version tracking
        Migration history maintained
    end note
```

## AI Constitutional Court — Dispute Lifecycle

```mermaid
stateDiagram-v2
    [*] --> FILED: Dispute submitted
    FILED --> REVIEWING: Court accepts case
    REVIEWING --> PRECEDENT_SEARCH: Check past opinions
    PRECEDENT_SEARCH --> HEARING: Schedule deliberation
    HEARING --> OPINION_DRAFTED: Court opinion written
    OPINION_DRAFTED --> BINDING_OPINION: Published + enforced
    BINDING_OPINION --> [*]

    BINDING_OPINION --> APPEAL_FILED: Party appeals
    APPEAL_FILED --> APPEAL_REVIEW: Higher review
    APPEAL_REVIEW --> UPHELD: Original stands
    APPEAL_REVIEW --> OVERTURNED: New opinion issued
    UPHELD --> [*]
    OVERTURNED --> [*]
```

## Feature Flag Lifecycle

```mermaid
stateDiagram-v2
    [*] --> CREATED: Flag defined
    CREATED --> DISABLED: Default state
    DISABLED --> ENABLED: Admin toggles on
    ENABLED --> DISABLED: Admin toggles off

    state ENABLED {
        [*] --> BOOLEAN: Simple on/off
        [*] --> PERCENTAGE: Gradual rollout (0-100%)
        [*] --> USER_LIST: Specific users
        [*] --> TENANT_LIST: Specific tenants
    }

    note right of ENABLED
        tenant_feature_flags: per-tenant overrides
        last_toggled_at + last_toggled_by tracked
        Categories: core, premium, beta, experimental
    end note
```
