# Routes Reference

All application routes. Fortify-registered auth routes are marked with a
note — their behavior is customized in
`app/Providers/FortifyServiceProvider.php`.

## Public / auth (Fortify)

| Method   | Path                       | Name                  | Purpose                              |
|----------|----------------------------|-----------------------|--------------------------------------|
| GET/POST | `/login`                   | `login`               | Sign-in page / authenticate (5/min throttle; pending & deactivated accounts rejected with messages) |
| POST     | `/logout`                  | `logout`              | End session → redirect `/login`      |
| GET/POST | `/register`                | `register`            | Registration page / create account (employee profile + documents; optional approval) |
| POST     | `/forgot-password`         | `password.email`      | Send reset link                      |
| GET      | `/reset-password/{token}`  | `password.reset`      | Reset form                           |
| POST     | `/reset-password`          | `password.update`     | Apply new password                   |
| GET/POST | `/user/confirm-password`   | `password.confirm.*`  | Password confirmation for sensitive areas |

## Application

| Method | Path | Name | Middleware | Purpose |
|--------|------|------|------------|---------|
| GET | `/` | `dashboard` | auth | Employee-data dashboard (`view_admin` holders; non-admins are redirected to `/attendance`) |

## Settings (auth required — `routes/settings.php`)

| Method | Path | Name | Purpose |
|--------|------|------|---------|
| GET/PATCH/DELETE | `/settings/profile` | `profile.*` | View / update / delete own account |
| GET/PUT | `/settings/password` | `user-password.*` | Change own password (update throttled 6/min) |
| GET | `/settings/appearance` | `appearance.edit` | Theme + language preferences |

## Admin (auth + `permission:view_admin`, prefix `/admin`, names `admin.*`)

| Method | Path | Name | Extra gate | Purpose |
|--------|------|------|------------|---------|
| GET | `/admin/users` | `admin.users.index` | manage_users (policy) | Employee list |
| GET/POST | `/admin/users/create`, `/admin/users` | `admin.users.create/store` | manage_users (policy) | Create employee |
| GET/PUT/DELETE | `/admin/users/{user}` (edit) | `admin.users.edit/update/destroy` | manage_users (policy) | Edit / delete employee |
| PUT | `/admin/users/{user}/verify` | `admin.users.verify` | policy (pending only) | Activate pending account |
| POST | `/admin/users/{user}/documents` | `admin.users.documents.store` | policy | Upload documents |
| GET | `/admin/users/{user}/documents/{document}` | `admin.users.documents.show` | policy | Stream document (`?thumbnail=1`) |
| DELETE | `/admin/users/{user}/documents/{document}` | `admin.users.documents.destroy` | policy | Delete document |
| GET/POST/PUT/DELETE | `/admin/roles…` | `admin.roles.*` | manage_roles (policy) | Roles & permissions CRUD |
| PUT | `/admin/settings/registration-approval` | `admin.settings.registration-approval.update` | view_admin | Toggle registration approval |

## Attendance (prefix `/attendance`, names `attendance.*`, auth required)

| Method | Path | Name | Extra gate | Purpose |
|--------|------|------|------------|---------|
| GET | `/attendance` | `attendance.index` | — | Own today card + month calendar + own leaves |
| POST | `/attendance/check-in` | `attendance.check-in` | — | Check in (self) |
| POST | `/attendance/check-out` | `attendance.check-out` | — | Check out (self) |
| GET | `/attendance/others/{user}` | `attendance.others` | `permission:view_attendance` | HR team view for one user |
| GET | `/attendance/leaves` | `attendance.leaves.index` | — | Own leave requests |
| POST | `/attendance/leaves` | `attendance.leaves.store` | — | Submit leave request |
| GET | `/attendance/leaves/review` | `attendance.leaves.review` | `permission:view_attendance` | Pending review queue (HR) |
| PUT | `/attendance/leaves/{leave}/approve` | `attendance.leaves.approve` | `permission:view_attendance` | Approve |
| PUT | `/attendance/leaves/{leave}/reject` | `attendance.leaves.reject` | `permission:view_attendance` | Reject (optional note) |

## Frontend URL generation

Wayfinder mirrors these into `resources/js/actions/…` and
`resources/js/routes/…` at dev/build time. Prefer
`AttendanceController.checkIn().url` / `route`-style imports over hard-coded
paths; run `npm run dev` or `npm run build` after changing routes so the
generated files (and `tsc`) pick them up.
