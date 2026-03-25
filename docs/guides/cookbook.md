# UniStack Cookbook

This collection of recipes shows how to accomplish common tasks in UniStack.

## 1. Auth JWT (login/register/verify)

```unistack
py-logic:
  import jwt
  SECRET = env:JWT_SECRET
  def register(user, passw):
    sql("INSERT INTO users (name, pass) VALUES (?, ?)", user, passw)
    return {ok: True}
  def login(user, passw):
    row = sql("SELECT id FROM users WHERE name = ? AND pass = ?", user, passw)
    if not row: return {error: "bad"}
    token = jwt.encode({id: row[0].id}, SECRET, algorithm="HS256")
    return {token: token}
  def verify_jwt(token):
    try:
      return jwt.decode(token, SECRET, algorithms=["HS256"])
    except:
      return None

routes:
  POST /api/register { return py:register(user, passw); }
  POST /api/login { return py:login(user, passw); }

middleware:
  auth handler py:verify_jwt excludes "/login", "/register";
```

Register and login store users and issue JWTs; `verify_jwt` is used as middleware.

## 2. Image upload with MIME validation

```unistack
routes:
  POST /api/upload {
    file field="image" accept="image/*" maxSize=5MB;
    return py:saveImage(file);
  }

py-logic:
  def saveImage(file):
    import os, shutil
    mime = file["mimetype"]
    if not mime.startswith("image/"):
      return {error: "wrong type"}
    dest = os.path.join("uploads", file["filename"])
    with open(dest, "wb") as f:
      f.write(file["buffer"])
    return {ok: True}
```

The built-in `file` stanza populates `req.file` with `{buffer, mimetype, filename}`.

## 3. Real-time chat with WebSockets

```unistack
py-logic:
  clients = []
  def chatHandler(ws, req):
    clients.append(ws)
    while True:
      msg = ws.recv()
      for c in clients:
        if c is not ws: c.send(msg)
```

```unistack
ws-routes:
  WS /chat py:chatHandler;
```

## 4. Blog with auto‑migrated DB

```unistack
db:
  table posts { id: integer primary autoincrement; title: string; body: text; }

env:
  DB_URL:string:required;

routes:
  GET /api/posts { return sql("SELECT * FROM posts"); }
  POST /api/posts { validate title:string:required, body:string:required; return sql("INSERT INTO posts (title, body) VALUES (?, ?)", title, body); }
```

Run `npx unistack dev` and the table will be created automatically on first request.

## 5. Native API tests

UniStack supports an inline `test:` section executed during build/CI.

```unistack
test:
  assert(1 + 1 === 2);
  const r = sql("SELECT 42 as answer");
  assert(r[0].answer === 42);
```

Place simple assertions or small integration checks; failure stops the build.
