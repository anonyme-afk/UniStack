import { promises as fs } from 'node:fs';
import { resolve } from 'node:path';
import { buildUniStack } from './transpiler/index.js';
import { BasicRuntime, startServer, UniRuntime } from './runtime/server.js';
import { build as esbuildBuild } from 'esbuild';

interface UniStackConfig {
  entry: string;
  outDir: string;
  generatedDir: string;
  serverEntry: string;
  clientEntry: string;
}

async function readConfig(cwd: string): Promise<UniStackConfig> {
  const configPath = resolve(cwd, 'unistack.config.json');
  const raw = await fs.readFile(configPath, 'utf8');
  const parsed = JSON.parse(raw) as UniStackConfig;
  return parsed;
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
    // ignore
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
}

async function cmdBuild(cwd: string): Promise<void> {
  const cfg = await readConfig(cwd);
  const entryPath = resolve(cwd, cfg.entry);

  await buildUniStack({
    entryPath,
    generatedDir: resolve(cwd, cfg.generatedDir),
  });

  // Ensure output directory exists
  const outDir = resolve(cwd, cfg.outDir);
  await fs.mkdir(outDir, { recursive: true });

  // Bundle client and server with esbuild
  await Promise.all([
    esbuildBuild({
      entryPoints: [resolve(cwd, cfg.clientEntry)],
      bundle: true,
      platform: 'browser',
      format: 'esm',
      outfile: resolve(outDir, 'app.js'),
    }),
    esbuildBuild({
      entryPoints: [resolve(cwd, cfg.serverEntry)],
      bundle: true,
      platform: 'node',
      format: 'esm',
      outfile: resolve(outDir, 'server.mjs'),
    }),
  ]);

  // Copy generated HTML into dist
  const generatedHtml = resolve(cwd, cfg.generatedDir, 'index.html');
  const distHtml = resolve(outDir, 'index.html');
  await fs.copyFile(generatedHtml, distHtml);

  console.log(
    'english: UniStack build finished (output in',
    cfg.outDir,
    '). french: Build UniStack terminé (sortie dans',
    cfg.outDir,
    ').',
  );
}

async function cmdDev(cwd: string): Promise<void> {
  const cfg = await readConfig(cwd);

  await cmdBuild(cwd);

  // english: For the MVP, dynamically import the bundled server factory.
  // french:  Pour le MVP, on importe dynamiquement la factory de serveur bundlée.
  const serverModulePath = resolve(cwd, cfg.outDir, 'server.mjs');
  const serverModule = (await import(pathToFileUrl(serverModulePath))) as {
    createServer: (runtime: BasicRuntime) => import('express').Express;
  };

  const runtime = new BasicRuntime(); // BasicRuntime implements UniRuntime
  // TODO: enregistrer ici les fonctions générées depuis py-logic lorsqu’elles existeront.

  startServer(serverModule.createServer, runtime, { port: 3000 });
}

function pathToFileUrl(path: string): string {
  const url = new URL(`file://${path}`);
  return url.toString();
}

async function main(): Promise<void> {
  const [, , cmd] = process.argv;
  const cwd = process.cwd();

  try {
    if (cmd === 'init') {
      await cmdInit(cwd);
    } else if (cmd === 'build') {
      await cmdBuild(cwd);
    } else if (cmd === 'dev') {
      await cmdDev(cwd);
    } else {
      console.log(
        'english: Usage: unistack <init|build|dev>. french: Utilisation : unistack <init|build|dev>.',
      );
      process.exitCode = 1;
    }
  } catch (err) {
    console.error('english: UniStack CLI error. french: Erreur CLI UniStack.', err);
    process.exitCode = 1;
  }
}

// Exécuter seulement si lancé en tant que script principal
// (utile si la CLI est importée comme module ailleurs).
if (process.argv[1] && process.argv[1].endsWith('cli.js')) {
  // eslint-disable-next-line @typescript-eslint/no-floating-promises
  main();
}
