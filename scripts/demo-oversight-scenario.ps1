# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaOversight - Compliance and Governance
# =============================================================================
#
# SCENARIO: Healthcare organization undergoes surprise HIPAA audit. 
#           CendiaOversight demonstrates real-time compliance posture,
#           policy enforcement, and generates audit-ready evidence in minutes.
#
# CendiaOversight: "Compliance is not a checkbox. It is a continuous state."
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
    Write-Host ("=" * 80) -ForegroundColor DarkGreen
    Write-Host "  $text" -ForegroundColor DarkGreen
    Write-Host ("=" * 80) -ForegroundColor DarkGreen
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Compliant {
    param([string]$text)
    Write-Host "    [PASS] $text" -ForegroundColor Green
}

function Write-Warning {
    param([string]$text)
    Write-Host "    [WARN] $text" -ForegroundColor Yellow
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "Regional Medical Center"
    type = "Healthcare Provider"
    beds = 450
    employees = 3200
    patientsAnnual = 125000
    frameworks = @("HIPAA", "HITECH", "State Privacy Laws", "Joint Commission")
}

$auditContext = @{
    auditId = "HHS-OCR-2026-0104"
    auditor = "HHS Office for Civil Rights"
    type = "Compliance Review"
    notice = "48 hours"
    scope = @(
        "Access controls and authentication",
        "Audit logging and monitoring",
        "Data encryption (at rest and in transit)",
        "Business associate agreements",
        "Incident response procedures",
        "Employee training records"
    )
}

$compliancePosture = @{
    overallScore = 0.94
    lastAssessment = "2026-01-03"
    frameworks = @(
        @{ name = "HIPAA Security Rule"; score = 0.96; controls = 54; compliant = 52; gaps = 2 },
        @{ name = "HIPAA Privacy Rule"; score = 0.93; controls = 42; compliant = 39; gaps = 3 },
        @{ name = "HITECH Act"; score = 0.95; controls = 28; compliant = 27; gaps = 1 },
        @{ name = "State Privacy Laws"; score = 0.91; controls = 35; compliant = 32; gaps = 3 }
    )
}

$controlStatus = @(
    @{ id = "AC-001"; control = "Unique User Identification"; framework = "HIPAA 164.312(a)(2)(i)"; status = "COMPLIANT"; evidence = "All 3,200 users have unique IDs. No shared accounts."; lastTested = "2026-01-02" },
    @{ id = "AC-002"; control = "Automatic Logoff"; framework = "HIPAA 164.312(a)(2)(iii)"; status = "COMPLIANT"; evidence = "15-minute timeout enforced via GPO. Compliance rate: 100 percent"; lastTested = "2026-01-03" },
    @{ id = "AC-003"; control = "Encryption at Rest"; framework = "HIPAA 164.312(a)(2)(iv)"; status = "COMPLIANT"; evidence = "AES-256 encryption on all PHI databases. Key rotation: quarterly"; lastTested = "2026-01-01" },
    @{ id = "AC-004"; control = "Encryption in Transit"; framework = "HIPAA 164.312(e)(2)(ii)"; status = "COMPLIANT"; evidence = "TLS 1.3 enforced. No legacy protocols."; lastTested = "2026-01-03" },
    @{ id = "AU-001"; control = "Audit Controls"; framework = "HIPAA 164.312(b)"; status = "COMPLIANT"; evidence = "All PHI access logged. 7-year retention. Tamper-evident storage"; lastTested = "2026-01-03" },
    @{ id = "AU-002"; control = "Audit Log Review"; framework = "HIPAA 164.308(a)(1)(ii)(D)"; status = "WARNING"; evidence = "Weekly reviews documented. 2 reviews delayed in December (holiday staffing)"; lastTested = "2026-01-02"; remediation = "Implemented automated anomaly detection to supplement manual review" },
    @{ id = "TR-001"; control = "Security Awareness Training"; framework = "HIPAA 164.308(a)(5)"; status = "COMPLIANT"; evidence = "Annual training completed by 98.7 percent of workforce. 42 employees pending (new hires)"; lastTested = "2026-01-03" },
    @{ id = "TR-002"; control = "Phishing Simulation"; framework = "HIPAA 164.308(a)(5)(ii)(A)"; status = "COMPLIANT"; evidence = "Monthly simulations. Click rate: 3.2 percent (industry avg: 8.1 percent)"; lastTested = "2025-12-15" },
    @{ id = "IR-001"; control = "Incident Response Plan"; framework = "HIPAA 164.308(a)(6)"; status = "COMPLIANT"; evidence = "Plan updated 2025-11-01. Tabletop exercise completed 2025-12-10"; lastTested = "2025-12-10" },
    @{ id = "BA-001"; control = "Business Associate Agreements"; framework = "HIPAA 164.308(b)(1)"; status = "WARNING"; evidence = "127 BAAs on file. 3 pending renewal (due dates: Jan 15, Jan 22, Feb 1)"; lastTested = "2026-01-02"; remediation = "Renewal reminders sent. Legal review in progress" }
)

