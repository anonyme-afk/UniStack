import assert from 'assert';
import { parseUniFile } from '../parser/uniParser.js';

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
  assert(section, 'routes section should exist');
  const routes = (section as any).routes;
  assert(routes.length === 2, 'expected two routes');
  assert(routes[0].body.length === 1);
  assert(routes[1].body.length === 2);
  console.log('parser inline route test passed');
}

function testConfigParsing() {
  const src = `unistack app "T" version 1.0 {
  config: a=1, b="x", c=true;
}
`;
  const ast = parseUniFile(src, 'test.uni');
  const cfg = ast.config;
  assert(cfg, 'config should be parsed');
  assert(cfg.entries.length === 3);
  console.log('config parsing test passed');
}

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { buildUniStack } from '../transpiler/index.js';

async function testTranspilerBuild() {
  const src = `unistack app "T" version 1.0 {
  routes:
    GET /foo { return py:foo; }
}`;
  // write temporary file
  const tmpDir = resolve('src', 'tests', 'tmp');
  await fs.mkdir(tmpDir, { recursive: true });
  const entry = resolve(tmpDir, 'app.uni');
  await fs.writeFile(entry, src, 'utf8');
  await buildUniStack({ entryPath: entry, generatedDir: tmpDir });
  const serverTs = await fs.readFile(resolve(tmpDir, 'app.server.ts'), 'utf8');
  assert(serverTs.includes("app.get('/foo'"), 'server.ts should contain route');
  console.log('transpiler build test passed');
}

async function runAll() {
  testInlineRoutes();
  testConfigParsing();
  await testTranspilerBuild();
}

runAll().catch(err => {
  console.error(err);
  process.exit(1);
});
