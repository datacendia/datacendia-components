# =============================================================================
# DATACENDIA SERVICE DEMO: Decision Debt - Stuck Decision Tracker
# =============================================================================
#
# SCENARIO: Enterprise discovers they have 47 decisions stuck in limbo,
#           costing an estimated 2.3M per month in delayed value and
#           opportunity cost. Decision Debt surfaces and prioritizes them.
#
# Decision Debt: "The decisions you are not making are costing you money"
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

function Write-Debt {
    param([string]$text)
    Write-Host "    [DEBT] $text" -ForegroundColor Red
}

function Write-Stuck {
    param([string]$text)
    Write-Host "    [STUCK] $text" -ForegroundColor Yellow
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "GlobalTech Industries"
    employees = 8500
    departments = 12
    annualRevenue = 1200000000
}

$debtSummary = @{
    totalStuckDecisions = 47
    totalMonthlyDebt = 2340000
    avgDaysStuck = 67
    oldestDecision = 284
    departmentsAffected = 9
}

$stuckDecisions = @(
    @{
        id = "DD-001"
        title = "Cloud Migration Strategy"
        department = "IT"
        owner = "CTO"
        daysStuck = 156
        monthlyDebt = 450000
        blockers = @("Vendor selection deadlock", "Security team concerns unresolved", "Budget approval pending")
        urgency = "Critical"
        debtType = "Opportunity Cost"
        description = "Decision on AWS vs Azure vs GCP has stalled. Meanwhile, legacy infrastructure costs 450K per month more than cloud would."
    },
    @{
        id = "DD-002"
        title = "Sales Territory Restructuring"
        department = "Sales"
        owner = "VP Sales"
        daysStuck = 89
        monthlyDebt = 380000
        blockers = @("Regional managers disagree", "Compensation model unclear", "CRM data incomplete")
        urgency = "High"
        debtType = "Revenue Leakage"
        description = "Territory overlap causing deal conflicts. Estimated 380K per month in lost deals due to confusion."
    },
    @{
        id = "DD-003"
        title = "ERP System Upgrade"
        department = "Finance"
        owner = "CFO"
        daysStuck = 284
        monthlyDebt = 280000
        blockers = @("Scope creep concerns", "Implementation partner selection", "Change management resistance")
        urgency = "High"
        debtType = "Operational Inefficiency"
        description = "Running on ERP version 3 releases behind. Manual workarounds cost 15 FTE equivalent."
    },
    @{
        id = "DD-004"
        title = "Remote Work Policy Finalization"
        department = "HR"
        owner = "CHRO"
        daysStuck = 203
        monthlyDebt = 180000
        blockers = @("Executive disagreement", "Legal review pending", "Facilities impact unclear")
        urgency = "Medium"
        debtType = "Talent Attrition"
        description = "Uncertainty driving departures. Exit interviews cite unclear flexibility as factor in 23 percent of voluntary exits."
    },
    @{
        id = "DD-005"
        title = "Product Line Sunset Decision"
        department = "Product"
        owner = "CPO"
        daysStuck = 134
        monthlyDebt = 320000
        blockers = @("Customer migration plan incomplete", "Revenue impact disputed", "Support cost allocation unclear")
        urgency = "High"
        debtType = "Resource Drain"
        description = "Legacy product line consuming 18 percent of engineering resources for 4 percent of revenue."
    },
    @{
        id = "DD-006"
        title = "Data Center Consolidation"
        department = "IT"
        owner = "VP Infrastructure"
        daysStuck = 178
        monthlyDebt = 220000
        blockers = @("Disaster recovery concerns", "Network latency requirements", "Union negotiations")
        urgency = "Medium"
        debtType = "Operational Cost"
        description = "Running 3 data centers when 2 would suffice. Extra facility costs 220K per month."
    },
    @{
        id = "DD-007"
        title = "Marketing Attribution Model"
        department = "Marketing"
        owner = "CMO"
        daysStuck = 92
        monthlyDebt = 150000
        blockers = @("Sales and Marketing disagree on methodology", "Data quality issues", "Tool selection pending")
        urgency = "Medium"
        debtType = "Misallocated Spend"
        description = "Without attribution, estimated 150K per month spent on ineffective channels."
    },
    @{
        id = "DD-008"
        title = "Vendor Consolidation Initiative"
        department = "Procurement"
        owner = "CPO"
        daysStuck = 67
        monthlyDebt = 180000
        blockers = @("Department autonomy concerns", "Contract timing misalignment", "Savings estimates disputed")
        urgency = "Medium"
        debtType = "Procurement Inefficiency"
        description = "47 overlapping SaaS tools. Consolidation would save 180K per month."
    },
    @{
        id = "DD-009"
        title = "Customer Success Org Structure"
        department = "Customer Success"
        owner = "VP CS"
        daysStuck = 45
        monthlyDebt = 120000
        blockers = @("Headcount approval pending", "Role definitions unclear", "Metrics disagreement")
        urgency = "High"
        debtType = "Churn Risk"
        description = "Understaffed CS team. Each month of delay correlates with 0.3 percent additional churn."
    },
    @{
        id = "DD-010"
        title = "International Expansion Market Selection"
        department = "Strategy"
        owner = "CEO"
        daysStuck = 112
        monthlyDebt = 60000
        blockers = @("Market analysis incomplete", "Resource allocation unclear", "Risk appetite undefined")
        urgency = "Low"
        debtType = "Opportunity Cost"
        description = "Competitors entering target markets while we deliberate."
    }
)

