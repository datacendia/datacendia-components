# =============================================================================
# DATACENDIA - Board Meeting Load Test
# Simulates concurrent deliberation requests to stress-test the Council system
# =============================================================================

param(
    [int]$ConcurrentRequests = 5,
    [int]$TotalRequests = 10,
    [string]$BaseUrl = "http://localhost:3001"
)

$ErrorActionPreference = "Continue"

Write-Host "`n========================================" -ForegroundColor Cyan
Write-Host "  DATACENDIA BOARD MEETING LOAD TEST" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Concurrent Requests: $ConcurrentRequests"
Write-Host "Total Requests: $TotalRequests"
Write-Host "Base URL: $BaseUrl"
Write-Host ""

# Test scenarios simulating different board meeting topics
$scenarios = @(
    @{
        title = "Q4 Budget Approval"
        question = "Should we approve the Q4 budget allocation of $2.5M for the new cloud infrastructure initiative?"
        agents = @("cfo", "cto", "coo")
        context = "Budget review meeting for infrastructure modernization"
    },
    @{
        title = "New Market Expansion"
        question = "Should we expand into the European market in Q1 2025 given current economic conditions?"
        agents = @("cfo", "cmo", "coo")
        context = "Strategic planning for international expansion"
    },
    @{
        title = "Security Policy Update"
        question = "Should we implement zero-trust architecture across all systems by end of year?"
        agents = @("ciso", "cto", "cfo")
        context = "Cybersecurity posture review"
    },
    @{
        title = "Hiring Freeze Decision"
        question = "Should we implement a hiring freeze for Q1 to manage costs during market uncertainty?"
        agents = @("chro", "cfo", "coo")
        context = "Workforce planning discussion"
    },
    @{
        title = "Product Launch Timeline"
        question = "Should we accelerate the product launch from March to January given competitor activity?"
        agents = @("cmo", "cto", "coo")
        context = "Go-to-market strategy session"
    }
)

# Results tracking
$results = @{
    success = 0
    failed = 0
    totalTime = 0
    responseTimes = @()
    errors = @()
}

# Function to create a deliberation
function Start-Deliberation {
    param($scenario, $index)
    
    $startTime = Get-Date
    $body = @{
        question = "$($scenario.title): $($scenario.question)"
        config = @{
            mode = "war-room"
            agents = $scenario.agents
        }
    } | ConvertTo-Json -Depth 3
    
    try {
        $response = Invoke-RestMethod -Uri "$BaseUrl/api/v1/deliberations" `
            -Method Post `
            -ContentType "application/json" `
            -Body $body `
            -TimeoutSec 30
        
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalMilliseconds
        
        return @{
            success = $true
            duration = $duration
            deliberationId = $response.data.id
            title = $scenario.title
        }
    }
    catch {
        $endTime = Get-Date
        $duration = ($endTime - $startTime).TotalMilliseconds
        
        return @{
            success = $false
            duration = $duration
            error = $_.Exception.Message
            title = $scenario.title
        }
    }
}

# Pre-flight check
Write-Host "Pre-flight checks..." -ForegroundColor Yellow
try {
    $healthCheck = Invoke-RestMethod -Uri "$BaseUrl/api/v1/council/agents" -Method Get -TimeoutSec 5
    Write-Host "  [OK] Council API accessible" -ForegroundColor Green
    Write-Host "  [OK] $($healthCheck.data.Count) agents available" -ForegroundColor Green
}
catch {
    Write-Host "  [FAIL] Council API not accessible: $($_.Exception.Message)" -ForegroundColor Red
    exit 1
}

