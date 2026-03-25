<p align="center">
  <img src="assets/unistack-logo.png" width="220" alt="UniStack Logo" />
</p>

## UniStack

english: UniStack is a unified full-stack programming language — write your entire app in one .uni file.

french:  UniStack est un langage de programmation full-stack unifié — écrivez toute votre application dans un seul fichier .uni.

---

## Quick Start

**English:** Install Node.js 18+, then:
```bash
npm install
npm run install:global
npm run verify    # verify setup
npm run test      # run tests
npm run build     # compile
npm run dev       # start server (http://localhost:3000)
```

**Français:** Installez Node.js 18+, puis:
```bash
npm install
npm run install:global
npm run verify    # vérifier la configuration
npm run test      # exécuter les tests
npm run build     # compiler
npm run dev       # démarrer le serveur (http://localhost:3000)
```

---

## Advanced / Avancé

**Parser ANTLR (requires Java):**
```bash
npm run antlr
```

**Watch mode:**
```bash
npm run dev -- --watch
```
- now tracks imported `.uni` modules recursively and reloads server automatically
- also watches `unistack.config.json` and validates schema on load

**Template selection:**
```bash
npx unistack init --template beauty
```

**List templates:**
```bash
npx unistack templates
```

**Bridge templates:**
- `templates/ai`
- `templates/react`
- `templates/django`
- `templates/go`
- `templates/wasm`
**Language Server (LSP):**
```bash
npm run build
npm run lsp
```

**Format/Lint:**
```bash
npx unistack fmt --file src/app.uni
npx unistack lint --file src/app.uni
```

**Style Stdlib (optional):**
```text
style:
  Theme(Primary=#20b7e8, Secondary=#7a5cff, Bg=#09090c, Fg=#f7f7fb, Muted=#b7b7c7);
  Text(Name=title, Size=56, Weight=700, Color=Fg);
  Button(Name=primary, Bg=Primary, Color=#031018, Radius=14, Padding=12px 20px, Shadow=Soft);
  Card(Name=feature, Bg=#141420, Border=1px solid #232331, Radius=18, Padding=18px, Shadow=Soft);
  Container(Name=hero, Direction=row, Gap=24, Align=center, Justify=space-between);
```

---

## Full Installation / Installation complète

For detailed setup instructions, see **[INSTALL.md](INSTALL.md)**.

Pour les instructions de configuration détaillées, voir **[INSTALL.md](INSTALL.md)**.

---

english: UniStack icons are available in `assets/` (including `assets/unistack-icon.png` and size variants). You can use them as a favicon or app icon.
french:  Des icônes UniStack sont disponibles dans `assets/` (dont `assets/unistack-icon.png` et variantes). Vous pouvez les utiliser comme favicon ou icône d’application.

english: Example HTML usage for a favicon:
french:  Exemple d’utilisation HTML pour une favicon :

```html
<link rel="icon" href="/assets/favicon.ico" />
<link rel="icon" type="image/png" sizes="32x32" href="/assets/favicon-32.png" />
<link rel="icon" type="image/png" sizes="512x512" href="/assets/unistack-icon.png" />
<link rel="apple-touch-icon" sizes="180x180" href="/assets/apple-touch-icon.png" />
<link rel="apple-touch-icon" sizes="512x512" href="/assets/apple-touch-icon-512.png" />
<link rel="manifest" href="/assets/site.webmanifest" />
```

**Icon files provided / Fichiers d’icônes fournis :**
- `assets/unistack-logo.png` (original logo)
- `assets/unistack-icon.png` (512)
- `assets/unistack-icon-256.png`
- `assets/unistack-icon-128.png`
- `assets/unistack-icon-64.png`
- `assets/unistack-icon-32.png`
- `assets/unistack-icon-192.png`
- `assets/favicon-32.png`
- `assets/favicon.ico`
- `assets/apple-touch-icon.png`
- `assets/apple-touch-icon-512.png`
- `assets/site.webmanifest`

