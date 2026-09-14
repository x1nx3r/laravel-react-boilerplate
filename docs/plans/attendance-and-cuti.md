# Feature Plan: Attendance (Check-in/Check-out) + Leave Requests (Cuti)

> Status: **Planned** — not yet implemented.
> This document is the implementation contract for the attendance and leave
> (cuti) demonstration slice. Update it as decisions change.

## Goal

Give every seeded user a daily action (check-in / check-out), a personal month
calendar, and give HR a read-only view of everyone's attendance history. Add a
cuti (leave) request flow that mirrors the existing approval pattern
(pending → reviewed by HR). Together these demonstrate user activity, a
calendar UI, another approval state machine, and RBAC-based data visibility.

## Demo story

1. Log in as a regular user → Attendance page → big Check In button → state
   flips to "Checked in at 08:02" → today's calendar cell turns *in progress*.
2. Check out at the end of the demo day → cell turns *present*.
3. Submit a cuti request for next week with a reason.
4. Log in as HR → user picker on the Attendance page → view anyone's calendar
   (including the fresh check-in) → review the pending cuti → Approve.
5. Back as the user → the approved leave days render on the calendar.
6. (Optional) switch language mid-demo — all of the above flips locale.

## Data model

### `attendances`

| Column        | Type        | Notes                                  |
|---------------|-------------|----------------------------------------|
| id            | ulid PK     |                                        |
| user_id       | foreignUlid | constrained                            |
| date          | date        | unique together with `user_id`         |
| check_in_at   | timestamp   | set on check-in                        |
| check_out_at  | timestamp   | nullable, set on check-out             |
| timestamps    |             |                                        |

One row per user per day (`unique(user_id, date)`). Created by check-in,
updated by check-out.

### `leave_requests`

| Column        | Type        | Notes                                   |
|---------------|-------------|-----------------------------------------|
| id            | ulid PK     |                                         |
| user_id       | foreignUlid | constrained                             |
| start_date    | date        |                                         |
| end_date      | date        | must be >= start_date                   |
| reason        | text        | required                                |
| status        | string      | `pending` \| `approved` \| `rejected`   |
| reviewed_by   | foreignUlid | nullable, set by HR                     |
| reviewed_at   | timestamp   | nullable                                |
| timestamps    |             |                                         |

## Permissions

Add a fourth permission to `App\Support\Rbac`:

- `view_attendance` — read-only reporting: view **other users'** calendars and
  history. Granted to `superadmin` and `hr`.

Separation of concerns: `manage_users` means "can modify accounts";
`view_attendance` means "can read everyone's attendance". A future
report-viewer role can be granted it without gaining account-management.

| Action                                   | Who                              |
|------------------------------------------|----------------------------------|
| View own calendar, check in / check out  | any authenticated user           |
| Submit cuti for self                     | any authenticated user           |
| View other users' calendars + history    | `view_attendance` (hr, superadmin) |
| Approve / reject cuti                    | `view_attendance` (hr, superadmin)|

Note: HR approving/reviewing uses `view_attendance`, not `manage_users` —
reviewing leave is a reporting/oversight action, not account modification.

## Routes

| Method | Path                          | Gate                    | Purpose                          |
|--------|-------------------------------|-------------------------|----------------------------------|
| GET    | `/attendance`                 | `auth`                  | Own month calendar + today card  |
| POST   | `/attendance/check-in`        | `auth`                  | Check in (self)                  |
| POST   | `/attendance/check-out`       | `auth`                  | Check out (self)                 |
| GET    | `/attendance/others/{user}`   | `permission:view_attendance` | Another user's calendar + history |
| GET    | `/attendance/leaves`          | `auth`                  | Own leave requests               |
| POST   | `/attendance/leaves`          | `auth`                  | Submit cuti (self)               |
| GET    | `/attendance/leaves/review`   | `permission:view_attendance` | Pending leave queue (HR)      |
| PUT    | `/attendance/leaves/{leave}/approve` | `permission:view_attendance` | Approve                |
| PUT    | `/attendance/leaves/{leave}/reject`  | `permission:view_attendance` | Reject (with note)     |

## Calendar

- Month grid rendered by hand (no library): weeks × 7 days, prev/next month
  via `?month=YYYY-MM` query param.
