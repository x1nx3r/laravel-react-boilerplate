# Attendance (Check-in / Check-out + Calendar)

Daily attendance for every authenticated user, a personal month calendar,
and a read-only HR team view. Demonstrates: per-user daily state, a
hand-rolled calendar with server-computed statuses, and RBAC-based data
visibility (`view_attendance`).

## 1. Data model

`attendances` (model `App\Models\Attendance`, ULID key):

| Column       | Type      | Notes                              |
|--------------|-----------|------------------------------------|
| user_id      | ULID FK   | constrained                        |
| date         | date      | **unique together with user_id**   |
| check_in_at  | timestamp | set on check-in                    |
| check_out_at | timestamp | nullable, set on check-out         |

One row per user per day. Created by check-in, updated by check-out.
Relations: `User::attendances()` hasMany; scopes `scopeForMonth(Y, m)`.

## 2. Routes & permissions

| Method | Path                        | Gate                        | Purpose                       |
|--------|-----------------------------|-----------------------------|-------------------------------|
| GET    | `/attendance`               | auth                        | Own calendar + today card     |
| POST   | `/attendance/check-in`      | auth                        | Check in (self)               |
| POST   | `/attendance/check-out`     | auth                        | Check out (self)              |
| GET    | `/attendance/others/{user}` | `permission:view_attendance`| HR team view for one user     |

## 3. Check-in flow

```
POST /attendance/check-in  (AttendanceController@checkIn)
   1. approved leave covering today?  → back with error app.attendance.on_leave
      (LeaveRequest::scopeCovering — status approved, start ≤ today ≤ end)
   2. create row { date: today, check_in_at: now() }
      race-safe: unique(user_id, date) → catch UniqueConstraintViolationException
      → back with error app.attendance.already_checked_in
   3. otherwise success flash; page props reload via Inertia redirect
```

Rules: one check-in per day (enforced twice: guard + DB constraint);
check-in is blocked on approved-leave days with a clear message; no late
minutes / shift logic by design.

## 4. Check-out flow

```
POST /attendance/check-out  (AttendanceController@checkOut)
   1. today's row exists?                no → error "not checked in"
   2. row already has check_out_at?      yes → error "already checked out"
   3. else update check_out_at = now(); success flash
```

Forgotten check-outs are never auto-closed — past days with an open row
show as `in_progress` forever ("honest data"; visible as a gap in HR view).

## 5. Today card state (`todayState()`)

```ts
{ date: 'Y-m-d', onLeave: bool, checkIn: 'H:i'|null, checkOut: 'H:i'|null }
```

Frontend (`components/attendance/today-card.tsx`) renders:

- `onLeave` → info message, no buttons
- no checkIn → big "Check in" button
- checkIn, no checkOut → "Checked in at HH:MM" + "Check out" button
- checkIn + checkOut → "Checked out at HH:MM" (done for today)

## 6. Month calendar

`GET /attendance?month=YYYY-MM` (validated; falls back to current month).

Status computation order per day (server-side, `calendar()`):

1. attendance row exists → `present` (has check-out) or `in_progress`
2. approved leave covers the day → `leave` (scope `overlapping` on the
   month range)
3. Saturday/Sunday → `weekend`
4. past workday, no record → `absent`
5. future day → `upcoming`
6. today with no record → unmarked (neutral cell; the today card carries
   the action; today is also ring-highlighted in the grid)

Payload:

```ts
{ year, month,            // viewed month
  prev, next,             // 'YYYY-MM' navigation bounds
  today,                  // 'Y-m-d'
  days: Record<'Y-m-d', 'present'|'in_progress'|'leave'|'weekend'|'absent'|'upcoming'> }
```

The shared `components/attendance/calendar-grid.tsx` renders a Monday-first
grid (weekday/month names via `Intl` with the active locale), prev/next
month links (`?month=`), a color legend, and the today ring. It is reused
by the self page and the HR team view.

## 7. HR team view (`attendance/others/page.tsx`)

`GET /attendance/others/{user}` — gated by `permission:view_attendance`:

- User picker (all users; selecting navigates via Wayfinder action)
- Selected user's month calendar (same `calendar()` builder)
- Paginated attendance history (`latest('date')`, 10/page, mapped to
  `{ date, checkIn, checkOut }`; open check-outs highlighted "No check-out")
- The user's leave requests with status badges

HR reaches it from the Attendance page ("Team attendance" button) and the
sidebar (Leave review entry is `view_attendance`-gated too).

## 8. Timezone

`APP_TIMEZONE=Asia/Jakarta` (config/app.php reads it). `today()` / `now()`
are Jakarta wall-clock; times are sent as pre-formatted `H:i` strings so
every browser shows identical values.
