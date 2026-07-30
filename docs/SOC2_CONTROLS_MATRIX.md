# Datacendia — SOC 2 Technical Controls Matrix

> Version: May 2026  
> Audience: Customer security teams conducting vendor due diligence  
> Applies to: Enterprise and Strategic tiers (self-hosted)

This document provides a detailed mapping of every SOC 2 Trust Service Criteria (TSC) criterion to the specific file, service, or configuration that implements it in the Datacendia platform. Controls marked **Implemented** are present in the current codebase. Controls marked **Planned** are on the roadmap with a target date.

For the sales-facing summary, see [SECURITY_POSTURE.md](SECURITY_POSTURE.md).

---

## Common Criteria (CC) — Security

### CC1 — Control Environment

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC1.1 | Integrity and ethical values | Platform enforces role-based access; audit trail is tamper-evident | Customer defines acceptable use policy | ✅ Implemented |
| CC1.2 | Board oversight | N/A (Datacendia is the vendor; customer's board oversees their own deployment) | Customer's governance structure | ✅ Customer-controlled |
| CC1.3 | Organisational structure | CODEOWNERS file defines code ownership (`CODEOWNERS`) | Customer org structure | ✅ Implemented |
| CC1.4 | Competence | CI enforces type-checking and linting | Customer manages their team | ✅ Implemented |
| CC1.5 | Accountability | Every action logged to ImmutableAuditLedger with user ID | Customer manages users | ✅ Implemented |

### CC2 — Communication and Information

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC2.1 | Information quality | Structured API responses with validation; Prisma schema enforces data integrity | Customer's data entry | ✅ Implemented |
| CC2.2 | Internal communication | API + event bus; NotificationService (`backend/src/services/NotificationService.ts`) | Customer's internal comms | ✅ Implemented |
| CC2.3 | External communication | SECURITY.md, support@datacendia.com, this document | Customer communicates to auditors | ✅ Implemented |

### CC3 — Risk Assessment

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC3.1 | Risk identification | OPA policy engine (`backend/src/services/opa/`); ImmutableAuditLedger flags anomalies | Customer defines risk appetite | ✅ Implemented |
| CC3.2 | Risk assessment | COLLAPSE adversarial agents (`backend/src/services/collapse/`) stress-test decisions | Customer runs stress tests | ✅ Implemented |
| CC3.3 | Risk response | CendiaNerve incident response service (`backend/src/services/enterprise/CendiaNerveService.ts`) | Customer triggers response | ✅ Implemented |
| CC3.4 | Risk monitoring | Prometheus metrics + Grafana dashboards (`grafana/`) | Customer monitors dashboards | ✅ Implemented |

### CC4 — Monitoring Activities

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC4.1 | Control monitoring | ImmutableAuditLedger (`backend/src/services/security/ImmutableAuditLedger.ts`) — Merkle-signed, every entry | Customer retains ledger | ✅ Implemented |
| CC4.2 | Deficiency evaluation | CI pipeline fails on test failures, audit findings; PLATFORM_AUDIT documents tracked | Customer reviews audit reports | ✅ Implemented |

### CC5 — Control Activities

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC5.1 | Control selection | Role-based access control + OPA policies | Customer selects applicable policies | ✅ Implemented |
| CC5.2 | Control design | Middleware chain: auth → rate-limit → validation → business logic (`backend/src/middleware/`) | Customer configures middleware | ✅ Implemented |
| CC5.3 | Deployment | CI/CD pipeline (`ci.yml`), Docker Compose, branch protection | Customer controls deployment | ✅ Implemented |

### CC6 — Logical and Physical Access Controls

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC6.1 | Logical access controls | JWT authentication + Keycloak SSO (`backend/src/middleware/auth.ts`, `backend/src/security/KeycloakAuth.ts`) | Customer manages Keycloak | ✅ Implemented |
| CC6.2 | User access provisioning | Keycloak user management; role-based access at API layer | Customer administers users | ✅ Implemented |
| CC6.3 | Access removal | JWT revocation; Keycloak session termination | Customer manages offboarding | ✅ Implemented |
| CC6.4 | Physical access | Self-hosted: customer controls the server room | Customer controls physical infra | ✅ Customer-controlled |
| CC6.5 | Logical access — system components | Separate service accounts; secrets in Vault, never in env vars at rest | Customer controls Vault | ✅ Implemented |
| CC6.6 | Logical access — network | nginx reverse proxy enforces TLS; internal services not exposed externally | Customer configures firewall | ✅ Implemented |
| CC6.7 | Transmission encryption | TLS 1.2+ enforced at nginx layer (`nginx.default.conf`) | Customer provides TLS cert | ✅ Implemented |
| CC6.8 | Malicious software protection | ClamAV integration (`backend/src/services/sovereign/ClamAVIntegration.ts`); Wazuh SIEM | Customer runs Wazuh | ✅ Implemented |

### CC7 — System Operations

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC7.1 | Vulnerability detection | GitHub Dependabot; `npm audit` in CI (fails on high/critical) | Customer reviews alerts | ✅ Implemented |
| CC7.2 | Security monitoring | Wazuh SIEM integration; Prometheus + Grafana dashboards (`grafana/`) | Customer operates SIEM | ✅ Implemented |
| CC7.3 | Security event evaluation | ImmutableAuditLedger stores all security events; ROADMAP: automated SIEM alerting | Customer reviews events | ⚠️ Partial — alerting planned |
| CC7.4 | Incident response | SECURITY.md process; security@datacendia.com; CendiaNerve incident management | Customer triggers response | ✅ Implemented |
| CC7.5 | Disclosure of breaches | security@datacendia.com; responsible disclosure process in SECURITY.md | Customer notifies regulators | ✅ Implemented |

### CC8 — Change Management

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC8.1 | Change management process | Git history + PR reviews + CI pipeline; branch protection on `main` | Customer enforces branch protection | ✅ Implemented |

### CC9 — Risk Mitigation

| CC Sub-criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| CC9.1 | Risk mitigation via vendor selection | Self-hosted: customer selects their own infrastructure vendors | Customer's vendor management | ✅ Customer-controlled |
| CC9.2 | Risk mitigation — business disruption | PostgreSQL HA (`infrastructure/`), Redis cluster, `DATACENDIA_ONLINE_MODE=false` fallback | Customer configures HA | ✅ Implemented |

---

## Availability (A)

| Criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| A1.1 | Availability commitments | 99.5% SLA (Pilot), 99.9% (Foundation), 99.95% (Enterprise) — managed deployment | Customer controls self-hosted infra | ✅ Implemented |
| A1.2 | Environmental safeguards | Customer controls server room, UPS, cooling (self-hosted) | Customer controls physical infra | ✅ Customer-controlled |
| A1.3 | Recovery | PostgreSQL HA with PgBouncer failover (`infrastructure/`); Redis sentinel; backup scripts (`backend/src/services/backup/`) | Customer runs backups | ✅ Implemented |

---

## Confidentiality (C)

| Criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| C1.1 | Identification of confidential information | OPA policies classify data sensitivity; ML-based PII detection (Presidio, Foundation+) | Customer defines classification policy | ✅ Implemented |
| C1.2 | Confidential information protection | AES-256 at rest via OpenBao/Vault (`backend/src/services/vault/`); TLS in transit; no external transmission in sovereign mode | Customer controls keys | ✅ Implemented |

---

## Processing Integrity (PI)

| Criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| PI1.1 | Processing integrity commitments | ImmutableAuditLedger records every step; Merkle proof chain is independently verifiable | Customer retains ledger | ✅ Implemented |
| PI1.2 | Processing completeness | DeterministicReplayService (`backend/src/services/sovereign/DeterministicReplayService.ts`) validates full replay | Customer runs replay audits | ✅ Implemented |
| PI1.3 | Processing accuracy | Prisma schema validation; API input validation; agent responses logged verbatim | Customer reviews deliberations | ✅ Implemented |
| PI1.4 | Processing authorisation | RBAC + OPA policy gate on every deliberation action | Customer defines authorisation policies | ✅ Implemented |
| PI1.5 | Processing non-repudiation | Merkle-signed evidence packets; RFC 3161 timestamps (ROADMAP: live TSA) | Customer stores evidence bundles | ⚠️ Partial — live TSA planned Q3 2026 |

---

## Privacy (P)

| Criterion | Description | Implementation | Customer Controls | Status |
|---|---|---|---|---|
| P1 — Notice | Privacy notice to data subjects | Platform does not collect end-user data from customer deployments | Customer provides notice to their users | ✅ Customer-controlled |
| P2 — Choice and consent | Opt-in/opt-out mechanisms | ML PII detection flags and redacts PII before processing (Foundation+) | Customer configures redaction rules | ✅ Implemented (Foundation+) |
| P3 — Collection | Data collection limited to purpose | Council deliberation data only; no telemetry or analytics sent externally | Customer defines purpose | ✅ Implemented |
| P4 — Use | Use limited to stated purpose | Sovereign mode (`DATACENDIA_ONLINE_MODE=false`) prevents any data leaving customer network | Customer enforces sovereign mode | ✅ Implemented |
| P5 — Retention | Data retention and disposal | Customer controls PostgreSQL retention; no data at Datacendia to delete | Customer manages retention | ✅ Customer-controlled |
| P6 — Access | Subject access requests | Customer manages their PostgreSQL database directly | Customer handles SARs | ✅ Customer-controlled |
| P7 — Disclosure | Disclosure to third parties | Datacendia receives no customer data in self-hosted mode | Customer controls disclosures | ✅ Implemented |
| P8 — Quality | Data quality maintenance | ImmutableAuditLedger is append-only; corrections logged as new entries | Customer manages data quality | ✅ Implemented |

---

## Security Controls Summary

### Controls Fully Implemented

| Control Category | Files/Services |
|---|---|
| Authentication | `backend/src/middleware/auth.ts`, `backend/src/security/KeycloakAuth.ts` |
| Authorisation | `backend/src/middleware/auth.ts`, `backend/src/services/opa/` |
| Audit Logging | `backend/src/services/security/ImmutableAuditLedger.ts` |
| Secrets Management | `backend/src/services/vault/`, `backend/src/services/security/KeyManagementService.ts` |
| Encryption at Rest | OpenBao/Vault (AES-256); `backend/src/services/security/` |
| Encryption in Transit | `nginx.default.conf` (TLS 1.2+) |
| Vulnerability Management | `.github/dependabot.yml`, `ci.yml` (`npm audit --audit-level=high`) |
| Malware Detection | `backend/src/services/sovereign/ClamAVIntegration.ts` |
| Incident Response | `SECURITY.md`, `backend/src/services/enterprise/CendiaNerveService.ts` |
| MFA | `backend/src/security/KeycloakAuth.ts` (Keycloak MFA) |
| Backup/Recovery | `backend/src/services/backup/`, PostgreSQL HA scripts (`infrastructure/`) |
| Monitoring | `grafana/` (Prometheus + Grafana), Wazuh SIEM |
| Change Management | `.github/workflows/ci.yml`, branch protection |
| Adversarial Testing | `backend/src/services/collapse/` (19 agents), `backend/src/services/crucible/` |

### Controls Planned (with Target Dates)

| Control | Current State | Target |
|---|---|---|
| Live RFC 3161 TSA timestamps | Deterministic computation (audit-accurate) | Q3 2026 |
| HSM hardware integration | Software KMS (Vault) with HSM adapter stub | Q4 2026 |
| Automated SIEM alerting | Manual review of ImmutableAuditLedger | Q3 2026 |
| External penetration test | Internal adversarial testing via CendiaCollapse™ | Q3 2026 |
| SOC 2 Type I certification | SOC 2-aligned controls implemented | Q4 2026 |

### Controls That Are Customer-Controlled (Self-Hosted)

| Control | Who Controls It |
|---|---|
| Physical server security | Customer |
| Network firewall rules | Customer |
| TLS certificate management | Customer |
| Backup frequency and retention | Customer |
| User account lifecycle | Customer (via Keycloak admin) |
| SIEM operation | Customer (Wazuh self-hosted) |
| Disaster recovery RTO/RPO | Customer |

---

*For the executive summary version, see [SECURITY_POSTURE.md](SECURITY_POSTURE.md).*  
*For the Pilot onboarding guide, see [PILOT_PLAYBOOK.md](PILOT_PLAYBOOK.md).*
