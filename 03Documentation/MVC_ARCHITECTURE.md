# MVC Architecture

The current application is organized as a **static frontend plus PHP API backend**:

```text
06Code/backend
06Code/frontend
```

The physical folder names changed from the earlier `Model`, `View`, and `Controller` layout. The project still follows MVC-style separation through the backend namespaces and through the split between frontend views and backend API logic.

## Backend Layers

### Entry Point

```text
06Code/backend/public/index.php
```

This file loads Composer, the local bootstrap file, `.env`, timezone settings, Eloquent database bootstrapping, CORS handling, Slim middleware, and the route table.

### Routes and Composition

```text
06Code/backend/routes/api.php
```

This file creates service/controller instances, maps URLs to controller methods, and attaches `RoleMiddleware` to protected routes.

### Controllers

```text
06Code/backend/src/Controllers
```

Controllers coordinate HTTP requests and responses. They parse request data, call validation and services, use Eloquent models, and return JSON through `JsonResponder`.

Current controllers:

- `HomeController`
- `BranchController`
- `ReferenceDataController`
- `EnrollmentController`
- `AuthController`
- `KioskController`
- `TeacherAttendanceController`
- `StudentController`
- `TeacherController`
- `ClassPlanController`
- `AttendanceRecordController`
- `FinanceController`
- `ProfessionalEventController`
- `ProfilePhotoController`

### Models

```text
06Code/backend/src/Models
```

Models map Supabase PostgreSQL tables through Eloquent. They define table names, fillable fields, casts, and relationships.

Current model areas include branches, students, users, class plans, attendance records, finance reports, professional events, dancer assignments, dance styles, levels, and audit logs.

### Services

```text
06Code/backend/src/Services
```

Services contain reusable business and application rules:

- `AuthService` and `JwtTokenService`: login, public user payloads, token issue/verification.
- `BranchAccessService`: branch scoping for directors and teachers.
- `DateRangeService` and `MonthlyDateRange`: month validation and date windows.
- `AttendanceSummaryService`: attendance counters.
- `TeacherPayrollService`: teacher status and payment summary.
- `EvidenceCodeGenerator`: attendance evidence codes.
- `AuditLogger`: best-effort audit records for protected writes.
- `ValidationService`: backend validation for enrollment, students, teachers, attendance, class plans, finance, events, dancer assignments, and profile photos.

### Middleware

```text
06Code/backend/src/Middleware/RoleMiddleware.php
```

`RoleMiddleware` checks the Bearer token, validates the user role, and attaches an `AuthenticatedUser` value object to the request.

### Support

```text
06Code/backend/src/Support
```

- `DatabaseConnection`: configures Eloquent from environment variables.
- `JsonResponder`: returns JSON responses and CORS headers.

## Frontend View Layer

```text
06Code/frontend
```

The frontend is a static site with vanilla JavaScript classes.

| Class | Responsibility |
| --- | --- |
| `AmericanLatinApp` | Browser app bootstrap. |
| `AppConfig` | Frontend defaults, role labels, dashboard modules, routes, schedules, and sample upcoming events. |
| `ApiClient` | Fetch wrapper, auth headers, JSON parsing, error normalization, and session cleanup on `401`. |
| `SessionStore` | Session persistence in `sessionStorage`. |
| `BranchStore` | Loads branches, dance styles, and levels from the API with frontend fallbacks. |
| `PublicPagesController` | Enrollment, login, Google sign-in/enrollment flow, password toggles, and teacher kiosk. |
| `DashboardController` | Role dashboard shell, internal routing, data loading, rendering, and dashboard forms. |
| `Validators` | Frontend field validation. |
| `Dom` | DOM helpers and escaping. |
| `Formatters` | Display formatting for money, dates, digits, and percentages. |

## Implemented Role Flow

| Role | Main modules |
| --- | --- |
| Student | Overview, schedule, attendance, events, and profile photo update. |
| Teacher | Work summary, student attendance control, class planning, and work log. |
| Director | Overview, students, teachers, payroll, planning, finance, and B2 events. |

## Strengths

- Backend has clear controller/service/model separation.
- Role middleware centralizes access checks.
- The frontend avoids inline scripts and groups behavior into focused classes.
- Sensitive writes go through the PHP API instead of writing directly from the browser to Supabase.
- The schema and API include audit logs, teacher payroll support, branch scoping, and B2 event settlements.

## Current Architectural Gaps

- `ValidationService` is large and handles many unrelated request types; splitting it by domain would improve maintainability.
- `routes/api.php` manually instantiates every dependency; a small container or factory layer would reduce route-file growth.
- `frontend/js/app-config.js` defaults to `https://alc-api.onrender.com`, which does not match the documented backend URL `https://american-latin-class.onrender.com`.
- `GET /api/debug` is publicly registered; it should be protected or disabled in production.
- The repository has no active `netlify.toml`, so dashboard deep-link behavior depends on manual hosting configuration.
- There is no committed `composer.lock`, so production installs may drift across dependency versions.
