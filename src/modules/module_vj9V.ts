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
  StyleSection,
  JsSection,
  Expr,
  LangRef,
  PyBinding,
  Section,
  ConfigSection,
} from '../lang/ast.js';
import { parseUniFile } from '../parser/uniParser.js';
import { parseUniFileAntlr } from '../parser/uniAntlrParser.js';
import { styleToCss } from '../stdlib/style.js';

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
  const useAntlr = process.env.UNISTACK_PARSER === 'antlr';
  let baseAst: UniFile;
  if (useAntlr) {
    try {
      baseAst = parseUniFileAntlr(uniSource, options.entryPath);
    } catch (err) {
      if (process.env.UNISTACK_ANTLR_WARN !== '0' && process.env.NODE_ENV !== 'test') {
        console.warn(
          'english: ANTLR parser failed, falling back to manual parser. ' +
            'french: Parser ANTLR échoué, retour au parser manuel.',
          err,
        );
      }
      baseAst = parseUniFile(uniSource, options.entryPath);
    }
  } else {
    baseAst = parseUniFile(uniSource, options.entryPath);
  }
  const ast = await loadWithImports(baseAst, options.entryPath, useAntlr);
  const ir = buildIR(ast);
  await emitGeneratedFiles(ir, options.generatedDir);
}

// english: ----- IR -----
// french:  ----- IR -----

function buildIR(ast: UniFile): CompilationIR {
  const frontend = buildFrontendIR(ast);
  const backend = buildBackendIR(ast);
  const assets = buildAssetsIR(ast);
  const pyBindings = collectPyBindings(ast);
  const pySource = collectPySource(ast);

  validateAst(ast, pyBindings);

  return { frontend, backend, assets, pyBindings, pySource };
}

function buildFrontendIR(ast: UniFile): FrontendIR {
  const htmlSections = ast.sections.filter(
    (s): s is HtmlSection => s.kind === 'html',
  );
  const cssSections = ast.sections.filter(
    (s): s is CssSection => s.kind === 'css',
  );
  const styleSections = ast.sections.filter(
    (s): s is StyleSection => s.kind === 'style',
  );

  let placeholderId = 0;
  const placeholders: FrontendIR['placeholders'] = [];

  const html = htmlSections
    .flatMap(section => section.blocks)
    .flatMap(block => block.nodes)
    .map(node => {
      if (node.kind === 'htmlText') {
        return node.text;
      }
      // english: Replace expressions with a span placeholder and register it.
      // french:  Remplacer les expressions par un placeholder span et l’enregistrer.
      const id = `uniref_${placeholderId++}`;
      placeholders.push({
        id,
        ref: node.target,
        label: formatLangRef(node.target),
      });
      return `<span data-uniref="${id}"></span>`;
    })
    .join('');

  const css = cssSections.flatMap(s => s.chunks).join('\n');
  const styleCss = styleSections.length > 0 ? '\n' + styleToCss(styleSections.flatMap(s => s.lines)) : '';

  return {
    html,
    css: css + styleCss,
    placeholders,
  };
}

function buildBackendIR(ast: UniFile): BackendIR {
  const routeSections = ast.sections.filter(
    (s): s is RouteSection => s.kind === 'routes',
  );

  const routes = routeSections.flatMap(section => section.routes).map(r => {
    const returnStmt = r.body.find(stmt => stmt.kind === 'return');
    const statusStmt = [...r.body].reverse().find(stmt => stmt.kind === 'status');
    return {
      method: r.method,
      path: r.path,
      handler:
        returnStmt?.expr ??
        // Fallback arbitraire pour le MVP
        ({
          lang: 'py',
          name: 'notImplemented',
          args: [],
        } as any),
      status: statusStmt?.code,
    };
  });

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

  // english: Create assets directory for design system and other static files
  // french:  Créer le répertoire assets pour le système de design et autres fichiers statiques
  const assetsDir = resolve(outDir, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });

  const serverPath = resolve(outDir, 'app.server.ts');
  const clientPath = resolve(outDir, 'app.client.ts');
  const htmlPath = resolve(outDir, 'index.html');
  const pyPath = resolve(outDir, 'app.py');

  // english: Copy base.css design system from src/assets/base.css
  // french:  Copier le système de design base.css depuis src/assets/base.css
  const basecssSrcPath = resolve(dirname(dirname(outDir)), 'src', 'assets', 'base.css');
  const basecssDestPath = resolve(assetsDir, 'base.css');

  await Promise.all([
    fs.writeFile(serverPath, generateServerTs(ir), 'utf8'),
    fs.writeFile(clientPath, generateClientTs(ir), 'utf8'),
    fs.writeFile(htmlPath, generateIndexHtml(ir), 'utf8'),
    fs.writeFile(pyPath, generatePythonModule(ir), 'utf8'),
    fs.copyFile(basecssSrcPath, basecssDestPath).catch(() => {
      // english: If base.css doesn't exist, continue gracefully
      // french:  Si base.css n'existe pas, continuer gracieusement
    }),
  ]);
}

