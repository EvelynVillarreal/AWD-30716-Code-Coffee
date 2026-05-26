# Credentials Setup

This project needs credentials only for services that cannot be committed to Git: Supabase database access, Render environment variables, and optional Jira automation.

## 1. Generate `APP_KEY`

The backend now requires `APP_KEY` to sign and verify tokens.

Run:

```powershell
C:\xampp\php\php.exe -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
```

Copy the output into:

```text
06Code/Controller/.env
```

Example:

```env
APP_KEY=paste_the_generated_value_here
```

## 2. Get Supabase PostgreSQL Credentials

1. Open `https://supabase.com/dashboard`.
2. Select the American Latin Class project.
3. Go to **Project Settings**.
4. Open **Database**.
5. Copy the connection information from **Connection string** or **Connection pooling**.
6. Prefer the transaction pooler if the direct host does not work on the local network.
7. Fill these values in `.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=your_pooler_or_database_host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.your_project_ref
DB_PASSWORD=your_database_password
DB_SSLMODE=require
```

If the database password is unknown, reset it from Supabase **Project Settings > Database** and then update Render and local `.env`.

## 3. Apply the Database Schema

1. In Supabase, open **SQL Editor**.
2. Open `06Code/Controller/database/supabase_schema.sql`.
3. Run the script.

The schema adds:

- `students.comments`
- unique indexes for national ID, email, and phone
- `audit_logs`
- RLS policies for the backend database role

If a unique index fails because existing data has duplicates, find them with:

```sql
select lower(email), count(*)
from public.students
group by lower(email)
having count(*) > 1;

select phone, count(*)
from public.students
group by phone
having count(*) > 1;
```

Fix or merge duplicate records, then rerun the schema script.

## 4. Configure Render

In Render:

1. Open the backend web service.
2. Go to **Environment**.
3. Add or update:

```env
APP_ENV=production
APP_DEBUG=false
APP_TIMEZONE=America/Bogota
APP_KEY=the_same_or_new_generated_secure_key
DB_CONNECTION=pgsql
DB_HOST=your_pooler_or_database_host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=postgres.your_project_ref
DB_PASSWORD=your_database_password
DB_SSLMODE=require
FRONTEND_ORIGINS=https://american-latin-class-frontend.netlify.app,http://127.0.0.1:5173,http://localhost:5173
```

Redeploy the service after updating variables.

## 5. Optional Jira Token

Jira automation uses an Atlassian API token.

1. Open `https://id.atlassian.com/manage-profile/security/api-tokens`.
2. Create an API token.
3. Store it outside Git, for example in PowerShell session variables before running the Jira script.

Do not commit API tokens, `.env`, database passwords, or Render variables.
