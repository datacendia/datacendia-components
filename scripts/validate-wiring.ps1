# Validates that all wired frontend endpoints respond correctly against a live backend.
# Usage: .\scripts\validate-wiring.ps1

$ErrorActionPreference = "Stop"
$baseUrl = "http://localhost:3001/api/v1"

# 1. Acquire token via register (creates disposable test user)
$email = "validator-$(Get-Random)@test.com"
$body = "{`"email`":`"$email`",`"password`":`"testpass12345`",`"name`":`"Validator`",`"organizationName`":`"TestOrg-$(Get-Random)`"}"

$token = $null
try {
  $r = Invoke-WebRequest -Uri "$baseUrl/auth/register" -Method POST -Body $body -ContentType "application/json" -UseBasicParsing -TimeoutSec 15
  $j = $r.Content | ConvertFrom-Json
  $token = $j.data.accessToken
  Write-Host "[AUTH] Registered $email, token length=$($token.Length)" -ForegroundColor Green
} catch {
  Write-Host "[AUTH] Failed: $($_.Exception.Message)" -ForegroundColor Red
  exit 1
}

$h = @{ "Authorization" = "Bearer $token" }

# Endpoints actually called by the wired services and pages.
# Tuples: endpoint, acceptableCodes (default 200, or 200,403 for role-gated).
$endpointSpec = @(
  @{ path = "veto/decisions";                             accept = @(200) },
  @{ path = "veto/metrics";                               accept = @(200) },
  @{ path = "union/employees";                            accept = @(200) },
  @{ path = "union/metrics";                              accept = @(200) },
  @{ path = "ledger/entries";                             accept = @(200) },
  @{ path = "ledger/decisions";                           accept = @(200) },
  @{ path = "persona/twins";                              accept = @(200) },
  @{ path = "decision-intel/ghost-board/sessions";        accept = @(200) },
  @{ path = "decision-intel/pre-mortem/analyses";         accept = @(200) },
  @{ path = "workflows";                                  accept = @(200) },
  @{ path = "enterprise/regent/advisors";                 accept = @(200, 403); note = "ADMIN-only; 403 expected for non-admin" },
  @{ path = "wedge/status";                               accept = @(200) },
  @{ path = "admin/tenants";                              accept = @(200) },
  @{ path = "admin/feature-flags";                        accept = @(200) },
  @{ path = "premium/decision-debt/dashboard";            accept = @(200) }
)
$endpoints = $endpointSpec | ForEach-Object { $_.path }

$pass = 0
$fail = 0
$errors = @()

foreach ($spec in $endpointSpec) {
  $e = $spec.path
  $acceptable = $spec.accept
  try {
    $r = Invoke-WebRequest -Uri "$baseUrl/$e" -Headers $h -UseBasicParsing -TimeoutSec 10
    $status = $r.StatusCode
    $len = $r.Content.Length
    $shape = ""
    try {
      $j = $r.Content | ConvertFrom-Json
      if ($null -ne $j.data) {
        if ($j.data -is [Array]) { $shape = "array[$($j.data.Count)]" }
        else { $shape = "object" }
      } elseif ($null -ne $j.decisions) { $shape = "legacy{decisions[$($j.decisions.Count)]}" }
      elseif ($null -ne $j.employees) { $shape = "legacy{employees[$($j.employees.Count)]}" }
      elseif ($null -ne $j.advisors) { $shape = "legacy{advisors[$($j.advisors.Count)]}" }
      else { $shape = "other" }
    } catch { $shape = "non-json" }
    if ($acceptable -contains $status) {
      Write-Host ("[PASS] {0,-45} {1} {2,6}b  {3}" -f $e, $status, $len, $shape) -ForegroundColor Green
      $pass++
    } else {
      Write-Host ("[FAIL] {0,-45} {1} (expected {2})" -f $e, $status, ($acceptable -join ',')) -ForegroundColor Red
      $errors += "$e => HTTP $status"
      $fail++
    }
  } catch {
    $code = "?"
    try { $code = $_.Exception.Response.StatusCode.value__ } catch {}
    if ($acceptable -contains [int]$code) {
      $note = if ($spec.note) { " ($($spec.note))" } else { "" }
      Write-Host ("[PASS] {0,-45} HTTP {1}{2}" -f $e, $code, $note) -ForegroundColor DarkGreen
      $pass++
    } else {
      Write-Host ("[FAIL] {0,-45} HTTP {1} (expected {2})" -f $e, $code, ($acceptable -join ',')) -ForegroundColor Red
      $errors += "$e => HTTP $code"
      $fail++
    }
  }
}

Write-Host ""
Write-Host "RESULTS: $pass pass, $fail fail, $($endpoints.Count) total" -ForegroundColor Cyan
if ($errors.Count -gt 0) {
  Write-Host "Errors:"
  $errors | ForEach-Object { Write-Host "  $_" }
}
if ($fail -gt 0) { exit 1 } else { exit 0 }
