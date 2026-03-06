/**
 * scan-secrets.cjs
 * Scans backend source for potentially hardcoded secrets.
 * Distinguishes real secrets from config key names/env var references.
 * Run: node scripts/scan-secrets.cjs
 * Use in CI: node scripts/scan-secrets.cjs --fail-on-findings
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'backend', 'src');
const FAIL_ON_FINDINGS = process.argv.includes('--fail-on-findings');

// Patterns that indicate actual hardcoded secrets (not just key names)
const SECRET_PATTERNS = [
  // Hardcoded password values (not env var references)
  /(?:password|passwd|pwd)\s*[:=]\s*['"][A-Za-z0-9!@#$%^&*]{8,}['"]/gi,
  // Hardcoded API keys
  /(?:api_key|apikey|api[-_]?secret)\s*[:=]\s*['"][A-Za-z0-9_\-]{20,}['"]/gi,
  // Hardcoded tokens
  /(?:token|bearer)\s*[:=]\s*['"][A-Za-z0-9_\-\.]{20,}['"]/gi,
  // AWS-style keys
  /AKIA[0-9A-Z]{16}/g,
  // Private keys
  /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/g,
];

// Lines to exclude (false positives)
const EXCLUDE_PATTERNS = [
  /process\.env/i,
  /config\./i,
  /CHANGE_ME/i,
  /example|placeholder|sample|demo|test|mock|fake/i,
  /interface |type |export type|export interface/i,
  /import /i,
  /require\(/i,
  /\.default\(/i,
  /requiredCredentials/i,
  /z\.string\(\)/i,
  // Env var name strings (not values)
  /^\s*'[A-Z_]+'\s*,?\s*$/,
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines = content.split('\n');
  const findings = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Skip excluded patterns
    if (EXCLUDE_PATTERNS.some(p => p.test(line))) continue;

    for (const pattern of SECRET_PATTERNS) {
      pattern.lastIndex = 0;
      if (pattern.test(line)) {
        findings.push({
          file: path.relative(SRC_DIR, filePath),
          line: i + 1,
          text: line.trim().substring(0, 120),
        });
        break;
      }
    }
  }

  return findings;
}

function scanDir(dir) {
  let allFindings = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules' && entry.name !== '.git') {
      allFindings = allFindings.concat(scanDir(fullPath));
    } else if (entry.isFile() && /\.(ts|tsx|js|json)$/.test(entry.name)) {
      allFindings = allFindings.concat(scanFile(fullPath));
    }
  }

  return allFindings;
}

// Run scan
const findings = scanDir(SRC_DIR);

console.log(`Secret scan completed: ${findings.length} potential findings`);

if (findings.length > 0) {
  console.log('\n=== POTENTIAL HARDCODED SECRETS ===\n');
  for (const f of findings.slice(0, 30)) {
    console.log(`  ${f.file}:${f.line}`);
    console.log(`    ${f.text}\n`);
  }
  if (findings.length > 30) {
    console.log(`  ... and ${findings.length - 30} more.\n`);
  }
}

if (FAIL_ON_FINDINGS && findings.length > 0) {
  console.error(`\nFAILED: ${findings.length} potential hardcoded secrets found.`);
  console.error('Fix these before committing, or exclude false positives in scan-secrets.cjs EXCLUDE_PATTERNS.');
  process.exit(1);
}
