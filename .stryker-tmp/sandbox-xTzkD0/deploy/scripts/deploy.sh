#!/bin/bash
# ============================================
# Datacendia Platform - Deployment Script
# ============================================
# Usage: ./deploy.sh [environment]
# Environments: staging, production

set -e

ENVIRONMENT=${1:-staging}
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$(dirname "$SCRIPT_DIR")")"

echo "🚀 Deploying Datacendia Platform to $ENVIRONMENT..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }

# Check prerequisites
check_prerequisites() {
    log_info "Checking prerequisites..."
    
    if ! command -v docker &> /dev/null; then
        log_error "Docker is not installed"
        exit 1
    fi
    
    if ! command -v docker compose &> /dev/null; then
        log_error "Docker Compose is not installed"
        exit 1
    fi
    
    if [ ! -f "$PROJECT_ROOT/.env" ]; then
        log_error ".env file not found. Copy .env.example to .env and configure it."
        exit 1
    fi
    
    log_info "Prerequisites check passed ✓"
}

# Build images
build_images() {
    log_info "Building Docker images..."
    cd "$PROJECT_ROOT"
    
    docker compose -f docker-compose.prod.yml build --no-cache
    
    log_info "Images built successfully ✓"
}

# Run database migrations
run_migrations() {
    log_info "Running database migrations..."
    
    # Wait for database to be ready
    docker compose -f docker-compose.prod.yml exec -T api npx prisma migrate deploy
    
    log_info "Migrations completed ✓"
}

# Deploy services
deploy_services() {
    log_info "Deploying services..."
    cd "$PROJECT_ROOT"
    
    # Pull latest images for dependencies
    docker compose -f docker-compose.prod.yml pull postgres redis neo4j
    
    # Start services
    docker compose -f docker-compose.prod.yml up -d
    
    log_info "Services deployed ✓"
}

# Health check
health_check() {
    log_info "Running health checks..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf http://localhost:3001/health > /dev/null 2>&1; then
            log_info "API health check passed ✓"
            return 0
        fi
        
        log_warn "Attempt $attempt/$max_attempts - API not ready yet..."
        sleep 5
        ((attempt++))
    done
    
    log_error "Health check failed after $max_attempts attempts"
    docker compose -f docker-compose.prod.yml logs api
    exit 1
}

# Show status
show_status() {
    log_info "Deployment Status:"
    echo ""
    docker compose -f docker-compose.prod.yml ps
    echo ""
    log_info "Deployment complete! 🎉"
    echo ""
    echo "Access your platform:"
    echo "  - Frontend: https://app.datacendia.com (or http://localhost:5173)"
    echo "  - API: https://api.datacendia.com (or http://localhost:3001)"
    echo "  - Neo4j Browser: http://localhost:7474"
    echo ""
}

# Main deployment flow
main() {
    check_prerequisites
    build_images
    deploy_services
    sleep 10
    run_migrations
    health_check
    show_status
}

# Run
main
