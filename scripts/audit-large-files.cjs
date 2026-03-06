/**
 * audit-large-files.cjs
 * Identifies backend source files >50KB that should be considered for splitting.
 * Run: node scripts/audit-large-files.cjs
 * Output: docs/LARGE-FILES-AUDIT.md
 */
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.resolve(__dirname, '..', 'backend', 'src');
const OUTPUT = path.resolve(__dirname, '..', 'docs', 'LARGE-FILES-AUDIT.md');
const THRESHOLD_KB = 50;

function scanDir(dir) {
  const results = [];
  if (!fs.existsSync(dir)) return results;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fp = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== 'node_modules') {
      results.push(...scanDir(fp));
    } else if (entry.isFile() && entry.name.endsWith('.ts')) {
      const size = fs.statSync(fp).size;
      if (size > THRESHOLD_KB * 1024) {
        results.push({
          file: path.relative(SRC_DIR, fp),
          sizeKB: Math.round(size / 1024),
          lines: fs.readFileSync(fp, 'utf8').split('\n').length,
        });
      }
    }
  }
  return results;
}

const largeFiles = scanDir(SRC_DIR).sort((a, b) => b.sizeKB - a.sizeKB);

const md = [
  '# Large File Audit',
  '',
  `> Generated ${new Date().toISOString().split('T')[0]} by \`scripts/audit-large-files.cjs\``,
  `> Threshold: ${THRESHOLD_KB} KB`,
  '',
  `## Summary: ${largeFiles.length} files over ${THRESHOLD_KB} KB`,
  '',
  '| Size | Lines | File | Suggested Action |',
  '|------|-------|------|-----------------|',
  ...largeFiles.map(f => {
    const action = f.sizeKB > 80 ? 'Split into sub-modules' :
                   f.sizeKB > 60 ? 'Consider splitting' : 'Monitor';
    return `| ${f.sizeKB} KB | ${f.lines.toLocaleString()} | \`${f.file}\` | ${action} |`;
  }),
  '',
  '## Splitting Guidelines',
  '',
  '- Extract logical sub-modules (e.g., `CrucibleService.ts` → `CrucibleSimulation.ts` + `CrucibleScoring.ts`)',
  '- Move type definitions to separate `types.ts` files',
  '- Extract constants/config to dedicated files',
  '- Keep the main service file as a facade that imports sub-modules',
  '',
  '---',
  '*Run quarterly to track file size trends.*',
  '',
].join('\n');

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, md, 'utf8');

console.log(`Large file audit: ${largeFiles.length} files over ${THRESHOLD_KB} KB`);
console.log(`Top 5:`);
for (const f of largeFiles.slice(0, 5)) {
  console.log(`  ${f.sizeKB} KB | ${f.file}`);
}
console.log(`Report: docs/LARGE-FILES-AUDIT.md`);
