# View Layer

This folder contains the functional view layer for **American Latin Class**.

The frontend is built with HTML, CSS, and vanilla JavaScript. It is organized as a modular website with separate pages for public visitors, enrollment, attendance check-in, login, and role dashboards.

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

## JavaScript Organization

The project does not use React, Vue, Angular, or another frontend framework. The script is still plain JavaScript, but it is divided into classes:

- `ApiClient`: backend HTTP requests.
- `SessionStore`: session storage.
- `BranchStore`: branch data and select options.
- `PublicPagesController`: public forms and kiosk behavior.
- `DashboardController`: dashboard modules, data loading, and form handling.
- `Dom` and `Formatters`: view helpers.

## Real Access Flow

The portal no longer includes shortcut buttons or frontend demo users. Login is validated by the PHP backend, which checks users stored in Supabase with hashed passwords and returns a signed token.

Academic test users:

```text
teacher@americanlatinclass.com / ALC2026*
student@americanlatinclass.com / ALC2026*
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

The backend URL is configured in `script/config.js` through `window.API_BASE_URL`.

The frontend does not write directly to Supabase. Public enrollment, comments, login, attendance check-in, class planning, attendance, finance, and event operations go through the backend.

## Deploy to Netlify

Current production deploy:

```text
https://american-latin-class-frontend.netlify.app
```

Netlify deploys from GitHub using:

```text
Base directory: 06Code/View
Build command: empty
Publish directory: .
```
