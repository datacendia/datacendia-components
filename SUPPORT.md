# Support

## Pilot & Paid Tier Support

- **Email:** support@datacendia.com
- **Response SLA:**
  - Pilot: 24 hours (business days)
  - Foundation: 8 hours (business days)
  - Enterprise: 4 hours (24/7 for P1)
  - Strategic: 1 hour (24/7)
- **Emergency (P1 — platform down):** Include `[P1]` in subject line

## Community Support

- GitHub Issues: https://github.com/datacendia/datacendia-core/issues
- Community Edition questions, bug reports, and feature requests

## Security Vulnerabilities

Do NOT report security vulnerabilities as public GitHub issues.  
See [SECURITY.md](SECURITY.md) for responsible disclosure process.

## Before Opening a Support Ticket

1. Check the [Quick Reference](docs/QUICK_REFERENCE.md)
2. Check the [Changelog](CHANGELOG.md) for known issues
3. Run `GET /api/v1/health/sovereign` to verify service health
4. Collect logs: `docker compose logs --tail=100 api`
