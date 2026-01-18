# Enterprise Test Suite Documentation - Sections 61-120

## Data, Identity, Security, and IT Operations Tests

This document provides detailed documentation for test sections 61-120 of the Enterprise Complete Test Suite, covering data management, identity and access, security infrastructure, and IT operations.

---

## Section 61: Models

Tests for AI/ML model management endpoints.

### 61.1 Models - List
```powershell
Test-API -Name "Models - List" -Category "models" -Method "GET" -Endpoint "/api/v1/models" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists all AI/ML models in the system.
**Why:** Ensures model inventory is accessible for governance and audit purposes.
**Importance:** HIGH - Required for AI model governance and compliance tracking.
**Controls:** CC6.1 (Logical Access), A.8.11 (Protection of Information)

### 61.2 Models - Available
```powershell
Test-API -Name "Models - Available" -Category "models" -Method "GET" -Endpoint "/api/v1/models/available" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Lists models available for deployment.
**Why:** Tracks which models can be activated in the system.
**Importance:** MEDIUM - Operational visibility into model options.

### 61.3 Models - Deployed
```powershell
Test-API -Name "Models - Deployed" -Category "models" -Method "GET" -Endpoint "/api/v1/models/deployed" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists currently deployed/active models.
**Why:** Tracks production model usage for compliance.
**Importance:** HIGH - Critical for AI governance and audit trails.

### 61.4 Models - Metrics
```powershell
Test-API -Name "Models - Metrics" -Category "models" -Method "GET" -Endpoint "/api/v1/models/metrics" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Retrieves model performance metrics.
**Why:** Monitors model behavior and performance over time.
**Importance:** MEDIUM - Operational monitoring for model drift detection.

---

## Section 62: Pipelines

Tests for data/ML pipeline management.

### 62.1 Pipelines - List
```powershell
Test-API -Name "Pipelines - List" -Category "pipelines" -Method "GET" -Endpoint "/api/v1/pipelines" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists all data/ML pipelines.
**Why:** Pipeline inventory for data governance.
**Importance:** HIGH - Required for data lineage tracking.

### 62.2 Pipelines - Active
```powershell
Test-API -Name "Pipelines - Active" -Category "pipelines" -Method "GET" -Endpoint "/api/v1/pipelines/active" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Lists currently running pipelines.
**Why:** Monitors active data processing operations.
**Importance:** MEDIUM - Operational visibility.

### 62.3 Pipelines - History
```powershell
Test-API -Name "Pipelines - History" -Category "pipelines" -Method "GET" -Endpoint "/api/v1/pipelines/history" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves pipeline execution history.
**Why:** Audit trail for data processing operations.
**Importance:** HIGH - Required for compliance audits.

### 62.4 Pipelines - Templates
```powershell
Test-API -Name "Pipelines - Templates" -Category "pipelines" -Method "GET" -Endpoint "/api/v1/pipelines/templates" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Lists available pipeline templates.
**Why:** Standardized pipeline configurations.
**Importance:** MEDIUM - Governance through standardization.

---

## Section 63: Transformations

Tests for data transformation capabilities.

### 63.1 Transformations - List
```powershell
Test-API -Name "Transformations - List" -Category "transformations" -Method "GET" -Endpoint "/api/v1/transformations" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists all data transformations.
**Why:** Tracks how data is modified in the system.
**Importance:** HIGH - Data lineage and integrity tracking.

### 63.2 Transformations - Types
```powershell
Test-API -Name "Transformations - Types" -Category "transformations" -Method "GET" -Endpoint "/api/v1/transformations/types" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Lists available transformation types.
**Why:** Catalogs transformation capabilities.
**Importance:** MEDIUM - Operational documentation.

### 63.3 Transformations - History
```powershell
Test-API -Name "Transformations - History" -Category "transformations" -Method "GET" -Endpoint "/api/v1/transformations/history" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves transformation execution history.
**Why:** Audit trail for data changes.
**Importance:** HIGH - Required for data integrity audits.

---

## Section 64: Queries

Tests for query management functionality.

### 64.1 Queries - List
```powershell
Test-API -Name "Queries - List" -Category "queries" -Method "GET" -Endpoint "/api/v1/queries" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists all stored queries.
**Why:** Query inventory for governance.
**Importance:** MEDIUM - Query management and access control.