# Check Ollama
try {
    $ollamaCheck = Invoke-RestMethod -Uri "http://localhost:11434/api/tags" -Method Get -TimeoutSec 5
    Write-Host "  [OK] Ollama accessible with $($ollamaCheck.models.Count) models" -ForegroundColor Green
}
catch {
    Write-Host "  [WARN] Ollama not accessible - deliberations may fail" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Starting load test..." -ForegroundColor Yellow
Write-Host ""

$overallStart = Get-Date
$completedRequests = 0
$runningJobs = @()

# Process requests in batches
for ($batch = 0; $batch -lt [Math]::Ceiling($TotalRequests / $ConcurrentRequests); $batch++) {
    $batchStart = $batch * $ConcurrentRequests
    $batchEnd = [Math]::Min($batchStart + $ConcurrentRequests, $TotalRequests)
    $batchSize = $batchEnd - $batchStart
    
    Write-Host "Batch $($batch + 1): Requests $($batchStart + 1) - $batchEnd" -ForegroundColor Cyan
    
    # Start concurrent requests
    $jobs = @()
    for ($i = $batchStart; $i -lt $batchEnd; $i++) {
        $scenario = $scenarios[$i % $scenarios.Count]
        $jobs += Start-Job -ScriptBlock {
            param($BaseUrl, $scenario, $index)
            
            $body = @{
                question = "$($scenario.title): $($scenario.question)"
                config = @{
                    mode = "war-room"
                    agents = $scenario.agents
                }
            } | ConvertTo-Json -Depth 3
            
            $startTime = Get-Date
            try {
                $response = Invoke-RestMethod -Uri "$BaseUrl/api/v1/deliberations" `
                    -Method Post `
                    -ContentType "application/json" `
                    -Body $body `
                    -TimeoutSec 60
                
                $endTime = Get-Date
                $duration = ($endTime - $startTime).TotalMilliseconds
                
                return @{
                    success = $true
                    duration = $duration
                    deliberationId = $response.data.id
                    title = $scenario.title
                    index = $index
                }
            }
            catch {
                $endTime = Get-Date
                $duration = ($endTime - $startTime).TotalMilliseconds
                
                return @{
                    success = $false
                    duration = $duration
                    error = $_.Exception.Message
                    title = $scenario.title
                    index = $index
                }
            }
        } -ArgumentList $BaseUrl, $scenario, ($i + 1)
    }
    
    # Wait for batch to complete
    $jobResults = $jobs | Wait-Job -Timeout 120 | Receive-Job
    $jobs | Remove-Job -Force
    
    # Process results
    foreach ($result in $jobResults) {
        if ($result.success) {
            $results.success++
            Write-Host "  [OK] #$($result.index) $($result.title) - $([math]::Round($result.duration))ms - ID: $($result.deliberationId)" -ForegroundColor Green
        }
        else {
            $results.failed++
            Write-Host "  [FAIL] #$($result.index) $($result.title) - $([math]::Round($result.duration))ms - $($result.error)" -ForegroundColor Red
            $results.errors += $result.error
        }
        $results.responseTimes += $result.duration
    }
    
    Write-Host ""
}

$overallEnd = Get-Date
$totalDuration = ($overallEnd - $overallStart).TotalSeconds

# Calculate statistics
$avgResponseTime = if ($results.responseTimes.Count -gt 0) { 
    [math]::Round(($results.responseTimes | Measure-Object -Average).Average) 
} else { 0 }

$maxResponseTime = if ($results.responseTimes.Count -gt 0) { 
    [math]::Round(($results.responseTimes | Measure-Object -Maximum).Maximum) 
} else { 0 }

$minResponseTime = if ($results.responseTimes.Count -gt 0) { 
    [math]::Round(($results.responseTimes | Measure-Object -Minimum).Minimum) 
} else { 0 }

$successRate = if ($TotalRequests -gt 0) { 
    [math]::Round(($results.success / $TotalRequests) * 100, 1) 
} else { 0 }

$throughput = [math]::Round($TotalRequests / $totalDuration, 2)

# Print summary
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "           LOAD TEST RESULTS" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Total Requests:     $TotalRequests"
Write-Host "Successful:         $($results.success)" -ForegroundColor Green
Write-Host "Failed:             $($results.failed)" -ForegroundColor $(if ($results.failed -gt 0) { "Red" } else { "Green" })
Write-Host "Success Rate:       $successRate%"
Write-Host ""
Write-Host "Total Duration:     $([math]::Round($totalDuration, 2))s"
Write-Host "Throughput:         $throughput req/s"
Write-Host ""
Write-Host "Response Times:"
Write-Host "  Average:          ${avgResponseTime}ms"
Write-Host "  Min:              ${minResponseTime}ms"
Write-Host "  Max:              ${maxResponseTime}ms"
Write-Host ""

if ($results.errors.Count -gt 0) {
    Write-Host "Unique Errors:" -ForegroundColor Yellow
    $results.errors | Select-Object -Unique | ForEach-Object {
        Write-Host "  - $_" -ForegroundColor Red
    }
}

# Return exit code based on success rate
if ($successRate -ge 80) {
    Write-Host "`n[PASS] Load test passed with $successRate% success rate" -ForegroundColor Green
    exit 0
}
else {
    Write-Host "`n[FAIL] Load test failed with $successRate% success rate" -ForegroundColor Red
    exit 1
}
