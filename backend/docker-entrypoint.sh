#!/bin/sh
set -e

echo "=== Datacendia Backend Startup ==="

# Run Prisma migrations if DATABASE_URL is a PostgreSQL connection
if echo "$DATABASE_URL" | grep -q "postgresql"; then
  echo "Running Prisma migrations..."
  npx prisma migrate deploy --schema=prisma/schema 2>&1 || {
    # SECURITY (H9 audit fix): Never use --accept-data-loss in production.
    # It can silently drop columns and tables. If migrations fail, halt startup.
    if [ "$NODE_ENV" = "production" ]; then
      echo "ERROR: Prisma migrate deploy failed in production. Refusing to fall back to db push."
      echo "Fix migrations manually before deploying."
      exit 1
    fi
    echo "Warning: Prisma migrate deploy failed. Falling back to db push (dev only)..."
    npx prisma db push --schema=prisma/schema 2>&1 || {
      echo "Warning: Prisma db push also failed. Starting anyway..."
    }
  }
  echo "Database schema ready."
else
  echo "Non-PostgreSQL DATABASE_URL detected, skipping migrations."
fi

echo "Starting backend server..."
exec "$@"