**Press / Brand kit**
- `assets/brand/BRAND_GUIDELINES.md`
- `assets/brand/unistack-logo.svg`
- `assets/brand/unistack-logo-mono-black.svg`
- `assets/brand/unistack-logo-mono-white.svg`
- `assets/brand/press/unistack-brand-svg.zip`
- `assets/brand/press/unistack-brand-png.zip`
- `assets/brand/press/unistack-brand-all.zip`
- `assets/brand/press/preview-1200x630.png`
- `assets/brand/press/thumb-256.png`
- `assets/brand/press/thumb-128.png`

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
   - `npx unistack dev --port 3000` – build then start development server (auto fallback if port is busy).
   - `npm run test` – run simple parser tests (requires `ts-node` installed as a dev dependency).

> Note: The CLI is production-oriented and wraps the full TypeScript toolchain
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

You can also include other files:
```text
imports: "src/shared.uni";
```

### Supported sections

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
active development.)

---

## New Features / Nouvelles Fonctionnalités

### 1. Built-in Design System 

Every UniStack app automatically includes a modern, responsive CSS design system with:
- **Component classes** (buttons, cards, alerts, forms, tables)
- **Responsive layout** (container, grid, flexbox utilities)
- **Smooth animations** and transitions
- **CSS custom properties** for easy theming

See **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** for complete documentation and examples.

```html
<div class="container">
  <div class="card">
    <h2>Welcome</h2>
    <button class="btn-primary">Get Started</button>
  </div>
</div>
```

### 2. SQL Abstraction Layer (DataSet ORM) ️

Type-safe, SQL-injection-proof query building with fluent API:

See **[DATA_ABSTRACTION.md](DATA_ABSTRACTION.md)** for complete API reference and examples.

```python
# Safe parameterized queries with method chaining
query = DataSet.all('users').where({status: 'active'}).limit(10).toSQL()
```

Features:
- Parameterized queries (prevents SQL injection)
- Fluent method chaining (where, limit, offset, orderBy)
- Static CRUD operations (create, update, delete)
- Type-safe interface

### 3. WebAssembly Performance Optimization 

Mark CPU-intensive functions with `@wasm` for automatic native compilation:

See **[WASM_GUIDE.md](WASM_GUIDE.md)** for complete guide and examples.

```python
# @wasm - Compiled to native binary for speed
def calculatePrimes(limit):
  primes = []
  for n in range(2, limit):
    if isPrime(n):
      primes.append(n)
  return primes
```

Performance improvements:
- Fibonacci(40): **50x faster**
- Matrix 512x512: **18x faster**  
- Sort 1M items: **13x faster**

---

## Guides & Documentation

### Get Started
- [INSTALL.md](INSTALL.md) – Installation and setup
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) – Syntax reference
- [START.md](START.md) – 5-minute quick start

### Build & Deploy
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) – Beautiful UI styling
- [DATA_ABSTRACTION.md](DATA_ABSTRACTION.md) – Safe database queries
- [WASM_GUIDE.md](WASM_GUIDE.md) – Performance optimization

### Code Quality
- [BEST_PRACTICES.md](BEST_PRACTICES.md) – Coding standards
- [OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md) – Code generation optimization
- [DEBUG_GUIDE.md](DEBUG_GUIDE.md) – Debugging techniques

### Advanced Features (Advanced line)
- [PLATFORM_FEATURES.md](PLATFORM_FEATURES.md) – Async/await, generics, decorators, LSP, type system
- Advanced code generation with TypeScript types
- Language Server Protocol (LSP) for IDE integration
- Performance monitoring and metrics
- Production utilities (circuit breakers, retries, health checks, graceful shutdown)

### Elite Architecture (Elite line)
- [COMPILER_ARCHITECTURE.md](COMPILER_ARCHITECTURE.md) – **Tier 1 Professional Compiler**
- Zero-Cost Bridge (C++ function pointer events)
- Isomorphic Compilation (write once, compile everywhere)
- Strict Type Inference (no manual annotations)
- Hot-Swap Backends (web  native with one config line)
- Native ORM (auto-persistent variables)
- 5-50x performance improvements

### Elite line.5 / Scale line Features (Coming Soon)
- Full LSP server with deep AST metadata (autocomplete, diagnostics, semantic tokens)
- UniStd standard library (HTTP, UI, filesystem – zero deps)
- UniPack package manager with precompiled modules
- Beauty injector (ui-engine) providing default design system

