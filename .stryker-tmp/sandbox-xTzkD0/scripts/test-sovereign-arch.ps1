# =============================================================================
# SOVEREIGN ARCHITECTURE API TEST SUITE
# Tests all 11 sovereign services to enterprise platinum standard
# =============================================================================

param(
    [string]$BaseUrl = "http://localhost:3001",
    [switch]$Verbose
)

$ErrorActionPreference = "Continue"
$Headers = @{ "x-bypass-auth" = "true"; "Content-Type" = "application/json" }

# Test results tracking
$TestResults = @{
    Passed = 0
    Failed = 0
    Errors = @()
}

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Endpoint,
        [object]$Body = $null,
        [string]$ExpectedField = "success"
    )
    
    $url = "$BaseUrl$Endpoint"
    Write-Host "  Testing: $Name... " -NoNewline
    
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
        
        if ($response.$ExpectedField -eq $true -or $response.$ExpectedField) {
            Write-Host "PASS" -ForegroundColor Green
            $script:TestResults.Passed++
            if ($Verbose) {
                Write-Host "    Response: $($response | ConvertTo-Json -Compress -Depth 3)" -ForegroundColor DarkGray
            }
            return $response
        } else {
            Write-Host "FAIL (unexpected response)" -ForegroundColor Red
            $script:TestResults.Failed++
            $script:TestResults.Errors += "$Name : Unexpected response structure"
            return $null
        }
    }
    catch {
        $errMsg = $_.Exception.Message
        if ($_.Exception.Response) {
            try {
                $reader = [System.IO.StreamReader]::new($_.Exception.Response.GetResponseStream())
                $errBody = $reader.ReadToEnd()
                $errMsg = $errBody
            } catch {}
        }
        Write-Host "FAIL" -ForegroundColor Red
        Write-Host "    Error: $errMsg" -ForegroundColor Yellow
        $script:TestResults.Failed++
        $script:TestResults.Errors += "$Name : $errMsg"
        return $null
    }
}

Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " SOVEREIGN ARCHITECTURE API TEST SUITE" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host "Base URL: $BaseUrl"
Write-Host ""

# =============================================================================
# 1. STATUS ENDPOINT
# =============================================================================
Write-Host "1. STATUS ENDPOINT" -ForegroundColor Yellow
Write-Host "-------------------"
Test-Endpoint -Name "Get service status" -Method "GET" -Endpoint "/api/v1/sovereign-arch/status"

# =============================================================================
# 2. DATA DIODE
# =============================================================================
Write-Host ""
Write-Host "2. DATA DIODE - Unidirectional Ingest" -ForegroundColor Yellow
Write-Host "--------------------------------------"

$null = Test-Endpoint -Name "Register ingest source" -Method "POST" -Endpoint "/api/v1/sovereign-arch/diode/sources" -Body @{
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

Test-Endpoint -Name "List ingest sources" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/sources"
Test-Endpoint -Name "Get recent events" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/events?limit=10"
Test-Endpoint -Name "Get statistics" -Method "GET" -Endpoint "/api/v1/sovereign-arch/diode/statistics"

# =============================================================================
# 3. LOCAL RLHF
# =============================================================================
Write-Host ""
Write-Host "3. LOCAL RLHF - Zero-Cloud Learning" -ForegroundColor Yellow
Write-Host "------------------------------------"

$null = Test-Endpoint -Name "Record feedback" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/feedback" -Body @{
    sessionId = "test-session-001"
    agentCode = "cfo"
    modelUsed = "qwen2.5:7b"
    systemPrompt = "You are a CFO agent."
    userPrompt = "What is our Q4 revenue projection?"
    assistantResponse = "Based on current trends, Q4 revenue is projected at $125M."
    feedbackType = "vote_agree"
    rating = 5
    responseLatencyMs = 1500
    tokenCount = 150
    temperature = 0.7
    responseAt = (Get-Date).ToString("o")
}

Test-Endpoint -Name "Get feedback stats" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/stats"

$dataset = Test-Endpoint -Name "Generate dataset" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/datasets" -Body @{
    name = "Test Dataset"
    description = "Test training dataset"
    format = "alpaca"
    maxPairs = 100
}

Test-Endpoint -Name "List datasets" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/datasets"

