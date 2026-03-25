const COLOR_MAP: Record<string, string> = {
  red: '#ef4444',
  blue: '#3b82f6',
  green: '#22c55e',
  purple: '#8b5cf6',
  cyan: '#22d3ee',
  pink: '#ec4899',
  orange: '#f97316',
  yellow: '#eab308',
  white: '#ffffff',
  black: '#000000',
  dark: '#0b0b0f',
  light: '#f7f7fb',
  gray: '#b7b7c7',
};

function toCssValue(value: string): string {
  const v = value.trim();
  const lower = v.toLowerCase();
  const themeMatch = v.match(/^Theme\.([A-Za-z0-9_]+)$/);
  if (themeMatch) return `var(--${themeMatch[1].toLowerCase()})`;
  if (COLOR_MAP[lower]) return COLOR_MAP[lower];
  if (/^[A-Za-z_][A-Za-z0-9_-]*$/.test(v)) return `var(--${lower})`;
  if (/^\d+(\.\d+)?$/.test(v)) return `${v}px`;
  return v;
}

function toUnitlessOrValue(value: string): string {
  const v = value.trim();
  if (/^\d+(\.\d+)?$/.test(v)) return v;
  return toCssValue(v);
}

function parseParams(raw: string): Record<string, string> {
  const params: Record<string, string> = {};
  const parts: string[] = [];
  let current = '';
  let depth = 0;
  let quote: '"' | "'" | null = null;

  for (let i = 0; i < raw.length; i += 1) {
    const ch = raw[i];
    if (quote) {
      current += ch;
      if (ch === quote && raw[i - 1] !== '\\') {
        quote = null;
      }
      continue;
    }
    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'";
      current += ch;
      continue;
    }
    if (ch === '(') {
      depth += 1;
      current += ch;
      continue;
    }
    if (ch === ')' && depth > 0) {
      depth -= 1;
      current += ch;
      continue;
    }
    if (ch === ',' && depth === 0) {
      const part = current.trim();
      if (part) parts.push(part);
      current = '';
      continue;
    }
    current += ch;
  }
  const tail = current.trim();
  if (tail) parts.push(tail);

  for (const part of parts) {
    const [k, ...rest] = part.split('=');
    if (!k || rest.length === 0) continue;
    params[k.trim()] = rest.join('=').trim();
  }
  return params;
}

function className(base: string, name?: string): string {
  if (!name) return `.u-${base}`;
  return `.u-${base}-${name.toLowerCase()}`;
}

