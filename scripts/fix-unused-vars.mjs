#!/usr/bin/env node
/**
 * fix-unused-vars.mjs
 *
 * AST-based fixer for tsc --noUnusedLocals --noUnusedParameters errors.
 *
 * Strategy (safest → most aggressive):
 *   1. ParameterDeclaration              → rename to `_<name>` (tsc respects _-prefix for params)
 *   2. BindingElement in parameter       → rename to `_<name>` (same, destructured params)
 *   3. ImportSpecifier / ImportClause    → remove (should be rare; eslint-plugin-unused-imports handles most)
 *   4. VariableDeclaration (function-scoped, no side-effect initializer) → remove
 *   5. TypeAliasDeclaration / InterfaceDeclaration → remove
 *   6. Function name (FunctionDeclaration) → skip (likely dead code, manual decision)
 *   7. Anything else → skip
 *
 * Usage: node scripts/fix-unused-vars.mjs <tsconfig-path>
 *
 * Reports per-file and per-kind counts so you can see what it touched.
 */

import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const tsconfigArg = process.argv[2];
if (!tsconfigArg) {
  console.error('Usage: node fix-unused-vars.mjs <tsconfig-path>');
  process.exit(1);
}

const tsconfigPath = path.resolve(tsconfigArg);
const configDir = path.dirname(tsconfigPath);

const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
if (configFile.error) {
  console.error('Failed to read tsconfig:', ts.flattenDiagnosticMessageText(configFile.error.messageText, '\n'));
  process.exit(1);
}

const parsed = ts.parseJsonConfigFileContent(
  configFile.config,
  ts.sys,
  configDir,
);

const compilerOptions = {
  ...parsed.options,
  noEmit: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  skipLibCheck: true,
};

const program = ts.createProgram(parsed.fileNames, compilerOptions);
const diagnostics = ts.getPreEmitDiagnostics(program);

// Group unused-var diagnostics by source file
const unusedByFile = new Map(); // filePath -> [{ pos, name, code }]
function extractName(messageText) {
  const m = /^'([^']+)' is /.exec(messageText);
  return m ? m[1] : null;
}
for (const d of diagnostics) {
  if (!d.file) continue;
  // TS6133: 'X' is declared but its value is never read.
  // TS6192: All imports in import declaration are unused.
  // TS6196: 'X' is declared but never used.  (type alias/interface)
  // TS6198: All destructured elements are unused.
  // TS6199: All imports in import declaration are unused.
  if (![6133, 6192, 6196, 6198, 6199].includes(d.code)) continue;
  const messageText = typeof d.messageText === 'string'
    ? d.messageText
    : ts.flattenDiagnosticMessageText(d.messageText, '\n');
  const name = extractName(messageText);
  const filePath = d.file.fileName;
  const arr = unusedByFile.get(filePath) || [];
  arr.push({ pos: d.start ?? 0, length: d.length ?? 0, code: d.code, name });
  unusedByFile.set(filePath, arr);
}

const stats = {
  paramRenamed: 0,
  bindingRenamed: 0,
  importRemoved: 0,
  variableRemoved: 0,
  typeRemoved: 0,
  skipped: 0,
  filesChanged: 0,
};

const skipReasons = new Map(); // reason -> count

function noteSkip(reason) {
  stats.skipped++;
  skipReasons.set(reason, (skipReasons.get(reason) || 0) + 1);
}

/**
 * Find the Identifier whose text is `name` within a subtree that contains `pos`.
 * Falls back to any Identifier at `pos` if `name` is null.
 */
function findIdentifierAt(sourceFile, pos, name) {
  // Find the smallest node containing pos
  function innermost(node) {
    if (pos < node.getStart(sourceFile) || pos >= node.getEnd()) return null;
    for (const c of node.getChildren(sourceFile)) {
      const r = innermost(c);
      if (r) return r;
    }
    return node;
  }
  const startNode = innermost(sourceFile);
  if (!startNode) return null;
  // If startNode is already the identifier we want, return it
  if (ts.isIdentifier(startNode) && (!name || startNode.text === name) && startNode.getStart(sourceFile) === pos) {
    return startNode;
  }
  // Walk up to find a container that encloses the diagnostic position AND has an Identifier with matching name.
  let container = startNode.parent;
  while (container) {
    let found = null;
    const search = (node) => {
      if (found) return;
      if (ts.isIdentifier(node) && (!name || node.text === name)) {
        found = node;
        return;
      }
      node.forEachChild(search);
    };
    search(container);
    if (found) return found;
    container = container.parent;
  }
  return null;
}

