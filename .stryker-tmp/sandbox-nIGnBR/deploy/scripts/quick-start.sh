#!/bin/bash
# ============================================
# Datacendia Platform - Quick Start (Development)
# ============================================
# This script sets up a local development environment
# Usage: ./quick-start.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "🚀 Starting Datacendia Platform (Development Mode)..."

cd "$PROJECT_ROOT"

# Check if .env exists
if [ ! -f .env ]; then
    echo "📝 Creating .env from template..."
    cp .env.example .env
    echo "⚠️  Please review and update .env with your settings"
fi

# Start infrastructure services
echo "🐳 Starting infrastructure services..."
docker compose up -d postgres redis neo4j

echo "⏳ Waiting for databases to be ready..."
sleep 15

# Check postgres
until docker compose exec -T postgres pg_isready -U datacendia -d datacendia; do
    echo "Waiting for PostgreSQL..."
    sleep 2
done

echo "✅ PostgreSQL ready"

# Run migrations
echo "📦 Running database migrations..."
cd backend
npm run db:migrate
cd ..

# Pull Ollama model if Ollama is running
if docker compose ps ollama | grep -q "running"; then
    echo "🤖 Pulling Ollama model..."
    docker compose exec ollama ollama pull llama3.2:latest || true
fi

echo ""
echo "✅ Infrastructure ready!"
echo ""
echo "To start the development servers:"
echo "  Terminal 1: cd backend && npm run dev"
echo "  Terminal 2: npm run dev"
echo ""
echo "Or use Docker for everything:"
echo "  docker compose up"
echo ""
