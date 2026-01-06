# =============================================================================
# DATACENDIA SERVICE DEMO: Full Platform - Corporate Acquisition Decision
# =============================================================================
#
# SCENARIO: 50M acquisition decision showcasing multiple Datacendia services
#           working together: Council deliberation, Cascade analysis,
#           Notary signing, and Vault storage.
#
# "The complete decision intelligence platform in action"
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
    Write-Host ("=" * 80) -ForegroundColor Cyan
    Write-Host "  $text" -ForegroundColor Cyan
    Write-Host ("=" * 80) -ForegroundColor Cyan
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Service {
    param([string]$service, [string]$text)
    Write-Host "    [$service] $text" -ForegroundColor Cyan
}

function Write-Success {
    param([string]$text)
    Write-Host "    [OK] $text" -ForegroundColor Green
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "Apex Industries"
    industry = "Manufacturing"
    employees = 12000
    revenue = 2400000000
}

$acquisition = @{
    target = "TechFlow Solutions"
    value = 50000000
    type = "Strategic Acquisition"
    rationale = "Expand digital capabilities and enter IoT market"
    deadline = "2026-02-15"
}

$councilAgents = @(
    @{ name = "Strategist"; vote = "SUPPORT"; confidence = 0.82 },
    @{ name = "Analyst"; vote = "SUPPORT_WITH_CONDITIONS"; confidence = 0.74 },
    @{ name = "Red Team"; vote = "SUPPORT_WITH_CONDITIONS"; confidence = 0.68 },
    @{ name = "Compliance"; vote = "SUPPORT"; confidence = 0.88 },
    @{ name = "Union"; vote = "SUPPORT"; confidence = 0.79 },
    @{ name = "Arbiter"; vote = "CONDITIONAL_APPROVAL"; confidence = 0.76 }
)

$cascadeEffects = @(
    @{ order = 1; effect = "Integration costs: 8M over 2 years"; impact = "Financial" },
    @{ order = 1; effect = "85 TechFlow employees to onboard"; impact = "HR" },
    @{ order = 2; effect = "Competitor response likely within 6 months"; impact = "Strategic" },
    @{ order = 2; effect = "Customer overlap: 12 shared accounts"; impact = "Sales" },
    @{ order = 3; effect = "Culture integration challenges"; impact = "Organizational" }
)

$conditions = @(
    "Complete technical due diligence by January 31",
    "Secure key employee retention agreements (top 10)",
    "Obtain regulatory approval for data handling",
    "Establish integration PMO within 30 days of close"
)

