# American Latin Class Requirements

**Current baseline:** ALCSystem v2.0.18
**Last aligned:** May 26, 2026

## 1. Project Context

American Latin Class is a dance academy with five branches. The academy trains dancers in styles such as reggaeton, urban, hip hop, afro, house, salsa, and bachata, and classifies students into two main learning levels:

- **B1**: basic-intermediate students.
- **B2**: intermediate-advanced students with professional projection.

B2 dancers can participate in paid professional opportunities managed by the academy, such as quinceanera shows, wedding dances, choreographies, private classes, shows, television appearances, and special events.

The system currently supports public academy presentation, pricing, enrollment requests, role-based internal portals, student and teacher administration, teacher-controlled student attendance, teacher check-in from the academy computer, scholarship control, student profile photos, class planning, branch finance reports, and professional dancer event history.

## 1.1 Current Deployment Context

| Component | Current implementation |
| --- | --- |
| Frontend | Static Netlify site at `https://american-latin-class-frontend.netlify.app`. |
| Backend | PHP Slim API on Render at `https://american-latin-class.onrender.com`. |
| Database | Supabase PostgreSQL. |
| Architecture | MVC folders under `06Code/Model`, `06Code/View`, and `06Code/Controller`. |
| Main branch | GitHub `main`, connected to the deployment services. |

## 2. Product Vision

We want to build a web platform that centralizes the operation of American Latin Class and helps the general director, branch directors, teachers, students, parents, and visitors work with the same source of truth.

The system must include a public website, enrollment forms, pricing and offers, protected role portals, administrative modules, attendance controls, scholarship tracking, teacher planning, branch finance reports, and professional event settlement for B2 dancers. The implemented MVP favors modular workflows over crowded screens so that each role sees only the information needed for its work.

## 3. User Roles

| Role | Description |
| --- | --- |
| Visitor | Person who only views academy information and may request enrollment. |
| Student | Academy member classified as B1 or B2, with or without scholarship. |
| Teacher | Instructor who submits monthly class planning and records class work. |
| Director | Main administrative role with access to student management, teacher management, payroll, planning, finance, and B2 events. |

## 4. Functional Requirements

### Public Website and Enrollment

- FR-001: The system shall provide a landing page with academy information, branches, dance programs, and contact options.
- FR-002: The system shall show basic information for visitors without requiring login.
- FR-003: The system shall provide an enrollment form for people who want to join the academy.
- FR-004: The enrollment form shall collect student name, national ID, contact data, preferred branch, preferred level, parent or guardian information, and comments.
- FR-005: The system shall store enrollment requests as pending records for administrative review.
- FR-005A: The system shall provide a pricing page with dance styles, monthly prices starting at USD 35, and promotional offers.
- FR-005B: The system shall redirect selected offers to the enrollment request form.
- FR-005C: The public frontend shall call the backend API for enrollment requests and shall not write enrollment data directly to Supabase.

### Student Management

- FR-006: The system shall register students with branch, level, status, phone, email, and guardian data.
- FR-007: The system shall classify students as B1 or B2.
- FR-008: The system shall classify scholarship percentage as 0%, 25%, 50%, 75%, or 100%.
- FR-009: The system shall show student attendance history and monthly attendance percentage.
- FR-010: The system shall show student progress, schedule, upcoming events, attendance percentage, and scholarship status.
- FR-011: The system shall prevent duplicate student records using national ID, email, or phone.
- FR-012: The system shall allow students to upload or update their profile photo.
- FR-013: The system shall show the logged-in user's name and profile image in the portal header.
- FR-013A: The system shall validate student inputs such as Ecuadorian national ID, email, phone, branch, level, status, scholarship percentage, and image size/type.

### Teacher Management

- FR-014: The system shall allow teachers to submit their monthly class plan.
- FR-015: The class plan shall include branch, teacher, month, level, objective, activities, and an optional document URL.
- FR-016: The system shall allow teachers to register student attendance.
- FR-017: The system shall show teacher attendance, worked hours, and payroll-related summaries at USD 12 per class hour.
- FR-018: Teacher attendance shall support late, present, absent, and excused states.
- FR-019: The system shall provide a separate teacher attendance station for school-computer check-in.
- FR-019A: The teacher check-in station shall identify the teacher by email and create an attendance record with an evidence code.
- FR-019B: The student portal shall not include a self-service student attendance registration flow; student attendance shall be controlled by teachers.

