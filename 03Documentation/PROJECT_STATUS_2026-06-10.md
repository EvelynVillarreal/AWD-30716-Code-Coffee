# Project Status Review - June 10, 2026

Project: **American Latin Class / ALCSystem**

This review was created after inspecting the current repository structure, backend routes, frontend JavaScript, database schema, deployment files, and existing documentation.

## Current State

The active project is understandable, but the documentation had fallen behind the code. The current program is not organized as `06Code/Model`, `06Code/View`, and `06Code/Controller`; it is now:

- `06Code/backend`: PHP Slim API with Eloquent ORM.
- `06Code/frontend`: static HTML/CSS/JavaScript frontend.

The backend has a reasonably clean MVC-style structure inside `backend/src`:

- `Controllers`: HTTP coordination.
- `Models`: Eloquent database mapping.
- `Services`: business rules, validation, auth, payroll, dates, audit, branch access.
- `Middleware`: role protection.
- `Support`: database and JSON/CORS helpers.

The frontend is also more organized than a quick academic prototype. It uses classes for config, API calls, session storage, public pages, dashboard modules, validation, DOM helpers, and formatting.

## What Is Working Well

- The project has a real backend API instead of direct browser writes to Supabase.
- Authentication and role access exist for students, teachers, and directors.
- Public enrollment, password login, Google login/enrollment, teacher check-in, student/teacher management, attendance, class planning, finance reports, and B2 event settlements are represented in code.
- Database schema and seed data are committed in `06Code/backend/database/schema.sql`.
- API routes are centralized in `06Code/backend/routes/api.php`.
- The frontend separates public pages from dashboard behavior.
- Backend response parsing in `ApiClient` catches HTML deployment errors and reports them clearly.
- Lightweight PHP checks exist under `06Code/backend/tests`.

## Main Problems Found

| Priority | Problem | Why It Matters |
| --- | --- | --- |
| High | Documentation pointed to old paths such as `06Code/Model`, `06Code/View`, and `06Code/Controller`. | New developers or reviewers would look in folders that no longer exist. |
| Resolved | `frontend/js/app-config.js` used to fall back to `https://alc-api.onrender.com`, while the documented backend is `https://american-latin-class.onrender.com`. | The fallback now points to the documented backend URL. |
| Resolved | `GET /api/debug` used to be publicly registered. | The route is now registered only when `APP_DEBUG=true`. |
| High | No `composer.lock` is committed. | Backend dependency versions can drift between machines and deployments. |
| Medium | `vendor/` is not installed in the current workspace, and `composer` is not in PATH. | Tests cannot run normally until dependencies are installed. |
| Resolved | No active `netlify.toml` existed in the current frontend folder. | `06Code/frontend/netlify.toml` now maps `/dashboard` and `/dashboard/*` to `dashboard.html`. |
| Medium | `ValidationService` handles many unrelated validations in one large class. | It will become harder to maintain as forms and rules grow. |
| Medium | `routes/api.php` manually creates every dependency. | Acceptable for the current size, but it will keep growing and become noisy. |
| Medium | Some production error responses expose detailed database errors. | Users should receive generic production messages while logs keep details. |
| Low | Some docs/PDFs remain historical and may still contain old folder names. | This is acceptable as evidence, but active Markdown should remain the source of truth. |

## Recommended Improvements

1. Install Composer dependencies and commit `composer.lock`.

   From `06Code/backend`, run `composer install`, verify the app, then commit the generated lock file.

2. Split validation by domain.

   Move validation from one `ValidationService` into smaller classes or grouped methods by module: enrollment, users, attendance, finance, events, profile photo.

3. Make production errors safer.

   Avoid returning raw database exception messages from public endpoints when `APP_DEBUG=false`.

4. Add focused automated tests.

   Keep the existing service checks, but add request-level tests for login, role middleware, branch scope, enrollment validation, and protected write actions.

5. Align deployment naming.

   `render.yaml`, `.env.example`, CORS defaults, frontend config, and documentation should all use the same frontend/backend service URLs.

## Verification Performed

The repository was inspected with file search and direct reads of:

- `README.md`
- `06Code/README.md`
- `06Code/backend/composer.json`
- `06Code/backend/routes/api.php`
- `06Code/backend/public/index.php`
- `06Code/backend/database/schema.sql`
- `06Code/backend/src/Controllers`
- `06Code/backend/src/Services`
- `06Code/frontend/js`
- deployment files in `06Code`
- documentation in `03Documentation`
- requirements and evidence files

Local environment findings:

- `C:\xampp\php\php.exe` exists and reports PHP 8.2.12.
- `php` is not available in the system PATH.
- `composer` is not available in the system PATH.
- `06Code/backend/vendor/autoload.php` does not exist.
- `06Code/backend/composer.lock` does not exist.

Checks run during this review:

- PHP syntax lint passed for 45 backend PHP files using `C:\xampp\php\php.exe -l`.
- Node syntax check passed for 11 frontend JavaScript files using `node --check`.
- `git diff --check` passed.
- `06Code/backend/tests/run.php` could not run because `vendor/autoload.php` is missing.

Because Composer dependencies are not installed, full backend tests cannot run through `composer run check` in the current workspace until dependencies are installed.

## Overall Assessment

The project is not a lost cause. It has a workable backend/frontend structure and real implemented features. The main issue is that the documentation and deployment assumptions drifted away from the code, which makes the system feel more confusing than it actually is.

The runtime configuration has been stabilized for the frontend API URL, debug route exposure, CORS defaults, Render values, and Netlify dashboard rewrites. The next highest-value step is to install dependencies, commit the lock file, split validation by domain, and broaden automated tests.