- Server computes a per-day status map for the month:
  - `present` — attendance row with check-out
  - `in_progress` — attendance row without check-out (only meaningful today)
  - `leave` — approved leave request covering the day
  - `weekend` — Saturday/Sunday
  - `absent` — past workday with no attendance row and no leave
  - `upcoming` — future day (not yet actionable)
  - `today` is highlighted independently of status.
- Payload per page load: `days` map (date → status), `today` attendance state,
  `leaveRequests` for the user, `month`/`year` navigation bounds.

## Check-in / check-out rules

1. Check-in creates the day's row with `check_in_at = now()`.
2. One check-in per day (unique constraint + friendly error on repeat).
3. Check-out only allowed when today's row exists and has no `check_out_at`.
4. Check-in is blocked on days covered by an **approved** leave request, with a
   clear message ("You are on approved leave today").
5. Forgotten check-outs are left as a visible gap in HR view (no auto-close
   cron) — honest data.
6. No shift schedules / late-minute tracking in this pass.

## Cuti flow

1. User submits a range + reason. Validation: `end_date >= start_date`, no
   overlap with the user's other `pending`/`approved` requests.
2. Request starts `pending`.
3. HR (+ superadmin) sees the pending queue and approves or rejects. Approve
   stamps `reviewed_by`/`reviewed_at` and sets `approved`.
4. Approved leave appears on the user's and HR's calendar as `leave` days.
5. Rejected requests keep their status with the reviewer recorded; they do not
   affect the calendar.

## Seeder ("fat and shiny")

`DatabaseSeeder` (or a dedicated `AttendanceSeeder`) generates history so the
calendar demos populated:

- ~30 days of attendance per demo user: plausible random check-in times
  (07:45–09:15), check-out 8–10h later, occasional whole-day absences,
  weekends left empty.
- 2 leave requests for the regular user: one `approved` (past month), one
  `pending` (next week) — so HR's review queue is never empty.
- Deterministic-ish randomness (seeded) so screenshots stay reproducible.

## Timezone

Attendance is date-sensitive. `.env.example` (and local `.env`) sets
`APP_TIMEZONE=Asia/Jakarta` so "today" is Jakarta-today. Documented in the
boot instructions.

## Pages (React)

| Page                          | Contents                                                        |
|-------------------------------|-----------------------------------------------------------------|
| `attendance/page.tsx`         | Today card (check-in/out) + own month calendar + own cuti list & request form |
| `attendance/others/page.tsx`  | HR: user picker + selected user's calendar + history table + pending queue |

Reuse: `Heading`, `Card`, `Badge`, `Button`, `Table`, calendar grid as a
shared component (`components/attendance/calendar-grid.tsx`) used by both
views. All user-facing strings via i18n keys in both locales
(`attendance.*`, `leaves.*`).

## i18n

New key sections in `resources/js/i18n/locales/{en,id}.json`:
`attendance` (today card, statuses, check-in/out actions and errors) and
`leaves` (request form, statuses, review actions). Backend flash messages go
through `lang/{en,id}/app.php` keys.

## Tests (~10)

- Check-in creates today's row; second check-in fails with a friendly error
- Check-out requires an open row; second check-out fails
- Check-in blocked on approved-leave days
- Calendar payload: statuses for present / absent / leave / weekend days
- Regular user cannot open another user's calendar (403); HR can
- Cuti: validation (end >= start, overlap rejection), submit → pending
- HR approve/reject stamps reviewer and status; approved leave affects the
  calendar payload

## Implementation order

1. Timezone + migrations + models + `Rbac::view_attendance` + re-seed
2. Attendance backend (check-in/out, month payload) + routes
3. Calendar grid component + attendance page (self) + today card
4. HR view (user picker + calendar + history)
5. Leave backend (request/review) + forms + queues
6. Seeder history
7. i18n keys (en + id) swept last across all new surfaces
8. Tests + full verification (pint, tsc, eslint, build, artisan test)

## Out of scope (deliberate)

- Shift schedules, configurable work hours, late/early-minute tracking
- Auto-checkout cron for forgotten check-outs
- Geo-location / device proofing
- Half-day leave, leave balances/quotas
- URL-prefixed i18n for these pages
