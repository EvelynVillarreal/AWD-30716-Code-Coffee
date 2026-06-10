# Change Trace - June 10, 2026

Author/committer used for commits: **dxmar24**

This file explains the changes made to stabilize the project documentation, backend URI presentation, validation/security, comments, dependencies, and tests.

## Commit Summary

| Commit | Message | Purpose |
| --- | --- | --- |
| `d16f4fa` | `docs: update active project structure` | Replaced old `Model/View/Controller` folder references with the real `backend/frontend` structure. |
| `f4fc1ba` | `docs: align API route documentation` | Updated backend API and URI docs to match `routes/api.php`. |
| `cc16f13` | `docs: refresh setup and deployment guides` | Corrected Supabase, credential, Render, and setup paths. |
| `4263597` | `docs: align requirements and test evidence` | Updated academic requirement/evidence files with current paths. |
| `730b5e6` | `docs: add project status review` | Added a status review with risks and improvement recommendations. |
| `5a7639c` | `docs: add backend URI service flow` | Added URI-to-controller-to-service documentation and PDF for presentation. |
| `02824a5` | `fix: harden runtime configuration` | Protected debug route, aligned URLs/CORS, added Netlify rewrites, and made production auth errors safer. |
| `b68e728` | `refactor: split validation by domain` | Split the large validation class into smaller validators while keeping controller compatibility. |
| `5f8b92d` | `docs: comment backend flow functions` | Added explanatory docblocks to important backend functions. |
| `f34a702` | `build: pin backend dependencies` | Added `composer.lock` and verified backend dependency installation. |
| `d1cce79` | `test: cover validation and role middleware` | Added validation and role middleware tests. |

## 1. Active Structure Documentation

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `README.md` | 17-33 | Documents the active code as `06Code/backend` and `06Code/frontend`, with internal backend MVC-style folders. | The repo no longer has physical `06Code/Model`, `06Code/View`, and `06Code/Controller` folders. |
| `README.md` | 37-46 | Adds current deployment URLs and quick links to the updated technical docs. | Makes the root README useful as the first entry point. |
| `06Code/README.md` | 7-33 | Replaces the old MVC folder map with the real backend/frontend folder map. | Prevents reviewers from searching for non-existing folders. |
| `06Code/README.md` | 37-67 | Adds backend install/start commands and frontend runtime configuration notes. | Gives a local development path that matches the current code. |
| `03Documentation/PROJECT_STRUCTURE.md` | 7-15 | Defines canonical source locations. | Establishes `backend/frontend` as the source of truth. |
| `03Documentation/PROJECT_STRUCTURE.md` | 26-69 | Adds a complete tree of active code folders and deployment files. | Helps students/reviewers navigate the repository quickly. |
| `03Documentation/PROJECT_STRUCTURE.md` | 76-90 | Maps each area to its responsibility and notes lockfile/Netlify rewrite status. | Explains why each folder exists and what it owns. |
| `03Documentation/MVC_ARCHITECTURE.md` | 3-10 | Explains the app is a static frontend plus PHP API backend. | Clarifies that MVC is internal separation, not the old physical folder layout. |
| `03Documentation/MVC_ARCHITECTURE.md` | 17-96 | Documents backend entry point, routes, controllers, models, services, middleware, and support helpers. | Connects architecture vocabulary with real code paths. |
| `03Documentation/MVC_ARCHITECTURE.md` | 103-121 | Documents frontend JavaScript classes and their responsibilities. | Shows the frontend is also organized by responsibility. |

