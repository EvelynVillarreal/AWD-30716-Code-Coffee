# ALCSystem v2.0.16

# RESTful URI Design Document

## American Latin Class Web System

**Course:** Advanced Web Development
**Instructor:** Engineer Edison Lascano
**Project:** American Latin Class, ALCSystem
**Version:** ALCSystem v2.0.16
**Date:** May 25, 2026
**Team members:** Carlos Alexander Torres Pincay, Evelyn Hayde Villarreal

---

## 1. Document Purpose

This document describes the URI design currently implemented in the American Latin Class web system. The goal is to document the existing backend API routes and frontend page routes without adding proposed or future endpoints.

The document follows the same academic structure used by the reference URI design documents:

- General system context.
- Base URLs for production and local environments.
- RESTful URI design rules.
- Backend endpoint catalog.
- Frontend page URI catalog.
- Request and response examples.
- Authentication, authorization, validation, and error conventions.

This version documents what exists in the repository at ALCSystem v2.0.16.

---

## 2. System Overview

American Latin Class is a web system for a dance academy with five branches:

- Norte
- Matriz
- Tumbaco
- Quitumbe
- Conocoto

The platform includes public pages for external visitors and protected portals for students, teachers, and directors.

### 2.1 Main Business Areas

| Area | Description |
| --- | --- |
| Public website | Presents the school, pricing, offers, and enrollment request form. |
| Authentication | Allows student, teacher, and director users to access the internal portal. |
| Student portal | Shows student profile, attendance progress, schedule, and upcoming events. |
| Teacher portal | Allows teachers to review attendance, worked hours, class planning, and payroll-related records. |
| Director portal | Allows directors to manage students, teachers, payroll, attendance, planning, finance, and B2 professional events. |
| Teacher attendance station | Allows teachers to register check-in from the academy computer. |

---

## 3. Architecture Context

The project is organized with an MVC-oriented structure:

| Layer | Location | Responsibility |
| --- | --- | --- |
| Model | `06Code/Model` | Database entities managed with Eloquent ORM. |
| View | `06Code/View` | Static frontend pages deployed with Netlify. |
| Controller | `06Code/Controller/src/Controller` | Slim 4 controllers that expose backend API routes. |
| Validation | `06Code/Controller/src/Service/Validation` | Input validation services used by controllers. |
| Database | Supabase PostgreSQL | Production database. |
| Backend deployment | Render | PHP backend API service. |
| Frontend deployment | Netlify | Static frontend hosting and dashboard rewrites. |

---

## 4. URI Count Summary

### 4.1 Backend URI Count

The backend currently has **28 implemented route entries**:

- **1 non-API root route:** `GET /`
- **27 API routes:** routes under `/api`

### 4.2 Frontend URI Count

The frontend currently has **16 canonical route entries**:

- **5 public or operational pages**
- **11 protected dashboard routes**

HTML file aliases also exist, such as `/index.html` and `/dashboard.html`, but the canonical documented routes prefer clean production routes where possible.

---

## 5. Base URLs

### 5.1 Production Backend

```text
https://american-latin-class.onrender.com
```

### 5.2 Production Frontend

```text
https://american-latin-class-frontend.netlify.app
```

### 5.3 Local Backend

```text
http://127.0.0.1:8080
```

### 5.4 Local Frontend

```text
http://127.0.0.1:5500
```

The local frontend URL can change depending on the local static server used by the developer.

---

## 6. RESTful URI Design Rules Used

The backend follows these URI design principles:

| Rule | Application in ALCSystem |
| --- | --- |
| Use nouns for resources | `/api/students`, `/api/teachers`, `/api/branches` |
| Use plural collection names | `students`, `teachers`, `class-plans`, `attendance-records` |
| Use path parameters for specific resources | `/api/students/{studentId}` |
| Use query parameters for filters | `/api/students?branch_id=1&level=B2` |
| Keep API routes under a common prefix | `/api` |
| Return JSON from backend endpoints | All controller responses use JSON. |
| Protect internal resources with Bearer token auth | Protected routes use `Authorization: Bearer <token>`. |

