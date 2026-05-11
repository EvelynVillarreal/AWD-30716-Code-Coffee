# Project Structure

This repository keeps the academic delivery folders, but the active program is now visible directly in:

```text
06Code
```

## Canonical Source

- Model layer: `06Code/Model`
- View layer: `06Code/View`
- Controller layer and API bootstrap: `06Code/Controller`
- Program evidence: `06Code/Evidence`
- Requirements: `02Requirements`
- Technical documentation: `03Documentation`
- UML diagrams: `04UMLDiagrams`
- Manual evidence: `03Documentation/evidence`

## Notes

- `vendor/` is a local dependency folder and is intentionally ignored by Git.
- `05UnitTests` stores evidence JSON. Automated backend checks live in `06Code/Controller/tests`.
- The previous academic `hw`, `ws`, and `exams` code layout is archived in `07Other/legacy-academic-code`.
