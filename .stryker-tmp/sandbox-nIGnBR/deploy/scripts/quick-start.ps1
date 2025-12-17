# ============================================
# Datacendia Platform - Quick Start (Windows PowerShell)
# ============================================
# Usage: .\quick-start.ps1

$ErrorActionPreference = "Stop"

Write-Host "🚀 Starting Datacendia Platform (Development Mode)..." -ForegroundColor Cyan

$ProjectRoot = Split-Path -Parent (Split-Path -Parent $PSScriptRoot)
Set-Location $ProjectRoot

# Check Docker
try {
    docker --version | Out-Null
    Write-Host "✅ Docker found" -ForegroundColor Green
} catch {
    Write-Host "❌ Docker not found. Please install Docker Desktop" -ForegroundColor Red
    exit 1
}

# Check .env
if (-not (Test-Path ".env")) {
    Write-Host "📝 Creating .env from template..." -ForegroundColor Yellow
    Copy-Item ".env.example" ".env"
    Write-Host "⚠️  Please review and update .env with your settings" -ForegroundColor Yellow
}

# Start infrastructure
Write-Host "🐳 Starting infrastructure services..." -ForegroundColor Cyan
docker compose up -d postgres redis neo4j

Write-Host "⏳ Waiting for databases to be ready..." -ForegroundColor Yellow
Start-Sleep -Seconds 15

# Check PostgreSQL
$attempts = 0
$maxAttempts = 30
while ($attempts -lt $maxAttempts) {
    try {
        docker compose exec -T postgres pg_isready -U datacendia -d datacendia 2>$null
        if ($LASTEXITCODE -eq 0) {
            Write-Host "✅ PostgreSQL ready" -ForegroundColor Green
            break
        }
    } catch {}
    
    $attempts++
    Write-Host "   Waiting for PostgreSQL... ($attempts/$maxAttempts)" -ForegroundColor Gray
    Start-Sleep -Seconds 2
}

if ($attempts -eq $maxAttempts) {
    Write-Host "❌ PostgreSQL failed to start" -ForegroundColor Red
    exit 1
}

# Run migrations
Write-Host "📦 Running database migrations..." -ForegroundColor Cyan
Set-Location "$ProjectRoot\backend"
npm run db:migrate
Set-Location $ProjectRoot

Write-Host ""
Write-Host "✅ Infrastructure ready!" -ForegroundColor Green
Write-Host ""
Write-Host "To start the development servers:" -ForegroundColor Cyan
Write-Host "  Terminal 1: cd backend; npm run dev" -ForegroundColor White
Write-Host "  Terminal 2: npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "Or use Docker for everything:" -ForegroundColor Cyan
Write-Host "  docker compose up" -ForegroundColor White
Write-Host ""
Write-Host "Access the platform:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  API:      http://localhost:3001" -ForegroundColor White
Write-Host "  Neo4j:    http://localhost:7474" -ForegroundColor White
Write-Host ""
