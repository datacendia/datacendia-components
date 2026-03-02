/**
 * Service — S B O M Generator
 *
 * Business logic service implementing platform capabilities.
 *
 * @exports sbomGenerator, Dependency, Vulnerability, SBOMMetadata, SBOM, SBOMFormat
 * @module services/security/SBOMGenerator
 */

// Copyright (c) 2024-2026 Datacendia, LLC All Rights Reserved.
// Proprietary and confidential. Unauthorized copying is strictly prohibited.
// See LICENSE file for details.

/**
 * SBOM (Software Bill of Materials) Generator
 * 
 * Generates CycloneDX and SPDX format SBOMs for:
 * - Supply chain security compliance
 * - Vulnerability tracking
 * - License compliance
 * - Regulatory requirements (EU Cyber Resilience Act, US Executive Order 14028)
 */

import crypto from 'crypto';
import fs from 'fs';
import path from 'path';

// =============================================================================
// TYPES
// =============================================================================

export type SBOMFormat = 'cyclonedx' | 'spdx';

export interface Dependency {
  name: string;
  version: string;
  type: 'npm' | 'pip' | 'cargo' | 'go' | 'maven' | 'nuget';
  license?: string;
  purl?: string; // Package URL
  hashes?: {
    algorithm: string;
    value: string;
  }[];
  dependencies?: string[];
  vulnerabilities?: Vulnerability[];
}

export interface Vulnerability {
  id: string; // CVE ID
  severity: 'critical' | 'high' | 'medium' | 'low' | 'unknown';
  description?: string;
  fixedIn?: string;
  url?: string;
}

export interface SBOMMetadata {
  timestamp: Date;
  toolName: string;
  toolVersion: string;
  authors: string[];
  component: {
    name: string;
    version: string;
    type: 'application' | 'library' | 'framework';
    description?: string;
  };
}

export interface SBOM {
  format: SBOMFormat;
  specVersion: string;
  serialNumber: string;
  metadata: SBOMMetadata;
  components: Dependency[];
  vulnerabilitySummary: {
    critical: number;
    high: number;
    medium: number;
    low: number;
    total: number;
  };
}

// =============================================================================
// SBOM GENERATOR
// =============================================================================

class SBOMGenerator {
  private readonly toolName = 'Datacendia SBOM Generator';
  private readonly toolVersion = '1.0.0';

  /**
   * Generate SBOM from package.json
   */
  async generateFromPackageJson(
    packageJsonPath: string,
    format: SBOMFormat = 'cyclonedx'
  ): Promise<SBOM> {
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
    const lockfilePath = path.join(path.dirname(packageJsonPath), 'package-lock.json');
    
    let lockfile: Record<string, unknown> | null = null;
    if (fs.existsSync(lockfilePath)) {
      lockfile = JSON.parse(fs.readFileSync(lockfilePath, 'utf-8'));
    }

    const dependencies = this.extractNpmDependencies(packageJson, lockfile);
    
    return this.createSBOM(format, {
      name: packageJson.name || 'unknown',
      version: packageJson.version || '0.0.0',
      type: 'application',
      description: packageJson.description,
    }, dependencies);
  }

  /**
   * Extract dependencies from package.json and lockfile
   */
  private extractNpmDependencies(
    packageJson: Record<string, unknown>,
    lockfile: Record<string, unknown> | null
  ): Dependency[] {
    const deps: Dependency[] = [];
    const allDeps = {
      ...(packageJson['dependencies'] as Record<string, string> || {}),
      ...(packageJson['devDependencies'] as Record<string, string> || {}),
    };

    const packages = (lockfile?.['packages'] as Record<string, unknown>) || {};

    for (const [name, versionSpec] of Object.entries(allDeps)) {
      // Try to get exact version from lockfile
      const lockfileKey = `node_modules/${name}`;
      const lockfileEntry = packages[lockfileKey] as Record<string, unknown> | undefined;
      const version = (lockfileEntry?.['version'] as string) || this.cleanVersionSpec(versionSpec);
      
      const dep: Dependency = {
        name,
        version,
        type: 'npm',
        purl: `pkg:npm/${name}@${version}`,
        license: this.detectLicense(name, lockfileEntry),
      };

      // Add integrity hash if available
      if (lockfileEntry?.['integrity']) {
        const integrity = lockfileEntry['integrity'] as string;
        const [algorithm, hash] = integrity.split('-');
        if (algorithm && hash) {
          dep.hashes = [{
            algorithm: algorithm.toUpperCase(),
            value: Buffer.from(hash, 'base64').toString('hex'),
          }];
        }
      }

      deps.push(dep);
    }

    return deps;
  }

