// Simple benchmark script for UniStack build pipeline
// english: measures time to parse and transpile a sample app
// french: mesure le temps de parsing et transpilation d'une app exemple

import { parseUniFile } from '../src/parser/uniParser.js';
import { buildUniStack } from '../src/transpiler/index.js';
import fs from 'fs';

const src = fs.readFileSync('src/app.uni', 'utf8');

console.time('parse');
const ast = parseUniFile(src, 'app.uni');
console.timeEnd('parse');

console.time('transpile');
await buildUniStack(src, 'app.uni', {
  outDir: 'dist',
  generatedDir: 'generated',
  serverEntry: 'generated/app.server.ts',
  clientEntry: 'generated/app.client.ts',
});
console.timeEnd('transpile');
