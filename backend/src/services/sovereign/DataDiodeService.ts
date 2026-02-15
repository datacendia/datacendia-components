// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

// =============================================================================
// CENDIA DATA DIODE™ - UNIDIRECTIONAL SOVEREIGN DATA INGEST
// "We never make outbound calls. Data flows in, never out."
//
// Enterprise-grade one-way data ingestion for air-gapped environments.
// Supports: GRIB (weather), CSV, JSON, XML, Parquet, and custom formats.
// Security: Signature verification, virus scanning integration, quarantine.
// =============================================================================

import { EventEmitter } from 'events';
import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { getErrorMessage, getErrorStack } from '../../utils/errors.js';

// =============================================================================
// TYPES
// =============================================================================

export type DataFormat = 
  | 'grib2'      // Aviation weather (NOAA GFS, etc.)
  | 'metar'      // Aviation weather reports
  | 'taf'        // Terminal aerodrome forecasts
  | 'csv'        // Tabular data
  | 'json'       // Structured data
  | 'jsonl'      // JSON Lines (streaming)
  | 'xml'        // Legacy enterprise
  | 'parquet'    // Columnar analytics
  | 'avro'       // Schema-rich binary
  | 'protobuf'   // Protocol buffers
  | 'custom';    // User-defined parser

export type IngestStatus = 
  | 'detected'           // File detected in drop zone
  | 'quarantined'        // Moved to quarantine for scanning
  | 'scanning'           // Virus/malware scan in progress
  | 'signature_check'    // Verifying digital signature
  | 'parsing'            // Extracting data
  | 'validating'         // Schema validation
  | 'ingesting'          // Writing to internal systems
  | 'completed'          // Successfully ingested
  | 'failed'             // Processing failed
  | 'rejected';          // Failed security checks

export interface IngestSource {
  id: string;
  name: string;
  description: string;
  
  // Watch configuration
  watchPath: string;
  filePattern: string;         // Glob pattern (e.g., "*.grib2")
  format: DataFormat;
  
  // Security
  requireSignature: boolean;
  signaturePublicKey?: string;
  allowedOrigins?: string[];   // For signed manifests
  quarantineDuration: number;  // Seconds to hold before processing
  
  // Processing
  parser?: string;             // Custom parser module
  schema?: object;             // JSON Schema for validation
  targetSystem: 'predict' | 'gnosis' | 'panopticon' | 'custom';
  
  // Scheduling
  enabled: boolean;
  pollInterval: number;        // Milliseconds (for non-inotify systems)
  maxConcurrent: number;
  
  // Metadata
  createdAt: Date;
  lastActivity?: Date;
}

export interface IngestEvent {
  id: string;
  sourceId: string;
  sourceName: string;
  
  // File info
  filePath: string;
  fileName: string;
  fileSize: number;
  fileHash: string;            // SHA-256
  
  // Processing
  status: IngestStatus;
  format: DataFormat;
  
  // Security audit
  signatureValid?: boolean;
  signedBy?: string;
  scanResult?: 'clean' | 'suspicious' | 'malicious';
  scanEngine?: string;
  
  // Results
  recordsExtracted?: number;
  bytesProcessed?: number;
  targetSystem?: string;
  
  // Errors
  errorMessage?: string;
  errorStack?: string;
  
  // Timing
  detectedAt: Date;
  quarantinedAt?: Date;
  scannedAt?: Date;
  parsedAt?: Date;
  completedAt?: Date;
  
  // Immutability
  ledgerHash: string;
}

export interface DiodeStatistics {
  totalIngested: number;
  totalRejected: number;
  totalBytes: number;
  byFormat: Record<DataFormat, number>;
  bySource: Record<string, number>;
  lastIngestAt?: Date;
  averageProcessingMs: number;
}

// =============================================================================
// GRIB PARSER (Aviation Weather)
// =============================================================================

