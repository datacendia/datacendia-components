# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaOmniTranslate - 100+ Language Translation
# =============================================================================
#
# SCENARIO: Global pharmaceutical company needs to translate critical
#           drug safety alert to 15 languages within 2 hours for
#           regulatory compliance across all operating regions.
#
# CendiaOmniTranslate: "Enterprise translation that never leaves your walls"
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
    Write-Host ("=" * 80) -ForegroundColor Blue
    Write-Host "  $text" -ForegroundColor Blue
    Write-Host ("=" * 80) -ForegroundColor Blue
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Translation {
    param([string]$text)
    Write-Host "    [TRANS] $text" -ForegroundColor Cyan
}

function Write-Quality {
    param([string]$text)
    Write-Host "    [QA] $text" -ForegroundColor Green
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "GlobalPharma Inc"
    industry = "Pharmaceutical"
    operatingCountries = 47
    employees = 85000
    regulatoryBodies = @("FDA", "EMA", "PMDA", "NMPA", "TGA")
}

$translationRequest = @{
    requestId = "OT-2026-0104-URGENT"
    type = "Drug Safety Alert"
    priority = "CRITICAL"
    deadline = "2 hours"
    sourceLanguage = "English"
    targetLanguages = 15
    wordCount = 847
    documentType = "Regulatory Communication"
}

$sourceDocument = @{
    title = "URGENT: Safety Alert - CardioMax-500 Dosing Update"
    contentPreview = "Healthcare providers should immediately review dosing guidelines for CardioMax-500. New clinical data indicates increased cardiac risk at doses exceeding 400mg daily in patients over 65 years of age..."
    criticalTerms = @("CardioMax-500", "cardiac risk", "dosing guidelines", "contraindicated", "adverse events")
}

$targetLanguages = @(
    @{ code = "es"; name = "Spanish"; region = "Latin America, Spain"; speakers = "500M+" },
    @{ code = "zh"; name = "Chinese (Simplified)"; region = "China"; speakers = "1.1B+" },
    @{ code = "ja"; name = "Japanese"; region = "Japan"; speakers = "125M" },
    @{ code = "de"; name = "German"; region = "Germany, Austria, Switzerland"; speakers = "100M" },
    @{ code = "fr"; name = "French"; region = "France, Canada, Africa"; speakers = "300M" },
    @{ code = "pt"; name = "Portuguese"; region = "Brazil, Portugal"; speakers = "250M" },
    @{ code = "it"; name = "Italian"; region = "Italy"; speakers = "65M" },
    @{ code = "ko"; name = "Korean"; region = "South Korea"; speakers = "77M" },
    @{ code = "ar"; name = "Arabic"; region = "Middle East, North Africa"; speakers = "400M" },
    @{ code = "ru"; name = "Russian"; region = "Russia, Eastern Europe"; speakers = "250M" },
    @{ code = "hi"; name = "Hindi"; region = "India"; speakers = "600M" },
    @{ code = "nl"; name = "Dutch"; region = "Netherlands, Belgium"; speakers = "25M" },
    @{ code = "pl"; name = "Polish"; region = "Poland"; speakers = "45M" },
    @{ code = "tr"; name = "Turkish"; region = "Turkey"; speakers = "80M" },
    @{ code = "th"; name = "Thai"; region = "Thailand"; speakers = "60M" }
)

$glossaryTerms = @(
    @{ english = "CardioMax-500"; translation = "[DO NOT TRANSLATE - Brand Name]"; note = "Preserve exactly" },
    @{ english = "cardiac risk"; translation = "Language-specific medical term required"; note = "Use approved regulatory terminology" },
    @{ english = "contraindicated"; translation = "Language-specific medical term required"; note = "Must match local regulatory language" },
    @{ english = "adverse events"; translation = "Language-specific medical term required"; note = "Use pharmacovigilance standard terms" },
    @{ english = "dosing guidelines"; translation = "Language-specific medical term required"; note = "Match local prescribing information format" }
)

