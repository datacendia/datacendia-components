#!/bin/bash
# =============================================================================
# DATACENDIA DATABASE INITIALIZATION
# =============================================================================
# Creates all required databases for the unified stack
# This script runs automatically when PostgreSQL container starts
# =============================================================================

set -e

# Wait for PostgreSQL to be ready
until pg_isready -U "$POSTGRES_USER" -d "$POSTGRES_DB"; do
  echo "Waiting for PostgreSQL..."
  sleep 2
done

echo "Creating additional databases..."

# Create keycloak database if it doesn't exist
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    SELECT 'CREATE DATABASE keycloak' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'keycloak')\gexec
    SELECT 'CREATE DATABASE unleash' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'unleash')\gexec
    SELECT 'CREATE DATABASE infisical' WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'infisical')\gexec
EOSQL

echo "Granting permissions..."
psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    GRANT ALL PRIVILEGES ON DATABASE keycloak TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE unleash TO $POSTGRES_USER;
    GRANT ALL PRIVILEGES ON DATABASE infisical TO $POSTGRES_USER;
EOSQL

echo "Datacendia databases initialized: keycloak, unleash, infisical"
