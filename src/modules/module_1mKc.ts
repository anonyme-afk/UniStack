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

import express from 'express';
import helmet from 'helmet';
import { createServer as createHttpServer } from 'node:http';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { resolve } from 'node:path';
import { promises as fs } from 'node:fs';
import { EventEmitter } from 'node:events';
// @ts-ignore no type definitions shipped for sql.js
import initSqlJs from 'sql.js';

const execFileAsync = promisify(execFile);

export interface UniRuntime {
  registerPy(name: string, fn: (...args: unknown[]) => unknown | Promise<unknown>): void;
  callPy(name: string, ...args: unknown[]): Promise<unknown> | unknown;
  sql(query: string, params?: unknown[]): Promise<unknown[]>;
  setPersist(key: string, value: unknown): Promise<void>;
  getPersist(key: string): Promise<unknown>;
  subscribePersist(listener: (key: string, value: unknown) => void): () => void;
}

export interface ServerOptions {
  port: number;
  maxPortRetries?: number;
}

/**
 * english: Node runtime for UniStack.
 * french:  Runtime Node pour UniStack.
 */
export interface BasicRuntimeOptions {
  pyModulePath?: string;
  databaseUrl?: string;
  migrationsDir?: string;
  pyTimeoutMs?: number;
  pyFailureThreshold?: number;
  pyCooldownMs?: number;
  pythonBinary?: string;
}

export class BasicRuntime implements UniRuntime {
  private pyFunctions = new Map<string, (...args: unknown[]) => unknown | Promise<unknown>>();
  private pyModulePath?: string;
  private pythonBinary: string;
  private pyTimeoutMs: number;
  private pyFailureThreshold: number;
  private pyCooldownMs: number;
  private pyFailures = new Map<string, number>();
  private pyCircuitOpenUntil = new Map<string, number>();
  private db: any | null = null;
  private dbInit: Promise<void> | null = null;
  private dbPath: string | null = null;
  private migrationsDir: string | null = null;
  private migrationsApplied = false;
  private persistState = new Map<string, unknown>();
  private persistEvents = new EventEmitter();

  constructor(options: BasicRuntimeOptions = {}) {
    this.pyModulePath = options.pyModulePath;
    this.pythonBinary = options.pythonBinary ?? process.env.UNISTACK_PYTHON_BIN ?? 'python';
    this.pyTimeoutMs = Math.max(100, Number(options.pyTimeoutMs ?? process.env.UNISTACK_PY_TIMEOUT_MS ?? 7000));
    this.pyFailureThreshold = Math.max(1, Number(options.pyFailureThreshold ?? process.env.UNISTACK_PY_FAILURE_THRESHOLD ?? 3));
    this.pyCooldownMs = Math.max(500, Number(options.pyCooldownMs ?? process.env.UNISTACK_PY_COOLDOWN_MS ?? 30000));
    this.migrationsDir = options.migrationsDir ?? process.env.UNISTACK_MIGRATIONS_DIR ?? resolve(process.cwd(), 'migrations');
    this.configureDb(options.databaseUrl);
    this.registerPy('notImplemented', () => ({
      error: 'english: handler not implemented | french: gestionnaire non implémenté',
    }));
  }

  registerPy(name: string, fn: (...args: unknown[]) => unknown | Promise<unknown>): void {
    this.pyFunctions.set(name, fn);
  }

