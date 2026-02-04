# Datacendia Data Residency Controls

**Version:** 1.0  
**Effective Date:** January 30, 2026  
**Last Updated:** January 30, 2026  
**Classification:** Public

---

## 1. Executive Summary

Datacendia provides comprehensive data residency controls to meet regulatory requirements across jurisdictions including GDPR (EU), LGPD (Brazil), PDPA (Singapore), PIPL (China), and various sector-specific regulations.

### 1.1 Supported Regions

| Region | Status | Data Center | Compliance |
|--------|--------|-------------|------------|
| **United States (US-East)** | ✅ GA | AWS us-east-1 | SOC2, HIPAA |
| **United States (US-West)** | ✅ GA | AWS us-west-2 | SOC2, HIPAA |
| **European Union (EU)** | ✅ GA | AWS eu-central-1 | GDPR, SOC2 |
| **United Kingdom (UK)** | ✅ GA | AWS eu-west-2 | UK GDPR, SOC2 |
| **Canada** | ✅ GA | AWS ca-central-1 | PIPEDA, SOC2 |
| **Australia** | 🔄 Planned Q2 | AWS ap-southeast-2 | Privacy Act |
| **Singapore** | 🔄 Planned Q3 | AWS ap-southeast-1 | PDPA |
| **Government (GovCloud)** | ✅ GA | AWS GovCloud | FedRAMP High |

---

## 2. Data Classification

### 2.1 Data Categories

| Category | Definition | Residency Control | Examples |
|----------|------------|-------------------|----------|
| **Tier 0 - Public** | Non-sensitive, public data | No restriction | Marketing content, docs |
| **Tier 1 - Internal** | Business operational data | Organization region | Metrics, logs, configs |
| **Tier 2 - Confidential** | Sensitive business data | Strict region lock | Decisions, deliberations |
| **Tier 3 - Restricted** | Highly regulated data | Sovereign control | PII, PHI, financial |

### 2.2 Data Types by Residency Requirement

| Data Type | Default Tier | Cross-Border Allowed | Notes |
|-----------|--------------|---------------------|-------|
| User profiles | Tier 2 | With consent | GDPR Art. 49 |
| Decision packets | Tier 3 | Never | Cryptographically bound |
| Audit logs | Tier 3 | Never | Immutable, region-locked |
| Deliberation content | Tier 2 | With org policy | May contain PII |
| LLM interactions | Tier 2 | Per org config | Embeddings stay local |
| Analytics/metrics | Tier 1 | Aggregated only | Anonymized data OK |
| Backups | Tier 3 | Same region only | Encrypted at rest |

---

## 3. Technical Implementation

### 3.1 Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────┐
│                        Global Load Balancer                          │
│                      (GeoDNS + Anycast)                              │
└─────────────────────────────────────────────────────────────────────┘
                                    │
         ┌──────────────────────────┼──────────────────────────┐
         ▼                          ▼                          ▼
┌─────────────────┐      ┌─────────────────┐      ┌─────────────────┐
│   US Region     │      │   EU Region     │      │   UK Region     │
│   (us-east-1)   │      │ (eu-central-1)  │      │  (eu-west-2)    │
├─────────────────┤      ├─────────────────┤      ├─────────────────┤
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │ ┌─────────────┐ │
│ │   API       │ │      │ │   API       │ │      │ │   API       │ │
│ └─────────────┘ │      │ └─────────────┘ │      │ └─────────────┘ │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │ ┌─────────────┐ │
│ │ PostgreSQL  │ │      │ │ PostgreSQL  │ │      │ │ PostgreSQL  │ │
│ │ (Primary)   │ │      │ │ (Primary)   │ │      │ │ (Primary)   │ │
│ └─────────────┘ │      │ └─────────────┘ │      │ └─────────────┘ │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │ ┌─────────────┐ │
│ │   MinIO     │ │      │ │   MinIO     │ │      │ │   MinIO     │ │
│ └─────────────┘ │      │ └─────────────┘ │      │ └─────────────┘ │
│ ┌─────────────┐ │      │ ┌─────────────┐ │      │ ┌─────────────┐ │
│ │   Ollama    │ │      │ │   Ollama    │ │      │ │   Ollama    │ │
│ └─────────────┘ │      │ └─────────────┘ │      │ └─────────────┘ │
└─────────────────┘      └─────────────────┘      └─────────────────┘
         │                          │                          │
         └──────────────────────────┴──────────────────────────┘
                                    │
                    ┌───────────────────────────────┐
                    │   Control Plane (Metadata)    │
                    │   (Region-aware routing)      │
                    └───────────────────────────────┘
