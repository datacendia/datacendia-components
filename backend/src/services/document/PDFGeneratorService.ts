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
          tagged: pdfaCompliant, // Enable tagging for PDF/A
          displayTitle: true,
        });

        const chunks: Buffer[] = [];
        let pageCount = 1;

        doc.on('data', (chunk: Buffer) => chunks.push(chunk));
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
        doc.on('error', reject);

        // Track page additions
        doc.on('pageAdded', () => {
          pageCount++;
          if (headerText) this.addHeader(doc, headerText);
          if (footerText || includePageNumbers) {
            this.addFooter(doc, footerText, includePageNumbers, pageCount);
          }
        });

        // Add watermark if specified
        if (watermark) {
          this.addWatermark(doc, watermark);
        }

        // Add header to first page
        if (headerText) {
          this.addHeader(doc, headerText);
        }

        // Add timestamp if enabled
        if (includeTimestamp) {
          doc.fontSize(8)
            .fillColor('#666666')
            .text(`Generated: ${new Date().toISOString()}`, margins.left, margins.top - 20, {
              align: 'right',
            });
          doc.moveDown(0.5);
        }

        // Process sections
        this.processSections(doc, sections, margins);

        // Add footer to first page
        if (footerText || includePageNumbers) {
          this.addFooter(doc, footerText, includePageNumbers, 1);
        }

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
          doc.moveDown(2);
          break;
      }
    }
  }

  private addHeading(doc: PDFDoc, text: string, level: number): void {
    const sizes = { 1: 24, 2: 18, 3: 14 };
    const size = sizes[level as keyof typeof sizes] || 14;
    
    doc.moveDown(0.5)
      .font(this.defaultFontBold)
      .fontSize(size)
      .fillColor('#1a1a1a')
      .text(text)
      .moveDown(0.3);
  }

  private addParagraph(doc: PDFDoc, text: string): void {
    doc.font(this.defaultFont)
      .fontSize(11)
      .fillColor('#333333')
      .text(text, { align: 'justify', lineGap: 2 })
      .moveDown(0.5);
  }

  private addTable(doc: PDFDoc, headers: string[], rows: string[][], margins: { left: number; right: number }): void {
    const pageWidth = doc.page.width - margins.left - margins.right;
    const columnCount = headers.length || (rows[0]?.length || 1);
    const columnWidth = pageWidth / columnCount;
    const startX = margins.left;
    let y = doc.y;

    // Draw header row
    if (headers.length > 0) {
      doc.font(this.defaultFontBold).fontSize(10).fillColor('#ffffff');
      
      // Header background
      doc.rect(startX, y, pageWidth, 20).fill('#2563eb');
      
      headers.forEach((header, i) => {
        doc.fillColor('#ffffff')
          .text(header, startX + (i * columnWidth) + 5, y + 5, {
            width: columnWidth - 10,
            align: 'left',
          });
      });
      y += 22;
    }

    // Draw data rows
    doc.font(this.defaultFont).fontSize(9).fillColor('#333333');
    
    rows.forEach((row, rowIndex) => {
      const rowHeight = 18;
      
      // Alternating row background
      if (rowIndex % 2 === 0) {
        doc.rect(startX, y, pageWidth, rowHeight).fill('#f8fafc');
      }
      
      row.forEach((cell, i) => {
        doc.fillColor('#333333')
          .text(cell || '', startX + (i * columnWidth) + 5, y + 4, {
            width: columnWidth - 10,
            align: 'left',
          });
      });
      
      y += rowHeight;
      
      // Check for page break
      if (y > doc.page.height - 100) {
        doc.addPage();
        y = doc.y;
      }
    });

    // Table border
    doc.rect(startX, doc.y - (rows.length * 18) - 22, pageWidth, (rows.length * 18) + 22)
      .stroke('#e2e8f0');

    doc.y = y + 10;
    doc.moveDown(0.5);
  }

  private addList(doc: PDFDoc, items: string[]): void {
    doc.font(this.defaultFont).fontSize(11).fillColor('#333333');
    
    items.forEach((item) => {
      doc.text(`• ${item}`, { indent: 20 });
    });
    
    doc.moveDown(0.5);
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
    doc.font(this.defaultFontBold)
      .fontSize(8)
      .fillColor('#666666')
      .text(text, 72, 30, { align: 'center', width: doc.page.width - 144 });
    doc.y = savedY;
  }

  private addFooter(doc: PDFDoc, text?: string, includePageNumbers?: boolean, pageNumber?: number): void {
    const savedY = doc.y;
    const footerY = doc.page.height - 50;
    
    doc.font(this.defaultFont)
      .fontSize(8)
      .fillColor('#666666');
    
    if (text) {
      doc.text(text, 72, footerY, { align: 'center', width: doc.page.width - 144 });
    }
    
    if (includePageNumbers && pageNumber) {
      doc.text(`Page ${pageNumber}`, 72, footerY + 12, { align: 'center', width: doc.page.width - 144 });
    }
    
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
