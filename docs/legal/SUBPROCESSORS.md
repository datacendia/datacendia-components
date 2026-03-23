# Datacendia Subprocessor List

**Effective Date:** March 2026  
**Last Updated:** March 2026  
**Version:** 1.0

---

## Overview

This document lists the subprocessors that Datacendia, Inc. uses to provide the Cloud-Hosted Services. This list is maintained pursuant to Section 7.4 of the Datacendia Master SaaS Agreement.

**Change notification:** Datacendia will provide at least 30 days' written notice before adding a new subprocessor. Customers may object to a new subprocessor by contacting legal@datacendia.com within 15 days of notification.

**Self-Hosted and Sovereign deployments:** No subprocessors are used unless Customer explicitly enables third-party integrations. All processing occurs on Customer-controlled infrastructure.

---

## Infrastructure Subprocessors

These subprocessors provide the underlying infrastructure for the Cloud-Hosted Services.

| Subprocessor | Purpose | Data Processed | Location |
|-------------|---------|---------------|----------|
| **Vercel** | Frontend hosting, CDN, edge functions | Request metadata, static assets | US, EU (edge) |
| **Railway / Render** | Backend application hosting | Application data, API requests | US |
| **Neon / Supabase** | PostgreSQL database hosting | All persistent Customer Data | US (configurable) |
| **Upstash** | Redis caching and rate limiting | Session tokens, cached queries, rate limit counters | US (configurable) |

## Communication Subprocessors

| Subprocessor | Purpose | Data Processed | Location |
|-------------|---------|---------------|----------|
| **Resend** | Transactional email (invitations, alerts, notifications) | Email addresses, notification content | US |

## Payment Subprocessors

| Subprocessor | Purpose | Data Processed | Location |
|-------------|---------|---------------|----------|
| **Stripe** | Payment processing, subscription management | Billing contact, payment method tokens, invoice data | US, EU |

## AI Model Providers (Cloud-Hosted Only)

When using Cloud-Hosted AI processing, requests are routed through CendiaGateway to these providers. In Self-Hosted and Sovereign deployments, customers use their own model servers (Ollama, vLLM, etc.) and no data reaches these providers.

| Subprocessor | Purpose | Data Processed | Location |
|-------------|---------|---------------|----------|
| **OpenAI** | AI model inference (GPT-4, GPT-4o) | Deliberation prompts and responses (not stored by provider per DPA) | US |
| **Anthropic** | AI model inference (Claude) | Deliberation prompts and responses (not stored by provider per DPA) | US |
| **Google Cloud AI** | AI model inference (Gemini) | Deliberation prompts and responses (not stored by provider per DPA) | US |
| **Mistral AI** | AI model inference (Mistral, Mixtral) | Deliberation prompts and responses (not stored by provider per DPA) | EU |

**Note:** CendiaGateway enforces data minimization — only the minimum context required for inference is sent to model providers. Full deliberation history and Customer Data are not transmitted.

## Monitoring & Observability

| Subprocessor | Purpose | Data Processed | Location |
|-------------|---------|---------------|----------|
| **Sentry** | Error tracking and performance monitoring | Error stack traces, request metadata (no Customer Data content) | US |

---

## Customer-Enabled Integrations (Not Subprocessors)

When Customer enables enterprise connectors, data flows directly between the Services and these third-party systems using Customer-provided credentials. These are **not** Datacendia subprocessors — they are Customer-directed integrations.

| Integration | Data Flow | Customer Controls |
|------------|-----------|------------------|
| **Salesforce** | CRM data sync | Customer OAuth credentials |
| **ServiceNow** | IT service management | Customer OAuth credentials |
| **Jira** | Issue tracking sync | Customer API token |
| **Slack** | Notifications and alerts | Customer webhook/OAuth |
| **Microsoft Teams** | Notifications and alerts | Customer webhook/OAuth |
| **SAP** | ERP data access | Customer API credentials |
| **Oracle** | Database/ERP integration | Customer connection string |
| **Workday** | HR data access | Customer API credentials |
| **HubSpot** | Marketing/CRM sync | Customer OAuth credentials |
| **GitHub** | Code governance integration | Customer OAuth/PAT |

In Self-Hosted and Sovereign deployments, all connector traffic remains entirely within Customer's network.

---

## Change Log

| Date | Change | Notification Sent |
|------|--------|------------------|
| March 2026 | Initial subprocessor list published | — |

---

## Contact

For questions about subprocessors or to object to a new subprocessor:

- **Email:** legal@datacendia.com
- **DPA requests:** legal@datacendia.com

---

**⚠️ IMPORTANT DISCLAIMER:**  
This document is a template. Verify that the listed subprocessors match your actual infrastructure before publishing. Update this list whenever you change hosting providers, payment processors, or AI model providers.