### 64.2 Queries - Saved
```powershell
Test-API -Name "Queries - Saved" -Category "queries" -Method "GET" -Endpoint "/api/v1/queries/saved" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Lists user-saved queries.
**Why:** Tracks saved query configurations.
**Importance:** LOW - User convenience feature.

### 64.3 Queries - History
```powershell
Test-API -Name "Queries - History" -Category "queries" -Method "GET" -Endpoint "/api/v1/queries/history" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves query execution history.
**Why:** Audit trail for data access.
**Importance:** HIGH - Required for data access auditing.

### 64.4 Queries - Templates
```powershell
Test-API -Name "Queries - Templates" -Category "queries" -Method "GET" -Endpoint "/api/v1/queries/templates" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Lists query templates.
**Why:** Standardized query patterns.
**Importance:** MEDIUM - Governance through standardization.

---

## Section 65: Schedules

Tests for scheduled job management.

### 65.1 Schedules - List
```powershell
Test-API -Name "Schedules - List" -Category "schedules" -Method "GET" -Endpoint "/api/v1/schedules" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists all scheduled tasks.
**Why:** Schedule inventory for operational control.
**Importance:** MEDIUM - Operational visibility.

### 65.2 Schedules - Active
```powershell
Test-API -Name "Schedules - Active" -Category "schedules" -Method "GET" -Endpoint "/api/v1/schedules/active" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Lists currently active schedules.
**Why:** Monitors scheduled operations.
**Importance:** MEDIUM - Operational monitoring.

### 65.3 Schedules - History
```powershell
Test-API -Name "Schedules - History" -Category "schedules" -Method "GET" -Endpoint "/api/v1/schedules/history" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves schedule execution history.
**Why:** Audit trail for automated operations.
**Importance:** HIGH - Required for compliance audits.

---

## Section 66: Jobs

Tests for background job management.

### 66.1 Jobs - List
```powershell
Test-API -Name "Jobs - List" -Category "jobs" -Method "GET" -Endpoint "/api/v1/jobs" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.11") -AllowError
```
**What:** Lists all background jobs.
**Why:** Job inventory for operational control.
**Importance:** MEDIUM - Operational visibility.

### 66.2 Jobs - Running
```powershell
Test-API -Name "Jobs - Running" -Category "jobs" -Method "GET" -Endpoint "/api/v1/jobs/running" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Lists currently running jobs.
**Why:** Monitors active processing.
**Importance:** MEDIUM - Operational monitoring.

### 66.3 Jobs - Completed
```powershell
Test-API -Name "Jobs - Completed" -Category "jobs" -Method "GET" -Endpoint "/api/v1/jobs/completed" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Lists completed jobs.
**Why:** Audit trail for job executions.
**Importance:** HIGH - Required for compliance audits.

### 66.4 Jobs - Failed
```powershell
Test-API -Name "Jobs - Failed" -Category "jobs" -Method "GET" -Endpoint "/api/v1/jobs/failed" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Lists failed jobs.
**Why:** Error tracking and incident management.
**Importance:** HIGH - Required for operational excellence.

---

## Section 67: Alerts Extended

Extended alerting functionality tests.

### 67.1 Alerts - Rules
```powershell
Test-API -Name "Alerts - Rules" -Category "alerts" -Method "GET" -Endpoint "/api/v1/alerts/rules" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Lists alert rules configuration.
**Why:** Verifies alerting policy configuration.
**Importance:** HIGH - Critical for security monitoring.

### 67.2 Alerts - Channels
```powershell
Test-API -Name "Alerts - Channels" -Category "alerts" -Method "GET" -Endpoint "/api/v1/alerts/channels" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Lists alert notification channels.
**Why:** Ensures alerts reach appropriate parties.
**Importance:** HIGH - Critical for incident response.

### 67.3 Alerts - Templates
```powershell
Test-API -Name "Alerts - Templates" -Category "alerts" -Method "GET" -Endpoint "/api/v1/alerts/templates" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Lists alert templates.
**Why:** Standardized alert configurations.
**Importance:** MEDIUM - Governance through standardization.

