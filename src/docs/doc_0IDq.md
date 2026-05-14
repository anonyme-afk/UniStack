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

# Best Practices / Bonnes pratiques

**english:** coding standards and best practices for UniStack.

**french:** normes de codage et bonnes pratiques pour UniStack.

---

## File Structure / Structure des fichiers

### Good Project Layout

```
myapp/
├── src/
│   ├── app.uni           # Main application file
│   ├── models/
│   │   ├── user.uni      # User model
│   │   └── post.uni      # Post model
│   ├── handlers/
│   │   ├── auth.uni      # Authentication
│   │   └── api.uni       # API routes
│   └── shared/
│       └── constants.uni # Shared constants
├── dist/                 # Generated output (don't edit)
├── generated/            # Intermediate files (don't edit)
├── unistack.config.json
└── package.json
```

### Entry Point

```uni
# src/app.uni - main entry point

unistack app "MyApp" version 1.0 {
  imports: 
    "src/models/user.uni",
    "src/handlers/api.uni";
  
  config:
    port=3000,
    db="sqlite:data.db";
  
  # rest of app
}
```

---

## Naming Conventions / Conventions de nommage

### Functions

```python
# [Check] Good - clear, descriptive
def getUserById(userId):
  pass

def createNewPost(title, content):
  pass

def validateEmailFormat(email):
  pass

# [X Mark] Poor - vague or unclear
def getUser():
  pass

def process():
  pass

def do_something():
  pass
```

### Variables

```python
# [Check] Good - clear intent
activeUsers = []
totalPrice = 0
isValid = False

# [X Mark] Poor
users = []         # "active" implicit
price = 0          # which total?
valid = False      # confusing type
```

### Routes

```ini
routes:
  # [Check] Good - RESTful, clear action
  GET /api/users           # Get all users
  GET /api/users/:id       # Get one user
  POST /api/users          # Create user
  PUT /api/users/:id       # Update user
  DELETE /api/users/:id    # Delete user
  
  # [X Mark] Poor - vague
  GET /users/get
  GET /user/info/:id
  POST /user/new
  GET /modify/:id
```

### HTML Classes

<br>
```html
# [Check] Good - uses design system
<div class="container">
  <button class="btn-primary">Submit</button>
  <div class="card">
    <h2 class="text-lg">Title</h2>
  </div>
</div>

# [X Mark] Poor - custom utility classes
<div class="mx-auto w-full max-w-6xl">
  <button class="bg-blue px-4 py-2 rounded">Submit</button>
  <div class="bg-white p-4 shadow">Title</div>
</div>
```

---

## Code Organization / Organisation du code

### Section Order

```uni
unistack app "MyApp" version 1.0 {
  # 1. Configuration (first)
  config:
    port=3000;
  
  # 2. Imports (second)
  imports:
    "src/helpers.uni";
  
  # 3. HTML (third)
  html:
    <div>...</div>;
  
  # 4. Styles (fourth)
  style:
    .container { ... }
  
  # 5. Python logic (fifth)
  py-logic:
    def getData():
      return ...
  
  # 6. JavaScript events (sixth)
  js-events:
    document.addEventListener(...);
  
  # 7. Routes (last)
  routes:
    GET /api/data { return py:getData; }
}
```

### Function Organization

```python
py-logic:
  # Database queries first
  def getUser(id):
    return DataSet.all('users').where({'id': id}).toSQL()
  
  def createUser(name, email):
    return DataSet.create('users', {'name': name, 'email': email})
  
  # Helper functions after
  def validateEmail(email):
    return '@' in email
  
  def formatName(name):
    return name.strip().title()
```

---

## Comments & Documentation / Commentaires et documentation

### Clear Comments

```python
# [Check] Good
py-logic:
  # Get user by ID from database
  def getUserById(id):
    """
    Retrieve a single user from the database.
    Args:
      id: The user's unique identifier
    Returns:
      dict: User data (name, email, created_at)
    """
    return DataSet.all('users').where({'id': id}).toSQL()

# [X Mark] Poor
py-logic:
  # Get stuff
  def u(i):
    return DataSet.all('users').where({'id': i}).toSQL()
```