### Branch Management

- FR-020: The system shall manage the North, Matrix, Tumbaco, Quitumbe, and Conocoto branches.
- FR-021: Each branch shall support branch-scoped reporting and management data.
- FR-022: Branch directors shall report monthly income, expenses, student count, opportunities, events, and competitions.
- FR-023: Directors shall be able to review branch information.
- FR-024: Directors shall be able to review total students by branch and global totals.
- FR-024A: Directors shall be able to add, edit, deactivate, and review students and teachers.

### Finance

- FR-025: The system shall register income by branch.
- FR-026: The system shall register expenses by branch.
- FR-027: The system shall calculate monthly branch results.
- FR-028: The system shall calculate the percentage that each branch must send to the main branch.
- FR-029: The system shall register the main branch emergency reserve.
- FR-030: The system shall show consolidated academy financial indicators.

### Professional Dancer Agency

- FR-031: The system shall register B2 dancers as professional candidates.
- FR-032: The system shall register professional events for B2 dancers.
- FR-033: Events shall include client, type, date, amount, payment status, and branch.
- FR-034: The system shall register which dancers participated in each event.
- FR-035: The system shall calculate gross amount, deductions, penalties, and final amount to pay each dancer.
- FR-036: The system shall store the event and income history of each B2 dancer.

### Security and Permissions

- FR-037: The system shall support role-based access control.
- FR-038: Directors shall access protected administrative modules.
- FR-039: Students and teachers shall only access modules intended for their role.
- FR-040: Administrative actions shall be auditable.
- FR-041: Protected pages shall redirect unauthenticated users to login.
- FR-042: Sign out shall clear the stored session before returning to the login page.
- FR-043: Login forms shall support password visibility toggles without exposing stored password hashes.
- FR-044: Login inputs shall clear sensitive values after failed login, successful login, sign out, or browser history restore.
- FR-045: Dashboard navigation shall use canonical routes such as `/dashboard/overview`, `/dashboard/students`, `/dashboard/teachers`, `/dashboard/payroll`, `/dashboard/planning`, `/dashboard/finance`, `/dashboard/events`, `/dashboard/schedule`, `/dashboard/attendance`, and `/dashboard/work-log`.
- FR-046: The backend shall return JSON responses for API errors so the frontend does not expose raw HTML deployment errors as JSON parsing failures.

## 5. Non-Functional Requirements

- NFR-001: The system shall use Supabase as the database platform.
- NFR-002: The backend shall use PHP with a backend framework.
- NFR-003: The PHP backend shall use an ORM layer to map database tables to project models.
- NFR-004: The frontend shall be responsive for desktop and mobile.
- NFR-005: The public frontend shall be deployable through Netlify.
- NFR-006: The code shall be organized, readable, and consistent with clean code principles.
- NFR-007: The system shall protect sensitive actions with backend authentication and role-based permissions.
- NFR-008: The frontend shall not write sensitive records directly to Supabase; it shall call the backend API.
- NFR-009: The system shall use English names in code, UI labels, and project deliverables.
- NFR-010: The frontend shall use a consistent visual framework and clear modular layout.
- NFR-011: The system shall follow MVC and object-oriented design principles.
- NFR-012: Classes shall keep a single clear responsibility whenever possible.
- NFR-013: The backend shall expose CORS only for the official frontend and local development origins, and shall allow the HTTP methods used by implemented API routes.
- NFR-014: The deployed frontend shall use Netlify rewrites for dashboard deep links.
- NFR-015: Documentation shall use the current ALCSystem version number when requirements, URI design, or diagrams are updated.

## 6. Pending Validation With the Owner

- Exact branch directors.
- Exact percentage that each branch sends to the main branch.
- Exact scholarship rules for 25%, 50%, 75%, and 100%.
- Exact attendance threshold for scholarship loss or module loss.
- Teacher penalty and memo rules.
- Professional event commission formula.
- Emergency reserve policy.
- Payment methods and receipt requirements.
- Final role permission matrix.