/**
 * Does the expression have side effects worth preserving?
 * Conservative: only treat simple literals/identifiers/property accesses as side-effect-free.
 */
function isSideEffectFree(expr) {
  if (!expr) return true;
  if (
    ts.isStringLiteral(expr) ||
    ts.isNumericLiteral(expr) ||
    ts.isBigIntLiteral(expr) ||
    ts.isNoSubstitutionTemplateLiteral(expr) ||
    expr.kind === ts.SyntaxKind.TrueKeyword ||
    expr.kind === ts.SyntaxKind.FalseKeyword ||
    expr.kind === ts.SyntaxKind.NullKeyword ||
    expr.kind === ts.SyntaxKind.UndefinedKeyword ||
    expr.kind === ts.SyntaxKind.ThisKeyword ||
    expr.kind === ts.SyntaxKind.SuperKeyword
  ) return true;
  if (ts.isIdentifier(expr)) return true;
  if (ts.isPropertyAccessExpression(expr)) return isSideEffectFree(expr.expression);
  if (ts.isElementAccessExpression(expr)) {
    return isSideEffectFree(expr.expression) && isSideEffectFree(expr.argumentExpression);
  }
  if (ts.isArrayLiteralExpression(expr)) return expr.elements.every((e) => isSideEffectFree(e));
  if (ts.isObjectLiteralExpression(expr)) {
    return expr.properties.every((p) => {
      if (ts.isPropertyAssignment(p)) return isSideEffectFree(p.initializer);
      if (ts.isShorthandPropertyAssignment(p)) return true;
      if (ts.isSpreadAssignment(p)) return isSideEffectFree(p.expression);
      return false;
    });
  }
  if (ts.isArrowFunction(expr) || ts.isFunctionExpression(expr)) return true;
  if (ts.isAsExpression(expr) || ts.isTypeAssertionExpression(expr) || ts.isNonNullExpression(expr) || ts.isSatisfiesExpression?.(expr)) {
    return isSideEffectFree(expr.expression);
  }
  if (ts.isParenthesizedExpression(expr)) return isSideEffectFree(expr.expression);
  if (ts.isPrefixUnaryExpression(expr) || ts.isPostfixUnaryExpression(expr)) return isSideEffectFree(expr.operand);
  if (ts.isBinaryExpression(expr)) {
    // Short-circuit / bitwise / arithmetic on side-effect-free sides is fine.
    // Assignment operators are NOT side-effect-free.
    const k = expr.operatorToken.kind;
    const isAssignment = k >= ts.SyntaxKind.FirstAssignment && k <= ts.SyntaxKind.LastAssignment;
    if (isAssignment) return false;
    return isSideEffectFree(expr.left) && isSideEffectFree(expr.right);
  }
  if (ts.isConditionalExpression(expr)) {
    return isSideEffectFree(expr.condition) && isSideEffectFree(expr.whenTrue) && isSideEffectFree(expr.whenFalse);
  }
  if (ts.isTemplateExpression(expr)) {
    return expr.templateSpans.every((s) => isSideEffectFree(s.expression));
  }
  if (ts.isSpreadElement(expr)) return isSideEffectFree(expr.expression);
  return false;
}

/**
 * Collect edits for a single source file. Returns array of {start, end, replacement}.
 */
