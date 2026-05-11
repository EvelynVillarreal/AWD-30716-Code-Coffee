# American Latin Class - Evidence Package

Evidence generated on May 3, 2026.

## Published Links

Frontend deployed in Netlify:

```text
https://creative-pothos-6c7a4c.netlify.app
```

Supabase project:

```text
https://luzlnnndzhpilgxacnim.supabase.co
```

Backend local verification:

```text
http://127.0.0.1:8080/api/health
```

Backend deployed on Railway:

```text
https://american-latin-class-backend-production.up.railway.app
```

Railway health check:

```text
https://american-latin-class-backend-production.up.railway.app/api/health
```

## Screenshots

- `screenshots/frontend-netlify.png`: deployed frontend home page on Netlify.
- `screenshots/frontend-netlify-home.png`: public home page with academy information.
- `screenshots/frontend-netlify-enrollment.png`: public enrollment form.
- `screenshots/frontend-netlify-attendance-kiosk.png`: student attendance kiosk by national ID.
- `screenshots/frontend-netlify-login.png`: single shared login for teachers, students, and directors.
- `screenshots/frontend-netlify-dashboard-director.png`: director dashboard with finance module.
- `screenshots/frontend-netlify-dashboard-student-attendance.png`: student monthly attendance view.
- `screenshots/frontend-local-home.png`: local frontend home verification.
- `screenshots/frontend-local-enrollment.png`: local enrollment verification.
- `screenshots/frontend-local-login.png`: local login verification.
- `screenshots/frontend-local-attendance-kiosk.png`: local attendance kiosk verification.
- `screenshots/frontend-local-dashboard-director.png`: local dashboard verification.
- `screenshots/frontend-local-dashboard-student-attendance.png`: local student attendance verification.
- `screenshots/backend-local-root.png`: backend API root information.
- `screenshots/backend-local-health.png`: backend health endpoint connected to Supabase.
- `screenshots/backend-local-branches.png`: backend branch list from Supabase.
- `screenshots/backend-railway-root.png`: Railway backend API root information.
- `screenshots/backend-railway-health.png`: Railway backend health endpoint connected to Supabase.
- `screenshots/backend-railway-branches.png`: Railway backend branch list from Supabase.
- `screenshots/use-case-diagram.png`: rendered use case diagram.
- `screenshots/class-diagram.png`: rendered class diagram.

## API Response Evidence

- `api-responses/frontend-netlify-check.json`: HTTP 200 check for Netlify home, enrollment, attendance kiosk, login, and dashboard pages.
- `api-responses/backend-local-root.json`: backend root JSON response.
- `api-responses/backend-local-health.json`: backend health JSON response.
- `api-responses/backend-local-branches.json`: backend branch list from Supabase.
- `api-responses/backend-railway-root.json`: Railway backend root JSON response.
- `api-responses/backend-railway-health.json`: Railway backend health JSON response.
- `api-responses/backend-railway-branches.json`: Railway backend branch list from Supabase.
- `api-responses/backend-railway-protected-students.json`: proof that student list requires authentication.
- `api-responses/backend-railway-login-check.json`: sanitized login verification without storing the token.
- `api-responses/backend-railway-student-attendance.json`: monthly attendance verification for the student dashboard.
- `api-responses/backend-railway-kiosk-attendance.json`: attendance kiosk verification by national ID.
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

## Railway Deployment

The backend was deployed to Railway from the local `06Code` folder with:

```text
railway up
```

No Git repository was used for this deployment.

## Backend Verification Result

The backend was tested locally and on Railway with:

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
- `POST /api/kiosk/attendance` registers or detects the student's daily check-in by national ID.
