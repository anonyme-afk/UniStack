# Extension UniStack VSCode

Extension VSCode pour la colorisation syntaxique du langage UniStack (.uni) avec le theme UniStack Dark.

## Fonctionnalités

- Colorisation syntaxique complète pour les fichiers .uni
- Theme UniStack Dark basé sur VS Code Dark+
- Couleurs identiques à HTML/CSS/JS/Python standard

## Installation

### Pour les utilisateurs finaux

1. Télécharger l'extension `.vsix` depuis la page des releases
2. Dans VSCode : `Extensions` → `...` → `Install from VSIX...`
3. Sélectionner le fichier `.vsix` téléchargé
4. Redémarrer VSCode

### Pour les développeurs (mode développement)

1. **Ouvrir l'extension dans VSCode** :
   ```bash
   cd vscode
   code .
   ```

2. **Installer les dépendances** :
   ```bash
   npm install
   ```

3. **Compiler l'extension** :
   ```bash
   npm run compile
   ```

4. **Lancer le mode développeur** :
   - Appuyer sur `F5` dans VSCode pour lancer une nouvelle instance en mode développeur avec l'extension chargée

## Utilisation

### Activer le theme UniStack Dark

1. `Ctrl+Shift+P` (ou `Cmd+Shift+P` sur Mac)
2. Taper "Preferences: Color Theme"
3. Sélectionner "UniStack Dark" dans la liste

### Tester la colorisation

Créez un fichier `test.uni` et collez-y la syntaxe de référence :

```uni
unistack app "Blog" version 1.0 {

  db:
    table users {
      id: integer primary autoincrement;
      name: string required;
      pass: string required;
    }

  env:
    JWT_SECRET:string:required;

  py-logic:
    // EN: Login function
    // FR: Fonction de connexion
    import jwt, os
    SECRET = env:JWT_SECRET
    @wasm
    def login(name, passw):
      row = sql("SELECT id FROM users WHERE name = ? AND pass = ?", name, passw)
      if not row: return {error:'bad'}
      return {token: jwt.encode({id: row[0].id}, SECRET)}

  middleware:
    auth handler py:verify_jwt excludes "/login", "/register";

  routes:
    GET  /api/posts  { return sql("SELECT * FROM posts"); }
    POST /api/posts  {
      validate title:string:required, content:string:required;
      file field="image" accept="image/*" maxSize="5mb";
      return py:create_post(title, content);
    }

  state:
    count: number = 0;
    user: object = null;

  components:
    component PostCard(title, author) =>
      

        
{{title}}

        

by {{author}}


      
;

  html-ui:
    

      
      
      
Visible

      
+1
    
;

  js-events:
    function increment() { UniState.count++; }

  css:
    PostCard {
      .card { border: 1px solid #ddd; padding: 15px; }
      .card h2 { color: #667eea; }
    }
}
```

## Couleurs utilisées

L'extension reproduit exactement les conventions VSCode Dark+ :

- **Mots-clés** : bleu `#569CD6`
- **Sections/types** : bleu clair `#4EC9B0`
- **Modificateurs** : bleu clair `#9CDCFE`
- **Méthodes HTTP** : jaune `#DCDCAA`
- **Chemins/routes** : orange `#CE9178`
- **Strings** : orange `#CE9178`
- **Nombres** : vert clair `#B5CEA8`
- **Commentaires** : vert `#6A9955`
- **Balises HTML** : rouge-rose `#F44747`
- **Attributs data-uni** : jaune `#DCDCAA`
- **Accolades** : or `#FFD700`
- **Variables {{...}}** : bleu clair `#9CDCFE`
- **Annotations @** : jaune pâle `#C8C800`

## Structure des fichiers

```
vscode/
├── package.json                    # Manifeste de l'extension
├── syntaxes/
│   └── unistack.tmLanguage.json    # Grammaire TextMate
├── themes/
│   └── unistack-color-theme.json   # Theme de couleurs
└── README.md                       # Ce fichier
```

## Dépannage

### L'extension ne se charge pas

1. Vérifiez que VSCode est à jour (version ≥ 1.80.0)
2. Redémarrez VSCode après l'installation
3. Vérifiez que l'extension est activée dans `Extensions`

### Les couleurs ne s'affichent pas

1. Activez le theme "UniStack Dark" comme indiqué ci-dessus
2. Vérifiez que le fichier a l'extension `.uni`
3. Redémarrez VSCode si nécessaire

### Problèmes de compilation en mode développement

1. Assurez-vous d'avoir Node.js installé
2. Vérifiez que `npm` est accessible dans le terminal
3. Exécutez `npm install` pour installer les dépendances
4. Vérifiez les erreurs dans la console de développement (`Help` → `Toggle Developer Tools`)

## Contribuer

Pour contribuer à l'extension :

1. Fork le repository
2. Créez une branche pour votre feature
3. Testez vos modifications en mode développement
4. Soumettez une Pull Request

## License

Cette extension est fournie sous license MIT.