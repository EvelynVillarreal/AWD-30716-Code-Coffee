# Implemented Features Evidence

**Current baseline:** ALCSystem v2.0.18
**Last aligned:** May 26, 2026

This document confirms that the three selected project features are not only written as requirements. They are also implemented in the active MVC project folders.

Production frontend URL:

```text
https://american-latin-class-frontend.netlify.app
```

Connected Supabase project:

```text
https://luzlnnndzhpilgxacnim.supabase.co
```

Public backend review URL:

```text
https://american-latin-class.onrender.com
```

Backend health check:

```text
https://american-latin-class.onrender.com/api/health
```

## Feature 1: Public Landing and Enrollment

Implemented in:

- `../06Code/View/index.html`
- `../06Code/View/pricing.html`
- `../06Code/View/enrollment.html`
- `../06Code/View/script/app.js`
- `../06Code/View/css/styles.css`
- `../06Code/Controller/public/index.php`
- `../06Code/Controller/src/Controller/EnrollmentController.php`
- `../06Code/Model/Student.php`

Implemented behavior:

- Public home page for visitors with academy information.
- Dedicated pricing page with style cards, monthly prices, offer cards, and enrollment calls to action.
- Separate enrollment page and form for new students.
- Branch, B1/B2 level, scholarship percentage, and guardian data capture.
- Enrollment is sent to the PHP backend instead of writing directly to Supabase from the browser.
- Backend endpoint: `POST /api/enrollments`.

## Feature 2: Student, Scholarship, and Attendance Control

Implemented in:

- `../06Code/View/login.html`
- `../06Code/View/dashboard.html`
- `../06Code/View/script/app.js`
- `../06Code/Controller/public/index.php`
- `../06Code/Controller/src/Controller/AuthController.php`
- `../06Code/Controller/src/Controller/StudentController.php`
- `../06Code/Model/Student.php`
- `../06Code/Model/AttendanceRecord.php`
- `../06Code/Model/ClassPlan.php`

Implemented behavior:

- Single login page for teachers, students, and directors.
- Login is validated by the backend using stored users, hashed passwords, signed tokens, and role checks.
- Role-based dashboard modules after login.
- Signed-in user name, role, and avatar/profile image fallback in the dashboard header.
- Canonical dashboard routes for overview, students, teachers, payroll, planning, finance, events, schedule, attendance, and teacher work log.
- Student table with branch, B1/B2 level, scholarship percentage, and status.
- Student portal follow-up section with attendance, schedule, progress, events, and profile photo.
- Teacher monthly class planning form.
- Student and teacher attendance form.
- Student monthly attendance view.
- Teacher-controlled student attendance registration.
- Separate teacher attendance station for school-computer check-in.
- Attendance evidence code generation.
- Backend endpoints: `POST /api/auth/login`, `GET /api/me`, `GET /api/me/attendance`, `PATCH /api/me/photo`, `POST /api/teacher-attendance/check-in`, `GET/POST/PATCH/DELETE /api/students`, `GET/POST/PATCH/DELETE /api/teachers`, `GET/POST /api/class-plans`, and `GET/POST /api/attendance-records`.

## Feature 3: Branch Finance and Professional Dancer Agency

Implemented in:

- `../06Code/View/login.html`
- `../06Code/View/dashboard.html`
- `../06Code/View/script/app.js`
- `../06Code/Controller/public/index.php`
- `../06Code/Controller/src/Controller/FinanceController.php`
- `../06Code/Controller/src/Controller/ProfessionalEventController.php`
- `../06Code/Model/BranchFinanceReport.php`
- `../06Code/Model/ProfessionalEvent.php`
- `../06Code/Model/DancerEventAssignment.php`

Implemented behavior:

- Director dashboard with administrative modules separated from the public site.
- Branch income and expense registration.
- Matrix share percentage calculation.
- Main branch reserve update.
- B2 professional event registration.
- Dancer event history.
- Automatic gross amount, deductions, and net payment calculation.
- Backend endpoints: `GET /api/branch-finance-reports`, `POST /api/branch-finance-reports`, `GET /api/professional-events`, `POST /api/professional-events`, `POST /api/professional-events/{eventId}/assignments`, and `GET /api/dancer-settlements/{studentId}`.

## Backend Verification

The frontend is functional through the deployed backend. The public home, enrollment form, teacher attendance station, login, and role dashboards are separated into different pages so the system is modular. The frontend no longer stores role sessions through editable demo buttons or writes directly to Supabase.

The PHP backend is also configured and tested locally:

- Framework: Slim 4.
- ORM: Eloquent ORM.
- Database: Supabase PostgreSQL.
- CORS: official Netlify origin plus local development origins, with `GET`, `POST`, `PATCH`, `DELETE`, and `OPTIONS` support.
- Local route: `http://127.0.0.1:8080/api/health`.
- Public Render route: `https://american-latin-class.onrender.com/api/health`.
- Verification result: `database: connected`.
- Tested flow: enrollment, login, profile photo validation, class plan, attendance, professional event, B2 dancer assignment, finance report, and dancer settlement calculation.

The backend is deployed from GitHub with Render using the Dockerfile in `06Code`.