### HTML Comments

```html
html:
  <!-- [Check] Good comment -->
  <section class="hero">
    <h1>Welcome</h1>
  </section>
  
  <!-- [Check] Explain complex structure -->
  <!-- Navigation: sticky header with auth user dropdown -->
  <nav class="navbar sticky-top">
    ...
  </nav>

  <!-- [X Mark] Obvious comments (don't add) -->
  <!-- This is a div -->
  <div class="container">
```

---

## Error Handling / Gestion d'erreurs

### Validate Input

```python
# [Check] Good - validate before using
py-logic:
  def createPost(title, content):
    if not title or len(title) < 3:
      return {'error': 'Title must be at least 3 chars'}
    if not content or len(content) < 10:
      return {'error': 'Content must be at least 10 chars'}
    
    return DataSet.create('posts', {
      'title': title,
      'content': content
    })

# [X Mark] Poor - assume data is valid
py-logic:
  def createPost(title, content):
    return DataSet.create('posts', {
      'title': title,
      'content': content
    })
```

### Handle Errors Gracefully

```python
# [Check] Good
routes:
  POST /api/users {
    status 200;
    return py:createUser;
  }

py-logic:
  def createUser(email, name):
    try:
      if not email or '@' not in email:
        return {'error': 'Invalid email', 'code': 400}
      
      existing = DataSet.all('users').where({'email': email}).toSQL()
      if existing:
        return {'error': 'Email already exists', 'code': 409}
      
      return DataSet.create('users', {'email': email, 'name': name})
    except Exception as e:
      return {'error': 'Server error', 'code': 500}

# [X Mark] Poor - crashes on bad input
py-logic:
  def createUser(email, name):
    return DataSet.create('users', {'email': email, 'name': name})
```

---

## Performance Best Practices / Bonnes pratiques de performance

### Use Pagination

```python
# [Check] Good
py-logic:
  def getUsers(page: 1, limit: 20):
    offset = (page - 1) * limit
    return DataSet.all('users').limit(limit).offset(offset).toSQL()

routes:
  GET /api/users { return py:getUsers; }

# [X Mark] Poor - returns all records
py-logic:
  def getUsers():
    return DataSet.all('users').toSQL()
```

### Optimize Queries

```python
# [Check] Good - single query
py-logic:
  def getPostsWithAuthors():
    # Efficient single query (Phase 2: with joins)
    return DataSet.all('posts').toSQL()

# [X Mark] Poor - N+1 queries
py-logic:
  def getPostsWithAuthors():
    posts = DataSet.all('posts').toSQL()
    for post in posts:
      author = DataSet.all('users').where({'id': post.author_id}).toSQL()
      post['author'] = author
    return posts
```

### Cache Results

```python
# [Check] Good - cache frequently accessed data
_config_cache = None

py-logic:
  def getConfig():
    global _config_cache
    if not _config_cache:
      _config_cache = DataSet.all('config').toSQL()
    return _config_cache

# [X Mark] Poor - query every time
py-logic:
  def getConfig():
    return DataSet.all('config').toSQL()
```

---

## Security Best Practices / Bonnes pratiques de sécurité

### Always Parameterize Queries

```python
# [Check] Safe - uses DataSet
py-logic:
  def searchUsers(query):
    return DataSet.all('users').where({'name': query}).toSQL()

# [X Mark] Vulnerable - SQL injection risk
py-logic:
  def searchUsers(query):
    return f"SELECT * FROM users WHERE name LIKE '{query}'"
```

### Validate & Sanitize Input

```python
# [Check] Good
py-logic:
  def updateUser(id, email):
    # Validate ID is number
    if not str(id).isdigit():
      return {'error': 'Invalid ID'}
    
    # Validate email format
    if '@' not in email or len(email) < 5:
      return {'error': 'Invalid email'}
    
    # Safe query
    return DataSet.update('users', {'email': email}, {'id': id})

# [X Mark] Poor
py-logic:
  def updateUser(id, email):
    return DataSet.update('users', {'email': email}, {'id': id})
```

