# =============================================================================
# DATACENDIA ENTERPRISE SETUP SCRIPT (Windows PowerShell)
# Installs all dependencies for enterprise features
# =============================================================================

$ErrorActionPreference = "Stop"

function Write-Info { param($Message) Write-Host "[INFO] $Message" -ForegroundColor Green }
function Write-Warn { param($Message) Write-Host "[WARN] $Message" -ForegroundColor Yellow }
function Write-Section { param($Message) Write-Host "`n========== $Message ==========`n" -ForegroundColor Cyan }

$RootDir = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
if (-not $RootDir) { $RootDir = Get-Location }

# =============================================================================
# FRONTEND DEPENDENCIES
# =============================================================================

function Install-FrontendDeps {
    Write-Section "Installing Frontend Dependencies"
    
    Set-Location $RootDir
    
    Write-Info "Installing Playwright for E2E testing..."
    npm install -D @playwright/test
    npx playwright install chromium
    
    Write-Info "Frontend dependencies installed"
}

# =============================================================================
# BACKEND DEPENDENCIES
# =============================================================================

function Install-BackendDeps {
    Write-Section "Installing Backend Dependencies"
    
    Set-Location "$RootDir\backend"
    
    Write-Info "Installing OpenTelemetry packages..."
    npm install `
        @opentelemetry/sdk-node `
        @opentelemetry/auto-instrumentations-node `
        @opentelemetry/exporter-trace-otlp-http `
        @opentelemetry/exporter-metrics-otlp-http `
        @opentelemetry/exporter-prometheus `
        @opentelemetry/resources `
        @opentelemetry/semantic-conventions `
        @opentelemetry/sdk-metrics `
        @opentelemetry/sdk-trace-base `
        @opentelemetry/api
    
    Write-Info "Installing testing packages..."
    npm install -D jest @types/jest ts-jest supertest @types/supertest
    
    Write-Info "Installing security packages..."
    npm install helmet cors express-rate-limit
    
    Write-Info "Backend dependencies installed"
}

# =============================================================================
# DOCKER SETUP
# =============================================================================

function Setup-Docker {
    Write-Section "Setting Up Docker Environment"
    
    Set-Location $RootDir
    
    if (-not (Test-Path ".env")) {
        Write-Info "Creating .env file from template..."
        @"
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
"@ | Out-File -FilePath ".env" -Encoding UTF8
        
        Write-Warn "Please update .env with secure passwords before running in production!"
    }
    
    Write-Info "Docker environment configured"
}

# =============================================================================
# OBSERVABILITY SETUP
# =============================================================================

function Setup-Observability {
    Write-Section "Setting Up Observability Stack"
    
    Set-Location $RootDir
    
    # Create config directories
    New-Item -ItemType Directory -Force -Path "config\grafana\dashboards" | Out-Null
    New-Item -ItemType Directory -Force -Path "config\grafana\datasources" | Out-Null
    
    # Create Prometheus config
    @"
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
"@ | Out-File -FilePath "config\prometheus.yml" -Encoding UTF8
    
    # Create OpenTelemetry Collector config
    @"
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
"@ | Out-File -FilePath "config\otel-collector.yaml" -Encoding UTF8
    
    Write-Info "Observability stack configured"
}

# =============================================================================
# MAIN
# =============================================================================

function Main {
    Write-Section "DATACENDIA ENTERPRISE SETUP"
    
    Install-FrontendDeps
    Install-BackendDeps
    Setup-Docker
    Setup-Observability
    
    Write-Section "SETUP COMPLETE"
    
    Write-Host ""
    Write-Info "Next steps:"
    Write-Host "  1. Update .env with secure passwords"
    Write-Host "  2. Run: docker-compose -f docker-compose.production.yml up -d"
    Write-Host "  3. Run migrations: npm run db:migrate"
    Write-Host "  4. Run tests: npm run test"
    Write-Host "  5. Run E2E tests: npx playwright test"
    Write-Host "  6. Run load tests: k6 run tests/load/k6-load-test.js"
    Write-Host ""
}

Main
