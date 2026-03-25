# Changelog / Historique des Modifications

**All notable changes to UniStack are documented in this file.**

**Tous les changements notables dans UniStack sont documentés dans ce fichier.**

---

## [0.1.0] - MVP Release / 2024

**english:**

### Added
- Core UniStack DSL parser for `.uni` files
- Six primary sections: config, html-ui, css, py-logic, js-events, routes
- Full transpilation pipeline: AST → IR → TypeScript code generation
- CLI with three commands: `init`, `build`, `dev`
- HTTP routing with GET/POST support (inline and multiline syntax)
- Basic runtime for Node.js (BasicRuntime class)
- Server-side Python execution framework (registration-based)
- Client-side utilities: fetchJson, attachDomReady
- Express.js HTTP server integration
- esbuild bundling for production
- Comprehensive 1068-line user guide (GUIDE_COMPLET.md)
- 8 common bug troubleshooting entries with solutions
- 10 FAQ entries covering key design questions
- Full bilingual support (English/French) throughout codebase
- Proper project infrastructure (.gitignore, LICENSE, package.json)
- 3 core test cases validating parser, transpilation, and build pipeline
- Project licensed under Apache 2.0; added license headers to source files

### Fixed
- Parser indentation handling: sections can now have leading whitespace
- Inline route parsing: routes like `GET /foo { ... }` now fully supported
- TypeScript type safety: made `startServer` generic for runtime flexibility
- Section delimiter regex: improved to handle all section types robustly

### Known Limitations
- Python functions must be manually registered (no auto-discovery yet)
- SQL queries return empty array placeholder (stub for Phase 2)
- No hot-reload development server yet
- No IDE/VSCode plugin support
- No C++/Wasm compilation
- No database ORM integration

### Future (Phase 2+)
- Real Python execution (subprocess or Python API)
- C++ and WebAssembly compilation
- SQL database integration and ORM
- Hot-reload development experience
- Debugging and profiling tools
- Language Server Protocol (LSP) support
- IDE plugins (VSCode, JetBrains)
- Package/module system for code reuse
- Cloud deployment helpers

---

**french:**

### Ajouté
- Parser DSL UniStack pour les fichiers `.uni`
- Six sections principales : config, html-ui, css, py-logic, js-events, routes
- Pipeline de transpilation complet : AST → IR → Génération de code TypeScript
- CLI avec trois commandes : `init`, `build`, `dev`
- Routage HTTP avec support GET/POST (syntaxe inline et multiligne)
- Runtime basique pour Node.js (classe BasicRuntime)
- Framework d'exécution Python côté serveur (basé sur l'enregistrement)
- Utilitaires côté client : fetchJson, attachDomReady
- Intégration du serveur Express.js
- Bundling esbuild pour la production
- Guide utilisateur complet de 1068 lignes (GUIDE_COMPLET.md)
- 8 entrées de dépannage de bugs courants avec solutions
- 10 entrées FAQ couvrant les questions clés de conception
- Support bilingue complet (Anglais/Français) dans tout le code
- Infrastructure de projet appropriée (.gitignore, LICENSE, package.json)
- 3 cas de test principaux validant parser, transpilation et build pipeline

### Corrigé
- Gestion de l'indentation du parser : les sections peuvent maintenant avoir des espaces de début
- Analyse des routes inline : les routes comme `GET /foo { ... }` sont maintenant entièrement supportées
- Sécurité des types TypeScript : rendu `startServer` générique pour la flexibilité du runtime
- Regex du délimiteur de section : amélioré pour gérer tous les types de section de manière robuste

### Limitations Connues
- Les fonctions Python doivent être enregistrées manuellement (pas de découverte automatique encore)
- Les requêtes SQL retournent un tableau vide placeholder (stub pour Phase 2)
- Pas encore de serveur de développement avec hot-reload
- Pas encore de support du plugin IDE/VSCode
- Pas de compilations C++/Wasm
- Pas d'intégration ORM de base de données

### Futur (Phase 2+)
- Exécution Python réelle (subprocess ou API Python)
- Compilation C++ et WebAssembly
- Intégration de base de données SQL et ORM
- Expérience de développement avec hot-reload
- Outils de débogage et de profilage
- Support du protocole Language Server (LSP)
- Plugins IDE (VSCode, JetBrains)
- Système de packages/modules pour réutiliser le code
- Outils d'aide au déploiement cloud

---

## Version Format / Format de Version

All releases follow Semantic Versioning (MAJOR.MINOR.PATCH)

Toutes les versions suivent Semantic Versioning (MAJOR.MINOR.PATCH)

- **MAJOR:** Breaking changes / Changements cassants
- **MINOR:** New features / Nouvelles fonctionnalités
- **PATCH:** Bug fixes / Corrections de bugs

---

## How to Release / Comment Faire une Nouvelle Version

**english:**
1. Update version in package.json
2. Document changes in this file
3. Commit and tag: `git tag v0.1.0`
4. Push: `git push origin --tags`

**french:**
1. Mettre à jour la version dans package.json
2. Documenter les changements dans ce fichier
3. Valider et tagger : `git tag v0.1.0`
4. Pousser : `git push origin --tags`

---

**Last Updated:** 2024 | **Dernière mise à jour:** 2024