  async callPy(name: string, ...args: unknown[]): Promise<unknown> {
    const fn = this.pyFunctions.get(name);
    if (!fn) {
      if (this.pyModulePath) {
        const openUntil = this.pyCircuitOpenUntil.get(name) ?? 0;
        if (openUntil > Date.now()) {
          throw new Error(
            `english: python circuit open for ${name}, retry later. ` +
              `french: circuit python ouvert pour ${name}, réessayez plus tard.`,
          );
        }
        try {
          const result = await callPythonFunction(
            this.pyModulePath,
            name,
            args,
            {
              timeoutMs: this.pyTimeoutMs,
              pythonBinary: this.pythonBinary,
            },
          );
          this.pyFailures.set(name, 0);
          return result;
        } catch (err) {
          const fails = (this.pyFailures.get(name) ?? 0) + 1;
          this.pyFailures.set(name, fails);
          if (fails >= this.pyFailureThreshold) {
            this.pyCircuitOpenUntil.set(name, Date.now() + this.pyCooldownMs);
            this.pyFailures.set(name, 0);
          }
          throw err;
        }
      }
      throw new Error(
        `english: UniStack runtime: py function not found: ${name}. ` +
          `french: UniStack runtime : fonction py introuvable : ${name}`,
      );
    }
    return await withTimeout(Promise.resolve(fn(...args)), this.pyTimeoutMs, `py:${name}`);
  }

  async sql(query: string, params: unknown[] = []): Promise<unknown[]> {
    await this.ensureDb();
    if (!this.db) {
      console.warn(
        'english: UniStack runtime.sql called but no database is configured. french: runtime.sql appelé sans base configurée.',
      );
      return [];
    }
    const normalizedQuery = String(query ?? '').trim();
    if (!normalizedQuery) {
      throw new Error('english: empty SQL query. french: requête SQL vide.');
    }
    if (hasMultipleSqlStatements(normalizedQuery)) {
      throw new Error(
        'english: multiple SQL statements are not allowed in a single call. ' +
          'french: plusieurs requêtes SQL ne sont pas autorisées dans un seul appel.',
      );
    }
    const normalizedParams = normalizeSqlParams(params);
    const kind = firstSqlKeyword(normalizedQuery);
    let rows: Record<string, unknown>[] = [];
    if (kind === 'SELECT' || kind === 'PRAGMA' || kind === 'WITH') {
      const stmt = this.db.prepare(normalizedQuery);
      if (normalizedParams.length > 0) {
        stmt.bind(normalizedParams as any[]);
      }
      while (stmt.step()) {
        rows.push(stmt.getAsObject());
      }
      stmt.free();
    } else {
      this.db.run(normalizedQuery, normalizedParams as any[]);
      const meta = this.db.exec('SELECT changes() AS changes, last_insert_rowid() AS lastInsertRowid');
      if (Array.isArray(meta) && meta.length > 0) {
        rows = (meta[0]?.values ?? []).map((vals: unknown[]) => ({
          changes: vals[0] ?? 0,
          lastInsertRowid: vals[1] ?? null,
        }));
      }
    }
    await this.persistDb();
    return rows;
  }

  async setPersist(key: string, value: unknown): Promise<void> {
    this.persistState.set(key, value);
    this.persistEvents.emit('persist:update', key, value);
  }

  async getPersist(key: string): Promise<unknown> {
    return this.persistState.get(key);
  }

  subscribePersist(listener: (key: string, value: unknown) => void): () => void {
    const wrapped = (key: string, value: unknown) => listener(key, value);
    this.persistEvents.on('persist:update', wrapped);
    return () => {
      this.persistEvents.off('persist:update', wrapped);
    };
  }

  private configureDb(databaseUrl?: string): void {
    const url = databaseUrl ?? process.env.DATABASE_URL ?? 'sqlite:unistack.db';
    if (!url || !url.startsWith('sqlite:')) {
      this.dbPath = null;
      return;
    }
    this.dbPath = url.slice('sqlite:'.length) || 'unistack.db';
  }

  private async ensureDb(): Promise<void> {
    if (this.dbInit) {
      await this.dbInit;
      return;
    }
    this.dbInit = (async () => {
      const SQL = await initSqlJs();
      if (this.dbPath) {
        try {
          const data = await fs.readFile(this.dbPath);
          this.db = new SQL.Database(data);
        } catch {
          this.db = new SQL.Database();
        }
      } else {
        this.db = new SQL.Database();
      }
      await this.applyMigrations();
    })();
    await this.dbInit;
  }

