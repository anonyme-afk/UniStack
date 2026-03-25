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

export interface LintIssue {
  line: number;
  message: string;
}

export interface LintOptions {
  file: string;
}

export async function lintUniFile(options: LintOptions): Promise<LintIssue[]> {
  const path = resolve(options.file);
  const src = await fs.readFile(path, 'utf8');
  const lines = src.split(/\r?\n/);
  const issues: LintIssue[] = [];

  if (!lines[0]?.includes('unistack app')) {
    issues.push({ line: 1, message: 'Missing or invalid header.' });
  }

  let inConfig = false;
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    if (/^(imports|config|html-ui|css|py-logic|js-events|routes)\s*:/.test(line)) {
      inConfig = line.startsWith('config');
      if (inConfig && !line.endsWith(';') && !lines[i + 1]?.trim().endsWith(';')) {
        issues.push({ line: i + 1, message: 'Config section should end with a semicolon.' });
      }
      continue;
    }

    if (inConfig && line.endsWith(';')) {
      inConfig = false;
    }
  }

  return issues;
}