  /**
   * Clean version specifier (remove ^, ~, etc.)
   */
  private cleanVersionSpec(spec: string): string {
    return spec.replace(/^[\^~>=<]+/, '');
  }

  /**
   * Detect license from lockfile or common patterns
   */
  private detectLicense(name: string, lockfileEntry?: Record<string, unknown>): string {
    if (lockfileEntry?.['license']) {
      return lockfileEntry['license'] as string;
    }
    
    // Common license patterns for well-known packages
    const knownLicenses: Record<string, string> = {
      'react': 'MIT',
      'express': 'MIT',
      'typescript': 'Apache-2.0',
      'lodash': 'MIT',
      'axios': 'MIT',
      'prisma': 'Apache-2.0',
      'pg': 'MIT',
      'redis': 'MIT',
    };

    return knownLicenses[name] || 'UNKNOWN';
  }

  /**
   * Create SBOM document
   */
  private createSBOM(
    format: SBOMFormat,
    component: SBOMMetadata['component'],
    dependencies: Dependency[]
  ): SBOM {
    const vulnSummary = this.calculateVulnerabilitySummary(dependencies);

    return {
      format,
      specVersion: format === 'cyclonedx' ? '1.5' : '2.3',
      serialNumber: `urn:uuid:${crypto.randomUUID()}`,
      metadata: {
        timestamp: new Date(),
        toolName: this.toolName,
        toolVersion: this.toolVersion,
        authors: ['Datacendia Security Team'],
        component,
      },
      components: dependencies,
      vulnerabilitySummary: vulnSummary,
    };
  }

  /**
   * Calculate vulnerability summary
   */
  private calculateVulnerabilitySummary(dependencies: Dependency[]): SBOM['vulnerabilitySummary'] {
    const summary = { critical: 0, high: 0, medium: 0, low: 0, total: 0 };
    
    for (const dep of dependencies) {
      if (dep.vulnerabilities) {
        for (const vuln of dep.vulnerabilities) {
          summary.total++;
          if (vuln.severity in summary) {
            summary[vuln.severity as keyof typeof summary]++;
          }
        }
      }
    }

    return summary;
  }

  /**
   * Export SBOM to CycloneDX JSON format
   */
  exportCycloneDX(sbom: SBOM): string {
    const cyclonedx = {
      bomFormat: 'CycloneDX',
      specVersion: sbom.specVersion,
      serialNumber: sbom.serialNumber,
      version: 1,
      metadata: {
        timestamp: sbom.metadata.timestamp.toISOString(),
        tools: [{
          vendor: 'Datacendia',
          name: sbom.metadata.toolName,
          version: sbom.metadata.toolVersion,
        }],
        authors: sbom.metadata.authors.map(name => ({ name })),
        component: {
          type: sbom.metadata.component.type,
          name: sbom.metadata.component.name,
          version: sbom.metadata.component.version,
          description: sbom.metadata.component.description,
          'bom-ref': `${sbom.metadata.component.name}@${sbom.metadata.component.version}`,
        },
      },
      components: sbom.components.map(dep => ({
        type: 'library',
        name: dep.name,
        version: dep.version,
        purl: dep.purl,
        licenses: dep.license ? [{ license: { id: dep.license } }] : [],
        hashes: dep.hashes?.map(h => ({
          alg: h.algorithm,
          content: h.value,
        })),
        'bom-ref': `${dep.name}@${dep.version}`,
      })),
      vulnerabilities: this.extractAllVulnerabilities(sbom.components),
    };

    return JSON.stringify(cyclonedx, null, 2);
  }

  /**
   * Export SBOM to SPDX JSON format
   */
  exportSPDX(sbom: SBOM): string {
    const spdx = {
      spdxVersion: `SPDX-${sbom.specVersion}`,
      dataLicense: 'CC0-1.0',
      SPDXID: 'SPDXRef-DOCUMENT',
      name: sbom.metadata.component.name,
      documentNamespace: `https://datacendia.com/sbom/${sbom.serialNumber}`,
      creationInfo: {
        created: sbom.metadata.timestamp.toISOString(),
        creators: [
          `Tool: ${sbom.metadata.toolName}-${sbom.metadata.toolVersion}`,
          ...sbom.metadata.authors.map(a => `Person: ${a}`),
        ],
      },
      packages: sbom.components.map((dep, index) => ({
        SPDXID: `SPDXRef-Package-${index}`,
        name: dep.name,
        versionInfo: dep.version,
        downloadLocation: dep.purl || 'NOASSERTION',
        licenseConcluded: dep.license || 'NOASSERTION',
        licenseDeclared: dep.license || 'NOASSERTION',
        copyrightText: 'NOASSERTION',
        externalRefs: dep.purl ? [{
          referenceCategory: 'PACKAGE-MANAGER',
          referenceType: 'purl',
          referenceLocator: dep.purl,
        }] : [],
        checksums: dep.hashes?.map(h => ({
          algorithm: h.algorithm,
          checksumValue: h.value,
        })),
      })),
      relationships: sbom.components.map((_, index) => ({
        spdxElementId: 'SPDXRef-DOCUMENT',
        relatedSpdxElement: `SPDXRef-Package-${index}`,
        relationshipType: 'DESCRIBES',
      })),
    };

    return JSON.stringify(spdx, null, 2);
  }

