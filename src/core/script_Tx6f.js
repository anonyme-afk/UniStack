import { promises as fs } from 'node:fs';
import { parseUniFile } from './dist/parser/uniParser.js';

function collectSections(lines) {
  const sections = [];
  let current = null;
  const startRegex = /^(config|html-ui|css|py-logic|js-events|routes)\s*:/;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      continue;
    }

    const startMatch = line.match(startRegex);
    if (startMatch) {
      if (current) {
        sections.push(current);
      }
      current = { kind: startMatch[1], lines: [] };
      const rest = line.slice(startMatch[0].length).trim();
      if (rest) {
        current.lines.push(rest);
      }
      continue;
    }

    if (current) {
      if (line.trim() === '}') {
        break;
      }
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }
  return sections;
}

(async()=>{
  const src = await fs.readFile('src/app.uni','utf8');
  const lines = src.split(/\r?\n/);
  console.log('lines:', lines);
  const rawSections = collectSections(lines.slice(1));
  console.log('rawSections:', JSON.stringify(rawSections, null, 2));

  const ast = parseUniFile(src,'src/app.uni');
  console.log('ast:', JSON.stringify(ast, null, 2));
})();
