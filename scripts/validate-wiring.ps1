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

$endpoints = @(
  "veto/decisions",
  "veto/metrics",
  "union/employees",
  "union/metrics",
  "ledger/entries",
  "ledger/decisions",
  "persona/twins",
  "decision-intel/ghost-board/sessions",
  "decision-intel/pre-mortem/analyses",
  "workflows",
  "autopilot/decisions",
  "enterprise/regent/advisors",
  "wedge/status",
  "admin/tenants",
  "admin/feature-flags",
  "premium/decision-debt/dashboard"
)

$pass = 0
$fail = 0
$errors = @()

foreach ($e in $endpoints) {
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
    if ($status -eq 200) {
      Write-Host ("[PASS] {0,-45} {1} {2,6}b  {3}" -f $e, $status, $len, $shape) -ForegroundColor Green
      $pass++
    } else {
      Write-Host ("[WARN] {0,-45} {1} {2,6}b" -f $e, $status, $len) -ForegroundColor Yellow
      $fail++
    }
  } catch {
    $code = "?"
    try { $code = $_.Exception.Response.StatusCode.value__ } catch {}
    Write-Host ("[FAIL] {0,-45} HTTP {1}" -f $e, $code) -ForegroundColor Red
    $errors += "$e => HTTP $code"
    $fail++
  }
}

Write-Host ""
Write-Host "RESULTS: $pass pass, $fail fail, $($endpoints.Count) total" -ForegroundColor Cyan
if ($errors.Count -gt 0) {
  Write-Host "Errors:"
  $errors | ForEach-Object { Write-Host "  $_" }
}
if ($fail -gt 0) { exit 1 } else { exit 0 }
