# 🚀 UniStack — Guide Maître Complet
### "Zéro point négatif. Un vrai langage. Une vraie v1.0."
> Document de référence unique — tout ce qu'il faut faire, étape par étape.

---

## 🧠 LA PHILOSOPHIE CENTRALE

**UniStack ne doit pas être "juste du sucre syntaxique".**
Il doit régler les vraies douleurs que les développeurs ont TOUS les jours avec les 5 langages qu'il remplace.
Si un reviewer dit *"c'est juste TypeScript + Express déguisé"* — on a échoué.
Si un reviewer dit *"je n'aurais jamais pu faire ça aussi vite en JS/Python/HTML/CSS/SQL séparés"* — on a réussi.

---

## 💥 LES 5 DOULEURS À ÉLIMINER (une par langage)

### ❌ JavaScript → ✅ UniStack le règle ainsi
**Problèmes JS :**
- `undefined is not a function` → erreur incompréhensible
- Pas de types par défaut → bugs silencieux
- Callback hell → code illisible
- `this` qui change de contexte → comportement imprévisible
- npm avec 500 dépendances pour rien → projet qui pèse 200Mo

**Ce que UniStack doit faire :**
- Types natifs dans `validate:` → impossible d'envoyer une string là où on attend un number
- `async/await` automatique dans les routes → zéro callback hell
- Zéro dépendances cachées → `npx unistack` suffit
- Erreurs claires avec ligne et fichier `.uni` (pas de stack trace Node)

---

### ❌ Python → ✅ UniStack le règle ainsi
**Problèmes Python :**
- L'indentation qui casse tout silencieusement
- Conflits `venv` / `pip` → *"ça marche sur ma machine"*
- Le GIL → pas de vraie parallélisation
- Lenteur au démarrage du subprocess

**Ce que UniStack doit faire :**
- Python exécuté sans que l'utilisateur touche à `venv` ou `pip` — tout géré auto
- Pool de workers Python pré-lancés → zéro latence de démarrage
- Timeout automatique sur chaque fonction → pas de freeze infini
- Sandbox Python → impossible d'exécuter `os.system("rm -rf /")` par accident

---

### ❌ HTML → ✅ UniStack le règle ainsi
**Problèmes HTML :**
- Répétition massive (pas de composants natifs)
- Balises mal fermées silencieuses
- Zéro logique dans le markup
- Copier-coller partout pour réutiliser un bout d'UI

**Ce que UniStack fait déjà ✅ :**
- `components:` → composants réutilisables avec props
- `{render:PostCard("Hello", userName)}` → logique dans le markup
- Validation du HTML à la compilation → erreurs immédiates

**Ce qu'il reste à faire :**
- Composants avec slots (contenu enfant variable)
- Composants dynamiques côté serveur (pas juste compilation statique)

---

### ❌ CSS → ✅ UniStack le règle ainsi
**Problèmes CSS :**
- Cascade imprévisible → un style en écrase un autre sans raison
- Scope global → `.button` dans un composant affecte tous les boutons
- Responsive douloureux → media queries à répéter partout
- Variables CSS : arrivées en 2015, encore mal supportées partout

**Ce que UniStack doit faire :**
- CSS scopé automatiquement par composant → `.post-card .title` jamais en conflit
- Variables CSS générées auto depuis `config:` (couleurs, fonts, spacing)
- `@media` simplifié → `responsive: mobile { ... }` dans la section CSS
- Thème dark/light auto depuis une seule variable

---

### ❌ SQL → ✅ UniStack le règle ainsi
**Problèmes SQL :**
- Injections SQL → faille de sécurité #1 depuis 30 ans
- Migrations manuelles → synchroniser la DB avec le code est un cauchemar
- Jointures illisibles sur des requêtes complexes
- Zéro type-safety → la DB retourne `any`

**Ce que UniStack doit faire :**
- Requêtes paramétrées par DÉFAUT → injection SQL physiquement impossible
- Migrations auto versionnées → `db:` section qui décrit le schéma, UniStack gère le reste
- Types SQL déduits automatiquement → `sql("SELECT id, title FROM posts")` retourne `Post[]`
- Pas besoin de connaître SQL pour les requêtes simples (ORM DSL optionnel)

---

## 🔟 LES 10 CRITIQUES QUE LES REVIEWERS VONT DIRE — ET COMMENT LES TUER

| # | Critique potentielle | Comment l'éliminer | Phase |
|---|---|---|---|
| 1 | *"C'est juste TypeScript déguisé"* | Montrer ce que TypeScript + Express ne peut PAS faire en 10 lignes que UniStack fait | F2 (démo) |
| 2 | *"Le Python est lent / plante"* | Pool de workers + timeout strict + message d'erreur clair | Phase A ✅ |
| 3 | *"Pas de vrais composants, c'est du string replace"* | Composants dynamiques côté serveur + slots | Phase C/D |
| 4 | *"Le CSS scope ne marche pas vraiment"* | CSS scopé auto avec hash unique par composant | Phase C |
| 5 | *"SQL injection possible"* | Paramétrage forcé — impossible de faire `sql("... " + userInput)` sans warning | Phase A + F1 |
| 6 | *"Pas de hot reload, c'est inutilisable en dev"* | `unistack dev` avec HMR via WebSocket | Phase E |
| 7 | *"Pas d'extension VSCode, impossible à utiliser"* | Extension VSCode avec coloration + autocomplétion | Phase E |
| 8 | *"Pas de vrais tests"* | Section `test:` native dans le DSL | Phase E |
| 9 | *"Pas de modules, impossible de scaler"* | `unistack module` + imports entre fichiers `.uni` | Phase D |
| 10 | *"Aucune documentation sérieuse"* | README + cookbook + 3 apps exemples | Phase F |

