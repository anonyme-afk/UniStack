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
      error: 'handler not implemented',
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
          throw new Error(`python circuit open for ${name}, retry later.`);
        }
        try {
          const result = await callPythonFunction(this.pyModulePath, name, args, {
            timeoutMs: this.pyTimeoutMs,
            pythonBinary: this.pythonBinary,
          });
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
      throw new Error(`UniStack runtime: py function not found: ${name}`);
    }
    return await withTimeout(Promise.resolve(fn(...args)), this.pyTimeoutMs, `py:${name}`);
  }

  async sql(query: string, params: unknown[] = []): Promise<unknown[]> {
    await this.ensureDb();
    if (!this.db) return [];
    const normalizedQuery = String(query ?? '').trim();
    if (!normalizedQuery) throw new Error('empty SQL query');
    
    // basic execution logic
    const stmt = this.db.prepare(normalizedQuery);
    if (params.length > 0) stmt.bind(params as any[]);
    const rows = [];
    while (stmt.step()) rows.push(stmt.getAsObject());
    stmt.free();
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
    if (url.startsWith('sqlite:')) {
      this.dbPath = url.slice('sqlite:'.length) || 'unistack.db';
    }
  }

  private async ensureDb(): Promise<void> {
    if (this.dbInit) return this.dbInit;
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
    })();
    return this.dbInit;
  }

  private async persistDb(): Promise<void> {
    if (!this.db || !this.dbPath) return;
    try {
      const data = this.db.export();
      await fs.writeFile(this.dbPath, Buffer.from(data));
    } catch {}
  }
}

export async function startServer<R extends UniRuntime>(
  createApp: (runtime: R) => express.Express,
  runtime: R,
  options: ServerOptions,
): Promise<import('node:http').Server> {
  const app = createApp(runtime);
  const server = createHttpServer(app);
  return new Promise((resolve) => {
    server.listen(options.port, () => {
      console.log(`UniStack server listening on http://localhost:${options.port}`);
      resolve(server);
    });
  });
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

  const { stdout } = await execFileAsync(
    options.pythonBinary,
    ['-c', script, resolve(modulePath), funcName, JSON.stringify(args)],
    { timeout: options.timeoutMs } as any,
  );
  return JSON.parse(String(stdout).trim());
}

async function withTimeout<T>(promise: Promise<T>, timeoutMs: number, label: string): Promise<T> {
  return await Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      setTimeout(() => reject(new Error(`timeout in ${label} after ${timeoutMs}ms`)), timeoutMs);
    }),
  ]);
}
