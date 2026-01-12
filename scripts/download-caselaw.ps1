# Download Caselaw Bulk Data for Offline Legal Demos
# Source: Harvard Caselaw Access Project (https://static.case.law/)
#
# WARNING: Full dataset is ~400GB+. This script downloads a curated subset
# for legal demos (~20-30GB depending on selections).
#
# Usage:
#   .\download-caselaw.ps1 -Tier minimal    # ~2GB - Just federal supreme court + key reporters
#   .\download-caselaw.ps1 -Tier standard   # ~10GB - Federal + major state courts
#   .\download-caselaw.ps1 -Tier full       # ~30GB - All recommended reporters
#   .\download-caselaw.ps1 -Reporter us     # Download specific reporter

param(
    [ValidateSet("minimal", "standard", "full", "custom")]
    [string]$Tier = "minimal",
    
    [string]$Reporter = "",
    
    [string]$OutputDir = ".\data\caselaw",
    
    [switch]$MetadataOnly,
    
    [switch]$Resume
)

$BaseUrl = "https://static.case.law"

# Reporter tiers for different use cases
$MinimalReporters = @(
    "us"           # U.S. Supreme Court (~500MB)
    "f3d"          # Federal Reporter 3d - recent circuit cases (~1GB)
)

$StandardReporters = @(
    # Federal Courts
    "us"           # U.S. Supreme Court
    "f2d"          # Federal Reporter 2d
    "f3d"          # Federal Reporter 3d
    "f-supp-2d"    # Federal Supplement 2d
    "f-supp-3d"    # Federal Supplement 3d
    
    # California (trade secret cases)
    "cal-4th"      # California Supreme Court 4th
    "cal-5th"      # California Supreme Court 5th
    "cal-app-4th"  # California Appeals 4th
    "cal-app-5th"  # California Appeals 5th
    
    # Texas (employment cases)
    "tex"          # Texas Supreme Court
    "sw3d"         # South Western Reporter 3d
)

$FullReporters = @(
    # All Federal
    "us"
    "f"
    "f2d"
    "f3d"
    "f-supp"
    "f-supp-2d"
    "f-supp-3d"
    "f-appx"       # Federal Appendix (unpublished)
    "br"           # Bankruptcy Reporter
    "fed-cl"       # Federal Claims
    
    # California (complete)
    "cal"
    "cal-2d"
    "cal-3d"
    "cal-4th"
    "cal-5th"
    "cal-app"
    "cal-app-2d"
    "cal-app-3d"
    "cal-app-4th"
    "cal-app-5th"
    
    # New York
    "ny"
    "ny-2d"
    "ny3d"
    "ad2d"
    "ad3d"
    
    # Texas
    "tex"
    "tex-civ-app"
    "sw2d"
    "sw3d"
    
    # Delaware (corporate law)
    "del"
    "del-ch"
    
    # Regional Reporters
    "ne2d"
    "ne3d"
    "nw2d"
    "p2d"
    "p3d"
    "se2d"
    "so2d"
    "so3d"
)

