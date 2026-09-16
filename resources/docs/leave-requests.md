# Leave Requests (Cuti)

A small approval state machine: users submit date ranges with a reason, HR
reviews a pending queue, decisions are stamped and reflected on the
attendance calendar.

## 1. Data model

`leave_requests` (model `App\Models\LeaveRequest`, ULID key):

| Column        | Type      | Notes                                   |
|---------------|-----------|-----------------------------------------|
| user_id       | ULID FK   | constrained                             |
| start_date    | date      |                                         |
| end_date      | date      | must be ≥ start_date                    |
| reason        | text      | required                                |
| status        | string    | `pending` \| `approved` \| `rejected`   |
| reviewed_by   | ULID FK   | nullable, set on review                 |
| reviewed_at   | timestamp | nullable, set on review                 |
| reviewer_note | text      | nullable, optional note from reviewer   |

Constants: `STATUS_PENDING` / `STATUS_APPROVED` / `STATUS_REJECTED`.
Relations: `user()`, `reviewer()` (reviewed_by → User). Scopes: `pending()`,
`covering(date)` (approved, single day), `overlapping(start, end)` (approved,
range). `toPayload()` produces the flat Inertia shape:

```ts
{ id, userId, userName, startDate: 'Y-m-d', endDate: 'Y-m-d',
  reason, status, reviewerNote, reviewedAt: 'Y-m-d H:i'|null, reviewerName }
```

## 2. State machine

```
            ┌────────────► approved   (reviewed_by, reviewed_at, note?)
pending ────┤
            └────────────► rejected   (reviewed_by, reviewed_at, note?)

approved/rejected are terminal — re-review attempts get a flash error.
```

## 3. Routes & permissions

| Method | Path                                | Gate                         | Purpose                    |
|--------|-------------------------------------|------------------------------|----------------------------|
| GET    | `/attendance/leaves`                | auth                         | Own leave requests page    |
| POST   | `/attendance/leaves`                | auth                         | Submit (self)              |
| GET    | `/attendance/leaves/review`         | `permission:view_attendance` | HR pending queue           |
| PUT    | `/attendance/leaves/{leave}/approve`| `permission:view_attendance` | Approve                    |
| PUT    | `/attendance/leaves/{leave}/reject` | `permission:view_attendance` | Reject (with optional note)|

Reviewing is an oversight action (`view_attendance`), deliberately not
`manage_users`.

## 4. Submit flow

```
LeavesSection form (start_date, end_date, reason)
   → useForm → POST /attendance/leaves
   ▼
StoreLeaveRequest rules:
   - start_date: required date
   - end_date:   required, after_or_equal:start_date,
                 + closure rule: reject overlap with the user's other
                   pending OR approved requests
                   (start ≤ new.end AND end ≥ new.start → fail app.leaves.overlap)
   - reason:     required string max:2000
   ▼
create with status = pending → back with success flash
```

Rejected requests do **not** block new overlapping submissions (only
pending/approved do).

## 5. Review flow (HR)

`GET /attendance/leaves/review` → `LeaveRequestController@reviewIndex`:
pending requests with user names, newest first, in a table with Approve /
Reject actions.

- **Approve**: `PUT .../approve` → `review()` guard (must be pending) →
  update `status=approved`, `reviewed_by`, `reviewed_at`, optional `note`
  → flash `app.leaves.approved`.
- **Reject**: opens a dialog with an optional reviewer note, then
  `PUT .../reject` with the same stamping, `status=rejected`.
- Double-review attempt (e.g. two HRs racing) → flash error
  `app.leaves.already_reviewed`, no state change.

## 6. Effects on the calendar

- Approved leave days render as `leave` on the user's own calendar and in
  the HR team view (status precedence: attendance row → approved leave →
  weekend → absent → upcoming).
- Check-in is blocked on any day covered by an approved leave
  (see attendance.md §3).
- Rejected requests never affect the calendar.

## 7. Frontend surfaces

| Surface                                   | Contents                                            |
|-------------------------------------------|-----------------------------------------------------|
| `pages/attendance/page.tsx`               | Today card + calendar + `LeavesSection`             |
| `pages/attendance/leaves/page.tsx`        | Own leaves (same shared `LeavesSection`)            |
| `pages/attendance/leaves/review/page.tsx` | HR pending queue + reject dialog                    |
| `pages/attendance/others/page.tsx`        | Selected user's leaves with status badges           |
| `components/attendance/leaves-section.tsx`| Submit form + `LeavesTable` (shared)                |
| `components/attendance/leaves-table.tsx`  | Dates / reason / status badge / reviewer + note     |
| `components/attendance/leave-status-badge.tsx` | Color-coded pending (amber) / approved (green) / rejected (red) |

## 8. Deliberate scope limits

- No half-day leave, no leave balances/quotas, no attachments.
- Anyone with `view_attendance` (incl. superadmin) can review any request,
  including their own — acceptable for the demo scope.
- No notifications; the review queue is the surface.
