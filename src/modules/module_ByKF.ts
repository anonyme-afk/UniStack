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
// Load dotenv as early as possible so env vars from .env are available to all modules.
// Use top-level await to ensure it runs before the module continues. If dotenv isn't
// installed, continue silently.
try {
  // @ts-ignore: optional runtime dependency
  const _dotenv = await import('dotenv');
  _dotenv.config();
} catch {}
import { resolve } from 'node:path';
import { buildUniStack } from './transpiler/index.js';
import type { CompilationIR } from './lang/ast.js';
import { BasicRuntime, startServer, UniRuntime } from './runtime/server.js';
import { installPackage, publishPackage } from './cli/unipack.js';
import { formatUniFile } from './tools/formatter.js';
import { lintUniFile } from './tools/linter.js';
import { build as esbuildBuild } from 'esbuild';
import { pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
import { watch } from 'node:fs';
import { parseUniFile } from './parser/uniParser.js';
import { dirname, resolve as resolvePath } from 'node:path';

// recursively collect all files referenced via imports in a UniStack project
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
  const importsSection = ast.sections.find(s => s.kind === 'imports') as any;
  if (importsSection) {
    const entries: { path: string }[] = [];
    if (importsSection.entries) entries.push(...importsSection.entries);
    if (importsSection.paths) entries.push(...importsSection.paths.map((p: string) => ({ path: p })));
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

  // schema validation using Ajv
  try {
    const Ajv = (await import('ajv')).default;
    const schemaText = await fs.readFile(resolve(__dirname, '..', 'unistack.schema.json'), 'utf8');
    const schema = JSON.parse(schemaText);
    const ajv = new Ajv({ allErrors: true });
    const valid = ajv.validate(schema, parsed);
    if (!valid) {
      throw new Error('unistack.config.json schema validation failed: ' + ajv.errorsText());
    }
  } catch (err) {
    // if Ajv cannot be loaded, just warn but continue
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
    console.log(
      'english: unistack.config.json already exists, nothing to do. french: unistack.config.json existe déjà, rien à faire.',
    );
    return;
  } catch {
    // english: Ignore errors if file does not exist
    // french:  Ignorer les erreurs si le fichier n'existe pas
  }

  const defaultConfig: UniStackConfig = {
    entry: 'src/app.uni',
    outDir: 'dist',
    generatedDir: 'generated',
    serverEntry: 'generated/app.server.ts',
    clientEntry: 'generated/app.client.ts',
  };

  await fs.writeFile(configPath, JSON.stringify(defaultConfig, null, 2), 'utf8');
  console.log(
    'english: File unistack.config.json created. french: Fichier unistack.config.json créé.',
  );

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
    } catch {
      // fallback to inline template
    }
    await fs.writeFile(appPath, template, 'utf8');
    console.log(
      'english: File src/app.uni created from template. french: Fichier src/app.uni créé depuis le template.',
    );
  }
}

export async function cmdBuild(cwd: string, parserMode?: string): Promise<CompilationIR | void> {
  if (parserMode) {
    process.env.UNISTACK_PARSER = parserMode;
  }
  const cfg = await readConfig(cwd);
  const entryPath = resolve(cwd, cfg.entry);

  const ir = await buildUniStack({
    entryPath,
    generatedDir: resolve(cwd, cfg.generatedDir),
  });

  // env example generation
  if (ir && ir.backend.env && ir.backend.env.length > 0) {
    const lines: string[] = ['# automatically generated by UniStack'];
    for (const v of ir.backend.env) {
      const info = `${v.name} (${v.required ? 'required' : 'optional'} ${v.type}` +
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
    } catch {
      // ignore
    }
  }

  // english: Ensure output directory exists
  // french:  Assurer que le répertoire de sortie existe
  const outDir = resolve(cwd, cfg.outDir);
  await fs.mkdir(outDir, { recursive: true });

  // english: Bundle client and server with esbuild
  // french:  Bundler client et serveur avec esbuild
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

  // english: Copy generated HTML into dist
  // french:  Copier le HTML généré dans dist
  const generatedHtml = resolve(cwd, cfg.generatedDir, 'index.html');
  const distHtml = resolve(outDir, 'index.html');
  await fs.copyFile(generatedHtml, distHtml);

  // add default design CSS from UIEngine
  try {
    const ui = await import('./compiler/ui-engine.js');
    const baseCss = ui.UIEngine.defaultCss();
    const basePath = resolve(cwd, cfg.generatedDir, 'assets', 'base.css');
    await fs.mkdir(resolve(cwd, cfg.generatedDir, 'assets'), { recursive: true });
    await fs.writeFile(basePath, baseCss, 'utf8');
  } catch {
    // ignore if UIEngine can't be loaded yet
  }
  // english: Copy assets directory (including design system base.css)
  // french:  Copier le répertoire assets (y compris le système de design base.css)
  const generatedAssets = resolve(cwd, cfg.generatedDir, 'assets');
  const distAssets = resolve(outDir, 'assets');
  try {
    await fs.cp(generatedAssets, distAssets, { recursive: true, force: true });
  } catch {
    // english: Assets directory may not exist yet, continue gracefully
    // french:  Le répertoire assets peut ne pas exister encore, continuer gracieusement
  }

  console.log(
    'english: UniStack build finished (output in',
    cfg.outDir,
    '). french: Build UniStack terminé (sortie dans',
    cfg.outDir,
    ').',
  );
}