$translationResults = @(
    @{ language = "Spanish"; status = "COMPLETE"; quality = 0.98; time = "4m 12s"; reviewer = "Auto-QA + Human Spot Check" },
    @{ language = "Chinese"; status = "COMPLETE"; quality = 0.96; time = "5m 34s"; reviewer = "Auto-QA + Human Spot Check" },
    @{ language = "Japanese"; status = "COMPLETE"; quality = 0.97; time = "5m 08s"; reviewer = "Auto-QA + Human Spot Check" },
    @{ language = "German"; status = "COMPLETE"; quality = 0.99; time = "3m 45s"; reviewer = "Auto-QA" },
    @{ language = "French"; status = "COMPLETE"; quality = 0.98; time = "3m 52s"; reviewer = "Auto-QA" },
    @{ language = "Portuguese"; status = "COMPLETE"; quality = 0.97; time = "4m 01s"; reviewer = "Auto-QA" },
    @{ language = "Italian"; status = "COMPLETE"; quality = 0.98; time = "3m 38s"; reviewer = "Auto-QA" },
    @{ language = "Korean"; status = "COMPLETE"; quality = 0.96; time = "4m 55s"; reviewer = "Auto-QA + Human Spot Check" },
    @{ language = "Arabic"; status = "COMPLETE"; quality = 0.95; time = "5m 22s"; reviewer = "Auto-QA + Human Spot Check" },
    @{ language = "Russian"; status = "COMPLETE"; quality = 0.97; time = "4m 18s"; reviewer = "Auto-QA" },
    @{ language = "Hindi"; status = "COMPLETE"; quality = 0.94; time = "5m 45s"; reviewer = "Auto-QA + Human Spot Check" },
    @{ language = "Dutch"; status = "COMPLETE"; quality = 0.98; time = "3m 32s"; reviewer = "Auto-QA" },
    @{ language = "Polish"; status = "COMPLETE"; quality = 0.97; time = "4m 05s"; reviewer = "Auto-QA" },
    @{ language = "Turkish"; status = "COMPLETE"; quality = 0.96; time = "4m 28s"; reviewer = "Auto-QA" },
    @{ language = "Thai"; status = "COMPLETE"; quality = 0.94; time = "5m 38s"; reviewer = "Auto-QA + Human Spot Check" }
)

$qualityChecks = @(
    @{ check = "Glossary Compliance"; passed = 15; failed = 0; description = "All critical terms translated per glossary" },
    @{ check = "Brand Name Preservation"; passed = 15; failed = 0; description = "CardioMax-500 preserved in all versions" },
    @{ check = "Numerical Accuracy"; passed = 15; failed = 0; description = "All dosages and percentages verified" },
    @{ check = "Regulatory Terminology"; passed = 15; failed = 0; description = "Local regulatory terms used correctly" },
    @{ check = "RTL Layout (Arabic)"; passed = 1; failed = 0; description = "Right-to-left formatting verified" },
    @{ check = "Character Encoding"; passed = 15; failed = 0; description = "UTF-8 encoding verified for all scripts" }
)

$complianceReport = @{
    reportId = "COMP-2026-0104-001"
    totalLanguages = 15
    averageQuality = 0.967
    totalTime = "67 minutes"
    deadline = "2 hours"
    status = "COMPLETED AHEAD OF SCHEDULE"
    auditTrail = "Full translation memory and revision history preserved"
}

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor Blue
Write-Host "               CENDIAOMNITRANSLATE - 100+ Language Translation" -ForegroundColor Blue
Write-Host "             'Enterprise translation that never leaves your walls'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor Blue
Write-Host ""
Write-Host "    SCENARIO: Urgent Drug Safety Alert Translation" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Priority: $($translationRequest.priority)" -ForegroundColor Red
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin translation..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Translation Request
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Translation Request"

Write-Step "1.1" "Request details..."

Write-Host ""
Write-Host "    Request: $($translationRequest.requestId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Type: $($translationRequest.type)" -ForegroundColor White
Write-Host "    Priority: " -NoNewline -ForegroundColor Gray
Write-Host $translationRequest.priority -ForegroundColor Red
Write-Host "    Deadline: $($translationRequest.deadline)" -ForegroundColor Yellow
Write-Host "    Source: $($translationRequest.sourceLanguage)" -ForegroundColor Gray
Write-Host "    Targets: $($translationRequest.targetLanguages) languages" -ForegroundColor Gray
Write-Host "    Word Count: $($translationRequest.wordCount)" -ForegroundColor Gray

Write-Step "1.2" "Source document..."