interface GribMessage {
  parameter: string;
  level: string;
  forecastTime: number;
  validTime: Date;
  gridSize: { lat: number; lon: number };
  values: number[];
  min: number;
  max: number;
  mean: number;
}

interface ParsedGribData {
  edition: number;
  center: string;
  model: string;
  referenceTime: Date;
  messages: GribMessage[];
  metadata: Record<string, any>;
}

// =============================================================================
// DATA DIODE SERVICE
// =============================================================================

class DataDiodeService extends EventEmitter {
  private sources: Map<string, IngestSource> = new Map();
  private events: Map<string, IngestEvent> = new Map();
  private watchers: Map<string, fs.FSWatcher> = new Map();
  private processing: Set<string> = new Set();
  private statistics: DiodeStatistics;
  private quarantinePath: string;
  private archivePath: string;
  private rejectPath: string;

  constructor() {
    super();
    this.statistics = {
      totalIngested: 0,
      totalRejected: 0,
      totalBytes: 0,
      byFormat: {} as Record<DataFormat, number>,
      bySource: {},
      averageProcessingMs: 0,
    };
    
    // Default paths (configurable via environment)
    this.quarantinePath = process.env.DIODE_QUARANTINE_PATH || '/var/datacendia/diode/quarantine';
    this.archivePath = process.env.DIODE_ARCHIVE_PATH || '/var/datacendia/diode/archive';
    this.rejectPath = process.env.DIODE_REJECT_PATH || '/var/datacendia/diode/rejected';
    
    logger.info('[DataDiode] Service initialized - Sovereign ingest ready');
  }

  // ===========================================================================
  // SOURCE MANAGEMENT
  // ===========================================================================

  /**
   * Register a new ingest source (drop zone)
   */
  async registerSource(source: Omit<IngestSource, 'id' | 'createdAt'>): Promise<IngestSource> {
    const id = `diode-${crypto.randomUUID().slice(0, 8)}`;
    
    const fullSource: IngestSource = {
      ...source,
      id,
      createdAt: new Date(),
    };
    
    this.sources.set(id, fullSource);
    
    // Ensure directories exist
    await this.ensureDirectories(source.watchPath);
    
    // Start watching if enabled
    if (source.enabled) {
      await this.startWatching(id);
    }
    
    logger.info(`[DataDiode] Registered source: ${source.name} watching ${source.watchPath}`);
    this.emit('source:registered', fullSource);
    
    return fullSource;
  }

  /**
   * Get all registered sources
   */
  getSources(): IngestSource[] {
    return Array.from(this.sources.values());
  }

  /**
   * Get source by ID
   */
  getSource(id: string): IngestSource | undefined {
    return this.sources.get(id);
  }

  /**
   * Enable/disable a source
   */
  async setSourceEnabled(id: string, enabled: boolean): Promise<void> {
    const source = this.sources.get(id);
    if (!source) throw new Error(`Source not found: ${id}`);
    
    source.enabled = enabled;
    
    if (enabled) {
      await this.startWatching(id);
    } else {
      this.stopWatching(id);
    }
    
    logger.info(`[DataDiode] Source ${source.name} ${enabled ? 'enabled' : 'disabled'}`);
  }

  // ===========================================================================
  // FILE WATCHING
  // ===========================================================================

  /**
   * Start watching a source directory
   */
  private async startWatching(sourceId: string): Promise<void> {
    const source = this.sources.get(sourceId);
    if (!source) return;
    
    // Stop existing watcher if any
    this.stopWatching(sourceId);
    
    try {
      // Check if path exists
      if (!fs.existsSync(source.watchPath)) {
        fs.mkdirSync(source.watchPath, { recursive: true });
      }
      
      const watcher = fs.watch(source.watchPath, { persistent: true }, (eventType, filename) => {
        if (eventType === 'rename' && filename) {
          this.handleFileDetected(sourceId, filename);
        }
      });
      
      watcher.on('error', (error) => {
        logger.error(`[DataDiode] Watch error on ${source.name}:`, error);
        this.emit('watch:error', { sourceId, error });
      });
      
      this.watchers.set(sourceId, watcher);
      
      // Also scan for existing files
      await this.scanExistingFiles(sourceId);
      
      logger.info(`[DataDiode] Watching ${source.watchPath} for ${source.filePattern}`);
    } catch (error) {
      logger.error(`[DataDiode] Failed to start watching ${source.watchPath}:`, error);
    }
  }