### 6.1 Action Endpoint Exceptions

Some endpoints are command-like because they represent authentication or a specific operational action:

| Endpoint | Reason |
| --- | --- |
| `POST /api/auth/login` | Login is an authentication action, not a normal CRUD resource. |
| `POST /api/teacher-attendance/check-in` | Teacher check-in is an event action from the academy computer. |
| `POST /api/professional-events/{eventId}/assignments` | Assigning a dancer is a nested business action under an event. |

---

## 7. Authentication and Authorization

### 7.1 Authentication Type

Protected endpoints use a Bearer token.

```http
Authorization: Bearer <token>
```

The token is obtained from:

```text
POST /api/auth/login
```

### 7.2 User Roles

| Role | Main Access |
| --- | --- |
| student | Student profile and personal monthly attendance. |
| teacher | Class plans, attendance records related to teacher work, and attendance control views. |
| director | Student management, teacher management, payroll, planning, finance, and B2 events. |

---

## 8. Backend API Endpoint Catalog

### 8.1 Full Endpoint Table

| # | Method | URI | Auth | Roles | Purpose |
| --- | --- | --- | --- | --- | --- |
| 1 | GET | `/` | No | Public | Returns backend project metadata and endpoint summary. |
| 2 | GET | `/api/health` | No | Public | Checks API and database connection status. |
| 3 | GET | `/api/branches` | No | Public | Lists academy branches. |
| 4 | POST | `/api/enrollments` | No | Public | Creates a public enrollment request. |
| 5 | POST | `/api/auth/login` | No | Public | Authenticates a user and returns a token. |
| 6 | POST | `/api/kiosk/attendance` | No | Public station | Registers legacy student kiosk attendance by national ID. |
| 7 | POST | `/api/teacher-attendance/check-in` | No | Public station | Registers teacher check-in from academy computer. |
| 8 | GET | `/api/me` | Yes | student, teacher, director | Returns the authenticated user profile. |
| 9 | GET | `/api/me/attendance` | Yes | student | Returns student monthly attendance. |
| 10 | PATCH | `/api/me/photo` | Yes | student | Updates the current student profile photo. |
| 11 | GET | `/api/students` | Yes | director | Lists students with optional filters. |
| 12 | POST | `/api/students` | Yes | director | Creates a student record. |
| 13 | PATCH | `/api/students/{studentId}` | Yes | director | Updates a student record. |
| 14 | DELETE | `/api/students/{studentId}` | Yes | director | Deactivates a student record. |
| 15 | GET | `/api/teachers` | Yes | director | Lists teacher accounts. |
| 16 | POST | `/api/teachers` | Yes | director | Creates a teacher account. |
| 17 | PATCH | `/api/teachers/{teacherId}` | Yes | director | Updates a teacher account. |
| 18 | DELETE | `/api/teachers/{teacherId}` | Yes | director | Deactivates a teacher account. |
| 19 | GET | `/api/class-plans` | Yes | teacher, director | Lists class planning records. |
| 20 | POST | `/api/class-plans` | Yes | teacher, director | Submits a class planning record. |
| 21 | GET | `/api/attendance-records` | Yes | teacher, director | Lists attendance records and teacher payroll summary. |
| 22 | POST | `/api/attendance-records` | Yes | teacher, director | Creates a manual attendance record. |
| 23 | GET | `/api/branch-finance-reports` | Yes | director | Lists branch finance reports. |
| 24 | POST | `/api/branch-finance-reports` | Yes | director | Creates a branch finance report. |
| 25 | GET | `/api/professional-events` | Yes | director | Lists professional B2 events. |
| 26 | POST | `/api/professional-events` | Yes | director | Creates a professional event. |
| 27 | POST | `/api/professional-events/{eventId}/assignments` | Yes | director | Assigns a B2 dancer to an event. |
| 28 | GET | `/api/dancer-settlements/{studentId}` | Yes | director | Calculates B2 dancer settlement summary. |

---

## 9. Backend Endpoint Details