### 67.4 Alerts - Escalations
```powershell
Test-API -Name "Alerts - Escalations" -Category "alerts" -Method "GET" -Endpoint "/api/v1/alerts/escalations" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Lists escalation policies.
**Why:** Ensures critical alerts are escalated properly.
**Importance:** HIGH - Critical for incident management.

---

## Section 68: Monitoring

System monitoring endpoint tests.

### 68.1 Monitoring - Status
```powershell
Test-API -Name "Monitoring - Status" -Category "monitoring" -Method "GET" -Endpoint "/api/v1/monitoring/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Retrieves system monitoring status.
**Why:** Verifies monitoring systems are operational.
**Importance:** HIGH - Critical for observability.

### 68.2 Monitoring - Metrics
```powershell
Test-API -Name "Monitoring - Metrics" -Category "monitoring" -Method "GET" -Endpoint "/api/v1/monitoring/metrics" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Retrieves system metrics.
**Why:** Performance and health monitoring.
**Importance:** HIGH - Operational visibility.

### 68.3 Monitoring - Dashboards
```powershell
Test-API -Name "Monitoring - Dashboards" -Category "monitoring" -Method "GET" -Endpoint "/api/v1/monitoring/dashboards" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Lists monitoring dashboards.
**Why:** Centralized visibility into system health.
**Importance:** MEDIUM - Operational convenience.

### 68.4 Monitoring - Alerts
```powershell
Test-API -Name "Monitoring - Alerts" -Category "monitoring" -Method "GET" -Endpoint "/api/v1/monitoring/alerts" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Lists monitoring alerts.
**Why:** Real-time issue detection.
**Importance:** HIGH - Critical for incident detection.

---

## Section 69: Logs

Log management endpoint tests.

### 69.1 Logs - Application
```powershell
Test-API -Name "Logs - Application" -Category "logs" -Method "GET" -Endpoint "/api/v1/logs/application" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves application logs.
**Why:** Application-level audit trail.
**Importance:** HIGH - Required for troubleshooting and audits.

### 69.2 Logs - Security
```powershell
Test-API -Name "Logs - Security" -Category "logs" -Method "GET" -Endpoint "/api/v1/logs/security" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves security logs.
**Why:** Security event tracking.
**Importance:** CRITICAL - Required for security audits.

### 69.3 Logs - Access
```powershell
Test-API -Name "Logs - Access" -Category "logs" -Method "GET" -Endpoint "/api/v1/logs/access" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves access logs.
**Why:** User access audit trail.
**Importance:** CRITICAL - Required for access audits.

### 69.4 Logs - Error
```powershell
Test-API -Name "Logs - Error" -Category "logs" -Method "GET" -Endpoint "/api/v1/logs/error" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Retrieves error logs.
**Why:** Error tracking and analysis.
**Importance:** HIGH - Required for incident management.

---

## Section 70: Metrics

System metrics endpoint tests.

### 70.1 Metrics - System
```powershell
Test-API -Name "Metrics - System" -Category "metrics" -Method "GET" -Endpoint "/api/v1/metrics/system" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Retrieves system-level metrics.
**Why:** Infrastructure monitoring.
**Importance:** HIGH - Operational visibility.

### 70.2 Metrics - Application
```powershell
Test-API -Name "Metrics - Application" -Category "metrics" -Method "GET" -Endpoint "/api/v1/metrics/application" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Retrieves application metrics.
**Why:** Application performance monitoring.
**Importance:** HIGH - Performance optimization.

### 70.3 Metrics - Custom
```powershell
Test-API -Name "Metrics - Custom" -Category "metrics" -Method "GET" -Endpoint "/api/v1/metrics/custom" -Frameworks @("soc2-type2") -Controls @("CC7.2") -AllowError
```
**What:** Retrieves custom-defined metrics.
**Why:** Business-specific monitoring.
**Importance:** MEDIUM - Custom observability.

### 70.4 Metrics - Export
```powershell
Test-API -Name "Metrics - Export" -Category "metrics" -Method "GET" -Endpoint "/api/v1/metrics/export" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Exports metrics data.
**Why:** External analysis and reporting.
**Importance:** MEDIUM - Reporting capability.

---

## Section 71: Backup

Backup management tests.

### 71.1 Backup - Status
```powershell
Test-API -Name "Backup - Status" -Category "backup" -Method "GET" -Endpoint "/api/v1/backup/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.13") -AllowError
```
**What:** Retrieves backup system status.
**Why:** Verifies backup systems are operational.
**Importance:** CRITICAL - Data protection verification.
**Controls:** CC6.1 (Logical Access), A.8.13 (Information Backup)