```

### 3.2 Region Enforcement

#### Database Level

```sql
-- Row-level security for data residency
CREATE POLICY data_residency_policy ON decision_packets
  FOR ALL
  USING (
    data_region = current_setting('app.data_region')
    OR current_setting('app.is_global_admin') = 'true'
  );

-- Prevent cross-region queries
ALTER TABLE decision_packets ENABLE ROW LEVEL SECURITY;
```

#### Application Level

```typescript
// middleware/dataResidency.ts
export const enforceDataResidency = (req: Request, res: Response, next: NextFunction) => {
  const orgRegion = req.organization?.dataRegion;
  const requestRegion = getRequestRegion(req);
  
  if (orgRegion && orgRegion !== requestRegion) {
    // Redirect to correct region
    return res.redirect(307, `https://${orgRegion}.api.datacendia.com${req.path}`);
  }
  
  // Set region context for database queries
  req.dataRegion = orgRegion || requestRegion;
  next();
};
```

#### Storage Level

```typescript
// services/storage/RegionalStorage.ts
export class RegionalStorageService {
  private getRegionalBucket(region: DataRegion): string {
    const buckets = {
      'us-east': 'datacendia-us-east-data',
      'us-west': 'datacendia-us-west-data',
      'eu': 'datacendia-eu-data',
      'uk': 'datacendia-uk-data',
      'ca': 'datacendia-ca-data',
    };
    return buckets[region];
  }

  async store(data: Buffer, key: string, region: DataRegion): Promise<void> {
    const bucket = this.getRegionalBucket(region);
    await this.minio.putObject(bucket, key, data);
    
    // Log for compliance
    await this.auditLog.record({
      action: 'DATA_STORED',
      region,
      key,
      timestamp: new Date(),
    });
  }
}
```

### 3.3 Cross-Border Transfer Controls

```typescript
// services/compliance/CrossBorderTransfer.ts
export class CrossBorderTransferService {
  private readonly allowedTransfers: Map<string, string[]> = new Map([
    ['eu', ['uk', 'ca']], // EU can transfer to UK (adequacy), CA (PIPEDA)
    ['uk', ['eu', 'ca']], // UK adequacy decisions
    ['us', ['ca']],       // US-CA safe harbor
  ]);