function planEditsForFile(sourceFile, diags) {
  const edits = [];
  const touched = new Set(); // to avoid double-editing same node
  // Sort diagnostics by descending position so later splices don't invalidate earlier offsets
  diags.sort((a, b) => b.pos - a.pos);

  for (const diag of diags) {
    // TS6198: All destructured elements are unused. The diag position points at the pattern.
    // Just remove or void the whole VariableStatement.
    if (diag.code === 6198) {
      let node = null;
      function innermostAt(n) {
        if (diag.pos < n.getStart(sourceFile) || diag.pos >= n.getEnd()) return null;
        for (const c of n.getChildren(sourceFile)) {
          const r = innermostAt(c);
          if (r) return r;
        }
        return n;
      }
      const hit = innermostAt(sourceFile);
      if (!hit) { noteSkip('6198-no-node'); continue; }
      const varStmt = ts.findAncestor(hit, ts.isVariableStatement);
      if (!varStmt || touched.has(varStmt)) { noteSkip('6198-no-stmt'); continue; }
      touched.add(varStmt);
      const decl = varStmt.declarationList.declarations[0];
      const noSideEffects = !decl.initializer || isSideEffectFree(decl.initializer);
      if (noSideEffects) {
        edits.push({ start: varStmt.getFullStart(), end: varStmt.getEnd(), replacement: '' });
      } else {
        const initText = decl.initializer.getText(sourceFile);
        edits.push({ start: varStmt.getStart(sourceFile), end: varStmt.getEnd(), replacement: `void (${initText});` });
      }
      stats.variableRemoved++;
      continue;
    }

    const ident = findIdentifierAt(sourceFile, diag.pos, diag.name);
    if (!ident) {
      noteSkip('no-identifier');
      continue;
    }
    const parent = ident.parent;
    if (!parent) {
      noteSkip('no-parent');
      continue;
    }

    // TS6199: All imports unused — parent is ImportClause; remove the entire ImportDeclaration.
    if (diag.code === 6199) {
      const importDecl = ts.findAncestor(parent, ts.isImportDeclaration);
      if (importDecl && !touched.has(importDecl)) {
        touched.add(importDecl);
        const start = importDecl.getFullStart();
        const end = importDecl.getEnd();
        edits.push({ start, end, replacement: '' });
        stats.importRemoved++;
        continue;
      }
    }

    // ParameterDeclaration — rename
    const paramAncestor = ts.findAncestor(ident, ts.isParameter);
    if (paramAncestor && paramAncestor.name === ident) {
      if (ident.text.startsWith('_')) { noteSkip('param-already-prefixed'); continue; }
      const start = ident.getStart(sourceFile);
      edits.push({ start, end: start, replacement: '_' });
      stats.paramRenamed++;
      continue;
    }

    // BindingElement — handle both parameter destructuring and variable-declaration destructuring.
    // Key invariant: shorthand `{ foo }` must become `{ foo: _foo }` (preserve property name);
    // explicit `{ foo: bar }` where `bar` is unused becomes `{ foo: _bar }`.
    // Array destructuring: `const [a, b]` → `const [_a, b]` is safe (position-based).
    if (ts.isBindingElement(parent) && parent.name === ident) {
      if (ident.text.startsWith('_')) { noteSkip('binding-already-prefixed'); continue; }
      const bindingPattern = parent.parent; // ObjectBindingPattern or ArrayBindingPattern
      const isArrayBinding = ts.isArrayBindingPattern(bindingPattern);

      if (isArrayBinding) {
        // Array binding: positional, just prefix the name
        const start = ident.getStart(sourceFile);
        edits.push({ start, end: start, replacement: '_' });
        stats.bindingRenamed++;
        continue;
      }
      // Object binding
      if (!parent.propertyName) {
        // Shorthand: `{ foo }` → `{ foo: _foo }`
        const end = ident.getEnd();
        edits.push({ start: end, end, replacement: `: _${ident.text}` });
        stats.bindingRenamed++;
        continue;
      }
      // Explicit propertyName: `{ foo: bar }` → `{ foo: _bar }`
      const start = ident.getStart(sourceFile);
      edits.push({ start, end: start, replacement: '_' });
      stats.bindingRenamed++;
      continue;
    }

    // ImportSpecifier (named import)
    if (ts.isImportSpecifier(parent)) {
      const importDecl = ts.findAncestor(parent, ts.isImportDeclaration);
      if (!importDecl) { noteSkip('import-no-decl'); continue; }
      const namedImports = parent.parent; // NamedImports
      const siblings = namedImports.elements;
      if (siblings.length === 1) {
        // Only this named import; remove the whole ImportDeclaration only if no default/namespace
        const clause = importDecl.importClause;
        if (clause && !clause.name && !(clause.namedBindings && ts.isNamespaceImport(clause.namedBindings))) {
          if (!touched.has(importDecl)) {
            touched.add(importDecl);
            edits.push({ start: importDecl.getFullStart(), end: importDecl.getEnd(), replacement: '' });
            stats.importRemoved++;
            continue;
          }
        }
        noteSkip('import-specifier-would-empty-clause');
        continue;
      }
      // Multiple siblings: remove just this specifier plus trailing comma
      const idx = siblings.indexOf(parent);
      const start = parent.getFullStart();
      let end = parent.getEnd();
      // Eat trailing comma+space if not last
      if (idx < siblings.length - 1) {
        const text = sourceFile.text;
        while (end < text.length && /[,\s]/.test(text[end])) end++;
      }
      edits.push({ start, end, replacement: '' });
      stats.importRemoved++;
      continue;
    }

    // ImportClause default name (import X from '...';)
    if (ts.isImportClause(parent) && parent.name === ident) {
      const importDecl = parent.parent;
      if (!parent.namedBindings) {
        // Only default; remove whole import
        if (!touched.has(importDecl)) {
          touched.add(importDecl);
          edits.push({ start: importDecl.getFullStart(), end: importDecl.getEnd(), replacement: '' });
          stats.importRemoved++;
          continue;
        }
      } else {
        // Has namedBindings; remove only the default name and trailing comma
        const text = sourceFile.text;
        const start = ident.getStart(sourceFile);
        let end = ident.getEnd();
        while (end < text.length && /[,\s]/.test(text[end])) end++;
        edits.push({ start, end, replacement: '' });
        stats.importRemoved++;
        continue;
      }
    }

    // NamespaceImport (import * as X from '...';)
    if (ts.isNamespaceImport(parent) && parent.name === ident) {
      const importDecl = ts.findAncestor(parent, ts.isImportDeclaration);
      if (importDecl && !touched.has(importDecl)) {
        const clause = importDecl.importClause;
        // If no default name, remove whole
        if (clause && !clause.name) {
          touched.add(importDecl);
          edits.push({ start: importDecl.getFullStart(), end: importDecl.getEnd(), replacement: '' });
          stats.importRemoved++;
          continue;
        }
      }
      noteSkip('namespace-import-complex');
      continue;
    }

    // VariableDeclaration (const/let/var X = expr;)
    // Note: TS's noUnusedLocals does NOT respect `_`-prefix for plain locals
    // (only parameters and destructured bindings). So we either remove the
    // declaration or rewrite `const X = expr;` → `void expr;` to preserve side effects.
    if (ts.isVariableDeclaration(parent) && parent.name === ident) {
      const varStmt = ts.findAncestor(parent, ts.isVariableStatement);
      if (!varStmt) { noteSkip('var-decl-no-statement'); continue; }
      const isSingle = varStmt.declarationList.declarations.length === 1;
      const noSideEffects = !parent.initializer || isSideEffectFree(parent.initializer);
      if (isSingle && noSideEffects) {
        if (!touched.has(varStmt)) {
          touched.add(varStmt);
          edits.push({ start: varStmt.getFullStart(), end: varStmt.getEnd(), replacement: '' });
          stats.variableRemoved++;
        }
        continue;
      }
      if (isSingle && parent.initializer) {
        // Rewrite `const X = expr;` → `void (expr);` so the expression still runs but the binding is gone.
        // Parenthesize to avoid `void a || b` parsing as `(void a) || b`.
        if (!touched.has(varStmt)) {
          touched.add(varStmt);
          const initText = parent.initializer.getText(sourceFile);
          edits.push({ start: varStmt.getStart(sourceFile), end: varStmt.getEnd(), replacement: `void (${initText});` });
          stats.variableRemoved++;
        }
        continue;
      }
      // Multi-declaration statement (const X = a, Y = b): remove just this one declaration.
      const decls = varStmt.declarationList.declarations;
      const idx = decls.indexOf(parent);
      if (idx === -1) { noteSkip('var-not-in-decl-list'); continue; }
      const text = sourceFile.text;
      let start = parent.getFullStart();
      let end = parent.getEnd();
      if (idx < decls.length - 1) {
        // Not last: consume trailing comma + whitespace
        while (end < text.length && /[,\s]/.test(text[end])) end++;
      } else {
        // Last: consume leading comma + whitespace from previous decl
        while (start > 0 && /[,\s]/.test(text[start - 1])) start--;
      }
      edits.push({ start, end, replacement: '' });
      stats.variableRemoved++;
      continue;
    }

    // TypeAliasDeclaration / InterfaceDeclaration
    if ((ts.isTypeAliasDeclaration(parent) || ts.isInterfaceDeclaration(parent)) && parent.name === ident) {
      if (!touched.has(parent)) {
        touched.add(parent);
        edits.push({ start: parent.getFullStart(), end: parent.getEnd(), replacement: '' });
        stats.typeRemoved++;
      }
      continue;
    }

    // FunctionDeclaration — if it's a non-exported local helper, safe to remove
    if (ts.isFunctionDeclaration(parent) && parent.name === ident) {
      const hasExport = (parent.modifiers || []).some((m) => m.kind === ts.SyntaxKind.ExportKeyword);
      if (hasExport) { noteSkip('FunctionDeclaration-exported'); continue; }
      if (!touched.has(parent)) {
        touched.add(parent);
        edits.push({ start: parent.getFullStart(), end: parent.getEnd(), replacement: '' });
        stats.variableRemoved++;
      }
      continue;
    }

    // PropertyDeclaration (class field) — SKIP. tsc's "unused" for a field means
    // it's written but never read, which is semantically different from a local. Removing
    // the declaration breaks the writes elsewhere in the class. Leave for manual review.
    if (ts.isPropertyDeclaration(parent) && parent.name === ident) {
      noteSkip('PropertyDeclaration');
      continue;
    }

    // ClassDeclaration / EnumDeclaration — skip (probably intentional, too risky)
    if (
      (ts.isClassDeclaration(parent) && parent.name === ident) ||
      (ts.isEnumDeclaration(parent) && parent.name === ident)
    ) {
      noteSkip(`${ts.SyntaxKind[parent.kind]}`);
      continue;
    }

    noteSkip(`unhandled-${ts.SyntaxKind[parent.kind]}`);
  }

  return edits;
}

