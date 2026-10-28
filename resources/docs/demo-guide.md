# Demo Guide

Everything needed to present the application: accounts, what the seeder
creates, and a step-by-step demo script covering all five exam requirements
plus the bonus modules.

## 1. Reset to a clean demo state

```bash
php artisan migrate:fresh --seed
```

This rebuilds the schema, RBAC rows, demo accounts, 24 extra employees,
attendance history, and leave requests. (Note: it also wipes any live
check-ins/leave submissions made during previous runs.)

Make sure `.env` contains `APP_TIMEZONE=Asia/Jakarta`, then run
`php artisan serve` (and `npm run dev`, or `npm run build` beforehand).

## 2. Accounts (password for all: `password`)

| Account      | Email                  | Role       | Login outcome                                       |
| ------------ | ---------------------- | ---------- | --------------------------------------------------- |
| Super Admin  | superadmin@example.com | superadmin | Full access incl. role management                   |
| HR Staff     | hr@example.com         | hr         | Employee CRUD + attendance/leave review + dashboard |
| Regular User | user@example.com       | user       | Own attendance + leaves only                        |

Seeded data highlights:

- 27 users total: 3 named accounts + 24 generated employees with gender,
  education level, birth dates, departments, contract status.
- Regular user has ~1 month of attendance history (weekends off, occasional
  absences, a few forgotten check-outs that intentionally show as gaps) and
  two leave requests: one **approved** (past, visible as `leave` calendar
  days) and one **pending** (next week — keeps the HR queue non-empty).
- The three named accounts have no gender/birth date/education set — useful
  to show the dashboard excludes unknown values.

## 3. Demo script

### A. Requirements 1–4: employee CRUD (login as HR)

1. Sidebar → **Administration → Employees** (`/admin/users`).
2. **View**: show the list — search, filters (role, approval, state,
   department, contract), status badges, pagination.
3. **Create**: _Create employee_ — fill account section, employee data
   (NIK, gender, birth date, **Pendidikan Terakhir** select, education,
   contract), optionally upload a document → save → flash "Employee
   created." and the list shows the new row.
4. **Update**: open the new employee → change department or education level
   → save → flash "Employee updated."
5. **Delete**: delete the same test employee → confirmation dialog → gone.

### B. Requirement 5: dashboard

1. Sidebar → **Dashboard** (`/`).
2. Show the total-employee card and the three bar charts:
    - **By gender** — Laki-laki vs Perempuan counts,
    - **By last education** — SMA…S3 distribution,
    - **By age** — age-group buckets.
3. Switch language in the user menu (id ↔ en) — every label flips, charts
   included. Dark mode also restyles the charts.

### C. Bonus: attendance (login as Regular User)

1. Sidebar → **Attendance** — today card shows the big **Check in** button.
2. Click Check in → card flips to "Checked in at HH:MM", today's calendar
   cell turns amber (_in progress_).
3. Click **Check out** → cell turns green (_present_).
4. Browse previous months with the chevrons — history, weekend shading,
   blue `leave` days from the approved request, red `absent` gaps.
5. Submit a leave request for next week in the _Request leave_ card
   (it must not overlap the existing pending one — that's the validation).

### D. Bonus: HR review (login as HR)

1. Sidebar → **Attendance → Team attendance** button on the Attendance page
   (or the leave-review sidebar entry).
2. Team view: pick any user → their calendar, paginated history (note the
   amber "No check-out" gaps), and their leave requests.
3. **Review queue**: approve the request submitted in step C5 (or reject
   with a note via the dialog).
4. Log back in as the regular user — if approved, the covered days now
   render blue `leave` on the calendar, and check-in is blocked on the
   leave's start day with a friendly message.

### E. Security highlights (optional, if asked)

- Log in as the regular user and try `/admin/users` → 403 error page.
- The sidebar hides admin entries for regular users (backend enforces it
  anyway — UI gating is cosmetic).
- Pending/deactivated accounts cannot log in and are bounced mid-session.
