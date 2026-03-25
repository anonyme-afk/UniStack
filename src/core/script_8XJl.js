import { promises as fs } from 'node:fs';
import { parseUniFile } from './dist/parser/uniParser.js';

(async()=>{
  const src = await fs.readFile('src/app.uni','utf8');
  const ast = parseUniFile(src,'src/app.uni');
  console.log(JSON.stringify(ast, null, 2));
})();
