# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaDissent - Protected Disagreement
# =============================================================================
#
# SCENARIO: Senior analyst files formal dissent against Council recommendation
#           to approve a risky vendor contract. System protects identity,
#           tracks outcome, and validates if dissent was correct.
#
# CendiaDissent: "Disagree safely. Be proven right later."
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
    Write-Host ("=" * 80) -ForegroundColor DarkYellow
    Write-Host "  $text" -ForegroundColor DarkYellow
    Write-Host ("=" * 80) -ForegroundColor DarkYellow
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Protected {
    param([string]$text)
    Write-Host "    [PROTECTED] $text" -ForegroundColor Green
}

function Write-Dissent {
    param([string]$text)
    Write-Host "    [DISSENT] $text" -ForegroundColor Yellow
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "TechVentures Inc"
    employees = 2400
    dissentsFiledYTD = 47
    dissentsVindicated = 12
}

$originalDecision = @{
    decisionId = "dlb-2025-0915-vendor-001"
    title = "CloudMatrix Vendor Contract Approval"
    date = "2025-09-15"
    outcome = "APPROVED"
    value = 4500000
    councilVote = "5-1 in favor"
    summary = "Council approved 3-year contract with CloudMatrix for cloud infrastructure services at 4.5M total value."
}

$dissentFiling = @{
    dissentId = "DIS-2025-0915-001"
    filedBy = "Anonymous (Protected)"
    actualFiler = "Sarah Chen, Senior Infrastructure Analyst"
    filedDate = "2025-09-15T16:45:00Z"
    targetDecision = "dlb-2025-0915-vendor-001"
    position = "OPPOSE"
    prediction = "Contract will result in significant cost overruns and service failures within 18 months"
}

$dissentEvidence = @(
    @{ id = "ev-001"; title = "CloudMatrix Financial Analysis"; description = "Shows declining revenue and increased debt load" },
    @{ id = "ev-002"; title = "Customer Reference Checks"; description = "3 of 5 references reported service outages" },
    @{ id = "ev-003"; title = "Competitive Pricing Analysis"; description = "CloudMatrix 23 percent above market rate" },
    @{ id = "ev-004"; title = "Technical Assessment"; description = "Architecture concerns flagged by engineering" }
)

$dissentArguments = @(
    "CloudMatrix has lost 2 major customers in the past 6 months due to reliability issues",
    "Their pricing is 23 percent above comparable vendors with better track records",
    "Financial statements show concerning debt-to-equity ratio of 3.2",
    "No contractual SLA guarantees for uptime - only best effort language",
    "Key technical staff have departed in recent months"
)

$protectionMeasures = @(
    @{ measure = "Identity Encryption"; status = "ACTIVE"; description = "Filer identity encrypted with time-locked key" },
    @{ measure = "Access Logging"; status = "ACTIVE"; description = "All access attempts to dissent record logged" },
    @{ measure = "Retaliation Monitoring"; status = "ACTIVE"; description = "HR actions against filer department monitored" },
    @{ measure = "Anonymous Channel"; status = "ACTIVE"; description = "Filer can add evidence without revealing identity" }
)

$outcomeTracking = @{
    trackingPeriod = "18 months"
    checkpoints = @(
        @{ date = "2025-12-15"; status = "COMPLETED"; finding = "First service outage - 4 hours downtime" },
        @{ date = "2026-03-15"; status = "COMPLETED"; finding = "Second outage - 8 hours. SLA dispute initiated" },
        @{ date = "2026-06-15"; status = "COMPLETED"; finding = "CloudMatrix announces restructuring" },
        @{ date = "2026-09-15"; status = "PENDING"; finding = "Contract renewal decision point" }
    )
    currentStatus = "DISSENT VALIDATED"
    actualOutcome = "CloudMatrix filed for bankruptcy protection. Contract terminated early with 1.2M in sunk costs."
}

