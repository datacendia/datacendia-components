# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaChronos - Timeline Intelligence
# =============================================================================
#
# SCENARIO: Hospital System analyzing 5 years of operational decisions
#           to identify pivotal moments that shaped current state
#
# CendiaChronos answers: "What decisions got us here, and which ones mattered most?"
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
    Write-Host ("=" * 80) -ForegroundColor Blue
    Write-Host "  $text" -ForegroundColor Blue
    Write-Host ("=" * 80) -ForegroundColor Blue
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Pivotal {
    param([string]$text)
    Write-Host "    [PIVOTAL] $text" -ForegroundColor Magenta
}

function Write-Timeline {
    param([string]$text)
    Write-Host "    [TIME] $text" -ForegroundColor Cyan
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "Mercy Regional Health System"
    type = "Healthcare"
    hospitals = 5
    employees = 12000
    patientsAnnual = 450000
    analysisRange = "2021-01-01 to 2025-12-31"
}

$analysisRequest = @{
    requestId = "CHR-2026-0104-001"
    question = "What decisions over the past 5 years most significantly shaped our current financial and operational position?"
    scope = "All departments, all decision types"
    timeRange = "5 years"
    totalDecisions = 2847
}

$pivotalMoments = @(
    @{
        rank = 1
        date = "2022-03-15"
        title = "Epic EHR Implementation Decision"
        department = "IT"
        decisionMaker = "CIO Sarah Chen"
        originalChoice = "Proceed with Epic implementation despite 18-month timeline concerns"
        alternativeConsidered = "Delay 6 months for better preparation"
        impact = "Critical"
        impactScore = 0.94
        consequences = @(
            "350M investment over 3 years",
            "18 percent productivity drop during transition (6 months)",
            "Now: 23 percent improvement in clinical efficiency",
            "Enabled telehealth expansion during COVID surge"
        )
        counterfactual = "Delay would have left us on legacy system during COVID peak. Estimated 15M in additional costs, potential patient safety issues."
        lessonsLearned = "Large technology transitions require executive air cover and realistic timeline buffers."
    },
    @{
        rank = 2
        date = "2021-06-22"
        title = "Ambulatory Surgery Center Acquisition"
        department = "Strategy"
        decisionMaker = "CEO Michael Torres"
        originalChoice = "Acquire Westside ASC for 45M"
        alternativeConsidered = "Build new ASC from ground up (estimated 60M, 3 years)"
        impact = "High"
        impactScore = 0.87
        consequences = @(
            "Immediate 12M annual revenue addition",
            "Captured outpatient surgery market before competitors",
            "Integration challenges with existing surgical staff",
            "Now: 28M annual revenue, 22 percent margin"
        )
        counterfactual = "Building new would have missed the market window. Competitor acquired similar facility 8 months later."
        lessonsLearned = "Speed to market can outweigh cost optimization in competitive healthcare markets."
    },
    @{
        rank = 3
        date = "2023-09-08"
        title = "Nursing Staff Retention Program"
        department = "HR"
        decisionMaker = "CHRO Patricia Williams"
        originalChoice = "Implement 15 percent wage increase plus flexible scheduling"
        alternativeConsidered = "Standard 3 percent annual increase"
        impact = "High"
        impactScore = 0.82
        consequences = @(
            "22M annual cost increase",
            "Turnover dropped from 34 percent to 12 percent",
            "Avoided estimated 8M in agency nursing costs",
            "Patient satisfaction scores up 18 points"
        )
        counterfactual = "Without intervention, projected 45 percent turnover by 2024. Would have required 35M in agency staffing."
        lessonsLearned = "Proactive retention investment beats reactive recruitment costs."
    },
    @{
        rank = 4
        date = "2022-11-30"
        title = "Telehealth Platform Selection"
        department = "Digital Health"
        decisionMaker = "CMO Dr. James Liu"
        originalChoice = "Partner with Teladoc for enterprise telehealth"
        alternativeConsidered = "Build proprietary platform"
        impact = "Medium"
        impactScore = 0.71
        consequences = @(
            "6M annual licensing cost",
            "Launched in 90 days vs estimated 18 months for build",
            "Now handling 45,000 virtual visits per month",
            "Limited customization frustrating some specialties"
        )
        counterfactual = "Building in-house would have delayed launch past COVID telehealth adoption window. Estimated 25M in lost revenue."
        lessonsLearned = "Buy vs build decisions should weight time-to-market heavily in fast-moving markets."
    },
    @{
        rank = 5
        date = "2024-02-14"
        title = "Oncology Service Line Expansion"
        department = "Clinical Operations"
        decisionMaker = "COO David Okonkwo"
        originalChoice = "Expand oncology with 3 new physicians and linear accelerator"
        alternativeConsidered = "Maintain current capacity, refer complex cases"
        impact = "Medium"
        impactScore = 0.68
        consequences = @(
            "18M capital investment",
            "Reduced oncology referrals out by 67 percent",
            "Attracted 2 additional oncologists organically",
            "Now: Regional oncology destination, 15M incremental revenue"
        )
        counterfactual = "Without expansion, would have lost oncology market share to competitor who expanded 6 months later."
        lessonsLearned = "Clinical service line investments create flywheel effects for talent and patient acquisition."
    }
)

