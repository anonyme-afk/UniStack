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

function parseSizeBytes(sizeStr: string): number {
  const s = (sizeStr || '').toLowerCase().trim();
  const match = s.match(/^(\d+)(b|kb|mb|gb)?$/);
  if (!match) return 10 * 1024 * 1024; // default 10mb
  const num = parseInt(match[1], 10);
  const unit = match[2] || 'b';
  if (unit === 'gb') return num * 1024 * 1024 * 1024;
  if (unit === 'mb') return num * 1024 * 1024;
  if (unit === 'kb') return num * 1024;
  return num;
}

// english: ----- IR -----
// french:  ----- IR -----

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
  const routeSections = ast.sections.filter(
    (s): s is RouteSection => s.kind === 'routes',
  );
  const middlewareSection = ast.sections.find(
    (s): s is MiddlewareSection => s.kind === 'middleware',
  );
  const wsSections = ast.sections.filter(
    (s): s is WsRoutesSection => s.kind === 'wsRoutes',
  );
  const envSection = ast.sections.find((s): s is EnvSection => s.kind === 'env');
  const dbSection = ast.sections.find((s): s is DbSection => s.kind === 'db');

  const routes = routeSections.flatMap(section => section.routes).map(r => {
    const returnStmt = r.body.find(stmt => stmt.kind === 'return');
    const statusStmt = [...r.body].reverse().find(stmt => stmt.kind === 'status');
    const validators = r.body
      .filter((stmt): stmt is import('../lang/ast.js').RouteValidateStmt => stmt.kind === 'validate')
      .flatMap(stmt => stmt.rules);
    const fileStmt = r.body.find((stmt): stmt is RouteFileStmt => stmt.kind === 'file');
    if (!returnStmt) {
      throw new Error(
        `english: route ${r.method} ${r.path} must contain a return statement. ` +
          `french: la route ${r.method} ${r.path} doit contenir une instruction return.`,
      );
    }
    return {
      method: r.method,
      path: r.path,
      handler: returnStmt.expr,
      validators,
      fileUpload: fileStmt ?
        {
          field: fileStmt.field,
          accept: fileStmt.accept,
          maxSizeBytes: parseSizeBytes(fileStmt.maxSize),
        } :
        undefined,
      status: statusStmt?.code,
    };
  });

  const defaultMiddleware: BackendIR['middleware'] = {
    auth: { enabled: false, excludes: [], header: 'authorization', handler: null },
    cors: { enabled: false, origins: [], methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'] },
    rateLimit: { enabled: false, max: 120, windowMs: 60_000 },
  };
  const middleware = middlewareSection
    ? { auth: middlewareSection.auth, cors: middlewareSection.cors, rateLimit: middlewareSection.rateLimit }
    : defaultMiddleware;
  const wsRoutes: WsRouteDef[] = wsSections.flatMap(s => s.routes);
  const envVars = envSection ? envSection.vars : undefined;
  return { routes, wsRoutes, middleware, env: envVars, dbSchema: dbSection };
}

function buildAssetsIR(ast: UniFile): AssetsIR {
  const jsSections = ast.sections.filter(
    (s): s is JsSection => s.kind === 'js',
  );

  const clientEntry = jsSections.flatMap(s => s.chunks).map(c => c.code).join('\n');

  return { clientEntry };
}

function buildStateIR(ast: UniFile): CompilationIR['state'] {
  const sections = ast.sections.filter((s): s is StateSection => s.kind === 'state');
  return sections.flatMap(s => s.entries);
}

// english: ----- TS/HTML file generation -----
// french:  ----- génération de fichiers TS/HTML -----

async function emitGeneratedFiles(ir: CompilationIR, generatedDir: string, devMode: boolean = false): Promise<void> {
  const outDir = resolve(generatedDir);
  await fs.mkdir(outDir, { recursive: true });

  // english: Create assets directory for design system and other static files
  // french:  Créer le répertoire assets pour le système de design et autres fichiers statiques
  const assetsDir = resolve(outDir, 'assets');
  await fs.mkdir(assetsDir, { recursive: true });

  const serverPath = resolve(outDir, 'app.server.ts');
  const edgePath = resolve(outDir, 'app.edge.ts');
  const clientPath = resolve(outDir, 'app.client.ts');
  const htmlPath = resolve(outDir, 'index.html');
  const pyPath = resolve(outDir, 'app.py');
  const ffiManifestPath = resolve(outDir, 'ffi.manifest.json');
  const dbSchemaPath = resolve(outDir, 'schema.json');

  // english: Copy base.css design system from src/assets/base.css
  // french:  Copier le système de design base.css depuis src/assets/base.css
  const basecssSrcPath = resolve(dirname(dirname(outDir)), 'src', 'assets', 'base.css');
  const basecssDestPath = resolve(assetsDir, 'base.css');

  const ffiCompiler = new FfiCompiler();
  const ffiLines = ir.ffiSource
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(Boolean);
  const ffiManifest = ffiCompiler.compile(ffiLines);

  await Promise.all([
    fs.writeFile(serverPath, generateServerTs(ir), 'utf8'),
    fs.writeFile(edgePath, generateEdgeTs(ir), 'utf8'),
    fs.writeFile(clientPath, generateClientTs(ir), 'utf8'),
    fs.writeFile(htmlPath, generateIndexHtml(ir, devMode), 'utf8'),
    fs.writeFile(pyPath, generatePythonModule(ir), 'utf8'),
    fs.writeFile(ffiManifestPath, JSON.stringify(ffiManifest, null, 2), 'utf8'),
    fs.writeFile(dbSchemaPath, JSON.stringify(ir.backend.dbSchema ?? {}, null, 2), 'utf8'),
    fs.copyFile(basecssSrcPath, basecssDestPath).catch(() => {
      // english: If base.css doesn't exist, continue gracefully
      // french:  Si base.css n'existe pas, continuer gracieusement
    }),
  ]);
}

