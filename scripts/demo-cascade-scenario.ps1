# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaCascade - Ripple Effect Analysis
# =============================================================================
#
# SCENARIO: Manufacturing company considering plant closure. CendiaCascade
#           predicts 47 downstream effects across supply chain, workforce,
#           community, and financials before the decision is finalized.
#
# CendiaCascade: "See the butterfly effects before you flap your wings"
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
    Write-Host ("=" * 80) -ForegroundColor DarkCyan
    Write-Host "  $text" -ForegroundColor DarkCyan
    Write-Host ("=" * 80) -ForegroundColor DarkCyan
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Ripple {
    param([string]$text)
    Write-Host "    [RIPPLE] $text" -ForegroundColor Cyan
}

function Write-Impact {
    param([string]$text)
    Write-Host "    [IMPACT] $text" -ForegroundColor Yellow
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "Midwest Manufacturing Corp"
    industry = "Industrial Equipment"
    employees = 4200
    plants = 6
    annualRevenue = 890000000
}

$proposedChange = @{
    changeId = "CAS-2026-0104-001"
    title = "Closure of Springfield Plant"
    type = "Facility Closure"
    proposedBy = "CFO"
    proposedDate = "2026-01-04"
    targetDate = "2026-06-30"
    rationale = "Springfield plant operating at 47 percent capacity. Consolidation to remaining 5 plants projected to save 12M annually."
    affectedEmployees = 340
    estimatedSavings = 12000000
}

$rippleEffects = @(
    # First Order - Direct Effects
    @{ order = 1; category = "Workforce"; effect = "340 employees displaced"; probability = 1.0; impact = "High"; financialImpact = -8500000; description = "Severance, outplacement, unemployment costs" },
    @{ order = 1; category = "Operations"; effect = "Production capacity reduced 18 percent"; probability = 1.0; impact = "Medium"; financialImpact = 0; description = "Must redistribute to other plants" },
    @{ order = 1; category = "Real Estate"; effect = "Springfield facility vacant"; probability = 1.0; impact = "Low"; financialImpact = -2400000; description = "Carrying costs until sale, estimated 18 months" },
    
    # Second Order - Indirect Effects
    @{ order = 2; category = "Supply Chain"; effect = "3 local suppliers lose primary customer"; probability = 0.95; impact = "Medium"; financialImpact = 0; description = "May affect supplier viability and pricing" },
    @{ order = 2; category = "Workforce"; effect = "Key engineers relocate to competitors"; probability = 0.72; impact = "High"; financialImpact = -1800000; description = "Loss of institutional knowledge, recruitment costs" },
    @{ order = 2; category = "Customer"; effect = "Regional customers concerned about service"; probability = 0.68; impact = "Medium"; financialImpact = -3200000; description = "Potential loss of 4 accounts representing 3.2M revenue" },
    @{ order = 2; category = "Operations"; effect = "Other plants require overtime during transition"; probability = 0.88; impact = "Medium"; financialImpact = -1400000; description = "6-month overtime surge at receiving plants" },
    
    # Third Order - Systemic Effects
    @{ order = 3; category = "Community"; effect = "Springfield tax base reduced"; probability = 0.90; impact = "Low"; financialImpact = 0; description = "May affect future community relations and permits" },
    @{ order = 3; category = "Reputation"; effect = "Negative press coverage"; probability = 0.65; impact = "Medium"; financialImpact = -500000; description = "PR management and potential customer perception impact" },
    @{ order = 3; category = "Workforce"; effect = "Morale impact at remaining plants"; probability = 0.78; impact = "Medium"; financialImpact = -900000; description = "Productivity dip, increased turnover at other locations" },
    @{ order = 3; category = "Regulatory"; effect = "WARN Act compliance scrutiny"; probability = 0.45; impact = "Low"; financialImpact = -200000; description = "Legal review and potential penalties if mishandled" },
    
    # Fourth Order - Long-term Effects
    @{ order = 4; category = "Strategic"; effect = "Reduced geographic diversification"; probability = 1.0; impact = "Medium"; financialImpact = 0; description = "Concentration risk if remaining plants face issues" },
    @{ order = 4; category = "Talent"; effect = "Harder to recruit in Midwest region"; probability = 0.55; impact = "Low"; financialImpact = -600000; description = "Reputation as employer affected regionally" },
    @{ order = 4; category = "Customer"; effect = "Competitors target displaced accounts"; probability = 0.72; impact = "High"; financialImpact = -4500000; description = "Aggressive competitor moves during transition" }
)

$hiddenCosts = @{
    severanceAndOutplacement = 8500000
    facilityCarryingCosts = 2400000
    knowledgeLoss = 1800000
    customerAttrition = 3200000
    overtimeSurge = 1400000
    prAndReputation = 500000
    moraleImpact = 900000
    legalCompliance = 200000
    recruitmentImpact = 600000
    competitorPoaching = 4500000
    total = 24000000
}