export function styleToCss(lines: string[]): string {
  const out: string[] = [];

  for (const rawLine of lines) {
    const line = rawLine.trim().replace(/;$/, '');
    if (!line) continue;
    const m = line.match(/^([A-Za-z][A-Za-z0-9_]*)\s*\((.*)\)$/);
    if (!m) continue;
    const kind = m[1].toLowerCase();
    const params = parseParams(m[2]);
    const name = params.Name || params.name;

    if (kind === 'theme') {
      const entries: string[] = [];
      for (const [k, v] of Object.entries(params)) {
        if (k.toLowerCase() === 'name') continue;
        entries.push(`--${k.toLowerCase()}:${toCssValue(v)};`);
      }
      if (entries.length > 0) out.push(`:root{${entries.join('')}}`);
      continue;
    }

    if (kind === 'text') {
      const cls = className('text', name);
      const rules: string[] = [];
      if (params.Color) rules.push(`color:${toCssValue(params.Color)};`);
      if (params.Size) rules.push(`font-size:${toCssValue(params.Size)};`);
      if (params.Weight) rules.push(`font-weight:${toUnitlessOrValue(params.Weight)};`);
      if (params.Line) rules.push(`line-height:${toUnitlessOrValue(params.Line)};`);
      if (params.LineHeight) rules.push(`line-height:${toUnitlessOrValue(params.LineHeight)};`);
      if (params.Family) rules.push(`font-family:${params.Family};`);
      if (params.Transform) rules.push(`text-transform:${params.Transform};`);
      out.push(`${cls}{${rules.join('')}}`);
      continue;
    }

    if (kind === 'button') {
      const cls = className('button', name);
      const rules: string[] = ['display:inline-flex;align-items:center;justify-content:center;'];
      if (params.Bg) rules.push(`background:${toCssValue(params.Bg)};`);
      if (params.Color) rules.push(`color:${toCssValue(params.Color)};`);
      if (params.Radius) rules.push(`border-radius:${toCssValue(params.Radius)};`);
      if (params.Padding) rules.push(`padding:${params.Padding};`);
      if (params.Border) rules.push(`border:${params.Border};`);
      if (params.Shadow?.toLowerCase() === 'soft') {
        rules.push('box-shadow:0 10px 30px rgba(0,0,0,.25);');
      }
      if (params.Ring) {
        rules.push(`box-shadow:0 10px 30px ${toCssValue(params.Ring)};`);
      }
      out.push(`${cls}{${rules.join('')}}`);
      continue;
    }

    if (kind === 'card') {
      const cls = className('card', name);
      const rules: string[] = [];
      const hoverRules: string[] = [];
      if (params.Bg) rules.push(`background:${toCssValue(params.Bg)};`);
      if (params.Border) rules.push(`border:${params.Border};`);
      if (params.Radius) rules.push(`border-radius:${toCssValue(params.Radius)};`);
      if (params.Padding) rules.push(`padding:${params.Padding};`);
      if (params.Backdrop) rules.push(`backdrop-filter:blur(${toCssValue(params.Backdrop)});`);
      if (params.Transition) rules.push(`transition:${params.Transition};`);
      if (params.Shadow?.toLowerCase() === 'soft') {
        rules.push('box-shadow:0 10px 30px rgba(0,0,0,.25);');
      }
      if (params.HoverLift) hoverRules.push(`transform:translateY(-${toCssValue(params.HoverLift)});`);
      if (params.HoverBorder) hoverRules.push(`border-color:${toCssValue(params.HoverBorder)};`);
      out.push(`${cls}{${rules.join('')}}`);
      if (hoverRules.length > 0) {
        out.push(`${cls}:hover{${hoverRules.join('')}}`);
      }
      continue;
    }

    if (kind === 'layout') {
      const cls = className('layout', name);
      const rules: string[] = [];
      const type = (params.Type || 'flex').toLowerCase();
      if (type === 'grid') {
        rules.push('display:grid;');
        if (params.Columns) rules.push(`grid-template-columns:${params.Columns};`);
      } else {
        rules.push('display:flex;');
        if (params.Wrap) rules.push(`flex-wrap:${params.Wrap};`);
      }
      if (params.Gap) rules.push(`gap:${toCssValue(params.Gap)};`);
      if (params.Align) rules.push(`align-items:${params.Align};`);
      if (params.Justify) rules.push(`justify-content:${params.Justify};`);
      out.push(`${cls}{${rules.join('')}}`);
      continue;
    }

    if (kind === 'container') {
      const cls = className('container', name);
      const rules: string[] = [];
      const dir = (params.Direction || params.direction || 'row').toLowerCase();
      const type = (params.Type || params.type || 'flex').toLowerCase();
      if (type === 'grid') {
        rules.push('display:grid;');
        if (params.Columns) rules.push(`grid-template-columns:${params.Columns};`);
      } else {
        rules.push('display:flex;');
        rules.push(`flex-direction:${dir};`);
        if (params.Wrap) rules.push(`flex-wrap:${params.Wrap};`);
      }
      if (params.Gap) rules.push(`gap:${toCssValue(params.Gap)};`);
      if (params.Align) rules.push(`align-items:${params.Align};`);
      if (params.Justify) rules.push(`justify-content:${params.Justify};`);
      out.push(`${cls}{${rules.join('')}}`);
      continue;
    }
  }

  return out.join('\n');
}
