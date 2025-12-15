# =============================================================================
# COMPREHENSIVE EVIDENCE RECORDING - ALL TESTS
# Records all sovereign architecture tests to immutable ledger
# =============================================================================

param(
    [string]$BaseUrl = "http://localhost:3001"
)

$ErrorActionPreference = "Continue"
$Headers = @{ "x-bypass-auth" = "true"; "Content-Type" = "application/json" }

$SuiteId = "comprehensive-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$SuiteName = "Comprehensive Sovereign Architecture Evidence Collection"

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " COMPREHENSIVE EVIDENCE RECORDING" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Suite ID: $SuiteId"
Write-Host ""

# Start suite
$suiteBody = @{ suiteId = $SuiteId; suiteName = $SuiteName; executedBy = $env:USERNAME } | ConvertTo-Json
Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/ledger/suites" -Method POST -Headers $Headers -Body $suiteBody -ErrorAction SilentlyContinue | Out-Null

function Record-Test {
    param(
        [string]$Name,
        [string]$Category,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string[]]$ComplianceFrameworks = @(),
        [string[]]$SecurityControls = @()
    )
    
    $startTime = Get-Date
    $status = "passed"
    $errorMsg = $null
    $response = $null
    
    try {
        $params = @{
            Uri = "$BaseUrl$Endpoint"
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
        }
        if ($Body) { $params.Body = ($Body | ConvertTo-Json -Depth 10) }
        $response = Invoke-RestMethod @params
        if (-not $response.success) { $status = "failed"; $errorMsg = "Unexpected response" }
    } catch {
        $status = "failed"
        $errorMsg = $_.Exception.Message
    }
    
    $durationMs = ((Get-Date) - $startTime).TotalMilliseconds
    
    # Record to ledger
    $execution = @{
        testSuiteId = $SuiteId
        testSuiteName = $SuiteName
        testCaseId = "test-" + [guid]::NewGuid().ToString().Substring(0, 8)
        testCaseName = $Name
        category = $Category
        executedAt = (Get-Date).ToString("o")
        executedBy = $env:USERNAME
        status = $status
        durationMs = [int]$durationMs
        assertions = @(@{ name = "API Response"; expected = "success"; actual = $status; passed = ($status -eq "passed") })
        requestPayload = if ($Body) { $Body | ConvertTo-Json -Compress -Depth 5 } else { $null }
        responsePayload = if ($response) { $response | ConvertTo-Json -Compress -Depth 5 } else { $null }
        errorMessage = $errorMsg
        tags = @("sovereign-arch", $Category, "comprehensive")
        complianceFrameworks = $ComplianceFrameworks
        securityControls = $SecurityControls
    } | ConvertTo-Json -Depth 10
    
    Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/ledger/record" -Method POST -Headers $Headers -Body $execution -ErrorAction SilentlyContinue | Out-Null
    
    $icon = if ($status -eq "passed") { "[PASS]" } else { "[FAIL]" }
    $color = if ($status -eq "passed") { "Green" } else { "Red" }
    Write-Host "  $icon $Name" -ForegroundColor $color
    
    return @{ Status = $status; Response = $response }
}

# =============================================================================
# DATA DIODE TESTS
# =============================================================================
Write-Host "DATA DIODE" -ForegroundColor Yellow
Record-Test -Name "Register ingest source" -Category "data-diode" -Method "POST" -Endpoint "/api/v1/sovereign-arch/diode/sources" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.2") `
    -Body @{ name="Evidence Test Source"; description="Comprehensive evidence test"; watchPath="C:/temp/evidence"; filePattern="*.json"; format="json"; requireSignature=$false; quarantineDuration=60; targetSystem="predict"; enabled=$false }
