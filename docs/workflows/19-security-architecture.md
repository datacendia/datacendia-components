# Datacendia Platform — Security Architecture

> **Purpose:** Complete security posture — authentication, authorization, encryption, trust boundaries, runtime protection, and AI guardrails.

## Security Layer Overview

```mermaid
flowchart TB
    subgraph "Edge / Perimeter"
        TLS["TLS 1.3<br/>All external traffic"]
        CORS["CORS Policy<br/>Whitelisted origins"]
        RL["Rate Limiting<br/>Per-user / per-IP"]
    end

    subgraph "Identity & Authentication"
        KC["Keycloak SSO<br/>OIDC / SAML 2.0"]
        JWT["JWT Tokens<br/>Access + Refresh"]
        RBAC["7 Roles:<br/>admin, analyst, operator,<br/>auditor, council-member,<br/>veto-authority, viewer"]
        MFA["Multi-Factor Auth<br/>(Keycloak-managed)"]
    end

    subgraph "Authorization (Casbin)"
        PE["PolicyEngine<br/>RBAC + ABAC"]
        DP["Decision Approval Policies"]
        VP["Veto Permissions"]
        PP["Privilege-Based Access<br/>(attorney-client, work-product)"]
    end

    subgraph "AI Safety Layer"
        SE["CendiaSentry™<br/>8 Guardrails"]
        PII["PII Detection + Redaction"]
        TOX["Toxicity Filter"]
        BIAS["Bias Detector"]
        HALL["Hallucination Check"]
        FIN["Financial Accuracy"]
        SCOPE["Scope Limiter"]
    end

    subgraph "Data Protection"
        ENC["Encryption at Rest<br/>(PostgreSQL, MinIO)"]
        KMS["KMS/HSM Integration<br/>AWS KMS, Vault, Azure KV, Local"]
        HASH["SHA-256 Hash Chains<br/>(Audit, Dissent, Evidence)"]
        SIG["HMAC Signatures<br/>(Audit events)"]
        TPM["TPM Attestation<br/>(Hardware signing)"]
    end

    subgraph "Runtime Security"
        FA["Falco<br/>Container runtime monitoring"]
        RT["RuntimeSecurityService<br/>Intrusion / anomaly detection"]
        CAN["CanaryTripwireService<br/>Honeypot exfiltration detection"]
        SBOM["SBOMService<br/>Supply chain (Syft, Grype, Cosign)"]
    end

    subgraph "Compliance & Audit"
        AU["CendiaAudit™<br/>Tamper-proof logging"]
        PA["CendiaPanopticon™<br/>200+ regulatory frameworks"]
        GV["CendiaGovern™<br/>ABA/SRA/GDPR/EU AI Act enforcement"]
        VT["CendiaVeto™<br/>Approval gates"]
    end

    subgraph "Network Security"
        MTLS["mTLS (step-ca PKI)"]
        DD["DataDiode<br/>Unidirectional ingest"]
        QR["QR Air-Gap Bridge<br/>Zero-media transfer"]
        FM["FederatedMesh<br/>Differential privacy"]
    end

    TLS --> KC --> JWT --> PE
    PE --> SE --> PII & TOX & BIAS & HALL & FIN & SCOPE
    SE --> AU
    KMS --> HASH & SIG & TPM
    FA --> RT
    MTLS --> DD

    style KC fill:#ef4444,color:#fff
    style SE fill:#f59e0b,color:#fff
    style KMS fill:#8b5cf6,color:#fff
    style FA fill:#3b82f6,color:#fff
    style AU fill:#10b981,color:#fff
```

## Authentication Flow