if ($dataset -and $dataset.data) {
    $loraConfig = Test-Endpoint -Name "Create LoRA config" -Method "POST" -Endpoint "/api/v1/sovereign-arch/rlhf/lora" -Body @{
        name = "Test LoRA"
        baseModel = "qwen2.5:7b"
        datasetId = $dataset.data.id
        r = 16
        alpha = 32
        epochs = 3
    }
    
    if ($loraConfig -and $loraConfig.data) {
        Test-Endpoint -Name "Generate training script" -Method "GET" -Endpoint "/api/v1/sovereign-arch/rlhf/lora/$($loraConfig.data.id)/script"
    }
}

# =============================================================================
# 4. DECISION DNA
# =============================================================================
Write-Host ""
Write-Host "4. DECISION DNA - Audit Export" -ForegroundColor Yellow
Write-Host "-------------------------------"

# First get a deliberation ID
$deliberations = $null
try {
    $deliberations = Invoke-RestMethod -Uri "$BaseUrl/api/v1/deliberations" -Method GET -Headers $Headers -ErrorAction SilentlyContinue
} catch {}

if ($deliberations -and $deliberations.data -and $deliberations.data.Count -gt 0) {
    $testDelibId = $deliberations.data[0].id
    Test-Endpoint -Name "Generate DNA" -Method "POST" -Endpoint "/api/v1/sovereign-arch/dna/generate/$testDelibId" -Body @{
        format = "full"
        outputFormat = "bundle"
        includeRawData = $true
        redactPII = $false
    }
    Test-Endpoint -Name "Export DNA bundle" -Method "POST" -Endpoint "/api/v1/sovereign-arch/dna/export/$testDelibId" -Body @{}
} else {
    Write-Host "  Skipping DNA tests (no deliberations found)" -ForegroundColor DarkGray
}

# =============================================================================
# 5. SHADOW COUNCIL
# =============================================================================
Write-Host ""
Write-Host "5. SHADOW COUNCIL - Sandbox Deliberation" -ForegroundColor Yellow
Write-Host "-----------------------------------------"

$shadowSession = Test-Endpoint -Name "Create shadow session" -Method "POST" -Endpoint "/api/v1/sovereign-arch/shadow/sessions" -Body @{
    name = "Test Shadow Session"
    description = "Testing radical restructuring ideas"
    purpose = "exploration"
    durationHours = 2
    config = @{
        sandboxLedger = $true
        watermarkResponses = $true
        allowHallucination = $false
    }
}

Test-Endpoint -Name "List shadow sessions" -Method "GET" -Endpoint "/api/v1/sovereign-arch/shadow/sessions"

if ($shadowSession -and $shadowSession.data) {
    $sessionId = $shadowSession.data.id
    Test-Endpoint -Name "Get shadow session" -Method "GET" -Endpoint "/api/v1/sovereign-arch/shadow/sessions/$sessionId"
    
    $null = Test-Endpoint -Name "Start shadow deliberation" -Method "POST" -Endpoint "/api/v1/sovereign-arch/shadow/sessions/$sessionId/deliberate" -Body @{
        question = "What if we pivoted to B2B SaaS?"
        context = "Current B2C model struggling"
        agents = @("cfo", "cto", "cmo")
    }
    
    # Wait for deliberation to complete
    Start-Sleep -Seconds 2
    
    Test-Endpoint -Name "Close shadow session" -Method "POST" -Endpoint "/api/v1/sovereign-arch/shadow/sessions/$sessionId/close"
}

# =============================================================================
# 6. DETERMINISTIC REPLAY
# =============================================================================
Write-Host ""
Write-Host "6. DETERMINISTIC REPLAY - Reproducibility" -ForegroundColor Yellow
Write-Host "------------------------------------------"

$captureStart = Test-Endpoint -Name "Start state capture" -Method "POST" -Endpoint "/api/v1/sovereign-arch/replay/capture/start" -Body @{
    deliberationId = "test-delib-001"
}

if ($captureStart -and $captureStart.data) {
    $stateId = $captureStart.data.stateId
    Test-Endpoint -Name "Complete state capture" -Method "POST" -Endpoint "/api/v1/sovereign-arch/replay/capture/$stateId/complete"
    Test-Endpoint -Name "Verify state" -Method "GET" -Endpoint "/api/v1/sovereign-arch/replay/$stateId/verify"
}

Test-Endpoint -Name "List replay states" -Method "GET" -Endpoint "/api/v1/sovereign-arch/replay/states"

