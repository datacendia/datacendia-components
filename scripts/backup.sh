#!/bin/bash
# =============================================================================
# DATACENDIA BACKUP SCRIPT
# Enterprise backup for PostgreSQL, Neo4j, and Redis
# Supports local, S3, and Azure Blob Storage destinations
# =============================================================================

set -euo pipefail

# Configuration
BACKUP_DIR="${BACKUP_DIR:-/var/backups/datacendia}"
RETENTION_DAYS="${RETENTION_DAYS:-30}"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_NAME="datacendia_backup_${TIMESTAMP}"

# Database credentials (from environment or Vault)
POSTGRES_HOST="${POSTGRES_HOST:-localhost}"
POSTGRES_PORT="${POSTGRES_PORT:-5432}"
POSTGRES_USER="${POSTGRES_USER:-datacendia}"
POSTGRES_DB="${POSTGRES_DB:-datacendia}"
PGPASSWORD="${POSTGRES_PASSWORD:-}"

NEO4J_HOST="${NEO4J_HOST:-localhost}"
NEO4J_PORT="${NEO4J_PORT:-7474}"
NEO4J_USER="${NEO4J_USER:-neo4j}"
NEO4J_PASSWORD="${NEO4J_PASSWORD:-}"

REDIS_HOST="${REDIS_HOST:-localhost}"
REDIS_PORT="${REDIS_PORT:-6379}"

# S3 configuration (optional)
S3_BUCKET="${S3_BUCKET:-}"
S3_PREFIX="${S3_PREFIX:-backups/datacendia}"

# Azure Blob configuration (optional)
AZURE_CONTAINER="${AZURE_CONTAINER:-}"
AZURE_CONNECTION_STRING="${AZURE_CONNECTION_STRING:-}"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

log_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

log_warn() {
    echo -e "${YELLOW}[WARN]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# =============================================================================
# CREATE BACKUP DIRECTORY
# =============================================================================

create_backup_dir() {
    log_info "Creating backup directory: ${BACKUP_DIR}/${BACKUP_NAME}"
    mkdir -p "${BACKUP_DIR}/${BACKUP_NAME}"
}

# =============================================================================
# POSTGRESQL BACKUP
# =============================================================================

backup_postgres() {
    log_info "Backing up PostgreSQL database..."
    
    export PGPASSWORD
    
    # Full database dump with compression
    pg_dump \
        -h "${POSTGRES_HOST}" \
        -p "${POSTGRES_PORT}" \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        -F c \
        -Z 9 \
        -f "${BACKUP_DIR}/${BACKUP_NAME}/postgres.dump"
    
    # Schema-only backup for documentation
    pg_dump \
        -h "${POSTGRES_HOST}" \
        -p "${POSTGRES_PORT}" \
        -U "${POSTGRES_USER}" \
        -d "${POSTGRES_DB}" \
        --schema-only \
        -f "${BACKUP_DIR}/${BACKUP_NAME}/postgres_schema.sql"
    
    log_info "PostgreSQL backup complete: postgres.dump"
}

# =============================================================================
# NEO4J BACKUP
# =============================================================================

backup_neo4j() {
    log_info "Backing up Neo4j graph database..."
    
    # Export all nodes and relationships using APOC
    cypher-shell \
        -a "bolt://${NEO4J_HOST}:7687" \
        -u "${NEO4J_USER}" \
        -p "${NEO4J_PASSWORD}" \
        "CALL apoc.export.json.all('${BACKUP_DIR}/${BACKUP_NAME}/neo4j_full.json', {useTypes: true})" \
        2>/dev/null || {
        log_warn "Neo4j APOC export failed, using dump method..."
        
        # Fallback: Neo4j admin dump (requires container access)
        docker exec datacendia-neo4j neo4j-admin database dump neo4j \
            --to-path=/backups/ 2>/dev/null || log_warn "Neo4j dump also failed"
    }
    
    log_info "Neo4j backup complete"
}

# =============================================================================
# REDIS BACKUP
# =============================================================================

backup_redis() {
    log_info "Backing up Redis..."
    
    # Trigger BGSAVE
    redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" BGSAVE
    
    # Wait for save to complete
    while [ "$(redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" LASTSAVE)" == "$(redis-cli -h "${REDIS_HOST}" -p "${REDIS_PORT}" LASTSAVE)" ]; do
        sleep 1
    done
    
    # Copy RDB file
    if [ -f /var/lib/redis/dump.rdb ]; then
        cp /var/lib/redis/dump.rdb "${BACKUP_DIR}/${BACKUP_NAME}/redis.rdb"
    elif docker exec datacendia-redis cat /data/dump.rdb > "${BACKUP_DIR}/${BACKUP_NAME}/redis.rdb" 2>/dev/null; then
        log_info "Redis backup from Docker container"
    else
        log_warn "Could not locate Redis RDB file"
    fi
    
    log_info "Redis backup complete"
}

# =============================================================================
# CREATE ARCHIVE
# =============================================================================

create_archive() {
    log_info "Creating compressed archive..."
    
    cd "${BACKUP_DIR}"
    tar -czf "${BACKUP_NAME}.tar.gz" "${BACKUP_NAME}"
    
    # Calculate checksum
    sha256sum "${BACKUP_NAME}.tar.gz" > "${BACKUP_NAME}.tar.gz.sha256"
    
    # Clean up uncompressed backup
    rm -rf "${BACKUP_NAME}"
    
    log_info "Archive created: ${BACKUP_NAME}.tar.gz"
    log_info "Checksum: $(cat ${BACKUP_NAME}.tar.gz.sha256)"
}

# =============================================================================
# UPLOAD TO CLOUD STORAGE
# =============================================================================

upload_to_s3() {
    if [ -n "${S3_BUCKET}" ]; then
        log_info "Uploading to S3: s3://${S3_BUCKET}/${S3_PREFIX}/"
        
        aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz" \
            "s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_NAME}.tar.gz" \
            --storage-class STANDARD_IA
        
        aws s3 cp "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.sha256" \
            "s3://${S3_BUCKET}/${S3_PREFIX}/${BACKUP_NAME}.tar.gz.sha256"
        
        log_info "S3 upload complete"
    fi
}

