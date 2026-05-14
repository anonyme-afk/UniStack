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

import type {
  ConfigEntry,
  ConfigSection,
  CssSection,
  ComponentDef,
  ComponentsSection,
  HtmlBlock,
  HtmlExprNode,
  HtmlNode,
  HtmlSection,
  HtmlTextNode,
  JsChunk,
  JsSection,
  LangRef,
  LangRefPyJs,
  LangRefSql,
  Literal,
  MiddlewareAuthConfig,
  MiddlewareCorsConfig,
  MiddlewareRateLimitConfig,
  MiddlewareSection,
  PyChunk,
  PySection,
  RouteDef,
  RouteReturnStmt,
  RouteSection,
  RouteStatusStmt,
  RouteFileStmt,
  RouteValidateRule,
  RouteValidateStmt,
  StateEntry,
  StateSection,
  WsRouteDef,
  WsRoutesSection,
  RouteStmt,
  Section,
  UniFile,
  EnvSection,
  EnvVarDef,
  DbSection,
  TableDef,
} from '../lang/ast.js';

/**
 * english: Very small hand-written UniStack parser to make the language usable
 *          without depending on ANTLR yet. It follows the structure described in the plan:
 *          - header unistack app "Name" version X.Y { ... }
 *          - sections config / html-ui / css / py-logic / js-events / routes
 * french:  Parser UniStack très simplifié, écrit à la main pour rendre le langage utilisable
 *          sans dépendre immédiatement d’ANTLR. Il respecte la structure décrite dans le plan :
 *          - en-tête unistack app "Nom" version X.Y { ... }
 *          - sections config / html-ui / css / py-logic / js-events / routes
 */

type SectionKind =
  | 'imports'
  | 'config'
  | 'state'
  | 'components'
  | 'middleware'
  | 'ws-routes'
  | 'env'
  | 'html-ui'
  | 'css'
  | 'style'
  | 'py-logic'
  | 'js-events'
  | 'routes'
  | 'db';
type SectionKindExt = SectionKind | 'ffi';

interface RawSection {
  kind: SectionKindExt;
  lines: string[];
}

export function parseUniFile(source: string, fileName: string): UniFile {
  const lines = source.split(/\r?\n/);
  const headerLineIndex = findHeaderLineIndex(lines);
  if (headerLineIndex < 0) {
    throw new Error(
      `english: UniStack: missing header in ${fileName}. ` +
        `french: UniStack : en-tête manquant dans ${fileName}.`,
    );
  }
  const header = parseHeader(lines[headerLineIndex], fileName);

  const rawSections = collectSections(lines.slice(headerLineIndex + 1));
  const componentRegistry = new Map<string, ComponentDef>();
  for (const raw of rawSections) {
    if (raw.kind !== 'components') continue;
    const c = parseComponentsSection(raw.lines);
    for (const comp of c.components) {
      componentRegistry.set(comp.name, comp);
    }
  }
  const sections: Section[] = [];
  let config: ConfigSection | null = null;

  for (const raw of rawSections) {
    switch (raw.kind) {
      case 'imports': {
        const imports = parseImportsSection(raw.lines);
        sections.push(imports);
        break;
      }
      case 'config': {
        const cfg = parseConfigSection(raw.lines);
        if (config) {
          throw new Error('UniStack: plusieurs sections config sont définies.');
        }
        config = cfg;
        sections.push(cfg);
        break;
      }
      case 'state': {
        const state = parseStateSection(raw.lines);
        sections.push(state);
        break;
      }
      case 'components': {
        const c = parseComponentsSection(raw.lines);
        sections.push(c);
        break;
      }
      case 'middleware': {
        sections.push(parseMiddlewareSection(raw.lines));
        break;
      }
      case 'ws-routes': {
        sections.push(parseWsRoutesSection(raw.lines));
        break;
      }
      case 'env': {
        const env = parseEnvSection(raw.lines);
        sections.push(env);
        break;
      }
      case 'html-ui': {
        const html = parseHtmlSection(raw.lines, componentRegistry);
        sections.push(html);
        break;
      }
      case 'db': {
        const db = parseDbSection(raw.lines);
        sections.push(db);
        break;
      }
      case 'css': {
        const css = parseCssSection(raw.lines);
        sections.push(css);
        break;
      }
      case 'style': {
        const style = parseStyleSection(raw.lines);
        sections.push(style);
        break;
      }
      case 'ffi': {
        const ffi = parseFfiSection(raw.lines);
        sections.push(ffi);
        break;
      }
      case 'py-logic': {
        const py = parsePySection(raw.lines);
        sections.push(py);
        break;
      }
      case 'js-events': {
        const js = parseJsSection(raw.lines);
        sections.push(js);
        break;
      }
      case 'routes': {
        const routes = parseRoutesSection(raw.lines);
        sections.push(routes);
        break;
      }
    }
  }

  return {
    type: 'app',
    name: header.name,
    version: header.version,
    config,
    sections,
  };
}

