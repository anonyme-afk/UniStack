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

console.log("UniStack client ready.");

// english: UniStack client bootstrap
// french:  Bootstrap client UniStack
export function bootstrap() {
  const placeholders = [{"id":"uniref_0","lang":"py","name":"title","args":[],"label":"py:title"}];
  for (const item of placeholders) {
    const el = document.querySelector(`[data-uniref="${item.id}"]`);
    if (!el) continue;
    if (item.lang === 'py') {
      resolvePy(item, el);
    } else if (item.lang === 'sql') {
      resolveSql(item, el);
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
    const res = await fetch(`/__unistack/py/${item.name}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ args: item.args ?? [] }),
    });
    const data = await res.json();
    el.textContent = formatValue(data);
  } catch (err) {
    el.textContent = el.getAttribute('data-uniref-fallback') ?? '';
  }
}

async function resolveSql(item, el) {
  try {
    const res = await fetch('/__unistack/sql', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: item.query }),
    });
    const data = await res.json();
    el.textContent = formatValue(data);
  } catch (err) {
    el.textContent = el.getAttribute('data-uniref-fallback') ?? '';
  }
}

function formatValue(value) {
  if (value === null || value === undefined) return '';
  if (typeof value === 'string') return value;
  return JSON.stringify(value);
}