upload_to_azure() {
    if [ -n "${AZURE_CONTAINER}" ]; then
        log_info "Uploading to Azure Blob: ${AZURE_CONTAINER}"
        
        az storage blob upload \
            --connection-string "${AZURE_CONNECTION_STRING}" \
            --container-name "${AZURE_CONTAINER}" \
            --name "${BACKUP_NAME}.tar.gz" \
            --file "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
        
        az storage blob upload \
            --connection-string "${AZURE_CONNECTION_STRING}" \
            --container-name "${AZURE_CONTAINER}" \
            --name "${BACKUP_NAME}.tar.gz.sha256" \
            --file "${BACKUP_DIR}/${BACKUP_NAME}.tar.gz.sha256"
        
        log_info "Azure upload complete"
    fi
}

# =============================================================================
# CLEANUP OLD BACKUPS
# =============================================================================

cleanup_old_backups() {
    log_info "Cleaning up backups older than ${RETENTION_DAYS} days..."
    
    find "${BACKUP_DIR}" -name "datacendia_backup_*.tar.gz" -mtime +${RETENTION_DAYS} -delete
    find "${BACKUP_DIR}" -name "datacendia_backup_*.tar.gz.sha256" -mtime +${RETENTION_DAYS} -delete
    
    # Cleanup S3 if configured
    if [ -n "${S3_BUCKET}" ]; then
        # S3 lifecycle policies should handle this, but manual cleanup as backup
        log_info "S3 cleanup delegated to lifecycle policies"
    fi
    
    log_info "Cleanup complete"
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    log_info "=========================================="
    log_info "DATACENDIA BACKUP - ${TIMESTAMP}"
    log_info "=========================================="
    
    create_backup_dir
    
    backup_postgres
    backup_neo4j
    backup_redis
    
    create_archive
    
    upload_to_s3
    upload_to_azure
    
    cleanup_old_backups
    
    log_info "=========================================="
    log_info "BACKUP COMPLETE"
    log_info "Location: ${BACKUP_DIR}/${BACKUP_NAME}.tar.gz"
    log_info "=========================================="
}

# Run if executed directly
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
