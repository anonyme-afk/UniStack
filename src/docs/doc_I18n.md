# [Rocket] Getting Started with UniStack

**english:** UniStack is a hybrid full-stack language that lets you write Python, JavaScript, HTML/CSS, and SQL all in one file. This guide gets you started in 5 minutes.

**french:** UniStack est un langage full-stack hybride qui vous permet d'écrire Python, JavaScript, HTML/CSS et SQL dans un seul fichier. Ce guide vous permet de démarrer en 5 minutes.

---

## Setup (2 minutes)

**Requirements:** Node.js 18+

```bash
# 1. Clone
git clone https://github.com/unistack/unistack.git
cd unistack

# 2. Install
npm install

# 3. Verify
npm run verify
```

If you see "[Check] All checks passed!", you're ready! Otherwise, see [TROUBLESHOOTING.md](TROUBLESHOOTING.md).

---

## Your First UniStack App (3 minutes)

Create a file `hello.uni`:

```
unistack app "HelloApp" version 1.0 {
  config: port=3000;

  html-ui:
    <h1>Hello, {py:get_name()}!</h1>
    <button id="btn">Click me</button>;

  css:
    body { font-family: Arial; padding: 20px; }
    button { padding: 10px 20px; font-size: 16px; cursor: pointer; };

  py-logic:
    def get_name():
      return "World";

  js-events:
    document.getElementById('btn').onclick = () => {
      alert('Hello from UniStack!');
    };

  routes:
    GET /api/greeting
      -> return py:get_name();
}
```

---

## Run It

```bash
# Build + start server
npm run dev
```

Open `http://localhost:3000` in your browser. Done!

---

## What You Just Created

Your app automatically gets:
- [Check] Frontend: HTML rendered with Python data
- [Check] Backend: HTTP routes that call Python functions
- [Check] Styling: CSS embedded in one place
- [Check] Interactivity: JavaScript event handlers
- [Check] Full bundled package ready to deploy

---

## Next Steps

→ **[INDEX.md](INDEX.md)** – Complete documentation index  
→ **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** – Syntax cheat sheet  
→ **[GUIDE_COMPLET.md](GUIDE_COMPLET.md)** – Deep dive tutorial  

---

## Available Commands

```bash
npm run build        # Compile to dist/
npm run test         # Run test suite
npm run dev          # Start dev server (:3000)
npm run verify       # Check setup
npm run status       # See project status
npm run clean        # Remove build files
```

---

## Deployment

### Docker
```bash
docker build -t myapp .
docker run -p 3000:3000 myapp
```

### npm package
```bash
npm publish
```

---

## Troubleshooting

**Port 3000 in use?**
Change `PORT=3001` in `.env`

**Tests fail?**
```bash
npm run clean
npm run build
npm run test
```

**Need help?**
See [TROUBLESHOOTING.md](TROUBLESHOOTING.md) or check [GUIDE_COMPLET.md](GUIDE_COMPLET.md) FAQ

---

**That's it! You're using UniStack. Happy coding! / C'est ça! Vous utilisez UniStack. Bon développement!**
