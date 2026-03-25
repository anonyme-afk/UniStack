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

# Debugging Guide / Guide de débogage

**english:** comprehensive debugging and troubleshooting for UniStack.

**french:** guide complet de débogage et dépannage pour UniStack.

---

## Quick Diagnosis / Diagnostic rapide

Run the system health check:
```bash
npm run verify   # Checks all core files
npm run status   # Shows project health
npm run test     # Verifies transpiler works
```

All three should pass ✓

---

## Installation & Setup / Installation et configuration

### Issue: `npm install` fails

**Error:** `npm ERR! code ERESOLVE` 

**Cause:** Network issue, cache corruption, version conflict

**Solution:**
```bash
# Method 1: Clean cache
npm cache clean --force
rm -rf node_modules package-lock.json
npm install

# Method 2: Use different registry
npm install --registry https://registry.npmjs.org/

# Method 3: Legacy peer deps
npm install --legacy-peer-deps
```

### Issue: Node.js version error

**Error:** `error: Node.js version must be >= 18.0.0`

**Solution:**
```bash
node --version  # Check current
node -v         # Alternative check

# Update Node.js (choose your method):
# macOS: brew install node
# Windows: choco install nodejs
# Or use nvm: nvm install 18
```

### Issue: Git not initialized

**Solution:**
```bash
git init
git add .
git commit -m "initial commit"
```

---

## Build Issues / Problèmes de compilation

### TypeScript errors

**Error:** `error TS7006: Parameter has no type annotation`

**Solution:**
```bash
# Rebuild from clean state
npm run clean
npm run build
npm run test

# Check tsconfig.json
cat tsconfig.json | grep strict
```

### Module not found

**Error:** `Cannot find module './bar'`

**Cause:** Missing `.js` extension in ESM imports

**Solution:**
```typescript
// ✓ Correct (include .js)
import { foo } from './bar.js';
import { DataSet } from '../runtime/data.js';

// ✗ Wrong (missing .js)
import { foo } from './bar';
```

### Build output missing

**Error:** `ENOENT: no such file or directory`

**Cause:** `buildUniStack` failed to generate files

**Solution:**
```bash
# Check source file
cat src/app.uni

# Run tests to verify parser
npm run test

# Rebuild
npm run build

# Verify output
ls -la generated/ dist/
```

---

## Parser & Language Issues / Problèmes de parser

### Parse error in .uni file

**Error:** `english: Parse failed at line 42`

**Cause:** Syntax error in UniStack code

**Solution:**
```bash
# Check error line
sed -n '40,45p' src/app.uni

# Common issues:
# 1. Missing closing brace }
# 2. Invalid section name
# 3. Malformed route

# Verify syntax:
cat << 'EOF' > src/test.uni
unistack app "Test" version 1.0 {
  py-logic:
    def hello():
      return "ok"
  
  routes:
    GET /test { return py:hello; }
}
EOF

npm run build
```

### Unknown py binding

**Error:** `Unknown py binding in route GET /: getHome`

**Cause:** Function referenced in route doesn't exist

**Solution:**
```bash
# List defined functions
grep "^    def " src/app.uni

# Make sure function exists and matches exactly (case-sensitive)
# Add missing function if needed

# Rebuild
npm run build
```

### Route not found

**Cause:** Route defined but not in generated files

**Solution:**
```bash
# Check routes exist
grep -A3 "routes:" src/app.uni

# Check generated server
grep "app.get\|app.post" generated/app.server.ts

# Rebuild
npm run clean
npm run build
```

### HTML not generated

**Cause:** HTML section not parsing correctly

**Solution:**
```bash
# Check HTML section
grep -A5 "html:" src/app.uni

# HTML syntax should be:
cat << 'EOF'
html:
  <div class="container">
    <h1>Hello</h1>
  </div>;
EOF

npm run build
cat generated/index.html
```

---

## Runtime Issues / Problèmes d'exécution

### Port already in use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solution 1: Kill process**
```bash
# Linux/macOS:
lsof -ti :3000 | xargs kill -9

# Windows:
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process -Force
```

