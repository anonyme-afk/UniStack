<p align="center">
  <img src="assets/unistack-logo.png" width="200" alt="UniStack Logo" />
</p>

# Documentation Index / Index de la documentation

**english:** complete guide to UniStack documentation.

**french:** guide complet de la documentation UniStack.

---

## Quick Navigation / Navigation rapide

### Getting Started / Démarrage
1. **[README.md](README.md)** – Project overview and quick start
2. **[INSTALL.md](INSTALL.md)** – Complete installation steps
3. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** – Syntax cheat sheet
4. **[assets/brand/BRAND_GUIDELINES.md](assets/brand/BRAND_GUIDELINES.md)** – Brand kit and logo usage

### Using UniStack / Utiliser UniStack
5. **[GUIDE_COMPLET.md](GUIDE_COMPLET.md)** – Comprehensive 1400+ line tutorial
6. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** – Built-in CSS design system and styling
7. **[DATA_ABSTRACTION.md](DATA_ABSTRACTION.md)** – SQL abstraction layer (DataSet ORM)
8. **[WASM_GUIDE.md](WASM_GUIDE.md)** – WebAssembly performance optimization
9. **[ARCHITECTURE.md](ARCHITECTURE.md)** – System design and diagrams

### Development / Développement
10. **[TESTING.md](TESTING.md)** – How to test your changes
11. **[DEBUG_GUIDE.md](DEBUG_GUIDE.md)** – Comprehensive debugging guide
12. **[OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md)** – Code generation and performance
13. **[BEST_PRACTICES.md](BEST_PRACTICES.md)** – Coding standards and patterns
14. **[PHASE_2_UPGRADE.md](PHASE_2_UPGRADE.md)** – Advanced features and Phase 2 upgrades
15. **[CONTRIBUTING.md](CONTRIBUTING.md)** – How to contribute
16. **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)** – Common issues and fixes

### Project Information / Informations du projet
13. **[CHANGELOG.md](CHANGELOG.md)** – Version history and roadmap
14. **[PROJECT_SUMMARY.md](PROJECT_SUMMARY.md)** – Project structure overview
15. **[SECURITY.md](SECURITY.md)** – Security policy

---

## Documentation by Use Case / Documentation par cas d'utilisation

### I want to...