### 71.2 Backup - List
```powershell
Test-API -Name "Backup - List" -Category "backup" -Method "GET" -Endpoint "/api/v1/backup/list" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.13") -AllowError
```
**What:** Lists available backups.
**Why:** Backup inventory for recovery planning.
**Importance:** HIGH - Disaster recovery readiness.

### 71.3 Backup - Schedule
```powershell
Test-API -Name "Backup - Schedule" -Category "backup" -Method "GET" -Endpoint "/api/v1/backup/schedule" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.13") -AllowError
```
**What:** Retrieves backup schedule.
**Why:** Verifies backup frequency meets requirements.
**Importance:** HIGH - Compliance with backup policies.

### 71.4 Backup - Retention
```powershell
Test-API -Name "Backup - Retention" -Category "backup" -Method "GET" -Endpoint "/api/v1/backup/retention" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.13") -AllowError
```
**What:** Retrieves backup retention policies.
**Why:** Verifies data retention compliance.
**Importance:** HIGH - Regulatory compliance.

---

## Section 72: Recovery

Recovery management tests.

### 72.1 Recovery - Status
```powershell
Test-API -Name "Recovery - Status" -Category "recovery" -Method "GET" -Endpoint "/api/v1/recovery/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.14") -AllowError
```
**What:** Retrieves recovery system status.
**Why:** Verifies recovery capability.
**Importance:** CRITICAL - Business continuity readiness.
**Controls:** CC6.1 (Logical Access), A.8.14 (Redundancy)

### 72.2 Recovery - Points
```powershell
Test-API -Name "Recovery - Points" -Category "recovery" -Method "GET" -Endpoint "/api/v1/recovery/points" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.14") -AllowError
```
**What:** Lists recovery points.
**Why:** Available restore targets.
**Importance:** HIGH - Disaster recovery planning.

### 72.3 Recovery - History
```powershell
Test-API -Name "Recovery - History" -Category "recovery" -Method "GET" -Endpoint "/api/v1/recovery/history" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves recovery operation history.
**Why:** Audit trail for recovery operations.
**Importance:** HIGH - Required for audits.

---

## Section 73: Encryption

Encryption management tests.

### 73.1 Encryption - Status
```powershell
Test-API -Name "Encryption - Status" -Category "encryption" -Method "GET" -Endpoint "/api/v1/encryption/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Retrieves encryption status.
**Why:** Verifies data encryption is active.
**Importance:** CRITICAL - Data protection verification.
**Controls:** CC6.1 (Logical Access), A.8.24 (Use of Cryptography)

### 73.2 Encryption - Keys
```powershell
Test-API -Name "Encryption - Keys" -Category "encryption" -Method "GET" -Endpoint "/api/v1/encryption/keys" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Lists encryption keys (metadata only).
**Why:** Key inventory for cryptographic governance.
**Importance:** HIGH - Key management compliance.

### 73.3 Encryption - Algorithms
```powershell
Test-API -Name "Encryption - Algorithms" -Category "encryption" -Method "GET" -Endpoint "/api/v1/encryption/algorithms" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Lists supported encryption algorithms.
**Why:** Cryptographic standards compliance.
**Importance:** HIGH - Security standards verification.

---

## Section 74: Certificates

Certificate management tests.

### 74.1 Certificates - List
```powershell
Test-API -Name "Certificates - List" -Category "certificates" -Method "GET" -Endpoint "/api/v1/certificates" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Lists all certificates.
**Why:** Certificate inventory for PKI management.
**Importance:** HIGH - TLS/PKI governance.

### 74.2 Certificates - Expiring
```powershell
Test-API -Name "Certificates - Expiring" -Category "certificates" -Method "GET" -Endpoint "/api/v1/certificates/expiring" -Frameworks @("soc2-type2","iso27001") -Controls @("CC7.2","A.8.16") -AllowError
```
**What:** Lists certificates nearing expiration.
**Why:** Proactive certificate renewal.
**Importance:** CRITICAL - Prevents service outages.

### 74.3 Certificates - Trusted
```powershell
Test-API -Name "Certificates - Trusted" -Category "certificates" -Method "GET" -Endpoint "/api/v1/certificates/trusted" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Lists trusted certificate authorities.
**Why:** Trust chain management.
**Importance:** HIGH - Security posture.

