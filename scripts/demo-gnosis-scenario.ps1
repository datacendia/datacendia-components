# =============================================================================
# DATACENDIA SERVICE DEMO: CendiaGnosis - Document Intelligence
# =============================================================================
#
# SCENARIO: Law firm uploads 2,400 pages of M and A due diligence documents.
#           CendiaGnosis extracts, indexes, and enables instant Q and A across
#           the entire corpus in under 3 minutes.
#
# CendiaGnosis: "Ask your documents anything"
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
    Write-Host ("=" * 80) -ForegroundColor Magenta
    Write-Host "  $text" -ForegroundColor Magenta
    Write-Host ("=" * 80) -ForegroundColor Magenta
}

function Write-Step {
    param([string]$step, [string]$text)
    Write-Host ""
    Write-Host "[$step] " -ForegroundColor Yellow -NoNewline
    Write-Host $text -ForegroundColor White
}

function Write-Document {
    param([string]$text)
    Write-Host "    [DOC] $text" -ForegroundColor Cyan
}

function Write-Answer {
    param([string]$text)
    Write-Host "    [ANS] $text" -ForegroundColor Yellow
}

# =============================================================================
# SCENARIO DATA
# =============================================================================

$organization = @{
    name = "Morrison and Associates LLP"
    industry = "Legal Services"
    matter = "Project Falcon - TechStart Acquisition"
    deadline = "2026-01-15"
}

$documentUpload = @{
    uploadId = "upl-2026-0104-001"
    totalDocuments = 47
    totalPages = 2847
    formats = @{
        PDF = 32
        DOCX = 8
        XLSX = 5
        PPTX = 2
    }
    categories = @{
        "Financial Statements" = 12
        "Contracts and Agreements" = 15
        "Corporate Records" = 8
        "IP Documentation" = 6
        "Employment Records" = 4
        "Regulatory Filings" = 2
    }
    totalSizeMB = 847
}

$processingSteps = @(
    @{ step = "Document Ingestion"; status = "COMPLETE"; duration = "12.3s"; details = "47 documents received, validated checksums" },
    @{ step = "Text Extraction (Apache Tika)"; status = "COMPLETE"; duration = "45.7s"; details = "2,847 pages extracted, OCR applied to 8 scanned documents" },
    @{ step = "Chunking and Embedding"; status = "COMPLETE"; duration = "67.2s"; details = "12,384 chunks created, embedded with nomic-embed-text" },
    @{ step = "Vector Indexing (pgvector)"; status = "COMPLETE"; duration = "23.1s"; details = "HNSW index built, 12,384 vectors indexed" },
    @{ step = "Entity Extraction"; status = "COMPLETE"; duration = "34.8s"; details = "847 entities extracted (companies, people, dates, amounts)" },
    @{ step = "Cross-Reference Analysis"; status = "COMPLETE"; duration = "18.4s"; details = "156 cross-document references identified" }
)

$extractedEntities = @(
    @{ type = "Company"; count = 23; examples = @("TechStart Inc.", "Acme Holdings", "CloudVentures LLC") },
    @{ type = "Person"; count = 156; examples = @("John Morrison (CEO)", "Sarah Chen (CFO)", "Michael Torres (CTO)") },
    @{ type = "Date"; count = 312; examples = @("2025-06-15", "2024-12-31", "2026-01-15") },
    @{ type = "Amount"; count = 89; examples = @("47.5M", "2.4M ARR", "850K") },
    @{ type = "Contract"; count = 34; examples = @("MSA-2024-001", "NDA-TS-2025", "Employment Agreement") },
    @{ type = "IP Asset"; count = 12; examples = @("US Patent 10,234,567", "TechStart trademark", "CloudSync codebase") }
)

