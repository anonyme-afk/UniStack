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
import type { UniRuntime } from '../src/runtime/server.js';
import { WorkerPool } from '../src/runtime/workerPool.js';

export function createServer(runtime: UniRuntime) {
  const app = express();
  app.use(express.json());
  app.use('/assets', express.static('assets'));
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

  const pyBindings = [{"name":"title","kind":"literal","value":{"kind":"string","value":"Imported"}}];
  const notFoundHtml = "<!doctype html>\n<html lang=\"en\">\n  <head>\n    <meta charset=\"utf-8\" />\n    <title>404 — UniStack</title>\n    <style>\n      body { font-family: Arial, sans-serif; background: #0a0a0a; color: #fff; margin: 0; }\n      .wrap { min-height: 100vh; display: grid; place-items: center; padding: 40px; }\n      .card { max-width: 560px; text-align: center; }\n      .card h1 { font-size: 48px; margin: 0 0 10px; }\n      .card p { color: #bdbdbd; }\n      .card a { color: #20b7e8; text-decoration: none; }\n    </style>\n  </head>\n  <body>\n    <div class=\"wrap\">\n      <div class=\"card\">\n        <h1>404</h1>\n        <p>Page not found.</p>\n        <p><a href=\"/\">Back to home</a></p>\n      </div>\n    </div>\n  </body>\n</html>";
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

  app.get('/events', async (req, res) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();
    const unsubscribe = runtime.subscribePersist((key, value) => {
      const payload = JSON.stringify({ key, value });
      res.write(`event: persist\ndata: ${payload}\n\n`);
    });
    const ping = setInterval(() => {
      res.write('event: ping\ndata: {}\n\n');
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



  app.use((req, res) => {
    res.status(404).send(notFoundHtml);
  });

  return app;
}
