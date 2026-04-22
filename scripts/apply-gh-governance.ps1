# Harden GitHub repo governance across all datacendia/* repos.
# Safe to re-run (idempotent).
# Usage:  powershell -File scripts/apply-gh-governance.ps1

$ErrorActionPreference = 'Continue'

$allRepos    = @("datacendia-components","datacendia-core","datacendia-marketing","decision-governance-infrastructure","pitchdecks")
$publicRepos = @("datacendia-core","datacendia-marketing","decision-governance-infrastructure")

# -----------------------------------------------------------------------------
# 1. Enable vulnerability alerts + automated security fixes (all repos)
# -----------------------------------------------------------------------------
Write-Host "======================================================================"
Write-Host "  STEP 1: Enable Dependabot alerts + automated security fixes"
Write-Host "======================================================================"
foreach ($r in $allRepos) {
    Write-Host ""
    Write-Host "--- $r ---"
    gh api -X PUT "/repos/datacendia/$r/vulnerability-alerts" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host "  [OK] vulnerability-alerts enabled" } else { Write-Host "  [WARN] vulnerability-alerts returned non-zero" }
    gh api -X PUT "/repos/datacendia/$r/automated-security-fixes" 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host "  [OK] automated-security-fixes enabled" } else { Write-Host "  [WARN] automated-security-fixes returned non-zero" }
}

# -----------------------------------------------------------------------------
# 2. Enable secret scanning + push protection (PUBLIC repos only - free tier)
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "======================================================================"
Write-Host "  STEP 2: Enable secret scanning on public repos"
Write-Host "======================================================================"
foreach ($r in $publicRepos) {
    Write-Host ""
    Write-Host "--- $r ---"
    $body = @{
        security_and_analysis = @{
            secret_scanning                 = @{ status = "enabled" }
            secret_scanning_push_protection = @{ status = "enabled" }
        }
    } | ConvertTo-Json -Depth 10 -Compress
    $tmp = New-TemporaryFile
    [System.IO.File]::WriteAllText($tmp.FullName, $body, (New-Object System.Text.UTF8Encoding $false))
    gh api -X PATCH "/repos/datacendia/$r" --input $tmp.FullName 2>&1 | Out-Null
    if ($LASTEXITCODE -eq 0) { Write-Host "  [OK] secret scanning enabled" } else { Write-Host "  [WARN] secret scanning PATCH returned non-zero" }
    Remove-Item $tmp.FullName -ErrorAction SilentlyContinue
}

# -----------------------------------------------------------------------------
# 3. Apply branch protection on default branch of each non-empty repo
# -----------------------------------------------------------------------------
Write-Host ""
Write-Host "======================================================================"
Write-Host "  STEP 3: Apply branch protection (full governance)"
Write-Host "======================================================================"

# Per-repo: branch + required status check contexts.
# Context name must match a job NAME that has already run at least once.
$protectionSpec = @(
    @{ repo = "datacendia-components";              branch = "main";   contexts = @("CI Status") }
    @{ repo = "datacendia-core";                    branch = "master"; contexts = @("CI Status") }
    @{ repo = "datacendia-marketing";               branch = "master"; contexts = @("Site Audit & Tests") }
    @{ repo = "decision-governance-infrastructure"; branch = "main";   contexts = @("Security") }
    @{ repo = "pitchdecks";                         branch = "main";   contexts = @() }
)

foreach ($spec in $protectionSpec) {
    Write-Host ""
    Write-Host "--- $($spec.repo)  (branch: $($spec.branch)) ---"

    # required_status_checks must be null or a real object (null = no checks required)
    if ($spec.contexts.Count -eq 0) {
        $rsc = $null
    } else {
        $rsc = @{ strict = $true; contexts = $spec.contexts }
    }

    $payload = @{
        required_status_checks         = $rsc
        enforce_admins                 = $false   # admin (owner) can override in emergencies
        required_pull_request_reviews  = @{
            dismiss_stale_reviews           = $true
            require_code_owner_reviews      = $false
            required_approving_review_count = 1
        }
        restrictions                   = $null     # no user/team push restrictions
        required_linear_history        = $true
        allow_force_pushes             = $false
        allow_deletions                = $false
        required_conversation_resolution = $true
        block_creations                = $false
    } | ConvertTo-Json -Depth 10

    $tmp = New-TemporaryFile
    [System.IO.File]::WriteAllText($tmp.FullName, $payload, (New-Object System.Text.UTF8Encoding $false))
    $out = gh api -X PUT "/repos/datacendia/$($spec.repo)/branches/$($spec.branch)/protection" --input $tmp.FullName 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "  [OK] branch protection applied"
        if ($rsc) { Write-Host "        required_status_checks: $($spec.contexts -join ', ')" }
        Write-Host "        required PR reviews: 1, linear history: true, force-push: blocked, deletion: blocked"
        Write-Host "        enforce_admins: false (owner can override)"
    } else {
        Write-Host "  [FAIL] branch protection:"
        Write-Host "        $out"
    }
    Remove-Item $tmp.FullName -ErrorAction SilentlyContinue
}

Write-Host ""
Write-Host "======================================================================"
Write-Host "  DONE."
Write-Host "======================================================================"
