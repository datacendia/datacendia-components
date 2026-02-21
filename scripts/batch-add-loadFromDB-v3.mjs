/**
 * Batch Migration Script v3: Add loadFromDB to ALL services with in-memory Maps
 * 
 * Strategy: Instead of fragile insertion into constructors, this script:
 * 1. Finds the class closing brace (safe, reliable)
 * 2. Inserts loadFromDB method BEFORE the class closing brace
 * 3. For constructor calls: finds constructor body and inserts at the end
 * 4. Uses proper brace counting that skips strings, templates, and comments
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

/**
 * Smart brace counter that skips string literals, template literals, and comments.
 * Returns the index AFTER the matching closing brace.
 */
function findMatchingBrace(content, startAfterOpenBrace) {
  let i = startAfterOpenBrace;
  let depth = 1;
  
  while (i < content.length && depth > 0) {
    const ch = content[i];
    
    // Skip single-line comments
    if (ch === '/' && content[i + 1] === '/') {
      i = content.indexOf('\n', i);
      if (i === -1) break;
      i++;
      continue;
    }
    
    // Skip multi-line comments
    if (ch === '/' && content[i + 1] === '*') {
      i = content.indexOf('*/', i + 2);
      if (i === -1) break;
      i += 2;
      continue;
    }
    
    // Skip template literals
    if (ch === '`') {
      i++;
      while (i < content.length && content[i] !== '`') {
        if (content[i] === '\\') i++; // skip escaped char
        if (content[i] === '$' && content[i + 1] === '{') {
          // Template expression — recursively skip braces
          i += 2;
          let tDepth = 1;
          while (i < content.length && tDepth > 0) {
            if (content[i] === '{') tDepth++;
            if (content[i] === '}') tDepth--;
            if (content[i] === '\\') i++;
            if (content[i] === '\'' || content[i] === '"' || content[i] === '`') {
              const q = content[i];
              i++;
              while (i < content.length && content[i] !== q) {
                if (content[i] === '\\') i++;
                i++;
              }
            }
            i++;
          }
          continue;
        }
        i++;
      }
      i++; // skip closing backtick
      continue;
    }
    
    // Skip string literals
    if (ch === '\'' || ch === '"') {
      const quote = ch;
      i++;
      while (i < content.length && content[i] !== quote) {
        if (content[i] === '\\') i++; // skip escaped char
        i++;
      }
      i++; // skip closing quote
      continue;
    }
    
    if (ch === '{') depth++;
    if (ch === '}') depth--;
    i++;
  }
  
  return depth === 0 ? i : -1;
}

