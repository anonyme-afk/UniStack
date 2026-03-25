# UniStack Quick Reference

Reference rapide de la syntaxe UniStack actuelle.

## Structure d'un fichier `.uni`
```text
unistack app "MyApp" version 1.0 {
  config: port=3000, db="sqlite:app.db";
  state:
    counter = 0;
    userName = "Alice";

  imports: "shared.uni";

  html-ui:
    <h1>{py:title()}</h1>
    <p>{py:subtitle()}</p>;

  css:
    body { margin: 0; };

  style:
    Theme(Primary=#20b7e8, Fg=#f7f7fb);
    Text(Name=title, Size=56, Weight=800, Color=Fg);

  py-logic:
    def title():
      return "Hello"

  js-events:
    console.log("ready");

  routes:
    GET /api/health { return py:title(); }
}
```

## Sections supportées
- `config:` paramètres runtime/build (`port`, `db`, etc.).
- `state:` état réactif client (génère `window.UniState`).
- `components:` composants HTML réutilisables via `render:`.
- `imports:` import de fichiers `.uni`.
  - syntaxe étendue : `imports: "foo.uni";`, `imports: "foo.uni" as bar;`, `imports: {a,b} from "mod.uni";`, `imports: * as lib from "lib.uni";`
- `html-ui:` HTML avec expressions `{py:...}` et `{sql("...")}`.
- `css:` CSS brut (préservé tel quel).
- `style:` DSL de style UniStack (génère du CSS utilitaire).
- `py-logic:` logique Python (fonctions + bindings).
- `js-events:` JS client injecté dans `app.js`.
- `routes:` routes HTTP `GET|POST|PUT|DELETE|PATCH`.

## Expressions
- `py`: `{py:title()}`, `{py:userName(id)}`
- `sql`: `{sql("SELECT * FROM users")}`, `{sql("SELECT * FROM users WHERE id = ?", userId)}`
- Arguments supportés: `string`, `number`, `boolean`, `identifier`.

## UniStd.Animation
Directives natives sans `@keyframes` manuel:
- `uni-animate="float|reveal|pulse"` sur un élément HTML.
- `on:scroll-visible="reveal"` pour déclenchement à l'entrée viewport (IntersectionObserver).
- `window.UniStackTheme.get()/set()/toggle()` pour thème.
- `window.UniStackViewTransition(fn)` pour transitions de vue.

Exemple:
```text
html-ui:
  <section class="hero orb-a" uni-animate="float">
    <h1 uni-animate="reveal">{py:title()}</h1>
    <p on:scroll-visible="reveal">{py:subtitle()}</p>
  </section>;
```

## State Réactif (max)
- API globale: `window.UniState`
- méthodes: `get(path)`, `set(path, value)`, `patch(obj)`, `subscribe(fn)`, `watch(selector, fn)`, `snapshot()`
- binding HTML:
  - `data-uni-bind="path.to.value"` (text)
  - `data-uni-html="path"` (innerHTML)
  - `data-uni-show="path"` (show/hide)
  - `data-uni-model="path"` (2-way input/select/textarea)
  - `data-uni-class="active:ui.isActive,error:form.invalid"`

Exemple:
```text
state:
  counter = 0;
  form = { name: "", accepted: false };

html-ui:
  <p data-uni-bind="counter"></p>
  <input data-uni-model="form.name" />
  <input type="checkbox" data-uni-model="form.accepted" />
  <button onclick="UniState.set('counter', UniState.get('counter', 0) + 1)">+1</button>;
```

## Routes
Inline:
```text
GET /api/users { return py:listUsers(); }
```

Multi-ligne:
```text
POST /api/users {
  status 201;
  return py:createUser(name, email);
}
```

SQL paramétré:
```text
GET /api/users/{id} {
  return sql("SELECT * FROM users WHERE id = ?", id);
}
```

Validation d’entrées:
```text
POST /api/posts {
  validate title:string:required:min=3:max=200, published:boolean;
  return py:createPost(title, published);
}
```

## Composants `.uni` réutilisables
```text
components:
  component PostCard(title, author) => <article class="post"><h2>{{title}}</h2><span>{{author}}</span></article>;

html-ui:
  {render:PostCard("Hello", userName)};
```

## Style DSL
Blocs disponibles:
- `Theme(...)`
- `Text(...)`
- `Button(...)`
- `Card(...)`
- `Layout(...)`
- `Container(...)`

Exemple:
```text
style:
  Theme(Primary=#20b7e8, Accent=#47e957, Fg=#f7f7fb, Ring=rgba(32,183,232,0.25));
  Button(Name=primary, Bg=linear-gradient(135deg,var(--primary),var(--accent)), Color=#000, Radius=14, Padding=14px 28px, Ring=Ring);
  Card(Name=feature, Bg=rgba(20,20,32,0.6), Border=1px solid rgba(255,255,255,0.1), Radius=20, Padding=24px, Backdrop=10, Transition=all 0.3s cubic-bezier(0.4,0,0.2,1), HoverLift=5, HoverBorder=Theme.Primary);
```

## CLI
```bash
unistack init --template beauty
unistack templates
unistack build
unistack dev --port 3000
unistack dev --watch --port 3000
unistack fmt --file src/app.uni
unistack lint --file src/app.uni
unistack pack publish ./my-package
unistack pack install my-package@1.0.0 --target web
```

## Dossiers générés
- `generated/`: `app.server.ts`, `app.client.ts`, `app.edge.ts`, `index.html`, `app.py`
- `dist/`: artefacts bundlés (`app.js`, `chunks/*`, `server.cjs`, `edge.mjs`, `index.html`, `assets/`)

## Runtime Safety (Phase A)
- Python:
  - timeout par appel (`UNISTACK_PY_TIMEOUT_MS`, défaut `7000`)
  - circuit breaker (`UNISTACK_PY_FAILURE_THRESHOLD`, `UNISTACK_PY_COOLDOWN_MS`)
  - binaire configurable (`UNISTACK_PYTHON_BIN`)
- SQL:
  - paramètres préparés (`runtime.sql(query, params)`)
  - blocage multi-statements dans un appel
- DB migrations:
  - dossier `migrations/*.sql` appliqué au démarrage
  - table de suivi `_unistack_migrations`

## Exemples recommandés
- `examples/Demo.uni`
- `examples/Ultimate-Demo.uni`
- `src/examples/beauty-site.uni`
