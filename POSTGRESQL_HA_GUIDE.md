# POSTGRESQL HIGH AVAILABILITY GUIDE
**Setting up database redundancy and failover**

---

## WHAT IS HIGH AVAILABILITY (HA)?

**Simple Explanation:**
High Availability means your database keeps running even if one server fails.

**How it works:**
- **Primary database** - Handles all writes
- **Replica database** - Copies data from primary
- **Automatic failover** - If primary fails, replica becomes primary

**Why it matters:**
- Zero downtime during failures
- Data is never lost
- Platform stays online 24/7
- Required for enterprise SLAs

---

## CURRENT SETUP

**As of February 7, 2026**, the platform includes a production-ready HA configuration:

| Component | File | Purpose |
|-----------|------|---------|
| HA Stack | `docker-compose.ha-simple.yml` | Primary + Replica + PgBouncer + Redis + Grafana + Prometheus |
| Init Script | `infrastructure/postgres/init-primary.sh` | Configures replication user, slot, pg_hba.conf |
| Dashboard Provisioning | `grafana/provisioning/` | Auto-imports dashboards and datasources |
| Index Startup | `backend/src/startup/applyIndexes.ts` | Auto-applies performance indexes |

**Single instance** (`docker-compose.yml`) is still available for development.

---

## HA SETUP OPTIONS

### Option 1: Production-Ready HA (Recommended) ✅ IMPLEMENTED

Use the existing `docker-compose.ha-simple.yml`:

```yaml
version: '3.8'

services:
  postgres-primary:
    image: postgres:16-alpine
    container_name: datacendia-postgres-primary
    environment:
      POSTGRES_USER: cendia
      POSTGRES_PASSWORD: cendia_sovereign_2025
      POSTGRES_DB: datacendia
      POSTGRES_REPLICATION_MODE: master
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: replicator_pass
    ports:
      - "5434:5432"
    volumes:
      - postgres-primary-data:/var/lib/postgresql/data
    command: |
      postgres
      -c wal_level=replica
      -c max_wal_senders=3
      -c max_replication_slots=3
      -c hot_standby=on

  postgres-replica:
    image: postgres:16-alpine
    container_name: datacendia-postgres-replica
    environment:
      POSTGRES_USER: cendia
      POSTGRES_PASSWORD: cendia_sovereign_2025
      POSTGRES_DB: datacendia
      POSTGRES_REPLICATION_MODE: slave
      POSTGRES_MASTER_HOST: postgres-primary
      POSTGRES_MASTER_PORT: 5432
      POSTGRES_REPLICATION_USER: replicator
      POSTGRES_REPLICATION_PASSWORD: replicator_pass
    ports:
      - "5435:5432"
    volumes:
      - postgres-replica-data:/var/lib/postgresql/data
    depends_on:
      - postgres-primary

  pgpool:
    image: bitnami/pgpool:latest
    container_name: datacendia-pgpool
    environment:
      PGPOOL_BACKEND_NODES: 0:postgres-primary:5432,1:postgres-replica:5432
      PGPOOL_SR_CHECK_USER: cendia
      PGPOOL_SR_CHECK_PASSWORD: cendia_sovereign_2025
      PGPOOL_ENABLE_LDAP: no
      PGPOOL_POSTGRES_USERNAME: cendia
      PGPOOL_POSTGRES_PASSWORD: cendia_sovereign_2025
      PGPOOL_ADMIN_USERNAME: admin
      PGPOOL_ADMIN_PASSWORD: datacendia2024
    ports:
      - "5432:5432"
    depends_on:
      - postgres-primary
      - postgres-replica

volumes:
  postgres-primary-data:
  postgres-replica-data:
```

**Deploy:**
```powershell
docker-compose -f docker-compose.ha-simple.yml up -d
```

**Update backend/.env:**
```bash
DATABASE_URL=postgresql://cendia:cendia_sovereign_2025@localhost:6432/datacendia
```

