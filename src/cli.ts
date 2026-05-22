#!/usr/bin/env node
import { promises as fs } from 'node:fs';
try {
  const _dotenv = await import('dotenv');
  _dotenv.config();
} catch {}
import { resolve, basename } from 'node:path';
import { buildUniStack } from './transpiler/index.js';
import type { CompilationIR, UniFile, Section, ImportsSection, RouteSection, TestSection, TestCase } from './lang/ast.js';
import { BasicRuntime, startServer, UniRuntime } from './runtime/server.js';
import { installPackage, publishPackage } from './cli/unipack.js';
import { formatUniFile } from './tools/formatter.js';
import { startStudio } from './tools/studio.js';
import { buildPlayground } from './tools/playground-builder.js';
import { lintUniFile } from './tools/linter.js';
import { build as esbuildBuild } from 'esbuild';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
let chokidar: any;
let WebSocketServer: any;
let WebSocket: any;
(async () => {
  try {
    chokidar = await import('chokidar');
  } catch {}
  try {
    const wsMod: any = await import('ws');
    WebSocketServer = wsMod.WebSocketServer;
    WebSocket = wsMod.WebSocket;
  } catch {}
})();
import { parseUniFile } from './parser/uniParser.js';
import { parseUniFileAntlr } from './parser/uniAntlrParser.js';
import { dirname, resolve as resolvePath } from 'node:path';
let fetch: any;
(async () => {
  try {
    fetch = (await import('node-fetch')).default;
  } catch {}
})();

function uniError(filename: string, line: number, col: number, message: string, suggestion?: string): Error {
  let formatted = `[Cross] UniStack Error — ${basename(filename)} line ${line}\n`;
  formatted += `   Problème: ${message}\n`;
  if (suggestion) {
    formatted += `   Suggestion: ${suggestion}\n`;
  }
  return new Error(formatted);
}

export async function gatherImportedFiles(entry: string, useAntlr: boolean = false, seen: Set<string> = new Set()): Promise<Set<string>> {
  const abs = resolvePath(entry);
  if (seen.has(abs)) return seen;
  seen.add(abs);
  let src: string;
  try {
    src = await fs.readFile(abs, 'utf8');
  } catch {
    return seen;
  }
  const ast = parseUniFile(src, abs);
  const importsSection = ast.sections.find(s => s.kind === 'imports') as ImportsSection | undefined;
  if (importsSection) {
    const entries: { path: string }[] = [];
    if ((importsSection as any).entries) entries.push(...(importsSection as any).entries);
    if ((importsSection as any).paths) entries.push(...(importsSection as any).paths.map((p: string) => ({ path: p })));
    for (const ie of entries) {
      const childPath = resolvePath(dirname(abs), ie.path);
      await gatherImportedFiles(childPath, useAntlr, seen);
    }
  }
  return seen;
}

interface UniStackConfig {
  entry: string;
  outDir: string;
  generatedDir: string;
  serverEntry: string;
  clientEntry: string;
}

export async function readConfig(cwd: string): Promise<UniStackConfig> {
  const configPath = resolve(cwd, 'unistack.config.json');
  const raw = await fs.readFile(configPath, 'utf8');
  const parsed = JSON.parse(raw) as UniStackConfig;
  const required: (keyof UniStackConfig)[] = ['entry', 'outDir', 'generatedDir', 'serverEntry', 'clientEntry'];
  for (const key of required) {
    if (!parsed[key]) {
      throw new Error(`unistack.config.json: missing required field '${key}'`);
    }
  }
  try {
    const Ajv = (await import('ajv')).default;
    let schema: any;
    try {
      const schemaPath = resolve(cwd, 'unistack.schema.json');
      const schemaText = await fs.readFile(schemaPath, 'utf8');
      schema = JSON.parse(schemaText);
    } catch {
      schema = null;
    }
    const ajv = new Ajv({ allErrors: true });
    if (schema) {
      const valid = ajv.validate(schema, parsed);
      if (!valid) {
        throw new Error('unistack.config.json schema validation failed: ' + ajv.errorsText());
      }
    }
  } catch (err) {
    if ((err as any)?.code === 'ERR_MODULE_NOT_FOUND') {
      console.warn('english: Ajv not installed, skipping config schema validation. french: Ajv non installé, validation du schéma config ignorée.');
    } else {
      throw err;
    }
  }
  return parsed;
}

