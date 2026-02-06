# =============================================================================
# DATACENDIA SERVICE DEMO: Ghost Board - Board Meeting Rehearsal
# =============================================================================
#
# SCENARIO: CEO prepares for quarterly board meeting by rehearsing with AI
#           personas of each board member. Ghost Board simulates tough
#           questions, objections, and helps refine the presentation.
#
# Ghost Board: "Rehearse the hard conversations before they happen"
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
    Write-Host ("=" * 80) -ForegroundColor DarkMagenta
    Write-Host "  $text" -ForegroundColor DarkMagenta
    Write-Host ("=" * 80) -ForegroundColor DarkMagenta
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

# =============================================================================
# SCENARIO DATA
# =============================================================================

$company = @{
    name = "Nexus Technologies Inc."
    ticker = "NXTS"
    marketCap = 4200000000
    employees = 2800
    sector = "Enterprise Software"
}

$meetingContext = @{
    meetingType = "Q4 2025 Board Meeting"
    date = "2026-01-15"
    duration = "3 hours"
    keyTopics = @(
        "Q4 Financial Results (missed revenue by 8 percent)",
        "2026 Strategic Plan",
        "CFO Succession (current CFO retiring)",
        "Acquisition Proposal (CloudSync for 180M)"
    )
}

$boardMembers = @(
    @{
        name = "Margaret Chen"
        role = "Board Chair"
        background = "Former CEO of Oracle Asia-Pacific"
        style = "Direct, numbers-focused, low tolerance for excuses"
        concerns = @("Revenue miss accountability", "Management credibility")
        icon = "[CHAIR]"
    },
    @{
        name = "David Okonkwo"
        role = "Audit Committee Chair"
        background = "Former CFO of Deloitte"
        style = "Detail-oriented, risk-averse, asks follow-up questions"
        concerns = @("Cash burn rate", "Acquisition due diligence")
        icon = "[AUDIT]"
    },
    @{
        name = "Sarah Martinez"
        role = "Compensation Committee Chair"
        background = "CHRO at Microsoft"
        style = "People-focused, concerned about culture"
        concerns = @("CFO succession plan", "Employee retention during transition")
        icon = "[COMP]"
    },
    @{
        name = "James Liu"
        role = "Independent Director"
        background = "Venture capitalist, 3 successful exits"
        style = "Growth-focused, impatient with slow execution"
        concerns = @("Growth strategy", "Competitive positioning")
        icon = "[VC]"
    },
    @{
        name = "Patricia Williams"
        role = "Independent Director"
        background = "Former SEC Commissioner"
        style = "Governance-focused, asks about compliance"
        concerns = @("Disclosure adequacy", "Board oversight")
        icon = "[GOV]"
    }
)