### Trust No External Input

```python
# All user input must be validated:
# - Route parameters (:id)
# - Query parameters (?page=1)
# - Request body (POST/PUT data)
# - Headers (User-Agent, etc)

py-logic:
  def processUserData(userId, action):
    # Validate both parameters
    if not str(userId).isdigit():
      return {'error': 'Invalid user ID'}
    
    allowed_actions = ['update', 'delete', 'view']
    if action not in allowed_actions:
      return {'error': 'Invalid action'}
    
    # Now safe to use
    return {'userId': userId, 'action': action}
```

---

## HTML Best Practices / Bonnes pratiques HTML

### Use Semantic HTML

```html
# [Check] Good - semantic structure
html:
  <header>
    <h1>Site Title</h1>
    <nav>
      <a href="/">Home</a>
      <a href="/about">About</a>
    </nav>
  </header>
  
  <main>
    <article>
      <h2>Post Title</h2>
      <p>Content...</p>
    </article>
  </main>
  
  <footer>
    <p>Copyright 2026</p>
  </footer>;

# [X Mark] Poor - generic divs
html:
  <div class="header">
    <div class="title">Site Title</div>
    <div class="nav">
      <div><a href="/">Home</a></div>
    </div>
  </div>;
```

### Accessibility

```html
# [Check] Good
html:
  <label for="email">Email:</label>
  <input id="email" type="email" required />
  <button aria-label="Submit form">Submit</button>
  <img src="photo.jpg" alt="User profile picture" />;

# [X Mark] Poor
html:
  <input type="email" />
  <button>Submit</button>
  <img src="photo.jpg" />;
```

### Use Design System Classes

```html
# [Check] Good
html:
  <div class="container">
    <button class="btn-primary">Click</button>
    <div class="card">
      <h2>Title</h2>
      <p>Description</p>
    </div>
  </div>;

# [X Mark] Poor - custom styling
html:
  <div style="max-width: 1200px; margin: 0 auto;">
    <button style="background: blue; padding: 10px;">Click</button>
    <div style="border: 1px solid #ddd; padding: 20px;">
```

---

## CSS Best Practices / Bonnes pratiques CSS

### Use CSS Variables

```css
# [Check] Good - uses design system vars
style:
  .custom-button { color: var(--primary); }
  .error { color: var(--danger); }

# [X Mark] Poor - hardcoded colors
style:
  .custom-button { color: #20b7e8; }
  .error { color: #f00; }
```

### Avoid !important

```css
# [Check] Good - proper specificity
style:
  .container .btn-primary { 
    background: var(--primary); 
  }

# [X Mark] Poor
style:
  .btn-primary { 
    background: blue !important; 
  }
```

### Keep CSS Minimal

```css
# [Check] Good - uses design system defaults
style:
  .featured { 
    border: 2px solid var(--primary); 
  }

# [X Mark] Poor - duplicates design system
style:
  button { 
    padding: 10px 20px;
    border: none;
    border-radius: 8px;
    background: var(--primary);
  }
```

---

## JavaScript Best Practices / Bonnes pratiques JavaScript

### Event Handling

```javascript
# [Check] Good - clean, descriptive
js-events:
  document.getElementById('submit-btn').addEventListener('click', (e) => {
    e.preventDefault();
    const email = document.getElementById('email').value;
    if (validateEmail(email)) {
      submitForm(email);
    }
  });

# [X Mark] Poor - inline handlers
html:
  <button onclick="submitForm(this.value)">Submit</button>
```

### Async Operations

