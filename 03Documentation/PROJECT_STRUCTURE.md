# Project Structure

This repository keeps the academic delivery folders, but the active program is now in:

```text
06Code/
  backend/
  frontend/
```

## Canonical Source

- Backend API: `06Code/backend`
- Frontend static site: `06Code/frontend`
- Database schema: `06Code/backend/database/schema.sql`
- Requirements: `02Requirements`
- Technical documentation: `03Documentation`
- UML diagrams: `04UMLDiagrams`
- Manual evidence: `03Documentation/evidence` and `05UnitTests`
- Archived academic code: `07Other/legacy-academic-code`

## Active Code Map

```text
06Code/
  backend/
    composer.json              PHP dependencies and scripts
    .env.example               Backend environment template
    public/
      index.php                Slim entry point
    routes/
      api.php                  Route table and dependency composition
    src/
      Controllers/             HTTP controllers
      Middleware/              Role-based access middleware
      Models/                  Eloquent ORM models
      Services/                Business rules, validation, auth, payroll, dates
      Support/                 Database and JSON response helpers
      bootstrap.php            Lightweight PSR-style autoload helper
    database/
      schema.sql               Supabase PostgreSQL schema and seed data
    tests/
      lint.php                 PHP syntax lint runner
      run.php                  Lightweight service/unit checks
  frontend/
    index.html                 Public home
    pricing.html               Pricing and offers
    enrollment.html            Enrollment request / Google enrollment completion
    login.html                 Role login and Google sign-in
    dashboard.html             Role-based internal dashboard
    attendance-kiosk.html      Teacher check-in station
    css/
      styles.css               Frontend visual system
    js/
      app-config.js            Frontend runtime configuration defaults
      config.js                Optional deployment override globals
      api-client.js            Backend API wrapper
      branch-store.js          Branch, style, and level reference data
      public-pages.js          Public page behavior
      dashboard.js             Dashboard modules and forms
      validators.js            Frontend validation
      session.js               Browser session storage
      dom.js                   DOM helpers
      formatters.js            Display formatting
      main.js                  Browser app bootstrap
  Dockerfile                   Backend container image
  docker-entrypoint.sh         Runtime env file generation and PHP server start
  docker-compose.yml           Local backend + PostgreSQL draft
  render.yaml                  Render blueprint draft
```

## Responsibility Map

| Area | Current location | Responsibility |
| --- | --- | --- |
| Backend entry point | `06Code/backend/public/index.php` | Loads dependencies, `.env`, database, CORS, routes, and Slim middleware. |
| Routes | `06Code/backend/routes/api.php` | Maps implemented URLs to controller methods and applies role middleware. |
| Controllers | `06Code/backend/src/Controllers` | Coordinate requests, validation, services, models, and JSON responses. |
| Models | `06Code/backend/src/Models` | Map Supabase tables with Eloquent. |
| Services | `06Code/backend/src/Services` | Hold reusable rules for auth, JWT, validation, branch access, dates, payroll, attendance summaries, evidence codes, and audits. |
| Middleware | `06Code/backend/src/Middleware` | Protect routes by token and role. |
| Support | `06Code/backend/src/Support` | Infrastructure helpers for database connection and JSON/CORS responses. |
| Frontend pages | `06Code/frontend/*.html` | Static public and dashboard pages. |
| Frontend JS | `06Code/frontend/js` | API calls, session storage, dashboard modules, page controllers, validation, and formatting. |

## Notes

- `vendor/`, `.env`, `.env.local`, Composer PHAR files, and local tool caches are ignored by Git.
- There is no committed `composer.lock` at the moment, so backend dependency versions are not fully pinned.
- There is no active `netlify.toml` in `06Code/frontend`; dashboard deep-link rewrites must be configured in the hosting provider or added to the repo.
- Older `Model`, `View`, and `Controller` paths in PDFs, generated documents, or legacy folders should be read as historical references.
