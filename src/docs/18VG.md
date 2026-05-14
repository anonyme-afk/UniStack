# Troubleshooting Guide / Guide de dépannage

**english:** common issues and solutions for UniStack.

**french:** problèmes courants et solutions pour UniStack.

---

## Installation Issues / Problèmes d'installation

### Issue: `npm install` fails

**Cause:** Network issue or corrupted cache.

**Solution:**
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: Node.js version error

**Cause:** Using Node < 18.

**Solution:** Upgrade Node.js to 18 or later:
```bash
node --version  # Should show v18.x.x or later
```

### Issue: Missing git repository

**Cause:** Repository not initialized.

**Solution:**
```bash
git init
git add .
git commit -m "initial commit"
```

---

## Build Issues / Problèmes de build

### Issue: TypeScript compilation errors

**Cause:** Missing `typescript` dependency.

**Solution:**
```bash
npm install --save-dev typescript
npm run build
```

### Issue: `dist/` or `generated/` missing

**Cause:** Build not run yet.

**Solution:**
```bash
npm run build
```

### Issue: Module not found errors

**Cause:** Missing relative path `.js` extension (required for ESM).

**Ensure all imports include `.js` extension:**
```typescript
import { foo } from './bar.js';  // [Check] Correct
import { foo } from './bar';     // [X Mark] Wrong
```

---

## Runtime Issues / Problèmes d'exécution

### Issue: Port 3000 already in use

**Cause:** Another process is using the port.

**Solution 1:** Kill the existing process
```bash
lsof -ti :3000 | xargs kill -9  # Linux/Mac
Get-Process -Id (Get-NetTCPConnection -LocalPort 3000).OwningProcess | Stop-Process  # Windows
```

**Solution 2:** Use a different port in `.env`:
```
PORT=3001
```

### Issue: `npm run dev` hangs or crashes

**Cause:** Configuration error or missing dependencies.

**Solution:**
```bash
npm run clean
npm run build
npm run test
npm run dev
```

### Issue: Server returns 404 for all routes

**Cause:** Routes not defined or transpiler error.

**Solution:**
```bash
# Check your .uni file has a `routes:` section
cat src/app.uni

# Rebuild
npm run build

# Check generated server code
cat generated/app.server.ts

# Restart
npm run dev
```

---

## Test Issues / Problèmes de test

### Issue: Tests fail or hang

**Cause:** Broken parser or transpiler.

**Solution:**
```bash
npm run clean
npm run build
npm run test
```

If tests still fail, check `src/tests/parser.test.ts` for issues.

### Issue: `ts-node` not found

**Cause:** DevDependencies not installed.

**Solution:**
```bash
npm install --save-dev ts-node
npm run test
```

---

## Verification Issues / Problèmes de vérification

### Issue: `node verify.js` fails

**Cause:** Missing files or dependencies.

**Solution:**
```bash
npm install
npm run build
node verify.js
```

All checks should pass.

---

## Docker Issues / Problèmes Docker

### Issue: Docker build fails

**Cause:** File not found or permission issue.

**Solution:**
```bash
docker build --no-cache -t unistack:latest .
```

### Issue: Container can't reach port 3000

**Cause:** Port not exposed.

**Solution:**
```bash
docker run -p 3000:3000 unistack:latest
```

Then visit `http://localhost:3000`.

---

## File Permission Issues / Problèmes de permissions de fichier

### Issue: Pre-commit hook doesn't run

**Cause:** Hook not executable.

**Solution:**
```bash
chmod +x .git/hooks/pre-commit
```

---

## Debugging / Débogage

### Enable verbose logging

```bash
DEBUG=* npm run dev
```

### Check generated files

After build, examine:
- `generated/app.server.ts` – Express routes
- `generated/app.client.ts` – Browser code
- `generated/index.html` – HTML output

### Manual parser test

```bash
npm run build
node --input-type=module -e "
import { parseUniFile } from './dist/parser/uniParser.js';
const src = 'unistack app \"MyApp\" version 1.0 { routes: GET /test -> return py:foo; }';
console.log(JSON.stringify(parseUniFile(src, 'test.uni'), null, 2));
"
```

---

## Still Having Issues?

1. **Check GUIDE_COMPLET.md** FAQ section
2. **Check QUICK_REFERENCE.md** for syntax errors
3. **Open an issue** on GitHub
4. **Report security issues** to security@unistack.org (see SECURITY.md)

---

**Last updated:** 2024 MVP Release
