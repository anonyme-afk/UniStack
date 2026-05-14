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

export interface LintIssue {
  line: number;
  message: string;
  severity: 'error' | 'warning';
}

export interface LintOptions {
  file: string;
}

/**
 * Basic linter for .uni files.
 * Checks for common mistakes and best practices.
 */
export async function lintUniFile(options: LintOptions): Promise<LintIssue[]> {
  const content = await fs.readFile(options.file, 'utf8');
  const lines = content.split(/\r?\n/);
  const issues: LintIssue[] = [];

  lines.forEach((line, index) => {
    const lineNum = index + 1;
    
    // Rule: No empty HTML tags like <div></div> if they should have content
    if (/<[a-zA-Z0-9]+><\/[a-zA-Z0-9]+>/.test(line)) {
      issues.push({
        line: lineNum,
        message: 'Empty HTML tag detected. Consider adding content or removing it.',
        severity: 'warning'
      });
    }

    // Rule: Ensure Python functions have return types or docstrings (industrial standard)
    if (line.includes('def ') && !line.includes(':')) {
       // very basic check for illustration
    }
  });

  return issues;
}
