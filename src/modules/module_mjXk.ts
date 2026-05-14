/*
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

console.log('[Package] starting parser tests');
import assert from 'assert';
import { parseUniFile } from '../parser/uniParser.js';

console.log('[Package] loading auxiliary modules');
let UniStackLanguageServer: any;
let uniStd: any;
let installPackage: any;
let UIEngine: any;
(async () => {
  try {
    const lspMod = await import('../lang/lsp.js');
    UniStackLanguageServer = lspMod.UniStackLanguageServer;
    const stdmod = await import('../stdlib/index.js');
    uniStd = stdmod.default || stdmod;
    const pkgmod = await import('../cli/unipack.js');
    installPackage = pkgmod.installPackage;
    const uimod = await import('../compiler/ui-engine.js');
    UIEngine = uimod.UIEngine;
    console.log('[Package] auxiliary modules loaded successfully');
  } catch (e) {
    console.error('[Cross] failed to load auxiliary module', e);
    process.exit(1);
  }
})();

process.env.UNISTACK_ANTLR_WARN = '0';
process.env.NODE_ENV = 'test';

/**
 * english: Test that routes can be parsed in inline form: GET /foo { return py:foo; }
 * french:  Test que les routes peuvent être parsées en forme inline : GET /foo { return py:foo; }
 */
function testInlineRoutes() {
  const src = `unistack app "T" version 1.0 {
  routes:
    GET /foo { return py:foo; }
    POST /bar {
      status 201;
      return js:bar();
    }
}
`;
  const ast = parseUniFile(src, 'test.uni');
  const section = ast.sections.find(s => s.kind === 'routes');
  assert(section, 'english: routes section should exist | french: la section routes devrait exister');
  const routes = (section as any).routes;
  assert(routes.length === 2, 'english: expected two routes | french: deux routes attendues');
  assert(routes[0].body.length === 1, 'english: first route should have 1 statement | french: première route devrait avoir 1 instruction');
  assert(routes[1].body.length === 2, 'english: second route should have 2 statements | french: deuxième route devrait avoir 2 instructions');
  console.log('english: parser inline route test passed | french: test inline route du parser réussi');
}

/**
 * english: Test that header parsing skips leading comments and blank lines
 * french:  Test que l’analyse de l’en-tête ignore les commentaires et lignes vides
 */
function testHeaderWithComments() {
  const src = `;; comment
; another comment

unistack app "T" version 1.0 {
  config: port=3000;
}
`;
  const ast = parseUniFile(src, 'test.uni');
  assert(ast.name === 'T', 'english: header should parse | french: en-tête devrait être parsé');
  console.log('english: header comment test passed | french: test en-tête avec commentaires réussi');
}

/**
 * english: Test that config section with multiple key=value pairs is parsed correctly
 * french:  Test que la section config avec plusieurs paires clé=valeur est parsée correctement
 */
function testConfigParsing() {
  const src = `unistack app "T" version 1.0 {
  config: a=1, b="x", c=true;
}
`;
  const ast = parseUniFile(src, 'test.uni');
  const cfg = ast.config;
  assert(cfg, 'english: config should be parsed | french: config devrait être parsée');
  assert(cfg.entries.length === 3, 'english: config should have 3 entries | french: config devrait avoir 3 entrées');
  console.log('english: config parsing test passed | french: test parsing config réussi');
}

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { buildUniStack } from '../transpiler/index.js';
import { UniStackLanguageServer } from '../lang/lsp.js';
import uniStd from '../stdlib/index.js';
import { installPackage } from '../cli/unipack.js';
import { UIEngine } from '../compiler/ui-engine.js';

/**
 * english: Test that the transpiler can build a UniStack file and generate valid TypeScript
 * french:  Test que le transpileur peut compiler un fichier UniStack et générer du TypeScript valide
 */
