# Laravel React Boilerplate

Opinionated Laravel 12 + Inertia (React 19) boilerplate, extracted from production client work.

## What's inside

- **Backend**: Laravel 12 (PHP ^8.2), Fortify auth (login, password reset, confirm password, 2FA-ready) with custom Inertia views, [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission) for roles/permissions, ULID users
- **RBAC demo**: three seeded roles (`superadmin`, `hr`, `user`), permission-gated routes and sidebar, users + roles management UI, protected superadmin accounts
- **Registration with approval gate**: public self-registration with full HR profile + document uploads; toggleable "require approval" mode (pending accounts can't be used until HR verifies them)
- **Frontend**: Inertia 2 + React 19 + TypeScript, React Compiler, Vite 7 (SSR-ready), Tailwind 4 + shadcn/ui, [Wayfinder](https://github.com/laravel/wayfinder) typed routing
- **i18n**: Indonesian (default) + English — react-i18next on the frontend, Laravel `lang/` files for backend messages, cookie-based locale with a user-menu switcher
- **Layout shell**: sidebar + header layouts, light/dark/system appearance (cookie + middleware), permission-aware navigation
- **Tooling**: Pint, ESLint 9, Prettier, PHPUnit (Postgres test database), GitHub Actions lint workflow
- **Seeders**: three demo accounts, one per role (all with password `password`)

| Account | Email | Role | Permissions |
|---|---|---|---|
| Super Admin | `superadmin@example.com` | `superadmin` | `view_admin`, `manage_users`, `manage_roles` |
| HR Staff | `hr@example.com` | `hr` | `view_admin`, `manage_users` |
| Regular User | `user@example.com` | `user` | none (self-service only) |

## RBAC wiring

- Role/permission definitions live in `app/Support/Rbac.php` — add a role or permission there, then re-seed
- Coarse gate: `permission:view_admin` middleware on the `admin` route group (`routes/web.php`)
- Fine gate: `UserPolicy` / `RolePolicy` per action (e.g. HR can manage users but never superadmin accounts; the `superadmin` role is immutable)
- Sidebar gating: `permissions` / `roles` / `excludeRoles` arrays on nav items (`resources/js/config/navigation.ts`), applied by `filterByPermissions`
- Privilege escalation is blocked at validation level: actors without `manage_roles` cannot assign the `superadmin` role

## Registration flow

- Toggle "Require registration approval" on the Users page (persisted in the `settings` table, gated by `manage_users`)
- **Off**: registration creates an `active` account that can log in immediately
- **On**: registration creates a `pending` account; Fortify's post-registration auto-login is neutralized by `EnsureUserIsApproved` middleware, which bounces the session to the login screen with a clear message; subsequent login attempts show a field error
- HR verifies pending accounts from the Users page (Pending badge → Verify)
- Registered users always get the `user` role — role assignment happens only in provisioning
- Documents upload to the local disk under `storage/app/user-documents/{ulid}` with auto-generated thumbnails for images; download/stream endpoints are permission-gated

## i18n

- Frontend strings live in `resources/js/i18n/locales/{en,id}.json`, consumed via `useTranslation()` — section-scoped keys (`auth.login.title`, `users.form.name`)
- Backend strings live in `lang/{en,id}/` (`app.php` for custom flash messages, core Laravel files for validation/auth/passwords)
- The `locale` cookie is the single source of truth: `HandleLocale` middleware resolves it (cookie → browser language → `APP_LOCALE`) and shares it as the `locale` Inertia prop
- Switch language from the user menu (any page) or the Appearance settings page — both use the `useLocale()` hook
- Adding a locale: add the JSON file, register it in `HandleLocale::LOCALES`, `use-locale.ts`, and add `lang/<locale>/` files

## Requirements

- PHP 8.2+ (PHP 8.4 is used in CI)
- Composer 2
- Node 20+ (Node 22 is the container base)
- PostgreSQL 16+ (the only local database path in this repo)

## Boot a new project

```bash
php bin/rename.php "Client App" client-app
make setup          # dependencies, key, migrate/seed, frontend build
make dev
```

`make setup` uses `.env.example` and assumes PostgreSQL on `127.0.0.1:5432` with database `laravel_boilerplate`, user `postgres`, password `postgres`. Change `.env` for another local instance. MySQL remains supported by Laravel config for downstream adopters, but is not part of this repo’s setup flow.

Agent-specific instructions live in `AGENTS.md`.

## Where things live

| What | Where |
|---|---|
| App routes | `routes/web.php` (settings live in `routes/settings.php`) |
| Navigation + permission gating | `resources/js/config/navigation.ts` |
| Auth flows (rate limiters, views, logout) | `app/Providers/FortifyServiceProvider.php` |
| Auth actions | `app/Actions/Fortify` |
| Route/action middleware aliases | `bootstrap/app.php` (`role`, `permission`, `role_or_permission`) |
| Shared Inertia props (auth, roles, permissions) | `app/Http/Middleware/HandleInertiaRequests.php` |
| Error pages (403/404/419/500/503) | `bootstrap/app.php` + `resources/js/pages/error.tsx` |

Generated Wayfinder files (`resources/js/routes`, `resources/js/actions`, `resources/js/wayfinder`) are gitignored and regenerated by Vite on dev/build — never edit them by hand.

## Not included (deliberately)

Deploy pipeline, release/backup scripts, and metrics/monitoring — these vary per project and host. Pull them from the source project when needed.