function extractClassName(content) {
  const lines = content.split('\n');
  for (const line of lines) {
    const trimmed = line.trimStart();
    if (trimmed.startsWith('//') || trimmed.startsWith('*') || trimmed.startsWith('/*')) continue;
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
  const cn = extractClassName(content);
  if (cn) return cn.replace(/Service$/, '').replace(/Vertical$/, '');
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

function getRelativeImportPath(filePath, targetFile) {
  let rel = path.relative(path.dirname(filePath), path.join(servicesDir, '..', 'utils', targetFile));
  rel = rel.replace(/\\/g, '/');
  if (!rel.startsWith('.')) rel = './' + rel;
  return rel;
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
  
  if (content.includes('loadFromDB')) {
    alreadyDone++;
    continue;
  }
  
  const className = extractClassName(content);
  if (!className) { noClass++; continue; }
  
  const mapFields = extractMapFields(content);
  if (mapFields.length === 0) { noMaps++; continue; }
  
  const serviceName = extractServiceName(content) || className;
  const recordTypes = extractRecordTypes(content);
  
  // Detect indentation from class definition
  const classLineMatch = content.match(new RegExp(`^(\\s*)(?:export\\s+)?class\\s+${className}`, 'm'));
  const classIndent = classLineMatch ? classLineMatch[1] : '';
  const memberIndent = classIndent + '  ';
  const bodyIndent = memberIndent + '  ';
  const innerIndent = bodyIndent + '  ';
  
  try {
    // ==========================================
    // STEP 1: Ensure imports
    // ==========================================
    const hasPersistImport = content.includes('persistServiceRecord');
    const hasLoadImport = content.includes('loadServiceRecords');
    const persistPath = getRelativeImportPath(filePath, 'servicePersistence.js');
    const loggerPath = getRelativeImportPath(filePath, 'logger.js');
    
    if (hasPersistImport && !hasLoadImport) {
      content = content.replace(
        /import\s*\{\s*persistServiceRecord\s*\}\s*from\s*['"]([^'"]+)['"]/,
        `import { persistServiceRecord, loadServiceRecords } from '$1'`
      );
    } else if (!hasPersistImport) {
      // Find last import statement and add after it
      const importLines = [];
      const lines = content.split('\n');
      let lastImportLine = -1;
      for (let li = 0; li < lines.length; li++) {
        if (lines[li].trimStart().startsWith('import ')) {
          lastImportLine = li;
          // Handle multi-line imports
          if (!lines[li].includes(';') && !lines[li].includes(' from ')) {
            while (li < lines.length && !lines[li].includes(';') && !lines[li].includes(' from ')) {
              li++;
            }
            lastImportLine = li;
          }
        }
      }
      if (lastImportLine >= 0) {
        lines.splice(lastImportLine + 1, 0, `import { persistServiceRecord, loadServiceRecords } from '${persistPath}';`);
        content = lines.join('\n');
      }
    }
    
    // Ensure logger import
    if (!content.includes("from") || !content.match(/import\s.*logger/)) {
      if (!content.includes('logger')) {
        const lines = content.split('\n');
        let lastImportLine = -1;
        for (let li = 0; li < lines.length; li++) {
          if (lines[li].trimStart().startsWith('import ')) {
            lastImportLine = li;
            if (!lines[li].includes(';') && !lines[li].includes(' from ')) {
              while (li < lines.length && !lines[li].includes(';') && !lines[li].includes(' from ')) li++;
              lastImportLine = li;
            }
          }
        }
        if (lastImportLine >= 0) {
          lines.splice(lastImportLine + 1, 0, `import { logger } from '${loggerPath}';`);
          content = lines.join('\n');
        }
      }
    }
    
    // ==========================================
    // STEP 2: Find class body boundaries
    // ==========================================
    const classMatch = content.match(new RegExp(`(?:export\\s+)?class\\s+${className}[^{]*\\{`));
    if (!classMatch) {
      console.log(`  SKIP (can't find class body): ${relPath}`);
      skipped++;
      continue;
    }
    
    const classBodyStart = classMatch.index + classMatch[0].length;
    const classEnd = findMatchingBrace(content, classBodyStart);
    if (classEnd === -1) {
      console.log(`  SKIP (can't find class end): ${relPath}`);
      skipped++;
      continue;
    }
    
    // ==========================================
    // STEP 3: Build loadFromDB method
    // ==========================================
    const usedRecordTypes = recordTypes.length > 0 ? recordTypes : ['record'];
    
    let restoreCode = '';
    for (let i = 0; i < mapFields.length; i++) {
      const mapName = mapFields[i];
      const recType = usedRecordTypes[Math.min(i, usedRecordTypes.length - 1)];
      const varSuffix = i > 0 ? `_${i}` : '';
      const varName = `recs${varSuffix}`;
      
      restoreCode += `${innerIndent}const ${varName} = await loadServiceRecords({ serviceName: '${serviceName}', recordType: '${recType}', limit: 1000 });\n`;
      restoreCode += `${innerIndent}for (const rec of ${varName}) {\n`;
      restoreCode += `${innerIndent}  const d = rec.data as any;\n`;
      restoreCode += `${innerIndent}  if (d?.id && !this.${mapName}.has(d.id)) this.${mapName}.set(d.id, d);\n`;
      restoreCode += `${innerIndent}}\n`;
      restoreCode += `${innerIndent}restored += ${varName}.length;\n`;
    }
    
    const loadFromDBMethod = 
      `\n${memberIndent}async loadFromDB(): Promise<void> {\n` +
      `${bodyIndent}try {\n` +
      `${innerIndent}let restored = 0;\n` +
      restoreCode +
      `${innerIndent}if (restored > 0) logger.info(\`[${className}] Restored \${restored} records from database\`);\n` +
      `${bodyIndent}} catch (err) {\n` +
      `${innerIndent}logger.warn(\`[${className}] DB reload skipped: \${(err as Error).message}\`);\n` +
      `${bodyIndent}}\n` +
      `${memberIndent}}\n`;
    
    // Insert loadFromDB method BEFORE the class closing brace
    // classEnd points to the char AFTER the closing }, so classEnd-1 is the }
    const insertPos = classEnd - 1;
    content = content.slice(0, insertPos) + loadFromDBMethod + content.slice(insertPos);
    
    // ==========================================
    // STEP 4: Add constructor call
    // ==========================================
    const constructorMatch = content.match(/(\s*)constructor\s*\([^)]*\)\s*\{/);
    
    if (constructorMatch) {
      // Constructor exists — find its closing brace and insert before it
      const conBodyStart = constructorMatch.index + constructorMatch[0].length;
      const conEnd = findMatchingBrace(content, conBodyStart);
      
      if (conEnd > 0) {
        // Insert before the closing } of constructor
        // Find the newline before the closing }
        let insertBefore = conEnd - 1; // the } itself
        // Walk back to find the start of the line with }
        while (insertBefore > 0 && content[insertBefore - 1] !== '\n') {
          insertBefore--;
        }
        const loadCall = `${bodyIndent}this.loadFromDB().catch(() => {});\n`;
        content = content.slice(0, insertBefore) + loadCall + content.slice(insertBefore);
      }
    } else {
      // No constructor — add one after the field declarations
      // Find the position right after all `private ... = new Map/[]` declarations
      // Re-find class body start since content may have shifted
      const newClassMatch = content.match(new RegExp(`(?:export\\s+)?class\\s+${className}[^{]*\\{`));
      if (newClassMatch) {
        const newClassBodyStart = newClassMatch.index + newClassMatch[0].length;
        
        // Find the last field declaration (private foo: ... = ...;)
        const classContent = content.slice(newClassBodyStart);
        const fieldRe = /\n\s+(?:private|public|protected|readonly)\s+\w+[^;{]*;/g;
        let lastFieldEnd = 0;
        let fm;
        while ((fm = fieldRe.exec(classContent)) !== null) {
          lastFieldEnd = fm.index + fm[0].length;
        }
        
        if (lastFieldEnd > 0) {
          const constructorInsertPos = newClassBodyStart + lastFieldEnd;
          const newConstructor = `\n\n${memberIndent}constructor() {\n${bodyIndent}this.loadFromDB().catch(() => {});\n${memberIndent}}\n`;
          content = content.slice(0, constructorInsertPos) + newConstructor + content.slice(constructorInsertPos);
        }
      }
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    modified++;
    console.log(`OK: ${relPath} — ${mapFields.length} Maps, con: ${constructorMatch ? 'existing' : 'added'}`);
  } catch (err) {
    console.log(`ERROR: ${relPath} — ${err.message}`);
    errors++;
  }
}

console.log(`\n=== RESULTS ===`);
console.log(`Total: ${files.length}`);
console.log(`Modified: ${modified}`);
console.log(`Already done: ${alreadyDone}`);
console.log(`No Maps: ${noMaps}`);
console.log(`No class: ${noClass}`);
console.log(`Skipped: ${skipped}`);
console.log(`Errors: ${errors}`);