### 9.1 Root and Health

#### GET `/`

Returns backend metadata, framework information, and available endpoint groups.

**Response example**

```json
{
  "project": "American Latin Class Backend API",
  "framework": "Slim 4",
  "architecture": "MVC controllers with Eloquent models",
  "database": "Supabase PostgreSQL",
  "health": "/api/health"
}
```

#### GET `/api/health`

Checks if the API is available and the database connection can be verified.

**Response example**

```json
{
  "status": "ok",
  "database": "connected",
  "project": "American Latin Class"
}
```

---

### 9.2 Branches

#### GET `/api/branches`

Returns the list of academy branches.

**Response example**

```json
{
  "data": [
    {
      "id": 1,
      "name": "Matriz"
    }
  ]
}
```

---

### 9.3 Public Enrollment

#### POST `/api/enrollments`

Creates a public enrollment request. The new student is stored with `pending` status.

**Request body**

```json
{
  "branch_id": 1,
  "national_id": "1723456789",
  "full_name": "Valeria Paz",
  "email": "student@example.com",
  "phone": "0990000000",
  "level": "B1",
  "scholarship_percent": 0,
  "guardian_name": "Luis Paz",
  "guardian_phone": "0991112222",
  "comments": "Interested in urban dance classes."
}
```

**Main validation rules**

| Field | Rule |
| --- | --- |
| `branch_id` | Required and must reference an existing branch. |
| `national_id` | Required, 10 digits, valid Ecuadorian ID. |
| `full_name` | Required, letters only, maximum 120 characters. |
| `email` | Required, valid email, maximum 254 characters. |
| `phone` | Required, 7 to 20 characters after sanitization. |
| `level` | Must be `B1` or `B2`. |
| `scholarship_percent` | Must be `0`, `25`, `50`, `75`, or `100`. |

**Response example**

```json
{
  "message": "Enrollment request registered.",
  "data": {
    "id": 12,
    "status": "pending"
  }
}
```

---

### 9.4 Authentication

#### POST `/api/auth/login`

Authenticates a student, teacher, or director account.

**Request body**

```json
{
  "email": "director@americanlatinclass.com",
  "password": "ALC2026*"
}
```

**Response example**

```json
{
  "token": "jwt-token-value",
  "user": {
    "id": 1,
    "email": "director@americanlatinclass.com",
    "role": "director",
    "name": "Juan Pablo Hidalgo"
  }
}
```

**Possible errors**

| Status | Meaning |
| --- | --- |
| 401 | Invalid credentials. |
| 422 | Email or password was not provided correctly. |

---

### 9.5 Attendance Stations

#### POST `/api/kiosk/attendance`

Registers legacy student kiosk attendance by national ID.

This endpoint exists in the backend, but the current v2 frontend design no longer exposes a self-service student attendance tab. Student attendance is now normally controlled by teachers.

**Request body**

```json
{
  "national_id": "1723456789"
}
```

**Response example**

```json
{
  "message": "Attendance registered.",
  "student": {
    "name": "Valeria Paz",
    "level": "B2"
  }
}
```

#### POST `/api/teacher-attendance/check-in`

Registers a teacher check-in from the academy computer.

**Request body**

```json
{
  "email": "teacher@americanlatinclass.com",
  "branch_id": 1,
  "expected_start_time": "18:00",
  "duration_hours": 1,
  "style": "Salsa",
  "notes": "Regular class."
}
```

**Response example**

```json
{
  "message": "Teacher check-in registered.",
  "data": {
    "person_type": "teacher",
    "status": "present",
    "source": "teacher_kiosk",
    "pay_rate": 12
  }
}
```

---

### 9.6 Authenticated User Profile

#### GET `/api/me`

Returns the authenticated user profile. For student users, it also returns student data and monthly attendance summary.

**Query parameters**

| Parameter | Required | Description |
| --- | --- | --- |
| `month` | No | Month in `YYYY-MM` format. Applies to student attendance summary. |

**Response example**