# =============================================================================
# 7. QR AIR-GAP BRIDGE
# =============================================================================
Write-Host ""
Write-Host "7. QR AIR-GAP BRIDGE - Zero-Media Transfer" -ForegroundColor Yellow
Write-Host "-------------------------------------------"

$qrPayload = Test-Endpoint -Name "Create QR payload" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/payload" -Body @{
    type = "decision"
    data = @{
        id = "dec-001"
        title = "Q4 Budget Approval"
        outcome = "Approved with conditions"
        confidence = 0.87
    }
    sourceSystem = "council"
    sourceId = "test-decision-001"
}

if ($qrPayload -and $qrPayload.data) {
    Test-Endpoint -Name "Generate QR sequence" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/sequence/$($qrPayload.data.id)"
}

Test-Endpoint -Name "Quick export" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/export" -Body @{
    type = "alert"
    data = @{
        id = "alert-001"
        severity = "high"
        title = "Security Alert"
        message = "Anomaly detected"
    }
    sourceSystem = "aegis"
    sourceId = "alert-001"
}

$null = Test-Endpoint -Name "Start capture session" -Method "POST" -Endpoint "/api/v1/sovereign-arch/qr/capture/start" -Body @{}

# =============================================================================
# 8. CANARY TRIPWIRES
# =============================================================================
Write-Host ""
Write-Host "8. CANARY TRIPWIRES - Exfiltration Detection" -ForegroundColor Yellow
Write-Host "---------------------------------------------"

$null = Test-Endpoint -Name "Deploy canary" -Method "POST" -Endpoint "/api/v1/sovereign-arch/canary/deploy" -Body @{
    canaryType = "credential"
    webhookUrl = $null
    expiresIn = 30
}

Test-Endpoint -Name "Deploy canary network" -Method "POST" -Endpoint "/api/v1/sovereign-arch/canary/deploy-network" -Body @{
    types = @("decision", "financial", "credential")
    countPerType = 1
}

Test-Endpoint -Name "List canaries" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/list"
Test-Endpoint -Name "List alerts" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/alerts"
Test-Endpoint -Name "Get deployment status" -Method "GET" -Endpoint "/api/v1/sovereign-arch/canary/status"

# =============================================================================
# 9. TPM ATTESTATION
# =============================================================================
Write-Host ""
Write-Host "9. TPM ATTESTATION - Hardware Signing" -ForegroundColor Yellow
Write-Host "--------------------------------------"

$null = Test-Endpoint -Name "Initialize TPM" -Method "POST" -Endpoint "/api/v1/sovereign-arch/tpm/initialize"
Test-Endpoint -Name "Get attestation key" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/key"

$signedDecision = Test-Endpoint -Name "Sign decision" -Method "POST" -Endpoint "/api/v1/sovereign-arch/tpm/sign" -Body @{
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

Test-Endpoint -Name "List signatures" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/signatures"

if ($signedDecision -and $signedDecision.data) {
    Test-Endpoint -Name "Verify signature" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/verify/$($signedDecision.data.id)"
    Test-Endpoint -Name "Export verification bundle" -Method "GET" -Endpoint "/api/v1/sovereign-arch/tpm/export/$($signedDecision.data.id)"
}

# =============================================================================
# 10. TIME-LOCK
# =============================================================================
Write-Host ""
Write-Host "10. TIME-LOCK - Cryptographic Embargo" -ForegroundColor Yellow
Write-Host "--------------------------------------"

$vault = Test-Endpoint -Name "Create time-lock vault" -Method "POST" -Endpoint "/api/v1/sovereign-arch/timelock/vaults" -Body @{
    name = "Q4 Earnings Embargo"
    description = "Embargoed earnings data"
    content = @{
        revenue = 125000000
        eps = 2.35
        guidance = "Bullish"
    }
    contentType = "announcement"
    releaseAt = (Get-Date).AddMinutes(5).ToString("o")
}

Test-Endpoint -Name "List vaults" -Method "GET" -Endpoint "/api/v1/sovereign-arch/timelock/vaults"

if ($vault -and $vault.data) {
    Test-Endpoint -Name "Get vault" -Method "GET" -Endpoint "/api/v1/sovereign-arch/timelock/vaults/$($vault.data.id)"
    
    # This should correctly return 403 when vault is locked
    Write-Host "  Testing: Get vault content (expected 403 - locked)... " -NoNewline
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/v1/sovereign-arch/timelock/vaults/$($vault.data.id)/content" -Method GET -Headers $Headers -ErrorAction Stop
        Write-Host "FAIL (should have returned 403)" -ForegroundColor Red
        $script:TestResults.Failed++
    } catch {
        if ($_.Exception.Response.StatusCode -eq 403 -or $_.Exception.Message -match "403") {
            Write-Host "PASS (correctly blocked)" -ForegroundColor Green
            $script:TestResults.Passed++
        } else {
            Write-Host "FAIL (unexpected error)" -ForegroundColor Red
            $script:TestResults.Failed++
        }
    }
}

