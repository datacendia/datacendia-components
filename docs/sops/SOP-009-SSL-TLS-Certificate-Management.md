# SOP-009: SSL/TLS Certificate Management

**Category:** Security
**Priority:** High
**Owner:** DevOps / Security Lead
**Last Verified:** 2026-02-22 (against `DEPLOYMENT_GUIDE.md`, `backend/src/config/index.ts`)

---

## 1. Purpose

Define procedures for obtaining, installing, renewing, and monitoring SSL/TLS certificates for all Datacendia platform endpoints.

---

## 2. Certificate Inventory

| Endpoint | Certificate Type | Provider | Renewal |
|----------|-----------------|----------|---------|
| `api.datacendia.com` | TLS 1.3 | Let's Encrypt or Enterprise CA | 90 days (LE) / 1 year (CA) |
| `app.datacendia.com` | TLS 1.3 | Let's Encrypt or Enterprise CA | 90 days (LE) / 1 year (CA) |
| `auth.datacendia.com` | TLS 1.3 | Enterprise CA | 1 year |
| `monitoring.datacendia.com` | TLS 1.3 | Let's Encrypt | 90 days |
| Internal services (mTLS) | Mutual TLS | Internal CA | 1 year |

---

## 3. Certificate Acquisition

### 3.1 Let's Encrypt (Automated)
```bash
# Standalone mode
certbot certonly --standalone -d api.datacendia.com -d app.datacendia.com

# Webroot mode (production)
certbot certonly --webroot -w /var/www/certbot -d api.datacendia.com
```

### 3.2 Enterprise CA
1. Generate CSR:
   ```bash
   openssl req -new -newkey rsa:4096 -nodes \
     -keyout datacendia.key -out datacendia.csr \
     -subj "/C=US/ST=State/L=City/O=Datacendia LLC/CN=api.datacendia.com"
   ```
2. Submit CSR to CA
3. Receive signed certificate
4. Install certificate chain

---

## 4. Installation

### 4.1 Environment Configuration
```env
ENABLE_HTTPS=true
FORCE_HTTPS=true
SSL_CERT_PATH=/etc/ssl/certs/datacendia.crt
SSL_KEY_PATH=/etc/ssl/private/datacendia.key
```

### 4.2 File Permissions
```bash
chmod 644 /etc/ssl/certs/datacendia.crt
chmod 600 /etc/ssl/private/datacendia.key
chown root:root /etc/ssl/private/datacendia.key
```

### 4.3 Certificate Chain
Ensure full chain is provided (server cert + intermediates):
```bash
cat server.crt intermediate.crt > datacendia.crt
```

---

## 5. Renewal

### 5.1 Let's Encrypt Auto-Renewal
```bash
# Test renewal
certbot renew --dry-run

# Add to crontab
0 0 1 * * certbot renew --quiet --post-hook "docker compose restart nginx"
```

### 5.2 Manual Renewal
1. Generate new CSR or request renewal from CA
2. Replace certificate files
3. Restart affected services:
   ```bash
   docker compose restart nginx backend
   ```
4. Verify: `openssl s_client -connect api.datacendia.com:443`

---

## 6. Monitoring

### 6.1 Certificate Expiry Check
```bash
# Check expiry date
openssl x509 -in /etc/ssl/certs/datacendia.crt -noout -enddate

# Check from remote
echo | openssl s_client -connect api.datacendia.com:443 2>/dev/null | openssl x509 -noout -enddate
```

### 6.2 Alert Thresholds
| Days to Expiry | Action |
|----------------|--------|
| 30 days | Warning notification |
| 14 days | Urgent notification — initiate renewal |
| 7 days | Critical — escalate to Security Lead |
| 1 day | Emergency — immediate renewal required |

---

## 7. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| `ERR_CERT_AUTHORITY_INVALID` | Self-signed or missing intermediate | Install full certificate chain |
| `ERR_CERT_DATE_INVALID` | Certificate expired | Renew immediately |
| `ERR_SSL_PROTOCOL_ERROR` | TLS version mismatch | Ensure TLS 1.2+ only |
| Mixed content warnings | HTTP resources on HTTPS page | Update all resource URLs to HTTPS |

---

## 8. Verified Against

- `DEPLOYMENT_GUIDE.md`: SSL configuration section, `ENABLE_HTTPS`, `SSL_CERT_PATH`, `SSL_KEY_PATH`
- `backend/src/config/index.ts`: CORS origins configuration
- `docker-compose.production.yml`: Nginx/reverse proxy SSL termination

---

*Datacendia, LLC — Proprietary and Confidential*
