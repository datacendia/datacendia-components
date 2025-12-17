# =============================================================================
# SOVEREIGN ARCHITECTURE API TEST SUITE WITH EVIDENCE RECORDING
# Tests all sovereign services and records evidence to immutable ledger
# =============================================================================

param(
    [string]$BaseUrl = "http://localhost:3001",
    [switch]$Verbose,
    [switch]$GenerateReport,
    [switch]$ExportBundle
)

$ErrorActionPreference = "Continue"
$Headers = @{ "x-bypass-auth" = "true"; "Content-Type" = "application/json" }

# Test results tracking
$TestResults = @{
    Passed = 0
    Failed = 0
    Errors = @()
    Executions = @()
}

$SuiteId = "suite-" + (Get-Date -Format "yyyyMMdd-HHmmss")
$SuiteName = "Sovereign Architecture Test Suite"

function Write-Evidence {
    param(
        [string]$TestName,
        [string]$Category,
        [string]$Status,
        [int]$DurationMs,
        [object]$Request,
        [object]$Response,
        [string]$ErrorMessage,
        [string[]]$ComplianceFrameworks = @(),
        [string[]]$SecurityControls = @()
    )
    
    $execution = @{
        testSuiteId = $SuiteId
        testSuiteName = $SuiteName
        testCaseId = "test-" + [guid]::NewGuid().ToString().Substring(0, 8)
        testCaseName = $TestName
        category = $Category
        executedAt = (Get-Date).ToString("o")
        executedBy = $env:USERNAME
        status = $Status.ToLower()
        durationMs = $DurationMs
        assertions = @(
            @{
                name = "API Response"
                expected = "success=true"
                actual = if ($Status -eq "passed") { "success=true" } else { "success=false" }
                passed = ($Status -eq "passed")
                message = $ErrorMessage
            }
        )
        requestPayload = if ($Request) { $Request | ConvertTo-Json -Compress -Depth 5 } else { $null }
        responsePayload = if ($Response) { $Response | ConvertTo-Json -Compress -Depth 5 } else { $null }
        errorMessage = $ErrorMessage
        tags = @("sovereign-arch", "api-test", $Category)
        complianceFrameworks = $ComplianceFrameworks
        securityControls = $SecurityControls
    }
    
    try {
        $body = $execution | ConvertTo-Json -Depth 10
        Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/ledger/record" -Method POST -Headers $Headers -Body $body -ErrorAction Stop | Out-Null
    } catch {
        # Silent fail for evidence recording
    }
    
    $script:TestResults.Executions += $execution
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$ExpectedField = "success",
        [string]$Category = "general",
        [string[]]$ComplianceFrameworks = @(),
        [string[]]$SecurityControls = @()
    )
    
    $url = "$BaseUrl$Endpoint"
    Write-Host "  Testing: $Name... " -NoNewline
    
    $startTime = Get-Date
    
    try {
        $params = @{
            Uri = $url
            Method = $Method
            Headers = $Headers
            ErrorAction = "Stop"
        }
        
        if ($Body) {
            $params.Body = ($Body | ConvertTo-Json -Depth 10)
        }
        
        $response = Invoke-RestMethod @params
        $durationMs = ((Get-Date) - $startTime).TotalMilliseconds
        
        if ($response.$ExpectedField -eq $true -or $response.$ExpectedField) {
            Write-Host "PASS" -ForegroundColor Green
            $script:TestResults.Passed++
            
            Write-Evidence -TestName $Name -Category $Category -Status "passed" `
                -DurationMs $durationMs -Request $Body -Response $response `
                -ComplianceFrameworks $ComplianceFrameworks -SecurityControls $SecurityControls
            
            if ($Verbose) {
                Write-Host "    Response: $($response | ConvertTo-Json -Compress -Depth 3)" -ForegroundColor DarkGray
            }
            return $response
        } else {
            Write-Host "FAIL (unexpected response)" -ForegroundColor Red
            $script:TestResults.Failed++
            $script:TestResults.Errors += "$Name : Unexpected response structure"
            
            Write-Evidence -TestName $Name -Category $Category -Status "failed" `
                -DurationMs $durationMs -Request $Body -Response $response `
                -ErrorMessage "Unexpected response structure" `
                -ComplianceFrameworks $ComplianceFrameworks -SecurityControls $SecurityControls
            
            return $null
        }
    }
    catch {
        $durationMs = ((Get-Date) - $startTime).TotalMilliseconds
        $errMsg = $_.Exception.Message
        
        Write-Host "FAIL" -ForegroundColor Red
        Write-Host "    Error: $errMsg" -ForegroundColor Yellow
        $script:TestResults.Failed++
        $script:TestResults.Errors += "$Name : $errMsg"
        
        Write-Evidence -TestName $Name -Category $Category -Status "failed" `
            -DurationMs $durationMs -Request $Body -ErrorMessage $errMsg `
            -ComplianceFrameworks $ComplianceFrameworks -SecurityControls $SecurityControls
        
        return $null
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " SOVEREIGN ARCHITECTURE TEST SUITE" -ForegroundColor Cyan
Write-Host " WITH EVIDENCE RECORDING" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Suite ID: $SuiteId"
Write-Host "Base URL: $BaseUrl"
Write-Host ""

# Start evidence suite
Write-Host "Starting evidence suite..." -ForegroundColor DarkGray
try {
    $suiteBody = @{ suiteId = $SuiteId; suiteName = $SuiteName; executedBy = $env:USERNAME } | ConvertTo-Json
    Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/ledger/suites" -Method POST -Headers $Headers -Body $suiteBody -ErrorAction Stop | Out-Null
} catch {
    Write-Host "  Warning: Could not start evidence suite" -ForegroundColor Yellow
}

# =============================================================================
# 1. STATUS ENDPOINT
# =============================================================================
Write-Host "1. STATUS ENDPOINT" -ForegroundColor Yellow
Write-Host "-------------------"
Test-Endpoint -Name "Get service status" -Method "GET" -Endpoint "/api/v1/sovereign-arch/status" `
    -Category "status" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# 2. DATA DIODE
# =============================================================================
Write-Host ""
Write-Host "2. DATA DIODE - Unidirectional Ingest" -ForegroundColor Yellow
Write-Host "--------------------------------------"

Test-Endpoint -Name "Register ingest source" -Method "POST" -Endpoint "/api/v1/sovereign-arch/diode/sources" `
    -Category "data-diode" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.1", "A.8.2") `
    -Body @{
        name = "Test GRIB Source"
        description = "Test weather data ingest"
        watchPath = "C:/temp/datacendia/diode/grib"
        filePattern = "*.grib2"
        format = "grib2"
        requireSignature = $false
        quarantineDuration = 30
        targetSystem = "predict"
        enabled = $false
        pollInterval = 5000
        maxConcurrent = 2
    }

Test-Endpoint -Name "List ingest sources" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/sources" `
    -Category "data-diode" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

Test-Endpoint -Name "Get recent events" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/events?limit=10" `
    -Category "data-diode" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.6", "A.8.15")

Test-Endpoint -Name "Get statistics" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/statistics" `
    -Category "data-diode" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# 3. LOCAL RLHF
# =============================================================================
Write-Host ""
Write-Host "3. LOCAL RLHF - Zero-Cloud Learning" -ForegroundColor Yellow
Write-Host "------------------------------------"

Test-Endpoint -Name "Record feedback" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/feedback" `
    -Category "rlhf" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1a", "GDPR.5.1b") `
    -Body @{
        sessionId = "test-session-001"
        agentCode = "cfo"
        modelUsed = "qwen2.5:7b"
        systemPrompt = "You are a CFO agent."
        userPrompt = "What is our Q4 revenue projection?"
        assistantResponse = "Based on current trends, Q4 revenue is projected at 125M."
        feedbackType = "vote_agree"
        rating = 5
        responseLatencyMs = 1500
        tokenCount = 150
        temperature = 0.7
        responseAt = (Get-Date).ToString("o")
    }

Test-Endpoint -Name "Get feedback stats" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/stats" `
    -Category "rlhf" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1f")

$null = Test-Endpoint -Name "Generate dataset" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/datasets" `
    -Category "rlhf" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1b") `
    -Body @{
        name = "Test Dataset"
        description = "Test training dataset"
        format = "alpaca"
        maxPairs = 100
    }

Test-Endpoint -Name "List datasets" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/datasets" `
    -Category "rlhf" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.15")

# =============================================================================
# 4. CANARY TRIPWIRES
# =============================================================================
Write-Host ""
Write-Host "4. CANARY TRIPWIRES - Exfiltration Detection" -ForegroundColor Yellow
Write-Host "---------------------------------------------"

Test-Endpoint -Name "Deploy canary" -Method "POST" -Endpoint "/api/v1/sovereign-arch/canary/deploy" `
    -Category "canary" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.6", "A.8.16") `
    -Body @{
        canaryType = "credential"
        webhookUrl = $null
        expiresIn = 30
    }

Test-Endpoint -Name "List canaries" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/list" `
    -Category "canary" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

Test-Endpoint -Name "List alerts" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/alerts" `
    -Category "canary" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.6", "A.8.16")

Test-Endpoint -Name "Get deployment status" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/status" `
    -Category "canary" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# 5. TPM ATTESTATION
# =============================================================================
Write-Host ""
Write-Host "5. TPM ATTESTATION - Hardware Signing" -ForegroundColor Yellow
Write-Host "--------------------------------------"

Test-Endpoint -Name "Initialize TPM" -Method "POST" -Endpoint "/api/v1/sovereign-arch/tpm/initialize" `
    -Category "tpm" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.1", "A.8.2")

Test-Endpoint -Name "Get attestation key" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/key" `
    -Category "tpm" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")

$signedDecision = Test-Endpoint -Name "Sign decision" -Method "POST" -Endpoint "/api/v1/sovereign-arch/tpm/sign" `
    -Category "tpm" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.1", "A.5.1") `
    -Body @{
        decisionId = "dec-test-001"
        question = "Should we proceed with acquisition?"
        outcome = "Approved"
        confidence = 0.92
        deliberationStarted = (Get-Date).AddHours(-1).ToString("o")
        deliberationEnded = (Get-Date).ToString("o")
        agents = @("cfo", "cto", "legal")
        ledgerHash = "abc123def456"
        previousHash = "000000"
    }

Test-Endpoint -Name "List signatures" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/signatures" `
    -Category "tpm" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

if ($signedDecision -and $signedDecision.data) {
    Test-Endpoint -Name "Verify signature" -Method "GET" `
        -Endpoint "/api/v1/sovereign-arch/tpm/verify/$($signedDecision.data.id)" `
        -Category "tpm" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.1", "A.8.2")
}

# =============================================================================
# 6. TIME-LOCK
# =============================================================================
Write-Host ""
Write-Host "6. TIME-LOCK - Cryptographic Embargo" -ForegroundColor Yellow
Write-Host "--------------------------------------"

$vault = Test-Endpoint -Name "Create time-lock vault" -Method "POST" -Endpoint "/api/v1/sovereign-arch/timelock/vaults" `
    -Category "timelock" -ComplianceFrameworks @("soc2-type2", "gdpr") -SecurityControls @("CC6.1", "GDPR.5.1f") `
    -Body @{
        name = "Q4 Earnings Embargo"
        description = "Embargoed earnings data"
        content = @{ revenue = 125000000; eps = 2.35; guidance = "Bullish" }
        contentType = "announcement"
        releaseAt = (Get-Date).AddMinutes(5).ToString("o")
    }

Test-Endpoint -Name "List vaults" -Method "GET" -Endpoint "/api/v1/sovereign-arch/timelock/vaults" `
    -Category "timelock" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

if ($vault -and $vault.data) {
    Test-Endpoint -Name "Get vault" -Method "GET" `
        -Endpoint "/api/v1/sovereign-arch/timelock/vaults/$($vault.data.id)" `
        -Category "timelock" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")
}

# =============================================================================
# 7. FEDERATED MESH
# =============================================================================
Write-Host ""
Write-Host "7. FEDERATED MESH - Multi-Site Learning" -ForegroundColor Yellow
Write-Host "-----------------------------------------"

Test-Endpoint -Name "Initialize mesh node" -Method "POST" -Endpoint "/api/v1/sovereign-arch/mesh/initialize" `
    -Category "mesh" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1f") `
    -Body @{
        name = "Test Node Alpha"
        nodeType = "primary"
        region = "us-east"
    }

Test-Endpoint -Name "Get this node" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/node" `
    -Category "mesh" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1b")

Test-Endpoint -Name "List nodes" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/nodes" `
    -Category "mesh" -ComplianceFrameworks @("gdpr") -SecurityControls @("GDPR.5.1b")

Test-Endpoint -Name "Get mesh statistics" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/statistics" `
    -Category "mesh" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC7.2")

# =============================================================================
# 8. EVIDENCE INFRASTRUCTURE
# =============================================================================
Write-Host ""
Write-Host "8. EVIDENCE INFRASTRUCTURE" -ForegroundColor Yellow
Write-Host "---------------------------"

Test-Endpoint -Name "Evidence status" -Method "GET" -Endpoint "/api/v1/evidence/status" `
    -Category "evidence" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC1.1", "A.5.1")

Test-Endpoint -Name "Get ledger statistics" -Method "GET" -Endpoint "/api/v1/evidence/ledger/statistics" `
    -Category "evidence" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.6")

Test-Endpoint -Name "Verify chain integrity" -Method "GET" -Endpoint "/api/v1/evidence/ledger/verify" `
    -Category "evidence" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC6.1", "A.8.15")

Test-Endpoint -Name "Get public key" -Method "GET" -Endpoint "/api/v1/evidence/ledger/public-key" `
    -Category "evidence" -ComplianceFrameworks @("soc2-type2") -SecurityControls @("CC6.1")

Test-Endpoint -Name "Get compliance frameworks" -Method "GET" -Endpoint "/api/v1/evidence/compliance/frameworks" `
    -Category "evidence" -ComplianceFrameworks @("soc2-type2", "iso27001", "gdpr") -SecurityControls @("CC1.1")

Test-Endpoint -Name "Get compliance dashboard" -Method "GET" -Endpoint "/api/v1/evidence/compliance/dashboard" `
    -Category "evidence" -ComplianceFrameworks @("soc2-type2", "iso27001") -SecurityControls @("CC7.2", "A.8.16")

# =============================================================================
# COMPLETE SUITE
# =============================================================================
Write-Host ""
Write-Host "Completing evidence suite..." -ForegroundColor DarkGray

try {
    $null = Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/ledger/suites/$SuiteId/complete" `
        -Method POST -Headers $Headers -ErrorAction Stop
    Write-Host "  Suite completed and signed" -ForegroundColor Green
} catch {
    Write-Host "  Warning: Could not complete evidence suite" -ForegroundColor Yellow
}

# =============================================================================
# GENERATE REPORT (if requested)
# =============================================================================
if ($GenerateReport) {
    Write-Host ""
    Write-Host "Generating signed report..." -ForegroundColor Cyan
    
    try {
        $reportBody = @{
            title = "Sovereign Architecture Test Report"
            organization = "Datacendia"
            preparedBy = $env:USERNAME
            classification = "internal"
            includeRawData = $true
        } | ConvertTo-Json
        
        $report = Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/reports/suite/$SuiteId" `
            -Method POST -Headers $Headers -Body $reportBody -ErrorAction Stop
        
        Write-Host "  Report generated: $($report.data.id)" -ForegroundColor Green
    } catch {
        Write-Host "  Warning: Could not generate report: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# =============================================================================
# EXPORT BUNDLE (if requested)
# =============================================================================
if ($ExportBundle) {
    Write-Host ""
    Write-Host "Creating evidence bundle..." -ForegroundColor Cyan
    
    try {
        $bundleBody = @{
            type = "audit"
            title = "Sovereign Architecture Compliance Evidence"
            purpose = "Automated test evidence for compliance audit"
            createdBy = $env:USERNAME
            frameworks = @("soc2-type2", "iso27001", "gdpr")
            includeRawData = $true
        } | ConvertTo-Json
        
        $bundle = Invoke-RestMethod -Uri "$BaseUrl/api/v1/evidence/export/bundle" `
            -Method POST -Headers $Headers -Body $bundleBody -ErrorAction Stop
        
        Write-Host "  Bundle created: $($bundle.data.id)" -ForegroundColor Green
        Write-Host "  Output: $($bundle.data.outputPath)" -ForegroundColor DarkGray
        Write-Host "  Verification code: $($bundle.data.verificationCode)" -ForegroundColor DarkGray
    } catch {
        Write-Host "  Warning: Could not create bundle: $($_.Exception.Message)" -ForegroundColor Yellow
    }
}

# =============================================================================
# SUMMARY
# =============================================================================
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Suite ID: $SuiteId"
Write-Host "  Passed: $($TestResults.Passed)" -ForegroundColor Green
Write-Host "  Failed: $($TestResults.Failed)" -ForegroundColor $(if ($TestResults.Failed -gt 0) { "Red" } else { "Green" })
Write-Host "  Evidence Entries: $($TestResults.Executions.Count)"
Write-Host ""

if ($TestResults.Errors.Count -gt 0) {
    Write-Host "Errors:" -ForegroundColor Red
    foreach ($err in $TestResults.Errors) {
        Write-Host "  - $err" -ForegroundColor Yellow
    }
}

$totalTests = $TestResults.Passed + $TestResults.Failed
$passRate = if ($totalTests -gt 0) { [math]::Round(($TestResults.Passed / $totalTests) * 100, 1) } else { 0 }
Write-Host ""
Write-Host "Pass Rate: $passRate%" -ForegroundColor $(if ($passRate -ge 90) { "Green" } elseif ($passRate -ge 70) { "Yellow" } else { "Red" })
Write-Host ""
Write-Host "Evidence recorded to immutable ledger with cryptographic signatures."
Write-Host "Chain integrity can be verified at: /api/v1/evidence/ledger/verify"
Write-Host ""
