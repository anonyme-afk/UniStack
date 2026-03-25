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

function runAll() {
  testInlineRoutes();
  testConfigParsing();
}

runAll();