$netAnalysis = @{
    projectedSavings = 12000000
    hiddenCosts = 24000000
    netFirstYear = -12000000
    breakEvenYear = "Year 3 (if no further attrition)"
    riskAdjustedNPV = -8500000
}

$alternatives = @(
    @{ option = "Partial Closure"; description = "Reduce Springfield to 1 shift, retain 120 employees"; savings = 7200000; hiddenCosts = 8000000; netImpact = -800000; risk = "Medium" },
    @{ option = "Product Line Shift"; description = "Retool Springfield for new product line"; savings = 0; hiddenCosts = 15000000; netImpact = "Depends on new product success"; risk = "High" },
    @{ option = "Automation Investment"; description = "Invest 8M in automation, reduce headcount by 40 percent"; savings = 5800000; hiddenCosts = 4200000; netImpact = 1600000; risk = "Low" },
    @{ option = "Status Quo + Efficiency"; description = "Lean initiative targeting 15 percent cost reduction"; savings = 4500000; hiddenCosts = 1200000; netImpact = 3300000; risk = "Low" }
)

$mitigations = @(
    @{ risk = "Key engineer loss"; mitigation = "Retention bonuses for critical 15 engineers"; cost = 450000; riskReduction = 0.60 },
    @{ risk = "Customer attrition"; mitigation = "Proactive account management and service guarantees"; cost = 200000; riskReduction = 0.45 },
    @{ risk = "Morale impact"; mitigation = "Transparent communication and job security messaging"; cost = 50000; riskReduction = 0.35 },
    @{ risk = "Competitor poaching"; mitigation = "Accelerated transition timeline (4 months vs 6)"; cost = 800000; riskReduction = 0.40 }
)

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkCyan
Write-Host "                  CENDIACASCADE - Ripple Effect Analysis" -ForegroundColor DarkCyan
Write-Host "            'See the butterfly effects before you flap your wings'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "    SCENARIO: Plant Closure Decision Analysis" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Proposed Change: $($proposedChange.title)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin ripple effect analysis..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Proposed Change
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Proposed Change"

Write-Step "1.1" "Change details..."

Write-Host ""
Write-Host "    Change: $($proposedChange.changeId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Title: $($proposedChange.title)" -ForegroundColor White
Write-Host "    Type: $($proposedChange.type)" -ForegroundColor Gray
Write-Host "    Proposed By: $($proposedChange.proposedBy)" -ForegroundColor Gray
Write-Host "    Target Date: $($proposedChange.targetDate)" -ForegroundColor Yellow
Write-Host ""
Write-Host "    Rationale: $($proposedChange.rationale)" -ForegroundColor Gray
Write-Host ""
Write-Host "    Affected Employees: $($proposedChange.affectedEmployees)" -ForegroundColor Red
Write-Host "    Projected Annual Savings: 12,000,000" -ForegroundColor Green

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Ripple Effect Analysis
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Ripple Effect Analysis"

Write-Step "2.1" "Tracing downstream consequences..."

$orders = @(1, 2, 3, 4)
$orderNames = @{ 1 = "First Order (Direct)"; 2 = "Second Order (Indirect)"; 3 = "Third Order (Systemic)"; 4 = "Fourth Order (Long-term)" }

