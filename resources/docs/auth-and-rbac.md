# Authentication & RBAC

How users get in, how accounts are gated, and how roles/permissions control
everything they can do afterwards.

## 1. Login flow

Fortify owns the endpoints; behavior is customized in
`app/Providers/FortifyServiceProvider.php`.

```
GET /login  →  Inertia page auth/login/page
POST /login (Fortify)
   │  rate limited: 5 attempts / minute per email|ip
   ▼
Fortify::authenticateUsing closure
   1. find user by email, Hash::check password
   2. status === pending     → validation error "account awaiting verification"
   3. is_active === false    → validation error "account deactivated"
   4. otherwise              → user is logged in (session guard)
   ▼
redirect to intended page (default /)
```

- Session driver: `database`. Logout redirects to `/login`
  (custom `LogoutResponse`).
- Password confirmation for sensitive actions uses Fortify's
  `/user/confirm-password`.
- Password reset: request link → email (log mailer by default) →
  `POST /reset-password` via `ResetUserPassword`.

## 2. Session protection: EnsureUserIsApproved

`app/Http/Middleware/EnsureUserIsApproved.php` runs on every web request.
If the logged-in account becomes `pending` or `is_active = false`
mid-session (e.g. HR just deactivated them), the middleware logs them out,
invalidates the session, and redirects to `/login` with a translated status
message. Defense in depth with the login-time checks above.

## 3. Registration flow (self-service)

```
GET /register → auth/register/page (full employee profile form + documents)
POST /register
   ▼
App\Actions\Fortify\CreateNewUser::create()
   validation:
     - profileRules()          (name, email, …)
     - passwordRules()
     - userAttributeRules()    (employee fields incl. education_level)
     - documentRules()         (files ≤ 10 MB each)
   then:
     - User::create(...) with:
         status = Setting::requireRegistrationApproval() ? pending : active
     - assignRole('user')
     - saveUserDocuments() if files attached
   ▼
pending accounts: cannot log in until HR verifies (see §5)
```

The "require registration approval" toggle is an HR-controlled setting
(`RegistrationSettingController`, stored in the `settings` table).

## 4. Roles & permissions registry

`app/Support/Rbac.php` is the single source of truth. `DatabaseSeeder`
derives the actual `Permission` / `Role` rows (spatie) from it.

| Role       | Permissions                                                     |
| ---------- | --------------------------------------------------------------- |
| superadmin | `view_admin`, `manage_users`, `manage_roles`, `view_attendance` |
| hr         | `view_admin`, `manage_users`, `view_attendance`                 |
| user       | (none)                                                          |

Permission semantics:

- `view_admin` — can open the `/admin` area and the employee dashboard.
- `manage_users` — can create/update/verify/delete employee accounts.
- `manage_roles` — can manage roles and assign the superadmin role.
- `view_attendance` — read-only oversight: view other users' calendars and
  history, approve/reject leave. Deliberately separate from `manage_users`
  so a future report-viewer role could be added without account management.

## 5. Verification (pending → active)

HR sees pending accounts in the admin employee list (amber "pending" badge +
Verify button). `PUT /admin/users/{user}/verify` → `UserPolicy@verify`
(requires `status === pending`) → sets `status = active`. Verified accounts
can log in.

## 6. Enforcement — four layers

| Layer            | Where                                                 | Example                                                            |
| ---------------- | ----------------------------------------------------- | ------------------------------------------------------------------ |
| Route middleware | `routes/web.php` — `permission:view_admin`            | whole `/admin` group; `attendance/others`                          |
| Policies         | `app/Policies/*`, `$this->authorize()` in controllers | update/delete user, verify pending                                 |
| Controller logic | guard clauses before writes                           | cannot delete yourself; cannot edit a superadmin unless superadmin |
| Frontend UI      | shared `auth.permissions`/`auth.roles` props          | sidebar filtering; hiding actions/buttons                          |

Frontend gating is UX only — the backend layers are the real security
boundary. The shared props come from `HandleInertiaRequests`
(`getAllPermissions()->pluck('name')` and `getRoleNames()`).

Superadmin protection specifics (`UserPolicy` + `UserController`):

- Non-superadmins cannot update/delete superadmin accounts (`canManage`).
- Only `manage_roles` holders may assign the superadmin role
  (`assignableRoles()` + `StoreUserRequest` rule).
- Self-service guard: you cannot change your own role, deactivate yourself,
  or delete your own account.
- `RolePolicy` prevents deleting roles that still have users.
