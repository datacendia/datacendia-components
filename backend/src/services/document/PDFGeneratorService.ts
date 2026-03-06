/**
 * Service — P D F Generator Service
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports PDFGeneratorService, pdfGeneratorService, PDFMetadata, PDFSection, SignatureBlock, PDFGenerationOptions, GeneratedPDF
 * @module services/document/PDFGeneratorService
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PDF GENERATOR SERVICE
// Enterprise PDF/A Document Generation with Cryptographic Signatures
// =============================================================================

import PDFDocument from 'pdfkit';

import type { PDFMetadata, PDFSection, SignatureBlock, PDFGenerationOptions, GeneratedPDF } from './pdf-types.js';
export type { PDFMetadata, PDFSection, SignatureBlock, PDFGenerationOptions, GeneratedPDF } from './pdf-types.js';


export class PDFGeneratorService {
  private readonly storagePath: string;
  private readonly defaultFont = 'Helvetica';
  private readonly defaultFontBold = 'Helvetica-Bold';

  constructor(storagePath?: string) {
    this.storagePath = storagePath || process.env['PDF_STORAGE_PATH'] || '/var/datacendia/pdf';
    this.ensureStorageDirectory();
  }

  private ensureStorageDirectory(): void {
    if (!fs.existsSync(this.storagePath)) {
      fs.mkdirSync(this.storagePath, { recursive: true });
      logger.info(`Created PDF storage directory: ${this.storagePath}`);
    }
  }

  // ===========================================================================
  // MAIN GENERATION METHOD
  // ===========================================================================

  async generatePDF(
    sections: PDFSection[],
    metadata: PDFMetadata,
    options: PDFGenerationOptions = {}
  ): Promise<GeneratedPDF> {
    const {
      format = 'A4',
      orientation = 'portrait',
      margins = { top: 72, bottom: 72, left: 72, right: 72 },
      headerText,
      footerText,
      includePageNumbers = true,
      includeTimestamp = true,
      watermark,
      pdfaCompliant = true,
    } = options;

    return new Promise((resolve, reject) => {
      try {
        // Create PDF document
        const doc = new PDFDocument({
          size: format,
          layout: orientation,
          margins,
          bufferPages: true,
          info: {
            Title: metadata.title,
            Author: metadata.author || 'Datacendia Platform',
            Subject: metadata.subject || '',
            Keywords: metadata.keywords?.join(', ') || '',
            Creator: metadata.creator || 'Datacendia PDFGeneratorService',
            Producer: metadata.producer || 'Datacendia Enterprise Platform',
            CreationDate: metadata.creationDate || new Date(),
            ModDate: metadata.modificationDate || new Date(),
          },
          pdfVersion: pdfaCompliant ? '1.7' : '1.4',
          tagged: pdfaCompliant,
          displayTitle: true,
        });

        const chunks: Buffer[] = [];

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('error', reject);

        // No pageAdded handler — headers/footers added in post-processing pass

        // Add watermark if specified
        if (watermark) {
          this.addWatermark(doc, watermark);
        }

        // Add timestamp if enabled
        if (includeTimestamp) {
          doc.fontSize(8)
            .fillColor('#666666')
            .text(`Generated: ${new Date().toISOString()}`, margins.left, margins.top - 20, {
              align: 'right', lineBreak: false,
            });
          doc.moveDown(0.5);
        }

        // Process sections
        this.processSections(doc, sections, margins);

        // Post-process: add headers & footers to every buffered page
        const range = doc.bufferedPageRange();
        const pageCount = range.count;
        for (let i = 0; i < pageCount; i++) {
          doc.switchToPage(i);
          if (headerText) this.addHeader(doc, headerText);
          if (footerText || includePageNumbers) {
            this.addFooter(doc, footerText, includePageNumbers, i + 1);
          }
        }

        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const hash = crypto.createHash('sha256').update(buffer).digest('hex');
          resolve({
            buffer,
            filename: `${this.sanitizeFilename(metadata.title)}-${Date.now()}.pdf`,
            hash,
            size: buffer.length,
            pageCount,
            metadata,
            createdAt: new Date(),
          });
        });

        // Finalize PDF
        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  // ===========================================================================
  // SECTION PROCESSORS
  // ===========================================================================

  private processSections(doc: PDFDoc, sections: PDFSection[], margins: { left: number; right: number }): void {
    for (const section of sections) {
      switch (section.type) {
        case 'heading':
          this.addHeading(doc, section.content || '', section.level || 1);
          break;
        case 'paragraph':
          this.addParagraph(doc, section.content || '');
          break;
        case 'table':
          this.addTable(doc, section.headers || [], section.rows || [], margins);
          break;
        case 'list':
          this.addList(doc, section.items || []);
          break;
        case 'signature':
          if (section.signatureData) {
            this.addSignatureBlock(doc, section.signatureData);
          }
          break;
        case 'divider':
          this.addDivider(doc, margins);
          break;
        case 'spacer':
          doc.moveDown(1);
          break;
      }
    }
  }

  private addHeading(doc: PDFDoc, text: string, level: number): void {
    const sizes = { 1: 20, 2: 14, 3: 12 };
    const size = sizes[level as keyof typeof sizes] || 12;
    const pw = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    
    doc.moveDown(0.5)
      .font(this.defaultFontBold)
      .fontSize(size)
      .fillColor('#1a1a1a')
      .text(text, doc.page.margins.left, doc.y, { align: 'left', width: pw })
      .moveDown(0.3);
  }

  private addParagraph(doc: PDFDoc, text: string): void {
    const pw = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    doc.font(this.defaultFont)
      .fontSize(10)
      .fillColor('#333333')
      .text(text, doc.page.margins.left, doc.y, { align: 'left', width: pw, lineGap: 1 })
      .moveDown(0.3);
  }

  private addTable(doc: PDFDoc, headers: string[], rows: string[][], margins: { left: number; right: number }): void {
    const pageWidth = doc.page.width - margins.left - margins.right;
    const columnCount = headers.length || (rows[0]?.length || 1);
    const columnWidth = pageWidth / columnCount;
    const startX = margins.left;
    const rowHeight = 18;
    const cellPad = 5;
    // Max chars per cell to prevent text wrapping (approx 1 char = 5.4pt at 9pt font)
    const maxChars = Math.max(10, Math.floor((columnWidth - cellPad * 2) / 5.4));
    let y = doc.y;

    const truncate = (s: string) => {
      if (!s) return '';
      return s.length > maxChars ? s.substring(0, maxChars - 1) + '…' : s;
    };

    // Draw header row
    if (headers.length > 0) {
      doc.font(this.defaultFontBold).fontSize(10).fillColor('#ffffff');
      doc.rect(startX, y, pageWidth, 20).fill('#2563eb');
      
      headers.forEach((header, i) => {
        doc.fillColor('#ffffff')
          .text(truncate(header), startX + (i * columnWidth) + cellPad, y + 5, {
            width: columnWidth - cellPad * 2,
            height: 14,
            ellipsis: true,
            align: 'left',
            lineBreak: false,
          });
      });
      y += 22;
    }

    // Draw data rows
    doc.font(this.defaultFont).fontSize(9).fillColor('#333333');
    
    for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
      // Check for page break BEFORE drawing row
      if (y + rowHeight > doc.page.height - 80) {
        doc.addPage();
        y = 72; // top margin
      }

      const row = rows[rowIndex];
      
      // Alternating row background
      if (rowIndex % 2 === 0) {
        doc.rect(startX, y, pageWidth, rowHeight).fill('#f8fafc');
      }
      
      row.forEach((cell, i) => {
        doc.fillColor('#333333')
          .text(truncate(cell || ''), startX + (i * columnWidth) + cellPad, y + 4, {
            width: columnWidth - cellPad * 2,
            height: 12,
            ellipsis: true,
            align: 'left',
            lineBreak: false,
          });
      });
      
      y += rowHeight;
    }

    doc.y = y + 10;
    doc.moveDown(0.5);
  }

  private addList(doc: PDFDoc, items: string[]): void {
    const pw = doc.page.width - doc.page.margins.left - doc.page.margins.right;
    doc.font(this.defaultFont).fontSize(10).fillColor('#333333');
    
    items.forEach((item) => {
      doc.text(`• ${item}`, doc.page.margins.left, doc.y, { indent: 20, width: pw, align: 'left' });
    });
    
    doc.moveDown(0.3);
  }

  private addSignatureBlock(doc: PDFDoc, signature: SignatureBlock): void {
    const startY = doc.y;
    
    // Signature box
    doc.rect(doc.x, startY, 400, 100)
      .stroke('#2563eb');
    
    doc.font(this.defaultFontBold)
      .fontSize(12)
      .fillColor('#1a1a1a')
      .text('CRYPTOGRAPHIC SIGNATURE', doc.x + 10, startY + 10);
    
    doc.font(this.defaultFont)
      .fontSize(9)
      .fillColor('#666666');
    
    doc.text(`Signed By: ${signature.signedBy}`, doc.x + 10, startY + 30);
    doc.text(`Signed At: ${signature.signedAt.toISOString()}`, doc.x + 10, startY + 42);
    doc.text(`Algorithm: ${signature.algorithm}`, doc.x + 10, startY + 54);
    doc.text(`Signature: ${signature.signature.substring(0, 40)}...`, doc.x + 10, startY + 66);
    
    if (signature.publicKeyFingerprint) {
      doc.text(`Key Fingerprint: ${signature.publicKeyFingerprint}`, doc.x + 10, startY + 78);
    }
    
    doc.y = startY + 110;
    doc.moveDown(1);
  }

  private addDivider(doc: PDFDoc, margins: { left: number; right: number }): void {
    const y = doc.y;
    doc.moveTo(margins.left, y)
      .lineTo(doc.page.width - margins.right, y)
      .stroke('#e2e8f0');
    doc.moveDown(1);
  }

  private addHeader(doc: PDFDoc, text: string): void {
    const savedY = doc.y;
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    doc.font(this.defaultFontBold)
      .fontSize(8)
      .fillColor('#666666')
      .text(text, 72, 30, { align: 'center', width: doc.page.width - 144, lineBreak: false });
    doc.page.margins.bottom = savedBottom;
    doc.y = savedY;
  }

  private addFooter(doc: PDFDoc, text?: string, includePageNumbers?: boolean, pageNumber?: number): void {
    const savedY = doc.y;
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;
    const footerY = doc.page.height - 50;
    
    doc.font(this.defaultFont)
      .fontSize(8)
      .fillColor('#666666');
    
    if (text) {
      doc.text(text, 72, footerY, { align: 'center', width: doc.page.width - 144, lineBreak: false });
    }
    
    if (includePageNumbers && pageNumber) {
      doc.text(`Page ${pageNumber}`, 72, footerY + 12, { align: 'center', width: doc.page.width - 144, lineBreak: false });
    }
    
    doc.page.margins.bottom = savedBottom;
    doc.y = savedY;
  }

  private addWatermark(doc: PDFDoc, text: string): void {
    const savedY = doc.y;
    
    doc.save();
    doc.rotate(-45, { origin: [doc.page.width / 2, doc.page.height / 2] });
    doc.font(this.defaultFontBold)
      .fontSize(60)
      .fillColor('#e2e8f0')
      .opacity(0.3)
      .text(text, 0, doc.page.height / 2 - 30, {
        align: 'center',
        width: doc.page.width,
      });
    doc.restore();
    
    doc.y = savedY;
  }

  // ===========================================================================
  // SPECIALIZED REPORT GENERATORS
  // ===========================================================================

  async generateDecisionReport(decision: {
    id: string;
    title: string;
    summary: string;
    recommendation: string;
    confidence: number;
    participants: string[];
    votes: { agent: string; vote: string; rationale: string }[];
    dissents: { agent: string; reason: string }[];
    createdAt: Date;
    signature?: SignatureBlock;
  }): Promise<GeneratedPDF> {
    const sections: PDFSection[] = [
      { type: 'heading', content: 'DATACENDIA DECISION RECORD', level: 1 },
      { type: 'divider' },
      { type: 'heading', content: decision.title, level: 2 },
      { type: 'paragraph', content: `Decision ID: ${decision.id}` },
      { type: 'paragraph', content: `Date: ${decision.createdAt.toISOString()}` },
      { type: 'paragraph', content: `Confidence: ${(decision.confidence * 100).toFixed(1)}%` },
      { type: 'spacer' },
      { type: 'heading', content: 'Executive Summary', level: 2 },
      { type: 'paragraph', content: decision.summary },
      { type: 'spacer' },
      { type: 'heading', content: 'Recommendation', level: 2 },
      { type: 'paragraph', content: decision.recommendation },
      { type: 'spacer' },
      { type: 'heading', content: 'Council Participants', level: 2 },
      { type: 'list', items: decision.participants },
      { type: 'spacer' },
      { type: 'heading', content: 'Voting Record', level: 2 },
      {
        type: 'table',
        headers: ['Agent', 'Vote', 'Rationale'],
        rows: decision.votes.map(v => [v.agent, v.vote, v.rationale]),
      },
    ];

    if (decision.dissents.length > 0) {
      sections.push(
        { type: 'spacer' },
        { type: 'heading', content: 'Dissenting Opinions', level: 2 },
        {
          type: 'table',
          headers: ['Agent', 'Dissent Reason'],
          rows: decision.dissents.map(d => [d.agent, d.reason]),
        }
      );
    }

    if (decision.signature) {
      sections.push(
        { type: 'spacer' },
        { type: 'signature', signatureData: decision.signature }
      );
    }

    return this.generatePDF(sections, {
      title: `Decision Record - ${decision.title}`,
      subject: 'Council Decision Documentation',
      keywords: ['decision', 'council', 'governance', decision.id],
    }, {
      headerText: 'DATACENDIA ENTERPRISE PLATFORM - CONFIDENTIAL',
      footerText: '© Datacendia Inc. All Rights Reserved.',
      pdfaCompliant: true,
    });
  }

  async generateTestReport(testResults: {
    reportId: string;
    title: string;
    summary: { total: number; passed: number; failed: number; skipped: number };
    categories: { name: string; total: number; passed: number; failed: number }[];
    failures: { test: string; category: string; error: string }[];
    executedAt: Date;
    duration: number;
    signature?: SignatureBlock;
  }): Promise<GeneratedPDF> {
    const passRate = ((testResults.summary.passed / testResults.summary.total) * 100).toFixed(1);
    
    const sections: PDFSection[] = [
      { type: 'heading', content: 'DATACENDIA TEST REPORT', level: 1 },
      { type: 'divider' },
      { type: 'paragraph', content: `Report ID: ${testResults.reportId}` },
      { type: 'paragraph', content: `Generated: ${testResults.executedAt.toISOString()}` },
      { type: 'paragraph', content: `Duration: ${(testResults.duration / 1000).toFixed(2)}s` },
      { type: 'spacer' },
      { type: 'heading', content: 'Summary', level: 2 },
      {
        type: 'table',
        headers: ['Metric', 'Value'],
        rows: [
          ['Total Tests', testResults.summary.total.toString()],
          ['Passed', testResults.summary.passed.toString()],
          ['Failed', testResults.summary.failed.toString()],
          ['Skipped', testResults.summary.skipped.toString()],
          ['Pass Rate', `${passRate}%`],
        ],
      },
      { type: 'spacer' },
      { type: 'heading', content: 'Category Breakdown', level: 2 },
      {
        type: 'table',
        headers: ['Category', 'Total', 'Passed', 'Failed', 'Pass Rate'],
        rows: testResults.categories.map(c => [
          c.name,
          c.total.toString(),
          c.passed.toString(),
          c.failed.toString(),
          `${((c.passed / c.total) * 100).toFixed(1)}%`,
        ]),
      },
    ];

    if (testResults.failures.length > 0) {
      sections.push(
        { type: 'spacer' },
        { type: 'heading', content: 'Failures', level: 2 },
        {
          type: 'table',
          headers: ['Test', 'Category', 'Error'],
          rows: testResults.failures.map(f => [f.test, f.category, f.error]),
        }
      );
    }

    if (testResults.signature) {
      sections.push(
        { type: 'spacer' },
        { type: 'signature', signatureData: testResults.signature }
      );
    }

    return this.generatePDF(sections, {
      title: testResults.title,
      subject: 'Automated Test Report',
      keywords: ['test', 'qa', 'quality', testResults.reportId],
    }, {
      headerText: 'DATACENDIA QA - TEST RESULTS',
      footerText: 'This report was automatically generated by Datacendia.',
      pdfaCompliant: true,
    });
  }

  async generateRegulatorsReceipt(receipt: {
    receiptId: string;
    version: string;
    generatedAt: Date;
    generatedBy: string;
    decision: {
      id: string;
      question: string;
      finalDecision: string;
      councilMode: string;
      vertical?: string;
      consensusScore: number;
      createdAt: Date;
      completedAt: Date;
    };
    participants: {
      agents: { name: string; role: string; description?: string; responseCount: number; citationCount?: number; dissented: boolean; confidenceAvg?: number }[];
      humanApprovers?: { name: string; role: string; approvedAt: Date }[];
    };
    evidenceChain: {
      deliberationHash: string;
      merkleRoot: string;
      citationsHash: string;
      agentResponsesHash: string;
      dissentsHash: string;
    };
    compliance: {
      frameworks: string[];
      requirements?: { framework: string; requirement: string; status: string; evidence?: string }[];
      gatesCleared: string[];
      gatesFailed: string[];
    };
    citations?: { reference: string; source: string; verified: boolean }[];
    dissents?: { agentName: string; reason: string; severity: string; protected: boolean }[];
    auditTrail?: { timestamp: Date; action: string; actor: string; details: string; hash: string }[];
    cryptographicProof: {
      algorithm: string;
      receiptHash: string;
      signature?: string;
      signedBy?: string;
      signedAt?: Date;
      publicKeyFingerprint?: string;
    };
    mediaAuthentication?: {
      assetsVerified: number;
      chainOfCustodyIntact: boolean;
      c2paProvenanceSigned: boolean;
      deepfakeAnalysisRun: boolean;
      verdicts: { assetName: string; verdict: string; confidence: number }[];
    };
    workflowConfig?: {
      workflowType: string;
      verticalId: string;
      complianceProfile: string;
    };
    iissScores?: {
      overallScore: number;
      band: string;
      certificationLevel: string;
      dimensions: { name: string; primitive: string; score: number; maxScore: number; normalizedScore: number }[];
      calculatedAt: Date;
    };
    retention: {
      retentionPeriod: string;
      retentionUntil: Date;
      legalHold: boolean;
      jurisdiction: string;
    };
  }): Promise<GeneratedPDF> {
    // =========================================================================
    // APPENDIX B COURT-ADMISSIBLE FORMAT
    // Monospace Courier layout with section borders, key-value alignment,
    // IISS scores, and verification instructions.
    // =========================================================================
    const MONO = 'Courier';
    const MONO_BOLD = 'Courier-Bold';
    const LEFT = 60;
    const RIGHT_MARGIN = 60;
    const LINE_H = 14;
    const SMALL_LINE_H = 12;

    return new Promise((resolve, reject) => {
      try {
        const doc = new PDFDocument({
          size: 'A4',
          layout: 'portrait',
          margins: { top: 50, bottom: 50, left: LEFT, right: RIGHT_MARGIN },
          bufferPages: true,
          info: {
            Title: `Regulators Receipt - ${receipt.receiptId}`,
            Author: 'Datacendia Platform',
            Subject: "Regulator's Receipt - Court-Admissible Decision Documentation",
            Keywords: `regulators-receipt, decision, evidence, compliance, ${receipt.receiptId}`,
            Creator: 'Datacendia PDFGeneratorService',
            Producer: 'Datacendia DCII Framework v2.0',
            CreationDate: new Date(),
          },
          pdfVersion: '1.7',
          tagged: true,
          displayTitle: true,
        });

        const chunks: Buffer[] = [];
        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
        doc.on('error', reject);

        // Headers/footers added in post-processing pass via bufferPages

        const PW = doc.page.width - LEFT - RIGHT_MARGIN; // printable width

        // --- HELPER FUNCTIONS ---
        // ALL doc.text() calls use lineBreak: false so pdfkit NEVER
        // auto-adds pages. We handle pagination exclusively via ensureSpace.
        const BOTTOM_LIMIT = doc.page.height - 80;

        // Max chars that fit on one line for a given font size and width
        const maxChars = (fontSize: number, availW: number): number => {
          const charW = fontSize * 0.6; // Courier fixed-width ratio
          return Math.max(10, Math.floor(availW / charW));
        };

        const ensureSpace = (needed: number) => {
          if (doc.y + needed > BOTTOM_LIMIT) {
            doc.addPage();
            doc.y = 60;
          }
        };

        const safeDown = (lines: number) => {
          const advance = Math.round(lines * LINE_H);
          if (doc.y + advance > BOTTOM_LIMIT) {
            doc.addPage();
            doc.y = 60;
          } else {
            doc.y += advance;
          }
        };

        // Render a single line of text. Never wraps, never auto-paginates.
        const textLine = (text: string, x: number, fontSize: number, opts?: {
          bold?: boolean; color?: string; width?: number;
        }) => {
          const w = opts?.width || (PW - (x - LEFT));
          const mc = maxChars(fontSize, w);
          const clipped = text.length > mc ? text.substring(0, mc - 1) + '…' : text;
          const startY = doc.y;
          doc.font(opts?.bold ? MONO_BOLD : MONO)
            .fontSize(fontSize)
            .fillColor(opts?.color || '#2d3748')
            .text(clipped, x, startY, { width: w, lineBreak: false });
          doc.y = startY + fontSize + 3; // absolute set, not relative add
        };

        const doubleBorder = () => {
          ensureSpace(14);
          const y = doc.y;
          doc.save()
            .lineWidth(2.5)
            .strokeColor('#1a365d')
            .moveTo(LEFT, y).lineTo(LEFT + PW, y).stroke()
            .moveTo(LEFT, y + 4).lineTo(LEFT + PW, y + 4).stroke()
            .restore();
          doc.y = y + 10;
        };

        const singleBorder = () => {
          ensureSpace(10);
          const y = doc.y;
          doc.save()
            .lineWidth(0.8)
            .strokeColor('#4a5568')
            .moveTo(LEFT, y).lineTo(LEFT + PW, y).stroke()
            .restore();
          doc.y = y + 6;
        };

        const sectionHeader = (num: number, title: string) => {
          ensureSpace(50);
          safeDown(1);
          singleBorder();
          ensureSpace(20);
          textLine(`SECTION ${num}: ${title}`, LEFT, 11, { bold: true, color: '#1a365d' });
          singleBorder();
          safeDown(0.5);
        };

        const kv = (key: string, value: string, indent = 0) => {
          ensureSpace(LINE_H + 2);
          const keyW = 200;
          const x = LEFT + indent;
          const valW = PW - keyW - indent;
          const mc = maxChars(9, valW);
          const clippedVal = value.length > mc ? value.substring(0, mc - 1) + '…' : value;
          const startY = doc.y;
          doc.font(MONO_BOLD).fontSize(9).fillColor('#2d3748')
            .text(key, x, startY, { width: keyW, lineBreak: false });
          doc.font(MONO).fontSize(9).fillColor('#1a202c')
            .text(clippedVal, x + keyW, startY, { width: valW, lineBreak: false });
          doc.y = startY + LINE_H;
        };

        const mono = (text: string, opts?: { bold?: boolean; size?: number; color?: string; indent?: number }) => {
          const fontSize = opts?.size || 9;
          const x = LEFT + (opts?.indent || 0);
          const availW = PW - (opts?.indent || 0);
          const mc = maxChars(fontSize, availW);
          // Split into lines manually if text is longer than one line
          const lines: string[] = [];
          let remaining = text;
          while (remaining.length > 0) {
            if (remaining.length <= mc) {
              lines.push(remaining);
              break;
            }
            // Break at last space within mc chars, or hard-break
            const slice = remaining.substring(0, mc);
            const lastSp = slice.lastIndexOf(' ');
            const breakAt = lastSp > mc * 0.4 ? lastSp : mc;
            lines.push(remaining.substring(0, breakAt));
            remaining = remaining.substring(breakAt).trimStart();
          }
          const totalH = lines.length * (fontSize + 3);
          ensureSpace(totalH + 2);
          for (const line of lines) {
            ensureSpace(fontSize + 4);
            textLine(line, x, fontSize, { bold: opts?.bold, color: opts?.color, width: availW });
          }
        };

        const checkMark = (text: string, passed: boolean) => {
          ensureSpace(SMALL_LINE_H + 2);
          const startY = doc.y;
          const mark = passed ? '[PASS]' : '[FAIL]';
          const mc = maxChars(9, PW);
          const full = `${mark}  ${text}`;
          const clipped = full.length > mc ? full.substring(0, mc - 1) + '…' : full;
          doc.font(MONO_BOLD).fontSize(9).fillColor(passed ? '#276749' : '#c53030')
            .text(clipped.substring(0, mark.length + 2), LEFT, startY, { continued: true, lineBreak: false });
          doc.font(MONO).fillColor('#2d3748')
            .text(clipped.substring(mark.length + 2), { continued: false, lineBreak: false });
          doc.y = startY + SMALL_LINE_H;
        };

        // =====================================================================
        // PAGE 1: TITLE BLOCK
        // =====================================================================
        doc.y = 60;

        doubleBorder();
        let titleY = doc.y;
        doc.font(MONO_BOLD).fontSize(10).fillColor('#10b981')
          .text('DATACENDIA', LEFT, titleY, { align: 'center', width: PW, lineBreak: false });
        titleY += 14;
        doc.font(MONO_BOLD).fontSize(18).fillColor('#1a365d')
          .text("REGULATOR'S RECEIPT", LEFT, titleY, { align: 'center', width: PW, lineBreak: false });
        titleY += 24;
        doc.font(MONO).fontSize(9).fillColor('#4a5568')
          .text('Decision Evidence Package  |  Court Admissible  |  DCII Framework', LEFT, titleY, { align: 'center', width: PW, lineBreak: false });
        doc.y = titleY + 14;
        safeDown(0.5);
    // Extended methods extracted to pdf-methods.ts
export const pdfGeneratorService = new PDFGeneratorService();