$rehearsalExchanges = @(
    @{
        topic = "Q4 Revenue Miss"
        boardMember = "Margaret Chen"
        question = "We missed revenue by 8 percent. That is 12 million dollars. I have heard the macro environment excuse from every CEO this quarter. What specifically did YOUR team do wrong, and what has changed?"
        difficulty = "Hard"
        suggestedResponseLines = @(
            "Margaret, you are right to push on this. Three specific failures:",
            "",
            "1. We over-indexed on enterprise deals that slipped to Q1. Our pipeline coverage",
            "   was 2.8x but close rates dropped from 32 percent to 24 percent.",
            "",
            "2. Our mid-market motion stalled when we lost two regional sales directors in",
            "   October. We have since hired replacements and added a VP of Sales Ops.",
            "",
            "3. Product delays on the analytics module pushed 3M in upsells to Q1.",
            "",
            "What has changed: We have implemented weekly pipeline reviews with me personally,",
            "added a deal desk for enterprise, and the product is now shipped."
        )
        coachingNote = "Good accountability. Consider adding specific metrics for Q1 to show you have learned."
    },
    @{
        topic = "CFO Succession"
        boardMember = "Sarah Martinez"
        question = "Robert is retiring in 90 days. I am concerned we do not have a clear succession plan. Who is running the search, what is the timeline, and do we have an interim plan if we do not find someone?"
        difficulty = "Medium"
        suggestedResponseLines = @(
            "Sarah, we have been working on this for 6 months. Here is where we are:",
            "",
            "Search: Spencer Stuart is running it. We have 4 finalists, all with public",
            "company CFO experience. Board interviews scheduled for February.",
            "",
            "Timeline: Offer extended by February 15, start date April 1 with 30-day",
            "overlap with Robert.",
            "",
            "Interim: If needed, our VP of Finance, Jennifer Park, can serve as interim.",
            "She has been Robert's number 2 for 3 years and knows the business cold.",
            "",
            "I would like to schedule a Compensation Committee session to review the",
            "finalist packages next week."
        )
        coachingNote = "Strong answer. The interim plan shows you have thought through contingencies."
    },
    @{
        topic = "CloudSync Acquisition"
        boardMember = "David Okonkwo"
        question = "You are asking us to approve 180 million for CloudSync. Their revenue is 22 million with negative EBITDA. Walk me through the due diligence findings and the three things that could make this a disaster."
        difficulty = "Hard"
        suggestedResponseLines = @(
            "David, I appreciate the rigor. Let me address both parts.",
            "",
            "Due diligence findings:",
            "- Technology: Clean architecture, 94 percent of code is reusable.",
            "- Customers: 89 percent retention, NPS of 62. We interviewed 8 of top 10.",
            "- IP: 4 patents, no litigation, clean chain of title.",
            "- Financials: Burn rate is 1.8M per month but 70 percent is growth investment.",
            "",
            "Three disaster scenarios:",
            "1. Key talent leaves: We have structured retention packages for top 15 engineers.",
            "2. Customer churn: We are committing to 24-month price lock.",
            "3. Integration delays: We have hired an integration PMO with 180-day plan.",
            "",
            "I am not saying there is no risk. I am saying we have identified it and have",
            "mitigation plans."
        )
        coachingNote = "Excellent structure. David will appreciate that you anticipated his concerns."
    },
    @{
        topic = "Growth Strategy"
        boardMember = "James Liu"
        question = "Your competitors are growing 40 percent year-over-year. You are at 18 percent. In my portfolio, that is a company that is about to get disrupted. What is your plan to get back to 30+ percent growth?"
        difficulty = "Hard"
        suggestedResponseLines = @(
            "James, I will not sugarcoat it - 18 percent is not good enough. Here is the plan:",
            "",
            "1. Product-led growth: We are launching a free tier in Q2. Our competitors get",
            "   40 percent of new logos from self-serve. We get zero today.",
            "",
            "2. CloudSync acquisition: Adds 22M revenue plus cross-sell opportunity we",
            "   estimate at 15M in Year 2.",
            "",
            "3. International expansion: We are opening EMEA in Q2. Our product is already",
            "   localized; we just need feet on the street.",
            "",
            "4. Platform play: Our new API marketplace launches in March. Early partners",
            "   are projecting 8M in influenced revenue.",
            "",
            "Combined, that is a path to 32 percent growth in 2026. But I will be honest -",
            "execution risk is real. I am asking for your support and your accountability."
        )
        coachingNote = "Good honesty about current state. James respects CEOs who do not make excuses."
    },
    @{
        topic = "Governance Oversight"
        boardMember = "Patricia Williams"
        question = "Given the revenue miss and the CFO transition, I am concerned about our disclosure obligations. Have we adequately disclosed the material risks in our 10-K, and is our internal control environment sufficient during this transition?"
        difficulty = "Medium"
        suggestedResponseLines = @(
            "Patricia, governance is paramount, especially now. Let me address both:",
            "",
            "Disclosure: Our outside counsel at Wilson Sonsini reviewed the risk factors",
            "last week. We have added specific language about:",
            "- Sales execution risk and pipeline visibility",
            "- Key person dependency during CFO transition",
            "- Integration risk related to potential acquisitions",
            "",
            "Internal controls: We engaged PwC to do a pre-transition assessment. No",
            "material weaknesses identified. We are adding a monthly certification from",
            "the VP of Finance during the transition period.",
            "",
            "I would welcome a special Audit Committee session to review the disclosure",
            "language before we file."
        )
        coachingNote = "Perfect tone for Patricia. She wants to see proactive governance, not reactive."
    }
)

