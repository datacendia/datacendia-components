# Datacendia Service Level Agreement (SLA)

**Version:** 1.0  
**Effective Date:** January 30, 2026  
**Last Updated:** January 30, 2026

---

## 1. Service Availability

### 1.1 Uptime Commitment

| Tier | Monthly Uptime | Max Downtime/Month | Credits |
|------|----------------|-------------------|---------|
| **Standard** | 99.5% | 3.6 hours | 10% |
| **Professional** | 99.9% | 43.8 minutes | 15% |
| **Enterprise** | 99.95% | 21.9 minutes | 25% |
| **Government** | 99.99% | 4.4 minutes | 30% |

### 1.2 Excluded Downtime

The following are NOT counted against uptime:
- Scheduled maintenance (with 72-hour notice)
- Force majeure events
- Customer-caused issues
- Third-party service outages (Ollama, Redis, PostgreSQL)
- Beta/preview features

---

## 2. Performance SLAs

### 2.1 API Response Times

| Endpoint Category | P50 | P95 | P99 |
|-------------------|-----|-----|-----|
| **Health/Status** | 50ms | 100ms | 200ms |
| **Read Operations** | 100ms | 300ms | 500ms |
| **Write Operations** | 200ms | 500ms | 1000ms |
| **Council Deliberation** | 2s | 5s | 10s |
| **LLM Streaming (first token)** | 500ms | 1500ms | 3000ms |

### 2.2 Throughput Guarantees

| Tier | Requests/Minute | Concurrent Deliberations |
|------|-----------------|-------------------------|
| **Standard** | 100 | 5 |
| **Professional** | 500 | 25 |
| **Enterprise** | 2000 | 100 |
| **Government** | Custom | Custom |

---

## 3. Support SLAs

### 3.1 Response Times

| Severity | Definition | First Response | Resolution Target |
|----------|------------|----------------|-------------------|
| **P1 - Critical** | Production down, no workaround | 15 minutes | 4 hours |
| **P2 - High** | Major feature impaired | 1 hour | 8 hours |
| **P3 - Medium** | Feature degraded, workaround exists | 4 hours | 24 hours |
| **P4 - Low** | Minor issue, cosmetic | 24 hours | 72 hours |

### 3.2 Support Channels

| Tier | Email | Chat | Phone | Dedicated CSM |
|------|-------|------|-------|---------------|
| **Standard** | ✅ | ❌ | ❌ | ❌ |
| **Professional** | ✅ | ✅ | ❌ | ❌ |
| **Enterprise** | ✅ | ✅ | ✅ | ✅ |
| **Government** | ✅ | ✅ | ✅ | ✅ |

### 3.3 Support Hours

- **Standard/Professional:** Monday-Friday, 9am-6pm EST
- **Enterprise:** Monday-Friday, 24 hours
- **Government:** 24/7/365

---

## 4. Data SLAs

### 4.1 Data Durability

- **Database (PostgreSQL):** 99.999999999% (11 nines)
- **Object Storage (MinIO):** 99.99999999% (10 nines)
- **Audit Logs:** Immutable, 10-year retention

### 4.2 Backup Schedule

| Data Type | Frequency | Retention | RTO | RPO |
|-----------|-----------|-----------|-----|-----|
| **Database** | Hourly | 30 days | 4 hours | 1 hour |
| **Audit Logs** | Real-time | 10 years | 1 hour | 0 |
| **Decision Packets** | Real-time | Indefinite | 1 hour | 0 |
| **Embeddings** | Daily | 7 days | 24 hours | 24 hours |

### 4.3 Data Integrity

- All decision packets cryptographically signed
- Merkle tree verification for audit trails
- Hash validation on all stored artifacts

---

## 5. Security SLAs

### 5.1 Incident Response

| Severity | Detection | Containment | Notification |
|----------|-----------|-------------|--------------|
| **Critical Breach** | < 1 hour | < 4 hours | < 24 hours |
| **Major Incident** | < 4 hours | < 8 hours | < 48 hours |
| **Minor Incident** | < 24 hours | < 48 hours | < 72 hours |

### 5.2 Vulnerability Management

| Severity | Patch Timeline |
|----------|---------------|
| **Critical (CVSS 9.0+)** | 24 hours |
| **High (CVSS 7.0-8.9)** | 7 days |
| **Medium (CVSS 4.0-6.9)** | 30 days |
| **Low (CVSS 0.1-3.9)** | 90 days |

---

## 6. Service Credits

### 6.1 Credit Calculation

If monthly uptime falls below committed SLA:

```
Credit % = (SLA Target - Actual Uptime) / (100 - SLA Target) * Max Credit
```

### 6.2 Credit Limits

- Maximum credit: 30% of monthly fee
- Credits applied to next billing cycle
- Credits do not roll over
- Credits are sole remedy for SLA breach

### 6.3 Claiming Credits

1. Submit request within 30 days of incident
2. Provide incident timestamps and evidence
3. Credits processed within 2 billing cycles

---

## 7. Exclusions

This SLA does not apply to:

1. **Free/Trial accounts**
2. **Beta/Preview features** (marked as such in UI)
3. **Self-hosted deployments** (covered by separate support agreement)
4. **Third-party integrations** not managed by Datacendia
5. **Customer misuse** or violation of terms

---

## 8. SLA Monitoring

### 8.1 Status Page

Real-time status available at: `https://status.datacendia.com`

### 8.2 Monthly Reports

Enterprise and Government customers receive:
- Uptime percentage
- Incident summary
- Performance metrics
- Credit calculations (if applicable)

---

## 9. SLA Review

This SLA is reviewed quarterly and may be updated with 30 days notice. Changes will not reduce service levels during an active contract term.

---

## Contact

- **Support:** support@datacendia.com
- **Security:** security@datacendia.com
- **SLA Claims:** sla@datacendia.com

---

*Document Owner: Operations Team*  
*Review Cycle: Quarterly*
