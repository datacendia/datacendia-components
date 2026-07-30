# Datacendia — Security & Compliance Posture

> Last updated: May 2026  
> Applies to: Enterprise and Strategic tiers (self-hosted deployments)

---

## Executive Summary

Datacendia is built with SOC 2-aligned controls from the ground up. The platform's core value proposition — forensic-grade, cryptographically verified AI decision trails — required security architecture to be a first-class concern from day one, not a retrofit. Formal SOC 2 Type I certification is targeted for Q4 2026. In the meantime, this document maps existing implemented controls to SOC 2 Trust Service Criteria and answers the most common InfoSec questions from Pilot evaluation prospects. Where a control is implemented, we cite the specific file or service. Where a control is planned, we say so explicitly.

---

## Deployment Model

| Property | Detail |
|---|---|
| **Deployment type** | Self-hosted / on-premise: customer controls all infrastructure |
| **Air-gapped option** | Data never leaves customer network (Strategic tier) — single env-var toggle |
| **Telemetry / call-home** | None. Verified by `DATACENDIA_ONLINE_MODE=false` sovereign mode toggle (`backend/src/services/sovereign/SovereignModeService.ts`) |
| **Customer-owned keys** | CendiaNotary™ accepts customer-provided key material (`backend/src/security/KeycloakAuth.ts`, `backend/src/services/security/KeyManagementService.ts`) |
| **Data residency** | All data stays in customer's PostgreSQL instance. No Datacendia servers receive customer data in self-hosted mode. |
| **AI inference** | Runs locally on customer hardware (Ollama / Triton / NVIDIA NIM — `backend/src/services/llm/`) |

---

## SOC 2 Trust Service Criteria Mapping

| TSC Criterion | Description | Implementation | Status |
|---|---|---|---|
| **CC6.1** | Logical access controls | JWT authentication + Keycloak SSO/MFA (`backend/src/middleware/auth.ts`, `backend/src/security/KeycloakAuth.ts`) | ✅ Implemented |
| **CC6.2** | New user access provisioning | User management via Keycloak, role-based access control enforced at middleware layer | ✅ Implemented |
| **CC6.3** | Access removal | Keycloak session management, JWT revocation | ✅ Implemented |
| **CC6.6** | Security boundaries | Multi-tenant isolation at database and API layer | ✅ Implemented |
| **CC6.7** | Transmission encryption | TLS enforced at nginx layer (`nginx.default.conf`) | ✅ Implemented |
| **CC7.1** | Vulnerability detection | GitHub Dependabot alerts, automated `npm audit` in CI pipeline | ✅ Implemented |
| **CC7.2** | System monitoring | Prometheus + Grafana dashboards (`grafana/`), Wazuh SIEM integration | ✅ Implemented |
| **CC7.3** | Incident evaluation | ImmutableAuditLedger with Merkle-signed event log (`backend/src/services/security/ImmutableAuditLedger.ts`) | ✅ Implemented |
| **CC7.4** | Incident response | Defined process in `SECURITY.md`; contact security@datacendia.com | ✅ Implemented |
| **CC8.1** | Change management | Git history + CI pipeline (`ci.yml`) + branch protection rules | ✅ Implemented |
| **CC9.1** | Risk identification | OPA policy engine (`backend/src/services/opa/`), ImmutableAuditLedger | ✅ Implemented |
| **CC9.2** | Risk mitigation | COLLAPSE adversarial stress testing (`backend/src/services/collapse/`), CendiaCrucible™ | ✅ Implemented |
| **A1.1** | Availability capacity | PostgreSQL HA with PgBouncer (`infrastructure/`), Redis cluster | ✅ Implemented |
| **A1.2** | Environmental safeguards | Customer-controlled infrastructure (self-hosted) | ✅ Customer-controlled |
| **C1.1** | Confidentiality policy | OpenBao/Vault secrets management (`backend/src/services/vault/`) | ✅ Implemented |
| **C1.2** | Confidential information handling | AES-256 at rest, TLS in transit; sovereign mode disables all external transmission | ✅ Implemented |
| **PI1.1** | Processing integrity | Deterministic replay (`backend/src/services/sovereign/DeterministicReplayService.ts`), Merkle verification | ✅ Implemented |
| **PI1.2** | Processing completeness | ImmutableAuditLedger records every deliberation step with cryptographic proof | ✅ Implemented |
| **P1–P8** | Privacy criteria | ML-based PII detection via Presidio (Foundation+), GDPR/CCPA controls, DCII framework | ✅ Implemented (Presidio: Foundation+) |

---

## Secrets Management

| Control | Status |
|---|---|
| No secrets in source code | ✅ Verified — only mock/placeholder values in test fixtures |
| Secrets via environment variables or OpenBao/Vault | ✅ `backend/src/services/vault/` — Vault KV v2, transit encryption, dynamic DB credentials |
| `.env` files excluded from version control | ✅ `.gitignore` enforced; `.env.example` ships with placeholder values only |
| Secret scanning on repository | ✅ GitHub secret scanning enabled |
| Key rotation | ✅ Supported via KeyManagementService (`backend/src/services/security/KeyManagementService.ts`) |

