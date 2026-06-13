# Project Status Review - June 13, 2026

Project: **American Latin Class / ALCSystem v2.0.19**

This review aligns the active code, URI documentation, requirements, UML diagrams, and deployment scripts after a full repository pass.

## Current Source of Truth

| Area | Canonical file or folder |
| --- | --- |
| Backend routes | `06Code/backend/routes/api.php` |
| Backend URI catalog | `03Documentation/URI_DESIGN_DOCUMENT_ALCSYSTEM.md` |
| URI/controller/service flow | `03Documentation/BACKEND_URI_SERVICE_FLOW.md` |
| Backend API summary | `03Documentation/BACKEND_API.md` |
| Frontend routes | `06Code/frontend/*.html`, `06Code/frontend/js/app-config.js`, `06Code/frontend/netlify.toml` |
| Class diagram source | `04UMLDiagrams/02ClassDiagram/class-diagram.puml` |
| Use case diagram source | `04UMLDiagrams/01UseCases/use-case-diagram.puml` |
| Deployment scripts | `06Code/Dockerfile`, `06Code/render.yaml`, `06Code/deploy.sh` |

## Findings Resolved

| Area | Resolution |
| --- | --- |
| URI documentation | Confirmed the production backend has 33 route entries and one conditional debug route. The URI catalog now documents the complete backend and frontend route set without proposed endpoints. |
| Class diagram | Updated to include the current Eloquent models, Slim controllers, middleware, services, validation services, and support helpers. |
| Use case diagram | Updated to ALCSystem v2.0.19 and added Google-backed enrollment/sign-in coverage. |
| Requirements and features | Normalized active requirement, user story, backlog, and implemented-feature docs to ALCSystem v2.0.19 with a June 13, 2026 alignment date. |
| Google enrollment | Fixed the backend flow so duplicate checks use explicit normalized fields and the account email comes from the verified Google token. |
| Deploy script | Made `deploy.sh` safer by skipping database reset unless `RESET_DB=1` is provided and adding a local health check after Docker Compose starts. |
| Legacy architecture wording | Replaced active-doc references to old top-level `Model`, `View`, and `Controller` folders with the current `06Code/backend` and `06Code/frontend` layout. |

## Clean Code Assessment

- Controllers still coordinate HTTP concerns, validation, services, models, and JSON responses.
- Models remain focused on Eloquent table mapping and relationships.
- `ValidationService` is a facade over smaller validators, which keeps controllers stable while preserving single-purpose validation classes.
- Middleware owns role checks instead of duplicating authorization in every route.
- The route table still manually instantiates dependencies. This is acceptable for the current academic scope, but a container/factory layer would be the next clean-code improvement if the project grows.

## URI Contract Summary

- Production backend: `GET /` plus 32 `/api` routes.
- Development-only backend: `GET /api/debug` when `APP_DEBUG=true`.
- Frontend canonical routes: public pages plus `/dashboard` and role dashboard deep links handled by Netlify rewrites.
- Parameterized backend URIs remain limited to student, teacher, professional event assignment, and dancer settlement routes.

## Deployment Notes

- Render remains the primary backend deployment path through `06Code/Dockerfile`.
- Netlify remains the primary frontend deployment path through `06Code/frontend`.
- Manual VPS deploys can use `06Code/deploy.sh`.
- Database reset is intentionally opt-in:

```bash
RESET_DB=1 ./deploy.sh
```

Use that only for demo seed resets, not normal production deployments.

## Verification Target

Run these checks from `06Code/backend` with XAMPP PHP when local dependencies are present:

```powershell
C:\xampp\php\php.exe tests/lint.php
C:\xampp\php\php.exe tests/run.php
```

Then verify the deployed API:

```text
GET https://american-latin-class.onrender.com/api/health
GET https://american-latin-class.onrender.com/api/branches
```