$debtByDepartment = @(
    @{ department = "IT"; decisions = 2; monthlyDebt = 670000 },
    @{ department = "Sales"; decisions = 1; monthlyDebt = 380000 },
    @{ department = "Product"; decisions = 1; monthlyDebt = 320000 },
    @{ department = "Finance"; decisions = 1; monthlyDebt = 280000 },
    @{ department = "Procurement"; decisions = 1; monthlyDebt = 180000 },
    @{ department = "HR"; decisions = 1; monthlyDebt = 180000 },
    @{ department = "Marketing"; decisions = 1; monthlyDebt = 150000 },
    @{ department = "Customer Success"; decisions = 1; monthlyDebt = 120000 },
    @{ department = "Strategy"; decisions = 1; monthlyDebt = 60000 }
)

$blockerAnalysis = @(
    @{ blocker = "Stakeholder Disagreement"; count = 6; percentage = 38 },
    @{ blocker = "Missing Information/Analysis"; count = 5; percentage = 31 },
    @{ blocker = "Approval Bottleneck"; count = 4; percentage = 25 },
    @{ blocker = "Resource Constraints"; count = 3; percentage = 19 },
    @{ blocker = "External Dependencies"; count = 2; percentage = 13 }
)

$recommendations = @(
    @{ priority = 1; decision = "DD-001"; action = "Schedule 2-hour decision sprint with CTO, CISO, CFO"; rationale = "Highest monthly debt (450K). Vendor selection can be time-boxed."; expectedResolution = "1 week" },
    @{ priority = 2; decision = "DD-002"; action = "Bring to Council for multi-stakeholder deliberation"; rationale = "15 stakeholders need structured forum. Council can synthesize."; expectedResolution = "2 weeks" },
    @{ priority = 3; decision = "DD-005"; action = "Commission customer migration impact analysis"; rationale = "Blocker is disputed data. Get facts first."; expectedResolution = "3 weeks" },
    @{ priority = 4; decision = "DD-003"; action = "Break into 3 smaller decisions (scope, partner, timeline)"; rationale = "284 days stuck suggests scope too large. Decompose."; expectedResolution = "6 weeks (phased)" },
    @{ priority = 5; decision = "DD-004"; action = "CEO mandate with 30-day comment period"; rationale = "203 days of debate is enough. Leadership must decide."; expectedResolution = "30 days" }
)

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkYellow
Write-Host "                   DECISION DEBT - Stuck Decision Tracker" -ForegroundColor DarkYellow
Write-Host "         'The decisions you are not making are costing you money'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkYellow
Write-Host ""
Write-Host "    SCENARIO: Enterprise Decision Debt Audit" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Employees: $($organization.employees)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin decision debt analysis..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Debt Summary
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Decision Debt Overview"

