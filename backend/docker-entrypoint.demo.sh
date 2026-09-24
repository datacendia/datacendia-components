#!/bin/sh
set -e

echo "╔════════════════════════════════════════════════════════════╗"
echo "║         DATACENDIA DEMO MODE                               ║"
echo "║         Auto-migrate + Auto-seed                           ║"
echo "╚════════════════════════════════════════════════════════════╝"

# Wait for postgres
echo "Waiting for PostgreSQL..."
# Postgres doesn't speak HTTP and the image has no pg_isready, so check the
# TCP port directly (busybox nc ships with Alpine).
PG_HOST="${PG_HOST:-postgres}"
PG_PORT="${PG_PORT:-5432}"
tries=0
until nc -z "$PG_HOST" "$PG_PORT" 2>/dev/null; do
  tries=$((tries + 1))
  if [ "$tries" -ge 60 ]; then
    echo "PostgreSQL did not accept connections after 120s. Giving up."
    exit 1
  fi
  sleep 2
  echo "  ...waiting for PostgreSQL"
done
echo "PostgreSQL is ready."

# Create the schema. `migrate deploy` can't do it here: under Prisma 7 it finds
# no migrations unless prisma.config.ts sets migrations.path, and the history
# doesn't replay onto an empty database (20260304053601 re-creates
# ledger_entries). The demo database starts empty, so sync it from the schema
# (a no-op on restarts), and stop if that fails: every page needs these tables.
echo "Creating database schema..."
npx prisma db push --schema=prisma/schema 2>&1 || {
  echo "Schema push failed; the demo cannot run without its tables."
  echo "To start over with a fresh database: docker compose -f docker-compose.demo.yml down -v"
  exit 1
}
echo "Database schema ready."

# Seed demo data (idempotent — checks for existing data)
echo "Seeding demo data..."
npx tsx prisma/seed-full-demo.ts 2>&1 || {
  echo "Warning: Base seed had issues. Demo may have partial data."
}

# Seed showcase deliberations (5 verticals + human override)
echo "Seeding Council showcase deliberations..."
npx tsx prisma/seed-council-showcase.ts 2>&1 || {
  echo "Warning: Showcase seed had issues. Deliberations may be incomplete."
}

echo ""
echo "╔════════════════════════════════════════════════════════════╗"
echo "║  DEMO READY                                                ║"
echo "║                                                            ║"
echo "║  Frontend:  http://localhost:5173                          ║"
echo "║  API:       http://localhost:3001                          ║"
echo "║  API Docs:  http://localhost:3001/api/v1                   ║"
echo "║                                                            ║"
echo "║  Demo login:    sarah.chen@acme.demo                       ║"
echo "║  Password:      demo-password-2024                         ║"
echo "╚════════════════════════════════════════════════════════════╝"
echo ""

echo "Starting backend server..."
exec "$@"