async function testTranspilerBuild() {
  const src = `unistack app "T" version 1.0 {
  py-logic:
    def foo():
      return "ok"
  routes:
    GET /foo { return py:foo; }
}`;
  // english: write temporary file for test
  // french:  écrire un fichier temporaire pour le test
  const tmpDir = resolve('src', 'tests', 'tmp');
  await fs.mkdir(tmpDir, { recursive: true });
  const entry = resolve(tmpDir, 'app.uni');
  await fs.writeFile(entry, src, 'utf8');
  await buildUniStack({ entryPath: entry, generatedDir: tmpDir });
  const serverTs = await fs.readFile(resolve(tmpDir, 'app.server.ts'), 'utf8');
  assert(serverTs.includes("app.get('/foo'"), 'english: server.ts should contain route | french: server.ts devrait contenir la route');
  console.log('english: transpiler build test passed | french: test build transpileur réussi');
}

/**
 * english: Test that imports are merged before build
 * french:  Test que les imports sont fusionnés avant le build
 */
async function testImports() {
  const tmpDir = resolve('src', 'tests', 'tmp-imports');
  await fs.mkdir(tmpDir, { recursive: true });
  const child = resolve(tmpDir, 'child.uni');
  const parent = resolve(tmpDir, 'app.uni');
  await fs.writeFile(
    child,
    `unistack app "C" version 1.0 {
  py-logic:
    def title():
      return "Imported"
}`,
    'utf8',
  );
  await fs.writeFile(
    parent,
    `unistack app "P" version 1.0 {
  imports: "child.uni";
  html-ui:
    <h1>{py:title()}</h1>;
}`,
    'utf8',
  );
  await buildUniStack({ entryPath: parent, generatedDir: tmpDir });
  const html = await fs.readFile(resolve(tmpDir, 'index.html'), 'utf8');
  assert(html.includes('data-uniref'), 'english: import build should generate placeholders | french: build import devrait générer des placeholders');
  console.log('english: imports build test passed | french: test build avec imports réussi');
}

// new tests (definitions)
function testLSP() {
  const server = new UniStackLanguageServer();
  const sample = `persist users = {name: "Alice", age: 30};`;
  const completions = server.getCompletions(sample, { line: 0, character: 10 });
  assert(completions.some(c => c.label === 'i32'), 'should suggest primitive i32');
  assert(completions.some(c => c.label === 'name'), 'should suggest persisted field name');
  assert(completions.some(c => c.label === 'http.get'), 'should suggest stdlib http.get');
  const hover = server.getHover('i32', { line: 0, character: 0 });
  assert(hover && hover.contents.toString().includes('primitive'), 'hover should describe type');
  console.log('english: LSP basic completion test passed | french: test basique LSP réussi');
}

function testStdlib() {
  assert(typeof uniStd.http.get === 'function', 'http.get should exist');
  assert(typeof uniStd.UI.render === 'function', 'UI.render should exist');
  assert(typeof uniStd.FS.readFile === 'function', 'FS.readFile should exist');
  console.log('english: stdlib structure test passed | french: test bibliothèque standard réussi');
}

async function testUniPack() {
  const tmpName = 'dummy_pkg';
  await installPackage(tmpName, 'web');
  const exists = await uniStd.FS.exists('unistack_packages/' + tmpName);
  assert(exists, 'package should be installed');
  console.log('english: unipack install test passed | french: test UniPack réussi');
}

function testUIEngine() {
  const html = '<html><head></head><body>Hello</body></html>';
  const injected = UIEngine.injectDesign(html);
  assert(injected.includes('base.css'), 'design CSS should be injected');
  const css = UIEngine.defaultCss();
  assert(css.includes('--spacing-base'), 'default CSS should include spacing variable');
  console.log('english: UIEngine design injection test passed | french: test UIEngine réussi');
}

/**
 * english: Run all tests in sequence
 * french:  Exécuter tous les tests en séquence
 */
async function runAll() {
  testInlineRoutes();
  testHeaderWithComments();
  testConfigParsing();
  await testTranspilerBuild();
  await testImports();
  // call new tests
  testLSP();
  testStdlib();
  await testUniPack();
  testUIEngine();
}

// english: Execute tests and exit with error code if any test fails
// french:  Exécuter les tests et quitter avec code erreur si un test échoue
runAll()
  .then(() => {
    console.log('english: All tests completed successfully | french: Tous les tests réussis');
  })
  .catch(err => {
    console.error('english: Test suite failed | french: Erreur dans la suite de tests', err);
    process.exit(1);
  });
