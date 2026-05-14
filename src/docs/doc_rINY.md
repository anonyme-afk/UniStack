## UniStack

english: UniStack is a hybrid full‑stack language that merges syntaxes from popular languages (Python, JS, C++, HTML/CSS, etc.) into a single paradigm, transpiled to JS/Node and Wasm for universal deployment.
french:  UniStack est un langage full‑stack hybride qui fusionne les syntaxes des langages populaires (Python, JS, C++, HTML/CSS, etc.) dans un unique paradigme, transpilé en JS/Node et Wasm pour un déploiement universel.

### Icon / Icône

english: A minimal UniStack icon is available at `assets/unistack-icon.png`. You can use it as a favicon or app icon.
french:  Une icône minimale UniStack est disponible dans `assets/unistack-icon.png`. Vous pouvez l’utiliser comme favicon ou icône d’application.

english: Example HTML usage for a favicon:
french:  Exemple d’utilisation HTML pour une favicon :

```html
<link rel="icon" type="image/png" href="/assets/unistack-icon.png" />
```

---

## Getting Started / Premiers pas

1. **Install dependencies** (already done; uses `npm`).
   ```bash
   npm install
   npm run build   # compile the TypeScript toolchain
   ```
2. **Create or edit a UniStack project**.
   The configuration lives in `unistack.config.json` (see below).
   The default entry point is `src/app.uni`.
3. **Commands**
   - `npx unistack init` – create a default config file (if missing).
   - `npx unistack build` – parse/transpile `app.uni`, produce `generated/` files and bundle into `dist/`.
   - `npx unistack dev` – build then start a development server on `localhost:3000`.

> [Warning]️ In this MVP stage the CLI is a simple wrapper around the TypeScript
> functions in `src/cli.ts`.

## Language Basics / Bases du langage

A UniStack source file begins with a header and contains named sections:

```text
unistack app "MonApp" version 1.0 {
  config: port=3000, db="sqlite:users.db";

  html-ui:
    <div class="app">
      <h1>{py:title()}</h1>
      <canvas id="game" cpp:render()></canvas>
    </div>;

  css:
    .app { font-family: Arial; padding: 20px; };

  py-logic:
    def title(): return "UniStack Dashboard";
    users = sql("SELECT * FROM users");

  js-events:
    document.getElementById('game').onclick = (e) => update(e);

  routes:
    GET /api/users { return py:users; }
}
```

### Supported sections (MVP)

| Section    | Purpose                             |
|------------|-------------------------------------|
| `config:`  | key/value build/runtime settings    |
| `html-ui:` | HTML fragments with `{py:...}` expressions |
| `css:`     | CSS chunks                          |
| `py-logic:`| Python-style code (strings only)    |
| `js-events:`| Client‑side JS code                |
| `routes:`  | HTTP route definitions              |

Expressions inside `{}` are parsed as cross‑language references (`py:foo` or `js:bar`). SQL can be invoked with `sql("...")`.

Routes may now be written in two forms:

```text
GET /foo { return py:foo(); }
```

or

```text
GET /foo {
  status 404;
  return js:bar();
}
```

(Inline bodies are recognized automatically; this feature was added during
MVP development.)

## Generated output

After `build` the following directories are created:

- `generated/` – intermediate TypeScript files (`app.server.ts`,
  `app.client.ts`, `index.html`).
- `dist/` – bundled output for distribution (`app.js`, `server.mjs`,
  `index.html`).

The CLI copies the generated HTML and uses `esbuild` to bundle client and
server entries.

## How it works (Developer Guide)

### Parser (`src/parser/uniParser.ts`)

A lightweight manual parser splits the input into sections using a simple state
machine. Each section is converted to an AST defined in `src/lang/ast.ts`.
The parser handles basic interpolation and language references. It is used by
`buildUniStack`.

Key points:

- Leading whitespace is ignored when detecting section headers.
- Inline route bodies are supported via regex matching.
- The AST is deliberately shallow; later phases may perform semantic checks.

> **Note:** ANTLR/Tree‑sitter integration is planned for Phase 2, but the
> handwritten parser suffices for the MVP.

### Transpiler (`src/transpiler/index.ts`)

`buildUniStack` reads the source file, parses it, and then converts the AST
into a simple intermediate representation (IR) with `frontend`, `backend`,
and `assets` parts. IR → generated files logic is in the same module.

- **FrontendIR** collects HTML/CSS text and placeholders for expressions.
- **BackendIR** extracts HTTP routes and their handlers.
- **AssetsIR** concatenates client‑side JS code.

IR is then emitted as TypeScript sources that the CLI bundles with `esbuild`.
Currently the transpiler produces very simple stubs; the core of the work is
in the AST transformations.

### Runtime (`src/runtime/`)

Basic Node and browser runtimes provide minimal services:

- `server.ts` exports `BasicRuntime` implementing `UniRuntime` with a manual
  registry of Python functions and a stubbed `sql()` method.
- `client.ts` includes `fetchJson` helper and DOM‑ready utility.
- `startServer` builds an Express app; it is now generic to accept any
  `UniRuntime` subtype.

### Extending the system

- Add new AST node kinds in `lang/ast.ts` and update both parser and
  transpiler.
- Enhance `buildBackendIR`/`buildFrontendIR` to emit more realistic code.
- Replace the SQL stub or integrate real C++/Wasm compilation later.

## Configuration file

The minimal `unistack.config.json` looks like:

```json
{
  "entry": "src/app.uni",
  "outDir": "dist",
  "generatedDir": "generated",
  "serverEntry": "generated/app.server.ts",
  "clientEntry": "generated/app.client.ts"
}
```

The CLI reads this file; `unistack init` will create it if missing.

---

*This README will evolve as the project moves beyond the MVP.*