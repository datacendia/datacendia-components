// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// APACHE TIKA SERVICE - Universal Document Extraction
// =============================================================================
// Extracts text and metadata from any enterprise document format:
// PDF, DOCX, PPTX, XLSX, MSG, EML, RTF, HTML, XML, and 1000+ more
// Powers: CendiaGnosis™ Instant Ingest feature
// =============================================================================

import fetch from 'node-fetch';
import FormData from 'form-data';
import { getErrorMessage } from '../../utils/errors.js';

// Tika server configuration
const TIKA_CONFIG = {
  url: process.env.TIKA_URL || 'http://localhost:9998',
  timeout: 60000, // 60 seconds for large documents
};

// Extracted document result
export interface ExtractedDocument {
  success: boolean;
  text: string;
  metadata: DocumentMetadata;
  error?: string;
}

// Document metadata from Tika
export interface DocumentMetadata {
  contentType: string;
  title?: string;
  author?: string;
  creationDate?: string;
  modificationDate?: string;
  pageCount?: number;
  wordCount?: number;
  language?: string;
  keywords?: string[];
  subject?: string;
  creator?: string;
  producer?: string;
  [key: string]: any; // Additional metadata fields
}

// Supported file types
export const SUPPORTED_FORMATS = {
  // Documents
  'application/pdf': 'PDF',
  'application/msword': 'DOC',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'DOCX',
  'application/vnd.ms-excel': 'XLS',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': 'XLSX',
  'application/vnd.ms-powerpoint': 'PPT',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation': 'PPTX',
  'application/rtf': 'RTF',
  // Email
  'message/rfc822': 'EML',
  'application/vnd.ms-outlook': 'MSG',
  // Text
  'text/plain': 'TXT',
  'text/html': 'HTML',
  'text/xml': 'XML',
  'application/json': 'JSON',
  'text/csv': 'CSV',
  // Images (OCR)
  'image/png': 'PNG',
  'image/jpeg': 'JPEG',
  'image/tiff': 'TIFF',
  'image/gif': 'GIF',
} as const;

class TikaService {
  private isAvailable: boolean = false;

  constructor() {
    this.checkAvailability();
  }

  /**
   * Check if Tika server is available
   */
  async checkAvailability(): Promise<boolean> {
    try {
      const response = await fetch(`${TIKA_CONFIG.url}/tika`, {
        method: 'GET',
        timeout: 5000,
      } as any);
      
      this.isAvailable = response.ok;
      console.log(`[Tika] Service ${this.isAvailable ? 'available' : 'unavailable'}`);
      return this.isAvailable;
    } catch (error) {
      this.isAvailable = false;
      console.warn('[Tika] Service not available');
      return false;
    }
  }

  /**
   * Extract text from a document buffer
   */
  async extractText(
    buffer: Buffer,
    mimeType?: string,
    fileName?: string
  ): Promise<ExtractedDocument> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    if (!this.isAvailable) {
      return {
        success: false,
        text: '',
        metadata: { contentType: mimeType || 'unknown' },
        error: 'Tika service not available',
      };
    }

