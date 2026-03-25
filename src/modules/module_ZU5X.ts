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

export interface UniRuntime {
  callPy(name: string, ...args: unknown[]): Promise<unknown> | unknown;
  sql(query: string, params?: unknown[]): Promise<unknown[]>;
}

export interface ServerOptions {
  port: number;
}

/**
 * english: Minimal Node runtime for UniStack.
 *          For the MVP, Python-like functions are manually registered in a table.
 * french:  Runtime Node minimal pour UniStack.
 *          Pour le MVP, les fonctions Python sont enregistrées manuellement dans une table.
 */
export class BasicRuntime implements UniRuntime {
  private pyFunctions = new Map<string, (...args: unknown[]) => unknown | Promise<unknown>>();

  registerPy(name: string, fn: (...args: unknown[]) => unknown | Promise<unknown>): void {
    this.pyFunctions.set(name, fn);
  }

  async callPy(name: string, ...args: unknown[]): Promise<unknown> {
    const fn = this.pyFunctions.get(name);
    if (!fn) {
      throw new Error(
        `english: UniStack runtime: py function not found: ${name}. ` +
          `french: UniStack runtime : fonction py introuvable : ${name}`,
      );
    }
    return await fn(...args);
  }

  async sql(query: string, params: unknown[] = []): Promise<unknown[]> {
    // english: Stub for the MVP: to be replaced by a real implementation (SQLite, etc.).
    // french:  Stub pour le MVP : à remplacer par une vraie implémentation (SQLite, etc.).
    console.warn(
      'english: UniStack runtime.sql called with query (stub only). french: UniStack runtime.sql appelé avec une requête (stub uniquement).',
      query,
      params,
    );
    return [];
  }
}

export function startServer<R extends UniRuntime>(
  createApp: (runtime: R) => express.Express,
  runtime: R,
  options: ServerOptions,
): void {
  const app = createApp(runtime);
  const port = options.port;
  app.listen(port, () => {
    console.log(
      `english: UniStack server listening on http://localhost:${port}. ` +
        `french: Serveur UniStack en écoute sur http://localhost:${port}.`,
    );
  });
}
