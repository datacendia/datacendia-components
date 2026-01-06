# =============================================================================
# DATACENDIA SERVICE DEMO: The Council - Multi-Agent Deliberation
# =============================================================================
#
# SCENARIO: Insurance company must decide whether to enter the cyber insurance
#           market. Six specialized AI agents deliberate, debate, and reach
#           a consensus recommendation with full audit trail.
#
# The Council: "Six minds. One decision. Zero blind spots."
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
    Write-Host ("=" * 80) -ForegroundColor White
    Write-Host "  $text" -ForegroundColor White
    Write-Host ("=" * 80) -ForegroundColor White
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

function Write-Agent {
    param([string]$name, [string]$icon)
    Write-Host "    $icon " -NoNewline -ForegroundColor Cyan
    Write-Host $name -ForegroundColor White
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "Meridian Insurance Group"
    industry = "Property and Casualty Insurance"
    assets = 12000000000
    employees = 4200
    currentLines = @("Auto", "Home", "Commercial Property", "Workers Comp")
}

$deliberation = @{
    deliberationId = "dlb-2026-0104-cyber-001"
    title = "Cyber Insurance Market Entry Decision"
    initiatedBy = "Chief Strategy Officer"
    initiatedAt = "2026-01-04T09:00:00Z"
    question = "Should Meridian Insurance Group enter the cyber insurance market with a new product line targeting mid-market businesses?"
}

$contextLines = @(
    "Market opportunity: Cyber insurance market growing 25 percent annually, projected 35B by 2028.",
    "Competition: Major carriers - AIG, Chubb, Travelers - dominate enterprise segment.",
    "Gap identified: Mid-market businesses underserved - only 30 percent have cyber coverage.",
    "Investment required: 45M over 3 years for underwriting talent, technology, reinsurance.",
    "Risk: Cyber claims are volatile and correlated; one major breach event could impact multiple policies."
)

$attachments = @(
    "Cyber_Insurance_Market_Analysis_2025.pdf",
    "Competitor_Landscape_Report.pdf",
    "Actuarial_Risk_Assessment.xlsx",
    "Regulatory_Requirements_Summary.pdf",
    "Technology_Investment_Proposal.pdf"
)

$agents = @(
    @{ name = "Strategist"; icon = "[STR]"; role = "Market opportunity and competitive positioning"; color = "Cyan" },
    @{ name = "Analyst"; icon = "[ANA]"; role = "Financial modeling and ROI analysis"; color = "Green" },
    @{ name = "Red Team"; icon = "[RED]"; role = "Attack the proposal, find weaknesses"; color = "Red" },
    @{ name = "Compliance"; icon = "[COM]"; role = "Regulatory and legal requirements"; color = "Yellow" },
    @{ name = "Union"; icon = "[UNI]"; role = "Workforce and stakeholder impact"; color = "Magenta" },
    @{ name = "Arbiter"; icon = "[ARB]"; role = "Synthesize perspectives, drive consensus"; color = "White" }
)

