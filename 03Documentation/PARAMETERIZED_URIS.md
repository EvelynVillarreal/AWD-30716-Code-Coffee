# Parameterized URI Documentation

Project: **American Latin Class**

This document lists the parameterized URIs currently implemented in `06Code/backend/routes/api.php`. The full backend and frontend route catalog is maintained in `URI_DESIGN_DOCUMENT_ALCSYSTEM.md`.

## URI Standard Used

- Collections use plural nouns, for example `/api/students` and `/api/teachers`.
- Path parameters are declared with braces, for example `{studentId}`.
- Real requests replace braces with numeric IDs, for example `/api/students/1`.
- Protected endpoints use Bearer token authentication and role middleware.

## Implemented Parameterized URIs

| Method | URI | Example | Purpose | Access |
| --- | --- | --- | --- | --- |
| PATCH | `/api/students/{studentId}` | `/api/students/1` | Update one student record. | Director |
| DELETE | `/api/students/{studentId}` | `/api/students/1` | Deactivate one student record. | Director |
| PATCH | `/api/teachers/{teacherId}` | `/api/teachers/1` | Update one teacher account. | Director |
| DELETE | `/api/teachers/{teacherId}` | `/api/teachers/1` | Deactivate one teacher account. | Director |
| POST | `/api/professional-events/{eventId}/assignments` | `/api/professional-events/3/assignments` | Assign a B2 dancer to one professional event. | Director |
| GET | `/api/dancer-settlements/{studentId}` | `/api/dancer-settlements/7` | Calculate one B2 dancer settlement summary. | Director |

## Not Currently Implemented

The current router does not register single-record `GET` routes such as:

- `GET /api/students/{studentId}`
- `GET /api/teachers/{teacherId}`
- `GET /api/class-plans/{classPlanId}`
- `GET /api/attendance-records/{attendanceRecordId}`
- `GET /api/branch-finance-reports/{financeReportId}`
- `GET /api/professional-events/{eventId}`

Those can be added later, but they should not be documented as implemented until `routes/api.php` maps them to controller methods.

## Example Request

```http
PATCH /api/students/1
Authorization: Bearer <director-token>
Content-Type: application/json

{
  "branch_id": 1,
  "national_id": "1723456784",
  "full_name": "Valeria Paz",
  "email": "valeria@example.com",
  "phone": "0990000000",
  "level": "B2",
  "scholarship_percent": 50,
  "status": "active"
}
```

## Example Response Shape

```json
{
  "message": "Student updated.",
  "data": {
    "id": 1,
    "full_name": "Valeria Paz"
  }
}
```
