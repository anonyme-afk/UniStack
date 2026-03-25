/*
Copyright 2026 The Developers

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
import { dirname, resolve } from 'node:path';
import type {
  CompilationIR,
  UniFile,
  FrontendIR,
  BackendIR,
  AssetsIR,
  RouteSection,
  HtmlSection,
  CssSection,
  JsSection,
} from '../lang/ast.js';
import { parseUniFile } from '../parser/uniParser.js';

/**
 * english: High-level entry point of the UniStack transpiler.
 *          For the MVP, the parser and semantic checker are minimal; we focus on structure.
 * french:  Point d’entrée haut niveau du transpileur UniStack.
 *          Pour le MVP, le parser et le semantic checker sont simplifiés : on se concentre sur la structure.
 */
export interface BuildOptions {
  entryPath: string;
  generatedDir: string;
}

export async function buildUniStack(options: BuildOptions): Promise<void> {
  const uniSource = await fs.readFile(options.entryPath, 'utf8');
  const ast = parseUniFile(uniSource, options.entryPath);
  const ir = buildIR(ast);
  await emitGeneratedFiles(ir, options.generatedDir);
}

// english: ----- IR -----
// french:  ----- IR -----

function buildIR(ast: UniFile): CompilationIR {
  const frontend = buildFrontendIR(ast);
  const backend = buildBackendIR(ast);
  const assets = buildAssetsIR(ast);

  return { frontend, backend, assets };
}

function buildFrontendIR(ast: UniFile): FrontendIR {
  const htmlSections = ast.sections.filter(
    (s): s is HtmlSection => s.kind === 'html',
  );
  const cssSections = ast.sections.filter(
    (s): s is CssSection => s.kind === 'css',
  );

  const html = htmlSections
    .flatMap(section => section.blocks)
    .flatMap(block => block.nodes)
    .map(node => {
      if (node.kind === 'htmlText') {
        return node.text;
      }
      // english: Simple placeholder for the MVP; we replace it with a span and data-key.
      // french:  Placeholder simple pour le MVP ; on remplace par un span avec data-key.
      return '<span data-uniref="TODO"></span>';
    })
    .join('');

  const css = cssSections.flatMap(s => s.chunks).join('\n');

  return {
    html,
    css,
    placeholders: [],
  };
}

function buildBackendIR(ast: UniFile): BackendIR {
  const routeSections = ast.sections.filter(
    (s): s is RouteSection => s.kind === 'routes',
  );

  const routes = routeSections.flatMap(section => section.routes).map(r => ({
    method: r.method,
    path: r.path,
    handler:
      r.body.find(stmt => stmt.kind === 'return')?.expr ??
      // Fallback arbitraire pour le MVP
      ({
        lang: 'py',
        name: 'notImplemented',
        args: [],
      } as any),
  }));

  return { routes };
}

function buildAssetsIR(ast: UniFile): AssetsIR {
  const jsSections = ast.sections.filter(
    (s): s is JsSection => s.kind === 'js',
  );

  const clientEntry = jsSections.flatMap(s => s.chunks).map(c => c.code).join('\n');

  return { clientEntry };
}

// english: ----- TS/HTML file generation -----
// french:  ----- génération de fichiers TS/HTML -----

async function emitGeneratedFiles(ir: CompilationIR, generatedDir: string): Promise<void> {
  const outDir = resolve(generatedDir);
  await fs.mkdir(outDir, { recursive: true });

  const serverPath = resolve(outDir, 'app.server.ts');
  const clientPath = resolve(outDir, 'app.client.ts');
  const htmlPath = resolve(outDir, 'index.html');

  await Promise.all([
    fs.writeFile(serverPath, generateServerTs(ir), 'utf8'),
    fs.writeFile(clientPath, generateClientTs(ir), 'utf8'),
    fs.writeFile(htmlPath, generateIndexHtml(ir), 'utf8'),
  ]);
}

function generateServerTs(ir: CompilationIR): string {
  const routeLines = ir.backend.routes
    .map(route => {
      const method = route.method.toLowerCase();
      return `app.${method}('${route.path}', async (req, res) => {
  const data = await runtime.callPy('${'name' in route.handler ? route.handler.name : 'notImplemented'}');
  res.json(data);
});`;
    })
    .join('\n\n');

  return `import express from 'express';
import type { UniRuntime } from '../runtime/server.js';

export function createServer(runtime: UniRuntime) {
  const app = express();

${routeLines}

  return app;
}
`;
}

function generateClientTs(ir: CompilationIR): string {
  const userCode = ir.assets.clientEntry || 'console.log("UniStack client ready (stub)");';

  return `${userCode}

// english: UniStack client bootstrap (MVP)
// french:  Bootstrap client UniStack (MVP)
export function bootstrap() {
  // english: Nothing special yet: user code runs on load.
  // french:  Rien de spécial pour le moment : le code utilisateur s’exécute au chargement.
}
`;
}

function generateIndexHtml(ir: CompilationIR): string {
  const html = ir.frontend.html || '<div class="app"><h1>UniStack</h1></div>';
  const css = ir.frontend.css || '.app { font-family: Arial, sans-serif; padding: 20px; }';

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>UniStack App</title>
    <style>
${css}
    </style>
  </head>
  <body>
${html}
    <script type="module" src="./app.js"></script>
  </body>
</html>
`;
}
