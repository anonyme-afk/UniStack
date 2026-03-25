# UniStack Language Reference

This document lists every section and syntax supported by the `.uni` language. Examples are shown in a minimal form; see the Quick Reference or cookbook for more complete patterns.

## Sections

### `config:`
Top‑level key/value pairs that influence build/runtime. Values are comma‑separated.

```text
config: port=3000, db="sqlite:app.db", secretKey=env:JWT_SECRET
```

Fields may be strings, numbers, booleans or `env:<NAME>` to pull from process.env.

---

### `imports:`
Load another `.uni` file or specific names.

```text
imports: "shared.uni";
imports: "foo.uni" as bar;
imports: {a,b} from "mod.uni";
imports: * as lib from "lib.uni";
```

---

### `db:`
Defines database schema. Each table lists columns with types and constraints.

```text
db:
  table posts {
    id: integer primary autoincrement;
    title: string required;
    content: text required;
  }
```

UniStack auto‑migrates at startup; SQL queries are always parameterized.

---

### `html-ui:`
Markup that is rendered on the client. Expressions may be interpolated using `{py:...}` or `{sql("...")}`.

```text
html-ui:
  <div>
    <h1>{py:title()}</h1>
    <ul>{py:renderItems()}</ul>
  </div>;
```

`</>` closing optional after semicolon.

---

### `css:`
Raw CSS included verbatim in the `<style>` tag.

```text
css:
  body { margin:0; font-family:Arial; }
```

---

### `style:`
DSL helpers for design tokens and reusable rules. See Quick Reference for full list.

```text
style:
  Theme(Primary=#20b7e8, Fg=#fff);
  Button(Name=primary, Bg=Primary, Radius=8);
```

---

### `state:`
Client‑side reactive state. Each entry may be a literal or object.

```text
state:
  counter = 0;
  user = { name: "Alice", loggedIn: false };
```

---

### `components:`
Define reusable HTML snippets with parameters.

```text
components:
  component Card(title, body) =>
    <div class="card"><h2>{{title}}</h2><p>{{body}}</p></div>;
```

Use via `{render:Card("Hi","Body")}` in `html-ui`.

---

### `py-logic:`
Server Python functions that can be called from routes or client.

```text
py-logic:
  def title():
    return "Hello"
  def add(a, b):
    return a + b
```

---

### `js-events:`
Arbitrary client‑side JavaScript executed after page load.

```text
js-events:
  document.getElementById('btn').addEventListener('click', () => {
    fetch('/api/ok');
  });
```

---

### `routes:`
HTTP handlers. Supported verbs: GET, POST, PUT, PATCH, DELETE.

```text
routes:
  GET /api/items { return py:listItems(); }
  POST /api/items {
    validate name:string:required;
    return py:createItem(name);
  }
```

`validate` rules: `<field>:<type>:<modifier>=<value>,...`.
SQL queries must use `sql("...", params)`; concatenation is banned.

---

### `middleware:`
Configure auth, CORS, rate‑limit. Each subsection is optional.

```text
middleware:
  auth handler py:check(token) excludes "/public", "/assets";
  cors origins http://example.com;
  rate-limit max=500 window=10m;
```

---

### `ws-routes:`
WebSocket endpoints. Each route binds to a Python handler.

```text
ws-routes:
  WS /chat py:chatHandler;
```

Handlers receive `(ws, req)` and may send messages via `ws.send()`.

---

### `env:`
Declare environment variables with type/requirement for build-time validation.

```text
env:
  PORT:number:required;
  DEBUG:boolean;
```

---

### `test:`
Inline tests executed by `npm run test` during CI.

```text
test:
  assert(sql("SELECT 1")[0]["1"] === 1);
```

---

### `imports:`
(see above) multiple forms described; reused to share code.

---

Every section name is followed by `:` and a block indented by two spaces or more. Statements inside sections end with semicolons. Most sections are optional; unspecified features default to sensible safe values.
