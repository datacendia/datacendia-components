// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * ClamAV Integration for DataDiode
 * 
 * Real antivirus scanning integration for the DataDiode security layer.
 * Connects to ClamAV daemon (clamd) via TCP socket for malware detection.
 * 
 * Supports:
 * - TCP socket connection to clamd (default: localhost:3310)
 * - INSTREAM scanning (stream data without temp files)
 * - Version checking and signature database info
 * - Scan result parsing with threat classification
 * - Fallback to heuristic scanning when ClamAV is unavailable
 * 
 * DEPLOYMENT: Requires ClamAV daemon running (Docker: clamav/clamav:latest)
 *   docker run -d --name clamav -p 3310:3310 clamav/clamav:latest
 */

import * as net from 'net';
import crypto from 'crypto';
import { logger } from '../../utils/logger.js';
import { persistServiceRecord } from '../../utils/servicePersistence.js';

// =============================================================================
// TYPES
// =============================================================================

export type ThreatLevel = 'clean' | 'suspicious' | 'malware' | 'error';

export interface ScanResult {
  id: string;
  filename: string;
  fileSize: number;
  fileHash: string;
  scannedAt: Date;
  scanDuration: number;
  threatLevel: ThreatLevel;
  threatName?: string;
  engine: 'clamav' | 'heuristic';
  signatureVersion?: string;
  details: string;
}

export interface ClamAVConfig {
  host: string;
  port: number;
  timeout: number;
  maxFileSize: number;
}

// =============================================================================
// HEURISTIC SCANNER (Fallback when ClamAV unavailable)
// =============================================================================

const MALWARE_SIGNATURES: Array<{ pattern: Buffer; name: string }> = [
  { pattern: Buffer.from('EICAR-STANDARD-ANTIVIRUS-TEST-FILE', 'ascii'), name: 'Eicar-Signature' },
  { pattern: Buffer.from([0x4D, 0x5A]), name: 'PE-Executable-Header' }, // MZ header
  { pattern: Buffer.from('<%eval', 'ascii'), name: 'Webshell-PHP-Eval' },
  { pattern: Buffer.from('<script>document.cookie', 'ascii'), name: 'XSS-Cookie-Theft' },
  { pattern: Buffer.from('powershell -encodedcommand', 'ascii'), name: 'PowerShell-Encoded' },
  { pattern: Buffer.from('cmd.exe /c', 'ascii'), name: 'CMD-Execution' },
  { pattern: Buffer.from('/bin/sh -c', 'ascii'), name: 'Shell-Execution' },
];

function heuristicScan(data: Buffer, filename: string): { threatLevel: ThreatLevel; threatName?: string } {
  // Check known malware signatures
  for (const sig of MALWARE_SIGNATURES) {
    if (data.includes(sig.pattern)) {
      return { threatLevel: 'malware', threatName: `Heuristic.${sig.name}` };
    }
  }

  // Shannon entropy check (high entropy = possibly encrypted/packed malware)
  const entropy = calculateEntropy(data);
  if (entropy > 7.5 && data.length > 1024) {
    return { threatLevel: 'suspicious', threatName: 'Heuristic.HighEntropy' };
  }

  // Check for embedded executables in non-executable files
  const ext = filename.split('.').pop()?.toLowerCase() || '';
  const safeExtensions = ['txt', 'csv', 'json', 'xml', 'md', 'pdf', 'png', 'jpg', 'gif'];
  if (safeExtensions.includes(ext)) {
    const hasMZ = data[0] === 0x4D && data[1] === 0x5A;
    const hasELF = data[0] === 0x7F && data[1] === 0x45 && data[2] === 0x4C && data[3] === 0x46;
    if (hasMZ || hasELF) {
      return { threatLevel: 'malware', threatName: 'Heuristic.EmbeddedExecutable' };
    }
  }

  return { threatLevel: 'clean' };
}

function calculateEntropy(data: Buffer): number {
  const freq = new Uint32Array(256);
  for (let i = 0; i < data.length; i++) freq[data[i]]++;
  let entropy = 0;
  for (let i = 0; i < 256; i++) {
    if (freq[i] === 0) continue;
    const p = freq[i] / data.length;
    entropy -= p * Math.log2(p);
  }
  return entropy;
}

// =============================================================================
// CLAMAV INTEGRATION SERVICE
// =============================================================================

export class ClamAVIntegration {
  private config: ClamAVConfig;
  private available: boolean = false;
  private signatureVersion: string = 'unknown';
  private scanCount: number = 0;
  private threatCount: number = 0;

  constructor(config?: Partial<ClamAVConfig>) {
    this.config = {
      host: config?.host || process.env.CLAMAV_HOST || 'localhost',
      port: config?.port || parseInt(process.env.CLAMAV_PORT || '3310'),
      timeout: config?.timeout || 30000,
      maxFileSize: config?.maxFileSize || 25 * 1024 * 1024, // 25MB
    };

    logger.info(`[ClamAV] Integration initialized — ${this.config.host}:${this.config.port} (fallback: heuristic)`);
  }

  /**
   * Check if ClamAV daemon is available.
   */
  async ping(): Promise<boolean> {
    try {
      const response = await this.sendCommand('PING');
      this.available = response.trim() === 'PONG';
      if (this.available) {
        const version = await this.sendCommand('VERSION');
        this.signatureVersion = version.trim();
        logger.info(`[ClamAV] Connected: ${this.signatureVersion}`);
      }
      return this.available;
    } catch {
      this.available = false;
      logger.warn('[ClamAV] Daemon not available — using heuristic fallback');
      return false;
    }
  }