  /**
   * Stop watching a source
   */
  private stopWatching(sourceId: string): void {
    const watcher = this.watchers.get(sourceId);
    if (watcher) {
      watcher.close();
      this.watchers.delete(sourceId);
    }
  }

  /**
   * Scan for existing files in watch directory
   */
  private async scanExistingFiles(sourceId: string): Promise<void> {
    const source = this.sources.get(sourceId);
    if (!source) return;
    
    try {
      const files = fs.readdirSync(source.watchPath);
      for (const file of files) {
        if (this.matchesPattern(file, source.filePattern)) {
          await this.handleFileDetected(sourceId, file);
        }
      }
    } catch (error) {
      logger.error(`[DataDiode] Scan error:`, error);
    }
  }

  /**
   * Check if filename matches glob pattern
   */
  private matchesPattern(filename: string, pattern: string): boolean {
    // Simple glob matching (*.ext, prefix*, etc.)
    const regex = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    return new RegExp(`^${regex}$`, 'i').test(filename);
  }

  // ===========================================================================
  // FILE PROCESSING PIPELINE
  // ===========================================================================

  /**
   * Handle detected file - starts the secure ingest pipeline
   */
  private async handleFileDetected(sourceId: string, filename: string): Promise<void> {
    const source = this.sources.get(sourceId);
    if (!source || !source.enabled) return;
    
    // Skip if doesn't match pattern
    if (!this.matchesPattern(filename, source.filePattern)) return;
    
    const filePath = path.join(source.watchPath, filename);
    
    // Skip if already processing
    if (this.processing.has(filePath)) return;
    
    // Skip if not a file or doesn't exist
    try {
      const stat = fs.statSync(filePath);
      if (!stat.isFile()) return;
    } catch {
      return; // File may have been moved/deleted
    }
    
    this.processing.add(filePath);
    
    // Create ingest event
    const event = await this.createIngestEvent(source, filePath, filename);
    
    try {
      // 1. Quarantine
      await this.quarantineFile(event);
      
      // 2. Security scan
      await this.securityScan(event);
      
      // 3. Signature verification (if required)
      if (source.requireSignature) {
        await this.verifySignature(event, source);
      }
      
      // 4. Parse data
      await this.parseFile(event, source);
      
      // 5. Validate schema
      if (source.schema) {
        await this.validateSchema(event, source);
      }
      
      // 6. Ingest to target system
      await this.ingestToSystem(event, source);
      
      // 7. Archive
      await this.archiveFile(event);
      
      // Success
      event.status = 'completed';
      event.completedAt = new Date();
      this.updateStatistics(event, true);
      
      logger.info(`[DataDiode] ? Ingested ${filename} (${event.recordsExtracted} records)`);
      this.emit('ingest:completed', event);
      
    } catch (error: unknown) {
      event.status = 'failed';
      event.errorMessage = getErrorMessage(error);
      event.errorStack = getErrorStack(error);
      this.updateStatistics(event, false);
      
      // Move to reject folder
      await this.rejectFile(event);
      
      logger.error(`[DataDiode] ? Failed ${filename}: ${getErrorMessage(error)}`);
      this.emit('ingest:failed', event);
    } finally {
      this.processing.delete(filePath);
      this.events.set(event.id, event);
    }
  }