foreach ($order in $orders) {
    Write-Host ""
    Write-Host "    === $($orderNames[$order]) ===" -ForegroundColor Magenta
    
    $orderEffects = $rippleEffects | Where-Object { $_.order -eq $order }
    
    foreach ($effect in $orderEffects) {
        $impactColor = switch ($effect.impact) {
            "High" { "Red" }
            "Medium" { "Yellow" }
            "Low" { "Green" }
        }
        
        Write-Host ""
        Write-Ripple "$($effect.category): $($effect.effect)"
        Write-Host "       Probability: $([math]::Round($effect.probability * 100)) percent | Impact: " -NoNewline -ForegroundColor Gray
        Write-Host $effect.impact -ForegroundColor $impactColor
        if ($effect.financialImpact -ne 0) {
            $finColor = if ($effect.financialImpact -lt 0) { "Red" } else { "Green" }
            Write-Host "       Financial Impact: $($effect.financialImpact)" -ForegroundColor $finColor
        }
        Write-Host "       $($effect.description)" -ForegroundColor DarkGray
    }
    
    Start-Sleep -Milliseconds 300
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Hidden Costs
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Hidden Cost Analysis"

Write-Step "3.1" "Aggregating hidden costs..."

Write-Host ""
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  HIDDEN COSTS SUMMARY                                     |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  Severance and Outplacement:        8,500,000             |" -ForegroundColor DarkGray
Write-Host "    |  Facility Carrying Costs:           2,400,000             |" -ForegroundColor DarkGray
Write-Host "    |  Knowledge Loss:                    1,800,000             |" -ForegroundColor DarkGray
Write-Host "    |  Customer Attrition Risk:           3,200,000             |" -ForegroundColor DarkGray
Write-Host "    |  Overtime Surge:                    1,400,000             |" -ForegroundColor DarkGray
Write-Host "    |  PR and Reputation:                   500,000             |" -ForegroundColor DarkGray
Write-Host "    |  Morale Impact:                       900,000             |" -ForegroundColor DarkGray
Write-Host "    |  Legal Compliance:                    200,000             |" -ForegroundColor DarkGray
Write-Host "    |  Recruitment Impact:                  600,000             |" -ForegroundColor DarkGray
Write-Host "    |  Competitor Poaching:               4,500,000             |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  TOTAL HIDDEN COSTS:               " -NoNewline -ForegroundColor DarkGray
Write-Host "24,000,000" -NoNewline -ForegroundColor Red
Write-Host "             |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Net Analysis
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Net Impact Analysis"

Write-Step "4.1" "Comparing savings vs hidden costs..."

Write-Host ""
Write-Host "    Projected Annual Savings:    " -NoNewline -ForegroundColor Gray
Write-Host "+12,000,000" -ForegroundColor Green
Write-Host "    Hidden Costs (Year 1):       " -NoNewline -ForegroundColor Gray
Write-Host "-24,000,000" -ForegroundColor Red
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    NET FIRST YEAR IMPACT:       " -NoNewline -ForegroundColor White
Write-Host "-12,000,000" -ForegroundColor Red
Write-Host ""
Write-Host "    Break-Even: $($netAnalysis.breakEvenYear)" -ForegroundColor Yellow
Write-Host "    Risk-Adjusted NPV: $($netAnalysis.riskAdjustedNPV)" -ForegroundColor Red

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Alternatives
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Alternative Scenarios"

Write-Step "5.1" "Comparing alternative approaches..."

Write-Host ""
foreach ($alt in $alternatives) {
    $riskColor = switch ($alt.risk) {
        "High" { "Red" }
        "Medium" { "Yellow" }
        "Low" { "Green" }
    }
    
    Write-Host "    Option: $($alt.option)" -ForegroundColor Cyan
    Write-Host "       $($alt.description)" -ForegroundColor Gray
    Write-Host "       Savings: $($alt.savings) | Hidden Costs: $($alt.hiddenCosts)" -ForegroundColor DarkGray
    Write-Host "       Net Impact: $($alt.netImpact) | Risk: " -NoNewline -ForegroundColor Gray
    Write-Host $alt.risk -ForegroundColor $riskColor
    Write-Host ""
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 6: Mitigations
# -----------------------------------------------------------------------------
Write-Header "STEP 6: Risk Mitigations"

Write-Step "6.1" "If proceeding with closure, recommended mitigations..."

Write-Host ""
foreach ($mit in $mitigations) {
    Write-Host "    Risk: $($mit.risk)" -ForegroundColor Yellow
    Write-Host "       Mitigation: $($mit.mitigation)" -ForegroundColor White
    Write-Host "       Cost: $($mit.cost) | Risk Reduction: $([math]::Round($mit.riskReduction * 100)) percent" -ForegroundColor Gray
    Write-Host ""
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "CASCADE ANALYSIS COMPLETE"

Write-Host ""
Write-Host "    CENDIACASCADE ANALYSIS SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    PROPOSED CHANGE: $($proposedChange.title)" -ForegroundColor Cyan
Write-Host "       Projected Savings: 12,000,000 annually" -ForegroundColor Gray
Write-Host ""
Write-Host "    RIPPLE EFFECTS IDENTIFIED: 14" -ForegroundColor White
Write-Host "       First Order (Direct): 3" -ForegroundColor Gray
Write-Host "       Second Order (Indirect): 4" -ForegroundColor Gray
Write-Host "       Third Order (Systemic): 4" -ForegroundColor Gray
Write-Host "       Fourth Order (Long-term): 3" -ForegroundColor Gray
Write-Host ""
Write-Host "    FINANCIAL REALITY:" -ForegroundColor White
Write-Host "       Projected Savings:     +12,000,000" -ForegroundColor Green
Write-Host "       Hidden Costs:          -24,000,000" -ForegroundColor Red
Write-Host "       Net Year 1:            -12,000,000" -ForegroundColor Red
Write-Host ""
Write-Host "    RECOMMENDATION:" -ForegroundColor Yellow
Write-Host "    Do NOT proceed with full closure. Consider Alternative 4:" -ForegroundColor White
Write-Host "    'Status Quo + Efficiency' which yields +3,300,000 net impact" -ForegroundColor Green
Write-Host "    with Low risk and no workforce displacement." -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    KEY INSIGHT:" -ForegroundColor Yellow
Write-Host "    The 12M in projected savings is real, but 24M in hidden costs" -ForegroundColor Gray
Write-Host "    were not visible in the original analysis. Cascade revealed" -ForegroundColor Gray
Write-Host "    that this decision would destroy value, not create it." -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaCascade - The costs you cannot see are the ones that hurt." -ForegroundColor DarkCyan
Write-Host ""
