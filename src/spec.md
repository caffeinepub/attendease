# Specification

## Summary
**Goal:** Build the ATTENDEASE web app with phone/password authentication for Teacher and Parent roles, enabling teachers to manage classes/students and take attendance, while parents can view linked students’ attendance stats that refresh automatically.

**Planned changes:**
- Create an ATTENDEASE app shell with an English landing page explaining Teacher vs Parent roles and linking to role-specific Sign Up / Log In flows.
- Implement backend persistence (single Motoko actor) for users (teacher/parent), classes, students (including parent phone for linking), and attendance records (per class date, per-student present/absent).
- Add phone number + password sign up/log in for both roles with validation, unique phone enforcement, and salted password hashing (no plaintext storage).
- Add protected, role-specific routing to Teacher Dashboard and Parent Dashboard (prevent cross-role access).
- Teacher Dashboard: create and list classes; within a class, add/list students (student name + parent phone number).
- Attendance flow: select class + date, mark each student present/absent, submit attendance with idempotent save per class+date (update instead of duplicate).
- Parent Dashboard: list linked students by matching parent phone number; for a selected student show attendance percentage, total sessions, total present, total absent, with a clear empty state when no students are linked.
- Add parent-side polling while the dashboard is open to refresh metrics after teachers submit attendance (stop polling on navigation away).
- Apply a consistent, distinctive ATTENDEASE visual theme across all screens (not primarily blue/purple).
- Generate and include static branding images under `frontend/public/assets/generated` and render the logo in the header/landing page (no backend image serving).

**User-visible outcome:** Users can sign up/log in as a Teacher or Parent using phone/password; teachers can create classes, add students, and record attendance by date; parents can log in, see their linked students, and view up-to-date attendance metrics that auto-refresh while the dashboard is open.