function findHeaderLineIndex(lines: string[]): number {
  for (let i = 0; i < lines.length; i += 1) {
    const trimmed = lines[i].trim();
    if (!trimmed) continue;
    if (trimmed.startsWith(';;') || trimmed.startsWith(';')) continue;
    if (trimmed.startsWith('//') || trimmed.startsWith('#')) continue;
    return i;
  }
  return -1;
}

function parseHeader(line0: string | undefined, fileName: string): { name: string; version: string } {
  if (!line0) {
    throw new Error('english: UniStack: empty file. french: UniStack : fichier vide.');
  }
  const headerLine = line0.replace(/^\uFEFF/, '');
  const m = headerLine.match(/unistack\s+app\s+"([^"]+)"\s+version\s+([0-9]+\.[0-9]+)/);
  if (!m) {
    throw new Error(
      `english: UniStack: invalid header in ${fileName}. Expected: unistack app "Name" version X.Y. ` +
        `french: UniStack : en-tête invalide dans ${fileName}. Attendu : unistack app "Nom" version X.Y`,
    );
  }
  return { name: m[1], version: m[2] };
}

function collectSections(lines: string[]): RawSection[] {
  const sections: RawSection[] = [];
  let current: RawSection | null = null;

  // sections like `state:` or `routes:` use colon, but `env` historically uses a brace (`env {`).
// the regex therefore accepts either `:` or `{` after the keyword so that both
// syntaxes are recognized.
const startRegex = /^\s*(imports|config|state|components|middleware|env|ws-routes|html-ui|css|style|ffi|py-logic|js-events|routes|db)\s*(?:\:|\{)/;

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    if (!line.trim()) {
      continue;
    }

    const startMatch = line.match(startRegex);
    if (startMatch) {
      if (current) {
        sections.push(current);
      }
      current = { kind: startMatch[1] as SectionKindExt, lines: [] };
      // english: possible content after ":" on the same line (rare in our examples)
      // french:  contenu éventuel après ":" sur la même ligne (rare dans nos exemples)
      const rest = line.slice(startMatch[0].length).trim();
      if (rest) {
        current.lines.push(rest);
      }
      continue;
    }

    if (current) {
      // english: stop when we close the root block (line starts at column 0)
      // french:  arrêt quand on ferme le bloc racine (ligne colonne 0)
      if (line.trim() === '}' && rawLine.startsWith('}')) {
        break;
      }
      // ignore closing braces that terminate a section body but are indented
      if (line.trim() === '}') {
        continue;
      }
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections;
}

// english: ----- imports -----
// french:  ----- imports -----

function parseImportsSection(lines: string[]): { kind: 'imports'; entries: import('../lang/ast.js').ImportEntry[] } {
  const joined = lines.join(' ');
  const beforeSemi = joined.split(';')[0];

  function splitTopLevelCommas(str: string): string[] {
    const parts: string[] = [];
    let buf = '';
    let depth = 0;
    let inQuote: string | null = null;
    for (let i = 0; i < str.length; i++) {
      const ch = str[i];
      if (inQuote) {
        if (ch === inQuote) inQuote = null;
        buf += ch;
        continue;
      }
      if (ch === '"' || ch === "'") {
        inQuote = ch;
        buf += ch;
        continue;
      }
      if (ch === '{') {
        depth++;
        buf += ch;
        continue;
      }
      if (ch === '}') {
        depth--;
        buf += ch;
        continue;
      }
      if (ch === ',' && depth === 0) {
        parts.push(buf);
        buf = '';
        continue;
      }
      buf += ch;
    }
    if (buf) parts.push(buf);
    return parts.map(p => p.trim()).filter(Boolean);
  }

  const parts = splitTopLevelCommas(beforeSemi);
  const entries: import('../lang/ast.js').ImportEntry[] = [];

  for (const part of parts) {
    // patterns:
    //   "path.uni"
    //   "path.uni" as alias
    //   {a,b as c} from "path.uni"
    //   * as alias from "path.uni"
    const fromMatch = part.match(/^(.*)\s+from\s+("[^"]+"|'[^']+'|\S+)$/);
    if (fromMatch) {
      let spec = fromMatch[1].trim();
      const rawPath = fromMatch[2].trim();
      const path = rawPath.replace(/^['"]|['"]$/g, '');
      if (spec.startsWith('{') && spec.endsWith('}')) {
        const names = spec
          .slice(1, -1)
          .split(',')
          .map(s => s.trim())
          .filter(Boolean);
        entries.push({ path, names });
      } else if (spec.includes(' as ')) {
        const parts2 = spec.split(/\s+as\s+/);
        entries.push({ path, alias: parts2[1].trim() });
      } else if (spec === '*') {
        entries.push({ path, alias: '*' });
      } else if (spec) {
        entries.push({ path, alias: spec });
      } else {
        entries.push({ path });
      }
    } else {
      const m = part.match(/^("[^"]+"|'[^']+'|\S+)(?:\s+as\s+([a-zA-Z0-9_]+))?$/);
      if (m) {
        const p = m[1].replace(/^['"]|['"]$/g, '');
        const alias = m[2];
        entries.push({ path: p, alias });
      } else {
        // fallback: treat as raw path
        const p = part.replace(/^['"]|['"]$/g, '');
        entries.push({ path: p });
      }
    }
  }

  return { kind: 'imports', entries };
}

// english: ----- config -----
// french:  ----- config -----

function parseConfigSection(lines: string[]): ConfigSection {
  // english: e.g. 'config: port=3000, db="sqlite:users.db";' becomes lines 'port=3000, db="...";'
  // french:  ex : "config: port=3000, db=\"sqlite:users.db\";" devient lignes "port=3000, db=\"...\";"
  const joined = lines.join(' ');
  const beforeSemi = joined.split(';')[0];
  const parts = beforeSemi.split(',').map(p => p.trim()).filter(Boolean);

  const entries: ConfigEntry[] = parts.map(part => {
    const [k, vRaw] = part.split('=').map(s => s.trim());
    if (!k || vRaw === undefined) {
      throw new Error(
        `english: UniStack: invalid config entry: ${part}. ` +
          `french: UniStack : entrée config invalide : ${part}`,
      );
    }
    const value = parseLiteral(vRaw);
    return { key: k, value };
  });

  return {
    kind: 'config',
    entries,
  };
}

function parseStateSection(lines: string[]): StateSection {
  const entries: StateEntry[] = [];
  const raw = lines.join('\n');
  const stmts = raw
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);
  for (const stmt of stmts) {
    const m = stmt.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*=\s*([\s\S]+)$/);
    if (!m) {
      throw new Error(
        `english: UniStack: invalid state entry: ${stmt}. ` +
          `french: UniStack : entree state invalide : ${stmt}.`,
      );
    }
    entries.push({ key: m[1], expr: m[2].trim() });
  }
  return { kind: 'state', entries };
}

function parseComponentsSection(lines: string[]): ComponentsSection {
  const parts = lines
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);
  const components: ComponentDef[] = [];
  for (const part of parts) {
    const m = part.match(/^component\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)\s*=>\s*([\s\S]+)$/);
    if (!m) {
      throw new Error(
        `english: UniStack: invalid component definition: ${part}. ` +
          `french: UniStack : definition de composant invalide : ${part}.`,
      );
    }
    const params = splitTopLevelCsv(m[2]).map(p => p.trim()).filter(Boolean);
    components.push({
      name: m[1],
      params,
      template: m[3].trim(),
    });
  }
  return { kind: 'components', components };
}

function parseMiddlewareSection(lines: string[]): MiddlewareSection {
  const auth: MiddlewareAuthConfig = {
    enabled: false,
    excludes: [],
    header: 'authorization',
    handler: null,
  };
  const cors: MiddlewareCorsConfig = {
    enabled: false,
    origins: [],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  };
  const rateLimit: MiddlewareRateLimitConfig = {
    enabled: false,
    max: 120,
    windowMs: 60_000,
  };

  const stmts = lines.join('\n').split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of stmts) {
    if (stmt.startsWith('auth')) {
      auth.enabled = true;
      const cfg = parseKeyValueTail(stmt.slice('auth'.length).trim());
      if (cfg.exclude) auth.excludes = splitPipeList(cfg.exclude);
      if (cfg.header) auth.header = cfg.header;
      if (cfg.handler) {
        const lr = parseLangRef(cfg.handler);
        if (lr.lang !== 'py') throw new Error('UniStack: middleware auth handler must be py:...');
        auth.handler = lr;
      }
      continue;
    }
    if (stmt.startsWith('cors')) {
      cors.enabled = true;
      const cfg = parseKeyValueTail(stmt.slice('cors'.length).trim());
      if (cfg.origins) cors.origins = splitPipeList(cfg.origins);
      if (cfg.methods) cors.methods = splitPipeList(cfg.methods).map(v => v.toUpperCase());
      continue;
    }
    if (stmt.startsWith('rate-limit') || stmt.startsWith('rateLimit')) {
      rateLimit.enabled = true;
      const tail = stmt.startsWith('rate-limit') ? stmt.slice('rate-limit'.length) : stmt.slice('rateLimit'.length);
      const cfg = parseKeyValueTail(tail.trim());
      if (cfg.max) rateLimit.max = Number(cfg.max);
      if (cfg.window) rateLimit.windowMs = parseDurationMs(cfg.window);
      continue;
    }
    throw new Error(`UniStack: unknown middleware statement: ${stmt}`);
  }

  return { kind: 'middleware', auth, cors, rateLimit };
}

function parseEnvSection(lines: string[]): EnvSection {
  const vars: EnvVarDef[] = [];
  const stmts = lines.join('\n').split(';').map(s => s.trim()).filter(Boolean);
  for (const stmt of stmts) {
    // example: DATABASE_URL: required string default="sqlite.db"
    const m = stmt.match(/^([A-Z_][A-Z0-9_]*)\s*:\s*(required|optional)\s+(string|number|boolean)(?:\s+default=(.*))?$/i);
    if (!m) {
      throw new Error(`UniStack: invalid env declaration: ${stmt}`);
    }
    const name = m[1];
    const required = m[2].toLowerCase() === 'required';
    const type = m[3] as 'string' | 'number' | 'boolean';
    let def: Literal | undefined;
    if (m[4] !== undefined) {
      const raw = m[4].trim();
      def = parseLiteral(raw);
    }
    vars.push({ name, type, required, default: def });
  }
  return { kind: 'env', vars };
}

function parseWsRoutesSection(lines: string[]): WsRoutesSection {
  const joined = lines.join('\n');
  const defs = joined.split(';').map(s => s.trim()).filter(Boolean);
  const routes: WsRouteDef[] = [];
  for (const raw of defs) {
    const m = raw.match(/^WS\s+(\S+)\s*\{([\s\S]*)\}$/);
    if (!m) throw new Error(`UniStack: invalid ws route: ${raw}`);
    const path = m[1];
    const body = m[2];
    const route: WsRouteDef = { path };
    const clauses = splitTopLevelCsv(body);
    for (const clause of clauses) {
      const [k, ...rest] = clause.split('=');
      const key = k?.trim();
      const value = rest.join('=').trim();
      if (!key || !value) continue;
      const ref = parseLangRef(value);
      if (ref.lang !== 'py') throw new Error(`UniStack: ws handler must be py:... (${clause})`);
      if (key === 'on:connect') route.onConnect = ref;
      else if (key === 'on:message') route.onMessage = ref;
      else if (key === 'on:disconnect') route.onDisconnect = ref;
      else throw new Error(`UniStack: unknown ws key ${key}`);
    }
    routes.push(route);
  }
  return { kind: 'wsRoutes', routes };
}

function parseLiteral(text: string): Literal {
  if (text === 'true' || text === 'false') {
    return { kind: 'boolean', value: text === 'true' };
  }
  if (/^[0-9]+(\.[0-9]+)?$/.test(text)) {
    return { kind: 'number', value: Number(text) };
  }
  const strMatch = text.match(/^"(.*)"$/);
  if (strMatch) {
    return { kind: 'string', value: strMatch[1] };
  }
  // english: fallback: everything else is treated as a raw string
  // french:  fallback : tout le reste est traité comme string brute
  return { kind: 'string', value: text };
}

// english: ----- html-ui -----
// french:  ----- html-ui -----

function parseHtmlSection(lines: string[], components: Map<string, ComponentDef>): HtmlSection {
  // english: Concatenate section lines then split by ';' to build blocks.
  // french:  Concaténer les lignes de section puis découper par ';' pour construire les blocs.
  const full = lines.join('\n');
  const rawBlocks = full.split(';').map(b => b.trim()).filter(Boolean);

  const blocks: HtmlBlock[] = rawBlocks.map(blockSrc => {
    const nodes: HtmlNode[] = [];
    let remaining = blockSrc;

    while (remaining.length > 0) {
      const openIdx = remaining.indexOf('{');
      if (openIdx === -1) {
        if (remaining.trim()) {
          nodes.push({ kind: 'htmlText', text: remaining } as HtmlTextNode);
        }
        break;
      }
      if (openIdx > 0) {
        nodes.push({
          kind: 'htmlText',
          text: remaining.slice(0, openIdx),
        } as HtmlTextNode);
      }
      const closeIdx = remaining.indexOf('}', openIdx + 1);
      if (closeIdx === -1) {
        // english: no closing '}', treat the rest as text
        // french:  pas de '}', tout le reste en texte
        nodes.push({
          kind: 'htmlText',
          text: remaining.slice(openIdx),
        } as HtmlTextNode);
        break;
      }
      const exprText = remaining.slice(openIdx + 1, closeIdx).trim();
      if (exprText.startsWith('render:')) {
        const rendered = renderComponentExpr(exprText, components);
        nodes.push({ kind: 'htmlText', text: rendered } as HtmlTextNode);
        remaining = remaining.slice(closeIdx + 1);
        continue;
      }
      const langRef = parseLangRef(exprText);
      nodes.push({
        kind: 'htmlExpr',
        target: langRef,
      } as HtmlExprNode);
      remaining = remaining.slice(closeIdx + 1);
    }

    return { nodes };
  });

  return {
    kind: 'html',
    blocks,
  };
}

// english: ----- css -----
// french:  ----- css -----

function parseCssSection(lines: string[]): CssSection {
  // english: Preserve CSS text as-is to avoid breaking declarations.
  // french:  Préserver le CSS tel quel pour éviter de casser les déclarations.
  const code = lines.join('\n').trim();
  const chunks = code ? [code] : [];

  return {
    kind: 'css',
    chunks,
  };
}

// english: ----- style ----- (stdlib)
// french:  ----- style ----- (stdlib)

function parseStyleSection(lines: string[]): { kind: 'style'; lines: string[] } {
  const clean = lines.map(l => l.trim()).filter(Boolean);
  return { kind: 'style', lines: clean };
}

// english: ----- ffi ----- (native bridge declarations)
// french:  ----- ffi ----- (déclarations de bridge natif)

function parseFfiSection(lines: string[]): { kind: 'ffi'; lines: string[] } {
  const clean = lines.map(l => l.trim()).filter(Boolean);
  return { kind: 'ffi', lines: clean };
}

// english: ----- py-logic -----
// french:  ----- py-logic -----

function parsePySection(lines: string[]): PySection {
  const code = lines.join('\n');
  return {
    kind: 'py',
    chunks: [{ kind: 'pyChunk', code }],
  };
}

// english: ----- js-events -----
// french:  ----- js-events -----

function parseJsSection(lines: string[]): JsSection {
  const code = lines.join('\n');
  const chunk: JsChunk = {
    kind: 'jsChunk',
    code,
  };
  return {
    kind: 'js',
    chunks: [chunk],
  };
}

// english: ----- routes -----
// french:  ----- routes -----

function parseRoutesSection(lines: string[]): RouteSection {
  const routes: RouteDef[] = [];

  let current: RouteDef | null = null;
  for (const rawLine of lines) {
    const line = rawLine.trim();
    if (!line) continue;

    if (!current) {
      // english: check for inline route with body on same line
      // french: vérifier une route en ligne avec corps sur la même ligne
      const inlineMatch = line.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(\S+)\s*\{([^}]*)\}$/);
      if (inlineMatch) {
        const method = inlineMatch[1] as RouteDef['method'];
        const path = inlineMatch[2];
        const bodyText = inlineMatch[3].trim();
        const rd: RouteDef = { method, path, body: [] };
        if (bodyText) {
          const stmts = bodyText
            .split(';')
            .map(s => s.trim())
            .filter(Boolean);
          for (const stmtText of stmts) {
            rd.body.push(parseRouteStmt(stmtText));
          }
        }
        routes.push(rd);
        continue;
      }

      const m = line.match(/^(GET|POST|PUT|DELETE|PATCH)\s+(\S+)\s*\{/);
      if (!m) {
        throw new Error(
          `english: UniStack: invalid route line: ${line}. ` +
            `french: UniStack : ligne de route invalide : ${line}`,
        );
      }
      current = {
        method: m[1] as RouteDef['method'],
        path: m[2],
        body: [],
      };
      continue;
    }

    if (line.startsWith('}')) {
      routes.push(current);
      current = null;
      continue;
    }

    // english: route body
    // french:  corps de route
    const stmt = parseRouteStmt(line.replace(/}$/, '').trim());
    current.body.push(stmt);
  }

  if (current) {
    routes.push(current);
  }

  return {
    kind: 'routes',
    routes,
  };
}

function parseRouteStmt(line: string): RouteStmt {
  // remove trailing semicolon or closing brace if present
  const stripped = line.replace(/[;}]+$/, '').trim();
  if (stripped.startsWith('return')) {
    const exprText = stripped.slice('return'.length).trim();
    const expr = parseLangRef(exprText);
    const stmt: RouteReturnStmt = {
      kind: 'return',
      expr,
    };
    return stmt;
  }
  if (stripped.startsWith('status')) {
    const numText = stripped.slice('status'.length).trim();
    const code = Number(numText);
    const stmt: RouteStatusStmt = {
      kind: 'status',
      code,
    };
    return stmt;
  }
  if (stripped.startsWith('validate')) {
    const payload = stripped.slice('validate'.length).trim().replace(/^:/, '').trim();
    const rules = parseValidateRules(payload);
    const stmt: RouteValidateStmt = {
      kind: 'validate',
      rules,
    };
    return stmt;
  }
  if (stripped.startsWith('file:')) {
    const payload = stripped.slice('file:'.length).trim();
    const fieldMatch = payload.match(/field\s*=\s*"([^"]+)"/);
    const acceptMatch = payload.match(/accept\s*=\s*(\[[^\]]+\])/);
    const maxSizeMatch = payload.match(/maxSize\s*=\s*"([^"]+)"/);

    if (!fieldMatch) {
      throw new Error('[Cross] UniStack: file directive requires a "field" attribute.');
    }

    const field = fieldMatch[1];
    let accept: string[] = ['*/*'];
    if (acceptMatch && acceptMatch[1]) {
      try {
        accept = JSON.parse(acceptMatch[1]);
      } catch (e) {
        throw new Error(`[Cross] UniStack: could not parse "accept" array in file directive: ${acceptMatch[1]}`);
      }
    }
    const maxSize = maxSizeMatch ? maxSizeMatch[1] : '10mb';
    const maxSizeBytes = parseSizeBytes(maxSize);
    const stmt: RouteFileStmt = { kind: 'file', field, accept, maxSizeBytes };
    return stmt;
  }
  throw new Error(
    `english: UniStack: unknown route statement: ${line}. ` +
      `french: UniStack : instruction de route inconnue : ${line}`,
  );
}