---

## Section 75: Secrets

Secrets management tests.

### 75.1 Secrets - List
```powershell
Test-API -Name "Secrets - List" -Category "secrets" -Method "GET" -Endpoint "/api/v1/secrets" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Lists secrets (metadata only).
**Why:** Secrets inventory for governance.
**Importance:** HIGH - Secrets management compliance.

### 75.2 Secrets - Vaults
```powershell
Test-API -Name "Secrets - Vaults" -Category "secrets" -Method "GET" -Endpoint "/api/v1/secrets/vaults" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Lists secret vaults.
**Why:** Vault infrastructure visibility.
**Importance:** HIGH - Secrets infrastructure.

### 75.3 Secrets - Rotation
```powershell
Test-API -Name "Secrets - Rotation" -Category "secrets" -Method "GET" -Endpoint "/api/v1/secrets/rotation" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.24") -AllowError
```
**What:** Retrieves secret rotation status.
**Why:** Verifies secrets are rotated per policy.
**Importance:** CRITICAL - Security best practice.

---

## Section 76: Network

Network security tests.

### 76.1 Network - Status
```powershell
Test-API -Name "Network - Status" -Category "network" -Method "GET" -Endpoint "/api/v1/network/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Retrieves network status.
**Why:** Network health monitoring.
**Importance:** HIGH - Infrastructure visibility.
**Controls:** CC6.6 (Logical/Physical Access), A.8.20 (Network Security)

### 76.2 Network - Rules
```powershell
Test-API -Name "Network - Rules" -Category "network" -Method "GET" -Endpoint "/api/v1/network/rules" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Lists network rules.
**Why:** Network access control verification.
**Importance:** HIGH - Security configuration.

### 76.3 Network - Policies
```powershell
Test-API -Name "Network - Policies" -Category "network" -Method "GET" -Endpoint "/api/v1/network/policies" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Lists network policies.
**Why:** Network governance verification.
**Importance:** HIGH - Security policy compliance.

---

## Section 77: Firewall

Firewall management tests.

### 77.1 Firewall - Status
```powershell
Test-API -Name "Firewall - Status" -Category "firewall" -Method "GET" -Endpoint "/api/v1/firewall/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Retrieves firewall status.
**Why:** Verifies firewall is operational.
**Importance:** CRITICAL - Network security.

### 77.2 Firewall - Rules
```powershell
Test-API -Name "Firewall - Rules" -Category "firewall" -Method "GET" -Endpoint "/api/v1/firewall/rules" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Lists firewall rules.
**Why:** Firewall configuration audit.
**Importance:** HIGH - Security configuration.

### 77.3 Firewall - Logs
```powershell
Test-API -Name "Firewall - Logs" -Category "firewall" -Method "GET" -Endpoint "/api/v1/firewall/logs" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.15") -AllowError
```
**What:** Retrieves firewall logs.
**Why:** Network security audit trail.
**Importance:** HIGH - Security monitoring.

---

## Section 78: VPN

VPN management tests.

### 78.1 VPN - Status
```powershell
Test-API -Name "VPN - Status" -Category "vpn" -Method "GET" -Endpoint "/api/v1/vpn/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Retrieves VPN status.
**Why:** Verifies VPN infrastructure is operational.
**Importance:** HIGH - Secure remote access.

### 78.2 VPN - Connections
```powershell
Test-API -Name "VPN - Connections" -Category "vpn" -Method "GET" -Endpoint "/api/v1/vpn/connections" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Lists VPN connections.
**Why:** VPN usage monitoring.
**Importance:** HIGH - Access visibility.

### 78.3 VPN - Policies
```powershell
Test-API -Name "VPN - Policies" -Category "vpn" -Method "GET" -Endpoint "/api/v1/vpn/policies" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.6","A.8.20") -AllowError
```
**What:** Lists VPN policies.
**Why:** VPN access control verification.
**Importance:** HIGH - Security policy compliance.

---

## Section 79: SSO

Single Sign-On tests.

### 79.1 SSO - Status
```powershell
Test-API -Name "SSO - Status" -Category "sso" -Method "GET" -Endpoint "/api/v1/sso/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SSO status.
**Why:** Verifies SSO infrastructure is operational.
**Importance:** HIGH - Enterprise authentication.
**Controls:** CC6.1 (Logical Access), A.8.2 (Access Rights)