  /**
   * Create ingest event record
   */
  private async createIngestEvent(
    source: IngestSource, 
    filePath: string, 
    filename: string
  ): Promise<IngestEvent> {
    const stat = fs.statSync(filePath);
    const content = fs.readFileSync(filePath);
    const hash = crypto.createHash('sha256').update(content).digest('hex');
    
    const event: IngestEvent = {
      id: `evt-${crypto.randomUUID()}`,
      sourceId: source.id,
      sourceName: source.name,
      filePath,
      fileName: filename,
      fileSize: stat.size,
      fileHash: hash,
      status: 'detected',
      format: source.format,
      detectedAt: new Date(),
      ledgerHash: '', // Will be set after processing
    };
    
    // Update source last activity
    source.lastActivity = new Date();
    
    this.emit('ingest:detected', event);
    return event;
  }

  /**
   * Move file to quarantine
   */
  private async quarantineFile(event: IngestEvent): Promise<void> {
    event.status = 'quarantined';
    event.quarantinedAt = new Date();
    
    const quarantinePath = path.join(this.quarantinePath, event.id);
    fs.mkdirSync(quarantinePath, { recursive: true });
    
    const destPath = path.join(quarantinePath, event.fileName);
    fs.copyFileSync(event.filePath, destPath);
    
    // Delete original from drop zone
    fs.unlinkSync(event.filePath);
    
    // Update event with new path
    event.filePath = destPath;
    
    this.emit('ingest:quarantined', event);
  }

