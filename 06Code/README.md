# Code

Main source code for **American Latin Class**.

## MVC Structure

- `Model`: Eloquent entities and relationships for Supabase tables.
- `View`: public website, enrollment, attendance kiosk, login, and role dashboards.
- `Controller`: Slim API entry point, route table, controllers, middleware, services, validation, and support classes.

## Code Style

- Controllers coordinate HTTP requests and responses.
- Services contain business rules such as authentication, branch access, date ranges, audit logging, and attendance summaries.
- Validators live in `Controller/src/Service/Validation`.
- Models stay focused on database mapping and relationships.
- The frontend uses vanilla JavaScript organized into classes, so the Netlify deploy remains simple while the code follows POO.

Historical `hw`, `ws`, `exams`, and evidence delivery folders live outside this active source folder, so `06Code` opens directly on the MVC project.
