# Project Structure

This repository keeps the academic delivery folders, but the active program is now visible directly in:

```text
06Code
```

## Canonical Source

- Model layer: `06Code/Model`
- View layer: `06Code/View`
- Controller layer and API bootstrap: `06Code/Controller`
- Requirements: `02Requirements`
- Technical documentation: `03Documentation`
- UML diagrams: `04UMLDiagrams`
- Manual evidence: `03Documentation/evidence`

## Active MVC Map

```text
06Code/
├── Model/                         Eloquent models and relationships
├── View/                          Static Netlify frontend
│   ├── css/                       Visual design system and responsive layout
│   └── script/                    Frontend classes, API client, and config
└── Controller/                    Slim backend API
    ├── public/                    Backend HTTP entry point
    ├── routes/                    Route table and dependency composition
    ├── src/Controller/            HTTP controllers
    ├── src/Middleware/            Authentication and role protection
    ├── src/Service/               Business and application services
    ├── src/Service/Validation/    Request validators
    ├── src/Support/               Infrastructure helpers
    ├── database/                  Supabase SQL scripts
    └── tests/                     Lightweight backend checks
```

## Object-Oriented Organization

The active code favors small classes with explicit responsibilities:

| Folder | Responsibility |
| --- | --- |
| `06Code/Model` | Data mapping only. Models know table names, fillable fields, casts, and relationships. |
| `06Code/Controller/src/Controller` | HTTP coordination. Controllers parse requests, call validators/services, and return JSON. |
| `06Code/Controller/src/Service` | Reusable business rules such as authentication, branch access, dates, payroll, auditing, and summaries. |
| `06Code/Controller/src/Service/Validation` | Input validation rules separated from controllers and models. |
| `06Code/Controller/src/Middleware` | Cross-cutting route access rules. |
| `06Code/Controller/src/Support` | Infrastructure code that should not live in controllers. |
| `06Code/View/script` | Frontend classes for API access, session storage, public pages, dashboard modules, DOM helpers, and formatting. |

## Notes

- `vendor/` is a local dependency folder and is intentionally ignored by Git.
- `05UnitTests` stores evidence JSON. Automated backend checks live in `06Code/Controller/tests`.
- The previous academic `hw`, `ws`, and `exams` code layout is archived in `07Other/legacy-academic-code`.