function parseValidateRules(text: string): RouteValidateRule[] {
  const specs = splitTopLevelCsv(text);
  const rules: RouteValidateRule[] = [];
  for (const spec of specs) {
    const tokens = spec.split(':').map(t => t.trim()).filter(Boolean);
    if (tokens.length < 2) {
      throw new Error(
        `english: UniStack: invalid validate rule: ${spec}. ` +
          `french: UniStack : regle validate invalide : ${spec}.`,
      );
    }
    const field = tokens[0];
    const type = tokens[1];
    if (type !== 'string' && type !== 'number' && type !== 'boolean') {
      throw new Error(
        `english: UniStack: invalid validate type for ${field}: ${type}. ` +
          `french: UniStack : type validate invalide pour ${field} : ${type}.`,
      );
    }
    const rule: RouteValidateRule = {
      field,
      type,
      required: false,
    };
    for (const token of tokens.slice(2)) {
      if (token === 'required') {
        rule.required = true;
        continue;
      }
      const minMatch = token.match(/^min=(\d+)$/);
      if (minMatch) {
        rule.min = Number(minMatch[1]);
        continue;
      }
      const maxMatch = token.match(/^max=(\d+)$/);
      if (maxMatch) {
        rule.max = Number(maxMatch[1]);
        continue;
      }
      throw new Error(
        `english: UniStack: unknown validate modifier "${token}" in ${spec}. ` +
          `french: UniStack : modificateur validate inconnu "${token}" dans ${spec}.`,
      );
    }
    rules.push(rule);
  }
  return rules;
}