function validateEnvVars(vars: CompilationIR['backend']['env'] | undefined): void {
  if (!vars) return;
  for (const v of vars) {
    const name = v.name;
    const val = process.env[name];
    if ((val === undefined || val === null || val === '') && v.required) {
      throw new Error(`[Cross] UniStack: missing required env var: ${name}`);
    }
    if (v.type === 'number' && val && isNaN(Number(val))) {
      throw new Error(`[Cross] UniStack: env var ${name} must be a number`);
    }
    if (v.type === 'boolean' && val) {
      const low = String(val).toLowerCase();
      if (low !== 'true' && low !== 'false') {
        throw new Error(`[Cross] UniStack: env var ${name} must be boolean`);
      }
    }
  }
}

async function cmdInit(cwd: string): Promise<void> {
  const configPath = resolve(cwd, 'unistack.config.json');
  try {
    await fs.access(configPath);
    console.log('english: unistack.config.json already exists, nothing to do. french: unistack.config.json existe déjà, rien à faire.');
    return;
  } catch {}
  const defaultConfig: UniStackConfig = {
    entry: 'src/app.uni',
    outDir: 'dist',
    generatedDir: 'generated',
    serverEntry: 'generated/app.server.ts',
    clientEntry: 'generated/app.client.ts',
  };
  await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  console.log('english: File unistack.config.json created. french: Fichier unistack.config.json créé.');
  const templateName = getFlagValue(process.argv.slice(3), '--template') ?? 'basic';
  const srcDir = resolve(cwd, 'src');
  const appPath = resolve(srcDir, 'app.uni');
  await fs.mkdir(srcDir, { recursive: true });
  try {
    await fs.access(appPath);
  } catch {
    const templatePath = resolve(cwd, 'templates', templateName, 'app.uni');
    let template = DEFAULT_APP_TEMPLATE;
    try {
      template = await fs.readFile(templatePath, 'utf8');
    } catch {}
    await fs.writeFile(appPath, template, 'utf8');
    console.log('english: File src/app.uni created from template. french: Fichier src/app.uni créé depuis le template.');
  }
}

export async function cmdBuild(cwd: string, parserMode?: string, devMode: boolean = false): Promise<CompilationIR | void> {
  if (parserMode) {
    process.env.UNISTACK_PARSER = parserMode;
  }
  const cfg = await readConfig(cwd);
  const entryPath = resolve(cwd, cfg.entry);
  const ir = await buildUniStack({
    entryPath,
    generatedDir: resolve(cwd, cfg.generatedDir),
  });
  if (ir && ir.backend.env && ir.backend.env.length > 0) {
    const lines: string[] = ['# automatically generated by UniStack'];
    for (const v of ir.backend.env) {
      const info =
        `${v.name} (${v.required ? 'required' : 'optional'} ${v.type}` +
        (v.default !== undefined ? ` default=${JSON.stringify(v.default)}` : '') +
        ')';
      lines.push(`# ${info}`);
      if (v.default !== undefined) {
        lines.push(`${v.name}=${v.default}`);
      } else {
        lines.push(`${v.name}=`);
      }
      lines.push('');
    }
    try {
      await fs.writeFile(resolve(cwd, '.env.example'), lines.join('\n'), 'utf8');
    } catch {}
  }
  const outDir = resolve(cwd, cfg.outDir);
  await fs.mkdir(outDir, { recursive: true });
  try {
    const cliDir = dirname(fileURLToPath(import.meta.url));
    const runtimeEntry1 = resolve(cliDir, '..', 'src', 'runtime', 'workerPool.ts');
    const runtimeEntry2 = resolve(cliDir, '..', 'src', 'runtime', 'server.ts');
    await esbuildBuild({
      entryPoints: [runtimeEntry1, runtimeEntry2],
      outdir: resolve(cwd, cfg.generatedDir, 'runtime'),
      bundle: true,
      platform: 'node',
      format: 'esm',
    });
  } catch (err) {
    console.warn('english: pre-bundling runtime helpers failed, continuing. french: pré-bundling des helpers runtime échoué, continuation.', err);
  }
  await Promise.all([
    esbuildBuild({
      entryPoints: [resolve(cwd, cfg.clientEntry)],
      bundle: true,
      platform: 'browser',
      format: 'esm',
      outdir: outDir,
      entryNames: 'app',
      chunkNames: 'chunks/[name]-[hash]',
      splitting: true,
      sourcemap: true,
    }),
    esbuildBuild({
      entryPoints: [resolve(cwd, cfg.serverEntry)],
      bundle: true,
      platform: 'node',
      format: 'cjs',
      outfile: resolve(outDir, 'server.cjs'),
    }),
    esbuildBuild({
      entryPoints: [resolve(cwd, cfg.generatedDir, 'app.edge.ts')],
      bundle: true,
      platform: 'neutral',
      format: 'esm',
      outfile: resolve(outDir, 'edge.mjs'),
      sourcemap: true,
    }),
  ]);
  const generatedHtml = resolve(cwd, cfg.generatedDir, 'index.html');
  const distHtml = resolve(outDir, 'index.html');
  await fs.copyFile(generatedHtml, distHtml);
  try {
    const ui = await import('./compiler/ui-engine.js');
    const baseCss = (ui as any).UIEngine.defaultCss();
    const basePath = resolve(cwd, cfg.generatedDir, 'assets', 'base.css');
    await fs.mkdir(resolve(cwd, cfg.generatedDir, 'assets'), { recursive: true });
    await fs.writeFile(basePath, baseCss, 'utf8');
  } catch {}
  const generatedAssets = resolve(cwd, cfg.generatedDir, 'assets');
  const distAssets = resolve(outDir, 'assets');
  try {
    await fs.cp(generatedAssets, distAssets, { recursive: true, force: true });
  } catch {}
  console.log('english: UniStack build finished (output in', cfg.outDir, '). french: Build UniStack terminé (sortie dans', cfg.outDir, ').');
}

