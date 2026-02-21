/**
 * Batch Migration Script: Add loadFromDB to all services using persistServiceRecord
 * 
 * This script:
 * 1. Finds all service files that use persistServiceRecord but lack loadFromDB
 * 2. Adds loadServiceRecords to the import
 * 3. Adds a loadFromDB() method that restores in-memory Maps from the DB
 * 4. Adds this.loadFromDB().catch(() => {}) to the constructor
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const servicesDir = path.join(__dirname, '..', 'backend', 'src', 'services');

function findServiceFiles(dir) {
  const results = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findServiceFiles(full));
    } else if (entry.name.endsWith('.ts') && entry.name !== 'index.ts') {
      results.push(full);
    }
  }
  return results;
}

function extractClassName(content) {
  // Match: export class FooService or class FooService
  const m = content.match(/(?:export\s+)?class\s+(\w+)/);
  return m ? m[1] : null;
}

function extractMapFields(content) {
  // Match: private foo: Map<string, Bar> = new Map();
  const maps = [];
  const re = /private\s+(\w+)\s*:\s*Map<[^>]+>\s*=\s*new\s+Map/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    maps.push(m[1]);
  }
  return maps;
}

function extractServiceName(content) {
  // Match: serviceName: 'FooService' or serviceName: "FooService"
  const m = content.match(/serviceName:\s*['"]([^'"]+)['"]/);
  return m ? m[1] : null;
}

function extractRecordTypes(content) {
  // Match all recordType values
  const types = new Set();
  const re = /recordType:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    types.add(m[1]);
  }
  return [...types];
}

function hasLoadFromDB(content) {
  return content.includes('loadFromDB');
}

function hasLoadServiceRecords(content) {
  return content.includes('loadServiceRecords');
}

function findConstructorInsertPoint(content) {
  // Find constructor body - look for constructor( and then the first line after opening {
  const constructorMatch = content.match(/constructor\s*\([^)]*\)\s*\{/);
  if (!constructorMatch) return null;
  
  const startIdx = constructorMatch.index + constructorMatch[0].length;
  
  // Find the end of constructor - we need to find the last logger.info or similar line
  // and insert after it. Look for the pattern of logger.info followed by a closing }
  // Actually, let's find the LAST statement before the closing } of the constructor
  
  // Simple approach: find the next } that closes the constructor at the same indentation
  let braceCount = 1;
  let i = startIdx;
  let lastStatementEnd = startIdx;
  
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    if (content[i] === ';' && braceCount === 1) {
      lastStatementEnd = i + 1;
    }
    if (content[i] === '\n' && braceCount === 1) {
      // Check if next non-whitespace is }
      const remaining = content.slice(i + 1).trimStart();
      if (remaining.startsWith('}')) {
        // This is the end of constructor
        break;
      }
    }
    i++;
  }
  
  return lastStatementEnd;
}

function findMethodInsertPoint(content, className) {
  // Find the constructor and insert loadFromDB right after it
  const constructorMatch = content.match(/constructor\s*\([^)]*\)\s*\{/);
  if (!constructorMatch) return null;
  
  const startIdx = constructorMatch.index + constructorMatch[0].length;
  let braceCount = 1;
  let i = startIdx;
  
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    i++;
  }
  
  // i is now right after the closing } of the constructor
  return i;
}

function getIndent(content) {
  // Detect indentation from constructor
  const m = content.match(/^(\s+)constructor/m);
  return m ? m[1] : '  ';
}

let modified = 0;
let skipped = 0;
let errors = 0;

const files = findServiceFiles(servicesDir);
console.log(`Found ${files.length} service files`);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  
  // Skip if no persistServiceRecord
  if (!content.includes('persistServiceRecord')) continue;
  
  // Skip if already has loadFromDB
  if (hasLoadFromDB(content)) {
    skipped++;
    continue;
  }
  
  const className = extractClassName(content);
  const mapFields = extractMapFields(content);
  const serviceName = extractServiceName(content);
  const recordTypes = extractRecordTypes(content);
  const indent = getIndent(content);
  
  if (!className || !serviceName) {
    console.log(`SKIP (no class/serviceName): ${path.relative(servicesDir, filePath)}`);
    skipped++;
    continue;
  }
  
  if (mapFields.length === 0) {
    // No Maps to restore, but still add loadFromDB for completeness
    // Actually skip - no Maps means nothing to reload
    skipped++;
    continue;
  }
  
  try {
    // 1. Add loadServiceRecords to import
    if (!hasLoadServiceRecords(content)) {
      content = content.replace(
        /import\s*\{\s*persistServiceRecord\s*\}\s*from\s*['"]([^'"]+)['"]/,
        `import { persistServiceRecord, loadServiceRecords } from '$1'`
      );
    }
    
    // 2. Add this.loadFromDB().catch(() => {}) to constructor
    const constructorInsertPoint = findConstructorInsertPoint(content);
    if (constructorInsertPoint === null) {
      console.log(`SKIP (no constructor): ${path.relative(servicesDir, filePath)}`);
      skipped++;
      continue;
    }
    
    const loadCall = `\n${indent}${indent}this.loadFromDB().catch(() => {});`;
    content = content.slice(0, constructorInsertPoint) + loadCall + content.slice(constructorInsertPoint);
    
    // 3. Generate loadFromDB method
    // Use the first recordType as the primary one to restore
    const primaryRecordType = recordTypes[0] || 'record';
    const primaryMap = mapFields[0];
    
    // Build restore logic for each map that has a matching recordType
    let restoreBlocks = '';
    for (let mi = 0; mi < mapFields.length && mi < recordTypes.length; mi++) {
      const mapName = mapFields[mi];
      const recType = recordTypes[mi];
      if (mi === 0) {
        restoreBlocks += `${indent}${indent}${indent}const ${recType}Records = await loadServiceRecords({ serviceName: '${serviceName}', recordType: '${recType}', limit: 1000 });\n`;
        restoreBlocks += `${indent}${indent}${indent}for (const rec of ${recType}Records) {\n`;
        restoreBlocks += `${indent}${indent}${indent}${indent}const d = rec.data as any;\n`;
        restoreBlocks += `${indent}${indent}${indent}${indent}if (d?.id && !this.${mapName}.has(d.id)) this.${mapName}.set(d.id, d);\n`;
        restoreBlocks += `${indent}${indent}${indent}}\n`;
        restoreBlocks += `${indent}${indent}${indent}restored += ${recType}Records.length;\n`;
      } else {
        restoreBlocks += `${indent}${indent}${indent}const ${recType}Records = await loadServiceRecords({ serviceName: '${serviceName}', recordType: '${recType}', limit: 1000 });\n`;
        restoreBlocks += `${indent}${indent}${indent}for (const rec of ${recType}Records) {\n`;
        restoreBlocks += `${indent}${indent}${indent}${indent}const d = rec.data as any;\n`;
        restoreBlocks += `${indent}${indent}${indent}${indent}if (d?.id && !this.${mapName}.has(d.id)) this.${mapName}.set(d.id, d);\n`;
        restoreBlocks += `${indent}${indent}${indent}}\n`;
        restoreBlocks += `${indent}${indent}${indent}restored += ${recType}Records.length;\n`;
      }
    }
    
    // For Maps that don't have a matching recordType, try using the first recordType
    for (let mi = recordTypes.length; mi < mapFields.length; mi++) {
      // Skip — we can't determine the recordType for this map
    }
    
    const loadFromDBMethod = `

${indent}async loadFromDB(): Promise<void> {
${indent}${indent}try {
${indent}${indent}${indent}let restored = 0;
${restoreBlocks}${indent}${indent}${indent}if (restored > 0) logger.info(\`[${className}] Restored \${restored} records from database\`);
${indent}${indent}} catch (err) {
${indent}${indent}${indent}logger.warn(\`[${className}] DB reload skipped: \${(err as Error).message}\`);
${indent}${indent}}
${indent}}`;
    
    // 4. Insert the method after the constructor
    const methodInsertPoint = findMethodInsertPoint(content, className);
    if (methodInsertPoint === null) {
      console.log(`SKIP (can't find method insert point): ${path.relative(servicesDir, filePath)}`);
      skipped++;
      continue;
    }
    
    content = content.slice(0, methodInsertPoint) + loadFromDBMethod + content.slice(methodInsertPoint);
    
    fs.writeFileSync(filePath, content, 'utf-8');
    modified++;
    console.log(`MODIFIED: ${path.relative(servicesDir, filePath)} — ${mapFields.length} Maps, ${recordTypes.length} recordTypes`);
  } catch (err) {
    console.log(`ERROR: ${path.relative(servicesDir, filePath)} — ${err.message}`);
    errors++;
  }
}

console.log(`\n=== RESULTS ===`);
console.log(`Modified: ${modified}`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors: ${errors}`);
