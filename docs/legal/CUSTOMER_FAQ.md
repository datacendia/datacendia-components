# Datacendia Customer FAQ

**Last Updated:** March 2026  
**Version:** 1.0

---

## General

### What is Datacendia?

Datacendia is an AI governance and decision intelligence platform. It provides a multi-agent Council that analyzes business decisions from multiple perspectives — legal, financial, ethical, operational, and strategic — then produces auditable, cryptographically signed decision records.

### Who is Datacendia for?

Datacendia is designed for regulated enterprises and organizations that need defensible, transparent AI-assisted decision-making. Core verticals include financial services, healthcare, defense, energy, government, insurance, legal, and transportation.

### How is Datacendia different from ChatGPT or other AI tools?

| | ChatGPT / Copilot | Datacendia |
|--|---|---|
| Architecture | Single model, single perspective | Multi-agent Council (14 agents, 5 frameworks) |
| Audit trail | None | Cryptographically signed Regulator's Receipt with Merkle tree evidence |
| Governance | None | CendiaGateway with PII detection, policy enforcement, AI Manifest |
| Compliance | None built-in | 10+ regulatory frameworks (EU AI Act, GDPR, SOX, Basel III, HIPAA, etc.) |
| Deployment | Cloud only | Cloud, Self-Hosted, or Sovereign (Air-Gapped) |

---

## Pricing & Licensing

### What are the pricing tiers?

| Tier | Starting Price | Best For |
|------|---------------|----------|
| **Foundation** | $50K/year | Teams starting with AI governance |
| **Intelligence** | $150K/year | Departments scaling AI decision-making |
| **Governance** | $500K/year | Enterprise-wide AI governance |
| **Sovereign** | $1.5M/year | Air-gapped, on-premise, defense/government |

### How is licensing enforced?

- **Cloud-Hosted:** License validated via server-side middleware (Redis cache + database)
- **Self-Hosted / Sovereign:** Cryptographically signed offline license file (.dcl format) — no internet required

### Can I try before I buy?

Contact sales@datacendia.com for a guided demo or proof-of-concept engagement. We offer structured POC programs tailored to your use case.

### What happens if my license expires?

- **Cloud-Hosted:** Access is suspended. Your data is retained for 90 days and can be exported
- **Self-Hosted / Sovereign:** The platform enters read-only mode. Existing data remains accessible. New deliberations require a renewed license file

---

## Deployment

### What deployment options are available?

1. **Cloud-Hosted (SaaS):** Datacendia manages everything. You access it via app.datacendia.com
2. **Self-Hosted (On-Premise):** You deploy on your infrastructure using our Docker images and Helm charts. Datacendia provides updates and support
3. **Sovereign (Air-Gapped):** Fully isolated deployment with zero outbound network connectivity. All AI processing uses your own model servers (Ollama, vLLM, NVIDIA NIM)

### What infrastructure do I need for self-hosted deployment?

- **Minimum:** 4 CPU cores, 16GB RAM, 100GB storage, PostgreSQL 15+, Redis 7+
- **Recommended:** 8+ CPU cores, 32GB RAM, 500GB SSD, with GPU for local AI inference
- **Kubernetes:** Helm chart provided (`helm/datacendia/`)
- **NVIDIA:** Optimized profiles for NVIDIA DGX, A100/H100/H200 GPUs

### Does the sovereign deployment really have zero network requirements?

Yes. The sovereign deployment:
- Uses locally hosted AI models (Ollama, vLLM, NVIDIA NIM)
- Validates licensing via offline .dcl files (Ed25519 signed, no phone-home)
- Stores all data on your infrastructure
- Has no outbound network calls to Datacendia or any cloud service

---

## Security & Compliance

### What security certifications does Datacendia have?

| Certification | Status |
|--------------|--------|
| SOC 2 Type II | Architecture aligned; formal audit planned |
| ISO 27001 | Architecture aligned; certification on contract (Enterprise tier) |
| GDPR | Design-compliant; DPA available |
| ISO 42001 (AI Management) | Self-assessment completed |

