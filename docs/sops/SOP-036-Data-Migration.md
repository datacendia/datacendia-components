# SOP-036: Data Migration Procedures

**Category:** Operations
**Priority:** High
**Owner:** Engineering Lead / CDO
**Last Verified:** 2026-02-22 (against `backend/prisma/`, database architecture)

---

## 1. Purpose

Define procedures for migrating data into, out of, and between Datacendia platform environments, including client data onboarding, version upgrades, and platform decommissioning.

---

## 2. Migration Types

| Type | Description | Risk Level |
|------|-------------|------------|
| **Client Data Import** | Onboarding client data into Datacendia | Medium |
| **Version Upgrade** | Schema migrations between platform versions | High |
| **Environment Promotion** | Moving data from pilot → production | Medium |
| **Platform Export** | Extracting all client data for portability | Low |
| **Cross-Region** | Moving data between sovereign regions | High |
| **Database Engine** | Migrating between database versions | Critical |

---

## 3. Pre-Migration Checklist

- [ ] Migration plan documented and reviewed
- [ ] Source data inventory completed
- [ ] Target schema compatibility verified
- [ ] Full backup of target environment (see SOP-035)
- [ ] Rollback plan defined and tested
- [ ] Maintenance window scheduled and communicated
- [ ] Migration scripts tested on staging
- [ ] Data validation queries prepared
- [ ] Stakeholders notified

---

## 4. Schema Migration (Prisma)

### 4.1 Development — Create Migration
```bash
cd backend

# Generate migration from schema changes
npx prisma migrate dev --name descriptive_migration_name

# This creates:
# backend/prisma/migrations/<timestamp>_descriptive_migration_name/migration.sql
```

### 4.2 Production — Apply Migration
```bash
cd backend

# Apply all pending migrations (non-interactive)
npx prisma migrate deploy
```

### 4.3 Migration Verification
```bash
# Check migration status
npx prisma migrate status

# Verify schema matches database
npx prisma db pull --force
npx prisma validate
```

### 4.4 Rollback
Prisma does not support automatic rollback. Manual procedure:
1. Identify the failing migration SQL file
2. Write reverse SQL statements
3. Apply manually:
   ```bash
   psql $DATABASE_URL -f rollback.sql
   ```
4. Mark migration as rolled back:
   ```bash
   npx prisma migrate resolve --rolled-back <migration_name>
   ```

---

## 5. Client Data Import

### 5.1 Supported Import Formats
| Format | Use Case |
|--------|----------|
| CSV | Tabular data (decisions, metrics) |
| JSON | Structured records (configurations, hierarchies) |
| SQL dump | Full database migration from compatible schema |
| API sync | Real-time integration via CendiaMesh™ |
| Excel | Business user data uploads |

### 5.2 Import Procedure
1. **Validate source data**
   - Schema compatibility check
   - Data type verification
   - Required field completeness
   - Duplicate detection

2. **Transform data**
   - Map source fields to Datacendia schema
   - Apply data classification tags
   - Generate unique IDs where needed
   - Normalize date formats, currencies, units

3. **Staging import**
   - Import to staging tables first
   - Run validation queries
   - Verify row counts match
   - Check referential integrity

4. **Production import**
   - Apply from staging to production tables
   - Verify with checksums
   - Run CDO agent data quality assessment
   - Generate import audit record in CendiaLedger™

### 5.3 Via API
```bash
curl -X POST http://localhost:3001/api/v1/upload/import \
  -H "Authorization: Bearer <admin_token>" \
  -F "file=@data.csv" \
  -F "type=decisions" \
  -F "mappings={\"source_col\":\"target_field\"}"
```

---

## 6. Data Export (Portability)

### 6.1 Full Platform Export
```bash
# Export all organization data
curl -X POST http://localhost:3001/api/v1/admin/export \
  -H "Authorization: Bearer <admin_token>" \
  -d '{
    "organizationId": "org_123",
    "format": "json",
    "includeAuditTrail": true,
    "includeDCII": true
  }' \
  -o datacendia_export.json
```

### 6.2 GDPR Data Portability Export
```bash
# Per-user export (GDPR Art. 20)
curl http://localhost:3001/api/v1/admin/gdpr/subject-access \
  -H "Authorization: Bearer <admin_token>" \
  -d '{"subjectEmail": "user@example.com", "format": "machine-readable"}'
```

### 6.3 Court-Ready Export
Use CendiaChronos™ for court-admissible historical data exports (see SOP-023).

---

## 7. Cross-Region Migration

For CendiaSovereign™ data residency compliance:

1. Verify destination region meets regulatory requirements
2. Encrypt data with destination region's keys (CendiaKey™)
3. Transfer via secure channel (TLS 1.3 minimum)
4. Verify integrity at destination (checksum comparison)
5. Update data residency metadata
6. Remove source copy (if required by regulation)
7. Log migration in CendiaLedger™ with both regions

---

## 8. Post-Migration Validation

| Check | Method | Pass Criteria |
|-------|--------|---------------|
| Row counts | `SELECT COUNT(*)` comparison | Exact match |
| Checksums | MD5/SHA-256 of key columns | Match |
| Referential integrity | FK constraint validation | No orphans |
| Data quality | CDO agent assessment | Score ≥ baseline |
| Application health | Backend health check | All green |
| User acceptance | Key stakeholder spot-checks | Approved |

---

## 9. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| Migration timeout | Large dataset | Increase statement timeout; batch import |
| FK constraint failure | Import order wrong | Import parent records before children |
| Encoding errors | Character set mismatch | Convert to UTF-8 before import |
| Duplicate key | Data already exists | Use UPSERT or deduplicate source |
| Schema mismatch | Version difference | Run pending Prisma migrations first |

---

## 10. Verified Against

- `backend/prisma/`: Migration directory, schema files
- `backend/prisma/schema/dcii.prisma`: DCII models, 50+ indexes
- `backend/src/routes/upload.ts`: Upload/import API endpoint
- `BACKUP_RECOVERY.md`: Backup before migration requirement
- `COMPLIANCE_DOCUMENTATION.md`: GDPR Art. 20 data portability

---

*Datacendia, LLC — Proprietary and Confidential*