$vindicationReport = @{
    reportId = "VIN-2026-0104-001"
    dissentId = "DIS-2025-0915-001"
    originalPrediction = "Cost overruns and service failures within 18 months"
    actualOutcome = "Vendor bankruptcy, 1.2M loss, 3 major outages"
    accuracy = 0.92
    lessonsLearned = @(
        "Financial health indicators should be weighted more heavily",
        "Customer reference checks should require minimum 5 positive references",
        "Contractual SLA language must include specific uptime guarantees"
    )
    policyChanges = @(
        "Added mandatory financial health score to vendor evaluation",
        "Increased reference check requirements from 3 to 5",
        "Created SLA template with minimum uptime requirements"
    )
}

$dissentTimeline = @(
    @{ date = "2025-09-15"; eventItem = "Council approves CloudMatrix contract"; actor = "The Council" },
    @{ date = "2025-09-15"; eventItem = "Dissent filed (protected)"; actor = "Anonymous" },
    @{ date = "2025-12-15"; eventItem = "First service outage recorded"; actor = "System" },
    @{ date = "2026-03-15"; eventItem = "Second outage, SLA dispute"; actor = "Legal" },
    @{ date = "2026-06-15"; eventItem = "Vendor restructuring announced"; actor = "CloudMatrix" },
    @{ date = "2026-01-04"; eventItem = "Dissent validated, identity revealed (with consent)"; actor = "CendiaDissent" }
)

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkYellow
Write-Host "                   CENDIADISSENT - Protected Disagreement" -ForegroundColor DarkYellow
Write-Host "                  'Disagree safely. Be proven right later.'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "    SCENARIO: Vendor Contract Dissent Validation" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Dissent ID: $($dissentFiling.dissentId)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to review dissent case..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Original Decision
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Original Council Decision"

Write-Step "1.1" "Decision that was challenged..."

Write-Host ""
Write-Host "    Decision: $($originalDecision.decisionId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Title: $($originalDecision.title)" -ForegroundColor White
Write-Host "    Date: $($originalDecision.date)" -ForegroundColor Gray
Write-Host "    Outcome: $($originalDecision.outcome)" -ForegroundColor Green
Write-Host "    Value: 4,500,000" -ForegroundColor Yellow
Write-Host "    Council Vote: $($originalDecision.councilVote)" -ForegroundColor Gray
Write-Host ""
Write-Host "    Summary: $($originalDecision.summary)" -ForegroundColor Gray

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Dissent Filing
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Dissent Filing"

Write-Step "2.1" "Protected dissent details..."

Write-Host ""
Write-Dissent "Dissent: $($dissentFiling.dissentId)"
Write-Host "       Filed By: $($dissentFiling.filedBy)" -ForegroundColor Cyan
Write-Host "       Filed Date: $($dissentFiling.filedDate)" -ForegroundColor Gray
Write-Host "       Target Decision: $($dissentFiling.targetDecision)" -ForegroundColor Gray
Write-Host "       Position: " -NoNewline -ForegroundColor Gray
Write-Host $dissentFiling.position -ForegroundColor Red
Write-Host ""
Write-Host "       Prediction: $($dissentFiling.prediction)" -ForegroundColor Yellow

Write-Step "2.2" "Dissent arguments..."

Write-Host ""
foreach ($arg in $dissentArguments) {
    Write-Host "    - $arg" -ForegroundColor Gray
}

Write-Step "2.3" "Supporting evidence..."