# =============================================================================
# 11. FEDERATED MESH
# =============================================================================
Write-Host ""
Write-Host "11. FEDERATED MESH - Multi-Site Learning" -ForegroundColor Yellow
Write-Host "-----------------------------------------"

$null = Test-Endpoint -Name "Initialize mesh node" -Method "POST" -Endpoint "/api/v1/sovereign-arch/mesh/initialize" -Body @{
    name = "Test Node Alpha"
    nodeType = "primary"
    region = "us-east"
}

Test-Endpoint -Name "Get this node" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/node"
Test-Endpoint -Name "List nodes" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/nodes"

# Create a simple delta (base64 encoded random data)
$deltaData = [Convert]::ToBase64String([System.Text.Encoding]::UTF8.GetBytes("test-delta-weights"))

$delta = Test-Endpoint -Name "Create model delta" -Method "POST" -Endpoint "/api/v1/sovereign-arch/mesh/deltas" -Body @{
    deltaType = "lora_adapter"
    baseModel = "qwen2.5:7b"
    deltaData = $deltaData
    trainingDataSummary = @{
        sampleCount = 500
        positiveCount = 350
        negativeCount = 150
        agentsCovered = @("cfo", "cto")
        topicsCovered = @("finance", "technology")
        averageConfidence = 0.85
        dataStartDate = (Get-Date).AddDays(-30).ToString("o")
        dataEndDate = (Get-Date).ToString("o")
    }
}

Test-Endpoint -Name "List deltas" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/deltas"
Test-Endpoint -Name "Get mesh statistics" -Method "GET" -Endpoint "/api/v1/sovereign-arch/mesh/statistics"

if ($delta -and $delta.data) {
    Test-Endpoint -Name "Create export manifest" -Method "POST" -Endpoint "/api/v1/sovereign-arch/mesh/export" -Body @{
        deltaIds = @($delta.data.id)
        transportFormat = "usb"
    }
}

# =============================================================================
# 12. PORTABLE INSTANCE
# =============================================================================
Write-Host ""
Write-Host "12. PORTABLE INSTANCE - USB Deployment" -ForegroundColor Yellow
Write-Host "---------------------------------------"

$portableConfig = Test-Endpoint -Name "Create portable config" -Method "POST" -Endpoint "/api/v1/sovereign-arch/portable/configs" -Body @{
    name = "Demo USB Instance"
    imageType = "demo"
    baseOS = "alpine"
    targetSizeGB = 16
    branding = @{
        companyName = "Datacendia Demo"
        primaryColor = "#6366f1"
        welcomeTitle = "Welcome to Datacendia"
    }
}

Test-Endpoint -Name "List configs" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/configs"

if ($portableConfig -and $portableConfig.data) {
    Test-Endpoint -Name "Get config" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/configs/$($portableConfig.data.id)"
    
    $image = Test-Endpoint -Name "Build image" -Method "POST" -Endpoint "/api/v1/sovereign-arch/portable/build/$($portableConfig.data.id)"
    
    if ($image -and $image.data) {
        # Wait for build
        Start-Sleep -Seconds 3
        Test-Endpoint -Name "Get build progress" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/images/$($image.data.id)/progress"
        Test-Endpoint -Name "Get image" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/images/$($image.data.id)"
    }
}

Test-Endpoint -Name "List images" -Method "GET" -Endpoint "/api/v1/sovereign-arch/portable/images"

# =============================================================================
# SUMMARY
# =============================================================================
Write-Host ""
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host " TEST RESULTS SUMMARY" -ForegroundColor Cyan
Write-Host "=============================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "  Passed: $($TestResults.Passed)" -ForegroundColor Green
Write-Host "  Failed: $($TestResults.Failed)" -ForegroundColor $(if ($TestResults.Failed -gt 0) { "Red" } else { "Green" })
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