$recentIncidents = @(
    @{ id = "INC-2025-089"; date = "2025-11-15"; type = "Unauthorized Access Attempt"; severity = "Medium"; status = "RESOLVED"; description = "Former employee attempted login 3 days post-termination"; resolution = "Access was blocked by automated deprovisioning. No PHI accessed"; reportedToHHS = $false; reason = "No breach occurred - access denied" },
    @{ id = "INC-2025-102"; date = "2025-12-03"; type = "Misdirected Fax"; severity = "Low"; status = "RESOLVED"; description = "Lab results faxed to wrong physician office"; resolution = "Receiving party confirmed destruction. Patient notified"; reportedToHHS = $false; reason = "Fewer than 500 individuals affected" }
)

$policyEnforcement = @(
    @{ policy = "Minimum Necessary Access"; enforced = $true; mechanism = "Role-based access control with quarterly access reviews"; violations30Days = 0 },
    @{ policy = "PHI Access Logging"; enforced = $true; mechanism = "Automated logging of all EHR access with patient context"; violations30Days = 0 },
    @{ policy = "Device Encryption"; enforced = $true; mechanism = "MDM enforces encryption on all mobile devices"; violations30Days = 2; violationDetails = "2 personal devices blocked for missing encryption" },
    @{ policy = "Password Complexity"; enforced = $true; mechanism = "14-character minimum, complexity requirements, 90-day rotation"; violations30Days = 0 },
    @{ policy = "Data Loss Prevention"; enforced = $true; mechanism = "DLP scanning on email, cloud storage, USB"; violations30Days = 5; violationDetails = "5 emails blocked for containing unencrypted PHI" }
)