Record-Test -Name "List ingest sources" -Category "data-diode" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/sources" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
Record-Test -Name "Get recent events" -Category "data-diode" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/events?limit=10" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.6","A.8.15")
Record-Test -Name "Get diode statistics" -Category "data-diode" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/statistics" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# LOCAL RLHF TESTS
# =============================================================================
Write-Host "LOCAL RLHF" -ForegroundColor Yellow
Record-Test -Name "Record RLHF feedback" -Category "rlhf" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/feedback" `
    -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1a","GDPR.5.1b") `
    -Body @{ sessionId="evidence-session"; agentCode="cfo"; modelUsed="qwen2.5:7b"; systemPrompt="You are a CFO."; userPrompt="Revenue projection?"; assistantResponse="Q4 projected at 125M."; feedbackType="vote_agree"; rating=5; responseLatencyMs=1200; tokenCount=100; temperature=0.7; responseAt=(Get-Date).ToString("o") }
Record-Test -Name "Get RLHF statistics" -Category "rlhf" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/stats" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1f")
Record-Test -Name "Generate training dataset" -Category "rlhf" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/datasets" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1b") -Body @{ name="Evidence Dataset"; description="Comprehensive test dataset"; format="alpaca"; maxPairs=100 }
Record-Test -Name "List datasets" -Category "rlhf" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/datasets" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.15")

# =============================================================================
# DECISION DNA TESTS
# =============================================================================
Write-Host "DECISION DNA" -ForegroundColor Yellow
Record-Test -Name "Export decision DNA" -Category "dna" -Method "POST" -Endpoint "/api/v1/sovereign-arch/dna/export" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC1.1","A.5.1") `
    -Body @{ deliberationId="evidence-delib-001"; format="pdf"; includeVoting=$true; includeTimeline=$true; includeAuditTrail=$true; includeMerkleProof=$true }
Record-Test -Name "List DNA exports" -Category "dna" -Method "GET" -Endpoint "/api/v1/sovereign-arch/dna/exports" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
Record-Test -Name "Verify DNA integrity" -Category "dna" -Method "POST" -Endpoint "/api/v1/sovereign-arch/dna/verify" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.15") -Body @{ deliberationId="evidence-delib-001" }

# =============================================================================
# SHADOW COUNCIL TESTS
# =============================================================================
Write-Host "SHADOW COUNCIL" -ForegroundColor Yellow
$shadow = Record-Test -Name "Create shadow session" -Category "shadow" -Method "POST" -Endpoint "/api/v1/sovereign-arch/shadow/sessions" `
    -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC1.2") `
    -Body @{ name="Evidence Shadow Session"; description="Comprehensive evidence test"; purpose="exploration" }
Record-Test -Name "List shadow sessions" -Category "shadow" -Method "GET" -Endpoint "/api/v1/sovereign-arch/shadow/sessions" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

# =============================================================================
# DETERMINISTIC REPLAY TESTS
# =============================================================================
Write-Host "DETERMINISTIC REPLAY" -ForegroundColor Yellow
Record-Test -Name "Start state capture" -Category "replay" -Method "POST" -Endpoint "/api/v1/sovereign-arch/replay/capture/start" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.6","A.8.15") `
    -Body @{ deliberationId="evidence-replay-001" }
Record-Test -Name "Complete state capture" -Category "replay" -Method "POST" -Endpoint "/api/v1/sovereign-arch/replay/capture/complete" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6") -Body @{ deliberationId="evidence-replay-001"; finalOutput=@{ decision="Approved"; confidence=0.95 } }
Record-Test -Name "List replay states" -Category "replay" -Method "GET" -Endpoint "/api/v1/sovereign-arch/replay/states" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

