#!/usr/bin/env node
import ts from 'typescript';
import path from 'node:path';

const tsconfigPath = path.resolve(process.argv[2] || 'tsconfig.json');
const configDir = path.dirname(tsconfigPath);
const configFile = ts.readConfigFile(tsconfigPath, ts.sys.readFile);
const parsed = ts.parseJsonConfigFileContent(configFile.config, ts.sys, configDir);
const program = ts.createProgram(parsed.fileNames, {
  ...parsed.options,
  noEmit: true,
  noUnusedLocals: true,
  noUnusedParameters: true,
  skipLibCheck: true,
});
const target = process.argv[3] || 'EnvironmentConfigPage';
for (const d of ts.getPreEmitDiagnostics(program)) {
  if (!d.file || ![6133, 6196, 6198, 6199].includes(d.code)) continue;
  if (!d.file.fileName.includes(target)) continue;
  const sf = d.file;
  const { line, character } = sf.getLineAndCharacterOfPosition(d.start);
  // Find the node exactly at this position
  function findAt(node, depth = 0, trail = []) {
    if (d.start < node.getStart(sf) || d.start >= node.getEnd()) return null;
    const myTrail = [...trail, `${ts.SyntaxKind[node.kind]}[${node.getStart(sf)},${node.getEnd()}]`];
    let deepest = null;
    for (const c of node.getChildren(sf)) {
      const r = findAt(c, depth + 1, myTrail);
      if (r) deepest = r;
    }
    if (deepest) return deepest;
    return { node, trail: myTrail };
  }
  const r = findAt(sf);
  console.log(`${path.basename(sf.fileName)}:${line + 1}:${character + 1} (pos=${d.start}) TS${d.code}`);
  console.log(`  Text around: ${JSON.stringify(sf.text.slice(Math.max(0, d.start - 10), d.start + 20))}`);
  if (r) {
    const isIdent = ts.isIdentifier(r.node);
    console.log(`  Deepest node: ${ts.SyntaxKind[r.node.kind]} [${r.node.getStart(sf)},${r.node.getEnd()}] "${r.node.getText(sf)}" (isIdentifier=${isIdent}, startMatches=${r.node.getStart(sf) === d.start})`);
    console.log(`  Trail: ${r.trail.join(' > ')}`);
  }
  console.log('');
}