$evidencePackage = @{
    packageId = "EVD-2026-0104-HIPAA"
    generatedAt = "2026-01-04T10:15:00Z"
    contents = @(
        @{ document = "Compliance_Posture_Summary.pdf"; pages = 12 },
        @{ document = "Control_Evidence_Matrix.xlsx"; pages = 8 },
        @{ document = "Audit_Logs_Sample_30Days.csv"; records = 2847000 },
        @{ document = "Training_Completion_Report.pdf"; pages = 45 },
        @{ document = "BAA_Inventory.pdf"; pages = 23 },
        @{ document = "Incident_Response_Log.pdf"; pages = 8 },
        @{ document = "Risk_Assessment_2025.pdf"; pages = 67 },
        @{ document = "Policy_Library.pdf"; pages = 124 }
    )
    totalPages = 287
    generationTime = "4 minutes 23 seconds"
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor DarkGreen
Write-Host "                CENDIAOVERSIGHT - Compliance and Governance" -ForegroundColor DarkGreen
Write-Host "           'Compliance is not a checkbox. It is a continuous state.'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor DarkGreen
Write-Host ""
Write-Host "    SCENARIO: HIPAA Compliance Audit Response" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Auditor: $($auditContext.auditor)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin compliance review..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Audit Context
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Audit Notification Received"

Write-Step "1.1" "Audit details..."

Write-Host ""
Write-Host "    COMPLIANCE AUDIT NOTICE" -ForegroundColor Yellow
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Audit ID: $($auditContext.auditId)" -ForegroundColor White
Write-Host "    Auditor: $($auditContext.auditor)" -ForegroundColor White
Write-Host "    Type: $($auditContext.type)" -ForegroundColor White
Write-Host "    Notice Period: $($auditContext.notice)" -ForegroundColor Yellow
Write-Host ""
Write-Host "    Scope:" -ForegroundColor White
foreach ($item in $auditContext.scope) {
    Write-Host "      - $item" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Compliance Posture
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Real-Time Compliance Posture"

Write-Step "2.1" "Current compliance scores..."

Write-Host ""
$scoreColor = if ($compliancePosture.overallScore -ge 0.9) { "Green" } elseif ($compliancePosture.overallScore -ge 0.8) { "Yellow" } else { "Red" }

Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  OVERALL COMPLIANCE SCORE: " -NoNewline -ForegroundColor DarkGray
Write-Host "$([math]::Round($compliancePosture.overallScore * 100)) percent" -NoNewline -ForegroundColor $scoreColor
Write-Host "                 |" -ForegroundColor DarkGray
Write-Host "    |  Last Assessment: $($compliancePosture.lastAssessment)                       |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

Write-Host ""
Write-Host "    Framework Scores:" -ForegroundColor White

foreach ($fw in $compliancePosture.frameworks) {
    $fwColor = if ($fw.score -ge 0.95) { "Green" } elseif ($fw.score -ge 0.9) { "Yellow" } else { "Red" }
    $barLen = [math]::Round($fw.score * 20)
    $bar = "#" * $barLen
    $emptyBar = "-" * (20 - $barLen)
    
    Write-Host "    $($fw.name.PadRight(25))" -NoNewline -ForegroundColor White
    Write-Host $bar -NoNewline -ForegroundColor $fwColor
    Write-Host $emptyBar -NoNewline -ForegroundColor DarkGray
    Write-Host " $([math]::Round($fw.score * 100)) percent ($($fw.compliant)/$($fw.controls))" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Control Status
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Control-Level Evidence"

Write-Step "3.1" "Key controls status..."

foreach ($control in $controlStatus) {
    $statusColor = switch ($control.status) {
        "COMPLIANT" { "Green" }
        "WARNING" { "Yellow" }
        "NON-COMPLIANT" { "Red" }
    }
    
    $statusIcon = switch ($control.status) {
        "COMPLIANT" { "[PASS]" }
        "WARNING" { "[WARN]" }
        "NON-COMPLIANT" { "[FAIL]" }
    }
    
    Write-Host ""
    Write-Host "    $statusIcon $($control.id): $($control.control)" -ForegroundColor $statusColor
    Write-Host "       Framework: $($control.framework)" -ForegroundColor Gray
    Write-Host "       Evidence: $($control.evidence)" -ForegroundColor DarkGray
    Write-Host "       Last Tested: $($control.lastTested)" -ForegroundColor DarkGray
    
    if ($control.remediation) {
        Write-Host "       Remediation: $($control.remediation)" -ForegroundColor Yellow
    }
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Policy Enforcement
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Active Policy Enforcement"

Write-Step "4.1" "Policy enforcement status (last 30 days)..."

Write-Host ""
foreach ($policy in $policyEnforcement) {
    $enforcedIcon = if ($policy.enforced) { "[ON]" } else { "[OFF]" }
    $violationColor = if ($policy.violations30Days -eq 0) { "Green" } else { "Yellow" }
    
    Write-Host "    $enforcedIcon $($policy.policy)" -ForegroundColor White
    Write-Host "       Mechanism: $($policy.mechanism)" -ForegroundColor Gray
    Write-Host "       Violations (30d): " -NoNewline -ForegroundColor Gray
    Write-Host $policy.violations30Days -ForegroundColor $violationColor
    
    if ($policy.violationDetails) {
        Write-Host "       Details: $($policy.violationDetails)" -ForegroundColor DarkYellow
    }
    Write-Host ""
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Incident History
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Security Incident History"

Write-Step "5.1" "Recent incidents (last 90 days)..."

foreach ($incident in $recentIncidents) {
    $severityColor = switch ($incident.severity) {
        "High" { "Red" }
        "Medium" { "Yellow" }
        "Low" { "Green" }
    }
    
    Write-Host ""
    Write-Host "    $($incident.id): $($incident.type)" -ForegroundColor Cyan
    Write-Host "       Date: $($incident.date) | Severity: " -NoNewline -ForegroundColor Gray
    Write-Host $incident.severity -ForegroundColor $severityColor
    Write-Host "       Status: $($incident.status)" -ForegroundColor Green
    Write-Host "       Description: $($incident.description)" -ForegroundColor Gray
    Write-Host "       Resolution: $($incident.resolution)" -ForegroundColor DarkGray
    $reportedText = if ($incident.reportedToHHS) { "Yes" } else { "No - $($incident.reason)" }
    Write-Host "       Reported to HHS: $reportedText" -ForegroundColor $(if ($incident.reportedToHHS) { "Yellow" } else { "Green" })
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 6: Evidence Package
# -----------------------------------------------------------------------------
Write-Header "STEP 6: Audit Evidence Package"

Write-Step "6.1" "Generating audit-ready evidence package..."

Write-Host ""
Write-Host "    Evidence Package: $($evidencePackage.packageId)" -ForegroundColor Cyan
Write-Host "    Generated: $($evidencePackage.generatedAt)" -ForegroundColor Gray
Write-Host "    Generation Time: $($evidencePackage.generationTime)" -ForegroundColor Green
Write-Host ""
Write-Host "    Contents:" -ForegroundColor White

foreach ($doc in $evidencePackage.contents) {
    if ($doc.pages) {
        Write-Host "      [DOC] $($doc.document) ($($doc.pages) pages)" -ForegroundColor Gray
    } else {
        Write-Host "      [DOC] $($doc.document) ($($doc.records) records)" -ForegroundColor Gray
    }
}

Write-Host ""
Write-Compliant "Total: $($evidencePackage.totalPages) pages of audit evidence"

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "AUDIT PREPARATION COMPLETE"

Write-Host ""
Write-Host "    CENDIAOVERSIGHT AUDIT SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    ORGANIZATION: $($organization.name)" -ForegroundColor Cyan
Write-Host "       Frameworks: HIPAA, HITECH, State Privacy Laws" -ForegroundColor Gray
Write-Host ""
Write-Host "    COMPLIANCE POSTURE: $([math]::Round($compliancePosture.overallScore * 100)) percent" -ForegroundColor Green
Write-Host "       HIPAA Security Rule: 96 percent (52/54 controls)" -ForegroundColor Gray
Write-Host "       HIPAA Privacy Rule: 93 percent (39/42 controls)" -ForegroundColor Gray
Write-Host "       HITECH Act: 95 percent (27/28 controls)" -ForegroundColor Gray
Write-Host "       State Privacy: 91 percent (32/35 controls)" -ForegroundColor Gray
Write-Host ""
Write-Host "    CONTROL STATUS:" -ForegroundColor White
Write-Host "       Compliant: 8 controls" -ForegroundColor Green
Write-Host "       Warning: 2 controls (audit log review, BAA renewals)" -ForegroundColor Yellow
Write-Host "       Non-Compliant: 0 controls" -ForegroundColor Gray
Write-Host ""
Write-Host "    POLICY ENFORCEMENT (30 days):" -ForegroundColor White
Write-Host "       Policies Active: 5/5" -ForegroundColor Gray
Write-Host "       Violations Blocked: 7 (2 device, 5 email)" -ForegroundColor Gray
Write-Host "       Breaches: 0" -ForegroundColor Gray
Write-Host ""
Write-Host "    INCIDENTS (90 days):" -ForegroundColor White
Write-Host "       Total: 2" -ForegroundColor Gray
Write-Host "       Resolved: 2" -ForegroundColor Gray
Write-Host "       Reportable to HHS: 0" -ForegroundColor Gray
Write-Host ""
Write-Host "    EVIDENCE PACKAGE:" -ForegroundColor White
Write-Host "       Documents: 8" -ForegroundColor Gray
Write-Host "       Pages: $($evidencePackage.totalPages)" -ForegroundColor Gray
Write-Host "       Generation Time: $($evidencePackage.generationTime)" -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    AUDIT READINESS: HIGH" -ForegroundColor Green
Write-Host ""
Write-Host "    Two minor items require attention before audit:" -ForegroundColor Yellow
Write-Host "    1. Complete 3 pending BAA renewals (due Jan 15-Feb 1)" -ForegroundColor Gray
Write-Host "    2. Document December audit log review delays" -ForegroundColor Gray
Write-Host ""
Write-Host "    All other controls have current evidence and documentation." -ForegroundColor Gray
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaOversight - Always audit-ready. Never scrambling." -ForegroundColor DarkGreen
Write-Host ""
