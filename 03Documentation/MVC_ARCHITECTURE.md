# MVC Architecture

The active code in `06Code` is organized with literal MVC folders in English:

```text
06Code/Model
06Code/View
06Code/Controller
```

## Backend Layers

```text
public/index.php
```

Application bootstrap. It loads Composer, `.env`, database configuration, middleware, routes, and runs Slim.

```text
routes/api.php
```

The route table. It maps each URL to a controller method and applies role middleware.

```text
06Code/Controller/src/Controller
```

Controllers receive HTTP requests, call models/services, and return JSON responses.

```text
06Code/Model
```

Eloquent ORM models for Supabase PostgreSQL tables.

```text
06Code/Controller/src/Service
```

Reusable domain logic such as branch permissions, monthly date ranges, and attendance summaries.

```text
06Code/Controller/src/Middleware
```

Authentication and role checks before protected routes.

```text
06Code/Controller/src/Support
```

Infrastructure helpers for responses, database bootstrapping, JWT auth, and audit logging.

## Improvements Included

- `APP_KEY` is required for token signing.
- Enrollment stores comments and rejects duplicates by national ID, email, or phone.
- Branch directors are scoped to their own branch; the matrix director uses branch `1`.
- Protected write actions create audit log records when the `audit_logs` table exists.
- Lightweight automated checks are available in `tests`.