## 2. Backend URI and Service Flow Documentation

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 1-22 | Adds purpose and explains this document is for the backend URI presentation. | Gives the team a presentation-ready guide. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 24-46 | Explains the request flow: frontend/client -> URI -> route -> controller -> service -> model -> database -> JSON. | Clarifies how URIs connect to services. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 48-61 | Explains the project is not microservices; it is a modular REST API backend. | Avoids confusing internal services with separately deployed microservices. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 63-86 | Lists backend components and internal services. | Shows the small service units inside the backend. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 88-148 | Maps implemented URIs to controller methods, middleware, services, models/tables, and response purpose. | Gives the exact route-to-code explanation needed for the URI presentation. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 150-167 | Adds example flows for login, student attendance, teacher check-in, and B2 settlement. | Provides simple narratives for explaining complex flows out loud. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.pdf` | Generated from MD | Generated PDF version of the Markdown document. | Required for easier delivery/presentation. |
| `03Documentation/README.md` | 13-14 | Adds the new MD and PDF to the documentation index. | Makes the new presentation document easy to find. |

## 3. API and URI Route Documentation

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `03Documentation/BACKEND_API.md` | 3-18 | Reframes the guide around the current `06Code/backend` stack. | Removes old controller-folder assumptions. |
| `03Documentation/BACKEND_API.md` | 75-110 | Lists production routes and marks `/api/debug` as development-only. | Matches the current route table and security change. |
| `03Documentation/BACKEND_API.md` | 116-143 | Documents password auth and Bearer token usage. | Explains how protected URIs are accessed. |
| `03Documentation/BACKEND_API.md` | 147-157 | Documents Google sign-in/enrollment flow. | Explains new auth behavior used by the frontend. |
| `03Documentation/BACKEND_API.md` | 161-174 | Lists current database tables. | Connects URI behavior with storage. |
| `03Documentation/BACKEND_API.md` | 179-191 | Adds local check commands and `/api/debug` warning. | Helps developers verify the backend safely. |
| `03Documentation/URI_DESIGN_DOCUMENT_ALCSYSTEM.md` | 61-72 | Updates architecture context to backend/frontend. | Aligns academic URI document with the real structure. |
| `03Documentation/URI_DESIGN_DOCUMENT_ALCSYSTEM.md` | 80-85 | Explains production route count and debug-only route. | Prevents claiming `/api/debug` is public in production. |
| `03Documentation/URI_DESIGN_DOCUMENT_ALCSYSTEM.md` | 188-221 | Updates endpoint catalog with current routes including Google auth and reference data. | Matches `06Code/backend/routes/api.php`. |
| `03Documentation/URI_DESIGN_DOCUMENT_ALCSYSTEM.md` | 263-267 | Updates `/api/debug` detail. | Documents that debug is development-only. |
| `03Documentation/URI_DESIGN_DOCUMENT_ALCSYSTEM.md` | 985-993 | Updates limitations and conclusion. | Keeps final summary consistent with the secured debug route. |
| `03Documentation/PARAMETERIZED_URIS.md` | 1-38 | Replaces nonexistent `GET by ID` routes with actually implemented parameterized routes. | Avoids presenting endpoints that do not exist. |
| `03Documentation/PARAMETERIZED_URIS.md` | 40-59 | Adds example request/response shape. | Gives a concrete URI example for presentation. |

## 4. Setup, Credentials, and Deployment

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `03Documentation/SUPABASE_SETUP.md` | Updated throughout | Replaces old `06Code/Controller/...` schema path with `06Code/backend/database/schema.sql`. | The old path no longer exists. |
| `03Documentation/SUPABASE_SETUP.md` | Updated throughout | Removes references to missing `normalize_english_users.sql` and nonexistent RLS policies. | Prevents following impossible setup steps. |
| `03Documentation/CREDENTIALS_SETUP.md` | 98-113 | Adds `GOOGLE_CLIENT_ID` and documents the frontend API base URL fallback. | Supports Google auth and aligned backend URL. |
| `03Documentation/RENDER_DEPLOYMENT.md` | 48-75 | Aligns Render environment variables and frontend API URL. | Keeps deployment config consistent with the backend/frontend URLs. |
| `03Documentation/RENDER_DEPLOYMENT.md` | 82-87 | Documents the active `06Code/frontend/netlify.toml` rewrite file. | Explains how dashboard deep links work on Netlify. |
| `06Code/backend/.env.example` | 5 | Changes `FRONTEND_ORIGINS` to the Netlify frontend and local dev origins. | CORS defaults now match documented deployment. |
| `06Code/docker-entrypoint.sh` | 10 | Changes default `FRONTEND_ORIGINS` to Netlify. | Container defaults now match production docs. |
| `06Code/render.yaml` | 25-26 | Sets `FRONTEND_ORIGINS` to Netlify frontend URL. | Render backend CORS config matches actual frontend. |
| `06Code/render.yaml` | 57-58 | Sets frontend API value to `https://american-latin-class.onrender.com`. | Avoids using old Render service naming. |
| `06Code/frontend/js/app-config.js` | 3 | Changes fallback API URL to `https://american-latin-class.onrender.com`. | Frontend no longer falls back to the wrong backend. |
| `06Code/frontend/netlify.toml` | 1-8 | Adds `/dashboard` and `/dashboard/*` rewrites to `dashboard.html`. | Dashboard deep links now work on Netlify. |

