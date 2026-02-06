# Datacendia Security Whitepaper

**Version 1.0** | **January 2026**

---

## Executive Summary

Datacendia is an enterprise AI decision intelligence platform designed with security as a foundational principle. This whitepaper describes our security architecture, data protection measures, and operational controls.

**Key Security Highlights:**
- **Data Sovereignty**: All data processing can occur entirely on customer infrastructure
- **Zero External Calls**: Sovereign deployment makes no external API calls
- **Cryptographic Integrity**: SHA-256 hash chains for tamper-evident audit trails
- **Customer-Owned Keys**: KMS/HSM integration with customer-controlled encryption keys
- **Air-Gap Ready**: Full functionality without internet connectivity

---

## Table of Contents

1. [Security Architecture](#security-architecture)
2. [Data Protection](#data-protection)
3. [Access Controls](#access-controls)
4. [Encryption](#encryption)
5. [Audit & Logging](#audit--logging)
6. [Infrastructure Security](#infrastructure-security)
7. [AI Model Security](#ai-model-security)
8. [Incident Response](#incident-response)
9. [Compliance Alignment](#compliance-alignment)
10. [Contact](#contact)

---

## 1. Security Architecture

### Defense in Depth

Datacendia implements multiple layers of security controls:

```
┌─────────────────────────────────────────────────────────────┐
│                    PERIMETER LAYER                          │
│  WAF │ DDoS Protection │ Rate Limiting │ IP Allowlisting   │
├─────────────────────────────────────────────────────────────┤
│                    NETWORK LAYER                            │
│  VPC Isolation │ Network Segmentation │ TLS 1.3 Everywhere │
├─────────────────────────────────────────────────────────────┤
│                   APPLICATION LAYER                         │
│  Authentication │ Authorization │ Input Validation │ CSRF  │
├─────────────────────────────────────────────────────────────┤
│                      DATA LAYER                             │
│  Encryption at Rest │ Encryption in Transit │ Key Rotation │
├─────────────────────────────────────────────────────────────┤
│                   MONITORING LAYER                          │
│  Audit Logs │ Anomaly Detection │ SIEM Integration         │
└─────────────────────────────────────────────────────────────┘
```

### Deployment Models

| Model | Description | Security Profile |
|-------|-------------|------------------|
| **Sovereign (Air-Gapped)** | 100% on-premise, no external connectivity | Maximum security, SCIF-compatible |
| **Private Cloud** | Customer's cloud account (AWS/Azure/GCP) | Customer-controlled infrastructure |
| **Hybrid** | Core on-premise, optional cloud AI | Balanced security and capability |
| **Cloud** | Datacendia-managed infrastructure | SOC 2-aligned controls |

---

## 2. Data Protection

### Data Classification

| Classification | Examples | Handling |
|----------------|----------|----------|
| **Restricted** | Decision packets, deliberation content | Encrypted, access-logged, retention-controlled |
| **Confidential** | User data, organization config | Encrypted, role-based access |
| **Internal** | System logs, metrics | Encrypted at rest |
| **Public** | Documentation, marketing | No special handling |

### Data Residency

- **Sovereign deployments**: Data never leaves customer premises
- **Cloud deployments**: Customer selects region (US, EU, APAC available)
- **No data sharing**: Customer data is never used for model training
- **No telemetry**: Sovereign deployments send zero data externally

### Data Retention

- Configurable retention policies per data type
- Automated purging with cryptographic verification
- Right to deletion (GDPR Article 17) supported
- Audit trail of all deletions

---

## 3. Access Controls

### Authentication

| Method | Description | Availability |
|--------|-------------|--------------|
| **Username/Password** | Bcrypt-hashed, complexity enforced | All tiers |
| **Multi-Factor (MFA)** | TOTP, WebAuthn/FIDO2 | All tiers |
| **SSO/SAML** | Okta, Azure AD, Google Workspace | Enterprise |
| **CAC/PIV** | Smart card authentication | Defense tier |
| **Certificate-Based** | mTLS client certificates | Sovereign |

### Authorization (RBAC)

Seven predefined roles with granular permissions:

| Role | Permissions |
|------|-------------|
| **Viewer** | Read decisions, view dashboards |
| **Decision Owner** | Create/edit own decisions |
| **Council Operator** | Run deliberations, manage agents |
| **Approver** | Approve/reject decisions |
| **Risk & Compliance** | Access compliance dashboards, export audit data |
| **Auditor** | Read-only access to all audit trails |
| **Admin** | Full system administration |

### Session Management

- JWT tokens with configurable expiration (default: 15 minutes)
- Refresh tokens with secure rotation
- Session invalidation on password change
- Concurrent session limits (configurable)

---

## 4. Encryption

### Encryption at Rest

| Component | Algorithm | Key Management |
|-----------|-----------|----------------|
| Database (PostgreSQL) | AES-256 | Customer KMS or local |
| Object Storage (MinIO) | AES-256-GCM | Customer KMS or local |
| Backups | AES-256 | Separate backup keys |
| Local files | AES-256 | Application-managed |

### Encryption in Transit

- **TLS 1.3** required for all connections
- **Certificate pinning** available for mobile/desktop clients
- **mTLS** supported for service-to-service communication
- **Perfect Forward Secrecy** enabled

### Key Management

Datacendia integrates with customer key management systems:

| Provider | Integration |
|----------|-------------|
| **AWS KMS** | Native SDK integration |
| **HashiCorp Vault** | Transit secrets engine |
| **Azure Key Vault** | Managed HSM support |
| **Local HSM** | PKCS#11 interface |
| **Air-Gapped** | File-based keys with manual rotation |

**Key Rotation**: Automated rotation supported with zero-downtime re-encryption.

---

## 5. Audit & Logging

### Immutable Audit Trail

Every significant action is recorded in a cryptographically-linked audit chain:

```json
{
  "id": "audit-2026-01-05-001",
  "timestamp": "2026-01-05T14:30:00Z",
  "action": "DECISION_APPROVED",
  "actor": "user:jane.doe@company.com",
  "resource": "decision:acq-quantum-analytics",
  "details": { "outcome": "approved_with_conditions" },
  "hash": "sha256:a3f2c1d4e5b6...",
  "previousHash": "sha256:9c8b7a6f5e4d...",
  "signature": "RSA-SHA256:..."
}
```

### What We Log

| Category | Events |
|----------|--------|
| **Authentication** | Login, logout, MFA, failed attempts |
| **Authorization** | Permission grants, denials, role changes |
| **Data Access** | Read, create, update, delete operations |
| **Deliberations** | Council sessions, agent responses, votes |
| **Administrative** | Config changes, user management, key rotation |
| **Security** | Anomalies, blocked requests, policy violations |

### Log Retention

- **Security logs**: 7 years (configurable)
- **Audit trail**: Indefinite (immutable)
- **Application logs**: 90 days (configurable)
- **Export**: SIEM-compatible formats (JSON, CEF, Syslog)

---

## 6. Infrastructure Security

### Network Security

- **VPC Isolation**: Each customer deployment in isolated network
- **Security Groups**: Least-privilege firewall rules
- **Private Subnets**: Database and internal services not internet-accessible
- **Bastion Hosts**: Jump servers for administrative access (audited)

### Container Security

- **Minimal Base Images**: Distroless or Alpine-based
- **No Root**: Containers run as non-root users
- **Read-Only Filesystems**: Where possible
- **Image Scanning**: Trivy/Snyk integration for vulnerability detection
- **Signed Images**: Container image signatures verified at runtime

### Secrets Management

- No secrets in code or environment variables
- HashiCorp Vault or cloud-native secrets managers
- Automatic secret rotation
- Secrets never logged

---

## 7. AI Model Security

### Local Model Execution

Datacendia's Sovereign Stack runs AI models entirely on customer infrastructure:

- **Ollama Integration**: Local LLM inference
- **No External APIs**: Zero calls to OpenAI, Anthropic, etc. in Sovereign mode
- **Model Provenance**: Verified model checksums
- **Isolated Inference**: Models run in sandboxed containers

### Prompt Security

- **Input Sanitization**: Injection attack prevention
- **Output Filtering**: PII detection and redaction
- **Rate Limiting**: Per-user and per-organization limits
- **Prompt Logging**: Full audit trail of AI interactions

### Anti-Hallucination

- **Citation Verification**: AI responses cite source documents
- **Confidence Scoring**: Low-confidence responses flagged
- **Human Review**: Critical decisions require human approval

---

## 8. Incident Response

### Response Process

1. **Detection**: Automated monitoring, user reports, security scans
2. **Triage**: Severity classification (Critical/High/Medium/Low)
3. **Containment**: Isolate affected systems
4. **Eradication**: Remove threat, patch vulnerabilities
5. **Recovery**: Restore services, verify integrity
6. **Post-Incident**: Root cause analysis, process improvements

### Notification

| Severity | Customer Notification | Timeline |
|----------|----------------------|----------|
| **Critical** | Immediate phone + email | < 1 hour |
| **High** | Email to security contact | < 4 hours |
| **Medium** | Email notification | < 24 hours |
| **Low** | Monthly security report | Monthly |

### Contact

Security issues: **security@datacendia.com**

See our [Vulnerability Disclosure Policy](./VULNERABILITY_DISCLOSURE_POLICY.md) for responsible disclosure guidelines.

---

## 9. Compliance Alignment

Datacendia's architecture is designed to support compliance with major frameworks. **Note**: Formal certifications are available upon enterprise contract.

### Framework Alignment

| Framework | Status | Notes |
|-----------|--------|-------|
| **SOC 2 Type II** | Architecture aligned | Controls implemented; formal audit available on contract |
| **ISO 27001** | Architecture aligned | ISMS documentation available |
| **HIPAA** | Architecture aligned | BAA available; technical safeguards implemented |
| **GDPR** | Compliant | DPA available; data residency controls |
| **FedRAMP** | Architecture supports | Available for government contracts |
| **PCI DSS** | Not applicable | No payment card data processed |

### Control Mapping

We maintain internal control mappings to:
- SOC 2 Trust Service Criteria
- CIS Controls v8
- NIST Cybersecurity Framework
- ISO 27001 Annex A

These mappings are available to customers under NDA.

---

## 10. Contact

**Security Team**: security@datacendia.com

**Vulnerability Reports**: See [Vulnerability Disclosure Policy](./VULNERABILITY_DISCLOSURE_POLICY.md)

**Compliance Inquiries**: compliance@datacendia.com

**General**: info@datacendia.com

---

## Document History

| Version | Date | Changes |
|---------|------|---------|
| 1.0 | January 2026 | Initial release |

---

*© 2026 Datacendia, Inc. All rights reserved.*

*This document is provided for informational purposes. Security controls may vary by deployment model and contract terms.*