```javascript
# [Check] Good - uses async/await
js-events:
  document.getElementById('search').addEventListener('input', async (e) => {
    const results = await fetch(`/api/search?q=${e.target.value}`)
      .then(r => r.json());
    displayResults(results);
  });

# [X Mark] Poor - callback hell
js-events:
  document.getElementById('search').addEventListener('input', (e) => {
    fetch(`/api/search?q=${e.target.value}`, (err, res) => {
      res.json((err, data) => {
        if (err) console.error(err);
        displayResults(data);
      });
    });
  });
```

---

## Python Best Practices / Bonnes pratiques Python

### Clear Function Names

```python
# [Check] Good
py-logic:
  def getUserEmailByUserId(userId):
    pass
  
  def validateEmailFormat(email):
    pass
  
  def calculateOrderTotal(items):
    pass

# [X Mark] Poor
py-logic:
  def get(id):
    pass
  
  def validate(v):
    pass
  
  def calc(i):
    pass
```

### Use Type-Like Comments

```python
# [Check] Good - describes types
py-logic:
  def getUserData(userId):  # userId: int -> dict
    """Get user data by ID"""
    return DataSet.all('users').where({'id': userId}).toSQL()

# [X Mark] Poor - unclear types
py-logic:
  def getUserData(userId):
    return DataSet.all('users').where({'id': userId}).toSQL()
```

---

## Testing Best Practices / Bonnes pratiques de test

### Test Routes

Before deploying, test all routes:

```bash
# Start server
npm run dev &

# Test each route
curl http://localhost:3000/api/users
curl -X POST http://localhost:3000/api/users -d '{"name":"John"}'
curl http://localhost:3000/api/users/1
```

### Verify Output

```bash
# Check generated code
npm run build

# Inspect generated routes
grep "app.get\|app.post" generated/app.server.ts

# Verify HTML
grep "class=" generated/index.html
```

---

## Documentation Best Practices / Bonnes pratiques de documentation

### Document Public Functions

```python
py-logic:
  # [Check] Good - explains purpose and params
  def getUserById(userId):
    """
    Retrieve user data by ID from database.
    
    Args:
      userId (int): The user's unique identifier
    
    Returns:
      dict: User data or error dict
    """
    ...

  # [X Mark] Poor - no documentation
  def getUserById(userId):
    return DataSet.all('users').where({'id': userId}).toSQL()
```

### Document Complex Logic

```python
# [Check] Good - explains algorithm
py-logic:
  def calculateDiscount(price, customerAge):
    # Senior citizens (65+) get 15% discount
    if customerAge >= 65:
      return price * 0.85
    
    # Students get 10% discount
    # if hasStudentId():
    #   return price * 0.90
    
    return price
```

---

## Common Mistakes to Avoid / Erreurs courantes à éviter

| Mistake | Problem | Fix |
|---------|---------|-----|
| SQL concatenation | SQL injection | Use DataSet |
| Missing validation | Bad data | Validate all input |
| No error handling | Crashes | Return error objects |
| N+1 queries | Slow | Use single query |
| Hardcoded colors | Maintenance | Use CSS vars |
| Missing semantics | Bad accessibility | Use semantic HTML |
| Inline styles | CSS maintenance | Use utility classes |
| No pagination | Memory issues | Add limit/offset |
| Poor names | Confusion | Use clear names |
| !important | CSS conflicts | Use specificity |

---

## Quick Checklist / Liste de contrôle

Before deploying:

- [ ] All functions have clear names
- [ ] All user input validated
- [ ] No SQL concatenation (use DataSet)
- [ ] All routes tested
- [ ] Semantic HTML used
- [ ] Design system classes used
- [ ] No hardcoded colors
- [ ] Pagination for large data
- [ ] Error handling in place
- [ ] Generated code reviewed
- [ ] `npm run test` passes
- [ ] `npm run verify` passes

---

## See Also

- [GUIDE_COMPLET.md](GUIDE_COMPLET.md) – Full language tutorial
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) – Syntax reference
- [DEBUG_GUIDE.md](DEBUG_GUIDE.md) – Debugging techniques
- [OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md) – Code optimization

---

**Last updated:** February 2026