## 5. Security and Runtime Hardening

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `06Code/backend/routes/api.php` | 59-60 | Registers `/api/debug` only when `APP_DEBUG=true`. | Prevents exposing diagnostic environment information in production. |
| `06Code/backend/src/Controllers/AuthController.php` | 55 | Uses generic login service error in production. | Avoids exposing raw database exception messages. |
| `06Code/backend/src/Controllers/AuthController.php` | 127, 246 | Uses shared safe error message helper for Google auth/enrollment failures. | Keeps production errors generic. |
| `06Code/backend/src/Controllers/AuthController.php` | 317-321 | Adds `serverErrorMessage()` helper that reveals details only when `APP_DEBUG=true`. | Centralizes debug-vs-production error behavior. |
| `06Code/backend/src/Support/JsonResponder.php` | 23-31 | Uses configured `FRONTEND_ORIGINS` with Netlify/local defaults. | Limits cross-origin access to known frontend origins. |
| `03Documentation/PROJECT_STATUS_2026-06-10.md` | 40-47 | Marks URL fallback, debug route, lockfile, Netlify rewrite, validation split, and auth error detail as resolved. | Keeps the project health report current. |

## 6. Validation Refactor

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `06Code/backend/src/Services/ValidationService.php` | 16-38 | Converts `ValidationService` into a facade that creates focused validator services. | Controllers keep the same dependency while validation is split internally. |
| `06Code/backend/src/Services/ValidationService.php` | 41-109 | Delegates each validation method to the correct domain validator. | Demonstrates service-to-service delegation without changing controller code. |
| `06Code/backend/src/Services/Validation/EcuadorianIdValidator.php` | 6-34 | Adds dedicated Ecuadorian ID validator. | Keeps the cedula algorithm isolated and reusable. |
| `06Code/backend/src/Services/Validation/FieldValidator.php` | 6-211 | Adds reusable helpers for names, emails, phones, IDs, dates, months, times, numbers, options, text, and URLs. | Removes repeated validation logic and strengthens date/URL/number checks. |
| `06Code/backend/src/Services/Validation/StudentValidator.php` | 6-80 | Adds enrollment and director-managed student validation. | Separates student rules from other modules. |
| `06Code/backend/src/Services/Validation/TeacherAccountValidator.php` | 6-35 | Adds teacher account validation. | Keeps password-required-on-create behavior explicit. |
| `06Code/backend/src/Services/Validation/AttendanceValidator.php` | 6-95 | Adds manual attendance, teacher kiosk, and student kiosk validation. | Strengthens attendance date, time, duration, style, and ID checks. |
| `06Code/backend/src/Services/Validation/PlanningValidator.php` | 6-38 | Adds class plan validation. | Validates real months, HTTP/HTTPS document URLs, and text lengths. |
| `06Code/backend/src/Services/Validation/FinanceValidator.php` | 6-29 | Adds finance report validation. | Validates real months and numeric ranges before calculations. |
| `06Code/backend/src/Services/Validation/EventValidator.php` | 6-69 | Adds professional event and dancer assignment validation. | Validates real dates, event statuses, numeric payment values, and deduction limits. |
| `06Code/backend/src/Services/Validation/ProfilePhotoValidator.php` | 6-43 | Adds profile photo data URI and remote image URL validation. | Keeps image safety rules separate from other validation domains. |
| `03Documentation/MVC_ARCHITECTURE.md` | 80-81 | Documents `ValidationService` as a facade and `Services/Validation/*` as focused validators. | Architecture docs now match the refactor. |
| `03Documentation/BACKEND_URI_SERVICE_FLOW.md` | 83-84 | Updates internal services table with validation facade and domain validators. | URI/service presentation now shows internal service delegation. |