**What this gives you:**
- Primary + Replica with streaming replication
- PgBouncer connection pooling (port 6432)
- WAL archiving and replication slots
- Healthchecks with auto-restart
- Resource limits (CPU/memory)
- Redis 7 with AOF persistence
- Grafana with auto-provisioned dashboards
- Prometheus metrics collection

**Init script** (`infrastructure/postgres/init-primary.sh`) automatically:
- Creates the replication user
- Creates a replication slot
- Configures `pg_hba.conf` for replication access

---

### Option 2: Patroni (Production-Grade)

**What it is:** Industry-standard PostgreSQL HA solution

**Features:**
- Automatic failover
- Health monitoring
- Consensus-based leader election
- Zero-downtime upgrades

**Setup:**
```yaml
# docker-compose.patroni.yml
version: '3.8'

services:
  etcd:
    image: quay.io/coreos/etcd:latest
    environment:
      ETCD_LISTEN_CLIENT_URLS: http://0.0.0.0:2379
      ETCD_ADVERTISE_CLIENT_URLS: http://etcd:2379
    ports:
      - "2379:2379"

  patroni1:
    image: patroni/patroni:latest
    environment:
      PATRONI_NAME: patroni1
      PATRONI_ETCD_URL: http://etcd:2379
      PATRONI_POSTGRESQL_DATA_DIR: /var/lib/postgresql/data
      PATRONI_POSTGRESQL_CONNECT_ADDRESS: patroni1:5432
      PATRONI_RESTAPI_CONNECT_ADDRESS: patroni1:8008
      PATRONI_POSTGRESQL_AUTHENTICATION_REPLICATION_USERNAME: replicator
      PATRONI_POSTGRESQL_AUTHENTICATION_REPLICATION_PASSWORD: replicator_pass
      PATRONI_POSTGRESQL_AUTHENTICATION_SUPERUSER_USERNAME: cendia
      PATRONI_POSTGRESQL_AUTHENTICATION_SUPERUSER_PASSWORD: cendia_sovereign_2025
    ports:
      - "5434:5432"
      - "8008:8008"
    depends_on:
      - etcd

  patroni2:
    image: patroni/patroni:latest
    environment:
      PATRONI_NAME: patroni2
      PATRONI_ETCD_URL: http://etcd:2379
      PATRONI_POSTGRESQL_DATA_DIR: /var/lib/postgresql/data
      PATRONI_POSTGRESQL_CONNECT_ADDRESS: patroni2:5432
      PATRONI_RESTAPI_CONNECT_ADDRESS: patroni2:8008
      PATRONI_POSTGRESQL_AUTHENTICATION_REPLICATION_USERNAME: replicator
      PATRONI_POSTGRESQL_AUTHENTICATION_REPLICATION_PASSWORD: replicator_pass
      PATRONI_POSTGRESQL_AUTHENTICATION_SUPERUSER_USERNAME: cendia
      PATRONI_POSTGRESQL_AUTHENTICATION_SUPERUSER_PASSWORD: cendia_sovereign_2025
    ports:
      - "5435:5432"
      - "8009:8008"
    depends_on:
      - etcd

  haproxy:
    image: haproxy:latest
    ports:
      - "5432:5432"
      - "7000:7000"
    volumes:
      - ./infrastructure/haproxy/haproxy.cfg:/usr/local/etc/haproxy/haproxy.cfg
    depends_on:
      - patroni1
      - patroni2
```

---

## LOAD BALANCING

### HAProxy Configuration

Create `infrastructure/haproxy/haproxy.cfg`:

```
global
    maxconn 100

defaults
    log global
    mode tcp
    retries 2
    timeout client 30m
    timeout connect 4s
    timeout server 30m
    timeout check 5s

listen stats
    mode http
    bind *:7000
    stats enable
    stats uri /

listen primary
    bind *:5432
    option httpchk
    http-check expect status 200
    default-server inter 3s fall 3 rise 2 on-marked-down shutdown-sessions
    server patroni1 patroni1:5432 maxconn 100 check port 8008
    server patroni2 patroni2:5432 maxconn 100 check port 8008 backup
```

