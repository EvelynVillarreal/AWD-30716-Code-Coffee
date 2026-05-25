# Legacy Backend Deployment

> Legacy note: the current backend is deployed on Render. See
> `../../03Documentation/RENDER_DEPLOYMENT.md` for the active deployment
> instructions.

This note preserves the retired local deployment approach. It is not the active
deployment path and should not be used for new releases.

## Current Public URL

```text
https://american-latin-class.onrender.com
```

## Health Check

```text
https://american-latin-class.onrender.com/api/health
```

Expected response:

```json
{
  "status": "ok",
  "database": "connected",
  "project": "American Latin Class"
}
```

## Retired Project

```text
american-latin-class-backend
```

## Deployment Method Status

The retired deployment was created from a local folder and was not connected to
GitHub auto-deploys. The active flow is now:

```text
GitHub main branch -> Render backend -> Netlify frontend
```

Render uses `06Code/Dockerfile` so the build context includes both
`Controller` and `Model`.

## Environment Variables

Production variables are configured inside Render. Database passwords, API
tokens, and service secrets must not be stored in the repository.
