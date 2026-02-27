#!/usr/bin/env node

// =============================================================================
// Community/Enterprise Boundary Check
// Scans community-edition source files for imports of enterprise-only modules.
// This is informational — it lists violations but does not block the build.
// Run: node scripts/check-community-boundary.mjs
// =============================================================================

import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, sep } from 'path';

const BACKEND_SRC = join(process.cwd(), 'backend', 'src');

// ---------------------------------------------------------------------------
// Enterprise directories and files (from COMMUNITY.md)
// ---------------------------------------------------------------------------

const ENTERPRISE_DIRS = [
  'services/sovereign',
  'services/enterprise',
  'services/collapse',
  'services/sgas',
  'services/dcii',
  'services/scge',
  'services/cortex',
  'services/apotheosis',
  'services/crucible',
  'services/panopticon',
  'services/legal',
  'services/strategic',
  'services/forecasting',
  'services/insurance',
];

const ENTERPRISE_FILES = [
  'services/CendiaCascadeService.ts',
  'services/CendiaCrucibleService.ts',
  'services/CendiaHorizonService.ts',
  'services/CendiaPanopticonService.ts',
  'services/CendiaAegisService.ts',
  'services/CendiaEternalService.ts',
  'services/CendiaSymbiontService.ts',
  'services/CendiaPredictService.ts',
  'services/CendiaRewindService.ts',
  'services/CendiaApotheosisService.ts',
  'services/CendiaOrbitService.ts',
  'services/CendiaVoxService.ts',
  'services/CendiaOmniTranslateService.ts',
  'services/licensing.service.ts',
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isEnterprisePath(relPath) {
  const normalized = relPath.split(sep).join('/');
  for (const dir of ENTERPRISE_DIRS) {
    if (normalized.startsWith(dir + '/') || normalized === dir) return true;
  }
  for (const file of ENTERPRISE_FILES) {
    if (normalized === file) return true;
  }
  return false;
}

function isCommunityFile(relPath) {
  if (!relPath.endsWith('.ts') && !relPath.endsWith('.tsx')) return false;
  if (relPath.includes('__tests__') || relPath.endsWith('.test.ts') || relPath.endsWith('.spec.ts')) return false;
  return !isEnterprisePath(relPath);
}

function walkDir(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    const stat = statSync(full);
    if (stat.isDirectory() && entry !== 'node_modules' && entry !== 'dist' && entry !== 'dist-community') {
      results.push(...walkDir(full));
    } else if (stat.isFile()) {
      results.push(full);
    }
  }
  return results;
}

// Match import/require statements that reference enterprise modules
const IMPORT_RE = /(?:import|from|require\()\s*['"]([^'"]+)['"]/g;

function extractImports(content) {
  const imports = [];
  let match;
  while ((match = IMPORT_RE.exec(content)) !== null) {
    imports.push(match[1]);
  }
  return imports;
}

function importRefersToEnterprise(importPath) {
  // Normalize: strip trailing .js/.ts
  let cleaned = importPath.replace(/\.(js|ts)$/, '');

  // Resolve relative segments: keep only the meaningful tail after services/
  // e.g. "../services/enterprise/Foo" → "services/enterprise/Foo"
  // e.g. "../services/verticals/insurance/Foo" → "services/verticals/insurance/Foo"
  const svcIdx = cleaned.indexOf('services/');
  const tail = svcIdx >= 0 ? cleaned.slice(svcIdx) : cleaned;

  // Check enterprise directories — match the full dir prefix, not just the leaf name.
  // This prevents "services/verticals/insurance/" (community) from matching
  // the enterprise "services/insurance/" directory.
  for (const dir of ENTERPRISE_DIRS) {
    if (tail.startsWith(dir + '/') || tail === dir) return dir;
  }

  // Check enterprise files — match the full path
  for (const file of ENTERPRISE_FILES) {
    const noExt = file.replace('.ts', '');
    if (tail === noExt || tail === file) return file;
  }

  // Check @/ alias imports (baseUrl is backend/src, so @/services/... maps to services/...)
  const aliasClean = cleaned.startsWith('@/') ? cleaned.slice(2) : null;
  if (aliasClean) {
    for (const dir of ENTERPRISE_DIRS) {
      if (aliasClean.startsWith(dir + '/') || aliasClean === dir) return dir;
    }
    for (const file of ENTERPRISE_FILES) {
      const noExt = file.replace('.ts', '');
      if (aliasClean === noExt || aliasClean === file) return file;
    }
  }

  return null;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

const allFiles = walkDir(BACKEND_SRC);
const violations = [];

for (const absPath of allFiles) {
  const relPath = relative(BACKEND_SRC, absPath).split(sep).join('/');
  if (!isCommunityFile(relPath)) continue;

  let content;
  try {
    content = readFileSync(absPath, 'utf-8');
  } catch {
    continue;
  }

  const imports = extractImports(content);
  for (const imp of imports) {
    const enterpriseModule = importRefersToEnterprise(imp);
    if (enterpriseModule) {
      violations.push({ file: relPath, import: imp, enterpriseModule });
    }
  }
}

// ---------------------------------------------------------------------------
// Report
// ---------------------------------------------------------------------------

console.log('');
console.log('=== Community/Enterprise Boundary Check ===');
console.log(`Scanned: ${allFiles.filter(f => isCommunityFile(relative(BACKEND_SRC, f).split(sep).join('/'))).length} community files`);
console.log('');

if (violations.length === 0) {
  console.log('✅ No boundary violations found. Community build is clean.');
  process.exit(0);
} else {
  console.log(`⚠️  Found ${violations.length} boundary violation(s):`);
  console.log('');

  // Group by file
  const byFile = new Map();
  for (const v of violations) {
    if (!byFile.has(v.file)) byFile.set(v.file, []);
    byFile.get(v.file).push(v);
  }

  for (const [file, vs] of byFile) {
    console.log(`  ${file}`);
    for (const v of vs) {
      console.log(`    → imports "${v.import}" (enterprise: ${v.enterpriseModule})`);
    }
  }

  console.log('');
  console.log(`These imports must be removed or made conditional before the`);
  console.log(`community edition can build independently.`);
  console.log('');
  // Exit 0 for now — informational only. Change to exit(1) to make it blocking.
  process.exit(0);
}
