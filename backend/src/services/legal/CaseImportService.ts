/**
 * DATACENDIA CASE IMPORT SERVICE
 * 
 * Parsers for free case law data sources:
 * - Caselaw Access Project (CAP) - Harvard Law School
 * - CourtListener / RECAP - Free Law Project
 * - Manual CSV/JSON uploads
 * 
 * Transforms external formats → CaseLaw interface for ingestion
 */

import { CaseLaw, KeyPassage } from './LegalVerticalService';
import * as crypto from 'crypto';

// =============================================================================
// CAP (CASELAW ACCESS PROJECT) TYPES
// =============================================================================

/**
 * CAP Case format from case.law bulk downloads
 * https://case.law/download/
 */
export interface CAPCase {
  id: number;
  url: string;
  name: string;
  name_abbreviation: string;
  decision_date: string;
  docket_number: string;
  first_page: string;
  last_page: string;
  citations: CAPCitation[];
  volume: CAPVolume;
  reporter: CAPReporter;
  court: CAPCourt;
  jurisdiction: CAPJurisdiction;
  cites_to?: CAPCitesTo[];
  frontend_url: string;
  preview?: string[];
  analysis?: CAPAnalysis;
  last_updated?: string;
  provenance?: CAPProvenance;
  casebody?: CAPCasebody;
}

export interface CAPCitation {
  cite: string;
  type: string;
}

export interface CAPVolume {
  url: string;
  volume_number: string;
  barcode?: string;
}

export interface CAPReporter {
  url: string;
  full_name: string;
  id: number;
}

export interface CAPCourt {
  url: string;
  name_abbreviation: string;
  slug: string;
  id: number;
  name: string;
}

export interface CAPJurisdiction {
  id: number;
  name_long: string;
  url: string;
  slug: string;
  whitelisted: boolean;
  name: string;
}

export interface CAPCitesTo {
  cite: string;
  category?: string;
  reporter?: string;
  case_ids?: number[];
  opinion_id?: number;
}

export interface CAPAnalysis {
  cardinality?: number;
  char_count?: number;
  ocr_confidence?: number;
  pagerank?: {
    percentile: number;
    raw: number;
  };
  sha256?: string;
  simhash?: string;
  word_count?: number;
}

export interface CAPProvenance {
  batch?: string;
  source?: string;
  date_added?: string;
}

export interface CAPCasebody {
  status: string;
  data?: {
    judges?: string[];
    parties?: string[];
    attorneys?: string[];
    opinions?: CAPOpinion[];
    head_matter?: string;
    corrections?: string;
  };
}

export interface CAPOpinion {
  text: string;
  type: string;
  author?: string;
}

// =============================================================================
// COURTLISTENER TYPES
// =============================================================================

/**
 * CourtListener API format
 * https://www.courtlistener.com/api/rest/v3/
 */
export interface CourtListenerCase {
  id: number;
  absolute_url: string;
  case_name: string;
  case_name_short: string;
  case_name_full: string;
  date_filed: string;
  date_argued?: string;
  date_reargued?: string;
  date_reargument_denied?: string;
  docket_number: string;
  citation_count: number;
  cluster_id: number;
  court: string;
  court_id: string;
  judges: string;
  nature_of_suit: string;
  precedential_status: string;
  slug: string;
  source: string;
  attorneys: string;
  filepath_json_harvard?: string;
  opinions?: CourtListenerOpinion[];
  citations?: CourtListenerCitation[];
  sub_opinions?: CourtListenerSubOpinion[];
}

export interface CourtListenerOpinion {
  id: number;
  author_id?: number;
  author_str: string;
  type: string;
  sha1: string;
  page_count?: number;
  download_url?: string;
  local_path?: string;
  plain_text?: string;
  html?: string;
  html_lawbox?: string;
  html_columbia?: string;
  html_with_citations?: string;
  extracted_by_ocr: boolean;
}

export interface CourtListenerCitation {
  volume: number;
  reporter: string;
  page: string;
  type: number;
}

export interface CourtListenerSubOpinion {
  type: string;
  author_str: string;
  per_curiam: boolean;
  joined_by_str: string;
}

// =============================================================================
// CSV IMPORT FORMAT
// =============================================================================

