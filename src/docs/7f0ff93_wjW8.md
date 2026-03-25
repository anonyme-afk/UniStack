# UniStack Security

This document distinguishes between what UniStack provides out of the box and what developers must still handle.

## Automatic protections

* **SQL parameterization** – the transpiler scans each `sql("...")` used in routes; concatenated strings trigger a build-time error (`❌ UniStack: SQL injection risk`).
* **Rate limiting in production** – if `NODE_ENV=production` and no `middleware` section is provided, a default limiter of 1000 requests per 15 minutes is applied automatically.
* **Helmet headers** – when running in production, the server enables `helmet()` on every app, even if the developer did not configure middleware.
* **Stack trace suppression** – error handlers only return error messages; full stack traces are never sent in HTTP responses.
* **Redacted logs** – console output is wrapped in production to mask any object properties whose keys match `/secret|token|password|key/i`.
* **Env var validation** – declared `env:` entries are checked at build/dev startup; missing required vars cause a hard error.

## Developer responsibilities

* **JWT_SECRET and other secrets** must be strong and kept out of source control (use `.env`, vaults, etc.).
* **HTTPS** – deploy behind TLS; UniStack does not provide certificates.
* **Database backups** – the built-in SQLite store is simple; arrange backups or use a managed DB.
* **Credential storage** – handle passwords and tokens securely (e.g. hash passwords before storing).
* **Dependency updates** – run `npm audit` regularly and update dependencies to address vulnerabilities.
* **Access control logic** – middleware helpers provide hooks, but you must write correct authorization code.

> **Report security issues** by opening a GitHub issue tagged `security` or emailing security@unistack.org.
