# American Latin Class - Evidence Package

Evidence generated on May 3, 2026.

## Published Links

Frontend deployed in Netlify:

```text
https://american-latin-class-frontend.netlify.app
```

Supabase project:

```text
https://luzlnnndzhpilgxacnim.supabase.co
```

Backend local verification:

```text
http://127.0.0.1:8080/api/health
```

Backend deployed on Render:

```text
https://american-latin-class.onrender.com
```

Render health check:

```text
https://american-latin-class.onrender.com/api/health
```

## Screenshots

- `screenshots/frontend-netlify.png`: deployed frontend home page on Netlify.
- `screenshots/frontend-netlify-home.png`: public home page with academy information.
- `screenshots/frontend-netlify-enrollment.png`: public enrollment form.
- `screenshots/frontend-netlify-attendance-kiosk.png`: historical attendance kiosk evidence from the earlier self-check-in flow.
- `screenshots/frontend-netlify-login.png`: single shared login for teachers, students, and directors.
- `screenshots/frontend-netlify-dashboard-director.png`: director dashboard with finance module.
- `screenshots/frontend-netlify-dashboard-student-attendance.png`: student monthly attendance view.
- `screenshots/frontend-local-home.png`: local frontend home verification.
- `screenshots/frontend-local-enrollment.png`: local enrollment verification.
- `screenshots/frontend-local-login.png`: local login verification.
- `screenshots/frontend-local-attendance-kiosk.png`: historical local attendance kiosk verification.
- `screenshots/frontend-local-dashboard-director.png`: local dashboard verification.
- `screenshots/frontend-local-dashboard-student-attendance.png`: local student attendance verification.
- `screenshots/backend-local-root.png`: backend API root information.
- `screenshots/backend-local-health.png`: backend health endpoint connected to Supabase.
- `screenshots/backend-local-branches.png`: backend branch list from Supabase.
- `screenshots/backend-legacy-root.png`: archived backend API root information from the retired deployment.
- `screenshots/backend-legacy-health.png`: archived backend health endpoint connected to Supabase.
- `screenshots/backend-legacy-branches.png`: archived backend branch list from Supabase.
- `screenshots/use-case-diagram.png`: rendered use case diagram.
- `screenshots/class-diagram.png`: rendered class diagram.

## API Response Evidence

- `api-responses/frontend-netlify-check.json`: HTTP 200 check for Netlify home, pricing, enrollment, attendance kiosk, login, and dashboard pages.
- `api-responses/backend-local-root.json`: backend root JSON response.
- `api-responses/backend-local-health.json`: backend health JSON response.
- `api-responses/backend-local-branches.json`: backend branch list from Supabase.
- `api-responses/backend-legacy-root.json`: archived deployed backend root JSON response.
- `api-responses/backend-legacy-health.json`: archived deployed backend health JSON response.
- `api-responses/backend-legacy-branches.json`: archived deployed backend branch list from Supabase.
- `api-responses/backend-legacy-protected-students.json`: proof that student list requires authentication.
- `api-responses/backend-legacy-login-check.json`: sanitized login verification without storing the token.
- `api-responses/backend-legacy-student-attendance.json`: monthly attendance verification for the student dashboard.
- `api-responses/backend-legacy-kiosk-attendance.json`: historical attendance kiosk verification by national ID.
- `api-responses/supabase-branches-check.json`: direct Supabase REST check.

## Jira Evidence

Jira site:

```text
https://damalx.atlassian.net
```

Jira project:

```text
SCRUM - American Latin Class
```

Created issues are documented in:

```text
../../02Requirements/jira/created-jira-issues.md
```

Summary:

- 3 epics/features created.
- 9 implementation tasks created.
- Each feature has 3 tasks.

## Render Deployment

The current backend is deployed to Render from GitHub using `06Code/Dockerfile`.

```text
https://american-latin-class.onrender.com/api/health
```

## Archived Backend Deployment Evidence

The earlier backend deployment was published from the local `06Code` folder.
It is preserved only as historical evidence. The active production backend is
the Render service documented in `../RENDER_DEPLOYMENT.md`.

## Backend Verification Result

The backend was tested locally and on the deployed backend with:

```text
GET /api/health
```

Result:

```json
{
  "status": "ok",
  "database": "connected",
  "project": "American Latin Class"
}
```

The backend also returned 5 Supabase branches through:

```text
GET /api/branches
```

Additional protected-flow checks:

- `GET /api/students` without token returns `401`.
- `POST /api/auth/login` authenticates the student account through the backend.
- `GET /api/me/attendance` returns the student's monthly attendance.
- `POST /api/kiosk/attendance` is historical evidence from the earlier student self-check-in flow.