**Solution 2: Use different port**
```bash
PORT=3001 npm run dev

# Or add to .env:
echo "PORT=3001" > .env
npm run dev
```

### Server hangs or crashes

**Cause:** Configuration error, missing dependency, infinite loop

**Solution:**
```bash
# Rebuild cleanly
npm run clean
npm run build
npm run test

# Then run with verbose logging
DEBUG=* npm run dev

# Kill and check for loops in code
grep -E "while.*True|for.*range.*\(" src/app.uni
```

### 404 for all routes

**Cause:** Routes not defined or transpiler error

**Solution:**
```bash
# Verify routes in source
grep "routes:" src/app.uni -A10

# Check generated
grep "app.get\|app.post" generated/app.server.ts

# Test route
npm run dev &
curl http://localhost:3000/test
```

### Server crashes with TypeError

**Error:** `TypeError: Cannot read property 'sql' of undefined`

**Cause:** Runtime not initialized

**Solution:**
```bash
# Check generated server
head -30 generated/app.server.ts

# Rebuild
npm run clean
npm run build

# Log errors
npm run dev 2>&1 | tee server.log
```

### Environment variables not loading

**Cause:** `.env` file missing or wrong format

**Solution:**
```bash
# Create .env
cat > .env << 'EOF'
PORT=3000
NODE_ENV=development
DATABASE_URL=sqlite:test.db
EOF

# Verify
npm run dev
```

---

## Test Issues / Problèmes de test

### Tests fail or hang

**Cause:** Parser broken, transpiler error, infinite loop

**Solution:**
```bash
# Rebuild and test
npm run clean
npm run build
npm run test

# Check test file
cat src/tests/parser.test.ts | head -50

# Debug verbose
DEBUG=* npm run test
```

### ts-node not found

**Cause:** DevDependencies not installed

**Solution:**
```bash
npm install --save-dev ts-node
npm run test
```

### Assertion errors

**Cause:** Logic error in parser/transpiler

**Solution:**
```bash
# See which assertion failed
npm run test 2>&1 | head -100

# Fix and rebuild
npm run build
npm run test
```

---

## Generated Code Issues / Problèmes de code généré

### Missing styles (Design System)

**Cause:** base.css not copied or link wrong

**Solution:**
```bash
# Verify base.css exists
ls -la src/assets/base.css
ls -la dist/assets/base.css

# Check HTML link
grep "base.css" generated/index.html

# Rebuild
npm run build
```

### DataSet not defined

**Cause:** DataSet import missing from generated server

**Solution:**
```bash
# Check import
grep "DataSet" generated/app.server.ts

# Verify source exists
ls -la src/runtime/data.ts

# Rebuild
npm run build
```

### Python function not callable

**Error:** `Error: Unknown py binding: myFunction`

**Cause:** Function not in py-logic section

**Solution:**
```bash
# List functions
grep "^    def " src/app.uni

# Check route references
grep "return py:" src/app.uni

# Names must match exactly (case-sensitive)
npm run build
```

---

## Design System Issues / Problèmes du système de design

### Styles not applying

**Cause:** base.css not loaded, classes misspelled, path wrong

**Solution:**
```bash
# Verify file exists and copied
ls -la src/assets/base.css
ls -la dist/assets/base.css

# Check HTML link
grep "base.css" dist/index.html

# Verify class names (case-sensitive)
# ✓ <button class="btn-primary">
# ✗ <button class="btn-Primary">

npm run build
```

### CSS conflicts

**Cause:** Custom CSS overriding base.css

**Solution:**
```bash
# Check link order in HTML
grep "<style>\|<link" generated/index.html

# base.css link should come first
# Or use CSS specificity
<style>
  .btn-primary { background: #my-color !important; }
</style>
```

---

## Data Abstraction Issues / Problèmes d'abstraction données

### DataSet query wrong

**Error:** SQL query doesn't match expected

**Cause:** Incorrect method chaining or format

