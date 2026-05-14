# [Graduation] UniStack - Guide d'utilisation pratique

**Objectif:** Vous allow à créer votre première application UniStack en 5 minutes.

---

## Étape 1: Setup initial

### 1.1 Initialiser un projet
```bash
cd mon-projet
npm init -y
npm install unistack-toolchain
```

### 1.2 Créer la configuration
```bash
npx unistack init
```

Ceci crée `unistack.config.json`:
```json
{
  "entry": "src/app.uni",
  "outDir": "dist",
  "generatedDir": "generated",
  "serverEntry": "generated/app.server.ts",
  "clientEntry": "generated/app.client.ts"
}
```

---

## Étape 2: Créer votre premier fichier `.uni`

### Créez `src/app.uni`:

```unistack
unistack app "HelloWorld" version 1.0 {
  config: port=3000;

  html-ui:
    <h1>{py:getTitle()}</h1>;

  css:
    body { font-family: Arial; margin: 0; padding: 20px; };
    h1 { color: #333; };

  py-logic:
    def getTitle():
      return "Bonjour UniStack!";

  routes:
    GET / {
      return py:getTitle();
    }
}
```

---

## Étape 3: Compiler et lancer

```bash
# Compile et génère les fichiers
npm run build

# Démarre le serveur de développement
npm run dev
```

**Résultat:** Votre app est disponible sur http://localhost:3000

---

## Patterns Courants

### Pattern 1: Page statique simple

```unistack
unistack app "StaticPage" version 1.0 {
  config: port=3000;

  html-ui:
    <div class="container">
      <h1>Bienvenue!</h1>
      <p>Ceci est une page statique.</p>
    </div>;

  css:
    .container { max-width: 800px; margin: 0 auto; padding: 20px; };
}
```

### Pattern 2: API avec données statiques

```unistack
unistack app "APIApp" version 1.0 {
  config: port=3000;

  html-ui:
    <div id="data"></div>;

  js-events:
    document.addEventListener('DOMContentLoaded', async () => {
      const response = await fetchJson('/api/items');
      document.getElementById('data').textContent = JSON.stringify(response, null, 2);
    });

  routes:
    GET /api/items {
      return py:getItems();
    }

  py-logic:
    def getItems():
      return [
        {"id": 1, "name": "Item 1"},
        {"id": 2, "name": "Item 2"}
      ];
}
```

### Pattern 3: Interaction utilisateur

```unistack
unistack app "InteractiveApp" version 1.0 {
  config: port=3000;

  html-ui:
    <div class="app">
      <input type="text" id="nameInput" placeholder="Votre nom">
      <button id="greetBtn">{js:buttonText}</button>
      <p id="greeting"></p>
    </div>;

  css:
    .app { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px; };
    input { padding: 8px; width: 100%; box-sizing: border-box; margin-bottom: 10px; };
    button { padding: 10px 20px; background: #007bff; color: white; border: none; cursor: pointer; width: 100%; };
    p { text-align: center; font-size: 18px; color: #333; };

  js-events:
    var buttonText = "Saluer";

    document.getElementById('greetBtn').addEventListener('click', async () => {
      const name = document.getElementById('nameInput').value;
      if (!name) {
        alert('Entrez votre nom!');
        return;
      }

      const greeting = await fetchJson('/api/greet', {
        method: 'POST',
        body: { name }
      });

      document.getElementById('greeting').textContent = greeting.message;
    });

  routes:
    POST /api/greet {
      return py:greetUser(name);
    }

  py-logic:
    def greetUser(name):
      return {"message": f"Bonjour {name} 👋"};
}
```

### Pattern 4: Afficher des données 

```unistack
unistack app "UsersList" version 1.0 {
  config: port=3000;

  html-ui:
    <div class="container">
      <h1>Utilisateurs</h1>
      <ul id="users-list" class="user-list">
        <li>Chargement...</li>
      </ul>
    </div>;

  css:
    .container { max-width: 600px; margin: 0 auto; padding: 20px; };
    .user-list { list-style: none; padding: 0; };
    .user-list li { padding: 12px; background: #f5f5f5; margin: 8px 0; border-radius: 4px; border-left: 4px solid #007bff; };

  js-events:
    document.addEventListener('DOMContentLoaded', async () => {
      try {
        const users = await fetchJson('/api/users');
        const ul = document.getElementById('users-list');
        ul.innerHTML = '';
        
        users.forEach(user => {
          const li = document.createElement('li');
          li.textContent = `${user.name} (ID: ${user.id})`;
          ul.appendChild(li);
        });
      } catch (err) {
        console.error('Erreur:', err);
      }
    });

  routes:
    GET /api/users {
      return py:getAllUsers();
    }

  py-logic:
    def getAllUsers():
      return [
        {"id": 1, "name": "Alice Dupont"},
        {"id": 2, "name": "Bob Martin"},
        {"id": 3, "name": "Charlie Wilson"}
      ];
}
```

