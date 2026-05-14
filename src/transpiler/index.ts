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
import { dirname, resolve, posix } from 'node:path';
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
  EnvSection,
  EnvVarDef,
  RouteValidateRule,
  RouteFileStmt,
  MiddlewareSection,
  WsRoutesSection,
  WsRouteDef,
  StateSection,
  DbSection,
  BackendRouteIR,
} from '../lang/ast.js';
import { parseUniFile } from '../parser/uniParser.js';
import { parseUniFileAntlr } from '../parser/uniAntlrParser.js';
import { styleToCss } from '../stdlib/style.js';
import { FfiCompiler } from '../compiler/ffi.js';
import { UIEngine } from '../compiler/ui-engine.js';

/**
 * english: High-level entry point of the UniStack transpiler.
 * french:  Point d’entrée haut niveau du transpileur UniStack.
 */
export interface BuildOptions {
  entryPath: string;
  generatedDir: string;
}

export async function buildUniStack(options: BuildOptions): Promise<CompilationIR> {
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
  return ir;
}

function buildIR(ast: UniFile): CompilationIR {
  const frontend = buildFrontendIR(ast);
  const backend = buildBackendIR(ast);
  const assets = buildAssetsIR(ast);
  const state = buildStateIR(ast);
  const pyBindings = collectPyBindings(ast);
  const pySource = collectPySource(ast);
  const ffiSource = collectFfiSource(ast);

  validateAst(ast, pyBindings);

  return { frontend, backend, assets, state, pyBindings, pySource, ffiSource };
}

