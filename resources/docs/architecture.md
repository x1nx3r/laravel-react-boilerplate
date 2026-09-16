# Architecture & Conventions

How a request becomes a page, how the codebase is organized, and the
conventions every new feature follows.

## 1. Request lifecycle (Inertia flow)

```
Browser ── GET /attendance ──► Laravel router
                                  │  middleware: web, auth, (permission:*)
                                  ▼
                            Controller method
                                  │  builds a plain PHP array of props
                                  ▼
                            Inertia::render('attendance/page', $props)
                                  │
             first visit ─────────┤────────────── X-Inertia: true
                                  ▼                       ▼
                     full HTML page (app.blade.php)   JSON {component, props}
                                  │                       │
                                  ▼                       ▼
                     React hydrates                 Inertia swaps props in
                     resources/js/pages/attendance/page.tsx
```

- **Page resolution**: `resources/js/app.tsx` resolves component names with
  `import.meta.glob('./pages/**/*.tsx')`. The string `'attendance/page'`
  maps to `resources/js/pages/attendance/page.tsx`. Convention: every page
  lives at `pages/<area>/<name>/page.tsx`.
- **Shared props** (`app/Http/Middleware/HandleInertiaRequests.php`) are sent
  with every response: `name`, `locale`, `auth` (user + permissions + roles),
  `sidebarOpen`, `flash` (`success` / `error`). Frontend type declarations
  live in `resources/js/types/global.d.ts`.
- **Mutations** (POST/PUT/DELETE) redirect back (`back()->with('success'|'error', …)`);
  Inertia follows the redirect and re-fetches page props, so pages update
  without manual state juggling. Flash messages are rendered by the
  `StatusMessage` component.

## 2. URL generation: Wayfinder

Wayfinder (`@laravel/vite-plugin-wayfinder`) generates typed JS modules that
mirror PHP controllers:

- `app/Http/Controllers/Attendance/AttendanceController.php`
  → `resources/js/actions/App/Http/Controllers/Attendance/AttendanceController.ts`
  exporting `index()`, `checkIn()`, `others({ user })`, …
- Named routes without controllers (login, register, …) → `resources/js/routes/*`.

Usage: `AttendanceController.checkIn().url` instead of hard-coded URLs.
The files regenerate on `npm run dev` / `npm run build` — after adding a
route, run one of those before `tsc` will see the new action.

## 3. Backend layout

```
app/
├── Actions/Fortify/         # Fortify hooks: CreateNewUser, ResetUserPassword
├── Concerns/                # Shared trait logic
│   ├── UserAttributeRules.php   # employee field validation + extraction
│   ├── SavesUserDocuments.php   # document upload storage + thumbnails
│   ├── PasswordValidationRules.php
│   └── ProfileValidationRules.php
├── Http/
│   ├── Controllers/
│   │   ├── Admin/               # UserController, RoleController, RegistrationSettingController
│   │   ├── Attendance/          # AttendanceController, LeaveRequestController
│   │   ├── DashboardController.php
│   │   └── Settings/            # profile, password
│   ├── Middleware/              # HandleLocale, EnsureUserIsApproved, HandleAppearance, …
│   └── Requests/                # FormRequests (Admin/, Attendance/, Settings/)
├── Models/                      # User, UserDocument, Setting, Attendance, LeaveRequest
├── Policies/                    # UserPolicy, RolePolicy (registered in AppServiceProvider)
└── Support/Rbac.php             # single source of truth for roles + permissions
```

Model conventions:

- ULID primary keys via the `HasUlids` trait (`User`, `Attendance`,
  `LeaveRequest`); `UserDocument` uses an auto-increment id with a ULID
  foreign key.
- Mass assignment uses `$fillable` (never `$guarded`).
- Date casts use the `casts()` method; dates that must serialize as plain
  strings use the `date:Y-m-d` cast.
- Domain statuses are class constants (`User::STATUS_PENDING`,
  `LeaveRequest::STATUS_APPROVED`, …).
- Query scopes encapsulate reusable filters (`scopeForMonth`, `scopeCovering`,
  `scopeOverlapping`, `scopePending`).
- `LeaveRequest::toPayload()` produces the flat, timezone-explicit shape sent
  to Inertia (formatted `Y-m-d` / `H:i` strings so the browser never
  re-localizes server times).

## 4. Frontend layout

```
resources/js/
├── actions/            # Wayfinder-generated controller actions (do not edit)
├── routes/             # Wayfinder-generated named routes (do not edit)
├── components/
│   ├── attendance/     # calendar-grid, today-card, leaves-section, leaves-table,
│   │                   # leave-status-badge (shared across attendance pages)
│   ├── common/         # heading, status-message, input-error, pagination, …
│   ├── sidebar/        # app-sidebar, nav-main (permission filtering lives here)
│   ├── ui/             # shadcn/radix primitives (button, card, table, dialog, …)
│   └── user/           # user menu (locale switcher, profile links)
├── config/navigation.ts  # sidebar menu definition (titles are i18n keys)
├── hooks/              # use-locale.ts
├── i18n/               # i18n setup + locales/en.json + locales/id.json
├── layouts/            # app-layout (sidebar shell), auth layouts, settings layout
├── lib/utils.ts        # cn() class merger
└── pages/              # one folder per route segment, entry file is page.tsx
```

Page conventions:

- Props interface declared inline in the page file (`interface XProps { … }`);
  shared entity types live in `resources/js/types/`.
- Wrap in `<AppLayout breadcrumbs={…}>`, set `<Head title>`.
- Forms use `useForm` from Inertia; per-field errors via
  `<InputError message={errors.field} />`.
- Permission-aware UI reads `usePage().props.auth.permissions` — e.g.
  `(auth.permissions ?? []).includes('view_attendance')`.
- Styling: Tailwind v4 semantic tokens (`bg-card`, `text-muted-foreground`,
  `border`, `text-destructive`), dark mode via class variant, icons from
  lucide (`size-4`).

## 5. Navigation & permission-gated menus

`resources/js/config/navigation.ts` defines `mainNavItems` and
`adminNavItems`. Items may declare `permissions`, `roles`, `excludeRoles`;
`app-sidebar.tsx` (`filterByPermissions`) hides items the current user
cannot use. Titles are i18n keys resolved by `nav-main.tsx`.

## 6. Validation patterns

- **FormRequest classes** for primary create/update flows
  (`app/Http/Requests/Admin/StoreUserRequest`, `Attendance/StoreLeaveRequest`, …).
  `authorize()` returns `true` — authorization happens in policies.
- **Inline `$request->validate([...])`** for small secondary actions.
- Employee-attribute rules are centralized in the `UserAttributeRules`
  trait so registration, admin create, and admin edit share one definition.

## 7. Error handling

`bootstrap/app.php` renders `resources/js/pages/error.tsx` for 403/404/500/503
with translated titles, and bounces CSRF failures (419) back with a message.
`EnsureUserIsApproved` logs out sessions whose account becomes pending or
deactivated mid-session.

## 8. Timezone

`config/app.php` reads `APP_TIMEZONE` (set to `Asia/Jakarta`). All "today"
logic — check-in, calendar status computation, seeder history — uses the
application timezone so the demo behaves as wall-clock Jakarta time. Time
values sent to the frontend are pre-formatted strings (`H:i`) to avoid
browser-timezone drift.

## 9. Quality gates

Run before finishing any change:

```bash
vendor/bin/pint --dirty     # PHP style (auto-fix)
npm run types               # tsc --noEmit
npm run lint                # eslint --fix
npm run build               # vite production build (also regenerates Wayfinder)
php artisan test            # PHPUnit feature + unit suites
```
