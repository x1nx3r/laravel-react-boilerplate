# Laravel React Boilerplate — agent guide

This is a Laravel 12 + Inertia React 19 application. Treat it as the product,
not as a collection of generated files.

## Before you build

1. Read `README.md` and this file.
2. Ask what is being changed and who uses it.
3. For cross-cutting or irreversible decisions, write an ADR under `docs/adr/`.
4. Work in a small scope. Do not mix unrelated refactors with a feature.

## Map

| Need | Read |
|---|---|
| App routes | `routes/web.php`, `routes/settings.php` |
| Auth and profile flows | `app/Providers/FortifyServiceProvider.php`, `app/Actions/Fortify` |
| RBAC | `app/Support/Rbac.php`, policies under `app/Policies` |
| Shared Inertia state | `app/Http/Middleware/HandleInertiaRequests.php` |
| Pages and layouts | `resources/js/pages`, `resources/js/layouts` |
| Navigation and permissions | `resources/js/config/navigation.ts` |
| Localization | `lang/`, `resources/js/i18n/locales/` |
| Tests | `tests/Feature`, `tests/Unit` |
| Database | `database/migrations`, `database/seeders` |

Wayfinder files under `resources/js/{actions,routes,wayfinder}` are generated.
Do not edit them by hand. Vite regenerates them during dev/build.

## Environment and commands

Postgres is the only local database for this repo. Do not add a second development or test database path.

```sh
make setup              # install, migrate/seed Postgres, build frontend
make dev                # PHP server + queue + Vite
make test               # PHPUnit against laravel_boilerplate_test
make lint               # Pint check, Prettier check, TypeScript
make format             # apply Pint and Prettier
make build              # production frontend build
```

The app listens on `http://localhost:8000` by default. The browser tool should
use that URL after `make dev`.

Demo accounts use password `password`:

- `superadmin@example.com`
- `hr@example.com`
- `user@example.com`

## Database rules

- Postgres is the default and the only agent database path.
- MySQL remains available in `config/database.php` for downstream adopters, but
  this repo does not ship a MySQL setup path.
- Keep one database model across setup and tests.
- Never point a test command at a database with data you need. The Postgres test
  configuration uses `laravel_boilerplate_test`.
- Do not put database passwords, API keys, or tokens in tracked files.
  Environment values belong in `.env`, which is ignored.

## Change rules

- Keep Laravel business rules in the backend. React renders and calls the
  backend; it does not own persistence or authorization.
- Reuse the existing Inertia/React patterns rather than adding a second state
  layer.
- Use Wayfinder routes/actions where the project already uses them.
- Add or update a feature test when behavior changes.
- Run `make lint` and `make test` before calling the change done.
- If a frontend change affects the visible shell, check the relevant route in
  the browser at desktop and narrow widths.

## Secrets

The image and repository carry names only. Inject values at runtime. Do not
commit `.env`, `storage/` artifacts, uploaded documents, or generated build
output.
