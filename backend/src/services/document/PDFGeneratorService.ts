// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// DATACENDIA PDF GENERATOR SERVICE
// Enterprise PDF/A Document Generation with Cryptographic Signatures
// =============================================================================

import PDFDocument from 'pdfkit';
type PDFDoc = InstanceType<typeof PDFDocument>;
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';

// =============================================================================
// TYPES & INTERFACES
// =============================================================================

export interface PDFMetadata {
  title: string;
  author?: string;
  subject?: string;
  keywords?: string[];
  creator?: string;
  producer?: string;
  creationDate?: Date;
  modificationDate?: Date;
}

export interface PDFSection {
  type: 'heading' | 'paragraph' | 'table' | 'list' | 'signature' | 'image' | 'divider' | 'spacer';
  content?: string;
  level?: number; // For headings: 1, 2, 3
  items?: string[]; // For lists
  rows?: string[][]; // For tables
  headers?: string[]; // For table headers
  imageData?: Buffer; // For images
  signatureData?: SignatureBlock; // For signature blocks
}

export interface SignatureBlock {
  signedBy: string;
  signedAt: Date;
  algorithm: string;
  signature: string;
  publicKeyFingerprint?: string;
  certificateChain?: string[];
}

export interface PDFGenerationOptions {
  format?: 'A4' | 'Letter' | 'Legal';
  orientation?: 'portrait' | 'landscape';
  margins?: { top: number; bottom: number; left: number; right: number };
  headerText?: string;
  footerText?: string;
  includePageNumbers?: boolean;
  includeTimestamp?: boolean;
  watermark?: string;
  pdfaCompliant?: boolean; // PDF/A-3 compliance for long-term archival
}

export interface GeneratedPDF {
  buffer: Buffer;
  filename: string;
  hash: string;
  size: number;
  pageCount: number;
  metadata: PDFMetadata;
  createdAt: Date;
}

