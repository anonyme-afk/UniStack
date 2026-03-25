const { parseUniFile } = require('../dist/parser/uniParser.js');
const src = `unistack app "T" version 1.0 {\n  env {\n    PORT: optional number default=1234;\n    SECRET: required string;\n  }\n}`;
console.log('source:', src);
try {
  const ast = parseUniFile(src, 'test.uni');
  console.log('AST:', JSON.stringify(ast, null, 2));
} catch (e) {
  console.error('parse error', e);
}