  private async persistDb(): Promise<void> {
    if (!this.db || !this.dbPath) return;
    try {
      const data = this.db.export();
      await fs.writeFile(this.dbPath, Buffer.from(data));
    } catch {
      // Ignore persistence errors to avoid blocking request handling.
    }
  }

  private async applyMigrations(): Promise<void> {
    if (this.migrationsApplied || !this.db || !this.migrationsDir) return;

    this.db.run(
      'CREATE TABLE IF NOT EXISTS _unistack_migrations (name TEXT PRIMARY KEY, applied_at TEXT NOT NULL)',
    );
    let files: string[] = [];
    try {
      const dirEntries = await fs.readdir(this.migrationsDir, { withFileTypes: true });
      files = dirEntries
        .filter(e => e.isFile() && e.name.toLowerCase().endsWith('.sql'))
        .map(e => e.name)
        .sort((a, b) => a.localeCompare(b));
    } catch {
      this.migrationsApplied = true;
      return;
    }

    for (const name of files) {
      const already = this.db.exec(`SELECT name FROM _unistack_migrations WHERE name = ${sqlQuote(name)}`);
      if (Array.isArray(already) && already.length > 0 && (already[0].values?.length ?? 0) > 0) {
        continue;
      }
      const fullPath = resolve(this.migrationsDir, name);
      const sql = (await fs.readFile(fullPath, 'utf8')).trim();
      if (!sql) continue;
      try {
        this.db.run('BEGIN');
        this.db.exec(sql);
        this.db.run(
          'INSERT INTO _unistack_migrations(name, applied_at) VALUES(?, ?)',
          [name, new Date().toISOString()],
        );
        this.db.run('COMMIT');
      } catch (err) {
        try {
          this.db.run('ROLLBACK');
        } catch {
          // ignore rollback failures
        }
        const message = err instanceof Error ? err.message : String(err);
        throw new Error(
          `english: failed migration ${name}: ${message}. ` +
            `french: migration échouée ${name} : ${message}.`,
        );
      }
    }

    this.migrationsApplied = true;
    await this.persistDb();
  }
}

export async function startServer<R extends UniRuntime>(
  createApp: (runtime: R) => express.Express,
  runtime: R,
  options: ServerOptions,
): Promise<import('node:http').Server> {
  // english: apply extra hardening in production
  // french: appliquer un durcissement supplémentaire en production
  if (process.env.NODE_ENV === 'production') {
    // ensure helmet is active by default for security headers
    try {
      app.use(helmet());
    } catch {}
    // wrap console methods to redact secret-like keys from objects
    const redact = (arg: any) => {
      if (arg && typeof arg === 'object') {
        const clone: any = Array.isArray(arg) ? [] : {};
        for (const [k, v] of Object.entries(arg)) {
          if (/secret|token|password|key/i.test(k)) {
            clone[k] = '***';
          } else {
            clone[k] = redact(v);
          }
        }
        return clone;
      }
      return arg;
    };
    const wrap = (orig: (...args: any[]) => void) => {
      return (...args: any[]) => orig(...args.map(redact));
    };
    console.log = wrap(console.log.bind(console));
    console.error = wrap(console.error.bind(console));
  }

  const app = createApp(runtime);
  const initialPort = options.port;
  const maxRetries = options.maxPortRetries ?? 30;

  const listenOn = async (port: number, retriesLeft: number): Promise<import('node:http').Server> => {
    return await new Promise((resolve, reject) => {
      const server = createHttpServer(app);

      server.once('error', err => {
        const anyErr = err as NodeJS.ErrnoException;
        if (anyErr.code === 'EADDRINUSE' && retriesLeft > 0) {
          const nextPort = port + 1;
          console.warn(
            `english: Port ${port} is already in use, trying ${nextPort}. ` +
              `french: Le port ${port} est déjà utilisé, tentative sur ${nextPort}.`,
          );
          server.close(() => {
            void listenOn(nextPort, retriesLeft - 1).then(resolve).catch(reject);
          });
          return;
        }
        reject(err);
      });

      server.listen(port, () => {
        console.log(
          `english: UniStack server listening on http://localhost:${port}. ` +
            `french: Serveur UniStack en écoute sur http://localhost:${port}.`,
        );
        if (port !== initialPort) {
          console.log(
            `english: Requested port ${initialPort} was busy, switched to ${port}. ` +
              `french: Le port demandé ${initialPort} était occupé, passage sur ${port}.`,
          );
        }
        resolve(server);
      });
    });
  };

  try {
    return await listenOn(initialPort, maxRetries);
  } catch (err) {
    const anyErr = err as NodeJS.ErrnoException;
    if (anyErr.code === 'EADDRINUSE') {
      console.error(
        `english: Could not find a free port in range ${initialPort}-${initialPort + maxRetries}. ` +
          `french: Aucun port libre trouvé dans la plage ${initialPort}-${initialPort + maxRetries}.`,
      );
    } else {
      console.error('english: Server error. french: Erreur serveur.', err);
    }
    process.exitCode = 1;
    throw err;
  }
}