function generateServerTs(ir: CompilationIR): string {
  const pyBindings = JSON.stringify(ir.pyBindings);
  const notFoundHtml = JSON.stringify(`<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>404 — UniStack</title>
    <style>
      body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; }
      .wrap { min-height: 100vh; display: grid; place-items: center; padding: 40px; }
      .card { max-width: 560px; text-align: center; }
      .card h1 { font-size: 48px; margin: 0 0 10px; }
      .card p { color: #bdbdbd; }
      .card a { color: #20b7e8; text-decoration: none; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <div class="card">
        <h1>404</h1>
        <p>Page not found.</p>
        <p><a href="/">Back to home</a></p>
      </div>
    </div>
  </body>
</html>`);
  const routeLines = ir.backend.routes
    .map(route => {
      const method = route.method.toLowerCase();
      const statusLine = route.status ? `  res.status(${route.status});\n` : '';
      const handler = route.handler;
      const handlerCode = emitRouteHandlerCall(handler);
      return `app.${method}('${route.path}', async (req, res) => {
  try {
${statusLine}${handlerCode}
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    res.status(500).json({ error: message });
  }
});`;
    })
    .join('\n\n');

  return `import express from 'express';
import type { UniRuntime } from '../runtime/server.js';
import { DataSet } from '../runtime/data.js';

export function createServer(runtime: UniRuntime) {
  const app = express();
  app.use(express.json());
  app.use('/assets', express.static('assets'));
  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
  });
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  const pyBindings = ${pyBindings};
  const notFoundHtml = ${notFoundHtml};
  for (const binding of pyBindings) {
    if (binding.kind === 'sql') {
      runtime.registerPy(binding.name, async () => runtime.sql(binding.value));
    } else {
      runtime.registerPy(binding.name, () => binding.value.value);
    }
  }

  app.post('/__unistack/py/:name', async (req, res) => {
    try {
      const name = req.params.name;
      const rawArgs = Array.isArray(req.body?.args) ? req.body.args : [];
      const args = rawArgs.map(arg => {
        if (arg && typeof arg === 'object' && 'kind' in arg) {
          if (arg.kind === 'identifier') {
            return req.body?.context?.[arg.name] ?? null;
          }
          return arg.value;
        }
        return arg;
      });
      const data = await runtime.callPy(name, ...args);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  app.post('/__unistack/sql', async (req, res) => {
    try {
      const query = req.body?.query;
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'invalid sql query' });
        return;
      }
      const data = await runtime.sql(query);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

${routeLines}

  app.use((req, res) => {
    res.status(404).send(notFoundHtml);
  });

  return app;
}
`;
}

function emitRouteHandlerCall(handler: LangRef): string {
  if (handler.lang === 'sql') {
    return `  const data = await runtime.sql(${JSON.stringify(handler.query)});
  res.json(data);`;
  }
  if (handler.lang === 'js') {
    return `  res.status(501).json({ error: 'js handler not supported on server (yet)' });`;
  }

  const args = handler.args ?? [];
  const argsExpr = args.map(arg => emitArgExpr(arg)).join(', ');
  return `  const data = await runtime.callPy('${handler.name}'${argsExpr ? `, ${argsExpr}` : ''});
  res.json(data);`;
}

function emitArgExpr(arg: Expr): string {
  if (arg.kind === 'string') return JSON.stringify(arg.value);
  if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
  // identifier: prefer body, then query, then params
  return `(req.body?.${arg.name} ?? req.query?.${arg.name} ?? req.params?.${arg.name})`;
}

