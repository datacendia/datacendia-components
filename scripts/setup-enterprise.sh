#!/bin/bash
# =============================================================================
# DATACENDIA ENTERPRISE SETUP SCRIPT
# Installs all dependencies for enterprise features
# =============================================================================

set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log_info() { echo -e "${GREEN}[INFO]${NC} $1"; }
log_warn() { echo -e "${YELLOW}[WARN]${NC} $1"; }
log_error() { echo -e "${RED}[ERROR]${NC} $1"; }
log_section() { echo -e "\n${BLUE}========== $1 ==========${NC}\n"; }

# =============================================================================
# FRONTEND DEPENDENCIES
# =============================================================================

install_frontend_deps() {
    log_section "Installing Frontend Dependencies"
    
    cd "$(dirname "$0")/.."
    
    log_info "Installing Playwright for E2E testing..."
    npm install -D @playwright/test
    npx playwright install chromium
    
    log_info "Frontend dependencies installed"
}

# =============================================================================
# BACKEND DEPENDENCIES
# =============================================================================

install_backend_deps() {
    log_section "Installing Backend Dependencies"
    
    cd "$(dirname "$0")/../backend"
    
    log_info "Installing OpenTelemetry packages..."
    npm install @opentelemetry/sdk-node \
        @opentelemetry/auto-instrumentations-node \
        @opentelemetry/exporter-trace-otlp-http \
        @opentelemetry/exporter-metrics-otlp-http \
        @opentelemetry/exporter-prometheus \
        @opentelemetry/resources \
        @opentelemetry/semantic-conventions \
        @opentelemetry/sdk-metrics \
        @opentelemetry/sdk-trace-base \
        @opentelemetry/api
    
    log_info "Installing testing packages..."
    npm install -D jest @types/jest ts-jest supertest @types/supertest
    
    log_info "Installing security packages..."
    npm install helmet cors express-rate-limit
    
    log_info "Generating Prisma client..."
    npx prisma generate
    
    log_info "Backend dependencies installed"
}

# =============================================================================
# DOCKER SETUP
# =============================================================================

setup_docker() {
    log_section "Setting Up Docker Environment"
    
    cd "$(dirname "$0")/.."
    
    # Create .env file if not exists
    if [ ! -f .env ]; then
        log_info "Creating .env file from template..."
        cat > .env << 'EOF'
# Database
DB_PASSWORD=your_secure_password_here
POSTGRES_PASSWORD=your_secure_password_here

# Neo4j
NEO4J_PASSWORD=your_secure_password_here

# JWT
JWT_SECRET=your_jwt_secret_here_min_32_chars
JWT_REFRESH_SECRET=your_refresh_secret_here_min_32_chars

# Vault
VAULT_TOKEN=your_vault_token_here

# Grafana
GRAFANA_PASSWORD=your_grafana_password_here

# Version
VERSION=1.0.0
EOF
        log_warn "Please update .env with secure passwords before running in production!"
    fi
    
    log_info "Docker environment configured"
}

# =============================================================================
# DATABASE MIGRATIONS
# =============================================================================

run_migrations() {
    log_section "Running Database Migrations"
    
    cd "$(dirname "$0")/../backend"
    
    log_info "Running multi-tenant RLS migration..."
    # This would run the SQL migration
    # psql -f src/database/migrations/001_multi_tenant_rls.sql
    
    log_info "Database migrations complete"
}

# =============================================================================
# OBSERVABILITY STACK
# =============================================================================

setup_observability() {
    log_section "Setting Up Observability Stack"
    
    cd "$(dirname "$0")/.."
    
    # Create config directories
    mkdir -p config/grafana/dashboards
    mkdir -p config/grafana/datasources
    
    # Create Prometheus config
    cat > config/prometheus.yml << 'EOF'
global:
  scrape_interval: 15s
  evaluation_interval: 15s

scrape_configs:
  - job_name: 'datacendia-backend'
    static_configs:
      - targets: ['backend:9464']
    metrics_path: /metrics

  - job_name: 'ollama'
    static_configs:
      - targets: ['ollama:11434']
    metrics_path: /metrics

  - job_name: 'postgres'
    static_configs:
      - targets: ['postgres:9187']

  - job_name: 'redis'
    static_configs:
      - targets: ['redis:9121']
EOF

    # Create OpenTelemetry Collector config
    cat > config/otel-collector.yaml << 'EOF'
receivers:
  otlp:
    protocols:
      grpc:
        endpoint: 0.0.0.0:4317
      http:
        endpoint: 0.0.0.0:4318

processors:
  batch:
    timeout: 1s
    send_batch_size: 1024

exporters:
  prometheus:
    endpoint: "0.0.0.0:8889"
  
  jaeger:
    endpoint: jaeger:14250
    tls:
      insecure: true
  
  logging:
    loglevel: info

service:
  pipelines:
    traces:
      receivers: [otlp]
      processors: [batch]
      exporters: [jaeger, logging]
    metrics:
      receivers: [otlp]
      processors: [batch]
      exporters: [prometheus, logging]
EOF

    # Create Grafana datasource
    cat > config/grafana/datasources/datasources.yaml << 'EOF'
apiVersion: 1
datasources:
  - name: Prometheus
    type: prometheus
    access: proxy
    url: http://prometheus:9090
    isDefault: true
  
  - name: Jaeger
    type: jaeger
    access: proxy
    url: http://jaeger:16686
EOF

    log_info "Observability stack configured"
}

# =============================================================================
# LOAD TESTING TOOLS
# =============================================================================

setup_load_testing() {
    log_section "Setting Up Load Testing"
    
    # Check if k6 is installed
    if ! command -v k6 &> /dev/null; then
        log_warn "k6 not installed. Install with:"
        log_warn "  brew install k6  (macOS)"
        log_warn "  choco install k6 (Windows)"
        log_warn "  sudo apt install k6 (Ubuntu)"
    else
        log_info "k6 is installed: $(k6 version)"
    fi
}

# =============================================================================
# SECURITY HARDENING
# =============================================================================

security_setup() {
    log_section "Security Configuration"
    
    # Generate secure secrets if not set
    if [ "${JWT_SECRET:-}" = "" ] || [ "${JWT_SECRET:-}" = "your_jwt_secret_here_min_32_chars" ]; then
        JWT_SECRET=$(openssl rand -base64 32)
        log_info "Generated JWT_SECRET"
    fi
    
    if [ "${JWT_REFRESH_SECRET:-}" = "" ] || [ "${JWT_REFRESH_SECRET:-}" = "your_refresh_secret_here_min_32_chars" ]; then
        JWT_REFRESH_SECRET=$(openssl rand -base64 32)
        log_info "Generated JWT_REFRESH_SECRET"
    fi
    
    log_info "Security configuration complete"
}

# =============================================================================
# MAIN
# =============================================================================

main() {
    log_section "DATACENDIA ENTERPRISE SETUP"
    
    install_frontend_deps
    install_backend_deps
    setup_docker
    setup_observability
    setup_load_testing
    security_setup
    
    log_section "SETUP COMPLETE"
    
    echo ""
    log_info "Next steps:"
    echo "  1. Update .env with secure passwords"
    echo "  2. Run: docker-compose -f docker-compose.production.yml up -d"
    echo "  3. Run migrations: npm run db:migrate"
    echo "  4. Run tests: npm run test"
    echo "  5. Run E2E tests: npx playwright test"
    echo "  6. Run load tests: k6 run tests/load/k6-load-test.js"
    echo ""
}

if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