$agentDeliberations = @(
    @{
        agent = "Strategist"
        phase = "Opening Analysis"
        position = "SUPPORT"
        confidence = 0.78
        analysisLines = @(
            "The mid-market cyber segment represents a significant strategic opportunity:",
            "",
            "1. MARKET GAP: Only 30 percent of mid-market businesses have cyber coverage vs 85 percent of enterprise",
            "2. GROWTH: 25 percent CAGR through 2028 - fastest growing P and C segment",
            "3. POSITIONING: Our existing commercial relationships give us distribution advantage",
            "4. TIMING: First-mover advantage still available in mid-market segment",
            "",
            "RECOMMENDATION: Enter market with focused mid-market product"
        )
        keyPoints = @(
            "Mid-market segment underserved - clear market gap",
            "Existing commercial client relationships provide distribution channel",
            "25 percent annual growth rate exceeds all other P and C lines"
        )
    },
    @{
        agent = "Analyst"
        phase = "Financial Assessment"
        position = "SUPPORT_WITH_CONDITIONS"
        confidence = 0.72
        analysisLines = @(
            "Financial modeling indicates viable but narrow path to profitability:",
            "",
            "INVESTMENT: 45M over 3 years",
            "- Year 1: 20M for talent, technology, reinsurance setup",
            "- Year 2: 15M for scaling, marketing",
            "- Year 3: 10M for optimization",
            "",
            "PROJECTED RETURNS:",
            "- Break-even: Year 4 assuming 65 percent loss ratio",
            "- 5-year NPV: 28M base case",
            "- IRR: 14.2 percent above 12 percent hurdle rate",
            "",
            "SENSITIVITY: Loss ratio above 75 percent makes project NPV-negative"
        )
        keyPoints = @(
            "Break-even achievable in Year 4 under base case",
            "IRR of 14.2 percent exceeds corporate hurdle rate",
            "High sensitivity to loss ratio - must stay below 75 percent"
        )
    },
    @{
        agent = "Red Team"
        phase = "Adversarial Challenge"
        position = "OPPOSE"
        confidence = 0.81
        analysisLines = @(
            "CRITICAL RISKS NOT ADEQUATELY ADDRESSED:",
            "",
            "1. CORRELATION RISK: Single ransomware variant could trigger claims across 40+ percent",
            "   of portfolio simultaneously. Traditional diversification does not work.",
            "",
            "2. ADVERSE SELECTION: Mid-market companies seeking cyber insurance often have poor",
            "   security posture. We will attract the riskiest clients.",
            "",
            "3. TALENT GAP: Cyber underwriting requires specialized expertise we do not have.",
            "   Hiring 15 specialists in competitive market will cost 2x budget.",
            "",
            "4. REINSURANCE AVAILABILITY: Reinsurers are pulling back from cyber.",
            "   Treaty terms are deteriorating quarterly.",
            "",
            "THIS IS A TRAP. The attractive growth masks catastrophic tail risk."
        )
        keyPoints = @(
            "Correlation risk: Single event could trigger 40+ percent of claims",
            "Adverse selection will attract highest-risk clients",
            "Reinsurance market deteriorating - capacity shrinking",
            "Talent acquisition costs likely 2x budget estimates"
        )
    },
    @{
        agent = "Compliance"
        phase = "Regulatory Review"
        position = "SUPPORT_WITH_CONDITIONS"
        confidence = 0.85
        analysisLines = @(
            "Regulatory pathway is navigable but requires significant preparation:",
            "",
            "REQUIREMENTS:",
            "- File policy forms in all 50 states (12-18 month process)",
            "- Cyber-specific capital requirements in NY, CA, TX",
            "- Data breach notification compliance for claims handling",
            "- NAIC Cyber Insurance Supplement reporting",
            "",
            "RISKS:",
            "- 3 states considering mandatory cyber coverage disclosure",
            "- Potential for standardized policy language requirements",
            "- Claims handling must comply with state-specific timelines",
            "",
            "RECOMMENDATION: Proceed with dedicated compliance team and 18-month regulatory runway"
        )
        keyPoints = @(
            "50-state filing process requires 12-18 months",
            "Dedicated compliance team required (3-4 FTEs)",
            "Regulatory landscape evolving - must monitor actively"
        )
    },
    @{
        agent = "Union"
        phase = "Stakeholder Impact"
        position = "SUPPORT"
        confidence = 0.76
        analysisLines = @(
            "WORKFORCE IMPLICATIONS:",
            "",
            "POSITIVE:",
            "- Creates 45-60 new positions (underwriters, claims, IT)",
            "- Upskilling opportunities for existing commercial lines staff",
            "- Positions company as innovative employer",
            "",
            "CONCERNS:",
            "- Specialized talent may create two-tier compensation structure",
            "- Existing underwriters may feel threatened by new expertise",
            "- Remote work expectations differ for cyber talent",
            "",
            "RECOMMENDATION: Support with robust change management and internal mobility program"
        )
        keyPoints = @(
            "45-60 new jobs created across multiple functions",
            "Upskilling pathway for existing commercial staff",
            "Change management critical for cultural integration"
        )
    },
    @{
        agent = "Arbiter"
        phase = "Synthesis and Recommendation"
        position = "CONDITIONAL_APPROVAL"
        confidence = 0.74
        analysisLines = @(
            "SYNTHESIS OF COUNCIL DELIBERATION:",
            "",
            "The Council has identified a genuine strategic opportunity with significant but manageable risks.",
            "",
            "AREAS OF CONSENSUS:",
            "[OK] Market opportunity is real and timing is favorable",
            "[OK] Financial returns are achievable under base case",
            "[OK] Regulatory pathway exists but requires investment",
            "[OK] Workforce impact is net positive",
            "",
            "AREAS OF CONCERN (Red Team):",
            "[!] Correlation risk requires explicit mitigation",
            "[!] Adverse selection must be addressed in underwriting",
            "[!] Reinsurance strategy is critical dependency",
            "[!] Talent costs may exceed projections",
            "",
            "RECOMMENDED PATH: CONDITIONAL APPROVAL",
            "",
            "Proceed with market entry ONLY IF the following conditions are met."
        )
        keyPoints = @(
            "Conditional approval - proceed with safeguards",
            "5 mandatory conditions must be met before launch",
            "Red Team concerns addressed via risk mitigation requirements"
        )
    }
)