function generateServerTs(ir: CompilationIR): string {
  const pyBindings = JSON.stringify(ir.pyBindings);
  const middlewareCfg = JSON.stringify(ir.backend.middleware, null, 2);
  const wsRoutes = JSON.stringify(ir.backend.wsRoutes);
  const dbSchema = JSON.stringify(ir.backend.dbSchema ?? null);
  const emitEnvValidationCode = emitEnvValidation(ir.backend.env);
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
  const uploadDir = process.env.UPLOAD_DIR || 'uploads';
  const routeLines = ir.backend.routes
    .map(route => {
      const method = route.method.toLowerCase();
      const statusLine = route.status ? `  res.status(${route.status});\n` : '';
      const validationCode = emitRouteValidation(route.validators);
      const handler = route.handler;
      const handlerCode = emitRouteHandlerCall(handler, route.fileUpload);
      const uploadMiddleware = route.fileUpload ?
        `multer({
    dest: '${uploadDir}/',
    limits: { fileSize: ${route.fileUpload.maxSizeBytes} },
    fileFilter: (req, file, cb) => {
      const allowed = ${JSON.stringify(route.fileUpload.accept)};
      if (allowed.includes('*/*') || allowed.includes(file.mimetype)) {
        cb(null, true);
      } else {
        cb(new Error('[Cross] UniStack: Invalid file type. Accepted: ${route.fileUpload.accept.join(', ')}'), false);
      }
    }
  }).single('${route.fileUpload.field}'),` :
        '';

      return `app.${method}('${route.path}', ${uploadMiddleware} async (req, res) => withSandbox(req, res, '${route.method} ${route.path}', async () => {
${statusLine}${validationCode}
try {
${handlerCode}
} finally {
  if ((req as any).file) {
    fs.unlink((req as any).file.path, (err) => {
      if (err) console.error(\`[Cross] UniStack: failed to clean up temporary file: \${(req as any).file.path}\`, err);
    });
  }
}
}));`;
    })
    .join('\n\n');

  return `import express from 'express';
import multer from 'multer';
import { promises as fs } from 'node:fs';
import { mkdirSync } from 'node:fs';
import { resolve } from 'node:path';
import type { UniRuntime } from './runtime/server.js';
import { WorkerPool } from './runtime/workerPool.js';
import { createHash } from 'node:crypto';

export function createServer(runtime: UniRuntime) {
  const app = express();
  ${emitEnvValidationCode}
  const middleware = ${middlewareCfg} as any;
  const dbSchema = ${dbSchema};
  const wsRoutes = ${wsRoutes};
  const uploadDir = process.env.UPLOAD_DIR || '${uploadDir}';
  app.use(express.json());
  app.use('/assets', express.static('assets'));
  try {
    mkdirSync(resolve(process.cwd(), uploadDir), { recursive: true });
    console.log(\`english: Upload directory is ready at \${uploadDir}. french: Le répertoire d'upload est prêt sur \${uploadDir}.\`);
    if (dbSchema) await runMigrations(runtime, dbSchema);
  } catch (e) { console.error(\`[Cross] UniStack: Could not create upload directory: \${uploadDir}\`, e); }
  installCors(app, middleware.cors);
  installRateLimit(app, middleware.rateLimit);
  installAuth(app, runtime, middleware.auth);
  app.use((req, res, next) => {
    const traceId = (req.headers['x-request-id'] as string) || randomId();
    (req as any).traceId = traceId;
    res.setHeader('x-request-id', traceId);
    next();
  });
  app.get('/', (req, res) => {
    res.sendFile('index.html', { root: 'dist' });
  });
  app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
  });
  app.get('/__unistack/ws-routes', (req, res) => {
    res.json(wsRoutes.map(r => ({ path: r.path })));
  });

  const pyBindings = ${pyBindings};
  const notFoundHtml = ${notFoundHtml};
  const workerPool = new WorkerPool();
  const routeTimeoutMs = Number(process.env.UNISTACK_ROUTE_TIMEOUT_MS ?? 15000);
  const maxConcurrentRoutes = Number(process.env.UNISTACK_ROUTE_MAX_CONCURRENCY ?? 512);
  let inFlightRoutes = 0;
  const waitQueue: Array<() => void> = [];

  function randomId() {
    return Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
  }

  function withTimeout(promise, ms) {
    return Promise.race([
      promise,
      new Promise((_, reject) => {
        setTimeout(() => reject(new Error('Route timeout exceeded')), ms);
      }),
    ]);
  }

  async function acquireSlot() {
    if (inFlightRoutes < maxConcurrentRoutes) {
      inFlightRoutes += 1;
      return;
    }
    await new Promise(resolve => waitQueue.push(resolve));
    inFlightRoutes += 1;
  }

  function releaseSlot() {
    inFlightRoutes = Math.max(0, inFlightRoutes - 1);
    const next = waitQueue.shift();
    if (next) next();
  }

  async function withSandbox(req, res, label, handler) {
    const started = Date.now();
    const traceId = (req as any).traceId || randomId();
    await acquireSlot();
    try {
      await withTimeout(Promise.resolve(handler()), routeTimeoutMs);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      if (!res.headersSent) {
        res.status(500).json({ error: message, traceId, route: label });
      }
      console.error(
        'english: Route sandbox error. french: Erreur sandbox route.',
        { traceId, route: label, error: message }
      );
    } finally {
      releaseSlot();
      const durationMs = Date.now() - started;
      console.log(
        'english: request completed. french: requête terminée.',
        { traceId, route: label, durationMs, inFlightRoutes }
      );
    }
  }

  function installCors(app, cfg) {
    if (!cfg?.enabled) return;
    const allowAll = !Array.isArray(cfg.origins) || cfg.origins.length === 0;
    const methods = Array.isArray(cfg.methods) && cfg.methods.length ? cfg.methods.join(',') : 'GET,POST,PUT,PATCH,DELETE,OPTIONS';
    app.use((req, res, next) => {
      const origin = req.headers.origin;
      if (allowAll) {
        res.setHeader('Access-Control-Allow-Origin', '*');
      } else if (origin && cfg.origins.includes(origin)) {
        res.setHeader('Access-Control-Allow-Origin', origin);
        res.setHeader('Vary', 'Origin');
      }
      res.setHeader('Access-Control-Allow-Methods', methods);
      res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      if (req.method === 'OPTIONS') {
        res.status(204).end();
        return;
      }
      next();
    });
  }

  function installRateLimit(app, cfg) {
    const isProd = process.env.NODE_ENV === 'production';
    // english: if no rate limit configured and we're in production, apply sane defaults
    // french: si aucun rate limit configuré et que nous sommes en production, appliquer des valeurs par défaut raisonnables
    if ((!cfg || !cfg.enabled) && isProd) {
      cfg = { enabled: true, max: 1000, windowMs: 15 * 60_000 };
    }
    if (!cfg?.enabled) return;
    const max = Number(cfg.max || (isProd ? 1000 : 120));
    const windowMs = Number(cfg.windowMs || (isProd ? 15 * 60_000 : 60000));
    const buckets = new Map();
    app.use((req, res, next) => {
      const key = String(req.ip || req.headers['x-forwarded-for'] || 'global');
      const now = Date.now();
      const cur = buckets.get(key) || { count: 0, resetAt: now + windowMs };
      if (now > cur.resetAt) {
        cur.count = 0;
        cur.resetAt = now + windowMs;
      }
      cur.count += 1;
      buckets.set(key, cur);
      res.setHeader('X-RateLimit-Limit', String(max));
      res.setHeader('X-RateLimit-Remaining', String(Math.max(0, max - cur.count)));
      if (cur.count > max) {
        res.setHeader('Retry-After', String(Math.ceil((cur.resetAt - now) / 1000)));
        res.status(429).json({ error: 'rate limit exceeded' });
        return;
      }
      next();
    });
  }

  function installAuth(app, runtime, cfg) {
    if (!cfg?.enabled || !cfg.handler || cfg.handler.lang !== 'py') return;
    const excludes = new Set(cfg.excludes || []);
    const headerName = String(cfg.header || 'authorization').toLowerCase();
    app.use(async (req, res, next) => {
      if (excludes.has(req.path) || req.path.startsWith('/assets') || req.path.startsWith('/__unistack')) {
        next();
        return;
      }
      const token = req.headers[headerName];
      if (!token) {
        res.status(401).json({ error: 'missing auth token' });
        return;
      }
      try {
        const args = (cfg.handler.args || []).map(arg => {
          if (arg.kind === 'identifier') {
            if (arg.name === 'token') return token;
            if (arg.name === 'path') return req.path;
            return req.body?.[arg.name] ?? req.query?.[arg.name] ?? null;
          }
          return arg.value;
        });
        const out = await runtime.callPy(cfg.handler.name, ...args);
        if (out === false || out == null || (typeof out === 'object' && out && out.ok === false)) {
          res.status(401).json({ error: 'unauthorized' });
          return;
        }
        (req as any).auth = out;
        next();
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        res.status(401).json({ error: message });
      }
    });
  }

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
      const params = Array.isArray(req.body?.params) ? req.body.params : [];
      if (!query || typeof query !== 'string') {
        res.status(400).json({ error: 'invalid sql query' });
        return;
      }
      const data = await runtime.sql(query, params);
      res.json(data);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  app.get('/events', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    const unsubscribe = runtime.subscribePersist((key, value) => {
      const payload = JSON.stringify({ key, value });
      res.write(\`event: persist\\ndata: \${payload}\\n\\n\`);
    });
    const ping = setInterval(() => {
      res.write('event: ping\\ndata: {}\\n\\n');
    }, 25000);
    req.on('close', () => {
      clearInterval(ping);
      unsubscribe();
      res.end();
    });
  });

  app.post('/__unistack/persist', async (req, res) => {
    try {
      const key = req.body?.key;
      const value = req.body?.value;
      if (!key || typeof key !== 'string') {
        res.status(400).json({ error: 'invalid key' });
        return;
      }
      await runtime.setPersist(key, value);
      res.json({ ok: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  app.get('/__unistack/persist/:key', async (req, res) => {
    try {
      const key = req.params.key;
      const value = await runtime.getPersist(key);
      res.json({ key, value });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  app.get('/__unistack/workers/stats', (req, res) => {
    res.json(workerPool.stats());
  });

  app.post('/__unistack/compute/vector-add', async (req, res) => {
    try {
      const a = Array.isArray(req.body?.a) ? req.body.a : [];
      const b = Array.isArray(req.body?.b) ? req.body.b : [];
      const result = await workerPool.run({ op: 'vector_add', payload: { a, b } });
      res.json({ result });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

  app.post('/__unistack/compute/vector-scale', async (req, res) => {
    try {
      const a = Array.isArray(req.body?.a) ? req.body.a : [];
      const scalar = Number(req.body?.scalar ?? 1);
      const result = await workerPool.run({ op: 'vector_scale', payload: { a, scalar } });
      res.json({ result });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      res.status(500).json({ error: message });
    }
  });

${routeLines}

  app.use((req, res) => {
    res.status(404).send(notFoundHtml);
  });

  function createWsHandler(runtime, routes) {
    const clients = new Map();
    function getClients(path) {
      if (!clients.has(path)) clients.set(path, new Set());
      return clients.get(path);
    }
    return {
      async handleUpgrade(req, socket) {
        const path = (req.url || '').split('?')[0] || '/';
        const route = routes.find(r => r.path === path);
        if (!route) {
          socket.write('HTTP/1.1 404 Not Found\\r\\n\\r\\n');
          socket.destroy();
          return;
        }
        const key = req.headers['sec-websocket-key'];
        if (!key || typeof key !== 'string') {
          socket.write('HTTP/1.1 400 Bad Request\\r\\n\\r\\n');
          socket.destroy();
          return;
        }
        const accept = createHash('sha1')
          .update(key + '258EAFA5-E914-47DA-95CA-C5AB0DC85B11')
          .digest('base64');
        socket.write(
          'HTTP/1.1 101 Switching Protocols\\r\\n' +
            'Upgrade: websocket\\r\\n' +
            'Connection: Upgrade\\r\\n' +
            'Sec-WebSocket-Accept: ' + accept + '\\r\\n\\r\\n',
        );
        const client = { path, socket, send: data => sendWsText(socket, typeof data === 'string' ? data : JSON.stringify(data)) };
        getClients(path).add(client);
        if (route.onConnect) {
          try { await runtime.callPy(route.onConnect.name, { path }); } catch {}
        }
        socket.on('data', async chunk => {
          const msg = parseWsTextFrame(chunk);
          if (msg == null) return;
          if (route.onMessage) {
            try { await runtime.callPy(route.onMessage.name, msg, { path }); } catch {}
          }
          for (const c of getClients(path)) {
            if (c !== client) c.send(msg);
          }
        });
        const close = async () => {
          getClients(path).delete(client);
          if (route.onDisconnect) {
            try { await runtime.callPy(route.onDisconnect.name, { path }); } catch {}
          }
        };
        socket.on('close', close);
        socket.on('end', close);
        socket.on('error', close);
      },
    };
  }

  function parseWsTextFrame(buffer) {
    if (!buffer || buffer.length < 2) return null;
    const opcode = buffer[0] & 0x0f;
    if (opcode === 0x8) return null;
    if (opcode !== 0x1) return null;
    const masked = (buffer[1] & 0x80) !== 0;
    let len = buffer[1] & 0x7f;
    let offset = 2;
    if (len === 126) {
      if (buffer.length < 4) return null;
      len = buffer.readUInt16BE(2);
      offset = 4;
    } else if (len === 127) {
      return null;
    }
    let payload = buffer.subarray(offset, offset + len);
    if (masked) {
      const mask = buffer.subarray(offset, offset + 4);
      payload = buffer.subarray(offset + 4, offset + 4 + len);
      for (let i = 0; i < payload.length; i += 1) {
        payload[i] ^= mask[i % 4];
      }
    }
    return payload.toString('utf8');
  }

  function sendWsText(socket, text) {
    const payload = Buffer.from(text, 'utf8');
    const head = payload.length < 126 ? 2 : 4;
    const frame = Buffer.alloc(head + payload.length);
    frame[0] = 0x81;
    if (payload.length < 126) {
      frame[1] = payload.length;
      payload.copy(frame, 2);
    } else {
      frame[1] = 126;
      frame.writeUInt16BE(payload.length, 2);
      payload.copy(frame, 4);
    }
    socket.write(frame);
  }

  (app as any).__unistackWsHandler = createWsHandler(runtime, wsRoutes);
  return app;
}
`;
}