function buildFrontendIR(ast: UniFile): FrontendIR {
  const htmlSections = ast.sections.filter((s): s is HtmlSection => s.kind === 'html');
  const cssSections = ast.sections.filter((s): s is CssSection => s.kind === 'css');
  const styleSections = ast.sections.filter((s): s is StyleSection => s.kind === 'style');

  let placeholderId = 0;
  const placeholders: FrontendIR['placeholders'] = [];

  const html = htmlSections
    .flatMap(section => section.blocks)
    .flatMap(block => block.nodes)
    .map(node => {
      if (node.kind === 'htmlText') return node.text;
      const id = `uniref_${placeholderId++}`;
      placeholders.push({
        id,
        ref: node.target,
        label: formatLangRef(node.target),
      });
      const fallbackText = escapeHtml(formatFallbackText(node.target));
      return `<span data-uniref="${id}" data-uniref-fallback="${fallbackText}"></span>`;
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
  const routeSections = ast.sections.filter((s): s is RouteSection => s.kind === 'routes');
  const middlewareSection = ast.sections.find((s): s is MiddlewareSection => s.kind === 'middleware');
  const wsSections = ast.sections.filter((s): s is WsRoutesSection => s.kind === 'wsRoutes');
  const envSection = ast.sections.find((s): s is EnvSection => s.kind === 'env');
  const dbSection = ast.sections.find((s): s is DbSection => s.kind === 'db');

  const routes = routeSections.flatMap(section => section.routes).map(r => {
    const returnStmt = r.body.find(stmt => stmt.kind === 'return');
    const statusStmt = [...r.body].reverse().find(stmt => stmt.kind === 'status') as any;
    const validators = r.body
      .filter((stmt): stmt is any => stmt.kind === 'validate')
      .flatMap(stmt => stmt.rules);
    const fileStmt = r.body.find((stmt): stmt is RouteFileStmt => stmt.kind === 'file');
    if (!returnStmt) {
      throw new Error(`route ${r.method} ${r.path} must contain a return statement.`);
    }
    return {
      method: r.method,
      path: r.path,
      handler: returnStmt.expr,
      validators,
      fileUpload: fileStmt ? {
        field: fileStmt.field,
        accept: fileStmt.accept,
        maxSizeBytes: fileStmt.maxSizeBytes,
      } : undefined,
      status: statusStmt?.code,
    };
  });

  const middleware = middlewareSection ? {
    auth: middlewareSection.auth,
    cors: middlewareSection.cors,
    rateLimit: middlewareSection.rateLimit
  } : {
    auth: { enabled: false, excludes: [], header: 'authorization', handler: null },
    cors: { enabled: false, origins: [], methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] },
    rateLimit: { enabled: false, max: 120, windowMs: 60_000 },
  };

  return {
    routes,
    wsRoutes: wsSections.flatMap(s => s.routes),
    middleware,
    env: envSection?.vars,
    dbSchema: dbSection
  };
}

function buildAssetsIR(ast: UniFile): AssetsIR {
  const jsSections = ast.sections.filter((s): s is JsSection => s.kind === 'js');
  return { clientEntry: jsSections.flatMap(s => s.chunks).map(c => c.code).join('\n') };
}

function buildStateIR(ast: UniFile): CompilationIR['state'] {
  const sections = ast.sections.filter((s): s is StateSection => s.kind === 'state');
  return sections.flatMap(s => s.entries);
}

async function emitGeneratedFiles(ir: CompilationIR, generatedDir: string, devMode: boolean = false): Promise<void> {
  const outDir = resolve(generatedDir);
  await fs.mkdir(outDir, { recursive: true });
  await fs.mkdir(resolve(outDir, 'assets'), { recursive: true });

  await Promise.all([
    fs.writeFile(resolve(outDir, 'app.server.ts'), generateServerTs(ir), 'utf8'),
    fs.writeFile(resolve(outDir, 'app.edge.ts'), generateEdgeTs(ir), 'utf8'),
    fs.writeFile(resolve(outDir, 'app.client.ts'), generateClientTs(ir), 'utf8'),
    fs.writeFile(resolve(outDir, 'index.html'), generateIndexHtml(ir, devMode), 'utf8'),
    fs.writeFile(resolve(outDir, 'app.py'), generatePythonModule(ir), 'utf8'),
    fs.writeFile(resolve(outDir, 'schema.json'), JSON.stringify(ir.backend.dbSchema ?? {}, null, 2), 'utf8'),
  ]);
}

function generateServerTs(ir: CompilationIR): string {
  // logic extracted from module_Ro8G.ts
  return `// UniStack Server Generation Logic\n`; 
}

function generateEdgeTs(ir: CompilationIR): string {
  return `// UniStack Edge Generation Logic\n`;
}

function generateClientTs(ir: CompilationIR): string {
  return `// UniStack Client Generation Logic\n`;
}

function generateIndexHtml(ir: CompilationIR, devMode: boolean): string {
  return `<!DOCTYPE html>\n<html>\n<body>${ir.frontend.html}</body>\n</html>`;
}

function generatePythonModule(ir: CompilationIR): string {
  return ir.pySource;
}

function collectPyBindings(ast: UniFile): PyBinding[] {
  // ...
  return [];
}

function collectPySource(ast: UniFile): string {
  const pySections = ast.sections.filter((s): s is any => s.kind === 'py');
  return pySections.flatMap(s => s.chunks).map(c => c.code).join('\n').trim();
}

function collectFfiSource(ast: UniFile): string {
  const ffiSections = ast.sections.filter((s): s is any => s.kind === 'ffi');
  return ffiSections.flatMap(s => s.lines).join('\n').trim();
}

async function loadWithImports(base: UniFile, entryPath: string, useAntlr: boolean): Promise<UniFile> {
  const visited = new Set<string>();
  const dir = dirname(entryPath);
  const load = async (filePath: string): Promise<UniFile> => {
    const abs = resolve(dir, filePath);
    if (visited.has(abs)) return { type: 'app', name: base.name, version: base.version, config: null, sections: [] };
    visited.add(abs);
    const src = await fs.readFile(abs, 'utf8');
    const ast = useAntlr ? parseUniFileAntlr(src, abs) : parseUniFile(src, abs);
    const imports = ast.sections.filter(s => s.kind === 'imports') as any[];
    const importEntries = imports.flatMap(i => i.entries || []);
    const childSections = [];
    for (const ie of importEntries) {
      const childAst = await load(ie.path);
      childSections.push(...childAst.sections.filter(s => s.kind !== 'imports'));
    }
    return { ...ast, sections: [...childSections, ...ast.sections.filter(s => s.kind !== 'imports')] };
  };
  return load(entryPath);
}

function validateAst(ast: UniFile, pyBindings: PyBinding[]): void {
  // validation logic
}

function formatLangRef(ref: LangRef): string {
  if (ref.lang === 'sql') return `sql:${ref.query.substring(0, 20)}...`;
  return `${ref.lang}:${ref.name}`;
}
function formatFallbackText(ref: LangRef): string { return "Loading..."; }
function escapeHtml(text: string): string { return text; }
