<!--
Copyright 2026 anonyme-afk

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
-->

# Code Generation & Optimization / Génération et optimisation du code

**english:** guide to generating efficient code with UniStack and optimizing output.

**french:** guide pour générer du code efficace avec UniStack et optimiser la sortie.

---

## Understanding Generated Output / Comprendre la sortie générée

### File Structure After Build

```bash
npm run build

# Creates:
generated/           # Intermediate TypeScript
├── app.server.ts   # Express server routes
├── app.client.ts   # Browser client code  
├── index.html      # HTML with injected CSS
└── app.py          # Python logic (stub)

dist/               # Final bundled output
├── app.js          # Browser bundle (esbuild)
├── server.cjs      # Node.js server bundle (CommonJS)
├── index.html      # Deployed HTML
└── assets/
    └── base.css    # Design system stylesheet
```

### What Each File Contains

**generated/app.server.ts** - Express server implementation
```typescript
import express from 'express';
import { DataSet } from '../runtime/data.js';

export function createServer(runtime: UniRuntime) {
  const app = express();
  
  app.get('/path', async (req, res) => {
    // Route handler logic
    const data = await runtime.callPy('function_name');
    res.json(data);
  });
  
  return app;
}
```

**generated/app.client.ts** - Browser JavaScript code
```typescript
// Your JavaScript event handlers
// Client-side logic
export function bootstrap() {
  // Initialize page
}
bootstrap();
```

**generated/index.html** - Full HTML page
```html
<!doctype html>
<html lang="en">
  <head>
    <!-- Design system injected here -->
    <link rel="stylesheet" href="/assets/base.css" />
    <!-- Custom styles -->
  </head>
  <body>
    <!-- Your HTML content -->
    <script type="module" src="./app.js"></script>
  </body>
</html>
```

---

## Optimizing Generated Code / Optimiser le code généré

### 1. Minimize HTML

**Bad - Excessive divs**
```html
html:
  <div><div><div>
    <div><div>
      <h1>Title</h1>
    </div></div>
  </div></div></div>;
```

**Good - Semantic structure**
```html
html:
  <div class="container">
    <header>
      <h1>Title</h1>
    </header>
  </div>;
```

**Generated size:**
- Bad: 450 bytes
- Good: 180 bytes

### 2. Consolidate CSS

**Bad - Multiple style sections**
```uni
style:
  h1 { color: blue; }

style:
  button { padding: 10px; }

style:
  .container { max-width: 1200px; }
```

**Good - Single consolidated section**
```uni
style:
  h1 { color: blue; }
  button { padding: 10px; }
  .container { max-width: 1200px; }
```

**Generated size:** Same content, cleaner structure

### 3. Reuse Design System Classes

**Bad - Custom styles for everything**
```html
style:
  .my-button { 
    background: #20b7e8; 
    padding: 10px 20px; 
    border-radius: 8px;
  }

html:
  <button class="my-button">Click</button>;
```

**Good - Use design system**
```html
html:
  <button class="btn-primary">Click</button>;
```

**Generated CSS:**
- Bad: 200+ extra bytes
- Good: 0 bytes (already in base.css)

### 4. Optimize Python Logic

**Bad - Inefficient loops**
```python
py-logic:
  def getUsers():
    users = []
    for id in range(1000):
      user = database.query(f"SELECT * FROM users WHERE id = {id}")
      users.append(user)
    return users
```

**Good - Batch query**
```python
py-logic:
  def getUsers():
    query = DataSet.all('users').limit(1000).toSQL()
    return database.query(query.query, *query.params)
```

**Performance:**
- Bad: 1000 queries, 2+ seconds
- Good: 1 query, 10ms

### 5. Minimize Data Transfer

**Bad - Large nested objects**
```python
py-logic:
  def getUserProfile():
    user = {
      'id': 1,
      'name': 'John',
      'email': 'john@example.com',
      'profile': {
        'bio': 'Bio here',
        'avatar': 'http://...',
        'preferences': {...}
      },
      'history': [...100 items...],
      'metadata': {...}
    }
    return user
```

**Good - Selective fields**
```python
py-logic:
  def getUserProfile():
    # Only send needed data
    query = DataSet.all('users').where({'id': 1}).toSQL()
    user = database.query(query.query, *query.params)[0]
    return {
      'id': user.id,
      'name': user.name,
      'email': user.email
    }
```

**Response size:**
- Bad: 50KB
- Good: 200 bytes

---

## Route Optimization / Optimisation des routes

### 1. Use Appropriate HTTP Methods

```uni
routes:
  # ✓ Correct
  GET /users { return py:getUsers; }      # Retrieve data
  POST /users { return py:createUser; }   # Create data
  PUT /users/:id { return py:updateUser; }   # Update data
  DELETE /users/:id { return py:deleteUser; } # Delete data
  
  # ✗ Wrong
  GET /create { return py:createUser; }   # Should be POST
  GET /delete/:id { return py:deleteUser; } # Should be DELETE
```

### 2. Implement Pagination

