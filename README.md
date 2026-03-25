# UniStack

UniStack is a full-stack programming language that compiles to JavaScript/Node.js.
Write your entire app — database, server logic, UI, styles — in a single `.uni` file.

No more context switching between JS, Python, HTML, CSS and SQL.

---

## Why UniStack

Every full-stack app today requires at least 5 languages and 10 config files.
UniStack replaces all of that with one file and one command.

| Instead of this | Use this |
|---|---|
| Express routes + controllers | `routes:` section |
| Python Flask / FastAPI | `py-logic:` section |
| React / Vue components | `components:` + `html-ui:` |
| CSS Modules / Tailwind | `css:` section (auto-scoped) |
| SQL migrations + ORM | `db:` section |
| .env + validation | `env:` section |

---

## Quick example
```unistack
unistack app "Todo" version 1.0 {

  db:
    table todos {
      id:      integer primary autoincrement;
      title:   string  required;
      done:    boolean default false;
    }

  routes:
    GET  /api/todos       { return sql("SELECT * FROM todos"); }
    POST /api/todos       {
      validate title:string:required;
      return sql("INSERT INTO todos (title) VALUES (?)", title);
    }
    PUT  /api/todos/:id   {
      return sql("UPDATE todos SET done = ? WHERE id = ?", done, id);
    }

  state:
    todos: array = [];

  html-ui:
    <div id="app">
      <input data-uni-model="newTodo" placeholder="Add a task..." />
      <button onclick="addTodo">Add</button>
      <ul data-uni-bind="todos"></ul>
    </div>;

  js-events:
    async function addTodo() {
      await fetch('/api/todos', {
        method: 'POST',
        body: JSON.stringify({ title: UniState.newTodo })
      });
      UniState.todos = await fetch('/api/todos').then(r => r.json());
    }

  css:
    app {
      #app  { max-width: 600px; margin: 40px auto; font-family: sans-serif; }
      input { width: 100%; padding: 10px; margin-bottom: 10px; }
    }
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
# Create a new app
unistack init my-app

# Build
unistack build my-app.uni

# Dev mode (watch + reload)
unistack dev my-app.uni

# Format
unistack fmt my-app.uni
```

---

## More examples

See the [`examples/`](./examples) folder:

- [`examples/todo-list.uni`](./examples/todo-list.uni) — Todo list with full CRUD
- [`src/stdlib/unistack_1nwj.uni`](./src/stdlib/unistack_1nwj.uni) — Blog with auth, JWT, file upload

---

## Language features

**Database** — declare tables directly, SQL is always parameterized (injection-proof)

**Python logic** — write Python functions, call them from routes with `py:functionName()`

**Reactive UI** — `data-uni-bind`, `data-uni-model`, `data-uni-show`, `data-uni-class`

**Scoped CSS** — `.card` inside `PostCard {}` becomes `.uni-PostCard-card` automatically

**Auth middleware** — `auth handler py:verify_jwt excludes "/login", "/register"`

**Env validation** — `JWT_SECRET:string:required` validated at startup, never at runtime

**OpenAPI** — spec generated automatically from your `routes:` section

---

## VSCode extension

Syntax highlighting for `.uni` files is available in the [`vscode/`](./vscode) folder.

To install in development mode:
1. Open the `vscode/` folder in VSCode
2. Press `F5`
3. A new VSCode window opens with UniStack syntax highlighting active

---

## Project structure
```
src/
  compiler/     Parser (ANTLR4), UI Engine
  lang/         AST definition
  core/         Runtime, utilities
  modules/      120+ compiler modules
  stdlib/       Example .uni apps
  cli.ts        CLI entry point
docs/           Full documentation
examples/       Ready-to-run .uni examples
vscode/         VSCode extension
```

---

## Documentation

- [Getting started](./docs/guides/getting-started.md)
- [Installation guide](./docs/guides/installation-guide.md)
- [Best practices](./docs/guides/best-practices.md)
- [Architecture overview](./docs/reference/architecture-overview.md)
- [Security policy](./docs/reference/security-policy.md)

---

## Contributing

Contributions are welcome. Please read [CONTRIBUTING.md](./CONTRIBUTING.md) before opening a pull request.

---

## License

Apache 2.0 — see [LICENSE](./LICENSE)