---

## Dependency Security

| Control | Status |
|---|---|
| Automated vulnerability alerts | ✅ GitHub Dependabot configured (`.github/dependabot.yml`) |
| `npm audit` in CI | ✅ Runs on every PR/push; fails on high or critical severity |
| Current vulnerability status | 0 critical, 0 high (as of April 2026 audit) — moderate/low only |
| SBOM generation | ✅ CendiaSBOM service (`backend/src/services/crucible/SBOMService.ts`) |
| Dependency auto-merge | ✅ Patch-level Dependabot PRs auto-merged via `dependabot-auto-merge.yml` |

---

## Data Handling

Because Datacendia runs entirely on customer infrastructure in self-hosted mode:

- **We never receive, process, or store customer data.** All data stays in the customer's own PostgreSQL instance.
- **All AI inference runs locally** — Ollama, Triton, or NVIDIA NIM on customer hardware (`backend/src/services/llm/`). No data is sent to OpenAI, Anthropic, or any external AI provider.
- **Audit ledger is stored in the customer's PostgreSQL instance** — cryptographically signed and tamper-evident, but entirely under customer control.
- **We have no network access to customer environments** — zero call-home, zero telemetry.
- **Air-gapped mode** (Strategic tier): the platform can run with no internet connection at all. A single environment variable (`DATACENDIA_ONLINE_MODE=false`) disables all outbound connections and is validated at startup.

---

## Penetration Testing

| Activity | Status |
|---|---|
| External pen test | Planned — targeted Q3 2026 |
| Internal adversarial testing | ✅ CendiaCollapse™ (19 adversarial agents) and CendiaCrucible™ continuously stress-test decision logic |
| Results availability | Internal test results available on request under NDA |

---

## Incident Response

- Defined process documented in `SECURITY.md`
- Contact: security@datacendia.com
- P1 (platform down): include `[P1]` in subject line for priority routing
- Response SLA: Strategic tier — 1 hour, 24/7; Enterprise tier — 4 hours, 24/7 for P1

---

## Certifications Roadmap

| Certification | Status | Target Date |
|---|---|---|
| SOC 2 Type I | In progress | Q4 2026 |
| SOC 2 Type II | Planned | Q2 2027 |
| ISO 27001 | Planned | 2027 |
| FedRAMP (Strategic) | Roadmap | TBD |
| HIPAA BAA | Available on request | Now (self-hosted; BAA not required — no PHI leaves customer environment) |

---

## Common InfoSec Questions

**Q: Do you have a penetration test report?**  
A: External pen test is scheduled for Q3 2026. We provide our internal adversarial test results (CendiaCollapse™ — 19 specialized stress-test agents) on request under NDA.

---

**Q: How do you handle our data?**  
A: We don't. Datacendia runs entirely on your infrastructure. We never have network access to your deployment. All data — deliberations, decisions, audit ledger, PII — stays in your PostgreSQL instance. All AI inference runs on your hardware.

---

**Q: Can we review your code?**  
A: Yes. Enterprise contracts include full source code access under NDA. Strategic tier includes escrow arrangements. The Community Edition (Apache 2.0) provides a guaranteed open-source baseline for the core engine.

---

**Q: What happens if you go out of business?**  
A: Source code escrow is available on Enterprise and Strategic contracts. The Community Edition (Apache 2.0) is publicly available and provides a guaranteed open-source baseline — customers can continue operating indefinitely without Datacendia's involvement.

---

**Q: How do you handle zero-days in your dependencies?**  
A: Dependabot monitors all dependencies and raises PRs automatically. `npm audit` runs in CI and fails on high/critical severity. Patch-level updates are auto-merged. The SBOM service (`CendiaSBOMService`) can generate a full software bill of materials for any deployment on request.

---

**Q: Do you support MFA?**  
A: Yes. Keycloak SSO/MFA is implemented in `backend/src/security/KeycloakAuth.ts` and is the enforced authentication provider on Enterprise and Strategic tiers.

---

**Q: Is data encrypted at rest and in transit?**  
A: In transit: TLS enforced at the nginx reverse proxy layer. At rest: AES-256 via OpenBao/Vault (`backend/src/services/vault/`). Customers control their own encryption keys via CendiaNotary™. Post-quantum cryptographic signatures (Dilithium, SPHINCS+, Falcon) are available on Strategic tier.

---

**Q: Do you have a compliance framework?**  
A: The platform implements controls aligned to SOC 2, HIPAA, GDPR, NIST 800-53, Basel III, and EU AI Act. The DCII (Decision Crisis Immunization Infrastructure) framework provides the technical spine — see `docs/DCII_FRAMEWORK_WHITE_PAPER.md` for details. The more detailed technical controls map is at `docs/SOC2_CONTROLS_MATRIX.md`.

---

*For a deeper technical review, see [SOC 2 Controls Matrix](SOC2_CONTROLS_MATRIX.md).*  
*For deployment questions, see [Air-Gapped Deployment Guide](AIRGAPPED_DEPLOYMENT.md).*
