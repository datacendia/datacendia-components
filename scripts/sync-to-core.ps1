# =============================================================================
# Datacendia Core ↔ Components Sync Script
# =============================================================================
# Syncs community-edition files from datacendia-components to datacendia-core.
# Run after making changes to shared files in the components repo.
#
# Usage: .\scripts\sync-to-core.ps1 [-DryRun] [-Verbose]
# =============================================================================

param(
    [switch]$DryRun,
    [string]$CorePath = "$PSScriptRoot\..\..\datacendia-core"
)

# -----------------------------------------------------------------------------
# DISABLED (2026-09-23). This script force-copies components files over core:
#   - 175 shared files are newer in core (CSRF, evidence, receipt, auth fixes)
#     and would be silently overwritten;
#   - it copied LICENSE, src/App.tsx and src/main.tsx, putting the proprietary
#     licence and headers into the Apache 2.0 repo.
# The open-core plan replaces it with "core upstream, Sovereign on top":
# changes land in datacendia-core and flow down by merge, never by copy.
# -----------------------------------------------------------------------------
Write-Host "sync-to-core.ps1 is disabled: it overwrites fixes made in datacendia-core and copies the proprietary LICENSE." -ForegroundColor Red
Write-Host "Make shared changes in datacendia-core instead (see the open-core plan)." -ForegroundColor Yellow
exit 1

$ComponentsPath = "$PSScriptRoot\.."

# Resolve absolute paths
$CorePath = (Resolve-Path $CorePath -ErrorAction SilentlyContinue)?.Path
$ComponentsPath = (Resolve-Path $ComponentsPath)?.Path

if (-not $CorePath -or -not (Test-Path $CorePath)) {
    Write-Host "ERROR: datacendia-core not found at expected path." -ForegroundColor Red
    Write-Host "Set -CorePath to the correct location." -ForegroundColor Yellow
    exit 1
}

Write-Host "=== Datacendia Core Sync ===" -ForegroundColor Cyan
Write-Host "Components: $ComponentsPath" -ForegroundColor DarkGray
Write-Host "Core:       $CorePath" -ForegroundColor DarkGray
if ($DryRun) { Write-Host "[DRY RUN — no files will be modified]" -ForegroundColor Yellow }
Write-Host ""

$synced = 0
$skipped = 0
$errors = 0

# ---------------------------------------------------------------------------
# Community frontend directories to sync (src/)
# ---------------------------------------------------------------------------
$frontendDirs = @(
    "src/components",
    "src/hooks",
    "src/lib",
    "src/stores",
    "src/utils",
    "src/pages/auth",
    "src/pages/cortex/council",
    "src/pages/cortex/governance",
    "src/pages/cortex/compliance",
    "src/pages/cortex/security",
    "src/pages/cortex/intelligence",
    "src/pages/cortex/sovereign",
    "src/pages/verticals"
)

# Community backend directories to sync
$backendCommunityDirs = @(
    "backend/src/config",
    "backend/src/middleware",
    "backend/src/utils",
    "backend/src/services/core",
    "backend/src/services/council",
    "backend/src/services/evidence",
    "backend/src/services/compliance",
    "backend/src/services/governance",
    "backend/src/services/cache",
    "backend/src/services/storage",
    "backend/src/services/vault",
    "backend/src/services/vectordb",
    "backend/src/services/llm",
    "backend/src/services/metrics",
    "backend/src/services/queue",
    "backend/src/services/streaming",
    "backend/src/services/verticals"
)

# Individual files to sync
$syncFiles = @(
    "src/vite-env.d.ts",
    "backend/src/routes/auth.ts",
    "backend/src/routes/council.ts",
    "backend/src/routes/decisions.ts",
    "backend/src/routes/deliberations.ts",
    "backend/src/routes/health.ts",
    "backend/src/services/DecisionService.ts",
    "backend/src/services/DeliberationService.ts",
    "backend/src/services/ollama.ts",
    "backend/src/services/email.ts",
    "CONTRIBUTING.md",
    "COMMUNITY.md",
    "CODE_OF_CONDUCT.md",
    "SECURITY.md",
    "CHANGELOG.md"
)

# ---------------------------------------------------------------------------
# Sync function
# ---------------------------------------------------------------------------
function Sync-File {
    param([string]$RelativePath)
    
    $src = Join-Path $ComponentsPath $RelativePath
    $dst = Join-Path $CorePath $RelativePath
    
    if (-not (Test-Path $src)) {
        Write-Host "  SKIP: $RelativePath (not in components)" -ForegroundColor DarkGray
        $script:skipped++
        return
    }
    
    # Create destination directory if needed
    $dstDir = Split-Path $dst -Parent
    if (-not (Test-Path $dstDir)) {
        if (-not $DryRun) {
            New-Item -ItemType Directory -Path $dstDir -Force | Out-Null
        }
    }
    
    # Check if files differ
    if (Test-Path $dst) {
        $srcHash = (Get-FileHash $src -Algorithm SHA256).Hash
        $dstHash = (Get-FileHash $dst -Algorithm SHA256).Hash
        if ($srcHash -eq $dstHash) {
            $script:skipped++
            return
        }
    }
    
    if ($DryRun) {
        Write-Host "  WOULD SYNC: $RelativePath" -ForegroundColor Yellow
    } else {
        try {
            Copy-Item $src $dst -Force
            Write-Host "  SYNCED: $RelativePath" -ForegroundColor Green
        } catch {
            Write-Host "  ERROR: $RelativePath — $_" -ForegroundColor Red
            $script:errors++
            return
        }
    }
    $script:synced++
}

function Sync-Directory {
    param([string]$RelativeDir)
    
    $srcDir = Join-Path $ComponentsPath $RelativeDir
    if (-not (Test-Path $srcDir)) {
        Write-Host "  SKIP DIR: $RelativeDir (not in components)" -ForegroundColor DarkGray
        return
    }
    
    Get-ChildItem $srcDir -Recurse -File | ForEach-Object {
        $relPath = $_.FullName.Replace($ComponentsPath, "").TrimStart("\", "/")
        Sync-File -RelativePath $relPath
    }
}

# ---------------------------------------------------------------------------
# Execute sync
# ---------------------------------------------------------------------------
Write-Host "Syncing frontend directories..." -ForegroundColor Cyan
foreach ($dir in $frontendDirs) {
    Sync-Directory -RelativeDir $dir
}

Write-Host ""
Write-Host "Syncing backend community directories..." -ForegroundColor Cyan
foreach ($dir in $backendCommunityDirs) {
    Sync-Directory -RelativeDir $dir
}

Write-Host ""
Write-Host "Syncing individual files..." -ForegroundColor Cyan
foreach ($file in $syncFiles) {
    Sync-File -RelativePath $file
}

# ---------------------------------------------------------------------------
# Summary
# ---------------------------------------------------------------------------
Write-Host ""
Write-Host "=== Sync Complete ===" -ForegroundColor Cyan
Write-Host "  Synced:  $synced files" -ForegroundColor Green
Write-Host "  Skipped: $skipped files (identical)" -ForegroundColor DarkGray
Write-Host "  Errors:  $errors files" -ForegroundColor $(if ($errors -gt 0) { "Red" } else { "DarkGray" })

if ($DryRun) {
    Write-Host ""
    Write-Host "This was a dry run. Run without -DryRun to apply changes." -ForegroundColor Yellow
} elseif ($synced -gt 0) {
    Write-Host ""
    Write-Host "Next: cd $CorePath && git add -A && git commit -m 'sync: update from datacendia-components'" -ForegroundColor Yellow
}