  /**
   * Scan a buffer for malware using ClamAV INSTREAM or heuristic fallback.
   */
  async scan(data: Buffer, filename: string): Promise<ScanResult> {
    const startTime = Date.now();
    const fileHash = crypto.createHash('sha256').update(data).digest('hex');
    const id = `scan-${crypto.randomUUID()}`;

    if (data.length > this.config.maxFileSize) {
      return {
        id,
        filename,
        fileSize: data.length,
        fileHash,
        scannedAt: new Date(),
        scanDuration: Date.now() - startTime,
        threatLevel: 'error',
        engine: 'clamav',
        details: `File exceeds maximum size: ${data.length} > ${this.config.maxFileSize}`,
      };
    }

    let result: ScanResult;

    if (this.available) {
      // Real ClamAV INSTREAM scan
      try {
        const scanResponse = await this.instreamScan(data);
        const threatLevel = this.parseResponse(scanResponse);

        result = {
          id,
          filename,
          fileSize: data.length,
          fileHash,
          scannedAt: new Date(),
          scanDuration: Date.now() - startTime,
          threatLevel: threatLevel.level,
          threatName: threatLevel.name,
          engine: 'clamav',
          signatureVersion: this.signatureVersion,
          details: scanResponse,
        };
      } catch (err) {
        // Fallback to heuristic on ClamAV error
        const heuristic = heuristicScan(data, filename);
        result = {
          id,
          filename,
          fileSize: data.length,
          fileHash,
          scannedAt: new Date(),
          scanDuration: Date.now() - startTime,
          threatLevel: heuristic.threatLevel,
          threatName: heuristic.threatName,
          engine: 'heuristic',
          details: `ClamAV error, heuristic fallback: ${(err as Error).message}`,
        };
      }
    } else {
      // Heuristic fallback
      const heuristic = heuristicScan(data, filename);
      result = {
        id,
        filename,
        fileSize: data.length,
        fileHash,
        scannedAt: new Date(),
        scanDuration: Date.now() - startTime,
        threatLevel: heuristic.threatLevel,
        threatName: heuristic.threatName,
        engine: 'heuristic',
        details: 'ClamAV unavailable — heuristic scan applied',
      };
    }

    this.scanCount++;
    if (result.threatLevel !== 'clean') this.threatCount++;

    persistServiceRecord({
      serviceName: 'ClamAVIntegration',
      recordType: 'scan_result',
      referenceId: id,
      data: { id, filename, fileHash, threatLevel: result.threatLevel, threatName: result.threatName, engine: result.engine },
    });

    return result;
  }

  /**
   * Send data via ClamAV INSTREAM protocol.
   */
  private async instreamScan(data: Buffer): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      let response = '';

      client.setTimeout(this.config.timeout);
      client.connect(this.config.port, this.config.host, () => {
        // Send INSTREAM command
        client.write('zINSTREAM\0');

        // Send data in chunks (ClamAV protocol: 4-byte big-endian length prefix per chunk)
        const chunkSize = 8192;
        for (let i = 0; i < data.length; i += chunkSize) {
          const chunk = data.subarray(i, Math.min(i + chunkSize, data.length));
          const lengthBuf = Buffer.alloc(4);
          lengthBuf.writeUInt32BE(chunk.length);
          client.write(lengthBuf);
          client.write(chunk);
        }

        // Signal end of stream (zero-length chunk)
        const endBuf = Buffer.alloc(4);
        endBuf.writeUInt32BE(0);
        client.write(endBuf);
      });

      client.on('data', (chunk) => { response += chunk.toString(); });
      client.on('end', () => { resolve(response); });
      client.on('error', (err) => { reject(err); });
      client.on('timeout', () => { client.destroy(); reject(new Error('ClamAV scan timeout')); });
    });
  }

  /**
   * Send a simple command to ClamAV and get the response.
   */
  private sendCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const client = new net.Socket();
      let response = '';

      client.setTimeout(5000);
      client.connect(this.config.port, this.config.host, () => {
        client.write(`z${command}\0`);
      });

      client.on('data', (chunk) => { response += chunk.toString(); });
      client.on('end', () => { resolve(response); });
      client.on('error', reject);
      client.on('timeout', () => { client.destroy(); reject(new Error('ClamAV command timeout')); });
    });
  }

  /**
   * Parse ClamAV response into threat level.
   */
  private parseResponse(response: string): { level: ThreatLevel; name?: string } {
    const trimmed = response.trim();
    if (trimmed.endsWith('OK')) {
      return { level: 'clean' };
    }
    if (trimmed.includes('FOUND')) {
      const match = trimmed.match(/: (.+) FOUND/);
      return { level: 'malware', name: match?.[1] || 'Unknown' };
    }
    if (trimmed.includes('ERROR')) {
      return { level: 'error', name: trimmed };
    }
    return { level: 'suspicious', name: trimmed };
  }

  getStats(): {
    available: boolean;
    engine: string;
    signatureVersion: string;
    scanCount: number;
    threatCount: number;
  } {
    return {
      available: this.available,
      engine: this.available ? 'ClamAV' : 'Heuristic',
      signatureVersion: this.signatureVersion,
      scanCount: this.scanCount,
      threatCount: this.threatCount,
    };
  }
}

export const clamAVIntegration = new ClamAVIntegration();