export interface CSVCaseRow {
  citation: string;
  title: string;
  court: string;
  jurisdiction: string;
  date_decided: string;
  summary: string;
  topics?: string; // Comma-separated
  outcome?: string;
  judges?: string; // Comma-separated
  plaintiff?: string;
  defendant?: string;
  holdings?: string; // Pipe-separated
  full_text?: string;
}

// =============================================================================
// CASE IMPORT SERVICE
// =============================================================================

export class CaseImportService {
  
  // ===========================================================================
  // CAP (CASELAW ACCESS PROJECT) PARSER
  // ===========================================================================

  /**
   * Parse a single CAP case into CaseLaw format
   */
  parseCAPCase(capCase: CAPCase, importedBy: string = 'system'): Omit<CaseLaw, 'id' | 'importedAt' | 'hash'> {
    // Extract primary citation
    const primaryCitation = capCase.citations?.[0]?.cite || 
      `${capCase.volume?.volume_number} ${capCase.reporter?.full_name} ${capCase.first_page}`;

    // Extract judges from casebody
    const judges = capCase.casebody?.data?.judges || [];

    // Extract parties
    const parties = this.extractPartiesFromName(capCase.name);

    // Extract holdings and key passages from opinions
    const { holdings, keyPassages, fullText } = this.extractFromOpinions(capCase.casebody?.data?.opinions || []);

    // Extract topics from head matter and opinions
    const topics = this.extractTopics(capCase);

    // Extract cited cases
    const cites = capCase.cites_to?.map(c => c.cite) || [];

    // Determine jurisdiction type
    const jurisdictionType = this.determineJurisdictionType(capCase.jurisdiction?.name || '');

    return {
      citation: primaryCitation,
      title: capCase.name_abbreviation || capCase.name,
      court: capCase.court?.name || capCase.court?.name_abbreviation || 'Unknown Court',
      jurisdiction: jurisdictionType,
      dateDecided: new Date(capCase.decision_date),
      summary: capCase.preview?.join(' ') || this.generateSummary(fullText),
      fullText: fullText || '',
      headnotes: this.extractHeadnotes(capCase.casebody?.data?.head_matter || ''),
      keyPassages,
      topics,
      citedBy: [], // Would need reverse lookup
      cites,
      outcome: this.extractOutcome(fullText),
      judges: judges.map(j => typeof j === 'string' ? j : String(j)),
      parties,
      procedural_posture: this.extractProceduralPosture(capCase.casebody?.data?.head_matter || ''),
      holdings,
      importedBy,
      sourceSystem: 'cap',
    };
  }

  /**
   * Parse multiple CAP cases (bulk import)
   */
  parseCAPCases(capCases: CAPCase[], importedBy: string = 'system'): Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[] {
    return capCases.map(c => this.parseCAPCase(c, importedBy));
  }

  /**
   * Parse CAP bulk JSON file content
   */
  parseCAPBulkJSON(jsonContent: string, importedBy: string = 'system'): {
    cases: Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[];
    errors: string[];
  } {
    const cases: Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[] = [];
    const errors: string[] = [];

    try {
      const data = JSON.parse(jsonContent);
      
      // CAP bulk downloads can be array or object with results
      const caseArray = Array.isArray(data) ? data : (data.results || data.cases || [data]);

      for (let i = 0; i < caseArray.length; i++) {
        try {
          const parsed = this.parseCAPCase(caseArray[i], importedBy);
          cases.push(parsed);
        } catch (err) {
          errors.push(`Case ${i}: ${err instanceof Error ? err.message : String(err)}`);
        }
      }
    } catch (err) {
      errors.push(`JSON parse error: ${err instanceof Error ? err.message : String(err)}`);
    }

    return { cases, errors };
  }

  // ===========================================================================
  // COURTLISTENER PARSER
  // ===========================================================================

