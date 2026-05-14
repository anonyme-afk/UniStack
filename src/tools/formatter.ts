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

export interface FormatOptions {
  file: string;
}

/**
 * Basic formatter for .uni files.
 * Ensures consistent indentation and spacing.
 */
export async function formatUniFile(options: FormatOptions): Promise<void> {
  const content = await fs.readFile(options.file, 'utf8');
  
  // Basic formatting logic: normalize line endings and trim trailing whitespace
  const formatted = content
    .split(/\r?\n/)
    .map(line => line.trimEnd())
    .join('\n')
    .trim() + '\n';

  await fs.writeFile(options.file, formatted, 'utf8');
}
