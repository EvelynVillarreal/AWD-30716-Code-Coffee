# Render Deployment

The current backend deployment for **American Latin Class** runs on Render and is connected to the GitHub repository.

## Public Backend

```text
https://american-latin-class.onrender.com
```

Health check:

```text
https://american-latin-class.onrender.com/api/health
```

## Render Service

Use a Render **Web Service** with these settings:

```text
Repository: EvelynVillarreal/AWD-30716-Code-Coffee
Branch: main
Root directory: 06Code
Runtime: Docker
Dockerfile path: ./Dockerfile
Docker build context: .
Plan: Free
```

The backend is built from `06Code/Dockerfile`, which installs PHP dependencies and serves the Slim application from `backend/public`.

The optional Render Blueprint draft is `06Code/render.yaml`. It uses `runtime: docker` for the API service and `runtime: static` for the static frontend service.

## Environment Variables

Configure these values in Render under **Environment**:

```env
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=America/Bogota
APP_KEY=your_generated_64_character_key
DB_CONNECTION=pgsql
DB_HOST=your_pooler_or_database_host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.your_project_ref
DB_PASSWORD=your_database_password
DB_SSLMODE=require
FRONTEND_ORIGINS=https://american-latin-class-frontend.netlify.app,http://127.0.0.1:5173,http://localhost:5173
GOOGLE_CLIENT_ID=your_google_oauth_client_id_if_google_login_is_enabled
```

Do not commit `.env`, database passwords, API tokens, or Render secrets.

## Frontend Pairing

The current frontend is deployed on Netlify:

```text
https://american-latin-class-frontend.netlify.app
```

The frontend backend URL is configured in:

```text
06Code/frontend/js/config.js
```

Expected value:

```js
window.API_BASE_URL = "https://american-latin-class.onrender.com";
window.GOOGLE_CLIENT_ID = "your_google_oauth_client_id_if_google_login_is_enabled";
```

Note: the committed `config.js` leaves `API_BASE_URL` empty, and `app-config.js` now falls back to `https://american-latin-class.onrender.com`. Set the production API URL explicitly if the backend service URL changes.

## Frontend Deep Links

The dashboard uses browser routes such as:

```text
/dashboard/overview
/dashboard/students
/dashboard/planning
```

The active rewrite file is `06Code/frontend/netlify.toml`. It maps `/dashboard` and `/dashboard/*` to `dashboard.html`.

If the frontend is deployed on Render Static Sites instead of Netlify, the same rewrites are documented in `06Code/render.yaml`.

## Manual Docker Compose Deploy

For a VPS-style manual deployment, use:

```bash
cd 06Code
./deploy.sh
```

`deploy.sh` builds with Docker Compose and verifies `http://127.0.0.1:8080/api/health`. It does not reset the database during a normal deploy.

Only for a demo seed reset:

```bash
RESET_DB=1 ./deploy.sh
```

That option runs `cleanup_db.sh`, drops the local `public` schema, and reapplies `backend/database/schema.sql`.

## Verification

After every backend deployment, verify:

```text
GET https://american-latin-class.onrender.com/api/health
GET https://american-latin-class.onrender.com/api/branches
```

Both endpoints should return JSON. The health endpoint should show `database: connected`.