// english: ----- langRef -----
// french:  ----- langRef -----

function parseLangRef(text: string): LangRef {
  if (text.startsWith('sql(')) {
    const inner = text.slice(4).replace(/\)$/, '').trim();
    const parts = splitTopLevelCsv(inner);
    if (parts.length === 0) {
      throw new Error(
        `english: UniStack: invalid sql expression: ${text}. ` +
          `french: UniStack : expression sql invalide : ${text}.`,
      );
    }
    const queryRaw = parts[0];
    const strMatch = queryRaw.match(/^"(.*)"$/) ?? queryRaw.match(/^'(.*)'$/);
    const query = strMatch ? strMatch[1] : queryRaw;
    const params = parts.slice(1).map(p => parseExpr(p));
    const ref: LangRefSql = {
      lang: 'sql',
      query,
      params,
    };
    return ref;
  }

  const m = text.match(/^(py|js):([a-zA-Z_][a-zA-Z0-9_]*)(\((.*)\))?$/);
  if (!m) {
    throw new Error(
      `english: UniStack: invalid expression reference: ${text}. Expected py:name(...), js:name(...), or sql("..."). ` +
        `french: UniStack : référence d'expression invalide : ${text}. Attendu: py:name(...), js:name(...), ou sql("...").`,
    );
  }
  const lang = m[1] as 'py' | 'js';
  const name = m[2];
  const argsText = m[4];
  const args = argsText
    ? splitTopLevelCsv(argsText).map(a => parseExpr(a))
    : [];

  const ref: LangRefPyJs = {
    lang,
    name,
    args,
  };
  return ref;
}