### 79.2 SSO - Providers
```powershell
Test-API -Name "SSO - Providers" -Category "sso" -Method "GET" -Endpoint "/api/v1/sso/providers" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists SSO identity providers.
**Why:** Identity federation configuration.
**Importance:** HIGH - Identity management.

### 79.3 SSO - Config
```powershell
Test-API -Name "SSO - Config" -Category "sso" -Method "GET" -Endpoint "/api/v1/sso/config" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SSO configuration.
**Why:** SSO configuration verification.
**Importance:** HIGH - Security configuration.

---

## Section 80: MFA

Multi-Factor Authentication tests.

### 80.1 MFA - Status
```powershell
Test-API -Name "MFA - Status" -Category "mfa" -Method "GET" -Endpoint "/api/v1/mfa/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.5") -AllowError
```
**What:** Retrieves MFA status.
**Why:** Verifies MFA is enabled and operational.
**Importance:** CRITICAL - Strong authentication.
**Controls:** CC6.1 (Logical Access), A.8.5 (Secure Authentication)

### 80.2 MFA - Methods
```powershell
Test-API -Name "MFA - Methods" -Category "mfa" -Method "GET" -Endpoint "/api/v1/mfa/methods" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.5") -AllowError
```
**What:** Lists available MFA methods.
**Why:** MFA options verification.
**Importance:** HIGH - Authentication flexibility.

### 80.3 MFA - Policies
```powershell
Test-API -Name "MFA - Policies" -Category "mfa" -Method "GET" -Endpoint "/api/v1/mfa/policies" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.5") -AllowError
```
**What:** Lists MFA policies.
**Why:** MFA enforcement verification.
**Importance:** CRITICAL - Security policy compliance.

---

## Section 81: Identity

Identity provider tests.

### 81.1 Identity - Providers
```powershell
Test-API -Name "Identity - Providers" -Category "identity" -Method "GET" -Endpoint "/api/v1/identity/providers" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists identity providers.
**Why:** Identity infrastructure inventory.
**Importance:** HIGH - Identity management.

### 81.2 Identity - Federation
```powershell
Test-API -Name "Identity - Federation" -Category "identity" -Method "GET" -Endpoint "/api/v1/identity/federation" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves federation configuration.
**Why:** Cross-domain identity trust.
**Importance:** HIGH - Enterprise identity.

### 81.3 Identity - Sync
```powershell
Test-API -Name "Identity - Sync" -Category "identity" -Method "GET" -Endpoint "/api/v1/identity/sync" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves identity sync status.
**Why:** Directory synchronization monitoring.
**Importance:** HIGH - Identity consistency.

---

## Section 82: Directory

Directory services tests.

### 82.1 Directory - Status
```powershell
Test-API -Name "Directory - Status" -Category "directory" -Method "GET" -Endpoint "/api/v1/directory/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves directory service status.
**Why:** Verifies directory services are operational.
**Importance:** HIGH - Identity infrastructure.

### 82.2 Directory - Users
```powershell
Test-API -Name "Directory - Users" -Category "directory" -Method "GET" -Endpoint "/api/v1/directory/users" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.5.15") -AllowError
```
**What:** Lists directory users.
**Why:** User inventory for access management.
**Importance:** HIGH - Access governance.

### 82.3 Directory - Groups
```powershell
Test-API -Name "Directory - Groups" -Category "directory" -Method "GET" -Endpoint "/api/v1/directory/groups" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.5.15") -AllowError
```
**What:** Lists directory groups.
**Why:** Group-based access control.
**Importance:** HIGH - Access governance.

---

## Section 83: LDAP

LDAP integration tests.

### 83.1 LDAP - Status
```powershell
Test-API -Name "LDAP - Status" -Category "ldap" -Method "GET" -Endpoint "/api/v1/ldap/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves LDAP status.
**Why:** Verifies LDAP connectivity.
**Importance:** HIGH - Directory integration.

### 83.2 LDAP - Config
```powershell
Test-API -Name "LDAP - Config" -Category "ldap" -Method "GET" -Endpoint "/api/v1/ldap/config" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves LDAP configuration.
**Why:** LDAP settings verification.
**Importance:** HIGH - Directory configuration.