```json
{
  "user": {
    "id": 1,
    "role": "student",
    "name": "Valeria Paz"
  },
  "attendance_month": "2026-05",
  "attendance_summary": {
    "total": 8,
    "present": 7,
    "late": 1,
    "absent": 0
  }
}
```

#### GET `/api/me/attendance`

Returns the current student monthly attendance.

**Authorization:** student only

**Query parameters**

| Parameter | Required | Description |
| --- | --- | --- |
| `month` | No | Month in `YYYY-MM` format. |

#### PATCH `/api/me/photo`

Updates the current student profile photo.

**Authorization:** student only

**Request body**

```json
{
  "photo_url": "data:image/png;base64,..."
}
```

The backend accepts PNG, JPEG, or WEBP data image strings and valid remote image URLs.

---

### 9.7 Students

#### GET `/api/students`

Lists students available to the director.

**Authorization:** director only

**Query parameters**

| Parameter | Required | Description |
| --- | --- | --- |
| `branch_id` | No | Filters students by branch. |
| `level` | No | Filters by level, for example `B1` or `B2`. |
| `scholarship` | No | Filters by scholarship percent. |

#### POST `/api/students`

Creates a student record.

**Authorization:** director only

**Request body**

```json
{
  "branch_id": 1,
  "national_id": "1723456789",
  "full_name": "Valeria Paz",
  "email": "student@example.com",
  "phone": "0990000000",
  "level": "B2",
  "scholarship_percent": 50,
  "guardian_name": "Luis Paz",
  "guardian_phone": "0991112222",
  "comments": "Scholarship assigned by director.",
  "status": "active"
}
```

#### PATCH `/api/students/{studentId}`

Updates a student record.

**Path parameters**

| Parameter | Description |
| --- | --- |
| `studentId` | Student identifier. |

#### DELETE `/api/students/{studentId}`

Deactivates a student record by setting its status to `inactive`.

---

### 9.8 Teachers

#### GET `/api/teachers`

Lists teacher accounts.

**Authorization:** director only

#### POST `/api/teachers`

Creates a teacher account.

**Request body**

```json
{
  "name": "Andrea Molina",
  "email": "teacher@example.com",
  "branch_id": 1,
  "password": "Teacher2026*"
}
```

**Main validation rules**

| Field | Rule |
| --- | --- |
| `name` | Required, letters only, maximum 120 characters. |
| `email` | Required, valid email, maximum 254 characters. |
| `branch_id` | Required and must reference an existing branch. |
| `password` | Required on create, optional on update, minimum 8 characters when provided. |

#### PATCH `/api/teachers/{teacherId}`

Updates a teacher account.

#### DELETE `/api/teachers/{teacherId}`

Deactivates a teacher account by setting `is_active` to false.

---

### 9.9 Class Plans

#### GET `/api/class-plans`

Lists class planning documents. Teachers see their own records, while directors can view records according to their branch scope.

**Authorization:** teacher, director

**Query parameters**

| Parameter | Required | Description |
| --- | --- | --- |
| `branch_id` | No | Filters plans by branch. |

#### POST `/api/class-plans`

Submits a class planning record.

**Request body**

```json
{
  "branch_id": 1,
  "teacher_name": "Andrea Molina",
  "month": "2026-05",
  "level": "B2",
  "objective": "Improve salsa partner work.",
  "activities": "Warm-up, footwork, partner routine.",
  "document_url": "https://example.com/class-plan.pdf"
}
```

**Main validation rules**

| Field | Rule |
| --- | --- |
| `month` | Required, `YYYY-MM` format. |
| `level` | Must be `B1` or `B2`. |
| `document_url` | Optional, must be a valid URL when provided. |

---

### 9.10 Attendance Records

#### GET `/api/attendance-records`

Lists attendance records and returns teacher payroll summary.

**Authorization:** teacher, director

**Query parameters**

| Parameter | Required | Description |
| --- | --- | --- |
| `month` | No | Month in `YYYY-MM` format. |
| `branch_id` | No | Director filter by branch. |
| `person_type` | No | Director filter by `student` or `teacher`. |

#### POST `/api/attendance-records`