async function cmdDev(cwd: string, parserMode?: string, portArg?: string): Promise<void> {
  const cfg = await readConfig(cwd);

  const ir = await cmdBuild(cwd, parserMode);
  // perform immediate validation of required env vars at startup
  try {
    validateEnvVars(ir?.backend.env);
  } catch (err) {
    console.error((err as Error).message);
    process.exit(1);
  }

  // english: Dynamically import the bundled server factory.
  // french:  Importer dynamiquement la factory de serveur bundlée.
  const serverModulePath = resolve(cwd, cfg.outDir, 'server.cjs');
  const require = createRequire(import.meta.url);
  const serverModule = require(serverModulePath) as {
    createServer: (runtime: BasicRuntime) => import('express').Express;
  };

  const runtime = new BasicRuntime({
    pyModulePath: resolve(cwd, cfg.generatedDir, 'app.py'),
    databaseUrl: process.env.DATABASE_URL,
    migrationsDir: resolve(cwd, 'migrations'),
  }); // BasicRuntime implements UniRuntime

  const port = Number(portArg ?? process.env.PORT ?? 3000);
  await startServer(serverModule.createServer, runtime, { port });
}

async function cmdDevWatch(cwd: string, parserMode?: string, portArg?: string): Promise<void> {
  const cfg = await readConfig(cwd);
  let server: import('node:http').Server | null = null;
  let rebuilding = false;
  let pending = false;

  const start = async () => {
    const ir = await cmdBuild(cwd, parserMode);
    try {
      validateEnvVars(ir?.backend.env);
    } catch (err) {
      console.error((err as Error).message);
      process.exit(1);
    }
    const serverModulePath = resolve(cwd, cfg.outDir, 'server.cjs');
    const require = createRequire(import.meta.url);
    const serverModule = require(serverModulePath) as {
      createServer: (runtime: BasicRuntime) => import('express').Express;
    };
    const runtime = new BasicRuntime({
      pyModulePath: resolve(cwd, cfg.generatedDir, 'app.py'),
      databaseUrl: process.env.DATABASE_URL,
      migrationsDir: resolve(cwd, 'migrations'),
    });
    const port = Number(portArg ?? process.env.PORT ?? 3000);
    server = await startServer(serverModule.createServer, runtime, { port });
  };

  const rebuild = async () => {
    if (rebuilding) {
      pending = true;
      return;
    }
    rebuilding = true;
    try {
      if (server) {
        await new Promise<void>(resolveClose => server!.close(() => resolveClose()));
        server = null;
      }
      await start();
    } catch (err) {
      console.error('english: watch rebuild failed. french: rebuild watch échoué.', err);
    } finally {
      rebuilding = false;
      if (pending) {
        pending = false;
        await rebuild();
      }
    }
  };

  await start();

  const debounce = (() => {
    let t: NodeJS.Timeout | null = null;
    return () => {
      if (t) clearTimeout(t);
      t = setTimeout(() => {
        void rebuild();
      }, 200);
    };
  })();

  const watchPaths = new Set<string>([
    resolve(cwd, 'src'),
    resolve(cwd, 'unistack.config.json'),
  ]);

  // keep track of individual file watchers for imported modules
  const extraWatchers: Map<string, import('fs').FSWatcher> = new Map();

  async function updateDependencyWatchers() {
    const entryPath = resolve(cwd, cfg.entry);
    const deps = await gatherImportedFiles(entryPath, !!parserMode);
    for (const dep of deps) {
      if (!watchPaths.has(dep) && !extraWatchers.has(dep)) {
        try {
          const w = watch(dep, () => debounce());
          extraWatchers.set(dep, w);
        } catch {
          // ignore files that disappear
        }
      }
    }
  }

  for (const p of watchPaths) {
    watch(p, { recursive: true }, () => debounce());
  }

  // initial set of imported files
  await updateDependencyWatchers();

  console.log('english: UniStack watch mode enabled. french: Mode watch UniStack activé.');
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
    } else {
      console.log(
        'english: Usage: unistack <init|build|dev|fmt|lint|templates|pack> [--watch] [--parser antlr|manual] [--port 3000] [--file path] [--template name]. ' +
          'french: Utilisation : unistack <init|build|dev|fmt|lint|templates|pack> [--watch] [--parser antlr|manual] [--port 3000] [--file path] [--template name].',
      );
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('english: UniStack CLI error. french: Erreur CLI UniStack.', err);
    process.exitCode = 1;
  }
}

// english: Execute only if run as main script
// french:  Exécuter seulement si lancé en tant que script principal
// english: (Useful if the CLI is imported as a module elsewhere)
// french:  (utile si la CLI est importée comme module ailleurs)
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
