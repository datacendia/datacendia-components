# SOP-003: Database Management (PostgreSQL/Prisma)

**Category:** Operations
**Priority:** Critical
**Owner:** Engineering Lead
**Last Verified:** 2026-02-22 (against `backend/prisma/` and `backend/src/config/index.ts`)

---

## 1. Purpose

Define procedures for PostgreSQL database operations including migrations, seeding, backups, and troubleshooting within the Datacendia platform.

---

## 2. Database Architecture

| Component | Technology | Purpose |
|-----------|-----------|---------|
| Primary DB | PostgreSQL 15+ | All application data, DCII scores, decisions, users |
| ORM | Prisma | Schema management, migrations, type-safe queries |
| Graph DB | Neo4j 5+ | Knowledge graph, entity relationships, lineage |
| Cache | Redis 7+ | Session cache, rate limiting, real-time data |

### 2.1 Prisma Schema Location
```
backend/prisma/
├── schema/           # Split schema files
│   ├── dcii.prisma   # 15 models — IISS, MediaAuth, Jurisdiction, Timestamps, Similarity
│   └── ...           # Core models — users, organizations, decisions, etc.
└── migrations/       # Migration history
```

---

## 3. Common Database Operations

### 3.1 Run Migrations (Deploy Existing)
```bash
cd backend
npx prisma migrate deploy
```
Use in: production, pilot, demo — applies all pending migrations.

### 3.2 Create New Migration (Development Only)
```bash
cd backend
npx prisma migrate dev --name descriptive_name
```
This will:
1. Generate SQL migration files
2. Apply the migration
3. Regenerate Prisma Client

### 3.3 Seed Database
```bash
cd backend
npx prisma db seed
```
Seeds demo data including: organizations, users, DCII scores, sample decisions.

### 3.4 Reset Database (Development Only)
```bash
cd backend
npx prisma migrate reset
```
**WARNING:** This drops all data and re-applies all migrations + seed.

### 3.5 Generate Prisma Client
```bash
cd backend
npx prisma generate
```
Run after any schema change to regenerate TypeScript types.

### 3.6 Inspect Database
```bash
cd backend
npx prisma studio
```
Opens browser-based database viewer at http://localhost:5555.

### 3.7 Pull Schema from Existing Database
```bash
cd backend
npx prisma db pull
```
Useful for verifying schema matches the database.

---

## 4. Connection Configuration

### 4.1 Connection String Format
```
DATABASE_URL=postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public
```

### 4.2 Default Development Connection
```
DATABASE_URL=postgresql://datacendia:datacendia_2024@localhost:5432/datacendia
```

### 4.3 Docker Container
The `docker-compose.dev.yml` exposes PostgreSQL on port 5432 with:
- User: `datacendia`
- Password: `datacendia_2024`
- Database: `datacendia`

---

## 5. DCII Database Models

The DCII subsystem uses dedicated Prisma models defined in `backend/prisma/schema/dcii.prisma`:

| Model | Purpose | Key Fields |
|-------|---------|------------|
| `dcii_iiss_scores` | IISS 0–1000 scores | organization_id, score, band, dimensions |
| `dcii_iiss_assessments` | Individual assessments | score_id, dimension, evidence |
| `dcii_iiss_history` | Score change history | score, band, event_type, timestamp |
| `dcii_media_auth` | C2PA content provenance | content_hash, signature, chain_of_custody |
| `dcii_jurisdiction_checks` | Cross-jurisdiction compliance | frameworks, conflicts, resolution |
| `dcii_timestamps` | RFC 3161 timestamps | hash, provider, blockchain_anchor |
| `dcii_similarity_results` | Decision similarity | query_decision_id, matches, scores |

All DCII services use a **write-through cache** pattern: in-memory Maps for fast reads + PostgreSQL via Prisma for persistence.

---

## 6. Backup Procedures

### 6.1 Manual Backup
```bash
pg_dump -Fc datacendia > backup_$(date +%Y%m%d_%H%M%S).dump
```

### 6.2 Restore from Backup
```bash
pg_restore -d datacendia backup_YYYYMMDD_HHMMSS.dump
```

### 6.3 Point-in-Time Recovery
Requires WAL archiving enabled in PostgreSQL configuration. See SOP-035 for full backup/DR procedures.

---

## 7. Troubleshooting

| Issue | Cause | Resolution |
|-------|-------|------------|
| `P1001: Can't reach database` | PostgreSQL not running | Start Docker: `docker-compose -f docker-compose.dev.yml up -d` |
| `P2002: Unique constraint failed` | Duplicate data | Check seed data for conflicts |
| `P2025: Record not found` | Missing FK reference | Ensure parent records exist |
| `Migration failed` | Schema conflict | Run `npx prisma migrate reset` (dev only) |
| Slow queries | Missing indexes | Check `dcii.prisma` — 50+ indexes defined |

---

## 8. Verified Against

- `backend/prisma/schema/dcii.prisma`: 15 models, 50+ indexes
- `backend/src/config/index.ts`: `databaseUrl` Zod validation
- `docker-compose.dev.yml`: PostgreSQL container configuration
- `COMPLETE_SERVICE_MATRIX.md`: DCII write-through cache pattern

---

*Datacendia, LLC — Proprietary and Confidential*
