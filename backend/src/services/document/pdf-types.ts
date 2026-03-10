type PDFDoc = any; // PDFDocument from pdfkit
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