$sampleQueries = @(
    @{
        query = "What is TechStart's current annual recurring revenue?"
        answer = "According to the Q3 2025 Financial Summary (page 12), TechStart's ARR is 2.4M as of September 30, 2025, representing 34 percent YoY growth."
        sources = @(
            @{ doc = "TechStart_Financial_Summary_Q3_2025.pdf"; page = 12; relevance = 0.94 },
            @{ doc = "Revenue_Recognition_Schedule.xlsx"; page = 1; relevance = 0.87 }
        )
        latency = "1.2s"
    },
    @{
        query = "Are there any change of control provisions in existing contracts?"
        answer = "Yes, 3 contracts contain change of control provisions: (1) AWS Enterprise Agreement requires 60-day notice, (2) Salesforce MSA allows termination within 30 days of acquisition, (3) Key employee agreements trigger accelerated vesting."
        sources = @(
            @{ doc = "AWS_Enterprise_Agreement_2024.pdf"; page = 8; relevance = 0.96 },
            @{ doc = "Salesforce_MSA_2023.pdf"; page = 15; relevance = 0.92 },
            @{ doc = "Executive_Employment_Agreements.pdf"; page = 4; relevance = 0.89 }
        )
        latency = "2.1s"
    },
    @{
        query = "What intellectual property does TechStart own?"
        answer = "TechStart owns: (1) 3 US patents for cloud synchronization technology, (2) TechStart and CloudSync registered trademarks, (3) Proprietary codebase (approximately 450K lines), (4) 2 pending patent applications."
        sources = @(
            @{ doc = "IP_Portfolio_Summary.pdf"; page = 1; relevance = 0.98 },
            @{ doc = "Patent_Assignments.pdf"; page = 3; relevance = 0.91 },
            @{ doc = "Trademark_Registrations.pdf"; page = 1; relevance = 0.88 }
        )
        latency = "1.8s"
    },
    @{
        query = "Who are the key employees and what are their compensation packages?"
        answer = "Key employees: (1) John Morrison, CEO - 425K base + 2.5 percent equity, (2) Sarah Chen, CFO - 375K base + 1.8 percent equity, (3) Michael Torres, CTO - 400K base + 2.2 percent equity. All have 4-year vesting with 1-year cliff."
        sources = @(
            @{ doc = "Executive_Employment_Agreements.pdf"; page = 2; relevance = 0.97 },
            @{ doc = "Cap_Table_2025.xlsx"; page = 1; relevance = 0.93 },
            @{ doc = "Compensation_Summary.pdf"; page = 1; relevance = 0.90 }
        )
        latency = "1.5s"
    },
    @{
        query = "Are there any pending litigation or regulatory issues?"
        answer = "One pending matter identified: A former employee filed a wrongful termination claim in August 2025 (Case No. 2025-CV-4521). Outside counsel estimates exposure at 50-150K. No regulatory investigations or compliance issues noted."
        sources = @(
            @{ doc = "Litigation_Summary.pdf"; page = 1; relevance = 0.96 },
            @{ doc = "Legal_Matters_Disclosure.pdf"; page = 3; relevance = 0.91 },
            @{ doc = "Regulatory_Compliance_Cert.pdf"; page = 1; relevance = 0.85 }
        )
        latency = "1.9s"
    }
)

$keyFindings = @(
    @{ category = "Financial"; finding = "Revenue concentration risk: Top 3 customers = 67 percent of ARR"; severity = "medium"; source = "Revenue_By_Customer.xlsx" },
    @{ category = "Legal"; finding = "Change of control triggers in 3 material contracts"; severity = "high"; source = "Contract_Summary.pdf" },
    @{ category = "IP"; finding = "2 patents expire within 5 years of acquisition"; severity = "medium"; source = "IP_Portfolio_Summary.pdf" },
    @{ category = "HR"; finding = "CTO has competing offer, retention risk flagged"; severity = "high"; source = "HR_Risk_Assessment.pdf" },
    @{ category = "Compliance"; finding = "SOC 2 Type II certification expires March 2026"; severity = "low"; source = "Compliance_Calendar.xlsx" }
)

# =============================================================================
# DEMO EXECUTION
# =============================================================================

