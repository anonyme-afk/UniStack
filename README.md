# UniStack

UniStack is a full-stack programming language that compiles to JavaScript/Node.js.
Write your entire app -- database, server logic, UI, styles -- in a single .uni file.

No more context switching between JS, Python, HTML, CSS and SQL.

---

## Why UniStack

Every full-stack app today requires at least 5 languages and 10 config files.
UniStack replaces all of that with one file and one command.

| Instead of this | Use this |
|---|---|
| Express routes + controllers | routes: section |
| Python Flask / FastAPI | py-logic: section |
| React / Vue components | components: + html-ui: |
| CSS Modules / Tailwind | css: section (auto-scoped) |
| SQL migrations + ORM | db: section |
| .env + validation | env: section |

---

## Quick example

```unistack
unistack app "Todo" version 1.0 {

  db:
    table todos {
      id : integer primary autoincrement;
      title : string required;
      done : boolean default false;
    }

  routes:
    GET  /api/todos { return sql("SELECT * FROM todos"); }
    POST /api/todos {
      validate: title:string:required;
      return py:add_task(req.body.title);
    }

  html-ui:
    <div id="app">
      <input data-uni-model="newTodo" placeholder="Add a task..." />
      <button onclick="addTodo()">Add</button>
      <ul data-uni-bind="todos"></ul>
    </div>;

  py-logic:
    def add_task(title):
      return {"ok": True, "title": title}

  css:
    #app { max-width: 600px; margin: 40px auto; font-family: sans-serif; }
}
```

One file. Full app. Frontend + backend + database.

---

## Installation

```bash
npm install -g unistack-toolchain
```

Requirements: Node.js 18+, Python 3.8+

---

## Usage

```bash
# Initialize a new project
unistack init

# Build the application
unistack build

# Development mode with hot-reload
unistack dev --watch

# Launch the interactive Studio (live editor + AST inspector)
unistack studio --port 5050

# Visualize the AST of a .uni file as HTML
unistack viz --file src/app.uni

# Format code
unistack fmt --file src/app.uni

# Lint code
unistack lint --file src/app.uni

# Install package from local registry
unistack pack install my-pkg --target web
```

---

## UniStack Studio

UniStack Studio is an interactive development environment built into the toolchain.
Launch it with `unistack studio` and open http://localhost:5050 in your browser.

Features:
- Code editor with line numbers and Tab support
- Real-time AST inspector: see how each section of your .uni file is parsed
- Diagnostics panel: parse errors are shown immediately
- Save with Ctrl+S / Cmd+S to persist changes back to disk

---

## Language features

**Database** -- declare tables directly, SQL is always parameterized (injection-proof).

**Python logic** -- write Python functions, call them from routes with py:functionName().

**Reactive UI** -- integrated data binding and state management.

**Scoped CSS** -- styles are automatically scoped to components.

**Auth middleware** -- integrated authentication and CORS management.

**Env validation** -- declarative environment variables with startup validation.

**FFI System** -- foreign function interface for native integrations.

**HotSwap** -- switch execution targets (web, native, hybrid) at runtime.

**Zero-Cost Bridge** -- events compiled as C++ function pointers (Phase 3).

**Isomorphic Compilation** -- automatic target selection for optimal performance.

**Native ORM** -- auto-persistent variables with database integration.

---

## Project structure

```
src/
  cli/          CLI commands and UniPack manager
  compiler/     FFI, HotSwap and UI Engine
  lang/         AST definitions and ANTLR Grammar (UniStack.g4)
  parser/       Dual engine (ANTLR and Manual)
  runtime/      Production server and WorkerPool
  tools/        Formatter, Linter, Visualizer, Studio
  transpiler/   Core transpilation and IR generation
  modules/      Generated compiler modules
  stdlib/       Standard library (.uni files)
  config/       Configuration schemas and Dockerfile
  core/         Core language definitions
  docs/         Internal documentation
  tests/        Test files
examples/
  todo/         Full CRUD task manager example
  blog/         Multi-section DevBlog site example
  todo-list.uni Simple todo list example
docs/
  guides/       User guides and tutorials
  reference/    Language reference and API docs
  advanced/     Advanced features (Phase 2 & 3)
vscode/         Visual Studio Code extension
```