Write-Host ""
foreach ($ev in $dissentEvidence) {
    Write-Host "    [DOC] $($ev.title)" -ForegroundColor Cyan
    Write-Host "       $($ev.description)" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Protection Measures
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Identity Protection"

Write-Step "3.1" "Active protection measures..."

Write-Host ""
foreach ($protection in $protectionMeasures) {
    Write-Protected "$($protection.measure): $($protection.status)"
    Write-Host "       $($protection.description)" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Outcome Tracking
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Outcome Tracking"

Write-Step "4.1" "18-month tracking period results..."

Write-Host ""
foreach ($checkpoint in $outcomeTracking.checkpoints) {
    $statusColor = switch ($checkpoint.status) {
        "COMPLETED" { "Green" }
        "PENDING" { "Yellow" }
        default { "Gray" }
    }
    
    Write-Host "    [$($checkpoint.date)] " -NoNewline -ForegroundColor Cyan
    Write-Host $checkpoint.status -NoNewline -ForegroundColor $statusColor
    Write-Host ""
    Write-Host "       $($checkpoint.finding)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "    CURRENT STATUS: " -NoNewline -ForegroundColor White
Write-Host $outcomeTracking.currentStatus -ForegroundColor Green
Write-Host ""
Write-Host "    ACTUAL OUTCOME:" -ForegroundColor Yellow
Write-Host "    $($outcomeTracking.actualOutcome)" -ForegroundColor Red

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Timeline
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Complete Timeline"

Write-Step "5.1" "Event chronology..."

Write-Host ""
foreach ($timelineItem in $dissentTimeline) {
    Write-Host ""
    Write-Host "    [$($timelineItem.date)]" -ForegroundColor Cyan
    Write-Host "    $($timelineItem.eventItem)" -ForegroundColor White
    Write-Host "    Actor: $($timelineItem.actor)" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 6: Vindication Report
# -----------------------------------------------------------------------------
Write-Header "STEP 6: Vindication Report"

Write-Step "6.1" "Dissent validation analysis..."

Write-Host ""
Write-Host "    VINDICATION REPORT: $($vindicationReport.reportId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    Original Prediction:" -ForegroundColor White
Write-Host "    $($vindicationReport.originalPrediction)" -ForegroundColor Gray
Write-Host ""
Write-Host "    Actual Outcome:" -ForegroundColor White
Write-Host "    $($vindicationReport.actualOutcome)" -ForegroundColor Red
Write-Host ""
Write-Host "    Prediction Accuracy: " -NoNewline -ForegroundColor White
Write-Host "$([math]::Round($vindicationReport.accuracy * 100)) percent" -ForegroundColor Green

Write-Step "6.2" "Lessons learned..."

Write-Host ""
foreach ($lesson in $vindicationReport.lessonsLearned) {
    Write-Host "    - $lesson" -ForegroundColor Yellow
}

Write-Step "6.3" "Policy changes implemented..."

Write-Host ""
foreach ($change in $vindicationReport.policyChanges) {
    Write-Host "    [NEW] $change" -ForegroundColor Green
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "DISSENT CASE COMPLETE"

Write-Host ""
Write-Host "    CENDIADISSENT CASE SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    DISSENT: $($dissentFiling.dissentId)" -ForegroundColor Cyan
Write-Host "       Original Decision: CloudMatrix Contract (4.5M)" -ForegroundColor Gray
Write-Host "       Council Vote: 5-1 in favor" -ForegroundColor Gray
Write-Host "       Dissent Position: OPPOSE" -ForegroundColor Gray
Write-Host ""
Write-Host "    PROTECTION:" -ForegroundColor White
Write-Host "       Identity: Protected for 18 months" -ForegroundColor Green
Write-Host "       Retaliation Monitoring: Active" -ForegroundColor Green
Write-Host "       Access Logging: All attempts recorded" -ForegroundColor Green
Write-Host ""
Write-Host "    OUTCOME:" -ForegroundColor White
Write-Host "       Prediction: Cost overruns and failures within 18 months" -ForegroundColor Gray
Write-Host "       Reality: Vendor bankruptcy, 1.2M loss, 3 major outages" -ForegroundColor Red
Write-Host "       Accuracy: 92 percent" -ForegroundColor Green
Write-Host "       Status: DISSENT VALIDATED" -ForegroundColor Green
Write-Host ""
Write-Host "    IMPACT:" -ForegroundColor White
Write-Host "       Filer Identity: Revealed with consent (Sarah Chen)" -ForegroundColor Cyan
Write-Host "       Policy Changes: 3 new vendor evaluation requirements" -ForegroundColor Green
Write-Host "       Recognition: Dissenter acknowledged in lessons learned" -ForegroundColor Green
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    KEY INSIGHT:" -ForegroundColor Yellow
Write-Host "    The lone dissenting voice was right. Without CendiaDissent," -ForegroundColor Gray
Write-Host "    Sarah Chen might have stayed silent - and the organization" -ForegroundColor Gray
Write-Host "    would have learned nothing from this 1.2M mistake." -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaDissent - The minority opinion that saved millions." -ForegroundColor DarkYellow
Write-Host ""
