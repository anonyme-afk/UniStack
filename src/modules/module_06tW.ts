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

import assert from 'assert';
import { parseUniFile } from '../parser/uniParser.js';

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

/**
 * english: Test that the transpiler can build a UniStack file and generate valid TypeScript
 * french:  Test que le transpileur peut compiler un fichier UniStack et générer du TypeScript valide
 */
async function testTranspilerBuild() {
  const src = `unistack app "T" version 1.0 {
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
 * english: Run all tests in sequence
 * french:  Exécuter tous les tests en séquence
 */
async function runAll() {
  testInlineRoutes();
  testConfigParsing();
  await testTranspilerBuild();
}

// english: Execute tests and exit with error code if any test fails
// french:  Exécuter les tests et quitter avec code erreur si un test échoue
runAll().catch(err => {
  console.error('english: Test suite failed | french: Erreur dans la suite de tests', err);
  process.exit(1);
});

console.log('english: All tests completed successfully | french: Tous les tests réussis');
