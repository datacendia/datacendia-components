#!/usr/bin/env node

/**
 * Fix all silent .catch(() => {}) blocks with appropriate error logging
 * This script scans backend/src and replaces silent catches with logger.error or logger.warn
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SRC_DIR = path.join(__dirname, '..', 'src');

// Patterns to match and replace
const patterns = [
  {
    // this.loadFromDB().catch(() => {});
    pattern: /(\w+)\.loadFromDB\(\)\.catch\(\(\)\s*=>\s*\{\s*\}\)/g,
    replacement: (match, objName) => {
      // Extract service name from context
      const serviceName = objName.charAt(0).toUpperCase() + objName.slice(1);
      return `${objName}.loadFromDB().catch((err) => logger.warn('[${serviceName}] loadFromDB failed', err));`;
    }
  },
  {
    // .catch(() => {}) — generic silent catch
    pattern: /\.catch\(\(\)\s*=>\s*\{\s*\}\)/g,
    replacement: '.catch((err) => logger.error("Silent catch error", err))'
  }
];

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let modified = false;

  // Add logger import if needed
  const hasLoggerImport = /import.*logger.*from.*['"]\.\.\/utils\/logger['"]/.test(content) ||
                          /import.*logger.*from.*['"]\.\.\/utils\/logger\.js['"]/.test(content) ||
                          /import.*\{.*logger.*\}.*from.*['"]\.\.\/utils\/logger['"]/.test(content);

  if (!hasLoggerImport) {
    // Find the last import line and add logger import after it
    const importMatch = content.match(/^(import .+)$/m);
    if (importMatch) {
      const lastImportIndex = content.lastIndexOf(importMatch[0]);
      const insertIndex = content.indexOf('\n', lastImportIndex) + 1;
      content = content.slice(0, insertIndex) + 
                "import { logger } from '../utils/logger.js';\n" + 
                content.slice(insertIndex);
      modified = true;
    }
  }

  // Apply patterns
  for (const { pattern, replacement } of patterns) {
    const newContent = content.replace(pattern, replacement);
    if (newContent !== content) {
      modified = true;
      content = newContent;
    }
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ Fixed: ${filePath}`);
    return true;
  }
  return false;
}

function walkDir(dir, callback) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory() && file !== 'node_modules' && file !== '.git') {
      walkDir(filePath, callback);
    } else if (file.endsWith('.ts') && !file.endsWith('.test.ts') && !file.endsWith('.spec.ts')) {
      callback(filePath);
    }
  }
}

let fixedCount = 0;
console.log('Scanning for silent catches in backend/src...');
walkDir(SRC_DIR, (filePath) => {
  if (processFile(filePath)) {
    fixedCount++;
  }
});

console.log(`\nFixed ${fixedCount} files with silent catches.`);