function generateEdgeTs(ir: CompilationIR): string {
  const routeLines = ir.backend.routes
    .map(route => {
      const handler = route.handler;
      if (handler.lang === 'sql') {
        const validateCode = emitEdgeValidation(route.validators);
        const paramsExpr = handler.params
          .map(arg => {
            if (arg.kind === 'string') return JSON.stringify(arg.value);
            if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
            return `body?.${arg.name} ?? url.searchParams.get('${arg.name}')`;
          })
          .join(', ');
        return `if (method === '${route.method}' && path === '${route.path}') {
    ${validateCode}
    const data = await runtime.sql(${JSON.stringify(handler.query)}, [${paramsExpr}]);
    return json(data, ${route.status ?? 200});
  }`;
      }
      if (handler.lang === 'js') {
        return `if (method === '${route.method}' && path === '${route.path}') {
    return json({ error: 'js handler not supported on edge runtime' }, 400);
  }`;
      }
      const argsExpr = (handler.args ?? [])
        .map(arg => {
          if (arg.kind === 'string') return JSON.stringify(arg.value);
          if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
          return `body?.${arg.name} ?? url.searchParams.get('${arg.name}')`;
        })
        .join(', ');
      return `if (method === '${route.method}' && path === '${route.path}') {
    ${emitEdgeValidation(route.validators)}
    const data = await runtime.callPy('${handler.name}'${argsExpr ? `, ${argsExpr}` : ''});
    return json(data, ${route.status ?? 200});
  }`;
    })
    .join('\n\n  ');

  return `export interface UniEdgeRuntime {
  callPy(name: string, ...args: unknown[]): Promise<unknown> | unknown;
  sql(query: string, params?: unknown[]): Promise<unknown[]>;
}

function json(data: unknown, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8' },
  });
}

export function createEdgeHandler(runtime: UniEdgeRuntime) {
  return async function handler(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method.toUpperCase();
    let body: any = null;

    if (request.headers.get('content-type')?.includes('application/json')) {
      try {
        body = await request.json();
      } catch {
        body = null;
      }
    }

    if (path === '/health') {
      return json({ status: 'ok' });
    }

  ${routeLines}

    return new Response('Not Found', { status: 404 });
  };
}
`;
}