```mermaid
sequenceDiagram
    participant User
    participant Frontend as React Frontend
    participant Backend as Express Backend
    participant Keycloak as Keycloak SSO
    participant Casbin as PolicyEngine

    User->>Frontend: Login
    Frontend->>Keycloak: OIDC Authorization Request
    Keycloak->>User: Login Page (+ MFA if configured)
    User->>Keycloak: Credentials + MFA
    Keycloak-->>Frontend: Authorization Code
    Frontend->>Backend: Exchange Code for Tokens
    Backend->>Keycloak: Token Exchange (PKCE)
    Keycloak-->>Backend: {access_token, refresh_token, id_token}
    Backend-->>Frontend: JWT + User Profile

    Note over Frontend,Backend: Subsequent API Calls
    Frontend->>Backend: GET /api/v1/... (Authorization: Bearer JWT)
    Backend->>Backend: Verify JWT signature + expiry
    Backend->>Casbin: checkPermission(user, resource, action)
    Casbin-->>Backend: Allow / Deny
    
    alt Permission Granted
        Backend-->>Frontend: 200 OK + Data
    else Permission Denied
        Backend-->>Frontend: 403 Forbidden
    end

    Note over Frontend,Backend: Token Refresh
    Frontend->>Backend: POST /auth/refresh (refreshToken)
    Backend->>Keycloak: Refresh Token Exchange
    Keycloak-->>Backend: New access_token
    Backend-->>Frontend: New JWT
```

## Trust Boundaries

```mermaid
flowchart TB
    subgraph "Untrusted Zone (Internet)"
        EXT["External Users<br/>Client Browsers"]
    end

    subgraph "DMZ (TLS Termination)"
        LB["Load Balancer / Reverse Proxy<br/>TLS 1.3, CORS, Rate Limiting"]
    end

    subgraph "Application Zone"
        FE["React Frontend<br/>(Static, no secrets)"]
        BE["Express Backend<br/>(JWT validation, Casbin checks)"]
        WS["WebSocket Server<br/>(Authenticated connections only)"]
    end

    subgraph "AI Zone (Isolated)"
        OL["Ollama LLM<br/>(Local inference only, no internet)"]
        SE2["Sentry Guardrails<br/>(AI output filtering)"]
    end

    subgraph "Data Zone (Encrypted)"
        PG["PostgreSQL<br/>(Encrypted at rest)"]
        RE["Redis<br/>(Password-protected)"]
        MN["MinIO<br/>(Server-side encryption)"]
        CH["ClickHouse<br/>(Authenticated)"]
    end

    subgraph "Security Zone"
        KC2["Keycloak<br/>(Identity boundary)"]
        KMS2["KMS/HSM<br/>(Key material never leaves)"]
        FA2["Falco<br/>(Runtime monitoring)"]
        SCA["step-ca PKI<br/>(Internal certificates)"]
    end

    subgraph "Sovereign Zone (Air-Gapped)"
        DD2["DataDiode<br/>(Unidirectional only)"]
        QR2["QR Air-Gap Bridge<br/>(No network required)"]
        TPM2["TPM Hardware<br/>(Physical security)"]
    end

    EXT -->|"HTTPS"| LB
    LB -->|"Proxy"| FE & BE & WS
    BE -->|"HTTP (internal)"| OL
    OL --> SE2
    BE -->|"TLS/Password"| PG & RE & MN & CH
    BE -->|"OIDC"| KC2
    BE -->|"Sign/Verify"| KMS2
    FA2 -.->|"Monitors"| BE
    DD2 -->|"One-way"| BE
    SCA -->|"mTLS certs"| BE

    style EXT fill:#ef4444,color:#fff
    style OL fill:#10b981,color:#fff
    style DD2 fill:#6366f1,color:#fff
    style KMS2 fill:#8b5cf6,color:#fff
```

## KMS/HSM Integration

```mermaid
flowchart TD
    A["Sign / Verify / Encrypt / Decrypt"] --> B{KMS_PROVIDER?}
    
    B -->|aws-kms| C["AWS KMS<br/>AWS_KMS_KEY_ID"]
    B -->|hashicorp-vault| D["HashiCorp Vault<br/>VAULT_ADDR + VAULT_TOKEN"]
    B -->|azure-keyvault| E["Azure Key Vault<br/>AZURE_KV_URL"]
    B -->|local| F["Local File Keys<br/>(Development only)"]

    C & D & E & F --> G["Unified KeyManagementService API"]
    G --> H["sign(data, keyId)"]
    G --> I["verify(data, signature, keyId)"]
    G --> J["encrypt(data, keyId)"]
    G --> K["decrypt(ciphertext, keyId)"]
    G --> L["createKey(algorithm, purpose)"]
    G --> M["rotateKey(keyId)"]

    subgraph "Key Purposes"
        K1["Decision packet signing"]
        K2["Audit event signatures"]
        K3["Evidence vault encryption"]
        K4["Timestamp authority signing"]
        K5["Media provenance signing"]
    end

    style G fill:#8b5cf6,color:#fff
```