### Pattern 5: Formulaire avec validation

```unistack
unistack app "FormApp" version 1.0 {
  config: port=3000;

  html-ui:
    <div class="form-container">
      <h2>Formulaire d'inscription</h2>
      <form id="signupForm">
        <input type="email" id="email" placeholder="Email" required>
        <input type="password" id="password" placeholder="Mot de passe" required>
        <button type="submit">S'inscrire</button>
      </form>
      <p id="message"></p>
    </div>;

  css:
    .form-container { max-width: 400px; margin: 50px auto; padding: 20px; border: 1px solid #ddd; };
    input { width: 100%; padding: 10px; margin: 10px 0; box-sizing: border-box; };
    button { width: 100%; padding: 10px; background: #28a745; color: white; border: none; cursor: pointer; };
    #message { text-align: center; margin-top: 10px; };

  js-events:
    document.getElementById('signupForm').addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value;
      const password = document.getElementById('password').value;

      try {
        const result = await fetchJson('/api/signup', {
          method: 'POST',
          body: { email, password }
        });
        document.getElementById('message').textContent = result.message;
        document.getElementById('signupForm').reset();
      } catch (err) {
        document.getElementById('message').textContent = 'Erreur: ' + err.message;
      }
    });

  routes:
    POST /api/signup {
      return py:registerUser(email, password);
    }

  py-logic:
    def registerUser(email, password):
      # Ici on ferait une vraie validation + DB insert en Phase 2
      return {"message": f"Inscription réussie! Bienvenue {email}"};
}
```

---

## Bonnes pratiques

### [OK] À faire

