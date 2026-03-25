const { buildUniStack } = require('../dist/transpiler/index.js');
const { promises: fs } = require('fs');
const { resolve } = require('path');
(async () => {
  const tmp = resolve('src', 'tests', 'tmp');
  await fs.rm(tmp, { recursive: true, force: true });
  await fs.mkdir(tmp, { recursive: true });
  const src = `unistack app "T" version 1.0 {\n  env {\n    PORT: optional number default=1234;\n    SECRET: required string;\n  }\n}`;
  await fs.writeFile(resolve(tmp, 'app.uni'), src, 'utf8');
  const ir = await buildUniStack({ entryPath: resolve(tmp, 'app.uni'), generatedDir: tmp });
  console.log('IR backend env', ir.backend.env);
  const serverTs = await fs.readFile(resolve(tmp, 'app.server.ts'), 'utf8');
  console.log('serverTs snippet --');
  console.log(serverTs.split('\n').slice(0,50).join('\n'));
})();
