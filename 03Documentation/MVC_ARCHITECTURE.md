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

Controller responsibility boundaries:

- Read route arguments, query parameters, and parsed body data.
- Normalize request data only when it is specific to that request.
- Delegate reusable validation to a validator class.
- Delegate business decisions to a service class.
- Return a consistent JSON response through `JsonResponder`.

```text
06Code/Model
```

Eloquent ORM models for Supabase PostgreSQL tables. Models keep table names and relationships only, so they stay focused on the data layer.

Model responsibility boundaries:

- Define table names, fillable fields, casts, and relationships.
- Avoid HTTP request handling.
- Avoid direct validation workflows.
- Avoid role or session logic.

```text
06Code/Controller/src/Service
```

Object-oriented application services. They handle authentication, JWT tokens, branch permissions, monthly date ranges, attendance summaries, audit logging, evidence code generation, and other reusable rules.

Service responsibility boundaries:

- Encapsulate business rules that are reused by controllers.
- Keep calculations, access decisions, and summaries outside HTTP controllers.
- Provide focused methods with stable inputs and outputs.

```text
06Code/Controller/src/Service/Validation
```

Validation classes for enrollment, attendance, class plans, finance reports, professional events, and dancer assignments.

Validator responsibility boundaries:

- Validate a single request concept.
- Return field-level error messages.
- Avoid database writes.
- Avoid response rendering.

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

The frontend keeps page behavior in classes instead of large inline scripts. This keeps Netlify deployment simple while still preserving object-oriented separation:

| Class | Responsibility |
| --- | --- |
| `ApiClient` | HTTP calls, headers, JSON parsing, and backend error normalization. |
| `SessionStore` | Session persistence and cleanup. |
| `BranchStore` | Branch loading and branch labels. |
| `PublicPagesController` | Public forms and page-specific public interactions. |
| `DashboardController` | Dashboard routing, role modules, and dashboard forms. |
| `Dom` | Safe DOM text, values, and HTML escaping helpers. |
| `Formatters` | Display-only formatting for money, dates, and percentages. |

## Improvements Included

- `APP_KEY` is required for token signing.
- Controllers use constructor injection instead of static helper calls.
- Validation moved out of Eloquent models and into dedicated validation classes.
- Models are focused on table mapping and relationships.
- Branch directors are scoped to their own branch; the matrix director uses branch `1`.
- Protected write actions create audit log records when the `audit_logs` table exists.
- The kiosk has a database uniqueness rule for one kiosk check-in per student per day.
- Lightweight automated checks are available in `tests`.

## SOLID Alignment

| Principle | Current application |
| --- | --- |
| Single Responsibility | Validators validate, controllers coordinate HTTP, models map data, and services hold reusable rules. |
| Open/Closed | New validators or services can be added without changing unrelated controllers. |
| Liskov Substitution | Shared abstractions are kept minimal; models extend Eloquent consistently. |
| Interface Segregation | Classes receive only the collaborators they use through constructors. |
| Dependency Inversion | Controllers depend on service objects instead of creating business logic inline. |