  /**
   * Parse a CourtListener case into CaseLaw format
   */
  parseCourtListenerCase(clCase: CourtListenerCase, importedBy: string = 'system'): Omit<CaseLaw, 'id' | 'importedAt' | 'hash'> {
    // Build citation from components
    const primaryCitation = clCase.citations?.[0] 
      ? `${clCase.citations[0].volume} ${clCase.citations[0].reporter} ${clCase.citations[0].page}`
      : clCase.docket_number;

    // Extract full text from opinions
    const fullText = clCase.opinions?.map(o => o.plain_text || '').join('\n\n') || '';

    // Parse judges string
    const judges = clCase.judges ? clCase.judges.split(/[,;]/).map(j => j.trim()).filter(Boolean) : [];

    // Extract parties from case name
    const parties = this.extractPartiesFromName(clCase.case_name_full || clCase.case_name);

    return {
      citation: primaryCitation,
      title: clCase.case_name_short || clCase.case_name,
      court: this.mapCourtListenerCourt(clCase.court_id),
      jurisdiction: this.determineJurisdictionFromCourtId(clCase.court_id),
      dateDecided: new Date(clCase.date_filed),
      summary: this.generateSummary(fullText),
      fullText: fullText || '',
      headnotes: [],
      keyPassages: this.extractKeyPassagesFromText(fullText),
      topics: clCase.nature_of_suit ? [clCase.nature_of_suit] : [],
      citedBy: [],
      cites: [],
      outcome: this.extractOutcome(fullText),
      judges,
      parties,
      procedural_posture: '',
      holdings: this.extractHoldingsFromText(fullText),
      importedBy,
      sourceSystem: 'courtlistener',
    };
  }

  /**
   * Parse multiple CourtListener cases
   */
  parseCourtListenerCases(clCases: CourtListenerCase[], importedBy: string = 'system'): Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[] {
    return clCases.map(c => this.parseCourtListenerCase(c, importedBy));
  }

  // ===========================================================================
  // CSV PARSER
  // ===========================================================================

  /**
   * Parse CSV content into CaseLaw format
   */
  parseCSV(csvContent: string, importedBy: string = 'system'): {
    cases: Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[];
    errors: string[];
  } {
    const cases: Omit<CaseLaw, 'id' | 'importedAt' | 'hash'>[] = [];
    const errors: string[] = [];

    const lines = csvContent.split('\n');
    if (lines.length < 2) {
      errors.push('CSV must have header row and at least one data row');
      return { cases, errors };
    }

    const headers = this.parseCSVLine(lines[0] || '');
    // headerMap used for validation
    this.mapCSVHeaders(headers);

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i];
      if (!line || !line.trim()) continue;

