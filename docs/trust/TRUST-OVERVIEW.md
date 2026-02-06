# Datacendia Trust & Compliance Overview

**Document Version:** 1.0  
**Date:** February 6, 2026  
**Classification:** Public  

---

## What Datacendia Is

Datacendia is infrastructure for auditable, reviewable AI-assisted decisions in regulated environments.

The platform produces regulator-grade evidence that governance processes were followed, disagreements were captured, and human oversight was exercised. It does not replace domain controls — it records and proves them.

---

## Security Architecture

| Capability | Implementation |
|---|---|
| Cryptographic integrity | SHA-256 hash chains with Merkle root verification on every decision artifact |
| Digital signatures | HSM / KMS signing support (AWS KMS, HashiCorp Vault, post-quantum ready) |
| Tamper evidence | Immutable audit ledger with append-only architecture; tamper detection on read |
| Offline verification | Decision artifacts verifiable without platform access using independent tooling |
| Transport security | TLS 1.2+ enforced; HSTS, CSP, and security headers via Helmet middleware |
| Authentication | JWT + refresh token rotation; MFA (TOTP) support; Keycloak SSO integration |
| Authorization | Role-based access control with organization-scoped data isolation |
| Input protection | Rate limiting, CSRF protection, input sanitization, defense-in-depth middleware |
| Intrusion detection | Honeypot endpoints; anomaly detection; structured security event logging |

---

## Governance Guarantees

- **Human oversight enforced by design.** Escalation paths require human review for high-risk decisions. No autonomous execution without explicit authority.
- **Dissent cannot be silently removed.** Every agent disagreement is cryptographically committed before the final decision is rendered.
- **Overrides require authority and justification.** Override events are recorded with the identity of the approver, the justification, and the timestamp.
- **Decisions are replayable.** Every deliberation can be replayed step-by-step with full context, agent reasoning, and evidence citations.

---

## Compliance Posture

| Framework | Status | Details |
|---|---|---|
| **ISO/IEC 42001** | Design-aligned | Self-attested conformance statement published; certification planned post-pilot |
| **NIST AI RMF** | Mapped | All four functions (GOVERN, MAP, MEASURE, MANAGE) addressed |
| **EU AI Act** | Design-aligned | Risk classification, transparency, human oversight, and audit trail requirements addressed |
| **SOC 2 Type II** | Planned | Architecture supports all Trust Services Criteria; formal audit post-revenue |
| **HIPAA** | Deployment-ready | BAA-compatible architecture; PHI isolation supported; formal compliance via deployment partner |
| **FedRAMP** | Deployment-ready | Post-quantum KMS, air-gap capable, NIST 800-53 controls mapped; ATO via deployment partner |
| **GDPR** | Design-aligned | Data residency controls, cross-jurisdiction engine, consent tracking, right-to-erasure support |

---

## Verification Artifacts

| Artifact | Format | Access |
|---|---|---|
| ISO 42001 Conformance Statement | PDF / Markdown | [Published](/trust/iso-42001-conformance.pdf) |
| NIST AI RMF Alignment | PDF / Markdown | [Published](/trust/nist-ai-rmf-alignment.pdf) |
| Software Bill of Materials (SBOM) | CycloneDX JSON | [Published](/trust/sbom.json) |
| Security Disclosure Policy | Plain text | [Published](/.well-known/security.txt) |
| Verification Tooling | Open source | [GitHub](https://github.com/datacendia/verification-tools) |

---

## Software Bill of Materials

A complete SBOM in CycloneDX format is published at `/trust/sbom.json` and updated with each release. The SBOM includes:

- All direct and transitive dependencies
- Package versions and licenses
- Cryptographic hashes for integrity verification

This meets US Executive Order 14028 requirements for software supply chain transparency.

---

## Security Disclosure

Datacendia maintains a responsible disclosure policy. Security researchers can report vulnerabilities via the process described at `/.well-known/security.txt`.

---

## Important Statement

Datacendia is a **certification-enabling layer**. It reduces audit scope by producing immutable decision evidence. The platform does not claim to replace regulatory compliance programs — it provides the technical infrastructure that makes those programs provable.

---

**Datacendia, Inc.**  
February 6, 2026
