import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

const dir = resolve('src', 'parser', 'generated');
const files = await fs.readdir(dir);

const targets = files.filter(f => f.endsWith('.ts'));
for (const file of targets) {
  const path = resolve(dir, file);
  let text = await fs.readFile(path, 'utf8');

  text = text.replace(/from "antlr4ts\/([^"]+)"/g, 'from "antlr4ts/$1.js"');
  text = text.replace(/from '\.\/(UniStack[^']+)'/g, "from './$1.js'");

  await fs.writeFile(path, text, 'utf8');
}