**...get started quickly**
→ [INSTALL.md](INSTALL.md) + [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**...learn the full language**
→ [GUIDE_COMPLET.md](GUIDE_COMPLET.md)

**...style my app beautifully**
→ [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

**...build database queries safely**
→ [DATA_ABSTRACTION.md](DATA_ABSTRACTION.md)

**...optimize performance with WebAssembly**
→ [WASM_GUIDE.md](WASM_GUIDE.md)

**...write better code**
→ [BEST_PRACTICES.md](BEST_PRACTICES.md)

**...optimize generated code**
→ [OPTIMIZATION_GUIDE.md](OPTIMIZATION_GUIDE.md)

**...debug issues**
→ [DEBUG_GUIDE.md](DEBUG_GUIDE.md)

**...use advanced language features**
→ [PHASE_2_UPGRADE.md](PHASE_2_UPGRADE.md) (async, generics, decorators, LSP)

**...monitor performance in production**
→ [PHASE_2_UPGRADE.md](PHASE_2_UPGRADE.md#5-performance-monitoring-system)

**...use the language server for IDE support**
→ [PHASE_2_UPGRADE.md](PHASE_2_UPGRADE.md#3-language-server-protocol-lsp)

**...contribute code**
→ [CONTRIBUTING.md](CONTRIBUTING.md)

**...run tests**
→ [TESTING.md](TESTING.md)

**...fix a problem**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

**...see what's coming**
→ [CHANGELOG.md](CHANGELOG.md)

**...check security**
→ [SECURITY.md](SECURITY.md)

---

## File Structure / Structure des fichiers

```
Documentation Files / Fichiers de documentation:
├── README.md              ← Start here!
├── INSTALL.md             ← Installation guide
├── QUICK_REFERENCE.md     ← Syntax cheat sheet
├── GUIDE_COMPLET.md       ← Comprehensive tutorial
├── DESIGN_SYSTEM.md       ← Beautiful CSS styling system
├── DATA_ABSTRACTION.md    ← SQL query builder (ORM-like)
├── WASM_GUIDE.md         ← WebAssembly optimization
├── DEBUG_GUIDE.md        ← Debugging techniques
├── OPTIMIZATION_GUIDE.md  ← Code generation optimization
├── BEST_PRACTICES.md     ← Coding standards and patterns
├── ARCHITECTURE.md        ← System design
├── TESTING.md            ← Testing guide
├── CONTRIBUTING.md        ← Contribution guidelines
├── TROUBLESHOOTING.md     ← FAQ & fixes
├── CHANGELOG.md           ← Version history
├── PROJECT_SUMMARY.md     ← Project overview
├── SECURITY.md           ← Security policy
└── INDEX.md              ← This file

Configuration Files / Fichiers de configuration:
├── package.json
├── tsconfig.json
├── unistack.config.json
├── .env.example
├── .editorconfig
└── .gitignore

Build & Runtime / Build et runtime:
├── Makefile
├── Dockerfile
├── .github/workflows/ci.yml
├── clean.js
├── verify.js
├── status.js
└── test_generation.js

Source Code / Code source:
└── src/
    ├── cli.ts
    ├── parser/uniParser.ts
    ├── transpiler/index.ts
    ├── runtime/
    │   ├── server.ts
    │   ├── client.ts
    │   ├── data.ts              ← SQL abstraction (ORM)
    │   └── wasm.ts              ← WebAssembly support
    ├── assets/
    │   └── base.css             ← Design system
    ├── lang/ast.ts
    ├── tests/parser.test.ts
    └── app.uni

Generated Output / Sortie générée:
├── dist/                  ← After npm run build
│   └── assets/
│       └── base.css       ← Copied design system
└── generated/             ← After npm run build
    ├── app.server.ts
    ├── app.client.ts
    ├── index.html
    ├── app.py
    └── assets/
        └── base.css       ← Design system auto-injected
```

---

## Reading Order / Ordre de lecture recommandé

### For first-time users / Pour les nouveaux utilisateurs:
1. README.md (5 min)
2. INSTALL.md (10 min)
3. QUICK_REFERENCE.md (15 min)
4. GUIDE_COMPLET.md sections 1-4 (30 min)

### For developers / Pour les développeurs:
1. CONTRIBUTING.md
2. TESTING.md
3. ARCHITECTURE.md
4. GUIDE_COMPLET.md section 7

### For maintainers / Pour les mainteneurs:
1. PROJECT_SUMMARY.md
2. CHANGELOG.md
3. SECURITY.md
4. TROUBLESHOOTING.md

---

## Quick Commands / Commandes rapides

```bash
# Setup
npm install          # Install dependencies
npm run verify       # Verify installation

# Development
npm run build        # Compile TypeScript
npm run test         # Run tests
npm run dev          # Start dev server

# Cleanup
npm run clean        # Remove dist/ and generated/

# Docker
docker build -t unistack:latest .
docker run -p 3000:3000 unistack:latest
```

---

## Language Versions / Versions de langue

All documentation is available in:
- **English** – with clear examples
- **Français** – with French examples

Each major section alternates between EN and FR.

---

## FAQ Quick Links / Liens FAQ rapides

**Q: How do I create a new UniStack app?**
→ [INSTALL.md - Next Steps](INSTALL.md#next-steps--prochaines-étapes)

**Q: What syntax does UniStack use?**
→ [QUICK_REFERENCE.md](QUICK_REFERENCE.md)

**Q: How do routes work?**
→ [GUIDE_COMPLET.md - Routes](GUIDE_COMPLET.md#routes)

**Q: Can I use Python/C++/SQL?**
→ [GUIDE_COMPLET.md - FAQ](GUIDE_COMPLET.md#faq)

**Q: How do I deploy?**
→ [GUIDE_COMPLET.md - FAQ](GUIDE_COMPLET.md#faq)

**Q: Something broke, help!**
→ [TROUBLESHOOTING.md](TROUBLESHOOTING.md)

---

## Document Maintenance / Maintenance des documents

- All docs updated with each release
- Version in CHANGELOG.md
- Last updated: 2024 MVP Release

---

**Happy reading! / Bonne lecture!**
