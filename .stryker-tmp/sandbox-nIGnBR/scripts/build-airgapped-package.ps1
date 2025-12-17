# =============================================================================
# DATACENDIA - Air-Gapped Deployment Package Builder
# Run this on a machine WITH internet to create the deployment package
# =============================================================================

param(
    [string]$Version = "1.0.0",
    [string]$OutputDir = "./deployment-package",
    [switch]$IncludeModels,
    [string[]]$Models = @("llama3.1:8b")
)

$ErrorActionPreference = "Stop"

Write-Host "🚀 Building Datacendia Air-Gapped Deployment Package v$Version" -ForegroundColor Cyan
Write-Host "=" * 60

# Create output directories
$dirs = @("$OutputDir/images", "$OutputDir/config", "$OutputDir/scripts", "$OutputDir/docs")
foreach ($dir in $dirs) {
    New-Item -ItemType Directory -Force -Path $dir | Out-Null
}

# -----------------------------------------------------------------------------
# Step 1: Build Application Images
# -----------------------------------------------------------------------------
Write-Host "`n📦 Step 1: Building application images..." -ForegroundColor Yellow

Write-Host "  Building frontend..."
docker build -t "datacendia/frontend:$Version" -f Dockerfile .

Write-Host "  Building backend..."
if (Test-Path "./backend/Dockerfile") {
    docker build -t "datacendia/backend:$Version" ./backend
} else {
    Write-Host "  ⚠️  No backend Dockerfile found, skipping" -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# Step 2: Pull and Tag Dependencies
# -----------------------------------------------------------------------------
Write-Host "`n📥 Step 2: Pulling dependency images..." -ForegroundColor Yellow

$dependencies = @{
    "postgres:16-alpine" = "datacendia/postgres:16"
    "redis:7-alpine" = "datacendia/redis:7"
    "neo4j:5-community" = "datacendia/neo4j:5"
    "ollama/ollama:latest" = "datacendia/ollama:latest"
    "nginx:alpine" = "datacendia/nginx:latest"
}

foreach ($source in $dependencies.Keys) {
    $target = $dependencies[$source]
    Write-Host "  Pulling $source..."
    docker pull $source
    docker tag $source $target
}

# -----------------------------------------------------------------------------
# Step 3: Pre-load LLM Models (Optional)
# -----------------------------------------------------------------------------
if ($IncludeModels) {
    Write-Host "`n🧠 Step 3: Pre-loading LLM models..." -ForegroundColor Yellow
    
    # Start Ollama container
    $ollamaContainer = docker run -d -v ollama_airgapped:/root/.ollama ollama/ollama
    Start-Sleep -Seconds 5
    
    foreach ($model in $Models) {
        Write-Host "  Downloading $model (this may take a while)..."
        docker exec $ollamaContainer ollama pull $model
    }
    
    # Stop container
    docker stop $ollamaContainer | Out-Null
    docker rm $ollamaContainer | Out-Null
    
    # Export models volume
    Write-Host "  Exporting models..."
    docker run --rm -v ollama_airgapped:/data -v "${PWD}/${OutputDir}:/backup" alpine tar czf /backup/ollama-models.tar.gz -C /data .
}

# -----------------------------------------------------------------------------
# Step 4: Export Images
# -----------------------------------------------------------------------------
Write-Host "`n💾 Step 4: Exporting Docker images..." -ForegroundColor Yellow

$images = @(
    "datacendia/frontend:$Version",
    "datacendia/postgres:16",
    "datacendia/redis:7",
    "datacendia/neo4j:5",
    "datacendia/ollama:latest",
    "datacendia/nginx:latest"
)

# Add backend if it was built
$backendExists = docker images -q "datacendia/backend:$Version"
if ($backendExists) {
    $images += "datacendia/backend:$Version"
}

foreach ($image in $images) {
    $filename = $image -replace "[:/]", "-"
    Write-Host "  Exporting $image..."
    docker save $image | gzip > "$OutputDir/images/$filename.tar.gz"
}

# -----------------------------------------------------------------------------
# Step 5: Copy Configuration Files
# -----------------------------------------------------------------------------
Write-Host "`n📋 Step 5: Copying configuration files..." -ForegroundColor Yellow

# docker-compose for production
if (Test-Path "docker-compose.production.yml") {
    Copy-Item "docker-compose.production.yml" "$OutputDir/config/docker-compose.yml"
} elseif (Test-Path "docker-compose.prod.yml") {
    Copy-Item "docker-compose.prod.yml" "$OutputDir/config/docker-compose.yml"
}

# Environment template
if (Test-Path ".env.example") {
    Copy-Item ".env.example" "$OutputDir/config/.env.template"
}

# Nginx config
if (Test-Path "docker/nginx.conf") {
    Copy-Item "docker/nginx.conf" "$OutputDir/config/"
}

# Documentation
if (Test-Path "docs/AIRGAPPED_DEPLOYMENT.md") {
    Copy-Item "docs/AIRGAPPED_DEPLOYMENT.md" "$OutputDir/docs/INSTALLATION.md"
}

# -----------------------------------------------------------------------------
# Step 6: Create Installation Scripts
# -----------------------------------------------------------------------------
Write-Host "`n📝 Step 6: Creating installation scripts..." -ForegroundColor Yellow

# Linux install script
@"
#!/bin/bash
set -e

echo "🚀 Loading Datacendia Docker images..."

cd "\$(dirname "\$0")/../images"

for image in *.tar.gz; do
    echo "Loading \$image..."
    gunzip -c "\$image" | docker load
done

if [ -f "../ollama-models.tar.gz" ]; then
    echo "Restoring LLM models..."
    docker volume create ollama_models 2>/dev/null || true
    docker run --rm -v ollama_models:/data -v "\$(pwd)/..:/backup" alpine tar xzf /backup/ollama-models.tar.gz -C /data
fi

echo ""
echo "✅ All images loaded successfully!"
echo ""
docker images | grep datacendia
echo ""
echo "Next steps:"
echo "  1. cd ../config"
echo "  2. cp .env.template .env"
echo "  3. Edit .env with your settings"
echo "  4. docker compose up -d"
"@ | Out-File -Encoding utf8 "$OutputDir/scripts/install.sh"

# Windows install script  
@"
@echo off
echo Loading Datacendia Docker images...

cd /d "%~dp0..\images"

for %%f in (*.tar.gz) do (
    echo Loading %%f...
    docker load -i %%f
)

echo.
echo All images loaded successfully!
docker images | findstr datacendia

echo.
echo Next steps:
echo   1. cd ..\config
echo   2. copy .env.template .env
echo   3. Edit .env with your settings
echo   4. docker compose up -d
pause
"@ | Out-File -Encoding ascii "$OutputDir/scripts/install.bat"

# -----------------------------------------------------------------------------
# Step 7: Create Package Archive
# -----------------------------------------------------------------------------
Write-Host "`n📦 Step 7: Creating deployment archive..." -ForegroundColor Yellow

$archiveName = "datacendia-v$Version-airgapped.tar.gz"
Push-Location $OutputDir
tar czf "../$archiveName" *
Pop-Location

# Calculate sizes
$archiveSize = (Get-Item $archiveName).Length / 1GB
$folderSize = (Get-ChildItem $OutputDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB

# -----------------------------------------------------------------------------
# Summary
# -----------------------------------------------------------------------------
Write-Host "`n" + "=" * 60 -ForegroundColor Cyan
Write-Host "✅ Deployment Package Created Successfully!" -ForegroundColor Green
Write-Host "=" * 60 -ForegroundColor Cyan

Write-Host "`nPackage Contents:" -ForegroundColor Yellow
Get-ChildItem $OutputDir -Recurse -File | ForEach-Object {
    $relativePath = $_.FullName.Replace((Get-Item $OutputDir).FullName, "")
    $sizeStr = "{0:N2} MB" -f ($_.Length / 1MB)
    Write-Host "  $relativePath - $sizeStr"
}

Write-Host "`nOutput:" -ForegroundColor Yellow
Write-Host "  Folder: $OutputDir ({0:N2} GB)" -f $folderSize
Write-Host "  Archive: $archiveName ({0:N2} GB)" -f $archiveSize

Write-Host "`nTo deploy:" -ForegroundColor Yellow
Write-Host "  1. Transfer $archiveName to target server"
Write-Host "  2. Extract: tar xzf $archiveName"
Write-Host "  3. Run: ./scripts/install.sh (Linux) or scripts\install.bat (Windows)"
Write-Host "  4. Configure: Edit config/.env"
Write-Host "  5. Start: docker compose -f config/docker-compose.yml up -d"

Write-Host "`n🔒 Ready for air-gapped deployment!" -ForegroundColor Cyan
