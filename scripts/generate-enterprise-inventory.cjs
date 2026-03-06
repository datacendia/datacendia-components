/**
 * generate-enterprise-inventory.js
 * Scans enterprise service files and generates a verified feature inventory.
 * Replaces hand-maintained service counts in docs.
 *
 * Run: node scripts/generate-enterprise-inventory.js
 * Output: docs/ENTERPRISE-INVENTORY.json + docs/ENTERPRISE-INVENTORY.md
 */
const fs = require('fs');
const path = require('path');

const ENTERPRISE_DIR = path.resolve(__dirname, '..', 'backend', 'src', 'services', 'enterprise');
const OUTPUT_JSON = path.resolve(__dirname, '..', 'docs', 'ENTERPRISE-INVENTORY.json');
const OUTPUT_MD = path.resolve(__dirname, '..', 'docs', 'ENTERPRISE-INVENTORY.md');

// ── Scan service files ───────────────────────────────────────────────────────

function scanServices() {
  const files = fs.readdirSync(ENTERPRISE_DIR)
    .filter(f => f.endsWith('Service.ts') && f !== 'index.ts');

  const services = [];

  for (const file of files) {
    const fp = path.join(ENTERPRISE_DIR, file);
    const content = fs.readFileSync(fp, 'utf8');
    const size = fs.statSync(fp).size;

    // Extract service name from filename
    const name = file.replace('.ts', '').replace('Service', '');

    // Extract description from JSDoc or header comment
    const descMatch = content.match(/\*\s+(.+(?:Service|Engine|System).+)/i)
      || content.match(/\/\/\s*(?:DATACENDIA\s+)?(.+?)(?:\s*[-—]|$)/m);
    const description = descMatch ? descMatch[1].trim() : 'No description found';

    // Extract exported types
    const typeExports = [];
    const typeRegex = /export\s+(?:interface|type)\s+(\w+)/g;
    let match;
    while ((match = typeRegex.exec(content)) !== null) {
      typeExports.push(match[1]);
    }

    // Extract exported class/service name
    const classMatch = content.match(/export\s+class\s+(\w+)/);
    const className = classMatch ? classMatch[1] : null;

    // Extract method count (public async methods)
    const methods = (content.match(/(?:async\s+)?\w+\s*\([^)]*\)\s*(?::\s*\w|{)/g) || []).length;

    // Check for AI/LLM integration
    const hasAI = content.includes('ollama') || content.includes('inference')
      || content.includes('generateResponse') || content.includes('callLLM')
      || content.includes('aiAnalysis') || content.includes('this.ai');

    services.push({
      file,
      name,
      className,
      description,
      sizeBytes: size,
      typeExports,
      typeCount: typeExports.length,
      estimatedMethods: methods,
      hasAIIntegration: hasAI,
    });
  }

  return services;
}

// ── Extract index.ts numbering ───────────────────────────────────────────────

function extractIndexMetadata() {
  const indexFile = path.join(ENTERPRISE_DIR, 'index.ts');
  if (!fs.existsSync(indexFile)) return {};

  const content = fs.readFileSync(indexFile, 'utf8');
  const metadata = {};

  // Extract numbered categories: "// 1. PROCUREMENT & SOURCING"
  const categoryRegex = /\/\/\s*(\d+)\.\s+(.+)/g;
  let match;
  while ((match = categoryRegex.exec(content)) !== null) {
    metadata[match[1]] = match[2].trim();
  }

  return metadata;
}

// ── Generate ─────────────────────────────────────────────────────────────────

const services = scanServices();
const categories = extractIndexMetadata();

const inventory = {
  generated: new Date().toISOString(),
  generator: 'scripts/generate-enterprise-inventory.js',
  sourceDir: 'backend/src/services/enterprise/',
  totalServices: services.length,
  totalTypes: services.reduce((sum, s) => sum + s.typeCount, 0),
  totalSizeKB: Math.round(services.reduce((sum, s) => sum + s.sizeBytes, 0) / 1024),
  servicesWithAI: services.filter(s => s.hasAIIntegration).length,
  categories,
  services,
};

// Write JSON
fs.mkdirSync(path.dirname(OUTPUT_JSON), { recursive: true });
fs.writeFileSync(OUTPUT_JSON, JSON.stringify(inventory, null, 2), 'utf8');

// Write Markdown
const md = [
  '# Enterprise Feature Inventory',
  '',
  `> **Auto-generated** on ${inventory.generated.split('T')[0]} by \`scripts/generate-enterprise-inventory.js\``,
  '> Do not edit manually — regenerate with `node scripts/generate-enterprise-inventory.js`',
  '',
  '## Summary',
  '',
  `| Metric | Value |`,
  `|--------|-------|`,
  `| **Enterprise services** | ${inventory.totalServices} |`,
  `| **Exported types** | ${inventory.totalTypes} |`,
  `| **Total code size** | ${inventory.totalSizeKB} KB |`,
  `| **Services with AI integration** | ${inventory.servicesWithAI} |`,
  '',
  '## Service Catalog',
  '',
  '| # | Service | File | Types | AI | Size |',
  '|---|---------|------|-------|----|------|',
  ...services.map((s, i) => {
    const ai = s.hasAIIntegration ? '✓' : '—';
    const kb = Math.round(s.sizeBytes / 1024);
    return `| ${i + 1} | **${s.name}** | \`${s.file}\` | ${s.typeCount} | ${ai} | ${kb} KB |`;
  }),
  '',
  '## Categories (from index.ts)',
  '',
  ...Object.entries(categories).map(([num, cat]) => `${num}. ${cat}`),
  '',
  '---',
  '',
  '*This inventory is the source of truth for enterprise service counts. Update `COMMUNITY.md` and marketing materials from this file.*',
  '',
].join('\n');

fs.writeFileSync(OUTPUT_MD, md, 'utf8');

// Console output
console.log('Enterprise inventory generated:');
console.log(`  Services: ${inventory.totalServices}`);
console.log(`  Types: ${inventory.totalTypes}`);
console.log(`  Code: ${inventory.totalSizeKB} KB`);
console.log(`  AI-integrated: ${inventory.servicesWithAI}`);
console.log(`  JSON: docs/ENTERPRISE-INVENTORY.json`);
console.log(`  Markdown: docs/ENTERPRISE-INVENTORY.md`);