function parseExpr(text: string): Literal | { kind: 'identifier'; name: string } {
  if (text === 'true' || text === 'false') {
    return { kind: 'boolean', value: text === 'true' };
  }
  if (/^[0-9]+(\.[0-9]+)?$/.test(text)) {
    return { kind: 'number', value: Number(text) };
  }
  const strMatch = text.match(/^"(.*)"$/);
  if (strMatch) {
    return { kind: 'string', value: strMatch[1] };
  }
  const identMatch = text.match(/^[a-zA-Z_][a-zA-Z0-9_]*$/);
  if (identMatch) {
    return { kind: 'identifier', name: text };
  }
  // english: fallback to raw string to keep parser permissive
  // french:  fallback vers string brute pour garder un parser permissif
  return { kind: 'string', value: text };
}

function splitTopLevelCsv(input: string): string[] {
  const out: string[] = [];
  let cur = '';
  let depth = 0;
  let quote: '"' | "'" | null = null;
  let escaped = false;

  for (let i = 0; i < input.length; i += 1) {
    const ch = input[i];

    if (quote) {
      cur += ch;
      if (escaped) {
        escaped = false;
        continue;
      }
      if (ch === '\\') {
        escaped = true;
        continue;
      }
      if (ch === quote) {
        quote = null;
      }
      continue;
    }

    if (ch === '"' || ch === "'") {
      quote = ch as '"' | "'";
      cur += ch;
      continue;
    }
    if (ch === '(') {
      depth += 1;
      cur += ch;
      continue;
    }
    if (ch === ')') {
      depth = Math.max(0, depth - 1);
      cur += ch;
      continue;
    }
    if (ch === ',' && depth === 0) {
      const v = cur.trim();
      if (v) out.push(v);
      cur = '';
      continue;
    }
    cur += ch;
  }

  const tail = cur.trim();
  if (tail) out.push(tail);
  return out;
}

