# GENOMIC SEQUENCING REPORT

## Comprehensive Genomic Profiling - Oncology Panel

**Report ID**: GSR-2025-847291
**Patient ID**: MRN-4782910
**Specimen ID**: SP-2025-12847
**Report Date**: January 3, 2026

---

## PATIENT INFORMATION

| Field | Value |
|-------|-------|
| Patient Name | [REDACTED FOR DEMO] |
| Date of Birth | [REDACTED] |
| Gender | Female |
| Ordering Physician | Dr. Michael Chen, MD |
| Institution | Midwest Regional Cancer Center |
| Diagnosis | Metastatic Non-Small Cell Lung Cancer |
| Specimen Type | Tumor Tissue (FFPE) |
| Tumor Content | 45% |

---

## 1. SUMMARY OF FINDINGS

### Clinically Significant Alterations

| Gene | Alteration | Variant Allele Frequency | Clinical Significance |
|------|------------|-------------------------|----------------------|
| **EGFR** | L858R | 32% | **Tier I - Actionable** |
| **TP53** | R248W | 28% | Tier II - Prognostic |
| **KRAS** | G12C | 0% | Not Detected |
| **ALK** | Fusion | 0% | Not Detected |
| **ROS1** | Fusion | 0% | Not Detected |

### Tumor Mutational Burden (TMB)
- **TMB Score**: 8.2 mutations/Mb
- **Classification**: Intermediate
- **Percentile**: 62nd (compared to NSCLC cohort)

### Microsatellite Instability (MSI)
- **Status**: MSS (Microsatellite Stable)

---

## 2. DETAILED VARIANT ANALYSIS

### 2.1 EGFR L858R (Tier I - Actionable)

| Attribute | Value |
|-----------|-------|
| Gene | EGFR (Epidermal Growth Factor Receptor) |
| Transcript | NM_005228.5 |
| Genomic Position | chr7:55259515 |
| Nucleotide Change | c.2573T>G |
| Amino Acid Change | p.Leu858Arg |
| Variant Type | Missense |
| VAF | 32% |
| Read Depth | 1,247x |
| Classification | Pathogenic |

**Clinical Implications:**
- EGFR L858R is a sensitizing mutation for EGFR tyrosine kinase inhibitors
- Associated with response to osimertinib, erlotinib, gefitinib, afatinib
- Osimertinib preferred in first-line setting (FLAURA trial data)

**FDA-Approved Therapies:**
| Drug | Approval | Evidence Level |
|------|----------|----------------|
| Osimertinib (Tagrisso) | 1L and 2L NSCLC | Level 1 |
| Erlotinib (Tarceva) | 1L NSCLC | Level 1 |
| Gefitinib (Iressa) | 1L NSCLC | Level 1 |
| Afatinib (Gilotrif) | 1L NSCLC | Level 1 |

**Clinical Trials:**
- NCT04487080: Osimertinib + savolitinib (MET amplification)
- NCT03944772: Amivantamab + lazertinib
- NCT04965298: Patritumab deruxtecan (HER3-DXd)

### 2.2 TP53 R248W (Tier II - Prognostic)

| Attribute | Value |
|-----------|-------|
| Gene | TP53 (Tumor Protein P53) |
| Transcript | NM_000546.6 |
| Genomic Position | chr17:7577121 |
| Nucleotide Change | c.742C>T |
| Amino Acid Change | p.Arg248Trp |
| Variant Type | Missense |
| VAF | 28% |
| Read Depth | 1,089x |
| Classification | Pathogenic |

**Clinical Implications:**
- TP53 mutations are associated with poorer prognosis in NSCLC
- R248W is a hotspot mutation in the DNA-binding domain
- May impact response to certain therapies
- No directly targeted therapies currently approved

---

## 3. VARIANTS OF UNCERTAIN SIGNIFICANCE (VUS)

| Gene | Alteration | VAF | Classification |
|------|------------|-----|----------------|
| ATM | E2164K | 18% | VUS |
| BRCA2 | K1691N | 22% | VUS |
| PIK3CA | E81K | 8% | VUS |

*These variants require additional evidence for clinical interpretation. Recommend genetic counseling if germline testing is considered.*

---

## 4. COPY NUMBER ALTERATIONS