Clear-Host
Write-Host ""
Write-Host "    ================================================================" -ForegroundColor Magenta
Write-Host "                   CENDIAGNOSIS - Document Intelligence" -ForegroundColor Magenta
Write-Host "                      'Ask your documents anything'" -ForegroundColor Gray
Write-Host "    ================================================================" -ForegroundColor Magenta
Write-Host ""
Write-Host "    SCENARIO: M and A Due Diligence Document Analysis" -ForegroundColor White
Write-Host "    Organization: $($organization.name)" -ForegroundColor Gray
Write-Host "    Matter: $($organization.matter)" -ForegroundColor Gray
Write-Host ""

if ($DryRun) {
    Write-Host "    [DRY RUN MODE]" -ForegroundColor Yellow
}

Write-Host "Press any key to begin document processing..." -ForegroundColor DarkGray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

# -----------------------------------------------------------------------------
# STEP 1: Document Upload
# -----------------------------------------------------------------------------
Write-Header "STEP 1: Document Upload"

Write-Step "1.1" "Receiving document package..."

Write-Host ""
Write-Host "    Upload: $($documentUpload.uploadId)" -ForegroundColor Cyan
Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
Write-Host "    Total Documents: $($documentUpload.totalDocuments)" -ForegroundColor White
Write-Host "    Total Pages: $($documentUpload.totalPages)" -ForegroundColor White
Write-Host "    Total Size: $($documentUpload.totalSizeMB) MB" -ForegroundColor White

Write-Host ""
Write-Host "    By Format:" -ForegroundColor White
foreach ($fmt in $documentUpload.formats.Keys) {
    Write-Host "      - $fmt`: $($documentUpload.formats[$fmt]) files" -ForegroundColor Gray
}