## Red Team & Supply Chain Security

```mermaid
flowchart TD
    subgraph "EnterpriseRedTeamService"
        A["OWASP Top 10 Tests (22 tests)"]
        B["AI Adversarial Tests (8 tests)"]
        C["Chaos Engineering Tests (5 tests)"]
    end

    subgraph "SBOMService"
        D["Syft — Dependency scanning"]
        E["Grype — Vulnerability matching"]
        F["Cosign — Container signing"]
        G["SPDX + CycloneDX output"]
    end

    subgraph "RuntimeSecurityService"
        H["Real-time intrusion detection"]
        I["Anomaly scoring"]
        J["Automated containment"]
    end

    subgraph "Compliance Mapping"
        K["NIST 800-53"]
        L["FedRAMP High"]
        M["SOC2 Type II"]
        N["ISO 27001"]
        O["HIPAA"]
        P["PCI-DSS"]
        Q["CMMC Level 3"]
    end

    A & B & C --> R["Security Assessment Report"]
    D & E & F & G --> R
    H & I & J --> R
    R --> K & L & M & N & O & P & Q

    style R fill:#6366f1,color:#fff
```

## Canary Tripwire System

```mermaid
flowchart TD
    A["Deploy Canary Records"] --> B["Insert Honeypot Data"]
    B --> C["Fake customer records"]
    B --> D["Synthetic financial data"]
    B --> E["Decoy API keys"]
    B --> F["Bait document files"]

    G["Monitor Access Patterns"] --> H{Canary Accessed?}
    H -->|Yes| I["EXFILTRATION ALERT"]
    I --> J["Identify accessor (IP, user, timestamp)"]
    J --> K["Lock down affected systems"]
    K --> L["Notify security team"]
    L --> M["Preserve forensic evidence"]
    H -->|No| N["Normal operations"]

    style I fill:#ef4444,color:#fff
    style K fill:#f59e0b,color:#fff
```

## Key Code References

| Component | File | Purpose |
|-----------|------|---------|
| **Keycloak Auth** | `backend/src/security/KeycloakAuth.ts` | OIDC SSO, 7 roles, token validation |
| **Policy Engine** | `backend/src/security/PolicyEngine.ts` | Casbin RBAC/ABAC, decision + veto policies |
| **KMS** | `backend/src/services/security/KeyManagementService.ts` | AWS KMS, Vault, Azure KV, local keys |
| **Sentry** | `backend/src/services/CendiaSentryService.ts` | 8 guardrails, PII redaction, bias/hallucination |
| **Audit** | `backend/src/services/CendiaAuditService.ts` | Hash-chained logging, HMAC signatures |
| **Red Team** | `backend/src/services/crucible/EnterpriseRedTeamService.ts` | OWASP, AI adversarial, chaos |
| **SBOM** | `backend/src/services/crucible/SBOMService.ts` | Syft, Grype, Cosign |
| **Runtime** | `backend/src/services/crucible/RuntimeSecurityService.ts` | Intrusion/anomaly detection |
| **Canary** | `backend/src/services/sovereign/CanaryTripwireService.ts` | Honeypot exfiltration detection |
| **TPM** | `backend/src/services/sovereign/TPMAttestationService.ts` | Hardware-signed decisions |
| **TimeLock** | `backend/src/services/sovereign/TimeLockService.ts` | RSA time-lock puzzles for embargoes |
| **DataDiode** | `backend/src/services/sovereign/DataDiodeService.ts` | Unidirectional sovereign ingest |
| **PKI** | `infrastructure/config/` | step-ca for internal mTLS certificates |
| **Falco** | `infrastructure/config/falco/falco.yaml` | Container runtime security |
| **Tracing** | `backend/src/telemetry/tracing.ts` | OpenTelemetry → Grafana Tempo |