$finalDecision = @{
    outcome = "CONDITIONAL_APPROVAL"
    consensusLevel = 0.74
    voteSummary = @{
        support = 2
        supportWithConditions = 3
        oppose = 1
    }
    conditions = @(
        "Secure minimum 200M reinsurance capacity with 3+ year commitment",
        "Implement mandatory security assessment for all policies over 1M",
        "Cap initial portfolio at 50M total insured value for Year 1",
        "Establish correlation risk reserve equal to 15 percent of gross written premium",
        "Hire Chief Cyber Underwriter with 10+ years experience before product launch"
    )
    dissent = @{
        agent = "Red Team"
        position = "Opposed due to unmitigated correlation risk"
        acknowledged = $true
        response = "Conditions 3 and 4 directly address correlation risk concerns"
    }
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor White
Write-Host "                     THE COUNCIL - Multi-Agent Deliberation" -ForegroundColor White
Write-Host "              'Six minds. One decision. Zero blind spots.'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor White
Write-Host ""
Write-Host "    SCENARIO: Strategic Market Entry Decision" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Question: Enter cyber insurance market?" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to convene The Council..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Deliberation Setup
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Deliberation Initiated"

Write-Step "1.1" "Deliberation details..."

Write-Host ""
Write-Host "    DELIBERATION: $($deliberation.deliberationId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Title: $($deliberation.title)" -ForegroundColor White
Write-Host "    Initiated By: $($deliberation.initiatedBy)" -ForegroundColor Gray
Write-Host "    Time: $($deliberation.initiatedAt)" -ForegroundColor Gray
Write-Host ""
Write-Host "    QUESTION:" -ForegroundColor Yellow
Write-Host "    $($deliberation.question)" -ForegroundColor White
Write-Host ""
Write-Host "    CONTEXT:" -ForegroundColor Yellow
foreach ($line in $contextLines) {
    Write-Host "    $line" -ForegroundColor Gray
}

Write-Step "1.2" "Evidence documents loaded..."

foreach ($doc in $attachments) {
    Write-Host "    [DOC] $doc" -ForegroundColor Cyan
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Council Assembly
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Council Assembly"

Write-Step "2.1" "Convening the six agents..."

Write-Host ""
foreach ($agent in $agents) {
    Write-Agent $agent.name $agent.icon
    Write-Host "       Role: $($agent.role)" -ForegroundColor DarkGray
    Start-Sleep -Milliseconds 200
}

Write-Host ""
Write-Success "All agents assembled and ready for deliberation"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Deliberation Rounds
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Deliberation in Progress"

foreach ($delib in $agentDeliberations) {
    $agent = $agents | Where-Object { $_.name -eq $delib.agent }
    
    $positionColor = switch ($delib.position) {
        "SUPPORT" { "Green" }
        "SUPPORT_WITH_CONDITIONS" { "Yellow" }
        "OPPOSE" { "Red" }
        "CONDITIONAL_APPROVAL" { "Cyan" }
        default { "White" }
    }
    
    Write-Step $delib.phase "$($agent.icon) $($delib.agent) Agent"
    
    Write-Host ""
    Write-Host "    Position: " -NoNewline -ForegroundColor Gray
    Write-Host $delib.position -ForegroundColor $positionColor
    Write-Host "    Confidence: $([math]::Round($delib.confidence * 100)) percent" -ForegroundColor Gray
    Write-Host ""
    
    foreach ($line in $delib.analysisLines) {
        if ($line) {
            Write-Host "    $line" -ForegroundColor DarkGray
        } else {
            Write-Host ""
        }
    }
    
    Write-Host ""
    Write-Host "    Key Points:" -ForegroundColor White
    foreach ($point in $delib.keyPoints) {
        Write-Host "      - $point" -ForegroundColor Gray
    }
    
    Start-Sleep -Milliseconds 500
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Vote Tally
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Council Vote"

Write-Step "4.1" "Recording agent positions..."

Write-Host ""
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  COUNCIL VOTE TALLY                                       |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  Support:                 " -NoNewline -ForegroundColor DarkGray
Write-Host "$($finalDecision.voteSummary.support)" -NoNewline -ForegroundColor Green
Write-Host "                               |" -ForegroundColor DarkGray
Write-Host "    |  Support w/ Conditions:  " -NoNewline -ForegroundColor DarkGray
Write-Host "$($finalDecision.voteSummary.supportWithConditions)" -NoNewline -ForegroundColor Yellow
Write-Host "                               |" -ForegroundColor DarkGray
Write-Host "    |  Oppose:                  " -NoNewline -ForegroundColor DarkGray
Write-Host "$($finalDecision.voteSummary.oppose)" -NoNewline -ForegroundColor Red
Write-Host "                               |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  Consensus Level:         " -NoNewline -ForegroundColor DarkGray
Write-Host "$([math]::Round($finalDecision.consensusLevel * 100)) percent" -NoNewline -ForegroundColor Cyan
Write-Host "                     |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Dissent Record
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Dissent Acknowledgment"

Write-Step "5.1" "Recording dissenting position..."

Write-Host ""
Write-Host "    FORMAL DISSENT RECORDED" -ForegroundColor Yellow
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Agent: $($finalDecision.dissent.agent)" -ForegroundColor White
Write-Host "    Position: $($finalDecision.dissent.position)" -ForegroundColor Red
Write-Host "    Acknowledged: Yes" -ForegroundColor Green
Write-Host "    Response: $($finalDecision.dissent.response)" -ForegroundColor Cyan

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 6: Final Decision
# -----------------------------------------------------------------------------
Write-Header "STEP 6: Council Decision"

Write-Step "6.1" "Final recommendation..."

Write-Host ""
Write-Host "    THE COUNCIL HAS DECIDED" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    OUTCOME: " -NoNewline -ForegroundColor White
Write-Host $finalDecision.outcome -ForegroundColor Cyan
Write-Host ""
Write-Host "    MANDATORY CONDITIONS:" -ForegroundColor Yellow

$condNum = 1
foreach ($condition in $finalDecision.conditions) {
    Write-Host "    $condNum. $condition" -ForegroundColor White
    $condNum++
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "DELIBERATION COMPLETE"

Write-Host ""
Write-Host "    THE COUNCIL DELIBERATION SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    DELIBERATION: $($deliberation.deliberationId)" -ForegroundColor Cyan
Write-Host "       Question: Enter cyber insurance market?" -ForegroundColor Gray
Write-Host ""
Write-Host "    VOTE RESULTS:" -ForegroundColor White
Write-Host "       Support: $($finalDecision.voteSummary.support) | Conditional: $($finalDecision.voteSummary.supportWithConditions) | Oppose: $($finalDecision.voteSummary.oppose)" -ForegroundColor Gray
Write-Host "       Consensus: $([math]::Round($finalDecision.consensusLevel * 100)) percent" -ForegroundColor Gray
Write-Host ""
Write-Host "    AGENT PERSPECTIVES:" -ForegroundColor White
Write-Host "       [STR] Strategist: Market opportunity is real (78 percent confidence)" -ForegroundColor Cyan
Write-Host "       [ANA] Analyst: Financial returns achievable (72 percent confidence)" -ForegroundColor Green
Write-Host "       [RED] Red Team: OPPOSED - Correlation risk too high (81 percent confidence)" -ForegroundColor Red
Write-Host "       [COM] Compliance: Regulatory path exists (85 percent confidence)" -ForegroundColor Yellow
Write-Host "       [UNI] Union: Net positive for workforce (76 percent confidence)" -ForegroundColor Magenta
Write-Host "       [ARB] Arbiter: Conditional approval recommended (74 percent confidence)" -ForegroundColor White
Write-Host ""
Write-Host "    DECISION: CONDITIONAL APPROVAL" -ForegroundColor Green
Write-Host "       5 mandatory conditions must be met before market entry" -ForegroundColor Gray
Write-Host ""
Write-Host "    DISSENT: Red Team opposition recorded and addressed" -ForegroundColor Yellow
Write-Host "       Conditions 3 and 4 directly mitigate correlation risk concerns" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    NEXT STEPS:" -ForegroundColor White
Write-Host "    1. Decision packet ready for executive signature" -ForegroundColor Gray
Write-Host "    2. Conditions tracked in CendiaOversight" -ForegroundColor Gray
Write-Host "    3. Full audit trail stored in CendiaWitness" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    The Council - Six minds. One decision. Zero blind spots." -ForegroundColor White
Write-Host ""
