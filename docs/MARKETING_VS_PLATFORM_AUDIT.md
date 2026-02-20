# Marketing Website vs Platform Comparison Audit

**Date:** 2026-02-20
**Marketing Site:** datacendia.com (static HTML/CSS/JS — `datacendia-marketing-master`)
**Platform:** datacendia-components (React/TypeScript SPA + Express backend)

---

## Executive Summary

The marketing website is **strong on messaging, honest about limitations, and well-aligned with the platform's actual capabilities.** The tone is premium, sovereign-first, and procurement-safe. However, there are several gaps where the marketing site either **undersells** platform capabilities, references **outdated numbers**, or points to features **not yet surfaced** in the marketing. There are also a few areas where the marketing claims slightly **outpace** what the platform currently delivers in production.

**Overall Score: 7.5/10** — Good alignment with meaningful upgrade opportunities.

---

## 1. What the Marketing Site Does Well

### ✅ Honesty Matrices — Strongest Differentiator
The 6 Honesty Matrices (Sovereignty, AI Governance, Integration, What Breaks at 3AM, Platform Comparison, What We Can't Do) are **perfectly mirrored** in the platform's `HonestyMatricesPage.tsx`. The marketing site and platform tell the same story. This is the brand's most authentic asset.

### ✅ "Not BI, Not AI API" Positioning
The FAQ section clearly differentiates Datacendia from BI tools, cloud AI APIs, and analytics+agents. The platform's actual architecture (multi-agent Council, immutable ledger, evidence packets) backs this positioning.

### ✅ Limitations Page — Radical Transparency
Marketing openly admits: no real-time streaming (<100ms), scaling limits (validated to 50 concurrent), no SLA without ops team. This aligns with Datacendia's honesty brand and prevents buyer disappointment.

### ✅ Sovereignty Messaging Consistency
Both the marketing site and the platform's `SovereignLandingPage.tsx` use identical language: "Your infrastructure. Your control. Your proof." The 4 deployment modes (Cloud, Private Cloud, On-Prem, Air-Gapped) are consistent everywhere.

### ✅ Manifesto
The marketing manifesto ("Modern enterprises have surrendered their minds") matches the platform's identity. The 5 beliefs are powerful and authentic.

### ✅ SEO/Schema
Excellent structured data (FAQ, Organization, SoftwareApplication, WebSite schemas). 11 language hreflang tags. Proper canonical URLs. This is enterprise-grade SEO.

---

## 2. Where Marketing UNDERSELLS the Platform

These are capabilities that exist in the platform but are **missing or underrepresented** on the marketing site.

### 🔴 CendiaDCII™ — Completely Missing from Marketing
The platform's newest and most differentiated framework — Decision Crisis Immunization Infrastructure with 9 decision primitives — is **not mentioned anywhere on the marketing site**. This includes:
- **CendiaIISS™** — Institutional Immune System Score (0-1000)
- **CendiaMediaAuth™** — Synthetic media authentication
- **CendiaJurisdiction™** — Cross-jurisdiction conflict detection
- **CendiaTimestamp™** — RFC 3161 timestamp authority
- **CendiaSimilarity™** — Decision similarity engine
- **CendiaBias™** — Cognitive bias mitigation

**Action Required:** The DCII framework is the v3.0 positioning identity. The marketing site still reflects ~v2.0 messaging. DCII should be the hero section.

### 🔴 9 Decision Primitives — Not on Marketing Site
The current v3.0 strategy revolves around 9 primitives (Discovery-Time Proof, Deliberation Capture, Override Accountability, Continuity Memory, Drift Detection, Cognitive Bias Mitigation, Quantum-Resistant Integrity, Synthetic Media Authentication, Cross-Jurisdiction Compliance). The marketing site doesn't mention any of them.

### 🟡 Sports/Football Vertical — Not on Marketing Site
The platform has a complete sports vertical (UEFA FFP, FIFA Agent Regs, Premier League PSR, 10 agents, 8 workflows, Celtic FC demo data) that isn't referenced on the marketing verticals page.

### 🟡 Agent Count Discrepancy
- Marketing says: **"14 AI Council Agents"** (bottom "What We Actually Build" section)
- Marketing also says: **"40+ Core Governance Agents"** (trust metrics)
- Platform actually has: **40+ agents** across 5 SGAS classes + 10 sports agents

The "14" in the bottom section is stale and contradicts the "40+" trust metric above it.

### 🟡 CendiaCascade™ — Underrepresented
Marketing has a carousel for CendiaCascade but positions it as just "Butterfly Effect Engine." The platform has a fully implemented service with executive exports, explainability, policy constraints, and governance controls. The marketing doesn't convey the procurement-safe depth.

### 🟡 CendiaCommand™ — Missing from Marketing
The platinum-standard command execution engine with 6 vertical completion layers isn't mentioned.

### 🟡 11 Sovereign Architecture Patterns — Listed but Not Linked
Marketing mentions all 11 patterns (Data Diode, Local RLHF, etc.) but doesn't link to any detail page. The platform has full backend services for all 11.

### 🟡 Test Count Outdated
- Marketing says: **204,079 automated tests** (Feb 8, 2026)
- Current count should be verified — likely higher after recent additions

---

## 3. Where Marketing OVERCLAIMS vs Platform

These require careful attention to maintain the honesty brand.

### ⚠️ "Zero-Copy Data Architecture"
Marketing claims: "Your data never leaves your database. We query in place—PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, DB2. No ETL."

**Platform reality:** The backend uses PostgreSQL via Prisma. There are connector configurations for other databases, but full zero-copy querying across all listed databases is not demonstrated in the current codebase. The REST API connectors exist, but "zero-copy" for Oracle/DB2/MongoDB would need verification.

**Risk Level:** Medium. The architecture supports this in principle, but the marketing claim is stronger than what's currently demonstrable.

### ⚠️ "SAP/Oracle deep integration — Live"
The Limitations tab says SAP/Oracle deep integration is "Live" with OData/REST connectors. The platform has generic REST/OData adapter code, but no SAP-specific or Oracle-specific connector with field mapping demonstrated.

**Risk Level:** Low-Medium. OData connectors are generic and do work with SAP S/4HANA, but calling it "deep integration" may set expectations too high.

### ⚠️ "Snowflake / BigQuery / Redshift — Live"
Listed as live connectors. Platform has generic database connector infrastructure but no Snowflake/BigQuery/Redshift specific drivers visible in the codebase.

**Risk Level:** Medium. Generic REST adapters could connect, but "Live" implies production-tested.

### ⚠️ Newsletter Form — No Backend
The newsletter form does a frontend-only "thank you" with no actual submission endpoint. No email service integration.

**Risk Level:** Low (UX issue, not a trust issue). But any real signup is lost.

---

## 4. Design & UX Comparison

| Aspect | Marketing Site | Platform |
|--------|---------------|----------|
| **Stack** | Static HTML/CSS/JS | React + TypeScript SPA |
| **Design System** | Custom CSS, Cormorant Garamond + Inter | Tailwind CSS, system fonts |
| **Color Palette** | Black + Gold (#C9A227) | Black + Gold (#c9a84c) |
| **Animation** | Cinematic landing, particle canvas, typewriter | Framer Motion, subtle transitions |
| **i18n** | 11 languages via translations.js | 26 languages via i18n system |
| **Dark Mode** | Always dark | Dark default with toggle |
| **Mobile** | Responsive | Responsive |
| **Performance** | Very fast (static) | Good (SPA with code splitting) |

### Key Differences:
- **Gold color mismatch:** Marketing uses `#C9A227`, platform uses `#c9a84c`. Should be unified.
- **Font mismatch:** Marketing uses Cormorant Garamond (serif display), platform uses Georgia/system serif. Marketing font is more premium.
- **Marketing has 11 languages, platform has 26.** Platform is ahead but marketing doesn't mention this.

---

## 5. Content Gaps on Marketing Site

### Pages That Should Exist But Don't:
1. **DCII Framework page** — The core v3.0 identity isn't represented
2. **9 Decision Primitives page** — The crisis immunization framework
3. **Sports/Football vertical page** — Complete in platform, missing from marketing
4. **CendiaCommand page** — Flagship enterprise feature
5. **Honesty Matrices deep-dive** — Marketing has summary; platform has full interactive page with data grids

### Pages That Exist But Are Stale:
1. **Pricing** — Still shows Pilot $50K, Department $180K/yr, Enterprise $600K/yr. May need alignment with v3.0 pricing ($50K DCII pilot, $150K-$500K Foundation, $500K-$1.5M Enterprise)
2. **Changelog** — Marketing changelog.html is separate from platform's CHANGELOG.md
3. **Trust metrics** — "14 AI Council Agents" contradicts "40+" on same page

---

## 6. Recommendations — Priority Order

### 🔴 Critical (Do First)
1. **Add DCII framework to marketing homepage** — This is the v3.0 identity. Should replace or augment the current "60-Second Architecture" section.
2. **Add 9 Decision Primitives** — Create a dedicated page or hero section.
3. **Fix agent count inconsistency** — Change "14" to "40+" in the "What We Actually Build" section.
4. **Unify gold color** — Pick one (#C9A227 or #c9a84c) and use it everywhere.

### 🟡 Important (Do Soon)
5. **Add sports vertical to marketing verticals page**
6. **Create DCII pricing tier page** — Align with v3.0 pricing
7. **Add CendiaCommand feature page**
8. **Update test count metric** on marketing homepage
9. **Fix newsletter form** — Add actual submission (Netlify Forms, or custom endpoint)
10. **Add demo videos for DCII dashboard**

### 🟢 Nice to Have
11. **Port Cormorant Garamond font** to the platform for brand consistency
12. **Add platform screenshots** to marketing (current videos may be outdated)
13. **Cross-link marketing → platform demo** (e.g., "Try it live" buttons)
14. **Audit connector claims** — Remove "Live" from connectors not actively tested

---

## 7. What the Marketing Site Gets Right That the Platform Should Learn From

1. **The Honesty Matrices tabs** — The marketing site's tab-based matrix presentation is cleaner than the platform's modal-based approach. Consider adopting the marketing layout.
2. **The "What We Actually Build" section** — Honest, verifiable claims with expandable details. This pattern should be used more in the platform.
3. **The Manifesto** — Present on marketing but not prominently in the platform. Consider adding `/manifesto` route.
4. **Structured data/SEO** — Marketing has excellent schema markup. Platform (SPA) should add pre-rendering or meta tags for better SEO.
5. **"We're a new platform seeking pilot partners"** — This disclaimer is honest and effective. Platform should echo this transparency.

---

## Final Assessment

| Dimension | Score | Notes |
|-----------|-------|-------|
| **Message Consistency** | 8/10 | Core sovereignty message aligned; DCII missing |
| **Feature Accuracy** | 6/10 | Some overclaims on connectors; some underselling of new features |
| **Design Consistency** | 7/10 | Similar aesthetic, minor color/font differences |
| **Completeness** | 5/10 | Marketing is ~v2.0; platform is v3.0 with DCII |
| **Honesty Brand** | 9/10 | Limitations, failure modes, and audit evidence are exemplary |
| **Overall** | **7.5/10** | **Good foundation, needs DCII update to match platform** |

The single most impactful improvement would be updating the marketing site to reflect the DCII framework and 9 Decision Primitives — this is the current platform identity and the marketing site doesn't mention it at all.