## 7. Backend Function Comments

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `06Code/backend/src/Controllers/AuthController.php` | 31, 74, 131, 167, 250, 280, 316 | Adds comments for login, Google login/register/enroll, `/api/me`, Google token verification, and production-safe errors. | Helps explain authentication flow during review. |
| `06Code/backend/src/Controllers/StudentController.php` | 33, 59, 93, 133, 156, 184, 202 | Adds comments for list/create/update/deactivate/attendance/normalization/duplicate checks. | Clarifies student management behavior. |
| `06Code/backend/src/Controllers/AttendanceRecordController.php` | 35, 77 | Adds comments for monthly attendance listing/payroll and manual attendance creation. | Explains how attendance and payroll connect. |
| `06Code/backend/src/Controllers/ProfessionalEventController.php` | 30, 41, 76, 116, 143 | Adds comments for event list/create, dancer assignment, settlement, and scoped event lookup. | Clarifies B2 event workflow. |
| `06Code/backend/src/Controllers/FinanceController.php` | 27, 38 | Adds comments for finance list/create. | Explains matrix share/net result calculation entry point. |
| `06Code/backend/src/Controllers/ClassPlanController.php` | 27, 51 | Adds comments for class plan list/create. | Clarifies teacher/director planning flow. |
| `06Code/backend/src/Controllers/TeacherController.php` | 27, 36, 75, 120, 141 | Adds comments for teacher list/create/update/deactivate/normalization. | Clarifies account lifecycle decisions. |
| `06Code/backend/src/Controllers/EnrollmentController.php` | 21, 57, 74 | Adds comments for public enrollment, sanitization, and duplicate checks. | Explains public form handling. |
| `06Code/backend/src/Controllers/KioskController.php` | 24 | Adds comment for legacy student kiosk attendance. | Marks it as duplicate-protected legacy flow. |
| `06Code/backend/src/Controllers/TeacherAttendanceController.php` | 28 | Adds comment for teacher station check-in. | Explains late/present status calculation. |
| `06Code/backend/src/Controllers/HomeController.php` | 19, 35, 46 | Adds comments for metadata, health, and debug. | Explains operational endpoints. |
| `06Code/backend/src/Controllers/ProfilePhotoController.php` | 23 | Adds comment for profile/avatar update. | Explains why both student and user records are updated. |
| `06Code/backend/src/Controllers/BranchController.php` | 18 | Adds comment for branch fallback behavior. | Explains offline/demo fallback data. |
| `06Code/backend/src/Controllers/ReferenceDataController.php` | 20, 43, 60 | Adds comments for styles, levels, and branch reference helper. | Clarifies reference-data endpoints. |
| `06Code/backend/src/Services/AuthService.php` | 16, 36, 42, 54, 70 | Adds comments for credential verification, token issuing, Bearer extraction, public user payload, and old seed hash support. | Helps explain authentication internals. |
| `06Code/backend/src/Services/BranchAccessService.php` | 10, 16, 28, 37 | Adds comments for matrix director, branch read access, query scoping, and writable branch resolution. | Clarifies branch security. |
| `06Code/backend/src/Services/TeacherPayrollService.php` | 14, 25 | Adds comments for late status and payroll summary. | Explains payroll logic. |
| `06Code/backend/src/Services/AuditLogger.php` | 11 | Adds comment explaining audit logging is best-effort. | Shows audit failures should not block user workflows. |
| `06Code/backend/src/Middleware/RoleMiddleware.php` | 22 | Adds comment for token/role verification. | Clarifies protected URI behavior. |
| `06Code/backend/src/Support/DatabaseConnection.php` | 10 | Adds comment for Eloquent/Supabase bootstrapping. | Explains infrastructure setup. |
| `06Code/backend/src/Support/JsonResponder.php` | 10, 20 | Adds comments for JSON response and CORS policy. | Clarifies shared response behavior. |

