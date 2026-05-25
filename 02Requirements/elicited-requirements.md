# American Latin Class - Elicited Requirements And Initial Functional Context

Base context: the initial multi-branch web system proposal for American Latin Class.

This document turns the initial business proposal into a product context and a first version of elicited software requirements. The detailed canonical requirement set is maintained in `requirements.md`, `user-stories.md`, and `project-backlog.md`.

## Business Context

American Latin Class operates as a multi-branch dance academy with a related professional dancer agency.

The academy side needs to manage:

- Students.
- Branches.
- Classes and levels.
- Attendance.
- Monthly payments.
- Scholarships and agreements.
- Branch-level operations.

The agency side needs to manage:

- Clients.
- Contracts.
- Events.
- Amounts.
- Commissions.
- Payments.
- Dancer settlements.

## Branches Mentioned

- Matrix.
- North.
- Quitumbe.
- Conocoto.
- Tumbaco.

## Current Problems

1. There is no single reliable source of truth for active students by branch.
2. Monthly payments, scholarships, and late balances are not controlled with one standard process.
3. Branch income and expenses are registered with different criteria.
4. Percentages, salaries, and settlement amounts are calculated manually.
5. Attendance does not have consistent evidence.
6. The agency area does not have enough traceability for commissions, payments, and event status.

## Product Vision

The system should become a centralized multi-branch web platform for operational control, financial tracking, and scalable academy management.

It should support:

- Centralized operation across all branches.
- Real-time indicators by branch and at consolidated level.
- Student, class, payment, scholarship, attendance, income, expense, and portfolio control.
- Commission, percentage, and settlement calculations.
- Agency contracts and event tracking.
- Traceability and audit support for future growth.

## Main Objective

Build a multi-branch web platform that centralizes operations and provides performance indicators to improve control, transparency, and scalability.

## Specific Objectives

1. Centralize students, levels, classes, attendance, and student financial status.
2. Automate monthly payment generation and follow-up.
3. Control branch income and expenses.
4. Configure salary, percentage, and settlement rules.
5. Track professional events and B2 dancer payments.
6. Improve operational evidence through attendance codes and audit logs.
7. Separate public enrollment, internal dashboards, and protected backend operations.

## Implemented Scope

The current implementation covers the selected academic MVP:

- Public landing page.
- Public enrollment request.
- Backend enrollment validation.
- Login with hashed passwords and signed tokens.
- Role-based teacher, student, and director dashboards.
- Teacher-controlled student attendance records.
- Teacher attendance station for school-computer check-in.
- Monthly student attendance summary.
- Student profile photo upload.
- Teacher class planning.
- Manual attendance registration.
- Branch finance report registration.
- B2 professional event registration.
- B2 dancer assignment and settlement summary.

## Architecture Direction

The code is organized with an MVC structure under `06Code`:

- `Model`: Eloquent domain models.
- `View`: HTML, CSS, and JavaScript pages.
- `Controller`: Slim API, route definitions, middleware, services, and support classes.