Creates a manual attendance record.

**Request body**

```json
{
  "branch_id": 1,
  "student_id": 12,
  "person_type": "student",
  "person_name": "Valeria Paz",
  "level": "B2",
  "attendance_date": "2026-05-24",
  "check_in_at": "2026-05-24 18:00:00",
  "expected_start_time": "18:00",
  "duration_hours": 1,
  "status": "present",
  "notes": "Regular class attendance."
}
```

**Accepted values**

| Field | Values |
| --- | --- |
| `person_type` | `student`, `teacher` |
| `status` | `present`, `absent`, `late`, `excused` |
| `attendance_date` | `YYYY-MM-DD` |
| `expected_start_time` | `HH:MM` |
| `duration_hours` | Between `0.25` and `8` |

---

### 9.11 Branch Finance Reports

#### GET `/api/branch-finance-reports`

Lists branch finance reports.

**Authorization:** director only

#### POST `/api/branch-finance-reports`

Creates a branch finance report and calculates matrix share amount and net result.

**Request body**

```json
{
  "branch_id": 1,
  "month": "2026-05",
  "income": 1500,
  "expenses": 600,
  "matrix_share_percent": 10
}
```

**Calculated fields**

| Field | Formula |
| --- | --- |
| `matrix_share_amount` | `income * (matrix_share_percent / 100)` |
| `net_result` | `income - expenses - matrix_share_amount` |

---

### 9.12 Professional Events

#### GET `/api/professional-events`

Lists professional events and their dancer assignments.

**Authorization:** director only

#### POST `/api/professional-events`

Creates a professional event for B2 dancers.

**Request body**

```json
{
  "branch_id": 1,
  "client_name": "Private Client",
  "event_type": "Corporate show",
  "event_date": "2026-05-30",
  "total_amount": 400,
  "status": "pending_payment"
}
```

#### POST `/api/professional-events/{eventId}/assignments`

Assigns a B2 dancer to a professional event.

**Path parameters**

| Parameter | Description |
| --- | --- |
| `eventId` | Professional event identifier. |

**Request body**

```json
{
  "student_id": 12,
  "gross_amount": 80,
  "deduction_amount": 0,
  "deduction_reason": "",
  "payment_status": "pending"
}
```

#### GET `/api/dancer-settlements/{studentId}`

Returns the payment settlement summary for a B2 dancer.

**Path parameters**

| Parameter | Description |
| --- | --- |
| `studentId` | B2 student identifier. |

**Response example**

```json
{
  "data": {
    "events_attended": 3,
    "paid_events": 2,
    "gross_amount": 240,
    "deductions": 20,
    "net_amount": 220
  }
}
```

---

## 10. Frontend URI Catalog

### 10.1 Production Frontend Base URL

```text
https://american-latin-class-frontend.netlify.app
```

### 10.2 Canonical Frontend Routes

| # | URI | Access | Purpose |
| --- | --- | --- | --- |
| 1 | `/` | Public | Home page with academy presentation. |
| 2 | `/pricing.html` | Public | Pricing, styles, and offers. |
| 3 | `/enrollment.html` | Public | Enrollment request form. |
| 4 | `/login.html` | Public | Internal portal login. |
| 5 | `/attendance-kiosk.html` | Academy computer | Teacher check-in station. |
| 6 | `/dashboard` | Protected | Dashboard entry route. |
| 7 | `/dashboard/overview` | Protected | Role-based overview. |
| 8 | `/dashboard/students` | Protected | Student management or student profile module, depending on role. |
| 9 | `/dashboard/teachers` | Protected | Teacher management or teacher work module, depending on role. |
| 10 | `/dashboard/payroll` | Protected | Teacher payroll summary. |
| 11 | `/dashboard/planning` | Protected | Class planning module. |
| 12 | `/dashboard/finance` | Protected | Branch finance module. |
| 13 | `/dashboard/events` | Protected | B2 professional events module. |
| 14 | `/dashboard/schedule` | Protected | Student schedule module. |
| 15 | `/dashboard/attendance` | Protected | Student attendance calendar or attendance records. |
| 16 | `/dashboard/work-log` | Protected | Teacher work log module. |