1. **Garder les sections organisées** - HTML, CSS, Routes, Logique séparés clairement
2. **Nommage cohérent** - `getUserById` vs `get_user_by_id`
3. **Commentaires** - Documenter la logique complexe
4. **DRY (Don't Repeat Yourself)** - Réutiliser les fonctions Python
5. **Fallback UI** - Afficher du contenu pendant le chargement

### [Cross] À éviter

1. **Mélanger HTML et logique** - Garder séparation des responsabilités
2. **Chemins hardcodés** - Utiliser les routes définies
3. **Synchrone vs Asynchrone** - Utiliser `async/await` pour les appels API
4. **Grande taille de fichier** - Phase 2 permettra l'import de modules

---

## Debug & Troubleshooting

### 1. Vérifier la compilation
```bash
npm run build
```

Si des erreurs de parsing aparaissent:
- Check la syntaxe du header: `unistack app "..." version X.Y`
- Assurez-vous que chaque bloc de section se termine bien par `;`
- Vérifiez les accolades `{ }` fermées

### 2. Vérifier les routes
```bash
# Dans la console du navigateur ou via curl
curl http://localhost:3000/api/mon-route
```

### 3. Logs côté client
```javascript
// Ouvrir DevTools (F12) et vérifier les logs
console.log('Debug:', variable);

// Network tab pour voir les appels API
```

### 4. Ajouter des logs côté serveur
```bash
npm run dev
# Les logs du serveur Node.js s'afficheront dans le terminal
```

### 5. Python non disponible (MVP)
Pour utiliser une fonction Python, vous devez l'**enregistrer manuellement**:

**Dans `src/cli.ts`, section `cmdDev()`:**
```typescript
const runtime = new BasicRuntime();

// Enregistrer les fonctions Python
runtime.registerPy('getAllUsers', async () => {
  return [
    { id: 1, name: 'Alice' },
    { id: 2, name: 'Bob' }
  ];
});

runtime.registerPy('greetUser', (name: string) => {
  return { message: `Bonjour ${name}!` };
});

startServer(serverModule.createServer, runtime, { port: 3000 });
```

Puis rebuild:
```bash
npm run build
npm run dev
```

---

## Exemple complet: Application d'avis restaurants

```unistack
unistack app "RestaurantReviews" version 1.0 {
  config: port=3000, maxRating=5;

  html-ui:
    <div class="page">
      <header class="header">
        <h1>🍽️ Avis Restaurants</h1>
      </header>
      
      <div class="reviews-container">
        <div id="reviews-list"></div>
      </div>

      <div class="form-section">
        <h2>Ajouter un nouvel avis</h2>
        <input type="text" id="restName" placeholder="Nom du restaurant">
        <textarea id="review" placeholder="Votre avis..."></textarea>
        <select id="rating">
          <option value="1">⭐ 1 - Mauvais</option>
          <option value="2">⭐⭐ 2 - Médiocre</option>
          <option value="3" selected>⭐⭐⭐ 3 - Bon</option>
          <option value="4">⭐⭐⭐⭐ 4 - Très bon</option>
          <option value="5">⭐⭐⭐⭐⭐ 5 - Excellent</option>
        </select>
        <button id="submitBtn">Publier l'avis</button>
      </div>
    </div>;

  css:
    * { margin: 0; padding: 0; box-sizing: border-box; };
    body { font-family: 'Segoe UI', sans-serif; background: #f5f5f5; color: #333; };
    .page { max-width: 800px; margin: 0 auto; padding: 20px; };
    .header { background: #fff; padding: 20px; margin-bottom: 30px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); };
    .header h1 { font-size: 32px; color: #d63031; };
    .reviews-container { margin-bottom: 40px; };
    .review-item { background: #fff; padding: 20px; margin-bottom: 15px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid #d63031; };
    .review-item h3 { color: #d63031; margin-bottom: 5px; };
    .review-item .rating { font-size: 14px; color: #ffa502; margin-bottom: 10px; };
    .review-item p { line-height: 1.6; color: #666; };
    .form-section { background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1); };
    .form-section h2 { margin-bottom: 20px; color: #d63031; };
    input, textarea, select { width: 100%; padding: 10px; margin-bottom: 15px; border: 1px solid #ddd; border-radius: 4px; font-size: 14px; };
    textarea { resize: vertical; min-height: 100px; };
    button { width: 100%; padding: 12px; background: #d63031; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 16px; font-weight: bold; };
    button:hover { background: #c92a2a; };

  py-logic:
    def getReviews():
      return [
        {"id": 1, "restaurant": "Le Petit Bistro", "rating": 5, "text": "Excellent! Très bon accueil."},
        {"id": 2, "restaurant": "Pizza Roma", "rating": 4, "text": "Très bon pizzas, service rapide."},
        {"id": 3, "restaurant": "Sushi Express", "rating": 3, "text": "Correct mais un peu cher."}
      ];

    def addReview(name, text, rating):
      return {
        "id": 4,
        "restaurant": name,
        "rating": int(rating),
        "text": text
      };

  js-events:
    // Charger les avis au démarrage
    document.addEventListener('DOMContentLoaded', async () => {
      const reviews = await fetchJson('/api/reviews');
      displayReviews(reviews);
    });

    // Afficher les avis
    function displayReviews(reviews) {
      const list = document.getElementById('reviews-list');
      if (reviews.length === 0) {
        list.innerHTML = '<p>Aucun avis pour le moment.</p>';
        return;
      }
      list.innerHTML = reviews.map(rev => `
        <div class="review-item">
          <h3>${rev.restaurant}</h3>
          <div class="rating">${'⭐'.repeat(rev.rating)}</div>
          <p>${rev.text}</p>
        </div>
      `).join('');
    }

    // Ajouter un avis
    document.getElementById('submitBtn').addEventListener('click', async () => {
      const name = document.getElementById('restName').value.trim();
      const text = document.getElementById('review').value.trim();
      const rating = document.getElementById('rating').value;

      if (!name || !text) {
        alert('Veuillez remplir tous les champs!');
        return;
      }

      try {
        await fetchJson('/api/reviews', {
          method: 'POST',
          body: { name, text, rating }
        });

        // Reload the list
        const reviews = await fetchJson('/api/reviews');
        displayReviews(reviews);

        // Clear form
        document.getElementById('restName').value = '';
        document.getElementById('review').value = '';
        document.getElementById('rating').value = '3';
      } catch (err) {
        alert('Erreur: ' + err.message);
      }
    });

  routes:
    GET /api/reviews {
      return py:getReviews();
    }

    POST /api/reviews {
      return py:addReview(name, text, rating);
      status 201;
    }
}
```

**Pour lancer:**
```bash
npm run build
npm run dev
```

Visitez http://localhost:3000 et testez!

---

## Ressources

- 📖 [Documentation complète](DOCUMENTATION.md)
- [Wrench] [Configuration du projet](unistack.config.json)
- 📝 [Spécifications UniStack](README.md)

---

**Prêt à créer votre première app UniStack? Let's go! [Rocket]**