    try {
      // Extract text using Tika's /tika endpoint
      const textResponse = await fetch(`${TIKA_CONFIG.url}/tika`, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType || 'application/octet-stream',
          'Accept': 'text/plain',
        },
        body: buffer,
        timeout: TIKA_CONFIG.timeout,
      } as any);

      if (!textResponse.ok) {
        throw new Error(`Tika text extraction failed: ${textResponse.statusText}`);
      }

      const text = await textResponse.text();

      // Extract metadata using Tika's /meta endpoint
      const metaResponse = await fetch(`${TIKA_CONFIG.url}/meta`, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType || 'application/octet-stream',
          'Accept': 'application/json',
        },
        body: buffer,
        timeout: TIKA_CONFIG.timeout,
      } as any);

      let metadata: DocumentMetadata = { contentType: mimeType || 'unknown' };

      if (metaResponse.ok) {
        const rawMeta = await metaResponse.json() as Record<string, any>;
        metadata = this.normalizeMetadata(rawMeta);
      }

      // Estimate word count
      metadata.wordCount = text.split(/\s+/).filter(w => w.length > 0).length;

      return {
        success: true,
        text: text.trim(),
        metadata,
      };
    } catch (error: unknown) {
      console.error('[Tika] Extraction error:', getErrorMessage(error));
      return {
        success: false,
        text: '',
        metadata: { contentType: mimeType || 'unknown' },
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Extract text with OCR for images/scanned PDFs
   */
  async extractWithOCR(
    buffer: Buffer,
    mimeType?: string
  ): Promise<ExtractedDocument> {
    if (!this.isAvailable) {
      await this.checkAvailability();
    }

    try {
      // Use Tika's OCR-enabled endpoint
      const response = await fetch(`${TIKA_CONFIG.url}/tika`, {
        method: 'PUT',
        headers: {
          'Content-Type': mimeType || 'application/octet-stream',
          'Accept': 'text/plain',
          'X-Tika-OCRLanguage': 'eng', // Default to English
          'X-Tika-PDFextractInlineImages': 'true',
        },
        body: buffer,
        timeout: TIKA_CONFIG.timeout * 2, // Double timeout for OCR
      } as any);

      if (!response.ok) {
        throw new Error(`Tika OCR extraction failed: ${response.statusText}`);
      }

      const text = await response.text();

      return {
        success: true,
        text: text.trim(),
        metadata: {
          contentType: mimeType || 'unknown',
          wordCount: text.split(/\s+/).filter(w => w.length > 0).length,
        },
      };
    } catch (error: unknown) {
      console.error('[Tika] OCR extraction error:', getErrorMessage(error));
      return {
        success: false,
        text: '',
        metadata: { contentType: mimeType || 'unknown' },
        error: getErrorMessage(error),
      };
    }
  }

  /**
   * Detect document type
   */
  async detectType(buffer: Buffer): Promise<string> {
    if (!this.isAvailable) {
      return 'application/octet-stream';
    }

    try {
      const response = await fetch(`${TIKA_CONFIG.url}/detect/stream`, {
        method: 'PUT',
        body: buffer,
        timeout: 10000,
      } as any);

      if (response.ok) {
        return await response.text();
      }
    } catch (error) {
      console.error('[Tika] Type detection error');
    }

    return 'application/octet-stream';
  }

  /**
   * Get supported MIME types
   */
  async getSupportedTypes(): Promise<string[]> {
    if (!this.isAvailable) {
      return Object.keys(SUPPORTED_FORMATS);
    }

    try {
      const response = await fetch(`${TIKA_CONFIG.url}/mime-types`, {
        method: 'GET',
        headers: { 'Accept': 'application/json' },
      } as any);

      if (response.ok) {
        const types = await response.json() as Record<string, any>;
        return Object.keys(types);
      }
    } catch (error) {
      console.error('[Tika] Failed to get supported types');
    }

    return Object.keys(SUPPORTED_FORMATS);
  }

  /**
   * Normalize metadata from Tika's raw output
   */
  private normalizeMetadata(raw: Record<string, any>): DocumentMetadata {
    return {
      contentType: raw['Content-Type'] || raw['content-type'] || 'unknown',
      title: raw['dc:title'] || raw['title'] || raw['Title'],
      author: raw['dc:creator'] || raw['Author'] || raw['meta:author'],
      creationDate: raw['dcterms:created'] || raw['Creation-Date'] || raw['created'],
      modificationDate: raw['dcterms:modified'] || raw['Last-Modified'] || raw['modified'],
      pageCount: parseInt(raw['xmpTPg:NPages'] || raw['Page-Count'] || '0') || undefined,
      language: raw['dc:language'] || raw['language'],
      keywords: raw['dc:subject']?.split(',').map((k: string) => k.trim()),
      subject: raw['dc:description'] || raw['subject'],
      creator: raw['pdf:docinfo:creator'] || raw['Application-Name'],
      producer: raw['pdf:docinfo:producer'] || raw['producer'],
      ...raw, // Include all raw metadata
    };
  }

  /**
   * Check if a MIME type is supported
   */
  isSupported(mimeType: string): boolean {
    return mimeType in SUPPORTED_FORMATS || mimeType.startsWith('text/');
  }

  /**
   * Get human-readable format name
   */
  getFormatName(mimeType: string): string {
    return (SUPPORTED_FORMATS as Record<string, string>)[mimeType] || 'Unknown';
  }
}

// Singleton instance
export const tikaService = new TikaService();

export default tikaService;
