# HW08 - Front-End Frameworks

This assignment contains the functional frontend for **American Latin Class**.

The frontend is built with HTML, CSS, and JavaScript. It is organized as a modular website with separate pages for public visitors, enrollment, attendance check-in, login, and role dashboards.

## Included Pages

- `index.html`: public marketing home page for people interested in the dance academy.
- `enrollment.html`: public enrollment request form for new students.
- `attendance-kiosk.html`: student attendance check-in by national ID.
- `login.html`: one shared login for teachers, students, and directors.
- `dashboard.html`: role-based dashboard after login.

## Internal Modules

- Teacher dashboard: monthly class planning and manual attendance registration.
- Student dashboard: profile information and monthly attendance records.
- Director dashboard: students, attendance, branch finances, and B2 professional events.

## Real Access Flow

The portal no longer includes shortcut buttons or frontend demo users. Login is validated by the PHP backend, which checks users stored in Supabase with hashed passwords and returns a signed token.

Academic test users:

```text
profesor@americanlatinclass.com / ALC2026*
alumno@americanlatinclass.com / ALC2026*
director@americanlatinclass.com / ALC2026*
```

Attendance kiosk test:

```text
1723456789
```

## Backend Integration

The frontend calls the deployed PHP backend:

```text
https://american-latin-class.onrender.com
```

The frontend does not write directly to Supabase. Public enrollment, comments, login, attendance check-in, class planning, attendance, finance, and event operations go through the backend.

## Deploy to Netlify

Current production deploy:

```text
https://american-latin-class-frontend.netlify.app
```

Deployment command:

```powershell
npx netlify-cli deploy --prod --dir .
```