  async validateTransfer(
    sourceRegion: DataRegion,
    targetRegion: DataRegion,
    dataClassification: DataTier,
    legalBasis?: LegalBasis
  ): Promise<TransferDecision> {
    // Tier 3 data never crosses borders
    if (dataClassification === DataTier.RESTRICTED) {
      return {
        allowed: false,
        reason: 'Restricted data cannot be transferred across regions',
        requiredActions: [],
      };
    }

    // Check adequacy decisions
    const allowedTargets = this.allowedTransfers.get(sourceRegion) || [];
    if (allowedTargets.includes(targetRegion)) {
      return {
        allowed: true,
        reason: 'Adequacy decision exists',
        requiredActions: ['Log transfer', 'Update ROPA'],
      };
    }

    // Check for SCCs or other mechanisms
    if (legalBasis === LegalBasis.STANDARD_CONTRACTUAL_CLAUSES) {
      return {
        allowed: true,
        reason: 'SCCs in place',
        requiredActions: ['Verify SCCs current', 'TIA required', 'Log transfer'],
      };
    }

    return {
      allowed: false,
      reason: 'No legal basis for cross-border transfer',
      requiredActions: ['Obtain consent', 'Implement SCCs', 'Conduct TIA'],
    };
  }
}
```

---

## 4. Organization Configuration

### 4.1 Setting Data Residency

Organizations configure their data residency during onboarding:

```typescript
// Example organization configuration
const organizationConfig = {
  id: 'org_12345',
  name: 'Example Corp',
  dataResidency: {
    primaryRegion: 'eu',           // Primary data storage
    allowedRegions: ['eu', 'uk'],  // Allowed processing regions
    crossBorderPolicy: 'strict',   // 'strict' | 'with-consent' | 'unrestricted'
    retentionPolicy: {
      decisionPackets: 'indefinite',
      auditLogs: '10years',
      userProfiles: '3years',
      analytics: '1year',
    },
    encryption: {
      atRest: 'AES-256-GCM',
      inTransit: 'TLS-1.3',
      keyManagement: 'customer-managed', // 'datacendia' | 'customer-managed' | 'byok'
    },
  },
};
```

### 4.2 Admin UI Controls

Organization admins can manage data residency from the Settings panel:

| Setting | Options | Default |
|---------|---------|---------|
| **Primary Region** | US-East, US-West, EU, UK, CA | Based on signup location |
| **Processing Regions** | Multi-select from available | Primary only |
| **Cross-Border Policy** | Strict, With Consent, Unrestricted | Strict |
| **Backup Region** | Same as primary, DR region | Same as primary |
| **Key Management** | Datacendia, Customer HSM, BYOK | Datacendia |

---

## 5. Compliance Mapping

### 5.1 GDPR (EU)

| Requirement | Implementation |
|-------------|----------------|
| **Art. 44 - Transfer restrictions** | Cross-border controls, adequacy checks |
| **Art. 45 - Adequacy decisions** | Automated routing to adequate regions |
| **Art. 46 - Appropriate safeguards** | SCCs, BCRs support |
| **Art. 49 - Derogations** | Explicit consent workflow |

### 5.2 Other Regulations

| Regulation | Region | Key Controls |
|------------|--------|--------------|
| **LGPD** | Brazil | Local processing, DPO assignment |
| **PDPA** | Singapore | Consent management, notification |
| **PIPL** | China | Local storage, CAC approval |
| **PIPEDA** | Canada | Accountability, consent |
| **Privacy Act** | Australia | APP compliance, breach notification |
| **UK GDPR** | UK | Post-Brexit adequacy, ICO registration |

---

## 6. Audit & Reporting

### 6.1 Data Location Reports

Organizations can generate reports showing:

1. **Current Data Distribution** - Where data is stored by type
2. **Cross-Border Transfers** - Log of all transfers with legal basis
3. **Access Logs** - Who accessed data from which region
4. **Retention Compliance** - Data approaching retention limits

### 6.2 Sample Report

```json
{
  "reportType": "DATA_RESIDENCY_SUMMARY",
  "organizationId": "org_12345",
  "generatedAt": "2026-01-30T09:00:00Z",
  "period": "2026-01",
  "summary": {
    "primaryRegion": "eu",
    "dataVolume": {
      "decisionPackets": { "count": 1234, "sizeGB": 2.5 },
      "auditLogs": { "count": 456789, "sizeGB": 1.2 },
      "userProfiles": { "count": 150, "sizeGB": 0.01 }
    },
    "crossBorderTransfers": {
      "total": 0,
      "byDestination": {}
    },
    "accessByRegion": {
      "eu": 4567,
      "uk": 23,
      "us": 0
    }
  },
  "compliance": {
    "gdpr": "COMPLIANT",
    "sccsRequired": false,
    "tiaRequired": false
  }
}
```

---

## 7. Sovereign Deployment

### 7.1 Air-Gapped Deployment

For maximum data sovereignty, Datacendia supports fully air-gapped deployment:

```yaml
# sovereign-deployment.yaml
deployment:
  mode: air-gapped
  region: customer-premises
  
  components:
    - name: datacendia-api
      replicas: 3
      resources:
        cpu: 4
        memory: 8Gi
    
    - name: postgresql
      mode: ha-cluster
      storage: local-nvme
    
    - name: ollama
      models:
        - qwen2.5:14b
        - nomic-embed-text
      storage: local-gpu
    
    - name: minio
      mode: distributed
      storage: local-nvme

  networking:
    ingress: internal-only
    egress: blocked
    
  security:
    tpm: required
    encryption: customer-keys
    audit: immutable-local
```

### 7.2 Data Diode Integration

For high-security environments, data can flow through a hardware data diode:

```
[External Sources] → [Data Diode] → [Datacendia Air-Gap] → [Secure Display]
                         ▲
                    (One-way only)
```

---

## 8. Customer Responsibilities

| Responsibility | Description |
|----------------|-------------|
| **Region Selection** | Choose appropriate region for compliance needs |
| **User Location** | Ensure users access from approved regions |
| **Data Classification** | Properly classify data sensitivity |
| **Consent Management** | Obtain consent for cross-border transfers |
| **Key Management** | Manage encryption keys if using BYOK |
| **Audit Review** | Regularly review data residency reports |

---

## 9. Roadmap

| Feature | Status | Target |
|---------|--------|--------|
| Australia region | 🔄 In Progress | Q2 2026 |
| Singapore region | 📋 Planned | Q3 2026 |
| Brazil region (LGPD) | 📋 Planned | Q4 2026 |
| China region (PIPL) | 🔍 Evaluating | 2027 |
| India region | 📋 Planned | Q4 2026 |
| BYOK for all regions | 🔄 In Progress | Q2 2026 |
| Automated TIA tool | 📋 Planned | Q3 2026 |

---

## 10. Contact

| Topic | Contact |
|-------|---------|
| **Data Residency Questions** | privacy@datacendia.com |
| **DPO (EU)** | dpo@datacendia.com |
| **Compliance** | compliance@datacendia.com |
| **Sovereign Deployment** | enterprise@datacendia.com |

---

*Document Owner: Privacy & Compliance Team*  
*Review Cycle: Quarterly*  
*Next Review: April 30, 2026*
