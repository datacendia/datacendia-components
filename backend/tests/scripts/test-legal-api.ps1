# Legal Research API Test Script
# Run this while the backend is running: npm run dev
# Usage: .\test-legal-api.ps1

$baseUrl = "http://localhost:3001/api/v1/legal-research"

Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "LEGAL RESEARCH API TEST SUITE" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan

# Test 1: Service Status
Write-Host "`n[1] Testing Service Status..." -ForegroundColor Yellow
try {
    $status = Invoke-RestMethod -Uri "$baseUrl/status" -Method GET
    Write-Host "  Status: $($status.success)" -ForegroundColor Green
    Write-Host "  Available Sources: $($status.availableSources -join ', ')"
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 2: Case Law Search
Write-Host "`n[2] Testing Case Law Search..." -ForegroundColor Yellow
try {
    $body = @{ query = "trade secret misappropriation"; limit = 3 } | ConvertTo-Json
    $cases = Invoke-RestMethod -Uri "$baseUrl/cases" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Found: $($cases.count) cases" -ForegroundColor Green
    if ($cases.results.Count -gt 0) {
        Write-Host "  Sample: $($cases.results[0].title)"
    }
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 3: Federal Regulations Search
Write-Host "`n[3] Testing CFR Search..." -ForegroundColor Yellow
try {
    $body = @{ query = "overtime pay"; title = 29; limit = 3 } | ConvertTo-Json
    $regs = Invoke-RestMethod -Uri "$baseUrl/regulations" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Found: $($regs.count) regulations" -ForegroundColor Green
    if ($regs.results.Count -gt 0) {
        Write-Host "  Sample: $($regs.results[0].citation)"
    }
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 4: State Bills Search
Write-Host "`n[4] Testing State Bills Search..." -ForegroundColor Yellow
try {
    $body = @{ query = "employment"; state = "ca"; limit = 3 } | ConvertTo-Json
    $bills = Invoke-RestMethod -Uri "$baseUrl/bills" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Found: $($bills.count) bills" -ForegroundColor Green
    if ($bills.results.Count -gt 0) {
        Write-Host "  Sample: $($bills.results[0].title.Substring(0, [Math]::Min(60, $bills.results[0].title.Length)))..."
    }
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 5: Federal Register Search
Write-Host "`n[5] Testing Federal Register Search..." -ForegroundColor Yellow
try {
    $body = @{ query = "labor"; type = "RULE"; days = 90; limit = 3 } | ConvertTo-Json
    $fr = Invoke-RestMethod -Uri "$baseUrl/federal-register" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Found: $($fr.count) documents" -ForegroundColor Green
    if ($fr.results.Count -gt 0) {
        Write-Host "  Sample: $($fr.results[0].title.Substring(0, [Math]::Min(60, $fr.results[0].title.Length)))..."
    }
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 6: SEC Filings Search
Write-Host "`n[6] Testing SEC EDGAR Search..." -ForegroundColor Yellow
try {
    $body = @{ cik = "320193"; form = "10-K"; limit = 3 } | ConvertTo-Json
    $sec = Invoke-RestMethod -Uri "$baseUrl/sec" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Found: $($sec.count) filings" -ForegroundColor Green
    if ($sec.results.Count -gt 0) {
        Write-Host "  Sample: $($sec.results[0].title)"
    }
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 7: Unified Search
Write-Host "`n[7] Testing Unified Search..." -ForegroundColor Yellow
try {
    $body = @{ query = "employment discrimination"; sources = @("cases", "regulations"); limit = 2 } | ConvertTo-Json
    $unified = Invoke-RestMethod -Uri "$baseUrl/unified" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Found: $($unified.count) total results" -ForegroundColor Green
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 8: Tool Execution
Write-Host "`n[8] Testing Tool Execution..." -ForegroundColor Yellow
try {
    $body = @{ tool = "search_cases"; params = @{ query = "breach of contract"; limit = 2 } } | ConvertTo-Json -Depth 3
    $tool = Invoke-RestMethod -Uri "$baseUrl/execute-tool" -Method POST -Body $body -ContentType "application/json"
    Write-Host "  Success: $($tool.success)" -ForegroundColor Green
    Write-Host "  Source: $($tool.source)"
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

# Test 9: Tool Call History
Write-Host "`n[9] Testing Tool Call History..." -ForegroundColor Yellow
try {
    $history = Invoke-RestMethod -Uri "$baseUrl/history" -Method GET
    Write-Host "  Recorded: $($history.count) tool calls" -ForegroundColor Green
} catch {
    Write-Host "  FAILED: $_" -ForegroundColor Red
}

Write-Host "`n" -NoNewline
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "TEST COMPLETE" -ForegroundColor Cyan
Write-Host "=" * 60 -ForegroundColor Cyan
Write-Host "`n"
