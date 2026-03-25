/*
Copyright 2026 The Developers

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
 * english: Minimal client-side runtime for UniStack.
 *          It attaches DOM events and provides helpers to call API routes.
 * french:  Runtime client minimal pour UniStack.
 *          Gère l’attachement des events et fournit des helpers pour appeler les routes API.
 */

export interface FetchJsonOptions {
  method?: string;
  body?: unknown;
}

export async function fetchJson<T = unknown>(url: string, options: FetchJsonOptions = {}): Promise<T> {
  const res = await fetch(url, {
    method: options.method ?? 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    throw new Error(
      `english: UniStack fetchJson error: ${res.status} ${res.statusText}. ` +
        `french: UniStack fetchJson erreur : ${res.status} ${res.statusText}.`,
    );
  }

  return (await res.json()) as T;
}

export function attachDomReady(handler: () => void): void {
  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    handler();
  } else {
    document.addEventListener('DOMContentLoaded', handler);
  }
}