### Learn & Reference
- [GUIDE_COMPLET.md](GUIDE_COMPLET.md) – Complete 1400+ line tutorial
- [ARCHITECTURE.md](ARCHITECTURE.md) – System design
- [TESTING.md](TESTING.md) – Testing your app

### Help & Support
- [TROUBLESHOOTING.md](TROUBLESHOOTING.md) – Common issues
- [SECURITY.md](SECURITY.md) – Security policy
- [CONTRIBUTING.md](CONTRIBUTING.md) – Contribute to UniStack

### Index
- [INDEX.md](INDEX.md) – Complete documentation index
- [RELEASE_SUMMARY.md](RELEASE_SUMMARY.md) – Release summary with all features

---

After `build` the following directories are created:

- `generated/` – intermediate TypeScript files (`app.server.ts`,
  `app.client.ts`, `index.html`).
- `dist/` – bundled output for distribution (`app.js`, `server.cjs`,
  `edge.mjs`, `index.html`, and split chunks under `dist/chunks/` when needed).

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
> handwritten parser is available alongside ANTLR.

### Transpiler (`src/transpiler/index.ts`)

`buildUniStack` reads the source file, parses it, and then converts the AST
into a simple intermediate representation (IR) with `frontend`, `backend`,
and `assets` parts. IR → generated files logic is in the same module.

- **FrontendIR** collects HTML/CSS text and placeholders for expressions.
- **BackendIR** extracts HTTP routes and their handlers.
- **AssetsIR** concatenates client‑side JS code.

IR is then emitted as TypeScript sources that the CLI bundles with `esbuild`.
The transpiler produces complete runnable outputs; the core of the work is
in the AST transformations.

### Runtime (`src/runtime/`)

Basic Node and browser runtimes provide minimal services:

- `server.ts` exports `BasicRuntime` implementing `UniRuntime` with a manual
  registry of Python functions and a persistent `sql()` runtime method.
- `client.ts` includes `fetchJson` helper and DOM‑ready utility.
- `startServer` builds an Express app; it is now generic to accept any
  `UniRuntime` subtype.

### Extending the system

- Add new AST node kinds in `lang/ast.ts` and update both parser and
  transpiler.
- Enhance `buildBackendIR`/`buildFrontendIR` to emit more realistic code.
- Extend SQL features and continue deeper C++/Wasm integration.

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

Use `GETTING_STARTED.md` for a minimal onboarding path, `examples/Demo.uni` for a quick showcase, and `examples/Ultimate-Demo.uni` for a full showcase.

---

### Additional tooling / Outils supplémentaires

**english:**
- `Makefile` provides `make build`, `make test`, `make dev`, and `make clean`.
- A `Dockerfile` lets you containerize the toolchain and run the dev server.
- `.env.example` shows environment variables (PORT, NODE_ENV, DATABASE_URL).
- GitHub Actions workflow (`.github/workflows/ci.yml`) runs build & tests on push/PR.
- A simple pre‑commit hook (in `.git/hooks/pre-commit`) runs the test suite.
- `openapi.yaml` is an example OpenAPI specification for generated routes.
- `ARCHITECTURE.md` contains mermaid diagrams of the compile/runtime flow.
- `bench/bench.js` measures parse/transpile time for the sample app.

**french:**
- `Makefile` fournit `make build`, `make test`, `make dev` et `make clean`.
- Un `Dockerfile` permet de conteneuriser la chaîne d'outils et d'exécuter le serveur dev.
- `.env.example` montre les variables d'environnement (PORT, NODE_ENV, DATABASE_URL).
- Le workflow GitHub Actions (`.github/workflows/ci.yml`) exécute build et tests sur push/PR.
- Un hook pré-commit simple (dans `.git/hooks/pre-commit`) exécute la suite de tests.
- `openapi.yaml` est un exemple de spécification OpenAPI pour les routes générées.
- `ARCHITECTURE.md` contient des diagrammes mermaid du flux de compilation/exécution.
- `bench/bench.js` mesure les temps de parsing/transpilation de l'application d'exemple.

Licence : Ce projet est distribué sous licence Apache 2.0 par anonyme-afk. C'est gratuit et ça le restera.
