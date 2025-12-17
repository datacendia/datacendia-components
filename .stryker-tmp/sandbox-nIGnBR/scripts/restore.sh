#!/bin/bash
# =============================================================================
# DATACENDIA RESTORE SCRIPT
# Enterprise restore for PostgreSQL, Neo4j, and Redis
# =============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Configuration
BACKUP_FILE="${1:-}"
RESTORE_DIR="/tmp/datacendia_restore_$$"

POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-datacendia}"
POSTGRES_DB="${POSTGRES_DB:-datacendia}"
PGPASSWORD="${POSTGRES_PASSWORD:-}"

NEO4J_HOST="${NEO4J_HOST:-localhost}"
NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-}"

REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# =============================================================================
# VALIDATION
# =============================================================================

validate_backup() {
    if [ -z "${BACKUP_FILE}" ]; then
        log_error "Usage: $0 <backup_file.tar.gz>"
        exit 1
    fi
    
    if [ ! -f "${BACKUP_FILE}" ]; then
        log_error "Backup file not found: ${BACKUP_FILE}"
        exit 1
    fi
    
    # Verify checksum if available
    if [ -f "${BACKUP_FILE}.sha256" ]; then
        log_info "Verifying checksum..."
        sha256sum -c "${BACKUP_FILE}.sha256" || {
            log_error "Checksum verification failed!"
            exit 1
        }
    fi
}

# =============================================================================
# EXTRACT BACKUP
# =============================================================================

extract_backup() {
    log_info "Extracting backup to ${RESTORE_DIR}..."
    mkdir -p "${RESTORE_DIR}"
    tar -xzf "${BACKUP_FILE}" -C "${RESTORE_DIR}"
    
    # Find the backup directory
    BACKUP_DIR=$(ls -d ${RESTORE_DIR}/datacendia_backup_* 2>/dev/null | head -1)
    
    if [ -z "${BACKUP_DIR}" ]; then
        log_error "Invalid backup archive structure"
        exit 1
    fi
    
    log_info "Backup extracted: ${BACKUP_DIR}"
}

# =============================================================================
# RESTORE POSTGRESQL
# =============================================================================

restore_postgres() {
    if [ ! -f "${BACKUP_DIR}/postgres.dump" ]; then
        log_warn "PostgreSQL backup not found, skipping..."
        return
    fi
    
    log_info "Restoring PostgreSQL database..."
    
    export PGPASSWORD
    
    # Drop and recreate database
    log_warn "This will DROP the existing database. Continue? (y/N)"
    read -r confirm
    if [ "${confirm}" != "y" ]; then
        log_info "PostgreSQL restore skipped"
        return
    fi
    
    psql -h "${POSTGRES_HOST}" -p "${POSTGRES_PORT}" -U "${POSTGRES_USER}" -d postgres <<EOF
SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = '${POSTGRES_DB}' AND pid <> pg_backend_pid();
DROP DATABASE IF EXISTS ${POSTGRES_DB};
CREATE DATABASE ${POSTGRES_DB} OWNER ${POSTGRES_USER};
EOF
    
    # Restore from dump
    pg_restore \
        -h "${POSTGRES_HOST}" \
        -p "${POSTGRES_PORT}" \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        -v \
        "${BACKUP_DIR}/postgres.dump"
    
    log_info "PostgreSQL restore complete"
}

# =============================================================================
# RESTORE NEO4J
# =============================================================================

restore_neo4j() {
    if [ ! -f "${BACKUP_DIR}/neo4j_full.json" ]; then
        log_warn "Neo4j backup not found, skipping..."
        return
    fi
    
    log_info "Restoring Neo4j graph database..."
    
    # Clear existing data
    log_warn "This will DELETE all existing Neo4j data. Continue? (y/N)"
    read -r confirm
    if [ "${confirm}" != "y" ]; then
        log_info "Neo4j restore skipped"
        return
    fi
    
    cypher-shell \
        -a "bolt://${NEO4J_HOST}:7687" \
        -u "${NEO4J_USER}" \
        -p "${NEO4J_PASSWORD}" \
        "MATCH (n) DETACH DELETE n"
    
    # Import from JSON
    cypher-shell \
        -a "bolt://${NEO4J_HOST}:7687" \
        -u "${NEO4J_USER}" \
        -p "${NEO4J_PASSWORD}" \
        "CALL apoc.import.json('file://${BACKUP_DIR}/neo4j_full.json')"
    
    log_info "Neo4j restore complete"
}

# =============================================================================
# RESTORE REDIS
# =============================================================================

restore_redis() {
    if [ ! -f "${BACKUP_DIR}/redis.rdb" ]; then
        log_warn "Redis backup not found, skipping..."
        return
    fi
    
    log_info "Restoring Redis..."
    
    # Stop Redis, replace RDB, restart
    redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" SHUTDOWN NOSAVE || true
    
    cp "${BACKUP_DIR}/redis.rdb" /var/lib/redis/dump.rdb
    
    # Restart Redis (depends on your setup)
    systemctl start redis || docker start datacendia-redis || log_warn "Please restart Redis manually"
    
    log_info "Redis restore complete"
}

# =============================================================================
# CLEANUP
# =============================================================================

cleanup() {
    log_info "Cleaning up temporary files..."
    rm -rf "${RESTORE_DIR}"
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    log_info "=========================================="
    log_info "DATACENDIA RESTORE"
    log_info "=========================================="
    
    validate_backup
    extract_backup
    
    restore_postgres
    restore_neo4j
    restore_redis
    
    cleanup
    
    log_info "=========================================="
    log_info "RESTORE COMPLETE"
    log_info "=========================================="
}

trap cleanup EXIT

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