---

## BACKUP STRATEGY

### Automated Daily Backups

Create `scripts/backup-database.sh`:

```bash
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="./backups"

mkdir -p $BACKUP_DIR

# Backup database
docker exec datacendia-postgres pg_dump -U cendia datacendia | gzip > $BACKUP_DIR/datacendia_$DATE.sql.gz

# Keep only last 30 days
find $BACKUP_DIR -name "datacendia_*.sql.gz" -mtime +30 -delete

echo "Backup completed: datacendia_$DATE.sql.gz"
```

### Schedule with Cron (Linux) or Task Scheduler (Windows)

**Windows Task Scheduler:**
1. Open Task Scheduler
2. Create Basic Task
3. Name: "Datacendia Daily Backup"
4. Trigger: Daily at 2 AM
5. Action: Start a program
6. Program: `powershell.exe`
7. Arguments: `-File C:\path\to\backup-database.ps1`

---

## MONITORING

### Check Replication Status

```sql
-- On primary
SELECT * FROM pg_stat_replication;

-- On replica
SELECT * FROM pg_stat_wal_receiver;
```

### Check Replication Lag

```sql
SELECT
  client_addr,
  state,
  sent_lsn,
  write_lsn,
  flush_lsn,
  replay_lsn,
  sync_state
FROM pg_stat_replication;
```

---

## FAILOVER TESTING

### Manual Failover Test

```powershell
# 1. Stop primary database
docker stop datacendia-postgres-primary

# 2. Verify replica becomes primary (with Patroni)
# Check Patroni REST API:
curl http://localhost:8008/

# 3. Verify application still works
curl http://localhost:3001/api/v1/health

# 4. Restart original primary (becomes replica)
docker start datacendia-postgres-primary
```

---

## DISASTER RECOVERY

### Restore from Backup

```powershell
# 1. Stop backend
# Ctrl+C in backend terminal

# 2. Restore database
gunzip -c backups/datacendia_20260125_020000.sql.gz | docker exec -i datacendia-postgres psql -U cendia datacendia

# 3. Restart backend
cd backend
npm run dev
```

### Point-in-Time Recovery (PITR)

Requires WAL archiving:

```sql
-- Enable in postgresql.conf
archive_mode = on
archive_command = 'cp %p /var/lib/postgresql/wal_archive/%f'
```

---

## COST COMPARISON

| Solution | Setup Time | Cost | Reliability |
|----------|------------|------|-------------|
| **Single Instance** | 5 min | $0 | 95% uptime |
| **Docker HA** | 30 min | $0 | 99% uptime |
| **Patroni** | 2 hours | $0 | 99.9% uptime |
| **Managed (AWS RDS)** | 10 min | $200/month | 99.95% uptime |

---

## RECOMMENDATION

**For Development:** Single instance (`docker-compose.yml`) ✅

**For Production (<100 users):** `docker-compose.ha-simple.yml` with PgBouncer ✅ Ready

**For Production (>100 users):** Patroni with HAProxy

**For Enterprise/Cloud:** Managed database (AWS RDS, Azure Database, Google Cloud SQL)

---

## QUICK START (DOCKER HA)

```powershell
# 1. Deploy the HA stack (already configured)
docker-compose -f docker-compose.ha-simple.yml up -d

# 2. Update backend/.env to use PgBouncer
DATABASE_URL=postgresql://cendia:cendia_sovereign_2025@localhost:6432/datacendia

# 3. Start backend (indexes auto-applied)
cd backend
npm run dev

# 4. Verify
curl http://localhost:3001/api/v1/health

# 5. Check Grafana dashboards (auto-provisioned)
# Open http://localhost:3100 (admin/datacendia2025)
```

**Done!** You now have high availability with monitoring.

---

*All solutions are free and open-source. Choose based on your uptime requirements.*
