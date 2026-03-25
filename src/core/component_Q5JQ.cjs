const { parseUniFile } = require('../dist/parser/uniParser.js');
const src = `unistack app "T" version 1.0 {\n  env {\n    PORT: optional number default=1234;\n    SECRET: required string;\n  }\n}`;
const ast = parseUniFile(src, 'test.uni');
console.log(JSON.stringify(ast.sections, null, 2));