**Bad - Return all records**
```python
py-logic:
  def getAllUsers():
    return DataSet.all('users').toSQL()
```

**Good - Paginated response**
```python
py-logic:
  def getUsers(page):
    pageSize = 20
    offset = (page - 1) * pageSize
    query = DataSet.all('users').limit(pageSize).offset(offset).toSQL()
    return database.query(query.query, *query.params)
```

**Benefits:**
- Smaller responses (20 vs 10000 items)
- Faster database queries
- Better user experience

### 3. Add Status Codes

```ini
routes:
  # ✓ Good - explicit status
  POST /users {
    status 201;
    return py:createUser;
  }
  
  # Less clear - defaults to 200
  POST /users {
    return py:createUser;
  }
```

### 4. Cache Frequently Accessed Data

```python
py-logic:
  _cache = {}
  
  def getConfig():
    if 'config' not in _cache:
      query = DataSet.all('config').toSQL()
      _cache['config'] = database.query(query.query, *query.params)
    return _cache['config']
```

---

## Client-Side Optimization / Optimisation côté client

### 1. Lazy Load Heavy Scripts

**Bad - Load everything on page load**
```javascript
js-events:
  document.getElementById('chart').addEventListener('click', () => {
    // This loads Chart.js library
    const chart = new Chart(...);
  });
```

**Good - Load on demand**
```javascript
js-events:
  document.getElementById('chart').addEventListener('click', async () => {
    const Chart = (await import('chart.js')).default;
    const chart = new Chart(...);
  });
```

### 2. Debounce Event Handlers

**Bad - Triggers on every keystroke**
```javascript
js-events:
  document.getElementById('search').addEventListener('input', (e) => {
    fetch('/api/search?q=' + e.target.value)
      .then(r => r.json())
      .then(results => render(results));
  });
```

**Good - Wait 300ms after typing stops**
```javascript
js-events:
  let timeout;
  document.getElementById('search').addEventListener('input', (e) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      fetch('/api/search?q=' + e.target.value)
        .then(r => r.json())
        .then(results => render(results));
    }, 300);
  });
```

### 3. Use Event Delegation

**Bad - Multiple listeners**
```javascript
js-events:
  document.querySelectorAll('.button').forEach(btn => {
    btn.addEventListener('click', handleClick);
  });
```

**Good - Single listener**
```javascript
js-events:
  document.addEventListener('click', (e) => {
    if (e.target.matches('.button')) {
      handleClick(e);
    }
  });
```

---

## Caching Strategy / Stratégie de cache

### HTTP Caching

**Add to generated HTML:**
```html
<!-- Cache static assets for 1 year -->
<link rel="stylesheet" href="/assets/base.css">
<!-- Cache app for 1 hour -->
<script src="/app.js"></script>
```

**Configure in server (after generation):**
```typescript
// In generated/app.server.ts
app.use(express.static('dist', {
  maxAge: '1h',      // app.js cached for 1 hour
  etag: true,
  lastModified: true
}));

app.use('/assets', express.static('dist/assets', {
  maxAge: '365d'    // Static assets cached 1 year
}));
```

### Database Query Caching

```python
_query_cache = {}
_cache_ttl = {}

def cachedQuery(key, sql, ttl=60):
  import time
  now = time.time()
  
  if key in _query_cache:
    if now - _cache_ttl.get(key, 0) < ttl:
      return _query_cache[key]
  
  result = database.query(sql)
  _query_cache[key] = result
  _cache_ttl[key] = now
  return result

def getUsers():
  # Cache for 60 seconds
  return cachedQuery('all_users', 
    DataSet.all('users').toSQL(), 
    ttl=60
  )
```

---

## Bundle Optimization / Optimisation du bundle

### Monitor Bundle Size

```bash
npm run build

# Check sizes
du -h dist/app.js dist/server.cjs

# Expected:
# dist/app.js     ~30KB (gzipped: ~10KB)
# dist/server.cjs ~80KB (not gzipped, stays on server)
```

### Production Build

```bash
# Set production environment
NODE_ENV=production npm run build

# This automatically:
# - Minifies code
# - Removes debug statements
# - Optimizes module imports
# - Reduces bundle size
```

### Check Dependencies

```bash
# List top-level dependencies
npm list --depth=0

# Expected:
# express@4.21.2
# typescript@5.7.0
# esbuild@0.24.0

# For production, install only dependencies:
npm install --omit=dev
```

---

## Performance Benchmarking / Benchmarking de performance

### Measure Build Time

```bash
# Full build time
time npm run build

# Expected: 2-5 seconds
# If slower, check for large files or many imports
```

### Measure Server Startup

```bash
# Startup time
time npm run dev &

# Expected: < 2 seconds to listen

# Check logs for slow operations
DEBUG=unistack:* npm run dev
```

### Measure Response Time

```bash
# Use curl to test
time curl http://localhost:3000/api/users

# Expected: < 100ms for simple routes

# For complex routes with database:
# Expected: < 500ms
```

### Load Testing

