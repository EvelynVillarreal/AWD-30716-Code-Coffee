# User Stories

**Current baseline:** ALCSystem v2.0.18
**Last aligned:** May 26, 2026

## Feature 1: Public Landing and Enrollment

### US-001 - View Academy Information
As a visitor, I want to view information about American Latin Class so that I can understand the academy before requesting enrollment.

Acceptance criteria:
- The landing page shows academy purpose, levels, branches, and contact options.
- The page works without login.
- The page is responsive.

### US-002 - View Prices and Offers
As a visitor, I want to view dance styles, prices, and offers so that I can choose the best enrollment option.

Acceptance criteria:
- The pricing page shows dance styles and monthly prices.
- Offer cards redirect to the enrollment request form.
- The design uses clear cards with visual references.

### US-003 - Submit Enrollment Request
As a visitor, I want to submit an enrollment form so that the academy can contact me.

Acceptance criteria:
- The form requires name, national ID, phone, email, preferred branch, and level.
- The form stores the request as pending.
- The form shows a confirmation message.
- The request is sent to the backend API.

### US-004 - Review New Enrollment Requests
As a director, I want to review pending enrollment requests so that I can convert valid requests into active students.

Acceptance criteria:
- Pending requests are available as student records with pending status.
- Requests include branch and contact data.
- The director can identify the requested level and scholarship information.

## Feature 2: Student, Scholarship, and Attendance Control

### US-005 - Manage Student Classification
As a director, I want to classify each student by level and scholarship so that academic and financial rules can be applied correctly.

Acceptance criteria:
- Students can be B1 or B2.
- Scholarship can be 0%, 25%, 50%, 75%, or 100%.
- Student records include branch and status.
- The director can add, edit, and deactivate student records.

### US-006 - Upload Student Profile Photo
As a student, I want to upload my profile photo so that the portal clearly identifies my account.

Acceptance criteria:
- The student can select an image from the portal.
- The portal validates image type and size.
- The profile header shows the updated photo after saving.

### US-007 - Register Student Attendance
As a teacher, I want to register student attendance so that the academy can validate scholarships and module continuity.

Acceptance criteria:
- Attendance includes date, branch, student, level, and status.
- Status can be present, absent, late, or excused.
- The record stores an evidence code.
- Students cannot register their own class attendance.

### US-008 - Submit Teacher Planning
As a teacher, I want to submit my monthly class planning document so that directors can review teaching quality.

Acceptance criteria:
- Teachers can submit monthly class plans.
- A planning record includes month, branch, level, objective, activities, and optional document URL.
- Directors can review submitted plans.

### US-009 - Register Teacher Check-In
As a teacher, I want to register my check-in from the school computer so that my worked hours can be controlled.

Acceptance criteria:
- The teacher attendance station identifies the teacher by email.
- The system records date, expected time, actual check-in, status, duration, and evidence code.
- Late, present, absent, and excused statuses are available for administrative follow-up.

### US-010 - Review Teacher Payroll
As a director, I want to review teacher attendance and payroll so that I can control pending payments.

Acceptance criteria:
- Teacher attendance can be recorded.
- Late or absent records can be highlighted for administrative follow-up.
- Teacher payroll can be calculated using worked hours at USD 12 per class hour.

### US-011 - Access Secure Role Dashboard
As an authenticated user, I want the portal to show only my role modules so that I can work without seeing unauthorized actions.

Acceptance criteria:
- Login uses backend credentials and a signed token.
- The dashboard shows the user's name, role, and avatar/profile image fallback.
- Sign out clears the session and protected pages redirect unauthenticated users to login.
- Dashboard navigation uses canonical URLs.

## Feature 3: Branch Finance and Professional Dancer Agency

### US-012 - Report Branch Finance
As a director, I want to report monthly income and expenses so that branch performance can be reviewed.

Acceptance criteria:
- The branch report includes income, expenses, and net result.
- The system calculates the amount owed to the main branch.
- The director can compare branches.

### US-013 - Track Professional Events for B2 Dancers
As a director, I want to register professional events for B2 dancers so that the academy can keep a history of participation and income.

Acceptance criteria:
- Events include client, type, date, branch, amount, and payment status.
- Dancers can be assigned to events.
- The system stores event history by dancer.

### US-014 - Calculate Dancer Settlement
As a director, I want to calculate dancer payments automatically so that paid events, penalties, and deductions are handled consistently.

Acceptance criteria:
- The calculation includes gross amount.
- The calculation subtracts deductions or penalties.
- The system shows net amount to pay.
