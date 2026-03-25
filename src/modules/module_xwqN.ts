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

/**
 * UniStd – standard library for UniStack
 * Provides network, graphics and filesystem helpers so that apps
 * require zero external dependencies.
 */

import { promises as fs } from 'node:fs';

// Node 18+ ships with global fetch. Fallback for older versions.
const _fetch = typeof fetch !== 'undefined' ? fetch : (await import('node-fetch')).default;

export const http = {
  /**
   * Perform a simple GET request and return text (or JSON if requested)
   */
  async get(url: string, asJson = false): Promise<any> {
    const res = await _fetch(url);
    if (asJson) return res.json();
    return res.text();
  },
};

export const UI = {
  /**
   * Render a UI fragment. Under the hood this hooks into isomorphic
   * generation so that WASM/WebGPU code can be emitted where needed.
   */
  render(fragment: string): string {
    // simple wrapper – in a real implementation this would call
    // the isomorphic compiler to produce efficient code.
    return `<div class="unistack-ui">${fragment}</div>`;
  },
};

export const FS = {
  readFile: fs.readFile,
  writeFile: fs.writeFile,
  listDir: fs.readdir,
  exists: async (path: string) => {
    try {
      await fs.access(path);
      return true;
    } catch {
      return false;
    }
  },
};

export default { http, UI, FS };