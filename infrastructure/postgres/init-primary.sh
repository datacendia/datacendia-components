#!/bin/bash
# =============================================================================
# DATACENDIA PostgreSQL Primary Initialization
# Sets up replication user, slots, and WAL archive directory
# This runs automatically on first database init via docker-entrypoint-initdb.d
# =============================================================================

set -e

echo "=== Datacendia PostgreSQL Primary Init ==="

# Create replication user
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    -- Replication user for streaming replication
    DO \$\$
    BEGIN
        IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'replicator') THEN
            CREATE ROLE replicator WITH REPLICATION LOGIN PASSWORD '${POSTGRES_PASSWORD}';
            RAISE NOTICE 'Created replication user: replicator';
        END IF;
    END
    \$\$;

    -- Replication slot for guaranteed WAL retention
    SELECT CASE 
        WHEN NOT EXISTS (SELECT 1 FROM pg_replication_slots WHERE slot_name = 'replica_slot_1')
        THEN pg_create_physical_replication_slot('replica_slot_1')
        ELSE NULL
    END;

    -- Grant replication privileges
    GRANT pg_read_all_data TO replicator;
EOSQL

# Configure pg_hba.conf for replication connections
cat >> "$PGDATA/pg_hba.conf" <<EOF

# Replication connections (added by init-primary.sh)
host    replication     replicator      0.0.0.0/0       scram-sha-256
host    all             cendia          0.0.0.0/0       scram-sha-256
EOF

# Create WAL archive directory
mkdir -p /var/lib/postgresql/wal_archive
chown postgres:postgres /var/lib/postgresql/wal_archive

echo "=== Primary initialization complete ==="
echo "  - Replication user: replicator"
echo "  - Replication slot: replica_slot_1"
echo "  - WAL archive: /var/lib/postgresql/wal_archive"
