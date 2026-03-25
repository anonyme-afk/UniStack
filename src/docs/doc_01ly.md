# UniStack Quick Reference / Référence Rapide UniStack

**english:** Quick syntax reference for UniStack DSL

**french:** Référence de syntaxe rapide pour DSL UniStack

---

## File Structure / Structure du Fichier

**english:** A `.uni` file has a header and 6 optional sections:

**french:** Un fichier `.uni` a un en-tête et 6 sections optionnelles :

```
;; UniStack header
name: MyApp
version: 1.0.0

config:
  debug: true
  port: 3000

html-ui:
  <h1>Welcome</h1>

css:
  body { background: #fff; }

py-logic:
  def greet(name):
    return f"Hello, {name}!"

js-events:
  document.getElementById('btn').onclick = () => { ... }

routes:
  GET /api/hello -> greeting()
```

---

## Section Reference / Référence des Sections

### 1. HEADER / EN-TÊTE

**English:** Required metadata at file start

**French:** Métadonnées requises au début du fichier

```
name: AppName
version: 1.0.0
```

### 2. CONFIG / CONFIGURATION

**English:** Application settings (key-value pairs)

**French:** Paramètres d'application (paires clé-valeur)

```
config:
  debug: true
  port: 3000
  database: postgres://localhost
  env: development
```

### 3. HTML-UI / INTERFACE HTML

**English:** HTML markup with support for Python expressions in `{py:...}` syntax

**French:** Balisage HTML avec support des expressions Python en syntaxe `{py:...}`

```
html-ui:
  <div class="container">
    <h1>{py:title}</h1>
    <p>Name: {py:get_user_name()}</p>
    <button id="submit">Submit</button>
  </div>
```

### 4. CSS / FEUILLE DE STYLE

**English:** CSS styles embedded in the file

**french:** Styles CSS intégrés dans le fichier

```
css:
  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
  }
  
  button {
    background: #007bff;
    color: white;
    border: none;
    padding: 10px 20px;
    cursor: pointer;
  }
```

### 5. PY-LOGIC / LOGIQUE PYTHON

**English:** Python functions (stored as strings, can be executed via runtime)

**French:** Fonctions Python (stockées sous forme de chaînes, peuvent être exécutées via le runtime)

```
py-logic:
  def greet(name):
    return f"Hello, {name}!"
  
  def add(a, b):
    return a + b
  
  def fetch_user(user_id):
    # Returns user object
    return {"id": user_id, "name": "John"}
```

### 6. JS-EVENTS / ÉVÉNEMENTS JAVASCRIPT

**English:** JavaScript event handlers and client-side logic

**French:** Gestionnaires d'événements JavaScript et logique côté client

```
js-events:
  const button = document.getElementById('submit');
  button.addEventListener('click', async () => {
    const response = await fetchJson('/api/hello', {name: 'World'});
    console.log(response);
  });
  
  function handleChange(event) {
    console.log('Changed:', event.target.value);
  }
```

### 7. ROUTES / ITINÉRAIRES

**English:** HTTP route definitions (GET, POST, PUT, DELETE)

**French:** Définitions des routes HTTP (GET, POST, PUT, DELETE)

#### Inline Syntax / Syntaxe Inline

```
routes:
  GET /hello -> return py:greet("World")
  GET /add?a=1&b=2 -> return py:add(1, 2)
  POST /submit -> return {"status": "ok"}
```

#### Multiline Syntax / Syntaxe Multiligne

```
routes:
  GET /api/user/{id}
    const user = py:fetch_user(id)
    return user

  POST /api/data
    const data = request.body
    const result = py:process(data)
    return {success: true, data: result}
```

---

## Built-in Functions / Fonctions Intégrées

### Server-side / Côté Serveur

```typescript
// Python function registry
runtime.registerPy(name: string, fn: Function)
runtime.callPy(name: string, ...args: any[])

// SQL stub (Phase 2)
runtime.sql(query: string, params?: any[])

// HTTP server
startServer<R extends UniRuntime>(port: number)
```

### Client-side / Côté Client

```javascript
// Fetch with JSON parsing
fetchJson<T>(url: string, options?: RequestInit): Promise<T>

// DOM ready handler
attachDomReady(callback: () => void)
```

---

## Expressions / Expressions

### Python Expressions in HTML / Expressions Python en HTML

```html
{py:variable_name}              <!-- Variable substitution -->
{py:function_name()}            <!-- Function call -->
{py:function_name(arg1, arg2)}  <!-- With arguments -->
{py:1 + 2}                      <!-- Simple expression -->
```

### Route Parameters / Paramètres de Route

```
GET /user/{id}                  <!-- Path parameter -->
GET /search?q=query             <!-- Query parameter -->
POST /api/data                  <!-- POST body -->
```

---

## Example: Complete Mini-App / Exemple : Mini-App Complète

```
;; Simple Todo App
name: TodoApp
version: 0.1.0

config:
  port: 3000
  debug: true

html-ui:
  <h1>My Todos</h1>
  <input type="text" id="input" placeholder="Add todo...">
  <button id="addBtn">Add</button>
  <ul id="list">
    {py:render_todos()}
  </ul>

css:
  #input {
    padding: 8px;
    font-size: 16px;
    width: 300px;
  }
  
  #addBtn {
    padding: 8px 16px;
    background: #28a745;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  #list li {
    padding: 10px;
    border-bottom: 1px solid #eee;
  }

py-logic:
  todos = []
  
  def add_todo(text):
    todos.append({"id": len(todos) + 1, "text": text})
    return todos
  
  def render_todos():
    html = ""
    for todo in todos:
      html += f'<li>{todo["text"]}</li>'
    return html

js-events:
  document.getElementById('addBtn').onclick = async () => {
    const input = document.getElementById('input');
    const text = input.value;
    if (text.trim()) {
      const response = await fetchJson('/api/todo/add', {text});
      input.value = '';
      location.reload();
    }
  };

routes:
  GET /api/todos
    -> return py:todos
  
  POST /api/todo/add
    const text = request.body.text
    -> return py:add_todo(text)
```

---

## Common Patterns / Modèles Courants

### REST API / API REST

```
routes:
  GET /api/items
    -> return py:get_all_items()
  
  GET /api/items/{id}
    -> return py:get_item(id)
  
  POST /api/items
    const data = request.body
    -> return py:create_item(data)
  
  PUT /api/items/{id}
    const data = request.body
    -> return py:update_item(id, data)
  
  DELETE /api/items/{id}
    -> return py:delete_item(id)
```

### Form Handling / Traitement des Formulaires

```
html-ui:
  <form id="contactForm">
    <input type="text" name="name" required>
    <input type="email" name="email" required>
    <textarea name="message" required></textarea>
    <button type="submit">Send</button>
  </form>

js-events:
  document.getElementById('contactForm').onsubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    const result = await fetchJson('/api/contact', data);
    alert('Message sent!');
  };

routes:
  POST /api/contact
    const name = request.body.name
    const email = request.body.email
    const message = request.body.message
    -> return py:send_email(name, email, message)
```

---

## CLI Commands / Commandes CLI

```bash
# Initialize new project
unistack init

# Build and bundle
unistack build

# Start development server (port 3000)
unistack dev

# Run tests
npm run test
```

---

## File Extensions / Extensions de Fichiers

- `.uni` - UniStack DSL source file
- `.ts` - Generated TypeScript code
- `.html` - Generated HTML
- `.js` - Compiled JavaScript
- `.json` - Configuration files

---

**For more details / Pour plus de détails, see GUIDE_COMPLET.md**