Write-Host ""
Write-Host "    By Category:" -ForegroundColor White
foreach ($cat in $documentUpload.categories.Keys) {
    Write-Host "      - $cat`: $($documentUpload.categories[$cat]) documents" -ForegroundColor Gray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 2: Processing Pipeline
# -----------------------------------------------------------------------------
Write-Header "STEP 2: Document Processing Pipeline"

Write-Step "2.1" "Running extraction and indexing pipeline..."

$totalDuration = 0
foreach ($proc in $processingSteps) {
    $durationNum = [double]($proc.duration -replace 's','')
    $totalDuration += $durationNum
    
    Write-Host ""
    Write-Host "    [PROC] $($proc.step)" -ForegroundColor Cyan
    
    # Simulate progress
    for ($i = 0; $i -le 10; $i++) {
        $progress = "#" * $i + "-" * (10 - $i)
        Write-Host "`r       [$progress] $($i * 10) percent" -NoNewline -ForegroundColor Gray
        Start-Sleep -Milliseconds 30
    }
    
    Write-Host ""
    Write-Host "       Duration: $($proc.duration) | $($proc.details)" -ForegroundColor DarkGray
    Write-Host "       [OK] Status: $($proc.status)" -ForegroundColor Green
}

Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor DarkGray
Write-Host "    [OK] Total Processing Time: $([math]::Round($totalDuration, 1)) seconds for $($documentUpload.totalPages) pages" -ForegroundColor Green
Write-Host "    -> Processing Speed: $([math]::Round($documentUpload.totalPages / $totalDuration, 1)) pages/second" -ForegroundColor Gray

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 3: Entity Extraction
# -----------------------------------------------------------------------------
Write-Header "STEP 3: Entity Extraction Results"

Write-Step "3.1" "Entities discovered across document corpus..."

Write-Host ""
foreach ($entity in $extractedEntities) {
    Write-Host "    [ENTITY] $($entity.type): $($entity.count) found" -ForegroundColor Cyan
    Write-Host "       Examples: $($entity.examples -join ', ')" -ForegroundColor DarkGray
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 4: Interactive Q and A
# -----------------------------------------------------------------------------
Write-Header "STEP 4: Document Q and A Demo"

Write-Step "4.1" "Demonstrating natural language queries..."

foreach ($qa in $sampleQueries) {
    Write-Host ""
    Write-Host "    ---------------------------------------------------------------" -ForegroundColor DarkGray
    Write-Host "    QUERY: $($qa.query)" -ForegroundColor White
    Write-Host ""
    
    # Simulate thinking
    Write-Host "       Searching $($documentUpload.totalPages) pages..." -ForegroundColor DarkGray
    Start-Sleep -Milliseconds 300
    
    Write-Answer "ANSWER:"
    Write-Host "       $($qa.answer)" -ForegroundColor Gray
    Write-Host ""
    Write-Host "       Sources:" -ForegroundColor White
    foreach ($src in $qa.sources) {
        $relevanceColor = if ($src.relevance -ge 0.95) { "Green" } elseif ($src.relevance -ge 0.90) { "Yellow" } else { "Gray" }
        Write-Host "         - $($src.doc) (p.$($src.page)) - " -NoNewline -ForegroundColor DarkGray
        Write-Host "$([math]::Round($src.relevance * 100)) percent match" -ForegroundColor $relevanceColor
    }
    Write-Host "       Latency: $($qa.latency)" -ForegroundColor DarkGray
    
    Start-Sleep -Milliseconds 200
}

Start-Sleep -Seconds 1

# -----------------------------------------------------------------------------
# STEP 5: Key Findings
# -----------------------------------------------------------------------------
Write-Header "STEP 5: AI-Identified Key Findings"

Write-Step "5.1" "Critical findings surfaced by CendiaGnosis..."

foreach ($finding in $keyFindings) {
    $severityColor = switch ($finding.severity) {
        "high" { "Red" }
        "medium" { "Yellow" }
        "low" { "Green" }
    }
    
    Write-Host ""
    Write-Host "    [!] [$($finding.category.ToUpper())] $($finding.finding)" -ForegroundColor $severityColor
    Write-Host "       Severity: " -NoNewline -ForegroundColor Gray
    Write-Host $finding.severity.ToUpper() -ForegroundColor $severityColor
    Write-Host "       Source: $($finding.source)" -ForegroundColor DarkGray
}

# -----------------------------------------------------------------------------
# SUMMARY
# -----------------------------------------------------------------------------
Write-Header "DOCUMENT ANALYSIS COMPLETE"

Write-Host ""
Write-Host "    CENDIAGNOSIS ANALYSIS SUMMARY" -ForegroundColor White
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    MATTER: $($organization.matter)" -ForegroundColor Cyan
Write-Host "       Client: $($organization.name)" -ForegroundColor Gray
Write-Host "       Deadline: $($organization.deadline)" -ForegroundColor Gray
Write-Host ""
Write-Host "    DOCUMENTS PROCESSED:" -ForegroundColor White
Write-Host "       Files: $($documentUpload.totalDocuments)" -ForegroundColor Gray
Write-Host "       Pages: $($documentUpload.totalPages)" -ForegroundColor Gray
Write-Host "       Size: $($documentUpload.totalSizeMB) MB" -ForegroundColor Gray
Write-Host "       Processing Time: $([math]::Round($totalDuration, 1)) seconds" -ForegroundColor Gray
Write-Host ""
Write-Host "    EXTRACTION RESULTS:" -ForegroundColor White
Write-Host "       Text Chunks: 12,384" -ForegroundColor Gray
Write-Host "       Entities: 847" -ForegroundColor Gray
Write-Host "       Cross-References: 156" -ForegroundColor Gray
Write-Host ""
Write-Host "    KEY FINDINGS:" -ForegroundColor White
Write-Host "       High Severity: 2 (Change of control triggers, CTO retention risk)" -ForegroundColor Red
Write-Host "       Medium Severity: 2 (Revenue concentration, Patent expiration)" -ForegroundColor Yellow
Write-Host "       Low Severity: 1 (SOC 2 renewal)" -ForegroundColor Green
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    READY FOR:" -ForegroundColor White
Write-Host "    [OK] Natural language Q and A across entire corpus" -ForegroundColor Green
Write-Host "    [OK] Citation-backed answers with page references" -ForegroundColor Green
Write-Host "    [OK] Cross-document relationship analysis" -ForegroundColor Green
Write-Host "    [OK] Export to Council for AI-assisted decision making" -ForegroundColor Green
Write-Host ""
Write-Host "    ===============================================================" -ForegroundColor White
Write-Host ""
Write-Host "    CendiaGnosis - 2,847 pages. Instant answers. Full citations." -ForegroundColor Magenta
Write-Host ""