$decisionPacket = @{
    packetId = "PKT-2026-0104-ACQ-001"
    merkleRoot = "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    signature = "RSA-PSS:MGYCMQCNp8..."
    signedAt = "2026-01-04T16:30:00Z"
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor Cyan
Write-Host "                    DATACENDIA PLATFORM DEMO" -ForegroundColor Cyan
Write-Host "                  Corporate Acquisition Decision" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "    SCENARIO: 50M Strategic Acquisition" -ForegroundColor White
Write-Host "    Acquirer: $($organization.name)" -ForegroundColor Gray
Write-Host "    Target: $($acquisition.target)" -ForegroundColor Gray
Write-Host "    Value: 50,000,000" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin platform demo..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: The Council
# -----------------------------------------------------------------------------
Write-Header "STEP 1: The Council - Multi-Agent Deliberation"

Write-Service "COUNCIL" "Convening 6 specialized AI agents..."

Write-Host ""
Write-Host "    Question: Should Apex Industries acquire TechFlow Solutions for 50M?" -ForegroundColor White
Write-Host ""

foreach ($agent in $councilAgents) {
    $voteColor = switch ($agent.vote) {
        "SUPPORT" { "Green" }
        "SUPPORT_WITH_CONDITIONS" { "Yellow" }
        "OPPOSE" { "Red" }
        "CONDITIONAL_APPROVAL" { "Cyan" }
        default { "White" }
    }
    
    Write-Host "    [AGENT] $($agent.name): " -NoNewline -ForegroundColor Gray
    Write-Host $agent.vote -NoNewline -ForegroundColor $voteColor
    Write-Host " ($([math]::Round($agent.confidence * 100)) percent confidence)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Success "Council Vote: 4 Support, 2 Conditional -> CONDITIONAL APPROVAL"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: CendiaCascade
# -----------------------------------------------------------------------------
Write-Header "STEP 2: CendiaCascade - Ripple Effect Analysis"

Write-Service "CASCADE" "Analyzing downstream consequences..."

Write-Host ""
foreach ($effect in $cascadeEffects) {
    Write-Host "    [Order $($effect.order)] $($effect.effect)" -ForegroundColor $(if ($effect.order -eq 1) { "Yellow" } else { "Gray" })
    Write-Host "       Impact Area: $($effect.impact)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Success "5 ripple effects identified across 3 orders"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Conditions
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Approval Conditions"

Write-Service "COUNCIL" "Mandatory conditions for approval..."

Write-Host ""
$condNum = 1
foreach ($condition in $conditions) {
    Write-Host "    $condNum. $condition" -ForegroundColor White
    $condNum++
}

Write-Host ""
Write-Success "4 conditions attached to approval"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: CendiaNotary
# -----------------------------------------------------------------------------
Write-Header "STEP 4: CendiaNotary - Cryptographic Signing"

Write-Service "NOTARY" "Signing decision packet..."

Write-Host ""
Write-Host "    Packet ID: $($decisionPacket.packetId)" -ForegroundColor Cyan
Write-Host "    Merkle Root: $($decisionPacket.merkleRoot)" -ForegroundColor Gray
Write-Host "    Signature: $($decisionPacket.signature)" -ForegroundColor Gray
Write-Host "    Signed At: $($decisionPacket.signedAt)" -ForegroundColor Gray

Write-Host ""
Write-Success "Decision packet cryptographically signed"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: CendiaVault
# -----------------------------------------------------------------------------
Write-Header "STEP 5: CendiaVault - Evidence Storage"

Write-Service "VAULT" "Storing decision artifacts..."

Write-Host ""
Write-Host "    Storing:" -ForegroundColor White
Write-Host "      - Council deliberation transcript" -ForegroundColor Gray
Write-Host "      - Agent contributions and votes" -ForegroundColor Gray
Write-Host "      - Cascade analysis report" -ForegroundColor Gray
Write-Host "      - Supporting evidence documents" -ForegroundColor Gray
Write-Host "      - Signed decision packet" -ForegroundColor Gray

Write-Host ""
Write-Success "All artifacts stored with 7-year retention"

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "PLATFORM DEMO COMPLETE"

Write-Host ""
Write-Host "    DATACENDIA PLATFORM SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    DECISION: Acquire TechFlow Solutions for 50M" -ForegroundColor Cyan
Write-Host "       Outcome: CONDITIONAL APPROVAL" -ForegroundColor Green
Write-Host ""
Write-Host "    SERVICES USED:" -ForegroundColor White
Write-Host "       [OK] The Council - 6 agents deliberated" -ForegroundColor Green
Write-Host "       [OK] CendiaCascade - 5 ripple effects analyzed" -ForegroundColor Green
Write-Host "       [OK] CendiaNotary - Decision cryptographically signed" -ForegroundColor Green
Write-Host "       [OK] CendiaVault - All evidence stored" -ForegroundColor Green
Write-Host ""
Write-Host "    CONDITIONS:" -ForegroundColor White
Write-Host "       4 mandatory conditions attached" -ForegroundColor Gray
Write-Host "       Tracked in CendiaOversight" -ForegroundColor Gray
Write-Host ""
Write-Host "    AUDIT TRAIL:" -ForegroundColor White
Write-Host "       Complete deliberation history preserved" -ForegroundColor Gray
Write-Host "       Cryptographic proof of decision integrity" -ForegroundColor Gray
Write-Host "       7-year retention policy applied" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    Datacendia - Decisions you can defend. Forever." -ForegroundColor Cyan
Write-Host ""