### 83.3 LDAP - Test
```powershell
Test-API -Name "LDAP - Test" -Category "ldap" -Method "GET" -Endpoint "/api/v1/ldap/test" -Frameworks @("soc2-type2") -Controls @("CC6.1") -AllowError
```
**What:** Tests LDAP connectivity.
**Why:** Validates LDAP integration.
**Importance:** MEDIUM - Integration testing.

---

## Section 84: OAuth

OAuth management tests.

### 84.1 OAuth - Clients
```powershell
Test-API -Name "OAuth - Clients" -Category "oauth" -Method "GET" -Endpoint "/api/v1/oauth/clients" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists OAuth clients.
**Why:** OAuth client inventory.
**Importance:** HIGH - API access governance.

### 84.2 OAuth - Tokens
```powershell
Test-API -Name "OAuth - Tokens" -Category "oauth" -Method "GET" -Endpoint "/api/v1/oauth/tokens" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists OAuth tokens (metadata).
**Why:** Token lifecycle management.
**Importance:** HIGH - Access control.

### 84.3 OAuth - Scopes
```powershell
Test-API -Name "OAuth - Scopes" -Category "oauth" -Method "GET" -Endpoint "/api/v1/oauth/scopes" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists OAuth scopes.
**Why:** Permission boundary definitions.
**Importance:** HIGH - Least privilege.

---

## Section 85: SAML

SAML integration tests.

### 85.1 SAML - Status
```powershell
Test-API -Name "SAML - Status" -Category "saml" -Method "GET" -Endpoint "/api/v1/saml/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SAML status.
**Why:** Verifies SAML SSO is operational.
**Importance:** HIGH - Enterprise SSO.

### 85.2 SAML - Metadata
```powershell
Test-API -Name "SAML - Metadata" -Category "saml" -Method "GET" -Endpoint "/api/v1/saml/metadata" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SAML metadata.
**Why:** Federation configuration.
**Importance:** HIGH - SSO configuration.

### 85.3 SAML - Config
```powershell
Test-API -Name "SAML - Config" -Category "saml" -Method "GET" -Endpoint "/api/v1/saml/config" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SAML configuration.
**Why:** SAML settings verification.
**Importance:** HIGH - SSO configuration.

---

## Section 86: SCIM

SCIM provisioning tests.

### 86.1 SCIM - Status
```powershell
Test-API -Name "SCIM - Status" -Category "scim" -Method "GET" -Endpoint "/api/v1/scim/status" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SCIM status.
**Why:** Verifies automated provisioning is operational.
**Importance:** HIGH - Automated identity lifecycle.

### 86.2 SCIM - Config
```powershell
Test-API -Name "SCIM - Config" -Category "scim" -Method "GET" -Endpoint "/api/v1/scim/config" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Retrieves SCIM configuration.
**Why:** Provisioning settings verification.
**Importance:** HIGH - Identity automation.

### 86.3 SCIM - Mappings
```powershell
Test-API -Name "SCIM - Mappings" -Category "scim" -Method "GET" -Endpoint "/api/v1/scim/mappings" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists SCIM attribute mappings.
**Why:** Identity attribute transformation.
**Importance:** MEDIUM - Provisioning configuration.

---

## Section 87: Tokens

Token management tests.

### 87.1 Tokens - List
```powershell
Test-API -Name "Tokens - List" -Category "tokens" -Method "GET" -Endpoint "/api/v1/tokens" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists authentication tokens.
**Why:** Token inventory for access control.
**Importance:** HIGH - Session management.