  /**
   * Extract all vulnerabilities from components
   */
  private extractAllVulnerabilities(components: Dependency[]): unknown[] {
    const vulns: unknown[] = [];
    
    for (const comp of components) {
      if (comp.vulnerabilities) {
        for (const vuln of comp.vulnerabilities) {
          vulns.push({
            id: vuln.id,
            source: { name: 'NVD', url: 'https://nvd.nist.gov/' },
            ratings: [{
              severity: vuln.severity,
              method: 'CVSSv3',
            }],
            description: vuln.description,
            recommendation: vuln.fixedIn ? `Upgrade to ${vuln.fixedIn}` : 'No fix available',
            affects: [{
              ref: `${comp.name}@${comp.version}`,
            }],
          });
        }
      }
    }

    return vulns;
  }

  /**
   * Generate SBOM for the Datacendia platform
   */
  async generatePlatformSBOM(format: SBOMFormat = 'cyclonedx'): Promise<SBOM> {
    // Try to find package.json in common locations
    const possiblePaths = [
      path.join(process.cwd(), 'package.json'),
      path.join(process.cwd(), '..', 'package.json'),
      path.join(__dirname, '..', '..', '..', 'package.json'),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        return this.generateFromPackageJson(p, format);
      }
    }

    // Fallback: return a minimal SBOM with known dependencies
    return this.createSBOM(format, {
      name: 'datacendia-platform',
      version: '1.0.0',
      type: 'application',
      description: 'Datacendia Decision Intelligence Platform',
    }, this.getKnownDependencies());
  }

  /**
   * Get known platform dependencies (fallback)
   */
  private getKnownDependencies(): Dependency[] {
    return [
      { name: 'react', version: '18.2.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/react@18.2.0' },
      { name: 'typescript', version: '5.3.0', type: 'npm', license: 'Apache-2.0', purl: 'pkg:npm/typescript@5.3.0' },
      { name: 'express', version: '4.18.2', type: 'npm', license: 'MIT', purl: 'pkg:npm/express@4.18.2' },
      { name: 'prisma', version: '5.7.0', type: 'npm', license: 'Apache-2.0', purl: 'pkg:npm/prisma@5.7.0' },
      { name: 'pg', version: '8.11.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/pg@8.11.0' },
      { name: 'redis', version: '4.6.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/redis@4.6.0' },
      { name: 'jsonwebtoken', version: '9.0.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/jsonwebtoken@9.0.0' },
      { name: 'bcrypt', version: '5.1.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/bcrypt@5.1.0' },
      { name: 'zod', version: '3.22.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/zod@3.22.0' },
      { name: 'tailwindcss', version: '3.4.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/tailwindcss@3.4.0' },
      { name: 'vite', version: '5.0.0', type: 'npm', license: 'MIT', purl: 'pkg:npm/vite@5.0.0' },
      { name: 'lucide-react', version: '0.300.0', type: 'npm', license: 'ISC', purl: 'pkg:npm/lucide-react@0.300.0' },
    ];
  }

  /**
   * Export SBOM to specified format
   */
  export(sbom: SBOM): string {
    if (sbom.format === 'cyclonedx') {
      return this.exportCycloneDX(sbom);
    } else {
      return this.exportSPDX(sbom);
    }
  }

  /**
   * Get license summary
   */
  getLicenseSummary(sbom: SBOM): Record<string, number> {
    const summary: Record<string, number> = {};
    
    for (const comp of sbom.components) {
      const license = comp.license || 'UNKNOWN';
      summary[license] = (summary[license] || 0) + 1;
    }

    return summary;
  }
}

// Singleton instance
export const sbomGenerator = new SBOMGenerator();
export default sbomGenerator;