  /**
   * Security scan (integrates with ClamAV or similar)
   */
  private async securityScan(event: IngestEvent): Promise<void> {
    event.status = 'scanning';
    
    // In production, integrate with actual scanner
    // For now, do basic checks
    const content = fs.readFileSync(event.filePath);
    
    // Check for suspicious patterns
    const suspicious = [
      /\x00\x00\x00\x00{100,}/, // Long null sequences
      /<script/i,               // Embedded scripts
      /eval\s*\(/,              // Eval calls
    ];
    
    const contentStr = content.toString('utf8', 0, Math.min(content.length, 10000));
    for (const pattern of suspicious) {
      if (pattern.test(contentStr)) {
        event.scanResult = 'suspicious';
        event.status = 'rejected';
        throw new Error(`Suspicious content detected: ${pattern}`);
      }
    }
    
    event.scanResult = 'clean';
    event.scanEngine = 'datacendia-basic';
    event.scannedAt = new Date();
    
    this.emit('ingest:scanned', event);
  }

  /**
   * Verify digital signature
   */
  private async verifySignature(event: IngestEvent, source: IngestSource): Promise<void> {
    event.status = 'signature_check';
    
    if (!source.signaturePublicKey) {
      throw new Error('Signature required but no public key configured');
    }
    
    // Look for .sig file
    const sigPath = event.filePath + '.sig';
    if (!fs.existsSync(sigPath)) {
      throw new Error('Signature file not found');
    }
    
    try {
      const signature = fs.readFileSync(sigPath);
      const data = fs.readFileSync(event.filePath);
      
      const verify = crypto.createVerify('SHA256');
      verify.update(data);
      
      const isValid = verify.verify(source.signaturePublicKey, signature);
      
      if (!isValid) {
        event.signatureValid = false;
        throw new Error('Invalid signature');
      }
      
      event.signatureValid = true;
      event.signedBy = 'verified'; // In production, extract from certificate
      
      this.emit('ingest:signature_verified', event);
    } catch (error: unknown) {
      event.signatureValid = false;
      throw new Error(`Signature verification failed: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Parse file based on format
   */
  private async parseFile(event: IngestEvent, source: IngestSource): Promise<void> {
    event.status = 'parsing';
    
    const content = fs.readFileSync(event.filePath);
    let recordCount = 0;
    
    switch (source.format) {
      case 'grib2':
        recordCount = await this.parseGrib(content, event);
        break;
      case 'metar':
      case 'taf':
        recordCount = await this.parseAviationWeather(content, event, source.format);
        break;
      case 'csv':
        recordCount = await this.parseCsv(content, event);
        break;
      case 'json':
        recordCount = await this.parseJson(content, event);
        break;
      case 'jsonl':
        recordCount = await this.parseJsonLines(content, event);
        break;
      case 'xml':
        recordCount = await this.parseXml(content, event);
        break;
      case 'parquet':
        recordCount = await this.parseParquet(content, event);
        break;
      default:
        if (source.parser) {
          recordCount = await this.parseCustom(content, event, source.parser);
        } else {
          throw new Error(`No parser for format: ${source.format}`);
        }
    }
    
    event.recordsExtracted = recordCount;
    event.bytesProcessed = content.length;
    event.parsedAt = new Date();
    
    this.emit('ingest:parsed', event);
  }

  // ===========================================================================
  // FORMAT PARSERS
  // ===========================================================================

  /**
   * Parse GRIB2 weather data
   */
  private async parseGrib(content: Buffer, event: IngestEvent): Promise<number> {
    // GRIB2 magic number check
    if (content.slice(0, 4).toString() !== 'GRIB') {
      throw new Error('Invalid GRIB file: missing magic number');
    }
    
    const edition = content[7];
    if (edition !== 2) {
      logger.warn(`[DataDiode] GRIB edition ${edition}, expected 2`);
    }
    
    // Parse GRIB sections
    // Section 0: Indicator
    // Section 1: Identification
    // Section 2: Local Use (optional)
    // Section 3: Grid Definition
    // Section 4: Product Definition
    // Section 5: Data Representation
    // Section 6: Bitmap (optional)
    // Section 7: Data
    // Section 8: End
    
    let messageCount = 0;
    let offset = 0;
    
    while (offset < content.length - 4) {
      // Find next GRIB marker
      const marker = content.indexOf('GRIB', offset);
      if (marker === -1) break;
      
      // Read message length from bytes 8-15 (64-bit)
      const msgLength = content.readBigUInt64BE(marker + 8);
      
      messageCount++;
      offset = marker + Number(msgLength);
    }
    
    // Store parsed data for downstream systems
    (event as any).parsedData = {
      format: 'grib2',
      edition,
      messageCount,
      totalBytes: content.length,
    };
    
    return messageCount;
  }

  /**
   * Parse METAR/TAF aviation weather
   */
  private async parseAviationWeather(
    content: Buffer, 
    event: IngestEvent,
    format: 'metar' | 'taf'
  ): Promise<number> {
    const text = content.toString('utf8');
    const lines = text.split('\n').filter(l => l.trim());
    
    const reports: any[] = [];
    
    for (const line of lines) {
      // Basic METAR/TAF parsing
      const match = line.match(/^(METAR|TAF|SPECI)?\s*([A-Z]{4})\s+(\d{6}Z)/);
      if (match) {
        reports.push({
          type: match[1] || format.toUpperCase(),
          station: match[2],
          time: match[3],
          raw: line.trim(),
        });
      }
    }
    
    (event as any).parsedData = {
      format,
      reports,
    };
    
    return reports.length;
  }

  /**
   * Parse CSV data
   */
  private async parseCsv(content: Buffer, event: IngestEvent): Promise<number> {
    const text = content.toString('utf8');
    const lines = text.split('\n').filter(l => l.trim());
    
    if (lines.length === 0) return 0;
    
    const headers = lines[0].split(',').map(h => h.trim());
    const records: any[] = [];
    
    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(',');
      const record: any = {};
      headers.forEach((h, idx) => {
        record[h] = values[idx]?.trim();
      });
      records.push(record);
    }
    
    (event as any).parsedData = {
      format: 'csv',
      headers,
      records,
    };
    
    return records.length;
  }

  /**
   * Parse JSON data
   */
  private async parseJson(content: Buffer, event: IngestEvent): Promise<number> {
    const data = JSON.parse(content.toString('utf8'));
    
    (event as any).parsedData = {
      format: 'json',
      data,
    };
    
    return Array.isArray(data) ? data.length : 1;
  }

  /**
   * Parse JSON Lines (streaming format)
   */
  private async parseJsonLines(content: Buffer, event: IngestEvent): Promise<number> {
    const text = content.toString('utf8');
    const lines = text.split('\n').filter(l => l.trim());
    
    const records: any[] = [];
    for (const line of lines) {
      try {
        records.push(JSON.parse(line));
      } catch {
        // Skip invalid lines
      }
    }
    
    (event as any).parsedData = {
      format: 'jsonl',
      records,
    };
    
    return records.length;
  }

  /**
   * Parse XML data
   */
  private async parseXml(content: Buffer, event: IngestEvent): Promise<number> {
    // Basic XML element counting
    const text = content.toString('utf8');
    const elementMatches = text.match(/<[^/][^>]*>/g) || [];
    
    (event as any).parsedData = {
      format: 'xml',
      raw: text,
      elementCount: elementMatches.length,
    };
    
    return elementMatches.length;
  }

  /**
   * Parse Parquet (columnar format)
   */
  private async parseParquet(content: Buffer, event: IngestEvent): Promise<number> {
    // Check magic bytes (PAR1)
    const footer = content.slice(-4).toString();
    if (footer !== 'PAR1') {
      throw new Error('Invalid Parquet file: missing magic footer');
    }
    
    // In production, use parquetjs or apache-arrow
    (event as any).parsedData = {
      format: 'parquet',
      size: content.length,
    };
    
    return 1; // Placeholder - actual implementation would read row count
  }

  /**
   * Custom parser invocation
   */
  private async parseCustom(
    content: Buffer, 
    event: IngestEvent, 
    parserModule: string
  ): Promise<number> {
    // Dynamic import of custom parser
    try {
      const parser = await import(parserModule);
      const result = await parser.parse(content, event);
      
      (event as any).parsedData = result;
      return result.recordCount || 1;
    } catch (error: unknown) {
      throw new Error(`Custom parser failed: ${getErrorMessage(error)}`);
    }
  }

  /**
   * Validate against JSON Schema
   */
  private async validateSchema(event: IngestEvent, source: IngestSource): Promise<void> {
    event.status = 'validating';
    
    const data = (event as any).parsedData;
    if (!data) {
      throw new Error('No parsed data to validate');
    }
    
    // Basic schema validation (in production, use ajv)
    // For now, just check required fields exist
    if (source.schema && typeof source.schema === 'object') {
      const schema = source.schema as any;
      if (schema.required && Array.isArray(schema.required)) {
        for (const field of schema.required) {
          if (data[field] === undefined) {
            throw new Error(`Missing required field: ${field}`);
          }
        }
      }
    }
    
    this.emit('ingest:validated', event);
  }

  /**
   * Ingest data to target system
   */
  private async ingestToSystem(event: IngestEvent, source: IngestSource): Promise<void> {
    event.status = 'ingesting';
    event.targetSystem = source.targetSystem;
    
    const data = (event as any).parsedData;
    
    switch (source.targetSystem) {
      case 'predict':
        await this.ingestToPredict(data, event);
        break;
      case 'gnosis':
        await this.ingestToGnosis(data, event);
        break;
      case 'panopticon':
        await this.ingestToPanopticon(data, event);
        break;
      case 'custom':
        // Custom handler via event
        this.emit('ingest:custom', { event, data });
        break;
    }
    
    this.emit('ingest:ingested', event);
  }

  /**
   * Ingest to CendiaPredict (forecasting)
   */
  private async ingestToPredict(data: any, event: IngestEvent): Promise<void> {
    // In production, this would call the Predict service
    logger.info(`[DataDiode] ? CendiaPredict: ${event.recordsExtracted} records`);
    
    // Emit for downstream processing
    this.emit('predict:data', {
      source: event.sourceName,
      format: event.format,
      data,
      timestamp: new Date(),
    });
  }

  /**
   * Ingest to CendiaGnosis (knowledge base)
   */
  private async ingestToGnosis(data: any, event: IngestEvent): Promise<void> {
    logger.info(`[DataDiode] ? CendiaGnosis: ${event.recordsExtracted} records`);
    
    this.emit('gnosis:data', {
      source: event.sourceName,
      format: event.format,
      data,
      timestamp: new Date(),
    });
  }

  /**
   * Ingest to CendiaPanopticon (regulatory)
   */
  private async ingestToPanopticon(data: any, event: IngestEvent): Promise<void> {
    logger.info(`[DataDiode] ? CendiaPanopticon: ${event.recordsExtracted} records`);
    
    this.emit('panopticon:data', {
      source: event.sourceName,
      format: event.format,
      data,
      timestamp: new Date(),
    });
  }

  /**
   * Archive processed file
   */
  private async archiveFile(event: IngestEvent): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const archiveDir = path.join(this.archivePath, date, event.sourceId);
    
    fs.mkdirSync(archiveDir, { recursive: true });
    
    const archivePath = path.join(archiveDir, `${event.id}_${event.fileName}`);
    fs.renameSync(event.filePath, archivePath);
    
    // Create ledger hash
    event.ledgerHash = crypto
      .createHash('sha256')
      .update(JSON.stringify({
        id: event.id,
        fileHash: event.fileHash,
        completedAt: event.completedAt,
        recordsExtracted: event.recordsExtracted,
      }))
      .digest('hex');
  }

  /**
   * Move failed file to reject folder
   */
  private async rejectFile(event: IngestEvent): Promise<void> {
    const date = new Date().toISOString().split('T')[0];
    const rejectDir = path.join(this.rejectPath, date);
    
    fs.mkdirSync(rejectDir, { recursive: true });
    
    const rejectPath = path.join(rejectDir, `${event.id}_${event.fileName}`);
    
    if (fs.existsSync(event.filePath)) {
      fs.renameSync(event.filePath, rejectPath);
    }
    
    // Write error log
    const errorLog = path.join(rejectDir, `${event.id}_error.json`);
    fs.writeFileSync(errorLog, JSON.stringify({
      event,
      timestamp: new Date().toISOString(),
    }, null, 2));
  }

  // ===========================================================================
  // UTILITIES
  // ===========================================================================

  /**
   * Ensure required directories exist
   */
  private async ensureDirectories(watchPath: string): Promise<void> {
    const dirs = [watchPath, this.quarantinePath, this.archivePath, this.rejectPath];
    
    for (const dir of dirs) {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    }
  }

  /**
   * Update statistics
   */
  private updateStatistics(event: IngestEvent, success: boolean): void {
    if (success) {
      this.statistics.totalIngested++;
      this.statistics.totalBytes += event.bytesProcessed || 0;
      this.statistics.lastIngestAt = new Date();
    } else {
      this.statistics.totalRejected++;
    }
    
    // By format
    this.statistics.byFormat[event.format] = 
      (this.statistics.byFormat[event.format] || 0) + 1;
    
    // By source
    this.statistics.bySource[event.sourceId] = 
      (this.statistics.bySource[event.sourceId] || 0) + 1;
  }

  /**
   * Get current statistics
   */
  getStatistics(): DiodeStatistics {
    return { ...this.statistics };
  }

  /**
   * Get recent events
   */
  getRecentEvents(limit: number = 100): IngestEvent[] {
    return Array.from(this.events.values())
      .sort((a, b) => b.detectedAt.getTime() - a.detectedAt.getTime())
      .slice(0, limit);
  }

  /**
   * Get event by ID
   */
  getEvent(id: string): IngestEvent | undefined {
    return this.events.get(id);
  }

  /**
   * Shutdown service
   */
  async shutdown(): Promise<void> {
    // Stop all watchers
    for (const [id] of this.watchers) {
      this.stopWatching(id);
    }
    
    logger.info('[DataDiode] Service shut down');
  }
}

// =============================================================================
// SINGLETON EXPORT
// =============================================================================

export const dataDiodeService = new DataDiodeService();
export { DataDiodeService };
