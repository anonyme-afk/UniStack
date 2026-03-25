# UniStack — Guide Complet et Détaillé / Complete and Detailed Guide

**english:** This is the comprehensive guide for UniStack DSL. It covers everything from setup to troubleshooting.

**french:** Ceci est le guide complet pour le DSL UniStack. Il couvre tout, de la configuration au dépannage.

---

## Table des matières / Table of Contents

1. [Introduction](#introduction)
2. [Installation & Configuration](#installation--configuration)
3. [Syntaxe du langage](#syntaxe-du-langage)
4. [Exemples pratiques](#exemples-pratiques)
5. [Architecture interne](#architecture-interne)
6. [Dépannage & Bugs fréquents](#dépannage--bugs-fréquents)
7. [Guide de développement](#guide-de-développement)
8. [FAQ](#faq)

---

## Introduction

### Qu'est-ce que UniStack ? / What is UniStack?

**english:** UniStack is a Domain-Specific Language (DSL) that allows developers to write full-stack applications in a single file. Instead of switching between Python for backend, JavaScript for frontend, and HTML/CSS for UI, you write everything in one `.uni` file. The compiler then:

1. Parses your unified source code
2. Converts it to an intermediate representation (IR)
3. Generates TypeScript code for client and server
4. Bundles everything into distribution files

**french:** UniStack est un langage spécifique au domaine (DSL) qui permet aux développeurs d'écrire des applications full-stack dans un seul fichier. Au lieu de basculer entre Python pour le backend, JavaScript pour le frontend et HTML/CSS pour l'UI, vous écrivez tout dans un seul fichier `.uni`. Le compilateur fait alors :

1. Parse votre code source unifié
2. Le convertit en représentation intermédiaire (IR)
3. Génère du code TypeScript pour client et serveur
4. Crée un bundle pour la distribution

### Objectif du MVP / MVP Goal

**english:** The MVP (Minimum Viable Product) phase focuses on:
- Merging JS, HTML, CSS, Python, and SQL syntaxes
- Basic transpilation to TypeScript
- Simple routing with HTTP verbs
- No C++/Wasm yet (planned for Phase 2)

**french:** La phase MVP (Minimum Viable Product) se concentre sur :
- Fusionner les syntaxes JS, HTML, CSS, Python et SQL
- Transpilation basique en TypeScript
- Routage simple avec verbes HTTP
- Pas de C++/Wasm encore (prévu pour Phase 2)

---

## Installation & Configuration

### Prérequis / Prerequisites

**english:** Before you begin:
- Node.js 18+ (we use ES2020 syntax and top-level await)
- npm (comes with Node.js)
- A text editor or IDE (VS Code recommended)
- Basic knowledge of JavaScript, HTML, CSS

**french:** Avant de commencer :
- Node.js 18+ (nous utilisons la syntaxe ES2020 et top-level await)
- npm (inclus avec Node.js)
- Un éditeur de texte ou un IDE (VS Code recommandé)
- Connaissances de base en JavaScript, HTML, CSS

### Installation pas à pas / Step-by-Step Installation

#### Étape 1 : Cloner ou créer le projet / Step 1: Clone or Create Project

**english:**

```bash
# Clone the repository (if available)
git clone <repository-url> unistack-project
cd unistack-project

# OR create a new directory
mkdir my-unistack-app
cd my-unistack-app
```

**french:**

```bash
# Cloner le dépôt (s'il est disponible)
git clone <repository-url> unistack-project
cd unistack-project

# OU créer un nouveau répertoire
mkdir my-unistack-app
cd my-unistack-app
```

#### Étape 2 : Initialiser npm / Step 2: Initialize npm

**english:**

```bash
npm init -y
```

This creates a `package.json` file with default settings.

**french:**

```bash
npm init -y
```

Cela crée un fichier `package.json` avec les paramètres par défaut.

#### Étape 3 : Installer les dépendances UniStack / Step 3: Install UniStack Dependencies

**english:**

```bash
npm install --save-dev \
  typescript \
  ts-node \
  @types/node \
  @types/express \
  esbuild \
  express
```

**french:**

```bash
npm install --save-dev \
  typescript \
  ts-node \
  @types/node \
  @types/express \
  esbuild \
  express
```

#### Étape 4 : Créer la structure de répertoires / Step 4: Create Directory Structure

**english:**

```bash
mkdir -p src
mkdir -p dist
mkdir -p generated
```

Explanation:
- `src/` : Your source files (`.uni`, `.ts`)
- `dist/` : Output bundled files
- `generated/` : Intermediate TypeScript files

**french:**

```bash
mkdir -p src
mkdir -p dist
mkdir -p generated
```

Explication :
- `src/` : Vos fichiers sources (`.uni`, `.ts`)
- `dist/` : Fichiers groupés en sortie
- `generated/` : Fichiers TypeScript intermédiaires

#### Étape 5 : Initialiser UniStack / Step 5: Initialize UniStack

**english:**

```bash
npx unistack init
```

This creates a default `unistack.config.json` file.

**french:**

```bash
npx unistack init
```

Cela crée un fichier `unistack.config.json` par défaut.

### Configuration du fichier unistack.config.json

**english:** The configuration file controls how UniStack builds your project:

**french:** Le fichier de configuration contrôle comment UniStack compile votre projet :

```json
{
  "$schema": "https://example.com/unistack.schema.json",
  "entry": "src/app.uni",
  "outDir": "dist",
  "generatedDir": "generated",
  "serverEntry": "generated/app.server.ts",
  "clientEntry": "generated/app.client.ts"
}
```

**Explications détaillées / Detailed Explanations:**

| Clef / Key | Valeur / Value | Signification / Meaning |
|-----------|--------------|------------------------|
| `entry` | `"src/app.uni"` | **english:** Main UniStack source file. This is the entry point for compilation. **french:** Fichier source UniStack principal. C'est le point d'entrée de la compilation. |
| `outDir` | `"dist"` | **english:** Directory where built/bundled files are placed. This is what you deploy. **french:** Répertoire où les fichiers compilés/groupés sont placés. C'est ce que vous déployez. |
| `generatedDir` | `"generated"` | **english:** Temporary directory for intermediate TypeScript files generated during transpilation. Usually not committed to git. **french:** Répertoire temporaire pour les fichiers TypeScript intermédiaires générés lors de la transpilation. Généralement non validé sur git. |
| `serverEntry` | `"generated/app.server.ts"` | **english:** Path to generated server entry point (used by esbuild). **french:** Chemin vers le point d'entrée du serveur généré (utilisé par esbuild). |
| `clientEntry` | `"generated/app.client.ts"` | **english:** Path to generated client entry point (used by esbuild). **french:** Chemin vers le point d'entrée du client généré (utilisé par esbuild). |

### Configuration de package.json

**english:** Add these scripts to your `package.json`:

**french:** Ajoutez ces scripts à votre `package.json` :

```json
{
  "scripts": {
    "build": "tsc && npx unistack build",
    "dev": "npx unistack dev",
    "test": "node --loader ts-node/esm src/tests/test.ts",
    "lint": "echo 'Linter not configured yet'"
  }
}
```

---

## Syntaxe du langage

### Structure de base / Basic Structure

**english:** Every UniStack file must start with a header:

**french:** Chaque fichier UniStack doit commencer par un en-tête :

```text
unistack app "AppName" version X.Y {
  // sections go here
}
```

**Explication / Explanation:**
- `unistack app` : **english:** Keyword that identifies this as a UniStack project. **french:** Mot-clé qui identifie ceci comme un projet UniStack.
- `"AppName"` : **english:** Your application name (must be a string). **french:** Nom de votre application (doit être une chaîne).
- `version X.Y` : **english:** Version number (semantic versioning). **french:** Numéro de version (versioning sémantique).

### Sections disponibles / Available Sections

#### 1. Section `config:` — Configuration

**english:** Define key-value configuration pairs for your app:

**french:** Définissez des paires clé-valeur de configuration pour votre application :

```text
config: port=3000, database="postgres://localhost:5432", debug=true;
```

**Exemple complet / Full Example:**

```text
unistack app "BlogApp" version 1.0 {
  config: 
    port=3000,
    db="postgresql://localhost:5432/blog",
    env="development",
    maxConnections=100,
    corsEnabled=true;
}
```

**english:** Configuration values are parsed as literals:
- **Numbers:** `3000`, `100`, `99.99`
- **Strings:** `"text"` (enclosed in quotes)
- **Booleans:** `true` or `false`

**french:** Les valeurs de configuration sont parsées comme des littéraux :
- **Nombres :** `3000`, `100`, `99.99`
- **Chaînes :** `"text"` (entre guillemets)
- **Booléens :** `true` ou `false`

#### 2. Section `html-ui:` — Interface utilisateur

**english:** Write your HTML markup. UniStack supports embedding cross-language references like `{py:function()}`:

**french:** Écrivez votre balisage HTML. UniStack supporte l'imbrication de références inter-langages comme `{py:function()}` :

```text
html-ui:
  <div id="app" class="container">
    <h1>{py:title()}</h1>
    <p>Welcome to {py:appName()}</p>
    <button id="submitBtn">Click me</button>
  </div>;
```

**Exemple plus complexe / More Complex Example:**

```text
html-ui:
  <html>
    <head>
      <title>{py:Page_Title}</title>
    </head>
    <body>
      <nav class="navbar">
        <span>{py:get_user_name()}</span>
        <a href="/logout">Logout</a>
      </nav>
      <main>
        <section id="posts">
          <h2>Blog Posts</h2>
          <div id="post-list"></div>
        </section>
        <aside id="sidebar">
          <h3>Recent Tags</h3>
          <ul id="tags"></ul>
        </aside>
      </main>
    </body>
  </html>;
```

**Syntaxe des expressions / Expression Syntax:**

**english:**
- `{py:function()}` → Call Python function
- `{js:variable}` → Reference JavaScript variable
- `{sql("SELECT * FROM users")}` → SQL query

**french:**
- `{py:function()}` → Appeler fonction Python
- `{js:variable}` → Référencer variable JavaScript
- `{sql("SELECT * FROM users")}` → Requête SQL

#### 3. Section `css:` — Feuilles de style

**english:** Define CSS for your UI:

**french:** Définissez le CSS pour votre UI :

```text
css:
  .container { max-width: 1200px; margin: 0 auto; padding: 20px; };
  .navbar { background: #333; color: white; padding: 10px; };
  .navbar span { float: left; };
  .navbar a { float: right; color: #0ff; };
  #posts { width: 70%; float: left; };
  #sidebar { width: 25%; float: right; };
```

**Exemple complet / Full Example:**

```text
css:
  * { margin: 0; padding: 0; box-sizing: border-box; };
  body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: #f5f5f5; };
  .container { max-width: 1200px; margin: 0 auto; padding: 20px; background: white; border-radius: 8px; };
  .navbar { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 15px 20px; color: white; };
  .navbar h1 { font-size: 24px; font-weight: bold; };
  .navbar a { color: white; text-decoration: none; margin-left: 20px; };
  .navbar a:hover { text-decoration: underline; };
  .content { display: grid; grid-template-columns: 2fr 1fr; gap: 20px; margin-top: 20px; };
  .post { background: white; padding: 15px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); };
  .post h2 { color: #667eea; margin-bottom: 10px; };
  .post-meta { color: #999; font-size: 12px; };
  .sidebar { padding: 15px; background: #f9f9f9; border-radius: 5px; };
```

#### 4. Section `py-logic:` — Logique Python

**english:** Define Python-like functions and variables (currently stored as strings; execution is handled by runtime):

**french:** Définissez des fonctions et variables de type Python (actuellement stockées en tant que chaînes ; l'exécution est gérée par le runtime) :

```text
py-logic:
  def get_posts():
    return sql("SELECT * FROM posts ORDER BY created_at DESC");

  def get_user_profile(user_id):
    return sql("SELECT * FROM users WHERE id = ?", user_id);

  app_name = "My Awesome Blog";
```

**Exemple plus détaillé / More Detailed Example:**

```text
py-logic:
  def authenticate_user(email, password):
    user = sql("SELECT id, hash FROM users WHERE email = ?", email);
    if user and verify_password(password, user.hash):
      return user.id;
    return None;

  def get_blog_stats():
    posts_count = sql("SELECT COUNT(*) as count FROM posts");
    users_count = sql("SELECT COUNT(*) as count FROM users");
    return {
      "posts": posts_count[0].count,
      "users": users_count[0].count
    };

  def search_posts(query):
    return sql(
      "SELECT * FROM posts WHERE title ILIKE ? OR content ILIKE ? LIMIT 20",
      "%" + query + "%",
      "%" + query + "%"
    );

  site_title = "My Blog Platform";
  site_description = "A place to share ideas";
  version = "1.0.0";
```

#### 5. Section `js-events:` — Événements JavaScript

**english:** Client-side JavaScript code for handling events and interactivity:

**french:** Code JavaScript côté client pour gérer les événements et l'interactivité :

```text
js-events:
  document.getElementById('submitBtn').addEventListener('click', function() {
    console.log('Button clicked!');
    alert('Hello from UniStack!');
  });

  document.addEventListener('DOMContentLoaded', function() {
    console.log('Page loaded');
  });
```

**Exemple plus avancé / More Advanced Example:**

```text
js-events:
  // Fetch and display posts
  async function loadPosts() {
    try {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      const postList = document.getElementById('post-list');
      postList.innerHTML = '';
      posts.forEach(post => {
        const postDiv = document.createElement('div');
        postDiv.className = 'post';
        postDiv.innerHTML = `
          <h2>${post.title}</h2>
          <p class="post-meta">By ${post.author} on ${post.date}</p>
          <p>${post.excerpt}</p>
          <a href="/post/${post.id}">Read more</a>
        `;
        postList.appendChild(postDiv);
      });
    } catch (error) {
      console.error('Error loading posts:', error);
    }
  }

  // Event listeners
  document.addEventListener('DOMContentLoaded', loadPosts);

  document.getElementById('searchBtn').addEventListener('click', async function() {
    const query = document.getElementById('searchInput').value;
    const response = await fetch('/api/search?q=' + encodeURIComponent(query));
    const results = await response.json();
    console.log('Search results:', results);
  });
```

#### 6. Section `routes:` — Routage HTTP

**english:** Define HTTP endpoints:

**french:** Définissez des points finaux HTTP :

```text
routes:
  GET /api/posts { return py:get_posts(); }
  GET /api/user/{id} { return py:get_user_profile(id); }
  POST /api/search { return py:search_posts(query); }
```

**Syntaxe complète / Full Syntax:**

```text
routes:
  GET /api/posts { 
    return py:get_posts(); 
  }

  POST /api/posts {
    status 201;
    return py:create_post(title, content);
  }

  GET /api/posts/{id} { 
    return py:get_post_by_id(id); 
  }

  PUT /api/posts/{id} {
    return py:update_post(id, title, content);
  }

  DELETE /api/posts/{id} {
    status 204;
    return py:delete_post(id);
  }

  GET /health {
    return js:{ status: 'ok' };
  }
```

**HTTP Verbs / Verbes HTTP:**

| Verbe / Verb | Utilisation / Usage | Exemple / Example |
|-------------|------------------|---------|
| `GET` | **english:** Retrieve data, no side effects. **french:** Récupérer des données, pas d'effets secondaires. | `GET /api/users` |
| `POST` | **english:** Create new resource. **french:** Créer une nouvelle ressource. | `POST /api/posts` |
| `PUT` | **english:** Replace entire resource. **french:** Remplacer la ressource entière. | `PUT /api/posts/123` |
| `DELETE` | **english:** Remove resource. **french:** Supprimer une ressource. | `DELETE /api/posts/123` |
| `PATCH` | **english:** Partial update. **french:** Mise à jour partielle. | `PATCH /api/posts/123` |

---

## Exemples pratiques

### Exemple 1 : Application de Blog simple / Simple Blog Application

**english:** Let's create a simple blog app with posts and user authentication:

**french:** Créons une simple application de blog avec des messages et l'authentification des utilisateurs :

```text
unistack app "SimpleBlog" version 1.0 {
  config:
    port=3000,
    db="sqlite:blog.db",
    env="development";

  html-ui:
    <html>
      <head>
        <title>My Blog</title>
      </head>
      <body>
        <nav>
          <h1>{py:site_title}</h1>
          <div id="user-info"></div>
        </nav>
        <main>
          <h2>Latest Posts</h2>
          <div id="posts-container"></div>
        </main>
      </body>
    </html>;

  css:
    body { font-family: Arial; margin: 0; padding: 0; background: #f0f0f0; };
    nav { background: #333; color: white; padding: 20px; };
    nav h1 { margin: 0; };
    main { max-width: 800px; margin: 20px auto; };
    .post { background: white; margin: 10px 0; padding: 15px; border-radius: 5px; };
    .post h3 { margin-top: 0; color: #333; };
    .post-meta { color: #666; font-size: 12px; };

  py-logic:
    site_title = "My Awesome Blog";

    def get_all_posts():
      return sql("SELECT id, title, content, author, created_at FROM posts ORDER BY created_at DESC");

    def get_post_by_id(post_id):
      return sql("SELECT * FROM posts WHERE id = ?", post_id);

    def create_post(title, content, author):
      return sql(
        "INSERT INTO posts (title, content, author, created_at) VALUES (?, ?, ?, datetime('now')) RETURNING id",
        title,
        content,
        author
      );

    def delete_post(post_id):
      return sql("DELETE FROM posts WHERE id = ?", post_id);

  js-events:
    async function loadPosts() {
      const response = await fetch('/api/posts');
      const posts = await response.json();
      const container = document.getElementById('posts-container');
      container.innerHTML = posts.map(post => `
        <div class="post">
          <h3>${post.title}</h3>
          <p class="post-meta">By ${post.author}</p>
          <p>${post.content}</p>
        </div>
      `).join('');
    }

    document.addEventListener('DOMContentLoaded', loadPosts);

  routes:
    GET /api/posts { return py:get_all_posts(); }
    GET /api/posts/{id} { return py:get_post_by_id(id); }
    POST /api/posts { return py:create_post(title, content, author); }
    DELETE /api/posts/{id} { return py:delete_post(id); }
}
```

### Exemple 2 : Application de TODO avec persistance / TODO App with Persistence

**english:** A todo application with local storage and CRUD operations:

**french:** Une application de tâches avec stockage local et opérations CRUD :

```text
unistack app "TodoApp" version 1.0 {
  config:
    port=3000,
    db="sqlite:todos.db";

  html-ui:
    <div id="app">
      <h1>My Todos</h1>
      <input id="todoInput" type="text" placeholder="Add a new todo...">
      <button id="addBtn">Add</button>
      <ul id="todoList"></ul>
    </div>;

  css:
    #app { max-width: 500px; margin: 50px auto; font-family: Arial; };
    input { width: 80%; padding: 10px; };
    button { padding: 10px 20px; cursor: pointer; };
    li { list-style: none; padding: 10px; margin: 5px 0; background: #e0e0e0; border-radius: 3px; };
    .done { text-decoration: line-through; color: #999; };
    .delete-btn { float: right; cursor: pointer; color: red; };

  py-logic:
    def get_all_todos():
      return sql("SELECT id, text, done FROM todos ORDER BY id DESC");

    def add_todo(text):
      return sql("INSERT INTO todos (text, done) VALUES (?, 0) RETURNING id", text);

    def toggle_todo(todo_id):
      return sql("UPDATE todos SET done = NOT done WHERE id = ?", todo_id);

    def delete_todo(todo_id):
      return sql("DELETE FROM todos WHERE id = ?", todo_id);

  js-events:
    let todos = [];

    async function loadTodos() {
      const response = await fetch('/api/todos');
      todos = await response.json();
      renderTodos();
    }

    function renderTodos() {
      const list = document.getElementById('todoList');
      list.innerHTML = todos.map(todo => `
        <li class="${todo.done ? 'done' : ''}">
          ${todo.text}
          <span class="delete-btn" onclick="deleteTodo(${todo.id})">✕</span>
        </li>
      `).join('');
    }

    async function addTodo() {
      const input = document.getElementById('todoInput');
      const text = input.value.trim();
      if (text) {
        await fetch('/api/todos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text })
        });
        input.value = '';
        loadTodos();
      }
    }

    async function deleteTodo(id) {
      await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      loadTodos();
    }

    document.getElementById('addBtn').addEventListener('click', addTodo);
    document.addEventListener('DOMContentLoaded', loadTodos);

  routes:
    GET /api/todos { return py:get_all_todos(); }
    POST /api/todos { return py:add_todo(text); }
    DELETE /api/todos/{id} { return py:delete_todo(id); }
    PUT /api/todos/{id} { return py:toggle_todo(id); }
}
```

---

## Architecture interne

### Flux de compilation / Compilation Flow

**english:** When you run `unistack build`:

**french:** Quand vous exécutez `unistack build` :

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. CLI reads unistack.config.json                               │
│    → Gets entry point (e.g., src/app.uni)                       │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│ 2. Parser (src/parser/uniParser.ts)                             │
│    → Tokenizes and parses app.uni                               │
│    → Creates AST (Abstract Syntax Tree)                         │
│    → Output: UniFile { sections: [...] }                        │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│ 3. Transpiler (src/transpiler/index.ts)                         │
│    → Converts AST to IR (Intermediate Representation)           │
│    → Extracts frontend (HTML/CSS)                               │
│    → Extracts backend (routes/handlers)                         │
│    → Extracts assets (JS code)                                  │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│ 4. Code Generation                                              │
│    → Generates app.server.ts (Express routes)                   │
│    → Generates app.client.ts (Client code)                      │
│    → Generates index.html (UI)                                  │
│    → Output: Files in generated/                                │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│ 5. Bundling (esbuild)                                           │
│    → Bundles app.server.ts → dist/server.mjs                    │
│    → Bundles app.client.ts → dist/app.js                        │
│    → Copies index.html → dist/index.html                        │
│    → Output: Files in dist/                                     │
└──────────────────┬──────────────────────────────────────────────┘
                   │
┌──────────────────▼──────────────────────────────────────────────┐
│ 6. Done! Files ready for deployment                             │
│    → Run: npm run dev (to test)                                 │
│    → Or: Deploy dist/ files to hosting                          │
└─────────────────────────────────────────────────────────────────┘
```

### Modèles de données clés / Key Data Models

#### AST (src/lang/ast.ts)

**english:** The Abstract Syntax Tree represents your parsed UniStack file:

**french:** L'arbre de syntaxe abstraite représente votre fichier UniStack parsé :

```typescript
export interface UniFile {
  name: string;              // "MyApp"
  version: string;           // "1.0"
  config: ConfigSection | null;
  sections: Section[];       // [config, html, css, py, js, routes]
}

export type Section = 
  | ConfigSection
  | HtmlSection
  | CssSection
  | PySection
  | JsSection
  | RouteSection;

export interface ConfigSection {
  kind: 'config';
  entries: ConfigEntry[];
}

export interface HtmlSection {
  kind: 'html';
  blocks: HtmlBlock[];
}

export interface RouteSection {
  kind: 'routes';
  routes: RouteDef[];
}
```

#### IR (Intermediate Representation)

**english:** The IR is a simplified version of the AST, focused on what's needed for code generation:

**french:** L'IR est une version simplifiée de l'AST, concentrée sur ce qui est nécessaire pour la génération de code :

```typescript
export interface CompilationIR {
  frontend: FrontendIR;    // HTML + CSS
  backend: BackendIR;      // Routes
  assets: AssetsIR;        // Client JS
}

export interface FrontendIR {
  html: string;
  css: string;
  placeholders: FrontendPlaceholder[];  // {py:func()} refs
}

export interface BackendIR {
  routes: BackendRouteIR[];
}

export interface BackendRouteIR {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  handler: LangRef;  // Which function to call
}
```

---

## Dépannage & Bugs fréquents

### Bug #1 : Section non reconnue / Section Not Recognized

**english:**

**Symptôme / Symptom:**
```
Error: UniStack: invalid route line: GET /foo { return py:foo; }
```

**Cause / Cause:**
Your route syntax has a typo or extra whitespace.

**Solution / Solution:**

❌ **Mauvais / Wrong:**
```text
routes
  GET /foo { return py:foo; }
```

✅ **Correct:**
```text
routes:
  GET /foo { return py:foo; }
```

**Key Points:**
- Section name must end with `:` (colon)
- No space between section name and colon

**french:**

**Symptôme / Symptom:**
```
Error: UniStack: invalid route line: GET /foo { return py:foo; }
```

**Cause / Cause:**
Votre syntaxe de route a une faute de frappe ou un espace supplémentaire.

**Solution / Solution:**

❌ **Mauvais / Wrong:**
```text
routes
  GET /foo { return py:foo; }
```

✅ **Correct:**
```text
routes:
  GET /foo { return py:foo; }
```

---

### Bug #2 : Les fonctions Python ne sont pas trouvées / Python Functions Not Found

**english:**

**Symptôme / Symptom:**
```
Error: UniStack runtime: py function not found: get_posts
```

**Cause / Cause:**
The Python function is defined in your `.uni` file, but the runtime hasn't registered it. Currently the MVP expects manual registration.

**Solution / Solution:**

**Step 1**: Define your function in `py-logic:` section
```text
py-logic:
  def get_posts():
    return sql("SELECT * FROM posts");
```

**Step 2**: In your CLI dev mode, manually register it (temporary workaround for MVP):

In `src/cli.ts`:
```typescript
const runtime = new BasicRuntime();
// TODO: Auto-register Python functions when they exist
runtime.registerPy('get_posts', async () => {
  // Call your actual Python implementation via subprocess or API
  return [];
});
```

**TODO for Phase 2**: Auto-register functions from `py-logic:` section.

**french:**

**Symptôme / Symptom:**
```
Error: UniStack runtime: py function not found: get_posts
```

**Cause / Cause:**
La fonction Python est définie dans votre fichier `.uni`, mais le runtime ne l'a pas enregistrée. Actuellement, le MVP s'attend à une enregistrement manuel.

**Solution / Solution:**

**Étape 1**: Définir votre fonction dans la section `py-logic:`
```text
py-logic:
  def get_posts():
    return sql("SELECT * FROM posts");
```

**Étape 2**: En mode dev CLI, l'enregistrer manuellement (solution temporaire pour MVP) :

Dans `src/cli.ts`:
```typescript
const runtime = new BasicRuntime();
// TODO: Auto-register Python functions when they exist
```

---

### Bug #3 : Routes non générées / Routes Not Generated

**english:**

**Symptôme / Symptom:**
```
// generated/app.server.ts is empty or has no routes
```

**Cause / Cause:**
The routes section isn't being parsed. Common reasons:
1. No leading space before `routes:`
2. Missing colon after `routes`
3. Routes inside wrong file

**Solution / Solution:**

**Make sure:**
1. Your `routes:` line is properly indented (2 spaces from file start)
2. There's a colon after `routes`
3. You're in the right `.uni` file

WRONG:
```text
unistack app "Test" version 1.0 {
routes:
GET /foo { return py:foo; }
}
```

CORRECT:
```text
unistack app "Test" version 1.0 {
  routes:
    GET /foo { return py:foo; }
}
```

**Debugging steps / Étapes de dépannage:**

```bash
# Step 1: Check file exists
cat src/app.uni | grep routes

# Step 2: Check config
cat unistack.config.json

# Step 3: Run with verbose (future feature)
npx unistack build --verbose

# Step 4: Check generated files
cat generated/app.server.ts
```

---

### Bug #4 : HTML ne s'affiche pas / HTML Not Displaying

**english:**

**Symptôme / Symptom:**
```
Blank page when opening dist/index.html
```

**Cause / Cause:**
1. HTML is empty in the generated file
2. CSS has syntax errors
3. JavaScript errors in console

**Solution / Solution:**

**Step 1**: Check generated HTML
```bash
cat generated/index.html
```

**Step 2**: Verify your `html-ui:` section
```text
html-ui:
  <div>Hello World</div>;
```

**Step 3**: Check console (F12 in browser)
```javascript
// Look for JavaScript errors
console.log('Page loaded');
```

**Step 4**: Verify structure
```text
html-ui:
  <div class="app">
    Content here
  </div>;
```

Note: Each HTML block must end with `;`

---

### Bug #5 : CSS ne s'applique pas / CSS Not Applied

**english:**

**Symptôme / Symptom:**
```
Styles not appearing on the page
```

**Cause / Cause:**
1. CSS selector is wrong
2. CSS is not in the `css:` section
3. Class/ID in HTML doesn't match CSS selector

**Solution / Solution:**

**Match selectors carefully:**

```text
html-ui:
  <div class="container">
    <h1>Title</h1>
  </div>;

css:
  .container { max-width: 1200px; margin: 0 auto; };
  .container h1 { color: blue; };
```

**Common CSS mistakes:**

WRONG:
```css
#app { }         /* CSS for #app but HTML has class="app" */
.container { }   /* No matching elements in HTML */
```

CORRECT:
```css
.app { }         /* Matches class="app" */
.container { }   /* Used in HTML */
```

---

### Bug #6 : Erreurs TypeScript lors de la compilation / TypeScript Compilation Errors

**english:**

**Symptôme / Symptom:**
```
error TS2307: Cannot find module 'express'
```

**Cause / Cause:**
Dependencies not installed or type definitions missing.

**Solution / Solution:**

```bash
# Install missing packages
npm install express
npm install --save-dev @types/express

# Or reinstall all
npm install

# Then rebuild
npm run build
```

**For common packages:**
```bash
npm install --save-dev typescript @types/node
npm install express esbuild
```

---

### Bug #7 : Port 3000 déjà utilisé / Port 3000 Already in Use

**english:**

**Symptôme / Symptom:**
```
Error: listen EADDRINUSE: address already in use :::3000
```

**Cause / Cause:**
Another process is using port 3000.

**Solution / Solution:**

**Option 1: Find and kill process**
```bash
# On Windows
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# On Mac/Linux
lsof -ti:3000 | xargs kill -9
```

**Option 2: Change port**
```json
{
  "port": 3001
}
```

---

### Bug #8 : Les requêtes SQL retournent undefined / SQL Queries Return Undefined

**english:**

**Symptôme / Symptom:**
```
{py:get_posts()} returns undefined
```

**Cause / Cause:**
SQL method is currently a stub in the MVP runtime.

**Solution / Solution (Temporary):**

Currently in `src/runtime/server.ts`:
```typescript
async sql(query: string, params?: unknown[]): Promise<unknown[]> {
  console.warn('SQL called (stub):', query);
  return []; // Always returns empty array
}
```

**TODO for Phase 2:**
- Integrate SQLite
- Connect to PostgreSQL/MySQL
- Implement proper SQL execution

---

## Guide de développement

### Ajouter une nouvelle section / Adding a New Section

**english:** If you want to add support for a new section type (e.g., `wasm:`):

**french:** Si vous voulez ajouter le support pour un nouveau type de section (par exemple, `wasm:`) :

**Step 1**: Update AST (`src/lang/ast.ts`)
```typescript
export interface WasmSection {
  kind: 'wasm';
  code: string;
}

export type Section = 
  | ConfigSection 
  | HtmlSection 
  | CssSection 
  | PySection 
  | JsSection 
  | RouteSection
  | WasmSection;  // Add here
```

**Step 2**: Update Parser (`src/parser/uniParser.ts`)
```typescript
type SectionKind = 'config' | 'html-ui' | 'css' | 'py-logic' | 'js-events' | 'routes' | 'wasm';

// In parseUniFile:
case 'wasm': {
  const wasm = parseWasmSection(raw.lines);
  sections.push(wasm);
  break;
}

function parseWasmSection(lines: string[]): WasmSection {
  const code = lines.join('\n');
  return { kind: 'wasm', code };
}
```

**Step 3**: Update Transpiler (`src/transpiler/index.ts`)
```typescript
// In buildIR or buildBackendIR
const wasmSections = ast.sections.filter(
  (s): s is WasmSection => s.kind === 'wasm'
);

// Process and add to appropriate IR part
```

---

### Exécuter les tests / Running Tests

**english:**

```bash
# Run all tests
npm run test

# Run specific test
npm test -- --grep "parser"

# Watch mode (future feature)
npm test -- --watch
```

**Current test file: `src/tests/parser.test.ts`**

**french:**

```bash
# Exécuter tous les tests
npm run test

# Tester l'architecture complète
npm run build && npm run test
```

---

## FAQ

### Q: Puis-je utiliser du vrai Python en production ? / Can I use real Python in production?

**english:** Not yet in the MVP. Currently, Python code is stored as strings in the generated TypeError. Phase 2 will include:
- Python subprocess integration
- Py-to-Wasm compilation
- Direct Python execution via runtime

**french:** Pas encore dans le MVP. Actuellement, le code Python est stocké en tant que chaînes. Phase 2 inclura :
- Intégration Python subprocess
- Compilation Py-to-Wasm
- Exécution Python directe

### Q: Qu'en est-il du C++ et Wasm ? / What about C++ and Wasm?

**english:** Planned for Phase 2. Currently not supported. The MVP focuses on JS/HTML/CSS/Python/SQL.

**french:** Prévu pour Phase 2. Non supporté actuellement. Le MVP se concentre sur JS/HTML/CSS/Python/SQL.

### Q: Comment personnaliser la génération de code ? / How to customize code generation?

**english:** Edit `src/transpiler/index.ts`:
- `buildIR()` → Converts AST to IR
- `generateServerTs()` → Server code
- `generateClientTs()` → Client code
- `generateIndexHtml()` → HTML

**french:** Modifiez `src/transpiler/index.ts` :
- `buildIR()` → Convertit AST en IR
- `generateServerTs()` → Code serveur
- `generateClientTs()` → Code client
- `generateIndexHtml()` → HTML

### Q: Puis-je déployer sur Heroku / Vercel ? / Can I deploy to Heroku/Vercel?

**english:** Yes! After build:
```bash
npx unistack build
# Deploy dist/ directory to your hosting
```

Compatible with any Node.js hosting.

**french:** Oui ! Après la compilation :
```bash
npx unistack build
# Déployez le répertoire dist/ sur votre hosting
```

Compatible avec tout hosting Node.js.

### Q: Quelles sont les limitations du MVP ? / What are MVP limitations?

**english:**
1. Python code is not executed (stored as strings)
2. SQL is stubbed (returns empty array)
3. No C++/Wasm support
4. No hot-reload yet
5. No debugging tools yet
6. Limited error messages
7. No package/module system yet

**french:**
1. Le code Python n'est pas exécuté (stocké en tant que chaînes)
2. SQL est un stub (retourne un tableau vide)
3. Pas de support C++/Wasm
4. Pas de hot-reload encore
5. Pas d'outils de débogage encore
6. Messages d'erreur limités
7. Pas de système de paquets/modules encore

### Q: Comment contribuer au projet ? / How to contribute?

**english:** Check CONTRIBUTING.md (if available) or:
1. Fork repository
2. Create feature branch
3. Add tests
4. Submit pull request

**Priorities for Phase 2:**
- Python execution support
- SQL database integration
- C++/Wasm compilation
- Better error reporting
- IDE/LSP support

**french:** Vérifiez CONTRIBUTING.md (si disponible) ou :
1. Forker le dépôt
2. Créer une branche de fonctionnalité
3. Ajouter des tests
4. Soumettre une pull request

---

## Ressources supplémentaires / Additional Resources

**english:**
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Express.js Guide](https://expressjs.com/)
- [esbuild Documentation](https://esbuild.github.io/)
- [MDN Web Docs](https://developer.mozilla.org/)

**french:**
- [Documentation TypeScript](https://www.typescriptlang.org/)
- [Guide Express.js](https://expressjs.com/)
- [Documentation esbuild](https://esbuild.github.io/)
- [Docs Web MDN](https://developer.mozilla.org/)

---

**english:** This guide will be updated as UniStack evolves. For the latest information, check the repository.

**french:** Ce guide sera mis à jour au fur et à mesure que UniStack évolue. Pour les dernières informations, consultez le dépôt.

**Last Updated / Dernière mise à jour:** February 26, 2026  
**UniStack Version / Version UniStack:** 0.1.0 (MVP)
