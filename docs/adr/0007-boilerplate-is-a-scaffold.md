# ADR-0007: The boilerplate is a scaffold, not the product

Status: accepted · Date: 2026-10-28
Builds on: ADR-0001
Relates: [README.md](../../README.md), [AGENTS.md](../../AGENTS.md), [resources/docs/README.md](../../resources/docs/README.md)

## Context

The template contains an HR demo: employees, attendance, leave requests,
dashboards, roles, and a visual system. A real product may need none of that.
Keeping a feature only because it is already present makes the product heavier
and the agent slower.

The template still needs its conventions: server-owned behavior, Postgres,
backend authorization, locale handling, tests, and a token layer.

## Decision

- The current screens and domain are examples, not requirements.
- If a feature does not fit the requested product, remove or rework it.
- Keep a convention only while it still serves the product.
- Before deleting, check routes, controllers, migrations, seeders, tests,
  navigation, permissions, shared components, and generated Wayfinder files.
- When the product shape changes, update the affected product docs and add or
  supersede an ADR.
- Run `make lint` and `make test` after the rework. Do not leave a partial
  boilerplate behind.

## Consequences

- No screen or model is sacred.
- A product can become a landing page, an API, or a different domain without
  carrying HR baggage.
- Documentation follows the product instead of preserving a dead demo.
- The agent must state what it removed and why, so the next reader can tell a
  deliberate rework from an accidental deletion.
