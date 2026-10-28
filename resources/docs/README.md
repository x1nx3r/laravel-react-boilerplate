# Application Documentation

Complete flow documentation for the HR employee-management application
(Laravel + Inertia/React). This is the starting point: every document below
describes one domain end to end — data model, backend flow, frontend flow,
permissions, and i18n.

## What this app is

An HR demo application built to satisfy these requirements:

1. Admin can create new employee data (data pegawai baru)
2. Admin can view employee data
3. Admin can update employee data
4. Admin can delete employee data
5. Admin can view an employee-data dashboard with charts: gender comparison
   (bar chart), last education, and employee ages

Plus two bonus modules built on the same foundation:

- **Attendance** — daily check-in / check-out with a personal month calendar
- **Leave requests (cuti)** — submit → HR review → approve/reject, mirrored
  on the calendar

## Stack

| Layer    | Technology                                                             |
| -------- | ---------------------------------------------------------------------- |
| Backend  | PHP ^8.2, Laravel 12, Fortify (auth), spatie/laravel-permission (RBAC) |
| Frontend | React 19, Inertia v2, TypeScript (strict), Tailwind CSS v4, shadcn/ui  |
| Charts   | recharts                                                               |
| Routing  | Laravel routes + Wayfinder (typed controller actions generated to JS)  |
| i18n     | react-i18next (frontend), Laravel lang files (backend flash messages)  |
| DB       | PostgreSQL; sessions/cache/queue in database                           |
| Testing  | PHPUnit 11 (feature + unit)                                            |
| Quality  | Pint (PHP), ESLint + Prettier + tsc --noEmit (JS/TS), Vite build       |

## Document map

| Document                                           | Contents                                                               |
| -------------------------------------------------- | ---------------------------------------------------------------------- |
| [architecture.md](architecture.md)                 | Request lifecycle, project structure, conventions, quality gates       |
| [auth-and-rbac.md](auth-and-rbac.md)               | Login, registration + approval, roles, permissions, enforcement layers |
| [employee-management.md](employee-management.md)   | Employee CRUD (requirements 1–4), fields, documents, verification      |
| [dashboard.md](dashboard.md)                       | Employee-data dashboard (requirement 5), chart data pipeline           |
| [attendance.md](attendance.md)                     | Check-in/check-out, month calendar, HR team view, timezone rules       |
| [leave-requests.md](leave-requests.md)             | Cuti state machine, validation, review queue, calendar effects         |
| [internationalization.md](internationalization.md) | Two-locale system (id/en), where strings live, how to add new ones     |
| [routes-reference.md](routes-reference.md)         | Every route with method, name, middleware, and purpose                 |
| [demo-guide.md](demo-guide.md)                     | Demo accounts, seeded data, step-by-step demo script                   |

## Quick start

```bash
composer install
cp .env.example .env         # then set DB credentials + APP_KEY
php artisan key:generate
php artisan migrate --seed   # creates schema + demo users + demo history
npm install
npm run dev                  # Vite dev server (or: npm run build)
php artisan serve            # http://localhost:8000
```

Notes:

- `.env` sets `APP_TIMEZONE=Asia/Jakarta` — attendance "today" is Jakarta
  today. Do not remove this; date logic depends on it.
- The seeder is idempotent to re-run via `php artisan migrate:fresh --seed`
  (wipes and rebuilds demo data).

## Demo accounts

All demo accounts use password `password`.

| Role       | Email                  | Can do                                                   |
| ---------- | ---------------------- | -------------------------------------------------------- |
| superadmin | superadmin@example.com | Everything: admin CRUD, roles, attendance review, charts |
| hr         | hr@example.com         | Employee CRUD, attendance review, charts (no role mgmt)  |
| user       | user@example.com       | Own attendance, own leave requests (no admin access)     |

The seeder also creates 24 additional demo employees (with roles, gender,
education, birth dates) so the dashboard charts and HR lists have realistic
volume, plus ~1 month of attendance history and two leave requests for the
regular user.