function emitRouteHandlerCall(handler: LangRef, fileUpload?: BackendRouteIR['fileUpload']): string {
  if (handler.lang === 'sql') {
    const paramsExpr = handler.params.map(arg => emitArgExpr(arg, fileUpload)).join(', ');
    return `  const data = await runtime.sql(${JSON.stringify(handler.query)}, [${paramsExpr}]);
  res.json(data);`;
  }
  if (handler.lang === 'js') {
    return `  throw new Error('js route handlers are not supported on server runtime; use py or sql');`;
  }

  const args = handler.args ?? [];
  const argsExpr = args.map(arg => emitArgExpr(arg, fileUpload)).join(', ');
  return `  const data = await runtime.callPy('${handler.name}'${argsExpr ? `, ${argsExpr}` : ''});
  res.json(data);`;
}

function emitEnvValidation(vars: EnvVarDef[] | undefined): string {
  if (!vars || vars.length === 0) return '';
  const lines: string[] = [];
  lines.push('  // validate environment variables generated from env section');
  for (const v of vars) {
    const name = v.name;
    const accessor = `__uniEnv_${name}`;
    lines.push(`  let ${accessor} = process.env['${name}'];`);
    if (v.required) {
      lines.push(
        `  if (${accessor} === undefined || ${accessor} === null || ${accessor} === '') {`,
        `    throw new Error('[Cross] UniStack: missing required env var: ${name}');`,
        '  }',
      );
    }
    if (v.default !== undefined) {
      const defval = JSON.stringify(v.default);
      lines.push(
        `  if (${accessor} === undefined || ${accessor} === null || ${accessor} === '') {`,
        `    ${accessor} = ${defval};`,
        '  }',
      );
    }
    if (v.type === 'number') {
      lines.push(
        `  if (${accessor} !== undefined && ${accessor} !== null && ${accessor} !== '') {`,
        `    const __uniNum = Number(${accessor});`,
        `    if (Number.isNaN(__uniNum)) {`,
        `      throw new Error('[Cross] UniStack: env var ${name} must be a number');`,
        '    }',
        `    ${accessor} = String(__uniNum);`,
        '  }',
      );
    } else if (v.type === 'boolean') {
      lines.push(
        `  if (${accessor} !== undefined && ${accessor} !== null && ${accessor} !== '') {`,
        `    const low = ${accessor}.toLowerCase();`,
        `    if (low !== 'true' && low !== 'false') {`,
        `      throw new Error('[Cross] UniStack: env var ${name} must be boolean');`,
        '    }',
        `    ${accessor} = low;`,
        '  }',
      );
    }
    lines.push(`  process.env['${name}'] = ${accessor};`);
  }
  return lines.join('\n');
}