---

## Documentation

### Getting Started
- [Getting started guide](./docs/guides/getting-started.md) -- Setup and first app in 5 minutes
- [Installation guide](./docs/guides/installation-guide.md) -- Complete installation steps
- [Guide complet](./docs/guides/guide-complet.md) -- Full language tutorial (1400+ lines, bilingual FR/EN)
- [Guide d'utilisation](./docs/guides/guide-utilisation.md) -- French usage guide
- [Guide maitre complet](./docs/guides/guide-maitre-complet.md) -- French comprehensive guide
- [Documentation complete](./docs/guides/documentation-complete.md) -- Full documentation index

### Language Reference
- [Architecture overview](./docs/reference/architecture-overview.md) -- Compilation and runtime flow
- [Compiler API reference](./docs/reference/compiler-api-reference.md) -- API documentation
- [Design system](./docs/reference/design-system.md) -- Built-in CSS design system
- [Security policy](./docs/reference/security-policy.md) -- Security guidelines and reporting

### Best Practices & Recipes
- [Best practices](./docs/guides/best-practices.md) -- Coding standards and production patterns
- [Cookbook](./docs/guides/cookbook.md) -- Common recipes (JWT auth, file upload, WebSocket)
- [Safe queries](./docs/guides/safe-queries.md) -- SQL injection prevention guide
- [Troubleshooting](./docs/guides/troubleshooting.md) -- Common issues and solutions

### Advanced Features
- **Phase 2** -- [Advanced features](./docs/advanced/phase2-advanced-features.md) -- Async/await, generics, decorators, LSP, type system
- **Phase 3** -- [Elite compiler](./docs/advanced/phase3-elite-compiler.md) -- Zero-cost bridge, isomorphic compilation, Native ORM
- **Phase 3** -- [Completion summary](./docs/advanced/phase3-completion.md) -- Phase 3 delivery report
- **WASM** -- [WASM support](./docs/advanced/wasm-support.md) -- WebAssembly performance optimization

### VSCode Extension
- [VSCode extension](./vscode/README.md) -- Syntax highlighting for .uni files

---

## VSCode extension

Syntax highlighting for .uni files is available in the vscode/ folder.

To install in development mode:
1. Open the vscode/ folder in VSCode
2. Press F5
3. A new VSCode window opens with UniStack syntax highlighting active

---

## Examples

### Todo App
Full CRUD task manager with SQLite persistence, REST API, and vanilla JS frontend.
Located in `examples/todo/`.

### Blog
Multi-section developer blog with posts, categories, and authentication.
Located in `examples/blog/`.

### Simple Todo
Minimal todo list example in a single `.uni` file.
Located at `examples/todo-list.uni`.

---

## Key CLI Commands

| Command | Description |
|---|---|
| `unistack init` | Create a new project |
| `unistack build` | Compile to dist/ |
| `unistack dev --watch` | Start dev server with hot-reload |
| `unistack studio --port 5050` | Launch interactive Studio |
| `unistack viz --file src/app.uni` | Generate AST visualization as HTML |
| `unistack fmt --file src/app.uni` | Format code |
| `unistack lint --file src/app.uni` | Lint and check for issues |
| `unistack pack install my-pkg` | Install a package |

---

## Environment Variables

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=sqlite:memory
JWT_SECRET=your-secret-key
```

---

## Docker Support

```bash
# Build image
docker build -t unistack:latest .

# Run container
docker run -p 3000:3000 unistack:latest
```

---

## Scripts

```bash
npm run build        # Compile TypeScript
npm run test         # Run test suite
npm run dev          # Start development server (port 3000)
npm install          # Install dependencies
node verify.js       # Verify installation
node clean.js        # Clean build artifacts
```

---

## Contributing

Contributions are welcome. Please read CONTRIBUTING.md before opening a pull request.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests: `npm run test`
5. Verify: `node verify.js`
6. Submit a Pull Request

---

## License

Apache 2.0 -- see [LICENSE](./LICENSE)