async function callPythonFunction(
  modulePath: string,
  funcName: string,
  args: unknown[],
  options: { timeoutMs: number; pythonBinary: string },
): Promise<unknown> {
  const script = `
import json, importlib.util, sys
module_path = sys.argv[1]
func_name = sys.argv[2]
args_json = sys.argv[3]
spec = importlib.util.spec_from_file_location("unistack_mod", module_path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)
args = json.loads(args_json)
res = getattr(mod, func_name)(*args)
print(json.dumps(res))
`.trim();

  const abs = resolve(modulePath);
  try {
    const { stdout } = await execFileAsync(
      options.pythonBinary,
      ['-c', script, abs, funcName, JSON.stringify(args)],
      { timeout: options.timeoutMs, maxBuffer: 5 * 1024 * 1024 } as any,
    );
    const text = String(stdout).trim();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    throw new Error(
      `english: UniStack python call failed: ${message}. ` +
        `french: Appel python UniStack échoué : ${message}`,
    );
  }
}

function firstSqlKeyword(query: string): string {
  return query.trimStart().split(/\s+/, 1)[0]?.toUpperCase() ?? '';
}

function hasMultipleSqlStatements(query: string): boolean {
  let quote: '"' | "'" | null = null;
  let escaped = false;
  let semicolons = 0;
  for (let i = 0; i < query.length; i += 1) {
    const ch = query[i];
    if (quote) {
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'";
      continue;
    }
    if (ch === ';') semicolons += 1;
  }
  if (semicolons === 0) return false;
  const stripped = query.trim().replace(/;+$/, '');
  return stripped.includes(';');
}

function normalizeSqlParams(params: unknown[]): Array<string | number | boolean | null> {
  if (!Array.isArray(params)) return [];
  return params.map((p, idx) => {
    if (p === null || p === undefined) return null;
    if (typeof p === 'string' || typeof p === 'number' || typeof p === 'boolean') return p;
    throw new Error(
      `english: invalid SQL param at index ${idx}; only string/number/boolean/null are supported. ` +
        `french: paramètre SQL invalide à l'index ${idx}; seuls string/number/boolean/null sont supportés.`,
    );
  });
}

function sqlQuote(value: string): string {
  return `'${value.replace(/'/g, "''")}'`;
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => {
        reject(
          new Error(
            `english: timeout in ${label} after ${timeoutMs}ms. ` +
              `french: timeout dans ${label} après ${timeoutMs}ms.`,
          ),
        );
      }, timeoutMs);
    }),
  ]);
}