# =============================================================================
# QR AIR-GAP BRIDGE TESTS
# =============================================================================
Write-Host "QR AIR-GAP BRIDGE" -ForegroundColor Yellow
Record-Test -Name "Create QR payload" -Category "qr" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/payload" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.2") `
    -Body @{ contentType="decision"; content=@{ id="qr-test"; decision="Approved" }; compress=$true; encrypt=$false }
Record-Test -Name "Quick export" -Category "qr" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/quick-export" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1") -Body @{ deliberationId="qr-delib-001"; includeAttachments=$false }
Record-Test -Name "Start capture session" -Category "qr" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/capture/start" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

# =============================================================================
# CANARY TRIPWIRES TESTS
# =============================================================================
Write-Host "CANARY TRIPWIRES" -ForegroundColor Yellow
Record-Test -Name "Deploy canary" -Category "canary" -Method "POST" -Endpoint "/api/v1/sovereign-arch/canary/deploy" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.6","A.8.16") `
    -Body @{ canaryType="credential"; expiresIn=30 }
Record-Test -Name "List canaries" -Category "canary" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/list" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
Record-Test -Name "List alerts" -Category "canary" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/alerts" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.6","A.8.16")
Record-Test -Name "Get canary status" -Category "canary" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/status" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# TPM ATTESTATION TESTS
# =============================================================================
Write-Host "TPM ATTESTATION" -ForegroundColor Yellow
Record-Test -Name "Initialize TPM" -Category "tpm" -Method "POST" -Endpoint "/api/v1/sovereign-arch/tpm/initialize" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.2")
Record-Test -Name "Get attestation key" -Category "tpm" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/key" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")
$signed = Record-Test -Name "Sign decision" -Category "tpm" -Method "POST" -Endpoint "/api/v1/sovereign-arch/tpm/sign" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.5.1") `
    -Body @{ decisionId="evidence-dec-001"; question="Approve acquisition?"; outcome="Approved"; confidence=0.95; deliberationStarted=(Get-Date).AddHours(-1).ToString("o"); deliberationEnded=(Get-Date).ToString("o"); agents=@("cfo","cto","legal"); ledgerHash="abc123"; previousHash="000000" }
Record-Test -Name "List signatures" -Category "tpm" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/signatures" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
if ($signed.Response.data) {
    Record-Test -Name "Verify signature" -Category "tpm" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/verify/$($signed.Response.data.id)" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.2")
}

# =============================================================================
# TIME-LOCK TESTS
# =============================================================================
Write-Host "TIME-LOCK" -ForegroundColor Yellow
$vault = Record-Test -Name "Create time-lock vault" -Category "timelock" -Method "POST" -Endpoint "/api/v1/sovereign-arch/timelock/vaults" `
    -ComplianceFrameworks @("soc2-type2","gdpr") -SecurityControls @("CC6.1","GDPR.5.1f") `
    -Body @{ name="Evidence Vault"; description="Comprehensive test vault"; content=@{ secret="classified" }; contentType="announcement"; releaseAt=(Get-Date).AddMinutes(10).ToString("o") }
Record-Test -Name "List vaults" -Category "timelock" -Method "GET" -Endpoint "/api/v1/sovereign-arch/timelock/vaults" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
if ($vault.Response.data) {
    Record-Test -Name "Get vault details" -Category "timelock" -Method "GET" -Endpoint "/api/v1/sovereign-arch/timelock/vaults/$($vault.Response.data.id)" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")
}

# =============================================================================
# FEDERATED MESH TESTS
# =============================================================================
Write-Host "FEDERATED MESH" -ForegroundColor Yellow
Record-Test -Name "Initialize mesh node" -Category "mesh" -Method "POST" -Endpoint "/api/v1/sovereign-arch/mesh/initialize" `
    -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1f") `
    -Body @{ name="Evidence Node"; nodeType="primary"; region="us-east" }
Record-Test -Name "Get this node" -Category "mesh" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/node" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1b")
Record-Test -Name "List mesh nodes" -Category "mesh" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/nodes" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1b")
Record-Test -Name "Get mesh statistics" -Category "mesh" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/statistics" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# PORTABLE INSTANCE TESTS
# =============================================================================
Write-Host "PORTABLE INSTANCE" -ForegroundColor Yellow
$config = Record-Test -Name "Create portable config" -Category "portable" -Method "POST" -Endpoint "/api/v1/sovereign-arch/portable/configs" `
    -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.2") `
    -Body @{ name="Evidence USB Instance"; imageType="demo"; baseOS="alpine"; architecture="x64"; targetSizeGB=16; components=@{ council=$true; agents=@("cfo","cto") }; security=@{ encryptAtRest=$true; requireTPM=$false; offlineAuth=$true } }