$sessionSummary = @{
    totalExchanges = 5
    difficultyBreakdown = @{ Hard = 3; Medium = 2 }
    topicsRehearsed = @("Revenue Miss", "CFO Succession", "M and A", "Growth Strategy", "Governance")
    readinessScore = 0.82
    areasForImprovement = @(
        "Add specific Q1 metrics when discussing revenue recovery",
        "Prepare backup slides on CloudSync customer interviews",
        "Have CFO finalist bios ready for impromptu questions"
    )
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkMagenta
Write-Host "                    GHOST BOARD - Board Meeting Rehearsal" -ForegroundColor DarkMagenta
Write-Host "           'Rehearse the hard conversations before they happen'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkMagenta
Write-Host ""
Write-Host "    SCENARIO: Q4 Board Meeting Preparation" -ForegroundColor White
Write-Host "    Company: $($company.name) ($($company.ticker))" -ForegroundColor Gray
Write-Host "    Meeting Date: $($meetingContext.date)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin board rehearsal..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Meeting Context
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Meeting Context"

Write-Step "1.1" "Upcoming board meeting details..."

Write-Host ""
Write-Host "    $($meetingContext.meetingType)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Date: $($meetingContext.date)" -ForegroundColor White
Write-Host "    Duration: $($meetingContext.duration)" -ForegroundColor Gray
Write-Host ""
Write-Host "    Key Topics:" -ForegroundColor Yellow
foreach ($topic in $meetingContext.keyTopics) {
    Write-Host "      - $topic" -ForegroundColor White
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Board Member Profiles
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Board Member Personas"

Write-Step "2.1" "Loading AI personas for each board member..."

foreach ($member in $boardMembers) {
    Write-Host ""
    Write-Host "    $($member.icon) $($member.name)" -ForegroundColor Cyan
    Write-Host "       Role: $($member.role)" -ForegroundColor White
    Write-Host "       Background: $($member.background)" -ForegroundColor Gray
    Write-Host "       Style: $($member.style)" -ForegroundColor DarkGray
    Write-Host "       Key Concerns: $($member.concerns -join ', ')" -ForegroundColor Yellow
    Start-Sleep -Milliseconds 300
}

Write-Host ""
Write-Success "5 board member personas loaded and ready"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Rehearsal Session
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Rehearsal Session"

Write-Step "3.1" "Beginning simulated Q and A..."

foreach ($exchange in $rehearsalExchanges) {
    $member = $boardMembers | Where-Object { $_.name -eq $exchange.boardMember }
    
    $difficultyColor = switch ($exchange.difficulty) {
        "Hard" { "Red" }
        "Medium" { "Yellow" }
        "Easy" { "Green" }
    }
    
    Write-Host ""
    Write-Host "    ===============================================================" -ForegroundColor DarkGray
    Write-Host "    TOPIC: $($exchange.topic)" -ForegroundColor White
    Write-Host "    Difficulty: " -NoNewline -ForegroundColor Gray
    Write-Host $exchange.difficulty -ForegroundColor $difficultyColor
    Write-Host ""
    
    # Board member question
    Write-Host "    $($member.icon) " -NoNewline -ForegroundColor DarkMagenta
    Write-Host "$($exchange.boardMember):" -ForegroundColor White
    Write-Host ""
    Write-Host "    ""$($exchange.question)""" -ForegroundColor Yellow
    
    Write-Host ""
    Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "    SUGGESTED RESPONSE:" -ForegroundColor Cyan
    Write-Host ""
    
    foreach ($line in $exchange.suggestedResponseLines) {
        if ($line) {
            Write-Host "    $line" -ForegroundColor Gray
        } else {
            Write-Host ""
        }
    }
    
    Write-Host ""
    Write-Host "    COACHING NOTE:" -ForegroundColor Green
    Write-Host "    $($exchange.coachingNote)" -ForegroundColor DarkGreen
    
    Start-Sleep -Milliseconds 500
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Session Summary
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Rehearsal Summary"

Write-Step "4.1" "Session performance analysis..."

Write-Host ""
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  GHOST BOARD SESSION SUMMARY                              |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  Exchanges Completed:     " -NoNewline -ForegroundColor DarkGray
Write-Host "$($sessionSummary.totalExchanges)" -NoNewline -ForegroundColor White
Write-Host "                              |" -ForegroundColor DarkGray
Write-Host "    |  Hard Questions:          " -NoNewline -ForegroundColor DarkGray
Write-Host "$($sessionSummary.difficultyBreakdown.Hard)" -NoNewline -ForegroundColor Red
Write-Host "                              |" -ForegroundColor DarkGray
Write-Host "    |  Medium Questions:        " -NoNewline -ForegroundColor DarkGray
Write-Host "$($sessionSummary.difficultyBreakdown.Medium)" -NoNewline -ForegroundColor Yellow
Write-Host "                              |" -ForegroundColor DarkGray
Write-Host "    |  Readiness Score:         " -NoNewline -ForegroundColor DarkGray
Write-Host "$([math]::Round($sessionSummary.readinessScore * 100)) percent" -NoNewline -ForegroundColor Green
Write-Host "                    |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

Write-Step "4.2" "Areas for improvement..."

foreach ($area in $sessionSummary.areasForImprovement) {
    Write-Host "    [!] $area" -ForegroundColor Yellow
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "REHEARSAL COMPLETE"

Write-Host ""
Write-Host "    GHOST BOARD SESSION SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    MEETING: $($meetingContext.meetingType)" -ForegroundColor Cyan
Write-Host "       Date: $($meetingContext.date)" -ForegroundColor Gray
Write-Host ""
Write-Host "    BOARD MEMBERS SIMULATED: 5" -ForegroundColor White
Write-Host "       Margaret Chen (Chair) - Revenue accountability" -ForegroundColor Gray
Write-Host "       David Okonkwo (Audit) - Due diligence rigor" -ForegroundColor Gray
Write-Host "       Sarah Martinez (Comp) - Succession planning" -ForegroundColor Gray
Write-Host "       James Liu (Independent) - Growth strategy" -ForegroundColor Gray
Write-Host "       Patricia Williams (Independent) - Governance" -ForegroundColor Gray
Write-Host ""
Write-Host "    TOPICS REHEARSED:" -ForegroundColor White
Write-Host "       - Q4 Revenue Miss - Hard question from Chair" -ForegroundColor Gray
Write-Host "       - CFO Succession - Medium question from Comp Chair" -ForegroundColor Gray
Write-Host "       - CloudSync Acquisition - Hard question from Audit Chair" -ForegroundColor Gray
Write-Host "       - Growth Strategy - Hard question from VC director" -ForegroundColor Gray
Write-Host "       - Governance Oversight - Medium question from former SEC" -ForegroundColor Gray
Write-Host ""
Write-Host "    READINESS SCORE: $([math]::Round($sessionSummary.readinessScore * 100)) percent" -ForegroundColor Green
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    PREPARATION CHECKLIST:" -ForegroundColor White
Write-Host "    [ ] Add Q1 metrics to revenue recovery narrative" -ForegroundColor Gray
Write-Host "    [ ] Prepare CloudSync customer interview backup slides" -ForegroundColor Gray
Write-Host "    [ ] Have CFO finalist bios ready" -ForegroundColor Gray
Write-Host "    [ ] Schedule pre-meeting with Board Chair" -ForegroundColor Gray
Write-Host "    [ ] Review disclosure language with legal" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    Ghost Board - The board meeting you have before the board meeting." -ForegroundColor DarkMagenta
Write-Host ""
