# =============================================================================
# SBOM GENERATION SCRIPT (Windows PowerShell)
# Supply Chain Attestation for Enterprise Buyers
# =============================================================================

param(
    [string]$OutputDir = ".\sbom-output",
    [string]$Version = "dev"
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "Datacendia SBOM & Security Pipeline" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Create output directory with absolute path
$OutputDir = Join-Path (Get-Location) "sbom-output"
New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null
Write-Host "Output directory: $OutputDir" -ForegroundColor Cyan

# Check for Syft
$syftAvailable = Get-Command syft -ErrorAction SilentlyContinue
if (-not $syftAvailable) {
    Write-Host "Syft not installed. Install from: https://github.com/anchore/syft" -ForegroundColor Red
    Write-Host "Or run: scoop install syft" -ForegroundColor Yellow
    exit 1
}

# Check for Grype
$grypeAvailable = Get-Command grype -ErrorAction SilentlyContinue
if (-not $grypeAvailable) {
    Write-Host "Grype not installed. Install from: https://github.com/anchore/grype" -ForegroundColor Red
    Write-Host "Or run: scoop install grype" -ForegroundColor Yellow
    exit 1
}

Write-Host "`n[1/4] Generating SBOM for backend..." -ForegroundColor Yellow

Push-Location backend
syft . --output spdx-json="$OutputDir\backend-sbom.spdx.json" --output cyclonedx-json="$OutputDir\backend-sbom.cdx.json"
Pop-Location

Write-Host "Backend SBOM generated" -ForegroundColor Green

Write-Host "`n[2/4] Generating SBOM for frontend..." -ForegroundColor Yellow

syft . --exclude "./backend/**" --output spdx-json="$OutputDir\frontend-sbom.spdx.json" --output cyclonedx-json="$OutputDir\frontend-sbom.cdx.json"

Write-Host "Frontend SBOM generated" -ForegroundColor Green

Write-Host "`n[3/4] Scanning for vulnerabilities..." -ForegroundColor Yellow

grype "sbom:$OutputDir\backend-sbom.spdx.json" --output table --file "$OutputDir\backend-vulnerabilities.txt"
grype "sbom:$OutputDir\frontend-sbom.spdx.json" --output table --file "$OutputDir\frontend-vulnerabilities.txt"
grype "sbom:$OutputDir\backend-sbom.spdx.json" --output json --file "$OutputDir\vulnerabilities-report.json"

Write-Host "Vulnerability scan complete" -ForegroundColor Green

Write-Host "`n[4/4] Generating summary report..." -ForegroundColor Yellow

$report = @"
# Datacendia SBOM Report
Generated: $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
Version: $Version

## Files Generated
- backend-sbom.spdx.json (SPDX format)
- backend-sbom.cdx.json (CycloneDX format)
- frontend-sbom.spdx.json (SPDX format)
- frontend-sbom.cdx.json (CycloneDX format)
- vulnerabilities-report.json

## Usage
Share these SBOM files with enterprise auditors for:
- Software composition analysis
- License compliance verification
- Vulnerability assessment
- Supply chain risk evaluation
"@

$report | Out-File "$OutputDir\README.md"

Write-Host "`n========================================" -ForegroundColor Green
Write-Host "SBOM Generation Complete" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host "`nOutput directory: $OutputDir" -ForegroundColor Cyan
Get-ChildItem $OutputDir | Format-Table Name, Length, LastWriteTime