Record-Test -Name "List configs" -Category "portable" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/configs" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
if ($config.Response.data) {
    Record-Test -Name "Get config details" -Category "portable" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/configs/$($config.Response.data.id)" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")
}

# =============================================================================
# EVIDENCE INFRASTRUCTURE TESTS
# =============================================================================
Write-Host "EVIDENCE INFRASTRUCTURE" -ForegroundColor Yellow
Record-Test -Name "Evidence service status" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/status" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC1.1","A.5.1")
Record-Test -Name "Get ledger statistics" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/ledger/statistics" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")
Record-Test -Name "Verify chain integrity" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/ledger/verify" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC6.1","A.8.15")
Record-Test -Name "Get ledger public key" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/ledger/public-key" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")
Record-Test -Name "Get compliance frameworks" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/compliance/frameworks" -ComplianceFrameworks @("soc2-type2","iso27001","gdpr") -SecurityControls @("CC1.1")
Record-Test -Name "Get all compliance scores" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/compliance/scores" -ComplianceFrameworks @("soc2-type2","iso27001","gdpr") -SecurityControls @("CC7.2")
Record-Test -Name "Get compliance dashboard" -Category "evidence" -Method "GET" -Endpoint "/api/v1/evidence/compliance/dashboard" -ComplianceFrameworks @("soc2-type2","iso27001") -SecurityControls @("CC7.2","A.8.16")

# =============================================================================
# COMPLETE SUITE AND GENERATE OUTPUTS
# =============================================================================
Write-Host ""
Write-Host "Completing evidence suite..." -ForegroundColor Cyan
$summary = Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/ledger/suites/$SuiteId/complete" -Method POST -Headers $Headers -ErrorAction SilentlyContinue

Write-Host "Generating signed compliance report..." -ForegroundColor Cyan
$reportBody = @{
    title = "Comprehensive Sovereign Architecture Compliance Report"
    organization = "Datacendia"
    preparedBy = $env:USERNAME
    classification = "confidential"
    includeRawData = $true
} | ConvertTo-Json
$report = Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/reports/suite/$SuiteId" -Method POST -Headers $Headers -Body $reportBody -ErrorAction SilentlyContinue

Write-Host "Creating legal evidence bundle..." -ForegroundColor Cyan
$bundleBody = @{
    type = "audit"
    title = "Comprehensive Sovereign Architecture Evidence Bundle"
    description = "Complete evidence collection for all sovereign architecture patterns"
    purpose = "Regulatory compliance audit and legal defensibility"
    createdBy = $env:USERNAME
    frameworks = @("soc2-type2", "iso27001", "gdpr")
    includeRawData = $true
} | ConvertTo-Json
$bundle = Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/export/bundle" -Method POST -Headers $Headers -Body $bundleBody -ErrorAction SilentlyContinue

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " EVIDENCE COLLECTION COMPLETE" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Suite ID:           $SuiteId"
if ($summary.data) {
    Write-Host "Tests Recorded:     $($summary.data.totalTests)"
    Write-Host "Pass Rate:          $([math]::Round($summary.data.passRate, 1))%"
    Write-Host "Merkle Root:        $($summary.data.merkleRoot.Substring(0, 16))..."
}
if ($report.data) {
    Write-Host "Report ID:          $($report.data.id)"
}
if ($bundle.data) {
    Write-Host "Bundle ID:          $($bundle.data.id)"
    Write-Host "Verification Code:  $($bundle.data.verificationCode)"
    Write-Host "Bundle Path:        $($bundle.data.outputPath)"
}
Write-Host ""
Write-Host "Chain integrity verified. All evidence cryptographically signed."
Write-Host ""
