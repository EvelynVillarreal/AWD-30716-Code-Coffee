# Project Features

**Current baseline:** ALCSystem v2.0.18
**Last aligned:** May 26, 2026

This folder contains the planning package for the **American Latin Class** system.

The purpose of this assignment is to organize the requirements before building the Jira work plan. The documents are written from our project perspective and can be used to explain the scope to the teacher and to the academy owner.

## Contents

- `requirements.md`: complete functional and non-functional requirements.
- `elicited-requirements.md`: initial elicited context summarized in English.
- `user-stories.md`: user stories with acceptance criteria.
- `project-backlog.md`: prioritized backlog.
- `meeting-minutes.md`: meeting minutes based on the conversation with Juan Pablo Hidalgo.
- `jira/jira-import.csv`: 3 features and 9 tasks ready to create in Jira.
- `jira/created-jira-issues.md`: Jira issue keys created in the online board.
- `diagrams/class-diagram.puml`: class diagram in PlantUML format.
- `diagrams/use-case-diagram.puml`: use case diagram in PlantUML format.
- `implemented-features.md`: evidence that the three Jira features were also programmed.
- The active implementation now lives in `../06Code/View` and `../06Code/Controller`.
- Historical copied frontend evidence is archived under `../07Other/legacy-academic-code`.

## Jira Scope Required by the Assignment

We selected 3 features. Each feature has 3 tasks:

1. Public Landing and Enrollment
2. Student, Scholarship, and Attendance Control
3. Branch Finance and Professional Dancer Agency

This keeps the Jira board small enough for the assignment, but still connected to the real project scope.

## Current Implemented Scope

- Public home, pricing, offers, and enrollment request pages.
- Backend API with Slim, Eloquent, Supabase, signed authentication, role middleware, and CORS for the official frontend.
- Role dashboards for students, teachers, and directors.
- Teacher-controlled student attendance and separate teacher check-in station.
- Student profile photo upload and signed-in profile header.
- Director management for students, teachers, payroll, planning, finance, and B2 professional events.
- Netlify dashboard rewrites for clean internal routes.

## Published Frontend

The programmed frontend for the selected features is published here:

```text
https://american-latin-class-frontend.netlify.app
```

## Public Backend

The PHP backend is published on Render:

```text
https://american-latin-class.onrender.com
```

Health check:

```text
https://american-latin-class.onrender.com/api/health
```

The backend is deployed from GitHub with Render using the Dockerfile in `06Code`.
