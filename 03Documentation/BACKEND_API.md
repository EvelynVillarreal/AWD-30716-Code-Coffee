# Backend API

This guide documents the current **American Latin Class** backend implemented in:

```text
06Code/backend
```

## Stack

- PHP 8.2
- Slim 4
- Eloquent ORM (`illuminate/database`)
- Supabase PostgreSQL
- JWT-style signed tokens created by `JwtTokenService`
- Role middleware for `student`, `teacher`, and `director`

## Setup

1. Enable PostgreSQL support in the PHP runtime:

```ini
extension=pdo_pgsql
extension=pgsql
```

2. Install dependencies from `06Code/backend`:

```powershell
composer install
```

If Composer is not installed globally, install Composer first or use a local `composer.phar` with XAMPP PHP.

3. Copy the environment template:

```powershell
Copy-Item .env.example .env
```

4. Generate an application key:

```powershell
C:\xampp\php\php.exe -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
```

Copy the generated value into `APP_KEY`.

5. Configure Supabase PostgreSQL credentials in `.env`.

6. Run `database/schema.sql` in Supabase SQL Editor.

7. Start the API:

```powershell
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t public
```

## Public Backend URL

Production backend:

```text
https://american-latin-class.onrender.com
```

Health check:

```text
https://american-latin-class.onrender.com/api/health
```

## Implemented Endpoints

The implemented route table is `06Code/backend/routes/api.php`. In production it registers **33 route entries**: one root route and 32 `/api` routes. When `APP_DEBUG=true`, it also registers the diagnostic route `GET /api/debug`. The table below lists the production routes and the conditional debug route so reviewers can see the complete URI contract.

| Method | Endpoint | Auth | Purpose |
| --- | --- | --- | --- |
| GET | `/` | Public | Backend metadata and endpoint summary. |
| GET | `/api/health` | Public | API/database health check. |
| GET | `/api/debug` | Development diagnostic | Environment and database diagnostic status. Only registered when `APP_DEBUG=true`. |
| GET | `/api/branches` | Public | List academy branches. |
| GET | `/api/styles` | Public | List dance styles. |
| GET | `/api/levels` | Public | List student levels. |
| POST | `/api/enrollments` | Public | Create a pending enrollment request. |
| POST | `/api/auth/login` | Public | Login with email, password, and role. |
| POST | `/api/auth/google` | Public | Login or detect registration need using Google ID token. |
| POST | `/api/auth/google/register` | Public | Create a student user from Google token only. Present in backend, not the main frontend flow. |
| POST | `/api/auth/google/enroll` | Public | Complete Google-backed enrollment and create active student/user. |
| POST | `/api/kiosk/attendance` | Public station | Register legacy student kiosk attendance by national ID. |
| POST | `/api/teacher-attendance/check-in` | Public station | Register teacher check-in and evidence code. |
| GET | `/api/me` | Token: student, teacher, director | Current user profile; students also receive student and attendance summary data. |
| GET | `/api/me/attendance` | Token: student | Current student's monthly attendance. |
| PATCH | `/api/me/photo` | Token: student | Update current student's profile photo. |
| GET | `/api/students` | Token: director | List students. |
| POST | `/api/students` | Token: director | Create student. |
| PATCH | `/api/students/{studentId}` | Token: director | Update student. |
| DELETE | `/api/students/{studentId}` | Token: director | Deactivate student. |
| GET | `/api/teachers` | Token: director | List teachers. |
| POST | `/api/teachers` | Token: director | Create teacher account. |
| PATCH | `/api/teachers/{teacherId}` | Token: director | Update teacher account. |
| DELETE | `/api/teachers/{teacherId}` | Token: director | Deactivate teacher account. |
| GET | `/api/class-plans` | Token: teacher, director | List class plans. |
| POST | `/api/class-plans` | Token: teacher, director | Submit class plan. |
| GET | `/api/attendance-records` | Token: teacher, director | List attendance records and teacher payroll summary. |
| POST | `/api/attendance-records` | Token: teacher, director | Create manual attendance record. |
| GET | `/api/branch-finance-reports` | Token: director | List branch finance reports. |
| POST | `/api/branch-finance-reports` | Token: director | Create branch finance report and calculated totals. |
| GET | `/api/professional-events` | Token: director | List professional B2 events. |
| POST | `/api/professional-events` | Token: director | Create professional event. |
| POST | `/api/professional-events/{eventId}/assignments` | Token: director | Assign B2 dancer to event. |
| GET | `/api/dancer-settlements/{studentId}` | Token: director | Calculate dancer settlement summary. |

## Authentication

`POST /api/auth/login` requires:

```json
{
  "email": "director@americanlatinclass.com",
  "password": "ALC2026*",
  "role": "director"
}
```

The backend returns:

```json
{
  "token": "signed-token",
  "user": {
    "id": 1,
    "email": "director@americanlatinclass.com",
    "role": "director",
    "name": "Juan Pablo Hidalgo",
    "branch_id": 1
  }
}
```

Protected requests must include:

```http
Authorization: Bearer <token>
```

## Google Sign-In Flow

The frontend uses `PublicPagesController` for Google sign-in:

1. `POST /api/auth/google` validates a Google ID token.
2. If the email belongs to an active user, the backend returns a session token.
3. If the email belongs to an active student but no user exists, the backend creates a student user.
4. If the email is unknown, the frontend redirects to `enrollment.html?google=1...`.
5. `POST /api/auth/google/enroll` creates an active student and user after the remaining enrollment fields are completed. The backend uses the verified Google token email as the account email.

`GOOGLE_CLIENT_ID` must be configured in the backend environment and exposed to the frontend through `window.GOOGLE_CLIENT_ID`.

## Database Tables

The current `schema.sql` creates:

- `branches`
- `students`
- `users`
- `class_plans`
- `attendance_records`
- `branch_finance_reports`
- `professional_events`
- `dancer_event_assignments`
- `audit_logs`
- `dance_styles`
- `levels`

It also inserts initial branches, levels, styles, and test users.

## Local Checks

From `06Code/backend`, after dependencies are installed:

```powershell
composer run lint
composer run test
composer run check
```

Current environment note from the June 13, 2026 review: this workstation has XAMPP PHP at `C:\xampp\php\php.exe`. `php` and `composer` are not in PATH, but `06Code/backend/vendor/autoload.php` exists locally and tests can be run with XAMPP PHP.

## Known API Risks

- `/api/debug` is now registered only when `APP_DEBUG=true`; keep `APP_DEBUG=false` in production.
- Google token verification uses Google's `tokeninfo` endpoint directly inside the controller; moving it to a service would make testing and error handling cleaner.
- The route file instantiates all dependencies manually. This is acceptable for a small academic project but will grow harder to maintain.
