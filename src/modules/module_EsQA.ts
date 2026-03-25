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

console.log('starting parser tests');
import assert from 'assert';
import { parseUniFile } from '../parser/uniParser.js';
import { AdvancedCodeGenerator } from '../transpiler/advanced.js';

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

function testStateParsing() {
  const src = `unistack app "T" version 1.0 {
  state:
    counter = 0;
    userName = "Alice";
    flags = { online: true };
}
`;
  const ast = parseUniFile(src, 'test.uni');
  const state = ast.sections.find(s => s.kind === 'state') as any;
  assert(state, 'state section should be parsed');
  assert(state.entries.length === 3, 'state should contain three entries');
  assert(state.entries[0].key === 'counter', 'counter entry should exist');
  console.log('english: state parsing test passed | french: test parsing state réussi');
}

function testComponentsParsing() {
  const src = `unistack app "T" version 1.0 {
  components:
    component PostCard(title, author) => <article><h2>{{title}}</h2><span>{{author}}</span></article>;
  html-ui:
    {render:PostCard("Hello", userName)};
}
`;
  const ast = parseUniFile(src, 'test.uni');
  const html = ast.sections.find(s => s.kind === 'html') as any;
  const textNode = html.blocks[0].nodes.find((n: any) => n.kind === 'htmlText');
  assert(textNode.text.includes('<article>'), 'rendered component should be expanded to HTML');
  assert(textNode.text.includes('data-uni-bind="userName"'), 'identifier arg should become reactive binding');
  console.log('english: components parsing test passed | french: test parsing composants réussi');
}

function testSqlParamsParsing() {
  const src = `unistack app "T" version 1.0 {
  html-ui:
    <p>{sql("SELECT * FROM users WHERE id = ? AND active = ?", userId, true)}</p>;
}`;
  const ast = parseUniFile(src, 'test.uni');
  const html = ast.sections.find(s => s.kind === 'html') as any;
  const expr = html.blocks[0].nodes.find((n: any) => n.kind === 'htmlExpr');
  assert(expr.target.lang === 'sql', 'sql expression should be parsed');
  assert(expr.target.params.length === 2, 'sql params count should be parsed');
  assert(expr.target.params[0].kind === 'identifier', 'first sql param should be identifier');
  assert(expr.target.params[1].kind === 'boolean', 'second sql param should be boolean');
  console.log('english: sql params parsing test passed | french: test parsing params sql réussi');
}

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { buildUniStack } from '../transpiler/index.js';
import { UniStackLanguageServer } from '../lang/lsp.js';
import uniStd from '../stdlib/index.js';
import { installPackage, publishPackage } from '../cli/unipack.js';
import { UIEngine } from '../compiler/ui-engine.js';

/**
 * english: Test that the transpiler can build a UniStack file and generate valid TypeScript
 * french:  Test que le transpileur peut compiler un fichier UniStack et générer du TypeScript valide
 */
async function testTranspilerBuild() {
  const src = `unistack app "T" version 1.0 {
  state:
    counter = 1;
  py-logic:
    def foo():
      return "ok"
  routes:
    GET /foo { return py:foo; }
    GET /users { return sql("SELECT * FROM users WHERE id = ?", id); }
    POST /posts {
      validate title:string:required:min=3:max=200, published:boolean;
      return py:foo();
    }
}`;
  // english: write temporary file for test
  // french:  écrire un fichier temporaire pour le test
  const tmpDir = resolve('src', 'tests', 'tmp');
  await fs.mkdir(tmpDir, { recursive: true });
  const entry = resolve(tmpDir, 'app.uni');
  await fs.writeFile(entry, src, 'utf8');
  await buildUniStack({ entryPath: entry, generatedDir: tmpDir });
  const serverTs = await fs.readFile(resolve(tmpDir, 'app.server.ts'), 'utf8');
  const clientTs = await fs.readFile(resolve(tmpDir, 'app.client.ts'), 'utf8');
  assert(serverTs.includes("app.get('/foo'"), 'english: server.ts should contain route | french: server.ts devrait contenir la route');
  assert(serverTs.includes('runtime.sql("SELECT * FROM users WHERE id = ?", ['), 'server.ts should emit parameterized sql call');
  assert(clientTs.includes('createStateStore'), 'client.ts should include reactive state store');
  assert(serverTs.includes('validation failed: title is required'), 'server.ts should emit route validation');
  console.log('english: transpiler build test passed | french: test build transpileur réussi');
}

