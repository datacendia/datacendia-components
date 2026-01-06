# =============================================================================
# DATACENDIA SERVICE DEMO: Pre-Mortem Engine - Failure Analysis
# =============================================================================
#
# SCENARIO: Retail company planning Black Friday system upgrade. Pre-Mortem
#           Engine imagines it is 6 months later and the project failed
#           catastrophically - then works backward to identify failure modes.
#
# Pre-Mortem Engine: "Imagine it failed. Now tell me why."
#
# =============================================================================

param(
    [string]$ApiBase = "http://localhost:3001/api/v1",
    [switch]$DryRun
)

$ErrorActionPreference = "Continue"

function Write-Header {
    param([string]$text)
    Write-Host ""
    Write-Host ("=" * 80) -ForegroundColor DarkRed
    Write-Host "  $text" -ForegroundColor DarkRed
    Write-Host ("=" * 80) -ForegroundColor DarkRed
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Info {
    param([string]$text)
    Write-Host "    -> $text" -ForegroundColor Gray
}

function Write-Success {
    param([string]$text)
    Write-Host "    [OK] $text" -ForegroundColor Green
}

function Write-Failure {
    param([string]$text)
    Write-Host "    [FAIL] $text" -ForegroundColor Red
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$company = @{
    name = "MegaMart Retail"
    industry = "Retail"
    stores = 847
    onlineRevenue = 2400000000
    blackFridayRevenue = 180000000
}

$project = @{
    name = "Project Phoenix - E-Commerce Platform Upgrade"
    budget = 12000000
    timeline = "August 1 - November 15, 2026"
    goLive = "November 20, 2026 (5 days before Black Friday)"
    scope = @(
        "Migrate from legacy monolith to microservices",
        "New checkout flow with 1-click purchasing",
        "Real-time inventory sync across 847 stores",
        "Mobile app redesign",
        "New payment gateway integration"
    )
    team = @{
        internal = 45
        contractors = 28
        vendor = "CloudScale Solutions"
    }
    risks = @{
        timeline = "Aggressive - 3.5 months for major platform change"
        complexity = "High - touching all critical systems"
        timing = "Critical - Black Friday is non-negotiable deadline"
    }
}

$premortemSetup = @{
    futureDate = "December 15, 2026"
    scenario = "Project Phoenix launched on November 20. Black Friday was a disaster. The company lost an estimated 45M in revenue and suffered significant brand damage."
    prompt = "It is December 15, 2026. Project Phoenix failed catastrophically. Black Friday was the worst in company history. What went wrong?"
}

$failureModes = @(
    @{
        id = "FM-001"
        category = "Technical"
        title = "Database Connection Pool Exhaustion"
        probability = 0.72
        impact = "Critical"
        narrativeLines = @(
            "Under Black Friday load (15x normal), the new microservices architecture",
            "exhausted database connection pools. The legacy monolith had a single",
            "connection pool; the new system had 47 services each with their own pool,",
            "totaling 10x the connections. DBA warnings in September were deprioritized."
        )
        rootCause = "Architecture review skipped connection pooling strategy"
        warningSignals = @(
            "DBA raised concern in September architecture review",
            "Load testing only done at 3x normal traffic",
            "No connection pool monitoring in new observability stack"
        )
        prevention = "Implement centralized connection pooling (PgBouncer), load test at 20x, add connection monitoring alerts"
    },
    @{
        id = "FM-002"
        category = "Integration"
        title = "Payment Gateway Timeout Cascade"
        probability = 0.65
        impact = "Critical"
        narrativeLines = @(
            "New payment gateway had 30-second timeout. Under load, timeouts caused",
            "retries, which caused more load, which caused more timeouts. 67 percent",
            "of checkout attempts failed between 10am-2pm on Black Friday."
        )
        rootCause = "Timeout and retry configuration not tuned for high-volume scenarios"
        warningSignals = @(
            "Payment vendor warned about timeout settings in October",
            "No circuit breaker pattern implemented",
            "Retry logic used exponential backoff but no jitter"
        )
        prevention = "Implement circuit breakers, tune timeouts to 5s with 3 retries max, add jitter to retry logic"
    },
    @{
        id = "FM-003"
        category = "Process"
        title = "Rollback Plan Never Tested"
        probability = 0.58
        impact = "High"
        narrativeLines = @(
            "When issues emerged at 9am, team attempted rollback to legacy system.",
            "Rollback had never been tested end-to-end. Data migration meant legacy",
            "system could not read new order format. Rollback took 4 hours instead",
            "of planned 30 minutes."
        )
        rootCause = "Rollback was documented but never rehearsed"
        warningSignals = @(
            "Rollback drill scheduled for October, postponed twice",
            "Data migration was one-way by design",
            "No runbook for partial rollback scenarios"
        )
        prevention = "Mandatory rollback drill 2 weeks before go-live, maintain bidirectional data compatibility, create partial rollback runbooks"
    },
    @{
        id = "FM-004"
        category = "Organizational"
        title = "Vendor Knowledge Gap"
        probability = 0.61
        impact = "High"
        narrativeLines = @(
            "CloudScale Solutions lead architect left in October. Replacement had",
            "2 weeks to learn the system. Critical configuration knowledge was",
            "undocumented. During incident, no one knew how to tune the new caching layer."
        )
        rootCause = "Single point of failure in vendor team, no knowledge transfer"
        warningSignals = @(
            "Vendor architect resignation in October",
            "No shadowing period for replacement",
            "Configuration documentation marked TODO in wiki"
        )
        prevention = "Require vendor knowledge redundancy (2+ people), mandatory documentation review, internal team shadowing"
    },
    @{
        id = "FM-005"
        category = "Technical"
        title = "Inventory Sync Race Condition"
        probability = 0.54
        impact = "High"
        narrativeLines = @(
            "Real-time inventory sync had race condition. Same item could be sold",
            "twice before inventory decremented. 12,000 orders had to be cancelled",
            "post-purchase, generating massive customer service load and social media backlash."
        )
        rootCause = "Distributed transaction handling not properly implemented"
        warningSignals = @(
            "QA found intermittent inventory issues in staging",
            "Issue marked edge case and deprioritized",
            "No distributed tracing to debug inventory flow"
        )
        prevention = "Implement optimistic locking with version numbers, add distributed tracing, treat edge cases as blockers"
    },
    @{
        id = "FM-006"
        category = "Process"
        title = "Go/No-Go Decision Pressure"
        probability = 0.67
        impact = "Critical"
        narrativeLines = @(
            "November 15 go/no-go meeting had 14 open P1 bugs. CEO pressure to",
            "launch (we have told the board) overrode engineering concerns. CTO",
            "objection was noted but overruled. Post-mortem revealed 3 of those",
            "P1s caused Black Friday failures."
        )
        rootCause = "Business pressure overrode technical risk assessment"
        warningSignals = @(
            "14 P1 bugs open at go/no-go",
            "CTO formally objected in meeting",
            "No independent technical review of launch readiness"
        )
        prevention = "Establish launch criteria with hard gates, require independent technical sign-off, document and escalate overrides"
    }
)

$mitigationPlan = @(
    @{ failureMode = "FM-001"; action = "Implement PgBouncer connection pooling"; owner = "Platform Team"; deadline = "September 15"; effort = "Medium" },
    @{ failureMode = "FM-001"; action = "Load test at 20x normal traffic"; owner = "QA Team"; deadline = "October 30"; effort = "High" },
    @{ failureMode = "FM-002"; action = "Implement circuit breaker pattern"; owner = "Payments Team"; deadline = "September 30"; effort = "Medium" },
    @{ failureMode = "FM-003"; action = "Conduct full rollback drill"; owner = "DevOps"; deadline = "November 1"; effort = "High" },
    @{ failureMode = "FM-004"; action = "Require vendor knowledge redundancy"; owner = "Project Manager"; deadline = "Immediate"; effort = "Low" },
    @{ failureMode = "FM-005"; action = "Implement optimistic locking"; owner = "Inventory Team"; deadline = "October 15"; effort = "High" },
    @{ failureMode = "FM-006"; action = "Establish hard launch gates"; owner = "CTO"; deadline = "August 15"; effort = "Low" }
)

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkRed
Write-Host "                  PRE-MORTEM ENGINE - Failure Analysis" -ForegroundColor DarkRed
Write-Host "                 'Imagine it failed. Now tell me why.'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkRed
Write-Host ""
Write-Host "    SCENARIO: Black Friday Platform Upgrade" -ForegroundColor White
Write-Host "    Company: $($company.name)" -ForegroundColor Gray
Write-Host "    Project: $($project.name)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin pre-mortem analysis..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Project Context
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Project Context"

Write-Step "1.1" "Project Phoenix details..."

Write-Host ""
Write-Host "    $($project.name)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Budget: 12 million" -ForegroundColor White
Write-Host "    Timeline: $($project.timeline)" -ForegroundColor White
Write-Host "    Go-Live: $($project.goLive)" -ForegroundColor Yellow
Write-Host ""
Write-Host "    Scope:" -ForegroundColor White
foreach ($item in $project.scope) {
    Write-Host "      - $item" -ForegroundColor Gray
}
Write-Host ""
Write-Host "    Team: $($project.team.internal) internal + $($project.team.contractors) contractors" -ForegroundColor Gray
Write-Host "    Vendor: $($project.team.vendor)" -ForegroundColor Gray

Write-Host ""
Write-Host "    [!] RISK FACTORS:" -ForegroundColor Yellow
Write-Host "      Timeline: $($project.risks.timeline)" -ForegroundColor Red
Write-Host "      Complexity: $($project.risks.complexity)" -ForegroundColor Red
Write-Host "      Timing: $($project.risks.timing)" -ForegroundColor Red

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Pre-Mortem Setup
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Pre-Mortem Scenario"

Write-Step "2.1" "Setting the failure scenario..."

Write-Host ""
Write-Host "    +===============================================================+" -ForegroundColor Red
Write-Host "    |  TIME TRAVEL: It is now $($premortemSetup.futureDate)                    |" -ForegroundColor Red
Write-Host "    +===============================================================+" -ForegroundColor Red
Write-Host ""
Write-Host "    $($premortemSetup.scenario)" -ForegroundColor Yellow
Write-Host ""
Write-Host "    PROMPT TO THE TEAM:" -ForegroundColor White
Write-Host "    ""$($premortemSetup.prompt)""" -ForegroundColor Cyan

Start-Sleep -Seconds 2

# -----------------------------------------------------------------------------
# STEP 3: Failure Mode Analysis
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Failure Mode Identification"

Write-Step "3.1" "AI-generated failure narratives..."

foreach ($fm in $failureModes) {
    $impactColor = switch ($fm.impact) {
        "Critical" { "Red" }
        "High" { "Yellow" }
        "Medium" { "White" }
        default { "Gray" }
    }
    
    Write-Host ""
    Write-Host "    ===============================================================" -ForegroundColor DarkGray
    Write-Failure "$($fm.id): $($fm.title)"
    Write-Host "       Category: $($fm.category) | Probability: $([math]::Round($fm.probability * 100)) percent | Impact: " -NoNewline -ForegroundColor Gray
    Write-Host $fm.impact -ForegroundColor $impactColor
    Write-Host ""
    Write-Host "       WHAT HAPPENED:" -ForegroundColor White
    
    foreach ($line in $fm.narrativeLines) {
        Write-Host "       $line" -ForegroundColor Gray
    }
    
    Write-Host ""
    Write-Host "       ROOT CAUSE: $($fm.rootCause)" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "       WARNING SIGNALS (that were ignored):" -ForegroundColor Red
    foreach ($signal in $fm.warningSignals) {
        Write-Host "         [!] $signal" -ForegroundColor DarkYellow
    }
    
    Start-Sleep -Milliseconds 300
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Risk Matrix
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Risk Matrix"

Write-Step "4.1" "Failure modes by probability and impact..."

Write-Host ""
Write-Host "    PROBABILITY vs IMPACT MATRIX" -ForegroundColor White
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""

$critical = $failureModes | Where-Object { $_.impact -eq "Critical" } | Sort-Object -Property probability -Descending
$high = $failureModes | Where-Object { $_.impact -eq "High" } | Sort-Object -Property probability -Descending

Write-Host "    [CRITICAL IMPACT]:" -ForegroundColor Red
foreach ($fm in $critical) {
    $barLen = [math]::Round($fm.probability * 20)
    $bar = "#" * $barLen
    Write-Host "       $($fm.id) [$bar] $([math]::Round($fm.probability * 100)) percent - $($fm.title)" -ForegroundColor Red
}

Write-Host ""
Write-Host "    [HIGH IMPACT]:" -ForegroundColor Yellow
foreach ($fm in $high) {
    $barLen = [math]::Round($fm.probability * 20)
    $bar = "#" * $barLen
    Write-Host "       $($fm.id) [$bar] $([math]::Round($fm.probability * 100)) percent - $($fm.title)" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Mitigation Plan
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Prevention Actions"

Write-Step "5.1" "Actions to prevent each failure mode..."

Write-Host ""
foreach ($action in $mitigationPlan) {
    $fm = $failureModes | Where-Object { $_.id -eq $action.failureMode }
    
    Write-Host "    [OK] $($action.action)" -ForegroundColor Green
    Write-Host "       Prevents: $($fm.title)" -ForegroundColor Gray
    Write-Host "       Owner: $($action.owner) | Deadline: $($action.deadline) | Effort: $($action.effort)" -ForegroundColor DarkGray
    Write-Host ""
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "PRE-MORTEM COMPLETE"

Write-Host ""
Write-Host "    PRE-MORTEM ENGINE ANALYSIS SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    PROJECT: $($project.name)" -ForegroundColor Cyan
Write-Host "       Go-Live: $($project.goLive)" -ForegroundColor Gray
Write-Host "       Stakes: 180 million Black Friday revenue at risk" -ForegroundColor Gray
Write-Host ""
Write-Host "    FAILURE MODES IDENTIFIED: $($failureModes.Count)" -ForegroundColor White
Write-Host "       Critical Impact: $($critical.Count)" -ForegroundColor Red
Write-Host "       High Impact: $($high.Count)" -ForegroundColor Yellow
Write-Host ""
Write-Host "    TOP 3 RISKS BY PROBABILITY:" -ForegroundColor White
Write-Host "       1. FM-001: Database Connection Pool Exhaustion (72 percent)" -ForegroundColor Gray
Write-Host "       2. FM-006: Go/No-Go Decision Pressure (67 percent)" -ForegroundColor Gray
Write-Host "       3. FM-002: Payment Gateway Timeout Cascade (65 percent)" -ForegroundColor Gray
Write-Host ""
Write-Host "    PREVENTION ACTIONS: $($mitigationPlan.Count)" -ForegroundColor White
Write-Host "       Immediate: 1 (Vendor knowledge redundancy)" -ForegroundColor Gray
Write-Host "       Before September: 3" -ForegroundColor Gray
Write-Host "       Before October: 2" -ForegroundColor Gray
Write-Host "       Before November: 1" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    KEY INSIGHT:" -ForegroundColor Yellow
Write-Host "    The most dangerous failure mode (FM-006: Go/No-Go Pressure) is" -ForegroundColor Gray
Write-Host "    organizational, not technical. Establishing hard launch gates NOW" -ForegroundColor Gray
Write-Host "    prevents the scenario where business pressure overrides engineering." -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    Pre-Mortem Engine - The disaster that never happened." -ForegroundColor DarkRed
Write-Host ""
