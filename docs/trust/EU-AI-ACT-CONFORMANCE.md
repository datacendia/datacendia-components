# EU AI Act Conformance Statement

**Organization:** Datacendia, Inc.  
**Document Version:** 1.0  
**Date:** February 6, 2026  
**Regulation Referenced:** Regulation (EU) 2024/1689 — Artificial Intelligence Act  
**Classification:** Public  

---

## Purpose

This document declares the current conformance posture of Datacendia's AI decision governance platform against the EU Artificial Intelligence Act. This is a voluntary self-assessment, not a formal conformity assessment under the regulation.

---

## Risk Classification

Datacendia is **infrastructure** used within high-risk AI systems. It is not itself a standalone AI system that makes autonomous decisions. Rather, it provides the governance, auditability, and verification layer that enables deployers to meet their obligations under the EU AI Act.

Under Article 6 and Annex III, Datacendia's customers may deploy it within high-risk use cases including:

- Critical infrastructure management
- Employment and worker management decisions
- Access to essential public and private services
- Law enforcement and border control support
- Administration of justice and democratic processes

Datacendia's architecture is designed to satisfy the requirements imposed on high-risk AI systems regardless of deployment context.

---

## Requirements Mapping

### Article 9 — Risk Management System

| Requirement | Status | Implementation |
|---|---|---|
| Continuous iterative risk management | Conformant | Pre-execution risk surfacing via multi-agent deliberation; adversarial stress-testing available |
| Identification and analysis of known risks | Conformant | Multi-perspective agent architecture designed to identify risks from legal, financial, ethical, and operational viewpoints |
| Estimation and evaluation of risks | Conformant | Risk scoring, confidence metrics, and Trust Delta computation |
| Risk mitigation measures | Conformant | Escalation paths, policy gates, human-in-the-loop enforcement, override controls |
| Residual risk communication | Conformant | Full deliberation transcripts with dissent preserved and accessible to deployers |

### Article 10 — Data and Data Governance

| Requirement | Status | Implementation |
|---|---|---|
| Training, validation, testing datasets | Not Applicable | Datacendia does not train AI models; it orchestrates and governs their outputs |
| Data quality criteria | Partially Conformant | Input data provenance tracked per decision; formal data quality certification planned |
| Data governance practices | Partially Conformant | Organization-scoped data isolation; cross-jurisdiction data residency controls; formal data governance cadence planned |

### Article 11 — Technical Documentation

| Requirement | Status | Implementation |
|---|---|---|
| General system description | Conformant | Architecture documentation, API specifications, and operational guides maintained |
| Design specifications | Conformant | Decision governance architecture fully documented |
| Development process description | Conformant | Version-controlled codebase with CI/CD pipeline and automated testing |
| Monitoring and oversight capabilities | Conformant | OpenTelemetry instrumentation, Prometheus metrics, structured logging |

### Article 12 — Record-Keeping

| Requirement | Status | Implementation |
|---|---|---|
| Automatic logging | Conformant | Every decision produces a cryptographically signed audit record with timestamps, agent contributions, evidence citations, and reasoning chains |
| Traceability | Conformant | Merkle root integrity verification; hash chain linking; Decision DNA artifacts |
| Log retention | Conformant | Configurable retention policies; immutable audit ledger with append-only architecture |

### Article 13 — Transparency and Provision of Information

| Requirement | Status | Implementation |
|---|---|---|
| Instructions for use | Conformant | API documentation, deployment guides, and operational procedures provided |
| Capabilities and limitations | Conformant | Platform does not claim autonomous decision authority; limitations clearly documented |
| Human oversight measures | Conformant | Escalation paths, override controls, and mandatory review triggers documented |
| Interpretability | Conformant | Full deliberation transcripts with natural language reasoning; decision replay capability |

### Article 14 — Human Oversight

| Requirement | Status | Implementation |
|---|---|---|
| Human oversight by design | Conformant | Mandatory human-in-the-loop escalation for high-risk decisions; no autonomous execution without explicit authority |
| Ability to understand system | Conformant | Decision transcripts, evidence citations, and agent reasoning accessible to human reviewers |
| Ability to override | Conformant | Override mechanism with mandatory justification, authority verification, and audit trail |
| Ability to intervene or halt | Conformant | Real-time decision pipeline with intervention points; policy gates can halt execution |

### Article 15 — Accuracy, Robustness, and Cybersecurity

| Requirement | Status | Implementation |
|---|---|---|
| Accuracy levels documented | Conformant | Agent confidence metrics, Trust Delta computation, and governance effectiveness tracking |
| Resilience against errors | Conformant | Multi-perspective deliberation reduces single-point-of-failure risk; dissent mechanism surfaces errors before execution |
| Cybersecurity measures | Conformant | Cryptographic integrity, HSM/KMS signing, tamper-evident audit ledger, rate limiting, input sanitization, defense-in-depth architecture |
| Adversarial robustness | Conformant | Adversarial Red Team mode available for stress-testing; honeypot endpoints for intrusion detection |

---

## Prohibited Practices (Article 5)

Datacendia does not:

- Perform subliminal manipulation
- Exploit vulnerabilities of specific groups
- Conduct social scoring
- Perform real-time biometric identification
- Infer emotions in workplace or educational contexts

The platform is governance infrastructure. It does not make autonomous decisions or perform any of the practices prohibited under Article 5.

---

## Deployer Obligations Support

Datacendia is designed to help deployers meet their obligations under Article 26:

| Deployer Obligation | How Datacendia Helps |
|---|---|
| Use AI system in accordance with instructions | Decision governance framework enforces usage boundaries |
| Ensure human oversight | Mandatory escalation paths and override controls |
| Monitor AI system operation | Real-time metrics, logging, and alerting infrastructure |
| Keep logs | Immutable, cryptographically signed audit records |
| Inform affected persons | Decision transparency artifacts available for disclosure |
| Conduct fundamental rights impact assessment | Multi-perspective deliberation surfaces rights-related concerns pre-execution |

---

## Planned Actions

| Action | Target Date |
|---|---|
| Formal conformity self-assessment using harmonized standards | Q2 2026 |
| Engagement with notified body for high-risk use cases | Q4 2026 |
| Registration in EU database (if required by deployment context) | Upon first EU deployment |

---

## Statement

Datacendia's AI decision governance platform is designed to conform to the requirements of the EU Artificial Intelligence Act for high-risk AI system infrastructure. The controls, transparency mechanisms, and oversight capabilities described in this document are operational in the current platform build.

This statement is a voluntary self-assessment. Formal conformity assessment will be conducted in coordination with deployers and, where required, notified bodies.

---

**Stuart Rainey**  
Founder & CEO  
Datacendia, Inc.  
February 6, 2026
