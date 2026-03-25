# Contributing to UniStack / Contribuer à UniStack

**english:** Thank you for your interest in contributing to UniStack! This document provides guidelines and instructions for contributing.

**french:** Merci de votre intérêt pour contribuer à UniStack ! Ce document fournit des directives et des instructions pour contribuer.

---

## Code of Conduct / Code de Conduite

**english:** All contributors must adhere to standards of respectful, inclusive behavior. Harassment, discrimination, and disrespectful conduct are not tolerated.

**french:** Tous les contributeurs doivent adhérer à des normes de comportement respectueux et inclusif. Le harcèlement, la discrimination et les comportements irrespectueux ne sont pas toléré.

---

## How to Contribute / Comment Contribuer

### Reporting Bugs / Signaler des Bugs

**english:**

1. Check if the bug is already reported in [Issues](../../issues)
2. If not, open a new issue with:
   - Clear title and description
   - Steps to reproduce
   - Expected vs actual behavior
   - Your environment (OS, Node.js version, etc.)
   - Code example if applicable

**french:**

1. Vérifiez si le bug est déjà signalé dans [Issues](../../issues)
2. Si non, ouvrez un nouveau problème avec:
   - Titre et description clairs
   - Étapes pour reproduire
   - Comportement attendu vs réel
   - Votre environnement (OS, version Node.js, etc.)
   - Exemple de code si applicable

### Suggesting Features / Suggérer des Fonctionnalités

**english:**

1. Open an issue titled `[Feature Request]`
2. Describe the use case and benefits
3. Provide examples if possible
4. Discuss implementation complexity (if known)

**french:**

1. Ouvrez une issue intitulée `[Demande de Fonctionnalité]`
2. Décrivez le cas d'utilisation et les avantages
3. Fournissez des exemples si possible
4. Discutez de la complexité d'implémentation (si connue)

### Submitting Code Changes / Soumettre des Modifications de Code

**english:**

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/my-feature`
3. Make your changes, ensuring:
   - Code follows the existed style (TypeScript, bilingual comments)
   - Tests are added/updated
   - Documentation is updated
   - Bilingual (English/French) comments are maintained
4. Commit with clear messages:
   ```bash
   git commit -m "feature: add my feature (english/french comment)"
   ```
5. Push to your fork and open a Pull Request
6. Fill out the PR template completely

**french:**

1. Forkez le dépôt
2. Créez une branche de fonctionnalité : `git checkout -b feature/ma-feature`
3. Apportez vos modifications, en veillant à:
   - Le code suit le style existant (TypeScript, commentaires bilingues)
   - Les tests sont ajoutés/mis à jour
   - La documentation est mise à jour
   - Les commentaires bilingues (Anglais/Français) sont maintenus
4. Validez avec des messages clairs:
   ```bash
   git commit -m "feature: ajouter ma feature (commentaire anglais/français)"
   ```
5. Poussez vers votre fork et ouvrez une Pull Request
6. Remplissez complètement le modèle PR

---

## Development Setup / Configuration de Développement

**english:** after cloning, you can install a git pre-commit hook by
running:

```bash
chmod +x .git/hooks/pre-commit
```

The provided script will run `npm run test` before each commit.

**french:** après le clonage, vous pouvez installer un hook git pré-commit en
exécutant :

```bash
chmod +x .git/hooks/pre-commit
```

Le script fourni exécutera `npm run test` avant chaque commit.


**english:**

```bash
# Clone repository
git clone https://github.com/yourusername/unistack.git
cd unistack

# Install dependencies
npm install

# Build TypeScript
npm run build

# Run tests
npm run test

# Start dev server
npm run dev
```

**french:**

```bash
# Cloner le dépôt
git clone https://github.com/yourusername/unistack.git
cd unistack

# Installer les dépendances
npm install

# Compiler TypeScript
npm run build

# Exécuter les tests
npm run test

# Démarrer le serveur dev

