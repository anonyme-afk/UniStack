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
import { parseUniFile } from '../parser/uniParser.js';

export interface VisualizerOptions {
  file: string;
  outputDir: string;
}

/**
 * Visualizer tool for UniStack code.
 * Generates an interactive HTML representation of the AST.
 */
export async function visualizeUniFile(options: VisualizerOptions): Promise<string> {
  const source = await fs.readFile(options.file, 'utf8');
  const ast = parseUniFile(source, options.file);
  
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>UniStack Visualizer - ${ast.name}</title>
  <style>
    body { font-family: 'Inter', sans-serif; background: #0f172a; color: #f1f5f9; padding: 40px; }
    .container { max-width: 1000px; margin: 0 auto; }
    .header { border-bottom: 2px solid #334155; padding-bottom: 20px; margin-bottom: 40px; }
    .header h1 { color: #8b5cf6; margin: 0; }
    .section-card { background: #1e293b; border-radius: 12px; padding: 24px; margin-bottom: 24px; border-left: 4px solid #8b5cf6; }
    .section-kind { text-transform: uppercase; font-size: 0.75rem; letter-spacing: 0.1em; color: #94a3b8; font-weight: 800; }
    .section-title { font-size: 1.5rem; margin: 8px 0; }
    pre { background: #0b0f1a; padding: 16px; border-radius: 8px; overflow-x: auto; color: #38bdf8; font-size: 0.875rem; }
    .stat-badge { display: inline-block; padding: 4px 12px; background: #334155; border-radius: 999px; font-size: 0.75rem; margin-right: 8px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>UniStack Visualizer</h1>
      <p>Project: <strong>${ast.name}</strong> (v${ast.version})</p>
    </div>

    <div class="summary">
      <span class="stat-badge">${ast.sections.length} Sections</span>
      <span class="stat-badge">${source.length} Bytes</span>
    </div>

    <div class="sections">
      ${ast.sections.map(section => `
        <div class="section-card">
          <div class="section-kind">${section.kind}</div>
          <div class="section-title">Section Analysis</div>
          <pre>${JSON.stringify(section, (k, v) => k === 'code' || k === 'text' ? (v.length > 100 ? v.slice(0, 100) + '...' : v) : v, 2)}</pre>
        </div>
      `).join('')}
    </div>
  </div>
</body>
</html>
  `;

  const outputPath = resolve(options.outputDir, 'viz.html');
  await fs.mkdir(options.outputDir, { recursive: true });
  await fs.writeFile(outputPath, html, 'utf8');
  return outputPath;
}
