# Parameterized URI Documentation

Project: **American Latin Class**

This document lists the RESTful URIs added for direct lookup by ID. The project uses **Slim 4**, so route parameters are declared with braces, for example `{studentId}`.

## URI Standard Used

- Collections use plural nouns: `/api/students`, `/api/teachers`.
- A single record is addressed by appending an ID parameter: `/api/students/{studentId}`.
- Real examples replace the braces with the actual numeric ID: `/api/students/1`, `/api/students/2`.
- `GET` is used for read-only lookup.
- Protected endpoints keep the existing role middleware and branch access validation.

## Added URIs

| Method | URI | Example | Purpose | Access |
| --- | --- | --- | --- | --- |
| GET | `/api/branches/{branchId}` | `/api/branches/1` | Get one branch by ID | Public |
| GET | `/api/students/{studentId}` | `/api/students/1` | Get one student by ID | Director |
| GET | `/api/teachers/{teacherId}` | `/api/teachers/1` | Get one teacher by ID | Director |
| GET | `/api/class-plans/{classPlanId}` | `/api/class-plans/1` | Get one class plan by ID | Teacher, Director |
| GET | `/api/attendance-records/{attendanceRecordId}` | `/api/attendance-records/1` | Get one attendance record by ID | Teacher, Director |
| GET | `/api/branch-finance-reports/{financeReportId}` | `/api/branch-finance-reports/1` | Get one finance report by ID | Director |
| GET | `/api/professional-events/{eventId}` | `/api/professional-events/1` | Get one professional event by ID | Director |

## Implementation Summary

The route file `06Code/Controller/routes/api.php` now maps each URI to a `show` method in the matching controller.

Each `show` method follows the same standard:

1. Read the ID from Slim's `$args` array.
2. Search the model by ID.
3. Return `404` if the record does not exist.
4. Validate branch or role access when the endpoint is protected.
5. Return the selected record inside a JSON `data` object.

## Example Request

```http
GET /api/students/1
Authorization: Bearer <director-token>
```

## Example Response

```json
{
    "data": {
        "id": 1,
        "full_name": "Example Student",
        "branch_id": 1
    }
}
```

