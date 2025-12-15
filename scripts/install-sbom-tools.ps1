# =============================================================================
# SBOM TOOLS INSTALLATION SCRIPT (Windows PowerShell)
# Installs Syft, Grype, and Cosign for supply chain security
# =============================================================================

param(
    [switch]$UseScoop,
    [switch]$UseChoco
)

Write-Host "========================================" -ForegroundColor Green
Write-Host "Installing SBOM & Security Tools" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

# Check for admin rights
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

# =============================================================================
# OPTION 1: Install via Scoop (Recommended for Windows)
# =============================================================================
if ($UseScoop -or (-not $UseChoco)) {
    Write-Host "`nUsing Scoop package manager..." -ForegroundColor Yellow
    
    # Check if Scoop is installed
    if (-not (Get-Command scoop -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Scoop..." -ForegroundColor Cyan
        Set-ExecutionPolicy RemoteSigned -Scope CurrentUser -Force
        Invoke-RestMethod get.scoop.sh | Invoke-Expression
    }
    
    # Add security bucket
    Write-Host "`nAdding Scoop buckets..." -ForegroundColor Yellow
    scoop bucket add extras 2>$null
    scoop bucket add main 2>$null
    
    # Install tools
    Write-Host "`n[1/3] Installing Syft (SBOM generation)..." -ForegroundColor Cyan
    scoop install syft
    
    Write-Host "`n[2/3] Installing Grype (vulnerability scanning)..." -ForegroundColor Cyan
    scoop install grype
    
    Write-Host "`n[3/3] Installing Cosign (container signing)..." -ForegroundColor Cyan
    scoop install cosign
}

# =============================================================================
# OPTION 2: Install via Chocolatey
# =============================================================================
if ($UseChoco) {
    Write-Host "`nUsing Chocolatey package manager..." -ForegroundColor Yellow
    
    if (-not $isAdmin) {
        Write-Host "Chocolatey requires admin rights. Run as Administrator." -ForegroundColor Red
        exit 1
    }
    
    # Check if Chocolatey is installed
    if (-not (Get-Command choco -ErrorAction SilentlyContinue)) {
        Write-Host "Installing Chocolatey..." -ForegroundColor Cyan
        Set-ExecutionPolicy Bypass -Scope Process -Force
        [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072
        Invoke-Expression ((New-Object System.Net.WebClient).DownloadString('https://community.chocolatey.org/install.ps1'))
    }
    
    Write-Host "`n[1/3] Installing Syft..." -ForegroundColor Cyan
    choco install syft -y
    
    Write-Host "`n[2/3] Installing Grype..." -ForegroundColor Cyan
    choco install grype -y
    
    Write-Host "`n[3/3] Installing Cosign..." -ForegroundColor Cyan
    choco install cosign -y
}

# =============================================================================
# VERIFICATION
# =============================================================================
Write-Host "`n========================================" -ForegroundColor Green
Write-Host "Verifying installations..." -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green

$tools = @(
    @{ Name = "Syft"; Command = "syft"; Args = "version" },
    @{ Name = "Grype"; Command = "grype"; Args = "version" },
    @{ Name = "Cosign"; Command = "cosign"; Args = "version" }
)

$allInstalled = $true

foreach ($tool in $tools) {
    if (Get-Command $tool.Command -ErrorAction SilentlyContinue) {
        $version = & $tool.Command $tool.Args 2>&1 | Select-Object -First 1
        Write-Host "$($tool.Name): $version" -ForegroundColor Green
    } else {
        Write-Host "$($tool.Name): NOT INSTALLED" -ForegroundColor Red
        $allInstalled = $false
    }
}

if ($allInstalled) {
    Write-Host "`nAll SBOM tools installed successfully!" -ForegroundColor Green
    Write-Host "Run .\scripts\generate-sbom.ps1 to generate your SBOM." -ForegroundColor Cyan
} else {
    Write-Host "`nSome tools failed to install. Try manual installation:" -ForegroundColor Yellow
    Write-Host "  Syft:   https://github.com/anchore/syft/releases" -ForegroundColor White
    Write-Host "  Grype:  https://github.com/anchore/grype/releases" -ForegroundColor White
    Write-Host "  Cosign: https://github.com/sigstore/cosign/releases" -ForegroundColor White
}

# =============================================================================
# MANUAL INSTALLATION INSTRUCTIONS
# =============================================================================
Write-Host "`n========================================" -ForegroundColor Yellow
Write-Host "Manual Installation (Alternative)" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host @"

If automatic installation fails, download binaries directly:

SYFT:
  1. Go to: https://github.com/anchore/syft/releases
  2. Download: syft_*_windows_amd64.zip
  3. Extract to C:\Tools\syft
  4. Add C:\Tools\syft to PATH

GRYPE:
  1. Go to: https://github.com/anchore/grype/releases
  2. Download: grype_*_windows_amd64.zip
  3. Extract to C:\Tools\grype
  4. Add C:\Tools\grype to PATH

COSIGN:
  1. Go to: https://github.com/sigstore/cosign/releases
  2. Download: cosign-windows-amd64.exe
  3. Rename to cosign.exe
  4. Move to C:\Tools\cosign
  5. Add C:\Tools\cosign to PATH

"@ -ForegroundColor White
