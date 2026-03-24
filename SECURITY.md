# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 0.1.x   | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at Datacendia. If you discover a security vulnerability, please follow these guidelines:

### Do NOT

- Open a public GitHub issue for security vulnerabilities
- Disclose the vulnerability publicly before it's fixed
- Exploit the vulnerability beyond what's necessary to demonstrate it

### Do

1. **Email us at:** security@datacendia.com
2. **Include:**
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Any suggested fixes (optional)

### What to Expect

- **Acknowledgment:** Within 24-48 hours
- **Initial Assessment:** Within 5 business days
- **Status Updates:** Every 7 days until resolved
- **Resolution:** Depends on severity and complexity

### Severity Levels

| Severity | Response Time | Examples |
|----------|---------------|----------|
| Critical | 24 hours | RCE, auth bypass, data breach |
| High | 48 hours | Privilege escalation, XSS |
| Medium | 7 days | CSRF, information disclosure |
| Low | 30 days | Minor issues, hardening |

## Security Measures

### Application Security

- **Authentication:** JWT with secure token handling
- **Authorization:** Role-based access control (RBAC)
- **Encryption:** TLS 1.3 for transit, AES-256 for rest
- **Input Validation:** Zod schemas, SQL injection prevention
- **Output Encoding:** XSS prevention

### Infrastructure Security

- **Secrets Management:** Environment variables, never committed
- **Network:** Private VPC, security groups, WAF
- **Monitoring:** Real-time alerting, audit logs
- **Compliance:** SOC 2, FedRAMP, ISO 27001 ready

### Development Security

- **Dependencies:** Automated scanning with Dependabot
- **Code Review:** Required for all changes
- **CI/CD:** Security checks in pipeline
- **Secret Scanning:** GitHub secret scanning enabled

## Security Checklist

For contributors:

- [ ] No secrets in code or commits
- [ ] Input validation on all endpoints
- [ ] Output encoding for user data
- [ ] Parameterized queries (Prisma)
- [ ] Proper error handling (no stack traces to users)
- [ ] Rate limiting on sensitive endpoints
- [ ] Logging without sensitive data
- [ ] Tests for security-critical code

## Additional Security Resources

- **Vulnerability Disclosure Policy:** [`docs/legal/VULNERABILITY_DISCLOSURE.md`](docs/legal/VULNERABILITY_DISCLOSURE.md) — Full responsible disclosure guidelines, safe harbor, severity classification
- **Security.txt:** `/.well-known/security.txt` endpoint (RFC 9116) — Machine-readable security contact info
- **SOC 2 Readiness:** [`docs/legal/SOC2_READINESS_CHECKLIST.md`](docs/legal/SOC2_READINESS_CHECKLIST.md) — Trust Services Criteria mapping
- **Incident Response Plan:** [`docs/legal/INCIDENT_RESPONSE_PLAN.md`](docs/legal/INCIDENT_RESPONSE_PLAN.md) — Detection, containment, recovery procedures

## Contact

- **Security Issues:** security@datacendia.com
- **General Questions:** hello@datacendia.com

---

Thank you for helping keep Datacendia secure! 🔐