### 87.2 Tokens - Active
```powershell
Test-API -Name "Tokens - Active" -Category "tokens" -Method "GET" -Endpoint "/api/v1/tokens/active" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists active tokens.
**Why:** Active session visibility.
**Importance:** HIGH - Access monitoring.

### 87.3 Tokens - Policies
```powershell
Test-API -Name "Tokens - Policies" -Category "tokens" -Method "GET" -Endpoint "/api/v1/tokens/policies" -Frameworks @("soc2-type2","iso27001") -Controls @("CC6.1","A.8.2") -AllowError
```
**What:** Lists token policies.
**Why:** Token lifecycle policies.
**Importance:** HIGH - Session security.

---

## Sections 88-120: Extended Operations

The remaining sections (88-120) cover extended IT operations including:

| Section | Category | Tests | Controls |
|---------|----------|-------|----------|
| 88 | Sessions | Session management | CC6.1, A.8.2 |
| 89 | Policies Extended | Access, Security, Data, Retention | CC6.1, A.5.1, Art.32 |
| 90 | Compliance Extended | Frameworks, Controls, Evidence | CC1.1, A.5.1 |
| 91 | Governance | Policies, Standards, Exceptions | CC1.1, A.5.1 |
| 92 | Risk | Assessment, Register, Mitigations | CC3.1, A.5.7 |
| 93 | Incidents | List, Open, Resolved, Reports | CC7.4, A.5.24 |
| 94 | Vulnerabilities | List, Critical, Remediation | CC7.1, A.8.8 |
| 95 | Threats | Intelligence, Indicators, Feeds | CC7.1, A.5.7 |
| 96 | Penetration | Tests, Results, Schedule | CC7.1, A.8.8 |
| 97 | Scanning | Status, Results, Schedule | CC7.1, A.8.8 |
| 98 | Patching | Status, Pending, History | CC6.8, A.8.8 |
| 99 | Change Management | Requests, Approvals, History | CC8.1, A.8.32 |
| 100 | Release Management | List, Pending, Deployed | CC8.1, A.8.32 |
| 101 | Configuration Mgmt | Items, Baselines, Drift | CC8.1, A.8.9 |
| 102 | Asset Management | Inventory, Hardware, Software | CC6.1, A.5.9 |
| 103 | Capacity Mgmt | Current, Forecast, Alerts | CC6.1, A.8.6 |
| 104 | Performance | Metrics, Baselines, Trends | CC6.1, A.8.6 |
| 105 | Availability | Status, SLA, Reports | CC6.1, A.8.14 |
| 106 | Disaster Recovery | Plans, Tests, Status | CC9.1, A.5.30 |
| 107 | Business Continuity | Plans, Impact, Tests | CC9.1, A.5.29 |
| 108 | Service Management | Catalog, Levels, Dependencies | CC6.1, A.5.23 |
| 109 | Vendor Management | List, Risk, Contracts | CC9.2, A.5.19 |
| 110 | Contracts | List, Active, Expiring | CC9.2, A.5.20 |
| 111 | Problem Management | List, Open, Root Cause | CC7.4, A.5.26 |
| 112 | Knowledge Mgmt | Articles, Search, Categories | CC6.1, A.5.37 |
| 113 | Request Management | List, Pending, Completed | CC6.1, A.5.1 |
| 114 | Service Desk | Tickets, Queue, Metrics | CC6.1, A.5.1 |
| 115 | Project Management | List, Active, Milestones | CC6.1, A.5.8 |
| 116 | Portfolio Mgmt | Overview, Investments, ROI | CC6.1, A.5.8 |
| 117 | Demand Management | Forecast, Pipeline, Priorities | CC6.1, A.5.8 |
| 118 | Financial Mgmt | Budgets, Costs, Chargebacks | CC6.1, A.5.8 |
| 119 | Resource Mgmt | Allocation, Capacity, Skills | CC6.1, A.5.8 |
| 120 | Time Tracking | Entries, Summary, Approvals | CC6.1, A.5.8 |

---

## Compliance Framework Mapping

### SOC 2 Type II Controls in This Section
- **CC6.1** - Logical and Physical Access Controls
- **CC6.6** - Logical Access Security Measures
- **CC6.7** - System Operations
- **CC6.8** - Change Management
- **CC7.1** - Security Monitoring
- **CC7.2** - System Monitoring
- **CC7.4** - Incident Response
- **CC8.1** - Change Management
- **CC9.1** - Risk Mitigation
- **CC9.2** - Vendor Management

### ISO 27001:2022 Controls in This Section
- **A.5.1** - Policies for Information Security
- **A.5.7** - Threat Intelligence
- **A.5.9** - Asset Inventory
- **A.8.2** - Access Rights
- **A.8.5** - Secure Authentication
- **A.8.8** - Vulnerability Management
- **A.8.9** - Configuration Management
- **A.8.11** - Data Masking
- **A.8.13** - Information Backup
- **A.8.14** - Redundancy
- **A.8.15** - Logging
- **A.8.16** - Monitoring
- **A.8.20** - Network Security
- **A.8.24** - Use of Cryptography

---

*This documentation covers sections 61-120. See TEST-SUITE-SECTIONS-121-180.md for subsequent sections.*