function emitRouteValidation(validators: RouteValidateRule[]): string {
  if (!validators || validators.length === 0) return '';
  const lines: string[] = [];
  lines.push('  const __uniInput = { ...(req.body ?? {}) };');
  for (const rule of validators) {
    const field = rule.field;
    const accessor = `__uniRaw_${field}`;
    lines.push(
      `  let ${accessor} = (req.body?.${field} ?? req.query?.${field} ?? req.params?.${field});`,
    );
    if (rule.required) {
      lines.push(
        `  if (${accessor} === undefined || ${accessor} === null || ${accessor} === '') {`,
        `    res.status(400).json({ error: 'validation failed: ${field} is required' });`,
        '    return;',
        '  }',
      );
    } else {
      lines.push(
        `  if (${accessor} === undefined || ${accessor} === null || ${accessor} === '') {`,
        '    // optional field',
        '  } else {',
      );
    }
    if (rule.type === 'string') {
      lines.push(
        `  if (${accessor} !== undefined && ${accessor} !== null && typeof ${accessor} !== 'string') {`,
        `    res.status(400).json({ error: 'validation failed: ${field} must be string' });`,
        '    return;',
        '  }',
      );
      if (typeof rule.min === 'number') {
        lines.push(
          `  if (typeof ${accessor} === 'string' && ${accessor}.length < ${rule.min}) {`,
          `    res.status(400).json({ error: 'validation failed: ${field} min length is ${rule.min}' });`,
          '    return;',
          '  }',
        );
      }
      if (typeof rule.max === 'number') {
        lines.push(
          `  if (typeof ${accessor} === 'string' && ${accessor}.length > ${rule.max}) {`,
          `    res.status(400).json({ error: 'validation failed: ${field} max length is ${rule.max}' });`,
          '    return;',
          '  }',
        );
      }
      lines.push(
        `  if (${accessor} !== undefined && ${accessor} !== null) __uniInput.${field} = ${accessor};`,
      );
    } else if (rule.type === 'number') {
      lines.push(
        `  const __uniNum_${field} = (${accessor} === undefined || ${accessor} === null || ${accessor} === '') ? null : Number(${accessor});`,
        `  if (__uniNum_${field} !== null && Number.isNaN(__uniNum_${field})) {`,
        `    res.status(400).json({ error: 'validation failed: ${field} must be number' });`,
        '    return;',
        '  }',
      );
      if (typeof rule.min === 'number') {
        lines.push(
          `  if (__uniNum_${field} !== null && __uniNum_${field} < ${rule.min}) {`,
          `    res.status(400).json({ error: 'validation failed: ${field} min is ${rule.min}' });`,
          '    return;',
          '  }',
        );
      }
      if (typeof rule.max === 'number') {
        lines.push(
          `  if (__uniNum_${field} !== null && __uniNum_${field} > ${rule.max}) {`,
          `    res.status(400).json({ error: 'validation failed: ${field} max is ${rule.max}' });`,
          '    return;',
          '  }',
        );
      }
      lines.push(
        `  if (__uniNum_${field} !== null) __uniInput.${field} = __uniNum_${field};`,
      );
    } else {
      lines.push(
        `  let __uniBool_${field} = ${accessor};`,
        `  if (typeof __uniBool_${field} === 'string') {`,
        `    if (__uniBool_${field}.toLowerCase() === 'true') __uniBool_${field} = true;`,
        `    else if (__uniBool_${field}.toLowerCase() === 'false') __uniBool_${field} = false;`,
        '  }',
        `  if (__uniBool_${field} !== undefined && __uniBool_${field} !== null && typeof __uniBool_${field} !== 'boolean') {`,
        `    res.status(400).json({ error: 'validation failed: ${field} must be boolean' });`,
        '    return;',
        '  }',
        `  if (__uniBool_${field} !== undefined && __uniBool_${field} !== null) __uniInput.${field} = __uniBool_${field};`,
      );
    }
    if (!rule.required) {
      lines.push('  }');
    }
  }
  lines.push('  req.body = __uniInput;');
  return `${lines.join('\n')}\n`;
}