### 10.3 Frontend File Aliases and Rewrites

| URI | Type | Notes |
| --- | --- | --- |
| `/index.html` | File alias | Same public home experience as `/`. |
| `/dashboard.html` | File alias | Static dashboard file. |
| `/dashboard/*` | Netlify rewrite | Rewrites to `/dashboard.html` with status `200`. |

---

## 11. Frontend Page Details

### 11.1 Public Home

**URI:** `/`

Presents the academy brand, branches, dance styles, value proposition, and navigation to pricing, enrollment, and internal portal.

### 11.2 Pricing

**URI:** `/pricing.html`

Shows monthly prices starting at USD 35 per dance style, including styles such as reggaeton, urban, hip hop, afro, house, salsa, and bachata. Offer cards redirect visitors to the enrollment request form.

### 11.3 Enrollment

**URI:** `/enrollment.html`

Allows external visitors to submit an enrollment request. The form sends data to:

```text
POST /api/enrollments
```

### 11.4 Login

**URI:** `/login.html`

Allows student, teacher, and director users to access the school portal. The form sends credentials to:

```text
POST /api/auth/login
```

### 11.5 Teacher Attendance Station

**URI:** `/attendance-kiosk.html`

Used only on the academy computer to register teacher check-ins. The form sends data to:

```text
POST /api/teacher-attendance/check-in
```

### 11.6 Dashboard Routes

**Base route:** `/dashboard`

The dashboard uses frontend routing to change the browser URL while keeping the same static `dashboard.html` file.

Examples:

```text
/dashboard/overview
/dashboard/students
/dashboard/teachers
/dashboard/payroll
/dashboard/planning
```

The visible modules depend on the authenticated user role.

---

## 12. Error Response Conventions

The backend returns JSON error responses.

| Status | Meaning | Example |
| --- | --- | --- |
| 400 | Bad request | Invalid JSON or malformed request. |
| 401 | Unauthorized | Missing token or invalid credentials. |
| 403 | Forbidden | User role cannot access the resource. |
| 404 | Not found | Resource was not found. |
| 422 | Validation error | Input fields did not pass validation. |
| 500 | Server error | Unexpected backend error. |
| 503 | Service unavailable | Database or service dependency could not be verified. |

### 12.1 Validation Error Example

```json
{
  "errors": {
    "email": "A valid email is required.",
    "national_id": "National ID is not a valid Ecuadorian ID."
  }
}
```

### 12.2 Authorization Error Example

```json
{
  "message": "This user cannot update that student."
}
```

---

## 13. Security Notes

| Security Area | Current Implementation |
| --- | --- |
| Password handling | Passwords are hashed in the backend and are never returned as plain text. |
| Token auth | Protected API routes require a Bearer token. |
| Role checks | Internal routes use role middleware for `student`, `teacher`, and `director`. |
| Input validation | Backend validators protect enrollment, student, teacher, attendance, class plan, finance, and event inputs. |
| Session cleanup | The frontend removes stored session data on sign out. |
| Sensitive frontend cache | Netlify headers disable browser cache for frontend files. |

---

## 14. Current Scope and Limitations

This document only includes URIs already implemented in ALCSystem v2.0.16.

Current limitations:

- Some business modules are implemented as list/create workflows instead of complete CRUD resources.
- `/api/kiosk/attendance` remains implemented for legacy student kiosk attendance, but the v2 user flow no longer exposes student self-attendance as a frontend tab.
- The dashboard is a static frontend route system supported by Netlify rewrites, not server-side page routing.

---

## 15. Conclusion

ALCSystem currently includes a functional backend API with 28 implemented route entries and a frontend with 16 canonical route entries. The API supports public enrollment, authentication, role-based access, student and teacher management, student profile photos, attendance control, teacher payroll summaries, class planning, branch finance reports, and B2 professional event management.

The URI design is consistent with the current implemented business scope and documents only the routes that exist in the project at this version.