function Download-Reporter {
    param(
        [string]$ReporterSlug,
        [string]$OutputPath
    )
    
    $reporterDir = Join-Path $OutputPath $ReporterSlug
    
    if (-not (Test-Path $reporterDir)) {
        New-Item -ItemType Directory -Path $reporterDir -Force | Out-Null
    }
    
    Write-Host "Downloading reporter: $ReporterSlug" -ForegroundColor Cyan
    
    # First, get the reporter's index page to find volumes
    $indexUrl = "$BaseUrl/$ReporterSlug/"
    
    try {
        $response = Invoke-WebRequest -Uri $indexUrl -UseBasicParsing
        $content = $response.Content
        
        # Parse volume links (they're directories like "1/", "2/", etc.)
        $volumePattern = 'href="(\d+)/"'
        $volumes = [regex]::Matches($content, $volumePattern) | ForEach-Object { $_.Groups[1].Value }
        
        Write-Host "  Found $($volumes.Count) volumes" -ForegroundColor Gray
        
        foreach ($volume in $volumes) {
            $volumeDir = Join-Path $reporterDir $volume
            
            if ($Resume -and (Test-Path $volumeDir) -and (Get-ChildItem $volumeDir -Filter "*.json" | Measure-Object).Count -gt 0) {
                Write-Host "  Skipping volume $volume (already downloaded)" -ForegroundColor DarkGray
                continue
            }
            
            if (-not (Test-Path $volumeDir)) {
                New-Item -ItemType Directory -Path $volumeDir -Force | Out-Null
            }
            
            # Download volume metadata
            $volumeMetaUrl = "$BaseUrl/$ReporterSlug/$volume/VolumeMetadata.json"
            $volumeMetaPath = Join-Path $volumeDir "VolumeMetadata.json"
            
            try {
                Invoke-WebRequest -Uri $volumeMetaUrl -OutFile $volumeMetaPath -UseBasicParsing
                Write-Host "  Volume $volume metadata downloaded" -ForegroundColor DarkGray
            }
            catch {
                Write-Host "  Volume $volume metadata not found" -ForegroundColor Yellow
            }
            
            if (-not $MetadataOnly) {
                # Get case files in this volume
                $volumeUrl = "$BaseUrl/$ReporterSlug/$volume/"
                $volumeResponse = Invoke-WebRequest -Uri $volumeUrl -UseBasicParsing
                
                # Parse case JSON files
                $casePattern = 'href="([^"]+\.json)"'
                $cases = [regex]::Matches($volumeResponse.Content, $casePattern) | 
                         ForEach-Object { $_.Groups[1].Value } |
                         Where-Object { $_ -ne "VolumeMetadata.json" }
                
                foreach ($caseFile in $cases) {
                    $caseUrl = "$BaseUrl/$ReporterSlug/$volume/$caseFile"
                    $casePath = Join-Path $volumeDir $caseFile
                    
                    if ($Resume -and (Test-Path $casePath)) {
                        continue
                    }
                    
                    try {
                        Invoke-WebRequest -Uri $caseUrl -OutFile $casePath -UseBasicParsing
                    }
                    catch {
                        Write-Host "    Failed to download: $caseFile" -ForegroundColor Red
                    }
                }
                
                Write-Host "  Volume $volume: $($cases.Count) cases" -ForegroundColor Gray
            }
        }
        
        Write-Host "  Completed: $ReporterSlug" -ForegroundColor Green
    }
    catch {
        Write-Host "  Error downloading $ReporterSlug : $_" -ForegroundColor Red
    }
}

function Download-Metadata {
    param([string]$OutputPath)
    
    Write-Host "Downloading metadata files..." -ForegroundColor Cyan
    
    $metadataFiles = @(
        "ReportersMetadata.json",
        "VolumesMetadata.json", 
        "JurisdictionsMetadata.json"
    )
    
    foreach ($file in $metadataFiles) {
        $url = "$BaseUrl/$file"
        $path = Join-Path $OutputPath $file
        
        try {
            Invoke-WebRequest -Uri $url -OutFile $path -UseBasicParsing
            Write-Host "  Downloaded: $file" -ForegroundColor Green
        }
        catch {
            Write-Host "  Failed: $file" -ForegroundColor Red
        }
    }
}

# Main execution
Write-Host "========================================" -ForegroundColor White
Write-Host "Caselaw Bulk Data Downloader" -ForegroundColor White
Write-Host "Source: Harvard Caselaw Access Project" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor White
Write-Host ""

# Create output directory
if (-not (Test-Path $OutputDir)) {
    New-Item -ItemType Directory -Path $OutputDir -Force | Out-Null
}

# Always download metadata first
Download-Metadata -OutputPath $OutputDir

if ($Reporter) {
    # Download specific reporter
    Download-Reporter -ReporterSlug $Reporter -OutputPath $OutputDir
}
else {
    # Download based on tier
    $reporters = switch ($Tier) {
        "minimal"  { $MinimalReporters }
        "standard" { $StandardReporters }
        "full"     { $FullReporters }
        default    { $MinimalReporters }
    }
    
    Write-Host ""
    Write-Host "Tier: $Tier" -ForegroundColor Yellow
    Write-Host "Reporters to download: $($reporters.Count)" -ForegroundColor Yellow
    Write-Host ""
    
    foreach ($reporter in $reporters) {
        Download-Reporter -ReporterSlug $reporter -OutputPath $OutputDir
        Write-Host ""
    }
}

Write-Host ""
Write-Host "========================================" -ForegroundColor White
Write-Host "Download complete!" -ForegroundColor Green
Write-Host "Data location: $OutputDir" -ForegroundColor Gray
Write-Host "========================================" -ForegroundColor White

# Show disk usage
$size = (Get-ChildItem $OutputDir -Recurse | Measure-Object -Property Length -Sum).Sum / 1GB
Write-Host "Total size: $([math]::Round($size, 2)) GB" -ForegroundColor Cyan