function emitEdgeValidation(validators: RouteValidateRule[]): string {
  if (!validators || validators.length === 0) return '';
  const lines: string[] = [];
  lines.push('const __uniInput = { ...(body ?? {}) };');
  for (const rule of validators) {
    const field = rule.field;
    const raw = `__uniRaw_${field}`;
    lines.push(`let ${raw} = (body?.${field} ?? url.searchParams.get('${field}'));`);
    if (rule.required) {
      lines.push(
        `if (${raw} === undefined || ${raw} === null || ${raw} === '') return json({ error: 'validation failed: ${field} is required' }, 400);`,
      );
    } else {
      lines.push(`if (!(${raw} === undefined || ${raw} === null || ${raw} === '')) {`);
    }
    if (rule.type === 'string') {
      lines.push(
        `if (typeof ${raw} !== 'string') return json({ error: 'validation failed: ${field} must be string' }, 400);`,
      );
      if (typeof rule.min === 'number') {
        lines.push(
          `if (${raw}.length < ${rule.min}) return json({ error: 'validation failed: ${field} min length is ${rule.min}' }, 400);`,
        );
      }
      if (typeof rule.max === 'number') {
        lines.push(
          `if (${raw}.length > ${rule.max}) return json({ error: 'validation failed: ${field} max length is ${rule.max}' }, 400);`,
        );
      }
      lines.push(`__uniInput.${field} = ${raw};`);
    } else if (rule.type === 'number') {
      lines.push(
        `const __uniNum_${field} = Number(${raw});`,
        `if (Number.isNaN(__uniNum_${field})) return json({ error: 'validation failed: ${field} must be number' }, 400);`,
      );
      if (typeof rule.min === 'number') {
        lines.push(
          `if (__uniNum_${field} < ${rule.min}) return json({ error: 'validation failed: ${field} min is ${rule.min}' }, 400);`,
        );
      }
      if (typeof rule.max === 'number') {
        lines.push(
          `if (__uniNum_${field} > ${rule.max}) return json({ error: 'validation failed: ${field} max is ${rule.max}' }, 400);`,
        );
      }
      lines.push(`__uniInput.${field} = __uniNum_${field};`);
    } else {
      lines.push(
        `if (typeof ${raw} === 'string') ${raw} = (${raw}.toLowerCase() === 'true' ? true : (${raw}.toLowerCase() === 'false' ? false : ${raw}));`,
        `if (typeof ${raw} !== 'boolean') return json({ error: 'validation failed: ${field} must be boolean' }, 400);`,
        `__uniInput.${field} = ${raw};`,
      );
    }
    if (!rule.required) {
      lines.push('}');
    }
  }
  lines.push('body = __uniInput;');
  return lines.join('\n    ');
}

function emitArgExpr(arg: Expr, fileUpload?: BackendRouteIR['fileUpload']): string {
  if (arg.kind === 'string') return JSON.stringify(arg.value);
  if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
  // identifier: prefer body, then query, then params
  if (fileUpload && arg.kind === 'identifier') {
    if (arg.name === 'file.path') return '(req as any).file?.path';
    if (arg.name === 'file.name') return '(req as any).file?.originalname';
    if (arg.name === 'file.size') return '(req as any).file?.size';
  }
  return `((req as any).body?.${arg.name} ?? (req as any).query?.${arg.name} ?? (req as any).params?.${arg.name})`;
}

