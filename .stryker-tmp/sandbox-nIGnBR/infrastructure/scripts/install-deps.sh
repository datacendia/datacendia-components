#!/bin/bash
# =============================================================================
# DATACENDIA SOVEREIGN STACK - Dependency Installer
# =============================================================================
# Run this script to install all required npm packages for the sovereign stack
# =============================================================================

set -e

echo "🔧 Installing Datacendia Sovereign Stack dependencies..."

cd "$(dirname "$0")/../../backend"

# Core storage dependencies
echo "📦 Installing storage dependencies..."
npm install bullmq minio axios

# Type definitions
echo "📦 Installing type definitions..."
npm install -D @types/minio

# Optional: Prometheus metrics
echo "📦 Installing metrics dependencies..."
npm install prom-client

# Optional: PDF processing for CendiaGnosis
echo "📦 Installing document processing dependencies..."
npm install pdf-parse tesseract.js

echo "✅ All dependencies installed successfully!"
echo ""
echo "Next steps:"
echo "  1. Copy infrastructure/.env.example to infrastructure/.env"
echo "  2. Update .env with your secure passwords"
echo "  3. Run: docker-compose -f infrastructure/docker-compose.sovereign.yml up -d"
echo "  4. Initialize services in your backend startup"
