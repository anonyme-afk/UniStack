import type {
  ConfigEntry,
  ConfigSection,
  CssSection,
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
  PyChunk,
  PySection,
  RouteDef,
  RouteReturnStmt,
  RouteSection,
  RouteStatusStmt,
  RouteStmt,
  Section,
  UniFile,
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

type SectionKind = 'config' | 'html-ui' | 'css' | 'py-logic' | 'js-events' | 'routes';

interface RawSection {
  kind: SectionKind;
  lines: string[];
}

export function parseUniFile(source: string, fileName: string): UniFile {
  const lines = source.split(/\r?\n/);
  const header = parseHeader(lines[0], fileName);

  const rawSections = collectSections(lines.slice(1));
  const sections: Section[] = [];
  let config: ConfigSection | null = null;

  for (const raw of rawSections) {
    switch (raw.kind) {
      case 'config': {
        const cfg = parseConfigSection(raw.lines);
        if (config) {
          throw new Error('UniStack: plusieurs sections config sont définies.');
        }
        config = cfg;
        sections.push(cfg);
        break;
      }
      case 'html-ui': {
        const html = parseHtmlSection(raw.lines);
        sections.push(html);
        break;
      }
      case 'css': {
        const css = parseCssSection(raw.lines);
        sections.push(css);
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
    name: header.name,
    version: header.version,
    config,
    sections,
  };
}

function parseHeader(line0: string | undefined, fileName: string): { name: string; version: string } {
  if (!line0) {
    throw new Error('english: UniStack: empty file. french: UniStack : fichier vide.');
  }
  const m = line0.match(/unistack\s+app\s+"([^"]+)"\s+version\s+([0-9]+\.[0-9]+)/);
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

  const startRegex = /^\s*(config|html-ui|css|py-logic|js-events|routes)\s*:/;

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
      current = { kind: startMatch[1] as SectionKind, lines: [] };
      // english: possible content after ":" on the same line (rare in our examples)
      // french:  contenu éventuel après ":" sur la même ligne (rare dans nos exemples)
      const rest = line.slice(startMatch[0].length).trim();
      if (rest) {
        current.lines.push(rest);
      }
      continue;
    }

    if (current) {
      // english: stop when we close the root block
      // french:  arrêt quand on ferme le bloc racine
      if (line.trim() === '}') {
        break;
      }
      current.lines.push(line);
    }
  }

  if (current) {
    sections.push(current);
  }

  return sections;
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

function parseHtmlSection(lines: string[]): HtmlSection {
  // english: For the MVP we concatenate everything, then split by ';' to make blocks.
  // french:  Pour le MVP, on concatène tout, puis on découpe par ';' pour faire des blocs.
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
  // english: Keep raw lines, only remove trailing ';' when useless.
  // french:  On garde les lignes brutes, en retirant seulement les ';' finaux inutiles.
  const chunks = lines
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(Boolean);

  return {
    kind: 'css',
    chunks,
  };
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
  throw new Error(
    `english: UniStack: unknown route statement: ${line}. ` +
      `french: UniStack : instruction de route inconnue : ${line}`,
  );
}

// english: ----- langRef -----
// french:  ----- langRef -----

function parseLangRef(text: string): LangRef {
  if (text.startsWith('sql(')) {
    const inner = text.slice(4).replace(/\)$/, '').trim();
    const strMatch = inner.match(/^"(.*)"$/);
    const query = strMatch ? strMatch[1] : inner;
    const ref: LangRefSql = {
      lang: 'sql',
      query,
    };
    return ref;
  }

  const m = text.match(/^(py|js):([a-zA-Z_][a-zA-Z0-9_]*)(\((.*)\))?$/);
  if (!m) {
    // english: fallback: any unknown expression is treated as a py reference without args
    // french:  fallback : tout expr inconnu est traité comme référence py sans args
    const fallback: LangRefPyJs = {
      lang: 'py',
      name: text,
      args: [],
    };
    return fallback;
  }
  const lang = m[1] as 'py' | 'js';
  const name = m[2];
  const argsText = m[4];
  const args = argsText
    ? argsText
        .split(',')
        .map(a => a.trim())
        .filter(Boolean)
        .map<Literal>(a => parseLiteral(a))
    : [];

  const ref: LangRefPyJs = {
    lang,
    name,
    args,
  };
  return ref;
}

