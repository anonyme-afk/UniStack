# [Books] UniStack - Documentation Complète

**Dernière mise à jour:** 26 février 2026  
**Version:** 0.1.0 (MVP)

---

## Table des Matières

1. [Vue d'ensemble](#vue-densemble)
2. [Installation & Setup](#installation--setup)
3. [Comment coder avec UniStack](#comment-coder-avec-unistack)
4. [Architecture du compilateur](#architecture-du-compilateur)
5. [API & Runtime](#api--runtime)
6. [Limitations & Roadmap](#limitations--roadmap)

---

## Vue d'ensemble

**UniStack** est un DSL hybride full-stack qui fusionne les syntaxes de **Python, JavaScript, C++, HTML/CSS et SQL** dans un paradigme unique, transpilé en **JS/Node + WebAssembly**.

### Objectifs
- **Un seul fichier source** (`.uni`) pour front + back + perf + UI
- **Pas de context switching** entre langages
- **Transpilation automatique** vers multiples cibles
- **Full-stack natif** (routage, DB, API REST/GraphQL)

### Exemple simplifié
```unistack
unistack app "MonApp" version 1.0 {
  config: port=3000, db="sqlite:users.db";

  html-ui:
    <div class="app"><h1>{py:title()}</h1></div>;

  css:
    .app { font-family: Arial; };

  py-logic:
    def title(): return "Bienvenue";

  routes:
    GET /api/hello { return py:title(); }
}
```

---

## Installation & Setup

### Prérequis
- **Node.js** 20+ (ESM support)
- **TypeScript** 5.7+
- **npm** ou yarn

### Installation locale
```bash
# Clone ou copy du projet
cd UniStack

# Install dépendances
npm install

# Build la CLI
npm run build

# Test de la CLI
npm run unistack init
npm run build
npm run dev
```

### Commandes CLI majeures

| Commande | Purpose | Output |
|----------|---------|--------|
| `unistack init` | Crée `unistack.config.json` | Config de projet |
| `unistack build` | Parse + transpile + bundle | `dist/` avec artefacts |
| `unistack dev` | Build + démarre serveur local | http://localhost:3000 |

---

## Comment coder avec UniStack

### Structure de base d'un fichier `.uni`

```
unistack app "NOM_APP" version X.Y {
  config: ...;
  html-ui: ...;
  css: ...;
  py-logic: ...;
  js-events: ...;
  routes: ...;
}
```

### 1️⃣ Section `config`

Déclare les variables globales de l'application.

**Syntaxe:**
```unistack
config: clé1=valeur1, clé2=valeur2;
```

**Exemple:**
```unistack
config: port=3000, db="sqlite:users.db", debug=true, apiUrl="https://api.example.com";
```

**Types supportés:**
- `string`: `"valeur"`
- `number`: `42`, `3.14`
- `boolean`: `true`, `false`

**Utilisation en runtime:**
- Côté backend: Disponible via `runtime.config`
- Côté frontend: Pas d'accès direct (sécurité)

---

### 2️⃣ Section `html-ui`

Déclare le markup HTML avec **interpolations dynamiques**.

**Syntaxe:**
```unistack
html-ui:
  <balise attr="value">{py:fonction()} ou {js:variable}</balise>;
```

**Exemple:**
```unistack
html-ui:
  <div class="container">
    <h1>{py:getPageTitle()}</h1>
    <p>{js:userMessage}</p>
  </div>;

  <button onclick="updateUI">{js:buttonLabel}</button>;
```

**Caractéristiques:**
- HTML standard + expressions entre `{}`
- Référence à fonctions Python: `{py:fonction()}`
- Référence à variables JS: `{js:variable}`
- Référence à SQL: `{sql("SELECT ... ")}`
- Chaque bloc doit se terminer par `;`

**À la compilation:**
- → `generated/index.html` avec placeholders
- Placeholders remplacés dynamiquement au runtime

---

### 3️⃣ Section `css`

Déclare les styles CSS bruts.

**Syntaxe:**
```unistack
css:
  .class { propriété: valeur; };
  #id { propriété: valeur; };
```

**Exemple:**
```unistack
css:
  body { font-family: Arial, sans-serif; margin: 0; };
  .container { max-width: 1200px; margin: 0 auto; padding: 20px; };
  button { background-color: #007bff; color: white; border: none; cursor: pointer; };
```

**Compilation:**
- Injecté dans `<style>` du HTML généré
- Support CSS Flexbox, Grid, etc.

---

### 4️⃣ Section `py-logic`

Code **Python** synthétique pour la logique métier backend.

**Syntaxe:**
```unistack
py-logic:
  def fonction(arg1, arg2):
    # Code Python
    return resultat;
```

**Exemple:**
```unistack
py-logic:
  def getUsers():
    return {"users": [{"id": 1, "name": "Alice"}]};

  def getUserById(uid):
    return {"id": uid, "name": "Bob"};
```

**Limitations MVP:**
- [Warning]️ **NOT EXECUTED** - Stub seulement (no Python runtime yet)
- Code sauvegardé pour documentation future
- Les fonctions sont déclarées mais non appelables
- Sera implémenté en **Phase 2** avec Python-in-Wasm ou Node.js shim

**Utilisation future:**
```unistack
routes:
  GET /api/users { return py:getUsers(); }
```

---

### 5️⃣ Section `js-events`

Code **JavaScript** client-side pour interactivité et événements DOM.

**Syntaxe:**
```unistack
js-events:
  // Code JavaScript standard
  element.addEventListener('event', handler);
  function callback() { ... }
```

**Exemple:**
```unistack
js-events:
  document.addEventListener('DOMContentLoaded', () => {
    const btn = document.getElementById('myBtn');
    btn.addEventListener('click', () => {
      alert('Bouton cliqué!');
      fetchJson('/api/hello').then(data => console.log(data));
    });
  });
```

**Helpers disponibles:**
- `fetchJson(url, options)` - Appel API (wrapper fetch)
- `attachDomReady(handler)` - Exécute au chargement DOM

### 6️⃣ Section `routes`

Définition des **endpoints HTTP** backend (REST API).

**Syntaxe:**
```unistack
routes:
  HTTP_METHOD /path { 
    return py:fonction() ou sql("query") ou js:variable;
    status 200 ou 404 ou 500;
  }
```

**Méthodes HTTP supportées:**
- `GET`, `POST`, `PUT`, `DELETE`, `PATCH`

**Exemple:**
```unistack
routes:
  GET /api/users { 
    return py:getUsers();
  }

  GET /api/users/:id {
    return py:getUserById(id);
  }

  POST /api/users {
    return py:createUser(json_body);
    status 201;
  }

  DELETE /api/users/:id {
    status 204;
  }
```

**Body parsing:**
- JSON automatiquement parsé vers `json_body`
- Aucune validation actuellement (MVP)

---

## Architecture du compilateur

### Pipeline de compilation

```
Source (.uni)
    ↓
[PARSER] → AST (Abstract Syntax Tree)
    ↓
[IR Builder] → IR (Intermediate Representation)
    ↓
[CODE GENERATOR] → TS/JS + HTML
    ↓
[ESBUILD] → Bundles optimisés
    ↓
[OUTPUT] → dist/
    ├── app.js (client bundle)
    ├── server.mjs (server module)
    └── index.html (entrypoint HTML)
```

### 1️⃣ Parser (`src/parser/uniParser.ts`)

**État:** [OK] Implémenté (hand-written, pas ANTLR)

Prend le source `.uni` et produit une **strutcture AST** TypeScript.

**Sections parsingées:**
- Header: `unistack app "..." version X.Y`
- Config: clés/valeurs
- HTML: markup + expressions `{}`
- CSS: déclarations brutes
- Python: blocs de code
- JavaScript: blocs de code
- Routes: définitions HTTP

**Code:**
```typescript
export function parseUniFile(source: string, fileName: string): UniFile
```

**Exemple d'AST produit:**
```typescript
{
  name: "MonApp",
  version: "1.0",
  config: ConfigSection { entries: [...] },
  sections: [
    HtmlSection { blocks: [...] },
    CssSection { chunks: [...] },
    PySection { chunks: [...] },
    JsSection { chunks: [...] },
    RouteSection { routes: [...] }
  ]
}
```

### 2️⃣ IR Builder (`src/transpiler/index.ts` - fonction `buildIR()`)

Transforme l'AST en **IR (Intermediate Representation)**.

**Trois IRs générées:**

#### `FrontendIR`
```typescript
{
  html: string,           // Markup HTML avec placeholders
  css: string,            // CSS déclarations
  placeholders: [{        // Mappings pour interpolations dynamiques
    id: string,
    ref: LangRef            // py:func() || js:var || sql(...)
  }]
}
```

#### `BackendIR`
```typescript
{
  routes: [{
    method: "GET" | "POST" | ...,
    path: "/api/...",
    handler: LangRef         // Fonction à appeler
  }]
}
```

#### `AssetsIR`
```typescript
{
  clientEntry: string      // Code JS client à exécuter
}
```

### 3️⃣ Code Generator (`src/transpiler/index.ts`)

Génère les fichiers TypeScript finaux.

**Fichiers générés:**

#### `app.server.ts`
```typescript
import express from 'express';
export function createServer(runtime: UniRuntime) {
  const app = express();
  
  app.get('/api/users', async (req, res) => {
    const data = await runtime.callPy('getUsers');
    res.json(data);
  });
  
  return app;
}
```

#### `app.client.ts`
```typescript
import { attachDomReady, fetchJson } from '../runtime/client.js';

const userMessage = "Chargement...";
const buttonLabel = "Cliquez-moi";

document.addEventListener('click', () => {
  fetchJson('/api/users').then(data => {
    console.log('Users:', data);
  });
});
```

#### `index.html`
```html
<!DOCTYPE html>
<html>
  <head>
    <style>
      /* CSS injecté ici */
    </style>
  </head>
  <body>
    <!-- HTML avec placeholders remplacés -->
    <div class="app">
      <h1 data-uniref="title"></h1>
    </div>
    <script src="app.js"></script>
  </body>
</html>
```

### 4️⃣ Bundler (esbuild)

Les fichiers générés sont bundlés avec **esbuild**:
- `app.client.ts` → `dist/app.js` (browser bundle, ESM)
- `app.server.ts` → `dist/server.mjs` (Node.js, ESM)

---

## API & Runtime

### Runtime serveur (`src/runtime/server.ts`)

```typescript
interface UniRuntime {
  callPy(name: string, ...args: unknown[]): Promise<unknown>;
  sql(query: string, params?: unknown[]): Promise<unknown[]>;
  registerPy(name: string, fn: Function): void;  // BasicRuntime uniquement
}

class BasicRuntime implements UniRuntime {
  // MVP: manual registration of Python functions
  registerPy(name: string, fn: (...args: unknown[]) => unknown | Promise<unknown>): void
  async callPy(name: string, ...args: unknown[]): Promise<unknown>
  async sql(query: string, params: unknown[]): Promise<unknown[]>
}
```

**Utilisation en `src/cli.ts` (mode `dev`):**
```typescript
const runtime = new BasicRuntime();

// Register custom Python functions
runtime.registerPy('getUsers', async () => {
  return [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
});

runtime.registerPy('getUserById', (uid: number) => {
  return { id: uid, name: 'User ' + uid };
});

startServer(serverModule.createServer, runtime, { port: 3000 });
```

### Runtime client (`src/runtime/client.ts`)

```typescript
// Appel API typé
async function fetchJson<T>(url: string, options?: FetchJsonOptions): Promise<T>

// Attacher handler quand DOM est prêt
function attachDomReady(handler: () => void): void
```

**Exemple d'utilisation:**
```typescript
import { fetchJson, attachDomReady } from '../runtime/client.js';

attachDomReady(() => {
  const btn = document.getElementById('fetch-btn');
  btn?.addEventListener('click', async () => {
    const users = await fetchJson('/api/users');
    console.log('Users:', users);
  });
});
```

---

## Limitations & Roadmap

### [Cross] MVP Limitations (v0.1.0)

| Domaine | Limitation | Workaround |
|---------|-----------|-----------|
| **Python** | Code parsé mais non exécuté (stub) | Enregistrer fonctions manuellement via `runtime.registerPy()` |
| **SQL** | Aucun driver DB intégré (stub) | Requêtes ignorées au runtime |
| **C++/Wasm** | Pas encore supporté | Phase 2 |
| **Imports** | Pas de système de modules | Tout dans 1 fichier `.uni` |
| **Types** | Inférence minimale | Pas de validation de types statiques |
| **Error handling** | Messages d'erreur basiques | Amélioré en Phase 2 |
| **ANTLR** | Grammaire définie mais unused | Parser hand-written actuel |

### [OK] Phase 1 (MVP) - Réalisé
- [OK] Syntaxe fusionnée JS/HTML/CSS/Python/SQL
- [OK] Parsing + transpilation basique
- [OK] CLI avec init/build/dev
- [OK] Runtime Node.js + client
- [OK] Routes HTTP (GET/POST/etc)

### 📋 Phase 2 (À venir)
- [ ] Python runtime avec Pyodide ou shim Node.js
- [ ] Intégration SQLite/PostgreSQL
- [ ] C++/Rust → WebAssembly
- [ ] Système de modules (imports)
- [ ] Validation de types statiques
- [ ] Hot-reload en développement
- [ ] Debugger multi-langage
- [ ] Export vers Electron/PWA

### [Rocket] Phase 3+
- [ ] Graphql support
- [ ] ORM intégré
- [ ] Authentification native
- [ ] Déploiement cloud one-click

---

## Exemple complet d'application

Créez un fichier `example.uni`:

```unistack
unistack app "TodoApp" version 1.0 {
  config: port=3000, db="sqlite:todos.db", appName="Ma Todo List";

  html-ui:
    <div class="app-container">
      <h1>{py:getAppTitle()}</h1>
      <ul id="todos" class="todo-list">
        <li>Élément exemple - remplacé dynamiquement</li>
      </ul>
      <input type="text" id="todoInput" placeholder="Nouvelle tâche...">
      <button id="addBtn">{js:btnLabel}</button>
    </div>;

  css:
    body { font-family: 'Segoe UI', sans-serif; margin: 0; padding: 20px; background: #f5f5f5; };
    .app-container { max-width: 500px; margin: 0 auto; background: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); };
    h1 { color: #333; text-align: center; };
    .todo-list { list-style: none; padding: 0; margin: 20px 0; };
    .todo-list li { padding: 12px; background: #f9f9f9; border-left: 4px solid #007bff; margin: 8px 0; };
    input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; margin-right: 10px; };
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 14px; };
    button:hover { background: #0056b3; };

  py-logic:
    def getAppTitle():
      return "📝 Ma Todo List";

    def getTodos():
      return [
        {"id": 1, "text": "Apprendre UniStack", "done": False},
        {"id": 2, "text": "Créer une app", "done": False},
        {"id": 3, "text": "Déployer", "done": False}
      ];

    def addTodo(text):
      return {"id": 4, "text": text, "done": False};

  js-events:
    const btnLabel = "➕ Ajouter";
    
    document.addEventListener('DOMContentLoaded', () => {
      const input = document.getElementById('todoInput');
      const btn = document.getElementById('addBtn');
      
      btn.addEventListener('click', async () => {
        const text = input.value.trim();
        if (!text) return;
        
        const newTodo = await fetchJson('/api/todos', {
          method: 'POST',
          body: { text }
        });
        
        input.value = '';
        location.reload(); // Refresh pour voir la nouvelle todo
      });
    });

  routes:
    GET /api/todos {
      return py:getTodos();
    }

    POST /api/todos {
      return py:addTodo(text);
      status 201;
    }
}
```

**Pour compiler et lancer:**
```bash
unistack init
npm run build
npm run dev
# Visit http://localhost:3000
```

---

## Troubleshooting

### Erreur: "unistack.config.json not found"
```bash
unistack init
```

### Erreur: "py function not found"
Vérifiez qu'elle est enregistrée dans `src/cli.ts`:
```typescript
runtime.registerPy('getUsers', async () => { ... });
```

### Routes non disponibles
Assurez-vous que le `routes:` section existe et que les chemins correspondent à vos appels `fetchJson()`.

### CSS non applié
Vérifiez que les sélecteurs CSS ciblent les bons éléments HTML.

---

## Contributions bienvenues

L'une des priorités suivantes:

1. **Intégration Python réelle** (Pyodide ou Node.js)
2. **Driver SQLite** intégré
3. **Tests unitaires** pour le parseur
4. **Hot-reload** en mode `dev`

---

**Fait avec ❤️ par l'équipe UniStack**  
Version: 0.1.0-MVP | 26 février 2026