$patternAnalysis = @(
    @{ pattern = "Speed over perfection"; occurrences = 4; successRate = 0.85; description = "Decisions prioritizing speed to market outperformed delayed optimization" },
    @{ pattern = "Proactive investment"; occurrences = 3; successRate = 0.92; description = "Investing ahead of problems beat reactive spending" },
    @{ pattern = "Buy vs Build"; occurrences = 2; successRate = 0.78; description = "Acquisition and partnership decisions generally outperformed build decisions" },
    @{ pattern = "Talent retention"; occurrences = 2; successRate = 0.88; description = "Above-market compensation decisions showed strong ROI" }
)

$timelineStats = @{
    totalDecisions = 2847
    pivotalIdentified = 23
    topFiveImpact = "67 percent of current financial position attributable to top 5 decisions"
    averageDecisionAge = "2.3 years"
    mostActiveYear = "2022 (847 decisions)"
    departmentMostPivotal = "Strategy (7 pivotal decisions)"
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor Blue
Write-Host "                  CENDIACHRONOS - Timeline Intelligence" -ForegroundColor Blue
Write-Host "         'What decisions got us here, and which ones mattered most?'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "    SCENARIO: 5-Year Decision Analysis" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Analysis Period: $($organization.analysisRange)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin timeline analysis..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Analysis Request
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Analysis Request"

Write-Step "1.1" "Timeline analysis parameters..."

Write-Host ""
Write-Host "    Request: $($analysisRequest.requestId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Question: $($analysisRequest.question)" -ForegroundColor White
Write-Host "    Scope: $($analysisRequest.scope)" -ForegroundColor Gray
Write-Host "    Time Range: $($analysisRequest.timeRange)" -ForegroundColor Gray
Write-Host "    Total Decisions to Analyze: $($analysisRequest.totalDecisions)" -ForegroundColor Yellow

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Pivotal Moment Detection
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Pivotal Moment Detection"

Write-Step "2.1" "Identifying decisions with outsized impact..."

Write-Host ""
Write-Host "    Analyzing $($analysisRequest.totalDecisions) decisions..." -ForegroundColor Gray
Write-Host "    Calculating impact scores..." -ForegroundColor Gray
Write-Host "    Running counterfactual analysis..." -ForegroundColor Gray
Write-Host ""

foreach ($moment in $pivotalMoments) {
    $impactColor = switch ($moment.impact) {
        "Critical" { "Red" }
        "High" { "Yellow" }
        "Medium" { "White" }
        default { "Gray" }
    }
    
    Write-Host ""
    Write-Host "    ===============================================================" -ForegroundColor DarkGray
    Write-Pivotal "#$($moment.rank): $($moment.title)"
    Write-Host "       Date: $($moment.date) | Department: $($moment.department)" -ForegroundColor Gray
    Write-Host "       Decision Maker: $($moment.decisionMaker)" -ForegroundColor Gray
    Write-Host "       Impact: " -NoNewline -ForegroundColor Gray
    Write-Host $moment.impact -NoNewline -ForegroundColor $impactColor
    Write-Host " (Score: $([math]::Round($moment.impactScore * 100)) percent)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "       DECISION: $($moment.originalChoice)" -ForegroundColor White
    Write-Host "       ALTERNATIVE: $($moment.alternativeConsidered)" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "       CONSEQUENCES:" -ForegroundColor Yellow
    foreach ($consequence in $moment.consequences) {
        Write-Host "         - $consequence" -ForegroundColor Gray
    }
    Write-Host ""
    Write-Host "       COUNTERFACTUAL: $($moment.counterfactual)" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "       LESSON: $($moment.lessonsLearned)" -ForegroundColor Green
    
    Start-Sleep -Milliseconds 300
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Pattern Analysis
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Decision Pattern Analysis"

Write-Step "3.1" "Patterns identified across pivotal decisions..."

Write-Host ""
foreach ($pattern in $patternAnalysis) {
    $successColor = if ($pattern.successRate -ge 0.85) { "Green" } elseif ($pattern.successRate -ge 0.7) { "Yellow" } else { "Red" }
    
    Write-Host "    Pattern: $($pattern.pattern)" -ForegroundColor Cyan
    Write-Host "       Occurrences: $($pattern.occurrences) | Success Rate: " -NoNewline -ForegroundColor Gray
    Write-Host "$([math]::Round($pattern.successRate * 100)) percent" -ForegroundColor $successColor
    Write-Host "       $($pattern.description)" -ForegroundColor DarkGray
    Write-Host ""
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Timeline Statistics
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Timeline Statistics"

Write-Step "4.1" "5-year decision landscape..."

Write-Host ""
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  CHRONOS TIMELINE STATISTICS                              |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  Total Decisions Analyzed:    " -NoNewline -ForegroundColor DarkGray
Write-Host "$($timelineStats.totalDecisions)" -NoNewline -ForegroundColor White
Write-Host "                      |" -ForegroundColor DarkGray
Write-Host "    |  Pivotal Moments Identified:  " -NoNewline -ForegroundColor DarkGray
Write-Host "$($timelineStats.pivotalIdentified)" -NoNewline -ForegroundColor Magenta
Write-Host "                        |" -ForegroundColor DarkGray
Write-Host "    |  Top 5 Impact:                " -NoNewline -ForegroundColor DarkGray
Write-Host "67 percent" -NoNewline -ForegroundColor Yellow
Write-Host "                   |" -ForegroundColor DarkGray
Write-Host "    |  Most Active Year:            " -NoNewline -ForegroundColor DarkGray
Write-Host "2022" -NoNewline -ForegroundColor White
Write-Host "                       |" -ForegroundColor DarkGray
Write-Host "    |  Most Pivotal Department:     " -NoNewline -ForegroundColor DarkGray
Write-Host "Strategy" -NoNewline -ForegroundColor Cyan
Write-Host "                   |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "TIMELINE ANALYSIS COMPLETE"

Write-Host ""
Write-Host "    CENDIACHRONOS ANALYSIS SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    ORGANIZATION: $($organization.name)" -ForegroundColor Cyan
Write-Host "       Analysis Period: 5 years (2021-2025)" -ForegroundColor Gray
Write-Host "       Decisions Analyzed: $($analysisRequest.totalDecisions)" -ForegroundColor Gray
Write-Host ""
Write-Host "    TOP 5 PIVOTAL MOMENTS:" -ForegroundColor White
Write-Host "       1. Epic EHR Implementation (2022) - 94 percent impact score" -ForegroundColor Gray
Write-Host "       2. ASC Acquisition (2021) - 87 percent impact score" -ForegroundColor Gray
Write-Host "       3. Nursing Retention Program (2023) - 82 percent impact score" -ForegroundColor Gray
Write-Host "       4. Telehealth Platform (2022) - 71 percent impact score" -ForegroundColor Gray
Write-Host "       5. Oncology Expansion (2024) - 68 percent impact score" -ForegroundColor Gray
Write-Host ""
Write-Host "    KEY INSIGHT:" -ForegroundColor Yellow
Write-Host "    67 percent of current financial position is attributable to just" -ForegroundColor Gray
Write-Host "    5 decisions out of 2,847. Speed-to-market and proactive investment" -ForegroundColor Gray
Write-Host "    patterns showed highest success rates." -ForegroundColor Gray
Write-Host ""
Write-Host "    PATTERNS THAT WORKED:" -ForegroundColor White
Write-Host "       - Speed over perfection (85 percent success)" -ForegroundColor Green
Write-Host "       - Proactive investment (92 percent success)" -ForegroundColor Green
Write-Host "       - Buy vs Build favoring buy (78 percent success)" -ForegroundColor Green
Write-Host "       - Above-market talent retention (88 percent success)" -ForegroundColor Green
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaChronos - Your enterprise time machine." -ForegroundColor Blue
Write-Host ""
