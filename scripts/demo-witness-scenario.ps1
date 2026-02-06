# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaWitness - Immutable Audit Trail
# =============================================================================
#
# SCENARIO: Regulator requests complete audit trail for a decision made
#           6 months ago. CendiaWitness produces cryptographically verified
#           evidence in under 30 seconds.
#
# CendiaWitness: "Every decision. Every reason. Forever provable."
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

function Write-Verified {
    param([string]$text)
    Write-Host "    [VERIFIED] $text" -ForegroundColor Green
}

function Write-Evidence {
    param([string]$text)
    Write-Host "    [EVIDENCE] $text" -ForegroundColor Cyan
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$regulatorRequest = @{
    requestId = "REG-2026-0104-FDA-001"
    regulator = "FDA - Office of Regulatory Affairs"
    requestDate = "2026-01-04"
    requestType = "Decision Audit Request"
    deadline = "5 business days"
    targetDecisionId = "dlb-2025-0715-clinical-001"
    targetDecisionTitle = "Phase III Clinical Trial Continuation Decision"
    targetDecisionDate = "2025-07-15"
    targetDecisionOutcome = "CONTINUE_WITH_MODIFICATIONS"
    requestedItems = @(
        "Complete deliberation transcript",
        "All agent contributions and reasoning",
        "Evidence documents considered",
        "Dissenting opinions (if any)",
        "Final recommendation rationale",
        "Approval chain and signatures"
    )
}

$decisionRecord = @{
    decisionId = "dlb-2025-0715-clinical-001"
    title = "Phase III Clinical Trial Continuation Decision"
    createdAt = "2025-07-15T09:23:45Z"
    finalizedAt = "2025-07-15T14:47:22Z"
    context = "Review of interim safety data from Phase III trial of CardioMax-2 showing unexpected cardiac events in 3 patients (0.8 percent of cohort)."
    outcome = "CONTINUE_WITH_MODIFICATIONS"
}

$agents = @(
    @{ role = "Clinical Strategist"; vote = "CONTINUE_WITH_MODIFICATIONS"; confidence = 0.82; reasoning = "Event rate within acceptable range for this patient population. Enhanced monitoring protocol addresses safety concerns." },
    @{ role = "Safety Analyst"; vote = "PAUSE_FOR_REVIEW"; confidence = 0.71; reasoning = "Cardiac events warrant deeper analysis. Recommend 30-day pause to review all adverse event data." },
    @{ role = "Regulatory Compliance"; vote = "CONTINUE_WITH_MODIFICATIONS"; confidence = 0.88; reasoning = "FDA guidance allows continuation with enhanced monitoring. Protocol amendment required within 14 days." },
    @{ role = "Red Team"; vote = "CONTINUE_WITH_MODIFICATIONS"; confidence = 0.75; reasoning = "Stress-tested worst-case scenarios. Risk acceptable with proposed mitigations." },
    @{ role = "Ethics Officer"; vote = "CONTINUE_WITH_MODIFICATIONS"; confidence = 0.79; reasoning = "Patient benefit outweighs risk with enhanced consent and monitoring." },
    @{ role = "Arbiter"; vote = "CONTINUE_WITH_MODIFICATIONS"; confidence = 0.84; reasoning = "Consensus achieved on modified continuation. Safety Analyst dissent noted and addressed in protocol." }
)

$dissents = @(
    @{ agent = "Safety Analyst"; position = "Recommended 30-day pause"; resolution = "Addressed via enhanced monitoring protocol and weekly safety reviews"; acknowledged = $true }
)

$evidenceConsidered = @(
    @{ id = "ev-001"; title = "Interim Safety Report"; pages = 47; hash = "sha256:a1b2c3d4..." },
    @{ id = "ev-002"; title = "Adverse Event Log"; pages = 12; hash = "sha256:e5f6g7h8..." },
    @{ id = "ev-003"; title = "FDA Guidance Document"; pages = 23; hash = "sha256:i9j0k1l2..." },
    @{ id = "ev-004"; title = "Protocol Amendment Draft"; pages = 8; hash = "sha256:m3n4o5p6..." },
    @{ id = "ev-005"; title = "DSMB Recommendation"; pages = 3; hash = "sha256:q7r8s9t0..." }
)

$conditions = @(
    "Implement enhanced cardiac monitoring protocol within 7 days",
    "Submit protocol amendment to FDA within 14 days",
    "Conduct weekly safety review meetings",
    "Update informed consent to reflect new findings",
    "Establish stopping rules for cardiac events over 2 percent"
)

$approvals = @(
    @{ role = "Chief Medical Officer"; name = "Dr. Elizabeth Warren"; timestamp = "2025-07-15T15:12:33Z"; signature = "sig:emw-2025-0715" },
    @{ role = "VP Regulatory Affairs"; name = "James Chen"; timestamp = "2025-07-15T15:28:45Z"; signature = "sig:jc-2025-0715" },
    @{ role = "CEO"; name = "Michael Torres"; timestamp = "2025-07-15T16:02:11Z"; signature = "sig:mt-2025-0715" }
)

$cryptographicProof = @{
    merkleRoot = "sha256:7f83b1657ff1fc53b92dc18148a1d65dfc2d4b1fa3d677284addd200126d9069"
    signature = "RSA-PSS:MGYCMQCNp8..."
    signedAt = "2025-07-15T16:05:00Z"
    keyId = "cendia-signing-key-2025"
    algorithm = "RSA-PSS-SHA256"
}

$verificationChain = @(
    @{ block = 1; hash = "sha256:a1b2..."; timestamp = "2025-07-15T09:23:45Z"; entry = "Deliberation initiated" },
    @{ block = 2; hash = "sha256:c3d4..."; timestamp = "2025-07-15T10:15:22Z"; entry = "Evidence documents attached" },
    @{ block = 3; hash = "sha256:e5f6..."; timestamp = "2025-07-15T12:33:18Z"; entry = "Agent deliberations recorded" },
    @{ block = 4; hash = "sha256:g7h8..."; timestamp = "2025-07-15T14:47:22Z"; entry = "Decision finalized" },
    @{ block = 5; hash = "sha256:i9j0..."; timestamp = "2025-07-15T16:02:11Z"; entry = "Executive approvals recorded" },
    @{ block = 6; hash = "sha256:k1l2..."; timestamp = "2025-07-15T16:05:00Z"; entry = "Decision packet signed" }
)

$exportPackage = @{
    packageId = "exp-2026-0104-001"
    format = "PDF/A-3 + JSON"
    generatedAt = "2026-01-04T10:30:00Z"
    contents = @(
        @{ file = "decision_summary.pdf"; pages = 8; description = "Executive summary of decision" },
        @{ file = "deliberation_transcript.pdf"; pages = 24; description = "Complete agent deliberations" },
        @{ file = "evidence_bundle.pdf"; pages = 93; description = "All evidence documents considered" },
        @{ file = "approval_chain.pdf"; pages = 2; description = "Signatures and timestamps" },
        @{ file = "cryptographic_proof.json"; pages = 1; description = "Merkle root and signature" },
        @{ file = "verification_instructions.pdf"; pages = 3; description = "How to verify authenticity" }
    )
    totalPages = 131
    totalSizeMB = 12.4
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkCyan
Write-Host "                   CENDIAWITNESS - Immutable Audit Trail" -ForegroundColor DarkCyan
Write-Host "              'Every decision. Every reason. Forever provable.'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkCyan
Write-Host ""
Write-Host "    SCENARIO: Regulatory Audit Response" -ForegroundColor White
Write-Host "    Regulator: $($regulatorRequest.regulator)" -ForegroundColor Gray
Write-Host "    Request: $($regulatorRequest.requestId)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin audit response..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Regulator Request
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Regulatory Audit Request"

Write-Step "1.1" "Incoming request details..."

Write-Host ""
Write-Host "    REGULATORY REQUEST" -ForegroundColor Yellow
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Request ID: $($regulatorRequest.requestId)" -ForegroundColor White
Write-Host "    Regulator: $($regulatorRequest.regulator)" -ForegroundColor White
Write-Host "    Date: $($regulatorRequest.requestDate)" -ForegroundColor Gray
Write-Host "    Deadline: $($regulatorRequest.deadline)" -ForegroundColor Yellow
Write-Host ""
Write-Host "    Target Decision:" -ForegroundColor White
Write-Host "      ID: $($regulatorRequest.targetDecisionId)" -ForegroundColor Cyan
Write-Host "      Title: $($regulatorRequest.targetDecisionTitle)" -ForegroundColor Cyan
Write-Host "      Date: $($regulatorRequest.targetDecisionDate)" -ForegroundColor Gray
Write-Host "      Outcome: $($regulatorRequest.targetDecisionOutcome)" -ForegroundColor Green
Write-Host ""
Write-Host "    Requested Items:" -ForegroundColor White
foreach ($item in $regulatorRequest.requestedItems) {
    Write-Host "      [ ] $item" -ForegroundColor Gray
}

Start-Sleep -Seconds 2

# -----------------------------------------------------------------------------
# STEP 2: Decision Retrieval
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Decision Record Retrieval"

Write-Step "2.1" "Retrieving decision from immutable ledger..."

Write-Host ""
Write-Host "    Searching ledger for: $($decisionRecord.decisionId)" -ForegroundColor Gray
Start-Sleep -Milliseconds 500
Write-Verified "Decision record found"
Write-Host "    -> Created: $($decisionRecord.createdAt)" -ForegroundColor Gray
Write-Host "    -> Finalized: $($decisionRecord.finalizedAt)" -ForegroundColor Gray

Write-Step "2.2" "Decision summary..."

Write-Host ""
Write-Host "    $($decisionRecord.title)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    Context:" -ForegroundColor White
Write-Host "    $($decisionRecord.context)" -ForegroundColor Gray
Write-Host ""
Write-Host "    Outcome: " -NoNewline -ForegroundColor White
Write-Host $decisionRecord.outcome -ForegroundColor Green

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Agent Deliberations
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Agent Deliberation Records"

Write-Step "3.1" "Retrieving all agent contributions..."

foreach ($agent in $agents) {
    $voteColor = switch ($agent.vote) {
        "CONTINUE_WITH_MODIFICATIONS" { "Green" }
        "PAUSE_FOR_REVIEW" { "Yellow" }
        "STOP" { "Red" }
        default { "White" }
    }
    
    Write-Host ""
    Write-Host "    [AGENT] $($agent.role)" -ForegroundColor Cyan
    Write-Host "       Vote: " -NoNewline -ForegroundColor Gray
    Write-Host $agent.vote -ForegroundColor $voteColor
    Write-Host "       Confidence: $([math]::Round($agent.confidence * 100)) percent" -ForegroundColor Gray
    Write-Host "       Reasoning: $($agent.reasoning)" -ForegroundColor DarkGray
}

Write-Step "3.2" "Dissenting opinions..."

if ($dissents.Count -gt 0) {
    foreach ($dissent in $dissents) {
        Write-Host ""
        Write-Host "    DISSENT RECORDED" -ForegroundColor Yellow
        Write-Host "       Agent: $($dissent.agent)" -ForegroundColor White
        Write-Host "       Position: $($dissent.position)" -ForegroundColor Red
        Write-Host "       Resolution: $($dissent.resolution)" -ForegroundColor Green
        Write-Host "       Acknowledged: Yes" -ForegroundColor Green
    }
} else {
    Write-Host "    -> No dissenting opinions recorded" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Evidence Chain
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Evidence Documents"

Write-Step "4.1" "Evidence considered in decision..."

foreach ($evidence in $evidenceConsidered) {
    Write-Evidence "$($evidence.title) ($($evidence.pages) pages)"
    Write-Host "       ID: $($evidence.id) | Hash: $($evidence.hash)" -ForegroundColor DarkGray
}

Write-Step "4.2" "Conditions attached to decision..."

foreach ($condition in $conditions) {
    Write-Host "    [X] $condition" -ForegroundColor Yellow
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Approval Chain
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Approval Chain Verification"

Write-Step "5.1" "Executive approvals..."

foreach ($approval in $approvals) {
    Write-Host ""
    Write-Host "    [SIGNED] $($approval.name)" -ForegroundColor Cyan
    Write-Host "       Role: $($approval.role)" -ForegroundColor Gray
    Write-Host "       Timestamp: $($approval.timestamp)" -ForegroundColor Gray
    Write-Host "       Signature: $($approval.signature)" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 6: Cryptographic Verification
# -----------------------------------------------------------------------------
Write-Header "STEP 6: Cryptographic Verification"

Write-Step "6.1" "Verifying decision packet integrity..."

Write-Host ""
Write-Host "    CRYPTOGRAPHIC PROOF" -ForegroundColor Green
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Merkle Root: $($cryptographicProof.merkleRoot)" -ForegroundColor Cyan
Write-Host "    Signature: $($cryptographicProof.signature)" -ForegroundColor Cyan
Write-Host "    Algorithm: $($cryptographicProof.algorithm)" -ForegroundColor Gray
Write-Host "    Key ID: $($cryptographicProof.keyId)" -ForegroundColor Gray
Write-Host "    Signed At: $($cryptographicProof.signedAt)" -ForegroundColor Gray

Write-Step "6.2" "Verification chain..."

foreach ($block in $verificationChain) {
    Write-Host ""
    Write-Host "    Block $($block.block): $($block.entry)" -ForegroundColor White
    Write-Host "       Hash: $($block.hash) | Time: $($block.timestamp)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Verified "INTEGRITY VERIFIED - No tampering detected"
Write-Verified "SIGNATURE VALID - Matches original signing key"
Write-Verified "CHAIN COMPLETE - All 6 blocks verified"

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 7: Export Package
# -----------------------------------------------------------------------------
Write-Header "STEP 7: Audit Package Generation"

Write-Step "7.1" "Generating regulator-ready export..."

Write-Host ""
Write-Host "    Export Package: $($exportPackage.packageId)" -ForegroundColor Cyan
Write-Host "    Format: $($exportPackage.format)" -ForegroundColor Gray
Write-Host "    Generated: $($exportPackage.generatedAt)" -ForegroundColor Gray
Write-Host ""
Write-Host "    Contents:" -ForegroundColor White

foreach ($file in $exportPackage.contents) {
    Write-Host "      [DOC] $($file.file) ($($file.pages) pages)" -ForegroundColor Gray
    Write-Host "         $($file.description)" -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "    Total: $($exportPackage.totalPages) pages | $($exportPackage.totalSizeMB) MB" -ForegroundColor White

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "AUDIT RESPONSE COMPLETE"

Write-Host ""
Write-Host "    CENDIAWITNESS AUDIT SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    REQUEST: $($regulatorRequest.requestId)" -ForegroundColor Cyan
Write-Host "       Regulator: $($regulatorRequest.regulator)" -ForegroundColor Gray
Write-Host "       Deadline: $($regulatorRequest.deadline)" -ForegroundColor Gray
Write-Host ""
Write-Host "    DECISION RETRIEVED: $($decisionRecord.decisionId)" -ForegroundColor Cyan
Write-Host "       Date: 2025-07-15" -ForegroundColor Gray
Write-Host "       Outcome: $($decisionRecord.outcome)" -ForegroundColor Gray
Write-Host "       Age: approximately 6 months" -ForegroundColor Gray
Write-Host ""
Write-Host "    REQUESTED ITEMS FULFILLED:" -ForegroundColor White
Write-Host "       [X] Complete deliberation transcript" -ForegroundColor Green
Write-Host "       [X] All agent contributions and reasoning" -ForegroundColor Green
Write-Host "       [X] Evidence documents considered (5 documents, 93 pages)" -ForegroundColor Green
Write-Host "       [X] Dissenting opinions (1 recorded, addressed)" -ForegroundColor Green
Write-Host "       [X] Final recommendation rationale" -ForegroundColor Green
Write-Host "       [X] Approval chain and signatures (3 executives)" -ForegroundColor Green
Write-Host ""
Write-Host "    CRYPTOGRAPHIC VERIFICATION:" -ForegroundColor White
Write-Host "       [OK] Merkle root verified" -ForegroundColor Green
Write-Host "       [OK] Digital signature valid" -ForegroundColor Green
Write-Host "       [OK] 6-block chain intact" -ForegroundColor Green
Write-Host "       [OK] No tampering detected" -ForegroundColor Green
Write-Host ""
Write-Host "    EXPORT PACKAGE:" -ForegroundColor White
Write-Host "       Format: PDF/A-3 + JSON" -ForegroundColor Gray
Write-Host "       Pages: $($exportPackage.totalPages)" -ForegroundColor Gray
Write-Host "       Size: $($exportPackage.totalSizeMB) MB" -ForegroundColor Gray
Write-Host "       Generation Time: less than 30 seconds" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaWitness - 6 months ago. 30 seconds to prove it." -ForegroundColor DarkCyan
Write-Host ""