function generateClientTs(ir: CompilationIR): string {
  const userCode = ir.assets.clientEntry || 'console.log("UniStack client ready (stub)");';
  const placeholders = ir.frontend.placeholders.map(p => {
    if (p.ref.lang === 'sql') {
      return {
        id: p.id,
        lang: 'sql',
        query: p.ref.query,
        label: p.label ?? '',
      };
    }
    return {
      id: p.id,
      lang: p.ref.lang,
      name: p.ref.name,
      args: p.ref.args,
      label: p.label ?? '',
    };
  });

  return `${userCode}

// english: UniStack client bootstrap (MVP)
// french:  Bootstrap client UniStack (MVP)
export function bootstrap() {
  const placeholders = ${JSON.stringify(placeholders)};
  for (const item of placeholders) {
    const el = document.querySelector(\`[data-uniref="\${item.id}"]\`);
    if (!el) continue;
    if (item.lang === 'py') {
      resolvePy(item, el);
    } else if (item.lang === 'sql') {
      resolveSql(item, el);
    } else {
      el.textContent = item.label;
    }
  }
}

bootstrap();

async function resolvePy(item, el) {
  try {
    const res = await fetch(\`/__unistack/py/\${item.name}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ args: item.args ?? [] }),
    });
    const data = await res.json();
    el.textContent = formatValue(data);
  } catch (err) {
    el.textContent = '[error]';
  }
}

async function resolveSql(item, el) {
  try {
    const res = await fetch('/__unistack/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: item.query }),
    });
    const data = await res.json();
    el.textContent = formatValue(data);
  } catch (err) {
    el.textContent = '[error]';
  }
}

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
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
    <link rel="icon" href="/assets/favicon.ico" />
    <link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
    <link rel="icon" type="image/png" sizes="512x512" href="/assets/unistack-icon.png" />
    <link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
    <link rel="apple-touch-icon" sizes="512x512" href="/assets/apple-touch-icon-512.png" />
    <link rel="manifest" href="/assets/site.webmanifest" />
    <link rel="stylesheet" href="/assets/base.css" />
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

function formatLangRef(ref: LangRef): string {
  if (ref.lang === 'sql') {
    return `sql("${ref.query}")`;
  }
  const args = ref.args.map(arg => {
    if (arg.kind === 'string') return `"${arg.value}"`;
    if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
    return arg.name;
  });
  return `${ref.lang}:${ref.name}${args.length ? `(${args.join(', ')})` : ''}`;
}

function generatePythonModule(ir: CompilationIR): string {
  const header = [
    '# Auto-generated by UniStack',
    'def sql(query):',
    '    return []',
    '',
  ].join('\n');

  const body = ir.pySource.trim();
  if (body) {
    return `${header}\n${body}\n`;
  }
  return `${header}\n`;
}

function collectPyBindings(ast: UniFile): PyBinding[] {
  const pySections = ast.sections.filter((s): s is any => s.kind === 'py');
  const code = pySections.flatMap(s => s.chunks).map(c => c.code).join('\n');
  if (!code.trim()) return [];

  const lines = code.split(/\r?\n/);
  const bindings: PyBinding[] = [];

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i].trim();
    if (!line) continue;

    const inlineDef = line.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*:\s*return\s+(.+)$/);
    if (inlineDef) {
      const name = inlineDef[1];
      const valueText = inlineDef[2].replace(/;$/, '').trim();
      const binding = parsePyBindingValue(name, valueText);
      if (binding) bindings.push(binding);
      continue;
    }

    const defMatch = line.match(/^def\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(\s*\)\s*:\s*$/);
    if (defMatch) {
      const name = defMatch[1];
      const next = findNextNonEmpty(lines, i + 1);
      if (next) {
        const returnMatch = next.line.match(/^\s*return\s+(.+)$/);
        if (returnMatch) {
          const valueText = returnMatch[1].replace(/;$/, '').trim();
          const binding = parsePyBindingValue(name, valueText);
          if (binding) bindings.push(binding);
        }
      }
      continue;
    }

    const assignMatch = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*(.+)$/);
    if (assignMatch) {
      const name = assignMatch[1];
      const valueText = assignMatch[2].replace(/;$/, '').trim();
      const binding = parsePyBindingValue(name, valueText);
      if (binding) bindings.push(binding);
    }
  }

  return bindings;
}

function collectPySource(ast: UniFile): string {
  const pySections = ast.sections.filter((s): s is any => s.kind === 'py');
  return pySections.flatMap(s => s.chunks).map(c => c.code).join('\n').trim();
}

async function loadWithImports(base: UniFile, entryPath: string, useAntlr: boolean): Promise<UniFile> {
  const visited = new Set<string>();
  const dir = dirname(entryPath);

  const load = async (filePath: string): Promise<UniFile> => {
    const abs = resolve(dir, filePath);
    if (visited.has(abs)) {
      return {
        name: base.name,
        version: base.version,
        config: null,
        sections: [],
      };
    }
    visited.add(abs);
    const src = await fs.readFile(abs, 'utf8');
    let ast: UniFile;
    if (useAntlr) {
      try {
        ast = parseUniFileAntlr(src, abs);
      } catch (err) {
        if (process.env.UNISTACK_ANTLR_WARN !== '0' && process.env.NODE_ENV !== 'test') {
          console.warn(
            'english: ANTLR parser failed on import, falling back to manual parser. ' +
              'french: Parser ANTLR échoué sur import, retour au parser manuel.',
            err,
          );
        }
        ast = parseUniFile(src, abs);
      }
    } else {
      ast = parseUniFile(src, abs);
    }
    const imports = ast.sections.filter(s => s.kind === 'imports') as any[];
    const importPaths = imports.flatMap(i => i.paths ?? []);
    const childSections: Section[] = [];
    for (const p of importPaths) {
      const childAst = await load(p);
      childSections.push(...childAst.sections.filter(s => s.kind !== 'imports'));
    }
    const ownSections = ast.sections.filter(s => s.kind !== 'imports');
    return {
      name: ast.name,
      version: ast.version,
      config: ast.config,
      sections: [...childSections, ...ownSections],
    };
  };

  const imports = base.sections.filter(s => s.kind === 'imports') as any[];
  const importPaths = imports.flatMap(i => i.paths ?? []);
  const importedSections: Section[] = [];
  let importedConfig: ConfigSection | null = null;

  for (const p of importPaths) {
    const childAst = await load(p);
    if (childAst.config) {
      if (importedConfig || base.config) {
        throw new Error('UniStack: multiple config sections found across imports.');
      }
      importedConfig = childAst.config;
    }
    importedSections.push(...childAst.sections.filter(s => s.kind !== 'imports'));
  }

  const baseSections = base.sections.filter(s => s.kind !== 'imports');
  const mergedConfig = base.config ?? importedConfig;
  return {
    name: base.name,
    version: base.version,
    config: mergedConfig,
    sections: [...importedSections, ...baseSections],
  };
}

function findNextNonEmpty(lines: string[], start: number): { line: string; index: number } | null {
  for (let i = start; i < lines.length; i += 1) {
    const line = lines[i];
    if (line.trim()) return { line, index: i };
  }
  return null;
}

function parsePyBindingValue(name: string, valueText: string): PyBinding | null {
  const sqlMatch = valueText.match(/^sql\((.+)\)$/);
  if (sqlMatch) {
    const inner = sqlMatch[1].trim();
    const q = parseStringLiteral(inner) ?? inner;
    return { name, kind: 'sql', value: q };
  }

  const lit = parseLiteralValue(valueText);
  if (lit) {
    return { name, kind: 'literal', value: lit };
  }
  return null;
}

function parseLiteralValue(text: string): { kind: 'string' | 'number' | 'boolean'; value: any } | null {
  if (text === 'true' || text === 'false') {
    return { kind: 'boolean', value: text === 'true' };
  }
  if (/^[0-9]+(\.[0-9]+)?$/.test(text)) {
    return { kind: 'number', value: Number(text) };
  }
  const str = parseStringLiteral(text);
  if (str !== null) {
    return { kind: 'string', value: str };
  }
  return null;
}

function parseStringLiteral(text: string): string | null {
  const m1 = text.match(/^"(.*)"$/);
  if (m1) return m1[1];
  const m2 = text.match(/^'(.*)'$/);
  if (m2) return m2[1];
  return null;
}

function validateAst(ast: UniFile, pyBindings: PyBinding[]): void {
  const pyNames = new Set(pyBindings.map(b => b.name));
  const errors: string[] = [];

  for (const section of ast.sections) {
    if (section.kind === 'html') {
      for (const block of section.blocks) {
        for (const node of block.nodes) {
          if (node.kind === 'htmlExpr' && node.target.lang === 'py') {
            if (!pyNames.has(node.target.name)) {
              errors.push(`Unknown py binding in html: ${node.target.name}`);
            }
          }
        }
      }
    }
    if (section.kind === 'routes') {
      for (const route of section.routes) {
        for (const stmt of route.body) {
          if (stmt.kind === 'return' && stmt.expr.lang === 'py') {
            if (!pyNames.has(stmt.expr.name)) {
              errors.push(`Unknown py binding in route ${route.method} ${route.path}: ${stmt.expr.name}`);
            }
          }
        }
      }
    }
  }

  if (errors.length > 0) {
    throw new Error(
      `english: UniStack validation failed:\\n${errors.join('\\n')}` +
        `\\n` +
        `french: Validation UniStack échouée :\\n${errors.join('\\n')}`,
    );
  }
}
