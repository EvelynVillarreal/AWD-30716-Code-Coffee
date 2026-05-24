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
Dockerfile: 06Code/Dockerfile
Plan: Free
```

The backend is built from `06Code/Dockerfile`, which installs PHP dependencies and serves the Slim application from `Controller/public`.

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
FRONTEND_ORIGINS=https://american-latin-class-frontend.netlify.app,https://creative-pothos-6c7a4c.netlify.app,https://american-latin-class-frontend.onrender.com,http://127.0.0.1:5173,http://localhost:5173
```

Do not commit `.env`, database passwords, API tokens, or Render secrets.

## Frontend Pairing

The current frontend is deployed on Netlify:

```text
https://american-latin-class-frontend.netlify.app
```

The frontend backend URL is configured in:

```text
06Code/View/script/config.js
```

Expected value:

```js
window.API_BASE_URL = "https://american-latin-class.onrender.com";
```

## Verification

After every backend deployment, verify:

```text
GET https://american-latin-class.onrender.com/api/health
GET https://american-latin-class.onrender.com/api/branches
```

Both endpoints should return JSON. The health endpoint should show `database: connected`.