// =============================================================================
// PDF GENERATOR SERVICE
// =============================================================================

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
        doubleBorder();
        safeDown(0.5);

        // Decision header fields
        const fmtDate = (d: Date | string) => {
          const dt = d instanceof Date ? d : new Date(d);
          return dt.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
        };

        kv('RECEIPT ID:', receipt.receiptId);
        kv('DECISION ID:', receipt.decision.id);
        kv('ORGANIZATION:', receipt.generatedBy);
        kv('DECISION DATE:', fmtDate(receipt.decision.completedAt));
        kv('DECISION TYPE:', `${receipt.decision.councilMode}${receipt.decision.vertical ? ` (${receipt.decision.vertical})` : ''}`);
        if (receipt.workflowConfig) {
          kv('COMPLIANCE PROFILE:', receipt.workflowConfig.complianceProfile.replace(/-/g, ' ').toUpperCase());
        }
        safeDown(0.5);

        // =================================================================
        // SECTION 1: DECISION SUMMARY
        // =================================================================
        sectionHeader(1, 'DECISION SUMMARY');
        kv('Question:', receipt.decision.question.substring(0, 200));
        kv('Recommendation:', receipt.decision.finalDecision.substring(0, 200));
        kv('Confidence:', `${receipt.decision.consensusScore}%`);

        const dissentCount = receipt.dissents?.length || receipt.participants.agents.filter(a => a.dissented).length;
        const dissenters = receipt.dissents?.map(d => d.agentName).join(', ')
          || receipt.participants.agents.filter(a => a.dissented).map(a => a.name).join(', ')
          || 'None';
        kv('Dissenting Views:', `${dissentCount} (${dissenters})`);

        if (receipt.participants.humanApprovers && receipt.participants.humanApprovers.length > 0) {
          kv('Human Approver:', receipt.participants.humanApprovers.map(h => `${h.name} (${h.role})`).join(', '));
        }

        kv('Created:', fmtDate(receipt.decision.createdAt));
        kv('Completed:', fmtDate(receipt.decision.completedAt));
        safeDown(0.5);

        // =================================================================
        // SECTION 2: CRYPTOGRAPHIC INTEGRITY
        // =================================================================
        sectionHeader(2, 'CRYPTOGRAPHIC INTEGRITY');

        mono('Decision Hash (SHA-256):', { bold: true });
        mono(`  ${receipt.evidenceChain.deliberationHash}`, { size: 8 });
        safeDown(0.3);

        mono('Merkle Root:', { bold: true });
        mono(`  ${receipt.evidenceChain.merkleRoot}`, { size: 8 });
        safeDown(0.3);

        if (receipt.cryptographicProof.signature) {
          mono('Digital Signature:', { bold: true });
          mono(`  [Verified] Signed by: ${receipt.cryptographicProof.signedBy || 'datacendia-kms'}`, { color: '#276749' });
          if (receipt.cryptographicProof.publicKeyFingerprint) {
            mono(`  Key ID: ${receipt.cryptographicProof.publicKeyFingerprint}`, { size: 8 });
          }
          if (receipt.cryptographicProof.signedAt) {
            mono(`  Signature Date: ${fmtDate(receipt.cryptographicProof.signedAt)}`, { size: 8 });
          }
        } else {
          mono('Digital Signature: [Unsigned - KMS signing not requested]', { bold: true });
        }
        safeDown(0.3);

        mono('Receipt Hash:', { bold: true });
        mono(`  ${receipt.cryptographicProof.receiptHash}`, { size: 8 });
        mono(`  Algorithm: ${receipt.cryptographicProof.algorithm}`, { size: 8 });
        safeDown(0.5);

        // =================================================================
        // SECTION 3: DECISION PROVENANCE
        // =================================================================
        sectionHeader(3, 'DECISION PROVENANCE');

        mono(`Council Members: ${receipt.participants.agents.length}`, { bold: true });
        for (const agent of receipt.participants.agents) {
          const dissFlag = agent.dissented ? ' [DISSENTED]' : '';
          const conf = agent.confidenceAvg != null ? `${agent.confidenceAvg}%` : '-';
          mono(`  ${agent.name}`, { bold: true, indent: 10 });
          mono(`    Role: ${agent.role} | Confidence: ${conf} | Responses: ${agent.responseCount}${dissFlag}`, { size: 8, indent: 10 });
          if (agent.description) {
            mono(`    ${agent.description.substring(0, 120)}`, { size: 8, indent: 10, color: '#4a5568' });
          }
        }
        safeDown(0.3);

        mono('Evidence Chain Hashes:', { bold: true });
        mono(`  Citations Hash:       ${receipt.evidenceChain.citationsHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        mono(`  Agent Responses Hash: ${receipt.evidenceChain.agentResponsesHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        mono(`  Dissents Hash:        ${receipt.evidenceChain.dissentsHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        safeDown(0.3);

        // Dissent details
        if (receipt.dissents && receipt.dissents.length > 0) {
          mono('Dissent Details:', { bold: true });
          for (const d of receipt.dissents) {
            mono(`  ${d.agentName} (${d.severity}): "${d.reason.substring(0, 120)}"${d.protected ? ' [PROTECTED]' : ''}`, { indent: 10 });
          }
        }
        safeDown(0.5);

        // =================================================================
        // SECTION 4: COMPLIANCE VERIFICATION
        // =================================================================
        sectionHeader(4, 'COMPLIANCE VERIFICATION');

        if (receipt.workflowConfig) {
          kv('Workflow:', receipt.workflowConfig.workflowType);
          kv('Vertical:', receipt.workflowConfig.verticalId);
          kv('Profile:', receipt.workflowConfig.complianceProfile);
          safeDown(0.3);
        }

        // Framework compliance checks
        if (receipt.compliance.requirements && receipt.compliance.requirements.length > 0) {
          for (const req of receipt.compliance.requirements) {
            checkMark(`${req.framework}: ${req.requirement}`, req.status === 'met' || req.status === 'MET');
          }
        } else {
          for (const fw of receipt.compliance.frameworks) {
            checkMark(`${fw}: Framework compliance verified`, true);
          }
        }
        safeDown(0.3);

        mono('Gates Cleared:', { bold: true });
        mono(`  ${receipt.compliance.gatesCleared.join(', ')}`, { indent: 10, size: 8 });

        if (receipt.compliance.gatesFailed.length > 0) {
          mono('Gates Failed:', { bold: true, color: '#c53030' });
          mono(`  ${receipt.compliance.gatesFailed.join(', ')}`, { indent: 10, size: 8, color: '#c53030' });
        }
        safeDown(0.5);

        // =================================================================
        // SECTION 5: IISS SCORES (P1-P9)
        // =================================================================
        let nextSection = 5;
        if (receipt.iissScores) {
          sectionHeader(nextSection, 'IISS™ INTEGRITY SCORES');
          nextSection++;
          const iiss = receipt.iissScores;
          const bandColors: Record<string, string> = {
            exceptional: '#276749', resilient: '#2b6cb0', developing: '#c05621',
            vulnerable: '#c53030', critical: '#9b2c2c',
          };
          const bandColor = bandColors[iiss.band] || '#2d3748';
          kv('Overall Score:', `${iiss.overallScore} / 1000`);
          mono(`  Band: ${iiss.band.toUpperCase()} | Certification: ${iiss.certificationLevel}`, { bold: true, color: bandColor });
          safeDown(0.3);
          mono('Primitive Scores:', { bold: true });
          const primLabels: Record<string, string> = {
            discovery_time_proof: 'P1', deliberation_capture: 'P2', override_accountability: 'P3',
            continuity_memory: 'P4', drift_detection: 'P5', cognitive_bias_mitigation: 'P6',
            quantum_resistant_integrity: 'P7', synthetic_media_authentication: 'P8',
            cross_jurisdiction_compliance: 'P9',
          };
          for (const dim of iiss.dimensions) {
            const label = primLabels[dim.primitive] || '??';
            const pct = dim.maxScore > 0 ? Math.round((dim.score / dim.maxScore) * 100) : 0;
            const bar = '█'.repeat(Math.round(pct / 10)) + '░'.repeat(10 - Math.round(pct / 10));
            mono(`  ${label} ${dim.name}`, { bold: true, indent: 10 });
            mono(`     ${bar}  ${dim.normalizedScore}/1000  (${pct}%)`, { size: 8, indent: 10 });
          }
          safeDown(0.5);
        }

        // =================================================================
        // SECTION N: MEDIA AUTHENTICATION (P8)
        // =================================================================
        if (receipt.mediaAuthentication) {
          sectionHeader(nextSection, 'SYNTHETIC MEDIA AUTHENTICATION');
          nextSection++;
          const ma = receipt.mediaAuthentication;
          kv('Assets Verified:', String(ma.assetsVerified));
          checkMark('C2PA Content Provenance Signing', ma.c2paProvenanceSigned);
          checkMark('Chain of Custody Intact', ma.chainOfCustodyIntact);
          checkMark('Deepfake Analysis Executed', ma.deepfakeAnalysisRun);

          if (ma.verdicts.length > 0) {
            safeDown(0.3);
            mono('Verification Verdicts:', { bold: true });
            for (const v of ma.verdicts) {
              const verdict = v.verdict.replace(/_/g, ' ').toUpperCase();
              mono(`  - ${v.assetName}: ${verdict} (${v.confidence}% confidence)`, { indent: 10 });
            }
          }
          safeDown(0.5);
        }

        // =================================================================
        // SECTION N: AUDIT TRAIL (condensed)
        // =================================================================
        const auditSectionNum = nextSection;
        if (receipt.auditTrail && receipt.auditTrail.length > 0) {
          sectionHeader(auditSectionNum, 'AUDIT TRAIL');
          const milestoneActions = ['DELIBERATION_CREATED', 'DELIBERATION_COMPLETED', 'RECEIPT_GENERATED'];
          const milestones = receipt.auditTrail.filter(e =>
            milestoneActions.includes(e.action) || e.action.startsWith('PHASE_')
          );
          const agentResponses = receipt.auditTrail.filter(e => e.action === 'AGENT_RESPONSE');

          mono(`Total Events: ${receipt.auditTrail.length} (${agentResponses.length} agent responses, ${milestones.length} milestones)`, { bold: true });
          safeDown(0.2);

          for (const m of milestones.slice(0, 15)) {
            const ts = m.timestamp instanceof Date ? fmtDate(m.timestamp) : String(m.timestamp).substring(0, 19);
            const hashSnip = typeof m.hash === 'string' ? m.hash.substring(0, 12) + '..' : '';
            mono(`  ${ts}  ${m.action.padEnd(26)}  ${m.actor.padEnd(16).substring(0, 16)}  ${hashSnip}`, { size: 7.5, indent: 4 });
          }

          if (agentResponses.length > 0) {
            safeDown(0.2);
            const actors = [...new Set(agentResponses.map(e => e.actor))];
            mono(`Agent Respondents (${agentResponses.length}): ${actors.join(', ')}`, { size: 8 });
          }
          safeDown(0.5);
        }

        // =================================================================
        // SECTION 7: RETENTION & LEGAL
        // =================================================================
        const retentionSectionNum = auditSectionNum + (receipt.auditTrail && receipt.auditTrail.length > 0 ? 1 : 0);
        sectionHeader(retentionSectionNum, 'RETENTION & LEGAL');
        kv('Retention Period:', receipt.retention.retentionPeriod);
        kv('Retain Until:', receipt.retention.retentionUntil instanceof Date ? fmtDate(receipt.retention.retentionUntil) : String(receipt.retention.retentionUntil));
        kv('Legal Hold:', receipt.retention.legalHold ? 'YES' : 'No');
        kv('Jurisdiction:', receipt.retention.jurisdiction);
        safeDown(0.5);

        // =================================================================
        // SECTION 8: VERIFICATION INSTRUCTIONS
        // =================================================================
        const verifySectionNum = retentionSectionNum + 1;
        sectionHeader(verifySectionNum, 'VERIFICATION INSTRUCTIONS');
        mono('To independently verify this evidence package:', { bold: true });
        safeDown(0.3);
        mono('1. Verify decision hash:', { bold: true, indent: 10 });
        mono(`   $ echo "${receipt.decision.id}" | sha256sum`, { size: 8, indent: 10 });
        mono(`   Expected: ${receipt.evidenceChain.deliberationHash.substring(0, 32)}...`, { size: 8, indent: 10 });
        safeDown(0.2);
        mono('2. Verify Merkle root:', { bold: true, indent: 10 });
        mono('   Recompute from leaf hashes: deliberation, citations, responses, dissents', { size: 8, indent: 10 });
        mono(`   Expected root: ${receipt.evidenceChain.merkleRoot.substring(0, 32)}...`, { size: 8, indent: 10 });
        safeDown(0.2);

        if (receipt.cryptographicProof.signature) {
          mono('3. Verify digital signature:', { bold: true, indent: 10 });
          mono('   $ openssl dgst -sha256 -verify datacendia_public_key.pem \\', { size: 8, indent: 10 });
          mono('     -signature receipt.sig receipt.json', { size: 8, indent: 10 });
          safeDown(0.2);
        }

        mono(`${receipt.cryptographicProof.signature ? '4' : '3'}. Access full evidence vault:`, { bold: true, indent: 10 });
        mono('   Contact: compliance@datacendia.com', { size: 8, indent: 10 });
        mono(`   Reference: ${receipt.receiptId}`, { size: 8, indent: 10 });
        safeDown(0.5);

        // =====================================================================
        // FOOTER BLOCK
        // =====================================================================
        ensureSpace(80);
        doubleBorder();
        let footY = doc.y;
        doc.font(MONO_BOLD).fontSize(9).fillColor('#10b981')
          .text('DATACENDIA™', LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        footY += 12;
        doc.font(MONO).fontSize(8).fillColor('#4a5568')
          .text(`DCII Framework v${receipt.version}  |  Decisional Compliance Intelligence Infrastructure`, LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        footY += 11;
        doc.text(`Generated: ${fmtDate(receipt.generatedAt)}  |  Hash: ${receipt.cryptographicProof.receiptHash.substring(0, 32)}...`, LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        footY += 11;
        doc.font(MONO).fontSize(7).fillColor('#718096')
          .text(`(c) ${new Date().getFullYear()} Datacendia, LLC. All rights reserved. Proprietary and confidential.`, LEFT, footY, { align: 'center', width: PW, lineBreak: false });
        doc.y = footY + 11;
        doubleBorder();

        // Post-process: add headers & footers to every buffered page
        const range = doc.bufferedPageRange();
        for (let i = 0; i < range.count; i++) {
          doc.switchToPage(i);
          this.addReceiptPageFrame(doc, i + 1);
        }
        doc.on('end', () => {
          const buffer = Buffer.concat(chunks);
          const hash = crypto.createHash('sha256').update(buffer).digest('hex');
          resolve({
            buffer,
            filename: `regulators-receipt-${receipt.receiptId}-${Date.now()}.pdf`,
            hash,
            size: buffer.length,
            pageCount: range.count,
            metadata: {
              title: `Regulators Receipt - ${receipt.receiptId}`,
              subject: "Regulator's Receipt - Court-Admissible Decision Documentation",
            },
            createdAt: new Date(),
          });
        });

        doc.end();
      } catch (error) {
        reject(error);
      }
    });
  }

  private addReceiptPageFrame(doc: PDFDoc, pageNum: number): void {
    const savedY = doc.y;
    // Temporarily set bottom margin to 0 so pdfkit's overflow detection
    // does NOT trigger addPage() when we render the footer near the bottom.
    const savedBottom = doc.page.margins.bottom;
    doc.page.margins.bottom = 0;

    // Header
    doc.font('Courier-Bold').fontSize(7).fillColor('#718096')
      .text("DATACENDIA REGULATOR'S RECEIPT  --  CONFIDENTIAL  --  COURT ADMISSIBLE", 60, 20, {
        align: 'center', width: doc.page.width - 120, lineBreak: false,
      });
    // Footer
    doc.font('Courier').fontSize(7).fillColor('#718096')
      .text(`Cryptographically signed. Tamper-evident. Court-admissible.    Page ${pageNum}`, 60, doc.page.height - 35, {
        align: 'center', width: doc.page.width - 120, lineBreak: false,
      });

    doc.page.margins.bottom = savedBottom;
    doc.y = savedY;
  }

  /**
   * Standard report format — uses generic PDFSection tables/paragraphs.
   * This is the "executive summary" style, not the court-admissible Appendix B format.
   */
  async generateRegulatorsReceiptStandard(receipt: Parameters<PDFGeneratorService['generateRegulatorsReceipt']>[0]): Promise<GeneratedPDF> {
    const fmtDate = (d: Date | string) => {
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    };

    const sections: PDFSection[] = [
      { type: 'heading', content: "REGULATOR'S RECEIPT", level: 1 },
      { type: 'divider' },
      { type: 'paragraph', content: `Receipt ID: ${receipt.receiptId}` },
      { type: 'paragraph', content: `Version: ${receipt.version}` },
      { type: 'paragraph', content: `Generated: ${fmtDate(receipt.generatedAt)}` },
      { type: 'paragraph', content: `Generated By: ${receipt.generatedBy}` },
      { type: 'spacer' },

      { type: 'heading', content: 'DECISION SUMMARY', level: 2 },
      { type: 'paragraph', content: `Decision ID: ${receipt.decision.id}` },
      { type: 'paragraph', content: `Question: ${receipt.decision.question}` },
      { type: 'paragraph', content: `Final Decision: ${receipt.decision.finalDecision}` },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Council Mode', receipt.decision.councilMode],
          ['Consensus Score', `${receipt.decision.consensusScore}%`],
          ['Created', fmtDate(receipt.decision.createdAt)],
          ['Completed', fmtDate(receipt.decision.completedAt)],
          ...(receipt.decision.vertical ? [['Vertical', receipt.decision.vertical]] : []),
        ],
      },
      { type: 'spacer' },

      { type: 'heading', content: 'COUNCIL PARTICIPANTS', level: 2 },
      {
        type: 'table',
        headers: ['Agent', 'Role', 'Description', 'Responses', 'Confidence'],
        rows: receipt.participants.agents.map(a => [
          a.name,
          a.role,
          a.description ? a.description.substring(0, 60) : '-',
          `${a.responseCount}${a.dissented ? ' [DISSENT]' : ''}`,
          a.confidenceAvg != null ? `${a.confidenceAvg}%` : '-',
        ]),
      },
      { type: 'spacer' },

      { type: 'heading', content: 'EVIDENCE CHAIN (CRYPTOGRAPHIC)', level: 2 },
      {
        type: 'table',
        headers: ['Element', 'SHA-256 Hash'],
        rows: [
          ['Merkle Root', receipt.evidenceChain.merkleRoot],
          ['Deliberation Hash', receipt.evidenceChain.deliberationHash],
          ['Citations Hash', receipt.evidenceChain.citationsHash],
          ['Agent Responses Hash', receipt.evidenceChain.agentResponsesHash],
          ['Dissents Hash', receipt.evidenceChain.dissentsHash],
        ],
      },
      { type: 'spacer' },

      { type: 'heading', content: 'COMPLIANCE MAPPING', level: 2 },
      { type: 'paragraph', content: `Frameworks: ${receipt.compliance.frameworks.join(', ')}` },
    ];

    if (receipt.compliance.requirements && receipt.compliance.requirements.length > 0) {
      sections.push({
        type: 'table',
        headers: ['Framework', 'Requirement', 'Status'],
        rows: receipt.compliance.requirements.map(r => [r.framework, r.requirement, r.status.toUpperCase()]),
      });
    }

    sections.push(
      { type: 'paragraph', content: `Gates Cleared: ${receipt.compliance.gatesCleared.join(', ')}` },
      { type: 'paragraph', content: `Gates Failed: ${receipt.compliance.gatesFailed.length > 0 ? receipt.compliance.gatesFailed.join(', ') : 'None'}` },
      { type: 'spacer' },
    );

    // IISS Scores section
    if (receipt.iissScores) {
      const iiss = receipt.iissScores;
      sections.push(
        { type: 'heading', content: `IISS™ INTEGRITY SCORE: ${iiss.overallScore}/1000 (${iiss.band.toUpperCase()})`, level: 2 },
        { type: 'paragraph', content: `Certification Level: ${iiss.certificationLevel} | Calculated: ${fmtDate(iiss.calculatedAt)}` },
        {
          type: 'table',
          headers: ['#', 'Primitive', 'Score', 'Max', 'Rating'],
          rows: iiss.dimensions.map((d, i) => [
            `P${i + 1}`,
            d.name,
            d.score.toString(),
            d.maxScore.toString(),
            `${d.normalizedScore}/1000`,
          ]),
        },
        { type: 'spacer' },
      );
    }

    if (receipt.dissents && receipt.dissents.length > 0) {
      sections.push(
        { type: 'heading', content: 'DISSENTS & MINORITY VIEWS', level: 2 },
        {
          type: 'table',
          headers: ['Agent', 'Severity', 'Reason', 'Protected'],
          rows: receipt.dissents.map(d => [d.agentName, d.severity, d.reason, d.protected ? 'YES' : 'No']),
        },
        { type: 'spacer' },
      );
    }

    if (receipt.auditTrail && receipt.auditTrail.length > 0) {
      const milestoneActions = ['DELIBERATION_CREATED', 'DELIBERATION_COMPLETED', 'RECEIPT_GENERATED'];
      const milestones = receipt.auditTrail.filter(e =>
        milestoneActions.includes(e.action) || e.action.startsWith('PHASE_')
      );
      sections.push(
        { type: 'heading', content: 'AUDIT TRAIL', level: 2 },
        { type: 'paragraph', content: `Total events: ${receipt.auditTrail.length}` },
        {
          type: 'table',
          headers: ['Timestamp', 'Action', 'Actor', 'Hash'],
          rows: milestones.map(e => [
            e.timestamp instanceof Date ? e.timestamp.toISOString() : String(e.timestamp),
            e.action,
            e.actor,
            typeof e.hash === 'string' ? e.hash.substring(0, 16) + '...' : '',
          ]),
        },
        { type: 'spacer' },
      );
    }

    sections.push(
      { type: 'heading', content: 'CRYPTOGRAPHIC PROOF', level: 2 },
      { type: 'paragraph', content: `Algorithm: ${receipt.cryptographicProof.algorithm}` },
      { type: 'paragraph', content: `Receipt Hash: ${receipt.cryptographicProof.receiptHash}` },
    );

    if (receipt.cryptographicProof.signature) {
      sections.push({
        type: 'signature',
        signatureData: {
          signedBy: receipt.cryptographicProof.signedBy || 'datacendia-kms',
          signedAt: receipt.cryptographicProof.signedAt || new Date(),
          algorithm: receipt.cryptographicProof.algorithm,
          signature: receipt.cryptographicProof.signature,
          publicKeyFingerprint: receipt.cryptographicProof.publicKeyFingerprint,
        },
      });
    }

    sections.push(
      { type: 'spacer' },
      { type: 'heading', content: 'RETENTION & LEGAL', level: 2 },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Retention Period', receipt.retention.retentionPeriod],
          ['Retain Until', receipt.retention.retentionUntil instanceof Date ? fmtDate(receipt.retention.retentionUntil) : String(receipt.retention.retentionUntil)],
          ['Legal Hold', receipt.retention.legalHold ? 'YES' : 'No'],
          ['Jurisdiction', receipt.retention.jurisdiction],
        ],
      },
      { type: 'spacer' },
      { type: 'divider' },
      { type: 'paragraph', content: "This Regulator's Receipt is a cryptographically signed record of the decision-making process. The Merkle root and hashes provide tamper-evident proof of the deliberation contents." },
      { type: 'paragraph', content: `© ${new Date().getFullYear()} Datacendia, LLC. All rights reserved. DCII Framework — Decisional Compliance Intelligence Infrastructure.` },
    );

    return this.generatePDF(sections, {
      title: `Regulators Receipt - ${receipt.receiptId}`,
      subject: "Regulator's Receipt - Executive Summary",
      keywords: ['regulators-receipt', 'decision', 'evidence', 'compliance', receipt.receiptId],
    }, {
      headerText: "DATACENDIA REGULATOR'S RECEIPT - CONFIDENTIAL",
      footerText: 'Cryptographically signed. Tamper-evident.',
      pdfaCompliant: true,
    });
  }

  /**
   * Full Deliberation Evidence Package — comprehensive record with all agent
   * responses, citations, reasoning chains, phase transitions, and IISS scores.
   */
  async generateDeliberationEvidencePackage(
    receipt: Parameters<PDFGeneratorService['generateRegulatorsReceipt']>[0],
    deliberation: {
      question: string;
      phases: { name: string; startedAt: Date; completedAt?: Date }[];
      messages: {
        agentName: string;
        agentRole: string;
        phase: string;
        content: string;
        confidence?: number;
        sources: { reference: string; url?: string }[];
        createdAt: Date;
      }[];
    },
  ): Promise<GeneratedPDF> {
    const fmtDate = (d: Date | string) => {
      const dt = d instanceof Date ? d : new Date(d);
      return dt.toISOString().replace('T', ' ').substring(0, 19) + ' UTC';
    };

    const sections: PDFSection[] = [
      { type: 'heading', content: 'FULL DELIBERATION EVIDENCE PACKAGE', level: 1 },
      { type: 'paragraph', content: 'Datacendia™ DCII Framework — Complete Decision Record' },
      { type: 'divider' },
      { type: 'paragraph', content: `Receipt ID: ${receipt.receiptId}  |  Version: ${receipt.version}` },
      { type: 'paragraph', content: `Generated: ${fmtDate(receipt.generatedAt)}  |  By: ${receipt.generatedBy}` },
      { type: 'spacer' },

      // Decision summary
      { type: 'heading', content: 'DECISION OVERVIEW', level: 2 },
      { type: 'paragraph', content: `Question: ${receipt.decision.question}` },
      { type: 'paragraph', content: `Final Decision: ${receipt.decision.finalDecision}` },
      {
        type: 'table',
        headers: ['Field', 'Value'],
        rows: [
          ['Council Mode', receipt.decision.councilMode],
          ['Consensus Score', `${receipt.decision.consensusScore}%`],
          ['Created', fmtDate(receipt.decision.createdAt)],
          ['Completed', fmtDate(receipt.decision.completedAt)],
          ...(receipt.decision.vertical ? [['Vertical', receipt.decision.vertical]] : []),
        ],
      },
      { type: 'spacer' },

      // Council participants with full descriptions
      { type: 'heading', content: 'COUNCIL PARTICIPANTS', level: 2 },
    ];

    for (const agent of receipt.participants.agents) {
      const conf = agent.confidenceAvg != null ? `${agent.confidenceAvg}%` : '-';
      const dissent = agent.dissented ? ' [DISSENTED]' : '';
      sections.push(
        { type: 'heading', content: `${agent.name}${dissent}`, level: 3 },
        { type: 'paragraph', content: `Role: ${agent.role}  |  Confidence: ${conf}  |  Responses: ${agent.responseCount}` },
      );
      if (agent.description) {
        sections.push({ type: 'paragraph', content: agent.description });
      }
    }
    sections.push({ type: 'spacer' });

    // IISS Scores
    if (receipt.iissScores) {
      const iiss = receipt.iissScores;
      sections.push(
        { type: 'heading', content: `IISS™ INTEGRITY SCORE: ${iiss.overallScore}/1000 (${iiss.band.toUpperCase()})`, level: 2 },
        { type: 'paragraph', content: `Certification: ${iiss.certificationLevel}  |  Calculated: ${fmtDate(iiss.calculatedAt)}` },
        {
          type: 'table',
          headers: ['#', 'Primitive', 'Score', 'Max', 'Rating'],
          rows: iiss.dimensions.map((d, i) => [
            `P${i + 1}`, d.name, d.score.toString(), d.maxScore.toString(), `${d.normalizedScore}/1000`,
          ]),
        },
        { type: 'spacer' },
      );
    }

    // Phase timeline
    if (deliberation.phases.length > 0) {
      sections.push(
        { type: 'heading', content: 'DELIBERATION PHASES', level: 2 },
        {
          type: 'table',
          headers: ['Phase', 'Started', 'Completed'],
          rows: deliberation.phases.map(p => [
            p.name,
            fmtDate(p.startedAt),
            p.completedAt ? fmtDate(p.completedAt) : 'In Progress',
          ]),
        },
        { type: 'spacer' },
      );
    }

    // Full agent responses — the core evidence
    sections.push({ type: 'heading', content: 'AGENT RESPONSES (FULL TRANSCRIPT)', level: 2 });

    let prevPhase = '';
    for (const msg of deliberation.messages) {
      if (msg.phase !== prevPhase) {
        sections.push(
          { type: 'divider' },
          { type: 'heading', content: `Phase: ${msg.phase.replace(/_/g, ' ').toUpperCase()}`, level: 3 },
        );
        prevPhase = msg.phase;
      }

      const confStr = msg.confidence != null ? ` (${Math.round(msg.confidence * 100)}% confidence)` : '';
      sections.push(
        { type: 'heading', content: `${msg.agentName} — ${msg.agentRole}${confStr}`, level: 3 },
        { type: 'paragraph', content: `${fmtDate(msg.createdAt)}` },
        { type: 'paragraph', content: msg.content },
      );

      if (msg.sources.length > 0) {
        sections.push({
          type: 'list',
          items: msg.sources.map(s => `${s.reference}${s.url ? ` — ${s.url}` : ''}`),
        });
      }
    }
    sections.push({ type: 'spacer' });

    // Dissents
    if (receipt.dissents && receipt.dissents.length > 0) {
      sections.push(
        { type: 'heading', content: 'DISSENTS & MINORITY VIEWS', level: 2 },
        {
          type: 'table',
          headers: ['Agent', 'Severity', 'Reason', 'Protected'],
          rows: receipt.dissents.map(d => [d.agentName, d.severity, d.reason, d.protected ? 'YES' : 'No']),
        },
        { type: 'spacer' },
      );
    }

    // Evidence chain + crypto
    sections.push(
      { type: 'heading', content: 'CRYPTOGRAPHIC EVIDENCE CHAIN', level: 2 },
      {
        type: 'table',
        headers: ['Element', 'SHA-256 Hash'],
        rows: [
          ['Merkle Root', receipt.evidenceChain.merkleRoot],
          ['Deliberation Hash', receipt.evidenceChain.deliberationHash],
          ['Citations Hash', receipt.evidenceChain.citationsHash],
          ['Agent Responses Hash', receipt.evidenceChain.agentResponsesHash],
          ['Dissents Hash', receipt.evidenceChain.dissentsHash],
          ['Receipt Hash', receipt.cryptographicProof.receiptHash],
        ],
      },
      { type: 'spacer' },
      { type: 'divider' },
      { type: 'paragraph', content: `This document constitutes a complete evidentiary record of the deliberation process. All agent responses, citations, and reasoning chains are preserved in full.` },
      { type: 'paragraph', content: `© ${new Date().getFullYear()} Datacendia, LLC. All rights reserved. DCII Framework — Decisional Compliance Intelligence Infrastructure.` },
    );

    return this.generatePDF(sections, {
      title: `Deliberation Evidence Package - ${receipt.receiptId}`,
      subject: 'Full Deliberation Evidence Package',
      keywords: ['deliberation', 'evidence-package', 'full-transcript', receipt.receiptId],
    }, {
      headerText: 'DATACENDIA — FULL DELIBERATION EVIDENCE PACKAGE — CONFIDENTIAL',
      footerText: 'Complete decision record. Tamper-evident. Court-admissible.',
      pdfaCompliant: true,
    });
  }

  async generateAuditReport(audit: {
    auditId: string;
    title: string;
    scope: string;
    findings: { id: string; severity: string; title: string; description: string; recommendation: string }[];
    summary: string;
    auditor: string;
    auditDate: Date;
    signature?: SignatureBlock;
  }): Promise<GeneratedPDF> {
    const sections: PDFSection[] = [
      { type: 'heading', content: 'DATACENDIA AUDIT REPORT', level: 1 },
      { type: 'divider' },
      { type: 'paragraph', content: `Audit ID: ${audit.auditId}` },
      { type: 'paragraph', content: `Date: ${audit.auditDate.toISOString()}` },
      { type: 'paragraph', content: `Auditor: ${audit.auditor}` },
      { type: 'spacer' },
      { type: 'heading', content: 'Scope', level: 2 },
      { type: 'paragraph', content: audit.scope },
      { type: 'spacer' },
      { type: 'heading', content: 'Executive Summary', level: 2 },
      { type: 'paragraph', content: audit.summary },
      { type: 'spacer' },
      { type: 'heading', content: 'Findings', level: 2 },
    ];

    // Add each finding
    audit.findings.forEach((finding, index) => {
      sections.push(
        { type: 'heading', content: `Finding ${index + 1}: ${finding.title}`, level: 3 },
        { type: 'paragraph', content: `Severity: ${finding.severity.toUpperCase()}` },
        { type: 'paragraph', content: finding.description },
        { type: 'paragraph', content: `Recommendation: ${finding.recommendation}` },
        { type: 'divider' }
      );
    });

    if (audit.signature) {
      sections.push(
        { type: 'spacer' },
        { type: 'signature', signatureData: audit.signature }
      );
    }

    return this.generatePDF(sections, {
      title: audit.title,
      subject: 'Security Audit Report',
      keywords: ['audit', 'security', 'compliance', audit.auditId],
    }, {
      headerText: 'DATACENDIA AUDIT - CONFIDENTIAL',
      footerText: 'This document contains confidential information.',
      watermark: 'CONFIDENTIAL',
      pdfaCompliant: true,
    });
  }

  // ===========================================================================
  // UTILITY METHODS
  // ===========================================================================

  private sanitizeFilename(filename: string): string {
    return filename
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }

  async savePDF(pdf: GeneratedPDF, directory?: string): Promise<string> {
    const targetDir = directory || this.storagePath;
    const filepath = path.join(targetDir, pdf.filename);
    
    await fs.promises.writeFile(filepath, pdf.buffer);
    logger.info(`PDF saved: ${filepath} (${pdf.size} bytes)`);
    
    return filepath;
  }
}

// Singleton instance
export const pdfGeneratorService = new PDFGeneratorService();