---

## 📋 ROADMAP COMPLÈTE — ÉTAPE PAR ÉTAPE

---

### ✅ PHASE A — Déjà faite
- [x] SQL exécuté réellement (SQLite via sql.js + persistance)
- [x] Python exécuté réellement via subprocess
- [x] Pool workers Python + timeouts
- [x] Port auto-fallback
- [x] Build edge + code splitting

---

### ✅ PHASE B — Déjà faite
- [x] Section `state:` réactive (window.UniState)
- [x] Bindings DOM : `data-uni-bind`, `data-uni-model`, `data-uni-show`, `data-uni-class`
- [x] Section `components:` avec `{render:PostCard(...)}`
- [x] Validation d'entrées dans `routes:` (`validate title:string:required:min=3`)
- [x] Validation côté serveur Node ET edge handler

---

### 🔴 PHASE C — Backend de production
> **Objectif : pouvoir déployer une vraie app en production**

#### C1 — Middleware DSL natif
**Pourquoi :** Sans auth/CORS/rate-limit natifs, les devs doivent tout recoder manuellement = point négatif immédiat.

**Syntaxe cible :**
```text
middleware:
  cors: origins=["http://localhost:3000", "https://monapp.com"];
  rateLimit: max=100, window="15m";
  auth: exclude=["/login", "/register", "/health"], handler=py:verify_jwt;
  helmet: true;
```

**Étapes de code :**
1. `ast.ts` → ajouter `MiddlewareSection`, `CorsConfig`, `RateLimitConfig`, `AuthConfig`
2. `uniParser.ts` → parser la section `middleware:` avec ses sous-clés
3. `index.ts` → générer le code Express middleware (helmet, cors, express-rate-limit)
4. `server.ts` → injecter les middlewares avant les routes
5. Tests → middleware appliqué, routes exclues de l'auth, rate limit déclenché

**Packages npm à ajouter :** `helmet`, `cors`, `express-rate-limit`, `jsonwebtoken`

---

#### C2 — WebSocket natif
**Pourquoi :** Temps réel = indispensable en 2026. Pas de WebSocket = pas de chat, pas de notifications, pas de live updates.

**Syntaxe cible :**
```text
ws-routes:
  WS /chat {
    on:connect { py:register_client(clientId); }
    on:message { py:broadcast(data, clientId); }
    on:disconnect { py:cleanup_client(clientId); }
  }
  
  WS /notifications {
    on:connect { py:subscribe_user(userId); }
    on:message { py:handle_notification(data); }
  }
```

**Étapes de code :**
1. `ast.ts` → ajouter `WsRouteSection`, `WsRouteDef`, `WsEventHandler`
2. `uniParser.ts` → parser `ws-routes:` et les blocs `on:connect/message/disconnect`
3. `index.ts` → générer le code `ws` (library `ws` Node.js)
4. `server.ts` → intégrer le serveur WebSocket sur le même port HTTP
5. Client → générer le helper `UniSocket` automatiquement dans `app.client.ts`
6. Tests → connexion WS, envoi message, déconnexion propre

**Package npm à ajouter :** `ws`, `@types/ws`

---

#### C3 — Upload de fichiers
**Pourquoi :** Impossible de faire une app réelle sans upload d'images/documents.

**Syntaxe cible :**
```text
routes:
  POST /api/upload {
    file: field="avatar", accept=["image/jpeg", "image/png", "image/webp"], maxSize="5mb";
    return py:process_upload(file.path, file.name, file.size);
  }
  
  POST /api/documents {
    file: field="doc", accept=["application/pdf"], maxSize="20mb";
    return py:save_document(file);
  }
```

**Étapes de code :**
1. `ast.ts` → ajouter `FileUploadConfig` dans `RouteDef`
2. `uniParser.ts` → parser la directive `file:` dans les routes
3. `index.ts` → générer le middleware `multer` pour les routes avec upload
4. `server.ts` → dossier uploads configurable, nettoyage auto des fichiers temporaires
5. Tests → upload réussi, rejet mauvais type MIME, rejet fichier trop gros

**Package npm à ajouter :** `multer`, `@types/multer`

---

#### C4 — Variables d'environnement DSL
**Pourquoi :** Hardcoder des secrets dans le code = catastrophe. Tout projet sérieux utilise des variables d'env.

**Syntaxe cible :**
```text
env:
  DATABASE_URL: required string;
  JWT_SECRET: required string;
  PORT: optional number default=3000;
  DEBUG: optional boolean default=false;
  UPLOAD_DIR: optional string default="./uploads";
```

**Étapes de code :**
1. `ast.ts` → ajouter `EnvSection`, `EnvVarDef`
2. `uniParser.ts` → parser la section `env:`
3. `index.ts` → générer validation des env vars au démarrage du serveur
4. `server.ts` → crash propre avec message clair si une var `required` manque
5. Générer automatiquement un fichier `.env.example` à partir de la section `env:`
6. Tests → démarrage OK avec vars présentes, crash clair si var required absente

**Package npm à ajouter :** `dotenv`

---

#### C5 — CSS scopé par composant
**Pourquoi :** Sans scope CSS, dès qu'il y a 10 composants les styles se marchent dessus.

**Comportement cible :**
```text
components:
  component PostCard(title, author) => <article class="card"><h2>{{title}}</h2></article>;

css:
  PostCard {
    .card { border: 1px solid #ddd; padding: 15px; }
    .card h2 { color: #667eea; }
  }
```
→ Génère `.uni-PostCard-card { ... }` automatiquement, impossible de conflits.

---

### 🟡 PHASE D — Modules & Packaging

[...] (truncated for brevity in this snippet)
