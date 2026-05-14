# 🛠️ UniStack Compiler - API Reference

**Pour les développeurs du compilateur UniStack.**

---

## Table des Matières

1. [Parser API](#parser-api)
2. [Transpiler API](#transpiler-api)
3. [AST Types](#ast-types)
4. [Runtime API](#runtime-api)
5. [IR (Intermediate Representation)](#ir-intermediate-representation)
6. [Extending the Compiler](#extending-the-compiler)

---

## Parser API

### `parseUniFile(source: string, fileName: string): UniFile`

**Source:** `src/parser/uniParser.ts`

Analyse un fichier source UniStack et retourne un **Abstract Syntax Tree (AST)**.

#### Signature
```typescript
export function parseUniFile(source: string, fileName: string): UniFile
```

#### Paramètres
| Param | Type | Description |
|-------|------|-------------|
| `source` | `string` | Le contenu complet du fichier `.uni` |
| `fileName` | `string` | Chemin/nom du fichier (pour messages d'erreur) |

#### Retour: `UniFile`
```typescript
interface UniFile {
  name: string;           // Nom de l'app (depuis header)
  version: string;        // Version (X.Y format)
  config: ConfigSection | null;
  sections: Section[];    // Array de config/html/css/py/js/routes
}
```

#### Exceptions
| Erreur | Cause |
|--------|-------|
| `"empty file"` | Fichier vide |
| `"invalid header"` | Header mal formé (attendu: `unistack app "..." version X.Y`) |
| `"invalid config entry"` | Entrée config with format invalide |
| `"invalid route line"` | Route with format invalide |

#### Exemple
```typescript
import { parseUniFile } from './src/parser/uniParser.js';

const source = `
unistack app "MyApp" version 1.0 {
  config: port=3000;
  html-ui: <h1>Hello</h1>;
}
`;

const ast = parseUniFile(source, 'myapp.uni');
console.log(ast.name);      // "MyApp"
console.log(ast.version);   // "1.0"
console.log(ast.sections.length); // 2
```

---

### Helper Functions

#### `parseHeader(line: string, fileName: string): { name: string; version: string }`
Analyse la première ligne du fichier.

```typescript
// Input: 'unistack app "TodoApp" version 1.0'
// Output: { name: "TodoApp", version: "1.0" }
```

#### `collectSections(lines: string[]): RawSection[]`
Regroupe les lignes par sections (config, html-ui, css, py-logic, js-events, routes).

#### `parseConfigSection(lines: string[]): ConfigSection`
Parse une section `config`.

```typescript
// Input: 'port=3000, db="sqlite:app.db", debug=true'
// Output: ConfigSection avec entries [] remplie
```

#### `parseHtmlSection(lines: string[]): HtmlSection`
Parse une section `html-ui` avec support des interpolations `{py:func()}`, `{js:var}`, `{sql(...)}`.

#### `parseCssSection(lines: string[]): CssSection`
Parse une section `css` (traité comme texte brut).

#### `parsePySection(lines: string[]): PySection`
Parse une section `py-logic` (traité comme texte brut, pour future intégration Python).

#### `parseJsSection(lines: string[]): JsSection`
Parse une section `js-events` (traité comme texte brut, injected au client).

#### `parseRoutesSection(lines: string[]): RouteSection`
Parse une section `routes` avec support HTTP verbes et chemins.

#### `parseLangRef(text: string): LangRef`
Parse une référence inter-langage comme `py:getUsers()` ou `sql("SELECT ...")`.

```typescript
// Examples
parseLangRef("py:getUsers()");
// → { lang: "py", name: "getUsers", args: [] }

parseLangRef("sql(\"SELECT * FROM users\")");
// → { lang: "sql", query: "SELECT * FROM users" }

parseLangRef("js:myVar");
// → { lang: "js", name: "myVar", args: [] }
```

---

## Transpiler API

### `buildUniStack(options: BuildOptions): Promise<void>`

**Source:** `src/transpiler/index.ts`

Orchestrates the full compilation: Parse → IR → Code generation → File output.

#### Signature
```typescript
export interface BuildOptions {
  entryPath: string;        // Absolute path to .uni file
  generatedDir: string;     // Output directory for generated files
}

export async function buildUniStack(options: BuildOptions): Promise<void>
```

#### Étapes internes
1. **Parse:** `parseUniFile()` → AST
2. **IR Build:** `buildIR()` → Intermediate representation
3. **Code Gen:** `generateServerTs()`, `generateClientTs()`, `generateIndexHtml()`
4. **File Emit:** Écrire dans `generatedDir/`
   - `app.server.ts`
   - `app.client.ts`
   - `index.html`

#### Exemple
```typescript
import { buildUniStack } from './src/transpiler/index.js';

await buildUniStack({
  entryPath: '/absolute/path/to/app.uni',
  generatedDir: '/absolute/path/to/generated'
});

// Generated files créés in:
// - generated/app.server.ts
// - generated/app.client.ts
// - generated/index.html
```

---

### `buildIR(ast: UniFile): CompilationIR`

Transforme l'AST en Intermediate Representation pour code generation.

#### Returns
```typescript
interface CompilationIR {
  frontend: FrontendIR;
  backend: BackendIR;
  assets: AssetsIR;
}
```

---

### Helper Functions

#### `buildFrontendIR(ast: UniFile): FrontendIR`
Extrait HTML, CSS et crée des placeholders pour les interpolations dynamiques.

```typescript
interface FrontendIR {
  html: string;           // Markup HTML brut
  css: string;            // Déclarations CSS
  placeholders: [{        // Mappings pour {py:...} et {js:...}
    id: string;
    ref: LangRef;
  }];
}
```

#### `buildBackendIR(ast: UniFile): BackendIR`
Extrait les routes et leurs handlers.

```typescript
interface BackendIR {
  routes: [{
    method: HttpMethod;   // GET, POST, etc
    path: string;         // /api/users
    handler: LangRef;     // py:getUsers() ou sql("SELECT...")
  }];
}
```

#### `buildAssetsIR(ast: UniFile): AssetsIR`
Collecte le code JavaScript client.

```typescript
interface AssetsIR {
  clientEntry: string;    // Code JS à exécuter côté client
}
```

#### `generateServerTs(ir: CompilationIR): string`
Produit `app.server.ts` avec les routes Express.

**Template generé:**
```typescript
import express from 'express';
import type { UniRuntime } from '../runtime/server.js';

export function createServer(runtime: UniRuntime) {
  const app = express();

  app.get('/api/users', async (req, res) => {
    const data = await runtime.callPy('getUsers');
    res.json(data);
  });

  // ... autres routes

  return app;
}
```

#### `generateClientTs(ir: CompilationIR): string`
Produit `app.client.ts` avec le code JavaScript utilisateur.

#### `generateIndexHtml(ir: CompilationIR): string`
Produit `index.html` avec HTML + CSS injecté, ready pour bundling.

#### `emitGeneratedFiles(ir: CompilationIR, generatedDir: string): Promise<void>`
Écrit les 3 fichiers générés en concurrence (Promise.all).

---

## AST Types

**Source:** `src/lang/ast.ts`

### Litterals
```typescript
export type Literal =
  | { kind: 'string'; value: string }
  | { kind: 'number'; value: number }
  | { kind: 'boolean'; value: boolean };
```

### Config Section
```typescript
interface ConfigEntry {
  key: string;
  value: Literal;
}

interface ConfigSection {
  kind: 'config';
  entries: ConfigEntry[];
}
```

### HTML Section
```typescript
type HtmlNode = HtmlTextNode | HtmlExprNode;

interface HtmlTextNode {
  kind: 'htmlText';
  text: string;
}

interface HtmlExprNode {
  kind: 'htmlExpr';
  target: LangRef;  // py:func() ou js:var ou sql(...)
}

interface HtmlSection {
  kind: 'html';
  blocks: HtmlBlock[];
}

interface HtmlBlock {
  nodes: HtmlNode[];
}
```

### CSS Section
```typescript
interface CssSection {
  kind: 'css';
  chunks: string[];
}
```

### Python Section
```typescript
interface PyChunk {
  kind: 'pyChunk';
  code: string;
}

interface PySection {
  kind: 'py';
  chunks: PyChunk[];
}
```

### JavaScript Section
```typescript
interface JsChunk {
  kind: 'jsChunk';
  code: string;
}

interface JsSection {
  kind: 'js';
  chunks: JsChunk[];
}
```

### Routes Section
```typescript
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

interface RouteSection {
  kind: 'routes';
  routes: RouteDef[];
}

interface RouteDef {
  method: HttpMethod;
  path: string;
  body: RouteStmt[];
}

type RouteStmt = RouteReturnStmt | RouteStatusStmt;

interface RouteReturnStmt {
  kind: 'return';
  expr: LangRef;
}

interface RouteStatusStmt {
  kind: 'status';
  code: number; // HTTP status code
}
```

### Language References
```typescript
export type LangKind = 'py' | 'js' | 'sql';

interface LangRefPyJs extends LangRefBase {
  lang: 'py' | 'js';
  name: string;
  args: Expr[];
}

interface LangRefSql extends LangRefBase {
  lang: 'sql';
  query: string;
}

export type LangRef = LangRefPyJs | LangRefSql;
type Expr = Literal | { kind: 'identifier'; name: string };
```

### Root File
```typescript
export type Section = 
  | ConfigSection
  | HtmlSection
  | CssSection
  | PySection
  | JsSection
  | RouteSection;

interface UniFile {
  name: string;
  version: string;
  config: ConfigSection | null;
  sections: Section[];
}
```

---

## Runtime API

### Server Runtime (`src/runtime/server.ts`)

#### `interface UniRuntime`
```typescript
interface UniRuntime {
  callPy(name: string, ...args: unknown[]): Promise<unknown>;
  sql(query: string, params?: unknown[]): Promise<unknown[]>;
}
```

#### `class BasicRuntime implements UniRuntime`

**Constructor**
```typescript
const runtime = new BasicRuntime();
```

**Methods:**

##### `registerPy(name: string, fn: Function): void`
Enregistre une fonction Python (pour MVP avant vraie intégration Python).

```typescript
runtime.registerPy('getUsers', async () => {
  return [{ id: 1, name: 'Alice' }];
});

runtime.registerPy('getUserById', (uid: number) => {
  return { id: uid, name: 'User ' + uid };
});
```

##### `async callPy(name: string, ...args: unknown[]): Promise<unknown>`
Appelle une fonction Python enregistrée.

```typescript
const result = await runtime.callPy('getUserById', 42);
// → { id: 42, name: 'User 42' }
```

**Throws:** `Error` si fonction non trouvée.

##### `async sql(query: string, params?: unknown[]): Promise<unknown[]>`
Exécute une requête SQL (stub pour MVP).

```typescript
// Stub: logs la requête, retourne []
const results = await runtime.sql('SELECT * FROM users WHERE id = ?', [1]);
// → []
```

#### `function startServer(createApp: Function, runtime: UniRuntime, options: ServerOptions): void`

Démarre le serveur Express.

```typescript
startServer(
  (runtime) => {
    const app = express();
    app.get('/', (req, res) => res.json({ hello: 'world' }));
    return app;
  },
  new BasicRuntime(),
  { port: 3000 }
);
// → Server listening on http://localhost:3000
```

---

### Client Runtime (`src/runtime/client.ts`)

#### `async fetchJson<T>(url: string, options?: FetchJsonOptions): Promise<T>`

Wrapper autour de `fetch()` pour JSON.

```typescript
interface FetchJsonOptions {
  method?: string;  // GET, POST, etc (default: GET)
  body?: unknown;   // JSON body
}
```

**Example:**
```typescript
const users = await fetchJson<User[]>('/api/users');

const newUser = await fetchJson('/api/users', {
  method: 'POST',
  body: { name: 'Bob', email: 'bob@example.com' }
});
```

**Throws:** `Error` si HTTP status non 2xx.

#### `function attachDomReady(handler: () => void): void`

Exécute un callback quand le DOM est prêt (amélioration sur `DOMContentLoaded`).

```typescript
attachDomReady(() => {
  console.log('DOM is ready!');
});
```

---

## IR (Intermediate Representation)

### `interface CompilationIR`
```typescript
interface CompilationIR {
  frontend: FrontendIR;
  backend: BackendIR;
  assets: AssetsIR;
}
```

### Frontend IR
```typescript
interface FrontendPlaceholder {
  id: string;              // Unique placeholder ID
  ref: LangRef;            // Dynamique reference
}

interface FrontendIR {
  html: string;            // HTML markup brut
  css: string;             // CSS declarations concatenés
  placeholders: FrontendPlaceholder[];
}
```

### Backend IR
```typescript
interface BackendRouteIR {
  method: HttpMethod;
  path: string;
  handler: LangRef;        // Function à appeler
}

interface BackendIR {
  routes: BackendRouteIR[];
}
```

### Assets IR
```typescript
interface AssetsIR {
  clientEntry: string;     // Code JS client
}
```

---

## Extending the Compiler

### Ajouter une nouvelle section

**Étapes:**

1. **Ajouter au type AST** (`src/lang/ast.ts`)
   ```typescript
   interface MySection {
     kind: 'my-section';
     content: string;
   }
   
   type Section = ... | MySection;
   ```

2. **Ajouter au parser** (`src/parser/uniParser.ts`)
   ```typescript
   type SectionKind = 'config' | 'html-ui' | ... | 'my-section';
   
   // Dans parseUniFile()
   case 'my-section': {
     const section = parseMySection(raw.lines);
     sections.push(section);
     break;
   }
   
   function parseMySection(lines: string[]): MySection {
     return {
       kind: 'my-section',
       content: lines.join('\n')
     };
   }
   ```

3. **Ajouter au IR builder** (`src/transpiler/index.ts`)
   ```typescript
   function buildIR(ast: UniFile): CompilationIR {
     // Extraire votre section
     const mySections = ast.sections.filter(s => s.kind === 'my-section');
     // Traiter comme vous le voulez
   }
   ```

4. **Test:** Parser + build + vérify output

---

### Améliorer le parser pour ANTLR

L'ANTLR grammaire existe déjà dans `src/lang/UniStack.g4`.

Pour l'utiliser:

1. **Install ANTLR4:**
   ```bash
   npm install antlr4 antlr4ng
   ```

2. **Générer parser TypeScript:**
   ```bash
   antlr4 -Dlanguage=TypeScript -visitor src/lang/UniStack.g4
   ```

3. **Adapter `uniParser.ts` pour utiliser le parser ANTLR généré**

4. **Remplacer le parser hand-written**

---

## Testing

### Tester le parser
```typescript
import { parseUniFile } from './src/parser/uniParser.js';

describe('UniStack Parser', () => {
  it('should parse a valid .uni file', () => {
    const source = `
      unistack app "Test" version 1.0 {
        config: port=3000;
        html-ui: <h1>Hello</h1>;
      }
    `;
    
    const ast = parseUniFile(source, 'test.uni');
    expect(ast.name).toBe('Test');
    expect(ast.sections).toHaveLength(2);
  });
});
```

### Tester le transpiler
```typescript
import { buildUniStack } from './src/transpiler/index.js';
import { promises as fs } from 'node:fs';

describe('UniStack Transpiler', () => {
  it('should generate server.ts', async () => {
    await buildUniStack({
      entryPath: './test.uni',
      generatedDir: './test-output'
    });
    
    const serverTs = await fs.readFile('./test-output/app.server.ts', 'utf8');
    expect(serverTs).toContain('express');
  });
});
```

---

## Version Roadmap

### v0.1.0 (Current - MVP)
- [OK] Hand-written parser
- [OK] Basic transpiler
- [OK] Express server
- [OK] HTML/CSS/JS/Python/SQL synthesis

### v0.2.0 (Q2 2026)
- [ ] ANTLR parser integration
- [ ] Python runtime (Pyodide or Python-wasm)
- [ ] SQLite integration
- [ ] Module system (imports)
- [ ] Type validation

### v0.3.0+ (Q3+ 2026)
- [ ] C++/Rust → WASM
- [ ] GraphQL support
- [ ] Hot-reload
- [ ] IDE plugins

---

**Last updated:** 26 février 2026
**Compilateur version:** 0.1.0-MVP
