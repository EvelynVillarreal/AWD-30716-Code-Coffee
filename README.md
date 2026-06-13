# AWD-30716-Code-Coffee

Repository for the **American Latin Class** web system.

Current documented baseline: **ALCSystem v2.0.19**, realigned on **June 13, 2026**.

## Project Map

- `01Definition`: initial project definition.
- `02Requirements`: requirements, user stories, backlog, and tracking.
- `03Documentation`: technical guides, deployment notes, API documentation, evidence, and current status review.
- `04UMLDiagrams`: use case and class diagrams from the academic delivery.
- `05UnitTests`: manual test cases and stored API/frontend evidence.
- `06Code`: active source code.
- `07Other`: archived deployments, legacy homework/workshop code, and older academic material.

## Active Program

The current program no longer uses top-level `Model`, `View`, and `Controller` folders. The active code is:

- Backend API: `06Code/backend`
- Frontend static site: `06Code/frontend`
- Database schema: `06Code/backend/database/schema.sql`
- Docker/Render deployment assets: `06Code/Dockerfile`, `06Code/docker-entrypoint.sh`, and `06Code/render.yaml`
- Technical evidence: `03Documentation/evidence` and `05UnitTests`

The backend still follows MVC-style responsibility separation internally:

- Models: `06Code/backend/src/Models`
- Controllers: `06Code/backend/src/Controllers`
- Services: `06Code/backend/src/Services`
- Middleware: `06Code/backend/src/Middleware`
- Support/infrastructure: `06Code/backend/src/Support`

## Current Deployments

- Frontend: `https://american-latin-class-frontend.netlify.app`
- Backend API: `https://american-latin-class.onrender.com`
- Backend health check: `https://american-latin-class.onrender.com/api/health`

## Quick Guides

- Current project status and improvement review: `03Documentation/PROJECT_STATUS_2026-06-13.md`
- Project structure: `03Documentation/PROJECT_STRUCTURE.md`
- MVC-style architecture: `03Documentation/MVC_ARCHITECTURE.md`
- Backend API: `03Documentation/BACKEND_API.md`
- Credentials and environment variables: `03Documentation/CREDENTIALS_SETUP.md`
- Supabase setup: `03Documentation/SUPABASE_SETUP.md`
- Render deployment: `03Documentation/RENDER_DEPLOYMENT.md`
