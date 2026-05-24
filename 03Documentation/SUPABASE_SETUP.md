# Supabase Setup

The current project uses Supabase PostgreSQL through the PHP controller API. The browser view does not write directly to Supabase.

## 1. Create The Project

1. Open Supabase.
2. Create a new project.
3. Open `SQL Editor`.
4. Run `06Code/Controller/database/supabase_schema.sql`.

If an existing Supabase database has Spanish alias users from earlier manual tests,
run `06Code/Controller/database/normalize_english_users.sql` after the schema.
This keeps the academic access accounts English-only:

```text
teacher@americanlatinclass.com / ALC2026*
student@americanlatinclass.com / ALC2026*
director@americanlatinclass.com / ALC2026*
```

The schema creates:

- `branches`
- `students`
- `users`
- `class_plans`
- `attendance_records`
- `branch_finance_reports`
- `professional_events`
- `dancer_event_assignments`
- `audit_logs`

It also enables row-level security and creates policies for the backend database role.

The current schema also includes the redesign tables/fields used by the portal:

- `students.scholarship_percent` accepts `0`, `25`, `50`, `75`, and `100`.
- `class_plans.document_url` stores a planning document link.
- `attendance_records.expected_start_time`, `duration_hours`, and `pay_rate`
  support teacher check-in and payroll calculations.

## 2. Configure Backend Credentials

In Supabase, open `Project Settings > Database` and copy the PostgreSQL connection values.

Then configure `06Code/Controller/.env`:

```env
DB_CONNECTION=pgsql
DB_HOST=your-host
DB_PORT=5432
DB_DATABASE=postgres
DB_USERNAME=alc_backend_user
DB_PASSWORD=your-password
DB_SSLMODE=require
```

The backend also requires:

```env
APP_KEY=your-64-character-hex-key
```

Generate it with:

```powershell
C:\xampp\php\php.exe -r "echo bin2hex(random_bytes(32)), PHP_EOL;"
```

## 3. Verify The API

Start the controller API:

```powershell
cd 06Code\Controller
C:\xampp\php\php.exe -S 127.0.0.1:8080 -t public
```

Check:

```text
http://127.0.0.1:8080/api/health
```

The expected response should report the API as healthy and the database as connected.

## Security Note

Sensitive writes must go through the controller API. Keep Supabase service credentials out of the browser view.