**Solution:**
```python
# ✓ Correct usage:
query = DataSet.all('users').where({'id': 1}).toSQL()

# ✗ Wrong format:
query = DataSet.all('users').where('id = 1').toSQL()  # Wrong

# Verify output
result = DataSet.all('users').where({'status': 'active'}).toSQL()
print(result)  # Check format
```

### SQL injection risk

**Cause:** String concatenation instead of parameterized queries

**Solution:**
```python
# ✗ Never do this:
param = "' OR '1'='1"
query = f"SELECT * FROM users WHERE id = {param}"

# ✓ Always use DataSet:
params = {'id': user_input}
query = DataSet.all('users').where(params).toSQL()
# Automatically safe
```

---

## WebAssembly Issues / Problèmes WebAssembly

### @wasm annotations

Note: Real Wasm compilation in Phase 2. Current support is annotation framework only.

**Usage:**
```python
# @wasm - Marked for Phase 2 compilation
def expensiveOperation(data):
  result = 0
  for i in range(len(data)):
    result += data[i] * 2
  return result

# Only use @wasm for functions > 100ms
```

---

## Error Reference / Référence des erreurs

| Error | Cause | Fix |
|-------|-------|-----|
| `Unknown py binding` | Function not defined | Add to py-logic |
| `Parse error` | Syntax error | Check line in .uni |
| `Cannot find module` | Missing `.js` extension | Add `.js` to import |
| `EADDRINUSE` | Port in use | Kill process or change PORT |
| `Module not found` | Dependency missing | `npm install <pkg>` |
| `No such file` | File missing | Run `npm run build` |
| `Validation failed` | AST error | Check .uni syntax |

---

## Debug Tools / Outils de débogage

### Enable debug mode
```bash
DEBUG=* npm run dev
DEBUG=unistack:* npm run build
NODE_DEBUG=module npm run dev
```

### Capture output
```bash
npm run dev > server.log 2>&1 &
tail -f server.log
```

### View generated files
```bash
# List all generated
find generated dist -type f

# See routes
cat generated/app.server.ts | grep "app\."

# Check HTML
cat generated/index.html | grep -E "<(div|section)"

# View Python
cat generated/app.py | head -50
```

### Manual parse test
```bash
node -e "
import('./dist/parser/uniParser.js').then(m => {
  const src = require('fs').readFileSync('src/app.uni', 'utf8');
  const ast = m.parseUniFile(src, 'src/app.uni');
  console.log(JSON.stringify(ast, null, 2));
}).catch(console.error);
"
```

---

## Performance Debug / Débogage de performance

### Slow build
```bash
time npm run build  # Expected: < 5 seconds

npm list --depth=0  # Check dependencies
du -sh node_modules  # Check size
```

### Slow startup
```bash
time npm run dev    # Expected: < 2 seconds to listen

# Check for blocking code
grep -r "while.*True\|sleep\|wait" src/
```

### Memory issues
```bash
node --max-old-space-size=2048 dist/cli.js build
```

---

## Windows Issues / Problèmes Windows

### Command not found: rm

**Solution:** Use `clean.js` script
```bash
node clean.js  # Cross-platform cleanup
```

### Path separators

**Solution:** Use `path` module from Node.js
```typescript
import { join, resolve } from 'path';

// ✓ Correct
const file = resolve('src', 'app.uni');

// ✗ Wrong
const file = 'src/app.uni';
```

---

## Need More Help?

1. **Run full diagnostics:**
   ```bash
   npm run verify
   npm run status
   npm run test
   ```

2. **Check documentation:**
   - [GUIDE_COMPLET.md](GUIDE_COMPLET.md) – Full language
   - [QUICK_REFERENCE.md](QUICK_REFERENCE.md) – Syntax
   - [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) – Styling

3. **Debug verbose:**
   ```bash
   DEBUG=* npm run build
   DEBUG=* npm run dev
   ```

4. **Report issue with:**
   - Full error message
   - Steps to reproduce
   - `npm run status` output
   - `npm run verify` output

---

**Last updated:** February 2026
