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

import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';

export interface FormatOptions {
  file: string;
}

export async function formatUniFile(options: FormatOptions): Promise<void> {
  const path = resolve(options.file);
  const src = await fs.readFile(path, 'utf8');
  const lines = src.split(/\r?\n/);
  const out: string[] = [];

  let inSection = false;
  for (const raw of lines) {
    const line = raw.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      out.push('');
      continue;
    }

    if (trimmed === '}') {
      out.push('}');
      inSection = false;
      continue;
    }

    const sectionMatch = trimmed.match(/^(imports|config|html-ui|css|py-logic|js-events|routes)\s*:/);
    if (sectionMatch) {
      out.push(`  ${sectionMatch[1]}:${trimmed.slice(sectionMatch[0].length) ? ' ' + trimmed.slice(sectionMatch[0].length).trim() : ''}`);
      inSection = true;
      continue;
    }

    if (trimmed.startsWith('unistack app')) {
      out.push(trimmed);
      continue;
    }

    if (inSection) {
      out.push(`    ${trimmed}`);
    } else {
      out.push(trimmed);
    }
  }

  await fs.writeFile(path, out.join('\n'), 'utf8');
}