Write-Step "1.1" "Scanning organization for stuck decisions..."

Write-Host ""
Write-Host "    +===============================================================+" -ForegroundColor Red
Write-Host "    |  [!] DECISION DEBT ALERT                                      |" -ForegroundColor Red
Write-Host "    +===============================================================+" -ForegroundColor Red
Write-Host "    |  Total Stuck Decisions:     " -NoNewline -ForegroundColor Red
Write-Host "$($debtSummary.totalStuckDecisions)" -NoNewline -ForegroundColor White
Write-Host "                              |" -ForegroundColor Red
Write-Host "    |  Monthly Debt:              " -NoNewline -ForegroundColor Red
Write-Host "2,340,000" -NoNewline -ForegroundColor Yellow
Write-Host "                       |" -ForegroundColor Red
Write-Host "    |  Average Days Stuck:        " -NoNewline -ForegroundColor Red
Write-Host "$($debtSummary.avgDaysStuck)" -NoNewline -ForegroundColor White
Write-Host "                              |" -ForegroundColor Red
Write-Host "    |  Oldest Decision:           " -NoNewline -ForegroundColor Red
Write-Host "$($debtSummary.oldestDecision) days" -NoNewline -ForegroundColor Red
Write-Host "                         |" -ForegroundColor Red
Write-Host "    |  Departments Affected:      " -NoNewline -ForegroundColor Red
Write-Host "$($debtSummary.departmentsAffected)" -NoNewline -ForegroundColor White
Write-Host "                              |" -ForegroundColor Red
Write-Host "    +===============================================================+" -ForegroundColor Red

Write-Host ""
Write-Debt "Annual decision debt: 28.1M"

Start-Sleep -Seconds 2

# -----------------------------------------------------------------------------
# STEP 2: Top Stuck Decisions
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Top 10 Stuck Decisions by Cost"

Write-Step "2.1" "Decisions ranked by monthly debt..."

$sortedDecisions = $stuckDecisions | Sort-Object -Property monthlyDebt -Descending