async function cmdDev(cwd: string, parserMode?: string, portArg?: string): Promise<void> {
  const cfg = await readConfig(cwd);
  const ir = await cmdBuild(cwd, parserMode);
  try {
    validateEnvVars((ir as CompilationIR | void)?.backend.env);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }
  const serverModulePath = resolve(cwd, cfg.outDir, 'server.cjs');
  const require = createRequire(import.meta.url);
  const serverModule = require(serverModulePath) as {
    createServer: (runtime: UniRuntime) => import('express').Express;
    attachWebSocketServer?: (server: import('http').Server, runtime: UniRuntime) => void;
  };
  const runtime = new BasicRuntime({
    pyModulePath: resolve(cwd, cfg.generatedDir, 'app.py'),
    databaseUrl: process.env.DATABASE_URL,
    migrationsDir: resolve(cwd, 'migrations'),
  });
  const port = Number(portArg ?? process.env.PORT ?? 3000);
  const server = await startServer(serverModule.createServer, runtime, { port });
  if (serverModule.attachWebSocketServer) {
    serverModule.attachWebSocketServer(server, runtime);
    console.log('english: WebSocket server attached. french: Serveur WebSocket attaché.');
  }
}

async function cmdDevWatch(cwd: string, parserMode?: string, portArg?: string): Promise<void> {
  const cfg = await readConfig(cwd);
  let server: import('node:http').Server | null = null;
  const hmrPort = 3001;
  const wss = new WebSocketServer({ port: hmrPort });
  const hmrClients = new Set<WebSocket>();
  wss.on('connection', (ws: WebSocket) => {
    hmrClients.add(ws);
    (ws as any).on('close', () => hmrClients.delete(ws));
  });
  let rebuilding = false;
  let pending = false;
  const start = async () => {
    const ir = await cmdBuild(cwd, parserMode, true);
    try {
      validateEnvVars((ir as CompilationIR | void)?.backend.env);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
    const serverModulePath = resolve(cwd, cfg.outDir, 'server.cjs');
    const require = createRequire(import.meta.url);
    const serverModule = require(serverModulePath) as {
      createServer: (runtime: UniRuntime) => import('express').Express;
      attachWebSocketServer?: (server: import('http').Server, runtime: UniRuntime) => void;
    };
    const runtime = new BasicRuntime({
      pyModulePath: resolve(cwd, cfg.generatedDir, 'app.py'),
      databaseUrl: process.env.DATABASE_URL,
      migrationsDir: resolve(cwd, 'migrations'),
    });
    const port = Number(portArg ?? process.env.PORT ?? 3000);
    server = await startServer(serverModule.createServer, runtime, { port });
    if (serverModule.attachWebSocketServer) {
      serverModule.attachWebSocketServer(server, runtime);
    }
  };
  const rebuild = async () => {
    if (rebuilding) {
      pending = true;
      return;
    }
    rebuilding = true;
    try {
      if (server) {
        await new Promise<void>(resolveClose => {
          server!.close(() => resolveClose());
          hmrClients.forEach(client => client.close());
          hmrClients.clear();
        });
        server = null;
      }
      await start();
      hmrClients.forEach(client => client.send(JSON.stringify({ type: 'reload' })));
    } catch (err) {
      console.error('english: watch rebuild failed. french: rebuild watch échoué.', err);
      const errorMessage = (err as Error).message;
      hmrClients.forEach(client => client.send(JSON.stringify({ type: 'error', message: errorMessage })));
    } finally {
      rebuilding = false;
      if (pending) {
        pending = false;
        await rebuild();
      }
    }
  };
  await start();
  async function updateDependencyWatchers() {
    const entryPath = resolve(cwd, cfg.entry);
    const deps = await gatherImportedFiles(entryPath, !!parserMode);
    return [...deps, resolve(cwd, 'unistack.config.json'), resolve(cwd, 'src/runtime')];
  }
  const watchPaths = await updateDependencyWatchers();
  const watcher = chokidar.watch(watchPaths, { ignored: /(^|[\/\\])\../, persistent: true });
  watcher.on('change', async (path: string) => {
    console.log(`File ${path} has been changed`);
    const newPaths = await updateDependencyWatchers();
    watcher.add(newPaths);
    await rebuild();
  });
  console.log('english: UniStack watch mode enabled. french: Mode watch UniStack activé.');
}

async function cmdTest(cwd: string, parserMode?: string) {
  console.log('english: Running UniStack tests... french: Lancement des tests UniStack...');
  const cfg = await readConfig(cwd);
  const ast = await loadAndMerge(resolve(cwd, cfg.entry), !!parserMode);
  const testSection = ast.sections.find(s => s.kind === 'test') as TestSection | undefined;
  if (!testSection || testSection.cases.length === 0) {
    console.log('english: No tests found in the `test:` section. french: Aucun test trouvé dans la section `test:`.');
    return;
  }
  const ir = await buildUniStack({
    entryPath: resolve(cwd, cfg.entry),
    generatedDir: resolve(cwd, cfg.generatedDir),
  });
  await cmdBuild(cwd, parserMode);
  const serverModulePath = resolve(cwd, cfg.outDir, 'server.cjs');
  const require = createRequire(import.meta.url);
  const serverModule = require(serverModulePath) as { createServer: (runtime: UniRuntime) => import('express').Express };
  const runtime = new BasicRuntime({ pyModulePath: resolve(cwd, cfg.generatedDir, 'app.py') });
  const server = await startServer(serverModule.createServer, runtime, { port: 0 });
  const address = server.address() as import('net').AddressInfo;
  const baseUrl = `http://localhost:${address.port}`;
  let passed = 0;
  let failed = 0;
  for (const testCase of testSection.cases) {
    const testContext: { [key: string]: any } = {};
    let testFailed = false;
    for (const step of testCase.steps) {
      if (testFailed) break;
      try {
        if (step.kind === 'request') {
          const res = await fetch(`${baseUrl}${step.path}`, {
            method: step.method,
            body: step.body,
            headers: { 'Content-Type': 'application/json' },
          });
          testContext[step.variable] = {
            status: res.status,
            body: await res.json(),
          };
        } else if (step.kind === 'assert') {
          const assertFn = new Function('context', `with(context) { return ${step.expression}; }`);
          const result = assertFn(testContext);
          if (!result) {
            throw new Error(`Assertion failed: ${step.expression}`);
          }
        }
      } catch (e) {
        console.error(`[Cross] Test failed: "${testCase.name}"\n   Step failed: ${step.kind === 'assert' ? step.expression : `${step.method} ${step.path}`}\n   Reason: ${(e as Error).message}`);
        testFailed = true;
        failed++;
      }
    }
    if (!testFailed) {
      console.log(`[OK] Test passed: "${testCase.name}"`);
      passed++;
    }
  }
  server.close();
  console.log(`\nTest summary: ${passed} passed, ${failed} failed.`);
  process.exit(failed > 0 ? 1 : 0);
}

async function loadAndMerge(path: string, useAntlr: boolean): Promise<UniFile> {
  const src = await fs.readFile(path, 'utf8');
  if (useAntlr) {
    return parseUniFileAntlr(src, path);
  }
  return parseUniFile(src, path);
}

function getFlagValue(args: string[], flag: string): string | null {
  const idx = args.indexOf(flag);
  if (idx === -1) return null;
  return args[idx + 1] ?? null;
}

async function listTemplates(cwd: string): Promise<string[]> {
  const templatesDir = resolve(cwd, 'templates');
  try {
    const entries = await fs.readdir(templatesDir, { withFileTypes: true });
    return entries.filter(e => e.isDirectory()).map(e => e.name).sort();
  } catch {
    return [];
  }
}

async function main(): Promise<void> {
  const [, , cmd, ...args] = process.argv;
  const cwd = process.cwd();
  const parserMode = getFlagValue(args, '--parser');
  const portArg = getFlagValue(args, '--port') ?? args.find(a => /^[0-9]+$/.test(a)) ?? null;
  try {
    if (cmd === 'init') {
      await cmdInit(cwd);
    } else if (cmd === 'build') {
      await cmdBuild(cwd, parserMode ?? undefined);
    } else if (cmd === 'dev') {
      if (args.includes('--watch')) {
        await cmdDevWatch(cwd, parserMode ?? undefined, portArg ?? undefined);
      } else {
        await cmdDev(cwd, parserMode ?? undefined, portArg ?? undefined);
      }
    } else if (cmd === 'templates') {
      const list = await listTemplates(cwd);
      console.log(list.join('\n'));
    } else if (cmd === 'studio') {
      const file = getFlagValue(args, '--file') ?? resolve(cwd, 'src', 'app.uni');
      const port = Number(getFlagValue(args, '--port') ?? 5050);
      await startStudio({ port, entryFile: file });
    } else if (cmd === 'build-playground') {
      await buildPlayground(cwd);
    } else if (cmd === 'fmt') {
      const file = getFlagValue(args, '--file') ?? resolve(cwd, 'src', 'app.uni');
      await formatUniFile({ file });
      console.log('english: formatted. french: formaté.');
    } else if (cmd === 'lint') {
      const file = getFlagValue(args, '--file') ?? resolve(cwd, 'src', 'app.uni');
      const issues = await lintUniFile({ file });
      if (issues.length === 0) {
        console.log('english: no lint issues. french: aucun problème lint.');
      } else {
        for (const issue of issues) {
          console.log(`lint:${issue.line}: ${issue.message}`);
        }
        process.exitCode = 1;
      }
    } else if (cmd === 'pack') {
      const sub = args[0];
      if (sub === 'install') {
        const pkg = args[1];
        const target = getFlagValue(args, '--target') as 'web' | 'native' | 'hybrid' | undefined;
        if (!pkg) {
          console.error('english: pack install requires a package name. french: pack install nécessite un nom de paquet.');
          process.exitCode = 1;
        } else {
          await installPackage(pkg, target ?? 'web');
        }
      } else if (sub === 'publish') {
        const path = args[1];
        if (!path) {
          console.error('english: pack publish requires a path. french: pack publish nécessite un chemin.');
          process.exitCode = 1;
        } else {
          await publishPackage(path);
        }
      } else {
        console.log('english: Usage: unistack pack <install|publish> [name|path] [--target web|native|hybrid]. french: Utilisation : unistack pack <install|publish> [nom|chemin] [--target web|native|hybrid].');
      }
    } else if (cmd === 'test') {
      await cmdTest(cwd, parserMode ?? undefined);
    } else {
      console.log(
        'english: Usage: unistack <init|build|dev|fmt|lint|templates|pack> [--watch] [--parser antlr|manual] [--port 3000] [--file path] [--template name]. ' +
          'french: Utilisation : unistack <init|build|dev|fmt|lint|templates|pack> [--watch] [--parser antlr|manual] [--port 3000] [--file path] [--template name].',
      );
      process.exitCode = 1;
    }
  } catch (err) {
    console.error((err as Error).message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && process.argv[1].endsWith('cli.js')) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}

const DEFAULT_APP_TEMPLATE = `unistack app "UniStackApp" version 1.0 {
  config: port=3000;

  html-ui:
    <div class="app">
      <h1>{py:title()}</h1>
      <p>{py:subtitle()}</p>
    </div>;

  css:
    .app { font-family: Arial, sans-serif; padding: 24px; };

  py-logic:
    def title():
      return "Hello from UniStack"

    def subtitle():
      return "Generated from the basic template"

  routes:
    GET /api/hello { return py:title(); }
}
`;