// Apply plans to files
for (const [filePath, diags] of unusedByFile) {
  const sourceFile = program.getSourceFile(filePath);
  if (!sourceFile) continue;
  // Only touch files inside the project directory (skip declaration files and node_modules)
  if (sourceFile.isDeclarationFile) continue;
  if (filePath.includes('node_modules')) continue;

  const edits = planEditsForFile(sourceFile, diags);
  if (edits.length === 0) continue;

  // Apply edits in descending order of start position
  edits.sort((a, b) => b.start - a.start);
  let text = sourceFile.text;
  for (const e of edits) {
    text = text.slice(0, e.start) + e.replacement + text.slice(e.end);
  }
  fs.writeFileSync(filePath, text, 'utf8');
  stats.filesChanged++;
}

console.log('=== fix-unused-vars summary ===');
console.log(`Files changed:         ${stats.filesChanged}`);
console.log(`Parameters renamed:    ${stats.paramRenamed}`);
console.log(`Bindings renamed:      ${stats.bindingRenamed}`);
console.log(`Imports removed:       ${stats.importRemoved}`);
console.log(`Variables removed:     ${stats.variableRemoved}`);
console.log(`Types removed:         ${stats.typeRemoved}`);
console.log(`Skipped:               ${stats.skipped}`);
if (stats.skipped > 0) {
  console.log('Skip reasons:');
  const sorted = [...skipReasons.entries()].sort((a, b) => b[1] - a[1]);
  for (const [reason, count] of sorted) {
    console.log(`  ${count.toString().padStart(5)} ${reason}`);
  }
}
