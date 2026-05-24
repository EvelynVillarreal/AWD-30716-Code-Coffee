# MVC Architecture

The active code in `06Code` is organized with literal MVC folders in English. The project keeps the deployed backend and frontend entry points, but the internal code is now divided by responsibility:

```text
06Code/Model
06Code/View
06Code/Controller
```

## Backend MVC Layers

```text
public/index.php
```

Application entry point. It loads Composer, `.env`, database configuration, CORS handling, routes, and then runs Slim.

```text
routes/api.php
```

The composition root and route table. It creates the controller and service objects, maps each URL to a controller method, and applies role middleware.

```text
06Code/Controller/src/Controller
```

Controllers receive HTTP requests, delegate validation and business decisions to services, and return JSON responses. They do not contain database configuration, token logic, or reusable validation rules.

```text
06Code/Model
```

Eloquent ORM models for Supabase PostgreSQL tables. Models keep table names and relationships only, so they stay focused on the data layer.

```text
06Code/Controller/src/Service
```

Object-oriented application services. They handle authentication, JWT tokens, branch permissions, monthly date ranges, attendance summaries, audit logging, evidence code generation, and other reusable rules.

```text
06Code/Controller/src/Service/Validation
```

Validation classes for enrollment, attendance, class plans, finance reports, professional events, and dancer assignments.

```text
06Code/Controller/src/Middleware
```

Authentication and role checks before protected routes. The middleware attaches an `AuthenticatedUser` value object to the request.

```text
06Code/Controller/src/Support
```

Infrastructure classes for JSON responses, CORS headers, and Eloquent database bootstrapping.

## Frontend View Layer

```text
06Code/View
```

Static HTML pages, CSS, and JavaScript. The frontend still uses vanilla JavaScript for Netlify compatibility, but the script is organized into classes:

- `ApiClient`: calls the deployed backend configured in `View/script/config.js`.
- `SessionStore`: owns browser session persistence.
- `BranchStore`: loads and exposes branch names.
- `PublicPagesController`: enrollment, login, and kiosk pages.
- `DashboardController`: role dashboards and dashboard forms.
- `Dom` and `Formatters`: small utility classes for display concerns.

## Improvements Included

- `APP_KEY` is required for token signing.
- Controllers use constructor injection instead of static helper calls.
- Validation moved out of Eloquent models and into dedicated validation classes.
- Models are focused on table mapping and relationships.
- Branch directors are scoped to their own branch; the matrix director uses branch `1`.
- Protected write actions create audit log records when the `audit_logs` table exists.
- The kiosk has a database uniqueness rule for one kiosk check-in per student per day.
- Lightweight automated checks are available in `tests`.