Write-Host ""
Write-Host "    Title: $($sourceDocument.title)" -ForegroundColor White
Write-Host ""
Write-Host "    Preview:" -ForegroundColor Gray
Write-Host "    $($sourceDocument.contentPreview)" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    Critical Terms:" -ForegroundColor Yellow
foreach ($term in $sourceDocument.criticalTerms) {
    Write-Host "      - $term" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Target Languages
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Target Languages"

Write-Step "2.1" "Languages to translate..."

Write-Host ""
foreach ($lang in $targetLanguages) {
    Write-Host "    [$($lang.code.ToUpper())] $($lang.name)" -ForegroundColor Cyan
    Write-Host "       Region: $($lang.region) | Speakers: $($lang.speakers)" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Glossary
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Enterprise Glossary"

Write-Step "3.1" "Critical term handling..."

Write-Host ""
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray
Write-Host "    |  GLOSSARY ENFORCEMENT                                     |" -ForegroundColor DarkGray
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

foreach ($term in $glossaryTerms) {
    Write-Host "    |  $($term.english.PadRight(20))" -NoNewline -ForegroundColor White
    Write-Host "$($term.note)" -ForegroundColor Gray
}
Write-Host "    +-----------------------------------------------------------+" -ForegroundColor DarkGray

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Translation Progress
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Translation Progress"

Write-Step "4.1" "Translating to 15 languages..."

Write-Host ""
foreach ($result in $translationResults) {
    $qualityColor = if ($result.quality -ge 0.97) { "Green" } elseif ($result.quality -ge 0.95) { "Yellow" } else { "Red" }
    $qualityBar = "#" * [math]::Round($result.quality * 20)
    
    Write-Translation "$($result.language)"
    Write-Host "       Status: $($result.status) | Time: $($result.time)" -ForegroundColor Gray
    Write-Host "       Quality: " -NoNewline -ForegroundColor Gray
    Write-Host $qualityBar -NoNewline -ForegroundColor $qualityColor
    Write-Host " $([math]::Round($result.quality * 100)) percent" -ForegroundColor $qualityColor
    Write-Host "       Review: $($result.reviewer)" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Quality Assurance
# -----------------------------------------------------------------------------
Write-Header "STEP 5: Quality Assurance"

Write-Step "5.1" "Automated quality checks..."

Write-Host ""
foreach ($check in $qualityChecks) {
    $statusColor = if ($check.failed -eq 0) { "Green" } else { "Red" }
    $statusIcon = if ($check.failed -eq 0) { "[PASS]" } else { "[FAIL]" }
    
    Write-Quality "$statusIcon $($check.check)"
    Write-Host "       Passed: $($check.passed) | Failed: $($check.failed)" -ForegroundColor $statusColor
    Write-Host "       $($check.description)" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 6: Compliance Report
# -----------------------------------------------------------------------------
Write-Header "STEP 6: Compliance Report"

Write-Step "6.1" "Translation compliance summary..."

Write-Host ""
Write-Host "    COMPLIANCE REPORT: $($complianceReport.reportId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host ""
Write-Host "    Languages Completed: $($complianceReport.totalLanguages)" -ForegroundColor White
Write-Host "    Average Quality: $([math]::Round($complianceReport.averageQuality * 100, 1)) percent" -ForegroundColor Green
Write-Host "    Total Time: $($complianceReport.totalTime)" -ForegroundColor White
Write-Host "    Deadline: $($complianceReport.deadline)" -ForegroundColor Gray
Write-Host "    Status: " -NoNewline -ForegroundColor Gray
Write-Host $complianceReport.status -ForegroundColor Green
Write-Host ""
Write-Host "    Audit Trail: $($complianceReport.auditTrail)" -ForegroundColor Gray

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "TRANSLATION COMPLETE"

Write-Host ""
Write-Host "    CENDIAOMNITRANSLATE SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    REQUEST: $($translationRequest.requestId)" -ForegroundColor Cyan
Write-Host "       Type: Drug Safety Alert (CRITICAL)" -ForegroundColor Gray
Write-Host "       Deadline: 2 hours" -ForegroundColor Gray
Write-Host ""
Write-Host "    RESULTS:" -ForegroundColor White
Write-Host "       Languages: 15 of 15 completed" -ForegroundColor Green
Write-Host "       Average Quality: 96.7 percent" -ForegroundColor Green
Write-Host "       Total Time: 67 minutes" -ForegroundColor Green
Write-Host "       Status: Completed 53 minutes ahead of deadline" -ForegroundColor Green
Write-Host ""
Write-Host "    QUALITY ASSURANCE:" -ForegroundColor White
Write-Host "       Glossary Compliance: 100 percent" -ForegroundColor Green
Write-Host "       Brand Name Preservation: 100 percent" -ForegroundColor Green
Write-Host "       Numerical Accuracy: 100 percent" -ForegroundColor Green
Write-Host "       Regulatory Terminology: 100 percent" -ForegroundColor Green
Write-Host ""
Write-Host "    LANGUAGES TRANSLATED:" -ForegroundColor White
Write-Host "       Spanish, Chinese, Japanese, German, French, Portuguese," -ForegroundColor Gray
Write-Host "       Italian, Korean, Arabic, Russian, Hindi, Dutch, Polish," -ForegroundColor Gray
Write-Host "       Turkish, Thai" -ForegroundColor Gray
Write-Host ""
Write-Host "    DATA SOVEREIGNTY:" -ForegroundColor White
Write-Host "       All translations processed on-premise" -ForegroundColor Green
Write-Host "       No data sent to external APIs" -ForegroundColor Green
Write-Host "       Full audit trail preserved" -ForegroundColor Green
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaOmniTranslate - 15 languages. 67 minutes. Zero data leakage." -ForegroundColor Blue
Write-Host ""
