"""
UniStack Complete Installation & Setup Guide
"""

# Installation Guide / Guide d'installation

**english:** follow these steps to set up UniStack completely.

**french:** suivez ces étapes pour configurer UniStack complètement.

---

## Quick Start / Démarrage rapide

```bash
# 1. Clone the repository
git clone https://github.com/unistack/unistack.git
cd unistack

# 2. Install dependencies
npm install

# 3. Verify setup
node verify.js

# 4. Run tests
npm run test

# 5. Build the project
npm run build

# 6. Start dev server (listens on :3000)
npm run dev
```

---

## Full Setup Steps / Étapes complètes

### 1. Prerequisites / Prérequis

**You need:**
- Node.js 18 or higher (`node --version`)
- npm (comes with Node)
- Git (for version control)
- ~500 MB disk space (including node_modules)

**Vous avez besoin:**
- Node.js 18 ou version supérieure (`node --version`)
- npm (fourni avec Node)
- Git (pour le contrôle de version)
- ~500 Mo d'espace disque (y compris node_modules)

### 2. Clone & Install

```bash
git clone https://github.com/unistack/unistack.git
cd unistack
npm install
```

### 3. Verify Installation

```bash
node verify.js
```

**Expected output:**
```
✓ Node.js version v18.x.x
✓ File: package.json
✓ File: src/cli.ts
... (all checks pass)
✓ All checks passed! Ready to develop.
```

### 4. Run Tests

```bash
npm run test
```

**Expected (bilingual output):**
```
english: parser inline route test passed | french: test inline route du parser réussi
english: config parsing test passed | french: test parsing config réussi
english: All tests completed successfully | french: Tous les tests réussis
english: transpiler build test passed | french: test build transpileur réussi
```

### 5. Build the Project

```bash
npm run build
```

No errors should appear. Output files go to `dist/` and `generated/`.

### 6. Start Development Server

```bash
npm run dev
```

Server listens on `http://localhost:3000`.

---

## Available Commands / Commandes disponibles

```bash
npm run build        # compile TypeScript
npm run test         # run test suite
npm run dev          # start development server (port 3000)
npm install          # install dependencies
npm ci              # clean dependency install (CI)
```

Or use the **Makefile** if available:

```bash
make build
make test
make dev
make clean
```

---

## Using Docker

```bash
# Build image
docker build -t unistack:latest .

# Run container
docker run -p 3000:3000 unistack:latest
```

Then visit `http://localhost:3000`.

---

## File Structure / Structure des fichiers

```
unistack/
├── src/
│   ├── cli.ts              # Entry point
│   ├── parser/
│   ├── transpiler/
│   ├── runtime/
│   ├── lang/
│   ├── tests/
│   └── app.uni             # Example UniStack file
├── dist/                   # Built output (after build)
├── generated/              # Intermediate files (after build)
├── package.json
├── tsconfig.json
├── Makefile
├── Dockerfile
├── .env.example
├── verify.js
├── README.md
├── GUIDE_COMPLET.md
└── LICENSE
```

---

## Environment Variables / Variables d'environnement

Create a `.env` file from `.env.example`:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```
PORT=3000
NODE_ENV=development
DATABASE_URL=sqlite:memory
```

---

## Troubleshooting / Résolution des problèmes

### Issue: `npm install` fails

**Solution:** Clear cache and retry:
```bash
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Issue: TypeScript errors during build

**Solution:** Ensure TypeScript is installed:
```bash
npm install --save-dev typescript
npm run build
```

### Issue: Tests fail

**Solution:** Rebuild and retry:
```bash
npm run build
npm run test
```

### Issue: Port 3000 in use

**Solution:** Change PORT in `.env`:
```
PORT=3001
```

Then restart with `npm run dev`.

---

## Next Steps / Prochaines étapes

1. **Read the documentation:**
   - `README.md` – Project overview
   - `GUIDE_COMPLET.md` – Comprehensive tutorial
   - `QUICK_REFERENCE.md` – Syntax quick reference
   - `ARCHITECTURE.md` – System design

2. **Create your first UniStack app:**
   ```bash
   npx unistack init
   npx unistack build
   npx unistack dev
   ```

3. **Explore examples** in `src/app.uni`.

4. **Check the FAQ** in `GUIDE_COMPLET.md` for common questions.

---

## Support / Aide

- **Bugs:** Open an issue on GitHub or email `security@unistack.org`
- **Questions:** Check FAQ section in `GUIDE_COMPLET.md`
- **Contributing:** See `CONTRIBUTING.md`

---

**You are all set! Happy coding! / Vous êtes prêt! Bon développement!**