/**
 * english: Test that imports are merged before build
 * french:  Test que les imports sont fusionnés avant le build
 */
async function testImports() {
  const tmpDir = resolve('src', 'tests', 'tmp-imports-runtime');
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
  await fs.rm(tmpDir, { recursive: true, force: true });
  console.log('english: imports build test passed | french: test build avec imports réussi');
}

function testAdvancedImportsParsing() {
  const sample = `unistack app "M" version 1.0 {
  imports: {foo, bar as baz} from "mod.uni", "other.uni" as util, * as all from "lib.uni";
}`;
  const ast = parseUniFile(sample, 'test.uni');
  const imports = ast.sections.find(s => s.kind === 'imports') as any;
  assert(imports, 'imports section should exist');
  assert(imports.entries.length === 3, 'should parse three import entries');
  assert(imports.entries[0].path === 'mod.uni');
  assert(Array.isArray(imports.entries[0].names) && imports.entries[0].names!.includes('foo'));
  assert(imports.entries[1].alias === 'util');
  assert(imports.entries[2].alias === 'all');
  console.log('english: advanced imports parsing test passed | french: test parsing imports avancé réussi');
}

async function testConfigValidation() {
  const tmpDir = resolve('src', 'tests', 'tmp-config');
  await fs.mkdir(tmpDir, { recursive: true });
  const configPath = resolve(tmpDir, 'unistack.config.json');
  await fs.writeFile(configPath, JSON.stringify({ entry: 'src/app.uni' }), 'utf8');
  let threw = false;
  try {
    const { readConfig } = await import('../cli.js');
    await readConfig(tmpDir);
  } catch (err) {
    threw = true;
  }
  assert(threw, 'readConfig should throw invalid configuration');
  await fs.rm(tmpDir, { recursive: true, force: true });
  console.log('english: config validation test passed | french: test validation config réussi');
}

async function testGatherImportsHelper() {
  const tmpDir = resolve('src', 'tests', 'tmp-deps');
  await fs.mkdir(tmpDir, { recursive: true });
  const a = resolve(tmpDir, 'a.uni');
  const b = resolve(tmpDir, 'b.uni');
  const c = resolve(tmpDir, 'c.uni');
  await fs.writeFile(a, `unistack app "A" version 1.0 {\n  imports: "b.uni";\n}`, 'utf8');
  await fs.writeFile(b, `unistack app "B" version 1.0 {\n  imports: "c.uni";\n}`, 'utf8');
  await fs.writeFile(c, `unistack app "C" version 1.0 { }`, 'utf8');
  const { gatherImportedFiles } = await import('../cli.js');
  const deps = await gatherImportedFiles(a);
  assert(deps.has(b), 'should collect b.uni');
  assert(deps.has(c), 'should collect c.uni');
  await fs.rm(tmpDir, { recursive: true, force: true });
  console.log('english: gatherImports helper test passed | french: test helper import récursif réussi');
}

async function testValidationGenerator() {
  const gen = new AdvancedCodeGenerator();
  const schema = {
    name: { type: 'string', required: true, min: 1 },
    age: { type: 'number', required: false, min: 0 },
    address: {
      type: 'object',
      required: true,
      properties: {
        street: { type: 'string', required: true },
        zip: { type: 'string', required: true, pattern: '^\\d{5}$' },
      },
    },
    tags: { type: 'array', required: false, items: { type: 'string', required: true } },
  };
  let code = gen.generateValidation();
  // remove TypeScript-specific syntax so we can eval as plain JS
  code = code.replace(/export\s+/g, '');
  // drop type annotations like ": any" or ": Schema" or return types
  code = code.replace(/:\s*[A-Za-z0-9_\[\]{}]+/g, '');
  // remove interface declarations entirely
  code = code.replace(/interface[\s\S]*?\}\s*/g, '');
  const validateFn = eval(code + '\nvalidate');
  assert(validateFn({ name: 'Alice', address: { street: 'Main', zip: '12345' } }, schema));
  assert(!validateFn({ name: '', address: { street: 'Main', zip: '12345' } }, schema));
  assert(!validateFn({ name: 'Bob', address: { street: 'Main', zip: 'ABCDE' } }, schema));
  console.log('english: validation generator test passed | french: test générateur validation réussi');
}