| Gene | Alteration | Copy Number | Clinical Significance |
|------|------------|-------------|----------------------|
| MET | Amplification | 4 copies | Monitor for resistance |
| EGFR | Amplification | 6 copies | Supports EGFR TKI sensitivity |
| CDKN2A | Deletion | 0 copies | Prognostic |

---

## 5. THERAPY RECOMMENDATIONS

### First-Line Recommendation

**Osimertinib (Tagrisso) 80 mg daily**

| Consideration | Details |
|---------------|---------|
| Rationale | EGFR L858R sensitizing mutation |
| Evidence | FLAURA trial: OS 38.6 mo vs 31.8 mo |
| CNS Activity | Superior CNS penetration |
| Toxicity Profile | Generally well-tolerated |

### Resistance Monitoring

Monitor for acquired resistance mechanisms:
- EGFR T790M (if on 1st/2nd gen TKI)
- EGFR C797S (if on osimertinib)
- MET amplification (baseline 4 copies - elevated risk)
- Small cell transformation
- PIK3CA mutations

### Alternative Options

| Scenario | Recommendation |
|----------|----------------|
| Osimertinib intolerance | Erlotinib or gefitinib |
| Progression on osimertinib | Rebiopsy, consider platinum-based chemo |
| MET amplification at progression | Osimertinib + savolitinib (clinical trial) |

---

## 6. PHARMACOGENOMIC FINDINGS

| Gene | Variant | Phenotype | Drug Implications |
|------|---------|-----------|-------------------|
| CYP2D6 | *1/*4 | Intermediate Metabolizer | Reduced codeine efficacy |
| DPYD | *1/*1 | Normal Metabolizer | Standard 5-FU dosing |
| UGT1A1 | *1/*28 | Intermediate Metabolizer | Monitor irinotecan toxicity |

---

## 7. HEREDITARY CANCER RISK

Based on somatic findings, germline testing may be considered for:
- **BRCA2**: VUS identified; family history assessment recommended
- **ATM**: VUS identified; consider if family history of breast/pancreatic cancer

*Recommend referral to genetic counselor for comprehensive hereditary cancer risk assessment.*

---

## 8. TECHNICAL INFORMATION

### Assay Details

| Parameter | Value |
|-----------|-------|
| Assay | Comprehensive Genomic Panel v3.2 |
| Genes Analyzed | 523 genes |
| Method | Hybrid capture NGS |
| Platform | Illumina NovaSeq 6000 |
| Mean Coverage | 847x |
| % Bases >100x | 99.2% |

### Quality Metrics

| Metric | Value | Threshold | Status |
|--------|-------|-----------|--------|
| Total Reads | 48.2M | >30M | ✅ Pass |
| Mapping Rate | 99.1% | >95% | ✅ Pass |
| On-Target Rate | 87.3% | >80% | ✅ Pass |
| Duplicate Rate | 12.4% | <30% | ✅ Pass |
| Tumor Content | 45% | >20% | ✅ Pass |

### Limitations

1. This test may not detect all mutations due to technical limitations
2. Variants in regions of low coverage may be missed
3. Large structural variants may not be fully characterized
4. Germline vs somatic origin cannot be definitively determined without matched normal
5. Clinical significance of VUS may change as knowledge evolves

---

## 9. REFERENCES

1. NCCN Guidelines: Non-Small Cell Lung Cancer, Version 1.2026
2. Ramalingam SS, et al. N Engl J Med. 2020;382:41-50 (FLAURA)
3. ClinVar database (accessed January 2026)
4. OncoKB (accessed January 2026)
5. COSMIC database v98

---

## REPORT AUTHORIZATION

| Role | Name | Credentials | Date |
|------|------|-------------|------|
| Reviewed By | Dr. Sarah Kim | MD, PhD, FACMG | Jan 3, 2026 |
| Approved By | Dr. James Wong | MD, PhD | Jan 3, 2026 |

---

**Laboratory Information:**
Meridian Genomics Laboratory
CLIA: 99D2054321 | CAP: 8472910
500 Research Drive, Boston, MA 02142
Phone: 1-800-GENOMIC | Fax: 617-555-0199

---

*This report is intended for use by qualified healthcare professionals. Results should be interpreted in the context of clinical findings, family history, and other laboratory data.*

---

*For CendiaGenomics™ Demo Purposes*
