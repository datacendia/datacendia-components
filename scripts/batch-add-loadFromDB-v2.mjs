/**
 * Batch Migration Script v2: Add loadFromDB to ALL services with in-memory Maps
 * 
 * Handles:
 * - Classes with and without constructors
 * - export class and plain class patterns
 * - Services with and without existing persistServiceRecord
 * - Singleton exported instances
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
  // Match: export class Foo or class Foo (but not inside comments)
  const lines = content.split('\n');
  for (const line of lines) {
    if (line.trimStart().startsWith('//') || line.trimStart().startsWith('*')) continue;
    const m = line.match(/(?:export\s+)?class\s+(\w+)/);
    if (m) return m[1];
  }
  return null;
}

function extractMapFields(content) {
  const maps = [];
  const re = /private\s+(\w+)\s*:\s*Map<[^>]+>\s*=\s*new\s+Map/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    maps.push(m[1]);
  }
  return maps;
}

function extractServiceName(content) {
  const m = content.match(/serviceName:\s*['"]([^'"]+)['"]/);
  if (m) return m[1];
  // Fallback: derive from class name
  const cn = extractClassName(content);
  if (cn) return cn.replace(/Service$/, '');
  return null;
}

function extractRecordTypes(content) {
  const types = [];
  const re = /recordType:\s*['"]([^'"]+)['"]/g;
  let m;
  while ((m = re.exec(content)) !== null) {
    if (!types.includes(m[1])) types.push(m[1]);
  }
  return types;
}

function hasLoadFromDB(content) {
  return content.includes('loadFromDB');
}

function getRelativePersistImportPath(filePath) {
  const rel = path.relative(path.dirname(filePath), path.join(servicesDir, '..', 'utils'));
  return rel.replace(/\\/g, '/') + '/servicePersistence.js';
}

function getRelativeLoggerImportPath(filePath) {
  const rel = path.relative(path.dirname(filePath), path.join(servicesDir, '..', 'utils'));
  return rel.replace(/\\/g, '/') + '/logger.js';
}

function findConstructorEnd(content) {
  const match = content.match(/constructor\s*\([^)]*\)\s*\{/);
  if (!match) return null;
  
  let braceCount = 1;
  let i = match.index + match[0].length;
  
  while (i < content.length && braceCount > 0) {
    if (content[i] === '{') braceCount++;
    if (content[i] === '}') braceCount--;
    i++;
  }
  
  return { constructorStart: match.index, constructorBodyStart: match.index + match[0].length, constructorEnd: i };
}

function findClassBodyStart(content, className) {
  // Find the opening { of the class
  const re = new RegExp(`(?:export\\s+)?class\\s+${className}[^{]*\\{`);
  const m = content.match(re);
  if (!m) return null;
  return m.index + m[0].length;
}

function findFirstMethodOrProperty(content, classBodyStart) {
  // After class body start, find the first 'private', 'public', 'protected', 'async', or method
  const slice = content.slice(classBodyStart);
  const m = slice.match(/\n(\s+)(private|public|protected|async|readonly)\s/);
  if (m) return { index: classBodyStart + m.index, indent: m[1] };
  return null;
}

function getIndentFromClass(content, className) {
  const re = new RegExp(`^(\\s*)(?:export\\s+)?class\\s+${className}`, 'm');
  const m = content.match(re);
  if (m) {
    const classIndent = m[1] || '';
    return classIndent + '  ';
  }
  return '  ';
}

let modified = 0;
let skipped = 0;
let errors = 0;
let alreadyDone = 0;
let noMaps = 0;
let noClass = 0;

const files = findServiceFiles(servicesDir);
console.log(`Found ${files.length} service files\n`);

for (const filePath of files) {
  let content = fs.readFileSync(filePath, 'utf-8');
  const relPath = path.relative(servicesDir, filePath);
  
  // Skip if already has loadFromDB
  if (hasLoadFromDB(content)) {
    alreadyDone++;
    continue;
  }
  
  const className = extractClassName(content);
  if (!className) {
    noClass++;
    continue;
  }
  
  const mapFields = extractMapFields(content);
  if (mapFields.length === 0) {
    noMaps++;
    continue;
  }
  
  const serviceName = extractServiceName(content) || className;
  const recordTypes = extractRecordTypes(content);
  const indent = getIndentFromClass(content, className);
  const innerIndent = indent + '  ';
  const deepIndent = innerIndent + '  ';
  
  try {
    // === STEP 1: Ensure persistServiceRecord + loadServiceRecords import ===
    const hasPersistImport = content.includes('persistServiceRecord');
    const hasLoadImport = content.includes('loadServiceRecords');
    const persistPath = getRelativePersistImportPath(filePath);
    
    if (hasPersistImport && !hasLoadImport) {
      // Add loadServiceRecords to existing import
      content = content.replace(
        /import\s*\{([^}]*persistServiceRecord[^}]*)\}\s*from\s*['"]([^'"]+)['"]/,
        (match, imports, path) => {
          if (imports.includes('loadServiceRecords')) return match;
          return `import {${imports}, loadServiceRecords } from '${path}'`;
        }
      );
    } else if (!hasPersistImport) {
      // Add fresh import after the last import line
      const lastImportIdx = content.lastIndexOf('\nimport ');
      if (lastImportIdx >= 0) {
        const lineEnd = content.indexOf('\n', lastImportIdx + 1);
        const insertAfter = content.indexOf(';', lineEnd) + 1 || lineEnd;
        // Find end of last import statement
        let importEnd = lastImportIdx + 1;
        while (importEnd < content.length) {
          const nextNewline = content.indexOf('\n', importEnd);
          if (nextNewline === -1) break;
          const line = content.slice(importEnd, nextNewline).trim();
          if (line.startsWith('import ') || line.startsWith('} from') || line === '') {
            importEnd = nextNewline + 1;
          } else {
            break;
          }
        }
        content = content.slice(0, importEnd) + 
          `import { persistServiceRecord, loadServiceRecords } from '${persistPath}';\n` + 
          content.slice(importEnd);
      }
    }
    
    // Ensure logger import exists (needed for loadFromDB)
    if (!content.includes('logger')) {
      const loggerPath = getRelativeLoggerImportPath(filePath);
      const lastImportIdx = content.lastIndexOf('\nimport ');
      if (lastImportIdx >= 0) {
        let importEnd = lastImportIdx + 1;
        while (importEnd < content.length) {
          const nextNewline = content.indexOf('\n', importEnd);
          if (nextNewline === -1) break;
          const line = content.slice(importEnd, nextNewline).trim();
          if (line.startsWith('import ') || line.startsWith('} from') || line === '') {
            importEnd = nextNewline + 1;
          } else {
            break;
          }
        }
        content = content.slice(0, importEnd) + 
          `import { logger } from '${loggerPath}';\n` + 
          content.slice(importEnd);
      }
    }
    
    // === STEP 2: Build loadFromDB method ===
    // Determine record types for each map
    let restoreCode = '';
    const usedRecordTypes = recordTypes.length > 0 ? recordTypes : ['record'];
    
    for (let i = 0; i < mapFields.length; i++) {
      const mapName = mapFields[i];
      const recType = usedRecordTypes[Math.min(i, usedRecordTypes.length - 1)];
      const varName = recType.replace(/[^a-zA-Z0-9]/g, '_') + (i > 0 ? `_${i}` : '');
      
      restoreCode += `${deepIndent}const ${varName} = await loadServiceRecords({ serviceName: '${serviceName}', recordType: '${recType}', limit: 1000 });\n`;
      restoreCode += `${deepIndent}for (const rec of ${varName}) {\n`;
      restoreCode += `${deepIndent}  const d = rec.data as any;\n`;
      restoreCode += `${deepIndent}  if (d?.id && !this.${mapName}.has(d.id)) this.${mapName}.set(d.id, d);\n`;
      restoreCode += `${deepIndent}}\n`;
      restoreCode += `${deepIndent}restored += ${varName}.length;\n`;
    }
    
    const loadFromDBMethod = `\n${indent}async loadFromDB(): Promise<void> {\n` +
      `${innerIndent}try {\n` +
      `${deepIndent}let restored = 0;\n` +
      restoreCode +
      `${deepIndent}if (restored > 0) logger.info(\`[${className}] Restored \${restored} records from database\`);\n` +
      `${innerIndent}} catch (err) {\n` +
      `${deepIndent}logger.warn(\`[${className}] DB reload skipped: \${(err as Error).message}\`);\n` +
      `${innerIndent}}\n` +
      `${indent}}\n`;
    
    // === STEP 3: Add constructor call or constructor ===
    const constructorInfo = findConstructorEnd(content);
    
    if (constructorInfo) {
      // Constructor exists — insert loadFromDB call before closing }
      const beforeClose = content.lastIndexOf('\n', constructorInfo.constructorEnd - 1);
      content = content.slice(0, beforeClose) + `\n${innerIndent}this.loadFromDB().catch(() => {});` + content.slice(beforeClose);
      
      // Re-find constructor end after insertion
      const newConstructorInfo = findConstructorEnd(content);
      if (newConstructorInfo) {
        content = content.slice(0, newConstructorInfo.constructorEnd) + loadFromDBMethod + content.slice(newConstructorInfo.constructorEnd);
      }
    } else {
      // No constructor — add one after the Map declarations
      const classBodyStart = findClassBodyStart(content, className);
      if (classBodyStart === null) {
        console.log(`  SKIP (can't find class body): ${relPath}`);
        skipped++;
        continue;
      }
      
      // Find insertion point: after the last "private ... = new Map" or "private ... = []" line
      const classContent = content.slice(classBodyStart);
      let lastFieldEnd = 0;
      const fieldRe = /\n\s+private\s+\w+[^;]+;/g;
      let fm;
      while ((fm = fieldRe.exec(classContent)) !== null) {
        lastFieldEnd = fm.index + fm[0].length;
      }
      
      const insertPoint = classBodyStart + lastFieldEnd;
      
      const constructor = `\n\n${indent}constructor() {\n` +
        `${innerIndent}this.loadFromDB().catch(() => {});\n` +
        `${indent}}\n` +
        loadFromDBMethod;
      
      content = content.slice(0, insertPoint) + constructor + content.slice(insertPoint);
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    modified++;
    console.log(`MODIFIED: ${relPath} — ${mapFields.length} Maps, ${recordTypes.length || 0} recordTypes, constructor: ${constructorInfo ? 'existing' : 'added'}`);
  } catch (err) {
    console.log(`ERROR: ${relPath} — ${err.message}`);
    errors++;
  }
}

console.log(`\n=== RESULTS ===`);
console.log(`Total service files: ${files.length}`);
console.log(`Modified: ${modified}`);
console.log(`Already had loadFromDB: ${alreadyDone}`);
console.log(`No Maps (no reload needed): ${noMaps}`);
console.log(`No class found: ${noClass}`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors: ${errors}`);