### Where is my data stored?

- **Cloud-Hosted:** In the region specified in your Order Form (US or EU). Data does not leave your region
- **Self-Hosted / Sovereign:** Entirely on your infrastructure. Datacendia has zero access

### Does Datacendia train AI models on my data?

**No.** Datacendia never uses Customer Data to train, fine-tune, or improve AI models. Your deliberations, decisions, and organizational data are yours alone.

### Does Datacendia use third-party AI providers?

- **Cloud-Hosted:** AI requests are routed through CendiaGateway to providers (OpenAI, Anthropic, Google, Mistral). CendiaGateway enforces PII detection and data minimization before any data leaves your environment. Providers are contractually prohibited from training on your data
- **Self-Hosted / Sovereign:** You use your own model servers. No third-party AI providers are involved

### How do you handle PII?

CendiaGateway includes a built-in PII detector that scans for 10 PII types (SSN, credit card, email, phone, IP, DOB, medical records, bank accounts, passport numbers, driver's licenses) before any data is sent to AI model providers. PII can be automatically redacted, flagged, or blocked based on your gateway policies.

### Can I get a penetration test report?

A third-party penetration test is planned. Contact security@datacendia.com for the current security questionnaire and architecture documentation.

---

## Data & Privacy

### Can I export my data?

Yes. Go to **Settings > Data Export** to download your data at any time. Data is exported in standard JSON format.

### What happens to my data if I cancel?

- You may export all data before cancellation
- Customer Data is deleted within 30 days of account termination
- Backups containing Customer Data are purged within 90 days
- Billing records are retained for 7 years per tax/legal requirements

### Do you sell my data?

**No.** Datacendia does not sell, share, or monetize Customer Data in any way.

---

## Integrations

### What enterprise systems does Datacendia integrate with?

| Integration | Type |
|------------|------|
| Salesforce | CRM data sync |
| ServiceNow | IT service management |
| Jira | Issue tracking |
| Slack | Notifications and alerts |
| Microsoft Teams | Notifications and alerts |
| SAP | ERP data access |
| Oracle | Database/ERP integration |
| Workday | HR data access |
| HubSpot | Marketing/CRM sync |
| GitHub | Code governance integration |

### How do integrations work with sovereign deployments?

All connector traffic stays within your network. Datacendia does not proxy or relay integration data. Your credentials, your network, your control.

---

## Support

### What support is included?

| Channel | Foundation | Intelligence | Governance | Sovereign |
|---------|-----------|-------------|-----------|-----------|
| Email | ✓ | ✓ | ✓ | ✓ |
| Chat | — | ✓ | ✓ | ✓ |
| Phone | — | — | ✓ | ✓ |
| Dedicated CSM | — | — | ✓ | ✓ |
| Slack Channel | — | — | ✓ | ✓ |

### What are the response times?

| Severity | Foundation | Intelligence | Governance | Sovereign |
|----------|-----------|-------------|-----------|-----------|
| Critical (service down) | 24 hours | 4 hours | 1 hour | 1 hour |
| High (major feature impaired) | 48 hours | 8 hours | 4 hours | 4 hours |
| Medium (feature impaired) | 72 hours | 24 hours | 8 hours | 8 hours |
| Low (general inquiry) | 5 days | 48 hours | 24 hours | 24 hours |

### Where can I check service status?

Visit [app.datacendia.com/status](https://app.datacendia.com/status) for real-time platform health, component status, and active incidents.

---

## Contact

| Purpose | Contact |
|---------|---------|
| Sales inquiries | sales@datacendia.com |
| Technical support | support@datacendia.com |
| Security reports | security@datacendia.com |
| Privacy requests | privacy@datacendia.com |
| Legal / DPA requests | legal@datacendia.com |
| Abuse reports | abuse@datacendia.com |

---

**⚠️ NOTE:** This FAQ is for informational purposes. In case of conflict between this FAQ and the Master SaaS Agreement, the MSA governs.
