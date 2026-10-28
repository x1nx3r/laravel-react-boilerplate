# ADR-0003: PostgreSQL is the only local database

Status: accepted · Date: 2026-10-28
Builds on: ADR-0001
Relates: [architecture.md](../../resources/docs/architecture.md), `AGENTS.md`, `Makefile`

## Context

The template previously supported SQLite as a convenience path. That made
local setup differ from production and hid Postgres-specific behavior. Tests
could pass on a database the product would never run.

The template now runs in a container with a local Postgres service. There is
no reason to keep a second development database.

## Decision

- Development and tests use PostgreSQL only.
- `make setup`, `make test`, and the documented demo path target Postgres.
- Tests use `laravel_boilerplate_test`; never the development database.
- MySQL may remain in `config/database.php` for downstream adopters, but this
  repository does not ship a MySQL setup path.
- Do not add SQLite migrations, fixtures, or setup steps.

## Consequences

- Local behavior matches the documented production database family.
- The test database must be created before tests run; the Makefile owns that.
- A downstream product that needs MySQL must add its own migration and test
  path, and record why in a new ADR.
