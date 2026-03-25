# Architecture Overview / Vue d'ensemble de l'architecture

**english:** high‑level diagrams showing UniStack compilation and runtime flow.

**french:** diagrammes de haut niveau montrant le flux de compilation et d'exécution.


```mermaid
flowchart LR
    A[.uni Source] --> B(Parser)
    B --> C(AST)
    C --> D(Transpiler)
    D --> E{IR}
    E --> F[Server TS]
    E --> G[Client TS]
    F & G --> H(esbuild Bundler)
    H --> I[dist/ (production bundle)]
    
    subgraph Runtime
      I --> J[Express Server]
      I --> K[Browser Client]
    end
```

> The parser produces an **AST**, the transpiler converts the AST to an
> intermediate representation (IR) containing frontend, backend and asset
> chunks.  TypeScript sources are generated and bundled by **esbuild**.  At
> runtime the server runs under **Express** while the client code executes in
> the browser.


## Phase‑2 Features (future)

- Real Python execution via subprocess or embedded interpreter
- C++/Wasm compilation for `cpp:` sections
- SQL engine/ORM integration
- Hot‑reload development server
- Debugging & profiling tools
- Language Server / IDE plugins

_(additional diagrams will be added as these features are designed)_