## 8. Dependency Lockfile

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `06Code/backend/composer.lock` | 1-2525 | Generated by Composer after resolving backend dependencies. | Pins exact dependency versions for reproducible installs. |
| `03Documentation/MVC_ARCHITECTURE.md` | 142 | Notes that `composer.lock` is committed. | Removes old dependency drift warning. |
| `03Documentation/PROJECT_STRUCTURE.md` | 89 | Notes that `composer.lock` pins backend dependencies. | Keeps structure documentation current. |
| `03Documentation/PROJECT_STATUS_2026-06-10.md` | 42-43, 78-87 | Marks lockfile/dependency installation as resolved and records test results. | Updates project health evidence. |

Note: `composer.lock` is generated, not manually edited line by line. The important manual decision was to commit it so future installs use the same dependency versions.

## 9. Added Tests

| File | Lines | What changed | Why |
| --- | ---: | --- | --- |
| `06Code/backend/tests/run.php` | 117-123 | Adds class plan tests for invalid month and non-HTTP URL. | Verifies stronger planning validation. |
| `06Code/backend/tests/run.php` | 125-132 | Adds teacher kiosk style and student kiosk ID validation tests. | Verifies attendance/kiosk validation hardening. |
| `06Code/backend/tests/run.php` | 134-140 | Adds finance validation tests for invalid month, non-numeric income, and matrix share over 100. | Verifies finance calculations receive safe numeric input. |
| `06Code/backend/tests/run.php` | 142-153 | Adds professional event and dancer assignment validation tests. | Verifies event dates/statuses and payment deduction rules. |
| `06Code/backend/tests/run.php` | 194-217 | Adds role middleware tests for missing token, wrong role, and valid director token. | Verifies protected URI access behavior. |
| `03Documentation/PROJECT_STATUS_2026-06-10.md` | 83-87 | Updates verification results to 54 PHP files linted and 43 assertions passed. | Records objective test evidence. |

## 10. Verification Performed

| Command | Result | Purpose |
| --- | --- | --- |
| `C:\xampp\php\php.exe tests\lint.php` from `06Code/backend` | Passed | Validates PHP syntax for backend files. |
| `C:\xampp\php\php.exe tests\run.php` from `06Code/backend` | Passed: 43 assertions | Validates services, validation rules, JWT, CORS, and role middleware. |
| `node --check` on frontend JS files | Passed earlier during config work | Validates frontend JavaScript syntax. |
| `git diff --check` | Passed before commits | Checks for whitespace errors in diffs. |

## 11. Push History

Each block was committed and pushed separately, as requested:

| Order | Commit | Pushed? |
| ---: | --- | --- |
| 1 | `5a7639c docs: add backend URI service flow` | Yes |
| 2 | `02824a5 fix: harden runtime configuration` | Yes |
| 3 | `b68e728 refactor: split validation by domain` | Yes |
| 4 | `5f8b92d docs: comment backend flow functions` | Yes |
| 5 | `f34a702 build: pin backend dependencies` | Yes |
| 6 | `d1cce79 test: cover validation and role middleware` | Yes |

The earlier documentation cleanup commits were also pushed before these improvement blocks.