foreach ($decision in $sortedDecisions) {
    $urgencyColor = switch ($decision.urgency) {
        "Critical" { "Red" }
        "High" { "Yellow" }
        "Medium" { "White" }
        "Low" { "Gray" }
    }
    
    Write-Host ""
    Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Stuck "$($decision.id): $($decision.title)"
    Write-Host "       Department: $($decision.department) | Owner: $($decision.owner)" -ForegroundColor Gray
    Write-Host "       Days Stuck: " -NoNewline -ForegroundColor Gray
    $daysColor = if ($decision.daysStuck -gt 100) { "Red" } else { "Yellow" }
    Write-Host "$($decision.daysStuck)" -NoNewline -ForegroundColor $daysColor
    Write-Host " | Monthly Debt: " -NoNewline -ForegroundColor Gray
    Write-Host "$($decision.monthlyDebt)" -ForegroundColor Red
    Write-Host "       Urgency: " -NoNewline -ForegroundColor Gray
    Write-Host $decision.urgency -ForegroundColor $urgencyColor
    Write-Host "       Debt Type: $($decision.debtType)" -ForegroundColor DarkGray
    Write-Host ""
    Write-Host "       $($decision.description)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "       Blockers:" -ForegroundColor Yellow
    foreach ($blocker in $decision.blockers) {
        Write-Host "         - $blocker" -ForegroundColor DarkYellow
    }
    
    Start-Sleep -Milliseconds 200
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Debt by Department
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Decision Debt by Department"

Write-Step "3.1" "Department-level debt analysis..."

Write-Host ""
$maxDebt = 670000

foreach ($dept in ($debtByDepartment | Sort-Object -Property monthlyDebt -Descending)) {
    $barLength = [math]::Round(($dept.monthlyDebt / $maxDebt) * 30)
    $bar = "#" * $barLength
    
    Write-Host "    $($dept.department.PadRight(18))" -NoNewline -ForegroundColor White
    Write-Host $bar -NoNewline -ForegroundColor Red
    Write-Host " $($dept.monthlyDebt)" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Blocker Analysis
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Common Blockers"

Write-Step "4.1" "Why decisions get stuck..."

Write-Host ""
foreach ($blocker in $blockerAnalysis) {
    $barLen = [math]::Round($blocker.percentage / 3)
    $bar = "#" * $barLen
    Write-Host "    $($blocker.blocker.PadRight(30))" -NoNewline -ForegroundColor White
    Write-Host $bar -NoNewline -ForegroundColor Yellow
    Write-Host " $($blocker.count) decisions ($($blocker.percentage) percent)" -ForegroundColor Gray
}

Write-Host ""
Write-Host "    -> Top blocker: Stakeholder Disagreement (38 percent of stuck decisions)" -ForegroundColor Gray
Write-Host "    -> Recommendation: Use The Council for multi-stakeholder deliberation" -ForegroundColor Gray

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Recommended Actions
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Recommended Actions"

Write-Step "5.1" "Prioritized resolution plan..."

foreach ($rec in $recommendations) {
    $decision = $stuckDecisions | Where-Object { $_.id -eq $rec.decision }
    
    Write-Host ""
    Write-Host "    #$($rec.priority) - $($decision.title)" -ForegroundColor Cyan
    Write-Host "       Monthly Debt: $($decision.monthlyDebt)" -ForegroundColor Red
    Write-Host ""
    Write-Host "       ACTION: $($rec.action)" -ForegroundColor Green
    Write-Host "       Rationale: $($rec.rationale)" -ForegroundColor Gray
    Write-Host "       Expected Resolution: $($rec.expectedResolution)" -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "DECISION DEBT AUDIT COMPLETE"

Write-Host ""
Write-Host "    DECISION DEBT AUDIT SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    ORGANIZATION: $($organization.name)" -ForegroundColor Cyan
Write-Host ""
Write-Host "    DECISION DEBT TOTALS:" -ForegroundColor White
Write-Host "       Stuck Decisions: $($debtSummary.totalStuckDecisions)" -ForegroundColor Gray
Write-Host "       Monthly Cost: 2,340,000" -ForegroundColor Gray
Write-Host "       Annual Cost: 28.1M" -ForegroundColor Gray
Write-Host "       Oldest: $($debtSummary.oldestDecision) days (ERP Upgrade)" -ForegroundColor Gray
Write-Host ""
Write-Host "    TOP 3 DEBT DRIVERS:" -ForegroundColor White
Write-Host "       1. Cloud Migration Strategy - 450K per month (156 days)" -ForegroundColor Gray
Write-Host "       2. Sales Territory Restructuring - 380K per month (89 days)" -ForegroundColor Gray
Write-Host "       3. Product Line Sunset - 320K per month (134 days)" -ForegroundColor Gray
Write-Host ""
Write-Host "    ROOT CAUSES:" -ForegroundColor White
Write-Host "       38 percent - Stakeholder Disagreement" -ForegroundColor Gray
Write-Host "       31 percent - Missing Information" -ForegroundColor Gray
Write-Host "       25 percent - Approval Bottleneck" -ForegroundColor Gray
Write-Host ""
Write-Host "    QUICK WINS (resolve in less than 30 days):" -ForegroundColor White
Write-Host "       - Cloud Migration: Decision sprint -> 450K per month recovered" -ForegroundColor Gray
Write-Host "       - Sales Territories: Council deliberation -> 380K per month recovered" -ForegroundColor Gray
Write-Host "       - Customer Success: Headcount approval -> 120K per month recovered" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    30-DAY IMPACT:" -ForegroundColor Yellow
Write-Host "    Resolving top 3 decisions would recover 1.15M per month in decision debt." -ForegroundColor Gray
Write-Host "    That is 13.8M annually returned to the business." -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    Decision Debt - Indecision has a price. Now you can see it." -ForegroundColor DarkYellow
Write-Host ""
