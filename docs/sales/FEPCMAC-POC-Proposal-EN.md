# Proof of Concept Proposal — FEPCMAC / CendiaGateway™

**Datacendia, LLC → Peruvian Federation of Municipal Savings and Credit Banks**

---

## The Problem

The 11 Cajas Municipales de Ahorro y Crédito within FEPCMAC operate artificial intelligence systems in critical processes — credit scoring, suspicious transaction detection, risk analysis — without technical infrastructure to generate verifiable evidence of compliance with:

- **DS N° 115-2025-PCM** — mandatory AI governance standard in Peru
- **Law 31814** — Peru's AI regulatory framework classifying credit scoring as high-risk
- **SBS Regulations** on corporate governance and comprehensive risk management

Today, if the SBS requests evidence of AI governance, no technical mechanism exists to generate it.

## The Solution

**CendiaGateway™** deploys as federation infrastructure between the CMACs' AI systems and their users. It operates as a reverse proxy that:

1. **Intercepts** every AI interaction without modifying existing systems
2. **Audits** the content — detecting PII, applying policies, recording context
3. **Cryptographically signs** each record with SHA-256 — immutable and third-party verifiable
4. **Generates** a Regulatory Evidence Package ready for SBS presentation

It deploys inside the CMAC's infrastructure. No data leaves the institutional perimeter.

## The Proof of Concept

| Element | Detail |
|---|---|
| **Duration** | 60 calendar days |
| **Scope** | 2 pilot Cajas Municipales |
| **Users** | Compliance team + credit officers at each pilot caja |
| **Audited workflow** | Credit scoring (workflow to be confirmed with technical team) |
| **Primary deliverable** | DS N° 115-2025-PCM evidence package ready for SBS presentation |

## Timeline

| Week | Activity |
|---|---|
| **1–2** | Infrastructure setup, CendiaGateway deployment in test environment |
| **3–4** | Integration with credit scoring workflow, policy configuration |
| **5–6** | Audited operation period — evidence collection |
| **7–8** | Evidence package generation, compliance team review, final report |

## Deliverables

1. **CendiaGateway deployed** in pilot caja infrastructure
2. **DS N° 115-2025-PCM Evidence Package** — technical document with:
   - Audited interaction records
   - Verifiable cryptographic signatures
   - Clause-by-clause mapping to ISO/IEC 42001:2023
   - Operational metrics (PII detected, policies applied, volume processed)
3. **Executive report** with recommendations for deployment across all 11 cajas
4. **Federated deployment plan** — proposed architecture for the entire FEPCMAC network

## Investment

| Concept | Amount |
|---|---|
| **Complete POC (60 days, 2 cajas)** | **USD $20,000** |
| Credited toward first annual contract | Yes — 100% of POC amount |

The POC amount is fully credited toward the first annual licensing contract.

## What Datacendia Provides

- CendiaGateway deployment and installation on designated infrastructure
- Configuration of microfinance-specific governance policies
- Technical support during the 60-day POC
- Compliance team training on dashboard usage
- Regulatory evidence package generation

## What FEPCMAC Provides

- DNS or VPN access to pilot caja infrastructure
- One named internal contact per pilot caja (compliance or technology)
- List of AI tools currently in use at pilot cajas
- Compliance team availability for review sessions (2 sessions of 1 hour)

## Next Steps

1. Confirmation of interest and pilot caja designation
2. 30-minute technical call to validate infrastructure requirements
3. NDA and POC agreement signing
4. Deployment begins

---

**Contact:**

**Stuart Rainey** — CEO, Datacendia  
stuart.rainey@datacendia.com  
datacendia.com

---

*Datacendia, LLC — Decision Crisis Immunization Infrastructure*  
*Lima, Peru / London, United Kingdom*