Please ensure your changes build cleanly and all tests pass (`npm run test`) before submitting a pull request.

Merci de vous assurer que vos modifications compilent et que tous les tests passent (`npm run test`) avant de soumettre une pull request.
npm run dev
```

---

## Code Style / Style de Code

### TypeScript

**english:**
- Use ES2020+ syntax
- Strict mode enabled
- ESModules (import/export)
- Type all function parameters and returns
- Prefer const over let

**french:**
- Utiliser la syntaxe ES2020+
- Mode strict activé
- ESModules (import/export)
- Typer tous les paramètres et retours de fonction
- Préférer const plutôt que let

### Comments / Commentaires

**All comments must be bilingual (English | French):**

**english:** Correct format

```typescript
// english: Description in English
// french:  Description en français
function myFunction() { }
```

**french:** Format correct

```typescript
// english: Description en anglais
// french:  Description en français
function maFonction() { }
```

### Error Messages / Messages d'Erreur

**english:**
```typescript
throw new Error(
  'english: Error description in English. ' +
  'french: Description d\'erreur en français.'
);
```

**french:**
```typescript
throw new Error(
  'english: Description d\'erreur en anglais. ' +
  'french: Description d\'erreur en français.'
);
```

---

## Testing / Tests

**english:**

- Add tests for new features
- Test files go in `src/tests/`
- Run: `npm run test`
- All tests must pass before PR merge

**french:**

- Ajouter des tests pour les nouvelles fonctionnalités
- Les fichiers de test vont dans `src/tests/`
- Exécuter: `npm run test`
- Tous les tests doivent passer avant la fusion de PR

---

## Documentation / Documentation

**english:**

- Update README.md for user-facing changes
- Update GUIDE_COMPLET.md for feature documentation
- Update code comments for implementation details
- Include examples for new features
- Keep bilingual (EN/FR) throughout

**french:**

- Mettez à jour le README.md pour les changements visibles par l'utilisateur
- Mettez à jour GUIDE_COMPLET.md pour la documentation des fonctionnalités
- Mettez à jour les commentaires du code pour les détails d'implémentation
- Incluez des exemples pour les nouvelles fonctionnalités
- Gardez bilingue (EN/FR) partout

---

## Project Structure / Structure du Projet

```
src/
  cli.ts                 # CLI entry point / Point d'entrée CLI
  app.uni               # Example app / App exemple
  lang/
    ast.ts             # AST definitions / Définitions AST
    UniStack.g4        # ANTLR grammar (future) / Grammaire ANTLR (future)
  parser/
    uniParser.ts       # Manual parser / Parser manuel
  transpiler/
    index.ts           # IR generation / Génération IR
  runtime/
    server.ts         # Server runtime / Runtime serveur
    client.ts         # Client runtime / Runtime client
  tests/
    parser.test.ts   # Parser tests / Tests parser

dist/                   # Built files / Fichiers compilés
generated/             # Generated intermediate files / Fichiers intermédiaires générés
GUIDE_COMPLET.md       # User guide / Guide utilisateur
README.md              # Project overview / Aperçu du projet
```

---

## Phases & Roadmap / Phases & Roadmap

### Foundation line (legacy prototype) - Current / Actuel
- Parse JS/HTML/CSS/Python/SQL
- Basic transpilation
- Simple HTTP routing
- Text-only Python/SQL

### Advanced line
- Python execution (subprocess/API)
- C++/Wasm compilation
- SQL database integration
- Hot-reload development
- Debugging tools
- IDE/LSP support

### Elite line +
- Full language server
- Visual editor
- Package manager
- Advanced optimizations
- Cloud deployment helpers

---

## Questions / Questions ?

**english:** Open an issue or discussion for questions. We're here to help!

**french:** Ouvrez une issue ou une discussion pour les questions. Nous sommes là pour vous aider !

---

**Thank you for contributing! / Merci de contribuer !**