      try {
        const values = this.parseCSVLine(line);
        const row = this.mapCSVRow(headers, values);
        
        if (!row.citation || !row.title) {
          errors.push(`Row ${i + 1}: Missing required fields (citation, title)`);
          continue;
        }

        cases.push({
          citation: row.citation,
          title: row.title,
          court: row.court || 'Unknown Court',
          jurisdiction: row.jurisdiction || 'Unknown',
          dateDecided: new Date(row.date_decided || Date.now()),
          summary: row.summary || '',
          fullText: row.full_text || '',
          headnotes: [],
          keyPassages: [],
          topics: row.topics ? row.topics.split(',').map(t => t.trim()) : [],
          citedBy: [],
          cites: [],
          outcome: row.outcome || '',
          judges: row.judges ? row.judges.split(',').map(j => j.trim()) : [],
          parties: {
            plaintiff: row.plaintiff || 'Unknown',
            defendant: row.defendant || 'Unknown',
          },
          procedural_posture: '',
          holdings: row.holdings ? row.holdings.split('|').map(h => h.trim()) : [],
          importedBy,
          sourceSystem: 'csv',
        });
      } catch (err) {
        errors.push(`Row ${i + 1}: ${err instanceof Error ? err.message : String(err)}`);
      }
    }

    return { cases, errors };
  }

  // ===========================================================================
  // HELPER METHODS
  // ===========================================================================

  private extractPartiesFromName(caseName: string): { plaintiff: string; defendant: string } {
    // Common patterns: "Plaintiff v. Defendant", "Plaintiff vs. Defendant", "In re Plaintiff"
    const vMatch = caseName.match(/^(.+?)\s+v\.?\s+(.+)$/i);
    if (vMatch && vMatch[1] && vMatch[2]) {
      return { plaintiff: vMatch[1].trim(), defendant: vMatch[2].trim() };
    }

    const inReMatch = caseName.match(/^In\s+re\s+(.+)$/i);
    if (inReMatch && inReMatch[1]) {
      return { plaintiff: inReMatch[1].trim(), defendant: 'N/A' };
    }

    const exParteMatch = caseName.match(/^Ex\s+parte\s+(.+)$/i);
    if (exParteMatch && exParteMatch[1]) {
      return { plaintiff: exParteMatch[1].trim(), defendant: 'N/A' };
    }

    return { plaintiff: caseName, defendant: 'Unknown' };
  }

  private extractFromOpinions(opinions: CAPOpinion[]): {
    holdings: string[];
    keyPassages: KeyPassage[];
    fullText: string;
  } {
    const holdings: string[] = [];
    const keyPassages: KeyPassage[] = [];
    let fullText = '';

    for (const opinion of opinions) {
      fullText += opinion.text + '\n\n';

      // Extract holdings (sentences with "hold", "held", "holding")
      const holdingMatches = opinion.text.match(/[^.]*\b(hold|held|holding)\b[^.]*\./gi);
      if (holdingMatches) {
        holdings.push(...holdingMatches.slice(0, 5)); // Limit to 5 holdings
      }

      // Extract key passages (sentences with legal significance markers)
      const significantPatterns = [
        /[^.]*\b(therefore|accordingly|conclude|find that|rule that)\b[^.]*\./gi,
        /[^.]*\b(constitutional|unconstitutional|violates|violation)\b[^.]*\./gi,
      ];

      for (const pattern of significantPatterns) {
        const matches = opinion.text.match(pattern);
        if (matches) {
          for (const match of matches.slice(0, 3)) {
            keyPassages.push({
              id: `kp-${crypto.randomBytes(4).toString('hex')}`,
              text: match.trim(),
              relevanceScore: 0.8,
              topics: [],
            });
          }
        }
      }
    }

    return { holdings: Array.from(new Set(holdings)), keyPassages, fullText: fullText.trim() };
  }

  private extractTopics(capCase: CAPCase): string[] {
    const topics: Set<string> = new Set();

    // Extract from court name
    if (capCase.court?.name?.toLowerCase().includes('bankruptcy')) {
      topics.add('Bankruptcy');
    }
    if (capCase.court?.name?.toLowerCase().includes('tax')) {
      topics.add('Tax');
    }
    if (capCase.court?.name?.toLowerCase().includes('patent') || 
        capCase.court?.name?.toLowerCase().includes('federal circuit')) {
      topics.add('Intellectual Property');
    }

    // Extract from case name patterns
    const caseName = capCase.name?.toLowerCase() || '';
    if (caseName.includes('united states v.') || caseName.includes('people v.')) {
      topics.add('Criminal Law');
    }
    if (caseName.includes('in re marriage') || caseName.includes('custody')) {
      topics.add('Family Law');
    }
    if (caseName.includes('estate of') || caseName.includes('in re estate')) {
      topics.add('Probate');
    }

    return Array.from(topics);
  }

  private extractHeadnotes(headMatter: string): string[] {
    if (!headMatter) return [];

    // Split on common headnote patterns
    const headnotes = headMatter
      .split(/\d+\.\s+/)
      .filter(h => h.length > 20 && h.length < 500)
      .map(h => h.trim())
      .slice(0, 10);

    return headnotes;
  }

  private extractOutcome(fullText: string): string {
    if (!fullText) return '';

    // Look for outcome patterns at the end
    const outcomePatterns = [
      /\b(affirmed|reversed|remanded|vacated|dismissed|denied|granted)\b[^.]*\.?\s*$/i,
      /\b(judgment|order|decree)\s+(affirmed|reversed|remanded|vacated)\b/i,
    ];

    for (const pattern of outcomePatterns) {
      const match = fullText.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return '';
  }

  private extractProceduralPosture(headMatter: string): string {
    if (!headMatter) return '';

    const posturePatterns = [
      /appeal\s+from\s+[^.]+/i,
      /petition\s+for\s+(certiorari|review|rehearing)[^.]+/i,
      /on\s+writ\s+of\s+[^.]+/i,
    ];

    for (const pattern of posturePatterns) {
      const match = headMatter.match(pattern);
      if (match) {
        return match[0].trim();
      }
    }

    return '';
  }

  private generateSummary(fullText: string): string {
    if (!fullText) return '';

    // Take first 500 characters, ending at a sentence
    const truncated = fullText.substring(0, 500);
    const lastPeriod = truncated.lastIndexOf('.');
    
    return lastPeriod > 100 ? truncated.substring(0, lastPeriod + 1) : truncated + '...';
  }

  private determineJurisdictionType(jurisdictionName: string): string {
    const name = jurisdictionName.toLowerCase();
    
    if (name.includes('united states') || name === 'us' || name === 'federal') {
      return 'Federal';
    }
    
    // US States
    const states = [
      'alabama', 'alaska', 'arizona', 'arkansas', 'california', 'colorado',
      'connecticut', 'delaware', 'florida', 'georgia', 'hawaii', 'idaho',
      'illinois', 'indiana', 'iowa', 'kansas', 'kentucky', 'louisiana',
      'maine', 'maryland', 'massachusetts', 'michigan', 'minnesota',
      'mississippi', 'missouri', 'montana', 'nebraska', 'nevada',
      'new hampshire', 'new jersey', 'new mexico', 'new york',
      'north carolina', 'north dakota', 'ohio', 'oklahoma', 'oregon',
      'pennsylvania', 'rhode island', 'south carolina', 'south dakota',
      'tennessee', 'texas', 'utah', 'vermont', 'virginia', 'washington',
      'west virginia', 'wisconsin', 'wyoming', 'district of columbia',
    ];

    for (const state of states) {
      if (name.includes(state)) {
        return state.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      }
    }

    return jurisdictionName || 'Unknown';
  }

  private mapCourtListenerCourt(courtId: string): string {
    const courtMap: Record<string, string> = {
      'scotus': 'Supreme Court of the United States',
      'ca1': 'United States Court of Appeals for the First Circuit',
      'ca2': 'United States Court of Appeals for the Second Circuit',
      'ca3': 'United States Court of Appeals for the Third Circuit',
      'ca4': 'United States Court of Appeals for the Fourth Circuit',
      'ca5': 'United States Court of Appeals for the Fifth Circuit',
      'ca6': 'United States Court of Appeals for the Sixth Circuit',
      'ca7': 'United States Court of Appeals for the Seventh Circuit',
      'ca8': 'United States Court of Appeals for the Eighth Circuit',
      'ca9': 'United States Court of Appeals for the Ninth Circuit',
      'ca10': 'United States Court of Appeals for the Tenth Circuit',
      'ca11': 'United States Court of Appeals for the Eleventh Circuit',
      'cadc': 'United States Court of Appeals for the D.C. Circuit',
      'cafc': 'United States Court of Appeals for the Federal Circuit',
    };

    return courtMap[courtId] || courtId;
  }

  private determineJurisdictionFromCourtId(courtId: string): string {
    if (courtId.startsWith('ca') || courtId === 'scotus') {
      return 'Federal';
    }
    return 'State';
  }

  private extractKeyPassagesFromText(text: string): KeyPassage[] {
    if (!text) return [];

    const passages: KeyPassage[] = [];
    const patterns = [
      /[^.]*\b(we hold|we conclude|the court holds|it is ordered)\b[^.]*\./gi,
    ];

    for (const pattern of patterns) {
      const matches = text.match(pattern);
      if (matches) {
        for (const match of matches.slice(0, 5)) {
          passages.push({
            id: `kp-${crypto.randomBytes(4).toString('hex')}`,
            text: match.trim(),
            relevanceScore: 0.85,
            topics: [],
          });
        }
      }
    }

    return passages;
  }

  private extractHoldingsFromText(text: string): string[] {
    if (!text) return [];

    const holdings: string[] = [];
    const matches = text.match(/[^.]*\b(we hold|held that|holding that)\b[^.]*\./gi);
    
    if (matches) {
      holdings.push(...matches.slice(0, 5));
    }

    return holdings;
  }

  private parseCSVLine(line: string): string[] {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    
    values.push(current.trim());
    return values;
  }

  private mapCSVHeaders(headers: string[]): Record<string, number> {
    const map: Record<string, number> = {};
    headers.forEach((h, i) => {
      map[h.toLowerCase().replace(/\s+/g, '_')] = i;
    });
    return map;
  }

  private mapCSVRow(headers: string[], values: string[]): CSVCaseRow {
    const row: Record<string, string> = {};
    headers.forEach((h, i) => {
      row[h.toLowerCase().replace(/\s+/g, '_')] = values[i] || '';
    });
    return row as unknown as CSVCaseRow;
  }
}

// Export singleton instance
export const caseImportService = new CaseImportService();