```bash
# Install Apache Bench
# macOS: brew install httpd

# Test with 100 requests, 10 concurrent
ab -n 100 -c 10 http://localhost:3000/api/users

# Results to analyze:
# Requests per second (higher is better)
# Response time (lower is better)
# Failed requests (should be 0)
```

---

## Code Generation Best Practices / Bonnes pratiques

### 1. Semantic HTML

```ini
# ✓ Good - use semantic tags
html:
  <header>
    <h1>Title</h1>
  </header>
  <main>
    <article>Content</article>
  </main>
  <footer>Copyright</footer>;

# ✗ Poor - generic divs
html:
  <div class="header">
    <div class="title">Title</div>
  </div>;
```

### 2. Accessible Components

```html
# ✗ Bad - no labels
<input type="email" />
<button>Send</button>

# ✓ Good - proper labels
<label for="email">Email:</label>
<input id="email" type="email" />
<button aria-label="Send email">Send</button>
```

### 3. Performance-First

```python
# ✗ Slow - N+1 queries
py-logic:
  def getPostsWithAuthors():
    posts = DataSet.all('posts').toSQL()
    for post in posts:
      author = DataSet.all('users').where({'id': post.author_id}).toSQL()
      post['author'] = author

# ✓ Fast - single query with join
py-logic:
  def getPostsWithAuthors():
    query = """
      SELECT p.*, u.name as author_name 
      FROM posts p 
      LEFT JOIN users u ON p.author_id = u.id
    """
    return database.query(query)
```

### 4. Security First

```python
# ✗ SQL Injection risk
def search(query):
  return database.query(f"SELECT * FROM posts WHERE title LIKE '{query}'")

# ✓ Safe with parameterized queries
def search(query):
  sql = DataSet.all('posts').where({'title': query}).toSQL()
  return database.query(sql.query, *sql.params)
```

---

## Profiling Generated Code / Profilage du code généré

### CPU Profiling

```bash
# Node.js profiling
node --prof dist/server.cjs

# Analyze after 30 seconds, then:
node --prof-process isolate-*.log > profile.txt
cat profile.txt
```

### Memory Profiling

```bash
# Monitor memory usage
node --max-old-space-size=512 dist/server.cjs

# Check for leaks
npm install --save-dev clinic
clinic doctor -- npm run dev

# Open results:
# clinic shows memory, CPU, and event loop issues
```

### Using Chrome DevTools

```bash
# Start with inspector
node --inspect dist/server.cjs

# Then visit: chrome://inspect

# Profile in Real-Time
# - CPU Profiler: See function execution time
# - Memory: Check for leaks
# - Network: See request waterfall
```

---

## TypeScript Generation Details / Détails de la génération TypeScript

### Type Safety in Generated Code

The transpiler generates TypeScript with:
- Type annotations for function parameters
- Return type inference
- Interface definitions

```typescript
// Generated with types:
interface UniRuntime {
  callPy(name: string, ...args: any[]): Promise<any>;
  sql(query: string): Promise<any[]>;
}

export function createServer(runtime: UniRuntime): express.Application {
  // Type-safe implementation
}
```

### ESM vs CommonJS

**Generated client: ESM (browser)**
```typescript
export function bootstrap() { ... }

// Imported as:
import { bootstrap } from './app.js';
```

**Generated server: ESM internally, wrapped in CJS**
```javascript
// generated/app.server.ts uses ESM
// but dist/server.cjs exports CommonJS

module.exports = createServer;
```

---

## Continuous Optimization / Optimisation continue

### Monitor Performance

```bash
# Set up performance logging
npm run dev 2>&1 | grep -i "time\|ms\|slow"

# Look for:
# - Slow route handlers (> 100ms)
# - Database queries (> 50ms)
# - Memory growth
```

### Automated Testing

```bash
# Add to your CI/CD (GitHub Actions):
npm run build  # Must succeed
npm run test   # Must pass
npm audit      # Check vulnerabilities
```

### Documentation

```bash
# Generate API docs from routes
grep "routes:" src/app.uni | grep "GET\|POST"

# List all endpoints:
grep -E "^\s+(GET|POST|PUT|DELETE)" src/app.uni
```

---

## Common Bottlenecks / Goulots d'étranglement courants

| Issue | Symptom | Fix |
|-------|---------|-----|
| N+1 queries | Slow routes, many DB calls | Use single query or batch |
| Unoptimized regex | High CPU usage | Use `string.includes()` instead |
| Large payloads | Slow JSON parsing | Send only needed fields |
| Missing pagination | Out of memory errors | Add `limit()` and `offset()` |
| Synchronous operations | Blocking event loop | Use async/await |
| No caching | Redundant database queries | Implement query cache |
| Uncompressed assets | Large downloads | Enable gzip compression |

---

## See Also

- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) – CSS optimization
- [DATA_ABSTRACTION.md](DATA_ABSTRACTION.md) – Query optimization
- [WASM_GUIDE.md](WASM_GUIDE.md) – Native performance
- [DEBUG_GUIDE.md](DEBUG_GUIDE.md) – Debugging

---

**Last updated:** February 2026