function renderComponentExpr(expr: string, components: Map<string, ComponentDef>): string {
  const m = expr.match(/^render:([a-zA-Z_][a-zA-Z0-9_]*)\(([\s\S]*)\)$/);
  if (!m) {
    throw new Error(
      `english: UniStack: invalid render expression: ${expr}. ` +
        `french: UniStack : expression render invalide : ${expr}.`,
    );
  }
  const name = m[1];
  const comp = components.get(name);
  if (!comp) {
    throw new Error(
      `english: UniStack: unknown component ${name}. ` +
        `french: UniStack : composant inconnu ${name}.`,
    );
  }
  const args = splitTopLevelCsv(m[2]).map(a => parseExpr(a.trim()));
  const values = new Map<string, string>();
  for (let i = 0; i < comp.params.length; i += 1) {
    const key = comp.params[i];
    const arg = args[i];
    if (!arg) {
      values.set(key, '');
      continue;
    }
    if (arg.kind === 'identifier') {
      values.set(key, `<span data-uni-bind="${escapeAttr(arg.name)}"></span>`);
    } else if (arg.kind === 'string') {
      values.set(key, escapeHtml(arg.value));
    } else {
      values.set(key, String(arg.value));
    }
  }
  return comp.template.replace(/\{\{\s*([a-zA-Z_][a-zA-Z0-9_]*)\s*\}\}/g, (_, p1: string) => {
    return values.get(p1) ?? '';
  });
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function escapeAttr(input: string): string {
  return input.replace(/"/g, '&quot;');
}

function parseKeyValueTail(tail: string): Record<string, string> {
  const clean = tail.replace(/^:/, '').trim();
  const parts = splitTopLevelCsv(clean);
  const out: Record<string, string> = {};
  for (const part of parts) {
    const [k, ...rest] = part.split('=');
    if (!k || rest.length === 0) continue;
    out[k.trim()] = rest.join('=').trim().replace(/^"(.*)"$/, '$1').replace(/^'(.*)'$/, '$1');
  }
  return out;
}

function splitPipeList(value: string): string[] {
  return value.split('|').map(v => v.trim()).filter(Boolean);
}

function parseDurationMs(input: string): number {
  const m = String(input).trim().match(/^(\d+)(ms|s|m|h)?$/i);
  if (!m) return 60_000;
  const n = Number(m[1]);
  const u = (m[2] || 'ms').toLowerCase();
  if (u === 'ms') return n;
  if (u === 's') return n * 1000;
  if (u === 'm') return n * 60_000;
  if (u === 'h') return n * 3_600_000;
  return n;
}

function parseSizeBytes(input: string): number {
  const m = String(input).trim().match(/^(\d+)(b|kb|mb|gb)?$/i);
  if (!m) return 5 * 1024 * 1024;
  const n = Number(m[1]);
  const u = (m[2] || 'b').toLowerCase();
  if (u === 'b') return n;
  if (u === 'kb') return n * 1024;
  if (u === 'mb') return n * 1024 * 1024;
  if (u === 'gb') return n * 1024 * 1024 * 1024;
  return n;
}

function parseDbSection(lines: string[]): DbSection {
  const tables: TableDef[] = [];
  let currentTable: TableDef | null = null;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    const tableMatch = trimmed.match(/^table\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\{/);
    if (tableMatch) {
      if (currentTable) throw new Error('[Cross] UniStack: Nested table definitions are not allowed.');
      currentTable = { name: tableMatch[1], columns: [] };
      continue;
    }

    if (trimmed === '}') {
      if (currentTable) {
        tables.push(currentTable);
        currentTable = null;
      }
      continue;
    }

    if (currentTable) {
      const colMatch = trimmed.match(/^([a-zA-Z_][a-zA-Z0-9_]*)\s*:\s*([^;]+);?/);
      if (colMatch) {
        const name = colMatch[1];
        const defs = colMatch[2].split(/\s+/).map(s => s.trim()).filter(Boolean);
        const type = defs[0];
        const column: import('../lang/ast.js').ColumnDef = { name, type };

        for (const def of defs.slice(1)) {
          if (def === 'primary') column.primary = true;
          else if (def === 'autoincrement') column.autoincrement = true;
          else if (def === 'unique') column.unique = true;
          else if (def === 'required') column.required = true;
          else if (def.startsWith('default=')) column.default = def.split('=')[1];
          else if (def.startsWith('maxLength=')) column.maxLength = parseInt(def.split('=')[1], 10);
          else if (def.startsWith('foreign=')) column.foreign = def.split('=')[1];
        }
        currentTable.columns.push(column);
      }
    }
  }

  if (currentTable) {
    throw new Error('[Cross] UniStack: Unterminated table block found in db section.');
  }

  return {
    kind: 'db',
    tables,
  };
}