function generateClientTs(ir: CompilationIR): string {
  const userCode = ir.assets.clientEntry || 'console.log("UniStack client ready.");';
  const initialState = serializeStateEntries(ir.state);
  const placeholders = ir.frontend.placeholders.map(p => {
    if (p.ref.lang === 'sql') {
      return {
        id: p.id,
        lang: 'sql',
        query: p.ref.query,
        params: p.ref.params,
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

// english: UniStack client bootstrap
// french:  Bootstrap client UniStack
export function bootstrap() {
  const stateStore = createStateStore(${initialState});
  (window).UniState = stateStore.api;
  const getSnapshot = () => stateStore.snapshot();
  const placeholders = ${JSON.stringify(placeholders)};
  bindStateDirectives(stateStore);
  for (const item of placeholders) {
    const el = document.querySelector(\`[data-uniref="\${item.id}"]\`);
    if (!el) continue;
    if (item.lang === 'py') {
      resolvePy(item, el, getSnapshot);
    } else if (item.lang === 'sql') {
      resolveSql(item, el, getSnapshot);
    } else {
      el.textContent = item.label;
    }
  }
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => bootstrap());
} else {
  bootstrap();
}

async function resolvePy(item, el) {
  try {
    const context = arguments[2] ? arguments[2]() : {};
    const res = await fetch(\`/__unistack/py/\${item.name}\`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ args: item.args ?? [], context }),
    });
    const data = await res.json();
    el.textContent = formatValue(data);
  } catch (err) {
    el.textContent = el.getAttribute('data-uniref-fallback') ?? '';
  }
}

async function resolveSql(item, el) {
  try {
    const context = arguments[2] ? arguments[2]() : {};
    const params = formatArgs(item.params ?? [], context);
    const res = await fetch('/__unistack/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: item.query, params }),
    });
    const data = await res.json();
    el.textContent = formatValue(data);
  } catch (err) {
    el.textContent = el.getAttribute('data-uniref-fallback') ?? '';
  }
}

function formatArgs(args, context) {
  if (!Array.isArray(args)) return [];
  return args.map(arg => {
    if (arg && typeof arg === 'object' && 'kind' in arg) {
      if (arg.kind === 'identifier') return context?.[arg.name] ?? null;
      return arg.value;
    }
    return arg;
  });
}

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}

function createStateStore(initialState) {
  let state = deepClone(initialState || {});
  const listeners = new Set();
  const selectorListeners = [];
  const proxyCache = new WeakMap();

  function notify(path) {
    const snapshot = deepClone(state);
    for (const fn of listeners) fn(snapshot, path);
    for (const entry of selectorListeners) {
      try {
        const next = entry.selector(snapshot);
        if (!isEqual(next, entry.prev)) {
          const prev = entry.prev;
          entry.prev = deepClone(next);
          entry.fn(next, prev, path);
        }
      } catch {}
    }
  }

  function proxify(obj, basePath) {
    if (!obj || typeof obj !== 'object') return obj;
    if (proxyCache.has(obj)) return proxyCache.get(obj);
    const proxy = new Proxy(obj, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        if (value && typeof value === 'object') {
          return proxify(value, basePath ? basePath + '.' + String(prop) : String(prop));
        }
        return value;
      },
      set(target, prop, value, receiver) {
        const ok = Reflect.set(target, prop, value, receiver);
        const nextPath = basePath ? basePath + '.' + String(prop) : String(prop);
        notify(nextPath);
        return ok;
      },
      deleteProperty(target, prop) {
        const ok = Reflect.deleteProperty(target, prop);
        const nextPath = basePath ? basePath + '.' + String(prop) : String(prop);
        notify(nextPath);
        return ok;
      },
    });
    proxyCache.set(obj, proxy);
    return proxy;
  }

  const reactive = proxify(state, '');

  const api = {
    state: reactive,
    get(path, fallback) {
      return pathGet(state, path, fallback);
    },
    set(path, value) {
      pathSet(state, path, value);
      notify(path);
    },
    patch(partial) {
      if (!partial || typeof partial !== 'object') return;
      deepMerge(state, partial);
      notify('*');
    },
    subscribe(fn) {
      listeners.add(fn);
      return () => listeners.delete(fn);
    },
    watch(selector, fn) {
      const cur = deepClone(selector(state));
      const entry = { selector, fn, prev: cur };
      selectorListeners.push(entry);
      return () => {
        const idx = selectorListeners.indexOf(entry);
        if (idx >= 0) selectorListeners.splice(idx, 1);
      };
    },
    snapshot() {
      return deepClone(state);
    },
  };

  return { api, snapshot: api.snapshot };
}

function bindStateDirectives(store) {
  const scope = document;
  const textEls = scope.querySelectorAll('[data-uni-bind]');
  const htmlEls = scope.querySelectorAll('[data-uni-html]');
  const showEls = scope.querySelectorAll('[data-uni-show]');
  const modelEls = scope.querySelectorAll('[data-uni-model]');
  const classEls = scope.querySelectorAll('[data-uni-class]');

  const render = () => {
    const snap = store.api.snapshot();
    for (const el of textEls) {
      const path = el.getAttribute('data-uni-bind');
      el.textContent = formatValue(pathGet(snap, path, ''));
    }
    for (const el of htmlEls) {
      const path = el.getAttribute('data-uni-html');
      el.innerHTML = String(pathGet(snap, path, '') ?? '');
    }
    for (const el of showEls) {
      const path = el.getAttribute('data-uni-show');
      const visible = Boolean(pathGet(snap, path, false));
      el.style.display = visible ? '' : 'none';
    }
    for (const el of modelEls) {
      const path = el.getAttribute('data-uni-model');
      const v = pathGet(snap, path, '');
      if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        if (el.type === 'checkbox' && 'checked' in el) {
          el.checked = Boolean(v);
        } else {
          el.value = String(v ?? '');
        }
      }
    }
    for (const el of classEls) {
      const spec = String(el.getAttribute('data-uni-class') || '').trim();
      if (!spec) continue;
      const pairs = spec.split(',').map(x => x.trim()).filter(Boolean);
      for (const p of pairs) {
        const idx = p.indexOf(':');
        if (idx <= 0) continue;
        const cls = p.slice(0, idx).trim();
        const path = p.slice(idx + 1).trim();
        el.classList.toggle(cls, Boolean(pathGet(snap, path, false)));
      }
    }
  };

  for (const el of modelEls) {
    const path = el.getAttribute('data-uni-model');
    const evt = el instanceof HTMLSelectElement ? 'change' : 'input';
    el.addEventListener(evt, () => {
      if (el instanceof HTMLInputElement && el.type === 'checkbox') {
        store.api.set(path, el.checked);
      } else if (el instanceof HTMLInputElement || el instanceof HTMLTextAreaElement || el instanceof HTMLSelectElement) {
        store.api.set(path, el.value);
      }
    });
  }

  store.api.subscribe(() => render());
  render();
}

function pathGet(obj, path, fallback) {
  if (!path) return obj ?? fallback;
  const keys = String(path).split('.').filter(Boolean);
  let cur = obj;
  for (const k of keys) {
    if (cur == null) return fallback;
    cur = cur[k];
  }
  return cur == null ? fallback : cur;
}

function pathSet(obj, path, value) {
  const keys = String(path || '').split('.').filter(Boolean);
  if (keys.length === 0) return;
  let cur = obj;
  for (let i = 0; i < keys.length - 1; i += 1) {
    const k = keys[i];
    if (!cur[k] || typeof cur[k] !== 'object') cur[k] = {};
    cur = cur[k];
  }
  cur[keys[keys.length - 1]] = value;
}

function deepClone(value) {
  if (typeof structuredClone === 'function') return structuredClone(value);
  return JSON.parse(JSON.stringify(value));
}

function deepMerge(target, source) {
  for (const key of Object.keys(source || {})) {
    const src = source[key];
    if (src && typeof src === 'object' && !Array.isArray(src)) {
      if (!target[key] || typeof target[key] !== 'object') target[key] = {};
      deepMerge(target[key], src);
    } else {
      target[key] = src;
    }
  }
  return target;
}

function isEqual(a, b) {
  return JSON.stringify(a) === JSON.stringify(b);
}
`;
}

function serializeStateEntries(entries: CompilationIR['state']): string {
  if (!entries.length) return '{}';
  const lines = entries.map(entry => `  ${JSON.stringify(entry.key)}: (${entry.expr})`);
  return `{\n${lines.join(',\n')}\n}`;
}

function generateIndexHtml(ir: CompilationIR, devMode: boolean): string {
  const html = ir.frontend.html || '<div class="app"><h1>UniStack</h1></div>';
  const css = sanitizeCss(ir.frontend.css || '.app { font-family: Arial, sans-serif; padding: 20px; }');
  const hmrScript = devMode ? `
    <script>
      const __uniHMR = new WebSocket('ws://localhost:3001');
      __uniHMR.onmessage = (e) => {
        const msg = JSON.parse(e.data);
        if (msg.type === 'reload') {
          location.reload();
        } else if (msg.type === 'error') {
          document.body.innerHTML = '<div style="background:#c0392b;color:white;padding:20px;font-family:monospace;white-space:pre-wrap;position:fixed;top:0;left:0;right:0;bottom:0;z-index:9999">' + msg.message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;') + '</div>';
        }
      };
    </script>
  ` : '';

  const runtimeScript = UIEngine.runtimeScriptTag();

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
    ${runtimeScript}
    <script type="module" src="./app.js"></script>
    ${hmrScript}
  </body>
</html>
`;
}

function sanitizeCss(css: string): string {
  return css
    .replace(/\}\s*;/g, '}')
    .replace(/;\s*;/g, ';')
    .replace(/\r\n/g, '\n');
}

function formatLangRef(ref: LangRef): string {
  if (ref.lang === 'sql') {
    const args = ref.params.map(arg => {
      if (arg.kind === 'string') return `"${arg.value}"`;
      if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
      return arg.name;
    });
    return `sql("${ref.query}"${args.length ? `, ${args.join(', ')}` : ''})`;
  }
  const args = ref.args.map(arg => {
    if (arg.kind === 'string') return `"${arg.value}"`;
    if (arg.kind === 'number' || arg.kind === 'boolean') return String(arg.value);
    return arg.name;
  });
  return `${ref.lang}:${ref.name}${args.length ? `(${args.join(', ')})` : ''}`;
}

function formatFallbackText(ref: LangRef): string {
  if (ref.lang === 'sql') {
    return 'Loading data...';
  }
  const raw = ref.name || 'Loading';
  const spaced = raw
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_-]+/g, ' ')
    .trim();
  if (!spaced) return 'Loading...';
  return spaced.charAt(0).toUpperCase() + spaced.slice(1);
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
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

function collectFfiSource(ast: UniFile): string {
  const ffiSections = ast.sections.filter((s): s is any => s.kind === 'ffi');
  return ffiSections.flatMap(s => s.lines).join('\n').trim();
}

async function loadWithImports(base: UniFile, entryPath: string, useAntlr: boolean): Promise<UniFile> {
  const visited = new Set<string>();
  const dir = dirname(entryPath);

  const load = async (filePath: string): Promise<UniFile> => {
    const abs = resolve(dir, filePath);
    if (visited.has(abs)) {
      return {
        type: 'app',
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
    // support both legacy paths array and new entries list
    const importEntries: { path: string }[] = imports.flatMap(i => {
      if (i.entries) return i.entries;
      if (i.paths) return i.paths.map((p: string) => ({ path: p }));
      return [];
    });
    const childSections: Section[] = [];
    for (const ie of importEntries) {
      const p = ie.path;
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
  const importEntries: { path: string }[] = imports.flatMap(i => {
    if (i.entries) return i.entries;
    if (i.paths) return i.paths.map((p: string) => ({ path: p }));
    return [];
  });
  const importedSections: Section[] = [];
  let importedConfig: ConfigSection | null = null;

  for (const ie of importEntries) {
    const p = ie.path;
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
    type: 'app',
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
          if (stmt.kind === 'return' && stmt.expr.lang === 'sql') {
            // english: Check for SQL injection via string concatenation
            // french:  Vérifier l'injection SQL via concaténation de chaîne
            const sqlQuery = stmt.expr.query;
            if (detectSqlConcatenation(sqlQuery)) {
              errors.push(
                `[Cross] UniStack: SQL injection risk in ${route.method} ${route.path} — use parametrized sql("...", variable) instead`,
              );
            }
          } else if (stmt.kind === 'return' && stmt.expr.lang === 'py') {
            if (!pyNames.has(stmt.expr.name)) {
              errors.push(`Unknown py binding in route ${route.method} ${route.path}: ${stmt.expr.name}`);
            }
          } else if (stmt.kind === 'return' && stmt.expr.lang === 'js') {
            errors.push(`Unsupported js route handler in ${route.method} ${route.path}: use py or sql`);
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

function detectSqlConcatenation(query: string): boolean {
  // english: Detect patterns like "..." + variable or template string interpolation
  // french:  Détecter les motifs comme "..." + variable ou interpolation de template
  
  // Check for string concatenation with + operator outside quotes
  const parts = query.split(/("(?:\\"|[^"])*"|'(?:\\'|[^'])*')/);
  for (let i = 0; i < parts.length; i += 2) {
    // Check only non-quoted parts
    if (parts[i] && parts[i].includes('+')) {
      return true;
    }
  }

  // Check for template literal interpolation ${}
  if (query.includes('${')) {
    return true;
  }

  return false;
}