// new tests (definitions)
function testLSP() {
  const server = new UniStackLanguageServer();
  const sample = `persist users = {name: "Alice", age: 30};`;
  const completions = server.getCompletions(sample, { line: 0, character: 10 });
  assert(completions.some((c: { label: string }) => c.label === 'i32'), 'should suggest primitive i32');
  assert(completions.some((c: { label: string }) => c.label === 'name'), 'should suggest persisted field name');
  assert(completions.some((c: { label: string }) => c.label === 'http.get'), 'should suggest stdlib http.get');
  const hover = server.getHover('i32', { line: 0, character: 0 });
  assert(hover && hover.contents.toString().includes('primitive'), 'hover should describe type');
  console.log('english: LSP basic completion test passed | french: test basique LSP réussi');
}

function testStdlib() {
  assert(typeof uniStd.http.get === 'function', 'http.get should exist');
  assert(typeof uniStd.UI.render === 'function', 'UI.render should exist');
  assert(typeof uniStd.Animation.class === 'function', 'Animation.class should exist');
  assert(typeof uniStd.FS.readFile === 'function', 'FS.readFile should exist');
  console.log('english: stdlib structure test passed | french: test bibliothèque standard réussi');
}

async function testUniPack() {
  const tmpName = 'dummy_pkg';
  await fs.rm(resolve('unistack_packages', tmpName), { recursive: true, force: true });
  await fs.rm(resolve('unistack_modules', tmpName), { recursive: true, force: true });
  const pkgSrc = resolve('src', 'tests', 'tmp', tmpName);
  await fs.mkdir(pkgSrc, { recursive: true });
  await fs.writeFile(
    resolve(pkgSrc, 'unistack.package.json'),
    JSON.stringify({ name: tmpName, version: '1.0.0', main: 'app.uni' }, null, 2),
    'utf8',
  );
  await fs.writeFile(resolve(pkgSrc, 'app.uni'), 'unistack app "pkg" version 1.0 { }', 'utf8');
  await publishPackage(pkgSrc);
  await installPackage(`${tmpName}@1.0.0`, 'web');
  const exists = await uniStd.FS.exists(`unistack_modules/${tmpName}/app.uni`);
  assert(exists, 'package should be installed in unistack_modules');
  await fs.rm(resolve('unistack_packages', tmpName), { recursive: true, force: true });
  await fs.rm(resolve('unistack_modules', tmpName), { recursive: true, force: true });
  console.log('english: unipack install test passed | french: test UniPack réussi');
}

function testUIEngine() {
  const html = '<html><head></head><body>Hello</body></html>';
  const injected = UIEngine.injectDesign(html);
  assert(injected.includes('base.css'), 'design CSS should be injected');
  assert(injected.includes('UniStackTheme'), 'runtime theme script should be injected');
  const css = UIEngine.defaultCss();
  assert(css.includes('--spacing-base'), 'default CSS should include spacing variable');
  assert(css.includes('@keyframes uniFloat'), 'default CSS should include animation keyframes');
  assert(css.includes('prefers-reduced-motion'), 'default CSS should include reduced motion fallback');
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
  testStateParsing();
  testComponentsParsing();
  testSqlParamsParsing();
  await testTranspilerBuild();
  await testImports();
  testAdvancedImportsParsing();
  await testConfigValidation();
  await testGatherImportsHelper();
  await testValidationGenerator();
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
